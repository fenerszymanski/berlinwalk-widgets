# Jewish Museum Berlin guide - production notes (internal)

Drafting date: 2026-07-10, Europe/Berlin.

## Topic and search intent

- Title: `Jewish Museum Berlin: Free Entry, How Long and What to See (2026)`
- Focus keyword: `Jewish Museum Berlin`
- Slug / stable content key: `jewish-museum-berlin-guide`
- Search intent: first-time tourist deciding whether to visit, how long to allow, what entry costs, which route to follow, and what practical restrictions matter.
- Category: `Berlin History`
- Tags: `Jewish Museum Berlin`, `Berlin Museums`, `Daniel Libeskind`, `Free Berlin Museums`, `Jewish History Berlin`, `Museum Planning`
- Secondary keywords: `is Jewish Museum Berlin free`, `how long Jewish Museum Berlin`, `Jewish Museum Berlin tickets`, `Jewish Museum Berlin opening hours`, `Libeskind Building Berlin`, `Garden of Exile Berlin`

## Dedupe result

- Fresh Wix Blog API inventory on 2026-07-10: 186 published posts and 17 UNPUBLISHED posts.
- No published or draft title/slug targets `Jewish Museum Berlin`, `Jüdisches Museum`, or `Juedisches Museum`.
- No dedicated Quick Summary, FAQ key, BerlinTools tool or local post source exists for this focus keyword.
- Closest existing content is intentionally different:
  - `which-berlin-museums-are-free-2026`: list-level mention only.
  - `berlin-museum-bag-rules`: security and luggage rules across multiple museums.
  - `free-things-to-do-in-berlin-2026`: short free-attraction mention.
  - `topography-of-terror-berlin`: separate institution and subject.
- Gedächtniskirche and `memorial-church-visit-planner` are owned by a separate active Claude run and are fully excluded from this package.

## SEO and social package

- SEO title: `Jewish Museum Berlin: Free Entry & Visit Plan (2026)`
- Meta description: `Plan the Jewish Museum Berlin: free core exhibition, 2.5–3 hour visit, opening hours, tickets, bags, accessibility and the best Libeskind route.`
- Excerpt: `A practical first-visit guide to the Jewish Museum Berlin: free entry, how long to allow, what to see first, security, accessibility and a route through Libeskind's building.`
- Social title: `Jewish Museum Berlin: The Visit Plan I Would Use`
- Social description: `The core exhibition is free, but the building needs time. Use this route for the three axes, Garden of Exile, Holocaust Tower and 1,700 years of Jewish life.`
- Hashtags: `berlin`, `berlinwalk`, `jewishmuseumberlin`, `berlinmuseums`, `berlinhistory`
- Canonical: omit custom canonical in the Wix draft. Wix Blog should generate its own self-canonical after publish.
- Robots: `index, follow, max-image-preview:large`.
- Structured data: BlogPosting in Wix SEO tags; FAQPage through the shared parent-page `faq/inject.js` pattern.

## Official sources verified on 2026-07-10

- Planning, hours, prices, closures, transport: https://www.jmberlin.de/en/planning-your-visit
- Core exhibition: https://www.jmberlin.de/en/core-exhibition
- Libeskind Building, axes, voids, Garden and Tower: https://www.jmberlin.de/en/libeskind-building
- House rules, security and photography: https://www.jmberlin.de/en/house-rules
- FAQ, walk-in tickets and locker dimensions: https://www.jmberlin.de/en/frequently-asked-questions
- Accessibility: https://www.jmberlin.de/en/accessibility
- Museum history: https://www.jmberlin.de/en/history-of-the-museum
- BVG Hallesches Tor: https://www.bvg.de/en/connections/station-overview/u-hallesches-tor
- BVG bus 248: https://www.bvg.de/en/connections/route-overview/248

Primary-source precedence note: Berlin.de currently shows 19:00 closing on one museum listing, but the museum's own visitor page and FAQ both say 18:00 with last admission at 17:00. Public copy uses the museum's primary-source hours.

## Time guidance

The museum does not state one official self-guided visit duration. The article labels the following as BerlinWalk recommendations, based on the 3,500-square-metre core exhibition and official 60/90-minute guided-tour formats:

- 90 minutes: architecture plus a small number of exhibition highlights.
- 2.5 to 3 hours: recommended first visit.
- 4 hours or more: detailed exhibition, JMB app and an additional exhibition or proper pause.

## Widget exploration

1. `Jewish Museum Visit Sequence` - photo-led, connected spatial path with a 90-to-240-minute rail. It protects the lower axes and core exhibition, then changes optional stops and turnaround advice as time changes. **Selected** because it answers the actual time-and-order problem without becoming another form and result card.
2. `Architecture Stress and Rest Map` - a sensory/accessibility route showing enclosed, tilted, dark and pause spaces. Useful, but too narrow for the main visitor-intent query.
3. `First and Last Hour Clock` - arrival-time tool that works backward from last admission and closing. Useful, but it would underuse the museum's distinctive spatial story.

Selected Berlin Tool:

- Tool slug: `jewish-museum-visit-sequence`
- Tool title: `Jewish Museum Visit Sequence`
- Intended hub category: `CultureLandmarks`
- Legacy category: `Discovery`
- Type: `Planner`
- Homepage tools-home: do not add. This is useful but not a top-eight universal first-trip tool.

## Visual package

- Six real Wikimedia Commons images, all license-checked via Commons API.
- No generated article image.
- Raw files, optimized files, Commons metadata, final contact sheet, captions, alt text and rejections: `blog-drafts/images/jewish-museum-berlin-guide/`.
- Compact closed-by-default article/tool attribution lives inside the visit-sequence widget. Do not expose internal generation, prompt or workflow notes publicly.
- The new glossy BerlinTools icon is the only generated visual planned for this package, leaving the daily maximum at 1 of 2.

## Internal links

- https://www.berlinwalk.com/post/which-berlin-museums-are-free-2026
- https://www.berlinwalk.com/post/berlin-museum-bag-rules
- https://www.berlinwalk.com/post/berlin-accessibility
- https://www.berlinwalk.com/post/berlin-on-a-monday
- https://www.berlinwalk.com/post/topography-of-terror-berlin
- https://www.berlinwalk.com/post/berlin-public-transport-explained-for-tourists-u-bahn-s-bahn-tram-bus
- https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based

## Required publish-body checks

- Body starts with normal prose, not the Wix title.
- No Markdown H1.
- No internal research, prompt, workflow, automation or status notes.
- Six inline images, each followed immediately by a concise caption line.
- Captions must convert to centered, italic, 12px Ricos paragraphs with compact line height.
- Three HTML embeds expected: Quick Summary, visit-sequence widget and FAQ. The compact image-credits disclosure is part of the main widget rather than a separate iframe.
- Rich-content body HEADING level 1 count must be 0.
- Wix state must remain UNPUBLISHED pending Yusuf approval.
