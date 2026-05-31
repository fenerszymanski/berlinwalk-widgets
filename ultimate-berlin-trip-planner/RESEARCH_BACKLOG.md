# Ultimate Berlin Trip Planner Research Backlog

Research date: 2026-05-30
Status: keep the task open; use this as the V4/V5 implementation map.

## V4 Progress

2026-05-30 local implementation started:

- Done locally in `index.html`: `PLACE_CATALOG`, catalog-backed individual Google Maps search links, day-level Google Maps directions links, visual map brief / route overview cards, visual trip spine, route-reel day rhythm cards, risk chips, plan confidence panel, Travel Mode for today/tomorrow arrivals, Smart Fixes/trip review, adaptive CTA copy/hrefs, copy-plan-link URL serialization, lead-gate copy polish, lead segmentation, and extra non-PII analytics events.
- Copy/share links are now allowlisted: only plan state plus safe `context/weather` params are serialized. Email, UTM, lead, booking, cache-buster, and unknown params are stripped from copied/WhatsApp links and from the lead payload `page` field.
- Added a visual Tour Anchor card: the recommended BerlinWalk 11:30 slot is now shown as a concrete date/time, with a downloadable `.ics` calendar hold and World Clock Google Maps action. The recommended day is also marked inside the trip spine, full day card, print view, PDF day card, and text export. Booked-state behavior suppresses the hold and switches to meeting-point prep.
- Added Smart Swaps/day-level move logic: Monday museum swap, rain buffer, Sunday logistics, and late-start protection are derived from existing choices and shown as route-backed local-guide moves.
- Reduced day-end notes to compact visual close strips only. Normal days now rely on visual day cards, route reels, risk chips, Smart Swaps, and Berlin Essentials instead of repeated end-of-day explanations; the close strip uses varied day-type labels (`Arrival`, `Museum`, `East`, `Food`, `Low-cost`, `Local`, `Return`) and two short chips, with no generic rain-backup chip repeated across every day.
- Follow-up: personalized the second close chip from actual trip context while keeping the no-prose rule. Family/kids, gentle/packed pace, rain, reservations, low budget, Monday museum hours, and Sunday/holiday food timing now produce short cues such as `Family pause`, `Budget dinner`, `Dry exit`, `One booking only`, `Stop before tired`, and `Food before close` instead of one repeated end-of-day warning across all days.
- Added a live Trip Control Panel above the form: four visual tiles summarize arrival, first move, tour anchor/prep, and opening/risk watch-out as choices change. This makes the first screen feel more like an operating plan and less like a questionnaire.
- Added a compact Plan Inputs guide at the top of the form: five visual chips summarize when/base/style/focus/tour, update with selections, and reassure that the defaults are enough to generate a realistic plan.
- Moved lower-priority personalization questions into a collapsed `Fine-tune the plan` section. Core planning inputs stay visible, while group type, first-time status, interests, trip mode, must-handle flags, and pace remain available behind a compact live summary.
- Added a visual delivery checklist inside the lead gate: PDF, exact link, maps, and arrival-aware reminders. This makes the email exchange feel more like plan delivery and less like a plain form.
- Added a visual Berlin Trip Pass near the top of the result panel: a compact document-style card with deterministic pass code, arrival date, stay base, tour slot, day-icon route line, and one Google Maps overview action. The same pass data now feeds text export, print output, and the PDF cover flow, so the downloadable plan shares the same visual identity as the UI without adding explanatory copy.
- Added an Arrival Playbook directly after the Berlin Trip Pass: a photo-led first-24-hours card with `Ticket`, `First move`, `Tour anchor`/`Meeting`, and `First close` actions derived from arrival point, arrival time, stay area, tour status, ticket logic, and Day 1 route. It reaches text export, print output, and the PDF cover flow, giving the funnel a more useful arrival-date payoff without adding long prose.
- Added a photo-first Trip Highlights row above the itinerary overview: three large Start / Tour(or Meeting) / Finish cards use day photos, icons, map links, and the booking/meeting action. This adds a fast visual read of the trip without adding more itinerary prose. Follow-up carried the same layer into text export, print output, and the PDF cover flow so the export no longer falls back to pure text at the top.
- Added a visual Map Passport after the itinerary overview: six itinerary-derived real-world anchors with icons, day/type labels, short local context, and direct Google Maps links. It reaches text export, print output, and the PDF overview/cover flow. Latest QA used desktop and 390px mobile screenshots with overflow `0`, DOM checks for 6 Google Maps links, and a real 15-page 7-day PDF render with BerlinWalk logo, Map Passport, Berlin Essentials, and no visible overlap after fixing a clipped PDF mini-card label.
- Added a mobile-first `Phone-ready preview` card after the Trip Control Panel and before the input form. It gives mobile users a photo, map/tour/score action cards, and day chips immediately, while desktop keeps the standard two-column form/result layout. This fixes the "first screen feels like a questionnaire" problem without moving the full result panel above the form. Latest QA: in-app Browser plus CDP mobile/desktop smokes found mobile display `grid`, 3 actions, 3 day chips for a 3-day plan, loaded photo, form still near the first scroll, desktop display `none`, and overflow `0`. Evidence: `output/qa/ultimate-trip-planner-ui/mobile-peek-20260531/summary.json`.
- Added a compact visual hero to the top header: real Museum Island/BerlinWalk photo, planner feature chips, and a small route-first cue replace the old plain green text block. Mobile keeps the hero stacked and the route pills short so the first screen is more visual without reordering the full result. Latest QA: inline script parse, `diff --check`, in-app Browser at 319px with loaded image and overflow `0`, Chrome desktop/mobile screenshots under `output/qa/ultimate-trip-planner-ui/visual-hero-20260531/`, PDF/print unlock smoke with 8 Essentials cards and `PDF downloaded.`, and launch audit `122 pass, 1 warn, 1 block`.
- Added `Trip style shortcuts` below Plan Inputs: four visual one-click presets (`Classic first trip`, `History + museums`, `Family / slower pace`, `Food + nightlife`) set group/stay/interests/budget/must-handle/pace choices while keeping the form editable. This reduces questionnaire friction and gives the tool a more product-like setup step. Follow-up: the selected preset now flows as `tripStyle` into the lead payload, Velo storage/email variables, instant sales/booked emails, paste-ready HTML, live-smoke payloads, and the remote/prepublish collection gates; live `TripPlannerLeads` was synced to include the field. QA evidence: `output/qa/ultimate-trip-planner-ui/trip-presets-20260531/desktop-presets.png`, `mobile-presets-tall.png`, `output/qa/ultimate-trip-planner-live-smoke/trip-style-dry-run-20260531.json`, and `output/qa/ultimate-trip-planner-remote-preflight/remote-preflight-2026-05-31T13-57-13-602Z.json`; in-app Browser confirmed 4 preset cards, active-state switching, `Food + nightlife` updating east stay area plus wall/food/nightlife interests and packed pace, and overflow `0`. Launch audit now reports `124 pass, 1 warn, 1 block`.
- Added a Phone Carry Pack after unlock: a compact action hub for the exact plan link, overview route map, tour calendar hold or booked-state World Clock prep, and PDF backup. It appears in UI, text export, print output, PDF cover flow, lead payload, Velo storage/email variables, and instant emails as `carryPack`.
- Replaced the locked/result preview day paragraph with compact `Route / Anchors / Watch` action chips. The email-before preview now gives map context and risk state visually instead of repeating the first itinerary block as prose.
- Added Day Rhythm to preview and full-plan day cards: compact `Load / Move / Buffer / Night` bars show whether each day is soft, active, transit-heavy, protected, or late without adding explanatory copy. The same summary is carried into text export, print, PDF day cards, lead payload, Velo storage/email variables, and instant plan emails as `dayRhythm`.
- Added real-photo day postcards to preview and full-plan cards: each day type now uses a small BerlinWalk/gallery image with an icon overlay, while print output also carries the photo strip. This keeps the visual lift high without adding more itinerary prose.
- Extended the same photo system into PDF export: the cover now has a `Route snapshots` photo strip and day cards use a real photo thumbnail in the visual band, with cached data URLs and color fallback if image loading fails.
- Added a dedicated PDF `Itinerary Overview` page: BerlinWalk logo header, trip code, tour/booked-path summary, linked Day 1-7 mini cards with photos, route anchors, and a short `How to use this PDF` note. This gives the download a real plan-document entry point before the detailed day cards.
- Added an interactive Route Deck below the Phone Carry Pack: users can select Day 1-7 to switch the focus photo, date/title, route/anchor/watch chips, Google Maps anchor links, and the day-level directions action. After unlock, the deck also exposes a `Jump to day` action for the selected full-plan card.
- Converted the large result plan board into a three-lens Dashboard (`Route`, `Prep`, `Review`) so the widget no longer dumps every map, setup, and risk module at once. The same content remains accessible, but the default screen is calmer and more scannable.
- Added an always-visible `Trip commands` strip near the top of the result flow: four Google Maps route anchors plus `Route map`, `Day 1 start`, tour/meeting, and `Weather/open` action cards. It gives all dates a more visual operating layer, not only today/tomorrow Travel Mode, and reaches text export, print, and the PDF cover. Latest QA: `105 pass, 1 warn, 1 block`; desktop/mobile far-date smokes have overflow `0`, and a rendered 5-day PDF has no visible cover overlap.
- Added an unlocked Full Plan Index / Day Jump Bar above the full itinerary: after email unlock, users get compact Day 1-7 buttons with icons, dates, theme labels, active state, and scroll-to-day behavior. This makes the long full plan more usable on phone without adding more itinerary prose or changing PDF/print output.
- Added a local launch-readiness audit script at `launch-audit.mjs`. It checks required Ultimate artifacts, Triggered Email ID placeholders, email template variables against Velo `emailVariables()`, Velo endpoints/scheduler/booking branch behavior, tools/home/widgets draft visibility, local-only lead-gate QA params, PDF/Route Deck/Day Jump markers, blog body hygiene, CMS insert helper presence, and live-smoke helpers/evidence. Latest run: `46 pass, 1 warn, 1 block`; the block is the expected 10 `TODO_TRIP_PLANNER_*` Triggered Email message IDs until the Wix templates are created and pasted.
- Added a paste-ready Triggered Email HTML generator at `email/build-triggered-email-html.mjs`. It turns the 10 sales/booked markdown drafts into Wix-safe table/inline-CSS HTML blocks under `email/paste-ready/`, plus `manifest.json`, `message-ids.template.json`, `README.md`, and `preview.html`. Added `velo/apply-triggered-email-ids.mjs` so real Wix message IDs, or Wix editor URLs containing them, can be dry-run validated and applied to `tripPlannerFunnel.js` without hand-editing the constants. The launch audit now checks this package. Latest run after adding the ID helper: `45 pass, 1 warn, 1 block`; the only block remains the expected missing real Wix message IDs.
- Added `velo/live-smoke-trip-planner.mjs`, a dry-run-first live endpoint smoke helper for the post-publish check. Dry-run mode records the exact lead payload and optional booking payload without network calls; live mode requires `--live --email ...` and can test `/_functions/tripPlannerLead` plus `/_functions/tripPlannerBooking` with `--booking`. Latest dry run wrote `output/qa/ultimate-trip-planner-live-smoke/dry-run-script-20260531.json` and confirmed no response keys because no network call was made.
- Added launch operations helpers: `LAUNCH_RUNBOOK.md` for the full Wix handoff, `launch-remote-preflight.mjs` for non-mutating live checks, and `velo/create-trip-planner-leads-collection.mjs` for dry-run-first collection setup. Codex created the live Wix Data `TripPlannerLeads` collection on 2026-05-31 with 64 expected fields verified; remote preflight now confirms the GitHub Pages widget is reachable, BerlinTools slug is still free, `TripPlannerLeads` exists, and the Velo endpoints are not published yet. Latest launch audit: `64 pass, 1 warn, 1 block`; the only blocker remains the 10 real Triggered Email IDs.
- Added `email/paste-ready/copy-kit.html`, generated from the same email source. It gives Yusuf one local page with subject/preheader/HTML copy buttons for all 10 templates plus message-ID inputs and a JSON builder for `message-ids.local.json`. Headless Chrome rendered it to `output/qa/ultimate-trip-planner-email/copy-kit-20260531.png`; launch audit now checks the copy kit and reports `66 pass, 1 warn, 1 block`.
- Added `velo/build-velo-install-kit.mjs`, which generates `velo/install-kit.html`: a local Wix Developer Tools handoff page with copy buttons for `Backend/tripPlannerFunnel.js`, the `Backend/http-functions.js` merge source, `jobs.config`, and post-publish smoke commands. Launch audit now checks this Velo install kit too, so the remaining manual publish step has a visible artifact.
- Strengthened `velo/install-kit.html` with a `Pre-publish gate` panel above the paste sources. It includes copyable ID check/apply commands, remote preflight, install-kit regeneration, and launch audit before any Wix Velo paste/publish step. Headless Chrome QA passed desktop and 390px mobile with one gate panel, all three source panels, overflow `0`, and commands present. Evidence: `output/qa/ultimate-trip-planner-velo/install-kit-prepublish-20260531/`.
- Added `build-launch-control-room.mjs`, which generates `LAUNCH_CONTROL_ROOM.html`: a local launch dashboard linking the Triggered Email copy kit, Velo install kit, runbook, research backlog, message-ID commands, live-smoke commands, CMS insert commands, and current launch status cards. It keeps the remaining manual sequence visible in one place while Ultimate remains draft.
- Added `build-launch-status-report.mjs`, which generates `LAUNCH_STATUS.md` and `LAUNCH_STATUS.json`: a launch verdict with audit summary, remote preflight evidence, live smoke evidence, visibility state, blog package state, gate table, blockers/warnings, and next actions. Current generated verdict remains `NOT READY` because the 10 Triggered Email IDs are still placeholders.
- Added `WIX_EMAIL_SETUP_TR.md`, a Yusuf-facing Turkish handoff for the remaining Triggered Email blocker. It lists the exact 10 Wix templates, copy-kit flow, message ID URL trick, local JSON path, apply commands, and guardrails not to publish Velo/CMS/visibility before the IDs are applied.
- Added `velo/check-triggered-email-ids.mjs`, a read-only progress checker for the local message-ID file. It reports missing files, placeholder values, duplicate IDs, Wix editor URL extraction, and whether all 10 IDs have actually been applied in `tripPlannerFunnel.js`; the runbook, Turkish handoff, control room, and status report now call it before/after the apply helper.
- Added `TRIGGERED_EMAIL_API_NOTES.md` after checking current Wix docs. Public Wix docs cover sending already-created Triggered Emails and managing automation workflows, but not creating Triggered Email template HTML/content via a stable API, so the first template creation pass stays manual via the copy kit.
- Upgraded `email/paste-ready/copy-kit.html` into a small setup cockpit: localStorage-backed progress checkboxes for each template, template/ID/check counters, URL-to-ID extraction, duplicate/placeholder validation, reset progress, and JSON export that uses normalized message IDs. Headless Chrome QA passed desktop interaction with duplicate-ID detection plus 390px mobile overflow `0`; screenshot: `output/qa/ultimate-trip-planner-email/copy-kit-progress-20260531.png`.
- Added a bulk paste lane to `email/paste-ready/copy-kit.html`: paste all 10 Wix editor URLs in template order, or labelled placeholder lines, then `Apply bulk IDs` fills the correct message-ID inputs and normalized JSON. Headless Chrome QA passed desktop and 390px mobile bulk smokes (`10/10` IDs, JSON keys `10`, overflow `0`) plus duplicate detection (`10` issue rows). Evidence: `output/qa/ultimate-trip-planner-email/copy-kit-bulk-20260531/`.
- Clarified the email-ID handoff so Yusuf creates the 10 templates in `Wix Developer Tools -> Triggered Emails`, not as automation workflows. The warning now appears in `copy-kit.html`, the generated paste-ready README, individual HTML comments, `WIX_EMAIL_SETUP_TR.md`, and the launch audit guard. Latest Browser smoke opened the local copy kit at `http://127.0.0.1:8765/ultimate-berlin-trip-planner/email/paste-ready/copy-kit.html` and confirmed the warning text, 36 buttons, 31 copy buttons, 32 textareas, and overflow `0`.
- Added `Wix template name` copy buttons and a `Next missing template` navigator to `copy-kit.html`. This reduces the manual Wix setup to copy name -> subject -> preheader -> HTML -> paste editor URL for each card. Browser QA confirmed 10 template-name inputs, 10 Copy name buttons, first template name `Ultimate Planner - Sales - Instant Plan`, `Next: template 1/10`, 47 total buttons, 41 copy buttons, and overflow `0`. The click automation for the next button timed out in the in-app browser, but the DOM and layout checks passed and the control is present.
- Added a one-page email setup checklist export. The generator writes `email/paste-ready/setup-checklist.txt` and embeds the same checklist in `copy-kit.html` with a `Copy checklist` button. It lists all 10 template names, branch/stage keys, placeholders, subjects, preheaders, HTML files, and URL/ID slots. Browser QA confirmed the checklist panel, first and final template coverage, checklist length `3866`, 48 total buttons, 42 copy buttons, and overflow `0`. Launch audit now reports `131 pass, 1 warn, 1 block`.
- Added `velo/build-message-ids-from-paste.mjs`, a dry-run-first shortcut for building `message-ids.local.json` from 10 pasted Wix editor URLs in manifest order or placeholder-labelled lines. QA passed syntax, a fake 10-URL dry-run, a `--write` to `output/qa/ultimate-trip-planner-email/fake-message-ids-from-paste.local.json`, downstream `check-triggered-email-ids.mjs`, and duplicate-ID failure.
- Added `velo/import-message-ids-from-downloads.mjs`, a dry-run-first bridge for the copy-kit download path. It finds the newest `message-ids*.json` in `~/Downloads` or a supplied `--from` file, validates all 10 IDs, normalizes Wix editor URLs, writes the repo-local ignored `message-ids.local.json` only with `--write`, and backs up any previous local ID file. QA passed syntax, fake Downloads dry-run/write/check with 10 unique normalized IDs, duplicate-import rejection, targeted `diff --check`, regenerated copy kit/install kit/control/status artifacts, refreshed remote preflight, and launch audit `118 pass, 1 warn, 1 block`. Evidence: `output/qa/ultimate-trip-planner-email-id-import/download-helper-20260531/summary.json`.
- Added `velo/run-email-id-launch-gate.mjs`, the fast path after real email IDs exist. It runs the email-ID check/apply flow dry-run first; with `--write` it imports from Downloads if requested, applies IDs, verifies applied IDs, regenerates the Velo install kit / launch control room / launch status, runs the Velo pre-publish gate, and runs launch audit. It supports default `~/Downloads`, a custom `--downloads-dir`, and direct `--import-from /path/to/message-ids.local.json`. `check-triggered-email-ids.mjs` now accepts `--funnel` so the gate runner can be QA'd against a temp Velo copy. QA passed syntax, fake 10-ID dry-run/write against a temp funnel, duplicate-ID rejection before apply, fake `--import-downloads --downloads-dir` dry-run/write, direct `--import-from` write, real `tripPlannerFunnel.js` untouched, regenerated handoff artifacts, refreshed remote preflight, and launch audit `120 pass, 1 warn, 1 block`. Evidence: `output/qa/ultimate-trip-planner-email-id-gate/post-id-gate-20260531/summary.json` and `output/qa/ultimate-trip-planner-email-id-gate/import-downloads-gate-20260531/summary.json`.
- Hardened `release-visibility.mjs` for the final public flip. It still refuses `--write` until Triggered Email placeholders are gone, passing live smoke exists, and the live Wix tool page returns 200, but successful writes now create timestamped backups under `output/qa/ultimate-trip-planner-visibility-release/`. Added `--tools-hub` / `--tools-home` temp path overrides for local recovery/QA. QA passed: CMS insert dry-run, visibility dry-run, blocked unforced `--write` with no backups/writes, forced temp write with draft flag removed, temp homepage shortcut inserted, two backups created, real `tools-hub/data.json` still draft, and launch audit `120 pass, 1 warn, 1 block`. Evidence: `output/qa/ultimate-trip-planner-visibility-release/backup-guard-20260531/summary.json`.
- Added a launch-audit regression guard for Yusuf's no-long-day-end-copy rule: `Later`/`Evening` closing blocks must keep `copy: ''`, `dayBlockCopy()` must blank closing copy, and legacy `shortDayNote` / `bw-day-check` / `Local cue` hooks must stay absent. Latest audit after this guard: `87 pass, 1 warn, 1 block`.
- Added deterministic daily timebox windows: preview cards now show a `Timing` chip, route reels show compact time windows, full-plan rows get time badges, and text export/print/PDF carry the same windows. This adds timeline realism without adding another form field or more day-end prose. Follow-up: the same windows now flow through existing `${dayOperations}` into the lead payload, Velo storage, Velo install kit, and instant sales/booked emails, with `dayOperations` widened to 1200 chars to avoid clipping 7-day summaries. Latest audit after this guard: `89 pass, 1 warn, 1 block`; headless DOM, email-kit regeneration, Velo syntax, and mobile screenshot QA passed.
- Added localhost-only `?qaUnlock=1` for repeatable PDF/export QA without touching live leads. The launch audit verifies it is gated to localhost/127.0.0.1 alongside `forceLeadError` and `resetUnlock`.
- Latest timebox PDF QA: headless Chrome downloaded fresh 3-day sales and 7-day booked PDFs through the real `Download PDF` button with `qaUnlock=1`, then `pypdfium2` rendered every page. `timebox-3day-sales.pdf` rendered as 9 pages and `timebox-7day-booked.pdf` rendered as 14 pages; both show the BerlinWalk logo, timebox badges, title-only day closers, map actions, itinerary overview, and Berlin Essentials without visible overlap/clipping. Text extraction confirmed timeboxes and Essentials are present, stale `Local cue` / `Note:` text is absent, and booked-path PDF avoids the sales booking line. Contact sheets: `output/qa/ultimate-trip-planner-pdf/timebox-20260531/timebox-3day-sales-contact-sheet.png` and `timebox-7day-booked-contact-sheet.png`.
- Added a compact `Trip radar` above the Berlin Trip Pass. It turns existing deterministic logic into a visual score/action layer: `Plan score`, `Tour anchor`, `Opening watch`, and `Next move`, with direct links for booking/meeting point, openings, and the first useful action. Follow-up: Trip Radar now also reaches text export, print HTML, and the PDF cover flow. Latest QA passed inline JS parse, launch audit (`93 pass, 1 warn, 1 block`), desktop locked 3-day render, true 390px mobile locked 7-day render, true 390px mobile unlocked 7-day render, print HTML capture, and real PDF downloads. Checks confirmed 3 cards, 3 links, full-plan gating before unlock, lead gate hidden after unlock, overflow `0`, and print output containing Trip Radar/Plan Score/Trip Pass/Essentials. Fresh PDFs rendered with `pypdfium2`: `trip-radar-3day-sales.pdf` (9 pages) and `trip-radar-7day-booked.pdf` (14 pages). Text extraction confirmed Trip Radar labels, logo/branding, and Essentials are present while stale `Local cue` / `Note:` text is absent. Contact sheets: `output/qa/ultimate-trip-planner-pdf/trip-radar-20260531/trip-radar-3day-sales-contact-sheet.png` and `trip-radar-7day-booked-contact-sheet.png`. UI screenshots: `output/qa/ultimate-trip-planner-ui/trip-radar-20260531/desktop-locked-3day.png` and `mobile-locked-7day.png`.
- Added a visible `Plan at a glance` itinerary overview in the result panel, immediately after the Berlin Trip Pass. It turns the generated days into photo-led mini route cards with day badges, backbone areas, dates, Google Maps route links, a single overview map action, and compact Days/Tour/Map Layer stats. This brings the PDF overview mental model into the widget itself, reducing the "text wall" feeling before the route deck and full day cards. Latest QA passed inline JS parse, launch audit (`90 pass, 1 warn, 1 block`), desktop locked 7-day render, mobile locked 7-day render, and mobile unlocked booked 7-day render with 7 photos, 7 route links, full-plan gating intact before unlock, and overflow `0`. Screenshots: `output/qa/ultimate-trip-planner-ui/itinerary-overview-20260531/desktop-locked-7day.png` and `mobile-locked-7day.png`.
- Added a visual `Trip load map` after Plan at a glance. It summarizes each generated day as compact load/move bars plus buffer and watch-out chips, with each day card opening its Google Maps route. The layer reaches UI, text export, print view, and the PDF cover flow. QA passed inline script parse, desktop/mobile Playwright smokes with 7 cards and overflow `0`, mobile crop after fixing long-title wrapping, real PDF download, `pypdfium2` page rendering/contact sheet, text extraction for `Trip load map` and `Berlin Essentials`, targeted `diff --check`, and launch audit `129 pass, 1 warn, 1 block`. Evidence: `output/qa/ultimate-trip-planner-ui/load-map-20260531/` and `output/qa/ultimate-trip-planner-pdf/load-map-20260531/`.
- Added a compact `Planner logic` receipt after the Trip load map. It turns the personalization rules into six visual cards (`Arrival`, `Base`, `Style`, `Focus`, `Tour`, `Risk`) so users can see why the itinerary looks the way it does without adding another long explanation. The layer reaches UI, text export, print view, and the PDF cover flow. QA passed inline script parse, desktop/mobile Playwright smokes with 6 cards and overflow `0`, real PDF download, `pypdfium2` page rendering/contact sheet, text extraction for `Planner logic`, `Trip load map`, and `Berlin Essentials`, targeted `diff --check`, and launch audit `130 pass, 1 warn, 1 block`. Evidence: `output/qa/ultimate-trip-planner-ui/planner-logic-20260531/` and `output/qa/ultimate-trip-planner-pdf/planner-logic-20260531/`.
- Added a visual `Arrival reminder timeline` inside the lead gate. It turns the email ask into a concrete 5-step pre-arrival service (`Now`, `7 days`, `3 days`, `1 day`, `Arrival`) and explicitly says booked guests receive prep instead of sales. Latest QA passed inline JS parse, launch audit (`91 pass, 1 warn, 1 block`), desktop locked 3-day render, true 390px mobile locked 7-day render, and true 390px mobile unlocked 7-day render. Checks confirmed 5 steps, overflow `0`, no bad mobile wraps, full-plan gating before unlock, and lead panel hidden after `qaUnlock=1`. Screenshots: `output/qa/ultimate-trip-planner-ui/lead-reminder-timeline-20260531/desktop-locked-3day.png` and `mobile-locked-7day.png`.
- Follow-up: the lead-gate reminder timeline is now arrival-date-aware. Passed reminder windows show as `Window passed`, same-day reminder stages fold into the instant plan as `Folded in now`, future stages show exact short dates, the email-count pill drops from `Up to 5 emails` to the real remaining count, and booked paths switch the sequence to meeting/weather/World Clock prep language. Latest QA passed inline JS parse, launch audit (`94 pass, 1 warn, 1 block`), desktop tomorrow-arrival sales state (`Up to 2 emails`), 10-day sales state (`Up to 5 emails`), and true 390px 10-day booked state with overflow `0`. Evidence: `output/qa/ultimate-trip-planner-ui/reminder-timeline-20260531/`.
- Added a full-trip `.ics` calendar export to the unlocked Phone Carry Pack. It creates one all-day event per generated Berlin day, includes each day's deterministic timing lines, Google Maps day route, and exact plan URL, while keeping the existing BerlinWalk tour hold as a separate precise 11:30-13:30 calendar action. Text and print exports now avoid dumping long data URLs and show the `.ics` filenames instead. Follow-up: PDF Carry Pack layout now wraps 5 actions into measured 3-column/2-row cards and suppresses calendar data URLs as PDF links. Latest QA passed inline JS parse, launch audit (`96 pass, 1 warn, 1 block`), in-app browser DOM decode with 5 Carry Pack actions, 7 VEVENT entries, all-day DTSTART, Day 7, route URLs, exact plan URL, overflow `0`, 390px Chrome screenshot/crop, and real-download PDF visual QA for 7-day sales/booked paths. `pypdfium2` rendered both PDFs as 14 pages; cover contact sheets show the 5-card Carry Pack without overlap, text extraction confirms Trip Calendar filename and no `data:text/calendar` leakage, and the booked PDF contains World Clock prep without sales booking text. Evidence: `output/qa/ultimate-trip-planner-ui/trip-calendar-20260531/` and `output/qa/ultimate-trip-planner-pdf/trip-calendar-20260531/`.
- Added `release-visibility.mjs`, a dry-run-first post-smoke helper for the final public visibility flip. It refuses `--write` until Triggered Email placeholders are gone, passing live smoke evidence exists, and the latest remote preflight sees the Wix tool page return 200. When gates pass it can remove the draft flag from `tools-hub/data.json`, optionally add the homepage shortcut, and regenerate `/widgets` ItemList SEO.
- Added `velo/report-trip-planner-leads.mjs`, a dry-run-first/read-only lead report for post-launch conversion operations. It summarizes `TripPlannerLeads` by conversion tier, trip style, arrival window, intent stage, source, priority leads, next-7-day arrivals, and email send errors. Emails are masked by default with a stable `emailHash`, and `--include-emails` is explicit. QA: dry-run fixture wrote `output/qa/ultimate-trip-planner-lead-report/dry-run-20260531.json` with 5 sample leads / 2 priority leads / 2 upcoming arrivals / 1 send error; live read-only wrote `live-read-20260531.json` with 0 current rows before Velo publish. Launch audit now reports `126 pass, 1 warn, 1 block`.
- Added `velo/simulate-email-sequence.mjs`, a dry-run-only simulator for the instant/7-day/3-day/1-day/day-of email sequence. It shows sales vs booked branches, same-day signup folds, passed windows, due-now scheduler stages, and the arrival-day before-18:00 rule without calling Wix. QA wrote `output/qa/ultimate-trip-planner-email-sequence/sales-20260612.json`, `due-minus3-20260609.json`, and `booked-dayof-after18.json`; launch control/status now include the command and launch audit now reports `128 pass, 1 warn, 1 block`.
- Tightened end-of-day itinerary copy after Yusuf flagged repetition: all `Later`/`Evening` blocks now use compact, varied one-line actions, and exception-only `Local cue` text stays short.
- Final `Later`/`Evening` blocks now render title-only in the UI, text export, PDF, and print. The day-closing idea stays visible, but the repeated explanatory paragraph is removed.
- Follow-up: source `Later`/`Evening` closing block copy is now empty too, labels are shorter, and the UI/print render these as compact close caps rather than normal text blocks.
- Follow-up: day cards no longer render end-of-day `Local cue` / `Note` boxes at all. Sunday, Monday, rain, reservation, and energy guidance now stays in risk chips, Smart Swaps/Fixes, Weather & Openings, and Berlin Essentials instead of repeated text under every day.
- Follow-up: removed the legacy `shortDayNote` helper and dead UI/PDF/print note slots entirely, so long repeated day-end prose cannot quietly come back through an old render path.
- Follow-up: tightened the remaining day-card paragraph copy after Yusuf flagged the plan still felt too text-heavy. First-day and template block copy now reads as short action lines, all checked day-card prose is under 90 characters, and `launch-audit.mjs` now has a `Day-card prose stays compact` guard. In-app browser QA passed desktop 3-day and true 390px mobile 7-day unlocked states with `closersWithCopy: 0`, max day copy `87`, and overflow `0`. Fresh real-download PDFs rendered with `pypdfium2`: `compact-3day-sales.pdf` (9 pages) and `compact-7day-booked.pdf` (14 pages); contact sheets show day cards and Essentials without visible overlap, text checks found BerlinWalk branding/Trip Radar/Essentials, and stale long-note phrases stayed absent. Evidence: `output/qa/ultimate-trip-planner-ui/compact-copy-20260531/` and `output/qa/ultimate-trip-planner-pdf/compact-copy-20260531/`. Latest launch audit after this guard: `94 pass, 1 warn, 1 block`.
- Follow-up: replaced repeated end-of-day route tiles with a separate visual `Day close` strip. `Later`/`Evening` blocks still keep `copy: ''`, but UI/text/print/PDF now show them as three short action chips such as food/base, ticket/water, sleep/covered-backup. Route reels and PDF route tiles use only the main action blocks, so the close idea appears once instead of repeating. QA passed inline JS parse, `diff --check`, launch audit (`99 pass, 1 warn, 1 block`), in-app browser 7-day unlocked smoke (`closeCount: 7`, `duplicatedCloseInReels: 0`, overflow `0`), true 390px mobile smoke (`closeCount: 7`, overflow `0`), and real 7-day sales PDF download/render (`14` pages, BerlinWalk branding, day-close text present, old `Local cue` / `Note:` text absent). Evidence: `output/qa/ultimate-trip-planner-ui/day-close-20260531/` and `output/qa/ultimate-trip-planner-pdf/day-close-20260531/`.
- Follow-up: full-plan days now use a visual `Google Maps pack` instead of a plain map-link stack. Each unlocked day gets one route card plus three place-anchor cards, backed by the existing place catalog and Google Maps URLs; text export, print output, and PDF day cards carry the same pack. The old PDF `Map actions` / `Place:` list is removed. Latest QA passed inline script parse, `diff --check`, launch audit (`100 pass, 1 warn, 1 block`), headless Chrome desktop and true 390px mobile 7-day unlocked smokes (`mapPacks: 7`, `mapCards: 28`, `plainMapLinks: 0`, overflow `0`), and real 7-day sales PDF download/render (`14` pages, `Google Maps pack` present, `Place:` / `Map actions` absent, no middle-dot leakage). Evidence: `output/qa/ultimate-trip-planner-ui/map-pack-20260531/` and `output/qa/ultimate-trip-planner-pdf/map-pack-20260531/`.
- Follow-up: the PDF cover now has an `Inside this plan` document-guide strip before the photo/radar/pass sections. It frames the download as a travel document with Trip snapshot, Overview page, Daily cards, and Essentials, so the PDF feels more like a plan packet and less like a raw export. Latest QA passed inline script parse, `diff --check`, launch audit (`101 pass, 1 warn, 1 block`), headless desktop/mobile UI smoke (`fullDays: 7`, `mapPacks: 7`, PDF enabled, overflow `0`), and real 7-day sales PDF download/render (`14` pages, `Inside this plan` labels present, `Google Maps pack` present, `Place:` / `Map actions` absent). Evidence: `output/qa/ultimate-trip-planner-ui/pdf-document-kit-20260531/` and `output/qa/ultimate-trip-planner-pdf/pdf-document-kit-20260531/`.
- Added a local booking-aware Velo fixture at `velo/booking-aware-fixture.mjs`. It transforms `tripPlannerFunnel.js` into a local-only mock harness, replaces message IDs with fake sales/booked IDs, and proves four cases without touching live Wix: normal sales vs booked branch selection, cancelled booking markers suppressing booked mode, missing booked-path IDs skipping with `missing_message_id` instead of falling back to sales, and `markTripPlannerLeadBooked()` updating only the matching `arrivalDate`. Latest run passed all 4 checks and wrote `output/qa/ultimate-trip-planner-velo/booking-aware-fixture-2026-05-31T10-01-48-736Z.json`; launch audit now reports `103 pass, 1 warn, 1 block`.
- Follow-up: upgraded Travel Mode into a more visual phone-ready assistant for today/tomorrow arrivals. The route lens now shows a real-photo `Phone card`, Day 1 badge, Google Maps route anchors, Route/Tour(or Meeting)/Plan quick actions, Ticket/Weather/Meeting/Backup chips, and Now/Next/Later actions without adding itinerary prose. The same route-anchor summary reaches lead/email `travelMode`, print output, and the PDF `Phone-Ready Travel Review` page. QA passed inline script parse, `diff --check`, launch audit (`104 pass, 1 warn, 1 block`), desktop 1280 and true 390px mobile smokes with loaded photo, 3 anchors, 3 quick actions, 4 chips, 3 steps, overflow `0`, no vertical text candidates, and far-date panel suppression. Fresh PDF QA downloaded/rendered a 3-day sales PDF (`10` pages); contact sheet/page inspection showed no overlap, and text extraction confirmed `Phone-Ready Travel Review`, `Tomorrow mode`, World Clock/Museum Island/Hackescher Markt anchors, Essentials, and no stale `Local cue` / `Note:`. Evidence: `output/qa/ultimate-trip-planner-ui/travel-mode-assistant-20260531/` and `output/qa/ultimate-trip-planner-pdf/travel-mode-assistant-20260531/`.
- Added a compact Plan Health review: deterministic `Ready / Watch / Fix` status, score, route/watch/fix micro-checks, and tone color now appear in the result board, text export, print plan, and PDF cover flow.
- Added a Pre-arrival Checklist: four short action cards for tour/meeting point, ticket, opening/weather check, and first route. It switches copy for booked vs sales paths and appears in the result board, text export, print plan, and PDF cover flow.
- Added a Reservation Radar: compact plan-level `Book first / Timed entry / Optional hold / Errands before` cards show only the book/check actions that can change the trip. It switches booked leads away from sales links, appears in the result board, text export, print view, and PDF cover flow, and is stored/exposed as `reservationRadar`.
- Added a Base Camp Brief: stay-area-aware cards summarize base anchor, first move, ticket logic, and late-return logic with Google Maps actions. It appears in the result board, text export, print view, PDF cover flow, lead payload, Velo storage/email variables, and instant sales/booked emails as `baseBrief`.
- Added a Budget Pulse: budget-style-aware cards summarize daily baseline, transit ticket, paid-anchor posture, and cash/tip prep without adding itinerary prose. It appears in the result board, text export, print view, PDF cover flow, lead payload, Velo storage/email variables, and instant sales/booked emails as `budgetPulse`.
- Added an Interest Lens: selected interests now map to concrete plan days and Google Maps anchors in compact cards, so personalization is visible without adding long itinerary text. It appears in the result board, text export, print view, PDF cover flow, lead payload, Velo storage/email variables, and instant sales/booked emails as `interestLens`.
- Added a Pace Guard: group/pace choices now become compact realism guardrails for day load, breaks, transfers, and night/close-to-base rules. It appears in the result board, text export, print view, PDF cover flow, lead payload, Velo storage/email variables, and instant sales/booked emails as `paceGuard`.
- Added Weather & Openings Strategy: existing weather mode plus Sunday/holiday/Monday logic now become four compact cards for weather source, opening rhythm, route bias, and final check. It appears in the result board, text export, print view, PDF cover flow, lead payload, Velo storage/email variables, instant emails, and 1-day-before reminder emails as `weatherStrategy`.
- Added compact day postcard scenes to preview and full-plan day cards: arrival, Wall, museums, food, free/low-budget, nightlife, local-neighborhood, and Potsdam/day-trip cards now have a visual SVG scene plus short route anchors.
- Added day intelligence chips to preview and full-plan cards: `Route`, `Energy`, `Spend`, and `Check` are generated deterministically from day type, pace/group, budget style, tour slot, opening-day status, and reservation intent.
- Added daily operating notes to preview and full-plan day cards: compact `Start`, `Transit`, `Reserve`, and `Backup` chips make each day feel more like a usable trip object without adding long paragraphs. The same summary is included in text export, print view, PDF day cards, lead payload, Velo storage/email variables, and instant plan emails as `dayOperations`.
- The same day intelligence is summarized into the lead payload as `dayIntelligence`, normalized/stored in Velo, exposed as `${dayIntelligence}`, and included in instant plan emails for both sales and booked paths.
- Plan Health is also summarized into the lead payload as `planHealth`, normalized/stored in Velo, exposed as `${planHealth}`, and included in instant plan emails for both sales and booked paths.
- The checklist is summarized into the lead payload as `preArrivalChecklist`, normalized/stored in Velo, exposed as `${preArrivalChecklist}`, and included across instant plus 7-day / 3-day / 1-day / arrival-day emails for both sales and booked paths.
- Export visuals now follow the same direction: print day sections include print-safe postcard HTML/SVG, and PDF day cards include a measured visual anchor band so the exported plan does not fall back to pure text blocks.
- Added `BERLIN_ONE_OFF_HOLIDAYS` for Berlin-specific one-off public holidays, starting with 2028-06-17 from Berlin.de, so long-range trip dates do not rely only on recurring holiday formulas.
- Hardened PDF day-card height calculation by measuring wrapped place/risk chip rows before drawing, so long Google Maps anchor labels and risk chips cannot silently eat into the next card.
- PDF/print now include V4 route/risk/travel-review layers. PDF V4 is redesigned as a travel document: cover/snapshot, route overview, mini trip spine, plan confidence, Travel Mode/Smart Swaps/Smart Fixes page when relevant, day-card pages with route-reel rhythm tiles, a tour-anchor CTA on the essentials page, and a clean Berlin Essentials page. The Essentials page now has visual `Use this plan` action cards: World Clock map plus booking when not booked, or booked-state prep without a sales link.
- Velo/email source now stores and exposes `travelMode`, `planHealth`, `preArrivalChecklist`, `baseBrief`, `budgetPulse`, `interestLens`, `paceGuard`, `weatherStrategy`, `carryPack`, `reservationRadar`, `planAdvice`, `planSwaps`, `dayRhythm`, `dayIntelligence`, `dayOperations`, `arrivalWindow`, `tripRisk`, `tourRecommendation`, `intentStage`, `familyOrSlow`, `bookAheadNeeded`, `conversionSignal`, `recommendedTourDate`, `recommendedTourTime`, and `meetingPointUrl` for personalized triggered emails. Booked-path email selection now fails closed: missing/TODO booked IDs skip instead of falling back to sales, and inactive booking statuses override earlier `bookedAt` for branch selection.
- Added deterministic conversion lead scoring: tour intent, arrival window, first-time/mixed status, multi-day trip length, history/Wall interest fit, booking/risk friction, morning-arrival opportunity, and pace support become a compact `conversionSignal` plus machine-readable `conversionScore`, `conversionTier`, `conversionNextAction`, and `conversionReasons`. The signal is user-safe as `Planner signal` in instant emails but useful internally for segmenting hot/warm/researching leads or booked prep. These fields now reach lead payload, Velo validation/storage, `TripPlannerLeads` setup helper, email variables/README, paste-ready package, and the Velo install kit. QA passed inline JS parse, transformed Velo syntax, regenerated email/Velo kits, collection dry-run (`69` planned fields), non-mutating remote preflight, and launch audit `99 pass, 1 warn, 1 block`.
- Hardened collection launch QA after adding conversion fields: `create-trip-planner-leads-collection.mjs` now supports `--live --sync-fields` for creating missing field definitions through Wix Data `create-field`, `launch-remote-preflight.mjs` verifies critical `TripPlannerLeads` fields instead of trusting field count, and `LAUNCH_STATUS`/control room show collection state explicitly. On 2026-05-31 Codex synced `conversionSignal`, `conversionScore`, `conversionTier`, `conversionNextAction`, and `conversionReasons`; latest remote preflight verifies `TripPlannerLeads` with `73` fields visible and all critical fields present. Latest launch audit: `105 pass, 1 warn, 1 block`.
- PDF robustness: `downloadPdf()` now lazy-loads the jsPDF engine if the deferred CDN script is not ready, times out logo loading instead of blocking the export, and fails soft to the print plan if a PDF exception occurs.
- Scheduled-email hardening: the hourly processor now pages through all due candidate leads in 100-row batches, and reminder stages are skipped on the same Berlin calendar date as the latest signup/update so a user does not receive the instant plan plus a 7-day/3-day/1-day/day-of reminder on the same day.
- Local QA passed for syntax, transformed Velo syntax, booking-branch fixture checks, `diff --check`, desktop/mobile-ish overflow in the in-app browser viewport, 1/3/5/7-day spine counts, CTA states, Google Maps `api=1` links, route overview/map brief smoke, Trip Control Panel desktop/mobile/state-change smoke, Plan Inputs desktop/mobile/state-change smoke, Fine-tune closed/open desktop/mobile smoke, lead-gate delivery-grid desktop/mobile/unlocked smoke, share/resume privacy smoke (dirty URL stripped from WhatsApp/share URL and lead payload `page`; resumed mobile state preserved booked CTA), clean-origin locked gate, Travel Mode/Smart Fixes today check, far-date no-Travel-Mode check, official Berlin.de 2026/2027 holiday plus 2028-06-17 one-off check, holiday fixture smoke for 2026-03-08/2027-03-08/2027 Good Friday/Easter Monday/2028-06-17/Sunday/Monday/weekday, DOM holiday smoke for 2028-06-17 and 2027-03-08, day-postcard DOM smoke for 7-day and 5-day plans (preview/full-plan SVG counts, no undersized cards, empty console, overflow `0`), day-intelligence DOM/aria smoke for 5-day and 7-day plans (`Route`, `Energy`, `Spend`, `Check` chips, empty console, overflow `0`), export visual smoke for print helper wiring and PDF visual-band download status, tour-anchor ICS/date/map smoke, tour marker Day 1/Day 2/out-of-plan/booked edge cases, booked-state no-calendar smoke, Smart Swaps Monday/rain/Sunday smoke, route-reel UI smoke, short day-cue smoke, compact evening-copy smoke (desktop 1280/mobile 390, overflow `0`, longest rendered end-of-day line about 74 chars), final closing-copy smoke for 1/3/5/7-day plans (`closingWithCopy: 0`, overflow `0`), Plan Health UI smoke for 1/3/5/7-day plans (`ready/watch/fix` tones, overflow `0`), Plan Health PDF button smoke (`PDF downloaded.`), Pre-arrival Checklist UI smoke for 3-day sales, 1-day sales, and 7-day booked paths (4 actions, booked copy switches to World Clock, overflow `0`), Pre-arrival Checklist PDF button smoke (`PDF downloaded.`), exception-only day-cue fixture checks (`0` cues on normal 3-day, `1` on late arrival, `1` on 7-day with Sunday, `2` on Sunday+Monday-museum), unlocked full-plan cue checks (`0` cues on normal 3-day; only Sunday/Monday micro-cues in Sunday and 7-day stress plans), final PDF button smoke after removing temporary capture hooks, empty browser error log, rendered PDF contact sheets, PDF text extraction checks for removed stale phrases, and fresh 3-day/7-day stress PDF capture. Latest lead-gate UI QA: `output/qa/ultimate-trip-planner-ui/delivery-grid-desktop-20260531.png` and `output/qa/ultimate-trip-planner-ui/delivery-grid-mobile-20260531.png`. Latest PDF action-card QA: `output/qa/ultimate-trip-planner-pdf/action-cards-3day-20260531-contact-sheet.png` (5 pages, booking action present) and `output/qa/ultimate-trip-planner-pdf/action-cards-7day-booked-20260531-contact-sheet.png` (8 pages, booked action present and booking link absent). Latest Fine-tune UI QA: `output/qa/ultimate-trip-planner-ui/advanced-desktop-20260531.png`, `output/qa/ultimate-trip-planner-ui/advanced-mobile-closed-section-20260531.png`, `output/qa/ultimate-trip-planner-ui/advanced-mobile-open-section-20260531.png`, and `output/qa/ultimate-trip-planner-ui/cues-fullplan-sunday-3day-20260531.png`. Latest Plan Inputs UI QA: `output/qa/ultimate-trip-planner-ui/input-guide-desktop-grid-20260531.png` and `output/qa/ultimate-trip-planner-ui/input-guide-mobile-grid-20260531.png`. Latest Trip Control Panel UI QA: `output/qa/ultimate-trip-planner-ui/control-panel-desktop-20260531.png` and `output/qa/ultimate-trip-planner-ui/control-panel-mobile-20260531.png`. Latest cue-trim PDF QA: `output/qa/ultimate-trip-planner-pdf/cue-trim-3day-20260531-contact-sheet.png` (5 pages, no visible overlap) and `output/qa/ultimate-trip-planner-pdf/cue-trim-7day-stress-20260531-contact-sheet.png` (9 pages, no visible overlap). Latest UI route QA: `output/qa/ultimate-trip-planner-ui/map-brief-final-crop-20260531.png`. Earlier rendered PDF QA: `output/qa/ultimate-trip-planner-pdf/map-brief-20260531-contact-sheet.png` (6-page 3-day plan with route overview/map brief, no visible overlap), `output/qa/ultimate-trip-planner-pdf/route-reel-20260531-contact-sheet.png` (6-page 3-day plan with route reels, no visible overlap), `output/qa/ultimate-trip-planner-pdf/tour-day-marker-20260531-contact-sheet.png` (5-page 3-day plan with in-day tour marker, no visible overlap), and `output/qa/ultimate-trip-planner-pdf/smart-swaps-20260531-contact-sheet.png` (8 pages with Smart Swaps/Fixes, no visible overlap). Latest UI cue QA: `output/qa/ultimate-trip-planner-ui/short-day-cues-20260531.png`.

