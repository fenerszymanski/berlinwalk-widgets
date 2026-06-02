# BerlinWalk Paid Landing

Custom Element for the paid-traffic booking landing page.

## Local preview

Open:

```text
https://fenerszymanski.github.io/berlinwalk-widgets/paid-landing/
```

or locally:

```text
paid-landing/index.html
```

## Wix install

Add a Custom Element to the paid landing page.

- Tag name: `bw-paid-landing`
- Script URL:

```text
https://fenerszymanski.github.io/berlinwalk-widgets/paid-landing/paid-landing-element.js
```

For production experiments, prefer pinning the script to a commit with jsDelivr:

```text
https://cdn.jsdelivr.net/gh/fenerszymanski/berlinwalk-widgets@COMMIT_SHA/paid-landing/paid-landing-element.js
```

## Notes

- The element auto-loads `booking-calendar/booking-calendar-element.js`.
- The page should hide the normal Wix header and footer for paid traffic.
- The calendar loads live availability from the BerlinWalk Content App.
- The final CTA sends visitors to the live Wix Booking Form with `bookings_sessionId`.
