import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const directory = path.dirname(fileURLToPath(import.meta.url));
const runtime = fs.readFileSync(path.join(directory, 'history-story-element.js'), 'utf8');
const adapter = fs.readFileSync(path.join(directory, 'LEAD_MAGNET_ADAPTER.md'), 'utf8');

function section(start, end) {
  const from = runtime.indexOf(start);
  assert.notEqual(from, -1, `missing ${start}`);
  const to = end ? runtime.indexOf(end, from) : runtime.length;
  assert.notEqual(to, -1, `missing ${end}`);
  return runtime.slice(from, to);
}

test('lead magnet uses the locked asset and consent identity', () => {
  assert.match(runtime, /LEAD_ASSET_ID_DEFAULT = 'berlin-history-field-card'/);
  assert.match(runtime, /LEAD_CONSENT_VERSION_DEFAULT = 'berlin-history-field-card-v1-2026-09-02'/);
  assert.match(runtime, /LEAD_EXPERIMENT_DEFAULT = 'berlin_history_field_card_v1'/);
  assert.match(runtime, /LEAD_VARIANT_DEFAULT = 'single'/);
  assert.match(runtime, /LEAD_PLACEMENT_DEFAULT = 'history_story_epilogue'/);
  assert.match(runtime, /LEAD_API_DEFAULT = 'https:\/\/app\.berlinwalk\.com\/api\/download-lead'/);
  assert.match(runtime, /Berlin, Remade: Four Places to Read Berlin/);
  assert.doesNotMatch(runtime, /var LEAD_CONSENT_COPY = 'I agree/);
  assert.match(runtime, /Read the Privacy Policy\.'/);
});

test('preview presents four separate starting points and one visible sample', () => {
  const places = section('var FIELD_PLACES = [', '];\n\n  CHAPTERS.forEach');
  const names = [...places.matchAll(/\{ place: '([^']+)'/g)].map((match) => match[1]);
  assert.deepEqual(names, [
    'Molkenmarkt',
    'Friedrichstadt',
    'Gleis 17',
    'Potsdamer + Leipziger Platz',
  ]);
  const preview = section('function leadFieldPreview()', 'function leadGate()');
  assert.match(preview, /Four places\. Four starting points\./);
  assert.match(preview, /separate starts, not one walking route/);
  assert.match(preview, /Sample from the full guide/);
  assert.match(preview, /public pavement/);
  assert.match(preview, /A3 fence near Altes Stadthaus/);
  assert.match(preview, /fenced excavation is a place to read, not an entry/);
  assert.match(places, /186 steel plates at the memorial/);
  assert.match(places, /This memorial is evidence, not scenery/);
  for (const date of ['2019 to present', '1688 to 1732', 'autumn 1941 to spring 1942', '1990 to 2016']) {
    assert.match(places, new RegExp(date));
  }
  assert.equal((preview.match(/STARTING POINT/g) || []).length, 1, 'card label should not imply a route sequence');
  assert.doesNotMatch(preview, /—/);
});

test('gate has exactly one email field and one unchecked required consent checkbox', () => {
  const gate = section('function leadGate()', 'function card(chapter)');
  assert.equal((gate.match(/name="email"/g) || []).length, 1);
  assert.equal((gate.match(/name="consent"/g) || []).length, 1);
  assert.match(gate, /name="email"[^>]*type="email"[^>]*required/);
  assert.match(gate, /name="consent"[^>]*type="checkbox"[^>]*required/);
  assert.doesNotMatch(gate, /name="consent"[^>]*checked/);
  assert.doesNotMatch(gate, /name="(?:name|fullName|phone|telephone|arrival|arrivalDate|arrivalTiming)"/i);
  assert.match(gate, /name="website"/);
  assert.match(gate, /data-bw-history-lead-privacy/);
  assert.doesNotMatch(gate, /I agree|4 Places/);
  assert.match(runtime, /replace\('Privacy Policy', '<a data-bw-history-lead-privacy/);
});

test('submit adapter keeps DOI and secure delivery on the backend', () => {
  const submit = section('    _submitLead() {', '    _trackLink(kind)');
  assert.match(submit, /this\._leadTransport\('submit', payload\)/);
  assert.match(submit, /consentVersion: config\.consentVersion/);
  assert.match(submit, /startedAt: this\._leadStartedAt/);
  assert.match(submit, /idempotencyKey:/);
  assert.match(submit, /experiment: analyticsConsent \? config\.experiment : ''/);
  assert.match(submit, /variant: analyticsConsent \? config\.variant : ''/);
  assert.match(submit, /acquisitionCohort: analyticsConsent \? 'history_story' : ''/);
  assert.match(submit, /utm: analyticsConsent \? leadUtm\(\) : emptyLeadUtm\(\)/);
  assert.doesNotMatch(submit, /assetVersion\s*:/);
  assert.doesNotMatch(submit, /secureUrl\s*:/);
  assert.doesNotMatch(submit, /action=asset/);
  assert.match(submit, /through a secure link/);
  assert.match(submit, /if \(isQaMode\(\)\)/);
  assert.match(runtime, /intersectionRatio >= \.5/);
  assert.match(runtime, /threshold: \[\.5\]/);
  assert.doesNotMatch(runtime, /intersectionRatio >= \.25/);
  assert.doesNotMatch(runtime, /threshold: \[\.25\]/);
  assert.match(runtime, /action === 'event'/);
  for (const eventName of [
    'bw_lead_asset_gate_view',
    'bw_lead_asset_gate_seen',
    'bw_lead_asset_form_start',
    'bw_lead_asset_submit',
  ]) assert.match(runtime, new RegExp(eventName));
  assert.doesNotMatch(runtime, /bw_lead_asset_control_booking_click/);
});

test('Book the Tour remains a secondary final-chapter action', () => {
  const closing = section('function leadSection()', 'function cover()');
  assert.match(closing, /bw-hs-btn-secondary/);
  assert.match(closing, /data-bw-history-track="closing_cta"/);
  assert.match(closing, /Book my Free Berlin Walking Tour/);
  assert.match(closing, /starts at Alexanderplatz/);
  assert.match(closing, /2 hours/);
  assert.match(closing, /does not follow the Berlin Wall line/);
  assert.doesNotMatch(closing, /bw_lead_asset_control_booking_click/);
});

test('lead section stays outside the short Today sticky step', () => {
  const today = section("if (chapter.key === 'today')", 'return \'<div class="bw-hs-card"');
  assert.match(runtime, /h: 108/);
  assert.match(today, /bw-hs-place-grid/);
  assert.doesNotMatch(today, /leadFieldPreview|leadGate|bw-hs-tour-bridge/);
  assert.match(runtime, /function leadSection\(\)/);
  assert.match(runtime, /\+ leadSection\(\) \+ aftercare\(\)/);
});

test('adapter documentation records backend handoff and privacy boundaries', () => {
  assert.match(adapter, /berlin-history-field-card/);
  assert.match(adapter, /Email me Berlin, Remade: Four Places to Read Berlin/);
  assert.match(adapter, /POST <lead-api-base>\?action=submit/);
  assert.match(adapter, /202.*accepted/);
  assert.match(adapter, /assetVersion.*server-owned/);
  assert.match(adapter, /does not fabricate, expose or persist a token or protected asset URL/);
  assert.match(adapter, /no name, phone/);
  assert.match(adapter, /window\.BW_HISTORY_STORY_LEAD_ADAPTER/);
  assert.match(adapter, /secure inline access page/);
  assert.match(adapter, /at least 50% visible for 2 seconds/);
  assert.doesNotMatch(adapter, /bw_lead_asset_control_booking_click/);
});
