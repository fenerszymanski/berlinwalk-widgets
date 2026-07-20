# Daily-blog tool icon — `berlin-beer-season-calendar` — 2026-07-19 prompt (STRICT to match family)

**STATUS: GENERATED 2026-07-20.** Built-in Codex image generation produced the
approved square source at
`_src/daily-blog-berlin-beer-season-calendar-icon-20260719-raw.png`; canonical
512 px and 160 px PNGs are in `tools-home/icons/`. Tool/CMS wiring follows in
the same interactive publish session.

Same fixed 3-layer BerlinTools family as the other `daily-blog-*` icons:
1. plain cream background
2. solid deep green #1B5E20 rounded-square glossy 3D app tile filling the frame
3. one large centered bright yellow #FFE600 glossy circular medallion disc
4. ONE clear glossy soft-3D symbolic object resting on the yellow disc

Subject choice: this tool is a **date-overlap timeline** ("are the Berlin beer
events on while I am here?"), so the symbol is a calendar block, not a beer mug.
`berlin-beer-gardens-map` already owns the mug/tree/pin composition and must not
be echoed here.

## `berlin-beer-season-calendar` (Berlin Beer Season Calendar)

```text
Create ONE square 1:1 app icon for BerlinWalk, in a strict fixed style. STRUCTURE, exactly three layers and nothing else: (1) a plain cream background; (2) a solid deep green #1B5E20 rounded-square app tile with soft glossy 3D bevel that fills the frame; (3) one large centered bright yellow #FFE600 glossy circular medallion disc on the tile. Resting on the yellow disc is ONE clear glossy soft-3D object: a single chunky desk calendar block seen at a slight three-quarter angle, with a rounded deep green #1B5E20 header bar across the top, a warm cream white face, and a soft evenly spaced grid of small round dots on the face instead of dates, with exactly one dot highlighted in bright lime green #7CB342. Rounded corners, thick friendly proportions, soft glossy highlights and deep green #123D18 shading on the shadowed edges. No text, no readable letters, no numbers, no people, no beer mug, no tree, no map pin, no second disc, no scattered elements, no scenery. Chunky simple shapes, high contrast, centered, readable at 160x160, clean. Do NOT use a white, glass, frosted, or pale tile.
```

### Remaining wiring after the raw icon is downloaded
- Save the raw square as
  `_src/daily-blog-berlin-beer-season-calendar-icon-20260719-raw.png`.
- Crop to `tools-home/icons/berlin-beer-season-calendar.png` (512) and
  `berlin-beer-season-calendar-160.png` (160), clean RGBA / cream corners, no text.
- Upload the 512 to Wix Media; record the media id + URL.
- Add the tool entry to `tools-hub/data.json` with `image` (Wix media URL),
  `cmsItemId`, and `iconStatus: "live-wix-media"`.
  Fields: slug `berlin-beer-season-calendar`,
  title `Berlin Beer Season Calendar`,
  hubCategory `EventsSports`, type `Planner`,
  legacy category `Discovery`,
  relatedBlog `/post/oktoberfest-in-berlin`,
  widgetUrl `https://fenerszymanski.github.io/berlinwalk-widgets/berlin-beer-season-calendar/`,
  embedHeight `2020`.
- Create the `BerlinTools` CMS item so `/tools/berlin-beer-season-calendar` is live.
- `node tools-hub/validate-data.mjs`, then commit/push.
- Do **not** add it to homepage `tools-home/data.json`; it is seasonal and not a
  top-8 tourist tool.
