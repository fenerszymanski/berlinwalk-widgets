# Ultimate Berlin Trip Planner Launch Runbook

Use this runbook only after the local launch audit is clean enough to proceed.
The tool stays hidden from public shortcut surfaces until the live smoke tests
pass.

## Current Gate

Run from `berlinwalk-widgets/`:

```bash
node ultimate-berlin-trip-planner/build-launch-control-room.mjs
node ultimate-berlin-trip-planner/build-launch-status-report.mjs
node ultimate-berlin-trip-planner/launch-audit.mjs
node ultimate-berlin-trip-planner/launch-remote-preflight.mjs
```

Open the local launch dashboard:

```text
ultimate-berlin-trip-planner/LAUNCH_CONTROL_ROOM.html
```

For Yusuf's step-by-step Turkish email setup handoff, open:

```text
ultimate-berlin-trip-planner/WIX_EMAIL_SETUP_TR.md
```

For the research note on why this step is still manual, open:

```text
ultimate-berlin-trip-planner/TRIGGERED_EMAIL_API_NOTES.md
```

Open the generated status report when you need a plain Markdown launch summary:

```text
ultimate-berlin-trip-planner/LAUNCH_STATUS.md
```

For the short Turkish Gemini/Velo live publish checklist, open:

```text
ultimate-berlin-trip-planner/WIX_GEMINI_PUBLISH_TR.md
```

Expected before Wix template work: one blocker for the five
`TODO_TRIP_PLANNER_*` Triggered Email message IDs. Do not publish the tool page,
homepage shortcut, or widgets gallery entry until that blocker is gone and live
smoke evidence is recorded. Keep the tools-hub row at `status: "draft"` until
the protected visibility release step passes.

For CMS/collection preflight, load the Wix key first:

```bash
source ../scripts/load-api-keys.sh
node ultimate-berlin-trip-planner/launch-remote-preflight.mjs
```

## 1. Prepare Triggered Emails

Regenerate the paste-ready HTML if any email copy changed:

```bash
node ultimate-berlin-trip-planner/email/build-triggered-email-html.mjs
```

Open the one-page local copy kit:

```text
ultimate-berlin-trip-planner/email/paste-ready/copy-kit.html
```

If doing the Wix clicks manually, keep
`ultimate-berlin-trip-planner/WIX_EMAIL_SETUP_TR.md` open next to the copy kit.

In Wix, create five Triggered Email templates from
`ultimate-berlin-trip-planner/email/paste-ready/`:

| Branch | Stage | Placeholder | HTML file |
| --- | --- | --- | --- |
| Prep | Instant | `TODO_TRIP_PLANNER_INSTANT` | `e0-instant-plan.html` |
| Prep | 7 days before | `TODO_TRIP_PLANNER_MINUS_7` | `e1-seven-days-before.html` |
| Prep | 3 days before | `TODO_TRIP_PLANNER_MINUS_3` | `e2-three-days-before.html` |
| Prep | 1 day before | `TODO_TRIP_PLANNER_MINUS_1` | `e3-one-day-before.html` |
| Prep | Arrival day | `TODO_TRIP_PLANNER_DAY_OF` | `e4-arrival-day.html` |

Do not create a booked-path Ultimate set. Booked guests already enter the
existing BerlinWalk booking email sequence; Ultimate only needs to suppress its
own future reminders after a booking marker arrives.

For each template, paste:

- Subject and preheader from `email/paste-ready/README.md`.
- Only the HTML between `HTML BLOCK START` and `HTML BLOCK END`.

The copy kit has buttons for all three parts and a message-ID JSON builder for
the next step. It also keeps a local progress checklist in the browser, validates
IDs as they are pasted, extracts IDs from Wix editor URLs, warns about duplicates,
and has a bulk paste box for all 5 URLs in template order.

Get each message ID from the Wix editor URL. The ID appears between
`/automations/edit/` and `/content/en`.

## 2. Apply Message IDs

Create a local, untracked file:

```text
ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json
```

Use either raw IDs or full Wix editor URLs:

```json
{
  "TODO_TRIP_PLANNER_INSTANT": "PASTE_WIX_EDITOR_URL_OR_MESSAGE_ID",
  "TODO_TRIP_PLANNER_MINUS_7": "PASTE_WIX_EDITOR_URL_OR_MESSAGE_ID",
  "TODO_TRIP_PLANNER_MINUS_3": "PASTE_WIX_EDITOR_URL_OR_MESSAGE_ID",
  "TODO_TRIP_PLANNER_MINUS_1": "PASTE_WIX_EDITOR_URL_OR_MESSAGE_ID",
  "TODO_TRIP_PLANNER_DAY_OF": "PASTE_WIX_EDITOR_URL_OR_MESSAGE_ID"
}
```

