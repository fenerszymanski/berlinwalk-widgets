# Trip Planner — Next Level Plan (Codex execution spec)

> **Historical plan.** The current paid Trip Planner 3.1 product and release
> gates are defined in `TRIP_PLANNER_31_RELEASE_RUNBOOK.md`. In particular, the
> current customer runtime is AI-off and the old "no paid planner tier" rule
> below no longer describes the live product direction.

Written 2026-07-05 by Claude after a full logic + live-output review. Yusuf approved
the direction: the planner stays **free lead-gen** and becomes the top-of-funnel for
the €9 First-Day Rescue Plan. No paid planner tier until Yusuf explicitly decides
(after First-Day Rescue has real conversion data).

Read first: `PLANNER_LOGIC_REVIEW.md` (logic map, verified accurate 2026-07-05),
workspace `SESSION_LOG.md` entry 2026-07-05 17:50 CEST (crash fix context), and
`../BERLINWALK_EDITORIAL_VOICE_STANDARD.md` before touching any public copy.

Hard rules for every wave:
- First-person singular in public copy (`I`, `my`). Never collective `we/our/us`.
- No em dashes in public copy. Editorial voice per the 3 July Neukölln standard.
- Playwright QA desktop + 390px mobile, overflow 0, console errors 0, before push.
- Update `PLANNER_LOGIC_REVIEW.md` in the same commit whenever plan logic changes.
- QA plans via restore URL: `/?planAccess=1&qaUnlock=1&mockAi=1&date=...&tripLength=...&...`
  (qaUnlock/mockAi work only on localhost). Never write live leads or live
  `TripPlannerEvents` rows during QA; tracking stays consent-gated.
- No Meta campaign changes. Reactivation is Yusuf's call only.

---

## Wave 0 — Stabilize (do first, small commits)

### 0.1 Verify the crash fix live
Commit `b2d8f69` fixes the init crash (consent state was read before it was
declared; every load since `a7b5ce7` on 2026-07-01 threw and killed the widget).
After push + Pages deploy: confirm on live `/berlin-trip-planner` that the date
input has a `min` attribute set (init marker), the quiz answers clicks, and a
plan builds. Then confirm `TripPlannerEvents` receives rows again after consent
acceptance (they were 0 from 2026-07-02 to 2026-07-05).

