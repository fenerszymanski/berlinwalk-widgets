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
