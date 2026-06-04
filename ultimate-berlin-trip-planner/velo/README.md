# Ultimate Berlin Trip Planner Velo Source

Source handoff for the widget lead gate and pre-booking planner sequence.

## Files

- `http-functions.js` - merge into live Wix `Backend/http-functions.js`.
- `tripPlannerFunnel.js` - add as `Backend/tripPlannerFunnel.js`.
- `jobs.config` - merge into backend scheduled jobs config.
- `build-velo-install-kit.mjs` - regenerates the local copy/paste install kit.
- `install-kit.html` - local admin page with copy buttons for the Velo paste
  points.

Regenerate the local install kit after changing Velo source:

```bash
node ultimate-berlin-trip-planner/velo/build-velo-install-kit.mjs
```

Then open:

```text
ultimate-berlin-trip-planner/velo/install-kit.html
```

Before pasting Velo into Wix after the 5 Triggered Email IDs are applied, run
the one-command gate:

```bash
source ../scripts/load-api-keys.sh
node ultimate-berlin-trip-planner/velo/prepublish-gate.mjs
```

It writes evidence under `output/qa/ultimate-trip-planner-prepublish-gate/` and
exits non-zero until IDs are valid/applied, no `TODO_TRIP_PLANNER_*`
placeholders remain, the endpoint/scheduler source is present, booked leads
suppress future Ultimate reminders, and the live `TripPlannerLeads` critical
fields pass.

For the optional Gemini layer, also run the local privacy/fail-soft fixture:

```bash
node ultimate-berlin-trip-planner/velo/ai-privacy-fixture.mjs
```

It executes the Velo source in a mocked Wix backend, proves `missing_api_key`
returns fail-soft, and verifies email-like text is scrubbed before Gemini prompt
assembly.

## Endpoints

Public endpoint after publish:

```text
POST https://www.berlinwalk.com/_functions/tripPlannerLead
```

The widget sends email, consent, arrival date, trip length, trip profile, plan title,
recommended tour day, ticket note, weather summary, source, and page URL.

Optional AI polish endpoint after publish:

```text
POST https://www.berlinwalk.com/_functions/tripPlannerAi
```

This endpoint adds a short "local second look" after the deterministic full plan
is unlocked. The widget sends `quotaEmail` only so the backend can enforce the
email + arrival-date Gemini limit; `quotaEmail` is not included in the
Gemini-bound prompt input. Gemini receives only sanitized trip inputs,
weather/tour-slot labels, and the already-built day skeleton. If Gemini is
unavailable, missing a key, quota-limited, or returns a bad response, the
frontend falls back calmly and the deterministic plan/PDF/print flow continues
normally.

Add the Gemini API key in Wix Secrets Manager as `GEMINI_API_KEY`. Accepted
fallback secret names are `GOOGLE_AI_API_KEY` and `GOOGLE_GEMINI_API_KEY`.
The default model is `gemini-2.5-flash`; optionally override it with
`TRIP_PLANNER_GEMINI_MODEL` or `GEMINI_MODEL`.

Booking-aware helper endpoint:

```text
POST https://www.berlinwalk.com/_functions/tripPlannerBooking
```

This marks matching leads as booked. The existing Wix Booking automation/flow
already handles booked-guest emails; this endpoint only lets Ultimate stop its
own future sales reminders. A Wix Booking automation can call it with at least:

```json
{
  "email": "guest@example.com",
  "bookingId": "wix-booking-id",
  "tourDate": "2026-06-12",
  "bookingStatus": "booked",
  "source": "wix_booking"
}
```

If `arrivalDate` is included, only that lead row is updated. Without it, all
matching rows for the email are marked booked.

After the backend is published and the Triggered Email IDs are real, use the
dry-run-first smoke helper:

```bash
node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --email you@example.com
node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --live --email you@example.com
node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --live --email you@example.com --ai-only
node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --live --email you@example.com --ai
node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --live --email you@example.com --booking
```

The first command writes the exact lead/booking payloads without touching Wix.
The `--ai-only` command tests `/_functions/tripPlannerAi` against an existing
lead without creating a new lead or sending the instant plan email. The other live commands call
`/_functions/tripPlannerLead` and, with `--ai` or `--booking`, also test
`/_functions/tripPlannerAi` or `/_functions/tripPlannerBooking`, then save the
response JSON under `output/qa/ultimate-trip-planner-live-smoke/`.

## Email Sequence Simulator

Before publishing or changing scheduler logic, use the dry-run-only simulator to
inspect the exact instant/7/3/1/day-of timeline, same-day signup skips,
booked-lead suppression, and the arrival-day before-18:00 rule. It does not
call Wix or send email.

