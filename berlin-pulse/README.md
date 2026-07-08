# Berlin Pulse

Daily Berlin mood prediction widget for `/games/berlin-pulse`.

## Files

- `berlin-pulse-element.js` - playable custom element (`<bw-berlin-pulse>`)
- `data/daily-pulses.json` - rotating daily prompt bank, evaluated with Europe/Berlin day rollover
- `assets/social/berlin-pulse-social-1200x630.jpg` - social/card cover
- `assets/source/` - internal source image and prompt notes

## Tracking

The widget posts `bw_pulse_*` events to `/api/tp-event`, which routes to the Wix CMS collection `BerlinPulseEvents`.

Main events:

- `bw_pulse_page_view`
- `bw_pulse_start`
- `bw_pulse_pick`
- `bw_pulse_complete`
- `bw_pulse_share`
- `bw_pulse_booking_click`
