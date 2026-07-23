# Baltic Sea day trip from Berlin — internal research notes (2026-07-23)

Internal only. Never publish any part of this file.

## Topic / SEO decision

- Focus keyword: `Baltic Sea day trip from Berlin`. Secondary: `Warnemünde from Berlin`,
  `Usedom from Berlin`, `Binz from Berlin`, `beach near Berlin`, `Deutschlandticket Baltic`.
- SERP answerability: rejected form = "how far is the Baltic Sea from Berlin?" /
  "can you day trip to the Baltic from Berlin?" (a snippet answers both: ~3 hours, yes).
  Accepted reframe = which of three coast towns to pick and the exact train plan with
  time trade-offs; needs comparison + judgment + a planner, cannot fit a SERP box.
- Dedupe check 2026-07-23: 255 published slugs, 0 UNPUBLISHED drafts, 170 tools.
  No Baltic/Warnemünde/Usedom/Binz post or tool exists. `best-day-trips-from-berlin`,
  `dresden-day-trip-from-berlin`, `leipzig-day-trip-from-berlin`,
  `spreewald-day-trip-from-berlin`, `tropical-islands-from-berlin` are the sibling series.
- Category: Tourist Tips. Tags: Berlin Day Trips, Deutschlandticket, Tourist Tips.

## Verified facts and sources (checked 2026-07-23)

Train times: bahn.de journey API (web planner), representative summer Saturday 2026-07-25.
- Berlin Hbf -> Warnemünde: RE5 06:46 -> Rostock 09:23, S1 09:37 -> Warnemünde 09:58 (3h12,
  ~2h pattern at :46); IC 2474 08:15 -> Rostock 10:20, S1 -> 10:48 (2h33). Early options
  from 05:46. Returns: S1+RE5 15:59->19:11, 17:59->21:11, 20:03->23:19, last sane
  21:03->00:19; IC 15:49->18:59 via Oranienburg + S-Bahn (2026 pattern).
- Berlin Hbf -> Seebad Heringsdorf: RE3 05:22 -> Züssow 08:02, RB23 -> 09:25 (4h03);
  RE3+RE30+bus mv81 06:23 -> 10:05; ICE 936 08:58 -> Züssow, RB23 -> 12:25 (3h27).
  Returns: RB23+ICE 15:33->19:01; regional 16:33->20:29, 17:33->21:29, 18:33->22:39,
  last 19:33->23:33.
- Berlin Hbf -> Ostseebad Binz: RE5+RE9 05:46->09:54 (4h08); 06:46->10:56; 07:46->11:54;
  IC 2474 direct 08:15->12:12 (3h57; same IC as Rostock, splits route via Stralsund;
  article says "one direct InterCity leaving just after 08:00", no train number published).
  Returns: 15:59->20:11, 17:59->22:19, 18:59->23:33, last 19:59->00:19.
- Rostock S-Bahn Warnemünde: every ~15 min, 21-minute ride (bahn.de legs).
- Deutschlandticket 63 EUR/month from 2026-01-01: iamexpat.de/expat-info/germany-news/
  breaking-deutschlandticket-will-cost-63-euros-january-2026 (+ Wikipedia Deutschlandticket).
- Warnemünde lighthouse: built 1898, ~37 m, adults 2 EUR / children 1 EUR, daily
  10:00-18:30 in season (last entry 18:00): warnemuende-leuchtturm.de +
  warnemuende-infos.de/leuchtturm-warnemuende.html + ostsee-mit-kindern.de.
- Warnemünde day Kurabgabe 2.25 EUR/day age 15+, kids <=5 free: der-warnemuender.de/kurabgabe.html
  + rostock-heute.de/kurabgabe-rostock-warnemuende/120127.
- Strandkorb Warnemünde 2026: ~5 EUR/h, 15 EUR/day, ~2,800 chairs / ~16 operators:
  nordkurier.de/regional/rostock/... (2026 prices stable article) +
  strandkorbvermietung-warnemuende.de.
- Heringsdorf Seebrücke: built 1995, 508 m, longest pier in Germany/continental Europe:
  heringsdorf.m-vp.de/seebruecke-heringsdorf + ostsee.de/insel-usedom/seebruecken.php.
- Ahlbeck Seebrücke: 1898, oldest pier in Germany, Usedom landmark:
  ostsee.de/insel-usedom/seebruecken.php + kaiserbaeder-auf-usedom.de/en/seebruecken/.
- Usedom day spa fee (Tageskurtaxe) 2026 range ~2.40-3.90 EUR depending on resort/season:
  usedom-insider.de/kurtaxe-auf-usedom/ ("around 3 euros" in article). Binz day
  Kurabgabe ~2.80-3.40 EUR: ruegenbinz.de/en/kurtaxe/ + ostseeja.de/insel-ruegen/kurtaxe/
  ("around 3 euros" in article, no exact figure published).
- Ahlbeck -> Świnoujście: continuous beach promenade across the border, ~30-40 min walk
  from Ahlbeck pier (common knowledge + kaiserbaeder site); article says "about half an hour".
- 2026 Stadtbahn closure: no RE/RB between Charlottenburg and Ostbahnhof until December;
  north-south routes from Hbf (low level) + Gesundbrunnen unaffected. Source: own
  `leaving-berlin-by-train` package research (2026-07-21) + bahn.de legs above showing
  Hbf departures.
- Baltic water temperature July/August: typical 17-20 C (general climate range; article
  uses "usually", no exact claim).

## Deliberately NOT published

- Exact train numbers for Binz IC (train splits; risk of confusion).
- MV-Ticket / Länder ticket prices (Deutschlandticket dominates; avoids stale prices).
- Exact Binz/Usedom Kurtaxe figures (season/zone dependent; "around 3 euros" instead).
- Exact DB point-to-point fares (dynamic pricing).
- Świnoujście UBB train options (scope).

## Widget

- `baltic-beach-day-planner`: 3-lane comparative race board, time ribbons per coast.
  Fresh interaction: comparative multi-destination payout race, not a single-destination
  clock (dresden-day-clock), not a map (koepenick/spreewald), not a picker/checker shell.
- Engine sweep: 72 combos (4 leave x 3 back x 2 ticket x 3 destinations), 0 rule
  failures, 18 legitimately infeasible combos render the no-window state.
- Timetable disclaimer + bahn.de link inside the widget footer.
