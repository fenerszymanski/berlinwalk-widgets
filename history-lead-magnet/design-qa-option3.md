# History Lead Magnet Option 3 Design QA

- Source visual truth: `/Users/yusufucuz/.codex/generated_images/019f6c95-1761-7b60-825b-e72db81255b5/exec-be434db2-b17e-472d-9ed6-0209451af912.png`
- Desktop implementation screenshot: `/Users/yusufucuz/Documents/New project/output/qa/history-lead-option3/local-desktop-final.png`
- Mobile implementation screenshot: `/Users/yusufucuz/Documents/New project/output/qa/history-lead-option3/local-mobile-final.png`
- Focused source/implementation comparison: `/Users/yusufucuz/Documents/New project/output/qa/history-lead-option3/focused-reference-vs-local.png`
- Full-view source/implementation comparison: `/Users/yusufucuz/Documents/New project/output/qa/history-lead-option3/full-reference-vs-local.png`
- Viewports: 1280 x 1024, 900px boundary, and 390 x 844
- State: forced inline variant, initial form state, both consent boxes unchecked

**Findings**

- No actionable P0, P1, or P2 mismatch remains.
- Fonts and typography: the editorial title uses the existing Merriweather stack; UI copy uses Montserrat/Arial. Hierarchy, wrapping and 11.5px legal-choice copy remain readable at both checked viewports.
- Spacing and layout rhythm: the dark ribbon, split photo/form composition, single outer shadow, compact three-row sequence and mobile single-column stack match the selected direction. The production-safe desktop breakout is intentionally narrower than the mock at some viewports because it follows the audited Wix article/sidebar bounds.
- Colors and visual tokens: dark green, cream and yellow use BerlinWalk tokens. The yellow CTA computes to dark text in the browser.
- Image quality and asset fidelity: both licensed Monbijou images load at native raster sizes; the current image focal point keeps the TV Tower visible. The seam badge uses the existing real BerlinWalk PNG asset rather than code-drawn art.
- Copy and content: ribbon, title, intro, caption, delivery states, required series consent, optional newsletter consent and footer wording match the approved compact direction.

**Interaction and responsive evidence**

- Desktop lead card overlays the vertically overlapping fixed `.bw-blog-sidebar`; `elementFromPoint` returns the lead inside the overlap and the sidebar outside the lead card.
- The scoped body stacking-context repair computes the Wix post body to `z-index:auto`; the lead host computes to `9050` and sidebar to `9000`.
- Mobile and desktop horizontal overflow: `0px`.
- Both checkboxes begin unchecked. Required-only submit sends `history-series-v3-compact-2026-07-17`, `newsletterConsent:false`, and an empty newsletter version. Opted-in submit sends `history-newsletter-v1-2026-07-17`.
- Broken element loading restores exactly one booking control, no lead element, and removes the inline layering body class.
- Browser console/page errors: none.

**Comparison history**

1. Initial desktop harness exposed horizontal overflow because the fake article was centered unlike the live Wix article. The harness was aligned to the audited live article bounds; the production CSS stayed on the audited 1088px/right-breakout rules. Post-fix overflow is zero.
2. Initial fixed sidebar fixture was too short to prove vertical overlap. It was extended to the live-like height; post-fix hit-testing proves the lead is above only in the overlap and the sidebar remains usable elsewhere.
3. The current Monbijou crop initially hid the TV Tower. Its focal point was moved to 22% horizontally; post-fix desktop and mobile screenshots show the tower.
4. Consent copy initially computed to 10.5px. It was raised to 11.5px; post-fix browser readback confirms 11.5px without increasing desktop card height.

Focused region evidence was required because the checkboxes, photo seam, badge and layering relationship are too small to judge from the full page alone. The final desktop and mobile captures were inspected directly in addition to the combined comparison.

final result: passed
