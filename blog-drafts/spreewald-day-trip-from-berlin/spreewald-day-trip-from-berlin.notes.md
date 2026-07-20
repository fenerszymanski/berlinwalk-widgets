# Spreewald Day Trip from Berlin — internal plan (2026-07-20, run 2 of day)

INTERNAL ONLY. Never part of the publish body.

## Topic decision

- Focus keyword: `Spreewald day trip from Berlin`
- Secondary: `Berlin to Lübbenau train`, `Spreewald punt tour price`, `Spreewald kayak rental`, `Spreewald without a car`, `Lübbenau Lehde`
- Slug: `spreewald-day-trip-from-berlin`
- Categories: Tourist Tips (primary). Single category; day-trip guide, not history-led.
- Why: 239 published posts, 155 tools, all drafts checked — zero Spreewald coverage
  anywhere, while Potsdam and Sachsenhausen both have dedicated day-trip posts and
  `best-day-trips-from-berlin` calls Spreewald "the best nature escape". July =
  peak punting season. Dedupe check included loose title greps (learned from the
  WelcomeCard near-miss: `is-the-berlin-welcomecard-worth-it-...` exists).
- Search intent: planning/transport/cost — how to get there without a car, punt vs
  kayak, what it costs in 2026, is one day enough.

## Load-bearing editorial finding

The Spreewald trains do NOT leave from Berlin Hauptbahnhof or Alexanderplatz.
RE2 serves Spandau–Jungfernheide–Gesundbrunnen–Ostkreuz–Schöneweide; RE7 serves
Ostbahnhof–Ostkreuz. Ostkreuz is the anchor station for tourists. Most guides
say "from Berlin Hbf" and people waste 30+ minutes. This is the article's spine.

## Verified facts (checked 2026-07-20)

- RE2: Nauen–Berlin(Gesundbrunnen/Ostkreuz)–Lübben–Lübbenau–Cottbus, hourly;
  ~90 min Berlin–Lübbenau overall, ~1h from Ostkreuz. VBB line page + DB Regio
  timetable + transitapp stop list. RE20 (new Dec 2025) replaced RE2 peak extras.
- RE7: Ostbahnhof–Ostkreuz–Königs Wusterhausen–Lübben–Lübbenau–Calau–Senftenberg
  (transitapp stop list; DB Regio 2026 PDF pairs RE2/RE7 on the corridor).
  Together usually 2 direct trains/hour from Ostkreuz.
- Deutschlandticket 2026: EUR 63/month (site-consistent, faq deutschlandticket key).
- Brandenburg-Berlin-Ticket 2026: EUR 36.50/day, up to 5 people, night EUR 27
  (bahn.de + VBB news of 2026-01-01 fare change).
- Berlin ABC single 2026: EUR 5.00 (VIZ/VBB news) — Lübbenau is OUTSIDE ABC.
- Kahn (punt) prices, Großer Kahnfährhafen Lübbenau official price page marked
  "Preise 2026": 2h Lehde EUR 17 / child (4-11) EUR 9; 3h Lehde EUR 20/11;
  5.5h Wotschofska EUR 28/16 (10:00, reservation advised); 8.5h Hochwald
  EUR 44/25 (Tue, May-Sep, reservation); evening 2h EUR 21/12 (May-Sep
  Mo/We/Fr/Sa, reservation); Waldbaden Fri 9:30 EUR 36/20. Season Apr-Oct,
  boats fill and go from ~10:00-11:30, no fixed timetable.
- Kayak rental Lübbenau 2026 ranges: Spreewald-Kanus 1-seater 2h EUR 16 / day
  EUR 24, 2-seater 2h EUR 17 / day EUR 28, season daily Apr-Oct ~9:00-18:00;
  Bootshaus Kaupen 2-seater 2h EUR 22, day EUR 37; Gebauer kayak 2h EUR 32 /
  day EUR 47 (Thu-Sun). Use a range in public copy, not one operator's number.
