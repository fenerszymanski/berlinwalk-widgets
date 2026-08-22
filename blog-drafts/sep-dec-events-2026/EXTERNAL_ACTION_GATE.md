# September–December 2026 Events Batch — External Action Gate

Status: `LOCAL_ASSETS_READY_PENDING_DEPLOY_AND_UNPUBLISHED_DRAFT_GATES`

No Wix, CMS, Git hosting, image host or public page was changed while this file was prepared.

## What is ready locally

- 11 body drafts, metadata records, Quick Summary records and FAQ records.
- 11 distinct widget source packages with source notes and local responsive QA.
- 44 Wikimedia Commons article images: four per post, with source, licence, caption and alt-text records; each body now has the exact image sequence and an article-owned credits token.
- 11 dedicated 512px and 160px tool icons, inspected locally, with internal prompt/source records.
- A factual scope lock, novelty matrix and local validation command.

## What still prevents an honest draft write

| Gate | Current state | Consequence |
|---|---|---|
| Article media | 44 final Commons files are present locally, but the Wix Media upload and readback have not yet happened. | Do not create a draft until every final image has an exact Wix media identity. |
| Reusable visual rights | The source manifest records the source page, creator and licence for every file. | Preserve the article-owned closed credits disclosure; do not substitute generic or misleading imagery. |
| Tool icons | 11 distinct icons are complete locally, but Wix Media URLs do not yet exist. | Do not add an invented, generic or dead image URL to the tools hub. |
| Tools hub and CMS | The CMS manifest is ready, but deployment evidence, final icon URLs and CMS record IDs are pending. | Validate exact tools-hub parity before the scoped CMS write. |
| Live programme data | Jazzfest, Science Week and Freedom Week retain programme-level recheck boundaries. | Keep the existing conditional wording until a fresh official readback supports a more specific claim. |

## Authorized external phase once the remaining gates pass

The attached batch scope authorizes one bounded run: upload only the recorded article images and tool icons, deploy only the 11 widgets, create only the 11 Wix posts as `UNPUBLISHED`, and create/read back only their matching tool CMS records. No Blog publish is part of that run.

## Fixed safety constraints for that phase

- Recheck every one of the 11 post slugs and 11 tool slugs immediately before creation.
- Use a dedicated 11-slug uploader. Do not invoke `scripts/upload-chatgpt-tool-icons-to-wix.mjs` as it can rewrite the wider icon manifest/data set when not in dry-run mode.
- Every Wix draft needs a GET readback, native closed Image Credits disclosure, body/QS/FAQ validation, FAQPage JSON-LD, four final images, and an explicit `UNPUBLISHED` result.
- No event-specific programme detail becomes a confirmed claim until its own official 2026 record is fresh.
