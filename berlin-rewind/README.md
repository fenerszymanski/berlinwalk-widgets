# Berlin Rewind

Daily Berlin photo guesser with Berlin-local day rollover, streaks, share card,
and archival credits.

## Local preview

```bash
open "http://127.0.0.1:8765/berlin-rewind/?tracking=off"
open "http://127.0.0.1:8765/berlin-rewind-page/"
```

Use `?tracking=local` only when intentionally testing the local Content App
endpoint.

## Data files

- `data/photos.json` — curated photo pool with year, district, story, and credit
- `data/schedule.json` — day-to-photo mapping plus teaser copy
- `data/districts.json` — district labels and adjacency scoring map

## Notes

- Public photo sources are Wikimedia Commons / Bundesarchiv and keep visible
  credit lines in the UI.
- The shared day rollover, streak, countdown, and schedule helpers live in
  `../js/bw-daily.js`.
