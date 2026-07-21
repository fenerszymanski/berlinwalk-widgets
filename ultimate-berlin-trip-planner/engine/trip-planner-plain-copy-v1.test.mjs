import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const Copy = require('./trip-planner-plain-copy-v1.js');

const allPlaceIds = [
  'world_clock', 'alexanderplatz', 'museum_island', 'hackescher_markt',
  'wall_memorial', 'east_side_gallery', 'oberbaum_bridge', 'markthalle_neun',
  'brandenburg_gate', 'holocaust_memorial', 'reichstag', 'gendarmenmarkt',
  'nikolaiviertel', 'berlin_cathedral', 'berlin_hbf', 'hackesche_hofe', 'kastanienallee',
  'topography_terror', 'tiergarten', 'victory_column', 'tempelhofer_feld',
  'viktoriapark', 'treptower_park', 'raw_gelande', 'oranienstrasse',
  'simon_dach_strasse', 'kulturbrauerei', 'savignyplatz', 'lietzensee',
  'oranienstrasse_food_search', 'friedrichshain_food_search',
  'sanssouci', 'sanssouci_park', 'potsdam_hbf', 'potsdam_old_market', 'potsdam_brandenburg_gate', 'charlottenburg_palace', 'monsieur_vuong',
  'claerchens_ballhaus', 'maximilians', 'hofbraeu_wirtshaus',
  'prater_biergarten', 'konnopkes_imbiss', 'vegan_1990',
  'burgermeister_schlesi', 'dicke_wirtin', 'schwarzes_cafe',
  'mustafas_kebap', 'curry_36', 'scheers_schnitzel', 'potsdam_food_search',
  'tempelhof_food_search', 'bergmannkiez_food_search', 'lietzensee_food_search', 'berlin_hbf_food_search', 'gendarmenmarkt_food_search', 'shiso_burger',
  'yamyam', 'curry_61', 'hackescher_markt_market'
];

test('every Trip Planner place has direct public guidance', () => {
  assert.deepEqual(Object.keys(Copy.PLACE_GUIDANCE).sort(), allPlaceIds.sort());
  allPlaceIds.forEach((placeId) => {
    const copy = Copy.placeCopy(placeId);
    assert.match(copy, /\.[ ]/);
    assert.equal(Copy.bannedPhrases(copy).length, 0, placeId);
    assert.doesNotMatch(copy, /[—–]/, placeId);
  });
});

test('Charlottenburg explains the place in short sentences', () => {
  const ids = ['charlottenburg_palace', 'savignyplatz', 'lietzensee'];
  assert.equal(
    Copy.dayTitle({ dayNumber: 4, placeIds: ids, area: 'Charlottenburg' }),
    'Royal Berlin and former West Berlin',
  );
  const decision = Copy.dayDecision({ dayNumber: 4, placeIds: ids, area: 'Charlottenburg' });
  assert.match(decision, /royal past/);
  assert.match(decision, /former West Berlin/);
  assert.match(Copy.placeCopy('charlottenburg_palace'), /largest palace complex/);
  assert.equal(Copy.bannedPhrases([decision, Copy.placeCopy('charlottenburg_palace')].join(' ')).length, 0);
});

test('arrival instruction is as direct as spoken directions', () => {
  assert.equal(
    Copy.blockTitle({ time: 'Arrival', arrivalPoint: 'ber' }),
    'Train from BER and leave your bags',
  );
  assert.equal(
    Copy.dayDecision({ dayNumber: 1, area: 'Mitte / Alexanderplatz' }),
    'Take the train from BER to Mitte / Alexanderplatz. Leave your bags. Start sightseeing after that.',
  );
});

test('fixed seven-day review titles are factual and distinct from step lists', () => {
  const titles = [
    Copy.dayTitle({ dayNumber: 1, area: 'Mitte / Alexanderplatz', placeIds: ['alexanderplatz'] }),
    Copy.dayTitle({ dayNumber: 2, hasTour: true, area: 'Mitte', placeIds: ['world_clock', 'topography_terror'] }),
    Copy.dayTitle({ dayNumber: 3, area: 'Berlin', placeIds: ['wall_memorial', 'east_side_gallery', 'oberbaum_bridge'] }),
    Copy.dayTitle({ dayNumber: 4, area: 'Charlottenburg', placeIds: ['charlottenburg_palace', 'savignyplatz', 'lietzensee'] }),
    Copy.dayTitle({ dayNumber: 5, area: 'Kreuzberg', placeIds: ['markthalle_neun', 'oranienstrasse'] }),
    Copy.dayTitle({ dayNumber: 6, area: 'Potsdam', placeIds: ['potsdam_hbf', 'sanssouci'] }),
    Copy.dayTitle({ dayNumber: 7, area: 'Kreuzberg', placeIds: ['tempelhofer_feld', 'viktoriapark'] }),
  ];
  assert.deepEqual(titles, [
    'Arrival in Mitte',
    'BerlinWalk tour and Topography of Terror',
    'Berlin Wall history',
    'Royal Berlin and former West Berlin',
    'A market and main street in Kreuzberg',
    'Prussian palaces in Potsdam',
    'Parks in Tempelhof and Kreuzberg',
  ]);
  assert.equal(new Set(titles).size, 7);
  assert.equal(Copy.bannedPhrases(titles.join(' ')).length, 0);
});

test('central history title describes the day without repeating its stop list', () => {
  assert.equal(Copy.dayTitle({
    dayNumber: 3,
    area: 'Mitte',
    placeIds: ['holocaust_memorial', 'gendarmenmarkt', 'nikolaiviertel'],
  }), 'Three layers of central Berlin');
});

test('meal and Plan B copy name the real place and the next action', () => {
  assert.equal(
    Copy.mealCopy({ meal: 'lunch', placeIds: ['dicke_wirtin'], area: 'Charlottenburg' }),
    'Dicke Wirtin is a suggested lunch option. Check today\'s opening hours and availability before you go.',
  );
  assert.equal(
    Copy.planB({ placeIds: ['charlottenburg_palace', 'savignyplatz', 'lietzensee'] }),
    'If rain is steady, visit Charlottenburg Palace and Museum Berggruen. Skip Lietzensee.',
  );
  assert.equal(
    Copy.planB({ placeIds: ['markthalle_neun', 'oranienstrasse'] }),
    'If rain is steady, visit Berlinische Galerie and eat at Markthalle Neun. Walk Oranienstraße only when the rain stops.',
  );
  assert.equal(
    Copy.blockTitle({ time: 'Dinner', placeIds: ['oranienstrasse_food_search'], area: 'Kreuzberg' }),
    'Dinner on Oranienstraße',
  );
  const tempelhofBackup = Copy.planB({ placeIds: ['tempelhofer_feld', 'viktoriapark'] });
  assert.doesNotMatch(tempelhofBackup, /Marheineke/i);
  assert.match(tempelhofBackup, /check what is open/i);
});

test('known artificial phrases fail the public-copy scan', () => {
  assert.deepEqual(Copy.bannedPhrases('Get central without over-solving Berlin'), [
    'get central without over-solving berlin',
    'over-solving',
  ]);
  assert.deepEqual(Copy.bannedPhrases('Dicke Wirtin keeps the day around Charlottenburg.'), [
    'keeps the day',
  ]);
  assert.deepEqual(Copy.bannedPhrases('The stored itinerary uses a context anchor.'), [
    'stored itinerary',
    'context anchor',
  ]);
  assert.equal(Copy.bannedPhrases('Take the train to Alexanderplatz. Leave your bags.').length, 0);
});
