# Telling Time in German — visual sources

All seven images are Wikimedia Commons files, licence-verified against each file
page on 2026-07-25. Raw originals live in `images/raw/` (gitignored); the
committed masters in `images/optimized/` are 1600px on the long edge at JPEG
quality 86. Rebuild any raw from the direct URL in `images/manifest.json`.

German freedom of panorama (§59 UrhG) is what makes the Weltzeituhr and the
Binninger Berlin-Uhr photographs reusable; the photographer credit stays intact
in the article's own `Image credits` disclosure.

## Used

| Role in article | File | Author | Licence |
|---|---|---|---|
| Cover + top of body | `cover-weltzeituhr-alexanderplatz.jpg` | Joe Mabel | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| Spoken-forms section | `station-platform-clock.jpg` | Sebastian Rittau | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| 24-hour section | `station-departure-board-24-hour.jpg` | Falk2 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| 24-hour section, Berlin countdown | `bvg-daisy-countdown-alexanderplatz.jpg` | Geoprofi Lars | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| Day-codes section | `opening-hours-sign-uhr.jpg` | Mateus2019 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| Two-clocks section | `berlin-uhr-mengenlehreuhr.jpg` | Fred Romero | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) |
| Two-clocks section, lit | `berlin-uhr-lit-at-night.jpg` | Morn | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |

Source page URLs are in `images/manifest.json` and are reproduced in the
article's native `Image credits` disclosure. All seven require attribution, so
that disclosure is mandatory for this post.

## Why each one

- **Cover, Weltzeituhr (Joe Mabel).** The whole clock plus the armillary globe,
  centred against blue sky, hour band legible, and no people in frame. The
  cleanest full-object shot on Commons and the only Weltzeituhr candidate that
  survives a card crop. It also anchors the post to Alexanderplatz, where the
  tour starts.
- **Platform clock (Rittau).** White dial under the Lichtenrade canopy against a
  deep blue dusk sky. High resolution, no clutter, instantly readable at card
  size, and it makes the article's point visually: the hands are universal, the
  words are not. Attribution-only licence.
- **Departure board (Falk2).** The only Commons board photograph that shows a
  large, crisp evening 24-hour time (`19:17`). Not Berlin (Neuss), so the alt
  text and caption say "a German platform display", never Berlin.
- **BVG countdown (Geoprofi Lars).** Real Berlin, U5 at Alexanderplatz, amber on
  black, `in 1 min` / `in 3 min` fully legible. Added deliberately so the
  24-hour section has a Berlin image alongside the non-Berlin board, and because
  the countdown convention is a genuine local exception worth showing.
- **Opening-hours plaque (Mateus2019).** Fully legible `Öffnungszeiten / Mi bis
  So 10.00 - 18.00 / Mo und Di geschlossen`, which is exactly the day-code
  lesson. A Munich museum, so the caption says "a German museum plaque" and uses
  the engraved English half as the reason Berlin doors are harder.
- **Berlin-Uhr, Europa-Center (Fred Romero).** The strongest photograph of the
  object and correctly located for the article text. All four rows and the
  seconds lamp are visible, and the lit/unlit difference is faintly readable
  even in daylight.
- **Berlin-Uhr at night (Morn).** Chosen as the second Berlin-Uhr image because
  it is the only one where the illuminated fields genuinely glow, which is what
  the reading instructions describe. Cropped framing is mostly black, which
  works here as a deliberate contrast to the daylight shot. The file description
  gives 22:59 and notes two dead bulbs, so the caption deliberately does not
  state a time.

## Rejected

- `Weltzeituhr171.jpg` (Icodense, CC BY-SA 4.0): the 17-24 hour band is
  thematically perfect, but a dense crowd with resolvable faces runs along the
  bottom edge and the sky is flat overcast.
- `Relógio Berlim.jpg` (Joseolgon, CC BY-SA 4.0): readable city names, but the
  globe is clipped by the frame and an advertising sign plus a red crane arm sit
  in the bottom right.
- `Berlin - World Time Clock - 20180422175621.jpg`, `Alexanderplatz, 2024
  (01).jpg`: wall-to-wall identifiable faces.
- `Mengenlehreuhr.jpg` (Muritatis, public domain): the lit fields are readable,
  but the background is a cluttered office window with orchids, grey panels and
  the edge of a car, and it is only 1822px wide.
- `Ostbahnhof München, Abfahrten während des Streiks 2024-01-10, 1.jpeg`: the
  best teaching board on Commons, rejected because it was shot during the
  January 2024 GDL strike and three rows carry red cancellation notices. Strike
  and event-specific images are out under the project image rule.
- `100_1874 Berlin Alexanderplatz.jpg`: charming 2006 split-flap board at
  Alexanderplatz, but those boards are long gone and the time shown (6:53) does
  not demonstrate the 24-hour clock.
- `Zugzielanzeiger (37533711502).jpg` (Berlin-Lichtenberg): clean and Berlin, but
  `08:00` again fails the 24-hour demonstration.
- `Zugzielanzeige der Gleise 11 & 12 in Berlin Hbf (2026).jpg`: current Berlin
  Hbf, but shot from below and far away with roof girders dominating; times
  unreadable at blog size.
- `Netto Flörsheim-Dalsheim 3.jpg`: has `Mo - Sa 7 - 21 Uhr` in one frame, but it
  is a dark night phone snapshot dominated by a supermarket trademark.
- `Rathaus Marburg Öffnungszeiten.jpg`: three instances of `Uhr`, but full
  weekday names instead of the Mo/Di/Mi abbreviations the section teaches, plus a
  weathered background and an unrelated sticker.
- `Bahnhofsuhr grün.jpeg` and `Bahnhofsuhr Aarau.jpg`: Swiss, not German.
- `Mengenlehreuhr Berlin Neon Clock.jpg`: a DIY electronics replica on a desk,
  not the Berlin clock.
- `DAISY am Alexanderplatz (U5).jpg` and `(U2).jpg`: visible COVID-era face-mask
  scroll text, which would date the post.

## Contact sheet

`output/qa/telling-time-in-german-berlin/contact-sheet.jpg`, built by
`scripts/prepare-telling-time-images.py`. It was generated with all three
Berlin-Uhr candidates present so the cover and the Berlin-Uhr choice could be
judged side by side; the unused daylight candidate was deleted afterwards.
