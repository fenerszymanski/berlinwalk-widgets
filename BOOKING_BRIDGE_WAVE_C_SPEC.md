# Booking Bridge — Wave C Execution Spec (Codex)

Written 2026-07-06 by Claude. Waves A and B shipped. This wave was originally
sketched as "port the landing calendar to the service page," but that is
**already live** (see below), so Wave C is re-scoped to the real remaining gap:
the highest-intent owned surface with no in-content tour bridge — the tool
pages.

## What is already done (do NOT rebuild)

- The Wix booking service page `/book-berlin-walking-tour/...` already mounts
  the custom `<bw-booking-calendar navigation-mode="event">` with LIVE
  availability (`https://berlinwalk-content-app.vercel.app/api/booking-calendar-availability`,
  verified 2026-07-06: returns real Wix slots with `openSpots`, serviceId
  `448872c2-...`, Alexanderplatz/Weltzeituhr), plus the `book-now-intro-patch.js`
  trust intro. The `/booking-form` handoff deep-links `bookings_sessionId`,
  `bookings_serviceId`, `bookings_locationId`, `bookings_timezone` + UTMs and
  was live-verified (PROJECT_MEMORY 1108/1111; AGENTS §8 item 6 is effectively
  closed). So the low-friction calendar on the service page already exists — the
  "port" fallback from the Wave B spec is unnecessary.
- Wave A: blog post journey card guaranteed + next-slot copy + `bw_blog_book_bridge_click`.
- Wave B: journey-card routing switch, service-page hero next-walk line, proof chip.

## The real gap (verified 2026-07-06)

- `js/blog-journey-inject.js` `isPostPage()` gates the in-content journey bridge
  to `/post/` ONLY. Tool pages get it never.
- Tool pages are the top NON-post traffic and the highest-intent audience (many
  users are in Berlin right now): `/tools/berlin-safety` 256 clicks/30d,
  `/tools/berlin-drinking-water` 203, plus public-toilets, lakes, daily-budget,
  transport-ticket-calculator, etc.
- On `/tools/*` today the only tour touchpoints are passive and easy to ignore:
  the header BOOK NOW pill and the site-wide sticky bar (Wave A gave the sticky
  its next-slot copy). There is NO contextual in-content bridge, and the tool
  widgets themselves end with only the attribution badge (links to the homepage,
  no tour offer).
- A person checking "is Berlin safe" or "where is free drinking water" is in the
  city today. "Walk with me tomorrow 11:30, free" is perfectly timed and never
  offered in-content.

Goal: extend the proven, consent-gated, next-slot bridge to the tools ecosystem.
This raises how many of the 7,396 sessions reach a booking surface (the 0.7%
number), not the booking-page conversion rate (already fine at ~14%).

## Hard rules

- Public copy: first-person singular, never `we/our/us`, **no em dashes**,
  editorial voice per `../BERLINWALK_EDITORIAL_VOICE_STANDARD.md`.
- Tour is `about 2 hours` or `~2h`, never `1h45m`.
- All tracking consent-gated; no pre-consent event writes.
- No Meta changes. No booking-page or calendar changes (already good).
- Reuse `js/next-tour-slot.js` (`window.bwNextTourSlot()`); never re-implement
  slot logic. Task 0 enhances this helper; all copy consumes its output.
- Playwright QA desktop + 390px, overflow 0, console 0, before push. QA event
  rows UTM-tagged `codex_wave_c_qa`, deleted after readback 0.
- Tools must not regress: the bridge is one restrained block after the tool, not
  a popup, not an interstitial, and must not shift or cover the widget.
- Never advertise a time Wix would not book. In-season copy shows `11:30 and
  15:30`; off-season shows `11:30` only; same-day past a slot's cutoff drops that
  slot. This is driven entirely by Task 0, not hardcoded per surface.

## Task 0 (prerequisite) — Teach `next-tour-slot.js` about both summer slots

Today the helper only knows the single `11:30` slot (`TOUR_START_LABEL`) and has
no summer-season awareness. In the double-slot season each tour day runs 11:30
AND 15:30 (live availability on 2026-07-06 confirmed both slots for 2026-07-07,
openSpots 48 / 50). The bridge should offer both so the reader has an
alternative time.