Latest scheduler QA: transformed Velo syntax check, `diff --check`, and a standalone due-stage fixture covering minus7 due, same-day signup skip, wrong-day skip, day-of before/after 18:00, and already-sent skip all passed.

Latest daily-ops QA: inline script parse, transformed Velo syntax check, `diff --check`, in-app browser 1/5/7-day mobile-width smoke (`Start / Transit / Reserve / Backup` chips, overflow `0`, empty browser error log), and PDF button smoke (`PDF downloaded.`) passed. Screenshot capture in the in-app browser timed out, so this pass uses DOM/runtime evidence.

Latest Reservation Radar QA: inline script parse, transformed Velo syntax check, `diff --check`, in-app browser sales 3-day / booked 7-day / 1-day mobile-width smoke (radar card counts, booked path suppresses book link, overflow `0`, empty browser error log), and PDF button smoke (`PDF downloaded.`) passed.

Latest Base Camp Brief QA: inline script parse, transformed Velo syntax check, `diff --check`, in-app browser 3/5/7-day stay-area smoke for east/west/unsure at mobile-ish width (4 base cards, title-only `Later`/`Evening` endings, overflow `0`, empty browser error log), and PDF button smoke (`PDF downloaded.`) passed.

Latest Budget Pulse QA: inline script parse, transformed Velo syntax check, `diff --check`, in-app browser low/smart/comfort spend-mode smoke at mobile-ish width (4 budget cards, daily budget link present, overflow `0`, empty browser error log), and PDF button smoke (`PDF downloaded.`) passed.

