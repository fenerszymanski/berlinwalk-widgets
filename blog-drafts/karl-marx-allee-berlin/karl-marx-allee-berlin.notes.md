# Karl-Marx-Allee — internal planning notes (NOT for publish body)

Run: 2026-07-22 ~17:05 CEST slot (3rd Claude daily-blog run of the day).

## Topic decision + dedupe

- Focus keyword: `Karl-Marx-Allee`
- Slug: `karl-marx-allee-berlin`
- Categories: Berlin History (primary) + Tourist Tips
- Dedupe: 248 published slugs scanned (Wix API), 2 same-day UNPUBLISHED drafts
  (spandau-berlin, leipzig-day-trip-from-berlin), 165 tool slugs, 239 QS / 236
  FAQ keys. Zero KMA coverage anywhere. Only adjacent posts are the two
  Marx-Engels statue posts (statues at Marx-Engels-Forum, different subject)
  and `cold-war-berlin-in-5-key-locations` (overview listicle). A dedicated
  walk guide is clearly distinct.
- Same-day category balance: Spandau (district old town), Leipzig (day trip).
  KMA adds a central-Berlin history walk — different content type.

## SERP answerability verdict

- REJECTED forms: `what is Karl-Marx-Allee`, `how long is Karl-Marx-Allee`,
  `who built Karl-Marx-Allee` — all single-fact/one-line answers Google shows
  in the SERP box.
- ACCEPTED reframe: which stretch of the 2.3 km is actually worth walking, in
  which direction, and which facade details to look for building by building
  (plus what is inside: Sibylle exhibition, freshly reopened Kino
  International, Café Moskau being an event venue not a café). Judgment +
  route + detail-spotting — cannot fit in a SERP box.

## Verified facts + sources (checked 2026-07-22)

- Kino International reopened: open house 22 Feb 2026, pre-opening 26 Feb
  2026, festive opening 3 Mar 2026, after 18-month renovation Apr 2024-Feb
  2026 (heating -70% energy, 4K laser, 7.1 sound, elevator + accessible WCs;
  Dickmann Richter Architekten). Source:
  https://www.berlin.de/landesdenkmalamt/aktivitaeten/kurzmeldungen/2026/artikel.1641631.php
  Operator Yorck Kinos, address Karl-Marx-Allee 33, OV/OmU screenings:
  https://www.yorck.de/en/cinemas/kino-international
  Built 1961-63, architect Josef Kaiser, opened 15 Nov 1963; 9 Nov 1989
  premiere of "Coming Out" as Wall fell.
- Boulevard: ~2.3 km, ~90 m wide, Alexanderplatz to Frankfurter Tor. Built
  1949/1952-1960 (phase 1 wedding-cake blocks Strausberger Platz->Frankfurter
  Tor); renamed Grosse Frankfurter Str. -> Stalinallee 1949 (Stalin's 70th
  birthday) -> Karl-Marx-Allee 1961. Architects incl. Hermann Henselmann,
  Richard Paulick, Egon Hartmann, Hans Hopp, Kurt W. Leucht, Josef Souradny.
  Source: https://en.wikipedia.org/wiki/Karl-Marx-Allee
- 1953: 16 June strike of construction workers on Stalinallee over raised
  work quotas -> 17 June uprising crushed by Soviet tanks; memorial plaque on
  the Allee. Sources: Wikipedia + https://www.dark-tourism.com/index.php/1168-karlmarxallee
- Stalin monument: erected Aug 1951 (opposite the former Deutsche
  Sporthalle), removed secretly in the night of 13/14 Nov 1961; workers hid
  fragments (an ear, piece of moustache) which later surfaced in the Allee
  history exhibition at Café Sibylle. Sources: dark-tourism.com,
  top10berlin.de, gdrobjectified.wordpress.com. Sporthalle demolition year
  differs across sources (1971 vs 1972) — NOT published.
- Café Sibylle: Karl-Marx-Allee 72, open (active 2026 listings/reviews),
  historic 1950s interior + small KMA history exhibition, free. Opening hours
  CONFLICT across sources (Yelp 9-19 daily vs Wed-Sun 10-18 vs dark-tourism
  10-19) — exact hours NOT published, post says check before visiting.
- Café Moskau: Karl-Marx-Allee 34, opened 1964, since 2009 a rented event
  venue (not a public café) — Sputnik replica on the facade. Sources:
  https://www.cafemoskau.com/en/nav-2 , de.wikipedia Café Moskau.
- Frankfurter Tor twin towers by Henselmann, referencing the Gendarmenmarkt
  cathedral domes (Gontard). U5 under the full length: Schillingstrasse,
  Strausberger Platz, Weberwiese, Frankfurter Tor; M10 tram at Frankfurter
  Tor. Ceramic facade tiles (Meissen) famous for falling off in later
  decades.
- UNESCO: Karl-Marx-Allee + Interbau 1957 (Hansaviertel) submitted for the
  German tentative list (2021-2023 round); still under national evaluation,
  NOT on the World Heritage list. Source:
  https://hansaviertel.berlin/en/unesco-world-heritage-application/
  Framing used: "on Germany's shortlist path" carefully as candidate, not
  listed status.

## Deliberately NOT published

- Exact Café Sibylle opening hours (sources conflict).
- Deutsche Sporthalle demolition year (1971 vs 1972 conflict).
- Any claim the moustache/ear fragments are on display TODAY (post-2018
  operator change not verifiable) — story framed as where fragments ended up.
- "Wider than the Champs-Élysées" style comparisons (unverified).
- Hotel Berolina / Mokka-Milch-Eisbar fates (not verified this run).

## Widget ideas (3+) and decision

1. **Facade Spotter (CHOSEN)** — real Commons photos of five spots with
   tappable hotspot pins; each pin decodes one real detail (tiles, tower
   domes, Sputnik, arcades, lanterns) and says where to stand + nearest U5
   stop. Fresh interaction: no existing BerlinWalk tool uses photo-hotspot
   decoding (checked 165 slugs; time-layer, walk-planner, decoder-text,
   photo-missions all different models).
2. 1953 hour-by-hour uprising scrubber — rejected: berlin-marathon-day owns
   the time-scrub simulator model; sensitive-history gamification risk.
3. Proportional boulevard bands with detail density — rejected: too close to
   berlin-wall-trail-sections (yesterday).
4. Then/now archival slider — rejected: mehringplatz/potsdamer-platz
   time-layer tools own that model.

Widget slug: `karl-marx-allee-spotter`, title `Karl-Marx-Allee Facade Spotter`,
hubCategory HistoryCultureLandmarks, type Explainer.

## Internal links plan

/post/berlin-wall-trail (walk companion), /post/gendarmenmarkt-berlin (tower
domes reference), /post/hohenzollern-berlin? (skip), /post/stolpersteine-berlin
(nearby history layer), /post/how-berlin-was-divided (context),
/post/berlin-on-a-monday (Sibylle/monday planning)?, /post/one-day-in-berlin,
/tools/berlin-two-day-route-map?, /post/east-side-gallery-berlin-guide (next
stop continuation via Warschauer Str), booking page + tour connection at
Alexanderplatz (tour starts there; KMA starts there too — natural after-tour
extension). External: berlin.de Landesdenkmalamt Kino article, yorck.de,
hansaviertel.berlin UNESCO page, cafemoskau.com.
