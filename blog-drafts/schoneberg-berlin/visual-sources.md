# Schöneberg Berlin — visual sources (2026-07-20)

45 candidates were pulled from Wikimedia Commons via the API (`prop=imageinfo&iiprop=extmetadata`),
reviewed on a local contact sheet (`images/contact-sheet.jpg`), and cut to 7.
Full candidate table with verbatim license strings: `images/candidates.md`.

**Licenses were re-verified independently against the Commons API before selection**,
not taken from the candidate notes. All seven results matched.

Masters optimized to 1600px on the long edge at JPEG quality 86.
`images/raw/` is gitignored and stays local; each raw can be rebuilt from the
Commons file page below.

## Selected (7)

| File | Subject | License | Credit | Commons file page |
|---|---|---|---|---|
| `optimized/cover-schoneberg-winterfeldtmarkt.jpg` | **Cover.** Winterfeldtmarkt: cheese and egg stall, stallholder serving, Apostel-Paulus-Kirche tower behind | CC BY-SA 3.0 | Manfred Brueckels | https://commons.wikimedia.org/wiki/File:Berlin_Winterfeldplatz_1.jpg |
| `optimized/02-schoneberg-bowie-plaque-hauptstrasse-155.jpg` | The Berliner Gedenktafel for David Bowie at Hauptstraße 155 | CC BY-SA 3.0 | OTFW, Berlin | https://commons.wikimedia.org/wiki/File:Berliner_Gedenktafel_Hauptstr_155_%28Sch%C3%B6n%29_David_Bowie.jpg |
| `optimized/03-schoneberg-pink-triangle-nollendorfplatz.jpg` | The pink triangle memorial at Nollendorfplatz U-Bahn station | CC BY-SA 3.0 | Manfred Brueckels | https://commons.wikimedia.org/wiki/File:Gedenktafel_Rosa_Winkel_Nollendorfplatz.jpg |
| `optimized/04-schoneberg-bayerisches-viertel-sign.jpg` | An *Orte des Erinnerns* sign in the Bayerisches Viertel, the school-transport decree of 24.3.1942 | CC BY-SA 3.0 | Manfred Brueckels | https://commons.wikimedia.org/wiki/File:Bayerisches_Viertel_Erinnern_Schulweg.jpg |
| `optimized/05-schoneberg-rathaus-schoneberg.jpg` | Rathaus Schöneberg with its 70 metre bell tower | CC BY-SA 4.0 | Palickap | https://commons.wikimedia.org/wiki/File:Berlin%2C_Rathaus_Sch%C3%B6neberg.jpg |
| `optimized/06-schoneberg-koenigskolonnaden-kleistpark.jpg` | The Königskolonnaden at the entrance to Heinrich-von-Kleist-Park | CC BY-SA 4.0 | Palickap | https://commons.wikimedia.org/wiki/File:Berlin%2C_K%C3%B6nigskolonnaden.jpg |
| `optimized/07-schoneberg-marlene-dietrich-grave.jpg` | Marlene Dietrich's grave, Friedhof Stubenrauchstraße | CC BY-SA 4.0 | Babewyn | https://commons.wikimedia.org/wiki/File:Marlene_dietrich_grab_2020-04-23.png |

All seven are CC BY-SA, so **every one requires attribution** and the post carries
an Image Credits block.

### Extra rights note on the Bayerisches Viertel sign

`04-schoneberg-bayerisches-viertel-sign.jpg` photographs an artwork that is
itself still in copyright: *Orte des Erinnerns im Bayerischen Viertel* by
**Renata Stih and Frieder Schnock** (1993). Commons hosts the photograph under
German freedom of panorama, which covers the photo but not the underlying work,
so the credit line names the artists alongside the photographer.

## Cover reasoning

Winterfeldtmarkt was the right cover because it is the one thing in Schöneberg
that is unambiguously worth planning a morning around, and it reads instantly at
listing-card size: awnings, produce, a stallholder, customers. The
Apostel-Paulus-Kirche tower in the background gives it a real place identity
rather than "a generic German market".

`winterfeldtmarkt-01` (autumn aisle, good depth) was the runner-up and is the
better *atmosphere* shot, but it was passed over because the produce-forward
frame says "market" faster in a crop, and the 2020 file shows pandemic-era
details that date it.

## Rejected, with reasons

- `bowie-02` — the doorway buried in flowers and candles after Bowie's death in
  January 2016. Powerful, but it is a specific mourning moment and it directly
  contradicts this article's point, which is that on a normal day there is
  nothing here but a plaque on a lived-in building.
- `bowie-05` — the Aladdin Sane bust. Striking, but it is a separate fan artwork
  with its own copyright layer, and it is not the plaque the article is about.
- `bayerischesviertel-01` — the printed overview map/poster, not one of the
  actual street signs. Misleading as an illustration of the memorial.
- `winterfeldtmarkt-02` — the empty square with no market on it.
- `nollendorfplatz-01` / `-03` — the rainbow-lit station dome. Both are excellent
  images, but the lighting is Pride decoration and the published
  [Berlin Pride 2026 post](https://www.berlinwalk.com/post/berlin-pride-csd-2026)
  already owns the Regenbogenkiez visual territory. Reusing it here would blur
  two posts together.
- `nollendorfplatz-02` — a generic yellow U-Bahn train; the station is not
  identifiable.
- `gasometer-04` — drab derelict foreground.
- `apostelpaulus-02` — sky-only background, no context.
- `rathaus-03` / `-04` — tower cropped or too small in frame.
- `kleistpark-03` — the Kammergericht sits small behind a wide lawn.
- `dietrichgrave-03` — flat overhead angle.
- `bowie-04` — subject too small in the frame.
- Roughly 25 further candidates were weak, cluttered, or only loosely related.

## Not found

- **The Freiheitsglocke in situ.** Only a close-up of the bell itself
  (`rathaus-05`) exists on Commons; nothing shows it hanging in the tower.
- **The Kammergericht in its Volksgerichtshof context.** Only plain modern
  exteriors, so the article carries that history in text rather than an image.
- **A wide shot of the whole Winterfeldtmarkt at once.**

## Tooling note

ImageMagick is not installed on this machine. The contact sheet was built with
Python PIL, and resizing/optimization used the macOS `sips` binary.
