# Audio support main-domain package QA

Date: 2026-07-15

Scope: local package and local browser only

Live mutation: none

## Automated package checks

- `node scripts/qa-audio-support-main-domain-packages.mjs`: **PASS, 93 checks**.
- `node scripts/create-audio-support-main-domain-drafts.mjs`: **PASS in default dry-run mode**.
  - App vs no-app: 48 Ricos nodes, 5 images, 5 alt texts, 5 styled captions, 3 embeds, 0 body H1.
  - Self-guided audio: 52 Ricos nodes, 5 images, 5 alt texts, 5 styled captions, 3 embeds, 0 body H1.
- Root blog body validator: **OK for both bodies**.
- `node scripts/audit-faq-seo.mjs`: **PASS** for schema health, with no broken slug-map reference and no Markdown leak in schema.
- Draft script syntax and package QA script syntax: **PASS**.

## Content checks

- Each article has at least 1,100 words, five inline images and five caption lines.
- Each article links all five current paid audio routes and uses the current €4.99 price.
- Each article links the Audio Tours hub, free sampler, live tour, Trip Planner and the sibling main-domain article.
- No body H1, app-domain article link, em dash, collective first-person voice or internal production language remains.
- Each Quick Summary has six items; each FAQ has seven questions and exact slug mapping.
- All ten local image files exist and both five-image contact sheets loaded 5/5 images.

## Chromium browser checks

Field-test widget:

- 1440 px desktop, 390 px mobile and 320 px narrow mobile: no page-level horizontal overflow.
- Four scene tabs update the real photo, copy and recommendation.
- Battery and preparation controls update the three format scores.
- Yellow surfaces computed to dark green text (`rgb(11, 47, 20)`).
- Credits are closed on first load, open on tap, do not change page height, close with Escape and return focus to the trigger.
- Mobile scene buttons are 72 px high, choice labels 46 px and the credits button 44 px.

Route-map widget:

- Leaflet map loaded, six route cards rendered and all-route view remained responsive.
- Selecting Berlin Wall produced two coloured start/finish markers and the exact main-domain product link.
- Route-card path and time lines remain visually separated after a browser-found spacing correction.
- 1440 px desktop, 390 px mobile and 320 px narrow mobile: no page-level horizontal overflow.
- Yellow route tabs, prices and CTAs computed to dark green text.
- Credits are closed on first load, open on tap, do not change page height, close with Escape and return focus to the trigger.

## WebKit mobile checks

- iPhone/WebKit emulation at 402 px loaded both widgets with no horizontal overflow.
- Field-test local scene images loaded after changing widget image paths to deploy-safe relative URLs.
- Route map loaded six cards, Leaflet tiles, two selected-route markers and the correct Berlin Wall product link.
- Yellow surfaces used dark text in both widgets.
- Route-map credits opened and closed with Escape without overflow; focus returned to the credits trigger.
- Final console check on both widgets: **0 errors and 0 warnings**.

## Evidence location

Local screenshots are under `output/playwright/audio-support-main-domain-20260715/`. That folder is intentionally ignored by git. It contains mobile and desktop captures for both widgets, the credits modal and both contact sheets.

## Remaining live gates

- GitHub Pages assets are not deployed from this branch.
- Wix drafts are not created or published.
- App-domain redirects are not configured.
- The migration runbook requires static-asset propagation, draft readback and live main-domain verification before either old URL can redirect.
