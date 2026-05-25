# BerlinWalk Widgets

Static widgets and Custom Elements for BerlinWalk homepage sections and blog posts.

The project has two active patterns:

- Blog widgets still use normal static pages embedded in Wix with iframe URLs.
- Homepage sections that need SEO-visible content use native Wix Custom Elements
  with light DOM Web Components.

The goal is to avoid Wix "paste HTML" embeds served from `usrfiles.com`, keep code
deployable through GitHub Pages, and make homepage content visible in rendered DOM.

## Widgets

- `lead-form/` - Berlin Survival Map email capture form.
- `quick-summary/` - reusable quick summary and optional audio player.
- `hero-home/` - `bw-hero-home` homepage conversion hero Custom Element.
- `blog-home/` - `bw-blog-home` homepage editorial blog teaser Custom Element.
- `guide-home/` - `bw-guide-home` homepage "Meet Yusuf" teaser section.
- `the-guide/` - `bw-the-guide` standalone The Guide page Custom Element.
- `route-story/` - `bw-route-story` standalone route story map page Custom Element.
- `thank-you/` - `bw-thank-you` post-booking thank-you page Custom Element.
- `free-museums-map/` - post-specific interactive map for free Berlin museum options.
- `free-museums-compare/` - post-specific comparison table for free Berlin museum picks.
- `public-toilets-map/` - live Berlin Open Data public toilet map with nearest-to-user distance.
- `currywurst-finder/` - interactive Berlin currywurst map for the planned best currywurst article.
- `club-picker/` - blog widget for the Berlin club dress-code article; asks five nightlife/outfit questions and returns a club recommendation, backup options, and Door Difficulty rating.
- `stats/` - deprecated hidden no-op; remove the old Stats section from Wix because hero now carries the facts.
- `how-it-works/` - `bw-how-it-works` homepage 3-step walking timeline Custom Element.
- `tools-home/` - `bw-tools-home` homepage tools preview Custom Element.
- `testimonials/` - `bw-testimonials` homepage testimonial carousel Custom Element.
- `gallery/` - `bw-gallery` homepage gallery Custom Element.
- `tools-hub/` - `bw-tools-hub` tools hub Custom Element.
- `site-footer/` - `bw-site-footer` site footer Custom Element.
- `why/` - `bw-why` homepage "Why Walk With Me?" Custom Element.
- `route/` - `bw-route` homepage interactive illustrated route map Custom Element.
- `faq/` - `bw-faq` homepage FAQ Custom Element, plus existing iframe FAQ files for blog posts.
- `js/blog-sidebar-inject.js` - sitewide Wix Custom Code helper for desktop blog post "On this page" sidebars.
- `js/exit-intent-popup.js` - sitewide desktop-only exit-intent popup with booking CTA and Berlin Survival Map signup.

## Project Memory

Homepage Custom Elements follow the `stats/stats-element.js` and
`route/route-element.js` pattern:

- Light DOM, no Shadow DOM.
- Scoped CSS by component class prefix.
- No `postMessage`, no Google Fonts loader, no external dependencies beyond JSON
  data fetches where needed.
- `connectedCallback` render/setup and `disconnectedCallback` cleanup.
- IntersectionObserver entrance animation with `prefers-reduced-motion` support.
- Guard `customElements.define()` with `customElements.get()`.

Current homepage Custom Element source URLs:

| Section | Tag | Source URL | Notes |
| --- | --- | --- | --- |
| How It Works | `bw-how-it-works` | `https://fenerszymanski.github.io/berlinwalk-widgets/how-it-works/how-it-works-element.js` | 3-step timeline. |
| Hero Home | `bw-hero-home` | `https://fenerszymanski.github.io/berlinwalk-widgets/hero-home/hero-home-element.js` | Homepage conversion hero with real tour photo, booking CTA, route, proof points. |
| Blog Home | `bw-blog-home` | `https://fenerszymanski.github.io/berlinwalk-widgets/blog-home/blog-home-element.js` | Homepage `Berlin Travel Notes` editorial blog teaser. |
| Blog Guide Note | `bw-blog-guide-note` | `https://fenerszymanski.github.io/berlinwalk-widgets/blog-guide-note/blog-guide-note-element.js` | Compact right-column editorial note for the Wix blog index, using Yusuf's tour photo. |
| Guide Home | `bw-guide-home` | `https://fenerszymanski.github.io/berlinwalk-widgets/guide-home/guide-home-element.js` | Homepage "Meet Yusuf" teaser linking to `/the-guide`. |
| Tools Home | `bw-tools-home` | `https://fenerszymanski.github.io/berlinwalk-widgets/tools-home/tools-home-element.js` | Homepage tools preview. |
| Testimonials | `bw-testimonials` | `https://fenerszymanski.github.io/berlinwalk-widgets/testimonials/testimonials-element.js` | Trust strip shows FreeTour.com only. |
| Gallery | `bw-gallery` | `https://fenerszymanski.github.io/berlinwalk-widgets/gallery/gallery-element.js` | Homepage image gallery. |
| Tools Hub | `bw-tools-hub` | `https://fenerszymanski.github.io/berlinwalk-widgets/tools-hub/tools-hub-element.js` | Useful tools hub. |
| Site Footer | `bw-site-footer` | `https://fenerszymanski.github.io/berlinwalk-widgets/site-footer/site-footer-element.js` | Global footer with booking CTA, meeting point, planning links, and partner tools link. |
| The Guide | `bw-the-guide` | `https://fenerszymanski.github.io/berlinwalk-widgets/the-guide/the-guide-element.js` | Standalone guide profile/trust page for `/the-guide`. |
| Route Story | `bw-route-story` | `https://fenerszymanski.github.io/berlinwalk-widgets/route-story/route-story-element.js` | Standalone `/berlin-walking-tour-route` page with a 12-stop story map built around what visitors understand at each stop. |
| Thank You | `bw-thank-you` | `https://fenerszymanski.github.io/berlinwalk-widgets/thank-you/thank-you-element.js` | Post-booking confirmation page for `/thank-you-page`; hides the global sticky booking CTA and Wix's forced `#thankYouPage1` confirmation section, shows Google Calendar + Apple/Outlook `.ics` links when Wix exposes a parseable booking date/time, renders a Tour Day Assistant with countdown, Open-Meteo forecast, outfit advice, and meeting-point map, and shows a change/cancel card that uses a detected or attributed manage-booking URL when available. |
| Why Walk With Me | `bw-why` | `https://fenerszymanski.github.io/berlinwalk-widgets/why/why-element.js` | White cards, yellow accent bars, Lucide icons. |
| The Route | `bw-route` | `https://fenerszymanski.github.io/berlinwalk-widgets/route/route-element.js` | Interactive illustrated map with 12 pins on cream background. |
| FAQ | `bw-faq` | `https://fenerszymanski.github.io/berlinwalk-widgets/faq/faq-element.js` | Use attribute `post="home"`. |

