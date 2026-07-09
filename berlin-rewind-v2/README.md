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
  No external CSS/JS.**
- The current 30-day archive batch loads from `data/archive-current.json`.
  A 10-photo inlined fallback stays in the game file so the UI still works if
  the archive JSON is temporarily unavailable.
- Photo files load from `assets/photos/<archive-batch>/` under the configured
  asset base. The public default is GitHub Pages so the monthly archive can be
  refreshed without changing the Wix embed script.
- Full images are shown (object-fit: contain), not aggressively cropped.

## Files

- `berlin-rewind-v2-element.js` — the whole game (data + logic + CSS).
- `berlin-rewind-landing-v2-element.js` — public landing wrapper with hero
  cover, local context, CTA sections, and the native game mount.
- `data/archive-current.json` — current 150-photo / 30-day schedule batch.
- `data/archive-YYYY-MM-DD.json` — archived copy of each generated batch.
- `index.html` — standalone, non-indexed local preview.
- `landing.html` — standalone, non-indexed landing preview.
- `SEO_SETTINGS.md` — Wix-ready SEO title, description, canonical, robots, and
  JSON-LD for the final public page.
- `assets/photos/archive-YYYY-MM-DD/*.jpg` — current local archive photos.
- `assets/photos/ph_0xx.jpg` — 10 curated fallback photos (see `CREDITS.md`).

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

Current production target: 150 Bundesarchiv / Wikimedia Commons images per
batch, scheduled as 30 Berlin days with 5 photos per day and no repeats within
the batch. Credit lines stay visible in the reveal UI and in `CREDITS.md`.

Build a new batch from the workspace root:

```bash
node scripts/build-rewind-archive-batch.mjs
```

Useful environment overrides:

```bash
BW_REWIND_ARCHIVE_START=2026-08-08 node scripts/build-rewind-archive-batch.mjs
BW_REWIND_PHOTO_COUNT=150 BW_REWIND_DAYS=30 BW_REWIND_PER_DAY=5 node scripts/build-rewind-archive-batch.mjs
```

The generated `archive-current.json` is what the live game reads. The same
batch is also saved as `archive-YYYY-MM-DD.json` for audit/history.
