# Weekend in Berlin - 48-Hour Itinerary Production Notes

Run date: 2026-07-15 Europe/Berlin

## SEO brief

- Title: `Weekend in Berlin: A 48-Hour Itinerary That Fits Your Arrival`
- Slug: `weekend-in-berlin-48-hour-itinerary`
- Focus keyword: `weekend in Berlin`
- Secondary keywords: `48 hours in Berlin`, `Berlin weekend itinerary`, `Berlin in two days`, `first weekend in Berlin`
- Search intent: a first-time visitor needs a realistic Friday-evening-to-Sunday plan that adapts to arrival and departure time.
- Category: `Tourist Tips`
- Tags: `Weekend in Berlin`, `48 Hours in Berlin`, `Berlin Itinerary`, `Berlin Trip Planner`, `First Time in Berlin`
- SEO title: `Weekend in Berlin: A Realistic 48-Hour Itinerary`
- Meta description: `Plan a weekend in Berlin around your real arrival time: Friday evening, a central Saturday route, Bernauer Strasse and Mauerpark on Sunday.`
- Excerpt: `A realistic 48-hour Berlin itinerary for Friday-evening or Saturday-morning arrivals, with one central Saturday line, a slower Sunday and no cross-city race.`
- Commercial child: `https://www.berlinwalk.com/berlin-trip-planner`

## Cannibalisation boundary

- Existing live post `what-s-happening-in-berlin-this-weekend-your-ultimate-guide` owns recurring events, live listings and the evergreen weekend-formula intent.
- This article owns the exact `weekend in Berlin` / `48 hours in Berlin` itinerary intent and changes the schedule by real arrival/departure time.
- The separate new `2 days in Berlin` article owns a two-full-days route-map intent. This package uses a temporal arrival board rather than another route map.
- The published `Berlin in 3 days` post remains the three-day itinerary owner.

## Current official source checks

- BVG 24-hour ticket, zones and 24-hours-from-validation rule: https://www.bvg.de/en/subscriptions-and-tickets/all-tickets/24h-tickets/24h-ticket
- Museum Island current planning page and Pergamonmuseum construction closure: https://www.smb.museum/en/museums-institutions/museumsinsel-berlin/plan-your-visit/
- Bundestag dome free admission, prior-registration rule and current closure calendar: https://www.bundestag.de/en/visittheBundestag/dome/registration-245686
- Berlin Wall Memorial site and current indoor/outdoor opening pattern: https://mmg.stiftung-berliner-mauer.de/en/
- Mauerpark Sunday context and karaoke: https://www.visitberlin.de/en/mauerpark
- Mauerpark flea market Sunday 10:00-18:00: https://www.visitberlin.de/en/flea-market-mauerpark
- Sunday shopping exceptions and normal closures: https://www.visitberlin.de/en/shopping-business-hours
- Competing official 48-hour itinerary reviewed for intent differentiation: https://www.visitberlin.de/en/48-hours-berlin

Time-sensitive facts must be rechecked before publication if the review date moves materially beyond 2026-07-15.

## Internal links

- Berlin Trip Planner: https://www.berlinwalk.com/berlin-trip-planner
- Booking: https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based
- Existing weekend guide: https://www.berlinwalk.com/post/what-s-happening-in-berlin-this-weekend-your-ultimate-guide
- Public transport guide: https://www.berlinwalk.com/post/berlin-public-transport-explained-for-tourists-u-bahn-s-bahn-tram-bus
- Berlin ticket zones: https://www.berlinwalk.com/post/berlin-ab-abc-ticket-zones
- Bernauer Strasse guide: https://www.berlinwalk.com/post/berlin-wall-memorial-bernauer-strasse
- Mauerpark Sunday guide: https://www.berlinwalk.com/post/mauerpark-berlin-sunday

## Widget ideas and decision

1. `berlin-weekend-arrival-board`: an arrival/departure clock that moves or removes real Berlin blocks when the usable weekend changes. Chosen because it solves the core timing problem without copying the separate two-day route map.
2. `berlin-weekend-capacity-strip`: a drag-and-drop 48-hour strip with energy costs. Rejected because it asks the visitor to design the itinerary before giving useful Berlin judgment.
3. `sunday-switchboard`: a weather and shopping-closure Sunday alternative tool. Rejected because it solves only one third of the article.

The chosen board is useful enough to become a Berlin Tool after a separate glossy icon and CMS promotion pass. This package keeps it as an article embed and does not wire an incomplete tool card.

## Draft and safety state

- Publish body: `blog-drafts/weekend-in-berlin-48-hours.body.md`
- Body H1: none. Wix owns the public H1.
- Required embeds: `{{quick-summary}}`, `{{widget:berlin-weekend-arrival-board}}`, `{{faq}}`.
- Wix helper defaults to dry run. Its only mutation mode creates an `UNPUBLISHED` draft with `publish: false`; it contains no publish endpoint.
- No live Wix API call was made in this package run.
- No header, footer, shared shell, Velo, global custom code, audio page or main-domain route was changed.
