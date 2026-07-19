# Production notes — oktoberfest-in-berlin

Daily blog run 2 of 3, 2026-07-19 (~12:05 CEST).

## Topic selection

Dedupe list built from: 233 live Wix published posts (API query), 2 open
UNPUBLISHED drafts (`berlin-ubahn-etiquette` from this morning's 07:05 run,
`is-berlin-walkable`), 150 `tools-hub/data.json` slugs, and 306 local
`blog-drafts/` entries.

Nothing published or drafted covers Oktoberfest, Munich, the Berlin beer
festival, or the autumn funfair. The closest neighbours are
`berlin-beer-gardens-guide` (published) and `what-is-a-spati-berlin`
(published); this post links to both rather than repeating them, and its search
intent is different: people typing "Oktoberfest in Berlin" want a yes/no answer
about a specific festival, not a venue list.

Category chosen: **Berlin Myths**. Recent daily runs have been heavily Tourist
Tips (U-Bahn etiquette, walkable, emergency numbers, smoking, car), so this
rebalances. Timing also argues for it: the post indexes in July, ahead of the
September/October search spike.

## Focus keyword and SEO

- Focus keyword: `Oktoberfest in Berlin`
- Secondary: `Berlin Oktoberfest 2026`, `Berliner Herbstrummel`,
  `Berlin beer festival`, `Berliner Weisse`, `Berlin beer garden`
- Intent: informational, decision-shaped ("is it worth going / is it real")
- Slug: `oktoberfest-in-berlin` (no collision)

## Fact check (all verified 2026-07-19)

| Claim | Source |
|---|---|
| Berliner Herbstrummel 25 Sep - 25 Oct 2026, Zentraler Festplatz, free entry | berliner-festplatz.de event calendar + berlin.de event page (two independent sources agree) |
| Address Kurt-Schumacher-Damm 207, 13405 Berlin; bus M21 / X21 | berlin.de event page |
| berlin.de lists a separate "Oktoberfest Berlin" at the same fairground with a Paulaner tent, **2026 dates not yet published** | berlin.de |
| Internationales Berliner Bierfestival 7-9 Aug 2026, 30th edition | festivalsindeutschland.de listing |
| Karl-Marx-Allee, Strausberger Platz to Frankfurter Tor, ~2.2 km, ~300 breweries, 18 stages, free entry, pay per stall, U5 | same |
| Munich Oktoberfest 2026: 19 Sep - 4 Oct, 191st, Theresienwiese | oktoberfest.de / munichtourism.org |
| Prater Garten, Kastanienallee 7-9, same courtyard since 1837, ~600 seats | berlin.de beer gardens + visitBerlin |
| Café am Neuen See, Tiergarten, since 1896 | visitBerlin |
| Zollpackhof, Augustiner from wooden barrels, opposite the Chancellery | visitBerlin / berlin.de |
| Berliner Weisse: 19th-century most popular drink in Berlin, hundreds of breweries, two left by end of 20th century | Wikipedia (Berliner Weisse), Oxford Companion to Beer |

**Deliberate hedge:** the body does not claim the Oktoberfest-branded Paulaner
tent is confirmed for 2026, because berlin.de shows "date not yet known". The
body instead states the confirmed fairground window and describes what the event
actually is. The widget footer repeats "confirm before you book a trip around
one".

## Widget

`berlin-beer-season-calendar` — a date-range **overlap timeline**, deliberately
not a picker/checker/quiz/card-grid.

The reader problem is temporal, not categorical: "I am in Berlin on these dates,
is any of this on?" So the interface is the timeline itself. Two date inputs
paint a yellow trip band across a Jul-Nov 2026 Gantt strip; three event bars
(Berlin Beer Festival, Munich Wiesn drawn in dashed grey as *not here*, Berlin
autumn funfair) show what the band crosses. Below, a verdict panel rewrites
itself per overlap, and an always-on beer-garden block catches every set of
dates that matches nothing.

Design notes:
- Event labels sit **outside** the bars so a 3-day window is as readable as a
  30-day one; labels flip to the left past 62% so they never run off the track.
- The timeline scrolls horizontally under 620px and auto-centres on the trip
  band, so mobile readers do not land parked on July.
- Munich uses a dashed grey hatch and a `600 KM AWAY` pin so the "not in Berlin"
  point is visual, not just textual.

QA: desktop 1280px and mobile 390px, no console errors, `document.scrollWidth`
equals viewport at 390px (no horizontal page overflow), verdict + hit cards
verified in both the overlap and no-overlap states. Content height 1346px
desktop / 1966px mobile, so `embedHeight` 2020.

## Images

5 Wikimedia Commons photographs, all CC BY-SA, public Image credits block
required. See `oktoberfest-in-berlin.visual-sources.md` for the contact-sheet
judgment and rejection notes.

## Internal / external links

Internal: `/post/best-day-trips-from-berlin`, `/post/berlin-beer-gardens-guide`,
`/post/what-is-a-spati-berlin`, `/post/berlin-in-september-2026`,
`/post/berlin-in-october-2026`, `/book-berlin-walking-tour/berlin-free-walking-tour-tip-based`.

External: `oktoberfest.de/en`, `berlin.de` Herbstrummel event page (also linked
from inside the widget), `berlin.de` events index.

## Tour connection

Real route logic, not a sales block: the tour ends at Hackescher Markt, and the
M1 tram from there runs straight to Eberswalder Straße for Prater Garten.
Oldest part of Berlin to oldest beer garden in Berlin in about twenty minutes.
