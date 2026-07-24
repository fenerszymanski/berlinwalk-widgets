# Telling Time in German (Berlin) — internal notes

Drafted 2026-07-25 (Europe/Berlin). Daily blog draft automation run.

## Topic decision

- **Title:** Telling Time in German: Why Halb Acht Is 7:30 and How Berlin Says the Rest
- **Slug:** `telling-time-in-german-berlin`
- **Focus keyword:** telling time in German
- **Secondary:** halb acht meaning, German time expressions, dreiviertel neun, 24-hour clock Germany, Öffnungszeiten Uhr, letzter Einlass
- **Category:** German Language. **Tags:** German Language, Tourist Tips.
- **QS/FAQ key:** `telling-time-in-german-berlin`
- **Widget/tool slug:** `german-time-dial`

### Dedupe evidence (2026-07-25)

- 257 published Wix posts, 4 UNPUBLISHED drafts (all 2026-07-24 sibling packages:
  oberbaumbruecke-berlin, hamburg-day-trip-from-berlin, berlin-courtyards-hoefe,
  reichstag-before-and-after), 175 tools-hub slugs, 251 Quick Summary keys,
  361 FAQ shards scanned.
- Existing German Language posts cover words, phrases, numbers, signs, menus,
  station-name pronunciation, slang, café/bakery/döner ordering, Entschuldigung.
  **None covers telling the time.** Grep for `halb acht|halb zwölf|dreiviertel|
  viertel nach|viertel vor` across `blog-drafts/`, `faq/data*`,
  `quick-summary/data*` and `blog-drafts/_refresh/` returned zero hits.
- `german-numbers-for-tourists-berlin` H2s are: the reversal rule, prices,
  cents/Pfand, spoken platform/line numbers, counters, ticket machines, 1-100,
  do you need it. No clock section, so the two posts complement rather than
  overlap.
- `german-signs-in-berlin` covers station/ticket/shop/bottle/safety signs. Its
  only time-adjacent line is `geöffnet` / `geschlossen`. No Uhr/Einlass/day-code
  section.
- The World Clock itself is already covered by
  `/post/the-weltzeituhr-why-alexanderplatz-has-a-world-clock`, so this post uses
  it as cover image plus internal link only, and keeps the clock-landmark
  section short. The Berlin-Uhr (Mengenlehreuhr) has no existing coverage.

### SERP answerability verdict

- **Rejected form:** "what does halb acht mean" / "halb acht meaning". Google
  answers that in one word (7:30) inside the result page.
- **Accepted reframe:** the whole system a visitor has to operate: spoken twelve
  vs written twenty-four, halb counting forward, the eastern-German
  viertel/dreiviertel that is alive around Berlin, the Mo/Di/Mi/Do/Fr/Sa/So day
  codes on a door, and Einlass vs letzter Einlass. Plus a dial you turn.
- **Why it cannot fit a SERP box:** the answer is a set of conversions plus
  judgment about which form you will actually hear and what a written line
  commits you to. A snippet can define one phrase; it cannot stop you booking
  the wrong hour or arriving after last admission.

## Fact check (all verified 2026-07-25 unless noted)

| Fact | Source |
|---|---|
| `halb acht` = 7:30; German names the half hour by the coming hour | standard German; cross-checked against Bastian Sick column + Transparent German blog |
| `viertel nach acht` (8:15) / `viertel vor neun` (8:45) understood everywhere | atlas-alltagssprache.de/uhrzeit/, runde-7/f11e |
| `viertel neun` = 8:15 and `dreiviertel neun` = 8:45 in a broad central/eastern band from Baden-Württemberg via Thuringia up to Brandenburg; the old inner-German border is visible on current maps | https://www.atlas-alltagssprache.de/runde-7/f11e/ ; https://www.atlas-alltagssprache.de/uhrzeit/ |
| `zehn vor halb neun` (8:20) style counting from the half hour is normal in eastern Germany, Bavaria and Austria | same atlas commentary + alleantworten summary |
| Written German uses the 24-hour clock: `Mo geschlossen`, `Di 10:00 - 18:00 Uhr` | https://www.smb.museum/museen-einrichtungen/neues-museum/besuch-planen/ (German page, read 2026-07-25) |
| Museum Island state museums close Monday; Neues Museum Tue-Sun 10:00-18:00 | https://www.smb.museum/en/plan-your-visit/opening-hours/ |
| Weltzeituhr: designed by Erich John, unveiled 30 September 1969, 24 time-zone cylinder, ~148 cities, about 10 m tall, built with volunteer "Feierabendbrigaden", solar-system model on top | https://en.wikipedia.org/wiki/World_Clock_(Alexanderplatz) ; https://www.berlin.de/en/attractions-and-sights/3561749-3104052-world-clock.en.html ; http://www.weltzeituhr-berlin.de/en/urania-worldtimeclock |
| Berlin-Uhr / Mengenlehreuhr: first public clock to tell time with illuminated coloured fields, Guinness entry on installation 17 June 1975, designed by Dieter Binninger, commissioned by the Berlin Senate, originally Kurfürstendamm at Uhlandstraße in West Berlin, decommissioned 1995, now on Budapester Straße in front of the Europa-Center; 24 light fields (1+4+4+11+4) | https://en.wikipedia.org/wiki/Mengenlehreuhr |
| Clock change 2026: forward 29 March (02:00 to 03:00), back 25 October (03:00 to 02:00); Berlin CET/CEST | https://www.timeanddate.com/time/change/germany/berlin?year=2026 |
| Reichstag dome visit runs on booked time slots, daily 08:00 to 24:00, last entry 21:45 | bundestag.de, verified in the 2026-07-24 Reichstag package |

## Widget decision

Three ideas considered:

1. **German Time Dial** (built). A real clock face whose minute hand you drag.
   The board shows the written 24-hour time, the spoken colloquial phrase, the
   formal `... Uhr ...` form, the eastern alternative where one exists, and a
   yellow warning strip only when the German names an hour that has not arrived.
2. Reservation rescue: type the time you were told and the time you assumed,
   get the gap in minutes. Rejected: a two-field calculator, and the existing
   BerlinTools set is already calculator-heavy.
3. Opening-hours decoder: paste a German `Öffnungszeiten` line, get a verdict.
   Rejected: too close to the existing `berlin-sign-decoder` and
   `berlin-rail-decoder` surfaces.

Freshness check against the four most recent daily widgets: not the
Oberbaumbrücke scrubber, not the Hamburg fit-bar, not the courtyard SVG route
map, not the Reichstag strata bands. A draggable dial with live language output
is a new interaction model for the repo. The clock face is a functional
instrument, not a drawn illustration, and the widget renders no photographs, so
there is no tool visual credit to carry.

## QA log

- Phrase engine swept over all 24 hours x 12 five-minute steps: 0 unresolved
  placeholders, 0 bare `ein` outside `ein Uhr`, 0 undefined. Spot checks include
  01:00 `ein Uhr` / `Punkt eins`, 00:30 `halb eins`, 12:30 `halb eins`,
  13:00 `ein Uhr` spoken but `dreizehn Uhr` formal, 21:45 `dreiviertel zehn`.
- Browser QA at 1280x900 and 390x844: horizontal overflow 0, console errors 0,
  drag + hour wrap + keyboard arrows + presets + morning/evening switch all
  behave, minimum control height 42px, brand badge injected.
- Yellow contrast: kicker `rgb(255,230,0)` on `rgb(18,61,24)` text; warning
  strip `rgb(255,230,0)` on `rgb(33,33,33)` text. No white on yellow.
