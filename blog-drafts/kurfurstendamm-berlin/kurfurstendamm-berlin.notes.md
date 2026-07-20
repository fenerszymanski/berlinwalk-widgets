# Production notes — kurfurstendamm-berlin

Daily-blog run 3 of 2026-07-19 (Europe/Berlin). Internal notes only, never part
of the publish body.

## Topic choice and dedupe

Scanned 233 published Wix posts, 3 open drafts (`berlin-ubahn-etiquette`,
`is-berlin-walkable`, `oktoberfest-in-berlin` — the first two runs of the same
day), 150 tools-hub slugs and 307 local draft files.

Zero hits for `kurfürstendamm`, `kudamm`, `west berlin`, `savigny`,
`zoologischer` or `bikini` across every title. The only Charlottenburg post is
`charlottenburg-palace-berlin`, which is the palace and does not overlap. This
is a genuine gap: 233 posts and nothing on the main street of the western half
of the city.

Nearest neighbours, all linked from the body rather than repeated:
`kaiser-wilhelm-memorial-church-berlin`, `kadewe-berlin`,
`zoo-berlin-vs-tierpark-berlin`, `berlin-rooftop-bars`,
`how-berlin-was-divided-a-simple-guide-to-east-vs-west`,
`why-berlin-doesn-t-have-a-beautiful-old-town-and-why-that-s-the-point`,
`where-to-stay-in-berlin-best-neighborhoods-for-every-type-of-tourist`.

Focus keyword: `Kurfürstendamm Berlin`. Categories: Tourist Tips + Berlin
History (the post is half practical guide, half explanation of why West Berlin
needed a second downtown). Tourist Tips is by far the largest category at 178
posts, so Berlin History is carried as the balancing second category.

## Verified facts and sources

- Berlin's district walking route gives about 4.1 km from Wittenbergplatz to
  Rathenauplatz and 3.5 km for the Kurfürstendamm itself, which starts at
  Breitscheidplatz. The visitor recommendation is explicitly a combined axis:
  Wittenbergplatz to Uhlandstraße is about 1.3 to 1.4 km, but only the section
  west of Breitscheidplatz is Kurfürstendamm. Source:
  berlin.de/ba-charlottenburg-wilmersdorf/.../wanderwege/artikel.175350.php.
- Kaiser Wilhelm Memorial Church: entry is free; the new church normally lists
  daily 10:00–18:00. The tower Memorial Hall publishes separate opening days,
  commonly Mon–Sat 10:00–18:00, while current closure notices can override the
  schedule. The public copy directs readers to the official visitor page on the
  day: gedaechtniskirche-berlin.de/besuchen.
- C/O Berlin: Hardenbergstraße 22–24, daily 11:00–20:00, 15 EUR / 8 EUR reduced,
  free through age 18 inclusive. Source: co-berlin.org/de/besuch/tickets.
- Bikini Berlin: shops Mon–Sat 10:00–20:00 and roof terrace listed daily
  09:00–21:00. The roof looks across into the zoo; the direct monkey-enclosure
  view is the panoramic Monkey Window inside the lower mall. Sources:
  bikiniberlin.de opening-hours and official press-kit pages.
- Schaubühne at Lehniner Platz occupies Mendelsohn's Universum cinema of 1928,
  part of the WOGA complex; the theatre moved in in 1981. The official page
  supports the ship-keel form, not the earlier first-modernist-cinema superlative
  or Buster Keaton line, so both were removed. Selected performances carry
  English surtitles. Sources: schaubuehne.de architecture and programme pages.
- Rathenauplatz Beton-Cadillacs: Wolf Vostell, 1987, installed for Berlin's
  750th anniversary as part of the Skulpturenboulevard. Berlin's district page
  says three works survive, so the Cadillacs are described as one of those three.
- Widget distances are deliberately approximate one-decimal route estimates
  (Wittenbergplatz 0.0 / Breitscheidplatz 0.7 / Uhlandstraße 1.3 /
  Adenauerplatz 2.4 / Lehniner Platz 3.2 / Rathenauplatz 4.1). They are used for
  orientation, not survey-level precision; walking minutes assume about 4.7 km/h.

**Deliberately left out:** The Story of Berlin museum at Kurfürstendamm 207–208.
Sources disagree on whether it is temporarily or permanently closed, so it is
not mentioned at all rather than guessed at.

## Widget

`kurfurstendamm-walk` — "Ku'damm Axis Walk". A westward stop-by-stop progression,
not a picker, calculator, quiz or cheat sheet, and structurally different from
the 2026-07-19 12:05 date-overlap timeline.

Interaction model: an approximately 4.1 km distance rail with six real station pins fills as
you walk; each stop swaps a real photograph, its caption, U-Bahn line pills,
cumulative distance / walking time / street remaining, three concrete things
that are actually there, a five-block "reasons to be here" meter that visibly
drains from 5 to 1 going west, Yusuf's judgment for that stop, and a verdict
strip. The draining meter is the point: the widget's argument is that the street
gets worse, and it shows that instead of stating it.

Local browser QA after corrections: no horizontal overflow at 940, 390 or the
real Wix-critical 236 px width. Widget maximum heights across all six stops were
1400 / 1423 / 1339 px respectively; its fallback embed height is 1460. Rail
targets measured at least 44 px (48 px in the 236 px grid), selected state uses
`aria-pressed` plus roving focus, and arrow keys act only while a rail pin has
focus. Credits are default-closed, open as a fixed overlay, close by button,
Escape or outside click, and do not change document height.

Quick Summary measured 555 / 636 / 940 px at 940 / 390 / 236, so its fallback
height is 980. The shared FAQ now keeps one item open per panel; this package's
maximum measured heights were 742 / 905 / 1286 px, so its fallback is 1320.
Both shared surfaces had zero horizontal overflow at every tested width.

## Package state

- Body validated with `node scripts/validate-blog-publish-body.mjs` — OK.
- 7 article images, 7 caption paragraphs, 3 HTML embeds, body H1 count 0.
- No em dashes; no collective `we/our/us`; tour described as free walking tour
  with no duration claim in this post.
