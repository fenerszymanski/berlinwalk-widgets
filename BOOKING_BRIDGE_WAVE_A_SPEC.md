# Booking Bridge — Wave A Execution Spec (Codex)

Written 2026-07-05 by Claude from the site-wide conversion analysis (workspace
`SESSION_LOG.md` entry 2026-07-05 19:15 CEST). Yusuf approved Wave A for
implementation.

## Why (baseline numbers, 30 days Jun 5 - Jul 5)

- 7,396 Wix sessions -> only 51 sessions ever see a booking page (0.7%).
- Booking page itself converts fine: 51 -> 12 forms -> 7 bookings, all 7
  verified real customers (18 guests). The leak is upstream routing.
- GA4 pages/session = 1.07. Readers get their answer and leave.
- Root cause 1: `js/blog-journey-inject.js` hides the legacy end-of-post tour
  CTA globally (`[data-bw-tourcta]{display:none!important}`) and its
  replacement journey block cuts the booking card on `planner-first` intent —
  which matches every high-traffic post (toilets, Sunday, transport, luggage,
  budget, safety, weather...). The top-25 traffic pages show NO tour card.
- Root cause 2: the journey `planner` card routes to `/berlin-trip-planner`,
  which was dead Jul 1-5 (crash fixed in commit `b2d8f69`; verify it is pushed
  and live before relying on that card).
- Root cause 3: every booking CTA is generic `Book Tour`. Median booking lead
  is 3 days, with many 0-1 day bookings — the winning message is a concrete
  next slot: "Tomorrow (Wed) 11:30".

Success metric: booking-page sessions per week. Baseline ~12/week. Target 3x
within 2 weeks of deploy. Weekly check:
`source scripts/load-api-keys.sh && node scripts/booking-funnel-wix-report.mjs --start <mon> --end <mon+7>`
(workspace root).

## Hard rules

- Public copy: first-person singular (`I`, `my`), never `we/our/us`, **no em
  dashes** (commas or hyphens instead). Editorial voice per
  `../BERLINWALK_EDITORIAL_VOICE_STANDARD.md`.
- All new tracking is consent-gated like the existing blog booking analytics.
  No pre-consent event writes.
- No Meta campaign changes. No booking-page (Wix service page) redesign in
  this wave.
- Playwright QA desktop + 390px, overflow 0, console errors 0, before push.
- QA event rows written to live collections must be UTM-tagged (`codex_...`)
  and deleted after verification, with a final readback of 0.

## Task 1 — Shared next-tour-slot helper

New file `js/next-tour-slot.js` exposing a tiny global
(`window.bwNextTourSlot()`), no dependencies:

- Tour days: Tuesday-Saturday. No tour Sunday/Monday.
- Anchor slot: 11:30 Europe/Berlin (summer Jul 1 - Sep 30 also has 15:30, but
  all Wave A surfaces anchor on 11:30 — one clear recommendation).
- Compute "now" in Europe/Berlin via `Intl.DateTimeFormat` with
  `timeZone: 'Europe/Berlin'` (no manual offset math).
- Returns `{ dateKey, weekdayLabel, relativeLabel, startLabel }` where
  `relativeLabel` is `Tomorrow (Wed)` when the next slot is tomorrow, else the
  weekday (`Saturday`), and `startLabel` is `11:30`.
- Same-day rule: if today is a tour day and Berlin time is before 08:30, the
  next slot MAY be today (`Today (Wed)`); at or after 08:30 skip to the next
  tour day. Keep this cutoff a named constant.
- Unit-check via a small node test file or inline assertions run with `node`
  (cases: Sat 20:00 -> Tuesday; Sun anytime -> Tuesday; Tue 07:00 -> Today;
  Tue 10:00 -> Wednesday; Mon -> Tuesday).

## Task 2 — Journey block: booking card guaranteed, with next-slot copy

File: `js/blog-journey-inject.js` (function `journeyStrategy` and
`bookingJourneyCard`).

1. The booking card must appear in the final 3 cards for EVERY intent class.
   New orders (booking card never sliced out):
   - `planner-first`: `[toolCard, bookingCard, plannerCard]`, fallback
     `readCard` only if one of the first three is missing. The read-more card
     is the lowest-value recirculation; it is the one that drops.
   - `soft-planning` / default: `[plannerCard, bookingCard, toolCard]`, same
     fallback rule.
   - `event-context`: `[plannerCard, bookingCard, toolCard]`.
   - `direct-booking`: unchanged `[directBookCard, toolCard, readCard]`.