Latest Interest Lens QA: inline script parse, transformed Velo syntax check, `diff --check`, in-app browser history/wall, museums/food/free, and nightlife/food/wall/museums smoke at mobile-ish width (2/3/4 interest cards, Google Maps anchor links present, overflow `0`, empty browser error log), and PDF button smoke (`PDF downloaded.`) passed.

Latest Pace Guard QA: inline script parse, transformed Velo syntax check, `diff --check`, in-app browser family/gentle, packed/nightlife, and balanced/evening smoke at mobile-ish width (4 pace cards, overflow `0`, empty browser error log), and PDF button smoke (`PDF downloaded.`) passed after adding the PDF engine/logo fallback.

Latest day-end close-cap QA: inline script parse, `diff --check`, launch audit, Browser/in-app 7-day unlocked smoke, and headless Chrome desktop/mobile QA passed. Evidence under `output/qa/ultimate-trip-planner-ui/close-compact-20260531/` shows `closeCount: 7`, `maxChipCount: 2`, `repeatedCoveredBackup: 0`, stale `Note:`/`Local cue` absent, overflow `0`, and a real 14-page PDF download/render with the close-card spacing fixed before the Google Maps pack.

Latest personalized close-chip QA: inline script parse, `diff --check`, launch audit (`110 pass, 1 warn, 1 block`), headless Chrome desktop family/gentle/rain/kids QA, true 390px packed/rain/reservations QA, and real PDF download/render passed. Evidence under `output/qa/ultimate-trip-planner-ui/personalized-close-20260531/` shows 7 close rows, desktop family/gentle second-chip variants `Family pause`, `Budget dinner`, `Dry exit`, `Food before close`, mobile packed variants `Stop before tired`, `One booking only`, `Dry exit`, `Food before close`, empty browser errors, and overflow `0`. PDF evidence under `output/qa/ultimate-trip-planner-pdf/personalized-close-20260531/` includes the downloaded 16-page PDF, rendered PNG pages, and contact sheet; text extraction confirms the new cues are present while stale `Note:` / `Local cue` remains absent.

