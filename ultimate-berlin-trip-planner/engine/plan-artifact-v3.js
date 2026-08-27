(function (globalScope, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (globalScope) globalScope.BWPlanArtifactV3 = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var SCHEMA_VERSION = '3.0.0';
  var WEATHER_SCHEMA_VERSION = '1.0.0';
  var MAX_ARTIFACT_BYTES = 128 * 1024;
  var MAX_DAYS = 7;
  var MAX_BLOCKS_PER_DAY = 12;
  var MAX_ROUTE_PLACES = 12;
  var ALLOWED_URL_HOSTS = {
    'berlinwalk.com': true,
    'www.berlinwalk.com': true,
    'app.berlinwalk.com': true,
    'google.com': true,
    'www.google.com': true,
    'maps.google.com': true,
    'berlin.de': true,
    'www.berlin.de': true,
    'bvg.de': true,
    'www.bvg.de': true,
    'vbb.de': true,
    'www.vbb.de': true,
    'bundestag.de': true,
    'www.bundestag.de': true,
    'smb.museum': true,
    'www.smb.museum': true,
    'spsg.de': true,
    'www.spsg.de': true,
    'visitberlin.de': true,
    'www.visitberlin.de': true
  };

  function text(value, max) {
    return String(value == null ? '' : value)
      .replace(/[\u0000-\u001f\u007f]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, max || 500);
  }

  function number(value, fallback) {
    if (value === null || value === undefined || value === '') {
      return typeof fallback === 'number' ? fallback : null;
    }
    var parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : (typeof fallback === 'number' ? fallback : null);
  }

  function bool(value) {
    return value === true;
  }

  function dateKey(value) {
    var clean = text(value, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(clean) ? clean : '';
  }

  function iso(value) {
    var clean = text(value, 40);
    var parsed = new Date(clean);
    return clean && !Number.isNaN(parsed.getTime()) ? parsed.toISOString() : '';
  }

  function url(value) {
    var clean = text(value, 1400);
    if (!clean) return '';
    try {
      var parsed = new URL(clean);
      if (parsed.protocol !== 'https:' || !ALLOWED_URL_HOSTS[parsed.hostname.toLowerCase()]) return '';
      parsed.username = '';
      parsed.password = '';
      return parsed.toString();
    } catch (error) {
      return '';
    }
  }

  function list(value, max) {
    return Array.isArray(value) ? value.slice(0, max || 30) : [];
  }

  function placeId(value) {
    return text(value, 100);
  }

  function uniquePlaceIds(values) {
    var seen = {};
    return (Array.isArray(values) ? values : []).map(placeId).filter(function (value) {
      if (!value || seen[value]) return false;
      seen[value] = true;
      return true;
    });
  }

  function placeIdsEqual(first, second) {
    if (!Array.isArray(first) || !Array.isArray(second) || first.length !== second.length) return false;
    return first.every(function (value, index) { return value === second[index]; });
  }

  function routePlaceIdsFromBlocks(blocks) {
    var routeIds = [];
    (Array.isArray(blocks) ? blocks : []).forEach(function (block) {
      var mealAlternatives = /^(Lunch|Evening|Dinner|Later)$/i.test(String(block && block.time || '').trim()) && block && block.kind !== 'transfer';
      var candidates = mealAlternatives ? [block && block.placeId] : (block && block.placeIds || []);
      candidates.forEach(function (candidate) {
        var value = placeId(candidate);
        if (value && value !== 'arrival_transfer' && routeIds[routeIds.length - 1] !== value) routeIds.push(value);
      });
    });
    return routeIds;
  }

  function blockRoutePlaceIds(block) {
    if (!block) return [];
    var mealAlternatives = /^(Lunch|Evening|Dinner|Later)$/i.test(String(block.time || '').trim()) && block.kind !== 'transfer';
    var candidates = mealAlternatives ? [block.placeId] : (block.placeIds || []);
    return candidates.map(placeId).filter(function (value) { return value && value !== 'arrival_transfer'; });
  }

  function parsedWindow(value) {
    var match = /^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$/.exec(String(value || ''));
    if (!match) return null;
    var start = Number(match[1]) * 60 + Number(match[2]);
    var end = Number(match[3]) * 60 + Number(match[4]);
    return end > start ? { start: start, end: end } : null;
  }

  function normalizeLink(source) {
    source = source || {};
    var href = url(source.url || source.href);
    if (!href) return null;
    return {
      label: text(source.label || source.title || 'Open link', 120),
      url: href,
      kind: text(source.kind || '', 40),
      placeId: placeId(source.placeId || '')
    };
  }

  function normalizeTransfer(source) {
    source = source || {};
    if (!source.fromPlaceId || !source.toPlaceId) return null;
    return {
      fromPlaceId: placeId(source.fromPlaceId),
      fromLabel: text(source.fromLabel || '', 160),
      toPlaceId: placeId(source.toPlaceId),
      toLabel: text(source.toLabel || '', 160),
      mode: text(source.mode || '', 20),
      minutes: number(source.minutes, 0),
      bufferMinutes: number(source.bufferMinutes, 0),
      totalMinutes: number(source.totalMinutes, 0),
      distanceKm: number(source.distanceKm, 0),
      instruction: text(source.instruction || '', 360),
      url: url(source.url)
    };
  }

  function normalizeBlock(source, index) {
    source = source || {};
    var linkSources = Array.isArray(source.mapLinks || source.links) ? (source.mapLinks || source.links) : [];
    var links = linkSources.map(normalizeLink).filter(Boolean);
    var primary = normalizeLink(source.primaryPlace || source.primaryLink || null);
    var matchingPrimary = primary && links.find(function (link) { return link.url === primary.url; });
    if (primary && !matchingPrimary) links.unshift(primary);
    else if (matchingPrimary && !matchingPrimary.placeId && primary.placeId) matchingPrimary.placeId = primary.placeId;
    var ownerPlaceId = placeId(
      source.placeId ||
      (source.primaryPlace && source.primaryPlace.placeId) ||
      (source.primaryLink && source.primaryLink.placeId) ||
      (Array.isArray(source.placeIds) && source.placeIds[0]) ||
      (links[0] && links[0].placeId) ||
      ''
    );
    var blockPlaceIds = Array.isArray(source.placeIds)
      ? source.placeIds.map(placeId)
      : uniquePlaceIds([ownerPlaceId].concat(links.map(function (link) { return link.placeId; })));
    return {
      order: index + 1,
      kind: source.kind === 'transfer' ? 'transfer' : 'activity',
      time: text(source.time || 'Next', 40),
      window: text(source.window || '', 80),
      title: text(source.title || 'Berlin stop', 180),
      detail: text(source.detail || source.copy || '', 700),
      placeId: ownerPlaceId,
      placeIds: blockPlaceIds,
      placeLabel: text(source.placeLabel || (source.primaryPlace && source.primaryPlace.label) || '', 160),
      links: links,
      transferFromPrevious: normalizeTransfer(source.transferFromPrevious),
      transferSegment: normalizeTransfer(source.transferSegment)
    };
  }

  function normalizeRisk(source) {
    source = source || {};
    return {
      key: text(source.key || '', 80),
      label: text(source.label || '', 120),
      severity: text(source.severity || 'low', 20),
      detail: text(source.detail || '', 500)
    };
  }

  function normalizeDay(source, index) {
    source = source || {};
    var dayNumber = Number(source.dayNumber || index + 1);
    var blocks = list(source.blocks, MAX_BLOCKS_PER_DAY).map(normalizeBlock);
    var photo = source.photo || {};
    var reservation = source.reservation || null;
    var normalizedReservation = reservation && url(reservation.url) ? {
      required: bool(reservation.required),
      label: text(reservation.label || 'Official reservation', 160),
      url: url(reservation.url),
      source: text(reservation.source || 'official', 80),
      checkedAt: iso(reservation.checkedAt)
    } : null;
    return {
      dayNumber: dayNumber,
      dateKey: dateKey(source.dateKey),
      title: text(source.title || 'Berlin day', 180),
      theme: text(source.theme || source.title || 'Berlin day', 140),
      area: text(source.area || '', 140),
      movement: text(source.movement || '', 100),
      accent: /^#[0-9a-f]{6}$/i.test(text(source.accent, 7)) ? text(source.accent, 7) : '#1B5E20',
      background: /^#[0-9a-f]{6}$/i.test(text(source.background || source.bg, 7)) ? text(source.background || source.bg, 7) : '#F2F8E8',
      photo: {
        src: text(photo.src || source.photoSrc || '', 300),
        alt: text(photo.alt || source.photoAlt || '', 240)
      },
      route: {
        label: text(source.route && source.route.label || source.routeLabel || 'Open the full day route', 160),
        url: url(source.route && source.route.url || source.routeUrl),
        travelMode: text(source.route && source.route.travelMode || '', 30),
        totalDistanceKm: number(source.route && source.route.totalDistanceKm, 0),
        longestSegmentKm: number(source.route && source.route.longestSegmentKm, 0),
        placeIds: source.route && Array.isArray(source.route.placeIds)
          ? source.route.placeIds.map(placeId)
          : []
      },
      anchors: list(source.anchors || source.places, 8).map(function (item) {
        return typeof item === 'string'
          ? { label: text(item, 160), placeId: '', area: '' }
          : { label: text(item && item.label, 160), placeId: text(item && item.placeId, 100), area: text(item && item.area, 120) };
      }).filter(function (item) { return item.label; }),
      blocks: blocks,
      planB: text(source.planB || '', 900),
      decision: text(source.decision || '', 700),
      opening: source.opening ? {
        status: text(source.opening.status || '', 60),
        warning: typeof source.opening.warning === 'string'
          ? text(source.opening.warning, 500)
          : (source.opening.warning ? text(source.opening.warning.detail || source.opening.warning.copy || source.opening.warning.title || '', 500) : '')
      } : null,
      reservation: normalizedReservation,
      risks: list(source.risks, 6).map(normalizeRisk)
    };
  }

  function normalizeInput(source) {
    source = source || {};
    return {
      arrivalDate: dateKey(source.arrivalDate),
      tripLength: Math.max(1, Math.min(MAX_DAYS, Number(source.tripLength) || 1)),
      arrivalTime: text(source.arrivalTime || '', 80),
      arrivalPoint: text(source.arrivalPoint || '', 100),
      stayArea: text(source.stayArea || '', 120),
      groupType: text(source.groupType || '', 100),
      firstTime: text(source.firstTime || '', 60),
      interests: list(source.interests, 12).map(function (item) { return text(item, 80); }).filter(Boolean),
      budgetStyle: text(source.budgetStyle || '', 80),
      mustHandle: list(source.mustHandle, 12).map(function (item) { return text(item, 80); }).filter(Boolean),
      pace: text(source.pace || '', 80),
      tourIntent: text(source.tourIntent || '', 80),
      labels: Object.keys(source.labels || {}).sort().reduce(function (output, key) {
        output[text(key, 80)] = text(source.labels[key], 180);
        return output;
      }, {})
    };
  }

  function normalizeCard(source) {
    source = source || {};
    var link = normalizeLink(source.link || source);
    return {
      title: text(source.title || source.label || '', 180),
      detail: text(source.detail || source.copy || '', 600),
      link: link
    };
  }

  function normalizeArtifact(source) {
    source = source || {};
    var input = normalizeInput(source.input);
    var days = list(source.days || (source.trip && source.trip.days), MAX_DAYS).map(normalizeDay);
    var createdAt = iso(source.createdAt) || new Date().toISOString();
    var trip = source.trip || {};
    var delivery = source.delivery || {};
    var artifact = {
      schemaVersion: SCHEMA_VERSION,
      engineVersion: text(source.engineVersion || '', 100),
      createdAt: createdAt,
      quality: {
        status: text(source.quality && source.quality.status || '', 20),
        validatorVersion: text(source.quality && source.quality.validatorVersion || '', 80),
        routeLogicVersion: text(source.quality && source.quality.routeLogicVersion || '', 80)
      },
      input: input,
      decisionReceipt: {
        headline: text(source.decisionReceipt && source.decisionReceipt.headline || '', 240),
        guideNote: text(source.decisionReceipt && source.decisionReceipt.guideNote || '', 1000),
        reasons: list(source.decisionReceipt && source.decisionReceipt.reasons, 8).map(function (item) { return text(item, 300); }).filter(Boolean)
      },
      trip: {
        title: text(trip.title || source.title || 'Your Berlin plan', 240),
        summary: text(trip.summary || source.summary || '', 1000),
        displayDate: text(trip.displayDate || source.displayDate || '', 100),
        dateRange: text(trip.dateRange || '', 120),
        tripLength: days.length,
        stayArea: text(trip.stayArea || input.labels.stayArea || '', 140),
        pace: text(trip.pace || input.labels.pace || '', 100),
        ticket: text(trip.ticket || source.ticket || '', 500),
        tourFit: text(trip.tourFit || source.tourFit || '', 500)
      },
      days: days,
      beforeYouGo: list(source.beforeYouGo, 12).map(normalizeCard).filter(function (item) { return item.title; }),
      carryPack: list(source.carryPack, 12).map(normalizeCard).filter(function (item) { return item.title; }),
      delivery: {
        browser: delivery.browser !== false,
        pdf: delivery.pdf !== false,
        pdfPageCount: days.length + 4,
        rendererVersion: text(delivery.rendererVersion || 'artifact-v3', 80)
      }
    };
    var errors = validateArtifact(artifact);
    if (errors.length) {
      var error = new Error('Invalid PlanArtifactV3: ' + errors.join('; '));
      error.code = 'invalid_plan_artifact_v3';
      error.details = errors;
      throw error;
    }
    return artifact;
  }

  function normalizeWeatherDay(source) {
    source = source || {};
    var kind = source.kind === 'live' ? 'live' : 'typical';
    return {
      dateKey: dateKey(source.dateKey),
      kind: kind,
      isForecast: kind === 'live' && source.isForecast !== false,
      source: text(source.source || (kind === 'live' ? 'open-meteo' : 'berlin-monthly-climate'), 80),
      checkedAt: iso(source.checkedAt),
      reason: text(source.reason || '', 80),
      highC: number(source.highC, null),
      lowC: number(source.lowC, null),
      rainProbability: number(source.rainProbability, null),
      precipitationMm: number(source.precipitationMm, null),
      windKmh: number(source.windKmh, null),
      weatherCode: number(source.weatherCode, null),
      title: text(source.title || '', 180),
      cue: text(source.cue || '', 500)
    };
  }

  function normalizeWeatherOverlay(source) {
    source = source || {};
    var days = list(source.days, MAX_DAYS).map(normalizeWeatherDay).filter(function (item) { return item.dateKey; });
    var hasLive = days.some(function (day) { return day.kind === 'live'; });
    var hasTypical = days.some(function (day) { return day.kind === 'typical'; });
    return {
      schemaVersion: WEATHER_SCHEMA_VERSION,
      generatedAt: iso(source.generatedAt) || new Date().toISOString(),
      timezone: 'Europe/Berlin',
      source: text(source.source || (hasLive ? 'open-meteo' : 'berlin-monthly-climate'), 80),
      mode: hasLive && hasTypical ? 'mixed' : (hasLive ? 'live' : 'typical'),
      days: days
    };
  }

  function validateArtifact(artifact) {
    var errors = [];
    if (!artifact || artifact.schemaVersion !== SCHEMA_VERSION) errors.push('schema_version');
    if (!artifact || !artifact.engineVersion) errors.push('engine_version');
    if (!artifact || !artifact.quality || artifact.quality.status !== 'pass') errors.push('quality_status');
    var days = artifact && Array.isArray(artifact.days) ? artifact.days : [];
    if (!days.length || days.length > MAX_DAYS) errors.push('day_count');
    if (artifact && artifact.input && Number(artifact.input.tripLength) !== days.length) errors.push('trip_length_mismatch');
    var seenDates = {};
    days.forEach(function (day, index) {
      if (day.dayNumber !== index + 1) errors.push('day_sequence_' + (index + 1));
      if (!day.dateKey) errors.push('day_date_' + (index + 1));
      if (seenDates[day.dateKey]) errors.push('duplicate_date_' + day.dateKey);
      seenDates[day.dateKey] = true;
      if (!day.blocks.length || day.blocks.length > MAX_BLOCKS_PER_DAY) errors.push('day_blocks_' + (index + 1));
      var timedBlocks = [];
      day.blocks.forEach(function (block, blockIndex) {
        var blockNumber = blockIndex + 1;
        if (!parsedWindow(block.window)) errors.push('day_block_window_' + (index + 1) + '_' + blockNumber);
        else timedBlocks.push({ index: blockIndex, window: parsedWindow(block.window) });
        if (!Array.isArray(block.placeIds) || block.placeIds.length < 1 || block.placeIds.length > 8) {
          errors.push('day_block_place_ids_' + (index + 1) + '_' + blockNumber);
          return;
        }
        if (!Array.isArray(block.links) || block.links.length > 8) {
          errors.push('day_block_links_' + (index + 1) + '_' + blockNumber);
        }
        if (block.placeIds.some(function (value) { return !/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(value); })) {
          errors.push('day_block_place_id_format_' + (index + 1) + '_' + blockNumber);
        }
        if (uniquePlaceIds(block.placeIds).length !== block.placeIds.length) {
          errors.push('day_block_place_id_duplicate_' + (index + 1) + '_' + blockNumber);
        }
        var expectedBlockPlaceIds = uniquePlaceIds([block.placeId].concat(block.links.map(function (link) { return link.placeId; })));
        if (!placeIdsEqual(block.placeIds, expectedBlockPlaceIds)) {
          errors.push('day_block_place_ids_mismatch_' + (index + 1) + '_' + blockNumber);
        }
        var transfer = block.transferFromPrevious;
        if (transfer) {
          if (!/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(transfer.fromPlaceId) || !/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(transfer.toPlaceId)) {
            errors.push('day_transfer_place_id_' + (index + 1) + '_' + blockNumber);
          }
          if (['walking', 'transit'].indexOf(transfer.mode) === -1) errors.push('day_transfer_mode_' + (index + 1) + '_' + blockNumber);
          if (!(transfer.minutes > 0) || transfer.bufferMinutes < 0 || transfer.totalMinutes !== transfer.minutes + transfer.bufferMinutes) {
            errors.push('day_transfer_minutes_' + (index + 1) + '_' + blockNumber);
          }
          if (!transfer.fromLabel || !transfer.toLabel || !transfer.instruction || !transfer.url) {
            errors.push('day_transfer_detail_' + (index + 1) + '_' + blockNumber);
          }
        }
        var segment = block.transferSegment;
        if (segment) {
          if (!/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(segment.fromPlaceId) || !/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(segment.toPlaceId)) {
            errors.push('day_transfer_segment_place_id_' + (index + 1) + '_' + blockNumber);
          }
          if (['walking', 'transit'].indexOf(segment.mode) === -1) errors.push('day_transfer_segment_mode_' + (index + 1) + '_' + blockNumber);
          if (!(segment.minutes > 0) || segment.bufferMinutes < 0 || segment.totalMinutes !== segment.minutes + segment.bufferMinutes) {
            errors.push('day_transfer_segment_minutes_' + (index + 1) + '_' + blockNumber);
          }
          if (!segment.fromLabel || !segment.toLabel || !segment.instruction || !segment.url) {
            errors.push('day_transfer_segment_detail_' + (index + 1) + '_' + blockNumber);
          }
        }
      });
      timedBlocks.sort(function (first, second) { return first.window.start - second.window.start; });
      for (var timedIndex = 1; timedIndex < timedBlocks.length; timedIndex += 1) {
        if (timedBlocks[timedIndex].window.start < timedBlocks[timedIndex - 1].window.end) {
          errors.push('day_block_overlap_' + (index + 1) + '_' + (timedBlocks[timedIndex].index + 1));
        }
      }
      if (artifact && artifact.quality && artifact.quality.routeLogicVersion) {
        day.blocks.forEach(function (block, blockIndex) {
          var routeIds = blockRoutePlaceIds(block);
          if (block.kind === 'transfer') {
            var segment = block.transferSegment;
            if (!segment) {
              errors.push('day_transfer_segment_missing_' + (index + 1) + '_' + (blockIndex + 1));
            } else if (segment.fromPlaceId !== routeIds[0] || segment.toPlaceId !== routeIds[routeIds.length - 1]) {
              errors.push('day_transfer_segment_order_' + (index + 1) + '_' + (blockIndex + 1));
            }
          } else if (block.transferSegment) {
            errors.push('day_transfer_segment_unexpected_' + (index + 1) + '_' + (blockIndex + 1));
          }
        });
        for (var blockIndex = 1; blockIndex < day.blocks.length; blockIndex += 1) {
          var previousBlock = day.blocks[blockIndex - 1];
          var currentBlock = day.blocks[blockIndex];
          var previousIds = blockRoutePlaceIds(previousBlock);
          var currentIds = blockRoutePlaceIds(currentBlock);
          var expectedFrom = previousIds[previousIds.length - 1] || '';
          var expectedTo = currentIds[0] || '';
          var needsTransfer = expectedFrom && expectedTo && expectedFrom !== expectedTo;
          var currentTransfer = currentBlock.transferFromPrevious;
          if (needsTransfer && !currentTransfer) {
            errors.push('day_transfer_missing_' + (index + 1) + '_' + (blockIndex + 1));
            continue;
          }
          if (!needsTransfer && currentTransfer) {
            errors.push('day_transfer_unexpected_' + (index + 1) + '_' + (blockIndex + 1));
            continue;
          }
          if (currentTransfer) {
            if (currentTransfer.fromPlaceId !== expectedFrom || currentTransfer.toPlaceId !== expectedTo) {
              errors.push('day_transfer_order_' + (index + 1) + '_' + (blockIndex + 1));
            }
            var previousWindow = parsedWindow(previousBlock.window);
            var currentWindow = parsedWindow(currentBlock.window);
            if (previousWindow && currentWindow && currentWindow.start < previousWindow.end + currentTransfer.totalMinutes) {
              errors.push('day_transfer_gap_' + (index + 1) + '_' + (blockIndex + 1));
            }
          }
        }
      }
      var routePlaceIds = day.route && Array.isArray(day.route.placeIds) ? day.route.placeIds : [];
      if (routePlaceIds.length < 1 || routePlaceIds.length > MAX_ROUTE_PLACES) errors.push('day_route_place_ids_' + (index + 1));
      if (routePlaceIds.some(function (value) { return !/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(value); })) {
        errors.push('day_route_place_id_format_' + (index + 1));
      }
      if (routePlaceIds.some(function (value, routeIndex) { return routeIndex > 0 && routePlaceIds[routeIndex - 1] === value; })) {
        errors.push('day_route_place_id_consecutive_duplicate_' + (index + 1));
      }
      var expectedRoutePlaceIds = routePlaceIdsFromBlocks(day.blocks);
      if (!placeIdsEqual(routePlaceIds, expectedRoutePlaceIds)) errors.push('day_route_place_ids_mismatch_' + (index + 1));
      var stepKeys = day.blocks.map(function (block) { return headlineKey(block && block.title); }).filter(Boolean);
      var anchorKeys = day.anchors.map(function (anchor) { return headlineKey(anchor && anchor.label); }).filter(Boolean);
      var expectedArrivalTitle = artifact && artifact.input && artifact.input.arrivalPoint === 'ber' &&
        artifact.input.labels && artifact.input.labels.stayArea
        ? headlineKey('BER -> ' + artifact.input.labels.stayArea)
        : '';
      var isArrivalTransferTitle = day.dayNumber === 1 && expectedArrivalTitle &&
        headlineKey(day.title) === expectedArrivalTitle && day.blocks.some(function (block) {
          return block && block.placeId === 'arrival_transfer';
        }) && stepKeys.indexOf(headlineKey(day.title)) === -1;
      if (!isArrivalTransferTitle && !headlineIsDistinct(day.title, stepKeys, anchorKeys)) errors.push('day_title_repeats_step_' + (index + 1));
      if (!day.route.url) errors.push('day_route_' + (index + 1));
      if (!day.planB) errors.push('day_plan_b_' + (index + 1));
    });
    if (artifact && artifact.delivery && artifact.delivery.pdfPageCount !== days.length + 4) errors.push('pdf_page_count');
    var bytes = byteLength(stableStringify(artifact));
    if (bytes > MAX_ARTIFACT_BYTES) errors.push('artifact_too_large');
    return Array.from(new Set(errors));
  }

  function sortValue(value) {
    if (Array.isArray(value)) return value.map(sortValue);
    if (!value || typeof value !== 'object') return value;
    return Object.keys(value).sort().reduce(function (output, key) {
      output[key] = sortValue(value[key]);
      return output;
    }, {});
  }

  function stableStringify(value) {
    return JSON.stringify(sortValue(value));
  }

  function byteLength(value) {
    if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(String(value || '')).length;
    if (typeof Buffer !== 'undefined') return Buffer.byteLength(String(value || ''), 'utf8');
    return unescape(encodeURIComponent(String(value || ''))).length;
  }

  function createViewModel(artifactSource, weatherSource) {
    var artifact = normalizeArtifact(artifactSource);
    var weather = normalizeWeatherOverlay(weatherSource || {});
    var weatherByDate = {};
    weather.days.forEach(function (day) { weatherByDate[day.dateKey] = day; });
    return {
      artifact: artifact,
      weather: weather,
      trip: artifact.trip,
      input: artifact.input,
      decisionReceipt: artifact.decisionReceipt,
      days: artifact.days.map(function (day) {
        var copy = JSON.parse(JSON.stringify(day));
        copy.weather = weatherByDate[day.dateKey] || null;
        return copy;
      }),
      beforeYouGo: artifact.beforeYouGo,
      carryPack: artifact.carryPack,
      delivery: artifact.delivery
    };
  }

  function weatherModeForOffset(offset) {
    var value = Number(offset);
    return Number.isFinite(value) && value >= 0 && value <= 14 ? 'live' : 'typical';
  }

  function deliverySnapshot(source) {
    var artifact = normalizeArtifact(source);
    var days = artifact.days.map(function (day) {
      return {
        dayNumber: day.dayNumber,
        dateKey: day.dateKey,
        title: day.title,
        decision: day.decision,
        routeUrl: day.route.url,
        routePlaceIds: day.route.placeIds.slice(),
        planB: day.planB,
        blocks: day.blocks.map(function (block) {
          return {
            order: block.order,
            kind: block.kind,
            window: block.window || block.time,
            title: block.title,
            detail: block.detail,
            placeId: block.placeId,
            placeIds: block.placeIds.slice(),
            links: block.links.map(function (link) { return { placeId: link.placeId, url: link.url }; }),
            transferFromPrevious: block.transferFromPrevious ? Object.assign({}, block.transferFromPrevious) : null,
            transferSegment: block.transferSegment ? Object.assign({}, block.transferSegment) : null
          };
        })
      };
    });
    return {
      browser: JSON.parse(JSON.stringify(days)),
      pdf: JSON.parse(JSON.stringify(days)),
      email: JSON.parse(JSON.stringify(days))
    };
  }

  function headlineKey(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function headlineTokens(value) {
    var ignored = {
      a: true, an: true, and: true, at: true, day: true, for: true, from: true,
      in: true, of: true, on: true, the: true, then: true, to: true, with: true
    };
    return headlineKey(value).split(' ').filter(function (token) {
      return token && !ignored[token];
    });
  }

  function headlineIsDistinct(candidate, stepKeys, anchorKeys) {
    var key = headlineKey(candidate);
    if (!key || stepKeys.indexOf(key) !== -1) return false;
    if (/[→>]/.test(String(candidate || ''))) return false;
    if (anchorKeys.length > 1 && anchorKeys.every(function (anchorKey) { return key.indexOf(anchorKey) !== -1; })) {
      return false;
    }
    var candidateTokens = headlineTokens(candidate);
    var thematicTokens = {
      after: true, before: true, beyond: true, geography: true, layers: true,
      one: true, rhythm: true, save: true, slower: true, through: true,
      traces: true, without: true
    };
    var hasThematicMove = candidateTokens.some(function (token) { return thematicTokens[token]; });
    var matchedStepKeys = {};
    stepKeys.forEach(function (stepKey) {
      var stepTokens = headlineTokens(stepKey);
      if (stepTokens.length && stepTokens.every(function (token) { return candidateTokens.indexOf(token) !== -1; })) {
        matchedStepKeys[stepKey] = true;
      }
    });
    if (Object.keys(matchedStepKeys).length >= 2) return false;
    return !stepKeys.some(function (stepKey) {
      var stepTokens = headlineTokens(stepKey);
      if (!stepTokens.length || !candidateTokens.length) return false;
      var shared = candidateTokens.filter(function (token) { return stepTokens.indexOf(token) !== -1; });
      var coverage = shared.length / Math.max(candidateTokens.length, stepTokens.length);
      var oneWordExtension = shared.length === Math.min(candidateTokens.length, stepTokens.length) &&
        Math.abs(candidateTokens.length - stepTokens.length) <= 1;
      var containsFullStop = stepTokens.length >= 2 && stepTokens.every(function (token) { return candidateTokens.indexOf(token) !== -1; });
      return (coverage >= 0.85 && Math.abs(candidateTokens.length - stepTokens.length) <= 1) ||
        oneWordExtension ||
        (containsFullStop && !hasThematicMove);
    });
  }

  function dayPromise(day, blocks, options) {
    day = day || {};
    options = options || {};
    if (Number(day.dayNumber) === 1 && options.dayOneLabel) return text(options.dayOneLabel, 180);
    var stepKeys = list(blocks, MAX_BLOCKS_PER_DAY).map(function (block) { return headlineKey(block && block.title); }).filter(Boolean);
    var anchorKeys = list(day.anchors, 3).map(function (anchor) { return headlineKey(anchor && anchor.label); }).filter(Boolean);
    var candidates = [day.title, day.theme].filter(Boolean);
    var distinct = candidates.find(function (candidate) { return headlineIsDistinct(candidate, stepKeys, anchorKeys); });
    if (distinct) return text(distinct, 180);
    var context = headlineKey([day.title, day.theme, day.area].join(' '));
    if (/wall|cold war|divid/.test(context)) return 'The Wall from Bernauer Straße to the Spree';
    if (/museum/.test(context)) return 'Museum Island and the Spree';
    if (/potsdam|palace/.test(context)) return 'Potsdam and Sanssouci';
    if (/food|market/.test(context)) return 'Markets and food in Kreuzberg';
    if (/night|club/.test(context)) return 'Friedrichshain in the evening';
    if (/free|budget/.test(context)) return 'Free places in central Berlin';
    if (/history|memorial|prussia/.test(context)) return 'Brandenburg Gate and 20th-century history';
    if (/charlottenburg|west berlin/.test(context)) return 'Charlottenburg: palace, square and lake';
    if (/park|garden|nature/.test(context)) return text((day.area || 'Berlin') + ' parks', 180);
    return text((day.area || 'Berlin') + ' route', 180);
  }

  return {
    SCHEMA_VERSION: SCHEMA_VERSION,
    WEATHER_SCHEMA_VERSION: WEATHER_SCHEMA_VERSION,
    MAX_ARTIFACT_BYTES: MAX_ARTIFACT_BYTES,
    MAX_ROUTE_PLACES: MAX_ROUTE_PLACES,
    normalizeArtifact: normalizeArtifact,
    normalizeWeatherOverlay: normalizeWeatherOverlay,
    createViewModel: createViewModel,
    validateArtifact: validateArtifact,
    stableStringify: stableStringify,
    weatherModeForOffset: weatherModeForOffset,
    deliverySnapshot: deliverySnapshot,
    dayPromise: dayPromise
  };
});
