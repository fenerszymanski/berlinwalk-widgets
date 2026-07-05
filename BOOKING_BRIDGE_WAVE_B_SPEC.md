# Booking Bridge — Wave B Execution Spec (Codex)

Written 2026-07-05 by Claude. Wave A shipped (journey booking card guaranteed +
next-slot copy, sticky/exit next-slot, `js/next-tour-slot.js`,
`bw_blog_book_bridge_click`). Wave B reduces friction on the destination side:
send the highest-intent warm clicks to a better page, calm the booking-page
drop-off, and make the promise consistent everywhere.

## Why (from the analysis, verified 2026-07-05)

- 30d: 7,396 sessions -> 51 booking-page sessions (0.7%) -> 12 forms -> 7
  bookings (all 7 real customers, 18 guests). Booking page converts ~14%, but
  59% leave before the form loads.
- The Wix service page `/book-berlin-walking-tour/...` is a long page ending in
  the native Wix Bookings widget. The custom landing `/free-berlin-walking-tour`
  (`<bw-paid-landing>`, live, HTTP 200) is purpose-built: top trust strip
  ("9.8 / 10 on FreeTour..."), an embedded live `<bw-booking-calendar>` above
  the fold, route/guide/FAQ, and it already fires `bw_booking_page_view` with
  `source: 'paid_landing'`. It was built for paid traffic and is currently idle
  for organic.
- Hypothesis: routing warm journey clicks to the landing lifts booking-page ->
  booking by cutting the pre-form drop. It is a hypothesis, not a certainty
  (see the header-hiding risk in Task 1), so it is measured, not assumed.

## Statistical honesty (read before designing the test)

Volume is far too low for a randomized 50/50 A/B to ever reach significance
(~12 booking-page sessions/week; a split gives ~6 per arm). Do NOT build a
randomized bucketer. Use a **sequential before/after** design read
**directionally**: Block A = current routing, Block B = variant routing, one to
two weeks each, and the decision is Yusuf's judgment on a clear directional
signal (e.g. booking-page -> booking noticeably up and total bookings not
down). No p-values, no significance claims.

## Hard rules

- Public copy: first-person singular, never `we/our/us`, **no em dashes**,
  editorial voice per `../BERLINWALK_EDITORIAL_VOICE_STANDARD.md`.
- Tour is `about 2 hours` or `~2h`, never `1h45m`.
- All new tracking consent-gated; no pre-consent event writes.
- No Meta campaign changes. No redesign of the Wix native Bookings widget.
- Change ONE routing variable at a time (see Task 1). Sticky bar, exit popup,
  and header keep pointing at the Wix service page for the whole experiment so
  the journey-card routing is the only moving part.
- Playwright QA desktop + 390px, overflow 0, console 0, before push. QA event
  rows UTM-tagged `codex_wave_b_qa` and deleted after readback 0.

## Task 1 — Route the journey booking card through one switch (the experiment)

Isolate the experiment to the blog journey booking card only (highest-intent,
highest-volume warm surface). File: `js/blog-journey-inject.js`.

1. There are two booking-URL sources today: the const `BOOKING_URL` (line ~24)
   and the `data.bookingUrl || <hardcoded>` fallback (line ~1697). Introduce a
   single resolver used by the booking card path:
   ```
   var BOOKING_DEST_SERVICE = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
   var BOOKING_DEST_LANDING = 'https://www.berlinwalk.com/free-berlin-walking-tour';
   var BOOKING_EXPERIMENT_VARIANT = 'service'; // 'service' | 'landing' — flip to run Block B
   ```
   `bookingJourneyCard(...)` builds its href from `resolveBookingDestination()`
   which returns the service or landing URL per `BOOKING_EXPERIMENT_VARIANT`.
   Leave `BOOKING_URL` in place for the non-journey references; only the journey
   booking card goes through the resolver.
2. Tag the variant so the funnel can split it:
   - `utm_content` suffix `_svc` or `_landing` (in addition to the existing
     `_nextslot`), e.g. `..._nextslot_landing`.
   - Include `variant: 'service'|'landing'` in the `bw_blog_book_bridge_click`
     event detail.
3. Measurement wiring is already there: the landing fires
   `bw_booking_page_view` with `source: 'paid_landing'`; the service page fires
   its booking-page view through the existing consent-gated booking analytics.
   `scripts/paid-funnel-events-report.mjs` (workspace) already groups by page
   and campaign, so both arms are visible. Confirm the landing view event
   carries the incoming `utm_content` so blog-origin landing sessions are
   distinguishable from any leftover paid sessions.
4. **Header-hiding risk (the main reason this is a test, not a switch):** the
   landing hides the global header/footer. Before running Block B, verify
   whether that is page-level (Wix page settings) or element CSS. Note it in the
   session log. If the variant loses, header-hiding is the prime suspect and the
   fallback is Wave C (port the landing's calendar + trust band above the native
   widget on the service page instead of redirecting). Do not attempt Wave C
   here.
