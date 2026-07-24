async (page) => {
  await page.waitForFunction(() => Boolean(
    window.__BW_TP_V3_QA__ &&
    window.__BW_TP_ENGINE_V2__ &&
    window.BWPlanArtifactV3
  ), null, { timeout: 30000 });

  const manifest = await page.evaluate(async () => {
    const response = await fetch('/output/qa/trip-planner-v32-matrix-20260721/scenario-manifest.json', {
      cache: 'no-store'
    });
    if (!response.ok) throw new Error(`Scenario manifest returned HTTP ${response.status}`);
    return response.json();
  });

  return page.evaluate((matrix) => {
    const clean = (value) => String(value == null ? '' : value)
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();

    const same = (first, second) => JSON.stringify(first) === JSON.stringify(second);

    const addDays = (dateKey, amount) => {
      const date = new Date(`${dateKey}T12:00:00.000Z`);
      date.setUTCDate(date.getUTCDate() + amount);
      return date.toISOString().slice(0, 10);
    };

    const parsedWindow = (value) => {
      const match = /^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$/.exec(String(value || ''));
      if (!match) return null;
      const start = Number(match[1]) * 60 + Number(match[2]);
      const end = Number(match[3]) * 60 + Number(match[4]);
      return end > start ? { start, end } : null;
    };

    const distanceKm = (first, second) => {
      if (!first || !second || !Number.isFinite(first.lat) || !Number.isFinite(first.lng) || !Number.isFinite(second.lat) || !Number.isFinite(second.lng)) return Infinity;
      const radians = (value) => value * Math.PI / 180;
      const latDelta = radians(second.lat - first.lat);
      const lngDelta = radians(second.lng - first.lng);
      const startLat = radians(first.lat);
      const endLat = radians(second.lat);
      const value = Math.sin(latDelta / 2) ** 2 + Math.cos(startLat) * Math.cos(endLat) * Math.sin(lngDelta / 2) ** 2;
      return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
    };

    const mealTitleAnchor = (title) => {
      const value = clean(title);
      const anchors = [
        { pattern: /potsdam brandenburg|central potsdam|potsdam/, lat: 52.4007, lng: 13.0591, maxKm: 4.0, label: 'Potsdam' },
        { pattern: /charlottenburg palace/, lat: 52.5209, lng: 13.2957, maxKm: 3.0, label: 'Charlottenburg Palace' },
        { pattern: /charlottenburg west|charlottenburg|savigny/, lat: 52.5054, lng: 13.3204, maxKm: 4.0, label: 'Charlottenburg / West' },
        { pattern: /lietzensee/, lat: 52.5082, lng: 13.2877, maxKm: 3.0, label: 'Lietzensee' },
        { pattern: /prenzlauer berg|eberswalder|kulturbrauerei|kastanienallee/, lat: 52.5390, lng: 13.4110, maxKm: 3.0, label: 'Prenzlauer Berg' },
        { pattern: /boxhagener/, lat: 52.5101, lng: 13.4590, maxKm: 2.5, label: 'Boxhagener Platz' },
        { pattern: /oberbaum|east side gallery/, lat: 52.5019, lng: 13.4458, maxKm: 3.0, label: 'Oberbaum Bridge' },
        { pattern: /museum island/, lat: 52.5169, lng: 13.4010, maxKm: 2.5, label: 'Museum Island' },
        { pattern: /hackescher/, lat: 52.5220, lng: 13.4027, maxKm: 3.0, label: 'Hackescher Markt' },
        { pattern: /gendarmenmarkt/, lat: 52.5138, lng: 13.3925, maxKm: 2.5, label: 'Gendarmenmarkt' },
        { pattern: /berlin hbf|hauptbahnhof/, lat: 52.5251, lng: 13.3694, maxKm: 2.5, label: 'Berlin Hbf' },
        { pattern: /mehringdamm/, lat: 52.4936, lng: 13.3882, maxKm: 2.5, label: 'Mehringdamm' },
        { pattern: /bergmann/, lat: 52.4892, lng: 13.3968, maxKm: 2.5, label: 'Bergmannkiez' },
        { pattern: /oranienstrasse|oranienstrasse/, lat: 52.5015, lng: 13.4190, maxKm: 3.0, label: 'Oranienstrasse' },
        { pattern: /friedrichshain/, lat: 52.5101, lng: 13.4590, maxKm: 4.0, label: 'Friedrichshain' },
        { pattern: /kreuzberg/, lat: 52.4980, lng: 13.4030, maxKm: 4.0, label: 'Kreuzberg' },
        { pattern: /mitte/, lat: 52.5170, lng: 13.4000, maxKm: 4.0, label: 'Mitte' }
      ];
      return anchors.find((anchor) => anchor.pattern.test(value)) || null;
    };

    const ownedPlaceIds = (block) => {
      if (!block) return [];
      const isMeal = block.kind !== 'transfer' && (
        /^(lunch|evening|dinner|later)$/i.test(String(block.time || '').trim()) ||
        (block.links || []).some((link) => link && link.kind === 'meal_option')
      );
      const values = isMeal ? [block.placeId] : (Array.isArray(block.placeIds) ? block.placeIds : []);
      return values.map(String).filter((value) => value && value !== 'arrival_transfer');
    };

    const derivedRoute = (blocks) => {
      const route = [];
      (blocks || []).forEach((block) => {
        ownedPlaceIds(block).forEach((placeId) => {
          if (route[route.length - 1] !== placeId) route.push(placeId);
        });
      });
      return route;
    };

    const validIso = (value) => {
      const parsed = new Date(String(value || ''));
      return Boolean(value) && !Number.isNaN(parsed.getTime()) && parsed.toISOString() === value;
    };

    const results = [];

    for (const scenario of matrix.scenarios || []) {
      const issues = [];
      const notes = [];
      const fail = (condition, code, detail) => {
        if (!condition) issues.push({ code, detail: String(detail || '').slice(0, 500) });
      };

      let sourceV2 = null;
      let artifact = null;

      try {
        sourceV2 = window.__BW_TP_ENGINE_V2__.buildScenarioSource(scenario);
      } catch (error) {
        issues.push({
          code: 'source_v2_build_failed',
          detail: String(error && (error.message || error) || 'Unknown V2 source error').slice(0, 500)
        });
      }

      try {
        artifact = window.__BW_TP_V3_QA__.buildScenarioArtifact(scenario);
      } catch (error) {
        issues.push({
          code: 'artifact_v3_build_failed',
          detail: String(error && (error.message || error) || 'Unknown V3 artifact error').slice(0, 500)
        });
      }

      if (artifact) {
        const validation = window.BWPlanArtifactV3.validateArtifact(artifact);
        fail(Array.isArray(validation) && validation.length === 0, 'artifact_validation', JSON.stringify(validation || []));
        fail(artifact.schemaVersion === '3.0.0', 'artifact_schema', artifact.schemaVersion);
        fail(Boolean(artifact.engineVersion), 'engine_version_missing', 'engineVersion is empty');
        fail(artifact.quality && artifact.quality.status === 'pass', 'engine_quality_failed', JSON.stringify(artifact.quality || null));
        fail(
          artifact.quality && artifact.quality.routeLogicVersion === window.BWTripPlannerRouteLogicV1.VERSION,
          'route_logic_version',
          JSON.stringify(artifact.quality || null)
        );
        fail(artifact.input.tripLength === scenario.input.tripLength, 'input_trip_length', `${artifact.input.tripLength} != ${scenario.input.tripLength}`);
        for (const key of ['arrivalDate', 'arrivalTime', 'arrivalPoint', 'stayArea', 'groupType', 'pace', 'tourIntent']) {
          fail(artifact.input[key] === scenario.input[key], `input_${key}`, `${artifact.input[key]} != ${scenario.input[key]}`);
        }
        fail(artifact.days.length === scenario.input.tripLength, 'day_count', `${artifact.days.length} != ${scenario.input.tripLength}`);
        fail(artifact.delivery.pdfPageCount === 0, 'pdf_count_must_be_runtime_owned', JSON.stringify(artifact.delivery));

        try {
          const normalizedAgain = window.BWPlanArtifactV3.normalizeArtifact(artifact);
          fail(
            window.BWPlanArtifactV3.stableStringify(normalizedAgain) === window.BWPlanArtifactV3.stableStringify(artifact),
            'artifact_not_idempotent',
            'A normalized artifact changed during a second normalization.'
          );
        } catch (error) {
          issues.push({ code: 'artifact_renormalize_failed', detail: String(error && (error.message || error) || '') });
        }

        const snapshot = window.__BW_TP_V3_QA__.deliverySnapshot(artifact);
        fail(same(snapshot.browser, snapshot.pdf), 'browser_pdf_drift', 'Browser and PDF delivery snapshots differ.');
        fail(same(snapshot.browser, snapshot.email), 'browser_email_drift', 'Browser and email delivery snapshots differ.');

        const offline = (artifact.carryPack || []).find((item) => /offline pdf/i.test(item.title || ''));
        fail(Boolean(offline), 'offline_caveat_missing', 'Carry pack has no Offline PDF backup item.');
        if (offline) {
          fail(/pdf works offline/i.test(offline.detail || ''), 'offline_pdf_truth_missing', offline.detail);
          fail(/map links need mobile data/i.test(offline.detail || ''), 'offline_map_limit_missing', offline.detail);
        }

        const daySignatures = new Map();
        const majorPlaceSets = [];
        const mealPlaceSets = [];
        artifact.days.forEach((day, dayIndex) => {
          fail(day.dayNumber === dayIndex + 1, 'day_number_sequence', `Day index ${dayIndex} has number ${day.dayNumber}`);
          fail(day.dateKey === addDays(scenario.input.arrivalDate, dayIndex), 'day_date_sequence', `${day.dateKey} at Day ${day.dayNumber}`);
          fail(Boolean(day.planB && day.planB.trim().length >= 20), 'plan_b_missing', `Day ${day.dayNumber}`);

          const route = derivedRoute(day.blocks);
          fail(same(route, day.route.placeIds), 'route_sequence_mismatch', `Day ${day.dayNumber}: ${JSON.stringify(route)} != ${JSON.stringify(day.route.placeIds)}`);

          const daySignature = JSON.stringify(day.route.placeIds);
          if (daySignatures.has(daySignature)) {
            issues.push({
              code: 'duplicate_day_route',
              detail: `Day ${day.dayNumber} repeats Day ${daySignatures.get(daySignature)}: ${daySignature}`
            });
          } else {
            daySignatures.set(daySignature, day.dayNumber);
          }

          const mealPlaceIds = new Set();
          (day.blocks || []).forEach((block) => {
            const isMealBlock = /^(lunch|evening|dinner|later)$/i.test(String(block.time || '').trim()) || /\b(lunch|dinner|meal)\b/i.test(block.title || '');
            if (isMealBlock) {
              const visibleMealIds = (block.links || [])
                .filter((link) => link && link.kind === 'meal_option')
                .map((link) => link.placeId)
                .filter(Boolean);
              (visibleMealIds.length ? visibleMealIds.slice(0, 1) : ownedPlaceIds(block)).forEach((placeId) => mealPlaceIds.add(placeId));
            }
          });
          mealPlaceSets.push(mealPlaceIds);
          majorPlaceSets.push(new Set((day.route.placeIds || []).filter((placeId) =>
            !mealPlaceIds.has(placeId) &&
            !['world_clock', 'berlin_hbf', 'potsdam_hbf'].includes(placeId) &&
            !/_food_search$/.test(placeId)
          )));

          let previousEnd = null;
          let previousEndpoint = '';
          const blockSignatures = new Map();
          const priorNonMealPlaces = new Set();

          (day.blocks || []).forEach((block, blockIndex) => {
            const pointer = `Day ${day.dayNumber}, block ${blockIndex + 1}`;
            const windowRange = parsedWindow(block.window);
            fail(Boolean(windowRange), 'block_window_invalid', `${pointer}: ${block.window}`);
            if (windowRange && previousEnd != null) {
              fail(windowRange.start >= previousEnd, 'block_overlap', `${pointer}: ${block.window} begins before ${previousEnd}`);
            }
            if (windowRange) previousEnd = windowRange.end;

            const blockOwned = ownedPlaceIds(block);
            const signature = `${block.kind}|${clean(block.title)}|${blockOwned.join(',')}`;
            if (blockSignatures.has(signature)) {
              issues.push({
                code: 'duplicate_block',
                detail: `${pointer} repeats block ${blockSignatures.get(signature)}: ${block.title}`
              });
            } else {
              blockSignatures.set(signature, blockIndex + 1);
            }

            const isMeal = /^(lunch|evening|dinner|later)$/i.test(String(block.time || '').trim()) || /\b(lunch|dinner|meal)\b/i.test(block.title || '');
            if (isMeal) {
              const mealLinks = (block.links || []).filter((link) => link && link.kind === 'meal_option');
              const categories = mealLinks.map((link) => clean(String(link.label || '').split(':')[0])).filter(Boolean);
              const mealIds = mealLinks.map((link) => String(link.placeId || '')).filter(Boolean);
              const mealUrls = mealLinks.map((link) => String(link.url || '')).filter(Boolean);
              fail(mealLinks.length === 3, 'meal_option_count', `${pointer}: ${mealLinks.length} options`);
              fail(new Set(categories).size === 3, 'meal_category_count', `${pointer}: ${JSON.stringify(categories)}`);
              fail(new Set(mealIds).size === 3, 'meal_place_id_unique', `${pointer}: ${JSON.stringify(mealIds)}`);
              fail(new Set(mealUrls).size === 3, 'meal_url_unique', `${pointer}: ${JSON.stringify(mealUrls)}`);
              fail(
                mealLinks.every((link) => !/_food_search|\bfood (?:around|near|on|in)\b/i.test(`${link.placeId} ${link.label}`)),
                'meal_internal_anchor_leak',
                `${pointer}: ${JSON.stringify(mealLinks)}`
              );
              const titleAnchor = mealTitleAnchor(block.title || '');
              const mealPlaces = mealLinks.map((link) => window.__BW_TP_V3_QA__.placeMeta(link.placeId));
              fail(mealPlaces.every(Boolean), 'meal_place_meta_missing', `${pointer}: ${JSON.stringify(mealIds)}`);
              if (titleAnchor && mealPlaces.every(Boolean)) {
                mealPlaces.forEach((place) => {
                  const km = distanceKm(titleAnchor, place);
                  fail(km <= titleAnchor.maxKm, 'meal_locality_mismatch', `${pointer}: ${place.placeId} is ${km.toFixed(1)} km from ${titleAnchor.label}`);
                });
              }
            }
            if (isMeal && block.placeId && priorNonMealPlaces.has(block.placeId)) {
              issues.push({
                code: 'meal_repeats_earlier_activity',
                detail: `${pointer}: ${block.title} returns to ${block.placeId} after using it as an earlier activity.`
              });
            }

            const checkTransfer = (transfer, codePrefix, expectedFrom, expectedTo) => {
              fail(Boolean(transfer), `${codePrefix}_missing`, pointer);
              if (!transfer) return;
              if (expectedFrom) fail(transfer.fromPlaceId === expectedFrom, `${codePrefix}_from`, `${pointer}: ${transfer.fromPlaceId} != ${expectedFrom}`);
              if (expectedTo) fail(transfer.toPlaceId === expectedTo, `${codePrefix}_to`, `${pointer}: ${transfer.toPlaceId} != ${expectedTo}`);
              fail(['walking', 'transit'].includes(transfer.mode), `${codePrefix}_mode`, `${pointer}: ${transfer.mode}`);
              fail(Number(transfer.minutes) > 0, `${codePrefix}_minutes`, `${pointer}: ${transfer.minutes}`);
              fail(Number(transfer.bufferMinutes) >= 0, `${codePrefix}_buffer`, `${pointer}: ${transfer.bufferMinutes}`);
              fail(
                Number(transfer.totalMinutes) === Number(transfer.minutes) + Number(transfer.bufferMinutes),
                `${codePrefix}_total`,
                `${pointer}: ${transfer.totalMinutes} != ${transfer.minutes} + ${transfer.bufferMinutes}`
              );
              fail(Boolean(String(transfer.instruction || '').trim()), `${codePrefix}_instruction`, pointer);
              fail(
                !/_food_search|\bfood (?:around|near|on|in)\b/i.test(`${transfer.fromLabel} ${transfer.toLabel} ${transfer.instruction}`),
                `${codePrefix}_internal_meal_label`,
                `${pointer}: ${transfer.instruction}`
              );
              fail(!/\bfrom Your\b/.test(transfer.instruction || ''), `${codePrefix}_sentence_case`, `${pointer}: ${transfer.instruction}`);
              fail(/^https:\/\/www\.google\.com\/maps\/dir\//.test(transfer.url || ''), `${codePrefix}_url`, `${pointer}: ${transfer.url}`);
            };

            if (block.kind === 'transfer') {
              const segment = block.transferSegment;
              const segmentFrom = segment && segment.fromPlaceId || blockOwned[0] || '';
              if (previousEndpoint && previousEndpoint !== segmentFrom) {
                checkTransfer(block.transferFromPrevious, 'transfer_to_segment', previousEndpoint, segmentFrom);
              } else if (block.transferFromPrevious) {
                checkTransfer(block.transferFromPrevious, 'transfer_to_segment', previousEndpoint || '', segmentFrom);
              }
              checkTransfer(segment, 'transfer_segment', segmentFrom, segment && segment.toPlaceId || blockOwned[blockOwned.length - 1] || '');
              previousEndpoint = segment && segment.toPlaceId || blockOwned[blockOwned.length - 1] || previousEndpoint;
            } else {
              const firstPlace = blockOwned[0] || '';
              const lastPlace = blockOwned[blockOwned.length - 1] || firstPlace;
              if (previousEndpoint && firstPlace && previousEndpoint !== firstPlace) {
                checkTransfer(block.transferFromPrevious, 'transfer_from_previous', previousEndpoint, firstPlace);
              } else if (block.transferFromPrevious) {
                checkTransfer(block.transferFromPrevious, 'transfer_from_previous', previousEndpoint || '', firstPlace);
              }
              if (lastPlace) previousEndpoint = lastPlace;
            }

            if (!isMeal) blockOwned.forEach((placeId) => priorNonMealPlaces.add(placeId));

            if (blockOwned.length === 1 && blockOwned[0] === 'oberbaum_bridge' && windowRange) {
              fail(windowRange.end - windowRange.start <= 60, 'oberbaum_duration', `${pointer}: ${block.window}`);
            }
            if (blockOwned.length === 1 && ['oranienstrasse', 'simon_dach_strasse', 'kastanienallee', 'savignyplatz'].includes(blockOwned[0]) && windowRange) {
              fail(windowRange.end - windowRange.start <= 120, 'simple_outdoor_stop_too_long', `${pointer}: ${blockOwned[0]} ${block.window}`);
            }
            if (blockOwned.includes('wall_memorial') && /visitor centre/i.test(block.detail || '') && windowRange) {
              fail(windowRange.start >= 10 * 60, 'wall_memorial_before_visitor_centre', `${pointer}: ${block.window}`);
            }
          });

          if (day.dayNumber === 1) {
            const arrivalBlock = (day.blocks || [])[0];
            const expectedStayArea = artifact.input && artifact.input.labels && artifact.input.labels.stayArea;
            fail(Boolean(expectedStayArea) && day.area === expectedStayArea, 'arrival_area_mismatch', `${day.area} != ${expectedStayArea}`);
            fail(Boolean(expectedStayArea) && (day.decision || '').includes(expectedStayArea), 'arrival_decision_area_mismatch', day.decision || '');
            fail(!/your stay/i.test(day.planB || '') || (day.planB || '').includes(expectedStayArea), 'arrival_plan_b_area_mismatch', day.planB || '');
            fail(arrivalBlock && arrivalBlock.placeId === 'arrival_transfer', 'arrival_block_missing', JSON.stringify(arrivalBlock || null));
            const firstRealBlock = (day.blocks || []).slice(1).find((block) => ownedPlaceIds(block).length > 0);
            fail(Boolean(firstRealBlock), 'arrival_first_real_stop_missing', `Day ${day.dayNumber}`);
            if (firstRealBlock) {
              const firstRealPlace = ownedPlaceIds(firstRealBlock)[0];
              const arrivalTransfer = firstRealBlock.transferFromPrevious;
              fail(Boolean(arrivalTransfer), 'arrival_to_first_stop_missing', JSON.stringify(firstRealBlock));
              if (arrivalTransfer) {
                fail(arrivalTransfer.fromPlaceId === 'arrival_transfer', 'arrival_to_first_stop_from', arrivalTransfer.fromPlaceId);
                fail(arrivalTransfer.toPlaceId === firstRealPlace, 'arrival_to_first_stop_to', `${arrivalTransfer.toPlaceId} != ${firstRealPlace}`);
                fail(Number(arrivalTransfer.minutes) > 0 && Number(arrivalTransfer.totalMinutes) === Number(arrivalTransfer.minutes) + Number(arrivalTransfer.bufferMinutes), 'arrival_to_first_stop_time', JSON.stringify(arrivalTransfer));
                fail(/^https:\/\/www\.google\.com\/maps\/dir\//.test(arrivalTransfer.url || ''), 'arrival_to_first_stop_url', arrivalTransfer.url);
                fail(!/[?&]origin=/.test(arrivalTransfer.url || ''), 'arrival_transfer_fake_origin', arrivalTransfer.url);
              }
            }
            if (scenario.input.arrivalPoint === 'hbf') {
              fail(day.movement === 'Public transport + walk', 'hbf_day1_movement', day.movement);
            }
            const sightseeingPlaceIds = (day.route.placeIds || []).filter((placeId) =>
              !mealPlaceIds.has(placeId) && placeId !== 'arrival_transfer' && !/_food_search$/.test(placeId)
            );
            if (sightseeingPlaceIds.length === 0) {
              fail(!/outdoor loop/i.test(day.planB || ''), 'arrival_plan_b_invents_outdoor_loop', day.planB);
            }
            if (scenario.input.arrivalPoint === 'ber' &&
                ['morning', 'lateMorning', 'midday'].includes(scenario.input.arrivalTime) &&
                (scenario.input.groupType === 'family' || scenario.input.pace === 'gentle')) {
              const lastWindow = parsedWindow((day.blocks[day.blocks.length - 1] || {}).window);
              fail(Boolean(lastWindow) && lastWindow.end <= 19 * 60, 'gentle_ber_arrival_too_long', JSON.stringify((day.blocks || []).map((block) => block.window)));
              const extraSightseeing = (day.blocks || []).filter((block) => {
                const label = `${block.time || ''} ${block.title || ''}`;
                return !/arrival|berlinwalk|tour|lunch|dinner|evening/i.test(label) && ownedPlaceIds(block).length > 0;
              });
              fail(extraSightseeing.length === 0, 'gentle_ber_arrival_extra_sightseeing', JSON.stringify(extraSightseeing));
            }
          }

          if ((day.route.placeIds || []).includes('potsdam_hbf')) {
            const returnBlock = (day.blocks || []).find((block) => block.transferSegment && block.transferSegment.fromPlaceId === 'potsdam_hbf' && block.transferSegment.toPlaceId === 'berlin_hbf');
            const dinnerBlock = (day.blocks || []).find((block) => /^(evening|dinner|later)$/i.test(String(block.time || '')));
            const returnWindow = returnBlock && parsedWindow(returnBlock.window);
            const dinnerWindow = dinnerBlock && parsedWindow(dinnerBlock.window);
            fail(Boolean(returnWindow) && returnWindow.end <= 17 * 60 + 30, 'potsdam_return_too_late', returnBlock && returnBlock.window);
            fail(Boolean(returnWindow) && Boolean(dinnerWindow) && dinnerWindow.start >= returnWindow.end + 30, 'potsdam_dinner_buffer', `${returnBlock && returnBlock.window} -> ${dinnerBlock && dinnerBlock.window}`);
            fail(!/choose (?:one|an) indoor museum/i.test(day.planB || ''), 'potsdam_plan_b_requires_research', day.planB);
          }

          if (/Brandenburg Gate/i.test(day.decision || '') && !(day.route.placeIds || []).includes('brandenburg_gate')) {
            issues.push({ code: 'decision_names_hidden_place', detail: `Day ${day.dayNumber}: ${day.decision}` });
          }
          if (/museum/i.test(`${day.title || ''} ${day.theme || ''}`) && (day.route.placeIds || []).includes('museum_island')) {
            fail(/Museum Island has five museums and Berlin Cathedral\./.test(day.decision || ''), 'museum_island_plain_decision_missing', `Day ${day.dayNumber}: ${day.decision}`);
            fail(/Choose one museum\. Do not try to visit all five in one day\./.test(day.decision || ''), 'museum_island_plain_action_missing', `Day ${day.dayNumber}: ${day.decision}`);
          }
          if ((day.route.placeIds || []).some((placeId) => ['kulturbrauerei', 'kastanienallee', 'prater_biergarten'].includes(placeId))) {
            fail(!/West Berlin/i.test(day.title || ''), 'prenzlauer_title_mismatch', `Day ${day.dayNumber}: ${day.title}`);
          }

          const sourceDay = sourceV2 && (sourceV2.days || []).find((candidate) => candidate.dayNumber === day.dayNumber);
          if (sourceDay && sourceDay.opening) {
            fail(sourceDay.opening.primaryClosed === false, 'closed_primary_place', `Day ${day.dayNumber}: ${JSON.stringify(sourceDay.opening)}`);
            if (sourceDay.opening.warning) {
              fail(Boolean(day.planB), 'opening_warning_without_plan_b', `Day ${day.dayNumber}`);
            }
          }

          const tourBlocks = (day.blocks || []).filter((block) => /berlinwalk/i.test(`${block.title || ''} ${block.detail || ''}`));
          tourBlocks.forEach((block) => {
            fail(
              block.window === '11:30-13:30' || block.window === '15:30-17:30',
              'tour_time_invalid',
              `Day ${day.dayNumber}: ${block.window}`
            );
          });
        });

        for (let dayIndex = 1; dayIndex < artifact.days.length; dayIndex += 1) {
          const repeatedMajorPlaces = [...majorPlaceSets[dayIndex]].filter((placeId) => majorPlaceSets[dayIndex - 1].has(placeId));
          fail(repeatedMajorPlaces.length === 0, 'adjacent_major_place_repeat', `Day ${dayIndex} -> Day ${dayIndex + 1}: ${repeatedMajorPlaces.join(',')}`);
          const repeatedMeals = [...mealPlaceSets[dayIndex]].filter((placeId) => mealPlaceSets[dayIndex - 1].has(placeId));
          fail(repeatedMeals.length === 0, 'adjacent_meal_repeat', `Day ${dayIndex} -> Day ${dayIndex + 1}: ${repeatedMeals.join(',')}`);
          const previousLast = parsedWindow((artifact.days[dayIndex - 1].blocks.slice(-1)[0] || {}).window);
          const currentFirst = parsedWindow((artifact.days[dayIndex].blocks[0] || {}).window);
          if (previousLast && previousLast.end >= 23 * 60) {
            fail(Boolean(currentFirst) && currentFirst.start >= 11 * 60, 'nightlife_recovery_missing', `${artifact.days[dayIndex - 1].blocks.slice(-1)[0].window} -> ${artifact.days[dayIndex].blocks[0].window}`);
          }
        }

        const hasPotsdam = artifact.days.some((day) => (day.route.placeIds || []).includes('potsdam_hbf'));
        if (hasPotsdam) {
          fail(/\bABC\b|zone C/i.test(artifact.trip.ticket || ''), 'potsdam_ticket_zone_c_missing', artifact.trip.ticket);
        } else {
          fail(!/Potsdam day|zone C/i.test(artifact.trip.ticket || ''), 'phantom_potsdam_ticket', artifact.trip.ticket);
        }
        if (scenario.input.tripLength === 1 && scenario.input.arrivalPoint === 'hbf' && scenario.input.arrivalTime === 'evening') {
          fail(/single ticket/i.test(artifact.trip.ticket || ''), 'late_hbf_ticket_not_single', artifact.trip.ticket);
        }

        const decisionReasons = (artifact.decisionReceipt && artifact.decisionReceipt.reasons || []).join(' ');
        fail(!/dinner near (?:arrival day|today'?s route|the route)/i.test(decisionReasons), 'decision_receipt_fake_area', decisionReasons);
        if (!['unsure'].includes(scenario.input.stayArea)) {
          fail(!/dinner near your stay in (?:arrival day|berlin)$/i.test(decisionReasons), 'decision_receipt_generic_area', decisionReasons);
        }

        if (scenario.input.tourIntent === 'booked') {
          fail(artifact.trip.tourFit === 'Already booked', 'booked_tour_state', artifact.trip.tourFit);
          const timedTourBlocks = artifact.days.flatMap((day) => (day.blocks || []).filter((block) => /berlinwalk/i.test(`${block.title || ''} ${block.detail || ''}`)));
          fail(timedTourBlocks.length === 0, 'booked_tour_time_invented', JSON.stringify(timedTourBlocks));
          const bookedResources = [...(artifact.beforeYouGo || []), ...(artifact.carryPack || [])].filter((item) => /berlinwalk|meeting point|booked tour/i.test(`${item.title || ''} ${item.detail || ''}`));
          fail(bookedResources.length > 0, 'booked_meeting_resource_missing', 'No booked-tour preparation resource.');
          fail(bookedResources.some((item) => /booking confirmation/i.test(item.detail || '') && /10 minutes early/i.test(item.detail || '')), 'booked_confirmation_guidance_missing', JSON.stringify(bookedResources));
          bookedResources.forEach((item) => {
            const url = item.link && item.link.url || '';
            fail(!url || /^https:\/\/www\.google\.com\/maps\//.test(url), 'booked_resource_sales_link', url);
          });
          fail(!/Reserve the tour spot/i.test(JSON.stringify(artifact)), 'booked_sales_cta_leak', 'Reserve the tour spot');
        }

        if (scenario.expect && scenario.expect.potsdam === true) {
          const potsdam = artifact.days.find((day) => (day.route.placeIds || []).includes('potsdam_hbf'));
          fail(Boolean(potsdam), 'potsdam_day_missing', 'The scenario explicitly requires a Potsdam day.');
          if (potsdam) {
            const potsdamHbfCount = potsdam.route.placeIds.filter((placeId) => placeId === 'potsdam_hbf').length;
            fail(potsdamHbfCount >= 2, 'potsdam_return_missing', JSON.stringify(potsdam.route.placeIds));
            const transitSegments = potsdam.blocks
              .filter((block) => block.kind === 'transfer' && block.transferSegment)
              .map((block) => `${block.transferSegment.fromPlaceId}>${block.transferSegment.toPlaceId}`);
            fail(transitSegments.includes('berlin_hbf>potsdam_hbf'), 'potsdam_outbound_segment', JSON.stringify(transitSegments));
            fail(transitSegments.includes('potsdam_hbf>berlin_hbf'), 'potsdam_return_segment', JSON.stringify(transitSegments));
          }
        }

        try {
          const weatherDays = Object.values(scenario.dailyWeather || {});
          const overlay = window.BWPlanArtifactV3.normalizeWeatherOverlay({
            generatedAt: scenario.weatherGeneratedAt,
            timezone: 'Europe/Berlin',
            source: scenario.weatherMode === 'typical' ? 'berlin-monthly-climate' : 'open-meteo',
            days: weatherDays
          });
          const view = window.BWPlanArtifactV3.createViewModel(artifact, overlay);
          fail(view.days.length === artifact.days.length, 'weather_view_day_count', `${view.days.length} != ${artifact.days.length}`);
          if (!window.BWPlanArtifactPdfV3 || typeof window.BWPlanArtifactPdfV3.createPagePlan !== 'function') {
            issues.push({ code: 'pdf_renderer_missing', detail: 'BWPlanArtifactPdfV3.createPagePlan is unavailable.' });
          } else {
            const pagePlan = window.BWPlanArtifactPdfV3.createPagePlan(artifact, overlay);
            fail(pagePlan.pageCount === pagePlan.pages.length, 'pdf_dynamic_page_count', `${pagePlan.pageCount} != ${pagePlan.pages.length}`);
            fail(pagePlan.pageCount >= artifact.days.length + 6, 'pdf_dynamic_page_floor', `${pagePlan.pageCount} for ${artifact.days.length} day(s)`);
            const pageErrors = window.BWPlanArtifactPdfV3.validatePagePlan(pagePlan);
            fail(pageErrors.length === 0, 'pdf_page_plan_invalid', JSON.stringify(pageErrors));
          }
          view.days.forEach((day) => {
            const weather = day.weather;
            fail(Boolean(weather), 'weather_day_missing', day.dateKey);
            if (!weather) return;
            if (scenario.weatherMode === 'typical') {
              fail(weather.kind === 'typical', 'weather_typical_kind', `${day.dateKey}: ${weather.kind}`);
              fail(weather.isForecast === false, 'weather_typical_forecast_flag', `${day.dateKey}: ${weather.isForecast}`);
              fail(!weather.checkedAt, 'weather_typical_timestamp', `${day.dateKey}: ${weather.checkedAt}`);
              fail(/not a forecast/i.test(weather.cue || ''), 'weather_typical_caveat', `${day.dateKey}: ${weather.cue}`);
            } else {
              fail(weather.kind === 'live', 'weather_live_kind', `${day.dateKey}: ${weather.kind}`);
              fail(weather.isForecast === true, 'weather_live_forecast_flag', `${day.dateKey}: ${weather.isForecast}`);
              fail(validIso(weather.checkedAt), 'weather_live_timestamp', `${day.dateKey}: ${weather.checkedAt}`);
              if (scenario.weatherMode === 'rain') {
                fail(/rain/i.test(`${weather.title || ''} ${weather.cue || ''}`), 'weather_rain_truth', `${day.dateKey}: ${weather.title} / ${weather.cue}`);
              }
            }
          });
        } catch (error) {
          issues.push({ code: 'weather_overlay_failed', detail: String(error && (error.message || error) || '').slice(0, 500) });
        }
      }

      if (sourceV2 && artifact) {
        fail(sourceV2.days.length === artifact.days.length, 'v2_v3_day_count', `${sourceV2.days.length} != ${artifact.days.length}`);
      }

      notes.push('Plan B closure safety is machine-checked at the primary-place level; named alternatives remain a human-review item because Plan B is unstructured text.');
      results.push({
        id: scenario.id,
        title: scenario.title,
        status: issues.length ? 'FAIL' : 'PASS',
        issues,
        notes
      });
    }

    const passed = results.filter((result) => result.status === 'PASS').length;
    const issueCounts = {};
    const artifactValidatorCodeCounts = {};
    results.forEach((result) => result.issues.forEach((issue) => {
      issueCounts[issue.code] = (issueCounts[issue.code] || 0) + 1;
      if (issue.code === 'artifact_v3_build_failed') {
        const matches = String(issue.detail || '').match(/\bday_[a-z0-9_]+?(?:_\d+)+\b/g) || [];
        matches.forEach((value) => {
          const code = value.replace(/(?:_\d+)+$/, '');
          artifactValidatorCodeCounts[code] = (artifactValidatorCodeCounts[code] || 0) + 1;
        });
      }
    }));

    return {
      schemaVersion: '1.0.0',
      generatedAt: new Date().toISOString(),
      total: results.length,
      passed,
      failed: results.length - passed,
      status: passed === results.length ? 'PASS' : 'FAIL',
      coverage: matrix.coverage,
      issueCounts,
      artifactValidatorCodeCounts,
      results
    };
  }, manifest);
}
