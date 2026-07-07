# Visual sources — jaywalking-in-berlin

All five images are real photographs from Wikimedia Commons, license-verified via the
Commons API (`action=query&prop=imageinfo&iiprop=url|size|extmetadata`), not scraped
from category page HTML. Downloaded to `raw/`, reoriented/optimized to `optimized/`
(max 1600px longest side, JPEG quality 82).

## 1. Cover — Ampelmann shop, Karl-Liebknecht-Straße
- File: `optimized/05-jaywalking-ampelmann-shop-cover.jpg`
- Source: https://commons.wikimedia.org/wiki/File:Ampelmann_Shop_Karl-Liebknecht_Strasse_2013-11-24.jpg
- Photographer: Slaunger
- License: CC BY-SA 3.0
- Rationale: colorful, instantly reads as the topic, real people, real location a few minutes from the BerlinWalk route. Selected as featured/cover image (editorial bar: intentional, topic-specific, works at card size).

## 2. Kurfürstendamm pedestrian signal (in-article, near intro)
- File: `optimized/04-jaywalking-kudamm-signal-cover.jpg`
- Source: https://commons.wikimedia.org/wiki/File:Fu%C3%9Fg%C3%A4ngerampel_Kurf%C3%BCrstendamm_Leibnizstr.jpg
- Photographer: A.fiedler
- License: CC BY-SA 3.0
- Note: original file had EXIF orientation requiring a 90-degree clockwise rotation; corrected and verified visually before use.
- Rationale: real red-signal-in-context photo with the striped countdown-style signal head, shows a real Berlin street corner.

## 3. Zebrastreifen, Eberstraße
- File: `optimized/03-jaywalking-zebra-crossing.jpg`
- Source: https://commons.wikimedia.org/wiki/File:Zebrastreifen_Eberstra%C3%9Fe_Berlin_am_26._Mai_2022_A.jpg
- Photographer: IgorCalzone1
- License: CC BY-SA 4.0
- Rationale: illustrates the zebra-crossing-vs-signal distinction explained in the article body.

## 4. Pedestrians waiting at a Berlin crossing (in-article, "why Berliners wait")
- File: `optimized/06-jaywalking-pedestrians-waiting.jpg`
- Source: https://commons.wikimedia.org/wiki/File:Crossroads_Waiting_(43990780).jpeg
- Photographer: Sascha Kohlmann
- License: CC BY-SA 3.0
- Rationale: shows real people standing at the curb of a Berlin crossing, waiting to cross. This is the literal core scene of the article (Berliners waiting even with a clear road), so it is the single most on-theme image in the set. Placed in the "why Berliners wait" section.
- 2026-07-07 REPLACEMENT: this image replaced the previous `02-jaywalking-red-green-explainer.jpg` (a maintenance technician in an orange hi-vis jacket adjusting a signal head, `File:Ampelmännchen_rot_Ampelmännchen_grün_Mensch.JPG` by Frze, CC BY-SA 3.0). Yusuf rejected that image: the worker and hi-vis jacket dominate the frame and the shot is about signal maintenance, not crossing/pedestrian rules — off-topic for a jaywalking article. The old raw/optimized `02-*` files remain on disk but are no longer referenced by the body or Image Credits.

## 5. Green Ampelmann signal (near Potsdamer Platz)
- File: `optimized/01-jaywalking-green-man-signal.jpg`
- Source: https://commons.wikimedia.org/wiki/File:Ampelm%C3%A4nnchen_en_un_sem%C3%A1foro_de_Potsdamer_Platz.jpg
- Photographer: Luisalvaz
- License: CC BY-SA 4.0
- Rationale: close, clean shot of the lit green walking figure; captioned generically (not claiming a recognizable Potsdamer Platz landmark view, since the crop is a close-up of the signal only).

## Rejected candidates
- `Ampelmaenner.jpg` (Wikimedia) — too low resolution (315x231) for article use.
- `East Berlin traffic lights.jpg` — too low resolution (319x196) for article use.
- Several `Ampelmännchen in Duisburg` files — real but not Berlin, rejected for location accuracy.

## AI-assisted visuals (internal note only — do not leak into public copy)
- Widget hero illustration and the BerlinTools icon for `berlin-crosswalk-standoff` were generated via the Gemini API (`gemini-3-pro-image-preview`, `GEMINI_API_KEY`), the project's approved non-paid image workflow. No paid image API and no CLI-only generator outside this approved path was used. Prompts and outputs are saved under `berlinwalk-widgets/berlin-crosswalk-standoff/assets/source/` and `tools-home/icons/_src/`.
