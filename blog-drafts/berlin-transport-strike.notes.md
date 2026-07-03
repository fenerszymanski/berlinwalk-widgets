# Berlin Transport Strike - Production Notes

Date: 2026-07-03 Europe/Berlin
Rewrite pass: 2026-07-03 Europe/Berlin after Yusuf chose the Gemini + Walkative-style project voice. Old body/widget language was replaced rather than lightly edited.

## Topic Decision

- Chosen topic: `Berlin Transport Strike: How to Keep Moving When Trains Stop`
- Focus keyword: `Berlin transport strike`
- Slug: `berlin-transport-strike`
- Category: `Tourist Tips`
- Tool/widget slug: `berlin-transport-backup-planner`
- Why this is distinct: BerlinWalk already has broad public transport, AB/ABC, night transport, airport departure, taxi, alternative transport, accessibility and "what to book in advance" posts. This angle is specifically about disruption/strike decision-making: identify the affected operator, protect airport/train timings, choose a fallback mode, and avoid chasing bad connections.

## Dedupe Notes

- Existing/nearby live posts checked through Wix/API/local sources:
  - `berlin-public-transport-explained-for-tourists-u-bahn-s-bahn-tram-bus`
  - `berlin-ab-abc-ticket-zones`
  - `berlin-night-transport`
  - `alternative-transport-berlin`
  - `taxi-in-berlin`
  - `berlin-hauptbahnhof-guide`
  - `berlin-ber-airport-departure-guide`
  - `berlin-last-day`
  - `berlin-accessibility`
  - `can-you-use-credit-cards-in-berlin-a-tourist-s-guide-to-paying-in-germany`
- Rejected near-duplicate idea: `cash in Berlin` because the live FAQ/slug map already has a credit-card/cash payment post.

## Source URLs

- BVG traffic news/current disruptions, rechecked 2026-07-03: https://www.bvg.de/en/connections/traffic-news
- BVG strike page, rechecked 2026-07-03: https://www.bvg.de/en/strike (`Currently, no strikes are announced at the BVG.`)
- BVG connection search/traffic news overview: https://www.bvg.de/en/connections
- S-Bahn timetable changes and disruptions: https://sbahn.berlin/en/plan-a-journey/timetable-changes/
- S-Bahn reasons for disruptions: https://sbahn.berlin/en/plan-a-journey/timetable-changes/reasons-for-disruptions/
- S-Bahn plan-a-journey real-time/disruption note: https://sbahn.berlin/en/plan-a-journey/
- S-Bahn passenger rights: https://sbahn.berlin/en/tickets/the-vbb-fare-explained/passenger-rights/
- VBB overview for fare/journey planning/airport links: https://www.vbb.de/en/
- VBB app page with real-time forecasts, roadworks, timetable changes and delays: https://www.vbb.de/en/driving-information/apps/vbb-app-bus-bahn/
- BER official public transport page: https://ber.berlin-airport.de/en/orientation/getting-here/public-transport.html
- BER public-transport travel advisory, updated 2026-06-05: https://ber.berlin-airport.de/en/news/reisehinweise-oeffentlicher-nahverkehr.html
- DB passenger rights page: https://int.bahn.de/en/booking-information/passenger-rights
- DB passenger rights claim form: https://int.bahn.de/en/help/contact/passengers-rights-claim-form

## Article Plan

- Quick Summary near top.
- Explain operator split: BVG controls U-Bahn/tram/bus/ferry; S-Bahn/regional rail are different systems.
- Give a "15-minute rule": if the app shows a simple delay, wait; if multiple cancellations or operator-wide disruption, switch mode early.
- Airport rule: do not rely on the last possible rail connection to BER. Check FEX/regional/S-Bahn/bus alternatives and move taxi fallback earlier than normal if a flight is involved.
- Ticket/refund rule: keep screenshots and ticket receipts; passenger-rights claims are possible for DB/S-Bahn/regional/long-distance contexts, while everyday city delays usually need realistic expectations.
- Tour connection: BerlinWalk route starts at Alexanderplatz and ends near Hackescher Markt; both have multiple transport modes, but during disruption days guests should leave extra time.

## Widget Ideas

1. `Berlin Transport Backup Planner`: traveler chooses what needs saving first: central sightseeing, BER, Hauptbahnhof/onward train, or BerlinWalk tour start. Output gives a route-first move: walk the centre, switch transport layers, or protect a hard deadline. Chosen because it matches the rewritten article's actual reader problem.
2. `Strike Day Timeline Builder`: traveler enters flight/train/tour time and gets a leave-by timeline. Useful, but narrower and more schedule-input heavy.
3. `Operator Split Decoder`: traveler chooses a line (U/S/RE/RB/FEX/bus/tram) and learns which official page to check. Useful, but too small to become a full BerlinTool alone.

Chosen tool: `Berlin Transport Backup Planner`.
Rewrite implementation: old widget UI was replaced with a new photo-led route board, `data-version="20260703b"`. Local Playwright proof after rewrite: desktop 1280px height about 2186 root / overflow 0; blog-width 740px height about 2354 root / overflow 0; narrow mobile 236px longest BER+hard-deadline state about 2822 root / overflow 0. Draft/widget embed height raised to `2950`.

## SEO Metadata

- Title: `Berlin Transport Strike: How to Keep Moving When Trains Stop`
- SEO title: `Berlin Transport Strike: How Tourists Can Keep Moving`
- Meta description: `Berlin transport strike guide for tourists: check the right operator, turn central delays into walks, protect BER timing, and choose a realistic backup without panic.`
- Excerpt: `A calm Berlin guide to transport strikes and disruptions, with official status links, central walking fallbacks, BER airport timing, and a route-first backup tool.`
- Social title: `Berlin Transport Strike? Keep the Day Moving`
- Social description: `A local Berlin guide to checking the right transport layer, turning central delays into walks, and protecting airport or tour timing without panic.`
- Tags: `Berlin transport strike`, `Berlin public transport`, `BVG`, `S-Bahn Berlin`, `Berlin tourist tips`, `BER Airport`
- Secondary keywords: `BVG strike`, `S-Bahn disruption Berlin`, `Berlin public transport disruption`, `Berlin airport transport strike`, `VBB app Berlin`.

## Structured Data Plan

- BlogPosting via Wix/SEO script.
- FAQPage via `faq/inject.js` mapping from `berlin-transport-strike` to `berlin-transport-strike`.
- No event/current-strike schema because this is an evergreen guide, not a news article.
