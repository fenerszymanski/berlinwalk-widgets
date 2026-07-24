# Notes — reichstag-before-and-after (daily blog, 2026-07-24 ~22:00 slot)

## Topic decision
- Title: The Reichstag, Before and After: How One Building Holds Germany's Whole Century
- Focus keyword: **Reichstag before and after** (secondary: Reichstag Berlin, Reichstag history, Reichstag dome, Reichstag fire)
- Category: **Before & After** (fresh vs today's other Claude drafts: Oberbaumbrücke=Berlin History 07:55, Hamburg=Tourist Tips 12:05, Courtyards=Tour Route 17:05). Fourth run of the day; distinct topic + distinct category.
- Slug: reichstag-before-and-after
- Widget/tool slug: reichstag-read-the-building

## Dedupe (257 published + 3 same-day UNPUBLISHED drafts + 175 tools + QS/FAQ keys scanned)
- No Reichstag before/after or history post exists. The only Reichstag surface is the practical post `how-to-visit-the-reichstag-dome-for-free-and-why-you-should-book-now` (booking mechanics) and its QS/FAQ key `reichstag-dome-free`. No Reichstag tool exists. Clearly distinct: this is the building's transformation story + an on-site "read the layers" tool, not a booking how-to.
- Nightlife (berlin-bouncer / berlin-club-picker tools) and Potsdamer Platz (potsdamer-platz-time-layer-walk tool) were considered and rejected as already covered.

## SERP answerability
- Rejected form: "what is the Reichstag" / "when was the Reichstag built" (a snippet answers it).
- Reframed accepted angle: the building before and after across five eras, which trace survives today, where to look, plus how to actually get inside. Needs a plotted-transformation narrative + an interactive layer tool; cannot fit in a SERP box.

## Verified facts (2026-07-24, sources in visual-sources + web research)
- Built 1884–1894, Paul Wallot; Wilhelm II laid the final stone 5 Dec 1894.
- "Dem Deutschen Volke" bronze inscription added 1916 (>20 yrs after opening), lettering by Peter Behrens.
- Reichstag fire 27 Feb 1933; chamber + original dome gutted; Reichstag Fire Decree suspended civil liberties.
- 1945 Battle of Berlin; Soviet flag (Khaldei photo 2 May 1945); Cyrillic graffiti + shrapnel scars preserved in the 1990s rebuild.
- Postwar: dome ruins removed; Paul Baumgarten restoration 1961–71 left it domeless/flat-roofed; Wall ran right behind it; parliament in Bonn.
- Christo & Jeanne-Claude "Wrapped Reichstag" summer 1995, ~5M visitors.
- Norman Foster reconstruction 1994–1999; glass dome over the chamber; Bundestag first sat 19 April 1999.
- Dome visit today: free; register in advance at bundestag.de (visite.bundestag.de); name + DOB per visitor; photo ID (passport/ID) shown on the day for everyone 16+; dome + roof terrace open daily 8:00–24:00, last admission 21:45; walk-up Visitors' Service centre ~150m south issues passes ≥2h before visit. (Käfer rooftop restaurant booking does NOT auto-grant dome access per the official page — deliberately not claimed.)

## Widget (reichstag-read-the-building)
- Fresh bespoke interaction: a colour-coded era "strata column" (7 bands, oldest at top) reading like a building's historical cross-section + an era detail card (story + green "Still here" zone/look-for with a "mark as spotted" toggle, or grey "Not visible now" for lost layers) + a "traces found X/4" meter with a payoff line. NOT a then/now scrubber (Oberbaum), NOT an SVG route map (Courtyards), NOT a fit-bar validator (Hamburg). Photo-free (CSS/SVG UI only) so no tool-visual-credit burden; all photos live in the article.
- Local QA over HTTP: desktop 2-col (grid 168px + detail) and mobile 331px row-wrap, overflow 0, console 0, full interaction verified (era select, spot toggle, 4/4 progress + payoff, gone-eras have no mark), brand badge injects, yellow-contrast respected.

## Images (5, before/after arc — see visual-sources.md)
- Cover: modern Reichstag at sunset (Ansgar Koreng, CC BY-SA 3.0 DE)
- Imperial ~1900 with original dome + Bismarck monument (PD)
- The 1933 fire (PD)
- The 1945 ruin, 3 June 1945 (British Army / IWM, PD)
- Inside the glass dome (Perituss, CC0)
- Avoided: Khaldei 1945 flag photo (disputed copyright) and any Christo "Wrapped Reichstag" photo (temporary artwork, no German freedom of panorama).
- Attribution required (cover CC BY-SA) -> one native default-closed article "Image credits" COLLAPSIBLE_LIST, 5 entries (all credited for consistency).

## Internal links: how-to-visit-the-reichstag-dome-for-free..., brandenburg-gate-berlin-visitors-guide, holocaust-memorial-berlin, the-berlin-wall-where-it-stood..., cold-war-berlin-in-5-key-locations...
## External links: bundestag.de/en/visittheBundestag, christojeanneclaude.net (Wrapped Reichstag)

## DEFERRED (single remaining blocker): BerlinTools icon + /tools/reichstag-read-the-building page
- This autonomous run had NO connected logged-in browser and paid image APIs are forbidden, so the glossy 3D icon could not be generated via an approved non-paid route. No placeholder was shipped.
- One-shot completion kit for the next interactive session: prompt at
  `tools-home/icons/_src/daily-blog-reichstag-read-the-building-icon-20260724-prompt.md`;
  ready script `scripts/create-reichstag-read-the-building-tool-cms.mjs` (dry-run, then --apply)
  which also inserts the tools-hub + manifest entries if missing. Steps: generate icon in Yusuf's ChatGPT -> crop 512+160 -> run the script -> `node tools-hub/validate-data.mjs` -> commit/push. The blog post stays UNPUBLISHED regardless.

## Wix draft: 0a9c5120-0741-420b-8cbb-1503d57028cf (UNPUBLISHED)
