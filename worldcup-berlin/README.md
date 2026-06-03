# worldcup-berlin

Standalone BerlinTools widget: **where to watch the 2026 World Cup in Berlin**.

- `index.html` — self-contained widget (scoped CSS + JS, links `../css/brand.css`
  and `../js/brand.js`). No build step.
- Filterable public-viewing venue cards (All / Free entry / Beer garden / By the
  water / Late-night OK), each with a neighbourhood chip, badges, a short
  description, and an "Open in Maps" link.
- Leads with the news hook: there is **no Brandenburg Gate fan mile in 2026**,
  and notes the Berlin rule that outdoor screening is allowed for matches that
  kick off by 10 pm.
- Venue data is inlined in `index.html` as the `V` array (tags drive the
  filters). To add or edit a venue, change that array.

**Data note:** venues were compiled from Berlin.de, visitBerlin and local press
in mid-2026. Screenings, hours and free/paid status can change; reconfirm before
publishing or visiting. Berlin.de publishes the full official screening list.

Live URL after push: `https://fenerszymanski.github.io/berlinwalk-widgets/worldcup-berlin/`
