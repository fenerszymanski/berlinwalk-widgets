# Session log

Rolling log of agent sessions. Most recent at top.

Format for each entry — see `AGENTS.md` §9.

## 2026-06-03 — Codex (Ultimate simple Yusuf note)

**Did:** Simplified the Ultimate planner AI/Yusuf note so it reads less like a generated route-story module and more like a short personal guide note.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — renamed the panel to `Your Local Guide Yusuf's Note`, reduced visible AI day stories to a max of 3 key days, removed normal-state cue chips, made weather/tour notes compact, and simplified mock/fallback language.
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js` — simplified the Gemini prompt: plain English, no fixed template, no raw interest-label lists, no invented stops/times.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — updated the AI polish wording audit for the new panel title.
- `output/qa/ultimate-trip-planner-prepublish-gate/` — new local prepublish evidence files from the latest gate runs.

**Opened:** The panel is calmer, but Yusuf should still judge the real live Gemini output after Velo paste/publish; PDF/email polish remain next-phase work.
**Closed:** Inline script parse passed; `launch-audit.mjs` passed `152 pass, 0 warn, 0 block`; Velo prepublish gate passed `13 pass`; local browser QA on a 7-day mock plan showed 3 AI day cards, 7 full days, no `Route Story`, no normal cue chips, normal copy weights, and no horizontal overflow.

**Next session should:** If Yusuf likes the copy direction, paste/publish the updated Velo source and smoke-test live Gemini. If not, tune the guide note copy one more round before touching PDF/email.

## 2026-06-03 — Codex (Fixtures icon yellow fill)

**Did:** Replaced the fixtures icon with Yusuf's later ChatGPT image after removing/replacing black corners so the icon area is fully yellow.

**Changed:**
- `tools-home/icons/world-cup-2026-fixtures-berlin-time.png` and `tools-home/icons/world-cup-2026-fixtures-berlin-time-160.png` — regenerated from `/Users/yusufucuz/Downloads/ChatGPT Image Jun 3, 2026, 10_05_48 PM.png`, with border-connected black pixels filled by yellow background.
- `tools-home/icons/manifest.json` — fixtures entry now points to the later source image and Wix Media `5a08a3_b197adcbe5214470a8c6ee3907955adc~mv2.png`.
- `tools-hub/data.json` — fixtures `image` now uses the cleaned yellow-fill Wix Media icon; `watch-world-cup-2026-berlin` was left unchanged.
- Wix: uploaded the cleaned fixtures 160px icon and updated `BerlinTools Layout Fixes` custom embed `0dd3e5f3-520b-47ae-a995-e767f222265f` to revision 11.

**Opened:** Push this cleaned fixtures-icon commit from an authenticated terminal so GitHub Pages-backed data catches up.
**Closed:** Live `/berlin-tools` Playwright QA confirms fixtures uses `b197...` and public-viewing still uses `9add...`.

**Next session should:** Push/QA only the fixtures icon if Yusuf asks; avoid touching the current dirty Ultimate planner files unless that work is active.

## 2026-06-03 — Codex (Fixtures World Cup icon swap)

**Did:** Replaced only the World Cup fixtures tool icon with Yusuf's new square World Cup icon.

**Changed:**
- `tools-home/icons/world-cup-2026-fixtures-berlin-time.png` and `tools-home/icons/world-cup-2026-fixtures-berlin-time-160.png` — regenerated from `/Users/yusufucuz/Downloads/worldcupicon.png`.
- `tools-home/icons/manifest.json` — fixtures entry now points to `worldcupicon.png` and Wix Media `5a08a3_725c47e499be4e63bec2013410e0a98b~mv2.png`.
- `tools-hub/data.json` — fixtures `image` now uses the v2 Wix Media icon; `watch-world-cup-2026-berlin` was left unchanged.
- Wix: uploaded the fixtures v2 160px icon and updated `BerlinTools Layout Fixes` custom embed `0dd3e5f3-520b-47ae-a995-e767f222265f` to revision 10.

**Opened:** Push this fixtures-icon commit from an authenticated terminal so GitHub Pages-backed data catches up.
**Closed:** Live `/berlin-tools` Playwright QA confirms fixtures uses `725c...` and public-viewing still uses `9add...`.

**Next session should:** Push/QA only the fixtures icon if Yusuf asks; avoid touching the current dirty Ultimate planner files unless that work is active.

## 2026-06-03 — Codex (Ultimate copy weight + natural route story)

**Did:** Made widget explanatory copy read calmer and pushed Ultimate route-story wording away from robotic planner language.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added a copy-weight normalization block so paragraphs, short descriptions, day block copy, plan-index stops, AI story text, resource descriptions, weather chips, essentials notes, and option subtitles use normal weight while headings/labels/CTAs stay bold.
- `ultimate-berlin-trip-planner/index.html` — rewrote local `mockAi=1` and fallback route-story sentences to avoid jargon like `framework`, `layer`, `texture`, `concrete place to land`, and repeated checklist phrasing.
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js` — tightened the Gemini prompt with the same banned phrases and more human Yusuf-style guidance.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — updated the tour recommendation audit to match the new `first Berlin introduction` copy.

**Opened:** None.
**Closed:** Inline script parse passed; `launch-audit.mjs` is back to `152 pass, 0 warn, 0 block`; Velo prepublish gate passed `13 pass`; browser QA on the 7-day mock link showed 7 AI day stories, 7 full days, no old bad phrases, key explanation slots at `font-weight: 500`, and no horizontal overflow.

**Next session should:** Continue Yusuf's visual/content review, then treat PDF polish and triggered-email copy as the next phase once the widget copy feels right.

## 2026-06-03 — Codex (Ultimate local QA state sync)

**Did:** Fixed the confusing local QA mismatch where a URL could say `tripLength=7` while the generated unlocked result still used an older in-page form state.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — extracted `applyQueryParamsToState()` and re-applies query params before build only on local QA surfaces (`qaUnlock`, `mockAi`, or `resetUnlock`), so test/share URLs drive the generated plan reliably without affecting normal live user edits.
- `ultimate-berlin-trip-planner/index.html` — `syncInputsFromState()` now also refreshes the visible arrival-date input.

**Opened:** None.
**Closed:** Browser QA on the 7-day mock link now shows active length `7`, active interests `history/wall/free`, `7` Plan-at-a-glance cards, `7` full day cards, `7` AI day stories, no old repeated phrase, and no horizontal overflow. `launch-audit.mjs` remains `152 pass, 0 warn, 0 block`.

**Next session should:** Keep reviewing route-story copy quality now that the test state is trustworthy.

## 2026-06-03 — Codex (Ultimate route-story voice tuning)

**Did:** Tightened the Ultimate planner AI voice so it reads more like Yusuf explaining the route as a guide, not a planner audit.

