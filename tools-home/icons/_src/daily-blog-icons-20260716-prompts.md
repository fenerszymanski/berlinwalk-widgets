# Daily-blog tool icon — 2026-07-16 prompt (STRICT to match family)

Same fixed 3-layer BerlinTools family as `daily-blog-icons-20260715-prompts.md`:
1. plain cream background
2. solid deep green #1B5E20 rounded-square glossy 3D app tile filling the frame
3. one large centered bright yellow #FFE600 glossy circular medallion disc
4. ONE clear glossy soft-3D symbolic object resting on the yellow disc

Generate in Yusuf's logged-in ChatGPT (non-paid). Download the raw square, crop
to canonical 512 + 160 RGBA PNGs, upload the 512 to Wix Media, then wire into
`tools-hub/data.json` (image + cmsItemId + iconStatus), create the BerlinTools
CMS item for `/tools/stasi-surveillance-scale`, and commit/push.

## `stasi-surveillance-scale` (The Stasi, by the numbers)

```text
Create ONE square 1:1 app icon for BerlinWalk, in a strict fixed style. STRUCTURE, exactly three layers and nothing else: (1) a plain cream background; (2) a solid deep green #1B5E20 rounded-square app tile with soft glossy 3D bevel that fills the frame; (3) one large centered bright yellow #FFE600 glossy circular medallion disc on the tile. Resting on the yellow disc is ONE clear glossy soft-3D object: a simple old-fashioned surveillance camera (a small box CCTV camera on a short mounting arm), a universal symbol of being watched. No building, no scenery, no scattered elements, no people, no second disc. Colors: green tile #1B5E20, yellow disc #FFE600, camera body in deep green/dark with cream/white highlights and a small lime #7CB342 accent on the lens. No text, no letters, no numbers, no logos. Do NOT use a white, glass, frosted, or pale tile. Chunky simple shapes, high contrast, centered, readable at 160x160, clean.
```

### Remaining wiring after the raw icon is downloaded
- Crop to `tools-home/icons/stasi-surveillance-scale.png` (512) and
  `stasi-surveillance-scale-160.png` (160), clean RGBA / cream corners, no text.
- Upload the 512 to Wix Media; record the media id.
- Add the tool entry to `tools-hub/data.json` (see the block prepared in the
  handoff note) with `image` (Wix media URL), `cmsItemId`, and
  `iconStatus: "live-wix-media"`.
- Create the `BerlinTools` CMS item so `/tools/stasi-surveillance-scale` is live
  (slug, title, h1, lead, seoTitle, seoDescription, jsonLd WebApplication,
  widgetUrl, relatedBlog `/post/stasi-museum-berlin`).
- `node tools-hub/validate-data.mjs`, then commit/push.
- This does NOT publish the blog post; the post stays UNPUBLISHED until Yusuf
  approves it.
```

## `berlin-doner-order-builder` (Berlin Döner Order Builder)

```text
Create ONE square 1:1 app icon for BerlinWalk, in a strict fixed style. STRUCTURE, exactly three layers and nothing else: (1) a plain cream background; (2) a solid deep green #1B5E20 rounded-square app tile with soft glossy 3D bevel that fills the frame; (3) one large centered bright yellow #FFE600 glossy circular medallion disc on the tile. Resting on the yellow disc is ONE clear glossy soft-3D object: a single döner kebab, a folded flatbread sandwich with a little grilled meat and a hint of green salad showing at the open top. No counter, no scenery, no scattered ingredients, no people, no second disc, no packaging paper. Colors: green tile #1B5E20, yellow disc #FFE600, bread in warm cream/tan with soft highlights, meat in warm brown, one small lime #7CB342 accent for the salad. No text, no letters, no numbers, no logos. Do NOT use a white, glass, frosted, or pale tile. Chunky simple shapes, high contrast, centered, readable at 160x160, clean.
```

### Remaining wiring after the raw icon is downloaded
- Crop to `tools-home/icons/berlin-doner-order-builder.png` (512) and
  `berlin-doner-order-builder-160.png` (160), clean RGBA / cream corners, no text.
- Upload the 512 to Wix Media; record the media id + URL.
- Add the tool entry to `tools-hub/data.json` (see the block in
  `CODEX_HANDOFF_doner-tool-icon-20260716.md`) with `image` (Wix media URL),
  `cmsItemId`, and `iconStatus: "live-wix-media"`.
- Create the `BerlinTools` CMS item so `/tools/berlin-doner-order-builder` is live
  (slug, title, h1, lead, seoTitle, seoDescription, jsonLd WebApplication,
  widgetUrl, relatedBlog `/post/how-to-order-doner-in-berlin`).
- `node tools-hub/validate-data.mjs`, then commit/push.
- This does NOT publish the blog post; the post stays UNPUBLISHED until Yusuf
  approves it.
```

## `treptower-memorial-walk` (Walk the Soviet War Memorial)

```text
Create ONE square 1:1 app icon for BerlinWalk, in a strict fixed style. STRUCTURE, exactly three layers and nothing else: (1) a plain cream background; (2) a solid deep green #1B5E20 rounded-square app tile with soft glossy 3D bevel that fills the frame; (3) one large centered bright yellow #FFE600 glossy circular medallion disc on the tile. Resting on the yellow disc is ONE clear glossy soft-3D object: a single simplified standing memorial soldier statue on a small round plinth, a heroic figure in a long coat with the sword lowered point-down at his side, rendered like a smooth bronze/verdigris monument. No child, no swastika, no weapons detail, no scenery, no trees, no park, no people around it, no second disc, no text. Colors: green tile #1B5E20, yellow disc #FFE600, statue in warm bronze with soft green-patina highlights and a stone-grey plinth, one small lime #7CB342 accent allowed. No text, no letters, no numbers, no logos. Do NOT use a white, glass, frosted, or pale tile. Chunky simple dignified shapes, high contrast, centered, clearly readable at 160x160, clean.
```

### Remaining wiring after the raw icon is downloaded
- Crop to `tools-home/icons/treptower-memorial-walk.png` (512) and
  `treptower-memorial-walk-160.png` (160), clean RGBA / cream corners, no text.
- Upload the 512 to Wix Media; record the media id + URL.
- Add the tool entry to `tools-hub/data.json` (see the block in
  `CODEX_HANDOFF_treptower-tool-icon-20260716.md`) with `image` (Wix media URL),
  `cmsItemId`, and `iconStatus: "live-wix-media"`.
- Create the `BerlinTools` CMS item so `/tools/treptower-memorial-walk` is live
  (slug, title, h1, lead, seoTitle, seoDescription, jsonLd WebApplication,
  widgetUrl, relatedBlog `/post/treptower-park-berlin`).
- `node tools-hub/validate-data.mjs`, then commit/push.
- This does NOT publish the blog post; the post stays UNPUBLISHED until Yusuf
  approves it.
```
