# Daily-blog tool icon — 2026-08-22 (09:02 slot) — `berlin-station-exit-map`

Same fixed 3-layer BerlinTools family as `daily-blog-icons-20260716-prompts.md`.
Route: Yusuf's logged-in ChatGPT via Chrome (non-paid). No paid image API.

## `berlin-station-exit-map` (Berlin Station Exit Map)

```text
Create ONE square 1:1 app icon for BerlinWalk, in a strict fixed style. STRUCTURE, exactly three layers and nothing else: (1) a plain cream background; (2) a solid deep green #1B5E20 rounded-square app tile with soft glossy 3D bevel that fills the frame; (3) one large centered bright yellow #FFE600 glossy circular medallion disc on the tile. Resting on the yellow disc is ONE clear glossy soft-3D object: a simple directional wayfinding sign, a small rounded rectangular sign plaque held on a short post, with one bold arrow on the plaque pointing up and to the right, the universal symbol for "this way out". No station, no stairs, no scenery, no scattered elements, no people, no second disc, no second sign. Colors: green tile #1B5E20, yellow disc #FFE600, sign plaque in deep green/dark with a cream/white arrow and soft highlights, one small lime #7CB342 accent on the post. No text, no letters, no numbers, no logos. Do NOT use a white, glass, frosted, or pale tile. Chunky simple shapes, high contrast, centered, readable at 160x160, clean.
```

### Wiring after the raw icon is downloaded
- Crop to `tools-home/icons/berlin-station-exit-map.png` (512) and
  `berlin-station-exit-map-160.png` (160), clean RGBA / cream corners, no text.
- Upload the 512 to Wix Media; record the media URL.
- `tools-hub/data.json`: `image` (Wix media URL), `cmsItemId`, `iconStatus: "live-wix-media"`.
- Create the `BerlinTools` CMS item so `/tools/berlin-station-exit-map` is live
  (slug, title, h1, lead, seoTitle, seoDescription, jsonLd WebApplication,
  widgetUrl, relatedBlog `/post/berlin-station-exits`).
