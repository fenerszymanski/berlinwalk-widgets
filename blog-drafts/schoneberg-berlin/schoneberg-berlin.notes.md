# Schöneberg Berlin — internal notes (2026-07-20, daily blog run 3)

## Topic selection

- Dedupe run against: 239 published Wix posts, 241 draft records (2 open
  `UNPUBLISHED`: `berliner-unterwelten`, `spreewald-day-trip-from-berlin`, both
  from today's earlier runs of this automation), 156 `tools-hub` slugs, all
  published titles/slugs, Quick Summary keys (230), FAQ keys (227).
- `schoneberg` / `schöneberg` / `nollendorfplatz` / `winterfeldt` appear in
  **zero** published titles, zero slugs, zero drafts, zero tool slugs.
- The neighbourhood-guide series already covers Kreuzberg, Neukölln,
  Friedrichshain, Prenzlauer Berg and Kurfürstendamm/City West. Schöneberg is
  the biggest remaining hole in that series, and it is a district a lot of
  visitors actually sleep in (Nollendorfplatz hotel cluster) without knowing
  what is around them.
- Rejected alternatives this run: Wannsee (tonal mix of beach + Wannsee
  Conference is risky), Hohenschönhausen (too close in shape to this morning's
  `berliner-unterwelten` "how to book a tour" post), Kulturforum/Gemäldegalerie
  (low tourist search intent), Anhalter Bahnhof (already carried by the
  published `hidden-places-central-berlin` route post).

## SEO plan

- Focus keyword: `Schöneberg Berlin`
- Slug: `schoneberg-berlin` (ASCII, matches `neukolln-berlin`,
  `kurfurstendamm-berlin` precedent)
- Secondary: `Winterfeldtmarkt`, `Nollendorfplatz`, `David Bowie Berlin flat`,
  `Rathaus Schöneberg JFK`, `Bayerisches Viertel memorial`
- Category: Tourist Tips (primary, neighbourhood-guide home) + Berlin History
- Intent: a visitor deciding whether Schöneberg is worth a half day, and what
  is actually visible when they get there.

## Internal links available (all confirmed published)

- `/post/did-jfk-really-call-himself-a-jelly-donut-the-ich-bin-ein-berliner-myth`
- `/post/kurfurstendamm-berlin`
- `/post/neukolln-berlin`
- `/post/kreuzberg-berlin`
- `/post/berlin-flea-markets`
- `/post/berlin-pride-csd-2026`
- `/post/where-to-stay-in-berlin-best-neighborhoods-for-every-type-of-tourist`
- `/post/cold-war-berlin-in-5-key-locations-you-can-still-visit`
- `/post/berlin-public-transport-explained-for-tourists-u-bahn-s-bahn-tram-bus`

## Widget plan

Three ideas considered:

1. A "Schöneberg by the hour" day dial — rejected, structurally too close to
   `mauerpark-sunday-timeline` and to this morning's tour-board row-lighting.
2. A Schöneberg walking-route map — rejected, `kurfurstendamm-walk`,
   `prenzlauer-berg-walk`, `neukolln-kiez-decoder` already own that shape, and
   Schöneberg genuinely is not one walk.
3. **Chosen: an expectation/reality filter.** Schöneberg's real visitor problem
   is that most of its famous addresses are a plaque on a private building. The
   widget sets an honesty bar ("anything at all" → "proper exhibition") and a
   day of the week, then shows which sites actually clear it and why the rest
   do not, grouped by U-Bahn stop so the reader can see it is not one walk.

Widget slug: `schoneberg-plaque-check`

## Research

See `visual-sources.md` for images. Fact sources recorded below once verified.

## Verified facts + source URLs (checked 2026-07-20)

- Winterfeldtmarkt: Wed 08:00-14:00 (operator; visitBerlin says 13:00 -> body says "Wednesday mornings" without a hard close), Sat 08:00-16:00, ~250 stalls / ~5,000 m2 (Saturday scale), no market on public holidays.
  https://winterfeldtplatz.winterfeldt-markt.de/57/wochenmarkt-am-samstag-und-mittwoch/
  https://www.berlin.de/special/shopping/biomarkt/6305543-1925662-wochenmarkt-auf-dem-winterfeldtplatz.html
- Rathaus Schöneberg: JFK speech 26 Jun 1963; Freiheitsglocke dedicated 24 Oct 1950, rings daily 12:00 for 2 min; tower NOT walk-up (guided tours only); Wir waren Nachbarn free, Mon-Thu + Sat-Sun 10:00-18:00, closed Fri.
  https://www.berlin.de/en/attractions-and-sights/3560314-3104052-schoeneberg-town-hall.en.html
  http://www.wirwarennachbarn.de/index.php/service.html
- Bowie: Hauptstraße 155, 1st floor, 1976-1978, Low/"Heroes"/Lodger; Iggy Pop rear building; plaque 22 Aug 2016, stolen Sep 2016, replaced by 5 Oct 2016; Café Neues Ufer at 157 (opened 1977 as Anderes Ufer). U Kleistpark.
  https://www.gedenktafeln-in-berlin.de/gedenktafeln/detail/david-bowie/3177
  https://www.tagesspiegel.de/berlin/gedenktafel-fur-david-bowie-hangt-wieder-3762421.html
- Nollendorfplatz: pink triangle memorial unveiled 24 Jun 1989, first such memorial in German public space; bronze panel 10 Nov 1993; Regenbogenkiez streets per district office; U1/U2/U3/U4 (only 4-line station); station renovation ENDED 10 May 2026.
  https://www.berlin.de/ba-tempelhof-schoeneberg/politik-und-verwaltung/beauftragte/queere-lebensweisen/artikel.1228735.php
  https://www.gedenktafeln-in-berlin.de/gedenktafeln/detail/opfer-des-nationalsozialismus/2051
  https://www.bvg.de/de/unternehmen/ueber-uns/news-und-stories/sanierung-nollendorfplatz
- Isherwood: Nollendorfstraße 17, plaque 30 Nov 1985, plaque dates wrong (actual Dec 1930 - 13 May 1933) -> body phrases as "researchers have pointed out".
  https://www.gedenktafeln-in-berlin.de/gedenktafeln/detail/christopher-isherwood-eigtl-christopher-william-bradshaw-isherwood/1819
  https://happy-in-berlin.org/nollendorfstrase-17/
- Orte des Erinnerns: Stih & Schnock, 80 signs 50x70cm, installed 1993, 3 orientation boards (Bayerischer Platz, Rathaus Schöneberg, Münchener Str.). U Bayerischer Platz U4/U7.
  https://www.berlin.de/ba-tempelhof-schoeneberg/ueber-den-bezirk/gedenken/artikel.358191.php
  https://stih-schnock.de/remembrance.html
- Dietrich: born Leberstraße 65 (Rote Insel), relief 1992 + Gedenktafel 2008; grave Friedhof Schöneberg III, Stubenrauchstraße 43-45, Friedenau, buried 16 May 1992, Ehrengrab Dec 1992, stone "Marlene"; Helmut Newton same cemetery; hours seasonal -> body says "gates close around dusk".
  https://www.gedenktafeln-in-berlin.de/gedenktafeln/detail/marlene-dietrich/1791
- Kammergericht: built 1911-13; Volksgerichtshof/Freisler Aug 1944 - Jan 1945 (20 July plot trials); Allied Control Council; Four Power Agreement signed 3 Sep 1971; working court, no public exhibition verified -> body treats as facade. Königskolonnaden: Gontard 1777-1780, moved 1910.
  https://www.berlin.de/gerichte/kammergericht/das-gericht/wir-ueber-uns/die-geschichte-des-gebaeudes/
- Gasometer/EUREF: interior completed Jan 2024, Deutsche Bahn offices; ~66m roof terrace is private event space only -> body says "do not go for the view".
  https://euref-event.de/en/gasometer/
- U4: 2.9 km, 5 stations, entirely in Schöneberg, opened Dec 1910, first municipally built U-Bahn line in Germany. Nollendorfplatz-Alexanderplatz ~11 min direct U2 -> body says "about ten to twelve minutes".
  https://www.bvg.de/en/connections/route-overview/u2

### Deliberately NOT published (research flagged as unverifiable/volatile)
- Exact Wednesday market closing time (13:00 vs 14:00 conflict).
- Exact cemetery opening hours (no official source).
- Kammergericht interior access/plaques (unverified).
- Gasometer guided tours (visitBerlin vs operator conflict).
- Named Akazienstraße businesses (volatile).
- Any claim the Rathaus tower can be climbed unguided or that the Gasometer has a public platform.
