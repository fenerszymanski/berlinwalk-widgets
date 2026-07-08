# Berlin Day Survival V2

Native, self-contained rebuild of the Berlin Day Survival game. It replaces the
retired `berlin-day-survival*` folders, which failed on real iOS Safari/Chrome
because of the old iframe / resize / global-loader shell (see
`../archive/berlin-day-survival-logic-20260707.md`).

## What it is

A one-minute first-day budget game: pick a food budget, make six real Berlin
decisions, keep your Wallet, Fuel and Smarts alive, and get a shareable
survival type. Negative wallet fails as **Budget Busted**. Every round opens
with a BerlinWalk-brand editorial illustration, and every result type has its
own illustrated hero card.

## Architecture (deliberately boring and robust)

- Single custom element `<bw-day-survival-v2>`, light DOM, all state on the
  element instance, all CSS scoped under `.bw-dsv-` and injected once.
- **No iframe. No postMessage/resize. No MutationObserver. No global loader.
  No parent-height messaging. No external CSS/JS. No data fetch.** The only
  network requests are the local illustration JPGs, loaded from the element
  script's own directory (`document.currentScript`) so it works local + on
  GitHub Pages; each has a graceful `onerror` that hides the band if it fails.
- Grows in normal document flow (no fixed `100vh` phone-frame). Buttons are
  >=44px touch targets.

## Files

- `day-survival-v2-element.js` — the whole game (data + logic + CSS).
- `day-survival-landing-v2-element.js` — full landing page wrapper that embeds
  the game plus hero copy, local logic, CTA, and more-games links.
- `index.html` — standalone, non-indexed local preview.
- `landing.html` — standalone, non-indexed landing preview.
- `SEO_SETTINGS.md` — Wix-ready SEO title, description, canonical, robots, and
  JSON-LD for the final public page.
- `assets/social/berlin-day-survival-v2-social-1200x630.jpg` — textless
  hero/preview cover for the landing page and games cards.
- `assets/source/day-survival-v2-social-text-card-20260707.jpg` — archived old
  text-heavy social card, kept only for provenance.
- `assets/scenes/*.jpg` — 6 per-round editorial illustrations (1000x563).
- `assets/results/*.jpg` — 9 per-result-type illustrations (1000x563).

## Landing page mount

Use this for the public landing page:

```html
<bw-day-survival-landing-v2></bw-day-survival-landing-v2>
<script src="https://cdn.jsdelivr.net/gh/fenerszymanski/berlinwalk-widgets@09c237e/berlin-day-survival-v2/day-survival-landing-v2-element.js" defer></script>
```

If using Wix Studio's Custom Element panel:

- Tag name: `bw-day-survival-landing-v2`
- Server URL:
  `https://cdn.jsdelivr.net/gh/fenerszymanski/berlinwalk-widgets@09c237e/berlin-day-survival-v2/day-survival-landing-v2-element.js`

GitHub Pages usually works after propagation:
`https://fenerszymanski.github.io/berlinwalk-widgets/berlin-day-survival-v2/day-survival-landing-v2-element.js`.
If it is still 404 or serving the previous build, use the commit-pinned
jsDelivr URL above.

## Bare game mount

On a fresh Wix page, Custom Code (Body end):

```html
<bw-day-survival-v2></bw-day-survival-v2>
<script src="https://fenerszymanski.github.io/berlinwalk-widgets/berlin-day-survival-v2/day-survival-v2-element.js" defer></script>
```

That is the entire integration. No iframe wrapper, no loader, no resize script.

## Local preview + QA

```bash
python3 -m http.server 8765 --bind 127.0.0.1   # from the repo root
open http://127.0.0.1:8765/berlin-day-survival-v2/
```

QA driven with Playwright Chromium + WebKit at 390px: full flow, trap path =>
Budget Busted, survivor path => a survival type, 0 console errors, 0 horizontal
overflow, reload-safe.

## Content model

- 3 budgets (EUR 10 Hard / 15 Normal / 20 Comfort).
- 6 rounds: morning, hydration, landmark, lunch, afternoon, night.
- One random condition per game (first-day, late-arrival, heatwave, sunday-shops,
  sunny-saturday, rainy) that shifts intro copy and a few choice outcomes.
- Result types: Budget Busted, Sunday Casualty, Alexanderplatz Victim, Doner
  Loyalist, Club Mate Creature, Spaeti Strategist, Budget Saint, Late-Night
  Survivor, Smart Wanderer.

## Phase 2 (intentionally deferred for stability)

- Optional German-accented audio line per screen (ElevenLabs `Jonas`).
- Downloadable / image share card.
- Deeper Sunday and heatwave branching.
