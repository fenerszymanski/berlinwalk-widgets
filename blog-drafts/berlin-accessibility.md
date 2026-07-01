# Berlin Accessibility Draft Package

Local package date: 2026-07-01, Europe/Berlin.

## Topic Decision

- Public title/H1: Berlin Accessibility: Step-Free Transport, Museums and Route Tips
- Focus keyword: Berlin accessibility
- Slug: berlin-accessibility
- Category: Tourist Tips
- Tags: Berlin Accessibility, Accessible Berlin, Step-Free Berlin, Wheelchair Accessible Berlin, Berlin Transport
- Search intent: high-intent tourists with wheelchair, stroller, luggage, limited mobility or injury planning a realistic Berlin day before or during travel.
- Why chosen: existing inventory has public transport, stroller/kids, medical help, luggage and specific attraction accessibility notes, but no dedicated Berlin accessibility guide or tool. Tourist Tips is the best category fit because the intent is practical trip planning.

## SEO Plan

- SEO title: Berlin Accessibility: Step-Free Tourist Guide
- Meta description: Plan Berlin accessibility with step-free transport checks, lift status, stroller/wheelchair tips, museum exceptions and calmer route choices.
- Excerpt: A practical Berlin accessibility guide for tourists: step-free public transport, lift-status checks, wheelchair/stroller route tips, museums, Reichstag and TV Tower limits.
- Social title: Berlin Accessibility: Step-Free Berlin Guide
- Social description: Plan a calmer Berlin day with step-free transport checks, accessible sights and realistic backups.
- Structured data: BlogPosting in Wix SEO tags; FAQPage from FAQ widget/inject mapping for `berlin-accessibility`.

## Research Sources

- BVG barrier-free travel FAQ: https://www.bvg.de/en/service-and-support/barrier-free-travel/faq
- S-Bahn Berlin accessible travel: https://sbahn.berlin/en/plan-a-journey/rail-stations/accessible-travel/
- S-Bahn elevator/escalator outages: https://sbahn.berlin/en/plan-a-journey/rail-stations/accessible-travel/elevator-and-escalator-outages/
- VBB defective lift route information: https://www.vbb.de/en/accessible-travel/elevators/
- visitBerlin Accessible Berlin: https://www.visitberlin.de/en/accessible-berlin
- visitBerlin accessible top sights: https://www.visitberlin.de/en/accessible-top-sights-berlin
- Bundestag accessibility: https://www.bundestag.de/en/visittheBundestag/hinweis
- TV Tower limited accessibility: https://tv-turm.de/en/limited-accessibilty/
- Staatliche Museen Museum Island FAQ: https://www.smb.museum/en/museums-institutions/museumsinsel-berlin/plan-your-visit/faq/

## Internal Link Candidates Used

- Berlin public transport guide
- Berlin Hauptbahnhof guide
- Luggage storage in Berlin
- Berlin with kids
- What to book in advance in Berlin
- TV Tower worth-it guide

## Widget Ideas Considered

1. Berlin Step-Free Planner
   - Decision helped: whether to prioritize elevator-critical routing, transfer-light routing, bus/tram backup or taxi backup.
   - Selected because it is broad enough to live as a Berlin Tool and directly supports the post's core planning job.

2. Berlin Accessible Sights Sorter
   - Decision helped: which sights to prioritize by access needs.
   - Rejected because it could become stale quickly without a fuller attraction database.

3. Berlin Lift-Failure Backup Builder
   - Decision helped: what to do if a key station elevator is out.
   - Rejected as too narrow for a full BerlinTools entry, but the selected widget includes the backup logic.

## Widgets/Data Added

- Quick Summary key: `berlin-accessibility`
- FAQ key: `berlin-accessibility`
- FAQ slug mappings: `berlin-accessibility`, `berlin-accessibility-step-free-transport-museums-and-route-tips`
- Post-specific widget/tool slug: `berlin-step-free-planner`
- BerlinTools icon Wix Media URL: `https://static.wixstatic.com/media/5a08a3_7307e53737454fd5af4cd386ab19706a~mv2.png`

## Visual Package

- Contact sheet: `blog-drafts/images/berlin-accessibility/assets/qa/berlin-accessibility-contact-sheet.jpg`
- Visual source notes: `blog-drafts/images/berlin-accessibility/visual-sources.md`
- AI visual count: 2 total generated visuals for this package: cover/widget hero source and BerlinTools icon source.
- Public article image count planned for Wix: 6 total image nodes including the AI cover and five Wikimedia support images.

## Publish Body

Use `berlin-accessibility.body.md` as the exact public body source. It passed:

```bash
node scripts/validate-blog-publish-body.mjs berlinwalk-widgets/blog-drafts/berlin-accessibility.body.md
```
