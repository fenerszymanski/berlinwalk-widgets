- 2026-07-02 10:28 CEST: First-Day Rescue Wix iframe/referrer handling hardened. `berlin-first-day-rescue-plan/index.html` now reads `order`, `token`, `session_id`, scenario, UTM, and API override from a trusted `berlinwalk.com` parent/referrer URL when the widget iframe URL itself has no query params; checkout redirects now target the top window instead of staying trapped inside the embed. QA: inline scripts parsed; Playwright direct token URL and simulated Wix parent/referrer flow both opened a 4-move plan, preserved `claimPlan`/Stripe session and Meta UTM payloads, used `/tools/berlin-first-day-rescue-plan` as page path, and had horizontal overflow `0`.

- 2026-07-02 10:18 CEST: First-Day Rescue post-payment result-screen bug fixed. `berlin-first-day-rescue-plan/index.html` no longer hides the whole body grid when `order` + `token` are present; it hides only the intake panel and trust panel, so the generated plan result remains visible after checkout/claim. QA from root/local preview: inline script parse OK; Playwright local product link showed 4 move cards, official checks, email sent status, horizontal overflow `0`; Meta asset captures were regenerated from the fixed UI with the private backup-link box hidden for public creative. Test CMS rows from this QA order were cleaned: 5 `FirstDayRescueEvents` + 1 `FirstDayRescueOrders` deleted. Stripe remains the launch blocker outside this repo.

- 2026-07-02 09:46 CEST: First-Day Rescue backup email/Velo kit added for the instant paid product. New files under `berlin-first-day-rescue-plan/email/` provide the single paste-ready Wix Triggered Email and setup checklist; new files under `berlin-first-day-rescue-plan/velo/` provide `post_rescuePlanEmail` and `backend/rescuePlanEmail.js` for sending the backup link through Wix Contacts + Triggered Emails. Backend changes live in the root Content App, not this repo: latest deploy `dpl_Au63NgCkwkZoaprjHFSWaQ8L5L4W` fixes the email payload so it includes recipient + first move. QA from root: Rescue guardrail test plus backup-email payload assertion passed; production health still shows Stripe/email missing. These files are setup support only; Meta campaign work remains blocked until real Stripe checkout and backup email delivery are verified.

- 2026-07-02 09:45 CEST: Berlin First-Day Rescue Plan widget source added and pushed. `berlin-first-day-rescue-plan/index.html` implements the mobile-first paid Rescue product UI: scenario select, short intake, Stripe handoff, tokenized post-payment plan render, PDF/print/copy, feedback, official links, and tour CTA. Commits pushed: `d4df917` (`Add first-day rescue plan widget`) and `c624b2c` (`Limit rescue mock checkout to local QA`). Backend lives in root `berlinwalk-content-app` and is deployed at `/api/rescue-plan`; it rejects public `mock=1` with `403 mock_not_allowed`. QA: inline script parse passed; local 390px and 1280px Playwright mock flows passed with 4 moves, ABC note, visible result, overflow `0`, console `0`; GitHub Pages path `https://fenerszymanski.github.io/berlinwalk-widgets/berlin-first-day-rescue-plan/` returned 200 after cache lag, while raw `c624b2c` confirms the local-only mock gate. Launch blockers remain outside this repo: missing Stripe secret and missing email webhook. Existing unrelated dirty World Cup/API-Football changes were not staged or reverted.

- 2026-07-02 09:19 CEST: Converted `worldcup-fixtures` knockout stage from a chronological KO card list into a FotMob-style two-sided bracket tree. `worldcup-fixtures/index.html` now places all 32 `KO` rows into left/right bracket columns with a center Final/Bronze/Champion stack and auto-draws SVG connector paths from `Wxx/Lxx` seed references, so future score edits still use the same `KO` array. Completed KO cards keep flag + team + score rows, PSO loser detection/cross-out remains active, and the bracket scrolls inside its own container on narrow screens without page overflow. `worldcup-fixtures/README.md` now records the bracket-display rule. QA: inline script syntax OK, `M=72/72 FT`, `KO=32/10 complete`; Playwright desktop 1280 + mobile 390px: page overflow `0`, `32` KO cards, `32` connector paths, `10` loser names; `git diff --check` clean. Not pushed.

- 2026-07-02 09:03 CEST: World Cup fixtures bracket/API follow-up completed. `worldcup-fixtures/index.html` now has the corrected current KO chain for `M85` Switzerland-Algeria, `M88` Australia-Egypt, `M89` Paraguay-France, `M90` Canada-Morocco, `M91` Brazil-Norway, `M92` Mexico-England, and `M94` United States-Belgium; `M77` header text now has real whitespace before the date, PSO losers remain crossed out, and mobile completed KO cards keep the flag + team + right-aligned score layout. Added `scripts/check-worldcup-api-football.mjs` as a local API-Football audit helper and documented it in `worldcup-fixtures/README.md`; the key is loaded from root Keychain service `berlinwalk-apisports-api-key` via `APISPORTS_API_KEY`, never from client-side widget code. API status works (`Free`, active, 100/day), but `league=1&season=2026` fixture fetch is blocked by API-Football Free-plan season limits (`try from 2022 to 2024`), so source cross-checking remains required. QA: `node --check scripts/check-worldcup-api-football.mjs`; API status OK; fixture fetch returns expected plan-limit blocker; inline parse `M=72/72 FT`, `KO=32/10`; Playwright desktop + 390px overflow `0`, `.bw-match.final=72`, `.bw-ko-match.complete=10`, 10 losers; `git diff --check` clean. Not pushed.

- 2026-07-02 08:39 CEST: Full browser completion audit finished for the BerlinTools global detail-template goal. All 83 visible `tools-hub/data.json` slugs were measured in a real browser at desktop and 390px mobile (166 viewport checks). First pass direct browser result was 162/166, with 4 early-load false failures; recheck with longer wait passed all 4 (`berlin-beer-gardens-map` desktop, `berlin-museums-map` mobile, `victory-column-climb-planner` mobile, `world-cup-2026-fixtures-berlin-time` mobile). Final aggregate: desktop iframe min `1020`, body min `960`, overflow max `0`; mobile iframe min `358`, body min `354`, overflow max `0`; East/West reference matched those metrics. Summary report: `../scratch/tools-detail-full-browser-audit-20260702-summary.json`. No additional live fix needed beyond the earlier `berlin-bouncer` CMS row.

- 2026-07-02 08:30 CEST: BerlinTools detail-page design audit completed after the global Wix template repair. Live source audit covered all 83 visible `tools-hub/data.json` slugs and found 83/83 returning `200` with `berlintools-template-design-polish-css`, `bw-tools-detail`, and no Wix 404. The only route defect was `berlin-bouncer`: it was visible in `tools-hub` but missing from the Wix BerlinTools CMS collection, so `/tools/berlin-bouncer` served a 404. Added the live CMS item `77e3f0b6-5117-4c28-a9d0-dbb8376735a3`, published the site, and added that `cmsItemId` to `tools-hub/data.json`. Focused Playwright QA on East/West reference, Victory Column, Plug Adapter, and Bouncer passed desktop + 390px mobile with iframe `1020px`/`358px`, body `960px`/`354px`, overflow `0`. Not pushed; pre-existing World Cup and widget-session-log changes remain untouched.

- 2026-07-02 08:25 CEST: Fixed World Cup fixtures knockout mobile layout and eliminated-team styling. `worldcup-fixtures/index.html` now assigns KO losers correctly for PSO rows, so Germany/Netherlands are crossed out after penalty losses; completed KO cards on mobile render as clean flag + team name + right-aligned score rows, with seed chips hidden only for completed mobile KO rows and kept for projected/pending rows. M77/Tue crowding was fixed by keeping the KO header flex with an 8px mobile gap. QA: inline parse `M=72/72`, `KO=32/10`; 390px Playwright overflow `0`, 10 loser names detected, M77 header gap `8px`, France/Sweden and Belgium/Senegal visual order measured as flag-name-score on the same row. Not pushed.

- 2026-07-02 08:12 CEST: World Cup fixtures score automation added 3 verified Round of 32 finals to `worldcup-fixtures/index.html`: `M80` England 2-1 DR Congo, `M82` Belgium 3-2 Senegal (`AET`), and `M81` United States 2-0 Bosnia and Herzegovina. The two stale projected KO matchups were corrected only for those due rows after FIFA/CBS/FOX/Guardian/ESPN source agreement; no fixture times, styling, filters, or unrelated widget behavior changed. `SCORE_UPDATED` is now `02 Jul 2026, 08:12 CEST`. QA: inline parse `M=72/72 FT`, `KO=32/10 complete`, due KO `0`; local Playwright desktop + 390px overflow `0`, `.bw-match.final=72`, `.bw-ko-match.complete=10`; `git diff --check` clean. Not pushed; GitHub Pages still needs push/deploy for the live widget.

- 2026-07-01 14:28 CEST: Exit-intent popup canlıda booking-first tamamlandı. Commit `315d38f` pushlandı; `js/exit-intent-popup.js` ve GitHub Pages artık primary `Book Walking Tour` -> booking URL, secondary `Plan first if needed` -> `/berlin-trip-planner#planner` veriyor. Wix Custom Embed `exit-intent-popup.js` (`cdd1bfca-4173-42e0-9c18-a066f7c03559`) revision `2` olarak commit-pinned jsDelivr URL'sine (`@315d38f`) çevrildi ve site publish çağrısı OK. Live Playwright `?bwExitPreview=1` QA: popup başlığı `Before you leave, book your Berlin walk.`, primary booking link doğru, secondary Trip Planner link doğru, console errors `0`. Public raw Wix HTML eski Pages URL snapshot'ını geçici gösterebilir ama Pages URL de artık booking-first kodu servis ediyor.

- 2026-07-01 13:55 CEST: Victory Column draft/tool package prepared and pushed, with blog publish intentionally paused for Yusuf approval. Commit `2f41c61` added `victory-column-climb-planner/`, Quick Summary/FAQ key `victory-column-berlin`, FAQ slug mappings/inject, `tools-hub` entry with CMS item `8347c218-3059-4972-bd68-1581c7359afd`, canonical 512/160 icon files, source prompts, blog body/source notes, 6-image visual pack/contact sheet, and QA evidence. GitHub Pages now serves widget, hero, QS/FAQ/tools-hub/icon assets with Victory markers; live `/tools/victory-column-climb-planner` and `/berlin-tools` QA passed desktop + 390px mobile with overflow `0`. Wix draft `15b9a51d-5892-4d67-8904-bdd90e5f0e77` remains `UNPUBLISHED`; `/blog` propagation and Search Console are pending publish approval.

- 2026-07-01 10:12 CEST: Git cleanup completed carefully. `main` was fetched and confirmed aligned with `origin/main` before edits; untracked QA screenshot folders `output/qa/berlin-accessibility-live-20260701/` and `output/qa/monthly-freshness-20260701/` were moved out of the repo to `../output/qa/berlinwalk-widgets-git-cleanup-20260701/` instead of being deleted. Kept the real tracked changes: prior session-log entries plus `ultimate-berlin-trip-planner/launch-audit.mjs` URL expectation updated from the old Ultimate blog slug to the live `/berlin-trip-planner` URL. Checks: `git diff --check` clean, `node --check ultimate-berlin-trip-planner/launch-audit.mjs` clean; full launch audit still has 6 pre-existing Ultimate planner blockers but the CMS URL check passes.

- 2026-07-01 09:56 CEST: Booking form spacing patch pushed and verified live. Commits/pushes: `d0ef0f3` (`Tighten booking form terms spacing`) and `cb6bac6` (`Pin booking form spacing patch`). `booking-calendar/book-now-intro-patch.js` version `booking-form-trust-20260701d` now tightens the free-reservation terms helper spacing and reduces the Wix form/details sibling margins on `/booking-form`; `js/blog-journey-inject.js` pins the loader to JSDelivr `@d0ef0f3`. Wix embed source in the root workspace was also updated to the same hash; live custom embed readback shows Booking Next Action Patch revision `6` and Booking Funnel Hotfix revision `21`. Live 390px QA from booking page to form loaded `@d0ef0f3`, kept the terms helper/trust card, showed Booking Details without the earlier blank gap, reduced helper-to-next-block gap from `118px` to `64px`, overflow `0`, and submitted no booking. Non-booking Meta campaigns untouched.

- 2026-07-01 09:08 CEST: Booking form trust copy clarified and verified live. Commits/pushes: `3dd009c` (`Clarify booking form trust copy`) and `add9af8` (`Pin booking trust helper CDN URL`). `booking-calendar/book-now-intro-patch.js` now runs on `/booking-form`, inserts a Step 2 trust card, explains free/no-upfront-payment, email tour details/reminders plus one post-tour review request, phone use only for tour-day coordination, and replaces the vague terms checkbox with a free-reservation terms label plus helper. `js/blog-journey-inject.js` loads the pinned JSDelivr helper on booking pages, covering live delivery while Wix viewer-model custom embed cache still serves the older raw HTML. Live 390px flow QA passed from service page → Continue to free reservation → form: new card/helper visible, old intro/terms absent, overflow `0`, no booking submitted. Non-booking Meta campaigns untouched.

- 2026-07-01 08:12 CEST: Booking-only conversion rollout pushed live without touching non-booking Meta campaigns. Commits/pushes: `5e758c8` (`Improve booking conversion bridges`), `e949a39` (`Add mobile booking next action patch`), `9f84c0a` (`Load booking next action patch from live helper`), and `c502d23` (`Refresh booking patch loader version`). `book-now-intro-patch.js` now replaces old intro copy, preserves attribution, and shows a mobile Continue nudge after slot selection; `booking-calendar-element.js` has matching free/no-upfront-payment/~2h/World Clock/Yusuf source copy; `js/blog-journey-inject.js` loads the booking patch only on `/book-berlin-walking-tour/`, so Wix custom embed cache lag no longer blocks the live fix. Live QA passed on 390px booking page: `book-now-intro-patch.js?v=booking-next-20260701b` loads, intro version marker is present, slot click shows nudge, nudge click reaches `/booking-form`, form inputs load, and `bw_booking_form_view` fires. Trip Planner Pages markers and live iframe are updated; Tempelhof blog post journey bridge renders with overflow `0` and the booking patch does not load on posts.

- 2026-07-01 07:39 CEST: Booking-only conversion implementation updated local widget surfaces without touching non-booking Meta campaigns. `book/book-element.js` now clarifies free reservation/no upfront payment/tip-based ~2h copy; `ultimate-berlin-trip-planner/index.html` now shows the tour card only for qualified tour-fit plans and adds separate recommendation view/click tracking while preserving `bw_trip_planner_book_click`; `js/blog-journey-inject.js` now chooses direct booking, planner/tool, or soft cultural bridge cards by post intent and adds intent/cta_kind payloads. QA: `node --check` for changed JS, inline script parse, scoped `git diff --check`, local Playwright screenshots, and local Trip Planner positive/negative gating checks. Not pushed per repo rule.

- 2026-07-01 06:29 CEST: Monthly freshness maintenance updated widget source for current facts: `worldcup-fixtures/index.html` now has Round of 32 final scores through Mexico 2-0 Ecuador plus known seed labels and `SCORE_UPDATED='01 Jul 2026, 06:36 CEST'`; `berlin-pride-parade-map/index.html` and `berlin-pride-week-timeline/index.html` now distinguish the main CSD route toward Victory Column from the Brandenburg Gate closing area. Inline script compile, parse check, scoped `git diff --check`, and local desktop/390px Playwright screenshots passed. Root report: `../output/automation-reports/blog-widget-freshness/2026-07-01/final-evidence.md`.

- 2026-07-01 04:03 CEST: BerlinWalk featured/listing yenileme kontrolü yapıldı. /blog lead değişmedi (berlin-heatwave-day-plan); /blog rail ve /berlin-tools Start here seti güncel kabul edilerek no-op olarak kapatıldı. Canlıda ana sayfa/blog/tools doğrulaması yapıldı.


## 2026-07-01 - Booking funnel mobile/tracking fixes

**Did:** Implemented Yusuf-approved conversion fixes from the Gemini strategy pass. **Changed:** `paid-landing/paid-landing-element.js` moves the mobile booking panel before long copy and tightens the first fold; `ultimate-berlin-trip-planner/index.html` restores a visible tour bridge after plan generation and decorates its booking links; `js/blog-journey-inject.js` decorates utility-blog `/book` and `/book-berlin-walking-tour...` links, preserves incoming paid UTMs, and sends first-party booking-click events. Commits/pushes: `c1261de` (`Fix booking funnel mobile CTAs and tracking`), `c4f3fd5` (`Track booking links from blog posts`), and `01446d2` (`Preserve paid attribution on blog booking clicks`). **QA:** Syntax checks, `git diff --check`, GitHub Pages marker checks, local Playwright QA, and live mobile QA passed. Paid landing live CTA is in first viewport; utility blog live test preserved `bw_blog_utility_jul2026` UTMs and wrote a paid `bw_booking_pick_date_click` into `PaidFunnelEvents`; Trip Planner live iframe shows/decorates the arrival-day booking card with overflow `0`. **Closed:** Campaign-critical mobile booking visibility and utility-blog/Trip Planner booking tracking gaps are fixed; Direct Booking spend was not scaled.

## 2026-06-30 - Blog widget/image spacing guard

**Did:** Fixed Yusuf's remaining Tempelhof live spacing complaint where the Quick Summary widget still touched the first article image. **Changed:** `js/blog-journey-inject.js` now marks real widget iframe wrapper blocks with `data-bw-blog-widget-block` and applies durable bottom margin (`34px` desktop, `28px` mobile), instead of relying on spacer paragraphs that the helper itself hides as empty. Commit/push: `4098df1` (`Add blog widget image spacing guard`). **QA:** `node --check js/blog-journey-inject.js`, `git diff --check`, raw GitHub marker check, GitHub Pages marker check with `Last-Modified: Tue, 30 Jun 2026 20:54:42 GMT`, and live Playwright QA passed. Tempelhof desktop gap measured `34px`; 390px mobile gap measured `28px`; marker active, overflow `0`, console errors `0`. **Closed:** Widget-to-image sticking is fixed sitewide for BerlinWalk blog posts.

## 2026-06-30 - Tempelhof planner visual feedback fix

**Did:** Yusuf's Tempelhof widget feedback was addressed by making the post-specific tool less repetitive and more visual. **Changed:** `tempelhof-field-planner/index.html` now has a changing photo-led visual panel with real Tempelhof article images, route-moment thumbnails, and goal-specific captions; `tools-hub/data.json` embedHeight for `tempelhof-field-planner` is now `1660`. Commit/push: `5438b96` (`Improve Tempelhof field planner visuals`). **QA:** Inline JS compile, `node tools-hub/validate-data.mjs`, `git diff --check`, local desktop + 390px Playwright QA passed with visual panel present, interaction changing the image/moments, loaded images, and overflow `0`. GitHub Pages served the new widget marker `bw-visual-panel` and tools-hub `embedHeight:1660` with Last-Modified around `Tue, 30 Jun 2026 20:30:40-43 GMT`. Live Wix post iframe was patched to `?v=20260630b` / height `1660`; frame QA confirmed visual panel present and overflow `0`. **Closed:** Tempelhof widget now has a richer visual layer; future daily-blog widgets should avoid reused picker/checker/card skeletons.

## 2026-06-30 - Tempelhof Airport Berlin daily blog/tool launch

**Did:** Completed the full Tempelhof daily blog/tool package and live publish chain. **Changed:** Added `tempelhof-field-planner/`, Quick Summary/FAQ key `tempelhof-airport-berlin`, regenerated `faq/inject.js`, added `tools-hub` entry, canonical 512/160 icons and source prompt files, widget hero visual/source notes, local blog body/package notes, 6-image Wikimedia visual pack/contact sheet, and `/blog` related mapping. Pre-publish commit `8f3ec0d`; post-publish `/blog` commit `a277622`; BerlinTools CMS item `4e6cd799-5586-423d-afb9-ca4724d0e3ed`; Wix Media icon `https://static.wixstatic.com/media/5a08a3_c8948d95cbca4fdcb8e772b85a719e40~mv2.png`; BerlinTools Layout Fixes revision `53`. **QA:** GitHub Pages served widget/QS/FAQ/tools-hub/icon assets before publish and later served `/blog` data with `tempelhof-airport-berlin` Latest #1 + `relatedToolSlug: tempelhof-field-planner`. Wix post `34504a17-002a-4b24-8cdb-abdb82ab68ab` is `PUBLISHED` with `hasUnpublishedChanges:false`, 3 embeds, 6 images/all alt text, canonical/robots/BlogPosting and no leak terms. Local/live desktop + 390px QA passed for widget, post, tool page and `/blog` with overflow `0`. Search Console API says both blog and tool are `URL is unknown to Google`; UI Request Indexing remains manual because Chrome automation could not create a controllable tab. **Closed:** Tempelhof post, widget, BerlinTools CMS/tool, icon, `/blog` propagation, Pages deploy and live QA are complete except manual Search Console UI indexing.

## 2026-06-30 - AI visual source rule updated

**Did:** Root workspace visual policy now makes built-in Codex image generation the first target for BerlinWalk generated visuals, with Yusuf's logged-in ChatGPT account through Chrome, Atlas, or the Codex browser as fallback.
**Changed:** `../AGENTS.md`, `../PROJECT_MEMORY.md`, `../BERLINWALK_BRAND_REFERENCE.md`, `../BLOG_POST_PRODUCTION_STANDARD.md`, and `AGENTS.md` were updated so new game art, BerlinTools icons, blog/social AI visuals, and widget hero visuals follow the same source order.
**QA:** Text rule sweep confirmed the active standards no longer say ChatGPT browser is the default; old historical session entries were left unchanged as history.
**Closed:** Paid/API image generation, CLI image generation, and local placeholders still require Yusuf's explicit API/exception request.

## 2026-06-30 - Core Web Vitals desktop CLS/LCP fix

**Did:** Search Console'daki 89 URL desktop Core Web Vitals uyarısı için canlı/lab tanı ve düzeltme tamamlandı.
**Changed:**
- `blog-index/blog-index-element.js` — `/blog` lead image eager/high priority yapıldı; commit `9bb4328`.
- `js/blog-sidebar-inject.js` — sitewide canlı yol üzerinden custom-element ilk ekran rezervi, kısa cloak/reveal ve sayfa bazlı preload/preconnect ipuçları eklendi; son commit `5e3eb59`.
- `js/cwv-reserve-head.js` — HEAD yedek helper aynı rezerv/preload mantığına taşındı; commit `5e3eb59`.
- Root workspace `berlinwalk-cwv-reserve-head.html` ve Wix custom embed `BerlinWalk Core Web Vitals Reserve Head` revision `3` güncellendi; public HTML için güvenilir canlı yol hâlâ `blog-sidebar-inject.js?v=25`.
**QA:** GitHub Pages `blog-sidebar-inject.js?v=25` marker `installCoreWebVitalsHints` servis ediyor. Cache-disabled desktop Playwright: `/berlin-tools` CLS `0.0052` LCP `1032ms`; `/games` `0.0052` / `880ms`; `/meeting-point` `0.0051` / `980ms`; `/berlin-walking-tour-route` `0.0052` / `1200ms`; `/widgets` `0.0052` / `1720ms`; `/blog` `0.0690` / `1456ms`.
**Opened:** Search Console field/CrUX verisi hemen temizlenmez; 2026-06-30'da desktop CLS ve LCP için UI validation başlatıldı, sonuç günler/haftalar içinde izlenmeli.
**Closed:** Canlı lab örneklerinde desktop CLS > 0.1 ve LCP > 2.5s problemi giderildi.

## 2026-06-30 - Berlin Split real Berlin map replacement

**Did:** Yusuf'un "gerçekçi harita ama gerçekçi Berlin haritası olsun" düzeltmesi uygulandı; mini-map artık AI arşiv masasından kırpılmış uydurma harita değil, OpenStreetMap tabanlı gerçek Berlin merkez haritası.
**Changed:**
- `berlin-split/assets/source/osm-real-map-20260630/` — central Berlin OSM tile source (`960x600`, center `52.5208,13.4074`, zoom `13`) ve source README eklendi.
- `berlin-split/assets/visuals/berlin-split-real-berlin-map.webp` — hafif archive-styled ama gerçek Berlin sokak/Spree/mahalle dokusunu koruyan final map asset eklendi.
- `berlin-split/data.json` — `visuals.map`, `visuals.mapAttribution` ve 10 mission için gerçek konumdan hesaplanmış mapPoint yüzdeleri eklendi.
- `berlin-split/index.html` — mini-map artık `visuals.map` kullanıyor; aria label `Realistic Berlin map with current file pin`; OSM attribution görünür render ediliyor.
- `berlin-split/SOURCES.md` — OSM attribution/source notu eklendi.
**QA:** JSON parse + inline script compile geçti; tüm visual asset yolları mevcut; `git diff --check -- berlin-split` temiz; local desktop ve 390px mobile QA'da map image `assets/visuals/berlin-split-real-berlin-map.webp`, attribution `© OpenStreetMap contributors`, pin yüzdeleri doğru, overflow `0`.
**Opened:** Berlin Split hâlâ public `/games` listesine alınmamalı; sonraki turda oyun anlaşılırılığı/start metin yoğunluğu/audio/social-cover devam etmeli.
**Closed:** Mini-map artık gerçek Berlin merkez haritasına dayalı.

## 2026-06-30 - Berlin Split realistic mini-map fix

**Did:** Yusuf'un rahatsız olduğu cartoon/SVG mini-map kaldırıldı ve mission/status panelindeki harita gerçekçi archive-map görseli üzerine pin koyan bir case-map paneline çevrildi.
**Changed:**
- `berlin-split/index.html` — `mapSvg()` artık SVG çizimi üretmiyor; `assets/visuals/berlin-split-map.webp` görselini kullanıyor ve current file pin'ini CSS ile konumlandırıyor.
- Eski `West`, `East`, `Rebuilt`, cartoon river/wall çizimleri ve SVG map sınıfları kaldırıldı.
**QA:** JSON parse + inline script compile geçti; `git diff --check -- berlin-split/index.html` temiz; local desktop ve 390px mobile QA'da `.bs-map` artık `DIV`, SVG yok, map image yüklü, overflow `0`.
**Opened:** Haritanın daha da doğru coğrafi hissedilmesi istenirse sonraki turda ayrı bir gerçek Berlin route-map görseli üretilebilir; mevcut hızlı düzeltme prototype cartoon hissini kaldırdı.
**Closed:** Mission ekranındaki en göze batan gerçekçi olmayan mini-map kaldırıldı.

## 2026-06-30 - Berlin Split premium visual pass

**Did:** Berlin Split'in zayıf görsel katmanı için ChatGPT-browser workflow üzerinden ana harita görseli ve 10 görev görseli üretildi, optimize edildi ve yerel prototipe bağlandı.
**Changed:**
- `berlin-split/assets/source/visual-prompts-20260630.md` — ana harita + 10 görev için internal prompt/asset brief eklendi.
- `berlin-split/assets/source/chatgpt-visuals-20260630/` — 11 kaynak PNG kaydedildi.
- `berlin-split/assets/visuals/` — final `960x600` WebP seti eklendi: `berlin-split-map.webp` + 10 mission visual.
- `berlin-split/data.json` — version `2026-06-30-berlin-split-visuals-v1`; start visual ve her mission için `visual` yolu eklendi.
- `berlin-split/index.html` — start preview artık gerçek archive-map görselini kullanıyor; mission dossier içine geniş görsel alanı eklendi; mobilde dossier/görsel status-map panelinden önce geliyor; start/mission/checkpoint/result geçişlerinde scroll reset eklendi.
**QA:** 11 asset yolu dosyada doğrulandı; JSON parse + inline script compile geçti; `git diff --check -- berlin-split` temiz; local `http://127.0.0.1:8766/berlin-split/?tracking=off` desktop start/mission ve 390px mobile start/mission QA'da görseller yüklü, overflow `0`, mobile mission visual first-screen içinde. Contact sheet: `output/qa/berlin-split-visuals-contact-sheet-20260630.jpg`.
**Opened:** Oyun hâlâ live `/games` listesine alınmamalı; sonraki turda start ekranı metin yoğunluğu, oyun anlaşılırılığı, gerçek audio/voice kararı ve final social/cover asset değerlendirilmeli.
**Closed:** Rejected local SVG/placeholder görsel yerine premium visual package yerel prototipe bağlandı.

## 2026-06-30 - Berlin Split held from Games hub and clarified locally

**Did:** Yusuf'un geri bildirimi üzerine Berlin Split oyununu bitmeden `/games` hub listesinden geri çektim ve yerel prototipi daha anlaşılır hale getirdim.
**Changed:**
- `games-page/games-page-element.js` — Berlin Split kartı, board satırı ve hero/mode metnindeki archive referansları kaldırıldı; hub artık yalnızca Berlin Battle, Berghain Bouncer, Berlin Smile Challenge ve Berlin Day Survival gösteriyor.
- `berlin-split/index.html` + `data.json` — start ekranına 4 adımlı oyun brifingi eklendi; kötü SVG-heavy preview yerine evidence-desk/tray önizlemesi geldi; recovered file rozetleri `TV/RR/MI` yerine `01 TV Tower Signal` gibi açık adlar gösteriyor; seçenekler `East Berlin layer` / `Border zone layer` gibi daha net tray diline çekildi; ses için görünür `Turn sound on` / `Test sound` kontrolü ve daha belirgin browser SFX eklendi.
- Root `scripts/upsert-games-page-wix-embed.mjs` — canlı eski script cache'i için URL-guarded güvenlik hotfix'i üretir hale getirildi; Wix `BerlinWalk Games Page Hub` embed revision `15` güncellendi ve site publish endpoint OK döndü.
**QA:** JSON parse, inline script compile, `node --check`, `git diff --check`, yerel desktop + 390px mobil browser QA geçti; canlı `https://www.berlinwalk.com/games` cache-disabled QA 4 kart, Berlin Split yok, overflow `0`, console errors `0`.
**Opened:** Berlin Split final launch için premium ChatGPT-browser görsel üretimi, gerçek audio/voice kararı ve yeni full QA gerekiyor.
**Closed:** Berlin Split artık taze canlı `/games` renderında public listeye çıkmıyor.

## 2026-06-30 - World Cup knockout loser styling

**Did:** KO final kartlarında elenen takım adları çizilecek şekilde düzeltildi; penaltı kaybedenleri mevcut PSO winner/loss mantığıyla aynı stili alıyor.
**Changed:**
- `worldcup-fixtures/index.html` — `.bw-ko-side.loss .bw-ko-name` artık muted + line-through.
- `worldcup-fixtures/README.md` — KO display kuralı eklendi.
**Opened:** GitHub Pages yayılımı push sonrası kontrol edilmeli.
**Closed:** Penaltılarda elenen takımın sadece gri kalıp çizilmemesi sorunu.
**Next session should:** Canlı widget'ta M74/M75 kaybeden adlarının çizildiğini kontrol et.

## 2026-06-30 - World Cup score automation push rule

**Did:** Yusuf'un yeni skor otomasyonu kuralı uygulandı: skor eklendiyse doğrulama ve loglardan sonra commit + push yapılacak; no-op koşulu dosyasız/logsuz/commit'siz kalacak.
**Changed:**
- `worldcup-fixtures/README.md` — yeni commit/push kuralı eklendi.
- Repo push kapsamı Yusuf'un isteğiyle mevcut tracked değişikliklerin tamamı olarak belirlendi.
**Opened:** GitHub Pages yayılımı push sonrası kontrol edilmeli.
**Closed:** World Cup skor otomasyonunda "skor varsa push da yap" kuralı netleşti.
**Next session should:** Gelecek skor otomasyonu run'larında verified score varsa commit ve push adımını varsayılan yap.

## 2026-06-30 - World Cup Round of 32 scores

**Did:** `worldcup-fixtures` KO skor güncellemesi tamamlandı; önceki no-op sebebi `M` grup dizisinin dolu, Round of 32 maçlarının ise `KO` dizisinde olmasıydı.
**Changed:**
- `worldcup-fixtures/index.html` — 4 Round of 32 final skoru eklendi: South Africa 0-1 Canada, Brazil 2-1 Japan, Germany 1-1 Paraguay (Paraguay 4-3 pens), Netherlands 1-1 Morocco (Morocco 3-2 pens).
- `worldcup-fixtures/index.html` — `KO` satırları opsiyonel home/away goals, status ve penaltı skorlarını render ediyor; `Next match` artık grup aşaması bittikten sonra KO maçlarını da sayıyor; `SCORE_UPDATED` `30 Jun 2026, 08:03 CEST`.
**Opened:** Canlı GitHub Pages için push/deploy gerekiyor.
**Closed:** R32 ilk dört biten maç widget kaynak dosyasında skorlandı.
**Next session should:** Push sonrası `https://fenerszymanski.github.io/berlinwalk-widgets/worldcup-fixtures/` üzerinde `SCORE_UPDATED` ve KO skorlarının yayıldığını kontrol et.

## 2026-06-30 — Codex (widget git cleanup + log push)

**Did:** `berlinwalk-widgets` repo state was cleaned without touching tracked source/data work.
**Changed:**
- Removed only untracked transient QA artifacts: the new `.playwright-cli` console/page files, `output/playwright/hohenzollern-post-publish-20260629/`, and the accidental older nested copy `berlinwalk-widgets/blog-index/`.
- Preserved newly discovered `berlin-plug-adapter-checker` visual assets instead of deleting them: widget hero, matching raw blog hero copy, ChatGPT source icon, and canonical 512/160 icon PNGs. No widget HTML, `tools-hub`, CMS, or live page wiring was created.
- `SESSION_LOG.md` now includes the pending daily featured listing handoff plus this cleanup note; source files and GitHub Pages data were not regenerated.
**Opened:** None.
**Closed:** Local git noise from recent listing/Hohenzollern QA runs, while preserving meaningful plug-adapter visual work.
**Next session should:** Treat `blog-index/data.json` on `origin/main` as the canonical listing source; use the plug-adapter files as visual-only starting assets if that package resumes.

## 2026-06-30 — Codex (Daily featured listing refresh)

**Did:** `/blog` listesi güncel Wix API envanteriyle yeniden üretildi ve `berlinwalk-widgets/blog-index/data.json` güncellendi.
**Changed:**
- `blog-index/data.json` — hero/yan liste güncellendi ve `updatedAt` yenilendi; `tools-home` ve `tools-hub` veri dosyalarına elle dokunulmadı.
- Push edildi: `785597d` (`Refresh daily featured blog index`) to `origin/main`.
**Opened:** GitHub Pages `blog-index/data.json` yayın gecikmesi.
**Closed:** araç seçimleri mevcut haliyle kaldı.
**Next session should:** GH Pages `Last-Modified`/`updatedAt` doğrulaması tamamlanınca `/blog` ve `/berlin-tools` için hızlı canlı kontrol yap.

## 2026-06-29 - Hohenzollern Berlin blog/tool live

- Completed the Hohenzollern package and pushed the post-dependent assets. Pre-publish commit `20075c3` added `blog-drafts/hohenzollern-berlin*`, 5 article images/contact sheet/source notes, Quick Summary/FAQ key `hohenzollern-berlin`, widget `hohenzollern-berlin-footprint-map/`, tool icon assets, and the `tools-hub/data.json` entry.
- Wix side is live: blog post `54fb4473-415e-4aea-aec2-ed5ee11c0d1a` at `/post/hohenzollern-berlin` is `PUBLISHED` with `hasUnpublishedChanges:false`; BerlinTools CMS item `857cfd0f-635c-4b72-9c7b-959aa3c026e6` is live at `/tools/hohenzollern-berlin-footprint-map` with icon `5a08a3_88050f0309d54e469956379f69701b50~mv2.png`.
- GitHub Pages proof: widget/index, widget hero, tools-hub data, Quick Summary/FAQ data, and icon assets served before Wix publish; widget/icon Last-Modified around `Mon, 29 Jun 2026 19:57:38-39 GMT`.
- Post-publish commit `cd3f827` regenerated `blog-index/data.json` to 154 posts with `hohenzollern-berlin` as Latest #1 and related tool `hohenzollern-berlin-footprint-map`; Pages Last-Modified `Mon, 29 Jun 2026 20:07:27 GMT`. Follow-up commit `e761dc4` fixed direct widget mobile overflow; live 390px QA now reports overflow `0`, root width `390`, and console errors `0`.
- Live QA passed for the blog post, tool page, `/blog`, `/berlin-tools`, and direct widget on desktop/mobile. Search Console URL Inspection API stayed blocked by `invalid_grant`; manual Request Indexing remains for the blog and tool URLs.

## 2026-06-29 - Games mobile layout and cross-promo rail

- Pushed commit `a225928` (`Fix game mobile layout and cross-promos`) to `origin/main`. Changed files: Day Survival `index.html`/`data.json`, new shared `js/games-preview-rail.js`, and wrappers for Berlin Battle, Day Survival, Berghain Bouncer, and Berlin Smile Challenge.
- Day Survival mobile order fix: round/result copy renders before the scene/result image, avoiding Yusuf's screenshot issue where text was visually left under the photo.
- Added below-game preview rail across the four current game pages: each page shows the other three games, excludes itself, uses existing social images, and is mobile-safe.
- Checks passed: `node --check` for changed JS/root helper, inline Day Survival script evaluation, scoped `diff --check`, secret scan, local Playwright 390px round/result/wrapper QA with overflow `0`, and live GitHub Pages proof with Last-Modified `Mon, 29 Jun 2026 19:43:41-43 GMT`.
- Live QA passed for Battle/Bouncer/Smile pages. Day Survival Wix custom embed API is revision `24` with new build and preview rail, but the public parent page still serves the old parent marker from Wix cache; direct iframe content is already new `2026-06-29-day-survival-mobile-copy-v8b`, including when requested through the old v7e query.

## 2026-06-29 - Berlin Split local implementation

- Added `berlin-split/` as a standalone premium archive/map game for `/games/berlin-split`: 10 missions, 3 acts, Archive Integrity, clue spending, checkpoint retry, collapse, ranked endings, synthesized SFX, share/copy, booking CTA, and `bw_berlin_split_*` tracking calls. Mission content is in `berlin-split/data.json`; internal source links are in `berlin-split/SOURCES.md`.
- Added `berlin-split-page/` wrapper with `<bw-berlin-split-page>`, local preview and SEO settings. Added Berlin Split to `games-page/games-page-element.js` as an `Archive game` card using `berlin-split/assets/social/berlin-split-social.svg`.
- Root-side tracking support was also added outside this repo: `berlinwalk-content-app/api/track-trip-planner-event.js`, `berlinwalk-content-app/vercel.json`, `scripts/setup-berlin-split-events-collection.mjs`, and `scripts/berlin-battle-dashboard-server.mjs`.
- Local QA passed: JSON/syntax/inline script checks, public quiz/provenance leak scan, desktop clean run to `Myth Breaker 100% intact` with overflow `0`, mobile collapse + checkpoint retry to `Friedrichstrasse Checkpoint` with overflow `0`, wrapper desktop/mobile iframe load, and games hub card/image load. Screenshots saved under `output/playwright/berlin-split-page-*-20260629.png`.
- Not done: no commit/push, no GitHub Pages proof, no Wix page/publish, no Vercel deploy, and no live `BerlinSplitEvents` collection setup run.

## 2026-06-29 - Day Survival v8 live completion

- Pushed `55ecfbd` (`Fix Day Survival fail state and voiceovers`) and `f9a7171` (`Log Day Survival v8 local fix`) to `origin/main`; GitHub Pages serves `2026-06-29-day-survival-fail-audio-v8` with `Last-Modified Mon, 29 Jun 2026 11:27:30 GMT`. The currently embedded Wix iframe URL still may show the old `?v=day-survival-share-v7e-20260628` query in parent raw HTML, but that URL now returns the v8 game file from GitHub Pages.
- Root Wix custom embed `BerlinWalk Berlin Day Survival Page` (`a567bbda-814e-4950-90fb-9affc2cc87ef`) was updated to revision `23` with v8 marker; Site Publisher API returned OK. API readback has v8/no v7e. Public parent raw marker can lag, so future QA should verify the iframe content or direct iframe URL, not only the parent shell string.
- Live Playwright QA on the public iframe URL passed: desktop negative route gives `Budget Busted`, `data-outcome="failed"`, wallet `-EUR 40.20`, red wallet score, `You did not survive the day`, overflowX `0`, and `alexanderplatz-victim.webp` with `object-fit: contain`; mobile EUR 10 clean route gives `Smart Wanderer`, `data-outcome="survived"`, wallet `EUR 0.60`, overflowX `0`, and `smart-wanderer.webp` with `object-fit: contain`.
- Live audio QA passed: Sunday condition requested `morning-supermarket-yogurt-banana-sunday-shops.mp3` and `hydration-supermarket-water-sunday-shops.mp3` with the v8 marker. Live `assets/audio/GENERATION_NOTES.json` shows voice `Jonas - Confident and Trustworthy` (`60UU378MZ8YbeLyaF7TI`), `force.voice=true`, and 32 generated runtime voice clips.

## 2026-06-29 - Hohenzollern Berlin content-only draft

- Added local blog draft files only: `blog-drafts/hohenzollern-berlin.body.md`, `blog-drafts/hohenzollern-berlin.md`, and `blog-drafts/hohenzollern-berlin.notes.md`. Topic: `Hohenzollern Berlin`, category `Berlin History`, selected future widget slug `hohenzollern-berlin-footprint-map`.
- Public body passed `node ../scripts/validate-blog-publish-body.mjs blog-drafts/hohenzollern-berlin.body.md` from the workspace root and a voice/provenance leak scan. No live widget, Quick Summary/FAQ JSON, tools-hub entry, icon, CMS item, images, Wix draft/publish, commit or push was done.
- Next explicit step: after Mac unlock, build the required ChatGPT-browser widget hero/icon, add QS/FAQ/widget/tools-hub/CMS/assets, then run the normal pre-publish deploy and Wix publish chain.

## 2026-06-29 - Day Survival v8 local fail/audio fix

- Commit `55ecfbd` (`Fix Day Survival fail state and voiceovers`) is local only, not pushed. It changes Day Survival to fail any final wallet below `EUR 0` via `Budget Busted`, failed-result copy, red negative wallet score, and keeps the EUR 10 clean route viable (`Smart Wanderer`, `EUR 0.60` in local QA).
- Images now render through full-image `object-fit: contain` scene/result panels with centered media, less aggressive background pattern, opaque result card, and share-card canvas drawing without extra crop. Local Playwright desktop negative fail and 390px mobile positive survive passed with overflowX `0`; QA screenshots are under `output/playwright/day-survival-v8-20260629/` and are intentionally untracked.
- All 32 runtime voice clips were regenerated through ElevenLabs with `Jonas - Confident and Trustworthy` (`60UU378MZ8YbeLyaF7TI`) for one consistent German-accented English voice. Missing variant clips were added, obsolete `hydration-club-mate.mp3` was removed, and voice audit found 32 targets / 32 actual / no missing/extra/small files. Root Wix helper is locally bumped to `day-survival-fail-audio-v8-20260629`; dry-run against current custom embed revision `22` passed. Next explicit step: push commit, wait for Pages, run root upsert helper, then live desktop/mobile QA.

## 2026-06-29 - Berlin Museums Map design polish

- `berlin-museums-map/index.html` polished after Yusuf flagged the Wix CMS tool page design: hero made tighter, quick-fact chips added, sidebar controls compressed, map/list heights adjusted, and root box sizing fixed to prevent desktop overflow.
- Commit `da6f335` (`Polish Berlin Museums Map tool design`) pushed to `origin/main`; GitHub Pages serves the updated widget with `Last-Modified Mon, 29 Jun 2026 08:33:39 GMT` and the `bw-hero-stats` marker.
- Yusuf clarified the Wix page design polish should be global for the shared BerlinTools CMS detail template. Root-side `Berlin Museums Tool Design Polish` is now disabled at revision `3`; active global embed is `BerlinTools Template Design Polish` (`c17893d2-4720-418b-a16c-68f0b53fc16f`) revision `3`, guarded to `/tools/<slug>` pages, widening the iframe and improving the CMS body rhythm for all tool detail pages. Live desktop/mobile QA passed on Museums, Breakfast, and Transport with overflowX `0` and console errors `0`.

## 2026-06-29 — Codex (Breakfast icon standard fix)

## 2026-06-29 - Berlin Museums Map live QA + push complete

- Pushed `Add Berlin Museums Map featured tool rollout` (`c5d4f3d`) and follow-up fix `Fix BerlinTools museums spotlight render` (`0bbcbaf`) to `main`.
- Verified GitHub Pages serves `berlin-museums-map/`, updated `tools-hub/data.json`, `tools-home/data.json`, `tools-home/icons/berlin-museums-map.png`, and SEO JSON-LD block with `/tools/berlin-museums-map` under the 7k Wix JSON limit.
- Browser QA: direct widget page has the Berlin Museums Map UI, Leaflet map, 9 controls and 96 cards; `/berlin-tools` has the premium spotlight and links; `/tools/berlin-museums-map` has the H1, intro, data note and museum iframe; homepage has the museum-day teaser; sample blog post shows the `Museum planning shortcut` CTA.
- Wix Blog API readback: all five target blog posts contain the CTA heading, copy and `/tools/berlin-museums-map` link, with `hasUnpublishedChanges=false`.

## 2026-06-29 - Berlin Museums Map BerlinTools placement

- Wired `berlin-museums-map` into `tools-hub/data.json` with spotlight metadata, Culture/Landmarks category placement, Wix Media icon URL, widget URL, SEO title, tags and aliases.
- Added optional spotlight rendering to `tools-hub/tools-hub-element.js` and optional homepage teaser rendering to `tools-home/tools-home-element.js`; both are backward-compatible if the spotlight data is absent.
- Added standard icon assets and manifest entry, regenerated widgets-hub SEO JSON-LD with compact URL-only ItemList, and set top five blog-index related tool slugs to `berlin-museums-map`.
- Live Wix side: BerlinTools CMS item inserted, icon uploaded to Wix Media, layout icon map embed revision 49, and five published blog posts received a `Museum planning shortcut` CTA.
- Remaining: push/GitHub Pages propagation and browser/live QA need an explicit follow-up.

**Did/Changed/QA:** Replaced the off-standard dark `Berlin Breakfast Clock` icon with a brighter ChatGPT-browser standard-fix icon matching the glossy BerlinTools app-icon family. New source: `tools-home/icons/_src/chatgpt-standard-20260612/berlin-breakfast-clock/chatgpt-output-20260629-standard-fix.png`; old dark source/canonical icons preserved under `rejected-old/`. Canonical `tools-home/icons/berlin-breakfast-clock(.png/-160.png)`, icon manifests/cache/summary, and `tools-hub/data.json` now point to Wix Media `5a08a3_d099fe41ab4a41748d76b9d927d3f185~mv2.png`. BerlinTools CMS item `ff4f47e7-de46-4d51-be91-cb2006e22242` was updated and BerlinTools Layout Fixes embed is revision `48`. Visual contact sheet compared fixed Breakfast against Club/Boat; JSON checks, `node tools-hub/validate-data.mjs`, and `git diff --check` passed. `berlinwalk-widgets` commit `8808884` pushed; GitHub Pages proof shows `tools-hub/data.json` with the new URL and `berlin-breakfast-clock-160.png` 48,925 bytes, Last-Modified `Mon, 29 Jun 2026 05:54:25 GMT`. Live `/berlin-tools` and `/widgets` readbacks show the new icon URL and no old `4f2efe...` URL. Existing untracked `berlin-museums-map/` was not touched.

## 2026-06-29 — Codex (Resources menu Day Survival cleanup)

**Did/Changed/QA:** Fixed the live navigation bridge bug where `Berlin Day Survival` was being inserted into the Resources dropdown as well as Games. Root `../scripts/upsert-games-nav-footer-embed.mjs` now identifies real Games dropdowns before adding Day Survival and actively removes any leaked Day Survival link from Resources menus. Wix custom embed `BerlinWalk Games Nav Footer Patch` (`a41c00c9-4f72-44a7-a366-69fdeb2349f8`) updated from revision `8` to revision `9`. `node --check` and dry-run passed. Live Playwright desktop and 390px mobile QA confirmed Games includes All Games/Berlin Battle/Berlin Day Survival/Berghain Bouncer/Berlin Smile Challenge, Resources includes only Meeting Point/Tour Route/Berlin Hacks/Blog/Embed Berlin Tools, footer Play still includes Day Survival, and console errors were `0`. Existing untracked `berlin-museums-map/` and `output/qa/icon-audit-20260629/` were not touched.

## 2026-06-28 — Codex (Day Survival share/copy v7e)

**Did/Changed/QA:** Download card action was removed from the Day Survival result screen because desktop downloads were unreliable in Wix. Commits `66540cc`, `75e0690`, and `c12ce91` are pushed to `origin/main`; live game version is `2026-06-28-day-survival-share-v7e`. Desktop result action now labels `Copy result`; mobile/native-share environments label `Share result`. Desktop/mobile detection no longer treats the narrow Wix iframe as mobile, and copy now skips blocked async Clipboard API when Wix permissions policy disallows it, avoiding console errors while using legacy copy fallback. GitHub Pages serves v7e for `data.json`/`index.html` with `Last-Modified Sun, 28 Jun 2026 11:55:00 GMT`. Wix custom embed `BerlinWalk Berlin Day Survival Page` is revision `22` with iframe marker `day-survival-share-v7e-20260628`. Live Playwright QA: desktop result actions `Copy result`, `Play again`, `Book the tour`, click toast `Result copied.`, no `Download card`, overflow `0`, console errors `0`; iPhone-style mobile emulation action `Share result`, share payload called, toast `Shared.`, overflow `0`, console errors `0`.

**Need:** Root workspace is not a git repo, so `scripts/upsert-day-survival-page-wix-embed.mjs` remains a local root helper with `GAME_BUILD` v7e. Unrelated untracked `.playwright-cli/` snapshot and `output/qa/faq-breakfast-in-berlin-20260628.md` remain unstaged.

## 2026-06-28 — Codex (Day Survival closed supermarket label)

**Did/Changed/QA:** Follow-up fix for Yusuf's note that the Sunday night supermarket option looked like `EUR 0`. Commit `76f0b9f` pushed: `berlin-day-survival/data.json`/`index.html` bumped to `2026-06-28-day-survival-logic-v7b`; the Sunday `Try the supermarket anyway` variant now carries `costLabel: "Closed"`, and the renderer displays `costLabel` before falling back to price/`EUR 0`. Wix custom embed `BerlinWalk Berlin Day Survival Page` revision `19` points to iframe marker `day-survival-logic-v7b-20260628`. GitHub Pages v7b proof: `Last-Modified Sun, 28 Jun 2026 11:17:10 GMT`. Live Playwright forced Sunday condition verified the night supermarket option shows label `Closed`, not `EUR 0`; page/frame overflow `0`, console errors `0` except normal Wix info log.

**Need:** Unrelated breakfast/FAQ/quick-summary dirty files were present and intentionally left untouched.

## 2026-06-28 — Codex (Day Survival logic v7 live)

**Did/Changed/QA:** Day Survival logic v7 pushed and live. Commit `f859bda` pushed to `origin/main`; GitHub Pages serves `2026-06-28-day-survival-logic-v7` for `data.json` and `index.html` with `Last-Modified Sun, 28 Jun 2026 11:02:17 GMT`. Root Wix custom embed `BerlinWalk Berlin Day Survival Page` revision `18` now points the iframe to `?v=day-survival-logic-v7-20260628`. Wix API readback: enabled, hasV7 true, hasOldV6 false; live raw HTML has v7 marker. Live Playwright desktop EUR 10 route returned `Smart Wanderer`, wallet `EUR 0.06`, Fuel/Street Smarts `100`, no-prior-döner label `Late döner rescue`, overflow `0`. Live 390px mobile verified first choice clickable, prior coffee -> `Second coffee`, prior döner -> `Döner again`, overflow `0`, console errors `0` except normal Wix info log.

**Need:** Native Wix raw SEO/social issue from earlier remains separate; logic v7 deploy is complete.

## 2026-06-28 — Codex (Day Survival logic v7)

**Did/Changed/QA:** Berlin Day Survival logic v7 local source'a işlendi. `berlin-day-survival/data.json` version `2026-06-28-day-survival-logic-v7`; `index.html` cache marker aynı sürüme çıktı. Coffee/döner follow-up şıkları artık önceki tag'lere göre değişiyor: no prior coffee -> `Coffee instead of lunch`, prior coffee -> `Second coffee`, no prior döner -> `Late döner rescue`, prior döner -> `Döner again`. EUR 10 hard mode için supermarket 1.5L water + Pfand, supermarket bakery/backshop, bakery rescue ve closing-time rescue fiyatları yeniden dengelendi; örnek clean route `EUR 0.06` ile bitiyor. Sunday condition supermarket seçeneklerini bakery/station-shop fallback varyantlarına çeviriyor, gece kapalı market denemesi intentional mistake olarak kalıyor. Wide standalone view'da sahne görselinin choices üzerine tıklama engellemesi `.bw-day-art` width cap ile düzeltildi. QA: JSON + inline script syntax OK, diff check OK, route simulation OK, local Playwright desktop dynamic-label route OK, 390px mobile route/result overflow `0`, screenshot `../output/playwright/day-survival-logic-v7-20260628/mobile-result-390-stable.png`. Only local favicon 404 console noise.

**Need:** Commit/push yapılmadı; GitHub Pages ve Wix live hâlâ v6 olabilir. Push sonrası Pages Last-Modified proof ve live Day page cache-buster QA yapılmalı.

## 2026-06-28 — Codex (git cleanup + internal credit fix)

**Did/Changed/QA:** Tourist Scams canlı yazısındaki internal AI/workflow Image Credits satırı Wix'te kaldırıldı ve readback `PUBLISHED` + `hasUnpublishedChanges:false` + process leaks `[]` verdi. Repo cleanup temiz worktree üzerinden yapıldı: commit `309912b` public visual provenance leak rule + Tourist Scams body cleanup, commit `1c2c733` World Cup fixture scores, commit `6d9f2c9` Games hub responsive spacing source fix. QA: publish-body validator OK, World Cup JS parse `72` rows / `72` scored rows, Games source `node --check`, diff checks, live blog visible-text Playwright scan hits `[]`, 3 iframes, overflow `0`.

**Need:** Ana çalışma klasöründeki yarım merge bu remote state'e hizalanmalı; önce backup branch alın, sonra local `main` temiz `origin/main` state'ine çekilsin.

## 2026-06-28 — Codex (Bike Lane Reflex Checker BerlinTools promotion)

**Did/Changed/QA:** `berlin-bike-lane-reflex-checker` BerlinTools'a promote edildi. ChatGPT-browser workflow ile özel glossy icon üretildi; kaynak/prompt `tools-home/icons/_src/chatgpt-standard-20260612/berlin-bike-lane-reflex-checker/`, canonical 512/160 PNG'ler ve manifest/cache kayıtları eklendi. Wix Media icon `5a08a3_4be8ea9d7658487eb0dc039fac4c6a7e~mv2.png`, `tools-hub` entry + CMS item `99c88603-4a9d-4584-a8ef-528148a14262`, `/blog` relatedToolSlug mapping, ve BerlinTools Layout Fixes embed rev `44` tamamlandı. Commit `14fec67` pushed. Pages QA: icon 200, tools-hub CMS ID live, blog-index Bike Lanes related tool live; browser QA `/tools/berlin-bike-lane-reflex-checker`, `/berlin-tools`, `/widgets` overflow `0`. Search Console UI: tool URL `URL is not on Google / URL is unknown to Google`, sonra `Indexing requested`.

**Need:** Ana çalışma klasöründe bu iş dışı Games/World Cup/Street Sense kirleri var; bu run Bike Lane işini temiz worktree üzerinden pushladı ve onları ezmedi.

## 2026-06-28 — Codex (Day Survival featured image + nav/footer)

**Did/Changed/QA:** Berlin Day Survival featured/social görseli Yusuf'un logged-in ChatGPT browser workflow'u ile yenilendi. İlk title/logo yazılı çıktı reddedildi; ikinci textless output `berlin-day-survival/assets/source/chatgpt-browser-20260628/berlin-day-survival-featured-source-chatgpt-browser-20260628.png` olarak saklandı ve okunur sayı/title kalmayacak şekilde crop edilip `berlin-day-survival/assets/social/berlin-day-survival-social-1200x630.jpg` (1200x630, 167 KB) olarak optimize edildi. Prompt notu aynı source klasöründe. `site-header/site-header-element.js` ve `site-footer/site-footer-element.js` native kaynaklarına `Berlin Day Survival` linki eklendi. Root Wix upload `5a08a3_e4d8920ebc644e29b734e41fb0e816cd~mv2.jpg`; `BerlinWalk Berlin Day Survival Page` embed rev `17`, `BerlinWalk Games Nav Footer Patch` rev `8` enabled. Live cache-buster Playwright QA: Day embed title/görsel payload'ı yeni, game iframe açılıyor, header/footer/mobile DOM'da Day links oluşuyor.

**Need:** Native Wix raw SEO/Social Share hâlâ eski image/title/description ve Berlin Battle JSON-LD taşıyor; Wix Studio page SEO/Social Share panelinden yeni Wix Media image seçilip publish edilmeli, sonra raw `og:image`/`twitter:image` doğrulanmalı. Bu run'da Atlas UI odağı güvenilir olmadığı için native SEO paneli tamamlanamadı. Commit/push henüz yapılmadı; repo içinde bu iş dışı `games-page`, `worldcup-fixtures`, `berlin-tourist-scams`, `berlin-street-sense-drill` kirleri de var.

## 2026-06-28 — Codex (Games hub mobile hero fit)

**Did/Changed/QA:** `/games` hub mobil hero kırpılması düzeltildi. `games-page/games-page-element.js` build marker `games-page-mobile-hero-fit-20260628`; mobile h1 `clamp(43px, 14.2vw, 62px)` ve daha küçük text-shadow kullanıyor, Wix host height clamp `4200px` -> `6200px` oldu. Root `scripts/upsert-games-page-wix-embed.mjs` aynı cache-buster ile canlı CSS/height hotfix'i taşıyor; Wix custom embed `BerlinWalk Games Page Hub` rev `7` olarak patch'lendi. QA: `node --check`, `git diff --check`, local Playwright 430px/390px overflow `0`, başlık kesilmiyor, root height `4695px`/`4645px`; canlı raw HTML marker ve `14.2vw` hotfix'i doğrulandı. Live headless visual QA Wix load timeout nedeniyle raw readback + local render ile sınırlı kaldı.

**Need:** Bu fix henüz commit/push yapılmadı; repo zaten worldcup/header/footer/Day Survival kaynaklı ayrı kirli dosyalar taşıyor.

## 2026-06-28 — Codex (World Cup fixtures score update)

**Did/Changed/QA:** `worldcup-fixtures/index.html` dosyasında 6 tamamlanmış maçın final skoru eklendi: Panama 0-2 England, Croatia 2-1 Ghana, Colombia 0-0 Portugal, DR Congo 3-1 Uzbekistan, Algeria 3-3 Austria, Jordan 1-3 Argentina. `SCORE_UPDATED = '28 Jun 2026, 08:29 CEST'` olarak güncellendi. Node parse kontrolüyle `M` dizisi ve skorlu satır sayısı doğrulandı; `git diff --check` geçti.

**Need:** Değişikliklerin canlıda görünmesi için GitHub Pages push/deploy gereklidir.

## 2026-06-28 — Codex (daily featured/listing refresh)

**Did/Changed/QA:** Daily featured/listing refresh completed from the Wix Blog API with `148` posts. `/blog` lead stays `berlin-heatwave-day-plan` because the live Berlin weather check still supports the current heat/summer context; rail is `doctor-in-berlin`, `lost-property-berlin`, `drink-alcohol-in-public-berlin`, `topography-of-terror-berlin`, and `berlin-public-transport-ferries`. Homepage blog teaser keeps Heatwave featured; mini posts are now Doctor, Lost Property, Public Drinking, and Topography; right rail stays Sachsenhausen, BER Airport Departure Guide, and World Cup. Changed `blog-index/data.json` and `blog-home/data.json`; tools data stayed unchanged. Commit `c90e448` was pushed to `origin/main`. Root Wix custom embed `BerlinWalk Blog Featured Posts` was patched from revision `15` to `16` because rev15 did not include Doctor. Validation passed: JSON parse, `node --check scripts/generate-blog-index-data.mjs`, root `node --check scripts/update-blog-feature-embed.mjs`, `node tools-hub/validate-data.mjs` (`72 tools, 70 visible`), and `git diff --check`. GitHub Pages updated after a short lag (`Last-Modified Sun, 28 Jun 2026 05:58:16-18 GMT`). Live Playwright snapshot QA desktop + 390px passed for homepage, `/blog`, `/berlin-tools`, and `/widgets`: expected blog/tool selections present, `/berlin-tools` Start here unchanged, `/widgets` shows the same tool data and `Show embed code` buttons. Search Console Doctor indexing remains outside this refresh scope.

## 2026-06-28 — Codex (Doctor in Berlin blog/tool package)

**Did/Changed/QA:** Daily blog package `Doctor in Berlin: What Tourists Should Do When They Feel Unwell` went live. Commit `d3c61a4` added `berlin-medical-help-router/`, `doctor-in-berlin` Quick Summary/FAQ/body/notes/image pack/contact sheet, regenerated FAQ inject/slug-map, dedicated ChatGPT-browser glossy icon source + canonical 512/160 PNGs, Wix Media icon `5a08a3_a61e109960c04189ab9eed81b3cfb620~mv2.png`, `tools-hub` entry and CMS item `94b60571-ec7b-4d9f-aee9-f56079443e4b`; root BerlinTools Layout Fixes embed is revision `42`. Wix Blog post ID `437810b3-64ee-466b-906f-ce95a318d24c` is `PUBLISHED` with `hasUnpublishedChanges:false`, 3 embeds, 5 image nodes/all alt text, canonical/robots/BlogPosting and no leak terms. Commit `def0e60` regenerated `blog-index/data.json` to 148 posts and added explicit `doctor-in-berlin -> berlin-medical-help-router` related tool mapping; GitHub Pages serves the widget/QS/FAQ/tools-hub/icon assets and `/blog` data, with Doctor as Latest #1 and hero secondary #1. Local and live Playwright QA passed desktop + 390px mobile with overflow `0` for the widget, blog post, tool page, `/blog`, and `/berlin-tools`. Search Console API is still `invalid_grant`; Playwright UI fallback hit Google sign-in, so manual Request Indexing remains unless logged-in Chrome fallback is explicitly approved.

## 2026-06-27 — Codex (Berlin Day Survival design v6)

**Did/Changed/QA:** Yusuf'un geri bildirimi sonrası Day Survival v6 canlıya alındı. Commit `a436354` gerçek BerlinWalk BW logo assetini `berlin-day-survival/assets/brand/berlinwalk-bw-logo.png` olarak ekledi, sahte `BW` çizimini topbar/download card'dan kaldırdı, Bricolage Grotesque + IBM Plex Mono fontlarını ve Späti/receipt-style UI çizgilerini ekledi, mobile scene/result art'ı `292x183` 16:10 oranına döndürdü, metrikleri `Wallet`, `Fuel`, `Smarts`/`Street Smarts` olarak daha anlaşılır yaptı, data version'ı `2026-06-27-day-survival-design-v6` yaptı. GitHub Pages v6 live proof: `Last-Modified Sat, 27 Jun 2026 14:22:26 GMT`, logo `200`; Wix custom embed `BerlinWalk Berlin Day Survival Page` revision `16`, iframe marker `day-survival-design-v6-20260627`, raw source has font markers and `#bw-sticky-cta` hide rule. Live 390px QA with `tracking=off`: iframe `346x700`, sticky CTA `display:none`, parent/frame overflowX `0`; first decision logo natural `405x405`, scene image `960x600`, visible art `292x183`, copy not clipped, overlap `0`; six decisions to result, result art `292x183`, result image `960x600`, art/title overlap `0`, actions bottom `603/700`, console errors `0` (only Wix preload warnings). Worktree still has unrelated dirty bike-lane draft files; not touched here.

## 2026-06-27 — Codex (Berlin Day Survival live launch)

**Did/Changed/QA:** `Berlin Day Survival` is live at `https://www.berlinwalk.com/games/berlin-day-survival`. Widget commit `a857921` added the game/wrapper/hub/home assets; follow-up commit `06f5a2b` tolerates empty `204` tracking responses and bumps the wrapper/game cache marker to `day-survival-full-v1b-20260627`. Content app production deploy `dpl_9gCD3iiYfxRziGUu5sPua1N5cgPJ` is live, `/api/day-survival-event` writes to Wix CMS `BerlinDaySurvivalEvents`, and the local Games dashboard includes Day Survival. Wix page custom embed `BerlinWalk Berlin Day Survival Page` is revision `2`; `/games` hub and homepage teaser both include the fourth game. Live raw checks: page HTTP `200`, no `noindex`, title `Berlin Day Survival Game | BerlinWalk`, no old Smile copy, wrapper query `v1b`. Production QA passed direct game desktop + 390px mobile full quiet-mode runs, result image `960x600`, download/booking controls, tracking responses `204`, console warnings `0`, wrapper iframe `v1b`, overflowX `0`.

## 2026-06-27 — Codex (Berlin Day Survival local V1)

**Did/Changed/QA:** Added local Full V1 for `Berlin Day Survival`: new standalone game in `berlin-day-survival/`, Wix wrapper in `berlin-day-survival-page/`, 3 budgets, 6 day conditions, 6 decision rounds, 24 choices, 8 result types, share/download card, quiet/sound modes, generated raster scene/result/social assets, ElevenLabs ambience + feedback voice audio, local UI SFX, `/games` hub card and homepage games teaser card. Content app tracking was wired locally through `/api/day-survival-event` to new Wix CMS collection `BerlinDaySurvivalEvents` (created/verified with 53 fields), and the local Games dashboard now includes Battle/Bouncer/Smile/Day Survival while hiding `codex_smoke` QA rows by default. QA passed: data/asset validator (`51` refs, none missing), syntax checks, py_compile, `git diff --check`, Playwright desktop + 390px local wrapper/game runs, sound mode, result image load, result card download (`1080x1350`, 216 KB), hub/home 4-card rendering, overflow `0`; only console noise was local favicon 404. Not pushed/deployed/published yet: next step is GitHub Pages push, Content Studio Vercel deploy, Wix `/games/berlin-day-survival` install/publish, SEO/social image setup, then live QA.

## 2026-06-27 — Codex (daily featured/listing refresh)

**Did/Changed/QA:** Daily featured/listing refresh completed from the Wix Blog API with `147` posts. `/blog` lead stays `berlin-heatwave-day-plan`; rail is now `lost-property-berlin`, `drink-alcohol-in-public-berlin`, `topography-of-terror-berlin`, `berlin-public-transport-ferries`, and `where-to-watch-2026-world-cup-in-berlin`. Homepage blog teaser keeps Heatwave featured; mini posts are Lost Property, Public Drinking, Topography, and Ferry; right rail is Sachsenhausen, BER Airport Departure Guide, and World Cup. Changed only `scripts/generate-blog-index-data.mjs`, `blog-index/data.json`, and `blog-home/data.json`; tool featured/home selections were intentionally unchanged. Root Wix custom embed `BerlinWalk Blog Featured Posts` was patched to revision `15`. Validation passed: JSON parse for listing data, `node --check scripts/generate-blog-index-data.mjs`, root `node --check scripts/update-blog-feature-embed.mjs`, `node tools-hub/validate-data.mjs` (`71 tools, 69 visible`), and `git diff --check`. Commit `ceecbfd` was pushed to `origin/main`; GitHub Pages updated after a short lag (`Last-Modified Sat, 27 Jun 2026 06:55:43/06:56:04 GMT`). Live Playwright QA desktop + 390px passed for homepage, `/blog`, `/berlin-tools`, and `/widgets`: expected new blog selections/tool data present, `/berlin-tools` Start here unchanged, `/widgets` sees Lost Item Router, horizontal overflow `0`; `/blog` still has known Wix 403 exposure noise. Existing unrelated `SESSION_LOG.md` and `worldcup-fixtures/index.html` dirty changes were not included in the refresh commit.

## 2026-06-27 — Codex (World Cup fixtures knockout fill)

**Did/Changed/QA:** `worldcup-fixtures` knockout section was expanded from stage placeholders into 32 match fixtures with match numbers, Berlin CEST kick-off times, seed labels, matchup/slot labels, venues, and projected markers for unresolved Round of 32 rows. Changed `worldcup-fixtures/index.html` renderer/CSS plus `worldcup-fixtures/README.md`; group score rows were not changed. QA: inline Node parse found `72` group rows, `66` final scores, `32` KO rows, `0` malformed KO rows; `git diff --check -- worldcup-fixtures/index.html worldcup-fixtures/README.md` passed; local Playwright desktop 1280 and mobile 390 showed `.bw-ko-match = 32`, all stage headers visible, horizontal overflow `0`, with only local favicon 404 console noise. GitHub Pages still needs commit/push/deploy; projected rows should be finalized after the last group games.

## 2026-06-27 — Codex (Search Console indexing requested)

**Did/Changed/QA:** Chrome/Search Console UI manual Request Indexing completed for `https://www.berlinwalk.com/post/drink-alcohol-in-public-berlin`, `https://www.berlinwalk.com/post/lost-property-berlin`, and `https://www.berlinwalk.com/tools/berlin-lost-item-router`. Each URL Inspection result was `URL is not on Google / URL is unknown to Google` before submit; after `REQUEST INDEXING`, Google returned `Indexing requested` and added the URL to the priority crawl queue. Updated `output/qa/post-publish-20260627/search-console-blocker.json` to `resolved_via_chrome_browser`; no site/widget/blog content changed.

## 2026-06-27 — Codex (two daily posts post-publish follow-up)

**Did/Changed/QA:** Yusuf published `drink-alcohol-in-public-berlin` and `lost-property-berlin`; Wix API readback shows both `PUBLISHED` with `hasUnpublishedChanges:false`. Commit `f0106b9` was pushed to regenerate `blog-index/data.json` to 147 posts and add `lost-property-berlin` -> `berlin-lost-item-router` related-tool mapping. GitHub Pages now serves both widgets, Quick Summary and FAQ keys, plus Lost Property tools-hub/icon data; `/blog` live QA desktop + 390px mobile shows both new posts with overflow `0`; both post URLs and `/tools/berlin-lost-item-router` return 200 with expected iframes and mobile overflow `0`. Search Console URL Inspection is blocked by `invalid_grant`, so manual Request Indexing remains. Public Drinking BerlinTools CMS/tool promotion is still intentionally blocked until a required ChatGPT-browser glossy icon is generated; no placeholder entry was added.

## 2026-06-27 — Codex (World Cup fixtures score update)

**Did:** At 08:29 CEST automation run, final scores were added for 4 due FIFA World Cup group-stage matches: Cape Verde 0-0 Saudi Arabia, Uruguay 0-1 Spain, Egypt 1-1 Iran, New Zealand 5-1 Belgium.

**Changed:** Only `worldcup-fixtures/index.html` changed. Four `M` rows were completed with final score fields and `SCORE_UPDATED` was set to `27 Jun 2026, 08:29 CEST`.

**QA:** Inline JS smoke check passed with 72 rows total and 66 scored rows; `SCORE_UPDATED` label updated. Playwright desktop/mobile visual check was not run in this pass.

**Opened:** GitHub Pages still needs commit/push/deploy for live widget updates.

**Closed:** 2026-06-27 due score update done locally.

## 2026-06-26 — Codex (World Cup fixtures score update)

**Did:** Added final scores for the two score-check-due FIFA World Cup group matches in the 23:32 CEST automation run: Norway 1-4 France, Senegal 5-0 Iraq.

**Changed:** `worldcup-fixtures/index.html` only: two `M` rows gained final-score fields and `SCORE_UPDATED` is now `26 Jun 2026, 23:32 CEST`.

**QA:** Inline JS parse found 72 rows, 62 scored rows, and 0 malformed rows. Local Playwright QA at 1280px and 390px found `.bw-match.final = 62`, updated label visible, both new scores visible, horizontal overflow `0`. `git diff --check -- worldcup-fixtures/index.html` passed.

**Opened:** Commit/push/deploy is still needed before GitHub Pages live widget updates.

**Closed:** Due score updates are complete locally.

## 2026-06-27 — Codex (daily featured/listing refresh)

**Did:** Günlük featured/listing refresh tamamlandı; Wix Blog API envanteri 145 postla yenilendi, Heatwave lead korundu, Topography ve Sachsenhausen `/blog` rail ve homepage mini kartlara alındı. `/berlin-tools` ve `/widgets` tool seçimleri bilerek aynı bırakıldı.

**Changed:** `scripts/generate-blog-index-data.mjs`, `blog-index/data.json`, `blog-home/data.json`; root Wix custom embed `BerlinWalk Blog Featured Posts` revision `14` olarak patch'lendi.

**QA:** JSON parse, `node --check scripts/generate-blog-index-data.mjs`, root `node --check scripts/update-blog-feature-embed.mjs`, `node tools-hub/validate-data.mjs` (`71 tools, 69 visible`) ve `git diff --check` geçti. Commit `3dc6796` origin/main'e push edildi; GitHub Pages önce eski JSON'u servis etti, sonra `Last-Modified Sat, 27 Jun 2026 02:08:36/37 GMT` ile güncellendi. Canlı Playwright QA: homepage ve `/blog` Topography/Sachsenhausen/Ferry/BER/World Cup seçimlerini görüyor; `/berlin-tools` ve `/widgets` aynı Start here/tool data setini görüyor; dört URL'de horizontal overflow `0`. `/blog` console'daki `bulk/report-exposures` 403 ve blog widget route log'u mevcut Wix gürültüsü.

**Opened:** Bu run dışı Lost Property/FAQ/Quick Summary/tool/icon ve World Cup değişiklikleri worktree'de kirli duruyor; refresh commit'ine alınmadı.

**Closed:** Discovery/listing yüzeyleri 2026-06-27 run'ı için canlıda güncel.

## 2026-06-26 — Codex (Lost Property Berlin draft assets)

**Did:** Created the widget-repo package for the unpublished Wix draft `Lost Property in Berlin: What to Do if You Lose Your Phone, Wallet or Passport`. **Changed:** Added `blog-drafts/lost-property-berlin.{body,notes,md}`, image/source pack and contact sheet under `blog-drafts/images/lost-property-berlin/`, Quick Summary/FAQ key `lost-property-berlin`, regenerated `faq/inject.js`, added widget `berlin-lost-item-router/`, generated dedicated ChatGPT-browser glossy icon source + `tools-home/icons/berlin-lost-item-router*.png`, added `tools-hub/data.json` entry with Wix Media icon `5a08a3_9d395f9e6f294a0d828c4a1d559b1b7e~mv2.png` and CMS item `acb9bea5-acdd-4b7c-add9-4f2a41864a84`; root script `update-berlintools-layout-icons-embed.mjs` now drops nonessential card transition CSS and live embed revision is `41`. **QA:** Local widget/QS/FAQ desktop + 390px mobile QA passed with overflow `0`; `node tools-hub/validate-data.mjs`, FAQ audit, body validator, syntax/JSON checks, scoped public-voice scan, and `git diff --check` passed. Wix draft readback is `UNPUBLISHED` with 3 embeds, 4 images/all alt text, 9 links, and full SEO/social/JSON-LD; Wix tool route returns 200. **Opened:** Push/deploy this repo before GitHub Pages serves the new widget/QS/FAQ/tool data; current Pages widget URL is 404 and live data lacks the key/slug. **Closed:** Local blog/widget/tool/icon package is complete and no paid image API was used.

## 2026-06-26 — Codex (Topography post-publish deploy)

**Did:** Completed widget-repo publish follow-up for the live Topography of Terror post/tool package. **Changed:** Commit `fce4f93` regenerated `blog-index/data.json` to 145 posts and pinned `topography-of-terror-berlin` as Latest #1 with related tool `topography-of-terror-visit-planner`; commit `583cca2` removed draft-only Image Credits wording from the local Topography markdown/body. Original asset package remains commit `f440c55`. **QA:** `node scripts/validate-blog-publish-body.mjs`, `node tools-hub/validate-data.mjs`, syntax checks, and `git diff --check` passed. GitHub Pages serves the widget, Quick Summary/FAQ keys, tools-hub entry/icon, and `blog-index/data.json`; browser QA passed for `/blog`, `/berlin-tools`, `/tools/topography-of-terror-visit-planner`, and the live blog post desktop/mobile with overflow `0`. **Opened:** Search Console indexing is tracked in root output because the Google API token returned `invalid_grant`. **Closed:** Topography widget/tool/listing assets are pushed and live.

## 2026-06-26 — Codex (Topography of Terror draft assets)

**Did:** Created the widget-repo package for the unpublished Wix draft `Topography of Terror Berlin: Free Museum, Wall Remains and How to Visit It Right`. **Changed:** Added `blog-drafts/topography-of-terror-berlin.{body,notes,md}`, image/source pack and contact sheets under `blog-drafts/images/topography-of-terror-berlin/`, Quick Summary/FAQ key `topography-of-terror-berlin`, regenerated `faq/inject.js`, added widget `topography-of-terror-visit-planner/`, generated dedicated ChatGPT-browser glossy icon source + `tools-home/icons/topography-of-terror-visit-planner*.png`, added `tools-hub/data.json` entry with Wix Media icon `5a08a3_7c08680425d24ed7a8102b074ff7188f~mv2.png` and CMS item `5fce74f3-4583-4248-a850-bc3445c0c310`; root script `update-berlintools-layout-icons-embed.mjs` now minifies CSS before icon-map replacement and live embed revision is `40`. **QA:** Local widget/QS/FAQ desktop + 390px mobile QA passed with overflow `0`; `node tools-hub/validate-data.mjs`, body validator, syntax/JSON checks, and `git diff --check` passed. Wix draft readback is `UNPUBLISHED` with 3 embeds, 5 images/all alt text and full SEO/social/JSON-LD; Wix tool route returns 200. **Opened:** Push/deploy this repo before GitHub Pages serves the new widget/QS/FAQ/tool data; current Pages widget URL is 404. **Closed:** Local blog/widget/tool/icon package is complete and no paid image API was used.

## 2026-06-26 — Codex (World Cup fixtures score update)

**Did:** Added final scores for the six score-check-due FIFA World Cup group matches in the 08:03 CEST automation run: Curaçao 0-2 Ivory Coast, Ecuador 2-1 Germany, Japan 1-1 Sweden, Tunisia 1-3 Netherlands, Türkiye 3-2 United States, Paraguay 0-0 Australia.

**Changed:** `worldcup-fixtures/index.html` only: six `M` rows gained final-score fields and `SCORE_UPDATED` is now `26 Jun 2026, 08:03 CEST`.

**QA:** Inline JS parse found 72 rows, 60 scored rows, and 0 malformed rows. Local Playwright QA at 1280px and 390px found `.bw-match.final = 60`, updated label visible, horizontal overflow `0`; only local favicon 404 console noise. `git diff --check -- worldcup-fixtures/index.html` passed.

**Opened:** Commit/push/deploy is still needed before GitHub Pages live widget updates.

**Closed:** Due score updates are complete locally.

## 2026-06-26 — Codex (daily featured/listing refresh)

**Did:** Günlük featured/listing refresh tamamlandı; Wix Blog API envanteri 143 postla yenilendi, Heatwave lead korundu, Ferry postu `/blog` rail ve homepage mini kartlara alındı. `/berlin-tools` ve `/widgets` tool seçimleri bilerek aynı bırakıldı.

**Changed:** `scripts/generate-blog-index-data.mjs`, `blog-index/data.json`, `blog-home/data.json`; commit `29b116b` origin/main'e push edildi. Root Wix custom embed `BerlinWalk Blog Featured Posts` revision `13` olarak patch'lendi.

**QA:** JSON parse, `node --check scripts/generate-blog-index-data.mjs`, root `node --check scripts/update-blog-feature-embed.mjs`, `node tools-hub/validate-data.mjs` (`68 tools, 66 visible`) ve `git diff --check` geçti. GitHub Pages kısa gecikmeden sonra `Last-Modified Fri, 26 Jun 2026 02:06:32/33 GMT` ile güncel blog data'yı servis etti. Canlı Playwright QA: homepage Ferry mini kart, `/blog` Heatwave + Ferry rail, `/berlin-tools` mevcut Start here altılısı, `/widgets` aynı tool data; horizontal overflow `0`.

**Opened:** Bu run dışında kalan Sachsenhausen/FAQ/Quick Summary/tool/icon değişiklikleri worktree'de kirli duruyor; refresh commit/log kapsamına alınmadı.

**Closed:** Discovery/listing yüzeyleri 2026-06-26 run'ı için canlıda güncel.

## 2026-06-25 — Codex (Berlin ferry guide publish assets)

**Did:** Pushed and verified the Berlin public transport ferry guide widget/tool assets and post-publish `/blog` mapping.

**Changed:** Commit `71efe4e` added `berlin-public-transport-ferry-picker/`, Quick Summary/FAQ key `berlin-public-transport-ferries`, regenerated FAQ slug mapping/inject data, blog draft/image/source notes, dedicated ferry icon assets, and `tools-hub/data.json`. Commit `f106634` refreshed `blog-index/data.json` to 143 Wix posts and added explicit ferry-post related-tool mapping.

**QA:** `tools-hub/validate-data.mjs`, body leak validator, JSON/syntax checks, staged secret scan, and `git diff --check` passed before push. GitHub Pages now serves the direct widget, QS/FAQ keys, tools-hub entry/icon, and `/blog` data with ferry as Latest #1; live browser QA passed desktop/mobile post, `/blog`, `/tools/berlin-public-transport-ferry-picker`, direct widget, and widget interaction with overflow `0`.

**Opened:** Search Console indexing request remains manual from root post-publish run because URL Inspection API returned `invalid_grant`.

**Closed:** Widget repo deployment and live Pages surfaces for the ferry guide are complete.

## 2026-06-25 — Codex (World Cup fixtures score update)

**Did:** Added final scores for the four score-check-due FIFA World Cup group matches in the 08:30 CEST automation run: Scotland 0-3 Brazil, Morocco 4-2 Haiti, Czechia 0-3 Mexico, South Africa 1-0 South Korea.

**Changed:** `worldcup-fixtures/index.html` only: four `M` rows gained final-score fields and `SCORE_UPDATED` is now `25 Jun 2026, 08:33 CEST`.

**QA:** Inline JS parse found 72 rows, 54 scored rows, and 0 malformed rows. Local Playwright QA at 1280px and 390px found `.bw-match.final = 54`, updated label visible, horizontal overflow `0`; only local favicon 404 console noise. `git diff --check` passed.

**Opened:** Commit/push/deploy is still needed before GitHub Pages live widget updates.

**Closed:** Due score updates are complete locally.

## 2026-06-25 — Codex (Berlin flea markets publish)

**Did:** Published `Berlin Flea Markets: Mauerpark, Boxhagener Platz and the Weekend Treasure Hunt` live at `https://www.berlinwalk.com/post/berlin-flea-markets`; post ID `dfa7343f-4019-4d5c-ac34-d25a3a80bcd9`.

**Changed:** `scripts/generate-blog-index-data.mjs` now maps flea-market posts to `berlin-flea-market-picker`; `blog-index/data.json` regenerated from Wix Blog API with 139 posts and the new post as Latest #1. Commit `425d73e` was pushed to `origin/main`.

**QA:** Direct widget/QS/FAQ are live on GitHub Pages; Wix API readback confirmed `PUBLISHED`, `hasUnpublishedChanges:false`, 3 embeds, 5 images/captions, all alt text, canonical, robots and BlogPosting JSON-LD. Live browser QA passed desktop and 390px mobile for the blog post, `/tools/berlin-flea-market-picker`, and the direct widget with overflow `0`; widget interaction updated to `Flea Market on Strasse des 17. Juni`. Search Console UI returned `Indexing requested` for the blog URL and tool URL.

**Opened:** GitHub Pages deploy for `425d73e` succeeded but edge `blog-index/data.json` may briefly serve old cache; recheck the cache-busted JSON if `/blog` rail looks stale.

**Closed:** Flea market blog/tool package is live and post-publish QA is complete.

## 2026-06-25 — Codex (transport ticket picker option audit)

**Did:** Audited the Berlin public transport ticket picker against current official BVG, VBB, S-Bahn Berlin, DB Deutschland-Ticket, and Berlin WelcomeCard sources after Yusuf flagged missing LGBT/Queer ticket options.

**Changed:** Rebuilt `transport-calculator/index.html` from the narrow old calculator into a broader ticket picker covering single, short trip, 4-trip, 4-short-trip, reduced fares, 24-hour, small group, bicycle add-ons, Deutschland-Ticket caveat, CityTourCard, EasyCityPass, Berlin WelcomeCard, WelcomeCard Museum Island, Berlin joycard, and QueerCityPass. Updated `transport-compare/index.html`, `tools-hub/data.json` search/tags/embed height, `welcomecard-calculator/index.html` 2026 AB Classic prices + 6-day option, and `welcomecard-compare/index.html` Basic/All Inclusive wording.

**QA:** `tools-hub/data.json`/`tools-home/data.json` JSON parse passed; `node tools-hub/validate-data.mjs` passed with `65 tools, 63 visible`; inline script parse passed for `transport-calculator` and `welcomecard-calculator`; `git diff --check` passed. Local Playwright QA on `127.0.0.1:4180`: transport calculator desktop/mobile overflow `0`, QueerCityPass and joycard render, 6-day AB ranks CityTourCard first at `EUR 51.00`, ABC 72h includes Museum Island and QueerCityPass, short-trip-only case returns `EUR 2.80`; transport compare and WelcomeCard surfaces mobile overflow `0`.

**Opened:** Commit/push/deploy is still needed before GitHub Pages/live Wix iframes serve the updated picker. WelcomeCard attraction discount values themselves were not fully re-audited; this run only corrected the public-transport price layer and visible variant caveats.

**Closed:** The local public transport picker now exposes the missing tourist/pass families, including QueerCityPass/LGBT-relevant options, instead of hiding them behind the old narrow ticket model.

## 2026-06-25 — Codex (daily blog draft: Berlin flea markets)

**Did:** Created unpublished Wix Blog draft `Berlin Flea Markets: Mauerpark, Boxhagener Platz and the Weekend Treasure Hunt` for focus keyword `Berlin flea markets`, category Tourist Tips. Draft ID `dfa7343f-4019-4d5c-ac34-d25a3a80bcd9`; API readback status `UNPUBLISHED`.

**Changed:** Added local draft/body, image/source pack, Quick Summary/FAQ key `berlin-flea-markets`, regenerated `faq/inject.js`, widget `berlin-flea-market-picker/`, tools-hub entry, dedicated ChatGPT-browser icon source + 512/160 PNGs, icon manifests/upload cache, and helper scripts in the root content app. Inserted BerlinTools CMS item `e2650e90-dccf-4176-aae2-8b2b0188a1c9`, uploaded Wix icon `5a08a3_05dcee3f99224020bfef7a9d92f68043~mv2.png`, and patched BerlinTools Layout Fixes to revision `32`.

**QA:** Wix draft readback confirmed 3 embeds, 5 image nodes, all alt text, SEO/social/canonical/robots `index, follow, max-image-preview:large`, 5 SEO keywords, and BlogPosting JSON-LD. 5 Wikimedia/open-license article images selected with contact sheets viewed; no paid image-generation API and no AI article visuals. Local widget/QS/FAQ desktop + 390px QA overflow `0`; `node tools-hub/validate-data.mjs`, syntax checks, body leak validator, and `git diff --check` passed. Wix tool route returns 200.

**Opened:** Commit/push/deploy is still needed before GitHub Pages serves `berlin-flea-market-picker/`, Quick Summary, and FAQ for Wix preview/tool iframe; direct Pages widget URL currently returns 404.

**Closed:** Local widget/tool/blog package is complete and ready to push when approved.

## 2026-06-25 — Codex (daily featured/listing refresh)

**Did:** Günlük featured/listing refresh tamamlandı; Wix Blog API envanteri 138 postla yenilendi, Heatwave lead korundu, yeni BER Airport Departure Guide `/blog` rail ve homepage blog teaser'a eklendi, BER Airport Departure Planner `/berlin-tools` Start here alanına alındı. **Changed:** `scripts/generate-blog-index-data.mjs`, `blog-index/data.json`, `blog-home/data.json`, `tools-hub/data.json`; commit `18bb0dc` pushed to `origin/main`. Root Wix custom embed `BerlinWalk Blog Featured Posts` revision `12` olarak patch'lendi. **QA:** JSON parse, `node --check scripts/generate-blog-index-data.mjs`, root `node --check scripts/update-blog-feature-embed.mjs`, `node tools-hub/validate-data.mjs` (`64 tools, 62 visible`) ve `git diff --check` geçti. GitHub Pages deploy gecikmeden sonra `Last-Modified Thu, 25 Jun 2026 02:51:53/54 GMT` ile güncel data servis etti. Canlı Playwright QA: homepage BER mini post, `/blog` Heatwave + BER rail, `/berlin-tools` Start here `Transport Ticket`, `What's Open`, `First-Day`, `BER Airport Departure`, `Luggage`, `Lakes`, `/widgets` BER tool; horizontal overflow `0`. **Opened:** Bu run öncesinden kalan unrelated `.playwright-cli/console-*.log`, `SESSION_LOG.md` ve `worldcup-fixtures/index.html` kirli duruyor; refresh commit'ine dahil edilmedi. **Closed:** Discovery/listing yüzeyleri 2026-06-25 run'ı için canlıda güncel.

## 2026-06-25 — Codex (World Cup fixtures score update)

**Did:** Added final scores for the two score-check-due FIFA World Cup Group B matches in the 01:30 CEST automation run: Switzerland 2-1 Canada and Bosnia and Herzegovina 3-1 Qatar. **Changed:** `worldcup-fixtures/index.html` only: two `M` rows gained final-score fields and `SCORE_UPDATED` is now `25 Jun 2026, 01:36 CEST`. **QA:** Inline JS parse found 72 rows, 50 scored rows, and 0 malformed rows. Local Playwright QA at 1280px and 390px found `.bw-match.final = 50`, updated label visible, horizontal overflow `0`; only local favicon 404 console noise. `git diff --check` passed. **Opened:** Commit/push/deploy is still needed before GitHub Pages live widget updates. **Closed:** Due score updates are complete locally.

## 2026-06-24 — Codex (homepage Games compact gap fix)

**Did:** Fixed the live homepage gap below the Games teaser by compacting the `bw-berlin-battle-home` section and collapsing the Wix wrapper row. **Changed:** `berlin-battle-home/berlin-battle-home-element.js` now uses compact desktop title/card sizing, wrapper height/grid overrides for `comp-mqew6dkh`/`comp-mqew6lnt` plus generic `:has(bw-berlin-battle-home)` selectors, and cache marker `games-home-compact-20260624`; README snippets were updated. Commit `51f7f1a` was pushed to `origin/main`. A root Wix Head embed `BerlinWalk Homepage Games Compact Fix` rev `1` was also created to fix the live page immediately while Wix still loads the old `?v=20260615` script URL. **QA:** Local preview desktop section height `590px`, 3 cards, bad images `0`, overflow `0`; live desktop/mobile after scroll had Games/Blog gap `0`, bad images `0`, overflowX `0`; GitHub raw and Pages serve the new compact marker. **Opened:** Optional future Wix Editor cleanup: update the custom element script query from `?v=20260615` to `?v=games-home-compact-20260624`. **Closed:** The visible blank area between Games and Berlin Travel Notes is gone live.

## 2026-06-24 — Codex (World Cup git cleanup push)

**Did:** Cleaned the widget repo after the World Cup score automation by discarding unrelated Playwright console-log noise and keeping only the meaningful score update. **Changed:** `worldcup-fixtures/index.html` retains the three final scores and `SESSION_LOG.md` records the run/cleanup; `.playwright-cli/console-*.log` warning-only changes were restored and excluded. **QA:** `git diff --check` passed; inline JS parse confirmed 72 rows, 48 scored rows, `SCORE_UPDATED = 24 Jun 2026, 08:33 CEST`, and the three new FT score rows. **Opened:** None after push/deploy. **Closed:** Git working tree cleanup for this score update.

## 2026-06-24 — Codex (World Cup fixtures score update)

**Did:** Added final scores for the three score-check-due FIFA World Cup group matches in the 08:30 CEST automation run: England 0-0 Ghana, Panama 0-1 Croatia, Colombia 1-0 DR Congo. **Changed:** `worldcup-fixtures/index.html` only: three `M` rows gained final-score fields and `SCORE_UPDATED` is now `24 Jun 2026, 08:33 CEST`. **QA:** Inline JS parse found 72 rows, 48 scored rows, and 0 malformed rows. Local Playwright QA at 1280px and 390px found `.bw-match.final = 48`, updated label visible, horizontal overflow `0`, and console errors/warnings `0`; `git diff --check` passed. **Opened:** Commit/push/deploy is still needed before GitHub Pages live widget updates. **Closed:** Morning due score updates are complete locally.

## 2026-06-24 — Codex (BER post-publish blog index)

**Did:** Completed post-publish widget-repo follow-up after Yusuf published the BER Airport guide. **Changed:** `blog-index/data.json` regenerated from Wix Blog API with 138 posts; BER guide is Latest #1 and maps to related tool `berlin-ber-airport-departure-planner`. `scripts/generate-blog-index-data.mjs` now has a specific BER airport departure mapping before generic tip/transport fallbacks. Commit `5e19448` was pushed to `origin/main`; GitHub Pages deploy completed successfully. **QA:** Cache-busted Pages `blog-index/data.json` readback confirms totalPosts 138 and BER related tool mapping. Live Playwright mobile QA: `/blog` contains the BER post link with overflow 0, `/berlin-tools` contains the BER tool link with overflow 0, `/tools/berlin-ber-airport-departure-planner` has widget iframe and overflow 0, and the live post has 3 BER iframes plus Runway/Biometrics/security update/booking links with overflow 0. **Opened:** Search Console manual Request Indexing remains blocked by Google sign-in. **Closed:** Blog index and tool surfaces are refreshed for the live BER post.

## 2026-06-24 — Codex (BER draft correction push)

**Did:** Pushed Yusuf-requested BER draft correction changes to `origin/main`. **Changed:** Commit `beb4c06` (`Fix BER airport draft links and security details`) includes only the BER blog draft/body, Quick Summary, FAQ data, and repo session log; unrelated untracked Games files were left out. **QA:** GitHub Pages deploy for `beb4c06` completed successfully. Cache-busted Pages readback confirms `berlin-ber-airport-departure-planner/` returns HTTP 200 with Last-Modified `Wed, 24 Jun 2026 04:45:33 GMT`; Quick Summary data has CT/conventional lanes, BER Runway and BER Biometrics; FAQ data has CT/conventional lanes, BER Runway, BER Biometrics and USA/Israel second screening. **Opened:** Wix Blog draft remains unpublished and still needs final preview/publish approval. **Closed:** GitHub Pages blocker for BER widget/QS/FAQ assets is cleared.

## 2026-06-24 — Codex (BER draft link/security correction)

**Did:** Corrected the BER airport departure blog draft after Yusuf flagged missing internal/external links, incomplete security-lane research, and flat unstyled copy. **Changed:** `blog-drafts/berlin-ber-airport-departure-guide.md` and `.body.md` now include 8 BerlinWalk internal links, 8 official/high-quality external links, and stronger bold scan points. `quick-summary/data.json`, `faq/data.json`, and regenerated `faq/inject.js` now cover CT vs conventional security lanes, BER Runway discontinuation from 26 May 2026, optional BER Biometrics, and USA/Israel second screening. Root `BLOG_POST_PRODUCTION_STANDARD.md`/`PROJECT_MEMORY.md` were tightened; `berlinwalk-content-app/update-berlin-ber-airport-departure-guide-draft.mjs` patches the existing Wix draft in place. **QA:** Wix readback for draft `33cbef02-8f73-4d2e-b64c-ff8e46ffdd5a` remains `UNPUBLISHED`, with 3 embeds, 4 images, 24 bold decorations, placeholder leak `0`, and required phrase checks true. Body validator, JSON parse, `node --check`, `tools-hub/validate-data.mjs`, voice/duration scan, and `git -C berlinwalk-widgets diff --check` passed. **Opened:** Commit/push/deploy is still needed before the new widget/QS/FAQ assets resolve from GitHub Pages. **Closed:** Draft content-rule violation is corrected without publishing.

## 2026-06-24 — Codex (Games dropdown nested-menu fix)

**Did:** Fixed the live Games dropdown regression where the dropdown menu contained a second nested Games menu/button. **Changed:** Root `scripts/upsert-games-nav-footer-embed.mjs` now skips native Games dropdowns, only patches old top-level single-link headers, and repairs any previously nested desktop/mobile Games patch nodes. Wix custom embed `BerlinWalk Games Nav Footer Patch` (`a41c00c9-4f72-44a7-a366-69fdeb2349f8`) was updated to revision `5`. **QA:** `node --check` passed; Wix API readback confirmed `rev 5` enabled; live Playwright QA on `https://www.berlinwalk.com/` confirmed the visible desktop Games dropdown has `0` buttons inside the menu, exactly `All Games`, `Berlin Battle`, `Berghain Bouncer`, `Berlin Smile Challenge`, no nested desktop patch nodes, and no mobile Games patch boxes. **Opened:** None. **Closed:** Games dropdown no longer renders menu-inside-menu.

## 2026-06-24 — Codex (homepage Games section redesign)

**Did:** Updated the homepage `bw-berlin-battle-home` source from a Berlin Battle-only teaser into a general BerlinWalk Games section for the three live games. **Changed:** `berlin-battle-home/berlin-battle-home-element.js` keeps the legacy element tag for Wix compatibility but now renders `Play Berlin before you walk it.`, a `/games` CTA, booking CTA, and cards for Berlin Battle, Berghain Bouncer, and Berlin Smile Challenge with real social/cover art; cache-buster is `games-home-three-games-20260624`. README snippets and preview title were updated, plus root `PROJECT_MEMORY.md`/`SESSION_LOG.md`. **QA:** `node --check`, scoped `git diff --check`, and local Playwright desktop 1440 + mobile 390 passed with 3 cards, bad image `0`, overflowX `0`, and old single-game copy absent. Screenshots saved under `output/playwright/games-home-three-games-*.png`. **Opened:** Push/deploy and live Wix homepage QA still needed. **Closed:** Local source no longer presents the homepage section as one Berlin Battle game.

## 2026-06-24 — Codex (daily featured/listing refresh)

**Did:** Refreshed the blog listing data and homepage blog teaser so the newly live Grocery guide is surfaced while Heatwave stays the timely lead. **Changed:** `scripts/generate-blog-index-data.mjs` now includes `grocery-shopping-in-berlin` in curated rail/shelf protection; `blog-index/data.json` was regenerated from Wix Blog API with `137` posts and rail `Alternative Transport`, `Grocery`, `Pharmacy`, `Night Transport`, `World Cup`; `blog-home/data.json` mini posts now start with `Grocery Shopping in Berlin`. Wix custom embed `BerlinWalk Blog Featured Posts` was patched externally to revision `11`. Tool listing data was intentionally unchanged. **QA:** JSON parse passed for listing files, `node --check scripts/generate-blog-index-data.mjs`, `node tools-hub/validate-data.mjs` (`63 tools / 61 visible`), and `git diff --check` passed. Commit `4faf187` was pushed to `origin/main`; GitHub Pages served new data with `Last-Modified: Wed, 24 Jun 2026 02:07:21 GMT`. Live Playwright DOM QA passed for homepage, `/blog`, `/berlin-tools`, and `/widgets`; expected titles were present and horizontal overflow was `0`. **Opened:** None. **Closed:** Blog discovery selections are current for the 2026-06-24 run; `/berlin-tools` Start here remains unchanged.

## 2026-06-23 — Codex (Smile Challenge desktop share QA)

**Did:** Re-tested Smile Challenge desktop answer/share flow after Yusuf reported desktop share cancellation and sticky selected-answer styling. **Changed:** `berlin-smile-challenge/index.html` now marks scene visuals as `pointer-events: none` after Playwright caught image layers intercepting option clicks; desktop copy feedback is shown immediately on the share button and toast. Build marker is `smile-desktop-share-instant-feedback-20260623`. **QA:** Local Playwright desktop run completed all 7 rounds. First answer rendered `className: bw-selected-answer`, `hasBadSelectedNode:false`, scroll stayed `0/0`, result screen had no `Share cancelled`, and desktop share showed `Link copied` on both toast and button. **Closed:** Desktop share/click/selected-answer regression is locally verified and pushed.

## 2026-06-23 — Codex (Games section separation polish)

**Did:** Strengthened the visual break between the `/games` hero and mode section, and made card row alignment more durable. **Changed:** `games-page/games-page-element.js` now uses marker `games-page-retro-v2-20260623`; the hero reads as a brighter yellow arcade poster, while the mode section starts as an overlapping white shelf with a light grid background. Game cards now stretch equally, with controlled lead/meta/how/button row behavior for future cards. **QA:** Not run; this turn did not request extra verification. **Opened:** Browser visual pass, then Wix `/games` installation plus header/footer publishing. **Closed:** Hero/mode separation now comes from depth and surface change, not only border lines.

## 2026-06-23 — Codex (Games hub live Wix install)

**Did:** Installed the `/games` hub on the live Wix page with SEO/social image, Games dropdown, and footer Play links. **Changed:** `games-page/games-page-element.js` keeps the card row/section separation polish and adds a Wix Media-safe asset base guard. Added `games-page/assets/social/berlinwalk-games-social-1200x630.jpg`. Added `scripts/upsert-games-page-wix-embed.mjs` for the inline live `bw-games-page` embed and `scripts/upsert-games-nav-footer-embed.mjs` for the live Games nav/footer patch. Wix embeds: games hub `34cdf9b0-5eac-4d47-b5fe-a431e47bdab5` rev `3`, nav/footer `a41c00c9-4f72-44a7-a366-69fdeb2349f8` rev `2`; featured image `5a08a3_e2e905ff6b1846609bbcc8a06b2de6dc~mv2.jpg`. Repo-source header/footer now also point toward `/games`, Games dropdown, and footer `All Games`. **QA:** Wix publish returned `200`; raw live `/games` includes both custom embeds, inline custom element, SEO text, featured image id, rev3 games remount guard, and nav retry guard. Playwright live QA confirmed the page title, rendered `/games` hub/cards, desktop Games dropdown with `All Games` + 3 games, mobile Games section, and footer `All Games` + 3 games; later wrapper commands hung, so persistence fix was confirmed via raw rev3 guard readback. **Closed:** Live `/games` installation and navigation/footer updates are complete.

## 2026-06-23 — Codex (Games hero simplification)

**Did:** Simplified the selected `/games` hero after Yusuf rejected the game-image collage and unnecessary hero CTAs. **Changed:** `games-page/games-page-element.js` removes the hero game-image collage and both hero buttons, leaving a bright retro pattern/typography hero while game images only appear in the cards. **QA:** `node --check` passed. **Closed:** Hero now separates from the card section without repeating the game art.

## 2026-06-23 — Codex (Games hub light retro adjustment)

**Did:** Lightened the selected `/games` retro design after Yusuf found the hero and first mode section too dark. **Changed:** `games-page/games-page-element.js` now uses a bright retro grid/poster hero instead of a dark full-photo hero; game images sit as a right-side poster collage, and the dark green band behind the mode section was removed. **QA:** `node --check` passed and no `Play first. Walk it after.` residue remains. **Closed:** Main `/games` prototype is now in the lighter retro direction.

## 2026-06-23 — Codex (Games hub retro pass)

**Did:** Applied a retro gaming / arcade visual pass to the selected Spotlight Grid `/games` prototype. **Changed:** `games-page/games-page-element.js` now uses scanline/grid textures, hard yellow/cyan shadows, square cards/buttons, and dark arcade-screen framing while preserving the preferred layout. The `Play first. Walk it after.` section was removed completely. Root `PROJECT_MEMORY.md` records the updated direction. **QA:** Not run yet. **Opened:** Browser review for retro intensity and mobile/desktop polish. **Closed:** First layout now has the requested retro gaming design direction.

## 2026-06-23 — Codex (Games hub Spotlight cleanup)

**Did:** Cleaned up the selected Spotlight Grid `/games` prototype based on Yusuf's review. **Changed:** `games-page/games-page-element.js` now removes the hero facts strip and bottom FAQ, forces dark text on yellow buttons, removes `3`-focused public copy, and changes card metadata to `Play time / Game type / Vibe` with sub-1-minute timing. Updated `games-page/README.md`, `games-page/SEO_SETTINGS.md`, root `PROJECT_MEMORY.md`, and widget `AGENTS.md`. **QA:** Not run yet. **Opened:** Visual browser review and final polish before Wix `/games` installation. **Closed:** Main Spotlight prototype reflects Yusuf's first review.

## 2026-06-23 — Codex (Games hub second design draft)

**Did:** Added the second `/games` design prototype as a Hub + Panel Custom Element. **Changed:** Added `games-page/games-hub-modal-element.js` and `games-page/hub-modal.html`; updated `games-page/README.md`, root `PROJECT_MEMORY.md`, and widget `AGENTS.md` so the two local preview directions are documented separately. **QA:** Not run yet. **Opened:** Yusuf should compare Spotlight Grid vs Hub + Panel before Wix installation and header/footer link updates. **Closed:** Second local games hub design is ready for iteration.

## 2026-06-23 — Codex (Smile Challenge scroll/social QA)

**Did:** Finished Yusuf's three Smile Challenge follow-ups: answer/next transitions no longer move the page, native Wix Social Share uses the dedicated Smile featured image, and mobile answer states no longer cut off at the bottom. **Changed:** `berlin-smile-challenge/index.html` now sends `bw-smile-preserve-scroll` before answer/next state changes; `berlin-smile-challenge-page/berlin-smile-challenge-page-element.js` restores parent scroll, disables scroll anchoring, and raises the framed iframe cap to `1540px`. Added/pushed social image asset `berlin-smile-challenge/assets/social/berlin-smile-challenge-social-1200x630.jpg`; Wix Media ID is `5a08a3_0345dbe6993e4bc4b24f2905eeba933f~mv2.jpg`. Commits `b1f9eb2` and `96d04cd` were pushed. **QA:** `node --check`, inline script parse, and scoped `git diff --check` passed. GitHub Pages serves `smile-scroll-lock-20260623`. Live raw HTML shows `og:image` and `twitter:image` on the new Wix media image. Live 390px coordinate-click QA: `deltaAnswer:0`, `deltaNext:0`, iframe `viewportHeight:1540`, console errors `0`. **Opened:** None. **Closed:** Smile Challenge scroll jump, social preview, and mobile bottom-cut issues are live-fixed.

## 2026-06-23 — Codex (What-to-wear live leak fix)

**Did:** Fixed the live `what-to-wear-to-berlin-clubs` post after an internal `Sources to Recheck Before Publishing` checklist leaked into the published body. **Changed:** Updated `blog-drafts/what-to-wear-to-berlin-clubs.md` and `.body.md` so the game section is now `## Play the Berghain Bouncer Game` with the UTM game link, and removed the internal source-check section from the full local draft. The live Wix post `f4eec937-98fe-4746-87ef-6221b9a3909b` was patched/published from the clean body. Root added `scripts/validate-blog-publish-body.mjs` plus publish-body hard-gate documentation in `BLOG_POST_PRODUCTION_STANDARD.md` and `PROJECT_MEMORY.md`. **QA:** Validator passed for `.body.md`; Wix API readback shows `hasUnpublishedChanges:false`, no source leak phrases, CTA/link present, 3 HTML embeds, 242 nodes; Playwright live text QA confirmed CTA present and source-check heading absent. **Opened:** None. **Closed:** Live post leak fixed and future publish-body gate documented.

## 2026-06-23 — Codex (Games hub custom element draft)

**Did:** Built the first local `/games` hub Custom Element draft using the Spotlight Grid direction. **Changed:** Added `games-page/games-page-element.js`, `games-page/index.html`, `games-page/README.md`, and `games-page/SEO_SETTINGS.md`; documented the package in root `PROJECT_MEMORY.md` and widget `AGENTS.md`. The element uses existing Berlin Battle, Berghain Bouncer, and Berlin Smile Challenge social art, includes 3 mode cards, a tour bridge, status board without fake counters, FAQ, and mobile choose-game bar. **QA:** Not run yet. **Opened:** Create/publish the Wix `/games` page, install `<bw-games-page>`, then update header/footer links after the page exists. **Closed:** Local custom element draft is ready for iteration.

## 2026-06-23 — Codex (What-to-wear draft CTA)

**Did:** Added `Berghain Bouncer` game announcement section to the `what-to-wear-to-berlin-clubs` draft files.

**Changed:** `blog-drafts/what-to-wear-to-berlin-clubs.md` and `blog-drafts/what-to-wear-to-berlin-clubs.body.md` now include `## Bonus: Can You Pass the Door?` with link `https://www.berlinwalk.com/games/berghain-bouncer?utm_source=blog&utm_medium=article&utm_campaign=what_to_wear_to_berlin_clubs&utm_content=inline_cta`.

**Opened:** Live Wix publish not run.
**Closed:** Draft copy now includes game CTA.

## 2026-06-23 — Codex (Berghain Bouncer mobile share)

**Did:** Split Berghain Bouncer result sharing so mobile/touch devices use the native share sheet while desktop keeps the copy fallback. **Changed:** `berlin-bouncer/index.html` now gates `navigator.share` behind `shouldUseNativeShare()` and tracks the actual chosen action; `berlin-bouncer-page/berlin-bouncer-page-element.js` uses marker `bouncer-mobile-share-20260623` and adds iframe `allow="... web-share ..."`, and legacy `berlin-bouncer/berlin-bouncer-element.js` got the same `web-share` permission plus cache-busted iframe URL. **QA:** `node --check` passed for wrapper/legacy elements, inline bouncer scripts parsed, scoped `git diff --check` passed. Local Playwright smoke: desktop 1280px with stubbed native share still copied (`shareCalls=0`, `copyCalls=1`); mobile 390px fresh reload used native share (`shareCalls=1`, `copyCalls=0`, no copy toast). **Opened:** Not committed/pushed or live-QA'd yet. **Closed:** Mobile share / desktop copy behavior is locally verified.

## 2026-06-23 — Codex (Berlin Smile Challenge phone hero cover)

**Did:** Replaced the duplicate landing-copy start screen inside the `/games/berlin-smile-challenge` phone mockup with a dedicated game hero/cover image. **Changed:** Added `berlin-smile-challenge/assets/hero/berlin-smile-challenge-hero.webp` plus source PNG under `assets/source/hero-chatgpt-20260623/`, changed the start screen to show the cover image with compact `Berlin social weather` / `Make the almost-smile happen.` copy, and bumped the wrapper/game marker to `smile-hero-cover-20260623`. Commit `f421b83` was pushed to `origin/main`. **QA:** GitHub Pages served wrapper/game/hero assets with the new marker. Live Wix desktop and 390px mobile QA confirmed hero natural size `960x600`, phone `Can You Make` duplicate count `0`, start buttons visible, page/iframe overflowX `0`, console error `0`; `Start quietly` still opens the first scene with scene image `960x600`, figure margin `0px 0px 2px`, and 3 options. **Opened:** None. **Closed:** Smile Challenge phone start screen now uses a real game-cover visual instead of repeating the outer page.

## 2026-06-23 — Codex (Berghain Bouncer Story crop)

**Did:** Created a 9:16 Instagram Story crop from the Berghain Bouncer social/featured image. **Changed:** Added `berlin-bouncer/assets/social/berlin-bouncer-story-1080x1920.jpg`; candidate crops/contact sheet were kept outside the widget repo under root `output/social-crops/berghain-bouncer-story-20260623/`. **QA:** Verified the output as a `1080x1920` progressive JPEG and visually checked that the bouncer remains the main subject with the red door light still visible. **Opened:** Not committed/pushed or uploaded to social. **Closed:** Story reference/background crop is ready.

## 2026-06-23 — Codex (Berghain Bouncer social image)

**Did:** Generated and wired the native Wix Social Share / featured image for `/games/berghain-bouncer`.

**Changed:** Added the ChatGPT/Codex source prompt and generated source image under `berlin-bouncer/assets/source/`, the optimized `1200x630` JPEG under `berlin-bouncer/assets/social/`, and `berlin-bouncer-page/SEO_SETTINGS.md`. The image was uploaded to Wix Media as `5a08a3_830a8d37e8034d8392ba48d8066adffa~mv2.jpg`, selected in Wix Studio's native Social Share panel, and published as site revision `601`. The temporary `BerlinWalk Berghain Bouncer SEO` custom embed was disabled at revision `2`; final social image delivery is native Wix, not a runtime head embed.

**QA:** Wix Studio preview showed the new bouncer image. Live raw HTML readback confirmed `og:image` and `twitter:image` both point to the new `/v1/fill/w_1200,h_630,al_c/` Wix Media URL, the old Alexanderplatz social image is absent from social tags, and the temporary SEO guard embed is absent. Wix Media image returned HTTP 200.

**Opened:** None.
**Closed:** Berghain Bouncer social/featured image is live.

## 2026-06-23 — Codex (Berlin Battle game focus)

**Did:** Fixed the `/games/berlin-battle` UX where choosing a battle after scrolling down the tall topic list could leave the actual game screen above the viewport.

**Changed:** `berlin-battle/index.html` now posts a `bw-battle-focus-game` message to the parent after user-started topic selection and restart. `berlin-battle-page/berlin-battle-page-element.js` listens for that message and scrolls the framed game device back into the viewport after the iframe height settles. The cache marker/snippet is now `battle-game-focus-20260623`. Commit `150b907` was pushed to `origin/main`. Unrelated dirty `SESSION_LOG.md` / `worldcup-fixtures/index.html` changes were left unstaged.

**QA:** `node --check`, inline script parse, and scoped `git diff --check` passed. Local desktop scroll/click QA passed with device `top=58`, `bottom=649`, iframe `508px`, title `Döner Shops Battle`, overflowX `0`; local 390px passed with device `top=150`, `bottom=694`, overflowX `0`. GitHub Pages served the marker on attempt 19. Live Wix desktop passed from deliberate `deviceTop=-319` to post-click `top=64`, `bottom=655`, iframe `508px`, overflowX `0`; live 390px passed from deliberate `deviceTop=-551` to post-click `top=157`, `bottom=687`, iframe `440px`, overflowX `0`.

**Opened:** None.
**Closed:** Berlin Battle topic selection now focuses the game screen on the live page.

## 2026-06-23 — Codex (World Cup fixtures morning scores)

**Did:** World Cup fixtures widget için Berlin saati 08:32 skor kontrolünde 3 yeni final skor eklendi: France 3-0 Iraq, Norway 3-2 Senegal, Jordan 1-2 Algeria. **Changed:** `worldcup-fixtures/index.html` içindeki due `M` satırları 8 alanlı `FT` satırlara çevrildi; `SCORE_UPDATED` `23 Jun 2026, 08:32 CEST` yapıldı. Başka fixture zamanı, takım adı, filtre, stil, Wix, CMS, canlı site, reklam, booking veya root `PROJECT_MEMORY.md` değişmedi. **QA:** Due gate France-Iraq, Norway-Senegal ve Jordan-Algeria maçlarını buldu. FIFA match report sayfaları ile ESPN/Guardian kaynakları skorlarla tutarlıydı. Inline JS parse smoke 72 maç / 44 skorlu satır / malformed `0` geçti; Playwright desktop ve 390px mobilde `.bw-match.final` = 44, horizontal overflow `0`, updated etiketi görünür, console issue `0`; `git -C berlinwalk-widgets diff --check` temiz. **Opened:** Live GitHub Pages için push/deploy gerekiyor. **Closed:** 23 Haziran sabah skor kontrolü yerel widget kaynak dosyasında güncel.

## 2026-06-23 — Codex (Grocery map widget upgrade)

**Did:** Upgraded the grocery draft's post-specific widget from a decision-only picker into `Berlin Grocery Store Map & Picker` after Yusuf suggested a citywide supermarket map.

**Changed:** `berlin-grocery-store-picker/index.html` now uses Leaflet + MarkerCluster with OpenStreetMap/Overpass grocery data, filters for supermarkets, discount, bio, drugstores, and Späti/small shops, a backup Overpass endpoint, and fallback search anchors. `blog-drafts/grocery-shopping-in-berlin.md` and `tools-hub/pending-berlin-grocery-store-picker.md` were updated to describe the map + picker version and `embedHeight=2800`. Commits `96fa4a1` and `a57afd8` were pushed to `origin/main`; raw GitHub and GitHub Pages both serve the new widget.

**QA:** Inline widget script parse and scoped `git diff --check` passed. Local Playwright QA at 390px passed: `All` filter showed `900 of 2831 grocery points from OpenStreetMap`, 10 clusters, 24 list items, root height `2674`, overflowX `0`, hard console errors `0`. An earlier Overpass 504 test fell back without breaking the widget. Wix draft `7e211da5-6c04-466a-bc18-b4c870360f7d` was patched separately and remains `UNPUBLISHED` with 3 embeds at `?v=20260623b`.

**Opened:** BerlinTools CMS/tool card remains blocked until the dedicated glossy icon exists; no placeholder tool was created.
**Closed:** Grocery widget source upgrade is committed and pushed.

## 2026-06-23 — Codex (Berlin Battle CTA spacing)

**Did:** Tightened the default `/games/berlin-battle` landing layout so the walking-tour CTA no longer drops far below the feature list while the opening game list is tall.

**Changed:** `berlin-battle-page/berlin-battle-page-element.js` now uses `ASSET_BUILD=battle-list-tight-20260623`, starts the desktop layout/device at the top, and fixes the desktop grid rows to `auto minmax(0, 1fr)` so the first row stays content-height and the CTA starts after the normal grid gap. Mobile/direct layouts keep three auto rows. `berlin-battle-page/README.md` was bumped to the same snippet marker. Commit `7db3757` was pushed to `origin/main`. Unrelated dirty grocery/worldcup files were left untouched.

**QA:** `node --check`, scoped `git diff --check`, and GitHub Pages marker wait passed. Live Wix desktop QA passed: current marker, overflowX `0`, feature-list-to-CTA gap `36px`, grid rows `467.281px 639.906px`. Live 390px mobile QA passed: current marker, overflowX `0`, device-to-CTA gap `34px`.

**Opened:** None.
**Closed:** Default Berlin Battle page CTA spacing is pushed, deployed, and live-verified.

## 2026-06-23 — Codex (Berlin Battle list polish)

**Did:** Applied Yusuf's two follow-ups for the redesigned `/games/berlin-battle` page: removed the outer `Play now` button and changed the in-game topic picker from a card grid to a compact list.

**Changed:** `berlin-battle-page/berlin-battle-page-element.js` now uses `ASSET_BUILD=battle-list-page-20260623` and no longer renders `heroAction` / `Play now`. `berlin-battle/index.html` now presents topic choices as one-column rows with thumbnail, kicker/title/short lead, and a CSS chevron; mobile rows compress to about 80px. The game default build marker and `berlin-battle-page/README.md` snippet were bumped to `battle-list-page-20260623`. Commit `7dae26f` was pushed to `origin/main`. Existing unrelated dirty files `berlin-grocery-store-picker/index.html` and `worldcup-fixtures/index.html` were left untouched and unstaged.

**QA:** Wrapper `node --check`, inline game script parse, and scoped `git diff --check` passed. Local desktop and 390px QA: marker current, parent `Play now` absent, 10 topics render as a single list column, iframe height matches inner scrollHeight `1060`, overflowX `0`; direct `topic=food` still opens `Berlin Food Battle` with 2 choices. GitHub Pages served the new marker on attempt 14. Live Wix desktop/mobile QA passed: marker current, no `Play now`, overflowX `0`. Direct GitHub iframe QA passed: 10 single-column list rows, desktop first row `94px`, mobile first row `80px`, overflowX `0`; direct Food still shows `Berlin Food Battle`, 2 choices, overflowX `0`.

**Opened:** None.
**Closed:** Berlin Battle button/list polish is pushed, deployed, and live-verified.

## 2026-06-23 — Codex (daily featured/listing refresh)

**Did:** Refreshed the blog listing data and homepage blog teaser so the newly published Pharmacy guide is surfaced while Heatwave stays the current lead.

**Changed:** `scripts/generate-blog-index-data.mjs` now includes `pharmacy-in-berlin` in the curated `/blog` rail and protected required slugs. `blog-index/data.json` was regenerated from Wix Blog API with 136 posts; hero lead remains Heatwave, rail is Alternative Transport, Pharmacy, Night Transport, World Cup, and Public Transport. `blog-home/data.json` now uses Pharmacy as the first mini post instead of Unter den Linden. Wix custom embed `BerlinWalk Blog Featured Posts` was patched from revision `9` to `10` outside this repo. Tool listing data was intentionally unchanged.

**QA:** JSON parse passed for blog/tool listing data, `node --check scripts/generate-blog-index-data.mjs` passed, `node tools-hub/validate-data.mjs` passed with 63 tools / 61 visible, and `git diff --check` passed. Commit `3290e49` was pushed to `origin/main`; GitHub Pages served the new `blog-index/data.json` with `Last-Modified: Tue, 23 Jun 2026 02:07:39 GMT`. Live Playwright DOM QA passed for homepage, `/blog`, `/berlin-tools`, and `/widgets`; all expected blog/tool titles were present and horizontal overflow was `0`.

**Opened:** None.
**Closed:** Featured/listing selections are live-current for the 2026-06-23 run.

## 2026-06-23 — Codex (Berlin Battle page redesign)

**Did:** Redesigned the dedicated `/games/berlin-battle` wrapper so it follows the new bouncer-page landing structure without copying the bouncer theme.

**Changed:** `berlin-battle-page/berlin-battle-page-element.js` now uses `ASSET_BUILD=card-duel-page-20260623`, loads Fraunces + Space Grotesk, and renders a cream/coral/deep-ink card-duel page with a large left intro, framed game device on the right, feature bullets, and a walking-tour CTA. `?topic=<id>` direct links keep the compact generic `Pick your Berlin winner` intro and still forward topic/UTM params into the iframe. The wrapper now sets iframe `src` after installing the resize listener and keeps child `bw-resize` heights from being overwritten by the 620px fallback. `berlin-battle-page/index.html` preview background and the README Wix snippet were bumped to the same marker. Commit `cf3fd00` was pushed to `origin/main`.

**QA:** `node --check` and `git diff --check` passed. Local desktop and 390px Playwright QA passed: marker/font/theme current, parent overflowX `0`, iframe height matches inner content instead of clipping the 10-topic grid, and direct `topic=food` starts `Berlin Food Battle` with 2 choices. GitHub Pages served `card-duel-page-20260623` on attempt 13. Live Wix desktop QA passed: element present, `Space Grotesk`, cream background, iframe marker current, element height `1349`, overflowX `0`. Live Wix mobile QA passed: marker current, element height `2129`, overflowX `0`. Live direct Food parent QA confirmed topic forwarding; direct GitHub iframe QA confirmed `Berlin Food Battle`, `2` choices, overflowX `0`. Console had only Wix preload warnings, no widget errors.

**Opened:** None.
**Closed:** Berlin Battle page redesign is pushed, deployed, and live-verified.

## 2026-06-23 — Codex (Berghain bouncer footer air tweak)

**Did:** Added a little more black breathing room before the footer on `/games/berghain-bouncer` after the prior 800px desktop shell setting felt too tight.

**Changed:** `berlin-bouncer-page/berlin-bouncer-page-element.js` now uses `ASSET_BUILD=bouncer-layout-air-20260623`, and the desktop Wix shell sync target changed from `800px` to `850px`. The top `Playable Now` padding was left unchanged, and the mobile override still clears the fixed shell height. Commit `5996160` was pushed to `origin/main`.

**QA:** `node --check` and `git diff --check` passed. Local desktop marker was `v=bouncer-layout-air-20260623`, `Playable Now` stayed 50px below host top, overflowX `0`. GitHub Pages served the new marker on attempt 16. Live Wix desktop QA: host `850px`, iframe marker current, CTA bottom space `108px` (previous 800px setting was `58px`, old 912px setting was `191px`), device bottom space `174px`, footer gap `-6`, overflowX `0`; footer-transition screenshot looked balanced. Live mobile QA: marker current, shell height stays in the native mobile flow, `topToEyebrow=48`, footer gap `-1`, overflowX `0`.

**Opened:** None.
**Closed:** Public Berghain bouncer footer spacing now sits between the too-tight and too-loose versions.

## 2026-06-22 — Codex (Berghain bouncer spacing balance)

**Did:** Rebalanced the live `/games/berghain-bouncer` page so the `Playable Now` block has more top breathing room and the black space before the footer is shorter on desktop.

**Changed:** `berlin-bouncer-page/berlin-bouncer-page-element.js` now uses `ASSET_BUILD=bouncer-layout-balance-20260622`. Desktop layout padding is `clamp(48px, 7svh, 56px) 20px 20px`, and the component syncs its Wix desktop shell height to `800px` on mount/resize while clearing that override below 961px. Commit `5a90681` was pushed to `origin/main`.

**QA:** `node --check` and `git diff --check` passed. Local desktop QA: `Playable Now` is 50px below host top, device bottom space is 86px, CTA bottom space is 20px, overflowX `0`. Local 390px mobile QA: top padding 48px, device height 620px, overflowX `0`. GitHub Pages served the new marker on attempt 16. Live Wix desktop QA: iframe `v=bouncer-layout-balance-20260622`, host height reduced from 912px to 800px, `Playable Now` is 50px below host top, device bottom space reduced from 257px to 124px, footer gap `-6`, overflowX `0`; top and footer-transition screenshots looked clean. Live mobile QA: marker current, desktop shell override disabled, top spacing 48px, footer gap `-1`, overflowX `0`.

**Opened:** None.
**Closed:** Public Berghain bouncer hero/footer spacing balance is live-verified.

## 2026-06-22 — Codex (Berghain bouncer footer bridge)

**Did:** Closed the white gap that could appear between the `/games/berghain-bouncer` custom element and the site footer in the Atlas/Wix live render.

**Changed:** `berlin-bouncer-page/berlin-bouncer-page-element.js` now uses `ASSET_BUILD=bouncer-footer-bridge-20260622`. The bouncer page host paints a 96px black bridge below itself with `box-shadow`, keeps overflow visible, and preserves the page content above it with z-index layering. Commit `f7db1b4` was pushed to `origin/main`.

**QA:** `node --check` and `git diff --check` passed. Local wrapper QA confirmed iframe `v=bouncer-footer-bridge-20260622`, black host background, active 96px black `boxShadow`, no extra pseudo-element bridge, scrollHeight unchanged, and overflowX `0`. GitHub Pages served the new marker on attempt 19. Live Wix QA passed: iframe marker is current, host `boxShadow` is active, footer and bouncer host measure `visualGap=0`, overflowX `0`, and the screenshot shows the black section meeting the footer accent/green footer with no white band.

**Opened:** None.
**Closed:** Public Berghain bouncer footer gap is fixed live.

## 2026-06-22 — Codex (World Cup fixtures late score)

**Did:** World Cup fixtures widget için Berlin saati 23:31 skor kontrolünde 1 yeni final skor eklendi: Argentina 2-0 Austria. **Changed:** `worldcup-fixtures/index.html` içindeki Argentina-Austria due `M` satırı 8 alanlı `FT` satıra çevrildi; `SCORE_UPDATED` `22 Jun 2026, 23:31 CEST` yapıldı. Başka fixture zamanı, takım adı, filtre, stil, Wix, CMS, canlı site, reklam, booking veya root `PROJECT_MEMORY.md` değişmedi. **QA:** Due gate yalnız Argentina-Austria maçını buldu. FIFA match report, ESPN final-score sayfası ve Guardian match report skoru 2-0 FT olarak tutarlı destekledi. Inline JS parse smoke 72 maç / 41 skorlu satır / malformed `0` geçti; Playwright desktop ve 390px mobilde `.bw-match.final` = 41, horizontal overflow `0`, updated etiketi görünür; sadece lokal favicon 404 console noise; `git -C berlinwalk-widgets diff --check` temiz. **Opened:** Live GitHub Pages için push/deploy gerekiyor. **Closed:** 22 Haziran geç skor kontrolü yerel widget kaynak dosyasında güncel.

## 2026-06-22 — Codex (Berghain bouncer share + timer polish)

**Did:** Removed the desktop browser `alert()` after Share Result, replaced it with in-game copy feedback, increased bouncer-question timer from 5s to 10s, and moved the countdown from the center to a clearer top-left badge.

**Changed:** `berlin-bouncer/index.html` now copies share text silently via Clipboard API/text-area fallback, flashes the share button to `Copied`, and shows `share-toast` instead of a blocking browser alert. Share URL now uses `parent_url` or `https://www.berlinwalk.com/games/berghain-bouncer` rather than the GitHub iframe URL. Timed door questions now call `startTimer(10000)`, and the countdown badge shows `SECONDS`. `berlin-bouncer-page/berlin-bouncer-page-element.js` uses `ASSET_BUILD=bouncer-share-timer-20260622` and the wrapper copy says `10-second pressure cooker`. Commit `66e73a7` was pushed to `origin/main`.

**QA:** Inline game JS parse, wrapper `node --check`, and `git diff --check` passed. Local 390px game QA: countdown `10`, top-left `14/14`, share button `COPIED`, toast `Result copied. Paste it anywhere.`, `alertCalled=false`, overflowX `0`. Local wrapper QA: iframe `v=bouncer-share-timer-20260622`, `10-second` lead, overflowX `0`. GitHub Pages served the new marker on attempt 15. Live Wix desktop QA: iframe `v=bouncer-share-timer-20260622`, lead `10-second`, overflowX `0`. Live GitHub iframe QA: countdown `10`, top-left badge with `SECONDS`, result stats loaded, Share Result produced `COPIED` + toast, `alertCalled=false`, overflowX `0`. QA rows were deleted from `BerlinBouncerEvents`; remaining `0`.

**Opened:** None.
**Closed:** Share popup and timer polish are pushed, deployed, and live-verified.

## 2026-06-22 — Codex (Berghain bouncer live stats)

**Did:** Added mobile breathing room above the first `Playable Now` block and wired the Berghain bouncer result screen to live Wix CMS stats instead of mock totals.

**Changed:** `berlin-bouncer-page/berlin-bouncer-page-element.js` now uses `ASSET_BUILD=bouncer-stats-mobile-air-20260622` and gives the mobile page layout `48px` top padding. `berlin-bouncer/index.html` now sends `bw_berlin_bouncer_start`, `bw_berlin_bouncer_result`, and `bw_berlin_bouncer_share` events to `https://berlinwalk-content-app.vercel.app/api/bouncer-event`; result events request live same-day stats and render rejected/total/top-rate copy on the final screen. Root `berlinwalk-content-app` endpoint/rewrite, `BerlinBouncerEvents` setup script, root `PROJECT_MEMORY.md`, and root `SESSION_LOG.md` were updated outside this repo. Commit `363a497` was pushed to `origin/main`.

**QA:** `node --check` passed for the root endpoint/server/setup files, the bouncer inline script parse passed, and `git diff --check` passed. Local endpoint smoke returned stats, local mobile game flow showed live stats on the result screen, Vercel production endpoint returned `200` with CORS for the GitHub Pages iframe origin and stats payload, and all Codex smoke rows were deleted from `BerlinBouncerEvents`. GitHub Pages served the new marker on attempt 15. Live Wix 390px QA passed: `Playable Now` starts `48px` below the host top, layout padding is `48px`, iframe URL has `v=bouncer-stats-mobile-air-20260622`, and overflowX is `0`. Direct live game QA at 390px reached the result screen and showed `Today: 1 rejected out of 1. You are part of the 100.0%.`.

**Opened:** None.
**Closed:** Mobile spacing and live result stats are pushed, deployed, and live-verified.

## 2026-06-22 — Codex (Berghain bouncer page height fix)

**Did:** Fixed and shipped `/games/berghain-bouncer` so the right-side game iframe no longer expands to 1500px+ through the sitewide Wix auto-resize listener. **Changed:** `js/brand.js` now supports `resize=none` / `autoresize=none`; `berlin-bouncer-page/berlin-bouncer-page-element.js` sends the nested game iframe with `resize=none`, uses `ASSET_BUILD=bouncer-height-fix-20260622`, and clamps the device height to `560-680px` desktop / `500-620px` mobile. Commit `9ab8af8` and this log commit were pushed. **QA:** Before fix, live desktop measurement showed `.bw-bouncer-device` `1528px` high and wrapper `1608px`; local desktop now shows device/iframe `420x560`, overflowX `0`, iframe URL includes `resize=none`; local 390px mobile shows device/iframe `350x620`, first game screen has 4 options visible and iframe overflowX `0`; reload/message test saw `0` `bw-resize` messages. GitHub Pages served the new marker on attempt 15. Live Wix QA passed: desktop 1280x768 device/iframe `420x598`, iframe URL `resize=none&v=bouncer-height-fix-20260622`, overflowX `0`; mobile 390x844 device/iframe `350x620`, overflowX `0`. `node --check` and `git diff --check` passed. **Opened:** None. **Closed:** Public Berghain bouncer page height issue is fixed live.

## 2026-06-22: Added visual countdown text
- Overlaid a large, pulsating countdown number (5..4..) in the middle of the screen during bouncer questions to make the pressure system more obvious.

## 2026-06-22: Viral Masterpiece Upgrade for 'Can You Get Into Berghain?'
- Added 5-second countdown timer for bouncer questions. Instant fail on timeout.
- Added Global Stats mock API to results page and sharing payload.
- Implemented CSS animations: screen shake on bad choices and pulsating club lights.
- Generated 'Sven' boss encounter (image + ElevenLabs audio) and added secret branching logic to `data.json`.

## 2026-06-22: UI Tweaks for 'Can You Get Into Berghain?'
- Generated a realistic Berghain exterior image and set it as the background for the Start Screen.
- Added a 'Share Result' button to the End Screen utilizing the Web Share API (with clipboard fallback).

## 2026-06-22 — Codex (Pharmacy map render fix)

**Did:** Fixed live tile/render issue in `pharmacy-in-berlin-map/` after the Wix post showed the Leaflet map collapsed into a corner.

**Changed:** Removed bad Leaflet CDN SRI attributes, added scoped Leaflet positioning fallback CSS, and added repeated `invalidateSize()`/parent resize calls for Wix iframe timing. Commit `9eda270` was pushed before this log-only update. Root Wix patch republished `pharmacy-in-berlin` with all widget embeds bumped to `?v=20260622c`.

**QA:** Direct live widget QA passed: pane `absolute`, 12 tiles/12 distinct positions, 9 markers, active marker `1`, overflow `0`. Live Wix post desktop QA passed with map iframe `v=20260622c`, 9 tiles/9 markers inside the frame, overflow `0`; 390px mobile had no old embed and no horizontal overflow.

## 2026-06-22: Added Audio and Deep Gameplay to 'Can You Get Into Berghain?'
- Generated German voice lines using ElevenLabs API and added a synthesized techno loop.
- Updated `index.html` to handle Web Audio API playback for BGM and voices.
- Updated `data.json` to feature randomized question pools and 4 multiple endings (VIP, Success, Fail, Shame).

## 2026-06-22 — Codex (World Cup fixtures morning scores)

**Did:** World Cup fixtures widget için Berlin saati 08:32 skor kontrolünde 3 yeni final skor eklendi: Uruguay 2-2 Cape Verde, Belgium 0-0 Iran ve New Zealand 1-3 Egypt. **Changed:** `worldcup-fixtures/index.html` içindeki üç due `M` satırı 8 alanlı `FT` satıra çevrildi; `SCORE_UPDATED` `22 Jun 2026, 08:32 CEST` yapıldı. Başka fixture zamanı, takım adı, filtre, stil, Wix, CMS, canlı site, reklam, booking veya root `PROJECT_MEMORY.md` değişmedi. **QA:** Due gate yalnız Uruguay-Cape Verde, Belgium-Iran ve New Zealand-Egypt maçlarını buldu. FIFA match-centre kontrol edildi ama shell/readback içinde tüm final skorlar açık expose olmadı; ESPN, Guardian ve diğer dated spor/news kaynakları skorlarla tutarlıydı. Inline JS parse smoke 72 maç / 40 skorlu satır / malformed `0` geçti; Playwright desktop ve 390px mobilde `.bw-match.final` = 40, horizontal overflow `0`, updated etiketi ve üç yeni final satırı görünür; console error/warning `0`; `git diff --check` temiz. **Opened:** Live GitHub Pages için push/deploy gerekiyor. **Closed:** 22 Haziran sabah skorları yerel widget kaynak dosyasında güncel.

## 2026-06-22 — Codex (World Cup post CTA + widget)

- **Did:** `where-to-watch-2026-world-cup-in-berlin` draft postunda üst/orta `2 hours / tip-based tour` CTA eklendi, `worldcup-berlin` widget çağrısı `?v=20260622b` olarak cache-bustlendi ve canlı post aynı içerikle PATCH/PUBLISH edildi.
- **Changed:** `berlinwalk-content-app/update-worldcup-post-with-cta.mjs` eklendi; `berlinwalk-widgets/blog-drafts/where-to-watch-2026-world-cup-in-berlin.md`, `berlinwalk-widgets/worldcup-berlin/index.html`, `berlinwalk-content-app/create-worldcup-berlin-draft.mjs`, `berlinwalk-content-app/add-worldcup-berlin-blog-images.mjs` güncellendi.
- **QA:** Wix API readback `status=PUBLISHED`, `hasUnpublishedChanges=false`, `nodes=52`, `htmlEmbeds=4`, `Version=20260622b`; widget HTML linki `target="_blank" rel="noopener"` doğrulandı.
- **Opened:** Live mobil/masaüstünde `/post/where-to-watch-2026-world-cup-in-berlin` ve `worldcup-berlin/` embed CTA görsel QA bekleniyor.

## 2026-06-22 — Codex (Daily blog draft Pharmacy in Berlin)

**Did:** Created the local widget/blog asset package for the unpublished Wix draft `Pharmacy in Berlin: How to Find Medicine, Emergency Pharmacies and Medical Help`. **Changed:** Added `blog-drafts/pharmacy-in-berlin.md`, image/source pack and contact sheet under `blog-drafts/images/pharmacy-in-berlin/`, Quick Summary/FAQ key `pharmacy-in-berlin`, regenerated `faq/inject.js`, and added local widget `pharmacy-in-berlin-helper/` plus `TOOL_STATUS.md`. Root helper scripts `berlinwalk-content-app/create-pharmacy-in-berlin-draft.mjs` / `update-pharmacy-in-berlin-draft.mjs` created and patched Wix draft `ba8f13db-221c-4017-8a7f-4522fd59bfef` as `UNPUBLISHED`; root `PROJECT_MEMORY.md` and root `SESSION_LOG.md` were updated outside this repo. **QA:** Wix readback confirmed 3 embeds, 5 image nodes/captions, all alt text, 12 links including 9 official/external links, SEO/social/canonical/robots `index, follow, max-image-preview:large`, 5 SEO keywords and BlogPosting JSON-LD. Local Playwright passed for direct widget desktop + 390px mobile with overflow `0`, interaction update to `Call 112 now`, console `0`; Quick Summary/FAQ 390px overflow `0`. JSON parse, `node --check faq/inject.js`, `node tools-hub/validate-data.mjs`, public voice/bad-duration scan, and `git diff --check` passed. **Opened:** Push/deploy is still needed before Wix preview/publish can load the new embed URLs. BerlinTools CMS/tools-hub remains blocked until a dedicated ChatGPT-browser glossy icon is generated/uploaded; no placeholder icon/CMS row/tools-hub entry was created. **Closed:** Local blog/widget package and unpublished Wix draft are review-ready.

## 2026-06-21 — Codex (World Cup fixtures evening score)

**Did:** World Cup fixtures widget için Berlin saati 21:36 skor kontrolünde 1 yeni final skor eklendi: Spain 4-0 Saudi Arabia. **Changed:** `worldcup-fixtures/index.html` içindeki Spain-Saudi Arabia `M` satırı 8 alanlı `FT` satıra çevrildi; `SCORE_UPDATED` `21 Jun 2026, 21:36 CEST` yapıldı. Başka fixture zamanı, takım adı, filtre, stil, Wix, CMS, canlı site, reklam, booking veya root `PROJECT_MEMORY.md` değişmedi. **QA:** Due gate yalnız Spain-Saudi Arabia maçını buldu. FIFA match-centre açıldı ama shell/readback içinde açık final-score metni expose etmedi; Guardian, Yahoo Sports, Flashscore ve AS final skoru 4-0 olarak tutarlı destekledi. Inline JS parse smoke 72 maç / 37 skorlu satır / malformed `0` geçti; Playwright desktop ve 390px mobilde `.bw-match.final` = 37, horizontal overflow `0`, updated etiketi ve Spain-Saudi Arabia final satırı görünür; sadece lokal favicon 404 console noise; `git -C berlinwalk-widgets diff --check` temiz. **Opened:** Live GitHub Pages için push/deploy gerekiyor. **Closed:** 21 Haziran akşam skoru yerel widget kaynak dosyasında güncel.

## 2026-06-21: Upgraded 'Can You Get Into Berghain?' to Visual Novel
- Rebuilt `berlin-bouncer/index.html` to support full-screen background states and RPG-style dialogue typing.
- Updated `data.json` to support visual outfit cards and dynamic bouncer states.
- Generated and added 4 outfit images and 2 bouncer state images (idle, suspicious).

## 2026-06-21: Built 'Can You Get Into Berghain?' Widget
- Created `berlin-bouncer` directory and game logic in `data.json` and `index.html`.
- Generated glossy 3D icon and added to `tools-hub/data.json`.
- Generated success and fail images for the widget.

# Session log

Rolling log of agent sessions. Most recent at top.

## 2026-06-21 — Codex (Berlin Battle single game heading)

**Did:** Removed the second repeated heading Yusuf spotted on the general Berlin Battle page. **Changed:** `berlin-battle-page/berlin-battle-page-element.js` now uses cache marker `single-game-heading-20260621`; the wrapper no longer renders the general `Play the game / Pick one and start` heading block, so the topic-grid heading lives only inside the game iframe. `berlin-battle-page/README.md` snippet matches. Root `SESSION_LOG.md` and `PROJECT_MEMORY.md` were updated outside this repo. Commit `98caf20` was pushed to `origin/main`. **QA:** `node --check`, `git diff --check`, and local Playwright on port `4196` passed. GitHub Pages deploy run `27902822829` completed success; old Wix Custom Element query and the new README query both serve `ASSET_BUILD = 'single-game-heading-20260621'`. Live Wix 390px QA passed: home UTM general page has no wrapper `PLAY THE GAME`, parent `Pick one and start` count `0`, iframe title `Pick one and start`, 10 topic cards, no start event, overflow `0`; direct Food still shows parent `Pick your Berlin winner`, iframe `Berlin Food Battle`, 2 choices, start event, overflow `0`. **Opened:** None. **Closed:** Single-heading fix is pushed, deployed, and live-verified.

## 2026-06-21 — Codex (Berlin Battle duplicate title fix)

**Did:** Fixed the repeated direct-play title Yusuf spotted in the live Food Battle screenshot. **Changed:** `berlin-battle-page/berlin-battle-page-element.js` now uses cache marker `direct-intro-20260621`; direct `?topic=<id>` wrapper hero no longer repeats the topic title and instead says `Pick your Berlin winner`, with a smaller compact title style. `berlin-battle-page/README.md` snippet matches. Root `SESSION_LOG.md` and `PROJECT_MEMORY.md` were updated outside this repo. Commit `c6ba5f1` was pushed to `origin/main`. **QA:** `node --check`, `git diff --check`, and local Playwright on port `4195` passed. GitHub Pages deploy run `27900462372` completed success; old Wix Custom Element query and the new README query both serve `ASSET_BUILD = 'direct-intro-20260621'`. Live Wix 390px QA passed: direct Food parent hero title `Pick your Berlin winner`, parent `Berlin Food Battle` count `0`, iframe title `Berlin Food Battle`, 2 choice cards, `bw_berlin_battle_start`, iframe URL `v=direct-intro-20260621`, parent/frame overflow `0`; general `/games/berlin-battle` still shows 10 topic cards, no start event, and overflow `0`. **Opened:** None. **Closed:** Duplicate-title fix is pushed, deployed, and live-verified.

## 2026-06-21 — Codex (Berlin Battle fast-play deployed)

**Did:** Shipped the Berlin Battle phase 1 fast-play flow and verified it live for the Instagram/Reels Food Battle URL. **Changed:** Commit `30ad787` (`Improve Berlin Battle fast-play flow`) is pushed to `origin/main`; GitHub Pages deploy run `27898921299` completed success and serves `berlin-battle-page/berlin-battle-page-element.js` plus `berlin-battle/index.html` with the `fast-play-20260621` marker. Root `SESSION_LOG.md` and `PROJECT_MEMORY.md` were updated outside this repo. The live Wix page JSON still lists the Custom Element source as `?v=label-spacing-fix-20260614`, but HTTP readback confirms that old query and the new README query both return the current `ASSET_BUILD = 'fast-play-20260621'` file with `cache-control: max-age=600`; the rendered live iframe uses `v=fast-play-20260621`. **QA:** GitHub Pages asset readback passed for old and new query URLs. Live Wix Playwright passed: `?topic=food` at 390px and 1280px direct-starts `Berlin Food Battle`, removes `Play now`/game-head, shows 2 choice cards, emits `bw_berlin_battle_start`, forwards the Instagram/Reels UTM params, and keeps parent/iframe horizontal overflow `0`; normal `/games/berlin-battle` and invalid `?topic=bad` both show the 10-card topic grid, emit no start event, and keep overflow `0`. Only Chromium's expected `web-share` feature-policy warning appeared. **Opened:** Recheck `bw_berlin_battle_reels_jun2026` sessions/start/completion after 24 hours. **Closed:** Phase 1 implementation, push/deploy, and live QA are complete.

## 2026-06-21 — Codex (Daily featured listings refresh)

**Did:** Refreshed listing selections for `/blog`, homepage blog teaser, `/berlin-tools` Start here, and homepage tools. **Changed:** `scripts/generate-blog-index-data.mjs` now keeps Heatwave as the timely `/blog` lead and rails Alternative Transport, Night Transport, World Cup, Public Transport, and Public Holidays; `blog-index/data.json` was regenerated from Wix Blog API with 135 posts; `blog-home/data.json` now shows Heatwave plus Alternative Transport, Unter den Linden, Public Transport, Public Holidays, Night Transport, World Cup, and Tax Free. `tools-hub/data.json` now has exactly 6 visible featured tools: Transport Ticket Calculator, What's Open Today, Berlin First-Day Planner, Berlin Public Holiday Checker, Berlin Luggage Storage Map, and Berlin Lakes Map. `tools-home/data.json` now uses First-Day Planner, Transport Ticket, What's Open Today, Public Holiday Checker, Berlin Lakes, Drinking Water, Luggage Storage, and Daily Budget. Root `SESSION_LOG.md` was updated outside this repo; live Wix custom embed `BerlinWalk Blog Featured Posts` was patched to revision `9`. **QA:** JSON parse, `node tools-hub/validate-data.mjs`, `node --check` for touched/related JS, and `git diff --check` passed. GitHub Pages deploy for `e084194` completed success; live `/blog`, homepage, `/berlin-tools`, and `/widgets` fresh browser/readback checks showed the expected selections with horizontal overflow `0`. **Opened:** None. **Closed:** Daily featured/listing refresh is live and current.

## 2026-06-21 — Codex (Berlin Battle fast-play phase 1)

**Did:** Implemented Berlin Battle phase 1 fast-play flow for Instagram/Reels traffic. **Changed:** `berlin-battle-page/berlin-battle-page-element.js` now uses cache-buster `fast-play-20260621` and switches valid `?topic=<id>` URLs into a compact direct-play page with no `Play now` anchor or game-head copy; `berlin-battle/index.html` topic screen copy now says `Pick one and start`; `berlin-battle-page/README.md` documents the new snippet and primary Food Battle campaign URL. Root `PROJECT_MEMORY.md`, root `SESSION_LOG.md`, and the Berlin Battle Story pack README were updated outside this repo. **QA:** `node --check`, inline game script parse, and `git diff --check` passed. Local Playwright on port 4194 passed: `?topic=food` mobile/desktop shows two choice cards, direct class true, `bw_berlin_battle_start` event present, overflow 0; normal `/berlin-battle-page/` mobile/desktop shows 10 topic cards, no start event, overflow 0; invalid `?topic=bad` falls back to topic grid with no start event. Screenshot saved at root `output/playwright/berlin-battle-fast-play-mobile-20260621.png`. **Opened:** Push/deploy and update/publish the Wix `/games/berlin-battle` custom-code script URL to `?v=fast-play-20260621`, then monitor `bw_berlin_battle_reels_jun2026` start rate after the Food Battle Story/Reels link is used. **Closed:** Local phase 1 implementation and QA are complete.

## 2026-06-21 — Codex (Alternative transport post-publish)

**Did:** Completed post-publish/widget work for Yusuf's live Alternative Transport post and `berlin-mobility-app-picker`. **Changed:** Generated the dedicated ChatGPT-browser glossy icon, added canonical 512/160 icons and source prompt under `tools-home/icons/_src/chatgpt-standard-20260612/berlin-mobility-app-picker/`, updated icon manifests/cache, added `tools-hub/data.json` entry, regenerated `blog-index/data.json`, and pushed the tool/blog-index changes (`937fca0` plus later synced main history). Wix Media icon `5a08a3_ce1b24b368ce41368f4e0f04bbe1a210~mv2.png`; BerlinTools CMS item `26598515-2450-411c-98a1-e8366d181d5d`; BerlinTools Layout Fixes revision `29`. **QA:** `node tools-hub/validate-data.mjs` passed with 61 tools / 59 visible; GitHub Pages now serves the new tool/widget/icon and live `blog-index/data.json` has 135 posts with `alternative-transport-berlin` Latest #1 and related tool `berlin-mobility-app-picker`. Live browser QA passed for the post, `/tools/berlin-mobility-app-picker`, `/blog`, and `/berlin-tools` on desktop + 390px mobile with horizontal overflow `0`; Search Console UI returned `Indexing requested` for both the post URL and the tool URL. **Opened:** None. **Closed:** Dedicated icon/tool, `/blog` surface, `/berlin-tools` card/icon, Pages deploy, and indexing requests are complete.

## 2026-06-21 — Codex (World Cup fixtures morning scores)

**Did:** World Cup fixtures widget için Berlin saati 08:32 skor kontrolünde 3 yeni final skor eklendi: Germany 2-1 Ivory Coast, Ecuador 0-0 Curaçao ve Tunisia 0-4 Japan. **Changed:** `worldcup-fixtures/index.html` içindeki üç due `M` satırı 8 alanlı `FT` satıra çevrildi; `SCORE_UPDATED` `21 Jun 2026, 08:32 CEST` yapıldı. Başka fixture zamanı, takım adı, filtre, stil, Wix, CMS, canlı site, reklam, booking veya root `PROJECT_MEMORY.md` değişmedi. **QA:** Due gate Germany-Ivory Coast, Ecuador-Curaçao ve Tunisia-Japan maçlarını buldu. FIFA match-centre URL'leri açıldı ama shell/readback içinde açık final-score metni expose etmedi; ESPN/FOX/CBS Germany 2-1 Ivory Coast, ESPN/Guardian/KSHB-AP Ecuador 0-0 Curaçao, Guardian ve India Today Tunisia 0-4 Japan sonucunu tutarlı destekledi. FOX Tunisia live boxscore readback'i stale/incomplete 0-3 state gösterdi ve doğrulama kaynağı olarak kullanılmadı. Inline JS parse smoke 72 maç / 36 skorlu satır / malformed `0` geçti; Playwright desktop ve 390px mobilde `.bw-match.final` = 36, horizontal overflow `0`, updated etiketi görünür; sadece lokal favicon 404 console noise; `git -C berlinwalk-widgets diff --check` temiz. **Opened:** Live GitHub Pages için push/deploy gerekiyor. **Closed:** 21 Haziran sabah skorları yerel widget kaynak dosyasında güncel.

## 2026-06-21 — Codex (Unter den Linden BerlinTools icon/tool)

**Did:** Completed the remaining BerlinTools work for `unter-den-linden-walk-planner`: generated the dedicated ChatGPT-browser glossy icon, uploaded it to Wix Media, added the local tools-hub card, inserted the BerlinTools CMS row, and updated the BerlinTools Layout Fixes icon map. **Changed:** Added source prompt/output under `tools-home/icons/_src/chatgpt-standard-20260612/unter-den-linden-walk-planner/`, canonical icons `tools-home/icons/unter-den-linden-walk-planner.png` and `-160.png`, icon manifests/cache, `tools-hub/data.json`, and `unter-den-linden-walk-planner/TOOL_STATUS.md`. Wix Media icon `5a08a3_91cf605a75344015913164170f6734f6~mv2.png`; CMS item `b522fccc-ae6a-47e3-9709-93aa86a23ed2`; layout embed revision `28`. **QA:** 512/160 icon visual check passed; `node tools-hub/validate-data.mjs` passed with 60 tools / 58 visible; CMS readback confirmed slug/title/iconUrl/widgetUrl/link; GitHub Pages deploy for commit `0031921` completed success; live `tools-hub/data.json`, icon PNG and widget URL returned 200; browser QA passed for `/tools/unter-den-linden-walk-planner`, `/berlin-tools` and direct widget with overflow `0` and no console warnings/errors; Search Console UI returned `Indexing requested` for the new tool URL. **Opened:** None. **Closed:** Dedicated icon/tool blocker is resolved; no placeholder/reused icon was wired.

## 2026-06-21 — Codex (Alternative transport draft/widget)

**Did:** Created the local widget/blog asset package for Yusuf's new unpublished `Alternative Transport in Berlin: MILES, Scooters, Bikes and Ride Apps` Wix draft. **Changed:** Added `blog-drafts/alternative-transport-berlin.md`, image/source pack and contact sheet under `blog-drafts/images/alternative-transport-berlin/`, Quick Summary/FAQ key `alternative-transport-berlin`, regenerated `faq/inject.js`, added local widget `berlin-mobility-app-picker/`, and updated root `PROJECT_MEMORY.md`/`SESSION_LOG.md`. Root helper `berlinwalk-content-app/create-alternative-transport-berlin-draft.mjs` created Wix draft `f6aa4b19-3c8e-4e6a-a041-056f481d7d7a` as `UNPUBLISHED`. **QA:** Wix readback found 208 Ricos nodes, 3 embeds, 4 image nodes/captions, all alt text, 5 SEO keywords, 18 links, no public `we/our/us` hits, and no bad `1h45` duration. Local Playwright passed for `berlin-mobility-app-picker` desktop + 390px mobile with overflow `0`, interaction updates, and no console messages; direct Quick Summary/FAQ at 390px and 1280px had overflow `0` and no console messages. JSON parse, `node --check`, and `git diff --check` passed. **Opened:** Push/deploy is still needed before the Wix draft's GitHub Pages embed URLs can be trusted in preview/publish. BerlinTools CMS/tools-hub remains blocked until a dedicated ChatGPT-browser glossy icon is generated/uploaded; no placeholder icon/CMS row/tools-hub entry was created. **Closed:** Local blog/widget package and unpublished Wix draft are review-ready.

## 2026-06-21 — Codex (Unter den Linden post-publish)

**Did:** Completed remaining post-publish work for Yusuf's live `Unter den Linden Berlin` article. **Changed:** Pushed commit `0f53a66` to update `blog-index/data.json` from live Wix Blog API with 134 posts and `unter-den-linden-berlin` as Latest #1; previous commit `a241cc1` already contained the Unter den Linden draft/QS/FAQ/widget package and the World Cup score update. Root `PROJECT_MEMORY.md` and root `SESSION_LOG.md` were updated outside this repo. **QA:** Wix API readback: post `e191c1f4-d76f-407c-a1bf-a78b8591ea9b` is `PUBLISHED`, firstPublished `2026-06-21T04:43:24.763Z`. Live HTML has correct title/meta/canonical/robots/OG/Twitter and 3 iframe srcs for Quick Summary, `unter-den-linden-walk-planner`, and FAQ with `?v=20260621a`; post mobile overflow `0`. GitHub Pages deploy run `27893871142` completed success; live `blog-index/data.json` returns 134 posts and Latest #1 Unter den Linden; live `/blog` mobile shows the post with overflow `0`; direct QS/FAQ/widget render at 390px has overflow `0` except GitHub Pages favicon 404. Search Console URL Inspection says canonical post is `Submitted and indexed`, mobile-crawled, indexing allowed, last crawl `2026-06-21T04:49:09Z`. **Opened:** BerlinTools CMS/tools-hub for `unter-den-linden-walk-planner` remains blocked until a dedicated ChatGPT-browser glossy icon is generated/uploaded; no placeholder icon/CMS row was created. **Closed:** Live post, `/blog` surface, GitHub Pages deploy, and Search Console inspection are complete.

## 2026-06-20 — Codex (World Cup fixtures late score)

**Did:** World Cup fixtures widget için Berlin saati 23:32 skor kontrolünde 1 yeni final skor eklendi: Netherlands 5-1 Sweden. **Changed:** `worldcup-fixtures/index.html` içindeki Netherlands-Sweden `M` satırı 8 alanlı `FT` satıra çevrildi; `SCORE_UPDATED` `20 Jun 2026, 23:32 CEST` yapıldı. Başka widget, fixture zamanı, takım adı, filtre, stil, Wix, CMS, canlı site, reklam, booking veya root `PROJECT_MEMORY.md` değişmedi. **QA:** Due gate sadece Netherlands-Sweden maçını buldu; Germany-Ivory Coast henüz due değildi. FIFA match-centre açıldı ama shell/readback açık final skor expose etmedi; ESPN ve Guardian/ABC final skoru 5-1 olarak tutarlı doğruladı. Inline JS parse smoke 72 maç / 33 skorlu satır / malformed `0` geçti; bundled Playwright desktop ve 390px mobilde `.bw-match.final` = 33, horizontal overflow `0`, console errors `0`; `git diff --check` temiz. **Opened:** Live GitHub Pages için push/deploy gerekiyor. **Closed:** 20 Haziran geç akşam skoru yerel widget kaynak dosyasında güncel.

## 2026-06-20 — Codex (World Cup fixtures morning scores)

**Did:** World Cup fixtures widget için Berlin saati 08:33 skor kontrolünde 3 yeni final skor eklendi: Scotland 0-1 Morocco, Brazil 3-0 Haiti ve Türkiye 0-1 Paraguay. **Changed:** `worldcup-fixtures/index.html` içindeki üç 20 Haziran sabah `M` satırı 8 alanlı `FT` satıra çevrildi; `SCORE_UPDATED` `20 Jun 2026, 08:33 CEST` yapıldı. Başka widget, Wix, CMS, canlı site, reklam, booking veya root `PROJECT_MEMORY.md` değişmedi. **QA:** Due gate Scotland-Morocco, Brazil-Haiti ve Türkiye-Paraguay maçlarını buldu. FIFA raporları Scotland-Morocco ve Brazil-Haiti skorlarını destekledi; Türkiye-Paraguay için FIFA match-centre shell/readback içinde açık final skor expose etmedi, Guardian/ESPN/FOX final skoru 0-1 olarak tutarlı doğruladı. Inline JS parse smoke 72 maç / 32 skorlu satır / malformed `0` geçti; local Playwright desktop ve 390px mobilde `.bw-match.final` = 32, horizontal overflow `0`, updated etiketi görünür; tek console hatası lokal favicon 404; `git -C berlinwalk-widgets diff --check` temiz. **Opened:** Live GitHub Pages için push/deploy gerekiyor. **Closed:** 20 Haziran sabah skorları yerel widget kaynak dosyasında güncel.

## 2026-06-20 — Codex (Berlin Battle unique topic covers)

**Did:** Refreshed the 10 Berlin Battle topic covers so the opening grid no longer reads as the same green mini-card composition. **Changed:** Rebuilt `berlin-battle/assets/topics/*.webp` from existing item-card art with a local deterministic Pillow remix script, added `berlin-battle/assets/source/generate-topic-cover-remix-20260619.py` plus `berlin-battle-topic-covers-unique-contact-sheet-20260619.jpg`, bumped game/page/home cache-busters to `unique-topic-covers-20260619`, and updated `berlin-battle/assets/source/PROMPTS.md` so future covers keep one BerlinWalk family while varying each battle's poster language. No paid/generative API was used. **QA:** `node --check` page/home JS, inline game script parse, JSON parse, image existence scan, `py_compile`, and `git diff --check` passed; local Chrome screenshots checked game grid and homepage teaser on desktop and 390px mobile with distinct topic visuals and no visible layout break. **Opened:** Push/deploy and live Wix/GitHub Pages QA still needed after commit. **Closed:** Local Berlin Battle topic covers are visually differentiated.

## 2026-06-19 — Codex (World Cup fixtures late score)

**Did:** World Cup fixtures widget için Berlin saati 23:32 skor kontrolünde 1 yeni final skor eklendi: United States 2-0 Australia. **Changed:** `worldcup-fixtures/index.html` içindeki United States-Australia `M` satırı 8 alanlı `FT` satıra çevrildi; `SCORE_UPDATED` `19 Jun 2026, 23:32 CEST` yapıldı. Başka widget, Wix, CMS, canlı site, reklam, booking veya root `PROJECT_MEMORY.md` değişmedi. **QA:** Due gate sadece United States-Australia maçını buldu. FIFA scores/fixtures sayfası kontrol edildi ama shell/readback içinde açık final-score metni expose etmedi; ESPN ve Guardian final skoru 2-0 olarak doğruladı. Inline JS parse smoke 72 maç / 29 skorlu satır / malformed `0` geçti; local Playwright desktop ve 390px mobilde `.bw-match.final` = 29, horizontal overflow `0`, skor ve updated etiketi görünür; tek console hatası lokal favicon 404; `git -C berlinwalk-widgets diff --check` temiz. **Opened:** Live GitHub Pages için push/deploy gerekiyor. **Closed:** 19 Haziran geç akşam skoru yerel widget kaynak dosyasında güncel.

## 2026-06-19 — Codex (Replace Monday featured pick)

**Did:** Replaced the weak `Berlin on a Monday` featured placement after Yusuf flagged it as not relevant enough for featured, then pushed and verified both live surfaces. **Changed:** `blog-home/data.json` and fallback now put `Berlin Night Transport: How to Get Around After Midnight` in the homepage right featured rail; `miniPosts` no longer duplicates Night Transport and now includes `Taxi in Berlin: Uber, Airport Rides and Fares`; `blog-home` data fetch is `?v=20260619b`. `/blog` curation in `scripts/generate-blog-index-data.mjs` now pins `berlin-night-transport` instead of `berlin-on-a-monday`; `blog-index/data.json` was regenerated from Wix Blog API with 132 posts; `blog-index/blog-index-element.js` fetches `data.json?v=20260619b`. Root `PROJECT_MEMORY.md` and root `SESSION_LOG.md` were updated. Commit `3ba765c` was pushed to `origin/main`; Wix Custom Embed `BerlinWalk Blog Featured Posts` (`7b593b94-45e8-4bcf-a002-ec308a52f37d`) was updated to revision `8`. **QA:** `node --check` for home/index/generator, JSON parse for home/index data, and `git diff --check` passed. Local Playwright on port `4192`: homepage rail titles are Night Transport / Tax Free / Kids, mini titles are Hauptbahnhof / Public Holidays / Public Transport / Taxi, `hasMonday:false`, badImages `0`, overflowX `0`; local `/blog-index` desktop hero titles are Heatwave / Night Transport / Tax Free / Kids / Hauptbahnhof / Public Holidays, `hasMonday:false`, badImages `0`, overflowX `0`; local `/blog-index` 390px mobile textOverflow `0`, overflowX `0`; only local favicon 404 appeared. GitHub raw showed the new home/blog data immediately; GitHub Pages lagged briefly, then served home/blog data and JS with `20260619b`. Live homepage `?cb=replace-monday-20260619b` showed Night Transport / Tax Free / Kids, mini Taxi, `hasMonday:false`, badImages `0`, overflowX `0`. Live `/blog?cb=replace-monday-20260619b` hero showed Heatwave / Night Transport / Tax Free / Kids / Hauptbahnhof / Public Holidays, `hasMonday:false`, badImages `0`, overflowX `0`; 390px mobile textOverflow `0`, overflowX `0`; console errors `0` with only Wix preload/i18next warnings. **Opened:** None. **Closed:** Monday is removed from featured curation and both live surfaces are verified.

## 2026-06-19 — Codex (Homepage blog mini posts)

**Did:** Filled the blank area under the homepage `Berlin Travel Notes` featured card with a compact mini-post block, then pushed and verified it live. **Changed:** `blog-home/data.json` now has 4 `miniPosts` (`berlin-night-transport`, `berlin-hauptbahnhof-guide`, `berlin-public-holidays-2026`, `berlin-public-transport-explained-for-tourists-u-bahn-s-bahn-tram-bus`); `blog-home/blog-home-element.js` renders a left feature column with the hero card plus mini links, keeps the right rail at 3 larger note cards, and bumps the data fetch to `?v=20260619a`; `AGENTS.md` documents the new `miniPosts` shape. Root `PROJECT_MEMORY.md` and root `SESSION_LOG.md` were also updated. Commit `d9e3b2d` was pushed to `origin/main`. **QA:** `node --check`, JSON parse, and `git diff --check` passed. Local Playwright at `http://127.0.0.1:4191/blog-home/`: desktop 1440px miniLinks `4`, noteCards `3`, badImages `0`, overflowX `0`, summary gap `25px`; mobile 390px miniLinks `4`, badImages `0`, overflowX `0`, widest text overflow `0`, console warnings/errors `0`. GitHub raw showed `20260619a` and 4 mini posts immediately; GitHub Pages initially lagged, then served `miniPosts=4` with `Last-Modified Fri, 19 Jun 2026 16:56:11 GMT`. Live `https://www.berlinwalk.com/?cb=bloghome-mini-20260619a` QA passed: desktop miniLinks `4`, noteCards `3`, images loaded after scroll, overflowX `0`, summary gap `25px`; mobile 390px miniLinks `4`, one-column mini list, badImages `0`, overflowX `0`, textOverflow `0`; console errors `0` with only Wix preload/i18next warnings. Screenshots saved to `output/playwright/blog-home-mini-posts-desktop-20260619.png`, `blog-home-mini-posts-mobile-20260619.png`, `blog-home-mini-posts-live-desktop-20260619.png`, and `blog-home-mini-posts-live-mobile-20260619.png`. **Opened:** None. **Closed:** Homepage blog teaser mini-post layout is pushed and live.

## 2026-06-19 — Codex (Night transport post-publish completion)

**Did:** Completed post-publish work for Yusuf's live `Berlin Night Transport` article. **Changed:** Regenerated `blog-index/data.json` from Wix Blog API with 132 posts and added generator mapping so `berlin-night-transport` relates to `berlin-night-transport-checker`; pushed commit `8ab43f7` to `origin/main`. **QA:** GitHub raw + Pages readback now show `/blog` latest #1 `berlin-night-transport` and related tool `berlin-night-transport-checker`; Pages serves the Timeline widget and `tools-hub` title `Berlin Night Transport Timeline`. Wix API readback confirms published post `f77a0ed2-7608-4963-9047-7cbf14a4ee3c`, `hasUnpublishedChanges:false`, 3 embeds, widget `?v=20260619c`. Live browser QA passed for post desktop/mobile, tool mobile, `/blog` mobile, and `/berlin-tools` mobile with horizontal overflow `0`. Search Console URL Inspection API showed the new post/tool URLs as `URL is unknown to Google`, while `/blog` and `/berlin-tools` were already `Submitted and indexed`; UI `Request indexing` succeeded for both new URLs with `URL was added to a priority crawl queue`. **Opened:** Recheck Search Console in a few days if indexing status matters. **Closed:** Night transport article/tool post-publish deploy, QA, and indexing requests are complete.

## 2026-06-19 — Codex (World Cup fixtures morning scores)

**Did:** World Cup fixtures widget için Berlin saati 08:36 skor kontrolünde 2 yeni final skor eklendi: Canada 6-0 Qatar ve Mexico 1-0 South Korea. **Changed:** `worldcup-fixtures/index.html` içindeki iki `M` satırı 8 alanlı `FT` satıra çevrildi; `SCORE_UPDATED` `19 Jun 2026, 08:36 CEST` yapıldı. Başka widget, Wix, CMS, canlı site, reklam veya booking değişmedi. **QA:** Due gate Canada-Qatar ve Mexico-South Korea maçlarını buldu; FIFA match-centre sayfaları kontrol edildi ama shell/readback içinde açık final-score metni güvenilir expose etmedi; ESPN, Guardian, FOX ve Global News kaynakları skorları tutarlı doğruladı. Inline JS parse smoke 72 maç / 28 skorlu satır / malformed `0` geçti; local Playwright desktop ve 390px mobilde `.bw-match.final` = 28, horizontal overflow `0`; sadece local favicon 404 console hatası görüldü; `git -C berlinwalk-widgets diff --check` temiz. **Opened:** Live GitHub Pages için push/deploy gerekiyor. **Closed:** 19 Haziran sabah skorları yerel widget kaynak dosyasında güncel.

## 2026-06-19 — Codex (Homepage Berlin Battle teaser updated)

**Did:** Updated the homepage `bw-berlin-battle-home` section so it now shows all 10 active Berlin Battle categories in a compact responsive grid, with desktop room reserved for the live sticky CTA rail. **Changed:** `berlin-battle-home/berlin-battle-home-element.js` now renders the 10 category cards from a local mode list, links each card to `/games/berlin-battle?topic=<id>`, tightens the copy/spacing, and uses cache-buster `home-categories-20260619`; `berlin-battle-page/berlin-battle-page-element.js` forwards `topic` into the iframe; `berlin-battle/index.html` auto-starts a valid active battle from the `topic` query param; README snippets were updated. Root `PROJECT_MEMORY.md` was updated. No Wix publish, GitHub push, ads, bookings, or live-site write was done. **QA:** `node --check` for home/page elements, inline game script parse, topic id + cover existence check, and `git diff --check` passed. Local Playwright on port `4190`: desktop 1440px had 10 cards, 10 loaded images, overflow `0`, right rail free `292px`, section height `680px`; mobile 390px had 10 cards, 2 columns, bad images `0`, overflow `0`; deep-link wrapper `/berlin-battle-page/?topic=transport...` opened iframe title `Berlin Transport Battle`, wrapper/frame overflow `0`, console error/warning `0`. Screenshots saved at root `output/playwright/berlin-battle-home-categories-desktop-20260619.png` and `output/playwright/berlin-battle-home-categories-mobile-20260619.png`. **Opened:** Push/deploy and live Wix homepage + `/games/berlin-battle` QA still needed. **Closed:** Local homepage Berlin Battle teaser is aligned with the 10-category game.

## 2026-06-19 — Codex (Reviews CMS updated)

**Did:** Added Yusuf-supplied FreeTour reviews from Fazila M. (South Africa, Jun 17 2026) and Karolina B. (Poland, Jun 12 2026), and approved the one new Wix-submitted review from Eva Kristine A. (Norway). **Changed:** Wix `Reviews` collection only: inserted Fazila item `c4d77874-cd7c-4f7a-a9fc-e8ef3b14e4e2`, inserted Karolina item `bb4f18ac-8025-4ae0-8b3e-ea8a6ad797c2`, and set existing Eva Kristine item `5b6ee8a7-ff19-4b14-b9bc-bfedb4e190dd` to `approved=true`. No repo code, GitHub Pages, Wix site publish, ads, bookings, or fallback testimonial JSON changed. **QA:** Loaded Wix API key via Keychain without printing it; public `/_functions/listReviews?limit=100` now returns `totalCount:12` with Karolina, Fazila, and Eva Kristine at the top; direct Wix Data readback shows `12` total / `12` approved / `0` unapproved; `/reviews` returns HTTP 200. **Opened:** None. **Closed:** Reviews CMS and public review feed are current.

## 2026-06-18 — Codex (Blog index hero refreshed)

**Did:** Refreshed the live `/blog` featured hero/rail after Yusuf asked to update the blog main page too. **Changed:** `scripts/generate-blog-index-data.mjs` now pins the `/blog` hero to `berlin-heatwave-day-plan`, with secondary rail `berlin-on-a-monday`, `tax-free-shopping-berlin-vat-refund`, `berlin-with-kids`, `berlin-hauptbahnhof-guide`, and `berlin-public-holidays-2026`; `blog-index/data.json` was regenerated from Wix Blog API with 131 posts; `blog-index/blog-index-element.js` now fetches `data.json?v=20260618b` to avoid stale CDN data. Commits `9dfa612` and `fec3548` were pushed to `origin/main`. Wix Custom Embed `BerlinWalk Blog Featured Posts` (`7b593b94-45e8-4bcf-a002-ec308a52f37d`) was updated to revision `7` with the same new hero data, because the live inline bridge was still overriding the hero to Public Holidays/World Cup. No ads, booking, blog body, BerlinTools CMS, or budget settings changed. **QA:** `node --check` for generator + blog element, JSON parse, and `git diff --check` passed. Local `/blog-index` desktop + 390px showed all new hero titles/images, overflow `0`; screenshot saved at root `output/playwright/blog-index-mobile-hero-20260618.png`. GitHub Pages readback passed for `blog-index/data.json?v=20260618b` and `blog-index-element.js` with `Last-Modified Thu, 18 Jun 2026 18:39:25 GMT`. Live `https://www.berlinwalk.com/blog?cb=blogindex-20260618d` desktop + 390px showed the new `.bw-hero-grid`, bridge contained `berlin-heatwave-day-plan`, old lead override absent, hero images loaded, overflow `0`, console error `0`. **Opened:** None. **Closed:** `/blog` featured hero is current and live.

## 2026-06-18 — Codex (Homepage blog teaser refreshed)

**Did:** Refreshed the homepage `bw-blog-home` / `Berlin Travel Notes` teaser after Yusuf asked to update the blog home page. **Changed:** `blog-home/data.json` now features `Too Hot in Berlin? How to Plan a Smart Berlin Heatwave Day`, with note cards for `Berlin on a Monday`, `Tax Free Shopping in Berlin`, and `Berlin with Kids`; `blog-home/blog-home-element.js` fallback mirrors the same selection and bumps the data URL to `?v=20260618a`. Commit `ae6e394` was pushed to `origin/main`. No Wix CMS/blog post content, ads, booking, BerlinTools data, or `/blog` index data changed. **QA:** `node --check`, JSON parse, and `git diff --check` passed. Local Playwright desktop + 390px mobile showed 4 correct cards, all images loaded, overflow `0`; screenshot saved at root `output/playwright/blog-home-mobile-20260618.png`. GitHub Pages served new JS/data with `Last-Modified Thu, 18 Jun 2026 18:14:17 GMT`; live `https://www.berlinwalk.com/?cb=bloghome-20260618a` desktop + 390px mobile showed 4 correct homepage blog cards, overflow `0`, console error `0`. **Opened:** None. **Closed:** Homepage blog teaser is live and current.

## 2026-06-18 — Claude (Mobil blog post üst menü blink fix)

**Did:** Mobil blog post sayfalarında en üstteki `Blog Home / Categories` menüsünün (`bw-blog-mobile-nav`) blink/flicker'ını giderdim. Kök neden: Wix/React hydration sırasında bizim enjekte ettiğimiz nav node'unu siliyor, eski observer ise `scheduleRender()` (80ms macrotask) ile geri ekliyordu — bu da en az bir paint'in menü yokken çizilmesine (görünür blink) ve 270px reserve margin'inin post gövdesini zıplatmasına yol açıyordu. **Changed:** `js/blog-journey-inject.js` — MutationObserver artık nav eksikse `insertMobileBlogNav(body, dataCache)`'i senkron (microtask içinde, paint'ten önce) çağırıyor; nav-missing koşulu `scheduleRender` tetikleyicisinden çıkarıldı (journey/guide hâlâ scheduleRender ile). `wix-embed-snippets.md` blog helper referansı `?v=7` → `?v=8`. **QA:** `node --check` geçti. Yerel repro (gerçek scripti yükleyen, React silmesini taklit eden harness, 375px): nav silindiğinde aynı senkron task'ta yok ama bir sonraki task'ta (microtask checkpoint sonrası) geri geliyor; ~13 sn boşta yalnızca 2 yeniden ekleme (runaway yok), console error `0`, mobil render doğru. Harness dosyası silindi; tek diff `js/blog-journey-inject.js`. **Opened:** Push/deploy `berlinwalk-widgets`, GitHub Pages bekle, Wix Custom Code blog helper'ını `?v=8`'e güncelle, ardından canlı mobil post cold-load ile menünün blink'siz olduğunu doğrula. **Closed:** Mobil blog post üst menü blink kök nedeni (React removal + 80ms gecikmeli restore) yerel olarak giderildi.

## 2026-06-18 — Codex (World Cup fixtures morning scores)

**Did:** World Cup fixtures widget için Berlin saati 09:09 skor kontrolünde 3 yeni final skor eklendi: Ghana 1-0 Panama, England 4-2 Croatia, Uzbekistan 1-3 Colombia. **Changed:** `worldcup-fixtures/index.html` içindeki üç `M` satırı 8 alanlı `FT` satıra çevrildi; `SCORE_UPDATED` `18 Jun 2026, 09:09 CEST` yapıldı. Başka widget, Wix, CMS, live site veya reklam dosyası değiştirilmedi. **QA:** Due gate Ghana-Panama, England-Croatia ve Uzbekistan-Colombia maçlarını buldu; FIFA match centre sayfaları kontrol edildi ama final skor metnini expose etmedi; AP/Guardian/ESPN/FOX/England Football kaynakları skorları tutarlı doğruladı. Inline JS parse smoke 72 maç / 24 skorlu satır, malformed `0`, due unscored `0` geçti; local Playwright desktop ve 390px mobilde `.bw-match.final` = 24, horizontal overflow `0`, console error `0`; `git diff --check` temiz. **Opened:** Live GitHub Pages için push/deploy gerekiyor. **Closed:** 18 Haziran sabah skorları yerel widget kaynak dosyasında güncel.

## 2026-06-18 — Codex (BerlinTools taxonomy + dropdown filters live)

**Did:** Reworked `/berlin-tools` after Yusuf's screenshot feedback, pushed it to `origin/main`, and verified the live Wix page. **Changed:** Pushed commits `6b3eacc` (`Redesign BerlinTools hub filters`) and `7b33a63` (`Version BerlinTools hub data fetch`). `tools-hub/data.json` now uses 8 public hub categories with visible counts `TripPlans:6`, `Transport:7`, `MoneyShopping:6`, `Essentials:10`, `WeatherOutdoor:7`, `FoodNightlife:6`, `EventsSports:7`, `CultureLandmarks:7`; legacy `category` values remain for `/widgets`. `tools-hub/tools-hub-element.js` filters by search + dropdown category + dropdown type, removes the crowded chip UI, and appends `bwHubVersion=2026-06-18-dropdown-taxonomy` to the data fetch to avoid stale deploy data. Added `tools-hub/validate-data.mjs`; updated `AGENTS.md` so new widgets must set `hubCategory`, `type`, `tags`, and `aliases`, then run validation. Wix Custom Embed `BerlinWalk 1237 Tools Hub Feature` (`a160fc72-8cd0-463d-96de-65942d534df7`) was disabled (`enabled:false`, revision `2`) because the old live bridge was re-patching `tools-hub/data.json` and breaking the new taxonomy. No ads, CMS tool rows, blog content, or booking settings changed. **QA:** `node --check tools-hub/tools-hub-element.js`, `node tools-hub/validate-data.mjs`, and `git diff --check` passed. GitHub Pages served the final JS with `Last-Modified: Thu, 18 Jun 2026 06:52:46 GMT`. Live `/berlin-tools?cb=...` desktop QA passed: 56 cards, 6 featured, 2 selects / 0 chips, Culture/Landmarks = 7 including Medieval Berlin Mini Walk, `FoodNightlife + Guide` = 3 tools, network uses `data.json?bwHubVersion=...` and no `bw1237` request, console errors `0` with only Wix preload warnings, overflow `0`. Mobile 390px QA passed: dropdowns fit at 328px, Essentials = 10 cards, overflow `0`. **Opened:** `worldcup-fixtures/index.html` has an unrelated uncommitted score diff and was intentionally not included in these commits. **Closed:** BerlinTools taxonomy/dropdown redesign is live.

## 2026-06-18 — Codex (BerlinTools hub UX redesign local)

**Did:** Implemented the approved `/berlin-tools` UX redesign locally: search, intent chips, Start here featured strip, 8 hub categories, tool type/season badges, and compact mobile card rows. **Changed:** `tools-hub/data.json` keeps the legacy `category` values for `/widgets` but now adds `hubCategories`, per-tool `hubCategory`, `tags`, `aliases`, `type`, `priority`, `featured`, and seasonal metadata. `tools-hub/tools-hub-element.js` is now the main finder/catalog renderer with `data-url` override support; `tools-hub/index.html` uses that same element with local `./data.json`. No push, Wix publish, CMS, ads, or live-site changes were made. **QA:** `node --check`, metadata validation, and `git diff --check` passed. Local Playwright at `http://127.0.0.1:4177/tools-hub/index.html` passed console `0`, 56 visible tools, 6 Start here cards, 8 category counts, desktop/mobile overflow `0`, mobile height `13032px` / `15.4` screens, and search/chip smoke for Sunday, luggage, ticket, weather, first day, kids, Start here, Tickets, Open today, With kids, Events. `/widgets-hub/index.html` still renders 56 cards from the same data with the old 4 category groups; only its existing favicon 404 appeared. **Opened:** Push/deploy and live `/berlin-tools` desktop/mobile QA remain. **Closed:** Local hub redesign implementation and QA are complete.

## 2026-06-18 — Codex (Trip Planner live Wix emails + Velo published)

**Did:** Used Yusuf's open Chrome/Wix session to paste-publish the regenerated Dynamic Berlin Trip Pack copy into all 5 live Trip Planner Triggered Emails, then updated and published the matching live Wix Velo backend. **Changed:** Live IDs updated: instant `VLDqhLM`, minus7 `VLDvLj8`, minus3 `VLDvnng`, minus1 `VLDwKUu`, day-of `VLDwjZc`; subject, preheader, and body HTML now use pack language from `ultimate-berlin-trip-planner/email/paste-ready/`. `Backend/tripPlannerFunnel.js` in Wix IDE now includes `tripPackLabelForLength()` and `tripPackLabel: tripPackLabelForLength(lead.tripLength)`. No Meta/campaign/budget activation was made. **QA:** Wix list rows showed `Published` with 2026-06-18 00:48-00:49 CEST updates; each editor was reopened and top subject/preheader/body copy verified. Wix sanitizer warned unsupported code/attributes were removed, so visible rendered copy was checked. Velo pre-publish gate passed `15 pass / 0 block`; Wix IDE find confirmed helper and variable; IDE status showed `No Problems`; sync showed `last synced just now`; Wix Studio publish modal said the site is live. Remote preflight passed GitHub Pages/widget reachability, dynamic Wix tool 200, Velo OPTIONS, and collection checks. Live GitHub Pages `index.html` contains the dynamic pack labels and was served with `Last-Modified: Wed, 17 Jun 2026 22:37:07 GMT`. **Opened:** No real lead/email smoke was sent; paid reactivation remains a separate Yusuf approval step. **Closed:** Live Triggered Email copy and matching Velo variable publish are done.

## 2026-06-18 — Codex (Trip Planner dynamic pack prep)

**Did:** Trip Planner lead gate and triggered emails were reframed from generic full-plan/PDF language into a dynamic Berlin Trip Pack offer. **Changed:** `ultimate-berlin-trip-planner/index.html` now computes `24-hour`, `48-hour`, `72-hour`, `96-hour`, and `N-day Berlin Trip Pack` labels for gate headline/button/chips/locked preview; `velo/tripPlannerFunnel.js` computes `${tripPackLabel}` from existing `tripLength` for emails without adding a lead payload/CMS field; `email/*.md` and regenerated `email/paste-ready/*` use pack language; root `PROJECT_MEMORY.md` and `SESSION_LOG.md` were updated; local Meta brief was added at `../output/meta-ads/trip-planner-dynamic-pack-relaunch-2026-06-18/ad-copy-brief.md`. **QA:** Inline JS parse, generator syntax, Velo ESM parse, email generator, manifest parse, and `git diff --check` passed. Local Playwright 390px QA passed for 1/2/4/5-day labels/buttons/chips with overflow 0; fail-soft lead flow still emitted `gate_view`, `email_focus`, `email_valid`, `lead_submit`, `lead_error`, and `unlock_success`. Local console errors were expected CORS blocks from `127.0.0.1` to production `tp-event`. **Opened:** Push/deploy, Wix Velo/Triggered Email paste-publish, and any Meta reactivation still need separate Yusuf approval. **Closed:** Local dynamic pack relaunch package is ready.

## 2026-06-17 — Codex (World Cup fixtures late score)

**Did:** World Cup fixtures widget için Berlin saati 23:31 skor kontrolünde 1 yeni final skor eklendi: Portugal 1-1 DR Congo. **Changed:** `worldcup-fixtures/index.html` içindeki Portugal-DR Congo `M` satırı 8 alanlı `FT` satıra çevrildi; `SCORE_UPDATED` `17 Jun 2026, 23:31 CEST` yapıldı. **QA:** FIFA match centre bulundu; ESPN final score, Guardian match report/live ve FOX Sports box score 1-1 finalini doğruladı. Inline JS parse smoke 72 maç / 21 skorlu satır geçti; yerel Playwright desktop ve 390px mobilde `.bw-match.final` = 21, Portugal 1-1 DR Congo görünür, horizontal overflow = 0; tek konsol hatası lokal favicon 404; `git diff --check` temiz. **Opened:** Live GitHub Pages için push/deploy gerekiyor. **Closed:** 17 Haziran geç akşam skoru yerel widget kaynak dosyasında güncel.

## 2026-06-17 — Codex (Tax Free calculator published)

**Did:** Published the Tax Free Shopping post and completed the renamed `Berlin Tax Free Refund Calculator` BerlinTools workflow. **Changed:** Renamed/wired `berlin-tax-free-refund-calculator/`, updated `tools-hub/data.json` from draft to public with Wix icon `https://static.wixstatic.com/media/5a08a3_7fd32bcdfd414f80b268136e09ec22da~mv2.png`, regenerated `blog-index/data.json` with 129 posts, added ChatGPT-browser glossy icon source/output plus 512/160 PNGs, updated both icon manifests and Wix upload cache/summary, and added live QA screenshots under `output/playwright/`. Root Wix work created BerlinTools CMS item `da2b343f-338e-4bf9-8831-b3c7d0cd85f7`, updated BerlinTools Layout Fixes embed to revision `25`, and published the Wix site. Commits `97842f9` and `ac39fbe` were pushed to `origin/main`. **QA:** JSON/inline script/diff checks passed; GitHub Pages readback served the new public tool data; live post/tool/hub mobile QA passed with calculator iframe/card/icon and horizontal overflow `0`. **Opened:** Sitewide live blog console has unrelated `blog-journey-inject.js` TypeError noise. **Closed:** Tax Free calculator is public on GitHub Pages and live in BerlinTools.

## 2026-06-17 — Codex (Daily blog draft: Tax Free Shopping)

**Did:** Created local widget/blog assets for unpublished Wix draft `Tax Free Shopping in Berlin: VAT Refunds Explained for Tourists`. **Changed:** Added `blog-drafts/tax-free-shopping-berlin-vat-refund.md`, image/source pack under `blog-drafts/images/tax-free-shopping-berlin-vat-refund/`, Quick Summary/FAQ key `tax-free-shopping-berlin-vat-refund`, regenerated `faq/inject.js`, added post widget `berlin-tax-free-refund-checker/`, and wired `tools-hub/data.json` as `status:"draft"` / `published:false` pending the required glossy icon. Wix draft ID `dc5fa885-5b27-4c02-80c3-4bea8c74baff` remains `UNPUBLISHED`; no BerlinTools CMS item was created because the tool icon is not ready. **QA:** Local widget Playwright QA passed desktop and 390px mobile with overflow 0 and no content console errors; JSON/JS checks passed; local Quick Summary/FAQ render passed; Wix readback confirmed 3 embeds, 4 image nodes, 4 caption nodes, alt text, SEO/social/canonical/robots/BlogPosting fields. **Opened:** Generate/upload a ChatGPT-browser glossy icon, then create/wire the BerlinTools CMS item and push/deploy before relying on Wix preview embeds. **Closed:** Local Tax Free Shopping blog/widget package is ready.

## 2026-06-17 — Codex (Family Day Planner icon replacement)

**Did:** Replaced the rejected local-drawn `berlin-family-day-planner` card icon with a ChatGPT-browser-generated glossy BerlinTools icon and tightened the icon rule. **Changed:** Updated `AGENTS.md` to remove the local fallback exception; saved ChatGPT-browser prompt/output under `tools-home/icons/_src/chatgpt-standard-20260612/berlin-family-day-planner/`; regenerated `tools-home/icons/berlin-family-day-planner.png` and `-160.png`; updated icon manifests, Wix upload cache/summary, and `tools-hub/data.json` to new Wix Media id `5a08a3_8907b6aa962b443e822e5dcd535c1d74~mv2.png`. BerlinTools CMS item `2419eefe-ceb5-4421-a3c6-8bec6398da65` and layout embed revision `24` were updated from root scripts. **QA:** Source PNG is 1254x1254; generated 512/160 icons verified; comparison sheet `../output/family-day-icon-new-comparison.png` visually reviewed; live `/berlin-tools` Playwright readback after Wix site publish confirmed the Family card image src uses the new media id and screenshot `../output/playwright/berlin-tools-family-icon-live-after-publish.png` shows the new glossy icon. **Opened:** None. **Closed:** Family Day Planner icon now matches the BerlinTools glossy icon family live.

## 2026-06-17 — Codex (Berlin with Kids published + planner improved)

**Did:** Improved `berlin-family-day-planner/`, pushed the Berlin with Kids asset set, published the Wix Blog post, and finished post-publish blog/tool checks. **Changed:** `berlin-family-day-planner/index.html` now supports age, goal, weather, starting area, day type, pace, plan-health/transit warnings, map links, ticket/food/toilet/date notes, smart swap, copy action, and booking link; `tools-hub/data.json` uses a 1250px embed height; `scripts/generate-blog-index-data.mjs` now maps family/kids posts to `berlin-family-day-planner`; `blog-index/data.json` was regenerated from the live Wix Blog API and puts `berlin-with-kids` first in Latest with related tool `berlin-family-day-planner`. Commits `88a718c` and `6c39095` were pushed to `origin/main`. Wix post `449d53c6-7d7d-400a-9f71-0a6c30fcb2fe` is live at `/post/berlin-with-kids`, `PUBLISHED`, `hasUnpublishedChanges:false`; BerlinTools CMS item `2419eefe-ceb5-4421-a3c6-8bec6398da65` is live at `/tools/berlin-family-day-planner`. **QA:** Local planner QA passed desktop and 390px mobile with horizontal overflow 0. GitHub Pages readback now serves the improved planner. Live mobile QA passed `/post/berlin-with-kids` with title/H1, 3 iframes, Quick Summary, Pages planner, FAQ, image render, and overflow 0; live `/tools/berlin-family-day-planner` passed title, Pages planner iframe, and overflow 0. Wix API readback confirmed SEO title/meta/canonical/robots/social image/BlogPosting JSON-LD, 3 HTML embeds on normal GitHub Pages URLs, 3 inline image nodes and cover image. **Opened:** None. **Closed:** Berlin with Kids blog/tool package is published and live.

## 2026-06-17 — Codex (Berlin with Kids image refresh)

**Did:** Refreshed the weak image package for the unpublished `Berlin with Kids` blog draft and recorded Yusuf's stricter daily-blog visual/widget rules. **Changed:** `blog-drafts/berlin-with-kids.md` now lists 4 images and 3 widget ideas considered; `blog-drafts/images/berlin-with-kids/visual-sources.md` was rewritten with new Pexels/Wikimedia sources, rejected/demoted candidates, AI attempt notes, and contact sheet path; new raw candidates live under `blog-drafts/images/berlin-with-kids/assets/raw/new-candidates/`; new optimized files are `01-berlin-with-kids-family-alexanderplatz-cover.jpg`, `02-berlin-with-kids-naturkundemuseum-dinosaur-hall.jpg`, `03-berlin-with-kids-urban-playground.jpg`, `04-berlin-with-kids-zoo-gate.jpg`, plus `contact-sheet-v2.jpg`. Root `PROJECT_MEMORY.md` and the daily automation prompt now require at least 4 strong images, contact-sheet visual QA where feasible, at least 3 widget ideas before choosing one, and at most 2 non-paid/free AI images. **QA:** Contact sheet was visually reviewed; Wix draft `449d53c6-7d7d-400a-9f71-0a6c30fcb2fe` readback is still `UNPUBLISHED` with 4 total images, all alt text, 3 HTML embeds, OG/Twitter cover image, robots/canonical and BlogPosting JSON-LD. **Opened:** Push/deploy remains needed for the already-created QS/FAQ/widget/icon assets to load from GitHub Pages. **Closed:** Berlin with Kids image package no longer uses the weak 3-image set.

## 2026-06-17 — Codex (Footer NEW badge sizing)

**Did:** Fixed the footer `NEW` badge stretching vertically beside the wrapped `Berlin Trip Planner` link. **Changed:** `site-footer/site-footer-element.js` now centers footer link flex items and keeps `.bw-badge-new` as a natural 16px-high inline-flex pill (`flex:0 0 auto`, `align-self:flex-start`, `border-radius:999px`); pushed commit `db22fd3`. Root live patch source `../berlinwalk-footer-social-links.html` also gained the same CSS-only fix, `../scripts/update-footer-social-links-embed.mjs` gained a `badgeSizingFix` marker, and Wix Custom Embed `BerlinWalk Footer Social Links` was deployed to revision 4 while GitHub Pages caught up. **QA:** `node --check`, `git diff --check`, local desktop/mobile footer measurements, and live Book Now QA passed: desktop badge `16px` high with link `38px`, mobile badge `16px`, horizontal overflow `0`. **Opened:** None; the live Custom Embed remains duplicate-safe while GitHub Pages cache settles. **Closed:** Footer `NEW` badge stretch bug is fixed live.

## 2026-06-17 — Codex (Book Now spacing fix)

**Did:** Fixed Yusuf's mobile/desktop spacing complaint on the live Book Now first screen. **Changed:** `booking-calendar/booking-calendar-element.js` and `booking-calendar/book-now-intro-patch.js` now give standalone calendar mode breathing room: desktop `32px 24px 44px`, mobile `18px 16px 26px`. Pushed commits `7a1645a` and `d130469`; root Wix booking funnel hotfix embed was deployed as revision 13 loading pinned patch `https://cdn.jsdelivr.net/gh/fenerszymanski/berlinwalk-widgets@d130469/booking-calendar/book-now-intro-patch.js`. **QA:** `node --check`, `git diff --check`, hotfix dry-run `13004/15000`, and live mobile/desktop measurements passed: mobile left/right `16px`, top `18px`, bottom `26px`, CTA bottom gap `39px`, footer top `668px`, overflow `0`; desktop top `32px`, side `24px`, bottom `44px`, CTA bottom gap `57px`, overflow `0`. CTA href still preserves `bookings_sessionId` and test UTM params. No fake booking submit; no Meta/campaign/budget/booking inventory changes. **Opened:** Remove external patch once Wix Custom Element source URL moves away from old pinned `3f6e73b`. **Closed:** Live Book Now spacing issue is fixed.

## 2026-06-17 — Codex (Book Now first screen strengthened)

**Did:** Strengthened the live Book Now first viewport without rebuilding the page into a long landing page. **Changed:** `booking-calendar/booking-calendar-element.js` now renders a compact standalone intro for `navigation-mode="event"` unless `hide-intro` is present, changes the standalone calendar title to `Choose your date and time`, and defaults the standalone CTA to `Continue to free reservation`; `booking-calendar/README.md` documents `navigation-mode` and `hide-intro`; `site-header/site-header-element.js` replaced `Daily 11:30` with `Tue-Sat 11:30 · From 3 July: +15:30`; `booking-calendar/book-now-intro-patch.js` was added as a compatibility patch because the live Book Now page still loads the calendar from pinned jsDelivr commit `3f6e73b`. **Deploy:** Pushed `a53b19a`, `7511c14`, and `d13c712` to `main`; root booking funnel hotfix embed was deployed to Wix revision 11 loading pinned patch `https://cdn.jsdelivr.net/gh/fenerszymanski/berlinwalk-widgets@d13c712/booking-calendar/book-now-intro-patch.js`. **QA:** `node --check`, `git diff --check`, hotfix dry-run `13004/15000`, Pages/jsDelivr readbacks, and live 390px QA passed. Live first viewport shows intro/chips/title/CTA, header no longer says `Daily 11:30`, overflow is `0`, and CTA click into `/booking-form` preserved session/timezone/service/location plus all test UTM params including `utm_content`; form intro/phone helper were visible. No fake booking submit; no Meta/campaign/budget/booking inventory changes. **Opened:** Later, update the Wix Custom Element source URL away from pinned `3f6e73b`; then remove the external compatibility patch from the hotfix. **Closed:** Book Now first screen is live-strengthened and attribution-safe.

## 2026-06-17 — Codex (World Cup fixtures Austria-Jordan score)

**Did:** Yusuf'un Austria-Jordan 3-1 bitti notu sonrası kaynaklar yeniden kontrol edildi ve 1 ek final skor eklendi: Austria 3-1 Jordan. **Changed:** `worldcup-fixtures/index.html` içindeki Austria-Jordan `M` satırı 8 alanlı `FT` satıra çevrildi; `SCORE_UPDATED` `17 Jun 2026, 08:48 CEST` yapıldı. **QA:** ABC score centre ve FOX Sports box score/highlight başlığı Austria 3-1 Jordan sonucunu doğruladı; Guardian hâlâ eski 2-1 özet gösterdiği için not edildi. Inline JS parse smoke 72 maç / 20 skorlu satır geçti; Playwright desktop ve 390px mobilde `.bw-match.final` = 20, Austria 3-1 Jordan görünür, horizontal overflow = 0; `git diff --check` temiz. **Opened:** Live GitHub Pages için push/deploy gerekiyor. **Closed:** Austria-Jordan yerel widget kaynak dosyasında 3-1 olarak güncel.

## 2026-06-17 — Codex (World Cup fixtures morning scores)

**Did:** World Cup fixtures widget için Berlin saati 08:32 skor kontrolünde 2 yeni final skor eklendi: Iraq 1-4 Norway ve Argentina 3-0 Algeria. **Changed:** `worldcup-fixtures/index.html` içindeki iki `M` satırı 8 alanlı `FT` satıra çevrildi; `SCORE_UPDATED` `17 Jun 2026, 08:32 CEST` yapıldı. Austria-Jordan güncellenmedi çünkü ABC score centre 3-1, Guardian live/report özeti 2-1 gösterdi. **QA:** FIFA match centre skor metnini güvenilir expose etmedi; Iraq-Norway ABC/ESPN/Guardian ile, Argentina-Algeria ABC/Guardian ile doğrulandı; inline JS parse smoke 72 maç / 19 skorlu satır geçti; Playwright desktop ve 390px mobilde `.bw-match.final` = 19, yeni skorlar görünür, Austria-Jordan final görünmez, horizontal overflow = 0; `git diff --check` temiz. **Opened:** Live GitHub Pages için push/deploy gerekiyor; Austria-Jordan kaynak çatışması sonraki kontrolde tekrar ele alınmalı. **Closed:** 17 Haziran sabah doğrulanmış skorları yerel widget kaynak dosyasında güncel.

## 2026-06-17 — Codex (Daily blog draft: Berlin with Kids)

**Did:** Created local widget/blog assets for unpublished Wix draft `Berlin with Kids: What to Do, Where to Stay and How to Plan an Easy Family Day`. **Changed:** Added `blog-drafts/berlin-with-kids.md`, image/source pack under `blog-drafts/images/berlin-with-kids/`, Quick Summary/FAQ key `berlin-with-kids`, regenerated `faq/inject.js`, added post widget `berlin-family-day-planner/`, wired `tools-hub/data.json`, added dedicated glossy icon files/manifests for `berlin-family-day-planner`, uploaded the icon to Wix Media as `5a08a3_972a80fe25f1418a8ac591c814ca7f73~mv2.png`, and updated BerlinTools layout icon map revision 23. Wix draft ID `449d53c6-7d7d-400a-9f71-0a6c30fcb2fe` remains `UNPUBLISHED`; BerlinTools CMS item `2419eefe-ceb5-4421-a3c6-8bec6398da65` was created. **QA:** Local widget Playwright QA passed desktop and 390px mobile with overflow 0; JSON/JS checks passed; Wix readback confirmed 3 embeds, cover + 2 inline images, alt text, SEO/social/canonical/robots/BlogPosting fields. **Opened:** Push/deploy this repo before Wix preview/live embeds serve the new QS/FAQ/widget/icon assets from GitHub Pages. **Closed:** Local widget/tool assets for the Berlin with Kids draft are ready.

## 2026-06-16 — Codex (World Cup fixtures late score)

**Did:** World Cup fixtures widget için Berlin saati 23:31 skor kontrolünde 1 yeni final skor eklendi: France 3-1 Senegal. **Changed:** `worldcup-fixtures/index.html` içindeki France-Senegal `M` satırı 8 alanlı `FT` satıra çevrildi; `SCORE_UPDATED` `16 Jun 2026, 23:31 CEST` yapıldı. **QA:** FIFA match centre sayfası kontrol edildi ama metin içinde final skor expose etmedi; ESPN final score ve Guardian live page France 3-1 Senegal sonucunu doğruladı; inline JS parse smoke 72 maç / 17 skorlu satır geçti; yerel Browser QA desktop ve 390px mobilde `.bw-match.final` = 17, France-Senegal 3-1 görünür, horizontal overflow = 0, konsol hatası yok; `git diff --check` temiz. **Opened:** Live GitHub Pages için push/deploy gerekiyor. **Closed:** 16 Haziran geç akşam skoru yerel widget kaynak dosyasında güncel.

## 2026-06-16 — Codex (BerlinTools hub reveal fix)

**Did:** Diagnosed `/berlin-tools` cards disappearing after `Alexanderplatz Parking Map` as a tall-category reveal-animation bug, not missing tool data. **Changed:** `tools-hub/tools-hub-element.js` now uses `IntersectionObserver` `{ rootMargin: '0px 0px 160px 0px', threshold: 0.01 }` instead of `threshold: 0.3`, so very tall categories such as Maps/Discovery can reveal on desktop and mobile. **QA:** Live `/berlin-tools` data/DOM contained all 53 cards; local QA at 1280px and 390px confirmed Maps and Discovery sections become `visible` after scroll, post-Alexanderplatz cards including Vegan Berlin Top Picks and Berlin Station Arrival Planner are present, overflow `0`, Playwright console clean; `node --check tools-hub/tools-hub-element.js` and `git diff --check` passed. **Opened:** Push/deploy this repo and hard-refresh live `/berlin-tools` on desktop/mobile after GitHub Pages cache. **Closed:** Local BerlinTools hub reveal fix is ready.

## 2026-06-16 — Codex (Trip Planner back + compact update CTA)

**Did:** Implemented Yusuf's preferred Trip Planner post-result edit flow: users can now go back through quiz questions after seeing a plan, change an answer, and use a compact final-step `Update preview` CTA. **Changed:** `ultimate-berlin-trip-planner/index.html` fixes Back button contrast, adds dirty-plan state, keeps the existing preview visible after answer changes, disables the lead unlock as `Update preview first` while answers are dirty, changes the final CTA to small `Update preview`, and restores disabled `Preview is current` after updating. **QA:** Inline JS parse and `git diff --check` passed; launch audit still has the same 5 unrelated pre-existing blockers. Local Playwright 390px flow passed: build, Back to Step 11, change pace, return to Step 12, small `Update preview`, lead disabled until update, update restores `Save full plan + PDF`, overflow `0`; local console errors were expected CORS blocks from `127.0.0.1` to live `tp-event`. QA screenshot: `output/qa/ultimate-trip-planner-ui/back-update-20260616/dirty-final-mobile.png`. **Opened:** Push/deploy this repo, then verify live `/berlin-trip-planner`. **Closed:** None.

## 2026-06-16 — Codex (Berlin Battle cleanup + Food aligned)

**Did:** Yusuf flagged the extra page/home promo layers as unnecessary and Food Battle as visually inconsistent, so the dedicated Games page and homepage teaser were simplified and Food Battle was regenerated in the same grounded editorial style as the other modes. **Changed:** New Food source sheets `berlin-battle/assets/source/editorial-20260616/sheets/food-batch-*.png`, new Food card WebPs in `berlin-battle/assets/cards/*.webp`, refreshed `berlin-battle/assets/topics/food-battle-cover.webp`, updated contact sheets, `scripts/crop-berlin-battle-editorial-assets.py` now writes all 64 cards + 4 covers, `berlin-battle/data.json` version is `2026-06-16-editorial-all-battles`, `berlin-battle/index.html` asset build is `editorial-all-battles-20260616`, `berlin-battle-page/` now removes the extra route CTA and topic-card hero collage, and `berlin-battle-home/` now removes the proof-chip row plus large green preview panel. **QA:** Built-in `image_gen` only; no CLI/API fallback. Crop script wrote 64 cards + 4 covers; JS syntax checks, JSON/image dimension checks, and `git diff --check` passed; local Chrome QA passed `/berlin-battle/`, `/berlin-battle-page/`, and `/berlin-battle-home/` at desktop and 390px mobile with image failures `0`, horizontal overflow `0`, removed UI text absent, and Food Battle in-game cards loading from the new version. **Opened:** Push/deploy this repo, then verify live `/games/berlin-battle` and homepage teaser in Wix. **Closed:** Local cleanup and Food visual alignment complete.

## 2026-06-16 — Codex (Berlin Battle editorial refresh + page/home)

**Did:** Berlin Battle District, Museum, and Night visuals were refreshed in Yusuf's preferred grounded editorial illustration style, then the dedicated Games page wrapper and homepage teaser were revised to use that tangible card language instead of the older futuristic/food-preview direction. **Changed:** New/updated WebP assets under `berlin-battle/assets/cards/{districts,museums,night}/`, topic covers under `berlin-battle/assets/topics/`, source sheets/contact sheets under `berlin-battle/assets/source/editorial-20260616/`, crop script `scripts/crop-berlin-battle-editorial-assets.py`, prompt notes, `berlin-battle/data.json` version, `berlin-battle/index.html` asset build, `berlin-battle-page/README.md`, `berlin-battle-page/berlin-battle-page-element.js`, and `berlin-battle-home/berlin-battle-home-element.js`; Food Battle art was intentionally unchanged. **QA:** Crop script wrote 48 cards + 3 covers; JS syntax checks and `git diff --check` passed; local Chrome QA passed `/berlin-battle/`, `/berlin-battle-page/`, and `/berlin-battle-home/` at desktop and 390px mobile with image failures `0`, old homepage `15 picks` wording absent, and horizontal overflow `0` (only local favicon 404 noise). **Opened:** Push/deploy this repo, then verify live `/games/berlin-battle` and the homepage teaser in Wix. **Closed:** Local editorial art refresh plus page/home section revisions are ready.

## 2026-06-16 — Codex (World Cup fixtures morning scores)

**Did:** World Cup fixtures widget için Berlin saati 08:32 skor kontrolünde 2 yeni final skor eklendi: Saudi Arabia 1-1 Uruguay ve Iran 2-2 New Zealand. **Changed:** `worldcup-fixtures/index.html` içindeki iki `M` satırı 8 alanlı `FT` satıra çevrildi; `SCORE_UPDATED` `16 Jun 2026, 08:32 CEST` yapıldı. **QA:** Saudi Arabia-Uruguay sonucu FIFA match report/schedule snippet + Guardian/ESPN ile, Iran-New Zealand sonucu FIFA match report + Guardian/ESPN ile doğrulandı; inline JS parse smoke 72 maç / 16 skorlu satır geçti; Playwright desktop ve 390px mobilde `.bw-match.final` = 16 ve horizontal overflow = 0; tek konsol hatası favicon 404; `git diff --check` temiz. **Opened:** Live GitHub Pages için push/deploy gerekiyor. **Closed:** 16 Haziran sabah skorları yerel widget kaynak dosyasında güncel.

## 2026-06-16 — Codex (Homepage PageSpeed fixes)

**Did:** Implemented the first safe repo-side PageSpeed improvement batch for the homepage/mobile report. **Changed:** `hero-home/hero-home-element.js` now reserves stable mobile/tablet hero height, declares hero image dimensions, sets high fetch priority, injects a responsive hero image preload, and leaves mobile bottom clearance for the live sticky booking/trip-planner bar; `site-header/site-header-element.js` and `site-footer/site-footer-element.js` now declare logo intrinsic dimensions; `route/data.json` and `route/route-element.js` now serve generated WebP route-map variants (`720w`, `960w`, `1200w`) through responsive `srcset`/`sizes` with intrinsic dimensions, leaving the old PNGs as source/fallback assets. **QA:** JS syntax checks, `route/data.json` parse, and `git diff --check` passed; local Browser QA passed hero/header/footer/route desktop and 390px mobile with horizontal overflow `0`, complete images, expected dimensions, and inspected mobile screenshots. Live Chrome smoke on `berlinwalk.com` confirmed hero/header/route/footer render, mobile/desktop overflow `0`, mobile hero selects 800w and route selects 720w. **Opened:** After deploy/cache, rerun PageSpeed mobile and only add a Wix HEAD wrapper reserve if CLS still points at the homepage custom-element wrapper. **Closed:** First safe PageSpeed fix batch is implemented.

## 2026-06-16 — Codex (Homepage PageSpeed audit)

**Did:** Parsed Yusuf's new PageSpeed mobile rerun for `https://www.berlinwalk.com/` (`5opkpsi2zl`, mobile Lighthouse fetch `2026-06-16T06:08:23.641Z`). **Changed:** No widget code changed; repo already had unrelated Berlin Battle working-tree changes and those were left untouched. **QA:** Mobile report scored Performance 41 / Accessibility 90 / Best Practices 96 / SEO 100 with FCP 3.5s, LCP 17.4s, TBT 150ms, CLS 0.392, Speed Index 7.7s; desktop scored Performance 50. Main widget-side targets are `hero-home/hero-home-element.js` reserving first-viewport space and explicit image dimensions, `site-header/site-header-element.js` logo sizing/reflow, `route/assets/berlin-mitte-illustration@2x.png` at ~1.14 MB with ~1.10 MB image-delivery savings, `gallery/images/hero-home-museum-island-800w.webp` compression, and below-fold booking/calendar/widget load deferral. **Opened:** If performance work starts, first implement CLS fixes and image variants in a clean commit separate from the existing Berlin Battle edits. **Closed:** None.

## 2026-06-16 — Codex (Hauptbahnhof widget deploy verified)

**Did:** Verified Yusuf's publish/deploy follow-up for the Hauptbahnhof blog/tool set. **Changed:** No widget code changes; repo was clean and `main` matched `origin/main`. **QA:** GitHub Pages returned 200 for `berlin-station-arrival-planner`, Quick Summary and FAQ with `Last-Modified: Tue, 16 Jun 2026 04:24:38 GMT`; live Wix post contains all 3 widget iframes; live `/tools/berlin-station-arrival-planner` loads the station planner iframe after Wix late render; live `/berlin-tools` card links to the tool and displays dedicated icon `5a08a3_005e1b31e1b64d03a5c6b8cdc4ea2136~mv2.png` with real horizontal overflow 0. **Opened:** None. **Closed:** Hauptbahnhof widget/tool deployment is verified live.

## 2026-06-16 — Codex (Daily blog draft: Berlin Hauptbahnhof Guide)

**Did:** Created local widget/blog assets for unpublished Wix draft `Berlin Hauptbahnhof Guide: Arrival, Tickets, Luggage and What to Do First`. **Changed:** Added `blog-drafts/berlin-hauptbahnhof-guide.md`, image/source pack under `blog-drafts/images/berlin-hauptbahnhof-guide/`, Quick Summary/FAQ key `berlin-hauptbahnhof-guide`, regenerated `faq/inject.js`, added post widget `berlin-station-arrival-planner/`, wired `tools-hub/data.json`, and added dedicated ChatGPT-browser icon files/manifests for `berlin-station-arrival-planner`. Wix draft ID `7298f86f-7ed4-42c2-a939-5b204a5f845a` remains `UNPUBLISHED`; BerlinTools CMS item `0e5cc8ee-ff2a-4472-9935-f61b0c34d3a2` and Layout Fixes icon map revision 22 were created/updated. **QA:** Local widget Browser QA passed desktop and 390px mobile with overflow 0; JSON/JS checks passed; Wix readback confirmed 3 embeds, 3 images including cover, alt text, SEO/social/canonical/robots/BlogPosting fields. **Opened:** Push/deploy this repo before Wix preview/live embeds serve the new QS/FAQ/widget/icon assets from GitHub Pages. **Closed:** Local widget/tool assets for the Hauptbahnhof draft are ready.

## 2026-06-15 — Codex (World Cup fixtures final scores)

**Did:** World Cup fixtures widget için Berlin saati 23:31 skor kontrolünde 2 yeni final skor eklendi: Spain 0-0 Cape Verde ve Belgium 1-1 Egypt. **Changed:** `worldcup-fixtures/index.html` içindeki iki `M` satırı 8 alanlı `FT` satıra çevrildi; `SCORE_UPDATED` `15 Jun 2026, 23:31 CEST` yapıldı. **QA:** Spain-Cape Verde sonucu FIFA match report + Guardian/Fox ile, Belgium-Egypt sonucu Guardian + Outlook/The Times snippet ile doğrulandı; inline JS parse smoke 72 maç / 14 skorlu satır geçti; Playwright desktop ve 390px mobilde `.bw-match.final` = 14 ve horizontal overflow = 0; `git diff --check` temiz. **Opened:** Live GitHub Pages için push/deploy gerekiyor. **Closed:** 15 Haziran akşam skorları yerel widget kaynak dosyasında güncel.

## 2026-06-15 — Codex (Blog featured mix corrected)

**Did:** Rebalanced the full `/blog` featured area and homepage blog teaser after Yusuf asked for a mix of current topics, popular posts, and latest posts without duplicating the two surfaces. **Changed:** `scripts/generate-blog-index-data.mjs` now pins `/blog` hero curation to Public Holidays lead plus World Cup, Public Transport, Berlin Wall, Taxi, and City Tax; `blog-index/data.json` was regenerated from the Wix Blog API with 126 posts; `blog-index/blog-index-element.js` no longer hardcodes the old Vegan Guide featured override; `blog-home/data.json` now shows Pfand as feature plus Tipping in Berlin, Public Toilets, and Berlin founding year 1237; Wix Custom Embed `BerlinWalk Blog Featured Posts` (`7b593b94-45e8-4bcf-a002-ec308a52f37d`) was updated to revision 5 after live `/blog` still showed the old Free Walking Tour bridge. **QA:** `node --check` passed for generator/index/home elements; both JSON files parse; local cache-busted Browser QA passed at desktop and 390px mobile with horizontal overflow `0`, correct `/blog` lead/rail order, correct homepage teaser order, and no overlap between the two featured surfaces. GitHub Pages serves the new data/scripts; live cache-busted QA passed with `/blog` lead Public Holidays and rail World Cup/Public Transport/Berlin Wall/Taxi/City Tax, homepage feature Pfand and cards Tipping/Public Toilets/1237, and overflow `0` on both. **Opened:** None. **Closed:** Featured blog mix is corrected and live.

## 2026-06-15 — Codex (Old blog refresh: Spree River live, audit complete)

**Did:** Completed and deployed the Spree River old-blog refresh and closed the no-widget audit queue. **Changed:** Added `blog-drafts/_refresh/spree-river.md`; added Quick Summary + FAQ key `spree-river-berlin` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; embedded existing `berlin-boat-tour-finder`; pushed remote commit `fabf2da Refresh Spree River widgets`. Wix post `bf6c01b5-9a80-421a-8228-7d57f981015c` was patched and published with refreshed source-backed body, existing Spree skyline cover plus existing Museum Island/Spree canal image, Berlin.de/VisitBerlin/WSA source links, internal Best Views/Liebknecht/Friedrichsbruecke/Museum Island/boat tours and booking links, CTA and SEO/social tags; the old collective CTA was removed and Cold War river-border wording was made more careful. **QA:** Update dry-run passed with 2 images, 3 embeds, 2453 Ricos-visible words, no em dash, no public collective and no bad duration; GitHub Pages serves the no-query QS/FAQ keys; publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, old collective CTA removed, public collective absent, bad duration absent, robots, canonical, `og:image`, QS, boat finder, FAQ, both images, source/internal/booking links, `Spree River`, `Berlin`, `Coelln`, `Spree Island`, `Museum Island`, `Nikolaiviertel`, `Humboldt Forum`, `Liebknecht Bridge`, `Friedrichsbruecke`, `Berliner Dom`, `TV Tower`, `Cold War`, `Spree-Oder-Wasserstrasse`, `boat tour`, `Alexanderplatz`, `Hackescher Markt`, `2 hours`, and `12 stops`; live page has ~2558 visible words. Final no-widget audit now shows 0 / 126 published posts without in-post widgets. **Opened:** None for this queue. **Closed:** Spree River is no longer in the no-widget audit; old no-widget refresh queue is complete.

## 2026-06-15 — Codex (Old blog refresh: Free Walking Tour Explainer live)

**Did:** Completed and deployed the Free Walking Tour Explainer old-blog refresh. **Changed:** Added `blog-drafts/_refresh/free-walking-tour-explainer.md`; added Quick Summary + FAQ key `free-walking-tour-explainer` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; embedded existing `berlin-tip-calculator`; pushed remote commit `abfd5bc Refresh free walking tour explainer widgets`. Wix post `83267069-e310-4877-9aa1-85c420953b7f` was patched and published with refreshed source-backed body, existing walking-tour cover plus reused tip/cash image, Berlin.de/Free Tour Community/SANDEMANs source links, internal tipping/credit-card/Alexanderplatz and booking links, CTA and SEO/social tags; the old collective CTA, `1.5 to 2.5 hours` and `1 hour 45 minutes` duration copy were removed. **QA:** Update dry-run passed with 2 images, 3 embeds, 2441 Ricos-visible words, no em dash, no public collective and no bad duration; GitHub Pages serves the no-query QS/FAQ keys; publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, old collective CTA removed, public collective absent, bad duration absent, robots, canonical, `og:image`, QS, tip calculator, FAQ, both images, source/internal/booking links, `free walking tour`, `tip-based`, `no fixed upfront price`, `2 hours`, `12 stops`, `EUR 10-15`, `EUR 5`, `EUR 20`, `cash`, `Berlin.de`, `5-10 percent`, `Free Tour Community`, `SANDEMANs`, `World Clock`, `Alexanderplatz`, and `Hackescher Markt`; live page has ~2551 visible words. Rerun no-widget audit now shows 1 / 126 published posts without in-post widgets. **Opened:** Continue with `The Spree River: The Waterway That Built Berlin` as the final no-widget post. **Closed:** Free Walking Tour Explainer is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Best Views in Berlin live)

**Did:** Completed and deployed the Best Views in Berlin old-blog refresh. **Changed:** Added `blog-drafts/_refresh/best-views-foot.md`; added Quick Summary + FAQ key `best-views-foot` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; embedded existing `berlin-landmarks-map`; pushed remote commit `1415e21 Refresh best Berlin views widgets`. Wix post `fef7e14a-bbca-4f2d-a418-b976c1925550` was patched and published with refreshed source-backed body, existing Berliner Dom/Spree night cover plus existing Berliner Dom/TV Tower night image, official Bundestag/Berliner Dom/Berlin.de/VisitBerlin source links, internal Liebknecht/Reichstag/TV Tower/photo spots/free things and booking links, CTA and SEO/social tags; the old collective CTA and `1 hour 45 minutes` duration were removed. **QA:** Update dry-run passed with 2 images, 3 embeds, 2707 Ricos-visible words, no em dash, no public collective and no bad duration; GitHub Pages serves the no-query QS/FAQ keys; publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, old collective CTA removed, public collective absent, bad duration absent, robots, canonical, `og:image`, QS, landmarks map, FAQ, both images, source/internal/booking links, `Liebknecht Bridge`, `Berliner Dom`, `Humboldt Forum`, `Spree`, `Museum Island`, `Friedrichsbruecke`, `Altes Museum`, `Neptune Fountain`, `Rotes Rathaus`, `St. Mary's Church`, `TV Tower`, `Alexanderplatz`, `Reichstag dome`, `advance registration`, `21:45`, `270 steps`, `50 metres`, `Oberbaum Bridge`, `Viktoriapark`, `2 hours`, and `12 stops`; live page has ~2804 visible words. Rerun no-widget audit now shows 2 / 126 published posts without in-post widgets. **Opened:** Continue with `What Is a Free Walking Tour? How Tip-Based Tours Actually Work` as the next highest-view no-widget post. **Closed:** Best Views in Berlin is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Neptune Fountain live)

**Did:** Completed and deployed the Neptune Fountain old-blog refresh. **Changed:** Added `blog-drafts/_refresh/neptune-fountain.md`; added Quick Summary + FAQ key `neptune-fountain-berlin` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; embedded existing `berlin-landmarks-map`; pushed remote commit `c0bfe03 Refresh Neptune Fountain widgets`. Wix post `4f2c9a94-221b-4ec9-8d89-54af739f6bfd` was patched and published with refreshed source-backed body, existing BerlinWalk Neptune cover and inline image, Berlin.de/Bezirksamt Mitte/Commons source links, internal Rotes Rathaus/St. Mary's/Alexanderplatz/TV Tower/Lost Neighborhood/Humboldt Forum links, booking CTA and SEO/social tags; the old hidden-gem/collective-style wording was removed. **QA:** Update dry-run passed with 2 images, 3 embeds, 2508 Ricos-visible words, no em dash, no public collective and no bad duration; GitHub Pages serves the no-query QS/FAQ keys; publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, old collective CTA removed, public collective absent, bad duration absent, robots, canonical, `og:image`, QS, landmarks map, FAQ, both images, source/internal/booking links, `Neptune Fountain`, `Neptunbrunnen`, `Reinhold Begas`, `1891`, `1888`, `Neobarock`, `Berlin Palace`, `Humboldt Forum`, `Rotes Rathaus`, `St. Mary's Church`, `TV Tower`, `Alexanderplatz`, `Rhine`, `Elbe`, `Oder`, `Vistula`, `1946`, `1950`, `1969`, `EUR 1.2 million`, `end of 2026`, `2 hours`, and `12 stops`; live page has ~2600 visible words. Rerun no-widget audit now shows 3 / 126 published posts without in-post widgets. **Opened:** Continue with `The Best Views in Berlin You Can Find on Foot` as the next highest-view no-widget post. **Closed:** Neptune Fountain is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Free Walking Tour Tip live)

**Did:** Completed and deployed the free walking tour tipping old-blog refresh. **Changed:** Added `blog-drafts/_refresh/free-walking-tour-tip.md`; added Quick Summary + FAQ key `free-walking-tour-tip` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; embedded existing `berlin-tip-calculator`; pushed remote commit `e19cb75 Refresh free walking tour tipping widgets`. Wix post `53b04bfb-00f8-40a2-8974-c5ee1e1ff203` was patched and published with refreshed source-backed body, existing tip-jar cover plus reused Berlin Mitte courtyard image, Berlin.de/Free Tour Community/SANDEMANs source links, internal tipping/credit-card links, booking CTA and SEO/social tags; the old collective CTA and generic confused-person cover were removed. **QA:** Update dry-run passed with 2 images, 3 embeds, 2469 Ricos-visible words, no em dash, no public collective and no bad duration; GitHub Pages serves the no-query QS/FAQ keys; publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, old collective CTA removed, public collective absent, bad duration absent, robots, canonical, `og:image`, QS, tip calculator, FAQ, both images, source/internal/booking links, `free walking tour`, `tip-based`, `Berlin`, `EUR 10-15`, `EUR 5`, `EUR 20`, `2 hours`, `12 stops`, `cash`, `Berlin.de`, `5-10%`, `Free Tour Community`, `SANDEMANs`, `Berlin tipping guide`, and `credit cards in Berlin`; live page has ~2567 visible words. Rerun no-widget audit now shows 4 / 126 published posts without in-post widgets. **Opened:** Continue with `Neptune Fountain: The Baroque Masterpiece That Moved Across Berlin` as the next highest-view no-widget post. **Closed:** Free Walking Tour Tip is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Museum Island Prussia live)

**Did:** Completed and deployed the Museum Island Prussia old-blog refresh. **Changed:** Added `blog-drafts/_refresh/museum-island-prussia.md`; added Quick Summary + FAQ key `museum-island-prussia` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; embedded existing `museum-island-map`; pushed remote commit `3d32a77 Refresh Museum Island Prussia widgets`. Wix post `7fe9e709-9fcb-48f9-b3bb-27a0c73ce2b3` was patched and published with refreshed source-backed body, existing Spree/Museum Island cover plus reused Altes Museum 1930 and war-damaged Neues/Altes images, UNESCO/SMB/Museumsinsel/visitBerlin source links, internal Museum Island before-after/free guide links, booking CTA and SEO/social tags; the old collective CTA was removed. **QA:** Update dry-run passed with 3 images, 3 embeds, 2490 Ricos-visible words, no em dash, no public collective and no bad duration; GitHub Pages serves the no-query QS/FAQ keys; publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, old collective CTA removed, public collective absent, bad duration absent, robots, canonical, `og:image`, QS, museum island map, FAQ, all 3 images, source/internal/booking links, `Museum Island`, `Prussia`, `Altes Museum`, `Neues Museum`, `Alte Nationalgalerie`, `Bode-Museum`, `Pergamonmuseum`, `UNESCO`, `1824`, `1930`, `1830`, `1822`, `Friedrich August Stüler`, `1841`, `Sanctuary for Art and Science`, `1999`, `James-Simon-Galerie`, `Archaeological Promenade`, `4 June 2027`, `EUR 24`, `2 hours`, and `12 stops`; live page has ~2588 visible words. Rerun no-widget audit now shows 5 / 126 published posts without in-post widgets. **Opened:** Continue with `How Much Should You Tip on a Free Walking Tour in Berlin?` as the next highest-view no-widget post. **Closed:** Museum Island Prussia is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Berliner Dom survived live)

**Did:** Completed and deployed the Berliner Dom survived old-blog refresh. **Changed:** Added `blog-drafts/_refresh/berliner-dom-survived.md`; added Quick Summary + FAQ key `berliner-dom-survived` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; embedded existing `museum-island-map`; pushed remote commit `4dfc007 Refresh Berliner Dom survived widgets`. Wix post `8708b3a7-39e4-4867-b699-a4b925348d84` was patched and published with refreshed source-backed body, existing cover plus reused 1905 historic and 1944 wartime-damage images, official Berliner Dom/Berlin.de source links, internal Berliner Dom before-after/Liebknecht/Humboldt Forum/Altes Museum/Museum Island links, booking CTA and SEO/social tags; the old collective CTA was removed. **QA:** Update dry-run passed with 3 images, 3 embeds, 2704 Ricos-visible words, no em dash, no public collective and no bad duration; GitHub Pages serves the no-query QS/FAQ keys; publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, old collective CTA removed, public collective absent, bad duration absent, robots, canonical, `og:image`, QS, museum island map, FAQ, all 3 images, source/internal/booking links, `Berliner Dom`, `Berlin Cathedral`, `Museum Island`, `Lustgarten`, `Kaiser Wilhelm II`, `Julius Carl Raschdorff`, `1893`, `27 February 1905`, `114 metres`, `98 metres`, `Denkmalskirche`, `Hohenzollern Crypt`, `1 March 2026`, `24 May 1944`, `25 percent`, `1975`, `1983`, `1993`, `1999`, `2002`, `2007`, `50 metres`, `270 steps`, `EUR 15`, `EUR 12`, `EUR 11`, `9:00 to 18:00`, `9:00 to 19:00`, `12:00 to 17:00`, `1.5 hours`, `2 hours`, and `12 stops`; live page has ~2804 visible words. Rerun no-widget audit now shows 6 / 126 published posts without in-post widgets. **Opened:** Continue with `Museum Island: Why Prussia Built an Entire Island of Museums` as the next highest-view no-widget post. **Closed:** Berliner Dom survived is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Altes Museum live)

**Did:** Completed and deployed the Altes Museum old-blog refresh. **Changed:** Added `blog-drafts/_refresh/altes-museum.md`; added Quick Summary + FAQ key `altes-museum-berlin` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; embedded existing `museum-island-map`; pushed remote commit `31ea979 Refresh Altes Museum widgets`. Wix post `31d7f147-72db-4e68-aae0-77b91cffaec4` was patched and published with refreshed source-backed body, existing cover plus reused Lustgarten/Altes Museum 1900 and Altes Museum 1930 images, official SMB/Museum Island/Museumsportal source links, internal Lustgarten/Museum Island/Neues Museum/Alte Nationalgalerie/Berliner Dom/Friedrichsbrücke links, booking CTA and SEO/social tags; the old collective CTA was removed. **QA:** Update dry-run passed with 3 images, 3 embeds, 2826 Ricos-visible words, no em dash, no public collective and no bad duration; GitHub Pages serves the no-query QS/FAQ keys; publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, old collective CTA removed, public collective absent, bad duration absent, robots, canonical, `og:image`, QS, museum island map, FAQ, all 3 images, source/internal/booking links, `Altes Museum`, `Museum Island`, `Lustgarten`, `Karl Friedrich Schinkel`, `1830`, `1828`, `18 Ionic`, `Pantheon`, `Friedrich Wilhelm III`, `Antikensammlung`, `Ancient Worlds. Greeks, Etruscans and Romans`, `Münzkabinett`, `Praying Boy`, `Berlin Goddess`, `Caesar`, `Cleopatra`, `World War II`, `1958`, `1966`, `1998`, `EUR 14`, `EUR 24`, `10:00 to 17:00`, `10:00 to 18:00`, `2 hours`, and `12 stops`; live page has ~2924 visible words. Rerun no-widget audit now shows 7 / 126 published posts without in-post widgets. **Opened:** Continue with `The Berliner Dom: A Cathedral That Survived Everything` as the next highest-view no-widget post. **Closed:** Altes Museum is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Friedrichsbrücke live)

**Did:** Completed and deployed the Friedrichsbrücke old-blog refresh. **Changed:** Added `blog-drafts/_refresh/friedrichsbruecke.md`; added Quick Summary + FAQ key `friedrichsbruecke-berlin` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; embedded existing `berlin-landmarks-map`; pushed remote commit `2a6bab0 Refresh Friedrichsbruecke widgets`. Wix post `c7ceeb1c-83ec-4b80-b51e-6440608d1529` was patched and published with refreshed source-backed body, existing cover plus uploaded 1906 public-domain postcard image, Denkmaldatenbank/Berlin-Lexikon/visitBerlin/Commons source links, internal Liebknecht/BER Dom/Alte Nationalgalerie/Altes Museum/Museum Island/Hackescher links, booking CTA and SEO/social tags; the old collective CTA was removed. **QA:** Update dry-run passed with 2 images, 3 embeds, 2454 Ricos-visible words, no em dash, no public collective and no bad duration; GitHub Pages serves the no-query QS/FAQ keys; publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, old collective CTA removed, public collective absent, bad duration absent, robots, canonical, `og:image`, QS, landmarks map, FAQ, both images, source/internal/booking links, `Friedrichsbrücke`, `Museum Island`, `Bodestraße`, `Burgstraße`, `1703`, `Große Pomeranzenbrücke`, `1769`, `Johann Boumann`, `1790`, `1792`, `Frederick II`, `1822/23`, `1873-1875`, `Johann Eduard Jacobsthal`, `9.90 metres`, `16 metres`, `1893/94`, `1945`, `1950/51`, `1982`, `12.50 metres`, `2012`, `2014`, `Spree`, `Berliner Dom`, `Hackescher Markt`, `2 hours`, and `12 stops`; live page has ~2541 visible words. Rerun no-widget audit now shows 8 / 126 published posts without in-post widgets. **Opened:** Continue with `The Altes Museum: How One Building Made Berlin a Cultural Capital` as the next highest-view no-widget post. **Closed:** Friedrichsbrücke is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Alte Nationalgalerie live)

**Did:** Completed and deployed the Alte Nationalgalerie old-blog refresh. **Changed:** Added `blog-drafts/_refresh/alte-nationalgalerie.md`; added Quick Summary + FAQ key `alte-nationalgalerie-berlin` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; embedded existing `museum-island-map`; pushed remote commit `bfa9471 Refresh Alte Nationalgalerie widgets`. Wix post `3f57e550-0fe2-4439-8c54-64d333715a2f` was patched and published with refreshed source-backed body, existing cover plus war-damage image, official SMB/Museum Island/Museumsportal source links, internal Museum Island/Neues Museum/Altes Museum/Berliner Dom/Liebknecht links, booking CTA and SEO/social tags; the old collective CTA was removed. **QA:** Update dry-run passed with 2 images, 3 embeds, 2442 Ricos-visible words, no em dash, no public collective and no bad duration; GitHub Pages serves the no-query QS/FAQ keys; publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, old collective CTA removed, public collective absent, bad duration absent, robots, canonical, `og:image`, QS, museum island map, FAQ, both images, source/internal/booking links, `Friedrich August Stüler`, `Johann Heinrich Strack`, `Johann Heinrich Wilhelm Wagener`, `1861`, `1876`, `Caspar David Friedrich`, `Adolph Menzel`, `Hugo von Tschudi`, `1896`, `1944`, `1949`, `1950`, `2001`, `EUR 16`, `EUR 24`, `10:00 to 18:00`, `21 April 2026`, `22 May to 27 September 2026`, `27 October 2026`, `2 hours`, and `12 stops`; live page has ~2541 visible words. Rerun no-widget audit now shows 9 / 126 published posts without in-post widgets. **Opened:** Continue with `Friedrichsbrücke: The Quiet Bridge That Tells Berlin's Entire Story` as the next highest-view no-widget post. **Closed:** Alte Nationalgalerie is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: St. Mary's Church live)

**Did:** Completed and deployed the St. Mary's Church old-blog refresh. **Changed:** Added `blog-drafts/_refresh/st-marys-church.md`; added Quick Summary + FAQ key `st-marys-church-berlin` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; embedded existing `medieval-berlin-mini-walk`; pushed remote commit `3c18f59 Refresh St Marys Church widgets`. Wix post `e108ea2d-35f5-42fa-a4b0-1ceea933aa09` was patched and published with refreshed source-backed body, existing cover plus St. Mary's/TV Tower and Totentanz images, Berlin.de/VisitBerlin/official Marienkirche source links, internal Lost Neighborhood/TV Tower/old town/Alexanderplatz/Rotes Rathaus/Liebknecht/Totentanz links, booking CTA and SEO/social tags; the old collective CTA was removed. **QA:** Update dry-run passed with 3 images, 3 embeds, 2264 Ricos-visible words, no em dash, no public collective and no bad duration; GitHub Pages serves the no-query QS/FAQ keys; publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, old collective CTA removed, public collective absent, bad duration absent, robots, canonical, `og:image`, QS, medieval mini-walk, FAQ, all 3 images, source/internal/booking links, `Marienkirche`, `1292`, `Marienviertel`, `late 1960s`, `22 metres`, `2 metres`, `1484`, `Dance of Death`, `Karl-Liebknecht-Straße 8`, `2 hours`, and `12 stops`; live page has ~2359 visible words. Rerun no-widget audit now shows 10 / 126 published posts without in-post widgets. **Opened:** Continue with `Berlin Alte Nationalgalerie: The Greek Temple on Museum Island That Almost Disappeared` as the next highest-view no-widget post. **Closed:** St. Mary's Church is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Lost Neighborhood live)

**Did:** Completed and deployed the Lost Neighborhood old-blog refresh. **Changed:** The repo was already clean at pushed commit `6c0f393 m`, which contains `blog-drafts/_refresh/berlin-lost-neighborhood.md`, Quick Summary + FAQ key `berlin-lost-neighborhood`, `faq/slug-map.json`, and regenerated `faq/inject.js`; GitHub Pages now serves the no-query QS/FAQ keys. Wix post `10af41e6-6eef-4623-b17e-269758995681` was patched and published with refreshed source-backed body, existing cover plus 3 old-town/Nikolaiviertel images, QS + `medieval-berlin-mini-walk` + FAQ embeds, Berlin.de medieval centre and Marienviertel PDF sources, Nikolaiviertel and Grün Berlin sources, internal TV Tower/Rotes Rathaus/old town/Alexanderplatz/Liebknecht links, booking CTA and SEO/social tags; scratch publish/QA script is `../tmp/publish-lost-neighborhood-qa.mjs`. **QA:** Update dry-run passed with 4 images, 3 embeds, 2472 Ricos-visible words, no em dash, no public collective and no bad duration; publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, old collective CTA removed, public collective absent, bad duration absent, robots, canonical, `og:image`, QS, medieval mini-walk, FAQ, all 4 images, source/internal/booking links, `Marienviertel`, `St. Mary's Church`, `1938`, `late 1960s`, `medieval street plan`, `Zentrumsband`, `Marx-Engels-Forum`, `Neptune Fountain`, `Nikolaiviertel`, `1987`, `750th anniversary`, `7.2 hectare`, `2 hours`, and `12 stops`; live page has ~2557 visible words. Rerun no-widget audit now shows 11 / 126 published posts without in-post widgets. **Opened:** Continue with `St. Mary's Church: The Medieval Survivor in the Shadow of the TV Tower` as the next highest-view no-widget post. **Closed:** Lost Neighborhood is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Lost Neighborhood handoff, not yet live)

**Did:** Paused the old-blog refresh project at Yusuf's request for a new chat handoff; Lost Neighborhood is in progress and not live yet. **Changed:** Added local draft `blog-drafts/_refresh/berlin-lost-neighborhood.md`; added local Quick Summary + FAQ key `berlin-lost-neighborhood` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; scratch scripts outside the repo are `../tmp/add-lost-neighborhood-widgets.mjs` and `../tmp/update-berlin-lost-neighborhood-post.mjs`. Wix target is post `10af41e6-6eef-4623-b17e-269758995681`, slug `/post/berlin-s-lost-neighborhood-what-the-gdr-demolished-to-build-a-socialist-utopia`, existing cover `5a08a3_c3ff467d4f2a4a95af1380c59d80e738~mv2.jpg`, reused old-town media IDs `5a08a3_2311051e8d1249d5b57ad5beebbd337d~mv2.jpg`, `5a08a3_03df61b4abe84ebfbf1e91b3540402df~mv2.jpg`, and `5a08a3_321dddf676004b1097368ae75160bd53~mv2.jpg`; planned embed is `medieval-berlin-mini-walk`. **QA:** Draft raw check now shows ~2818 words, 4 image placeholders, QS + FAQ + widget placeholders, no em dash and no public collective. First update dry-run before final expansion placed all 4 images and 3 embeds, with no voice/duration problems, but refused to patch because Ricos-visible word count was 2189 under the 2400 gate; rerun `source ../scripts/load-api-keys.sh >/dev/null && node ../tmp/update-berlin-lost-neighborhood-post.mjs` before patching. **Opened:** Next session should rerun dry-run, patch Wix draft with `--patch`, commit/push these widget changes, wait for GitHub Pages, publish/live-QA, rerun the no-widget audit, update logs/memory, then send Yusuf an Ara Rapor. **Closed:** Nothing; current audit remains 12 / 126 until this post is published.

## 2026-06-15 — Codex (Old blog refresh: Rotes Rathaus live)

**Did:** Completed and deployed the Rotes Rathaus old-blog refresh. **Changed:** Added `blog-drafts/_refresh/rotes-rathaus.md`; added Quick Summary + FAQ key `rotes-rathaus-berlin` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; embedded existing `berlin-landmarks-map`; pushed remote commit `354e390 Refresh Rotes Rathaus widgets`. Wix post `dceb3c83-2d01-4cae-ae48-bc02a34fd9f6` was patched and published with refreshed ~2.4k-word source-backed body, existing BerlinWalk cover/OG image, 2 uploaded Berlin.de/Landesarchiv historical images (Rotes Rathaus around 1870 and damaged building in 1946), QS + landmarks map + FAQ embeds, Berlin.de visitor page, Berlin Senate Chancellery page, 150 Years PDF, Berlin.de historical image credits, internal TV Tower/old town/Alexanderplatz links, booking CTA and SEO/social tags; the old collective CTA and em-dash SEO title were removed. **QA:** GitHub Pages serves the new key in QS, FAQ, slug-map and `faq/inject.js`; publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, old collective CTA removed, public collective absent, bad duration absent, robots, canonical, `og:image`, QS, landmarks map, FAQ, all 3 article images, source/internal/credit links, booking link, `Rotes Rathaus`, `red brick`, `1861`, `1869`, `Hermann Friedrich Waesemann`, `36 clay panels`, `1877`, `1879`, `1945`, `1991`, `1 October 1991`, `247 rooms`, `2 hours`, and `12 stops`; live page has ~2520 visible words. Rerun no-widget audit now shows 12 / 126 published posts without in-post widgets. **Opened:** Continue with `Berlin's Lost Neighborhood: What the GDR Demolished to Build a Socialist Utopia` as the next highest-view no-widget post. **Closed:** Rotes Rathaus is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Liebknecht Bridge live)

**Did:** Completed and deployed the Liebknecht Bridge old-blog refresh. **Changed:** Added `blog-drafts/_refresh/liebknecht-bridge.md`; added Quick Summary + FAQ key `liebknecht-bridge-view` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; embedded existing `berlin-landmarks-map`; pushed remote commit `0eb1a89 Refresh Liebknecht Bridge widgets`. Wix post `f9ad036e-7c4d-46ac-9bee-2cccd5472f9b` was patched and published with refreshed ~2.6k-word source-backed body, existing Wix/Unsplash cover/OG image, 2 uploaded historical images (Kaiser-Wilhelm-Brücke postcard and 1985 Palasthotel/Spree Bundesarchiv photo), QS + landmarks map + FAQ embeds, Berlin.de/Humboldt Forum/Denkmaldatenbank/1914-1918 Online/DHM/PICRYL/Commons source and credit links, internal Dom/Humboldt/Weltzeituhr/Alexanderplatz/photo/Hackescher links, booking CTA and SEO/social tags; the old collective CTA and em-dash SEO title were removed. **QA:** GitHub Pages serves the new key in QS, FAQ, slug-map and `faq/inject.js`; publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, old collective CTA removed, public collective absent, bad duration absent, robots, canonical, `og:image`, QS, landmarks map, FAQ, all 3 article images, source/internal/credit links, booking link, `Karl-Liebknecht-Brücke`, `Kaiser-Wilhelm-Brücke`, `9 November 1918`, `15 January 1919`, `Palasthotel`, `1985`, `1905`, `2020`, `2 hours`, and `12 stops`; live page has ~2708 visible words. Rerun no-widget audit now shows 13 / 126 published posts without in-post widgets. **Opened:** Continue with `Rotes Rathaus: Why Berlin's City Hall Is Red (And It Has Nothing to Do With Communism)` as the next highest-view no-widget post. **Closed:** Liebknecht Bridge is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: German untranslatable words live)

**Did:** Completed and deployed the German untranslatable words old-blog refresh. **Changed:** Added `blog-drafts/_refresh/german-untranslatable-words.md`; added Quick Summary + FAQ key `german-untranslatable-words` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; embedded the existing `german-phrases-quiz`; pushed remote commit `0bb80c0 Refresh German untranslatable words widgets`. Wix post `2a4e4f4d-29de-4f38-829c-bd10aec5cd9c` was patched and published with refreshed ~2.0k-word visitor-friendly body, existing German-language cover/OG image, QS + German phrases quiz + FAQ embeds, Duden dictionary links for all 7 words, Merriam-Webster context, internal 10 German Words/Berlin slang/Speak German links, booking CTA and SEO/social tags; the old collective CTA was removed. **QA:** GitHub Pages serves the new key in QS, FAQ, slug-map and `faq/inject.js`; publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, old collective CTA removed, public collective absent, bad duration absent, robots, canonical, `og:image`, QS, German phrases quiz, FAQ, article image, all Duden/Merriam-Webster/internal links, booking link, `Feierabend`, `Fernweh`, `Schadenfreude`, `Gemütlichkeit`, `Torschlusspanik`, `Verschlimmbessern`, `Doch`, `Duden`, `2 hours`, and `12 stops`; live page has ~2141 visible words. Rerun no-widget audit now shows 14 / 126 published posts without in-post widgets. **Opened:** Continue with `Liebknecht Bridge: The Best View in Berlin That Nobody Talks About` as the next highest-view no-widget post. **Closed:** German untranslatable words is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Alexanderplatz food live)

**Did:** Completed and deployed the Alexanderplatz food old-blog refresh. **Changed:** Added `blog-drafts/_refresh/alexanderplatz-food.md`; added Quick Summary + FAQ key `alexanderplatz-food` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; embedded the existing `hackescher-after-tour-planner`; pushed remote commit `d1c5f3a Refresh Alexanderplatz food widgets`. Wix post `e07fd249-c0a7-4df6-940a-706378a84d89` was patched and published with refreshed ~2.36k-word practical body, existing cafe/food cover/OG image, 2 newly uploaded images (BerlinWalk Hackescher Markt street scene and BerlinWalk döner food-guide visual), QS + after-tour planner + FAQ embeds, official restaurant/current source links for Curry 61, Dolores, Zeit für Brot, Father Carpenter, Monsieur Vuong, SOY, Sophieneck and Das Lemke, visitBerlin/Berlin.de references, internal food/area/payment/tipping links, booking CTA and SEO/social tags; the old collective CTA and old unsupported price examples were removed. **QA:** GitHub Pages serves the new key in QS, FAQ, slug-map and `faq/inject.js`; publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, old collective CTA removed, old bad price examples absent, public collective absent, bad duration absent, robots, canonical, `og:image`, QS, after-tour planner, FAQ, all 3 article images, all official restaurant/source links, internal links, booking link, `Curry 61`, `Dolores`, `Zeit für Brot`, `Father Carpenter`, `Monsieur Vuong`, `SOY`, `Sophieneck`, `Das Lemke`, `Hackescher Markt`, `2 hours`, and `12 stops`; live page has ~2473 visible words. Rerun no-widget audit now shows 15 / 126 published posts without in-post widgets. **Opened:** Continue with `Feierabend, Fernweh, Schadenfreude: 7 German Words With No English Translation` as the next highest-view no-widget post. **Closed:** Alexanderplatz food is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Weltzeituhr live)

**Did:** Completed and deployed the Weltzeituhr old-blog refresh. **Changed:** Added `blog-drafts/_refresh/weltzeituhr.md`; added Quick Summary + FAQ key `weltzeituhr-berlin` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; embedded the existing `berlin-landmarks-map`; pushed remote commit `985a77c Refresh Weltzeituhr widgets`. Wix post `d96392e3-20a0-4f08-bfe8-62b488a543c0` was patched and published with refreshed ~2.45k-word source-backed body, existing strong blue-hour World Clock/TV Tower cover/OG image, 3 newly uploaded images (1969 installation, 1970 close-up and BerlinWalk daytime World Clock photo), QS + landmarks map + FAQ embeds, Berlin.de/DDR Museum/monument database/internal source links, booking CTA and SEO/social tags; the old collective CTA and old unsupported `148 cities` claim were removed. **QA:** GitHub Pages serves the new key in QS, FAQ, slug-map and `faq/inject.js`; publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, old collective CTA removed, old `148 cities` claim absent, public collective absent, bad duration absent, robots, canonical, `og:image`, QS, landmarks map, FAQ, all 4 article images, source/internal links, booking link, `30 September 1969`, `20th anniversary of the GDR`, `Erich John`, `24 time zones`, `Trabant gearbox`, `wind rose`, `4 November 1989`, `July 2015`, `Alexanderplatz 1`, `2 hours`, `12 stops`, and `green umbrella`; live page has ~2549 visible words. Rerun no-widget audit now shows 16 / 126 published posts without in-post widgets. **Opened:** Continue with `Where to Eat Near Alexanderplatz Without Getting Ripped Off` as the next highest-view no-widget post. **Closed:** Weltzeituhr is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Checkpoint Charlie live)

**Did:** Completed and deployed the Checkpoint Charlie old-blog refresh. **Changed:** Added `blog-drafts/_refresh/checkpoint-charlie.md`; added Quick Summary + FAQ key `checkpoint-charlie-berlin` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; embedded the existing `east-west-1989`; pushed remote commit `d52415f Refresh Checkpoint Charlie widgets`. Wix post `ea030092-9117-488e-8752-2fb7bfde2627` was patched and published with refreshed ~2.6k-word source-backed body, public title changed from the old long generic title to `Checkpoint Charlie: What to See, What to Skip and Why It Still Matters` while preserving the slug, existing strong Checkpoint Charlie cover/OG image, 3 newly uploaded historical images (1961 U.S./Soviet tanks, Allied Museum guardhouse, November 1989 crossing scene), QS + East/West map + FAQ embeds, Berlin.de/Berlin Wall Foundation/Chronicle/visitBerlin/Allied Museum/internal source links, booking CTA and SEO/social tags; the old collective CTA and old inline image were removed. **QA:** GitHub Pages serves the new key in QS, FAQ, slug-map and `faq/inject.js`; publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, old title absent from visible text, old collective CTA removed, public collective absent, bad duration absent, robots, canonical, `og:image`, QS, East/West widget, FAQ, all 4 article images, old inline image absent, source/internal links, booking link, `2 hours`, `12 stops`, `Friedrichstrasse`, `Zimmerstrasse`, `13 August 1961`, `22 October 1961`, `25 October`, `27 October`, `16 hours`, `22 June 1990`, `Allied Museum`, `Bernauer Strasse`, `Tränenpalast`, and `Topography of Terror`; live page has ~2672 visible words. Rerun no-widget audit now shows 17 / 126 published posts without in-post widgets. **Opened:** Continue with `The Weltzeituhr: Why Alexanderplatz Has a World Clock` as the next highest-view no-widget post. **Closed:** Checkpoint Charlie is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Hackescher Markt tour end live)

**Did:** Completed and deployed the Hackescher Markt tour-end old-blog refresh. **Changed:** Added `blog-drafts/_refresh/hackescher-tour-end.md`; added Quick Summary + FAQ key `hackescher-tour-end` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; embedded the existing `hackescher-after-tour-planner`; pushed remote commit `ea47d85 Refresh Hackescher tour end widgets`. Wix post `dda57be3-84a4-417a-82d7-47ed07f98e71` was patched and published with refreshed ~2.2k-word body, public title changed from collective `Where Our Tour Ends` to singular `Where My Tour Ends` while preserving the slug, stronger BerlinWalk Hackescher Markt station cover/OG image, 3 additional uploaded local images (Hackesche Höfe, S-Bahn arches food tables, Haus Schwarzenberg street art), QS + after-tour planner + FAQ embeds, Berlin.de/official Hackesche Höfe/internal source links, booking CTA and SEO/social tags; old generic cover and old collective CTA were removed. **QA:** GitHub Pages serves the new key in QS, FAQ, slug-map and `faq/inject.js`; publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, old title absent from visible text, old collective CTA removed, public collective absent, bad duration absent, robots, canonical, `og:image`, QS, after-tour planner, FAQ, all 4 article images, old generic cover absent, source/internal links, booking link, `2 hours`, `12 stops`, `Hackesche Höfe`, `1906`, `August Endell`, `Haus Schwarzenberg`, `Museum Island`, `Alexanderplatz`, and `Rosenthaler Straße`; live page has ~2230 visible words. Rerun no-widget audit now shows 18 / 126 published posts without in-post widgets. **Opened:** Continue with `Exploring Checkpoint Charlie: A Historical Journey Through Cold War Berlin's Iconic Border Crossing` as the next highest-view no-widget post. **Closed:** Hackescher tour end is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Berlin old town live)

**Did:** Completed and deployed the Berlin old town old-blog refresh. **Changed:** Added `blog-drafts/_refresh/berlin-no-old-town.md`; added Quick Summary + FAQ key `berlin-no-old-town` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; embedded the existing `medieval-berlin-mini-walk`; pushed remote commit `15f0d1a Refresh Berlin old town widgets`. Wix post `5d3b3014-7cae-4fde-a253-7da47b11a617` was patched and published with refreshed ~2.5k-word source-backed body, 3 uploaded/credited Commons images (Nikolaiviertel 1880, Marx-Engels-Platz/Berliner Dom ruins 1951, Nikolaiviertel reconstruction 1986), QS + medieval mini-walk + FAQ embeds, Berlin.de/Humboldt Forum/Berlin-Mitte PDF/Commons/internal source links, booking CTA and SEO/social tags; the old generic skyline cover, old em-dash SEO title and old collective CTA were removed. **QA:** GitHub Pages serves the new key in QS, FAQ, slug-map and `faq/inject.js`; publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, old collective CTA removed, public collective absent, bad duration absent, old em-dash SEO title absent, robots, canonical, `og:image`, QS, medieval mini-walk, FAQ, all 3 article images, old generic cover absent, source/image-credit links, internal links, booking link, `1237`, `1244`, `1230`, `1292`, `600,000 apartments`, `1950/51`, `1976`, `1987`, `Marienviertel`, `Nikolaiviertel`, `Rathausforum`, `2 hours`, and `12 stops`; live page has ~2483 visible words. Rerun no-widget audit now shows 19 / 126 published posts without in-post widgets. **Opened:** Continue with `Hackescher Markt: Where Our Tour Ends and Your Berlin Adventure Begins` as the next highest-view no-widget post. **Closed:** Berlin old town is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Neues Museum live)

**Did:** Completed and deployed the Neues Museum old-blog refresh. **Changed:** Added `blog-drafts/_refresh/neues-museum.md`; added Quick Summary + FAQ key `neues-museum-berlin` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; added new blog-only widget `neues-museum-timeline/`; pushed remote commit `a94c269 Refresh Neues Museum widgets`. Wix post `ed84cd48-6715-41c6-80e1-a21d991f1f64` was patched and published with refreshed ~2.4k-word source-backed body, 3 uploaded/credited Commons images (Nefertiti bust, ruined front facade, restored staircase), QS + Neues Museum timeline + FAQ embeds, Museum Island/David Chipperfield/SMB Nefertiti/SMB visitor/UNESCO/Commons source links, booking CTA and SEO/social tags; the old weak uncredited Nefertiti-only image and old collective CTA were removed. **QA:** GitHub Pages serves the new key in QS, FAQ, slug-map and `faq/inject.js`, plus `neues-museum-timeline/`; local browser QA passed the timeline widget at 1280px and 390px with overflow 0; publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, old collective CTA removed, public collective absent, bad duration absent, robots, canonical, `og:image`, QS, timeline, FAQ, all 3 article images, old weak image absent, source/image-credit links, booking link, `1859`, `1943`, `1945`, `1997`, `2009`, `Nefertiti`, `North Dome Room`, `David Chipperfield`, `Julian Harrap`, `10:00 to 18:00`, `2 hours`, and `12 stops`; live page has ~2538 visible words. Rerun no-widget audit now shows 20 / 126 published posts without in-post widgets. **Opened:** Continue with `Why Berlin Doesn’t Have a Beautiful Old Town (And Why That’s the Point)` as the next highest-view no-widget post. **Closed:** Neues Museum is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Berlin wide streets live)

**Did:** Completed and deployed the Berlin wide streets old-blog refresh. **Changed:** Added `blog-drafts/_refresh/berlin-wide-streets.md`; added Quick Summary + FAQ key `berlin-wide-streets` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; added new blog-only widget `berlin-wide-streets-walk/`; pushed remote commit `0343c28 Refresh Berlin wide streets widgets`. Wix post `0e6e0557-6573-4dc8-8dbc-6b80fdc15db5` was patched and published with refreshed ~2.2k-word source-backed body, 3 uploaded historical/topic-specific images (Karl-Marx-Allee aerial, Kaiser-Wilhelm-Strasse in 1899, Stalinallee construction in 1952), QS + Berlin wide streets mini-walk + FAQ embeds, Berlin.de/Marienviertel/official TV Tower/Karl-Marx-Allee/Wikimedia/Bundesarchiv source links, booking CTA and SEO/social tags; old weak generic images and old collective CTA were removed. **QA:** GitHub Pages serves the new key in QS, FAQ, slug-map and `faq/inject.js`, plus `berlin-wide-streets-walk/`; publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, old collective CTA removed, public collective absent, bad duration absent, robots, canonical, `og:image`, QS, Berlin wide streets mini-walk, FAQ, all 3 article images, old weak images absent, source/image-credit links, booking link, `600,000 apartments`, `2.8 million`, `4.3 million`, `medieval street plan`, `90 metres`, `Stalinallee`, `Karl-Marx-Allee`, `St. Mary's Church`, `Alexanderplatz`, `2 hours`, and `12 stops`; live page has ~2296 visible words. Rerun no-widget audit now shows 21 / 126 published posts without in-post widgets. **Opened:** Continue with `The Neues Museum: From Bombed Ruin to Nefertiti's Home` as the next highest-view no-widget post. **Closed:** Berlin wide streets is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Weimar Berlin decadence live)

**Did:** Completed and deployed the Weimar Berlin decadence old-blog refresh. **Changed:** Added `blog-drafts/_refresh/weimar-berlin-decadence.md`; added Quick Summary + FAQ key `weimar-berlin-decadence` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; added new blog-only widget `weimar-berlin-mini-walk/`; pushed remote commit `1cf1ee7 Refresh Weimar Berlin decadence widgets`. Wix post `279f817a-2ea2-488f-9a5c-a3f0239e0cc1` was patched and published with refreshed ~2.2k-word source-backed body, 3 uploaded historical images (Eldorado 1932, Alexanderstrasse 1928, Ufa-Lichtspiele 1924), QS + Weimar mini-walk + FAQ embeds, Berlin.de/DHM/visitBerlin/Hirschfeld/USHMM/Wikimedia source links, booking CTA and SEO/social tags; old weak Wall/Kaiser Wilhelm images and old collective CTA were removed. **QA:** GitHub Pages serves the new key in QS, FAQ, slug-map and `faq/inject.js`, plus `weimar-berlin-mini-walk/`; publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, old collective CTA removed, public collective absent, bad duration absent, robots, canonical, `og:image`, QS, Weimar mini-walk, FAQ, all 3 article images, old weak images absent, source/image-credit links, booking link, `1 October 1920`, `3.8 million`, `170 clubs`, `6 July 1919`, `10 May 1933`, `20,000 volumes`, `1924 to 1929`, `Eldorado`, `Bebelplatz`, and `2 hours`; live page has ~2297 visible words. Rerun no-widget audit now shows 22 / 126 published posts without in-post widgets. **Opened:** Continue with `Why Berlin's Streets Are So Wide (It Wasn't Always the Plan)` as the next highest-view no-widget post. **Closed:** Weimar Berlin decadence is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Berlin weekend guide live)

**Did:** Completed and deployed the Berlin weekend guide old-blog refresh. **Changed:** Added `blog-drafts/_refresh/berlin-weekend-guide.md`; added Quick Summary + FAQ key `berlin-weekend-guide` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; embedded the existing `free-things-map`; pushed remote commit `95c4140 Refresh Berlin weekend guide widgets`. Wix post `0ec137a2-9e52-4db8-baa1-a70936d86edb` was patched and published with refreshed evergreen weekend-planning body, existing park/sunset cover image plus tour group image, QS + free-things map + FAQ embeds, visitBerlin/Berlin.de/Mauerpark/night transport source links, internal Museum Island/Hackescher Markt/Berlin in 3 Days/Rainy Day and booking links, and SEO/social tags; the old `1 hour and 45 minutes`, old collective CTA phrasing and `We start` wording were removed. **QA:** GitHub Pages serves the new key in QS, FAQ, slug-map and `faq/inject.js`; publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, old collective CTA removed, public collective absent, bad duration absent, robots, canonical, `og:image`, QS, free-things map, FAQ, both article images, source/internal links, booking link, `2 hours`, `Mauerpark`, `10:00 to 18:00`, `3 pm`, `Friday to Saturday`, `Saturday to Sunday`, `Museum Island`, `Hackescher Markt`, `Berlin.de Weekend Tips`, `visitBerlin event calendar`, and `48-hour`; live page has ~2270 visible words. Rerun no-widget audit now shows 23 / 126 published posts without in-post widgets. **Opened:** Continue with `Was Berlin Really the Most Decadent City in the 1920s?` as the next highest-view no-widget post. **Closed:** Berlin weekend guide is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Totentanz live)

**Did:** Completed and deployed the Totentanz old-blog refresh. **Changed:** Added `blog-drafts/_refresh/totentanz-berlin.md`; added Quick Summary + FAQ key `totentanz-berlin` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; embedded the existing `medieval-berlin-mini-walk`; pushed remote commit `a989c6d Refresh Totentanz history widgets`. Wix post `d753ad1f-ea23-4c18-b32a-e9a0a330fbd9` was patched and published with refreshed body, title corrected to `oldest parish church`, existing Totentanz fresco image plus St. Mary's/TV Tower image, QS + medieval mini-walk + FAQ embeds, visitBerlin/Marienkirche/Atlas Obscura source links, internal St. Mary's/Alexanderplatz/TV Tower construction/old-town and booking links, and SEO/social tags; the old collective CTA was removed. **QA:** GitHub Pages serves the new key in QS, FAQ, slug-map and `faq/inject.js`; publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, old collective CTA removed, public collective absent, bad duration absent, robots, canonical, `og:image`, QS, medieval mini-walk, FAQ, both article images, source/internal links, booking link, `22-metre`, `2 metres`, `1484`, `70,000 tiles`, `Karl-Liebknecht-Straße 8`, `oldest parish church`, `TV Tower`, and `2 hours`; live page has ~2001 visible words. Rerun no-widget audit now shows 24 / 126 published posts without in-post widgets. **Opened:** Continue with `What's Happening in Berlin This Weekend? Your Ultimate Guide` as the next highest-view no-widget post. **Closed:** Totentanz is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Kaffee vs Coffee live)

**Did:** Completed and deployed the Kaffee vs Coffee old-blog refresh. **Changed:** Added `blog-drafts/_refresh/kaffee-vs-coffee-berlin.md`; added Quick Summary + FAQ key `kaffee-vs-coffee` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; embedded the existing `hackescher-after-tour-planner`; pushed remote commit `14aeb7c Refresh Kaffee vs Coffee widgets`. Wix post `23d8acfb-a0c4-463d-91f3-55650c3a816e` was patched and published with refreshed body, existing vintage Kaffee image, QS + after-tour planner + FAQ embeds, Duden/German Coffee Association/CBI/Goethe-Institut/Berlin.de source links, internal JFK/tipping/credit cards/German words/coffee shops and booking links, and SEO/social tags; the old collective CTA was removed. **QA:** Publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, old collective CTA removed, public collective absent, bad duration absent, robots, canonical, `og:image`, QS, after-tour planner, FAQ, article image, all source/internal/café links, booking link, `161 litres`, `90 percent`, `Eiskaffee`, `Kaffee und Kuchen`, `EUR 20 to EUR 30`, `5 to 10 percent`, `Hackescher Markt`, and `2 hours`; live page has ~2177 visible words. Rerun no-widget audit now shows 25 / 126 published posts without in-post widgets. **Opened:** Continue with `The Totentanz: A 700-Year-Old Dance of Death Inside Berlin's Oldest Church` as the next highest-view no-widget post. **Closed:** Kaffee vs Coffee is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Lustgarten live)

**Did:** Completed and deployed the Lustgarten old-blog refresh. **Changed:** Added `blog-drafts/_refresh/lustgarten-berlin.md`; added Quick Summary + FAQ key `lustgarten-berlin` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; embedded the existing `museum-island-map`; pushed remote commit `41b5517 Refresh Lustgarten history widgets`. Wix post `37fd7695-985b-4ee8-a939-a07f8e8f46ea` was patched and published with refreshed body, existing current Lustgarten cover, 2 newly uploaded historical images, QS + Museum Island map + FAQ embeds, Berlin.de/visitBerlin/Denkmaldatenbank/Jewish Museum Berlin/Atelier Loidl source links, internal Berliner Dom, Museum Island, Humboldt Forum and booking links, and SEO/social tags; the old collective CTA was removed. **QA:** Publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, old collective CTA removed, public collective absent, bad duration absent, robots, canonical, `og:image`, QS, Museum Island map, FAQ, all 3 article images, source links, internal links, booking link, `1573`, `1713`, `1790`, `1830`, `1834`, `1 May 1933`, `Marx-Engels-Platz`, `2001`, and `2 hours`; live page has ~2316 visible words. Rerun no-widget audit now shows 26 / 126 published posts without in-post widgets. **Opened:** Continue with `Kaffee vs. Coffee: A Beginner's Guide to German Café Culture` as the next highest-view no-widget post. **Closed:** Lustgarten is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Alexanderplatz then/now live)

**Did:** Completed and deployed the Alexanderplatz then/now old-blog refresh. **Changed:** Added `blog-drafts/_refresh/alexanderplatz-then-and-now.md`; added Quick Summary + FAQ key `alexanderplatz-then-now` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; embedded the existing `medieval-berlin-mini-walk` widget; pushed remote commit `57bacd5 Refresh Alexanderplatz then-now widgets`. Wix post `2bc036de-190f-4fec-9810-54bf1269a876` was patched and published with refreshed body, 3 existing Alexanderplatz historic images with new alt text, QS + medieval mini walk + FAQ embeds, Berlin.de/visitBerlin/Berlin Senate source links, internal TV Tower, Weltzeituhr, East/West, tour-start and booking links, and SEO/social tags; the old duplicated collective CTA was removed. **QA:** Publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, old collective CTA removed, public collective absent, bad duration absent, robots, canonical, `og:image`, QS, medieval mini walk, FAQ, all 3 article images, source links, internal links, booking link, `1805`, `30 September 1969`, `4 November 1989`, `500,000`, `150-metre`, and `2 hours`; live page has ~2588 visible words. Rerun no-widget audit now shows 27 / 126 published posts without in-post widgets. **Opened:** Continue with `The Lustgarten: From Royal Garden to Nazi Rally Ground to Berlin's Favorite Picnic Spot` as the next highest-view no-widget post. **Closed:** Alexanderplatz then/now is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: JFK jelly donut myth live)

**Did:** Completed and deployed the JFK jelly donut myth old-blog refresh. **Changed:** Added `blog-drafts/_refresh/jfk-jelly-donut-myth.md`; added Quick Summary + FAQ key `jfk-jelly-donut-myth` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; embedded the existing `east-west-1989` map widget; pushed remote commit `5432b3d Refresh JFK jelly donut myth widgets`. Wix post `00d27039-4ea8-4154-8c99-93f238cb7e8c` was patched and published with refreshed body, corrected Rathaus Schöneberg framing, existing dpa/JFK image, QS + East/West map + FAQ embeds, JFK Library/Berlin.de/Smithsonian/Atlas/GfdS source links, internal East/West, Berlin slang, Cold War locations and booking links, and SEO/social tags; the old collective CTA was removed. **QA:** Publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, old collective CTA removed, public collective absent, bad duration absent, robots, canonical, `og:image`, QS, East/West map, FAQ, article image, source links, internal links, booking link, `26 June 1963`, `Rathaus Schöneberg`, `Pfannkuchen`, `Berlin Game`, `John-F.-Kennedy-Platz`, and `2 hours`; live page has ~1944 visible words. Rerun no-widget audit now shows 28 / 126 published posts without in-post widgets. **Opened:** Continue with `Alexanderplatz Then and Now: From Medieval Market to Modern Chaos` as the next highest-view no-widget post. **Closed:** JFK jelly donut myth is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Museum Island before/after live)

**Did:** Completed and deployed the Museum Island before/after old-blog refresh. **Changed:** Added `blog-drafts/_refresh/museum-island-before-after-wwii.md`; added Quick Summary + FAQ key `museum-island-before-after-wwii` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; embedded the existing `museum-island-map`; pushed remote commit `d975639 Refresh Museum Island before-after widgets`. Wix post `a0f82a55-ba3b-4628-b919-c6389ce65f06` was patched and published with refreshed body, existing historic/war-damage images, an existing current Museum Island/Spree image, QS + Museum Island map + FAQ embeds, UNESCO/Museumsinsel/SMB source links, internal Museum Island ticket guide and booking links, and SEO/social tags; the old collective CTA was removed. **QA:** Publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, old collective CTA removed, public collective absent, bad duration absent, robots, canonical, `og:image`, QS, Museum Island map, FAQ, all 3 article images, source links, internal links, booking link, `1999`, `1966`, `2001`, `2006`, `2009`, `4 June 2027`, `EUR 24`, and `2 hours`; live page has ~2057 visible words. Rerun no-widget audit now shows 29 / 126 published posts without in-post widgets. **Opened:** Continue with `Did JFK Really Call Himself a Jelly Donut?` as the next highest-view no-widget post. **Closed:** Museum Island before/after is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: TV Tower 10 Things live)

**Did:** Completed and deployed the TV Tower 10 Things old-blog refresh. **Changed:** Added `blog-drafts/_refresh/tv-tower-10-things.md`; added Quick Summary + FAQ key `tv-tower-10-things` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; embedded the existing `east-west-1989` map widget; pushed remote commit `4c3d241 Refresh TV Tower facts widgets`. Wix post `56bdf09e-defe-4d07-a8dc-4ce8b8ddde5d` was patched and published with refreshed body, existing TV Tower image, QS + East/West map + FAQ embeds, visitBerlin/official TV Tower/Berlin.de/Sphere source links, internal construction, Pope's Revenge, worth-it and booking links, and SEO/social tags; the old collective CTA was removed. **QA:** Publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, old collective CTA removed, public collective absent, bad duration absent, robots, canonical, `og:image`, QS, East/West map, FAQ, article image, all source/internal links, booking link, `368 metres`, `3 October 1969`, `203 metres`, `207 metres`, `EUR 28.50`, `not barrier-free`, and `2 hours`; live page has ~2046 visible words. Rerun no-widget audit now shows 30 / 126 published posts without in-post widgets. **Opened:** Continue with `Museum Island Before and After WWII: The Destruction Nobody Expected` as the next highest-view no-widget post. **Closed:** TV Tower 10 Things is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Berliner Dom before/after live)

**Did:** Completed and deployed the Berliner Dom before/after old-blog refresh. **Changed:** Added `blog-drafts/_refresh/berliner-dom-before-after-wwii.md`; added Quick Summary + FAQ key `berliner-dom-before-after-wwii` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; embedded the existing `museum-island-map`; pushed remote commit `2d6d6db Refresh Berliner Dom before-after widgets`. Wix post `1c2d2769-902e-4739-8c56-798f18c4f23a` was patched and published with refreshed body, existing cover/social image, 3 content images, QS + Museum Island map + FAQ embeds, official Berliner Dom/Berlin.de source links, internal links, booking CTA and SEO/social tags; old collective CTA and old CTA banner image were removed. **QA:** Publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, old collective CTA removed, public collective absent, bad duration absent, robots, canonical, `og:image`, QS, Museum Island map, FAQ, all 3 article images, old banner removed, source links, internal links, booking link, `24 May 1944`, `1975`, `1993`, `2002`, `114 metres`, and `2 hours`; live page has ~2381 visible words. Rerun no-widget audit now shows 31 / 126 published posts without in-post widgets. **Opened:** Continue with `The TV Tower: 10 Things You Didn't Know About Berlin's Most Famous Landmark` as the next highest-view no-widget post. **Closed:** Berliner Dom before/after is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Marx and Engels still-standing live)

**Did:** Completed and deployed the Marx and Engels still-standing old-blog refresh. **Changed:** Added `blog-drafts/_refresh/marx-engels-still-standing.md`; added Quick Summary + FAQ key `marx-engels-still-standing` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; embedded the existing `east-west-1989` map widget; pushed remote commit `1e88244 Refresh Marx Engels still-standing widgets`. Wix post `c30ce75b-75c9-4703-82ef-fe7d0ac83284` was patched and published with refreshed body, title changed from em-dash to colon while preserving the slug, existing Marx-Engels image, QS + East/West map + FAQ embeds, Berlin.de/GHDI/Gruen Berlin source links, internal links, booking CTA and SEO/social tags. **QA:** Publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, old dash title absent, old collective CTA removed, public collective absent, bad duration absent, robots, canonical, `og:image`, QS, East/West map, FAQ, image, source links, internal links, booking link, `April 1986`, `June 2025`, `2027`, `7.2 hectare`, and `2 hours`; live page has ~2118 visible words. Rerun no-widget audit now shows 32 / 126 published posts without in-post widgets. **Opened:** Continue with `Berliner Dom Before and After WWII` as the next highest-view no-widget post. **Closed:** Marx and Engels still-standing is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Coffee Shops near Hackescher Markt live)

**Did:** Completed and deployed the Coffee Shops near Hackescher Markt old-blog refresh. **Changed:** Added `blog-drafts/_refresh/coffee-shops-hackescher-markt.md`; added Quick Summary + FAQ key `coffee-shops-hackescher-markt` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; embedded the existing `hackescher-after-tour-planner` widget; pushed remote commit `d8aadb6 Refresh Hackescher Markt coffee shops widgets`. Wix post `4cd1dbfb-3553-4f1f-915d-ec66078302e5` was patched and published with refreshed body, existing coffee-cups image, QS + planner + FAQ embeds, current cafe source links, internal links, booking CTA and SEO/social tags; the old Oslo recommendation and collective CTA were removed. **QA:** Publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, removed old collective CTA, public collective absent, old duration absent, old Oslo recommendation removed, robots, canonical, `og:image`, QS, after-tour planner, FAQ, article image, cafe/source links, internal links, booking link, The Barn, Ben Rahim, Father Carpenter, Bonanza, Princess Cheesecake, and `2 hours`; live page has ~2077 visible words. Rerun no-widget audit now shows 33 / 126 published posts without in-post widgets. **Opened:** Continue with `Marx and Engels Are Still Standing in Berlin — Here's Why` as the next highest-view no-widget post. **Closed:** Coffee Shops near Hackescher Markt is no longer in the no-widget audit.

## 2026-06-15 — Codex (Berlin Battle mode strip removed)

**Did:** Removed the redundant/misleading four-card `Live mode` strip from the dedicated Berlin Battle Games page wrapper. **Changed:** `berlin-battle-page/berlin-battle-page-element.js` no longer renders or styles `.bw-battle-strip` / `.bw-battle-mode-grid`; unused topic-cover constants were removed. `berlin-battle-page/README.md` snippet cache-buster is now `no-mode-strip-20260615`; root `PROJECT_MEMORY.md` records the product decision. **QA:** Wrapper JS syntax and `git diff --check -- berlin-battle-page` passed. Local Browser QA at 1280px and 390px confirmed no strip/mode-grid/`Live mode` text, hero flows directly into the game band with gap 0, and horizontal overflow is 0. **Opened:** Push/deploy and verify live `/games/berlin-battle` after GitHub Pages cache updates. **Closed:** The misleading strip is removed locally.

## 2026-06-15 — Codex (Berlin Battle header/footer links)

**Did:** Added Berlin Battle to the global Custom Element navigation. **Changed:** `site-header/site-header-element.js` now has a `Games` nav link to `/games/berlin-battle` on desktop and mobile; compact breakpoint moved from 880px to 980px to prevent nav crowding. `site-footer/site-footer-element.js` now has a separate `Play` column with `Berlin Battle`; footer desktop grid supports four link columns. `README.md`, `AGENTS.md`, and root project memory were updated to match. **QA:** Header/footer JS syntax and `git diff --check` passed. Local Browser QA confirmed `Games` appears with the correct link on desktop/mobile, `Play > Berlin Battle` appears in footer, 900/980/1000/1280px header breakpoints have horizontal overflow 0, and footer desktop/mobile overflow is 0. **Opened:** Push/deploy, then wait for GitHub Pages/Wix cache before checking live menu. **Closed:** Local header/footer game navigation is ready.

## 2026-06-15 — Codex (Old blog refresh: Cheap Berlin live)

**Did:** Completed and deployed the Cheap Berlin 2026 old-blog refresh. **Changed:** Added `blog-drafts/_refresh/cheap-berlin-2026.md`; added Quick Summary + FAQ key `cheap-berlin-2026` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; embedded the existing `berlin-budget-table` widget; pushed remote commit `6ed9a6a Refresh cheap Berlin budget widgets`. Wix post `b10b34b2-7d5b-47ee-88f6-6df8f26395c1` was patched and published with refreshed body, existing apartment-balcony image, QS + budget + FAQ embeds, official source links, internal links, booking CTA and SEO/social tags; the old CTA banner image and old unsupported rent claims were removed from the body. **QA:** Publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, old collective CTA removed, public collective voice absent, old unsupported rent claim removed, robots, canonical, `og:image`, QS, budget widget, FAQ, image, official links, internal links, booking link, `EUR 4`, `EUR 11.20`, `7.5 percent`, `2 hours`, and no bad duration; live page has ~2338 visible words. Rerun no-widget audit now shows 34 / 126 published posts without in-post widgets. **Opened:** Continue with `5 Best Coffee Shops Near Hackescher Markt` as the next highest-view no-widget post. **Closed:** Cheap Berlin is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: 10 German Words live)

**Did:** Completed and deployed the 10 German Words old-blog refresh. **Changed:** Added `blog-drafts/_refresh/10-german-words-tourists-berlin.md`; added Quick Summary + FAQ key `german-tourist-words` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; embedded the existing `german-phrases-quiz` widget; pushed remote commit `dc8f8bc Refresh German tourist words widgets`. Wix post `fa08615d-7b69-40ce-9b4d-d2379822895e` was patched and published with refreshed body, existing German-flag image, QS + quiz + FAQ embeds, internal links to 50 German phrases, credit cards, tipping and Berlin slang, booking CTA and SEO/social tags. **QA:** Publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, removed old collective CTA, robots, canonical, `og:image`, QS, German quiz, FAQ, image, internal links, booking link, `Hallo`, `Danke`, `Bitte`, `Entschuldigung`, `Sprechen Sie Englisch`, `Die Rechnung`, `Stimmt so`, `Karte`, `2 hours`, and no bad duration; live page has ~1865 visible words. Rerun no-widget audit now shows 35 / 126 published posts without in-post widgets. **Opened:** Continue with `Is Berlin Still Cheap? The Myth of Cheap Berlin in 2026` as the next highest-view no-widget post. **Closed:** 10 German Words is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Cold War Berlin locations live)

**Did:** Completed and deployed the Cold War Berlin locations old-blog refresh. **Changed:** Added `blog-drafts/_refresh/cold-war-berlin-5-key-locations.md`; added Quick Summary + FAQ key `cold-war-berlin-locations` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; embedded the existing `berlin-wall-map` widget; pushed remote commit `c5a9647 Refresh Cold War Berlin location widgets`. Wix post `ed9feb96-36dd-4b5e-8d89-890f859083f5` was patched and published with refreshed body, 3 existing images, QS + Wall map + FAQ embeds, official source links, East/West internal link, booking CTA and SEO/social tags. **QA:** Publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, removed old collective CTA, removed old short body, robots, canonical, `og:image`, QS, Wall map, FAQ, all 3 images, source links, East/West link, booking link, Bernauer Straße, Tränenpalast, Stasi Museum, Glienicke Bridge, Tempelhof, `13 August 1961`, `9 November 1989`, `45 seconds`, `2 hours`, and no bad duration; live page has ~2252 visible words. Rerun no-widget audit now shows 36 / 126 published posts without in-post widgets. **Opened:** Continue with `10 German Words Every Tourist Should Know Before Visiting Berlin` as the next highest-view no-widget post. **Closed:** Cold War Berlin locations is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Berlin Slang live)

**Did:** Completed and deployed the Berlin Slang old-blog refresh. **Changed:** Added `blog-drafts/_refresh/berlin-slang.md`; added Quick Summary + FAQ key `berlin-slang` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; pushed remote commit `993edd9 Refresh Berlin slang post widgets` after the prior merge-resolution handoff commit. Wix post `b68c4355-9bbb-42fd-a1b2-28ebd489d820` was patched and published with refreshed body, existing cover image as inline image, QS+FAQ embeds, Duden Kiez/Späti/Schrippe source links, Späti and speaking-German internal links, booking CTA and SEO/social tags. **QA:** Publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, removed old collective CTA, removed old short body, robots, canonical, `og:image`, QS, FAQ, article image, source links, internal links, booking link, `Berlinerisch`, `Berliner Schnauze`, `Kiez`, `Späti`, `Schrippe`, `JWD`, `Wurschtegal`, `2 hours`, and no bad duration; live page has ~2126 visible words. Rerun no-widget audit now shows 37 / 126 published posts without in-post widgets. **Opened:** Continue with `Cold War Berlin in 5 Key Locations You Can Still Visit` as the next highest-view no-widget post. **Closed:** Berlin Slang is no longer in the no-widget audit.

## 2026-06-15 — Codex (GitHub Desktop merge conflict resolved)

**Did:** Resolved the GitHub Desktop pull/merge conflict after local commit `415546d m` diverged from `origin/main`. **Changed:** Kept the local Berlin Battle homepage teaser commit, merged remote blog-refresh additions through `c9ae46e`, combined `marx-engels-face-west` and `alexanderplatz-tour-start` Quick Summary/FAQ/slug-map entries with the existing local entries, regenerated `faq/inject.js`, and concluded the merge with commits `eb5a622` and `be9ba31`. **QA:** Conflict marker scan returned none for the affected files; `faq/data.json`, `faq/slug-map.json`, and `quick-summary/data.json` parse; `node --check faq/inject.js` and `git diff --check` pass. **Opened:** Push local `main` when ready; branch is ahead of `origin/main` only. **Closed:** GitHub Desktop no longer has unresolved conflicts.

## 2026-06-15 — Codex (Old blog refresh: Alexanderplatz start live)

**Did:** Completed and deployed the Alexanderplatz tour-start old-blog refresh. **Changed:** Added `blog-drafts/_refresh/why-my-tour-starts-at-alexanderplatz.md`; added Quick Summary + FAQ key `alexanderplatz-tour-start` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; embedded the existing `meeting-point` widget; pushed remote commits `b5208cf Refresh Alexanderplatz tour-start widgets` and `c9ae46e Fix Alexanderplatz start draft source link` via clean temporary worktrees so unrelated local commits were not pushed. Wix post `9288bb32-f760-408e-8b3c-c50533320b1b` was patched and published with refreshed body, title changed from collective `Why Our...` to first-person `Why My Tour Starts at Alexanderplatz (And Not at Brandenburg Gate)` while preserving the slug, existing cover image as inline image, QS + meeting-point + FAQ embeds, visitBerlin/Berlin.de source links, meeting-point/route links, booking CTA and SEO/social tags. **QA:** Publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed singular title, removed old collective intro, robots, canonical, `og:image`, QS, meeting-point widget, FAQ, article image, source links, internal links, booking link, `World Clock`, `Alexanderplatz`, `Brandenburg Gate`, `Hackescher Markt`, `green umbrella`, `12 stops`, `5 minutes early`, `2 hours`, and no bad duration; live page has ~2169 visible words. Rerun no-widget audit now shows 38 / 126 published posts without in-post widgets. **Opened:** Continue with `Berlin Slang: 10 Words You'll Only Hear in This City` as the next highest-view no-widget post. **Closed:** Alexanderplatz start is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Marx and Engels face-west live)

**Did:** Completed and deployed the Marx and Engels face-west old-blog refresh. **Changed:** Added `blog-drafts/_refresh/marx-engels-face-west.md`; added Quick Summary + FAQ key `marx-engels-face-west` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; pushed remote widget commit `c9938b0 Refresh Marx Engels face-west widgets` via a clean temporary worktree so unrelated local commits were not pushed. Wix post `aae7c98a-1535-4de1-ab33-501c789e5a1d` was patched and published with refreshed body, corrected direction/history framing, existing historical image as inline image, QS + FAQ embeds, official Berlin.de and Grün Berlin source links, East/West/Humboldt/TV Tower internal links, booking CTA and SEO/social tags. **QA:** Publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, robots, canonical, `og:image`, QS, FAQ, article image, source links, internal links, `April 1986`, `2010`, `June 2025`, `2027`, U5 construction copy, capitalism joke, construction disruption, no old false west-purpose/never-turned claims, booking link and `2 hours`; live page has ~2248 visible words. Rerun no-widget audit now shows 39 / 126 published posts without in-post widgets. **Opened:** Continue with `Why Our Tour Starts at Alexanderplatz` as the next highest-view no-widget post. **Closed:** Marx and Engels face-west is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Solo travel safety live)

**Did:** Completed and deployed the Solo Travel Safety old-blog refresh. **Changed:** Added `blog-drafts/_refresh/berlin-solo-travel-safety.md`; added Quick Summary + FAQ key `berlin-solo-travel-safety` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; reused the existing `safety-map` widget; pushed remote widget commit `41188e9 Refresh Berlin solo travel safety widgets` via a clean temporary worktree so unrelated local commits were not pushed. Wix post `0a110fcd-196b-4603-9848-08e3c4a8d776` was patched and published with refreshed body, existing cover image as inline image, QS + safety-map + FAQ embeds, official Berlin.de/visitBerlin/GOV.UK source links, booking CTA and SEO/social tags. **QA:** Publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, robots, canonical, `og:image`, QS, safety map, FAQ, article image, Berlin.de pickpocket/night-transport/police links, visitBerlin emergency source, GOV.UK travel advice, `110`, `112`, `116 116`, pickpocketing, Gorlitzer Park, booking link and `2 hours`; live page has ~2101 visible words. Rerun no-widget audit now shows 40 / 126 published posts without in-post widgets. **Opened:** Continue with `Why Marx and Engels Face West` as the next highest-view no-widget post. **Closed:** Solo Travel Safety is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Tipping simple guide live)

**Did:** Completed and deployed the Tipping simple-guide old-blog refresh. **Changed:** Added `blog-drafts/_refresh/how-much-should-you-tip-in-berlin.md`; reused existing Quick Summary + FAQ key `tipping-in-berlin` and existing `berlin-tip-calculator`; pushed remote draft commit `a64a09e Add refreshed Berlin tipping guide draft` via a clean temporary worktree so unrelated local commits were not pushed. Wix post `113a9869-f2a1-4a1e-929f-2139e40fd8a4` was patched and published with refreshed body, existing restaurant image, QS + calculator + FAQ embeds, official Berlin.de tipping/taxi source links, booking CTA and SEO/social tags. **QA:** Publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, robots, canonical, `og:image`, QS, tip calculator, FAQ, article image, Berlin.de source links, credit-cards internal link, `5-10%`, `EUR 10-15 per person`, `Stimmt so`, booking link and `2 hours`; live page has ~2071 visible words. Rerun no-widget audit now shows 41 / 126 published posts without in-post widgets. **Opened:** Continue with `Is Berlin Safe for Solo Travelers?` as the next highest-view no-widget post. **Closed:** Tipping simple guide is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: TV Tower Construction live)

**Did:** Completed and deployed the TV Tower Construction old-blog refresh. **Changed:** Added `blog-drafts/_refresh/berlin-tv-tower-construction.md`; added Quick Summary + FAQ key `berlin-tv-tower-construction` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; pushed remote widget commit `c4c3abf Refresh Berlin TV Tower construction widgets` via a clean temporary worktree so unrelated local commits were not pushed. Wix post `57fd7a18-0ff7-493d-b2ea-a758b5f9e61d` was patched and published with refreshed body, 3 existing TV Tower images, QS + FAQ embeds, official source links, booking CTA and SEO/social tags; old `EUR 22.50` guidance was removed and current `EUR 28.50` guidance was added. **QA:** Publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, robots, canonical, `og:image`, QS, FAQ, all 3 images, official TV Tower/visitBerlin/Berlin.de/DDR Museum/Great Towers source links, `over 132 million East German marks`, `4 August 1965`, `3 October 1969`, `EUR 28.50`, no old `EUR 22.50`, booking link and `2 hours`; live page has ~2750 visible words. Rerun no-widget audit now shows 42 / 126 published posts without in-post widgets. **Opened:** Continue with `How Much Should You Tip in Berlin?` as the next highest-view no-widget post. **Closed:** TV Tower Construction is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: East vs West live)

**Did:** Completed and deployed the East vs West old-blog refresh. **Changed:** Added `blog-drafts/_refresh/how-berlin-was-divided-east-west.md`; added Quick Summary + FAQ key `berlin-east-west-guide` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; reused the existing `east-west-1989` map widget in the refreshed post; pushed remote widget commit `6c83687 Refresh East West Berlin guide widgets` via a clean temporary worktree so unrelated local commits were not pushed. Wix post `3772789f-401b-4655-9c2d-8c4fe4312b95` was patched and published with refreshed body, existing Berlin Wall image, QS + map + FAQ embeds, official Berlin Wall Foundation source links, booking CTA and SEO/social tags. **QA:** Publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, robots, canonical, `og:image`, QS, FAQ, East/West map widget, Berlin Wall image, Berlin Wall Foundation links, `155 kilometres`, `13 August 1961`, `9 November 1989`, Brandenburg Gate East clarification, West Berlin island copy, Ampelmann link, booking link and `2 hours`; live page has ~2143 visible words. Rerun no-widget audit now shows 43 / 126 published posts without in-post widgets. **Opened:** Continue with `Berlin TV Tower Construction` as the next highest-view no-widget post. **Closed:** East vs West is no longer in the no-widget audit.

## 2026-06-15 — Codex (World Cup fixture score update)

**Did:** Added the newly final morning scores for Netherlands vs Japan, Ivory Coast vs Ecuador, and Sweden vs Tunisia. **Changed:** `worldcup-fixtures/index.html` adds Netherlands 2-2 Japan, Ivory Coast 1-0 Ecuador, and Sweden 5-1 Tunisia as `FT`, and updates `SCORE_UPDATED` to `15 Jun 2026, 08:32 CEST`; no fixture times, names, styling, filters, or other widget behavior changed. **QA:** FIFA match reports were cross-checked with current Guardian/ESPN/Times of India-style sports sources with no conflicts; inline JS/data parse passed with 72 matches and 12 scored fixtures; Playwright local QA found `.bw-match.final` count 12 and horizontal overflow 0 at 1280px and 390px; `git diff --check -- worldcup-fixtures/index.html` passed. **Opened:** Push/deploy still needed for GitHub Pages to serve the updated live widget. **Closed:** Local score update is complete.

## 2026-06-15 — Codex (Old blog refresh: Hackescher Markt Before/After live)

**Did:** Completed and deployed the Hackescher Markt Before/After old-blog refresh. **Changed:** Added `blog-drafts/_refresh/hackescher-markt-before-after.md`; added Quick Summary + FAQ key `hackescher-markt-before-after` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; reused the existing `hackescher-after-tour-planner` widget in the refreshed post; pushed remote widget commit `f835b1a Refresh Hackescher Markt before-after post widgets` via a clean temporary worktree so unrelated local commits were not pushed. Wix post `211a0bb5-7576-4bda-9104-0771e2894d44` was patched and published with refreshed body, existing Hackesche Höfe image, QS + planner + FAQ embeds, official source links, booking CTA and SEO/social tags. **QA:** Publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, robots, canonical, `og:image`, cover image, QS, FAQ, after-tour planner, Hackesche Höfe image, official source links, `1906`, `5 September 1866`, Jewish Berlin, booking link and `2 hours`; live page has ~2418 visible words. Rerun no-widget audit now shows 44 / 126 published posts without in-post widgets. **Opened:** Continue with `How Berlin Was Divided: East vs. West` as the next highest-view no-widget post. **Closed:** Hackescher Markt Before/After is no longer in the no-widget audit.

## 2026-06-15 — Codex (Berlin Battle homepage teaser local)

**Did:** Built the local Berlin Battle homepage teaser Custom Element. **Changed:** Added `berlin-battle-home/` with `<bw-berlin-battle-home>`, standalone preview, README/Wix snippet, real Berlin Battle imagery, `/games/berlin-battle` and booking CTAs, proof chips `16 items`, `15 picks`, `Share card`, and a side-by-side VS preview; updated `README.md` homepage element docs. **QA:** `node --check berlin-battle-home/berlin-battle-home-element.js` and `git diff --check -- berlin-battle-home README.md` passed. Local Browser QA at 390px and 1280px confirmed all images load, horizontal overflow is 0, VS preview stays side-by-side, mode grid is 2 columns mobile / 4 desktop, and the subheadline-to-button gap is 34px. **Opened:** Push/deploy, then add the README snippet to the Wix homepage after deciding placement. **Closed:** Local section design and copy are ready.

## 2026-06-15 — Codex (Old blog refresh: Humboldt Forum live)

**Did:** Completed and deployed the Humboldt Forum old-blog refresh. **Changed:** Added `blog-drafts/_refresh/humboldt-forum-controversial-building.md`; added Quick Summary key `humboldt-forum`, updated the existing Humboldt FAQ key, added the new slug-map entry, and regenerated `faq/inject.js`; pushed remote widget commits `ebd59c4 Refresh Humboldt Forum post widgets` and `ed54efc Add Humboldt Forum source links` via clean temporary worktrees so unrelated local commits were not pushed. Wix post `e3c5ea64-a59b-45ac-b846-f72691e353d8` was patched and published with refreshed body, existing Humboldt image, QS+FAQ embeds, current official admission/roof/source links, booking CTA and SEO/social tags. **QA:** Publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, robots, canonical, `og:image`, QS, FAQ, Humboldt image, official Humboldt admission/roof links, SMB collection link, Benin restitution source, `EUR 14`, `EUR 3`, `13 July 2026`, Palast der Republik, Benin restitution, booking link and `2 hours`; live page has ~2283 visible words. Rerun no-widget audit now shows 45 / 126 published posts without in-post widgets. **Opened:** Continue with `Hackescher Markt Before and After` as the next highest-view no-widget post. **Closed:** Humboldt Forum is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Reichstag Dome live)

**Did:** Completed and deployed the Reichstag Dome old-blog refresh. **Changed:** Added `blog-drafts/_refresh/reichstag-dome-free.md`; added Quick Summary + FAQ key `reichstag-dome-free` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; pushed remote widget commit `de37877 Refresh Reichstag dome post widgets` via a clean temporary worktree so unrelated local commits were not pushed. Wix post `e511dc05-8aec-48d7-aa96-4f8fbd38d805` was patched and published with refreshed body, existing Reichstag image, QS+FAQ embeds, current official Bundestag registration/booking links, 2026 closure dates, booking CTA and SEO/social tags. **QA:** Publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, robots, canonical, `og:image`, QS, FAQ, Reichstag image, official Bundestag registration/booking links, June closure, roof-terrace caveat, free-admission copy, removed old ID-number wording, booking link and `2 hours`; live page has ~2044 visible words. Rerun no-widget audit now shows 46 / 126 published posts without in-post widgets. **Opened:** Continue with `The Humboldt Forum` as the next highest-view no-widget post. **Closed:** Reichstag Dome is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: TV Tower worth-it live)

**Did:** Completed and deployed the TV Tower worth-it old-blog refresh. **Changed:** Added `blog-drafts/_refresh/berlin-tv-tower-worth-it.md`; added Quick Summary + FAQ key `berlin-tv-tower-worth-it` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; pushed remote widget commit `f79ab43 Refresh Berlin TV Tower worth-it post widgets` via a clean temporary worktree so unrelated local commits were not pushed. Wix post `079af01d-bc04-4da6-a941-07b15fca9041` was patched and published with refreshed body, existing TV Tower image, QS+FAQ embeds, current official source links, booking CTA and SEO/social tags; old `EUR 22.50` pricing was replaced with `EUR 28.50` guidance. **QA:** Publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, robots, canonical, `og:image`, QS, FAQ, TV Tower image, official TV Tower ticket/accessibility links, Bundestag link, Park Inn visitBerlin link, `EUR 28.50`, no old `EUR 22.50`, booking link, `2 hours` and Pope's Revenge story; live page has ~2305 visible words. Rerun no-widget audit now shows 47 / 126 published posts without in-post widgets. **Opened:** Continue with `How to Visit the Reichstag Dome for Free` as the next highest-view no-widget post. **Closed:** TV Tower Worth It is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Speak German live)

**Did:** Completed and deployed the Speak German old-blog refresh. **Changed:** Added `blog-drafts/_refresh/do-i-need-to-speak-german.md`; added Quick Summary + FAQ key `speak-german-berlin` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; pushed remote widget commits `8fd2c51 Refresh speak German in Berlin post widgets` and `6309e5e Fix speak German draft source link` via a clean temporary worktree so unrelated local commits were not pushed. Wix post `7496bd1f-5021-49bb-9154-db8db5efbc48` was patched and published with refreshed body, existing image, QS+FAQ embeds, current official source links, booking CTA and SEO/social tags. **QA:** Publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, robots, canonical, `og:image`, QS, FAQ, German flag image, official Berlin demographic link, official BVG Fahrinfo link, visitBerlin emergency link, booking link, `2 hours` and key phrase visibility; live page has ~2017 visible words. Rerun no-widget audit now shows 48 / 126 published posts without in-post widgets. **Opened:** Continue with `Is the Berlin TV Tower Worth It?` as the next highest-view no-widget post. **Closed:** Speak German is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Berlin in 3 Days live)

**Did:** Completed and deployed the Berlin in 3 Days old-blog refresh. **Changed:** Added `blog-drafts/_refresh/berlin-in-3-days.md`; added Quick Summary + FAQ key `berlin-in-3-days` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; pushed remote widget commit `561998e Refresh Berlin in 3 Days post widgets` via a clean temporary worktree so unrelated local commits were not pushed. Wix post `f4e4da01-8093-43e6-a4b0-92a5040761c5` was patched and published with refreshed body, 3 existing images, QS+FAQ embeds, current official source links, booking CTA and SEO/social tags. **QA:** Publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, robots, canonical, `og:image`, QS, FAQ, World Clock image, official BVG/Bundestag/Topography links, booking link, `2 hours`, Pergamon closure note and no old `1h45` duration; live page has ~2966 visible words. Rerun no-widget audit now shows 49 / 126 published posts without in-post widgets. **Opened:** Continue with `Do I Need to Speak German to Visit Berlin?` as the next highest-view no-widget post. **Closed:** Berlin in 3 Days is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Photo Spots live)

**Did:** Completed and deployed the Photo Spots old-blog refresh. **Changed:** Added `blog-drafts/_refresh/berlin-photo-spots.md`; added Quick Summary + FAQ key `berlin-photo-spots` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; pushed remote widget commits `d3585e1 Refresh Berlin photo spots post widgets` and `fce4f62 Fix photo spots draft source links` via clean temporary worktrees so unrelated local commits were not pushed. Wix post `5f05ce35-cc3e-4df0-9724-5e7eeaeb6308` was patched and published with refreshed body, existing image, QS+FAQ embeds, official source links, booking CTA and SEO/social tags. **QA:** Publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, robots, canonical, `og:image`, QS, FAQ, cover image, official Hackesche Höfe link, official Grün Berlin redevelopment link, booking link, `2 hours` and the Marx-Engels redevelopment caveat; live page has ~2367 visible words. Rerun no-widget audit now shows 50 / 126 published posts without in-post widgets. **Opened:** Continue with `Berlin in 3 Days` as the next highest-view no-widget post. **Closed:** Photo Spots is no longer in the no-widget audit.

## 2026-06-15 — Codex (Berlin Battle high-res + overlap fix)

**Did:** Fixed the Berlin Battle Games page mode-card overlap and refreshed all battle card images from higher-source ChatGPT-browser batches. **Changed:** `berlin-battle-page/berlin-battle-page-element.js` removes the negative mode-strip overlap, uses a normal green strip below the hero, and bumps the iframe cache-buster to `highres-layout-fix-20260615`; `berlin-battle-page/README.md` snippet matches; `berlin-battle/data.json` version is `2026-06-15-highres-2x2`; `berlin-battle/index.html` fetches versioned data and appends the data version to topic/item image URLs; all 64 `berlin-battle/assets/cards/**/*.webp` were regenerated from 16 ChatGPT-browser 2x2 source sheets under `berlin-battle/assets/source/highres-batches/`; `berlin-battle/assets/source/PROMPTS.md` documents the high-res workflow. No paid image API or Content Studio generation was used. **QA:** Data validation passed with 4 topics, 64 items, all card files present and 640x640. Wrapper JS parse, game inline script parse, and `git diff --check -- berlin-battle berlin-battle-page` passed. Local Browser QA: 846px and 390px wrapper cards no longer cover hero buttons, overflow 0; mobile matchup stayed side-by-side at `167px 30px 167px`; desktop matchup renders from 640px sources; all 4 modes completed in exactly 15 choices and winner images use `?v=2026-06-15-highres-2x2`. **Opened:** Push/deploy and live-QA `/games/berlin-battle`; old `/tools/berlin-battle` handling remains. **Closed:** Local overlap and low-resolution card issues are fixed.

## 2026-06-15 — Codex (Old blog refresh: Rainy Day Berlin live)

**Did:** Completed and deployed the Rainy Day Berlin old-blog refresh. **Changed:** Added `blog-drafts/_refresh/berlin-rainy-day-activities.md`; added Quick Summary + FAQ key `berlin-rainy-day-activities` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; pushed remote widget commit `512f663 Refresh rainy day Berlin post widgets` via a clean temporary worktree so unrelated local commits were not pushed. Wix post `f5df7eb9-4c0e-4dc8-884b-ffff0788684e` was patched and published with refreshed body, 4 existing images, QS+FAQ embeds, current official attraction links, booking CTA and SEO/social tags. **QA:** Publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, robots, canonical, `og:image`, QS, FAQ, image, official SMB/Topography/Tempelhof links, booking link and Pergamon closure note; live page has ~2590 visible words. Rerun no-widget audit now shows 51 / 126 published posts without in-post widgets. **Opened:** Continue with `7 Best Photo Spots in Berlin Most Tourists Walk Right Past` as the next highest-view no-widget post. **Closed:** Rainy Day Berlin is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Bus 100 live)

**Did:** Completed and deployed the Bus 100 old-blog refresh. **Changed:** Added `blog-drafts/_refresh/bus-100-berlin.md`; added Quick Summary + FAQ key `bus-100-berlin` to `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js`; pushed widget commit `9c59088 Refresh Bus 100 Berlin post widgets`. Wix post `aa1af179-114d-4c63-afe4-c39437df2f10` was patched and published with refreshed body, existing Bus 100 image, QS+FAQ embeds, official BVG/fare links, booking CTA and SEO/social tags. **QA:** Publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, robots, canonical, `og:image`, QS, FAQ, image, official BVG links, booking link and `EUR 4`; live page has ~2303 visible words. Rerun no-widget audit now shows 52 / 126 published posts without in-post widgets. **Opened:** Continue with `What to Do in Berlin When It Rains` as the next highest-view no-widget post. **Closed:** Bus 100 is no longer in the no-widget audit.

## 2026-06-15 — Codex (Old blog refresh: Credit Cards live)

**Did:** Completed and deployed the Credit Cards old-blog refresh after the Ampelmann pilot. **Changed:** Pushed local commits `bf0e5d9 Refresh credit cards Berlin post widgets` and `0b5dd1b Record credit cards refresh handoff` to `origin/main`; GitHub Pages now serves Quick Summary + FAQ key `credit-cards-berlin`. Wix post `a6d77d42-0f8d-496c-b25a-5dbdf2e5d17a` was published with the refreshed body, existing card-payment image, QS+FAQ embeds, official links, booking CTA and SEO/social tags. **QA:** Publish returned `200 OK`; Wix readback shows `PUBLISHED` and `hasUnpublishedChanges: false`; live QA passed title, robots, canonical, `og:image`, QS, FAQ, image, official links, booking link and cash amount; live page has ~1917 visible words. Rerun no-widget audit now shows 53 / 126 published posts without in-post widgets. **Opened:** Continue with `Bus 100 Berlin` as the next highest-view no-widget post. **Closed:** Credit Cards is no longer waiting on push/publish.

## 2026-06-15 — Codex (Old blog refresh: Credit Cards prepared)

**Did:** Continued the old-blog refresh after Ampelmann and prepared `Can You Use Credit Cards in Berlin?` as the next post in the no-widget queue. **Changed:** `blog-drafts/_refresh/credit-cards-in-berlin.md` adds the refreshed English draft; `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, and regenerated `faq/inject.js` add key `credit-cards-berlin`. Wix draft/post `a6d77d42-0f8d-496c-b25a-5dbdf2e5d17a` was patched with the refreshed body, existing card-payment image, QS+FAQ embeds, official links, booking CTA, and SEO/social tags but not published yet. **QA:** Local JSON parse and `git diff --check` passed; Wix readback shows `PUBLISHED` with `hasUnpublishedChanges: true`, 143 paragraphs, 13 headings, 5 lists, 1 image, and 2 HTML embeds. Local branch is ahead of `origin/main`; GitHub Pages does not yet serve `credit-cards-berlin`, so publishing is waiting for Yusuf to push. **Opened:** Push local commits, verify GitHub Pages QS/FAQ data, then publish and live-QA Credit Cards. **Closed:** Ampelmann no longer appears in the no-widget audit; scratch audit now shows 54 / 125 published posts without in-post widgets.

## 2026-06-15 — Codex (Berlin Battle all modes)

**Did:** Made the next three Berlin Battle modes playable after the dashboard work: District, Museum, and Night now join Food on the same game screen. **Changed:** `berlin-battle/data.json` now has 4 active topics and 64 total items; `berlin-battle/assets/cards/{districts,museums,night}/` adds 48 ChatGPT-browser card crops; `berlin-battle/index.html` uses topic-aware game prompts, result lines, share captions, filenames, native-share titles, and share-card heading; `berlin-battle-page/` wrapper copy/snippet/cache-buster now use `all-modes-chatgpt-assets-20260615`; `berlin-battle/assets/source/PROMPTS.md` records exact ChatGPT browser prompts and source sheets. No paid image API or Content Studio paid generation was used. **QA:** Data validation passed: 4 active topics, 64 items, all images present. JS/HTML parse checks and `git diff --check` passed. Playwright local QA completed Food, District, Museum, and Night in exactly 15 choices each, confirmed nonblank 1080x1350 share canvases, restart to 2 choices, no image failures, and overflow 0. Mobile 390px QA confirmed opening grid at 2 columns and each matchup remains side-by-side at `167px 30px 167px`; wrapper local QA confirmed 4 live mode cards and iframe `v=all-modes-chatgpt-assets-20260615`. **Opened:** Push/deploy and live-cache verification for `/games/berlin-battle`; old `/tools/berlin-battle` redirect/unpublish decision remains. **Closed:** District, Museum, and Night modes are ready for live.

## 2026-06-15 — Codex (Berlin Battle final live mobile QA)

**Did:** Closed the Berlin Battle tracking/dashboard run with a final live mobile check. **Changed:** Handoff notes only; no widget code changed in this final pass. **QA:** Live Wix `/games/berlin-battle?utm_content=codex_smoke` at 390px loaded the Games wrapper/game iframe with `dashboard-tracking-20260615`, clicked Food Battle, showed the matchup side-by-side at `154px 30px 154px`, loaded both visible food images from 640px assets, and kept iframe plus parent horizontal overflow at 0. Final syntax checks passed for the dashboard server, Content Studio tracking endpoint/server, wrapper element, and game inline script; `git diff --check` passed. **Opened:** Decide redirect/unpublish handling for the old `/tools/berlin-battle` CMS route. **Closed:** Dedicated Games page, gameplay, share/replay, production tracking, event storage, and local dashboard are ready.

## 2026-06-15 — Codex (Berlin Battle tracking + dashboard)

**Did:** Added first-party tracking hooks for Berlin Battle and documented the local internal stats dashboard for the dedicated Games page.

**Changed:**
- `berlin-battle/index.html` — sends `bw_berlin_battle_*` events to production `/api/battle-event`, uses session-scoped game session IDs, keeps persistent visitor IDs, adds restart/share method tracking, and stays silent in local previews unless `tracking=local` is present.
- `berlin-battle-page/berlin-battle-page-element.js` — game iframe cache-buster bumped to `dashboard-tracking-20260615`.
- `berlin-battle-page/README.md` — Wix snippet bumped and dashboard/local-tracking notes added.
- `../berlinwalk-content-app/api/track-trip-planner-event.js`, `../berlinwalk-content-app/server.js`, `../berlinwalk-content-app/vercel.json`, `../scripts/setup-berlin-battle-events-collection.mjs`, `../scripts/berlin-battle-dashboard-server.mjs`, `../PROJECT_MEMORY.md`, and `../SESSION_LOG.md` — recorded/implemented the tracking endpoint, Wix collection setup, credential-aware CORS, dashboard, and default QA smoke-event filtering.

**QA:** Data validation passed: 4 topics, one active `food`, 16 unique food items, no missing images. Syntax checks passed for the endpoint/server/dashboard/wrapper and game inline script; `git diff --check` passed. Local dashboard rendered desktop and 390px mobile with `Ready`, 6 metrics, panels, and overflow 0. Playwright completed the local game in exactly 15 choices, created a nonblank 1080x1350 canvas, downloaded `berlin-food-battle-pretzel.png`, copied caption/link, confirmed `Share result` desktop fallback copies text/link, restarted to a fresh 2-choice matchup, and confirmed 390px VS layout remains side-by-side (`154px 30px 154px`) with loaded images and overflow 0. Content Studio production `/api/battle-event` was deployed and live-smoked. GitHub Pages serves the new wrapper/game tracking build. Live Wix `/games/berlin-battle?utm_content=codex_smoke` QA passed: iframe version `dashboard-tracking-20260615`, 15 choices, final winner, share fallback, restart, parent/iframe overflow 0, and no battle-event/CORS console errors. The dashboard excludes `codex_smoke` rows by default and shows them with `includeQa=1`; the live QA run produced 33 events after final mobile checks, including 15 choices, 1 complete, 1 share, and 1 restart.

**Opened:** Decide whether to redirect/unpublish the old `/tools/berlin-battle` CMS route and optionally update the Wix custom-code script URL to the README `?v=dashboard-tracking-20260615` snippet for clarity.
**Closed:** Local/live gameplay, share/replay flow, Content Studio production tracking endpoint, Games wrapper tracking build, and dashboard docs are ready.

**Next session should:** Monitor real, non-QA `BerlinBattleEvents` after visitors play and decide redirect/unpublish handling for the old `/tools/berlin-battle` CMS route.

## 2026-06-14 — Codex (World Cup fixture score update)

**Did:** Added the newly final Group E score for Germany vs Curaçao to the World Cup fixtures widget.

**Changed:**
- `worldcup-fixtures/index.html` — added Germany 7-1 Curaçao as `FT`.
- `worldcup-fixtures/index.html` — updated `SCORE_UPDATED` to `14 Jun 2026, 23:31 CEST`.

**QA:** Due-match check found Germany vs Curaçao eligible at this run; FIFA match centre was checked but did not expose an accessible final score, so FOX Sports and Sky Sports were used as agreeing final-score sources. Inline script/data parse passed with 72 matches and 9 scored fixtures; Playwright local QA found `.bw-match.final` count 9 and horizontal overflow 0 at desktop 1280px and mobile 390px; `git diff --check` passed. Local favicon 404 was the only console error.

**Opened:** Push/deploy still needed for GitHub Pages to serve the updated live widget.
**Closed:** Local Germany vs Curaçao final score update is complete.

**Next session should:** Continue with the next score-check-due unscored match only after its kickoff + ~2h30 window.

## 2026-06-14 — Codex (Berlin Battle hero overlay fix)

**Did:** Revised the Berlin Battle hero/mode-card transition so the cards overlay the hero instead of sitting in a detached green band.

**Changed:**
- `berlin-battle-page/berlin-battle-page-element.js` — `.bw-battle-strip` now uses a transparent-to-green overlay gradient, negative top margin, stronger card backgrounds, and shadows.
- `berlin-battle-page/berlin-battle-page-element.js` — game iframe cache-buster bumped to `share-hero-overlay-fix-20260614`.
- `berlin-battle-page/README.md` — Wix snippet bumped to `?v=share-hero-overlay-fix-20260614`.
- `../SESSION_LOG.md` and automation memory — recorded the overlay fix.

**QA:** Wrapper JS syntax, game inline script parse, and `git diff --check` passed. Local server logs confirmed wrapper loads the new game iframe URL with `v=share-hero-overlay-fix-20260614`; deeper Browser QA timed out, so live visual still needs post-deploy manual check.

**Opened:** Push/deploy and update/publish the Wix snippet with `?v=share-hero-overlay-fix-20260614`, then verify the live hero transition and mobile Share result.
**Closed:** Local overlay-style hero fix is ready.

**Next session should:** Cold-load live `/games/berlin-battle` after deploy and visually inspect the hero/mode-card transition.

## 2026-06-14 — Codex (Trip Planner preview + email gate)

**Did:** Implemented the Trip Planner conversion tweak Yusuf approved: long form stays, Day 1 gives more value before the gate, and the gate now feels like emailing the finished plan to yourself. **Changed:** `ultimate-berlin-trip-planner/index.html` now renders 3 Day 1 preview cards when possible, adds a `Why this Day 1 works` route/weather/watch-out proof block, fills the locked preview from the generated plan (`Day 2`, `Day 3`, remaining days, maps, backups, PDF), and changes visible gate copy to `Send the full Berlin plan to yourself` / `Email me my full plan`; `ultimate-berlin-trip-planner/launch-audit.mjs` now checks the new preview/gate behavior. **QA:** Inline JS parse passed, `git diff --check` passed, launch audit passed the updated Trip Planner checks but still has 4 unrelated existing blockers, and local Browser QA on desktop 1280px plus mobile 390px confirmed 3 preview cards, 3 proof items, 6 dynamic locked rows, correct CTA, and no horizontal overflow. **Opened:** deploy/publish and watch gate-to-email conversion. **Closed:** local preview/gate optimization is ready.

## 2026-06-14 — Codex (Berlin Battle share restore + hero gap)

**Did:** Restored the visible `Share result` button on Berlin Battle results and tightened the dedicated Games page hero spacing.

**Changed:**
- `berlin-battle/index.html` — result actions always include `Share result`; mobile/native-share still uses Web Share, desktop fallback-copies text + link with a clear status.
- `berlin-battle-page/berlin-battle-page-element.js` — hero height/padding and mode-strip padding tightened; iframe game cache-buster set to `share-hero-fix-20260614`.
- `berlin-battle-page/README.md` — Wix snippet bumped to `?v=share-hero-fix-20260614`.
- `../SESSION_LOG.md` and automation memory — recorded the fix.

**QA:** Game inline script parse, wrapper JS syntax, and `git diff --check` passed. Local browser QA measured hero-to-strip gap 0, iframe version `share-hero-fix-20260614`, overflow 0; completed 15-choice game and result buttons were `Download share card`, `Copy text + link`, `Share result`.

**Opened:** Push/deploy and update/publish the Wix snippet with `?v=share-hero-fix-20260614`, then verify live mobile share and desktop fallback.
**Closed:** Local share-button visibility and hero-gap fixes are ready.

**Next session should:** Cold-load live `/games/berlin-battle` after deploy on mobile and desktop.

## 2026-06-14 — Codex (Berlin Battle result UI polish)

**Did:** Cleaned up the Berlin Battle result share panel after Yusuf flagged ambiguous button copy and tight share-card spacing.

**Changed:**
- `berlin-battle/index.html` — `Copy caption` is now `Copy text + link`; desktop/non-native-share result actions show only `Download share card` and `Copy text + link`; mobile native-share devices still get `Share result`; copy status text updated.
- `berlin-battle/index.html` — share-card result explanation moved up and `berlinwalk.com` moved slightly lower for clearer spacing.
- `berlin-battle-page/berlin-battle-page-element.js` and `README.md` — cache-busters bumped to `label-spacing-fix-20260614`.
- `../SESSION_LOG.md` and automation memory — recorded the polish pass.

**QA:** Game inline script parse, wrapper JS syntax, and `git diff --check` passed. Local browser QA completed a desktop game to result screen: buttons were `Download share card` and `Copy text + link`, no duplicate Share button, canvas present, and horizontal overflow 0.

**Opened:** Push/deploy, update/publish the Wix snippet with `?v=label-spacing-fix-20260614`, then verify live desktop/mobile result screens and card spacing.
**Closed:** Local result button copy and share-card spacing fixes are ready.

**Next session should:** Cold-load live `/games/berlin-battle` after deploy and confirm desktop/mobile button variants.

## 2026-06-14 — Codex (Berlin Battle desktop share fallback)

**Did:** Made Berlin Battle desktop sharing deterministic after Yusuf confirmed mobile native share works but desktop does not.

**Changed:**
- `berlin-battle/index.html` — desktop/non-mobile result button now reads `Copy share text` and copies the share caption/link directly instead of trying native `navigator.share` first.
- `berlin-battle-page/berlin-battle-page-element.js` — game iframe URL now includes `v=desktop-share-fix-20260614`.
- `berlin-battle-page/README.md` — Wix snippet now uses `berlin-battle-page-element.js?v=desktop-share-fix-20260614`.
- `../SESSION_LOG.md` and automation memory — recorded the desktop fallback rule.

**QA:** `node --check berlin-battle-page/berlin-battle-page-element.js`, game inline script parse, and `git diff --check` passed. Local HTTP checks confirmed the edited wrapper/game files serve the new permission/version/desktop-copy logic. Browser navigation QA timed out, so live desktop click still needs manual verification after deploy.

**Opened:** Push/deploy, update/publish the Wix snippet with the new cache-buster, then verify desktop result screen shows `Copy share text` and copies the caption/link.
**Closed:** Local desktop share behavior no longer depends on native Web Share API.

**Next session should:** Cold-load the live page after deploy and confirm mobile still shows native `Share result` while desktop shows/copies `Copy share text`.

## 2026-06-14 — Codex (Berlin Battle share permission fix)

**Did:** Fixed the likely cause of the live Berlin Battle `Share result` failure on the dedicated Games page.

**Changed:**
- `berlin-battle-page/berlin-battle-page-element.js` — added `allow="web-share; clipboard-write"` to the embedded game iframe.
- `berlin-battle-page/README.md` — changed the Wix script snippet to `?v=share-fix-20260614` so the page can bust cached JS after deploy.
- `../SESSION_LOG.md` and automation memory — recorded the fix.

**QA:** `node --check berlin-battle-page/berlin-battle-page-element.js` and `git diff --check` passed. Local browser QA confirmed the rendered iframe has `allow: "web-share; clipboard-write"`, `scrolling="no"`, and horizontal overflow 0.

**Opened:** Push/deploy this repo, then update/publish the Wix `/games/berlin-battle` custom code with the cache-busted script URL and verify Share result on a real mobile browser.
**Closed:** Local iframe permission fix is ready.

**Next session should:** After deploy, cold-load `/games/berlin-battle` and confirm the game iframe allow attribute plus result share/copy behavior.

## 2026-06-14 — Codex (Berlin Battle page wrapper)

**Did:** Built the short custom-element wrapper for the dedicated Wix `/games/berlin-battle` page, not the future Games hub.

**Changed:**
- `berlin-battle-page/` — added `index.html`, `berlin-battle-page-element.js`, `README.md`, and `SEO_SETTINGS.md`.
- `../PROJECT_MEMORY.md`, `../SESSION_LOG.md`, and automation memory — recorded the wrapper snippet and deployment state.

**QA:** `node --check berlin-battle-page/berlin-battle-page-element.js` and `git diff --check` passed. Browser QA at 1280x720 and 390x844 showed no horizontal overflow, correct game iframe URL, 3 loaded images, 3 mode cards, correct route/booking links, and fixed mobile final CTA sizing. Live `https://www.berlinwalk.com/games/berlin-battle` returned 200 before the new wrapper was embedded.

**Opened:** Push/deploy this repo, then paste the README snippet into Wix `/games/berlin-battle` and verify the live page.
**Closed:** The dedicated Berlin Battle page wrapper is ready locally.

**Next session should:** Deploy GitHub Pages, cold-load `/berlin-battle-page/`, then verify the Wix page after custom code installation.

## 2026-06-14 — Codex (Berlin Battle social image)

**Did:** Created the social/featured image for the `Berlin Battle` Games page.

**Changed:**
- `berlin-battle/assets/social/berlin-battle-social-1200x630.jpg` and `.png` — final Open Graph image exports.
- `berlin-battle/assets/source/berlin-battle-social-og-source-20260614.png` and `PROMPTS.md` — source image and prompt notes.
- Wix Media: uploaded image `5a08a3_4238f52e31c8461097da1d276ce6f8e4~mv2.jpg`.
- `../PROJECT_MEMORY.md`, `../SESSION_LOG.md`, and automation memory — recorded the image ID and URL.

**QA:** Final JPG is 1200x630, 209KB, visually checked, and Wix static URL returned 200 `image/jpeg`.

**Opened:** Choose the uploaded Wix Media image in the `/games/berlin-battle` Social Share panel, then verify live OG tags after publish.
**Closed:** Social/featured image asset is ready for the Berlin Battle page.

**Next session should:** Push/deploy the widget repo, publish the Wix Games page, then verify the live social preview.

## 2026-06-14 — Codex (Berlin Battle cover/scroll correction)

**Did:** Replaced the mixed opening-game visuals with standardized generated Games cover art and tightened the embed layout to avoid internal scrolling on the opening screen.

**Changed:**
- `berlin-battle/assets/topics/` — added 4 optimized 960x600 `.webp` topic covers for Food, District, Museum, and Night battles.
- `berlin-battle/assets/source/` — saved the raw generated sprite sheet, contact sheet, and prompt/standard notes.
- `berlin-battle/data.json` — wired the four topic cards to the new generated cover art.
- `berlin-battle/index.html` — changed the opening grid to a compact Games shelf, added explicit parent `bw-resize` posts after render/image/canvas changes, and prepared share/result URLs for `/games/berlin-battle`.
- `../BERLINWALK_BRAND_REFERENCE.md`, `../PROJECT_MEMORY.md`, and automation memory — recorded the BerlinWalk Games cover-art standard.

**QA:** JSON parse, inline JS syntax, 960x600 image dimensions, and `git diff --check` passed. Browser QA passed locally: 1280x720 opening shell is 435px with 4 loaded topic images, no internal scroll and horizontal overflow 0; 390x844 opening shell is 526px, two-column cards, no internal scroll and horizontal overflow 0; playable game flow completed 15 choices with result canvas present. Local iframe embed simulation resized from 320px to 460px on load and 741px after starting the game.

**Opened:** Push/deploy still needed before GitHub Pages and Wix embeds show the new cover art/layout. Wix `/games/berlin-battle` page still needs to be created/published in Wix Editor before the prepared Games URL works publicly.
**Closed:** Opening game cards no longer mix food photos, tool icons, and route photos; the opening embed screen no longer scrolls in local/iframe QA.

**Next session should:** Push/deploy this repo, then create the Wix Games page and verify `/games/berlin-battle` before replacing or redirecting `/tools/berlin-battle`.

## 2026-06-14 — Codex (Berlin Battle Games/layout revision)

**Did:** Revised Berlin Battle so it no longer feels like a normal BerlinTools directory item, and fixed Yusuf's opening-screen/matchup layout feedback.

**Changed:**
- `berlin-battle/index.html` — compact Games-style hero, image-based topic cards, smaller game header, desktop/mobile side-by-side VS matchup grid, and mobile path hiding.
- `berlin-battle/data.json` — added topic image paths for food, districts, museums, and nightlife.
- `tools-hub/data.json` — marked `berlin-battle` as `hidden` and `surface: "Games"` so it will disappear from BerlinTools/widgets listings after deploy.
- `widgets-hub/SEO_ADDITIONAL_TAGS.md` — regenerated visible widget ItemList from 52 to 51.
- `../SESSION_LOG.md` and `../PROJECT_MEMORY.md` — recorded the local revision and open Wix Games-page step.

**QA:** Data validation, inline script parse, and `git diff --check` passed. Local browser QA passed at `http://127.0.0.1:8765/berlin-battle/`: topic screen has 4 loaded images and no initial letters; desktop 1280x720 matchup cards are side-by-side and fully visible; mobile 390x844 matchup cards stay side-by-side with VS centered, no path clutter, and overflow 0. Terminal Playwright smoke completed 15 choices, first-round 16 unique items, final winner, 15 choice events + 1 complete event, and nonblank 1080x1350 share canvas.

**Opened:** Push/deploy this repo. Then create/publish a dedicated Wix Games surface (`/games/berlin-battle` or `/games`) and only then decide what to do with the existing `/tools/berlin-battle` CMS route.
**Closed:** Initial Berlin Battle opening-screen and mobile/desktop matchup layout issues are fixed locally.

**Next session should:** Deploy, cold-load `/berlin-battle/`, `/berlin-tools`, and `/widgets`, then wire the Wix Games page if approved.

## 2026-06-14 — Codex (Berlin Battle post-push QA)

**Did:** Verified Yusuf's push/deploy for the Berlin Battle widget.

**Changed:**
- `../PROJECT_MEMORY.md` and `../SESSION_LOG.md` — recorded the live deployment verification.
- `SESSION_LOG.md` — added this widget-repo verification note.

**QA:** Local `main` and `origin/main` both point to `15c1c08`. GitHub Pages returns 200 for `/berlin-battle/`, `/berlin-battle/data.json`, and `/tools-hub/data.json`; deployed `data.json` has 4 topics and 16 food items. Live Playwright QA passed for direct GitHub Pages widget: 15 choices, unique first-round 16 items, final winner, 15 choice events + 1 complete event, nonblank canvas, loaded images, and no overflow. Live `/tools/berlin-battle` embeds the GitHub Pages iframe; desktop/mobile overflow is 0. Live `/berlin-tools` shows the Berlin Battle card and loads the 512px Wix icon.

**Opened:** none
**Closed:** Berlin Battle is live on GitHub Pages and embedded correctly in Wix.

**Next session should:** Monitor usage/share behavior, then choose/build the next battle topic.

## 2026-06-14 — Codex (Berlin Battle MVP)

**Did:** Built the first `Berlin Battle` tournament widget with playable `Berlin Food Battle`, coming-soon topic cards, 16 generated food assets, result share card, and BerlinTools integration.

**Changed:**
- `berlin-battle/` — added standalone `index.html`, `data.json`, 16 `assets/cards/*.webp`, source image/prompt notes, randomized bracket flow, analytics events, booking CTA, and download/copy/share result actions.
- `tools-hub/data.json` — added `Berlin Battle` under Discovery.
- `tools-home/icons/` — added generated standard-style Berlin Battle icons and manifest/cache/summary entries; Wix Media icon is `5a08a3_fc6b345c36174e69abc9bb38bed99552~mv2.png`.
- `widgets-hub/_regenerate_seo.py` and `widgets-hub/SEO_ADDITIONAL_TAGS.md` — compacted JSON-LD output to 5625 chars for Wix's 7000-char limit.
- Wix/CMS from root scripts: BerlinTools Layout Fixes updated to revision 20; BerlinTools CMS row inserted as `9faf024a-3614-4da2-a25d-a28947e3090e`.

**QA:** Data validation, inline script parse, 16 card dimensions, 512/160 icon dimensions, `git diff --check`, and Playwright desktop/mobile QA passed. Browser/Playwright confirmed 15 choices, unique first-round 16 items, loaded images, final winner, nonblank share-card canvas, downloadable PNG, copied caption, no horizontal overflow, and no console errors. Live Wix tool page returns 200, but the GitHub Pages widget target still needs deploy.

**Opened:** Push/deploy this repo before `/berlin-battle/` and the hub data/icon updates are live on GitHub Pages.
**Closed:** Berlin Battle MVP is ready locally and wired into Wix CMS/icon/layout surfaces.

**Next session should:** Push/deploy, then cold-load `/tools/berlin-battle`, `/berlin-tools`, and the GitHub Pages `/berlin-battle/` widget URL.

## 2026-06-14 — Codex (World Cup score update)

**Did:** Added the morning final scores for the World Cup fixtures widget.

**Changed:**
- `worldcup-fixtures/index.html` — Brazil vs Morocco is now `1-1 FT`, Haiti vs Scotland is now `0-1 FT`, Australia vs Türkiye is now `2-0 FT`; `SCORE_UPDATED` is `14 Jun 2026, 08:58 CEST`.

**QA:** Berlin time was `2026-06-14 08:58 CEST`; those three unscored matches were due for score check. FIFA match report/round-up supported the Brazil/Morocco and Scotland/Haiti results, and Guardian, SBS, FOX/Bleacher Report plus ESPN/Guardian cross-checks agreed on the final scores. Local JS parse/smoke, final-row count (`8`), desktop/mobile overflow checks, and `git diff --check` passed after the edit.

**Opened:** Push/deploy still needed before GitHub Pages serves these scores live.
**Closed:** Three newly completed due matches were scored locally.

**Next session should:** Continue with the next scheduled score window and leave existing scored rows untouched unless a verified correction appears.

## 2026-06-14 — Codex (Trip Planner quiz flow implementation)

Implemented the Ultimate Berlin Trip Planner one-question-at-a-time quiz flow in `ultimate-berlin-trip-planner/index.html`: quiz progress shell, 12-step sequencing, Back/Next controls, single-choice auto-advance, multi-choice manual Next, final build CTA, and quiz tracking events. QA passed with local browser full-flow assertion, mobile 390px no-overflow check, inline script parse, and `git diff --check`; no live Wix, Meta, Google, ads, budgets, email, or social systems were changed. Next: push/deploy `berlinwalk-widgets`, cold-load `/berlin-trip-planner`, and monitor quiz-step/build/unlock events before adding paid pressure.

## 2026-06-13 — Codex (World Cup score update)

**Did:** Added the late-evening final score for the World Cup fixtures widget.

**Changed:**
- `worldcup-fixtures/index.html` — Qatar vs Switzerland is now `1-1 FT`; `SCORE_UPDATED` is `13 Jun 2026, 23:31 CEST`.

**QA:** Berlin time was `2026-06-13 23:30 CEST`; Qatar - Switzerland was the only unscored match due for score check. FIFA pages were checked but did not expose final score text in fetched HTML; ESPN final-score metadata and Guardian live coverage/summary both supported Qatar 1-1 Switzerland. Local JS parse/smoke, final-row count, desktop/mobile overflow checks, and `git diff --check` passed after the edit.

**Opened:** Push/deploy still needed before GitHub Pages serves this score live.
**Closed:** One newly completed due match was scored locally.

**Next session should:** Continue with the next scheduled score window and leave existing scored rows untouched unless a verified correction appears.

## 2026-06-13 — Codex (Footer link refresh)

**Did:** Audited the live global footer links and target-page content, then refreshed stale/redundant items and fixed the FAQ anchor.

**Changed:**
- `site-footer/site-footer-element.js` — footer `Berlin Hacks` label is now `Berlin Tools`; Practical Berlin replaces duplicate `Meeting Point Map` with `Berlin City Tax`.
- `faq/faq-element.js` — homepage FAQ custom element assigns `id="faq"` and repeatedly scrolls into view for `/#faq` so Wix layout shifts do not leave users above the section.
- `../berlinwalk-footer-social-links.html`, `../scripts/update-footer-social-links-embed.mjs` — live Wix patch source/updater now also handles footer link refresh and FAQ scroll.
- `../berlinwalk-booking-funnel-hotfix.html`, `../scripts/update-booking-funnel-hotfix-embed.mjs` — booking flow hotfix now corrects the stale `Custom Booking Calendar` browser title/meta/canonical on the footer's `Book Now` target page.
- `../PROJECT_MEMORY.md`, `../SESSION_LOG.md` — recorded live revision and push requirement.
- Wix: updated Custom Embed `BerlinWalk Footer Social Links` (`57ef17ae-2f85-468a-9967-fd11227bef77`) to revision 3.
- Wix: updated Custom Embed `BerlinWalk Booking Funnel Hotfix` (`c6a6090d-3177-43ab-88a7-877abe438912`) to revision 8.

**QA:** All live internal footer URLs returned 200 and rendered meaningful target content. Live homepage footer now shows `Berlin Tools` and `Berlin City Tax`, not `Berlin Hacks` or `Meeting Point Map`; social row count is 1. Live `/#faq` QA with cache-bust scrolled to the FAQ (`faqTop=0`). Live booking page now shows `Book Your Free Berlin Walking Tour | BerlinWalk`, no old `Custom Booking Calendar` title, correct meta/canonical, and the calendar still renders. Mobile 390px live footer overflow was `0`. Local `node --check` passed for footer/FAQ/update scripts, local footer preview and FAQ anchor test passed, and `git diff --check` passed.

**Opened:** Push/deploy this repo so GitHub Pages serves the footer link refresh and FAQ anchor fix durably; the live Wix Custom Embed already patches current production.
**Closed:** Footer link/content refresh is live via Wix patch and ready locally for durable deploy.

**Next session should:** After push, cold-load the live homepage footer and `/#faq`; keep the patch enabled unless duplicate behavior appears.

## 2026-06-13 — Codex (Booking calendar UTM preservation)

**Did:** Checked the published direct booking campaign UTM chain and fixed a local creative-level attribution weakness in the reusable booking calendar.

**Changed:**
- `booking-calendar/booking-calendar-element.js` — `_bookingHref()` now preserves incoming `utm_content` when building `/booking-form` links and only falls back to `booking_calendar` when no incoming content exists.
- `../PROJECT_MEMORY.md`, `../SESSION_LOG.md` — recorded that campaign-level and landing-page tracking are aligned, and this widget fix still needs push/deploy.

**QA:** `node --check booking-calendar/booking-calendar-element.js` passed. Meta readback showed all 8 direct booking ads active with matching campaign/content/term URL tags, and Wix `PaidFunnelEvents` already had 16 landing-page rows under `bw_booking_direct_conversion_jun2026` split across the four `bd_*` creative slugs and both ad set terms. Live GitHub Pages still serves the old calendar JS, so this fix is not live until push.

**Opened:** Push `berlinwalk-widgets` and verify the deployed `booking-calendar-element.js` no longer sets `utm_content=booking_calendar` before copying incoming UTMs.
**Closed:** Local booking calendar now preserves ad creative UTM content through the booking-form link.

**Next session should:** After deploy, click a live paid-landing calendar link with a test UTM and confirm `/booking-form` keeps the original `utm_content`.

## 2026-06-13 — Codex (City Tax icon standard fix)

**Did:** Replaced the Berlin City Tax Calculator card icon with a matching BerlinTools glossy 3D icon and tightened future icon rules.

**Changed:**
- `tools-home/icons/` — added City Tax 512/160 RGBA PNGs, ChatGPT browser source output, prompt note, standard-set copies, manifest entries, and Wix Media upload cache/summary.
- `tools-hub/data.json` — wired `berlin-city-tax-calculator` to the uploaded Wix Media icon URL.
- `AGENTS.md`, `../BERLINWALK_BRAND_REFERENCE.md`, `../PROJECT_MEMORY.md`, automation memory — recorded that BerlinTools icons are mandatory and must match the single glossy 3D family.

**QA:** Final selected icon has transparent/cream corners, no black vignette, no text/letters/numbers, 512/160 RGBA output, a green glossy tile, yellow medallion, and receipt/bed/percent motif matching Tip/Parking/Connectivity. Wix Media upload created `5a08a3_7b199fe54d6a4f9d86224419e105cc51~mv2.png`. Local tools hub QA found 51 cards, City Tax image loaded at 512x512 into a 56x56 card slot, and overflow was `0`. Wix Custom Embed `BerlinTools Layout Fixes` icon map updated to revision 18 with `berlin-city-tax-calculator`; live `/berlin-tools` verified the City Tax card now loads the new Wix Media icon at 512x512. JSON parse checks and `git diff --check` passed.

**Opened:** Push/deploy still needed so the repo/data source includes the new icon and strict icon-rule updates; live `/berlin-tools` already shows the icon through the updated Wix embed.
**Closed:** City Tax card now has a standard BerlinTools icon locally and in Wix Media.

**Next session should:** After push, cold-load `/berlin-tools` and verify the City Tax card icon.

## 2026-06-13 — Codex (City Tax post-publish index)

**Did:** Finished post-publish follow-up for the live Berlin City Tax article.

**Changed:**
- `scripts/generate-blog-index-data.mjs` — added `berlin-city-tax` to Practical Berlin rules/required slugs and mapped City Tax/accommodation tax terms to `berlin-city-tax-calculator`.
- `blog-index/data.json` — regenerated from live Wix Blog with 120 posts; City Tax is Latest #1, All Posts #1, and in the Practical Berlin shelf.
- `output/qa/faq-seo-audit-city-tax-live-20260613.md` — saved live FAQ audit output.
- `../PROJECT_MEMORY.md`, `../SESSION_LOG.md`, automation memory — recorded post-publish verification and new visual-source preference.

**QA:** Live post HTML contains Quick Summary, calculator, FAQ, `faq/inject.js`, canonical, robots `max-image-preview:large`, and title keyword. GitHub Pages serves `berlin-city-tax-calculator/`, `quick-summary/`, `faq/`, and `faq/inject.js`; the live injector includes `berlin-city-tax`. `git diff --check` passed.

**Opened:** Push/deploy needed for the refreshed `/blog` index data and generator rules.
**Closed:** City Tax live post has working deployed widget/QS/FAQ assets.

**Next session should:** After push, verify `/blog` shows City Tax in Latest and Practical Berlin.

## 2026-06-13 — Codex (Trip Planner second post-push QA)

**Did:** Re-tested live `/berlin-trip-planner` after Yusuf pushed again.

**Changed:**
- `../SESSION_LOG.md`, `../PROJECT_MEMORY.md`, automation memory — recorded the repeated live QA.
- Wix Data: deleted 7 live test `TripPlannerEvents` rows tagged `utm_content=codex_second_push_20260613`; remaining test rows `0`.

**QA:** `origin/main` matched local `main` at `4fe2337`, GitHub Pages still served the form-first `is-page-embed` widget HTML, and 390px live mobile QA passed. Iframe starts directly on `Arrival date`, duplicate internal hero is gone, hero CTA scrolls iframe to `top=1`, overflow is `0`, parent `dataLayer` receives `page_view/start/weather/details_view/build_click/result/gate_view`, and console has no errors.

**Opened:** Monitor real paid traffic for engaged starts/builds, not raw widget-load starts.
**Closed:** Second post-push live QA confirmed the fix remains live.

**Next session should:** Review dashboard metrics after new Meta sessions accrue.

## 2026-06-13 — Codex (Trip Planner post-push live QA passed)

**Did:** Re-tested live `/berlin-trip-planner` after Yusuf pushed the missing widget commit.

**Changed:**
- `../SESSION_LOG.md`, `../PROJECT_MEMORY.md`, automation memory — recorded the successful post-push QA.
- Wix Data: deleted 7 live test `TripPlannerEvents` rows tagged `utm_content=codex_after_push_20260613`; remaining test rows `0`.

**QA:** `origin/main` now matches local `main`; GitHub Pages serves `ultimate-berlin-trip-planner/index.html` with `is-page-embed` (`Last-Modified: 2026-06-13 05:43:11 GMT`). Mobile live QA at 390px passed: iframe starts directly at `Arrival date`, duplicate internal hero is gone, hero CTA scrolls to iframe `top≈1px`, overflow is `0`, and parent `dataLayer` received `page_view/start/weather/details_view/build_click/gate_view/result`. Console had no errors, only Wix preload warnings.

**Opened:** Monitor real paid sessions for engaged starts/builds; raw `bw_trip_planner_start` is still a widget-load event, not a true engagement event.
**Closed:** Post-push live Trip Planner form-first path is verified.

**Next session should:** Review the Trip Planner dashboard after fresh traffic and compare passive loads with engaged starts/builds.

## 2026-06-13 — Codex (Trip Planner live publish QA)

**Did:** Re-tested the live Wix `/berlin-trip-planner` page after Yusuf said it was published.

**Changed:**
- `../SESSION_LOG.md`, `../PROJECT_MEMORY.md`, automation memory — recorded the live QA result.
- Wix Data: deleted 3 live test `TripPlannerEvents` rows tagged `utm_content=codex_after_publish_20260613`; remaining test rows `0`.

**QA:** Mobile 390px live QA showed the wrapper hero `Build my plan` CTA now scrolls to the iframe top (`top≈1px`), but the live GitHub Pages widget HTML still lacks the local `is-page-embed` change and still shows the duplicate internal `Ultimate Berlin Trip Planner` hero before the form. `main` is clean locally but `main...origin/main [ahead 1]`; commit `eb6942d Update index.html` has the missing `ultimate-berlin-trip-planner/index.html` fix.

**Opened:** Push `eb6942d` to GitHub, wait for GitHub Pages, cache-bust the live page, then verify the iframe begins directly at `Arrival date`. Review that `bw_trip_planner_start` currently fired on first widget load during QA, before a manual click.
**Closed:** Confirmed the remaining live issue is deploy/push state, not a new Wix wrapper break.

**Next session should:** Push/sync the ahead commit and re-run the mobile live QA.

## 2026-06-13 — Codex (Trip Planner paid-start regression tested)

**Did:** Tested Yusuf's concern that Trip Planner starts dropped to zero after the two-step change, then applied a local conversion-path fix.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — detects the `/berlin-trip-planner` page embed via `source=berlin_trip_planner_page` / `parent_path=/berlin-trip-planner` and hides the duplicate internal widget hero so the form starts immediately inside the iframe.
- `berlin-trip-planner-page/berlin-trip-planner-page-element.js` — hero `Build my plan` anchors now scroll directly to the widget shell instead of the wrapper section heading.
- `../PROJECT_MEMORY.md`, `../SESSION_LOG.md` — recorded the test and pending deploy note.

**QA:** Live test showed the technical chain works: direct widget and Wix wrapper both emit `details_view`, `build_click`, `gate_view`, and `result` into tracking when clicked. The real problem was UX depth: live mobile first load had the iframe at `top=1360px`, and after hero CTA the iframe still sat at `top=353px` with a second internal hero before the form. Local fixed preview at 390px moves the iframe to `top=1px` after hero CTA and starts the iframe on `Arrival date`; parent `dataLayer` still receives `page_view/start/weather/details_view/build_click/gate_view/result`, and horizontal overflow is `0`. Test TripPlannerEvents rows with `utm_content=codex_live_test` / `codex_live_wrapper` were deleted from Wix; remaining test rows `0`. Inline JS parse and `git diff --check` passed for the touched files.

**Opened:** Push/deploy `berlinwalk-widgets`; live Wix still has the old deeper paid-start path until GitHub Pages updates.
**Closed:** The zero-start drop was not a broken click handler or event bridge; it was mostly the paid page burying the actual start behind scroll + duplicate iframe hero + extra click.

**Next session should:** After push, cache-bust `/berlin-trip-planner` and verify mobile hero CTA lands with the planner form immediately visible.

## 2026-06-13 — Codex (World Cup score automation reduced)

**Did:** Reduced the World Cup fixture score updater to three daily runs.

**Changed:**
- `/Users/yusufucuz/.codex/automations/berlinwalk-worldcup-fixtures-update/automation.toml` — now runs at `08:30`, `16:30`, and `23:30` Europe/Berlin.
- `/Users/yusufucuz/.codex/automations/berlinwalk-worldcup-fixtures-update-0400/automation.toml` — old 04:00 edge-slot automation is `PAUSED`.
- `../PROJECT_MEMORY.md`, `../SESSION_LOG.md` — mirrored durable status.

**QA:** Checked TOML status/rrule shape after edits; the active prompt now prioritizes due scores from the last 10 hours to fit the three daily runs. No widget files were changed for this scheduling-only update.

**Opened:** Existing unpushed widget score changes still need push/deploy before live users see them.
**Closed:** Half-hour score polling is replaced by three daily checks.

**Next session should:** Use the active three-run automation for future score additions.

## 2026-06-13 — Codex (World Cup USA-Paraguay score added)

**Did:** Added United States 4-1 Paraguay as the fourth completed FIFA World Cup fixture result.

**Changed:**
- `worldcup-fixtures/index.html` — updated `SCORE_UPDATED` to `13 Jun 2026, 05:31 CEST` and changed United States vs Paraguay to `[4,1,'FT']`.
- `../SESSION_LOG.md` — mirrored the score update.

**QA:** Due-window check found only the 03:00 Berlin kick-off as newly score-check-due. FIFA match centre was checked but did not expose a final score in accessible HTML; AP, Guardian, and U.S. Soccer all matched on `4-1`. Inline M-array smoke returned 72 fixtures, 4 scored rows, and no overdue unscored rows. Extracted script syntax passed; Playwright local QA at 1280px and 390px showed 4 `.bw-match.final` rows and overflow `0`. `git diff --check` passed.

**Opened:** Push/deploy still needed for GitHub Pages/live Wix to show the fourth score.
**Closed:** United States-Paraguay score is added locally.

**Next session should:** Keep the automation no-op unless another match is final and past kick-off + about 2h30.

## 2026-06-13 — Codex (Berlin City Tax draft/tool)

**Did:** Built the daily blog draft widget package for `Berlin City Tax: What Tourists Pay on Hotels in 2026`.

**Changed:**
- `berlin-city-tax-calculator/index.html` — new responsive calculator for Berlin's 7.5% accommodation tax, with gross/net price handling and mobile-safe layout.
- `blog-drafts/berlin-city-tax.md` — full local Wix Blog markdown draft with Quick Summary, calculator, FAQ, official source links, image credits, and internal links.
- `blog-drafts/images/berlin-city-tax/` — raw and optimized Wikimedia Commons images plus `visual-sources.md`.
- `quick-summary/data.json`, `faq/data.json`, `faq/slug-map.json`, `faq/inject.js` — added `berlin-city-tax` data and regenerated parent-page FAQ JSON-LD.
- `tools-hub/data.json` — added `berlin-city-tax-calculator` under Money; not added to `tools-home`.
- `../PROJECT_MEMORY.md`, `../SESSION_LOG.md` — recorded Wix draft/tool IDs and push requirement.

**QA:** Local browser QA at 1280px and 390px passed for the calculator: correct EUR 25.23 default estimate, attribution badge present, horizontal overflow `0`, console errors `0`. Local Quick Summary and FAQ URLs render 5 items / 6 questions on mobile with overflow `0`. `node scripts/audit-faq-seo.mjs` passed with no missing slug refs or Markdown leaks.

**Opened:** Push/deploy required before GitHub Pages serves the new widget and updated QS/FAQ/tool data to the Wix draft embeds.
**Closed:** Local widget/data package for the City Tax draft is complete.

**Next session should:** After push, cold-load `https://fenerszymanski.github.io/berlinwalk-widgets/berlin-city-tax-calculator/?cb=YYYYMMDD` and verify `/tools/berlin-city-tax-calculator`.

## 2026-06-12 — Codex (World Cup score-slot automation)

**Did:** Changed the World Cup score updater from daily 08:30 polling to expected post-match score-check slots.

**Changed:**
- `/Users/yusufucuz/.codex/automations/berlinwalk-worldcup-fixtures-update/automation.toml` — now runs on half-hour score-check slots derived from kick-off + about 2h30 (`00:30`, `01:30`, `02:30`, `03:30`, `04:30`, `05:30`, `06:30`, `07:30`, `08:30`, `20:30`, `21:30`, `23:30` Europe/Berlin).
- `/Users/yusufucuz/.codex/automations/berlinwalk-worldcup-fixtures-update-0400/automation.toml` — added active 04:00 Europe/Berlin edge-slot automation for 01:30 kick-offs.
- `../PROJECT_MEMORY.md`, `../SESSION_LOG.md` — mirrored durable state.

**QA:** Automation smoke check passed for both TOML files: active status, prompt block shape, rrule presence, and no-op instruction. No widget code changed in this follow-up.

**Opened:** No-op automation runs should not edit files or append logs.
**Closed:** Daily-only score polling has been replaced with post-match slot polling.

**Next session should:** After the next match finishes, confirm the score-slot automation updates only the due final score.

## 2026-06-12 — Codex (Canada-Bosnia score added)

**Did:** Added Canada 1-1 Bosnia and Herzegovina as the third completed FIFA World Cup fixture result.

**Changed:**
- `worldcup-fixtures/index.html` — updated `SCORE_UPDATED` to `12 Jun 2026, 23:08 CEST` and changed Canada vs Bosnia and Herzegovina to `[1,1,'FT']`.
- `../PROJECT_MEMORY.md`, `../SESSION_LOG.md` — mirrored the score update.

**QA:** Guardian full-time report and Fox play-by-play checked. Inline JS parse passed; final-score rows now count `3`; direct fixture extraction returns Mexico 2-0 South Africa, South Korea 2-1 Czechia, and Canada 1-1 Bosnia and Herzegovina. `git diff --check` passed. In-app Browser localhost QA was blocked by Browser URL policy on this follow-up.

**Opened:** Push/deploy still needed for GitHub Pages/live Wix tool page.
**Closed:** Canada-Bosnia score is added locally.

**Next session should:** After push, cache-bust and verify the live `worldcup-fixtures` widget has 3 final rows.

## 2026-06-12 — Codex (World Cup fixture scores + automation)

**Did:** Updated the FIFA World Cup fixtures widget for the tournament start and installed a daily local score-update automation.

**Changed:**
- `worldcup-fixtures/index.html` — added optional final-score fields in the `M` array, FT display styling, score columns, winner/loss text treatment, `SCORE_UPDATED`, and the first two results: Mexico 2-0 South Africa and South Korea 2-1 Czechia.
- `/Users/yusufucuz/.codex/automations/berlinwalk-worldcup-fixtures-update/automation.toml` — new ACTIVE daily Codex cron at 08:30 Europe/Berlin.
- `../PROJECT_MEMORY.md`, `../SESSION_LOG.md` — mirrored durable state.

**QA:** Scores verified from current web sources: AP for Mexico 2-0 South Africa; Guardian/NDTV/ESPN for South Korea 2-1 Czechia. Inline JS parse passed. In-app Browser QA passed on desktop and 390px mobile: 72 match rows, 2 final rows, correct score text, next match Canada vs Bosnia and Herzegovina, horizontal overflow `0`. `git diff --check` passed. TOML parser libraries were unavailable locally, but the automation file follows the existing Codex automation structure.

**Opened:** Push/deploy required before GitHub Pages/live Wix tool page serves the scored widget.
**Closed:** Local first-score update and daily update automation are complete.

**Next session should:** After push, cache-bust and QA the live GitHub Pages widget and `/tools/world-cup-2026-fixtures-berlin-time`.

## 2026-06-12 — Codex (FAQ SEO hardening)

**Did:** Implemented generator-backed FAQ JSON-LD for blog posts and added a repeatable SEO audit workflow.

**Changed:**
- `faq/slug-map.json` — new source-of-truth mapping from Wix blog slugs to FAQ keys.
- `scripts/generate-faq-inject.mjs` — builds `faq/inject.js` from `faq/data.json` + `faq/slug-map.json`, strips Markdown from schema text, validates missing mapped keys, and emits only mapped blog FAQ schemas.
- `scripts/audit-faq-seo.mjs` — validates generated schema health, Markdown leaks, slug refs, draft/body coverage heuristics, live HTML, and rendered DOM via Playwright CLI fallback.
- `faq/inject.js` — regenerated; fixed `was-your-berlin-address-east-or-west` mapping, kept `pfand-in-germany`, removed Markdown markers from JSON-LD answers, and reduced schema payload to 52 mapped FAQ keys.
- `output/qa/faq-seo-audit-20260612.md`, `output/qa/faq-seo-audit-live-20260612.md`, `output/qa/faq-seo-audit-rendered-20260612.md` — saved audit reports.
- `../berlinwalk-content-app/api/blog-generate.js`, `../PROJECT_MEMORY.md`, `../SESSION_LOG.md` — updated adjacent Content Studio prompt/memory outside this repo.

**QA:** `node --check scripts/generate-faq-inject.mjs`, `node --check scripts/audit-faq-seo.mjs`, `node --check ../berlinwalk-content-app/api/blog-generate.js`, and `git diff --check` passed. Local audit verdict `PASS`: 66 FAQ data entries, 61 slug mappings, 52 injected schema entries, 0 missing refs, 0 Markdown leaks. Live HTML checks for `pfand-in-germany`, `what-is-a-spati-berlin`, and `why-is-berlin-founding-year-1237` found HTTP 200, `faq/inject.js`, and JSON-LD. Rendered DOM checks found `#bw-faq-jsonld` with `FAQPage (6)` on all three.

**Opened:** Push/deploy needed before GitHub Pages serves the regenerated `faq/inject.js` and new audit/generator files.
**Closed:** Local FAQ SEO hardening plan implementation.

**Next session should:** After push, rerun `node scripts/audit-faq-seo.mjs --live --rendered --limit 5 --output output/qa/faq-seo-audit-live-postdeploy-YYYYMMDD.md` and spot-check the GitHub Pages `faq/inject.js` Last-Modified header.

## 2026-06-12 — Codex (Pfand blog indexed)

**Did:** Indexed the published `pfand-in-germany` post into the local blog hub and homepage blog teaser data.

**Changed:**
- `scripts/generate-blog-index-data.mjs` — added `pfand-in-germany` to Practical Berlin and Free & Budget shelf rules and mapped Pfand/deposit posts to `berlin-pfand-calculator`.
- `blog-index/data.json` — regenerated from the live Wix Blog API with 120 posts; Pfand is latest/allPosts position 1 and carries the Wix Media Pfandautomat cover.
- `blog-home/data.json` — added Pfand as the first small note card, keeping the World Cup feature and two existing evergreen/seasonal cards.
- `../PROJECT_MEMORY.md` and `../SESSION_LOG.md` — recorded the published/indexed state.

**QA:** `https://www.berlinwalk.com/post/pfand-in-germany` returned HTTP 200. Keychain-loaded Wix API regeneration succeeded. JSON validation passed for `blog-index/data.json` and `blog-home/data.json`; `node --check scripts/generate-blog-index-data.mjs` passed. Spot check confirmed Pfand is in `latest`, `allPosts`, `practical`, and `free-budget`, with related tool `berlin-pfand-calculator`.

**Opened:** Push/deploy needed before GitHub Pages serves the refreshed `/blog` and homepage blog data.
**Closed:** Local indexing for the published Pfand blog.

**Next session should:** After push, live-QA `/blog` and the homepage blog teaser with a cache-bust query.

## 2026-06-12 — Codex (BerlinTools ChatGPT icon standard)

**Did:** Rebuilt the full BerlinTools card icon family from ChatGPT browser-generated sheets and uploaded the 50-tool standard set to Wix Media.

**Changed:**
- `tools-home/icons/` — replaced canonical 512px/160px PNGs for all 50 live tools and added missing canonical slug files.
- `tools-home/icons/_src/chatgpt-standard-20260612/` — saved the ChatGPT source sheets for tools 1-25 and 26-50.
- `tools-home/icons/chatgpt-standard-2026-06-12/` — saved split 512px/160px category exports, `manifest.json`, `live-tools.json`, `README.md`, `contact-sheet.png`, upload cache, and `wix-upload-summary.json`.
- `scripts/split-chatgpt-tool-icon-sheets.py` — added the reusable sheet splitter/cropper.
- `scripts/upload-chatgpt-tool-icons-to-wix.mjs` — added the Wix Media upload + data wiring helper.
- `tools-hub/data.json`, `tools-home/data.json`, `tools-home/icons/manifest.json` — updated image URLs to the new Wix Media files.
- External Wix Custom Embed `BerlinTools Layout Fixes` — updated the live icon map to revision 17.

**QA:** Local `tools-hub/data.json` and live GitHub Pages data both listed 50 tools before generation. Splitter output count/dimensions passed, contact sheet visual QA passed, JSON parse checks passed, upload dry-run passed, real Wix Media upload completed 50/50, and the live embed update reported no generic slugs.

**Opened:** Push/deploy this repo so GitHub Pages serves the updated `tools-hub/data.json`, `tools-home/data.json`, and icon files; Wix Media assets and the live Custom Embed map are already updated.
**Closed:** Full ChatGPT icon generation, split, Wix upload, data wiring, and live BerlinTools embed map update.

**Next session should:** After push, verify `/berlin-tools`, `/widgets`, homepage tool cards, and a few `/tools/<slug>` related-card sections on desktop/mobile.

## 2026-06-12 — Codex (Daily blog draft: Pfand in Germany)

**Did:** Created the `pfand-in-germany` daily blog draft package with a new `berlin-pfand-calculator/` widget, local QS/FAQ data, visual sources, and tools-hub entry.

**Changed:**
- `blog-drafts/pfand-in-germany.md`, `blog-drafts/images/pfand-in-germany/` — complete public draft and 3 optimized Wikimedia images with credits.
- `berlin-pfand-calculator/index.html`, `quick-summary/data.json`, `faq/data.json`, `faq/inject.js`, `tools-hub/data.json` — new tool/embed support.
- `../berlinwalk-content-app/create-pfand-in-germany-draft.mjs` — one-off Wix draft/CMS helper.
- Wix: Blog draft `f984b28a-5a96-4b03-898e-96b5c4f990b8` is UNPUBLISHED; BerlinTools CMS item `cfc90f68-33b6-4860-91b0-3e36736f7101` returns 200.
- `../PROJECT_MEMORY.md`, `../SESSION_LOG.md` — mirrored durable state.

**QA:** Local widget QA at `127.0.0.1:4189` passed desktop and 390px mobile with horizontal overflow `0`, 4 inputs, 3 preset buttons, and no console errors. Wix draft readback confirmed 121 nodes, 3 HTML embeds, 3 image nodes with alt text, cover/social image, canonical, robots `index, follow, max-image-preview:large`, SEO keywords, and BlogPosting JSON-LD.

**Opened:** Push/deploy `berlinwalk-widgets`; live GitHub Pages currently 404s `berlin-pfand-calculator/` and live QS/FAQ JSON does not include `pfand-in-germany`.
**Closed:** Daily blog draft automation run for 2026-06-12.

**Next session should:** Push the widget repo, wait for GitHub Pages, then preview the Wix draft before Yusuf publishes.

## 2026-06-11 — Codex (Trip Planner guide glance merge)

**Did:**
- Merged the unlocked `Plan at a glance` cards into the Yusuf guide-note panel.
- Kept the day-card click behavior for jumping/focusing the full itinerary.
- Tightened visible guide copy normalization so Gemini/mock guide text preserves Yusuf-led singular voice.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `bw-guide-glance`, moved visual day cards into `Your Berlin plan at a glance`, injected per-day Yusuf notes into each card, made `data-day-jump-bar` render empty, rerendered the guide panel on day-jump clicks, and added `cleanGuidePublicText()` for visible guide output.
- `../PROJECT_MEMORY.md`, `../SESSION_LOG.md` — mirrored local pending state.

**QA:** Inline script parse passed; `git diff --check` passed; Browser local QA at `127.0.0.1:4186` passed desktop and 390px mobile with `qaUnlock=1&mockAi=1&weather=off`: 3 merged guide cards, old separate plan-index `0`, old `.bw-ai-day` cards `0`, full-day count `3`, D2 card click focuses Day 2 and sets status, mobile grid one column (`303px`), overflow `0`, no visible collective `we/our/us` or em dash in the merged guide panel.

**Opened:** Push/deploy/live-QA the merged panel on live `/berlin-trip-planner`.
**Closed:** Local merge of Yusuf note + visual plan glance.

**Next session should:** After pushing `berlinwalk-widgets`, live-QA the unlocked full plan on `/berlin-trip-planner#planner` desktop/mobile and confirm GitHub Pages serves the new `ultimate-berlin-trip-planner/index.html`.

## 2026-06-11 — Codex (Blog booking card live QA)

**Did:**
- Verified Yusuf's push/deploy of the GetYourGuide-style `/post/*` booking card on a real live Wix post.
- Tested desktop and 390px mobile date selection, CTA rewrite, and Booking Form preselection.
- Checked console/network for card-specific failures.

**Changed:**
- `SESSION_LOG.md` — recorded live QA result only; no code changes.
- `../SESSION_LOG.md`, `../PROJECT_MEMORY.md` — mirrored the handoff state.

**QA:** Live GitHub Pages `js/lead-form-inject.js` is byte/SHA-identical to local (`21580` bytes). On `https://www.berlinwalk.com/post/why-is-berlin-founding-year-1237`, card injected on attempt 1, rendered 8 date chips, loaded gallery image 01, kept selected chip white-on-green, had horizontal overflow `0`, and preserved UTM params. Desktop selected `Thu 18 Jun` -> CTA `Reserve Thu 18 Jun · 11:30` -> Booking Form showed `June 18, 2026 at 11:30 am`. Mobile selected `Tue 23 Jun` -> CTA `Reserve Tue 23 Jun · 11:30` -> Booking Form showed `June 23, 2026 at 11:30 am`; CTA center was not blocked by the sticky mobile bar. Evidence: `output/playwright/blog-booking-card-live-desktop.png`, `output/playwright/blog-booking-card-live-mobile-390.png`.

**Opened:** Unrelated live post console issue remains: currently installed `blog-journey-inject.js?v=2` throws `Cannot read properties of undefined (reading 'then')`; booking-card flow still passes.
**Closed:** Post-push live QA blocker for the redesigned blog booking card.

**Next session should:** Keep `lead-form-inject.js` live. If cleaning blog console noise, inspect/update the stale Wix Custom Code `blog-journey-inject.js?v=2` helper separately.

## 2026-06-11 — Codex (Boat Tours blog draft review)

**Did:**
- Re-reviewed the unpublished Boat Tours blog draft for current route/operator accuracy and link quality.
- Rewrote the draft around route-first selection, official operator booking pages, and clearer WelcomeCard caveats.
- Recreated the Wix Blog draft after local edits.

**Changed:**
- `blog-drafts/tickets-boat-tours-river-cruises-berlin.body.md` — removed the duplicated manual Quick Summary block, expanded the route chooser, corrected durations/prices, added official booking links, fixed internal links, and corrected BWSG/Riedel/WelcomeCard language.
- `blog-drafts/tickets-boat-tours-river-cruises-berlin.md` — new Wix draft ID `037bd24b-53c3-45e8-96d3-d2e929e77ac2`, updated metadata, link list, and widget height note.
- `quick-summary/data.json`, `faq/data.json` — Boat Tours QS/FAQ now say current WelcomeCard partner pages list Stern und Kreis, Winkler, and BWSG; Riedel's old page is archived.
- `../create-wix-boat-tours-blog-draft.js` — Boat Finder embed height `920`, updated SEO/excerpt, read time `8`.

**QA:** Official/current sources checked: Stern+Kreis, Winkler, BWSG, WelcomeCard partner pages, visitBerlin, Berlin.de. JSON parse passed; Ricos preview passed (136 nodes, 3 embeds, 26 links); all 19 body links returned HTTP 200; `git diff --check` passed; Wix API recreated the draft and readback verified 136 nodes, 3 embeds, 58 bold decorations, 26 links, slug, and `UNPUBLISHED` status.

**Opened:** Visual QA in Wix editor before publishing; push/deploy pending for the earlier Boat Finder widget code change.
**Closed:** Blog draft inaccuracies around WelcomeCard/Riedel, BWSG, old 404 internal links, and duplicated quick-summary structure.

**Next session should:** Open Wix draft `037bd24b-53c3-45e8-96d3-d2e929e77ac2`, visually inspect spacing/embeds, then publish only after Yusuf approves.

## 2026-06-11 — Codex (Boat Tour Finder official booking links)

**Did:**
- Reworked `berlin-boat-tour-finder` so result logic matches route shape + mood combinations instead of broad OR rules.
- Replaced the old WelcomeCard calculator / walking-tour CTA links with result-specific official booking links.
- Added route-based official booking links to the boat tour blog draft source.

**Changed:**
- `berlin-boat-tour-finder/index.html` — clearer option labels, honest conflict handling for short+canal / food+long choices, official operator links, no final free-tour CTA, no WelcomeCard calculator button.
- `blog-drafts/tickets-boat-tours-river-cruises-berlin.body.md`, `blog-drafts/tickets-boat-tours-river-cruises-berlin.md` — added official booking links by route; WelcomeCard calculator stays in the blog copy.
- `tools-hub/data.json` — raised `berlin-boat-tour-finder` embed height to `920`.

**QA:** Inline script parse passed; JSON parse passed; `git diff --check` passed; Browser local QA passed on desktop and 390px mobile with overflow `0`; default, short+canal, evening, and long+nature combinations return matching official links; all external booking URLs returned HTTP 200. The unpublished BerlinWalk boat post URL currently returns 404, so no blog button is linked from the live widget yet.

**Opened:** Push/deploy this local widget change; after the Wix boat post is published, optionally add its public URL as a result/link or supporting CTA.
**Closed:** Mismatched Boat Tour Finder results and irrelevant widget CTAs.

**Next session should:** Push `berlinwalk-widgets`, then live-QA `https://fenerszymanski.github.io/berlinwalk-widgets/berlin-boat-tour-finder/` after GitHub Pages cache updates.

## 2026-06-11 — Codex (Trip Planner result layout + locked preview)

**Did:**
- Removed the desktop split-screen behavior after `Build my full Berlin plan`; the result now renders in the same single-column flow instead of as a sticky side panel.
- Replaced the weak locked Day 1 preview with a richer teaser: route hint, two preview blocks, existing route-flow cue, and a clear unlock cue.
- Removed the old cut postcard from locked preview so raw default copy does not leak `our/we` wording.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — `.bw-body` is one centered grid column, `.bw-result` is static, and locked preview now renders through `previewDayTeaserHtml()`.

**QA:** Inline script parse passed; `git diff --check` passed; local Playwright desktop QA passed with one grid track, static result, 2 preview blocks, no `our/we` in locked preview, overflow `0`; 390px mobile QA passed with one preview-block column, result width `364`, overflow `0`; `/api/tp-event` was mocked and build/result/gate requests carried `utm_campaign=bw_trip_planner_launch_jun2026` plus the two-step hidden defaults.

**Opened:** Push/deploy/live-QA this local refinement.
**Closed:** Build-result split-screen and low-value locked preview.

**Next session should:** Live-QA `/berlin-trip-planner` desktop/mobile after push, then monitor unlock/build rate.

## 2026-06-11 — Codex (Trip Planner two-step details flow)

**Did:**
- Reworked the paid Trip Planner first-screen flow so the first CTA is honest: `Start building my plan` opens the required details step instead of generating the plan.
- Replaced the hidden `Fine-tune my plan` panel with visible `Step 2 of 2 · Required details`.
- Kept the 3-question fast start, but made the remaining 9 route-shaping questions visible before the real build.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added `data-start-plan`, `data-plan-details`, `detailsStepStarted`, `bw_trip_planner_details_view`, and `flow=two_step_required_details`; real `bw_trip_planner_build_click` now fires only from `Build my full Berlin plan`.
- Copy now summarizes assumptions as `Currently: BER Airport, Mitte / Alexanderplatz, Solo, Balanced, History + Berlin Wall / Cold War, Rain backup.`

**QA:** Inline script parse passed; `git diff --check` passed; local desktop widget QA passed with `/api/tp-event` mocked; 390px wrapper QA passed with parent `dataLayer` bridging `details_view` and then `build_click`, no build click before the second CTA, campaign attribution preserved, result renders, overflow `0`, and no console errors.

**Opened:** Push/deploy/live-QA this local change.
**Closed:** Hidden-default/Fine-tune ambiguity from the previous first-screen simplification.

**Next session should:** After push, live-QA the canonical UTM URL and confirm `details_view -> build_click -> gate_view -> result` under the same campaign.

## 2026-06-11 — Claude Code (Blog booking card → GetYourGuide style)

**Did:**
- Redesigned the `/post/*` booking card in `js/lead-form-inject.js` into a GetYourGuide-style activity card: promo photo (`FREE TOUR` badge), title, `★ 9.8 / 10 on FreeTour`, `Free · tip-based` price slot, 8 horizontally scrollable live date chips + calendar-icon "more dates" chip, full-width yellow `Check availability` CTA, guests-on-next-step note.
- Follow-up per Yusuf: promo photo is gallery 01 (Yusuf storytelling outside the Altes Museum) instead of the 09 group selfie; slot deep links use `https://www.berlinwalk.com/booking-form` (the service-page calendar ignores `bookings_sessionId`; the Booking Form preselects the clicked date/time from it).
- Second follow-up per Yusuf (select-then-reserve): date chips are now `<button>` selectors — clicking a date selects it in-card instead of navigating. The selected date shows a `START TIME` pill row (11:30) plus `Spots available for <date> · about 2 hours, ends near Hackescher Markt`, and the CTA rewrites to `Reserve <Day> <DD> <Mon> · 11:30` with that slot's sessionId. `Check availability` label/href (service page) only remains while loading or on fetch failure. Injection/observer/kill-switch logic untouched.

**Changed:**
- `js/lead-form-inject.js` — card markup/CSS rewrite (commit `8a3dd7e`); `/booking-form` slot deep links + photo swap (commit `37b0daa`); select-then-reserve logic with per-day slot grouping, time pills, meta line, dynamic CTA (commit `adea1cd`). Added `!important` color/size guards: harness QA reproduced Wix-blog-style `a`/`p` CSS turning chip text red and inflating promo text.
- `output/qa/blog-booking-card-gyg/` — QA harness (`/post/` static site + hostile blog CSS) and evidence README (commits `cc6c6f9`, `37b0daa`, `adea1cd`).

**QA:** `node --check`; local harness served at `/post/` in Claude preview browser: desktop 1280 + mobile 375, card injected mid-article, 8 date-chip buttons + calendar chip, first date auto-selected, chip click keeps page URL and toggles `.bw-selected`/`aria-pressed`, sessionIds distinct per date, time pill 11:30 renders, CTA label/href update per selection, image loaded, horizontal overflow 0 at both widths. Slot deep-link spot check: live `/booking-form?...bookings_sessionId=<real>` returned HTTP 200.

**Opened:** Needs Yusuf's push (GitHub Desktop → Push origin), then live-QA one real post after GitHub Pages cache (~10 min). Kill switch unchanged: `?bwBlogBooking=0`.
**Closed:** Compact SS1 teaser design replaced.

**Next session should:** Live-QA a real post desktop+mobile after the push; if a CSS clash appears on live Wix, extend the `!important` guards rather than reverting.

## 2026-06-11 — Codex (Trip Planner live QA after push)

**Did:**
- Verified GitHub raw/main contains the new Trip Planner files and GitHub Pages now serves the new widget UI.
- Opened live `/berlin-trip-planner` with canonical Meta UTM params and confirmed the iframe receives `parent_path=/berlin-trip-planner` plus parent URL.
- Clicked `Build my Berlin plan` with `/api/tp-event` mocked, confirming no live test row was written.

**Changed:**
- `../PROJECT_MEMORY.md` — recorded live QA passed.

**QA:** Live Playwright passed: visible first-screen questions are `Arrival date`, `Trip length`, `Arrival time`; `Fine-tune my plan` starts closed; `Get the quick preview first` is present and old `Ready when you are` copy is gone; overflow `0`; parent `dataLayer` received page_view/start/build/gate/result events; `build_click` carried `utm_campaign=bw_trip_planner_launch_jun2026`, `utm_content=flow_mapped_route_card`, `utm_term=tp_broad_travel_planning`, `page_path=/berlin-trip-planner`, and `event_source=ultimate_berlin_trip_planner_iframe`.

**Opened:** Monitor real paid traffic before scaling the Meta budget.
**Closed:** Live deploy QA for this Trip Planner recovery update.

**Next session should:** Compare the next full paid day against the pre-change baseline: build/session, unlock/build, and bookClick/unlock.

## 2026-06-11 — Codex (Trip Planner first screen + parent tracking)

**Did:**
- Reduced Ultimate Berlin Trip Planner's first screen to `Arrival date`, `Trip length`, `Arrival time`, then the build CTA.
- Moved arrival point, stay area, traveler type, first-time flag, interests, mode, needs, pace, and walking-tour intent into closed `Fine-tune my plan` while preserving defaults.
- Added parent-path/parent-url attribution and a postMessage bridge so iframe `bw_trip_planner_*` events also hit parent `dataLayer`, `gtag`, and `fbq`.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — quick-preview build card now appears before Fine-tune; tracking payload prefers parent path/url and posts analytics events upward.
- `berlin-trip-planner-page/berlin-trip-planner-page-element.js` — passes `parent_path`/`parent_url` into the iframe and validates/bridges Trip Planner events.
- `../scripts/trip-planner-events-report.mjs` — Campaign Chain table now shows campaign-level sessions, page visits, builds, gates, unlocks, book clicks, and rates.

**QA:** `node --check` for wrapper/report scripts; inline HTML scripts parsed; `git diff --check`; Playwright local desktop + 390px mobile passed for 3-question first screen, closed/open Fine-tune, defaults, build result, and overflow `0`; wrapper QA passed with mocked `/api/tp-event`, confirming parent `dataLayer` receives page_view/build_click under `bw_trip_planner_launch_jun2026`.

**Opened:** Push/deploy and live-QA the canonical paid URL before scaling the Meta budget.
**Closed:** Local UI simplification and tracking-chain implementation.

**Next session should:** After push, check live `/berlin-trip-planner?utm_source=meta&utm_medium=paid_social&utm_campaign=bw_trip_planner_launch_jun2026&utm_content=flow_mapped_route_card&utm_term=tp_broad_travel_planning&fbclid=TEST#planner` for parent `dataLayer` events and first-party rows.

## 2026-06-11 — Codex (Daily blog draft: tipping)

**Did:**
- Created the `Tipping in Berlin` Wix Blog package with official-source research, Wikimedia images, Quick Summary, FAQ, and the post-specific `Berlin Tip Calculator`; Yusuf later published it live.
- Added `berlin-tip-calculator` to local Tools Hub and widgets SEO, and inserted the matching BerlinTools CMS item.
- Local browser QA passed for the calculator at desktop and 390px mobile, including interaction state change for walking-tour tips.

**Changed:**
- `blog-drafts/tipping-in-berlin.md`, `blog-drafts/images/tipping-in-berlin/` — local draft, source notes, raw/optimized images.
- `berlin-tip-calculator/index.html` — new standalone widget.
- `quick-summary/data.json`, `faq/data.json`, `faq/inject.js`, `tools-hub/data.json`, `widgets-hub/_regenerate_seo.py`, `widgets-hub/SEO_ADDITIONAL_TAGS.md` — supporting data/schema/hub wiring.
- Wix: post `e7ef8b53-18fd-4bc6-bced-1f0482310588` is published at `/post/tipping-in-berlin`; BerlinTools item `87cc58d0-73b2-44bb-9642-f9825d79723e` created for `/tools/berlin-tip-calculator`.

**QA:** `node --check` for helper scripts; JSON parse checks; FAQ injector parse check; Browser local QA on `http://127.0.0.1:4188/berlin-tip-calculator/` desktop + 390px mobile, no horizontal overflow; Wix API readback confirmed 3 embeds, 3 inline images, alt text, focus keyword placement, robots, canonical, and BlogPosting JSON-LD.

**Opened:** Request Search Console indexing and run final live visual QA for image crops/iframe heights.
**Closed:** Daily blog draft automation run produced a complete post and matching tool; GitHub Pages serves the widget/QS/FAQ data.

**Next session should:** Live-QA `/post/tipping-in-berlin`, then request indexing and promote through `/blog`/tool surfaces if the page looks clean.

## 2026-06-11 — Codex (Blog booking teaser live)

**Did:**
- Reverted the accidental Ultimate Trip Planner cleanup commit; live GitHub Pages re-served the restored planner file after cache propagation.
- QA'd the compact blog booking teaser against the live 1237 post DOM, fixed the first-date text color conflict from blog CSS, switched the teaser to default-on for `/post/*`, and verified the pushed GitHub Pages asset live.

**Changed:**
- `js/lead-form-inject.js` — enables the compact 5-date booking teaser on blog posts by default; `?bwBlogBooking=0` or `window.BW_DISABLE_BLOG_BOOKING = true` disables it; fallback CTA now gets UTM tracking.
- `README.md` — documented the helper as a compact booking teaser, not a full calendar embed.

**QA:** `node --check js/lead-form-inject.js`; Playwright live QA on `https://www.berlinwalk.com/post/why-is-berlin-founding-year-1237`: desktop + 430px mobile card render by default, 5 dates, no guest/attendee params, no custom calendar/old Survival iframe, no horizontal overflow, first date text is white/readable, mobile date + CTA trial clicks pass, and `?bwBlogBooking=0` hides the card.

**Opened:** None for this rollout; keep monitoring real user behavior in analytics.
**Closed:** Broken live heavy calendar path and accidental Ultimate cleanup are both resolved.

**Next session should:** Leave the compact blog booking teaser live unless Yusuf sees a visual issue; use `?bwBlogBooking=0` as the emergency kill switch if needed.

## 2026-06-10 — Codex (Blog booking teaser hidden live, compact local rebuild)

**Did:**
- Confirmed Yusuf pushed `b196d5d`, so live `lead-form-inject.js` now has the emergency kill-switch and the broken blog booking embed is hidden.
- Rebuilt the blog booking injection locally as a compact opt-in teaser instead of embedding the full `<bw-booking-calendar>` component inside Wix Blog.
- Local QA passed at 430px mobile and 1280px desktop: no custom calendar element, no old iframe, no guest/attendee URL param, compact 5-date buttons, and no horizontal overflow.

**Changed:**
- `js/lead-form-inject.js` — disabled by default unless `?bwBlogBooking=1` or `window.BW_ENABLE_BLOG_BOOKING = true`; renders a compact booking card that fetches live availability and links selected dates to the native Wix booking step.
- Local commit `211d11e` is intentionally not pushed; `origin/main` remains `b196d5d` with the live kill-switch.

**Opened:** Live rollout is pending until Yusuf approves the compact teaser after visual QA on a real blog post.
**Closed:** Broken live blog booking card is hidden.

**Next session should:** Test a live post with the local compact card flow or create a preview page; only after approval push `211d11e` so `?bwBlogBooking=1` can be removed / replaced with a real enable flag.

## 2026-06-10 — Codex (Blog booking embed live fix pending)

**Did:**
- Diagnosed the broken live injected booking card: the live `lead-form-inject.js` still renders a blog-card `h2`, and the live calendar element still renders `h2.bw-cal-title`, so Wix blog heading CSS makes the calendar title huge.
- Added a local compact embed fix and a CSS safety override so the blog card stays readable even if the calendar element is cached.
- Local mock blog QA passed on desktop and 430px mobile: injected card renders, no old iframe, no blog-card `h2`, calendar title stays 18px, no `guests=` CTA param, and no horizontal overflow.

**Changed:**
- `js/lead-form-inject.js` — blog-card heading is now a `div` heading role, grid is more compact, and calendar title styles are forced inside the blog card.
- `booking-calendar/booking-calendar-element.js` — calendar title is now a `div` heading role with defensive heading styles.
- Local HEAD commit `Compact blog booking calendar embed` is one commit ahead of `origin/main`.

**Opened:** Push is blocked by GitHub auth in Codex (`Username for 'https://github.com':` prompt; connector update returned 403). Live GitHub Pages still serves the old files until Yusuf pushes.
**Closed:** Live breakage root cause identified and fixed locally; local render QA passed.

**Next session should:** Push from an authenticated terminal: `cd "/Users/yusufucuz/Documents/New project/berlinwalk-widgets" && git push origin main`; then live-QA a `/post/*` page and confirm no giant `Choose a tour date` heading, no guest selector, and CTA opens the native Wix booking form.

## 2026-06-10 — Codex (Blog booking calendar injection)

**Did:**
- Replaced the global mid-post Survival Guide iframe injection with a compact live BerlinWalk booking calendar card.
- Kept attendee count out of the blog card; the injected copy now says guests are chosen on the next Wix booking step.
- Hid the calendar component's duplicate internal "next step" note inside the blog card, so the guest-count explanation appears once below the calendar.

**Changed:**
- `js/lead-form-inject.js` — now injects a branded booking card, lazy-loads `booking-calendar/booking-calendar-element.js`, and links selected slots to the canonical Wix booking service URL.
- `README.md` — updated the helper description so the legacy filename is no longer mistaken for a lead-form injector.
- `../PROJECT_MEMORY.md` — recorded that blog posts now use booking calendar injection, not the old Survival Guide iframe.

**Opened:** Push/deploy and live-QA one Wix blog post on desktop/mobile after GitHub Pages updates.
**Closed:** Yusuf's decision to standard-replace the Survival Guide mid-post embed with the booking calendar is implemented locally. Local QA on `/post/test` confirmed: calendar card injects, no old iframe, no guest selector, no `guests=` booking URL param, no horizontal overflow at 430px mobile width.

**Next session should:** Push/deploy, then verify one live `/post/*` page after GitHub Pages updates; confirm the CTA lands on the native Wix booking form where guest count is selected.

## 2026-06-10 — Codex (1237 publish distribution)

**Did:**
- Promoted the published 1237 post through local `/blog` data and related-tool logic.
- Promoted `medieval-berlin-mini-walk` from post widget to BerlinTools/tool hub, with live CMS page and temporary Wix hub bridge.
- Checked Search Console URL Inspection API status for the published post.

**Changed:**
- `blog-index/data.json`, `scripts/generate-blog-index-data.mjs` — 1237 is the lead story, protected as a required slug, first in the Berlin History shelf, and related to `medieval-berlin-mini-walk`.
- `tools-hub/data.json` — added `medieval-berlin-mini-walk` after `berlin-landmarks-map`.
- `widgets-hub/SEO_ADDITIONAL_TAGS.md` — regenerated ItemList SEO to include Medieval Berlin Mini Walk Planner.
- Wix: BerlinTools CMS item `1f62dedb-a1a5-4ce2-aef0-0be6ecf5072a` is live at `/tools/medieval-berlin-mini-walk`; `BerlinWalk 1237 Blog Feature` custom embed revision 3 and `BerlinWalk 1237 Tools Hub Feature` revision 1 bridge live `/blog` and `/berlin-tools` until push; `BerlinTools Layout Fixes` is revision 16.
- QA: Playwright live checks confirmed `/blog` renders the 1237 lead and mini-walk tool, `/berlin-tools` renders the mini-walk card/link, and `/tools/medieval-berlin-mini-walk` renders the page and widget URL. `/widgets` is iframe-backed and did not show the new card before GitHub Pages data is pushed.
- External: Search Console URL Inspection API reported `URL is unknown to Google`; normal blog-post request-indexing must be done manually in the Search Console UI. UI attempt redirected to Google sign-in, so Codex could not click `Request indexing` in this session.

**Opened:** Push `berlinwalk-widgets` so GitHub Pages serves refreshed `blog-index/data.json`, `tools-hub/data.json`, and widgets SEO data; after push, smoke-check `/widgets` and remove or disable the temporary 1237 bridge embeds if they are no longer needed. Manually request indexing for the 1237 post in Search Console UI.
**Closed:** 1237 post distribution and Medieval Berlin Mini Walk BerlinTools promotion are live.

**Next session should:** Push/deploy, then smoke-check `/blog`, `/berlin-tools`, `/widgets`, and `/tools/medieval-berlin-mini-walk`; submit the 1237 URL through the Search Console UI.

## 2026-06-10 — Codex (Späti publish distribution)

**Did:**
- Added the published Späti post to local blog-index logic/data and promoted Späti Survival Checker from post-only widget to BerlinTools.
- Submitted the published post to Google Search Console Request indexing after a successful live URL test.

**Changed:**
- `blog-index/data.json`, `scripts/generate-blog-index-data.mjs` — Späti is Latest #1, related to `spati-survival-checker`, included in First Day/Practical/Food shelves, and protected from Wix query lag with required-slug fetching.
- `tools-hub/data.json` — added `spati-survival-checker` with image, widget URL, category Maps, and embed height 760.
- `widgets-hub/SEO_ADDITIONAL_TAGS.md` — regenerated ItemList SEO to include Späti Survival Checker.
- `../berlinwalk-content-app/upsert-spati-survival-checker-tool.mjs` — one-off CMS upsert helper.
- Wix: BerlinTools CMS item `c3e52ab1-c663-456a-9b0f-3031625f122f` is live at `/tools/spati-survival-checker`; `BerlinTools Layout Fixes` custom embed updated to revision 15.
- External: Search Console live test said the URL is available to Google and page can be indexed; Request indexing returned `Indexing requested`.

**Opened:** Push `berlinwalk-widgets` so live GitHub Pages serves the refreshed `blog-index/data.json`, `tools-hub/data.json`, and widgets SEO data; until then, the dynamic tool page is live but hub/grid data is local only.
**Closed:** Späti post distribution and Search Console indexing request are done.

**Next session should:** Push/deploy, then verify `/blog`, `/berlin-tools`, `/tools`, `/widgets`, and `/tools/spati-survival-checker`.

## 2026-06-10 — Codex (Trip Planner subscription backfill)

**Did:**
- Backfilled four Ultimate Berlin Trip Planner contacts from `NOT_SET` to `SUBSCRIBED` through the Wix Email Marketing bulk subscription API.
- Explicitly excluded Mauricio Rodríguez / Rodrigues from the update.

**Changed:**
- Wix: `info@tripess.com`, `chenyeeming@gmail.com`, `tam.boug@free.fr`, and `cecilierumler@hotmail.com` now verify as subscribed; no unsubscribed contacts were forced back in.

**Opened:** None.
**Closed:** Manual contact subscription backfill requested by Yusuf is done.

**Next session should:** Continue with the next Trip Planner/widget QA item; future leads should be handled by the newly published auto-subscribe backend path.

## 2026-06-10 — Codex (Berlin 1237 images + real-map widget)

**Did:**
- Added 4 inline images to the unpublished Wix 1237 draft and removed broken list rendering by rebuilding the body with paragraph-based timeline/fragments.
- Replaced the draft's twin-towns iframe area with an uploaded annotated 1652/1720 Berlin-Cölln map image, so the article no longer depends on GitHub Pages deployment for that visual.
- Reworked local `medieval-berlin-twin-towns` from a schematic SVG into a real old-map overlay version for later reuse.
- Ran Wix API readback and local desktop/mobile widget screenshot QA.

**Changed:**
- `blog-drafts/why-is-berlin-founding-year-1237.md` — embed URLs now use `v=20260610b`, image sources are recorded, and body list blocks were converted to plain paragraphs.
- `blog-drafts/images/berlin-1237/` — new optimized inline image assets: Pexels Nikolaiviertel/TV Tower, old Berlin-Cölln map, annotated map render/PNG, Marienkirche/TV Tower, and Littenstraße city wall.
- `medieval-berlin-twin-towns/index.html`, `medieval-berlin-twin-towns/assets/berlin-coelln-1652-map.jpg` — real old-map background plus active overlay labels; inactive labels hidden.
- `blog-workplan.md`, `../PROJECT_MEMORY.md`, `../SESSION_LOG.md` — recorded the latest Wix draft state.
- Wix: draft `239d8355-2d20-4152-a809-8451074602e9` is still UNPUBLISHED; final readback confirmed 120 nodes, 4 IMAGE nodes, 3 embeds, 0 list nodes, annotated map present, twin-towns iframe absent, image credits, alt text, and no `[IMAGE]` placeholders.
- QA: local widget screenshots saved under `../output/qa/berlin-1237-refresh-20260610/`; desktop/mobile old-map overlay looks clean. The local widget can still be pushed later, but the Wix draft no longer needs it for this article.

**Opened:** Final visual preview in Wix before publish.
**Closed:** Wix draft image gap, broken list-node issue, and ss1 map-widget-area visual issue.

**Next session should:** Preview the Wix draft and publish only after the annotated map crop and remaining mini-walk iframe height look right.

## 2026-06-10 — Codex (Späti link/image pass)

**Did:**
- Added a fourth lower-section Späti image (`04-spati-moabit-sign.jpg`) and expanded internal/external links throughout the Späti article.
- Refreshed the unpublished Wix Blog draft and verified readback counts.

**Changed:**
- `blog-drafts/what-is-a-spati-berlin.md` — added the Moabit Spätkauf sign image, Image Credits entry, extra BerlinWalk internal links, and official external reference links.
- `blog-drafts/images/spati-berlin/04-spati-moabit-sign.jpg`, `blog-drafts/images/spati-berlin/visual-sources.md` — added/recorded the fourth optimized Commons image.
- `blog-workplan.md`, `../PROJECT_MEMORY.md`, `../SESSION_LOG.md` — updated Späti status from 3 to 4 inline images and recorded link/readback counts.
- Wix: draft `6f3636f2-b910-4481-a87b-82dd5bd91ba4` remains UNPUBLISHED with 276 Ricos nodes, 4 IMAGE nodes, 3 HTML embeds, 1 ordered list, 23 unique links (11 internal, 12 external), cover media, and Image Credits present.

**Opened:** Final visual preview in Wix before publish; check new image crop and iframe height on mobile.
**Closed:** Yusuf's request for more links and one more lower article image is complete.

**Next session should:** Preview the Wix draft, then publish only after the image/link layout and embeds look right.

## 2026-06-10 — Antigravity (Forward UTM / fbclid query params to planner iframe)

**Did:**
- Added UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`) and `fbclid` to the keys list in `berlin-trip-planner-page-element.js` so they are successfully forwarded into the embedded planner iframe for tracking.

**Changed:**
- `berlin-trip-planner-page/berlin-trip-planner-page-element.js` — added parameters to the forwarded query parameters array.

**Opened:** None.
**Closed:** Fixed the UTM forwarding bug that caused all campaign attributions in `TripPlannerEvents` to show as `(none)`.

**Next session should:** Verify that UTM campaigns are correctly attributed in the Trip Planner dashboard after pushing this change and testing with a UTM URL.

## 2026-06-10 — Codex (Späti Wix draft + images)

**Did:**
- Sourced 4 Wikimedia Commons Späti candidates, selected 3 CC BY-SA 4.0 Berlin-specific images, optimized them, and added the selected set to the Späti article.
- Created the unpublished Wix Blog draft for `What Is a Späti?` with Quick Summary, Späti Survival Checker, FAQ, cover media, 3 inline images, Image Credits, SEO, and tags.
- Verified live GitHub Pages embed/data URLs and Wix readback.

**Changed:**
- `blog-drafts/what-is-a-spati-berlin.md` — status now points to Wix draft `6f3636f2-b910-4481-a87b-82dd5bd91ba4`; added image plan, 3 markdown images, and Image Credits.
- `blog-drafts/images/spati-berlin/` — new raw/optimized image folder with Commons metadata and `visual-sources.md`.
- `blog-workplan.md`, `../PROJECT_MEMORY.md`, `../SESSION_LOG.md` — Späti status moved to Wix draft.
- `../scripts/create-wix-spati-blog-draft.js` — one-off image-upload + draft create/update helper.
- Wix: draft `6f3636f2-b910-4481-a87b-82dd5bd91ba4` is UNPUBLISHED with 268 Ricos nodes, 3 IMAGE nodes, 3 HTML embeds, 1 ordered list, 3 tags, Tourist Tips category, cover media, Image Credits present, and Source Notes excluded.

**Opened:** Visual preview in Wix before publish; watch the Späti Survival Checker iframe height on mobile.
**Closed:** Previous Späti image/draft request: images are sourced, optimized, credited, uploaded, and the Wix draft exists.

**Next session should:** Open the Wix draft, proof images/credits/iframe heights, then publish if the preview is clean.

## 2026-06-10 — Codex (Berlin 1237 Wix draft + SEO)

**Did:**
- Created the unpublished Wix Blog draft for `Why Is Berlin's Founding Year 1237?` using the local markdown source, Quick Summary, FAQ, and both post-only widgets.
- Added a licensed Marienkirche cover image to Wix Media and wired it into cover media, `og:image`, `twitter:image`, image alt, and an image-credit block.
- Reverified live GitHub Pages widget/data URLs and Wix readback.

**Changed:**
- `blog-drafts/why-is-berlin-founding-year-1237.md` — status now points to Wix draft `239d8355-2d20-4152-a809-8451074602e9`, edit URL, cover credit, and cache-busted embed URLs.
- `blog-workplan.md` — 1237 post status moved from `Draft v1` to `Wix draft`.
- `../berlinwalk-content-app/create-berlin-1237-draft.mjs`, `../berlinwalk-content-app/add-berlin-1237-cover.mjs` — one-off draft and cover/SEO image scripts.
- `../output/wix-drafts/berlin-1237-draft-20260610.json`, `../output/wix-drafts/berlin-1237-cover-20260610.json` — Wix API verification outputs.
- Wix: draft `239d8355-2d20-4152-a809-8451074602e9` is UNPUBLISHED with 90 Ricos nodes, 4 HTML embeds, 5 tags, Berlin History category, 12 SEO tags, focus keyword, cover media, `og:image`, `twitter:image`, and no `[IMAGE]` placeholders.

**Opened:** Final visual preview in Wix before publish; optional later improvement is adding inline original photos for wall/route atmosphere.
**Closed:** Previous "create the Wix draft after deploy" TODO for the 1237 post.

**Next session should:** Preview the Wix draft in the editor and publish only after the cover crop and iframe heights look right.

## 2026-06-10 — Codex (Berlin 1237 founding-year post/widgets)

**Did:**
- Completed the local `Why Is Berlin's Founding Year 1237?` blog package with corrected Cölln/Berlin timeline, Quick Summary, FAQ, SEO fields, image plan, sources, and embeds.
- Built two post-only widgets: `medieval-berlin-twin-towns` interactive schematic map and `medieval-berlin-mini-walk` route planner.
- QA'd widgets and embeds locally at desktop and 390px mobile.

**Changed:**
- `blog-drafts/why-is-berlin-founding-year-1237.md` — new Wix-ready local draft with `{{quick-summary}}`, both widget embeds, and `{{faq}}`.
- `medieval-berlin-twin-towns/index.html`, `medieval-berlin-mini-walk/index.html` — new post-only widgets.
- `quick-summary/data.json`, `faq/data.json`, `faq/inject.js` — added `berlin-founding-year-1237`.
- `blog-workplan.md`, `../PROJECT_MEMORY.md`, `../SESSION_LOG.md` — recorded draft/widget status.
- `../output/qa/berlin-1237-widgets-20260610/` — saved desktop/mobile QA screenshots.

**Opened:** No Wix draft was created; push `berlinwalk-widgets` first so the new widget URLs resolve on GitHub Pages, then create the Wix draft with `qsKey=berlin-founding-year-1237`, `faqKey=berlin-founding-year-1237`, and two widget embeds.
**Closed:** The 1237 article now has a complete local draft plus the planned map widget and an extra mini-walk widget.

**Next session should:** Push/deploy the widget repo, create the Wix draft, add/choose images (especially Marienkirche + city wall), then preview-QA before publishing.

## 2026-06-09 — Codex (Ultimate Email Marketing subscribe fix)

**Did:**
- Wired Ultimate Trip Planner consenting leads into Wix Email Marketing subscription instead of only creating contacts/labels.
- Added subscription debug output to the lead endpoint and tightened live smoke/prepublish checks so `Never subscribed` regressions are caught.
- Regenerated the Velo install kit and verified launch/prepublish gates.

**Changed:**
- `ultimate-berlin-trip-planner/velo/emailMarketingSubscription.js` — new helper copied from the live-tested First-Day subscription flow.
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js`, `ultimate-berlin-trip-planner/velo/http-functions.js` — lead save calls `subscribeEmailMarketing()` and returns `subscribed` / `subscriptionDebug`.
- `ultimate-berlin-trip-planner/velo/build-velo-install-kit.mjs`, `ultimate-berlin-trip-planner/velo/install-kit.html`, `ultimate-berlin-trip-planner/velo/prepublish-gate.mjs`, `ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs` — install and QA gates include the subscription helper.
- `../PROJECT_MEMORY.md` — recorded the Ultimate subscription fix handoff.

**Opened:** Paste/publish the refreshed Velo files in Wix, then run live smoke; old `Never subscribed` Ultimate leads still need optional backfill if Yusuf wants them repaired.
**Closed:** Local Ultimate Velo package now contains the missing Email Marketing subscription call.

**Next session should:** After Wix publish, submit a real test lead and confirm `subscribed:true` / `SUBSCRIBED` in the endpoint response and Wix contact status.

## 2026-06-09 — Codex (Späti Survival Checker)

**Did:**
- Built the post-only `Späti Survival Checker` widget for the Späti article.
- Added the widget placeholder and GitHub Pages URL to the Späti draft's widget plan.
- Recorded the widget in the workplan and root project memory.
- Ran local QA: inline script/JSON/diff checks plus Chrome CDP desktop/mobile screenshots; 390px mobile had no horizontal overflow.

**Changed:**
- `spati-survival-checker/index.html` — new standalone widget with time/need/payment inputs, decision result, practical next steps, and related BerlinWalk links.
- `blog-drafts/what-is-a-spati-berlin.md` — added `{{widget:spati-survival-checker}}` after "The Short Answer".
- `blog-workplan.md`, `../PROJECT_MEMORY.md`, `../SESSION_LOG.md` — updated handoff state.
- `../output/qa/spati-survival-checker-20260609/` — saved desktop/mobile QA screenshots.

**Opened:** No Wix draft exists yet; repo must be pushed before GitHub Pages serves `/spati-survival-checker/`.
**Closed:** The Späti article now has a dedicated practical widget idea implemented locally.

**Next session should:** Push the repo, then create the Wix draft with Quick Summary, Späti Survival Checker, and FAQ embeds; QA auto-resize or use fixed iframe height around 740 px desktop / 1620 px narrow mobile.

## 2026-06-09 — Codex (Späti blog draft)

**Did:**
- Created a local v1 blog draft for `What Is a Späti? Berlin's Late-Night Shop Culture, Sunday Rules and Tourist Tips`.
- Wired `spati-berlin` Quick Summary, FAQ data, and FAQPage schema mapping.
- Updated the blog workplan from idea to draft status.

**Changed:**
- `blog-drafts/what-is-a-spati-berlin.md` — new English draft with SEO metadata, internal links, source notes, and no standalone widget requirement.
- `quick-summary/data.json`, `faq/data.json`, `faq/inject.js` — added `spati-berlin` support.
- `blog-workplan.md`, `../PROJECT_MEMORY.md` — recorded draft state and next publishing context.

**Opened:** No Wix draft exists yet; next step is review/cover image, then create a Wix Blog draft if Yusuf approves.
**Closed:** Späti gap in the local blog queue is now covered by a publishable v1 draft.

**Next session should:** If Yusuf likes the angle, create the Wix draft with `qsKey=spati-berlin` and `faqKey=spati-berlin`, then QA preview before publishing.

## 2026-06-09 — Codex (Footer social links)

**Did:**
- Added a `Follow me` social icon row to the global site footer for Instagram, Facebook, and TikTok.
- Created a duplicate-safe live Wix Custom Embed patch so the icons are visible before GitHub Pages receives the source update.
- Verified live homepage and local footer preview at desktop/mobile widths with no horizontal overflow.

**Changed:**
- `site-footer/site-footer-element.js` — added social URLs, inline SVG icons, styles, and footer brand-column render helper.
- `../berlinwalk-footer-social-links.html`, `../scripts/update-footer-social-links-embed.mjs` — live Wix patch source/updater.
- `../PROJECT_MEMORY.md` — recorded footer social state and Custom Embed ID.
- Wix: created `BerlinWalk Footer Social Links` (`57ef17ae-2f85-468a-9967-fd11227bef77`, revision 1).

**Opened:** Push `berlinwalk-widgets` so the footer source deploys durably; live patch prevents duplicates if it remains enabled after deploy.
**Closed:** Live footer now includes Instagram/Facebook/TikTok icon links under `Follow me`.

**Next session should:** After push/GitHub Pages deploy, verify the footer still has one `.bw-social-follow` block; disable the live patch only if Yusuf wants fewer temporary embeds.

## 2026-06-08 — Codex (Vegan blog/tool promotion)

**Did:**
- Promoted the live Vegan Berlin Guide as the `/blog` lead story and useful-tools focus, and wired both vegan widgets into BerlinTools surfaces.
- Created the missing live `/tools/vegan-berlin-locations-map` CMS page and refreshed `/tools/vegan-berlin-map` related-blog/related-tool fields.
- Verified live `/blog`, homepage blog teaser, both vegan tool pages, and local blog-index preview.

**Changed:**
- `blog-index/blog-index-element.js`, `blog-index/data.json`, `scripts/generate-blog-index-data.mjs` — Vegan Guide is the lead/latest/Food & Nightlife feature; tools strip starts with the two vegan tools.
- `tools-hub/data.json` — added `vegan-berlin-locations-map` and `vegan-berlin-map` for `/berlin-tools` and `/widgets` after push.
- `../insert-vegan-berlin-map.js`, `../insert-vegan-berlin-locations-map.js` — durable CMS sync helpers for the two vegan pages.
- `../PROJECT_MEMORY.md` — updated live blog/Custom Embed/BerlinTools state.
- Wix: `BerlinWalk Vegan Blog Feature` (`7b593b94-...`) rev 2 now promotes Vegan Guide live on `/blog`; `BerlinTools Layout Fixes` rev 14 adds the two vegan icon slugs; BerlinTools CMS rows live for `vegan-berlin-map` (`63f6ecb8-...`) and `vegan-berlin-locations-map` (`538c8024-...`).

**Opened:** Push `berlinwalk-widgets` so GitHub Pages serves the durable `blog-index` and `tools-hub` updates; live `/blog` and the dynamic `/tools/<slug>` pages are already patched via Wix.
**Closed:** Vegan Guide now appears live on homepage blog teaser and `/blog`; both vegan tool pages show the related Vegan Guide card.

**Next session should:** After push, verify live GitHub Pages `blog-index/*` no longer needs the temporary `/blog` feature embed; consider disabling it once the deployed asset itself promotes Vegan Guide.

## 2026-06-08 — Codex (Trip Planner test lead cleanup)

**Did:**
- Cleaned live `TripPlannerLeads` after test signups began receiving the hourly scheduled planner reminder emails.
- Deleted every Trip Planner lead row whose normalized email was not `yusuf.ucuz@gmail.com` or `info@yusufucuz.com`.
- Verified live after deletion: 19 rows remain, unexpected email count `0`.

**Changed:**
- Wix: removed 16 non-allowlisted `TripPlannerLeads` rows via Wix Data bulk remove; the hourly `processTripPlannerDueEmails()` job can no longer see those test addresses.
- `../PROJECT_MEMORY.md` — recorded cleanup evidence path.

**Next session should:** Do a separate Wix Contacts/Email Marketing cleanup only if Yusuf explicitly wants CRM records removed too; this pass only removed the planner sequence source rows.

## 2026-06-08 — Antigravity (About Page Redesign)

**Did:**
- Redesigned the `about-berlinwalk` widget to remove the aggressive clarification box and bottom banner.
- Added Yusuf's profile image and story.
- Added a group tour image alongside the tip-based philosophy.
- Integrated an accordion FAQ section at the bottom containing the bot differentiation statement mentioning "Original Berlin Walks".

**Changed:**
- `berlinwalk-widgets/about-berlinwalk/about-element.js`

## 2026-06-08 — Antigravity (Bot Differentiation & About Page)

**Did:**
- Added an explicit entity differentiation statement to the homepage FAQ (Tour Basics tab).
- Designed and scaffolded a new `about-berlinwalk` widget to act as a standalone company profile page.

**Changed:**
- `berlinwalk-widgets/faq/data.json` — updated `home` FAQ.
- `berlinwalk-widgets/about-berlinwalk/` — created `index.html` and `about-element.js`.

## 2026-06-08 — Antigravity (World Cup interactive map)

**Did:**
- Added an interactive Leaflet map to the `worldcup-berlin` widget.
- Bound map filtering to the existing UI buttons (Free entry, Beer garden, etc.).
- Removed the "reality check" intro paragraph from the World Cup blog draft.

**Changed:**
- `worldcup-berlin/index.html` — added map UI, Leaflet.js, and coordinate data.
- `blog-drafts/where-to-watch-2026-world-cup-in-berlin.md` — removed intro paragraph.
- Wix: updated and published the live post via API.

## 2026-06-08 — Antigravity (World Cup venues update)

**Did:**
- Added 5 new public viewing venues (Astra Kulturhaus, Belushi's, FC Magnet Bar, Hofbräu Wirtshaus, Mauersegler) to the World Cup 2026 widget and blog draft.
- Updated the live Wix blog post for "Where to Watch the 2026 World Cup in Berlin" via the API.

**Changed:**
- `worldcup-berlin/index.html` — added new venues to the V array.
- `blog-drafts/where-to-watch-2026-world-cup-in-berlin.md` — added venues to the recommended list.
- Wix: updated and published the live post (`0d25be5a-4e4a-447d-af5d-a9f1de72206a`) via API.

## 2026-06-08 — Codex (Trip Planner first-party tracking)

**Did:**
- Added first-party anonymous event tracking to the Ultimate Berlin Trip Planner while keeping existing `dataLayer`, `gtag`, and Meta `fbq trackCustom` events.
- Tracks page view/start, first form start, plan build/result, gate view, lead submit/unlock success, PDF download, print, copy-link share, WhatsApp share, and book clicks to `https://berlinwalk-content-app.vercel.app/api/tp-event`.
- Enriches events with safe trip/context fields, UTMs, referrer/landing page, device width, visitor/session IDs, and paid-source hints; email is not sent.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added first-party tracking endpoint, visitor/session IDs, safe payload enrichment, page-view event, and first form-start event.

**Next session should:** After GitHub Pages deploy, smoke-test live `/berlin-trip-planner` and confirm the local dashboard at `http://127.0.0.1:4177/planner` receives real events.

## 2026-06-08 — Codex (Mobile menu NEW badge polish)

**Did:**
- Fixed the mobile menu `Berlin Trip Planner` NEW label so it renders as a small yellow pill badge instead of `PlannerNEW` plain text.
- Root cause: the mobile overlay is portaled to `<body>`, so the old `.bw-header-wrap .bw-badge-new` selector did not match mobile overlay markup.
- Verified local mobile preview at 390px: badge is yellow, 9px text, pill radius, and visually separated from the link label.

**Changed:**
- `site-header/site-header-element.js` — added `.bw-header-mobile .bw-badge-new` styling and mobile-specific badge sizing.

**Next session should:** Yusuf pushes the widgets repo; then check the live mobile menu after GitHub Pages deploy.

## 2026-06-08 — Codex (Blog CTA compact source update)

**Did:**
- Updated the blog sidebar helper's source-level desktop floating CTA compact rules for the new two-button stack.
- Kept blog CTAs left-aligned but reduced both `Berlin Trip Planner` and `Book Tour` pills to 176px so they do not cover post text.
- Live overlap is already fixed through the root Wix `BerlinWalk Sticky CTA Color Polish` Custom Embed revision 10; this repo change still needs a push for GitHub Pages durability.

**Changed:**
- `js/blog-sidebar-inject.js` — compacted `#bw-desktop-cta` pill/planner widths, padding, fonts, arrows, and close button on blog posts.

**Next session should:** Yusuf pushes `berlinwalk-widgets`; after GitHub Pages deploy, verify `blog-sidebar-inject.js` serves the compact CTA rules.

## 2026-06-07 — Antigravity (Berlin Trip Planner exit popup PDF preview & mobile sticky banner fixes)

**Did:**
- Replaced the browser-window mockup in the exit popup with two overlapping portrait A4 printable PDF planner pages floating and rotating beautifully over the Cathedral hero image.
- Fixed the disappearing mobile sticky bottom banner by adding defensive CSS visibility overrides and debouncing the MutationObserver in the custom code script to prevent script crashes on slower mobile browsers.

**Changed:**
- `js/exit-intent-popup.js` — updated layout and CSS styles to render A4-style portrait PDF preview pages overlapping with interactive float animations.
- `ultimate-berlin-trip-planner/assets/berlin-trip-planner-pdf-page1.png` — [NEW] cover page PNG.
- `ultimate-berlin-trip-planner/assets/berlin-trip-planner-pdf-page2.png` — [NEW] itinerary page PNG.

## 2026-06-07 — Antigravity (Berlin Trip Planner menu reorganization & layout adjustments)

**Did:**
- Reorganized navigation menu to bring "Berlin Trip Planner" to the primary navigation directly, instead of placing it under Resources.
- Added a glossy brand-style "NEW" badge next to "Berlin Trip Planner" in both desktop and mobile headers.
- Renamed the general tools hub page link from "Plan Your Visit" to "Berlin Hacks" in both desktop and mobile headers and footers.
- Updated the homepage trip planner promotional section button and card links to target `#planner` directly so users scroll to the top of the tool.

**Changed:**
- `site-header/site-header-element.js` — added `planner` link, updated dropdown menu layout, added `.bw-badge-new` CSS class, added "Berlin Trip Planner" link with new badge directly to primary desktop and mobile navigation, and renamed "Plan Your Visit" to "Berlin Hacks".
- `site-footer/site-footer-element.js` — added "Berlin Trip Planner" link with new badge and renamed "Plan Your Visit" to "Berlin Hacks".
- `trip-planner-home/trip-planner-home-element.js` — appended `#planner` anchor to the target planner URL to scroll directly to the tool section.

## 2026-06-07 — Antigravity (Berlin Trip Planner widget system copy updated and character limit increased)

**Did:**
- Replaced all fallback, day template, focus, and personalization copies in `index.html` with Yusuf's new custom travel guide prose.
- Increased the day-card copy length limit in `launch-audit.mjs` from 90 to 140 characters to fit the new text.
- Standardized regex parsers in `launch-audit.mjs` to robustly capture both double-quoted and single-quoted strings containing apostrophes.
- Relaxed template rules in the Gemini prompt in `tripPlannerFunnel.js` to allow natural English phrasing.

**Changed:**
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js` — relaxed prompt phrasing constraints.
- `ultimate-berlin-trip-planner/index.html` — updated mockRouteIntro, mockDayStory, localGuideFallback, dayTemplate, tourFrameworkFocus, focusDayMove, firstDayBaseMove, firstDayArrivalCopy, and personalizeDayTemplate.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — increased character limit to 140, updated regex logic.

**Next session should:** Verify that the updated widget and Gemini prompt function correctly on the live page after Yusuf pastes `tripPlannerFunnel.js` to Wix and pushes `index.html` via GitHub Desktop.

## 2026-06-07 — Claude Code (Trip Planner logic review + 6 consistency fixes)

**Did:**
- Independent logic review of the Ultimate Berlin Trip Planner brain (`index.html` + Velo). Found 1 real bug + 5 consistency issues; fixed all 6.
- Most critical: Hackescher Markt market-day detection used local-timezone `getDay()` (the only non-UTC date read in the file), shifting the day for negative-UTC-offset users (US visitors).

**Changed:**
- `ultimate-berlin-trip-planner/index.html`:
  - `isHackescherMarketDay` → `dateFromKey(k).getUTCDay()` instead of `new Date(k).getDay()` (timezone bug).
  - `arrivalDayAfternoonTourTimeEligible` → BER now excluded from same-day summer 15:30 slot (matches `PLANNER_LOGIC_REVIEW.md`).
  - `buildPlan` → `consumedTourFocus` now skips the tour theme only on the day right after the tour, then releases it (was permanently dropping that theme from the whole trip).
  - `dayRhythmItems` → `packedTrip` now `&& !slowTrip` (consistent with `tripProfile`).
  - `reservationRadar` → `foodOrNightDay` now uses `dayVisualType` food/nightlife excluding arrival day (was matching ubiquitous "dinner").
  - `climateWeatherForDate` → cue rainProbability derived from monthly rain-days (was hardcoded 0); cue temp uses monthly average (was daytime high).

**Verified:**
- `node --check` on embedded script: syntax OK.
- Isolated node test: tour-slot fix changes only the BER + 09:00-10:00 + summer case, all other arrival combos unchanged; Hackescher TZ bug reproduced under `TZ=America/Los_Angeles` (old misses Thu/Sat, new correct).
- Preview render (BER/lateMorning/summer/3-day): clean, no console errors, plan renders.
- `node launch-audit.mjs` → 153 pass / 0 warn / 0 block. `node velo/prepublish-gate.mjs` (key loaded) → 13 pass / 0 warn / 0 block.

**Next session should:** Yusuf reviews, then pushes the widgets repo (GitHub Pages). Velo was not touched, so no Wix re-paste is needed.

## 2026-06-07 — Codex (Ultimate Trip Planner Yusuf Voice + Mobile Note Fix)

**Did:**
- Reworked the Ultimate Trip Planner AI/Yusuf note so local mock/fallback copy sounds more like Yusuf speaking directly, while keeping route facts strict.
- Fixed the bad “next day / World Clock” tour-summary drift by pointing post-tour language to the actual next planned day, not repeating the tour day.
- Kept lunch blocks visible between morning/afternoon, including BerlinWalk-day lunch near Hackescher Markt, and shortened small-screen AI aside labels to avoid `WEATH ER READ` / `TOU R NOTE` wrapping.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — warmer mock/fallback route intro and day stories, “where you are staying” wording, longer visible AI day-story text, compact `Weather` / `Tour` aside labels.
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js` — Gemini prompt loosened for freer, friendlier guide language while preserving fixed route/day/time/place constraints.
- `ultimate-berlin-trip-planner/velo/install-kit.html` — regenerated from updated Velo backend source.

**Verified:**
- Local mobile Playwright QA at 430px on the 7-day west/mixed-interest test URL: no horizontal overflow, no old robotic strings, Day 2 tour lunch near Hackescher Markt present, lunch blocks present, and tour intro no longer repeats the tour day as “next day.”
- `node ultimate-berlin-trip-planner/launch-audit.mjs` → `153 pass / 0 warn / 0 block`.
- `node ultimate-berlin-trip-planner/velo/prepublish-gate.mjs` → `13 pass / 0 warn / 0 block`.
- `git diff --check` → clean.

**Next session should:** Yusuf should review the local mock link once. If approved, push widget changes and paste/publish the regenerated `Backend/tripPlannerFunnel.js` from the install kit in Wix so live Gemini follows the same freer voice.

## 2026-06-07 — Antigravity (East Side Gallery murals widget local & online image integration and blog draft cleanups)

**Did:**
- Integrated local photos onto matching card boxes in the `east-side-gallery-murals` widget.
- Sourced and integrated 4 missing mural images from Wikimedia Commons, making all 12 cards fully populated with images.
- Cleaned duplicate "What is nearby" sections and corrected Thomas Klingenstein's mural title to "Umleitung in den japanischen Sektor".
- Added Berlin Wall Foundation visitor info and re-ran uploader script to patch Wix draft.

**Changed:**
- `east-side-gallery-murals/index.html` — added image fields, modernized CSS structure, and added card hover/zoom micro-animations
- `blog-drafts/east-side-gallery-berlin-guide.md` — removed duplicate section, corrected Klingenstein title and placeholder, added visitor center information
- `east-side-gallery-murals/images/` — added 12 optimized photos (8 local + 4 online) matching the famous murals

**Next session should:** Yusuf needs to push the repository changes via GitHub Desktop so they deploy on GitHub Pages, verify the widget live, and publish the Wix blog post.

## 2026-06-07 — Codex (Ultimate Trip Planner Meal QA Finish)

**Did:**
- Finished the handoff meal/repeat cleanup for the Ultimate Berlin Trip Planner.
- Removed the remaining Markthalle Neun repeat path by keeping Wall fallback stops east-side, making the food day use Markthalle as lunch before Hackesche Höfe/Kastanienallee, and letting day-type-specific pause logic run before the generic slow-travel pause.
- Kept BerlinWalk days with a separate lunch near Hackescher Markt and kept area-locked tour lunch from falling back to repeated/wrong-area restaurants just to fill two options.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — wall/food place routing, nearby pause ordering, food-link de-dupe fallback, and one compact food-day copy line.
- `SESSION_LOG.md` — this handoff note.

**Verified:**
- `node ultimate-berlin-trip-planner/launch-audit.mjs` → `153 pass / 0 warn / 0 block`.
- `git diff --check` → clean.
- Local Browser mobile QA at 430px for evening-arrival 2-day, 4-day tour/museums, and 7-day mixed-interest plans: no horizontal overflow, no visible AI fallback, no `Open PDF` in the widget text, no old `Water, base map, sleep` / `See the main history sights` strings, no explicit dinner+evening duplicate, and no repeated food map links.

**Next session should:** Yusuf can review/push this widget cleanup; remaining work can move to PDF polish or the live landing-page/homepage integration.

## 2026-06-07 — Codex (Blog search-trends TODOs)

**Did:** Added Yusuf's English tourist search-trends recommendations to `blog-workplan.md` as concrete blog TODOs.

**Changed:**
- `blog-workplan.md` — added a dedicated search-trends TODO section from the local DOCX research, covering new post ideas, existing post refreshes, and deprioritized flight-only content; updated the priority queue with Christmas markets, Spati, vegan, walkable Berlin, Reichstag sold-out, and Christmas-market accommodation items.

**Next session should:** Start with high-intent existing refreshes or draft the Christmas markets pillar, then move to Spati/Sunday/cash and vegan Berlin.

## 2026-06-07 — Codex (Ultimate Trip Planner Meal Logic Handoff Cleanup)

**Did:**
- Took over the unfinished Ultimate Trip Planner meal/itinerary revision after the previous agent hit quota.
- Fixed duplicate Day 1 dinner/evening behavior, added a dedicated Hackescher Markt lunch block after BerlinWalk, and added plan-level meal assignment so restaurant recommendations do not repeat across the same plan.
- Replaced the empty/robotic history cluster line with more natural slow-route copy and added a west-side day rule so Charlottenburg/Savignyplatz/Lietzensee days do not drift back into Mitte dinner logic.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — restored `firstDayDinnerMove`, added `FOOD_POOLS` meal assignment helpers, added `dayUsesWestSide`, updated `dayDiningCopy` / `dayLunchCopy`, and inserted the BerlinWalk lunch block into `tourFrameworkTemplate`.

**Verified:**
- `node ultimate-berlin-trip-planner/launch-audit.mjs` → `153 pass / 0 warn / 0 block`.
- `git diff --check` → clean.
- Local Browser DOM QA: 7-day unlocked plan has no repeated food-map recommendations, BerlinWalk day includes `Lunch near Hackescher Markt`, old `Water, base map, sleep` and `See the main history sights` strings are gone, and 430px-style horizontal overflow check remains clean.
- Afternoon-arrival QA: Day 1 no longer creates a separate dinner plus evening duplicate; west-side museum day now uses west-side dinner copy and a west-side restaurant.

**Next session should:** Yusuf can review the local widget once; if approved, push this cleanup. Remaining polish can focus on PDF/print design and broader itinerary copy, not the core meal de-duplication.

## 2026-06-07 — Antigravity (Ultimate Trip Planner West-Side Geographic Logic Fixes)

**Did:**
- Fixed the geographic inconsistency in Day 6 (Local Neighborhood) where the lunch and dinner copies statically suggested both West (Savignyplatz) and North/East (Kulturbrauerei) locations simultaneously. Both copies are now fully dynamic based on the user's selected `base` (stayArea).
- Fixed the Day 7 (Museums) dinner copy logic. Previously, Day 7's title was "West-side or base dinner" but `dayDiningCopy` incorrectly grouped 'museums' with 'history' and forced Mitte dining recommendations (Clärchens Ballhaus, Monsieur Vuong). Day 7 now correctly recommends West-side dining (Dicke Wirtin) or base dining.
- Simplified Day 7's Evening title to just "Dinner" for cleaner rendering.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — Updated `dayDiningCopy` and `dayLunchCopy` to separate 'history' and 'museums' types, made 'local' logic dynamic based on `state.stayArea`, and refined Day 6/Day 7 template titles and copy.
- QA: `node ultimate-berlin-trip-planner/launch-audit.mjs` passed `153 pass`.

## 2026-06-07 — Antigravity (Ultimate Trip Planner Fallback Links & Explanation Append Fixes)

**Did:**
- Removed the automatic appending of place catalog `why` explanations inside `dayBlockDisplayCopy` to prevent the tone from sounding encyclopedic and repetitive.
- Removed the fallback map links inside `blockMapLinks` that assigned 0-score locations when no specific places were mentioned, preventing unrelated map pins (like Hackesche Höfe under a Prenzlauer Berg walk).
- Updated the generic Day 4 (Food) Evening title from "Dinner in Kreuzberg" to a dynamic "Dinner" to adapt smoothly when the user's accommodation is in the North and dinner options switch to Kastanienallee.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — simplified `blockMapLinks` and `dayBlockDisplayCopy`, updated Evening block title.
- QA: `node ultimate-berlin-trip-planner/launch-audit.mjs` passed `153 pass`.

**Next session should:** Yusuf can push the widget frontend changes to GitHub to apply these fixes live.

## 2026-06-07 — Antigravity (Ultimate Trip Planner Copy Simplification, Lunch & East Dining Fixes)

**Did:**
- Simplified and shortened static block titles and descriptions in `dayTemplate` and helper functions to under 90 characters, making them flat, natural, and direct.
- Integrated a new `Lunch` block helper `dayLunchCopy(day)` providing geographically matched dining alternatives (Mitte, Prenzlauer Berg, Friedrichshain, Potsdam, etc.) mapped between Morning and Afternoon, setting deterministic timing (`12:00-13:30`) for it, and dynamically shifting it to `13:30-14:30` on walking tour days (forcing Hackescher Markt lunch recommendations).
- Enhanced and rewrote the significance ('why' field) of all recommended catalog locations in `PLACE_CATALOG`, including newly added dining spots, to explain clearly why they should be visited.
- Fixed Mustafa's Gemüse Kebap description (changing falafel to chicken döner) and corrected food day lunch suggestions to target Prenzlauer Berg instead of Kreuzberg.
- Added a weekly market check for Hackescher Markt (operational only on Thursdays and Saturdays) to conditionally recommend street food stalls, and added 5 alternative Mitte dining spots (Monsieur Vuong, Shiso Burger, Curry 61, YamYam, Clärchens Ballhaus) as deterministic-random suggestions for walking tour days.
- Enabled automatic Google Maps search links generation for all recommended lunch and dinner spots by adding them to `PLACE_CATALOG` and updating `blockMapLinks` to scan all catalog keys.
- Fixed a text normalization bug in `blockMapLinks` where uppercase characters, German umlauts, and apostrophes prevented proper catalog matching.
- Prevented fallback map links from incorrectly appending their descriptive explanations to block text by enforcing a `score > 0` check in `dayBlockDisplayCopy`.
- Replaced generic Day 1 dinner strings with specific, map-linkable dining recommendations matching the stay area (Mitte, Prenzlauer Berg, Friedrichshain, Charlottenburg).
- Fixed the "Dinner east" recommendation by removing Rüyam Gemüse Kebab (located in Schöneberg) and recommending Boxhagener Platz vegan/Vietnamese or Schlesisches Tor Burgermeister instead.
- Refined the Velo backend Gemini prompt in `tripPlannerFunnel.js` to enforce a WhatsApp-style flat, zero-hype, non-exclamation-mark tone.
- Replaced the subtle guide note loading green avatar pulse effect with a prominent, rotating green border spinner ring around Yusuf's avatar.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — simplified templates, added `dayLunchCopy`, hooked lunch to `dayBlockDisplayCopy`, corrected dinner east mapping, updated all place catalog explanations, and replaced loading pulse with a rotating border spinner.
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js` — refined system instruction guidelines in `geminiPrompt`.
- `ultimate-berlin-trip-planner/velo/install-kit.html` — regenerated.
- QA: `node ultimate-berlin-trip-planner/launch-audit.mjs` passed `153 pass`.

**Next session should:** Yusuf can push the widget frontend changes and copy the newly updated backend Velo code (already on clipboard) into Wix Velo.

## 2026-06-07 — Antigravity (Ultimate Trip Planner Revisions & Audits)

**Did:**
- Applied revisions based on test feedback: dynamic dining recommendations for closing blocks, personalized lead gate subtitle copy, descriptive place contexts, and clickable PDF resource card links.
- Updated the PDF Guide Note generator to output all plan days dynamically rather than slicing to the first 3 days.
- Added a pulsing skeleton loading animation and avatar pulse effect to the guide note loading panel.
- Refined `PLACE_CATALOG` descriptions to be warmer and more descriptive, explaining what each place is and why to go.
- Refined Velo backend Gemini prompt templates to make guide notes flatter, casual, and conversational.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — updated dayBlockCopy call sites, drawYusufNote coordinates/loop, aiEnhancementHtml loading state, PLACE_CATALOG, and CSS animations.
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js` — refined geminiPrompt instructions.
- `ultimate-berlin-trip-planner/velo/install-kit.html` — regenerated.
- QA: `node ultimate-berlin-trip-planner/launch-audit.mjs` passed `153 pass`.

**Next session should:** Yusuf can review the new guide note layout and load animation, and paste the regenerated `install-kit.html` into Wix Velo.

## 2026-06-06 — Codex (Ultimate mobile overflow + print cleanup)

**Did:** Closed the last two Ultimate Trip Planner issues Yusuf found: mobile unlock no longer widens the branded planner page, and print/simple PDF resource sections no longer show command-like `Open PDF` / `Open map` labels.

**Changed:**
- `berlin-trip-planner-page/berlin-trip-planner-page-element.js` — added host/wrapper/section/iframe width guards for the branded `/berlin-trip-planner` custom element; removed the mobile negative margin around the planner iframe shell to prevent 1-2px horizontal scroll after unlock.
- `ultimate-berlin-trip-planner/index.html` — tightened widget full-plan overflow guards; print shopping notes no longer include `Open map`; simple PDF resource action labels now read `Official map` / `Area note` instead of `Open PDF` / `Open map`.
- QA: `node --check berlin-trip-planner-page/berlin-trip-planner-page-element.js` passed; `launch-audit.mjs` passed `153 pass`; `git diff --check` passed; local Browser mobile QA at 430px showed both branded wrapper and direct unlocked widget at `scrollWidth=430`, `clientWidth=430`, with no overflowing elements.

**Opened:** Push/deploy still needed for the frontend widget + branded page custom element changes to reach GitHub Pages/live Wix.
**Closed:** Mobile horizontal scroll after unlock and print/simple-PDF resource command wording are fixed locally.

**Next session should:** Push the widget repo, wait for GitHub Pages, then test `/berlin-trip-planner` live on iPhone Chrome after unlocking a 7-day plan.

## 2026-06-06 — Codex (Ultimate share/print/Yusuf-note cleanup)

**Did:** Fixed the issues found in the final Ultimate Trip Planner test pass: shared plan links no longer look like raw GitHub links, print/PDF no longer expose useless "Open PDF" resource commands, and Yusuf's note no longer shows fallback/quota copy or partial/out-of-order day stories.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — `planShareUrl()`/email/share URLs now use the branded `https://www.berlinwalk.com/berlin-trip-planner?...&planAccess=1`; WhatsApp copy drops the artificial one-line plan title; widget meta description is shorter.
- `ultimate-berlin-trip-planner/index.html` — AI day stories now render every plan day in plan order, filling missing AI stories locally; visible `AI limit`/`Local fallback` copy is removed from the guide panel.
- `ultimate-berlin-trip-planner/index.html` — print/PDF transport resource labels no longer say `Open PDF`; print output uses source-style wording for official BVG/VBB maps; trip calendar export replaces the artificial plan-title line with `Your day-by-day Berlin plan`.
- QA: `launch-audit.mjs` passed `153 pass`; `git diff --check` passed; local Browser QA on a 4-day unlocked plan confirmed WhatsApp uses branded `/berlin-trip-planner` with `planAccess=1`, no artificial title in WhatsApp or calendar export, Yusuf note shows D1-D4 in order, no visible fallback text, and no visible `Open PDF` in the checked output.

**Opened:** Push/deploy still needed for the frontend widget changes to reach GitHub Pages/live embeds.
**Closed:** Final share preview/copy, print resource wording, and Yusuf note fallback/order bugs are fixed locally.

**Next session should:** Push the widget repo, then test one live shared WhatsApp link and one print/PDF export from `/berlin-trip-planner`.

## 2026-06-06 — Antigravity (Added 2 unique images and SEO configuration)

**Did:**
- Generated 2 more unique, atmospheric, non-generic AI images (Cassiopeia alternative scene and BrewDog DogTap industrial gasworks).
- Embedded them with descriptive alt texts in the blog post body.
- Configured Wix SEO settings in the uploader script (og:image, twitter:image, and 5 validated keywords limit).
- Uploaded and updated the Wix blog draft.

**Changed:**
- `blog-drafts/berlin-beer-gardens-guide.body.md` — inserted DogTap and Cassiopeia images with descriptive alt texts.
- `create-wix-beer-gardens-blog-draft.js` (root) — added `og:image` and `twitter:image` to `seoData()`, and limited keywords to 5.
- Wix: updated draft `b1fd6483-089c-4e1f-9bf3-f7efd72d15db` to 160 nodes, 5 images, 4 embeds, and full SEO tags.

**Next session should:** Wait for Yusuf to review the draft and push the widgets repository using his local client.

## 2026-06-06 — Antigravity (Added beer gardens comparison widget)

**Did:**
- Created a new responsive, premium comparison table widget for the 12 beer gardens.
- Embedded it in the blog post body file and updated the Wix blog draft.

**Changed:**
- `beer-gardens-compare/index.html` — new widget with responsive table layout.
- `blog-drafts/berlin-beer-gardens-guide.body.md` — embedded the `{{widget:beer-gardens-compare}}` placeholder.
- `blog-drafts/berlin-beer-gardens-guide.md` — updated embeds plan.
- `create-wix-beer-gardens-blog-draft.js` (root) — added `beer-gardens-compare` configuration to `EMBEDS`.
- Wix: updated draft `b1fd6483-089c-4e1f-9bf3-f7efd72d15db` to 156 nodes, 4 embeds, 3 images.

**Next session should:** Wait for Yusuf to review the draft and push the widgets repository using his local client.

## 2026-06-06 — Antigravity (Expanded beer gardens to 12 spots)

**Did:**
- Expanded the Berlin Beer Gardens blog post and map widget from 10 to 12 locations by adding Eschenbräu (Wedding) and Biergarten Cassiopeia (Friedrichshain).
- Updated the Wix draft post with the updated 12-spot content (148 Ricos nodes).

**Changed:**
- `berlin-beer-gardens-map/index.html` — added Eschenbräu and Cassiopeia Sommergarten, updated mapped spots count to 12.
- `blog-drafts/berlin-beer-gardens-guide.md` — updated title, keywords, meta description, and sources.
- `blog-drafts/berlin-beer-gardens-guide.body.md` — added write-ups for the 2 new spots and updated H1/intro.
- `create-wix-beer-gardens-blog-draft.js` (root) — updated title/metadata in draft upload config.
- Wix: updated draft `b1fd6483-089c-4e1f-9bf3-f7efd72d15db` to 12 spots (148 nodes, 3 images, 3 embeds).

**Next session should:** Wait for Yusuf to review the draft and push the widgets repository using his local client.

## 2026-06-06 — Codex (Ultimate branded email plan links)

**Did:** Switched Ultimate Trip Planner email plan links from the raw GitHub widget URL to the branded `/berlin-trip-planner` page with saved choices and unlocked access; Yusuf pasted/published the Velo update and live smoke passed.

**Changed:**
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js` — `planUrlForEmail()` now builds `https://www.berlinwalk.com/berlin-trip-planner?...&planAccess=1`, preserving existing plan query params and defaulting `context=tool`.
- `ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs` — dry-run/live smoke payloads now use the branded planner page as `page`.
- `ultimate-berlin-trip-planner/velo/install-kit.html` — regenerated paste-ready Wix Velo install kit.
- `berlin-trip-planner-page/README.md`, `berlin-trip-planner-page/SEO_SETTINGS.md`, root `PROJECT_MEMORY.md` — documented that Ultimate email `${planUrl}` now targets the branded saved-plan page.
- Wix: Yusuf pasted/published the updated `Backend/tripPlannerFunnel.js`.
- QA: `launch-audit.mjs` passed `153 pass`; `velo/prepublish-gate.mjs` passed `13 pass, 0 block`; syntax checks passed; first same-date smoke skipped instant as `already_sent`; fresh live `tripPlannerLead` smoke wrote `output/qa/ultimate-trip-planner-live-smoke/live-branded-plan-link-fresh-20260606.json` with `/berlin-trip-planner?...&planAccess=1` and `instant.sent: true`; Gmail readback of the latest email confirmed the Wix tracking button wraps `https://www.berlinwalk.com/berlin-trip-planner?...&planAccess=1`, not GitHub Pages.

**Opened:** Confirm the newest Gmail test link opens the branded page unlocked with restored choices in the browser; older emails may still point to the old GitHub URL.
**Closed:** Live email plan URL generation now points at the branded Trip Planner page.

**Next session should:** Click the latest test email link in Gmail and confirm it opens `/berlin-trip-planner` with the plan unlocked and choices restored.

## 2026-06-06 — Codex (Ultimate guide-note gate)

**Did:** Changed the Ultimate Trip Planner unlock flow so the full itinerary waits for Yusuf/Gemini guide note before revealing the day cards.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — full plan now shows only the guide-note loading panel after email unlock; day cards, unlocked dashboard, PDF/print/share actions, transport maps, shopping, and essentials wait until AI succeeds or local fallback is ready. Gemini failures/file preview/forced local errors now use `localGuideFallback()` instead of leaving an empty/error AI state, so the visitor is never stuck.
- `berlin-trip-planner-page/berlin-trip-planner-page-element.js` — local QA params (`resetUnlock`, `forceLeadError`, `forceAiError`, `mockAi`) now pass through to the embedded widget for clean wrapper testing.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — updated audit expectations so the guide note intentionally gates full-plan visibility, while still requiring fail-soft fallback and backend-only email quota use.
- QA: `launch-audit.mjs` passed `153 pass`; syntax checks passed. Playwright 430px mobile wrapper test: before unlock only preview/result shows; immediately after unlock guide loading shows with `dayCards: 0`; after mock AI returns note is ready, `dayCards: 7`, actions/dashboard visible, iframe height ~`13915px`, and page/child width stays `430/430`.

**Opened:** Push/deploy needed, then live iPhone Chrome test with real Gemini latency.
**Closed:** Full plan no longer appears before the guide note/fallback is ready.

**Next session should:** After push, test the live branded `/berlin-trip-planner` flow with a real email and real Gemini response; confirm the loading note is short enough and does not feel like a second long wait after the 6.5s build animation.

## 2026-06-06 — Antigravity (Beer Gardens map widget & images)

**Did:**
- Generated 3 beautiful, high-quality, cinematic AI images using Gemini (Prater, Café am Neuen See, BRLO Brwhouse) and inserted them into the beer gardens blog post.
- Developed a new responsive Leaflet-based map widget `berlin-beer-gardens-map` showing the 8 beer gardens, with atmosphere filters (Traditional, Scenic, Modern) and Google Maps links.
- Registered the new widget in `tools-hub/data.json` and updated the Wix blog draft (ID: `b1fd6483-089c-4e1f-9bf3-f7efd72d15db`) with the updated body and images.

**Changed:**
- `berlin-beer-gardens-map/index.html` — new Leaflet map widget.
- `tools-hub/data.json` — registered the new beer gardens map tool.
- `blog-drafts/berlin-beer-gardens-guide.body.md` — added images and map widget placeholders.
- `create-wix-beer-gardens-blog-draft.js` — upgraded script to support image uploads, cache, and existing draft updating.
- Wix: updated draft `b1fd6483-089c-4e1f-9bf3-f7efd72d15db` with 116 nodes, 3 uploaded inline images, and 3 embeds.

**Opened:**
- Push `berlinwalk-widgets` to deploy the new map widget and tools hub update on GitHub Pages.
- Review and publish the updated draft in the Wix Editor.

**Next session should:** Wait for Yusuf to push the repository and publish the beer gardens guide draft.

## 2026-06-06 — Codex (Ultimate mobile unlock/iframe scroll fix)

**Did:** Fixed mobile unlock behavior for `/berlin-trip-planner`: after email/full-plan unlock the parent page scrolls to the top of the unlocked plan, and long plans no longer leave the embedded planner trapped in its own internal iframe scroll.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added frame sync helpers that report content height to the parent, request parent scrolling after build/unlock, reset child iframe scroll, guard horizontal overflow on `html/body/#bw-trip-planner`, and keep reporting size through load/resize/ResizeObserver changes.
- `berlin-trip-planner-page/berlin-trip-planner-page-element.js` — accepts large planner heights up to `30000px`, handles `bw-scroll-to`, disables iframe scrolling, accepts trusted messages by iframe origin as well as source, and adds a same-origin readable-frame fallback plus load/resize height checks.
- QA: `node ultimate-berlin-trip-planner/launch-audit.mjs` passed `153 pass`; `node --check berlin-trip-planner-page/berlin-trip-planner-page-element.js` passed. Playwright iPhone-width QA (`430x932`) on a 7-day unlocked plan now grows the iframe from the broken `1908px` state to about `14kpx`, with `scrollWidth === clientWidth === 430`. Locked → email fail-soft unlock also scrolls the full plan to the top of the viewport (`~14px`) with no horizontal overflow.

**Opened:** Push/deploy needed, then live-test `/berlin-trip-planner` on iPhone 15 Plus Chrome with a 7-day unlocked plan and an email-unlock plan.
**Closed:** The local mobile iframe internal-scroll and unlock scroll-position bugs are fixed.

**Next session should:** Push/deploy this fix, cache-bust the Wix page script if needed, then verify on the real phone. If live still differs, inspect Wix/Chrome message origin behavior first; local postMessage and same-origin fallback are both green.

## 2026-06-06 — Codex (Ultimate weather fail-soft fallback)

**Did:** Fixed Ultimate Trip Planner weather behavior so failed mobile/API fetches no longer show "weather unavailable"; they fall back to Berlin monthly averages.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added a 6.5s Open-Meteo timeout, validates the JSON payload, treats API/timeout/parse failures as monthly-average fallback, removes the visible `Weather fallback` / `Weather check unavailable` state, and keeps daily weather chips populated from climate fallback.
- QA: Open-Meteo endpoint returned 16 daily forecast rows locally; `launch-audit.mjs` passed `153 pass`; Playwright checked live forecast, `weather=off` fallback, and exact 15-day edge date with no `unavailable` text and daily weather chips present.

**Opened:** Push/deploy needed, then test on phone again against GitHub/Wix cache-busted URL.
**Closed:** Local weather API, fallback, and 15-day boundary behavior are fixed.

**Next session should:** After push/deploy, retest the same phone scenario; if mobile still fails live API, the UI should now show monthly averages instead of an unavailable state.

## 2026-06-06 — Codex (Homepage Trip Planner teaser)

**Did:** Added a new standalone homepage Custom Element for promoting the `/berlin-trip-planner` page as its own homepage section.

**Changed:**
- `trip-planner-home/trip-planner-home-element.js` — new `<bw-trip-planner-home>` compact feature band with Berlin Trip Planner headline, direct CTA, blurred hero background, four visual proof cards, responsive desktop/mobile layout, and GitHub Pages/local asset resolution.
- `trip-planner-home/index.html` and `trip-planner-home/README.md` — local preview plus Wix install snippet.
- `README.md` and `wix-embed-snippets.md` — registered the new homepage section URL/tag with cache-bust `?v=20260606`.
- `output/playwright/trip-planner-home-20260606/` — desktop and mobile QA screenshots.

**Opened:** Push/deploy needed, then add the new Custom Element section to Wix homepage where Yusuf wants the planner promo.
**Closed:** Homepage task 1 local implementation is ready.

**Next session should:** After push/GitHub Pages deploy, add `<bw-trip-planner-home>` to the homepage and live-QA it near the planning/tools area before moving to menu/email/tool-grid cleanup.

## 2026-06-06 — Codex (Trip Planner live resize gap guard)

**Did:** Reworked the live `/berlin-trip-planner` Wix gap fix after the margin guard proved unreliable across browsers.

**Changed:**
- `berlin-trip-planner-page/berlin-trip-planner-page-element.js` — the guard now pins the Wix-generated custom-element wrapper to `start/stretch`, resets the generated grid row/section height to `auto`, and keeps the resize observers/timers. This targets the root cause: Wix live was setting the wrapper to `place-self: center`, which vertically centered the planner inside an oversized generated grid and created matching top/bottom blanks.
- `berlin-trip-planner-page/SEO_SETTINGS.md` — install snippet now uses `?v=20260606-wrapper` so Wix can cache-bust the new wrapper fix.

**Opened:** Push/deploy still needed; update the Wix page script URL to `?v=20260606-wrapper`, publish, then live QA in Chrome/Opera by resizing `/berlin-trip-planner`.
**Closed:** Live measurement found the true cause: the Wix wrapper `.comp-mq1axvyp` computed as `place-self: center`; temporary live injection of the wrapper fix closed top and footer gaps without negative margins.

**Next session should:** Push this wrapper fix, wait for GitHub Pages, update/publish the Wix script tag, then verify `/berlin-trip-planner` at normal and wide browser widths before continuing homepage mini teaser work.

## 2026-06-05 — Codex (Trip Planner live top-gap guard)

**Did:** Diagnosed and fixed the live `/berlin-trip-planner` top and bottom whitespace that appeared around the custom element in the live Wix page but not in Wix Studio editor.

**Changed:**
- `berlin-trip-planner-page/berlin-trip-planner-page-element.js` — added a Wix-only section gap guard: if the custom element renders far below its containing Wix section on live, it applies matching negative top and bottom margins. This aligns the planner hero directly under the site header and removes the same leftover blank space above the footer. The guard re-checks a few times after load because Wix live layout settles asynchronously.

**Opened:** Needs commit/push/deploy, then live QA on `/berlin-trip-planner` with cache-bust.
**Closed:** Root cause identified: Wix live wrapper positioned the custom element about 374px below its section top; after the top correction the exact same 374px remained below the element before the footer, so the guard now compensates both sides.

**Next session should:** Push this one-file fix, wait for GitHub Pages, then verify `/berlin-trip-planner?v=gap-fix` starts immediately below the header and ends immediately before the footer before returning to homepage teaser work.

## 2026-06-05 — Codex (Trip Planner landing/widget alignment + iconset fix)

**Did:** Fixed the latest `/berlin-trip-planner` local QA issues: the embedded planner form no longer sits left with a hidden right column, and the hero proof icons now use Yusuf's latest `ikonset.png` artwork as transparent icons without an extra white tile background.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — form-only/result-hidden states now use a centered single-column body (`min(1120px, 100%)`), while the two-column result layout only activates when the locked preview is actually visible.
- `berlin-trip-planner-page/assets/` — replaced `proof-plan/weather/map/guide.webp` with optimized transparent crops from `/Users/yusufucuz/Downloads/ikonset.png` (320px WebP) and added `_src/ikonset-header-proof-20260605.png`.
- `berlin-trip-planner-page/assets/ASSET_SOURCES.md` — documented the new iconset source/crop notes.
- `berlin-trip-planner-page/berlin-trip-planner-page-element.js` — local preview now embeds the local widget path instead of the GitHub widget URL; proof icon tiles use `object-fit: contain`, padding, and a slightly wider square slot so artwork does not touch the edges.
- `output/playwright/berlin-trip-planner-page/` — added QA screenshots for desktop hero, desktop embedded form, and mobile hero; checks showed no horizontal overflow, equal form side gaps, and 4 loaded 320x320 proof icons.

**Opened:** Push/deploy still needed before live `/berlin-trip-planner` can use these exact local fixes.
**Closed:** Yusuf's latest header iconset request, icon-edge-spacing question, and the desktop left-aligned embedded form issue are locally fixed.

**Next session should:** Push widgets, create/install the Wix `/berlin-trip-planner` page, then switch email plan links from the direct GitHub widget URL to the branded page when live.

## 2026-06-05 — Claude Code (Pride draft: inline images in via API)

**Did:** Placed the 2 inline images + photo credits into the Berlin Pride Wix draft by rebuilding the full richContent and re-creating the draft (the draft body is not editable via GET/PATCH — richContent returns 0 nodes, so I built it locally and POSTed fresh).

**Changed:**
- Wix Blog: NEW draft `9a5e6d05-5a4e-4658-a311-c9146c17ade9` (slug `berlin-pride-csd-2026`, UNPUBLISHED), built via local `markdownToRicos` + spliced IMAGE nodes. 96 nodes, 2 IMAGE (Nollendorfplatz rainbow in the Schöneberg section, Memorial in the history section, each with a centered small photo-credit caption) + 3 HTML embeds (quick-summary, parade-map widget, FAQ). Cover (parade) + 2 categories (Tourist Tips, Berlin History) set in the create. Old draft `51f9bda0-…` DELETED. Only one Pride draft remains.
- `blog-drafts/berlin-pride-csd-2026.md` — updated Wix draft ID + Visual Notes (all images now in via API; nothing left for the editor).
- Image node schema copied from the live Festival of Lights post (`imageData.image.src.id` + width/height + altText + disableDownload). Credits are small centered caption paragraphs under each image.

**Opened:**
- Yusuf: review draft `9a5e6d05-…` and **publish**. (Cover + both inline images + credits + qs/FAQ/parade-map are all in; the week timeline is a text link to its tool page — embed it inline in the editor only if you want it.)
- After publish: update the 2 Pride BerlinTools rows' relatedBlog from `berlin-in-july-2026` to the live Pride post.

**Closed:** Pride post fully assembled in Wix (real photos, credits, embeds, cover) — ready to publish, no manual image step left.

**Next session should:** After Yusuf publishes, verify qs/FAQ/widgets render and swap the Pride tools' relatedBlog; optionally build the `festival-lights-route` widget + tool icons.

## 2026-06-05 — Codex (Berlin Trip Planner visual asset pack)

**Did:** Replaced placeholder proof/process visuals on the standalone `/berlin-trip-planner` landing page with one generated BerlinWalk-style asset set.

**Changed:**
- `berlin-trip-planner-page/assets/` — added the ChatGPT-generated source sheet, 4 cropped WebP proof icons, 3 cropped WebP process illustrations, and `ASSET_SOURCES.md` with the exact prompt/source notes.
- `berlin-trip-planner-page/berlin-trip-planner-page-element.js` — wired the new proof icons and process illustrations, replaced the blue `Use it when` band with a blurred image background, and kept the CTA/process images visually distinct from the lower itinerary art.
- `output/playwright/berlin-trip-planner-page/` — added contact sheet and desktop/mobile QA screenshots; checks confirmed no horizontal overflow, 4 proof icons, 3 process images, and the blurred background image loading.

**Opened:** Landing page still needs push/deploy, Wix `/berlin-trip-planner` page creation, and menu/homepage wiring before email links move away from the direct GitHub widget URL.
**Closed:** Yusuf's latest visual-feedback pass for proof icons/process cards/blurred section is locally implemented and QA'd.

**Next session should:** Push widgets, install `<bw-berlin-trip-planner-page>` on the Wix `/berlin-trip-planner` page, then live-QA the branded page before changing email `${planUrl}`.

## 2026-06-05 — Claude Code (Berlin Pride post: real photos + Wix draft)

**Did:** Took the Berlin Pride / CSD 2026 post to publish-ready: sourced 3 real CC Commons photos, added qs/FAQ data + FAQ schema, and created the Wix blog draft with cover, parade-map widget, quick-summary and FAQ embedded.

**Changed:**
- `blog-drafts/images/berlin-pride-csd-2026/` — 3 optimized real Commons photos: cover `berlin-pride-csd-parade.jpg` (CSD 2025 "Ganz vorne", IgorCalzone1, CC0, 337 KB); `berlin-pride-nollendorfplatz-rainbow.jpg` (Fridolin freudenfett, CC BY-SA 4.0, 257 KB); `berlin-pride-memorial-homosexuals.jpg` (Gerd Eichmann, CC BY-SA 4.0, 209 KB) + `_src/` + `visual-sources.md`.
- Wix Media: uploaded all 3 (cover `5a08a3_14cf449f…`, nollendorf `5a08a3_cc50b46c…`, memorial `5a08a3_91ecc426…`), all HTTP 200.
- Wix Blog: created draft `51f9bda0-30e6-4118-a11c-232b7dbde002` (slug `berlin-pride-csd-2026`, UNPUBLISHED) via Content Studio `/api/blog-publish` — 88 nodes, 3 HTML embeds (quick-summary, parade-map widget, FAQ). PATCHed the cover image + alt via the Blog Draft Posts API. The timeline widget placeholder was published as a text link to `/tools/berlin-pride-week-timeline` (blog-publish supports one inline widget).
- `quick-summary/data.json` + `faq/data.json` — added `berlin-pride-csd-2026` entries; `faq/inject.js` — added SLUG_MAP + FAQPage SCHEMAS (node --check passed).
- `blog-drafts/berlin-pride-csd-2026.md` — added Wix draft ID + Visual Notes (image IDs, alt text, placements, credit + timeline notes).

**Opened (Yusuf to finish before publishing):**
- PUSH `berlinwalk-widgets` so the new `quick-summary`/`faq` data + `inject.js` go live (until then the qs + FAQ embeds in the draft are empty).
- In the Wix draft editor: drop the 2 inline images at the marked spots (alt text in Visual Notes), add a visible photo credit for the 2 CC BY-SA images, optionally embed the timeline widget inline, then review + publish.
- Once published, update the 2 Pride BerlinTools rows' relatedBlog from `berlin-in-july-2026` to the live Pride post.

**Closed:** Pride post is publish-ready (draft built, cover set, real photos uploaded, qs/FAQ wired).

**Next session should:** After Yusuf publishes, verify qs/FAQ render and swap the Pride tools' relatedBlog; optionally build the `festival-lights-route` widget + Pride/FoL tool icons.

## 2026-06-05 — Codex (Berlin Trip Planner landing page polish)

**Did:** Applied Yusuf's visual-feedback pass to the standalone `/berlin-trip-planner` landing page.

**Changed:**
- `berlin-trip-planner-page/berlin-trip-planner-page-element.js` — removed the hero secondary `See how it works` button and the final `Only need day one?` CTA, reframed the email-gate copy as `send/save your plan`, added square proof icons, added day-art images to the three process cards, switched Yusuf's guide image to a high-resolution Wix portrait asset, and tightened final CTA spacing/color.
- `output/playwright/berlin-trip-planner-page/` — added updated desktop/mobile QA screenshots; checks confirmed hero/final button counts, no horizontal overflow, step images loaded, and Yusuf image natural size `900x1125`.

**Opened:** Landing page still needs GitHub push, Wix page creation at `/berlin-trip-planner`, menu/homepage wiring, and eventual email `${planUrl}` switch to the branded page once live.
**Closed:** Latest local landing-page polish pass is review-ready.

**Next session should:** Push/deploy the landing page, then install it on the Wix `/berlin-trip-planner` page and verify the live embed.

## 2026-06-05 — Codex (Berlin Trip Planner landing page)

**Did:** Designed and implemented the standalone `/berlin-trip-planner` landing page shell for the Ultimate Planner.

**Changed:**
- `berlin-trip-planner-page/berlin-trip-planner-page-element.js` — new `<bw-berlin-trip-planner-page>` custom element with image-led hero, embedded planner iframe, local-guide section, coverage cards, CTA sections, auto-height listener, and parent query forwarding into the planner iframe including `planAccess=1`.
- `berlin-trip-planner-page/index.html` — local standalone preview.
- `berlin-trip-planner-page/SEO_SETTINGS.md` and `README.md` — Wix install snippet, `/berlin-trip-planner` SEO basics, WebApplication schema, and rollout notes.
- `output/playwright/berlin-trip-planner-page/` — desktop/mobile QA screenshots and checks; overflow `0`, iframe receives saved params and `attribution=none`.

**Opened:** Push to GitHub Pages, create Wix page `/berlin-trip-planner`, install the custom element, then switch Ultimate email `${planUrl}` from direct GitHub widget to branded `/berlin-trip-planner` once live.
**Closed:** Standalone page design/implementation is locally ready.

**Next session should:** Open the local preview with Yusuf, tune copy/layout if needed, then publish the page and remove/de-emphasize Ultimate from generic tools surfaces.

## 2026-06-05 — Codex (Ultimate email direct unlock fix)

**Did:** Fixed the latest Ultimate Trip Planner email-link issue where `${planUrl}` could open the Wix wrapper page without unlocking the iframe widget.

**Changed:**
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js` — `planUrlForEmail()` now always rebuilds the email link as the direct GitHub Pages widget URL, preserves saved planner query params, and forces `planAccess=1`.
- `ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs` — smoke-test payloads now use the same direct widget URL so future email tests measure the real unlock behavior.
- `output/qa/ultimate-trip-planner-live-smoke/dry-run-direct-widget-link-check.json` — dry-run evidence confirms host `fenerszymanski.github.io` and `planAccess=1`.
- `output/qa/ultimate-trip-planner-live-smoke/live-direct-widget-link-2026-06-05b.json` — live smoke to `yusuf.ucuz@gmail.com`, arrival `2026-07-17`, returned `instant.sent: true`; Yusuf confirmed the email link opens the plan unlocked.

**Opened:** Future product direction: Ultimate Planner should move to its own standalone BerlinWalk page, not live as a normal tools-grid item long term.
**Closed:** Syntax checks passed; `launch-audit.mjs` `153 pass`; Velo `prepublish-gate.mjs` `13 pass`; live email smoke worked after Wix publish.

**Next session should:** Design/implement the standalone Ultimate Planner page and later remove/de-emphasize it from generic tools surfaces once that page is ready.

## 2026-06-05 — Claude Code (Pride widgets to tools pages)

**Did:** Promoted the two Berlin Pride post widgets into BerlinTools, so they have standalone `/tools/<slug>` pages and appear in the `/tools` + `/widgets` grids. (Festival of Lights post confirmed live.)

**Changed:**
- Wix: inserted 2 BerlinTools CMS rows via Content Studio `/api/insert-berlintool` — `berlin-pride-week-timeline` (itemId `773220f1-…`) and `berlin-pride-parade-map` (itemId `00737be5-…`). Both dynamic pages verified LIVE: `https://www.berlinwalk.com/tools/berlin-pride-week-timeline` and `/tools/berlin-pride-parade-map` return HTTP 200 (no re-save needed). relatedBlog points to the live `berlin-in-july-2026` post for now (swap to the Pride post once it is published).
- `tools-hub/data.json` — added the 2 Pride entries (category Discovery, embedHeight 1180/900, no icon yet). Now 41 tools.
- `widgets-hub/SEO_ADDITIONAL_TAGS.md` — re-ran `widgets-hub/_regenerate_seo.py`; ItemList now 40 widgets incl. both Pride, 6084 chars (under the 7000 Wix limit).
- Both Pride widget folders confirmed live on GitHub Pages (HTTP 200).

**Opened:**
- PUSH `berlinwalk-widgets` so GitHub Pages serves the updated `tools-hub/data.json` — until then the `/tools` + `/widgets` GRID cards won't show (the dynamic `/tools/<slug>` pages already work because they are CMS-driven).
- Paste the regenerated ItemList into Wix Studio → `/widgets` → Advanced SEO (manual).
- Pride cards have no icon (letter chip fallback); generate 2 icons later via the ChatGPT-browser flow like the basketball icons.
- When the Pride post goes live, update both CMS rows' relatedBlog to it.

**Closed:** Pride timeline + parade map now have live BerlinTools pages and are wired into the tools directory data.

**Next session should:** After Yusuf pushes the repo, verify the 2 new cards render on `/tools` and `/widgets`; optionally generate icons and build the `festival-lights-route` widget.

## 2026-06-05 — Codex (Ultimate email plan access)

**Did:** Made Ultimate Trip Planner email links reopen the saved-choice full plan directly instead of sending users back through the email gate.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — lead payload now sends a `planAccess=1` email URL, restores query-state links, auto-unlocks, and renders the full plan when that email access param is present; normal share/WhatsApp links still omit the access param.
- `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js` — `${planUrl}` now defensively appends `planAccess=1` in Velo email variables.
- `ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs` — dry/live smoke payloads now use realistic stateful planner URLs with `planAccess=1`.

**Opened:** Live rollout needs both GitHub Pages push for the widget JS and Wix Velo paste/publish for the backend `planUrlForEmail` helper.
**Closed:** Local QA confirmed email-link URL opens full plan with hidden gate, and WhatsApp/share links do not include `planAccess=1`; launch audit `153 pass`, prepublish gate `13 pass`.

**Next session should:** After Yusuf pushes and publishes Velo, run one live smoke to verify the received email link opens the full plan directly.

## 2026-06-05 — Claude Code (Festival of Lights AI images: optimize, upload, wire)

**Did:** Optimized Yusuf's 4 AI-generated Festival of Lights images, uploaded them to Wix Media, set the post cover via API, and recorded all alt text. The 3 inline images still need a quick Wix-editor swap.

**Changed:**
- `blog-drafts/images/festival-of-lights-berlin-2026/` — added 4 optimized JPGs at canonical names (brandenburg cover 283 KB/1760×1314; berliner-dom 281 KB; potsdamer 287 KB; oberbaum 215 KB), raw AI originals in `_src/ai/`, old safe set moved to `_safe-set-backup/`.
- Wix Media: uploaded all 4 (cover `5a08a3_b8fef771406e4a6cb2539dfcbd3ec3ec~mv2.jpg`; dom `…090d959d…`; potsdamer `…5651fe5e…`; oberbaum `…671c9fb0…`), all HTTP 200.
- Wix draft `c6e633aa-…` (Festival of Lights): PATCHed `media` (featured/cover) to the new Brandenburg AI image + alt text via Blog Draft Posts API. Inline body images NOT changed via API (draft body content not safely API-editable; richContent returned 0 nodes).
- `blog-drafts/festival-of-lights-berlin-2026.md` Visual Notes + `images/.../visual-sources.md` + `ai-image-prompts.md` — updated to the AI set with media IDs and alt text for all 4.

**Opened:**
- Yusuf to swap the 3 inline images in the Wix editor with the new media + alt text (cover already done). URLs/alt text are in the draft Visual Notes.
- `festival-lights-route` map widget referenced by `{{widget:festival-lights-route}}` still not built.

**Closed:** Festival of Lights images optimized, uploaded, alt text written, cover set.

**Next session should:** After Yusuf swaps the 3 inline images, build the `festival-lights-route` map widget, then add the qs/FAQ data entries for `festival-of-lights-berlin-2026`.

## 2026-06-05 — Codex (Ultimate live email retest)

**Did:** Sent another live Ultimate Trip Planner instant-email smoke test after Yusuf confirmed all five updated templates were live.

**Changed:**
- `output/qa/ultimate-trip-planner-live-smoke/live-2026-06-05T06-16-04-773Z.json` — new live smoke evidence for `yusuf.ucuz@gmail.com`, arrival `2026-07-02`, trip length `3`.
- Wix: live `POST /_functions/tripPlannerLead` returned `200`, reused contact `21700383-1cb1-49e5-8343-7357fc20e13d`, created lead `83904e12-59ed-49db-bd89-0028c1ba7461`, and returned `instant.sent: true`.

**Opened:** None.
**Closed:** Instant email live retest succeeded.

**Next session should:** Yusuf should check Gmail inbox/promotions/spam and judge the final rendered email copy.

## 2026-06-05 — Claude Code (Festival of Lights draft polish + photo research)

**Did:** Improved the Festival of Lights 2026 draft text, strengthened internal/external links, and researched real Festival of Lights photos (left the use decision to Yusuf because of the light-art copyright caveat).

**Changed:**
- `blog-drafts/festival-of-lights-berlin-2026.md` — richer intro (world's largest light-art festival, free admission), added a free-entry note in the dates section, and wove in 5 LIVE internal cross-links (St. Mary's Church, Berliner Dom, Bus 100, 7 best photo spots, eat near Alexanderplatz) on top of the existing ones. Verified all internal /post links resolve to live posts and `berlin-in-october-2026` is live (HTTP 200, PUBLISHED). No em dashes, no `1h45m`.

**Decision:** Yusuf chose to AI-generate the festival images himself (zero API spend) rather than use real projection photos, which cleanly avoids the light-art copyright issue. Real Commons candidates were verified but set aside (e.g. `2009-10-23 - Festival of Lights - Brandenburger Tor 4.JPG`, CC BY-SA 3.0, Michael F. Mehnert, 1920×1080).

**Changed (added):**
- `blog-drafts/images/festival-of-lights-berlin-2026/ai-image-prompts.md` — NEW. Four paste-ready photorealistic prompts mapped to the draft's image slots (cover = Brandenburg Gate 16:9; inline = Berliner Dom, Potsdamer Platz, Oberbaum Bridge 3:2), each with copyright-safe guardrails (original light patterns, recognisable architecture, no text/logos/watermarks).

**Opened:**
- Yusuf generates the 4 images in his ChatGPT Pro, drops them into the images folder; then crop/compress/brand/upload to Wix, swap the current safe images, and update `visual-sources.md` to note the AI source.
- `festival-lights-route` map widget referenced by `{{widget:festival-lights-route}}` in the draft is NOT built yet (offer to build, same pattern as the Pride widgets).

**Closed:** Text + link improvements for the Festival of Lights draft. Photo direction decided (AI-generate).

**Next session should:** Process Yusuf's generated images (crop/compress/upload/wire), then build the `festival-lights-route` map widget.

## 2026-06-05 — Codex (Basketball widgets to tools)

**Did:** Promoted the two FIBA Women's Basketball World Cup post widgets into BerlinTools entries and generated separate ChatGPT-browser icons.

**Changed:**
- `tools-hub/data.json` — added `basketball-worldcup-fixtures` and `basketball-worldcup-venues-map` with icon URLs, widget URLs, and embed heights.
- `tools-home/icons/basketball-worldcup-fixtures.png`, `tools-home/icons/basketball-worldcup-fixtures-160.png`, `tools-home/icons/basketball-worldcup-venues-map.png`, `tools-home/icons/basketball-worldcup-venues-map-160.png` — new generated icons.
- `tools-home/icons/_src/` — raw ChatGPT browser PNGs and `basketball-worldcup-icons-prompts.md`.
- `tools-home/icons/manifest.json` — recorded the two generated icon assets.
- `widgets-hub/SEO_ADDITIONAL_TAGS.md` — regenerated ItemList SEO, now 38 widgets.
- Wix: BerlinTools CMS rows inserted for `basketball-worldcup-fixtures` and `basketball-worldcup-venues-map`; both dynamic `/tools/<slug>` pages return HTTP 200.

**Opened:** Push this repo so GitHub Pages serves the new icon PNGs and the updated `tools-hub/data.json`; until push, the dynamic tool pages work but `/tools`/`/widgets` grids will not show the new cards/icons.
**Closed:** Two basketball post widgets now have standalone dynamic tool pages.

**Next session should:** Push/deploy widgets, then verify `/tools`, `/widgets`, and the two new cards/icons live.

## 2026-06-05 — Codex (Ultimate email wording cleanup)

**Did:** Applied Yusuf's line-level feedback to make the Ultimate Trip Planner emails plainer and less robotic.

**Changed:**
- `ultimate-berlin-trip-planner/email/e0-instant-plan.md` — added the explicit `Your plan is here:` link block to the first email.
- `ultimate-berlin-trip-planner/email/e2-three-days-before.md`, `e3-one-day-before.md`, `e4-arrival-day.md` — simplified selected prep sentences around three-day checks, first-day pacing, shoes, and arrival-day wording.
- `ultimate-berlin-trip-planner/email/paste-ready/` — regenerated the Wix copy kit and all five paste-ready emails.

**Opened:** None.
**Closed:** `launch-audit.mjs` passed `153 pass, 0 warn, 0 block`; `velo/prepublish-gate.mjs` passed `13 pass, 0 warn, 0 block`.

**Next session should:** Yusuf can refresh `email/paste-ready/copy-kit.html` and review the exact updated lines before pasting into Wix.

## 2026-06-05 — Codex (Festival of Lights visuals uploaded)

**Did:** Added Yusuf-approved Festival of Lights image set to the Wix draft and updated local source notes.

**Changed:**
- `blog-drafts/festival-of-lights-berlin-2026.md` — Visual Notes now list the uploaded cover/inline media IDs.
- `blog-drafts/images/festival-of-lights-berlin-2026/` — added optimized Potsdamer Platz night and Oberbaum Bridge blue-hour files, plus raw `_src/` downloads.
- `blog-drafts/images/festival-of-lights-berlin-2026/visual-sources.md` — updated from candidate list to uploaded source/credit record.
- `../berlinwalk-content-app/add-festival-of-lights-2026-images.mjs` — one-off script now handles cover + Berliner Dom + Potsdamer Platz + Oberbaum Bridge.
- Wix: draft `c6e633aa-a5d9-4779-98ad-c2cd0fd1a686` remains UNPUBLISHED; readback confirmed 3 inline IMAGE nodes, 3 HTML embeds, cover media, SEO image tags, and image alt text.

**Opened:** Push this repo so `festival-lights-route/`, quick-summary, FAQ, and schema changes resolve on GitHub Pages; then visual-QA the Wix draft before publish.
**Closed:** Visual selection/upload for the Festival post.

**Next session should:** Push/deploy widgets, check the Wix draft in the editor/preview, and publish only after Yusuf's final layout approval.

## 2026-06-04 — Codex (Ultimate tourist-prep email rewrite)

**Did:** Rewrote the Ultimate Trip Planner emails again after Yusuf clarified they should feel like a tourist-coming-to-Berlin prep sequence from blog/SEO leads, not planner-system emails.

**Changed:**
- `ultimate-berlin-trip-planner/email/e0-instant-plan.md` through `e4-arrival-day.md` — final direction: plan delivery, book-ahead reminders, Berlin tickets/opening-day prep, tomorrow/weather/meeting-point prep, and arrival-day calm guidance. Copy now uses fewer variables and reads more like Yusuf's local guide notes.
- `ultimate-berlin-trip-planner/email/paste-ready/` — regenerated all five Wix-safe HTML emails, preview, copy kit, manifest, README, and setup checklist.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — updated the email-copy guard to expect the new tourist-prep sequence.

**Opened:** Direct PDF file links remain a later backend/storage phase; current emails link back to the saved planner and explain that `Download PDF` happens inside the planner.
**Closed:** External prep links returned HTTP 200 for Bundestag, SMB, BVG, and VBB; `launch-audit.mjs` passed `153 pass, 0 warn, 0 block`; `velo/prepublish-gate.mjs` passed `13 pass, 0 warn, 0 block`.

**Next session should:** Yusuf should refresh `ultimate-berlin-trip-planner/email/paste-ready/copy-kit.html` and judge the email tone before any Wix paste/update.

## 2026-06-05 — Codex (Festival of Lights route blog)

**Did:** Built the Festival of Lights Berlin 2026 route-guide stack and created the Wix draft from the root content app.

**Changed:**
- `blog-drafts/festival-of-lights-berlin-2026.md` — NEW full English draft: dates, confirmed 2026 preview locations, central walking route, extensions, timing, transport, photo tips, BerlinWalk tie-in, and source/recheck notes.
- `festival-lights-route/index.html` — NEW post-only Leaflet route widget with 19 official-preview locations, core/old-centre/Potsdamer/extensions filters, route line, and local route notes.
- `quick-summary/data.json`, `faq/data.json`, `faq/inject.js` — wired QS/FAQ/schema under key `festival-of-lights-berlin-2026`.
- `blog-drafts/images/festival-of-lights-berlin-2026/` — NEW visual candidate folder: Brandenburg Gate night, Berliner Dom night, Potsdamer Platz blue hour, plus `visual-sources.md`; visual upload was completed in the later 2026-06-05 visuals entry above.
- `blog-workplan.md` — added the Festival of Lights post/widget to the priority queue and drafts list.
- `output/qa/festival-lights-route/desktop-1280.png`, `output/qa/festival-lights-route/mobile-390.png` — QA screenshots.
- Wix: UNPUBLISHED draft `c6e633aa-a5d9-4779-98ad-c2cd0fd1a686`, slug `festival-of-lights-berlin-2026`, created with 122 nodes and 3 embeds.

**Opened:** Push `berlinwalk-widgets` so the new route widget/QS/FAQ/schema resolve on GitHub Pages. Recheck final Festival of Lights programme/map/artwork details before publish.
**Closed:** Local widget QA passed: desktop 1280 overflow 0, 19 markers, 12 loaded tiles; mobile 390 overflow 0; filters core 15 and extensions 4; QS/FAQ render for the new key; JSON, `faq/inject.js`, draft script, widget inline script, and `diff --check` passed.

**Next session should:** Push/deploy widgets and visually QA the Wix draft before publish.

## 2026-06-04 — Codex (Ultimate prep-email link pass)

**Did:** Reframed the Ultimate Trip Planner email sequence as practical Berlin pre-arrival prep instead of a robotic plan report.

**Changed:**
- `ultimate-berlin-trip-planner/email/e0-instant-plan.md` through `e4-arrival-day.md` — rewritten around plan link/PDF clarification, book-ahead reminders, official Reichstag/Museum Island ticket links, BVG/VBB ticket links, BER Zone C, paper-ticket validation, weather, and meeting-point prep.
- `ultimate-berlin-trip-planner/email/build-triggered-email-html.mjs` — added safe markdown-link rendering so official prep links become clickable inside Wix email HTML.
- `ultimate-berlin-trip-planner/email/paste-ready/` — regenerated copy kit, preview, setup checklist, manifest, and all five Wix-safe HTML emails.
- `ultimate-berlin-trip-planner/index.html`, `velo/tripPlannerFunnel.js`, `velo/live-smoke-trip-planner.mjs`, `email/README.md`, `velo/README.md`, and `launch-audit.mjs` — clarified that the PDF is generated inside the unlocked planner, added `${planUrl}` to Velo email variables, and updated audits/docs.

**Opened:** Direct PDF file links still require a later backend PDF generation/storage or magic-link phase; V1 email now links back to the saved planner and tells users to use `Download PDF` there.
**Closed:** `launch-audit.mjs` passed `153 pass, 0 warn, 0 block`; `velo/prepublish-gate.mjs` passed `13 pass, 0 warn, 0 block`.

**Next session should:** Have Yusuf refresh `ultimate-berlin-trip-planner/email/paste-ready/copy-kit.html`, review the new prep-email tone, then paste/update the five Wix Triggered Emails only if approved.

## 2026-06-04 — Claude Code (2026 events research + Berlin Pride draft)

**Did:** Researched major 2026 Berlin tourist events for new event-tie-in blog opportunities, then (Yusuf's pick) drafted the Berlin Pride / CSD 2026 post. Basketball post is now LIVE: https://www.berlinwalk.com/post/fiba-womens-basketball-world-cup-2026-berlin

**Changed:**
- `blog-drafts/berlin-pride-csd-2026.md` — NEW full draft (standard format). Angle: Pride Week visitor guide + the deep history that makes Berlin a queer capital (Hirschfeld's Institute for Sexual Science 1919, Weimar Nollendorfplatz, 1933 Nazi destruction, the Nollendorfplatz plaque + Tiergarten memorial). Covers the Jul 25 parade route (Leipziger Str → Potsdamer Platz → Nollendorfplatz → Siegessäule → Brandenburg Gate), two-day format (Democracy Night Fri Jul 24), Pride Week (Stadtfest Jul 18-19, CSD on the Spree Jul 23), Schöneberg, practical tips, internal links + tour CTA. Two custom widgets embedded via `{{widget:...}}`. No em dashes, no `1h45m`.
- `berlin-pride-week-timeline/index.html` — NEW post widget. Vertical day-by-day Pride Week timeline (Stadtfest → CSD on the Spree → Democracy Night → parade → finale) with each event's time/place/nearest U-Bahn, a countdown to the parade (Jul 25 12:00), and a "Free & open to all" filter. Browser-verified: 5 items, parade highlighted, countdown live, free filter → 4, no console errors.
- `berlin-pride-parade-map/index.html` — NEW post widget. Leaflet/OpenStreetMap map: 6 numbered route points (Spittelmarkt → Potsdamer Platz → Nollendorfplatz → Urania → Victory Column → Brandenburg Gate) + the Tiergarten LGBTQ+ memorial, an indicative dashed route polyline, nearest U-Bahn per popup, filters (Best viewing / Route points / LGBTQ+ history). Browser-verified: 7 markers + polyline, tiles load, filters work (view → 3, history → 2, route → 3), no console errors.

**Opened:**
- qs/FAQ data entries needed for slug `berlin-pride-csd-2026`.
- New Pride widgets need a GitHub Pages push before `{{widget:...}}` embeds resolve live. Optionally add both to `tools-hub/data.json`.
- Reverify before publish: exact 2026 parade route/step-off time, Pride Week dates, any official 2026 motto, exact memorial/plaque wording.
- 2026 events pipeline identified (none have a dedicated live post): Festival of Lights (Oct 9-18, best brand fit), BMW Berlin Marathon (Sep 27), Christmas markets (Nov-Jan), Lollapalooza (Jul 18-19), summer stadium concerts, NYE at Brandenburg Gate (Dec 31). Consider logging into `blog-workplan.md`.

**Closed:** Optional Pride widgets (timeline + route map) — built, verified, and embedded in the draft.

**Next session should:** Get Yusuf's review of the Pride draft + widgets; if approved, build the qs/FAQ entries, push `berlinwalk-widgets` to GitHub Pages, move the post into a Wix draft, then start the next event post (Festival of Lights or Marathon).

## 2026-06-04 — Codex (Basketball official logo)

**Did:** Added the Yusuf-provided official FIBA Women's Basketball World Cup Germany 2026 logo to the blog draft.

**Changed:**
- `blog-drafts/images/fiba-womens-basketball-world-cup-2026-berlin/fiba-wwc-2026-official-logo.png` and `_src/fiba-wwc-germany-2026-official-logo.png` — new transparent PNG logo asset.
- `blog-drafts/images/fiba-womens-basketball-world-cup-2026-berlin/visual-sources.md` and `blog-drafts/fiba-womens-basketball-world-cup-2026-berlin.md` — recorded official-logo source/rights note.
- `../berlinwalk-content-app/add-fiba-womens-basketball-world-cup-logo.mjs` and `../berlinwalk-content-app/add-fiba-womens-basketball-world-cup-images.mjs` — logo upload/patch support.
- Wix: draft `d7731e4b-c550-451c-9a1b-0d129823616c` remains UNPUBLISHED; logo media is `5a08a3_8c57a2a88fc047849476bed64f0d5935~mv2.png`; readback confirmed 3 IMAGE nodes, 4 HTML embeds, official-logo alt/credit text.

**Opened:** Push/deploy widgets and do Wix visual QA before publishing.
**Closed:** Official logo is now placed before the quick-summary widget.

**Next session should:** Push `berlinwalk-widgets`, then review the draft visually and publish only after Yusuf approves.

## 2026-06-04 — Codex (Ultimate live instant email smoke)

**Did:** Sent a live Ultimate Trip Planner instant-email smoke test to Yusuf's requested Gmail address after the five Wix Triggered Emails were published.

**Changed:**
- `output/qa/ultimate-trip-planner-live-smoke/live-2026-06-04T21-44-33-504Z.json` — new live smoke evidence for `yusuf.ucuz@gmail.com`, arrival `2026-06-14`, trip length `3`.

**Opened:** Only the instant email was sent by the existing live endpoint. The four scheduled reminders still require their natural scheduled-job timing or a separate dev-only/manual test path; do not create one casually because it could send duplicate/spam test emails.
**Closed:** Live `POST /_functions/tripPlannerLead` returned `200`, created contact `21700383-1cb1-49e5-8343-7357fc20e13d`, created lead `563e4cd6-20eb-4f69-abff-f1eb68129c7c`, and returned `instant.sent: true`.

**Next session should:** Have Yusuf check the Gmail inbox/spam/promotions for the instant email. If the four reminder templates also need visual inbox testing, either use Wix's own per-template test-send UI or add a temporary protected dev-only test endpoint and remove it after QA.

## 2026-06-04 — Codex (Basketball blog visual package)

**Did:** Added the approved visual package for the FIBA Women's Basketball World Cup 2026 blog and patched the Wix draft.

**Changed:**
- `blog-drafts/images/fiba-womens-basketball-world-cup-2026-berlin/` — new raw/optimized image package: generated cover, Max-Schmeling-Halle, East Side Gallery, plus `visual-sources.md`.
- `blog-drafts/fiba-womens-basketball-world-cup-2026-berlin.md` — added Visual Assets handoff notes.
- `../berlinwalk-content-app/add-fiba-womens-basketball-world-cup-images.mjs` — new one-off upload/patch script.
- Wix: draft `d7731e4b-c550-451c-9a1b-0d129823616c` remains UNPUBLISHED; cover media is `5a08a3_ea8454716f174a6a8d5990f9131542a8~mv2.jpg`; inline images are Max-Schmeling-Halle and East Side Gallery; readback confirmed 2 IMAGE nodes, 4 HTML embeds, and image credits.

**Opened:** Push/deploy widgets and do Wix visual QA before publishing.
**Closed:** Blog image sourcing/optimization/upload gap.

**Next session should:** Push `berlinwalk-widgets`, then review the Wix draft visually and publish only after Yusuf approves.

## 2026-06-04 — Codex (Basketball team filter revision)

**Did:** Applied Yusuf's feedback to remove special Germany/Türkiye fixture filters and make the fixture widget team-neutral.

**Changed:**
- `basketball-worldcup-fixtures/index.html` — quick buttons are now only All games / Berlin Arena / Max-Schmeling-Halle; the team dropdown covers all 16 teams; special team row highlighting removed.
- `blog-drafts/fiba-womens-basketball-world-cup-2026-berlin.md`, `faq/data.json`, `faq/inject.js`, and `PROJECT_MEMORY.md` — copy/schema updated to describe general all-team filtering.
- Wix: patched UNPUBLISHED draft `d7731e4b-c550-451c-9a1b-0d129823616c` richContent so old Germany/Türkiye quick-filter wording is gone.

**Opened:** Still needs `berlinwalk-widgets` push, image selection, and Wix visual QA before publish.
**Closed:** Special Germany/Türkiye quick filter issue.

**Next session should:** Push/deploy widgets, then review the Wix draft embeds/images visually.

## 2026-06-04 — Codex (Women's Basketball World Cup Wix draft)

**Did:** Continued Claude's FIBA Women's Basketball World Cup 2026 work into a verified local/widget stack and Wix draft.

**Changed:**
- `blog-drafts/fiba-womens-basketball-world-cup-2026-berlin.md` — recorded Wix draft ID, updated official schedule/venue/ticket facts, and kept the visitor/fan city-guide angle.
- `basketball-worldcup-fixtures/index.html` and `basketball-worldcup-venues-map/index.html` — corrected arena allocation, added official group-stage tip-off times, and updated venue notes.
- `quick-summary/data.json`, `faq/data.json`, `faq/inject.js`, `blog-workplan.md` — wired QS/FAQ/schema and tracking for slug `fiba-womens-basketball-world-cup-2026-berlin`.
- `../berlinwalk-content-app/create-fiba-womens-basketball-world-cup-draft.mjs` — new one-off draft-creation script.
- Wix: created UNPUBLISHED blog draft `d7731e4b-c550-451c-9a1b-0d129823616c` with 106 Ricos nodes and 4 HTML embeds.

**Opened:** Push `berlinwalk-widgets` so the two new post-only widgets and QS/FAQ data resolve on GitHub Pages; add/select cover/inline images; visually QA the Wix draft before publish.
**Closed:** Claude's open QS/FAQ wiring and FIBA schedule reverify items are done; local desktop/mobile widget QA passed.

**Next session should:** Push/deploy widgets, then open Wix draft `d7731e4b-c550-451c-9a1b-0d129823616c`, add images, and publish only after visual review.

## 2026-06-04 — Codex (Ultimate email human copy pass)

**Did:** Reworked the Ultimate planner triggered emails again after Yusuf said the copy still felt robotic.

**Changed:**
- `ultimate-berlin-trip-planner/email/e0-instant-plan.md` through `e4-arrival-day.md` — rewrote the subjects/preheaders/body copy in a warmer Yusuf-style voice and added one simple emoji to each subject.
- `ultimate-berlin-trip-planner/email/build-triggered-email-html.mjs` — added a spacer row between the green email hero and body copy so `Hi,` no longer sits flush against the previous section; changed footer signoff to `See you soon,`.
- `ultimate-berlin-trip-planner/email/paste-ready/` — regenerated all paste-ready HTML, preview, copy kit, manifest, README, and setup checklist.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — updated the email-copy audit to validate the new warmer copy and emoji subject contract.

**Opened:** Yusuf should refresh `ultimate-berlin-trip-planner/email/paste-ready/copy-kit.html` and judge the actual copy tone before pasting into Wix.
**Closed:** Email HTML package rebuilt; static check passed for all five emails with no old planner jargon, no `<style>`, no `<script>`, no SVG, no `1h45m`, and the new top spacer present; `launch-audit.mjs` passed `153 pass, 0 warn, 0 block`.

**Next session should:** If Yusuf approves the new email tone, paste/update the five Wix Triggered Emails from `copy-kit.html`; otherwise make one final copy-only pass without touching widget/PDF logic.

## 2026-06-04 — Codex (Ultimate email simplification pass)

**Did:** Simplified the Ultimate planner triggered-email sequence after Yusuf approved the widget/PDF direction, keeping the emails practical and traveller-facing instead of planner-report style.

**Changed:**
- `ultimate-berlin-trip-planner/email/e0-instant-plan.md` through `e4-arrival-day.md` — rewrote all five drafts with shorter Yusuf-style copy: instant plan, 7-day, 3-day, 1-day, and arrival-day reminders. Booked guests still stay in the existing booking sequence.
- `ultimate-berlin-trip-planner/email/build-triggered-email-html.mjs` — softened generated variable-card body weight and updated the footer wording.
- `ultimate-berlin-trip-planner/email/paste-ready/` — regenerated paste-ready HTML, preview, copy kit, manifest, README, and checklist from the new copy.
- `ultimate-berlin-trip-planner/email/README.md` — documented the compact-copy direction and the smaller visible variable set.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — updated email-related checks so technical CRM/segmentation fields remain verified in payload/Velo, but no longer have to appear in user-facing email copy.

**Opened:** In-app browser refused local email preview URLs (`127.0.0.1` and `file://`) because of browser URL policy, so no visual browser screenshot was captured for the email preview this pass.
**Closed:** Rebuilt paste-ready emails; static HTML check passed for all five emails with no `<style>`, `<script>`, SVG, old planner jargon, or `1h45m`; `launch-audit.mjs` passed `153 pass, 0 warn, 0 block`; Velo prepublish gate passed `13 pass, 0 warn, 0 block` and wrote `output/qa/ultimate-trip-planner-prepublish-gate/prepublish-gate-2026-06-04T14-46-24-109Z.json`.

**Next session should:** Let Yusuf review/paste the updated email HTML from `ultimate-berlin-trip-planner/email/paste-ready/copy-kit.html`; if he approves, decide whether to update live Wix triggered emails now or do one small visual pass in a normal browser first.

## 2026-06-04 — Claude Code (Women's Basketball World Cup blog draft)

**Did:** Researched and drafted a new event-tie-in blog post for the FIBA Women's Basketball World Cup 2026 (Berlin, Sept 4-13), aimed at catching fan/tourist traffic and converting to the walking tour.

**Changed:**
- `blog-drafts/fiba-womens-basketball-world-cup-2026-berlin.md` — full draft in the standard format (meta, widget plan, quick summary, body, sources). Angle: visitor/fan city guide, not sports coverage. Core hook = both arenas (Uber Arena / Berlin Arena near East Side Gallery, Max-Schmeling-Halle near Mauerpark) sit on the old Berlin Wall line and are a short, direct ride from Alexanderplatz where the tour starts. Covers venues + transport, ticket mechanics (Eventim, session/day/team tickets), groups (Türkiye in C, USA in D, Germany hosts A), and what to do between games with internal links + booking CTA. Two custom widgets embedded via `{{widget:...}}`.
- `basketball-worldcup-fixtures/index.html` — NEW post widget. All 24 group-stage match-ups by day (Sep 4-7), filters by group/team/venue + Germany/Türkiye quick filters, tip-off countdown, and knockout calendar (QF Sep 10, SF Sep 12, final Sep 13, all at Berlin Arena). Built from the `worldcup-fixtures` pattern. Browser-verified: 24 matches, filters work (Türkiye → 3), no console errors.
- `basketball-worldcup-venues-map/index.html` — NEW post widget. Leaflet/OpenStreetMap map, 6 pins: both arenas (🏀), the two Berlin Wall sites beside them (East Side Gallery, Mauerpark), tour start/finish (★); nearest U-Bahn in each popup; filters Arenas / Berlin Wall / Walking tour. Built from the `berlin-landmarks-map` pattern. Browser-verified: 6 markers, tiles load, filters work (Arenas → 2, Wall → 2), no console errors.

**Opened:**
- Quick-summary + FAQ data entries not yet created for slug `fiba-womens-basketball-world-cup-2026-berlin` (qsKey/faqKey in `quick-summary/data.json`, `faq/data.json`, `faq/inject.js`).
- New widgets need a GitHub Pages push before the `{{widget:...}}` embeds resolve live. Optionally add both to `tools-hub/data.json` if they should also show on `/tools` + `/widgets` (currently post-only embeds).
- Reverify before publish: exact group-to-venue split and precise daily/knockout schedule against the official FIBA schedule PDF (widget uses confirmed group round-robin match-ups; per-game tip-off times are intentionally not hardcoded).
- Consider adding the Basketball World Cup to the live `berlin-in-september-2026` post (it currently lists IFA, Art Week, Open Monument Day, Marathon but not this).

**Closed:** None.

**Next session should:** Get Yusuf's review of the draft + widgets, then (if approved) build the qs/FAQ entries, push `berlinwalk-widgets` to GitHub Pages, move the post into a Wix draft, and patch the September post to cross-link.

## 2026-06-04 — Codex (Ultimate PDF screenshot fixes)

**Did:** Applied Yusuf's screenshot feedback to the polished Ultimate planner PDF and rechecked the rendered output.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added cropped PDF image helpers so Yusuf portrait/day art keep natural proportions, widened the cover guide card, centered PDF day badges, improved note-card padding, fixed the cover summary double-period edge case, and increased spacing before resource sections, including `Shopping backups` → `Berlin essentials`.
- `ultimate-berlin-trip-planner/index.html` — changed PDF/print document title from `Ultimate Berlin Trip Plan` to `Your Berlin Trip Plan` while keeping the public widget name `Ultimate Berlin Trip Planner`.
- `output/qa/ultimate-trip-planner-pdf/ultimate-trip-plan-polished-2026-06-12-spacing-fix-v3.pdf` and `output/qa/ultimate-trip-planner-pdf/rendered-spacing-fix-v3/` — latest 8-page PDF visual QA evidence.

**Opened:** Widget PDF copy/design can still be reviewed by Yusuf, but the screenshot-specific layout issues are addressed locally.
**Closed:** Inline script parse passed; `launch-audit.mjs` passed `152 pass, 0 warn, 0 block`; browser PDF export produced a complete `%%EOF` PDF and PyMuPDF rendered 8 pages. Visual QA checked page 1 cover/Yusuf note, page 2 Plan at a glance, page 3 day header, page 7 After the itinerary spacing, and page 8 Shopping backups → Berlin essentials spacing.

**Next session should:** If Yusuf approves the PDF direction, move to email template copy/layout updates; otherwise continue PDF polish from the rendered `spacing-fix-v3` evidence.

## 2026-06-03 — Codex (Ultimate polished PDF pass)

**Did:** Rebuilt the Ultimate planner PDF export into the current widget flow and fixed runtime/layout issues found during local browser QA.

**Changed:**
- `ultimate-berlin-trip-planner/index.html` — added polished PDF export with BerlinWalk logo, Yusuf note, Plan at a glance, daily weather chips, per-step map links, full-day route buttons, After the itinerary resources, and a simple `?pdf=simple` fallback.
- `ultimate-berlin-trip-planner/index.html` — isolated the old long PDF generator as `legacyDownloadPdf`, added DOM-based PDF debug hooks for QA, fixed missing hex-color helper, fixed orphan/overlap around Plan at a glance, and increased resource card spacing.
- `ultimate-berlin-trip-planner/launch-audit.mjs` — updated the active PDF-path audit for the new clean wrapper.
- `output/qa/ultimate-trip-planner-pdf/ultimate-trip-plan-polished-2026-06-12-resource-fix.pdf` and `output/qa/ultimate-trip-planner-pdf/rendered-resource-fix/` — 8-page rendered PDF QA evidence.
- `output/qa/ultimate-trip-planner-prepublish-gate/prepublish-gate-2026-06-03T23-00-24-247Z.json` — latest Velo gate evidence.

**Opened:** Email template copy/design is still the next phase; live Wix paste/publish is not done in this pass.
**Closed:** Inline script parse passed; `launch-audit.mjs` passed `152 pass, 0 warn, 0 block`; Velo prepublish gate passed `13 pass`; browser QA showed PDF reaches `saved`, extracted full PDF renders to 8 pages, logo appears, route links are readable, and resource/essentials pages no longer overlap.

**Next session should:** Review the final rendered PDF with Yusuf, then move to triggered-email copy/layout updates to match the simplified widget and polished PDF.

## 2026-06-03 — Codex (Homepage tools width fix)

**Did:** Fixed the `<bw-tools-home>` section so Wix's shifted intermediate-width wrapper no longer cuts the section off-screen.

**Changed:**
- `tools-home/tools-home-element.js` — outer `.bw-tools-home` now uses viewport width/max-width, border-box sizing, and viewport-centering side margins.
- `output/qa/homepage-tools-width-fix/live-850-tools-section-20260603.png` — live 850px screenshot evidence.
- Workspace/Wix: created `BerlinWalk Homepage Tools Width Fix` custom embed (`f4e716ff-8cad-4086-ab6c-7370e6b50dcc`, revision 1) from `../berlinwalk-homepage-tools-width-fix.html` via `../scripts/update-homepage-tools-width-fix-embed.mjs`.

**Opened:** Commit/push this source fix when the current unrelated Ultimate planner work is ready or separately staged.
**Closed:** Live homepage Playwright QA passed at 850x768, 390x844, and 1280x800; `.bw-tools-home`/grid/cards fit inside the viewport and horizontal overflow is `0`.

**Next session should:** Avoid touching the dirty Ultimate planner files unless that work is active; for this issue, just push the targeted tools-home source fix and then recheck GitHub Pages/live homepage.

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