Latest Arrival Playbook QA: inline script parse, `diff --check`, launch audit (`110 pass, 1 warn, 1 block`), and headless Chrome desktop/mobile/export smoke passed. Evidence under `output/qa/ultimate-trip-planner-ui/arrival-playbook-20260531/` confirms one playbook, 4 cards (`Ticket`, `First move`, `Tour anchor`, `First close`), loaded photo, 7 unlocked days, print capture with Arrival Playbook, distinct Trip Highlights images `3`, empty browser errors, and overflow `0`. PDF evidence under `output/qa/ultimate-trip-planner-pdf/arrival-playbook-20260531/` includes a real 15-page 7-day PDF, rendered PNG pages, contact sheet, and text extraction; page 2 shows Arrival Playbook plus Trip Highlights without overlap.

Latest Trip Highlights QA: inline script parse, `diff --check`, launch audit (`110 pass, 1 warn, 1 block`), and headless Chrome desktop/mobile/export smoke passed. UI evidence under `output/qa/ultimate-trip-planner-ui/trip-highlights-20260531/` confirms 3 highlight cards, Start/Tour/Finish present, all photos loaded, Google Maps/booking links present, and overflow `0`. Follow-up Arrival Playbook QA under `output/qa/ultimate-trip-planner-ui/arrival-playbook-20260531/` also confirms the highlight row now uses 3 distinct photos, avoiding the old Start/Tour duplicate. Export evidence under `output/qa/ultimate-trip-planner-pdf/trip-highlights-export-20260531/` includes a real 14-page 7-day PDF, rendered PNG pages/contact sheet, text extraction, print capture, and browser summary; visual inspection of page 2 showed the Trip Highlights PDF cards without overlap.

