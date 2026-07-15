# Kaiser Wilhelm Memorial Church - production notes (internal)

Created: 2026-07-10 Europe/Berlin (daily blog automation, ~17:05 run, Claude)

## Topic / SEO plan
- Focus keyword: `Kaiser Wilhelm Memorial Church`
- Search intent: informational + planning. "Kaiser Wilhelm Memorial Church
  opening hours", "Gedächtniskirche Berlin", "is the Memorial Church free",
  "what to see inside", "how to get there".
- Distinct from existing content: not in the live 100-post inventory, not in
  any `blog-drafts/` package, and no quick-summary/faq key existed. City West /
  Charlottenburg landmark, which also rebalances a Mitte-heavy inventory.
  Nearby topics checked and kept distinct: `the-berlin-wall-...` (wall sites),
  `why-berlin-doesn-t-have-a-beautiful-old-town` (theme link), shopping/KaDeWe.
- Categories: Tourist Tips + Berlin History (deliberate category balance after a
  Tourist-Tips-heavy week).
- Slug: `kaiser-wilhelm-memorial-church-berlin`.
- Title (Wix H1): `Kaiser Wilhelm Memorial Church: How to Visit Berlin's Broken Tower (2026)`
- SEO title: `Kaiser Wilhelm Memorial Church Berlin: Hours & Tips (2026)`
- Secondary keywords: Gedächtniskirche Berlin, opening hours, free entry,
  Berlin City West.

## Facts + sources (checked 2026-07-10)
- Original church 1891-1895, architect Franz Schwechten, Neo-Romanesque,
  commissioned by Kaiser Wilhelm II to honour Wilhelm I. Consecrated 1 Sep 1895.
  Breitscheidplatz, head of the Kurfürstendamm.
- Gutted in a British air raid on the night of 23 November 1943. Old spire kept
  as a war memorial ("der hohle Zahn" / hollow tooth).
- Egon Eiermann won the rebuild competition, first proposed demolishing the
  ruin; public outcry preserved the tower. New ensemble 1959-1963, New Church
  consecrated 17 December 1961. Blue glass (double wall) developed with Gabriel
  Loire, Chartres. Cross of Nails from Coventry (reconciliation).
- FREE entry. New Church daily ~10:00-18:00. Memorial Hall (old tower)
  Mon-Sat 10:00-18:00, Sun 12:00-18:00. Sunday services 10:00 and 18:00; no
  casual visits during services/prayers/concerts. Free guided tours daily
  ~11:15-16:15.
- Nearest: S+U Zoologischer Garten (U2/U9, S3/S5/S7/S9/S75); U Kurfürstendamm
  (U1/U9). Beside KaDeWe / Ku'damm. Bus 100 starts at Zoo station.
- Breitscheidplatz was the site of the 19 Dec 2016 Christmas market attack;
  ground memorial (golden crack + names) by the steps. Handled briefly and
  respectfully in the body, not sensationalised, no event-specific images used.
- Sources: berlin.de (attractions + museum pages), visitBerlin.de,
  en.wikipedia.org (Kaiser Wilhelm Memorial Church), church site
  gedaechtniskirche-berlin.de.

## Internal links used (>=3)
- /post/where-to-stay-in-berlin-best-neighborhoods-for-every-type-of-tourist
- /post/bus-100-berlin-the-4-sightseeing-tour-locals-don-t-want-you-to-know-about
- /post/berlin-public-transport-explained-for-tourists-u-bahn-s-bahn-tram-bus
- /post/free-things-to-do-in-berlin-2026
- /post/why-berlin-doesn-t-have-a-beautiful-old-town-and-why-that-s-the-point
- /book-berlin-walking-tour/berlin-free-walking-tour-tip-based

## External links (official/high-quality, >=2)
- https://www.gedaechtniskirche-berlin.de/en/ (church, official)
- https://www.visitberlin.de/en/kaiser-wilhelm-gedachtnis-kirche (city tourism)

## Widget ideas (>=3), chosen 1
1. CHOSEN - Gedächtniskirche Visit Planner (`memorial-church-visit-planner`):
   pick a weekday + slide a time along an 08:00-20:00 ribbon; colored bands show
   New Church hours (blue), old-tower Memorial Hall hours (gold), and Sunday
   service windows (red hatch). A moving marker + live verdict panel says exactly
   what is open at that moment, with a Yusuf tip per state, and a "Set to now
   (Berlin)" button that reads the real Berlin day/time. Solves the article's
   real reader problem (the two-interiors + Sunday-service confusion) with a
   time-ribbon interaction, not a picker/checker/comparator clone.
2. Rejected - clickable four-part architecture diagram (tap tower/nave/belfry):
   drifts back toward a picker-card pattern.
3. Rejected - before/after 1900 vs ruin vs today slider: sliders are overused,
   and sourcing a clean aligned before/after pair is risky.

## Widget QA
- Local QA on workspace-static-root (port 8794), desktop + mobile 390px.
- No console errors; no horizontal overflow (docW == winW at 390).
- Live "now" defaulted correctly to Friday 17:xx (drafting day). Verified edge
  cases: Sun 10:30 = "service paused" (2 closed segs, both chips closed);
  Sun 11:30 = New Church open / Memorial Hall closed until 12:00; weekday
  daytime = both open.
- Em dashes removed from status strings (project no-em-dash rule).

## Images (5, all Wikimedia Commons) - see visual-sources.md
- 01 night cover (Perituss, CC0), 02 City West day (Flocci Nivis, CC BY 4.0),
  03 old-tower ceiling B&W (Tenzin Peljor, CC BY-SA 2.0), 04 imperial mosaic
  (Taxiarchos228, FAL), 05 blue glass (Jan Mathys, CC BY-SA 4.0).
- Reader-facing Image Credits block included (CC BY / CC BY-SA / FAL require it).
- Rejected the 2016 attack-memorial photo (event-specific/somber) and cluttered
  aerial/car shots.

## Wix draft
- Draft ID: ba6fe393-733c-4c27-bf25-280f03b82893  (UNPUBLISHED)
- Edit: https://manage.wix.com/dashboard/12ee5ea0-70a7-492f-8020-ffb27cbb630f/blog/drafts/ba6fe393-733c-4c27-bf25-280f03b82893/edit
- Public (after publish): https://www.berlinwalk.com/post/kaiser-wilhelm-memorial-church-berlin
- Readback: 5 images / 5 captions (center/italic/12px) / 3 embeds, h1=0,
  16 SEO tags, BlogPosting + FAQPage, robots index/max-image-preview:large,
  og+twitter image, keywords main-flagged, no internal-note leak.

## Deferred to Codex (precedent: sunset, uber runs)
- BerlinTools catalog card for `memorial-church-visit-planner`: tools-hub entry
  + glossy 3D icon (needs approved non-paid image-gen path unavailable in this
  unattended run) + BerlinTools CMS item + icon map wiring. See
  CODEX_HANDOFF_kaiser-wilhelm-memorial-church-berlin.md. The widget itself is
  live and embedded in the post.

## Final state
- UNPUBLISHED. Do not publish without Yusuf's explicit per-draft approval.
