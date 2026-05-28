# Berlin Survival Map Direct Email Trigger

This is the Velo patch for the `/_functions/subscribe` endpoint. It bypasses
the slow Wix `contacts-label_added_to_contact` automation queue and sends the
lead magnet emails directly from backend code.

## Files

- `survivalMapEmails.js` - add this as `Backend/survivalMapEmails.js` in Wix.
- `emailMarketingSubscription.js` - optional helper for the Email Marketing
  subscription status fix. Add this as `Backend/emailMarketingSubscription.js`
  in Wix once the API key is stored in Wix Secrets Manager.

## Wix Data log collection

Created via REST on 2026-05-28:

```text
SurvivalMapEmailLogs
```

Purpose: one row per Survival Map signup email attempt, so the direct Velo path
has a simple audit trail outside Wix Automations.

Fields:

| Field key | Type | Notes |
|---|---|---|
| `email` | Text | Normalized lowercase lead email |
| `contactId` | Text | Subscriber Wix contact ID |
| `source` | Text | Source passed by the widget or popup |
| `page` | Text | Referrer/calling page |
| `offer` | Text | Usually `berlin-survival-map` |
| `welcomeQueued` | Boolean | Subscriber welcome queued successfully |
| `ownerQueued` | Boolean | Owner notification queued successfully |
| `queuedCount` | Number | Count of successful direct sends |
| `failedCount` | Number | Count of failed direct sends |
| `welcomeError` | Text | Last subscriber-send error, if any |
| `ownerError` | Text | Last owner-send error, if any |
| `deliveryPath` | Text | `automation_label_trigger` or `direct_triggered_email` |
| `note` | Text | Operational note for fallback/debug state |
| `createdAt` | Date/Time | Backend log timestamp |

Local report:

```bash
source scripts/load-api-keys.sh
node scripts/survival-map-email-log-report.mjs --limit 100
```

## Live IDs verified on 2026-05-28

- Subscriber welcome direct Triggered Email ID: `VKufY4L`
- Owner notification direct Triggered Email ID: `VKugjPv`
- Owner contact for `info@yusufucuz.com`: `9e996f34-501f-4d45-8228-098680672e69`

Important: the two `messageId` values above belong to Wix Automations email
actions. They are not valid Velo `triggeredEmails.emailContact()` IDs. The live
helper now uses the real Developer Tools -> Triggered Emails IDs above and has
`DIRECT_TRIGGERED_EMAILS_ENABLED = true`.

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

## Email Marketing subscription status fix

The direct lead-magnet emails work independently of Email Marketing subscriber
status, but the live `/_functions/subscribe` response can still show
`subscriptionDebug: missing_api_key` if `http-functions.js` cannot read a Wix
REST API key.

Verified on 2026-05-28: the current Keychain `WIX_API_KEY` can query Wix Email
Subscriptions successfully through:

```text
POST https://www.wixapis.com/email-marketing/v1/email-subscriptions/query
```

To make the live Velo endpoint subscribe opted-in leads:

1. Add the same Wix REST API key to Wix Secrets Manager under `WIX_API_KEY`.
2. Add `emailMarketingSubscription.js` as
   `Backend/emailMarketingSubscription.js`.
3. In `Backend/http-functions.js`, add:

```js
import { subscribeEmailMarketing } from 'backend/emailMarketingSubscription';
```

4. Inside `post_subscribe`, after the email has been validated and the contact
   has been created/labelled, run the helper without blocking the PDF unlock:

```js
const subscriptionDebug = await subscribeEmailMarketing(email);
```

5. Keep returning the existing `success: true` response. If you include
   `subscriptionDebug` in the JSON response, use the helper result directly so a
   future failure is visible during smoke tests but does not break the lead
   magnet:

```js
subscriptionDebug
```

Local audit/backfill for logged Survival Map leads:

```bash
source scripts/load-api-keys.sh
node scripts/survival-map-subscription-repair.mjs
node scripts/survival-map-subscription-repair.mjs --apply
```

The script defaults to a dry run and skips contacts currently marked
`UNSUBSCRIBED` unless `--include-unsubscribed` is explicitly passed.

## After publish

1. Test the live form with a fresh email address.
2. Confirm the subscriber welcome email and owner notification arrive quickly.
3. Confirm `subscriptionDebug.ok === true` or equivalent in the JSON response.
4. Keep these two old label-trigger automations inactive to avoid duplicate sends:
   - `Berlin Survival Map Welcome Email - v2`
   - `Berlin Survival Map - Owner Notification`
5. Keep `Berlin Survival Map Welcome Email` inactive and do not delete it. It
   keeps the owner-notification Triggered Email template alive.
