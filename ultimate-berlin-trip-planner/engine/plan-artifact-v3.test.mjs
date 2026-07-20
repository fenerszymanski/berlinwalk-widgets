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
    },
    anchors: [{ placeId: 'alexanderplatz', label: 'Alexanderplatz', area: 'Mitte' }],
    blocks: [
      {
        time: '09:30',
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
  assert.equal(heading, 'Divided Berlin: border traces to the Spree');
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
    title: 'Hackescher Markt',
    primaryPlace: {
      placeId: 'hackescher_markt',
      label: 'Hackescher Markt',
      url: 'https://www.google.com/maps/search/?api=1&query=Hackescher+Markt+Berlin',
    },
  });
  joined.days[0].title = 'Alexanderplatz → Hackescher Markt';
  assert.throws(() => V3.normalizeArtifact(joined), /day_title_repeats_step_1/);

  const thematicJoined = source(1);
  thematicJoined.days[0].blocks.push({
    time: '11:00',
    title: 'Hackescher Markt courtyards',
    primaryPlace: {
      placeId: 'hackescher_markt',
      label: 'Hackescher Markt',
      url: 'https://www.google.com/maps/search/?api=1&query=Hackescher+Markt+Berlin',
    },
  });
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
    title: 'Use the walking tour as your first Berlin introduction',
    primaryPlace: {
      placeId: 'world_clock',
      label: 'World Clock',
      url: 'https://www.google.com/maps/search/?api=1&query=World+Clock+Berlin',
    },
  }, {
    time: '14:00',
    title: 'Lunch near Hackescher Markt',
    primaryPlace: {
      placeId: 'hackescher_markt',
      label: 'Hackescher Markt',
      url: 'https://www.google.com/maps/search/?api=1&query=Hackescher+Markt+Berlin',
    },
  });
  arrival.days[0].title = 'Use the walking tour as your first Berlin introduction and Lunch near Hackescher Markt';
  assert.throws(() => V3.normalizeArtifact(arrival), /day_title_repeats_step_1/);
});
