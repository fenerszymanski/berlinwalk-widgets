import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const DATA = JSON.parse(await readFile(new URL('./pocket-kit-data.json', import.meta.url), 'utf8'));
const PAGE = await readFile(new URL('./pocket-kit.html', import.meta.url), 'utf8');
const DATE_CHECK_PAGE = await readFile(new URL('./index.html', import.meta.url), 'utf8');
const SOURCES = await readFile(new URL('./POCKET_KIT_SOURCES.md', import.meta.url), 'utf8');

const EXPECTED_COUNTS = new Map([
  ['quick-budget', 6],
  ['german-classics', 6],
  ['vegetarian-vegan', 7],
  ['breakfast-brunch', 6],
  ['near-sights', 6],
  ['after-2200', 6],
  ['cocktails-wine', 6],
  ['pubs-beer-rooftops', 7],
]);

function assertHttps(value, label) {
  assert.equal(typeof value, 'string', label + ' must be a string');
  assert.match(value, /^https:\/\//, label + ' must use HTTPS');
}

function escapedPattern(value) {
  return new RegExp(String(value).replace(/[.*+?^$()|[\]\\]/g, '\\$&'));
}

test('Pocket Kit has exactly 50 unique venue picks in the eight approved situations', () => {
  assert.equal(DATA.checkedAt, '2026-08-22');
  assert.equal(DATA.venues.length, 50);
  assert.equal(new Set(DATA.venues.map((venue) => venue.id)).size, 50);
  assert.equal(new Set(DATA.venues.map((venue) => venue.name)).size, 50);
  assert.deepEqual(new Set(DATA.categories.map((category) => category.id)), new Set(EXPECTED_COUNTS.keys()));
  for (const [category, expected] of EXPECTED_COUNTS) {
    assert.equal(DATA.venues.filter((venue) => venue.category === category).length, expected, category);
  }
});

test('every venue has the required bounded data and current source record', () => {
  const allowedPriceBands = new Set(['EUR', 'EUR EUR', 'EUR EUR EUR']);
  const allowedReservations = new Set(['walk-in', 'reserve', 'check']);
  for (const venue of DATA.venues) {
    for (const field of ['id', 'name', 'area', 'category', 'priceBand', 'bestFor', 'reservation', 'mapsUrl', 'sourceUrl', 'checkedAt']) {
      assert.equal(typeof venue[field], 'string', (venue.id || 'venue') + ' missing ' + field);
      assert.ok(venue[field].trim(), (venue.id || 'venue') + ' has blank ' + field);
    }
    assert.ok(allowedPriceBands.has(venue.priceBand), venue.id + ' has an unsupported price band');
    assert.ok(allowedReservations.has(venue.reservation), venue.id + ' has an unsupported reservation value');
    assert.equal(venue.checkedAt, DATA.checkedAt);
    assertHttps(venue.mapsUrl, venue.id + ' mapsUrl');
    assertHttps(venue.sourceUrl, venue.id + ' sourceUrl');
  }
  assert.doesNotMatch(JSON.stringify(DATA), /Roamers|Café Einstein Stammhaus|Deck5|Cordo|Hops & Barley/i);
});

test('transport, landmark and practical resources are current HTTPS destinations', () => {
  assert.equal(DATA.transport.length, 6);
  assert.equal(DATA.practical.length, 3);
  for (const resource of [...DATA.transport, DATA.landmarks, ...DATA.practical]) {
    assertHttps(resource.url, resource.id + ' url');
    assertHttps(resource.sourceUrl, resource.id + ' sourceUrl');
    assert.equal(resource.checkedAt, DATA.checkedAt);
  }
  assert.equal(DATA.transport.find((item) => item.id === 'night-network-map').url, 'https://www.bvg.de/en/connections/network-maps-and-routes');
  assert.equal(DATA.transport.find((item) => item.id === 'tram-network-map').url, 'https://www.bvg.de/en/connections/network-maps-and-routes');
  assert.equal(DATA.transport.find((item) => item.id === 's-bahn-regional-map').url, 'https://sbahn.berlin/en/plan-a-journey/route-network/');
  assert.equal(DATA.transport.find((item) => item.id === 'vbb-regional-map').url, 'https://www.vbb.de/en/driving-information/maps/');
  assert.match(DATA.landmarks.description, /19 essential landmarks/);
});

test('the local rules stay at twelve and do not become a route or paid-product substitute', () => {
  assert.equal(DATA.rules.length, 12);
  assert.equal(new Set(DATA.rules.map((rule) => rule.id)).size, 12);
  for (const rule of DATA.rules) {
    assert.ok(rule.title && rule.text && rule.sourceUrl);
    assertHttps(rule.sourceUrl, rule.id + ' sourceUrl');
  }
  const publicCopy = JSON.stringify(DATA).toLowerCase();
  for (const forbidden of ['reminder', 'subscription', 'live tour', 'no email', 'best in berlin', 'rating', 'ranked']) {
    assert.equal(publicCopy.includes(forbidden), false, 'forbidden Pocket Kit copy: ' + forbidden);
  }
  const forbiddenBerlinDomain = [...publicCopy.matchAll(/https?:\/\/([^\/\s"]+)/g)]
    .some((match) => /(?:^|www\.)berlin\.de$/.test(match[1]));
  assert.equal(forbiddenBerlinDomain, false);
  assert.equal(publicCopy.includes('itinerary'), false);
  assert.equal(publicCopy.includes('day by day'), false);
});

test('page is a standalone utility with keyboard filters, visible count and no second lead gate', () => {
  assert.match(PAGE, /id="venueSearch"/);
  assert.match(PAGE, /id="categoryFilters"/);
  assert.match(PAGE, /aria-pressed/);
  assert.match(PAGE, /id="venueCount"/);
  assert.match(PAGE, /role="status"/);
  assert.match(PAGE, /Open the 19-place map/);
  assert.match(PAGE, /restoreFocus[\s\S]*activeButton\.focus\(\)/);
  assert.doesNotMatch(PAGE, /type="email"/i);
  assert.doesNotMatch(PAGE, /id="gate|id="lead|subscribe/i);
  assert.doesNotMatch(PAGE, /berlin\.de|reminder|live tour|no email|subscription/i);
});

test('Pocket Kit hero and icon treatment are present without venue thumbnails', () => {
  assert.match(PAGE, /<picture>[\s\S]*pocket-kit-hero\.jpg[\s\S]*<img/);
  assert.match(PAGE, /loading="eager"/);
  assert.match(PAGE, /fetchpriority="high"/);
  assert.match(PAGE, /alt="Berlin tram passing a café table with a phone, maps, coffee and a sandwich\."/);
  assert.match(PAGE, /Material\+Symbols\+Outlined/);
  for (const icon of ['restaurant', 'map', 'account_balance', 'rule', 'wc', 'water_drop', 'luggage']) {
    assert.match(PAGE, new RegExp(icon));
  }
  assert.doesNotMatch(PAGE, /venue.*thumbnail|venue.*photo|<img[^>]+venue/i);
});

test('Date Check keeps the result informational and does not expose tour sales controls', () => {
  assert.doesNotMatch(DATE_CHECK_PAGE, /id="tourSection"|id="tourBlock"|my tour runs|tour day|booking-calendar-availability|bookingHref|slot-link|tour availability/i);
  assert.match(DATE_CHECK_PAGE, /tourSlotShown:\s*false/);
  assert.match(DATE_CHECK_PAGE, /tourSlotShown:\s*STATE\.tourSlotShown/);
});

test('Date Check reveals one Pocket Kit preview inside the result gate zone', () => {
  const pocketIndex = DATE_CHECK_PAGE.indexOf('id="pocketPreview"');
  const resultIndex = DATE_CHECK_PAGE.indexOf('id="resultStage"');
  const gateIndex = DATE_CHECK_PAGE.indexOf('id="gate"');
  const supportIndex = DATE_CHECK_PAGE.indexOf('class="date-support"');
  assert.notEqual(pocketIndex, -1);
  assert.equal((DATE_CHECK_PAGE.match(/id="pocketPreview"/g) || []).length, 1);
  assert.ok(resultIndex < pocketIndex, 'Pocket Kit preview must be inside the result stage');
  assert.ok(pocketIndex < gateIndex, 'Pocket Kit preview must precede the email gate');
  assert.ok(supportIndex < resultIndex, 'Date support must remain before the result stage');
  assert.match(DATE_CHECK_PAGE, /<section class="gate-zone">[\s\S]*<aside class="pocket-preview" id="pocketPreview"[\s\S]*<\/aside>[\s\S]*<div class="gate" id="gate">/);
  assert.doesNotMatch(DATE_CHECK_PAGE.slice(supportIndex, resultIndex), /id="pocketPreview"/);
  assert.match(DATE_CHECK_PAGE, /#bw-date-check \.result-stage \{\s*display:\s*none;/);
});

test('Date Check separates consent from the email action row', () => {
  assert.match(DATE_CHECK_PAGE, /#bw-date-check \.consent \{[^}]*margin-top:\s*12px;/);
});

test('source manifest contains every venue source and every approved map source', () => {
  for (const venue of DATA.venues) assert.match(SOURCES, escapedPattern(venue.sourceUrl));
  for (const resource of [...DATA.transport, DATA.landmarks, ...DATA.practical]) {
    assert.match(SOURCES, escapedPattern(resource.sourceUrl));
  }
  assert.doesNotMatch(SOURCES, /instagram\.com/i);
});
