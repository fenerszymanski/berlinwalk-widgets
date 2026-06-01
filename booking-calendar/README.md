# BerlinWalk Booking Calendar

Reusable compact booking calendar for BerlinWalk paid booking pages and Wix custom Booking Calendar pages.

## Local preview

Open:

```text
http://127.0.0.1:4177/calendar
```

The local preview uses demo slots.

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
- `cta-label`: CTA copy.
- `demo`: use generated demo availability.

Slot JSON format:

```json
[
  {
    "id": "slot-or-event-id",
    "eventId": "optional-event-id",
    "serviceId": "448872c2-4bd8-4f15-8030-594f5b2162c7",
    "startDate": "2026-06-02T09:30:00.000Z",
    "endDate": "2026-06-02T11:30:00.000Z",
    "timezone": "Europe/Berlin",
    "openSpots": 8
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
5. Query real availability. The scaffold follows Wix's custom calendar article with `availabilityCalendar.queryAvailability()`, but Wix's newer Time Slots V2 docs say Availability Calendar is being replaced. If that call is unavailable on the live site, replace `loadSlots()` with Time Slots V2, likely List Event Time Slots for the BerlinWalk group tour.
6. Pass normalized slots to the custom element with `setAttribute('availability-json', JSON.stringify(slots))`.
7. On `bw-booking-calendar-continue`, route to the Wix Booking Form with selected slot defaults.

This keeps Wix's Booking Form, confirmation page, calendar sync, and automations intact while replacing the heavy native calendar UI.
