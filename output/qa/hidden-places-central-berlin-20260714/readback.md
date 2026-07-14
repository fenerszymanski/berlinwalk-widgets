# Hidden Places in Central Berlin — Pre-publish Readback

Checked: 2026-07-14 (Europe/Berlin)

## Scope guard

- New, isolated blog support package only.
- No Wix global header, footer, master page, custom-code rule, audio embed, product page or existing live article was changed.
- Wix blog state at this gate: one new draft exists and remains `UNPUBLISHED`.
- The draft was not published, the Wix site was not published and no Search Console indexing request was made.

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

## GitHub Pages deployment readback

- Source commit: `e67bc87` (`Add Hidden Berlin discovery article package`).
- GitHub Pages workflow run: `29352187416`, completed successfully.
- Live widget SHA-256: `d78556fd0c668cd851d6eb70f8c4752832e3762f95f9b2381800f3871fce202f`, byte-identical to the committed source.
- Live widget, Quick Summary, FAQ, FAQ injection and five optimized image assets returned HTTP 200.
- Live data readback: Quick Summary items `6`; FAQ items `6`; FAQ injection contains `hidden-places-central-berlin`.
- Chromium and WebKit live widget QA repeated the local result: no horizontal overflow, four working clues, fixed default-closed credits panel and correct product/hub links.

## Wix draft readback

- Draft ID: `1da754e3-4b91-4a0e-a3ad-9d1a2c053abb`.
- Edit URL: `https://manage.wix.com/dashboard/12ee5ea0-70a7-492f-8020-ffb27cbb630f/blog/drafts/1da754e3-4b91-4a0e-a3ad-9d1a2c053abb/edit`.
- Status: `UNPUBLISHED`; `hasUnpublishedChanges=true`.
- Slug: `hidden-places-central-berlin`.
- Readback counts: five images with five alt texts, three HTML embeds, zero body H1 nodes, five styled captions, sixteen SEO tags and five post tags.
- Category: Tourist Tips.
- Embed URLs and fallback heights:
  - Quick Summary: `quick-summary/?post=hidden-places-central-berlin&v=20260714hb1`, `1260px`.
  - Evidence Trail: `hidden-berlin-evidence-trail/?v=20260714hb1`, `1320px`.
  - FAQ: `faq/?post=hidden-places-central-berlin&v=20260714hb1`, `1360px`.
- All three embeds load the shared auto-resize runtime.
- Public URL returned HTTP 404, which is the correct result while the draft is unpublished.
- Internal workflow/provenance leak scan: clean.

## Post-write global smoke and newly found blocker

- Homepage, `/audio-tours`, both live product URLs and the booking page kept the expected visible header height and had no horizontal overflow during the post-write smoke.
- The large `4063px` outer Wix container on `/audio-tours` is the route-specific content host, not the visible header. The visible `.bw-header` remained `93px` through eight toolbar-height cycles.
- Hidden Berlin and Death Strip custom-embed IDs and revision numbers remained unchanged at revision 14. This blog-draft operation did not write or publish audio product code.
- Clean WebKit cold loads passed for both products. Clean Chromium passed Death Strip.
- Hidden Berlin showed a pre-existing intermittent cold-load race: two of three Chromium cold loads mounted the product iframe; one did not. On the failed load the correct route and route-specific bootstrap were present, the verified target section appeared later, but the iframe was still absent and the console contained no application error.
- Source review identifies the failure mode in the existing route-specific mount retry: `ensure()` returns false both while the target is absent and when the mounted result is stable, so the timer can stop after roughly 4.5 seconds before Wix creates the target section.
- This issue was not caused by the new draft. It is a publish blocker for sending new editorial traffic to the Hidden Berlin product.
- No live audio fix was attempted in this content release. Any repair must be a separate, exact-route change with pre-write revision/hash checks, delayed-target and off-route tests, immediate API readback, Chromium plus WebKit cold-load repetition, full-site regression and a prepared rollback.
