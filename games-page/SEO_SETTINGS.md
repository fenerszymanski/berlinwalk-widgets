# SEO Settings for `/games`

## Page

- URL: `https://www.berlinwalk.com/games`
- Title: `BerlinWalk Games: Play Quick Berlin Games`
- Meta description: `Play quick Berlin games by BerlinWalk: choose your Berlin winner, survive one Berlin day, guess old archive photos, read today's Berlin pulse, try the Berghain door, or make a Berliner almost smile.`
- Canonical: `https://www.berlinwalk.com/games`

## Suggested Social Share

- OG title: `BerlinWalk Games`
- OG description: `Quick Berlin games: Berlin Battle, Berlin Day Survival, Berlin Rewind, Berlin Pulse, Berghain Bouncer and Berlin Smile Challenge.`
- OG image: `https://static.wixstatic.com/media/5a08a3_e2e905ff6b1846609bbcc8a06b2de6dc~mv2.jpg`
- Local source image: `games-page/assets/social/berlinwalk-games-social-1200x630.jpg`

## Wix Custom Embeds

- Games page hub embed: `BerlinWalk Games Page Hub`
- Embed ID: `34cdf9b0-5eac-4d47-b5fe-a431e47bdab5`
- Current revision after Day/Rewind restore hotfix: `19`
- Nav/footer patch embed: `BerlinWalk Games Nav Footer Patch`
- Embed ID: `a41c00c9-4f72-44a7-a366-69fdeb2349f8`
- Current revision after Day/Rewind restore: `14`
- Publish API returned `200` after both embed updates.

Note: The live Wix `/games` page loads the repo custom element and also has a
path-guarded head embed safety layer. Revision `19` removes only stale Berlin
Split / Lost Archive content if an old cached game script reappears. It must not
remove Day Survival, Rewind, or Pulse.

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
        "url": "https://www.berlinwalk.com/games/berlin-day-survival",
        "name": "Berlin Day Survival"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "url": "https://www.berlinwalk.com/games/berlin-rewind",
        "name": "Berlin Rewind"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "url": "https://www.berlinwalk.com/games/berlin-pulse",
        "name": "Berlin Pulse"
      },
      {
        "@type": "ListItem",
        "position": 5,
        "url": "https://www.berlinwalk.com/games/berghain-bouncer",
        "name": "Berghain Bouncer"
      },
      {
        "@type": "ListItem",
        "position": 6,
        "url": "https://www.berlinwalk.com/games/berlin-smile-challenge",
        "name": "Berlin Smile Challenge"
      }
    ]
  }
}
```
