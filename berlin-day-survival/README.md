# Berlin Day Survival

Standalone game for `https://www.berlinwalk.com/games/berlin-day-survival`.

Local preview:

```bash
python3 -m http.server 8768
open http://127.0.0.1:8768/berlin-day-survival/
```

Audio generation:

```bash
source ../scripts/load-api-keys.sh
node berlin-day-survival/scripts/generate-audio.mjs
```

The script reads `data.json`, skips existing ambience MP3 files, and writes:

- `assets/audio/ambience/*.mp3`
- `assets/audio/ui/*.wav`
- `assets/audio/GENERATION_NOTES.json`

Visual assets:

- Hero: `assets/hero/berlin-day-survival-hero.webp`
- Scene art: `assets/scenes/*.webp` (`960x600`, textless, 16:10)
- Result art: `assets/results/*.webp` (`960x600`, textless, 16:10)
- Social image: `assets/social/berlin-day-survival-social-1200x630.jpg`
- Current source set: `assets/source/chatgpt-browser-20260627/`, generated
  through Yusuf's logged-in ChatGPT browser account. Do not regenerate these
  assets with API/CLI image tools or local placeholder drawing unless Yusuf
  explicitly approves that exception.

Production tracking posts to:

```text
https://berlinwalk-content-app.vercel.app/api/day-survival-event
```

Local previews do not send events by default. Add `?tracking=local` only while
the local Content Studio server is running and you intentionally want QA rows in
the Wix CMS collection.
