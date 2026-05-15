# Session log

Rolling log of agent sessions. Most recent at top.

Format for each entry — see `AGENTS.md` §9.

---

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
