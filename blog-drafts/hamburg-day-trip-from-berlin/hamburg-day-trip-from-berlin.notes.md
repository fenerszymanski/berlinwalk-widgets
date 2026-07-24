# Hamburg day trip from Berlin — internal research notes (2026-07-24)

Internal only. Never publish any part of this file.

## Topic / SEO decision

- Focus keyword: `Hamburg day trip from Berlin`. Secondary: `Berlin to Hamburg train`,
  `Hamburg in a day`, `Speicherstadt`, `Elbphilharmonie Plaza`, `Hamburg from Berlin`.
- SERP answerability: rejected form = "how long is the train from Berlin to Hamburg?" /
  "can you day trip to Hamburg?" (a snippet answers both: ~2 hours, yes). Accepted reframe =
  is it worth it and how do you make a realistic ~7-hour day work when the sights are strung
  out along the water; needs a judgment call + one-zone recommendation + a time-budget planner,
  cannot fit a SERP box.
- Dedupe check 2026-07-24: 257 published slugs, 1 UNPUBLISHED draft (oberbaumbruecke-berlin,
  today's 07:55 Claude package), 173 tools. No Hamburg post or tool exists; "hamburg" appears
  only incidentally in QS/FAQ cross-references (city-price comparison, Spandau notes) and in
  the leaving-berlin-by-train station-change note. Sibling day-trip series that DO exist and
  each have a dedicated post + tool: best-day-trips-from-berlin, dresden-day-trip-from-berlin,
  leipzig-day-trip-from-berlin, potsdam-from-berlin-day-trip, spreewald-day-trip-from-berlin,
  sachsenhausen-from-berlin, tropical-islands-from-berlin, baltic-sea-day-trip-from-berlin.
  Hamburg is the missing major day trip; this completes the set.
- Category: Tourist Tips. Tags: Berlin Day Trips, Tourist Tips. Distinct from today's other
  Claude package (Oberbaumbrücke, Berlin History).

## Verified facts and sources (checked 2026-07-24)

- Trains: DB ICE + IC and FlixTrain. Fastest ICE Berlin Hbf -> Hamburg Hbf ~1h45-1h50
  (107 min post-reopening). Many services/day, several also stop Berlin-Spandau. ~290 km.
  Line fully reopened 14 June 2026 after a ~9-month general renovation (was closed Aug 2025;
  reopening slipped from May to 14 June). Sources: Railway Gazette (hamburg-berlin-main-line-
  reopens 2026-06-19), iamexpat (berlin-hamburg-train-route-resume-full-service-june).
- Deutschlandticket covers regional/local only (RE/RB/S/U-Bahn/bus), NOT ICE/IC. Established
  DB rule. (Project standard figure: 63 EUR/month in 2026; used in copy.)
- Fares: Sparpreis / Super Sparpreis advance saver from ~15-22 EUR one way when booked early
  (travel-dealz sparpreise-hamburg-berlin); Flexpreis walk-up 80 EUR+ and fluctuating.
- Speicherstadt: world's largest contiguous historic warehouse district, UNESCO World
  Heritage since 2015 (jointly with Kontorhausviertel), free to walk. Source: hamburg.com.
- Elbphilharmonie Plaza: viewing level ~37 m, FREE but timed ticket required; walk-up free
  from visitor centre subject to availability; online booking fee 3 EUR (rising to 5 EUR from
  5 Oct 2026); Plaza open daily ~10:00-22:00. Source: elbphilharmonie.de/en/plaza.
- Landungsbrücken: floating landing piers, harbour viewpoint; public HVV ferry line 62 is the
  cheap DIY harbour tour. Source: hamburg-travel.com, hamburg.com.
- Alster: Binnenalster (inner, city-centre, Jungfernstieg promenade) + Außenalster (outer,
  parkland). Rathaus: neo-Renaissance town hall on Rathausmarkt, minutes from Jungfernstieg.
  Source: hamburg.com, hamburg-travel.com.
- Fischmarkt (Altonaer Fischmarkt): Sundays only, summer (Apr-Oct) 05:00-09:30; winter starts
  ~07:00. Source: hamburg-travel.com. Not compatible with a normal late-morning day-trip.
- Miniatur Wunderland (in Speicherstadt): world's largest model railway, 1M+ visitors/yr,
  open ~09:00-20:00 (later summer), adult ~22 EUR+, timed entry, walk-up waits up to ~2h;
  pre-book online. Source: miniatur-wunderland.com.
- Walkability: Hbf -> Rathaus/Jungfernstieg ~2.5 km / 15-20 min walk; Rathaus -> Speicherstadt
  ~550 m / 8 min; so Hbf -> Speicherstadt ~15-20 min. Central core walkable; U-/S-Bahn + ferries
  (HVV) for jumps; one HVV day ticket covers all modes incl. ferries.
- Reeperbahn/St. Pauli: entertainment/red-light strip, tame by day, lively after dark.

## Deliberately NOT published

- Exact ICE train numbers / precise post-reopening headway (timetable-dependent; "many/day").
- Exact DB point-to-point fares (dynamic pricing; ranges only).
- Elbphilharmonie booking-fee exact figure / the 5 Oct 2026 rise (volatile; "reserve online").
- Miniatur Wunderland exact ticket price (ranges shift; "book ahead" is the durable advice).
- Whether Berlin Gesundbrunnen is a consistent ICE stop (unverified; only Hbf + Spandau stated).

## Widget

- `hamburg-day-fit`: a time-budget "does your day fit?" validator. Reader sets arrival/return
  train windows and taps experiences (each cost includes the typical inter-zone hop); a stacked
  budget bar fills against the on-the-ground window and turns red past it, with honest
  "commit to one zone / the harbour spine" coaching when overpacked, plus a booking note when
  Miniatur Wunderland is selected.
- Fresh interaction: a constraint-fit budget bar, NOT the Baltic comparative race board, NOT a
  Dresden-style single-destination clock, NOT a map/picker/checker shell. Primary visual is the
  functional bar + honest text, no code-drawn illustration.
- Engine sweep: 1152 combos (3 leave x 3 back x 128 experience subsets), 0 negative windows,
  0 NaN. Window range 3h15m (lazy start + early return) to 11h45m (first train + last train).
- Browser QA: desktop + 390px, horizontal overflow 0, console errors 0, fit + over states
  verified, yellow surfaces (kicker, book-flag) dark-green text on #FFE600.
