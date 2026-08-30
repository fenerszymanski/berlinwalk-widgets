/* impact-matching.js — pure matching/sorting/freshness logic for the Berlin
 * Date Check "impact board" (berlin-dates-check/index.html).
 *
 * Same UMD shape as berlin-football-screen-board/engine.js and
 * js/tool-event-bridge.js: no DOM, no fetch, no globals besides the one
 * export. index.html loads this via a plain <script src="impact-matching.js">
 * tag (classic script, no bundler) and calls window.BWImpactMatching.*;
 * impact-board.test.mjs imports the same file as a CommonJS default export.
 * Keeping this logic here (rather than inline in index.html's IIFE) is what
 * makes it unit-testable with real fixtures instead of only regex-on-source
 * assertions.
 *
 * Data contract for one impact row (see berlin-dates-check/data.json's
 * `impactBoard` array):
 *   id, title, from (YYYY-MM-DD), to (YYYY-MM-DD), areas (string[], empty =
 *   citywide), impactType (one of IMPACT_TYPES), severity (one of
 *   SEVERITIES), whatChanges, whoItAffects, visitorMove, sourceUrl (https),
 *   checkedAt (YYYY-MM-DD), validThrough (YYYY-MM-DD). timeNote is optional.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.BWImpactMatching = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var IMPACT_TYPES = ['citywide_event', 'holiday_effect', 'transport_disruption', 'closure', 'area_impact', 'booking_deadline'];
  var SEVERITIES = ['high', 'medium', 'low'];
  var DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
  var REQUIRED_STRING_FIELDS = ['id', 'title', 'from', 'to', 'impactType', 'severity', 'whatChanges', 'whoItAffects', 'visitorMove', 'sourceUrl', 'checkedAt', 'validThrough'];

  // ---------------------------------------------------------------------
  // matching
  // ---------------------------------------------------------------------

  // Same inclusive-overlap shape as the existing bigDatesReading() in
  // index.html (e.from <= last && e.to >= first) -- deliberately mirrored,
  // not reused, since that function lives inside index.html's own IIFE and
  // this module must stay dependency-free.
  function overlapsWindow(impact, firstDay, lastDay) {
    return !!(impact && impact.from && impact.to) && impact.from <= lastDay && impact.to >= firstDay;
  }

  // areas: [] means citywide -- always shown regardless of the visitor's
  // area pick (including "no area picked at all"). A non-empty areas list
  // only shows when the visitor picked one of exactly those areas; an
  // unknown/blank/"other" areaCode never matches a scoped row, so a visitor
  // who didn't say where they are staying sees citywide impacts only.
  function matchesArea(impact, areaCode) {
    var areas = (impact && impact.areas) || [];
    if (!areas.length) return true;
    if (!areaCode) return false;
    return areas.indexOf(areaCode) !== -1;
  }

  // Freshness is relative to "today" (when the page runs), never to the
  // visitor's chosen dates. A row whose validThrough has already passed must
  // never render as current, even if its from/to would otherwise overlap a
  // future trip window -- that is what keeps a stale record from being
  // presented as live.
  function isFresh(impact, todayStr) {
    return !!(impact && typeof impact.validThrough === 'string' && DATE_RE.test(impact.validThrough) && typeof todayStr === 'string' && impact.validThrough >= todayStr);
  }

  function severityRank(severity) {
    if (severity === 'high') return 0;
    if (severity === 'medium') return 1;
    if (severity === 'low') return 2;
    return 3; // unknown severities sort last rather than crash the comparator
  }

  // "Soonest-relevant" clamps the impact's own start to the visitor's first
  // day, so a row that already started before the trip (e.g. a renovation
  // closure that began years ago) is ranked by when it starts MATTERING to
  // this visitor (day one of the trip), not by its real-world start date.
  function effectiveStart(impact, firstDay) {
    return impact.from > firstDay ? impact.from : firstDay;
  }

  // Ordering rule (documented in the feature's report): severity first
  // (high, then medium, then low), then soonest-relevant effective start
  // within the visitor's window, then a stable id tiebreak so equal-rank
  // rows always render in the same order.
  function compareImpacts(a, b, firstDay) {
    var rankDiff = severityRank(a.severity) - severityRank(b.severity);
    if (rankDiff !== 0) return rankDiff;
    var aStart = effectiveStart(a, firstDay), bStart = effectiveStart(b, firstDay);
    if (aStart !== bStart) return aStart < bStart ? -1 : 1;
    return String(a.id || '').localeCompare(String(b.id || ''));
  }

  function matchImpacts(impacts, options) {
    options = options || {};
    var firstDay = options.firstDay, lastDay = options.lastDay;
    var areaCode = options.areaCode || '';
    var todayStr = options.todayStr;
    if (!Array.isArray(impacts) || !firstDay || !lastDay || !todayStr) return [];
    return impacts
      .filter(function (impact) { return isFresh(impact, todayStr); })
      .filter(function (impact) { return overlapsWindow(impact, firstDay, lastDay); })
      .filter(function (impact) { return matchesArea(impact, areaCode); })
      .slice()
      .sort(function (a, b) { return compareImpacts(a, b, firstDay); });
  }

  // How many of the visitor's own trip days fall inside the impact's dated
  // window -- used to say "covers your whole stay" vs "affects 2 of your 5
  // days" instead of a generic citywide blurb.
  function overlapDayCount(impact, days) {
    if (!impact || !Array.isArray(days)) return 0;
    return days.filter(function (d) { return d >= impact.from && d <= impact.to; }).length;
  }

  // ---------------------------------------------------------------------
  // data-shape validation (used by tests; index.html does not call this at
  // runtime, matching the existing tools-hub/validate-data.mjs pattern of a
  // build/test-time check rather than a live one)
  // ---------------------------------------------------------------------
  function validateImpactRow(impact) {
    var errors = [];
    if (!impact || typeof impact !== 'object') return ['impact row must be an object'];
    var id = impact.id || '(missing id)';
    REQUIRED_STRING_FIELDS.forEach(function (field) {
      if (typeof impact[field] !== 'string' || !impact[field].trim()) errors.push(id + ' missing ' + field);
    });
    if (!Array.isArray(impact.areas)) errors.push(id + ' areas must be an array');
    if (IMPACT_TYPES.indexOf(impact.impactType) === -1) errors.push(id + ' has an unsupported impactType: ' + impact.impactType);
    if (SEVERITIES.indexOf(impact.severity) === -1) errors.push(id + ' has an unsupported severity: ' + impact.severity);
    ['from', 'to', 'checkedAt', 'validThrough'].forEach(function (field) {
      if (typeof impact[field] === 'string' && !DATE_RE.test(impact[field])) errors.push(id + ' has a malformed ' + field);
    });
    if (typeof impact.from === 'string' && typeof impact.to === 'string' && DATE_RE.test(impact.from) && DATE_RE.test(impact.to) && impact.from > impact.to) {
      errors.push(id + ' has from after to');
    }
    if (typeof impact.sourceUrl === 'string' && !/^https:\/\//.test(impact.sourceUrl)) errors.push(id + ' sourceUrl must use HTTPS');
    return errors;
  }

  function validateImpactBoard(impacts) {
    var errors = [];
    var seenIds = {};
    (impacts || []).forEach(function (impact) {
      errors = errors.concat(validateImpactRow(impact));
      if (impact && impact.id) {
        if (seenIds[impact.id]) errors.push('duplicate impact id: ' + impact.id);
        seenIds[impact.id] = true;
      }
    });
    return errors;
  }

  return {
    IMPACT_TYPES: IMPACT_TYPES.slice(),
    SEVERITIES: SEVERITIES.slice(),
    overlapsWindow: overlapsWindow,
    matchesArea: matchesArea,
    isFresh: isFresh,
    severityRank: severityRank,
    effectiveStart: effectiveStart,
    compareImpacts: compareImpacts,
    matchImpacts: matchImpacts,
    overlapDayCount: overlapDayCount,
    validateImpactRow: validateImpactRow,
    validateImpactBoard: validateImpactBoard
  };
}));
