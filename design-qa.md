# Berlin Trip Planner Landing A/B Design QA

**Comparison Target**

- Control: the existing premium `/berlin-trip-planner` landing and its single embedded planner.
- Value-first B: one compact product-value card immediately before that same planner, without changing the form or checkout.
- Live B desktop card: `/Users/yusufucuz/Documents/New project/berlinwalk-widgets/.playwright-cli/element-2026-07-15T18-44-38-251Z.png`
- Live B mobile card: `/Users/yusufucuz/Documents/New project/berlinwalk-widgets/.playwright-cli/element-2026-07-15T18-45-49-741Z.png`
- Local full-page captures: `output/playwright/trip-planner-ab-20260715/value-first-desktop.png`, `value-first-mobile.png`, and `control-desktop.png`.

**Findings**

- No actionable P0, P1, or P2 difference remains.
- Value hierarchy: the B card names a real sample route (`Alexanderplatz -> Museum Island -> Hackescher Markt`) before listing the paid plan's concrete additions. The EUR7.99 price and free-preview reassurance are visible beside the CTA on desktop and directly above it on mobile.
- Experiment isolation: forced live B rendered exactly one `.bw-trip-value-first` and one iframe; forced control rendered zero value cards and one iframe. Both arms resolve to the same embedded planner and checkout.
- Behavior: `Build my free preview` scrolls the planner frame to about 21px below the viewport top and focuses the active `Arrival date` field inside the iframe. It does not reset or duplicate the form.
- Responsiveness: at 390 x 844 the B card measured 370px from x=10 to x=380 with document horizontal overflow `0`. The route panel, benefit chips, price and full-width CTA stack cleanly with no clipped text.
- Contrast: the live B CTA computed to dark green `rgb(18,61,24)` on yellow `rgb(255,230,0)`.
- Assignment: a normal live session kept the same `value_first` variant and assignment ID across reload; test event requests were mocked. Forced control/B sessions carried `forced_qa` and were excluded from the production report.
- Accessibility and SEO: the value card uses a labelled region, semantic heading/list, descriptive route label and ordinary anchor CTA. Final rendered DOM had exactly one H1 in both arms.
- Runtime: live Chromium reported zero console errors. Two pre-existing load-before-navigation `bw-measure-request` target-origin warnings appeared during the iframe height handshake; the loaded iframe, resize channel, CTA focus and form all worked normally.

**Implementation Checklist**

- [x] Stable 50/50 control/value-first assignment.
- [x] Same single planner and checkout in both arms.
- [x] Concrete route and paid value before the B form.
- [x] Desktop and 390px mobile visual review.
- [x] No horizontal overflow.
- [x] Yellow CTA contrast verified from computed styles.
- [x] B CTA scroll and input focus verified.
- [x] Control/B QA separation and reload persistence verified.
- [x] Live GitHub Pages source and production Wix page verified.

final result: passed

---

# BerlinWalk Homepage Editorial System Design QA

**Comparison Target**

- Source visual truth: `/Users/yusufucuz/Documents/New project/output/qa/home-products-redesign-20260715/live/homepage-headless-chromium-products-desktop-1366x900.jpg`
- Combined source and implementation board: `/Users/yusufucuz/Documents/New project/output/qa/homepage-editorial-20260716/preview/source-products-vs-atlas-preview.jpg`
- Final local desktop hero: `/Users/yusufucuz/Documents/New project/output/qa/homepage-editorial-20260716/preview/desktop-final-hero.png`
- Final local 390 px route: `/Users/yusufucuz/Documents/New project/output/qa/homepage-editorial-20260716/preview/mobile-final-route-390.png`
- Live Atlas desktop hero: `/Users/yusufucuz/Documents/New project/output/qa/homepage-editorial-20260716/live/atlas-desktop-01-hero.png`
- Live Atlas top-level narrow hero and mobile menu: `/Users/yusufucuz/Documents/New project/output/qa/homepage-editorial-20260716/live/atlas-top-level-narrow-01-hero.png` and `/Users/yusufucuz/Documents/New project/output/qa/homepage-editorial-20260716/live/atlas-top-level-narrow-02-menu.png`
- Live Atlas top-level narrow route, booking, and footer: `/Users/yusufucuz/Documents/New project/output/qa/homepage-editorial-20260716/live/atlas-top-level-narrow-03-route.png`, `/Users/yusufucuz/Documents/New project/output/qa/homepage-editorial-20260716/live/atlas-top-level-narrow-04-booking.png`, and `/Users/yusufucuz/Documents/New project/output/qa/homepage-editorial-20260716/live/atlas-top-level-narrow-05-footer.png`

