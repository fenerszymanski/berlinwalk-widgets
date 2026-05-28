# Agent Handoff — Berlin Walk

This file is the single source of truth for AI agents (Claude Code, Codex, or others) working on this repo. Read this at the start of every session. Append a one-paragraph entry to `SESSION_LOG.md` at the end.

`README.md` is the user-facing project description and architectural conventions. This file layers on top with operational context: live endpoints, IDs, ongoing work, gotchas.

---

## 1. Project at a glance

- **Site:** Berlin Walk — a free tip-based walking tour of Berlin's historic centre
- **Platform:** Wix Studio (`berlinwalk.com`, site ID `12ee5ea0-70a7-492f-8020-ffb27cbb630f`)
- **Owner:** Yusuf (single operator, also the tour guide)
- **Repo:** `fenerszymanski/berlinwalk-widgets` on GitHub, deployed to `fenerszymanski.github.io/berlinwalk-widgets/` via GitHub Pages
- **Local path:** `/Users/yusufucuz/Documents/New project/berlinwalk-widgets/`

## 2. What lives where

| Folder / file | Purpose |
|---|---|
| `email-journey/` | Markdown drafts for the 7-email post-booking sequence + `mockups/` with browser preview HTML and Wix-paste HTML |
| `leave-review/` | Per-booking review submission form for `berlinwalk.com/leave-review`. `leave-review-element.js` is the `bw-leave-review` Custom Element (preferred); `index.html` is the legacy iframe page kept until Wix swaps to the CE; `preview.html` is a local CE test harness |
| `reviews/` | `bw-reviews` Custom Element + local test page (`berlinwalk.com/reviews`) |
| `hero-home/` | Homepage conversion hero Custom Element. `hero-home-element.js` defines `<bw-hero-home>` with a real tour photo background, literal `Free Berlin Walking Tour` H1, booking CTA, meeting point CTA, route line, 9.8/12/~2h/tip-based proof points, and reviews link. |
| `testimonials/`, `route/`, `faq/`, `gallery/`, etc. | Homepage Custom Elements — see `README.md` for the full list. `route/route-element.js` defines `<bw-route>` with the illustrated 12-pin route map plus a compact "Route as story map" preview section linking to the full story map and booking. `stats/` is deprecated because the new hero already carries the tour facts; its element is now a hidden no-op safety net. |
| `guide-home/` | Homepage Custom Element for the shorter `Meet Yusuf` teaser section. `guide-home-element.js` defines `<bw-guide-home>` with the Rotes Rathaus guide photo, compact route/trust proof points, and links to `/the-guide` + booking. |
| `lead-form/` | Berlin Survival Map email capture iframe widget. `lead-form/email/` is the source-of-truth for the Wix welcome email copy, preview, and paste-ready HTML block. |
| `blog-home/` | Homepage Custom Element for the editorial blog teaser. `blog-home-element.js` defines `<bw-blog-home>` with the `Berlin Travel Notes` layout: one featured practical guide, three note cards, image-led design, and a CTA to `/blog`. `data.json` is the curated mini-CMS for the four homepage posts. |
| `meeting-point/` | Custom Element page for `berlinwalk.com/meeting-point`. `meeting-point-element.js` defines `<bw-meeting-point>` with a real World Clock photo, stylized wayfinding map, tour-day details, and booking/map CTAs. `index.html` is the standalone GitHub Pages preview/fallback. |
| `the-guide/` | Custom Element page for `berlinwalk.com/the-guide`. `the-guide-element.js` defines `<bw-the-guide>` with Yusuf profile copy, real profile photo, tour approach, route logic, reviews, and booking CTAs. `SEO_SETTINGS.md` has Wix-ready SEO tags/schema. |
| `route-story/` | Custom Element page for `berlinwalk.com/berlin-walking-tour-route`. `route-story-element.js` defines `<bw-route-story>` with a full-bleed World Clock hero, interactive 12-stop story map, scroll-synced map pins, "what you understand here" stop cards, sales CTAs, and Wix-ready SEO in `SEO_SETTINGS.md`. |
| `thank-you/` | Custom Element page section for the post-booking thank-you page (`/thank-you-page`). `thank-you-element.js` defines `<bw-thank-you>` with confirmation copy, World Clock meeting-point card, next-step guidance, planning-tool links, conditional Google Calendar + Apple/Outlook `.ics` links parsed from the Wix confirmation section, a Tour Day Assistant with countdown, Open-Meteo forecast, outfit advice, and embedded meeting-point map, a change/cancel card that can use a detected or attributed manage-booking URL, CSS that hides the global sticky booking CTA, and a defensive helper that hides Wix's forced `#thankYouPage1` booking-confirmation section. |
| `book/` | Custom Element page for `berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based`. `book-element.js` defines two elements: `<bw-book-hero>` (hero + key facts + "At a glance" card, scrolls to `#book` anchor) and `<bw-book-details>` (what-you-get grid, 5-stop route preview, meeting point teaser, free/tip-based explainer, FAQ, ending CTA). The Wix-native Bookings service widget stays sandwiched between the two custom elements at the existing position. `SEO_SETTINGS.md` has Wix-ready SEO tags + `TouristTrip` schema. `index.html` is the standalone preview with a placeholder strip in place of the Wix Bookings widget. |
| `site-header/` | Global site header Custom Element. `site-header-element.js` defines `<bw-site-header>` with a green top mini-bar (FreeTour rating + Free/Tip-based + Daily 11:30), main bar (logo + nav + Resources dropdown + green BOOK NOW pill), shrink-on-scroll behavior (top bar collapses, logo + padding shrink past 32px), scroll progress bar (green→lime→yellow gradient), and a full-screen mobile overlay with body scroll lock, Escape-to-close, and yellow CTA. `index.html` is the standalone GitHub Pages preview with a tall stage for scroll testing. |
| `site-footer/` | Global site footer Custom Element. `site-footer-element.js` defines `<bw-site-footer>` with a booking CTA, meeting point link, route summary, planning/blog links, and partner-facing `Embed Berlin Tools` link. `index.html` is the standalone GitHub Pages preview/fallback. |
| `berlin-quiz/` | Homepage interactive quiz Custom Element. `berlin-quiz-element.js` defines `<bw-berlin-quiz>` — port of the previous inline-HTML Wix embed. Dark green gradient full-bleed section with start screen (badge + headline + tags + CTA), 15-question quiz (progress bar, A/B/C/D options, lock-on-answer with fact box, NEXT button), and result screen (emoji + score ring + tier title + Book Your Free Tour CTA + restart). Questions cover Airport, Clothing, Tipping, History, Food, Money, Practical, Transport. All logic scoped to the element instance via `this.querySelector` and method-based handlers — no globals. `index.html` is the standalone preview. |
| `free-museums-map/`, `free-museums-compare/` | Post-specific widgets for the free Berlin museums article |
| `blog-workplan.md` | Prioritized list of new blog post ideas checked against the live sitemap |
| `blog-visual-plan.md` | Visual/image plan for current blog drafts before moving them into Wix |
| `blog-drafts/` | Draft blog posts before they are moved into Wix |
| `tools-hub/` | The `/tools` directory grid. `data.json` is the **single source of truth** for every embeddable BerlinWalk widget: slug, title, lead, category, image, **`widgetUrl`**, **`embedHeight`**. New widgets must be added here. |
| `widgets-hub/` | The `/widgets` page (third-party embed gallery). Two interchangeable surfaces from the same data: `widgets-hub-element.js` is the `<bw-widgets-hub>` Custom Element used on the live Wix `/widgets` page (light DOM, sticky nav works against parent scroll, Google indexes every title + lead + backlink as native page content); `index.html` is a standalone iframe-able mirror. Both read `tools-hub/data.json`; new entries appear automatically. Each card has a lazy-loaded auto-resizing live preview, a Standard/Light/Dark theme picker, and a "Copy embed code" button. |
| `tools-home/` | Curated 6-widget grid for the homepage. Separate from tools-hub. |
| `js/brand.js` | Shared runtime for all widgets. Two responsibilities: (1) post `bw-resize` height messages to the parent (Wix or any embedding site); (2) inject the "by berlinwalk.com" attribution badge into every widget body. Skipped when `?attribution=none` is in the URL (used by the gallery preview iframes). |
| `embed-resize.js` | Tiny external script loaded by every third-party embed snippet. Listens for `bw-resize` postMessage events from any `iframe[data-bw-frame]` on the host page and resizes the iframe to fit. Makes the third-party embeds auto-height by default. |
| `css/brand.css` | Shared brand tokens + styles for the attribution badge (`.bw-attr-badge`). |
| `_audit.md`, `MIGRATION.md`, `_swap-status.md`, etc. | Historical planning docs — read for context only, mostly stale |

