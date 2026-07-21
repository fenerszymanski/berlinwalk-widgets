import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const V3 = require('./plan-artifact-v3.js');

function source(dayCount = 3) {
  const days = Array.from({ length: dayCount }, (_, index) => ({
    dayNumber: index + 1,
    dateKey: `2026-08-${String(index + 3).padStart(2, '0')}`,
    title: index === 0 ? 'Arrival and first Berlin orientation' : `Berlin day ${index + 1}`,
    theme: index === 0 ? 'Arrival day' : 'Historic centre',
    area: index === 0 ? 'Mitte / Alexanderplatz' : 'Mitte',
    movement: index === 0 ? 'Train + walk' : 'Walk',
    photo: { src: 'assets/day-art/day-oil-history.webp', alt: 'Berlin historic centre' },
    route: {
      label: `Open Day ${index + 1} route`,
      url: `https://www.google.com/maps/dir/?api=1&destination=Berlin&day=${index + 1}`,
      travelMode: 'walking',
      totalDistanceKm: 3.1,
      longestSegmentKm: 1.2,
      placeIds: ['alexanderplatz'],
    },
    anchors: [{ placeId: 'alexanderplatz', label: 'Alexanderplatz', area: 'Mitte' }],
    blocks: [
      {
        time: '09:30',
        window: '09:30-10:45',
        title: 'Alexanderplatz',
        copy: 'Start at the World Clock and look around the square.',
        primaryPlace: {
          placeId: 'alexanderplatz',
          label: 'Alexanderplatz',
          url: 'https://www.google.com/maps/search/?api=1&query=Alexanderplatz+Berlin',
        },
      },
    ],
    planB: 'If rain is steady, shorten the square and use the covered courtyards at Hackescher Markt.',
    decision: 'This day stays in Mitte to avoid a cross-city transfer.',
    risks: [],
  }));
  return {
    engineVersion: 'test-engine-v3',
    createdAt: '2026-07-20T05:00:00.000Z',
    quality: { status: 'pass', validatorVersion: 'test-v1' },
    input: {
      arrivalDate: '2026-08-03',
      tripLength: dayCount,
      arrivalTime: 'morning',
      arrivalPoint: 'ber',
      stayArea: 'mitte',
      interests: ['history'],
      mustHandle: ['rain'],
      labels: { stayArea: 'Mitte / Alexanderplatz', pace: 'Balanced' },
    },
    decisionReceipt: {
      headline: `I have shaped your ${dayCount} Berlin days`,
      guideNote: 'I kept the arrival day light after BER.',
      reasons: ['BER arrival keeps Day 1 compact.'],
    },
    trip: {
      title: `Your ${dayCount}-day Berlin plan`,
      displayDate: '3 August 2026',
      dateRange: '3–5 August 2026',
      stayArea: 'Mitte / Alexanderplatz',
      pace: 'Balanced',
    },
    days,
    beforeYouGo: [{ title: 'BER ticket', detail: 'Buy an ABC ticket before the platform.', url: 'https://www.bvg.de/en' }],
    carryPack: [{ title: 'Daily routes', detail: 'Open the saved Google Maps links.', url: 'https://www.google.com/maps/dir/?api=1&destination=Berlin' }],
    delivery: { browser: true, pdf: true, rendererVersion: 'artifact-v3-test' },
  };
}

test('normalizes a three-day artifact and fixes the PDF count at N + 4', () => {
  const artifact = V3.normalizeArtifact(source(3));
  assert.equal(artifact.schemaVersion, '3.0.0');
  assert.equal(artifact.days.length, 3);
  assert.equal(artifact.delivery.pdfPageCount, 7);
  assert.deepEqual(V3.validateArtifact(artifact), []);
});

test('supports every production trip length from one to seven days', () => {
  for (let count = 1; count <= 7; count += 1) {
    const artifact = V3.normalizeArtifact(source(count));
    assert.equal(artifact.days.length, count);
    assert.equal(artifact.delivery.pdfPageCount, count + 4);
  }
});

test('live weather ends at offset 14 and offset 15 is typical', () => {
  assert.equal(V3.weatherModeForOffset(0), 'live');
  assert.equal(V3.weatherModeForOffset(14), 'live');
  assert.equal(V3.weatherModeForOffset(15), 'typical');
  assert.equal(V3.weatherModeForOffset(-1), 'typical');
});

