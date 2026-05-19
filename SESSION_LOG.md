# Session log

Rolling log of agent sessions. Most recent at top.

Format for each entry — see `AGENTS.md` §9.

---

## 2026-05-19 — Codex (Homepage hero)

**Did:** Built a new `bw-hero-home` Custom Element to replace the Wix-native homepage hero/header with a conversion-focused first viewport.

**Changed:**
- `hero-home/hero-home-element.js` — new full-bleed hero with real tour photo, `Free Berlin Walking Tour` H1, booking CTA, meeting point CTA, route line, review link, and 5.0/12/~2h/tip-based proof points.
- `hero-home/index.html` — standalone preview/fallback page.
- `README.md`, `AGENTS.md`, `wix-embed-snippets.md` — documented the new homepage element.
- Project root: `PROJECT_MEMORY.md`, `SESSION_LOG.md` — recorded replacement guidance and install snippet.

**Opened:** Yusuf needs to replace the Wix-native homepage hero/header with `<bw-hero-home>` after pushing/deploying the repo.
**Closed:** Local desktop/mobile QA passed with no horizontal overflow and the hero image loaded.

**Next session should:** Verify live homepage first viewport after Wix placement, especially nav height, sticky booking widget overlap, and mobile crop.

## 2026-05-19 — Codex (Homepage blog teaser)

**Did:** Built a new `bw-blog-home` Custom Element to replace the Wix-native homepage blog CMS grid with a curated `Berlin Travel Notes` section.

**Changed:**
- `blog-home/blog-home-element.js` — new editorial blog teaser with one featured post, three note cards, images, animations, and `/blog` CTA.
- `blog-home/data.json` — curated mini-CMS for the four homepage posts.
- `blog-home/index.html` — standalone preview/fallback page.
- `README.md`, `AGENTS.md`, `wix-embed-snippets.md` — documented the new homepage element.
- Project root: `PROJECT_MEMORY.md`, `SESSION_LOG.md` — recorded replacement guidance and install snippet.

**Opened:** Yusuf needs to replace the Wix-native homepage blog section with `<bw-blog-home>` after pushing/deploying the repo.
**Closed:** Local desktop/mobile QA passed with no horizontal overflow and all images loaded.

**Next session should:** Verify the live homepage placement, especially spacing against the adjacent homepage sections and sticky booking CTA.

## 2026-05-19 — Codex (Homepage planning tools section)

**Did:** Reframed the homepage `bw-tools-home` section from generic "Free Berlin Tools" into a clearer visit-planning module.

**Changed:**
- `tools-home/tools-home-element.js` — new `Plan your Berlin visit in minutes` header, local-guide summary panel, planning CTA text, tighter 8px card styling, and `target="_top"` navigation.
- `tools-home/index.html` — simplified the fallback preview so it loads the same Custom Element source.
- Project root: `PROJECT_MEMORY.md`, `SESSION_LOG.md` — recorded the new homepage tools positioning.

**Opened:** Yusuf needs to replace/update the homepage tools Custom Element after pushing/deploying the repo.
**Closed:** Local desktop/mobile QA passed with no horizontal overflow.

**Next session should:** Verify the live homepage section after Wix placement, especially the right summary panel and sticky booking CTA overlap.

## 2026-05-19 — Codex (Homepage guide teaser)

**Did:** Built a new `bw-guide-home` Custom Element to replace the old Wix-native homepage `Meet Your Guide, Yusuf` section.

**Changed:**
- `guide-home/guide-home-element.js` — new homepage guide teaser with current Rotes Rathaus photo, compact proof points, `/the-guide` link, and booking CTA.
- `guide-home/index.html` — standalone preview/fallback page.
- `README.md`, `AGENTS.md`, `wix-embed-snippets.md` — documented the new homepage element.
- Project root: `PROJECT_MEMORY.md`, `SESSION_LOG.md` — recorded the replacement guidance and install snippet.

**Opened:** Yusuf needs to replace the Wix-native homepage guide section with `<bw-guide-home>` after pushing/deploying the repo.
**Closed:** Local desktop/mobile QA passed with no horizontal overflow.

**Next session should:** Verify the live homepage section after Wix placement, especially image crop and sticky CTA overlap.

## 2026-05-19 — Codex (The Guide hero balance)

**Did:** Rebalanced the `/the-guide` hero after the newer portrait photo made the right card too tall and left too much empty space on the text side.

**Changed:**
- `the-guide/the-guide-element.js` — changed hero profile image from 3:4 to controlled 4:3 crop, centered the hero grid vertically, and added a compact "What you get on the walk" proof panel under the hero buttons.

**Opened:** none
**Closed:** Local desktop/mobile QA passed with no horizontal overflow; hero height is shorter and visually more balanced.

**Next session should:** Push/deploy, then verify live `/the-guide` hero crop against the actual Wix page width.

## 2026-05-18 — Codex (The Guide page)

**Did:** Built a dedicated `bw-the-guide` Custom Element for the planned `/the-guide` page, replacing the old primary-nav anchor idea with a real guide/trust page.

**Changed:**
- `the-guide/the-guide-element.js` — new standalone The Guide page with Yusuf profile, route logic, approach cards, real photos, reviews, and booking CTAs.
- `the-guide/index.html` — standalone preview/fallback page.
- `the-guide/SEO_SETTINGS.md` — Wix-ready SEO title, description, OG/Twitter tags, canonical, and ProfilePage/Person schema.
- `site-footer/site-footer-element.js` — changed `The Guide` link to `https://www.berlinwalk.com/the-guide`.
- `README.md`, `AGENTS.md`, `wix-embed-snippets.md` — documented the new page element.
- Project root: `PROJECT_MEMORY.md`, `SESSION_LOG.md` — recorded page purpose and install snippet.

**Opened:** Yusuf needs to create the Wix `/the-guide` page, add the Custom Element, paste SEO settings, publish, then point the primary nav `THE GUIDE` to `/the-guide`.
**Closed:** Local design/build and desktop/mobile QA are complete.

**Next session should:** After publish, verify live `/the-guide`, then re-check header/footer links.

## 2026-05-18 — Codex (Footer revision)

**Did:** Revised `bw-site-footer` per Yusuf's feedback: removed the green CTA block and replaced the text/BW mark with the real live-site BerlinWalk logo asset.

**Changed:**
- `site-footer/site-footer-element.js` — removed CTA section/styles, added real Wix logo image, kept the footer navigation structure intact.

**Opened:** none
**Closed:** Footer revision QA passed on desktop/mobile with no horizontal overflow and logo loaded correctly.

**Next session should:** Push/deploy and install the footer Custom Element in Wix Studio.

## 2026-05-18 — Codex (Site footer custom element)

**Did:** Built a new `bw-site-footer` Custom Element with a booking CTA, brand/route summary, tour links, planning/blog links, practical Berlin links, and partner-facing `Embed Berlin Tools` placement.

**Changed:**
- `site-footer/site-footer-element.js` — new global footer Custom Element.
- `site-footer/index.html` — standalone preview/fallback page.
- `README.md`, `AGENTS.md`, `wix-embed-snippets.md` — documented the footer source URL, tag name, and usage.
- Project root: `PROJECT_MEMORY.md`, `SESSION_LOG.md` — recorded footer install snippet and positioning guidance.

**Opened:** Yusuf needs to add the Custom Element to the Wix footer and publish after pushing this repo.
**Closed:** Footer design/build is ready locally; desktop/mobile QA passed with no horizontal overflow.

**Next session should:** After deployment, verify the live footer on desktop/mobile and check the booking, meeting point, planning, and embed links.

## 2026-05-18 — Codex (Meeting Point custom element)

**Did:** Built a distinctive `bw-meeting-point` Custom Element for the planned `/meeting-point` page: real World Clock photo, stylized wayfinding map, tour-day details, late-arrival guidance, and booking/map CTAs.

**Changed:**
- `meeting-point/meeting-point-element.js` — new Custom Element.
- `meeting-point/index.html` — standalone preview/fallback page.
- `AGENTS.md` — documented the new folder and planned live URL.
- Project root: `PROJECT_MEMORY.md`, `SESSION_LOG.md` — recorded meeting point details and Wix install snippet.

**Opened:** Yusuf needs to create/publish the Wix `/meeting-point` page and add the custom element snippet after pushing this repo.
**Closed:** Meeting Point page design/build is ready locally and QA passed on desktop/mobile with no horizontal overflow.

**Next session should:** Push/deploy, add footer link to `/meeting-point`, then verify live page and the Google Maps button.

## 2026-05-18 — Codex (Meeting Point SEO settings)

**Did:** Prepared Wix-ready SEO settings for the new `/meeting-point` page after checking Wix REST docs; no safe static-page SEO write endpoint surfaced, so settings are documented for Studio entry.

**Changed:**
- `meeting-point/SEO_SETTINGS.md` — SEO title, meta description, canonical, social tags, OG image, and JSON-LD structured data for `/meeting-point`.

