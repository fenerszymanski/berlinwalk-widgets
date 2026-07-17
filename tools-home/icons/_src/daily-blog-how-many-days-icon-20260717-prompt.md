# Daily-blog tool icon — Berlin Trip Length Advisor (2026-07-17) prompt (STRICT to match family)

Same fixed 3-layer BerlinTools family as
`daily-blog-hop-on-hop-off-icon-20260717-prompt.md`:
1. plain cream background
2. solid deep green #1B5E20 rounded-square glossy 3D app tile filling the frame
3. one large centered bright yellow #FFE600 glossy circular medallion disc
4. ONE clear glossy soft-3D symbolic object resting on the yellow disc

Generate through the approved non-paid route (built-in image generation first,
else Yusuf's logged-in ChatGPT via Chrome/Atlas/Codex browser). Download the raw
square, crop to canonical 512 + 160 RGBA PNGs, upload the 512 to Wix Media, then
wire into `tools-hub/data.json` (image + cmsItemId + iconStatus), create the
BerlinTools CMS item for `/tools/how-many-days-in-berlin`, and commit/push.
This does NOT publish the blog post; the post stays UNPUBLISHED until Yusuf
approves it.

## `how-many-days-in-berlin` (Berlin Trip Length Advisor)

The tool helps a visitor decide how many days to spend in Berlin, so the symbol
is a single friendly tear-off desk calendar (a date block), the universal symbol
for "how many days." It is visually distinct from the other daily-blog icons
(cocktail glass, compass, camera, döner, memorial soldier, painted wall segment,
double-decker bus).

```text
Create ONE square 1:1 app icon for BerlinWalk, in a strict fixed style. STRUCTURE, exactly three layers and nothing else: (1) a plain cream background; (2) a solid deep green #1B5E20 rounded-square app tile with soft glossy 3D bevel that fills the frame; (3) one large centered bright yellow #FFE600 glossy circular medallion disc on the tile. Resting on the yellow disc is ONE clear glossy soft-3D object: a single simple tear-off desk calendar seen from a friendly three-quarter front angle, a chunky rounded page block with two small metal spiral binding rings at the top and a subtly curling front page corner, the universal symbol of a calendar and counting days. No numbers, no dates printed on it, no skyline, no scenery, no scattered elements, no people, no second disc, no text. Colors: green tile #1B5E20, yellow disc #FFE600, calendar page body in warm cream and white glossy highlights, a deep green #1B5E20 top header band on the calendar, small silver-grey binding rings, one small lime #7CB342 accent. No text, no letters, no numbers, no digits, no logos. Do NOT use a white, glass, frosted, or pale tile. Chunky simple shapes, high contrast, centered, clearly readable at 160x160, clean.
```

### Remaining wiring after the raw icon is downloaded
- Crop to `tools-home/icons/how-many-days-in-berlin.png` (512) and
  `how-many-days-in-berlin-160.png` (160), clean RGBA / cream corners, no text.
- Upload the 512 to Wix Media; record the media id + URL.
- Add the tool entry to `tools-hub/data.json` with `image` (Wix media URL),
  `cmsItemId`, and `iconStatus: "live-wix-media"`.
- Create the `BerlinTools` CMS item so `/tools/how-many-days-in-berlin` is live
  (slug, title, h1, lead, seoTitle, seoDescription, jsonLd WebApplication,
  widgetUrl, relatedBlog `/post/how-many-days-in-berlin`). See
  `scripts/create-daily-tool-cms-20260715.mjs` for the established pattern.
- `node tools-hub/validate-data.mjs`, then commit/push.
- This does NOT publish the blog post; the post stays UNPUBLISHED until Yusuf
  approves it.