**Changed:**
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js` — updated the Gemini prompt to ask for spoken tour-guide route narration, varied day-story rhythm, concrete route details, and to forbid repetitive filler like `its own space` / `rather than a checklist`.
- `ultimate-berlin-trip-planner/index.html` — upgraded `mockAi=1` and local fallback day stories so local QA shows guide-style per-day narration instead of repeated template sentences.

**Opened:** None.
**Closed:** Inline script parse passed; `launch-audit.mjs` remains `152 pass, 0 warn, 0 block`; Velo prepublish gate remains `13 pass, 0 warn, 0 block`; browser QA for the 4-day mock route showed 4 day stories, no old repeated phrase, and no horizontal overflow.

**Next session should:** Continue visual/content review with Yusuf, then move to PDF polish and email template copy once the widget itself feels approved.

## 2026-06-03 — Codex (World Cup tool icons)

**Did:** Optimized Yusuf's World Cup trophy reference into square BerlinTools icons and wired both World Cup tools to those icons.

**Changed:**
- `tools-home/icons/watch-world-cup-2026-berlin.png`, `tools-home/icons/watch-world-cup-2026-berlin-160.png`, `tools-home/icons/world-cup-2026-fixtures-berlin-time.png`, `tools-home/icons/world-cup-2026-fixtures-berlin-time-160.png` — new optimized 512/160 PNG assets from `/Users/yusufucuz/Downloads/Draw_world_cup_icon_reference_202606031909.jpeg`.
- `tools-home/icons/manifest.json` — added manifest entries with GitHub Pages URLs and Wix Media URLs.
- `tools-hub/data.json` — added `image` fields for `watch-world-cup-2026-berlin` and `world-cup-2026-fixtures-berlin-time`.
- Wix: uploaded both 160px icons to Media Manager and updated `BerlinTools Layout Fixes` custom embed `0dd3e5f3-520b-47ae-a995-e767f222265f` to revision 9 with both slugs in the live icon map plus `/berlin-tools`/`/widgets` hub-card generic-icon replacement.

**Opened:** Push this icon commit from an authenticated terminal so GitHub Pages-backed data picks up the new `image` fields durably.
**Closed:** Local data, live `/berlin-tools` cards, and live related-card icon map now use the World Cup trophy icon instead of fallback lettering/generic icons.

**Next session should:** After push, cache-bust and QA the tools hub plus widgets gallery card icons.

## 2026-06-03 — Codex (World Cup blog launch + placement)

**Did:** Published the World Cup Berlin post, wired its two tools into BerlinTools CMS, and promoted it live on `/blog` + homepage.

**Changed:**
- `blog-drafts/where-to-watch-2026-world-cup-in-berlin.md` + `blog-drafts/images/worldcup-berlin/` — local source now has internal links, bolding, and the optimized active visual set.
- `blog-home/data.json`, `blog-index/data.json`, `scripts/generate-blog-index-data.mjs`, `blog-index/blog-index-element.js` — local durable placement now pins the World Cup post and tools on the current local `main`.
- Wix: published post `0d25be5a-4e4a-447d-af5d-a9f1de72206a`; BerlinTools CMS rows live for `watch-world-cup-2026-berlin` and `world-cup-2026-fixtures-berlin-time`; temporary HEAD embeds promote the post live because this Codex environment cannot push GitHub.

**Opened:** Push is still pending from an authenticated terminal; `git push` failed with missing GitHub HTTPS credential and the GitHub connector returned 403 for writes. After push, decide whether to remove temporary Wix embeds `7b593b94-45e8-4bcf-a002-ec308a52f37d` and `da64c566-6258-4839-9601-0e345bfff08c`.
**Closed:** Live post readback has 3 images, 4 embeds, 22 bold marks, and 4 internal BerlinWalk links; `/blog`, homepage, post URL, and both `/tools/*` pages were Playwright/curl verified.

**Next session should:** Push `main` from an authenticated GitHub terminal, wait for GitHub Pages, then QA `/blog` and the homepage with the temporary embeds disabled or removed if the data files are live.

## 2026-06-03 — Claude Code (World Cup 2026 widgets + blog draft)

**Did:** Added two new World Cup widgets and a matching blog draft for the "where to watch the 2026 World Cup in Berlin" angle (Cup is in North America; no Brandenburg fan mile this year; kick-offs mostly Berlin evening/overnight).

**Changed:**
- `worldcup-fixtures/index.html` + `README.md` — full schedule in Berlin time (CEST): 72 group matches grouped by day + knockout calendar, live next-match countdown, filters (All / Germany / Evening-friendly / Today) + jump-to-day. Data inlined as `M`/`KO` arrays. Verified in preview desktop + mobile, no console errors.
- `worldcup-berlin/index.html` + `README.md` — public-viewing venue finder: 12 spots, filters (free / beer garden / by the water / late-night), Maps links, "no fan mile" + 10pm-outdoor-rule note.
- `quick-summary/data.json` + `faq/data.json` — new `world-cup-berlin` entries (render verified at `/quick-summary/?post=world-cup-berlin` and `/faq/?post=world-cup-berlin`).
- `blog-drafts/where-to-watch-2026-world-cup-in-berlin.md` — blog draft (converter-safe: no tables; embeds `{{quick-summary}}`, `{{widget:worldcup-berlin}}`, `{{widget:worldcup-fixtures}}`, `{{faq}}`).
- `tools-hub/data.json` — registered both widgets under Discovery.
- Wix (via `../berlinwalk-content-app/create-worldcup-berlin-draft.mjs`): UNPUBLISHED draft `0d25be5a-4e4a-447d-af5d-a9f1de72206a`.

**Opened:** Not pushed — embeds 404 until `berlinwalk-widgets` is pushed to GitHub Pages. Fixture times from secondary sources; reconfirm vs FIFA. No BerlinTools CMS rows yet for the two `/tools/<slug>` pages.
**Closed:** —

**Next session should:** Push the repo, then review/publish the Wix draft. Optional: add CMS rows + icons for the two new tools.

## 2026-06-03 — Codex (Ultimate widget finalization pass)

**Did:** Implemented the widget-only finalization pass for the Ultimate planner route story, embedded map links, and post-itinerary resource separation.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — changed the AI/Yusuf panel to `Your Local Guide Yusuf's Route Story`, rendering a short intro, per-day storytelling cards, compact weather/tour asides, and chips without letting AI alter deterministic routes, stops, times, or tour slots.
- `ultimate-berlin-trip-planner/index.html` — removed the separate visible `Google Maps pack`; each day now keeps one `Full day route` card and adds small `Open map` links inside meaningful itinerary blocks, while generic dinner/base/rest blocks stay clean.
- `ultimate-berlin-trip-planner/index.html` — added the `After the itinerary` divider after the share/PDF/print actions so transport maps, shopping backups, and Berlin essentials feel clearly separate from the main itinerary.
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js` — updated Gemini prompt/schema to `noteTitle`, `routeIntro`, `dayStories`, `weatherSentence`, `tourSentence`, and `chips`; existing email+arrival quota remains max 2 and email is still excluded from Gemini input.
- `ultimate-berlin-trip-planner/velo/*`, `launch-audit.mjs`, and docs — updated AI fixtures, live smoke checks, launch audit, and Velo handoff text for the new route-story schema.

**Opened:** PDF polish and triggered-email copy updates are intentionally still next-phase work; this pass only verified current PDF/print/copy/WhatsApp actions are not broken.
**Closed:** `launch-audit.mjs` passed `152 pass, 0 warn, 0 block`; Velo prepublish gate passed `13 pass`; AI privacy fixture passed; AI-only dry-run smoke passed; locked/unlocked desktop and mobile browser QA showed no horizontal overflow, no visible `Google Maps pack`, one `Plan at a glance`, inline map links, and working PDF/print triggers.

**Next session should:** Review the live copy feel of the route story with Yusuf, then move to PDF polish and email-template updates once the widget experience is approved.

## 2026-06-03 — Codex (Ultimate post-merge guide note + quota)

**Did:** Implemented the post-merge feedback pass for the Ultimate planner full-plan flow.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — locked flow keeps only the cut Day 1 preview; after unlock the whole preview container disappears and the full plan starts with `Your full Berlin plan`, Yusuf guide note, one `Plan at a glance`, full day cards, then share/PDF/print actions and resource sections.
- `ultimate-berlin-trip-planner/index.html` — added per-day weather chips, moved action buttons after the last day, added Yusuf photo asset `assets/yusuf-local-guide.jpg`, and changed the AI panel to `Your Local Guide Yusuf's Note`.
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js` — changed Gemini schema/prompt to one natural guide paragraph plus weather/tour sentences and short chips; added email+arrival AI quota (`aiRequestCount`, `aiLastRequestedAt`, `aiLimitReachedAt`) without sending email to Gemini.
- `ultimate-berlin-trip-planner/velo/*`, runbook/status/audit files — updated smoke helpers, privacy fixture, prepublish gate, remote preflight fields, install kit, docs, and launch status for the new quota/guide-note flow.
- Live Wix `TripPlannerLeads` collection — synced the 3 new AI quota fields with `create-trip-planner-leads-collection.mjs --live --sync-fields`.

**Opened:** Local code is ready; Yusuf still needs to paste/publish the updated Velo source before testing live Gemini quota behavior.
**Closed:** `launch-audit.mjs` is `152 pass, 0 warn, 0 block`; AI privacy/quota fixture passed including 3rd-call quota suppression; prepublish gate passed `13 pass`; remote preflight passed; Playwright locked/unlocked/mobile QA passed with no horizontal overflow and correct preview/full-plan behavior.

## 2026-06-03 — Codex (Ultimate planner merged visual index)

**Did:** Merged the duplicate `Your first preview` / `Full plan index` experience into one unlocked visual `Plan at a glance` index.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — removed the unlocked dashboard `data-itinerary-overview` module and now renders one image-led `Plan at a glance` day index inside the full plan's `data-day-jump-bar`.
- `ultimate-berlin-trip-planner/index.html` — the merged index uses the new oil-style day art, shows date/anchors, shows compact `Tour 11:30` or `Tour 15:30` pills when applicable, and keeps the existing day-jump scroll behavior.
- `ultimate-berlin-trip-planner/launch-audit.mjs` plus `LAUNCH_STATUS.*` / `LAUNCH_CONTROL_ROOM.html` — updated launch checks and reports for the merged index.

**Opened:** None.
**Closed:** Locked browser QA shows 1 cut Day 1 preview, no `Plan at a glance`, no full days, and PDF disabled. Unlocked QA shows exactly 1 `Plan at a glance`, correct 1/2/4/7 mobile card counts, no broken images, no horizontal overflow, working Day 3 jump/focus, PDF/print enabled, and `launch-audit.mjs` remains `151 pass, 0 warn, 0 block`.

**Next session should:** Continue result-logic review with Yusuf; this change was not pushed or published.

## 2026-06-03 — Codex (Ultimate planner oil-style day art)

**Did:** Replaced the rough wireframe-style itinerary art with a warmer oil-painting/postcard visual set.

**Changed:**
- `ultimate-berlin-trip-planner/assets/day-art/` — added nine optimized 900x600 webp day visuals for arrival, Wall/Cold War, central history, museums, food, low-budget/parks, Potsdam, nightlife, and local streets.
- `ultimate-berlin-trip-planner/index.html` — `DAY_PHOTOS` now uses the local day-art assets, the preview itinerary cards render real images instead of inline SVG art, and day visual classification now keeps low-budget/park days from being misfiled as food.

**Opened:** None.
**Closed:** Inline script parse passed; browser QA shows 7 itinerary images loaded, no broken images, no old itinerary SVG art, no horizontal overflow, and `launch-audit.mjs` remains `151 pass, 0 warn, 0 block`.

**Next session should:** Continue Yusuf's review of the deterministic result logic; this visual pass was not pushed or published.

## 2026-06-03 — Codex (Ultimate local preview server)

**Did:** Restored the local Ultimate Trip Planner preview after Atlas showed `ERR_EMPTY_RESPONSE`.

**Changed:**
- Local only — killed the stale half-responsive Python preview process and restarted `python3 -m http.server 8765 --bind 127.0.0.1` from `berlinwalk-widgets/`.

**Opened:** None.
**Closed:** `curl` now returns `HTTP/1.0 200 OK` for the Ultimate planner URL on `127.0.0.1:8765`.

**Next session should:** Keep using the same localhost URL for visual QA; if Atlas shows `ERR_EMPTY_RESPONSE` again, restart the port 8765 preview server.

## 2026-06-02 — Codex (Ultimate planner AI note + tour visibility)

**Did:** Simplified the optional Gemini output and made the in-trip BerlinWalk recommendation visible as part of the daily itinerary, not as a separate CTA card.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — Gemini now renders only a compact `Local guide note` with why/watch-out/tour-note copy; AI-generated D1/D2/D3 cards are no longer displayed because the deterministic route, dates, stops, and tour slot remain the source of truth.
- `ultimate-berlin-trip-planner/index.html` — `file://` and localhost QA now share a local-preview helper, so `qaUnlock`, `resetUnlock`, `forceLeadError`, `forceAiError`, and `mockAi=1` work for local/file previews but not live domains. File previews without `mockAi=1` now show a small local-only “Gemini is backend-only” note instead of silently disappearing.
- `ultimate-berlin-trip-planner/index.html` — in-trip tour days now show the tour as a normal highlighted time block labelled `BERLINWALK` with the real slot (`11:30-13:30` or summer slot), and the full-plan header/index also names the recommended BerlinWalk day.
- `ultimate-berlin-trip-planner/index.html` — fixed a real logic bug where the anti-repeat/diversify layer could replace a tour-framework day with a normal Wall/Museum variant, silently deleting the BerlinWalk block. Tour framework days are now protected and keep `World Clock` in the map pack.
- `ultimate-berlin-trip-planner/index.html` / `velo/tripPlannerFunnel.js` — mock and live Gemini copy are now constrained to concrete plan-specific notes; tour notes must name the actual provided slot instead of vague “if the slot fits” language.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — updated the QA-param guard from localhost-only to local-preview-only.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.*` and `LAUNCH_CONTROL_ROOM.html` — regenerated after the local audit.

**Opened:** Full live lead/email smoke with a real test inbox and booking smoke are still the next release checks.
**Closed:** Inline script check passed; `launch-audit.mjs` is `151 pass, 0 warn, 0 block`. Browser QA for the 2026-06-11 two-day HBF/east/wall scenario shows Day 2 starts with `BERLINWALK 11:30-13:30`, has one natural tour block, no separate tour marker, AI day cards `0`, and mobile overflow `0`. Localhost `mockAi=1` QA for the 2026-06-04 seven-day Alexanderplatz scenario now shows `Recommended BerlinWalk: Day 2 at 11:30`, a Day 2 `BERLINWALK 11:30-13:30` block, one tour index pill, a specific Gemini/mock tour note, and overflow `0`.

**Next session should:** Continue reviewing the deterministic day-mapping matrix with Yusuf, then run the remaining full live smoke + booking smoke before enabling public visibility.

## 2026-06-02 — Codex (Ultimate planner Gemini QA + listing hold)

**Did:** Tightened the optional Gemini 2.5 Flash layer and cleared the remaining local launch-audit blockers.

**Changed:**
- `ultimate-berlin-trip-planner/` — `tripPlannerAi` remains fail-soft and privacy-scrubbed; `--ai-only` smoke mode now tests the AI endpoint path without creating a lead or sending instant email; latest dry-run evidence is `output/qa/ultimate-trip-planner-live-smoke/dry-run-ai-only-20260602c.json`.
- `ultimate-berlin-trip-planner/index.html` — lead gate now shows one Day 1 preview, keeps full days/PDF/print locked until email, shortens day action copy, moves closing prose into visual close strips, exposes deterministic timeboxes, and keeps BerlinWalk as a natural itinerary block.
- `tools-home/data.json` — removed the draft Ultimate shortcut from the homepage tool grid and switched Hackescher to the local generated 160px icon.
- `ultimate-berlin-trip-planner/WIX_GEMINI_PUBLISH_TR.md` / `LAUNCH_RUNBOOK.md` — added the short Turkish Wix publish checklist plus Gemini 2.5 Flash cost/guardrail notes (`maxOutputTokens: 1200`, `thinkingBudget: 0`, fail-soft deterministic fallback).
- `ultimate-berlin-trip-planner/velo/prepublish-gate.mjs` — bounded Gemini check now explicitly verifies the output token cap as well as response schema, backend-only secret, and missing-key fallback.
- `ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs` and `build-launch-status-report.mjs` — live `--ai` / `--ai-only` smoke now records Gemini token usage and estimated USD cost when the live response includes usage metadata; dry-run evidence is `output/qa/ultimate-trip-planner-live-smoke/dry-run-ai-only-cost-20260602.json`.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.*` — regenerated after Wix publish and latest remote preflight `output/qa/ultimate-trip-planner-remote-preflight/remote-preflight-2026-06-02T19-42-19-932Z.json`: `151 pass, 0 warn, 0 block`, verdict `WAITING FOR LIVE QA`; `tripPlannerAi OPTIONS` is now `204`.
- `output/qa/ultimate-trip-planner-live-smoke/live-ai-only-2026-06-02T19-43-19-550Z.json` — live Gemini AI-only smoke passed without creating a lead or sending email; usage was `853` input tokens + `729` output tokens, estimated `$0.002078`.

**Opened:** Run full live smoke with a real test email, then booking smoke, before public release visibility is enabled.
**Closed:** All local launch-audit blockers are cleared; browser QA on localhost showed locked state has 1 preview, full days 0, PDF/print disabled, and fail-soft unlock opens 2 full days with overflow 0 and no closing prose. Live Gemini AI-only smoke is now green.

**Next session should:** Run `live-smoke-trip-planner.mjs --live --email ... --ai` with Yusuf's test inbox, then `--booking` to prove booked-branch suppression before any public visibility flip.

## 2026-06-02 — Codex (Ultimate planner Gemini prepublish gate)

**Did:** Finished the safety gates around the optional Gemini 2.5 Flash "local second look" layer for Ultimate Trip Planner.

**Changed:**
- `ultimate-berlin-trip-planner/velo/prepublish-gate.mjs` — now verifies `tripPlannerAi`, bounded Gemini backend config, no-email AI payloads, and backend privacy scrub; latest run passed `12/12`.
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js` — Gemini-bound payload text now drops email-like/private-looking text at backend validation before prompt assembly.
- `ultimate-berlin-trip-planner/velo/ai-privacy-fixture.mjs` — new mocked-Wix fixture proves missing Gemini key returns fail-soft and scrubbed Gemini prompts contain no email-like text.
- `ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs` — `--ai` dry-run/live mode now asserts the AI payload contains no lead email, email-like text, or email-shaped key; dry-run evidence written to `output/qa/ultimate-trip-planner-live-smoke/dry-run-ai-privacy-20260602.json`.
- `ultimate-berlin-trip-planner/build-launch-status-report.mjs` and `LAUNCH_STATUS.*` — status now marks the homepage shortcut as `BLOCK` while Ultimate is still draft/protected, and keeps `tripPlannerAi OPTIONS 404` / missing AI smoke as warnings.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — AI endpoint/source/smoke checks remain wired into the launch audit, including a frontend fail-soft invariant that proves AI failure cannot control full-plan/PDF visibility.

**Opened:** Wix still needs `GEMINI_API_KEY` in Secrets plus updated Velo publish before `tripPlannerAi` can pass live smoke; current audit remains `141 pass, 1 warn, 7 block` due older UX/listing/icon/gate blockers.
**Closed:** Prepublish gate proves the AI layer is paste-ready locally: `12/12` pass, message IDs applied, TripPlannerLeads schema verified, AI endpoint safeguards present, no email accepted in the AI payload, backend prompt input is privacy-scrubbed, and `ai-privacy-fixture.mjs` passes.

**Next session should:** Continue the 7 UX launch blockers first, then paste/publish the updated Velo and run `live-smoke-trip-planner.mjs --live --email ... --ai`.

## 2026-06-02 — Codex (Paid landing Custom Element)

**Did:** Added the reusable paid-traffic landing page as a Wix Custom Element.

**Changed:**
- `paid-landing/paid-landing-element.js` — defines `<bw-paid-landing>` with mini trust strip, World Clock hero, live `<bw-booking-calendar>`, trust band, feature cards, full route band, guide section, FAQ, final CTA, sticky mobile CTA, and `bw_booking_*` tracking.
- `paid-landing/index.html` and `paid-landing/README.md` — local/GitHub Pages preview and Wix install instructions.
- `AGENTS.md` — documented the new `paid-landing/` folder.

**Opened:** Push repo and install on a new Wix paid landing page using tag `bw-paid-landing`; hide the normal Wix header/footer for that page.
**Closed:** Local preview at `http://127.0.0.1:4189/paid-landing/` loaded 81 live dates, appended `Oct onward / TBD`, produced a Booking Form URL with `bookings_sessionId` and no `guests=`, fixed CTA text color, and had no mobile horizontal overflow.

**Next session should:** After Pages deploy, verify the GitHub Pages preview and live Wix page in mobile + desktop before sending Meta traffic.

## 2026-06-02 — Codex (Ultimate planner Gemini smoke hardening)

**Did:** Hardened the Ultimate planner Gemini handoff so the new AI endpoint can be verified safely after Wix publish.

**Changed:**
- `ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs` — added `--ai` dry-run/live mode with a sanitized no-email AI payload and `enhancement.localRead` assertion.
- `ultimate-berlin-trip-planner/launch-remote-preflight.mjs`, `launch-audit.mjs`, `build-launch-status-report.mjs`, `LAUNCH_STATUS.*`, `build-launch-control-room.mjs`, and `LAUNCH_CONTROL_ROOM.html` — now check/report `tripPlannerAi` OPTIONS and Gemini smoke evidence.
- `ultimate-berlin-trip-planner/LAUNCH_RUNBOOK.md`, `velo/README.md`, `velo/install-kit.html` — added `GEMINI_API_KEY`, `tripPlannerAi`, and `--ai` smoke instructions.

**Opened:** Latest remote preflight shows `tripPlannerAi OPTIONS 404`; Wix still needs the updated Velo pasted/published and `GEMINI_API_KEY` in Secrets before AI live smoke can pass. Current launch audit remains `138 pass, 1 warn, 7 block` because older UX/listing/icon blockers remain.
**Closed:** `--ai` dry-run wrote `output/qa/ultimate-trip-planner-live-smoke/dry-run-ai-20260602.json` with no email in AI payload; syntax/inline-script/diff checks passed.

**Next session should:** Keep fixing the existing UX launch blockers first, then publish updated Velo and run `live-smoke-trip-planner.mjs --live --email ... --ai`.

## 2026-06-02 — Codex (Booking calendar TBD card)

**Did:** Added a disabled future-season cue at the end of the reusable booking calendar date carousel.

**Changed:**
- `booking-calendar/booking-calendar-element.js` — live availability now appends a final non-clickable card like `Oct onward / TBD / Dates soon` after the last available date and adds a disabled month dropdown option like `October onward - TBD`; hidden in demo mode and opt-out via `hide-future-tbd`.
- `booking-calendar/README.md` — documented the future TBD card.

**Opened:** Push the widget repo and update/pin the Wix script if Yusuf wants this on the live calendar immediately.
**Closed:** Local `/landing` QA showed the card after Sep 30, the disabled dropdown option, `bookings_sessionId` still present, no `guests=` param, and overflow `0`.

**Next session should:** After push/GitHub Pages deploy, verify the live custom Booking Calendar shows the TBD card at the end of the date row.

## 2026-06-02 — Codex (Ultimate planner Gemini polish)

**Did:** Added a fail-soft Gemini 2.5 Flash "local second look" layer after Ultimate planner email unlock, while keeping deterministic itinerary/PDF logic as the source of truth.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — full-plan panel now requests optional AI polish after unlock, hides on failure, supports localhost `mockAi=1` / `forceAiError=1`, and avoids user-facing Gemini jargon.
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js` and `http-functions.js` — added backend-only `tripPlannerAi` endpoint using sanitized non-email payloads, `GEMINI_API_KEY`, `responseJsonSchema`, and `thinkingBudget: 0`.
- `ultimate-berlin-trip-planner/velo/README.md`, `build-velo-install-kit.mjs`, `install-kit.html`, and `RESEARCH_BACKLOG.md` — documented Gemini secret/model override and regenerated paste kit.

**Opened:** Wix live install still needs the new Velo endpoint pasted/published and `GEMINI_API_KEY` added to Wix Secrets before live smoke. Existing launch audit still blocks on older UX/listing/icon/gate items, not the AI layer.
**Closed:** Local mock/fail-soft browser QA passed desktop/mobile overflow `0`; direct Gemini API smoke returned valid schema JSON with `thinkingBudget: 0`.

**Next session should:** Paste/publish the updated Velo only after Yusuf is ready for another live test, then run a real `/_functions/tripPlannerAi` smoke alongside the existing lead smoke.

## 2026-06-02 — Codex (Single-tool related card icons)

**Did:** Fixed live `/tools/*` `More Berlin Tools` cards for newer tools that still showed first-letter icon chips.

**Changed:**
- Workspace `scripts/update-berlintools-layout-icons-embed.mjs` — new reusable Wix Custom Embed updater; reads `tools-hub/data.json`, `tools-home/data.json`, and `tools-home/icons/`.
- Wix: `BerlinTools Layout Fixes` Custom Embed `0dd3e5f3-520b-47ae-a995-e767f222265f` updated to revision 7 with a 36-slug icon map. Known tools without a specific icon currently use a generic inline BerlinWalk SVG (`berlin-day-trips-finder`).
- Root `PROJECT_MEMORY.md` — updated the Custom Code record from revision 6 / 18 icons to revision 7 / current icon map.

**Opened:** None.
**Closed:** Live readback confirmed Currywurst, First-Day Planner, East Side Gallery, Day Trips and generic SVG are in the embed. Browser QA passed for `/tools/hackescher-after-tour-planner`, `/tools/berlin-landmarks-map`, `/tools/berlin-day-trips-finder`, and `/tools/berlin-shopping-areas` with related-card images loading and overflow 0.

**Next session should:** When a new tool icon is added, run the root updater after loading Wix keys so the single-tool related cards stay synced.

## 2026-06-02 — Codex (Blog CTA/banner removal + generic tool image)

**Did:** Removed the old end-of-post tour CTA banner behavior and fixed iconless tool cards.

**Changed:**
- `js/cta-inject.js` — deprecated into a no-op safety shim that removes old `[data-bw-tourcta]` nodes instead of injecting the large tour banner.
- `js/blog-journey-inject.js` — hides old tour CTA nodes, no longer positions the journey module around them, and uses `tools-home/icons/generic-tool.svg` when a related tool has no assigned image.
- `tools-home/icons/generic-tool.svg` — new generic BerlinWalk tool fallback image.
- `tools-home/tools-home-element.js` and `tools-hub/tools-hub-element.js` — iconless tools now render the generic image instead of a first-letter chip.
- `wix-embed-snippets.md`, `README.md`, `AGENTS.md` — documented `blog-journey-inject.js?v=7` and deprecated `cta-inject.js`.

**Opened:** Push the repo, update Wix Custom Code from `blog-journey-inject.js?v=6` to `?v=7`, and remove any explicit old `cta-inject.js` Custom Code entry if still installed. Unrelated Ultimate planner local changes remain untouched.
**Closed:** `node --check`, `git diff --check`, and local Playwright QA passed; Day Trips test post had CTA count 0, `Berlin Day Trip Finder` used `generic-tool.svg`, overflow 0.

**Next session should:** After Pages deploy and Wix Custom Code update, live-check the related-guides area on one blog post desktop/mobile.

## 2026-06-02 — Codex (Day Trips Tropical Islands image swap)

**Did:** Replaced the weak Tropical Islands image in the published Best Day Trips post.

**Changed:**
- `blog-drafts/images/best-day-trips-from-berlin/day-trips-tropical-islands.jpg` — replaced with optimized 1600px Wikimedia image `Südsee Tropical Islands.jpg`, showing the indoor South Sea pool under the hangar.
- `blog-drafts/best-day-trips-from-berlin.md` — updated status/source credit to Technouwe, CC BY-SA 3.0.
- Workspace scripts: `berlinwalk-content-app/replace-day-trips-tropical-image.mjs` uploaded the new image, replaced the live Wix image node, rewrote credits, and publish-synced post `80b60289-cd69-4d4c-ac9b-399ce47c8155`.
- Wix: new media id `5a08a3_d965ce2230ec4f46adef4a6238172749~mv2.jpg`.

**Opened:** Push/commit local source changes if the Day Trips image bundle is being kept in repo; unrelated `tools-home` / `tools-hub` changes remain untouched.
**Closed:** Live Wix API readback shows new Tropical alt text/media id and credits updated.

**Next session should:** Only visual-refresh the live post if the browser cache still shows the old Tropical image.

## 2026-06-02 — Codex (Ultimate planner visibility hold)

**Did:** Pulled the not-yet-ready Ultimate Berlin Trip Planner out of public tool listing surfaces without deleting the widget.

**Changed:**
- `tools-home/data.json` — marked `ultimate-berlin-trip-planner` as `status: draft`, so the homepage/shortcut tools grid filters it out.
- `tools-hub/data.json` — marked `ultimate-berlin-trip-planner` as `status: draft`, so `/berlin-tools`, `/tools`, and `/widgets` listing surfaces filter it out.
- `widgets-hub/SEO_ADDITIONAL_TAGS.md` — regenerated the widgets ItemList from 35 to 34 visible tools.

**Opened:** Push the repo and wait for GitHub Pages before checking live `/berlin-tools` and the shortcut grid.
**Closed:** Local data verification shows Ultimate hidden from both visible tool lists.

**Next session should:** Keep Ultimate in draft/listing-hold until Yusuf signs off on planner UX and logic.

## 2026-06-02 — Codex (Day Trips homepage/blog placement)

**Did:** Put the published Best Day Trips post into the homepage blog teaser and `/blog` index surfaces.

**Changed:**
- `blog-home/data.json` and `blog-home/blog-home-element.js` — featured card is now `best-day-trips-from-berlin`; right-column cards are Public Transport, Shopping, and Berlin Wall map.
- `blog-index/data.json` — regenerated from live Wix Blog; Day Trips is latest[0], first in Practical Berlin, and linked to `berlin-day-trips-finder`.
- `scripts/generate-blog-index-data.mjs` — Day Trips gets Practical Berlin priority, related tool mapping, and a Berlin Day Trip Finder spotlight item.
- Workspace/Wix: `insert-berlin-day-trips-finder.js` inserted BerlinTools CMS item `4e328109-f0dc-47ec-ba5e-95fd45e64ebf`; `/tools/berlin-day-trips-finder` returned 200 after re-save.

**Opened:** Push this repo so GitHub Pages serves the updated `blog-home` and `blog-index` files; local unrelated `ultimate-berlin-trip-planner/*` changes remain untouched.
**Closed:** JSON parse, `node --check`, local Playwright QA for `blog-home` desktop/mobile, and live tool-route 200 check passed.

**Next session should:** After push/Pages deploy, spot-check the live homepage blog teaser, `/blog` latest/Practical shelf, and the Day Trip Finder link from the blog index.

## 2026-06-02 — Codex (Ultimate planner logic review doc)

**Did:** Created a single review surface for the Ultimate Berlin Trip Planner decision logic so Yusuf can audit the itinerary brain in one pass.

**Changed:**
- `ultimate-berlin-trip-planner/PLANNER_LOGIC_REVIEW.md` — documented visible inputs, tour-slot rules, Day 1 branches, day-type queue, core templates, tour framework variants, personalization rules, nearby pause logic, anti-repeat alternatives, place catalog, base logic, and current weak spots.

**Opened:** Yusuf should review the doc and decide on visible `Potsdam / day trip`, tour focus priority, Monday swap aggressiveness, gentle-pause frequency, and copy tone.
**Closed:** Logic review list is now available in one file instead of scattered through UI testing.

**Next session should:** Apply Yusuf's review notes to the planner logic and rerun local long-plan QA.

## 2026-06-02 — Codex (Booking calendar sessionId fix)

**Did:** Fixed the custom Booking Calendar's native Booking Form handoff after Wix showed a €10 payment block, then simplified the calendar to date/time only.

**Changed:**
- `booking-calendar/booking-calendar-element.js` — CTA URL now sends only supported Booking Form params: `bookings_sessionId`, `bookings_timezone`, `bookings_serviceId`, optional `bookings_locationId`, and UTMs; removed unsupported `selected_date`, `selected_time`, `event_id`, and `guests` params from the form URL.
- `booking-calendar/booking-calendar-element.js` — removed guest stepper UI because attendee count stays on the native Wix form's `Number of Attendees` field, and added the note `You'll choose the number of attendees on the next step.`
- `booking-calendar/README.md` — documented that the live endpoint uses Availability Calendar `slot.sessionId`, not Time Slots V2 `eventId`.
- Workspace `berlinwalk-content-app/api/booking-calendar-availability.js` and `scripts/booking-calendar-availability-probe.mjs` — switched to Availability Calendar data; Vercel endpoint redeployed and verified.

**Opened:** Push latest widget commit `62b8427`, wait for GitHub Pages, then retest Wix preview/live. If the form still shows payment after using the real `sessionId`, inspect Wix Booking Form/payment page settings.
**Closed:** Root cause identified: Time Slots V2 `eventId` and Booking Form `bookings_sessionId` are distinct.

**Next session should:** After push/deploy, confirm the generated href contains a `bookings_sessionId` starting with Availability Calendar's `slot.sessionId` and no `guests/event_id/selected_date` params; calendar should not show a guest selector.

## 2026-06-02 — Codex (Day Trips extra images)

**Did:** Added four more licensed images to the already-published Best Day Trips post.

**Changed:**
- `blog-drafts/images/best-day-trips-from-berlin/` — added optimized JPEGs for Leipzig Nikolaikirche, Wittenberg Castle Church, Tropical Islands and Bastei Bridge.
- `blog-drafts/best-day-trips-from-berlin.md` — recorded the extra image status and four additional Wikimedia source/credit lines.
- Workspace script `berlinwalk-content-app/add-day-trips-extra-images.mjs` uploaded the images, inserted them into Wix richContent, rewrote Image credits, and re-published the already-published post to sync live content.

**Opened:** Visual-check the live post; Day Trip Finder CMS row/icon/homepage promotion may still be pending. Unrelated `booking-calendar/booking-calendar-element.js` and `ultimate-berlin-trip-planner/index.html` local modifications remain untouched.
**Closed:** Live Wix post readback: 159 nodes, 7 inline images, 3 HTML embeds; Leipzig/Wittenberg/Tropical/Bastei headings now each have an image immediately after the heading.

**Next session should:** Verify the published page visually and continue any remaining BerlinTools live/CMS/icon steps.

## 2026-06-02 — Codex (Ultimate planner anti-repeat routes)

**Did:** Fixed long Ultimate Berlin Trip Planner plans that repeated the same central anchors under different themes.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added place-memory logic in `buildPlan()` so later days avoid already-used map anchors and switch to theme-specific alternatives when needed.
- `ultimate-berlin-trip-planner/index.html` — added alternative anchors (Holocaust Memorial, Gendarmenmarkt, Nikolaiviertel, Berlin Cathedral, Victory Column, Treptower Park) and route variants for history, Wall, free, and museum days.
- `ultimate-berlin-trip-planner/index.html` — moved Potsdam/slow-day earlier for 5+ day plans, and made arrival-day Wall/Cold War map anchors choose one rain-aware stop instead of showing multiple alternatives as one route.

**Opened:** Continue full UX/content simplification; Potsdam is still automatic in long plans, not yet a visible user-selectable interest.
**Closed:** Local QA passed for the 2026-06-16 / 6-day / history+wall / low-budget / rain+photos / gentle scenario: no Museum Island repeat day, Day 1 no longer shows both Wall Memorial and Topography, Day 2 uses Holocaust Memorial/Gendarmenmarkt/Nikolaiviertel, Day 5 uses Tempelhofer/Treptower/Victory Column, Day 6 includes Potsdam; broken images 0, overflow 0.

**Next session should:** Review the visible long-plan rhythm with Yusuf, then decide whether to add `Potsdam / day trip` as a visible Top interests option.

## 2026-06-02 — Codex (Day Trips embed cache fix)

**Did:** Diagnosed why the Wix editor showed blank/fallback Quick Summary/FAQ widgets for the Day Trips draft.

**Changed:**
- `quick-summary/index.html` and `faq/index.html` — when a `v` URL parameter is present, forward it to `data.json` fetches to bypass stale Wix/Atlas iframe cache.
- Wix: patched draft `80b60289-cd69-4d4c-ac9b-399ce47c8155` HTML embed URLs to `v=20260602b`.
- Workspace: `berlinwalk-content-app/api/_lib/markdown-to-ricos.js` now emits versioned embed URLs for future drafts.

**Opened:** Push this cache fix; after GitHub Pages updates, refresh/reopen the Wix editor draft if it still shows the old blank iframe.
**Closed:** Live GitHub Pages already has `best-day-trips-from-berlin` in QS/FAQ data and the finder URL returns 200; Wix draft API now shows all 3 embed URLs with `v=20260602b`.

**Next session should:** Verify the Wix draft visually, then run the BerlinTools CMS insert if the Day Trip Finder row is still pending.

## 2026-06-02 — Codex (Day Trips Wix draft/images)

**Did:** Finished the Best Day Trips blog post as an unpublished Wix draft with licensed images and SEO.

**Changed:**
- `blog-drafts/best-day-trips-from-berlin.md` — updated status with Wix draft ID `80b60289-cd69-4d4c-ac9b-399ce47c8155`, edit URL, image/SEO completion, and image sources.
- `blog-drafts/images/best-day-trips-from-berlin/` — added optimized JPEGs for Sanssouci cover plus Sachsenhausen, Spreewald and Dresden inline images.
- Workspace scripts: `berlinwalk-content-app/create-day-trips-draft.mjs` and `add-day-trips-blog-images.mjs` created/patched the UNPUBLISHED Wix draft.
- `blog-workplan.md` and root `PROJECT_MEMORY.md` updated from local-only to Wix draft + widget status.

**Opened:** Push widgets repo, visual-QA GitHub Pages finder/map, insert/re-save BerlinTools CMS row, and generate/wire the tool icon before homepage grid promotion. Unrelated `ultimate-berlin-trip-planner/index.html` modification is still present and untouched.
**Closed:** Wix draft exists with 155 Ricos nodes, 3 HTML embeds, Sanssouci cover/OG/Twitter image, 3 inline section images, tags, focus keyword and image credits.

**Next session should:** Push `berlinwalk-widgets`, verify `/berlin-day-trips-finder/` on GitHub Pages, then run `source scripts/load-api-keys.sh && node insert-berlin-day-trips-finder.js` from the workspace root.

## 2026-06-02 — Codex (Day Trips draft + pinned map)

**Did:** Took over the A-tier Best Day Trips task and added a pinned Leaflet map to the Day Trip Finder.

**Changed:**
- `berlin-day-trips-finder/index.html` — added pinned map, Berlin start pin, filtered destination pins/route guide lines, popups, and coordinates for 8 day trips.
- `tools-hub/data.json` / `widgets-hub/SEO_ADDITIONAL_TAGS.md` — added `berlin-day-trips-finder` (Discovery, `embedHeight: 1900`) and regenerated widgets SEO ItemList to 35 tools.
- `blog-drafts/best-day-trips-from-berlin.md`, `quick-summary/data.json`, `faq/data.json`, `faq/inject.js`, `blog-workplan.md` — created publish-ready local draft and wired QS/FAQ/schema under `best-day-trips-from-berlin`.
- Workspace: `insert-berlin-day-trips-finder.js` and `PROJECT_MEMORY.md` updated with local-only status and verified official-source facts.

**Opened:** Visual Browser QA on localhost was blocked by Browser URL policy, so do full visual QA after a safer browser path/push. Push repo, insert/re-save BerlinTools CMS row, create Wix Blog draft with 4 licensed images/SEO, and generate a tool icon before homepage grid promotion. Unrelated `ultimate-berlin-trip-planner/index.html` modification is present and was left untouched.
**Closed:** JSON parse, `faq/inject.js` syntax, CMS helper syntax, widget inline script parse, `git diff --check`, Leaflet CDN HEAD checks, and source/fact checks passed.

**Next session should:** Push `berlinwalk-widgets`, verify GitHub Pages serves the finder with the map, then run `source scripts/load-api-keys.sh && node insert-berlin-day-trips-finder.js` from the workspace root and create the Wix draft/images.

## 2026-06-02 — Codex (Ultimate planner nearby extras)

**Did:** Tightened Ultimate Berlin Trip Planner's "extra stop" logic so add-ons are realistic, nearby, and pace/interest-aware instead of generic volume.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — removed duplicate Optional/Flexible extra behavior; each non-arrival day can now add at most one 30-45 minute nearby pause/option, e.g. coffee break for gentle pace, Museum Island backup for museum days, or Oberbaum/Spree/cafe finish after East Side Gallery.
- `ultimate-berlin-trip-planner/index.html` — added Oberbaum Bridge as a Wall-day nearby map anchor and kept add-ons out of arrival, Potsdam, break-heavy, and afternoon-tour days.

**Opened:** Continue broader Ultimate planner UX/content simplification with Yusuf; no push/live promotion yet.
**Closed:** Local QA passed for Yusuf's July Wall scenario and a gentle/food 2-day scenario: no duplicate extras, no old optional/flexible labels, one 30-45 minute nearby add-on where appropriate, no broken images, overflow 0.

**Next session should:** Review the result rhythm visually with Yusuf and keep refining the actual itinerary intelligence before launch.

## 2026-06-02 — Codex (Booking calendar self-load)

**Did:** Removed the Wix page-code dependency from the custom Booking Calendar install path.

**Changed:**
- `booking-calendar/booking-calendar-element.js` — when no `availability-json` and no `demo` are present, the element now fetches live sanitized slots from `https://berlinwalk-content-app.vercel.app/api/booking-calendar-availability`.
- `booking-calendar/README.md` — documented `availability-endpoint`, `availability-days`, `service-id`, and no-page-code install path.
- External: Content Studio endpoint deployed to Vercel and tested; local commit `d429e92` is ready for Yusuf to push.

**Opened:** Push `d429e92`, wait for GitHub Pages, then preview Wix Custom Booking Calendar with only the Custom Element installed.
**Closed:** Browser smoke passed: self-load returned 81 date buttons, CTA `Reserve your spot`, and href included `bookings_sessionId` + `bookings_timezone`.

**Next session should:** Verify GitHub Pages serves the self-loading JS, then test Wix preview click-through into native Booking Form.

## 2026-06-02 — Codex (Ultimate planner option logic remap)

**Did:** Reworked Ultimate Berlin Trip Planner’s deterministic plan logic so arrival timing, trip length, interests, pace, budget, and plan needs affect the actual day sequence and map anchors.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — late/evening arrivals now become arrival + dinner/rest, not forced sightseeing; one-day plans now use the selected focus; Day 2 tour framework now adapts to museums, Wall / Cold War, food, free, or nightlife interest.
- `ultimate-berlin-trip-planner/index.html` — map packs no longer show “Map stop”; preview itinerary cards use inline visual art/fallback-safe rendering; slow/family plans avoid repeated extra-stop bloat.
- `ultimate-berlin-trip-planner/index.html` — BerlinWalk tour slots now respect Tue-Sat availability plus July 1-Sept 30 double-slot season (`11:30` and `15:30`); CTA, preview, calendar hold, PDF, and day cards read from the chosen slot.

**Opened:** The widget still needs broader UX/content simplification toward a truly “ultimate” final version.
**Closed:** Local browser QA passed for late BER 2-day, museum-focused 1/2-day, Wall 3-day, family low-budget 5-day, Sun/Mon no-tour days, July/Sep `15:30`, and Oct single-slot scenarios: no `Base area`, `Map stop`, or `Tomorrow`; no broken images; overflow 0.

**Next session should:** Review the visible copy density and result-section hierarchy with Yusuf before pushing/publishing.

## 2026-06-02 — Codex (Booking calendar CTA polish)

**Did:** Polished the booking-calendar reassurance note and CTA copy.

**Changed:**
- `booking-calendar/booking-calendar-element.js` — changed the old pill-style “Free to reserve” label into a slim info banner (`Free reservation, no upfront payment`) and changed default CTA to `Reserve your spot`.
- `booking-calendar/index.html` and `booking-calendar/velo/custom-booking-calendar-page.js` — updated explicit CTA label to `Reserve your spot`.
- `booking-calendar/README.md` — documented `Reserve your spot` as recommended CTA.

**Opened:** Native Wix Booking Form preload still needs live validation with selected `eventId` + guest count.
**Closed:** Browser QA passed: old `Continue to form` copy is gone and the reassurance label no longer uses the pill/button class.

**Next session should:** Move to Wix test-page install unless Yusuf spots another local calendar issue.

## 2026-06-02 — Codex (Booking calendar scroll preserve)

**Did:** Removed the remaining date-carousel movement when clicking a visible future date.

**Changed:**
- `booking-calendar/booking-calendar-element.js` — date/time/guest clicks now preserve the carousel `scrollLeft`; only month changes align to the selected month. Removed CSS smooth scrolling from the date strip so programmatic restoration is instant.

**Opened:** Native Wix Booking Form preload still needs live validation with selected `eventId` + guest count.
**Closed:** Browser QA passed: August select then Aug 4/Aug 5 clicks kept `scrollLeft` fixed at 2622 at 50ms/300ms/900ms; no visible date-strip motion.

**Next session should:** Move to Wix test-page install unless Yusuf spots another local calendar issue.

## 2026-06-02 — Codex (Booking calendar scroll fix)

**Did:** Fixed the date carousel jumping back to the beginning after selecting a day in later months.

**Changed:**
- `booking-calendar/booking-calendar-element.js` — selected-date alignment now sets carousel scroll directly and repeats once after layout without smooth animation, removing the visible reset/jump.

**Opened:** Native Wix Booking Form preload still needs live validation with selected `eventId` + guest count.
**Closed:** Local QA passed: selecting August, then Aug 5, stays in August and shows Aug 4-7 rather than jumping back to June.

**Next session should:** Continue calendar polish only if Yusuf spots more UI issues; otherwise move to Wix test-page install.

## 2026-06-02 — Codex (Booking calendar month jump)

**Did:** Polished `<bw-booking-calendar>` for long-range booking before the Wix test-page install.

**Changed:**
- `booking-calendar/booking-calendar-element.js` — added compact month select, removed slot capacity labels, hardened selected-date reset/scroll alignment.
- `booking-calendar/index.html` — removed the visible live-status/debug line and now fetches 365 days of live availability.
- `booking-calendar/velo/*`, `booking-calendar/README.md`, and root scripts — Velo/local probe/dashboard availability windows now use 365 days.

**Opened:** Native Wix Booking Form preload still needs live validation with selected `eventId` + guest count.
**Closed:** Local QA passed: live API returned 145 slots / 81 dates through 2026-09-30; no “spots” or debug status visible; September jump works and shows 11:30/15:30.

**Next session should:** Move the current Velo scaffold into a Wix test custom Booking Calendar page and verify form routing.

## 2026-06-02 — Codex (Tools hub oil-painting banners)

**Did:** Regenerated all four `/berlin-tools` category hero banners as refined oil-painting images using Yusuf's ChatGPT browser session.

**Changed:**
- `tools-hub/assets/category-banners/*-oil-banner-2400x600.{jpg,webp}` — new Tickets & Money, Weather & Timing, Maps & Practical, and Discovery & Planning banner assets.
- `tools-hub/data.json` — category `bannerImage` / `bannerFallbackImage` fields now point to the oil-painting v2 files.
- Workspace `PROJECT_MEMORY.md` + root `SESSION_LOG.md` — recorded the v2 banner state; raw images live under `output/imagegen/tools-hub-oil-banners-20260602/`, QA contact sheet under `output/qa/tools-hub-oil-banners-20260602/contact-sheet.png`.

**Opened:** Push/deploy still needed for GitHub Pages and live `/berlin-tools`.
**Closed:** Local image generation/download/processing completed; old photo-style banner files remain in place as fallback history.

**Next session should:** After push/deploy, live-QA the four category banners on `https://www.berlinwalk.com/berlin-tools`.

## 2026-06-02 — Claude Code (East Side Gallery post + mural-guide widget)

**Did:** Built the `east-side-gallery-murals` card-guide widget and the `east-side-gallery-berlin-guide` blog draft (A-tier; no existing ESG post).

**Changed:**
- `east-side-gallery-murals/index.html` — new card-list guide of 12 famous ESG murals (title + German + artist + meaning + "Look for"), theme filter (politics/fall/hope/love). Local QA: filters correct (politics 3, fall 5, hope 5, love 3, all 12), desktop+mobile overflow 0, console clean. Mural data verified via Wikipedia + Stiftung Berliner Mauer.
- `tools-hub/data.json` — entry added (Discovery, `embedHeight: 1980`); 34 tools.
- `blog-drafts/east-side-gallery-berlin-guide.md` — full ~1500-word draft (focus keyword "East Side Gallery"; ESG facts verified: 1,316 m, 1990, 118 artists/21 countries, 2009 repaints, 1991 monument).
- `blog-workplan.md` — ESG marked draft+widget.
- Workspace: `insert-east-side-gallery-murals.js` (ready CMS insert), PROJECT_MEMORY.md row 33 + note.

After Yusuf's first push, live steps ran: widget served by GitHub Pages (200); CMS row inserted (`45e311b3-7597-4273-99de-b5268c5113fd`), `/tools/east-side-gallery-murals` 200; Wix draft created UNPUBLISHED (`8d4ba163-4852-4ab0-b2e1-e1f1a832633f`, 75 nodes, 3 embeds, 2 categories) and patched with 4 licensed images (cover Fraternal Kiss; inline Worlds People / Test the Rest / Oberbaumbrücke), focus keyword "East Side Gallery", OG/Twitter image:alt, 3 blog tags. QS/FAQ added to `quick-summary/data.json`, `faq/data.json`, `faq/inject.js` under key `east-side-gallery`.

**Opened:** (1) Push `berlinwalk-widgets` AGAIN — QS/FAQ + inject.js edits landed after the first push, so the post's quick-summary/FAQ embeds are empty until the second deploy. (2) Yusuf reviews + publishes the UNPUBLISHED draft. (3) Generate + wire a tool icon for `east-side-gallery-murals`.
**Closed:** Widget + QA + tools-hub + blog draft + CMS insert + Wix draft creation + 4 images + full SEO + QS/FAQ wiring.

**Next session should:** After the second push deploys, spot-check the draft's quick-summary/FAQ embeds populate, then let Yusuf publish.

## 2026-06-02 — Codex (Booking calendar live availability)

**Did:** Replaced the booking-calendar availability handoff with the verified Wix Bookings Time Slots V2 path and made the local preview load real Wix slots.

**Changed:**
- `booking-calendar/booking-calendar-element.js` — handles Wix local Berlin datetime strings without client-timezone shifting.
- `booking-calendar/index.html` — `/calendar` preview now loads live availability from the local dashboard API and falls back to demo slots if unavailable.
- `booking-calendar/velo/custom-booking-calendar-page.js` and `booking-calendar/velo/backend/bookingCalendarAvailability.jsw` — frontend/backend Velo scaffold using Time Slots V2 without exposing API keys.
- `booking-calendar/README.md` — updated install, slot shape, secret, and local probe notes.

**Opened:** Need live Wix custom Booking Calendar test page to confirm native Booking Form query params for selected `eventId` + guest count.
**Closed:** API uncertainty closed: local probe loaded 59 live slots across 38 dates for 2026-06-02 to 2026-08-01.

**Next session should:** Install the `.jsw` backend and page code in Wix, set the `berlinwalk-wix-api-key` Wix Secret, and verify selected slot routing to the native Booking Form.

## 2026-06-02 — Codex (Ultimate Day 1 base logic)

**Did:** Fixed the Ultimate Trip Planner's BER/non-central arrival-day logic so Day 1 no longer shows a “tomorrow” itinerary card or the BerlinWalk tour route when the tour is moved to Day 2.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added base-area Day 1 copy/place logic, changed Day 1 map places from fixed World Clock/Museum Island/Hackescher to stay-area-specific stops, removed visible `Map stop` labels from web/PDF map cards, and softened remaining preview/ops copy from central/core to base/simple.
- Local QA — `git diff --check` and inline script parse passed. In-app Browser confirmed Yusuf's BER midday / 2-day / Prenzlauer Berg scenario has no Day 1 “Tomorrow” block, no Day 1 tour block, Day 1 maps show Alexanderplatz/Kulturbrauerei/Kastanienallee, Day 2 carries BerlinWalk at 11:30, `Map stop` labels are gone, and horizontal overflow is `0`.

**Opened:** Continue one-by-one Ultimate UX fixes with Yusuf; no push/live promotion yet.
**Closed:** Current Day 1 vs Day 2 tour-placement/map-pack mismatch is fixed locally.

**Next session should:** Review the local `v=day1-base-fix-20260602` state with Yusuf, then keep simplifying the remaining full-plan sections that still feel busy.

## 2026-06-02 — Codex (Audio tour tool icon)

**Did:** Generated and wired the missing icon for `Berlin in 9 Minutes (Free Audio Tour)`.

**Changed:**
- `tools-home/icons/free-berlin-audio-tour.png` and `tools-home/icons/free-berlin-audio-tour-160.png` — new no-text 3D audio-walk icon generated through Yusuf's ChatGPT browser session.
- `tools-hub/data.json` — `free-berlin-audio-tour` now points to the GitHub Pages 160px icon URL instead of falling back to the `B` chip.
- `tools-home/icons/manifest.json` — recorded source/model/path metadata.
- Workspace `PROJECT_MEMORY.md` — corrected the audio-tour CMS item ID and recorded the icon note.

**Opened:** Push/deploy still needed for live `/berlin-tools` to load the icon if this entry is not yet pushed.
**Closed:** Local QA passed: JSON valid, `git diff --check` clean, icon source downloaded from ChatGPT browser and optimized to 512/160.

**Next session should:** After GitHub Pages deploy, live-QA `/berlin-tools` at the Discovery section and confirm the `B` placeholder is gone.

## 2026-06-01 — Codex (Tools hub category banners)

**Did:** Added GPT-generated thin hero banners above the four `/berlin-tools` category sections.

**Changed:**
- `tools-hub/assets/category-banners/` — new 2400x600 JPG/WebP banners for Tickets & Money, Weather & Timing, Maps & Practical, and Discovery & Planning.
- `tools-hub/data.json` — category objects now include `bannerImage`, `bannerFallbackImage`, and `bannerAlt`.
- `tools-hub/index.html` and `tools-hub/tools-hub-element.js` — render category banners above headings; category banners load eager; mobile H1/card-title wrapping hardened.
- Workspace `PROJECT_MEMORY.md` — recorded local banner state.

**Opened:** Push `berlinwalk-widgets` so GitHub Pages and live `/berlin-tools` get the new banner assets/code.
**Closed:** Local QA passed: JSON valid, `node --check` clean, in-app Browser loaded 4/4 WebP banners, desktop 1280 + mobile 390 overflow `0`, 33 tool cards still present.

**Next session should:** After push/deploy, live-QA `/berlin-tools` and confirm banners load from GitHub Pages under the Wix page.

## 2026-06-01 — Codex (Ultimate itinerary/tour logic)

**Did:** Simplified the full-plan day cards into clear itinerary blocks and corrected arrival-day tour eligibility for 09:00+ arrivals outside the central start zone.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — removed the extra locked-preview intro card; arrival-day 11:30 now works only before 09:00, or 09:00-10:00 from Alexanderplatz / Mitte hotel base. BER/Hbf/car/non-central stays move the tour into Day 2. Day 2 now gets a real BerlinWalk itinerary block when the tour is postponed, day maps stay inside each day card, evening blocks render as part of the itinerary, and summer/weather-aware extra blocks add realistic daylight or rain-backup flexibility.
- Local QA — `git diff --check` and inline script parse passed. In-app Browser confirmed the Hbf afternoon scenario keeps Day 1 as arrival logistics, puts BerlinWalk on Day 2 at 11:30-13:30, removes the old preview intro, keeps full plan locked pre-email, and shows no horizontal overflow or console errors.

**Opened:** Continue one-by-one Ultimate UX fixes with Yusuf; no push/live promotion yet.
**Closed:** Current tour-placement and too-short day-card issue is fixed locally.

**Next session should:** Review `v=tour-logic-20260601b` locally, then continue simplifying remaining unlocked sections if they still feel busy.

## 2026-06-01 — Claude Code (Brandenburg Gate post + Berlin Landmarks Map widget)

**Did:** Built the reusable `berlin-landmarks-map` widget and the `brandenburg-gate-berlin-visitors-guide` blog draft (A-tier head-term capture; no existing Brandenburg Gate post).

**Changed:**
- `berlin-landmarks-map/index.html` — new Leaflet map, 19 central landmarks, "What do you want to see?" filter (landmark/history/museum/view); tour-linked star pins (World Clock, TV Tower, Rotes Rathaus, Berliner Dom, Museum Island, Humboldt Forum, Hackescher Markt). Local QA: filters correct (landmark 9, history 6, museum 4, view 5, all 19), popups render, desktop+mobile overflow 0, console clean.
- `tools-hub/data.json` — added entry (Maps, `embedHeight: 820`); 33 tools.
- `blog-drafts/brandenburg-gate-berlin-visitors-guide.md` — full draft (metadata, Quick Summary, body, FAQ; focus keyword "Brandenburg Gate"; facts web-verified: 1788-1791 Langhans, Quadriga 1793 Schadow, Napoleon 1806/1814, U5+S Brandenburger Tor, Reichstag dome registration).
- `blog-workplan.md` — Brandenburg Gate marked draft+widget; A/B-tier tourist-capture ideas queued.
- Workspace: `insert-berlin-landmarks-map.js` (ready CMS insert), PROJECT_MEMORY.md tool row 32 + note.

After Yusuf's first push, live steps ran: widget served by GitHub Pages (200); CMS row inserted (`6873d057-dcda-46db-be1f-1c26342a9d04`), `/tools/berlin-landmarks-map` 200; Wix draft created UNPUBLISHED (`400e4670-e4df-4b2f-a252-067338a69af9`) and patched with 4 licensed images (cover blue-hour CC0, inline Pariser Platz / Wall 1989 PD / Quadriga), focus keyword + SEO + OG/Twitter image:alt + 3 blog tags. QS/FAQ added to `quick-summary/data.json`, `faq/data.json`, `faq/inject.js` under key `brandenburg-gate`.

**Opened:** (1) Push `berlinwalk-widgets` AGAIN — QS/FAQ + inject.js edits landed after the first push, so the post's quick-summary/FAQ embeds are empty until the second deploy. (2) Yusuf reviews + publishes the UNPUBLISHED draft. (3) Generate + wire a tool icon for `berlin-landmarks-map`.
**Closed:** Widget + QA + tools-hub + blog draft + CMS insert + Wix draft creation + 4 images + full SEO + QS/FAQ wiring.

**Next session should:** After the second push deploys, spot-check the draft's quick-summary/FAQ embeds populate, then let Yusuf publish.

## 2026-06-01 — Codex (Ultimate gate flow + collapsed lists)

**Did:** Reworked the Ultimate Trip Planner preview gate so email capture comes after a short Day 1 teaser instead of deep inside the Day 1 preview, and shortened the unlocked utility lists.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — preview now shows a plan intro plus only the start of Day 1, then the blurred lock area and email form; removed the old preview flow rows before the gate. Transport maps, shopping notes, and Berlin essentials now show only the first item by default with `Show more` / `Show less` toggles.
- Local QA — `git diff --check` and inline script parse passed. In-app Browser confirmed locked full plan stays hidden, lead panel is not inside `.bw-preview-day`, preview flow rows are gone, all three long lists show one item by default, toggles expand correctly, and console errors are empty.

**Opened:** Continue one-by-one Ultimate UX fixes with Yusuf; no push/live promotion yet.
**Closed:** Current gate-order issue and long unlocked list issue are fixed locally.

**Next session should:** Review the locked gate flow in the in-app browser at `v=gate-collapse-20260601`, then continue copy/visual simplification.

## 2026-06-01 — Codex (Reusable booking calendar)

**Did:** Added a reusable `<bw-booking-calendar>` component so the paid landing page and future Wix custom Booking Calendar pages can share the same compact calendar UI.

**Changed:**
- `booking-calendar/booking-calendar-element.js` — new light-DOM Custom Element with demo/JSON availability slots, visible date-carousel arrows/fade, date/time selection, guest stepper, UTM-preserving continue link, custom change/continue events, and 60-day default demo range (`demo-days` configurable, capped at 120).
- `booking-calendar/index.html` — standalone preview for local QA and dashboard route `/calendar`.
- `booking-calendar/velo/custom-booking-calendar-page.js` — Velo scaffold for binding Wix Bookings availability into the component and routing to the Wix Booking Form.
- `booking-calendar/README.md` — install/attribute/event notes.

**Opened:** Live Wix custom calendar POC still needs to verify the current availability API (old `availabilityCalendar.queryAvailability()` vs Time Slots V2), real availability shape, and the exact Booking Form query params before publish.
**Closed:** Local component preview and landing-page use smoke-tested with no console errors or horizontal overflow; the date row now clearly indicates horizontal scrolling and demo mode reaches beyond short-notice dates.

**Next session should:** Install this on a Wix custom Booking Calendar test page, bind real `wix-bookings.v2` availability, and validate that selected slot + guest count land correctly in the native Booking Form.

## 2026-06-01 — Codex (Ultimate map copy cleanup)

**Did:** Reworded a technical Google Maps label in the Ultimate Trip Planner day map pack.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — changed `Place anchor` to `Map stop` in day map cards and softened route detail from `with the day anchors` to `with today's stops`.
- Local QA — `git diff --check` and inline script parse passed; Browser confirmed the visible Google Maps pack now shows `Day route` and `Map stop` labels.

**Opened:** Continue copy simplification pass; there are still other `anchor` phrases elsewhere if Yusuf wants the whole vocabulary softened.
**Closed:** The visible `Place anchor` label is removed locally.

**Next session should:** Continue one-by-one visible copy fixes in the local widget.

## 2026-06-01 — Codex (Ultimate loading animation)

**Did:** Made the Ultimate Trip Planner “planning” state feel more polished while the preview is generated.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — replaced the static three loading chips with a one-row step timeline (`Arrival`, `Route`, `Maps/PDF`) that highlights each step in sequence while the spinner continues; added a synced progress underline and mobile-specific sizing so the row does not collapse.
- Local QA — `git diff --check` and inline script parse passed. In-app Browser confirmed the row stays one line on the narrow viewport, labels do not truncate, the active step rotates, and console errors are empty.

**Opened:** Continue one-by-one Ultimate UX fixes with Yusuf; no push/live promotion yet.
**Closed:** Planning animation pass implemented locally.

**Next session should:** Keep the local widget open at the planning-motion state and continue the next visible polish item.

## 2026-06-01 — Codex (Ultimate emoji icon repair)

**Did:** Fixed the Ultimate Trip Planner emoji icons that were rendering tiny/off-center after the SVG-to-emoji cleanup.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added scoped emoji/icon CSS so resource, map, tour marker, close-card, route-step, form-option, and essentials icons render centered at predictable sizes; changed the emoji span box back to `1em` so inline chips no longer stretch and force vertical text.
- Local QA — `git diff --check` and inline script parse passed. In-app Browser confirmed transport/resource icons, essentials icons, day-map icons, and the Day 2 BerlinWalk tour marker render centered; console error check returned no errors.

**Opened:** Continue one-by-one Ultimate UX fixes with Yusuf; no push/live promotion yet.
**Closed:** Broken emoji icon alignment and the day-close chip vertical-text side effect are fixed locally.

**Next session should:** Continue visual simplification from the local icon-fix state and review the remaining full-plan sections one at a time.

## 2026-06-01 — Codex (Ultimate tour timing rule)

**Did:** Fixed the arrival-day BerlinWalk recommendation rule so BER/late-morning arrivals are not pushed into an impossible 11:30 tour.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — split arrival time options into `Before 09:00`, `09:00-10:00`, `10:00-14:30`, `14:30-18:00`, and `After 18:00`; added `arrivalDayTourEligible()` so arrival-day 11:30 is recommended only before 09:00, plus the one-day/non-BER 09:00-10:00 exception. Multi-day 09:00+ BER arrivals now move the tour anchor to Day 2; one-day BER/late arrivals avoid forcing the tour.
- Local QA — `git diff --check` and inline script parse passed. Browser QA confirmed BER 09:00-10:00 / 4-day preview says Day 2, unlocked Day 1 has no 11:30 tour block, and Day 2 has the BerlinWalk tour marker; Hbf 09:00-10:00 / 1-day still keeps arrival-day 11:30.

**Opened:** Continue one-by-one UX fixes with Yusuf; full launch audit currently has an unrelated homepage-icon manifest block in this dirty working tree.
**Closed:** Arrival-day tour timing logic corrected locally.

**Next session should:** Keep reviewing from `v=tour-timing-20260601` and address the next visible issue one at a time.

## 2026-06-01 — Codex (Tools icon alignment)

**Did:** Bound Yusuf-approved Gemini/Banana 2 icons after the first Shopping icon looked too close to Sunday and Hackescher looked off-style.

**Changed:**
- `tools-home/icons/berlin-shopping-areas*.png` — approved bag + pin icon for Berlin Shopping Areas.
- `tools-home/icons/berlin-sunday-shopping*.png` — redrawn as a shopping cart icon so it no longer matches Shopping Areas.
- `tools-home/icons/hackescher-after-tour-planner*.png` — accepted map + pin icon.
- `tools-hub/data.json`, `tools-home/data.json`, `tools-home/icons/manifest.json` — wired Wix Media URLs `5a08a3_74592b7cad724f7a8ab863b56e407afd~mv2.png`, `5a08a3_328a5cc9dfb141ae98fe2a8d4fd0746a~mv2.png`, and `5a08a3_8505101d30c84fd78e7ed5ecdd4f371f~mv2.png`.
- Local QA — `output/qa/icon-alignment-banana2-20260601-bound-set.png` plus `output/qa/icon-alignment-banana2-20260601/tools-hub-bound.png` and `tools-home-bound.png`; JSON validation and `git diff --check` passed.

**Opened:** Push `berlinwalk-widgets` so GitHub Pages serves the updated icon files/data.
**Closed:** Shopping/Sunday/Hackescher visual mismatch is fixed locally and uploaded to Wix Media.

**Next session should:** After push, live-QA `/tools`, `/widgets`, and the homepage tools strip.

## 2026-06-01 — Codex (Ultimate emoji gate cleanup)

**Did:** Applied Yusuf's latest Ultimate Trip Planner feedback: all visible utility icons now use emoji, the locked preview is a simpler Day 1 cutoff, and the email gate is tighter.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — central icon renderer now returns emoji spans instead of SVG icons; hero feature chips, option icons, preview rows, locked fade rows, delivery cards, reminder dots, weather icon, share/action icons, and full-plan utility icons now render as emojis. Removed the visible unlock-button label in the fade, removed the consent checkbox in favor of implicit legal copy, kept full plan/PDF/print locked until email, simplified preview rows (`Start central`, `First useful anchor`, `Rest of plan`), removed the bottom "More Berlin planning tools" block, and renamed the share button to `Copy plan link to share`.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — updated the timebox guard to match the new simplified locked preview instead of the old `Timing` chip layout.
- Local QA — `git diff --check`, inline script parse, and launch audit passed (`143 pass, 0 warn, 0 block`). In-app Browser locked flow: 1 preview day, full plan hidden, no consent input, no old unlock label, no visible SVG utility icons, emoji icons present, legal copy present. Fail-soft email unlock: full plan visible, 4 full day cards, PDF/print enabled, lead/fade hidden.

**Opened:** Yusuf still needs to review the local `emoji-gate-20260601` state before any push or live promotion.
**Closed:** Latest gate/icon simplification pass is implemented locally.

**Next session should:** Continue visual simplification from the local URL, especially the full-plan resource/document sections if Yusuf still finds them busy.

## 2026-06-01 — Codex (Shopping post distribution)

**Did:** Generated and wired a proper Berlin Shopping Areas icon, then promoted the now-published shopping post across local homepage/blog data.

**Changed:**
- `tools-home/icons/berlin-shopping-areas.png` and `tools-home/icons/berlin-shopping-areas-160.png` — new gpt-image-1.5 3D icon matching the existing tools style; 512 icon uploaded to Wix Media (`5a08a3_27134c41481a4ef1ab116aa6700b9464~mv2.png`).
- `tools-hub/data.json`, `tools-home/icons/manifest.json`, and `widgets-hub/{widgets-hub-element.js,index.html}` — `berlin-shopping-areas` now has the Wix icon URL; `/tools` uses it in cards and `/widgets` now renders tool icons in card headers.
- `blog-home/data.json` — shopping post added as the first right-column homepage blog teaser.
- `scripts/generate-blog-index-data.mjs` and `blog-index/data.json` — shopping maps to `Practical Berlin` and related tool `berlin-shopping-areas`; data regenerated from live Wix Blog, placing `shopping-in-berlin` in Latest/allPosts and the Practical shelf.
- Workspace `insert-berlin-shopping-areas.js` — source related blog switched to `/post/shopping-in-berlin`.
- Wix CMS: BerlinTools item `0f235bae-71fb-44db-a2eb-132abef64589` re-saved with the new related blog.
- Local QA screenshots: `output/qa/shopping-distribution-20260601/`.

**Opened:** Push `berlinwalk-widgets` so GitHub Pages serves the new icon/data changes; then live-QA `/berlin-tools`, `/widgets`, homepage blog teaser, and `/blog`.
**Closed:** Icon, homepage blog teaser placement, blog-index placement, and BerlinTools related-blog update are complete locally/remotely as applicable.

**Next session should:** Push/deploy and verify live surfaces with cache-busting if needed.

## 2026-06-01 — Codex (Shopping blog images + SEO)

**Did:** Continued the `shopping-in-berlin` blog after Claude hit the limit; completed the Wix draft's image and SEO package.

**Changed:**
- `blog-drafts/images/shopping-in-berlin/*.jpg` — four optimized Wikimedia Commons source images are present locally (KaDeWe, Tauentzienstraße, Hackesche Höfe, Mauerpark flea market).
- `blog-drafts/shopping-in-berlin.md` — recorded real Wix draft ID and image/SEO status.
- Workspace `berlinwalk-content-app/add-shopping-blog-images.mjs` — retained as the one-off uploader/patcher with Wikimedia source URLs + license URLs for all four credits.
- Wix Blog: draft `6c6b71d2-ba58-4265-8506-a36e301679dd` remains `UNPUBLISHED`; patched with KaDeWe cover/featured/OG/Twitter image, 3 inline images, image credits, excerpt, SEO title/meta, focus keyword `shopping in Berlin`, 5 keywords, and tags `Shopping in Berlin`, `Berlin Flea Markets`, `Berlin Travel Tips`.
- Root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded that live QS/FAQ data contains `shopping-in-berlin` and the stale second-push blocker is closed.

**Opened:** Yusuf still needs to review/publish the Wix draft. Optional: generate a tool icon; after publish, update the BerlinTools relatedBlog and re-save the CMS row.
**Closed:** Image upload, inline placement, alt text, SEO/tags, and API readback verification.

**Next session should:** Review the Wix draft in the editor, publish when approved, then live-QA the public post URL.

## 2026-06-01 — Codex (Ultimate feedback cleanup gate)

**Did:** Applied Yusuf's latest local UX feedback for the Ultimate Trip Planner: simpler first-time choice, cleaner interest wording, stricter preview gate, and clearer unlocked-plan styling.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — changed `Mixed group` to `Long time ago`, renamed `Berlin Wall` to `Berlin Wall / Cold War`, removed the top result glance cards and technical `Start rule`/`Map layer` stats, reduced the weather panel to a compact mini box, moved the email gate directly under a blurred preview continuation, shortened lead benefit chips to `PDF`/`Link`/`Maps`/`Tips`, kept the reminder timeline hidden in the gate, and restyled the unlocked full-plan section as a separate document-like area. Full plan remains locked before email/QA unlock.
- Local in-app Browser QA — normal locked flow shows 2 preview day cards, full plan hidden, compact weather, two-column lead chips on narrow viewport, and no `Mixed group`/`Start rule`/`Map layer`; QA unlock shows 4 full days, 4 transport map cards, 6 shopping cards, 8 essentials, overflow `0`.
- `PROJECT_MEMORY.md` — recorded the feedback pass and that emails remain unchanged until Yusuf accepts the widget.

**Opened:** Yusuf still needs to review this local iteration; do not push or update email copy until he accepts the widget direction.
**Closed:** Latest requested text/structure cleanup is implemented locally; `node ultimate-berlin-trip-planner/launch-audit.mjs` is `143 pass, 0 warn, 0 block`; `git diff --check` is clean.

**Next session should:** Show Yusuf the local URL with `resetUnlock=1`, collect the next UX pass, and only then decide whether to push/live-promote.

## 2026-06-01 — Claude Code (Berlin Shopping Areas widget + blog draft)

**Did:** Built a new `berlin-shopping-areas` BerlinTools map widget and a `shopping-in-berlin` blog draft to capture the high-intent "where to shop in Berlin" search that existing posts #17 (souvenirs) and #61 (Sunday hours) miss.

**Changed:**
- `berlin-shopping-areas/index.html` — new Leaflet map, 19 spots, "What are you shopping for?" filter (fashion & malls / concept & boutiques / vintage / flea markets / souvenirs); tour-linked pins (Alexa, Hackesche Höfe, Ampelmann) render as yellow stars; uses `../css/brand.css` + `../js/brand.js`. Local preview QA: filters correct (markets 5, vintage 8, all 19), popups render, desktop + mobile overflow 0, console clean.
- `tools-hub/data.json` — added the widget entry (Maps category, `embedHeight: 820`, no icon yet). Now 32 tools.
- `blog-drafts/shopping-in-berlin.md` — full draft: metadata, widget plan, Quick Summary, body with internal links (#17, #61, #40, #16, #88, booking), and FAQ content. Focus keyword "shopping in Berlin". Facts verified by web search (Galeries Lafayette closed Aug 2024, KaDeWe open/renovated, VAT non-EU min 50.01 EUR @ 19%, flea-market Sundays).
- Workspace: `insert-berlin-shopping-areas.js` (ready-to-run CMS insert, slug preflight + re-save), plus PROJECT_MEMORY.md tool note + table row 31.

After Yusuf's first push, the live steps ran: widget is served by GitHub Pages (200); BerlinTools CMS row inserted (`0f235bae-71fb-44db-a2eb-132abef64589`), `/tools/berlin-shopping-areas` returns 200; Wix Blog draft created UNPUBLISHED (`6c6b71d2-ba58-4265-8506-a36e301679dd`, 82 nodes, 3 embeds). QS/FAQ content added to `quick-summary/data.json`, `faq/data.json`, and `faq/inject.js` (SLUG_MAP + SCHEMAS) under key `shopping-in-berlin`.

**Opened:** (1) Push `berlinwalk-widgets` AGAIN — the QS/FAQ + inject.js edits landed after the first push, so the post's quick-summary/FAQ embeds are empty until the second deploy. (2) Yusuf reviews + publishes the UNPUBLISHED draft. (3) Generate + wire a tool icon for `berlin-shopping-areas`. (4) After publish, switch `insert-berlin-shopping-areas.js` relatedBlog to `/post/shopping-in-berlin` and re-save.
**Closed:** Widget build + QA + tools-hub wiring + blog draft markdown + CMS insert + Wix draft creation + QS/FAQ data wiring.

**Next session should:** After the second push deploys, spot-check the draft's quick-summary + FAQ embeds populate, then let Yusuf publish.

## 2026-06-01 — Codex (Ultimate build-gate + hero revision)

**Did:** Reworked the local Ultimate widget into an explicit build-flow preview gate, then applied Yusuf's second cleanup feedback on form density and full-plan resource sections.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — results start hidden, `Build my Berlin plan` triggers a short planning animation, preview appears before lead capture, full plan/PDF/print stay locked until unlock, full plan adds Berlin transport map resources and shopping notes, plan detail cards are cleaner, simple PDF logo/header overlap guards were tightened, and the hero now points to `assets/berlin-trip-planner-hero.jpg`. Follow-up cleanup: visible option mini descriptions are hidden, trip-length duplicate number badges are hidden, `Planning priorities` is renamed to `Plan needs`, old localStorage unlock is cleared and unlock persistence is session-only, and transport/shopping resource cards now have smaller icons plus distinct blue/amber section treatments.
- `ultimate-berlin-trip-planner/assets/berlin-trip-planner-hero.jpg` — optimized from `/Users/yusufucuz/Downloads/BerlinTripPlanner.png` to 1200x900 JPEG, 452 KB.
- `ultimate-berlin-trip-planner/launch-audit.mjs`, `LAUNCH_STATUS.*`, and `LAUNCH_CONTROL_ROOM.html` — updated/generated for the build-gate, preview gate, transport/shopping, and PDF guard checks; latest audit is `143 pass, 0 warn, 0 block`.
- `output/qa/ultimate-trip-planner-ui/form-simplify-20260601/` — QA for the second cleanup pass: visible `1 day`, option subtexts hidden, `Plan needs` visible, old `Planning priorities` absent, preview-only lock intact, post-unlock resources visible, resource icons smaller, overflow `0`.
- `output/qa/ultimate-trip-planner-ui/acceptance-20260601/completion-audit.md` — added a requirement-by-requirement evidence map for Yusuf's feedback.
- Root `PROJECT_MEMORY.md` and `SESSION_LOG.md` — recorded that this is local-only and emails remain unchanged until Yusuf approves.

**Opened:** Yusuf still needs to inspect the local widget before push/live promotion or any email-copy update.
**Closed:** The requested featured-image swap is done and browser-smoked locally with mobile overflow `0`; acceptance QA under `output/qa/ultimate-trip-planner-ui/acceptance-20260601/` passed desktop/mobile build-animation preview-only lock; form cleanup QA under `output/qa/ultimate-trip-planner-ui/form-simplify-20260601/` passed; lead-gate QA under `output/qa/ultimate-trip-planner-ui/lead-gate-20260601/` passed invalid email, missing consent, fail-soft unlock, and post-unlock transport/shopping/PDF availability; real 4-page PDF QA downloaded/rendered under `output/qa/ultimate-trip-planner-pdf/build-gate-20260601/` with logo, transport maps, shopping notes, Berlin Essentials, and day-by-day plan present, and stale `Map actions` / `Place:` / `Note:` text absent.

**Next session should:** Show Yusuf `http://127.0.0.1:8765/ultimate-berlin-trip-planner/?context=tool&date=2026-06-15&tripLength=4&resetUnlock=1&v=form-cleanup-20260601`, collect UX feedback, then push only after acceptance.

## 2026-05-31 — Codex (Ultimate CTA/photo correction)

**Did:** Corrected the simplified Ultimate widget after Yusuf clarified that BerlinWalk should be a natural itinerary recommendation, not a standalone in-widget CTA.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — hid the empty tour action slot, removed standalone tour CTA rendering from the active flow, restored the Day 1 `BerlinWalk` itinerary block at the first feasible `11:30` slot, and kept PDF/print free of optional tour-card sections.
- `ultimate-berlin-trip-planner/assets/sanssouci-palace-potsdam.jpg` and `ultimate-berlin-trip-planner/ASSET_SOURCES.md` — added a sourced public-domain Sanssouci Palace image for the Potsdam/slow-day card.
- `ultimate-berlin-trip-planner/launch-audit.mjs`, `build-launch-status-report.mjs`, `UX_REVISION_HOLD.md`, and `LAUNCH_STATUS.*` — keep the simplified-UX hold active; latest audit is `139 pass, 0 warn, 0 block`.

**Opened:** Continue UX simplification before republishing the SEO blog; the local widget still needs Yusuf's final acceptance before push/live promotion.
**Closed:** Standalone visible tour CTA is gone from active UI/PDF/print; Wall, food, local, and Potsdam photo mismatches are corrected locally.

**Next session should:** Review the local `simple-v2` planner in the browser with Yusuf, then decide whether the remaining form/result density is calm enough to push.

## 2026-05-31 — Codex (Monthly placement/widgets updated)

**Did:** Updated the local widgets that surface the monthly Berlin guides across posts, `/blog`, and the homepage.

**Changed:**
- `months-nav/data.json` — all 12 month cards now have `status: "published"` and correct post slugs: Jan-May 2027, June legacy, Jul-Dec 2026.
- `scripts/generate-blog-index-data.mjs` — treats month slugs as `when-to-visit`, pins all 12 month guides in calendar order, and raises the Month-by-Month shelf limit to 12.
- `blog-index/data.json` — regenerated from Wix Blog API; local index has newest 100 posts and a 12-post Month-by-Month Berlin shelf.
- `blog-home/data.json` and `blog-home/blog-home-element.js` — homepage teaser now features October, December, January, and May monthly guides.

**Opened:** Push the repo so GitHub Pages serves the updated JSON/JS; then QA one live monthly post, `/blog`, and the homepage.
**Closed:** Local widget data/link updates for the monthly post series.

**Next session should:** Push `berlinwalk-widgets`, wait for deploy, then verify the live month-nav widget no longer shows `COMING SOON` for the published months.

## 2026-05-31 — Codex (Monthly posts published)

**Did:** Completed the missing SEO fields Yusuf flagged, published all 8 monthly posts, and verified live URLs.

**Changed:**
- `blog-drafts/berlin-in-{october,november,december}-2026.md` and `blog-drafts/berlin-in-{january,february,march,april,may}-2027.md` — changed Wix status to `PUBLISHED`.
- `months-nav/data.json` — Jan-May and Oct-Dec now point to the live `berlin-in-...` slugs with `status: "published"`.
- `blog-index/data.json` — regenerated from Wix Blog API after publish; current local feed has newest 100 posts.
- Root `/Users/yusufucuz/Documents/New project/publish-wix-monthly-blog-drafts.mjs` — added publish helper that patches focus keyword, tag IDs, cover alt text, OG/Twitter image tags + image alt tags, then publishes via Wix Blog Draft Posts API.
- Wix Blog: published October `055f887a-271e-4a3f-97e8-566c37af7aab`, November `3f5d104d-1008-46dc-acff-5a9b5ad9c14b`, December `b350cea6-1d1d-4dd8-b8a6-146b66873a45`, January `219c9483-fe16-4fff-93c4-e6ab82373b65`, February `295b35d2-4f6e-4149-92a4-e7aeeb768a34`, March `77515780-5b89-42ce-a4b9-5cb4bf669be9`, April `cbc1c7ca-9099-4e9a-a282-1b64963298f9`, May `a091d844-238b-45a4-a913-5233563f1e40`.

**Opened:** Push `berlinwalk-widgets` so `months-nav/data.json` and `blog-index/data.json` go live on GitHub Pages; then spot-check the months-nav embed on one live monthly post.
**Closed:** Monthly post SEO completion and Wix publishing.

**Next session should:** Push the widget repo, wait for GitHub Pages, and QA one live monthly post plus `/blog` index data.

## 2026-05-31 — Codex (Monthly Wix drafts created)

**Did:** Continued Claude's monthly blog series handoff by creating/verifying the Wix Blog draft package for the remaining months.

**Changed:**
- `blog-drafts/berlin-in-{october,november,december}-2026.md` and `blog-drafts/berlin-in-{january,february,march,april,may}-2027.md` — filled Wix draft IDs; corrected May's missing `## Draft` marker and moved `Berlin Weather in May` to the proper section.
- Root `/Users/yusufucuz/Documents/New project/create-wix-monthly-blog-drafts.mjs` — added a dry-run-first uploader that parses monthly drafts, uploads/caches images, inserts 7 embeds, limits SEO keywords to Wix's 5-keyword max, and skips existing drafts.
- Wix Blog: all 8 monthly drafts are `UNPUBLISHED`, have cover images and 7 embeds; November-May public source sections were removed from Wix body while image credits remain. IDs: Oct `055f887a-271e-4a3f-97e8-566c37af7aab`, Nov `3f5d104d-1008-46dc-acff-5a9b5ad9c14b`, Dec `b350cea6-1d1d-4dd8-b8a6-146b66873a45`, Jan `219c9483-fe16-4fff-93c4-e6ab82373b65`, Feb `295b35d2-4f6e-4149-92a4-e7aeeb768a34`, Mar `77515780-5b89-42ce-a4b9-5cb4bf669be9`, Apr `cbc1c7ca-9099-4e9a-a282-1b64963298f9`, May `a091d844-238b-45a4-a913-5233563f1e40`.

**Opened:** Preview and publish the monthly drafts in order October → November → December → January → February → March → April → May; after publishing, update month nav/blog index as needed and live-QA URLs.
**Closed:** Wix draft creation for the missing monthly series.

**Next session should:** Start with October draft preview/publish QA, then proceed through the queue one post at a time.

## 2026-05-31 — Codex (Ultimate post-push QA)

**Did:** Verified Yusuf's push and GitHub Pages deployment for Ultimate's public visibility release.
Follow-up: audited the unpublished Wix Blog draft for publish readiness.

**Changed:**
- `SESSION_LOG.md` — recorded the post-push QA handoff.
- GitHub Pages: commit `67d7928` deployed successfully; live `tools-hub/data.json` now returns 31 public items with Ultimate no longer `draft`; `widgets-hub/SEO_ADDITIONAL_TAGS.md` now has `numberOfItems: 31` and Ultimate at position 15.
- Browser QA: `/tools/ultimate-berlin-trip-planner`, `/berlin-tools`, and `/widgets` passed desktop 1365px and mobile 390px/319px checks with Ultimate visible, expected iframes/cards present, and horizontal overflow `0`.
- Wix Blog: draft `b1915fa5-dfcf-4427-bcfc-d9a6665208e7` remains `UNPUBLISHED`, has 176 nodes, 3 correct embeds, no published duplicate, no competitor-note leak, and live Quick Summary/FAQ DOM render with overflow `0`.

**Opened:** Publish Wix Blog draft `b1915fa5-dfcf-4427-bcfc-d9a6665208e7`; add homepage shortcut later only if Yusuf wants it.
**Closed:** Push/deploy verification and live desktop/mobile distribution QA.

**Next session should:** Publish the already-audited Wix Blog draft from Yusuf's logged-in Wix editor, then live-QA the post URL.

## 2026-05-31 — Codex (Ultimate live publish verified)

**Did:** Completed the live launch checks for Ultimate after Yusuf published Velo.
Follow-up: created the unpublished Wix Blog draft for the Ultimate SEO article, then reran post-publish preflight after Yusuf published `jobs.config`.

**Changed:**
- `tools-hub/data.json` — removed the Ultimate draft visibility flags through `release-visibility.mjs --write`; homepage shortcut remains held out of `tools-home/data.json`.
- `widgets-hub/SEO_ADDITIONAL_TAGS.md` — regenerated ItemList SEO with 31 public widgets including Ultimate.
- `ultimate-berlin-trip-planner/launch-remote-preflight.mjs`, `launch-audit.mjs`, `build-launch-status-report.mjs`, `LAUNCH_STATUS.*`, and `LAUNCH_CONTROL_ROOM.html` — updated post-release gates/status; audit now passes `139 pass, 0 warn, 0 block` and status verdict is `PUBLIC TOOL LIVE - HOMEPAGE HELD`.
- `blog-drafts/ultimate-berlin-trip-planner.md` — recorded Wix Blog draft `b1915fa5-dfcf-4427-bcfc-d9a6665208e7`; root script `create-wix-ultimate-trip-planner-blog-draft.mjs` created it with 176 nodes and 3 embeds.
- Wix: live smoke passed for `/_functions/tripPlannerLead` and `/_functions/tripPlannerBooking`; BerlinTools CMS item `ee335453-9278-4b7e-a3d6-ffb2889bdfbc` is inserted/re-saved and the live tool page returns 200.

**Opened:** Push repo changes; live GitHub Pages still reports Ultimate as `draft` in `tools-hub/data.json`, while local `tools-hub/` and `widgets-hub/` QA already shows Ultimate visible, 31 widget iframes, and overflow `0`. After push, QA `/tools/ultimate-berlin-trip-planner`, `/berlin-tools`, and `/widgets`; add the homepage shortcut only after final page QA; review/publish the SEO blog draft after tool QA.
**Closed:** Velo publish QA, live lead/booking smoke, CMS row insert/re-save, and local visibility release.

**Next session should:** Push `berlinwalk-widgets`, wait for GitHub Pages, open the live tool/tools/widgets pages on desktop/mobile, and then move to the blog publish package.

## 2026-05-31 — Codex (Ultimate email IDs applied)

**Did:** Applied Yusuf's five real Wix Triggered Email IDs to the Ultimate Trip Planner funnel and advanced the launch state to live QA.

**Changed:**
- `ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json` — added the ignored local ID file from Yusuf's five IDs.
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js` — replaced the five `TODO_TRIP_PLANNER_*` placeholders with the real message IDs.
- `ultimate-berlin-trip-planner/velo/install-kit.html`, `LAUNCH_CONTROL_ROOM.html`, and `LAUNCH_STATUS.*` — regenerated after `run-email-id-launch-gate.mjs --write`.
- Root `PROJECT_MEMORY.md` and root `SESSION_LOG.md` — recorded that the ID blocker is closed.

**Opened:** Ultimate is waiting for Wix Velo publish/live smoke: paste/publish Backend/tripPlannerFunnel.js, http-functions handlers, and jobs.config, then live-test `tripPlannerLead` and `tripPlannerBooking`.
**Closed:** Triggered Email ID gate passed with `Ready for next launch step: YES`; launch audit is `132 pass, 1 warn, 0 block`.

**Next session should:** Use `ultimate-berlin-trip-planner/velo/install-kit.html` for the Wix paste/publish step, then run `launch-remote-preflight.mjs` and live smoke before releasing public visibility.

## 2026-05-31 — Codex (Ultimate booking-email correction)

**Did:** Removed the duplicate booked-path Ultimate email sequence after Yusuf pointed out the existing site booking automation already handles booked guests.

**Changed:**
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js` — removed `bookedMessageId` branches; instant planner email can still send from the normal planner path, while future 7/3/1/day-of Ultimate reminders are suppressed for official or self-reported booked leads.
- `ultimate-berlin-trip-planner/email/build-triggered-email-html.mjs`, `email/README.md`, and regenerated `email/paste-ready/*` — active package now has 5 planner/sales templates only, deletes stale booked generated HTML, and warns not to create booked-path planner templates.
- `ultimate-berlin-trip-planner/velo/booking-aware-fixture.mjs`, `simulate-email-sequence.mjs`, `prepublish-gate.mjs`, `launch-audit.mjs`, Velo/runbook/setup docs, `LAUNCH_STATUS.*`, `LAUNCH_CONTROL_ROOM.html`, `velo/install-kit.html`, `RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md`, and root `SESSION_LOG.md` — updated the launch gates and handoff from 10 IDs/booked branch to 5 IDs/booked suppression.
- Deleted active `email/booked-e*.md` source drafts.
- Browser: copy-kit reload confirmed 5 cards, `0/5` counters, no `_BOOKED` placeholders, existing booking-sequence warning, and overflow `0`.

**Opened:** `email/paste-ready/message-ids.local.json` is still missing; 5 real Wix Triggered Email IDs remain the blocker before Velo publish and live smoke.
**Closed:** Duplicate booked-path planner email risk is removed. QA passed generator syntax, `.mjs` syntax checks, booking suppression fixture, booked sequence simulator, Browser copy-kit smoke, ID checker total `5`, and launch audit `131 pass, 1 warn, 1 block`.

**Next session should:** Create/collect the 5 Wix Developer Tools Triggered Email URLs/IDs and run the email-ID launch gate.

## 2026-05-31 — Codex (Ultimate copy-kit layout fix)

**Did:** Fixed the copy-kit layout bug where the `Message ID JSON` panel let card/code text appear behind it while scrolling.

**Changed:**
- `ultimate-berlin-trip-planner/email/build-triggered-email-html.mjs` and regenerated `email/paste-ready/copy-kit.html` — removed sticky positioning from the JSON panel, kept the setup checklist textarea compact, added an email-card guide before the card grid, and made `Next missing template` close the checklist before scrolling to the next card.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, and `LAUNCH_CONTROL_ROOM.html` — regenerated after audit.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md`, and root `SESSION_LOG.md` — updated handoff state.
- Browser: reloaded the local copy-kit and confirmed `jsonPosition: relative`, checklist height `220`, overflow `0`, open checklist stays contained, and next-card jump closes the checklist.

**Opened:** `email/paste-ready/message-ids.local.json` is still missing; 10 real Wix Triggered Email IDs remain the blocker before Velo publish and live smoke.
**Closed:** Copy-kit overlap/behind-scroll issue is fixed. QA passed generator syntax, targeted `diff --check`, Browser layout/jump smoke, and launch audit `131 pass, 1 warn, 1 block`.

**Next session should:** Create/collect the 10 Wix Developer Tools Triggered Email URLs/IDs and run the email-ID launch gate.

## 2026-05-31 — Codex (Ultimate launch blocked on IDs)

**Did:** Rechecked whether the final launch blocker had changed.

**Changed:**
- No widget files changed in this pass beyond this log entry.
- Ran `check-triggered-email-ids.mjs`: `message-ids.local.json` still missing, `0/10` valid IDs, `0/10` applied.
- Checked `~/Downloads`: no `message-ids*.json` file present.

**Opened:** Ultimate is now genuinely blocked on the external Wix step: create 10 Developer Tools Triggered Email templates, collect their editor URLs/message IDs, and generate/import `message-ids.local.json`.
**Closed:** Launch audit remains `131 pass, 1 warn, 1 block`; the remaining block is only the 10 real Triggered Email IDs.

**Next session should:** Once `message-ids.local.json` exists or is downloaded, run the email-ID launch gate dry-run, then `source ../scripts/load-api-keys.sh` and rerun with `--write`.

## 2026-05-31 — Codex (Ultimate email checklist export)

**Did:** Added a single checklist export for the remaining 10-template Wix setup.

**Changed:**
- `ultimate-berlin-trip-planner/email/build-triggered-email-html.mjs` and regenerated `email/paste-ready/*` — added `setup-checklist.txt` plus an embedded `One-page setup checklist` panel and `Copy checklist` button inside `copy-kit.html`.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — added required-file and copy-kit guards for the setup checklist.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, and `LAUNCH_CONTROL_ROOM.html` — regenerated after audit.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md`, and root `SESSION_LOG.md` — updated handoff state.

**Opened:** `email/paste-ready/message-ids.local.json` is still missing; 10 real Wix Triggered Email IDs remain the blocker before Velo publish and live smoke.
**Closed:** QA passed: generator/audit syntax, targeted `diff --check`, launch audit `131 pass, 1 warn, 1 block`, rendered `setup-checklist.txt`, and Browser copy-kit smoke with checklist panel, Copy checklist button, first/final template coverage, checklist length `3866`, 10 template-name inputs, 10 Copy name buttons, `Next: template 1/10`, 48 buttons, 42 copy buttons, and overflow `0`.

**Next session should:** Use the open copy-kit checklist to create the 10 Wix Developer Tools Triggered Email templates, collect URLs/IDs, then run the email-ID launch gate.

## 2026-05-31 — Codex (Ultimate copy-kit sequence)

**Did:** Upgraded the email copy kit so the manual Wix template creation step is less fiddly.

**Changed:**
- `ultimate-berlin-trip-planner/email/build-triggered-email-html.mjs` and regenerated `email/paste-ready/*` — added `Wix template name` copy fields for all 10 templates, a `Next missing template` navigator, updated generated README numbering, and kept the Developer Tools / no automation workflow warning.
- `ultimate-berlin-trip-planner/WIX_EMAIL_SETUP_TR.md` — updated the Turkish workflow to use the new `Copy name` button before subject/preheader/HTML.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — added copy-kit guards for template names and the next-template navigator.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html`, `RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md`, and root `SESSION_LOG.md` — regenerated/updated handoff state.

**Opened:** `email/paste-ready/message-ids.local.json` is still missing; 10 real Wix Triggered Email IDs remain the blocker before Velo publish and live smoke.
**Closed:** QA passed: generator/audit syntax, targeted `diff --check`, launch audit `130 pass, 1 warn, 1 block`, and Browser copy-kit smoke with 10 template-name inputs, 10 Copy name buttons, first name `Ultimate Planner - Sales - Instant Plan`, `Next: template 1/10`, 47 buttons, 41 copy buttons, and overflow `0`. The next-button click automation timed out in the in-app browser, but the control is present and layout/state checks passed.

**Next session should:** Use the open copy-kit page to create the 10 Wix Developer Tools Triggered Email templates, collect URLs/IDs, then run the email-ID launch gate.

## 2026-05-31 — Codex (Ultimate email-ID handoff)

**Did:** Reduced the remaining launch risk around the manual Triggered Email ID step.

**Changed:**
- `ultimate-berlin-trip-planner/email/build-triggered-email-html.mjs` and regenerated `email/paste-ready/*` — copy-kit, paste-ready README, and individual HTML comments now explicitly say to use Wix Developer Tools -> Triggered Emails, not automation workflows.
- `ultimate-berlin-trip-planner/WIX_EMAIL_SETUP_TR.md` — added the direct local copy-kit URL and the same Developer Tools / no workflow warning.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — added guards that the copy kit and Turkish handoff include the warning.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, and `LAUNCH_CONTROL_ROOM.html` — regenerated after a fresh read-only remote preflight.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md`, and root `SESSION_LOG.md` — updated handoff state.
- Browser: opened `http://127.0.0.1:8765/ultimate-berlin-trip-planner/email/paste-ready/copy-kit.html` for Yusuf; smoke found the warning text, 36 buttons, 31 copy buttons, 32 textareas, and overflow `0`.

**Opened:** `email/paste-ready/message-ids.local.json` is still missing; 10 real Wix Triggered Email IDs remain the blocker before Velo publish and live smoke.
**Closed:** Fresh remote preflight wrote `output/qa/ultimate-trip-planner-remote-preflight/remote-preflight-2026-05-31T14-40-53-892Z.json`: GitHub Pages reachable, Wix tool URL not live yet, Velo endpoints unpublished, BerlinTools slug free, and `TripPlannerLeads` PASS with 74 fields. Launch audit remains `130 pass, 1 warn, 1 block`.

**Next session should:** After Yusuf finishes the copy-kit ID collection, run `node ultimate-berlin-trip-planner/velo/run-email-id-launch-gate.mjs --import-downloads`, then `source ../scripts/load-api-keys.sh` and rerun with `--write`.

## 2026-05-31 — Codex (Ultimate planner logic)

**Did:** Added a compact `Planner logic` layer so users can see the rules behind the generated trip.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added Planner logic UI after Trip load map, with 6 visual rule cards, responsive wrapping, text export, print view, and PDF cover export.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — added a guard that Planner logic reaches UI, text, print, and PDF.
- `ultimate-berlin-trip-planner/LAUNCH_CONTROL_ROOM.html`, `LAUNCH_STATUS.md`, and `LAUNCH_STATUS.json` — regenerated after audit.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md`, and root `SESSION_LOG.md` — updated handoff state.
- `output/qa/ultimate-trip-planner-ui/planner-logic-20260531/` and `output/qa/ultimate-trip-planner-pdf/planner-logic-20260531/` — desktop/mobile screenshots, crops, downloaded PDF, rendered pages, and contact sheet.

**Opened:** Ultimate is still draft/unpublished; 10 real Triggered Email IDs remain the hard blocker before Velo publish and live smoke.
**Closed:** QA passed: inline script parse, desktop/mobile Playwright checks with 6 cards and overflow `0`, real 7-day PDF download, `pypdfium2` render/contact sheet, text extraction for Planner logic + Trip load map + Essentials, targeted `diff --check`, and launch audit `130 pass, 1 warn, 1 block`.

**Next session should:** Either stop polishing and do the Triggered Email ID/Velo live-smoke launch path, or add only a clearly higher-value visual layer.

## 2026-05-31 — Codex (Ultimate trip load map)

**Did:** Added a visual `Trip load map` so the planner reads like an operations board, not only an itinerary.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added Trip load map UI after Plan at a glance, with day cards, load/move bars, buffer/watch chips, route links, mobile wrapping fixes, text export, print view, and PDF cover export.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — added a guard that the load map reaches UI, text, print, and PDF.
- `ultimate-berlin-trip-planner/LAUNCH_CONTROL_ROOM.html`, `LAUNCH_STATUS.md`, and `LAUNCH_STATUS.json` — regenerated after audit.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md`, and root `SESSION_LOG.md` — updated handoff state.
- `output/qa/ultimate-trip-planner-ui/load-map-20260531/` and `output/qa/ultimate-trip-planner-pdf/load-map-20260531/` — desktop/mobile screenshots, crops, downloaded PDF, rendered pages, and contact sheet.

**Opened:** Ultimate is still draft/unpublished; 10 real Triggered Email IDs remain the hard blocker before Velo publish and live smoke.
**Closed:** QA passed: inline script parse, desktop/mobile Playwright checks with 7 cards and overflow `0`, mobile crop after title-wrap fix, real 7-day PDF download, `pypdfium2` render/contact sheet, text extraction for Trip load map + Essentials, targeted `diff --check`, and launch audit `129 pass, 1 warn, 1 block`.

**Next session should:** Continue final UX/PDF polish if Yusuf wants another "ultimate" pass, otherwise move to Triggered Email ID handoff and Velo live smoke.

## 2026-05-31 — Codex (Ultimate email sequence simulator)

**Did:** Added a dry-run-only email sequence simulator so the scheduler can be inspected before Velo publish.

**Changed:**
- `ultimate-berlin-trip-planner/velo/simulate-email-sequence.mjs` — new CLI covering instant, minus7, minus3, minus1, day-of, `--job-date`, `--hour`, and `--booked` branches without network/API calls.
- `ultimate-berlin-trip-planner/velo/README.md` — documented simulator commands and evidence path.
- `ultimate-berlin-trip-planner/build-launch-control-room.mjs`, `build-launch-status-report.mjs`, `LAUNCH_CONTROL_ROOM.html`, and `LAUNCH_STATUS.*` — added sequence-simulator command shortcuts and regenerated generated artifacts.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — added required-file and behavior guard for scheduler branch simulation.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md`, and root `SESSION_LOG.md` — updated handoff state.
- `output/qa/ultimate-trip-planner-email-sequence/` — sales, due-minus3, and booked-day-of-after-18 fixture outputs.

**Opened:** Ultimate is still draft/unpublished; 10 real Triggered Email IDs remain the hard blocker before Velo publish and live smoke.
**Closed:** QA passed: script/build/audit syntax checks, sales sequence fixture, due-now `minus3` fixture, booked day-of after-18 suppression fixture, generated launch artifacts, targeted `diff --check`, and launch audit `128 pass, 1 warn, 1 block`.

**Next session should:** Continue UX/PDF polish if Yusuf wants another "ultimate" pass, otherwise move to Triggered Email ID handoff and Velo live smoke.

## 2026-05-31 — Codex (Ultimate lead report)

**Did:** Added a dry-run-first/read-only lead report so Ultimate's collected funnel data can be inspected after launch.

**Changed:**
- `ultimate-berlin-trip-planner/velo/report-trip-planner-leads.mjs` — new report script with dry-run fixtures, live Wix Data read mode, masked emails by default, `--include-emails`, priority leads, upcoming arrivals, trip-style/conversion-tier breakdowns, and send-error summary.
- `ultimate-berlin-trip-planner/velo/README.md` — documented post-launch lead report commands and privacy behavior.
- `ultimate-berlin-trip-planner/build-launch-control-room.mjs`, `build-launch-status-report.mjs`, `LAUNCH_CONTROL_ROOM.html`, and `LAUNCH_STATUS.*` — added lead-report command shortcuts and regenerated generated launch artifacts.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — added required-file and behavior guard for the lead report.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md`, and root `SESSION_LOG.md` — updated handoff state.
- `output/qa/ultimate-trip-planner-lead-report/` — dry-run fixture report and live read-only report evidence.

**Opened:** Ultimate is still draft/unpublished; 10 real Triggered Email IDs remain the hard blocker before Velo publish and live smoke.
**Closed:** QA passed: script syntax, dry-run report with 5 fixtures / 2 priority leads / 2 upcoming arrivals / 1 send error, live read-only report with 0 current rows before Velo publish, targeted `diff --check`, and launch audit `126 pass, 1 warn, 1 block`.

**Next session should:** Continue UX/PDF polish if Yusuf wants another "ultimate" pass, otherwise move to Triggered Email ID handoff and Velo live smoke.

## 2026-05-31 — Codex (Ultimate trip style lead segment)

**Did:** Turned the new Trip Style Shortcuts from UI-only presets into a funnel segment.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `tripStyleForLead()` and sends `tripStyle` with the lead payload / lead-submit analytics.
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js`, `create-trip-planner-leads-collection.mjs`, `prepublish-gate.mjs`, `launch-remote-preflight.mjs`, `live-smoke-trip-planner.mjs`, `velo/README.md`, and `velo/install-kit.html` — store/expose `tripStyle`, include it in smoke payloads, and gate it as a critical collection field.
- `ultimate-berlin-trip-planner/email/*`, `email/paste-ready/*`, and `email/README.md` — instant sales/booked emails now include `Planner style: ${tripStyle}` and paste-ready HTML was regenerated.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html`, `RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md`, and root `SESSION_LOG.md` — regenerated/updated handoff state.
- Wix: synced live `TripPlannerLeads` to add `tripStyle`; latest remote preflight reports 74 fields and critical fields verified.

**Opened:** Ultimate is still draft/unpublished; 10 real Triggered Email IDs remain the hard blocker before Velo publish and live smoke.
**Closed:** QA passed: inline script parse, Velo/Node syntax checks, targeted `diff --check`, paste-ready email regeneration, in-app Browser `Food + nightlife` preset smoke with overflow `0`, dry-run live-smoke payload containing `tripStyle`, prepublish collection gate PASS, and launch audit `124 pass, 1 warn, 1 block`.

**Next session should:** Continue UX/PDF polish if Yusuf wants another "ultimate" pass, otherwise move to Triggered Email ID handoff and Velo live smoke.

## 2026-05-31 — Codex (Ultimate trip style shortcuts)

**Did:** Added four visual one-click presets so users can start from a realistic trip style instead of tuning every field manually.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `TRIP_PRESETS`, preset matching/apply helpers, synced form-state rendering, and responsive `Trip style shortcuts` cards below Plan Inputs.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — added a guard for the preset layer and state-sync hook.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html`, `RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md`, and root `SESSION_LOG.md` — regenerated/updated handoff state.
- `output/qa/ultimate-trip-planner-ui/trip-presets-20260531/` — desktop/mobile screenshots plus in-app Browser preset-state smoke.

**Opened:** Ultimate is still draft/unpublished; 10 real Triggered Email IDs remain the hard blocker before Velo publish and live smoke.
**Closed:** QA passed: inline script parse, targeted `diff --check`, launch audit, desktop/mobile visual checks, and in-app Browser click smoke. `Food + nightlife` correctly switched stay area to east, selected wall/food/nightlife interests, set packed pace, kept overflow `0`, and status updated to `Food + nightlife applied. Adjust any detail below.` Launch audit is `123 pass, 1 warn, 1 block`.

**Next session should:** Continue UX/PDF polish if Yusuf wants another "ultimate" pass, otherwise move to Triggered Email ID handoff and Velo live smoke.

## 2026-05-31 — Codex (Ultimate visual header polish)

**Did:** Made the Ultimate first viewport more visual by replacing the plain green text header with a real-photo route hero.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `data-hero-visual`, a two-column/stacked hero with Museum Island photo, feature chips, compact route cue, and mobile route-pill refinements.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — added a launch guard for the real Berlin visual hero.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html`, `RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md`, and root `SESSION_LOG.md` — regenerated/updated handoff state.
- `output/qa/ultimate-trip-planner-ui/visual-hero-20260531/` — desktop/mobile Chrome screenshots; in-app Browser metrics confirmed loaded image and overflow `0`.

**Opened:** Ultimate is still draft/unpublished; 10 real Triggered Email IDs remain the hard blocker before Velo publish and live smoke.
**Closed:** QA passed: inline script parse, targeted `diff --check`, in-app Browser at 319px found loaded hero image, 3 mobile route columns, overflow `0`; local QA unlock found full plan open, PDF/print enabled, 8 Essentials cards, and PDF status `PDF downloaded.`. Launch audit is `122 pass, 1 warn, 1 block`.

**Next session should:** Continue with another visual/product polish pass if Yusuf wants it, otherwise move to the Triggered Email ID handoff and Velo live smoke.

## 2026-05-31 — Codex (Ultimate mobile first-screen polish)

**Did:** Added a mobile-only `Phone-ready preview` card so the first mobile viewport feels visual and plan-led before the input form.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `data-mobile-peek`, responsive `.bw-mobile-peek*` styles, `renderMobilePeek()`, and a render hook; desktop keeps the existing form/result two-column layout.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — added a guard for the mobile first-screen visual peek.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html`, `RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md`, and root `SESSION_LOG.md` — regenerated/updated handoff state.
- `output/qa/ultimate-trip-planner-ui/mobile-peek-20260531/` — mobile/desktop screenshots and `summary.json`.

**Opened:** Ultimate is still draft/unpublished; 10 real Triggered Email IDs remain the hard blocker before Velo publish and live smoke.
**Closed:** QA passed: in-app Browser confirmed mobile order stays form-before-result while the compact peek appears above the form; CDP 390px mobile found peek `grid`, 3 actions, 3 day chips, loaded photo, height `378`, overflow `0`; desktop found peek `display:none`, unchanged form/result top alignment, overflow `0`. Launch audit is `121 pass, 1 warn, 1 block`.

**Next session should:** Continue visual/product polish if requested, or move to the Triggered Email ID handoff and Velo live smoke.

## 2026-05-31 — Codex (Ultimate Map Passport polish)

**Did:** Added a visual `Map passport` layer to make Ultimate feel less text-heavy and more map/action-led.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `data-place-passport`, responsive UI/CSS, iconized place-card helpers, text export, print output, and PDF rendering; fixed clipped PDF mini-card labels by using measured one-line labels instead of fixed 12-char slices.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md`, and root `SESSION_LOG.md` — updated handoff state.
- `output/qa/ultimate-trip-planner-ui/map-passport-20260531/` — desktop/mobile screenshots and overflow checks.
- `output/qa/ultimate-trip-planner-pdf/map-passport-20260531/` — real downloaded 7-day PDF, rendered PNG pages, and contact sheet.

**Opened:** Ultimate is still draft/unpublished; 10 real Triggered Email IDs remain the hard blocker before Velo publish and live smoke.
**Closed:** QA passed: inline DOM smoke found one passport, 6 cards, 6 Google Maps links, loaded images, 3 full-plan days, 8 Essentials cards, overflow `0`, and no browser errors; true 390px CDP check had doc/body scroll width `390` and no overflow offenders; real 15-page PDF downloaded via the button and rendered with BerlinWalk logo, Map Passport, Berlin Essentials, and no visible overlap.

**Next session should:** Continue the visual/product polish queue if Yusuf wants a stronger "ultimate" feel, or switch to the Triggered Email ID handoff and Velo live smoke.

## 2026-05-31 — Codex (Ultimate post-ID gate runner)

**Did:** Added a one-command post-ID gate runner for the Ultimate Triggered Email launch sequence.

**Changed:**
- `ultimate-berlin-trip-planner/velo/run-email-id-launch-gate.mjs` — dry-run-first runner for import/check/apply/verify/regenerate/prepublish/audit after the 10 real Wix IDs exist.
- `ultimate-berlin-trip-planner/velo/check-triggered-email-ids.mjs` — added `--funnel` so temp-funnel QA can verify applied IDs without touching the real Velo file.
- `ultimate-berlin-trip-planner/email/build-triggered-email-html.mjs`, `email/paste-ready/README.md`, `email/paste-ready/copy-kit.html`, `LAUNCH_RUNBOOK.md`, `WIX_EMAIL_SETUP_TR.md`, `velo/README.md`, `velo/build-velo-install-kit.mjs`, `velo/install-kit.html`, `build-launch-control-room.mjs`, `LAUNCH_CONTROL_ROOM.html`, `build-launch-status-report.mjs`, `LAUNCH_STATUS.*`, `launch-audit.mjs`, `RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md`, and root `SESSION_LOG.md` — regenerated/updated the fast-path handoff.
- `output/qa/ultimate-trip-planner-email-id-gate/post-id-gate-20260531/` — fake ID gate-runner QA logs and summary.

**Opened:** Ultimate is still draft/unpublished; the 10 real Wix Triggered Email IDs remain the hard blocker before Velo publish and live smoke.
**Closed:** QA passed: syntax checks, fake 10-ID dry-run/write against a temp funnel, temp placeholders removed, fake IDs applied, duplicate IDs rejected before apply, `--import-downloads --downloads-dir` dry-run/write, direct `--import-from` write, real `tripPlannerFunnel.js` untouched, remote preflight refreshed with `TripPlannerLeads` 73 fields verified, prepublish gate still correctly blocks without real IDs, and launch audit is `120 pass, 1 warn, 1 block`.

**Next session should:** Create the 10 Wix Triggered Email templates, download/import `message-ids.local.json`, run the gate runner with `--import-downloads` then with `--write` after loading `WIX_API_KEY`, publish Velo, and run live smoke.

## 2026-05-31 — Codex (Ultimate email ID import helper)

**Did:** Added a dry-run-first helper so the Triggered Email copy-kit download can be imported from `~/Downloads` without manual file moves.

**Changed:**
- `ultimate-berlin-trip-planner/velo/import-message-ids-from-downloads.mjs` — finds the newest `message-ids*.json`, validates all 10 IDs, normalizes Wix editor URLs, rejects duplicates/placeholders, writes only with `--write`, and backs up any existing local ID file.
- `ultimate-berlin-trip-planner/email/build-triggered-email-html.mjs`, `email/paste-ready/README.md`, and `email/paste-ready/copy-kit.html` — regenerated copy-kit guidance/status text for the Downloads import path.
- `ultimate-berlin-trip-planner/LAUNCH_RUNBOOK.md`, `WIX_EMAIL_SETUP_TR.md`, `velo/README.md`, `velo/build-velo-install-kit.mjs`, `velo/install-kit.html`, `build-launch-control-room.mjs`, `LAUNCH_CONTROL_ROOM.html`, `build-launch-status-report.mjs`, `LAUNCH_STATUS.*`, `launch-audit.mjs`, `RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md`, and root `SESSION_LOG.md` — updated launch handoff/status.
- `output/qa/ultimate-trip-planner-email-id-import/download-helper-20260531/` — fake Downloads import QA logs and summary.

**Opened:** Ultimate is still draft/unpublished; the 10 real Wix Triggered Email IDs remain the hard blocker before Velo publish and live smoke.
**Closed:** QA passed: helper syntax ok, fake 10-URL Downloads import dry-run/write/check produced 10 normalized unique IDs, duplicate import was rejected without writing, original `tripPlannerFunnel.js` placeholders stayed untouched, remote preflight refreshed with `TripPlannerLeads` 73 fields verified, and launch audit is `118 pass, 1 warn, 1 block`.

**Next session should:** Create the 10 Wix Triggered Email templates, download/import `message-ids.local.json`, apply IDs, run `prepublish-gate.mjs`, then paste/publish Velo and run live smoke.

## 2026-05-31 — Codex (Ultimate distribution guard)

**Did:** Hardened the homepage tools shortcut so draft Ultimate cannot leak before launch, and verified the refreshed planner icons.

**Changed:**
- `tools-home/tools-home-element.js` — now filters `status: "draft"`, `hidden: true`, and `published: false` before taking the first 8 homepage cards.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — added guards for the homepage renderer filter, Gemini Flash planner icons, and the prepared-but-hidden Ultimate icon.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html`, `RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md`, and root `SESSION_LOG.md` — regenerated/updated handoff state.
- `output/qa/tools-home/draft-filter-20260531/` — screenshot and summary from a headless smoke where draft Ultimate plus hidden/unpublished test rows were injected into homepage tool data.

**Opened:** Ultimate is still draft/unpublished; the 10 real Triggered Email IDs remain the hard blocker before Velo publish and live smoke.
**Closed:** Homepage smoke passed: 8 public cards rendered, no Ultimate/hidden/unpublished card appeared, First-Day and Hackescher icons loaded, overflow `0`, empty console errors. Launch audit is now `115 pass, 1 warn, 1 block`.

**Next session should:** Either continue UI/PDF polish, or move to the 10 Triggered Email IDs, Velo publish, and live smoke.

## 2026-05-31 — Codex (Ultimate personalized close chips)

**Did:** Made Ultimate's end-of-day close strips context-aware without bringing back long prose.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `personalizedCloseChip()` / `dayCloseChips()` so the second close chip varies by family/kids, pace, rain, reservations, budget, Monday museum hours, and Sunday/holiday food timing while staying at two short chips.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — strengthened the no-long-day-end-copy guard to require personalized close-chip helpers.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html`, `RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md`, and root `SESSION_LOG.md` — regenerated/updated handoff state.
- `output/qa/ultimate-trip-planner-ui/personalized-close-20260531/` and `output/qa/ultimate-trip-planner-pdf/personalized-close-20260531/` — desktop/mobile QA screenshots, summary, real 16-page PDF, rendered pages, and contact sheet.

**Opened:** Ultimate is still draft/unpublished; the 10 real Triggered Email IDs remain the hard blocker before Velo publish and live smoke.
**Closed:** QA passed: desktop family/gentle/rain/kids produced 4 second-chip variants, mobile packed/rain/reservations produced 4 second-chip variants, overflow `0`, PDF text includes the new cues, stale `Note:` / `Local cue` absent, and rendered PDF pages show no visible overlap. Launch audit remains `110 pass, 1 warn, 1 block`.

**Next session should:** Continue product polish only if Yusuf wants another UI pass; otherwise move to the 10 Triggered Email IDs, Velo publish, and live smoke.

## 2026-05-31 — Codex (Ultimate Arrival Playbook)

**Did:** Added an `Arrival playbook` visual operations card to the top of the Ultimate result stack.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `data-arrival-playbook`, CSS, `arrivalPlaybookItems()` / summary / HTML / render helpers, text export, print output, and PDF cover rendering; Trip Highlights now uses a distinct tour photo when the tour day is also the arrival day.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — added a guard proving Arrival Playbook reaches UI, text, print, and PDF.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html`, `RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md`, and root `SESSION_LOG.md` — regenerated/updated handoff state.
- `output/qa/ultimate-trip-planner-ui/arrival-playbook-20260531/` and `output/qa/ultimate-trip-planner-pdf/arrival-playbook-20260531/` — desktop/mobile screenshots, crops, summary, real 15-page PDF, rendered PNG pages, contact sheet, and text summary.

**Opened:** Ultimate is still draft/unpublished; the 10 real Triggered Email IDs remain the hard blocker before Velo publish and live smoke.
**Closed:** QA passed: one playbook, 4 cards (`Ticket`, `First move`, `Tour anchor`, `First close`), loaded photo, first-close value `Food, water, sleep`, distinct Trip Highlights images `3`, print capture includes Arrival Playbook, desktop/mobile overflow `0`, empty browser errors, PDF text includes Arrival Playbook/Trip Highlights/Essentials, and page 2/contact sheet show no overlap. Launch audit is `110 pass, 1 warn, 1 block`.

**Next session should:** Continue product polish only if needed, or move to the Triggered Email ID handoff, Velo publish, and live smoke.

## 2026-05-31 — Codex (Ultimate Trip Highlights export)

**Did:** Carried the `Trip highlights` Start / Tour / Finish layer into Ultimate's exports.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added Trip Highlights to text export, print output, and the PDF cover flow with linked-style visual cards and day photos.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — added a guard proving Trip Highlights reaches text, print, and PDF exports.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html`, `RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md`, and root `SESSION_LOG.md` — regenerated/updated handoff state.
- `output/qa/ultimate-trip-planner-pdf/trip-highlights-export-20260531/` — browser summary, text summary, real 14-page PDF, rendered PNG pages, and contact sheet.

**Opened:** Ultimate is still draft/unpublished; the 10 real Triggered Email IDs remain the hard blocker before Velo publish and live smoke.
**Closed:** QA passed: inline JS parse, targeted `diff --check`, desktop/mobile UI still has 3 highlight cards with overflow `0`, print output includes Trip Highlights with loaded images, PDF text includes Trip Highlights/Start/Finish, and page 2/contact sheet visual inspection showed no overlap. Launch audit is `109 pass, 1 warn, 1 block`.

**Next session should:** Continue final visual/product polish, or create/apply the 10 Wix Triggered Email IDs and then publish/smoke the Velo backend.

## 2026-05-31 — Codex (Ultimate Trip Highlights)

**Did:** Added a photo-first `Trip highlights` layer to the Ultimate result screen.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `data-trip-highlights`, Trip Highlights CSS, and `tripHighlightItems()` / `tripHighlightsHtml()` / `renderTripHighlights()` for Start, Tour/Meeting, and Finish image cards with icons and map/booking actions.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — added a guard for the new photo-first result layer.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html`, `RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md`, and root `SESSION_LOG.md` — regenerated/updated handoff state.
- `output/qa/ultimate-trip-planner-ui/trip-highlights-20260531/` — desktop/mobile screenshots, focused crops, and `summary.json`.

**Opened:** Ultimate is still draft/unpublished; the 10 real Triggered Email IDs remain the hard blocker before Velo publish and live smoke.
**Closed:** QA passed: 3 highlight cards, Start/Tour/Finish present, all photos loaded, Google Maps/booking links present, overflow `0`, and launch audit is `108 pass, 1 warn, 1 block`.

**Next session should:** Continue visual polish, or create/apply the 10 Wix Triggered Email IDs and then publish/smoke the Velo backend.

## 2026-05-31 — Codex (Ultimate compact day closes)

**Did:** Reworked Ultimate's end-of-day close strips so they are shorter, more varied, and PDF-safe.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — day closes now use day-type labels/titles (`Arrival`, `Museum`, `East`, `Food`, `Low-cost`, `Local`, `Return`) with two short chips; removed the repeated close-level rain/family override; enlarged the PDF close box before the Google Maps pack.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — strengthened the day-close guard for compact labels/chips and PDF close spacing.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html`, `RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md`, and root `SESSION_LOG.md` — regenerated/updated handoff state.
- `output/qa/ultimate-trip-planner-ui/close-compact-20260531/` — desktop/mobile summaries/screenshots plus a real 7-day PDF, rendered pages, contact sheet, and PDF text summary.

**Opened:** Ultimate is still draft/unpublished; the 10 real Triggered Email IDs remain the hard blocker before Velo publish and live smoke.
**Closed:** QA passed: `closeCount: 7`, `maxChipCount: 2`, `repeatedCoveredBackup: 0`, stale `Note:`/`Local cue` absent, overflow `0`, 14-page PDF rendered, and launch audit is `107 pass, 1 warn, 1 block`.

**Next session should:** Continue product polish, or create/apply the 10 Wix Triggered Email IDs and then publish/smoke the Velo backend.

## 2026-05-31 — Codex (Ultimate Velo pre-publish gate)

**Did:** Added a pre-publish command gate to the Ultimate Velo install kit.

**Changed:**
- `ultimate-berlin-trip-planner/velo/build-velo-install-kit.mjs` — now emits a `Pre-publish gate` panel with ID check/apply, remote preflight, install-kit regeneration, and launch audit commands before the Wix paste panels.
- `ultimate-berlin-trip-planner/velo/install-kit.html` — regenerated with the new gate and current placeholder warning.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — install-kit guard now requires the pre-publish gate and ID apply/check commands.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html`, `RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md`, and root `SESSION_LOG.md` — updated handoff/status.
- `output/qa/ultimate-trip-planner-velo/install-kit-prepublish-20260531/` — desktop/mobile screenshots and `summary.json`.

**Opened:** Ultimate is still draft/unpublished; the 10 real Triggered Email IDs remain the hard blocker before Velo publish and live smoke.
**Closed:** Install-kit QA passed: one pre-publish panel, 3 source panels, check/apply/preflight/build commands present, placeholder warning visible, overflow `0`, no console errors. Launch audit remains `105 pass, 1 warn, 1 block`.

**Next session should:** Create/apply the 10 Wix Triggered Email IDs, regenerate the install kit once placeholders are gone, paste/publish Velo, then run live smoke.

## 2026-05-31 — Codex (Ultimate email copy-kit bulk paste)

**Did:** Added a bulk URL paste lane to the Triggered Email copy kit.

**Changed:**
- `ultimate-berlin-trip-planner/email/build-triggered-email-html.mjs` — generator now emits a bulk paste panel, parsing helpers, and `Apply bulk IDs` / clear actions.
- `ultimate-berlin-trip-planner/email/paste-ready/copy-kit.html` and `README.md` — regenerated with the bulk paste workflow.
- `ultimate-berlin-trip-planner/WIX_EMAIL_SETUP_TR.md` and `LAUNCH_RUNBOOK.md` — documented the short path: paste 10 Wix editor URLs in order, click `Apply bulk IDs`, then download JSON.
- `ultimate-berlin-trip-planner/launch-audit.mjs`, `RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md`, and root `SESSION_LOG.md` — updated handoff/audit state.
- `output/qa/ultimate-trip-planner-email/copy-kit-bulk-20260531/` — desktop/mobile bulk-paste screenshots and `summary.json`.

**Opened:** Ultimate is still draft/unpublished; the 10 real Triggered Email IDs remain the hard blocker before Velo publish and live smoke.
**Closed:** Copy-kit bulk QA passed: desktop and 390px mobile filled `10/10` IDs from 10 URLs with JSON keys `10`, overflow `0`, no console errors, and duplicate-ID detection returned 10 issue rows.

**Next session should:** Create the 10 Wix Triggered Email templates, collect their editor URLs, use the copy-kit bulk paste box to build `message-ids.local.json`, apply IDs, then publish/smoke Velo.

## 2026-05-31 — Codex (Ultimate collection sync)

**Did:** Synced the live `TripPlannerLeads` conversion fields.

**Changed:**
- Wix: added `conversionSignal`, `conversionScore`, `conversionTier`, `conversionNextAction`, and `conversionReasons` to live `TripPlannerLeads`.
- `ultimate-berlin-trip-planner/velo/create-trip-planner-leads-collection.mjs` — switched missing-field sync to the correct Wix Data `create-field` endpoint; kept `patch-field` helper for future existing-field edits.
- `ultimate-berlin-trip-planner/launch-audit.mjs`, `velo/README.md`, `RESEARCH_BACKLOG.md`, `LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html`, root `PROJECT_MEMORY.md`, and root `SESSION_LOG.md` — updated launch handoff/status.
- `output/qa/ultimate-trip-planner-collection/live-sync-2026-05-31T10-31-06-192Z.json` and `output/qa/ultimate-trip-planner-remote-preflight/remote-preflight-2026-05-31T10-31-30-014Z.json` — live sync and non-mutating verification evidence.

**Opened:** Ultimate is still draft/unpublished; 10 real Triggered Email IDs remain the hard blocker, then Velo publish and live `tripPlannerLead` / `tripPlannerBooking` smoke.
**Closed:** Collection gate now passes: live sync verified `69` expected fields, remote preflight sees `73` fields including system fields and all critical fields present. Launch status still says `NOT READY` because email IDs are placeholders.

**Next session should:** Create the 10 Wix Triggered Email templates from `email/paste-ready/copy-kit.html`, export/apply `message-ids.local.json`, regenerate the Velo install kit, publish Velo, and run live smoke.

## 2026-05-31 — Codex (Ultimate Trip Command Strip)

**Did:** Added an always-visible visual `Trip commands` action layer to the Ultimate result screen.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added the `Trip commands` strip with route anchors plus `Route map`, `Day 1 start`, tour/meeting, and `Weather/open` cards; carried the same data into text export, print output, and PDF cover flow before Trip Radar.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — added a guard proving the command strip reaches UI, text, print, and PDF.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html`, `RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md`, and root `SESSION_LOG.md` — regenerated/updated handoff state.
- `output/qa/ultimate-trip-planner-ui/trip-command-strip-20260531/` and `output/qa/ultimate-trip-planner-pdf/trip-command-strip-20260531/` — desktop/mobile UI evidence plus real 5-day sales PDF download, rendered pages, contact sheet, and text checks.

**Opened:** Ultimate is still draft/unpublished; 10 real Triggered Email IDs remain the blocker, and live `TripPlannerLeads` still needs the five conversion fields synced before Velo publish.
**Closed:** Inline script parse, launch-audit syntax, targeted `diff --check`, launch audit (`105 pass, 1 warn, 1 block`), desktop/mobile far-date QA (`commandCards: 4`, `commandStops: 4`, Travel Mode suppressed, overflow `0`, no vertical text), and 5-day sales PDF render/text QA passed (`12` pages, Trip Commands/Trip Radar/Essentials/BerlinWalk branding present, stale `Local cue` / `Note:` absent).

**Next session should:** Continue product polish, or switch to the Wix handoff once Yusuf is ready to create/apply the 10 Triggered Email templates.

## 2026-05-31 — Codex (Ultimate Travel Mode assistant)

**Did:** Turned the near-arrival Travel Mode panel into a phone-ready assistant.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — redesigned `renderTravelMode()` with a real-photo phone card, Day 1 badge, Google Maps anchors, quick actions, chips, and Now/Next/Later cards; extended `travelModeSummary()`, print output, and PDF Travel Review route-anchor pills.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — added a Travel Mode phone-assistant guard.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html`, `RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md`, and root `SESSION_LOG.md` — regenerated/updated handoff state.
- `output/qa/ultimate-trip-planner-ui/travel-mode-assistant-20260531/` and `output/qa/ultimate-trip-planner-pdf/travel-mode-assistant-20260531/` — desktop/mobile UI screenshots/summaries plus real PDF download, rendered pages, contact sheet, and text checks.

**Opened:** Ultimate is still draft/unpublished; 10 real Triggered Email IDs remain the blocker, and live `TripPlannerLeads` still needs the five conversion fields synced before Velo publish.
**Closed:** Inline script parse, launch-audit syntax, targeted `diff --check`, launch audit (`104 pass, 1 warn, 1 block`), desktop/mobile near-arrival QA (`photoLoaded: true`, `stopCount: 3`, `quickActions: 3`, overflow `0`, no vertical text), far-date suppression, and 3-day sales PDF render/text QA passed (`10` pages, Travel Review anchors and Essentials present, stale `Local cue` / `Note:` absent).

**Next session should:** Continue product polish, or switch to the Wix handoff once Yusuf is ready to create/apply the 10 Triggered Email templates.

## 2026-05-31 — Codex (Ultimate booking-aware fixture)

**Did:** Added a local Wix mock fixture for Ultimate's booking-aware email branch.

**Changed:**
- `ultimate-berlin-trip-planner/velo/booking-aware-fixture.mjs` — local-only harness for `tripPlannerFunnel.js` with mocked Wix Data, Contacts, and Triggered Emails.
- `ultimate-berlin-trip-planner/velo/README.md` — documented the fixture command.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — added required-file and fixture-coverage guards.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html`, `RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md`, and root `SESSION_LOG.md` — regenerated/updated handoff state.
- `output/qa/ultimate-trip-planner-velo/` — fixture JSON evidence.

**Opened:** Ultimate is still draft/unpublished; 10 real Triggered Email IDs remain the blocker, and live `TripPlannerLeads` still needs the five conversion fields synced before Velo publish.
**Closed:** `node ultimate-berlin-trip-planner/velo/booking-aware-fixture.mjs` passed 4 checks: sales/booked `minus3` branch selection, cancelled status override, missing booked-ID fail-closed skip, and `arrivalDate`-scoped booking updates. Syntax checks, targeted `diff --check`, regenerated status/control room, and launch audit passed (`103 pass, 1 warn, 1 block`).

**Next session should:** Continue product polish, or move to the Wix handoff once Yusuf is ready to create/apply the 10 Triggered Email templates.

## 2026-05-31 — Codex (Ultimate PDF document guide)

**Did:** Added an `Inside this plan` travel-document guide strip to the PDF cover.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `drawPdfDocumentKit()` and placed it before the cover photo/radar/pass sections.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — added a PDF document-guide guard.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html`, `RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md`, and root `SESSION_LOG.md` — regenerated/updated handoff state.
- `output/qa/ultimate-trip-planner-ui/pdf-document-kit-20260531/` and `output/qa/ultimate-trip-planner-pdf/pdf-document-kit-20260531/` — desktop/mobile UI smoke evidence plus real 7-day sales PDF, rendered pages, contact sheet, and summary.

**Opened:** Ultimate is still draft/unpublished; 10 real Triggered Email IDs remain the blocker, and live `TripPlannerLeads` still needs the five conversion fields synced before Velo publish.
**Closed:** Inline JS parse, launch audit, targeted `diff --check`, regenerated status/control room, headless desktop/mobile QA (`fullDays: 7`, `mapPacks: 7`, PDF enabled, overflow `0`), and real PDF download/render (`14` pages, `Inside this plan` labels present, old `Place:` / `Map actions` absent) passed. Latest launch audit is `101 pass, 1 warn, 1 block`.

**Next session should:** Continue product polish, or switch to the Wix handoff by syncing missing collection fields and applying the 10 Triggered Email IDs when Yusuf is ready.

## 2026-05-31 — Codex (Ultimate map pack)

**Did:** Replaced full-plan day map-link stacks with visual `Google Maps pack` cards.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `dayMapPackItems()`, `dayMapPackHtml()`, `printDayMapPackHtml()`, map-pack CSS, text export lines, and PDF day-card map-pack rendering; removed the old full-plan plain map-link stack and PDF `Map actions` / `Place:` list.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — added a guard proving the map pack reaches UI, text export, print, and PDF.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html`, `RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md`, and root `SESSION_LOG.md` — regenerated/updated handoff state.
- `output/qa/ultimate-trip-planner-ui/map-pack-20260531/` and `output/qa/ultimate-trip-planner-pdf/map-pack-20260531/` — desktop/mobile UI evidence plus real 7-day sales PDF, rendered pages, contact sheet, and summaries.

**Opened:** Ultimate is still draft/unpublished; 10 real Triggered Email IDs remain the blocker, and live `TripPlannerLeads` still needs the five conversion fields synced before Velo publish.
**Closed:** Inline JS parse, launch audit, targeted `diff --check`, regenerated status/control room, headless Chrome desktop/mobile 7-day unlocked QA (`mapPacks: 7`, `mapCards: 28`, `plainMapLinks: 0`, overflow `0`), and real PDF download/render (`14` pages, `Google Maps pack` present, `Place:` / `Map actions` absent) passed. Latest launch audit is `100 pass, 1 warn, 1 block`.

**Next session should:** Continue product polish, or switch to the Wix handoff by syncing missing collection fields and applying the 10 Triggered Email IDs when Yusuf is ready.

## 2026-05-31 — Codex (Ultimate day-close strip)

**Did:** Replaced repeated end-of-day itinerary tiles with a short visual `Day close` strip.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `dayActionBlockItems()`, `dayClosePlan()`, UI/print helpers, compact close-chip CSS, text export lines, PDF day-card close rendering, and removed `Later`/`Evening` duplication from route reels/PDF route tiles.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — strengthened the day-end guard to require visual close strips and main-action-only route reels.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html`, `RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md`, and root `SESSION_LOG.md` — regenerated/updated handoff state.
- `output/qa/ultimate-trip-planner-ui/day-close-20260531/` and `output/qa/ultimate-trip-planner-pdf/day-close-20260531/` — desktop/mobile UI evidence plus real 7-day sales PDF, rendered pages, contact sheet, and summaries.

**Opened:** Ultimate is still draft/unpublished; 10 real Triggered Email IDs remain the blocker, and live `TripPlannerLeads` still needs the five conversion fields synced before Velo publish.
**Closed:** Inline JS parse, launch-audit syntax, targeted `diff --check`, regenerated status/control room, in-app browser 7-day unlocked smoke (`closeCount: 7`, duplicate route-reel closers `0`, overflow `0`), true 390px mobile smoke, real PDF download/render (`14` pages), and launch audit passed (`99 pass, 1 warn, 1 block`).

**Next session should:** Continue product polish, or switch to the Wix handoff by syncing missing collection fields and applying the 10 Triggered Email IDs when Yusuf is ready.

## 2026-05-31 — Codex (Ultimate conversion fields)

**Did:** Split the Ultimate planner conversion signal into machine-readable CRM/email fields.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — `leadPayload()` now sends `conversionScore`, `conversionTier`, `conversionNextAction`, and `conversionReasons` alongside the user-safe `conversionSignal`.
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js`, `velo/create-trip-planner-leads-collection.mjs`, `launch-remote-preflight.mjs`, `launch-audit.mjs`, `email/README.md`, and `velo/README.md` — validate/store/expose the machine-readable fields and guard critical live schema.
- `ultimate-berlin-trip-planner/email/paste-ready/`, `velo/install-kit.html`, `LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html`, `RESEARCH_BACKLOG.md`, and root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — generated/handoff artifacts updated.

**Opened:** Live `TripPlannerLeads` currently misses `conversionSignal`, `conversionScore`, `conversionTier`, `conversionNextAction`, and `conversionReasons`. Before Velo publish, load `WIX_API_KEY` and run `node ultimate-berlin-trip-planner/velo/create-trip-planner-leads-collection.mjs --live --sync-fields`.
**Closed:** Inline JS parse, transformed Velo syntax, helper syntax checks, regenerated paste-ready emails, regenerated Velo install kit, collection dry-run (`69` planned fields), non-mutating remote preflight, `diff --check`, regenerated launch status/control room, and launch audit passed (`99 pass, 1 warn, 1 block`).

**Next session should:** Run the guarded field sync only when ready to mutate Wix, then continue with the 10 Triggered Email IDs and Velo publish/live smoke.

## 2026-05-31 — Codex (Ultimate collection schema guard)

**Did:** Hardened the Ultimate launch path so new lead fields cannot silently miss the live `TripPlannerLeads` schema.

**Changed:**
- `ultimate-berlin-trip-planner/velo/create-trip-planner-leads-collection.mjs` — added `--live --sync-fields`, `patchCollectionField()`, before/after verification, and clear missing-field guidance.
- `ultimate-berlin-trip-planner/launch-remote-preflight.mjs` — now verifies critical collection fields including `conversionSignal`, not just field count.
- `ultimate-berlin-trip-planner/build-launch-status-report.mjs`, `build-launch-control-room.mjs`, `LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html`, `LAUNCH_RUNBOOK.md`, `velo/README.md`, `launch-audit.mjs`, `RESEARCH_BACKLOG.md`, and root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — status, dashboard, docs, and audit updated.

**Opened:** Live `TripPlannerLeads` currently exists but is missing the new `conversionSignal` field. Before publishing Velo, load `WIX_API_KEY` and run `node ultimate-berlin-trip-planner/velo/create-trip-planner-leads-collection.mjs --live --sync-fields`.
**Closed:** Non-mutating remote preflight now reports missing critical fields; launch status shows `TripPlannerLeads collection | WARN | Missing critical fields: conversionSignal`; helper dry-run reports 65 planned fields; syntax checks, `diff --check`, regenerated status/control room, and launch audit passed (`98 pass, 1 warn, 1 block`).

**Next session should:** Run the guarded field sync only when ready to mutate Wix, then proceed with the 10 Triggered Email IDs and Velo publish/live smoke.

## 2026-05-31 — Codex (Ultimate conversion signal)

**Did:** Added a deterministic `conversionSignal` score/next-action summary for Ultimate trip planner leads.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `conversionSignal()` / `conversionSignalSummary()` and included the summary in `leadPayload()`.
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js` and `velo/create-trip-planner-leads-collection.mjs` — validate/store/expose `conversionSignal` and include the collection field in setup dry-runs.
- `ultimate-berlin-trip-planner/email/` — instant sales/booked emails include `Planner signal`; paste-ready HTML/copy kit regenerated.
- `ultimate-berlin-trip-planner/launch-audit.mjs`, `LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html`, `RESEARCH_BACKLOG.md`, and root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — audit/status/handoff updated; audit now reports `97 pass, 1 warn, 1 block`.

**Opened:** Ultimate remains draft/unpublished; 10 real Triggered Email IDs still block launch, Velo backend/job is not published, live endpoint smoke evidence is still missing, and BerlinTools CMS/blog remain unpublished.
**Closed:** Inline JS parse, transformed Velo syntax, `node --check` for `.mjs` helpers, regenerated email HTML, regenerated Velo install kit, `diff --check`, collection dry-run (`65` planned fields), in-app browser forced fail-soft unlock (`fullPlanHidden: false`, PDF enabled, overflow `0`), launch status/control regeneration, and launch audit passed.

**Next session should:** Continue product polish or switch to the Triggered Email ID blocker when Yusuf has the 10 Wix message IDs.

## 2026-05-31 — Codex (Ultimate trip-calendar PDF QA)

**Did:** Fixed the PDF Carry Pack layout after the Trip Calendar action made it a 5-card block, then rendered fresh PDFs.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — `drawPdfCarryPack()` now computes rows/columns, wraps 5 actions into a measured 3-column/2-row grid, updates the cover subtitle, and skips `data:text/calendar` URLs as PDF links while showing `.ics` filenames.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — added a guard for PDF Carry Pack row wrapping and safe calendar-link handling.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html`, `RESEARCH_BACKLOG.md` — regenerated/updated; audit now reports `96 pass, 1 warn, 1 block`.
- `output/qa/ultimate-trip-planner-pdf/trip-calendar-20260531/` — real-download sales/booked PDFs, rendered pages, contact sheets, download summaries, render summaries, and text-check summary.
- Root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — updated latest status.

**Opened:** Ultimate remains draft/unpublished; 10 real Triggered Email IDs still block launch, Velo backend/job is not published, live endpoint smoke evidence is still missing, and BerlinTools CMS/blog remain unpublished.
**Closed:** Inline JS parse, launch-audit syntax, targeted `diff --check`, launch audit, status/control regeneration, real Chrome PDF downloads, `pypdfium2` render, visual page/contact-sheet inspection, and PDF text extraction passed. Both `trip-calendar-7day-sales.pdf` and `trip-calendar-7day-booked.pdf` rendered as 14 pages; cover Carry Pack has no visible overlap, Trip Calendar filename appears, `data:text/calendar` text is absent, booked PDF has World Clock prep and no sales booking text.

**Next session should:** Continue product polish or switch to the Triggered Email ID blocker when Yusuf has the 10 Wix message IDs.

## 2026-05-31 — Codex (Ultimate trip calendar export)

**Did:** Added a full-trip `.ics` calendar download to the unlocked Phone Carry Pack.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `tripCalendarText()` / `tripCalendarHref()` / `tripCalendarFileName()`, a new `Trip calendar` Carry Pack action, event tracking, responsive Carry Pack grid, and text/print export handling that shows filenames instead of data URLs.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — added a guard for full-trip calendar export and data-URL-safe text export.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html`, `RESEARCH_BACKLOG.md` — regenerated/updated; audit now reports `95 pass, 1 warn, 1 block`.
- `output/qa/ultimate-trip-planner-ui/trip-calendar-20260531/` — in-app browser DOM decode summary plus 390px Chrome screenshot/crop evidence.
- Root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — updated latest status.

**Opened:** Ultimate remains draft/unpublished; 10 real Triggered Email IDs still block launch, Velo backend/job is not published, live endpoint smoke evidence is still missing, and BerlinTools CMS/blog remain unpublished.
**Closed:** Inline JS parse, `node --check` for launch audit, targeted `diff --check`, launch audit, launch status/control regeneration, in-app browser DOM QA, and 390px Chrome visual QA passed. QA confirmed 5 Carry Pack actions, `berlin-trip-plan-2026-06-10-7days.ics`, 7 decoded `VEVENT`s, all-day DTSTART, Day 7, Google Maps route URLs, exact plan URL, and overflow `0`.

**Next session should:** Continue product polish or switch to the Triggered Email ID blocker when Yusuf has the 10 Wix message IDs.

## 2026-05-31 — Codex (Ultimate dynamic reminder timeline)

**Did:** Made the Ultimate lead-gate `Arrival reminder timeline` respond to the selected arrival date.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added dynamic reminder timeline rendering, skipped/current/future states, exact future reminder dates, dynamic `Up to N emails`, booked-path prep language, and mobile date-layout fixes.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — strengthened the lead-gate timeline guard to require the dynamic timeline functions, skipped/current copy, date formatting, render wiring, and World Clock booked language.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html`, `RESEARCH_BACKLOG.md` — regenerated/updated; audit remains `94 pass, 1 warn, 1 block`.
- `output/qa/ultimate-trip-planner-ui/reminder-timeline-20260531/` — DOM QA summaries and focused desktop/mobile screenshots for tomorrow-arrival sales, 10-day sales, and 10-day booked states.
- Root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — updated latest status.

**Opened:** Ultimate remains draft/unpublished; 10 real Triggered Email IDs still block launch, Velo backend/job is not published, live endpoint smoke evidence is still missing, and BerlinTools CMS/blog remain unpublished.
**Closed:** Inline JS parse, `node --check` for launch audit, targeted `diff --check`, launch audit, launch status/control regeneration, desktop focused QA, and true 390px mobile booked QA passed. Tomorrow-arrival sales now shows `Up to 2 emails` with passed windows folded into the instant plan; 10-day sales/booked states show `Up to 5 emails`, exact future dates, no overflow, and booked copy switches to World Clock prep.

**Next session should:** Continue product polish or switch to the Triggered Email ID blocker when Yusuf has the 10 Wix message IDs.

## 2026-05-31 — Codex (Ultimate compact day copy)

**Did:** Tightened the Ultimate planner's day-card prose so the full plan/PDF read less like repeated explanations.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — shortened first-day and template itinerary copy into compact action lines while keeping final `Later`/`Evening` closers title-only.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — added a `Day-card prose stays compact` guard for first-day/template copy under 90 chars.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html`, `RESEARCH_BACKLOG.md` — regenerated/updated; audit now reports `94 pass, 1 warn, 1 block`.
- `output/qa/ultimate-trip-planner-ui/compact-copy-20260531/` — in-app browser QA summary plus desktop/mobile viewport screenshots.
- `output/qa/ultimate-trip-planner-pdf/compact-copy-20260531/` — fresh PDFs, rendered pages, contact sheets, and render/download summaries.
- Root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — updated latest status.

**Opened:** Ultimate remains draft/unpublished; 10 real Triggered Email IDs still block launch, Velo backend/job is not published, live endpoint smoke evidence is still missing, and BerlinTools CMS/blog remain unpublished.
**Closed:** Inline JS parse, syntax checks, targeted `diff --check`, launch audit, in-app browser desktop 3-day and true 390px mobile 7-day unlocked QA passed (`closersWithCopy: 0`, max copy `87`, overflow `0`). Real-download PDF QA passed for `compact-3day-sales.pdf` (9 pages) and `compact-7day-booked.pdf` (14 pages); rendered contact sheets show no visible overlap, and text checks confirmed branding/Trip Radar/Essentials with stale long-note phrases absent.

**Next session should:** Continue product polish or switch to the Triggered Email ID blocker when Yusuf has the 10 Wix message IDs.

## 2026-05-31 — Codex (Ultimate Trip Radar exports)

**Did:** Extended Trip Radar beyond the screen UI into text export, print HTML, and the PDF cover flow.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added shared `tripRadarData()` / `tripRadarSummary()`, print Trip Radar markup, and `drawPdfTripRadar()` on the PDF cover before the Trip Pass.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — added a guard proving Trip Radar reaches text, print, and PDF exports.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html`, `RESEARCH_BACKLOG.md` — regenerated/updated; audit now reports `93 pass, 1 warn, 1 block`.
- `output/qa/ultimate-trip-planner-pdf/trip-radar-20260531/` — fresh PDFs, rendered pages, contact sheets, text/render summaries, and print capture summary.
- Root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — updated latest status.

**Opened:** Ultimate remains draft/unpublished; 10 real Triggered Email IDs still block launch, Velo backend/job is not published, live endpoint smoke evidence is still missing, and BerlinTools CMS/blog remain unpublished.
**Closed:** Inline JS parse, targeted `diff --check`, launch audit, print HTML capture, and real-download PDF QA passed. `trip-radar-3day-sales.pdf` rendered as 9 pages and `trip-radar-7day-booked.pdf` rendered as 14 pages; contact sheets show Trip Radar, branding, day cards, and Essentials without visible overlap, and text extraction confirms Trip Radar labels with no stale `Local cue` / `Note:`.

**Next session should:** Continue product polish or switch to the Triggered Email ID blocker when Yusuf has the 10 Wix message IDs.

## 2026-05-31 — Codex (Ultimate trip radar)

**Did:** Added a compact `Trip radar` above the Berlin Trip Pass to make the result feel more like a visual control panel.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `[data-trip-radar]`, `tripRadarHtml()`, CSS for the score ring/action cards, and render wiring before the Trip Pass.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — added a guard for the visual plan-health summary.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html`, `RESEARCH_BACKLOG.md` — regenerated/updated; audit now reports `92 pass, 1 warn, 1 block`.
- `output/qa/ultimate-trip-planner-ui/trip-radar-20260531/` — desktop/mobile screenshots and DOM QA summary.
- Root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — updated latest status.

**Opened:** Ultimate remains draft/unpublished; 10 real Triggered Email IDs still block launch, Velo backend/job is not published, live endpoint smoke evidence is still missing, and BerlinTools CMS/blog remain unpublished.
**Closed:** Inline JS parse, targeted `diff --check`, launch audit, desktop locked 3-day, true 390px mobile locked 7-day, and true 390px mobile unlocked 7-day QA passed. Checks confirmed 3 radar cards, 3 links, full-plan gating intact before unlock, lead gate hidden after unlock, and overflow `0`.

**Next session should:** Continue product polish or switch to the Triggered Email ID blocker when Yusuf has the 10 Wix message IDs.

## 2026-05-31 — Codex (Ultimate lead-gate timeline)

**Did:** Added a visual `Arrival reminder timeline` to the Ultimate lead gate so the email ask feels like a concrete pre-arrival service.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added the 5-step reminder timeline UI, mobile grid fixes, and copy explaining booked guests receive prep instead of sales.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — added a guard for the lead-gate arrival email sequence.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html`, `RESEARCH_BACKLOG.md` — regenerated/updated; audit now reports `91 pass, 1 warn, 1 block`.
- `output/qa/ultimate-trip-planner-ui/lead-reminder-timeline-20260531/` — desktop/mobile screenshots and DOM QA summary.
- Root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — updated latest status.

**Opened:** Ultimate remains draft/unpublished; 10 real Triggered Email IDs still block launch, Velo backend/job is not published, live endpoint smoke evidence is still missing, and BerlinTools CMS/blog remain unpublished.
**Closed:** Inline JS parse, targeted `diff --check`, launch audit, desktop locked 3-day, true 390px mobile locked 7-day, and true 390px mobile unlocked 7-day QA passed. Checks confirmed 5 steps, no bad mobile wraps, full-plan gating intact before unlock, lead gate hidden after unlock, and overflow `0`.

**Next session should:** Continue product polish or switch to the Triggered Email ID blocker when Yusuf has the 10 Wix message IDs.

## 2026-05-31 — Codex (Ultimate visual overview)

**Did:** Added a photo-led `Plan at a glance` layer so the result panel feels more visual before the detailed route deck/full plan.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `[data-itinerary-overview]`, `itineraryOverviewHtml()`, CSS for photo-led day cards, overview stats, and responsive 390px layout.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — added a guard for the visual itinerary overview.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html`, `RESEARCH_BACKLOG.md` — regenerated/updated; audit now reports `90 pass, 1 warn, 1 block`.
- `output/qa/ultimate-trip-planner-ui/itinerary-overview-20260531/` — desktop/mobile screenshots and DOM QA summary.
- Root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — updated latest status.

**Opened:** Ultimate remains draft/unpublished; 10 real Triggered Email IDs still block launch, Velo backend/job is not published, live endpoint smoke evidence is still missing, and BerlinTools CMS/blog remain unpublished.
**Closed:** Inline JS parse, targeted `diff --check`, launch audit, desktop locked 7-day render, mobile locked 7-day render, and mobile unlocked booked 7-day render passed. New overview showed 7 photos, 7 Google Maps route links, full-plan gating intact before unlock, and overflow `0`.

**Next session should:** Continue product polish or switch to the Triggered Email ID blocker when Yusuf has the 10 Wix message IDs.

## 2026-05-31 — Codex (Ultimate timebox PDF QA)

**Did:** Verified the timebox PDF layer with fresh real downloads and rendered contact sheets.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added localhost-only `?qaUnlock=1` so PDF/export QA can unlock the full plan without sending live leads.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — extended the local-QA-param guard to prove `qaUnlock` is localhost/127.0.0.1-only.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, `LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html` — updated/regenerated with latest QA context.
- `output/qa/ultimate-trip-planner-pdf/timebox-20260531/` — fresh PDFs, rendered page PNGs, contact sheets, and JSON summaries for 3-day sales and 7-day booked paths.
- Root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — updated latest status.

**Opened:** Ultimate remains draft/unpublished; 10 real Triggered Email IDs still block launch, Velo backend/job is not published, live endpoint smoke evidence is still missing, and BerlinTools CMS/blog remain unpublished.
**Closed:** Inline JS parse and launch audit passed (`89 pass, 1 warn, 1 block`). Chrome headless downloaded `timebox-3day-sales.pdf` (9 pages) and `timebox-7day-booked.pdf` (14 pages); `pypdfium2` render/text QA confirmed BerlinWalk branding, timeboxes, title-only closers, Essentials, booked branch behavior, and no visible overlap/stale `Local cue` / `Note:` text.

**Next session should:** Continue product polish or switch to the Triggered Email ID blocker when Yusuf has the 10 Wix message IDs.

## 2026-05-31 — Codex (Ultimate timeboxes into email)

**Did:** Extended the new daily timebox timeline into the lead/email funnel without changing the collection schema.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — `dayOperationsSummary()` now includes compact `Time ...` windows derived from the visible itinerary.
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js` — `cleanText()` accepts an optional max length and `${dayOperations}` now allows 1200 chars so 7-day timing summaries are not clipped.
- `ultimate-berlin-trip-planner/email/e0-instant-plan.md`, `email/booked-e0-instant-plan.md`, `email/README.md`, `velo/README.md` — renamed the instant-email section to daily timing + operating notes and documented the timing windows.
- `ultimate-berlin-trip-planner/email/paste-ready/`, `velo/install-kit.html` — regenerated from source after copy/Velo changes.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — added a guard proving timeboxes reach the existing `${dayOperations}` email variable path.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html`, `RESEARCH_BACKLOG.md` — regenerated/updated after the new audit check.
- Root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — updated latest status.

**Opened:** Ultimate remains draft/unpublished; 10 real Triggered Email IDs still block launch, Velo backend/job is not published, live endpoint smoke evidence is still missing, and BerlinTools CMS/blog remain unpublished.
**Closed:** Inline JS parse, Velo module syntax via `node --input-type=module --check`, generated email kit, generated Velo install kit, `diff --check`, and launch audit passed with `89 pass, 1 warn, 1 block`.

**Next session should:** Continue product polish or switch to the remaining launch blocker when the 10 real Wix email IDs are available.

## 2026-05-31 — Codex (Ultimate itinerary timeboxes)

**Did:** Added deterministic time windows so the day plan reads more like a real itinerary.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `dayBlockWindow()` / `dayBlockTimeHtml()`, preview `Timing` chips, route-reel time windows, full-plan block time badges, text export windows, print badges, and PDF day-card time windows.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — added audited coverage for the daily timebox timeline.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html`, `RESEARCH_BACKLOG.md` — regenerated/updated after the new audit check.
- `output/qa/ultimate-trip-planner-ui/timebox-mobile-20260531.png` — mobile headless screenshot.
- Root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — updated latest status.

**Opened:** Ultimate remains draft/unpublished; 10 real Triggered Email IDs still block launch, Velo backend/job is not published, live endpoint smoke evidence is still missing, and BerlinTools CMS/blog remain unpublished.
**Closed:** Inline JS parse, launch/control/status syntax checks, `diff --check`, headless Chrome DOM dump for `Timing` / `09:00-10:45` / `11:30-13:30`, mobile screenshot, and launch audit passed with `88 pass, 1 warn, 1 block`.

**Next session should:** Continue product polish or switch to the remaining launch blocker when the 10 real Wix email IDs are available.

## 2026-05-31 — Codex (Ultimate day-end audit guard)

**Did:** Added a launch-audit regression check for the no-long-day-end-copy policy.

**Changed:**
- `ultimate-berlin-trip-planner/launch-audit.mjs` — now blocks if `Later`/`Evening` closing blocks regain copy, `dayBlockCopy()` stops blanking closers, or legacy `shortDayNote` / `bw-day-check` / `Local cue` hooks return.
- `ultimate-berlin-trip-planner/build-launch-control-room.mjs` — trims trailing whitespace from generated HTML output.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html`, `RESEARCH_BACKLOG.md` — regenerated/updated after the new audit check.
- Root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — updated latest status.

**Opened:** Ultimate remains draft/unpublished; 10 real Triggered Email IDs still block launch, Velo backend/job is not published, live endpoint smoke evidence is still missing, and BerlinTools CMS/blog remain unpublished.
**Closed:** `node --check` for the audit/control-room generator, launch audit now reports `87 pass, 1 warn, 1 block`, generated status/control-room refresh passed, and trailing-whitespace checks passed for the touched launch artifacts.

**Next session should:** Apply the 10 real email IDs when available, or continue product polish knowing the day-end text wall cannot quietly regress.

## 2026-05-31 — Codex (Ultimate pasted-ID builder)

**Did:** Added a dry-run-first helper that converts a pasted list of Wix editor URLs into the local message-ID JSON.

**Changed:**
- `ultimate-berlin-trip-planner/velo/build-message-ids-from-paste.mjs` — accepts `--from` or stdin, maps 10 raw URLs/IDs in manifest order or placeholder-labelled lines, extracts `/automations/edit/{id}/content/en`, validates duplicates/placeholders, and writes only with `--write`.
- `ultimate-berlin-trip-planner/LAUNCH_RUNBOOK.md`, `WIX_EMAIL_SETUP_TR.md`, `build-launch-status-report.mjs`, `build-launch-control-room.mjs`, `LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html`, `launch-audit.mjs`, `RESEARCH_BACKLOG.md` — documented/wired/audited the helper.
- `output/qa/ultimate-trip-planner-email/fake-pasted-message-ids.txt`, `fake-message-ids-from-paste.local.json` — QA fixtures/evidence.
- `output/qa/ultimate-trip-planner-remote-preflight/remote-preflight-2026-05-31T06-42-59-026Z.json` — latest remote preflight evidence.
- Root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — updated latest status.

**Opened:** Ultimate remains draft/unpublished; 10 real Triggered Email IDs still block launch, Velo backend/job is not published, live endpoint smoke evidence is still missing, and BerlinTools CMS/blog remain unpublished.
**Closed:** Builder syntax, fake 10-URL dry-run/write/check, duplicate-ID failure, status/control-room regeneration, remote preflight refresh, and launch audit passed with `86 pass, 1 warn, 1 block`.

**Next session should:** Use either the copy kit or the pasted-ID builder to create `message-ids.local.json`, then run the ID checker/apply helper and publish/smoke Velo.

## 2026-05-31 — Codex (Ultimate copy-kit setup cockpit)

**Did:** Upgraded the Triggered Email copy kit into a progress/validation cockpit for the 10 manual Wix templates.

**Changed:**
- `ultimate-berlin-trip-planner/email/build-triggered-email-html.mjs` — generator now emits progress checkboxes, counters, URL-to-ID extraction, duplicate/placeholder validation, reset progress, normalized JSON export, and localStorage persistence in the copy kit.
- `ultimate-berlin-trip-planner/email/paste-ready/copy-kit.html`, `README.md`, `manifest.json`, 10 paste-ready HTML files, `message-ids.template.json`, `preview.html` — regenerated from the source generator.
- `ultimate-berlin-trip-planner/LAUNCH_RUNBOOK.md`, `WIX_EMAIL_SETUP_TR.md`, `launch-audit.mjs`, `RESEARCH_BACKLOG.md` — documented/audited the new copy-kit behavior.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `LAUNCH_CONTROL_ROOM.html` — regenerated after latest audit/preflight.
- `output/qa/ultimate-trip-planner-email/copy-kit-progress-20260531.png` — desktop screenshot after duplicate-ID smoke.
- `output/qa/ultimate-trip-planner-remote-preflight/remote-preflight-2026-05-31T06-37-21-249Z.json` — latest remote preflight evidence.
- Root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — updated latest status.

**Opened:** Ultimate remains draft/unpublished; 10 real Triggered Email IDs still block launch, Velo backend/job is not published, live endpoint smoke evidence is still missing, and BerlinTools CMS/blog remain unpublished.
**Closed:** Generator syntax/regeneration, desktop headless interaction smoke with duplicate-ID detection, 390px mobile overflow smoke, targeted `diff --check`, remote preflight refresh, and launch audit passed with `84 pass, 1 warn, 1 block`.

**Next session should:** Use the upgraded copy kit while creating the 10 dashboard templates, export `message-ids.local.json`, run the ID checker/apply helper, then publish/smoke Velo.

## 2026-05-31 — Codex (Ultimate Triggered Email API check)

**Did:** Checked current Wix docs and documented why the remaining Triggered Email template creation step is still manual.

**Changed:**
- `ultimate-berlin-trip-planner/TRIGGERED_EMAIL_API_NOTES.md` — official-docs note: Wix documents sending already-created Triggered Emails and managing automations, but not creating Triggered Email template HTML/content through a stable API.
- `ultimate-berlin-trip-planner/LAUNCH_RUNBOOK.md`, `build-launch-control-room.mjs`, `LAUNCH_CONTROL_ROOM.html`, `launch-audit.mjs`, `RESEARCH_BACKLOG.md`, `AGENTS.md` — linked/wired the note.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json` — regenerated after latest audit/preflight.
- `output/qa/ultimate-trip-planner-remote-preflight/remote-preflight-2026-05-31T06-29-09-272Z.json` — latest remote preflight evidence.
- Root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — updated latest status.

**Opened:** Ultimate remains draft/unpublished; 10 real Triggered Email IDs still block launch, Velo backend/job is not published, live endpoint smoke evidence is still missing, and BerlinTools CMS/blog remain unpublished.
**Closed:** Wix docs check, API note wiring, JS syntax checks, generated status/control-room refresh, remote preflight refresh, and launch audit passed with `84 pass, 1 warn, 1 block`.

**Next session should:** Create the 10 dashboard templates with the copy kit, fill `message-ids.local.json`, run the ID checker/apply helper, then publish/smoke Velo.

## 2026-05-31 — Codex (Ultimate email ID checker)

**Did:** Added a read-only progress checker for the 10 Wix Triggered Email message IDs.

**Changed:**
- `ultimate-berlin-trip-planner/velo/check-triggered-email-ids.mjs` — validates `message-ids.local.json`, accepts raw IDs or Wix editor URLs, reports missing/placeholder/duplicate/not-applied IDs, and supports `--json` plus `--require-applied`.
- `ultimate-berlin-trip-planner/LAUNCH_RUNBOOK.md`, `WIX_EMAIL_SETUP_TR.md`, `email/paste-ready/README.md`, `velo/README.md` — added the check command before/after the apply helper.
- `ultimate-berlin-trip-planner/build-launch-control-room.mjs`, `LAUNCH_CONTROL_ROOM.html`, `build-launch-status-report.mjs`, `LAUNCH_STATUS.md`, `LAUNCH_STATUS.json`, `launch-audit.mjs`, `RESEARCH_BACKLOG.md` — wired and audited the checker.
- Root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — updated latest status.

**Opened:** Ultimate remains draft/unpublished; 10 real Triggered Email IDs still block launch, Velo backend/job is not published, live endpoint smoke evidence is still missing, and BerlinTools CMS/blog remain unpublished.
**Closed:** Checker syntax, missing-file check, template-placeholder check, generated status/control-room refresh, and launch audit passed with `82 pass, 1 warn, 1 block`.

**Next session should:** Fill `message-ids.local.json` from the Wix email templates, run `check-triggered-email-ids.mjs`, apply IDs, then publish/smoke Velo.

## 2026-05-31 — Codex (Ultimate launch gate refresh)

**Did:** Refreshed Ultimate launch readiness and confirmed the Turkish Wix email handoff is part of the audited package.

**Changed:**
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json` — regenerated after the latest remote preflight.
- `ultimate-berlin-trip-planner/LAUNCH_CONTROL_ROOM.html` — regenerated from the current dashboard model.
- `output/qa/ultimate-trip-planner-remote-preflight/remote-preflight-2026-05-31T06-17-26-213Z.json` — latest remote preflight evidence.
- Root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — updated latest status.

**Opened:** Ultimate remains draft/unpublished; 10 real Triggered Email IDs still block launch, Velo backend/job is not published, live endpoint smoke evidence is still missing, and BerlinTools CMS/blog remain unpublished.
**Closed:** JS syntax checks, status/control-room regeneration, targeted `diff --check`, remote preflight refresh, and launch audit passed with `80 pass, 1 warn, 1 block`.

**Next session should:** Open `WIX_EMAIL_SETUP_TR.md` and `email/paste-ready/copy-kit.html`, create/apply the 10 Triggered Email IDs, publish/smoke Velo, and continue the runbook.

## 2026-05-31 — Codex (Ultimate launch status report)

**Did:** Added a generated launch status report for the Ultimate planner package.

**Changed:**
- `ultimate-berlin-trip-planner/build-launch-status-report.mjs` — generator for Markdown/JSON status.
- `ultimate-berlin-trip-planner/LAUNCH_STATUS.md`, `LAUNCH_STATUS.json` — current launch verdict, gates, audit, preflight, smoke, visibility, blog package, blockers/warnings, and next actions.
- `ultimate-berlin-trip-planner/build-launch-control-room.mjs`, `LAUNCH_CONTROL_ROOM.html` — links the status report from the local dashboard.
- `ultimate-berlin-trip-planner/LAUNCH_RUNBOOK.md`, `launch-audit.mjs`, `RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — documented and audited the report.
- `output/qa/ultimate-trip-planner-remote-preflight/remote-preflight-2026-05-31T06-10-53-681Z.json` — latest remote preflight evidence.

**Opened:** Ultimate remains draft/unpublished; 10 real Triggered Email IDs still block launch, Velo backend/job is not published, live endpoint smoke evidence is still missing, and BerlinTools CMS/blog remain unpublished.
**Closed:** Report script syntax, generated Markdown/JSON, status/control-room checks, targeted `diff --check`, remote preflight refresh, and launch audit passed with `78 pass, 1 warn, 1 block`.

**Next session should:** Use `LAUNCH_STATUS.md` as the single status readout, then create/apply Triggered Email IDs, publish/smoke Velo, and continue the runbook.

## 2026-05-31 — Codex (Ultimate visibility release guard)

**Did:** Added a protected dry-run-first helper for the final Ultimate public visibility flip.

**Changed:**
- `ultimate-berlin-trip-planner/release-visibility.mjs` — removes draft visibility only after guarded gates pass; supports optional homepage shortcut and widgets SEO regeneration.
- `ultimate-berlin-trip-planner/build-launch-control-room.mjs`, `LAUNCH_CONTROL_ROOM.html` — added visibility-release command block.
- `ultimate-berlin-trip-planner/LAUNCH_RUNBOOK.md`, `launch-audit.mjs`, `RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — documented and audited the helper.
- `output/qa/ultimate-trip-planner-remote-preflight/remote-preflight-2026-05-31T06-05-38-535Z.json` — latest remote preflight evidence.

**Opened:** Ultimate remains draft/unpublished; 10 real Triggered Email IDs still block launch, Velo backend/job is not published, live endpoint smoke evidence is still missing, and BerlinTools CMS/blog remain unpublished.
**Closed:** Helper syntax, dry-run output, guarded `--write` refusal, control-room regeneration, targeted `diff --check`, remote preflight refresh, and launch audit passed with `74 pass, 1 warn, 1 block`.

**Next session should:** Create/apply the 10 Wix Triggered Email IDs, publish/smoke Velo, insert the CMS row, then run `release-visibility.mjs` after its gates pass.

## 2026-05-31 — Codex (Ultimate launch control room)

**Did:** Added a local launch dashboard for the remaining Ultimate planner handoff.

**Changed:**
- `ultimate-berlin-trip-planner/build-launch-control-room.mjs` — generator for the local launch dashboard.
- `ultimate-berlin-trip-planner/LAUNCH_CONTROL_ROOM.html` — local status/control page linking the email copy kit, Velo install kit, runbook, message-ID commands, live-smoke commands, CMS insert commands, and current launch state cards.
- `ultimate-berlin-trip-planner/LAUNCH_RUNBOOK.md`, `launch-audit.mjs`, `RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — documented and audited the control room.
- `output/qa/ultimate-trip-planner-remote-preflight/remote-preflight-2026-05-31T06-00-05-838Z.json` — latest remote preflight evidence.

**Opened:** Ultimate remains draft/unpublished; 10 real Triggered Email IDs still block launch, Velo backend/job is not published, live endpoint smoke evidence is still missing, and BerlinTools CMS/blog remain unpublished.
**Closed:** Generator syntax, generated control room, static coverage check, targeted `diff --check`, remote preflight refresh, and launch audit passed with `72 pass, 1 warn, 1 block`.

**Next session should:** Open `LAUNCH_CONTROL_ROOM.html`, create/apply the 10 Wix Triggered Email IDs, paste/publish Velo via `velo/install-kit.html`, then run `live-smoke-trip-planner.mjs --live --email ...` and `--booking`.

## 2026-05-31 — Codex (Ultimate Velo install kit)

**Did:** Added a local Wix Developer Tools install kit for the Ultimate planner Velo backend.

**Changed:**
- `ultimate-berlin-trip-planner/velo/build-velo-install-kit.mjs` — generator for `velo/install-kit.html`.
- `ultimate-berlin-trip-planner/velo/install-kit.html` — local admin page with copy buttons for `Backend/tripPlannerFunnel.js`, the `Backend/http-functions.js` merge source, `jobs.config`, and smoke commands.
- `ultimate-berlin-trip-planner/velo/README.md`, `LAUNCH_RUNBOOK.md`, `launch-audit.mjs`, `RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — documented and audited the kit.
- `output/qa/ultimate-trip-planner-remote-preflight/remote-preflight-2026-05-31T05-52-25-394Z.json` — latest remote preflight evidence.

**Opened:** Ultimate remains draft/unpublished; 10 real Triggered Email IDs still block launch, Velo backend/job is not published, live endpoint smoke evidence is still missing, and BerlinTools CMS/blog remain unpublished.
**Closed:** Generator syntax, generated install kit, static kit coverage check, targeted `diff --check`, remote preflight refresh, and launch audit passed with `69 pass, 1 warn, 1 block`.

**Next session should:** Create/apply the 10 Wix Triggered Email IDs, regenerate/open `velo/install-kit.html`, paste/publish Velo, then run `live-smoke-trip-planner.mjs --live --email ...` and `--booking`.

## 2026-05-31 — Codex (Ultimate email copy kit)

**Did:** Added a local one-page copy kit for creating the 10 Ultimate Wix Triggered Email templates.

**Changed:**
- `ultimate-berlin-trip-planner/email/build-triggered-email-html.mjs` — now generates `email/paste-ready/copy-kit.html`.
- `ultimate-berlin-trip-planner/email/paste-ready/copy-kit.html` — local admin page with subject/preheader/HTML copy buttons, message-ID inputs, JSON copy/download builder.
- `ultimate-berlin-trip-planner/email/paste-ready/README.md`, `LAUNCH_RUNBOOK.md`, `launch-audit.mjs`, `RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — documented and audited the copy kit.
- `output/qa/ultimate-trip-planner-email/copy-kit-20260531.png` — headless Chrome render evidence.

**Opened:** Ultimate remains draft/unpublished; the 10 real Triggered Email IDs still block launch, Velo backend/job is not published, live endpoint smoke evidence is still missing, and the BerlinTools CMS row/blog remain unpublished.
**Closed:** Generator syntax/regeneration, copy-kit static counts, headless Chrome render, targeted `diff --check`, and launch audit passed with `66 pass, 1 warn, 1 block`.

**Next session should:** Use `copy-kit.html` while creating the 10 Wix Triggered Email templates, export/fill `message-ids.local.json`, apply IDs with the helper, then publish/smoke Velo.

## 2026-05-31 — Codex (Ultimate planner launch prep)

**Did:** Added launch handoff/preflight helpers and created the live lead collection.

**Changed:**
- `ultimate-berlin-trip-planner/LAUNCH_RUNBOOK.md` — step-by-step launch order for Triggered Emails, Velo, smoke tests, CMS visibility, and blog publish.
- `ultimate-berlin-trip-planner/launch-remote-preflight.mjs` — non-mutating remote check for GitHub Pages, Wix dynamic page, Velo endpoint OPTIONS, BerlinTools slug, and `TripPlannerLeads`.
- `ultimate-berlin-trip-planner/velo/create-trip-planner-leads-collection.mjs` — dry-run-first helper that creates/verifies the Wix Data collection.
- `ultimate-berlin-trip-planner/launch-audit.mjs`, `velo/README.md`, `RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — wired and documented the new launch prep.
- Wix CMS: created `TripPlannerLeads` via REST; live run verified 64 expected fields.
- `output/qa/ultimate-trip-planner-collection/`, `output/qa/ultimate-trip-planner-remote-preflight/` — dry/live evidence JSON.

**Opened:** Ultimate remains draft/unpublished; the 10 real Triggered Email IDs still block launch, Velo backend/job is not published, live endpoint smoke evidence is still missing, and the BerlinTools CMS row/blog remain unpublished.
**Closed:** Collection helper syntax/dry-run/live run, remote preflight after collection creation (`TripPlannerLeads` exists, BerlinTools slug free, endpoints not published), targeted `diff --check`, CMS insert dry-run, and launch audit passed with `64 pass, 1 warn, 1 block`.

**Next session should:** Create/apply real Triggered Email IDs, publish the Velo files/job, rerun remote preflight/audit, then run `live-smoke-trip-planner.mjs --live --email ...` and `--booking`.

## 2026-05-31 — Codex (Ultimate planner live smoke helper)

**Did:** Added a dry-run-first smoke helper for the live Velo endpoints.

**Changed:**
- `ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs` — builds full `tripPlannerLead` payloads, optional `tripPlannerBooking` payloads, dry-runs by default, requires `--live --email ...` before calling Wix, and records JSON output under `output/qa/ultimate-trip-planner-live-smoke/`.
- `ultimate-berlin-trip-planner/velo/README.md`, `launch-audit.mjs`, `RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — documented and wired the helper into launch readiness.
- `output/qa/ultimate-trip-planner-live-smoke/dry-run-script-20260531.json` — dry-run evidence with no network responses.

**Opened:** Ultimate remains draft/unpublished; real Wix Triggered Email IDs still need to replace the 10 `TODO_TRIP_PLANNER_*` placeholders, then actual live `tripPlannerLead` and `tripPlannerBooking` smokes are required.
**Closed:** Smoke helper syntax, dry-run with lead+booking payload, targeted `diff --check`, dry-run JSON inspection, and launch audit passed with `46 pass, 1 warn, 1 block`.

**Next session should:** Create/apply real Triggered Email IDs, publish Velo, rerun launch audit, then run `live-smoke-trip-planner.mjs --live --email ...` and `--booking`.

## 2026-05-31 — Codex (Ultimate planner email ID helper)

**Did:** Added a dry-run-first helper for applying the 10 Wix Triggered Email message IDs.

**Changed:**
- `ultimate-berlin-trip-planner/velo/apply-triggered-email-ids.mjs` — validates raw IDs or Wix editor URLs, extracts `/automations/edit/{messageId}/content`, checks duplicates/placeholders, dry-runs by default, and updates `tripPlannerFunnel.js` only with `--write`.
- `ultimate-berlin-trip-planner/email/build-triggered-email-html.mjs`, `email/paste-ready/message-ids.template.json`, `email/paste-ready/README.md` — generator now emits the message-ID template and documents the apply workflow.
- `.gitignore` — ignores local message-ID JSON files under `email/paste-ready/`.
- `ultimate-berlin-trip-planner/launch-audit.mjs`, `email/README.md`, `velo/README.md`, `RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — wired/documented the helper and latest audit.
- `output/qa/ultimate-trip-planner-email/fake-message-ids.json` — QA fixture for dry-run validation.

**Opened:** Ultimate remains draft/unpublished; real Wix Triggered Email IDs still need to replace the 10 `TODO_TRIP_PLANNER_*` placeholders, then live endpoint smoke tests are required.
**Closed:** Generator/apply-script syntax, targeted `diff --check`, expected failure with placeholder template, successful fake-ID dry-run with Wix URL extraction, no accidental source replacement, and launch audit passed with `45 pass, 1 warn, 1 block`.

**Next session should:** Create the 10 Wix Triggered Email templates from `email/paste-ready/README.md`, run `apply-triggered-email-ids.mjs` with real IDs, rerun launch audit, then live-test `/_functions/tripPlannerLead` and `/_functions/tripPlannerBooking`.

## 2026-05-31 — Codex (Ultimate planner email HTML package)

**Did:** Turned the 10 Ultimate planner email markdown drafts into a Wix paste-ready Triggered Email package.

**Changed:**
- `ultimate-berlin-trip-planner/email/build-triggered-email-html.mjs` — generator for table/inline-CSS HTML blocks from the markdown source.
- `ultimate-berlin-trip-planner/email/paste-ready/` — generated 10 HTML blocks, `manifest.json`, `README.md`, and `preview.html`.
- `ultimate-berlin-trip-planner/email/README.md`, `velo/README.md`, `launch-audit.mjs`, `RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — documented workflow and wired the package into launch audit.
- `output/qa/ultimate-trip-planner-email/paste-ready-preview-20260531.png` — headless Chrome preview screenshot.

**Opened:** Ultimate remains draft/unpublished; real Wix Triggered Email message IDs still need to replace the 10 `TODO_TRIP_PLANNER_*` placeholders, then live endpoint smoke tests are required.
**Closed:** Generator syntax, targeted `diff --check`, paste-ready forbidden-tag scan, headless Chrome preview render, and launch audit passed with `43 pass, 1 warn, 1 block`; the block remains the expected missing real message IDs.

**Next session should:** Create the 10 Wix Triggered Email templates from `email/paste-ready/README.md`, paste message IDs into `velo/tripPlannerFunnel.js`, rerun `node ultimate-berlin-trip-planner/launch-audit.mjs`, then live-test `/_functions/tripPlannerLead` and `/_functions/tripPlannerBooking`.

## 2026-05-31 — Codex (Ultimate planner launch audit)

**Did:** Added a local audit script that turns the remaining launch checklist into command output.

**Changed:**
- `ultimate-berlin-trip-planner/launch-audit.mjs` — checks required artifacts, TODO Triggered Email IDs, email/Velo variables, Velo endpoints and scheduler, booking-aware fail-closed behavior, draft visibility, local-only QA params, PDF/Route Deck/Day Jump markers, blog body hygiene, CMS insert helper, and live-smoke evidence.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded audit scope and latest result.

**Opened:** Ultimate remains draft/unpublished; the 10 `TODO_TRIP_PLANNER_*` message IDs still block launch until real Wix Triggered Email IDs are pasted. Live Wix smoke evidence still has to be produced after publish.
**Closed:** `node --check`, targeted `git diff --check`, and `node ultimate-berlin-trip-planner/launch-audit.mjs` passed the script itself; latest audit result is `37 pass, 1 warn, 1 block` with the one block expected.

**Next session should:** Replace the Triggered Email placeholders, rerun the audit, then move to live `/_functions/tripPlannerLead` and `/_functions/tripPlannerBooking` smoke tests.

## 2026-05-31 — Codex (Ultimate planner PDF overview)

**Did:** Made the exported PDF feel more like a real plan document by adding a dedicated itinerary overview page.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `drawItineraryOverviewPage()` with BerlinWalk logo header, trip code, sales/booked tour summary, linked Day 1-7 mini cards with photos/anchors, and a `How to use this PDF` note before the detailed day cards.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded behavior and QA.
- `output/qa/ultimate-trip-planner-pdf/overview-20260531/overview-7day-contact-sheet.png`, `overview-3day-booked-contact-sheet.png` — rendered PDF QA evidence.

**Opened:** Ultimate remains draft/unpublished; product polish and launch prep remain open.
**Closed:** Inline JS parse, `diff --check`, headless Chrome 7-day sales PDF download/render (14 pages, overview labels present, stale cue/note text absent), 3-day booked PDF download/render (9 pages, booked copy present, sales booking line absent), contact-sheet visual inspection, and Chrome cleanup passed.

**Next session should:** Continue product polish or move into launch-readiness audit; do not publish/push until Yusuf explicitly asks.

## 2026-05-31 — Codex (Ultimate planner Day Jump Bar)

**Did:** Added a compact unlocked full-plan index so the long itinerary is easier to use on phone.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `data-day-jump-bar`, Day Jump Bar CSS, `dayJump*` helpers, focused-card styling, `[data-day-jump-day]` click handling, and Route Deck jump sync.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded behavior and QA.
- `output/qa/ultimate-trip-planner-ui/day-jump-bar-desktop-20260531.png`, `day-jump-bar-mobile-390-20260531.png`, `day-jump-desktop-20260531.png`, `day-jump-mobile-390-20260531.png` — visual/interaction QA screenshots.

**Opened:** Ultimate remains draft/unpublished; product polish and launch prep remain open.
**Closed:** Inline JS parse, `diff --check`, in-app browser locked read (`0` day-jump buttons, overflow `0`), headless desktop fail-soft unlock/click (`7` buttons, Day 5 active/focused, PDF enabled, overflow `0`), true 390px mobile fail-soft unlock/click (`Day 7` active/focused, two-column grid, overflow `0`), bar screenshot inspection, and Chrome cleanup passed.

**Next session should:** Continue product polish toward launch readiness; do not publish/push until Yusuf explicitly asks.

## 2026-05-31 — Codex (Ultimate planner Dashboard Lens)

**Did:** Reworked the result plan board into a segmented Dashboard so the preview feels less like a long stack of modules.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `boardLens`, `.bw-board-tabs`, `boardLensMeta()`, `boardTabsHtml()`, and `[data-board-lens]` click handling. The plan board now shows one active lens: `Route` (map/media, map brief, trip spine), `Prep` (base, budget, interests, pace, weather/openings), or `Review` (health, checklist, radar, confidence, swaps, fixes).
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded behavior and QA.
- `output/qa/ultimate-trip-planner-ui/dashboard-lens-desktop-20260531.png`, `dashboard-lens-mobile-390-20260531.png` — visual QA screenshots.

**Opened:** Ultimate remains draft/unpublished; product polish and launch prep remain open.
**Closed:** Inline JS parse, `diff --check`, in-app browser route/prep/review read/click smoke, headless Chrome desktop and true 390px mobile lens-switch smokes (correct section counts, active tab state, overflow `0`), fail-soft unlock after switching to Prep (`fullDays: 7`, Route Deck jump, PDF enabled, overflow `0`), and Chrome cleanup passed.

**Next session should:** Continue toward launch-readiness/product polish; do not publish/push until Yusuf explicitly asks.

## 2026-05-31 — Codex (Ultimate planner Route Deck)

**Did:** Added an interactive Route Deck so the trip preview feels more like a visual route control panel.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `data-route-deck`, Route Deck CSS, `routeDeck*` helpers, selectable Day 1-7 buttons, focus photo/anchor/watch chips, Google Maps day action, selected-day jump after unlock, and `data-day-card` anchors in the full plan. Also fixed narrow Trip Pass route-line wrapping.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded behavior and QA.
- `output/qa/ultimate-trip-planner-ui/route-deck-desktop-20260531.png`, `route-deck-mobile-390-20260531.png`, `route-deck-focus-desktop-20260531.png`, `route-deck-focus-mobile-20260531.png` — visual QA screenshots.

**Opened:** Ultimate remains draft/unpublished; more visual/product polish and launch prep remain open.
**Closed:** Inline JS parse, `diff --check`, in-app browser locked/mobile-ish read (`7` day buttons, loaded photo, 3 anchors, overflow `0`), headless Chrome desktop 7-day click/unlock smoke (`Day 4` switches active route, fail-soft unlock gives 7 full days, jump button, PDF enabled, overflow `0`), true 390px mobile emulation (`Day 7` Potsdam transit route, overflow `0`), and Chrome cleanup passed.

**Next session should:** Continue toward a launch-readiness/product-polish audit; do not publish/push until Yusuf explicitly asks.

## 2026-05-31 — Codex (Ultimate planner PDF photo polish)

**Did:** Extended real-photo visual polish into the exported PDF.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added cached PDF image loading (`loadImageDataUrl()`, `loadDayPhotoDataUrls()`), `drawPdfPhoto()`, `drawPdfPhotoStrip()`, a cover `Route snapshots` strip, and photo thumbnails in PDF day-card visual bands with fallback color tiles.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded behavior and QA.
- `output/qa/ultimate-trip-planner-pdf/photo-postcards-20260531/photo-postcards-7day.pdf`, rendered page PNGs, and `photo-postcards-7day-contact-sheet.png` — PDF visual QA evidence.

**Opened:** Ultimate remains draft/unpublished; launch tasks and more product polish remain open.
**Closed:** Inline script parse, `diff --check`, headless Chrome 7-day fail-soft PDF smoke (`PDF downloaded.`, `fullDays: 7`, `photos: 14`, overflow `0`), `pypdfium2` render of 13 pages, visual contact-sheet inspection, and text extraction checks (`Route snapshots` / `Day-by-Day Plan` present; `Local cue` / `Note:` absent) passed.

**Next session should:** Continue with route-board/interaction polish or launch-readiness audit; do not publish/push until Yusuf asks.

## 2026-05-31 — Codex (Ultimate planner photo postcards)

**Did:** Added real-photo postcard visuals to make day cards feel less text-only and more like a trip plan object.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `DAY_PHOTOS`, `assetUrl()`, `dayPhotoForType()`, `dayPhotoHtml()`, `.bw-day-photo*` CSS, mobile stacking, and print photo strips. Preview/full-plan day cards now use real BerlinWalk/gallery photos with a day-icon overlay instead of only SVG art.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded behavior and QA.
- `output/qa/ultimate-trip-planner-ui/photo-postcards-desktop-20260531.png`, `photo-postcards-mobile-20260531.png`, `photo-postcards-preview-crop-20260531.png` — visual QA screenshots.

**Opened:** Ultimate remains draft/unpublished; broader visual/PDF polish and launch tasks remain open.
**Closed:** Inline script parse, `diff --check`, asset existence checks, in-app browser locked smoke, headless desktop/mobile locked and fail-soft unlocked smokes (`14/14` photos loaded after unlock, overflow `0`, `closeRowsWithCopy: 0`), print HTML photo-source check, and PDF button smoke (`PDF downloaded.`) passed.

**Next session should:** Continue with a PDF/day-card visual pass or a stronger route-board view; keep reducing prose density.

## 2026-05-31 — Codex (Ultimate planner day-end trim cleanup)

**Did:** Removed the dead day-end note path after Yusuf called out the long repeated end-of-day text.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — removed `.bw-day-check`, `shortDayNote()`, UI/text/PDF/print `Local cue`/`Note` render slots; `Later`/`Evening` closers stay title-only.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded the final day-end copy policy and QA.

**Opened:** Ultimate remains draft/unpublished; visual/product polish and launch tasks remain open.
**Closed:** Inline script parse, `diff --check`, source search for old hooks, and headless Chrome 7-day fail-soft unlock passed: `fullDays: 7`, `closeRows: 7`, `closeRowsWithCopy: 0`, `dayChecks: 0`, no `Local cue`/`Note` day-card text, stale long phrases absent, overflow `0`, PDF enabled.

**Next session should:** Continue Ultimate polish; use risk chips, Smart Fixes, Weather/Openings, and Berlin Essentials for exceptions instead of day-end paragraphs.

## 2026-05-31 — Codex (Ultimate planner PDF visual regression)

**Did:** Ran a real PDF visual regression pass after the Trip Pass, Day Rhythm, and Phone Carry Pack additions.

**Changed:**
- `output/qa/ultimate-trip-planner-pdf/live-regression-20260531/` — generated fresh `carry-3day-sales.pdf`, `carry-7day-booked.pdf`, page PNGs, and contact sheets.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded the PDF QA evidence.

**Opened:** Ultimate remains draft/unpublished; launch tasks and any later visual polish remain open.
**Closed:** Headless Chrome downloaded the 3-day sales PDF and 7-day booked/stress PDF; `pypdfium2` rendered all pages to PNG. Contact sheets show no visible overlap/clipping, BerlinWalk logo present, Phone Carry Pack and Day Rhythm present, Essentials clean; text extraction found `Phone carry pack` / Day Rhythm content and no stale `Local cue`.

**Next session should:** Continue Ultimate polish or launch prep; do not publish/push until Yusuf explicitly asks.

## 2026-05-31 — Codex (Ultimate planner Phone Carry Pack)

**Did:** Added an unlocked phone-ready action hub so users can carry the plan as link/map/tour/PDF actions instead of hunting through separate buttons.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `data-carry-pack`, `.bw-carry-*` UI, `carryPackItems()` / `carryPackHtml()` / `carryPackSummary()`, Carry Pack rendering after the Trip Pass, copy/PDF carry actions, text export lines, print section, and a PDF cover-flow card.
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js`, `velo/README.md`, `email/README.md`, `email/e0-instant-plan.md`, `email/booked-e0-instant-plan.md` — added/stored/exposed `${carryPack}` and included it in instant sales/booked emails.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded scope and QA.

**Opened:** Ultimate remains draft/unpublished; broader visual/product polish is still open.
**Closed:** Inline script parse, transformed Velo syntax, `diff --check`, headless locked hidden-state smoke, forced fail-soft unlock 4-action smoke (`Exact plan`, `Route map`, `Tour hold`, `Carry PDF`), copy action, clean lead-payload intercept (`carryPack` present), print capture, PDF status `PDF downloaded.`, mobile-width 390px overflow `0`, and booked-state smoke (`Tour prep`, no calendar download, meeting link present) passed.

**Next session should:** Continue Ultimate polish; do not publish/push until Yusuf explicitly asks.

## 2026-05-31 — Codex (Ultimate planner Day Rhythm)

**Did:** Added compact per-day rhythm bars so each day communicates load, movement, buffer, and night intensity without more prose.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `dayRhythmItems()` / `dayRhythmHtml()` / `dayRhythmSummary()` and `.bw-day-rhythm` UI; preview and full-plan cards now show `Load / Move / Buffer / Night` bars, text export includes the summary, PDF day cards draw rhythm bars, and print output captures the same bars.
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js`, `velo/README.md`, `email/README.md`, `email/e0-instant-plan.md`, `email/booked-e0-instant-plan.md` — added/stored/exposed `${dayRhythm}` and included it in instant sales/booked emails.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded scope and QA.

**Opened:** Ultimate remains draft/unpublished; broader visual/product polish is still open.
**Closed:** Inline script parse, transformed Velo syntax, `diff --check`, headless desktop locked 7-day rhythm smoke (2 preview rhythm panels / 8 items, overflow `0`), forced fail-soft unlock (7 preview rhythms + 7 full-plan rhythms / 28 full rhythm items, PDF status `PDF downloaded.`), clean lead-payload intercept (`dayRhythm` present), print capture, and mobile-width 390px fail-soft unlock (7 full rhythms, overflow `0`) passed.

**Next session should:** Continue Ultimate polish; do not publish/push until Yusuf explicitly asks.

## 2026-05-31 — Codex (Ultimate planner preview-flow trim)

**Did:** Replaced the remaining long preview-day paragraph with compact visual action chips.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `.bw-preview-flow` cards and `previewDayFlowHtml()`; preview days now show `Route / Anchors / Watch` chips with a Google Maps route action, place anchors, and first risk state instead of a first-block prose paragraph. Icon/text CSS is scoped so chip icons stay white.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded behavior and QA.

**Opened:** Ultimate remains draft/unpublished; broader visual/product polish is still open.
**Closed:** Inline script parse, `diff --check`, headless desktop locked 7-day preview smoke (2 flows / 6 chips, zero preview paragraphs, Google Maps `api=1`, overflow `0`), forced fail-soft unlock smoke (7 flows / 21 chips, zero preview paragraphs, PDF status `PDF downloaded.`), and mobile-width 390px locked smoke passed.

**Next session should:** Continue Ultimate polish; do not publish/push until Yusuf explicitly asks.

## 2026-05-31 — Codex (Ultimate planner Trip Pass exports)

**Did:** Reused the Trip Pass identity across text export, print, and PDF.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `tripPassData()` as the shared source; `planText()` now includes pass code, pass route, and pass map; print output includes a dark-green Trip Pass block; PDF cover flow draws a branded Trip Pass card with stats and day dots.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded behavior and QA.

**Opened:** Ultimate remains draft/unpublished; broader visual/product polish is still open.
**Closed:** Inline script parse, `diff --check`, headless 7-day screen/print/PDF smoke (1 pass, 3 stats, 7 day icons, Google Maps `api=1`, overflow `0`, print HTML includes pass/code/map action and invokes print, PDF status `PDF downloaded.`) passed.

**Next session should:** Continue Ultimate polish; do not publish/push until Yusuf explicitly asks.

## 2026-05-31 — Codex (Ultimate planner Trip Pass visual)

**Did:** Added a compact Trip Pass visual to make the result preview feel more like a travel document.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `data-trip-pass`, Trip Pass CSS, and `tripPassHtml()` / `renderTripPass()`; the result now shows a deterministic pass code, arrival, base, tour slot, day-icon route line, and Google Maps overview action without extra explanatory prose.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded behavior and QA.

**Opened:** Ultimate remains draft/unpublished; broader visual/product polish is still open.
**Closed:** Inline script parse, `diff --check`, headless Chrome desktop 3-day smoke (1 pass, 3 stats, 3 day icons, Google Maps `api=1`, overflow `0`), mobile-width 390px 7-day smoke (1 pass, 7 day icons, overflow `0`), and PDF button smoke (`PDF downloaded.`) passed.

**Next session should:** Continue Ultimate polish; do not publish/push until Yusuf explicitly asks.

## 2026-05-31 — Codex (Ultimate planner no day-end notes + draft visibility)

**Did:** Removed repeated day-end note boxes and made the live widgets Custom Element respect draft status.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — `shortDayNote()` now returns empty, so UI/text export/PDF/print no longer append repeated `Local cue` / `Note` boxes after day cards; final `Later`/`Evening` rows remain title-only.
- `widgets-hub/widgets-hub-element.js` — filters out `hidden`, `published: false`, and `status: "draft"` tools before rendering/counting cards and before theme-snippet lookup.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded behavior and QA.

**Opened:** Ultimate remains draft/unpublished; broader visual/product polish is still open.
**Closed:** Inline script parse, widgets hub syntax, JSON parse, `diff --check`, draft visibility audit (`visibleCount: 30`, `visibleHasUltimate: false`), headless 7-day fail-soft unlock no-cue smoke (`fullDays: 7`, `closeRowsWithCopy: 0`, `dayChecks: 0`, note boxes `0`, overflow `0`), and PDF button smoke (`PDF downloaded.`) passed.

**Next session should:** Continue Ultimate polish; do not publish/push until Yusuf explicitly asks.

## 2026-05-31 — Codex (Ultimate planner lead gate QA hardening)

**Did:** Hardened local QA hooks and verified the lead gate/fail-soft unlock path.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added localhost-only `?resetUnlock=1` and `?forceLeadError=1` QA params; `unlock()` now clears stale lead messages after success/fail-soft.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded behavior and QA.

**Opened:** Ultimate remains draft/unpublished; broader polish is still open.
**Closed:** Inline script parse, transformed Velo syntax check, `diff --check`, fresh locked visit (full plan hidden, PDF/print disabled, 2 preview days), invalid email, missing consent, forced endpoint failure fail-soft unlock (3 full days, Essentials, PDF/print enabled, stale message cleared, overflow `0`, empty browser error log), and PDF button smoke (`PDF downloaded.`) passed.

**Next session should:** Continue Ultimate polish; do not publish/push until Yusuf explicitly asks.

## 2026-05-31 — Codex (Ultimate planner Berlin Essentials cards)

**Did:** Reworked Berlin Essentials into short visual carry cards.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — Essentials source now has label/cue/note fields; UI cards show icon + command + short note, text export includes cue text, print includes cue styling, and the PDF Essentials page uses a two-column cheat-sheet layout.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded behavior and QA.

**Opened:** Ultimate remains draft/unpublished; broader polish is still open.
**Closed:** Inline script parse, transformed Velo syntax check, `diff --check`, in-app browser Essentials smoke (8 cards, all cues/icons present, longest note 60 chars, overflow `0`, empty browser error log), and PDF button smoke (`PDF downloaded.`) passed.

**Next session should:** Continue Ultimate polish; do not publish/push until Yusuf explicitly asks.

## 2026-05-31 — Codex (Ultimate planner Travel Mode hero)

**Did:** Completed the near-arrival Travel Mode hero polish.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — fixed Travel Mode kicker cascade so the label stays brand yellow; text export now includes Travel Mode quick-check chips and first-route URL.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded behavior and QA.

**Opened:** Ultimate remains draft/unpublished; broader polish is still open.
**Closed:** Inline script parse, transformed Velo syntax check, `diff --check`, in-app browser tomorrow-arrival smoke (panel before map brief, 4 chips, 3 actions, yellow kicker, overflow `0`, empty browser error log), far-date smoke (Travel Mode absent), and PDF button smoke (`PDF downloaded.`) passed. Screenshot capture timed out in the in-app browser.

**Next session should:** Continue Ultimate polish; do not publish/push until Yusuf explicitly asks.

## 2026-05-31 — Codex (Ultimate planner day-end copy check)

**Did:** Rechecked whether end-of-day explanations are necessary and confirmed the product rule: close rows stay title-only.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — no new source change this pass; current code already routes UI/text/PDF/print close rows through `dayBlockCopy()` so final `Later`/`Evening` copy is suppressed.
- Root `SESSION_LOG.md` — logged the QA outcome.

**Opened:** Ultimate remains draft/unpublished; broader polish is still open.
**Closed:** Inline script parse, transformed Velo syntax check, `diff --check`, and in-app browser 7-day close-row smoke passed (`closeCount: 7`, `closeWithCopy: 0`, overflow `0`; only exception note was the short Sunday cue).

**Next session should:** Continue Ultimate polish; keep close rows title-only unless a short exception prevents a real visitor mistake.

## 2026-05-31 — Codex (Ultimate planner Weather & Openings Strategy)

**Did:** Added a compact Weather & Openings Strategy so existing weather/opening logic becomes a visual decision panel.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `weatherStrategy()` / `weatherStrategyHtml()` with four cards for weather source, opening rhythm, route bias, and final check; included it in result board, text export, print view, PDF cover flow, and lead payload.
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js`, `velo/README.md`, `email/README.md`, `email/e0-instant-plan.md`, `email/booked-e0-instant-plan.md`, `email/e3-one-day-before.md`, `email/booked-e3-one-day-before.md` — added/stored/exposed `${weatherStrategy}` and used it in instant + 1-day-before emails.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded scope and QA.

**Opened:** Ultimate remains draft/unpublished; broader polish is still open.
**Closed:** Inline script parse, transformed Velo syntax check, `diff --check`, in-app browser Monday/Sunday/future-climate smoke (4 cards, overflow `0`, empty browser errors), and PDF button smoke (`PDF downloaded.`) passed.

**Next session should:** Continue Ultimate polish; do not publish/push until Yusuf explicitly asks.

## 2026-05-31 — Codex (Ultimate planner day-end close caps)

**Did:** Made final day-end blocks explanation-free and styled them as compact visual close caps.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — source `Later`/`Evening` closing block copy is now empty, labels are shorter, UI close rows get a moon icon/compact styling, and print gets matching close-row styling.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md` — recorded the stricter no-closing-paragraph rule and latest QA.

**Opened:** Ultimate remains draft/unpublished; broader polish is still open.
**Closed:** Inline script parse, `diff --check`, in-app browser 7-day close-row smoke (`closeWithCopy: 0`, overflow `0`), and PDF button smoke (`PDF downloaded.`) passed.

**Next session should:** Continue Ultimate polish; keep day-ending copy title-only unless an exception prevents a real visitor mistake.

## 2026-05-31 — Codex (Ultimate planner Pace Guard)

**Did:** Added Pace Guard cards so group/pace choices visibly constrain the plan without adding prose.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `paceGuard()` / `paceGuardHtml()` with compact cards for day load, break rule, transfers, and night/close-to-base logic; included it in result board, text export, print view, and PDF cover flow. Also made PDF export lazy-load jsPDF if needed, timeout logo loading, and fail soft instead of hanging.
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js`, `velo/README.md`, `email/README.md`, `email/e0-instant-plan.md`, `email/booked-e0-instant-plan.md` — added/stored/exposed `${paceGuard}` and included it in instant sales/booked emails.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded scope and QA.

**Opened:** Ultimate remains draft/unpublished; more product polish can continue later.
**Closed:** Inline script parse, transformed Velo syntax check, `diff --check`, in-app browser family/gentle, packed/nightlife, and balanced/evening smoke (4 cards, overflow `0`, empty browser errors), and PDF button smoke (`PDF downloaded.`) passed.

**Next session should:** Continue Ultimate polish when Yusuf resumes; do not publish/push until he explicitly asks.

## 2026-05-31 — Codex (Ultimate planner Interest Lens)

**Did:** Added an Interest Lens so personalization is visible as day/anchor cards instead of more itinerary prose.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `interestLens()` / `interestLensHtml()` with compact cards mapping selected interests to plan days and Google Maps anchors; included it in result board, text export, print view, and PDF cover flow.
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js`, `velo/README.md`, `email/README.md`, `email/e0-instant-plan.md`, `email/booked-e0-instant-plan.md` — added/stored/exposed `${interestLens}` and included it in instant sales/booked emails.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded scope and QA.

**Opened:** Ultimate remains draft/unpublished; more product polish can continue later.
**Closed:** Inline script parse, transformed Velo syntax check, `diff --check`, in-app browser history/wall, museums/food/free, and nightlife/food/wall/museums smoke (2/3/4 cards, Google Maps anchor links, overflow `0`, empty browser errors), and PDF button smoke (`PDF downloaded.`) passed.

**Next session should:** Continue Ultimate polish when Yusuf resumes; do not publish/push until he explicitly asks.

## 2026-05-31 — Codex (Ultimate planner Budget Pulse)

**Did:** Added a compact Budget Pulse for spend/ticket/cash logic without adding itinerary prose.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `budgetPulse()` / `budgetPulseHtml()` with four compact cards for daily baseline, transit ticket, paid anchors, and cash/tips; included it in result board, text export, print view, and PDF cover flow.
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js`, `velo/README.md`, `email/README.md`, `email/e0-instant-plan.md`, `email/booked-e0-instant-plan.md` — added/stored/exposed `${budgetPulse}` and included it in instant sales/booked emails.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded scope and QA.

**Opened:** Ultimate remains draft/unpublished; more product polish can continue later.
**Closed:** Inline script parse, transformed Velo syntax check, `diff --check`, in-app browser low/smart/comfort spend-mode smoke (4 budget cards, daily budget link present, overflow `0`, empty browser errors), and PDF button smoke (`PDF downloaded.`) passed.

**Next session should:** Continue Ultimate polish when Yusuf resumes; do not publish/push until he explicitly asks.

## 2026-05-31 — Codex (Ultimate planner Base Camp Brief)

**Did:** Added a stay-area-aware Base Camp Brief and kept final day-end blocks short/title-only after Yusuf flagged repetition.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `baseCampProfile()` / `baseCampBrief()` / `baseCampBriefHtml()` with four compact cards for base anchor, first move, ticket logic, and late return; included Google Maps base/first-route actions and carried the brief into text export, print view, and PDF cover flow.
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js`, `velo/README.md`, `email/README.md`, `email/e0-instant-plan.md`, `email/booked-e0-instant-plan.md` — added/stored/exposed `${baseBrief}` and included it in instant sales/booked emails.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded scope and QA.

**Opened:** Ultimate remains draft/unpublished; more product polish can continue later.
**Closed:** Inline script parse, transformed Velo syntax check, `diff --check`, in-app browser 3/5/7-day east/west/unsure stay-area smoke (4 cards, title-only `Later`/`Evening` endings, overflow `0`, empty browser errors), and PDF button smoke (`PDF downloaded.`) passed. Screenshot capture timed out in the in-app browser.

**Next session should:** Continue Ultimate polish when Yusuf resumes; do not publish/push until he explicitly asks.

## 2026-05-31 — Codex (Ultimate planner Reservation Radar)

**Did:** Added a plan-level Reservation Radar for the actions that can actually change the trip.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `reservationRadar()` / `reservationRadarHtml()` with compact cards for BerlinWalk tour, museum/Reichstag-style timed checks, dinner/nightlife holds, Potsdam decisions, and Sunday/holiday errands; included it in result board, text export, print view, and PDF cover flow.
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js`, `velo/README.md`, `email/README.md`, `email/e0-instant-plan.md`, `email/booked-e0-instant-plan.md` — added/stored/exposed `${reservationRadar}` and included it in instant sales/booked emails.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded scope and QA.

**Opened:** Ultimate remains draft/unpublished; more product polish can continue later.
**Closed:** Inline script parse, transformed Velo syntax check, `diff --check`, in-app browser sales 3-day / booked 7-day / 1-day mobile-width smoke (booked path suppresses book link, overflow `0`, empty browser errors), and PDF button smoke (`PDF downloaded.`) passed.

**Next session should:** Continue Ultimate polish when Yusuf resumes; do not publish/push until he explicitly asks.

## 2026-05-31 — Codex (Ultimate planner daily operating notes)

**Did:** Added compact daily operating notes to make each itinerary day feel more actionable and less text-like.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added deterministic `Start`, `Transit`, `Reserve`, and `Backup` chips to preview/full-plan day cards; included the same notes in text export, print view, and PDF day cards.
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js`, `velo/README.md`, `email/README.md`, `email/e0-instant-plan.md`, `email/booked-e0-instant-plan.md` — added/stored/exposed `${dayOperations}` and included it in instant sales/booked emails.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded scope and QA.

**Opened:** Ultimate remains draft/unpublished; more product polish can continue later.
**Closed:** Inline script parse, transformed Velo syntax check, `diff --check`, in-app browser 1/5/7-day mobile-width smoke (`Start / Transit / Reserve / Backup`, overflow `0`, empty browser errors), and PDF button smoke (`PDF downloaded.`) passed. Screenshot capture timed out in the in-app browser.

**Next session should:** Continue Ultimate polish when Yusuf resumes; do not publish/push until he explicitly asks.

## 2026-05-31 — Codex (Ultimate planner scheduler hardening)

**Did:** Hardened the scheduled email processor for launch-scale and same-day signup edge cases.

**Changed:**
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js` — added paged due-lead fetching in 100-row batches and skipped reminder stages when the latest signup/update happened on the same Berlin calendar date.
- `ultimate-berlin-trip-planner/velo/README.md` — documented pagination and same-day duplicate-reminder suppression.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded the scheduler hardening and QA.

**Opened:** Ultimate remains draft/unpublished; Wix collection, Triggered Email IDs, scheduled job install, and live endpoint smoke tests remain.
**Closed:** `node --input-type=module --check`, `diff --check`, and standalone due-stage fixture checks passed.

**Next session should:** Continue Ultimate polish or prepare the Wix launch checklist when Yusuf explicitly asks; do not publish/push by default.

## 2026-05-31 — Codex (Ultimate planner reminder email signals)

**Did:** Made the scheduled email sequence reuse the new planner signals instead of sounding generic.

**Changed:**
- `ultimate-berlin-trip-planner/email/e1-seven-days-before.md`, `e2-three-days-before.md`, `e3-one-day-before.md`, `e4-arrival-day.md` — added concise `${planHealth}` / `${preArrivalChecklist}` blocks where useful in the sales path.
- `ultimate-berlin-trip-planner/email/booked-e1-seven-days-before.md`, `booked-e2-three-days-before.md`, `booked-e3-one-day-before.md`, `booked-e4-arrival-day.md` — added booked-path checklist/health reminders while keeping sales links out.
- `ultimate-berlin-trip-planner/email/README.md`, `RESEARCH_BACKLOG.md`, project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded reminder-email variable usage.

**Opened:** Ultimate remains draft/unpublished; more product polish can continue later.
**Closed:** `diff --check` passed for the updated email/docs files.

**Next session should:** Continue Ultimate polish when Yusuf resumes; do not publish/push until he explicitly asks.

## 2026-05-31 — Codex (Ultimate planner pre-arrival checklist)

**Did:** Added a conversion-focused checklist for what to do before arriving in Berlin.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `preArrivalChecklist()` / `preArrivalChecklistHtml()` with four action cards for tour/meeting point, ticket, opening/weather, and Day 1 route; rendered in the result board and carried into text export, print plan, and PDF cover flow.
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js`, `velo/README.md`, `email/README.md`, `email/e0-instant-plan.md`, `email/booked-e0-instant-plan.md` — normalized/stored/exposed `${preArrivalChecklist}` and included it in instant plan emails.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded checklist scope and QA.

**Opened:** Ultimate remains draft/unpublished; more product polish can continue later.
**Closed:** Inline script parse, transformed Velo syntax check via `node --input-type=module --check`, `diff --check`, in-app browser 3-day sales / 1-day sales / 7-day booked smoke (4 actions, booked copy switches to World Clock, overflow `0`, empty widget errors), and PDF button smoke (`PDF downloaded.`) passed.

**Next session should:** Continue Ultimate polish when Yusuf resumes; do not publish/push until he explicitly asks.

## 2026-05-31 — Codex (Ultimate planner Plan Health)

**Did:** Added a short visual Plan Health review so the itinerary feels checked by a local guide.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `planHealth()` / `planHealthHtml()` and rendered `Ready / Watch / Fix`, score, route/watch/fix micro-checks in the result board; carried the summary into text export, print plan, and PDF cover flow.
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js`, `velo/README.md`, `email/README.md`, `email/e0-instant-plan.md`, `email/booked-e0-instant-plan.md` — normalized/stored/exposed `${planHealth}` and included it in instant plan emails.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded the Plan Health layer and QA.

**Opened:** Ultimate remains draft/unpublished; more product polish can continue later.
**Closed:** Inline script parse, transformed Velo syntax check via `node --input-type=module --check`, `diff --check`, in-app browser 1/3/5/7-day smoke (`ready/watch/fix` tones, overflow `0`, empty widget errors), and PDF button smoke (`PDF downloaded.`) passed.

**Next session should:** Continue Ultimate polish when Yusuf resumes; do not publish/push until he explicitly asks.

## 2026-05-31 — Codex (Ultimate planner closing copy + lead intelligence)

**Did:** Cut repetitive day-closing text further and wired day intelligence into the lead/email path.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `dayBlockCopy()` so final `Later`/`Evening` blocks show title-only in UI, text export, PDF, and print; fixed postcard text overflow; added `dayIntelligenceSummary()` to the lead payload.
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js`, `velo/README.md`, `email/README.md`, `email/e0-instant-plan.md`, `email/booked-e0-instant-plan.md` — normalized/stored/exposed `${dayIntelligence}` and included it in instant plan emails.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded the copy-density and funnel changes.

**Opened:** Ultimate remains draft/unpublished; more product polish can continue later.
**Closed:** Inline script parse, transformed Velo syntax check via `node --input-type=module --check`, `diff --check`, in-app browser 1/3/5/7-day smoke (`closingWithCopy: 0`, overflow `0`, empty widget errors). Lead-payload interception was limited by the in-app browser sandbox, so the new payload field was verified statically.

**Next session should:** Continue Ultimate polish when Yusuf resumes; do not publish/push until he explicitly asks.

## 2026-05-31 — Codex (Ultimate planner day intelligence)

**Did:** Added quick logistics intelligence to preview and full-plan day cards.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `dayIntelItems()` / `dayIntelHtml()` plus `Route`, `Energy`, `Spend`, and `Check` chips derived from day type, pace/group, budget style, tour slot, openings, and reservation intent.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded the decision-chip layer and QA.

**Opened:** Ultimate remains draft/unpublished; more product polish can continue later.
**Closed:** Inline script parse, `diff --check`, in-app browser 5-day/7-day DOM smoke, aria-label checks (`Route: ...`, `Energy: ...`, `Spend: ...`, `Check: ...`), empty console log, and overflow `0` passed.

**Next session should:** Continue Ultimate polish when Yusuf resumes; do not publish/push until he explicitly asks.

## 2026-05-31 — Codex (Ultimate planner export visuals)

**Did:** Extended day-card visuals into print/PDF output.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added print-safe day postcard helpers and inserted them into the print day sections; added a measured visual anchor band inside PDF day cards using existing day visual metadata.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded export-visual QA.

**Opened:** Ultimate remains draft/unpublished; more product polish can continue later.
**Closed:** Inline script parse, `diff --check`, in-app browser PDF button smoke (`PDF downloaded.`), empty console log, and overflow `0` passed. In-app browser did not expose the downloaded file for a fresh rendered contact sheet in this micro-pass.

**Next session should:** Continue Ultimate polish when Yusuf resumes; do not publish/push until he explicitly asks.

## 2026-05-31 — Codex (Ultimate planner day postcards)

**Did:** Made the itinerary cards more visual with per-day postcard scenes.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `bw-day-postcard` CSS, day visual metadata helpers, and inline SVG scenes for arrival, Wall, museums, food, free/low-budget, nightlife, local-neighborhood, and Potsdam/day-trip days; preview and full-plan day cards now render the visual layer.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded the visual-card change and QA.

**Opened:** Ultimate remains draft/unpublished; more product polish can continue later.
**Closed:** Inline script parse, `diff --check`, in-app browser DOM smoke for 7-day and 5-day plans, postcard/SVG counts, empty console log, and overflow `0` passed. Screenshot capture in the in-app browser timed out, so QA evidence is DOM/runtime rather than a saved PNG.

**Next session should:** Continue Ultimate polish when Yusuf resumes; do not publish/push until he explicitly asks.

## 2026-05-31 — Codex (Ultimate planner holiday override)

**Did:** Added a future-proof Berlin one-off public holiday override.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `BERLIN_ONE_OFF_HOLIDAYS` and merged it into `berlinHolidays()` so 2028-06-17 is flagged as a Berlin public holiday.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded official-source check and QA.

**Opened:** Ultimate remains draft/unpublished; more product polish can continue later.
**Closed:** Official Berlin.de check for 2026/2027 public holidays plus 2028-06-17 one-off holiday, inline script parse, `diff --check`, fixture smoke for holiday/Sunday/Monday/weekday behavior, and DOM smoke for 2028-06-17/2027-03-08/normal weekday passed.

**Next session should:** Continue Ultimate polish when Yusuf resumes; do not publish/push until he explicitly asks.

## 2026-05-31 — Codex (Ultimate planner tighter day-end copy)

**Did:** Made day-end itinerary text shorter and less repetitive.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — shortened all `Later`/`Evening` block copy to compact one-line actions and tightened exception-only `Local cue` text.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded the copy-density change and QA.

**Opened:** Ultimate remains draft/unpublished; more product polish can continue later.
**Closed:** Inline script parse, `diff --check`, in-app browser desktop 1280/mobile 390 checks, overflow `0`, max rendered end-of-day line about 74 chars, and local PDF button smoke passed. In-app browser reports downloads are not exposed, so no fresh PDF file render was captured in this micro-pass.

**Next session should:** Continue Ultimate polish when Yusuf resumes; do not publish/push until he explicitly asks.

## 2026-05-31 — Codex (Ultimate planner share privacy)

**Did:** Hardened Ultimate planner copy/share/resume URLs so they only carry safe plan state.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — `plannerStateParams()` now builds an allowlisted query from plan choices plus safe `context/weather`; copied/WhatsApp links and lead payload `page` no longer preserve email, UTM, lead, booking, cache-buster, or unknown params.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded share/resume privacy QA.

**Opened:** Ultimate remains draft/unpublished; launch tasks still pending.
**Closed:** Inline script parse, `diff --check`, dirty-URL share/lead interception smoke, resume-state mobile smoke, no console errors, and overflow `0` passed.

**Next session should:** Continue Ultimate polish or launch prep only when Yusuf explicitly asks; do not push/publish by default.

## 2026-05-31 — Codex (Ultimate planner lead delivery grid)

**Did:** Made the Ultimate lead gate feel more like plan delivery and less like a plain form.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added four visual delivery chips inside the email gate: PDF, exact link, maps, and arrival-aware reminders.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded the lead-gate QA.
- `../output/qa/ultimate-trip-planner-ui/delivery-grid-desktop-20260531.png`, `delivery-grid-mobile-20260531.png` — saved desktop/mobile visual QA.

**Opened:** Ultimate remains draft/unpublished; launch tasks still pending.
**Closed:** Inline script parse, `diff --check`, desktop/mobile locked-gate smoke, unlocked-state smoke, no console errors, and overflow `0` passed.

**Next session should:** Continue Ultimate polish or launch prep only when Yusuf explicitly asks; do not push/publish by default.

## 2026-05-31 — Codex (Ultimate planner PDF action cards)

**Did:** Made the Ultimate PDF's Berlin Essentials ending more useful and visual.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added PDF `Use this plan` action cards for World Clock map + booking, with booked-state prep language that suppresses the booking link.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded the PDF action-card QA.
- `../output/qa/ultimate-trip-planner-pdf/action-cards-3day-20260531.pdf`, `action-cards-3day-20260531-contact-sheet.png`, `action-cards-7day-booked-20260531.pdf`, `action-cards-7day-booked-20260531-contact-sheet.png` — saved real rendered PDF QA.

**Opened:** Ultimate remains draft/unpublished; launch tasks still pending.
**Closed:** Inline script parse, `diff --check`, real PDF download smoke, rendered PNG/contact-sheet visual checks, PDF text checks for `Use this plan`, booking/booked branch behavior, stale long-copy absence, no console errors, and overflow `0` passed.

**Next session should:** Continue Ultimate polish or launch prep only when Yusuf explicitly asks; do not push/publish by default.

## 2026-05-31 — Codex (Ultimate planner less text / fine-tune)

**Did:** Reduced repeated day-end copy further and collapsed lower-priority planner questions.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — keeps normal days silent, shows only exception micro-cues, and wraps group/interests/pace-style personalization in a `Fine-tune the plan` details panel with a live summary.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded the UX change and QA artifacts.
- `../output/qa/ultimate-trip-planner-ui/advanced-mobile-closed-section-20260531.png`, `advanced-mobile-open-section-20260531.png`, `cues-fullplan-sunday-3day-20260531.png` — saved visual QA.

**Opened:** Ultimate remains draft/unpublished; more product polish can continue later.
**Closed:** Inline script parse, `diff --check`, in-app browser open, desktop/mobile closed/open fine-tune smoke, unlocked cue checks (`0` cues on normal 3-day; only Sunday/Monday micro-cues in Sunday/stress cases), no console errors, stale long-copy check, and overflow `0` passed.

**Next session should:** Continue Ultimate polish when Yusuf resumes; do not publish/push until he explicitly asks.

## 2026-05-31 — Codex (Ultimate planner Plan Inputs guide)

**Did:** Reduced the long-form feel by adding a compact live inputs guide before the question list.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `Plan inputs` guide with five visual chips (`When`, `Base`, `Style`, `Focus`, `Tour`) plus live state updates and booked/prep switching.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded the UX layer and QA artifacts.
- `../output/qa/ultimate-trip-planner-ui/input-guide-desktop-grid-20260531.png`, `input-guide-mobile-grid-20260531.png` — saved visual QA.

**Opened:** Ultimate remains draft/unpublished; launch tasks still pending.
**Closed:** Inline script parse, `diff --check`, desktop/mobile screenshot smoke, state-change smoke (`Tour` -> `Tour prep`), no console errors, and overflow `0` passed.

**Next session should:** Continue final visual polish or launch prep only when Yusuf explicitly wants publish/push.

## 2026-05-31 — Codex (Ultimate planner Trip Control Panel)

**Did:** Made the Ultimate planner first screen feel more like a live control panel than a questionnaire.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added a `Trip control panel` band above the form with four live visual tiles: arrival, first move, tour anchor/prep, and watch-out. The panel updates from current state and switches to booked/prep language when tour status is booked.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded the new UI layer and QA artifacts.
- `../output/qa/ultimate-trip-planner-ui/control-panel-desktop-20260531.png`, `control-panel-mobile-20260531.png` — saved desktop/mobile visual QA.

**Opened:** Ultimate remains draft/unpublished; launch prep and any final visual polish remain open.
**Closed:** Inline script parse, `diff --check`, desktop/mobile screenshot smoke, panel state-change smoke (`Tour anchor` -> `Tour prep` + meeting CTA), no console errors, and overflow `0` passed.

**Next session should:** Continue final visual polish or move into launch prep only when Yusuf explicitly wants publish/push.

## 2026-05-31 — Codex (Ultimate planner cue-trim PDF QA)

**Did:** Verified the shorter day cues in real PDF output and hardened day-card height math.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — PDF card height now measures wrapped place/risk chip rows before drawing, reducing overlap risk when labels wrap.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded fresh PDF/UI QA.
- `../output/qa/ultimate-trip-planner-pdf/cue-trim-3day-20260531.pdf`, `cue-trim-3day-20260531-contact-sheet.png`, `cue-trim-7day-stress-20260531.pdf`, `cue-trim-7day-stress-20260531-contact-sheet.png` — new rendered QA artifacts.

**Opened:** Ultimate remains draft/unpublished; launch tasks and broader polish remain open.
**Closed:** 3-day PDF downloaded as 5 pages with `0` day cues, 7-day stress PDF downloaded as 9 pages with only 3 exception cues, contact sheets show no visible overlap, PDF text extraction found no stale long-note phrases, desktop/mobile unlocked overflow `0`, inline script parse and `diff --check` passed.

**Next session should:** Continue final visual polish or begin launch prep when Yusuf explicitly says publish/push.

## 2026-05-31 — Codex (Ultimate planner exception-only day cues)

**Did:** Trimmed day-end "Local cue" notes so they appear only when they prevent a real visitor mistake.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — shortened opening-day status copy, removed normal weekday notes, and limited day-end cues to Sunday/holiday, Monday museum, late arrival, or packed-night exceptions.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded the lower-text-density behavior.

**Opened:** Ultimate planner task remains open for more product polish and launch prep; no push/publish done.
**Closed:** Inline script parse, `diff --check`, stale long-copy grep, browser locked-preview smoke (`overflow 0`, no console errors), and day-cue fixture checks passed (`0` cues on normal 3-day, `1` late arrival, `1` 7-day with Sunday, `2` Sunday+Monday-museum).

**Next session should:** Continue Ultimate polish from the open task, then run full unlocked/PDF contact-sheet QA before launch.

## 2026-05-31 — Codex (Ultimate planner PDF map brief QA)

**Did:** Rendered the updated jsPDF output after the route/map brief integration and checked the layout visually.

**Changed:**
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded the fresh PDF artifact.
- `../output/qa/ultimate-trip-planner-pdf/map-brief-20260531.pdf`, `map-brief-20260531-pages/`, `map-brief-20260531-contact-sheet.png` — generated 6-page PDF QA output.

**Opened:** Ultimate still needs launch tasks: live Wix Velo/email IDs/CMS row, draft-gate removal only when ready, live endpoint smoke, and final blog publish.
**Closed:** Headless Chrome jsPDF capture succeeded (`2,047,545` bytes, `6` pages), rendered contact sheet showed no visible overlap, inline script parse passed, `git diff --check` passed, and Ultimate remains `status: "draft"` with public count `30`.

**Next session should:** Continue product polish or start launch prep only when Yusuf says go.

## 2026-05-31 — Codex (Ultimate planner map brief)

**Did:** Added a more visual route/map layer so the planner reads less like a list and more like a carryable itinerary object.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `tripRouteStops()`, `tripRouteOverview()`, and `mapBriefHtml()`; rendered the map brief in the main plan board and unlocked full plan; added route overview to text export, print view, and the jsPDF cover page.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded map-brief progress and QA evidence.
- `../output/qa/ultimate-trip-planner-ui/map-brief-final-crop-20260531.png` — saved visual QA crop.

**Opened:** Full jsPDF render/contact-sheet should be rerun in a later PDF-specific pass; this turn verified source integration and UI layout, not a newly rendered PDF contact sheet.
**Closed:** Inline script parse, `git diff --check`, desktop and mobile-ish browser map-brief smoke passed (`api=1` Google Maps links, overflow `0`, empty browser error log). Ultimate remains `status: "draft"` and public count remains `30`.

**Next session should:** Continue visual/PDF polish, especially a fresh rendered PDF contact sheet after the map brief, or move to launch prep when Yusuf says go.

## 2026-05-31 — Codex (Ultimate planner Velo booked fail-closed)

**Did:** Hardened the Ultimate planner booking-aware email branch so booked leads cannot accidentally receive sales emails when booked template IDs are missing.

**Changed:**
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js` — `messageIdFor()` now uses only `bookedMessageId` for booked leads and skips if it is blank/TODO; `isBookedLead()` now treats cancelled/canceled/refunded/declined/no-show statuses as inactive even when `bookedAt` exists.
- `ultimate-berlin-trip-planner/velo/README.md`, `ultimate-berlin-trip-planner/email/README.md` — documented fail-closed booked-path behavior and inactive status override.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded the backend safety fix.

**Opened:** Triggered Email IDs are still placeholders until Yusuf creates/pastes them in Wix; live endpoint smoke remains part of launch.
**Closed:** Transformed Velo syntax check, booking-branch fixture matrix, `git diff --check`, and hub JSON/JS parse passed.

**Next session should:** Continue Ultimate polish or move to launch prep: paste Velo/emails, create `TripPlannerLeads`, remove draft gate only when ready, then live-test lead and booking endpoints.

## 2026-05-31 — Codex (Ultimate planner short day cues)

**Did:** Replaced long/repetitive day-end paragraphs with short optional "Local cue" text.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — shortened `shortDayNote()`, skipped empty cues in UI/text/print, and reduced the PDF cue box to a compact one-line treatment.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md` — recorded the day-cue simplification and QA evidence.
- `../output/qa/ultimate-trip-planner-ui/short-day-cues-20260531.png` — saved local UI QA screenshot.

**Opened:** In-app browser downloads are unsupported, so jsPDF file capture was not completed in this turn; use the existing headless/render contact-sheet path for the next PDF-specific layout pass.
**Closed:** Inline script parse, `git diff --check`, and local unlocked 3-day UI smoke passed (`36/33/29` character cues, overflow `0`).

**Next session should:** Continue the Ultimate Velo/booking-aware audit; the booked email message ID fallback still needs the fail-closed patch.

## 2026-05-31 — Codex (Ultimate planner launch icon)

**Did:** Prepared a real Ultimate planner icon so it will not show a fallback letter when the draft gate is removed.

**Changed:**
- `tools-home/icons/ultimate-berlin-trip-planner.png`, `tools-home/icons/ultimate-berlin-trip-planner-160.png` — generated brand-colored route/map/calendar icon assets.
- `tools-home/icons/manifest.json` — added the Ultimate icon entry.
- `tools-hub/data.json` — added the Ultimate icon URL while keeping `status: "draft"`.
- Project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded the launch-icon readiness.
- `../output/qa/tools-icons/ultimate-icon-contact-sheet-20260531.png` — visual QA contact sheet with neighboring tool icons.

**Opened:** Ultimate remains hidden until launch; remove `status: "draft"` when ready to publish.
**Closed:** JSON parse, image dimensions (`512x512`, `160x160`), local HTTP 200, corner/background check, `git diff --check`, and visual contact sheet passed.

**Next session should:** Continue Ultimate polish, or push/deploy and live-test once Yusuf is ready.

## 2026-05-31 — Codex (Ultimate planner hub draft gate)

**Did:** Prevented the unfinished Ultimate planner from appearing in public tool/widget shortcuts before launch.

**Changed:**
- `tools-hub/data.json` — marked `ultimate-berlin-trip-planner` as `status: "draft"` while keeping its launch wiring in place.
- `tools-hub/tools-hub-element.js`, `widgets-hub/index.html` — filter `draft`, `hidden: true`, and `published: false` tools out of public rendering/counts.
- `widgets-hub/_regenerate_seo.py`, `widgets-hub/SEO_ADDITIONAL_TAGS.md` — SEO ItemList now filters draft tools and is regenerated to 30 public widgets with Ultimate removed.
- Project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded the launch-gate state and launch reminder.

**Opened:** On Ultimate launch, remove `status: "draft"`, regenerate/re-paste widgets SEO if `/widgets` should list it, then run live hub/widgets QA.
**Closed:** JSON parse, `node --check tools-hub/tools-hub-element.js`, widgets-hub local browser smoke (`30` cards, no Ultimate text/card, overflow `0`, empty console errors), SEO no-Ultimate check, and visual check of First-Day/Hackescher icons passed.

**Next session should:** Continue Ultimate polish, or push/deploy and live-test once Yusuf is ready.

## 2026-05-31 — Codex (Ultimate planner Route Reel)

**Did:** Added visual route-reel day rhythm cards to reduce the "text wall" feel in preview, full plan, and PDF day cards.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added route-reel CSS, `blockIconName()`, `routeReelHtml()`, preview/full-plan route rhythm tiles, and matching PDF route-reel tiles with adjusted day-card height math.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded route-reel progress and QA evidence.
- `../output/qa/ultimate-trip-planner-ui/route-reel-visible-20260531.png` and `../output/qa/ultimate-trip-planner-pdf/route-reel-20260531-contact-sheet.png` — saved visual QA artifacts.

**Opened:** Ultimate planner remains open for further visual/PDF polish, then push/live GitHub Pages + Wix/Velo QA.
**Closed:** Inline JS parse, `git diff --check`, browser route-reel smoke (`3` full reels, `9` full steps, preview route reel visible, overflow `0`), empty browser error log, headless Chrome PDF download smoke, and rendered 6-page PDF contact sheet passed with no visible overlap.

**Next session should:** Continue polishing the "ultimate" feel or push/deploy and live-check GitHub Pages/Wix/Velo when Yusuf says go.

## 2026-05-31 — Codex (Ultimate planner WhatsApp share)

**Did:** Added phone-ready WhatsApp sharing without exposing email/PII, while keeping day-end notes concise.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added a `WhatsApp` action beside copy/PDF/print, a share icon, `whatsappShareText()`, `whatsappShareUrl()`, `updateShareActions()`, click tracking, plan-text `Plan link`, and print-view `Open this exact plan`.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded the share/resume progress.

**Opened:** Ultimate planner remains open for more visual/PDF polish, then push/live GitHub Pages + Wix/Velo QA.
**Closed:** Inline JS parse, `git diff --check`, browser WhatsApp smoke (`email` stripped, `date=2026-06-01` preserved), overflow `0`, empty browser error log, and day-end notes checked at 74/86/76 chars for the 3-day QA plan.

**Next session should:** Continue from remaining "ultimate" polish items, especially visual density and PDF refinement, or push/deploy when Yusuf says go.

## 2026-05-31 — Codex (Ultimate planner In-Day Tour Marker)

**Did:** Made the recommended BerlinWalk 11:30 slot visible inside the actual itinerary day.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `tourSlotForDay()`, spine mini marker, full-plan day marker, PDF day-card marker, print marker, and plan-text tour-anchor line for the recommended day.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded marker progress and QA evidence.
- `../output/qa/ultimate-trip-planner-pdf/tour-day-marker-20260531-contact-sheet.png` — rendered PDF visual QA with the in-day marker.

**Opened:** Ultimate planner remains open for final polish, then push/live GitHub Pages + Wix/Velo QA.
**Closed:** Inline JS parse, `git diff --check`, browser marker smoke (evening arrival places marker on Day 2), edge cases (morning arrival Day 1, one-day evening no in-plan marker, booked-state no sales marker), overflow `0`, empty browser error log, removed temporary QA hooks, and rendered 5-page PDF contact sheet passed with no visible overlap.

**Next session should:** Continue from remaining "ultimate" polish items, or push/deploy and live-check the GitHub Pages widget/PDF when Yusuf says go.

## 2026-05-31 — Codex (Ultimate planner Smart Swaps)

**Did:** Added Smart Swaps so the planner gives day-level local-guide moves for openings, rain, Sunday logistics, and late arrivals.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `planSwapsForPlan()`, Smart Swaps UI panel, route-backed swap actions, plan text/PDF/print inclusion, `planSwaps` lead payload, and swap click tracking.
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js`, `velo/README.md` — accepts/stores/exposes `planSwaps`.
- `ultimate-berlin-trip-planner/email/README.md`, `email/e0-instant-plan.md`, `email/booked-e0-instant-plan.md` — documented/used `planSwaps` in instant email copy.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded Smart Swaps progress and QA evidence.
- `../output/qa/ultimate-trip-planner-pdf/smart-swaps-20260531-contact-sheet.png` — rendered PDF visual QA with Smart Swaps + Smart Fixes.

**Opened:** Ultimate planner remains open for further polish, then push/live GitHub Pages + Wix/Velo QA.
**Closed:** Inline JS parse, transformed Velo syntax, `git diff --check`, browser Smart Swaps smoke (`3` swaps, `3` route actions, overflow `0`), empty browser error log, removed temporary QA hooks, and rendered 8-page PDF contact sheet passed with no visible overlap.

**Next session should:** Continue from remaining "ultimate" polish items, or push/deploy and live-check the GitHub Pages widget/PDF when Yusuf says go.

## 2026-05-30 — Codex (Ultimate planner Tour Anchor)

**Did:** Added a concrete Tour Anchor layer so the recommended BerlinWalk slot feels like a real plan object, not only CTA text.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added a visual Tour Anchor card under the main actions, generated `.ics` calendar holds for the recommended 11:30 slot, added World Clock map actions, suppresses calendar hold when the user says they are already booked, routes plan text/print/PDF through the slot summary, and tracks calendar/meeting-point clicks.
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js`, `velo/README.md` — accepts/stores/exposes `recommendedTourDate`, `recommendedTourTime`, and dynamic `meetingPointUrl`.
- `ultimate-berlin-trip-planner/email/README.md`, `email/e0-instant-plan.md`, `email/booked-e0-instant-plan.md` — documented/used the new tour date/time fields in instant email copy.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded the new Tour Anchor state and QA evidence.
- `../output/qa/ultimate-trip-planner-pdf/tour-anchor-20260530-contact-sheet.png` — rendered PDF visual QA for the Tour Anchor CTA.

**Opened:** Ultimate planner remains open for further polish, then push/live GitHub Pages + Wix/Velo QA.
**Closed:** Inline JS parse, transformed Velo syntax, `git diff --check`, browser Tour Anchor smoke (`.ics` date `2026-06-02 11:30-13:30`, map link, overflow `0`), booked-state no-calendar smoke, empty browser error log, removed temporary QA hooks, and rendered 7-page PDF contact sheet passed with no visible overlap.

**Next session should:** Continue from the remaining "ultimate" polish items, or push/deploy and live-check the GitHub Pages widget/PDF when Yusuf says go.

## 2026-05-30 — Codex (Ultimate planner note cleanup)

**Did:** Reduced the Ultimate planner day-end explanations from repeated advice paragraphs to short day-specific local notes.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — removed repeated `extraDayAdvice` appends, stopped gentle/family mode from adding the same protected-break sentence to every day, made `shortDayNote()` return concise day-specific notes, and routed plan text/PDF/print notes through `shortDayNote()`.
- `../output/qa/ultimate-trip-planner-pdf/note-shortening-20260530.pdf` and `note-shortening-20260530-contact-sheet.png` — generated visual PDF QA artifacts.
- Project root `SESSION_LOG.md` — recorded the widget note cleanup.

**Opened:** Ultimate planner remains open for more "ultimate" polish, then push/live GitHub Pages + Wix/Velo QA.
**Closed:** Inline JS parse, `git diff --check` for the widget file, browser 7-day note smoke (`maxLength=84`, `uniqueCount=6`, overflow `0`), empty browser error log, and rendered 7-page PDF contact sheet passed with no visible note overlap.

**Next session should:** Continue visual/feature polish or push the current V4/V5 changes for live GitHub Pages QA when Yusuf says go.

## 2026-05-30 — Codex (Ultimate planner Travel Mode)

**Did:** Continued Ultimate planner V4 by turning Travel Mode and Smart Fixes into real UI/PDF/print/lead-funnel data.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added Travel Mode/Smart Fixes summary helpers, deterministic lead segments, PDF Travel Review page, print Travel Mode/Smart Fixes sections, and lead payload fields for arrival/risk/intent segmentation.
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js`, `velo/README.md` — validates, stores, and exposes `travelMode`, `planAdvice`, `arrivalWindow`, `tripRisk`, `tourRecommendation`, `intentStage`, `familyOrSlow`, and `bookAheadNeeded`.
- `ultimate-berlin-trip-planner/email/*.md`, `email/README.md` — added the new variables to docs and used `planAdvice` / `travelMode` in sales and booked email copy.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded V4 progress and QA evidence.
- `output/qa/ultimate-trip-planner-pdf/v5-travel-review-contact-sheet.png` — rendered 7-day PDF visual QA with the new Travel Review page.

**Opened:** Push/live GitHub Pages + Wix/Velo QA remain.
**Closed:** Inline JS parse, transformed Velo syntax, `diff --check`, browser today Travel Mode/Smart Fixes QA, far-date no-Travel-Mode QA, no-overflow check, empty browser error log, final PDF button smoke after removing QA hooks, and rendered 7-day PDF contact sheet passed.

**Next session should:** Push/deploy and run live GitHub Pages/Wix embed/lead/booking smoke tests.

## 2026-05-30 — Codex (Blog journey tool-card image fix)

**Did:** Fixed the single-post `Next step` module so the `Use a tool` card cannot duplicate the tour/Yusuf photo.

**Changed:**
- `js/blog-journey-inject.js` — added fallback tool-icon URLs, clones/enriches related-tool data with icons when blog-index tool data has no image, and styles the `Use a tool` journey card as a centered icon preview.
- `wix-embed-snippets.md`, `AGENTS.md` — bumped the blog journey helper install URL to `blog-journey-inject.js?v=6`.
- Project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded the v6 install note.

**Opened:** Push/deploy and update Wix Custom Code to `https://fenerszymanski.github.io/berlinwalk-widgets/js/blog-journey-inject.js?v=6`; then live-check one post on desktop/mobile.
**Closed:** Local `node --check` and desktop/mobile in-app browser QA passed: tool card uses `berlin-first-day-planner-160.png`, mobile hides `Walk it`, and horizontal overflow is `0`.

**Next session should:** After push/GitHub Pages deploy, update the Wix Custom Code helper URL to `?v=6` and verify the live `Next step` module no longer repeats the tour photo.

## 2026-05-30 — Codex (Ultimate planner deep research)

**Did:** Ran a deeper best-practice pass for how to make the Ultimate Berlin Trip Planner feel genuinely "ultimate" without turning it into generic AI text.

**Changed:**
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md` — added source-backed findings from travel planner products, Google Maps/Open-Meteo/Berlin official sources, form UX, and current Google SEO constraints.
- Project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded the updated direction.

**Opened:** Finish Travel Mode and Smart Fixes across UI/PDF/print/lead payload/Velo/email variables, then QA. Keep the tool unpublished/homepage-hidden until live QA passes.
**Closed:** Research pass only; no runtime code changed in this turn.

**Next session should:** Implement the new highest-value items: mobile Travel Mode, Smart Fixes/trip review, PDF carry mode, lead segmentation, and blog embed strategy.

## 2026-05-30 — Codex (Ultimate planner V4 start)

**Did:** Started V4 implementation from the research backlog: made the planner more visual, map-grounded, and conversion-aware.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added canonical Berlin place catalog, day-level Google Maps directions, catalog search links, visual trip spine, risk chips, plan confidence, adaptive booking/meeting-point CTA, copy-plan-link state serialization, lead-gate copy/events, and redesigned PDF/print route/risk output.
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md` — recorded V4 progress and remaining caveats.
- Project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded V4 local progress and QA notes.
- `output/qa/ultimate-trip-planner-pdf/v4-contact-sheet.png` — rendered 7-day V4 PDF visual QA contact sheet.

**Opened:** Push/live GitHub Pages + Wix QA remain.
**Closed:** Local JS syntax check, `diff --check`, desktop/mobile overflow QA, 1/3/5/7-day spine checks, CTA-state checks, Maps `api=1` route/search checks, clean-origin locked gate QA, PDF button smoke, and rendered 7-day PDF visual QA passed.

**Next session should:** Push/deploy, then live-check GitHub Pages/Wix embed, run one real endpoint smoke when Velo is installed, and inspect the deployed PDF once.

## 2026-05-30 — Codex (Ultimate planner research backlog)

**Did:** Researched travel-planner UX, map/PDF/export patterns, lead-gate form best practices, Berlin date-data sources, and SEO structured-data constraints for the next Ultimate planner pass.

**Changed:**
- `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md` — new V4/V5 implementation backlog with sources and prioritized recommendations.
- Project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded that the Ultimate planner task remains open with a research-backed V4 direction.

**Opened:** Implement V4 around visual trip spine, place catalog/directions links, PDF-as-travel-document, adaptive CTA logic, share/resume state, travel mode, and itinerary health checks.
**Closed:** Research pass completed; no widget runtime code changed.

**Next session should:** Start with `ultimate-berlin-trip-planner/RESEARCH_BACKLOG.md`, then implement P0 items in order: place catalog/maps, visual day spine, PDF V4, and adaptive CTA/analytics.

## 2026-05-30 — Codex (Tools home shortcut cleanup)

**Did:** Removed the unpublished Ultimate planner from homepage tool shortcuts and regenerated the two visible planner icons with the cheap Gemini image model.

**Changed:**
- `tools-home/data.json` — removed `ultimate-berlin-trip-planner` from `featuredTools` until the tool is live/published; first card is now `berlin-first-day-planner`.
- `tools-home/icons/berlin-first-day-planner*.png`, `tools-home/icons/hackescher-after-tour-planner*.png` — replaced the flat local drawings with `gemini-2.5-flash-image` 3D yellow/green icons matching the existing tool icon family.
- `tools-home/icons/manifest.json` — recorded Gemini Flash source paths/model for both new icons.
- Project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded the temporary Ultimate shortcut removal and icon regeneration.

**Opened:** Add `ultimate-berlin-trip-planner` back to `tools-home/data.json` first slot after the tool is live on Wix/GitHub Pages.
**Closed:** JSON validation passed and icon contact sheet generated at `output/qa/tools-home-icon-contact-gemini-flash.png`.

**Next session should:** Push/deploy, then verify homepage tools no longer show the Ultimate fallback `U` card and that the two planner icons load from GitHub Pages.

## 2026-05-30 — Codex (Ultimate planner visual/PDF polish)

**Did:** Addressed Yusuf's "not ultimate yet" feedback with stronger visuals and a safer PDF layout.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — replaced text abbreviation badges with inline SVG icons, added the illustrated Mitte map to the plan board, added icon treatments to route nodes/full-plan days/map links/essentials, fixed mobile time-label overflow, and eager-loads the plan image.
- `ultimate-berlin-trip-planner/assets/berlinwalk-logo-wide.png` — copied the real BerlinWalk wordmark for PDF generation.
- `ultimate-berlin-trip-planner/index.html` PDF flow — loads the real BW logo, draws it in the header, computes dynamic weather/note/essentials heights, and switches essentials to full-width itinerary cards to remove overlap.
- Project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded the V3 visual/PDF upgrade.

**Opened:** Push/deploy remains; after GitHub Pages updates, live-check the GitHub Pages URL and then the Wix tool embed.
**Closed:** Local JS syntax check; desktop and 390px mobile browser QA showed no horizontal overflow, 68 SVG icons, loaded map image, and correct 1/3/5/7-day counts. Fresh Chrome PDF render for a 7-day plan produced 4 pages with BW logo and no overlapping note/essentials content.

**Next session should:** Push `berlinwalk-widgets`, wait for GitHub Pages, then open `/ultimate-berlin-trip-planner/?context=tool&date=2026-06-01&tripLength=3&v=visualpdf` in Atlas/live and inspect the new PDF once from the deployed URL.

## 2026-05-30 — Codex (Ultimate Berlin Trip Planner)

**Did:** Built and then upgraded the Ultimate Berlin Trip Planner as a standalone trip-level lead magnet and tour-conversion widget.

**Changed:**
- `ultimate-berlin-trip-planner/` — new widget with 1-7 day deterministic Berlin plans, Open-Meteo/monthly weather logic, Sunday/public-holiday/Monday warnings, useful preview, email+consent gate, fail-soft unlock, visual plan board, Google Maps anchors, Berlin essentials, redesigned itinerary-style PDF/print output, and `?context`, `?date`, `?tripLength`, `?weather=off` params.
- `ultimate-berlin-trip-planner/velo/`, `ultimate-berlin-trip-planner/email/` — Velo handoff for `TripPlannerLeads`, `/_functions/tripPlannerLead`, `/_functions/tripPlannerBooking`, hourly due-email processing, booking-aware sales/prep stages, plus instant/-7/-3/-1/day-of copy drafts. Lead payload/source now includes `budgetStyle` and `mustHandle`.
- `tools-hub/data.json`, `tools-home/data.json`, `widgets-hub/SEO_ADDITIONAL_TAGS.md`, `wix-embed-snippets.md`, `README.md`, `AGENTS.md` — added the new tool to hub/home/widgets SEO/docs with `embedHeight: 2400`.
- `quick-summary/data.json`, `faq/data.json`, `faq/inject.js`, `blog-drafts/ultimate-berlin-trip-planner.md` — added SEO blog support, Quick Summary, FAQ schema mapping, internal links, and competitor-positioning notes. Also removed old public email references from homepage FAQ data in favor of `berlinwalk.com`.

**Opened:** Push/GitHub Pages deploy; live `/tools/ultimate-berlin-trip-planner` CMS insert/re-save; install Velo backend/job/collection; create Triggered Emails and replace placeholder IDs; live lead + booking-event smoke tests; publish the SEO blog post.
**Closed:** Local syntax/JSON checks, Velo transformed syntax smoke, CMS dry-run, date logic QA (today/tomorrow/Sunday/Monday/holiday/>15 days), lead-gate validation/fail-soft unlock, PDF/print status smoke, and desktop/mobile browser QA with no horizontal overflow, no clipped trip-length buttons, 15 map anchors on a 5-day plan, and 8 essentials cards.

**Next session should:** Push the widget repo, then create the BerlinTools CMS row and install the Velo/email pieces before embedding the blog draft near the top of the SEO post.

## 2026-05-30 — Codex (Blog journey menu blink reduction)

**Did:** Smoothed the mobile blog-post menu and `/blog` index topic menu after Yusuf reported load delay/blinking and harsh top/bottom lines.

**Changed:**
- `js/blog-journey-inject.js` — mobile `Blog Home` / category nav now inserts before waiting for `blog-index/data.json`, reuses the existing nav instead of removing/recreating it, caches the in-flight data request to avoid repeated fetches, uses a more conservative fallback category matcher so `before you go` does not flash `Before & After`, and restyled the nav as a lighter cream card with a yellow left accent instead of heavy black top/bottom rules.
- `blog-index/blog-index-element.js` — softens the `/blog` topic chips/search borders, lightens masthead divider lines, and installs exact native-feed preload CSS for `#comp-mm3d94ml` as soon as the element script runs.
- `wix-embed-snippets.md`, `README.md`, `AGENTS.md` — bumped the journey helper install URL to `blog-journey-inject.js?v=5` and the Blog Index element URL to `blog-index-element.js?v=2`.
- Project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded the v5 helper behavior and install note.

**Opened:** Push/deploy and Wix Custom Code update to `https://fenerszymanski.github.io/berlinwalk-widgets/js/blog-journey-inject.js?v=5` remain; live mobile Safari check needed.
**Closed:** Local `node --check` passed; delayed-data QA passed with nav visible before data, active category stable as `Tourist Tips`, one nav copy, no overflow; blog post and `/blog-index/` desktop/mobile QA passed with no broken images.

**Next session should:** After push/GitHub Pages deploy, update Wix Custom Code to `?v=5` and live-check one `/post/*` page on desktop plus mobile Safari.

## 2026-05-30 — Codex (Blog journey mobile nav + back-to-top)

**Did:** Implemented Yusuf's mobile blog-post tweaks for the journey helper.

**Changed:**
- `js/blog-journey-inject.js` — added mobile `Blog Home` + category chip nav near the top of each article, hid the photo-led `Walk It` journey card on mobile, added a sticky back-to-top button on desktop/mobile, excluded the new nav from heading/spacing scans, and sends `bw_blog_back_top_click`.
- `blog-post-mockup/enhancer-test.html` — loads `cta-inject.js` before the journey helper so the local harness better reflects the live helper mix.
- `README.md`, `wix-embed-snippets.md`, `AGENTS.md` — documented the new behavior and bumped the install snippet to `blog-journey-inject.js?v=4`.
- Project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded the v4 helper behavior and install note.

**Opened:** Push/deploy and Wix Custom Code update to `https://fenerszymanski.github.io/berlinwalk-widgets/js/blog-journey-inject.js?v=4` remain; live mobile Safari check needed.
**Closed:** Local `node --check` passed; Playwright QA passed on desktop and 390px mobile with mobile nav visible, desktop nav hidden, mobile `Walk It` card hidden, back-to-top visible after scroll, no broken images, and horizontal overflow `0`.

**Next session should:** After push/GitHub Pages deploy, update the existing Wix Custom Code URL to `?v=4` and live-check one `/post/*` page on desktop plus mobile Safari.

## 2026-05-30 — Codex (Hackescher tool hubs)

**Did:** Added the Hackescher After-Tour Planner to the homepage tools preview, `/berlin-tools` inventory, and `/widgets` embed gallery data.

**Changed:**
- `tools-home/data.json` — inserted `hackescher-after-tour-planner` as the second `Plan your visit` card so it appears within the first 8 rendered homepage tools.
- `tools-hub/data.json` — added the Discovery entry with `widgetUrl` `https://fenerszymanski.github.io/berlinwalk-widgets/hackescher-after-tour-planner/` and `embedHeight: 1180`.
- `tools-home/icons/hackescher-after-tour-planner.png`, `tools-home/icons/hackescher-after-tour-planner-160.png`, `tools-home/icons/manifest.json` — added a no-text route/courtyard/pin icon.
- `widgets-hub/SEO_ADDITIONAL_TAGS.md` — regenerated ItemList SEO; now 30 widgets.
- `README.md`, `wix-embed-snippets.md`, `AGENTS.md` — documented the tool promotion and future no-manual-spacer rule.
- Project root `insert-hackescher-after-tour-planner.js` — created and ran one-off Wix CMS insertion script; Wix CMS item `a5bfc7d5-ec2c-4c03-857e-3c99f3221c56` is live at `/tools/hackescher-after-tour-planner`.

**Opened:** Push/deploy needed before live GitHub Pages serves the new data/icon; then live-QA homepage `Plan your visit`, `/berlin-tools`, and `/widgets`.
**Closed:** Local JSON validation, widgets SEO regeneration, browser QA for local tools/widgets hubs, and live Wix dynamic route creation.

**Next session should:** After push, verify the new icon URL returns 200 and the Hackescher card appears on all three live surfaces.

## 2026-05-30 — Codex (Blog journey helper v3)

**Did:** Addressed Yusuf's SS1-SS4 feedback on Wix blog post rendering.

**Changed:**
- `js/blog-journey-inject.js` — loads CSS immediately on `/post/*`, retries render at 0/80/220/520ms to reduce first-paint flicker, hides empty Wix spacer paragraphs instead of relying on draft-level line breaks, suppresses the early inline tool prompt when the post already embeds a real tool iframe, replaces the `Next step` cards with image-led cards, adds six related-guide cards, pulls tool preview images from `tools-hub/data.json`, and hides Wix-native Related Posts/Comments.
- `blog-post-mockup/enhancer-test.html` — added local regression fixtures for empty spacer paragraphs, embedded tool iframe, and native Wix related/comments blocks.
- Project root `PROJECT_MEMORY.md` — recorded `blog-journey-inject.js?v=3` behavior/install note.

**Opened:** Push/deploy and Wix Custom Code update to `https://fenerszymanski.github.io/berlinwalk-widgets/js/blog-journey-inject.js?v=3` remain; live QA needed.
**Closed:** Local syntax check and in-app browser QA passed: at ~140ms CSS/body enhancement applied; 2 empty spacers hidden; early tool prompt suppressed; 3 top next-step cards + 6 related cards rendered; native related/comments hidden.

**Next session should:** Push the repo, update Wix Custom Code to `?v=3`, and live-check one older post with spacer paragraphs plus one post containing an embedded tool.

## 2026-05-30 — Codex (Hackescher Wix draft created)

**Did:** Uploaded the Hackescher after-tour post to Wix Blog as an unpublished draft with full SEO, all seven images, and the three planned widgets.

**Changed:**
- `blog-drafts/what-to-do-near-hackescher-markt-after-walking-tour.md` — updated local draft status with Wix draft ID.
- Project root `create-wix-hackescher-after-tour-blog-draft.js` — added direct REST uploader script; upload cache lives at project root `tmp/hackescher-after-tour/wix-upload-cache.json`.
- Wix Blog: created draft `3d4933e8-c479-4a4b-8dfb-2bec143721b8`, status `UNPUBLISHED`, category `Tourist Tips`, seoSlug `what-to-do-near-hackescher-markt-after-walking-tour`; verification returned 186 rich-content nodes, 7 image nodes, 3 HTML embeds, SEO title/description/keywords/OG image set.

**Opened:** Visual review in Wix editor and live desktop/mobile QA after publish remain.
**Closed:** Wix draft creation/import for this post.

**Next session should:** Review/publish the Wix draft, then check the live post rendering and update blog index data once the post is public.

## 2026-05-30 — Codex (Hackescher Wikimedia images)

**Did:** Added the two missing Wikimedia Commons visuals for the Hackescher after-tour draft: Hackesche Höfe and Haus Schwarzenberg.

**Changed:**
- `blog-drafts/what-to-do-near-hackescher-markt-after-walking-tour.md` — inserted the two image/caption blocks in `The Free 45-Minute Walk` and added Wikimedia source notes.
- `blog-drafts/assets/hackescher-after-tour/06-hackesche-hoefe-courtyard.jpg` — optimized Hackesche Höfe image from Wikimedia Commons.
- `blog-drafts/assets/hackescher-after-tour/07-haus-schwarzenberg-street-art-courtyard.jpg` — optimized Haus Schwarzenberg courtyard image from Wikimedia Commons.

**Opened:** Wix import/publishing, widget embeds, and live desktop/mobile QA remain.
**Closed:** Commons image research, selection, optimization, placement, and attribution.

**Next session should:** Publish/import this draft to Wix with quick summary, after-tour planner, and FAQ widgets, then live-QA image/caption layout.

## 2026-05-30 — Codex (Hackescher blog images)

**Did:** Retrieved Yusuf's `Hackescher Markt ` Drive folder, inspected all 13 HEIC photos, selected the five that best match the article flow, optimized them, and placed them in the draft with captions.

**Changed:**
- `blog-drafts/what-to-do-near-hackescher-markt-after-walking-tour.md` — inserted images after the intro, food section, Monbijoupark paragraph, Museum Island paragraph, and walking-directions section.
- `blog-drafts/assets/hackescher-after-tour/` — added five final JPGs (`01-...` through `05-...`) sized ~527-704 KB; discarded temporary HEICs/contact sheets/unselected conversions.

**Opened:** Wix draft creation/import, widget embeds, and live desktop/mobile QA remain.
**Closed:** Image optimization and local Markdown placement for the Hackescher after-tour draft.

**Next session should:** Publish/import this draft to Wix, include the quick summary/planner/FAQ widgets, then verify image layout live.

## 2026-05-30 — Codex (Single blog post enhancer implementation)

**Did:** Translated Yusuf-approved single post mockup direction into the production post helper.

**Changed:**
- `js/blog-journey-inject.js` — now lightly polishes Wix post body typography, keeps mobile `In this guide` chips, injects one topic-aware inline tool prompt, and renders the black editorial `Next step` module without duplicating itself across Wix rerenders.
- `blog-post-mockup/enhancer-test.html` — local harness for `/post/*` enhancer QA using live `blog-index/data.json`.
- Project root `output/qa/blog-post-enhancer-*.png` — desktop/mobile top and journey screenshots; local QA passed with tool prompt, journey cards, no broken images, and 0 horizontal overflow.

**Opened:** Push/deploy still needed; after GitHub Pages updates, add `https://fenerszymanski.github.io/berlinwalk-widgets/js/blog-journey-inject.js?v=2` in Wix Custom Code for blog posts/all pages.
**Closed:** Single post redesign mockup is approved and implemented locally.

**Next session should:** Push `berlinwalk-widgets`, wait for GitHub Pages, install/update the Wix Custom Code helper, then live-QA one high-traffic `/post/*` page on desktop and mobile.

## 2026-05-29 — Codex (Single blog post mockup)

**Did:** Built a static mockup for the redesigned single blog post experience before touching production post scripts.

**Changed:**
- `blog-post-mockup/index.html` — new standalone editorial article mockup using the current blog logo, real first-time visitor hero image, Quick Summary + Audio module, sticky guide rail, inline tool prompt, First-Day Guide signup, next-step cards, and related guides.
- Project root `output/qa/blog-post-mockup-*.png` — saved desktop/mobile top and journey-section screenshots.

**Opened:** Yusuf needs to approve/adjust the direction before this becomes the production `js/blog-journey-inject.js` / blog post CSS implementation.
**Closed:** Local mockup QA passed with 0 broken images and 0 horizontal overflow on desktop and 390px mobile.

**Next session should:** Review the mockup with Yusuf, then translate the accepted pieces into the sitewide post enhancer without replacing Wix Blog CMS.

## 2026-05-29 — Codex (Blog index category shelf sliders)

**Did:** Converted `/blog` category shelves from fixed 5-card rows into horizontal sliders so more posts are reachable per category.

**Changed:**
- `blog-index/blog-index-element.js` — regular shelves now render up to 10 posts, show previous/next arrow controls when a shelf has more than 5 posts, scroll smoothly inside the shelf, and keep mobile rows horizontally scrollable without page overflow.
- Project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded the new shelf-slider behavior and QA screenshots.
- Project root `output/qa/blog-index-shelf-slider-desktop.png`, `output/qa/blog-index-shelf-slider-mobile.png` — saved local QA screenshots.

**Opened:** Push/deploy still needed before live `/blog` uses the slider rows.
**Closed:** Local syntax, desktop arrow-scroll, and mobile 390px overflow checks passed.

**Next session should:** After push, live-QA `/blog` inside Wix and continue Yusuf's remaining visual tweaks.

## 2026-05-29 — Codex (Blog index logo + topic behavior pass)

**Did:** Added Yusuf's Adobe Express blog logo and cleaned up the `/blog` index interactions flagged in live screenshots.

**Changed:**
- `blog-index/assets/*` — added cropped web-ready `Berlin travel & history notes` logo PNGs from the latest Downloads files; archived originals under project root `brand/logos/blog/`.
- `blog-index/blog-index-element.js` — replaced the giant text H1 with the logo masthead, changed topic chips into section-jump links, removed destructive `View topic` / `More` links, kept search as the only filtering mode, made the hero lead overlay cream/translucent, tightened the history feature section title and removed its white image overlay block.
- `scripts/generate-blog-index-data.mjs`, `blog-index/data.json` — `Most Popular` now comes from Wix Blog API sorting by `metrics.views` when generating data, with curated fallback still in the element.
- Project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded the new logo assets, topic behavior, and popularity-source caveat.

**Opened:** True last-30-day per-post popularity still needs a Wix Analytics export/API source; Wix Blog API sorted by lifetime `metrics.views` but did not return per-period counts.
**Closed:** Local desktop/mobile QA passed for logo masthead, topic jumps, search, persistent Most Popular, history feature layout, and zero horizontal overflow.

**Next session should:** Push `berlinwalk-widgets`, wait for GitHub Pages, then live-QA `/blog` with the new logo and topic-menu behavior.

## 2026-05-29 — Codex (First-Day PDF AI art notes)

**Did:** Recorded PDF visual feedback in the lead-magnet source folder.

**Changed:**
- Project root `lead-magnets/berlin-survival-map/AI_PAGE_ART_NOTES.md` — noted overlapping text/icon issues, weak Page 1 graphic, and the one-page-at-a-time AI art experiment.

**Opened:** Test Page 1 AI prompt first; do not redesign all pages until Yusuf likes the direction.
**Closed:** None.

**Next session should:** Continue in the lead-magnet folder, not widget code, unless the final art affects the signup cover asset.

## 2026-05-29 — Codex (Blog lead CTA visual polish)

**Did:** Polished the blog lead form CTA visual after Yusuf flagged the left-side image as bad.

**Changed:**
- `lead-form/index.html` — removed the heavy dark-green poster/mockup treatment, added a calmer cream PDF preview panel with green spine/dots, clearer cover thumbnail, tighter layout, and value chips.

**Opened:** Push the repo so GitHub Pages/live blog embeds load the updated CTA.
**Closed:** Local Chrome QA passed for desktop/mobile, mocked submit success, correct PDF URL, no old public Map wording, and zero horizontal overflow.

**Next session should:** Live-QA the CTA inside a Wix blog post after deploy.

## 2026-05-28 — Codex (Blog native feed suppressor)

**Did:** Hid the undeletable Wix-native blog feed section from the custom `/blog` index.

**Changed:**
- `blog-index/blog-index-element.js` — `<bw-blog-index>` now installs a `/blog`-only suppressor for live Wix feed section `#comp-mm3d94ml`, plus fallback detection for Wix Blog `data-hook` roots, and watches Wix re-renders with `MutationObserver`.
- Project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — recorded the live section ID and behavior.

**Opened:** Push `berlinwalk-widgets` so GitHub Pages/Wix load the suppressor.
**Closed:** Live DOM check confirmed the original Wix feed is `#comp-mm3d94ml`, separate from the custom index section `#comp-mppyfuyg`, with Blog feed hooks inside the native section.

**Next session should:** After deploy, live-QA `/blog` once to confirm the lower native feed is gone on desktop and mobile.

## 2026-05-28 — Codex (First-Day email paste prep)

**Did:** Prepared the final Wix Triggered Email paste after Yusuf pushed the widget repo.

**Changed:**
- `lead-form/email/wix-html-block.html`, `lead-form/email/README.md` — fixed instructions to target direct Triggered Email ID `VKufY4L`; copied the actual HTML block to the macOS clipboard.

**Opened:** Paste clipboard into Wix Developer Tools -> Triggered Emails -> `VKufY4L`; set subject/preview; save; then live-test one signup.
**Closed:** GitHub Pages now serves the new cover asset and First-Day Guide lead form / exit popup JS.

**Next session should:** Smoke-test the live email after the Wix editor save and audit the newest `SurvivalMapEmailLogs` rows.

## 2026-05-28 — Codex (Blog index v3 Vox layout pass)

**Did:** Pushed the `/blog` custom index closer to Yusuf's Vox references: stronger featured area, image-heavy shelves, popular/newsletter block, and one large feature category.

**Changed:**
- `blog-index/blog-index-element.js` — hero now has one large lead story plus a five-story right rail with mini images; regular category shelves render as 5 visual cards; after two shelves it inserts `Most Popular` + `Berlin Survival Guide` signup; `Berlin History & Myths` renders as a large feature section; newsletter posts to `/_functions/subscribe` with offer `berlin-survival-map`.
- `scripts/generate-blog-index-data.mjs`, `blog-index/data.json` — hero secondary rail now outputs 5 curated posts: airport, toilets, public transport, Berlin Wall, and free things.
- Project root `output/qa/blog-index-v3-*.png` — saved top, shelves, popular/feature, feature, desktop, and mobile screenshots.

**Opened:** Push `berlinwalk-widgets` again so GitHub Pages/Wix `/blog` pick up v3.
**Closed:** Syntax checks passed; local Browser QA confirmed 5 hero rail stories/images, 5-card shelves, popular/signup, feature section, filters/search/All behavior, no support/member banner, no `99 Berlin guides`, 0 loaded broken images, and no desktop horizontal overflow.

**Next session should:** Live-QA `/blog` inside Wix after deploy, especially the custom element height and mobile width in the Wix page shell.

## 2026-05-28 — Codex (Blog index v2 Vox-style polish)

**Did:** Reworked the custom blog index into a Vox-inspired editorial archive without the Vox membership/support banner pattern.

**Changed:**
- `blog-index/blog-index-element.js`, `blog-index/index.html` — new `Berlin Travel & History Notes` masthead, tighter hero, compact topic/search controls, compact editorial shelves, lower tools band, filter/search rerender fix, and mobile overflow hardening.
- `scripts/generate-blog-index-data.mjs`, `blog-index/data.json` — editorial hero lead is now `Berlin First-Time Visitor Mistakes`; secondary rail is Airport to Alexanderplatz, Public Toilets, and Public Transport; shelves now surface up to 10 compact links.
- Project root `output/qa/blog-index-v2-desktop.png`, `output/qa/blog-index-v2-mobile.png` — refreshed local QA screenshots.

**Opened:** Push `berlinwalk-widgets` again so GitHub Pages serves the new blog index JS/data; then live-QA `/blog` in Wix after cache/deploy.
**Closed:** Local syntax checks passed; local QA confirmed no `99 Berlin guides`, no membership/support banner, correct featured posts, working topic buttons/Search, no broken images, and no horizontal overflow in tested views.

**Next session should:** After push/deploy, smoke-test live `/blog` for the `All` filter regression, topic result ordering, and mobile width inside the Wix page shell.

## 2026-05-28 — Codex (First-Day Guide lead magnet v2)

**Did:** Reworked the Survival Map public surfaces into `Berlin First-Day Survival Guide`.

**Changed:**
- `lead-form/index.html` — new guide headline/button/success copy, new PDF URL, new cover asset reference; internal `offer: 'berlin-survival-map'` unchanged.
- `js/exit-intent-popup.js`, `js/lead-form-inject.js` — popup/injected iframe copy now says First-Day Guide; success link text is `Download Berlin First-Day Guide`.
- `lead-form/email/*` — markdown, paste-ready HTML, and preview updated to subject `Your Berlin First-Day Survival Guide is here`, new CTA URL, and new cover image.
- `README.md`, `AGENTS.md`, `wix-embed-snippets.md`, `lead-form/email/README.md` — documented the new public positioning and compatibility names.

**Opened:** Push to GitHub Pages before expecting live widgets/email cover image to update; paste `lead-form/email/wix-html-block.html` into Wix Triggered Email manually if the live email body must change now.
**Closed:** Local Chrome QA passed for lead form desktop/mobile, forced exit popup success flow, and email preview desktop/mobile; no horizontal overflow and all download CTAs point to the final PDF URL.

**Next session should:** After push/deploy, live smoke test a signup and verify the welcome email + download link.

## 2026-05-28 — Codex (Subscription helper prep)

**Did:** Prepared the non-push-dependent Email Marketing subscription-status fix for Survival Map signups.

**Changed:**
- `lead-form/velo/emailMarketingSubscription.js` — new Velo helper that reads a Wix Secrets Manager REST key and upserts opted-in emails as `SUBSCRIBED`.
- Project root `scripts/survival-map-subscription-repair.mjs` — new local audit/backfill script for `SurvivalMapEmailLogs`.
- `lead-form/velo/README.md`, `AGENTS.md`, project root `PROJECT_MEMORY.md` / `SESSION_LOG.md` — updated the handoff.

**Opened:** When Wix Editor access is available, add secret `WIX_API_KEY`, install the helper as `Backend/emailMarketingSubscription.js`, call `subscribeEmailMarketing(email)` from `post_subscribe`, publish, and live-test `subscriptionDebug.ok`.
**Closed:** Confirmed the current Keychain `WIX_API_KEY` can query Wix Email Subscriptions; dry-run found the one logged Survival Map lead already `SUBSCRIBED`, with no apply run.

**Next session should:** Treat the direct email path as working; only patch subscription status once Yusuf can publish Velo.

## 2026-05-28 — Codex (Blog redesign v1 local)

**Did:** Started the blog redesign implementation with a new full `/blog` editorial hub and post-page journey helper.

**Changed:**
- `blog-index/*`, `scripts/generate-blog-index-data.mjs` — added `<bw-blog-index>`, local preview, and generated 99-post Wix Blog API data with topic shelves/search/tools.
- `js/blog-journey-inject.js` — new post helper for mobile `In this guide` chips and a topic-aware `Next step` card.
- `README.md`, `AGENTS.md`, `wix-embed-snippets.md` — documented install snippets and the publish TODO.

**Opened:** Push the repo, wait for GitHub Pages, replace the Wix `/blog` feed area with `<bw-blog-index>`, and add `blog-journey-inject.js?v=1` to Wix Custom Code.
**Closed:** Local syntax checks and desktop/mobile blog-index QA passed; screenshots saved in project-root `output/qa/`.

**Next session should:** After push/deploy, live-QA `/blog` and one high-traffic `/post/*` page before adding more editorial tuning.

## 2026-05-28 — Codex (BerlinTools CTA polish)

**Did:** Mirrored the live mobile `/tools/*` CTA polish in the widget repo source.

**Changed:**
- `js/berlintools-mobile-fixes.js` — raised sticky/footer spacing to 136px, tightened `More Berlin Tools` bottom padding, collapsed the empty spacer before the tour CTA, added readable CTA band padding/border rules, enlarged CTA text, and forces the CTA link to the canonical booking service URL.
- Project root `berlintools-mobile-tools-polish-custom-code.html`, `berlintools-cta-polish-custom-code.html`, `PROJECT_MEMORY.md`, `SESSION_LOG.md` — documented and deployed the live inline sources.
- Wix Custom Embed `Berlin tools fix` (`f412a295-3d53-4339-bcbc-5d1bb1389be9`) — updated to revision 10.
- Wix Custom Embed `BerlinTools CTA Polish` (`e7c8b2c9-34a5-4944-b042-4a947462cea3`) — created and updated to revision 2.

**Opened:** Push this repo when convenient so GitHub has the matching source.
**Closed:** Live Daily Budget mobile QA passed at 393px; revision 10 CSS loaded, related-card-to-CTA gap is 48px, CTA heading/body/button fonts are 30/16/14px, href is the booking service URL, and horizontal overflow is 0.

**Next session should:** Keep the live Wix embed inline unless deliberately moving back to the external GitHub Pages script.

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
