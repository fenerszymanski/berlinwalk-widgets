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
  'hackescher_food_search', 'savigny_food_search', 'charlottenburg_palace_food_search', 'east_side_food_search',
  'sanssouci', 'sanssouci_park', 'potsdam_hbf', 'potsdam_old_market', 'potsdam_brandenburg_gate', 'charlottenburg_palace', 'monsieur_vuong',
  'claerchens_ballhaus', 'maximilians', 'hofbraeu_wirtshaus',
  'prater_biergarten', 'konnopkes_imbiss', 'eberswalder_food_search', 'museum_island_food_search', 'vegan_1990',
  'burgermeister_schlesi', 'dicke_wirtin', 'schwarzes_cafe',
  'mustafas_kebap', 'curry_36', 'scheers_schnitzel', 'potsdam_food_search',
  'alter_stadtwaechter', 'das_wiener_potsdam', 'matador_potsdam', 'contadino_potsdam',
  'tempelhof_food_search', 'bergmannkiez_food_search', 'lietzensee_food_search', 'berlin_hbf_food_search', 'gendarmenmarkt_food_search', 'shiso_burger',
  'yamyam', 'curry_61', 'hackescher_markt_market',
  'hummus_friends', 'peter_pane_hackescher', 'augustiner_gendarmenmarkt',
  'chupenga_gendarmenmarkt', 'gendarmerie_restaurant', 'lebenswelten_bistro',
  'baret_restaurant', 'cafe_nikolaikirche', 'doenerbse', 'w_der_imbiss',
  'flying_monkey', 'trattoria_cinque', 'zensation', 'kurhaus_korsakow',
  'maison_umami', 'mina_ristorante', 'kouzina_savignyplatz', 'hado_savignyplatz',
  'andalucia_savignyplatz', 'peter_pane_charlottenburg', 'luisenbraeu',
  'samowar_restaurant', 'opera_italiana', 'schloss_cafe_charlottenburg',
  'umami_xberg', 'austria_bergmann', 'good_morning_vietnam_vegan',
  'kumpel_keule', 'mani_in_pasta', 'meze_feinkost', 'max_und_moritz',
  'santa_maria_oranien', 'ora_berlin', 'orania_restaurant', 'curry_36_hbf',
  'dean_david_hbf', 'zollpackhof'
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
  assert.equal(
    Copy.dayDecision({ dayNumber: 1, arrivalPoint: 'hbf', arrivalTime: 'morning', area: 'Prenzlauer Berg' }),
    'Go from Berlin Hbf to your stay in Prenzlauer Berg. Leave your bags. Start sightseeing after that.',
  );
  assert.equal(
    Copy.dayDecision({ dayNumber: 1, arrivalPoint: 'hotel', arrivalTime: 'evening', area: 'Charlottenburg / West' }),
    'Leave your bags at your hotel or apartment in Charlottenburg / West. Eat near your stay. Start sightseeing tomorrow.',
  );
  assert.equal(
    Copy.dayDecision({ dayNumber: 1, arrivalPoint: 'alex', arrivalTime: 'afternoon', area: 'Mitte / Alexanderplatz' }),
    'Start at Alexanderplatz. Leave your bags at your stay in Mitte / Alexanderplatz first if you have them. Keep the first walk close to your stay.',
  );
  assert.doesNotMatch(
    [
      Copy.dayDecision({ dayNumber: 1, arrivalPoint: 'hbf', area: 'Mitte' }),
      Copy.dayDecision({ dayNumber: 1, arrivalPoint: 'hotel', area: 'Mitte' }),
    ].join(' '),
    /BER/,
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
    'BerlinWalk tour and 20th-century history',
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

test('central history decision uses visitor language instead of internal food labels', () => {
  const decision = Copy.dayDecision({
    dayNumber: 4,
    area: 'Mitte',
    placeIds: ['holocaust_memorial', 'gendarmenmarkt_food_search', 'gendarmenmarkt', 'nikolaiviertel'],
  });
  assert.equal(
    decision,
    'These stops show three different parts of central Berlin. Start at the Holocaust Memorial. Have lunch near Gendarmenmarkt. Finish in Nikolaiviertel beside the Spree.',
  );
  assert.doesNotMatch(decision, /Food near|food_search|->/);
});

test('Museum Island Why this day explains the reason in plain visitor language', () => {
  const decision = Copy.dayDecision({
    dayNumber: 4,
    area: 'Museum Island',
    placeIds: ['museum_island', 'berlin_cathedral'],
  });
  assert.equal(
    decision,
    'Museum Island has five museums and Berlin Cathedral. They are all close together beside the Spree. Choose one museum. Do not try to visit all five in one day.',
  );
  assert.doesNotMatch(decision, /over-solving|route|anchor|spine/i);
});

test('Prenzlauer Berg places never receive a West Berlin title', () => {
  const ids = ['kulturbrauerei', 'eberswalder_food_search', 'kastanienallee', 'prater_biergarten'];
  assert.equal(
    Copy.dayTitle({ dayNumber: 7, area: 'Prenzlauer Berg', planKey: 'local', placeIds: ids }),
    'Prenzlauer Berg courtyards and local streets',
  );
  assert.doesNotMatch(Copy.dayTitle({ dayNumber: 7, area: 'Prenzlauer Berg', planKey: 'local', placeIds: ids }), /West Berlin/);
});

test('meal and Plan B copy name the real place and the next action', () => {
  assert.equal(
    Copy.mealCopy({ meal: 'lunch', placeIds: ['dicke_wirtin'], area: 'Charlottenburg' }),
    'Dicke Wirtin is a suggested lunch option. Check today\'s opening hours and availability before you go.',
  );
  assert.equal(
    Copy.planB({ placeIds: ['charlottenburg_palace', 'savignyplatz', 'lietzensee'] }),
    'If rain is steady, check Charlottenburg Palace\'s official opening hours. If it is open, spend more time inside and skip Lietzensee.',
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

test('central quick-meal alternatives use their real area, not the stay area', () => {
  assert.equal(
    Copy.blockTitle({
      time: 'Lunch',
      placeIds: ['curry_61', 'monsieur_vuong'],
      area: 'Prenzlauer Berg',
    }),
    'Lunch near Hackescher Markt',
  );
  assert.equal(
    Copy.blockTitle({
      time: 'Lunch',
      placeIds: ['curry_61', 'dicke_wirtin'],
      area: 'Charlottenburg',
    }),
    'Lunch near Charlottenburg',
  );
});

test('food-search guidance stays meal-neutral for lunch and dinner blocks', () => {
  const searchIds = [
    'oranienstrasse_food_search',
    'friedrichshain_food_search',
    'eberswalder_food_search',
    'museum_island_food_search',
    'gendarmenmarkt_food_search',
    'potsdam_food_search',
    'lietzensee_food_search',
    'berlin_hbf_food_search',
    'tempelhof_food_search',
    'bergmannkiez_food_search',
  ];
  searchIds.forEach((placeId) => {
    const guidance = Copy.PLACE_GUIDANCE[placeId];
    assert.doesNotMatch(guidance.fact + ' ' + guidance.action, /\b(?:lunch|dinner)\b/i, placeId);
    const lunch = Copy.mealCopy({ meal: 'lunch', placeIds: [placeId], area: 'Berlin' });
    const dinner = Copy.mealCopy({ meal: 'dinner', placeIds: [placeId], area: 'Berlin' });
    assert.equal(lunch, dinner, placeId);
    assert.doesNotMatch(lunch, /\b(?:lunch|dinner)\b/i, placeId);
    assert.match(lunch, /choose a place that is open now/i, placeId);
  });
  assert.equal(
    Copy.mealCopy({ meal: 'lunch', placeIds: ['bergmannkiez_food_search'], area: 'Kreuzberg' }),
    'Bergmannkiez has restaurants beside Viktoriapark and Marheineke Markthalle. Open the map search and choose a place that is open now.',
  );
  assert.equal(
    Copy.mealCopy({ meal: 'lunch', placeIds: ['oranienstrasse_food_search'], area: 'Kreuzberg' }),
    'Oranienstraße has restaurants between Görlitzer Bahnhof and Moritzplatz. Open the map search and choose a place that is open now.',
  );
  assert.doesNotMatch(Copy.placeCopy('gendarmenmarkt_food_search'), /This search stays/i);
});

test('Plan B never invents the retired generic indoor fallbacks', () => {
  const copies = [
    Copy.planB({ dayNumber: 1, arrivalTime: 'morning', area: 'Prenzlauer Berg', placeIds: ['alexanderplatz'] }),
    Copy.planB({ dayNumber: 1, arrivalTime: 'evening', area: 'Charlottenburg', placeIds: [] }),
    Copy.planB({ area: 'Mitte', hasOpeningWarning: true, placeIds: ['museum_island'] }),
    Copy.planB({ area: 'Friedrichshain', placeIds: ['raw_gelande'] }),
    Copy.planB({ area: 'Charlottenburg', placeIds: ['charlottenburg_palace', 'lietzensee'] }),
  ];
  assert.doesNotMatch(copies.join(' '), /Humboldt Forum|Museum Berggruen|listed indoor backup/i);
  assert.equal(
    copies[0],
    'If rain is steady after check-in, eat near your stay in Prenzlauer Berg. Skip the outdoor loop.',
  );
  assert.equal(
    copies[1],
    'If rain is steady, eat near your stay in Charlottenburg. Skip the extra walk.',
  );
  assert.match(copies[2], /skip it and shorten the route around Mitte/i);
  assert.match(copies[3], /Stay near Friedrichshain/i);
});

test('meal-only arrival and Potsdam Plan B copy give a complete direct action', () => {
  assert.equal(
    Copy.planB({ dayNumber: 1, arrivalTime: 'morning', area: 'Prenzlauer Berg', placeIds: ['eberswalder_food_search', 'prater_biergarten'] }),
    'If rain is steady after check-in, eat near your stay in Prenzlauer Berg and end the day there.',
  );
  assert.equal(
    Copy.planB({ dayNumber: 4, area: 'Potsdam', placeIds: ['potsdam_hbf', 'sanssouci', 'sanssouci_park'] }),
    'If rain is steady, shorten Sanssouci Park and return to Berlin after the palace.',
  );
});

test('East Side Gallery rain copy gives one direct action without leaking a route label', () => {
  const copy = Copy.planB({
    dayNumber: 5,
    area: 'Friedrichshain -> Kreuzberg',
    placeIds: ['east_side_gallery', 'oberbaum_bridge', 'burgermeister_schlesi'],
  });
  assert.equal(
    copy,
    'If rain is steady, shorten East Side Gallery. Cross Oberbaum Bridge and end the sightseeing part of the day in Kreuzberg.',
  );
  assert.doesNotMatch(copy, /->|Stay near/);
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
  assert.deepEqual(Copy.bannedPhrases('Take an ABC train and follow the route windows.'), [
    'route windows',
    'take an abc train',
  ]);
  assert.equal(Copy.bannedPhrases('Take the train to Alexanderplatz. Leave your bags.').length, 0);
});
