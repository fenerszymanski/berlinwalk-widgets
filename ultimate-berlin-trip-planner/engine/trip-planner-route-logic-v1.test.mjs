import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const RouteLogic = require('./trip-planner-route-logic-v1.js');

const catalog = {
  world_clock: { label: 'World Clock', query: 'Weltzeituhr Alexanderplatz Berlin', type: 'landmark', lat: 52.5219, lng: 13.4132 },
  wall_memorial: { label: 'Berlin Wall Memorial', type: 'history', lat: 52.5351, lng: 13.3903 },
  friedrichshain_food_search: { label: 'Food in Friedrichshain', type: 'food', lat: 52.5103, lng: 13.4587 },
  vegan_1990: { label: '1990 Vegan Living', type: 'food', lat: 52.5104, lng: 13.4588 },
  burger_place: { label: 'Burger Place', type: 'food', lat: 52.5105, lng: 13.4589 },
  noodle_place: { label: 'Noodle Place', type: 'food', lat: 52.5106, lng: 13.4590 },
  east_side_gallery: { label: 'East Side Gallery', type: 'wall', lat: 52.505, lng: 13.4397 },
  charlottenburg_palace: { label: 'Charlottenburg Palace', type: 'palace', lat: 52.5209, lng: 13.2957 },
  dicke_wirtin: { label: 'Dicke Wirtin', type: 'food', lat: 52.5059, lng: 13.3218 },
  lietzensee: { label: 'Lietzensee', type: 'park', lat: 52.5082, lng: 13.2877 },
  lietzensee_food_search: { label: 'Food near Lietzensee', type: 'food', lat: 52.5086, lng: 13.2892 },
  savignyplatz: { label: 'Savignyplatz', type: 'neighborhood', lat: 52.5054, lng: 13.3204 },
  berlin_hbf: { label: 'Berlin Hbf', type: 'station', lat: 52.5251, lng: 13.3694 },
  potsdam_hbf: { label: 'Potsdam Hbf', type: 'station', lat: 52.3917, lng: 13.0664 },
};

function block({ window, time = 'Morning', kind = 'activity', placeIds, fixedStart = false }) {
  return {
    window,
    time,
    kind,
    fixedStart,
    placeId: placeIds[0],
    placeIds,
    mapLinks: placeIds.map((placeId) => ({ placeId })),
  };
}

test('adds a real transfer and moves the next activity after travel plus buffer', () => {
  const result = RouteLogic.planDay({
    catalog,
    planKey: 'wall',
    blocks: [
      block({ window: '09:30-12:00', placeIds: ['wall_memorial'] }),
      block({ window: '12:00-13:30', time: 'Lunch', placeIds: ['friedrichshain_food_search'] }),
      block({ window: '13:30-16:30', time: 'Afternoon', placeIds: ['east_side_gallery'] }),
    ],
  });

  assert.deepEqual(result.issues, []);
  assert.equal(result.blocks[1].window, '12:35-14:05');
  assert.equal(result.blocks[1].transferFromPrevious.mode, 'transit');
  assert.equal(result.blocks[1].transferFromPrevious.minutes, 30);
  assert.equal(result.blocks[1].transferFromPrevious.bufferMinutes, 5);
  assert.equal(result.blocks[1].transferFromPrevious.fromLabel, 'Berlin Wall Memorial');
  assert.equal(result.blocks[1].transferFromPrevious.toLabel, 'Lunch stop');
  assert.equal(
    result.blocks[1].transferFromPrevious.instruction,
    'Use public transport from Berlin Wall Memorial to your lunch stop. Check the live connection before leaving.',
  );
  assert.equal(result.blocks[1].transferFromPrevious.linkLabel, 'Open the route to lunch in Google Maps');
  assert.equal(result.blocks[2].transferFromPrevious.fromLabel, 'Lunch stop');
  assert.equal(result.blocks[2].transferFromPrevious.toLabel, 'East Side Gallery');
  assert.equal(
    result.blocks[2].transferFromPrevious.instruction,
    'Walk from your lunch stop to East Side Gallery.',
  );
  assert.equal(result.blocks[2].transferFromPrevious.linkLabel, 'Open the route after lunch in Google Maps');
  assert.equal(result.blocks[2].window, '14:35-17:35');
});

