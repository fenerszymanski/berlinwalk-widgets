# Berlin Public Transport Ferries - Draft Notes

Internal handoff notes for Yusuf. Public article body lives in `berlin-public-transport-ferries.body.md`.

## Topic Plan

- Title/H1: `Berlin Public Transport Ferries: The Cheap Boat Ride Tourists Miss`
- Focus keyword: `Berlin public transport ferries`
- Search intent: tourists deciding whether BVG ferries are a cheap boat ride, which route to choose, what ticket works, and whether they replace a Spree cruise.
- Slug: `berlin-public-transport-ferries`
- Primary category: `Tourist Tips`
- Tags: `Berlin public transport`, `BVG ferries`, `Wannsee`, `Müggelsee`, `Berlin boat trips`
- SEO title: `Berlin Public Transport Ferries: Cheap BVG Boat Guide`
- Meta description: `Berlin public transport ferries guide: choose the right BVG ferry, check tickets, bikes, F10 Wannsee, F24 rowboat and cruise alternatives for 2026.`
- Excerpt: `A practical guide to Berlin public transport ferries: which BVG ferry tourists should choose, what tickets work, when F10 is worth it, and when a Spree cruise is better.`
- Social title: `Berlin Public Transport Ferries Tourists Miss`
- Social description: `A cheap water moment in Berlin, if you choose the right BVG ferry and check the current timetable first.`
- Canonical: `https://www.berlinwalk.com/post/berlin-public-transport-ferries`

## Dedupe Rationale

- Existing live post `Tickets for Berlin Boat Tours & Spree Cruises` covers paid sightseeing cruises. New angle is distinct: BVG public transport ferries, normal transit tickets, and route choice.
- Existing transport content covers U-Bahn/S-Bahn/tram/bus tickets and calculators. This post narrows to ferries and ferry-specific mistakes.
- API/local inventory found no existing blog/tool for `layover`, `BVG ferry`, `F10`, `F23`, `F24`, or `Berlin public transport ferries`.

## Widget Ideas Considered

1. `Berlin Public Transport Ferry Picker` - choose F10/F11/F12/F21/F23/F24 by starting area, season/day, time, bike need and trip goal.
2. `F10 Cheap Boat Ride Planner` - build a Wannsee to Kladow half-day plan only.
3. `BVG Ferry vs Tourist Cruise Comparator` - decide between a transit ferry and a paid sightseeing boat.

Recommendation: build `Berlin Public Transport Ferry Picker`. It is broad enough to live as a Berlin Tool, supports the post's main decision, and does not duplicate the existing boat-tour guide.

## Research Sources Checked 2026-06-25

- BVG ferry overview: https://www.bvg.de/de/verbindungen/netzplaene-und-linien/faehre
  - Current overview lists downloadable ferry lines F10, F11, F12, F21, F23 and F24.
- BVG F10 page: https://www.bvg.de/en/connections/route-overview/f10
  - Route: S Wannsee to Alt-Kladow, about 20 minutes.
- BVG F10 PDF valid from 2025-12-14: https://www.bvg.de/dam/jcr%3Ae2b24f91-662b-4185-849b-b428598db15e/F10_2025-12-14.pdf
  - Notes: fog/ice can stop service; leave ferry after crossing; short-trip fare does not apply; bike carriage only if space and crew permits; 2026 summer/winter windows and hourly pattern.
- BVG F11 PDF valid from 2025-12-14: https://www.bvg.de/dam/jcr%3A8dc698ad-a27c-44fe-98b0-c0fd4af79364/F11_2025-12-14.pdf
  - Route: Wilhelmstrand to Baumschulenstr./Fähre, about 2 minutes.
- BVG F12 PDF valid from 2025-12-14: https://www.bvg.de/dam/jcr%3A70da308f-ee7a-4802-996b-4e4a7117fb87/F12_2025-12-14.pdf
  - Route: Wendenschloß/Müggelbergallee to Grünau/Wassersportallee, about 2 minutes.
- BVG F21 PDF valid from 2025-12-14: https://www.bvg.de/dam/jcr%3A4936c783-097d-4d70-8422-51095c8f4c67/F21_2025-12-14.pdf
  - Route: Krampenburg to Schmöckwitz/Zum Seeblick, about 7 minutes; 2026 season 03 Apr to 01 Nov; no Monday service in listed pattern.
- BVG F23 PDF valid from 2025-12-14: https://www.bvg.de/dam/jcr%3Adde9cf0f-c073-4440-9213-74b4ff241a41/F23_2025-12-14.pdf
  - Route around Müggelwerderweg/Müggelhort/Neu Helgoland/Kruggasse, about 25 minutes; 2026 season 03 Apr to 01 Nov; no Monday service in listed pattern.
- BVG F24 PDF valid from 2025-12-14: https://www.bvg.de/dam/jcr%3A213321fc-9ccb-4c42-8e3b-9af7764c2a23/F24_2025-12-14.pdf
  - Route: Spreewiesen to Kruggasse, about 5 minutes; 2026 season 01 May to 04 Oct; weekends/public holidays only in listed pattern.
- Berlin.de ferries page: https://www.berlin.de/en/public-transportation/ferries/
  - Useful English tourist framing: most ferries are operated by BVG and usable with a Berlin public transport ticket; F10 popular with excursionists; line descriptions for F11/F12/F21/F23/F24.
- BVG ticket overview: https://www.bvg.de/en/subscriptions-and-tickets/all-tickets
  - Adult single ticket from EUR 4.00; 24-hour ticket from EUR 11.20; bicycle ticket from EUR 2.70.
- BVG bicycle page: https://www.bvg.de/en/bicycle
  - Bikes allowed on ferries only with valid fare unless exempt; carriage depends on space; bicycle short-trip ticket not valid on F10.
- BVG tourism water page: https://www.bvg.de/en/tourists/with-the-bvg-to-the-water
  - Alt-Kladow/Gatow and Havel context for F10.

## Internal Link Candidates

- https://www.berlinwalk.com/post/tickets-boat-tours-river-cruises-berlin
- https://www.berlinwalk.com/tools/transport-ticket-calculator
- https://www.berlinwalk.com/post/berlin-public-transport-explained-for-tourists-u-bahn-s-bahn-tram-bus
- https://www.berlinwalk.com/post/berlin-lakes-guide-2026
- https://www.berlinwalk.com

## Structured Data Plan

- Wix SEO tags: title, description, canonical, robots `index, follow, max-image-preview:large`, Open Graph/Twitter tags and BlogPosting JSON-LD.
- FAQ schema: generated by `faq/inject.js` from `faq/data.json` via slug map key `berlin-public-transport-ferries`.
- Widget/tool schema: BerlinTools CMS item should include WebApplication JSON-LD for `Berlin Public Transport Ferry Picker`.

## Handoff Checks

- Public body includes `{{quick-summary}}`, `{{widget:berlin-public-transport-ferry-picker}}`, and `{{faq}}`.
- Public body does not include private source notes.
- Public body uses first-person singular where BerlinWalk guide voice appears.
- No paid image-generation API used for article visuals.
