# Daily-blog tool icon — `is-berlin-walkable` — 2026-07-18 prompt (STRICT to match family)

Same fixed 3-layer BerlinTools family as the other `daily-blog-*` icons:
1. plain cream background
2. solid deep green #1B5E20 rounded-square glossy 3D app tile filling the frame
3. one large centered bright yellow #FFE600 glossy circular medallion disc
4. ONE clear glossy soft-3D symbolic object resting on the yellow disc

Generate through the approved non-paid route (built-in image generation first,
else Yusuf's logged-in ChatGPT via Chrome/Atlas/Codex browser). Download the raw
square, crop to canonical 512 + 160 RGBA PNGs, upload the 512 to Wix Media, then
wire into `tools-hub/data.json` (image + cmsItemId + iconStatus), create the
BerlinTools CMS item for `/tools/is-berlin-walkable`, and commit/push.

Note on subject: this is a walking-distance checker for Berlin's main sights, so
the symbol must read as "explore on foot / distance between places." A friendly,
calm walking / footpath idea. No text, no letters, no numbers, no real map tiles.

## `is-berlin-walkable` (Berlin Walking Distance Checker)

```text
Create ONE square 1:1 app icon for BerlinWalk, in a strict fixed style. STRUCTURE, exactly three layers and nothing else: (1) a plain cream background; (2) a solid deep green #1B5E20 rounded-square app tile with soft glossy 3D bevel that fills the frame; (3) one large centered bright yellow #FFE600 glossy circular medallion disc on the tile. Resting on the yellow disc is ONE clear glossy soft-3D object: a single simple location map-pin with a small footprint / walking-shoe sole shape inside it, OR a pair of chunky walking footprints, reading clearly as "explore Berlin on foot." A friendly, calm walking symbol. No text, no readable letters, no numbers, no scattered elements, no second disc, no real map, no scenery. Colors: green tile #1B5E20, yellow disc #FFE600, the walking symbol in a warm cream white with soft glossy highlights and deep green #123D18 shading on the shadowed edge. Chunky simple shapes, high contrast, centered, readable at 160x160, clean. Do NOT use a white, glass, frosted, or pale tile.
```

### Remaining wiring after the raw icon is downloaded
- Crop to `tools-home/icons/is-berlin-walkable.png` (512) and
  `is-berlin-walkable-160.png` (160), clean RGBA / cream corners, no text.
- Upload the 512 to Wix Media; record the media id + URL.
- Set `tools-hub/data.json` entry `image` (Wix media URL), `cmsItemId`, and
  `iconStatus: "live-wix-media"`.
- Create the `BerlinTools` CMS item so `/tools/is-berlin-walkable` is live
  (slug, title `Berlin Walking Distance Checker`, h1, lead, seoTitle,
  seoDescription, jsonLd WebApplication, widgetUrl
  `https://fenerszymanski.github.io/berlinwalk-widgets/is-berlin-walkable/`,
  relatedBlog `/post/is-berlin-walkable`).
- `node tools-hub/validate-data.mjs`, then commit/push.
