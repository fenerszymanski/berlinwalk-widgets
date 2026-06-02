# BerlinWalk Booking Calendar

Reusable compact booking calendar for BerlinWalk paid booking pages and Wix custom Booking Calendar pages.

## Local preview

Open:

```text
http://127.0.0.1:4177/calendar
```

The local preview loads live Wix availability through the local dashboard server.
If live availability fails, demo mode is shown as a fallback.

## Custom Element

Tag:

```html
<bw-booking-calendar></bw-booking-calendar>
```

Script after GitHub Pages deploy:

```html
<script src="https://fenerszymanski.github.io/berlinwalk-widgets/booking-calendar/booking-calendar-element.js"></script>
```

Useful attributes:

- `availability-json`: JSON array of available slots.
- `availability-endpoint`: optional public endpoint that returns `{ slots: [...] }`. If omitted and `availability-json` is not set, the element loads BerlinWalk live availability from `https://berlinwalk-content-app.vercel.app/api/booking-calendar-availability`.
- `availability-days`: optional future availability window for the endpoint, default `365`.
- `service-id`: optional Wix Bookings service ID override for the endpoint.
- `booking-url`: fallback booking URL.
- `service-title`: visible heading.
- `demo-days`: demo-only future date window, default `180`, capped at `365`.
- `cta-label`: CTA copy. Recommended: `Reserve your spot`.
- `demo`: use generated demo availability.

Slot JSON format:

```json
[
  {
    "id": "slot-or-event-id",
    "eventId": "optional-event-id",
    "sessionId": "class-session-id-for-booking-form",
    "serviceId": "448872c2-4bd8-4f15-8030-594f5b2162c7",
    "startDate": "2026-06-03T11:30:00",
    "endDate": "2026-06-03T13:30:00",
    "timezone": "Europe/Berlin",
    "openSpots": 8,
    "locationName": "Alexanderplatz",
    "locationAddress": "Weltzeituhr, Alexanderplatz, Berlin, Germany"
  }
]
```

Events:

- `bw-booking-calendar-change`: fires when date, slot, or guest count changes.
- `bw-booking-calendar-continue`: fires when the CTA is clicked. `event.detail` includes `{ slot, guests, href, date, time }`.

## Wix integration direction

Use Wix's custom Booking Calendar page flow:

1. Replace the native Booking Calendar page with a custom page.
2. Add one Custom Element with ID `#bwBookingCalendar`.
3. Set tag name `bw-booking-calendar`.
4. If Wix page code is available, `velo/custom-booking-calendar-page.js` remains a page-code starting point.
5. If Wix page code is not available, no page code is required: the element auto-loads sanitized live slots from the Content Studio endpoint.
6. Query real availability through the Content Studio endpoint. It uses Wix Bookings Availability Calendar `Query Availability` because the native Booking Form needs the real class `slot.sessionId`; Time Slots V2 returns an `eventId`, which is not the same value and can confuse the Booking Form.
7. On `Reserve your spot`, route to the Wix Booking Form with only supported booking defaults: `bookings_sessionId`, `bookings_timezone`, `bookings_serviceId`, optional `bookings_locationId`, and UTM parameters. Attendee count stays on the native Wix form because Wix's shareable Booking Form URL does not support a reliable attendee-count prefill.

This keeps Wix's Booking Form, confirmation page, calendar sync, and automations intact while replacing the heavy native calendar UI.

## Local live availability probe

From the root workspace:

```bash
source scripts/load-api-keys.sh
node scripts/booking-calendar-availability-probe.mjs --start 2026-06-02 --days 365
```

The probe calls the same availability endpoint shape and prints a concise summary plus sample normalized slots. It does not print API keys.
