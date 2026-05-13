# Send booking confirmation email
**Trigger timing:** Immediately after booking (Wix Bookings → Session booked)
**Wix action ID:** 70c6b9f8-40bc-4984-bc08-efcf8a976c47 (root) · **messageId:** 46b82f1f-d073-4904-af14-bc5c3adafc3e

## Subject line
Your Berlin walking tour is booked for {{sessionDate}}

## Preview text
Meeting point, what to expect, and how the tip-based model works.

## Body
Hi {{firstName}},

Your spot is reserved. I'll see you on {{sessionDate}} at {{sessionTime}} for the Berlin Free Walking Tour.

**Where to meet me**

The Weltzeituhr (World Clock) at Alexanderplatz. It's the large rotating clock with city names on it, in the middle of the square. I'll be the one holding a green umbrella, so I'm easy to spot.

Please arrive about 5 minutes early so we can start on time. Nearest transit: Alexanderplatz station (U2, U5, U8, S5, S7, S75).

**How the tip-based model works**

The tour itself is free to join. There's nothing to pay upfront and nothing to pay if you don't enjoy it. At the end, if the tour was worth your time, you tip what feels fair. Most guests tip between €5 and €20 per person, but it's entirely up to you. I keep the tour free so anyone visiting Berlin can join, regardless of budget.

**What to expect**

We'll walk about 3 kilometres at a comfortable pace over roughly 2 hours, covering 12 stops through Berlin's historic centre, from Alexanderplatz down to Museum Island and finishing at Hackescher Markt. The tour runs outdoors only (no museum entries). It runs rain or shine. I'd only cancel for severe weather, and you'd hear from me by email if that happens.

Bring comfortable shoes, a water bottle, and your curiosity. More practical details coming in the emails ahead.

If anything comes up, message me on WhatsApp ([+49 152 28483662](https://wa.me/4915228483662)) or email [info@yusufucuz.com](mailto:info@yusufucuz.com). I read every message.

See you soon,
Yusuf

## CTA buttons
1. **View or change my booking** → https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based
2. **Message me on WhatsApp** → https://wa.me/4915228483662

## Notes for Yusuf
- Maps to Wix Automation Step 1 (ACTION: Send booking confirmation email, immediate)
- If Wix Bookings exposes an "Add to calendar" merge tag, swap the primary CTA for that and move the booking-management link to secondary
- {{firstName}}: Wix Bookings field may be `contact.name.first` (matches the pattern used in your Berlin Essentials automation)
- {{sessionDate}}, {{sessionTime}}: map to the Wix Bookings session date/time variables in the dropdown
