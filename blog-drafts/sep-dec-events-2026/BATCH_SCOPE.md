# September–December 2026 Events Batch — Production Scope Lock

Status: local production control only. No Wix Blog post may be published from this batch.

## Locked identities

| # | Post slug | Tool slug | Current content gate |
|---|---|---|---|
| 1 | `film-festivals-berlin-autumn` | `berlin-autumn-film-language-board` | Draftable; screening-language comparison stays conditional until each programme is live. |
| 2 | `giant-kite-festival-berlin` | `tempelhof-kite-day-approach` | Draftable only with multi-gate, organiser-led access guidance. |
| 3 | `ice-hockey-basketball-berlin` | `uber-arena-night-cost-clock` | Draftable; schedules, prices and journeys carry a checked-on boundary. |
| 4 | `pyronale-berlin` | `berlin-double-closure-weekend` | Draftable; no unsupported closure or return-time verdicts. |
| 5 | `tag-der-clubkultur-berlin` | `clubkultur-week-door-free-finder` | Draftable; end date and per-event access remain live-programme checks. |
| 6 | `berlin-food-week` | `food-week-can-i-actually-go` | Draftable; access classes are free entry, reservation, ticket, invite-only or check details. |
| 7 | `jazzfest-berlin` | `jazzfest-room-comparator` | Draftable; programme-specific choices remain an official-programme check until published. |
| 8 | `berlin-science-week` | `science-week-three-day-window` | Draftable; optimisation stays conditional until the official schedule is published. |
| 9 | `berlin-freedom-week` | `november-nine-hour-line` | Draftable; programme-specific output stays behind a current official check. |
| 10 | `christmas-garden-berlin` | `christmas-garden-closed-night-calendar` | Draftable with date-specific closing-time rules and no fixed central-Berlin departure claim. |
| 11 | `berlin-christmas-events-beyond-markets` | `berlin-christmas-window-overlap` | Draftable only after the scope is reduced to verified non-market events and ending window extends to 9 January. |

## Mandatory redesigns

- W9 becomes an evidence-desk interaction: a visitor selects a purpose and receives a source-backed confirmed anchor, a programme-not-yet-published warning, or a safer next check. It must not use a time scrubber or a map timeline.
- W10 presents blackout dates as reference only. Its interactive mechanic is a reverse leave-by ladder based on the selected entry time and departure area, never a generic date-availability checker.
- W11 uses fixed travel bands and an expiry ledger, not a draggable date interval, Gantt chart, or arbitrary arrival/departure fields.
- W8 may show a fixed ten-day data density strip only after programme data supports it. It may not use a draggable date window.

## Facts requiring live recheck before final Wix draft write

- Every screening language, subtitle language, Q&A language and individual festival venue.
- Tag der Clubkultur finishing date and all programme-level access claims.
- Jazzfest rooms, venues, ticket data and schedule.
- Science Week language, registration and daily-density data; Falling Walls relationship.
- Freedom Week 9 November anchors, times, accessibility and language.
- Every Christmas event date which does not have a 2026 organiser confirmation.

## Batch safety rules

- All 11 post and tool slugs were checked absent from live Blog API/CMS inventories on 22 August 2026. Re-run exact API slug checks immediately before each create request.
- `berlin-freedom-week` returning public HTTP 200 is a Wix soft-404 shell, not a post. API inventory is authoritative for collision checks.
- Use a clean `origin/main` worktree. The shared checkout is diverged and dirty.
- No final record is review-ready until body validation, distinct widget novelty proof, icon/source record, targeted QS/FAQ shards, tool CMS readback and draft GET readback all pass.
