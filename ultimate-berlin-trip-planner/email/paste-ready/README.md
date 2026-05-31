# Ultimate Berlin Trip Planner Paste-Ready Triggered Emails

Generated from the markdown files one folder up.

Regenerate after copy changes:

```bash
node ultimate-berlin-trip-planner/email/build-triggered-email-html.mjs
```

## Wix Paste Workflow

1. Open Wix Developer Tools -> Triggered Emails and create a new Triggered Email template. Do not create an automation workflow for these ten templates; Velo sends them by message ID.
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

8. Preferred fast path after the 10 IDs exist:

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
| sales | instant | `TODO_TRIP_PLANNER_INSTANT` | [e0-instant-plan.html](e0-instant-plan.html) | Your Berlin trip plan is ready |
| sales | minus7 | `TODO_TRIP_PLANNER_MINUS_7` | [e1-seven-days-before.html](e1-seven-days-before.html) | One week before Berlin: keep the trip realistic |
| sales | minus3 | `TODO_TRIP_PLANNER_MINUS_3` | [e2-three-days-before.html](e2-three-days-before.html) | Three days before Berlin: tickets, shops, and first-day traps |
| sales | minus1 | `TODO_TRIP_PLANNER_MINUS_1` | [e3-one-day-before.html](e3-one-day-before.html) | Berlin tomorrow: ${weatherTitle} |
| sales | dayOf | `TODO_TRIP_PLANNER_DAY_OF` | [e4-arrival-day.html](e4-arrival-day.html) | Welcome to Berlin - start simple |
| booked | instant | `TODO_TRIP_PLANNER_INSTANT_BOOKED` | [booked-e0-instant-plan.html](booked-e0-instant-plan.html) | Your Berlin plan is ready - and your walk is in the right place |
| booked | minus7 | `TODO_TRIP_PLANNER_MINUS_7_BOOKED` | [booked-e1-seven-days-before.html](booked-e1-seven-days-before.html) | One week before Berlin: your booked-walk prep |
| booked | minus3 | `TODO_TRIP_PLANNER_MINUS_3_BOOKED` | [booked-e2-three-days-before.html](booked-e2-three-days-before.html) | Three days before Berlin: transport and first-day checks |
| booked | minus1 | `TODO_TRIP_PLANNER_MINUS_1_BOOKED` | [booked-e3-one-day-before.html](booked-e3-one-day-before.html) | Berlin tomorrow: ${weatherTitle} |
| booked | dayOf | `TODO_TRIP_PLANNER_DAY_OF_BOOKED` | [booked-e4-arrival-day.html](booked-e4-arrival-day.html) | Welcome to Berlin - see you at the World Clock |

## Notes

- HTML is table-based with inline CSS only.
- No `<style>`, `<script>`, `<svg>`, or external font tags are used.
- Wix variables keep the `${var_name}` syntax expected by Velo Triggered Emails.
- Booked-path placeholders intentionally stay separate from sales-path placeholders so missing booked IDs skip safely instead of sending sales copy.