2. Booking card copy uses the helper (load `next-tour-slot.js` from the same
   origin as the inject script; if the helper fails, fall back to the current
   static copy — never break the block):
   - Label: `Free walk`
   - Title: `` `${relativeLabel} at 11:30, walk Berlin with me` `` e.g.
     `Tomorrow (Wed) at 11:30, walk Berlin with me`
   - Sub/intro line on the card: `Free, tip-based, about 2 hours. Reserve a
     spot, pay nothing upfront.`
   - Do not use `~1h45m` anywhere; the tour is `about 2 hours`.
3. Keep the existing UTM/attribution plumbing (`journeyUtmUrl`,
   `applyBookAttribution`). Add `utm_content` suffix `_nextslot` so the
   variant is distinguishable in reports.
4. Destination stays `BOOKING_URL` (the Wix service page) in this wave, but
   hoist it so a single constant switch can later point to
   `/free-berlin-walking-tour` (Wave B experiment). Add a short code comment
   only if the constant name alone is unclear.
5. Tracking: on booking-card click, fire the existing consent-gated pipeline
   with a new event name `bw_blog_book_bridge_click` (session-deduped like the
   other `once(...)` events, but click events may repeat across posts). It
   must flow to the same first-party endpoint the booking analytics use so
   `scripts/paid-funnel-events-report.mjs` picks it up.
6. Verify how the inject script is loaded in Wix (GitHub Pages URL with `?v=`
   cache-buster vs jsDelivr pin — check `PROJECT_MEMORY.md` / the live page
   source) and bump the pin/cache-buster after push. Site publish required.

## Task 3 — Sticky CTA next-slot copy

Source: workspace root `berlinwalk-sticky-cta-color-polish.html`, deployed via
`node scripts/update-sticky-cta-embed.mjs` (Custom Embed
`337ac1c8-724c-4689-bab8-9c227df7f68e`; minified, 15KB cap — the date logic is
small, inline it, do not import the helper file here).

- Desktop card and mobile bottom bar: replace the static `Book Tour` label
  with `` `${relativeLabel} 11:30 · Book free tour` `` (eyebrow stays
  `FREE TOUR`). If the slot computation fails, fall back to `Book Tour`.
- Keep all existing hide rules (booking pages, `/berlin-trip-planner`,
  `/products/...`) untouched.
- `--dry-run` first, then deploy, then live readback of the embed revision.

## Task 4 — Exit-intent popup next-slot line

File: `js/exit-intent-popup.js` (desktop only, booking-first, single CTA since
commit `b4f5beb`).

- Under the existing title, add one line: `` `Next walk: ${relativeLabel} at
  11:30. Free, tip-based.` `` (inline the same small slot logic or load the
  helper; popup already ships as one file via jsDelivr pin, so inline is
  simpler).
- After push, repin the Wix Custom Embed `cdd1bfca-4173-42e0-9c18-a066f7c03559`
  to the new commit hash and bump its revision; site publish; live QA with
  `?bwExitPreview=1`.

## Task 5 — Verify planner fix is live (dependency, not code)

Journey's planner card only makes sense if `/berlin-trip-planner` works.
Commit `b2d8f69` in this repo fixes the init crash. Confirm it is pushed and
GitHub Pages serves it (init marker: `[data-arrival-date]` has a `min`
attribute on the live widget; a restore-URL plan renders day cards). If not
pushed yet, coordinate with Yusuf before shipping Task 2.

## QA matrix (all before push, plus live re-check after)

1. Utility post (e.g. `/post/public-toilets-in-berlin`): journey block shows
   tool + booking + planner cards; booking card shows the correct next slot
   weekday for the current Berlin time; click carries UTMs + `_nextslot`.
2. Event post (e.g. clubs post): booking card present with next-slot copy.
3. History post: `direct-booking` layout unchanged apart from next-slot copy.
4. Day-boundary cases via injected fake clock or temporary override: Saturday
   evening -> `Tuesday`, Sunday -> `Tuesday`, tour-day 07:00 -> `Today`.
5. Sticky bar desktop + mobile 390px shows the slot label; hidden on booking
   and product pages as before.
6. Exit popup preview shows the next-slot line, single booking CTA.
7. Copy audit: no `we/our/us`, no em dash, `about 2 hours` phrasing.
8. Consent: with consent denied/absent, zero first-party event requests fire
   from journey/sticky/popup surfaces (same standard as the 2026-07-01 QA).
9. `node --check` on changed JS; `git diff --check`; tools validator not
   needed (no data.json change).
10. Live smoke after deploy: one `bw_blog_book_bridge_click` QA event with
    `utm_content=codex_wave_a_qa`, verify it lands in the collection via the
    paid-funnel report, then delete the QA rows (readback 0).

## Reporting

- Session log entries in both repos per protocol.
- Day 7 and day 14 after deploy: run the weekly funnel report and append the
  booking-page-sessions/week trend to the workspace session log so Yusuf sees
  movement against the ~12/week baseline.
