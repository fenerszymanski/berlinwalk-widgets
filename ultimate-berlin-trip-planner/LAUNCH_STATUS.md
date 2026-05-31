# Ultimate Berlin Trip Planner Launch Status

Generated: 2026-05-31T18:32:00.199Z

## Verdict: WAITING FOR LIVE QA

Launch audit: 132 pass, 1 warn, 0 block (ready for manual Wix smoke tests)

## Gates

| Gate | Status | Detail |
| --- | --- | --- |
| Triggered Email IDs | PASS | All message IDs are applied. |
| TripPlannerLeads collection | PASS | 74 fields visible via API; critical fields verified. |
| Velo endpoints | WARN | lead OPTIONS 404, booking OPTIONS 404. |
| Live lead/booking smoke | WARN | No passing live smoke evidence found. |
| Live Wix tool page | WARN | Latest remote preflight status 404. |
| Public visibility | HOLD | Ultimate is still protected as draft. |
| Homepage shortcut | HOLD | Homepage shortcut is not enabled yet. |
| SEO blog package | PASS | Body draft has widget/summary/FAQ placeholders. |

## Evidence

- Latest remote preflight: `output/qa/ultimate-trip-planner-remote-preflight/remote-preflight-2026-05-31T14-40-53-892Z.json`
- Latest passing live smoke: missing
- Visibility: draft/protected, homepage shortcut not enabled
- Widget URL: https://fenerszymanski.github.io/berlinwalk-widgets/ultimate-berlin-trip-planner/
- Blog package: body draft exists; widget near top yes; quick summary yes; FAQ yes

## Current Blockers And Warnings

- No audit blockers.
- WARN Live Wix smoke test evidence is recorded - No live-*.json result with successful tripPlannerLead response found under output/qa/ultimate-trip-planner-live-smoke/.

## Next Actions

1. Publish Backend/tripPlannerFunnel.js, http-functions.js handlers, and jobs.config in Wix.
2. Run launch-remote-preflight.mjs until both Velo OPTIONS handlers are live.

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

