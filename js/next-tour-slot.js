(function (root, factory) {
  var api = factory();
  root.bwNextTourSlot = api.bwNextTourSlot;
  root.bwNextTourSlots = api.bwNextTourSlots;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  var TIME_ZONE = 'Europe/Berlin';
  var DEFAULT_START_LABELS = ['11:30'];
  var SUMMER_START_LABELS = ['11:30', '15:30'];
  var SAME_DAY_CUTOFF_LEAD_MINUTES = 180;
  // Live booking copy currently says "From 3 July 2026: 11:30 + 15:30".
  // If that exact public start changes, update the window here.
  var DOUBLE_SLOT_START_MONTH_DAY = 703;
  var DOUBLE_SLOT_END_MONTH_DAY = 930;
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
      month: parts.month,
      day: parts.day,
      weekdayShort: WEEKDAY_SHORT_FORMATTER.format(date),
      weekdayLabel: WEEKDAY_LONG_FORMATTER.format(date),
      hour: parts.hour,
      minute: parts.minute,
    };
  }

  function isTourDay(weekdayShort) {
    return Boolean(TOUR_DAYS[weekdayShort]);
  }

  function monthDayKey(parts) {
    return (parts.month * 100) + parts.day;
  }

  function isDoubleSlotSeason(parts) {
    var key = monthDayKey(parts);
    return key >= DOUBLE_SLOT_START_MONTH_DAY && key <= DOUBLE_SLOT_END_MONTH_DAY;
  }

  function startLabelsForDay(parts) {
    return isDoubleSlotSeason(parts) ? SUMMER_START_LABELS.slice() : DEFAULT_START_LABELS.slice();
  }

  function minutesForLabel(label) {
    var parts = String(label || '').split(':');
    return (Number(parts[0]) * 60) + Number(parts[1]);
  }

  function currentMinutes(parts) {
    return (parts.hour * 60) + parts.minute;
  }

  function bookableStartLabels(targetParts, nowParts) {
    var labels = startLabelsForDay(targetParts);
    if (!nowParts || targetParts.dateKey !== nowParts.dateKey) return labels;

    var nowMinutes = currentMinutes(nowParts);
    return labels.filter(function (label) {
      return nowMinutes < (minutesForLabel(label) - SAME_DAY_CUTOFF_LEAD_MINUTES);
    });
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

  function normalizeCount(input, fallback) {
    var value = input && typeof input.count === 'number' ? input.count : fallback;
    if (!Number.isFinite(value) || value < 1) return 1;
    return Math.floor(value);
  }

  function findTargets(now, count) {
    var today = slotInfo(now);
    var targets = [];
    var seen = {};

    for (var offset = 0; offset <= 14 && targets.length < count; offset += 1) {
      var candidate = slotInfo(new Date(now.getTime() + (offset * DAY_MS)));
      if (!isTourDay(candidate.weekdayShort) || seen[candidate.dateKey]) continue;
      if (!bookableStartLabels(candidate, today).length) continue;
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
      var startLabels = bookableStartLabels(target, today);
      return {
        dateKey: target.dateKey,
        weekdayShort: target.weekdayShort,
        weekdayLabel: target.weekdayLabel,
        relativeLabel: relativeLabelFor(target, today, tomorrow),
        startLabel: startLabels[0] || '',
        startLabels: startLabels,
        slotsLabel: slotsLabelFor(startLabels),
        slotCount: startLabels.length,
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
      startLabel: target.startLabel,
      startLabels: target.startLabels,
      slotsLabel: target.slotsLabel,
      slotCount: target.slotCount,
    };
  }

  return {
    bwNextTourSlot: bwNextTourSlot,
    bwNextTourSlots: bwNextTourSlots,
  };
});
