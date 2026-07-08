# Is the DDR Museum Worth It — Production Notes

Run date: 2026-07-08 Europe/Berlin (daily blog automation, run 3 / evening slot).

## Topic Decision

- Title: `Is the DDR Museum Worth It? Tickets, Queues, and What to Expect in 2026`
- Focus keyword: `DDR Museum`
- Slug: `is-the-ddr-museum-worth-it`
- Category: `Tourist Tips` (attraction "is it worth it?" pattern)
- Search intent: high-intent tourists deciding whether to pay for a popular, central,
  interactive museum, and wanting tickets/hours/queue/what-to-expect info.
- Why chosen: clean gap. The site already runs the proven "Is X worth it?" attraction
  format (Pergamon, TV Tower, WelcomeCard, Humboldt Forum), but the DDR Museum - one of
  Berlin's most visited museums - had zero dedicated coverage across 100 published posts
  and 100 drafts (Wix API checked 2026-07-08). Mentioned only in passing elsewhere.
  Balances the category away from the transport-heavy recent runs (today's earlier draft
  was bike rental) toward an attractions/first-day-planning angle. Strong tour tie-in:
  the museum is a 10-minute walk from the Alexanderplatz World Clock tour start.

## Dedupe check (2026-07-08, Wix Blog API)

- 0 DDR-matching drafts or published posts.
- Only one same-day Claude daily DRAFT today (renting-a-bike, 12:38, UNPUBLISHED). Jaywalking
  and e-scooters were PUBLISHED today (approved by Yusuf), not draft conflicts. No Codex
  same-day daily-blog draft conflict found.

## SEO Plan

- SEO title: `Is the DDR Museum Worth It? Tickets & Best Time to Visit (2026)`
- Meta description: focus keyword + worth-it verdict + price + the timing/crowd angle.
- Focus keyword `DDR Museum` present in title/H1, H2s, body, meta description, slug.
- Tags: DDR Museum Berlin, Berlin Museums, Cold War Berlin, GDR History, Berlin Tourist Tips.

## Research Sources Checked (2026-07-08)

- Official DDR Museum "Plan your visit": https://www.ddr-museum.de/en/visit
  (open daily 09:00-21:00, early close 24 & 31 Dec; adult 13.90 EUR, reduced 8.50 EUR,
  under 6 free; groups 9.00 / school 5.50; buy online or on site; barrier-free from main
  entrance; Karl-Liebknecht-Str. 1, 10178 Berlin).
- Official DDR Museum home: https://www.ddr-museum.de/en (hands-on/interactive; Trabant
  simulator, prefab apartment, Stasi/surveillance, Wall, consumer goods; opened 2006;
  10M+ visitors; "one of the most visited museums in Berlin"; 360,000+ objects).
- Third-party listings (berlin-info.info, visitBerlin) cross-checked hours/price; used the
  official figures where they differed (official 13.90/8.50 > third-party 13.50/8.00).

## Internal Links (all live published posts)

- /post/is-museum-island-free-tickets-prices-and-what-to-actually-skip (nearby, private vs state)
- /post/berlin-museum-pass-vs-single-tickets-which-one-saves-you-money (pass does NOT cover it)
- /post/cold-war-berlin-in-5-key-locations-you-can-still-visit (deeper GDR pairing)
- /post/how-berlin-was-divided-a-simple-guide-to-east-vs-west (context)
- /book-berlin-walking-tour/berlin-free-walking-tour-tip-based (tour connection)

## External Links

- Official DDR Museum visit/tickets page.

## Widget Ideas

1. `DDR Museum crowd-and-time planner` - pick day type (weekday / weekend-holiday / rainy)
   and see a re-weighting hour-by-hour crowd bar chart across the 09:00-21:00 window, with
   the two calm windows flagged and a plain-English "go now" line. CHOSEN.
2. `Is the DDR Museum worth it for you?` - traveler-type fit checker -> verdict.
3. `Berlin GDR-history museum picker` - DDR Museum vs Stasi Museum vs Wall Memorial by intent.

Chosen: idea 1. It targets the article's actual reader mistake (going at the worst hour to a
small, crowded museum) and is a genuinely useful standalone tool. Built fresh as a re-weighting
hourly crowd bar chart - deliberately NOT the segmented-dial + ranked-card + fit-bar interaction
of the recent bike-rental finder. Slug: `ddr-museum-crowd-planner`.

## Build Status

- Quick Summary key: `is-the-ddr-museum-worth-it`
- FAQ key: `is-the-ddr-museum-worth-it` (+ slug-map short + full-title slug, inject regenerated)
- Widget/tool slug: `ddr-museum-crowd-planner`
- Visuals: 5 Wikimedia images (3 CC attribution-required + 2 PD -> Image Credits block present).
  No AI images. Cover = reconstructed living room.
- BerlinTools icon: BLOCKED - glossy 3D icon must come from Codex/logged-in ChatGPT image gen,
  not available in this non-interactive automation run. Same precedent as the 2026-07-08 bike
  draft. Widget still ships as the in-post embed. tools-hub card + CMS /tools page intentionally
  deferred until the icon exists (do not ship a placeholder/generic icon).
- Public body must not include this notes file or any provenance.
