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

## Search Console status

The eight post/tool URLs above still need URL Inspection -> Request indexing
in `sc-domain:berlinwalk.com`. No request has been claimed or recorded yet:
Chrome had no open window, and the browser-control safety rule requires Yusuf's
explicit permission before opening one. Continue only after that permission,
then replace this section with the per-URL result (`Indexing requested`, already
indexed, quota, or login blocker).