test('mixed overlay preserves live and typical truth labels', () => {
  const overlay = V3.normalizeWeatherOverlay({
    generatedAt: '2026-07-20T05:00:00.000Z',
    days: [
      { dateKey: '2026-08-03', kind: 'live', isForecast: true, source: 'open-meteo', title: '22 C', checkedAt: '2026-07-20T05:00:00.000Z' },
      { dateKey: '2026-08-04', kind: 'typical', isForecast: false, reason: 'outside_live_window', title: 'Typical August conditions' },
    ],
  });
  assert.equal(overlay.mode, 'mixed');
  assert.equal(overlay.days[0].isForecast, true);
  assert.equal(overlay.days[1].isForecast, false);
});

test('canonical JSON is stable across key order', () => {
  assert.equal(
    V3.stableStringify({ b: 2, a: { d: 4, c: 3 } }),
    V3.stableStringify({ a: { c: 3, d: 4 }, b: 2 }),
  );
});

test('rejects unsafe route URLs and missing Plan B content', () => {
  const invalid = source(1);
  invalid.days[0].route.url = 'javascript:alert(1)';
  invalid.days[0].planB = '';
  assert.throws(() => V3.normalizeArtifact(invalid), /day_route_1.*day_plan_b_1|day_plan_b_1.*day_route_1/);
});

test('view model attaches weather without mutating the artifact', () => {
  const artifact = V3.normalizeArtifact(source(1));
  const before = V3.stableStringify(artifact);
  const view = V3.createViewModel(artifact, {
    days: [{ dateKey: '2026-08-03', kind: 'typical', isForecast: false, title: 'Typical August conditions' }],
  });
  assert.equal(view.days[0].weather.kind, 'typical');
  assert.equal(V3.stableStringify(artifact), before);
});

