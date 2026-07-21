# Research report: football-match-in-berlin

Compiled 21 July 2026 (Europe/Berlin). Everything below was checked on the drafting day.

## Verified and used in the post

### League status 2026/27
- **1. FC Union Berlin: Bundesliga.** Official club fixture announcement.
- **Hertha BSC: 2. Bundesliga.** Official club fixture announcement, 2 July 2026.
- **1. FC Union Berlin Frauen: Frauen-Bundesliga**, home at Stadion An der Alten Försterei. Official club announcement, 16 July 2026.
- No Berlin club is in 3. Liga this season. BFC Dynamo, Viktoria Berlin, Berliner AK 07, VSG Altglienicke and Hertha BSC II are in Regionalliga Nordost (4th tier). Not written into the post.

### Season dates
- 2. Bundesliga matchday 1: **7 to 9 August 2026**.
- Bundesliga matchday 1: **28 to 30 August 2026**.
- DFB-Pokal round 1: 21 to 24 August 2026.
- Both leagues start late because of the 2026 World Cup summer.

### Fixture data (the widget's dataset)
Source of record for home/away and match weekends: the **official DFL fixture-list PDFs published 2 July 2026**.
- Bundesliga: `media.dfl.de/sites/2/2026/07/DE_s73GnueV_Bundesliga_Spielplan_2026_27.pdf`
- 2. Bundesliga: `media.dfl.de/sites/2/2026/07/DE_mgKX2qjj_2.-Bundesliga_Spielplan_2026_27.pdf`
- 2. Bundesliga matchdays 1 to 2 with exact times: `media.dfl.de/sites/2/2026/07/geq66Pg5_BL2-Spieltage-12.pdf`

Parsed home fixtures: 17 for Union, 17 for Hertha. These are in `berlin-matchday-board/fixtures-data.js`.

**Home/away had to be settled from the DFL PDFs.** Page-scraped club and aggregator pages returned contradictory home/away flags for the same fixtures during research, including one that placed Union's opener away at Frankfurt and another that placed Union's matchday 2 at home against Leverkusen. Both were wrong. The DFL Heim/Gast columns are authoritative and were used instead.

