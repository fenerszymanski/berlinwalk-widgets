# Berlin Trip Planner Page

Standalone landing page shell for `https://www.berlinwalk.com/berlin-trip-planner`.

This page wraps the existing Ultimate Berlin Trip Planner widget in a branded BerlinWalk page experience:

- image-led hero
- immediate planner iframe section
- local-guide explanation
- visual coverage cards
- final CTA back to the planner

The component forwards parent-page query params into the widget iframe. This means future email links can use:

`https://www.berlinwalk.com/berlin-trip-planner?date=2026-07-17&tripLength=3&planAccess=1`

and the iframe will receive the same saved plan state and open unlocked.

## Local Preview

Open:

`berlin-trip-planner-page/index.html`

or serve the repo locally and visit:

`http://127.0.0.1:8765/berlin-trip-planner-page/`

## Wix Install

Use the snippet in `SEO_SETTINGS.md`.
