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
- Public consent text version: `history-lead-v1-2026-07-17`.

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

For the first 24 hours, only the old-town article receives a 10% variant. Once
24 hours have elapsed, the loader automatically uses a 50/50 split on the
old-town and wide-streets articles. Alexanderplatz remains excluded. It can be
added only after the readout with `{stage:'expanded',enableExpansion:true}`.
