# Visual sources - berlin-in-the-evening

Run `2026-08-22-1505-Europe-Berlin`. All six article images come from Wikimedia
Commons and all six require attribution, so the article carries one native Wix
`COLLAPSIBLE_LIST` disclosure titled `Image credits`, closed by default, inside
its own rich content. The widget and the `/tools/berlin-evening-cascade` page
carry no article-credit UI and no pointer to it.

Masters were resized to 1600px on the long edge at JPEG quality 86 before
upload. Raw downloads live in `images/raw/` and are gitignored; each can be
rebuilt from the source URL below.

| File | Subject | Author | Licence | Source |
|---|---|---|---|---|
| `01-cover-dom-spree.jpg` | Cover. Berlin Cathedral above the Spree at blue hour | Moahim | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:2019_-_Berliner_Dom_an_der_Spree.jpg |
| `02-alexanderplatz-blue-hour.jpg` | Alexanderplatz station and the TV Tower at blue hour | Lukas Beck | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Alexanderplatz_Blaue_Stunde.jpg |
| `03-dom-lustgarten-night.jpg` | Berlin Cathedral floodlit from the Lustgarten | Ansgar Koreng | CC BY-SA 3.0 DE | https://commons.wikimedia.org/wiki/File:Berliner_Dom_bei_Nacht,_150104,_ako.jpg |
| `04-brandenburg-gate-night.jpg` | Brandenburg Gate floodlit from Pariser Platz | DCB | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:2016-02-29_Brandenburger_Tor_by_DCB.jpg |
| `05-gendarmenmarkt-night.jpg` | Konzerthaus on Gendarmenmarkt floodlit | Ansgar Koreng | CC BY 3.0 DE | https://commons.wikimedia.org/wiki/File:150524_Konzerthaus_Berlin_%28Nacht%29.jpg |
| `06-oberbaumbruecke-night.jpg` | Oberbaumbruecke at night with light trails | Olad Aden | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:X-berg-Oberbaumbr%C3%BCcke.jpg |

The Gendarmenmarkt source URL contains parentheses and is percent-encoded, because
unencoded parentheses truncate in the blog markdown parser.

## Rejected

| Candidate | Why rejected |
|---|---|
| `Berlin Cathedral at night from the Friedrichsbruecke 01.jpg` | The exact viewpoint the article recommends, but muddy and dark at 1600px, with bare trees and a cluttered foreground. Dropped so the set keeps only two cathedral shots. |
| `Berliner Dom at night 2021-01-17 03.jpg` | Good exposure, but a large illuminated advertising screen sits at the right edge and dates the frame. |
| `Sala de Conciertos, Berlin, 2016-04-22, DD 22-24 HDR.jpg` | Gendarmenmarkt lit pink and purple for an event. Event-specific lighting misrepresents a normal evening. |
| `20150307 Blick von der Oberbaumbruecke bei Nacht by sebaso.jpg` | A river view from the bridge rather than the bridge itself; the towers are what make the location readable. |
| `Reichstagsgebaeude mit Weihnachtsbaum bei Nacht, 151223, ako.jpg` | Strong image, but the Christmas tree makes it season-bound on an evergreen page. |

## Contact sheet

`contact-sheet.jpg` in this folder shows the six final images at the sizes and
crops used. Every one was viewed before the package was called ready.

## Tool icon

The `/tools/berlin-evening-cascade` icon follows the fixed BerlinTools glossy 3D
app-icon family. The prompt is recorded at
`tools-home/icons/_src/berlin-evening-cascade-icon-20260822-prompt.md` and the
untouched square source at
`tools-home/icons/_src/berlin-evening-cascade-raw-20260822.png` (1254x1254 RGBA).
Canonical 512 and 160 crops are `tools-home/icons/berlin-evening-cascade.png`
and `-160.png`; the 512 is uploaded to Wix Media as
`5a08a3_e951d5cc54c142d89715fdcc99e36beb~mv2.png` and the uploaded bytes were
SHA-256 verified against the local file.
