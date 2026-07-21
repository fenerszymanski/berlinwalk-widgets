# Spandau Berlin — internal notes (2026-07-22 run, 1st of day)

## Topic decision

- Focus keyword: `Spandau Berlin`. Category: Tourist Tips + Berlin History.
- Slug: `spandau-berlin` (matches kreuzberg-berlin / neukolln-berlin pattern;
  no collision in 248 published slugs, 0 drafts, 163 tool slugs, QS/FAQ keys).
- SERP answerability: rejected forms are `is Spandau worth visiting` (yes/no)
  and `Spandau Citadel opening hours` (single fact). Accepted angle: a
  judgment-led district guide (what deserves time, in which order, how the
  2026 rail closure changes arrival) that cannot fit in a SERP box.
- Angle: Berlin's actual walled old town + one of Europe's best-preserved
  Renaissance fortresses, inside zone B on a normal AB ticket.

## Verified facts (2026-07-22, source URLs)

- Zitadelle: open Fri-Wed 10:00-17:00, Thu 13:00-20:00, last entry 30 min
  before closing; adults EUR 4.50, reduced EUR 2.50, family EUR 10, under 6
  free; ticket includes museums, Juliusturm and exhibitions; hours can vary on
  event days (concert season). Source:
  https://www.zitadelle-berlin.de/en/your-visit/
- `Unveiled. Berlin and its monuments` permanent exhibition: ~100 monuments
  incl. the granite head of the 1970 Lenin monument from Friedrichshain and
  Siegesallee figures; touching mostly allowed. Sources:
  https://www.zitadelle-berlin.de/en/museums/unveiled/ ,
  https://www.museumsdienst.berlin/en/exhibitions/enthullt-berlin-und-seine-denkmaler
- Juliusturm: 13th-century keep, oldest building in Berlin; Reichskriegsschatz
  (120 million gold marks) stored 1874-1919. Sources:
  https://www.visitspandau.de/kiek-ma-/altstadt-zitadelle/juliusturm-palas/ ,
  https://en.wikipedia.org/wiki/Spandau
- Spandau town charter 1232, five years before Berlin's first documented
  mention (1237). Source: https://en.wikipedia.org/wiki/Spandau_(locality)
- Gotisches Haus: oldest surviving town house in Berlin (15th-century core),
  free entry, houses tourist info; summer (Apr 1-Sep 30) Mon-Sat 10-18,
  Sun 12-18. Source: https://www.gotischeshaus.de/offnungszeiten-eintritt/
- St. Nikolai: 14th-century brick-gothic church; Elector Joachim II took
  communion in both kinds nearby in 1539 (Reformation in Brandenburg); open
  church around midday, tower climbs offered by the parish. Sources:
  https://www.visitspandau.de/kiek-ma-/sehenswuerdigkeiten/st-nikolai-kirche-und-reformationsplatz/ ,
  https://spandau-evangelisch.de/page/307/st-nikolai
  (NOT repeated: "only surviving medieval church in Berlin" claim from
  berlinstadtservice — false, Marienkirche exists.)
- Kolk/Behnitz: oldest settlement corner; ~6 m high remnant of the
  14th-century town wall at Hoher Steinweg; St. Marien am Behnitz (1848),
  second-oldest Catholic church in Berlin. Sources:
  https://www.visitspandau.de/en/look-/sights/behnitz-kolk/ ,
  https://www.visitberlin.de/en/kolkviertel
- Spandau Prison: demolished 1987 after Hess's death, precisely to prevent a
  shrine; materials ground and dispersed; site became the Britannia Centre
  (built 1988-1990). Nothing to visit. Source:
  https://en.wikipedia.org/wiki/Spandau_Prison
- 2026 transport (Stadtbahn closure 14 Jun-12 Dec): ICE Hamburg trains skip
  Spandau; RE2 rerouted via Gesundbrunnen/Ostkreuz; S-Bahn unaffected EXCEPT
  the construction weekends 24-27 Jul and 31 Jul-3 Aug (Fri 22:00 to late Sun)
  when Stadtbahn S-Bahn is suspended - U7 is the reliable way in. Sources:
  https://www.vbb.de/unterwegs-im-vbb/baustellen-bei-regional-und-s-bahn/stadtbahnsperrung-2026/ ,
  https://www.berlin.de/en/news/10441558-5559700-monthslong-closures-on-berlin-stadtbahn.en.html
- Fare zone: all of Spandau is inside Berlin fare zone B; a normal Berlin AB
  ticket covers the whole trip (existing post berlin-ab-abc-ticket-zones).
- U7 stations: Zitadelle (for the fortress), Altstadt Spandau (old town),
  Rathaus Spandau (terminus, next to the mainline/S-Bahn station). S3/S9 end
  at Berlin-Spandau station.

## Deliberately NOT published

- Juliusturm step count (sources disagree: 145 vs 153) - "a tight spiral
  staircase" instead.
- Exact Citadel Music Festival 2026 dates/lineup (event-specific, sellable) -
  only the generic "concert evenings can shift museum hours" warning.
- St. Nikolai tower-climb schedule (parish-dependent, not stable) - linked
  instead.
- Nazi-era chemical/gas laboratory detail on the citadel: kept to one careful
  sentence (military research site) without dramatization.

## Widget

`spandau-old-town-loop` — "Spandau Loop Builder": schematic old-town map
(Havel, Altstadt island, citadel, U7 stations), tap stops to build a walking
loop; live loop line, per-stop minutes, weekday-aware opening warnings
(Thu citadel opens 13:00; Sun Gotisches Haus opens 12:00; midday-only church).
Fresh interaction: map-first route building, not a picker/checker/list-order
clone. Data lives inline; no external libs.

## Handoff state

See SESSION_LOG.md entry for final gate status.
