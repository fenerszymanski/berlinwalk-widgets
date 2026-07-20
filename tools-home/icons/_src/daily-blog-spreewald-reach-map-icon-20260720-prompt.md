# Daily-blog tool icon — `spreewald-reach-map` — 2026-07-20 prompt (STRICT to match family)

Same fixed 3-layer BerlinTools family as the other `daily-blog-*` icons:
1. plain cream background
2. solid deep green #1B5E20 rounded-square glossy 3D app tile filling the frame
3. one large centered bright yellow #FFE600 glossy circular medallion disc
4. ONE clear glossy soft-3D symbolic object resting on the yellow disc

Approved non-paid route only: built-in image generation first, otherwise Yusuf's
logged-in ChatGPT account driven through the connected browser. No paid image
API.

Subject: the tool answers "how deep into the Spreewald waterways does each boat
choice take you". The symbol is a single flat wooden Spreewald punt (Kahn) with
its long punting pole, because the punt IS the trip and no other BerlinTools
icon owns it: `berlin-boat-tour-finder` uses a round excursion boat,
`berlin-public-transport-ferry-picker` a ferry, and neither has the flat open
hull + pole silhouette. A gherkin was rejected as off-topic for a water-reach
tool; a map-pin network was rejected as too generic and map-pins are already
common in the set.

## `spreewald-reach-map` (Spreewald Reach Map)

```text
Create ONE square 1:1 app icon for BerlinWalk, in a strict fixed style. STRUCTURE, exactly three layers and nothing else: (1) a plain cream background; (2) a solid deep green #1B5E20 rounded-square app tile with soft glossy 3D bevel that fills the frame; (3) one large centered bright yellow #FFE600 glossy circular medallion disc on the tile. Resting on the yellow disc is ONE clear glossy soft-3D object: a single flat-bottomed wooden Spreewald punt boat seen from a slight top-front angle, a long low open wooden hull with two simple bench seats, warm chestnut brown wood with soft glossy highlights, and one long pale wooden punting pole leaning diagonally across the boat from lower left to upper right. Symmetrical composition, toy-like, calm. No text, no readable letters, no numbers, no signs, no people, no water, no waves, no trees, no scenery, no second boat, no paddle blades, no oars. Colors: green tile #1B5E20, yellow disc #FFE600, the punt in warm chestnut brown with cream highlights and deep green #123D18 shading on shadowed edges. Chunky simple shapes, high contrast, centered, readable at 160x160, clean. Do NOT use a white, glass, frosted, or pale tile.
```

### Wiring after the raw icon is downloaded
- Save the raw ChatGPT output as
  `tools-home/icons/_src/daily-blog-spreewald-reach-map-icon-20260720-raw.png`.
- Crop to `tools-home/icons/spreewald-reach-map.png` (512) and
  `spreewald-reach-map-160.png` (160), clean RGBA / cream corners, no text.
- Upload the 512 to Wix Media; record the media id + URL.
- Run `node scripts/create-spreewald-reach-map-tool-cms.mjs` (uploads icon,
  creates the BerlinTools CMS item, wires `image` + `cmsItemId` +
  `iconStatus: "live-wix-media"` into the existing tools-hub entry).
- Update both icon manifests, commit, push, verify GitHub Pages +
  `/tools/spreewald-reach-map` live.
