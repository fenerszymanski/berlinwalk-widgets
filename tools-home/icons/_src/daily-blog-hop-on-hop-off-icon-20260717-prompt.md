# Daily-blog tool icon — Berlin Sightseeing Bus Value Calculator (2026-07-17) prompt (STRICT to match family)

Same fixed 3-layer BerlinTools family as `daily-blog-rooftop-bars-icon-20260717-prompt.md`:
1. plain cream background
2. solid deep green #1B5E20 rounded-square glossy 3D app tile filling the frame
3. one large centered bright yellow #FFE600 glossy circular medallion disc
4. ONE clear glossy soft-3D symbolic object resting on the yellow disc

Generate through the approved non-paid route (built-in image generation first,
else Yusuf's logged-in ChatGPT via Chrome/Atlas/Codex browser). Download the raw
square, crop to canonical 512 + 160 RGBA PNGs, upload the 512 to Wix Media, then
wire into `tools-hub/data.json` (image + cmsItemId + iconStatus), create the
BerlinTools CMS item for `/tools/berlin-hop-on-hop-off-decision`, and commit/push.
This does NOT publish the blog post; the post stays UNPUBLISHED until Yusuf
approves it.

## `berlin-hop-on-hop-off-decision` (Berlin Sightseeing Bus Value Calculator)

The tool helps a visitor decide whether the hop-on hop-off sightseeing bus is
worth it, so the symbol is a single friendly double-decker sightseeing bus (a
tour bus). It is visually distinct from the other daily-blog icons (cocktail
glass, compass, camera, döner, memorial soldier, painted wall segment).

```text
Create ONE square 1:1 app icon for BerlinWalk, in a strict fixed style. STRUCTURE, exactly three layers and nothing else: (1) a plain cream background; (2) a solid deep green #1B5E20 rounded-square app tile with soft glossy 3D bevel that fills the frame; (3) one large centered bright yellow #FFE600 glossy circular medallion disc on the tile. Resting on the yellow disc is ONE clear glossy soft-3D object: a single simple double-decker sightseeing tour bus seen from a friendly three-quarter front angle, two rows of windows, a rounded chunky body, small round wheels, an open top deck hinted by a low roof rail, a universal symbol of a city sightseeing bus. No skyline, no scenery, no road, no scattered elements, no people, no second disc, no text. Colors: green tile #1B5E20, yellow disc #FFE600, bus body in warm cream and white glossy highlights with a bright red #E63946 lower stripe, windows in soft glossy blue-grey, one small lime #7CB342 accent. No text, no letters, no numbers, no route digits, no logos. Do NOT use a white, glass, frosted, or pale tile. Chunky simple shapes, high contrast, centered, clearly readable at 160x160, clean.
```

### Remaining wiring after the raw icon is downloaded
- Crop to `tools-home/icons/berlin-hop-on-hop-off-decision.png` (512) and
  `berlin-hop-on-hop-off-decision-160.png` (160), clean RGBA / cream corners, no text.
- Upload the 512 to Wix Media; record the media id + URL.
- Add the tool entry to `tools-hub/data.json` with `image` (Wix media URL),
  `cmsItemId`, and `iconStatus: "live-wix-media"`.
- Create the `BerlinTools` CMS item so `/tools/berlin-hop-on-hop-off-decision` is
  live (slug, title, h1, lead, seoTitle, seoDescription, jsonLd WebApplication,
  widgetUrl, relatedBlog `/post/berlin-hop-on-hop-off-bus-worth-it`). See
  `scripts/create-daily-tool-cms-20260715.mjs` for the established pattern.
- `node tools-hub/validate-data.mjs`, then commit/push.
- This does NOT publish the blog post; the post stays UNPUBLISHED until Yusuf
  approves it.