Latest Weather & Openings Strategy QA: inline script parse, transformed Velo syntax check, `diff --check`, in-app browser Monday/Sunday/future-climate smoke (4 strategy cards, overflow `0`, empty browser error log), and PDF button smoke (`PDF downloaded.`) passed.

Latest Travel Mode hero QA: inline script parse, transformed Velo syntax check, `diff --check`, in-app browser tomorrow-arrival smoke (panel appears before map brief, 4 Ticket/Weather/Meeting/Backup chips, 3 Tonight/Next/Later actions, yellow kicker, overflow `0`, empty browser error log), far-date smoke (mode absent), and PDF button smoke (`PDF downloaded.`) passed. Text export now includes Travel Mode quick-check chips and first-route URL.

Latest Berlin Essentials polish: Essentials now render as compact carry-card cheat sheets with icon, label, short command, and short note instead of paragraph-heavy list items. UI, text export, print, and PDF use the same condensed source. In-app browser QA passed with 8 cards, all cues/icons present, longest note 60 chars, overflow `0`, empty browser error log, and PDF button smoke (`PDF downloaded.`).

Latest lead-gate QA hardening: added localhost-only `?resetUnlock=1` and `?forceLeadError=1` QA params so first-visit and endpoint-failure states can be tested without touching live leads. `unlock()` now clears stale lead messages after success/fail-soft. QA passed fresh locked visit (full plan hidden, PDF/print disabled, 2 preview days, no Essentials), invalid email, missing consent, forced endpoint failure fail-soft unlock (3 full days, Essentials, PDF/print enabled, stale message cleared, overflow `0`, empty browser error log), and PDF button smoke (`PDF downloaded.`).

Latest day-end no-cue QA: the legacy `shortDayNote`/`bw-day-check`/PDF-note render path has been removed. Headless Chrome 7-day fail-soft unlock passed with `fullDays: 7`, `closeRows: 7`, `closeRowsWithCopy: 0`, `dayChecks: 0`, no `Local cue`/`Note` text inside day cards, stale long-note phrases absent, overflow `0`, and PDF enabled. Inline script parse, `diff --check`, and a source search for old note hooks also passed.