**Findings**

- No actionable P0, P1, or P2 visual defect remains in the authorized Atlas scope.
- The Products section remains the visual source and is not overridden. Its live Wix embed stayed at revision 22 with unchanged SHA256 `cade6a5f3ec21a6bdd78e33054a843c81e4ba6733366ada3a5a825ef087732a3`.
- Booking behavior remains on the existing revision 6 layer with unchanged SHA256 `927f5fd37a414d922386b32dddb94431eeee478e500657747b837656640eafdb`.
- Fraunces is loaded from the same commit-pinned repository asset. Montserrat remains the body and control family; Merriweather remains limited to genuine quote or caption content.
- Hero, Why, Route, Guide, Reviews, Booking, FAQ, and Explore now share the approved editorial type, spacing, surface, rule, radius, and CTA language without changing public copy, section order, canonical URLs, component APIs, or data schemas.
- Atlas measurements passed at 1366, 1040, 980, 768, 721, 720, 640, 520, 430, 390, 375, 360, and 320 CSS pixels. Every width reported zero horizontal overflow, one H1, one mount per section, correct section order, loaded Fraunces, dark text on yellow controls, zero broken images, zero missing alt attributes, and zero preview runtime errors.
- Live desktop Atlas QA passed for the header dropdown, Route, Guide, Reviews, Booking, Products, FAQ, Explore, and footer. The review carousel changed cards after a dot click. FAQ changed open item after a click.
- The two Route destinations and all four Explore destinations were read back from the active source and returned HTTP 200: Route story, booking page, BerlinTools, Trip Planner, Games, and Berlin Wall Timeline.
- Live Booking QA selected a new date and the 15:30 slot, kept the selected state green, and handed off to the real Booking Form with `bookings_timezone`, `bookings_serviceId`, `bookings_locationId`, a non-empty `bookings_sessionId`, and the existing direct-booking UTM parameters. No booking was submitted.
- Live top-level narrow Atlas QA passed for the mobile header, hamburger menu, hero, route metadata rail, 16:9 map and real photo strip, copy-before-calendar booking order, selected-slot treatment, footer, and single Privacy Settings link.
- The final footer is present once and Privacy Settings is inside its closing metadata row. No trailing blank section, missing footer, or runaway-height state was visible at the live page end.
- The Editorial HEAD embed is enabled at revision 1 and points to commit `def46d340c5bcdebd995a1900a7bb2768c047223`. The stylesheet returned `200 text/css`; its Fraunces asset returned `200 font/ttf`. The updated reserve is enabled at revision 6 with SHA256 `29a914176bb17c8ac58ccdde36ada87f9451f49599e36f1a4ab20400a40636db`.

**Resolved During QA**

1. Hero line break could orphan `Tour.` at desktop. The highlighted title segment now stays together.
2. Mobile Route metadata stacked vertically. It now remains a compact three-item horizontal rail.
3. Mobile Route briefly used a 4:3 crop that could displace percentage-based pins. The original 16:9 map geometry is preserved.
4. Booking host styling could have affected the pre-mount fallback. The dark host treatment now applies only when the active custom booking root is mounted.
5. The original mobile hydration reserves were too short for the new editorial composition. The reserve formulas were updated and staged with the Editorial embed before one site publish.

**Implementation Checklist**

- [x] Exact host-scoped CSS with no global `body` or `main` rules.
- [x] No DOM writes, observers, section reordering, or early script loader.
- [x] Products and Booking lifecycle code untouched.
- [x] Commit-pinned CSS and font verified before Wix staging.
- [x] Baseline Wix HTML, revision, and SHA256 backup captured before writes.
- [x] Editorial and hydration reserve staged without publish, then read back.
- [x] Fail-closed asset, marker, position, enabled-state, and reserve-hash preflight.
- [x] Exactly one Wix publish.
- [x] Live Atlas desktop and top-level narrow acceptance.
- [x] Rollback dry-run targets only Editorial disable and baseline Reserve restore while fingerprint-protecting Products and Booking.

**Authorized Test Scope**

- Automated Chromium and WebKit regression was not run because the approved plan requires separate permission first. CLS, LCP, cross-engine console, and automated pointer-interception thresholds are therefore not claimed here.
- The release result below covers the authorized Atlas visual and functional acceptance, the 13-width Atlas same-origin measurement harness, live HTML/API readback, and CDN asset checks.

final result: passed

---

# BerlinWalk Global Navigation Design QA

**Comparison Target**