**Opened:** Paste SEO settings into Wix Studio for `/meeting-point`; skip duplicate meta tags if Wix auto-generates them from the basic SEO fields.
**Closed:** SEO copy/schema package is ready locally.

**Next session should:** After SEO and custom element are installed, publish and verify live source tags for `/meeting-point`.

## 2026-05-18 — Codex (Plan Your Visit + Embed Tools page copy)

**Did:** Reframed `/berlin-tools` as traveler-facing `Plan your Berlin visit` and `/widgets` as publisher-facing `Embed free Berlin planning tools`; added a bridge CTA from the planning/tools page to `/widgets`.

**Changed:**
- `tools-hub/tools-hub-element.js`, `tools-hub/index.html` — new hero headline, `Embed these tools` CTA card, fallback title update.
- `widgets-hub/widgets-hub-element.js`, `widgets-hub/index.html` — clearer embed-focused H1/lead and `How it works` language.
- `widgets-hub/SEO_ADDITIONAL_TAGS.md`, `widgets-hub/_regenerate_seo.py` — aligned SEO copy/schema wording with `Embed Free Berlin Planning Tools`; regenerated JSON-LD from current `tools-hub/data.json`.
- Project root: `PROJECT_MEMORY.md`, `SESSION_LOG.md` — recorded nav/page positioning decision.

**Opened:** Yusuf still needs to adjust Wix Studio menus: rename `Useful Tools` to `Plan Your Visit`, remove `Widgets` from primary nav, and add footer/resources link as `Embed Berlin Tools`.
**Closed:** Page-internal copy and `/berlin-tools` → `/widgets` bridge CTA.

**Next session should:** After Yusuf changes Wix menus and pushes/deploys the repo, verify live `/berlin-tools` and `/widgets` with cache-busted URLs.

## 2026-05-18 — Claude Code (attribution badge + FAQ space + months-nav fixes)

**Did:**
- Diagnosed and fixed the exploding "by berlinwalk.com" attribution badge on blog posts: cause was `quick-summary` and `lead-form` widgets loading `brand.js` but not `brand.css`, so the 1.4MB badge logo rendered at natural size on every Quick Summary embed.
- Reworked `brand.js` attribution logic: skips the badge entirely when embedded on `berlinwalk.com` (parent referrer check), keeps it for genuine third-party embeds. The 1.4MB PNG no longer loads on internal pages at all.
- Swapped the badge logo asset to a smaller Wix Media URL Yusuf provided: `5a08a3_4d96e164d26241fd9eb009843ec2084a~mv2.png`.
- Added defensive inline `width:18px;height:18px` on the badge `<img>` so a missing brand.css can never blow up the layout again.
- Fixed FAQ-leaves-empty-space bug in `berlinwalk-widget-auto-resize-custom-code.js`: blog-post wrappers were grow-only, leaving stale tall heights from previously expanded accordions. Now shrinks close ancestors (depth ≤ 2) when widget content reports a smaller height. Yusuf updated the Wix Custom Embed and confirmed fixed.
- Updated `months-nav/data.json` — flipped July/August/September from `draft` to `published` so cards link correctly on the 4 live month posts (June was already published).

**Changed:**
- `js/brand.js` — parent-origin check, defensive img sizing, logo URL swap
- `quick-summary/index.html`, `lead-form/index.html` — added `<link rel="stylesheet" href="../css/brand.css">`
- `months-nav/data.json` — 3 statuses flipped to `published`
- Project root: `berlinwalk-widget-auto-resize-custom-code.js` — shrink-on-close-ancestor logic. Yusuf updated the Wix Custom Embed (now revision 8); PROJECT_MEMORY.md still references revision 7 and should be bumped on the next memory pass.

**Opened:** Update PROJECT_MEMORY.md auto-resize revision number to 8 next session.
**Closed:** none

**Next session should:** Watch the Anhalter Bahnhof reel performance (posted today on @berlinwalkingtour) vs the Verkehrsturm baseline. If it lands, run the next Hidden Berlin History topic — Stadtschloss → Palast der Republik → Humboldt Forum three-layer story is the strongest candidate.

## 2026-05-17 — Claude Code (Widgets program v1.4: Advanced SEO markup + regen script)

**Did:**
- Drafted `widgets-hub/SEO_ADDITIONAL_TAGS.md` — copy-paste ready Wix Advanced SEO bundle: Additional Tags (Open Graph + Twitter Card + canonical) and a single `@graph` JSON-LD block (CollectionPage + WebSite + TravelAgency + ItemList with all 19 widgets as WebApplication offers @ 0 EUR).
- Wrote `widgets-hub/_regenerate_seo.py` — re-reads `tools-hub/data.json` and rewrites the ItemList node inside the SEO doc so the schema stays in sync whenever a new widget is added.

**Changed:**
- `widgets-hub/SEO_ADDITIONAL_TAGS.md` — new doc with Wix paste-ready blocks.
- `widgets-hub/_regenerate_seo.py` — new helper that auto-syncs ItemList from tools-hub data.

**Opened:** Paste both blocks into Wix Studio → /widgets page → Advanced SEO. When a new widget is added to `tools-hub/data.json`, run `python3 widgets-hub/_regenerate_seo.py` and re-paste the Structured Data block.

**Closed:** SEO markup + Additional Tags for /widgets page.

**Next session should:** Push, set up the Wix /widgets page with Custom Code + Advanced SEO blocks, visual QA, then blog #9 Bebelplatz.

---

## 2026-05-17 — Claude Code (Widgets program v1.3: bw-widgets-hub Custom Element for /widgets Wix page)

**Did:**
- Added `widgets-hub/widgets-hub-element.js` — a `<bw-widgets-hub>` Custom Element that mirrors the structural pattern of `<bw-tools-hub>` on `/berlin-tools`. Renders into light DOM (no Shadow), reads `tools-hub/data.json`, builds the sticky category nav + per-widget cards (live auto-resizing preview + Standard/Light/Dark theme picker + copy-to-clipboard) directly in the parent page's DOM. Google indexes every title + lead + backlink as native page content.
- Element auto-loads `embed-resize.js` on connect so live previews resize themselves without Yusuf doing anything extra in Custom Code.
- Kept `widgets-hub/index.html` as a standalone iframe-able mirror (handy for direct visits or partner sites that prefer iframe), but the recommended path on Wix is the Custom Element.
- Updated AGENTS.md to document the `<bw-widgets-hub>` Custom Element as the preferred Wix integration and reframe `index.html` as the iframe fallback, with explicit Custom Code snippet for the `/widgets` Wix page.

**Changed:**
- `widgets-hub/widgets-hub-element.js` — new file (~900 lines including scoped CSS). Defines `BWWidgetsHubElement`, registers `<bw-widgets-hub>`, auto-loads `embed-resize.js`, builds the entire gallery in light DOM. Mirrors `tools-hub-element.js` naming conventions (`.bw-widgets-hub` class prefix, `_renderShell`, `_loadDataAndRender`, `_renderHub`, `_escapeHtml`, etc.).
- `AGENTS.md` — `widgets-hub/` row now describes both surfaces; "Hosting the /widgets gallery on Wix" section rewritten to lead with the Custom Element + Custom Code snippet, demote iframe to fallback.

**Opened:**
- Push and on Wix `/widgets`, add the Custom Code snippet (`<bw-widgets-hub></bw-widgets-hub>` + `<script src="...widgets-hub-element.js">`). Same pattern as `/berlin-tools` uses for `<bw-tools-hub>`.
- Visual QA after Wix publish: scroll, sticky nav, theme pill switching, copy code, paste-test on a sandbox HTML page.

**Closed:** Custom Element surface for `/widgets` page (matches `/berlin-tools` pattern).

