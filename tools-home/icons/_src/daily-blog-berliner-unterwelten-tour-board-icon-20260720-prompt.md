# Daily-blog tool icon — `berliner-unterwelten-tour-board` — 2026-07-20 prompt (STRICT to match family)

Same fixed 3-layer BerlinTools family as the other `daily-blog-*` icons:
1. plain cream background
2. solid deep green #1B5E20 rounded-square glossy 3D app tile filling the frame
3. one large centered bright yellow #FFE600 glossy circular medallion disc
4. ONE clear glossy soft-3D symbolic object resting on the yellow disc

Approved non-paid route only: built-in image generation first, otherwise Yusuf's
logged-in ChatGPT account driven through the connected browser. No paid image
API.

Subject: the tool answers "which underground tour can my group actually book,
and which street door does it use". The symbol is a single round steel bunker
blast door with a central wheel handle, because that is the literal thing at the
end of every one of these tours. A torch/flashlight was considered and rejected
as too generic; a staircase was rejected because it reads as a building icon.
No clock (owned by `berlin-breakfast-clock`), no map pin, no barrier (owned by
`berlin-marathon-day`).

## `berliner-unterwelten-tour-board` (Berlin Underground Tour Board)

```text
Create ONE square 1:1 app icon for BerlinWalk, in a strict fixed style. STRUCTURE, exactly three layers and nothing else: (1) a plain cream background; (2) a solid deep green #1B5E20 rounded-square app tile with soft glossy 3D bevel that fills the frame; (3) one large centered bright yellow #FFE600 glossy circular medallion disc on the tile. Resting on the yellow disc is ONE clear glossy soft-3D object: a single round heavy steel bunker blast door seen straight on, face-on to the viewer, a thick circular slab with a chunky raised rim, a few fat rivet studs around the rim, and one simple chunky four-spoke wheel handle centered on its face. Symmetrical, toy-like, calm. No text, no readable letters, no numbers, no signs, no people, no tunnel, no room, no second disc, no scenery, no light beams, no hinges shown open. Colors: green tile #1B5E20, yellow disc #FFE600, the blast door in a warm cream white with soft glossy highlights and deep green #123D18 shading on its shadowed edges and in the recessed spoke gaps. Chunky simple shapes, high contrast, centered, readable at 160x160, clean. Do NOT use a white, glass, frosted, or pale tile.
```

### Wiring after the raw icon is downloaded
- Crop to `tools-home/icons/berliner-unterwelten-tour-board.png` (512) and
  `berliner-unterwelten-tour-board-160.png` (160), clean RGBA / cream corners,
  no text.
- Upload the 512 to Wix Media; record the media id + URL.
- Add the tool entry to `tools-hub/data.json` with `image` (Wix media URL),
  `cmsItemId`, and `iconStatus: "live-wix-media"`.
  Fields: slug `berliner-unterwelten-tour-board`,
  title `Berlin Underground Tour Board`,
  hubCategory `CultureLandmarks`, type `Planner`, legacy category `Discovery`,
  relatedBlog `/post/berliner-unterwelten`,
  widgetUrl `https://fenerszymanski.github.io/berlinwalk-widgets/berliner-unterwelten-tour-board/`,
  embedHeight `2500`.
- Create the `BerlinTools` CMS item so `/tools/berliner-unterwelten-tour-board`
  is live.
- `node tools-hub/validate-data.mjs`, then commit/push.
