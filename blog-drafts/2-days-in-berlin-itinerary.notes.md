# 2 Days in Berlin Itinerary - Internal Production Notes

Status: local production package in progress. Do not publish without Yusuf's explicit approval for this exact draft.

## SEO ownership

- Focus keyword: `2 days in Berlin itinerary`
- Secondary: `Berlin two day itinerary`, `what to do in Berlin in 2 days`, `Berlin 2-day itinerary`, `first time Berlin itinerary`
- Recommended title/H1: `2 Days in Berlin: A Realistic Itinerary for First-Time Visitors`
- SEO title: `2 Days in Berlin: A Realistic Itinerary | BerlinWalk`
- Slug: `2-days-in-berlin-itinerary`
- Category: Tourist Tips
- Search intent: first-time visitor with two mostly full days who needs a coherent route, not an event list.

## Cannibalization boundary

- Existing `Berlin in 3 Days` keeps the three-layer / three-day intent.
- Existing `What's Happening in Berlin This Weekend?` keeps weekend events, Sunday behaviour and live-listing intent. This new page mentions that guide once and does not target `weekend` or `48 hours` in its title, H1, slug or meta.
- `/berlin-trip-planner` remains the interactive/commercial owner. This article provides one sample route and sends date-, stay- and arrival-specific needs to the Planner.

## Current source checks - 15 July 2026

- BVG 24-hour ticket: https://www.bvg.de/en/subscriptions-and-tickets/all-tickets/24h-tickets/24h-ticket
- Staatliche Museen opening hours: https://www.smb.museum/en/plan-your-visit/opening-hours/
- Museum Island visitor information and Pergamon closure: https://www.smb.museum/en/museums-institutions/museumsinsel-berlin/plan-your-visit/
- Reichstag dome registration and 2026 maintenance closures: https://www.bundestag.de/en/visittheBundestag/dome/registration-245686
- Berlin Wall Memorial multimedia guide / outdoor hours: https://mmg.stiftung-berliner-mauer.de/en/
- East Side Gallery visitor information: https://www.berlin.de/en/attractions-and-sights/3559756-3104052-east-side-gallery.en.html
- SERP/editorial benchmark, not copied: https://www.visitberlin.de/en/48-hours-berlin

## Widget concepts considered

1. Two-Day Route Map - chosen. A real OpenStreetMap route with Day 1 / Day 2 progression, exact place advice and the M10 handover.
2. Berlin Time Budget Dial - rejected because it would become a generic calculator and code-drawn visual.
3. Landmark Priority Picker - rejected because it repeats an overused picker/card interaction and duplicates the Trip Planner's job.

## Internal links planned

- Canonical Trip Planner twice
- Homepage / walking tour once
- Bernauer Strasse visitor guide
- Death Strip audio product
- Existing Berlin weekend guide

## Publish gate

- Exact body must pass `scripts/validate-blog-publish-body.mjs`.
- Body H1 count must remain zero after Ricos conversion.
- Wix final state must remain UNPUBLISHED until Yusuf reviews this exact draft.
- Required widget, Quick Summary and FAQ assets must be pushed and served before handoff.

