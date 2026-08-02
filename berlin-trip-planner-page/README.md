# Berlin Trip Planner Page

Standalone landing page shell for `https://www.berlinwalk.com/berlin-trip-planner`.

This page renders the approved V4 marketing layer natively in the Wix custom element and hands the visitor to the direct V4 planner only after a user action:

- image-led hero
- top-level V4 planner handoff (no iframe or third-party storage dependency)
- local-guide explanation
- visual coverage cards
- final CTA back to the planner

Variant B dates are carried in a URL fragment only (`#planner-dates=...`) and are validated and removed by the direct V4 client. Query strings carry only the versioned A/B variant and consent-approved UTM fields.

## Local Preview

Open:

`berlin-trip-planner-page/index.html`

or serve the repo locally and visit:

`http://127.0.0.1:8765/berlin-trip-planner-page/`

## Wix Install

Use the snippet in `SEO_SETTINGS.md`.
