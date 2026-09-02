# Berlin History Story lead magnet adapter

Status: local frontend implementation only. The backend/content-app registry and delivery files are intentionally outside this change.

The public title is rendered as `Berlin, Remade: Four Places to Read Berlin`. The colon keeps the approved public copy free of em dashes while preserving the requested magnet name.

## Visitor flow

1. The final story chapter shows a short four-place overview. The full visual field-card preview then appears in normal page flow after the scrolly story, before the source and reading section. Each card is a separate starting point, not a route step.
2. A Molkenmarkt sample is visible before the form. It points to the public pavement and the A3 fence near Altes Stadthaus and does not promise entry to the fenced excavation.
3. The preview date windows are `2019 to present` for Molkenmarkt, `1688 to 1732` for Friedrichstadt, `autumn 1941 to spring 1942` for Gleis 17 and `1990 to 2016` for Potsdamer + Leipziger Platz.
4. The gate asks only for an email address and one unchecked, required consent checkbox. Its visible consent copy is: `Email me Berlin, Remade: Four Places to Read Berlin, plus occasional BerlinWalk emails about Berlin history, new articles and walking-tour updates. I can unsubscribe at any time. Read the Privacy Policy.` There are no name, phone or arrival questions.
5. The form posts to the generic lead asset endpoint. A successful `202 accepted` response changes the copy to an inbox instruction.
6. DOI is completed from the email. The frontend does not fabricate, expose or persist a token or protected asset URL. The backend email/access flow must provide the full field guide through a secure inline access page after confirmation.
7. The existing Book my Free Berlin Walking Tour CTA remains below the gate as a secondary action. It keeps the story's existing `closing_cta` tracking and exact tour framing.

## Locked backend values

The frontend defaults are overridable on the custom element so a Wix embed can update a registry version without editing the story runtime.

| Field | Default |
| --- | --- |
| `assetId` | `berlin-history-field-card` |
| `consentVersion` | `berlin-history-field-card-v1-2026-09-02` |
| `experiment` | `berlin_history_field_card_v1` |
| `variant` | `single` |
| `placement` | `history_story_epilogue` |
| endpoint | `https://app.berlinwalk.com/api/download-lead` |

Optional host attributes:

```html
<bw-berlin-history-story
  lead-api-base="https://app.berlinwalk.com/api/download-lead"
  lead-asset-id="berlin-history-field-card"
  lead-consent-version="berlin-history-field-card-v1-2026-09-02"
  lead-experiment="berlin_history_field_card_v1"
  lead-variant="single"
  lead-placement="history_story_epilogue"
  lead-privacy-url="https://www.berlinwalk.com/privacy-policy">
</bw-berlin-history-story>
```

`assetVersion` remains server-owned. It is deliberately not sent by the frontend.

## Submit contract

`POST <lead-api-base>?action=submit` receives the generic fields below:

```json
{
  "assetId": "berlin-history-field-card",
  "email": "visitor@example.com",
  "consent": true,
  "consentVersion": "berlin-history-field-card-v1-2026-09-02",
  "pagePath": "/berlin-history-story",
  "sourceSlug": "berlin-history-story",
  "referrer": "/some-page",
  "experiment": "",
  "variant": "",
  "placement": "history_story_epilogue",
  "acquisitionCohort": "",
  "analyticsConsentAtSubmit": false,
  "screenWidth": 390,
  "utm": { "source": "", "medium": "", "campaign": "", "content": "", "term": "" },
  "startedAt": "2026-09-02T10:00:00.000Z",
  "submittedAt": "2026-09-02T10:00:03.000Z",
  "idempotencyKey": "bwhistory_example_key",
  "qa": false,
  "website": ""
}
```

The client intentionally sends no `assetVersion`, `arrivalDate`, `arrivalTiming`, name, phone or other visitor profile fields. The backend remains authoritative for email validation, consent-version matching, timing, idempotency, DOI state and delivery.

When analytics consent is unavailable or false, `experiment`, `variant`, `acquisitionCohort` and every UTM value remain empty. `sourceSlug`, `pagePath` and `placement` remain functional attribution fields so the DOI request still works. Analytics events are consent-gated separately.

The generic endpoint may return `202 {"ok":true,"status":"accepted"}` without revealing delivery state. The UI therefore says to check the inbox and confirm the email. It must not claim access before DOI.

## Secure delivery handoff

The backend registry for this asset must include the four field-card content and a secure inline access-page delivery mode. After DOI, the existing generic confirmation/access flow should issue a secure access-page link or protected inline page. The frontend only handles the initial request and does not call `action=asset`, build a token URL, store a token, or render protected content before DOI.

If the backend later exposes an adapter-specific response, `window.BW_HISTORY_STORY_LEAD_ADAPTER` can implement `submit(payload)` and `event(payload)`. Each method receives `{ endpoint, payload, element }`; `submit` may return a native `Response` or a response-like object. The adapter must preserve the same privacy and DOI boundary.

## Measurement handoff

When analytics consent is true, the frontend sends the generic `action=event` endpoint without email or other PII. It uses these allowlisted event names:

- `bw_lead_asset_gate_view` after the gate has stayed at least 50% visible for 2 seconds
- `bw_lead_asset_gate_seen` on first form focus
- `bw_lead_asset_form_start` on first form input
- `bw_lead_asset_submit` after an accepted submit response

QA mode suppresses lead submit/event network calls. Production analytics remains consent-gated by `consentPolicyManager`.