- Freilandmuseum Lehde 2026: 28 Mar-30 Sep daily 10-18, Oct daily 10-17,
  closed in winter; adults EUR 8, children under 14 free (museums-entdecker /
  museum operator OSL).
- Lübbenau-Lehde on foot: ~2.6 km, 35-45 min, flat, signposted (AllTrails/komoot).
- Spreewald: UNESCO biosphere reserve since 1991; ~475 km²; ~300 channels
  (Fließe) totalling ~1,575 km (spreewald-info/reiseland-brandenburg/Wikipedia
  converge on ~300 Fließe, 1,500+ km).
- Punting (Kahnfahren im Spreewald) entered the German nationwide register of
  intangible cultural heritage in 2023 (spreewald.de "2023 UNESCO recognition";
  phrase carefully: nationwide German register, not the international list).
- Spreewald gherkins: EU protected geographical indication; Gurkenmeile stalls
  at the Lübbenau harbor in season.
- NOT VERIFIED, DO NOT USE unless separately confirmed: mail-by-punt-boat in
  Lehde; exact single fare Berlin-Lübbenau (aggregators show ~EUR 19-21 flex,
  VBB tariff likely lower — point readers to DB Navigator instead).

## Source URLs

- https://grosser-kahnhafen.de/preise/ (2026 prices, official operator)
- https://grosser-kahnhafen.de/kahnfahrten/
- https://www.vbb.de/unterwegs-im-vbb/regionalbahnlinien/re2/
- https://www.eberswalde-ffo.de/re2-cottbus-berlin-nauen.html
- https://transitapp.com/en/region/berlin-brandenburg/db-regio/commuter-rail-re2
- https://transitapp.com/en/region/berlin-brandenburg/db-regio/commuter-rail-re7
- https://www.bahn.de/angebot/regio/laender-tickets/brandenburg-berlin-ticket
- https://www.vbb.de/news/neue-fahrpreise-im-vbb-ab-1-januar-2026/
- https://museums-entdecker.de/home/oeffnungszeiten-eintritt/
- https://www.spreewald.de/en/
- https://www.spreewald-info.de/paddeln/bootsverleih/spreewald-kanus
- https://www.unesco.de/staette/spreewald/

## Widget ideas (3+) and decision

1. CHOSEN — `spreewald-reach-map` "Spreewald Reach Map": stylized SVG waterway
   network out of Lübbenau harbor (Lehde, Leipe, Wotschofska, Hochwald + the
   walking path). Reader picks one of six ways into the wetland (2h punt, 3h
   punt, 5.5h Wotschofska punt, kayak half-day, kayak full day, on foot);
   channels light up to show what that choice actually reaches, with 2026
   price, time budget and an honest note. Original: no existing widget is a
   waterway-reach visualization; ghost-stations is a tunnel-era map,
   kurfurstendamm-walk is a linear stop walk, unterwelten is a departure board.
2. Rejected — Berlin-side "departure board" (Ostkreuz vs Hbf): board pattern
   used yesterday by berliner-unterwelten-tour-board; too similar.
3. Rejected — punt vs kayak split-screen timeline comparer: weaker fit; reach
   map answers the same question plus geography.
4. Rejected — gherkin stand picker: decorative, not decision-support.

## Embeds

- {{quick-summary}} key `spreewald-day-trip-from-berlin`
- {{widget:spreewald-reach-map}}
- {{faq}} key `spreewald-day-trip-from-berlin`

## Internal links plan

/post/best-day-trips-from-berlin, /post/potsdam-from-berlin-day-trip,
/post/sachsenhausen-from-berlin, /post/deutschlandticket-berlin-tourists,
/post/berlin-ab-abc-ticket-zones, /post/berlin-lakes-guide-2026,
/tools/spreewald-reach-map (via tool CMS), booking via natural tour line.

## External links plan

grosser-kahnhafen.de (punt prices), museums-entdecker.de or spreewald.de
(Lehde museum), bahn.de Brandenburg-Berlin-Ticket page, spreewald.de (official
tourism, biosphere).
