# Berlin Date Check — Berlin Unlocked design QA

## Comparison target

- Source visual truth: `/var/folders/qy/p38mnw8s6zdcgddbj_0b8z2m0000gn/T/codex-clipboard-849fd92f-54b5-446b-bd26-482ba6839516.png`
- Source dimensions: `1490 × 1560` px.
- Intended transformation: merge the source's separate bonus-preview and email-form cards into one offer; replace the two public product names with one prominent `Berlin Unlocked` name; reduce the explanatory copy while preserving the four benefits, supplied photo, form, and consent.
- Implementation URL/state: `http://127.0.0.1:4517/berlin-dates-check/index.html?arrival=2026-09-25&nights=4&qa=1` with the hydrated four-night result visible.
- Desktop implementation evidence: `berlin-dates-check/qa/berlin-unlocked-desktop-1280x900.png` (`1280 × 900` px, CSS viewport `1280 × 900`, density `1`).
- Mobile implementation evidence: `berlin-dates-check/qa/berlin-unlocked-mobile-390x844.png` (`390 × 844` px, CSS viewport `390 × 844`, density `1`).
- Combined source/final comparison: `berlin-dates-check/qa/berlin-unlocked-source-vs-final.png` (`1500 × 850` px).

## Full-view comparison evidence

The combined comparison places the supplied source and the rendered desktop offer in one image. The source uses two bordered cards, two headings, two product names, and several overlapping explanatory paragraphs. The final uses one bordered card, one product name, one compact promise, one date line, the four existing benefit tiles, the supplied tram photo, and the form in the same visual unit.

This is an intentional information-architecture change rather than a pixel-for-pixel reproduction. The existing cream/green/yellow palette, line-icon treatment, tram image, border weight, radii, and form styling remain visually consistent with the source.

## Focused region evidence

- Desktop focused region: the whole merged offer is readable in `berlin-unlocked-desktop-1280x900.png`; no extra crop was needed because the complete card, form, CTA, and consent fit in one viewport.
- Mobile focused region: `berlin-unlocked-mobile-390x844.png` shows the complete one-column offer, full-width image, full-width email input and CTA, plus the consent line.
- Delivered utility page: `pocket-kit.html` renders public H1/title/navigation as `Berlin Unlocked`; its filter changed the visible count from `50` to `6`, and search narrowed that to `1` without console errors.

## Required fidelity surfaces

### Fonts and typography

- `BERLIN UNLOCKED` is the dominant label, using the existing Space Grotesk family at `50px/700` desktop and `30px/700` mobile with controlled tracking.
- The promise, date line, tile labels, form, and consent retain the existing type system and readable hierarchy.
- Desktop heading wraps to two lines; mobile fits on one line at 390 px. At the narrow fallback viewport it wraps without overflow.

### Spacing and layout rhythm

- Exactly one `.gate-zone`, one preview, one gate and one `#gateHeading` render.
- Desktop card: `996px` wide, `387px` high, `22px` internal gap, `14px` radius, and `1.5px` border.
- Mobile card: `358px` wide at a 390px viewport. Email input and CTA are both `319px` wide; consent has the required `12px` top separation.
- Document horizontal overflow is `0` at 1280px, 390px, and the narrow fallback check. No fixed or sticky element exists inside the widget.

### Colors and visual tokens

- The merged card keeps the established cream/white surfaces and brand green border.
- CTA computed background is `rgb(255, 230, 0)` and foreground is `rgb(18, 61, 24)` on desktop and mobile, satisfying the yellow contrast rule.
- No new unapproved color or decorative effect was introduced.

### Image quality and asset fidelity

- The supplied Berlin tram/table image remains the only offer image.
- Desktop crop preserves the tram, phone, maps, food and coffee. Mobile uses the existing responsive crop without stretching or horizontal overflow.
- Existing Material Symbols remain the four benefit icons; no placeholder, emoji, CSS drawing, or handcrafted SVG replaced an asset.

### Copy and content

- Dominant product name: `BERLIN UNLOCKED`.
- Promise: `Your dates. My local shortcuts. One phone-ready guide.`
- Dynamic line: `Built for 25–29 September 2026.`
- CTA: `Send me Berlin Unlocked`.
- Consent and success copy use the same name.
- Rendered Date Check, delivered utility, DOI copy and access-email copy contain no reader-facing `Dates Pack`, `Pocket Kit`, or `Berlin pack` terminology.

## Interaction and browser checks

- Date result hydration: passed.
- Email field and required consent remain present and labelled.
- Hydrated sent state: form hidden; `Berlin Unlocked is on its way. Check Inbox, Spam and Promotions.` visible in an `aria-live="polite"` status.
- Delivered utility filter/search: passed (`50 → 6 → 1`).
- Browser console errors: `0` on Date Check and delivered utility.
- Widget tests: `11/11` passed.
- Targeted content-app tests: `72/72` passed.

## Comparison history

1. Initial merged build finding: `[P2]` At 390px, the email input used the available width but the CTA wrapped to a narrower `207px` left-aligned button. This weakened the conversion hierarchy.
2. Fix: commit `1fb8dfa8185fe2e2af7d26c88946485b8edc2e18` makes the CTA `flex: 1 1 100%`, `width: 100%`, `min-width: 0` below 520px.
3. Post-fix evidence: the CTA is `319px` wide at 390px, matches the email input, has the correct dark-on-yellow colors, and produces `0` horizontal overflow. The saved mobile screenshot is post-fix.

## Findings

No actionable P0, P1 or P2 findings remain.

## Follow-up polish

No P3 change is required for this scope.

## Final result

final result: passed
