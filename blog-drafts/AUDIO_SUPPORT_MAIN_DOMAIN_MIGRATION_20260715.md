# Audio support articles: main-domain migration runbook

Status: local package only. No Wix draft, Wix publish, Vercel deploy, app-domain redirect, sitemap change or Search Console request has been made from this branch.

## Ownership map

| Current app-domain owner | Intended main-domain owner | Primary query |
| --- | --- | --- |
| `https://app.berlinwalk.com/audio-tours/berlin-audio-guide-app-vs-no-app` | `https://www.berlinwalk.com/post/berlin-audio-guide-app-vs-no-app` | Berlin audio guide app |
| `https://app.berlinwalk.com/audio-tours/self-guided-berlin-walking-tour-audio-guide` | `https://www.berlinwalk.com/post/self-guided-berlin-walking-tour-audio-guide` | self-guided Berlin walking tour with audio |

The Wix Blog URLs become the only indexable owners. The two old app URLs must remain live until their matching Wix posts are published and independently verified.

## Package contents

Each package contains:

- a full English body with no body H1;
- five real Berlin images with descriptive alt text and styled caption lines;
- a six-item Quick Summary;
- a seven-question FAQ;
- one article-specific interactive widget;
- exact links to all five paid audio routes at €4.99;
- links to the Audio Tours hub, free sampler, live tour, Trip Planner and sibling support article;
- a draft-only Wix creation/readback script with no publish endpoint.

## Mandatory order of operations

### 1. Integrate and deploy the static assets

Cherry-pick this branch into the current widget release branch. Deploy through the normal GitHub Pages workflow, then verify these public asset owners return `200`:

- `/quick-summary/?post=berlin-audio-guide-app-vs-no-app`
- `/quick-summary/?post=self-guided-berlin-walking-tour-audio-guide`
- `/faq/?post=berlin-audio-guide-app-vs-no-app`
- `/faq/?post=self-guided-berlin-walking-tour-audio-guide`
- `/berlin-audio-format-field-test/`
- `/berlin-audio-route-map/`

Do not create the Wix drafts until the assets have propagated. Verify the raw GitHub source and GitHub Pages separately because Pages can lag behind the repository.

### 2. Run local package QA

From the widget repository root:

```bash
node scripts/qa-audio-support-main-domain-packages.mjs
node scripts/create-audio-support-main-domain-drafts.mjs
node /Users/yusufucuz/Documents/New\ project/scripts/validate-blog-publish-body.mjs \
  blog-drafts/berlin-audio-guide-app-vs-no-app.body.md \
  blog-drafts/self-guided-berlin-walking-tour-audio-guide.body.md
```

All commands above are local-only. The draft script defaults to dry-run.

### 3. Read-only Wix collision check

Load the existing Keychain credentials without printing them, then run:

```bash
source '/Users/yusufucuz/Documents/New project/scripts/load-api-keys.sh'
node scripts/create-audio-support-main-domain-drafts.mjs --preflight
```

Stop if either slug already has a published owner. Reconcile that page instead of creating a duplicate. An existing unpublished draft may be updated by the script after its ID and title are checked.

### 4. Create or update UNPUBLISHED Wix drafts

Only after the asset and collision gates pass:

```bash
node scripts/create-audio-support-main-domain-drafts.mjs --write
node scripts/create-audio-support-main-domain-drafts.mjs --readback
```

The script may create or update drafts, but it cannot publish them. It requires exact readback of:

- `UNPUBLISHED` status;
- intended `seoSlug`;
- five images with alt text;
- five styled captions;
- Quick Summary, article widget and FAQ embeds;
- no body H1;
- no internal production-language leak.

### 5. Editorial review in Wix

Review both drafts on desktop and mobile before any publication decision. Confirm:

- Wix renders the title as the only H1;
- captions are centred, italic and about 12 px;
- all five images are sharp and correctly placed;
- embeds do not produce blank space or horizontal overflow;
- credits are closed on first load and open only after a tap;
- every yellow CTA has dark green or near-black text;
- public voice remains first-person singular;
- prices, start points and walking times match the five live product pages.

### 6. Publish one article at a time

Publishing requires Yusuf's explicit approval for the exact Wix draft. Publish the first article, complete the live checks below, and only then publish the second article. This reduces the blast radius if Wix rendering differs from draft preview.

For each published URL verify:

- HTTP `200` and no redirect loop;
- indexable robots state;
- a self-referencing canonical on `www.berlinwalk.com`;
- exactly one H1;
- unique title and meta description;
- `og:title`, `og:description` and a valid `og:image`;
- `BlogPosting` structured data and FAQ markup where Wix exposes it;
- working product, hub, sampler, live-tour and sibling-post links;
- working embeds in Chromium and WebKit at desktop and 390 px mobile widths;
- no duplicate site menu, blank iframe tail or page-wide horizontal overflow.

### 7. Change the Audio Tours hub links

After both main-domain owners pass the live checks, update the two editorial links on the Audio Tours hub from the app-domain URLs to the new Wix Blog URLs. Recheck `View both routes`, all five product cards and the two editorial cards on desktop and mobile.

### 8. Apply exact one-hop app-domain redirects

Only now add exact permanent redirects:

```text
/audio-tours/berlin-audio-guide-app-vs-no-app
  -> https://www.berlinwalk.com/post/berlin-audio-guide-app-vs-no-app

/audio-tours/self-guided-berlin-walking-tour-audio-guide
  -> https://www.berlinwalk.com/post/self-guided-berlin-walking-tour-audio-guide
```

Use `301` or `308` according to the app's existing permanent-redirect convention. Do not redirect the whole `/audio-tours/` namespace. Verify both old URLs return one redirect hop to a `200` main-domain page, with no intermediate host and no loop.

### 9. Remove duplicate discovery signals

After redirect verification:

- remove the two old app paths from the app sitemap or route manifest;
- confirm no internal link still points to either app-domain article;
- confirm the Wix sitemap contains both new posts;
- inspect the rendered canonical on each new post;
- request indexing for the two new main-domain URLs only after all live checks pass;
- monitor coverage, impressions and clicks for the two query clusters for 90 days.

## Rollback

If either Wix owner is non-indexable, visually broken or missing its article widget:

1. remove or disable only that exact app-domain redirect;
2. restore the old app page as the temporary owner;
3. keep the faulty Wix page unpublished or correct it before another migration attempt;
4. do not change the site-wide shell, global header, footer or shared audio product embed as part of this rollback.

The two articles are independent. A problem with one must not block or roll back the other if its full ownership chain is healthy.
