(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.BWFootballEngine = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var STATUS_ORDER = {
    'current-programme': 5,
    regular: 4,
    selected: 3,
    'ask-first': 2,
    unknown: 1
  };

  function normalize(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function competitionById(data, competitionId) {
    return (data.competitions || []).find(function (competition) {
      return competition.id === competitionId;
    }) || null;
  }

  function venueById(data, venueId) {
    return (data.venues || []).find(function (venue) {
      return venue.id === venueId;
    }) || null;
  }

  function coverageFor(venue, competitionId) {
    if (!venue || !venue.coverage || !venue.coverage[competitionId]) {
      return {
        status: 'unknown',
        evidence: 'No current official evidence was recorded in this check.'
      };
    }
    return venue.coverage[competitionId];
  }

  function statusFor(data, statusId) {
    var fallback = {
      label: 'Unknown',
      shortLabel: 'Unknown',
      description: 'No current official evidence was recorded in this check.'
    };
    return data.statuses && data.statuses[statusId] ? data.statuses[statusId] : fallback;
  }

  function namedCompetitionText(data, venue) {
    return (data.competitions || []).filter(function (competition) {
      return coverageFor(venue, competition.id).status !== 'unknown';
    }).map(function (competition) {
      return [competition.label].concat(competition.aliases || []).join(' ');
    }).join(' ');
  }

  function venueSearchText(data, venue) {
    return normalize([
      venue.name,
      venue.shortName,
      venue.area,
      venue.address,
      venue.station,
      venue.venueStatus,
      venue.reservationPolicy,
      (venue.facts || []).join(' '),
      (venue.cautions || []).join(' '),
      namedCompetitionText(data, venue)
    ].join(' '));
  }

  function filterVenues(data, options) {
    var settings = options || {};
    var query = normalize(settings.query);
    var queryTerms = query ? query.split(' ') : [];
    var competitionId = settings.competitionId || 'all';
    var rows = (data.venues || []).filter(function (venue) {
      var searchable = venueSearchText(data, venue);
      var searchMatch = !queryTerms.length || queryTerms.every(function (term) {
        return searchable.indexOf(term) !== -1;
      });
      var competitionMatch = competitionId === 'all' || coverageFor(venue, competitionId).status !== 'unknown';
      return searchMatch && competitionMatch;
    });

    return rows.slice().sort(function (left, right) {
      if (competitionId !== 'all') {
        var leftRank = STATUS_ORDER[coverageFor(left, competitionId).status] || 0;
        var rightRank = STATUS_ORDER[coverageFor(right, competitionId).status] || 0;
        if (leftRank !== rightRank) return rightRank - leftRank;
      }
      if ((left.priority || 999) !== (right.priority || 999)) {
        return (left.priority || 999) - (right.priority || 999);
      }
      return left.name.localeCompare(right.name);
    });
  }

  function countStatuses(data, venues, competitionIds) {
    var counts = {
      'current-programme': 0,
      regular: 0,
      selected: 0,
      'ask-first': 0,
      unknown: 0
    };
    (venues || []).forEach(function (venue) {
      (competitionIds || []).forEach(function (competitionId) {
        var status = coverageFor(venue, competitionId).status;
        counts[status] = (counts[status] || 0) + 1;
      });
    });
    return counts;
  }

  function validationError(errors, message) {
    return errors.concat(message);
  }

  function validHttps(value) {
    return typeof value === 'string' && /^https:\/\//.test(value);
  }

  function validOfficialLink(value, venue) {
    if (validHttps(value)) return true;
    return venue.id === 'fc-magnet'
      && venue.venueStatus === 'STALE_UNKNOWN'
      && /^http:\/\/fcmagnetbar\.de\/demnaechst$/.test(value);
  }

  function validateData(data) {
    var errors = [];
    if (!data || typeof data !== 'object') return ['Data must be an object.'];
    if (!data.meta || data.meta.checkedAt !== '2026-08-27') {
      errors = validationError(errors, 'meta.checkedAt must be 2026-08-27.');
    }
    if (!Array.isArray(data.competitions) || data.competitions.length !== 5) {
      errors = validationError(errors, 'Exactly five competition columns are required.');
    }
    if (!Array.isArray(data.venues) || data.venues.length !== 8) {
      errors = validationError(errors, 'Exactly eight verified venue records are required.');
    }

    var competitionIds = (data.competitions || []).map(function (competition) {
      return competition.id;
    });
    if (competitionIds.some(function (id, index) { return competitionIds.indexOf(id) !== index; })) {
      errors = validationError(errors, 'Competition IDs must be unique.');
    }

    var venueIds = (data.venues || []).map(function (venue) { return venue.id; });
    if (venueIds.some(function (id, index) { return venueIds.indexOf(id) !== index; })) {
      errors = validationError(errors, 'Venue IDs must be unique.');
    }

    (data.venues || []).forEach(function (venue) {
      if (!venue.id || !venue.name) errors = validationError(errors, 'Every venue needs an ID and name.');
      if (venue.checkedAt !== '2026-08-27') {
        errors = validationError(errors, venue.id + ' has the wrong checkedAt date.');
      }
      if (!validOfficialLink(venue.officialUrl, venue) || !validOfficialLink(venue.programmeUrl, venue)) {
        errors = validationError(errors, venue.id + ' needs official HTTPS links or the documented FC Magnet fallback.');
      }
      competitionIds.forEach(function (competitionId) {
        var coverage = coverageFor(venue, competitionId);
        if (!Object.prototype.hasOwnProperty.call(STATUS_ORDER, coverage.status)) {
          errors = validationError(errors, venue.id + ' has an unsupported status for ' + competitionId + '.');
        }
        if (!coverage.evidence) {
          errors = validationError(errors, venue.id + ' needs evidence text for ' + competitionId + '.');
        }
      });
    });
    return errors;
  }

  return {
    STATUS_ORDER: STATUS_ORDER,
    normalize: normalize,
    competitionById: competitionById,
    venueById: venueById,
    coverageFor: coverageFor,
    statusFor: statusFor,
    venueSearchText: venueSearchText,
    filterVenues: filterVenues,
    countStatuses: countStatuses,
    validateData: validateData
  };
}));
