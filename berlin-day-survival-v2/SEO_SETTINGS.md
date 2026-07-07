# Berlin Day Survival — Wix SEO Settings

Use these for the final public landing page. Keep any temporary test page
`noindex` until Yusuf approves publishing the final URL.

## Final Public URL

`https://www.berlinwalk.com/games/berlin-day-survival`

## SEO Title

`Berlin Day Survival Game | Free Berlin Budget Game`

## Meta Description

`Play Berlin Day Survival by BerlinWalk. Pick €10, €15 or €20, make six first-day Berlin choices, and see if your wallet and energy survive.`

## URL Slug

Recommended final slug: `/games/berlin-day-survival`

Temporary QA slug: keep as `/day-survival-test` or `/games/day-survival-test`
with `noindex` until final publish.

## Open Graph / Social

Title:

`Berlin Day Survival Game`

Description:

`Can you get through one Berlin day on €10, €15 or €20 without the city eating your wallet first?`

Image:

`https://fenerszymanski.github.io/berlinwalk-widgets/berlin-day-survival-v2/assets/social/berlin-day-survival-v2-social-1200x630.jpg`

## Canonical

`https://www.berlinwalk.com/games/berlin-day-survival`

## Robots

Final page:

`index, follow, max-image-preview:large`

Temporary test page:

`noindex, nofollow`

## Custom Element

Tag name:

`bw-day-survival-landing-v2`

Server URL:

`https://fenerszymanski.github.io/berlinwalk-widgets/berlin-day-survival-v2/day-survival-landing-v2-element.js`

The older game-only tag is still valid for a bare game embed:

`bw-day-survival-v2`

The landing element also applies a runtime SEO safety-net:

- final URL gets `index, follow`, canonical, social meta and JSON-LD
- test URLs such as `/day-survival-test` get `noindex, nofollow`

Still fill the Wix SEO panel with the values above before final publish,
because social crawlers may not execute the runtime script.

## JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Berlin Day Survival",
  "applicationCategory": "GameApplication",
  "operatingSystem": "Web",
  "url": "https://www.berlinwalk.com/games/berlin-day-survival",
  "description": "A free BerlinWalk game where visitors pick a small Berlin budget, make six first-day choices, and see whether their wallet and energy survive.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "EUR"
  },
  "publisher": {
    "@type": "Organization",
    "name": "BerlinWalk",
    "url": "https://www.berlinwalk.com"
  }
}
```
