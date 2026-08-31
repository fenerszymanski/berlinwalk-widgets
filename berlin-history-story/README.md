# Berlin History Story V1

`UNPUBLISHED` Custom Element for a dedicated BerlinWalk Wix page. It is a ten-scene history story from Molkenmarkt today to a practical present-day reading list.

It deliberately scales down the rejected 24-scene direction: six permitted historic/context images, and data-driven diagrams for the other scenes. It keeps the Wall Timeline's scroll lifecycle, stage mode switching, scroll rail, progress HUD, map fetch/fallback, reduced-motion handling and QA hash hook, but does not alter the live Wall Timeline embed.

## Local preview

From the widget repository worktree:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/berlin-history-story/`.

## Content and rights

- Public copy and source boundaries: [`CONTENT_AND_SOURCES.md`](./CONTENT_AND_SOURCES.md)
- Image, map and font ledger: [`ASSET_MANIFEST.md`](./ASSET_MANIFEST.md)
- Wix-ready search metadata: [`SEO_SETTINGS.md`](./SEO_SETTINGS.md)
- Required QA: [`QA_PLAN.md`](./QA_PLAN.md)
- Native social-preview verifier: [`../../scripts/verify-berlin-history-story-social-preview.mjs`](../../scripts/verify-berlin-history-story-social-preview.mjs)

## Scope boundary

- No video, audio, 3D, translation layer, free zoom, new archive research, metered image generation or Wall Timeline mutation.
- The closing Free Tour CTA says exactly that the tour starts at Alexanderplatz, lasts 2 hours, covers the historic centre of former East Berlin, and does not follow the Berlin Wall line.
- `assets/social/berlin-history-story-1200x630.jpg` is the exact licensed social creative to upload to the unpublished native Wix page. It is a crop of the permitted 1740 map, not a new generated visual.
- The related-post list is a bounded 42-link handoff baseline, not an assertion that the current Wix Blog has exactly 42 history posts or that an orphan audit has been completed. See `related-history-posts.js` after the current link audit is applied.
