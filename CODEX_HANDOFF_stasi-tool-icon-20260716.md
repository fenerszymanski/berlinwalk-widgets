# Handoff — Stasi tool page + icon (single remaining item)

Daily-blog run 2026-07-16 (~07:05) created the **Stasi Museum Berlin** blog
package. Everything is done and pushed EXCEPT the BerlinTools tool page + glossy
icon, which needs a non-paid image-generation path (Yusuf's logged-in ChatGPT).
This run was autonomous/unattended, so I did not drive Yusuf's live browser for a
multi-step generate/upload/CMS chain. Finish this in the next interactive session.

The blog draft stays **UNPUBLISHED** regardless; publishing the tool page does
NOT publish the post.

## What is already live/pushed
- Widget: https://fenerszymanski.github.io/berlinwalk-widgets/stasi-surveillance-scale/
- Quick Summary + FAQ + slug-map + inject.js updated for `stasi-museum-berlin`.
- Wix draft `f7b0f21c-6e38-4609-ae48-98ba2147f4a8` (UNPUBLISHED), slug
  `stasi-museum-berlin`.
- Commits `4c72bb0` (package) and `1d48083` (icon prompt) on origin/main.

## Steps to finish (5–10 min)
1. Generate the icon with the prompt in
   `tools-home/icons/_src/daily-blog-icons-20260716-prompts.md`
   (`stasi-surveillance-scale`) via Yusuf's logged-in ChatGPT.
2. Download raw square; crop to `tools-home/icons/stasi-surveillance-scale.png`
   (512) + `stasi-surveillance-scale-160.png` (160), clean RGBA / cream corners.
3. Upload the 512 to Wix Media; note the media id + URL.
4. Add this entry to `tools-hub/data.json` (fill `image` + `cmsItemId`):

```json
{
  "slug": "stasi-surveillance-scale",
  "title": "The Stasi, by the Numbers",
  "lead": "See how deep East Germany's secret police reached: pick any group size and watch the informer and Stasi-file ratios appear.",
  "category": "Discovery",
  "image": "<WIX_MEDIA_512_URL>",
  "widgetUrl": "https://fenerszymanski.github.io/berlinwalk-widgets/stasi-surveillance-scale/",
  "embedHeight": 1500,
  "hubCategory": "CultureLandmarks",
  "type": "Guide",
  "tags": ["Stasi", "Cold War Berlin", "GDR", "surveillance", "Berlin history", "DDR"],
  "aliases": ["stasi museum berlin", "stasi numbers", "stasi informers", "hohenschonhausen", "cold war berlin"],
  "iconStatus": "live-wix-media",
  "cmsItemId": "<CMS_ITEM_ID>",
  "relatedBlog": "/post/stasi-museum-berlin"
}
```

5. Create the `BerlinTools` CMS item so `/tools/stasi-surveillance-scale` is live
   (slug, title, h1 "The Stasi, by the Numbers", lead, seoTitle/seoDescription,
   jsonLd WebApplication, widgetUrl, relatedBlog `/post/stasi-museum-berlin`).
6. `node tools-hub/validate-data.mjs`, commit/push (own paths only).
7. Do NOT add to homepage `tools-home/data.json` (not a top-8 tool).

## Completion update — 2026-07-16

This deferred handoff is complete. The built-in Codex image-generation route
produced the icon; the 512px asset was uploaded to Wix Media; CMS item
`9301d985-4703-436e-afa2-a40d61c5a9d3` is live at
`/tools/stasi-surveillance-scale`; and the local hub/blog data is wired. The
Wix media URL is recorded in `tools-hub/data.json` and the icon manifests.

The direct Wix page returned HTTP 200 and browser QA confirmed the correct
widget iframe, related post and related-tool links. The widget-repo commit is
local; GitHub Pages push remains Yusuf's manual step under the repo workflow.