## 3. Key live URLs

- `berlinwalk.com/leave-review` — review submission form (Custom Element `bw-leave-review`)
- `berlinwalk.com/reviews` — public review display (Custom Element `bw-reviews`)
- `berlinwalk.com/meeting-point` — planned dedicated meeting point page (Custom Element `bw-meeting-point`)
- `berlinwalk.com/the-guide` — planned dedicated guide profile/trust page (Custom Element `bw-the-guide`)
- `berlinwalk.com/berlin-walking-tour-route` — live dedicated route story map page (Custom Element `bw-route-story`)
- `berlinwalk.com/tools` — directory grid of all 19+ free Berlin widgets, rendered from `tools-hub/data.json`
- `berlinwalk.com/tools/<slug>` — dynamic per-tool page bound to BerlinTools CMS collection
- `berlinwalk.com/widgets` — third-party embed gallery, rendered from `tools-hub/data.json` via `widgets-hub/`
- `https://www.berlinwalk.com/_functions/subscribe` — Berlin Survival Map lead form
- `https://www.berlinwalk.com/_functions/submitReview` — POST, review submission
- `https://www.berlinwalk.com/_functions/listReviews` — GET, approved reviews
- `https://www.berlinwalk.com/_functions/cancelBookingJourney` — POST, halts 7-email runs on cancellation

