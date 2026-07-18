# Daily-blog tool icon — `berlin-smoking-rules` — 2026-07-18 prompt (STRICT to match family)

Same fixed 3-layer BerlinTools family as the other `daily-blog-*` icons:
1. plain cream background
2. solid deep green #1B5E20 rounded-square glossy 3D app tile filling the frame
3. one large centered bright yellow #FFE600 glossy circular medallion disc
4. ONE clear glossy soft-3D symbolic object resting on the yellow disc

Generate through the approved non-paid route (built-in image generation first,
else Yusuf's logged-in ChatGPT via Chrome/Atlas/Codex browser). Download the raw
square, crop to canonical 512 + 160 RGBA PNGs, upload the 512 to Wix Media, then
wire into `tools-hub/data.json` (image + cmsItemId + iconStatus), create the
BerlinTools CMS item for `/tools/berlin-smoking-rules`, and commit/push.

Note on subject: this is a rules/legality checker, so the symbol must stay
neutral and must NOT glamorise smoking. Do not draw a cigarette, a joint, a
cannabis leaf, or smoke. Use a "check where you are standing" symbol instead.

## `berlin-smoking-rules` (Berlin Smoking Rules Checker)

```text
Create ONE square 1:1 app icon for BerlinWalk, in a strict fixed style. STRUCTURE, exactly three layers and nothing else: (1) a plain cream background; (2) a solid deep green #1B5E20 rounded-square app tile with soft glossy 3D bevel that fills the frame; (3) one large centered bright yellow #FFE600 glossy circular medallion disc on the tile. Resting on the yellow disc is ONE clear glossy soft-3D object: a single rounded teardrop location map pin standing upright, seen from a slight three-quarter angle, with one simple bold check mark shape carved cleanly into the centre of its round face. A friendly modern wayfinding pin. No text, no readable letters, no numbers, no cigarette, no smoke, no cannabis leaf, no flags, no scattered elements, no second disc, no scenery. Colors: green tile #1B5E20, yellow disc #FFE600, the pin body in a warm cream white with soft glossy highlights and deep green #123D18 shading on the shadowed edge, the check mark in lime #7CB342. Chunky simple shapes, high contrast, centered, readable at 160x160, clean. Do NOT use a white, glass, frosted, or pale tile.
```

### Remaining wiring after the raw icon is downloaded
- Crop to `tools-home/icons/berlin-smoking-rules.png` (512) and
  `berlin-smoking-rules-160.png` (160), clean RGBA / cream corners, no text.
- Upload the 512 to Wix Media; record the media id + URL.
- Add the tool entry to `tools-hub/data.json` (block prepared in
  `tmp/smoking-in-berlin/tools-hub-entry.json`) with `image` (Wix media URL),
  `cmsItemId`, and `iconStatus: "live-wix-media"`.
  Fields: slug `berlin-smoking-rules`, title `Berlin Smoking Rules Checker`,
  hubCategory `Essentials` (Open Today & Essentials), type `Guide`,
  legacy category `Discovery`, relatedBlog `/post/smoking-in-berlin`.
- Create the `BerlinTools` CMS item so `/tools/berlin-smoking-rules` is live
  (slug, title, h1, lead, seoTitle, seoDescription, jsonLd WebApplication,
  widgetUrl `https://fenerszymanski.github.io/berlinwalk-widgets/berlin-smoking-rules/`,
  relatedBlog `/post/smoking-in-berlin`). Helper to be prepared:
  `scripts/wire-berlin-smoking-rules-tool-20260718.mjs`.
- `node tools-hub/validate-data.mjs`, then commit/push.
- This does NOT publish the blog post; the post stays UNPUBLISHED until Yusuf
  approves it.
