# Berlin Battle Generated Asset Notes

Generated with the built-in ChatGPT/Codex image generation tool on 2026-06-14.
No paid API fallback was used.

## Food Card Sprite Sheet

Source file:

- `berlin-food-battle-sheet-chatgpt.png`

Prompt:

```text
Use case: ads-marketing
Asset type: website game card image sprite sheet for BerlinWalk Berlin Food Battle
Primary request: Create one clean 4x4 sprite sheet of 16 separate appetizing Berlin street-food card images, in this exact order left-to-right, top-to-bottom: Currywurst, Döner Kebab, Falafel, Shawarma, Schnitzel, Pretzel, Berliner Pfannkuchen, Boulette, Kartoffelpuffer, Eisbein, Käsekuchen, Apfelstrudel, Lahmacun, Vietnamese Pho, Späti Snack Run, Berliner Weisse.
Scene/backdrop: Berlin street-food mood, simple editorial food styling, warm daylight, subtle hints of Berlin without landmarks dominating.
Style/medium: polished semi-realistic editorial food illustration / photo-illustration hybrid, consistent style across all 16 cells.
Composition/framing: exact 4 by 4 grid, equal square cells, one centered food subject per cell, no overlapping between cells, slight padding inside each cell, visually crop-safe.
Color palette: BerlinWalk green #1B5E20, yellow #FFE600, cream #FAFAF5 as subtle accents; natural appetizing food colors.
Text: no text, no labels, no letters, no numbers.
Constraints: each cell must clearly represent the named food in the order listed; no visible brand logos, no watermark, no people, no hands, no typography. The grid should be easy to crop into 16 individual images.
```

The sheet was cropped into `assets/cards/*.webp` at 640x640.

## BerlinWalk Games Topic Cover Standard

Added 2026-06-14 after Yusuf's feedback on the opening Games cards.

Standard:

- Use one generated sprite sheet per game surface when possible so topic covers share one lighting/style family.
- Crop each topic cover to `16:10` landscape and save optimized `.webp` files at `960x600`.
- Store finished covers under `berlin-battle/assets/topics/`.
- Store the raw generated sheet and a small review contact sheet under `berlin-battle/assets/source/`.
- Visual language: premium playful game-cover art, dynamic but clean, BerlinWalk green/yellow/lime/cream palette, glow rings, VS energy, motion streaks or spark particles, soft depth, and clear Berlin/topic cues.
- Avoid text, letters, numbers, logos, watermarks, flat vector art, unrelated AI styles, black vignette backgrounds, and random photo sources mixed with generated game art.

Current source files:

- `berlin-games-topic-covers-sheet-20260614.png`
- `berlin-games-topic-covers-contact-sheet-20260614.jpg`

Current finished covers:

- `../topics/food-battle-cover.webp`
- `../topics/district-battle-cover.webp`
- `../topics/museum-battle-cover.webp`
- `../topics/night-battle-cover.webp`

Prompt:

```text
Create one 2x2 sprite sheet of four standardized website game cover images for BerlinWalk Games. Use case: stylized-concept. Asset type: responsive game topic card cover art, no text.

Overall style: polished playful game-cover art, dynamic but premium, BerlinWalk brand palette with deep green #1B5E20, bright yellow #FFE600, lime #7CB342, cream #FAFAF5, white highlights, tiny Berlin red only as a small accent. Add subtle game effects: glow rings, versus energy, motion streaks, spark particles, soft depth, cinematic studio lighting. Must feel like one coherent family, not four unrelated images. No visible words, no letters, no numbers, no logos, no watermarks, no UI buttons.

Composition: exact 2 by 2 grid, equal rectangular cells in landscape 16:10 ratio, each cell crop-safe with generous edge margin. Clear separation between cells. Each cell should work as a standalone card cover in a web grid.

Cells in exact order left-to-right, top-to-bottom:
1. Berlin Food Battle: appetizing Berlin street-food duel with stylized döner/currywurst/pretzel elements as game pieces, yellow-green energy burst, no brand logos.
2. Berlin District Battle: playful map-board battle of Berlin neighborhoods with colorful district tiles, mini landmarks, location pins, game-board energy.
3. Berlin Museum Battle: museum/culture battle with classical column, Pergamon/Museum Island mood, ticket/card artifacts, puzzle/game glow, not a real photo.
4. Berlin Night Battle: Berlin nightlife mood with disco ball, neon green/yellow glow, club lights, abstract dance-floor energy, no club logos.

Output only the final 2x2 image sheet. No labels or text inside the image.
```

