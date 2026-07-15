# Weekend in Berlin 48-Hour Article - Draft and Live-Asset QA

Run: 2026-07-15 Europe/Berlin

## Final local state

- Title: `Weekend in Berlin: A 48-Hour Itinerary That Fits Your Arrival`
- Slug: `weekend-in-berlin-48-hour-itinerary`
- Focus keyword: `weekend in Berlin`
- Category: `Tourist Tips`
- Body: 1,820 words, 0 Markdown H1, 6 inline images, 6 styled-caption sources, 3 embeds.
- Internal links: 7 unique BerlinWalk destinations in the body.
- Official source links: BVG, Museum Island/SMB, German Bundestag, Berlin Wall Memorial and visitBerlin.
- Wix state: draft `7d3ac682-daf9-418f-8d16-0d1d03f140bd` created and read back as `UNPUBLISHED`; `hasUnpublishedChanges=true`. The helper defaults to `--dry-run`; its exact mutation flag is `--create-unpublished-draft`, its create body includes `publish: false`, and it has no publish endpoint.
- Wix readback: slug `weekend-in-berlin-48-hour-itinerary`, 6 images with 6 alt texts, 6 styled captions, 3 embeds, 0 body H1, 16 SEO tags and 0 internal leak terms.
- Wix tags: all five intended article tags are attached, including newly created `Weekend in Berlin`, `48 Hours in Berlin` and `First Time in Berlin` tags.
- Draft edit URL: `https://manage.wix.com/dashboard/12ee5ea0-70a7-492f-8020-ffb27cbb630f/blog/drafts/7d3ac682-daf9-418f-8d16-0d1d03f140bd/edit`.

## Content validation

- `node scripts/validate-blog-publish-body.mjs blog-drafts/weekend-in-berlin-48-hours.body.md`: PASS.
- `node scripts/qa-weekend-in-berlin-48-hours.mjs`: 23/23 PASS.
- `node scripts/create-weekend-in-berlin-48-hours-draft.mjs --dry-run`: PASS.
- Dry-run Ricos shape: 65 nodes, 6 images, 3 HTML embeds, body H1 0, 6 captions, 36,063 bytes.
- FAQ generator: 184 schema entries and 210 slug mappings after the rebased keys; no missing map references or Markdown leaks.
- All 12 internal and official body destinations checked on 2026-07-15 returned HTTP 200.

## Widget validation

- Widget: `berlin-weekend-arrival-board/`.
- GitHub Pages asset returned HTTP 200 after deployment and matched the committed SHA-256 hash byte for byte.
- Live Chromium mobile and WebKit mobile both rendered the 26-hour late-arrival/early-departure state with zero horizontal overflow, no Friday block and no late Sunday karaoke block.
- Live Quick Summary returned the intended six numbered items; live FAQ returned the intended seven questions.
- Interaction: 4 arrival states x 3 departure states.
- Automated state matrix: 36/36 PASS across 1100, 390 and 320 px.
- The matrix checked expected usable-hours values, exactly two pressed controls, correct Friday removal, correct 16:00 Sunday karaoke cutoff, zero horizontal overflow and dark `rgb(18, 61, 24)` text on all yellow selected controls and the CTA.
- Browser console after favicon fix: 0 errors, 0 warnings.
- Desktop visual: `widget-desktop-1100.png`.
- Mobile visual: `widget-mobile-390.png`.
- Narrow late-arrival/early-departure visual: `widget-narrow-320-late-arrival.png`.

## Visual validation

- Six final Berlin photographs were reviewed on the contact sheet at `blog-drafts/images/weekend-in-berlin-48-hours/contact-sheet.jpg`.
- Final files are 1600 px wide JPEGs. The featured Museum Island image is 1600 x 1081.
- Creator, source URL and CC licence are tracked in `blog-drafts/weekend-in-berlin-48-hours.visual-sources.md` and present in the public captions.
- A polished but context-poor vintage-camera image was rejected for the Mauerpark section and replaced with a flea-market table that visibly matches the text.

## Publish boundary

- This branch does not publish a Wix post.
- The article remains an exact, reviewable Wix draft. Publication requires Yusuf's explicit approval for this draft.
