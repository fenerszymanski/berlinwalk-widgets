# Berlin History Story V2

`UNPUBLISHED` Custom Element for a dedicated BerlinWalk Wix page. It is a 12-chapter history story from Molkenmarkt today to a practical present-day reading list: an unnumbered opening cover, an explicit prologue, ten chronological history chapters, and an explicit epilogue. The cover owns the sole H1, `Berlin, Remade`; the Molkenmarkt prologue begins the scrolly with an H2.

It deliberately scales down the rejected 24-chapter direction: nine permitted historic/context images plus one lightweight hero archive derivative, and data-driven diagrams for the other chapters. The cover and prologue's faint archive layer is a real, optimized derivative of the licensed 1652-based plan and is context only; the full plan remains attached to the War, refuge, rebuilding chapter. It is a data-swap port of the hardened Wall Timeline runtime, retaining its scroll lifecycle, stage mode switching, scroll rail, progress HUD, map fetch/fallback, reduced-motion handling and QA hash hook while never altering the live Wall Timeline embed. The exact source snapshot and deliberate swaps are recorded in [`PORT_DERIVATION.md`](./PORT_DERIVATION.md).

## Local preview

From the widget repository worktree:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/berlin-history-story/`.

## Content and rights

- Public copy and source boundaries: [`CONTENT_AND_SOURCES.md`](./CONTENT_AND_SOURCES.md)
- Image, map and font ledger: [`ASSET_MANIFEST.md`](./ASSET_MANIFEST.md)
- Full map-source ledger: [`assets/map/SOURCES.md`](./assets/map/SOURCES.md)
- Runtime-port derivation: [`PORT_DERIVATION.md`](./PORT_DERIVATION.md)
- Wix-ready search metadata: [`SEO_SETTINGS.md`](./SEO_SETTINGS.md)
- Required QA: [`QA_PLAN.md`](./QA_PLAN.md)
- Measurement contract: [`MEASUREMENT.md`](./MEASUREMENT.md)
- Source-controlled Wix embed updater: [`../scripts/upsert-berlin-history-story-page-wix-embed.mjs`](../scripts/upsert-berlin-history-story-page-wix-embed.mjs) (requires a full 40-character public commit SHA; may update only the dedicated History Story embed)
- Native social-preview verifier: [`../scripts/verify-berlin-history-story-social-preview.mjs`](../scripts/verify-berlin-history-story-social-preview.mjs)

## Scope boundary

- No video, audio, 3D, translation layer, free zoom, new archive research, metered image generation or Wall Timeline mutation.
- The closing Free Tour CTA says exactly that the tour starts at Alexanderplatz, lasts 2 hours, covers the historic centre of former East Berlin, and does not follow the Berlin Wall line.
- The unnumbered opening cover is outside `CHAPTERS`, owns the only H1 and provides the native `Scroll to begin` anchor to the scrolly start.
- The final chapter is titled `Four places to read Berlin today` and presents four separate starting points, not one walking route.
- The first record is the explicit `prologue`; records 2-11 are chronological `history` chapters; the final record is the explicit `epilogue`. The HUD, status text, progress pill and rail labels expose those roles without developer-facing numeric scene labels.
- The 1307-1448 chapter describes an outward-facing union and shared council with separate administrations, then the 1432 tightening, 1442 dissolution and 1448 failed Berliner Unwille. The 1618-1688 chapter avoids a precise 1648 population and does not credit Huguenots alone with rebuilding Berlin.
- `assets/social/berlin-history-story-1200x630.jpg` is the exact licensed social creative to upload to the unpublished native Wix page. It is a crop of the permitted 1740 map, not a new generated visual.
- `assets/photos/berlin-coelln-plan-1652-hero.jpg` is a 720px, optimized hero derivative of the licensed 1652-based plan. Its credit remains `Johann Gregor Memhardt, later print around 1720 based on the 1652 plan · public domain`; it must never be presented as a 1307 or 1618 view.
- The local related-reading layer now renders the user-approved 16 current zero-inbound history posts, verified again at `2026-09-01T13:29:26.734Z`. Re-run [`../scripts/check-history-story-related-links.mjs`](../scripts/check-history-story-related-links.mjs) before any later distribution change. The package remains `UNPUBLISHED`: native Wix draft, SEO/social-media records, embed pinning and publication each have separate approval gates. See [`RELATED_LINK_STATUS.md`](./RELATED_LINK_STATUS.md).