```bash
node ultimate-berlin-trip-planner/velo/simulate-email-sequence.mjs --arrival 2026-06-12 --signup 2026-06-01
node ultimate-berlin-trip-planner/velo/simulate-email-sequence.mjs --arrival 2026-06-12 --job-date 2026-06-09 --hour 10
node ultimate-berlin-trip-planner/velo/simulate-email-sequence.mjs --arrival 2026-06-12 --signup 2026-06-01 --booked
```

Results are written under
`output/qa/ultimate-trip-planner-email-sequence/`.

## Lead Report

After launch, use the read-only lead report to see whether the planner is
creating hot/warm/booked/researching segments, which trip styles are converting,
which arrivals are inside the next 7 days, and whether any email stages have
errors. It masks emails by default and includes a stable `emailHash`.

```bash
node ultimate-berlin-trip-planner/velo/report-trip-planner-leads.mjs
source ../scripts/load-api-keys.sh
node ultimate-berlin-trip-planner/velo/report-trip-planner-leads.mjs --live --limit 200
```

Use `--include-emails` only when you need the raw address for operational
follow-up. Live mode is read-only and writes evidence under
`output/qa/ultimate-trip-planner-lead-report/`.

## Local Booking-Aware Fixture

Before touching live Wix, run the local fixture to verify sales leads, booked
lead suppression, cancelled bookings, self-reported booked suppression, and
booking-event scoping:

```bash
node ultimate-berlin-trip-planner/velo/booking-aware-fixture.mjs
```

The fixture mocks Wix Data, Contacts, and Triggered Emails locally. It writes a
JSON result under `output/qa/ultimate-trip-planner-velo/` and exits non-zero if
a booked lead receives an Ultimate scheduled reminder.

## Collection Setup Script

The collection can be prepared through the Wix Data Collections API after
loading `WIX_API_KEY` from Keychain:

```bash
source ../scripts/load-api-keys.sh
node ultimate-berlin-trip-planner/velo/create-trip-planner-leads-collection.mjs
node ultimate-berlin-trip-planner/velo/create-trip-planner-leads-collection.mjs --live
node ultimate-berlin-trip-planner/velo/create-trip-planner-leads-collection.mjs --live --sync-fields
```

The script is dry-run by default. Live mode creates `TripPlannerLeads` only if
it is missing, then verifies the expected field keys and types. Add
`--sync-fields` only when the collection already exists and the helper reports
missing fields; it creates those missing field definitions through Wix Data
`create-field`, then verifies again. The helper still keeps a `patch-field`
fallback function available for future existing-field edits, but missing-field
sync must use `create-field`.

## Wix Data Collection

Create a Wix Data collection with ID:

```text
TripPlannerLeads
```

Recommended permissions: backend/admin writes only; no public read.

Fields:

| Field key | Type | Notes |
|---|---|---|
| `leadKey` | Text | Unique logical key: `email|arrivalDate` |
| `email` | Text | Normalized lowercase email |
| `contactId` | Text | Wix Contacts contact ID |
| `arrivalDate` | Text | `YYYY-MM-DD`; text keeps lexical date filtering safe |
| `tripLength` | Number | 1-7 |
| `arrivalTime` | Text | User-facing label |
| `arrivalPoint` | Text | User-facing label |
| `stayArea` | Text | User-facing label |
| `groupType` | Text | User-facing label |
| `firstTime` | Text | User-facing label |
| `interests` | Text | Comma-separated user-facing labels |
| `budgetStyle` | Text | User-facing label |
| `mustHandle` | Text | Comma-separated user-facing labels |
| `pace` | Text | User-facing label |
| `tourIntent` | Text | User-facing label |
| `tripStyle` | Text | Visual preset label or `Custom mix` |
| `planTitle` | Text | Result title |
| `recommendedTourDay` | Text | Tour-fit recommendation |
| `recommendedTourDate` | Text | Suggested BerlinWalk tour calendar-hold date, `YYYY-MM-DD` when known |
| `recommendedTourTime` | Text | Suggested tour time window, normally `11:30-13:30` |
| `meetingPointUrl` | Text | Google Maps URL for the World Clock meeting point |
| `ticket` | Text | Ticket chip |
| `weatherTitle` | Text | Weather summary title |
| `travelMode` | Text | Near-arrival Now / Next / Later summary |
| `planHealth` | Text | BerlinWalk plan health score/check summary |
| `preArrivalChecklist` | Text | Pre-arrival action checklist summary |
| `baseBrief` | Text | Stay-area base camp summary |
| `budgetPulse` | Text | Trip spend/ticket/cash summary |
| `interestLens` | Text | Interest-to-day/anchor summary |
| `paceGuard` | Text | Pace/group realism guardrail summary |
| `weatherStrategy` | Text | Weather/opening-day strategy summary |
| `carryPack` | Text | Phone-ready exact link / map / tour / PDF action summary |
| `reservationRadar` | Text | Book/check actions that can change the trip |
| `planAdvice` | Text | Smart Fixes / trip review summary |
| `planSwaps` | Text | Smart Swaps / day-level move summary |
| `dayRhythm` | Text | Day-by-day load / move / buffer / night summary |
| `dayIntelligence` | Text | Day-by-day Route / Energy / Spend / Check summary |
| `dayOperations` | Text | Day-by-day timing windows plus start / transit / reserve / backup summary |
| `arrivalWindow` | Text | `today`, `tomorrow`, `near_forecast`, or `future_planning` |
| `tripRisk` | Text | `low`, `medium`, or `high` |
| `tourRecommendation` | Text | Primary CTA/tour recommendation label |
| `intentStage` | Text | `booked`, `researching`, or `sales_ready` |
| `familyOrSlow` | Text | `yes` or `no` |
| `bookAheadNeeded` | Text | `yes` or `no` |
| `conversionSignal` | Text | Compact tour-readiness score and next best action |
| `conversionScore` | Number | Machine-readable 0-100 conversion/prep score |
| `conversionTier` | Text | `hot_tour_lead`, `warm_tour_lead`, `researching`, or `booked_prep` |
| `conversionNextAction` | Text | Machine-readable next best action summary |
| `conversionReasons` | Text | Comma-separated score reasons |
| `source` | Text | `tool`, `blog`, or other context |
| `page` | Text | Calling page URL |
| `consent` | Boolean | Must be true |
| `createdAt` | Date/Time | First signup time |
| `lastSignupAt` | Date/Time | Latest signup/update time |
| `updatedAt` | Date/Time | Last record update |
| `sentInstantAt` | Date/Time | Email stage sent timestamp |
| `sentMinus7At` | Date/Time | Email stage sent timestamp |
| `sentMinus3At` | Date/Time | Email stage sent timestamp |
| `sentMinus1At` | Date/Time | Email stage sent timestamp |
| `sentDayOfAt` | Date/Time | Email stage sent timestamp |
| `instantError` | Text | Last send error |
| `minus7Error` | Text | Last send error |
| `minus3Error` | Text | Last send error |
| `minus1Error` | Text | Last send error |
| `dayOfError` | Text | Last send error |
| `bookedAt` | Date/Time | Set when booking is detected |
| `bookingId` | Text | Wix booking ID or external ID |
| `tourDate` | Text | Tour date from booking event |
| `bookingStatus` | Text | `booked`, `confirmed`, `cancelled`, etc. |
| `bookingSource` | Text | Source of booking marker |

## Triggered Emails

Create these Wix Triggered Email templates manually from
`../email/paste-ready/`, then replace placeholders in `tripPlannerFunnel.js`.
Regenerate the paste-ready package after copy changes with:

```bash
node ultimate-berlin-trip-planner/email/build-triggered-email-html.mjs
```

When the 5 Wix templates exist, put the message IDs or Wix editor URLs into a
local JSON file shaped like `../email/paste-ready/message-ids.template.json`,
then validate/apply them with:

```bash
node ultimate-berlin-trip-planner/velo/run-email-id-launch-gate.mjs --import-downloads
source ../scripts/load-api-keys.sh
node ultimate-berlin-trip-planner/velo/run-email-id-launch-gate.mjs --import-downloads --write
node ultimate-berlin-trip-planner/velo/import-message-ids-from-downloads.mjs
node ultimate-berlin-trip-planner/velo/import-message-ids-from-downloads.mjs --write
node ultimate-berlin-trip-planner/velo/check-triggered-email-ids.mjs --ids ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json
node ultimate-berlin-trip-planner/velo/apply-triggered-email-ids.mjs --ids ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json
node ultimate-berlin-trip-planner/velo/apply-triggered-email-ids.mjs --ids ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json --write
node ultimate-berlin-trip-planner/velo/check-triggered-email-ids.mjs --ids ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json --require-applied
```

The import helper is optional but useful when the copy kit downloads
`message-ids.local.json` to `~/Downloads`; it dry-runs first, normalizes Wix
editor URLs to message IDs, and backs up any previous local ID file before
writing.

