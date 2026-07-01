# Berlin by Foot QA - 2026-07-01

- Wix post: `3dfe0e44-6cbb-4b8a-b00b-62211a3f221a`, readback `PUBLISHED`, `hasUnpublishedChanges:false`.
- Pre-publish widget/data commit: `8e9b848`; Pages served widget, hero, Quick Summary, FAQ, tools-hub, and icon assets with Last-Modified around `Wed, 01 Jul 2026 19:39:54-56 GMT`.
- Post-publish blog-index commit: `533f010`; Pages served `blog-index/data.json` with `berlin-by-foot` and `berlin-walkable-areas-planner`, Last-Modified `Wed, 01 Jul 2026 19:46:44 GMT`.
- Local widget QA: desktop and 390px screenshots saved here; overflow `0`.
- Live blog QA: desktop and 390px body checks passed, 3 post embeds present, visible internal-leak scan false, overflow `0`.
- Live tool QA: `/tools/berlin-walkable-areas-planner` title/widget/related blog present, overflow `0`; `/berlin-tools` card and Wix Media icon present.
- `/blog` QA: new post appears in live DOM and `blog-index/data.json` as `latest[0]` and route shelf #1; hero remains the curated `berlin-heatwave-day-plan`.
- Search Console URL Inspection API: both blog and tool returned `URL is unknown to Google`; Chrome UI request-indexing was blocked by the Chrome extension connection, so manual UI submission remains.
