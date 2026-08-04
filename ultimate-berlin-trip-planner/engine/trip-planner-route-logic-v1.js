(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.BWTripPlannerRouteLogicV1 = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var VERSION = '1.2.0';
  var MAX_ROUTE_PLACES = 12;

  var TRANSFER_OVERRIDES = {
    'berlin_hbf>potsdam_hbf': { mode: 'transit', minutes: 35, bufferMinutes: 10, instruction: 'Take a regional train from Berlin Hbf to Potsdam Hbf.' },
    'potsdam_hbf>berlin_hbf': { mode: 'transit', minutes: 35, bufferMinutes: 10, instruction: 'Take a regional train from Potsdam Hbf to Berlin Hbf.' },
    'wall_memorial>friedrichshain_food_search': { mode: 'transit', minutes: 30, bufferMinutes: 5 },
    'wall_memorial>vegan_1990': { mode: 'transit', minutes: 30, bufferMinutes: 5 },
    'charlottenburg_palace>lietzensee_food_search': { mode: 'walking', minutes: 20, bufferMinutes: 5 },
    'sanssouci_park>potsdam_hbf': { mode: 'transit', minutes: 25, bufferMinutes: 5 },
    'tempelhofer_feld>tempelhof_food_search': { mode: 'transit', minutes: 20, bufferMinutes: 5 }
  };

  function cleanText(value, max) {
    return String(value == null ? '' : value)
      .replace(/[\u0000-\u001f\u007f]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, max || 500);
  }

  function number(value, fallback) {
    var parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : (Number.isFinite(fallback) ? fallback : 0);
  }

  function roundUpFive(value) {
    return Math.ceil(Math.max(0, number(value, 0)) / 5) * 5;
  }

  function parseWindow(value) {
    var match = /^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$/.exec(String(value || ''));
    if (!match) return null;
    var start = Number(match[1]) * 60 + Number(match[2]);
    var end = Number(match[3]) * 60 + Number(match[4]);
    return end > start ? { start: start, end: end, duration: end - start } : null;
  }

  function formatTime(minutes) {
    var safe = Math.max(0, Math.min((24 * 60) - 1, Math.round(number(minutes, 0))));
    return String(Math.floor(safe / 60)).padStart(2, '0') + ':' + String(safe % 60).padStart(2, '0');
  }

  function formatWindow(start, end) {
    return formatTime(start) + '-' + formatTime(end);
  }

  function placeFor(catalog, placeId) {
    return catalog && catalog[placeId] || null;
  }

  function distanceKm(first, second) {
    if (!first || !second || !Number.isFinite(first.lat) || !Number.isFinite(first.lng) || !Number.isFinite(second.lat) || !Number.isFinite(second.lng)) return 0;
    var radius = 6371;
    var radians = function (value) { return value * Math.PI / 180; };
    var latDelta = radians(second.lat - first.lat);
    var lngDelta = radians(second.lng - first.lng);
    var startLat = radians(first.lat);
    var endLat = radians(second.lat);
    var value = Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
      Math.cos(startLat) * Math.cos(endLat) * Math.sin(lngDelta / 2) * Math.sin(lngDelta / 2);
    return radius * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
  }

  function canonicalPlaceIds(block) {
    block = block || {};
    var ids = Array.isArray(block.routePlaceIds) && block.routePlaceIds.length
      ? block.routePlaceIds.slice()
      : (Array.isArray(block.placeIds) ? block.placeIds.slice() : []);
    var primaryId = cleanText(block.placeId || block.primaryPlace && block.primaryPlace.placeId, 100);
    if (primaryId && ids.indexOf(primaryId) === -1) ids.unshift(primaryId);
    ids = ids.map(function (value) { return cleanText(value, 100); }).filter(Boolean);
    if (/^(lunch|evening|dinner|later)$/i.test(String(block.time || '').trim()) && block.kind !== 'transfer') {
      return ids.length ? [ids[0]] : [];
    }
    return ids;
  }

  function routePlaceIdsForBlocks(blocks) {
    var ids = [];
    (Array.isArray(blocks) ? blocks : []).forEach(function (block) {
      canonicalPlaceIds(block).forEach(function (placeId) {
        if (!placeId || placeId === 'arrival_transfer') return;
        if (ids[ids.length - 1] !== placeId) ids.push(placeId);
      });
    });
    return ids;
  }

  function directionsUrl(first, second, mode) {
    function query(place) {
      if (place && Number.isFinite(place.lat) && Number.isFinite(place.lng)) return place.lat + ',' + place.lng;
      return cleanText(place && (place.query || place.label), 220);
    }
    return 'https://www.google.com/maps/dir/?api=1&origin=' + encodeURIComponent(query(first)) +
      '&destination=' + encodeURIComponent(query(second)) +
      '&travelmode=' + encodeURIComponent(mode === 'walking' ? 'walking' : 'transit');
  }

  function destinationOnlyDirectionsUrl(place, mode) {
    var query = place && Number.isFinite(place.lat) && Number.isFinite(place.lng)
      ? place.lat + ',' + place.lng
      : cleanText(place && (place.query || place.label), 220);
    return 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(query) +
      '&travelmode=' + encodeURIComponent(mode === 'walking' ? 'walking' : 'transit');
  }

  function createArrivalTransfer(toPlaceId, catalog, source) {
    source = source || {};
    var toId = cleanText(toPlaceId, 100);
    var to = placeFor(catalog, toId);
    if (!toId || !to) return null;
    var mode = source.mode === 'walking' ? 'walking' : 'transit';
    var minutes = Math.max(5, roundUpFive(source.minutes || 30));
    var bufferMinutes = Math.max(0, roundUpFive(source.bufferMinutes || 0));
    var toLabel = cleanText(to.label || toId, 160);
    var prefix = cleanText(source.instructionPrefix || 'After check-in, use public transport to ', 220);
    return {
      fromPlaceId: 'arrival_transfer',
      fromLabel: cleanText(source.fromLabel || 'Your Berlin stay', 160),
      toPlaceId: toId,
      toLabel: toLabel,
      mode: mode,
      minutes: minutes,
      bufferMinutes: bufferMinutes,
      totalMinutes: minutes + bufferMinutes,
      distanceKm: 0,
      instruction: cleanText(prefix + ' ' + toLabel + '. Check the live connection before leaving.', 360),
      url: destinationOnlyDirectionsUrl(to, mode)
    };
  }

  function createTransfer(fromPlaceId, toPlaceId, catalog) {
    var fromId = cleanText(fromPlaceId, 100);
    var toId = cleanText(toPlaceId, 100);
    if (!fromId || !toId || fromId === toId || fromId === 'arrival_transfer' || toId === 'arrival_transfer') return null;
    var from = placeFor(catalog, fromId);
    var to = placeFor(catalog, toId);
    if (!from || !to) return null;
    var distance = distanceKm(from, to);
    var override = TRANSFER_OVERRIDES[fromId + '>' + toId] || {};
    var mode = override.mode || (distance > 1.8 ? 'transit' : 'walking');
    var minutes = Number.isFinite(override.minutes)
      ? override.minutes
      : mode === 'walking'
        ? Math.max(5, roundUpFive((distance / 4.2) * 60))
        : Math.max(15, roundUpFive((distance / 22) * 60 + 8));
    var bufferMinutes = Number.isFinite(override.bufferMinutes)
      ? override.bufferMinutes
      : (distance > 15 ? 10 : 5);
    var fromLabel = cleanText(from.label || fromId, 160);
    var toLabel = cleanText(to.label || toId, 160);
    var instruction = cleanText(override.instruction || (mode === 'walking'
      ? 'Walk from ' + fromLabel + ' to ' + toLabel + '.'
      : 'Use public transport from ' + fromLabel + ' to ' + toLabel + '. Check the live connection before leaving.'), 360);
    return {
      fromPlaceId: fromId,
      fromLabel: fromLabel,
      toPlaceId: toId,
      toLabel: toLabel,
      mode: mode,
      minutes: minutes,
      bufferMinutes: bufferMinutes,
      totalMinutes: minutes + bufferMinutes,
      distanceKm: Math.round(distance * 10) / 10,
      instruction: instruction,
      linkLabel: '',
      url: directionsUrl(from, to, mode)
    };
  }

  function mealRoleForBlock(block) {
    block = block || {};
    var explicit = cleanText(block.mealRole, 20).toLowerCase();
    if (['breakfast', 'lunch', 'dinner'].indexOf(explicit) !== -1) return explicit;
    var time = cleanText(block.time, 40).toLowerCase();
    if (time === 'breakfast') return 'breakfast';
    if (time === 'lunch') return 'lunch';
    if (/^(evening|dinner|later)$/.test(time)) return 'dinner';
    return '';
  }

  function mealLocationSuffix(block, role) {
    var title = cleanText(block && block.title, 180);
    if (!title || !role) return '';
    var rest = title.replace(new RegExp('^' + role + '\\b', 'i'), '').trim();
    if (/^option\s*:/i.test(rest)) return '';
    return /^(?:at|around|by|in|near|on)\b/i.test(rest) ? rest : '';
  }

  function capitalized(value) {
    value = cleanText(value, 40);
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : '';
  }

  function sentenceInternalLabel(value) {
    value = cleanText(value, 160);
    return value.replace(/^Your\b/, 'your');
  }

  function publicMealTransfer(transfer, fromBlock, toBlock) {
    if (!transfer) return transfer;
    var fromRole = mealRoleForBlock(fromBlock);
    var toRole = mealRoleForBlock(toBlock);
    if (!fromRole && !toRole) return transfer;

    var fromLabel = transfer.fromLabel;
    var toLabel = transfer.toLabel;
    var instructionFrom = sentenceInternalLabel(fromLabel);
    var instructionTo = toLabel;
    var linkLabel = '';

    if (fromRole) {
      fromLabel = capitalized(fromRole) + ' stop';
      instructionFrom = 'your ' + fromRole + ' stop';
      linkLabel = 'Open the route after ' + fromRole + ' in Google Maps';
    }
    if (toRole) {
      var suffix = mealLocationSuffix(toBlock, toRole);
      toLabel = capitalized(toRole) + (suffix ? ' ' + suffix : ' stop');
      instructionTo = 'your ' + toRole + ' stop' + (suffix ? ' ' + suffix : '');
      linkLabel = 'Open the route to ' + toRole + ' in Google Maps';
    }

    var instruction = transfer.mode === 'walking'
      ? 'Walk from ' + instructionFrom + ' to ' + instructionTo + '.'
      : 'Use public transport from ' + instructionFrom + ' to ' + instructionTo + '. Check the live connection before leaving.';

    return Object.assign({}, transfer, {
      fromLabel: cleanText(fromLabel, 160),
      toLabel: cleanText(toLabel, 160),
      instruction: cleanText(instruction, 360),
      linkLabel: cleanText(linkLabel, 220)
    });
  }

  function routeStats(placeIds, catalog) {
    var total = 0;
    var longest = 0;
    for (var index = 1; index < placeIds.length; index += 1) {
      var distance = distanceKm(placeFor(catalog, placeIds[index - 1]), placeFor(catalog, placeIds[index]));
      total += distance;
      longest = Math.max(longest, distance);
    }
    return {
      totalDistanceKm: Math.round(total * 10) / 10,
      longestSegmentKm: Math.round(longest * 10) / 10
    };
  }

  function immediateBacktracks(placeIds, catalog) {
    var issues = [];
    for (var index = 1; index < placeIds.length - 1; index += 1) {
      var firstId = placeIds[index - 1];
      var middleId = placeIds[index];
      var lastId = placeIds[index + 1];
      if (firstId === lastId) continue;
      var first = placeFor(catalog, firstId);
      var middle = placeFor(catalog, middleId);
      var last = placeFor(catalog, lastId);
      var direct = distanceKm(first, last);
      var firstLeg = distanceKm(first, middle);
      var secondLeg = distanceKm(middle, last);
      if (direct > 0 && firstLeg > direct + 0.75 && secondLeg > direct + 0.75 && (firstLeg + secondLeg) > direct * 1.8) {
        issues.push({
          code: 'geographic_backtrack',
          fromPlaceId: firstId,
          viaPlaceId: middleId,
          toPlaceId: lastId
        });
      }
    }
    return issues;
  }

  function planDay(options) {
    options = options || {};
    var catalog = options.catalog || {};
    var planKey = cleanText(options.planKey, 60);
    var blocks = (Array.isArray(options.blocks) ? options.blocks : []).map(function (block) {
      return Object.assign({}, block, {
        placeIds: Array.isArray(block && block.placeIds) ? block.placeIds.slice() : [],
        routePlaceIds: Array.isArray(block && block.routePlaceIds) ? block.routePlaceIds.slice() : [],
        mapLinks: Array.isArray(block && block.mapLinks) ? block.mapLinks.slice() : []
      });
    });
    var issues = [];
    var previousWindow = null;
    var previousRouteIds = [];
    var previousBlock = null;

    blocks.forEach(function (block, index) {
      var parsed = parseWindow(block.window);
      if (!parsed) {
        issues.push({ code: 'invalid_window', blockIndex: index });
        return;
      }
      var routeIds = canonicalPlaceIds(block);
      var fromId = previousRouteIds.length ? previousRouteIds[previousRouteIds.length - 1] : '';
      var toId = routeIds.length ? routeIds[0] : '';
      var transfer = previousWindow
        ? (fromId === 'arrival_transfer' && options.arrivalConnection
          ? createArrivalTransfer(toId, catalog, options.arrivalConnection)
          : createTransfer(fromId, toId, catalog))
        : null;
      transfer = publicMealTransfer(transfer, previousBlock, block);
      var transferSegment = block.kind === 'transfer' && routeIds.length >= 2
        ? createTransfer(routeIds[0], routeIds[routeIds.length - 1], catalog)
        : null;
      var earliestStart = previousWindow ? previousWindow.end + (transfer ? transfer.totalMinutes : 0) : parsed.start;
      var start = Math.max(parsed.start, earliestStart);
      if (block.fixedStart === true && start > parsed.start) {
        issues.push({ code: 'fixed_start_conflict', blockIndex: index, earliestStart: earliestStart, fixedStart: parsed.start });
      }
      var end = start + parsed.duration;
      if (end >= 24 * 60) issues.push({ code: 'day_runs_past_midnight', blockIndex: index });
      block.window = formatWindow(start, end);
      block.transferFromPrevious = transfer;
      block.transferSegment = transferSegment;
      previousWindow = { start: start, end: end, duration: parsed.duration };
      previousRouteIds = routeIds;
      previousBlock = block;

      if (block.kind === 'transfer') {
        if (!transferSegment) issues.push({ code: 'transfer_segment_missing', blockIndex: index });
        else if (parsed.duration < transferSegment.totalMinutes) issues.push({ code: 'transfer_window_too_short', blockIndex: index });
      }

      var ownerId = routeIds[0];
      var owner = placeFor(catalog, ownerId);
      if (owner && owner.type === 'station' && block.kind !== 'transfer' && parsed.duration > 90) {
        issues.push({ code: 'station_as_attraction', blockIndex: index, placeId: ownerId });
      }
    });

    var routePlaceIds = routePlaceIdsForBlocks(blocks);
    if (routePlaceIds.length > MAX_ROUTE_PLACES) issues.push({ code: 'too_many_route_places' });
    if (planKey !== 'potsdam') issues = issues.concat(immediateBacktracks(routePlaceIds, catalog));
    var stats = routeStats(routePlaceIds, catalog);
    var transfers = blocks.reduce(function (items, block) {
      if (block.transferFromPrevious) items.push(block.transferFromPrevious);
      if (block.transferSegment) items.push(block.transferSegment);
      return items;
    }, []);
    return {
      blocks: blocks,
      routePlaceIds: routePlaceIds,
      transfers: transfers,
      totalDistanceKm: stats.totalDistanceKm,
      longestSegmentKm: stats.longestSegmentKm,
      issues: issues
    };
  }

  return {
    VERSION: VERSION,
    MAX_ROUTE_PLACES: MAX_ROUTE_PLACES,
    parseWindow: parseWindow,
    distanceKm: distanceKm,
    canonicalPlaceIds: canonicalPlaceIds,
    routePlaceIdsForBlocks: routePlaceIdsForBlocks,
    createTransfer: createTransfer,
    createArrivalTransfer: createArrivalTransfer,
    mealRoleForBlock: mealRoleForBlock,
    publicMealTransfer: publicMealTransfer,
    immediateBacktracks: immediateBacktracks,
    planDay: planDay
  };
});
