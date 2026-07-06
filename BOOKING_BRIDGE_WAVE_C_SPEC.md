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
  slot logic.
- Playwright QA desktop + 390px, overflow 0, console 0, before push. QA event
  rows UTM-tagged `codex_wave_c_qa`, deleted after readback 0.
- Tools must not regress: the bridge is one restrained block after the tool, not
  a popup, not an interstitial, and must not shift or cover the widget.

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
   - Copy (next-slot aware, works for in-Berlin-now and soon-to-arrive):
     - Kicker: `While you are in Berlin`
     - Title: `` `Next free walk: ${relativeLabel} at 11:30` `` e.g.
       `Next free walk: Tomorrow (Tue) at 11:30`
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
   compact tour CTA line: `` `Next free Berlin walk: ${relativeLabel} 11:30` ``
   linking to the booking service page with `utm_medium=widget_tour_cta` and
   `utm_content=<widget-slug>_widget_nextslot`.
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

## Honesty note

Tool/utility and blog readers will never convert to the tour at a high rate;
their correct monetization is also the €9 First-Day Rescue Plan and the tools
themselves. Wave C widens the top of the booking funnel from the highest-intent
owned surface that currently has no in-content offer. Judge it on incremental
booking-page sessions from `tool_bridge`/`widget_tour_cta`, not on a big total
conversion jump.

## Explicit non-goals

- Do not rebuild the service-page calendar or its `/booking-form` handoff (live
  and verified).
- No routing experiment in this wave (inherit Wave B's `resolveBookingDestination`).
- No booking CTAs on third-party embeds (Task 2 first-party guard).
- No Meta/paid changes. No popups or interstitials on tool pages.
- Do not edit 60+ BerlinTools CMS pages by hand; the bridge is script-injected.
