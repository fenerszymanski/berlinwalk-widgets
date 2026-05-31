# Triggered Email API Notes

Internal launch note for Ultimate Berlin Trip Planner.

## Conclusion

The 10 Triggered Email templates still have to be created in the Wix dashboard.
Current public Wix docs support sending already-created Triggered Emails from
code, but do not expose a stable REST/API path for creating the email templates
and HTML content themselves.

Rechecked on 2026-05-31: Wix Automations V2 can create an automation that uses
the triggered-email action, but the examples still require an existing
`messageId`. The Velo backend `emailContact()` reference also says the triggered
email must already exist before code can send it.

This is why `WIX_EMAIL_SETUP_TR.md` and `email/paste-ready/copy-kit.html` remain
the launch path: template creation remains a manual Wix dashboard step for the
first pass.

## What Wix Docs Confirm

- The Velo Triggered Email flow assumes the template already exists before code
  sends it.
- The SDK `emailContact()` reference also says a Triggered Email must be set up
  before calling the send method.
- The Automations V2 REST API can create and manage automation workflows, but
  its own introduction says the trigger/action pieces must already exist.
- The Automations V2 create examples can wire a triggered-email action, but they
  still pass an existing `messageId`; they do not create the email template body.
- Automation validation can check configuration, but it does not create the
  Triggered Email template or message body.

## Sources Checked

- Velo tutorial, Sending a Triggered Email to Contacts:
  https://dev.wix.com/docs/develop-websites/articles/workspace-tools/developer-tools/triggered-emails/sending-a-triggered-email-to-contacts
- SDK `emailContact()` reference:
  https://dev.wix.com/docs/sdk/frontend-modules/crm/triggered-emails/email-contact
- Automations V2 API introduction:
  https://dev.wix.com/docs/api-reference/business-management/automations/automations/automations-v2/introduction
- Automations V2 create automation:
  https://dev.wix.com/docs/api-reference/business-management/automations/automations/automations-v2/create-automation
- Automations V2 validation:
  https://dev.wix.com/docs/api-reference/business-management/automations/automations/automations-v2/validate-automation

## Practical Launch Decision

Do not spend launch time trying to create the 10 Triggered Email templates via
REST unless Wix ships a specific Triggered Email template-management endpoint.

Use this order instead:

1. Open `email/paste-ready/copy-kit.html`.
2. Create the 10 templates manually in Wix.
3. Save URLs or message IDs into `message-ids.local.json`.
4. Run `velo/check-triggered-email-ids.mjs`.
5. Run `velo/apply-triggered-email-ids.mjs`.
6. Publish Velo and smoke test.
