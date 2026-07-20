# Daily-blog tool icon — `dresden-day-clock` — 2026-07-20 prompt (STRICT to match family)

Same fixed 3-layer BerlinTools family as the other `daily-blog-*` icons:
1. plain cream background
2. solid deep green #1B5E20 rounded-square glossy 3D app tile filling the frame
3. one large centered bright yellow #FFE600 glossy circular medallion disc
4. ONE clear glossy soft-3D symbolic object resting on the yellow disc

Approved non-paid route only: Yusuf's logged-in ChatGPT account driven through
the connected browser. No paid image API.

Subject: the tool answers "how many hours of Dresden do I actually get between
the two trains". The symbol is a single hourglass with sand part-run-through,
because the whole article is about a fixed, draining time budget rather than
distance.

Collision check against the existing set: a round clock face is NOT usable, it is
already taken four times over. `berlin-breakfast-clock` owns a wall clock with a
croissant, `maybachufer-market-clock` owns a market stall with a clock in the
gable, `berlin-daylight-hours` owns a sun plus a blue-rimmed clock,
`berlin-booking-deadline-planner` owns a calendar plus a clock, and
`berlin-last-day-buffer-planner` owns a suitcase with a clock face. An hourglass
is used by none of them. `potsdam-day-trip-planner` owns a palace with a train
and a map pin, and `spreewald-reach-map` owns a wooden punt, so no other day-trip
tool owns an hourglass either.

## `dresden-day-clock` (Dresden Day Clock)

```text
Create ONE square 1:1 app icon for BerlinWalk, in a strict fixed style. STRUCTURE, exactly three layers and nothing else: (1) a plain cream background; (2) a solid deep green #1B5E20 rounded-square app tile with soft glossy 3D bevel that fills the frame; (3) one large centered bright yellow #FFE600 glossy circular medallion disc on the tile. Resting on the yellow disc is ONE clear glossy soft-3D object: a single upright hourglass seen face-on, with warm polished wooden top and bottom caps and three slim wooden corner posts, smooth clear glass bulbs, and fine warm-amber sand that has partly run through so the upper bulb is roughly one third full and the lower bulb holds a rounded mound of sand, with a thin visible stream of sand falling through the narrow waist. Symmetrical composition, toy-like, calm. No text, no readable letters, no numbers, no words, no clock face, no clock hands, no dial, no tick marks, no train, no railway, no map pin, no buildings, no people, no second object. Colors: green tile #1B5E20, yellow disc #FFE600, warm mid-brown polished wood caps and posts, clear glass, warm amber sand, and deep green #123D18 shading on shadowed edges. Chunky simple shapes, high contrast, centered, readable at 160x160, clean. Do NOT use a white, glass, frosted, or pale tile.
```

## Wiring after the raw icon is downloaded

- Save the raw ChatGPT output as
  `tools-home/icons/_src/daily-blog-dresden-day-clock-icon-20260720-raw.png`.
- Crop to `tools-home/icons/dresden-day-clock.png` (512) and
  `dresden-day-clock-160.png` (160), clean RGBA / cream corners, no text.
- Upload the 512 to Wix Media; record the media id + URL.
- Run `node scripts/create-dresden-day-clock-tool-cms.mjs` (uploads icon,
  creates the BerlinTools CMS item, wires `image` + `cmsItemId` +
  `iconStatus: "live-wix-media"` into the existing tools-hub entry).
- Update `tools-home/icons/manifest.json`, commit, push, verify GitHub Pages +
  `/tools/dresden-day-clock` live.