- Source visual truth: `/var/folders/qy/p38mnw8s6zdcgddbj_0b8z2m0000gn/T/codex-clipboard-3acf1240-eaa9-4751-bad3-8f4f7275546a.png`
- Source intent: information architecture and menu grouping. The existing BerlinWalk wordmark, typography, trust bar, colors, and CTA treatment are intentionally retained.
- Rendered implementation, closed desktop: `/Users/yusufucuz/Documents/New project/output/qa/global-nav-redesign-20260714/local-header/webkit-desktop/.playwright-cli/page-2026-07-14T22-18-25-572Z.png`
- Rendered implementation, Tour dropdown: `/Users/yusufucuz/Documents/New project/output/qa/global-nav-redesign-20260714/local-header/webkit-desktop/.playwright-cli/page-2026-07-14T22-18-39-536Z.png`
- Rendered implementation, Products dropdown: `/Users/yusufucuz/Documents/New project/output/qa/global-nav-redesign-20260714/local-header/webkit-desktop/.playwright-cli/page-2026-07-14T22-18-48-200Z.png`
- Rendered implementation, mobile menu: `/Users/yusufucuz/Documents/New project/output/qa/global-nav-redesign-20260714/local-header/webkit-mobile/.playwright-cli/page-2026-07-14T22-19-15-083Z.png`
- Desktop viewport/state: 1456 × 458, closed plus Tour-open and Products-open states, WebKit.
- Mobile viewport/state: iPhone 13 emulation, 390 × 664 visible viewport, menu open with both groups initially closed, WebKit.

**Comparison Evidence**

- Full-view comparison: `/Users/yusufucuz/Documents/New project/output/qa/global-nav-redesign-20260714/design-comparison.png`
- Focused navigation and dropdown comparison: `/Users/yusufucuz/Documents/New project/output/qa/global-nav-redesign-20260714/design-comparison-focused.png`
- The focused comparison is required because submenu labels, ordering, caret states, and CTA contrast are too small to judge reliably from the full-view board alone.

**Findings**

- No actionable P0, P1, or P2 differences remain.
- Information architecture: exact target order and grouping are present. Tour contains Tour Route, Meeting Point, Reviews, and The Guide. Products contains Berlin Trip Planner, Audio Tours, First-Day Rescue Plan, and Photo Missions. Games, Blog, and Berlin Hacks are direct links. Individual games and audio routes are absent from the header.
- Fonts and typography: the implementation intentionally preserves BerlinWalk's existing Montserrat navigation and official wordmark instead of copying the schematic reference's black serif wordmark. Labels remain legible, consistently weighted, and untruncated across the tested desktop and mobile widths.
- Spacing and layout rhythm: the desktop order, group separation, dropdown alignment, CTA separation, radii, and elevation match the structural hierarchy in the source. The existing trust strip adds brand context without changing the requested navigation hierarchy. The header switches cleanly to the mobile pattern at 980 px with no horizontal overflow.
- Colors and visual tokens: existing BerlinWalk green, cream, and yellow tokens are retained. The yellow CTA has dark text in normal and focus states, satisfying the project contrast rule.
- Image quality and asset fidelity: the supplied BerlinWalk wordmark asset is sharp and correctly scaled. The reference contains no other photographic or illustrative assets, and no placeholder or code-drawn replacement was introduced.
- Copy and content: all public labels match the approved menu brief. Canonical `www.berlinwalk.com` URLs are used, including the Photo Missions canonical URL.
- Behavior and accessibility: desktop menus work with pointer, hover, Enter, Space, Escape, outside click, and submenu selection. Closed dropdowns are removed from the accessibility tree with `visibility: hidden`; `aria-expanded` reflects state. Mobile groups are native disclosure controls, only one opens at a time, closing the overlay resets both groups, Escape restores focus to the hamburger, and body scroll lock is removed.
- Responsiveness: Chromium passed 1440, 1280, 1024, 981, 980, 390, 375, and 360 px checks. WebKit passed desktop and iPhone 13 checks. No tested state produced horizontal overflow.
- Wix dual-mount safety: a two-header responsive harness passed 30 active-menu transitions between 981 and 980 px in both Chromium and WebKit with `failures: []`. Exactly one overlay and two submenu portals remained under `body`, IDs stayed unique, inactive-mount removal preserved the active scroll lock, and active-mount removal released it.

**Comparison History**