Shortcut if you already have five Wix editor URLs in order: paste them into the
copy kit's bulk paste box and click `Apply bulk IDs`, or paste them into a local
text file / pipe them from the clipboard, then let the helper build the JSON file:

```bash
pbpaste | node ultimate-berlin-trip-planner/velo/build-message-ids-from-paste.mjs
pbpaste | node ultimate-berlin-trip-planner/velo/build-message-ids-from-paste.mjs --write
```

If the copy kit downloaded `message-ids.local.json` to the normal Mac Downloads
folder, use the import helper instead of moving the file by hand:

```bash
node ultimate-berlin-trip-planner/velo/import-message-ids-from-downloads.mjs
node ultimate-berlin-trip-planner/velo/import-message-ids-from-downloads.mjs --write
```

The first command is a dry run. The write command validates all five IDs, writes
the normalized local repo file, and backs up any previous local ID file under
`output/qa/ultimate-trip-planner-message-id-import/`.

Fast path once the 5 IDs exist:

```bash
node ultimate-berlin-trip-planner/velo/run-email-id-launch-gate.mjs --import-downloads
source ../scripts/load-api-keys.sh
node ultimate-berlin-trip-planner/velo/run-email-id-launch-gate.mjs --import-downloads --write
```

The first command proves the downloaded ID file is valid. The write command
imports the JSON, applies IDs, verifies `tripPlannerFunnel.js`, regenerates the
install/status/control artifacts, runs the Velo pre-publish gate, and runs the
launch audit. Use the manual commands below only if you want to step through
each action separately.

If the JSON is not in the normal Downloads folder, add either:

```bash
node ultimate-berlin-trip-planner/velo/run-email-id-launch-gate.mjs --import-from /path/to/message-ids.local.json --write
node ultimate-berlin-trip-planner/velo/run-email-id-launch-gate.mjs --import-downloads --downloads-dir /path/to/download-folder --write
```

Check the file, dry-run, then write:

```bash
node ultimate-berlin-trip-planner/velo/check-triggered-email-ids.mjs --ids ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json
node ultimate-berlin-trip-planner/velo/apply-triggered-email-ids.mjs --ids ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json
node ultimate-berlin-trip-planner/velo/apply-triggered-email-ids.mjs --ids ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json --write
node ultimate-berlin-trip-planner/velo/check-triggered-email-ids.mjs --ids ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json --require-applied
node ultimate-berlin-trip-planner/launch-audit.mjs
```

The read-only check should report `Valid IDs: 5/5` before the write, and
`Applied in Velo: 5/5` after the write. The write step also creates a
timestamped backup under `output/qa/ultimate-trip-planner-email-id-apply/` before
touching `tripPlannerFunnel.js`. The audit should no longer show the Triggered
Email blocker.

Before pasting Velo into Wix, also run the one-command paste gate:

```bash
source ../scripts/load-api-keys.sh
node ultimate-berlin-trip-planner/velo/prepublish-gate.mjs
```

Expected result: `Ready for Velo paste: YES`. If it says `NO`, fix the reported
block before touching Wix Developer Tools.

## 3. Install Velo Backend

In Wix Developer Tools:

1. Regenerate and open the local Velo install kit:

   ```bash
   node ultimate-berlin-trip-planner/velo/build-velo-install-kit.mjs
   ```

   Open:

   ```text
   ultimate-berlin-trip-planner/velo/install-kit.html
   ```

   Use it for the copy buttons and paste order below.
2. Create or verify the `TripPlannerLeads` collection. Prefer the
   dry-run-first helpers:

   ```bash
   source ../scripts/load-api-keys.sh
   node ultimate-berlin-trip-planner/velo/create-trip-planner-leads-collection.mjs
   node ultimate-berlin-trip-planner/velo/create-trip-planner-leads-collection.mjs --live
   node ultimate-berlin-trip-planner/velo/create-trip-planner-ai-budget-collection.mjs
   node ultimate-berlin-trip-planner/velo/create-trip-planner-ai-budget-collection.mjs --live
   ```

   If a helper reports missing fields on an existing collection, run the
   guarded sync pass:

   ```bash
   node ultimate-berlin-trip-planner/velo/create-trip-planner-leads-collection.mjs --live --sync-fields
   node ultimate-berlin-trip-planner/velo/create-trip-planner-ai-budget-collection.mjs --live --sync-fields
   ```

   `TripPlannerAiBudget` stores only daily/monthly Gemini counters. Field lists
   also live in `ultimate-berlin-trip-planner/velo/README.md`.
