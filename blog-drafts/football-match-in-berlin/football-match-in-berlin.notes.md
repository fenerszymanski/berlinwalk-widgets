# football-match-in-berlin — package notes

## Topic and why

Focus keyword: **football match in Berlin**. Category: **Tourist Tips**.
Secondary keywords: Union Berlin tickets, Hertha BSC tickets Olympiastadion, Stadion An der Alten Försterei, Bundesliga tickets Berlin.

Dedupe scan on 21 July 2026 across 243 published Wix posts, 1 open draft (Dresden), 159 existing tool slugs, 233 Quick Summary keys and 230 FAQ keys: **no football, Union, Hertha, Bundesliga, stadium or matchday content existed at any layer.** The only adjacent posts are `olympiastadion-berlin` (the stadium as a sightseeing visit, not matchday or ticketing) and `where-to-watch-2026-world-cup-in-berlin` (public screenings). Both are complementary and `olympiastadion-berlin` is linked from the body.

The angle is the inversion most visitors get wrong: Hertha is the familiar name but the second-division club, Union is the Bundesliga club in a 22,012-capacity ground that sells out. Layered on top is a genuinely time-bound fact: 2026/27 is the last season at the Alte Försterei before it is rebuilt.

## Widget

`berlin-matchday-board` — a season rail, August 2026 to May 2027, with every home fixture for Union, Hertha and Union Frauen plotted on its actual match weekend. The reader sets their travel dates; the rail highlights the window and the matching fixtures expand into ticket route, transport route, gate timing and price.

Deliberately **not** a picker, checker, calculator or situation-card surface. The interaction is a timeline intersected with a travel window, and its distinguishing feature is honesty: a fixture only shows a kickoff time when a club has actually confirmed one, and the verdict line reports how many of the games in the window are still weekend-only. That reflects the article's real finding, which is that a Berlin matchday cannot be pinned down months ahead.

Data lives in `berlin-matchday-board/fixtures-data.js`, sourced from the official DFL fixture PDFs. See `research-report.md`.

Three widget ideas considered:
1. A ticket-difficulty checker per club. Rejected: it is a two-row answer, and it is a picker pattern already used elsewhere.
2. A stadium section/terrace map. Rejected: no licensable seat-map data, and it would have been code-drawn, which the standard forbids.
3. The season board. Chosen: it is the only one that answers the reader's actual question, which is date-shaped.

## Widget QA

- 238 travel-window combinations swept programmatically across the season against an independent re-implementation of the filter: **0 mismatches** in card count and verdict count, empty-state included.
- Data integrity: 0 bad team or ground references, 0 reversed windows, 0 fixtures carrying a time without a weekday. 17 Union + 17 Hertha + 1 Frauen = 35.
- Conditional blocks gate correctly: the Weihnachtssingen note appears only when 23 December is in the window, the last-season note only when a Union men's fixture is in view.
- 390px: horizontal overflow 0, document scrollWidth equals clientWidth, console errors 0. Rail scrolls horizontally inside its own container by design.
- Primary controls (two date inputs, one button) are all at least 44px. Rail pips are a 15px visual with a 34px-tall tap area; they are a shortcut, and the widget is fully usable without touching one.
- One real bug caught and fixed during QA: the results-container class `.out` collided with the pip dim-state class `.out`, which inflated every dimmed pip to 39x27px. Renamed to `.results` and `.dim`.

## Images

9 images, all Wikimedia Commons, all licence-verified per file through the Commons API. 15 candidates downloaded, 2 contact sheets reviewed by eye, 8 rejected with reasons recorded in `visual-sources.md`.

Cover is the packed Olympiastadion supporters' display: it reads as football instantly at listing-card size, which the empty-stadium and aerial options do not.

Rejected on editorial rather than legal grounds: the packed floodlit Olympiastadion night shot, because it is an athletics event and would have been misleading in a football article; and the 2019 promotion photo, because the pitch is churned to sand.

Contact-sheet review caught the stadium-sign master rendering upside down after PIL dropped EXIF orientation. Re-exported with `exif_transpose`.

Seven of nine images need attribution, so the post carries a reader-facing Image Credits block.

## Draft QA

Wix draft `d94ac01f-eb83-417a-8a83-71813f97b909`, edit URL in `football-match-in-berlin.wix.json`.

- status `UNPUBLISHED`, body H1 count **0**, 10 H2, 9 images, 9 caption-style paragraphs (12px, italic, centred, line-height 1.45), 3 embeds, 16 SEO tags, 1 category, 3 tags, 3 bullet lists, 17 bold runs.
- 9 body links, all HTTP 200 after two 404s were caught and corrected (`herthabsc.com/en/tickets/tickets` and `bvg.de/en/tickets-and-fares` both 404; replaced with the working `/de/tickets/tickets` and `/en/tickets`). 4 internal BerlinWalk links, 4 official external links, 1 booking link. The 4 Creative Commons licence links in the Image Credits list also return 200.
- Leak-phrase scan: 0. Em dashes: 0. Collective `we/our/us`: 0. No `1h45`.
- `node scripts/validate-blog-publish-body.mjs`: OK.
- Meta description 156 characters, SEO title 58.

## Deliberately left out

The transport-warning angle this package started from turned out to be false, and the Stadtbahn closure does not affect either matchday route. Several other tempting facts were dropped for lack of a primary source. All of it is recorded in `research-report.md` so the next agent does not re-chase them.

## State

Blog post stays **UNPUBLISHED** pending Yusuf's approval. The tool page `/tools/berlin-matchday-board` and its icon are complete and live, which is separate from the post.
