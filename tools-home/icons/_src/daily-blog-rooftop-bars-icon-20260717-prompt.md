# Daily-blog tool icon — Berlin Rooftop Bars (2026-07-17) prompt (STRICT to match family)

Same fixed 3-layer BerlinTools family as `daily-blog-icons-20260716-prompts.md`
and `daily-blog-neukolln-icon-20260716-prompt.md`:
1. plain cream background
2. solid deep green #1B5E20 rounded-square glossy 3D app tile filling the frame
3. one large centered bright yellow #FFE600 glossy circular medallion disc
4. ONE clear glossy soft-3D symbolic object resting on the yellow disc

Generate through the approved non-paid route (built-in Codex image generation
first, else Yusuf's logged-in ChatGPT via Chrome/Atlas/Codex browser). Download
the raw square, crop to canonical 512 + 160 RGBA PNGs, upload the 512 to Wix
Media, then wire into `tools-hub/data.json` (image + cmsItemId + iconStatus),
create the BerlinTools CMS item for `/tools/berlin-rooftop-bars`, and
commit/push. This does NOT publish the blog post; the post stays UNPUBLISHED
until Yusuf approves it.

## `berlin-rooftop-bars` (Berlin Rooftop Sunset Planner)

The tool helps a visitor plan a rooftop-bar evening around the sunset, so the
symbol is a single cocktail glass (a drink with a view). It is visually distinct
from the other daily-blog icons (compass, camera, döner, memorial soldier,
painted wall segment).

```text
Create ONE square 1:1 app icon for BerlinWalk, in a strict fixed style. STRUCTURE, exactly three layers and nothing else: (1) a plain cream background; (2) a solid deep green #1B5E20 rounded-square app tile with soft glossy 3D bevel that fills the frame; (3) one large centered bright yellow #FFE600 glossy circular medallion disc on the tile. Resting on the yellow disc is ONE clear glossy soft-3D object: a single simple stemmed cocktail glass seen from the front, a wide coupe bowl on a short stem and round base, holding a warm amber drink with one round ice-like highlight, a universal symbol of a drink with a view. No skyline, no scenery, no scattered elements, no people, no second disc, no straw clutter, no text. Colors: green tile #1B5E20, yellow disc #FFE600, glass in cream and white glossy highlights with a warm amber drink, one small lime #7CB342 accent as a tiny garnish. No text, no letters, no numbers, no logos. Do NOT use a white, glass, frosted, or pale tile. Chunky simple shapes, high contrast, centered, clearly readable at 160x160, clean.
```

### Remaining wiring after the raw icon is downloaded
- Crop to `tools-home/icons/berlin-rooftop-bars.png` (512) and
  `berlin-rooftop-bars-160.png` (160), clean RGBA / cream corners, no text.
- Upload the 512 to Wix Media; record the media id + URL.
- Add the tool entry to `tools-hub/data.json` with `image` (Wix media URL),
  `cmsItemId`, and `iconStatus: "live-wix-media"`.
- Create the `BerlinTools` CMS item so `/tools/berlin-rooftop-bars` is live
  (slug, title, h1, lead, seoTitle, seoDescription, jsonLd WebApplication,
  widgetUrl, relatedBlog `/post/berlin-rooftop-bars`). See
  `scripts/create-daily-tool-cms-20260715.mjs` for the established pattern.
- `node tools-hub/validate-data.mjs`, then commit/push.
- This does NOT publish the blog post; the post stays UNPUBLISHED until Yusuf
  approves it.
