# Daily-blog tool icon — Neukölln (2026-07-16) prompt (STRICT to match family)

Same fixed 3-layer BerlinTools family as `daily-blog-icons-20260716-prompts.md`:
1. plain cream background
2. solid deep green #1B5E20 rounded-square glossy 3D app tile filling the frame
3. one large centered bright yellow #FFE600 glossy circular medallion disc
4. ONE clear glossy soft-3D symbolic object resting on the yellow disc

Generate through the approved non-paid route (built-in Codex image generation
first, else Yusuf's logged-in ChatGPT via Chrome/Atlas/Codex browser). Download
the raw square, crop to canonical 512 + 160 RGBA PNGs, upload the 512 to Wix
Media, then wire into `tools-hub/data.json` (image + cmsItemId + iconStatus),
create the BerlinTools CMS item for `/tools/neukolln-kiez-decoder`, and
commit/push. This does NOT publish the blog post; the post stays UNPUBLISHED
until Yusuf approves it.

## `neukolln-kiez-decoder` (Which part of Neukölln?)

The tool helps a visitor decode a big, uneven district and aim their limited
time at the right kiez, so the symbol is a compass (orientation / choosing a
direction), which is also visually distinct from the other daily-blog icons
(camera, döner, memorial soldier, painted wall segment).

```text
Create ONE square 1:1 app icon for BerlinWalk, in a strict fixed style. STRUCTURE, exactly three layers and nothing else: (1) a plain cream background; (2) a solid deep green #1B5E20 rounded-square app tile with soft glossy 3D bevel that fills the frame; (3) one large centered bright yellow #FFE600 glossy circular medallion disc on the tile. Resting on the yellow disc is ONE clear glossy soft-3D object: a single simple round compass seen from above, a circular case with a clear cardinal dial and one bold pointer needle angled toward the top, a universal symbol of finding your direction. No map, no scenery, no scattered elements, no people, no second disc, no text. Colors: green tile #1B5E20, yellow disc #FFE600, compass case in deep green/dark with cream and white highlights, the needle in a warm red and cream split with one small lime #7CB342 accent on the dial. No text, no letters, no numbers, no logos. Do NOT use a white, glass, frosted, or pale tile. Chunky simple shapes, high contrast, centered, clearly readable at 160x160, clean.
```

### Remaining wiring after the raw icon is downloaded
- Crop to `tools-home/icons/neukolln-kiez-decoder.png` (512) and
  `neukolln-kiez-decoder-160.png` (160), clean RGBA / cream corners, no text.
- Upload the 512 to Wix Media; record the media id + URL.
- Add the tool entry to `tools-hub/data.json` (see the block in
  `CODEX_HANDOFF_neukolln-tool-icon-20260716.md`) with `image` (Wix media URL),
  `cmsItemId`, and `iconStatus: "live-wix-media"`.
- Create the `BerlinTools` CMS item so `/tools/neukolln-kiez-decoder` is live
  (slug, title, h1, lead, seoTitle, seoDescription, jsonLd WebApplication,
  widgetUrl, relatedBlog `/post/neukolln-berlin`). See
  `scripts/create-daily-tool-cms-20260715.mjs` for the established pattern.
- `node tools-hub/validate-data.mjs`, then commit/push.
- This does NOT publish the blog post; the post stays UNPUBLISHED until Yusuf
  approves it.
