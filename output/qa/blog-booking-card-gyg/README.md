# Blog booking card (GetYourGuide-style) QA harness — 2026-06-11

Local harness for the `js/lead-form-inject.js` blog booking card redesign.

- `test-post.html` — fake Wix blog post with hostile blog-like CSS (huge serif
  h2s, red underlined links, wide paragraphs) to verify the card's defensive
  styles. Must be served at a `/post/` path for the injector's guard.
- `site/` — servable tree: `post/index.html` (copy of the harness) and
  `js/lead-form-inject.js` (snapshot copy; re-copy from `../../js/` after
  editing the source before re-running).

Run: serve `site/` with any static server, open `/post/`.

QA results 2026-06-11 (desktop 1280px + mobile 375px, Claude preview browser):
card injected after mid-article paragraph, 8 live date chips with real
`bookings_sessionId` deep links + calendar-icon chip, first chip green/white,
other chips brand green (after adding `!important` against host link color),
promo image loaded, CTA carries UTM params, horizontal overflow 0 at both
widths.
