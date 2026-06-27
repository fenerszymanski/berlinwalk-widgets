# Berlin Bike Lane Map - Local QA

Generated: 2026-06-27, Europe/Berlin

Local server: `http://127.0.0.1:4192/`
Widget URL tested: `http://127.0.0.1:4192/berlin-bike-lane-map/`

## Correction

Yusuf clarified that the requested widget should be a classic bike-road/cycleway
map, not 8 curated street-example pins. The widget was rebuilt under the same
slug so the existing Wix embed can keep working.

## Current Result

- Widget now uses Leaflet plus live OpenStreetMap/Overpass data for the visible map area.
- It draws mapped dedicated cycle paths, painted bike lanes, bicycle streets and shared/designated bike paths.
- It includes layer filters and Berlin area presets.
- It deduplicates OSM ways, caps large views at 1800 rendered segments for iframe performance, aborts slow Overpass requests, and falls back to a small sample network only if all live endpoints fail.
- Leaflet iframe safeguards remain: no SRI attributes, scoped fallback positioning CSS, repeated `invalidateSize()` calls.
- Blog body text was corrected from "example street situations" to "cycleway network map".
- Wix draft was patched to `?v=20260627b`; readback summary remains `UNPUBLISHED`, 4 embeds, 5 image nodes/all alt text.

## Browser QA Results

| Viewport | Data | Paths | Tiles | Interaction | Overflow |
| --- | --- | ---: | ---: | --- | ---: |
| Desktop 1280px | OpenStreetMap live data | 1800 | 12 | Loader closed; large view capped for speed | 0 |
| 390px mobile | OpenStreetMap live data | 1800 -> 800 | 6 | Painted-lane layer toggle reduced visible paths | 0 |
| 390px mobile preset | OpenStreetMap live data | 40 | n/a | Museum Island preset loaded and loader closed | 0 |

## Checks

- `node scripts/validate-blog-publish-body.mjs berlinwalk-widgets/blog-drafts/berlin-bike-lanes-tourists.body.md`
- `node --check berlinwalk-content-app/create-berlin-bike-lanes-tourists-draft.mjs`
- `node --check berlinwalk-content-app/update-berlin-bike-lanes-tourists-draft.mjs`
- Inline widget script parse via `new Function(...)`
- `git -C berlinwalk-widgets diff --check -- berlin-bike-lane-map/index.html blog-drafts/berlin-bike-lanes-tourists.body.md blog-drafts/berlin-bike-lanes-tourists.notes.md`
- Playwright CLI console check after final QA: `0` errors, `0` warnings.
