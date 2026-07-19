# Daily-blog tool icon — `berlin-ubahn-etiquette` — 2026-07-19 prompt (STRICT to match family)

Same fixed 3-layer BerlinTools family as the other `daily-blog-*` icons:
1. plain cream background
2. solid deep green #1B5E20 rounded-square glossy 3D app tile filling the frame
3. one large centered bright yellow #FFE600 glossy circular medallion disc
4. ONE clear glossy soft-3D symbolic object resting on the yellow disc

Generate through the approved non-paid route (built-in image generation first,
else Yusuf's logged-in ChatGPT via Chrome/Atlas/Codex browser). Download the raw
square, crop to canonical 512 + 160 RGBA PNGs, upload the 512 to Wix Media, then
wire into `tools-hub/data.json` (image + cmsItemId + iconStatus), create the
BerlinTools CMS item for `/tools/berlin-ubahn-etiquette`, and commit/push.

Subject: this is a U-Bahn etiquette / conduct cheat sheet, so the symbol is a
single friendly metro train, clean and calm. No text, no numbers, no people.

## `berlin-ubahn-etiquette` (Berlin U-Bahn Etiquette Cheat Sheet)

```text
Create ONE square 1:1 app icon for BerlinWalk, in a strict fixed style. STRUCTURE, exactly three layers and nothing else: (1) a plain cream background; (2) a solid deep green #1B5E20 rounded-square app tile with soft glossy 3D bevel that fills the frame; (3) one large centered bright yellow #FFE600 glossy circular medallion disc on the tile. Resting on the yellow disc is ONE clear glossy soft-3D object: a single simple metro / U-Bahn train car seen head-on at a slight three-quarter angle, with a rounded friendly front, two windows and a headlight, as if gliding toward the viewer. A calm, modern, approachable transit symbol. No text, no readable letters, no numbers, no people, no rails, no scattered elements, no second disc, no scenery. Colors: green tile #1B5E20, yellow disc #FFE600, the train in a warm cream white with soft glossy highlights and deep green #123D18 shading on the shadowed edges. Chunky simple shapes, high contrast, centered, readable at 160x160, clean. Do NOT use a white, glass, frosted, or pale tile.
```

### Remaining wiring after the raw icon is downloaded
- Crop to `tools-home/icons/berlin-ubahn-etiquette.png` (512) and
  `berlin-ubahn-etiquette-160.png` (160), clean RGBA / cream corners, no text.
- Upload the 512 to Wix Media; record the media id + URL.
- Add the tool entry to `tools-hub/data.json` with `image` (Wix media URL),
  `cmsItemId`, and `iconStatus: "live-wix-media"`.
  Fields: slug `berlin-ubahn-etiquette`, title `Berlin U-Bahn Etiquette Cheat Sheet`,
  hubCategory `Transport` (Transport/Tickets/Arrival), type `Guide`,
  legacy category `Discovery`, relatedBlog `/post/berlin-ubahn-etiquette`.
- Create the `BerlinTools` CMS item so `/tools/berlin-ubahn-etiquette` is live.
- `node tools-hub/validate-data.mjs`, then commit/push.
```
