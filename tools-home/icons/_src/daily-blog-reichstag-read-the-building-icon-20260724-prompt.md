# Daily-blog tool icon — 2026-07-24 `reichstag-read-the-building` (STRICT to match family)

Same fixed 3-layer BerlinTools family:
1. plain cream background
2. solid deep green #1B5E20 rounded-square glossy 3D app tile filling the frame
3. one large centered bright yellow #FFE600 glossy circular medallion disc
4. ONE clear glossy soft-3D symbolic object resting on the yellow disc

Generate in Yusuf's logged-in ChatGPT (non-paid). Download the raw square, crop
to canonical 512 + 160 RGBA PNGs, upload the 512 to Wix Media, then wire into
`tools-hub/data.json` (image + cmsItemId + iconStatus), create the BerlinTools
CMS item for `/tools/reichstag-read-the-building`, and commit/push.

## `reichstag-read-the-building` (Read the Reichstag)

```text
Create ONE square 1:1 app icon for BerlinWalk, in a strict fixed style. STRUCTURE, exactly three layers and nothing else: (1) a plain cream background; (2) a solid deep green #1B5E20 rounded-square app tile with soft glossy 3D bevel that fills the frame; (3) one large centered bright yellow #FFE600 glossy circular medallion disc on the tile. Resting on the yellow disc is ONE clear glossy soft-3D object: the Reichstag's famous glass dome, a single rounded transparent glass cupola with clean vertical glass ribs and a soft light-blue and cream glassy sheen, sitting on a short pale stone drum base. Just the dome and its base, centered, like a small collectible model. No full building, no columns, no flag, no scenery, no people, no second dome, no second disc, no text. Colors: green tile #1B5E20, yellow disc #FFE600, the dome in clear glass with pale blue and cream highlights, the stone base in warm cream, one small lime #7CB342 reflection accent on the glass. No text, no letters, no numbers, no logos. Do NOT use a white, glass, frosted, or pale tile. Chunky simple shapes, high contrast, centered, clearly readable at 160x160, clean.
```

### Remaining wiring after the raw icon is downloaded
- Crop to `tools-home/icons/reichstag-read-the-building.png` (512) and
  `reichstag-read-the-building-160.png` (160), clean RGBA / cream corners, no text.
- Upload the 512 to Wix Media; record the media id + URL.
- Add the tool entry to `tools-hub/data.json` with `image` (Wix media URL),
  `cmsItemId`, and `iconStatus: "live-wix-media"`.
- Create the `BerlinTools` CMS item so `/tools/reichstag-read-the-building` is
  live (slug, title, h1, lead, seoTitle, seoDescription, jsonLd WebApplication,
  widgetUrl, relatedBlog). A ready-to-run script is
  `scripts/create-reichstag-read-the-building-tool-cms.mjs` (dry-run first, then
  `--apply`). It reads the icon from
  `berlinwalk-widgets/_worktrees/reichstag-20260724/tools-home/icons/reichstag-read-the-building.png`.
- `node tools-hub/validate-data.mjs`, then commit/push.
- This does NOT publish the blog post; the post stays UNPUBLISHED until Yusuf
  approves it.
```
NOTE (2026-07-24 ~22:00 run): icon deferred because this autonomous scheduled
run had no connected logged-in browser and paid image APIs are forbidden. The
blog draft, widget, QS/FAQ and their GitHub Pages assets are all live/complete;
only this icon + the /tools/reichstag-read-the-building page remain.
```
