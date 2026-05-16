# Session log

Rolling log of agent sessions. Most recent at top.

Format for each entry — see `AGENTS.md` §9.

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
