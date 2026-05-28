# Berlin First-Day Planner Velo Source

This folder is the source handoff for the V3 lead gate and 4-email funnel.

## Files

- `http-functions.js` - add/merge into the live Wix backend `http-functions.js`.
- `firstDayPlannerFunnel.js` - add as a new backend file.
- `jobs.config` - add/merge into the backend scheduled jobs config.
- `routers.js` - optional Velo code-router fallback for a server-side `/book` redirect.

## Endpoint

Public endpoint after publish:

```text
POST https://www.berlinwalk.com/_functions/firstDayPlannerLead
```

The widget sends JSON with email, consent, arrival date, selected answers, weather summary, requested action, source, and page URL. The HTTP function returns CORS headers so the GitHub Pages iframe can call it.

## `/book` short URL

Best live setup: in Wix Dashboard, use URL Redirect Manager and create a single 301 redirect:

```text
/book
```

to:

```text
/book-berlin-walking-tour/berlin-free-walking-tour-tip-based?utm_source=short_url&utm_medium=pdf_print&utm_campaign=berlin_first_day_planner&utm_content=book
```

Fallback if the redirect manager is not available: add a Velo code router with prefix `book`, then paste `routers.js` into the backend `routers.js` file and publish. The router returns a 301 via `wix-router.redirect()`.

Note: a Wix Custom Embed named `BerlinWalk Book Shortlink Redirect` was tested, but Wix does not execute site custom code on its generated 404 response. It is not sufficient by itself while `/book` is still a 404.

## Wix Data Collection

Create a Wix Data collection with ID:

```text
FirstDayPlannerLeads
```

Recommended permissions: backend/admin writes only; no public read. Fields:

| Field key | Type | Notes |
|---|---|---|
| `leadKey` | Text | Unique logical key: `email|arrivalDate` |
| `email` | Text | Normalized lowercase email |
| `contactId` | Text | Wix Contacts contact ID |
| `arrivalDate` | Text | `YYYY-MM-DD`; text keeps `.between()` lexical filtering safe |
| `arrivalTime` | Text | User-facing selected label |
| `startPoint` | Text | User-facing selected label |
| `energy` | Text | User-facing selected label |
| `priority` | Text | User-facing selected label |
| `luggage` | Text | User-facing selected label |
| `planTitle` | Text | Result title |
| `ticket` | Text | Ticket chip |
| `tourFit` | Text | Tour-fit chip |
| `weatherMode` | Text | Live forecast / monthly average / fallback |
| `weatherTitle` | Text | Weather summary title |
| `requestedAction` | Text | `pdf` or `print` |
| `source` | Text | `tool` or `blog` context |
| `page` | Text | Calling page URL |
| `consent` | Boolean | Must be true |
| `createdAt` | Date/Time | First signup time |
| `lastSignupAt` | Date/Time | Latest signup/update time |
| `updatedAt` | Date/Time | Last record update |
| `sentMinus3At` | Date/Time | Email stage sent timestamp |
| `sentMinus2At` | Date/Time | Email stage sent timestamp |
| `sentMinus1At` | Date/Time | Email stage sent timestamp |
| `sentDayOfAt` | Date/Time | Email stage sent timestamp |
| `minus3Error` | Text | Last send error |
| `minus2Error` | Text | Last send error |
| `minus1Error` | Text | Last send error |
| `dayOfError` | Text | Last send error |

## Triggered Emails

Create four Wix Triggered Email templates manually in the editor. Then replace these placeholders in `firstDayPlannerFunnel.js`:

```js
TODO_FIRST_DAY_PLANNER_MINUS_3
TODO_FIRST_DAY_PLANNER_MINUS_2
TODO_FIRST_DAY_PLANNER_MINUS_1
TODO_FIRST_DAY_PLANNER_DAY_OF
```

Use these variables in the templates:

- `stage`
- `arrivalDate`
- `planTitle`
- `ticket`
- `tourFit`
- `weatherTitle`
- `startPoint`
- `bookingUrl`
- `meetingPointUrl`
- `ticketCalculatorUrl`
- `whatsOpenUrl`
- `berlinThreeDaysUrl`

The booking variable should render as:

```text
https://www.berlinwalk.com/book
```

## Schedule

`jobs.config` runs the funnel once per hour. Wix job schedules use UTC, but the function calculates due dates in Berlin time.

Email stages:

- `arrivalDate - 3`: prep, ticket, luggage, first-day setup.
- `arrivalDate - 2`: opening-day logic, Sunday/Monday traps, central plan.
- `arrivalDate - 1`: weather, packing, meeting-point reminder.
- `arrivalDate`: welcome to Berlin and final booking CTA.

Past stages are skipped because each stage only sends when its due date equals the current Berlin date. The day-of email is skipped after 18:00 Berlin time.

## Deployment checklist

1. Create `FirstDayPlannerLeads`.
2. Add `firstDayPlannerFunnel.js`.
3. Merge `http-functions.js` exports into the existing backend `http-functions.js`.
4. Create the four Triggered Emails and paste the email copy from `../email/`.
5. Replace the four message ID placeholders.
6. Merge `jobs.config`.
7. Publish the Wix site.
8. Create the `/book` redirect through URL Redirect Manager, or configure the Velo `book` code router.
9. Test `POST /_functions/firstDayPlannerLead` with a real email you control.
