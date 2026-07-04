# Holocaust Memorial Berlin publish QA - 2026-07-04

- Wix draft/post ID: `b735852a-7e1a-491a-afa3-2262d9e5bac2`
- Public URL: `https://www.berlinwalk.com/post/holocaust-memorial-berlin`
- User-approved change: replaced the post-specific `holocaust-memorial-visit-planner` article embed with a Google map embed plus clickable walking directions from Brandenburg Gate, Reichstag, and Potsdamer Platz.
- Wix publish readback: `PUBLISHED`, `hasUnpublishedChanges:false`, slug `holocaust-memorial-berlin`, images `6`, embeds `3`, body H1 `0`, styled captions `6`, SEO tags `17`.
- Rich-content embed readback: Quick Summary, Google Maps embed, FAQ. Old planner widget embed absent.
- Live HTML check: HTTP `200`, title present, `Map and directions` present, Google Maps embed present, Google directions links present, old planner iframe absent, Quick Summary and FAQ present.
- Body validator: `node scripts/validate-blog-publish-body.mjs berlinwalk-widgets/blog-drafts/holocaust-memorial-berlin.body.md` passed.
- `/blog` propagation data: `blog-index/data.json` regenerated from Wix Blog API with `totalPosts:152`; `latest[0].slug` is `holocaust-memorial-berlin`; `relatedToolSlug` is empty; no `holocaust-memorial-visit-planner` marker appears in the blog index JSON.
- Search Console URL Inspection API: `URL is unknown to Google`. Request Indexing was not submitted because this needs separate explicit approval.
- Social/email/ads/campaigns: not touched.
