# Berlin Wall Timeline

An immersive, scroll-driven story of the Berlin Wall from 1945 to 1990, built
the same way as Berlin Rewind: one native Custom Element mounted on a Wix page,
served from GitHub Pages, no iframe.

## What it is

A single sticky stage carries an SVG scene that redraws as the reader scrolls
through nine full-screen chapters:

1. **Hero** — `The Wall`, 1945 to 1990.
2. **Four sectors** — the divided-city map paints in the four occupation zones.
3. **The Airlift** — 1948 blockade; planes stream into Tempelhof.
4. **The Wall goes up** — August 13, 1961; the red Wall line draws itself all
   the way around West Berlin and reveals it as an island.
5. **The death strip** — the map flips to a cross-section diagram; inner wall,
   signal fence, lights, watchtower, dog run, raked sand, trench, and the Wall
   build up layer by layer. Each layer is **tappable** for a one-line note.
6. **The escapes** — counters tick up; Tunnel 57 draws under the strip.
7. **The fall** — November 9, 1989; the concrete panels topple, a crowd streams
   across, and the whole surface floods from Berlin-red night to brand green.
8. **What is left** — today's map: Bernauer Strasse, East Side Gallery,
   Checkpoint Charlie, and the tour start at Alexanderplatz.
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
- `assets/` is reserved for the archival photo layer and social cover (see
  "Next" below). The experience works today with the interactive SVG scenes
  alone; photos are an enhancement, not a dependency.

## Files

- `wall-timeline-element.js` — the whole experience (data + logic + CSS + SVG).
- `index.html` — standalone, non-indexed local preview.
- `SEO_SETTINGS.md` — Wix-ready SEO title, description, canonical, robots, OG,
  and JSON-LD for the final public page.
- `assets/social/berlin-wall-timeline-1200x630.jpg` — public-domain historical social cover.

## Public mount

Final page target: `https://www.berlinwalk.com/berlin-wall-timeline`.

Use this on the Wix page (global header + footer hidden for a full-bleed feel,
same as `paid-landing`):

```html
<bw-wall-timeline></bw-wall-timeline>
<script src="https://fenerszymanski.github.io/berlinwalk-widgets/berlin-wall-timeline/wall-timeline-element.js?v=wall-timeline-v1-20260710i" defer></script>
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