1. Earlier P2 — a pointer click could close a dropdown that had just opened on hover. Fix: the first click after hover keeps the selected menu open, while a subsequent click and Enter/Space retain toggle behavior. Post-fix evidence: the final Tour and Products screenshots above plus an `aria-expanded` readback of `true` after the first click and `false` after the second.
2. Earlier P2 — showing all mobile child links at once made the menu too dense for the visible phone viewport. Fix: Tour and Products became default-closed native disclosure groups with mutually exclusive opening and compact link spacing. Post-fix evidence: the final mobile screenshot above.
3. Earlier P2 — Escape closed the mobile menu without returning keyboard focus. Fix: Escape, close-button, and backdrop dismissal now restore focus to the hamburger. Post-fix evidence: WebKit state readback reported `activeLabel: "Open menu"`, body overflow reset, and both disclosure groups closed.
4. Earlier P2 — closed desktop submenus remained discoverable in the accessibility tree, and the initially unpositioned hidden sibling could produce a compositor artifact in dropdown captures. Fix: closed menus now use `visibility: hidden`, and both menus receive a safe initial position before interaction. Post-fix evidence: the focused comparison shows clean Tour and Products states, and the closed WebKit accessibility snapshot contains no submenu items.
5. Earlier P1 — an open desktop dropdown survived a 981→980 px transition, and an open mobile overlay survived 980→981 px with body scroll still locked. Fix: viewport-mode changes now close both portal types before the responsive mount changes. Post-fix evidence: Chromium and WebKit each passed 30 alternating open-menu transitions with no stale open layer or scroll lock.
6. Earlier P1 — Wix's two simultaneously connected responsive header instances could each create portals and could clear another instance's body scroll lock during cleanup. Fix: a visibility-scored active-instance coordinator now permits only one runtime owner, every portal ID is instance-unique, and body scroll lock is released only by its owner. Post-fix evidence: the dual-mount harness held exactly one body overlay and two body submenus, reported no duplicate IDs, preserved lock after inactive-instance removal, and fully cleaned portals after active-instance removal.
7. Earlier P2 — `role="menu"` / `role="menuitem"` implied an application-menu keyboard model that the navigation did not implement. Fix: desktop dropdowns now use native navigation list/link semantics with `aria-expanded` and instance-unique `aria-controls` relationships. Post-fix evidence: the final accessibility snapshots expose ordinary lists and links only when the relevant disclosure is visible.

**Open Questions**

- None. The visual reference was treated as the requested menu structure, while the established BerlinWalk brand system was preserved.

**Implementation Checklist**

- [x] Exact desktop order and dropdown contents.
- [x] Exact canonical link targets.
- [x] Direct Games, Blog, and Berlin Hacks links.
- [x] Individual game and audio-route links removed from the header.
- [x] Keyboard and pointer interaction states.
- [x] Mobile disclosure behavior and focus restoration.
- [x] Breakpoint and overflow checks in Chromium and WebKit.
- [x] Dynamic 981↔980 transition and dual Wix mount lifecycle checks in Chromium and WebKit.
- [x] Yellow CTA contrast check.
- [x] Browser console checked; final local WebKit navigation run had zero errors and zero warnings.

**Follow-up Polish**

- None required for this structural change.

final result: passed

---

# BerlinWalk Homepage Products Design QA

**Comparison Target**

- Source visual truth: `/Users/yusufucuz/.codex/generated_images/019f5d2f-fb10-7690-988e-10e8be912812/exec-b213bf4d-cb79-43af-b348-393ec2755777.png`
- Rendered implementation, desktop: `/tmp/berlinwalk-home-products-local-desktop-final.png`
- Rendered implementation, mobile top: `/tmp/berlinwalk-home-products-mobile-top.png`
- Rendered implementation, mobile middle: `/tmp/berlinwalk-home-products-mobile-mid.png`
- Rendered implementation, mobile bottom: `/tmp/berlinwalk-home-products-mobile-bottom.png`
- Live homepage, desktop Products section: `/Users/yusufucuz/Documents/New project/output/qa/home-products-redesign-20260715/live/homepage-headless-chromium-products-desktop-1366x900.jpg`
- Live homepage, mobile Products section: `/Users/yusufucuz/Documents/New project/output/qa/home-products-redesign-20260715/live/homepage-headless-chromium-products-mobile-390x900.jpg`
- Desktop viewport/state: 1280 × 720 viewport, full component capture, default state.
- Mobile viewport/state: 390 × 844 viewport, top/middle/bottom scroll states after all lazy images loaded.

**Comparison Evidence**

- Combined full-view comparison: `/Users/yusufucuz/Documents/New project/output/qa/home-products-redesign-20260715/source-vs-local-native.png`
- Final live render report: `/Users/yusufucuz/Documents/New project/output/qa/home-products-redesign-20260715/live/homepage-render-headless-qa.json`
- The full-view comparison is high resolution and keeps both the selected direction and the complete implementation legible, so no separate focused crop was required.

