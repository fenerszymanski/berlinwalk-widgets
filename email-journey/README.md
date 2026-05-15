# Berlin Free Walking Tour - 7-Email Booking Journey

Draft content for the 7-email post-booking sequence that fires from the Wix Automation **"Berlin Free Walking Tour - Smart Email Journey"** (automation ID `16a0d96d-9a1d-4107-ad5c-c3d21c6d8da1`; trigger: Wix Bookings → Session booked, filtered to service `448872c2-...`). Status: ACTIVE as of revision 7. Each `.md` file in this folder is one email, ready to paste into its corresponding Triggered Email template.

> **NOTE:** The original automation `01909883-fa76-4cb3-b0d3-a77958a020ea` was stuck in draft state (invisible to the Wix REST API) and could not be PATCHed. The structure was rebuilt as a fresh non-draft automation via Create Automation, with all 13 action IDs and 7 messageIds preserved verbatim. The old draft is still in the dashboard, **manually delete it from the editor** to avoid two automations sharing the same name. Both reference the same Triggered Email templates, so deletion is non-destructive to the email content.

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
| 13 | [e7-post-tour-review-request.md](e7-post-tour-review-request.md) | Send post-tour review request | After step 12 | `b4348c70-...` · `8a0dcaab-...` |

The short-notice branch has a separate E7 action/template: action `99e30db9-...`, messageId `22ff0a12-...`. Paste the same E7 body into both current E7 templates.

### What changed from the previous cadence

The previous structure had 7 emails between booking and the morning of the tour, all session-relative delays (14d/10d/7d/3d/1d before, then morning-of). The new structure adds **two near-booking touches** (E2 at +6 h, E3 at +24 h) and **one post-tour touch** (E7 at +1 d after session). E6 ("local insider tips") and the duplicated "final prep / day-of checklist" emails are repurposed, see the per-file Notes sections for which old Triggered Email template each new role inherits and what to rewrite in the editor.

## How the structure was built (Wix API path)

The original automation `01909883-fa76-4cb3-b0d3-a77958a020ea` was stuck in draft state. Wix REST API keys return HTTP 404 on any operation (GET / PATCH / DELETE) against a draft automation, even though the dashboard editor can see it fine. Save in the editor did not clear the draft flag; the docs note "Publish draft automations" as a not-yet-exposed feature.

**Resolution:** built a fresh non-draft automation via `POST /automations/create` (HTTP 200, revision 1), preserving all 13 action IDs, all 7 messageIds, the trigger filter (`f2ddacf8-...`, service ID `448872c2-...`), and the action chaining in the new clean cadence. Validated cleanly against `/automations/validate` first (same pre-existing `business_contact_phone` warning as before, not introduced by the rewrite).

The new automation ID is `16a0d96d-9a1d-4107-ad5c-c3d21c6d8da1`. Status is ACTIVE as of revision 7. The old draft `01909883-...` may still sit in the dashboard; delete it from the editor if it is still visible.

### Triggered Email templates needing rewrite

These three Triggered Email messages still hold content from their previous role and need new body content in the **Email Marketing → Triggered Emails** editor:

- `bc28230c-a29f-4db6-b300-60aacdea85cb` (was "final prep", now E5 day-before reminder)
- `7c531728-86a9-49f5-ab18-4f62a72f3e85` (was "day-of checklist", now E6 tour day welcome, trim to 60-100 words)
- `8a0dcaab-20da-4d7e-90cd-a83a7859af9f` (long-branch E7 post-tour review request)
- `22ff0a12-c590-43cd-b250-c83081eb2f02` (short-branch E7 post-tour review request)

The other four messages (`46b82f1f`, `be36ef13`, `784e453d`, `57ad1afd`) keep their role from the previous automation, so the body content updates are smaller, adjust copy to the new timing (e.g. drop "two weeks until" references in favour of "right after booking").

## Paste workflow per email

The flow structure is in place. You only need to author email content now.

1. **Delete the old draft automation** in the dashboard: open the original `01909883-...` automation and click delete. The new `16a0d96d-...` already references all the same Triggered Email templates, so this is non-destructive.
2. Open the new automation: **Dashboard → Automations → "Berlin Free Walking Tour - 7-Email Journey" → Edit**. Confirm the cadence matches the table above (it should, the API built it exactly).
3. For each of the 7 email steps:
   - Click the step, then **"Edit email"** to open the Triggered Email template editor.
   - Paste Subject + Preview + Body from the corresponding `.md` file.
   - For each `{{firstName}}`, `{{sessionDate}}`, `{{sessionTime}}` token, use Wix's **Add personalization** dropdown to pick the matching Bookings variable. Delete the `{{...}}` placeholder once the real variable is inserted.
   - Add the **CTA buttons** as buttons in the body, using the URLs listed.
   - Save the Triggered Email template.
4. Three Triggered Email templates inherited content from previous roles and need a full rewrite (see [Triggered Email templates needing rewrite](#triggered-email-templates-needing-rewrite) below).
5. When all 7 templates are updated, click **Activate** on the automation.

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

- **Read works for non-draft automations.** Wix API keys can `GET /automations-service/v2/automations/{id}` and `POST /automations-service/v2/automations/query` on any non-draft automation. Berlin Essentials (no draftInfo) returned HTTP 200. Draft automations return HTTP 404 even when the dashboard editor can see them.
- **Validate works for draft structure.** The `/automations/validate` endpoint accepts an arbitrary automation body and returns structural errors/warnings without requiring the resource to exist. Useful for designing structures before the editor handoff.
- **PATCH cannot reach drafts.** Confirmed by multiple endpoint variants and auth header styles. Editor manual rewrite is the only path while the automation remains in draft state.
- **Email body content is not writable via REST.** The Triggered Emails API (referenced by action `messageId`) is not exposed for body content CRUD. Editor paste is the only path regardless.
- **E7 uses two live Triggered Email templates.** Revision 7 has long-branch action `b4348c70-...` with messageId `8a0dcaab-...` and short-branch action `99e30db9-...` with messageId `22ff0a12-...`. Both actions expose `order_number` and `booking_contact_first_name` for the review URL.

## Repo

This folder lives in `berlinwalk-widgets` (repo: `fenerszymanski/berlinwalk-widgets`). Markdown is the source of truth for email body content. If the email content changes after paste, update the file here too so future-you isn't reverse-engineering from Wix. The automation structure spec is the cadence table above.
