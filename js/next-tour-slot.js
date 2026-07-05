(function (root, factory) {
  var api = factory();
  root.bwNextTourSlot = api.bwNextTourSlot;
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

  function findTarget(now) {
    var today = slotInfo(now);
    if (isTourDay(today.weekdayShort) && beforeSameDayCutoff(today)) return today;

    for (var offset = 1; offset <= 8; offset += 1) {
      var candidate = slotInfo(new Date(now.getTime() + (offset * DAY_MS)));
      if (isTourDay(candidate.weekdayShort)) return candidate;
    }

    return today;
  }

  function bwNextTourSlot(input) {
    var now = normalizeNow(input);
    var today = slotInfo(now);
    var tomorrow = slotInfo(new Date(now.getTime() + DAY_MS));
    var target = findTarget(now);
    var relativeLabel = target.weekdayLabel;

    if (target.dateKey === today.dateKey) {
      relativeLabel = 'Today (' + target.weekdayShort + ')';
    } else if (target.dateKey === tomorrow.dateKey) {
      relativeLabel = 'Tomorrow (' + target.weekdayShort + ')';
    }

    return {
      dateKey: target.dateKey,
      weekdayLabel: target.weekdayLabel,
      relativeLabel: relativeLabel,
      startLabel: TOUR_START_LABEL,
    };
  }

  return { bwNextTourSlot: bwNextTourSlot };
});