test('normalized artifacts remain idempotent and keep resource links', () => {
  const first = V3.normalizeArtifact(source(2));
  first.days[0].opening = { status: 'monday', warning: 'Museum opening hours need a final check.' };
  const second = V3.normalizeArtifact(first);
  assert.equal(V3.stableStringify(second), V3.stableStringify(first));
  assert.equal(second.days[0].opening.warning, 'Museum opening hours need a final check.');
  assert.equal(second.beforeYouGo[0].link.url, 'https://www.bvg.de/en');
  assert.match(second.carryPack[0].link.url, /^https:\/\/www\.google\.com\/maps\/dir\//);
});

test('preserves visible link place IDs while only the first meal choice owns the route', () => {
  for (const time of ['Lunch', 'Evening', 'Dinner', 'Later']) {
    const meal = source(1);
    meal.days[0].blocks[0].time = time;
    meal.days[0].blocks[0].mapLinks = [{
      placeId: 'alexanderplatz',
      label: 'Alexanderplatz',
      url: 'https://www.google.com/maps/search/?api=1&query=Alexanderplatz+Berlin',
    }, {
      placeId: 'museum_island',
      label: 'Museum Island alternative',
      url: 'https://www.google.com/maps/search/?api=1&query=Museum+Island+Berlin',
    }];
    const artifact = V3.normalizeArtifact(meal);
    assert.deepEqual(artifact.days[0].blocks[0].placeIds, ['alexanderplatz', 'museum_island']);
    assert.deepEqual(artifact.days[0].blocks[0].links.map((link) => link.placeId), ['alexanderplatz', 'museum_island']);
    assert.deepEqual(artifact.days[0].route.placeIds, ['alexanderplatz']);
  }
});

test('non-meal blocks route every visible ordered place ID', () => {
  const route = source(1);
  route.days[0].blocks[0].mapLinks = [{
    placeId: 'alexanderplatz',
    label: 'Alexanderplatz',
    url: 'https://www.google.com/maps/search/?api=1&query=Alexanderplatz+Berlin',
  }, {
    placeId: 'museum_island',
    label: 'Museum Island',
    url: 'https://www.google.com/maps/search/?api=1&query=Museum+Island+Berlin',
  }];
  route.days[0].route.placeIds = ['alexanderplatz', 'museum_island'];
  const artifact = V3.normalizeArtifact(route);
  assert.deepEqual(artifact.days[0].route.placeIds, ['alexanderplatz', 'museum_island']);
});

test('route contract rejects hidden, reordered and truncated place IDs', () => {
  const hidden = source(1);
  hidden.days[0].route.placeIds.push('hackescher_markt');
  assert.throws(() => V3.normalizeArtifact(hidden), /day_route_place_ids_mismatch_1/);

  const reordered = source(1);
  reordered.days[0].blocks.push({
    time: '11:00',
    window: '11:00-12:00',
    title: 'Hackescher Markt',
    primaryPlace: {
      placeId: 'hackescher_markt',
      label: 'Hackescher Markt',
      url: 'https://www.google.com/maps/search/?api=1&query=Hackescher+Markt+Berlin',
    },
  });
  reordered.days[0].route.placeIds = ['hackescher_markt', 'alexanderplatz'];
  assert.throws(() => V3.normalizeArtifact(reordered), /day_route_place_ids_mismatch_1/);

  const truncated = source(1);
  truncated.days[0].blocks = Array.from({ length: 9 }, (_, index) => ({
    time: `Stop ${index + 1}`,
    window: `${String(8 + index).padStart(2, '0')}:00-${String(9 + index).padStart(2, '0')}:00`,
    title: `Visible stop ${index + 1}`,
    primaryPlace: {
      placeId: `visible_stop_${index + 1}`,
      label: `Visible stop ${index + 1}`,
      url: `https://www.google.com/maps/search/?api=1&query=Visible+stop+${index + 1}+Berlin`,
    },
  }));
  truncated.days[0].route.placeIds = Array.from({ length: 8 }, (_, index) => `visible_stop_${index + 1}`);
  assert.throws(() => V3.normalizeArtifact(truncated), /day_route_place_ids_mismatch_1/);

  const overLimit = source(1);
  overLimit.days[0].route.placeIds = Array.from({ length: 13 }, (_, index) => `visible_stop_${index + 1}`);
  assert.throws(() => V3.normalizeArtifact(overLimit), /day_route_place_ids_1/);
});

test('route-aware artifacts preserve transfer detail, return routes and required time gaps', () => {
  const routeAware = source(1);
  routeAware.quality.routeLogicVersion = 'trip-planner-route-logic-v1';
  routeAware.days[0].blocks = [
    {
      kind: 'transfer',
      time: 'Outbound',
      window: '09:00-10:00',
      title: 'Berlin Hbf to Potsdam Hbf',
      placeIds: ['berlin_hbf', 'potsdam_hbf'],
      primaryPlace: {
        placeId: 'berlin_hbf',
        label: 'Berlin Hbf',
        url: 'https://www.google.com/maps/search/?api=1&query=Berlin+Hbf',
      },
      mapLinks: [{
        placeId: 'potsdam_hbf',
        label: 'Potsdam Hbf',
        url: 'https://www.google.com/maps/search/?api=1&query=Potsdam+Hbf',
      }],
      transferSegment: {
        fromPlaceId: 'berlin_hbf',
        fromLabel: 'Berlin Hbf',
        toPlaceId: 'potsdam_hbf',
        toLabel: 'Potsdam Hbf',
        mode: 'transit',
        minutes: 35,
        bufferMinutes: 10,
        totalMinutes: 45,
        distanceKm: 25.3,
        instruction: 'Take a regional train from Berlin Hbf to Potsdam Hbf.',
        url: 'https://www.google.com/maps/dir/?api=1&origin=Berlin+Hbf&destination=Potsdam+Hbf&travelmode=transit',
      },
    },
    {
      kind: 'activity',
      time: 'Morning',
      window: '10:15-11:30',
      title: 'Potsdam old centre',
      primaryPlace: {
        placeId: 'potsdam_old_market',
        label: 'Alter Markt',
        url: 'https://www.google.com/maps/search/?api=1&query=Alter+Markt+Potsdam',
      },
      transferFromPrevious: {
        fromPlaceId: 'potsdam_hbf',
        fromLabel: 'Potsdam Hbf',
        toPlaceId: 'potsdam_old_market',
        toLabel: 'Alter Markt',
        mode: 'walking',
        minutes: 10,
        bufferMinutes: 5,
        totalMinutes: 15,
        distanceKm: 0.9,
        instruction: 'Walk from Potsdam Hbf to Alter Markt.',
        url: 'https://www.google.com/maps/dir/?api=1&origin=Potsdam+Hbf&destination=Alter+Markt+Potsdam&travelmode=walking',
      },
    },
    {
      kind: 'transfer',
      time: 'Return',
      window: '17:30-18:30',
      title: 'Potsdam Hbf to Berlin Hbf',
      placeIds: ['potsdam_hbf', 'berlin_hbf'],
      primaryPlace: {
        placeId: 'potsdam_hbf',
        label: 'Potsdam Hbf',
        url: 'https://www.google.com/maps/search/?api=1&query=Potsdam+Hbf',
      },
      mapLinks: [{
        placeId: 'berlin_hbf',
        label: 'Berlin Hbf',
        url: 'https://www.google.com/maps/search/?api=1&query=Berlin+Hbf',
      }],
      transferSegment: {
        fromPlaceId: 'potsdam_hbf',
        fromLabel: 'Potsdam Hbf',
        toPlaceId: 'berlin_hbf',
        toLabel: 'Berlin Hbf',
        mode: 'transit',
        minutes: 35,
        bufferMinutes: 10,
        totalMinutes: 45,
        distanceKm: 25.3,
        instruction: 'Take a regional train from Potsdam Hbf to Berlin Hbf.',
        url: 'https://www.google.com/maps/dir/?api=1&origin=Potsdam+Hbf&destination=Berlin+Hbf&travelmode=transit',
      },
      transferFromPrevious: {
        fromPlaceId: 'potsdam_old_market',
        fromLabel: 'Alter Markt',
        toPlaceId: 'potsdam_hbf',
        toLabel: 'Potsdam Hbf',
        mode: 'walking',
        minutes: 10,
        bufferMinutes: 5,
        totalMinutes: 15,
        distanceKm: 0.9,
        instruction: 'Walk from Alter Markt to Potsdam Hbf.',
        url: 'https://www.google.com/maps/dir/?api=1&origin=Alter+Markt+Potsdam&destination=Potsdam+Hbf&travelmode=walking',
      },
    },
  ];
  routeAware.days[0].route.placeIds = ['berlin_hbf', 'potsdam_hbf', 'potsdam_old_market', 'potsdam_hbf', 'berlin_hbf'];

  const artifact = V3.normalizeArtifact(routeAware);
  assert.deepEqual(artifact.days[0].route.placeIds, routeAware.days[0].route.placeIds);
  assert.equal(artifact.days[0].blocks[0].transferSegment.totalMinutes, 45);
  assert.equal(artifact.days[0].blocks[1].transferFromPrevious.totalMinutes, 15);
  assert.equal(V3.deliverySnapshot(artifact).pdf[0].blocks[2].transferSegment.mode, 'transit');
  assert.equal(V3.deliverySnapshot(artifact).browser[0].blocks[1].transferFromPrevious.mode, 'walking');

  const missing = structuredClone(routeAware);
  delete missing.days[0].blocks[1].transferFromPrevious;
  assert.throws(() => V3.normalizeArtifact(missing), /day_transfer_missing_1_2/);

  const impossibleGap = structuredClone(routeAware);
  impossibleGap.days[0].blocks[1].window = '10:05-11:20';
  assert.throws(() => V3.normalizeArtifact(impossibleGap), /day_transfer_gap_1_2/);

  const missingSegment = structuredClone(routeAware);
  delete missingSegment.days[0].blocks[0].transferSegment;
  assert.throws(() => V3.normalizeArtifact(missingSegment), /day_transfer_segment_missing_1_1/);
});

test('block place IDs cannot hide a fallback that has no visible link', () => {
  const hidden = V3.normalizeArtifact(source(1));
  hidden.days[0].blocks[0].placeIds.push('hidden_fallback');
  assert.throws(() => V3.normalizeArtifact(hidden), /day_block_place_ids_mismatch_1_1/);

  const missing = V3.normalizeArtifact(source(1));
  missing.days[0].blocks[0].placeId = '';
  missing.days[0].blocks[0].placeIds = [];
  missing.days[0].blocks[0].links.forEach((link) => { link.placeId = ''; });
  assert.throws(() => V3.normalizeArtifact(missing), /day_block_place_ids_1_1/);
});

test('every block requires a canonical non-overlapping HH:MM-HH:MM range', () => {
  for (const invalidWindow of ['', 'After 18:00', '9:00-10:00', '09:00–10:00', '10:00-09:00']) {
    const invalid = source(1);
    invalid.days[0].blocks[0].window = invalidWindow;
    assert.throws(() => V3.normalizeArtifact(invalid), /day_block_window_1_1/);
  }

  const overlap = source(1);
  overlap.days[0].blocks.push({
    time: 'Late morning',
    window: '10:30-11:30',
    title: 'Hackescher Markt',
    primaryPlace: {
      placeId: 'hackescher_markt',
      label: 'Hackescher Markt',
      url: 'https://www.google.com/maps/search/?api=1&query=Hackescher+Markt+Berlin',
    },
  });
  overlap.days[0].route.placeIds.push('hackescher_markt');
  assert.throws(() => V3.normalizeArtifact(overlap), /day_block_overlap_1_2/);
});

test('typical weather preserves unknown numeric values as null', () => {
  const overlay = V3.normalizeWeatherOverlay({
    days: [{
      dateKey: '2026-08-03',
      kind: 'typical',
      isForecast: false,
      precipitationMm: null,
      windKmh: null,
      weatherCode: null,
      title: 'Typical August conditions',
    }],
  });
  assert.equal(overlay.days[0].precipitationMm, null);
  assert.equal(overlay.days[0].windKmh, null);
  assert.equal(overlay.days[0].weatherCode, null);
});

test('day heading never repeats an exact or one-word-extended stop title', () => {
  const exact = V3.dayPromise({
    dayNumber: 3,
    title: 'East Side Gallery',
    theme: 'Wall and East Berlin',
    area: 'Friedrichshain',
    anchors: [{ label: 'East Side Gallery' }, { label: 'Oberbaum Bridge' }],
  }, [{ title: 'East Side Gallery' }, { title: 'Oberbaum Bridge' }]);
  assert.equal(exact, 'Wall and East Berlin');

  const near = V3.dayPromise({
    dayNumber: 3,
    title: 'East Side Gallery edge',
    theme: 'Cold War geography',
    area: 'Friedrichshain',
    anchors: [{ label: 'East Side Gallery' }, { label: 'Oberbaum Bridge' }],
  }, [{ title: 'East Side Gallery' }, { title: 'Oberbaum Bridge' }]);
  assert.equal(near, 'Cold War geography');

  const embeddedStop = V3.dayPromise({
    dayNumber: 4,
    title: 'Charlottenburg Palace and west-side calm',
    theme: 'Royal West Berlin',
    area: 'Charlottenburg',
    anchors: [{ label: 'Charlottenburg Palace' }, { label: 'Savignyplatz' }],
  }, [{ title: 'Charlottenburg Palace' }, { title: 'Savignyplatz and Lietzensee' }]);
  assert.equal(embeddedStop, 'Royal West Berlin');

  const thematicPlace = V3.dayPromise({
    dayNumber: 2,
    title: 'Museum Island without rushing',
    theme: 'Museum day',
    area: 'Mitte',
    anchors: [{ label: 'Museum Island' }],
  }, [{ title: 'Museum Island' }]);
  assert.equal(thematicPlace, 'Museum Island without rushing');
});

test('day heading rejects a route made by joining the visible anchors', () => {
  const heading = V3.dayPromise({
    dayNumber: 3,
    title: 'Wall Memorial → East Side Gallery → Oberbaum Bridge',
    theme: 'Wall Memorial → East Side Gallery → Oberbaum Bridge',
    area: 'Bernauer Straße → Friedrichshain',
    anchors: [
      { label: 'Wall Memorial' },
      { label: 'East Side Gallery' },
      { label: 'Oberbaum Bridge' },
    ],
  }, [
    { title: 'Wall Memorial' },
    { title: 'East Side Gallery' },
    { title: 'Oberbaum Bridge' },
  ]);
  assert.equal(heading, 'The Wall from Bernauer Straße to the Spree');
});

test('day heading rejects two complete visible steps even with thematic connector words', () => {
  const heading = V3.dayPromise({
    dayNumber: 3,
    title: 'Berlin Wall Memorial through East Side Gallery and Spree edge',
    theme: 'Cold War geography',
    area: 'Bernauer Straße to Friedrichshain',
    anchors: [{ label: 'Berlin Wall Memorial' }, { label: 'East Side Gallery and Spree edge' }],
  }, [
    { title: 'Berlin Wall Memorial' },
    { title: 'East Side Gallery and Spree edge' },
  ]);
  assert.equal(heading, 'Cold War geography');
});

test('day-one transfer label stays distinct from the first-day actions', () => {
  const heading = V3.dayPromise({
    dayNumber: 1,
    title: 'Arrival and first Berlin orientation',
    theme: 'Arrival day',
    area: 'Mitte',
    anchors: [],
  }, [{ title: 'Leave your bags' }], { dayOneLabel: 'BER → Mitte / Alexanderplatz' });
  assert.equal(heading, 'BER → Mitte / Alexanderplatz');
});

test('artifact validation fails closed when a stored day title repeats its visible steps', () => {
  const exact = source(1);
  exact.days[0].title = 'Alexanderplatz';
  assert.throws(() => V3.normalizeArtifact(exact), /day_title_repeats_step_1/);

  const joined = source(1);
  joined.days[0].anchors.push({ placeId: 'hackescher_markt', label: 'Hackescher Markt', area: 'Mitte' });
  joined.days[0].blocks.push({
    time: '11:00',
    window: '11:00-12:00',
    title: 'Hackescher Markt',
    primaryPlace: {
      placeId: 'hackescher_markt',
      label: 'Hackescher Markt',
      url: 'https://www.google.com/maps/search/?api=1&query=Hackescher+Markt+Berlin',
    },
  });
  joined.days[0].route.placeIds.push('hackescher_markt');
  joined.days[0].title = 'Alexanderplatz → Hackescher Markt';
  assert.throws(() => V3.normalizeArtifact(joined), /day_title_repeats_step_1/);

  const thematicJoined = source(1);
  thematicJoined.days[0].blocks.push({
    time: '11:00',
    window: '11:00-12:00',
    title: 'Hackescher Markt courtyards',
    primaryPlace: {
      placeId: 'hackescher_markt',
      label: 'Hackescher Markt',
      url: 'https://www.google.com/maps/search/?api=1&query=Hackescher+Markt+Berlin',
    },
  });
  thematicJoined.days[0].route.placeIds.push('hackescher_markt');
  thematicJoined.days[0].title = 'Alexanderplatz through Hackescher Markt courtyards';
  assert.throws(() => V3.normalizeArtifact(thematicJoined), /day_title_repeats_step_1/);
});

test('artifact validation permits a Day 1 arrival transfer heading without treating it as a sightseeing route', () => {
  const arrival = source(1);
  arrival.days[0].title = 'BER → Mitte / Alexanderplatz';
  arrival.days[0].blocks[0].time = 'Arrival';
  arrival.days[0].blocks[0].primaryPlace = {
    placeId: 'arrival_transfer',
    label: 'BER Airport → Mitte / Alexanderplatz',
    url: 'https://www.google.com/maps/search/?api=1&query=Berlin+Brandenburg+Airport',
  };
  arrival.days[0].blocks.push({
    time: 'Orientation',
    window: '11:00-12:00',
    title: 'World Clock orientation',
    primaryPlace: {
      placeId: 'world_clock',
      label: 'World Clock',
      url: 'https://www.google.com/maps/search/?api=1&query=World+Clock+Berlin',
    },
  });
  arrival.days[0].route.placeIds = ['world_clock'];
  assert.equal(V3.normalizeArtifact(arrival).days[0].title, 'BER → Mitte / Alexanderplatz');
});

test('Day 1 arrival-transfer exception cannot hide a title assembled from later visible steps', () => {
  const arrival = source(1);
  arrival.days[0].blocks[0].time = 'Arrival';
  arrival.days[0].blocks[0].title = 'Get central without over-solving Berlin';
  arrival.days[0].blocks[0].primaryPlace = {
    placeId: 'arrival_transfer',
    label: 'BER Airport → Mitte / Alexanderplatz',
    url: 'https://www.google.com/maps/search/?api=1&query=Berlin+Brandenburg+Airport',
  };
  arrival.days[0].blocks.push({
    time: '11:30',
    window: '11:30-13:00',
    title: 'Use the walking tour as your first Berlin introduction',
    primaryPlace: {
      placeId: 'world_clock',
      label: 'World Clock',
      url: 'https://www.google.com/maps/search/?api=1&query=World+Clock+Berlin',
    },
  }, {
    time: '14:00',
    window: '14:00-15:00',
    title: 'Lunch near Hackescher Markt',
    primaryPlace: {
      placeId: 'hackescher_markt',
      label: 'Hackescher Markt',
      url: 'https://www.google.com/maps/search/?api=1&query=Hackescher+Markt+Berlin',
    },
  });
  arrival.days[0].route.placeIds = ['world_clock', 'hackescher_markt'];
  arrival.days[0].title = 'Use the walking tour as your first Berlin introduction and Lunch near Hackescher Markt';
  assert.throws(() => V3.normalizeArtifact(arrival), /day_title_repeats_step_1/);
});
