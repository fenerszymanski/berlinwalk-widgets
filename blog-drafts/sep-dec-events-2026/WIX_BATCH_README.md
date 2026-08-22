# September–December 2026 Wix batch runner

These two scripts are deliberately fail-closed. With no `--apply` flag they
perform local validation only: no Keychain loading, no Wix calls, no media
uploads and no local state writes. Neither script has a publish mode.

## Required inputs

Create one local internal asset manifest when the four local article images and
each final tool icon are ready. Do not invent a source URL, credit, or Wix media
identity to make this pass, and do not surface the manifest in a public page.

```json
{
  "batch": "sep-dec-events-2026",
  "posts": {
    "<post-slug>": {
      "embedVersion": "<deployed-widget-version>",
      "embedHeights": {
        "quickSummary": 0,
        "tool": 0,
        "faq": 0
      },
      "coverPath": "images/<cover-file>",
      "images": [
        {
          "path": "images/<file-1>",
          "sourceType": "commons",
          "credit": {
            "label": "<source title>",
            "author": "<credit name>",
            "licenseLabel": "<licence label>",
            "licenseUrl": "<verified licence URL, or null when the source declares public domain without one>",
            "sourceUrl": "<verified source-file URL>"
          }
        },
        {
          "path": "images/<file-2>",
          "sourceType": "generated"
        }
      ]
    }
  },
  "toolIcons": {
    "<tool-slug>": {
      "path": "tools-home/icons/<tool-slug>.png",
      "wixMedia": {
        "id": "<actual Wix Media id>",
        "url": "<actual Wix Media URL>"
      }
    }
  }
}
```

Each of the 11 post plans needs exactly four images. The article body must use
those exact paths in the same order, place one italic caption directly after
each image, and contain one `{{article-image-credits}}` token. A `commons`
image needs its complete public credit. A `generated` image must have no public
credit object, so internal provenance can never leak into reader-facing Image
credits. At least one sourced credit is required for every batch article.

`wixMedia` is intentionally required for tool icons. Upload icons through the
scoped media step first, record the exact readback identity here, then use the
same URL in `tools-hub/data.json`. The CMS creator does not upload icons or
silently substitute a generic image.

## Scoped tool-icon media step

The event batch has its own 11-slug uploader. It never writes an icon manifest,
`tools-hub`, Blog data, or CMS data. With no flags it only validates the final
512px PNGs and makes zero Wix calls:

```bash
node blog-drafts/sep-dec-events-2026/upload-event-tool-icons-to-wix.mjs
```

Only after the local check is clean, load the Keychain value and use the exact
confirmation form below. It uploads only the fixed 11 icons, caches a matching
SHA-256 receipt for safe reruns, and writes exact media IDs/URLs plus the upload
readback only under `output/qa/sep-dec-events-2026/<run-id>/wix/`:

```bash
source scripts/load-api-keys.sh
node berlinwalk-widgets/blog-drafts/sep-dec-events-2026/upload-event-tool-icons-to-wix.mjs \
  --apply --run-id <unique-run-id>
```

Copy the resulting `toolIcons` map from `tool-icon-upload-readback.json` into
the internal asset manifest before running the CMS validator. This action has
no Blog publish path.

Create a separate CMS-content manifest with review-ready tool copy:

```json
{
  "batch": "sep-dec-events-2026",
  "tools": {
    "<tool-slug>": {
      "title": "<tool title>",
      "h1": "<tool page H1>",
      "lead": "<matching tools-hub lead>",
      "secondary": "<scope boundary>",
      "intro": "<tool introduction>",
      "seoTitle": "<SEO title>",
      "seoDescription": "<SEO description>",
      "sections": [
        { "title": "<section heading>", "body": "<section body>" }
      ],
      "relatedTools": [
        {
          "slug": "<other-tool-slug>",
          "title": "<other tool title>",
          "url": "https://www.berlinwalk.com/tools/<other-tool-slug>"
        }
      ]
    }
  }
}
```

Each tool needs at least three sections and exactly two distinct related tools.
Do not add `relatedBlogTitle`, `relatedBlogPath`, `relatedBlogUrl`, or
`relatedBlogDescription`: the CMS runner deliberately writes all four as blank
until the corresponding Blog post is actually published.

## Local-only validation

Run these before sourcing any key. They must complete with `wixCalls: 0`.

```bash
node blog-drafts/sep-dec-events-2026/create-wix-drafts.mjs \
  --image-manifest blog-drafts/sep-dec-events-2026/<asset-manifest>.json

node blog-drafts/sep-dec-events-2026/create-berlintools-cms.mjs \
  --image-manifest blog-drafts/sep-dec-events-2026/<asset-manifest>.json \
  --cms-manifest blog-drafts/sep-dec-events-2026/<cms-manifest>.json
```

The draft validator checks the existing body, Quick Summary and FAQ entries,
four image files/dimensions/alt text, captions, native default-closed credit
disclosure, three embeds and the future `UNPUBLISHED` target. The CMS validator
checks the exact 11 tool slugs, `tools-hub` parity, final icon identity and
blank related-blog policy.

## Explicit Wix write

Only after the local reports are clean, the deployed widget URL is verified and
the exact slug collision scan is safe, load the key in the workspace root and
run one explicit apply command at a time:

```bash
source scripts/load-api-keys.sh

node berlinwalk-widgets/blog-drafts/sep-dec-events-2026/create-wix-drafts.mjs \
  --image-manifest berlinwalk-widgets/blog-drafts/sep-dec-events-2026/<asset-manifest>.json \
  --apply --run-id <unique-run-id>

node berlinwalk-widgets/blog-drafts/sep-dec-events-2026/create-berlintools-cms.mjs \
  --image-manifest berlinwalk-widgets/blog-drafts/sep-dec-events-2026/<asset-manifest>.json \
  --cms-manifest berlinwalk-widgets/blog-drafts/sep-dec-events-2026/<cms-manifest>.json \
  --apply --run-id <unique-run-id>
```

The Blog runner performs a full exact collision scan before media work and again
immediately before its one bulk create request. It sends `publish: false`, then
GET-reads every returned draft and requires `status: UNPUBLISHED`. The CMS
runner performs a full collision scan and repeats an exact slug query before
each insert, then reads every item back. Both write run evidence only under
`output/qa/sep-dec-events-2026/<run-id>/wix/` during an explicit apply run.
