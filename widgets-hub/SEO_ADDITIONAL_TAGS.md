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
{"@context":"https://schema.org","@type":"CollectionPage","url":"https://www.berlinwalk.com/widgets","name":"Embed Free Berlin Planning Tools","description":"Free embeddable Berlin planning tools for travel sites, hotels, and bloggers. Auto-resize, mobile-friendly, attribution-only.","inLanguage":"en","publisher":{"@type":"TravelAgency","name":"BerlinWalk","url":"https://www.berlinwalk.com/"},"mainEntity":{"@type":"ItemList","numberOfItems":76,"itemListElement":["https://www.berlinwalk.com/tools/berlin-bouncer","https://www.berlinwalk.com/tools/spati-survival-checker","https://www.berlinwalk.com/tools/pharmacy-in-berlin-helper","https://www.berlinwalk.com/tools/vegan-berlin-locations-map","https://www.berlinwalk.com/tools/vegan-berlin-map","https://www.berlinwalk.com/tools/watch-world-cup-2026-berlin","https://www.berlinwalk.com/tools/world-cup-2026-fixtures-berlin-time","https://www.berlinwalk.com/tools/basketball-worldcup-fixtures","https://www.berlinwalk.com/tools/basketball-worldcup-venues-map","https://www.berlinwalk.com/tools/berlin-pride-week-timeline","https://www.berlinwalk.com/tools/berlin-pride-parade-map","https://www.berlinwalk.com/tools/welcomecard-calculator","https://www.berlinwalk.com/tools/transport-ticket-calculator","https://www.berlinwalk.com/tools/berlin-public-transport-ferry-picker","https://www.berlinwalk.com/tools/berlin-bike-lane-reflex-checker","https://www.berlinwalk.com/tools/berlin-daily-budget","https://www.berlinwalk.com/tools/berlin-tip-calculator","https://www.berlinwalk.com/tools/best-month-to-visit-berlin","https://www.berlinwalk.com/tools/berlin-weather-by-month","https://www.berlinwalk.com/tools/what-to-pack-berlin","https://www.berlinwalk.com/tools/berlin-daylight-hours","https://www.berlinwalk.com/tools/compare-berlin-months","https://www.berlinwalk.com/tools/berlin-drinking-water","https://www.berlinwalk.com/tools/berlin-public-toilets","https://www.berlinwalk.com/tools/berlin-luggage-storage","https://www.berlinwalk.com/tools/berlin-currywurst-finder","https://www.berlinwalk.com/tools/berlin-sunday-shopping","https://www.berlinwalk.com/tools/berlin-shopping-areas","https://www.berlinwalk.com/tools/berlin-landmarks-map","https://www.berlinwalk.com/tools/unter-den-linden-walk-planner","https://www.berlinwalk.com/tools/medieval-berlin-mini-walk","https://www.berlinwalk.com/tools/east-side-gallery-murals","https://www.berlinwalk.com/tools/berlin-day-trips-finder","https://www.berlinwalk.com/tools/whats-open-in-berlin-today","https://www.berlinwalk.com/tools/berlin-first-day-planner","https://www.berlinwalk.com/tools/hackescher-after-tour-planner","https://www.berlinwalk.com/tools/free-berlin-audio-tour","https://www.berlinwalk.com/tools/berlin-free-things-to-do","https://www.berlinwalk.com/tools/berlin-safety","https://www.berlinwalk.com/tools/berlin-lakes","https://www.berlinwalk.com/tools/berlin-pools","https://www.berlinwalk.com/tools/east-or-west-1989","https://www.berlinwalk.com/tools/berlin-3-day-itinerary","https://www.berlinwalk.com/tools/alex-mistakes","https://www.berlinwalk.com/tools/alexanderplatz-parking-map","https://www.berlinwalk.com/tools/berlin-parking-calculator","https://www.berlinwalk.com/tools/berlin-connectivity-picker","https://www.berlinwalk.com/tools/berlin-club-picker","https://www.berlinwalk.com/tools/berlin-wall-remnants","https://www.berlinwalk.com/tools/german-phrases-quiz","https://www.berlinwalk.com/tools/berlin-beer-gardens-map","https://www.berlinwalk.com/tools/christmas-markets-map","https://www.berlinwalk.com/tools/berlin-boat-tour-finder","https://www.berlinwalk.com/tools/berlin-pfand-calculator","https://www.berlinwalk.com/tools/berlin-city-tax-calculator","https://www.berlinwalk.com/tools/berlin-tax-free-refund-calculator","https://www.berlinwalk.com/tools/berlin-taxi-uber-cost-checker","https://www.berlinwalk.com/tools/berlin-public-holiday-checker","https://www.berlinwalk.com/tools/berlin-station-arrival-planner","https://www.berlinwalk.com/tools/berlin-family-day-planner","https://www.berlinwalk.com/tools/berlin-monday-plan-checker","https://www.berlinwalk.com/tools/berlin-mobility-app-picker","https://www.berlinwalk.com/tools/berlin-night-transport-checker","https://www.berlinwalk.com/tools/berlin-ber-airport-departure-planner","https://www.berlinwalk.com/tools/berlin-flea-market-picker","https://www.berlinwalk.com/tools/charlottenburg-palace-visit-planner","https://www.berlinwalk.com/tools/traenenpalast-visit-planner","https://www.berlinwalk.com/tools/sachsenhausen-visit-planner","https://www.berlinwalk.com/tools/topography-of-terror-visit-planner","https://www.berlinwalk.com/tools/berlin-lost-item-router","https://www.berlinwalk.com/tools/berlin-medical-help-router","https://www.berlinwalk.com/tools/berlin-street-sense-drill","https://www.berlinwalk.com/tools/berlin-breakfast-clock","https://www.berlinwalk.com/tools/berlin-sign-decoder","https://www.berlinwalk.com/tools/berlin-booking-deadline-planner","https://www.berlinwalk.com/tools/berlin-museums-map"]}}
```

---

## How to regenerate this file

When a new widget gets added to `tools-hub/data.json`, run:

```bash
python3 widgets-hub/_regenerate_seo.py
```

It re-reads `tools-hub/data.json` and rewrites the ItemList section of this file. Then re-paste the Structured Data block into Wix Advanced SEO.
