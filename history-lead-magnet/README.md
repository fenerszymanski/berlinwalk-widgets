# Berlin Before & Now lead magnet

Custom Element for the history-story lead magnet and its inline blog variant.

## Wix page

Use this markup on the unpublished `/berlin-before-and-now` page:

```html
<bw-history-lead-magnet mode="full"></bw-history-lead-magnet>
<script src="https://fenerszymanski.github.io/berlinwalk-widgets/history-lead-magnet/history-lead-magnet-element.js"></script>
```

Keep the Wix page out of navigation and set robots to `noindex,follow` during
the pilot. The element also installs the robots meta as a defensive fallback.

Story links requested by full mode:

- Story 1: `/berlin-before-and-now`
- Story 2: `/berlin-before-and-now?story=2&status=confirmed`
- Story 3: `/berlin-before-and-now?story=3`

The query parameter is not an access grant. Story 2 and Story 3 stay closed
unless the element can validate the PII-free, signed `HttpOnly` access cookie
issued by the confirmation/email click endpoint. Directly typing or sharing a
`?story=2` or `?story=3` URL falls back to Story 1 and the email gate.

## Approved image contract

`assets-manifest.json` is the source-of-truth licence record for all six pilot
images. The UI will not load a photo unless both the archive and current records have:

- a real file path in `src`;
- useful `alt` text;
- `creator`, `sourceName`, and `sourcePage` values;
- one of the allow-listed Public Domain, CC0, CC BY, or CC BY-SA licences;
- story-level `approved: true` after the files and attribution were checked.

The approved optimized files live under `history-lead-magnet/assets/optimized/`.
Each record includes its original file, source page, licence URL and processing
note. Do not replace them with AI reconstructions or unverified downloads.

## Runtime configuration

- API default: `https://app.berlinwalk.com/api/history-lead`
- Override API globally with `window.BW_HISTORY_LEAD_API_BASE` or per element
  with `api-base`.
- Override the asset manifest only for local QA with
  `window.BW_HISTORY_LEAD_ASSET_MANIFEST`.
- Public consent text version: `history-series-v2-2026-07-17`.

The single required checkbox covers only the finite two-email series: Story 2
immediately after confirmation and Story 3 about 48 hours later. Both emails
may include BerlinWalk walking-tour information. It does not opt the visitor
into unspecified or occasional future updates.

The blog experiment loader lives in `../js/lead-form-inject.js`. Its default
stage is `qa`, so normal visitors keep the existing booking card until a Wix
Custom Code config explicitly starts the safety ramp:

```html
<script>
window.BW_HISTORY_LEAD_EXPERIMENT_CONFIG = {
  stage: 'safety',
  safetyStartedAt: 'DEPLOY_TIME_AS_AN_ISO_TIMESTAMP'
};
window.BW_HISTORY_LEAD_ELEMENT_URL =
  'https://cdn.jsdelivr.net/gh/fenerszymanski/berlinwalk-widgets@PINNED_COMMIT/history-lead-magnet/history-lead-magnet-element.js';
</script>
```

For the first 24 hours, all six eligible articles receive a 10% variant:

- `why-berlin-doesn-t-have-a-beautiful-old-town-and-why-that-s-the-point`
- `why-berlin-s-streets-are-so-wide-it-wasn-t-always-the-plan`
- `where-was-the-berlin-wall-interactive-map`
- `the-ampelmann-how-a-traffic-light-became-berlin-s-most-beloved-symbol`
- `unter-den-linden-berlin`
- `why-is-berlin-founding-year-1237`

Once 24 hours have elapsed from `safetyStartedAt`, the loader automatically
uses a 50/50 split on those same six articles. Alexanderplatz remains excluded.
It can be added only after the readout with
`{stage:'expanded',enableExpansion:true}`.

Experiment persistence starts only after analytics consent. The injector and
element send the PII-free fields `acquisitionCohort`, `placement`,
`assignmentId`, and `analyticsConsentAtSubmit` with eligible events and form
submissions. Blog placements use `blog_inline_booking_slot`; the standalone
lead-magnet page is distinct as `direct_landing` / `history_landing_full`.

The existing booking card is the fail-safe. Invalid experiment configuration,
element-script load failure, element render failure, or a seven-second readiness
timeout removes the incomplete variant and restores the unchanged control card.
The global kill switch and `?bwHistoryLead=0` use the same control path.

## Hourly Story 3 job

Vercel Hobby cannot run an hourly cron, so production uses the existing Wix
hourly scheduler as the primary trigger and keeps the daily Vercel rescue cron
as a fallback. The canonical bridge is in `velo/historyLeadCron.js`; its live
export currently lives in `Backend/http-functions.js`. Merge
`velo/jobs.config.snippet.json` into the live `jobs.config`. Both Wix Secrets
Manager and Vercel Production must contain the same dedicated
`HISTORY_LEAD_CRON_SECRET` value. Never place that value in source control or a
public URL.