### 0.2 Make widget death loud (never again 4 silent days)
Two layers, both cheap:
1. In `index.html`, wrap the main IIFE body's init tail in a `try/catch`. On
   catch: render a visible fallback inside the widget shell ("The planner did
   not load. Refresh the page or email me via berlinwalk.com.") and `console.error`
   the real error. Do not swallow errors invisibly.
2. Add a daily local monitor to the existing LaunchAgent family (pattern:
   `com.berlinwalk.*` plists + workspace `scripts/`): headless-load the live
   widget URL, assert the init marker (`[data-arrival-date]` has `min`), assert
   one restore-URL plan renders `[data-day-card]` count == tripLength. Log to
   `~/Library/Logs/BerlinWalk/`. On failure the daily executive summary
   automation should surface it (it reads report scripts; give it a readable
   status file, e.g. `output/automation-reports/trip-planner-healthcheck-latest.json`).

### 0.3 Fix block time overlaps
Confirmed bug: Day 1 lunch `13:30-14:30` overlaps afternoon `14:00-16:30`.
Times are assigned per-template; replace with a small sequential scheduler:
each block's start >= previous block's end, keep the existing durations.
Acceptance: for scenarios A and B below, no two blocks on any day overlap.

---

## Wave 1 — Correctness a paying tourist would notice
(These make or break trust. They also unblock any future paid tier.)

### 1.1 Place catalog metadata (the structural enabler)
Extend the place catalog entries (around `index.html:11100+`, IDs like
`museum_island`, `topography_terror`) with:
- `closedDays`: array of weekday numbers (e.g. Museum Island museums `[1]` for
  Monday where true; verify each venue individually, do not blanket-apply),
- `indoor`: boolean (rain logic),
- `note`: one short practical line (e.g. Reichstag dome needs advance booking).
Keep it honest: only encode closures that are stable rules. Where a venue
varies, leave `closedDays` empty and put the caution in `note`.

### 1.2 Monday/Sunday/holiday day-swapping (currently the worst output bug)
Verified failure: 5-day family scenario (arrive Sun 2026-07-12) put the full
Museum Island day on Monday 13 Jul with ZERO visible warning anywhere on the
page, including the Review lens. Required behavior, in order of preference:
1. During queue assignment in `buildPlan()` (`index.html:17381`), if a `museums`
   day lands on a date where its anchor places are closed, swap it with the
   nearest day whose type is outdoor-safe (`wall`, `free`, `history`, `local`).
2. If no swap is possible (short trips), keep the day but inject a prominent
   warning block at the top of the day card naming the closure and switching
   the morning anchor to an open alternative from the fallback pools.
Same mechanism covers Sundays (shopping copy) and the Berlin holiday list the
widget already has for `dayStatus()`.
Acceptance: scenario B below must either move museums off Monday or show the
warning in the rendered day card text (grep the card innerText for `Monday`).
Also render `dayStatus().note` in the unlocked full-plan day cards; today the
note exists in state but never reaches the unlocked surface.

### 1.3 Decisive copy pass (one recommendation, not a menu)
Yusuf's brand is one clear call. Templates still hedge: `Reichstag dome or
Topography of Terror`, `Sanssouci or Berlin backup`. Rework the ~7 core day
templates and tour-framework variants so each block names ONE primary choice
based on inputs (budget, rain concern, group type), with the alternative as a
single short fallback sentence ("If rain wins, switch to ..."). Use the new
`indoor`/`closedDays` metadata to pick.

### 1.4 Copy hygiene and repetition
- Remove collective voice. Confirmed live string: `We're waiting for you!` in
  the Day 1 arrival copy. Audit all template + AI-fallback strings for `we/our/us`.
- Fix the Day 1 wall-focus contradiction: copy says "one big Wall site today,
  like Bernauer Strasse" while the anchor/map link is Topography of Terror, and
  Day 3 then opens with Bernauer anyway. Copy must name the anchor it links.
- Nearby add-on copy repeats verbatim on consecutive days ("One more Museum
  Island edge" twice in scenario B). Track used add-on copy the same way
  anti-repeat tracks place IDs; add 1-2 variants per add-on type.
- Gentle mode: cap coffee-pause blocks at every other day, not every day.

### 1.5 Small logic upgrades already flagged in PLANNER_LOGIC_REVIEW.md
- Tour-framework focus priority: `History`/`Wall` should outrank `Museums` when
  multiple interests are selected. The BerlinWalk tour IS history/wall; the
  current Museums-first priority weakens the tour-day fit and the sales bridge.
- Make `Potsdam / day trip` a visible interest chip (only offered when
  tripLength >= 4 and arrival is not evening; keep the automatic 5+ day rule
  as fallback).
- Weather-driven reordering: when the live forecast shows a clearly rainy day
  inside the trip window, prefer swapping an indoor-heavy day onto it (same
  swap mechanic as 1.2, driven by `indoor` metadata).

---

## Wave 2 — Funnel: planner feeds the €9 First-Day Rescue Plan
(This is the business reason the planner exists. June data: 24 sessions/wk,
5 engaged, 2 unlocks, 0 book clicks. Unlock-to-booking is the broken link.)

### 2.1 Rescue Plan cross-sell inside the unlocked plan
Day 1 of every generated plan is exactly the Rescue Plan's job, minus live
data. Add one restrained cross-sell card at the END of the Day 1 card (not a
banner, not a popup), voice-true, e.g.: arrival chaos is the expensive part,
the free plan gives the shape, the €9 plan gives the exact hour-by-hour
decision with live route times, link to
`https://www.berlinwalk.com/products/berlin-first-day-rescue-plan` with
`utm_source=trip_planner&utm_medium=widget&utm_campaign=tp_rescue_bridge` plus
`utm_content` naming the surface (day1_card / email / followup). Track click as
`bw_trip_planner_rescue_cta_click` (consent-gated like all events). Show it
only when `tourIntent !== 'booked'` is irrelevant here; show always, but never
inside the locked preview (locked users should unlock first).

### 2.2 Cross-sell in the email journey
The 5 Triggered Emails (Instant `VLDqhLM`, Minus7 `VLDvLj8`, Minus3 `VLDvnng`,
Minus1 `VLDwKUu`, DayOf `VLDwjZc`) and Velo `tripPlannerFunnel.js` currently
bridge only to the tour. Add one Rescue Plan paragraph to Instant and Minus1
(the two highest-intent moments: just planned, and day before arrival).
Constraint: Wix Triggered Email edits are paste-publish via Yusuf's session
(sanitizer strips code); prepare updated paste-ready HTML in `email/paste-ready/`
and hand Yusuf the one-step paste instructions in Turkish, one email at a time.
Do not silently re-subscribe anyone; no change to lead payload or CMS schema.

### 2.3 Fix the tour booking bridge (0 book clicks after unlock)
The recommended-tour-day card needs a real CTA, not a text mention:
- Button on the tour day card: `Reserve the {weekday} 11:30 spot` linking to the
  booking route with UTMs (`utm_campaign=tp_tour_bridge`). If a date-preselect
  query param for the Wix booking page exists (check `book/` + booking-calendar
  notes in AGENTS.md before inventing one), use it; otherwise plain route link.
- Repeat the same CTA once under the plan actions row (PDF/print/share).
- Track as the existing `bw_trip_planner_book_click` so the funnel report keeps
  working without schema changes.

### 2.4 Quiz drop-off instrumentation, then shorten
Passive loads are 19 of 24 sessions. `bw_trip_planner_quiz_step_view` +
`bw_trip_planner_quiz_answer` events already exist; extend
`scripts/trip-planner-events-report.mjs` (workspace) with a per-step funnel
table (step_key views -> answers). Decide shortening AFTER data: if drop is at
step 1-2, the problem is the opening promise, not length. Only then consider
collapsing the 12-step quiz to: date + length + arrival time (step 1),
interests + pace (step 2), everything else into the existing
`Fine-tune my plan` panel with honest defaults summary (the two-step flow that
existed before the quiz experiment; its code paths are still in the file).

---

## Wave 3 — Product depth (after Waves 0-2 are live and stable)

### 3.1 Reuse the First-Day Rescue live-facts layer for Day 1
The rescue backend (`berlinwalk-content-app/api/_lib/`, data layer
`rescue-data-v1.0.0`) already computes live route times and arrival facts.
Explore a read-only enrichment endpoint the planner can call for UNLOCKED
plans only (cost control): Day 1 gets live BER->base route time and the same
ABC/AB ticket decision the paid product uses, clearly lighter than the paid
plan (shape vs exact plan). Guard: quota + cache by (arrivalPoint, stayArea)
so it cannot become a per-visitor Gemini bill. If cost or Vercel function
count (Hobby limit 12, everything aliases through `track-trip-planner-event.js`)
makes this awkward, skip it; do not add a new Vercel function for this.

### 3.2 Full-day route links sanity pass
Each day has OPEN ROUTE (multi-stop Google Maps). Verify stop order matches
block order after 1.2/1.3 swaps, and that swapped days rebuild their route URL.

### 3.3 PDF/print polish
After the copy pass, regenerate the print/PDF view and check it against the
new day cards (warnings from 1.2 must appear in print too; buyers forward
these PDFs).

---

## Explicit non-goals (do not build)
- No paid planner tier, no price test, no checkout on the planner. Yusuf
  decides after First-Day Rescue data (2-3 weeks).
- No new Meta campaigns or reactivation of paused Trip Planner campaigns.
- No lead payload / `TripPlannerLeads` / CMS schema changes in Waves 0-2.
- No visual redesign; the board/lens UI stays.

## Acceptance scenarios (run all before any push that touches plan logic)
A. `date=2026-07-14&tripLength=3&arrivalTime=morning&arrivalPoint=ber&stayArea=mitte&groupType=solo&firstTime=yes&interests=history,wall&budgetStyle=smart&mustHandle=rain&pace=balanced&tourIntent=considering`
   - Day 1 contains the 11:30 BerlinWalk block; no time overlaps; Wall copy
     names the anchor it maps; no `we/our/us` in any rendered string.
B. `date=2026-07-12&tripLength=5&arrivalTime=evening&arrivalPoint=ber&stayArea=north&groupType=family&firstTime=yes&interests=museums,food&budgetStyle=comfort&mustHandle=reservations&pace=gentle&tourIntent=considering`
   - Museums day is NOT on Monday, or the Monday card visibly warns and swaps
     anchors; no Potsdam (evening arrival rule); add-on copy not repeated
     verbatim on consecutive days; coffee pauses on at most every other day.
C. `date=2026-12-24&tripLength=3` (any sensible rest) - holiday notes render
   on the unlocked day cards for Dec 24-26.
D. 1-day trip, Monday arrival, museums interest - warning or decisive
   alternative, never a silent museum plan.
E. Same URL twice - identical plan (determinism is fine and expected; it is a
   free tool, not the paid product).

## Suggested commit sequence
One commit per numbered item where practical, session log entry per session,
`node --check` on extracted inline script (see scratch pattern: pull the
`<script>` body out and syntax-check) plus the Playwright pass before push.