3. Add `ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js` as
   `Backend/tripPlannerFunnel.js`.
4. Add `GEMINI_API_KEY` in Wix Secrets Manager if the AI polish layer should run
   live. The endpoint is fail-soft, but the live AI smoke will not pass without
   this secret.
   - Default model: `gemini-2.5-flash`.
   - Cost guardrail: `maxOutputTokens: 1200`, `thinkingBudget: 0`, structured
     JSON response, lead cap `2`, daily global cap `5000`, monthly global cap
     `150000`, and deterministic fallback if Gemini fails.
   - Expected cost is well under one cent per unlock in normal use; recheck the
     official Gemini pricing page before changing the model or sending high
     traffic.
5. Merge `ultimate-berlin-trip-planner/velo/http-functions.js` into live
   `Backend/http-functions.js`.
6. Merge `ultimate-berlin-trip-planner/velo/jobs.config` into live
   `jobs.config`.
7. Publish the Wix site so `/_functions/tripPlannerLead`,
   `/_functions/tripPlannerAi`, `/_functions/tripPlannerBooking`, and the
   hourly scheduled job are live.

Booked guests should not receive a second Ultimate prep sequence. The
`tripPlannerBooking` endpoint marks matching planner leads as booked so future
Ultimate scheduled reminders stop, while the existing Wix booking email
sequence handles meeting-point, weather, and tour-day prep.

## 4. Live Smoke Test

Use a real test inbox, not a fake domain:

```bash
node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --email test@example.com
node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --live --email test@example.com --ai-only
node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --live --email test@example.com
node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --live --email test@example.com --ai
node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --live --email test@example.com --booking
node ultimate-berlin-trip-planner/launch-remote-preflight.mjs
node ultimate-berlin-trip-planner/launch-audit.mjs
```

Confirm:

- `tripPlannerLead` returns `ok: true` and a `leadId`.
- The instant email arrives with the plan variables filled.
- `tripPlannerAi` returns `ok: true` with `enhancement.routeIntro` and `enhancement.dayStories`; use
  `--ai-only` first if you only want to test Gemini against an existing lead
  without creating a new lead or sending the instant email.
- `tripPlannerBooking` returns `ok: true`.
- Future Ultimate reminders are suppressed for that booked lead.
- The audit warnings for lead/booking and Gemini AI smoke evidence disappear.

## 5. Create Tool Page And Publish Visibility

After live smoke passes:

```bash
source ../scripts/load-api-keys.sh
node ../insert-ultimate-berlin-trip-planner.js --dry-run
node ../insert-ultimate-berlin-trip-planner.js
```

Then dry-run the protected visibility release helper:

```bash
node ultimate-berlin-trip-planner/release-visibility.mjs
```

After it reports that the release gates are met, write the public tools-hub
visibility change:

```bash
node ultimate-berlin-trip-planner/release-visibility.mjs --write --regenerate-widgets-seo
```

The write step creates timestamped backups under:

```text
output/qa/ultimate-trip-planner-visibility-release/
```

Add Ultimate to the homepage shortcuts only after the live tool page, widget
embed, and `/berlin-tools`/`/widgets` QA pass:

```bash
node ultimate-berlin-trip-planner/release-visibility.mjs --write --include-home --regenerate-widgets-seo
```

Verify:

- `https://www.berlinwalk.com/tools/ultimate-berlin-trip-planner`
- `/berlin-tools`
- `/widgets`
- homepage tools section, if added there.

## 6. Publish Blog

Use:

- `blog-drafts/ultimate-berlin-trip-planner.md`
- `blog-drafts/ultimate-berlin-trip-planner.body.md`
- `quick-summary/data.json`
- `faq/data.json`
- `faq/inject.js`

The public blog body should keep the widget near the top and keep competitor
research notes out of the published content.

Final checks:

- Widget embed sizes correctly in the blog.
- Quick Summary appears.
- FAQ appears.
- Internal links work.
- Blog CTA points to the booking page and relevant tools.

## Rollback Rule

If any live endpoint, email, PDF, or page QA fails, keep Ultimate in draft
visibility and do not add it to homepage shortcuts. Fix locally, push, wait for
GitHub Pages, and rerun the live smoke before public launch.
