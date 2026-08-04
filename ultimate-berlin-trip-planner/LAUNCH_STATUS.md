# Ultimate Berlin Trip Planner Launch Status

Generated: 2026-07-20T22:44:14.398Z

## Verdict: NOT READY

Launch audit: 149 pass, 0 warn, 10 block (NOT READY)

## Gates

| Gate | Status | Detail |
| --- | --- | --- |
| Triggered Email IDs | PASS | All message IDs are applied. |
| TripPlannerLeads collection | PASS | 77 fields visible via API; critical fields verified. |
| Velo endpoints | WARN | lead OPTIONS 204, legacy AI unknown, booking OPTIONS 204. |
| Live lead/booking smoke | PASS | output/qa/ultimate-trip-planner-live-smoke/live-direct-widget-link-2026-06-05b.json |
| Zero customer-runtime AI | PASS | Static release checks prove no provider/runtime AI path; legacy endpoint is HTTP 410 ai_disabled. |
| Live Wix tool page | PASS | Latest remote preflight status 200. |
| Public visibility | PASS | Ultimate is public in tools-hub. |
| Homepage shortcut | HOLD | Homepage shortcut is not enabled yet. |
| UX revision | HOLD | Yusuf flagged the live widget as too complex and too promotional; simplify the planner before treating the SEO blog/post launch as finished. (ultimate-berlin-trip-planner/UX_REVISION_HOLD.md) |
| SEO blog package | PASS | Body draft has widget/summary/FAQ placeholders. |
| Wix Blog draft | PASS | Draft b1915fa5-dfcf-4427-bcfc-d9a6665208e7 is created but unpublished. |

## Evidence

- Latest remote preflight: `output/qa/ultimate-trip-planner-remote-preflight/remote-preflight-2026-06-03T05-49-14-482Z.json`
- Latest passing live smoke: `output/qa/ultimate-trip-planner-live-smoke/live-direct-widget-link-2026-06-05b.json`
- Customer-runtime AI: disabled by static release checks
- Legacy AI endpoint: remote status not checked
- Visibility: public, homepage shortcut not enabled
- Widget URL: https://fenerszymanski.github.io/berlinwalk-widgets/ultimate-berlin-trip-planner/
- Blog package: body draft exists; widget near top yes; quick summary yes; FAQ yes
- Wix Blog draft: b1915fa5-dfcf-4427-bcfc-d9a6665208e7 (https://manage.wix.com/dashboard/12ee5ea0-70a7-492f-8020-ffb27cbb630f/blog/drafts/b1915fa5-dfcf-4427-bcfc-d9a6665208e7/edit)

## Current Blockers And Warnings

- BLOCK Triggered Email copy stays reader-facing - Expected the current email sequence to use warmer traveller-facing copy with emoji subjects, while keeping technical segmentation fields out of the pasted emails.
- BLOCK Ultimate visibility state is launch-safe - Current status=(none), published=undefined; public release requires live smoke and remote preflight evidence.
- BLOCK Homepage tools renderer filters draft tools - tools-home/tools-home-element.js should hide status:draft, hidden:true, and published:false before taking the first 8 cards.
- BLOCK Homepage planner icons are launch-ready - Berlin First-Day and Hackescher homepage shortcuts should use generated local 160px icons, not letter placeholders.
- BLOCK Ultimate homepage icon state is launch-safe - Keep the Ultimate icon ready in tools-hub; when homepage-visible, use the generated 160px icon URL.
- BLOCK Widgets hub SEO matches Ultimate visibility - Regenerate widgets hub SEO after changing public/draft status.
- BLOCK Top header uses a real Berlin visual hero - Expected the first viewport to show a real Berlin photo, route cue, and planner feature chips instead of a plain text header.
- BLOCK Planner waits for a deliberate build action - Expected results to stay hidden until the visitor clicks the build button and the planning animation completes.
- BLOCK FAQ injector maps Ultimate slugs - faq/inject.js should map the planned blog slug and fallback title slug.
- BLOCK FAQ schema includes Ultimate questions - faq/inject.js should include generated FAQPage schema for the Ultimate key.

## Next Actions

1. Fix the launch-audit BLOCK items first, especially the lead gate, compact day copy, and public-listing/icon issues.
2. After those pass, publish the updated Velo with the legacy HTTP 410 ai_disabled handler, then run remote preflight plus --ai-only compatibility smoke.

## Command Shortcuts

```bash
node ultimate-berlin-trip-planner/launch-audit.mjs
node ultimate-berlin-trip-planner/velo/run-email-id-launch-gate.mjs --import-downloads
source ../scripts/load-api-keys.sh
node ultimate-berlin-trip-planner/velo/run-email-id-launch-gate.mjs --import-downloads --write
node ultimate-berlin-trip-planner/velo/import-message-ids-from-downloads.mjs --write
pbpaste | node ultimate-berlin-trip-planner/velo/build-message-ids-from-paste.mjs --write
node ultimate-berlin-trip-planner/velo/check-triggered-email-ids.mjs --ids ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json
source ../scripts/load-api-keys.sh
node ultimate-berlin-trip-planner/launch-remote-preflight.mjs
node ultimate-berlin-trip-planner/velo/create-trip-planner-leads-collection.mjs --live --sync-fields
node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --live --ai-only
node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --live --email YOUR_TEST_EMAIL@example.com
node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --live --email YOUR_TEST_EMAIL@example.com --ai
node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --live --email YOUR_TEST_EMAIL@example.com --booking
node ultimate-berlin-trip-planner/velo/simulate-email-sequence.mjs --arrival 2026-06-12 --signup 2026-06-01
node ultimate-berlin-trip-planner/velo/report-trip-planner-leads.mjs --live --limit 200
node ultimate-berlin-trip-planner/release-visibility.mjs
```

