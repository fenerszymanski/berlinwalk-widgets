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
| Guide Home | `https://fenerszymanski.github.io/berlinwalk-widgets/guide-home/guide-home-element.js` | `bw-guide-home` | none |
| Tools Home | `https://fenerszymanski.github.io/berlinwalk-widgets/tools-home/tools-home-element.js` | `bw-tools-home` | none |
| Testimonials | `https://fenerszymanski.github.io/berlinwalk-widgets/testimonials/testimonials-element.js` | `bw-testimonials` | none |
| Gallery | `https://fenerszymanski.github.io/berlinwalk-widgets/gallery/gallery-element.js` | `bw-gallery` | none |
| Tools Hub | `https://fenerszymanski.github.io/berlinwalk-widgets/tools-hub/tools-hub-element.js` | `bw-tools-hub` | none |
| Site Header | `https://fenerszymanski.github.io/berlinwalk-widgets/site-header/site-header-element.js` | `bw-site-header` | none |
| Berlin Quiz (homepage) | `https://fenerszymanski.github.io/berlinwalk-widgets/berlin-quiz/berlin-quiz-element.js` | `bw-berlin-quiz` | none |
| Site Footer | `https://fenerszymanski.github.io/berlinwalk-widgets/site-footer/site-footer-element.js` | `bw-site-footer` | none |
| The Guide | `https://fenerszymanski.github.io/berlinwalk-widgets/the-guide/the-guide-element.js` | `bw-the-guide` | none |
| Book Hero (above Wix Bookings widget) | `https://fenerszymanski.github.io/berlinwalk-widgets/book/book-element.js` | `bw-book-hero` | none |
| Book Details (below Wix Bookings widget) | `https://fenerszymanski.github.io/berlinwalk-widgets/book/book-element.js` | `bw-book-details` | none |
| Why Walk With Me | `https://fenerszymanski.github.io/berlinwalk-widgets/why/why-element.js` | `bw-why` | none |
| The Route | `https://fenerszymanski.github.io/berlinwalk-widgets/route/route-element.js` | `bw-route` | none |
| FAQ | `https://fenerszymanski.github.io/berlinwalk-widgets/faq/faq-element.js` | `bw-faq` | `post="home"` |

FAQ note: `bw-faq` emits homepage FAQPage JSON-LD from `faq/data.json`. Keep the
old FAQ iframe files and `inject.js` for blog posts until live Rich Results
testing confirms the homepage Custom Element schema is detected.

Route note: `bw-route` pin coordinates and the dashed path come from
`route/data.json`, so future coordinate updates should only touch data.

Testimonials note: the trust strip currently shows FreeTour.com only. The listing
URL is `https://www.freetour.com/company/97387`.

## Blog Custom Code

Add these through Wix Custom Code, not as iframe embeds. They self-skip when the
current URL is not a blog post.

```html
<script src="https://fenerszymanski.github.io/berlinwalk-widgets/js/blog-sidebar-inject.js?v=2" defer></script>
```

`blog-sidebar-inject.js` builds a desktop-only `On this page` sidebar from the
visible H2/H3 headings in the post body and adds compact share buttons. It hides
below 1500px and falls back to a fixed right rail when Wix wrappers are hard to
measure.

## Lead Form

Recommended URL:

```text
https://widgets.berlinwalk.com/lead-form/?source=menu-post
```

Recommended Wix element height:

```text
320px
```

If Wix asks for full iframe code instead of just a URL:

```html
<iframe
  src="https://widgets.berlinwalk.com/lead-form/?source=menu-post"
  title="Get the free Berlin Essentials PDF"
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
