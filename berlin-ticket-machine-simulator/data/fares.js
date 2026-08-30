/* fares.js — verified fare + rule data for the Berlin Ticket Machine Simulator.
 *
 * This file is the ONLY place prices, zones, validity and the challenge
 * scenarios live. The widget UI (../index.html) reads from it, and
 * ../tests/challenge-mode.test.mjs asserts against it, so the numbers can be
 * re-checked without reading a line of interface code.
 *
 * Every euro figure and rule below was read from the official BVG / VBB pages
 * on PRICES_CHECKED_ON. The exact source behind each ticket is in
 * ./SOURCES.md. Prices are the 2026 VBB tariff (valid from 1 January 2026),
 * quoted for one adult at the regular fare unless a reduced figure is given.
 * Do not edit a price here without re-reading its source and moving the
 * PRICES_CHECKED_ON stamp.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  // Browser: expose a single global the widget reads. Node: the global is a
  // harmless extra; tests use the module.exports above.
  root.BTM_DATA = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // Machine-readable and human stamps for the "Prices checked" line.
  var PRICES_CHECKED_ON = '2026-08-30';
  var PRICES_CHECKED_LABEL = '30 August 2026';

  // Official sources. PRIMARY is the one the "check current prices" link uses.
  var SOURCES = [
    { label: 'BVG — all tickets and prices', url: 'https://www.bvg.de/en/subscriptions-and-tickets/all-tickets' },
    { label: 'VBB — tickets', url: 'https://www.vbb.de/en/tickets/' },
    { label: 'VBB — public transport to BER Airport (Zone C)', url: 'https://www.vbb.de/en/driving-information/ber-airport/' },
    { label: 'BVG — tariff zones and information', url: 'https://www.bvg.de/en/subscriptions-and-tickets/tariff-zones-and-information' },
  ];
  var PRIMARY_SOURCE = SOURCES[0];

  // Ticket catalogue. `price` / `reduced` are euro strings exactly as printed
  // on the official pages; `reduced` is null where no reduced fare exists.
  // `code` is the label a paper ticket carries on the validation stamp.
  var TICKETS = {
    kurz: {
      key: 'kurz', name: 'Short-trip ticket', german: 'Kurzstrecke',
      code: 'KURZSTRECKE', zone: 'AB', zoneLabel: 'Berlin AB',
      price: '2.80', reduced: '2.10',
      pick: '3 U-/S-Bahn stops or 6 bus/tram stops',
      validity: '3 U-/S-Bahn stops (changes allowed) or 6 bus/tram stops (no change)',
      summary: 'Valid for <b>3 stops</b> on the U-Bahn or S-Bahn with changes, or <b>6 stops</b> on a bus or tram. No return, no round trips. Reduced (child 6-14) <b>2.10&nbsp;euro</b>.',
    },
    single_ab: {
      key: 'single_ab', name: 'Single ticket AB', german: 'Einzelfahrausweis AB',
      code: 'EINZELFAHRAUSWEIS AB', zone: 'AB', zoneLabel: 'Berlin AB',
      price: '4.00', reduced: '2.50',
      pick: 'one normal trip inside the city',
      validity: '120 minutes, one direction, changes allowed, no round trip',
      summary: 'One journey in <b>one direction</b> across zones A and B, valid <b>120 minutes</b>, changes between lines allowed. The standard tourist single. Reduced (child 6-14) <b>2.50&nbsp;euro</b>.',
    },
    single_abc: {
      key: 'single_abc', name: 'Single ticket ABC', german: 'Einzelfahrausweis ABC',
      code: 'EINZELFAHRAUSWEIS ABC', zone: 'ABC', zoneLabel: 'Berlin ABC',
      price: '5.00', reduced: '3.50',
      pick: 'a single trip to or from BER airport or Potsdam',
      validity: '120 minutes, one direction, changes allowed, no round trip',
      summary: 'Same as the single AB but it adds <b>Zone C</b>, which you need for <b>BER airport</b> and <b>Potsdam</b>. Valid 120 minutes, one direction. Reduced (child 6-14) <b>3.50&nbsp;euro</b>.',
    },
    day_ab: {
      key: 'day_ab', name: '24-hour ticket AB', german: '24-Stunden-Karte AB',
      code: '24-STUNDEN-KARTE AB', zone: 'AB', zoneLabel: 'Berlin AB',
      price: '11.20', reduced: '7.40',
      pick: 'a full day of city sightseeing',
      validity: '24 hours from validation, unlimited trips; covers 1 adult and up to 3 children 6-14',
      summary: 'Unlimited trips in zones A and B for <b>24 hours from the moment you validate it</b>. Worth it from about three rides. Covers one adult plus up to three children 6-14. Reduced <b>7.40&nbsp;euro</b>.',
    },
    day_abc: {
      key: 'day_abc', name: '24-hour ticket ABC', german: '24-Stunden-Karte ABC',
      code: '24-STUNDEN-KARTE ABC', zone: 'ABC', zoneLabel: 'Berlin ABC',
      price: '12.90', reduced: '8.00',
      pick: 'a sightseeing day that reaches the airport or Potsdam',
      validity: '24 hours from validation, unlimited trips including Zone C; covers 1 adult and up to 3 children 6-14',
      summary: 'Unlimited trips in zones A, B and C for <b>24 hours from validation</b>, including <b>BER airport</b> and <b>Potsdam</b>. Reduced <b>8.00&nbsp;euro</b>.',
    },
    group_ab: {
      key: 'group_ab', name: '24-hour small-group ticket AB', german: '24-Stunden-Karte Kleingruppe AB',
      code: '24-STUNDEN-KARTE GRUPPE AB', zone: 'AB', zoneLabel: 'Berlin AB',
      price: '35.30', reduced: null,
      pick: 'up to 5 people riding together all day in the city',
      validity: '24 hours from validation, up to 5 people, unlimited shared rides',
      summary: 'One ticket for <b>up to five people</b>, unlimited rides in zones A and B for 24 hours from validation. No airport or Potsdam.',
    },
    group_abc: {
      key: 'group_abc', name: '24-hour small-group ticket ABC', german: '24-Stunden-Karte Kleingruppe ABC',
      code: '24-STUNDEN-KARTE GRUPPE ABC', zone: 'ABC', zoneLabel: 'Berlin ABC',
      price: '37.70', reduced: null,
      pick: 'up to 5 people riding together all day including the airport or Potsdam',
      validity: '24 hours from validation, up to 5 people, unlimited shared rides including Zone C',
      summary: 'One ticket for <b>up to five people</b>, unlimited rides in zones A, B and C for 24 hours from validation, including <b>BER airport</b> and <b>Potsdam</b>.',
    },
  };

  // The five tickets the Practice machine lists, in screen order. The small
  // group tickets are taught in Challenge and kept off the machine list so the
  // original Practice flow is unchanged.
  var PRACTICE_ORDER = ['kurz', 'single_ab', 'single_abc', 'day_ab', 'day_abc'];

  // General facts, all sourced (see SOURCES.md).
  var FACTS = {
    berAirportZone: 'C',
    potsdamZone: 'C',
    fineEuro: 60,
    validationRule: 'A paper ticket from a machine is not valid until you stamp it in the small yellow or red box on the platform (Bitte hier entwerten). App tickets are already active and are not stamped.',
    reducedRule: 'Reduced (ermaessigt) fares are for children aged 6 to 14. Children under 6 travel free.',
  };

  // Challenge scenarios. Each option carries its own reason string so the same
  // data drives both the answer check and the per-answer explanation. `correct`
  // is the key of the right option; `nextMove` is the real machine action,
  // including the validation step every scenario ends on.
  var SCENARIOS = [
    {
      id: 'ber-to-city',
      title: 'Landing at BER, heading into the city',
      situation: 'You have just landed at BER Airport. Your hotel is near Alexanderplatz in the city centre. One adult, travelling alone, taking the train straight there.',
      question: 'Which ticket do you buy from the machine on the platform?',
      correct: 'single_abc',
      options: [
        { key: 'single_ab', reason: 'AB stops at the city limit. BER sits in Zone C, so an AB ticket is not valid for the airport run and can earn you the 60 euro fine.' },
        { key: 'single_abc', reason: 'Correct. BER Airport is in Zone C, so any airport trip needs an ABC ticket. One ride into the city in one direction is a single, valid 120 minutes with changes.' },
        { key: 'day_ab', reason: 'Wrong zone (no Zone C), and for one straight ride to your hotel a whole 24-hour ticket is more than you need.' },
        { key: 'kurz', reason: 'A short-trip ticket is only 3 rail stops. The airport run is far longer and crosses into Zone C, so this is invalid.' },
      ],
      why: 'BER is Zone C, so from the city you need ABC. A single covers one direction for 120 minutes.',
      nextMove: 'On the machine: touch the screen, choose English, pick the single ticket, select zone ABC, pay by card or coins, then stamp the paper ticket in the red or yellow validator before you board the S-Bahn, FEX or regional train.',
    },
    {
      id: 'city-ab',
      title: 'A normal trip across the city',
      situation: 'You are at Kottbusser Tor and meeting a friend up in Prenzlauer Berg. One adult, one trip across the city with a line change, all inside Berlin.',
      question: 'Which ticket is right for this one trip?',
      correct: 'single_ab',
      options: [
        { key: 'kurz', reason: 'Kottbusser Tor to Prenzlauer Berg is well over 3 rail stops, so a short-trip ticket runs out and leaves you riding without a valid ticket.' },
        { key: 'single_ab', reason: 'Correct. You stay inside Berlin (zones A and B) and make one trip in one direction. The AB single is valid 120 minutes and lets you change lines.' },
        { key: 'single_abc', reason: 'ABC works, but you are paying for Zone C you never enter. Inside Berlin the AB single is the right, cheaper choice.' },
        { key: 'day_ab', reason: 'A 24-hour ticket only pays off from about three rides. For one crossing it is overkill.' },
      ],
      why: 'Inside Berlin means zones A and B. One trip, one direction, changes allowed: the AB single, valid 120 minutes.',
      nextMove: 'On the machine: single ticket, zone AB, pay, then stamp the paper ticket before boarding.',
    },
    {
      id: 'potsdam-day',
      title: 'A day trip out to Potsdam',
      situation: 'A day trip from Mitte out to Potsdam and Sanssouci. One adult. You ride out in the morning, take trams and buses around Potsdam, then come back in the evening: several rides in all.',
      question: 'Which ticket covers the whole day out to Zone C?',
      correct: 'day_abc',
      options: [
        { key: 'single_abc', reason: 'One ABC single only covers one direction. You would have to buy again for local Potsdam trips and for the ride home, so it is not the day-trip answer.' },
        { key: 'day_ab', reason: 'Right idea, wrong zone. AB stops at the Berlin border and does not reach Potsdam, which is Zone C.' },
        { key: 'day_abc', reason: 'Correct. Potsdam is in Zone C, so you need ABC, and because you ride out, around and back, a 24-hour ABC ticket (valid 24 hours from validation) is simpler and cheaper than buying single after single.' },
        { key: 'single_ab', reason: 'Neither the zone nor the shape fits: no Zone C, and one single cannot cover a full day of Potsdam rides.' },
      ],
      why: 'Potsdam is Zone C, so ABC. Many rides across the day make the 24-hour ABC ticket the simple, cheap choice. (If you only went straight there and back with no local rides, two ABC singles at 10.00 euro would edge it.)',
      nextMove: 'On the machine: 24-hour ticket, zone ABC, pay, then stamp it once before your first ride. It then covers every ride for 24 hours.',
    },
    {
      id: 'sightseeing-day',
      title: 'A full sightseeing day in the city',
      situation: 'Your first full day in Berlin, no airport. Brandenburg Gate, Museum Island, the East Side Gallery, hopping the U-Bahn and tram all day, back to the hotel late. One adult.',
      question: 'Which ticket fits a full day of city rides?',
      correct: 'day_ab',
      options: [
        { key: 'single_ab', reason: 'One single is fine for one ride, but you will ride four or five times today, and a single each time costs more than the day ticket.' },
        { key: 'day_ab', reason: 'Correct. All day, many rides, all inside Berlin. From about three rides the 24-hour AB ticket beats singles, and it runs 24 hours from the moment you stamp it. No Zone C, so AB not ABC.' },
        { key: 'day_abc', reason: 'You never leave the city, so paying for Zone C is money wasted. AB covers everything on this route.' },
        { key: 'kurz', reason: 'Short-trip tickets only stretch 3 rail stops. On a full sightseeing day they run out almost immediately.' },
      ],
      why: 'All day, many rides, city only (A and B). The 24-hour AB ticket wins from about three rides and is valid 24 hours from validation.',
      nextMove: 'On the machine: 24-hour ticket, zone AB, pay, then stamp it once before your first ride.',
    },
    {
      id: 'group-day',
      title: 'Five friends out for the day',
      situation: 'Five adults travelling together want to ride all day inside Berlin: no airport, no Potsdam. You want one simple, cheap way for all five to ride together.',
      question: 'Which ticket covers the whole group for the day?',
      correct: 'group_ab',
      options: [
        { key: 'group_ab', reason: 'Correct. The 24-hour small-group ticket covers up to five people for 24 hours from validation, all inside zones A and B, for 35.30 euro. Far cheaper than five separate day tickets.' },
        { key: 'day_ab', reason: 'One 24-hour AB ticket covers one adult (plus up to three children 6-14), so five adults would need five of them at 11.20 each: 56.00 euro. The small-group ticket is one ticket at 35.30.' },
        { key: 'single_ab', reason: 'Singles are one ride each. For five people out all day you would be buying tickets constantly.' },
        { key: 'group_abc', reason: 'The group ticket is right, but ABC adds Zone C you never use. Inside Berlin the AB small-group ticket is the cheaper pick.' },
      ],
      why: 'Up to five people, all day, city only. The 24-hour small-group AB ticket (35.30) is one ticket for the whole group and beats five day tickets. Tip: a 24-hour ticket already carries one adult plus up to three children 6-14 free, so a two-adult family with kids often does better with two ordinary day tickets.',
      nextMove: 'On the machine: 24-hour ticket, then the small-group option, zone AB, pay, and stamp it once before the group boards.',
    },
  ];

  return {
    PRICES_CHECKED_ON: PRICES_CHECKED_ON,
    PRICES_CHECKED_LABEL: PRICES_CHECKED_LABEL,
    SOURCES: SOURCES,
    PRIMARY_SOURCE: PRIMARY_SOURCE,
    TICKETS: TICKETS,
    PRACTICE_ORDER: PRACTICE_ORDER,
    FACTS: FACTS,
    SCENARIOS: SCENARIOS,
  };
});
