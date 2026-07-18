# Daily-blog tool icon — `berlin-emergency-numbers` — 2026-07-18 prompt (STRICT to match family)

Same fixed 3-layer BerlinTools family as the other `daily-blog-*` icons:
1. plain cream background
2. solid deep green #1B5E20 rounded-square glossy 3D app tile filling the frame
3. one large centered bright yellow #FFE600 glossy circular medallion disc
4. ONE clear glossy soft-3D symbolic object resting on the yellow disc

Generate through the approved non-paid route (built-in image generation first,
else Yusuf's logged-in ChatGPT via Chrome/Atlas/Codex browser). Download the raw
square, crop to canonical 512 + 160 RGBA PNGs, upload the 512 to Wix Media, then
wire into `tools-hub/data.json` (image + cmsItemId + iconStatus), create the
BerlinTools CMS item for `/tools/berlin-emergency-numbers`, and commit/push.

Note on subject: this is an emergency-number finder, so the symbol must read as
"make the call for help" and stay calm and non-alarming. No numbers, no letters,
no blood, no siren-panic imagery.

## `berlin-emergency-numbers` (Berlin Emergency Number Finder)

```text
Create ONE square 1:1 app icon for BerlinWalk, in a strict fixed style. STRUCTURE, exactly three layers and nothing else: (1) a plain cream background; (2) a solid deep green #1B5E20 rounded-square app tile with soft glossy 3D bevel that fills the frame; (3) one large centered bright yellow #FFE600 glossy circular medallion disc on the tile. Resting on the yellow disc is ONE clear glossy soft-3D object: a single classic rounded telephone handset (receiver) seen at a slight three-quarter angle, tilted as if being lifted to make a call. A friendly modern "call for help" symbol. No text, no readable letters, no numbers, no siren, no cross, no scattered elements, no second disc, no scenery. Colors: green tile #1B5E20, yellow disc #FFE600, the telephone handset in a warm cream white with soft glossy highlights and deep green #123D18 shading on the shadowed edge. Chunky simple shapes, high contrast, centered, readable at 160x160, clean. Do NOT use a white, glass, frosted, or pale tile.
```

### Remaining wiring after the raw icon is downloaded
- Crop to `tools-home/icons/berlin-emergency-numbers.png` (512) and
  `berlin-emergency-numbers-160.png` (160), clean RGBA / cream corners, no text.
- Upload the 512 to Wix Media; record the media id + URL.
- Add the tool entry to `tools-hub/data.json` (block prepared in
  `tmp/berlin-emergency-numbers/tools-hub-entry.json`) with `image` (Wix media
  URL), `cmsItemId`, and `iconStatus: "live-wix-media"`.
  Fields: slug `berlin-emergency-numbers`, title `Berlin Emergency Number Finder`,
  hubCategory `Essentials` (Open Today & Essentials), type `Guide`,
  legacy category `Discovery`, relatedBlog `/post/berlin-emergency-numbers`.
- Create the `BerlinTools` CMS item so `/tools/berlin-emergency-numbers` is live
  (slug, title, h1, lead, seoTitle, seoDescription, jsonLd WebApplication,
  widgetUrl `https://fenerszymanski.github.io/berlinwalk-widgets/berlin-emergency-numbers/`,
  relatedBlog `/post/berlin-emergency-numbers`).
- `node tools-hub/validate-data.mjs`, then commit/push.
