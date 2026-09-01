# Berlin History Story V2 — cover and 1945 image design QA

Run date: 2026-09-01

Build/cache key: `berlin-history-story-v2-20260901h`

Status: `DRAFT UPDATE — PUBLISH APPROVAL REQUIRED`
Worktree: `/Users/yusufucuz/Documents/New project/berlinwalk-widgets/_worktrees/berlin-history-story-v1-20260901`

## Source truth and normalization

- Visual-language source: `output/mockups/berlin-history-story-visual-v2-20260901/01-hero-berlin-remade.png`, 1487x1058 px.
- Dictatorship source mockup: `output/mockups/berlin-history-story-visual-v2-20260901/02-scene-6-evidence-timeline.png`, 1487x1058 px.
- The user's current direction intentionally supersedes the source mockup's direct-to-Molkenmarkt opening: the implementation must begin with a separate title/description cover.
- Desktop implementation captures are browser-rendered at 1487x1058 CSS px and saved at 1487x1058 px, density-normalized 1:1.
- Responsive implementation captures are browser-rendered and saved 1:1 at 1280x720, 390x844, 320x568 and 844x390 CSS px.

## Comparison evidence

Full-view combined inputs:

- `output/qa/berlin-history-story-v2-round2/11-comparison-cover-1487x1058.png` — source visual language beside the implemented unnumbered cover.
- `output/qa/berlin-history-story-v2-round2/12-comparison-dictatorship-1941-1487x1058.png` — source evidence layout beside the exact implemented 1941 state.

Focused input:

- `output/qa/berlin-history-story-v2-round2/16-focused-1945-asset-vs-render.png` — original 800x544 Bundesarchiv source beside its rendered 1941 slot and 11px caption. No extra typography crop was required because the title, deck, meta line and caption are legible in the 1:1 full-state captures.

Implementation states inspected:

- `03-cover-1487x1058.png`, `14-cover-1280x720.png`
- `04-molkenmarkt-after-cover-1487x1058.png`
- `06-cover-390x844.png`, `07-cover-320x568.png`, `08-cover-844x390.png`
- `09-dictatorship-new-photo-390x844.png`
- `10-dictatorship-new-photo-1941-1487x1058.png`, `15-dictatorship-1941-1280x720.png`

## Comparison history

1. Earlier P1: the page opened directly on the Molkenmarkt chapter, so the title and story premise competed with the first scene. Fix: added one unnumbered cover outside `CHAPTERS`, moved the sole H1 there, and linked its native `Scroll to begin` anchor to the Molkenmarkt prologue. Post-fix evidence: `03`, `04`, `06`, `07`, `08`, `11` and `14`.
2. Earlier P1: the Brandenburg Gate 1945 image was visually washed out. Fix: replaced it with the stronger landscape Bundesarchiv Bild 183-J31347 photograph, preserved the physical-destruction-only evidence boundary, and linked the CC BY-SA 3.0 DE licence. Post-fix evidence: `09`, `10`, `12`, `15` and `16`.
3. No P0, P1 or P2 issue was found in the post-fix local comparison. No further visual fix was required after the final combined-input pass.

## Required fidelity surfaces

| Surface | Result | Evidence and judgment |
|---|---|---|
| Fonts and typography | **Pass** | Fraunces, Space Grotesk and IBM Plex Mono remain the source visual system. The cover establishes a clear H1/deck/meta hierarchy; small labels remain optically separate and no title clips at the tested sizes. |
| Spacing and layout rhythm | **Pass** | The cover separates premise from chapter one without adding a chapter record. Desktop uses an editorial text/map split; 390px stacks map and copy; 320x568 and 844x390 retain the cue without clipping or horizontal overflow. |
| Colors and tokens | **Pass** | Deep green, warm white and BerlinWalk yellow match the source direction. The archive map is deliberately subdued behind a dark overlay; title and deck remain readable. The yellow CTA still computes to dark-green text. |
| Image quality and fidelity | **Pass** | The cover reuses the real licensed 1652-plan derivative. The 1945 replacement keeps its native 1.47:1 composition in a 1.44 desktop crop, is capped at 530 CSS px (358px in the short 1280x720 layout), and is not stretched across the viewport. Its street-level destruction is materially clearer than the old pale frame. |
| Copy and content | **Pass** | The cover explains the 12-chapter, nearly-800-year promise without a public `Scene N` label. The dictatorship copy and caption keep deportation evidence separate from the photograph's physical-destruction meaning. |
| Responsiveness | **Pass** | Browser readback reports horizontal overflow 0 at 1487, 1280, 390, 320 and 844x390. Mobile keeps one dominant photo, readable caption and a separate card below it. |
| Accessibility and interaction | **Pass** | Exactly one H1; 12 steps and 12 rail controls; roles are 1 prologue, 10 history, 1 epilogue. The cover is outside the scrolly and chapter count. Its native anchor transfers focus to `#bw-hs-story-start`; focus-visible and reduced-motion rules are present. All four disclosures are closed by default and all non-decorative images have alt text. |
| Runtime and console | **Pass** | `node --check` and `git diff --check` pass. Browser console readback is empty. The new image decodes at 800x544 and matches SHA-256 `566459b427f84ae822cdde0e806017c88a8dd45a96eb199905ebd297d039d53f`. The conservative unique-file initial sum is 1,080,858 bytes (1.081 MB), below the 1.2 MB handoff budget. |

## Findings

- P0: none.
- P1: none after the new asset is included in the package.
- P2: none in the local build.
- P3: at an intermediate desktop 1936 scroll position, the red timeline sits visually close to the `50,000+` fact row. The exact 1941 state is balanced and clear, so this remains optional polish rather than a blocker.

## Desktop sticky banner update

- The History Story custom element adds `bw-history-story-page-active` to `body` while connected and removes it when disconnected, preventing the page-specific state from leaking during Wix SPA navigation.
- At `769px` and wider, that state hides only `#bw-desktop-cta`. The existing mobile behavior remains unchanged.

## Mobile cover spacing and scroll cue update

- On the 390x844 baseline, the H1 started at 450px. The tall-mobile adjustment moves it to 352px while keeping the archive map above it; the cue remains fully inside the 844px cover.
- The same native `Scroll to begin` anchor now carries a 1.8-second downward arrow animation on desktop and mobile. Its interactive box is at least 44px high; `prefers-reduced-motion: reduce` computes to `animation-name: none` and no transform.
- Browser QA passed at 1487x1058, 390x844, 320x568 and 844x390: cue visible, no clipping or overlap, and horizontal overflow 0. Clicking the cue set `#bw-hs-story-start`, scrolled that target to 0px from the viewport top and transferred focus to it. Console errors and warnings: 0.

## Evidence boundaries

- The approved in-app browser does not expose PerformanceResourceTiming, so the first-load figure is a conservative static unique-file sum rather than a waterfall measurement. Duplicate DOM uses of the same plan/wordmark URLs are browser-cache reuse, not additional unique payload entries.
- Native anchor click/focus behavior passed. The browser plugin did not produce a reliable synthetic Enter activation, so native anchor semantics and focus transfer were inspected instead of claiming a full assistive-technology test.
- This is local product/design QA, not live proof. Wix header offset, draft embed pin, native SEO/social metadata, live network delivery and screen-reader behavior remain separate draft/live gates. No Wix write, push, deploy or publication occurred.

final result: passed