Enhance `js/next-tour-slot.js` without breaking its current single-slot output:

1. Add season constants (named, easy to change): the double-slot window. Default
   to the planner's canonical `July 1 - September 30` (`PLANNER_LOGIC_REVIEW.md`).
   Note in a code comment that live booking copy says "From 3 July 2026"; if
   Yusuf wants the exact live start, adjust the constant. Never advertise a slot
   that Wix would not actually offer, so keep the window conservative.
2. Compute the full slot set for a given tour day: in-season `['11:30','15:30']`,
   otherwise `['11:30']`.
3. Per-slot same-day filtering: `findTargets` currently only keeps today if it is
   before the single 08:30 cutoff (built for 11:30). With two slots, keep today
   if ANY of its slots is still bookable, and drop individual slots whose cutoff
   has passed (reuse the cutoff concept per slot: slot time minus the same lead
   buffer). So a summer tour day at 12:00 shows only `15:30` today; after 15:30's
   cutoff it rolls to the next day showing both.
4. Extend the returned object (keep existing fields for the live Wave A/B
   surfaces):
   - `startLabel` unchanged = the first/soonest bookable slot (backward compat).
   - add `startLabels`: array of that day's still-bookable slots, e.g.
     `['11:30','15:30']`.
   - add `slotsLabel`: pre-joined human string, `'11:30 and 15:30'` or `'11:30'`.
   - add `slotCount`: `startLabels.length` (for singular/plural copy).
5. Update/extend the unit assertions: summer future day -> two slots; off-season
   -> one; summer same-day after 11:30 cutoff -> only 15:30; after both cutoffs
   -> next day two slots.

## Task 1 (primary) — In-content tour bridge on `/tools/<slug>` pages

Reuse the existing infrastructure in `js/blog-journey-inject.js` (already loaded
site-wide, already has the tools data, booking-URL resolver, next-slot helper,
and consent-gated analytics). Add a `/tools/` branch — do NOT fork a new
site-wide script.

1. Add `isToolPage()` = `location.pathname.indexOf('/tools/') === 0` and a
   `currentSlug()`-based lookup. Skip the tools index `/tools` (exact), the
   booking/product/planner routes, and any page already showing the post
   journey block.
2. New `renderToolBridge()` (separate from the blog `journeyStrategy`; the tool
   context is different — the user is mid-utility, so the bridge is
   tour-forward and simpler, not a 3-card recirculation):
   - One compact band inserted after the tool content, before the footer. Find a
     stable anchor: after the widget iframe container or the CMS body's last
     block; fallback to append before the footer. Verify the live DOM anchor on
     `/tools/berlin-safety` and `/tools/berlin-drinking-water` (different tools
     may differ) and pick a resilient selector.
   - Copy (next-slot aware, works for in-Berlin-now and soon-to-arrive; uses
     `slotsLabel`/`slotCount` from Task 0 so it lists both times when the season
     offers them):
     - Kicker: `While you are in Berlin`
     - Title, two slots: `` `Next free walks: ${relativeLabel} at ${slotsLabel}` ``
       e.g. `Next free walks: Tomorrow (Tue) at 11:30 and 15:30`
     - Title, one slot: `` `Next free walk: ${relativeLabel} at ${slotsLabel}` ``
       e.g. `Next free walk: Saturday at 11:30`
       (pick singular/plural `walk`/`walks` from `slotCount`).
     - Line: `I meet at the World Clock on Alexanderplatz. About 2 hours,
       tip-based, reserve a spot and pay nothing upfront.`
     - CTA button: `Reserve a free spot`
   - Optional second card: the single most related published post OR the
     related tool from `tools-hub/data.json` for that slug, if one is a clean
     match. Keep the booking CTA primary and first.
   - If `bwNextTourSlot()` fails, fall back to static `Tue-Sat 11:30` copy;
     never render a broken block.
3. Destination: reuse `resolveBookingDestination()` from Wave B (currently
   `service`). Do not run a routing experiment here; inherit whatever Wave B
   settles on.