All Velo HTTP functions live in `backend/http-functions.js` on the Wix site (not in this repo).

## 4. Brand system

- **Colors:** Green `#1B5E20` (primary), Yellow `#FFE600` (energy), Lime `#7CB342` (accent), Light Green `#C5E1A5` (soft fill), Berlin Red `#E63946` (occasional caution only)
- **Fonts:** Montserrat (default), Merriweather (selective serif for editorial moments)
- **Tone:** First-person Yusuf voice, atmospheric, historically grounded, **no em dashes**, no marketing fluff, confident but restrained
- **Brand guide source:** `BerlinWalk_Brand_Guide_v1_2_revised.pdf` (Yusuf's downloads — not in repo)

## 5. Wix automation: 7-email booking journey

- **Automation ID:** `16a0d96d-9a1d-4107-ad5c-c3d21c6d8da1`
- **Name:** "Berlin Free Walking Tour - Smart Email Journey"
- **Trigger:** Wix Bookings → Session booked, filtered to service `448872c2-4bd8-4f15-8030-594f5b2162c7`
- **Structure:** Branched (CODE_CONDITION right after E1)
  - **TRUE branch** (booking ≥3 days before session): E1 → 6h → E2 → 24h → E3 → 3d before → E4 → 1d before → E5 → 3h before → E6 → 1d after → E7
  - **FALSE branch** (short notice): E1 → 1d before → E5 → 3h before → E6 → 1d after → E7
- **Condition logic:** JavaScript code condition comparing `start_date − 3 days >= booking_creation_date`
- **Cancellation handling:** Separate automation "Cancel 7-email journey on booking cancellation" — Booking Canceled trigger → HTTP POST to `cancelBookingJourney` → calls Wix `cancelEvent` API with `triggerKey=wix_bookings-sessions_booked` and `externalEntityId=bookingId`

## 6. Wix CMS collections

- **`Reviews`** — guest reviews. Fields: bookingId, firstName, lastInitial, showName (boolean), country, rating (1-5), reviewText, tourDate, guestEmail (encrypted), approved (boolean), source ('direct' for site submissions, 'FreeTour.com' for imports), sourceUrl
- Permissions: ANYONE can insert+read, ADMIN-only update+remove
- Moderation gate: `approved=false` by default; `listReviews` only returns `approved=true`

## 7. Working conventions

### Code style
- Custom Elements use light DOM (no Shadow DOM), scoped CSS by component class prefix, guarded `customElements.define()`
- Brand-coloured Wix HTML-block emails use inline CSS only — no `<style>`, no Google Fonts `<link>`, no SVG, no JS, table layouts
- Wix variables in email HTML use `${var_name}` syntax (Wix Bookings trigger payload)

### When adding a new BerlinTools widget (checklist)

Every new tool widget must:

1. **Live as a standalone HTML at `<slug-folder>/index.html`** that links `../css/brand.css` and `../js/brand.js`. brand.js will auto-inject the attribution badge — no per-widget badge code needed.
2. **Be added to `tools-hub/data.json`** with: `slug`, `title`, `lead`, `category` (Money / Weather / Maps / Discovery), and the two embed fields **`widgetUrl`** (full GitHub Pages URL ending in `/`) and **`embedHeight`** (recommended iframe height in px). This single entry feeds both `/tools` (directory) and `/widgets` (third-party embed gallery).
3. **Optionally have an `image`** (Wix Media URL of the tool icon). Without one, the directory falls back to a first-letter chip.
4. **Have a matching BerlinTools CMS item** for the dynamic `/tools/<slug>` page (see public-toilets and luggage-storage as templates). Fields: `slug`, `title`, `h1`, `lead`, `secondary`, `intro`, `seoTitle`, `seoDescription`, `jsonLd` (WebApplication schema), `widgetUrl`, `bodyContent` (Ricos), `relatedTool1*` / `relatedTool2*`, `relatedBlog*`, `link-berlin-tools-title` (= `/tools/<slug>`).
5. **Optionally be added to a related blog post's FAQ + quick-summary** under matching slugs in `faq/data.json`, `quick-summary/data.json`, and the SLUG_MAP + SCHEMAS in `faq/inject.js`.

The gallery and tools directory pick up the new entry automatically as soon as `tools-hub/data.json` is pushed.

### Attribution badge + UTM convention

Every BerlinWalk widget loads `js/brand.js`, which automatically appends an attribution badge to the body:

- **Label:** mini logo (`https://static.wixstatic.com/media/5a08a3_f2d364781904464b9b07840378001c0d~mv2.png`) + "by berlinwalk.com →"
- **Style:** green strip, yellow accent — see `.bw-attr-badge` in `css/brand.css`
- **Link target:** `https://www.berlinwalk.com/` with UTM:
  - `utm_source=embed`
  - `utm_medium=widget`
  - `utm_campaign=<widget-folder-slug>` (e.g. `luggage-storage-map`)
  - `utm_content=footer-badge`
- **Opt-out:** append `?attribution=none` to the widget URL to suppress the badge. Used by `widgets-hub/` gallery preview iframes (no need for double-badge inside a page that already shows the brand).

This means analytics can distinguish (a) traffic from Yusuf's own Wix site embeds, (b) traffic from third-party embeds of each specific widget, and (c) deep-link `utm_campaign` breakdowns per widget.

### Third-party embed snippet structure

The `/widgets` gallery's copy-paste snippet is intentionally rich for SEO. Each embed produces:

```html
<aside class="bw-embed" style="...themed...">
  <h3><a href="https://www.berlinwalk.com/tools/<slug>">{title}</a></h3>     <!-- deep backlink -->
  <p>{lead}</p>                                                              <!-- indexable content -->
  <iframe data-bw-frame src=".../<widget-slug>/" ...></iframe>               <!-- interactive UI -->
  <p><a href="https://www.berlinwalk.com/widgets?utm_...">Free Berlin widget by <strong>BerlinWalk</strong> →</a></p>
</aside>
<script src=".../embed-resize.js" async></script>
```

Notes:
- Search engines do not crawl cross-origin iframe content. The surrounding `<h3>` + `<p>` give the embedding page real indexable content and the two `<a>` tags act as crawlable dofollow backlinks (one deep to `/tools/<slug>`, one to `/widgets`).
- `embed-resize.js` matches `iframe[data-bw-frame]` and listens for `bw-resize` postMessage from the widget's `brand.js`, then sets the iframe height. One script tag handles every widget on the page.
- Three wrapper themes (Brand / Minimal / Dark) only change the surrounding `<aside>` colors. The iframe content keeps the widget's own design. Adding real per-widget theming would require updating each widget HTML to read a `?theme=` URL parameter.

### Hosting the `/widgets` gallery on Wix

**Recommended (matches `/berlin-tools`):** use the `<bw-widgets-hub>` Custom Element. Add to the Wix `/widgets` page via Custom Code (Settings → Custom Code → Body end):

```html
<bw-widgets-hub></bw-widgets-hub>
<script src="https://fenerszymanski.github.io/berlinwalk-widgets/widgets-hub/widgets-hub-element.js"></script>
```

The element renders into light DOM, so:
- Google indexes every widget title, lead, and backlink as native page content (same SEO benefit as `<bw-tools-hub>` on `/berlin-tools`).
- Sticky `.bw-category-nav` works against the parent page scroll (no iframe boundary).
- The element auto-loads `embed-resize.js` so live previews resize themselves.

**Fallback (iframe):** if Custom Code is unavailable, embed `widgets-hub/index.html` via a Wix HTML iframe with `height: 100vh` and internal scrolling enabled — without that, the in-page sticky nav has no constrained viewport and feels non-sticky to users. Light DOM is still preferred.

### Wix idiosyncrasies that have bitten us
- **Wix REST API cannot read or write draft automations** (those with `draftInfo` set). Workaround: create new automation via REST instead of patching the draft.
- **Past-due delays cascade-fire emails** — Wix doesn't auto-skip overdue delays in a chain; we solved with the TRUE/FALSE branched structure above.
- **`now()` works in validate but unreliably at runtime** in CONDITION expressions. Use `var('booking_creation_date')` instead.
- **`created_date` is NOT a valid Wix Bookings trigger variable.** The correct name is `booking_creation_date`.
- **Wix AI hallucinates messageIds and claims success without committing changes.** Always verify via REST GET after Wix AI claims a change.
- **The Wix connector can handle reads and smaller REST calls, but large blog draft create payloads with full Ricos JSON + multiple embeds may be unreliable/truncated.** When building rich blog drafts, prefer local REST after sourcing `../scripts/load-api-keys.sh` from the workspace root to load `WIX_API_KEY` from macOS Keychain.
- **Wix Blog editor may show API-created paragraphs with almost no visual gap.** Full-size blank spacer paragraphs make the editor wildly over-spaced and can destabilize draft reads. If paragraph gaps are needed, use tiny spacer paragraphs only: NBSP text with `FONT_SIZE` 6px between adjacent body paragraphs, then verify visually in the editor.
- **For the `/reviews` page structured data, use conservative page/service markup.** The page uses `CollectionPage` markup about the Berlin Free Walking Tour service plus social meta tags. Avoid adding `Review` / `AggregateRating` schema for now; Google can treat self-serving review markup as ineligible or spammy.
- **GitHub Pages deploys can sit Queued 5-15 min** during traffic spikes. Last-Modified header on the deployed asset is the source of truth.
- **Wix Triggered Email templates get garbage-collected** if not referenced. If you delete an automation step, its template may become invisible to subsequent PATCH calls (returns "Message [...] set failed [Deleted]"). Recovery: ask Yusuf for the new messageIds via the Wix dashboard URL trick (the messageId is in the URL when editing a template).
- **Wix Data v2 update: prefer `PUT` over `PATCH` for one-off field edits.** `PATCH /wix-data/v2/items/{id}` with a `dataItem.data` body returns `WDE0080 Validation failed — patch.fieldModifications has size 0`; PATCH expects a different shape (`patch.fieldModifications: [{ field, value }]`). `PUT /wix-data/v2/items/{id}` with the full `dataItem.data` block works on the first try — just GET the row first and resend it with the field changed.

### Wix dashboard URL trick to get a template's messageId
When Yusuf is in the Wix automation editor → email step → "Edit email," the browser URL contains the messageId between `/automations/edit/` and `/content/en`. Example: `…/automations/edit/{MESSAGE_ID}/content/en?...&actionId={ACTION_ID}…`. Ask him for the URL when you need a current messageId.

### Git / deploy workflow
- Yusuf does `git push` and Wix Editor publishing — agents drafting code stage/commit but do not push unless explicitly asked
- GitHub Pages auto-deploys main branch; cache-bust with `?cb={timestamp}` query when verifying changes
- Cloudflare-style `_headers` file in repo root allows iframe embedding from `berlinwalk.com`

### Sensitive data
- API keys should live in macOS Keychain, not in the repo or chat.
- From the workspace root, run `source scripts/load-api-keys.sh` before direct API calls. From this repo folder, use `source ../scripts/load-api-keys.sh`.
- The loader maps Keychain service `berlinwalk-wix-api-key` to `WIX_API_KEY` and `openai-api-key` to `OPENAI_API_KEY`.
- **Never commit or echo keys in chat.** If a key leaks, flag for rotation.

## 8. Open items / known TODOs

Pulled from `SESSION_LOG.md` — see that file for active state. As of the latest session:

1. **Test cancel-on-cancel flow end-to-end.** Book + cancel a test tour, verify Velo logs show `cancelEvent status: 200` and E2 doesn't fire at +6h. If the externalEntityId mismatch, debug. *(Deferred far out per Yusuf on 2026-05-16.)*
2. **Publish the route story map page.** After pushing `berlinwalk-widgets`, create/publish Wix `/berlin-walking-tour-route`, install `<bw-route-story>`, paste `route-story/SEO_SETTINGS.md`, then verify header/footer/homepage route links.

## 9. Protocol for ending a session

Append one entry to `SESSION_LOG.md` with:

```markdown
## YYYY-MM-DD — {Agent name}

**Did:** one-line summary of what was accomplished (no more than 3 bullets)

**Changed:**
- `path/to/file.md` — what changed
- Wix: what was changed remotely (collection, automation, page)

**Opened:** any new TODOs (add to AGENTS.md §8 too if durable)
**Closed:** any TODOs resolved (remove from AGENTS.md §8)

**Next session should:** one or two sentences pointing at the next obvious step
```

Keep entries terse. The log is for the next agent to skim in 30 seconds, not a journal.
