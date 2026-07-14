# BerlinWalk Google Search Landing Design QA

## Evidence

- Source visual truth: `/Users/yusufucuz/.codex/generated_images/019f5f40-79aa-77a1-a605-0fef42511be6/exec-ad117358-110c-43a0-b5d1-8a964ad9c743.png`
- Browser-rendered implementation: `/tmp/berlinwalk-google-search-landing-20260714/output/playwright/google-search-landing-20260714/local-mobile-free-tour-426x950-final.png`
- Full-view side-by-side comparison: `/tmp/berlinwalk-google-search-landing-20260714/output/playwright/google-search-landing-20260714/mobile-comparison-final.png`
- Mobile production state: `/tmp/berlinwalk-google-search-landing-20260714/output/playwright/google-search-landing-20260714/local-mobile-free-tour-390x844-final.png`
- Dynamic English headline state: `/tmp/berlinwalk-google-search-landing-20260714/output/playwright/google-search-landing-20260714/local-mobile-english-tour-390x844.png`
- Desktop first fold: `/tmp/berlinwalk-google-search-landing-20260714/output/playwright/google-search-landing-20260714/local-desktop-free-tour-1440x1000.png`
- Desktop route and guide: `/tmp/berlinwalk-google-search-landing-20260714/output/playwright/google-search-landing-20260714/local-desktop-route-1440x1000.png`
- Desktop FAQ and final CTA: `/tmp/berlinwalk-google-search-landing-20260714/output/playwright/google-search-landing-20260714/local-desktop-faq-1440x1000.png`
- Tablet landscape: `/tmp/berlinwalk-google-search-landing-20260714/output/playwright/google-search-landing-20260714/local-tablet-landscape-1024x768.png`

## Comparison target

- Viewport: 426 x 950 CSS px, matching the 852 x 1900 selected source at 2x density.
- State: free-tour headline, 14 July at 11:30, first date selected, mobile first fold.
- The source date became unavailable while QA was running. The comparison capture uses that date only as a browser-local visual fixture. All functional availability tests used the current live endpoint and its real slots.
- Focused region comparison was not needed because the native-scale side-by-side keeps the header, typography, image crop, booking controls, CTA, fact band, and route heading readable in one comparison input.

## Findings

- No actionable P0, P1, or P2 differences remain.
- [P3] The source mock has slightly softer raster antialiasing and a stylized generated BW coin. The implementation uses the real BerlinWalk coin asset and browser-rendered Montserrat. The hierarchy, dimensions, crop, palette, and interaction affordances remain faithful.

## Required fidelity surfaces

- Fonts and typography: Montserrat is loaded for the functional landing page. The two-line mobile H1, eyebrow, lead, proof labels, live date, time, and CTA match the selected hierarchy and wrapping.
- Spacing and layout rhythm: header, intro, World Clock image, overlapping calendar card, fact band, and route heading align closely in the 426 x 950 comparison. The 390 x 844 view keeps the reservation CTA fully visible, with its bottom at 776 px.
- Colors and tokens: cream `#FAFAF5`, dark green `#083511`, brand green `#1B5E20`, and yellow `#FFE600` match the target. The yellow CTA computed to `rgb(255, 230, 0)` with dark-green text `rgb(8, 53, 17)`.
- Image quality and asset fidelity: the production page uses the real 1600 px World Clock image and real 1200 px Yusuf image. Both loaded with positive natural dimensions. The World Clock crop was tuned against the source.
- Copy and content: the selected headline, trust proof, payment reassurance, duration, language, meeting point, route, guide, FAQ, and final CTA are present. The duration is `~2h`; no Berlin Wall route claim is made.
- Icons: Material Symbols Rounded is used consistently. Fact-band icons use the outline variation seen in the source.
- Accessibility and responsiveness: semantic links, buttons, details, `aria-pressed`, `aria-selected`, alt text, focus-visible styles, and reduced-motion handling are present. Horizontal page overflow is zero at 390, 1024, and 1440 px.

## Primary interactions tested

- Live availability loaded from the production endpoint.
- Selecting a new date updated the active date, slot, and booking session ID.
- Selecting the 15:30 slot updated `aria-pressed`, the booking URL, and the selected session ID.
- The booking CTA preserved `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `utm_id`, `gclid`, `gbraid`, `wbraid`, `fbclid`, `fbc`, and `fbp`.
- `bw_booking_page_view`, `bw_booking_pick_date_click`, `bw_booking_slot_select`, and `bw_booking_next_click` were emitted in order.
- Production first-party requests are analytics-consent gated and include the endpoint's explicit consent fields; the local preview keeps event-order QA available without writing production rows.
- Tour details scrolled the route section to the top of the viewport.
- FAQ disclosures opened correctly.
- Free-tour and English-tour dynamic headlines rendered correctly.
- Final clean local sessions reported zero console errors and zero warnings.

## Comparison history

1. Initial mobile pass found a P2 density mismatch: the H1 wrapped to three lines and the CTA was cut below the 390 x 844 first fold. Mobile typography, spacing, image crop, calendar density, and fact-band layout were tightened. Post-fix evidence: `local-mobile-free-tour-390x844-final.png`.
2. The first matched-state comparison found a P2 proportional drift in the World Clock crop, booking-card height, date-chip widths, CTA height, and route-heading position. The image zoom, mobile spacing, chip width, card padding, CTA dimensions, and route offset were corrected. Post-fix evidence: `mobile-comparison-final.png`.
3. Desktop QA found a P1 conversion issue: the booking CTA was below the first 1000 px viewport. The desktop hero was changed to a responsive two-column layout with the live calendar over the World Clock image. Post-fix evidence: `local-desktop-free-tour-1440x1000.png`; CTA bottom was 721 px.
4. The 1024 px pass found a P2 proof-row wrap with a stranded divider. The proof signals now stack cleanly between 1000 and 1150 px. Post-fix evidence: `local-tablet-landscape-1024x768.png`.

## Open questions

- None.

## Implementation checklist

- Mobile design comparison passed.
- Responsive desktop and tablet layouts passed.
- Live slot and tracking interactions passed.
- Attribution continuity passed.
- Yellow contrast rule passed.
- Console and overflow checks passed.

final result: passed
