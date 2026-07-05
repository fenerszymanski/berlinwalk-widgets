(function (root, factory) {
  var api = factory();
  root.bwNextTourSlot = api.bwNextTourSlot;
  root.bwNextTourSlots = api.bwNextTourSlots;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  var TIME_ZONE = 'Europe/Berlin';
  var TOUR_START_LABEL = '11:30';
  var SAME_DAY_CUTOFF_HOUR = 8;
  var SAME_DAY_CUTOFF_MINUTE = 30;
  var DAY_MS = 24 * 60 * 60 * 1000;
  var TOUR_DAYS = { Tue: true, Wed: true, Thu: true, Fri: true, Sat: true };
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
      weekdayShort: WEEKDAY_SHORT_FORMATTER.format(date),
      weekdayLabel: WEEKDAY_LONG_FORMATTER.format(date),
      hour: parts.hour,
      minute: parts.minute,
    };
  }

  function isTourDay(weekdayShort) {
    return Boolean(TOUR_DAYS[weekdayShort]);
  }

  function beforeSameDayCutoff(parts) {
    return parts.hour < SAME_DAY_CUTOFF_HOUR
      || (parts.hour === SAME_DAY_CUTOFF_HOUR && parts.minute < SAME_DAY_CUTOFF_MINUTE);
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

  function normalizeCount(input, fallback) {
    var value = input && typeof input.count === 'number' ? input.count : fallback;
    if (!Number.isFinite(value) || value < 1) return 1;
    return Math.floor(value);
  }

  function findTargets(now, count) {
    var today = slotInfo(now);
    var targets = [];
    var seen = {};

    if (isTourDay(today.weekdayShort) && beforeSameDayCutoff(today)) {
      targets.push(today);
      seen[today.dateKey] = true;
    }

    for (var offset = 1; offset <= 14 && targets.length < count; offset += 1) {
      var candidate = slotInfo(new Date(now.getTime() + (offset * DAY_MS)));
      if (!isTourDay(candidate.weekdayShort) || seen[candidate.dateKey]) continue;
      targets.push(candidate);
      seen[candidate.dateKey] = true;
    }

    if (!targets.length) targets.push(today);
    return targets;
  }

  function bwNextTourSlots(input, fallbackCount) {
    var now = normalizeNow(input);
    var today = slotInfo(now);
    var tomorrow = slotInfo(new Date(now.getTime() + DAY_MS));
    var count = normalizeCount(input, fallbackCount || 1);

    return findTargets(now, count).map(function (target) {
      return {
        dateKey: target.dateKey,
        weekdayShort: target.weekdayShort,
        weekdayLabel: target.weekdayLabel,
        relativeLabel: relativeLabelFor(target, today, tomorrow),
        startLabel: TOUR_START_LABEL,
      };
    });
  }

  function bwNextTourSlot(input) {
    var target = bwNextTourSlots(input, 1)[0];
    return {
      dateKey: target.dateKey,
      weekdayShort: target.weekdayShort,
      weekdayLabel: target.weekdayLabel,
      relativeLabel: target.relativeLabel,
      startLabel: TOUR_START_LABEL,
    };
  }

  return {
    bwNextTourSlot: bwNextTourSlot,
    bwNextTourSlots: bwNextTourSlots,
  };
});
