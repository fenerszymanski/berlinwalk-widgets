# Google Search landing

`<bw-google-landing>` is the compact paid-search landing experience for
`/book-berlin-walking-tour`.

It:

- changes the H1 from the existing Google Ads `utm_content` value;
- loads live Wix Bookings availability from the shared availability endpoint;
- carries UTM, `gclid`, `gbraid`, and `wbraid` values into `/booking-form`;
- sends the existing first-party `bw_booking_*` funnel events;
- keeps the service booking form and confirmation flow unchanged.

Headline mapping:

- `utm_content=free_tour` → `Free Berlin Walking Tour in English`
- `utm_content=english_tour` → `English Walking Tour in Berlin`

Preview:

```text
/google-landing/?utm_source=google&utm_medium=paid_search&utm_campaign=bw_booking_search_test_jul2026&utm_content=free_tour
```

The Wix loader should be route-guarded to the exact parent path
`/book-berlin-walking-tour`. The dynamic service detail URL remains untouched.
