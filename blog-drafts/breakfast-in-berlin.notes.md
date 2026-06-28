# Breakfast in Berlin - Production Notes

Status: local package in progress for daily blog automation on 2026-06-28 Europe/Berlin.

## Topic Selection

- Chosen topic: `Breakfast in Berlin: Bakery, Brunch and Coffee Without Losing the Morning`
- Focus keyword: `breakfast in Berlin`
- Slug: `breakfast-in-berlin`
- Category: Tourist Tips
- Search intent: a visitor wants to know what kind of breakfast to choose before sightseeing, a walking tour, Sunday closures, transport, or a slow brunch morning.
- Dedupe check:
  - Wix inventory: 150 published, 167 draft/draft-post records fetched to `output/automation-reports/berlinwalk-daily-blog-draft/2026-06-28-1300/wix-blog-inventory.json`.
  - `breakfast`, `bakery`, `bakeries`, `brötchen` had no live title matches.
  - Related but distinct live topics: `kaffee-vs-coffee-a-beginner-s-guide-to-german-café-culture`, `how-to-read-a-german-menu-without-panicking`, `where-to-eat-near-alexanderplatz-without-getting-ripped-off`, `5-best-coffee-shops-near-hackescher-markt-a-local-s-guide`, `grocery-shopping-in-berlin`.
- Reason selected: practical tourist-intent gap, strong morning logistics/tour connection, no close duplicate, useful enough for a tool.

## Research Sources

- Berlin.de Sunday/shop closure guidance: searched and used for Sunday/public-holiday planning context.
- BVG official ticket pages: used for current ticket-check link and transport-day framing.
- visitBerlin breakfast/brunch page: used for broad tourism inspiration link.
- Markthalle Neun official/Wikimedia context: used only as market-breakfast visual context, not as a claim that every market day is breakfast-specific.

## Widget Ideas

1. Berlin Breakfast Clock: a time/day/budget/appetite board that recommends bakery sprint, cafe pause, brunch block, hotel buffet, station rescue, or market detour. Chosen because it fits the article's morning-rhythm core and is useful as a Berlin Tool.
2. Bakery vs Brunch Cost Meter: compares rough breakfast routes by price and time. Rejected because it would become another calculator and is less emotionally/article-fit.
3. Morning Route Timer: maps breakfast choices to the 11:30 tour start. Rejected because it is too tour-specific for BerlinTools.

## Visual Gate

- Final set: 5 Wikimedia Commons images.
- Contact sheet: `berlinwalk-widgets/blog-drafts/images/breakfast-in-berlin/contact-sheet-final.jpg`.
- Cover choice: `02-berlin-bakery-view.jpg`, because it is instantly readable at card crop size and communicates bakery breakfast better than a generic food plate.
- Rejected: `05-berlin-cafe-morning-context.jpg`, a weak exterior/context shot that did not clearly signal breakfast.
- No paid image/video API used. No AI article visuals used.

## SEO Plan

- SEO title: `Breakfast in Berlin: Bakery, Brunch and Coffee`
- Meta description: `Breakfast in Berlin guide for tourists: bakery, cafe, brunch, hotel buffet, Sunday rules, cash/card tips and the easiest morning before sightseeing.`
- Excerpt: `A practical guide to breakfast in Berlin: when to choose a bakery, cafe, brunch, hotel buffet or station rescue so the rest of your sightseeing day still works.`
- Tags: `Breakfast in Berlin`, `Berlin bakery`, `Berlin brunch`, `Berlin cafes`, `Berlin tourist tips`
- Structured data: BlogPosting plus FAQPage via `faq/inject.js` slug map.