Latest distribution visibility QA: `widgets-hub/widgets-hub-element.js` now filters `hidden`, `published: false`, and `status: "draft"` tools in the live Custom Element as well as the standalone widgets hub. `tools-home/tools-home-element.js` now applies the same draft/hidden/unpublished filter before slicing the first 8 homepage cards. Static audit passed with Ultimate still `status: "draft"`, `tools-home/data.json` not listing Ultimate, visible public count `30`, and `visibleHasUltimate: false`. Follow-up homepage smoke injected draft Ultimate plus hidden/unpublished test rows into the fetched homepage data; render still showed 8 public cards, no Ultimate/hidden/unpublished card, first two planner icons loaded, overflow `0`, and empty console errors. Evidence: `output/qa/tools-home/draft-filter-20260531/summary.json` and `tools-home-draft-filter.png`.

Latest Trip Pass QA: inline script parse and `diff --check` passed. Headless Chrome desktop 3-day smoke found one `.bw-trip-pass`, 3 stat cells, 3 day icons, Google Maps overview URL with `api=1`, overflow `0`, and PDF button smoke (`PDF downloaded.`). Mobile-width 390px 7-day smoke found one pass, 3 stat cells, 7 day icons, Google Maps overview URL with `api=1`, and overflow `0`. Export follow-up passed 7-day headless screen/print/PDF smoke: one pass, 3 stats, 7 day icons, no overflow, print HTML contains `Berlin trip pass`, pass code, and `Open map`, print was invoked, and PDF button status returned `PDF downloaded.`.

Latest preview-flow QA: inline script parse and `diff --check` passed. Headless Chrome desktop locked 7-day smoke found 2 preview days, 2 preview flows, 6 action chips, zero direct preview paragraphs, Google Maps route links with `api=1`, white icons, and overflow `0`. Forced fail-soft unlock expanded to 7 preview flows / 21 chips with zero direct preview paragraphs, overflow `0`, and PDF button status `PDF downloaded.`. Mobile-width 390px locked smoke also found 2 flows / 6 chips, white icons, and overflow `0`.

Latest Day Rhythm QA: inline script parse, transformed Velo syntax check, and `diff --check` passed. Headless Chrome desktop locked 7-day smoke found 2 preview rhythm panels / 8 rhythm items, bars at expected levels, zero direct preview paragraphs, and overflow `0`; forced fail-soft unlock expanded to 7 preview rhythms plus 7 full-plan rhythms / 28 full rhythm items and PDF status `PDF downloaded.`. Clean fetch-intercept smoke confirmed lead payload includes `dayRhythm`; print capture includes rhythm bars; mobile-width 390px fail-soft unlock found 7 preview rhythms, 7 full-plan rhythms, 28 rhythm items, PDF enabled, and overflow `0`.

Latest Phone Carry Pack QA: inline script parse, transformed Velo syntax check, and `diff --check` passed. Headless Chrome locked smoke confirmed Carry Pack is hidden before email; forced fail-soft unlock showed 1 pack / 4 actions (`Exact plan`, `Route map`, `Tour hold`, `Carry PDF`), 1 calendar download, Google Maps route link, overflow `0`, copy action status, print capture with `Phone carry pack`, and PDF status `PDF downloaded.`. Clean fetch-intercept smoke confirmed lead payload includes `carryPack`; mobile-width 390px fail-soft unlock kept 4 actions and overflow `0`. Booked-state smoke switched `Tour hold` to `Tour prep`, removed calendar downloads, kept the World Clock meeting link, and kept overflow `0`.

Latest PDF visual regression QA: headless Chrome downloaded fresh PDFs after the Trip Pass / Day Rhythm / Phone Carry Pack additions, then `pypdfium2` rendered every page to PNG contact sheets. `carry-3day-sales.pdf` rendered as 8 pages and `carry-7day-booked.pdf` rendered as 12 pages; both show the BerlinWalk logo, Phone Carry Pack, Day Rhythm bars, day cards, and Berlin Essentials without visible overlap or clipped sections. Text extraction confirmed `Phone carry pack` and Day Rhythm content are present and stale `Local cue` text is absent. Contact sheets: `output/qa/ultimate-trip-planner-pdf/live-regression-20260531/carry-3day-sales-contact-sheet.png` and `output/qa/ultimate-trip-planner-pdf/live-regression-20260531/carry-7day-booked-contact-sheet.png`.

Latest photo-postcard QA: day postcards now use real gallery photos via `DAY_PHOTOS`, eager-loaded so the visual appears immediately in the widget. Headless Chrome desktop/mobile locked and fail-soft unlocked smokes passed: locked preview `2/2` photos loaded, unlocked 7-day plan `14/14` photos loaded, seven unique photo assets used, overflow `0`, title-only day closers still have `closeRowsWithCopy: 0`, print HTML includes 7 photo sources and no old `bw-day-art` SVG class, and PDF button smoke still returned `PDF downloaded.`. Visual QA screenshots: `output/qa/ultimate-trip-planner-ui/photo-postcards-desktop-20260531.png`, `photo-postcards-mobile-20260531.png`, and `photo-postcards-preview-crop-20260531.png`.

Latest PDF photo QA: inline script parse and `diff --check` passed after adding `loadImageDataUrl()`, `loadDayPhotoDataUrls()`, `drawPdfPhoto()`, and `drawPdfPhotoStrip()`. Headless Chrome 7-day fail-soft PDF smoke returned `PDF downloaded.`, `fullDays: 7`, `photos: 14`, overflow `0`, and saved `output/qa/ultimate-trip-planner-pdf/photo-postcards-20260531/photo-postcards-7day.pdf` (13 pages, 2.4 MB). Rendered all pages with `pypdfium2`; contact sheet shows the new cover photo strip, PDF day-card photo thumbnails, BerlinWalk logo, Trip Pass, Day-by-Day cards, and Essentials without visible overlap/clipping. Text extraction confirmed `Route snapshots` and `Day-by-Day Plan` are present and stale `Local cue` / `Note:` text is absent. Contact sheet: `output/qa/ultimate-trip-planner-pdf/photo-postcards-20260531/photo-postcards-7day-contact-sheet.png`.

Latest PDF overview QA: inline script parse and `diff --check` passed after adding `drawItineraryOverviewPage()`. Headless Chrome downloaded a 7-day sales PDF (`PDF downloaded.`, 14 pages, 2.6 MB) and a 3-day booked PDF (9 pages, 2.3 MB); both were rendered with `pypdfium2`. Text extraction confirmed `ITINERARY OVERVIEW`, `Day index`, and `How to use this PDF`; stale `Local cue` / `Note:` text stayed absent. Booked-path extraction confirmed `BOOKED PATH` / `World Clock prep` and no `Book the free walking tour` sales text. Contact sheets: `output/qa/ultimate-trip-planner-pdf/overview-20260531/overview-7day-contact-sheet.png` and `overview-3day-booked-contact-sheet.png`.

Latest Route Deck QA: inline script parse and `diff --check` passed. In-app browser locked/mobile-ish read confirmed Route Deck exists with 7 day buttons, photo loaded, 3 anchors, and overflow `0` after fixing narrow Trip Pass route wrapping. Headless Chrome desktop 7-day smoke found Route Deck present, 7 day buttons, Google Maps `api=1` route link, loaded focus photo, overflow `0`; selecting Day 4 changed the active day, title, photo route, and action status. Forced fail-soft unlock produced 7 full day cards, 7 deck buttons, one selected-day `Jump to day`, PDF enabled, and overflow `0`. True 390px mobile emulation found Route Deck present, 7 buttons, single-column focus/chips, loaded photo, overflow `0`; selecting Day 7 switched to the Potsdam transit route. Screenshots: `output/qa/ultimate-trip-planner-ui/route-deck-focus-desktop-20260531.png`, `route-deck-focus-mobile-20260531.png`, `route-deck-desktop-20260531.png`, and `route-deck-mobile-390-20260531.png`.

Latest Dashboard Lens QA: inline script parse and `diff --check` passed after replacing the always-expanded plan board with `Route / Prep / Review` dashboard tabs. In-app browser read and CUA clicks confirmed the default `Route` lens shows map/media + map brief + trip spine only; `Prep` switches to Base Camp, Budget Pulse, Interest Lens, Pace Guard, and Weather & Openings; `Review` switches to Plan Health, Pre-arrival Checklist, Reservation Radar, Plan Confidence, Smart Swaps, and Smart Fixes. Headless Chrome desktop and true 390px mobile emulation confirmed all three lenses, correct section counts, active tab state, and overflow `0`. Fail-soft unlock after switching to `Prep` still produced 7 full day cards, Route Deck jump, PDF enabled, and overflow `0`. Screenshots: `output/qa/ultimate-trip-planner-ui/dashboard-lens-desktop-20260531.png` and `dashboard-lens-mobile-390-20260531.png`.

Latest Day Jump Bar QA: inline script parse and `diff --check` passed. In-app browser locked read confirmed the full plan stays hidden and no day-jump buttons render before unlock. Headless Chrome desktop fail-soft unlock confirmed `7` day-jump buttons, `7` full day cards, PDF enabled, Day 5 active/focused after click, status copy updated, and overflow `0`; true 390px mobile fail-soft unlock confirmed Day 7 active/focused, PDF enabled, two-column jump grid, and overflow `0`. Screenshots: `output/qa/ultimate-trip-planner-ui/day-jump-bar-desktop-20260531.png`, `day-jump-bar-mobile-390-20260531.png`, `day-jump-desktop-20260531.png`, and `day-jump-mobile-390-20260531.png`.

## Current Baseline

The V3 widget already has a strong deterministic core: arrival date, 1-7 day logic, weather fallback, Sunday/public-holiday/Monday warnings, BerlinWalk tour slot recommendation, email gate, PDF/print, Google Maps search links, essentials, and booking-aware Velo/email scaffolding.

The main gap is not the planning logic. The gap is perceived product depth: the screen still reads like a text-heavy questionnaire and text-heavy itinerary. Competitors create "ultimate" feeling through visual itinerary objects: maps, timelines, day color coding, export/share affordances, stateful travel mode, and confidence checks.

## Research Signals

- Map-first itinerary tools make the plan feel real. TripTop positions itself against "wall of text" planning by combining day-by-day planning, opening-hour checks, map context, and share links. Source: https://triptop.io/
- JourneyDoc and aitrips.io both use a timeline + map mental model: day-by-day timeline, live/interactive map, weather alongside activities, PDF/share/export, and "now / next" travel mode. Sources: https://www.journeydoc.com/ and https://www.aitrips.io/
- TripMapper emphasizes alternate itinerary layouts, start/end times, notes, images, budget, map view, and business details. Source: https://www.tripmapper.co/features
- AITripPlan shows a good lightweight web promise: destination/date/budget/travel-style inputs -> morning/afternoon/evening day plan -> neighborhood/travel-time/map hints -> print-ready export. Source: https://aitripplan.com/
- BerlinUnlocked's 3-day Berlin article monetizes/lead-captures with a Google Maps version. That confirms a Berlin-specific map layer is a competitive conversion asset, not a cosmetic extra. Source: https://www.berlinunlocked.de/blog/3-days-in-berlin/
- Google Maps URLs are the right low-friction layer for V1/V2: no API key needed, `api=1` required, and URLs can launch search, directions, map, or Street View cross-platform. Source: https://developers.google.com/maps/documentation/urls/get-started
- Open-Meteo supports hourly/daily forecast parameters and up to 16 forecast days with `forecast_days=16`; current near-date weather logic is directionally correct. Source: https://open-meteo.com/en/docs
- Berlin.de is the official reference for 2026/2027 Berlin public holidays; keep using official holiday dates instead of generic Germany-wide lists. Source: https://www.berlin.de/en/tourism/travel-information/1887651-2862820-public-holidays-school-holidays.en.html
- Berlin.de also notes a one-off statutory public holiday on 2028-06-17 in school year 2027/2028; keep this as an explicit override because recurring holiday formulas will not catch it. Source: https://www.berlin.de/sen/bjf/service/kalender/ferien/termine/
- Baymard form research supports reducing visible form intimidation, avoiding confusing multi-column forms, and using inline validation that is not premature. Sources: https://baymard.com/learn/form-design and https://baymard.com/blog/inline-form-validation
- Google FAQ rich results are now limited mainly to well-known government/health sites. Visible FAQs still matter for users and AI/search understanding, but do not pitch FAQ schema as a guaranteed rich-result win. Source: https://developers.google.com/search/docs/appearance/structured-data/faqpage
- Schema.org supports `TouristTrip` / `Trip` itinerary markup, including `itinerary` and nested `ItemList` examples. Use this as an SEO understanding layer, not as a magic ranking lever. Source: https://schema.org/TouristTrip

