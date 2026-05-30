# Ultimate Berlin Trip Planner Research Backlog

Research date: 2026-05-30  
Status: keep the task open; use this as the V4/V5 implementation map.

## Current Baseline

The V3 widget already has a strong deterministic core: arrival date, 1-7 day logic, weather fallback, Sunday/public-holiday/Monday warnings, BerlinWalk tour slot recommendation, email gate, PDF/print, Google Maps search links, essentials, and booking-aware Velo/email scaffolding.

The main gap is not the planning logic. The gap is perceived product depth: the screen still reads like a text-heavy questionnaire and text-heavy itinerary. Competitors create "ultimate" feeling through visual itinerary objects: maps, timelines, day color coding, export/share affordances, stateful travel mode, and confidence checks.

## Research Signals

- Map-first itinerary tools make the plan feel real. TripTop positions itself against "wall of text" planning by combining day-by-day planning, opening-hour checks, map context, and share links. Source: https://triptop.io/
- JourneyDoc and aitrips.io both use a timeline + map mental model: day-by-day timeline, live/interactive map, weather alongside activities, PDF/share/export, and "now / next" travel mode. Sources: https://www.journeydoc.com/ and https://www.aitrips.io/
- TripMapper emphasizes alternate itinerary layouts, start/end times, notes, images, budget, map view, and business details. Source: https://www.tripmapper.co/features
- AITripPlan shows a good lightweight web promise: destination/date/budget/travel-style inputs -> morning/afternoon/evening day plan -> neighborhood/travel-time/map hints -> print-ready export. Source: https://aitripplan.com/
- BerlinUnlocked's 3-day Berlin article monetizes/lead-captures with a Google Maps version. That confirms a Berlin-specific map layer is a competitive conversion asset, not a cosmetic extra. Source: https://www.berlinunlocked.de/blog/3-days-in-berlin/
- Google Maps URLs are the right low-friction layer for V1/V2: no API key needed, `api=1` required, and URLs can launch search, directions, map, or Street View cross-platform. Source: https://developers.google.com/maps/documentation/urls/get-started
- Open-Meteo supports hourly/daily forecast parameters and up to 16 forecast days with `forecast_days=16`; current near-date weather logic is directionally correct. Source: https://open-meteo.com/en/docs
- Berlin.de is the official reference for 2026/2027 Berlin public holidays; keep using official holiday dates instead of generic Germany-wide lists. Source: https://www.berlin.de/en/tourism/travel-information/1887651-2862820-public-holidays-school-holidays.en.html
- Baymard form research supports reducing visible form intimidation, avoiding confusing multi-column forms, and using inline validation that is not premature. Sources: https://baymard.com/learn/form-design and https://baymard.com/blog/inline-form-validation
- Google FAQ rich results are now limited mainly to well-known government/health sites. Visible FAQs still matter for users and AI/search understanding, but do not pitch FAQ schema as a guaranteed rich-result win. Source: https://developers.google.com/search/docs/appearance/structured-data/faqpage
- Schema.org supports `TouristTrip` / `Trip` itinerary markup, including `itinerary` and nested `ItemList` examples. Use this as an SEO understanding layer, not as a magic ranking lever. Source: https://schema.org/TouristTrip

## V4 Recommendation

Build V4 around one product idea:

> "Your Berlin trip as a visual, arrival-aware operating plan."

That means the widget should not only generate text. It should produce a visible travel document with a map spine, day cards, risk badges, and phone-ready actions.

## Priority Backlog

### P0 Before Public Launch

1. **Visual Itinerary Spine**
   - Replace the current visual board with a real "trip spine": Day 1, Day 2, Day 3 etc. as horizontal/vertical route cards.
   - Each day should show an icon, area, day theme, 2-3 anchor locations, one risk badge, and one primary action.
   - Add color-coded day accents that match day type: arrival, history/Mitte, Wall/East, museums, food, low-budget, nightlife, slow/Potsdam.
   - Keep details collapsed until needed. The first view should answer: "What does my trip look like?"

2. **Location Catalog + Stronger Maps**
   - Add a `PLACE_CATALOG` with canonical labels, Google query, optional coordinates, area, type, and short explanation.
   - Generate three link types:
     - individual place link: `maps/search/?api=1&query=...`
     - day route link: `maps/dir/?api=1&origin=...&destination=...&waypoints=...&travelmode=transit|walking`
     - meeting point link: World Clock / Alexanderplatz.
   - Use exact place names where possible: `Weltzeituhr Alexanderplatz`, `Berlin Wall Memorial Bernauer Strasse`, `Topography of Terror`, `Hackesche Höfe`, etc.
   - In the UI, label links as actions: `Open Day 2 route`, `Save World Clock`, `Open Museum Island`.

