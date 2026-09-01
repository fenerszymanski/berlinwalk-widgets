# Berlin History Story V2 - related-link status

Status: `UNPUBLISHED_LOCAL_CANDIDATE`.

## Scope correction - authoritative 2026-09-01

`42` was a 26 July audit's **zero-click** context statistic. It is neither a
zero-inbound internal-link metric nor a delivery count for this page. The
official scope is the verified 16-post list below. Do not add topic-mismatched
posts or relax the written rubric to reach 42.

The inherited 42-entry list remains historical evidence of the earlier
handoff, not a current related-reading payload. It is not rendered by this
candidate.

## Fresh current graph evidence

The original read-only snapshots at `2026-09-01T01:33:52.414Z` and
`2026-09-01T06:21:35.804Z` are retained as earlier evidence. A fresh
release-construction check ran at `2026-09-01T13:29:26.734Z`; its current graph
readback is the source of truth for this 16-post scope:

- Published Wix Blog posts scanned: `344`
- Unique normalized first-party `/post/<slug>` pairs: `1,601`
- Of those, pairs whose target is currently published: `1,587`
- Self-link occurrences: `0`
- Current zero-inbound published posts: `71`
- Full zero-inbound slug-list SHA-256:
  `207b09e1ffe0c0e9e62fbe5953d202dd0e1e400260107f3e2a75eae207887d1d`
  (SHA-256 of `JSON.stringify(sortedSlugs)`.)
- Official sorted 16-slug scope SHA-256:
  `636511abff27d195c9c641f063d46a80bdf98cf3318293810b707f4116f462b7`
- Result: `16/16` records are published, title-matched and have
  `inboundUniqueSources: 0`.

The extractor reads each current published post's `RICH_CONTENT`, recurses
only real Ricos `linkData.link` and `buttonData.link` objects, normalizes
first-party `berlinwalk.com`/`www.berlinwalk.com` `/post/<slug>` URLs, decodes
slugs, and excludes self-links. Inbound counts only use currently published
source and target posts. The 14-pair difference between the two pair totals is
therefore documented rather than misreported as published-target links.

The six zero-inbound targets addressed by the separate Phase 3 link operation
do not intersect with this 16-post scope; the fresh check above confirms every
official target still has zero inbound links.

## Official related-reading list

1. `beautiful-u-bahn-stations-berlin`
2. `berlin-brutalist-architecture`
3. `berlin-cemeteries`
4. `berlin-courtyards-hoefe`
5. `berlin-wall-in-mitte-city-centre`
6. `berlin-wall-map-overlay-where-you-are-standing`
7. `berliner-unterwelten`
8. `deutsches-technikmuseum-berlin`
9. `free-berlin-memorials`
10. `gemaldegalerie-berlin`
11. `jewish-museum-berlin-guide`
12. `koepenick-berlin`
13. `oberbaumbruecke-berlin`
14. `stasi-museum-berlin`
15. `teufelsberg-berlin`
16. `two-of-everything-in-berlin`

Their exact current titles and the machine-checkable live graph assertion live
in [`../scripts/check-history-story-related-links.mjs`](../scripts/check-history-story-related-links.mjs).
The rendered local payload is [`related-history-posts.js`](./related-history-posts.js).

The 12-chapter story keeps an article when its primary visitor value is
understanding Berlin's past through a period, place, institution, memory site,
cultural heritage or historical change. It correctly excludes Spy Museum,
Tempelhofer Feld, Ringbahn, opera, pink pipes, Unity Day/Freedom Week and
seasonal/event posts when their primary value is current attraction,
operational, transport, event or general city-use guidance.

## Local installation and later gate

This private candidate renders only the official list in an aftercare
disclosure after the `Four places to read Berlin today` chapter. No
related-reading block is placed in or beside the `Dictatorship, deportation and
destruction` chapter (`1933–1945`). No Wix record, native page, SEO field, social image,
public ref, distribution pin or publication changed during this work.

Before any later distribution change, rerun this read-only check from the
worktree:

```sh
source ../../../scripts/load-api-keys.sh
node scripts/check-history-story-related-links.mjs
```

If a listed target has since gained an inbound link, remove it from the final
source-controlled payload and checker rather than substituting an unrelated
post; record the resulting scope and rerun the check. Native Wix draft
creation, native SEO/social-media writes, embed changes and publication remain
separate explicit Yusuf approvals.