## Deep Research Pass 2026-05-30

This pass looked again at travel-planner products, official map/weather/opening sources, form UX, and current SEO constraints. The main finding: the next leap should be "mobile operating plan", not "more itinerary text".

Sources checked:

- Google Maps URLs docs confirm cross-platform search/directions links, `api=1` requirement, URL encoding, no API key requirement, and the 2,048 character URL limit. This supports short day routes with 3-4 anchors max. Source: https://developers.google.com/maps/documentation/urls/get-started
- Open-Meteo docs confirm near-date hourly/daily forecasts and up to 16 forecast days. Keep monthly fallback for dates beyond that window. Source: https://open-meteo.com/en/docs
- Berlin.de lists official 2026/2027 Berlin holidays and school holidays; use Berlin-specific official dates, not Germany-wide shorthand. Source: https://www.berlin.de/tourismus/infos/1887651-1721039-feiertage-schulferien.html
- Berlin.de and visitBerlin confirm the visitor-facing shop rule: Monday-Saturday is broad opening time, but Sundays/public holidays close shops except specific exceptions such as stations, airports, petrol stations, pharmacies, bakeries, tourist goods, markets, and authorized shopping Sundays. Sources: https://service.berlin.de/dienstleistung/327974/en/ and https://www.visitberlin.de/en/shopping-business-hours
- OpenHolidays API supports Germany public holidays and school holidays from 2020 as JSON/iCal. Consider it only if we want a maintained fallback/feed; for V1 a curated official Berlin table is safer. Source: https://www.openholidaysapi.org/en/
- AITripPlan's useful lightweight promise is "day-by-day + neighborhood/travel-time/map hints + export", with no signup required for the first plan. Source: https://www.aitripplan.com/
- Trip Sketch emphasizes map-based planning, color-coded route lines by day, transportation logs, expense tracking, cloud sync, and PDF export. Source: https://www.tripsketch.co/en/
- aitrips.io's strongest ideas are trip review, weather per activity, transport suggestions, group comments/voting, read-only sharing, and mobile travel mode with "now / next / today" cached offline. Source: https://www.aitrips.io/
- Wanderlog's App Store listing highlights map pins/routes, drag-and-drop order, reservations, offline storage, collaboration, start/end times, notes, place details, and budget/expense tracking. For our scope, the useful takeaways are offline/phone access, clear map context, and reservation state, not a giant app clone. Source: https://apps.apple.com/us/app/wanderlog-travel-planner/id1476732439
- BerlinUnlocked monetizes a 3-day itinerary with a Google Maps version; this reinforces that the map layer is a conversion product, not decoration. Source: https://www.berlinunlocked.de/blog/3-days-in-berlin/
- Baymard form guidance reinforces low-intimidation forms, fewer visible fields, single-column structure, persistent labels, and non-premature positive validation. Sources: https://baymard.com/learn/form-design and https://baymard.com/blog/inline-form-validation
- GOV.UK validation guidance reinforces plain error messages that explain what went wrong and how to fix it. Source: https://design-system.service.gov.uk/components/error-message/
- Google's current FAQPage doc says FAQ rich results stopped appearing in Google Search as of 2026-05-07 and Search Console support is being removed in 2026. Keep FAQs for reader usefulness and machine understanding, not old SERP dropdowns. Source: https://developers.google.com/search/docs/appearance/structured-data/faqpage
- Google's helpful content guidance still points back to first-hand expertise, depth of knowledge, satisfying user outcomes, and avoiding search-first fluff. This favors BerlinWalk's local guide logic over generic AI planner copy. Source: https://developers.google.com/search/docs/fundamentals/creating-helpful-content

### Product Direction From This Pass

The planner should feel like:

> "A Berlin trip control panel that turns into a phone-ready arrival plan."

That means the surface should prioritize:

1. **Shape:** a visible trip spine, day color, icons, map actions, and at-a-glance risk chips.
2. **Decisions:** best BerlinWalk slot, rain/Monday/Sunday swaps, ticket/tour timing, and book-ahead warnings.
3. **Carry mode:** PDF, print, copy link, phone-readable "Today / Now / Next" state, and calendar/map actions.
4. **Personalization:** not infinite AI text; deterministic segments from group, pace, interests, must-handle flags, arrival time, and booked status.
5. **Conversion:** email gate as plan delivery, then a booking-aware sequence that becomes prep language once booked.

### Strongest Next Improvements

These are the next improvements most likely to make Yusuf say "now it feels ultimate":

1. **Finish Travel Mode as a visible mobile feature.**
   - Show only for today/tomorrow arrivals.
   - Use `Now`, `Next`, and `Later` cards.
   - Include ticket, first route, weather, fatigue/rain/late fallback, and meeting point when booked or recommended.
   - Add the same summary into PDF, print, lead payload, and email variables.

2. **Add Smart Fixes / Trip Review as the local-guide differentiator.**
   - Show 3-4 concise fixes: Monday museum swap, rain swap, Sunday shop rule, book-ahead list, protected family break, late-arrival simplification.
   - Treat this as "BerlinWalk reviewed your plan", not as a scary score.
   - Store the fix summary on the lead so emails can mention the exact risk.

3. **Make the UI more visual without adding clutter.**
   - Add one reusable illustrated Berlin route/map panel or mini static map image, not random stock photos.
   - Give each day type a real icon and accent color.
   - Turn essentials into icon tiles.
   - Add a small "Day type" visual legend only if it helps scanning.

4. **Make PDF a carryable artifact.**
   - Add BW logo, cover snapshot, Travel Mode if near arrival, Smart Fixes, day cards, Berlin Essentials, and plain readable booking/meeting-point links.
   - Add QR codes only if implementation stays lightweight and QA proves they scan.
   - Keep visual regression: render 3-day and 7-day PDFs to PNG/contact sheets before publishing.

5. **Add phone-ready sharing and calendar actions.**
   - Keep `Copy plan link`.
   - Add "Add BerlinWalk tour to calendar" for the recommended slot.
   - Add a PII-free "WhatsApp" share URL for sending the plan to a phone or travel group.
   - Do not store email in share URLs.

6. **Improve lead quality without adding more top-level questions.**
   - Derive lead segments from current choices:
     - `arrival_window`
     - `trip_risk`
     - `tour_recommendation`
     - `intent_stage`
     - `family_or_slow`
     - `book_ahead_needed`
   - Add these fields to Velo storage and email variables.
   - Use them for subject lines and branch copy.

7. **Blog page strategy: tool first, explanation second.**
   - Put the widget near the top after a short quick answer.
   - Then explain how the planner thinks: geography, arrival date, weather, openings, tour slot, pace.
   - Use FAQs for real questions and internal links; do not over-invest in FAQ rich results.

### Things To Avoid

- Do not add a full live map API yet. Google Maps URLs give 80 percent of the value with almost no privacy/API/key risk.
- Do not promise live opening hours unless we use a reliable paid/maintained place-hours API or a curated dataset we are willing to maintain.
- Do not add AI generation before deterministic Berlin logic feels complete. The differentiator is local rule quality, not generic prose.
- Do not add more required questions. The next value should come from better interpretation of existing answers.
- Do not put Ultimate back on homepage shortcuts until the live tool and PDF pass QA.

## V4 Recommendation

Build V4 around one product idea:

> "Your Berlin trip as a visual, arrival-aware operating plan."

That means the widget should not only generate text. It should produce a visible travel document with a map spine, day cards, risk badges, and phone-ready actions.

## Priority Backlog

### P0 Before Public Launch

1. **Visual Itinerary Spine**
   - Replace the current visual board with a real "trip spine": Day 1, Day 2, Day 3 etc. as horizontal/vertical route cards.
   - Each day should show an icon, area, day theme, 2-3 anchor locations, one risk badge, and one primary action.
   - Add color-coded day accents that match day type: arrival, history/Mitte, Wall/East, museums, food, low-budget, nightlife, slow/Potsdam.
   - Keep details collapsed until needed. The first view should answer: "What does my trip look like?"

2. **Location Catalog + Stronger Maps**
   - Add a `PLACE_CATALOG` with canonical labels, Google query, optional coordinates, area, type, and short explanation.
   - Generate three link types:
     - individual place link: `maps/search/?api=1&query=...`
     - day route link: `maps/dir/?api=1&origin=...&destination=...&waypoints=...&travelmode=transit|walking`
     - meeting point link: World Clock / Alexanderplatz.
   - Use exact place names where possible: `Weltzeituhr Alexanderplatz`, `Berlin Wall Memorial Bernauer Strasse`, `Topography of Terror`, `Hackesche Höfe`, etc.
   - In the UI, label links as actions: `Open Day 2 route`, `Save World Clock`, `Open Museum Island`.

3. **Less Text, More States**
   - Convert long notes into short "risk chips":
     - Sunday shops
     - Monday museum caution
     - Public holiday
     - Rain backup
     - Book ahead
     - Family break
   - Full explanatory copy should live behind "Why this matters" or only in PDF/print.
   - Replace repeated text labels with icons + compact tooltips where the meaning is obvious.

4. **PDF V4: Real Travel Document**
   - Page 1 should be a cover/snapshot: BerlinWalk logo, trip dates, trip length, weather state, ticket start, best tour slot, and QR/link to booking.
   - Page 2+ should be day cards, one or two per page depending on text length, with stable page-break logic.
   - Add a final "Berlin Essentials" page with:
     - ticket zone rules
     - Sunday/public holiday rules
     - Monday museum warning
     - cash/card/toilets/water
     - meeting point
     - emergency/backup logic
     - BerlinWalk CTA
   - Add small QR codes or plain links for booking and meeting point if client-side QR generation is lightweight enough.
   - Keep jsPDF only if we keep tight layout controls; otherwise consider making print CSS the primary "Save as PDF" path and leaving jsPDF as secondary.

5. **Lead Gate Conversion Polish**
   - Keep the useful preview before email.
   - Make the gate feel like a delivery step, not a wall: "Send the phone-ready version + PDF."
   - Add inline positive email validation after blur, not aggressive validation while typing.
   - Add a tiny privacy reassurance beside consent: "No spam. Berlin arrival reminders only."
   - Track form step interactions and gate conversion events separately.

6. **Booking CTA Logic**
   - The CTA should adapt to the recommendation:
     - Arrival morning: `Book the 11:30 tour for arrival day`
     - Later arrival: `Book Day 2 at 11:30`
     - Already booked: `Save the World Clock meeting point`
   - The full plan should have one primary CTA near the recommended day, not only at the generic top/bottom.

### P1 After Launch

