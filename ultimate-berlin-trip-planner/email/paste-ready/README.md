# Ultimate Berlin Trip Planner Paste-Ready Triggered Emails

Generated from the markdown files one folder up.

Regenerate after copy changes:

```bash
node ultimate-berlin-trip-planner/email/build-triggered-email-html.mjs
```

## Wix Paste Workflow

1. Open Wix Developer Tools -> Triggered Emails and create a new Triggered Email template. Do not create an automation workflow for these five templates; Velo sends them by message ID.
2. Copy the Wix template name from the matching card in `copy-kit.html` and use it as the template name in Wix.
3. Paste the subject and preheader from the same card.
4. Open the HTML/custom body editor and paste everything between `HTML BLOCK START` and `HTML BLOCK END` from the matching HTML file.
5. Save the template.
6. Put the resulting messageIds, or the Wix editor URLs containing them, into a local JSON file shaped like `message-ids.template.json`.
7. If the copy kit downloaded `message-ids.local.json` to your Downloads folder, import it into the repo:

```bash
node ultimate-berlin-trip-planner/velo/import-message-ids-from-downloads.mjs
node ultimate-berlin-trip-planner/velo/import-message-ids-from-downloads.mjs --write
```

8. Preferred fast path after the 5 IDs exist:

```bash
node ultimate-berlin-trip-planner/velo/run-email-id-launch-gate.mjs --import-downloads
source ../scripts/load-api-keys.sh
node ultimate-berlin-trip-planner/velo/run-email-id-launch-gate.mjs --import-downloads --write
```

9. Or check the local ID file manually:

```bash
node ultimate-berlin-trip-planner/velo/check-triggered-email-ids.mjs --ids ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json
```

10. Dry-run the replacement:

```bash
node ultimate-berlin-trip-planner/velo/apply-triggered-email-ids.mjs --ids ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json
```

11. If the dry run is clean, apply it:

```bash
node ultimate-berlin-trip-planner/velo/apply-triggered-email-ids.mjs --ids ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json --write
```

12. Run `node ultimate-berlin-trip-planner/launch-audit.mjs`.

Shortcut: open `copy-kit.html` for one-page copy buttons, Wix template names,
subject/preheader blocks, HTML blocks, a setup checklist export, setup progress
checkboxes, ID validation, a bulk URL paste box, and a message-ID JSON builder.
The same checklist is also generated as `setup-checklist.txt`.

## Template Map

| Path | Stage | Velo Placeholder | HTML | Subject |
| --- | --- | --- | --- | --- |
| sales | instant | `TODO_TRIP_PLANNER_INSTANT` | [e0-instant-plan.html](e0-instant-plan.html) | 🗺️ Your ${tripPackLabel} is ready |
| sales | minus7 | `TODO_TRIP_PLANNER_MINUS_7` | [e1-seven-days-before.html](e1-seven-days-before.html) | 🧳 One week before Berlin |
| sales | minus3 | `TODO_TRIP_PLANNER_MINUS_3` | [e2-three-days-before.html](e2-three-days-before.html) | 🎫 Ticket checks for your Berlin pack |
| sales | minus1 | `TODO_TRIP_PLANNER_MINUS_1` | [e3-one-day-before.html](e3-one-day-before.html) | 🌦️ Berlin tomorrow |
| sales | dayOf | `TODO_TRIP_PLANNER_DAY_OF` | [e4-arrival-day.html](e4-arrival-day.html) | 👋 Welcome to Berlin |

## Notes

- HTML is table-based with inline CSS only.
- No `<style>`, `<script>`, `<svg>`, or external font tags are used.
- Wix variables keep the `${var_name}` syntax expected by Velo Triggered Emails.
- Once a lead books, the Ultimate scheduler suppresses future planner reminders and lets the existing Wix booking email sequence handle meeting-point/prep emails.
