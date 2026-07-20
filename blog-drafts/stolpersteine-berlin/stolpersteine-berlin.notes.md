# stolpersteine-berlin — internal notes (NOT for publish body)

Run: 2026-07-20 late-evening daily-blog run (5th package of the day).

## Topic decision
- Focus keyword: `Stolpersteine Berlin`
- Secondary: `stumbling stones Berlin`, `brass plaques Berlin sidewalk`,
  `Stolperstein meaning`, `Gunter Demnig`, `stumbling stones meaning`
- Search intent: informational — visitors see the brass stones, want to know
  what they are, what the German text says, whether stepping on them is
  disrespectful, where to find them, how to look one up.
- Categories: Berlin History (primary) + Tourist Tips
- Slug: `stolpersteine-berlin` (checked against 242 published slugs, 1 open
  draft, 158 tool slugs, 232 QS keys, 229 FAQ keys — no hit; only passing
  mentions inside berlin-in-3-days refresh draft and holocaust-memorial post)
- Why chosen: today's earlier packages were Tourist-Tips-heavy (2 day trips);
  Berlin History balances. Route-relevant (stones all over Mitte on/near the
  tour route). No overlap with schoneberg-plaque-check (that widget = per-site
  visit planner for Schöneberg plaques; this = inscription reader).

## Widget
- Slug: `stolperstein-reader` — "Stolperstein Reader"
- Interaction: tap through a real inscription line by line (top to bottom, the
  way you read a stone on the street); explanation panel translates each line
  and explains the formula; 3 inscription patterns cover the main fate
  vocabulary; static glossary of fate words below.
- Deliberately NOT: search box + filter chips (berlin-sign-decoder), day/level
  pickers (schoneberg-plaque-check), card grids, calculators.
- hubCategory: CultureLandmarks, type: Guide.

## Widget ideas considered (3+)
1. Stolperstein Reader — line-by-line inscription decoder (CHOSEN: this is the
   actual reader problem — you stand over a stone and cannot read it).
2. Stones-near-you map of dense Mitte locations — rejected: official
   stolpersteine-berlin.de map already does this better; we should link it.
3. "Sponsor a stone" explainer flow (cost, waiting time, research steps) —
   rejected: useful for very few readers, not a daily tool.
4. Name-count timeline (project growth 1996→2026) — rejected: statistics
   dashboard feeling, wrong emotional register for the subject.

## Planned internal links
- /post/holocaust-memorial-berlin
- /post/topography-of-terror-berlin
- /post/jewish-museum-berlin-guide
- /post/schoneberg-berlin (Bayerisches Viertel remembrance signs)
- /post/what-to-do-near-hackescher-markt-after-walking-tour (Otto Weidt area)
- /berlin-walking-tour-route + booking link where natural
- /tools/stolperstein-reader

## Planned external links
- https://www.stolpersteine-berlin.de/en (Berlin coordination office + map)
- https://www.stolpersteine.eu/en/ (Gunter Demnig project)
- Museum Blindenwerkstatt Otto Weidt (Rosenthaler Str. 39)

## Voice guardrails
- First-person singular, no em dashes, no `we/our`.
- Tone: sober, concrete, not sentimental-performative. No gamification words
  ("quiz", "play", "score") anywhere near this subject.
- Tour duration wording: `2 hours` / `~2h` only.
