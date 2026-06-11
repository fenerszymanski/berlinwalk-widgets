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

Follow-up same day: date chips now target `https://www.berlinwalk.com/booking-form`
(the service-page calendar ignores `bookings_sessionId`; the Booking Form
preselects the slot from it) — verified chip hrefs in the harness and a live
`/booking-form` deep link with a real sessionId returning HTTP 200. Promo
photo swapped from gallery 09 (group selfie) to gallery 01 (Yusuf
storytelling outside the Altes Museum); load verified in the harness.

Second follow-up same day (select-then-reserve logic): date chips are now
`<button>` selectors, not links — clicking a date no longer navigates.
Selecting a date reveals a `START TIME` pill row (e.g. `11:30`), an
availability meta line (`Spots available for Fri 19 Jun · about 2 hours,
ends near Hackescher Markt`), and rewrites the CTA to
`Reserve Fri 19 Jun · 11:30` pointing at `/booking-form` with that slot's
`bookings_sessionId`. The CTA only says `Check availability` (service page)
while dates are loading or if the fetch fails. Harness QA: chip click keeps
the page URL, toggles `.bw-selected` + `aria-pressed`, sessionIds differ per
date (335-char ids, distinct tails), first date auto-selected, desktop 1280 +
mobile 375 render with overflow 0.
