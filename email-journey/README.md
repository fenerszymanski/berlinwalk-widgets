# Berlin Free Walking Tour - 7-Email Booking Journey

Draft content for the 7-email post-booking sequence that fires from the Wix Automation **"Berlin Free Walking Tour - 7-Email Journey"** (Wix Bookings → Session booked). Each `.md` file in this folder is one email, ready to paste into its corresponding step in the Wix Automation editor.

The voice is first-person (Yusuf), atmospheric, and tip-based-friendly. No em dashes, no marketing fluff. Most emails are 150-300 words; E1 is longer because it has to do confirmation work.

## File → Automation step → timing

| File | Wix step (action name) | Trigger timing |
| --- | --- | --- |
| [e1-booking-confirmation.md](e1-booking-confirmation.md) | Send booking confirmation email | Immediately on booking |
| [e2-berlin-adventure-prep.md](e2-berlin-adventure-prep.md) | Send Berlin adventure preparation email | 14 days before session |
| [e3-tour-stops-educational.md](e3-tour-stops-educational.md) | Send tour stops educational email | 10 days before session |
| [e4-what-to-wear-and-pack.md](e4-what-to-wear-and-pack.md) | Send what to wear and pack email | 7 days before session |
| [e5-day-before-reminder.md](e5-day-before-reminder.md) | Send day-before reminder email | 1 day before session **(inferred)** |
| [e6-tour-day-morning.md](e6-tour-day-morning.md) | Send tour day morning email | Tour day, ~3-4 hours before **(inferred)** |
| [e7-post-tour-review-request.md](e7-post-tour-review-request.md) | Send post-tour review request | 1 day after session **(inferred)** |

Steps 5-7 are inferred from the visible 4 in your screenshot plus standard booking-journey conventions. Confirm or correct the names and delays in the Wix editor before you paste.

## Paste instructions

1. Open the Wix Automation in the editor: **Dashboard → Automations → "Berlin Free Walking Tour - 7-Email Journey" → Edit**.
2. Click the first email step. The right-hand panel shows **Subject**, **Preview text**, and the email body editor.
3. From `e1-booking-confirmation.md`:
   - Copy the **Subject line** value into the Subject field.
   - Copy the **Preview text** into the preview/preheader field.
   - Replace the body with the markdown under **Body**. Wix's editor supports rich text; paste in blocks and reapply bold/links as needed.
   - For each `{{firstName}}`, `{{sessionDate}}`, `{{sessionTime}}` token, use Wix's **Add personalization** dropdown and pick the matching Bookings variable. Delete the `{{...}}` placeholder once the real variable is inserted.
   - Add the **CTA buttons** as buttons in the body, using the URLs listed.
4. Repeat for e2 through e7 in their corresponding steps.
5. Save each step. When all 7 are pasted, click **Activate** at the top of the automation.

## Short-notice bookings

If a guest books closer than 14 days before the session, Wix should automatically skip past delays that have already passed and only run the upcoming steps. **Confirm this behaviour in the Automation settings before activating.** In particular, a guest who books 5 days out should still receive E1 immediately and then E4 (7-day) might be skipped while E5/E6/E7 run normally. Test with a real booking dated 3-5 days out before relying on it.

## Voice and content rules (for any future edits)

- First-person singular: "I" (Yusuf), "my tour"
- Atmospheric, historically grounded, not pushy
- **No em dashes anywhere.** Use commas, periods, or parentheses.
- Cut "we hope you're excited" and similar marketing filler
- Length targets: E1 ~250-350 words, E2 ~180-220, E3 ~220-280, E4 ~180-220, E5 ~120-160, E6 ~60-100, E7 ~180-240

## Tour facts (canonical, do not contradict)

- 12 stops: World Clock at Alexanderplatz → TV Tower → Rotes Rathaus → Neptun Brunnen → St. Mary's Church → Marx-Engels Forum → Humboldt Forum → Lustgarten → Berliner Dom → Altes Museum → Neues Museum & Alte Nationalgalerie → Hackescher Markt
- ~2 hours, ~3 km, comfortable pace, outdoor only
- English, tip-based (most tip €5-20 per person)
- Year-round: 11:30 Tue-Sat. Summer peak July 3 – Sept 30, 2026: adds 15:30 Tue-Sat.
- Meeting point: Weltzeituhr (World Clock) at Alexanderplatz. Green umbrella. Arrive 5 minutes early.
- End: Hackescher Markt
- Rain or shine, canceled only in severe weather

## Open questions for Yusuf

Resolve these before pasting:

1. **Steps 5-7 actual names and delays.** The screenshot only showed the first 4 of 7. Are E5 (day-before), E6 (tour-day morning), E7 (1 day after) correct, or do the real steps differ? If different, rename the files or adjust the bodies.
2. **`{{firstName}}` merge tag in Wix Bookings.** Wix may only expose `{{contact.name.first}}` or a full-name field. The Berlin Essentials automation already uses `{{var("contact.name.first")}}`, so that's the likely match. Confirm in the personalization dropdown.
3. **E6 exact trigger offset.** Hours before session, or fixed morning-of time? Pick what reads warmest given when most bookings happen.
4. **E7 review-first vs Instagram-first.** Default is review first, IG second. Flip if you'd rather lead with the broader funnel.
5. **E5 map link.** The placeholder uses a generic Google Maps query. Replace with your preferred deep link (Apple Maps, exact place_id, or your own meeting-point landing page).
6. **No-show handling for E7.** Wix Bookings exposes attendance. Worth adding a condition so E7 only fires for guests who actually attended.

## Wix MCP discovery (Phase 1) findings

- **Wix Automations V2 REST API can read automation flow structure** (`GET /v2/automations/{id}`, `POST /v2/automations/query`). Trigger, actions, delays, and step IDs are exposed.
- **Wix Automations V2 REST API can update automations** via `PATCH /v2/automations/{automation.id}`.
- **However, the specific automation referenced in the task (partial ID `01909883-fa76-4cb3-b0d3-...`) was not returned by any of these queries:** filter by booking trigger appId, filter by `origin: USER`, or filter by `status: INACTIVE`. The query API only accepts `ACTIVE` or `INACTIVE` for status; pure DRAFT automations may not be exposed.
- **Email message bodies live in a separate "triggered emails" service**, referenced from the action's `inputMapping.messageId`. So even if MCP could reach the automation, editing the email body content would require a separate triggered-emails API. Pasting via the Wix editor remains the right path for this task.

## Repo

This folder lives in `berlinwalk-widgets` (repo: `fenerszymanski/berlinwalk-widgets`). Markdown is the source of truth. If the email content changes after paste, update the file here too so future-you isn't reverse-engineering from Wix.
