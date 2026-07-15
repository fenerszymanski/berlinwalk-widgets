# Trip Planner SEO publish QA - 2026-07-15

## Published posts

- `https://www.berlinwalk.com/post/2-days-in-berlin-itinerary`
  - Wix draft ID `b27adae0-12de-4a62-9093-b138087deab9`
  - API readback: `PUBLISHED`, `hasUnpublishedChanges=false`
  - Pre-publish backup, current draft and published rich-content SHA-256 match.
  - Pre-publish backup and current draft SEO SHA-256 match.
  - Live: HTTP page rendered, self-canonical, `follow, index, max-image-preview:large`, OG image, one public H1, BlogPosting and FAQPage schema.
  - Five article images loaded with non-empty alt text; three expected embeds rendered.
  - Chromium 390x844: zero horizontal overflow and zero console errors.
  - Two-day route map changed from Day 1 to Day 2 inside the live article.

- `https://www.berlinwalk.com/post/weekend-in-berlin-48-hour-itinerary`
  - Wix draft ID `7d3ac682-daf9-418f-8d16-0d1d03f140bd`
  - API readback: `PUBLISHED`, `hasUnpublishedChanges=false`
  - Pre-publish backup, current draft and published rich-content SHA-256 match.
  - Pre-publish backup and current draft SEO SHA-256 match.
  - Live: HTTP page rendered, self-canonical, `follow, index, max-image-preview:large`, OG image, one public H1, BlogPosting and FAQPage schema.
  - Six article images loaded with non-empty alt text; six caption blocks expose 12px text; three expected embeds rendered.
  - Chromium 390x844: zero horizontal overflow and zero console errors.
  - Arrival board changed to Saturday 14:00 / Sunday 16:00 and returned the correct 26 usable-hour schedule.

## Blog propagation

- `blog-index/data.json` regenerated with `--limit 300`.
- Total published posts: 214.
- Latest positions: Weekend itinerary first, Two-day itinerary second.
- Related tools mapped explicitly: Weekend itinerary to `ultimate-berlin-trip-planner`; Two-day itinerary to `berlin-two-day-route-map`.
- GitHub Pages workflows `29425304891` and `29425302968` completed successfully for commit `a44bb8a`.
- GitHub Pages readback returned 214 posts and the two new slugs in positions one and two of the source `latest` array.
- Live `https://www.berlinwalk.com/blog` mobile QA at 390x844: both new links appear once in `Latest Berlin notes`, in the correct order, with zero horizontal overflow and zero console errors.

## Google Search Console

- Property: `sc-domain:berlinwalk.com`.
- Both new URLs initially returned `URL is not on Google` / `URL is unknown to Google`.
- Both indexing requests completed with `Indexing requested`; each URL was added to Google's priority crawl queue.
- Evidence: `search-console-indexing.json`.

## Evidence

- `publish-2-days-in-berlin-itinerary.json`
- `publish-weekend-in-berlin-48-hour-itinerary.json`
- Playwright screenshots are stored locally under `output/playwright/trip-planner-seo-publish/`, including the mobile `Latest Berlin notes` readback.
