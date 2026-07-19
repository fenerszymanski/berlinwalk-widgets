import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { checkGoldenArtifacts } from './generate-golden-scenarios.mjs';

const require = createRequire(import.meta.url);
const PlanArtifactV2 = require('./plan-artifact-v2.js');

test('PlanArtifactV2 exposes the fixed v2 contract', () => {
  assert.equal(PlanArtifactV2.schemaVersion, '2.0.0');
  assert.equal(typeof PlanArtifactV2.normalize, 'function');
  assert.equal(typeof PlanArtifactV2.validate, 'function');
});

test('validator rejects duplicate map-stop ownership', () => {
  const artifact = PlanArtifactV2.normalize({
    engineVersion: 'test',
    input: { tripLength: 1 },
    days: [{
      dayNumber: 1,
      dateKey: '2026-09-15',
      title: 'Test',
      theme: 'Test',
      planKey: 'test',
      places: [{ placeId: 'world_clock', areaId: 'alexanderplatz' }],
      route: { travelMode: 'walking', totalDistanceKm: 0, longestSegmentKm: 0 },
      previewStops: [{ placeId: 'world_clock' }],
      blocks: [
        { time: '09:00', window: '09:00-10:00', title: 'First', primaryPlace: { placeId: 'world_clock' } },
        { time: '11:30', window: '11:30-13:30', title: 'Second', primaryPlace: { placeId: 'world_clock' } }
      ]
    }]
  });
  assert.equal(artifact.quality.status, 'fail');
  assert.ok(artifact.quality.issues.some((issue) => issue.code === 'duplicate_map_stop_owner'));
});

test('validator rejects a long walking transfer', () => {
  const artifact = PlanArtifactV2.normalize({
    engineVersion: 'test',
    input: { tripLength: 1 },
    days: [{
      dayNumber: 1,
      dateKey: '2026-09-15',
      title: 'Cross-city walk',
      theme: 'Test',
      planKey: 'test',
      places: [{ placeId: 'a', areaId: 'north' }, { placeId: 'b', areaId: 'east' }],
      route: { travelMode: 'walking', totalDistanceKm: 8, longestSegmentKm: 5 },
      previewStops: [{ placeId: 'a' }],
      blocks: [{ time: 'Morning', title: 'First', primaryPlace: { placeId: 'a' } }]
    }]
  });
  assert.ok(artifact.quality.issues.some((issue) => issue.code === 'long_walking_route'));
});

test('all engine-derived golden artifacts pass their exact assertions', async () => {
  const results = await checkGoldenArtifacts();
  assert.equal(results.length, 5);
  assert.ok(results.every((result) => result.status === 'pass'));
});
