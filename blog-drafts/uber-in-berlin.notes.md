# Uber in Berlin - production notes (internal)

Created: 2026-07-10 Europe/Berlin (daily blog automation, Claude)

## Topic / SEO plan
- Focus keyword: `Uber in Berlin`
- Search intent: informational + planning. First-time visitors asking "does Uber
  work in Berlin", "Uber from BER airport", "Uber vs Bolt vs FreeNow Berlin",
  "is Uber cheaper than a taxi in Berlin", "how to get a car in Berlin".
- Distinct from existing posts: `taxi-in-berlin` covers the metered taxi tariff;
  `alternative-transport-berlin` covers Jelbi, MILES car-share and e-scooters;
  `berlin-night-transport` covers night trains/buses. No existing published post
  or draft covers ride-hailing apps (Uber/Bolt/FreeNow) as the subject. Confirmed
  against quick-summary keys, blog-drafts, and blog-index slugs on 2026-07-10.
- Category: Tourist Tips.
- Slug: `uber-in-berlin`.
- Title (Wix H1): `Does Uber Work in Berlin? Ride-Hailing Apps Explained (2026)`
- SEO title: `Uber in Berlin: How It Works, Bolt & FreeNow (2026)`
- Secondary keywords: does Uber work in Berlin, Uber Berlin airport, Bolt Berlin,
  FreeNow Berlin, ride hailing Berlin, Uber vs taxi Berlin, Uber BER airport.

## Facts + sources (checked 2026-07-10) — see visual-sources.md for detail
- Uber = licensed private-hire (Mietwagen) under PBefG §49, not a taxi. No street
  hails / no ranks. Return-to-base rule (§49(4) Rückkehrpflicht) thins supply.
- Fixed app price (Uber/Bolt) vs regulated meter (taxi/FreeNow, ~EUR 4.30 base).
- Bolt usually cheapest; FreeNow books real Berlin taxis; all 3 at BER Terminal 1
  ground-level Ride App Pick Up zone.
- Costs (2026 estimate): short central hop ~EUR 10-18; BER->centre ~EUR 50-80 app
  vs ~EUR 55-70 metered taxi; FEX/S-Bahn a few euros on one ABC ticket (BER=zone C).
- Tipping optional, round up ~5-10%.
- Sources: uber.com Berlin + BER pages (official), welcomepickups.com,
  berlincitytransfer.de 2026, originalberlintours.com legal guide 2025,
  taxi-heute.de PBefG explainer, tripadvisor Berlin forum.

## Internal links used (>=3)
- /post/berlin-public-transport-explained-for-tourists-u-bahn-s-bahn-tram-bus
- /post/alternative-transport-berlin
- /post/taxi-in-berlin
- /post/berlin-night-transport
- /post/how-to-get-from-berlin-airport-to-alexanderplatz-the-easy-way
- /post/berlin-ab-abc-ticket-zones
- /post/can-you-use-credit-cards-in-berlin-a-tourist-s-guide-to-paying-in-germany
- /post/how-much-should-you-tip-in-berlin-a-simple-guide-to-tipping-in-germany
- /post/berlin-first-time-visitor-mistakes-12-things-to-know-before-you-go
- /book-berlin-walking-tour/berlin-free-walking-tour-tip-based

## External links (official/high-quality, >=2)
- https://www.uber.com/global/en/r/cities/berlin-be-de/ (Uber, official)
- https://www.uber.com/global/en/r/airports/ber/ (Uber, official)

## Widget ideas (>=3), chosen 1
1. CHOSEN — Berlin Ride Reckoner: pick one of five real situations (airport run,
   short central hop, late night, group+luggage, rainy rush hour); the tool shows
   Uber / Bolt / FreeNow-taxi / smart-local-option as animated price-range meters
   on a shared EUR scale, each with an estimated wait and the specific Berlin
   catch, plus a moving "Best value here" badge and a Yusuf "My pick here"
   verdict that changes per scenario. Fresh comparator interaction (animated
   meters + moving verdict), not a picker/checker/timeline clone.
2. Rejected — "Which app is cheapest right now" live price checker: needs live
   pricing APIs; factual-drift and reliability risk.
3. Rejected — PBefG return-to-base explainer animation: educational but does not
   help the reader make the actual decision at the curb.

## Widget slug: berlin-ride-reckoner
- Blog embeds the widget directly from GitHub Pages. BerlinTools catalog card +
  glossy icon + CMS item deferred to Codex (no approved headless image-gen path in
  this routine), same pattern as mauerpark-sunday-timeline.

## Images: 4 real Wikimedia Commons photos (see visual-sources.md), all CC BY-SA,
reader-facing Image Credits block included. Cover = BER Terminal 1 dusk.