4. UTM/attribution: reuse the existing plumbing. `utm_medium=tool_bridge`,
   `utm_content` = `<slug>_toolbridge_nextslot`.
5. Tracking: new consent-gated event `bw_tool_book_bridge_click` (mirror the
   `bw_blog_book_bridge_click` pipeline so `scripts/paid-funnel-events-report.mjs`
   picks it up). Also emit a one-time `bw_tool_bridge_view` per session when the
   band renders, so we can measure view -> click on tool pages specifically.
6. Deploy: same load path as the rest of `blog-journey-inject.js` (confirm the
   Wix Custom Code jsDelivr pin / cache-buster in `PROJECT_MEMORY.md`), bump it,
   publish, live QA on two tool pages.

## Task 2 (secondary) — In-widget tour CTA, first-party only

The tool widgets end with only the attribution badge injected by `js/brand.js`.
Add an optional, tasteful tour line there so the highest-intent tools offer the
walk inside the result, without a per-widget change.

1. In `js/brand.js`, alongside the attribution badge, optionally render one
   compact tour CTA line using the Task 0 output:
   `` `Next free Berlin walks: ${relativeLabel} ${slotsLabel}` `` (singular
   `walk` when `slotCount === 1`), e.g. `Next free Berlin walks: Tomorrow (Tue)
   11:30 and 15:30`, linking to the booking service page with
   `utm_medium=widget_tour_cta` and `utm_content=<widget-slug>_widget_nextslot`.
