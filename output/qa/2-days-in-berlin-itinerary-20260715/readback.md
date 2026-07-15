# 2 Days in Berlin Itinerary - Pre-draft Readback

Checked: 2026-07-15 (Europe/Berlin)

## Scope guard

- New article, Quick Summary, FAQ, route-map widget and BerlinTools metadata only.
- No global Wix header, footer, master page, custom-code rule or audio embed is part of this package.
- The Wix article must remain `UNPUBLISHED` until Yusuf explicitly approves this exact draft.

## Content package

- Target: `2 days in Berlin itinerary`.
- Slug: `2-days-in-berlin-itinerary`.
- Body H1: 0.
- Images: 5, each followed by a styled-caption source line in the Wix conversion.
- Embeds: Quick Summary, Berlin Two-Day Route Map and FAQ.
- Internal links include the canonical Trip Planner, the BerlinWalk tour, the Bernauer Strasse guide, the Berlin Wall audio guide and the weekend guide.
- Current official facts rechecked against BVG, Staatliche Museen zu Berlin, the German Bundestag and the Berlin Wall Foundation on 2026-07-15.

## Rich-content dry run

- Nodes: 91.
- Images: 5.
- HTML embeds: 3.
- Body H1: 0.
- Styled captions: 5.
- Serialized rich-content size: 38,999 bytes.
- Publish-body validator: PASS.

## Route-map QA

### Chromium mobile

- Real OpenStreetMap/Leaflet base map loaded with 7 stops on each day.
- Day 1 to Day 2 switch updated labels, distance, area and stop content.
- No horizontal overflow at mobile width.
- Yellow close button computed colors: foreground `rgb(13, 53, 20)`, background `rgb(255, 230, 0)`.
- Image credits default hidden and `aria-expanded=false`.
- Credits opened with five source/licence entries, moved focus to Close and closed with Escape.
- Opening the fixed credits panel did not increase document height.
- Console: 0 errors, 0 warnings.

### WebKit mobile

- Day switch, map markers and stop sequence rendered.
- No horizontal overflow.
- Credits default hidden, opened with five entries, closed with Escape and returned focus to the trigger.
- Console: 0 errors, 0 warnings.

## Visual package

- Five place-specific photographs are locally optimized to a maximum dimension of 1600 px.
- Source and licence details are recorded in `blog-drafts/2-days-in-berlin-itinerary.visual-sources.md`.
- Public credits are in a compact, default-closed disclosure inside the route-map widget.
- The BerlinTools icon is available at 512 px and 160 px with a prompt/source record kept outside the public article copy.

## Remaining gates

- Rebase onto the latest `origin/main` and resolve append-only data files without dropping newer entries.
- Push and verify GitHub Pages assets.
- Create the exact Wix draft, then read back `UNPUBLISHED`, slug, image/alt, embed, caption and SEO-tag counts.
