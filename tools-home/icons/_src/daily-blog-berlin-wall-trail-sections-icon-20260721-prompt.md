# Daily-blog tool icon — `berlin-wall-trail-sections` — 2026-07-21 prompt (STRICT to match family)

Same fixed 3-layer BerlinTools family as the other `daily-blog-*` icons:
1. plain cream background
2. solid deep green #1B5E20 rounded-square glossy 3D app tile filling the frame
3. one large centered bright yellow #FFE600 glossy circular medallion disc
4. ONE clear glossy soft-3D symbolic object resting on the yellow disc

Approved non-paid route: no built-in image generation tool is exposed in this
run, so the fallback is Yusuf's logged-in ChatGPT account through Chrome
(`claude-in-chrome`). No paid image API is used. Keep this production
provenance internal and out of public copy.

Subject: the tool answers "which section of the 160 km Mauerweg is worth my
time", and the object that says "border trail" fastest at 160px is the GDR
border watchtower. Checked against the existing family for collision:
`berlin-wall-remnants` already owns a cracked concrete wall segment,
`berlin-ghost-stations` owns an underground station motif, and
`stolperstein-reader` owns a brass pavement stone. No existing BerlinTools icon
uses a watchtower, so it is free.

Rejected alternatives: a Mauerweg waymarker signpost (reads as generic
signage and would need text to be legible), and a map/route ribbon (too close
to the existing `berlin-two-day-route-map` and `spreewald-reach-map` cards).

## `berlin-wall-trail-sections` (Berlin Wall Trail Section Finder)

```text
Create ONE square 1:1 app icon for BerlinWalk, in a strict fixed style. STRUCTURE, exactly three layers and nothing else: (1) a plain cream background; (2) a solid deep green #1B5E20 rounded-square app tile with soft glossy 3D bevel that fills the frame; (3) one large centered bright yellow #FFE600 glossy circular medallion disc on the tile. Resting on the yellow disc is ONE clear glossy soft-3D object: a single tall square East German border watchtower seen from a slight front-left angle, a slim pale grey concrete shaft widening at the top into a glazed observation cabin with dark tinted windows all round and a flat overhanging roof, standing on a small base. Chunky toy-like proportions, symmetrical, calm. No text, no readable letters, no numbers, no signs, no flags, no people, no searchlight beam, no fence, no wall, no barbed wire, no scenery, no second tower. Colors: green tile #1B5E20, yellow disc #FFE600, the tower in pale concrete grey with dark slate glazing, cream highlights and deep green #123D18 shading on shadowed edges. Chunky simple shapes, high contrast, centered, readable at 160x160, clean. Do NOT use a white, glass, frosted, or pale tile.
```

### Wiring after the raw icon is captured
- Save the generation output as
  `tools-home/icons/_src/daily-blog-berlin-wall-trail-sections-icon-20260721-raw.png`.
- Crop to `tools-home/icons/berlin-wall-trail-sections.png` (512) and
  `berlin-wall-trail-sections-160.png` (160), clean RGBA / cream corners, no text.
- Upload the 512 to Wix Media; record the media id + URL.
- Run `node scripts/create-berlin-wall-trail-sections-tool-cms.mjs` (uploads icon,
  creates the BerlinTools CMS item, wires `image` + `cmsItemId` +
  `iconStatus: "live-wix-media"` into the existing tools-hub entry).
- Update the current icon manifest, commit, push, verify GitHub Pages +
  `/tools/berlin-wall-trail-sections` live.
