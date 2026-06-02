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
- `booking-url`: fallback booking URL.
- `service-title`: visible heading.
- `default-guests`: starting guest count.
- `max-guests`: maximum guest count.
- `demo-days`: demo-only future date window, default `180`, capped at `365`.
- `cta-label`: CTA copy.
- `demo`: use generated demo availability.

Slot JSON format:

```json
[
  {
    "id": "slot-or-event-id",
    "eventId": "optional-event-id",
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
4. Use `velo/custom-booking-calendar-page.js` as the page-code starting point.
5. Add `velo/backend/bookingCalendarAvailability.jsw` as a Wix backend module.
6. Add a Wix Secret named `berlinwalk-wix-api-key` with the Wix API key value.
7. Query real availability through Wix Bookings Time Slots V2 `List Event Time Slots`. This was live-tested on 2026-06-02 for the Berlin Free Walking Tour service and returned bookable class sessions, event IDs, capacity, location, and resource data. The scaffold requests 365 days; Wix only returns slots that are actually bookable in the configured service window.
8. Pass normalized slots to the custom element with `setAttribute('availability-json', JSON.stringify(slots))`.
9. On `bw-booking-calendar-continue`, route to the Wix Booking Form with selected slot defaults.

This keeps Wix's Booking Form, confirmation page, calendar sync, and automations intact while replacing the heavy native calendar UI.

## Local live availability probe

From the root workspace:

```bash
source scripts/load-api-keys.sh
node scripts/booking-calendar-availability-probe.mjs --start 2026-06-02 --days 365
```

The probe calls the same Time Slots V2 endpoint and prints a concise summary plus sample normalized slots. It does not print API keys.
