# SEO Settings for `/games`

## Page

- URL: `https://www.berlinwalk.com/games`
- Title: `BerlinWalk Games: Play Berlin Battle, Berghain Bouncer & Smile Challenge`
- Meta description: `Play quick Berlin games by BerlinWalk: choose your Berlin winner, try the Berghain door, or make a Berliner almost smile before joining the walking tour.`
- Canonical: `https://www.berlinwalk.com/games`

## Suggested Social Share

- OG title: `BerlinWalk Games`
- OG description: `Three quick Berlin games: Berlin Battle, Berghain Bouncer and Berlin Smile Challenge.`
- OG image: use a future native Wix social image or a 1200x630 collage based on the three existing game covers.

## Structured Data Draft

Use native Wix SEO fields first. If a guarded custom embed is needed later, keep it URL-guarded to `/games`.

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "BerlinWalk Games",
  "url": "https://www.berlinwalk.com/games",
  "description": "Quick playable Berlin games by BerlinWalk.",
  "isPartOf": {
    "@type": "WebSite",
    "name": "BerlinWalk",
    "url": "https://www.berlinwalk.com"
  },
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "url": "https://www.berlinwalk.com/games/berlin-battle",
        "name": "Berlin Battle"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "url": "https://www.berlinwalk.com/games/berghain-bouncer",
        "name": "Berghain Bouncer"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "url": "https://www.berlinwalk.com/games/berlin-smile-challenge",
        "name": "Berlin Smile Challenge"
      }
    ]
  }
}
```
