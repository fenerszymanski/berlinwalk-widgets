# Daily-blog tool icon — `tropical-islands-cost-planner` — 2026-07-22 prompt (STRICT to match family)

Same fixed 3-layer BerlinTools family as the other `daily-blog-*` icons:
1. plain cream background
2. solid deep green #1B5E20 rounded-square glossy 3D app tile filling the frame
3. one large centered bright yellow #FFE600 glossy circular medallion disc
4. ONE clear glossy soft-3D symbolic object resting on the yellow disc

Approved non-paid route used: Yusuf's ChatGPT account through the connected
Chrome browser (share-link capture). No paid image API was used. Keep this
production provenance internal and out of public copy.

Subject: the tool plans a Tropical Islands day, and the single unmistakable
object is the resort itself: the giant white dome hangar. No other BerlinTools
icon owns a dome or a palm: `berlin-lakes` uses trees + water, `wannsee-shore-planner`
the beach chair, `spreewald-reach-map` a punt. A receipt was considered
(the widget is a receipt) and rejected as unreadable at 160px; a lone palm
was rejected as generic-tropical. The white capsule dome with a small palm
reads as "that place" instantly.

## `tropical-islands-cost-planner` (Tropical Islands Cost Planner)

```text
Create ONE square 1:1 app icon for BerlinWalk, in a strict fixed style. STRUCTURE, exactly three layers and nothing else: (1) a plain cream background; (2) a solid deep green #1B5E20 rounded-square app tile with soft glossy 3D bevel that fills the frame; (3) one large centered bright yellow #FFE600 glossy circular medallion disc on the tile. Resting on the yellow disc is ONE clear glossy soft-3D object: a huge gleaming white-silver elongated dome hangar seen from a slight front-left angle, shaped like a smooth half-capsule with subtle curved rib lines across its shell, one small glossy green palm tree standing directly in front of its entrance. Symmetrical composition, toy-like, calm. No text, no readable letters, no numbers, no signs, no people, no water, no waves, no clouds, no scenery beyond the single palm. Colors: green tile #1B5E20, yellow disc #FFE600, the dome in gleaming white with soft silver-grey shading, the palm in fresh glossy green with a small tan trunk, cream highlights and deep green #123D18 shading on shadowed edges. Chunky simple shapes, high contrast, centered, readable at 160x160, clean. Do NOT use a white, glass, frosted, or pale tile.
```

### Wiring after the raw icon is captured
- Save the captured output as
  `tools-home/icons/_src/daily-blog-tropical-islands-cost-planner-icon-20260722-raw.png`.
- Crop to `tools-home/icons/tropical-islands-cost-planner.png` (512) and
  `tropical-islands-cost-planner-160.png` (160), clean RGBA / cream corners, no text.
- Upload the 512 to Wix Media; record the media id + URL.
- Create the BerlinTools CMS item and wire `image` + `cmsItemId` +
  `iconStatus: "live-wix-media"` into the existing tools-hub entry.
- Update the current icon manifest, commit, push, verify GitHub Pages +
  `/tools/tropical-islands-cost-planner` live.
