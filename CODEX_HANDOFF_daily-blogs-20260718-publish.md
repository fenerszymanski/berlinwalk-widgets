# Codex handoff - four daily blogs published (2026-07-18)

Yusuf approved the exact four drafts for review, correction, publication and
post-publish completion. All four are now `PUBLISHED` with
`hasUnpublishedChanges: false` and their canonical URLs return HTTP 200:

| Post | Own BerlinTools page |
|---|---|
| [Famous Movies and TV Shows Filmed in Berlin](https://www.berlinwalk.com/post/famous-movies-tv-shows-filmed-in-berlin) | [Screen Mood Finder](https://www.berlinwalk.com/tools/screen-mood-finder) |
| [Do You Need a Visa to Visit Berlin?](https://www.berlinwalk.com/post/do-you-need-a-visa-to-visit-berlin) | [Berlin Entry Requirements](https://www.berlinwalk.com/tools/berlin-entry-requirements) |
| [Berlin Airports Explained](https://www.berlinwalk.com/post/berlin-airports) | [Berlin Airports](https://www.berlinwalk.com/tools/berlin-airports) |
| [Halal Food in Berlin](https://www.berlinwalk.com/post/halal-food-in-berlin) | [Halal Food in Berlin](https://www.berlinwalk.com/tools/halal-food-in-berlin) |

Publish/readback evidence is under
`output/qa/daily-drafts-publish-20260718/`. The widget, article-source, icon and
tools-hub changes are in commits `48d89b8` and `b421946`; the full 230-post
blog index and exact related-tool mappings are in `0fd7978`; publication
evidence is in `63df4b7`.

Independent live QA passed all eight post/viewport combinations (desktop
1440px and mobile 390px): HTTP 200, one article H1, self-canonical, indexable
robots, complete social metadata, valid BlogPosting/FAQPage data, exact
image/caption counts, loaded Quick Summary/widget/FAQ frames, default-closed
Image Credits interactions, zero horizontal overflow and zero critical page or
console errors. GitHub Pages serves the 230-post index with all four own-tool
mappings (`Last-Modified: Sat, 18 Jul 2026 07:41:14 GMT`).

## Search Console status - COMPLETE (2026-07-18)

All eight exact URLs above passed a fresh live preflight before Search Console:
HTTP 200, exact final URL, self-canonical, index/follow, meaningful public
render, and membership in the current Wix sitemap chain. The local URL
Inspection API returned `invalid_grant` once and was not retried. The existing
authenticated Chrome session was then used for URL Inspection in
`sc-domain:berlinwalk.com`.

| Exact URL | Result |
|---|---|
| https://www.berlinwalk.com/post/famous-movies-tv-shows-filmed-in-berlin | `Indexing requested` / priority crawl queue |
| https://www.berlinwalk.com/tools/screen-mood-finder | `Indexing requested` / priority crawl queue |
| https://www.berlinwalk.com/post/do-you-need-a-visa-to-visit-berlin | `Indexing requested` / priority crawl queue |
| https://www.berlinwalk.com/tools/berlin-entry-requirements | `Indexing requested` / priority crawl queue |
| https://www.berlinwalk.com/post/berlin-airports | Already indexed: `URL is on Google` / `Page is indexed` |
| https://www.berlinwalk.com/tools/berlin-airports | `Indexing requested` / priority crawl queue |
| https://www.berlinwalk.com/post/halal-food-in-berlin | `Indexing requested` / priority crawl queue |
| https://www.berlinwalk.com/tools/halal-food-in-berlin | Already indexed: `URL is on Google` / `Page is indexed` |

Summary: `6 submitted`, `2 already indexed`, `0 blocked`. Sitemap fallback was
not needed. The Berlin Airports post's first request flow lost its local UI
confirmation during a controlled browser readback interruption; a fresh URL
Inspection then showed it indexed, so no second request was sent.

PII/secret-free JSON and cropped per-URL screenshots are under
`output/qa/daily-blogs-20260718-search-console/`.
