# Daily-blog tool icon — 2026-07-25 `german-time-dial` (STRICT to match family)

Same fixed 3-layer BerlinTools family:
1. plain cream background
2. solid deep green #1B5E20 rounded-square glossy 3D app tile filling the frame
3. one large centered bright yellow #FFE600 glossy circular medallion disc
4. ONE clear glossy soft-3D symbolic object resting on the yellow disc

Generate in Yusuf's logged-in ChatGPT (non-paid). Download the raw square, crop
to canonical 512 + 160 RGBA PNGs, upload the 512 to Wix Media, then wire into
`tools-hub/data.json` (image + cmsItemId + iconStatus), create the BerlinTools
CMS item for `/tools/german-time-dial`, and commit/push.

## `german-time-dial` (German Time Dial)

```text
Create ONE square 1:1 app icon for BerlinWalk, in a strict fixed style. STRUCTURE, exactly three layers and nothing else: (1) a plain cream background; (2) a solid deep green #1B5E20 rounded-square app tile with soft glossy 3D bevel that fills the frame; (3) one large centered bright yellow #FFE600 glossy circular medallion disc on the tile. Resting on the yellow disc is ONE clear glossy soft-3D object: a small classic round station clock, a single chunky cream-white clock face in a slim deep green rim, with only two simple clock hands and no numerals and no markings on the face, the short hand pointing up-left and the long hand pointing straight down, plus one tiny lime #7CB342 centre pin. Just the one clock, centered, like a small collectible model. No numbers, no digits, no dial numerals, no second clock, no stand, no pendulum, no wall, no scenery, no people, no second disc, no text. Colors: green tile #1B5E20, yellow disc #FFE600, the clock face in warm cream white, the rim in deep green #1B5E20, the hands in near-black #212121, one small lime #7CB342 reflection accent on the glass. No text, no letters, no numbers, no logos. Do NOT use a white, glass, frosted, or pale tile. Chunky simple shapes, high contrast, centered, clearly readable at 160x160, clean.
```

Note the deliberate constraint: the icon family forbids letters and numbers, so
the clock face must stay blank. The two hands alone read as "clock" at 160px.

### Remaining wiring after the raw icon is downloaded
- Crop to `tools-home/icons/german-time-dial.png` (512) and
  `german-time-dial-160.png` (160), clean RGBA / cream corners, no text.
- Upload the 512 to Wix Media; record the media id + URL.
- Add the tool entry to `tools-hub/data.json` with `image` (Wix media URL),
  `cmsItemId`, and `iconStatus: "live-wix-media"`.
- Create the `BerlinTools` CMS item so `/tools/german-time-dial` is live (slug,
  title, h1, lead, seoTitle, seoDescription, jsonLd WebApplication, widgetUrl,
  relatedBlog). A ready-to-run script is
  `scripts/create-german-time-dial-tool-cms.mjs` (dry-run first, then
  `--apply`). It also inserts the `tools-hub/data.json` entry and both icon
  manifest records when they are missing.
- `node tools-hub/validate-data.mjs`, then commit/push.
- This does NOT publish the blog post; the post stays UNPUBLISHED until Yusuf
  approves it.

```
NOTE (2026-07-25 ~00:30 run): icon deferred because this autonomous scheduled
run had no connected logged-in browser (`list_connected_browsers` returned an
empty list), no built-in image generation, and paid image APIs are forbidden for
daily-blog production. The blog draft, widget, Quick Summary, FAQ and their
GitHub Pages assets are complete; only this icon plus the
/tools/german-time-dial page remain.
```
