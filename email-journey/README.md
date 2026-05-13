# Berlin Free Walking Tour - 7-Email Booking Journey

Draft content for the 7-email post-booking sequence that fires from the Wix Automation **"Berlin Free Walking Tour - 7-Email Journey"** (Wix Bookings → Session booked, filtered to service `448872c2-...`). Each `.md` file in this folder is one email, ready to paste into its corresponding step in the Wix Automation editor.

The voice is first-person (Yusuf), atmospheric, and tip-based-friendly. No em dashes, no marketing fluff. Most emails are 150-300 words; E1 is longer because it has to do confirmation work.

## New cadence (13-step alternation)

7 emails + 6 delays in a clean E→D→E→D→...→E sequence. Two relative delays right after booking (capturing excitement), then session-relative delays for everything else.

| Step | File | Action displayName | Timing | Wix action ID · messageId |
| --- | --- | --- | --- | --- |
| 1 | [e1-booking-confirmation.md](e1-booking-confirmation.md) | Send booking confirmation email | Immediately on booking | `70c6b9f8-...` · `46b82f1f-...` |
| 2 | (delay) | Wait 6 hours after booking | +6 h (relative) | `936e2c73-...` |
| 3 | [e2-berlin-adventure-prep.md](e2-berlin-adventure-prep.md) | Send Berlin adventure preparation email | After step 2 | `b039a2ee-...` · `be36ef13-...` |
| 4 | (delay) | Wait 24 hours after booking | +24 h (relative) | `66d26935-...` |
| 5 | [e3-tour-stops-educational.md](e3-tour-stops-educational.md) | Send tour stops educational email | After step 4 | `148eae73-...` · `784e453d-...` |
| 6 | (delay) | Wait until 3 days before session | start_date - 3 d | `a78f8afd-...` |
| 7 | [e4-what-to-wear-and-pack.md](e4-what-to-wear-and-pack.md) | Send what to wear and pack email | After step 6 | `9b47a97d-...` · `57ad1afd-...` |
| 8 | (delay) | Wait until 1 day before session | start_date - 1 d | `fd0be6c4-...` |
| 9 | [e5-day-before-reminder.md](e5-day-before-reminder.md) | Send day-before reminder email | After step 8 | `031efb94-...` · `bc28230c-...` |
| 10 | (delay) | Wait until 3 hours before session | start_date - 3 h | `245bfe04-...` |
| 11 | [e6-tour-day-morning.md](e6-tour-day-morning.md) | Send tour day welcome email | After step 10 | `d8385701-...` · `7c531728-...` |
| 12 | (delay) | Wait until 1 day after session | start_date + 1 d | `44bd2aed-...` |
| 13 | [e7-post-tour-review-request.md](e7-post-tour-review-request.md) | Send post-tour review request | After step 12 | `b4348c70-...` · `ef79e933-...` |

### What changed from the previous cadence

The previous structure had 7 emails between booking and the morning of the tour, all session-relative delays (14d/10d/7d/3d/1d before, then morning-of). The new structure adds **two near-booking touches** (E2 at +6 h, E3 at +24 h) and **one post-tour touch** (E7 at +1 d after session). E6 ("local insider tips") and the duplicated "final prep / day-of checklist" emails are repurposed, see the per-file Notes sections for which old Triggered Email template each new role inherits and what to rewrite in the editor.

## Wix API rewrite attempt (Phase 2)

The automation structure was rewritten in a JSON PATCH body and **validated** successfully against the Wix Automations V2 `/automations/validate` endpoint (HTTP 200, status `VALID_WITH_WARNINGS`; only warning was a pre-existing unknown variable on the day-before-reminder action, not introduced by the rewrite).

**The PATCH itself was blocked.** GET and PATCH on this specific automation return HTTP 404 from any Wix API key, despite the automation being clearly visible in your browser session. Cause: the automation has a `draftInfo: {}` field present (the Berlin Essentials automation does not), which signals draft state. The Wix REST API explicitly does not expose draft automations to API key auth, the docs even comment out "Publish draft automations" as not yet released.

So the new structure was designed, mapped, and validated, but the actual rewiring needs to happen in the Wix editor. Use the table above as the authoritative spec for what each step should look like.

### How to rewrite the structure in the editor

Each of the 6 delay tiles needs its delay value (and displayName) updated. Use the cadence table above as the source of truth, then map by action ID:

| Action ID | Old delay | New delay |
| --- | --- | --- |
| `936e2c73-...` | 14 days before session | **6 hours after previous action** (relative) |
| `66d26935-...` | 10 days before session | **24 hours after previous action** (relative) |
| `a78f8afd-...` | 3 days before session | (unchanged) 3 days before session |
| `fd0be6c4-...` | 1 day before session | (unchanged) 1 day before session |
| `245bfe04-...` | Morning of tour day | **3 hours before session** |
| `44bd2aed-...` | 7 days before session | **1 day after session** |