3. **Less Text, More States**
   - Convert long notes into short "risk chips":
     - Sunday shops
     - Monday museum caution
     - Public holiday
     - Rain backup
     - Book ahead
     - Family break
   - Full explanatory copy should live behind "Why this matters" or only in PDF/print.
   - Replace repeated text labels with icons + compact tooltips where the meaning is obvious.

4. **PDF V4: Real Travel Document**
   - Page 1 should be a cover/snapshot: BerlinWalk logo, trip dates, trip length, weather state, ticket start, best tour slot, and QR/link to booking.
   - Page 2+ should be day cards, one or two per page depending on text length, with stable page-break logic.
   - Add a final "Berlin Essentials" page with:
     - ticket zone rules
     - Sunday/public holiday rules
     - Monday museum warning
     - cash/card/toilets/water
     - meeting point
     - emergency/backup logic
     - BerlinWalk CTA
   - Add small QR codes or plain links for booking and meeting point if client-side QR generation is lightweight enough.
   - Keep jsPDF only if we keep tight layout controls; otherwise consider making print CSS the primary "Save as PDF" path and leaving jsPDF as secondary.

5. **Lead Gate Conversion Polish**
   - Keep the useful preview before email.
   - Make the gate feel like a delivery step, not a wall: "Send the phone-ready version + PDF."
   - Add inline positive email validation after blur, not aggressive validation while typing.
   - Add a tiny privacy reassurance beside consent: "No spam. Berlin arrival reminders only."
   - Track form step interactions and gate conversion events separately.

6. **Booking CTA Logic**
   - The CTA should adapt to the recommendation:
     - Arrival morning: `Book the 11:30 tour for arrival day`
     - Later arrival: `Book Day 2 at 11:30`
     - Already booked: `Save the World Clock meeting point`
   - The full plan should have one primary CTA near the recommended day, not only at the generic top/bottom.

### P1 After Launch

1. **Share/Resume State**
   - Encode non-email plan state into the URL so a user can return to the same plan.
   - Add `Copy plan link` and `Email me this exact plan`.
   - Do not expose email/PII in the URL.

2. **Travel Mode**
   - If arrival is today/tomorrow, show a compact `Now / Next / Later` assistant.
   - Include weather, meeting point, ticket, and "what to do if tired/raining/late" states.

3. **Itinerary Health Score**
   - Add a simple "Plan confidence" summary:
     - geography sensible
     - pace okay
     - weather risk
     - opening risk
     - reservation risk
   - This differentiates BerlinWalk from generic AI planner output because it explains realism.

4. **Day Swaps**
   - Add "rain swap" and "Monday swap" suggestions:
     - If Monday + museums, swap museum day with outdoor/Wall day.
     - If high rain probability, move museum/covered market day earlier.
   - Keep deterministic rules for V1.

5. **Email Personalization**
   - Use interest and risk tags in the email subject/body:
     - `Your Berlin plan: Wall history + rainy-day backup`
     - `Arriving Sunday: the Berlin shop rule to know`
     - `Your Day 2 tour slot + Museum Island warning`
   - For booked leads, suppress sales language completely and shift to meeting point/weather/prep.

6. **Blog Embed Improvements**
   - In the blog post, embed the widget near the top with a compact intro and a `Build your plan` anchor.
   - Below the widget, add a short explanation of how the planner thinks: geography, weather, openings, tour timing.
   - Since Google FAQ rich results are limited, write FAQs primarily for reader usefulness and internal linking, not snippet chasing.

### P2 Later / Nice to Have

1. **Curated Berlin Place Packs**
   - Let users add a pack: "Museums", "Cold War", "Food", "Kids", "Nightlife", "Low-budget".
   - Keep as deterministic data, not live AI.

2. **Optional AI Refinement**
   - Only after deterministic V4 is solid: "Make this slower", "Add more food", "I already saw Museum Island."
   - Output should remain bounded by curated Berlin data.

3. **Live Opening Hours**
   - Avoid promising live opening hours unless using a paid/reliable API or a curated maintained dataset.
   - Current V4 should say "opening-day logic" and "check-open flags", not "live opening hours."

4. **Phone Wallet / ICS**
   - Add `.ics` for the recommended BerlinWalk tour slot and optionally a calendar hold for the arrival-day setup.

## Implementation Shape

Keep the widget as a standalone HTML file for now, but split the logic internally into clearer data objects:

