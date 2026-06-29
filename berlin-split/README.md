# Berlin Split: The Lost Archive

Standalone archive-map game for:

```text
https://www.berlinwalk.com/games/berlin-split
```

Local preview:

```bash
python3 -m http.server 8765
open "http://127.0.0.1:8765/berlin-split/?tracking=off"
```

Implementation notes:

- `data.json` is the mission/content source of truth.
- `index.html` contains the static game engine, styling, synthesized SFX, share/copy flow, and first-party tracking calls.
- The v1 game is intentionally not a quiz: avoid adding `Question`, `Correct`, `Wrong`, or A/B/C/D style UI labels.
- Production tracking posts to `https://berlinwalk-content-app.vercel.app/api/berlin-split-event`.
- Local previews should use `?tracking=off` unless intentionally testing the local Content Studio endpoint with `?tracking=local`.

Visual notes:

- The current cover is a code-native SVG illustration under `assets/social/`.
- If replacing with generated raster art, use Yusuf's logged-in ChatGPT browser workflow and keep provenance internal.
