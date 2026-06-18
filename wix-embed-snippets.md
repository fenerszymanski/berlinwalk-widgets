# Wix Embed Snippets

Use these with Wix "Embed a Site" / iframe URL embeds after deployment.

For homepage SEO sections, use Wix Studio Custom Element instead of an iframe.
Yusuf handles all Wix Studio canvas placement and publishing manually.

## Homepage Custom Elements

Use these in Wix Studio:

```text
Element: Custom Element
Source type: Server URL
```

| Section | Source URL | Tag Name | Attributes |
| --- | --- | --- | --- |
| Hero Home | `https://fenerszymanski.github.io/berlinwalk-widgets/hero-home/hero-home-element.js` | `bw-hero-home` | none |
| How It Works | `https://fenerszymanski.github.io/berlinwalk-widgets/how-it-works/how-it-works-element.js` | `bw-how-it-works` | none |
| Blog Home | `https://fenerszymanski.github.io/berlinwalk-widgets/blog-home/blog-home-element.js` | `bw-blog-home` | none |
| Blog Index | `https://fenerszymanski.github.io/berlinwalk-widgets/blog-index/blog-index-element.js?v=2` | `bw-blog-index` | none |
| Guide Home | `https://fenerszymanski.github.io/berlinwalk-widgets/guide-home/guide-home-element.js` | `bw-guide-home` | none |
| Trip Planner Home | `https://fenerszymanski.github.io/berlinwalk-widgets/trip-planner-home/trip-planner-home-element.js?v=20260606` | `bw-trip-planner-home` | none |
| Tools Home | `https://fenerszymanski.github.io/berlinwalk-widgets/tools-home/tools-home-element.js` | `bw-tools-home` | none |
| Testimonials | `https://fenerszymanski.github.io/berlinwalk-widgets/testimonials/testimonials-element.js` | `bw-testimonials` | none |
| Gallery | `https://fenerszymanski.github.io/berlinwalk-widgets/gallery/gallery-element.js` | `bw-gallery` | none |
| Tools Hub | `https://fenerszymanski.github.io/berlinwalk-widgets/tools-hub/tools-hub-element.js` | `bw-tools-hub` | none |
| Site Header | `https://fenerszymanski.github.io/berlinwalk-widgets/site-header/site-header-element.js?v=4` | `bw-site-header` | none |
| Berlin Quiz (homepage) | `https://fenerszymanski.github.io/berlinwalk-widgets/berlin-quiz/berlin-quiz-element.js` | `bw-berlin-quiz` | none |
| Site Footer | `https://fenerszymanski.github.io/berlinwalk-widgets/site-footer/site-footer-element.js` | `bw-site-footer` | none |
| The Guide | `https://fenerszymanski.github.io/berlinwalk-widgets/the-guide/the-guide-element.js` | `bw-the-guide` | none |
| Route Story | `https://fenerszymanski.github.io/berlinwalk-widgets/route-story/route-story-element.js` | `bw-route-story` | none |
| Thank You Page | `https://fenerszymanski.github.io/berlinwalk-widgets/thank-you/thank-you-element.js` | `bw-thank-you` | none |
| Book Hero (above Wix Bookings widget) | `https://fenerszymanski.github.io/berlinwalk-widgets/book/book-element.js` | `bw-book-hero` | none |
| Book Details (below Wix Bookings widget) | `https://fenerszymanski.github.io/berlinwalk-widgets/book/book-element.js` | `bw-book-details` | none |
| Why Walk With Me | `https://fenerszymanski.github.io/berlinwalk-widgets/why/why-element.js` | `bw-why` | none |
| The Route | `https://fenerszymanski.github.io/berlinwalk-widgets/route/route-element.js` | `bw-route` | none |
| FAQ | `https://fenerszymanski.github.io/berlinwalk-widgets/faq/faq-element.js` | `bw-faq` | `post="home"` |
| Blog Guide Note | `https://fenerszymanski.github.io/berlinwalk-widgets/blog-guide-note/blog-guide-note-element.js` | `bw-blog-guide-note` | none |

FAQ note: `bw-faq` emits homepage FAQPage JSON-LD from `faq/data.json`. Keep the
old FAQ iframe files and `inject.js` for blog posts until live Rich Results
testing confirms the homepage Custom Element schema is detected.

Route note: `bw-route` pin coordinates and the dashed path come from
`route/data.json`, so future coordinate updates should only touch data. The
dedicated route story page uses `bw-route-story` at `/berlin-walking-tour-route`
for the deeper SEO/sales version of the route.

Testimonials note: the trust strip currently shows FreeTour.com only. The listing
URL is `https://www.freetour.com/company/97387`.