- `PLACE_CATALOG`
- `DAY_MODULES`
- `RISK_RULES`
- `ESSENTIALS`
- `PDF_SECTIONS`
- `EMAIL_SEGMENTS`

Recommended V4 build order:

1. Add place catalog and improved maps/directions links.
2. Rebuild the visual plan UI around day cards and risk chips.
3. Redesign PDF around cover + day cards + essentials page.
4. Add adaptive CTA language and analytics events.
5. Run desktop/mobile/PDF QA before publishing.

## V4 Implementation Tickets

Use these as the next build sequence. Each ticket should be implemented and QA'd before moving to public launch.

### UTP-V4-1: Canonical Place Catalog And Map URL Layer

**Purpose:** Make the planner feel grounded in real Berlin locations, not generic text blocks.

**Implementation notes:**

- Add a `PLACE_CATALOG` object keyed by stable IDs such as `world_clock`, `museum_island`, `wall_memorial`, `east_side_gallery`, `topography_terror`, `hackesche_hofe`, `markthalle_neun`, `tempelhofer_feld`, `sanssouci`.
- Each place should include:
  - `label`
  - `query`
  - `area`
  - `type`
  - `lat` / `lng` when useful
  - `why`
- Replace inline `mapLink('Museum Island', 'Museumsinsel')` strings with catalog references.
- Add helpers:
  - `placeSearchUrl(placeId)`
  - `dayDirectionsUrl(day)`
  - `meetingPointUrl()`
  - `formatPlaceChips(day)`
- For directions URLs, keep routes short. Google Maps URL length is limited, so do not put more than 3-4 anchors in one route.

**Acceptance criteria:**

- Every day has a primary `Open Day X route` action.
- Every day still has individual place links.
- Map links use `https://www.google.com/maps/...` with `api=1`.
- Meeting point link is always available when the tour is recommended or booked.
- No old ad hoc map strings remain in day templates except as catalog fallback.

### UTP-V4-2: Visual Trip Spine

**Purpose:** Replace the current "text preview plus image" feeling with a real itinerary object.

**Implementation notes:**

- Add a top-level `bw-trip-spine` inside the result panel.
- Each spine item should show:
  - day number
  - day date
  - day type icon
  - area/theme
  - 2-3 place chips
  - risk chips
  - primary route/action link
- On desktop, use a compact vertical timeline or two-column board next to the snapshot.
- On mobile, use a single-column card stack with stable tap targets.
- Keep detailed blocks in the unlocked full plan, not in the preview spine.

**Acceptance criteria:**

- At 1/3/5/7-day states, the first viewport contains a visual trip shape, not only form fields and paragraphs.
- Mobile width 390px has no horizontal overflow.
- Day cards do not resize unpredictably when risks or place names change.
- The UI has visible icons or image assets beyond the BerlinWalk logo.
- Preview remains useful before email but does not expose the full plan/PDF.

### UTP-V4-3: Risk Chips And Plan Confidence

**Purpose:** Turn long explanatory notes into scannable local-guide intelligence.

**Implementation notes:**

- Add `riskTagsForDay(day)` returning objects like:
  - `{ key: 'sunday', label: 'Sunday shops', severity: 'medium' }`
  - `{ key: 'holiday', label: 'Public holiday', severity: 'high' }`
  - `{ key: 'monday', label: 'Museum caution', severity: 'medium' }`
  - `{ key: 'rain', label: 'Rain backup', severity: 'medium' }`
  - `{ key: 'booking', label: 'Book ahead', severity: 'medium' }`
  - `{ key: 'breaks', label: 'Break needed', severity: 'low' }`
- Add a `planConfidence(plan)` summary with 3-5 items:
  - geography
  - pace
  - weather
  - opening-day risk
  - booking risk
- Keep the longer note text available in the full plan/PDF.

**Acceptance criteria:**

- Sunday, Monday, public holiday, family/slow pace, rain backup, and reservation selections produce visible chips.
- At least one confidence summary appears in the result panel.
- The full plan has shorter notes than V3, with no huge yellow note blocks in normal cases.
- PDF still preserves the practical explanations.

### UTP-V4-4: PDF V4 Travel Document

**Purpose:** Make the PDF feel like a polished BerlinWalk mini-plan rather than a printout of page text.

**Implementation notes:**

- Keep the real BerlinWalk logo in the header.
- Page 1:
  - title
  - arrival date and trip length
  - trip mode/pace/group
  - weather snapshot
  - ticket start
  - best tour slot
  - mini trip spine
  - BerlinWalk CTA link
