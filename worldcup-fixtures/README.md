# worldcup-fixtures

Standalone BerlinTools widget: the full **2026 FIFA World Cup schedule in Berlin
time (CEST)**.

- `index.html` — self-contained widget (scoped CSS + JS, links `../css/brand.css`
  and `../js/brand.js`). No build step.
- Shows all 72 group-stage matches grouped by day, plus the knockout calendar
  (Round of 32 → Final). Times are pre-converted to **Berlin time (CEST, UTC+2)**.
- Features: live "next match" countdown, filters (All / Germany 🇩🇪 /
  Evening-friendly / Today), a "jump to a day" select, and 🟢 evening /
  🌙 late / 🌅 morning slot tags.
- Match data is inlined in `index.html` as the `M` (group stage) and `KO`
  (knockout) arrays. To edit a fixture, change the relevant row.

**Data note:** the group-stage fixtures and kick-off times were assembled from
public 2026 World Cup CET schedules and cross-checked against anchor matches
(opener, Germany's three games). Reconfirm against the official FIFA schedule
before relying on exact times. Knockout match-ups are placeholders until the
group stage is decided.

Live URL after push: `https://fenerszymanski.github.io/berlinwalk-widgets/worldcup-fixtures/`
