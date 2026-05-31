# Ultimate Berlin Trip Planner Email Funnel

Source copy for Wix Triggered Emails used by the pre-booking trip planner
sequence.

Paste-ready HTML lives in `paste-ready/` and is generated from these markdown
files with:

```bash
node ultimate-berlin-trip-planner/email/build-triggered-email-html.mjs
```

Use `paste-ready/README.md` as the manual Wix template creation checklist:
paste the subject/preheader, paste the matching HTML block, then use
`../velo/apply-triggered-email-ids.mjs` to validate and apply the resulting Wix
messageIds into `../velo/tripPlannerFunnel.js`.

Use these five files while the lead has not booked. Once the backend marks a
matching lead as booked, Ultimate suppresses its future planner reminders and
lets the existing BerlinWalk booking email sequence handle meeting-point,
weather, and tour-day prep. Do not create a second booked-guest automation here.

The instant and reminder emails intentionally reuse `${planHealth}`,
`${preArrivalChecklist}`, `${baseBrief}`, `${budgetPulse}`,
`${interestLens}`, `${paceGuard}`, `${weatherStrategy}`,
`${carryPack}`, `${reservationRadar}`, `${dayRhythm}`, and compact day-level logistics so each message feels
tied to the same generated plan, not like a generic campaign.
`${tripStyle}` carries the visual shortcut or `Custom mix` so leads can be
segmented by how they framed the trip before unlocking the full plan.
`${dayOperations}` includes the deterministic timing windows from the visible
itinerary, so instant emails carry the same phone-ready rhythm as the widget/PDF
without requiring a new collection field.

Variables expected by Velo:

- `${arrivalDate}`
- `${tripLength}`
- `${planTitle}`
- `${recommendedTourDay}`
- `${recommendedTourDate}`
- `${recommendedTourTime}`
- `${ticket}`
- `${weatherTitle}`
- `${travelMode}`
- `${planHealth}`
- `${preArrivalChecklist}`
- `${baseBrief}`
- `${budgetPulse}`
- `${interestLens}`
- `${paceGuard}`
- `${weatherStrategy}`
- `${carryPack}`
- `${reservationRadar}`
- `${planAdvice}`
- `${planSwaps}`
- `${dayRhythm}`
- `${dayIntelligence}`
- `${dayOperations}` - daily timing windows plus start / transit / reserve / backup notes
- `${arrivalWindow}`
- `${tripRisk}`
- `${tourRecommendation}`
- `${intentStage}`
- `${familyOrSlow}`
- `${bookAheadNeeded}`
- `${conversionSignal}`
- `${conversionScore}`
- `${conversionTier}`
- `${conversionNextAction}`
- `${conversionReasons}`
- `${arrivalTime}`
- `${arrivalPoint}`
- `${stayArea}`
- `${groupType}`
- `${interests}`
- `${budgetStyle}`
- `${mustHandle}`
- `${pace}`
- `${tourIntent}`
- `${tripStyle}`
- `${bookingStatus}`
- `${tourDate}`
- `${bookingUrl}`
- `${meetingPointUrl}`
- `${firstDayPlannerUrl}`
- `${ticketCalculatorUrl}`
- `${whatsOpenUrl}`
- `${dailyBudgetUrl}`

Tone: practical, calm, local-guide voice. Public links should use
`berlinwalk.com` and `@berlinwalkingtour` only.
