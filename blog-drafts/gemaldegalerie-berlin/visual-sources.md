# gemaldegalerie-berlin — visual sources (internal)

Selection: 25 candidates fetched from Wikimedia Commons (see
`images/candidates-meta.json` + `images/contact-sheet.jpg` and
`images/contact-sheet-2.jpg`, reviewed by eye). Raw files live in
`images/raw/` (gitignored); optimized masters (1600px long edge, JPEG q86) in
`images/optimized/`.

## Article images (7, all uploaded to Wix)

1. `01-cover-gemaldegalerie-room-vi.jpg` — COVER. "Paintings in the
   Gemäldegalerie, Berlin - Room VI 0.1.jpg", Oursana, CC0 1.0.
   https://commons.wikimedia.org/wiki/File:Paintings_in_the_Gem%C3%A4ldegalerie,_Berlin_-_Room_VI_0.1.jpg
   Rationale: big altarpiece + empty bench + glowing wall reads instantly as
   "grand old-masters museum, empty" at card size; embodies the article thesis.
2. `02-gemaldegalerie-room-41.jpg` — "Gemäldegalerie Berlin Raum 41 02
   2025.jpeg", Oursana, CC0 1.0 (2025 = current hang).
   https://commons.wikimedia.org/wiki/File:Gem%C3%A4ldegalerie_Berlin_Raum_41_02_2025.jpeg
3. `03-bruegel-dutch-proverbs.jpg` — Bruegel, The Dutch Proverbs, Google Art
   Project scan, PD-Art.
   https://commons.wikimedia.org/wiki/File:Pieter_Brueghel_the_Elder_-_The_Dutch_Proverbs_-_Google_Art_Project.jpg
4. `04-man-with-the-golden-helmet.jpg` — Circle of Rembrandt, Google Art
   Project scan, PD-Art.
   https://commons.wikimedia.org/wiki/File:Rembrandt_(circle)_-_The_Man_with_the_Golden_Helmet_-_Google_Art_Project.jpg
5. `05-kulturforum-entrance.jpg` — "Gemäldegalerie am Kulturforum
   Berlin.JPG", Oursana, CC0 1.0 (evening light, Kulturforum lettering).
   https://commons.wikimedia.org/wiki/File:Gem%C3%A4ldegalerie_am_Kulturforum_Berlin.JPG
6. `06-neue-nationalgalerie.jpg` — "New National Gallery (Neue
   Nationalgalerie), Berlin, Germany.jpg", Mandus70, CC BY-SA 4.0 (dusk, low
   angle; the only article image whose licence REQUIRES attribution).
   https://commons.wikimedia.org/wiki/File:New_National_Gallery_(Neue_Nationalgalerie),_Berlin,_Germany.jpg
7. `07-philharmonie.jpg` — "Berliner Philharmonie Tiergartenstraße
   Berlin.jpg", Singlespeedfahrer, CC0 1.0.
   https://commons.wikimedia.org/wiki/File:Berliner_Philharmonie_Tiergartenstra%C3%9Fe_Berlin.jpg

Article credits: one native default-closed disclosure listing ALL 7 images
(consistent with the 21-22 Jul posts), data in
`scripts/article-image-credits-20260721.mjs` under `gemaldegalerie-berlin`.

## Widget images (10, in `gemaldegalerie-highlights-walk/img/`, 760px q82)

All PD-Art reproductions of paintings whose artists died centuries ago; no
attribution legally required, so the widget carries no credit UI.

- vermeer-pearl-necklace.jpg — "Jan Vermeer van Delft - Young Woman with a
  Pearl Necklace - Google Art Project.jpg", PD.
- bruegel-proverbs.jpg — as article 03, PD.
- caravaggio-amor.jpg — "Caravaggio - Cupid as Victor - Google Art
  Project.jpg", PD.
- golden-helmet.jpg — as article 04, PD.
- holbein-gisze.jpg — "Hans Holbein the Younger - George Gisze - 1532.jpg", PD.
- cranach-fountain.jpg — "Lucas Cranach - Der Jungbrunnen (Gemäldegalerie
  Berlin).jpg", PD.
- van-eyck-madonna.jpg — "Jan van Eyck - The Madonna in the Church - Google
  Art Project.jpg", PD.
- raphael-terranuova.jpg — "Raffael 033.jpg" (Madonna Terranuova), PD.
- botticelli-venus.jpg — "Botticelli - Venus - Gemäldegalerie Berlin.jpg", PD.
- durer-holzschuher.jpg — "Albrecht Dürer 078.jpg" (Holzschuher portrait), PD.

## Rejected candidates (from contact sheets)

- "Le grand hall de la Gemäldegalerie" (Dalbéra, CC BY 2.0): original only
  1387px, below the 1600px master standard; would also have added a CC BY
  credit for a weaker file. Rejected.
- "Kulturforum.Berlin.2.jpg" / "Kulturforum.Berlin.Portal.jpg" (CC0): bleak
  empty-plaza grey-sky panoramas, weak editorially. Rejected.
- "Neue Nationalgalerie Berlin 2022-05-21 01/04" (CC0): mostly empty terrace,
  building unreadable at card size. Rejected for the Mandus70 dusk shot.
- "20220812 Berliner Philharmonie" (CC BY 4.0): building hidden behind trees
  with a car in the foreground. Rejected for the CC0 frontal shot.
- "19-11-01-Gemaeldegalerie-Berlin-RalfR DSF3932.jpg": strongest single-visitor
  hall shot but GFDL 1.2 only; licence unsuitable for this use. Rejected.
- Room XVIII 2025 CC0 shots: too sparse/white; Room 38/room 41 2022 fine but
  duplicative of chosen interiors. Rejected.