Blog Guide Note is designed for the right column of the Wix blog index. It
combines Yusuf's editorial note with a small `Plan your visit` tools card
linking to `/berlin-tools`. Use it as a Custom Element, not an iframe, so the
card can fit the column width. Suggested desktop element height: `960-980px`.

Blog Index is the recommended replacement for the Wix-native `/blog` feed when
Yusuf is ready to rebuild that page. Use one full-width Custom Element section:

```html
<bw-blog-index></bw-blog-index>
<script src="https://fenerszymanski.github.io/berlinwalk-widgets/blog-index/blog-index-element.js?v=2"></script>
```

## Blog Custom Code

Add these through Wix Custom Code, not as iframe embeds. They self-skip when the
current URL is not a blog post.

```html
<script src="https://fenerszymanski.github.io/berlinwalk-widgets/js/blog-sidebar-inject.js?v=24" defer></script>
<script src="https://fenerszymanski.github.io/berlinwalk-widgets/js/blog-journey-inject.js?v=8" defer></script>
```

`blog-sidebar-inject.js` builds a desktop-only `On this page` sidebar from
visible H2/H3 headings, adds compact share buttons, adds a small `Blog Home` /
`Categories` block inside that same sidebar, and shortens the floating booking
CTA copy to `Book Now`. The sidebar hides below 900px, disappears near the
article end, sits close to the article edge, and stays anchored near the top of
the viewport so the index gets the full remaining height before it needs
internal scrolling. In v24, it waits until the site header/menu has cleared
before becoming visible. It no longer injects any blog
navigation into the Wix-managed post header or article body, avoiding the
show-hide-show flicker and Quick Summary rerender.

`blog-journey-inject.js` lightly polishes article body typography, removes the
deprecated end-of-post tour CTA banner if an old helper still injects it, adds the
mobile `Blog Home` / category chip row near the top of the article before
waiting for data, adds the mobile `In this guide` chip row, injects one
topic-aware inline tool prompt, and adds a topic-aware `Next step` module near
the article end. It hides the photo-led `Walk It` card on mobile, uses a generic
tool image when a related tool has no assigned icon, adds a sticky back-to-top
arrow, reads `blog-index/data.json`, recommends related guides and tools, and tracks
`bw_blog_tool_prompt_*`, `bw_blog_journey_*`, plus `bw_blog_back_top_click`
events.

## Sitewide Custom Code

Add this through Wix Custom Code in Body-end on all pages:

```html
<script src="https://fenerszymanski.github.io/berlinwalk-widgets/js/exit-intent-popup.js" defer></script>
```

`exit-intent-popup.js` waits 30 seconds, then opens a desktop-only exit-intent
dialog once per session when the cursor leaves the top of the viewport. It
skips `/book-berlin-walking-tour` and sub-routes, links the primary CTA to the
free walking tour booking page, and posts Berlin First-Day Survival Guide
signups to the live Velo subscribe endpoint.

Analytics events are sent to `dataLayer` and, when available, `gtag`:
`bw_exit_popup_view`, `bw_exit_popup_book_click`, `bw_exit_popup_pdf_click`,
`bw_exit_popup_submit_success`, `bw_exit_popup_submit_error`, and
`bw_exit_popup_close`.

## Lead Form

Recommended URL:

```text
https://widgets.berlinwalk.com/lead-form/?source=survival-map-manual
```

Recommended Wix element height:

```text
320px
```

If Wix asks for full iframe code instead of just a URL:

```html
<iframe
  src="https://widgets.berlinwalk.com/lead-form/?source=survival-map-manual"
  title="Get the free Berlin First-Day Survival Guide"
  loading="lazy"
  style="width:100%;height:320px;border:0;display:block;"
></iframe>
```

## Quick Summary

Preferred short URL format:

```text
https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/?post=gift-guide
```

Recommended URL format:

```text
https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/?title=Berlin%20Gift%20Guide%20-%20Quick%20Summary&icon=%F0%9F%8E%81&kicker=BERLINWALK.COM%20%E2%80%A2%20TOURIST%20TIPS&i1=**Ampelmann%20products**%20are%20Berlin%E2%80%99s%20most%20iconic%20modern%20souvenirs.&i2=**Chocolate,%20pralines,%20and%20honey**%20are%20some%20of%20the%20safest%20Berlin%20gifts.&i3=**Museum%20shops%20and%20Berliner%20Dom**%20are%20better%20for%20tasteful%20cultural%20gifts.&i4=**Hackescher%20Markt%20and%20Hackesche%20H%C3%B6fe**%20are%20best%20for%20stylish%20browsing.&i5=**The%20best%20gifts%20are%20small%20and%20useful**%20-%20not%20bulky%20tourist%20junk.
```

