# Berlin Rewind V2

Native, self-contained rebuild of the Berlin Rewind archival photo game. It
replaces the old `berlin-rewind` / `berlin-rewind-page` shell and the Wix
custom-embed version, none of which are reused here.

## What it is

Five real Berlin archive photos. For each one you guess the **year** (slider)
and the **district** (four options, a neighbouring district earns partial
credit). Each reveal shows the true year, district, a short note in my voice,
and the archival credit. You end with a total score and a "Berlin eye" tier.

## Architecture (deliberately boring and robust)

- Single custom element `<bw-berlin-rewind-v2>`, light DOM, state on the
  instance, CSS scoped under `.bw-rw-` and injected once.
- **No iframe. No postMessage/resize. No MutationObserver. No global loader.
  No data fetch (photo + district data are inlined). No external CSS/JS.**
- Photo files load from the element script's own directory, resolved from
  `document.currentScript.src`, so the same code works locally and on GitHub
  Pages with no hardcoded origin. Override with `data-asset-base` if ever needed.
- Full images are shown (object-fit: contain), not aggressively cropped.

## Files

- `berlin-rewind-v2-element.js` — the whole game (data + logic + CSS).
- `berlin-rewind-landing-v2-element.js` — public landing wrapper with hero
  cover, local context, CTA sections, and the native game mount.
- `index.html` — standalone, non-indexed local preview.
- `landing.html` — standalone, non-indexed landing preview.
- `SEO_SETTINGS.md` — Wix-ready SEO title, description, canonical, robots, and
  JSON-LD for the final public page.
- `assets/photos/ph_0xx.jpg` — 10 curated archival photos (see `CREDITS.md`).

## Public landing mount

Use this for the public page:

```html
<bw-berlin-rewind-landing-v2></bw-berlin-rewind-landing-v2>
<script src="https://fenerszymanski.github.io/berlinwalk-widgets/berlin-rewind-v2/berlin-rewind-landing-v2-element.js" defer></script>
```

If using Wix Studio's Custom Element panel:

- Tag name: `bw-berlin-rewind-landing-v2`
- Server URL:
  `https://fenerszymanski.github.io/berlinwalk-widgets/berlin-rewind-v2/berlin-rewind-landing-v2-element.js`

The landing wrapper loads the native game automatically, so the Wix page should
not mount the bare game element as the only visible content.

## Bare game mount

```html
<bw-berlin-rewind-v2></bw-berlin-rewind-v2>
<script src="https://fenerszymanski.github.io/berlinwalk-widgets/berlin-rewind-v2/berlin-rewind-v2-element.js" defer></script>
```

## Photos

10 Bundesarchiv images via Wikimedia Commons, CC BY-SA 3.0 DE, downloaded and
resized locally so the game does not hotlink and stays stable on mobile. Two
scans (`ph_003`, `ph_009`) had a baked-in caption strip with the date printed
on it; that bottom margin was cropped so it cannot spoil the year guess. Credit
lines stay visible in the reveal UI and in `CREDITS.md`.

## Phase 2 (intentionally deferred for stability)

- Daily photo set + streak + localStorage.
- Image share card.
- Larger photo pool.
