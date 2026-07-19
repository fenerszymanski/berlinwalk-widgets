# Daily-blog tool icon — `berlin-ghost-stations` — 2026-07-19 prompt (STRICT to match family)

Same fixed 3-layer BerlinTools family as the other `daily-blog-*` icons:
1. plain cream background
2. solid deep green #1B5E20 rounded-square glossy 3D app tile filling the frame
3. one large centered bright yellow #FFE600 glossy circular medallion disc
4. ONE clear glossy soft-3D symbolic object resting on the yellow disc

Generate through the approved non-paid route (built-in image generation first,
else Yusuf's logged-in ChatGPT via Chrome/Atlas/Codex browser). Download the raw
square, crop to canonical 512 + 160 RGBA PNGs, upload the 512 to Wix Media, then
wire into `tools-hub/data.json` (image + cmsItemId + iconStatus), create the
BerlinTools CMS item for `/tools/berlin-ghost-stations`, and commit/push.

Subject: this tool flips one Berlin tunnel map between 1961 and today and shows
which 15 stations were sealed. The symbol is a tunnel mouth with a single train
carriage passing through it, the clearest read of "train goes through, does not
stop". No text, no numbers, no people.

## `berlin-ghost-stations` (Berlin Ghost Stations Map)

```text
Create ONE square 1:1 app icon for BerlinWalk, in a strict fixed style. STRUCTURE, exactly three layers and nothing else: (1) a plain cream background; (2) a solid deep green #1B5E20 rounded-square app tile with soft glossy 3D bevel that fills the frame; (3) one large centered bright yellow #FFE600 glossy circular medallion disc on the tile. Resting on the yellow disc is ONE clear glossy soft-3D object: the rounded front of a single simple underground train carriage emerging head-on from a dark arched tunnel mouth, seen straight on, chunky and symmetrical, with one wide rounded windscreen shape and two small round headlamp shapes below it. Calm and toy-like, not menacing. No text, no readable letters, no numbers, no destination board, no people, no rails stretching away, no platform, no second disc, no scenery, no tracks in perspective. Colors: green tile #1B5E20, yellow disc #FFE600, the carriage in a warm cream white with soft glossy highlights and deep green #123D18 shading on the shadowed edges, and the tunnel arch behind it in deep green #123D18. Chunky simple shapes, high contrast, centered, readable at 160x160, clean. Do NOT use a white, glass, frosted, or pale tile.
```

### Remaining wiring after the raw icon is downloaded
- Crop to `tools-home/icons/berlin-ghost-stations.png` (512) and
  `berlin-ghost-stations-160.png` (160), clean RGBA / cream corners, no text.
- Upload the 512 to Wix Media; record the media id + URL.
- Add the tool entry to `tools-hub/data.json` with `image` (Wix media URL),
  `cmsItemId`, and `iconStatus: "live-wix-media"`.
  Fields: slug `berlin-ghost-stations`, title `Berlin Ghost Stations Map`,
  hubCategory `History` (History/Culture/Landmarks), type `Guide`,
  legacy category `Maps`, relatedBlog `/post/berlin-ghost-stations`,
  widgetUrl `https://fenerszymanski.github.io/berlinwalk-widgets/berlin-ghost-stations/`,
  embedHeight `1620`.
  Suggested lead: `The 15 Berlin stations that were sealed when the Wall went up.
  Flip the same tunnel map between 1961 and today and see what happened at each
  one, and which is closed again.`
- Create the `BerlinTools` CMS item so `/tools/berlin-ghost-stations` is live.
- `node tools-hub/validate-data.mjs`, then commit/push.

---

## Why this icon was not produced in the 2026-07-19 17:05 run

No non-paid image-generation route was reachable, for the third time in four
runs. The root cause is now identified and is a one-time fix:

- Built-in image generation: not available to this agent.
- `claude-in-chrome`: `list_connected_browsers` returns `[]`, extension not
  connected.
- `Control_Chrome`: `list_tabs` works and returns real tabs, but
  `get_page_content` and `execute_javascript` both fail with
  `Google Chrome is not running`. **This is the blocker.** It means Chrome's
  `Allow JavaScript from Apple Events` setting is off.
- `computer-use`: browsers are granted at read tier, so clicking and typing into
  a browser are blocked by design.
- Paid image APIs: forbidden for this automation.

**One-time fix for Yusuf:** in Chrome, open the `View` menu → `Developer` →
tick `Allow JavaScript from Apple Events`. Once that is on, the
ChatGPT-in-Chrome route works again and this icon can be generated in the next
interactive session without any further setup.

No placeholder or reused icon was shipped. `tools-hub/data.json` was
deliberately left untouched, so `/tools/berlin-ghost-stations` is not live yet.
The blog post package itself is complete and unaffected.
