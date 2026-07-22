# Leipzig Day Trip from Berlin — internal notes (2026-07-22)

INTERNAL ONLY. Never part of the publish body.

## Topic decision
- Focus keyword: `Leipzig day trip from Berlin`
- Slug: `leipzig-day-trip-from-berlin` (series match: dresden-day-trip-from-berlin, spreewald-day-trip-from-berlin, potsdam-from-berlin-day-trip)
- Category: Tourist Tips
- Dedupe: 248 published posts + 1 draft (spandau-berlin, today run 1) scanned. Leipzig exists only
  as one section inside `best-day-trips-from-berlin`. No Leipzig tool/QS/FAQ key. Distinct.
- SERP answerability: rejected forms "how far is Leipzig from Berlin" / "how long is the train
  from Berlin to Leipzig" (single-fact lookups). Accepted angle: full day plan with a real
  ticket trade-off (ICE speed vs Deutschlandticket regional chain), a Monday-closure reshuffle,
  and a time-budget judgment. Cannot fit a SERP box.

## Verified facts + sources (checked 2026-07-22)
- ICE/IC Berlin–Leipzig ~1h07–1h15, ~25 direct trains/day.
  https://www.thetrainline.com/en-us/train-times/berlin-to-leipzig-hbf ,
  https://www.omio.com/trains/berlin/leipzig
- During Stadtbahn closure (14 Jun–12 Dec 2026) Berlin–Leipzig trains are NOT affected in
  routing substance: they use the north-south tunnel (Hauptbahnhof tief) + Südkreuz.
  Cross-checked with our own leaving-berlin-by-train research (viz.berlin, VBB).
- Anhalter Bahn (Berlin–Halle/Leipzig line) had its Generalsanierung 24 Sep–13 Dec **2025**
  (~100 km track renewed). Finished; 2026 runs on renewed infrastructure. Do NOT present the
  closure as current. https://halle.de/verwaltung-stadtrat/presseportal/nachrichten/nachricht/bauarbeiten-auf-der-bahnstrecke-halle-leipzig-berlin-vom-24-september-bis-13-dezember-2025
- Fares (verified 2026-07-21 from bahn.de for the train post, reused): Super Sparpreis from
  17.99 EUR (selected short journeys/Last Minute from 6.99), Sparpreis from 21.99 (10 EUR
  change fee), Flexpreis any-train-that-day + City-Ticket, seat reservation 5.50 EUR optional.
  Deutschlandticket 63 EUR/month, NOT valid on ICE/IC/EC anywhere, and the old Berlin-region
  long-distance acceptance ended 14 Dec 2025.
- Deutschlandticket route: RE3 Berlin (Hbf tief/Südkreuz) → Lutherstadt Wittenberg Hbf
  (hourly in peak; some off-peak RE3 end at Luckenwalde), then S-Bahn Mitteldeutschland S2
  Wittenberg → Leipzig Hbf (S2 timetable valid 14.12.2025–12.12.2026; full-line 83 min for
  22 stations; Wittenberg→Leipzig ~65 min). Direct Leipzig–Wittenberg S2 link ends with the
  Dec 2026 timetable change (S2 cut back to Bitterfeld; S8 extended instead).
  https://www.mein-takt.de/fileadmin/content/mein-takt/fahrplan/Aktuell/S2_Aktuell.pdf ,
  https://www.nasa.de/en/press/news/detail/news/vorschau-auf-fahrplanwechsel-im-dezember ,
  https://www.vbb.de/unterwegs-im-vbb/regionalbahnlinien/re3/
  Total D-ticket chain ~2h45–3h with one change. D-ticket also covers Leipzig trams (LVB).
- Nikolaikirche: open daily (10–18, Sat to ~16, Sun to ~14:30), free; Monday peace prayers
  17:00 tradition continues. https://www.leipzig.travel/en/poi ,
  https://europeforvisitors.com/germany/leipzig/leipzig-monday-demonstrations-1989.htm
- Thomaskirche: open daily ~9/10–18, free entry; Bach's grave in the chancel (since 1950);
  Motette Fri 18:00 + Sat 15:00, ~3 EUR. https://english.leipzig.de/leisure-culture-and-tourism/tourism/leipzigs-tourist-attractions/st-thomas-church
- Bach Museum: Tue–Sun 10–18, closed Mon, 10 EUR, free 1st Tuesday, under-18 free.
  https://www.bachmuseumleipzig.de/en/bach-museum/your-visit
- Zeitgeschichtliches Forum: FREE, closed Mon; Tue–Fri 9–18, Sat/Sun 10–18.
  https://www.hdg.de/en/zeitgeschichtliches-forum-leipzig/visitor-information
- Museum der bildenden Künste: closed Mon; Tue/Thu–Sun 10–18, Wed 12–20; full 14 EUR.
  https://mdbk.de/en/visit/
- Runde Ecke (Stasi museum): daily 10–18, 5 EUR (4 reduced) incl. audio guide.
  https://www.runde-ecke-leipzig.de/index.php?L=2&id=230&type=98
- Völkerschlachtdenkmal + FORUM 1813: Apr–Oct daily 10–18 (Nov–Mar 10–16), adults 12 EUR
  (reduced 10), 91 m monument (1913) with viewing platform; Tram 2/15 or S-Bahn stop
  Völkerschlachtdenkmal. Tram 15 from Hbf ~13 min, every 10 min.
  https://www.stadtgeschichtliches-museum-leipzig.de/besuch/unsere-haeuser/voelkerschlachtdenkmal-forum-1813/
- 1989: Monday demonstrations grew from Nikolaikirche peace prayers; 9 Oct 1989 ~70,000
  marchers is the decisive date. https://en.wikipedia.org/wiki/Monday_demonstrations_in_East_Germany
- Leipzig Hbf: among Europe's largest stations by floor area, with the Promenaden shopping
  arcades; city centre ~10 min on foot.

## Deliberately left out
- FlixTrain Berlin–Leipzig: exists and is cheap, but its exact Berlin departure station during
  the Stadtbahn closure could not be verified from an official page today. Omitted rather than
  guessed.
- Panorama Tower (City-Hochhaus) viewing deck: price/hours not verified today. Omitted.
- Zum Arabischen Coffe Baum: reopening/operator status unclear. Omitted.
- Exact RE3 off-peak pattern details beyond "hourly, check the connection" (Luckenwalde
  turnbacks exist; simplified honestly with a check-the-app line).

## Widget plan
- 3 ideas considered:
  1. Leipzig Time-Budget Ribbon (CHOSEN): drag the Berlin departure + return window on a
     rail-styled day ribbon; ICE vs Deutschlandticket mode eats different travel time; day-of-week
     switch reshuffles what fits (Monday closures); blocks visibly drop off as the window shrinks.
  2. 1989 route mini-walk map (rejected: too close to today's Spandau schematic-map widget).
  3. Fare trade-off calculator (rejected: too close to train-gateways ticket-mode widget).
- Widget slug: `leipzig-day-trip-planner`, folder berlinwalk-widgets/leipzig-day-trip-planner/.

## Wix
- Draft ID: (fill after creation)
- Status target: UNPUBLISHED