**Next session should:** Push, set up the Wix `/widgets` page with the Custom Element script, visual QA. Then either continue blog workplan (#9 Bebelplatz next) or tackle the per-widget interior theming (multi-week).

---

## 2026-05-17 — Claude Code (Widgets program v1.2: auto-height + themes + sticky-fix)

**Did:**
- Added a tiny new `embed-resize.js` (~20 lines) at the repo root. It listens for `bw-resize` postMessage events from any `iframe[data-bw-frame]` on the host page and resizes the iframe to fit its content. One external `<script>` handles every BerlinWalk widget on the embedding page; nothing per-widget to do.
- Reworked the embed snippet so it now ships with `<iframe data-bw-frame>` + the resize script automatically appended. Widgets auto-grow / shrink to their natural content height on third-party sites instead of being pinned to a fixed value picked from a dropdown.
- Replaced the height selector in the embed panel with a Theme picker (3 wrapper-only themes built from BerlinWalk brand colors: Brand / Minimal / Dark). Each pill has a colored swatch. Theme switching live-rebuilds the snippet.
- Removed `js/brand.js` from the gallery itself (`widgets-hub/index.html`). Without it, the gallery does not post `bw-resize` to its Wix parent — the iframe Wix assigns stays at whatever fixed height Yusuf sets, which is required for the in-page sticky `.category-nav` to actually feel sticky to users.
- Removed the `max-height: 420px` cap on `.preview-frame` so live previews show the full widget at its natural auto-resized height inside each gallery card.
- Updated AGENTS.md with: new `embed-resize.js` row in the file map, full snippet structure documentation, and a "Hosting the /widgets gallery on Wix" note explaining the `100vh` iframe height requirement for sticky to work.

**Changed:**
- `embed-resize.js` — new file. PostMessage listener for cross-origin iframe auto-resize.
- `widgets-hub/index.html` — removed brand.js link; dropped fixed `max-height` on `.preview-frame` (gallery preview); preview iframes now carry `data-bw-frame` for auto-resize; removed height-selector UI and replaced with theme pills (Brand / Minimal / Dark); `buildEmbedSnippet` now accepts a theme key, outputs themed wrapper colors, and appends the resize `<script>` automatically; widget-meta label changed from "Recommended height Xpx" to "Auto-height · &lt;category&gt;".
- `AGENTS.md` — file-map row for `embed-resize.js`; full third-party embed snippet structure block; sticky-nav hosting note.

**Opened:**
- Push and verify on the live `/widgets` page: scroll through the gallery, confirm sticky nav stays visible, click theme pills and verify the embed code updates, copy a snippet and paste it into a test page to confirm auto-resize works.
- When embedding `widgets-hub` on Wix, set the iframe to `height: 100vh` with internal scrolling so sticky nav has a constrained viewport to be sticky inside.
- Future: real per-widget theming via a `?theme=light|dark|brand` URL parameter that each widget reads to apply theme classes. Currently only the wrapper is themed.

**Closed:** Auto-height embeds; theme picker; sticky-nav constraint.

**Next session should:** Push + Wix `/widgets` page setup + visual QA. Then revisit whether to deepen theming into widget interiors (multi-week per-widget work) or leave wrapper-only themes as the v1 answer.

---

## 2026-05-17 — Claude Code (Embeddable widgets program v1.1: backlink + category nav)

**Did:**
- Added a sticky category jump-nav at the top of the `/widgets` gallery (Money / Weather / Maps / Discovery pills with widget counts). Yusuf noticed the categorisation was rendering but not visible enough as a navigation aid.
- Rewrote the embed snippet so it includes a visible, crawlable `<a>` link below the iframe pointing to `https://www.berlinwalk.com/widgets`. Search engines ignore iframe `src` for backlink purposes, so the previous iframe-only snippet was sending all SEO juice to `fenerszymanski.github.io`. The text link now gives explicit dofollow backlinks per embed.
- Embed snippet text link gets its own UTM (`utm_source=embed&utm_medium=textlink&utm_campaign=<slug>`) so analytics can separate (a) badge clicks inside the widget from (b) text-link clicks below the embed.
- Cleaned the two user-facing em-dashes in `widgets-hub/index.html` (meta description + hero lead) per brand voice convention.

**Changed:**
- `widgets-hub/index.html` — sticky `.category-nav` CSS + render-time pill nav DOM with per-category widget counts; new `buildEmbedSnippet` emits `<div>` wrapping iframe + visible text backlink; cleaned em-dashes.

**Opened:**
- Set up `widgets.berlinwalk.com` CNAME → `fenerszymanski.github.io` in Wix DNS, add a `CNAME` file at repo root, then bulk-update `tools-hub/data.json` `widgetUrl` values to use the new subdomain. Once live, iframe `src` carries the BerlinWalk domain too, even though crawlers care about the text link rather than the iframe.
- Spot-check the sticky nav on mobile after push — it relies on `position: sticky; top: 0;` and may need a `top: 60px` offset if Wix has a fixed header bar above the embed.

**Closed:** Backlink concern (text link in embed snippet); category navigation visibility.

**Next session should:** Push the gallery updates, then set up the CNAME subdomain when Yusuf has 10 minutes with the Wix DNS panel.

---

## 2026-05-17 — Claude Code (Embeddable widgets program: attribution badge + /widgets gallery + UTM)

**Did:**
- Built a shared "by berlinwalk.com" attribution badge that brand.js auto-injects into every widget body. Green strip, mini logo + text + arrow, links to `berlinwalk.com` with a structured UTM (`utm_source=embed&utm_medium=widget&utm_campaign=<widget-slug>&utm_content=footer-badge`). Suppressible with `?attribution=none` for internal preview embeds.
- Extended `tools-hub/data.json` so every one of the 19 tool entries now carries `widgetUrl` (full GitHub Pages URL) and `embedHeight` (recommended iframe height). This makes the file the single source of truth for both the `/tools` directory and the new `/widgets` embed gallery; new widgets show up everywhere as soon as a tools-hub entry lands.
- Built `widgets-hub/` (gallery page modeled on vientapps.com/tools/widgets style, adapted to BerlinWalk's tools-hub design language): grouped by category, each card has a lazy-loaded live iframe preview (`loading="lazy"`, capped at 420 / 360 px overflow scroll), a height selector, an embed code textarea with one-click copy, and an "Open standalone" link. Reads directly from `tools-hub/data.json`, so the gallery auto-grows with every new tool.
- Updated `AGENTS.md` with: new `tools-hub` / `widgets-hub` / `tools-home` / `js/brand.js` / `css/brand.css` rows in the file map, the new `berlinwalk.com/tools`, `/tools/<slug>`, and `/widgets` live URLs, a full "When adding a new BerlinTools widget" checklist, and the attribution badge + UTM convention.

**Changed:**
- `js/brand.js` — added a second IIFE that injects `.bw-attr-badge` into every widget body. Idempotent, runs in standalone and iframe contexts, skips when `?attribution=none`.
- `css/brand.css` — added `.bw-attr-badge` plus `.bw-attr-logo / .bw-attr-text / .bw-attr-arrow` styles and a small-screen variant.
- `tools-hub/data.json` — added `widgetUrl` and `embedHeight` to all 19 tool entries. Mapping derived from widget folder titles in the repo (`avgtemp-bestmonth` → "Best Month to Visit Berlin", `transport-calculator` → "Berlin Transport Ticket Calculator", etc.).
- `widgets-hub/index.html` — new self-contained gallery page (HTML + inline CSS + inline JS), fetches `../tools-hub/data.json`, builds one card per tool, exposes embed code with a height picker and copy button.
- `AGENTS.md` — repo map row additions, new live URLs, new "When adding a new BerlinTools widget" §7 checklist, attribution badge + UTM convention.

**Wix CMS quirk learned this session:**
- `POST /wix-data/v2/items/query` with `dataCollectionId: BerlinTools` returns 0 items even when items exist (confirmed by working GET on a known item ID). Tried `consistentRead`, `dataOptions.appOptions.environment` (PUBLISHED_AND_VISITORS / LIVE / BACKEND / SANDBOX), and the `wix-data-environment` header — all returned 0. GET by ID still works fine. Worked around by deriving the slug → widgetUrl mapping from local widget folder titles instead of querying the CMS.

**Opened:**
- Push the local repo so GitHub Pages serves the new `widgets-hub/`, the updated `tools-hub/data.json`, and the new `brand.js` + `brand.css` (the attribution badge will appear on all 19 widgets the moment the push lands).
- Create the live Wix `/widgets` page in Wix Studio with a Custom HTML embed pointing at `https://fenerszymanski.github.io/berlinwalk-widgets/widgets-hub/`.
- Confirm SEO for `/widgets`: title "Free Berlin Widgets to Embed on Your Site | BerlinWalk", description from the gallery `<meta>` tag, og + twitter cards (mirror the blog draft Advanced SEO pattern).
- Spot-check three or four widgets (welcomecard-calculator, free-things-map, luggage-storage-map, daylight-visualizer) after the push — the badge should be visible at the bottom of each.
- Tune any `embedHeight` values that look wrong in the live gallery — heights are educated guesses (640 default for maps, 720 for calculators, 900 for big tables).

**Closed:** Embeddable widgets program v1 — branding badge, UTM convention, gallery page, AGENTS.md documentation.

**Next session should:** Push, then build the Wix `/widgets` page. After that, consider light outreach (DM a few Berlin hostels / expat blogs) and revisit if Yusuf wants the gallery split into "Available now" vs "Coming soon" sections like vientapps does.

---

## 2026-05-17 — Claude Code (Luggage Storage tool added to BerlinTools hub)

**Did:**
- Added `berlin-luggage-storage` to the tools hub local data (under Maps & Practical) so the public toilet + drinking water + sunday shopping row gains a luggage-map sibling.
- Created the BerlinTools CMS item for `/tools/berlin-luggage-storage` via Wix Data v2 INSERT, mirroring the public-toilets row exactly: widgetUrl, h1/title/lead/secondary/intro, SEO title + description, WebApplication JSON-LD, related-tool wiring (public-toilets, drinking-water), related-blog wiring to the just-published luggage storage post, and a Ricos `bodyContent` block with "How to Use", "What the Map Shows", "Berlin Luggage Storage Basics" bulleted list, and "Privacy Note".
- Left the tool without an `image` so the hub uses the first-letter fallback; a matching icon can be generated and uploaded later if Yusuf wants to refresh the 18-tool set to 19.
- Did not add to `tools-home/data.json` (the curated 6-item homepage list) — luggage storage is practical but not pillar-traffic-worthy enough to bump an existing entry.

**Changed:**
- `tools-hub/data.json` — added `berlin-luggage-storage` entry under Maps category (no `image` field, first-letter fallback).
- Wix: created BerlinTools CMS item `e8fa568f-6f46-44d8-be2c-c79dae0e92f3`, slug `berlin-luggage-storage`, embedUrl `https://fenerszymanski.github.io/berlinwalk-widgets/luggage-storage-map/`.

**Opened:**
- Push the local `tools-hub/data.json` change so GitHub Pages serves the new entry and the live `/tools` hub grid picks up the 19th tool card.
- Confirm in Wix Studio that the dynamic `/tools/<slug>` page template auto-renders the new BerlinTools row (no extra Studio work expected — the existing dynamic page should pick it up via the slug field).
- Optional: generate a matching pastel icon (512px + 160px), upload to Wix Media, and add the `image` URL to the tools-hub entry to match the other 18 tools visually.

**Closed:** Luggage Storage tool added to the BerlinTools hub CMS + tools-hub local data.

**Next session should:** Push the tools-hub change and visually confirm the new card on `/tools` and the new `/tools/berlin-luggage-storage` dynamic page. Then return to the Nikolaiviertel Wix draft when Yusuf takes it off hold.

---

## 2026-05-17 — Claude Code (Luggage Storage + Nikolaiviertel Wix drafts + full SEO)

**Did:**
- Created both Wix Blog drafts via local REST with the user-supplied Wix API key, using the same Draft.js + NBSP `font-size:6px` spacer + multi-embed pattern proven on the Free Things draft.
- Embedded all three widgets per post (quick-summary, post-specific map, FAQ) at the planned positions.
- Set full SEO on each: meta title, meta description, og:title/og:description, og:type=article, twitter:card=summary_large_image plus twitter:title/twitter:description, primary focus keyword and four secondary keywords.
- Wiped `/tmp/wix_key.txt` and the local build script after both drafts were created and verified.

**Changed:**
- `blog-drafts/luggage-storage-in-berlin-2026.md` — added Wix draft ID `46951fc3-d0a4-4f8f-9429-92177cb033fd`.
- `blog-drafts/nikolaiviertel-rebuilt-old-town-2026.md` — added Wix draft ID `48bf0945-63d9-46cd-b9af-a8fb87ab3c75`.
- `blog-workplan.md` — bumped #7 and #8 from Draft v1 to Wix draft and recorded both draft IDs.
- `SESSION_LOG.md` — added this handoff entry.
- Wix: created draft `46951fc3-d0a4-4f8f-9429-92177cb033fd` ("Where to Store Luggage in Berlin for a Few Hours (2026)") in `Tourist Tips`, tags `Berlin Tourism Tips` + `Berlin Travel Tips` + `First-Time Berlin Tips`; status UNPUBLISHED, seoSlug `luggage-storage-in-berlin-2026`, 178 blocks (89 spacers), 3 embeds, 4 internal links, 10 H2 sections, 40 list items, minutesToRead 6.
- Wix: created draft `48bf0945-63d9-46cd-b9af-a8fb87ab3c75` ("Nikolaiviertel: Berlin's Rebuilt Old Town and Why It Feels So Strange") in `Tourist Tips`, tags `Berlin Landmarks` + `Berlin Tourism Tips` + `Berlin Museum Tips`; status UNPUBLISHED, seoSlug `nikolaiviertel-rebuilt-old-town`, 136 blocks (68 spacers), 3 embeds, 8 internal links, 10 H2 sections, 29 list items, minutesToRead 6.
- Wix: both drafts include the 4 custom advanced-SEO tags (og:type, twitter:card, twitter:title, twitter:description) on top of the standard auto-generated SEO.

**Opened:** Push the local repo so GitHub Pages serves the two new widgets (`luggage-storage-map`, `nikolaiviertel-walk`) and the updated quick-summary/FAQ data; the iframe embeds inside both Wix drafts already point at those URLs. Visually preview both drafts in the Wix editor, add cover/inline images, and publish when Yusuf is happy.
**Closed:** Luggage Storage Wix draft + complete SEO; Nikolaiviertel Wix draft + complete SEO; workplan #7 and #8 advanced from Draft v1 to Wix draft.

**Next session should:** Once the GitHub Pages push is live, open both new Wix drafts in Wix Studio, confirm all six iframe embeds render correctly, add cover images, and publish. Then the next queued ideas are Bebelplatz (#9), Tränenpalast (#10), and Hackescher Markt After the Tour (#11).

---

## 2026-05-17 — Claude Code (Luggage Storage + Nikolaiviertel drafts v1 + two new widgets)

**Did:**
- Drafted workplan #7 "Where to Store Luggage in Berlin" (~1700 words, Yusuf voice, no em dashes) covering DB lockers, the Hauptbahnhof Gepäckcenter, BER airport storage, app-based services (Bounce / Radical / Stasher), and the walking-tour-with-bags question.
- Drafted workplan #8 "Nikolaiviertel: Berlin's Rebuilt Old Town and Why It Feels So Strange" (~1700 words) explaining the 1980-1987 GDR rebuild by Günter Stahn, what is genuinely old (Nikolaikirche, Knoblauchhaus, Ephraim-Palais salvaged stones) vs. 1980s pastiche, with a 10-stop self-guided walking loop.
- Built two new post-specific widgets: `luggage-storage-map` (Leaflet, 14 pinned locations across 4 filter categories: station lockers / staffed centres / airport / app pickup zones) and `nikolaiviertel-walk` (Leaflet, 10 numbered self-guided stops with a dashed polyline route and colour-coded "genuinely old / salvaged facade / GDR rebuild / tavern" badges).
- Wired both new slugs (`luggage-storage`, `nikolaiviertel`) into quick-summary, FAQ data, FAQ slug map, and FAQPage JSON-LD schema.

**Changed:**
- `blog-drafts/luggage-storage-in-berlin-2026.md` — new draft v1 with widget plan, quick summary, full draft, sample last-day plan, and source list.
- `blog-drafts/nikolaiviertel-rebuilt-old-town-2026.md` — new draft v1 with widget plan, quick summary, full draft, self-guided walking loop, and source list.
- `luggage-storage-map/index.html` — new Leaflet widget with 4 category filters.
- `nikolaiviertel-walk/index.html` — new Leaflet widget with numbered markers, dashed polyline route, and legend.
- `quick-summary/data.json` — added `luggage-storage` and `nikolaiviertel` entries (6 items each).
- `faq/data.json` — added `luggage-storage` and `nikolaiviertel` entries (5 Q/A items each).
- `faq/inject.js` — added `luggage-storage-in-berlin-2026 → luggage-storage` and `nikolaiviertel-rebuilt-old-town → nikolaiviertel` to SLUG_MAP and the matching FAQPage schemas in SCHEMAS.
- `blog-workplan.md` — marked #7 and #8 as Draft v1, bumped Last updated to 2026-05-17, added new draft files and widget folders to the Drafts list.
- Wix: no remote changes (Yusuf asked for local approval before moving to Wix).

**Opened:** Push the local repo so GitHub Pages serves the two new widgets and updated quick-summary/FAQ data. Move both drafts into Wix as UNPUBLISHED blog posts once Yusuf approves. For each Wix draft, embed the three widget URLs (`/quick-summary/?post=<slug>`, the post-specific map, `/faq/?post=<slug>`), and pick cover/inline images.
**Closed:** Luggage Storage + Nikolaiviertel drafts v1 plus widget plumbing for slugs `luggage-storage` and `nikolaiviertel`.

**Next session should:** Push the local changes so GitHub Pages serves the two new widgets and updated data, then on Yusuf's approval create the Wix blog drafts for both posts using the same Draft.js + NBSP `font-size:6px` spacer + 4-embed pattern proven on the Free Things draft. After that, the next queued ideas are Bebelplatz (#9), Tränenpalast (#10), and Hackescher Markt After the Tour (#11).

---

## 2026-05-16 — Claude Code (Free Things to Do Wix draft + SEO)

**Did:**
- Created the Wix Blog draft for "Free Things to Do in Berlin in 2026" via local REST with the user-supplied Wix API key.
- Built the Draft.js body with 80 content blocks plus 80 NBSP `font-size:6px` spacer paragraphs (matches public-toilets convention) so paragraph gaps render correctly in the Wix editor.
- Embedded all four widgets (quick-summary, `free-things-map`, `free-things-compare`, FAQ) at the planned positions.
- Set full SEO: meta title, meta description, og:title/og:description, og:type=article, twitter:card=summary_large_image plus twitter:title/twitter:description, primary focus keyword and four secondary keywords. seoSlug `free-things-to-do-in-berlin-2026`.
- Wiped `/tmp/wix_key.txt` and the local build script after the draft was created.

**Changed:**
- `blog-drafts/free-things-to-do-in-berlin-2026.md` — added the new Wix draft ID and status.
- `blog-workplan.md` — bumped #1 from Draft v1 to Wix draft; recorded the new Wix draft ID.
- `SESSION_LOG.md` — added this handoff entry.
- Wix: created draft `b9b03f3e-c2c0-4929-8492-5dce2142107b` in `Tourist Tips` (categoryId `6da64e22-3360-42ec-a558-e906e4deeb19`), status `UNPUBLISHED`, member `5a08a3af-4b9b-4403-9de7-3e26eba72dc0`, tags `Top Free Berlin Attractions` + `Berlin Budget Travel 2026` + `Berlin Tourism Tips`. Content: 80 paragraphs/headers/lists + 80 spacers + 4 widget embeds + 18 internal links; minutesToRead 7. SEO tags include 4 custom advanced-SEO tags (og:type, twitter:card, twitter:title, twitter:description).

**Wix idiosyncrasies learned this session:**
- `draftPost.slugs` is **read-only** on PATCH (returns `INVALID_ARGUMENT: 'slugs' is readonly`). On create, the field is also ignored — Wix populates it server-side, apparently at publish time. To control the live URL, set `seoSlug` only; the auto-generated draft preview path (e.g. `/post/...-in-berlin-in-2026` with a duplicated "in" from the title) is replaced by the seoSlug-derived URL when the post is published.
- `draftPost.seoData.settings.keywords` is capped at **5 entries** (initial create with 6 returned `MAX_SIZE` error).
- The `fieldsets` query param on GET `/blog/v3/draft-posts/{id}` only accepts a single value cleanly; some combinations (e.g. `CONTENT_TEXT`) return `Failed to parse JSON or deserialize protobuf message`. `fieldsets=URL` returns the SEO bundle, `fieldsets=CONTENT` returns the rich content blocks.

**Opened:** Visually preview the new Wix draft in the editor — confirm the 4 embed iframes resize correctly, the 6px spacer paragraphs render at the right gap, and cover image/inline images are added before publishing. Push the local repo so GitHub Pages serves the two new widgets (`free-things-map`, `free-things-compare`) and updated quick-summary/FAQ data; the iframe embeds inside the Wix draft are already pointing at those URLs.
**Closed:** Free Things to Do Wix draft created with full body, embeds, and complete SEO + Advanced SEO meta.

**Next session should:** Open Wix Studio → Blog → Drafts → "Free Things to Do in Berlin in 2026" and visually confirm the layout. Once the GitHub Pages push is live and the embeds render, add a cover image and publish. Then the next queued ideas are Luggage Storage (#7) and Nikolaiviertel (#8).

---

## 2026-05-16 — Claude Code (Free Things to Do in Berlin draft v1 + two new widgets)

**Did:**
- Drafted workplan #1: "Free Things to Do in Berlin in 2026" (~1700 words, Yusuf voice, no em dashes, internal-linked into the live blog inventory).
- Built two new post-specific widgets: `free-things-map` (Leaflet, 21 free or near-free stops across memorials, museums, parks, and free views) and `free-things-compare` (free vs paid decision table, 10 rows).
- Wired the new `free-things-to-do` slug into quick-summary, FAQ data, FAQ slug map, and FAQPage JSON-LD schema.

**Changed:**
- `blog-drafts/free-things-to-do-in-berlin-2026.md` — new draft v1 with widget plan, quick summary, full draft, and source list.
- `free-things-map/index.html` — new Leaflet widget with 4 category filters and brand-styled popups.
- `free-things-compare/index.html` — new responsive comparison table, mobile-card layout below 640px.
- `quick-summary/data.json` — added `free-things-to-do` entry (6 items).
- `faq/data.json` — added `free-things-to-do` entry (6 Q/A items).
- `faq/inject.js` — added `free-things-to-do-in-berlin-2026 → free-things-to-do` to SLUG_MAP and a matching FAQPage schema in SCHEMAS.
- `blog-workplan.md` — marked #1 as Draft v1, bumped Last updated, added new draft + widget folders to the Drafts list.
- Wix: no remote changes.

**Opened:** Push the local repo so GitHub Pages serves the new `free-things-map`, `free-things-compare`, and updated quick-summary/FAQ data. Move the draft into Wix as an UNPUBLISHED blog post when Yusuf is on desktop with the Wix API key, embed the four widget URLs (`/quick-summary/?post=free-things-to-do`, `/free-things-map/`, `/free-things-compare/`, `/faq/?post=free-things-to-do`), and pick cover/inline images.
**Closed:** Free Things to Do draft v1 + widget plumbing for slug `free-things-to-do`.

**Next session should:** Push the local changes so GitHub Pages serves the two new widgets and updated data, then create the Wix blog draft for the Free Things post. After that, the next queued ideas are Luggage Storage (#7) and Nikolaiviertel (#8).

---

## 2026-05-16 — Codex (public toilets Wix draft + tool icons)

**Did:**
- Created the interactive `public-toilets-map` widget with live Berlin Open Data WFS pins, filters, manual map-click location fallback, and nearest-to-user distance.
- Created the Wix Blog draft for "Public Toilets in Berlin: What Tourists Actually Need to Know".
- Set SEO title, meta description, slug, and focus keyword settings in the Wix draft.
- Repatched the draft body with tiny NBSP spacer paragraphs and stronger bold emphasis after visual review showed paragraphs were too tight.
- Added the public toilet finder to the tools hub and created its live BerlinTools CMS page.
- Generated a refreshed 18-icon BerlinTools set, split it into individual 512px and 160px PNGs, uploaded all 18 160px icons to Wix Media, and wired the live `/tools/*` related-card section to use them.
- Verified the live public-toilets related cards now load the new Drinking Water and Sunday Shopping icons from Wix Media, with the first-letter fallback retained only for future unknown slugs.
- Added a live mobile hero spacing patch after Safari/narrow mobile showed the secondary hero line colliding with the primary widget on the public-toilets page.

**Changed:**
- `public-toilets-map/index.html` — new Leaflet map widget.
- `blog-drafts/public-toilets-in-berlin-2026.md` — added the map embed URL and recorded Wix draft ID/status.
- `tools-hub/data.json` — added `berlin-public-toilets` under Maps & Practical.
- `tools-home/data.json` — refreshed the six homepage tool icon URLs.
- `tools-home/icons/` — added the generated 18-tool icon set and manifest with Wix Media URLs.
- `tools-hub/data.json` — added `image` URLs for all 18 tools.
- `js/berlintools-mobile-fixes.js` — mirrored the extra mobile spacing between the hero secondary line and the primary widget.
- `README.md` — listed the new public toilets map widget.
- Wix: created draft `bedfc2b9-e64f-41b2-990b-24675c9f5b2b` in `Tourist Tips`, status `UNPUBLISHED`, with quick-summary/map/FAQ embeds.
- Wix: created BerlinTools item `2efa6553-3a34-4950-9d10-3e7a0d66338d` for `/tools/berlin-public-toilets`, using `https://fenerszymanski.github.io/berlinwalk-widgets/public-toilets-map/`.
- Wix: updated Custom Embed `BerlinTools Layout Fixes` (`0dd3e5f3-520b-47ae-a995-e767f222265f`) to revision 6 so `More Berlin Tools` uses the refreshed 18-icon map.
- Wix: created Custom Embed `BerlinTools Mobile Hero Spacing` (`2dc09ff7-61f1-476d-8ec9-16da4cfb595e`), revision 1, and verified the live mobile gap between secondary text and widget is ~44px at 390px and 430px viewport widths.

**Opened:** Push the local repo so GitHub Pages reflects the new public-toilets widget/card and refreshed homepage/hub icon data.
**Closed:** Public Toilets moved from local draft to Wix draft; live BerlinTools page created.

**Next session should:** If not already pushed, use GitHub Desktop to push the local commits so GitHub Pages serves the new map, hub card, and refreshed icon data.

---

## 2026-05-16 — Codex (reviews SEO markup)

**Did:**
- Gave Yusuf the GitHub Pages URLs for the reviews widget and Custom Element script
- Prepared conservative Advanced SEO markup for the Wix `/reviews` page: `CollectionPage` JSON-LD plus Open Graph/Twitter meta tags
- Advised leaving robots meta unchecked and avoiding `Review` / `AggregateRating` schema for now

**Changed:**
- `AGENTS.md` — recorded the `/reviews` structured-data convention and fixed `/leave-review` live URL wording to Custom Element
- Wix: Yusuf manually added reviews page structured data + additional tags in Wix Studio

**Opened:** None
**Closed:** Reviews page Advanced SEO markup guidance

**Next session should:** Push the latest local handoff edits if desired, then continue with the top open item: move the `public-toilets` draft into Wix when Yusuf provides the Wix API key.

## 2026-05-16 — Claude Code (Public Toilets blog draft v1)

**Did:**
- Drafted the next blog post: "Public Toilets in Berlin: What Tourists Actually Need to Know" (workplan #6)
- Grounded the factual claims in Berlin.de senate sources and the city's recent announcement of 107 free, gender-neutral cabins
- Wired the new post slug (`public-toilets`) into both `quick-summary/data.json` and `faq/data.json`, and added the FAQPage JSON-LD entry to `faq/inject.js` SLUG_MAP and SCHEMAS

**Changed:**
- `blog-drafts/public-toilets-in-berlin-2026.md` — new draft v1, first-person Yusuf voice, no em dashes, links to the live free-museums, daily-budget, and free-tour pages
- `quick-summary/data.json` — added `public-toilets` entry
- `faq/data.json` — added `public-toilets` entry with 5 Q/A items
- `faq/inject.js` — appended `public-toilets-in-berlin → public-toilets` to SLUG_MAP and the matching FAQPage schema to SCHEMAS
- `blog-workplan.md` — bumped `Last updated` to 2026-05-16, marked Public Toilets as Draft v1, listed the new draft file
- Wix: no remote changes

**Opened:** Move the draft into Wix as an UNPUBLISHED blog post when Yusuf is on desktop with the Wix API key, embed the two widget URLs (`/quick-summary/?post=public-toilets`, `/faq/?post=public-toilets`), and pick cover/inline images.
**Closed:** Public Toilets draft v1 + widget plumbing

**Next session should:** Push the local changes so GitHub Pages serves the new quick-summary/FAQ data, then create the Wix blog draft for the public-toilets post. After that, the next two queued ideas are Luggage Storage (#7) and Nikolaiviertel (#8).

---

## 2026-05-16 — Claude Code (Ethan A. FreeTour review imported)

**Did:**
- Imported a new FreeTour.com review (Ethan A., United States, 5★, May 14 2026, "Unique Tour of Berlin") into the Reviews collection via Wix Data v2 REST API
- Preserved the source typo (`thr Humboldt Forum`) per the "no edits, no filters" brand rule
- Verified `listReviews` now returns 7 reviews (was 6) and Ethan's record is first

**Changed:**
- Wix: inserted Reviews row `_id 82b528c3-416a-4575-b8fd-9df0763c4f98` with `approved=true`, `source=FreeTour.com`, `sourceUrl=https://www.freetour.com/company/97387`

**Opened:** None
**Closed:** Ethan A. review import; Karen S. country correction (was wrongly `USA`, actually `United Kingdom` per Yusuf — fixed via Wix Data v2 PUT on item `53e207df-aa54-4c6c-a0f2-b1937df505b3`)

**Next session should:** Pick up whatever Yusuf prioritizes next. Cancel-on-cancel is still deferred far out per Yusuf.

**Wix Data v2 REST quirk learned:** The Reviews collection update path used `PUT /wix-data/v2/items/{id}` with the full `dataItem.data` block. The first attempt with `PATCH` and a `dataItem.data` body returned `WDE0080 Validation failed — patch.fieldModifications has size 0`, so PATCH wants a different shape (`patch.fieldModifications: [{...}]`). For one-off field edits, full-record PUT is the simpler path.

---

## 2026-05-16 — Claude Code (CE swap landed)

**Did:**
- Yusuf pushed the new `bw-leave-review` element and swapped the Wix `/leave-review` page from the iframe block to a Custom Element block; mobile-height workaround dropped
- Verified the live page: `curl https://www.berlinwalk.com/leave-review` now contains `<bw-leave-review></bw-leave-review>` in the rendered HTML, so the swap is real
- Realigned `AGENTS.md` §8: only cancel-on-cancel remains, and that's deferred per Yusuf

**Changed:**
- `AGENTS.md` §8 — closed the `/leave-review` Wix swap item; cancel-on-cancel is now the sole entry and flagged as deferred
- Wix: `/leave-review` page swapped from iframe to a `<bw-leave-review>` Custom Element block

**Opened:** None
**Closed:** `/leave-review` Wix iframe → Custom Element migration

**Next session should:** Smoke-test the live `/leave-review` form on mobile + desktop end-to-end (use the link from a real post-tour email or hand-craft `?bid=...&n=...`), submit a test review, and verify the new row lands in the Reviews CMS with `approved=false`. If healthy, that wraps the review system rebuild for now and we can pick whatever Yusuf prioritizes next (blog queue, FAQ work, etc.).

---

## 2026-05-16 — Claude Code (continued)

**Did:**
- Built the `bw-leave-review` Custom Element to replace the `/leave-review` iframe
- Mirrored the iframe's form behavior 1:1 (star rating, validation, submitReview POST, thanks state) but scoped under `.bw-leave-review` with `bw-lr-*` IDs so it survives in light DOM next to Wix styles
- Added `leave-review/preview.html` so the CE can be eyeballed locally the same way `reviews/index.html` is used

**Changed:**
- `leave-review/leave-review-element.js` — new file, full CE port of the iframe form; reads `?bid` / `?n` from the host page URL; POSTs to `https://www.berlinwalk.com/_functions/submitReview`
- `leave-review/preview.html` — new local CE test harness, identical pattern to `reviews/index.html`
- `leave-review/index.html` — untouched on purpose so the current Wix iframe keeps working until the swap
- `AGENTS.md` §2 — described the new dual state of the `leave-review/` folder
- `AGENTS.md` §8 — closed the homepage `bw-testimonials` → `listReviews` item that landed earlier today; reworded the `/leave-review` item to be the Wix-side swap; reordered so the Wix swap is #1 and cancel-on-cancel (deferred) is #2
- Wix: no remote changes

**Opened:** None new. The Wix migration step is now §8 #1 — Yusuf to swap the `/leave-review` page from the current iframe to a Custom Element block that loads `https://fenerszymanski.github.io/berlinwalk-widgets/leave-review/leave-review-element.js` and embeds `<bw-leave-review></bw-leave-review>`, then remove the mobile-height workaround on that section.
**Closed:** Homepage `bw-testimonials` carousel rewrite (landed earlier today); local code for the `/leave-review` Custom Element

**Next session should:** Once Yusuf has pushed and swapped Wix to use `bw-leave-review`, smoke-test the form end-to-end on mobile + desktop (rating, validation, submit, thanks state) and confirm the moderation gate still works (new review lands with `approved=false`). After that, the natural next item is the cancel-on-cancel end-to-end test when Yusuf is ready.

---

## 2026-05-16 — Claude Code

**Did:**
- Confirmed Yusuf published the four Wix blog drafts (free museums + July/August/September 2026)
- Converted `bw-testimonials` from `data.json` to the `listReviews` API so site-submitted reviews now flow into the homepage carousel
- Kept `data.json` as an offline fallback for resilience if the API is unreachable

**Changed:**
- `AGENTS.md` §8 — removed the closed "preview/publish blog drafts" TODO
- `testimonials/testimonials-element.js` — primary source is now `https://www.berlinwalk.com/_functions/listReviews?limit=100`, with normalization of API fields into the existing carousel shape (`reviewText`→`quote`, `firstName`/`lastInitial`/`showName`→`author`, etc.). Sorts by `tourDate` desc, caps at 12 slides, computes average rating live, hides the source label for `direct` reviews, and falls back to the GitHub Pages `data.json` on API failure
- Wix: no remote changes

**Opened:** Visually confirm the homepage carousel after Yusuf pushes (cache-bust with `?cb=…`). Make sure the FreeTour reviews still render and that nothing breaks layout when source labels are hidden for future direct reviews.
**Closed:** Homepage `bw-testimonials` now consumes `listReviews`; blog-draft preview/publish TODO

**Next session should:** Continue down the open TODO list — convert `/leave-review` from iframe to a Custom Element (mobile sizing fix), or test the cancel-on-cancel flow end-to-end with a real test booking.

## 2026-05-17 — Codex

**Did:**
- Expanded the movie/TV post with stronger, more specific filming-location notes for every film and series
- Kept cautious wording where locations are contextual, studio-based, or fan-mapped rather than official exact scene claims
- Refreshed the Wix movie/TV draft and verified the new location terms are present

**Changed:**
- `/Users/yusufucuz/Documents/New project/famous-movies-tv-shows-filmed-in-berlin-draft.md` — added detailed location notes for Run Lola Run, Wings of Desire, Christiane F., Good Bye Lenin!, The Lives of Others, Victoria, Bourne, Hunger Games, Babylon Berlin, Dark, Homeland, Berlin Station, Sense8, Deutschland 83, The Queen's Gambit, and Unorthodox
- Wix: updated draft `a026aeb9-6126-4adc-bebd-2dcd5c88fb8b`; verified key location terms including Albrechtstraße, Staatsbibliothek, Gropiusstadt, Hildburghauser Straße, Normannenstraße, Tiergarten Tunnel, Tempelhof Airport, Theater im Delphi, Reinfelder Schule, and Musikinstrumentenmuseum

**Opened:** none
**Closed:** Movie/TV location-depth pass and Wix draft refresh.

**Next session should:** Visually skim the Wix draft in the editor, then publish when Yusuf is happy.

## 2026-05-17 — Codex

**Did:**
- Researched and drafted the Berlin parking article with the Alexanderplatz / BerlinWalk tour-start angle
- Built two new widgets: an Alexanderplatz parking map with Google Maps directions and a Berlin parking cost calculator
- Added matching quick-summary, FAQ, and tools-hub entries for the parking post/widget stack

**Changed:**
- `blog-drafts/where-to-park-in-berlin-alexanderplatz-2026.md` — new draft v1 with Umweltzone, Mitte street parking, central garages, P+R, and tour-arrival advice
- `alexanderplatz-parking-map/index.html` — new Leaflet map for central garages and P+R options around the World Clock
- `berlin-parking-calculator/index.html` — new calculator comparing central garage parking with P+R + BVG
- `quick-summary/data.json` — added `parking-berlin`
- `faq/data.json` — added `parking-berlin`
- `tools-hub/data.json` — added both new parking widgets
- `blog-workplan.md` — moved the parking idea to Draft v1 and linked the new draft/widgets

**Opened:** Review exact garage copy/rates before Wix publishing if Yusuf wants a stricter price table; create/publish Wix draft after visual approval.
**Closed:** Parking post initial research, local draft v1, and local widget implementation.

**Next session should:** Preview the new parking widgets after GitHub Pages deploy, then move the parking article into Wix with Quick Summary, map, calculator, and FAQ embeds.

## 2026-05-17 — Codex

**Did:**
- Cleaned the movie/TV Wix draft so editorial planning sections are no longer visible in the post
- Moved movie/TV source links into the relevant paragraphs and added more BerlinWalk internal links
- Updated the parking draft with the same inline-source/internal-link approach and generated a GPT Image 2 low hero image

**Changed:**
- `/Users/yusufucuz/Documents/New project/famous-movies-tv-shows-filmed-in-berlin-draft.md` — removed the Widget Idea and Sources sections, distributed links into the article, and added more internal links
- `/Users/yusufucuz/Documents/New project/blog-media/parking-berlin/generated/berlin-parking-alexanderplatz-hero-gpt-image-2-low.png` — new 1536x1024 parking hero image
- `blog-drafts/where-to-park-in-berlin-alexanderplatz-2026.md` — added hero image, moved external source links into context, and added more BerlinWalk internal links
- Wix: updated draft `a026aeb9-6126-4adc-bebd-2dcd5c88fb8b`; verified no `Widget Idea` or `Sources and Further Reading` text remains

**Opened:** Parking article is still local only; move it to Wix when Yusuf approves the copy/hero.
**Closed:** Movie/TV draft cleanup and Wix draft refresh.

**Next session should:** Create the parking Wix draft with hero, Quick Summary, map, calculator, FAQ, SEO settings, and appropriate internal/external link targets.

## 2026-05-15 — Codex

**Did:**
- Repaired the four current Wix blog drafts after the paragraph-spacing experiment over-spaced them
- Restored normal Ricos paragraph structure, added selective bolding for scanability, and re-added free museums images from Wix Media Gallery
- Verified all four drafts are readable via API, still `UNPUBLISHED`, and retain their widget embeds
- Added tiny 6px spacer paragraphs between adjacent body paragraphs after visual review showed normal Ricos paragraphs still looked cramped

**Changed:**
- `AGENTS.md` — corrected the Wix Blog paragraph-spacing gotcha: use only tiny 6px spacer paragraphs, never full-size blank paragraphs
- Wix: repaired draft `111844a6-5b4d-418e-be34-d651f3adfe9d`; now 6 images, 4 embeds, selective bolding
- Wix: repaired draft `e14a0e69-480f-472f-bea5-a5010e3893cb`; now 7 embeds, selective bolding
- Wix: repaired draft `0da7a350-14e7-4c59-bcb5-ba80fc4654d5`; now 7 embeds, selective bolding
- Wix: repaired draft `5e1ac42b-7878-4e2b-97de-e75b2458fc49`; now 7 embeds, selective bolding

**Opened:** Visually inspect the four Wix drafts in the editor; API verification is clean, but layout/crop still needs human preview
**Closed:** Over-spaced paragraph state and API-read instability from the spacer paragraph approach

**Next session should:** Preview the four drafts on desktop/mobile, then handle Advanced SEO only after visual layout is stable.

## 2026-05-15 — Codex

**Did:**
- Fixed paragraph spacing in the four Wix blog drafts created today
- Verified all affected drafts remain `UNPUBLISHED` and their widget embeds are still present

**Changed:**
- `AGENTS.md` — documented the Wix Blog paragraph-spacing import gotcha
- Wix: added blank spacer paragraphs between adjacent body paragraphs in draft `111844a6-5b4d-418e-be34-d651f3adfe9d`
- Wix: added blank spacer paragraphs between adjacent body paragraphs in draft `e14a0e69-480f-472f-bea5-a5010e3893cb`
- Wix: added blank spacer paragraphs between adjacent body paragraphs in draft `0da7a350-14e7-4c59-bcb5-ba80fc4654d5`
- Wix: added blank spacer paragraphs between adjacent body paragraphs in draft `5e1ac42b-7878-4e2b-97de-e75b2458fc49`

**Opened:** Visually confirm the paragraph spacing in the Wix editor, then add/select cover and inline images using `blog-visual-plan.md`
**Closed:** Paragraph spacing bug in the four current Wix drafts

**Next session should:** Preview the four drafts in Wix editor on desktop/mobile, adjust any over-spaced sections by hand if needed, then add images.

## 2026-05-15 — Codex

**Did:**
- Created Wix Blog drafts for the July, August, and September 2026 posts
- Verified each draft is `UNPUBLISHED`, in `Tourist Tips`, and contains the seven June-style embeds in order
- Recorded the new Wix draft IDs locally

**Changed:**
- `blog-drafts/berlin-in-july-2026.md` — added Wix draft ID/status
- `blog-drafts/berlin-in-august-2026.md` — added Wix draft ID/status
- `blog-drafts/berlin-in-september-2026.md` — added Wix draft ID/status
- `blog-workplan.md` — marked July/August/September as Wix drafts with IDs
- Wix: created draft `e14a0e69-480f-472f-bea5-a5010e3893cb` for `berlin-in-july-2026`
- Wix: created draft `0da7a350-14e7-4c59-bcb5-ba80fc4654d5` for `berlin-in-august-2026`
- Wix: created draft `5e1ac42b-7878-4e2b-97de-e75b2458fc49` for `berlin-in-september-2026`

**Opened:** Commit/push the local Wix draft ID/log updates, then visually preview the free museums, July, August, and September drafts on desktop/mobile and add/select images
**Closed:** July, August, and September moved from local drafts to Wix drafts

**Next session should:** Commit/push the local ID/log updates, then preview all four Wix drafts with the visual plan and add/select cover images.

## 2026-05-15 — Codex

**Did:**
- Drafted the Berlin in September 2026 article
- Matched the live June post's seven-widget stack for September
- Smoke-tested all September widget URLs locally
- Added a visual/image plan for today's blog drafts

**Changed:**
- `AGENTS.md` — added `blog-visual-plan.md` to the repo map
- `blog-visual-plan.md` — new hero/inline image, alt text, widget placement, and sourcing checklist for free museums, July, August, and September posts
- `blog-drafts/berlin-in-september-2026.md` — new 2026 September travel guide draft with official weather/event sources
- `blog-workplan.md` — marked the September article as draft v1 + widgets
- `quick-summary/data.json` — added `berlin-in-september-2026`
- `faq/data.json` / `faq/inject.js` — added `berlin-in-september-2026` FAQ and JSON-LD slug mapping
- `monthly-weather/data.json` / `daylight-visualizer/data.json` / `month-comparison/data.json` / `itinerary-card/data.json` / `months-nav/data.json` — added September data to mirror the June article widgets
- `wix-embed-snippets.md` — added the full Berlin in September widget URL stack
- Wix: no remote changes

**Opened:** Create Wix drafts for July, August, and September when Yusuf is back on desktop with the Wix API key available; visually test the seasonal widgets after push/deploy
**Closed:** Berlin in September article draft v1 plus June-style widget data

**Next session should:** If Yusuf is on desktop, create the July/August/September Wix drafts via REST using the local draft files and widget stacks. Otherwise continue the blog queue with public toilets or luggage storage.

## 2026-05-15 — Codex

**Did:**
- Drafted the Berlin in August 2026 article
- Matched the live June post's seven-widget stack for August
- Smoke-tested all August widget URLs locally

**Changed:**
- `AGENTS.md` — documented the Wix connector limitation for large rich blog draft payloads
- `blog-drafts/berlin-in-august-2026.md` — new 2026 August travel guide draft with official weather/event sources
- `blog-workplan.md` — marked the August article as draft v1 + widgets
- `quick-summary/data.json` — added `berlin-in-august-2026`
- `faq/data.json` / `faq/inject.js` — added `berlin-in-august-2026` FAQ and JSON-LD slug mapping
- `monthly-weather/data.json` / `daylight-visualizer/data.json` / `month-comparison/data.json` / `itinerary-card/data.json` / `months-nav/data.json` — added August data to mirror the June article widgets
- `wix-embed-snippets.md` — added the full Berlin in August widget URL stack
- Wix: no remote changes

**Opened:** Create Wix drafts for July and August when Yusuf is back on desktop with the Wix API key available; visually test July/August widgets after push/deploy
**Closed:** Berlin in August article draft v1 plus June-style widget data

**Next session should:** If Yusuf is on desktop, create the July and August Wix drafts via REST using the local draft files and widget stacks. Otherwise continue the month series with September.

## 2026-05-15 — Codex

**Did:**
- Added internal/external links to the free Berlin museums draft
- Created the linked Wix Blog draft with quick summary, map, comparison, and FAQ embeds
- Verified the draft is `UNPUBLISHED` and all four embed URLs return 200
- Drafted the Berlin in July 2026 article, matched the live June post's widget stack, and smoke-tested all July widget URLs locally

**Changed:**
- `blog-drafts/which-berlin-museums-are-free-2026.md` — added links plus Wix draft ID/status
- `blog-drafts/berlin-in-july-2026.md` — new 2026 July travel guide draft with official weather/event sources
- `blog-workplan.md` — marked the free museums article as a Wix draft
- `quick-summary/data.json` — added `berlin-in-july-2026`
- `faq/data.json` / `faq/inject.js` — added `berlin-in-july-2026` FAQ and JSON-LD slug mapping
- `monthly-weather/data.json` / `daylight-visualizer/data.json` / `month-comparison/data.json` / `itinerary-card/data.json` / `months-nav/data.json` — added July data to mirror the June article widgets
- `monthly-weather/index.html` / `daylight-visualizer/index.html` — added optional month-specific labels/callouts while preserving June behavior
- `wix-embed-snippets.md` — added the full Berlin in July widget URL stack
- Wix: created draft post `111844a6-5b4d-418e-be34-d651f3adfe9d` in `Tourist Tips` with SEO title, meta description, focus keywords, slug, author, and rich content embeds

**Opened:** Preview the Wix draft visually in the editor before publishing; visually test the July widget stack after push/deploy
**Closed:** Free museums article moved from local draft to Wix draft; Berlin in July article draft v1 plus June-style widget data

**Next session should:** Open the free museums Wix draft, confirm the embeds resize/look right in the editor, then publish when Yusuf is happy with the final visual pass. For the July article, preview the June-style widgets locally/after deploy, then move it to Wix when approved.

## 2026-05-15 — Codex

**Did:**
- Read `AGENTS.md` and the latest `SESSION_LOG.md` entry
- Confirmed the handoff files were committed/pushed and the worktree is clean on `main`
- Recorded that Yusuf rotated the leaked Wix API key and deleted the old key
- Updated local E7 source so the primary CTA points to the per-booking Berlin Walk review form
- Updated live Wix automation metadata so both E7 actions expose `order_number` and `booking_contact_first_name`
- Yusuf pasted the updated E7 HTML into both live Wix Triggered Email templates
- Researched new blog post ideas against the live 88-post sitemap
- Saved the blog idea queue and drafted the free Berlin museums post
- Built post-specific map and comparison widgets for the free Berlin museums post

**Changed:**
- `AGENTS.md` — added `blog-workplan.md` and `blog-drafts/` to the repo map
- `README.md` / `AGENTS.md` — documented the new free museums widgets
- `AGENTS.md` — removed the completed Wix API key rotation TODO
- `SESSION_LOG.md` — added this handoff entry
- `blog-workplan.md` — new prioritized blog idea plan
- `blog-drafts/which-berlin-museums-are-free-2026.md` — new draft v1 based on official museum/admission sources
- `free-museums-map/index.html` — new Leaflet map with filters for always-free, free museum, and free-at-certain-times stops
- `free-museums-compare/index.html` — new mobile-friendly comparison table for choosing a free museum stop
- `quick-summary/data.json` — added `free-museums`
- `faq/data.json` / `faq/inject.js` — added `free-museums` FAQ and JSON-LD slug mapping
- `wix-embed-snippets.md` — added the four embed URLs for the free museums post
- `email-journey/README.md` — recorded current E7 action/message IDs and Wix automation revision 7
- `email-journey/e7-post-tour-review-request.md` — replaced FreeTour review ask with the Berlin Walk review form URL
- `email-journey/mockups/e7-wix-html-block.html` — made "Leave a review" the primary CTA using `${order_number}` and `${booking_contact_first_name}`
- Wix: patched automation `16a0d96d-9a1d-4107-ad5c-c3d21c6d8da1` from revision 6 to 7; both E7 actions now include `{{var("order_number")}}`
- Wix: Yusuf pasted the updated E7 HTML into both live Triggered Email templates

**Opened:** none
**Closed:** Wix API key rotation; local E7 content update; E7 automation dynamic params; E7 Wix template paste

**Next session should:** Preview the new free museums widgets visually after push/deploy, then build the Wix blog post using the URLs in `blog-drafts/which-berlin-museums-are-free-2026.md`. Also test the cancel-on-cancel automation end-to-end when ready.

## 2026-05-15 — Claude Code

**Did:**
- Built the full per-booking review system end-to-end (form, public display, FreeTour imports, cancellation cleanup hook)
- Rebuilt the 7-email automation as a branched structure to prevent burst-firing on last-minute bookings
- Designed cancellation email HTML matching the brand system

**Changed:**
- `email-journey/` — added 7 email markdown drafts + README + `mockups/` folder with 14 HTML files (browser preview + Wix-paste versions for E1–E7)
- `leave-review/index.html` — new iframe widget for review submission
- `reviews/index.html` + `reviews/reviews-element.js` — new `bw-reviews` Custom Element + local test page
- `.gitignore` — excludes `email-journey/.automation-*.json` backups
- Wix: created Reviews CMS collection with 11 custom fields (bookingId, firstName, lastInitial, showName, country, rating, reviewText, tourDate, guestEmail, approved, source, sourceUrl)
- Wix: added 3 Velo HTTP functions to `backend/http-functions.js` — `submitReview`, `listReviews`, `cancelBookingJourney`
- Wix: created new automation `16a0d96d-9a1d-4107-ad5c-c3d21c6d8da1` to replace the unreachable draft `01909883-...`, with a CODE_CONDITION branching long-path (≥3 days) vs short-path (<3 days). Used `booking_creation_date` variable; `now()` was unreliable at runtime.
- Wix: created parallel automation "Cancel 7-email journey on booking cancellation" — Booking Canceled trigger → HTTP POST `bookingId` → calls Wix `cancelEvent` API
- Wix: created `/leave-review` and `/reviews` pages, embedded iframe + Custom Element respectively
- Wix: imported 6 existing FreeTour testimonials into the Reviews collection (`source=FreeTour.com, approved=true`) via REST API
- Wix: customized the shipped "Notify clients when their booking is canceled" email template with brand-aligned HTML (designed as Yusuf-initiated apology)

**Opened:**
- Test the cancel-on-cancel flow end-to-end (book + cancel, verify logs and E2 suppression)
- Update E7 email to link to `berlinwalk.com/leave-review?bid=${order_number}&n=${booking_contact_first_name}`
- Convert homepage `bw-testimonials` to read live from `listReviews` instead of `testimonials/data.json`
- Convert `/leave-review` to a Custom Element (currently iframe; mobile height is a workaround)
- Rotate Wix API key (leaked in chat during this session)

**Closed:**
- Reviews collection + Velo + leave-review form (built and live)
- Country field added end-to-end
- Branched cadence with corrected `booking_creation_date` variable
- FreeTour reviews imported into single source of truth
- Cancellation email designed
- Cancel-on-cancel automation wired (not yet tested)

**Next session should:** Test the cancel-on-cancel flow with a real test booking + cancellation, watching `console.log` output for `cancelEvent status: 200`. If that works, ship E7's review CTA update next.
