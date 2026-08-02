# Berlin Trip Planner Page SEO

Target URL: `https://www.berlinwalk.com/berlin-trip-planner`

## Wix Page Basics

- Page title: `Berlin Trip Planner | Build Your Berlin Itinerary Before You Arrive`
- Meta description: `Build a realistic 1 to 7 day Berlin trip plan around your arrival date, weather, opening days, Google Maps links, and the best BerlinWalk tour slot.`
- URL slug: `/berlin-trip-planner`
- Social title: `Berlin Trip Planner by BerlinWalk`
- Social description: `Plan your Berlin days around arrival time, weather, opening-day traps, maps, and a local walking-tour slot.`
- Canonical: `https://www.berlinwalk.com/berlin-trip-planner`

## Custom Element Install

Add this to the page body:

```html
<bw-berlin-trip-planner-page></bw-berlin-trip-planner-page>
<script src="https://fenerszymanski.github.io/berlinwalk-widgets/berlin-trip-planner-page/berlin-trip-planner-page-element.js?v=20260802-v4-native-lp"></script>
```

## Structured Data

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": "https://www.berlinwalk.com/berlin-trip-planner#webapp",
  "name": "Berlin Trip Planner",
  "url": "https://www.berlinwalk.com/berlin-trip-planner",
  "applicationCategory": "TravelApplication",
  "operatingSystem": "Web",
  "isAccessibleForFree": false,
  "description": "A Berlin-specific trip planner that builds a 1 to 7 day itinerary around arrival date, weather, opening-day logic, map links, and the best BerlinWalk walking-tour slot.",
  "publisher": {
    "@type": "Organization",
    "name": "BerlinWalk",
    "url": "https://www.berlinwalk.com"
  },
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "7.99",
    "highPrice": "15.99",
    "priceCurrency": "EUR",
    "offerCount": 3,
    "offers": [
      { "@type": "Offer", "price": "7.99", "priceCurrency": "EUR", "name": "1–2 calendar days" },
      { "@type": "Offer", "price": "11.99", "priceCurrency": "EUR", "name": "3–4 calendar days" },
      { "@type": "Offer", "price": "15.99", "priceCurrency": "EUR", "name": "5–7 calendar days" }
    ]
  }
}
```

## Notes

- This page is meant to replace the generic tools-grid placement for the Ultimate Planner.
- Ultimate email `${planUrl}` points to `/berlin-trip-planner` and keeps saved query params, including `planAccess=1`, so returning users open the full plan without rebuilding it.
- The native page forwards only the selected A/B variant and, for Variant B, optional ISO dates in a URL fragment to the direct V4 planner. Dates never enter query strings or referrers.
- The native page contains the light-DOM H1 and WebApplication schema; the V4 planner opens top-level rather than inside an iframe so its first-party intake, checkout and status storage boundaries remain intact.

## Local schema cleanup / rollback readback

The current custom element performs an idempotent, bounded cleanup on the page head. It removes only the planner's old `WebApplication`/`Product` markers (including the legacy `#full-plan` identity), preserves any canonical `WebPage` graph entry, and maintains one `bw-trip-planner-webapp-jsonld` script with the current three-band `AggregateOffer` (EUR 7.99 / 11.99 / 15.99). A `MutationObserver` plus a 12-second bounded recheck window covers Wix's repeated head-application behavior; it is disconnected when the element is removed.

This is a local package only. Before a Wix cutover, save the existing custom-code/body revision and raw-head readback. Rollback is the Wix revision restore of that saved body/head revision, followed by a fresh canonical/head/schema readback. No Wix revision or live head was changed in this task.
