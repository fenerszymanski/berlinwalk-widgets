# Send post-tour review request email
**Trigger timing:** 1 day after session
**Wix action IDs:** `b4348c70-c6d5-4ff6-a4c5-765925e7b54f` (long branch) · `99e30db9-29d9-4722-9043-6eb3620b273d` (short branch)
**Current messageIds:** `8a0dcaab-20da-4d7e-90cd-a83a7859af9f` (long branch) · `22ff0a12-c590-43cd-b250-c83081eb2f02` (short branch)

## Subject line
Thanks for walking Berlin with me

## Preview text
A quick favour, and a few things to read while Berlin's still fresh.

## Body
Hi {{firstName}},

Thanks for joining me yesterday. It was good to walk Berlin with you.

If the tour was worth your time, the most useful thing you can do for me is leave a short review. It helps future guests know what the walk is really like, and a sentence or two from you goes a long way.

[Leave a review →](https://www.berlinwalk.com/leave-review?bid=${order_number}&n=${booking_contact_first_name})

If you'd like more Berlin in your feed, I post stories, photos, and occasional bits of history from the city on Instagram: [@berlinwalkingtour](https://www.instagram.com/berlinwalkingtour).

A few reads while it's all still fresh:

- More on Berlin's history and best routes on the [blog](https://www.berlinwalk.com/blog).
- Practical guides (weather, what to pack, where to swim in summer) on the [tools page](https://www.berlinwalk.com/berlin-tools).

If Berlin ever brings you back, you're welcome on any future walk. Just book again through the site or message me directly.

Thanks again,
Yusuf

[info@yusufucuz.com](mailto:info@yusufucuz.com) · [WhatsApp](https://wa.me/4915228483662)

## CTA buttons
1. **Leave a review** → https://www.berlinwalk.com/leave-review?bid=${order_number}&n=${booking_contact_first_name}
2. **Follow on Instagram** → https://www.instagram.com/berlinwalkingtour

## Notes for Yusuf
- Position 13 in the long-path graph and the matching post-tour step in the short-path branch. Paste the same body into both current Triggered Email templates (`8a0dcaab-...` and `22ff0a12-...`).
- The previous "local insider tips" message becomes redundant in the new cadence. Either rewrite that template body, or create a fresh Triggered Email and update the action's `messageId` in the editor.
- Default order: Berlin Walk review form first, Instagram second. The review URL includes `${order_number}` and `${booking_contact_first_name}` so the form can prefill the booking reference and first name. Wix automation revision 7 exposes both variables on both E7 actions.
- Optional: add a conditional check in Wix so this email skips if the guest no-showed. Wix Bookings exposes attendance status, worth a 2-min check in the editor.