5. Rollback is one line: set `BOOKING_EXPERIMENT_VARIANT = 'service'`, re-deploy,
   repin.

Run order: ship Task 1 with variant `'service'` (behavior identical to today
plus the `_svc` tag) as Block A for ~1 week, then flip to `'landing'` for Block
B. This makes Block A a clean tagged baseline rather than pre-Wave-A noise.

## Task 2 — Calm the booking service-page pre-form drop

59% leave the Wix service page before the form. Target the hero, not the native
widget. File: `book/book-element.js` (`<bw-book-hero>`, the "At a glance" card,
`.bw-book-hero-card` dl/dt/dd around lines 239-303 / 322+).

- Add one live line to the At-a-glance card using the shared helper (load
  `next-tour-slot.js`; fall back to static text if it fails):
  `Next walk: <Weekday> 11:30` (e.g. `Next walk: Saturday 11:30`).
- Add one reassurance line near the primary CTA: `Free to reserve. You pay
  nothing upfront and tip only if the walk was worth it.` (first-person, no em
  dash).
- Keep it text-only; do not touch or wrap the native Wix Bookings widget, and
  do not add a second calendar. This is a confidence nudge above the fold, not
  a flow change.
- This element is installed on the Wix booking page via Custom Code; confirm the
  current load method (GitHub Pages URL + `?v=` cache-buster vs jsDelivr pin in
  `PROJECT_MEMORY.md`), bump it after push, publish, live QA.

## Task 3 — One consistent promise + light social proof

Warm readers should see the same three facts at every step: free/tip-based,
about 2 hours, Tue-Sat 11:30 (plus summer 15:30 from Jul 3).

- Journey booking card (`bookingJourneyCard`): add a compact proof chip
  `9.8/10 on FreeTour`. Use this stable external figure, NOT the live
  `/_functions/listReviews` average (it can be low/empty and is not a safe
  hero number). Keep the card visually compact; one small chip, not a block.
- Verify the landing top strip and the booking hero state the same facts and
  wording style as the journey card so nothing contradicts (the landing strip
  already reads "9.8 / 10 on FreeTour - Free reservation - ~2h - Tue-Sat 11:30
  - From 3 July 2026: 11:30 + 15:30"). Fix only wording drift; no redesign.
- No `we/our`, no em dash, `about 2 hours`.

## Measurement & reporting

- Weekly funnel: `source scripts/load-api-keys.sh && node
  scripts/booking-funnel-wix-report.mjs --start <mon> --end <mon+7>` plus
  `scripts/paid-funnel-events-report.mjs` for the `variant`/`source` split.
- Metric of record: booking-page sessions and booking-page -> booking, per
  block, plus total confirmed bookings (verify real vs test via
  `scripts/booking-lead-time-report.mjs`, which flags likely tests).
- After Block A and Block B, append a short comparison to the workspace
  `SESSION_LOG.md`: sessions, booking-page sessions, bookings, and the
  directional read. Do not declare a winner on noise; hand Yusuf the numbers
  and a recommendation.
- Baseline to beat: ~12 booking-page sessions/week, 7 bookings/30d.

## QA matrix (before push, plus live re-check)

1. Journey booking card with variant `'service'`: href is the service page,
   `utm_content` ends `_nextslot_svc`, event detail `variant:'service'`.
2. Flip to `'landing'` in a local build: href is `/free-berlin-walking-tour`,
   `_nextslot_landing`, `variant:'landing'`; landing loads, calendar visible,
   fires `bw_booking_page_view source:paid_landing` carrying the blog UTMs.
3. Booking service-page hero shows `Next walk: <weekday> 11:30` matching the
   current Berlin day, plus the reassurance line; native widget untouched;
   390px overflow 0.
4. Proof chip `9.8/10 on FreeTour` renders on the journey booking card, desktop
   + mobile, no layout break.
5. Copy audit across all three surfaces: no `we/our/us`, no em dash,
   `about 2 hours`.
6. Consent denied/absent: zero first-party event requests from journey/hero
   surfaces.
7. `node --check` on changed JS; `git diff --check`; `next-tour-slot.js` unit
   assertions still pass.
8. Live smoke: one `bw_blog_book_bridge_click` with
   `utm_content=..._codex_wave_b_qa`, confirm it lands via the paid-funnel
   report, delete QA rows, readback 0.

## Explicit non-goals

- No randomized bucketer, no significance testing (volume too low).
- No redesign of the Wix native Bookings widget or a second calendar on the
  service page (that hero-side port is Wave C, only if the landing variant
  loses on the header-hiding risk).
- No Meta/paid changes. No sticky/exit/header routing changes during the
  experiment.
