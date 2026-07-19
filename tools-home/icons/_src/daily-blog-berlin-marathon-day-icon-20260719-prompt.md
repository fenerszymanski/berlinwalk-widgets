# Daily-blog tool icon — `berlin-marathon-day` — 2026-07-19 prompt (STRICT to match family)

Same fixed 3-layer BerlinTools family as the other `daily-blog-*` icons:
1. plain cream background
2. solid deep green #1B5E20 rounded-square glossy 3D app tile filling the frame
3. one large centered bright yellow #FFE600 glossy circular medallion disc
4. ONE clear glossy soft-3D symbolic object resting on the yellow disc

Generated through the approved non-paid route: Yusuf's logged-in ChatGPT account
driven through Chrome. No paid image API was used.

Subject: the tool plays Berlin Marathon Sunday out hour by hour and shows which
side of the city is closed at any given moment. The symbol is a single portable
crowd-control street barrier, because that is literally the object a visitor
meets on marathon day. A clock face was rejected because
`berlin-breakfast-clock` already owns that shape in the family.

## `berlin-marathon-day` (Marathon Day Berlin)

```text
Create ONE square 1:1 app icon for BerlinWalk, in a strict fixed style. STRUCTURE, exactly three layers and nothing else: (1) a plain cream background; (2) a solid deep green #1B5E20 rounded-square app tile with soft glossy 3D bevel that fills the frame; (3) one large centered bright yellow #FFE600 glossy circular medallion disc on the tile. Resting on the yellow disc is ONE clear glossy soft-3D object: a single chunky crowd-control street barrier seen straight on, the simple portable kind used to close a road, with a thick rounded top rail, a thick rounded bottom rail, three or four fat vertical bars between them, and two short feet. Symmetrical, toy-like, calm. No text, no readable letters, no numbers, no signs, no people, no runners, no road, no second disc, no scenery, no tape, no flags. Colors: green tile #1B5E20, yellow disc #FFE600, the barrier in a warm cream white with soft glossy highlights and deep green #123D18 shading on its shadowed edges. Chunky simple shapes, high contrast, centered, readable at 160x160, clean. Do NOT use a white, glass, frosted, or pale tile.
```

### Wiring after the raw icon is downloaded
- Crop to `tools-home/icons/berlin-marathon-day.png` (512) and
  `berlin-marathon-day-160.png` (160), clean RGBA / cream corners, no text.
- Upload the 512 to Wix Media; record the media id + URL.
- Add the tool entry to `tools-hub/data.json` with `image` (Wix media URL),
  `cmsItemId`, and `iconStatus: "live-wix-media"`.
  Fields: slug `berlin-marathon-day`, title `Marathon Day Berlin`,
  hubCategory `EventsSports` (Events/Sports/Festivals), type `Planner`,
  legacy category `Discovery`, relatedBlog `/post/berlin-marathon-2026`,
  widgetUrl `https://fenerszymanski.github.io/berlinwalk-widgets/berlin-marathon-day/`,
  embedHeight `1900`.
  Suggested lead: `Berlin Marathon Sunday, played out hour by hour. See when each
  side of the city closes, when it opens again, and where the runners are while
  you are trying to get somewhere.`
- Create the `BerlinTools` CMS item so `/tools/berlin-marathon-day` is live.
- `node tools-hub/validate-data.mjs`, then commit/push.
