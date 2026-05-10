# BerlinWalk Widgets

Static widgets for BerlinWalk blog posts.

The goal is to avoid Wix "paste HTML" embeds that are served from `usrfiles.com`.
Instead, each widget lives as a normal static page and can be embedded in Wix with
an iframe URL.

## Widgets

- `lead-form/` - Berlin Essentials email capture form.
- `quick-summary/` - reusable quick summary and optional audio player.

## Local Preview

Open the widget HTML file directly in a browser:

```bash
open berlinwalk-widgets/lead-form/index.html
```

## Hosting

Deploy the contents of this folder to a static host such as Cloudflare Pages,
Netlify, Vercel, or GitHub Pages.

Recommended public URL structure:

```text
https://widgets.berlinwalk.com/lead-form/
```

## Wix Embed

Use Wix "Embed a Site" / iframe URL instead of "Paste HTML code".
This keeps the code out of Wix's `usrfiles.com/html/...` iframe hosting.

Suggested Wix embed height for the lead form: `320px`.

Wix blog embeds may use a single fixed height across desktop and mobile.
Use `320px` as the shared value to avoid iframe-internal scrolling on mobile
without leaving a large blank area on desktop.

Suggested Wix embed height for quick summaries:

- `audio + summary`: `520px`
