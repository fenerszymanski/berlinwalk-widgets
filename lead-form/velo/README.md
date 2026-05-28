# Berlin Survival Map Direct Email Trigger

This is the Velo patch for the `/_functions/subscribe` endpoint. It bypasses
the slow Wix `contacts-label_added_to_contact` automation queue and sends the
lead magnet emails directly from backend code.

## Files

- `survivalMapEmails.js` - add this as `Backend/survivalMapEmails.js` in Wix.

## Live IDs verified on 2026-05-28

- Subscriber welcome v2: `46a631f2-156e-4f14-9a8c-49d26fd97990`
- Owner notification: `2fb9b51f-91cd-4705-9967-178f861df727`
- Owner contact for `info@yusufucuz.com`: `9e996f34-501f-4d45-8228-098680672e69`

## http-functions.js patch

In `Backend/http-functions.js`, add this import near the top:

```js
import { sendSurvivalMapEmails } from 'backend/survivalMapEmails';
```

Inside the existing `post_subscribe` function, add this after the contact has
been created/found and labelled, where `contactId` and the parsed request
payload are available:

```js
await sendSurvivalMapEmails(contactId, {
  email,
  source: payload.source,
  page: payload.page,
  offer: payload.offer
});
```

If the existing request body variable is named `body` or `data`, use that name
instead of `payload`. Keep the existing success response shape, especially
`success: true`, because the iframe checks it before revealing the PDF link.

## After publish

1. Test the live form with a fresh email address.
2. Confirm the subscriber welcome email and owner notification arrive quickly.
3. Set these two automations to inactive to avoid duplicate sends:
   - `Berlin Survival Map Welcome Email - v2`
   - `Berlin Survival Map - Owner Notification`
4. Keep `Berlin Survival Map Welcome Email` inactive and do not delete it. It
   keeps the owner-notification Triggered Email template alive.
