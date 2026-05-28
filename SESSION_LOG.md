# Session log

Rolling log of agent sessions. Most recent at top.

Format for each entry — see `AGENTS.md` §9.

## 2026-05-28 — Codex (Handoff preference + subscribe TODO)

**Did:** Recorded Yusuf's preference for simpler manual code/editor instructions.

**Changed:**
- `AGENTS.md` — added simple Turkish, one-step-at-a-time handoff style for Yusuf's manual code tasks.
- Project root `AGENTS.md`, `PROJECT_MEMORY.md`, `SESSION_LOG.md` — mirrored the preference and added `subscriptionDebug: missing_api_key` as an open TODO.

**Opened:** Fix `subscriptionDebug: missing_api_key` for the Survival Map subscribe response.
**Closed:** None.

**Next session should:** Keep manual Wix/code instructions short and step-by-step.

## 2026-05-28 — Codex (Survival Map direct emails live)

**Did:** Completed the Survival Map move from slow label-trigger automations to direct Velo-triggered emails.

**Changed:**
- `lead-form/velo/survivalMapEmails.js` — set `DIRECT_TRIGGERED_EMAILS_ENABLED = true`, welcome ID `VKufY4L`, owner notification ID `VKugjPv`, and passed `SITE_URL`.
- `lead-form/velo/README.md`, `lead-form/email/README.md`, `AGENTS.md`, project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` / `velo-subscribe-direct-trigger-patch.js` — updated handoff docs to the final direct-email state.
- Wix: Yusuf created both Developer Tools Triggered Emails and published the helper. Live tests logged `deliveryPath: direct_triggered_email`, `welcome:ok owner:ok`, no failures; old label-trigger automations were set inactive (`Welcome Email - v2` revision 7, `Owner Notification` revision 10).

**Opened:** `subscriptionDebug: missing_api_key` still appears in the subscribe response, affecting Email Marketing subscribed status only.
**Closed:** Upgrade Survival Map emails to true instant sends; duplicate-send risk from old label automations removed.

**Next session should:** If Yusuf reports delivery issues, start with `source scripts/load-api-keys.sh && node scripts/survival-map-email-log-report.mjs --limit 100` from the workspace root.

## 2026-05-28 — Codex (Survival Map direct email trigger)

**Did:** Added the Velo helper source for direct Survival Map welcome + owner notification sends.

**Changed:**
- `lead-form/velo/survivalMapEmails.js` — new backend helper using `triggeredEmails.emailContact()` with the live v2 welcome `messageId 46a631...`, owner notification `messageId 2fb9...`, and owner contact `9e996...`.
- `lead-form/velo/README.md` — Wix `http-functions.js` import/call instructions and post-publish deactivation checklist.
- `lead-form/email/README.md` — updated live automation IDs/revisions and documented the direct-trigger handoff.
- Project root `PROJECT_MEMORY.md`, `SESSION_LOG.md`, `velo-subscribe-direct-trigger-patch.js` — recorded the corrected patch and live API verification.
- Wix: created `SurvivalMapEmailLogs`; Yusuf published the logging helper; live safe-log test wrote `deliveryPath: automation_label_trigger`, then Codex test rows were removed. Label-trigger automations were restored ACTIVE because automation action `messageId`s are not valid Velo Triggered Email IDs.

**Opened:** Live response still showed `subscriptionDebug: missing_api_key`, which affects Email Marketing subscription status only, not direct Triggered Email sends.
**Closed:** Local ESM syntax check passed; live endpoint did not error after publish; logging works; email delivery restored through active label-trigger automations (`Welcome Email - v2` revision 6, owner notification revision 9).

**Next session should:** To make sends truly instant, create real Developer Tools → Triggered Emails templates and use their generated Email IDs in `survivalMapEmails.js`; current automation `messageId`s returned `Not Found` in direct Velo sends.

## 2026-05-28 — Codex (First-Day Planner V3 lead gate)

**Did:** Added V3 lead-gated PDF/print exports for `Berlin First-Day Planner`, plus Velo/email funnel source.

**Changed:**
- `berlin-first-day-planner/index.html` — PDF/print exports now show/click `berlinwalk.com/book`, PDF/print buttons open an email+consent unlock form, successful unlock persists 30 days in `localStorage`, endpoint errors fail-soft, and the PDF transport table/page break was tightened.
- `berlin-first-day-planner/velo/*` — added `firstDayPlannerLead` HTTP function source, lead upsert/contact label logic, scheduled funnel sender, `jobs.config`, optional `book` router source, and deployment README.
- `berlin-first-day-planner/email/*`, `README.md` — added four practical triggered-email copy drafts and documented the V3 funnel folders.

**Opened:** In Wix, create Triggered Email templates, paste their messageIds, configure the scheduled job, then live-QA the full funnel path.
**Closed:** Local QA passed: inline JS parse, JSON parse, Velo source parse, lead form validation, mocked endpoint success auto-PDF, localStorage unlock, endpoint-500 print fail-soft, desktop/mobile overflow, and rendered PDF check with short booking URL only. Yusuf added the real `/book` Redirect Manager rule; live `/book` now returns 301 to the booking service page and then 200. Yusuf published `http-functions.js` + `firstDayPlannerFunnel.js`; live endpoint smoke test returned 200 and created a test lead/contact, and Yusuf confirmed live gated PDF download works.

**Next session should:** Test live `https://www.berlinwalk.com/tools/berlin-first-day-planner` with Yusuf, then wire the Triggered Email messageIds and scheduled job.

## 2026-05-28 — Codex (First-Day Planner PDF polish)

**Did:** Reworked the `Berlin First-Day Planner` PDF/print output into a more readable branded export.

**Changed:**
- `berlin-first-day-planner/index.html` — added mini BW logo loading for PDF, two-page card/table-style jsPDF layout, visual weather/climate panel, start-point-specific public transport guidance (BER/Hbf/Alex/hotel), stronger timeline cards, booking footer, and matching print-view structure.
- Project root `PROJECT_MEMORY.md`, `SESSION_LOG.md` — recorded the latest local handoff.

**Opened:** Push this repo so GitHub Pages serves the PDF polish; then live-QA the Wix tool page's Download PDF and Print plan actions.
**Closed:** Local QA passed: inline JS parse, desktop/mobile no-overflow, climate-date PDF render review, live-weather BER PDF text check, print popup check, no console errors.

**Next session should:** After push + Pages deploy, test `https://www.berlinwalk.com/tools/berlin-first-day-planner` PDF/print on desktop and mobile, especially logo loading and text clipping.

## 2026-05-28 — Codex (First-Day Planner V2 polish)

**Did:** Polished `Berlin First-Day Planner` V2 with a less text-heavy, date-aware result flow.

**Changed:**
- `berlin-first-day-planner/index.html` — added a tomorrow-default arrival-date picker, `?date=` prefill, 0-15 day Open-Meteo forecast vs day-16+ monthly climate averages, visual weather themes/icons, richer colored choice cards, jsPDF download, branded print view, and separate bottom `More Berlin planning tools` links.
- Project root `insert-berlin-first-day-planner.js`, `PROJECT_MEMORY.md`, `SESSION_LOG.md`, plus `README.md` — updated V2 source/docs; no live CMS write was run in this session.

**Opened:** Push this repo so GitHub Pages serves V2; then live-QA the Wix tool page before adding blog embeds.
**Closed:** Local QA passed: inline JS parse, JSON parse, insert script `node --check` and `--dry-run`, default tomorrow date, `?date=` prefill, day-15 forecast, day-16 climate average, weather failure fallback, representative result paths, PDF download, print popup, desktop/mobile screenshots, no horizontal overflow, and no console errors.

**Next session should:** After push + deploy, verify live `/tools/berlin-first-day-planner` desktop/mobile, PDF, print, and `/berlin-tools` card, then add the planned blog embeds.

## 2026-05-28 — Codex (First-Day Planner live rollout)

**Did:** Finished live rollout for `Berlin First-Day Planner` after Yusuf pushed `berlinwalk-widgets`.

**Changed:**
- Wix CMS `BerlinTools` — inserted `berlin-first-day-planner` as item `6c285b0e-5cef-4792-862c-f59933a8b6ef`, verified Ricos counts, and re-saved the item to wake `/tools/berlin-first-day-planner`.
- Project root `PROJECT_MEMORY.md`, `SESSION_LOG.md` — updated live CMS ID and rollout status.
- `SESSION_LOG.md` — recorded this widget-repo handoff.

**Opened:** Add the blog iframe embed (`/berlin-first-day-planner/?context=blog`) to the three planned posts now that live QA passed.
**Closed:** GitHub Pages widget/icon return 200; live Wix tool page returns 200; desktop/mobile live iframe QA passed with no overflow, booking CTA `target="_top"`, correct UTM, and `/berlin-tools` card visible.

**Next session should:** Add and QA the blog embeds in `Berlin First-Time Visitor Mistakes`, `Berlin Airport to Alexanderplatz`, and `Berlin in 3 Days`.

## 2026-05-27 — Codex (Berlin First-Day Planner)

**Did:** Added the `Berlin First-Day Planner` widget as a booking-first first-24-hours planner with weather, transport, opening-day, luggage, and tour-fit logic.

**Changed:**
- `berlin-first-day-planner/index.html` — new standalone widget using `brand.css`/`brand.js`, five choice groups, 3-5 step result timeline, Open-Meteo card, Sunday/holiday/Monday notes, booking/Survival Map CTAs, supporting links, copy action, `?context=blog`, `?date=YYYY-MM-DD`, and `?weather=off`.
- `tools-hub/data.json`, `tools-home/data.json` — added the BerlinTools Discovery entry (`embedHeight: 1280`) and made it the first homepage tools card.
- `tools-home/icons/berlin-first-day-planner.png`, `tools-home/icons/berlin-first-day-planner-160.png`, `tools-home/icons/manifest.json`, `widgets-hub/SEO_ADDITIONAL_TAGS.md`, `README.md`, `wix-embed-snippets.md` — added the no-text icon, regenerated widget SEO ItemList, and documented embed usage.
- Project root `insert-berlin-first-day-planner.js`, `PROJECT_MEMORY.md`, `SESSION_LOG.md` — added the Wix CMS insert script and broader rollout memory.

**Opened:** Push this repo so GitHub Pages serves `/berlin-first-day-planner/`; then run the root insert script and live QA before adding blog embeds.
**Closed:** Local QA passed: inline JS parse, JSON parse, insert script `--dry-run`, `node --check`, desktop `1280x900`, mobile `390x900`, weather success/error/fallback, CTA/copy analytics, no horizontal overflow, and representative BER/Hbf/Alex result paths.

**Next session should:** After deploy, verify the GitHub Pages widget URL, `/berlin-tools` first card, and live `/tools/berlin-first-day-planner`; only then embed it in the three planned blog posts.

## 2026-05-27 — Codex (Compact 15-photo gallery)

**Did:** Made the homepage gallery compact and expanded it to 15 photos, including Yusuf's new Hackescher Markt, Marx-Engels Forum, Humboldt Forum, refreshed Marienviertel, golden-hour TV Tower, and Marienkirche photos.

**Changed:**
- `gallery/gallery-element.js`, `gallery/index.html` — replaced the large mosaic with a compact responsive grid: 5 columns desktop, 4/3 on narrower screens, 2 on mobile.
- `gallery/data.json`, `gallery/source-mapping.json` — updated compact image sizes, refreshed photo `10`, and added photos `11-15`.
- `gallery/images/10-*`, `gallery/images/11-*`, `gallery/images/12-*`, `gallery/images/13-*`, `gallery/images/14-*`, `gallery/images/15-*` — optimized WebP/JPG asset sets.

**Opened:** Push `berlinwalk-widgets` when ready so GitHub Pages serves the expanded compact gallery.
**Closed:** Local QA passed: 15 photos render, desktop rows are 5+5+5, mobile is 2-column, last lightbox opens as `15 of 15`, no console errors or horizontal overflow.

**Next session should:** After push + GitHub Pages deploy, hard-refresh the live homepage gallery and confirm the new compact 15-photo grid.

## 2026-05-27 — Codex (Daily Budget calculator upgrade)

**Did:** Rebuilt `berlin-budget-table/` from a static comparison table into an interactive Berlin Daily Budget calculator, then moved the result section to the bottom.

**Changed:**
- `berlin-budget-table/index.html` — new calculator with presets, accommodation, room split, area, food, transport, paid sights, nightlife, premium attraction, walking-tour tip, buffer, bottom live daily/trip totals, breakdown bars, insights, reset, and copy summary. The widget no longer sends its own `documentElement.scrollHeight` resize message on update; it relies on `brand.js` content-height reporting to avoid desktop slider height drift.
- `tools-hub/data.json` — raised the Daily Budget `embedHeight` to 1120.
- Project root `PROJECT_MEMORY.md`, `SESSION_LOG.md` — documented the upgraded widget.

**Opened:** Push this repo so GitHub Pages serves the new calculator on live `/tools/berlin-daily-budget`.
**Closed:** Local QA passed with a temporary server at `http://127.0.0.1:8777/berlin-budget-table/`: inline JS parses, tools-hub JSON parses, desktop and 390px mobile Playwright checks showed no horizontal overflow, result appears below controls, preset interactions changed totals, and repeated slider changes kept desktop height stable (`1321 -> 1321`).

**Next session should:** After push + GitHub Pages deploy, check the live Wix page and confirm the larger iframe auto-resizes cleanly.

## 2026-05-27 — Codex (Hero/gallery photo swap)

**Did:** Replaced the homepage hero background and gallery slot `01` with Yusuf's new golden-hour Altes Museum tour photo.

**Changed:**
- `hero-home/hero-home-element.js` — hero now loads dedicated `hero-home-museum-island-*` WebP/JPG assets and updated alt text.
- `gallery/images/hero-home-museum-island-*` plus `gallery/images/01-*` — new optimized hero 16:9 and gallery 1:1 asset sets.
- `gallery/data.json` — updated photo `01` alt/caption to `Storytelling outside the Altes Museum`.

**Opened:** Push `berlinwalk-widgets` when ready so GitHub Pages serves the new hero/gallery assets.
**Closed:** Local QA passed at `http://127.0.0.1:8765/hero-home/` and `/gallery/`; desktop/mobile screenshots saved under project-root `output/qa/`, with no console errors or horizontal overflow.

**Next session should:** After push + GitHub Pages deploy, hard-refresh `berlinwalk.com` and confirm the homepage hero and gallery first tile use the new photo.

## 2026-05-27 — Codex (BerlinTools mobile polish)

**Did:** Updated the single-tool mobile fixer for `/tools/*` after Yusuf reported narrow body text, oversized bottom related links, and occasional hero text overlap.

**Changed:**
- `js/berlintools-mobile-fixes.js` — added final mobile override rules for hero ordering/spacing, full-width body rich content, compact related cards, Read Next sizing, and sticky CTA spacing.
- Project root `berlintools-mobile-tools-polish-custom-code.html`, `PROJECT_MEMORY.md`, `SESSION_LOG.md` — documented the live Wix inline CSS patch.
- Wix Custom Embed `Berlin tools fix` (`f412a295-3d53-4339-bcbc-5d1bb1389be9`) — updated to revision 8 with inline CSS because the full JS source exceeds Wix's 15 KB Custom Embeds limit.

**Opened:** Push this repo so the GitHub Pages JS source matches the live inline CSS behavior.
**Closed:** Live mobile QA at 393px passed across all 28 `tools-hub` slugs: no squeezed intro/body/secondary widget shells, no horizontal overflow, no hero overlaps, and compact related cards. Daily Budget hero and intro edge padding were specifically rechecked after revision 8.

**Next session should:** Keep the Wix embed inline unless intentionally switching back to an external `berlintools-mobile-fixes.js?v=...` URL after a GitHub Pages deploy.

## 2026-05-27 — Codex (BerlinTools link repair)

**Did:** Fixed the source of a broken Berlin Connectivity Picker deep link in the hubs after Yusuf found `/tools/connectivity-picker` returning 404.

**Changed:**
- `tools-hub/data.json` — changed the connectivity card slug to canonical `berlin-connectivity-picker` while keeping the widget folder URL at `connectivity-picker/`.
- `widgets-hub/SEO_ADDITIONAL_TAGS.md` — updated the ItemList URL for Berlin Connectivity Picker to `/tools/berlin-connectivity-picker`.
- Project root `insert-german-phrases-quiz-tool.js`, `PROJECT_MEMORY.md`, `SESSION_LOG.md` — recorded the canonical slug and live CMS repair.
- Wix CMS: root session inserted parking tool pages and a compatibility alias for `/tools/connectivity-picker`.

**Opened:** Push this repo so GitHub Pages serves the corrected hub data/SEO source.
**Closed:** The live `/tools/connectivity-picker`, `/tools/berlin-parking-calculator`, and `/tools/alexanderplatz-parking-map` pages now return 200.

**Next session should:** Push `berlinwalk-widgets`; after GitHub Pages deploys, spot-check `/berlin-tools` and `/widgets` generated links for Berlin Connectivity Picker.

## 2026-05-27 — Codex (Survival Map welcome email)

**Did:** Created the professional Berlin Survival Map welcome email source to replace the old Berlin Essentials triggered email content.

**Changed:**
- `lead-form/email/README.md` — live automation IDs, subject/preheader, PDF URL, Wix paste workflow, and completed editor status.
- `lead-form/email/berlin-survival-map-welcome.md` — editable English copy deck.
- `lead-form/email/wix-html-block.html` — paste-ready inline-CSS/table HTML block for Wix.
- `lead-form/email/preview.html` — local inbox/email preview.
- `README.md`, `AGENTS.md` — documented `lead-form/email/` as the email source-of-truth.
- Project root `PROJECT_MEMORY.md`, `SESSION_LOG.md` — recorded the live Wix automation state and manual editor step.
- Wix: Renamed automation/action labels to Berlin Survival Map (`revision=12`); Yusuf then pasted the refreshed body/subject/preview in the Wix editor.

**Opened:** None for this email.
**Closed:** HTML parser checks pass; paste-ready block has no `<style>`, SVG, JS, Berlin Essentials copy, or `1h45m`; PDF and cover links return 200; Chrome CDP desktop/mobile preview metrics show `overflow=false`; manual Wix editor paste is done.

**Next session should:** No immediate follow-up unless the welcome email copy changes again.

## 2026-05-26 — Codex (Hackescher after-tour planner widget)

**Did:** Built the post-specific `Hackescher After-Tour Planner` widget for the Hackescher Markt after-tour article.

**Changed:**
- `hackescher-after-tour-planner/index.html` — new interactive iframe widget asking time, need, and energy, then returning one practical next move with route/map link and booking CTA.
- `blog-drafts/what-to-do-near-hackescher-markt-after-walking-tour.md` — added the planner embed to the widget plan.
- `blog-workplan.md`, `README.md` — documented the widget.
- `output/qa/hackescher-after-tour-planner-desktop.png`, `output/qa/hackescher-after-tour-planner-mobile.png`, `output/qa/hackescher-after-tour-planner-mobile-full.png` — local QA screenshots.

**Opened:** Push blocked locally: `git push origin main` failed because HTTPS credentials are missing, `gh` is not installed, and SSH has no GitHub identity. Local `main` is ahead of `origin/main` by 1.
**Closed:** Inline JS parse passed; Playwright interaction test passed for default, rain, and museum states with no mobile horizontal overflow.

**Next session should:** Authenticate GitHub locally (`gh auth login` + `gh auth setup-git`, or add an SSH key), then run `git push origin main`; after GitHub Pages deploy, embed `https://fenerszymanski.github.io/berlinwalk-widgets/hackescher-after-tour-planner/` in the Wix draft after the quick answer section.

## 2026-05-26 — Codex (Hackescher after-tour blog draft)

**Did:** Researched and drafted `What to Do Near Hackescher Markt After the Walking Tour` as a practical after-tour decision guide.

**Changed:**
- `blog-drafts/what-to-do-near-hackescher-markt-after-walking-tour.md` — new 2,990-word English blog draft with metadata, CTA, FAQ, and source notes.
- `quick-summary/data.json`, `faq/data.json`, `faq/inject.js` — added `hackescher-after-tour` quick summary, FAQ, slug mappings, and FAQPage schema.
- `blog-workplan.md` — marked the Hackescher Markt idea as Draft v1.
- Project root `SESSION_LOG.md` — logged the broader handoff.

**Opened:** Wix draft creation and final pre-publish hours check.
**Closed:** JSON parse and `node --check faq/inject.js` passed; draft contains `2 hours` language and no `1h45m` wording.

**Next session should:** Create the Wix draft, place quick-summary and FAQ embeds, then do a final live-hours check for museums/restaurants before publishing.

## 2026-05-26 — Codex (Route story live layout fix)

**Did:** Fixed the live Wix wrapper issue that created huge blank space above and below `<bw-route-story>` on `/berlin-walking-tour-route`.

**Changed:**
- Wix: Created HEAD custom embed `BerlinWalk Route Story Layout Fix` (`a814da86-8269-4a81-b732-4e04f911e25a`, `revision=1`, `loadOnce=false`). It is URL-guarded and collapses the Wix page/section wrappers around the custom element.
- Project root `PROJECT_MEMORY.md`, `SESSION_LOG.md` — recorded the live embed and QA state.
- `output/qa/live-route-story-layout-fix-desktop.png`, `output/qa/live-route-story-layout-fix-mobile.png` — live QA screenshots.

**Opened:** None.
**Closed:** Live desktop/mobile Chrome checks show top gap `0px`, final CTA-to-footer gap `0px`, horizontal overflow `0`, and no console errors.

**Next session should:** If the Wix page is rebuilt, re-check wrapper IDs `#comp-mpljwtm6` and `#comp-mpljz1bj` before editing the embed.

## 2026-05-25 — Codex (Route story preview section)

**Did:** Added a compact route-story preview section to `<bw-route>` so The Route page teases the story-map concept without duplicating the full route story page.

**Changed:**
- `route/route-element.js` — replaced the plain post-map CTA block with a `Route as story map` section, three short story chapters, and story/booking CTAs.
- `README.md`, `AGENTS.md`, project root `PROJECT_MEMORY.md` — documented the new route widget behavior.
- `output/qa/route-story-preview-desktop.png`, `output/qa/route-story-preview-mobile.png` — local QA screenshots.

**Opened:** Push/publish the widget repo so Wix uses the new route section.
**Closed:** `node --check` passed; local Chrome QA shows desktop/mobile render, correct links, no console errors, and no horizontal overflow.

**Next session should:** After publish, cold-load the live The Route page and confirm the new preview sits well above the global footer/next section.

## 2026-05-25 — Codex (Route story live SEO)

**Did:** Applied SEO metadata for the published route story page via Wix Custom Embeds API.

**Changed:**
- Wix: Created HEAD custom embed `BerlinWalk Route Story SEO` (`f161dfd6-23a8-4bf8-9d2a-da95f471de13`, `revision=2`). The Custom Embeds API ignored `pageFilter` on write, so the final embed is URL-guarded and only upserts title/meta/OG/Twitter/canonical/route `TouristTrip` JSON-LD when `location.pathname` is `/berlin-walking-tour-route`.
- Project root `PROJECT_MEMORY.md`, `SESSION_LOG.md` — recorded the live Wix SEO state.

**Opened:** Optional later cleanup: set the native Wix SEO title/meta in Studio so raw source HTML also matches before JS execution.
**Closed:** Chrome DOM checks show route title/description/OG image/route JSON-LD only on the route page; home and meeting point keep their own SEO and no console errors.

**Next session should:** Recheck the live page without a query string after Wix CDN cache settles.

## 2026-05-25 — Codex (Route story footer contrast)

**Did:** Adjusted the route story page ending so it no longer blends into the global footer.

**Changed:**
- `route-story/route-story-element.js` — final `Walk the story in person` CTA section now uses a light background, green text/buttons, and a yellow bottom separator before the dark footer.
- `output/qa/route-story-final-section-light.png` — local QA screenshot.

**Opened:** Same as previous route-story entry: push, create/publish Wix `/berlin-walking-tour-route`, install `<bw-route-story>`, paste SEO settings, and verify live links.
**Closed:** `node --check` and Chrome QA passed; final section has white background, yellow divider, no console errors, and no horizontal overflow.

**Next session should:** Verify the route page inside Wix with the real footer underneath.

## 2026-05-25 — Codex (Route story map page)

**Did:** Built the 12-stop "Tour Route as Story Map" as a standalone `<bw-route-story>` page for SEO and booking conversion.

**Changed:**
- `route-story/` — new full-bleed route story page, scroll-synced illustrated map pins, 12 "what you understand here" stop cards, booking/audio/meeting/guide CTAs, standalone preview, and Wix SEO settings.
- `route/route-element.js`, `route/test-element.html` — homepage route widget now links to the full story map and booking page; local preview favicon 404 suppressed.
- `site-header/site-header-element.js`, `site-footer/site-footer-element.js`, `README.md`, `AGENTS.md`, `wix-embed-snippets.md`, project root `PROJECT_MEMORY.md` — wired/documented the new route page and open install task.
- `output/qa/route-story-*.png`, `output/qa/route-widget-mobile-cta.png` — local QA screenshots.

**Opened:** Push `berlinwalk-widgets`, create/publish Wix `/berlin-walking-tour-route`, install `<bw-route-story>`, paste `route-story/SEO_SETTINGS.md`, and verify header/footer/homepage route links.
**Closed:** Local syntax and Playwright/Chrome QA passed: 12 stops/pins render, pin interaction syncs, sticky map works, remote images load when scrolled, and desktop/mobile overflow is 0.

**Next session should:** Publish the new Wix page and then cold-load it with `?cb=` to verify live assets, SEO tags, and internal links.

## 2026-05-25 — Codex (Thank-you change link copy)

**Did:** Refined the Tour Day Assistant fallback and added a change/cancel booking card.

**Changed:**
- `thank-you/thank-you-element.js` — far-out forecast fallback now uses the lighter `Berlin weather is still thinking` copy; default no-date weather copy is warmer; added `Change of plans?` card that auto-renders `View or change booking` when a Wix manage/change/cancel link or `manage-booking-url` attribute is available.
- `README.md`, `AGENTS.md`, project root `PROJECT_MEMORY.md` — documented the manage-booking behavior.

**Opened:** Live test still needs a real/test Wix booking to see whether the hidden confirmation exposes a manage-booking link; if it does not, pass `manage-booking-url` from Wix/Velo when possible.
**Closed:** Local syntax/parser smoke checks passed; desktop preview shows the fallback email-based change/cancel copy without layout overflow.

**Next session should:** Test `/thank-you-page` after a real booking and inspect whether the personal Wix manage-booking link is detectable.

## 2026-05-25 — Codex (Tour Day Assistant MVP)

**Did:** Added the post-booking Tour Day Assistant to `<bw-thank-you>`: parsed tour time now powers countdown, live Open-Meteo forecast, outfit advice, meeting-point map, and analytics events.

**Changed:**
- `thank-you/thank-you-element.js` — added assistant UI/CSS, Open-Meteo fetch/extraction, countdown timer, weather fallback states, outfit rules, map iframe, and `dataLayer`/`gtag` click/view events.
- `thank-you/index.html` — local preview now injects a dynamic +3 day sample tour time before loading the element.
- `README.md`, `AGENTS.md`, project root `PROJECT_MEMORY.md` — documented Tour Day Assistant behavior.

**Opened:** After push/publish, verify with a real/test Wix booking that the hidden confirmation still exposes a parseable date/time and the weather card appears on `/thank-you-page`.
**Closed:** Local QA passed: `node --check`, Open-Meteo live endpoint smoke test, in-app browser desktop render with no console errors/no horizontal overflow, and Chrome headless 500px narrow screenshot.

**Next session should:** Push `berlinwalk-widgets`, then book a test slot and cold-load `/thank-you-page` to verify countdown/weather/map against the real Wix confirmation payload.

## 2026-05-25 — Codex (Thank-you calendar links)

**Did:** Added conditional Add to Calendar links to the `<bw-thank-you>` page section.

**Changed:**
- `thank-you/thank-you-element.js` — parses booking date/time from the hidden Wix confirmation section or optional element attributes, then renders Google Calendar and Apple/Outlook `.ics` links.
- `README.md`, `AGENTS.md`, project root `PROJECT_MEMORY.md` — documented the calendar behavior.

**Opened:** After push/publish, verify with a real/test booking that Wix's live confirmation section exposes a parseable date/time.
**Closed:** Local Node parser tests passed; Chrome CDP mock passed on desktop/mobile with no horizontal overflow, calendar links for `20260525T113000/133000`, and `#thankYouPage1` hidden.

**Next session should:** Push to GitHub Pages, publish Wix if needed, then book a test slot and check that the calendar card uses the real booking time.

## 2026-05-25 — Codex (Hide Wix thank-you confirmation)

**Did:** Added a defensive hide for Wix's forced `Booking Confirmation` app section on `/thank-you-page`.

**Changed:**
- `thank-you/thank-you-element.js` — now hides `#thankYouPage1` / `Booking Confirmation` via CSS, timed retries, and MutationObserver.
- `README.md`, `AGENTS.md`, project root `PROJECT_MEMORY.md` — documented the forced-section hide and Velo fallback.

**Opened:** If the live Wix page still keeps empty section height, add the Velo page code fallback: collapse/hide `#thankYouPage1` on ready.
**Closed:** Local Chrome mock passed: late-injected `#thankYouPage1` becomes `display:none`, `height:0`, `aria-hidden=true`; no horizontal overflow.

**Next session should:** Cold-load the live thank-you page after publish and verify the duplicate confirmation UI is gone.

## 2026-05-25 — Codex (Thank-you page redesign)

**Did:** Added a new `<bw-thank-you>` Custom Element for the post-booking thank-you page.

**Changed:**
- `thank-you/thank-you-element.js`, `thank-you/index.html` — confirmation hero, World Clock tour-day card, next 3 steps, planning-tool links, and sticky booking CTA suppression.
- `README.md`, `AGENTS.md`, `wix-embed-snippets.md` — added install/documentation rows.
- Project root: `PROJECT_MEMORY.md` — recorded the new Thank You Page guidance.

**Opened:** Push to GitHub Pages, then install `https://fenerszymanski.github.io/berlinwalk-widgets/thank-you/thank-you-element.js` on Wix `/thank-you-page` with tag `bw-thank-you`.
**Closed:** Local Chrome QA passed at 1440px and 390px: no horizontal overflow, image loads, and `#bw-sticky-cta` / `#bw-desktop-cta` compute to `display:none`.

**Next session should:** Verify the live thank-you page after Wix publish, especially spacing below the site header and absence of the floating booking CTA.

## 2026-05-24 — Codex (What's Open icon wired)

**Did:** Added the generated storefront/calendar/check icon for `whats-open-in-berlin-today` and removed the homepage fallback-letter path.

**Changed:**
- `tools-home/icons/` — added `whats-open-in-berlin-today.png` and `whats-open-in-berlin-today-160.png`.
- `tools-home/data.json`, `tools-hub/data.json` — set the tool `image` to the GitHub Pages 160px icon URL.
- `tools-home/icons/manifest.json` — recorded the generated source and output paths.

**Opened:** Push to GitHub Pages so the absolute icon URL resolves on the live homepage and `/berlin-tools`.
**Closed:** JSON validation passes; icon files are 512x512 and 160x160.

**Next session should:** After push, cold-load the homepage tools grid and `/berlin-tools` to confirm `whats-open-in-berlin-today` shows the new icon instead of the fallback letter.

## 2026-05-24 — Codex (Blog sidebar header gate v24)

**Did:** Kept the desktop blog sidebar top-anchored, but gated visibility until the site header/menu has cleared.

**Changed:**
- `js/blog-sidebar-inject.js` — detects the top site header/menu and hides the sidebar until the sidebar's 24px top position is below that header threshold; no-header pages still show immediately.
- `README.md`, `wix-embed-snippets.md` — bumped the blog helper URL to `blog-sidebar-inject.js?v=24`.

**Opened:** Push to GitHub Pages and update Wix Custom Code from `?v=23` to `?v=24`.
**Closed:** Local Playwright mock: with a 120px header, sidebar hidden at page top and visible after header scroll; without a header, sidebar visible at page top; old mini-nav remains absent.

**Next session should:** After v24 is active, cold-load the Berlin Wall post and confirm the sidebar starts at the top position only after the menu area has passed.

## 2026-05-24 — Codex (Blog sidebar top anchor v23)

**Did:** Moved the desktop blog sidebar up to the top of the viewport so the new sidebar-internal blog nav does not make the `On this page` index feel cramped.

**Changed:**
- `js/blog-sidebar-inject.js` — sidebar now anchors at `24px`, uses flex layout, lets the index card take remaining viewport height, and can be visible from the top of the post page.
- `README.md`, `wix-embed-snippets.md` — bumped the blog helper URL to `blog-sidebar-inject.js?v=23`.

**Opened:** Push to GitHub Pages and update Wix Custom Code from `?v=22` to `?v=23`.
**Closed:** Local Playwright mock: sidebar visible at page top, top `24px`, old mini-nav absent, nav above index, 6 category links, 12 index links, and the index card fits without internal scrolling in the 900px-high test viewport.

**Next session should:** After v23 is active, cold-load a long Berlin Wall post and verify the right sidebar starts near the top and the index no longer feels cramped.

## 2026-05-24 — Codex (Blog sidebar nav v22)

**Did:** Moved the blog `Blog Home` / `Categories` navigation into the right desktop `On this page` sidebar to avoid Wix post header/body flicker.

**Changed:**
- `js/blog-sidebar-inject.js` — removed mini-nav creation/timing/repair logic; sidebar now renders `Blog Home` and category pills above the index and removes stale `[data-bw-blog-mini-nav]` nodes from older versions.
- `README.md`, `wix-embed-snippets.md` — bumped the blog helper URL to `blog-sidebar-inject.js?v=22` and documented sidebar-only blog navigation.

**Opened:** Push to GitHub Pages and update Wix Custom Code from `?v=21` to `?v=22`.
**Closed:** Local mock `/post/` test: old mini-nav absent, sidebar nav exists above `On this page`, 6 category links render, and sidebar is visible.

**Next session should:** After v22 is active, cold-load the Berlin Wall post and confirm the right sidebar nav stays stable with no Quick Summary/header flicker.

## 2026-05-24 — Codex (Blog mini-nav v21 stable content placement)

**Did:** Changed strategy for the flickering blog mini-nav: stop fighting Wix's volatile post header/title render area.

**Changed:**
- `js/blog-sidebar-inject.js` — mini-nav now inserts as the first child of the stable post content body when possible, so it appears below H1 and before the article text instead of above the title.
- `README.md`, `wix-embed-snippets.md` — bumped the blog helper URL to `blog-sidebar-inject.js?v=21`.

**Opened:** Push to GitHub Pages and update Wix Custom Code from `?v=20` to `?v=21`.
**Closed:** Local mock `/post/` test: nav is inside `[data-hook="post-content"]`, first child, after H1, visible by 900ms, and delayed repair still works after forced removal.

**Next session should:** After v21 is active, cold-load the Berlin Wall post and verify the nav is below the title and no longer flickers.

## 2026-05-24 — Codex (Blog mini-nav v20 adaptive timing)

**Did:** Replaced the too-slow v19 fixed 3.2s mini-nav delay with adaptive timing so the menu comes back faster without jumping into Wix's first render churn.

**Changed:**
- `js/blog-sidebar-inject.js` — mini-nav waits at least ~1.4s, renders once the H1/header position is stable for ~450ms, and force-renders by ~2.4s if needed; repair delay reduced to 900ms.
- `README.md`, `wix-embed-snippets.md` — bumped the blog helper URL to `blog-sidebar-inject.js?v=20`.

**Opened:** Push to GitHub Pages and update Wix Custom Code from `?v=19` to `?v=20`.
**Closed:** Local mock `/post/` test: no nav at 1.1s, nav present before H1 at 1.8s, still present at 2.5s.

**Next session should:** After v20 is active, cold-load the Berlin Wall post and verify the nav appears quickly without show-hide-show.

## 2026-05-24 — Codex (Blog mini-nav v19 delayed render)

**Did:** Fixed the blog `Blog Home / Categories` mini-nav visibly appearing, disappearing, and coming back while Wix finishes rendering the post header.

**Changed:**
- `js/blog-sidebar-inject.js` — removed mini-nav injection from the early sidebar pass; mini-nav now waits ~3.2s before first render and uses a slower debounce if Wix removes it later.
- `README.md`, `wix-embed-snippets.md` — bumped the blog helper URL to `blog-sidebar-inject.js?v=19`.

**Opened:** Push to GitHub Pages and update Wix Custom Code from `?v=18` to `?v=19`.
**Closed:** Local mock `/post/` test: nav absent at 1.1s, present before H1 at 3.7s, delayed repair restores it after forced removal without instant flashing.

**Next session should:** After v19 is active, cold-load the Berlin Wall post and verify the mini-nav does not show-hide-show.

## 2026-05-24 — Codex (Tools hub embed CTA moved)

**Did:** Moved the `Have a travel site or hotel website?` embed CTA from the top of `/berlin-tools` to the bottom, below all tool categories and above the tour footer.

**Changed:**
- `tools-hub/index.html` — standalone hub CTA now renders after `#tools-root`.
- `tools-hub/tools-hub-element.js` — Custom Element shell matches the same CTA placement.

**Opened:** Push to GitHub Pages so the live `/berlin-tools` page picks up the lower CTA placement.
**Closed:** Local Playwright check confirms CTA appears after the last category and before the footer.

**Next session should:** Cold-load `/berlin-tools` after push and verify first viewport starts directly with Tickets & Money.

## 2026-05-24 — Codex (Gemini Pro tool icons)

**Did:** Generated the 8 missing tools-hub card icons with Gemini Pro as a no-text 4x2 sheet, cropped them, cleaned the baked-in tile backgrounds, and wired them into the hub data.

**Changed:**
- `tools-home/icons/` — added 512px and 160px PNGs for `berlin-luggage-storage`, `berlin-currywurst-finder`, `alexanderplatz-parking-map`, `berlin-parking-calculator`, `connectivity-picker`, `berlin-club-picker`, `berlin-wall-remnants`, `german-phrases-quiz`; flattened their backgrounds to site cream so the hub card does not show nested icon frames.
- `tools-hub/data.json` — added GitHub Pages `image` URLs for the 8 new icons.
- `tools-home/icons/manifest.json` — appended source/crop metadata for the new icons.
- Root `PROJECT_MEMORY.md` — updated missing-icon note to generated/resolved.

**Opened:** Push to GitHub Pages so the new absolute image URLs resolve live.
**Closed:** `tools-hub/data.json` now has `image` for all 26 tools.

**Next session should:** After push, verify `/berlin-tools` shows 26 real icons and zero fallback letters.

## 2026-05-24 — Codex (Tools hub card icons)

**Did:** Activated the existing PNG icon URLs on the `/berlin-tools` hub cards and listed the tools that still need icons.

**Changed:**
- `tools-hub/index.html` — standalone/iframe hub now renders `tool.image` as a 64px card icon, with temporary yellow/lime first-letter fallback for missing images.
- `tools-hub/tools-hub-element.js` — Custom Element version now matches the same icon/fallback behavior.
- Root `PROJECT_MEMORY.md` — recorded the 8 missing icon slugs.

**Opened:** Generate/upload icons for `berlin-luggage-storage`, `berlin-currywurst-finder`, `alexanderplatz-parking-map`, `berlin-parking-calculator`, `connectivity-picker`, `berlin-club-picker`, `berlin-wall-remnants`, `german-phrases-quiz`.
**Closed:** Local render shows 26 cards: 18 real image icons and 8 fallbacks, with no horizontal overflow.

**Next session should:** After push, verify `/berlin-tools` live; then add Wix Media URLs for the 8 new icons to `tools-hub/data.json`.

## 2026-05-24 — Codex (Blog sidebar v18 repair)

**Did:** Fixed the right sticky "On this page" blog index disappearing after recent mini-nav/PDF form fixes.

**Changed:**
- `js/blog-sidebar-inject.js` — sidebar now hides only below 900px instead of 1024px, stores its live body/heading state, detects stale Wix-rerendered body references, and quietly rebuilds the sidebar when needed.
- `README.md`, `wix-embed-snippets.md` — bumped the blog helper URL to `blog-sidebar-inject.js?v=18` and documented the sidebar repair behavior.

**Opened:** Push to GitHub Pages and update Wix Custom Code from `?v=17` to `?v=18`.
**Closed:** `node --check` passes; local mock `/post/` test at 950px shows the sidebar after scrolling into the article.

**Next session should:** Cold-load a live post with v18 active and confirm the top mini-nav, right index, and Survival Map form all remain visible.

## 2026-05-24 — Codex (German Phrases Quiz redesign)

**Did:** Reworked the quiz widget visual design so `/tools/german-phrases-quiz` no longer feels like a generic card and fixed the retry/start click binding.

**Changed:**
- `german-phrases-quiz/german-phrases-quiz-element.js` — wider premium layout, strong green hero, yellow 10-question mark, start detail chips, right-side phrase visual, two-column desktop answers, cleaner feedback/result copy, all `[data-bwgpq-start]` buttons bound.
- `german-phrases-quiz/index.html` — transparent page background, tighter body padding, and hidden document overflow to prevent the nested iframe scrollbar.
- `tools-hub/data.json` — `german-phrases-quiz` embedHeight lowered from 620 to 540.

**Opened:** Push to GitHub Pages, then cold-load the live Wix tool page and check the iframe gap.
**Closed:** `node --check` passes; Playwright verified start, 10 answers, result screen, and Try Again restart.

**Next session should:** If the live page still shows extra white space after push, inspect the Wix dynamic-page iframe/section height rather than the widget body.

## 2026-05-24 — Codex (Blog menu watchdog)

**Did:** Fixed the PDF lead form regression where the blog mini-nav appeared briefly and then disappeared, taking the desktop index with it on some Wix renders.

**Changed:**
- `js/blog-sidebar-inject.js` — added a small mini-nav-only watchdog to restore `Blog Home` / `Categories` if Wix/React removes it; this does not use the old full-rebuild path that caused blinking.
- `wix-embed-snippets.md` — bumped the blog helper URL to `blog-sidebar-inject.js?v=17`.

**Opened:** Push to GitHub Pages and update Wix Custom Code from `?v=16` to `?v=17`.
**Closed:** None until live verification.

**Next session should:** After v17 is live, cold-load a blog post and confirm the mini-nav, right index, and Survival Map form coexist.

## 2026-05-24 — Codex

**Did:** Reworked the blog lead form into the Berlin Survival Map capture widget and removed the bottom `by berlinwalk.com` attribution bar.

**Changed:**
- `lead-form/index.html` — Survival Map copy, cover image, immediate download button after subscribe, local resize script, no `brand.js` attribution.
- `lead-form/assets/berlin-survival-map-cover.jpg` — optimized cover image for the form mockup.
- `js/lead-form-inject.js` — injects the Survival Map form mid-post with 320px fallback height.
- `js/exit-intent-popup.js` — updated PDF CTA/success copy and download link.
- `README.md`, `wix-embed-snippets.md`, `AGENTS.md` — documented the Survival Map lead form.
- Wix Media: uploaded the PDF; public URL is `https://12ee5ea0-70a7-492f-8020-ffb27cbb630f.usrfiles.com/ugd/5a08a3_fbb1e603406b4ac4b7a15628a0288e40.pdf`.

**Opened:** Push to GitHub Pages, then update/verify Wix Custom Code cache if needed.
**Closed:** Lead form no longer shows the attribution footer.

**Next session should:** After push, cold-load a live `/post/` URL and confirm the form renders, captures email, and shows the direct PDF download.

## 2026-05-24 — Claude Code

**Did:** Converted the inline HTML quiz from the `50 German phrases` blog post into a Custom Element; added to tools-hub.

**Changed:**
- `german-phrases-quiz/german-phrases-quiz-element.js` — new `<bw-german-phrases-quiz>` Custom Element (card layout, green header, auto-advance 1.8s, 4 result tiers, Try Again resets state internally)
- `german-phrases-quiz/index.html` — standalone preview page
- `tools-hub/data.json` — added slug `german-phrases-quiz`, category Discovery, embedHeight 620

**Opened:** Wix BerlinTools CMS row not yet inserted (`/tools/german-phrases-quiz` page doesn't exist yet — needs API insert or Content Studio Widget Builder after push).
**Closed:** —

**Next session should:** Push `berlinwalk-widgets` to GitHub, then insert BerlinTools CMS row via `insert-berlintool` API (or Content Studio Widget Builder) to create the live `/tools/german-phrases-quiz` page.

## 2026-05-24 — Claude Code (Hero lead copy: medieval Berlin USP)

**Did:** Rewrote homepage hero description to lead with the medieval Berlin angle (the original USP) instead of the generic "city's layers" line.

**Changed:**
- `hero-home/hero-home-element.js` — replaced `bw-hero-lead` paragraph with: "Berlin was founded in 1237, but most tours skip straight to 1933. In about 2 hours, walk the medieval core from Alexanderplatz to Hackescher Markt with Yusuf, and see the city the way a Berliner reads it: oldest streets first." No em dashes (brand rule).
- External: Yusuf pushed to GitHub; GitHub Pages will serve the updated element.

**Opened:** None.
**Closed:** Hero copy no longer omits the medieval/old-Berlin USP that the previous header revision had dropped.

**Next session should:** Cold-load `berlinwalk.com` with a cache-bust query and confirm the new lead paragraph is live in the hero.

## 2026-05-23 — Codex (Add May 23 tour selfie to gallery)

**Did:** Added Yusuf's May 23 group selfie as the ninth homepage gallery image after matching it to the existing gallery's warmer color grade.

**Changed:**
- `gallery/images/09-*` — generated JPG/WebP responsive variants plus full-size lightbox assets from `/Users/yusufucuz/Downloads/yusuftourselfie23may.jpeg`.
- `gallery/data.json` — added photo `09` with English alt/caption text.
- `gallery/gallery-element.js`, `gallery/index.html` — expanded the gallery mosaic and skeleton from 8 to 9 tiles.

**Opened:** Push/deploy `berlinwalk-widgets` so GitHub Pages serves the new gallery asset/data.
**Closed:** None.

**Next session should:** After push, cold-load the homepage/gallery with a cache-bust query and confirm the ninth image appears on live Wix.

## 2026-05-23 — Claude Code (Add Anna France review to homepage + /reviews)

**Did:** Added new 5-star FreeTour.com review from Anna (France) to both the homepage testimonials carousel and the Wix Reviews CMS. First France entry in either surface.

**Changed:**
- `testimonials/data.json` — prepended `anna-france` review (May 2026, 🇫🇷, 5★).
- Wix: inserted Reviews item `829a40f6-898b-4345-98f4-cb51f757562d` (firstName Anna, lastInitial A, country France, rating 5, source FreeTour.com, sourceUrl `https://www.freetour.com/berlin/berlin-behind-the-landmarks-a-walk-through-power-faith-change`, approved=true). Verified live via `/_functions/listReviews`.

**Opened:** `tourDate` was set to the review post date (2026-05-23) because actual tour date is unknown. Update via Wix Data PUT if a real date is confirmed. Also push `berlinwalk-widgets` so GitHub Pages serves the updated `testimonials/data.json`.
**Closed:** None.

**Next session should:** No follow-up unless Yusuf wants to correct the placeholder `tourDate`.

## 2026-05-23 — Codex (Blog nav v16 verified)

**Did:** Yusuf confirmed the v16 blog helper fixed the issue: the in-post menu is back and the right "On this page" sidebar stopped blinking.

**Changed:**
- Project root: `PROJECT_MEMORY.md`, `SESSION_LOG.md` — marked v16 as live/verified.

**Opened:** None.
**Closed:** Blog mini-nav/sidebar blinking regression.

**Next session should:** Leave `blog-sidebar-inject.js?v=16` in Wix Custom Code unless a new blog-nav design is intentionally rebuilt.

## 2026-05-23 — Codex (Restore mini-nav and stop sidebar rebuilds)

**Did:** Fixed the v15 regression: restoring the in-post blog menu while stopping mini-nav absence from repeatedly rebuilding the right "On this page" sidebar.

**Changed:**
- `js/blog-sidebar-inject.js` — restored static non-sticky `Blog Home` / `Categories` mini-nav; removed mini-nav-driven `scheduleInject()` from the MutationObserver; removed mini-nav transition effects that could blink during insertion.
- `README.md`, `wix-embed-snippets.md` — bumped blog helper URL to `blog-sidebar-inject.js?v=16` and documented the stable static mini-nav.
- Project root: `PROJECT_MEMORY.md`, `SESSION_LOG.md` — recorded v16 behavior.

**Opened:** Push/deploy `berlinwalk-widgets`, update Wix Custom Code to `blog-sidebar-inject.js?v=16`, then cold-load and scroll a live post.
**Closed:** v15 removed the menu and made the sidebar blink through repeated observer-triggered rebuilds.

**Next session should:** If any flicker remains after v16, instrument `positionSidebar()` visibility toggles rather than changing mini-nav behavior.

## 2026-05-23 — Codex (Disable blog mini-nav entirely)

**Did:** After v14 still did not stop Yusuf's blinking in three browsers, fully disabled the in-post `Blog Home` / `Categories` mini-nav rather than trying to stabilize it.

**Changed:**
- `js/blog-sidebar-inject.js` — `injectMiniNav()` now removes any existing mini-nav and does not recreate it; desktop "On this page" sidebar, share buttons, and CTA compacting remain.
- `README.md`, `wix-embed-snippets.md` — documented that the mini-nav is disabled and bumped the blog helper URL to `blog-sidebar-inject.js?v=15`.
- Project root: `PROJECT_MEMORY.md`, `SESSION_LOG.md` — recorded the v15 behavior.

**Opened:** Push/deploy `berlinwalk-widgets`, update Wix Custom Code to `blog-sidebar-inject.js?v=15`, and cold-load a live post. The blinking menu should be gone because the menu is no longer rendered.
**Closed:** In-post blog mini-nav is disabled.

**Next session should:** If Yusuf wants category navigation back later, rebuild it as a Wix-native/static section or reinsert only after a long post-load delay with opacity gating.

## 2026-05-23 — Codex (Disable blog mini-nav sticky)

**Did:** Corrected the diagnosis: Yusuf's blinking element is the in-post blog `Blog Home / Categories` mini-nav, not the global site header. Disabled the mini-nav's sticky/up-scroll behavior.

**Changed:**
- `js/blog-sidebar-inject.js` — no longer calls `installMiniNavSticky()`, so the blog mini-nav remains static in normal article flow; removed the mistaken header stabilizer patch.
- `wix-embed-snippets.md` — bumped the blog helper URL to `blog-sidebar-inject.js?v=14`.
- Project root: `PROJECT_MEMORY.md`, `SESSION_LOG.md` — recorded the corrected v14 behavior.

**Opened:** Push/deploy `berlinwalk-widgets`, update Wix Custom Code to `blog-sidebar-inject.js?v=14`, and cold-load a live blog post.
**Closed:** Blog mini-nav can no longer enter sticky/fixed mode and blink during Wix load/layout changes.

**Next session should:** If the static v14 mini-nav still blinks, inspect whether Wix itself is rerendering the blog post title area and consider delaying mini-nav insertion until after `document.readyState === "complete"`.

## 2026-05-23 — Codex (Blog header stabilizer)

**Did:** Added a blog-page header stabilizer after the standalone header v4 change still did not stop Yusuf's visible blinking.

**Changed:**
- `js/blog-sidebar-inject.js` — on `/post/` pages, injects a header stability CSS patch and repeatedly forces visible `<bw-site-header>` ancestor shells to `translateY(0)`, no transition, visible, and pointer-active for the first 10 seconds.
- `wix-embed-snippets.md` — bumped the blog helper cache-bust URL to `?v=13`.
- Project root: `PROJECT_MEMORY.md`, `SESSION_LOG.md` — recorded the v13 blog header stabilizer.

**Opened:** Push/deploy `berlinwalk-widgets`, update Wix Custom Code to `blog-sidebar-inject.js?v=13`, and cold-load a live blog post. Keep Site Header v4 too.
**Closed:** Blog script now overrides header/container transform flicker even if the header element or Wix shell tries to animate.

**Next session should:** If blinking persists after v13, inspect Wix Studio header animations/breakpoint duplicate setup directly in the editor.

## 2026-05-23 — Codex (Disable header auto-hide)

**Did:** Followed up after the v3 header guard did not eliminate the live flicker; disabled header auto-hide entirely so the top menu remains stable during blog load and scroll.

**Changed:**
- `site-header/site-header-element.js` — `_setHeaderHidden()` now always pins the Wix header shell at `translateY(0)` with no transform transition; scroll handler only updates the progress bar.
- `wix-embed-snippets.md` — bumped the Site Header source URL to `site-header-element.js?v=4`.
- Project root: `PROJECT_MEMORY.md`, `SESSION_LOG.md` — recorded stable always-visible header behavior.

**Opened:** Push/deploy `berlinwalk-widgets`, update the Wix Custom Element source URL for `bw-site-header` to `https://fenerszymanski.github.io/berlinwalk-widgets/site-header/site-header-element.js?v=4`, then cold-load a blog post.
**Closed:** Header auto-hide can no longer create appear/disappear flicker.

**Next session should:** If flicker persists after v4 is live, inspect Wix Studio header/container animation itself rather than widget JS.

## 2026-05-23 — Codex (Site header load flicker)

**Did:** Re-diagnosed the reported blog load flicker as the global site header, not the blog category mini-nav, and hardened `<bw-site-header>` against Wix duplicate/hidden header instances.

**Changed:**
- `site-header/site-header-element.js` — setup now waits one animation frame, skips hidden Wix breakpoint/container instances, and only hides the header after real user scroll intent so Wix load/layout scroll changes cannot make the header disappear and reappear.
- `wix-embed-snippets.md` — bumped the Site Header source URL to `site-header-element.js?v=3`.
- Project root: `PROJECT_MEMORY.md`, `SESSION_LOG.md` — recorded the v3 header cache-bust.

**Opened:** Push/deploy `berlinwalk-widgets`, update the Wix Custom Element source URL for `bw-site-header` to `https://fenerszymanski.github.io/berlinwalk-widgets/site-header/site-header-element.js?v=3`, then cold-load a blog post in a separate browser.
**Closed:** Hidden duplicate header instance and non-user load scroll events can no longer drive header hide/show behavior.

**Next session should:** Verify live header load on desktop and mobile after Wix uses the v3 source URL.

## 2026-05-23 — Codex (Blog mini-nav load flicker)

**Did:** Fixed the blog category mini-nav load flicker where it could appear, disappear, and reappear while Wix finished rendering the post.

**Changed:**
- `js/blog-sidebar-inject.js` — split sidebar-only cleanup from full UI cleanup so sidebar refreshes no longer remove/reinsert the top mini-nav; full cleanup still runs on route changes and non-post pages.
- `wix-embed-snippets.md` — bumped the blog helper cache-bust URL to `?v=12`.
- Project root: `PROJECT_MEMORY.md`, `SESSION_LOG.md` — recorded the v12 behavior.

**Opened:** Push/deploy `berlinwalk-widgets`, then update Wix Custom Code to `blog-sidebar-inject.js?v=12` and verify one live blog post on a cold load.
**Closed:** Mini-nav self-induced remove/reinsert flicker during injection.

**Next session should:** After GitHub Pages deploys, cold-load a live post in an incognito/private window and confirm the category bar stays stable.

## 2026-05-22 — Codex (Exit intent popup)

**Did:** Built the desktop-only sitewide exit-intent popup and local preview harness; added an optimized World Clock image, thank-you page exclusion, and GA/GTM tracking events.

**Changed:**
- `js/exit-intent-popup.js` — new 30-second dwell + top-exit trigger, once-per-session guard, booking CTA, inline Berlin Essentials signup posting to the live Velo subscribe endpoint, mobile/checkout skips.
- `assets/exit-intent-world-clock.jpg` — optimized 77 KB World Clock image for the popup.
- `_test-exit-intent.html` — local preview page with session reset, simulated top-exit controls, and localhost-only forced preview param.
- `README.md`, `wix-embed-snippets.md` — documented the Wix Body-end Custom Code URL.
- Project root: `PROJECT_MEMORY.md`, `SESSION_LOG.md` — recorded the new sitewide script and install note.

**Opened:** Push/deploy `berlinwalk-widgets`, then add `https://fenerszymanski.github.io/berlinwalk-widgets/js/exit-intent-popup.js` in Wix Custom Code Body-end on all pages and verify live desktop only; make sure thank-you/confirmation pages stay quiet. For live debug only, `?bwExitPreview=1` forces a 0.5s auto-open on `berlinwalk.com`. GA/GTM events: `bw_exit_popup_view`, `bw_exit_popup_book_click`, `bw_exit_popup_pdf_click`, `bw_exit_popup_submit_success`, `bw_exit_popup_submit_error`, `bw_exit_popup_close`.
**Closed:** Local `node --check`, ASCII scan, browser 30-second trigger/CTA/PDF validation, and mocked mobile/checkout skip checks passed.

**Next session should:** After deploy, test one live non-booking desktop page plus the booking route to confirm the popup appears only where intended.

## 2026-05-22 — Codex (Public toilets geolocation fix)

**Did:** Fixed `Use my location` on the live `public-toilets-in-berlin` post by updating the sitewide iframe helper and adding a widget-side parent geolocation fallback for the next deploy.

**Changed:**
- `public-toilets-map/index.html` — added parent-window geolocation fallback if iframe geolocation is blocked.
- Project root: `berlinwalk-widget-auto-resize-custom-code.js` — adds `allow="geolocation *"` to BerlinWalk widget iframes, reloads geolocation widgets once, and handles parent geolocation requests.
- Wix Custom Embed `BerlinWalk widget auto-resize` (`db9e238d-1e40-4a8b-b9a4-b994dbaaefd4`) — updated to revision 10.
- Project root: `PROJECT_MEMORY.md`, `SESSION_LOG.md` — recorded revision 10 behavior.

**Opened:** Push/deploy `berlinwalk-widgets` so the widget-side fallback is live too; the live Wix custom-code fix already makes the current post work.
**Closed:** Live Chrome test confirmed the public-toilets iframe reloads with geolocation permission and sorts nearest toilets from the supplied location.

**Next session should:** After the next widget repo push, verify the deployed `public-toilets-map/index.html` includes the parent fallback.


## 2026-05-21 — Codex (Club draft matrix fix)

**Did:** Fixed the Wix draft section where the markdown club matrix rendered as raw pipe-table text.

**Changed:**
- `blog-drafts/what-to-wear-to-berlin-clubs.md`, `.body.md` — replaced the markdown table with a bullet-based club matrix.
- Wix Blog draft `f4eec937-98fe-4746-87ef-6221b9a3909b` — patched existing draft rich content; verified raw table header is gone and the fast-version matrix text exists.
- Project root: `PROJECT_MEMORY.md`, `SESSION_LOG.md` — updated draft verification counts and noted the table fix.

**Opened:** Re-preview in Wix editor/browser to confirm the section now reads cleanly.
**Closed:** Raw markdown table rendering in the Club Dress-Code Matrix section.

**Next session should:** Continue visual QA for remaining draft sections, especially spacing around embeds.

## 2026-05-21 — Codex (Club dress-code Wix draft)

**Did:** Created the Wix Blog draft for `What to Wear to Berlin Clubs: Dress Codes, Door Difficulty & Club-by-Club Tips`.

**Changed:**
- Wix Blog: draft `f4eec937-98fe-4746-87ef-6221b9a3909b`, status `UNPUBLISHED`, slug `what-to-wear-to-berlin-clubs`, Tourist Tips category.
- Project root: `PROJECT_MEMORY.md`, `SESSION_LOG.md` — recorded draft ID and verification counts.

**Opened:** Add/choose cover image, visually check Wix editor spacing/tables/embeds, push/deploy `berlinwalk-widgets` so `club-picker/` loads before publish, and recheck venue-specific claims.
**Closed:** API verification confirmed 232 rich-content nodes, 3 HTML embeds (quick summary, Club Picker, FAQ), 49 bold decorations, 4 links, and booking link present.

**Next session should:** Preview the draft in Wix editor after widget deploy; if table formatting feels weak, replace the markdown-style matrices with native Wix tables or shorter list sections.

## 2026-05-21 — Codex (Berlin Club Picker tools entry)

**Did:** Added the new Berlin Club Picker to the tools/widgets catalog and created its Wix BerlinTools dynamic-page row.

**Changed:**
- `tools-hub/data.json` — added `berlin-club-picker` in Discovery, pointing to `club-picker/` with embedHeight `1180`.
- `widgets-hub/SEO_ADDITIONAL_TAGS.md` — regenerated widgets ItemList SEO; now 24 widgets.
- Project root: `insert-club-picker-tool.js` — one-off Wix CMS insertion script.
- Wix CMS `BerlinTools`: inserted and re-saved item `0111e70d-1ea6-44f7-98be-953601d0f352`, slug `berlin-club-picker`; live route verified 200.
- Project root: `PROJECT_MEMORY.md`, `SESSION_LOG.md` — recorded live tools state.

**Opened:** Push/deploy `berlinwalk-widgets`; until GitHub Pages has `club-picker/`, the live `/tools/berlin-club-picker` page can load the CMS content but the primary widget iframe may not render.
**Closed:** Tools hub data and Wix dynamic route now exist for Club Picker.

**Next session should:** After push, verify `https://fenerszymanski.github.io/berlinwalk-widgets/club-picker/` and the live `/tools/berlin-club-picker` widget iframe.

## 2026-05-21 — Codex (Berlin Club Picker + dress-code draft)

**Did:** Built the Berlin Club Picker widget and drafted the source-backed club dress-code article package.

**Changed:**
- `club-picker/index.html` — new iframe widget with five questions, club scoring, Door Difficulty stars, outfit/avoid tips, backup options, and responsive club matrix.
- `blog-drafts/what-to-wear-to-berlin-clubs.md`, `.body.md` — local English draft with embed plan, club-by-club guidance, source list, and CTA.
- `quick-summary/data.json`, `faq/data.json`, `faq/inject.js` — added `berlin-club-dress-code` quick summary/FAQ/schema; also corrected old tour-duration mentions in touched data to about 2 hours.
- `README.md`, `wix-embed-snippets.md` — documented the new widget and post embed URLs.
- Project root: `PROJECT_MEMORY.md`, `SESSION_LOG.md` — recorded package state and next steps.

**Opened:** Push/deploy `berlinwalk-widgets`, recheck current venue details, then create the Wix blog draft and embed quick summary + Club Picker + FAQ. Existing untracked `berlin-wall-map/` was present and left untouched.
**Closed:** Local JSON/JS checks passed; Playwright/Chrome preview confirmed desktop/mobile widget rendering, no horizontal overflow, and correct KitKat/Sisyphos recommendation paths.

**Next session should:** Create the Wix draft from `.body.md`, verify the live GitHub Pages widget after push, and consider whether Club Picker should become a standalone BerlinTools CMS item.

## 2026-05-21 — Codex (Blog Guide Note custom element)

**Did:** Built `<bw-blog-guide-note>` for the Wix `/blog` right column using Yusuf's `TourYusuf.jpeg` photo, editorial-note direction, and a small `Plan your visit` tools card.

**Changed:**
- `blog-guide-note/blog-guide-note-element.js` — new non-sticky right-column Custom Element with photo, note copy, `/the-guide`, booking, and `/berlin-tools` links; hidden on mobile.
- `blog-guide-note/yusuf-tour-note.jpg` — optimized 960×640 crop generated from `/Users/yusufucuz/Downloads/TourYusuf.jpeg`.
- `blog-guide-note/index.html` — local preview page.
- `README.md`, `wix-embed-snippets.md` — added Custom Element source/tag info.
- Project root: `PROJECT_MEMORY.md`, `SESSION_LOG.md` — recorded blog index right-column behavior.

**Opened:** Push/deploy `berlinwalk-widgets`, then add Custom Element on Wix `/blog`: source `https://fenerszymanski.github.io/berlinwalk-widgets/blog-guide-note/blog-guide-note-element.js`, tag `bw-blog-guide-note`; set element height around 960-980px.
**Closed:** Local `node --check` passed; Playwright preview confirmed image loads, no overflow, mobile hidden, and the card is not sticky.

**Next session should:** Verify the card visually in the real Wix right column and adjust height/crop if Wix column width differs.

## 2026-05-21 — Codex (Blog nav editorial redesign)

**Did:** Implemented and refined the blog menu redesign in the live blog helper: compact `Blog Home` + labelled `Categories` chips, mobile horizontal-scroll bar, and top-pinned sticky return on upward scroll.

**Changed:**
- `js/blog-sidebar-inject.js` — replaced the red wrapped mini-nav with a compact editorial bar/chip layout; mobile always uses the thin horizontal chip bar and sticky pins to top.
- `README.md`, `wix-embed-snippets.md` — documented the v11 blog helper behavior and cache-bust URL.
- Project root: `PROJECT_MEMORY.md`, `SESSION_LOG.md` — recorded v11 behavior.

**Opened:** Push/deploy `berlinwalk-widgets`, then update Wix Custom Code to `blog-sidebar-inject.js?v=11` and verify one desktop + one mobile blog post live.
**Closed:** Local `node --check` passed; Playwright simulation confirmed no desktop/mobile overflow, mobile two-column chips, sidebar injection, and upward-scroll sticky activation.

**Next session should:** After GitHub Pages deploys, verify the sticky compact bar does not collide with the live Wix header on real mobile Safari.



---

## 2026-05-20 — Codex (Berlin Quiz mobile fix)

**Did:** Fixed `<bw-berlin-quiz>` mobile layout overflow/height issue seen in Wix Studio.

**Changed:**
- `berlin-quiz/berlin-quiz-element.js` — added section border-box sizing/overflow guard, tightened mobile padding/type, and changed start-screen category tags to a two-column mobile grid so they no longer clip.

**Opened:** Push/deploy widgets repo, then verify the homepage quiz section in Wix mobile preview and publish.
**Closed:** Local `node --check` passed; Playwright checks at 360px confirmed no horizontal overflow on start, question, and answered states.

**Next session should:** After deploy, cache-bust/check the live GitHub Pages asset and confirm Wix mobile preview pulls the updated quiz script.

## 2026-05-20 — Claude Code (Mobile menu portal fix)

**Did:** Fixed `<bw-site-header>` mobile menu — the overlay was clipping to the Wix header height (~150px) on mobile, leaving the panel head visible but nav + CTA bleeding through the homepage hero. Root cause: Wix header wrapper has transform/sticky context, so `position: fixed` becomes effectively `position: absolute` relative to the wrapper, not the viewport. Same risk for the Resources dropdown.

**Changed:**
- `site-header/site-header-element.js` — Portal pattern: on connect, the mobile overlay and dropdown submenu are appended to `document.body` so `position: fixed` is honored against the viewport. Cleanup in `disconnectedCallback` removes the portaled nodes. CSS variables (`--green`, `--yellow`, `--light-green`) and `font-family` were inlined on `.bw-header-mobile` and `.bw-header-submenu` so they style correctly outside `.bw-header-wrap`. Mobile overlay z-index bumped to `2147483646` to win against any Wix sticky/floating widgets.

**Opened:** After deploy, Yusuf verifies on mobile: hamburger → full-screen overlay slides in, nav + CTA + trust line all visible, backdrop opaque, body scroll lock works, ESC/backdrop tap closes. Also verify Resources dropdown on desktop still positions correctly (now portaled).
**Closed:** Mobile overlay clipped by Wix header transform ancestor.

**Next session should:** Live-test the mobile menu and dropdown on a real device. If dropdown is offset (because JS computes coords from trigger but menu is at body), check positionMenu logic.

## 2026-05-20 — Codex (Blog nav styling + H1 index start)

**Did:** Restyled the blog category nav and changed the right-side index start point to the post H1.

**Changed:**
- `js/blog-sidebar-inject.js` — removed the early-body threshold; sidebar now starts at the first visible post H1 and still disappears near the final meaningful article text. Blog category nav now uses a soft cream card, wrapped rows, red inactive labels, green active label, and yellow underline hover/active treatment.
- `README.md`, `wix-embed-snippets.md` — documented the H1 start/styled nav behavior and bumped the snippet to `?v=8`.
- Project root: `PROJECT_MEMORY.md`, `SESSION_LOG.md` — recorded v8 behavior.

**Opened:** Push/deploy widgets repo and make sure Wix Custom Code uses `blog-sidebar-inject.js?v=8`.
**Closed:** Local syntax check passed; `js/blog-sidebar-inject.js` has no non-ASCII characters.

**Next session should:** Verify live that the category nav feels polished without horizontal scroll and the index appears with the H1, then vanishes near the article end.

## 2026-05-20 — Codex (Blog index earlier start)

**Did:** Moved the right-side blog index upward and made it appear earlier while preserving the end-of-body disappear behavior.

**Changed:**
- `js/blog-sidebar-inject.js` — sidebar fixed top changed from `188px` to `150px`; start threshold now allows the index to appear slightly before the first meaningful body text (`SIDEBAR_START_EARLY = 220`); end threshold unchanged.
- `wix-embed-snippets.md` — bumped the snippet to `?v=7`.
- Project root: `PROJECT_MEMORY.md` — recorded v7 URL and updated behavior note.

**Opened:** Push/deploy widgets repo and make sure Wix Custom Code uses `blog-sidebar-inject.js?v=7`.
**Closed:** Local syntax check passed; `js/blog-sidebar-inject.js` has no non-ASCII characters.

**Next session should:** Verify live that the index starts higher/earlier but still disappears near the article body end.

## 2026-05-20 — Codex (Blog category nav wrap)

**Did:** Changed the blog category nav from horizontal scroll to a wrapped two-line layout.

**Changed:**
- `js/blog-sidebar-inject.js` — `.bw-blog-mini-nav-inner` now uses `flex-wrap`, centered desktop rows, no horizontal overflow, and tighter mobile wrapping.
- `README.md`, `wix-embed-snippets.md` — documented the wrapped two-line nav and bumped the snippet to `?v=6`.
- Project root: `PROJECT_MEMORY.md` — recorded the v6 URL.

**Opened:** Push/deploy widgets repo and make sure Wix Custom Code uses `blog-sidebar-inject.js?v=6`.
**Closed:** Local syntax check passed; `js/blog-sidebar-inject.js` has no non-ASCII characters.

**Next session should:** Verify live that category links wrap into two clean rows without horizontal page scroll.

## 2026-05-20 — Codex (Blog category nav + bounded index)

**Did:** Matched Yusuf's requested blog post nav/index behavior: category nav before H1, index starts with body content, and index disappears after article body.

**Changed:**
- `js/blog-sidebar-inject.js` — mini-nav items are now the full category row (`All Posts`, `Tour Route`, `Berlin Myths`, `Tourist Tips`, `Before & After`, `German Language`, `Berlin History`) with active category heuristics; right index only appears between the first and last meaningful post-body text nodes; category URLs verified 200; sidebar remains compact/scrollable and near the article edge.
- `README.md`, `wix-embed-snippets.md` — documented the bounded article-body behavior and bumped the snippet to `?v=5`.
- Project root: `PROJECT_MEMORY.md`, `SESSION_LOG.md` — recorded v5 behavior.

**Opened:** Push/deploy widgets repo and make sure Wix Custom Code uses `blog-sidebar-inject.js?v=5`.
**Closed:** Local syntax check passed; category URLs returned 200.

**Next session should:** Verify on live posts with different categories: category nav appears before H1, active category is reasonable, sidebar starts at body text and disappears before post CTA/related content.

## 2026-05-20 — Codex (Blog sidebar v4 follow-up)

**Did:** Tightened the live blog right rail and made the missing mini-nav more deterministic.

**Changed:**
- `js/blog-sidebar-inject.js` — mini-nav now inserts directly before the first visible post `h1`; sidebar width/gap reduced to `236px`/`12px`, link spacing tightened, card gets internal scroll for long H2 lists, article-edge candidate sorting now prefers wide post-card wrappers, and floating CTA labels are changed to `Book Now`.
- `README.md`, `wix-embed-snippets.md` — documented v4 behavior.
- Project root: `PROJECT_MEMORY.md`, `SESSION_LOG.md` — recorded v4 behavior.

**Opened:** Push/deploy widgets repo and make sure Wix Custom Code uses `blog-sidebar-inject.js?v=4`.
**Closed:** Local syntax check passed; `js/blog-sidebar-inject.js` has no non-ASCII characters.

**Next session should:** Verify live: mini-nav appears above the post title, sidebar sits close to the article card, long index lists remain usable, and sticky CTA says `Book Now`.

## 2026-05-20 — Claude Code (Blog sticky CTA + mini-nav fix)

**Did:** Fixed two live blog-post issues Yusuf flagged: (a) desktop sticky `#bw-desktop-cta` pill bottom-right was overlapping the last `On this page` sidebar item; (b) the top mini-nav (`bw-blog-mini-nav`) had silently disappeared on some posts because the anchor finder was too strict and returned null.

**Changed:**
- `js/blog-sidebar-inject.js` — moved `#bw-desktop-cta` to bottom-left (`left:18px;right:auto`) with z-index 8000 so it never overlaps the right-side sidebar. Bumped `.bw-blog-sidebar` z-index 50 → 9000 as defense. Rewrote `findMiniNavAnchor` with multiple ancestor candidates (`article` / `[data-hook=post-page]` / `[data-hook=post-main]` / `main` / document-wide variants) and a last-resort fallback to insert at the top of `<body>` so the nav is never silently lost when Wix DOM changes.
- `wix-embed-snippets.md` — bumped blog-sidebar-inject cache-bust querystring `?v=3` → `?v=4` so Yusuf pulls the new logic in Wix Custom Code.

**Opened:** After deploy, Yusuf updates Wix Custom Code script src `?v` to `4` (or removes the query entirely and hard-refreshes) so the new injection ships.
**Closed:** Desktop sticky CTA / sidebar overlap; mini-nav silent failure on Wix DOM variants.

**Next session should:** Verify on a live post (e.g. the budget post in the screenshot): mini-nav appears at the top, sticky pill sits bottom-left, sidebar items are fully visible without obstruction.

## 2026-05-20 — Codex (Blog mini-nav + right rail polish)

**Did:** Added a compact blog navigation strip above post pages and tuned the right rail/floating CTA after Yusuf moved the article column left.

**Changed:**
- `js/blog-sidebar-inject.js` — now injects a slim `Berlin Travel Notes` mini-nav with links to All articles, Tourist Tips, Berlin History, and Tools; sidebar top moved lower (`190px`), width/gap tightened (`248px`/`24px`), desktop threshold lowered to `1024px`, and desktop floating `#bw-desktop-cta` is lightly compacted.
- `README.md`, `wix-embed-snippets.md` — documented the expanded blog helper behavior and bumped the snippet to `?v=3`.
- Project root: `PROJECT_MEMORY.md`, `SESSION_LOG.md` — recorded the v3 helper behavior.

**Opened:** Push/deploy widgets repo, update Wix Custom Code URL to `blog-sidebar-inject.js?v=3`, then verify a live blog post at the current desktop width.
**Closed:** Local syntax check passed; `js/blog-sidebar-inject.js` has no non-ASCII characters.

**Next session should:** If the injected mini-nav lands too low in Wix's DOM, adjust `findMiniNavAnchor()` to use the nearest post card wrapper ID from the live page.

## 2026-05-19 — Codex (Blog sidebar helper)

**Did:** Built a reusable blog right-rail helper matching the reference pattern: sticky “On this page” links, scroll progress, active section highlight, and share buttons. Follow-up hardening prevents the sidebar from falling onto the left side of Wix blog pages or disappearing when Wix wrappers cannot be measured.

**Changed:**
- `js/blog-sidebar-inject.js` — new Wix Custom Code script for `/post/` pages; finds visible `h2/h3` headings, assigns IDs, prefers the real article card/rightmost safe container, falls back to a fixed right rail on wide screens, hides below 1500px, and self-heals if Wix/React rerenders the blog DOM.
- `README.md`, `wix-embed-snippets.md` — documented the helper, install snippet, and 1500px desktop threshold.
- Project root: `PROJECT_MEMORY.md`, `SESSION_LOG.md` — recorded the new helper URL/behavior and session state.

**Opened:** Push/deploy widgets repo, then add the Custom Code script in Wix (Body end, blog post pages or all pages; it self-skips non-post URLs) and verify on a wide desktop blog post.
**Closed:** Local syntax check passed; local smoke test generated sidebar links/progress/IDs correctly. Follow-up syntax check passed after right-rail fallback.

**Next session should:** Verify live on `berlinwalk.com/post/...`; if Yusuf wants it visible on narrower desktops, reduce sidebar width/gap or allow overlay behavior.

## 2026-05-19 — Codex (Site header scroll hide)

**Did:** Replaced the broken shrink experiment with a safer scroll behavior: header hides on scroll down and returns on scroll up.

**Changed:**
- `site-header/site-header-element.js` — keeps `.bw-header-shrunk` off to avoid Wix placeholder/glass regressions, detects scroll direction across window/document/body scroll sources, translates the Wix header shell out of view on scroll down, and restores it on scroll up/top. Progress bar still updates.

**Opened:** Push/deploy widgets repo, then verify live homepage: no blur/glass band, header disappears while scrolling down, and reappears when scrolling up.
**Closed:** Local preview verified: header transform is `translateY(-110%)` after scroll down and `translateY(0)` after scroll up; `.bw-header-shrunk` remains false; syntax check passed.

**Next session should:** Verify live after deploy. Only reintroduce true shrink after the Wix header section Min H/height behavior is fixed in Studio.

## 2026-05-19 — Codex (Berlin Quiz spacing follow-up)

**Did:** Added the extra breathing room Yusuf requested on the Berlin Quiz start screen.

**Changed:**
- `berlin-quiz/berlin-quiz-element.js` — increased intro-to-button spacing to 46px and tag-row-to-watermark spacing to 38px; raised selector specificity so the paragraph reset no longer cancels those margins.

**Opened:** Push/deploy widgets repo so the live homepage receives this spacing tweak.
**Closed:** Local preview measurement confirms the requested gaps now apply.

**Next session should:** After push/GitHub Pages deploy, verify the quiz start screen on the live Wix homepage.

## 2026-05-19 — Claude Code (Booking + Quiz + Testimonials polish)

**Did:** Iterated on three recent rebuilds after Yusuf surfaced live issues — wide-screen hero overflow, quiz spacing/text wrap/empty space, and testimonials carousel page shift.

**Changed:**
- `book/book-element.js` — `.bw-book-inner` max-width `1120px` with `!important` to beat Wix container overrides; `.bw-book-hero-grid` capped at 1120px with `margin: 0 auto` so wide screens stop stretching the At-a-glance card to the right edge; grid template tightened to `minmax(0, 1fr) minmax(320px, 400px)`.
- `berlin-quiz/berlin-quiz-element.js` — section padding 80→48/40px; `.bw-quiz-start-inner` max-width 480px to match the original embed layout; explicit `text-align: center` on start + result descs (defensive against Wix inherit); `text-wrap: balance` for start/result descriptions so two-line wraps look balanced not orphan-lined; start desc margin-bottom 24→36px; watermark margin-top 14→26px.
- `testimonials/testimonials-element.js` — new `_lockShellHeight()` measures every testimonial on mount and locks `.bw-carousel-shell` min-height to the tallest; `_setupResizeRelock()` rAF + 120ms debounce re-measures on resize; `disconnectedCallback` cleans up the resize handler/timer. Carousel rotation no longer makes the page jump up when a shorter review swaps in.

**Opened:** Yusuf to set Wix Custom Element Min H to None for `<bw-berlin-quiz>` (Wix auto-assigned a tall Min H causing extra empty space under the watermark, same pattern as book-hero earlier).
**Closed:** Testimonials page-shift on auto-rotate; wide-screen hero layout break.

**Next session should:** Verify live after push: (a) booking hero no longer explodes on >1400px screens, (b) quiz description wraps balanced (~equal line lengths) with no orphan tail, (c) testimonial carousel stays stable through all 6 reviews without shifting.

## 2026-05-19 — Claude Code (Homepage Berlin Quiz)

**Did:** Ported the homepage `Are You Ready for Berlin?` inline-HTML Wix embed into custom element `<bw-berlin-quiz>` so it stops being a separate iframe-style embed and joins the rest of the custom-element ecosystem.

**Changed:**
- `berlin-quiz/berlin-quiz-element.js` — new file, defines `<bw-berlin-quiz>`. Three screens (start → 15 questions → result), 4 result tiers, scoped state on the element instance (no globals), method-based event handlers (no inline onclick), querySelector scoped to `this`. Visual parity with the original: dark green gradient bg, yellow accent, Montserrat 900 headlines, A/B/C/D options with lock-on-answer + fact box + restart.
- `berlin-quiz/index.html` — standalone preview.
- `AGENTS.md`, `wix-embed-snippets.md` — added berlin-quiz row.
- Project root: `PROJECT_MEMORY.md` — new `Homepage Berlin Quiz` section + install snippet.

**Opened:** Push widgets repo; remove the Wix Custom Code/HTML embed from the homepage section that hosts the quiz; drop in `<bw-berlin-quiz>` Custom Element. Section should be Apply max width OFF and H Auto (same recipe as booking/header).
**Closed:** none

**Next session should:** After Yusuf publishes, verify on live: start screen renders, START button enters quiz, all 15 questions cycle through with progress bar, correct/wrong styling + fact box behave, result screen tier matches score, BOOK CTA navigates, restart returns to start. Check on mobile too.

---

## 2026-05-19 — Codex (Currywurst map viewport)

**Did:** Fixed the Currywurst Finder map initial viewport.

**Changed:**
- `currywurst-finder/index.html` — added Berlin min zoom/max bounds, fixed all-places bounds, and refit after Leaflet `invalidateSize()` so Wix iframe startup does not show the whole world.

**Opened:** Push/deploy repo so GitHub Pages and the Wix embed receive the fix.
**Closed:** Local desktop/mobile QA: first load uses Berlin zoom tiles, 8 pins render, vegan filter shows 4 pins, no mobile horizontal overflow.

**Next session should:** Verify the live blog embed after the next GitHub Pages deploy.

## 2026-05-19 — Codex (Currywurst published)

**Did:** Recorded that the currywurst article/tool package is live.

**Changed:**
- Wix Blog: `Best Currywurst in Berlin: 8 Places to Try in 2026` is published at `https://www.berlinwalk.com/post/best-currywurst-places-in-berlin-2026` (verified 200).
- Live widget URL `https://fenerszymanski.github.io/berlinwalk-widgets/currywurst-finder/` and Wix Tools URL `/tools/berlin-currywurst-finder` were verified 200.
- `AGENTS.md` — removed the currywurst publish follow-up from open items.
- Project root: `PROJECT_MEMORY.md`, `SESSION_LOG.md` — updated published status/handoff.

**Opened:** none
**Closed:** Currywurst article publish follow-up.

**Next session should:** Treat the currywurst post and finder as live; recheck ratings/opening hours only during future content refreshes.

## 2026-05-19 — Codex (Currywurst Wix draft + CMS)

**Did:** Created the Wix Blog draft and BerlinTools CMS row for the currywurst package.

**Changed:**
- Wix Blog draft: `dc623b0d-017e-4bcc-903f-df80f8ea0c03` — `Best Currywurst in Berlin: 8 Places to Try in 2026`, status `UNPUBLISHED`; verified 160 rich-content nodes, 3 images, 3 HTML embeds, 58 bold decorations, 9 links, slug `best-currywurst-places-in-berlin-2026`.
- Wix Media: uploaded/used cover `5a08a3_3100730ad66147ec8e530dbeafa27903~mv2.png`, map `5a08a3_5f17875ceb634230aee1df2910be683d~mv2.png`, comparison `5a08a3_93e5331774b545a3824846a7be718b23~mv2.png`, order guide `5a08a3_46a69ddaabc041cebf0574bedc9fdf25~mv2.png`.
- Wix CMS `BerlinTools`: inserted `/tools/berlin-currywurst-finder` item `988bc092-5168-4054-9034-97a7a1c98d7e`.
- `blog-drafts/best-currywurst-places-in-berlin-2026.md` — cleaned into publish-ready English draft; `faq/inject.js` — added FAQ schema map for the currywurst slug.
- Project root: `create-wix-currywurst-blog-draft.js`, `insert-currywurst-finder-tool.js`, `PROJECT_MEMORY.md`, `SESSION_LOG.md` — added scripts/memory for this pass.

**Opened:** Push/deploy `berlinwalk-widgets` so `currywurst-finder/` and updated `faq/inject.js` are live; then verify GitHub Pages widget URL and Wix blog draft preview before publishing. Recheck Google Maps ratings/opening hours before publish.
**Closed:** Wix draft creation, media upload, SEO payload, and BerlinTools CMS row creation.

**Next session should:** Push the widgets repo or ask Yusuf to push origin, wait for GitHub Pages, then verify `/currywurst-finder/`, `/tools/berlin-currywurst-finder`, and the Wix blog draft preview.

## 2026-05-19 — Claude Code (Site header rebuild)

**Did:** Replaced the Wix-native sitewide header with `<bw-site-header>` custom element — conversion micros + visual consistency + premium mobile menu + shrink-on-scroll.

**Changed:**
- `site-header/site-header-element.js` — new file, defines `<bw-site-header>` with green top mini-bar (★ 9.8/FreeTour · Free · Tip-based · Daily 11:30), main bar (logo + Tour/The Guide/Reviews/Resources nav + dropdown + BOOK NOW pill), scroll progress bar (green→lime→yellow), shrink-on-scroll past 32px, full-screen mobile overlay with body scroll lock + Escape close + click-outside dismiss + hamburger→X animation. Re-uses the footer logo URL.
- `site-header/index.html` — standalone preview with 300vh stage for scroll-shrink testing.
- `AGENTS.md`, `wix-embed-snippets.md` — added site-header row.
- Project root: `PROJECT_MEMORY.md` — new `Site Header` section with install snippet, feature list, sticky/mobile notes, and a known-limitation flag about Wix possibly overriding body scroll lock.

**Opened:** Push widgets repo + replace the Wix-native header on every page: drop `<bw-site-header>` into the Wix Header container (already sticky/pinned), remove legacy logo + nav + Book Now elements from that section.
**Closed:** none

**Next session should:** After Yusuf publishes, verify on live: (a) shrink-on-scroll smooth, (b) Resources dropdown opens on hover + tap, (c) mobile overlay slides in + body does not scroll behind + Escape/X/backdrop all close, (d) all links navigate correctly, (e) progress bar tracks accurately.

---

## 2026-05-19 — Codex (Currywurst finder)

**Did:** Built the first version of the Berlin Currywurst Finder widget and local draft scaffold for the planned `Best Currywurst in Berlin` post.

**Changed:**
- `currywurst-finder/index.html` — new Leaflet map widget with 8 currywurst places, filters, Google Maps links, rating snapshots, order tips, and tour-end directions.
- `tools-hub/data.json`, `widgets-hub/SEO_ADDITIONAL_TAGS.md`, `README.md` — added the new tool to the tools/widgets catalog and regenerated widget gallery JSON-LD.
- `blog-drafts/best-currywurst-places-in-berlin-2026.md` — local article scaffold with rating table, embed plan, structure, FAQ ideas, and source list.
- `quick-summary/data.json`, `faq/data.json` — added `currywurst` entries for the post widgets.
- `AGENTS.md`, project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded follow-up tasks and cross-agent memory.

**Opened:** Create the matching BerlinTools CMS row for `/tools/berlin-currywurst-finder`; before publishing the article, recheck live Google Maps ratings/opening hours and optionally create/paste a Wix blog draft.
**Closed:** Local desktop/mobile QA passed for the finder; quick-summary and FAQ keys render locally.

**Next session should:** Decide whether to push the widget repo first or create the Wix CMS/blog draft in the same pass.

## 2026-05-19 — Claude Code (Booking page redesign)

**Did:** Rebuilt `/book-berlin-walking-tour/berlin-free-walking-tour-tip-based` as two custom elements wrapping the Wix-native Bookings widget. Wix Bookings widget itself is unchanged (must stay native — handles availability, checkout, 7-email trigger, calendar sync).

**Changed:**
- `book/book-element.js` — new file, defines `<bw-book-hero>` (hero + chips + "At a glance" card + scrolls to `#book` anchor) and `<bw-book-details>` (what-you-get grid + 5-stop route preview + meeting point teaser + free/tip explainer + FAQ + ending CTA).
- `book/index.html` — standalone GitHub Pages preview with a placeholder strip in place of the Wix Bookings widget.
- `book/SEO_SETTINGS.md` — Wix-ready title/description/OG/Twitter tags + `TouristTrip` JSON-LD with 5-stop `itinerary` and `price: "0" EUR`.
- `AGENTS.md`, `wix-embed-snippets.md` — new rows for the `bw-book-hero` / `bw-book-details` pair (both load the same JS file).
- Project root: `PROJECT_MEMORY.md` — new `Booking Page` section with install snippet + page section order; `SESSION_LOG.md` — recorded this session.

**Opened:** Push widgets repo + redesign the Wix Studio booking dynamic page: `<bw-book-hero>` above the Wix Bookings widget, `<bw-book-details>` below it. Paste the new SEO settings into the Wix Studio service-page SEO panel. Replace the old native sections (`Book Your Free Tour`, `Limited Spots — Book Now`, `What to expect`, `Meeting Point`, FAQ, `Ready to Discover Berlin?`) since they are all in the custom elements now.

**Closed:** `Booking page review / conversion audit` open task (superseded by this rebuild).

**Next session should:** Verify the live booking page after Wix publish — anchor scroll works, Bookings widget still loads, automation still triggers on test booking.

## 2026-05-19 — Codex (Hero follow-up + stats removal)

**Did:** Adjusted the new homepage hero after live placement feedback: removed the duplicate stats strip, changed hero proof to `9.8 on Freetour`, and made the Route section cream.

**Changed:**
- `hero-home/hero-home-element.js` — first proof point now `9.8 / On Freetour`.
- `stats/stats-element.js` — deprecated old stats strip as a hidden no-op so it creates no content or height if left in Wix temporarily.
- `route/route-element.js` — route section background changed to cream.
- `README.md`, `AGENTS.md`, `wix-embed-snippets.md` — removed Stats from recommended homepage snippets and documented deprecation.
- Project root: `PROJECT_MEMORY.md`, `SESSION_LOG.md` — recorded the hero proof/stat-strip decision.

**Opened:** Yusuf will remove the old Stats/Tour Facts section from Wix Studio.
**Closed:** Local check passed: `bw-stats` display none/height 0, no hero-to-route gap, route background cream.

**Next session should:** Verify the live homepage after Wix removes the Stats section and publishes.

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
