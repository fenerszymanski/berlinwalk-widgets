# Blog stray `Privacy Settings` + native comments module fix — 2026-07-25

Reported by Yusuf with two screenshots: a stray `Privacy Settings` line sitting in
the `/blog` CTA band just above the footer, and a Wix native comments box
("Commenting on this post isn't available anymore") at the end of a blog post.
Neither was there in earlier builds.

## Root causes

1. **Stray `Privacy Settings`** — `installConsentSettingsUi()` in
   `js/blog-journey-inject.js` ran `addFooterLink()` with a generic fallback:
   `document.querySelector('.bw-site-footer footer, .bw-site-footer, footer')`.
   A comma selector returns the first match in document order, so as soon as our
   own footer had not mounted yet the button landed in whatever `footer` came
   first in the page:
   - `/post/*` → Wix's `footer[data-hook="post-footer"]` (tags/views row), so the
     line rendered centred under the share icons.
   - `/blog` → the blog index CTA band `footer.bw-footer-band`, so the line
     rendered at `x: 0` next to "Want Berlin to click in real life?".
   - `/book-berlin-walking-tour/*` also exposes `footer.bw-cal-summary`.
   The real control is rendered by the guarded footer restore embed
   (`#bw-site-footer-restore .bw-footer-bottom-links button[data-bw-privacy-settings]`),
   so the injected one was always a duplicate.

2. **Native comments module** — Wix now renders blog end matter inside
   `footer[data-hook="post-footer"]` and mounts the comments module lazily. The
   old `hideNativeEndMatter()` heuristic therefore either ran too early to see it,
   or (when it did see it) matched the whole post footer, which would have hidden
   the tags, view count and like row along with the comments.

## Fix

`js/blog-journey-inject.js` (commit `c7cd4b94`):

- The privacy control is only ever placed in the global site footer
  (`.bw-site-footer` / `#bw-site-footer-restore`), never in a `footer` that sits
  inside `[data-hook="post"]`, `[data-hook="post-footer"]`, `article`, `main`,
  `.bw-blog-index` or `.bw-footer-band`. Any stray marked button outside the site
  footer is removed on every pass.
- A few throttled scroll passes were added so long pages (the blog index, long
  posts) still get the control wired when the site footer mounts after the last
  timed pass.
- Comments were taken out of the fuzzy end-matter pass and given a narrow
  `hideNativeComments()` pass: it only hides a wrapper whose *entire* text is
  comments UI (so the tags/views/like row can never be swallowed), refuses to
  touch a module that carries real reader comments, and re-runs on timed +
  throttled scroll passes to catch late mounts.
- Related Posts and native share hiding are unchanged.

Wix custom embed `BerlinWalk Blog Journey Helper`
(`6f8e5ac0-1447-455e-a340-224f43084b42`) repinned `cbe051a3` → `c7cd4b94`,
revision 26 → 27, still `ESSENTIAL` / `bodyEnd` / enabled. No global Wix publish.

## Local harness

`qa-blog-journey.mjs` boots the real script in jsdom against DOM fixtures copied
from the live site (post page, post page with a late-mounting footer, blog index,
post with real reader comments, post with a lazily mounted comments module,
Related Posts regression). It needs an ad-hoc `npm i jsdom` — jsdom is not a repo
dependency.

- `local-harness-fixed.txt` — 24/24 checks pass on `c7cd4b94`
- `local-harness-baseline.txt` — 14/24 on the previously live `cbe051a3`, failing
  exactly the stray-placement and late-comments checks

Native share hiding depends on `getBoundingClientRect`, which jsdom always
reports as 0, so it is not asserted in the harness; that code path is unchanged.

## Live QA (2026-07-25, after repin)

Verified in-browser with the new pin active (`@c7cd4b94` in `document.scripts`):

| Page | Result |
|---|---|
| `/post/berlin-courtyards-hoefe` | post footer holds only the tags row; 1 privacy control, in site footer; 0 strays; consent modal opens on click |
| `/post/koepenick-berlin` (desktop + 390px) | same; 0 console errors; `overflowX` 0 |
| `/blog` | 0 strays in the CTA band before and after the footer mounts; 1 control in the site footer |
| `/` and `/berlin-tools` | 1 control, in the site footer |
| `/book-berlin-walking-tour/berlin-free-walking-tour-tip-based` | 1 control in the site footer; `footer.bw-cal-summary` clean |

End-to-end comments check on the live post page: a replica of the reported
comments module was injected into `footer[data-hook="post-footer"]`, then one
scroll pass. Result — replica went `display: block` → `display: none`, height 0,
`aria-hidden="true"`, `data-bw-native-blog-end-hidden="1"`; the tags/views row
stayed `display: flex`; post footer and article body untouched. The replica was
removed afterwards (client-side only, no site mutation).

## Open note

The native comments module could not be reproduced as an anonymous visitor:
5 posts (both `commentingEnabled: true` and `false`), 390 / 800 / 1512 px, hard
load and SPA navigation, all consent categories granted, and no comments network
request fired at all. Across the 262 published posts, `metrics.comments` is 0 and
80 posts still have `commentingEnabled: true`. Most likely the module only renders
for a logged-in Wix session, which is how the screenshot was taken. The hardened
pass hides it whenever it does appear; if Yusuf wants it gone at the source, the
Comments element has to be removed from the Wix Blog post page in the editor.
