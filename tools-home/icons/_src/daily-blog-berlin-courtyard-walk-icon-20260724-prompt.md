# Daily-blog tool icon — 2026-07-24 `berlin-courtyard-walk` (STRICT to match family)

Same fixed 3-layer BerlinTools family:
1. plain cream background
2. solid deep green #1B5E20 rounded-square glossy 3D app tile filling the frame
3. one large centered bright yellow #FFE600 glossy circular medallion disc
4. ONE clear glossy soft-3D symbolic object resting on the yellow disc

Generate in Yusuf's logged-in ChatGPT (non-paid). Download the raw square, crop
to canonical 512 + 160 RGBA PNGs, upload the 512 to Wix Media, then wire into
`tools-hub/data.json` (image + cmsItemId + iconStatus), create the BerlinTools
CMS item for `/tools/berlin-courtyard-walk`, and commit/push.

## `berlin-courtyard-walk` (The Höfe Walk)

```text
Create ONE square 1:1 app icon for BerlinWalk, in a strict fixed style. STRUCTURE, exactly three layers and nothing else: (1) a plain cream background; (2) a solid deep green #1B5E20 rounded-square app tile with soft glossy 3D bevel that fills the frame; (3) one large centered bright yellow #FFE600 glossy circular medallion disc on the tile. Resting on the yellow disc is ONE clear glossy soft-3D object: a single rounded archway, a chunky freestanding stone gateway with a semicircular arch opening, the kind you walk through into a hidden Berlin courtyard, the opening showing a small hint of green depth behind it. No buildings around it, no street, no scenery, no people, no second arch, no second disc, no text. Colors: green tile #1B5E20, yellow disc #FFE600, archway in warm cream and tan stone with soft glossy highlights, the opening in deep green shadow, one small lime #7CB342 accent of ivy on the arch. No text, no letters, no numbers, no logos. Do NOT use a white, glass, frosted, or pale tile. Chunky simple shapes, high contrast, centered, clearly readable at 160x160, clean.
```

### Remaining wiring after the raw icon is downloaded
- Crop to `tools-home/icons/berlin-courtyard-walk.png` (512) and
  `berlin-courtyard-walk-160.png` (160), clean RGBA / cream corners, no text.
- Upload the 512 to Wix Media; record the media id + URL.
- Add the tool entry to `tools-hub/data.json` with `image` (Wix media URL),
  `cmsItemId`, and `iconStatus: "live-wix-media"`.
- Create the `BerlinTools` CMS item so `/tools/berlin-courtyard-walk` is live
  (slug, title, h1, lead, seoTitle, seoDescription, jsonLd WebApplication,
  widgetUrl, relatedBlog).
- `node tools-hub/validate-data.mjs`, then commit/push.
- This does NOT publish the blog post; the post stays UNPUBLISHED until Yusuf
  approves it.
