# Wix SEO settings - Berlin History Story V2

Status: `UNPUBLISHED`. Apply only to the separate `/berlin-history-story` page after user approval of the exact build and Wix draft.

- **Visible H1 (opening cover only):** Berlin, Remade
- **Molkenmarkt prologue heading:** H2, so the cover remains the page's sole H1.
- **Page title:** Berlin, Remade: 12 Chapters in Berlin History | BerlinWalk
- **Meta description:** Read 12 chapters in Berlin history, from Molkenmarkt and medieval Cölln to Greater Berlin, the Wall and the city today.
- **Canonical:** `https://www.berlinwalk.com/berlin-history-story`
- **Social title:** Berlin, Remade: 12 Chapters in Berlin History | BerlinWalk
- **Social description:** Read 12 chapters in Berlin history, from Molkenmarkt and medieval Cölln to Greater Berlin, the Wall and the city today.
- **Social creative to upload:** `assets/social/berlin-history-story-1200x630.jpg` (exactly 1200x630; a permitted public-domain 1740-map crop recorded in `ASSET_MANIFEST.md`)
- **Robots after verified publication:** `index,follow`

## JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": "https://www.berlinwalk.com/berlin-history-story#article",
  "mainEntityOfPage": "https://www.berlinwalk.com/berlin-history-story",
  "headline": "Berlin, Remade: 12 Chapters in Berlin History",
  "description": "Read 12 chapters in Berlin history, from Molkenmarkt and medieval Cölln to Greater Berlin, the Wall and the city today.",
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