## Berlin Battle Social / Featured Image

Added 2026-06-14 for the Wix `/games/berlin-battle` social share / featured image.

Final files:

- Source: `berlin-battle-social-og-source-20260614.png`
- Optimized social JPG: `../social/berlin-battle-social-1200x630.jpg`
- Optimized PNG backup: `../social/berlin-battle-social-1200x630.png`
- Wix Media: `5a08a3_4238f52e31c8461097da1d276ce6f8e4~mv2.jpg`
- Wix URL: `https://static.wixstatic.com/media/5a08a3_4238f52e31c8461097da1d276ce6f8e4~mv2.jpg`

Prompt:

```text
Use case: stylized-concept
Asset type: social share / featured image for a BerlinWalk Games page, Open Graph landscape crop, no text.
Primary request: Create a premium BerlinWalk "Berlin Battle" social image that communicates a multi-mode this-or-that game for visitors to Berlin.
Scene/backdrop: A playful Berlin game arena with four visual zones blending together: Berlin street food game pieces, a district map-board with pins, museum/culture artifacts, and nightlife/disco energy. The zones should feel like one dynamic game world, not a collage.
Subject: Centered versus-game energy with two or more abstract card/game pieces facing each other, glowing rings, sparks, motion streaks, subtle Berlin skyline cues such as TV Tower and Brandenburg Gate silhouettes, but not a literal tourist photo.
Style/medium: polished cinematic game-cover illustration, premium 3D/editorial concept art, same family as BerlinWalk Games cover art.
Composition/framing: wide 1.91:1 social share composition, crop-safe for 1200x630, strong focal center, readable at small social-preview size, no important details at extreme edges.
Lighting/mood: energetic but polished, green/yellow glow, soft depth, studio-quality highlights.
Color palette: BerlinWalk deep green #1B5E20, bright yellow #FFE600, lime #7CB342, cream #FAFAF5, white highlights, tiny Berlin red only as a small accent.
Text: no text, no labels, no letters, no numbers.
Constraints: no logos, no watermark, no UI screenshots, no flat vector art, no black vignette corners, no random real-photo collage, no distorted typography. Must look like a high-quality featured/social image for a polished travel game page.
```

## BerlinTools Icon

Source files:

- `berlin-battle-icon-chatgpt.png`
- `../../tools-home/icons/_src/chatgpt-standard-20260612/berlin-battle-chatgpt.png`

Prompt:

```text
Use case: stylized-concept
Asset type: BerlinTools directory icon for a new BerlinWalk game called Berlin Battle
Primary request: A glossy 3D app-style icon matching the existing BerlinWalk BerlinTools icon family. Cream page background, rounded deep BerlinWalk green square tile, centered yellow medallion, and a playful tournament bracket / versus battle symbol made from two small food cards facing each other with a tiny trophy or lightning accent.
Style/medium: polished glossy 3D app icon, soft depth, clean readable at 64px.
Composition/framing: centered icon, square, generous padding, no text.
Color palette: BerlinWalk green #1B5E20, yellow #FFE600, lime #7CB342, cream #FAFAF5, tiny warm red accent only if useful.
Constraints: no words, no letters, no numbers, no people, no logos, no watermark, no black vignette corners, no flat vector look. Must feel like a member of the existing BerlinWalk glossy 3D tool icon set.
```
