async (page) => {
  await page.waitForFunction(() => Boolean(window.__BW_TP_V3_QA__ && window.BWPlanArtifactV3), null, { timeout: 30000 });

  return page.evaluate(() => {
    const clean = (value) => String(value == null ? '' : value)
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();

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
        { pattern: /oranienstra/, lat: 52.5015, lng: 13.4190, maxKm: 3.0, label: 'Oranienstrasse' },
        { pattern: /friedrichshain/, lat: 52.5101, lng: 13.4590, maxKm: 4.0, label: 'Friedrichshain' },
        { pattern: /kreuzberg/, lat: 52.4980, lng: 13.4030, maxKm: 4.0, label: 'Kreuzberg' },
        { pattern: /mitte/, lat: 52.5170, lng: 13.4000, maxKm: 4.0, label: 'Mitte' }
      ];
      return anchors.find((anchor) => anchor.pattern.test(value)) || null;
    };

    const dateForMonthAndWeekday = (monthIndex, weekday) => {
      for (let day = 1; day <= 7; day += 1) {
        const date = new Date(Date.UTC(2027, monthIndex, day, 12));
        if (date.getUTCDay() === weekday) return date.toISOString().slice(0, 10);
      }
      throw new Error(`No weekday ${weekday} in month ${monthIndex + 1}`);
    };

    const profiles = [
      { id: 'mitte-history', arrivalPoint: 'ber', stayArea: 'mitte', groupType: 'solo', pace: 'balanced', interests: ['history', 'museums', 'wall', 'free'], tourIntent: 'considering', mustHandle: [] },
      { id: 'north-family', arrivalPoint: 'hbf', stayArea: 'north', groupType: 'family', pace: 'gentle', interests: ['museums', 'history', 'wall', 'food'], tourIntent: 'maybe', mustHandle: ['kids', 'rain'] },
      { id: 'west-potsdam', arrivalPoint: 'hotel', stayArea: 'west', groupType: 'couple', pace: 'balanced', interests: ['potsdam', 'history', 'museums', 'food'], tourIntent: 'considering', mustHandle: ['reservations'] },
      { id: 'east-nightlife', arrivalPoint: 'ber', stayArea: 'east', groupType: 'solo', pace: 'packed', interests: ['nightlife', 'food', 'wall', 'history'], tourIntent: 'maybe', mustHandle: [] },
      { id: 'mitte-booked', arrivalPoint: 'hbf', stayArea: 'mitte', groupType: 'couple', pace: 'balanced', interests: ['history', 'wall', 'museums', 'food'], tourIntent: 'booked', mustHandle: ['photos'] },
      { id: 'north-slow', arrivalPoint: 'hotel', stayArea: 'north', groupType: 'slow', pace: 'gentle', interests: ['food', 'free', 'museums', 'history'], tourIntent: 'considering', mustHandle: ['rain'] }
    ];

    const failures = [];
    let scenarioCount = 0;
    let mealCount = 0;

    for (let month = 0; month < 12; month += 1) {
      for (let weekday = 0; weekday < 7; weekday += 1) {
        const arrivalDate = dateForMonthAndWeekday(month, weekday);
        for (const profile of profiles) {
          scenarioCount += 1;
          const scenarioId = `${profile.id}-${arrivalDate}`;
          let artifact;
          try {
            artifact = window.__BW_TP_V3_QA__.buildScenarioArtifact({
              input: {
                arrivalDate,
                tripLength: 7,
                arrivalTime: 'morning',
                arrivalPoint: profile.arrivalPoint,
                stayArea: profile.stayArea,
                groupType: profile.groupType,
                firstTime: 'yes',
                interests: profile.interests,
                budgetStyle: 'smart',
                mustHandle: profile.mustHandle,
                pace: profile.pace,
                tourIntent: profile.tourIntent
              }
            });
          } catch (error) {
            failures.push({ scenarioId, code: 'artifact_build', detail: String(error && (error.message || error) || '') });
            continue;
          }

          const arrivalDay = (artifact.days || [])[0];
          const expectedStayArea = artifact.input && artifact.input.labels && artifact.input.labels.stayArea;
          const planBMatchesStay = arrivalDay && (!/your stay/i.test(arrivalDay.planB || '') || (arrivalDay.planB || '').includes(expectedStayArea || ''));
          if (!arrivalDay || !expectedStayArea || arrivalDay.area !== expectedStayArea || !(arrivalDay.decision || '').includes(expectedStayArea) || !planBMatchesStay) {
            failures.push({
              scenarioId,
              code: 'arrival_area',
              detail: `${arrivalDay && arrivalDay.area || 'missing'} != ${expectedStayArea || 'missing'}`
            });
          }

          for (const day of artifact.days || []) {
            for (const block of day.blocks || []) {
              const mealLinks = (block.links || []).filter((link) => link && link.kind === 'meal_option');
              if (!mealLinks.length) continue;
              mealCount += 1;
              const pointer = `${scenarioId} Day ${day.dayNumber} ${block.time}`;
              const categories = mealLinks.map((link) => clean(String(link.label || '').split(':')[0])).filter(Boolean);
              const ids = mealLinks.map((link) => String(link.placeId || '')).filter(Boolean);
              const urls = mealLinks.map((link) => String(link.url || '')).filter(Boolean);
              if (mealLinks.length !== 3) failures.push({ scenarioId, code: 'count', detail: `${pointer}: ${mealLinks.length}` });
              if (new Set(categories).size !== 3) failures.push({ scenarioId, code: 'categories', detail: `${pointer}: ${categories.join(',')}` });
              if (new Set(ids).size !== 3) failures.push({ scenarioId, code: 'ids', detail: `${pointer}: ${ids.join(',')}` });
              if (new Set(urls).size !== 3) failures.push({ scenarioId, code: 'urls', detail: `${pointer}: duplicate URL` });
              if (/_food_search|\bfood (?:around|near|on|in)\b/i.test(mealLinks.map((link) => `${link.placeId} ${link.label}`).join(' '))) {
                failures.push({ scenarioId, code: 'internal_label', detail: pointer });
              }
              const anchor = mealTitleAnchor(block.title || '');
              if (anchor) {
                mealLinks.forEach((link) => {
                  const place = window.__BW_TP_V3_QA__.placeMeta(link.placeId);
                  const km = distanceKm(anchor, place);
                  if (km > anchor.maxKm) failures.push({ scenarioId, code: 'locality', detail: `${pointer}: ${link.placeId} ${km.toFixed(1)} km from ${anchor.label}` });
                });
              }
            }
          }

          if (/\bfrom Your\b|Walk from Food|_food_search/.test((artifact.days || []).flatMap((day) => (day.blocks || []).map((block) => block.transferFromPrevious && block.transferFromPrevious.instruction || '')).join(' '))) {
            failures.push({ scenarioId, code: 'transfer_copy', detail: 'Internal or sentence-case transfer copy leaked.' });
          }
        }
      }
    }

    const counts = {};
    failures.forEach((failure) => { counts[failure.code] = (counts[failure.code] || 0) + 1; });
    return {
      status: failures.length ? 'FAIL' : 'PASS',
      scenarios: scenarioCount,
      meals: mealCount,
      expectedScenarios: 504,
      expectedMeals: 7056,
      issueCounts: counts,
      failures: failures.slice(0, 30)
    };
  });
}