1. **Share/Resume State**
   - Encode non-email plan state into the URL so a user can return to the same plan.
   - Add `Copy plan link` and `Email me this exact plan`.
   - Do not expose email/PII in the URL.

2. **Travel Mode**
   - If arrival is today/tomorrow, show a compact `Now / Next / Later` assistant.
   - Include weather, meeting point, ticket, and "what to do if tired/raining/late" states.

3. **Itinerary Health Score**
   - Add a simple "Plan confidence" summary:
     - geography sensible
     - pace okay
     - weather risk
     - opening risk
     - reservation risk
   - This differentiates BerlinWalk from generic AI planner output because it explains realism.

4. **Day Swaps**
   - Add "rain swap" and "Monday swap" suggestions:
     - If Monday + museums, swap museum day with outdoor/Wall day.
     - If high rain probability, move museum/covered market day earlier.
   - Keep deterministic rules for V1.

5. **Email Personalization**
   - Use interest and risk tags in the email subject/body:
     - `Your Berlin plan: Wall history + rainy-day backup`
     - `Arriving Sunday: the Berlin shop rule to know`
     - `Your Day 2 tour slot + Museum Island warning`
   - For booked leads, suppress sales language completely and shift to meeting point/weather/prep.

6. **Blog Embed Improvements**
   - In the blog post, embed the widget near the top with a compact intro and a `Build your plan` anchor.
   - Below the widget, add a short explanation of how the planner thinks: geography, weather, openings, tour timing.
   - Since Google FAQ rich results are limited, write FAQs primarily for reader usefulness and internal linking, not snippet chasing.

### P2 Later / Nice to Have

1. **Curated Berlin Place Packs**
   - Let users add a pack: "Museums", "Cold War", "Food", "Kids", "Nightlife", "Low-budget".
   - Keep as deterministic data, not live AI.

2. **Optional AI Refinement**
   - Only after deterministic V4 is solid: "Make this slower", "Add more food", "I already saw Museum Island."
   - Output should remain bounded by curated Berlin data.

3. **Live Opening Hours**
   - Avoid promising live opening hours unless using a paid/reliable API or a curated maintained dataset.
   - Current V4 should say "opening-day logic" and "check-open flags", not "live opening hours."

4. **Phone Wallet / ICS**
   - Add `.ics` for the recommended BerlinWalk tour slot and optionally a calendar hold for the arrival-day setup.

## Implementation Shape

Keep the widget as a standalone HTML file for now, but split the logic internally into clearer data objects:

- `PLACE_CATALOG`
- `DAY_MODULES`
- `RISK_RULES`
- `ESSENTIALS`
- `PDF_SECTIONS`
- `EMAIL_SEGMENTS`

Recommended V4 build order:

1. Add place catalog and improved maps/directions links.
2. Rebuild the visual plan UI around day cards and risk chips.
3. Redesign PDF around cover + day cards + essentials page.
4. Add adaptive CTA language and analytics events.
5. Run desktop/mobile/PDF QA before publishing.

## V4 Implementation Tickets

Use these as the next build sequence. Each ticket should be implemented and QA'd before moving to public launch.

### UTP-V4-1: Canonical Place Catalog And Map URL Layer

**Purpose:** Make the planner feel grounded in real Berlin locations, not generic text blocks.

**Implementation notes:**

- Add a `PLACE_CATALOG` object keyed by stable IDs such as `world_clock`, `museum_island`, `wall_memorial`, `east_side_gallery`, `topography_terror`, `hackesche_hofe`, `markthalle_neun`, `tempelhofer_feld`, `sanssouci`.
- Each place should include:
  - `label`
  - `query`
  - `area`
  - `type`
  - `lat` / `lng` when useful
  - `why`
- Replace inline `mapLink('Museum Island', 'Museumsinsel')` strings with catalog references.
- Add helpers:
  - `placeSearchUrl(placeId)`
  - `dayDirectionsUrl(day)`
  - `meetingPointUrl()`
  - `formatPlaceChips(day)`
- For directions URLs, keep routes short. Google Maps URL length is limited, so do not put more than 3-4 anchors in one route.

**Acceptance criteria:**

- Every day has a primary `Open Day X route` action.
- Every day still has individual place links.
- Map links use `https://www.google.com/maps/...` with `api=1`.
- Meeting point link is always available when the tour is recommended or booked.
- No old ad hoc map strings remain in day templates except as catalog fallback.

### UTP-V4-2: Visual Trip Spine

**Purpose:** Replace the current "text preview plus image" feeling with a real itinerary object.

**Implementation notes:**

- Add a top-level `bw-trip-spine` inside the result panel.
- Each spine item should show:
  - day number
  - day date
  - day type icon
  - area/theme
  - 2-3 place chips
  - risk chips
  - primary route/action link
- On desktop, use a compact vertical timeline or two-column board next to the snapshot.
- On mobile, use a single-column card stack with stable tap targets.
- Keep detailed blocks in the unlocked full plan, not in the preview spine.

**Acceptance criteria:**

- At 1/3/5/7-day states, the first viewport contains a visual trip shape, not only form fields and paragraphs.
- Mobile width 390px has no horizontal overflow.
- Day cards do not resize unpredictably when risks or place names change.
- The UI has visible icons or image assets beyond the BerlinWalk logo.
- Preview remains useful before email but does not expose the full plan/PDF.

### UTP-V4-3: Risk Chips And Plan Confidence

**Purpose:** Turn long explanatory notes into scannable local-guide intelligence.

**Implementation notes:**

- Add `riskTagsForDay(day)` returning objects like:
  - `{ key: 'sunday', label: 'Sunday shops', severity: 'medium' }`
  - `{ key: 'holiday', label: 'Public holiday', severity: 'high' }`
  - `{ key: 'monday', label: 'Museum caution', severity: 'medium' }`
  - `{ key: 'rain', label: 'Rain backup', severity: 'medium' }`
  - `{ key: 'booking', label: 'Book ahead', severity: 'medium' }`
  - `{ key: 'breaks', label: 'Break needed', severity: 'low' }`
- Add a `planConfidence(plan)` summary with 3-5 items:
  - geography
  - pace
  - weather
  - opening-day risk
  - booking risk
- Keep the longer note text available in the full plan/PDF.

**Acceptance criteria:**

- Sunday, Monday, public holiday, family/slow pace, rain backup, and reservation selections produce visible chips.
- At least one confidence summary appears in the result panel.
- The full plan has shorter notes than V3, with no huge yellow note blocks in normal cases.
- PDF still preserves the practical explanations.

### UTP-V4-4: PDF V4 Travel Document

**Purpose:** Make the PDF feel like a polished BerlinWalk mini-plan rather than a printout of page text.

**Status:** Done locally. Keep this section as acceptance criteria for future QA.

**Implementation notes:**

- Keep the real BerlinWalk logo in the header.
- Page 1:
  - title
  - arrival date and trip length
  - trip mode/pace/group
  - weather snapshot
  - ticket start
  - best tour slot
  - mini trip spine
  - BerlinWalk CTA link
- Day pages:
  - one full-width day card if long, two compact cards if short
  - day accent color and icon initial
  - 3 time blocks
  - place anchors
  - risk chips
  - one short local note
- Final page:
  - Berlin Essentials
  - meeting point
  - ticket zones
  - Sunday/holiday/Monday
  - cash/card/toilets/water
  - booking link and `@berlinwalkingtour`
- If QR generation is added, use a tiny dependency or a simple embedded QR helper; otherwise use readable URLs.

**Acceptance criteria:**

- 7-day PDF renders without overlap at default selections and with long-risk selections.
- The first page has BW logo and trip snapshot.
- Berlin Essentials always starts cleanly and does not collide with the previous day.
- Links are clickable where jsPDF supports `textWithLink`.
- Render at least one PDF to PNG/contact sheet before launch QA.

### UTP-V4-5: Lead Gate And CTA Personalization

**Purpose:** Improve conversion without making the widget feel predatory.

**Implementation notes:**

- Rewrite lead gate around delivery value: `Send the phone-ready plan + PDF`.
- Add positive validation after blur or after submit correction, not on first keystroke.
- Add separate events:
  - `bw_trip_planner_gate_view`
  - `bw_trip_planner_email_focus`
  - `bw_trip_planner_email_valid`
  - `bw_trip_planner_consent_check`
  - `bw_trip_planner_unlock_attempt`
  - `bw_trip_planner_unlock_success`
- Change primary CTA copy by state:
  - morning + not booked: `Book arrival-day 11:30 tour`
  - later arrival + not booked: `Book Day 2 at 11:30`
  - booked/self-reported booked: `Save World Clock meeting point`
  - unsure/maybe: `See the 11:30 tour details`

**Acceptance criteria:**

- Invalid email and missing consent show clear inline messages.
- Endpoint failure still fail-soft unlocks.
- CTA copy changes correctly across `tourIntent` and `arrivalTime`.
- Booked mode does not show a sales-first CTA.
- Analytics events still do not send email addresses or PII.

### UTP-V4-6: Share/Resume State

**Purpose:** Let users return to the exact plan and share it without exposing private data.

**Implementation notes:**

- Serialize non-PII planner state into query params.
- Add `Copy plan link`.
- Add `WhatsApp` share with the same non-PII state URL.
- Add `Reset plan` if needed.
- Keep email and unlock token only in local storage, never in shared URL.

**Acceptance criteria:**

- Reloading a copied URL reproduces date, trip length, choices, and generated plan.
- Email is never present in URL.
- The widget works with existing `?context`, `?date`, `?tripLength`, and `?weather=off` params.

## Minimum Launch QA For V4

- Desktop local QA at 1280px: no horizontal overflow, visible visual spine, all day counts render.
- Mobile local QA at 390px: no horizontal overflow, no clipped buttons, visual spine cards fit.
- Date logic QA:
  - today
  - tomorrow
  - date more than 16 days away
  - Sunday
  - Monday
  - Berlin public holiday
- Planner state QA:
  - 1-day, 3-day, 5-day, 7-day
  - morning arrival
  - evening arrival
  - already booked
  - family/gentle pace
  - rain + reservations flags
- Lead gate QA:
  - invalid email
  - missing consent
  - successful submit if endpoint available
  - fail-soft unlock if endpoint unavailable
- PDF QA:
  - default 3-day PDF
  - long 7-day PDF
  - rendered PNG/contact sheet inspection
- Link QA:
  - at least one individual map link opens Google Maps search
  - at least one day route link opens Google Maps directions
  - meeting point link is present in booked/recommended states
- Distribution QA:
  - GitHub Pages URL with cachebuster
  - Wix tool page embed height
  - blog embed near the top
  - do not add to `tools-home/data.json` until public launch

## Definition Of "Ultimate" For V4

V4 is ready to publish only when a first-time Berlin visitor can:

- See the trip shape visually before reading detailed text.
- Understand the best BerlinWalk tour slot.
- Open each day in Google Maps.
- See local risks at a glance.
- Unlock a full plan without feeling tricked.
- Download a PDF that looks like a designed BerlinWalk travel plan.
- Keep or share the plan without re-entering everything.

## What Not To Do

- Do not add more top-level questions before improving visual output.
- Do not move Ultimate back into `tools-home/data.json` until it is live/published.
- Do not overpromise live opening hours.
- Do not make the plan too exact hour-by-hour; Berlin trips need flexible blocks.
- Do not replace deterministic local-guide rules with generic AI output in V4.
- Do not rely on FAQ rich results as a core SEO promise.
