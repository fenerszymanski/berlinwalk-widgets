# Berlin History Story V1 - related-link status

Status: `BLOCKED_UNPUBLISHED`.

The handoff requires this page to be the one surface that links **42 current zero-inbound history articles**. The inherited `related-history-posts.js` is not an eligible substitute and must not be described publicly as such.

## Fresh current graph evidence

Read-only Wix Blog graph snapshot: 2026-09-01T00:17:24.875Z.

- Published posts scanned: 343
- Current zero-inbound `/post/<slug>` records: 78
- Inherited 42-link baseline that is still zero-inbound: 6
  - `berlin-wall-map-overlay-where-you-are-standing`
  - `berlin-wall-in-mitte-city-centre`
  - `oberbaumbruecke-berlin`
  - `telling-time-in-german-berlin`
  - `teufelsberg-berlin`
  - `air-conditioning-in-berlin`

The remaining inherited links already have one or more inbound published posts, and several of the six are not history articles. All 42 destinations resolving is useful technical QA, but does not prove current orphan status or historical eligibility.

## Required release procedure

1. Rerun the published Wix Blog link graph immediately before the release commit. Read each `RICH_CONTENT` body, normalize internal `/post/<slug>` URLs, exclude self-links, and retain only inbound count `0`.
2. Apply this written history rubric to the remaining candidate post title, excerpt and body: its primary visitor value must be understanding Berlin's past through a period, place, institution, memory site, cultural heritage or historical change. Exclude a primarily operational, current event, price, weather, transport, booking, food, itinerary or general city-use article.
3. Record the source timestamp, published-post count, candidate slugs, rubric outcome and a SHA-256 of the final list.
4. Replace the inherited baseline only if exactly 42 posts pass both tests. If fewer than 42 pass, keep the page unpublished and obtain Yusuf's explicit re-scope before changing the required count or eligibility rule.

This document keeps the package honest while the linked-surface requirement is unresolved.