2. **Third-party embed guard (the key risk):** only render this when the widget
   is embedded on berlinwalk.com, never on a third-party site (a booking CTA on
   someone else's page is wrong and could deter embedding). Detect first-party
   via `document.referrer` origin and/or an explicit `?host=berlinwalk` hint
   passed by the tools-hub/tool-page embeds. If origin cannot be confirmed as
   first-party, render only the badge (current behavior). `?attribution=none`
   (gallery previews) suppresses both, as today.
3. Keep it one line, brand-styled, never a second card or popup; must not change
   widget height enough to break the `bw-resize` messaging.
4. Load `next-tour-slot.js` inside the widget or inline a minimal slot calc
   (widgets are standalone; keep the dependency light). Fail-safe: no slot,
   badge only.
5. This is opt-in per widget is NOT required — brand.js covers all widgets — but
   confirm on 3 high-intent tools (safety, drinking-water, public-toilets) and 1
   pre-trip tool (daily-budget) that the line reads sensibly, then ship for all
   first-party widgets.

If Task 2's origin detection proves unreliable in the time available, ship Task 1
alone; Task 1 is the higher-value, lower-risk half.

## Measurement

- Same weekly funnel: `booking-funnel-wix-report.mjs` +
  `paid-funnel-events-report.mjs`. The new events (`bw_tool_book_bridge_click`,
  `bw_tool_bridge_view`, widget CTA under `utm_medium=widget_tour_cta`) let the
  report split booking-page arrivals by surface: blog vs tool vs widget vs
  sticky.
- Metric of record stays booking-page sessions/week (baseline ~12 pre-Wave-A)
  and confirmed bookings/30d (baseline 7, all real). Verify real vs test with
  `booking-lead-time-report.mjs`.
- Day 7 and day 14 after deploy: append the per-surface split to the workspace
  `SESSION_LOG.md` so Yusuf sees which surface produces booking-page sessions.

## Task 3 (required) — Both-slots copy on EVERY dynamic surface

Yusuf's decision (2026-07-06): show `11:30 and 15:30` everywhere in season, not
just the tool bridge. Audit done 2026-07-06 — current live state per surface:

| # | Surface | File | Current copy | Helper? | Both slots? |
|---|---|---|---|---|---|
| 1 | Sticky bar | `berlinwalk-sticky-cta-color-polish.html` (workspace root) | `Tue 11:30 + Wed 11:30` (next two DAYS, each 11:30) | No, own inline logic | No — shows 2 days, not 2 times |
| 2 | Blog journey booking card | `js/blog-journey-inject.js` (~line 1609) | `Tomorrow (Wed) at 11:30, walk Berlin with me` | Yes (`bwNextTourSlot`) | No — 11:30 only |
| 3 | Exit popup | `js/exit-intent-popup.js` (~line 146) | `Next walk: Tomorrow (Wed) at 11:30. Free, tip-based.` | No, own inline logic (`TOUR_START_LABEL='11:30'`) | No — 11:30 only |
| 4 | Service-page hero next-walk | `book/book-element.js` (~line 426) | `Saturday 11:30` | Yes (`bwNextTourSlot`) | No — 11:30 only |
| 5 | Site header trust line | `site-header/site-header-element.js` (866, 972) | `Tue-Sat 11:30 · From 3 July: +15:30 · World Clock` | No, static | YES already |
| 6 | Paid landing top strip | `paid-landing/paid-landing-element.js` (~81) | `...Tue-Sat 11:30 - From 3 July 2026: 11:30 + 15:30` | No, static | YES already |
| 7 | Booking calendar intro chips | `booking-calendar/booking-calendar-element.js` | chips `Tue-Sat 11:30`, `From 3 July 2026: 11:30 + 15:30` | No, static | YES already |

Do #1-#4 (the dynamic surfaces). #5-#7 already state both slots — leave them,
only fix wording drift if any.

Per surface:

- **#2 Blog journey card & #4 service hero** already call the shared helper, so
  after Task 0 they just consume `slotsLabel`/`slotCount`:
  - Journey card: `` `${relativeLabel} at ${slotsLabel}, walk Berlin with me` ``
    (unchanged when one slot).
  - Service hero: `` `${relativeLabel} ${slotsLabel}` `` (drop the plain
    weekdayLabel-only form so it matches).
- **#3 Exit popup** has its own inline slot logic. Either load `next-tour-slot.js`
  (it is a plain script, popup can add it) or mirror the Task 0 season logic
  inline. Target: `` `Next walks: ${relativeLabel} at ${slotsLabel}. Free, tip-based.` ``
  (singular `walk` when one slot). Repin the Wix embed after push.
- **#1 Sticky bar** is a deliberate behavior change: today it lists the next two
  DAYS at 11:30; switch it to the next tour day with both TIMES, matching the
  rest. It cannot easily load an external helper (minified 15KB-cap embed), so
  mirror the Task 0 season logic inline. Target in season:
  `Next tour · <Weekday> 11:30 and 15:30`; off-season fall back to the single
  slot (and, if space allows, keep a second upcoming day as the alternative
  instead). Keep desktop/mobile labels within the existing width; if
  `11:30 and 15:30` is too wide for the compact mobile pill, use `11:30 + 15:30`.
  `--dry-run` the embed updater first, watch the 15KB cap, then deploy + readback.

Consistency rule for all four: identical season source (Task 0), identical
singular/plural handling, never a past or out-of-season time. Ship Task 3 in the
same wave as the tool bridge so the whole site flips to both-slots together
rather than drifting surface by surface.

## Honesty note

Tool/utility and blog readers will never convert to the tour at a high rate;
their correct monetization is also the €9 First-Day Rescue Plan and the tools
themselves. Wave C widens the top of the booking funnel from the highest-intent
owned surface that currently has no in-content offer. Judge it on incremental
booking-page sessions from `tool_bridge`/`widget_tour_cta`, not on a big total
conversion jump.

## QA additions for the both-slots copy

- Summer future day (current dates): tool bridge title reads `Next free walks:
  Tomorrow (Tue) at 11:30 and 15:30`, plural `walks`.
- Off-season simulation (fake clock in Nov via the helper's injectable `now`):
  reads `Next free walk: ... at 11:30`, singular.
- Summer same-day after 11:30 cutoff: shows only `15:30`, singular.
- `slotsLabel` never shows a past slot; no surface prints a time the availability
  endpoint would not return for that day.

## Explicit non-goals

- Do not rebuild the service-page calendar or its `/booking-form` handoff (live
  and verified).
- No routing experiment in this wave (inherit Wave B's `resolveBookingDestination`).
- No booking CTAs on third-party embeds (Task 2 first-party guard).
- No Meta/paid changes. No popups or interstitials on tool pages.
- Do not edit 60+ BerlinTools CMS pages by hand; the bridge is script-injected.
