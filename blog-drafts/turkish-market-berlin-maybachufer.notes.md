# Turkish Market Berlin (Maybachufer) — production notes

**Status:** UNPUBLISHED Wix draft, review-ready. Do not publish without Yusuf's
explicit approval.

## Post
- Title: Turkish Market Berlin: How to Visit the Maybachufer Market
- SEO title: Turkish Market Berlin: Maybachufer Days, Times & Tips (2026)
- Slug: `turkish-market-berlin-maybachufer`
- Focus keyword: **Turkish Market Berlin** (in title, H2, body, meta, slug)
- Category: Tourist Tips (`6da64e22-3360-42ec-a558-e906e4deeb19`)
- Tags: Turkish Market Berlin, Maybachufer, Neukölln, Berlin Markets, Berlin Tourist Tips
- Wix draft ID: `fb270e82-bed2-4c42-98d8-ddec097f0e7d`
- Edit URL: https://manage.wix.com/dashboard/12ee5ea0-70a7-492f-8020-ffb27cbb630f/blog/drafts/fb270e82-bed2-4c42-98d8-ddec097f0e7d/edit
- Public URL (after publish): https://www.berlinwalk.com/post/turkish-market-berlin-maybachufer
- Helper script: `scripts/create-turkish-market-berlin-maybachufer-draft.mjs`
  (`--dry-run`, `--readback`)

## Key facts (verified 2026-07-09)
- Food market: **Tuesday & Friday, 11:00–18:30**, Maybachufer, Neukölln bank of
  the Landwehrkanal. ~180 traders.
- Saturday: **Stoffmarkt** (fabric market), 11:00–17:00. Sunday: Nowkoelln
  Flowmarket, fortnightly.
- Nearest U-Bahn: **Schönleinstraße (U8)** ~5 min; also Kottbusser Tor (U8),
  Hermannplatz (U7/U8).
- Neukölln, not Kreuzberg (common confusion). Cash-only stalls.
- Sources: visitBerlin (neukollner-wochenmarkte-am-maybachufer), maybachufer.de.

## Widget
- Slug: `maybachufer-market-clock` — original "Market Clock": day chips
  (Tue/Fri food, Sat fabric, other = closed) + time slider 11:00–18:30 that
  changes crowd/freshness/deal meters + a per-moment "Yusuf's move." Not a
  reused picker/checker/card pattern.
- Embedded directly in the article body. QA passed desktop + 375px mobile,
  0 console errors, no horizontal overflow.

## Deferred (per PROJECT_MEMORY 2026-07-07 hard-rule clarification)
- The BerlinTools catalog listing (tools-hub/data.json entry, CMS item, glossy
  icon) is **intentionally deferred**. No approved icon-generation path is
  reachable in the unattended daily routine, and paid image APIs are forbidden
  for this automation. The widget is live/embedded; only the catalog card is
  pending. Follow-up: generate a glossy 3D icon via Yusuf's ChatGPT/browser
  workflow, then wire tools-hub + CMS + layout icon map for
  `maybachufer-market-clock`.

## Images (6, CC BY-SA 4.0 → Image Credits block in body)
- See `images/turkish-market-berlin-maybachufer/visual-sources.md`.
- Cover: 01-market-crowd-canopies.jpg. All uploaded to Wix Media; missingAlt 0.

## QA readback (draft)
- status UNPUBLISHED, hasUnpublishedChanges true, 6 images, 6 styled captions,
  3 embeds, body H1 count 0, 17 SEO tags, BlogPosting + FAQPage schema present,
  canonical + robots(index,follow,max-image-preview:large) + og:image set,
  internal-note leak terms: none.
