/* lead-form-inject.js — blog-post BerlinWalk booking card.
 *
 * Compact booking card (2026-07-16 redesign, Yusuf-approved variant B):
 * dark green "FREE BERLIN WALKING TOUR" strip with the FreeTour rating,
 * 116px square promo thumb, title + facts line, horizontally scrollable
 * live date chips, and a full-width "Check availability" CTA. Date chips
 * carry real Wix Bookings session IDs, so a click lands on the native Wix
 * booking step with that date selected. The card is inserted after the
 * first paragraph that follows the 2nd H2 (~25% depth) so most readers
 * see it before bouncing; the pre-2026-07-16 version sat at the middle H2.
 *
 * Live safety: enabled on /post/* pages. Disable temporarily with:
 *   ?bwBlogBooking=0
 * or set before loading this script:
 *   window.BW_DISABLE_BLOG_BOOKING = true
 */
(function () {
  var DISABLED = window.BW_DISABLE_BLOG_BOOKING === true || /[?&]bwBlogBooking=0(?:&|$)/.test(location.search);
  var ENABLED = !DISABLED && (
    location.pathname.indexOf('/post/') === 0 ||
    window.BW_ENABLE_BLOG_BOOKING === true ||
    /[?&]bwBlogBooking=1(?:&|$)/.test(location.search)
  );
  if (!ENABLED) return;

  var AVAILABILITY_URL = 'https://berlinwalk-content-app.vercel.app/api/booking-calendar-availability?days=120&guests=1';
  var BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
  /* Slot deep links must use the Booking Form URL: the service-page calendar
   * ignores bookings_sessionId, the form preselects the slot from it. */
  var BOOKING_FORM_URL = 'https://www.berlinwalk.com/booking-form';
  var MARKER = 'data-bw-blog-booking';
  var STYLE_ID = 'bw-blog-booking-inject-style';
  var LOG = '[BW blog booking]';
  var MAX_REINJECTS = 8;
  var REINJECT_DEBOUNCE_MS = 400;
  var HISTORY_ELEMENT_TAG = 'bw-history-lead-magnet';
  var HISTORY_MARKER = 'data-bw-history-lead';
  var HISTORY_EXPERIMENT_ID = 'history_story_lead_v1';
  var HISTORY_STORAGE_KEY = 'bwHistoryLeadExperiment.v1';
  var HISTORY_API_BASE = window.BW_HISTORY_LEAD_API_BASE || 'https://app.berlinwalk.com/api/history-lead';
  var HISTORY_ELEMENT_URL = window.BW_HISTORY_LEAD_ELEMENT_URL || 'https://fenerszymanski.github.io/berlinwalk-widgets/history-lead-magnet/history-lead-magnet-element.js';
  var HISTORY_RAMP_SLUG = 'why-berlin-doesn-t-have-a-beautiful-old-town-and-why-that-s-the-point';
  var HISTORY_PILOT_SLUG = 'why-berlin-s-streets-are-so-wide-it-wasn-t-always-the-plan';
  var HISTORY_EXPANSION_SLUG = 'alexanderplatz-then-and-now-from-medieval-market-to-modern-chaos';
  var HISTORY_INLINE_PLACEMENT = 'blog_inline_booking_slot';
  var HISTORY_ELEMENT_READY_TIMEOUT_MS = 7000;
  var HISTORY_ORIGINAL_CANARY_SLUGS = {};
  var HISTORY_RELEVANT_ROLLOUT_SLUGS = {};
  HISTORY_ORIGINAL_CANARY_SLUGS[HISTORY_RAMP_SLUG] = true;
  HISTORY_ORIGINAL_CANARY_SLUGS[HISTORY_PILOT_SLUG] = true;
  [
    'where-was-the-berlin-wall-interactive-map',
    'the-ampelmann-how-a-traffic-light-became-berlin-s-most-beloved-symbol',
    'unter-den-linden-berlin',
    'why-is-berlin-founding-year-1237'
  ].forEach(function (slug) { HISTORY_RELEVANT_ROLLOUT_SLUGS[slug] = true; });
  var CONTENT_UPGRADE_ELEMENT_TAG = 'bw-content-upgrade-card';
  var CONTENT_UPGRADE_MARKER = 'data-bw-content-upgrade';
  var CONTENT_UPGRADE_DEFAULT_API_BASE = window.BW_DOWNLOAD_LEAD_API_BASE || 'https://app.berlinwalk.com/api/download-lead';
  var CONTENT_UPGRADE_DEFAULT_ELEMENT_URL = window.BW_CONTENT_UPGRADE_ELEMENT_URL || 'https://fenerszymanski.github.io/berlinwalk-widgets/content-upgrade-card/content-upgrade-card-element.js?v=20260817-magnet1';
  var CONTENT_UPGRADE_PLACEMENT = 'blog_inline_booking_slot';
  var CONTENT_UPGRADE_READY_TIMEOUT_MS = 7000;
  var CONTENT_UPGRADE_MAGNETS = [{
    experimentId: 'berlin_skip_list_v1',
    assetId: 'berlin-skip-list',
    assetVersion: '2026-08-v1',
    storageKey: 'bwContentUpgrade.berlinSkipList.v1',
    apiBase: CONTENT_UPGRADE_DEFAULT_API_BASE,
    elementUrl: CONTENT_UPGRADE_DEFAULT_ELEMENT_URL,
    placement: CONTENT_UPGRADE_PLACEMENT,
    controlType: 'private-tour',
    controlUrl: 'https://www.berlinwalk.com/private-tour',
    acquisitionCohort: 'berlin_skip_list_pilot',
    slugs: [
      'how-many-days-in-berlin',
      'one-day-in-berlin',
      'weekend-in-berlin-48-hour-itinerary',
      '2-days-in-berlin-itinerary',
      'berlin-in-3-days-the-perfect-itinerary-from-a-local-guide',
      'berlin-first-time-visitor-mistakes-12-things-to-know-before-you-go',
      'best-museums-in-berlin-first-time-visitors',
      'is-berlin-walkable',
      'berlin-with-kids',
      'berlin-accessibility',
      'berlin-itinerary-for-couples',
      'travelling-alone-in-berlin-day-plan',
      'how-to-spend-a-sunday-in-berlin',
      'berlin-on-a-monday',
      'berlin-heatwave-day-plan',
      'is-berlin-safe-for-solo-travelers-an-honest-local-perspective',
      'berlin-last-day',
      'what-to-do-in-berlin-when-it-rains-12-indoor-activities-worth-your-time',
      'berlin-in-the-rain',
      'berlin-with-parents',
      'berlin-sights-near-alexanderplatz-walking-distance',
      'hidden-places-central-berlin',
      '7-best-photo-spots-in-berlin-most-tourists-walk-right-past',
      '5-mistakes-tourists-make-at-alexanderplatz',
      'berlin-tourist-scams',
      'berlin-hop-on-hop-off-bus-worth-it',
      'what-to-book-in-advance-in-berlin',
      'bus-100-berlin-the-4-sightseeing-tour-locals-don-t-want-you-to-know-about',
      'free-things-to-do-in-berlin-2026'
    ],
    component: {
      barCopy: 'FREE SAVE-TO-PHONE GUIDE',
      eyebrow: 'Central Berlin, edited',
      title: 'The Berlin Skip List',
      description: 'Nine things I would skip in central Berlin, and what the hours buy you instead.',
      gateCopy: 'That is three of nine. Want all nine as a card you can keep on your phone while you walk? I will email it.',
      submitLabel: 'Email me the Skip List',
      consentVersion: 'berlin-skip-list-v1-2026-08-15',
      consentText: 'By requesting this list, I agree to receive it by email plus occasional BerlinWalk emails about planning a Berlin trip. I can unsubscribe anytime. Privacy Policy.',
      successCopy: 'Check your inbox to confirm your email and open The Berlin Skip List.',
      arrivalLabel: 'When are you planning to arrive?',
      arrivalOptions: [
        { value: 'this-month', label: 'This month' },
        { value: 'next-month', label: 'Next month' },
        { value: 'in-2-3-months', label: 'In 2-3 months' },
        { value: 'not-booked-yet', label: 'Not booked yet' }
      ],
      teasers: [
        { number: 1, title: 'Skip the ride up the TV Tower.', body: 'You queue for a timed slot, and the one view missing from the top is the tower itself. I would rather walk you along the Spree from Museum Island.' },
        { number: 2, title: 'Skip Checkpoint Charlie.', body: 'It is a rebuilt booth ringed by fast food and men in costume. The border that mattered is a short ride north at Bernauer Straße, where a preserved stretch of the death strip still stands.' },
        { number: 7, title: 'Skip the Reichstag dome if you have not registered.', body: 'It is free, but you cannot walk in and the slots go before you arrive. Register with the Bundestag visitor service well ahead, or spend the time on the lawn out front.' }
      ],
      items: [
        { number: 1, skip: 'TV Tower ride', why: 'A timed attraction can eat a short day.', instead: 'Walk the Spree from Museum Island.' },
        { number: 2, skip: 'Checkpoint Charlie', why: 'The booth is a reconstruction, not the full story.', instead: 'Go to the Berlin Wall Memorial.' },
        { number: 3, skip: 'Berlin Dungeon and Madame Tussauds', why: 'The format travels better than the Berlin context.', instead: 'Choose the Topography of Terror.' },
        { number: 4, skip: 'Eating at Alexanderplatz', why: 'Convenience is not the same as a good Berlin meal.', instead: 'Walk to Rosa-Luxemburg-Platz.' },
        { number: 5, skip: 'The hop-on-hop-off bus', why: 'A fixed timetable keeps you above the streets.', instead: 'Take BVG 100 or 200 toward Alexanderplatz.' },
        { number: 6, skip: 'Several Museum Island museums', why: 'One day of museums can become a tired checklist.', instead: 'Choose one museum, then walk Lustgarten.' },
        { number: 7, skip: 'The Reichstag dome without a booking', why: 'Free does not mean walk-in is guaranteed.', instead: 'Register through the Bundestag visitor service.' },
        { number: 8, skip: 'A day trip with only two Berlin days', why: 'A day trip removes one whole Berlin day.', instead: 'Keep the centre for this visit.' },
        { number: 9, skip: 'Treating Potsdamer Platz as a full attraction', why: 'The square is a crossing point, not a whole afternoon.', instead: 'See the Wall fragments, then Niederkirchnerstraße.' }
      ]
    }
  }, {
    experimentId: 'berlin_pass_calculator_v1',
    assetId: 'berlin-pass-decision-sheet',
    assetVersion: '2026-08-v1',
    storageKey: 'bwContentUpgrade.berlinPassCalc.v1',
    apiBase: CONTENT_UPGRADE_DEFAULT_API_BASE,
    elementUrl: CONTENT_UPGRADE_DEFAULT_ELEMENT_URL,
    placement: CONTENT_UPGRADE_PLACEMENT,
    controlType: 'landmarks-guide',
    controlUrl: 'https://www.berlinwalk.com/products/berlin-landmarks-guide',
    acquisitionCohort: 'berlin_pass_sheet_pilot',
    slugs: [
      'which-berlin-pass-is-worth-it',
      'is-the-berlin-welcomecard-worth-it-in-2026-an-honest-breakdown',
      'berlin-museum-pass-vs-single-tickets-which-one-saves-you-money',
      'is-museum-island-free-tickets-prices-and-what-to-actually-skip',
      'is-the-ddr-museum-worth-it-tickets-queues-and-what-to-expect-in-2026',
      'berliner-dom-tickets',
      'victory-column-berlin-view-tickets-and-climb-tips',
      'museum-pass',
      'welcomecard',
      'berlin-ab-abc-ticket-zones',
      'is-the-berlin-tv-tower-worth-it-an-honest-guide-for-2026',
      'berlin-spy-museum-worth-it',
      'deutsches-technikmuseum-berlin',
      'gemaldegalerie-berlin',
      'stasi-museum-berlin',
      'berlin-natural-history-museum',
      'jewish-museum-berlin-guide',
      'is-the-ddr-museum-worth-it',
      'berlin-museum-bag-rules',
      'is-the-pergamon-museum-closed-what-every-tourist-needs-to-know-in-2026',
      '7-things-most-tourists-dont-know-about-the-berliner-dom',
      'humboldt-forum-berlin-free-entry-big-controversy-is-it-worth-visiting',
      'alte-nationalgalerie-berlin-the-greek-temple-on-museum-island-that-almost-disappeared',
      'the-altes-museum-how-one-building-made-berlin-a-cultural-capital',
      'the-neues-museum-from-bombed-ruin-to-nefertiti-s-home',
      'museum-island-why-prussia-built-an-entire-island-of-museums',
      'museum-island-before-and-after-wwii-the-destruction-nobody-expected',
      'which-berlin-museums-are-free-2026',
      'berlin-observation-decks',
      'the-tv-tower-10-things-you-didn-t-know-about-berlin-s-most-famous-landmark',
      'charlottenburg-palace-berlin'
    ],
    component: {
      barCopy: 'FREE DECISION SHEET',
      eyebrow: 'Berlin tickets, counted',
      title: 'The Berlin Pass Decision Sheet',
      description: 'Count your paid museums before you buy a pass. I put the four ticket worlds and the break-even lines on one page.',
      gateCopy: 'Those are three of the four ticket worlds. Want the full fill-in sheet with the break-even lines and a place to count your paid museums? I will email it.',
      submitLabel: 'Email me the sheet with my numbers',
      gateMode: 'calculator',
      calcConfig: {
        questions: [
          {
            id: 'days',
            prompt: 'How many days are you in Berlin?',
            options: [
              { value: '1', label: '1' },
              { value: '2-3', label: '2-3' },
              { value: '4+', label: '4+' }
            ]
          },
          {
            id: 'museums',
            prompt: 'Be honest: how many paid museums will you actually enter?',
            options: [
              { value: '0-1', label: '0-1' },
              { value: '2', label: '2' },
              { value: '3+', label: '3+' }
            ]
          },
          {
            id: 'transit',
            prompt: 'Do you want transit included?',
            options: [
              { value: 'Yes', label: 'Yes' },
              { value: 'No', label: 'No' }
            ]
          }
        ],
        base: [
          { museums: '0-1', line: 'No pass. Pay single tickets; a lot of the best things are free anyway.' },
          { museums: '2', line: 'If both are on Museum Island, the €24 island day ticket wins (two singles are €28). If they are not, stay on single tickets.' },
          { museums: '3+', days: '1', line: 'One day, three museums: stay on Museum Island and take the €24 island day ticket. The €32 Museumspass only wins if you leave the island.' },
          { museums: '3+', days: ['2-3', '4+'], line: 'The €32 Museumspass wins. You break even inside the third museum and it covers 30+ museums over 3 consecutive days.' }
        ],
        transitAddenda: [
          { line: 'For transit, a €11.20 AB day ticket per day is the honest baseline. The €39.50 WelcomeCard 72h is €5.90 more than three day tickets; it only pays off if you use the discounts.' },
          { museums: '3+', days: '2-3', line: 'If you want transit plus free Museum Island entry in one card, the €62 WelcomeCard Museum Island is €3.60 cheaper than Museumspass plus day tickets, but it covers only the island.' },
          { museums: '3+', days: '4+', line: 'Museumspass runs 3 consecutive days; pick which 3.' }
        ],
        stamp: 'Prices checked 16 August 2026',
        placeholder: 'Answer all three questions.'
      },
      consentVersion: 'berlin-pass-decision-sheet-v1-2026-08-16',
      consentText: 'By requesting this sheet, I agree to receive it by email plus occasional BerlinWalk emails about Berlin tickets and trip planning. I can unsubscribe anytime. Privacy Policy.',
      successCopy: 'Check your inbox to confirm your email and open The Berlin Pass Decision Sheet.',
      arrivalLabel: 'When are you planning to arrive?',
      arrivalOptions: [
        { value: 'this-month', label: 'This month' },
        { value: 'next-month', label: 'Next month' },
        { value: 'in-2-3-months', label: 'In 2-3 months' },
        { value: 'not-booked-yet', label: 'Not booked yet' }
      ],
      teasers: [
        { number: 1, title: 'Museum Island ticket: €24.', body: 'For one focused day, start here. The ticket starts to make sense at the second paid museum.' },
        { number: 2, title: 'Museumspass Berlin: €32.', body: 'Three days and 30+ museums, but no transit. Count three paid museums before buying it.' },
        { number: 3, title: 'WelcomeCard Museum Island: €62.', body: 'Transit plus free island entry for 72 hours. It is not the same product as the €39.50 Classic card.' }
      ],
      items: [
        { number: 1, skip: 'Museum Island ticket', why: 'One focused day has a clear break-even point.', instead: 'Start at €24.' },
        { number: 2, skip: 'Museumspass Berlin', why: 'The three-day pass has a different museum count.', instead: 'Compare at three paid museums.' },
        { number: 3, skip: 'WelcomeCard Museum Island', why: 'Transit and island entry are bundled.', instead: 'Check that both benefits fit your stay.' }
      ],
      controlTitle: 'Want the places behind the ticket choice?',
      controlDescription: 'My Berlin Landmarks Guide puts the essential places on one practical route, so the ticket decision has a day behind it.',
      controlLabel: 'See the Landmarks Guide'
    }
  }, {
    experimentId: 'berlin_arrival_card_v1',
    assetId: 'berlin-arrival-card',
    assetVersion: '2026-08-v1',
    storageKey: 'bwContentUpgrade.berlinArrivalCard.v1',
    apiBase: CONTENT_UPGRADE_DEFAULT_API_BASE,
    elementUrl: CONTENT_UPGRADE_DEFAULT_ELEMENT_URL,
    placement: CONTENT_UPGRADE_PLACEMENT,
    controlType: 'first-day-rescue',
    controlUrl: 'https://www.berlinwalk.com/products/berlin-first-day-rescue-plan',
    acquisitionCohort: 'berlin_arrival_card_pilot',
    slugs: [
      'how-to-get-from-berlin-airport-to-alexanderplatz-the-easy-way',
      'berlin-airports',
      'berlin-ber-airport-departure-guide',
      'berlin-before-hotel-check-in-what-to-do-with-luggage-and-time',
      'luggage-storage-in-berlin-2026',
      'esim-sim-wifi-berlin-2026',
      'berlin-train-stations',
      'berlin-ab-or-abc-ticket-which-zone-do-tourists-need',
      'airport-to-alex',
      'berlin-deutschlandticket-tourists',
      'leaving-berlin-by-train',
      'berlin-weekend-friday-night-arrival',
      'berlin-before-hotel-check-in',
      'berlin-hauptbahnhof-guide',
      'berlin-layover-guide',
      'uber-in-berlin',
      'taxi-in-berlin',
      'atm-in-berlin',
      'currency-exchange-in-berlin',
      'u-bahn-vs-s-bahn-berlin',
      'berlin-ticket-machines',
      'buy-berlin-transport-tickets-on-your-phone',
      'do-you-really-need-to-validate-your-ticket-on-berlin-trains',
      'berlin-u-bahn-fine',
      'deutschlandticket-berlin-tourists',
      'berlin-night-transport',
      'berlin-public-transport-explained-for-tourists-u-bahn-s-bahn-tram-bus',
      'how-to-pronounce-berlin-station-names'
    ],
    component: {
      barCopy: 'FREE SAVE-TO-PHONE CARD',
      eyebrow: 'Arrival time, made practical',
      title: 'The Berlin Arrival Card',
      description: 'Your first move depends on your landing time. I put BER, ABC, luggage and late-arrival decisions on one card.',
      gateCopy: 'The landing hour changes the route. Want the full card with the ticket prices, shop fallback and late Hbf luggage move? I will email it.',
      submitLabel: 'Email me the Arrival Card',
      consentVersion: 'berlin-arrival-card-v1-2026-08-16',
      consentText: 'By requesting this card, I agree to receive it by email plus occasional BerlinWalk emails about arriving in Berlin and planning a Berlin trip. I can unsubscribe anytime. Privacy Policy.',
      successCopy: 'Check your inbox to confirm your email and open The Berlin Arrival Card.',
      arrivalLabel: 'When are you planning to arrive?',
      arrivalOptions: [
        { value: 'this-month', label: 'This month' },
        { value: 'next-month', label: 'Next month' },
        { value: 'in-2-3-months', label: 'In 2-3 months' },
        { value: 'not-booked-yet', label: 'Not booked yet' }
      ],
      teasers: [
        { number: 1, title: 'REWE at BER Terminal 1, U1: 24/7.', body: 'It is the simple Sunday and late-arrival fallback for water, food and one calmer decision.' },
        { number: 2, title: 'FEX: 04:00-01:00, every 15 minutes.', body: 'Use the live board for the actual departure, and do not assume the S9 night pattern runs every night.' },
        { number: 3, title: 'After 22:00 at Hbf, change the luggage plan.', body: 'The Gepäckcenter is closed. DB lockers remain the late option.' }
      ],
      items: [
        { number: 1, skip: 'Landing time', why: 'The first move changes with the clock.', instead: 'Use the arrival hour as the route.' },
        { number: 2, skip: 'ABC decision', why: 'BER is zone C.', instead: 'Save €5.00 or €12.90 in one line.' },
        { number: 3, skip: 'Late luggage', why: 'Hbf services close at different times.', instead: 'Plan around DB lockers after 22:00.' }
      ],
      controlTitle: 'Want your first Berlin day mapped around the clock?',
      controlDescription: 'My First-Day Rescue Plan turns your landing time, luggage and first neighbourhood into a practical first day.',
      controlLabel: 'See the First-Day Rescue Plan'
    }
  }, {
    experimentId: 'berlin_day_trip_compare_v1',
    assetId: 'berlin-day-trip-compare-sheet',
    assetVersion: '2026-08-v1',
    storageKey: 'bwContentUpgrade.berlinDayTripCompare.v1',
    apiBase: CONTENT_UPGRADE_DEFAULT_API_BASE,
    elementUrl: CONTENT_UPGRADE_DEFAULT_ELEMENT_URL,
    placement: CONTENT_UPGRADE_PLACEMENT,
    controlType: 'trip-planner',
    controlUrl: 'https://www.berlinwalk.com/berlin-trip-planner',
    acquisitionCohort: 'berlin_day_trip_compare_pilot',
    slugs: [
      'best-day-trips-from-berlin',
      'potsdam-from-berlin-day-trip',
      'potsdam-from-berlin-train-tickets-and-sanssouci-day-trip-plan',
      'sachsenhausen-from-berlin',
      'spreewald-day-trip-from-berlin',
      'dresden-day-trip-from-berlin',
      'leipzig-day-trip-from-berlin',
      'tropical-islands-from-berlin',
      'baltic-sea-day-trip-from-berlin',
      'wannsee-berlin',
      'hamburg-day-trip-from-berlin',
      'koepenick-berlin',
      'spandau-berlin',
      'teufelsberg-berlin',
      'berlin-lakes-guide-2026'
    ],
    component: {
      barCopy: 'FREE COMPARISON SHEET',
      eyebrow: 'Nine Berlin days',
      title: 'The Berlin Day Trip Compare Sheet',
      description: 'Nine day trips, four ticket worlds and the travel-time choice that changes the whole day.',
      gateCopy: 'Want the full comparison with ticket layers, travel durations and the honest fast-versus-cheap call? I will email it.',
      submitLabel: 'Email me the Compare Sheet',
      consentVersion: 'berlin-day-trip-compare-sheet-v1-2026-08-16',
      consentText: 'By requesting this sheet, I agree to receive it by email plus occasional BerlinWalk emails about Berlin day trips and planning. I can unsubscribe anytime. Privacy Policy.',
      successCopy: 'Check your inbox to confirm your email and open The Berlin Day Trip Compare Sheet.',
      arrivalLabel: 'When are you planning to arrive?',
      arrivalOptions: [
        { value: 'this-month', label: 'This month' },
        { value: 'next-month', label: 'Next month' },
        { value: 'in-2-3-months', label: 'In 2-3 months' },
        { value: 'not-booked-yet', label: 'Not booked yet' }
      ],
      teasers: [
        { number: 1, title: 'Wannsee is the AB half-day.', body: 'Keep it close when you want a lake, shore and local transport without turning the day into a logistics project.' },
        { number: 2, title: 'Potsdam and Sachsenhausen are ABC.', body: 'The zone is part of the decision. Save the current ABC line before you board.' },
        { number: 3, title: 'Dresden and Leipzig are clock decisions.', body: 'The Deutschlandticket route technically works, but the slower journey can use around three hours each way.' }
      ],
      items: [
        { number: 1, skip: 'AB', why: 'Wannsee is a local half-day.', instead: 'Keep the ticket layer simple.' },
        { number: 2, skip: 'ABC', why: 'Potsdam and Sachsenhausen leave Berlin.', instead: 'Check the zone before boarding.' },
        { number: 3, skip: 'Long-distance', why: 'Fast trains buy back the day.', instead: 'Compare time, not only fare.' }
      ],
      controlTitle: 'Want the whole stay planned around the day trips?',
      controlDescription: 'The Berlin Trip Planner turns day-trip ambition into a day-by-day plan with transport layers and recovery space.',
      controlLabel: 'Open the Trip Planner'
    }
  }, {
    experimentId: 'berlin_german_cheat_card_v1',
    assetId: 'berlin-german-cheat-card',
    assetVersion: '2026-08-v1',
    storageKey: 'bwContentUpgrade.berlinGermanCheatCard.v1',
    apiBase: CONTENT_UPGRADE_DEFAULT_API_BASE,
    elementUrl: CONTENT_UPGRADE_DEFAULT_ELEMENT_URL,
    placement: CONTENT_UPGRADE_PLACEMENT,
    controlType: 'private-tour',
    controlUrl: 'https://www.berlinwalk.com/private-tour',
    acquisitionCohort: 'berlin_german_cheat_card_pilot',
    slugs: [
      '50-essential-german-phrases-every-tourist-should-know-before-visiting-berlin',
      '10-german-words-every-tourist-should-know-before-visiting-berlin',
      'german-numbers-for-tourists-berlin',
      'telling-time-in-german-berlin',
      'entschuldigung-berlin',
      'berlin-slang-10-words-you-ll-only-hear-in-this-city',
      'german-signs-in-berlin',
      'do-i-need-to-speak-german-to-visit-berlin',
      'feierabend-fernweh-schadenfreude-7-german-words-with-no-english-translation',
      'why-berliners-aren-t-rude-they-re-just-honest'
    ],
    component: {
      barCopy: 'FREE SAVE-TO-PHONE CARD',
      eyebrow: 'Berlin German, five phrases first',
      title: 'The Berlin German Cheat Card',
      description: 'You do not need fluent German. You need five phrases you can say without thinking. I put them on one card for your phone.',
      gateCopy: 'Those are three of them. Want the full card with the five phrases that do the work, three rescue lines and the signs worth knowing on sight? I will email it.',
      submitLabel: 'Email me the German Cheat Card',
      consentVersion: 'berlin-german-cheat-card-v1-2026-08-18',
      consentText: 'By requesting this card, I agree to receive it by email plus occasional BerlinWalk emails about visiting Berlin and planning a Berlin trip. I can unsubscribe anytime. Privacy Policy.',
      successCopy: 'Check your inbox to confirm your email and open The Berlin German Cheat Card.',
      arrivalLabel: 'When are you planning to arrive?',
      arrivalOptions: [
        { value: 'this-month', label: 'This month' },
        { value: 'next-month', label: 'Next month' },
        { value: 'in-2-3-months', label: 'In 2-3 months' },
        { value: 'not-booked-yet', label: 'Not booked yet' }
      ],
      teasers: [
        { number: 1, title: 'Ich hätte gern...', body: 'The one phrase that opens almost any order. It is the polite "I would like," softer than "Ich will," and it works at a bakery, a bar or a ticket counter.' },
        { number: 2, title: 'Sprechen Sie Englisch?', body: 'Open in German, then ask this. Starting in German and switching lands far better than opening in English, and most people will happily switch.' },
        { number: 3, title: 'A flat reply is not rudeness.', body: 'Berliner Schnauze is the local directness. A short answer or a neutral face is not aimed at you, so do not let it stop you trying the German.' }
      ],
      items: [
        { number: 1, skip: 'Ich hätte gern (I would like)' },
        { number: 2, skip: 'Das da, bitte (that one, please)' },
        { number: 3, skip: 'Zum Mitnehmen, bitte (to take away)' },
        { number: 4, skip: 'Kann ich mit Karte zahlen? (pay by card)' },
        { number: 5, skip: 'Die Rechnung, bitte (the bill, please)' },
        { number: 6, skip: 'Sprechen Sie Englisch? (do you speak English)' },
        { number: 7, skip: 'Wo ist...? (where is)' },
        { number: 8, skip: 'Eine Fahrkarte, bitte (one ticket, please)' },
        { number: 9, skip: 'Ausgang / Eingang (exit / entrance)' }
      ],
      controlTitle: 'Want a Berlin walk in plain English?',
      controlDescription: 'On a private walk you do not need any German at all. I guide in clear English, at your pace, around your date.',
      controlLabel: 'See private walks'
    }
  }, {
    experimentId: 'berlin_food_decision_card_v1',
    assetId: 'berlin-food-decision-card',
    assetVersion: '2026-08-v1',
    storageKey: 'bwContentUpgrade.berlinFoodDecisionCard.v1',
    apiBase: CONTENT_UPGRADE_DEFAULT_API_BASE,
    elementUrl: CONTENT_UPGRADE_DEFAULT_ELEMENT_URL,
    placement: CONTENT_UPGRADE_PLACEMENT,
    controlType: 'private-tour',
    controlUrl: 'https://www.berlinwalk.com/private-tour',
    acquisitionCohort: 'berlin_food_decision_card_pilot',
    slugs: [
      '5-best-döner-kebab-spots-in-berlin-you-need-to-try-in-2026',
      'how-to-order-doner-in-berlin',
      'best-currywurst-places-in-berlin-2026',
      'what-to-eat-in-berlin-12-must-try-local-foods',
      'vietnamese-food-in-berlin',
      'halal-food-in-berlin',
      'vegan-berlin-guide-2026',
      'breakfast-in-berlin',
      'how-to-order-at-a-berlin-bakery',
      'how-to-read-a-german-menu-without-panicking',
      'berlin-restaurant-phrases',
      'where-to-eat-near-alexanderplatz-without-getting-ripped-off',
      'where-to-eat-berlin-by-neighbourhood',
      'where-to-eat-late-at-night-in-berlin',
      'markthalle-neun-berlin',
      'turkish-market-berlin-maybachufer',
      'berlin-beer-gardens-guide',
      'what-is-a-spati-berlin',
      'grocery-shopping-in-berlin',
      '5-best-coffee-shops-near-hackescher-markt-a-local-s-guide',
      'kaffee-vs-coffee-a-beginner-s-guide-to-german-café-culture'
    ],
    component: {
      barCopy: 'FREE SAVE-TO-PHONE CARD',
      eyebrow: 'Food by hour, place and need',
      title: 'The Berlin Food Decision Card',
      description: 'Do not cross Berlin for one open listing. I put the hour, the market day and the nearby food move on one card.',
      gateCopy: 'Those are three food moves. Want the full card with the market times, late-food hubs and place-first decisions? I will email it.',
      submitLabel: 'Email me the Food Decision Card',
      consentVersion: 'berlin-food-decision-card-v1-2026-08-18',
      consentText: 'By requesting this card, I agree to receive it by email plus occasional BerlinWalk emails about food in Berlin and planning a Berlin trip. I can unsubscribe anytime. Privacy Policy.',
      successCopy: 'Check your inbox to confirm your email and open The Berlin Food Decision Card.',
      arrivalLabel: 'When are you planning to arrive?',
      arrivalOptions: [
        { value: 'this-month', label: 'This month' },
        { value: 'next-month', label: 'Next month' },
        { value: 'in-2-3-months', label: 'In 2-3 months' },
        { value: 'not-booked-yet', label: 'Not booked yet' }
      ],
      teasers: [
        { number: 1, title: 'After midnight, follow the station.', body: 'Kottbusser Tor, Schlesisches Tor, Hermannplatz, Sonnenallee and Warschauer Straße are useful food hubs. One open listing is not worth a cross-city journey.' },
        { number: 2, title: 'Markthalle Neun is a day decision.', body: 'Street Food Thursday runs 17:00 to 22:00, the large market is Saturday 10:00 to 18:00, and Sunday is closed. Check the day before you go.' },
        { number: 3, title: 'Döner is not a €5 plan anymore.', body: 'Current Berlin guide sources put a typical döner around €7 to €8. The card keeps the price useful without pretending every shop charges the same.' }
      ],
      items: [
        { number: 1, skip: 'Chasing one open listing', why: 'The nearest hub gives you food and a way home.', instead: 'Walk toward the nearest U-Bahn hub.' },
        { number: 2, skip: 'Ignoring the kitchen clock', why: 'A bar can stay open after hot food stops.', instead: 'Check before 22:00.' },
        { number: 3, skip: 'Guessing a Sunday market', why: 'Market and shop rules are not the same.', instead: 'Check the actual day and place.' },
        { number: 4, skip: 'Markthalle Neun on Sunday', why: 'The published market is closed that day.', instead: 'Choose Thursday or Saturday.' },
        { number: 5, skip: 'Maybachufer on the wrong day', why: 'The public market runs Tuesday and Friday.', instead: 'Plan 11:00 to 18:30.' },
        { number: 6, skip: 'Dong Xuan on Tuesday', why: 'The published centre schedule says Tuesday closed.', instead: 'Go Wednesday to Monday, then check the shop.' },
        { number: 7, skip: 'Assuming halal', why: 'A neighbourhood is not a certification.', instead: 'Ask about ingredients and shared equipment.' },
        { number: 8, skip: 'Crossing Berlin for a price', why: 'Döner is about €7 to €8 and the shop still matters.', instead: 'Take the workable nearby option.' },
        { number: 9, skip: 'Choosing by a generic currywurst price', why: 'The source set does not prove one reliable citywide price.', instead: 'Choose by place, timing and route.' }
      ],
      controlTitle: 'Want a Berlin day planned around the places you care about?',
      controlDescription: 'My private walk gives you a clear route, real places and plain explanations without making you hunt through a city map alone.',
      controlLabel: 'See private walks'
    }
  }, {
    experimentId: 'berlin_neighborhood_matcher_v1',
    assetId: 'berlin-neighborhood-matcher',
    assetVersion: '2026-08-v1',
    storageKey: 'bwContentUpgrade.berlinNeighborhoodMatcher.v1',
    apiBase: CONTENT_UPGRADE_DEFAULT_API_BASE,
    elementUrl: CONTENT_UPGRADE_DEFAULT_ELEMENT_URL,
    placement: CONTENT_UPGRADE_PLACEMENT,
    controlType: 'private-tour',
    controlUrl: 'https://www.berlinwalk.com/private-tour',
    acquisitionCohort: 'berlin_neighborhood_matcher_pilot',
    slugs: [
      'kreuzberg-berlin',
      'neukolln-berlin',
      'friedrichshain-berlin',
      'prenzlauer-berg-berlin',
      'schoneberg-berlin',
      'kurfurstendamm-berlin',
      'nikolaiviertel-rebuilt-old-town',
      'berlin-courtyards-hoefe',
      'karl-marx-allee-berlin',
      'where-to-stay-in-berlin-best-neighborhoods-for-every-type-of-tourist',
      'berlin-street-art'
    ],
    component: {
      barCopy: 'FREE SAVE-TO-PHONE MATCHER',
      eyebrow: 'A place for your actual day',
      title: 'Which Berlin Neighborhood Matcher',
      description: 'I match your vibe, time and trip purpose to one real Berlin area, then give you the first move.',
      gateMode: 'calculator',
      calcConfig: {
        ariaLabel: 'Berlin neighborhood matcher',
        questions: [
          {
            id: 'vibe',
            prompt: 'What kind of Berlin day do you want?',
            options: [
              { value: 'food-late', label: 'Food and late' },
              { value: 'quiet-local', label: 'Quiet and local' },
              { value: 'markets-cafes', label: 'Markets and cafés' },
              { value: 'wall-nightlife', label: 'Wall and nightlife' },
              { value: 'classic-west', label: 'Classic West' },
              { value: 'history-architecture', label: 'History and architecture' },
              { value: 'street-art', label: 'Street art' }
            ]
          },
          {
            id: 'time',
            prompt: 'How much time do you have?',
            options: [
              { value: 'short-block', label: 'One short block' },
              { value: 'afternoon', label: 'One afternoon' },
              { value: 'two-days', label: 'Two or more days' }
            ]
          },
          {
            id: 'purpose',
            prompt: 'What is the trip mainly for?',
            options: [
              { value: 'sleep-base', label: 'Sleep and base' },
              { value: 'explore', label: 'Explore for a day' },
              { value: 'low-cost', label: 'Low-cost and free' },
              { value: 'food-led', label: 'Food-led' },
              { value: 'museum-history', label: 'Museum and history' }
            ]
          }
        ],
        base: [
          { vibe: 'food-late', time: ['short-block', 'afternoon'], purpose: 'food-led', line: 'Try East Kreuzberg around SO36. Start at Kottbusser Tor and move along Oranienstraße.' },
          { vibe: 'quiet-local', time: 'afternoon', purpose: 'explore', line: 'Choose Prenzlauer Berg. Start at Eberswalder Straße and walk toward Kollwitzplatz.' },
          { vibe: 'quiet-local', time: 'short-block', purpose: 'low-cost', line: 'Choose West Kreuzberg around Bergmannkiez. Start near Bergmannstraße and Marheineke Markthalle.' },
          { vibe: 'quiet-local', time: 'afternoon', purpose: 'museum-history', line: 'Choose Körnerpark and Rixdorf in Neukölln. Start from Hermannstraße or S+U Neukölln and keep the route local.' },
          { vibe: 'markets-cafes', time: 'afternoon', purpose: 'food-led', line: 'Choose North Neukölln around Reuterkiez. On Tuesday or Friday, go down to Maybachufer and check the market before you leave.' },
          { vibe: 'markets-cafes', time: 'short-block', purpose: 'explore', line: 'Choose the Höfe around Hackescher Markt. Start at S Hackescher Markt, then walk to Hackesche Höfe and Haus Schwarzenberg.' },
          { vibe: 'wall-nightlife', time: 'afternoon', purpose: 'explore', line: 'Choose Friedrichshain. Start at East Side Gallery, then check the current situation at Boxhagener Platz or RAW.' },
          { vibe: 'classic-west', time: ['short-block', 'afternoon'], purpose: 'explore', line: 'Choose Breitscheidplatz and a short Kurfürstendamm. Start at Wittenbergplatz and finish at Breitscheidplatz or Savignyplatz.' },
          { vibe: 'history-architecture', time: 'short-block', purpose: 'low-cost', line: 'Choose Karl-Marx-Allee. Take U5 to Strausberger Platz and walk east to Frankfurter Tor.' },
          { vibe: 'history-architecture', time: 'short-block', purpose: 'museum-history', line: 'Choose Nikolaiviertel for central context. Enter from Rotes Rathaus and remember that most of the quarter is a GDR-era 1980s rebuild.' },
          { vibe: 'street-art', time: 'short-block', purpose: 'explore', line: 'Choose Haus Schwarzenberg. Walk five minutes from Hackescher Markt to Rosenthaler Straße 39.' },
          { vibe: 'street-art', time: 'afternoon', purpose: 'explore', line: 'Choose East Side Gallery plus RAW. Start at Warschauer Straße and check the current RAW situation.' },
          { vibe: 'street-art', time: 'afternoon', purpose: 'low-cost', line: 'Choose Urban Nation in Schöneberg. Go to Bülowstraße and check the current opening schedule.' },
          { vibe: 'street-art', time: 'two-days', purpose: 'explore', line: 'Choose Teufelsberg as a dedicated outing. Plan for a dry weekday morning and check entry and walking time.' },
          { vibe: 'food-late', purpose: 'sleep-base', line: 'Base yourself near East Kreuzberg or Sonnenallee if food and a late return matter. Check the exact street before booking.' },
          { vibe: 'quiet-local', purpose: 'sleep-base', line: 'Base yourself in Prenzlauer Berg for cafés and a calmer start. Check the exact block, not only the district name.' },
          { vibe: 'markets-cafes', purpose: 'sleep-base', line: 'Base yourself near North Neukölln or Prenzlauer Berg, depending on whether Maybachufer or cafés matter more.' },
          { vibe: 'wall-nightlife', purpose: 'sleep-base', line: 'Base yourself in Friedrichshain if East Side Gallery and a late night belong in the same day.' },
          { vibe: 'classic-west', purpose: 'sleep-base', line: 'Base yourself around City West if shopping, a short route and western Berlin are the point.' },
          { vibe: 'history-architecture', purpose: 'sleep-base', line: 'Base yourself centrally only if the extra cost buys you the short historic route you actually want.' },
          { vibe: 'street-art', purpose: 'sleep-base', line: 'Base yourself in Friedrichshain for East-side street art, or choose Schöneberg for an indoor backup.' },
          { line: 'Pick one real area, check the current opening schedule, and make the first move from the named station or street.' }
        ],
        stamp: 'Decision table checked 18 August 2026',
        placeholder: 'Answer all three questions.'
      },
      gateCopy: 'That is one starting point. Want the full neighborhood card with the place, reason and first move? I will email it.',
      submitLabel: 'Email me the Neighborhood Matcher',
      consentVersion: 'berlin-neighborhood-matcher-v1-2026-08-18',
      consentText: 'By requesting this matcher, I agree to receive it by email plus occasional BerlinWalk emails about neighborhoods and planning a Berlin trip. I can unsubscribe anytime. Privacy Policy.',
      successCopy: 'Check your inbox to confirm your email and open Which Berlin Neighborhood Matcher.',
      arrivalLabel: 'When are you planning to arrive?',
      arrivalOptions: [
        { value: 'this-month', label: 'This month' },
        { value: 'next-month', label: 'Next month' },
        { value: 'in-2-3-months', label: 'In 2-3 months' },
        { value: 'not-booked-yet', label: 'Not booked yet' }
      ],
      teasers: [
        { number: 1, title: 'There is no best neighborhood.', body: 'The useful answer is the real area that creates the least friction for your day.' },
        { number: 2, title: 'A station is a better start than a label.', body: 'Kottbusser Tor, Eberswalder Straße or Warschauer Straße gives you a first move.' },
        { number: 3, title: 'Nikolaiviertel is a rebuild.', body: 'It gives central historical context, but most of the quarter is a GDR-era 1980s reconstruction.' }
      ],
      items: [
        { number: 1, skip: 'Choosing the best district in theory', why: 'Your time and purpose decide the useful area.', instead: 'Answer the three questions.' },
        { number: 2, skip: 'Treating a district as one place', why: 'A named station or street gives you a workable start.', instead: 'Use the first move.' },
        { number: 3, skip: 'Calling Nikolaiviertel a surviving medieval old town', why: 'Most of it is a GDR-era 1980s rebuild.', instead: 'Read the rebuild in the place.' }
      ],
      controlTitle: 'Want a Berlin walk in plain English?',
      controlDescription: 'On a private walk I guide in clear English, at your pace, around the places that matter to your date.',
      controlLabel: 'See private walks'
    }
  }, {
    experimentId: 'berlin_unwritten_rules_v1',
    assetId: 'berlin-unwritten-rules-card',
    assetVersion: '2026-08-v1',
    storageKey: 'bwContentUpgrade.berlinUnwrittenRules.v1',
    apiBase: CONTENT_UPGRADE_DEFAULT_API_BASE,
    elementUrl: CONTENT_UPGRADE_DEFAULT_ELEMENT_URL,
    placement: CONTENT_UPGRADE_PLACEMENT,
    controlType: 'private-tour',
    controlUrl: 'https://www.berlinwalk.com/private-tour',
    acquisitionCohort: 'berlin_unwritten_rules_pilot',
    slugs: [
      'tipping-in-berlin',
      'how-much-should-you-tip-in-berlin-a-simple-guide-to-tipping-in-germany',
      'jaywalking-in-berlin',
      'pfand-in-germany',
      'smoking-in-berlin',
      'drink-alcohol-in-public-berlin',
      'can-you-use-credit-cards-in-berlin-a-tourist-s-guide-to-paying-in-germany',
      'berlin-city-tax',
      'tax-free-shopping-berlin-vat-refund',
      'are-shops-open-on-sunday-in-berlin-what-you-need-to-know',
      'is-tap-water-safe-to-drink-in-berlin-what-tourists-should-know',
      'where-to-find-free-drinking-water-in-berlin',
      'public-toilets-in-berlin'
    ],
    component: {
      barCopy: 'FREE SAVE-TO-PHONE CARD',
      eyebrow: 'Small rules, fewer awkward surprises',
      title: 'Berlin Unwritten Rules Card',
      description: 'I put the small money, sign and timing rules on one card so a minor Berlin mistake does not change your day.',
      gateCopy: 'Those are three small rules. Want the full card with the amounts, sign checks and planning moves? I will email it.',
      submitLabel: 'Email me the Unwritten Rules Card',
      consentVersion: 'berlin-unwritten-rules-card-v1-2026-08-18',
      consentText: 'By requesting this card, I agree to receive it by email plus occasional BerlinWalk emails about practical Berlin travel rules and planning a Berlin trip. I can unsubscribe anytime. Privacy Policy.',
      successCopy: 'Check your inbox to confirm your email and open Berlin Unwritten Rules Card.',
      arrivalLabel: 'When are you planning to arrive?',
      arrivalOptions: [
        { value: 'this-month', label: 'This month' },
        { value: 'next-month', label: 'Next month' },
        { value: 'in-2-3-months', label: 'In 2-3 months' },
        { value: 'not-booked-yet', label: 'Not booked yet' }
      ],
      teasers: [
        { number: 1, title: 'Carry the coins that solve the small problems.', body: '€20 to €40 in small notes, a 25-cent coin and a €1 coin cover more useful moments than a wallet full of assumptions.' },
        { number: 2, title: 'The rule changes with the place.', body: 'DB and S-Bahn areas are not BVG U-Bahn areas. Read the sign in front of you, especially around alcohol and smoking.' },
        { number: 3, title: 'Small amounts need the right context.', body: '€5 is the standard red-light pedestrian fine. €10 applies only if you cause an accident, not as a general range.' }
      ],
      items: [
        { number: 1, skip: 'Leaving a large percentage tip by default', why: 'Berlin service is not an automatic American 20% system.', instead: 'Round up or use about 5% to 10% when service was good.' },
        { number: 2, skip: 'Assuming every terminal takes every card', why: 'Small cafés, stalls, bars and kiosks can be cash-first.', instead: 'Carry €20 to €40 in small notes.' },
        { number: 3, skip: 'Treating €5 to €10 as a jaywalking range', why: 'The €10 amount applies only when you cause an accident.', instead: 'Remember €5, then read the situation.' },
        { number: 4, skip: 'Throwing a Pfand bottle away', why: 'The deposit is part of the price you can recover.', instead: 'Return it at a Pfandautomat.' },
        { number: 5, skip: 'Drinking by a station without reading the sign', why: 'DB and S-Bahn rules do not map exactly onto BVG U-Bahn areas.', instead: 'Follow the current sign.' },
        { number: 6, skip: 'Building a Sunday shopping plan around ordinary shops', why: 'Most ordinary shops are closed on Sunday.', instead: 'Shop Saturday, then check Berlin.de.' },
        { number: 7, skip: 'Treating City Tax as part of every hotel extra', why: 'The 7.5% rule uses the net overnight room price.', instead: 'Keep breakfast and extra services separate.' },
        { number: 8, skip: 'Expecting a full 19% Tax Free refund', why: 'The €50.01 threshold has store, receipt, day and non-EU conditions.', instead: 'Keep the same-shop receipt and check the process.' },
        { number: 9, skip: 'Assuming every public toilet costs the same', why: 'Street facilities are often 50 cents, stations around €1 and some cabins are free.', instead: 'Carry both coins and check the facility.' }
      ],
      controlTitle: 'Want a Berlin day explained in plain English?',
      controlDescription: 'On a private walk I guide in clear English, at your pace, around the places that matter to your date.',
      controlLabel: 'See private walks'
    }
  }, {
    experimentId: 'berlin_month_planner_v1',
    assetId: 'berlin-month-planner-card',
    assetVersion: '2026-08-v1',
    storageKey: 'bwContentUpgrade.berlinMonthPlanner.v1',
    apiBase: CONTENT_UPGRADE_DEFAULT_API_BASE,
    elementUrl: CONTENT_UPGRADE_DEFAULT_ELEMENT_URL,
    placement: CONTENT_UPGRADE_PLACEMENT,
    controlType: 'trip-planner',
    controlUrl: 'https://www.berlinwalk.com/berlin-trip-planner',
    acquisitionCohort: 'berlin_month_planner_pilot',
    slugs: [
      'berlin-in-january-2027',
      'berlin-in-february-2027',
      'berlin-in-march-2027',
      'berlin-in-april-2027',
      'berlin-in-may-2027',
      'visiting-berlin-in-june',
      'berlin-in-july-2026',
      'berlin-in-august-2026',
      'berlin-in-september-2026',
      'berlin-in-october-2026',
      'berlin-in-november-2026',
      'berlin-in-december-2026',
      'what-s-the-best-time-to-visit-berlin-a-month-by-month-guide',
      'open-air-cinema-berlin',
      'average-temperature-in-berlin-by-month-a-complete-climate-guide'
    ],
    component: {
      barCopy: 'FREE SAVE-TO-PHONE CARD',
      eyebrow: 'Choose the month, protect the day',
      title: 'Berlin Month Planner Card',
      description: 'I put the month, the weather clue and one useful planning move on a card. Averages are context, not a forecast.',
      gateCopy: 'Those are three month moves. Want the full card with all 12 months, daylight decisions and current-calendar checks? I will email it.',
      submitLabel: 'Email me the Month Planner Card',
      consentVersion: 'berlin-month-planner-card-v1-2026-08-18',
      consentText: 'By requesting this card, I agree to receive it by email plus occasional BerlinWalk emails about Berlin seasons, weather and planning a Berlin trip. I can unsubscribe anytime. Privacy Policy.',
      successCopy: 'Check your inbox to confirm your email and open Berlin Month Planner Card.',
      arrivalLabel: 'When are you planning to arrive?',
      arrivalOptions: [
        { value: 'this-month', label: 'This month' },
        { value: 'next-month', label: 'Next month' },
        { value: 'in-2-3-months', label: 'In 2-3 months' },
        { value: 'not-booked-yet', label: 'Not booked yet' }
      ],
      teasers: [
        { number: 1, title: 'January to February: indoor anchor first.', body: 'Short daylight and cold weather make one timed indoor plan more useful than a packed outdoor checklist.' },
        { number: 2, title: 'July to August: start before the heat.', body: 'Put the longest outdoor block in the morning, keep a storm-flexible window and check the current programme for seasonal cinema.' },
        { number: 3, title: 'December: snow is a bonus.', body: 'Check holiday opening hours and your current New Year plan. Berlin winter atmosphere does not require a snow promise.' }
      ],
      items: [
        { number: 1, skip: 'Treating averages as a forecast', why: 'Monthly numbers describe a pattern, not your travel week.', instead: 'Pack for the conditions you may actually get.' },
        { number: 2, skip: 'Booking every outdoor plan', why: 'Rain, heat and storms can move the useful order of the day.', instead: 'Pair outdoor plans with an indoor backup.' },
        { number: 3, skip: 'Using last year’s event dates', why: 'Berlinale, Easter, Festival of Lights and holiday hours move.', instead: 'Check the official calendar for your year.' },
        { number: 4, skip: 'Planning late outdoor blocks in November', why: 'Daylight closes the useful window earlier.', instead: 'Use late morning or early afternoon first.' },
        { number: 5, skip: 'Assuming open-air cinema is guaranteed', why: 'Programme, language, weather policy and venue availability change.', instead: 'Check the current programme before you go.' },
        { number: 6, skip: 'Turning December into a fixed route', why: 'Closures and market schedules can change around the holidays.', instead: 'Check 24 to 26 December hours and keep snow optional.' }
      ],
      controlTitle: 'Want the whole Berlin stay planned around your dates?',
      controlDescription: 'The Berlin Trip Planner turns your dates, weather risk and energy into a practical plan with room to change it.',
      controlLabel: 'Open the Trip Planner'
    }
  }];

  var injections = 0;
  var reinjectTimer = null;
  var observer = null;
  var lastPath = location.pathname;
  var historyElementPromise = null;
  var historyInsertionPending = false;
  var historyMemoryBucket = null;
  var historyMemoryAssignmentId = '';
  var historyFallbackPaths = {};
  var pendingHistoryViews = {};
  var sentHistoryViews = {};
  var contentUpgradeElementPromise = null;
  var contentUpgradeInsertionPending = false;
  var contentUpgradeStates = {};
  var contentUpgradeFallbackPaths = {};
  var pendingContentUpgradeViews = {};
  var sentContentUpgradeViews = {};

  function clearHistoryInlineLayering() {
    if (document.body) document.body.classList.remove('bw-history-lead-inline-active');
  }

  function isPostPage() {
    return location.pathname.indexOf('/post/') === 0 ||
      window.BW_ENABLE_BLOG_BOOKING === true ||
      /[?&]bwBlogBooking=1(?:&|$)/.test(location.search);
  }

  function isVisible(el) {
    while (el && el !== document.body && el.nodeType === 1) {
      var style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      el = el.parentElement;
    }
    return true;
  }

  function findPostBody() {
    var candidates = [
      '[data-hook="post-content"]',
      '[data-hook="rich-content-viewer"]',
      '[data-hook="rich-content"]',
      '.post-content',
      '.rich-content',
      '.blog-post-page-content',
      'article',
      'main'
    ];
    for (var i = 0; i < candidates.length; i++) {
      var el = document.querySelector(candidates[i]);
      if (el && el.querySelectorAll('p').length >= 3) return el;
    }
    return null;
  }

  function findInsertionAnchor(body) {
    /* Wix wraps every rich-content block in its own div, so walking
     * nextElementSibling from a heading never reaches that section's
     * paragraphs. Work in document order over the visible h2/p blocks
     * instead: insert after the first real paragraph that follows the
     * 2nd H2 (~25% depth), staying inside that section. */
    var blocks = [];
    var all = body.querySelectorAll('h2, p');
    for (var i = 0; i < all.length; i++) {
      if (isVisible(all[i])) blocks.push(all[i]);
    }

    var headingIndexes = [];
    for (var h = 0; h < blocks.length; h++) {
      if (blocks[h].tagName.toUpperCase() === 'H2') headingIndexes.push(h);
    }

    if (headingIndexes.length) {
      var anchorIndex = headingIndexes.length >= 2 ? headingIndexes[1] : headingIndexes[0];
      var sectionEnd = blocks.length;
      for (var s = 0; s < headingIndexes.length; s++) {
        if (headingIndexes[s] > anchorIndex) { sectionEnd = headingIndexes[s]; break; }
      }
      for (var j = anchorIndex + 1; j < sectionEnd; j++) {
        var block = blocks[j];
        if (block.tagName.toUpperCase() !== 'P') continue;
        if (!block.textContent.trim()) continue;
        if (block.closest && block.closest('figure,li,blockquote')) continue;
        return block;
      }
      return blocks[anchorIndex];
    }

    var paragraphs = [];
    for (var p = 0; p < blocks.length; p++) {
      if (blocks[p].tagName.toUpperCase() === 'P') paragraphs.push(blocks[p]);
    }
    if (paragraphs.length >= 4) return paragraphs[Math.min(3, Math.floor(paragraphs.length / 2))];
    return null;
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '.bw-blog-booking-card{box-sizing:border-box;display:block;margin:30px 0;max-width:100%;min-width:0;padding:0;background:#fff;border:1px solid #CFE4C8;border-radius:14px;box-shadow:0 8px 22px rgba(27,94,32,.08);font-family:Montserrat,Arial,sans-serif;color:#212121;overflow:hidden;}',
      '.bw-blog-booking-card *{box-sizing:border-box;}',
      '.bw-blog-booking-strip{display:flex;align-items:center;justify-content:space-between;gap:10px;background:#1B5E20;color:#fff;padding:8px 14px;font-size:10px;font-weight:900;letter-spacing:.12em;line-height:1.3;text-transform:uppercase;}',
      '.bw-blog-booking-strip span{color:#fff!important;}',
      '.bw-blog-booking-strip .bw-star{color:#FFE600;}',
      '.bw-blog-booking-inner{display:flex;min-width:0;}',
      '.bw-blog-booking-media{flex:0 0 116px;min-width:0;margin:14px 0 14px 14px;}',
      '.bw-blog-booking-media img{display:block;width:116px;height:116px;object-fit:cover;margin:0!important;border-radius:12px!important;}',
      '.bw-blog-booking-body{display:flex;flex:1 1 auto;flex-direction:column;gap:8px;min-width:0;padding:14px 16px;}',
      '.bw-blog-booking-title{display:block;margin:0!important;color:#212121!important;font-size:17px!important;font-weight:900!important;line-height:1.2!important;letter-spacing:0!important;text-transform:none!important;}',
      '.bw-blog-booking-facts{margin:0;color:#4E5A4E!important;font-size:12px;font-weight:700;line-height:1.35;}',
      '.bw-blog-booking-dates{display:flex;gap:8px;min-width:0;overflow-x:auto;padding:2px;scrollbar-width:none;-webkit-overflow-scrolling:touch;}',
      '.bw-blog-booking-dates::-webkit-scrollbar{display:none;}',
      '.bw-blog-booking-date{align-items:center;appearance:none;-webkit-appearance:none;background:#fff;border:1px solid #CFE4C8;border-radius:12px;color:#1B5E20!important;cursor:pointer;display:grid;flex:0 0 auto;font-family:inherit;gap:2px;justify-items:center;margin:0;min-height:56px;min-width:54px;padding:7px 4px;text-align:center;text-decoration:none!important;}',
      '.bw-blog-booking-date.bw-selected{background:#1B5E20;border-color:#1B5E20;color:#fff!important;}',
      '.bw-blog-booking-date span,.bw-blog-booking-date b,.bw-blog-booking-date small{color:inherit!important;}',
      'body .bw-blog-booking-card .bw-blog-booking-dates .bw-blog-booking-date.bw-selected,body .bw-blog-booking-card .bw-blog-booking-dates .bw-blog-booking-date.bw-selected span,body .bw-blog-booking-card .bw-blog-booking-dates .bw-blog-booking-date.bw-selected b,body .bw-blog-booking-card .bw-blog-booking-dates .bw-blog-booking-date.bw-selected small{color:#fff!important;}',
      '.bw-blog-booking-date span{font-size:9px;font-weight:900;line-height:1;text-transform:uppercase;}',
      '.bw-blog-booking-date b{font-size:17px;font-weight:900;line-height:1;}',
      '.bw-blog-booking-date small{font-size:9px;font-weight:800;line-height:1.1;}',
      '.bw-blog-booking-date:hover,.bw-blog-booking-date:focus-visible{outline:2px solid #FFE600;outline-offset:2px;}',
      '.bw-blog-booking-more{align-items:center;background:#F8FBF4;border:1px solid #CFE4C8;border-radius:12px;color:#1B5E20!important;display:flex;flex:0 0 auto;justify-content:center;min-height:56px;min-width:46px;text-decoration:none!important;}',
      '.bw-blog-booking-more svg{display:block;width:19px;height:19px;}',
      '.bw-blog-booking-more:hover,.bw-blog-booking-more:focus-visible{outline:2px solid #FFE600;outline-offset:2px;}',
      '.bw-blog-booking-loading,.bw-blog-booking-empty{color:#4E5A4E;font-size:13px;font-weight:700;line-height:1.4;padding:10px 2px;}',
      '.bw-blog-booking-day{align-items:center;display:flex;flex-wrap:wrap;gap:8px;min-width:0;}',
      '.bw-blog-booking-times-label{color:#4E5A4E!important;font-size:11px;font-weight:900;letter-spacing:.06em;line-height:1;text-transform:uppercase;}',
      '.bw-blog-booking-times{display:flex;flex-wrap:wrap;gap:8px;}',
      '.bw-blog-booking-time{appearance:none;-webkit-appearance:none;background:#fff;border:1px solid #CFE4C8;border-radius:999px;color:#1B5E20!important;cursor:pointer;font-family:inherit;font-size:12px;font-weight:900;line-height:1;margin:0;padding:8px 12px;}',
      '.bw-blog-booking-time.bw-selected{background:#1B5E20;border-color:#1B5E20;color:#fff!important;}',
      '.bw-blog-booking-time:hover,.bw-blog-booking-time:focus-visible{outline:2px solid #FFE600;outline-offset:2px;}',
      '.bw-blog-booking-meta{color:#4E5A4E!important;flex:1 1 100%;font-size:11px;font-weight:600;line-height:1.35;margin:0;}',
      '.bw-blog-booking-cta{display:block;margin-top:2px;}',
      '.bw-blog-booking-cta a{align-items:center;background:#FFE600;border-radius:999px;color:#1B5E20!important;display:flex;font-size:14px;font-weight:900;justify-content:center;min-height:44px;padding:0 16px;text-decoration:none!important;width:100%;}',
      '.bw-blog-booking-cta a:hover,.bw-blog-booking-cta a:focus-visible{outline:2px solid #1B5E20;outline-offset:2px;}',
      '.bw-private-tour-control-card,.bw-content-upgrade-control-card{box-sizing:border-box;display:block;margin:30px 0;max-width:100%;padding:22px 24px;border:1px solid #CFE4C8;border-radius:14px;background:#1B5E20;color:#fff;box-shadow:0 8px 22px rgba(27,94,32,.12);font-family:Montserrat,Arial,sans-serif;}',
      '.bw-private-tour-control-card *,.bw-content-upgrade-control-card *{box-sizing:border-box;}',
      '.bw-private-tour-control-card .bw-private-tour-kicker,.bw-content-upgrade-control-card .bw-content-upgrade-kicker{margin:0 0 8px;color:#FFE600;font-size:10px;font-weight:900;letter-spacing:.12em;line-height:1.3;text-transform:uppercase;}',
      '.bw-private-tour-control-card h2,.bw-content-upgrade-control-card h2{margin:0 0 8px;color:#fff;font-size:22px;line-height:1.12;}',
      '.bw-private-tour-control-card p,.bw-content-upgrade-control-card p{margin:0 0 16px;color:#fff;font-size:14px;line-height:1.5;}',
      '.bw-private-tour-control-card a,.bw-content-upgrade-control-card a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 16px;border-radius:999px;background:#FFE600;color:#123D18!important;font-size:14px;font-weight:900;text-decoration:none!important;}',
      '.bw-private-tour-control-card a:hover,.bw-private-tour-control-card a:focus-visible,.bw-content-upgrade-control-card a:hover,.bw-content-upgrade-control-card a:focus-visible{outline:2px solid #FFE600;outline-offset:3px;}',
      '@media(max-width:640px){.bw-private-tour-control-card,.bw-content-upgrade-control-card{margin:24px 0;padding:20px;}.bw-private-tour-control-card h2,.bw-content-upgrade-control-card h2{font-size:20px;}.bw-private-tour-control-card a,.bw-content-upgrade-control-card a{width:100%;}}',
      '@media(max-width:640px){.bw-blog-booking-card{margin:24px 0;}.bw-blog-booking-strip{font-size:9px;letter-spacing:.1em;}.bw-blog-booking-inner{display:block;padding:12px;}.bw-blog-booking-media{float:left;width:92px;flex:none;margin:0 10px 4px 0;}.bw-blog-booking-media img{width:92px;height:92px;}.bw-blog-booking-body{display:block;padding:0;}.bw-blog-booking-title{font-size:16px!important;margin:0 0 6px!important;}.bw-blog-booking-facts{font-size:11.5px;}.bw-blog-booking-dates{clear:both;margin-top:10px;}.bw-blog-booking-day{margin-top:8px;}.bw-blog-booking-cta{margin-top:8px;}}'
    ].join('');
    document.head.appendChild(style);
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function dateKey(value) {
    var raw = String(value || '');
    if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
    var date = new Date(raw);
    if (Number.isNaN(date.getTime())) return '';
    var parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Berlin',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(date);
    var map = {};
    parts.forEach(function (part) { map[part.type] = part.value; });
    return map.year + '-' + map.month + '-' + map.day;
  }

  function formatDateParts(dateString) {
    var date = new Date(dateString + 'T12:00:00');
    return {
      weekday: new Intl.DateTimeFormat('en-GB', { weekday: 'short' }).format(date),
      day: new Intl.DateTimeFormat('en-GB', { day: 'numeric' }).format(date),
      month: new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(date)
    };
  }

  function bookingHref(slot) {
    var base = slot ? (slot.bookingUrl || BOOKING_FORM_URL) : BOOKING_URL;
    var url = new URL(base, window.location.href);
    if (slot) {
      url.searchParams.set('bookings_timezone', slot.timezone || 'Europe/Berlin');
      if (slot.serviceId) url.searchParams.set('bookings_serviceId', slot.serviceId);
      if (slot.locationId) url.searchParams.set('bookings_locationId', slot.locationId);
      if (slot.sessionId || slot.eventId) url.searchParams.set('bookings_sessionId', slot.sessionId || slot.eventId);
    }
    url.searchParams.set('utm_content', 'blog_booking_card');
    if (!url.searchParams.has('utm_source')) url.searchParams.set('utm_source', 'berlinwalk');
    if (!url.searchParams.has('utm_medium')) url.searchParams.set('utm_medium', 'blog_booking_card');
    if (!url.searchParams.has('utm_campaign')) url.searchParams.set('utm_campaign', 'direct_booking');
    return url.toString();
  }

  function normalizeSlots(slots) {
    var byDate = {};
    (Array.isArray(slots) ? slots : []).forEach(function (slot, index) {
      var startDate = slot.startDate || slot.start || slot.localStartDate;
      var key = dateKey(startDate);
      if (!key) return;
      if (!byDate[key]) byDate[key] = [];
      byDate[key].push({
        id: String(slot.id || slot.eventId || startDate || index),
        eventId: slot.eventId || '',
        sessionId: slot.sessionId || slot.eventId || '',
        serviceId: slot.serviceId || '',
        locationId: slot.locationId || '',
        bookingUrl: slot.bookingUrl || '',
        timezone: slot.timezone || 'Europe/Berlin',
        openSpots: typeof slot.openSpots === 'number' ? slot.openSpots : null,
        startDate: startDate,
        dateKey: key
      });
    });
    return Object.keys(byDate).sort().slice(0, 6).map(function (key) {
      return {
        dateKey: key,
        slots: byDate[key].sort(function (a, b) {
          return new Date(a.startDate) - new Date(b.startDate);
        })
      };
    });
  }

  function formatTime(value) {
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Berlin',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  function moreDatesChip() {
    return [
      '<a class="bw-blog-booking-more" href="' + escapeHtml(bookingHref()) + '" target="_top" aria-label="See all tour dates">',
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">',
      '<rect x="3" y="5" width="18" height="16" rx="2"></rect>',
      '<line x1="3" y1="10" x2="21" y2="10"></line>',
      '<line x1="8" y1="3" x2="8" y2="7"></line>',
      '<line x1="16" y1="3" x2="16" y2="7"></line>',
      '</svg>',
      '</a>'
    ].join('');
  }

  function renderSelection(panel, state) {
    var day = state.days[state.dayIndex];
    if (!day) return;
    if (state.slotIndex >= day.slots.length) state.slotIndex = 0;
    var slot = day.slots[state.slotIndex];
    var parts = formatDateParts(day.dateKey);
    var startTime = formatTime(slot.startDate);

    var chips = panel.querySelectorAll('[data-bw-day-index]');
    for (var i = 0; i < chips.length; i++) {
      var selected = Number(chips[i].getAttribute('data-bw-day-index')) === state.dayIndex;
      chips[i].classList.toggle('bw-selected', selected);
      chips[i].setAttribute('aria-pressed', selected ? 'true' : 'false');
    }

    panel.querySelector('[data-bw-booking-day]').hidden = false;
    panel.querySelector('[data-bw-booking-times]').innerHTML = day.slots.map(function (daySlot, index) {
      var isSelected = index === state.slotIndex;
      return '<button type="button" class="bw-blog-booking-time' + (isSelected ? ' bw-selected' : '') + '" data-bw-slot-index="' + index + '" aria-pressed="' + (isSelected ? 'true' : 'false') + '">' + escapeHtml(formatTime(daySlot.startDate) || 'Time TBC') + '</button>';
    }).join('');

    var dateLabel = parts.weekday + ' ' + parts.day + ' ' + parts.month;
    panel.querySelector('[data-bw-booking-meta]').textContent =
      (slot.openSpots === null || slot.openSpots > 0 ? 'Spots available' : 'Few spots left') +
      ' for ' + dateLabel + ' · ends near Hackescher Markt';

    var cta = panel.querySelector('[data-bw-booking-cta]');
    cta.setAttribute('href', bookingHref(slot));
    cta.textContent = 'Reserve ' + dateLabel + (startTime ? ' · ' + startTime : '');
  }

  function setupPicker(panel, days) {
    var datesEl = panel.querySelector('[data-bw-booking-dates]');
    if (!days.length) {
      datesEl.innerHTML = '<div class="bw-blog-booking-empty">Dates are loading slowly. You can still check availability below.</div>';
      return;
    }
    var state = { days: days, dayIndex: 0, slotIndex: 0 };

    datesEl.innerHTML = days.map(function (day, index) {
      var parts = formatDateParts(day.dateKey);
      return [
        '<button type="button" class="bw-blog-booking-date" data-bw-day-index="' + index + '">',
        '<span>' + escapeHtml(parts.weekday) + '</span>',
        '<b>' + escapeHtml(parts.day) + '</b>',
        '<small>' + escapeHtml(parts.month) + '</small>',
        '</button>'
      ].join('');
    }).join('') + moreDatesChip();

    datesEl.addEventListener('click', function (event) {
      var chip = event.target.closest('[data-bw-day-index]');
      if (!chip) return;
      state.dayIndex = Number(chip.getAttribute('data-bw-day-index')) || 0;
      state.slotIndex = 0;
      renderSelection(panel, state);
    });

    panel.querySelector('[data-bw-booking-times]').addEventListener('click', function (event) {
      var pill = event.target.closest('[data-bw-slot-index]');
      if (!pill) return;
      state.slotIndex = Number(pill.getAttribute('data-bw-slot-index')) || 0;
      renderSelection(panel, state);
    });

    renderSelection(panel, state);
  }

  function loadDates(panel) {
    fetch(AVAILABILITY_URL, { cache: 'no-cache' })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        setupPicker(panel, normalizeSlots(data && data.slots));
      })
      .catch(function () {
        panel.querySelector('[data-bw-booking-dates]').innerHTML = '<div class="bw-blog-booking-empty">Dates are loading slowly. You can still check availability below.</div>';
      });
  }

  function buildBookingCard() {
    ensureStyles();

    var wrapper = document.createElement('section');
    wrapper.setAttribute(MARKER, '1');
    wrapper.className = 'bw-blog-booking-card';
    wrapper.setAttribute('aria-label', 'Book the BerlinWalk walking tour');

    var IMG_BASE = 'https://fenerszymanski.github.io/berlinwalk-widgets/gallery/images/01-800w';
    var IMG_ALT = 'BerlinWalk guide Yusuf leading guests outside the Altes Museum on Museum Island';

    wrapper.innerHTML = [
      '<div class="bw-blog-booking-strip">',
      '  <span>Free Berlin walking tour &middot; live dates</span>',
      '  <span><span class="bw-star" aria-hidden="true">&#9733;</span> 9.8 / 10 on FreeTour</span>',
      '</div>',
      '<div class="bw-blog-booking-inner">',
      '<div class="bw-blog-booking-media">',
      '  <picture>',
      '    <source srcset="' + IMG_BASE + '.webp" type="image/webp">',
      '    <img src="' + IMG_BASE + '.jpg" alt="' + escapeHtml(IMG_ALT) + '" loading="lazy">',
      '  </picture>',
      '</div>',
      '<div class="bw-blog-booking-body">',
      '  <div class="bw-blog-booking-title" role="heading" aria-level="2">Berlin: Free Walking Tour of the Historic Centre</div>',
      '  <div class="bw-blog-booking-facts">Free, tip-based &middot; about 2 hours &middot; starts at the World Clock, Alexanderplatz</div>',
      '  <div class="bw-blog-booking-dates" data-bw-booking-dates aria-label="Pick a tour date">',
      '    <div class="bw-blog-booking-loading">Loading live tour dates...</div>',
      '  </div>',
      '  <div class="bw-blog-booking-day" data-bw-booking-day hidden>',
      '    <span class="bw-blog-booking-times-label">Start time</span>',
      '    <div class="bw-blog-booking-times" data-bw-booking-times></div>',
      '    <span class="bw-blog-booking-meta" data-bw-booking-meta></span>',
      '  </div>',
      '  <div class="bw-blog-booking-cta">',
      '    <a href="' + escapeHtml(bookingHref()) + '" target="_top" data-bw-booking-cta>Check availability</a>',
      '  </div>',
      '</div>',
      '</div>'
    ].join('');

    loadDates(wrapper);
    return wrapper;
  }

  function buildPrivateTourControlCard(assignment) {
    ensureStyles();
    var wrapper = document.createElement('aside');
    wrapper.setAttribute(MARKER, '1');
    wrapper.setAttribute('data-bw-private-tour-control', '1');
    var magnet = contentUpgradeMagnetById(assignment && assignment.assetId);
    var copy = magnet && magnet.component || {};
    var isPrivateTour = assignment && assignment.controlType === 'private-tour';
    wrapper.setAttribute('data-bw-content-upgrade-control', '1');
    wrapper.className = isPrivateTour ? 'bw-private-tour-control-card' : 'bw-content-upgrade-control-card';
    wrapper.setAttribute('aria-label', isPrivateTour ? 'BerlinWalk private walks' : 'BerlinWalk next step');
    var href = contentUpgradeControlUrl(assignment);
    var kicker = isPrivateTour ? 'BERLINWALK PRIVATE WALK' : 'BERLINWALK NEXT STEP';
    var ctaAttribute = isPrivateTour ? 'data-bw-private-tour-cta' : 'data-bw-content-upgrade-control-cta';
    wrapper.innerHTML = [
      '<p class="', isPrivateTour ? 'bw-private-tour-kicker' : 'bw-content-upgrade-kicker', '">', kicker, '</p>',
      '<h2>', escapeHtml(copy.controlTitle || 'Want Berlin planned around your group?'), '</h2>',
      '<p>', escapeHtml(copy.controlDescription || 'I can build a private walk around your date and pace.'), '</p>',
      '<a href="', escapeHtml(href), '" target="_top" ', ctaAttribute, '>', escapeHtml(copy.controlLabel || (isPrivateTour ? 'See private walks' : 'Open the next step')), '</a>'
    ].join('');
    return wrapper;
  }

  /* The history lead experiment defaults to QA-only. A Wix Custom Code config
   * must explicitly set stage to "ramp", "pilot", or "expanded" before normal
   * visitors can receive the lead-magnet variant. This keeps a code deploy from
   * starting the experiment before the API and approved photos are ready. */
  function historyConfig() {
    try {
      var override = window.BW_HISTORY_LEAD_EXPERIMENT_CONFIG || {};
      return {
        enabled: override.enabled !== false,
        stage: String(override.stage || 'qa').toLowerCase(),
        safetyStartedAt: String(override.safetyStartedAt || ''),
        rampWeight: Number.isFinite(Number(override.rampWeight)) ? Number(override.rampWeight) : 0.10,
        pilotWeight: Number.isFinite(Number(override.pilotWeight)) ? Number(override.pilotWeight) : 0.50,
        expandedWeight: Number.isFinite(Number(override.expandedWeight)) ? Number(override.expandedWeight) : 0.50,
        enableExpansion: override.enableExpansion === true,
        invalid: false
      };
    } catch (error) {
      console.warn(LOG, 'history experiment config invalid; restored booking control', error && error.message || error);
      return {
        enabled: false,
        stage: 'qa',
        safetyStartedAt: '',
        rampWeight: 0,
        pilotWeight: 0,
        expandedWeight: 0,
        enableExpansion: false,
        invalid: true
      };
    }
  }

  function historyEffectiveStage(config) {
    if (config.stage !== 'safety') return config.stage;
    var startedAt = new Date(config.safetyStartedAt).getTime();
    if (!Number.isFinite(startedAt) || startedAt > Date.now()) return 'qa';
    return Date.now() - startedAt >= 24 * 60 * 60 * 1000 ? 'pilot' : 'ramp';
  }

  function historyQueryChoice() {
    var match = String(location.search || '').match(/[?&]bwHistoryLead=([^&]+)/);
    if (!match) return '';
    var value = decodeURIComponent(match[1] || '').toLowerCase();
    if (value === '0' || value === 'off') return 'off';
    if (value === 'control') return 'control';
    if (value === '1' || value === 'on' || value === 'variant') return 'variant';
    return '';
  }

  function historySlug() {
    var parts = String(location.pathname || '').replace(/\/+$/, '').split('/');
    try { return decodeURIComponent(parts[parts.length - 1] || ''); }
    catch (err) { return parts[parts.length - 1] || ''; }
  }

  function historyAcquisitionCohort(slug) {
    slug = slug || historySlug();
    if (HISTORY_ORIGINAL_CANARY_SLUGS[slug]) return 'blog_original_canary';
    if (HISTORY_RELEVANT_ROLLOUT_SLUGS[slug]) return 'blog_relevant_rollout';
    return 'blog_forced_qa';
  }

  function currentConsentPolicy() {
    try {
      var manager = window.consentPolicyManager;
      var current = manager && typeof manager.getCurrentConsentPolicy === 'function'
        ? manager.getCurrentConsentPolicy()
        : null;
      current = current && (current.policy || current);
      if (current && Object.keys(current).length) return current;
    } catch (err) {}
    try {
      var match = document.cookie.match(/(?:^|;\s*)consent-policy=([^;]+)/);
      return match ? JSON.parse(decodeURIComponent(match[1])) : {};
    } catch (err) {
      return {};
    }
  }

  function historyAnalyticsAllowed() {
    var policy = currentConsentPolicy();
    return policy.analytics === true || policy.anl === true || policy.anl === 1;
  }

  function randomHistoryBucket() {
    try {
      if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
        var values = new Uint32Array(1);
        window.crypto.getRandomValues(values);
        return values[0] / 4294967296;
      }
    } catch (err) {}
    return Math.random();
  }

  function validHistoryAssignmentId(value) {
    value = String(value || '');
    return /^hwa_[a-f0-9]{32}$/i.test(value) ? value : '';
  }

  function randomHistoryAssignmentId() {
    try {
      if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
        var values = new Uint32Array(4);
        window.crypto.getRandomValues(values);
        return 'hwa_' + Array.prototype.map.call(values, function (value) {
          return Number(value).toString(16).padStart(8, '0');
        }).join('');
      }
    } catch (err) {}
    var fallback = '';
    for (var i = 0; i < 4; i++) fallback += Math.floor(Math.random() * 4294967296).toString(16).padStart(8, '0');
    return 'hwa_' + fallback;
  }

  function readStoredHistoryAssignment() {
    if (!historyAnalyticsAllowed()) return null;
    try {
      var raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : null;
      if (parsed && parsed.experiment === HISTORY_EXPERIMENT_ID && typeof parsed.bucket === 'number' && parsed.bucket >= 0 && parsed.bucket < 1) {
        return {
          bucket: parsed.bucket,
          assignmentId: validHistoryAssignmentId(parsed.assignmentId)
        };
      }
    } catch (err) {}
    return null;
  }

  function rememberHistoryAssignment() {
    if (!historyAnalyticsAllowed() || historyMemoryBucket === null) return;
    try {
      if (!historyMemoryAssignmentId) historyMemoryAssignmentId = randomHistoryAssignmentId();
      window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify({
        experiment: HISTORY_EXPERIMENT_ID,
        bucket: historyMemoryBucket,
        assignmentId: historyMemoryAssignmentId,
        assignedAt: new Date().toISOString()
      }));
    } catch (err) {}
  }

  function historyBucket() {
    if (historyMemoryBucket !== null) {
      rememberHistoryAssignment();
      return historyMemoryBucket;
    }
    var stored = readStoredHistoryAssignment();
    historyMemoryBucket = stored === null ? randomHistoryBucket() : stored.bucket;
    historyMemoryAssignmentId = stored && stored.assignmentId || '';
    rememberHistoryAssignment();
    return historyMemoryBucket;
  }

  function historyAssignmentId() {
    if (!historyAnalyticsAllowed()) return '';
    historyBucket();
    rememberHistoryAssignment();
    return historyMemoryAssignmentId;
  }

  function historyStageEligibility(stage, slug) {
    var coreEligible = Boolean(HISTORY_ORIGINAL_CANARY_SLUGS[slug] || HISTORY_RELEVANT_ROLLOUT_SLUGS[slug]);
    if (stage === 'ramp' || stage === 'pilot') return coreEligible;
    if (stage === 'expanded') return coreEligible || slug === HISTORY_EXPANSION_SLUG;
    return false;
  }

  function historyStageWeight(config, stage) {
    stage = stage || historyEffectiveStage(config);
    if (stage === 'ramp') return Math.max(0, Math.min(1, config.rampWeight));
    if (stage === 'pilot') return Math.max(0, Math.min(1, config.pilotWeight));
    if (stage === 'expanded' && config.enableExpansion) return Math.max(0, Math.min(1, config.expandedWeight));
    return 0;
  }

  function historyAssignmentShape(variant, inExperiment, qa, stage, slug) {
    return {
      experimentId: HISTORY_EXPERIMENT_ID,
      variant: variant,
      inExperiment: Boolean(inExperiment),
      qa: Boolean(qa),
      stage: stage || 'qa',
      sourceSlug: slug || historySlug(),
      acquisitionCohort: historyAcquisitionCohort(slug),
      placement: HISTORY_INLINE_PLACEMENT,
      assignmentId: inExperiment ? historyAssignmentId() : ''
    };
  }

  function historyAssignment() {
    var slug = historySlug();
    try {
      var config = historyConfig();
      var stage = historyEffectiveStage(config);
      var choice = historyQueryChoice();
      var globallyDisabled = window.BW_DISABLE_HISTORY_LEAD === true || choice === 'off' || !config.enabled || historyFallbackPaths[location.pathname];
      if (globallyDisabled) return historyAssignmentShape('control', false, false, stage, slug);
      if (choice === 'variant') return historyAssignmentShape('variant', true, true, 'qa', slug);
      if (choice === 'control') return historyAssignmentShape('control', true, true, 'qa', slug);
      if (stage === 'expanded' && !config.enableExpansion) stage = 'pilot';
      if (!historyStageEligibility(stage, slug)) return historyAssignmentShape('control', false, false, stage, slug);
      return historyAssignmentShape(
        historyBucket() < historyStageWeight(config, stage) ? 'variant' : 'control',
        true,
        false,
        stage,
        slug
      );
    } catch (error) {
      console.warn(LOG, 'history assignment failed; restored booking control', error && error.message || error);
      return historyAssignmentShape('control', false, false, 'qa', slug);
    }
  }

  function safeHistoryUrl(value) {
    try {
      var url = new URL(String(value || ''), window.location.href);
      if (url.protocol !== 'https:' && url.protocol !== 'http:') return '';
      return url.origin + url.pathname;
    } catch (err) {
      return '';
    }
  }

  function cleanHistoryAttribution(value) {
    var cleaned = String(value || '').trim().slice(0, 180);
    return /@|%40/i.test(cleaned) ? '' : cleaned;
  }

  function historyUtm() {
    var params = new URLSearchParams(window.location.search || '');
    return {
      source: cleanHistoryAttribution(params.get('utm_source')),
      medium: cleanHistoryAttribution(params.get('utm_medium')),
      campaign: cleanHistoryAttribution(params.get('utm_campaign')),
      content: cleanHistoryAttribution(params.get('utm_content')),
      term: cleanHistoryAttribution(params.get('utm_term')),
      id: cleanHistoryAttribution(params.get('utm_id'))
    };
  }

  function historyEventUrl() {
    var url = new URL(HISTORY_API_BASE, window.location.href);
    url.searchParams.set('action', 'event');
    return url.toString();
  }

  function historyEventPayload(eventName, assignment) {
    if (!historyAnalyticsAllowed()) return false;
    assignment = assignment || historyAssignmentShape('control', false, false, 'qa', historySlug());
    var assignmentId = historyAssignmentId();
    return {
      eventName: eventName,
      occurredAt: new Date().toISOString(),
      analyticsConsent: true,
      analyticsConsentAtSubmit: true,
      sourceSlug: assignment.sourceSlug || historySlug(),
      pageUrl: safeHistoryUrl(window.location.href),
      referrer: safeHistoryUrl(document.referrer),
      experiment: HISTORY_EXPERIMENT_ID,
      variant: assignment.variant,
      acquisitionCohort: assignment.acquisitionCohort || historyAcquisitionCohort(assignment.sourceSlug),
      placement: assignment.placement || HISTORY_INLINE_PLACEMENT,
      assignmentId: assignmentId,
      storyId: '',
      utm: historyUtm(),
      device: {
        width: Number(window.innerWidth || 0),
        height: Number(window.innerHeight || 0)
      },
      qa: Boolean(assignment.qa)
    };
  }

  function sendHistoryEvent(eventName, assignment) {
    var body = historyEventPayload(eventName, assignment);
    if (!body) return false;
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: eventName,
        experiment: HISTORY_EXPERIMENT_ID,
        variant: body.variant,
        acquisition_cohort: body.acquisitionCohort,
        placement: body.placement,
        assignment_id: body.assignmentId
      });
      if (typeof window.gtag === 'function') window.gtag('event', eventName, {
        experiment: HISTORY_EXPERIMENT_ID,
        variant: body.variant,
        acquisition_cohort: body.acquisitionCohort,
        placement: body.placement,
        assignment_id: body.assignmentId
      });
      fetch(historyEventUrl(), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        keepalive: true,
        body: JSON.stringify(body)
      }).catch(function () {});
      return true;
    } catch (err) {
      return false;
    }
  }

  function queueHistoryExperimentView(assignment) {
    if (!assignment.inExperiment) return;
    var key = location.pathname + ':' + assignment.variant + ':' + (assignment.qa ? 'qa' : 'live');
    if (sentHistoryViews[key]) return;
    pendingHistoryViews[key] = assignment;
    flushHistoryExperimentViews();
  }

  function flushHistoryExperimentViews() {
    rememberHistoryAssignment();
    if (!historyAnalyticsAllowed()) return;
    Object.keys(pendingHistoryViews).forEach(function (key) {
      var assignment = pendingHistoryViews[key];
      assignment.assignmentId = historyAssignmentId();
      var element = document.querySelector('[' + HISTORY_MARKER + ']');
      if (element && assignment.assignmentId) element.setAttribute('assignment-id', assignment.assignmentId);
      if (sendHistoryEvent('bw_history_lead_experiment_view', assignment)) {
        sentHistoryViews[key] = true;
        delete pendingHistoryViews[key];
      }
    });
  }

  function bindControlHistoryTracking(card, assignment) {
    if (!assignment.inExperiment) return;
    card.addEventListener('click', function (event) {
      var target = event.target.closest('[data-bw-booking-cta],[data-bw-day-index],[data-bw-slot-index],.bw-blog-booking-more');
      if (target) sendHistoryEvent('bw_history_control_booking_click', assignment);
    });
  }

  function contentUpgradeMagnetForSlug(slug) {
    var matches = CONTENT_UPGRADE_MAGNETS.filter(function (magnet) {
      return magnet.slugs.indexOf(String(slug || '')) !== -1;
    });
    if (matches.length > 1) throw new Error('lead magnet slug collision');
    return matches[0] || null;
  }

  function contentUpgradeMagnetById(assetId) {
    return CONTENT_UPGRADE_MAGNETS.find(function (magnet) { return magnet.assetId === assetId; }) || null;
  }

  function contentUpgradeConfig() {
    try {
      var override = window.BW_CONTENT_UPGRADE_EXPERIMENT_CONFIG || {};
      var stage = String(override.stage || 'qa').toLowerCase();
      if (['qa', 'safety', 'ramp', 'pilot'].indexOf(stage) === -1) throw new Error('unsupported stage');
      return {
        enabled: override.enabled !== false,
        stage: stage,
        safetyStartedAt: String(override.safetyStartedAt || ''),
        rampWeight: Number.isFinite(Number(override.rampWeight)) ? Number(override.rampWeight) : 0.10,
        pilotWeight: Number.isFinite(Number(override.pilotWeight)) ? Number(override.pilotWeight) : 0.50,
        invalid: false
      };
    } catch (error) {
      console.warn(LOG, 'content-upgrade config invalid; restored booking control', error && error.message || error);
      return {
        enabled: false,
        stage: 'qa',
        safetyStartedAt: '',
        rampWeight: 0,
        pilotWeight: 0,
        invalid: true
      };
    }
  }

  function contentUpgradeEffectiveStage(config) {
    if (config.stage !== 'safety') return config.stage;
    var startedAt = new Date(config.safetyStartedAt).getTime();
    if (!Number.isFinite(startedAt) || startedAt > Date.now()) return 'qa';
    return Date.now() - startedAt >= 24 * 60 * 60 * 1000 ? 'pilot' : 'ramp';
  }

  function contentUpgradeQueryChoice() {
    var match = String(location.search || '').match(/[?&]bwDownloadLead=([^&]+)/);
    if (!match) return '';
    var value = decodeURIComponent(match[1] || '').toLowerCase();
    if (value === '0' || value === 'off') return 'off';
    if (value === 'control') return 'control';
    if (value === '1' || value === 'on' || value === 'variant') return 'variant';
    return '';
  }

  function contentUpgradeAcquisitionCohort(magnet, slug) {
    slug = slug || historySlug();
    if (magnet && magnet.slugs.indexOf(slug) !== -1) return magnet.acquisitionCohort;
    if (magnet) return magnet.experimentId + '_qa';
    return 'blog_forced_qa';
  }

  function randomContentUpgradeBucket() {
    try {
      if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
        var values = new Uint32Array(1);
        window.crypto.getRandomValues(values);
        return values[0] / 4294967296;
      }
    } catch (err) {}
    return Math.random();
  }

  function validContentUpgradeAssignmentId(value) {
    value = String(value || '');
    return /^cua_[a-f0-9]{32}$/i.test(value) ? value : '';
  }

  function randomContentUpgradeAssignmentId() {
    try {
      if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
        var values = new Uint32Array(4);
        window.crypto.getRandomValues(values);
        return 'cua_' + Array.prototype.map.call(values, function (value) {
          return Number(value).toString(16).padStart(8, '0');
        }).join('');
      }
    } catch (err) {}
    var fallback = '';
    for (var i = 0; i < 4; i++) fallback += Math.floor(Math.random() * 4294967296).toString(16).padStart(8, '0');
    return 'cua_' + fallback;
  }

  function contentUpgradeState(magnet) {
    var key = magnet && magnet.experimentId;
    if (!key) return null;
    if (!contentUpgradeStates[key]) {
      contentUpgradeStates[key] = {
        bucket: null,
        assignmentId: '',
        fallbackPaths: {},
      };
    }
    return contentUpgradeStates[key];
  }

  function readStoredContentUpgradeAssignment(magnet) {
    var state = contentUpgradeState(magnet);
    if (!historyAnalyticsAllowed()) return null;
    try {
      var raw = window.localStorage.getItem(magnet.storageKey);
      var parsed = raw ? JSON.parse(raw) : null;
      if (parsed && parsed.experiment === magnet.experimentId && typeof parsed.bucket === 'number' && parsed.bucket >= 0 && parsed.bucket < 1) {
        if (state) state.assignmentId = validContentUpgradeAssignmentId(parsed.assignmentId);
        return {
          bucket: parsed.bucket,
          assignmentId: validContentUpgradeAssignmentId(parsed.assignmentId)
        };
      }
    } catch (err) {}
    return null;
  }

  function rememberContentUpgradeAssignment(magnet) {
    var state = contentUpgradeState(magnet);
    if (!magnet || !state || !historyAnalyticsAllowed() || state.bucket === null) return;
    try {
      if (!state.assignmentId) state.assignmentId = randomContentUpgradeAssignmentId();
      window.localStorage.setItem(magnet.storageKey, JSON.stringify({
        experiment: magnet.experimentId,
        bucket: state.bucket,
        assignmentId: state.assignmentId,
        assignedAt: new Date().toISOString()
      }));
    } catch (err) {}
  }

  function contentUpgradeBucket(magnet) {
    var state = contentUpgradeState(magnet);
    if (!magnet || !state) return 1;
    if (state.bucket !== null) {
      rememberContentUpgradeAssignment(magnet);
      return state.bucket;
    }
    var stored = readStoredContentUpgradeAssignment(magnet);
    state.bucket = stored === null ? randomContentUpgradeBucket() : stored.bucket;
    state.assignmentId = stored && stored.assignmentId || state.assignmentId || '';
    rememberContentUpgradeAssignment(magnet);
    return state.bucket;
  }

  function contentUpgradeAssignmentId(magnet) {
    if (!historyAnalyticsAllowed()) return '';
    contentUpgradeBucket(magnet);
    rememberContentUpgradeAssignment(magnet);
    var state = contentUpgradeState(magnet);
    return state ? state.assignmentId : '';
  }

  function contentUpgradeStageEligibility(stage, slug, magnet) {
    magnet = magnet || contentUpgradeMagnetForSlug(slug);
    if (!magnet) return false;
    if (stage === 'ramp') return Boolean(magnet.rampSlug && slug === magnet.rampSlug);
    if (stage === 'pilot') return magnet.slugs.indexOf(slug) !== -1;
    return false;
  }

  function contentUpgradeStageWeight(config, stage) {
    stage = stage || contentUpgradeEffectiveStage(config);
    if (stage === 'ramp') return Math.max(0, Math.min(1, config.rampWeight));
    if (stage === 'pilot') return Math.max(0, Math.min(1, config.pilotWeight));
    return 0;
  }

  function contentUpgradeAssignmentShape(magnet, variant, inExperiment, qa, stage, slug) {
    return {
      experimentId: magnet ? magnet.experimentId : '',
      assetId: magnet ? magnet.assetId : '',
      assetVersion: magnet ? magnet.assetVersion : '',
      storageKey: magnet ? magnet.storageKey : '',
      apiBase: magnet ? magnet.apiBase : CONTENT_UPGRADE_DEFAULT_API_BASE,
      elementUrl: magnet ? magnet.elementUrl : CONTENT_UPGRADE_DEFAULT_ELEMENT_URL,
      variant: variant,
      inExperiment: Boolean(inExperiment),
      qa: Boolean(qa),
      stage: stage || 'qa',
      sourceSlug: slug || historySlug(),
      acquisitionCohort: contentUpgradeAcquisitionCohort(magnet, slug),
      placement: magnet ? magnet.placement : CONTENT_UPGRADE_PLACEMENT,
      controlType: magnet ? magnet.controlType : '',
      controlUrl: magnet ? magnet.controlUrl : '',
      magnetId: magnet ? magnet.assetId : '',
      assignmentId: inExperiment ? contentUpgradeAssignmentId(magnet) : ''
    };
  }

  function contentUpgradeControlUrl(assignment) {
    if (!assignment || !assignment.controlUrl) return '';
    try {
      var url = new URL(assignment.controlUrl, window.location.href);
      url.searchParams.set('utm_source', 'berlinwalk');
      url.searchParams.set('utm_medium', 'blog');
      url.searchParams.set('utm_campaign', assignment.experimentId || 'lead_asset');
      url.searchParams.set('utm_content', assignment.sourceSlug || 'blog_post');
      return url.toString();
    } catch (err) {
      return assignment.controlUrl;
    }
  }

  function contentUpgradeAssignment() {
    var slug = historySlug();
    try {
      var config = contentUpgradeConfig();
      var stage = contentUpgradeEffectiveStage(config);
      var choice = contentUpgradeQueryChoice();
      var magnet = contentUpgradeMagnetForSlug(slug);
      if (!magnet && (choice === 'variant' || choice === 'control')) magnet = CONTENT_UPGRADE_MAGNETS[0];
      var globallyDisabled = window.BW_DISABLE_CONTENT_UPGRADE === true || choice === 'off' || !config.enabled || contentUpgradeFallbackPaths[location.pathname];
      if (!magnet) return contentUpgradeAssignmentShape(null, 'control', false, false, stage, slug);
      if (globallyDisabled) return contentUpgradeAssignmentShape(magnet, 'control', false, false, stage, slug);
      if (choice === 'variant') return contentUpgradeAssignmentShape(magnet, 'variant', true, true, 'qa', slug);
      if (choice === 'control') return contentUpgradeAssignmentShape(magnet, 'control', true, true, 'qa', slug);
      if (!contentUpgradeStageEligibility(stage, slug, magnet)) return contentUpgradeAssignmentShape(magnet, 'control', false, false, stage, slug);
      return contentUpgradeAssignmentShape(
        magnet,
        contentUpgradeBucket(magnet) < contentUpgradeStageWeight(config, stage) ? 'variant' : 'control',
        true,
        false,
        stage,
        slug
      );
    } catch (error) {
      console.warn(LOG, 'content-upgrade assignment failed; restored booking control', error && error.message || error);
      return contentUpgradeAssignmentShape(null, 'control', false, false, 'qa', slug);
    }
  }

  function contentUpgradeEventUrl(assignment) {
    var url = new URL(assignment && assignment.apiBase || CONTENT_UPGRADE_DEFAULT_API_BASE, window.location.href);
    url.searchParams.set('action', 'event');
    return url.toString();
  }

  function contentUpgradeEventPayload(eventName, assignment) {
    if (!historyAnalyticsAllowed()) return false;
    assignment = assignment || contentUpgradeAssignmentShape(null, 'control', false, false, 'qa', historySlug());
    var magnet = contentUpgradeMagnetById(assignment.assetId);
    var assignmentId = assignment.assignmentId || (magnet ? contentUpgradeAssignmentId(magnet) : '');
    return {
      eventName: eventName,
      occurredAt: new Date().toISOString(),
      analyticsConsent: true,
      analyticsConsentAtSubmit: true,
      assetId: assignment.assetId,
      assetVersion: assignment.assetVersion,
      sourceSlug: assignment.sourceSlug || historySlug(),
      pageUrl: safeHistoryUrl(window.location.href),
      referrer: safeHistoryUrl(document.referrer),
      experiment: assignment.experimentId,
      variant: assignment.variant,
      acquisitionCohort: assignment.acquisitionCohort || contentUpgradeAcquisitionCohort(magnet, assignment.sourceSlug),
      placement: assignment.placement || CONTENT_UPGRADE_PLACEMENT,
      controlType: assignment.controlType || '',
      controlUrl: contentUpgradeControlUrl(assignment),
      assignmentId: assignmentId,
      utm: historyUtm(),
      device: {
        width: Number(window.innerWidth || 0),
        height: Number(window.innerHeight || 0)
      },
      qa: Boolean(assignment.qa)
    };
  }

  function sendContentUpgradeEvent(eventName, assignment) {
    var body = contentUpgradeEventPayload(eventName, assignment);
    if (!body) return false;
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: eventName,
        experiment: body.experiment,
        variant: body.variant,
        acquisition_cohort: body.acquisitionCohort,
        placement: body.placement,
        assignment_id: body.assignmentId,
        asset_id: body.assetId,
        control_type: body.controlType,
        control_url: body.controlUrl
      });
      if (typeof window.gtag === 'function') window.gtag('event', eventName, {
        experiment: body.experiment,
        variant: body.variant,
        acquisition_cohort: body.acquisitionCohort,
        placement: body.placement,
        assignment_id: body.assignmentId,
        asset_id: body.assetId,
        control_type: body.controlType,
        control_url: body.controlUrl
      });
      fetch(contentUpgradeEventUrl(assignment), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        keepalive: true,
        body: JSON.stringify(body)
      }).catch(function () {});
      return true;
    } catch (err) {
      return false;
    }
  }

  function queueContentUpgradeExperimentView(assignment) {
    if (!assignment.inExperiment) return;
    var key = assignment.experimentId + ':' + location.pathname + ':' + assignment.variant + ':' + (assignment.qa ? 'qa' : 'live');
    if (sentContentUpgradeViews[key]) return;
    pendingContentUpgradeViews[key] = assignment;
    flushContentUpgradeExperimentViews();
  }

  function flushContentUpgradeExperimentViews() {
    if (!historyAnalyticsAllowed()) return;
    Object.keys(pendingContentUpgradeViews).forEach(function (key) {
      var assignment = pendingContentUpgradeViews[key];
      var magnet = contentUpgradeMagnetById(assignment.assetId);
      rememberContentUpgradeAssignment(magnet);
      assignment.assignmentId = assignment.assignmentId || contentUpgradeAssignmentId(magnet);
      var element = document.querySelector('[' + CONTENT_UPGRADE_MARKER + ']');
      if (element && assignment.assignmentId) element.setAttribute('assignment-id', assignment.assignmentId);
      if (sendContentUpgradeEvent('bw_lead_asset_experiment_view', assignment)) {
        sentContentUpgradeViews[key] = true;
        delete pendingContentUpgradeViews[key];
      }
    });
  }

  function bindControlContentUpgradeTracking(card, assignment) {
    if (!assignment.inExperiment) return;
    card.addEventListener('click', function (event) {
      var target = event.target.closest('[data-bw-private-tour-cta],[data-bw-content-upgrade-control-cta],[data-bw-booking-cta],[data-bw-day-index],[data-bw-slot-index],.bw-blog-booking-more');
      if (target) sendContentUpgradeEvent('bw_lead_asset_control_booking_click', assignment);
    });
  }

  function loadHistoryElement() {
    if (window.customElements && customElements.get(HISTORY_ELEMENT_TAG)) return Promise.resolve();
    if (historyElementPromise) return historyElementPromise;
    historyElementPromise = new Promise(function (resolve, reject) {
      var done = false;
      var timeout = setTimeout(function () {
        if (done) return;
        done = true;
        reject(new Error('History lead element timed out'));
      }, 7000);

      function finish() {
        if (done) return;
        if (!window.customElements || !customElements.get(HISTORY_ELEMENT_TAG)) return;
        done = true;
        clearTimeout(timeout);
        resolve();
      }

      var existing = document.querySelector('script[data-bw-history-lead-element]');
      if (existing) {
        if (window.customElements && typeof customElements.whenDefined === 'function') customElements.whenDefined(HISTORY_ELEMENT_TAG).then(finish);
        existing.addEventListener('error', function () {
          if (done) return;
          done = true;
          clearTimeout(timeout);
          reject(new Error('History lead element failed to load'));
        }, { once: true });
        return;
      }

      var script = document.createElement('script');
      script.src = HISTORY_ELEMENT_URL;
      script.async = true;
      script.setAttribute('data-bw-history-lead-element', '1');
      script.onload = function () {
        finish();
        if (!done && window.customElements && typeof customElements.whenDefined === 'function') customElements.whenDefined(HISTORY_ELEMENT_TAG).then(finish);
      };
      script.onerror = function () {
        if (done) return;
        done = true;
        clearTimeout(timeout);
        reject(new Error('History lead element failed to load'));
      };
      document.head.appendChild(script);
    });
    return historyElementPromise;
  }

  function loadContentUpgradeElement(magnet) {
    if (window.customElements && customElements.get(CONTENT_UPGRADE_ELEMENT_TAG)) return Promise.resolve();
    if (contentUpgradeElementPromise) return contentUpgradeElementPromise;
    contentUpgradeElementPromise = new Promise(function (resolve, reject) {
      var done = false;
      var timeout = setTimeout(function () {
        if (done) return;
        done = true;
        reject(new Error('Content-upgrade element timed out'));
      }, CONTENT_UPGRADE_READY_TIMEOUT_MS);

      function finish() {
        if (done) return;
        if (!window.customElements || !customElements.get(CONTENT_UPGRADE_ELEMENT_TAG)) return;
        done = true;
        clearTimeout(timeout);
        resolve();
      }

      var existing = document.querySelector('script[data-bw-content-upgrade-element]');
      if (existing) {
        if (window.customElements && typeof customElements.whenDefined === 'function') customElements.whenDefined(CONTENT_UPGRADE_ELEMENT_TAG).then(finish);
        existing.addEventListener('error', function () {
          if (done) return;
          done = true;
          clearTimeout(timeout);
          reject(new Error('Content-upgrade element failed to load'));
        }, { once: true });
        return;
      }

      var script = document.createElement('script');
      script.src = magnet && magnet.elementUrl || CONTENT_UPGRADE_DEFAULT_ELEMENT_URL;
      script.async = true;
      script.setAttribute('data-bw-content-upgrade-element', '1');
      script.onload = function () {
        finish();
        if (!done && window.customElements && typeof customElements.whenDefined === 'function') customElements.whenDefined(CONTENT_UPGRADE_ELEMENT_TAG).then(finish);
      };
      script.onerror = function () {
        if (done) return;
        done = true;
        clearTimeout(timeout);
        reject(new Error('Content-upgrade element failed to load'));
      };
      document.head.appendChild(script);
    });
    return contentUpgradeElementPromise;
  }

  function currentInsertionAnchor() {
    var body = findPostBody();
    return body ? findInsertionAnchor(body) : null;
  }

  function insertControl(anchor, assignment) {
    var isContentControl = Boolean(assignment && assignment.inExperiment && assignment.magnetId && assignment.experimentId);
    var card = isContentControl
      ? buildPrivateTourControlCard(assignment)
      : buildBookingCard();
    if (isContentControl) {
      bindControlContentUpgradeTracking(card, assignment);
    } else {
      bindControlHistoryTracking(card, assignment);
    }
    anchor.parentNode.insertBefore(card, anchor.nextSibling);
    injections += 1;
    if (isContentControl) {
      queueContentUpgradeExperimentView(assignment);
    } else {
      queueHistoryExperimentView(assignment);
    }
    console.log(LOG, 'injected attempt', injections, assignment.inExperiment ? 'experiment control' : 'booking card');
    return true;
  }

  function restoreBookingControl(requestedPath, assignment, error, element) {
    historyInsertionPending = false;
    historyFallbackPaths[requestedPath] = true;
    if (element && element.parentNode) element.parentNode.removeChild(element);
    clearHistoryInlineLayering();
    if (location.pathname !== requestedPath) return false;
    if (document.querySelector('[' + MARKER + ']')) return true;
    var anchor = currentInsertionAnchor();
    if (!anchor) {
      scheduleInject();
      return false;
    }
    var fallback = historyAssignmentShape('control', false, assignment && assignment.qa, assignment && assignment.stage, assignment && assignment.sourceSlug);
    insertControl(anchor, fallback);
    console.warn(LOG, 'history variant unavailable; restored booking control', error && error.message || error);
    return true;
  }

  function monitorHistoryElement(element, requestedPath, assignment) {
    var startedAt = Date.now();
    function checkReady() {
      if (location.pathname !== requestedPath || !element.parentNode) return;
      var ready = element.getAttribute('data-bw-history-lead-ready');
      if (ready === 'true') {
        queueHistoryExperimentView(assignment);
        return;
      }
      if (ready === 'error' || Date.now() - startedAt >= HISTORY_ELEMENT_READY_TIMEOUT_MS) {
        restoreBookingControl(requestedPath, assignment, new Error('History lead element did not become ready'), element);
        return;
      }
      setTimeout(checkReady, 250);
    }
    element.addEventListener('bw-history-lead-error', function () {
      restoreBookingControl(requestedPath, assignment, new Error('History lead element render failed'), element);
    }, { once: true });
    setTimeout(checkReady, 250);
  }

  function insertHistoryVariant(assignment) {
    if (historyInsertionPending) return true;
    historyInsertionPending = true;
    var requestedPath = location.pathname;
    var insertedElement = null;
    loadHistoryElement().then(function () {
      historyInsertionPending = false;
      if (location.pathname !== requestedPath || document.querySelector('[' + MARKER + ']')) return;
      var anchor = currentInsertionAnchor();
      if (!anchor) return;
      var element = document.createElement(HISTORY_ELEMENT_TAG);
      insertedElement = element;
      element.setAttribute(MARKER, '1');
      element.setAttribute(HISTORY_MARKER, '1');
      element.setAttribute('mode', 'inline');
      element.setAttribute('experiment', HISTORY_EXPERIMENT_ID);
      element.setAttribute('variant', 'variant');
      element.setAttribute('api-base', HISTORY_API_BASE);
      element.setAttribute('acquisition-cohort', assignment.acquisitionCohort);
      element.setAttribute('placement', assignment.placement);
      if (assignment.assignmentId) element.setAttribute('assignment-id', assignment.assignmentId);
      if (assignment.qa) element.setAttribute('qa', 'true');
      anchor.parentNode.insertBefore(element, anchor.nextSibling);
      injections += 1;
      monitorHistoryElement(element, requestedPath, assignment);
      console.log(LOG, 'injected attempt', injections, 'experiment variant');
    }).catch(function (error) {
      restoreBookingControl(requestedPath, assignment, error, insertedElement);
    });
    return true;
  }

  function restoreContentUpgradeBookingControl(requestedPath, assignment, error, element) {
    contentUpgradeInsertionPending = false;
    contentUpgradeFallbackPaths[requestedPath] = true;
    if (element && element.parentNode) element.parentNode.removeChild(element);
    if (location.pathname !== requestedPath) return false;
    if (document.querySelector('[' + MARKER + ']')) return true;
    var anchor = currentInsertionAnchor();
    if (!anchor) {
      scheduleInject();
      return false;
    }
    var fallback = historyAssignmentShape('control', false, assignment && assignment.qa, assignment && assignment.stage, assignment && assignment.sourceSlug);
    insertControl(anchor, fallback);
    console.warn(LOG, 'content-upgrade variant unavailable; restored booking control', error && error.message || error);
    return true;
  }

  function bindContentUpgradeElementTracking(element, assignment) {
    element.addEventListener('bw-content-upgrade-form-start', function () {
      sendContentUpgradeEvent('bw_lead_asset_form_start', assignment);
    }, { once: true });
    element.addEventListener('bw-content-upgrade-submit', function () {
      sendContentUpgradeEvent('bw_lead_asset_submit', assignment);
    });
    element.addEventListener('bw-content-upgrade-calc-done', function () {
      sendContentUpgradeEvent('bw_lead_asset_calc_done', assignment);
    }, { once: true });
  }

  function monitorContentUpgradeElement(element, requestedPath, assignment) {
    var startedAt = Date.now();
    function checkReady() {
      if (location.pathname !== requestedPath || !element.parentNode) return;
      var ready = element.getAttribute('data-bw-content-upgrade-ready');
      if (ready === 'true') {
        queueContentUpgradeExperimentView(assignment);
        sendContentUpgradeEvent('bw_lead_asset_gate_view', assignment);
        return;
      }
      if (ready === 'error' || Date.now() - startedAt >= CONTENT_UPGRADE_READY_TIMEOUT_MS) {
        restoreContentUpgradeBookingControl(requestedPath, assignment, new Error('Content-upgrade element did not become ready'), element);
        return;
      }
      setTimeout(checkReady, 250);
    }
    element.addEventListener('bw-content-upgrade-error', function () {
      restoreContentUpgradeBookingControl(requestedPath, assignment, new Error('Content-upgrade element render failed'), element);
    }, { once: true });
    setTimeout(checkReady, 250);
  }

  function insertContentUpgradeVariant(assignment) {
    if (contentUpgradeInsertionPending) return true;
    contentUpgradeInsertionPending = true;
    var requestedPath = location.pathname;
    var insertedElement = null;
    var magnet = contentUpgradeMagnetById(assignment && assignment.assetId);
    loadContentUpgradeElement(magnet).then(function () {
      contentUpgradeInsertionPending = false;
      if (location.pathname !== requestedPath || document.querySelector('[' + MARKER + ']')) return;
      var anchor = currentInsertionAnchor();
      if (!anchor) return;
      var element = document.createElement(CONTENT_UPGRADE_ELEMENT_TAG);
      insertedElement = element;
      element.setAttribute(MARKER, '1');
      element.setAttribute(CONTENT_UPGRADE_MARKER, '1');
      element.setAttribute('asset-id', assignment.assetId);
      element.setAttribute('asset-version', assignment.assetVersion);
      element.setAttribute('source-slug', assignment.sourceSlug);
      element.setAttribute('source-url', safeHistoryUrl(window.location.href));
      element.setAttribute('experiment', assignment.experimentId);
      element.setAttribute('variant', 'variant');
      element.setAttribute('api-base', assignment.apiBase);
      element.setAttribute('acquisition-cohort', assignment.acquisitionCohort);
      element.setAttribute('placement', assignment.placement);
      if (assignment.assignmentId) element.setAttribute('assignment-id', assignment.assignmentId);
      if (assignment.qa) element.setAttribute('qa', 'true');
      if (magnet && magnet.component) {
        var copy = magnet.component;
        element.setAttribute('bar-copy', copy.barCopy);
        element.setAttribute('eyebrow', copy.eyebrow);
        element.setAttribute('title', copy.title);
        element.setAttribute('description', copy.description);
        element.setAttribute('gate-copy', copy.gateCopy);
        element.setAttribute('submit-label', copy.submitLabel);
        element.setAttribute('consent-version', copy.consentVersion);
        element.setAttribute('consent-text', copy.consentText);
        element.setAttribute('success-copy', copy.successCopy);
        element.setAttribute('arrival-label', copy.arrivalLabel);
        element.setAttribute('arrival-options', JSON.stringify(copy.arrivalOptions));
        element.setAttribute('teaser-items', JSON.stringify(copy.teasers));
        element.setAttribute('content-items', JSON.stringify(copy.items));
        if (copy.gateMode) element.setAttribute('gate-mode', copy.gateMode);
        if (copy.calcConfig) element.setAttribute('calc-config', JSON.stringify(copy.calcConfig));
      }
      bindContentUpgradeElementTracking(element, assignment);
      anchor.parentNode.insertBefore(element, anchor.nextSibling);
      injections += 1;
      monitorContentUpgradeElement(element, requestedPath, assignment);
      console.log(LOG, 'injected attempt', injections, 'content-upgrade experiment variant');
    }).catch(function (error) {
      restoreContentUpgradeBookingControl(requestedPath, assignment, error, insertedElement);
    });
    return true;
  }

  function slotDecision() {
    var history = historyAssignment();
    if (history.inExperiment) return { owner: 'history', assignment: history };
    var contentUpgrade = contentUpgradeAssignment();
    if (contentUpgrade.inExperiment) return { owner: 'content-upgrade', assignment: contentUpgrade };
    return { owner: 'booking', assignment: history };
  }

  function inject() {
    if (!isPostPage()) return false;
    if (document.querySelector('[' + MARKER + ']')) return false;
    if (injections >= MAX_REINJECTS) return false;
    if (historyInsertionPending || contentUpgradeInsertionPending) return false;

    var body = findPostBody();
    if (!body) return false;
    var anchor = findInsertionAnchor(body);
    if (!anchor) return false;

    var decision;
    try {
      decision = slotDecision();
      if (decision.owner === 'history' && decision.assignment.variant === 'variant') return insertHistoryVariant(decision.assignment);
      if (decision.owner === 'content-upgrade' && decision.assignment.variant === 'variant') return insertContentUpgradeVariant(decision.assignment);
      return insertControl(anchor, decision.assignment);
    } catch (error) {
      console.warn(LOG, 'slot experiment failed; restored booking control', error && error.message || error);
      return insertControl(anchor, historyAssignmentShape('control', false, false, 'qa', historySlug()));
    }
  }

  function scheduleInject() {
    clearTimeout(reinjectTimer);
    reinjectTimer = setTimeout(inject, REINJECT_DEBOUNCE_MS);
  }

  function startObserving() {
    if (observer) observer.disconnect();
    observer = new MutationObserver(function () {
      if (!isPostPage() || injections >= MAX_REINJECTS) return;
      if (!document.querySelector('[' + MARKER + ']')) scheduleInject();
    });
    if (document.body) observer.observe(document.body, { childList: true, subtree: true });
  }

  function bootForCurrentPage() {
    injections = 0;
    historyInsertionPending = false;
    contentUpgradeInsertionPending = false;
    clearHistoryInlineLayering();
    setTimeout(function () {
      inject();
      startObserving();
    }, 800);
    [1500, 2500, 4000].forEach(function (delay) {
      setTimeout(function () {
        if (!document.querySelector('[' + MARKER + ']')) inject();
      }, delay);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootForCurrentPage);
  } else {
    bootForCurrentPage();
  }

  ['consentPolicyChanged', 'consentPolicyInitialized', 'ucConsentEvent'].forEach(function (name) {
    window.addEventListener(name, flushHistoryExperimentViews);
    document.addEventListener(name, flushHistoryExperimentViews);
    window.addEventListener(name, flushContentUpgradeExperimentViews);
    document.addEventListener(name, flushContentUpgradeExperimentViews);
  });

  if (window.BW_HISTORY_LEAD_TEST_HOOKS === true) {
    window.__bwHistoryLeadTestHooks = {
      assignment: historyAssignment,
      effectiveStage: function () { return historyEffectiveStage(historyConfig()); },
      eventPayload: historyEventPayload,
      eligible: historyStageEligibility,
      cohort: historyAcquisitionCohort,
      fallbackAssignment: function () { return historyAssignmentShape('control', false, false, 'qa', historySlug()); },
      resetBucket: function () { historyMemoryBucket = null; historyMemoryAssignmentId = ''; },
      storageKey: HISTORY_STORAGE_KEY,
      placement: HISTORY_INLINE_PLACEMENT
    };
  }

  if (window.BW_CONTENT_UPGRADE_TEST_HOOKS === true) {
    window.__bwContentUpgradeTestHooks = {
      assignment: contentUpgradeAssignment,
      effectiveStage: function () { return contentUpgradeEffectiveStage(contentUpgradeConfig()); },
      eventPayload: contentUpgradeEventPayload,
      eligible: contentUpgradeStageEligibility,
      fallbackAssignment: function () { return contentUpgradeAssignmentShape(null, 'control', false, false, 'qa', historySlug()); },
      resetBucket: function () { contentUpgradeStates = {}; },
      slotDecision: slotDecision,
      slugs: CONTENT_UPGRADE_MAGNETS[0].slugs.slice(),
      storageKey: CONTENT_UPGRADE_MAGNETS[0].storageKey,
      placement: CONTENT_UPGRADE_MAGNETS[0].placement,
      safetySlug: '',
      magnetConfigs: CONTENT_UPGRADE_MAGNETS.map(function (magnet) {
        return {
          experimentId: magnet.experimentId,
          assetId: magnet.assetId,
          assetVersion: magnet.assetVersion,
          storageKey: magnet.storageKey,
          apiBase: magnet.apiBase,
          elementUrl: magnet.elementUrl,
          placement: magnet.placement,
          controlType: magnet.controlType,
          controlUrl: magnet.controlUrl,
          slugs: magnet.slugs.slice()
        };
      })
    };
  }

  setInterval(function () {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      clearHistoryInlineLayering();
      bootForCurrentPage();
    }
  }, 300);
})();
