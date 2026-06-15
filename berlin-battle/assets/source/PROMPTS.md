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

## District / Museum / Night Card Sprite Sheets

Added 2026-06-15 for the three new playable Berlin Battle modes. Generated in
Yusuf's logged-in ChatGPT session through the Codex in-app browser. No paid API,
Gemini, OpenAI image API, Sora, Veo, or Content Studio paid image channel was
used.

Finished source sheets:

- `berlin-districts-battle-sheet-chatgpt-20260615.png`
- `berlin-museums-battle-sheet-chatgpt-20260615.png`
- `berlin-night-battle-sheet-chatgpt-20260615.png`

Contact sheets:

- `berlin-districts-battle-contact-sheet-chatgpt-20260615.jpg`
- `berlin-museums-battle-contact-sheet-chatgpt-20260615.jpg`
- `berlin-night-battle-contact-sheet-chatgpt-20260615.jpg`
- `berlin-night-battle-contact-sheet-chatgpt-20260615-compare.jpg` records the rejected alternate night sheet beside the chosen one.

The sheets were cropped into:

- `../cards/districts/*.webp`
- `../cards/museums/*.webp`
- `../cards/night/*.webp`

District prompt:

```text
Create one image: a clean 4x4 sprite sheet of 16 separate Berlin neighborhood game-card artworks for BerlinWalk "Berlin District Battle".

Use case: website game card images. Style: appetizing premium travel-game illustration, not flat icons, not UI icons. Polished semi-realistic editorial illustration / game cover art, consistent lighting and style across all cells.

Format and composition: exact 4 by 4 grid, equal square cells, one centered scene/object per cell, clear separation between cells, generous crop-safe margins. Each cell must work when cropped to a 640x640 square card. No overlapping between cells.

Brand palette: deep BerlinWalk green #1B5E20, bright yellow #FFE600, lime #7CB342, cream #FAFAF5, white highlights, tiny Berlin red #E63946 only as an accent. Use rich Berlin street / architecture / city textures, soft depth, playful versus-game energy, subtle glow rings or particles.

Cells in exact order left-to-right, top-to-bottom:
1 Mitte: TV Tower / Museum Island / central landmark mood
2 Kreuzberg: canal bridge, street-art wall, food-market energy
3 Friedrichshain: East Side Gallery / warehouse nightlife / tram energy
4 Neukölln: market street, canal, multicultural cafe mood
5 Prenzlauer Berg: leafy street, old apartment facade, Sunday market mood
6 Charlottenburg: elegant old-west avenue, palace garden mood
7 Schöneberg: queer history, neighborhood square, warm nightlife mood
8 Wedding: canal, gritty brick, underrated local Berlin mood
9 Moabit: island neighborhood, market hall, railway/river hints
10 Tiergarten: big park, paths, monument silhouettes
11 Tempelhof: airport runway park, huge sky, kites
12 Köpenick: water, old town, castle-like riverside mood
13 Spandau: citadel, old streets, western edge mood
14 Pankow: leafy villa street, quiet north Berlin mood
15 Lichtenberg: tram lines, east Berlin residential texture
16 Treptow: river park, boats, after-work green space

Text constraints: no text, no labels, no letters, no numbers, no logos, no watermark, no fake signage. Do not put neighborhood names in the image.

Output only the final 4x4 image sheet.
```

Museum prompt:

