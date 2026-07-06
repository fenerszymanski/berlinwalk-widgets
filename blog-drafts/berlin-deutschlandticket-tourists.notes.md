# Deutschlandticket Berlin Tourists Draft Notes

Run date: 2026-07-06 Europe/Berlin

## Topic Decision

- Title: `Deutschlandticket for Berlin Tourists: When the 63 EUR Ticket Makes Sense`
- Slug: `deutschlandticket-berlin-tourists`
- Focus keyword: `Deutschlandticket Berlin tourists`
- Category: `Tourist Tips`
- Search intent: tourists planning Berlin transport who are unsure whether the national Germany ticket is a bargain, a subscription trap, or irrelevant for a short city break.
- Dedupe result: existing BerlinWalk content covers Berlin public transport generally, AB/ABC zones, WelcomeCard, airport arrival/departure, ticket validation, ticket fines and Museum Pass. No dedicated live post targets the Deutschlandticket-as-tourist decision. Existing `transport-ticket-calculator` mentions subscriptions, but this draft focuses on the monthly cancellation/admin decision and regional-trip use case.

## Metadata Plan

- SEO title: `Deutschlandticket Berlin Tourists: 63 EUR Guide`
- Meta description: `Deutschlandticket Berlin tourists guide: when the 63 EUR monthly Germany ticket makes sense, when normal Berlin tickets are easier, and how to avoid subscription mistakes.`
- Excerpt: `A practical guide for Berlin tourists deciding whether the 63 EUR Deutschlandticket is worth it for airport rides, city transport, Potsdam, regional trains and subscription timing.`
- Categories: `Tourist Tips`
- Tags: `Deutschlandticket Berlin`, `Germany Ticket`, `Berlin Transport`, `Berlin Tourist Tips`, `Public Transport Berlin`, `Regional Trains Germany`, `Berlin Tickets`, `D-Ticket`
- Structured data: BlogPosting + FAQPage from `faq/data.json` key `berlin-deutschlandticket-tourists`.

## Widget Ideas Considered

1. Subscription Clock: traveler sets trip length, transport days, regional days and cancellation timing; output is Skip / Consider / Strong with a monthly-risk rail. Chosen because the real reader problem is the 63 EUR vs 10th-of-month subscription decision.
2. Local-vs-Long-Distance Route Splitter: user chooses destinations like BER, Potsdam, Dresden, Leipzig and learns whether the route is local/regional or long-distance. Useful, but narrower and overlaps the article's route examples.
3. Group Ticket Trap Table: compares individual Deutschlandtickets with Berlin small-group 24-hour tickets. Useful, but too limited to become a standalone Berlin Tool.

Chosen: Subscription Clock, slug `berlin-deutschlandticket-checker`, public title `Berlin Deutschlandticket Checker`.

## Official Research Sources

- Deutsche Bahn Deutschland-Ticket: https://int.bahn.de/en/offers/regional/deutschland-ticket
  - Checked 2026-07-06.
  - 63 EUR per month.
  - Valid nationwide on local public transport and regional rail in 2nd class.
  - Not valid on ICE, IC or EC long-distance trains.
  - Personal/non-transferable subscription.
  - Cancellation by the 10th can end at the end of the current month; after the 10th ends at the end of the following month.
- BVG Deutschland Ticket: https://www.bvg.de/en/subscriptions-and-tickets/subscriptions/deutschland-ticket
  - Checked 2026-07-06.
  - Germany-wide monthly payment 63 EUR.
  - Valid for public and regional transport in Germany.
  - Not valid on long-distance trains like IC, EC and ICE.
  - Any number of journeys.
- BVG new-customer Deutschland Ticket page: https://www.bvg.de/en/deutschland-ticket
  - Checked 2026-07-06 through search/readback.
  - 63 EUR/month and cancellation link/info.
  - VBB-area dog carry rule differs from nationwide rule.
- VBB Deutschlandticket general info: https://www.vbb.de/en/tickets/abonnements/translate-to-english-deutschlandticket/general-information-about-the-deutschlandticket/
  - Checked 2026-07-06 through search/readback.
  - Local public transport Germany-wide; 63 EUR/month personal subscription.
  - No nationwide extra people, dogs or bicycles free except children under 6; VBB dog exception noted.
- Berlin.de tickets/fares: https://www.berlin.de/en/public-transportation/1772016-2913840-tickets-fares-and-route-maps.en.html
  - Checked 2026-07-06.
  - AB single 4 EUR, ABC single 5 EUR.
  - AB 24-hour 11.20 EUR, ABC 24-hour 12.90 EUR.
  - 24-hour small group up to 5 people: AB 35.30 EUR, ABC 37.70 EUR.
  - Fare zone ABC includes Berlin's surrounding area, BER Airport and Potsdam Central Station.

## Internal Links Used

- `/post/berlin-ab-abc-ticket-zones`
- `/tools/transport-ticket-calculator`
- `/tools/welcomecard-calculator`
- `/post/sachsenhausen-from-berlin`
- `/book-berlin-walking-tour/berlin-free-walking-tour-tip-based`

## Assets

- Body: `berlin-deutschlandticket-tourists.body.md`
- Visual sources: `images/berlin-deutschlandticket-tourists/visual-sources.md`
- Contact sheet: `images/berlin-deutschlandticket-tourists/assets/contact-sheet/berlin-deutschlandticket-tourists-contact-sheet.jpg`
- Widget: `../berlin-deutschlandticket-checker/index.html`
- Tool icon: `../tools-home/icons/berlin-deutschlandticket-checker.png`

## AI Visual Use

- Article images: no AI visuals, only previously accepted Wikimedia Commons assets copied into this package.
- BerlinTools icon: one built-in Codex image generation output. No paid API or CLI generation.
- Widget hero/primary visual: real S-Bahn/Hauptbahnhof article image, not AI and not code-drawn.
