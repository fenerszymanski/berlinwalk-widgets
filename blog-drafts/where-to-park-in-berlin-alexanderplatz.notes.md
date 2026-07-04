# Where to Park in Berlin near Alexanderplatz - Production Notes

Prepared: 2026-07-04, Europe/Berlin.

## Topic

- Title: Where to Park in Berlin near Alexanderplatz: Garages, P+R and Tourist Mistakes
- Focus keyword: where to park in Berlin
- Slug: where-to-park-in-berlin-alexanderplatz
- Search intent: tourists arriving by car who need a practical parking decision near Alexanderplatz, especially before the BerlinWalk meeting point.
- Category: Tourist Tips
- Tags: Berlin Parking, Alexanderplatz Parking, Park and Ride Berlin, Berlin by Car, Berlin Tourist Tips

## Dedupe

- Wix Blog API inventory checked on 2026-07-04: 167 published posts, no current draft results. Existing parking-related live tools exist, but no published Wix Blog post owns the `where to park in Berlin near Alexanderplatz` search angle.
- Local blog sources checked: `blog-drafts/`, `quick-summary/data.json`, `faq/data.json`, `faq/inject.js`, `tools-hub/data.json`, `blog-index/data.json`, and `PROJECT_MEMORY.md`.
- Existing related tools: `alexanderplatz-parking-map` and `berlin-parking-calculator` are live BerlinTools pages. This draft intentionally uses the map as the post-specific embed and keeps calculator/tool-page data unchanged until publish.

## Research Sources Checked

- Berlin.de low-emission zone: https://www.berlin.de/en/tourism/travel-information/1760452-2862820-environmental-zone.en.html
- Berlin LABO environmental sticker application: https://www.berlin.de/labo/mobilitaet/kfz-zulassung/feinstaubplakette/shop.86595.en.php
- WBM RathausPassagen parking: https://www.wbm.de/gewerbe-berlin/rathauspassagen/lage-anfahrt/
- APCOA ALEXA parking: https://www.apcoa.de/en/park-once/locations/berlin/alexa
- Q-Park Am Alexanderplatz: https://www.q-park.de/en-gb/cities/berlin/am-alexanderplatz/
- Berlin Senate Park + Ride: https://www.berlin.de/sen/uvk/mobilitaet-und-verkehr/verkehrsplanung/strassen-und-kfz-verkehr/parkraumbewirtschaftung/park-ride/
- BVG ticket overview: https://www.bvg.de/en/subscriptions-and-tickets/all-tickets
- Berlin.de tickets/fares cross-check: https://www.berlin.de/en/public-transportation/1772016-2913840-tickets-fares-and-route-maps.en.html

## Widget Ideas Considered

1. Alexanderplatz Parking Map: shows garages around the World Clock and keeps the last walk simple. Chosen because the reader problem is spatial and deadline-driven.
2. Garage vs P+R Cost Comparator: compares central parking hours, group size and BVG ticket cost. Useful, but better as a secondary tool link because exact garage prices change.
3. Umweltzone Arrival Checklist: sticker, vehicle height, luggage and arrival buffer triage. Useful as article logic, too narrow as the main Berlin Tool.

Selected: `alexanderplatz-parking-map`. It is already live as a BerlinTools CMS item and directly solves the article's practical reader problem.

## QA Targets

- Exact publish body must pass `node scripts/validate-blog-publish-body.mjs`.
- Rich-content readback must have body H1 count `0`.
- Embeds: Quick Summary, `alexanderplatz-parking-map`, FAQ.
- Caption paragraphs must render centered, italic and 12px in Ricos.
- No internal source/workflow/AI provenance terms in public body.
- Final state must be an unpublished Wix draft.
