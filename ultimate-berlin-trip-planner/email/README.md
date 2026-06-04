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

The current copy is intentionally compact. It uses a small set of plan-specific
variables so the emails feel like Yusuf's practical follow-up to the generated
plan, not an internal planner report. Keep sales CTAs natural and limited:
booked guests are suppressed from this sequence and should continue in the
existing booking email automation.

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
