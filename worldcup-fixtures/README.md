# worldcup-fixtures

Standalone BerlinTools widget: the full **2026 FIFA World Cup schedule in Berlin
time (CEST)**.

- `index.html` — self-contained widget (scoped CSS + JS, links `../css/brand.css`
  and `../js/brand.js`). No build step.
- Shows all 72 group-stage matches grouped by day, plus the knockout calendar
  (Round of 32 → Final). Times are pre-converted to **Berlin time (CEST, UTC+2)**.
- Features: live "next match" countdown, quick filters (All / Germany 🇩🇪 /
  Evening-friendly / Today), a "filter by team" select (all 48 teams), a
  "jump to a day" select, and 🟢 evening / 🌙 late / 🌅 morning slot tags.
  The quick filters, team filter and day jump reset each other so only one
  view is active at a time.
- Match data is inlined in `index.html` as the `M` (group stage) and `KO`
  (knockout) arrays. To edit a fixture, change the relevant row. `KO` now
  stores all 32 knockout fixtures with match number, Berlin time, seed labels,
  matchup/slot labels, venue, and a projection flag for rows that can still
  move while group-stage games are unfinished.
- Score automation rule: when verified final scores are added, update the
  handoff logs, run the local checks, commit the widget repo changes, and push
  `main` so GitHub Pages can deploy the live widget. If no score is due, keep
  the run as a true no-op: no file edits, no logs, no commit and no push.
- Knockout display rule: eliminated teams must be visually crossed out in final
  knockout cards, including matches decided by penalty shootout.

**Data note:** the group-stage fixtures and kick-off times were assembled from
public 2026 World Cup CET schedules and cross-checked against anchor matches
(opener, Germany's three games). Reconfirm against the official FIFA schedule
before relying on exact times. Knockout Round of 32 matchups use the current
local group table where known; rows involving unfinished groups or third-place
allocation remain marked as projected until the group stage is final.

Live URL after push: `https://fenerszymanski.github.io/berlinwalk-widgets/worldcup-fixtures/`
