# Berlin Smile Challenge

Standalone game for `https://www.berlinwalk.com/games/berlin-smile-challenge`.

Local preview:

```bash
python3 -m http.server 8767
open http://127.0.0.1:8767/berlin-smile-challenge/
```

Audio generation:

```bash
source ../scripts/load-api-keys.sh
node berlin-smile-challenge/scripts/generate-elevenlabs-audio.mjs
```

The script reads `data.json`, skips existing MP3 files, and writes:

- `assets/audio/ambience/*.mp3`
- `assets/audio/voice/*.mp3`
- `assets/audio/GENERATION_NOTES.json`

Scene art:

- Final game images: `assets/scenes/*.webp` (`960x600`, textless, 16:10)
- ChatGPT source/contact sheet: `assets/source/scenes-chatgpt-20260623/`

Result art:

- Final result images: `assets/results/*.webp` (`960x600`, textless, 16:10)
- ChatGPT source/contact sheet: `assets/source/results-chatgpt-20260623/`
- Result images are also embedded into generated share/download cards.

Production tracking posts to:

```text
https://berlinwalk-content-app.vercel.app/api/smile-event
```

Local previews do not send events by default. Add `?tracking=local` only while
the local Content Studio server is running and you intentionally want QA rows in
the Wix CMS collection.
