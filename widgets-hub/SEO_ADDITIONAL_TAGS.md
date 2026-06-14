# Wix /widgets Page — Advanced SEO Setup

Paste these blocks into **Wix Studio → /widgets page → Page Info → Advanced SEO**.

The two sections below are independent:
1. **Additional Tags** — Open Graph + Twitter Card meta. Paste each line as a separate entry.
2. **Structured Data** — One JSON-LD block (`CollectionPage` + `ItemList` listing all current embeddable tools). Paste as one entry.

When a new widget gets added to `tools-hub/data.json`, re-run `widgets-hub/_regenerate_seo.py` (below) to refresh the ItemList.

---

## 1. Additional Tags

Add each `<meta>` / `<link>` line as a separate Additional Tag in Wix:

```html
<meta property="og:type" content="website" />
<meta property="og:url" content="https://www.berlinwalk.com/widgets" />
<meta property="og:title" content="Embed Free Berlin Planning Tools on Your Site | BerlinWalk" />
<meta property="og:description" content="Free interactive Berlin planning tools for travel sites, hotels, and bloggers: weather, transport, maps, calculators. Copy a one-line snippet, no signup, just attribution." />
<meta property="og:image" content="https://static.wixstatic.com/media/5a08a3_f2d364781904464b9b07840378001c0d~mv2.png" />
<meta property="og:site_name" content="BerlinWalk" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Embed Free Berlin Planning Tools on Your Site | BerlinWalk" />
<meta name="twitter:description" content="Free interactive Berlin planning tools, copy a one-line snippet to embed on any travel site, hotel page, or blog." />
<meta name="twitter:image" content="https://static.wixstatic.com/media/5a08a3_f2d364781904464b9b07840378001c0d~mv2.png" />
<link rel="canonical" href="https://www.berlinwalk.com/widgets" />
```

