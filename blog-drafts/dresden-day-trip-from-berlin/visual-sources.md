# Dresden day trip from Berlin — visual sources (2026-07-20)

50 candidates were pulled from Wikimedia Commons via the API
(`prop=imageinfo&iiprop=extmetadata|url|size`) across ten subjects, reviewed on
two local contact sheets (`images/contact-sheet-1.jpg`, `images/contact-sheet-2.jpg`),
and cut to 7. Full candidate table with verbatim licence strings:
`images/candidates.md`.

**Licences were re-verified independently against the Commons API before
selection**, not taken from the candidate notes. All seven matched exactly.
Machine-readable result: `images/licence-verification.json`.

Masters optimized to 1600px on the long edge at JPEG quality 86.
`images/raw/` is gitignored and stays local; each raw can be rebuilt from the
Commons file page below.

## Selected (7)

| File | Subject | Licence | Credit | Commons file page |
|---|---|---|---|---|
| `optimized/cover-dresden-neumarkt-frauenkirche.jpg` | **Cover.** The Neumarkt with the rebuilt Frauenkirche centred and baroque townhouses framing the square | Public domain | Ronny Kreutel - Kausalkette | https://commons.wikimedia.org/wiki/File:Frauenkirche-dresden.jpg |
| `optimized/02-dresden-hauptbahnhof-roof.jpg` | Dresden Hauptbahnhof platform hall under Foster's white membrane roof | CC BY-SA 4.0 | Lukas Beck | https://commons.wikimedia.org/wiki/File:15-08-2022_Dresden_Hauptbahnhof_01.jpg |
| `optimized/03-dresden-fuerstenzug.jpg` | The Fürstenzug, the Meissen porcelain tile mural on the Stallhof wall | CC BY-SA 2.0 | Dennis G. Jarvis | https://commons.wikimedia.org/wiki/File:Germany-04237_-_Procession_of_Princes_(30047622460).jpg |
| `optimized/04-dresden-zwinger-courtyard.jpg` | The Zwinger courtyard with its parterre, fountains and visitors | CC BY-SA 3.0 | WoodChuckNorris | https://commons.wikimedia.org/wiki/File:Dresden_Zwinger_Innenhof.JPG |
| `optimized/05-dresden-frauenkirche-interior.jpg` | The pale pink, green and gold interior of the Frauenkirche | CC BY-SA 3.0 | CEphoto, Uwe Aranas | https://commons.wikimedia.org/wiki/File:Dresden_Germany_Interior-of-Frauenkirche-08.jpg |
| `optimized/06-dresden-semperoper-theaterplatz.jpg` | The Semperoper on Theaterplatz with the King Johann monument | Public domain | Ronny Kreutel - Kausalkette | https://commons.wikimedia.org/wiki/File:Semperoper-dresden.jpg |
| `optimized/07-dresden-bruehlsche-terrasse.jpg` | The Freitreppe steps up to the Brühlsche Terrasse with visitors | CC BY 3.0 | Andreas Praefcke | https://commons.wikimedia.org/wiki/File:Dresden_Br%C3%BChlsche_Terrassen_Freitreppe_2012.jpg |

Two of the seven are public domain and need no attribution. **Five are CC BY or
CC BY-SA, so the post carries an Image Credits block** naming those five only.

Note for the body: the Fürstenzug Commons URL contains parentheses, which the
blog markdown parser truncates, so it is percent-encoded as `%28...%29` in the
publish body.

## Cover reasoning

The obvious cover for a Dresden post is the "Canaletto view", the Altstadt
skyline seen across the Elbe. **That pool was checked three separate ways and
rejected.** Commons' coverage of that specific panorama is dominated by 2006 and
2013 flood documentation, night shots, historic plates and heavily tree-framed
versions. Using a flood photograph as the cover of a day-trip guide would be
both visually drab and quietly misleading about what a visitor sees.

The Neumarkt frame is the stronger editorial asset anyway: the Frauenkirche is
centred, the rebuilt baroque houses frame it almost symmetrically, there is real
cumulus rather than blown white sky, and people are in it at human scale. It
reads instantly at listing-card size and it is public domain.

It was cropped before optimizing: the right edge and the bottom were trimmed to
about 90% and 76% of the original, which removed most of a row of parked
delivery vans at the right and a large empty expanse of foreground cobbles. The
composition after the crop is tighter and the church fills more of the frame.

## Rejected, with reasons

- `canaletto-01`, `canaletto-03`, `canaletto-04` — all three are Elbe flood
  documentation. Event-specific and misleading for a visitor guide.
- `canaletto-02` — flat grey light, dead sky, skyline barely reads.
- `canaletto-05` — the only usable daylight Canaletto view, but a soft 2012
  file with a signpost intruding at centre-left. Kept as the fallback that was
  not needed.
- `semperoper-03` — strong blue sky but obviously heavily HDR-processed, with
  haloed edges and oversaturation, and the monument blocks the facade centre.
  Rejected on the processing alone; `semperoper-01` is the cleaner frame.
- `semperoper-02` — lively, but the sky is blown to featureless white and the
  horizon is noticeably off-level.
- `semperoper-04` — opera house small in frame, flat light, reads as a
  documentation snapshot.
- `hauptbahnhof-05` — good human scale but noticeably dim and flat next to
  `hauptbahnhof-02`.
- `frauenkirche-03` — night shot, wrong register for a day-trip guide.
- `bruehlsche-04` — photographs a temporary "Liebe" installation rather than the
  permanent terrace, so the freedom-of-panorama exception does not cleanly cover
  it and the subject is transient. Dropped.
- **All five `kunsthof-*` images — dropped on rights grounds.** The
  Kunsthofpassage facade artworks are still in copyright, and German freedom of
  panorama covers works on public ways and squares. These are semi-private
  courtyards reached through a passage, which is exactly the borderline the
  exception does not clearly cover. The Neustadt is discussed in the article
  text instead, with no image.
- One GFDL-1.2-only file surfaced during sourcing and was rejected as not
  practically reusable.

## Image quality gate

All seven were judged on the contact sheets at thumbnail size before selection,
and the cover was additionally reviewed full-size after cropping. No image was
accepted merely because it was legally usable.
