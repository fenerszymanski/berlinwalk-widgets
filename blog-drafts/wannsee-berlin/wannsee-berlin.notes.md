# Wannsee Berlin — internal planning notes (NOT publish body)

Run: 2026-07-21, daily-blog draft run 2 of day (07:05 slot produced football).
Status: complete UNPUBLISHED draft package; awaiting Yusuf's article-specific
publish approval.

## Topic decision

- Focus keyword: `Wannsee Berlin` (secondary: `Strandbad Wannsee`, `Pfaueninsel`,
  `Wannsee Conference House`, `Wannsee beach`).
- Slug: `wannsee-berlin` (matches district-post pattern; no collision in 243
  published posts, 2 open drafts, 160 tool slugs, 234 QS / 231 FAQ keys).
- Categories: Tourist Tips + Berlin History.
- Search intent: visitors who saw "Wannsee" on a lake list or S-Bahn map and
  want to know what is actually there and how to combine beach / island /
  history shore in one trip.
- Dedupe: `berlin-lakes-guide-2026` treats Wannsee as one lake among many
  (swim angle); `berlin-public-transport-ferries` owns F10 depth (link, do not
  repeat); `potsdam-from-berlin-day-trip` same S-Bahn corridor (link). No
  dedicated Wannsee coverage anywhere.

## SERP answerability verdict

- Rejected form: `how do I get to Wannsee` (one sentence: take S1/S7). Not used.
- Chosen form: what a Wannsee day actually contains and how to sequence
  beach + Pfaueninsel + villa shore + ferry with two different S-Bahn stations,
  a bus corridor and two boats. Needs a map, ordering judgment and trade-offs;
  cannot fit a SERP box.

## Widget ideas (3+)

1. **Wannsee Shore Planner** (CHOSEN, slug `wannsee-shore-planner`): real SVG
   map of the Grosser Wannsee with the actual anchors (S Nikolassee, S Wannsee,
   Strandbad, villa road with Liebermann-Villa + Conference House, Heckeshorn,
   Pfaueninsel ferry, Alt-Kladow across the Havel). Reader multi-selects what
   they care about + time budget + weekday; the planner sequences a realistic
   shore loop on the map, states which station/bus/ferry each leg needs,
   totals honest times, and greys out what does not fit with the reason.
   Unique hook: the two-stations mistake (beach is at Nikolassee, not Wannsee).
2. Strandbad vs wild swimming spots comparison picker (weaker: berlin-lakes
   tool already picks lakes).
3. Pfaueninsel ferry + bus 218 timing calculator (too narrow).
4. "Which station do I get off at" decision helper (folded into #1).

Interaction model differs from spreewald-reach-map (mode -> reach colouring)
and dresden-day-clock (proportional day ribbon): this is multi-select
destinations -> geographic sequencing with per-leg transport on a lake map.

## Planned internal links

- /post/berlin-public-transport-ferries (F10 depth)
- /post/berlin-lakes-guide-2026 (other lakes)
- /post/potsdam-from-berlin-day-trip (same S-Bahn corridor)
- /post/berlin-heatwave-day-plan (hot-day framing)
- /post/topography-of-terror-berlin or /post/holocaust-memorial-berlin
  (conference-house context)
- /tools/wannsee-shore-planner (new tool)
- /tools/berlin-lakes

## External links planned (verify exact URLs in research)

- berlinerbaeder.de Strandbad Wannsee page
- ghwk.de (Haus der Wannsee-Konferenz)
- spsg.de Pfaueninsel
- liebermann-villa.de

## Research: see research-report.md (agent output + verification)

## Completion record

- Wix draft ID: `da7f2b1b-eaed-4ebf-ba44-523ea24814d5`.
- Final readback: `UNPUBLISHED`, `hasUnpublishedChanges:true`, body H1 0,
  7 images, 7 centered 12px italic captions, 3 embeds and 16 SEO tags.
- Tool: `wannsee-shore-planner`; BerlinTools CMS item
  `91d1ffb4-8cfa-4a3e-96a7-610106446b2a` with live Wix Media icon
  `5a08a3_34182a8f028a4d6d8dcb8f178ef639c8~mv2.png`.
- While this article is unpublished, the live tool's related-blog card points
  to the already-live `/post/berlin-lakes-guide-2026`, avoiding a public 404.
  The CMS helper checks the matching Wannsee public URL and switches the card
  to `/post/wannsee-berlin` automatically after that post returns HTTP 200.
- Planner verification: all 63 non-empty stop selections x 3 time budgets x
  7 weekdays = 1,323 combinations, zero mismatches. Desktop 1280 and mobile
  390 checks pass with no horizontal overflow. Image credits are default
  closed, modal-positioned, Escape/outside/Close controlled and do not change
  document height.
- No Wix Blog publish, `/blog` regeneration or Search Console indexing was
  performed because the post still requires Yusuf's explicit approval.
