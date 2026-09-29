(function (root, factory) {
  var api = factory();
  root.bwNextTourSlot = api.bwNextTourSlot;
  root.bwNextTourSlots = api.bwNextTourSlots;
  root.bwNextTourStarts = api.bwNextTourStarts;
  root.bwNextTourStartsLabel = api.bwNextTourStartsLabel;
  root.bwLiveNextTourSlot = api.bwLiveNextTourSlot;
  root.bwLiveNextTourSlots = api.bwLiveNextTourSlots;
  root.bwLiveNextTourStarts = api.bwLiveNextTourStarts;
  root.bwLiveNextTourStartsLabel = api.bwLiveNextTourStartsLabel;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  var TIME_ZONE = 'Europe/Berlin';
  // Berlin Then and Now (Wix service 145cb27e) replaced the free walk on
  // 29 September 2026. There is no fixed weekday schedule any more: every date
  // comes from the live availability feed, and the static helpers below return
  // nothing so no consumer can print an old schedule. Callers hide dates until
  // the feed has a bookable one.
  var TOUR_SERVICE_ID = '145cb27e-c5bd-456d-bfbd-a09d4d6f5f9d';
  var LIVE_AVAILABILITY_URL = 'https://berlinwalk-content-app.vercel.app/api/booking-calendar-availability';
  var DAY_MS = 24 * 60 * 60 * 1000;
  var BERLIN_FORMATTER = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  var WEEKDAY_SHORT_FORMATTER = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    weekday: 'short',
  });
  var WEEKDAY_LONG_FORMATTER = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    weekday: 'long',
  });
  var liveAvailabilityPromise = null;

  function berlinParts(date) {
    var map = {};
    BERLIN_FORMATTER.formatToParts(date).forEach(function (part) {
      if (part.type !== 'literal') map[part.type] = part.value;
    });
    return {
      year: Number(map.year),
      month: Number(map.month),
      day: Number(map.day),
      hour: Number(map.hour),
      minute: Number(map.minute),
      weekdayShort: map.weekday,
    };
  }

  function dateKey(parts) {
    return String(parts.year) + '-' + String(parts.month).padStart(2, '0') + '-' + String(parts.day).padStart(2, '0');
  }

  function slotInfo(date) {
    var parts = berlinParts(date);
    return {
      dateKey: dateKey(parts),
      year: parts.year,
      month: parts.month,
      day: parts.day,
      weekdayShort: WEEKDAY_SHORT_FORMATTER.format(date),
      weekdayLabel: WEEKDAY_LONG_FORMATTER.format(date),
      hour: parts.hour,
      minute: parts.minute,
    };
  }

  function minutesForLabel(label) {
    var parts = String(label || '').split(':');
    return (Number(parts[0]) * 60) + Number(parts[1]);
  }

  function slotsLabelFor(labels) {
    if (!labels.length) return '';
    if (labels.length === 1) return labels[0];
    if (labels.length === 2) return labels[0] + ' and ' + labels[1];
    return labels.slice(0, -1).join(', ') + ', and ' + labels[labels.length - 1];
  }

  function normalizeNow(input) {
    if (input && input.now instanceof Date) return new Date(input.now.getTime());
    if (input instanceof Date) return new Date(input.getTime());
    return new Date();
  }

  function relativeLabelFor(target, today, tomorrow) {
    if (target.dateKey === today.dateKey) {
      return 'Today (' + target.weekdayShort + ')';
    }
    if (target.dateKey === tomorrow.dateKey) {
      return 'Tomorrow (' + target.weekdayShort + ')';
    }
    return target.weekdayLabel;
  }

  function compactRelativeLabelFor(target, today, tomorrow) {
    if (target.dateKey === today.dateKey) return 'Today';
    if (target.dateKey === tomorrow.dateKey) return 'Tomorrow';
    return target.weekdayShort;
  }

  function normalizeCount(input, fallback) {
    var value = input && typeof input.count === 'number' ? input.count : fallback;
    if (!Number.isFinite(value) || value < 1) return 1;
    return Math.floor(value);
  }

  function startEntriesLabelFor(entries) {
    if (!entries.length) return '';
    if (entries.length === 1) {
      return entries[0].compactRelativeLabel + ' ' + entries[0].startLabel;
    }
    if (entries[0].dateKey === entries[1].dateKey) {
      return entries[0].compactRelativeLabel + ' ' + entries[0].startLabel + ' + ' + entries[1].startLabel;
    }
    return entries[0].compactRelativeLabel + ' ' + entries[0].startLabel + ' + ' + entries[1].compactRelativeLabel + ' ' + entries[1].startLabel;
  }

  function startLabelForDate(date) {
    var parts = berlinParts(date);
    return String(parts.hour).padStart(2, '0') + ':' + String(parts.minute).padStart(2, '0');
  }

  function availabilityEndpoint(input) {
    if (input && input.endpoint) return String(input.endpoint);
    var days = input && Number.isFinite(Number(input.days)) ? Math.max(1, Math.min(365, Math.floor(Number(input.days)))) : 60;
    return LIVE_AVAILABILITY_URL + '?days=' + encodeURIComponent(days) + '&serviceId=' + encodeURIComponent(TOUR_SERVICE_ID);
  }

  function fetchLiveAvailability(input) {
    if (input && input.availability) return Promise.resolve(input.availability);
    if (typeof fetch !== 'function') return Promise.resolve(null);
    if (!liveAvailabilityPromise || input && input.noCache) {
      liveAvailabilityPromise = fetch(availabilityEndpoint(input), { mode: 'cors', credentials: 'omit' })
        .then(function (response) {
          if (!response || !response.ok) throw new Error('availability fetch failed');
          return response.json();
        })
        .catch(function () {
          return null;
        });
    }
    return liveAvailabilityPromise;
  }

  function liveStartEntriesFromAvailability(availability, now, count) {
    var today = slotInfo(now);
    var tomorrow = slotInfo(new Date(now.getTime() + DAY_MS));
    var entries = availability && Array.isArray(availability.slots) ? availability.slots : [];
    return entries
      .map(function (slot) {
        var startDate = slot && slot.startDate ? new Date(slot.startDate) : null;
        if (!startDate || Number.isNaN(startDate.getTime()) || startDate.getTime() <= now.getTime()) return null;
        var info = slotInfo(startDate);
        return {
          dateKey: info.dateKey,
          weekdayShort: info.weekdayShort,
          weekdayLabel: info.weekdayLabel,
          relativeLabel: relativeLabelFor(info, today, tomorrow),
          compactRelativeLabel: compactRelativeLabelFor(info, today, tomorrow),
          startLabel: startLabelForDate(startDate),
        };
      })
      .filter(Boolean)
      .sort(function (a, b) {
        if (a.dateKey !== b.dateKey) return a.dateKey < b.dateKey ? -1 : 1;
        return minutesForLabel(a.startLabel) - minutesForLabel(b.startLabel);
      })
      .slice(0, count);
  }

  function liveSlotsFromStarts(starts) {
    if (!starts.length) return [];
    var grouped = [];
    starts.forEach(function (entry) {
      var current = grouped[grouped.length - 1];
      if (!current || current.dateKey !== entry.dateKey) {
        current = {
          dateKey: entry.dateKey,
          weekdayShort: entry.weekdayShort,
          weekdayLabel: entry.weekdayLabel,
          relativeLabel: entry.relativeLabel,
          startLabel: entry.startLabel,
          startLabels: [],
        };
        grouped.push(current);
      }
      current.startLabels.push(entry.startLabel);
      current.startLabel = current.startLabels[0] || entry.startLabel;
      current.slotsLabel = slotsLabelFor(current.startLabels);
      current.slotCount = current.startLabels.length;
    });
    return grouped;
  }

  // Static schedule helpers: kept for API compatibility, always empty.
  function bwNextTourSlots() {
    return [];
  }

  function bwNextTourSlot() {
    return null;
  }

  function bwNextTourStarts() {
    return [];
  }

  function bwNextTourStartsLabel() {
    return '';
  }

  function bwLiveNextTourStarts(input, fallbackCount) {
    var now = normalizeNow(input);
    var count = normalizeCount(input, fallbackCount || 2);
    return fetchLiveAvailability(input).then(function (availability) {
      return liveStartEntriesFromAvailability(availability, now, count);
    });
  }

  function bwLiveNextTourStartsLabel(input, fallbackCount) {
    return bwLiveNextTourStarts(input, fallbackCount || 2).then(startEntriesLabelFor);
  }

  function bwLiveNextTourSlots(input, fallbackCount) {
    var count = normalizeCount(input, fallbackCount || 2);
    return bwLiveNextTourStarts(input, count).then(liveSlotsFromStarts);
  }

  function bwLiveNextTourSlot(input) {
    return bwLiveNextTourSlots(input, 2).then(function (slots) {
      return slots[0] || null;
    });
  }

  return {
    bwNextTourSlot: bwNextTourSlot,
    bwNextTourSlots: bwNextTourSlots,
    bwNextTourStarts: bwNextTourStarts,
    bwNextTourStartsLabel: bwNextTourStartsLabel,
    bwLiveNextTourSlot: bwLiveNextTourSlot,
    bwLiveNextTourSlots: bwLiveNextTourSlots,
    bwLiveNextTourStarts: bwLiveNextTourStarts,
    bwLiveNextTourStartsLabel: bwLiveNextTourStartsLabel,
  };
});
