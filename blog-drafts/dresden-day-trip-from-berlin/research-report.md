# Dresden day trip from Berlin — research record (2026-07-21)

INTERNAL ONLY. Timetable data was pulled live from the Deutsche Bahn timetable
API on 2026-07-20 for travel dates 21 Jul, 27 Jul, 15 Sep and 20 Oct 2026, so
the pattern was confirmed across four separate dates. The published 07:28
Berlin Hbf to 09:07 Dresden Hbf and 18:53 Dresden Hbf to 20:29 Berlin Hbf
connections were checked again on 2026-07-21 before publication.

## Verified constants used in the post

| Fact | Value | Source |
|---|---|---|
| Direct Berlin Hbf to Dresden Hbf | **RJ / RJX Railjet**, roughly every 2 hours, about 1h40 (1h35 to 1h39 measured) | DB timetable API; https://www.bahn.de/reisen/view/verbindung/berlin/dresden.shtml |
| Earliest arrival / last realistic return | 06:12 arriving 08:07; 20:53 back at 22:27 | DB timetable API |
| The late 20:53 ICE became daily only on 11 July 2026 | previously Fri/Sun only | https://www.deutschebahn.com/de/presse/presse-regional/pr-berlin-de/aktuell/presseinformationen/Fahrplan-2026-alle-Neuerungen-fuer-Berlin-Brandenburg-und-Mecklenburg-Vorpommern-im-Ueberblick-13565034 |
| IC does not call at Berlin Hbf | runs via Ostkreuz and BER, 2h00 from Ostkreuz | DB timetable API, IC 2173 stop list |
| Deutschlandticket 2026 | 63 euros a month | https://wissen.deutschlandticket.de/wie-viel-kostet-das-deutschland-ticket-ab-dem-1.-januar-2026-0 |
| Deutschlandticket exclusions | ICE/IC/EC **and Railjet**, Flixtrain, Nightjet, Flixbus named explicitly | https://wissen.deutschlandticket.de/verkehrsmittel |
| VBB ticket acceptance on DB long distance ended | 14 December 2025 | DB press release |
| Deutschlandticket route | RE 8 Berlin Hbf to Elsterwerda (~1h31 to 1h47, roughly hourly) + RB 31 onward (1h05, every 2 h at :42), total ~3h05 | DB timetable API |
| RB 31 terminates at Dresden-Neustadt | during the Kreuzungsbauwerk works, 9 Feb to 15 Nov 2026 | DB API + https://www.mitteldeutsche-regiobahn.de/de/strecken/fahrplanabweichungen/baustelle-dresden-2026 |
| Ländertickets | Sachsen-Ticket 35 euros +8 per extra person; Brandenburg-Berlin-Ticket 36.50 for up to 5; both start 09:00 on weekdays; neither covers the whole route | bahn.de Länder-Tickets pages |
| DB advance fares | Super Sparpreis from 6.99 euros, Sparpreis from 21.99, 2nd class | https://www.bahn.de/angebot/spar-flexpreis |
| Flixbus | shortest 1h54, 35 departures a day, arrives Dresden Hbf | https://www.flixbus.com/bus-routes/bus-berlin-dresden |
| Frauenkirche entry | free, donation requested | https://www.frauenkirche-dresden.de/welcome |
| Dome climb | 12 euros / 7 reduced / 24 family; Mar to Oct Mon-Sat 10:00-18:00, Sun 13:00-18:00; stair tower G | https://www.frauenkirche-dresden.de/dome-ascent |
| Zwinger courtyard | free; Jun-Aug 2026 daily 06:00-22:00 | https://www.der-dresdner-zwinger.de/de/dresdner-zwinger/gaesteservice/ |
| Gemäldegalerie Alte Meister | daily 10:00-17:00, **closed Monday**, 18 euros, ticket covers four Zwinger museums | https://gemaeldegalerie.skd.museum/en/visit/ |
| Grünes Gewölbe / Residenzschloss | daily 10:00-17:00, **closed Tuesday**; Historic Green Vault is a timed ticket, 18 euros | https://gruenes-gewoelbe.skd.museum/en/visit/ |
| Semperoper Highlightführung | 16 euros, 45 minutes, nearly daily | https://www.semperoper-erleben.de/highlightfuehrung |
| Altstadt geometry | Zwinger-Semperoper 134 m, Hofkirche-Zwinger 183 m, Frauenkirche-Brühlsche Terrasse 202 m, Frauenkirche-Zwinger 507 m | computed from coordinates |
| Dresden Hbf to Frauenkirche | about 1.45 km straight line, ~1.6 km walking, ~20 min | computed |
| Fürstenzug | about 102 m of Meissen porcelain, free and outdoors | multiple sources, see recheck list |
| Green Vault burglary | 25 Nov 2019, five convicted May 2023, recovered pieces back on display Aug 2024 | ZDF |
| Carolabrücke | partly collapsed Sept 2024, demolished by Sept 2025, not rebuilt before 2031 | dresden.de news feed + secondary |