Add audio with:

```text
&audio=https%3A%2F%2Fstatic.wixstatic.com%2Fmp3%2F5a08a3_a989adc201244c7fb7abf5b7106e8194.mp3
```

Recommended Wix element heights:

```text
Audio + summary: 520px
```

## Free Museums Post Widgets

Use these URLs for `which-berlin-museums-are-free-2026`:

```text
https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/?post=free-museums
https://fenerszymanski.github.io/berlinwalk-widgets/free-museums-map/
https://fenerszymanski.github.io/berlinwalk-widgets/free-museums-compare/
https://fenerszymanski.github.io/berlinwalk-widgets/faq/?post=free-museums
```

## Berlin First-Day Planner Blog Embed

After the live tool page is verified, use this iframe URL in the first-time,
airport-to-Alexanderplatz, and Berlin-in-3-days posts:

```text
https://fenerszymanski.github.io/berlinwalk-widgets/berlin-first-day-planner/?context=blog
```

Recommended first Wix iframe height:

```text
1280px
```

## Ultimate Berlin Trip Planner Blog Embed

Use this URL for the planned `Ultimate Berlin Trip Planner` post:

```text
https://fenerszymanski.github.io/berlinwalk-widgets/ultimate-berlin-trip-planner/?context=blog
```

Recommended first Wix iframe height:

```text
2400px
```

## Berlin Club Dress Code Post Widgets

Use these URLs for `what-to-wear-to-berlin-clubs`:

```text
https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/?post=berlin-club-dress-code
https://fenerszymanski.github.io/berlinwalk-widgets/club-picker/
https://fenerszymanski.github.io/berlinwalk-widgets/faq/?post=berlin-club-dress-code
```

Recommended first Wix iframe height for the Club Picker:

```text
1180px
```

## Hackescher Markt After-Tour Post Widgets

Use these URLs for `what-to-do-near-hackescher-markt-after-walking-tour`:

```text
https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/?post=hackescher-after-tour
https://fenerszymanski.github.io/berlinwalk-widgets/hackescher-after-tour-planner/
https://fenerszymanski.github.io/berlinwalk-widgets/faq/?post=hackescher-after-tour
```

Recommended first Wix iframe height for the Hackescher After-Tour Planner:

```text
1180px
```

## Berlin in July Post Widgets

Use these URLs for `berlin-in-july-2026`:

```text
https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/?post=berlin-in-july-2026
https://fenerszymanski.github.io/berlinwalk-widgets/monthly-weather/?month=july
https://fenerszymanski.github.io/berlinwalk-widgets/daylight-visualizer/?month=july
https://fenerszymanski.github.io/berlinwalk-widgets/month-comparison/?post=berlin-in-july-2026
https://fenerszymanski.github.io/berlinwalk-widgets/itinerary-card/?month=july
https://fenerszymanski.github.io/berlinwalk-widgets/faq/?post=berlin-in-july-2026
https://fenerszymanski.github.io/berlinwalk-widgets/months-nav/?current=july
```

## Berlin in August Post Widgets

Use these URLs for `berlin-in-august-2026`:

```text
https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/?post=berlin-in-august-2026
https://fenerszymanski.github.io/berlinwalk-widgets/monthly-weather/?month=august
https://fenerszymanski.github.io/berlinwalk-widgets/daylight-visualizer/?month=august
https://fenerszymanski.github.io/berlinwalk-widgets/month-comparison/?post=berlin-in-august-2026
https://fenerszymanski.github.io/berlinwalk-widgets/itinerary-card/?month=august
https://fenerszymanski.github.io/berlinwalk-widgets/faq/?post=berlin-in-august-2026
https://fenerszymanski.github.io/berlinwalk-widgets/months-nav/?current=august
```

## Berlin in September Post Widgets

Use these URLs for `berlin-in-september-2026`:

```text
https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/?post=berlin-in-september-2026
https://fenerszymanski.github.io/berlinwalk-widgets/monthly-weather/?month=september
https://fenerszymanski.github.io/berlinwalk-widgets/daylight-visualizer/?month=september
https://fenerszymanski.github.io/berlinwalk-widgets/month-comparison/?post=berlin-in-september-2026
https://fenerszymanski.github.io/berlinwalk-widgets/itinerary-card/?month=september
https://fenerszymanski.github.io/berlinwalk-widgets/faq/?post=berlin-in-september-2026
https://fenerszymanski.github.io/berlinwalk-widgets/months-nav/?current=september
```
