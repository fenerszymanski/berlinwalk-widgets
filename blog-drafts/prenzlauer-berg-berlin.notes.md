# Prenzlauer Berg Berlin — Production Notes

Daily-blog automation package, 2026-07-14 (1st run of the day).

## Topic + SEO
- Title: **Prenzlauer Berg Berlin: A Local Guide to the Café and Sunday District (2026)**
- Slug: `prenzlauer-berg-berlin`
- Focus keyword: **Prenzlauer Berg** (in title, meta, an H2, slug, 15x in body)
- Category: Tourist Tips (primary, single)
- Secondary keywords: Prenzlauer Berg Berlin, things to do in Prenzlauer Berg,
  Kollwitzplatz market, Mauerpark Sunday
- Search intent: informational / trip-planning (visitors deciding how to spend
  time in the district)
- Distinct-topic gap: no Prenzlauer Berg post or draft existed in the 201
  published posts or the drafts inventory. Distinct from the 07-13 Kreuzberg
  guide (café/Sunday angle vs. the two-halves angle). Mauerpark is a separate
  existing post and is linked, not duplicated.

## Wix draft
- Draft ID: `f6344752-513f-4918-b28d-ee6795f01e8e`
- Status: **UNPUBLISHED** (daily-draft final state; do not publish without
  Yusuf's explicit per-draft approval)
- Edit URL: https://manage.wix.com/dashboard/12ee5ea0-70a7-492f-8020-ffb27cbb630f/blog/drafts/f6344752-513f-4918-b28d-ee6795f01e8e/edit
- Public URL when published: https://www.berlinwalk.com/post/prenzlauer-berg-berlin
- Readback: 6 images (all alt), 6 styled captions (centered/italic/12px),
  3 embeds (QS + widget + FAQ), body H1 count 0, 16 SEO tags,
  BlogPosting + FAQPage schema, robots `index, follow, max-image-preview:large`,
  og:image = cover, 10 bold spans, no leak phrases.

## Widget
- Slug: `prenzlauer-berg-walk` (berlinwalk-widgets/prenzlauer-berg-walk/index.html)
- A self-guided Prenzlauer Berg walking-loop: stylised SVG district map with six
  numbered stops in walking order, a route line that fills as you advance,
  clickable dots to jump, progress bar, per-stop "what it is / do this / practical
  tag / walk time" card, and an end summary with a tour CTA. Route-progression
  interaction built from scratch, not a clone of any existing picker/checker/
  skyline widget. QA passed desktop 720 + mobile 390 (labels hidden <430px, no
  overflowX, 0 console errors).
- Stops: Eberswalder Straße/Konnopke's -> Kulturbrauerei -> Kollwitzplatz ->
  Wasserturm -> Kastanienallee/Prater -> Mauerpark.

## BerlinTools promotion — DEFERRED
- Tool-page/CMS/glossy-icon promotion DEFERRED (no non-paid AI icon path in this
  headless run; matches phone-ticket / pronouncer / observation-decks precedent).
  Widget is body-embed only, not yet a `/tools/prenzlauer-berg-walk` page and not
  in tools-hub/data.json. Promote later via the ChatGPT-browser icon workflow.

## Data / deploy
- QS + FAQ (6 + 6) under key `prenzlauer-berg-berlin`; `faq/slug-map.json` +
  regenerated `faq/inject.js` include the key.
- Committed + pushed via isolated worktree off origin/main (commit `68d1c59`,
  no Codex WIP rode along). Files: prenzlauer-berg-walk/, quick-summary/data.json,
  faq/data.json, faq/slug-map.json, faq/inject.js.

## Facts verified 2026-07-14 (sources in visual-sources.md and below)
- Konnopke's Imbiss: Schönhauser Allee 44B under Eberswalder Straße U2 viaduct,
  since 1930, Mon-Sat, closed Sun.
- Museum in der Kulturbrauerei: free entry, Tue-Sun, "Everyday Life in the GDR".
- Kollwitzplatz weekly market: Thursdays + Saturdays, >50 stalls.
- Wasserturm: built 1877, Berlin's oldest water tower; SA used the engine rooms
  as an early prison in 1933.
- Prater Garten: Kastanienallee 7-9, Berlin's oldest beer garden since 1837.
- Mauerpark: former Wall death strip; Sunday flea market + Bearpit Karaoke.