test('uses the meal location in public transfer wording without leaking the internal Food label', () => {
  const result = RouteLogic.planDay({
    catalog,
    planKey: 'wall',
    blocks: [
      block({ window: '09:30-12:00', placeIds: ['wall_memorial'] }),
      Object.assign(
        block({ window: '12:00-13:30', time: 'Lunch', placeIds: ['friedrichshain_food_search'] }),
        { title: 'Lunch around Boxhagener Platz' },
      ),
      block({ window: '13:30-16:30', time: 'Afternoon', placeIds: ['east_side_gallery'] }),
    ],
  });

  const incoming = result.blocks[1].transferFromPrevious;
  const outgoing = result.blocks[2].transferFromPrevious;
  assert.equal(incoming.toLabel, 'Lunch around Boxhagener Platz');
  assert.equal(
    incoming.instruction,
    'Use public transport from Berlin Wall Memorial to your lunch stop around Boxhagener Platz. Check the live connection before leaving.',
  );
  assert.equal(outgoing.fromLabel, 'Lunch stop');
  assert.doesNotMatch(JSON.stringify(result.blocks), /Food in Friedrichshain/);
});

test('uses the actual meal name for breakfast transfers', () => {
  const result = RouteLogic.planDay({
    catalog,
    planKey: 'wall',
    blocks: [
      Object.assign(
        block({ window: '08:00-09:00', time: 'Breakfast', placeIds: ['friedrichshain_food_search'] }),
        { title: 'Breakfast around Boxhagener Platz' },
      ),
      block({ window: '09:00-11:00', time: 'Morning', placeIds: ['east_side_gallery'] }),
    ],
  });

  assert.deepEqual(result.issues, []);
  assert.equal(result.blocks[1].transferFromPrevious.fromLabel, 'Breakfast stop');
  assert.equal(
    result.blocks[1].transferFromPrevious.instruction,
    'Walk from your breakfast stop to East Side Gallery.',
  );
  assert.doesNotMatch(JSON.stringify(result.blocks), /Walk from Food/);
});

test('keeps meal recommendations out of the canonical route order', () => {
  const mealBlock = block({
    window: '12:00-13:30',
    time: 'Lunch',
    placeIds: ['friedrichshain_food_search', 'vegan_1990', 'burger_place', 'noodle_place'],
  });
  mealBlock.routePlaceIds = ['friedrichshain_food_search'];
  mealBlock.title = 'Lunch around Boxhagener Platz';
  const result = RouteLogic.planDay({
    catalog,
    planKey: 'wall',
    blocks: [
      block({ window: '09:30-12:00', placeIds: ['wall_memorial'] }),
      mealBlock,
      block({ window: '13:30-16:30', time: 'Afternoon', placeIds: ['east_side_gallery'] }),
    ],
  });

  assert.deepEqual(result.routePlaceIds, ['wall_memorial', 'friedrichshain_food_search', 'east_side_gallery']);
  assert.equal(result.blocks[1].placeIds.length, 4);
  assert.equal(result.blocks[1].routePlaceIds.length, 1);
});

test('adds a destination-only transfer from the real stay after the arrival block', () => {
  const result = RouteLogic.planDay({
    catalog,
    planKey: 'history',
    arrivalConnection: {
      fromLabel: 'Your stay in Prenzlauer Berg',
      mode: 'transit',
      minutes: 25,
      bufferMinutes: 10,
      instructionPrefix: 'After check-in, start from your exact address and use public transport to ',
    },
    blocks: [
      block({ window: '09:00-10:45', time: 'Arrival', placeIds: ['arrival_transfer'] }),
      block({ window: '10:45-12:45', placeIds: ['world_clock'] }),
    ],
  });

  assert.deepEqual(result.issues, []);
  assert.equal(result.blocks[1].window, '11:20-13:20');
  assert.equal(result.blocks[1].transferFromPrevious.fromPlaceId, 'arrival_transfer');
  assert.equal(result.blocks[1].transferFromPrevious.toPlaceId, 'world_clock');
  assert.equal(result.blocks[1].transferFromPrevious.totalMinutes, 35);
  assert.match(result.blocks[1].transferFromPrevious.url, /destination=/);
  assert.doesNotMatch(result.blocks[1].transferFromPrevious.url, /origin=/);
  assert.deepEqual(result.routePlaceIds, ['world_clock']);
});

