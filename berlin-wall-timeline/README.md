# Berlin Wall Timeline

An immersive, scroll-driven story of the Berlin Wall from 1945 to 1990, built
the same way as Berlin Rewind: one native Custom Element mounted on a Wix page,
served from GitHub Pages, no iframe.

## What it is

A single sticky stage carries a real-geography SVG scene that redraws as the
reader scrolls through nine full-screen chapters:

1. **Hero** — `The Wall`, 1945 to 1990.
2. **Four sectors** — Berlin's real Ortsteile resolve into the four occupation
   zones.
3. **The Airlift** — 1948 blockade; real air corridors stream into Tempelhof,
   Gatow and Tegel.
4. **The Wall goes up** — August 13, 1961; the official 1989 Wall geometry
   draws itself around West Berlin and reveals the real city as an island.
5. **The death strip** — the map flips to a cross-section diagram; inner wall,
   signal fence, lights, watchtower, dog run, raked sand, trench, and the Wall
   build up layer by layer. Each layer is **tappable** for a one-line note.
6. **The escapes** — the camera moves toward Bernauer Strasse and Tunnel 57;
   counters tick up before the cross-section returns.
7. **The fall** — November 9, 1989; the concrete panels topple, a crowd streams
   across, and the whole surface floods from Berlin-red night to brand green.
8. **What is left** — the real Wall trace becomes a dotted city path, with
   Bernauer Strasse, East Side Gallery, Checkpoint Charlie, Brandenburg Gate
   and the tour start at Alexanderplatz.
9. **Walk it** — the free-tour booking CTA.

A pinned HUD shows a live **year counter** (1945 → 2026) and the current chapter
name; a right-side rail lets the reader jump between chapters.

## Architecture (Rewind pattern, deliberately boring and robust)

- Single custom element `<bw-wall-timeline>`, **light DOM**, state on the
  instance, all CSS scoped under `.bw-wt-` and injected once.
- **No iframe. No postMessage/resize. No MutationObserver. No global loader.
  No external CSS/JS. No web fonts** (Montserrat with system fallback).
- The immersive stage uses `position: sticky` **inside the element** (not
  `position: fixed`), and all scroll progress is computed from
  `getBoundingClientRect()` relative to the viewport. This means the experience
  works no matter what sits above it in the Wix page, and it never hijacks the
  whole document.
- The colour flood, animation gates, and reduced-motion handling are all scoped
  to the element root, so nothing leaks onto the rest of the page.
- `assets/map/map-data.json` is a compact, pre-projected real-Berlin map package
  containing the city geometry, occupation sectors, Wall layers and story
  landmarks. Waterway source data remains in the package for reproducibility,
  but the timeline deliberately does not render rivers or canals so the sector
  story stays visually clean. It loads once from the pinned asset bundle and
  never calls a live tile provider. If it cannot load, the original schematic
  scene remains available as a fallback.
- `assets/map/SOURCES.md` records the Berlin Open Data, Berlin Ortsteile and
  OpenStreetMap inputs. Ortsteile are used to dissolve the four story sectors;
  individual district outlines and labels are deliberately not rendered.
  `_build/build_map_data.py` regenerates the package from refreshed source
  snapshots.
- The archival photo layer and social cover remain in `assets/` as independent
  enhancements; photos are not a map dependency.

## Files

- `wall-timeline-element.js` — the whole experience (data + logic + CSS + SVG).
- `_build/build_map_data.py` — deterministic map-data build script.
- `index.html` — standalone, non-indexed local preview.
- `assets/map/map-data.json` — runtime real-geography path package.
- `SEO_SETTINGS.md` — Wix-ready SEO title, description, canonical, robots, OG,
  and JSON-LD for the final public page.
- `assets/social/berlin-wall-timeline-1200x630.jpg` — public-domain historical social cover.

## Public mount

Final page target: `https://www.berlinwalk.com/berlin-wall-timeline`.

Use this on the Wix page (global header + footer hidden for a full-bleed feel,
same as `paid-landing`):

```html
<bw-wall-timeline></bw-wall-timeline>
<script src="https://fenerszymanski.github.io/berlinwalk-widgets/berlin-wall-timeline/wall-timeline-element.js?v=wall-timeline-v1-20260711e" defer></script>
```

If using Wix Studio's Custom Element panel:

- Tag name: `bw-wall-timeline`
- Server URL:
  `https://fenerszymanski.github.io/berlinwalk-widgets/berlin-wall-timeline/wall-timeline-element.js`

The element sets its own SEO/meta/JSON-LD as a safety net when it detects the
final `/berlin-wall-timeline` path; on any other host it renders `noindex`.

## QA

- `index.html#bwqa=<scrollY>` scrolls to a fixed offset on load and force-reveals
  every card, for deterministic headless screenshots of each chapter.
- Verified per chapter with headless Chrome at 1280x800 and 390-wide mobile.

## Next (enhancements, not blockers)

- Wire deep links from the three live Wall blog posts
  (`the-berlin-wall-where-it-stood-and-what-s-left-in-2026`,
  `where-was-the-berlin-wall-interactive-map`, `east-side-gallery-berlin-guide`).

The sitewide `js/blog-journey-inject.js` now has a Wall-specific timeline card
ready for those three slugs. Repin/publish that helper only after the Wix page
exists, so readers are never sent to an unfinished route.

The first archival photo layer is now wired into the 1961, escape and 1989
chapters. Each inset carries a compact source/licence line; full source URLs
and licence notes live in `assets/photos/SOURCES.md`.
