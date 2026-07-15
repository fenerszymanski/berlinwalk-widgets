# Audio support main-domain package QA

Date: 2026-07-15

Scope: package, Wix publication, live browser QA and exact app-domain migration

Live mutation: both Wix Blog owners published one at a time; only the two matching app-domain article paths permanently redirected

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

## Completed live gates

- Both GitHub Pages widget owners, Quick Summary datasets and FAQ datasets propagated before publication.
- Wix post `e7e11184-b5b0-427e-91af-df57ed24b452` is published at `https://www.berlinwalk.com/post/berlin-audio-guide-app-vs-no-app`.
- Wix post `ee37cfc3-f8c4-41a4-ad2e-91de5838e899` is published at `https://www.berlinwalk.com/post/self-guided-berlin-walking-tour-audio-guide`.
- Both live pages return `200`, are indexable, self-canonical, expose one public H1, include `BlogPosting` and `FAQPage`, and render three embeds without horizontal overflow in Chromium or WebKit mobile QA.
- The field-test widget's four deploy-safe scene images return `200`; all four mobile states now measure `2968 px` of content inside a `2972 px` iframe, so route changes do not clip the footer.
- The route-map widget's seven filter states update correctly. The parent iframe follows each content height within its 4 px wrapper allowance, and all five paid routes plus the free sampler link to their intended main-domain owners.
- Audio Tours hub QA passed with five paid product cards, both editorial links on the main domain, a working `View all five routes` jump, no mobile overflow and an iframe height matching its content.
- Vercel production deployment `dpl_As1hCcKiAqZSgXDsqWc85UguHqMr` is live on `app.berlinwalk.com`; rollback owner before migration was `dpl_EYTXjQVQa8vxxFcsPbKfjsHKPU1Y`.
- Each old app article URL, with and without a trailing slash, returns one `308` hop to its matching `200` main-domain owner. `/audio-tours` and all five product routes remain `200`.
- The old article paths are absent from the app sitemap and robots file, while the Wix Blog sitemap contains both new owners.
- Search Console initially reported all three newly published posts as `URL is unknown to Google`; `Request indexing` completed for Hidden Berlin and both audio-support owners, each with `Indexing requested` / priority crawl queue confirmation.
