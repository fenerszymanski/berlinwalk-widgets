# Berlin Bike Lanes Tourists - Local Production Notes

Status: local package created; Wix draft can be created after widget/QS/FAQ validation.
Public title: `Berlin Bike Lanes: What Tourists Must Know Before Walking or Riding`
Focus keyword: `Berlin bike lanes`
Slug: `berlin-bike-lanes-tourists`
Category: Tourist Tips
Tool/widget slug: `berlin-bike-lane-reflex-checker`
Supporting map widget slug: `berlin-bike-lane-map`

## Why This Topic

- Inventory checked against Wix posts/drafts, local blog drafts, Quick Summary, FAQ, tools-hub and recent social packs on 2026-06-27.
- Rejected near-duplicate topic: ticket validation, because `do-you-really-need-to-validate-your-ticket-on-berlin-trains` already exists.
- Chosen because it is high-intent and practical for tourists using bikes, scooters, taxis, strollers, luggage, crossings and first-day walking routes.
- Existing related post `alternative-transport-berlin` covers mobility options broadly; this post is a lane/reflex/safety guide with a distinct angle.

## Search Intent

Tourists want to know whether they can walk in Berlin bike lanes, where rented bikes and e-scooters belong, what red lanes mean, and how to avoid annoying or endangering local cyclists and pedestrians.

## Secondary Keywords

- Berlin cycle lanes
- Berlin bike lane rules
- cycling in Berlin tourists
- e-scooter rules Berlin
- Berlin sidewalk cycling
- Berlin bicycle public transport

## Widget Ideas Considered

1. Berlin Bike Lane Reflex Checker - recommended and built.
   - Decision helped: "I am walking/riding/scooting right now; what is the polite/legal move?"
   - Strong enough for BerlinTools because it works as a lightweight city-behavior decision tool, not just an article ornament.

2. Red Lane Scenario Drill - not chosen.
   - Decision helped: identify red-lane/crossing/scooter-parking scenes.
   - Rejected because it is narrower and more quiz-like.

3. Bike vs Train Switcher - not chosen.
   - Decision helped: ride, walk or use public transport with a bike.
   - Rejected because it overlaps existing alternative transport and public transport tools.

## Research Sources

- German Road Traffic Regulations, StVO section 2: https://www.gesetze-im-internet.de/stvo_2013/__2.html
- Federal eKFV section 10: https://www.gesetze-im-internet.de/ekfv/__10.html
- visitBerlin safe cycling tips: https://www.visitberlin.de/en/15-tips-safe-cycling-berlin
- Berlin.de e-scooter guidance: https://www.berlin.de/en/getting-around/electric-scooter-sharing/6654721-5887714-bolt.en.html
- Berlin.de bicycles on public transport: https://www.berlin.de/en/public-transportation/6260186-2913840-bicycles-public-transport-costs-conditio.en.html

## Internal Link Candidates Used

- `https://www.berlinwalk.com/post/alternative-transport-berlin`
- `https://www.berlinwalk.com/post/berlin-public-transport-explained-for-tourists-u-bahn-s-bahn-tram-bus`
- `https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based`

## Publish Gate Note

BerlinTools/tool promotion remains blocked until a dedicated ChatGPT-browser glossy icon can be generated, processed into canonical icon files, uploaded to Wix Media, wired into `tools-hub/data.json`, inserted/updated in BerlinTools CMS, and verified live. No placeholder icon should be used.

## Follow-Up Map Widget

Yusuf requested an additional bike-lane interactive map widget for the same draft, then clarified that the expected result was a classic bike-road/cycleway map, not a handful of example street pins. `berlin-bike-lane-map/` is a supporting article embed, not a separate BerlinTools card. It now uses Leaflet plus live OpenStreetMap/Overpass queries for the visible area, drawing mapped dedicated cycle paths, painted bike lanes, bicycle streets, and shared/designated paths with layer filters and place presets. It keeps the known Wix iframe Leaflet safeguards: no SRI attributes, scoped fallback Leaflet positioning CSS, and repeated `invalidateSize()` calls. It includes a small fallback sample network only if all live Overpass endpoints fail.
