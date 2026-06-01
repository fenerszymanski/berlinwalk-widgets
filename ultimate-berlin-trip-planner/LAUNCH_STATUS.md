# Ultimate Berlin Trip Planner Launch Status

Generated: 2026-05-31T20:32:15.062Z

## Verdict: PUBLIC TOOL LIVE - UX REVISION OPEN

Launch audit: 139 pass, 0 warn, 0 block (ready for manual Wix smoke tests)

## Gates

| Gate | Status | Detail |
| --- | --- | --- |
| Triggered Email IDs | PASS | All message IDs are applied. |
| TripPlannerLeads collection | PASS | 74 fields visible via API; critical fields verified. |
| Velo endpoints | PASS | lead OPTIONS 204, booking OPTIONS 204. |
| Live lead/booking smoke | PASS | output/qa/ultimate-trip-planner-live-smoke/live-2026-05-31T18-57-06-052Z.json |
| Live Wix tool page | PASS | Latest remote preflight status 200. |
| Public visibility | PASS | Ultimate is public in tools-hub. |
| Homepage shortcut | PASS | Ultimate appears in tools-home/data.json. |
| UX revision | HOLD | Yusuf flagged the live widget as too complex and too promotional; simplify the planner before treating the SEO blog/post launch as finished. (ultimate-berlin-trip-planner/UX_REVISION_HOLD.md) |
| SEO blog package | PASS | Body draft has widget/summary/FAQ placeholders. |
| Wix Blog draft | PASS | Draft b1915fa5-dfcf-4427-bcfc-d9a6665208e7 is created but unpublished. |

## Evidence

- Latest remote preflight: `output/qa/ultimate-trip-planner-remote-preflight/remote-preflight-2026-05-31T19-20-51-073Z.json`
- Latest passing live smoke: `output/qa/ultimate-trip-planner-live-smoke/live-2026-05-31T18-57-06-052Z.json`
- Visibility: public, homepage shortcut enabled
- Widget URL: https://fenerszymanski.github.io/berlinwalk-widgets/ultimate-berlin-trip-planner/
- Blog package: body draft exists; widget near top yes; quick summary yes; FAQ yes
- Wix Blog draft: b1915fa5-dfcf-4427-bcfc-d9a6665208e7 (https://manage.wix.com/dashboard/12ee5ea0-70a7-492f-8020-ffb27cbb630f/blog/drafts/b1915fa5-dfcf-4427-bcfc-d9a6665208e7/edit)

## Current Blockers And Warnings

- No audit blockers.

## Next Actions

1. Keep the Wix Blog post unpublished while the widget UX is simplified.
2. Continue local QA on the simpler planner, especially mobile result density and PDF layout.

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
node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --live --email YOUR_TEST_EMAIL@example.com
node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --live --email YOUR_TEST_EMAIL@example.com --booking
node ultimate-berlin-trip-planner/velo/simulate-email-sequence.mjs --arrival 2026-06-12 --signup 2026-06-01
node ultimate-berlin-trip-planner/velo/report-trip-planner-leads.mjs --live --limit 200
node ultimate-berlin-trip-planner/release-visibility.mjs
```