The gate runner is the preferred fast path after the 5 IDs exist. It dry-runs
first, then with `--write` imports/applies IDs, verifies the replacement,
regenerates local launch artifacts, runs `prepublish-gate.mjs`, and runs the
launch audit. If the downloaded JSON is not in `~/Downloads`, pass
`--import-from /path/to/message-ids.local.json` or
`--downloads-dir /path/to/download-folder`.

The check helper is read-only. Use it while filling the local JSON file to catch
missing, placeholder, duplicate, or not-yet-applied IDs before publishing Velo.
The `--write` apply step creates a timestamped local backup under
`output/qa/ultimate-trip-planner-email-id-apply/` before replacing placeholders.

Planner/sales path:

```js
TODO_TRIP_PLANNER_INSTANT
TODO_TRIP_PLANNER_MINUS_7
TODO_TRIP_PLANNER_MINUS_3
TODO_TRIP_PLANNER_MINUS_1
TODO_TRIP_PLANNER_DAY_OF
```

There is no booked/prep path in Ultimate. If a booking marker or self-reported
`Already booked` intent is present, future Ultimate scheduled reminders are
suppressed and the existing booking email sequence owns meeting-point, weather,
and tour-day prep. If a later booking marker carries `bookingStatus` such as
`cancelled`, `canceled`, `refunded`, `declined`, `no_show`, or `no-show`, that
status overrides any earlier `bookedAt` value and the lead can receive
pre-booking reminders again.

Available variables:

- `${stage}`
- `${isBooked}`
- `${arrivalDate}`
- `${tripLength}`
- `${planTitle}`
- `${recommendedTourDay}`
- `${recommendedTourDate}`
- `${recommendedTourTime}`
- `${ticket}`
- `${weatherTitle}`
- `${travelMode}`
- `${planHealth}`
- `${preArrivalChecklist}`
- `${baseBrief}`
- `${budgetPulse}`
- `${interestLens}`
- `${paceGuard}`
- `${weatherStrategy}`
- `${carryPack}`
- `${reservationRadar}`
- `${planAdvice}`
- `${planSwaps}`
- `${dayRhythm}`
- `${dayIntelligence}`
- `${dayOperations}` - daily timing windows plus start / transit / reserve / backup notes
- `${arrivalWindow}`
- `${tripRisk}`
- `${tourRecommendation}`
- `${intentStage}`
- `${familyOrSlow}`
- `${bookAheadNeeded}`
- `${conversionSignal}`
- `${conversionScore}`
- `${conversionTier}`
- `${conversionNextAction}`
- `${conversionReasons}`
- `${arrivalTime}`
- `${arrivalPoint}`
- `${stayArea}`
- `${groupType}`
- `${interests}`
- `${budgetStyle}`
- `${mustHandle}`
- `${pace}`
- `${tourIntent}`
- `${tripStyle}`
- `${bookingStatus}`
- `${tourDate}`
- `${bookingUrl}`
- `${planUrl}`
- `${meetingPointUrl}`
- `${firstDayPlannerUrl}`
- `${ticketCalculatorUrl}`
- `${whatsOpenUrl}`
- `${dailyBudgetUrl}`

## Schedule

`jobs.config` runs the funnel once per hour. Wix cron is UTC; the backend
calculates due dates in Berlin time. The processor pages through all due
candidates in 100-row batches instead of only checking the first query page.

Email stages:

- instant: send the saved plan immediately after lead submit.
- arrivalDate - 7: trip shape, tour timing, first high-intent CTA.
- arrivalDate - 3: first-day logistics, tickets, Sunday/Monday traps.
- arrivalDate - 1: weather, packing, meeting point.
- arrival day: welcome and final booking link for leads who have not booked.

The day-of email is skipped after 18:00 Berlin time.

Scheduled reminder stages are also skipped on the same Berlin calendar date as
the latest signup/update. This prevents a lead who unlocks the planner exactly
7 days, 3 days, 1 day, or the morning of arrival from receiving the instant plan
and the scheduled reminder on the same day.

## Deployment checklist

1. Create `TripPlannerLeads`.
2. Add `tripPlannerFunnel.js`.
3. Merge `http-functions.js` exports into live `Backend/http-functions.js`.
4. Create the 5 Triggered Emails from `../email/`.
5. Replace message ID placeholders.
6. Merge `jobs.config`.
7. Publish Wix.
8. Test `POST /_functions/tripPlannerLead` with a real email.
9. Test `POST /_functions/tripPlannerAi` with `--ai-only` first, then optionally with `--ai`, and confirm `enhancement.routeIntro` and `enhancement.dayStories` return.
10. Test `POST /_functions/tripPlannerBooking` with the same email and confirm future Ultimate reminders are suppressed.
