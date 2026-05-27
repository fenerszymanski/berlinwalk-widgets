# Berlin Survival Map Welcome Email

Source-of-truth for the lead magnet welcome email sent after a visitor signs up
for the Berlin Survival Map.

## Live Wix automation

- Automation: `Berlin Survival Map Welcome Email`
- Automation ID: `5de2cbc8-cefa-47ba-91f2-0bbc4a0404b1`
- Revision checked: `12` on 2026-05-27
- Trigger: `contacts-label_added_to_contact`
- Label filter: `custom.berlin-essentials-signup`
- Triggered Email messageId: `2fb9b51f-91cd-4705-9967-178f861df727`
- Action ID: `a1b2c3d4-e5f6-7890-1234-567890abcdef`
- Action display name: `Send Berlin Survival Map welcome email`

The automation still uses the old label key internally. That is acceptable for
now because the Velo subscribe endpoint already assigns the existing label and
newer submissions also send `offer: berlin-survival-map`.

## Current PDF

- Public title: `Berlin Survival Map`
- Public URL: `https://12ee5ea0-70a7-492f-8020-ffb27cbb630f.usrfiles.com/ugd/5a08a3_fbb1e603406b4ac4b7a15628a0288e40.pdf`
- Local PDF: `/Users/yusufucuz/Documents/New project/output/pdf/berlin-survival-map.pdf`

## Inbox copy

- Subject: `Your Berlin Survival Map is here`
- Preview: `Airport tickets, Sunday traps, toilets, luggage, cash and local shortcuts in one PDF.`

## Current editor status

Yusuf manually pasted this refreshed body, subject, and preview into the Wix
Triggered Email editor on 2026-05-27.

## Files

- `berlin-survival-map-welcome.md` - editable copy deck.
- `wix-html-block.html` - paste-ready HTML for the Wix email editor HTML block.
- `preview.html` - local browser preview with inbox metadata.

## Wix paste workflow

1. Open Wix Automations -> `Berlin Survival Map Welcome Email`.
2. Open the email step.
3. Replace the old content with one HTML block.
4. Paste everything between `HTML BLOCK START` and `HTML BLOCK END` from
   `wix-html-block.html`.
5. Set subject and preview from the Inbox copy section above.
6. Preview & Test, then Save & Continue.

Wix Triggered Email body content is not currently writable through the public
REST API, so the editor paste is the durable path for future body changes. Keep
this folder updated after any manual editor edits.
