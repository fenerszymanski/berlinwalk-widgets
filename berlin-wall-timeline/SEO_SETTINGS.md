# Berlin Wall Timeline — Wix SEO settings

Final page: `https://www.berlinwalk.com/berlin-wall-timeline`

The `<bw-wall-timeline>` element already applies these as a runtime safety net
when it detects the `/berlin-wall-timeline` path, but set them natively in the
Wix page SEO panel so they are present in the server-rendered HTML for crawlers.

## Page settings

- **Slug:** `berlin-wall-timeline`
- **Hide global header + footer** on this page (immersive full-bleed, same as
  the paid landing page). Provide navigation through the in-experience
  BerlinWalk wordmark (top right) and the closing tour CTA.

## SEO / meta

- **Title tag:** `The Berlin Wall Timeline | Scroll Through 1945 to 1990`
- **Meta description:** `An interactive Berlin Wall timeline from BerlinWalk. Scroll to watch Berlin split in 1945, the Wall rise in 1961, the death strip, the escapes, and the fall in 1989, then see what is left in the city today.`
- **Canonical:** `https://www.berlinwalk.com/berlin-wall-timeline`
- **Robots:** `index, follow, max-image-preview:large`

## Social (Open Graph / Twitter)

- **og:type:** `article`
- **og:title:** `The Berlin Wall, 1945 to 1990`
- **og:description:** `Scroll through the whole story of the Berlin Wall: the split, the death strip, the escapes, the fall, and what is left to walk today.`
- **og:image:** `https://fenerszymanski.github.io/berlinwalk-widgets/berlin-wall-timeline/assets/social/berlin-wall-timeline-1200x630.jpg`
- **twitter:card:** `summary_large_image`

## JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "The Berlin Wall Timeline, 1945 to 1990",
  "description": "An interactive Berlin Wall timeline from BerlinWalk. Scroll to watch Berlin split in 1945, the Wall rise in 1961, the death strip, the escapes, and the fall in 1989, then see what is left in the city today.",
  "image": "https://fenerszymanski.github.io/berlinwalk-widgets/berlin-wall-timeline/assets/social/berlin-wall-timeline-1200x630.jpg",
  "url": "https://www.berlinwalk.com/berlin-wall-timeline",
  "author": { "@type": "Organization", "name": "BerlinWalk", "url": "https://www.berlinwalk.com" },
  "publisher": { "@type": "Organization", "name": "BerlinWalk", "url": "https://www.berlinwalk.com" },
  "about": "Berlin Wall"
}
```