- Day pages:
  - one full-width day card if long, two compact cards if short
  - day accent color and icon initial
  - 3 time blocks
  - place anchors
  - risk chips
  - one short local note
- Final page:
  - Berlin Essentials
  - meeting point
  - ticket zones
  - Sunday/holiday/Monday
  - cash/card/toilets/water
  - booking link and `@berlinwalkingtour`
- If QR generation is added, use a tiny dependency or a simple embedded QR helper; otherwise use readable URLs.

**Acceptance criteria:**

- 7-day PDF renders without overlap at default selections and with long-risk selections.
- The first page has BW logo and trip snapshot.
- Berlin Essentials always starts cleanly and does not collide with the previous day.
- Links are clickable where jsPDF supports `textWithLink`.
- Render at least one PDF to PNG/contact sheet before launch QA.

### UTP-V4-5: Lead Gate And CTA Personalization

**Purpose:** Improve conversion without making the widget feel predatory.

**Implementation notes:**

- Rewrite lead gate around delivery value: `Send the phone-ready plan + PDF`.
- Add positive validation after blur or after submit correction, not on first keystroke.
- Add separate events:
  - `bw_trip_planner_gate_view`
  - `bw_trip_planner_email_focus`
  - `bw_trip_planner_email_valid`
  - `bw_trip_planner_consent_check`
  - `bw_trip_planner_unlock_attempt`
  - `bw_trip_planner_unlock_success`
- Change primary CTA copy by state:
  - morning + not booked: `Book arrival-day 11:30 tour`
  - later arrival + not booked: `Book Day 2 at 11:30`
  - booked/self-reported booked: `Save World Clock meeting point`
  - unsure/maybe: `See the 11:30 tour details`

**Acceptance criteria:**

- Invalid email and missing consent show clear inline messages.
- Endpoint failure still fail-soft unlocks.
- CTA copy changes correctly across `tourIntent` and `arrivalTime`.
- Booked mode does not show a sales-first CTA.
- Analytics events still do not send email addresses or PII.

### UTP-V4-6: Share/Resume State

**Purpose:** Let users return to the exact plan and share it without exposing private data.

**Implementation notes:**

- Serialize non-PII planner state into query params.
- Add `Copy plan link`.
- Add `Reset plan` if needed.
- Keep email and unlock token only in local storage, never in shared URL.

**Acceptance criteria:**

- Reloading a copied URL reproduces date, trip length, choices, and generated plan.
- Email is never present in URL.
- The widget works with existing `?context`, `?date`, `?tripLength`, and `?weather=off` params.

## Minimum Launch QA For V4

- Desktop local QA at 1280px: no horizontal overflow, visible visual spine, all day counts render.
- Mobile local QA at 390px: no horizontal overflow, no clipped buttons, visual spine cards fit.
- Date logic QA:
  - today
  - tomorrow
  - date more than 16 days away
  - Sunday
  - Monday
  - Berlin public holiday
- Planner state QA:
  - 1-day, 3-day, 5-day, 7-day
  - morning arrival
  - evening arrival
  - already booked
  - family/gentle pace
  - rain + reservations flags
- Lead gate QA:
  - invalid email
  - missing consent
  - successful submit if endpoint available
  - fail-soft unlock if endpoint unavailable
- PDF QA:
  - default 3-day PDF
  - long 7-day PDF
  - rendered PNG/contact sheet inspection
- Link QA:
  - at least one individual map link opens Google Maps search
  - at least one day route link opens Google Maps directions
  - meeting point link is present in booked/recommended states
- Distribution QA:
  - GitHub Pages URL with cachebuster
  - Wix tool page embed height
  - blog embed near the top
  - do not add to `tools-home/data.json` until public launch

## Definition Of "Ultimate" For V4

V4 is ready to publish only when a first-time Berlin visitor can:

- See the trip shape visually before reading detailed text.
- Understand the best BerlinWalk tour slot.
- Open each day in Google Maps.
- See local risks at a glance.
- Unlock a full plan without feeling tricked.
- Download a PDF that looks like a designed BerlinWalk travel plan.
- Keep or share the plan without re-entering everything.

## What Not To Do

- Do not add more top-level questions before improving visual output.
- Do not move Ultimate back into `tools-home/data.json` until it is live/published.
- Do not overpromise live opening hours.
- Do not make the plan too exact hour-by-hour; Berlin trips need flexible blocks.
- Do not replace deterministic local-guide rules with generic AI output in V4.
- Do not rely on FAQ rich results as a core SEO promise.