## Recheck before publishing

1. **All minute-level train times.** Pulled 2026-07-20. Re-pull immediately
   before publish, and again after the **13 December 2026** timetable change,
   which may shift the whole table. The article body deliberately prints the
   *pattern* rather than a timetable; only the widget carries exact minutes, and
   it shows a visible data date.
2. **Whether the RB 31 still terminates at Dresden-Neustadt.** The construction
   window ends **15 November 2026**. If this publishes near or after that date,
   the Quick Summary item and the widget's regional mode both need updating.
3. **The 20:53 ICE.** It has scattered non-running dates. The post does not
   promise it unconditionally and the widget flags it.
4. **DVB/VVO fares** rose on 1 April 2026 and were confirmed from one page plus
   one news report, not the PDF tariff table. Not printed in the body.
5. **Frauenkirche Open Church hours** vary daily and the weekend times
   alternate. The body deliberately says to check rather than printing hours.
6. **Sparpreis floor prices** change; recheck bahn.de.
7. **Fürstenzug 102 m and ~23,000 tiles.** Consistent across every source but
   not primary-sourced; the dresden.de page 404s. The body says "about 102
   metres" and does not print a tile count.
8. **Semperoper English-language tours** are widely claimed but were not
   confirmed officially. Not claimed in the body.
9. **Katholische Hofkirche opening hours** could not be verified. Not printed.
10. **"Three prominent jewels still missing"** is reputable secondary, not SKD
    primary. Not printed.

## Deliberately not written

These are plausible and widespread but wrong, and were kept out of the post:

- "Take the EC to Dresden." In 2026 they are Railjet.
- "EC and IC alternate to give an hourly service." The Berlin **Hbf** service is
  2-hourly, and the IC does not call at Berlin Hbf at all.
- "There is an ICE from Berlin to Dresden." Only one, and it runs Dresden to
  Berlin late evening.
- "Your Deutschlandticket is valid on the IC to Elsterwerda." True until
  13 December 2025, ended.
- "The Frauenkirche is a 10 minute walk from Dresden Hbf." It is about 20.
- "The regional train takes you to Dresden Hbf." In 2026 it stops at Neustadt.
- "Dresden's museums are closed on Mondays" as a blanket statement. The Zwinger
  closes Monday, the Green Vault closes Tuesday.
- "Dome climb costs 10 euros" and "Green Vault costs 16 euros." Stale
  tour-operator figures; the official prices are 12 and 18.
- "The Sachsen-Ticket covers the journey." Neither Länderticket does.
- "The Berlin to Dresden line is closed for eight months in 2026." A 2023
  announcement that live July 2026 data contradicts.
- Any Elbe panorama framing that assumes the Carolabrücke still exists.

## Berlin-side note checked but not used

The Berlin Stadtbahn is closed to regional and long-distance trains between
Charlottenburg and Ostbahnhof from **14 June to 12 December 2026** (S-Bahn
unaffected). Sources: VBB, VIZ Berlin, DB Regio. This is real and current, but
it does **not** affect this route: the Dresden trains use the deep north-south
level at Berlin Hbf, and the IC uses Ostkreuz, neither of which is on the closed
Stadtbahn section. It was left out rather than half-explained.
