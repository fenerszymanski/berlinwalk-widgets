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
<script src="https://fenerszymanski.github.io/berlinwalk-widgets/berlin-trip-planner-page/berlin-trip-planner-page-element.js"></script>
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
  "isAccessibleForFree": true,
  "description": "A Berlin-specific trip planner that builds a 1 to 7 day itinerary around arrival date, weather, opening-day logic, map links, and the best BerlinWalk walking-tour slot.",
  "publisher": {
    "@type": "Organization",
    "name": "BerlinWalk",
    "url": "https://www.berlinwalk.com"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "EUR"
  }
}
```

## Notes

- This page is meant to replace the generic tools-grid placement for the Ultimate Planner.
- Future email `${planUrl}` should point to `/berlin-trip-planner` once the page is live.
- The page component forwards saved query params, including `planAccess=1`, into the embedded planner iframe.
