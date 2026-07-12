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
- **Meta description:** `An interactive Berlin Wall timeline from BerlinWalk. Scroll through the city split, the Wall, the death strip, escapes and the fall in 1989, then see what remains today.`
- **Canonical:** `https://www.berlinwalk.com/berlin-wall-timeline`
- **Robots:** `index, follow, max-image-preview:large`

## Social (Open Graph / Twitter)

- **og:type:** `article`
- **og:title:** `The Berlin Wall Timeline | Scroll Through 1945 to 1990`
- **og:description:** `An interactive Berlin Wall timeline from BerlinWalk. Scroll through the city split, the Wall, the death strip, escapes and the fall in 1989, then see what remains today.`
- **og:image:** `https://fenerszymanski.github.io/berlinwalk-widgets/berlin-wall-timeline/assets/social/berlin-wall-timeline-1200x630.jpg`
- **Wix native Social Share image URL:** `https://static.wixstatic.com/media/5a08a3_e38552ecc99a42799e113d3aa0761bde~mv2.png/v1/fill/w_1731,h_909,al_c/5a08a3_e38552ecc99a42799e113d3aa0761bde~mv2.png`
- **twitter:card:** `summary_large_image`
- **og:image:width:** `1200`
- **og:image:height:** `630`
- **og:image:alt:** `The Berlin Wall timeline cover, a divided Berlin map with the Wall line`
- **twitter:image:alt:** `The Berlin Wall timeline cover, a divided Berlin map with the Wall line`

## JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "The Berlin Wall Timeline | Scroll Through 1945 to 1990",
  "description": "An interactive Berlin Wall timeline from BerlinWalk. Scroll through the city split, the Wall, the death strip, escapes and the fall in 1989, then see what remains today.",
  "image": "https://fenerszymanski.github.io/berlinwalk-widgets/berlin-wall-timeline/assets/social/berlin-wall-timeline-1200x630.jpg",
  "url": "https://www.berlinwalk.com/berlin-wall-timeline",
  "author": { "@type": "Person", "name": "Yusuf Ucuz", "url": "https://www.berlinwalk.com" },
  "publisher": { "@type": "Organization", "name": "BerlinWalk", "url": "https://www.berlinwalk.com" },
  "about": "Berlin Wall",
  "inLanguage": "en"
}
```
