# Daily-blog tool icon — `wannsee-shore-planner` — 2026-07-21 prompt (STRICT to match family)

Same fixed 3-layer BerlinTools family as the other `daily-blog-*` icons:
1. plain cream background
2. solid deep green #1B5E20 rounded-square glossy 3D app tile filling the frame
3. one large centered bright yellow #FFE600 glossy circular medallion disc
4. ONE clear glossy soft-3D symbolic object resting on the yellow disc

Approved non-paid route used: built-in Codex image generation. No paid image
API was used. Keep this production provenance internal and out of public copy.

Subject: the tool plans a day around Wannsee, and the single most iconic
Wannsee object is the Strandkorb, the two-seater hooded wicker beach chair of
Strandbad Wannsee. No other BerlinTools icon owns it: `berlin-lakes` uses
trees + water, `berlin-pools` a pool motif, `what-to-pack-berlin` luggage.
A peacock was considered (Pfaueninsel) and rejected because the tool covers
the whole shore, not just the island, and the beach chair is the clearer
"lake day" signal at 160px.

## `wannsee-shore-planner` (Wannsee Shore Planner)

```text
Create ONE square 1:1 app icon for BerlinWalk, in a strict fixed style. STRUCTURE, exactly three layers and nothing else: (1) a plain cream background; (2) a solid deep green #1B5E20 rounded-square app tile with soft glossy 3D bevel that fills the frame; (3) one large centered bright yellow #FFE600 glossy circular medallion disc on the tile. Resting on the yellow disc is ONE clear glossy soft-3D object: a classic German two-seater hooded wicker beach chair (Strandkorb) seen from a slight front-left angle, woven wicker body in warm natural beige-tan, its curved hood striped in white and soft blue, a small bench seat visible, sitting on a tiny mound of pale sand. Symmetrical composition, toy-like, calm. No text, no readable letters, no numbers, no signs, no people, no towels, no umbrella, no water, no waves, no scenery, no second chair. Colors: green tile #1B5E20, yellow disc #FFE600, the chair in warm wicker tan with white and soft blue hood stripes, cream highlights and deep green #123D18 shading on shadowed edges. Chunky simple shapes, high contrast, centered, readable at 160x160, clean. Do NOT use a white, glass, frosted, or pale tile.
```

### Wiring after the raw icon is captured
- Save the built-in generation output as
  `tools-home/icons/_src/daily-blog-wannsee-shore-planner-icon-20260721-raw.png`.
- Crop to `tools-home/icons/wannsee-shore-planner.png` (512) and
  `wannsee-shore-planner-160.png` (160), clean RGBA / cream corners, no text.
- Upload the 512 to Wix Media; record the media id + URL.
- Run `node scripts/create-wannsee-shore-planner-tool-cms.mjs` (uploads icon,
  creates the BerlinTools CMS item, wires `image` + `cmsItemId` +
  `iconStatus: "live-wix-media"` into the existing tools-hub entry).
- Update the current icon manifest, commit, push, verify GitHub Pages +
  `/tools/wannsee-shore-planner` live.
