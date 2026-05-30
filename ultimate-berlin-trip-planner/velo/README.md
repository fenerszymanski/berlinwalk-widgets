# Ultimate Berlin Trip Planner Velo Source

Source handoff for the widget lead gate and booking-aware arrival sequence.

## Files

- `http-functions.js` - merge into live Wix `Backend/http-functions.js`.
- `tripPlannerFunnel.js` - add as `Backend/tripPlannerFunnel.js`.
- `jobs.config` - merge into backend scheduled jobs config.

## Endpoints

Public endpoint after publish:

```text
POST https://www.berlinwalk.com/_functions/tripPlannerLead
```

The widget sends email, consent, arrival date, trip length, trip profile, plan title,
recommended tour day, ticket note, weather summary, source, and page URL.

Booking-aware helper endpoint:

```text
POST https://www.berlinwalk.com/_functions/tripPlannerBooking
```

This marks matching leads as booked. A future Wix Booking automation can call it
with at least:

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
| `pace` | Text | User-facing label |
| `tourIntent` | Text | User-facing label |
| `planTitle` | Text | Result title |
| `recommendedTourDay` | Text | Tour-fit recommendation |
| `ticket` | Text | Ticket chip |
| `weatherTitle` | Text | Weather summary title |
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

Create these Wix Triggered Email templates manually, then replace placeholders in
`tripPlannerFunnel.js`:

Sales path:

```js
TODO_TRIP_PLANNER_INSTANT
TODO_TRIP_PLANNER_MINUS_7
TODO_TRIP_PLANNER_MINUS_3
TODO_TRIP_PLANNER_MINUS_1
TODO_TRIP_PLANNER_DAY_OF
```

Booked/prep path:

```js
TODO_TRIP_PLANNER_INSTANT_BOOKED
TODO_TRIP_PLANNER_MINUS_7_BOOKED
TODO_TRIP_PLANNER_MINUS_3_BOOKED
TODO_TRIP_PLANNER_MINUS_1_BOOKED
TODO_TRIP_PLANNER_DAY_OF_BOOKED
```

If a booked-path ID is missing, that booked-path stage is skipped rather than
sending a sales email.

Available variables:

- `${stage}`
- `${isBooked}`
- `${arrivalDate}`
- `${tripLength}`
- `${planTitle}`
- `${recommendedTourDay}`
- `${ticket}`
- `${weatherTitle}`
- `${arrivalTime}`
- `${arrivalPoint}`
- `${stayArea}`
- `${groupType}`
- `${interests}`
- `${pace}`
- `${tourIntent}`
- `${bookingStatus}`
- `${tourDate}`
- `${bookingUrl}`
- `${meetingPointUrl}`
- `${firstDayPlannerUrl}`
- `${ticketCalculatorUrl}`
- `${whatsOpenUrl}`
- `${dailyBudgetUrl}`

## Schedule

`jobs.config` runs the funnel once per hour. Wix cron is UTC; the backend
calculates due dates in Berlin time.

Email stages:

- instant: send the saved plan immediately after lead submit.
- arrivalDate - 7: trip shape, tour timing, first high-intent CTA.
- arrivalDate - 3: first-day logistics, tickets, Sunday/Monday traps.
- arrivalDate - 1: weather, packing, meeting point.
- arrival day: welcome, final booking or booked-guest prep.

The day-of email is skipped after 18:00 Berlin time.

## Deployment checklist

1. Create `TripPlannerLeads`.
2. Add `tripPlannerFunnel.js`.
3. Merge `http-functions.js` exports into live `Backend/http-functions.js`.
4. Create Triggered Emails from `../email/`.
5. Replace message ID placeholders.
6. Merge `jobs.config`.
7. Publish Wix.
8. Test `POST /_functions/tripPlannerLead` with a real email.
9. Test `POST /_functions/tripPlannerBooking` with the same email and confirm future stage selection switches to booked/prep.
