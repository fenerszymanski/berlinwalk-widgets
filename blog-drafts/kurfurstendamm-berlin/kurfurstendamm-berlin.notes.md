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

- Length 3.5 km, width 53 m, four rows of plane trees, runs Breitscheidplatz to
  Rathenauplatz through Charlottenburg / Wilmersdorf / Halensee / Grunewald.
  Boulevard widening from the 1870s on Bismarck's initiative; the date cited as
  its birthday is 5 May 1886 (Zoologischer Garten–Halensee steam tram).
  Sources: en.wikipedia.org/wiki/Kurfürstendamm and berlin.de attractions page.
- Kaiser Wilhelm Memorial Church: free entry; memorial hall in the tower ruin
  Mon–Sat 10:00–18:00, shorter on Sunday. Source: berlin.de attractions page.
  The church's own domain returned HTTP 500 during this run, so berlin.de was
  used as the citation.
- C/O Berlin: Hardenbergstraße 22–24, daily 11:00–20:00, 15 EUR / 8 EUR reduced,
  free under 18. Source: co-berlin.org visit + tickets pages.
- Bikini Berlin: mall Mon–Sat 09:00–20:30, shops from 10:00, roof terrace listed
  daily 09:00–21:00. Source: bikiniberlin.de. The body says "listed as" for the
  terrace hours and flags that the shops are Mon–Sat, because the site does not
  state whether terrace access changes on a Sunday.
- Schaubühne at Lehniner Platz occupies Mendelsohn's Universum cinema of 1928,
  part of the WOGA complex; Schaubühne moved in in 1981. Mendelsohn's "no baroque
  palaces for Buster Keaton" line is quoted from his own text on the cinema.
  Sources: en.wikipedia.org/wiki/Schaubühne, schaubuehne.de architecture page.
- Rathenauplatz Beton-Cadillacs: Wolf Vostell, 1987, installed for West Berlin's
  750th anniversary as part of the temporary Skulpturenboulevard along the axis.
  Sources: berlin.de Charlottenburg-Wilmersdorf sculpture page, taz.de.
- Distances used in the widget are rounded segment estimates along the axis
  (Wittenbergplatz 0.0 / Breitscheidplatz 0.75 / Uhlandstraße 1.35 /
  Adenauerplatz 2.45 / Lehniner Platz 3.35 / Rathenauplatz 4.25), consistent with
  the verified 3.5 km published length from Breitscheidplatz to Rathenauplatz.
  Walking minutes assume roughly 4.7 km/h.

**Deliberately left out:** The Story of Berlin museum at Kurfürstendamm 207–208.
Sources disagree on whether it is temporarily or permanently closed, so it is
not mentioned at all rather than guessed at.

## Widget

`kurfurstendamm-walk` — "Ku'damm Axis Walk". A westward stop-by-stop progression,
not a picker, calculator, quiz or cheat sheet, and structurally different from
the 2026-07-19 12:05 date-overlap timeline.

Interaction model: a 4.25 km distance rail with six real station pins fills as
you walk; each stop swaps a real photograph, its caption, U-Bahn line pills,
cumulative distance / walking time / street remaining, three concrete things
that are actually there, a five-block "reasons to be here" meter that visibly
drains from 5 to 1 going west, Yusuf's judgment for that stop, and a verdict
strip. The draining meter is the point: the widget's argument is that the street
gets worse, and it shows that instead of stating it.

Widget QA: 1280px and 390px, no console errors, no horizontal overflow at either
width (`scrollWidth - innerWidth = 0`), both images load, forward/back buttons
disable correctly at the ends, keyboard arrows work, rail pins clickable and
labelled. Max page height 1450px desktop, 1485px mobile; embed height set to
1520. On mobile the rail switches from station names to km numbers so the labels
stop colliding.

## Package state

- Body validated with `node scripts/validate-blog-publish-body.mjs` — OK.
- 7 article images, 7 caption paragraphs, 3 HTML embeds, body H1 count 0.
- No em dashes; no collective `we/our/us`; tour described as free walking tour
  with no duration claim in this post.
