(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.BWPlanArtifactV2 = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var SCHEMA_VERSION = '2.0.0';
  var OFFICIAL_RESERVATION_HOSTS = [
    'bundestag.de',
    'smb.museum',
    'spsg.de'
  ];

  function clean(value) {
    return String(value == null ? '' : value).trim();
  }

  function slug(value) {
    return clean(value)
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 96) || 'unknown';
  }

  function unique(values) {
    var seen = {};
    return (values || []).filter(function (value) {
      var key = clean(value);
      if (!key || seen[key]) return false;
      seen[key] = true;
      return true;
    });
  }

  function segmentType(block) {
    var value = [block && block.time, block && block.title, block && block.copy].join(' ').toLowerCase();
    if (/^arrival\b|airport|hauptbahnhof|check[ -]?in|bags/.test(value)) return 'arrival';
    if (/berlinwalk|walking tour|booked tour/.test(value)) return 'tour';
    if (/lunch|dinner|breakfast|food|cafe|restaurant/.test(value)) return 'meal';
    if (/opening backup|fallback|backup/.test(value)) return 'fallback';
    if (/pause|break|rest/.test(value)) return 'break';
    if (/transfer|train|tram|u-bahn|s-bahn|bus|ride/.test(value)) return 'transfer';
    return 'visit';
  }

  function parseWindow(value) {
    var match = /(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})/.exec(clean(value));
    if (!match) return null;
    var start = Number(match[1]) * 60 + Number(match[2]);
    var end = Number(match[3]) * 60 + Number(match[4]);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;
    return { start: start, end: end, label: match[0].replace(/–/g, '-') };
  }

  function isOfficialReservationUrl(value) {
    try {
      var hostname = new URL(value).hostname.toLowerCase();
      return OFFICIAL_RESERVATION_HOSTS.some(function (host) {
        return hostname === host || hostname.endsWith('.' + host);
      });
    } catch (error) {
      return false;
    }
  }

  function routeKey(day) {
    var places = (day.places || []).map(function (place) { return place.placeId; });
    return slug(day.planKey || day.theme || day.title) + '__' + slug(places.join('_') || 'no_places');
  }

  function normalize(source) {
    if (!source || typeof source !== 'object') throw new TypeError('PlanArtifactV2 source must be an object');
    var days = (source.days || []).map(function (day) {
      var stableRouteId = 'route_' + routeKey(day);
      var dayId = 'day_' + clean(day.dateKey) + '__' + stableRouteId;
      var segments = (day.blocks || []).map(function (block, index) {
        var primary = block.primaryPlace || null;
        var type = segmentType(block);
        var primaryId = primary && primary.placeId ? primary.placeId : '';
        return {
          segmentId: stableRouteId + '__' + String(index + 1).padStart(2, '0') + '_' + type + '_' + slug(primaryId || block.title),
          routeId: stableRouteId,
          type: type,
          timeLabel: clean(block.time),
          window: clean(block.window),
          title: clean(block.title),
          copy: clean(block.copy),
          primaryPlace: primary,
          mapStopOwner: Boolean(primaryId),
          mapLinks: block.mapLinks || []
        };
      });
      return {
        dayId: dayId,
        routeId: stableRouteId,
        dayNumber: Number(day.dayNumber),
        dateKey: clean(day.dateKey),
        title: clean(day.title),
        theme: clean(day.theme),
        planKey: clean(day.planKey),
        areaIds: unique((day.places || []).map(function (place) { return place.areaId; })),
        places: day.places || [],
        segments: segments,
        route: day.route || {},
        weather: day.weather || null,
        opening: day.opening || null,
        reservation: day.reservation || null,
        risks: day.risks || [],
        previewStops: day.previewStops || [],
        weatherSwap: day.weatherSwap || null,
        openingSwap: day.openingSwap || null
      };
    });
    var artifact = {
      schemaVersion: SCHEMA_VERSION,
      engineVersion: clean(source.engineVersion || 'unknown'),
      scenarioId: clean(source.scenarioId),
      input: source.input || {},
      title: clean(source.title),
      summary: clean(source.summary),
      displayDate: clean(source.displayDate),
      ticket: clean(source.ticket),
      tourFit: clean(source.tourFit),
      days: days,
      quality: { status: 'unchecked', issues: [], warnings: [] }
    };
    artifact.quality = validate(artifact);
    return artifact;
  }

  function validate(artifact) {
    var issues = [];
    var warnings = [];
    function issue(code, message, pointer) {
      issues.push({ code: code, message: message, pointer: pointer || '' });
    }
    function warn(code, message, pointer) {
      warnings.push({ code: code, message: message, pointer: pointer || '' });
    }

    if (!artifact || artifact.schemaVersion !== SCHEMA_VERSION) {
      issue('schema_version', 'Expected PlanArtifactV2 schema version ' + SCHEMA_VERSION + '.', '/schemaVersion');
    }
    var days = artifact && Array.isArray(artifact.days) ? artifact.days : [];
    var expectedDays = Number(artifact && artifact.input && artifact.input.tripLength);
    if (!days.length) issue('days_empty', 'The plan must contain at least one day.', '/days');
    if (expectedDays && days.length !== expectedDays) issue('day_count', 'The plan day count does not match the requested trip length.', '/days');

    days.forEach(function (day, dayIndex) {
      var pointer = '/days/' + dayIndex;
      if (day.dayNumber !== dayIndex + 1) issue('day_sequence', 'Day numbers must be sequential.', pointer + '/dayNumber');
      if (!/^\d{4}-\d{2}-\d{2}$/.test(day.dateKey)) issue('day_date', 'Day date must use YYYY-MM-DD.', pointer + '/dateKey');
      if (!day.routeId || !day.dayId) issue('stable_ids', 'Day and route IDs are required.', pointer);
      if (!day.segments.length) issue('segments_empty', 'Each day needs at least one segment.', pointer + '/segments');

      var mapOwners = {};
      var timed = [];
      day.segments.forEach(function (segment, segmentIndex) {
        var segmentPointer = pointer + '/segments/' + segmentIndex;
        var placeId = segment.primaryPlace && segment.primaryPlace.placeId;
        if (segment.mapStopOwner && placeId) {
          if (mapOwners[placeId]) issue('duplicate_map_stop_owner', 'The same map stop is owned by more than one segment in a day.', segmentPointer + '/primaryPlace');
          mapOwners[placeId] = segment.segmentId;
        }
        var parsed = parseWindow(segment.window);
        if (parsed) timed.push({ parsed: parsed, segmentId: segment.segmentId, pointer: segmentPointer });
      });
      timed.sort(function (a, b) { return a.parsed.start - b.parsed.start; });
      for (var timedIndex = 1; timedIndex < timed.length; timedIndex += 1) {
        if (timed[timedIndex].parsed.start < timed[timedIndex - 1].parsed.end) {
          issue('time_overlap', 'Two scheduled segments overlap.', timed[timedIndex].pointer + '/window');
        }
      }

      var route = day.route || {};
      if (route.travelMode === 'walking' && (Number(route.longestSegmentKm) > 3 || Number(route.totalDistanceKm) > 6)) {
        issue('long_walking_route', 'A long cross-area route needs a transit transfer.', pointer + '/route');
      }
      var dayText = day.segments.map(function (segment) { return segment.title + ' ' + segment.copy; }).join(' ').toLowerCase();
      if (dayText.indexOf('museum island') !== -1 && day.areaIds.length && day.areaIds.indexOf('mitte') === -1 && day.areaIds.indexOf('alexanderplatz') === -1) {
        issue('cross_area_fallback', 'Museum Island is named as a fallback outside its actual area.', pointer + '/segments');
      }
      if (day.reservation && day.reservation.required && !isOfficialReservationUrl(day.reservation.url)) {
        issue('reservation_official_url', 'A required reservation needs a supported official URL.', pointer + '/reservation/url');
      }
      if (day.reservation && day.reservation.required && !day.reservation.checkedAt) {
        issue('reservation_verified_at', 'A required reservation needs a verification date.', pointer + '/reservation/checkedAt');
      }
      if (day.opening && day.opening.primaryClosed === true) {
        issue('closed_primary_anchor', 'A closed venue cannot remain the primary anchor.', pointer + '/opening');
      }
      if (day.weatherSwap && day.weatherSwap.key === 'weather-swap-exposed-day' && day.weather && day.weather.rainy === true) {
        issue('rain_swap_not_clearer', 'An exposed route was moved to another rainy day.', pointer + '/weatherSwap');
      }
      if (!day.previewStops.length) warn('preview_empty', 'The day has no compact preview stops.', pointer + '/previewStops');
    });

    var status = issues.length ? 'fail' : (warnings.length ? 'review' : 'pass');
    return {
      status: status,
      issues: issues,
      warnings: warnings,
      stats: { days: days.length, issues: issues.length, warnings: warnings.length }
    };
  }

  function attach(engine) {
    if (!engine || typeof engine.currentSource !== 'function' || typeof engine.buildScenarioSource !== 'function') {
      throw new TypeError('PlanArtifactV2 needs the local Trip Planner engine QA bridge');
    }
    return {
      schemaVersion: SCHEMA_VERSION,
      current: function () { return normalize(engine.currentSource()); },
      buildScenario: function (scenario) { return normalize(engine.buildScenarioSource(scenario || {})); },
      normalize: normalize,
      validate: validate
    };
  }

  return {
    schemaVersion: SCHEMA_VERSION,
    normalize: normalize,
    validate: validate,
    attach: attach,
    isOfficialReservationUrl: isOfficialReservationUrl
  };
});
