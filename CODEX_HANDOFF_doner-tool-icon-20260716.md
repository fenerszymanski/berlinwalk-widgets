# Handoff — Döner Order Builder tool page + icon (single remaining item)

Daily-blog run 2026-07-16 (~12:05) created the **How to Order Döner in Berlin**
blog package. Everything is done and pushed EXCEPT the BerlinTools tool page +
glossy icon, which needs a non-paid image-generation path (Yusuf's logged-in
ChatGPT). This run was autonomous/unattended with no drivable non-paid
image-gen path, so the icon/tool-page is the single flagged handoff. Finish it
in the next interactive session.

The blog draft stays **UNPUBLISHED** regardless; publishing the tool page does
NOT publish the post.

## What is already live/pushed
- Widget: https://fenerszymanski.github.io/berlinwalk-widgets/berlin-doner-order-builder/
- Quick Summary + FAQ + slug-map + inject.js updated for `how-to-order-doner-in-berlin`.
- Wix draft `52bfb047-bd56-45e1-8e02-51001afa17d5` (UNPUBLISHED), slug
  `how-to-order-doner-in-berlin`.
- Commit `59a9eab` (package) + icon prompt append on origin/main.

## Steps to finish (5–10 min)
1. Generate the icon with the prompt in
   `tools-home/icons/_src/daily-blog-icons-20260716-prompts.md`
   (`berlin-doner-order-builder`) via Yusuf's logged-in ChatGPT.
2. Download raw square; crop to `tools-home/icons/berlin-doner-order-builder.png`
   (512) + `berlin-doner-order-builder-160.png` (160), clean RGBA / cream corners.
3. Upload the 512 to Wix Media; note the media id + URL.
4. Add this entry to `tools-hub/data.json` (fill `image` + `cmsItemId`):

```json
{
  "slug": "berlin-doner-order-builder",
  "title": "Berlin Döner Order Builder",
  "lead": "Build your exact döner order and get the German line to say at the counter: pick the form (Döner, Dürüm, Teller, Box), the filling, salad, sauces and extras, and see the phrase, rough pronunciation, what you get and the 2026 price.",
  "category": "Discovery",
  "image": "<WIX_MEDIA_512_URL>",
  "widgetUrl": "https://fenerszymanski.github.io/berlinwalk-widgets/berlin-doner-order-builder/",
  "embedHeight": 1280,
  "hubCategory": "FoodNightlife",
  "type": "Guide",
  "tags": ["döner", "Gemüse Kebap", "Dürüm", "Berlin food", "street food", "how to order in German", "kebab"],
  "aliases": ["order doner berlin", "how to order doner", "doner german phrases", "mit alles", "gemuse kebap", "durum vs doner"],
  "relatedBlog": "/post/how-to-order-doner-in-berlin",
  "iconStatus": "live-wix-media",
  "cmsItemId": "<CMS_ITEM_ID>"
}
```

   NOTE: `hubCategory` key `FoodNightlife` is confirmed (matches
   berlin-currywurst-finder / berlin-beer-gardens-map).

5. Create the `BerlinTools` CMS item so `/tools/berlin-doner-order-builder` is
   live: slug, title, h1, lead, seoTitle, seoDescription, jsonLd (WebApplication),
   widgetUrl, relatedBlog `/post/how-to-order-doner-in-berlin`. Use the
   public-toilets / luggage-storage items as templates.
6. `node tools-hub/validate-data.mjs`, then commit/push. Do NOT add to homepage
   `tools-home/data.json` (not a top-8 tool).

This does NOT publish the blog post; the post stays UNPUBLISHED until Yusuf
approves it.