test('uses lower-case your when an arrival transfer leads directly to a meal', () => {
  const result = RouteLogic.planDay({
    catalog,
    planKey: 'arrival',
    arrivalConnection: {
      fromLabel: 'Your stay in Charlottenburg / West',
      mode: 'transit',
      minutes: 20,
      bufferMinutes: 10,
      instructionPrefix: 'After check-in, use public transport to ',
    },
    blocks: [
      block({ window: '17:00-18:00', time: 'Arrival', placeIds: ['arrival_transfer'] }),
      Object.assign(
        block({ window: '18:00-19:15', time: 'Dinner', placeIds: ['dicke_wirtin'] }),
        { title: 'Dinner near Charlottenburg / West' },
      ),
    ],
  });

  assert.deepEqual(result.issues, []);
  assert.equal(
    result.blocks[1].transferFromPrevious.instruction,
    'Use public transport from your stay in Charlottenburg / West to your dinner stop near Charlottenburg / West. Check the live connection before leaving.',
  );
  assert.doesNotMatch(result.blocks[1].transferFromPrevious.instruction, /from Your\b/);
});

test('preserves a legitimate return to Berlin in the canonical route order', () => {
  const blocks = [
    block({ window: '08:45-09:45', kind: 'transfer', placeIds: ['berlin_hbf', 'potsdam_hbf'] }),
    block({ window: '17:30-18:30', kind: 'transfer', placeIds: ['potsdam_hbf', 'berlin_hbf'] }),
  ];
  assert.deepEqual(RouteLogic.routePlaceIdsForBlocks(blocks), [
    'berlin_hbf',
    'potsdam_hbf',
    'berlin_hbf',
  ]);
});

test('rejects a station used as a multi-hour attraction but accepts a transfer block', () => {
  const invalid = RouteLogic.planDay({
    catalog,
    blocks: [block({ window: '09:00-12:30', placeIds: ['potsdam_hbf'] })],
  });
  assert.ok(invalid.issues.some((issue) => issue.code === 'station_as_attraction'));

  const valid = RouteLogic.planDay({
    catalog,
    planKey: 'potsdam',
    blocks: [block({ window: '09:00-10:00', kind: 'transfer', placeIds: ['berlin_hbf', 'potsdam_hbf'] })],
  });
  assert.equal(valid.issues.some((issue) => issue.code === 'station_as_attraction'), false);
  assert.equal(valid.blocks[0].transferSegment.mode, 'transit');
  assert.equal(valid.blocks[0].transferSegment.minutes, 35);
  assert.equal(valid.blocks[0].transferSegment.bufferMinutes, 10);

  const tooShort = RouteLogic.planDay({
    catalog,
    planKey: 'potsdam',
    blocks: [block({ window: '09:00-09:30', kind: 'transfer', placeIds: ['berlin_hbf', 'potsdam_hbf'] })],
  });
  assert.ok(tooShort.issues.some((issue) => issue.code === 'transfer_window_too_short'));
});

test('flags the old Charlottenburg detour and accepts the corrected west-to-east order', () => {
  const oldOrder = RouteLogic.immediateBacktracks([
    'charlottenburg_palace',
    'dicke_wirtin',
    'lietzensee',
    'savignyplatz',
  ], catalog);
  assert.ok(oldOrder.some((issue) => issue.code === 'geographic_backtrack'));

  const corrected = RouteLogic.immediateBacktracks([
    'charlottenburg_palace',
    'lietzensee_food_search',
    'lietzensee',
    'savignyplatz',
    'dicke_wirtin',
  ], catalog);
  assert.deepEqual(corrected, []);
});

test('reports a fixed timed entry conflict instead of silently breaking it', () => {
  const result = RouteLogic.planDay({
    catalog,
    blocks: [
      block({ window: '09:00-12:30', placeIds: ['wall_memorial'] }),
      block({ window: '12:30-13:30', placeIds: ['east_side_gallery'], fixedStart: true }),
    ],
  });
  assert.ok(result.issues.some((issue) => issue.code === 'fixed_start_conflict'));
});