The 7 email tiles keep their action IDs; only their position in the flow changes (the postActionIds wiring is what gets rewired). In the editor, drag tiles to reorder so the chain follows the cadence table (E1 → 6h → E2 → 24h → E3 → 3d before → E4 → 1d before → E5 → 3h before → E6 → 1d after → E7).

For each email tile: paste subject + preview from the corresponding `.md` file, rename the action displayName to match the table, and where the role changed (E5, E6, E7), update the underlying Triggered Email template body via "Edit email" or the Email Marketing dashboard.

### Triggered Email templates needing rewrite

These three Triggered Email messages still hold content from their previous role and need new body content in the **Email Marketing → Triggered Emails** editor:

- `bc28230c-a29f-4db6-b300-60aacdea85cb` (was "final prep", now E5 day-before reminder)
- `7c531728-86a9-49f5-ab18-4f62a72f3e85` (was "day-of checklist", now E6 tour day welcome, trim to 60-100 words)
- `ef79e933-6097-42e8-8c3d-bb1657af1337` (was "local insider tips", now E7 post-tour review request)

The other four messages (`46b82f1f`, `be36ef13`, `784e453d`, `57ad1afd`) keep their role from the previous automation, so the body content updates are smaller, adjust copy to the new timing (e.g. drop "two weeks until" references in favour of "right after booking").

## Paste workflow per email

1. Open the automation in the editor: **Dashboard → Automations → "Berlin Free Walking Tour - 7-Email Journey" → Edit**.
2. Click an email step. The right-hand panel shows **Subject**, **Preview text**, and the email body editor.
3. From the corresponding `.md` file:
   - Copy the **Subject line** into the Subject field.
   - Copy the **Preview text** into the preview/preheader field.
   - For body content, **click "Edit email" on the action**. This opens the Triggered Email template editor (separate from the automation flow editor). Paste the body there.
   - For each `{{firstName}}`, `{{sessionDate}}`, `{{sessionTime}}` token, use Wix's **Add personalization** dropdown and pick the matching Bookings variable. Delete the `{{...}}` placeholder once the real variable is inserted.
   - Add the **CTA buttons** as buttons in the body, using the URLs listed.
4. Save the Triggered Email template, then go back to the automation editor.
5. Repeat for all 7 emails. Save the automation (don't activate yet).
6. When everything's confirmed correct, click **Activate**.

## Short-notice bookings

If a guest books closer than the cadence allows (e.g. 2 days before session, so the +24 h delay would push past the tour), Wix should automatically skip past delays that have already passed and only run the upcoming steps. **Confirm this behaviour in the Automation settings before activating.** Test with a real booking dated 2-3 days out before relying on it.

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

1. **`{{firstName}}` merge tag.** Wix may only expose `{{contact.name.first}}` or `{{booking_contact_first_name}}`. The existing automation already uses both (`booking_contact_first_name` on most email actions, `contact.name.first` on a couple). Pick the one Wix's personalization dropdown surfaces and use it consistently.
2. **E6 tone.** Currently 60-100 words; if you want it shorter or longer adjust the body in the .md file before pasting.
3. **No-show handling for E7.** Wix Bookings exposes attendance. Worth adding a condition node so E7 only fires for guests who actually attended.
4. **Pre-existing schema warning.** The day-before reminder action's `inputMapping.dynamicParams` references `business_contact_phone` which the trigger schema doesn't expose. Either drop that token from the template or use `business_phone` instead, both are present in other actions in the automation.

## Wix MCP findings (compact)

- **Read works for non-draft automations.** Wix API keys can `GET /v2/automations/{id}` and `POST /v2/automations/query` on any non-draft automation. Berlin Essentials (no draftInfo) returned HTTP 200. This one (with `draftInfo: {}`) returned HTTP 404 even though the browser GET shows it fine.
- **Validate works for draft structure.** The `/automations/validate` endpoint accepts an arbitrary automation body and returns structural errors/warnings without requiring the resource to exist. Useful for designing structures before the editor handoff.
- **PATCH cannot reach drafts.** Confirmed by multiple endpoint variants and auth header styles. Editor manual rewrite is the only path while the automation remains in draft state.
- **Email body content is not writable via REST.** The Triggered Emails API (referenced by action `messageId`) is not exposed for body content CRUD. Editor paste is the only path regardless.

## Repo

This folder lives in `berlinwalk-widgets` (repo: `fenerszymanski/berlinwalk-widgets`). Markdown is the source of truth for email body content. If the email content changes after paste, update the file here too so future-you isn't reverse-engineering from Wix. The automation structure spec is the cadence table above.
