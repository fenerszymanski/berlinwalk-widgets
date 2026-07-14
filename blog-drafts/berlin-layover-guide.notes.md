# Berlin Layover Guide — Production Notes (internal)

Created 2026-07-14 (Claude daily-blog run 2 of 3). Distinct-topic gap confirmed
against 201 published + 220 draft Wix posts: no layover/stopover/transit post
existed. Related-but-distinct posts linked, not duplicated:
`how-to-get-from-berlin-airport-to-alexanderplatz-the-easy-way`,
`berlin-ab-abc-ticket-zones`, `luggage-storage-in-berlin-2026`,
`berlin-in-3-days-...`.

## SEO
- Title: How to Spend a Layover in Berlin: What You Can Actually See in a Few Hours (2026)
- SEO title: Berlin Layover: What to See in a Few Hours (2026)
- Slug: berlin-layover-guide
- Focus keyword: "Berlin layover" (in title, H2, body, meta, slug)
- Secondary: leave BER airport during layover, BER to city, how long a layover to visit Berlin, things to do on a Berlin layover
- Category: Tourist Tips
- Intent: transit passengers at BER deciding whether to leave the airport and what they can see.

## Widget ideas considered
1. Layover time-budget calculator (CHOSEN) — computes real city time after buffers + verdict + plan + optional clock deadlines. Solves the article's actual reader decision.
2. A BER-to-sight distance/route picker — rejected, overlaps airport-to-alex post.
3. A "what closes / opening hours vs my layover" checker — rejected, thinner and less decisive.

## Widget: berlin-layover-planner
- Slider (2-12h) + two Schengen toggles + optional landing time.
- Proportional timeline bar (arrival / train / city / train / buffer), yellow city segment (dark text per contrast rule).
- Buckets: <45m stay airside (red), 45-120m quick taste (yellow), 120-210m historic core (green), >210m relaxed (green).
- Model: deplane 20m, +30m if arriving from outside Schengen, 45m train each way, return buffer 90m Schengen / 120m non-Schengen. ABC single 5.00 EUR (2026).

## BerlinTools promotion — DEFERRED
Tool-page / CMS item / glossy icon deferred: no non-paid AI icon path available
headless in this automation, and paid image APIs are approval-gated + off for
daily blog. Matches phone-ticket / pronouncer / Prenzlauer Berg precedent.
Widget lives as an in-article GitHub Pages embed only. Not added to
tools-hub/data.json or tools-home/data.json.

## Facts verified 2026-07-14 (sources in visual-sources + WebSearch notes)
- FEX: BER T1 -> Hauptbahnhof ~23 min, every 15 min, 04:00-01:00 (official BER page).
- S9: direct to Alexanderplatz, ~every 20 min (official BER page).
- Station under Terminal 1. BER in zone C -> ABC ticket. ABC single 5.00 EUR, ABC 24h 12.90 EUR (2026).
- BER lockers: Terminal 1, level U1, ~7-10 EUR/day.
- Schengen transit: visa-exempt / Schengen-visa holders may leave; A-visa nationals must stay airside; EES exit check when onward flight is non-Schengen.
