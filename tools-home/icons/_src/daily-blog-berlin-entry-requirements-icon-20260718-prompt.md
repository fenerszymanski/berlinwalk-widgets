# Daily-blog tool icon — `berlin-entry-requirements` — 2026-07-18 prompt (STRICT to match family)

Same fixed 3-layer BerlinTools family as the other `daily-blog-*` icons:
1. plain cream background
2. solid deep green #1B5E20 rounded-square glossy 3D app tile filling the frame
3. one large centered bright yellow #FFE600 glossy circular medallion disc
4. ONE clear glossy soft-3D symbolic object resting on the yellow disc

Generate through the approved non-paid route (built-in image generation first,
else Yusuf's logged-in ChatGPT via Chrome/Atlas/Codex browser). Download the raw
square, crop to canonical 512 + 160 RGBA PNGs, upload the 512 to Wix Media, then
wire into `tools-hub/data.json` (image + cmsItemId + iconStatus), create the
BerlinTools CMS item for `/tools/berlin-entry-requirements`, and commit/push.

## `berlin-entry-requirements` (Berlin Entry Checker + Schengen 90/180 Day Counter)

```text
Create ONE square 1:1 app icon for BerlinWalk, in a strict fixed style. STRUCTURE, exactly three layers and nothing else: (1) a plain cream background; (2) a solid deep green #1B5E20 rounded-square app tile with soft glossy 3D bevel that fills the frame; (3) one large centered bright yellow #FFE600 glossy circular medallion disc on the tile. Resting on the yellow disc is ONE clear glossy soft-3D object: a single closed passport booklet seen from a three-quarter angle, standing slightly open at a gentle angle, with a small simple emblem centered on the cover. A clean modern travel passport. No text, no readable letters, no numbers, no country names, no flags, no stamps, no scattered elements, no second disc, no scenery. Colors: green tile #1B5E20, yellow disc #FFE600, passport cover in a warm cream/burgundy with soft glossy highlights, deep green #123D18 shading on the shadowed edge, one small lime #7CB342 accent. Chunky simple shapes, high contrast, centered, readable at 160x160, clean. Do NOT use a white, glass, frosted, or pale tile.
```

### Remaining wiring after the raw icon is downloaded
- Crop to `tools-home/icons/berlin-entry-requirements.png` (512) and
  `berlin-entry-requirements-160.png` (160), clean RGBA / cream corners, no text.
- Upload the 512 to Wix Media; record the media id + URL.
- Add the tool entry to `tools-hub/data.json` (block prepared in
  `tmp/do-you-need-a-visa-to-visit-berlin/tools-hub-entry.json`) with `image`
  (Wix media URL), `cmsItemId`, and `iconStatus: "live-wix-media"`.
  Fields: slug `berlin-entry-requirements`, title `Berlin Entry Checker`,
  hubCategory `FirstDay` (Trip Plans & First Day), type `Checker`,
  legacy category `Maps`, relatedBlog `/post/do-you-need-a-visa-to-visit-berlin`.
- Create the `BerlinTools` CMS item so `/tools/berlin-entry-requirements` is live
  (slug, title, h1, lead, seoTitle, seoDescription, jsonLd WebApplication,
  widgetUrl `https://fenerszymanski.github.io/berlinwalk-widgets/berlin-entry-requirements/`,
  relatedBlog `/post/do-you-need-a-visa-to-visit-berlin`). Helper:
  `scripts/wire-berlin-entry-requirements-tool-20260718.mjs` (prepared).
- `node tools-hub/validate-data.mjs`, then commit/push.
- This does NOT publish the blog post; the post stays UNPUBLISHED until Yusuf
  approves it.
```
