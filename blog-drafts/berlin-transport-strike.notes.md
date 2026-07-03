# Berlin Transport Strike - Production Notes

Date: 2026-07-03 Europe/Berlin

## Topic Decision

- Chosen topic: `Berlin Transport Strike: What Tourists Should Do When Trains, U-Bahn or Buses Stop`
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

- BVG traffic news/current disruptions: https://www.bvg.de/en/connections/traffic-news
- BVG strike page, checked 2026-07-03: https://www.bvg.de/en/strike
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

1. `Berlin Transport Backup Planner`: traveler selects what is affected, where they are going, deadline pressure and luggage level. Output gives a fallback order, buffer, and official check links. Chosen because it solves the actual reader problem.
2. `Strike Day Timeline Builder`: traveler enters flight/train/tour time and gets a leave-by timeline. Useful, but narrower and more schedule-input heavy.
3. `Operator Split Decoder`: traveler chooses a line (U/S/RE/RB/FEX/bus/tram) and learns which official page to check. Useful, but too small to become a full BerlinTool alone.

Chosen tool: `Berlin Transport Backup Planner`.

## SEO Metadata

- Title: `Berlin Transport Strike: What Tourists Should Do When Trains, U-Bahn or Buses Stop`
- SEO title: `Berlin Transport Strike: Tourist Backup Plan for Disruptions`
- Meta description: `What to do during a Berlin transport strike or disruption: check BVG, S-Bahn and VBB, protect airport timing, choose a backup route and avoid costly tourist mistakes.`
- Excerpt: `A practical tourist guide to Berlin transport strikes and disruptions, with official status links, airport backup rules, and a decision tool for choosing your fastest fallback.`
- Social title: `Berlin Transport Strike? Use This Tourist Backup Plan`
- Social description: `If U-Bahn, S-Bahn, trams or buses stop, this Berlin guide shows what to check first, when to switch modes, and how to protect flights, trains and tours.`
- Tags: `Berlin transport strike`, `Berlin public transport`, `BVG`, `S-Bahn Berlin`, `Berlin tourist tips`, `BER Airport`
- Secondary keywords: `BVG strike`, `S-Bahn disruption Berlin`, `Berlin public transport disruption`, `Berlin airport transport strike`, `VBB app Berlin`.

## Structured Data Plan

- BlogPosting via Wix/SEO script.
- FAQPage via `faq/inject.js` mapping from `berlin-transport-strike` to `berlin-transport-strike`.
- No event/current-strike schema because this is an evergreen guide, not a news article.
