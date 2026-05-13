# Send day-before reminder email
**Trigger timing:** 1 day before session
**Wix action ID:** 031efb94-3946-4d1c-bfee-6ad187be2142 · **messageId:** bc28230c-a29f-4db6-b300-60aacdea85cb

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
- Position 9 in the new 13-step graph (1 day before session).
- The Wix action repurposes the old "Send final preparation email" slot (action ID `031efb94-...`). Its messageId (`bc28230c-...`) still points at the old "final prep" Triggered Email template, which needs a rewrite in the editor to match the day-before tone.
- Confirm a working Google Maps deep link for the World Clock, or replace the first CTA URL with one you trust. The placeholder above is a generic query; if Wix prefers an exact `place_id` link, swap it in.
