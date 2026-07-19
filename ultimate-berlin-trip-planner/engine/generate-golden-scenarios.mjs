#!/usr/bin/env node

import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST_PATH = path.join(HERE, 'golden-scenarios.json');
const ARTIFACT_DIR = path.join(HERE, 'artifacts');
const require = createRequire(import.meta.url);
const PlanArtifactV2 = require('./plan-artifact-v2.js');

async function manifest() {
  return JSON.parse(await fs.readFile(MANIFEST_PATH, 'utf8'));
}

function artifactPath(id) {
  if (!/^[a-z0-9-]+$/.test(String(id || ''))) throw new Error(`Unsafe scenario id: ${id}`);
  return path.join(ARTIFACT_DIR, `${id}.json`);
}

export async function writeGoldenArtifact(id, rawJson) {
  const parsed = typeof rawJson === 'string' ? JSON.parse(rawJson) : rawJson;
  assert.equal(parsed.schemaVersion, PlanArtifactV2.schemaVersion, `${id}: schema version`);
  const quality = PlanArtifactV2.validate(parsed);
  assert.equal(quality.status, 'pass', `${id}: ${JSON.stringify(quality.issues)}`);
  parsed.quality = quality;
  parsed.scenarioId = id;
  await fs.mkdir(ARTIFACT_DIR, { recursive: true });
  await fs.writeFile(artifactPath(id), `${JSON.stringify(parsed, null, 2)}\n`, 'utf8');
  return artifactPath(id);
}

function dayText(day) {
  return (day?.segments || []).map((segment) => `${segment.title} ${segment.copy}`).join(' ').toLowerCase();
}

function assertScenario(scenario, artifact) {
  const expected = scenario.expect || {};
  assert.equal(artifact.scenarioId, scenario.id, `${scenario.id}: scenario id`);
  assert.equal(artifact.quality?.status, expected.quality || 'pass', `${scenario.id}: quality`);

  if (expected.day1PreviewPlaceIds) {
    assert.deepEqual(
      (artifact.days[0]?.previewStops || []).map((stop) => stop.placeId),
      expected.day1PreviewPlaceIds,
      `${scenario.id}: day 1 preview stops`,
    );
  }
  if (Number.isFinite(expected.worldClockOwnersDay1)) {
    const owners = (artifact.days[0]?.segments || []).filter((segment) => segment.mapStopOwner && segment.primaryPlace?.placeId === 'world_clock');
    assert.equal(owners.length, expected.worldClockOwnersDay1, `${scenario.id}: World Clock owners`);
  }
  if (expected.openingStatusDay1) assert.equal(artifact.days[0]?.opening?.status, expected.openingStatusDay1, `${scenario.id}: opening status`);
  if (typeof expected.primaryClosed === 'boolean') assert.equal(artifact.days[0]?.opening?.primaryClosed, expected.primaryClosed, `${scenario.id}: primary closed`);
  if (Number.isFinite(expected.rainyDays)) {
    assert.equal(artifact.days.filter((day) => day.weather?.rainy).length, expected.rainyDays, `${scenario.id}: rainy days`);
  }
  if (expected.noExposedRouteMovedToRain) {
    const broken = artifact.days.filter((day) => day.weather?.rainy && day.weatherSwap?.key === 'weather-swap-exposed-day');
    assert.equal(broken.length, 0, `${scenario.id}: exposed route moved to rain`);
  }
  if (expected.charlottenburgHasMuseumIslandText === false) {
    const westDays = artifact.days.filter((day) => (day.areaIds || []).includes('charlottenburg'));
    assert.ok(westDays.length, `${scenario.id}: Charlottenburg day missing`);
    westDays.forEach((day) => assert.equal(dayText(day).includes('museum island'), false, `${scenario.id}: cross-area Museum Island copy`));
  }
  if (expected.charlottenburgAreaOnly) {
    const westDays = artifact.days.filter((day) => (day.areaIds || []).includes('charlottenburg'));
    westDays.forEach((day) => assert.deepEqual(day.areaIds, ['charlottenburg'], `${scenario.id}: west route area`));
  }
  if (expected.officialReservationRequired) {
    const actions = artifact.days.map((day) => day.reservation).filter((item) => item?.required);
    assert.ok(actions.length, `${scenario.id}: required reservation action missing`);
    actions.forEach((item) => {
      assert.equal(PlanArtifactV2.isOfficialReservationUrl(item.url), true, `${scenario.id}: official reservation URL`);
      assert.match(item.checkedAt || '', /^\d{4}-\d{2}-\d{2}$/, `${scenario.id}: reservation verification date`);
    });
  }
}

export async function checkGoldenArtifacts() {
  const data = await manifest();
  const results = [];
  let sampleArtifact = null;
  for (const scenario of data.scenarios || []) {
    const file = artifactPath(scenario.id);
    const artifact = JSON.parse(await fs.readFile(file, 'utf8'));
    const quality = PlanArtifactV2.validate(artifact);
    artifact.quality = quality;
    assertScenario(scenario, artifact);
    if (scenario.id === 'ber-morning-tour') sampleArtifact = artifact;
    results.push({ id: scenario.id, status: quality.status, days: artifact.days.length });
  }
  assert.ok(sampleArtifact, 'Engine-derived landing sample artifact is missing');
  const landingSource = await fs.readFile(path.join(HERE, '..', '..', 'berlin-trip-planner-page', 'berlin-trip-planner-page-element.js'), 'utf8');
  const sampleNeedles = [
    sampleArtifact.scenarioId,
    ...sampleArtifact.days.slice(0, 3).map((day) => day.dayNumber === 1
      ? 'Day 1 · Alexanderplatz & Mitte'
      : (day.dayNumber === 2 ? 'Day 2 · Wall and East Berlin' : 'Day 3 · Charlottenburg')),
    ...sampleArtifact.days[0].previewStops.slice(0, 2).flatMap((stop) => [stop.time, stop.label]),
  ];
  sampleNeedles.forEach((needle) => assert.ok(landingSource.includes(needle), `Landing sample missing engine value: ${needle}`));
  return results;
}

if (typeof process !== 'undefined' && Array.isArray(process.argv) && process.argv.includes('--check')) {
  const results = await checkGoldenArtifacts();
  console.log(`PlanArtifactV2 golden scenarios: ${results.length}/${results.length} PASS`);
  results.forEach((result) => console.log(`- ${result.id}: ${result.status}, ${result.days} day(s)`));
}
