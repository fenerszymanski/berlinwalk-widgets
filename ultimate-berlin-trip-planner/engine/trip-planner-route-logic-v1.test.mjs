import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const RouteLogic = require('./trip-planner-route-logic-v1.js');

const catalog = {
  wall_memorial: { label: 'Berlin Wall Memorial', type: 'history', lat: 52.5351, lng: 13.3903 },
  friedrichshain_food_search: { label: 'Food in Friedrichshain', type: 'food', lat: 52.5103, lng: 13.4587 },
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
  assert.equal(result.blocks[2].window, '14:35-17:35');
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