Confirmed exact kickoff times (the only ones written as times anywhere):
- **Union vs Eintracht Frankfurt, Sat 29 August 2026, 15:30** (club announcement of matchdays 1 to 4, 15 July 2026; cross-checked against bundesliga.com).
- **Union vs Schalke 04, Fri 11 September 2026, 20:30** (same announcement).
- **Union vs Borussia Mönchengladbach, Sat 22 May 2027, 15:30** (final matchday, in the DFL PDF).
- **Hertha vs 1. FC Heidenheim, Sat 15 August 2026, 13:00** (DFL matchday 1 to 2 PDF; cross-checked against the club's own "Heimauftakt gegen Heidenheim" article).
- **Hertha vs 1. FC Magdeburg, Sun 6 September 2026, 13:30** (club announcement of matchdays 3 to 6, 15 July 2026).
- **Union Frauen vs FC Bayern München, Fri 21 August 2026, 18:20**, Alte Försterei, opening match of the Frauen-Bundesliga season.

The remaining 12 Union Frauen home weekends were added from the club's official 2026/27 schedule published in July 2026. The club labels them `Rahmentermin`, so the widget keeps them as Friday-to-Sunday windows until exact kickoff times are confirmed.

Everything else is a fixed weekend with no fixed time. The widget shows the weekend and says so.

Note on time zones: several fetched club pages render kickoff times in UTC. `18:30` on the Hertha page is `20:30` CEST. The reconstruction was verified against three independent sources before any time was written down.

### Stadiums
- **Alte Försterei:** 22,012 capacity, 18,395 standing, 3,617 seated. An der Wuhlheide 263, 12555 Berlin. S3 towards Erkner to S Köpenick then about 15 minutes on foot. From BER, S45/S9 to Schöneweide then tram 60/67. Gates open 120 minutes before kickoff.
- **Olympiastadion:** around 74,000. Olympischer Platz 3, 14053 Berlin. U2 to Olympia-Stadion, about 5 minutes on foot; S3/S9 to Olympiastadion is slightly closer to the east gate. Gates open 90 minutes before kickoff.

### Ticketing
- **Union:** members-only window, then a second member phase, then public sale. Tickets personalised and non-transferable. Club states that tickets bought on resale platforms lose validity. Official resale only via the club Ticketbörse. Standing from about 15 EUR.
- **Hertha:** member presale then general sale. Official resale via Clubsale. A fresh club notice published 20 July 2026 lists the 15 August home opener against Heidenheim at 30 to 75 EUR, with general sale from 24 July and Kids4Free valid for that match. Prices and family offers vary by fixture, so the public copy no longer presents the older 17/27/35/42/47/57 table as a season-wide promise.

### Matchday rules
- Bags: nothing over A4 at either ground; Union ban backpacks entirely; Hertha allow A4 with 15 cm depth. Left luggage 4 EUR at Union, 5 EUR at Hertha.
- Payment: both take cash and normal cards; Hertha also Apple Pay and Google Pay. **Neither uses a closed-loop stadium payment card.**
- Hertha: no plastic or glass bottles; tetrapaks up to 1 litre allowed.
- Away sections: Union sector 5, Hertha through the south gate.

### Union culture
- **Weihnachtssingen**, every 23 December since 2003. Started with 89 members of the Alt-Unioner fan club. **28,500 attended in 2025.** Floodlights off at 19:00, candlelight, choirs and brass from the late afternoon.
- **Fans rebuilt the ground themselves in 2008/09:** more than 2,300 volunteers, over 140,000 unpaid working hours.

### The rebuild
2026/27 is the last season at the Alte Försterei in its current form. Expansion work starts after the season. Union play 2027/28 at the Olympiastadion, then return to a planned 34,500-capacity ground (18,800 standing / 15,700 seated), targeted for 2028/29. Capacity was cut from a planned 40,500 after the Senate rejected the matchday traffic concept.

## Checked and deliberately NOT written

- **The Stadtbahn closure angle was investigated and dropped because it is false for this topic.** The 14 June to 12 December 2026 Stadtbahn closure applies to **regional and long-distance trains only**; the S-Bahn runs the Stadtbahn normally throughout, with three weekend exceptions (26 to 29 June, 24 to 27 July, 31 July to 3 August 2026) that all fall before either club's home season and none of which touch the Olympiastadion branch. Writing a matchday transport warning would have been wrong. Verified independently twice.
- **"Union play at the Olympiastadion in 2026/27."** Some aggregators say this. It is wrong by a year: the move is 2027/28.
- **Match ticket as free public transport.** Wanted this, could not verify it. Secondary sources contradict each other on whether it is a Kombiticket and for which zones, and no Hertha or Union primary page states it. The post therefore tells the reader to check their own ticket and not assume, because the downside is a 60 EUR fine.
- **Union's exact 2026/27 price table.** The official shop would not render. "From about 15 EUR standing" is press-derived and hedged accordingly.
- **Alcohol policy at Union**, and any alcohol-free away sector at either ground. No authoritative source found.
- **Standing-terrace etiquette.** No authoritative source. Anything written would have been invention, so it was left out rather than filled in.
- **Olympiastadion exact capacity 74,475.** Aggregator figure only, not confirmed on the official venue page. The post says "around 74,000".
- **Any 2026 renovation or closure at the Olympiastadion.** Checked: none. The venue is fully operational this season.

## Post and widget

- Wix draft: `d94ac01f-eb83-417a-8a83-71813f97b909`, slug `football-match-in-berlin`, status UNPUBLISHED.
- Widget: `berlin-matchday-board`, BerlinTools CMS item `3f7042b0-a8d8-40e9-bd23-a25381cd63ac`.