```text
Create one image: a clean 4x4 sprite sheet of 16 separate Berlin museum game-card artworks for BerlinWalk "Berlin Museum Battle".

Use case: website game card images. Style: premium travel-game illustration, polished semi-realistic editorial / cinematic concept art, not flat icons, not UI icons. Consistent lighting and style across all cells.

Format and composition: exact 4 by 4 grid, equal square cells, one centered museum scene or artifact per cell, clear separation between cells, generous crop-safe margins. Each cell must work when cropped to a 640x640 square card. No overlapping between cells.

Brand palette: deep BerlinWalk green #1B5E20, bright yellow #FFE600, lime #7CB342, cream #FAFAF5, white highlights, tiny Berlin red #E63946 only as an accent. Use museum interiors, architecture details, artifacts, frames, tickets, columns, soft spotlight, subtle glow rings or game-particles. It should feel like a coherent BerlinWalk Games family.

Cells in exact order left-to-right, top-to-bottom:
1 Neues Museum: ancient Egyptian atmosphere, rebuilt museum architecture, elegant bust-like silhouette but not a direct copy of a real artifact
2 Altes Museum: classical columns, rotunda, calm antiquity mood
3 Alte Nationalgalerie: old master painting gallery, grand staircase / framed art mood
4 Bode-Museum: dome, sculpture hall, river-island museum mood
5 Humboldt Forum: palace facade details, global collection objects, central Berlin mood
6 Jewish Museum Berlin: angular zinc-like architecture, memory, zigzag geometry, respectful abstract mood
7 Berlinische Galerie: modern Berlin art, photography, city identity, clean white gallery
8 Hamburger Bahnhof: contemporary art in former railway station, large hall
9 Gemäldegalerie: old master paintings, warm frame, quiet gallery
10 DDR Museum: everyday objects, retro East German apartment details, interactive history mood
11 Topography of Terror: documentary panels, sober archive wall, respectful and non-sensational
12 Museum für Naturkunde: dinosaur skeleton, fossils, science hall
13 Deutsches Technikmuseum: plane, train, machine hall, engineering mood
14 Futurium: futuristic orb, clean architecture, what-if energy
15 Urban Nation: street-art museum, mural wall, bold contemporary color
16 Museum for Communication: envelopes, signals, media history, playful connection mood

Text constraints: no text, no labels, no letters, no numbers, no logos, no watermark, no fake signage. Do not put museum names in the image.

Output only the final 4x4 image sheet.
```

Night prompt:

```text
Create one image: a clean 4x4 sprite sheet of 16 separate Berlin nightlife game-card artworks for BerlinWalk "Berlin Night Battle".

Use case: website game card images. Style: premium travel-game / nightlife-game illustration, polished cinematic semi-realistic concept art, not flat icons, not UI icons. Consistent lighting and style across all cells.

Format and composition: exact 4 by 4 grid, equal square cells, one centered scene/mood per cell, clear separation between cells, generous crop-safe margins. Each cell must work when cropped to a 640x640 square card. No overlapping between cells.

Important: this is a mood battle, not official club rankings. Do not show real club logos or real venue names.

Brand palette: deep BerlinWalk green #1B5E20, bright yellow #FFE600, lime #7CB342, cream #FAFAF5, white highlights, tiny Berlin red #E63946 only as an accent. Use Berlin night textures, neon green/yellow glow, soft cinematic depth, dancefloor haze, street corners, riverside reflections, subtle glow rings or game particles. Premium and playful, not sleazy.

Cells in exact order left-to-right, top-to-bottom:
1 Techno Warehouse: dark industrial room, speaker stacks, yellow-green lights, no logo
2 Riverside Club: river reflection, club lights, boat/bridge mood
3 Queer Dancefloor: expressive inclusive dancefloor, rainbow light accents, no flags with text
4 Punk Show: small stage, guitar, rough basement energy
5 Jazz Cellar: saxophone, low light, close tables
6 Open-Air Rave: summer night, moon, park edge, small stage lights
7 Karaoke Bar: microphone, small room, playful friends energy
8 Kneipe Crawl: cozy local pub, wooden table, beer glasses
9 Späti Corner: late-night corner shop mood, bottles, pavement talk, no readable signs
10 Cocktail Bar: elegant glass, dim lights, green/yellow reflections
11 Rooftop Sunset: city skyline, sunset, rooftop drink mood
12 Comedy Night: small spotlight stage, microphone, basement comedy club
13 Late Döner Stop: glowing snack counter, wrap, night street, no readable signs
14 Night Bus Ride: yellow Berlin-style bus mood, window reflections, late route home
15 Gallery Opening: white-wall art space, night crowd, small glasses, contemporary art
16 Afterhours Breakfast: coffee, pastry, early daylight after a long night

Text constraints: no text, no labels, no letters, no numbers, no logos, no watermark, no readable signage. Do not put item names in the image.

Output only the final 4x4 image sheet.
```

