# Daily-blog tool icon — `kurfurstendamm-walk` — 2026-07-19 prompt (STRICT to match family)

Same fixed 3-layer BerlinTools family as the other `daily-blog-*` icons:
1. plain cream background
2. solid deep green #1B5E20 rounded-square glossy 3D app tile filling the frame
3. one large centered bright yellow #FFE600 glossy circular medallion disc
4. ONE clear glossy soft-3D symbolic object resting on the yellow disc

Generate through the approved non-paid route (built-in image generation first,
else Yusuf's logged-in ChatGPT via Chrome/Atlas/Codex browser). Download the raw
square, crop to canonical 512 + 160 RGBA PNGs, upload the 512 to Wix Media, then
wire into `tools-hub/data.json` (image + cmsItemId + iconStatus), create the
BerlinTools CMS item for `/tools/kurfurstendamm-walk`, and commit/push.

Subject: this tool walks the Kurfürstendamm axis stop by stop and tells you how
far west is worth it. The symbol is the broken tower of the Kaiser Wilhelm
Memorial Church, the landmark that marks the start of the street. No text, no
numbers, no people.

## `kurfurstendamm-walk` (Ku'damm Axis Walk)

```text
Create ONE square 1:1 app icon for BerlinWalk, in a strict fixed style. STRUCTURE, exactly three layers and nothing else: (1) a plain cream background; (2) a solid deep green #1B5E20 rounded-square app tile with soft glossy 3D bevel that fills the frame; (3) one large centered bright yellow #FFE600 glossy circular medallion disc on the tile. Resting on the yellow disc is ONE clear glossy soft-3D object: a single simple church bell tower with a flat broken-off top instead of a spire, seen straight on, chunky and symmetrical, with one round clock face shape near the top and two tall narrow arched window shapes below it. A calm, dignified landmark symbol. No text, no readable letters, no numbers, no clock hands, no people, no rubble, no scattered elements, no second disc, no scenery, no street. Colors: green tile #1B5E20, yellow disc #FFE600, the tower in a warm cream white with soft glossy highlights and deep green #123D18 shading on the shadowed edges. Chunky simple shapes, high contrast, centered, readable at 160x160, clean. Do NOT use a white, glass, frosted, or pale tile.
```

### Remaining wiring after the raw icon is downloaded
- Crop to `tools-home/icons/kurfurstendamm-walk.png` (512) and
  `kurfurstendamm-walk-160.png` (160), clean RGBA / cream corners, no text.
- Upload the 512 to Wix Media; record the media id + URL.
- Add the tool entry to `tools-hub/data.json` with `image` (Wix media URL),
  `cmsItemId`, and `iconStatus: "live-wix-media"`.
  Fields: slug `kurfurstendamm-walk`, title `Ku'damm Axis Walk`,
  hubCategory `History` (History/Culture/Landmarks), type `Guide`,
  legacy category `Maps`, relatedBlog `/post/kurfurstendamm-berlin`,
  widgetUrl `https://fenerszymanski.github.io/berlinwalk-widgets/kurfurstendamm-walk/`,
  embedHeight `1520`.
- Create the `BerlinTools` CMS item so `/tools/kurfurstendamm-walk` is live.
- `node tools-hub/validate-data.mjs`, then commit/push.
