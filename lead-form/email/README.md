# Berlin First-Day Survival Guide Welcome Email

Source-of-truth for the lead magnet welcome email sent after a visitor signs up
for the Berlin First-Day Survival Guide. The backend/internal offer key remains
`berlin-survival-map` for compatibility.

## Live Wix email state

Checked through the Wix Automations API on 2026-05-28:

- Subscriber welcome: `Berlin Survival Map Welcome Email - v2`
  - Automation ID: `7eeb7b18-8211-427e-aba6-14b81172cd2c`
  - Revision checked: `7`
  - Status: inactive
  - Triggered Email messageId: `46a631f2-156e-4f14-9a8c-49d26fd97990`
  - Trigger: `contacts-label_added_to_contact`
  - Label filter: `custom.berlin-essentials-signup`
- Owner notification: `Berlin Survival Map - Owner Notification`
  - Automation ID: `29ea42fe-9990-45ef-b9d7-b94a509a1190`
  - Revision checked: `10`
  - Status: inactive
  - Triggered Email messageId: `2fb9b51f-91cd-4705-9967-178f861df727`
- Template anchor: `Berlin Survival Map Welcome Email`
  - Automation ID: `5de2cbc8-cefa-47ba-91f2-0bbc4a0404b1`
  - Revision checked: `16`
  - Status: inactive
  - Keep it inactive and do not delete it. It keeps the owner-notification
    Triggered Email template alive.

The label-trigger automations work but can arrive 2-10 minutes late, so they are
inactive. The live lead form uses Developer Tools Triggered Email IDs instead:
welcome `VKufY4L`, owner notification `VKugjPv`.

## Current PDF

- Public title: `Berlin First-Day Survival Guide`
- Public URL: `https://12ee5ea0-70a7-492f-8020-ffb27cbb630f.usrfiles.com/ugd/5a08a3_2fdd0e52467b4fe98b409d5d64e5818c.pdf`
- Local PDF: `/Users/yusufucuz/Documents/New project/output/pdf/berlin-first-day-survival-guide.pdf`
- Cover asset: `lead-form/assets/berlin-first-day-survival-guide-cover.jpg`

## Inbox copy

- Subject: `Your Berlin First-Day Survival Guide is here`
- Preview: `Airport tickets, Sunday rules, toilets, luggage, cash and the easiest first walk in one PDF.`

## Current editor status

Local source was updated on 2026-05-28. The live Wix Triggered Email body still
needs manual editor paste if the new public copy should be live immediately;
the direct email IDs remain unchanged.

## Files

- `berlin-survival-map-welcome.md` - editable copy deck.
- `wix-html-block.html` - paste-ready HTML for the Wix email editor HTML block.
- `preview.html` - local browser preview with inbox metadata.

## Wix paste workflow

1. Open Wix Automations -> `Berlin Survival Map Welcome Email - v2`.
2. Open the email step.
3. Replace the old content with one HTML block.
4. Paste everything between `HTML BLOCK START` and `HTML BLOCK END` from
   `wix-html-block.html`.
5. Set subject and preview from the Inbox copy section above.
6. Preview & Test, then Save & Continue.

Wix Triggered Email body content is not currently writable through the public
REST API, so the editor paste is the durable path for future body changes. Keep
this folder updated after any manual editor edits.
