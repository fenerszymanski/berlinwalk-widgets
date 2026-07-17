## Berlin Then and Now draft package

Status: **local and unpublished**. This folder does not publish to Wix, update a shared index or alter a live route.

### Package contents

- `berlin-then-and-now.body.md`: 1,600–1,900-word article body with no H1.
- `seo.json`: title, slug, metadata, internal links and schema inputs.
- `quick-summary.json` and `faq.json`: structured editorial modules.
- `assets/raw/`: downloaded source files.
- `assets/optimized/`: publication-ready JPEG derivatives.
- `image-manifest.json`: source page, licence, attribution, processing and SHA-256 for every asset.
- `image-copy.md`: image order, alt text and captions.
- `source-notes.md`: official historical fact ledger and editorial limits.
- `tool-icon-prompt.md`: later icon-generation brief; no icon was generated.
- `preview.html`: local article preview with the real viewer embedded.
- `validate-package.mjs`: deterministic content and asset checks.

The interactive component is in `../../mehringplatz-time-layer-viewer/`.

### Local preview

From `berlinwalk-widgets/`:

```bash
python3 -m http.server 4178
```

Open:

- Article: `http://127.0.0.1:4178/blog-drafts/berlin-then-and-now/preview.html`
- Viewer only: `http://127.0.0.1:4178/mehringplatz-time-layer-viewer/`

### Validation

From `berlinwalk-widgets/`:

```bash
node blog-drafts/berlin-then-and-now/validate-package.mjs
node mehringplatz-time-layer-viewer/test.mjs
```

Before any publication, recheck every source-page licence, render captions at approximately 12 px centred and italic in Wix, keep Image Credits closed by default, and repeat desktop/mobile browser QA in the Wix draft.
