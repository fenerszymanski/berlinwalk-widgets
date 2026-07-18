# Daily-blog tool icon — `berlin-airports` — 2026-07-17 prompt (STRICT to match family)

Same fixed 3-layer BerlinTools family as the other `daily-blog-*` icons:
1. plain cream background
2. solid deep green #1B5E20 rounded-square glossy 3D app tile filling the frame
3. one large centered bright yellow #FFE600 glossy circular medallion disc
4. ONE clear glossy soft-3D symbolic object resting on the yellow disc

Generate through the approved non-paid route, with built-in image generation
first. Save the raw square, crop to canonical 512 + 160 PNGs, upload the 512 to Wix Media, then wire into
`tools-hub/data.json` (image + cmsItemId + iconStatus), create the BerlinTools
CMS item for `/tools/berlin-airports`, and commit/push.

Status 2026-07-18: the raw source and local 512/160 PNGs now exist. Wix Media
upload, `tools-hub/data.json` wiring, BerlinTools CMS creation and live tool-page
verification still remain; this note does not authorize those external writes.

## `berlin-airports` (Berlin Airports: what's open + how to reach the city)

```text
Create ONE square 1:1 app icon for BerlinWalk, in a strict fixed style. STRUCTURE, exactly three layers and nothing else: (1) a plain cream background; (2) a solid deep green #1B5E20 rounded-square app tile with soft glossy 3D bevel that fills the frame; (3) one large centered bright yellow #FFE600 glossy circular medallion disc on the tile. Resting on the yellow disc is ONE clear glossy soft-3D object: a single simple passenger airplane seen from a three-quarter top angle, nose pointing up and slightly right, wings spread, a clean modern jet. No runway, no clouds, no scenery, no airport building, no people, no scattered elements, no second disc. Colors: green tile #1B5E20, yellow disc #FFE600, airplane body in cream/white with soft glossy highlights, deep green #123D18 shading on the underside and tail, one small lime #7CB342 accent stripe. No text, no letters, no numbers, no logos. Do NOT use a white, glass, frosted, or pale tile. Chunky simple shapes, high contrast, centered, readable at 160x160, clean.
```

### Remaining wiring after the raw icon is downloaded
- Crop to `tools-home/icons/berlin-airports.png` (512) and
  `berlin-airports-160.png` (160), clean RGBA / cream corners, no text.
- Upload the 512 to Wix Media; record the media id + URL.
- Add the tool entry to `tools-hub/data.json` (block prepared in
  `CODEX_HANDOFF_berlin-airports-tool-icon-20260717.md`) with `image`
  (Wix media URL), `cmsItemId`, and `iconStatus: "live-wix-media"`.
  Suggested fields: slug `berlin-airports`, title `Berlin Airports Explainer`,
  hubCategory `Transport`, type `Map`, legacy category `Maps`,
  relatedBlog `/post/berlin-airports`.
- Create the `BerlinTools` CMS item so `/tools/berlin-airports` is live
  (slug, title, h1, lead, seoTitle, seoDescription, jsonLd WebApplication,
  widgetUrl `https://fenerszymanski.github.io/berlinwalk-widgets/berlin-airports/`,
  relatedBlog `/post/berlin-airports`).
- `node tools-hub/validate-data.mjs`, then commit/push.
- This does NOT publish the blog post; the post stays UNPUBLISHED until Yusuf
  approves it.