**Findings**

- No actionable P0, P1, or P2 differences remain.
- Live source truth: the homepage renders the design through the existing Wix custom layer, not directly from the standalone `<bw-home-products>` file. The production layer is `BerlinWalk Homepage Products Explore Custom Layer`, revision `22`, build `homepage-products-explore-custom-20260715-products-redesign`; its external CSS and images are pinned to Git commit `18fe03fc8200f13767c05412f08ffc732bebb978`.
- Visual hierarchy: the selected split composition is preserved. Trip Planner remains the dominant product on the left; Audio Tours, First-Day Rescue Plan, and Photo Missions form the scannable secondary stack on the right.
- Fonts and typography: local Fraunces and Space Grotesk files reproduce the selected editorial display/body pairing without a third-party font request. Heading wraps and card title scale remain stable at desktop and 390 px mobile widths.
- Spacing and layout rhythm: the implementation keeps the source's cream canvas, generous heading space, one large feature card, three ruled secondary rows, and compact yellow CTAs. The layout becomes one column below 1040 px and converts the secondary rows to compact image-and-copy cards below 720 px.
- Colors and visual tokens: BerlinWalk cream, dark green, green labels, and yellow CTA tokens are retained. Every yellow CTA computes to dark green text in its default state; hover and focus rules explicitly keep the same dark foreground.
- Image quality and asset fidelity: all four cards use real BerlinWalk assets already present in the project. Images loaded at their natural dimensions, used `object-fit: cover`, had descriptive alt text, and produced no broken or placeholder state.
- Copy and content: the section now reflects the current product family rather than the older narrow card set. All public copy is English, concise, concrete, and points to canonical `www.berlinwalk.com` URLs.
- Behavior and accessibility: each entire card is one descriptive link with one focus target. The Trip Planner card was clicked in the exact embed preview and navigated to the live Trip Planner page. Live DOM readback found the four expected canonical anchors, and all four destinations returned HTTP 200.
- Responsiveness: the exact embed preview, the full live homepage, and a separate Chrome live readback all passed at desktop and 390 px mobile widths. Both live Chromium viewports reported zero horizontal overflow, correct page-section order, one visible navigation pattern, all four natural-size images loaded, no visible image missing alt text, and zero page errors. Products begins exactly where the booking section ends and FAQ begins exactly where Products ends, so no hidden blank section remains.

**Comparison History**

1. Earlier P2 — the first Photo Missions thumbnail used a dense product-cover graphic that became noisy at the compact card size. Fix: it was replaced with the real Anhalter Bahnhof route image and a precise alt description. Post-fix evidence: the final desktop and mobile captures above.
2. Earlier P2 — the first mobile full-page capture showed blank lower thumbnails because those images were intentionally lazy-loaded and had not entered the viewport. Fix: the page was scrolled through all card states, every image was confirmed complete at its natural dimensions, and separate top/middle/bottom captures were inspected. No loading bug remained.
3. Implementation adaptation — the source concept uses generated campaign imagery and arrow glyphs. The production version uses existing BerlinWalk product/route imagery and makes the entire card clickable, avoiding decorative controls and unverified imagery while preserving the approved hierarchy.
4. Source-truth correction — the first implementation updated the reusable `<bw-home-products>` component, but the real homepage was still mounted by the Wix Products/Explore custom layer. Fix: the existing native Wix slot and mount lifecycle were preserved, the approved design was moved into that active layer, a commit-pinned external stylesheet kept the embed below Wix's size limit, and the exact generated embed was tested before the live revision was saved and published.

**Implementation Checklist**

- [x] Selected option 1 hierarchy implemented.
- [x] Current product family and canonical URLs.
- [x] Local brand fonts and project color tokens.
- [x] Desktop and 390 px mobile visual QA.
- [x] No horizontal overflow.
- [x] Four images loaded with descriptive alt text.
- [x] Yellow CTA foreground contrast verified.
- [x] Primary product interaction verified.
- [x] All four destinations returned HTTP 200.
- [x] Browser console checked with zero errors.
- [x] Wix custom embed read back independently at revision 22 with the expected build, pinned stylesheet, homepage-only guard, no iframe, and SHA256 `cade6a5f3ec21a6bdd78e33054a843c81e4ba6733366ada3a5a825ef087732a3`.
- [x] Full live homepage regression passed at 1366 × 900 and 390 × 900: order, links, images, alt text, clickability, and overflow.

**Open Questions**

- None.

**Follow-up Polish**

- None required after publication.

final result: passed
