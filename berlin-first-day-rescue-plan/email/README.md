# Berlin First-Day Rescue Plan Email

This folder is the launch kit for the single backup email sent after a paid
First-Day Rescue Plan is generated.

The main product delivery remains the post-payment mobile plan screen. This
email only gives the customer a durable link back to the plan and repeats the
first move.

## Wix Setup

1. In Wix Developer Tools, create one Triggered Email.
2. Use `paste-ready/rescue-plan-backup.html` as the HTML block.
3. Use this subject:
   `Your Berlin First-Day Rescue Plan is ready`
4. Use this preheader:
   `Open your mobile plan and keep the first hours simple.`
5. Copy the generated Wix `messageId`.
6. Save that value in Wix Secrets Manager as `RESCUE_PLAN_EMAIL_MESSAGE_ID`.
7. Save the shared webhook secret in Wix Secrets Manager as
   `RESCUE_EMAIL_WEBHOOK_SECRET`.
8. Add the Velo files from `../velo/` to the live site, then publish.

Vercel must receive:

- `RESCUE_EMAIL_WEBHOOK_URL`
- `RESCUE_EMAIL_WEBHOOK_SECRET`

Use `https://www.berlinwalk.com/_functions/rescuePlanEmail` as the webhook URL
after the Velo HTTP function is published.

## Variables

The Velo sender passes these Triggered Email variables:

- `${planUrl}`
- `${firstMove}`
- `${orderId}`
- `${preheader}`
- `${supportNote}`
- `${officialCheckNote}`

Do not promise live opening hours, fine protection, or guarantees in this
email. It should feel like a calm backup from Yusuf, not a second itinerary.
