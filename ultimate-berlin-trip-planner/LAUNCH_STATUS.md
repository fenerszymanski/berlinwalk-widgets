# Ultimate Berlin Trip Planner Launch Status

Generated: 2026-06-02T14:08:53.418Z

## Verdict: WAITING FOR LIVE QA

Launch audit: 149 pass, 1 warn, 0 block (ready for manual Wix smoke tests)

## Gates

| Gate | Status | Detail |
| --- | --- | --- |
| Triggered Email IDs | PASS | All message IDs are applied. |
| TripPlannerLeads collection | PASS | 74 fields visible via API; critical fields verified. |
| Velo endpoints | WARN | lead OPTIONS 204, ai OPTIONS 404, booking OPTIONS 204. |
| Live lead/booking smoke | PASS | output/qa/ultimate-trip-planner-live-smoke/live-2026-05-31T18-57-06-052Z.json |
| Gemini AI polish smoke | WARN | No passing tripPlannerAi smoke evidence found. |
| Live Wix tool page | PASS | Latest remote preflight status 200. |
| Public visibility | HOLD | Ultimate is still protected as draft. |
| Homepage shortcut | HOLD | Homepage shortcut is not enabled yet. |
| UX revision | HOLD | Yusuf flagged the live widget as too complex and too promotional; simplify the planner before treating the SEO blog/post launch as finished. (ultimate-berlin-trip-planner/UX_REVISION_HOLD.md) |
| SEO blog package | PASS | Body draft has widget/summary/FAQ placeholders. |
| Wix Blog draft | PASS | Draft b1915fa5-dfcf-4427-bcfc-d9a6665208e7 is created but unpublished. |

## Evidence

- Latest remote preflight: `output/qa/ultimate-trip-planner-remote-preflight/remote-preflight-2026-06-02T14-07-47-464Z.json`
- Latest passing live smoke: `output/qa/ultimate-trip-planner-live-smoke/live-2026-05-31T18-57-06-052Z.json`
- Latest passing Gemini AI smoke: missing
- Latest Gemini cost estimate: missing until live AI smoke passes
- Visibility: draft/protected, homepage shortcut not enabled
- Widget URL: https://fenerszymanski.github.io/berlinwalk-widgets/ultimate-berlin-trip-planner/
- Blog package: body draft exists; widget near top yes; quick summary yes; FAQ yes
- Wix Blog draft: b1915fa5-dfcf-4427-bcfc-d9a6665208e7 (https://manage.wix.com/dashboard/12ee5ea0-70a7-492f-8020-ffb27cbb630f/blog/drafts/b1915fa5-dfcf-4427-bcfc-d9a6665208e7/edit)

## Current Blockers And Warnings

- No audit blockers.
- WARN Gemini AI polish live smoke evidence is recorded - No live-*.json result with successful tripPlannerAi response found under output/qa/ultimate-trip-planner-live-smoke/. Add GEMINI_API_KEY in Wix Secrets, publish Velo, then run the smoke helper with --ai.

## Next Actions

1. Publish Backend/tripPlannerFunnel.js, http-functions.js handlers, and jobs.config in Wix.
2. Run launch-remote-preflight.mjs until lead, AI, and booking Velo OPTIONS handlers are live.

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