(Wix already auto-generates `<title>` and basic `<meta name="description">` from the page's SEO fields, so no need to add those here.)

---

## 2. Structured Data Markup

Wix's Advanced SEO Structured Data field has a 7000 character limit, so the block below is minified (single line). It's a `CollectionPage` with a `mainEntity` `ItemList` containing all current embeddable tools as minimal `ListItem` entries (position + deep URL).

Trade-offs to keep size down: dropped per-item `WebApplication` wrappers (no `applicationCategory`, `operatingSystem`, or `offers: 0 EUR`), dropped per-item names, and dropped the separate `@graph` WebSite + Organization nodes (Wix injects its own site-level Organization markup elsewhere). The current list fits under the Wix limit with 50+ tools.

Paste this single line as a Structured Data entry in Wix Advanced SEO:

```json
{"@context":"https://schema.org","@type":"CollectionPage","url":"https://www.berlinwalk.com/widgets","name":"Embed Free Berlin Planning Tools","description":"Free embeddable Berlin planning tools for travel sites, hotels, and bloggers. Auto-resize, mobile-friendly, attribution-only.","inLanguage":"en","publisher":{"@type":"TravelAgency","name":"BerlinWalk","url":"https://www.berlinwalk.com/"},"mainEntity":{"@type":"ItemList","numberOfItems":51,"itemListElement":[{"@type":"ListItem","position":1,"url":"https://www.berlinwalk.com/tools/spati-survival-checker"},{"@type":"ListItem","position":2,"url":"https://www.berlinwalk.com/tools/vegan-berlin-locations-map"},{"@type":"ListItem","position":3,"url":"https://www.berlinwalk.com/tools/vegan-berlin-map"},{"@type":"ListItem","position":4,"url":"https://www.berlinwalk.com/tools/watch-world-cup-2026-berlin"},{"@type":"ListItem","position":5,"url":"https://www.berlinwalk.com/tools/world-cup-2026-fixtures-berlin-time"},{"@type":"ListItem","position":6,"url":"https://www.berlinwalk.com/tools/basketball-worldcup-fixtures"},{"@type":"ListItem","position":7,"url":"https://www.berlinwalk.com/tools/basketball-worldcup-venues-map"},{"@type":"ListItem","position":8,"url":"https://www.berlinwalk.com/tools/berlin-pride-week-timeline"},{"@type":"ListItem","position":9,"url":"https://www.berlinwalk.com/tools/berlin-pride-parade-map"},{"@type":"ListItem","position":10,"url":"https://www.berlinwalk.com/tools/welcomecard-calculator"},{"@type":"ListItem","position":11,"url":"https://www.berlinwalk.com/tools/transport-ticket-calculator"},{"@type":"ListItem","position":12,"url":"https://www.berlinwalk.com/tools/berlin-daily-budget"},{"@type":"ListItem","position":13,"url":"https://www.berlinwalk.com/tools/berlin-tip-calculator"},{"@type":"ListItem","position":14,"url":"https://www.berlinwalk.com/tools/best-month-to-visit-berlin"},{"@type":"ListItem","position":15,"url":"https://www.berlinwalk.com/tools/berlin-weather-by-month"},{"@type":"ListItem","position":16,"url":"https://www.berlinwalk.com/tools/what-to-pack-berlin"},{"@type":"ListItem","position":17,"url":"https://www.berlinwalk.com/tools/berlin-daylight-hours"},{"@type":"ListItem","position":18,"url":"https://www.berlinwalk.com/tools/compare-berlin-months"},{"@type":"ListItem","position":19,"url":"https://www.berlinwalk.com/tools/berlin-drinking-water"},{"@type":"ListItem","position":20,"url":"https://www.berlinwalk.com/tools/berlin-public-toilets"},{"@type":"ListItem","position":21,"url":"https://www.berlinwalk.com/tools/berlin-luggage-storage"},{"@type":"ListItem","position":22,"url":"https://www.berlinwalk.com/tools/berlin-currywurst-finder"},{"@type":"ListItem","position":23,"url":"https://www.berlinwalk.com/tools/berlin-sunday-shopping"},{"@type":"ListItem","position":24,"url":"https://www.berlinwalk.com/tools/berlin-shopping-areas"},{"@type":"ListItem","position":25,"url":"https://www.berlinwalk.com/tools/berlin-landmarks-map"},{"@type":"ListItem","position":26,"url":"https://www.berlinwalk.com/tools/medieval-berlin-mini-walk"},{"@type":"ListItem","position":27,"url":"https://www.berlinwalk.com/tools/east-side-gallery-murals"},{"@type":"ListItem","position":28,"url":"https://www.berlinwalk.com/tools/berlin-day-trips-finder"},{"@type":"ListItem","position":29,"url":"https://www.berlinwalk.com/tools/whats-open-in-berlin-today"},{"@type":"ListItem","position":30,"url":"https://www.berlinwalk.com/tools/berlin-first-day-planner"},{"@type":"ListItem","position":31,"url":"https://www.berlinwalk.com/tools/hackescher-after-tour-planner"},{"@type":"ListItem","position":32,"url":"https://www.berlinwalk.com/tools/free-berlin-audio-tour"},{"@type":"ListItem","position":33,"url":"https://www.berlinwalk.com/tools/berlin-free-things-to-do"},{"@type":"ListItem","position":34,"url":"https://www.berlinwalk.com/tools/berlin-safety"},{"@type":"ListItem","position":35,"url":"https://www.berlinwalk.com/tools/berlin-lakes"},{"@type":"ListItem","position":36,"url":"https://www.berlinwalk.com/tools/berlin-pools"},{"@type":"ListItem","position":37,"url":"https://www.berlinwalk.com/tools/east-or-west-1989"},{"@type":"ListItem","position":38,"url":"https://www.berlinwalk.com/tools/berlin-3-day-itinerary"},{"@type":"ListItem","position":39,"url":"https://www.berlinwalk.com/tools/alex-mistakes"},{"@type":"ListItem","position":40,"url":"https://www.berlinwalk.com/tools/alexanderplatz-parking-map"},{"@type":"ListItem","position":41,"url":"https://www.berlinwalk.com/tools/berlin-parking-calculator"},{"@type":"ListItem","position":42,"url":"https://www.berlinwalk.com/tools/berlin-connectivity-picker"},{"@type":"ListItem","position":43,"url":"https://www.berlinwalk.com/tools/berlin-club-picker"},{"@type":"ListItem","position":44,"url":"https://www.berlinwalk.com/tools/berlin-wall-remnants"},{"@type":"ListItem","position":45,"url":"https://www.berlinwalk.com/tools/german-phrases-quiz"},{"@type":"ListItem","position":46,"url":"https://www.berlinwalk.com/tools/berlin-beer-gardens-map"},{"@type":"ListItem","position":47,"url":"https://www.berlinwalk.com/tools/christmas-markets-map"},{"@type":"ListItem","position":48,"url":"https://www.berlinwalk.com/tools/berlin-boat-tour-finder"},{"@type":"ListItem","position":49,"url":"https://www.berlinwalk.com/tools/berlin-pfand-calculator"},{"@type":"ListItem","position":50,"url":"https://www.berlinwalk.com/tools/berlin-city-tax-calculator"},{"@type":"ListItem","position":51,"url":"https://www.berlinwalk.com/tools/berlin-taxi-uber-cost-checker"}]}}
```

---

## How to regenerate this file

When a new widget gets added to `tools-hub/data.json`, run:

```bash
python3 widgets-hub/_regenerate_seo.py
```

It re-reads `tools-hub/data.json` and rewrites the ItemList section of this file. Then re-paste the Structured Data block into Wix Advanced SEO.
