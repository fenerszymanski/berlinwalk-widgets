# wannsee-berlin — visual sources (internal, not public)

Selected 2026-07-21 from 13 downloaded Wikimedia Commons candidates (agent
shortlist of ~25, visually QA'd on `images/contact-sheet.jpg`). All licences
independently re-verified against the Commons API on 2026-07-21; raw responses
in `images/licence-verification.json`. Raw originals in `images/raw/`
(gitignored); optimized 1600px q86 masters in `images/optimized/`.

| Final file | Commons file | Author | Licence | Attribution |
|---|---|---|---|---|
| cover-strandbad-wannsee.jpg (COVER) | File:Strandkörbe im Strandbad Wannsee (13932250353).jpg | Steffen Zahn | CC BY 2.0 | required |
| wannsee-sailboats.jpg | File:Segeln auf dem Wannsee.jpg | Asif Masimov | CC BY-SA 4.0 | required |
| liebermann-garden.jpg | File:Liebermann-Villa - Blumengarten am Gärtnerhaus.JPG | Oursana | CC0 | no |
| wannsee-conference-house.jpg | File:Haus der Wannsee-Konferenz.jpg | Cederskjold | CC BY 4.0 | required |
| pfaueninsel-castle.jpg | File:Pfaueninsel Schloss.jpg | E-W | CC BY-SA 3.0 | required |
| pfaueninsel-peacock.jpg | File:Pfaueninsel-7723.jpg | Rainer Halama | CC BY-SA 4.0 | required |
| f10-ferry-wannsee.jpg | File:2018-08-07 DE Berlin-Steglitz-Zehlendorf, Großer Wannsee @ Ronnebypromenade, Wannsee 04810960 Linie F10 (49716829158).jpg | Paul Korecky | CC BY-SA 2.0 | required |

6 of 7 need attribution -> Image Credits block present in the publish body.
Commons URLs with parentheses percent-encoded per the known parser issue
(cover + F10 files).

## Rationale / rejections

- Cover = Strandkörbe: instantly readable Wannsee identity at card size;
  slightly overcast but bright and graphic. Sunny entrance-building shot
  (1a) rejected as cover: distant, flat, utilitarian.
- GHWK moody courtyard shot (5b) rejected: too dark for inline flow; sunny
  July 2024 garden facade (5a) chosen instead.
- A.Savin lido-from-lake (1c) rejected: April, bare trees. CC0 Nov 2021
  entrance (1d) rejected: leafless November.
- Regatta golden-hour (6a) rejected in favour of 6b: 6b reads clean summer
  blue; 6a hazy grey-gold.
- Pfaueninsel castle chosen from the Havel (2b, lush) over 2025 frontal (2a,
  portrait, paler sky). Peacock 3a full display over CC0 3b profile: stronger.
- Winter/scaffolding/aviary-fence candidates rejected on sight per shortlist.

## Raw candidate → download map

See `fetch-candidates.mjs`. Raws kept local only; rebuildable from the
`fullUrl` recorded in each `images/raw/<name>.json`.