## High-Resolution 2x2 Card Replacements

Added 2026-06-15 after live desktop QA showed the 4x4 sprite-sheet crops were
too soft when the game cards were enlarged. Yusuf asked to generate fewer images
per prompt directly in the logged-in ChatGPT browser session. No paid API,
Gemini, OpenAI image API, Sora, Veo, or Content Studio paid image channel was
used.

Source folder:

- `highres-batches/`

Generation format:

- 16 total 2x2 sheets, 4 images per sheet.
- Source sheet size from ChatGPT was `1254x1254`, giving about `627x627` source
  pixels per card before the final `640x640` WebP export.
- Finished card paths stayed the same so `data.json` did not need item-image
  rewiring; the game now appends the `data.json` version to image URLs for cache
  busting.

Reusable prompt shell:

```text
Create one image: a clean 2x2 sprite sheet of 4 separate BerlinWalk "[MODE]" game-card artworks.

Use case: website this-or-that battle card images. Style: premium polished semi-realistic editorial illustration / photo-illustration hybrid, appetizing or atmospheric as appropriate, consistent lighting and style across all four cells.

Format and composition: exact 2 by 2 grid, equal square cells, one centered subject per cell, clear separation between cells, generous crop-safe margins. Each cell must work when cropped to a 640x640 square card. No overlapping between cells.

Brand palette: deep BerlinWalk green #1B5E20, bright yellow #FFE600, lime #7CB342, cream #FAFAF5, white highlights, tiny Berlin red #E63946 only as a small accent. Add subtle travel-game energy: glow rings, soft particles, depth, polished lighting.

Mode direction: [MODE-SPECIFIC DIRECTION]

Cells in exact order left-to-right, top-to-bottom:
1 [ITEM 1]
2 [ITEM 2]
3 [ITEM 3]
4 [ITEM 4]

Text constraints: no text, no labels, no letters, no numbers, no logos, no watermark, no readable signage. Do not put item names in the image.

Output only the final 2x2 image sheet.
```

Batch order:

- Food 1: Currywurst; Döner Kebab; Falafel; Shawarma.
- Food 2: Schnitzel; Pretzel; Berliner Pfannkuchen; Boulette.
- Food 3: Kartoffelpuffer; Eisbein; Käsekuchen; Apfelstrudel.
- Food 4: Lahmacun; Vietnamese Pho; Späti Snack Run; Berliner Weiße. Source file
  uses the `food-batch-4-corrected-...` name because the first attempt repeated
  the previous food batch and was discarded.
- District 1: Mitte; Kreuzberg; Friedrichshain; Neukölln.
- District 2: Prenzlauer Berg; Charlottenburg; Schöneberg; Wedding.
- District 3: Moabit; Tiergarten; Tempelhof; Köpenick.
- District 4: Spandau; Pankow; Lichtenberg; Treptow.
- Museum 1: Neues Museum; Altes Museum; Alte Nationalgalerie; Bode-Museum.
- Museum 2: Humboldt Forum; Jewish Museum Berlin; Berlinische Galerie; Hamburger Bahnhof.
- Museum 3: Gemäldegalerie; DDR Museum; Topography of Terror; Museum für Naturkunde.
- Museum 4: Deutsches Technikmuseum; Futurium; Urban Nation; Museum for Communication.
- Night 1: Techno Warehouse; Riverside Club; Queer Dancefloor; Punk Show.
- Night 2: Jazz Cellar; Open-Air Rave; Karaoke Bar; Kneipe Crawl.
- Night 3: Späti Corner; Cocktail Bar; Rooftop Sunset; Comedy Night.
- Night 4: Late Döner Stop; Night Bus Ride; Gallery Opening; Afterhours Breakfast.

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
