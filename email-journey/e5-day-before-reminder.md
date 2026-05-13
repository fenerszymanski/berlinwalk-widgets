# Send day-before reminder email
**Trigger timing:** 1 day before session (INFERRED, Yusuf to confirm)

## Subject line
Tomorrow at {{sessionTime}}: World Clock, Alexanderplatz

## Preview text
Quick reminder, weather check, and the meeting point map.

## Body
Hi {{firstName}},

Quick note: I'll see you tomorrow at {{sessionTime}} at the Weltzeituhr (World Clock) on Alexanderplatz. Look for the green umbrella.

Worth a glance before you head out:

- Check tomorrow's Berlin forecast and dress for it. The tour runs rain or shine.
- Comfortable shoes (some cobblestones along the route).
- Bring water, phone, and a little cash for the tip jar if you'd like to.
- Arrive about 5 minutes early so we can start on time.

Last-minute questions, ask me on WhatsApp: [+49 152 28483662](https://wa.me/4915228483662).

See you tomorrow,
Yusuf

## CTA buttons
1. **Open meeting point in Maps** → https://maps.app.goo.gl/?q=Weltzeituhr+Alexanderplatz+Berlin
2. **WhatsApp me** → https://wa.me/4915228483662

## Notes for Yusuf
- Maps to Wix Automation Step (likely) 9 (ACTION: Day-before reminder, 1 day before). INFERRED. Verify the step exists and its actual delay.
- Confirm a working Google Maps deep link for the World Clock, or replace the first CTA URL with one you trust. The placeholder above is a generic query; if Wix prefers an exact `place_id` link, swap it in.
