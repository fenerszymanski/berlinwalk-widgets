# Wix SEO settings - Berlin History Story V1

Status: `UNPUBLISHED`. Apply only to the separate `/berlin-history-story` page after user approval of the exact build and Wix draft.

- **Page title:** Berlin History Story: 800 Years in 10 Scenes | BerlinWalk
- **Meta description:** Scroll through 800 years of Berlin history, from Molkenmarkt and medieval Cölln to Greater Berlin, the Wall and the city today.
- **Canonical:** `https://www.berlinwalk.com/berlin-history-story`
- **Social title:** Berlin History Story: 800 Years in 10 Scenes
- **Social description:** A careful ten-scene journey through Berlin's history, with source notes, licensed visual credits and a practical reading list for the city today.
- **Social creative to upload:** `assets/social/berlin-history-story-1200x630.jpg` (exactly 1200x630; a permitted public-domain 1740-map crop recorded in `ASSET_MANIFEST.md`)
- **Robots after verified publication:** `index,follow`

## JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": "https://www.berlinwalk.com/berlin-history-story#article",
  "mainEntityOfPage": "https://www.berlinwalk.com/berlin-history-story",
  "headline": "Berlin History Story: 800 Years in 10 Scenes",
  "description": "A source-led, ten-scene story of Berlin from medieval trading towns to the present city.",
  "inLanguage": "en",
  "author": {
    "@type": "Person",
    "name": "Yusuf",
    "url": "https://www.berlinwalk.com/the-guide"
  },
  "publisher": {
    "@type": "Organization",
    "name": "BerlinWalk",
    "url": "https://www.berlinwalk.com"
  }
}
```

Do not add a publication date, image URL or `dateModified` until the final Wix page and social image are verified. Once Wix gives the uploaded image its final URL, pass that exact URL as `BW_BERLIN_HISTORY_STORY_SOCIAL_IMAGE` to `scripts/verify-berlin-history-story-social-preview.mjs`; runtime-injected tags are not a substitute for Wix's native server-rendered metadata.
