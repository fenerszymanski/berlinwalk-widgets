# Production notes — oktoberfest-in-berlin

Local correction pass, 2026-07-20. No Wix write, publish, Git commit or deploy in this pass.

## Editorial decision

The original draft's central claim was no longer true. Berlin now has multiple
confirmed Oktoberfest-style events for 2026. The corrected thesis is:

> Berlin has Oktoberfest events in 2026, but none has the scale or
> city-defining role of Munich's Wiesn.

The article now gives one direct recommendation per intent:

- Alexanderplatz for a convenient central visit.
- Spandau for the large tent and live-band experience.
- Berlin Beer Week for independent beer rather than Bavarian imitation.
- Munich as a separate trip for the original Wiesn.
- Herbstrummel only for visitors who actually want a funfair.

Category remains **Berlin Myths**, but the myth is now the assumption that
Berlin either has no Oktoberfest at all or has one equivalent to Munich.

## Focus keyword and SEO

- Focus keyword: `Oktoberfest in Berlin`
- Secondary: `Berlin Oktoberfest 2026`, `Alexanderplatz Oktoberfest 2026`,
  `Spandau Oktoberfest 2026`, `Berlin Beer Week 2026`, `Munich Oktoberfest 2026`
- Intent: current dates, place comparison and practical decision support
- Slug: `oktoberfest-in-berlin` (unchanged)
- Recommended title: `Oktoberfest in Berlin 2026: What Is Actually On`

The helper metadata, social copy, excerpt and embed cache version must move
together with the corrected body. A denylist blocks the retired 2026 Biermeile
numbers and the old absolute `no Oktoberfest in Berlin` thesis.

## Current official fact check

Checked 2026-07-20 against primary city or organizer sources.

| Claim | Primary source |
|---|---|
| Alexanderplatz Oktoberfest: 25 Sep to 4 Oct 2026; free entry; Paulaner beer garden and live programme; S/U Alexanderplatz | berlin.de event page + Bergmann Event organizer page |
| Spandau Citadel Oktoberfest: 18 Sep to 24 Oct 2026; Fridays and Saturdays only; 2,000+ seat tent; U7 Zitadelle | berlin.de event page + Wollenschlaeger organizer page |
| Berlin Beer Week: 28 Aug to 6 Sep 2026; distributed programme; 100+ breweries, 35+ events and six Brews Cruises | beerweek.de + berlin.de event page |
| Munich Oktoberfest: 19 Sep to 4 Oct 2026; 191st edition; Theresienwiese | oktoberfest.de |
| Berliner Herbstrummel: 25 Sep to 25 Oct 2026; separate autumn funfair at Zentraler Festplatz | berlin.de event page + Schaustellerverband / Festplatz calendar |
| Separate Kurt-Schumacher-Damm Oktoberfest listing has no confirmed 2026 date | berlin.de event page |
| Former Karl-Marx-Allee Internationales Berliner Bierfestival last ran in 2019; organizer announced in Feb 2020 it would not continue | Berlin House of Representatives written answer 18/22586, citing the organizer announcement |

Primary links used in the body/widget:

- https://www.berlin.de/events/2698409-2229501-oktoberfest-auf-dem-alexanderplatz.html
- https://bergmannevent.de/oktoberfest-alexanderplatz/
- https://www.berlin.de/events/3196949-2229501-oktoberfest-berlinbrandenburg-in-spandau.html
- https://www.wollenschlaeger-berlin.de/festzelt-der-hauptstadt/
- https://beerweek.de/
- https://www.berlin.de/restaurants/food-events/9817765-5146458-berlin-beer-week.html
- https://www.oktoberfest.de/en
- https://www.berlin.de/events/6279065-2229501-berliner-herbstrummel.html
- https://www.berlin.de/en/events/2698447-2842498-oktoberfest-berlin-kurtschumacherdamm.en.html
- https://pardok.parlament-berlin.de/starweb/adis/citat/VT/18/SchrAnfr/s18-22586.pdf

## Retired claims

The following are removed from every edited public surface:

- A 7 to 9 August 2026 Internationales Berliner Bierfestival.
- A 30th edition, 2.2 km current festival, 300 breweries or 18 current stages.
- Herbstrummel as `the thing marketed as Oktoberfest Berlin`.
- A confirmed large Oktoberfest tent inside the 2026 Herbstrummel.
- `Berlin has no equivalent and never has` or `There is no real Oktoberfest in Berlin`.

The third-party listing that generated the false 2026 Biermeile claim is no
longer treated as event confirmation.

## Widget

`berlin-beer-season-calendar` remains a date-range overlap timeline, with these
corrected rules:

- Arrival is counted; departure day is explicitly excluded.
- Spandau matches only when a Friday or Saturday falls before departure.
- Beer Week, Alexanderplatz, Munich and Herbstrummel use confirmed inclusive
  event dates.
- Herbstrummel is labelled as a separate funfair, not as an Oktoberfest.
- The visual timeline is decorative; a screen-reader summary and semantic live
  result list carry the same information.
- Inputs meet the 44px target.
- Timeline labels use centred, bounded anchors to avoid the previous 390px
  clipping.
- Image credits live in a fixed, default-closed overlay with `hidden!important`,
  synchronized `aria-expanded`, close button, Escape, outside click and focus
  return. Because the overlay is fixed, it does not alter iframe height.

The helper embed height must be set from the final local desktop/mobile content
measurement before the Wix draft is updated.

## Images and credits

All five photographs remain because this pass did not generate or download new
images. Images 03 and 04 now appear only in a clearly labelled historical
section. Both captions state that the photographs and prices are from 2017 and
do not describe a current 2026 event.

Public attribution moved from an open body section to the widget's default-
closed Image credits overlay. Every line includes title/source, creator,
recorded licence link and the change note: resized to a 1600px long edge and
compressed as JPEG, with no crop.

See `oktoberfest-in-berlin.visual-sources.md` and `images/sources.json` for the
internal source ledger.

## Tour connection

The public tour wording remains route-safe: it starts at Alexanderplatz, runs
about 2 hours through the historic centre of former East Berlin and ends at
Hackescher Markt. It does not imply that the tour follows the Berlin Wall line.

## Required remaining work outside this local pass

- Generate and approve the tool icon.
- Add the tool-hub entry and Wix BerlinTools CMS page.
- Deploy the widget/assets and verify the public raw and Pages versions.
- Update the existing Wix draft only after the deployed embed URLs are current.
- Perform Wix editor/readback and public desktop/mobile QA.
- Publish only after the complete package passes those gates.
