# Gemäldegalerie Berlin — internal planning notes (NOT for publish body)

Run: 2026-07-22 ~12:05 CEST slot (3rd Claude daily-blog package of the day;
same-day siblings: leipzig-day-trip-from-berlin, karl-marx-allee-berlin;
spandau-berlin is yesterday's still-unpublished draft).

## Topic decision + dedupe

- Focus keyword: `Gemäldegalerie Berlin`
- Slug: `gemaldegalerie-berlin`
- Categories: Tourist Tips (primary) + Berlin History
- Dedupe: 248 published slugs (Wix API), 3 UNPUBLISHED drafts, 166 tool slugs,
  240 QS / 237 FAQ keys scanned. Zero Gemäldegalerie/Kulturforum/Neue
  Nationalgalerie coverage anywhere; only passing "Kulturforum" mentions in
  potsdamer-platz-berlin and two film/cinema posts. Museum posts that exist
  (museum island cluster, museum pass, free museums, bag rules) are adjacent
  but none covers the Kulturforum museums.
- Same-day balance: Leipzig (day trip), KMA (history walk). This adds a
  museums/attractions practical guide, a different content type.

## SERP answerability verdict

- REJECTED forms: `what is the Gemäldegalerie` / `is the Gemäldegalerie worth
  it` / `Gemäldegalerie tickets price` (one-line or yes/no SERP answers).
- ACCEPTED reframe: which of the 72 rooms and which paintings deserve your
  two hours, in what walking order, plus Museum Island vs Kulturforum
  trade-off and a build-your-own-shortlist tool. Judgment + in-building route
  + comparison; cannot fit a SERP box.

## Verified facts + sources (checked 2026-07-22)

- Hours Tue-Sun 10-18, Mon closed:
  https://www.smb.museum/en/museums-institutions/gemaeldegalerie/plan-your-visit/
- Tickets 14/7 EUR, Kulturforum day ticket 22/11 EUR, annual pass from 25 EUR:
  https://www.smb.museum/en/museums-institutions/gemaeldegalerie/plan-your-visit/prices-tickets/
  Under-18 free (smb.museum general prices page). Booking up to 4 weeks ahead.
- Museumssonntag: last run 1 Dec 2024, discontinued via culture budget cuts,
  no relaunch as of mid-2026 (museumsportal-berlin.de + kulturprojekte.berlin).
- Neue Nationalgalerie: collection 14/7, museum ticket 20/10, Kulturforum
  22/11; Brancusi retrospective 20 Mar - 9 Aug 2026 (16/8); free FIRST
  Thursday of month 16:00-20:00 (Art4All):
  https://www.smb.museum/en/museums-institutions/neue-nationalgalerie/plan-your-visit/prices-tickets/
  NOTE: some third-party sites claim "every Thursday free" — WRONG, official
  page says first Thursday only. Published as first Thursday.
- Philharmonie lunch concerts: FREE, Wednesdays 13:00, September to June,
  40-50 min, limited capacity chips:
  https://www.berliner-philharmoniker.de/en/concerts/lunch-concerts/
  (older Tripadvisor reviews say Tuesday — the official page says Wednesday;
  published Wednesday + "pauses in summer").
- berlin modern (Museum des 20. Jahrhunderts): Herzog & de Meuron, under
  construction between NNG and Philharmonie, opening now expected around 2030
  (was 2026/2027 earlier): de.wikipedia Museum des 20. Jahrhunderts +
  preussischer-kulturbesitz.de. Published as "currently expected around 2030".
- Collection/building: opened 1830 Altes Museum, Bode expansion, 1904 Kaiser
  Friedrich Museum, 1998 Kulturforum building (Hilmer & Sattler); 72 rooms,
  ~2 km, ~1,250 paintings main floor + ~400 study gallery; 18 main halls in
  numbered sequence + ~40 cabinets around the central hall; Rembrandt hall =
  Hall X (en.wikipedia Gemäldegalerie + museumsportal + european-traveler).
- Flakturm Friedrichshain: most important works stored there from 1941;
  ~400-430 paintings destroyed in the May 1945 fires, incl. THREE Caravaggios
  and Signorelli's Pan (large formats did not fit the Kaiseroda mine cages):
  https://www.smb.museum/en/museums-institutions/gemaeldegalerie/collection-research/research/lost-masterpieces/
  + theartnewspaper.com 2026-04-22 digitization article. Published "around 400".
- Cold War split: Bode Museum (East) / Dahlem (West), reunited 1998 (Wikipedia).
- Two Vermeers in Berlin (Pearl Necklace ~1662, Glass of Wine) — standard.
- Man with the Golden Helmet: reattributed to circle of Rembrandt in the
  1980s (Gemäldeg. catalogue standard fact, Commons file titled "circle").
- Botticelli Venus (Kat. 1124): Commons artist field "Attributed to Sandro
  Botticelli" — published as "attributed to".

## Deliberately NOT published

- Exact room numbers for individual paintings other than Hall X (hangs move;
  wing/area level only, widget says grab the free floor plan).
- "Vermeers in cabinet 18" (single semi-reliable source).
- Rembrandt count "20 works" (varies by counting method; published "one of
  the largest Rembrandt collections in the world").
- NNG opening hours per-day detail (only free-Thursday window published).
- Exact bus line numbers at Kulturforum (stop names only).
- Walter De Maria installation name (not needed).

## Widget ideas (3+) and decision

1. **Highlights Walk builder (CHOSEN)** — dark gallery-wall of 10 real PD
   masterpiece images in gold frames; tap → museum-label card (why stop, one
   detail to look for, where it hangs); pick up to 5 → ordered walk following
   the numbered main-hall loop + time estimate. Fresh interaction: no art
   viewer/curation tool exists among 167 slugs; interaction model
   (curate-your-own-shortlist from framed paintings) unused.
2. Museum Island vs Kulturforum crowd/interest matcher — rejected: generic
   picker shell risk, close to museum-pass calculator territory.
3. Kulturforum afternoon sequencer (GG + NNG + Philharmonie time slider) —
   rejected: leipzig-day-trip-planner owns the time-ribbon model from today.
4. Lost-masterpieces then/now viewer (burned works) — rejected: sensitive
   fabrication risk zero but low practical use; time-layer tools own the
   before/after model.

Widget slug: `gemaldegalerie-highlights-walk`, title `Gemäldegalerie
Highlights Walk`, hubCategory CultureLandmarks, type Planner. All 10 widget
images are public-domain painting reproductions (PD-Art), so the widget needs
NO tool-visual-credit UI. No article-credit UI or pointer in the widget.

## Internal links plan (used in body)

/post/is-museum-island-free-tickets-prices-and-what-to-actually-skip,
/post/berlin-on-a-monday, /post/berlin-museum-bag-rules,
/post/potsdamer-platz-berlin,
/post/berlin-museum-pass-vs-single-tickets-which-one-saves-you-money,
booking page. External: smb.museum plan-your-visit, smb.museum lost
masterpieces, smb.museum NNG prices, berliner-philharmoniker.de lunch
concerts.
