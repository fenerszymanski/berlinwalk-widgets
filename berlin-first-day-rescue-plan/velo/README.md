# Berlin First-Day Rescue Plan Velo Email Webhook

Use these files to let the Vercel Rescue endpoint send the one backup email via
Wix Triggered Emails.

## Files

- `rescuePlanEmail.js` goes in Wix Velo backend as `backend/rescuePlanEmail.js`.
- `http-functions.js` contains the HTTP function to add to the site's
  `http-functions.js`. If the site already has an `http-functions.js`, merge the
  `post_rescuePlanEmail` and `options_rescuePlanEmail` exports into it.

## Wix Secrets

Create these in Wix Secrets Manager:

- `RESCUE_PLAN_EMAIL_MESSAGE_ID` - the Triggered Email messageId.
- `RESCUE_EMAIL_WEBHOOK_SECRET` - shared bearer secret used by Vercel.

## Vercel Env

Set these in the Vercel production project:

- `RESCUE_EMAIL_WEBHOOK_URL=https://www.berlinwalk.com/_functions/rescuePlanEmail`
- `RESCUE_EMAIL_WEBHOOK_SECRET=<same value as Wix secret>`

The endpoint expects the Vercel payload already produced by
`buildRescueEmail()`: recipient email, plan URL, subject, preheader, text, HTML,
and order ID.
