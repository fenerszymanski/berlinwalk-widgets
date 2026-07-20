# Daily-blog tool icon — `schoneberg-plaque-check` — 2026-07-20 prompt (STRICT to match family)

Same fixed 3-layer BerlinTools family as the other `daily-blog-*` icons:
1. plain cream background
2. solid deep green #1B5E20 rounded-square glossy 3D app tile filling the frame
3. one large centered bright yellow #FFE600 glossy circular medallion disc
4. ONE clear glossy soft-3D symbolic object resting on the yellow disc

Approved non-paid route only: built-in image generation first, otherwise Yusuf's
logged-in ChatGPT account driven through the connected browser. No paid image
API.

Subject: the tool answers "what is actually screwed to the wall when I get
there". Schöneberg keeps its history on small memorial plaques (Gedenktafeln)
bolted to buildings people still live in, so the symbol is a single blank
enamel memorial plaque with two visible mounting screws.

Collision check against the existing set: `berlin-sign-decoder` owns a
wayfinding signpost with directional arrow boards and a magnifier;
`berliner-unterwelten-tour-board` owns a round steel blast door with a spoke
wheel; `berlin-street-sense-drill` and `berlin-name-pronouncer` own their own
objects. A flat rectangular wall plaque with screw heads is not used by any
current icon. A house-number plate was rejected because the family rule forbids
readable numbers, and a numberless house-number plate reads as nothing.

## `schoneberg-plaque-check` (Schöneberg Plaque Check)

```text
Create ONE square 1:1 app icon for BerlinWalk, in a strict fixed style. STRUCTURE, exactly three layers and nothing else: (1) a plain cream background; (2) a solid deep green #1B5E20 rounded-square app tile with soft glossy 3D bevel that fills the frame; (3) one large centered bright yellow #FFE600 glossy circular medallion disc on the tile. Resting on the yellow disc is ONE clear glossy soft-3D object: a single rectangular enamel memorial wall plaque seen face-on and slightly tilted, a thick landscape-oriented rounded-corner plate in deep cobalt blue enamel with a clean cream-white border stripe running just inside its edge, a completely blank smooth glossy blue face, and one small round chrome screw head near the top-left corner and one near the bottom-right corner. Symmetrical composition, toy-like, calm. No text, no readable letters, no numbers, no words, no engraving, no arrows, no post, no pole, no wall, no bricks, no people, no second plaque, no magnifier. Colors: green tile #1B5E20, yellow disc #FFE600, the plaque in deep cobalt blue with a cream-white border, chrome screw heads, and deep green #123D18 shading on shadowed edges. Chunky simple shapes, high contrast, centered, readable at 160x160, clean. Do NOT use a white, glass, frosted, or pale tile.
```

### Wiring after the raw icon is downloaded
- Save the raw ChatGPT output as
  `tools-home/icons/_src/daily-blog-schoneberg-plaque-check-icon-20260720-raw.png`.
- Crop to `tools-home/icons/schoneberg-plaque-check.png` (512) and
  `schoneberg-plaque-check-160.png` (160), clean RGBA / cream corners, no text.
- Upload the 512 to Wix Media; record the media id + URL.
- Run `node scripts/create-schoneberg-plaque-check-tool-cms.mjs` (uploads icon,
  creates the BerlinTools CMS item, wires `image` + `cmsItemId` +
  `iconStatus: "live-wix-media"` into the existing tools-hub entry).
- Update `tools-home/icons/manifest.json`, commit, push, verify GitHub Pages +
  `/tools/schoneberg-plaque-check` live.