Important live notes:

- Yusuf handles Wix Studio placement, Custom Element setup, publishing, and
  `git push` unless explicitly requested.
- Site ID for Wix reads or safe automation work:
  `12ee5ea0-70a7-492f-8020-ffb27cbb630f`.
- Wix MCP may help with CMS, blog posts, SEO metadata, Custom Embeds, site
  publishing, and page reads. Wix Studio canvas placement and Custom Element UI
  setup are manual.
- `faq/faq-element.js` reads from `faq/data.json` and emits its own FAQPage
  JSON-LD. Keep `faq/index.html` and `faq/inject.js` intact for blog posts.
- Do not remove `home` from any FAQ schema injection map until the live homepage
  `bw-faq` schema has been verified in Google's Rich Results Test.
- `route/route-element.js` builds the dashed path dynamically from
  `route/data.json` stop coordinates. Future pin coordinate changes should be
  data-only.
- `testimonials/data.json` currently uses the FreeTour.com listing link:
  `https://www.freetour.com/company/97387`. GuruWalk and Google trust cards were
  removed because there are no listings there.

## Local Preview

For static iframe widgets, open the widget HTML file directly in a browser:

```bash
open berlinwalk-widgets/lead-form/index.html
```

For Custom Elements that fetch JSON, serve the repo root locally:

```bash
cd "/Users/yusufucuz/Documents/New project/berlinwalk-widgets"
python3 -m http.server 8000
```

Then open test pages such as:

- `http://localhost:8000/_test-all-elements.html`
- `http://localhost:8000/stats/test-element.html`
- `http://localhost:8000/why/test-element.html`
- `http://localhost:8000/route/test-element.html`
- `http://localhost:8000/route-story/`

## Hosting

Deploy through GitHub Pages from the `main` branch.

Current public URL structure:

```text
https://fenerszymanski.github.io/berlinwalk-widgets/<widget>/
```

## Wix Embed

For blog widgets, use Wix "Embed a Site" / iframe URL instead of "Paste HTML
code". This keeps the code out of Wix's `usrfiles.com/html/...` iframe hosting.

For homepage SEO sections, use Wix Studio Custom Element:

- Source URL: the component JS file on GitHub Pages.
- Tag Name: the `bw-*` tag.
- Attributes: only when the component requires them, for example
  `bw-faq post="home"`.

Suggested Wix embed height for the lead form: `320px`.

Wix blog embeds may use a single fixed height across desktop and mobile.
Use `320px` as the safe fallback height; the Wix auto-resize listener should
still tighten the iframe when it can.

Suggested Wix embed height for quick summaries:

- `audio + summary`: `520px`

## Blog Custom Code Helpers

These are loaded through Wix Custom Code rather than iframe embeds:

- `js/lead-form-inject.js` - injects the Berlin Survival Map lead form mid-post.
- `js/cta-inject.js` - injects the global tour CTA near the end of posts.
- `js/blog-sidebar-inject.js` - builds a desktop-only sticky "On this page"
  sidebar from visible H2/H3 headings and puts a compact `Blog Home` /
  `Categories` block above the index inside that same sidebar. It shortens the
  floating booking CTA copy to `Book Now`. The sidebar hides below 900px, starts
  at the top of the desktop viewport, disappears near the article end, sits
  close to the article edge, and its long heading list uses the remaining
  viewport height before it needs to scroll inside the card. It waits until the
  site header/menu has cleared before becoming visible. It no longer injects a
  mini-nav into Wix-managed blog header or article body DOM, because that caused
  header/Quick Summary flicker. The script skips
  non-`/post/` URLs.
- `js/exit-intent-popup.js` - sitewide desktop-only exit-intent popup for
  non-booking pages. It waits 30 seconds, opens once per session through
  `sessionStorage`, links the primary CTA to the booking route, and posts the
  Berlin Survival Map signup to `https://www.berlinwalk.com/_functions/subscribe`.
