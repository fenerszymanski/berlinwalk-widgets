# Hidden Places in Central Berlin — Pre-publish Readback

Checked: 2026-07-14 (Europe/Berlin)

## Scope guard

- New, isolated blog support package only.
- No Wix global header, footer, master page, custom-code rule, audio embed, product page or existing live article was changed.
- Wix blog state at this gate: no draft write yet.

## Content package

- Proposed slug: `hidden-places-central-berlin`
- Rich-content dry run: PASS
- Nodes: 64
- Images: 5
- HTML embeds: 3
- Body H1: 0
- Styled captions: 5
- FAQ schema audit: PASS
- FAQ schema markdown leaks: 0
- FAQ inject map matches source: yes

## Responsive and interaction QA

### Chromium

- Widget desktop: 1440 × 1000, no horizontal overflow.
- Widget mobile: 360 × 732, no horizontal overflow.
- All four clues, layer switch and navigation controls tested.
- FAQ mobile: 390 × 844, six questions rendered, first answer opens, no horizontal overflow.
- Quick Summary and FAQ resolve under `?post=hidden-places-central-berlin`.

### WebKit

- Widget mobile: 402 × 681, no horizontal overflow.
- Fourth clue (portrait Berolina image): page height 1180 px; image height 245 px.
- Four clue controls rendered; fourth clue state confirmed in accessibility snapshot.
- Widget console: 0 errors, 0 warnings.

### Image credits disclosure

- Default state: `hidden=true`, computed `display:none`, `aria-expanded=false` in Chromium and WebKit.
- Open state: five source/licence entries rendered; close button receives focus.
- Close paths: outside click in Chromium and Escape in WebKit both passed.
- Opening and closing the fixed panel did not change document height.
- WebKit mobile after the disclosure was added: page height 1222 px, no horizontal overflow.

## Brand and links

- Yellow CTA computed foreground: `rgb(18, 61, 24)`.
- Yellow CTA computed background: `rgb(255, 230, 0)`.
- Product CTA: `https://www.berlinwalk.com/products/hidden-berlin-audio-route`
- Hub CTA: `https://www.berlinwalk.com/audio-tours`
- Campaign value: `hidden_places_central_berlin`
- No `app.berlinwalk.com`, old booking URL or legacy Mitte slug remains in the package.

## Evidence

- `output/playwright/hidden-berlin-evidence-trail-20260714/chrome-desktop.png`
- `output/playwright/hidden-berlin-evidence-trail-20260714/chrome-mobile.png`
- `output/playwright/hidden-berlin-evidence-trail-20260714/webkit-mobile.png`
- `output/playwright/hidden-berlin-evidence-trail-20260714/webkit-central-mobile.png`
- `output/playwright/hidden-berlin-evidence-trail-20260714/faq-central-mobile.png`
- `output/qa/hidden-places-central-berlin-20260714/faq-seo-audit.md`
