# Berlin Time Detective embed handoff

**Status: UNPUBLISHED.** No live page, GitHub Pages publication, Wix page, or outbound URL was changed by this handoff.

The recommended future surface is a dedicated Wix page containing one responsive iframe. Publish the static package to GitHub Pages first, then replace the placeholder below with the verified published package URL. Do not present the placeholder as a live URL.

```html
<iframe
  src="https://YOUR-GITHUB-PAGES-URL/berlin-time-detective/"
  title="Berlin Time Detective"
  loading="lazy"
  referrerpolicy="no-referrer"
  sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
  allow="clipboard-write; web-share"
  style="display:block;width:100%;min-height:900px;border:0"
></iframe>
```

`allow-scripts` is required for the game. `allow-same-origin` keeps the static package's normal storage and module behavior when the package is served from its published origin. `allow-popups` and `allow-popups-to-escape-sandbox` let an eligible booking link open in a separate tab without navigating the host. No `allow-top-navigation` is included, so the frame cannot navigate the host. `loading="lazy"` is suitable for a page section below the fold; use `loading="eager"` only when the game is the first viewport. `referrerpolicy="no-referrer"` limits referrer leakage.

The production package emits measurement as a DOM `CustomEvent` inside the frame only. Cross-origin Wix cannot observe those DOM events yet. There is no production `postMessage` bridge and no network analytics transport. The retained `qa/phase-4-embed-harness.html` installs a local same-origin test bridge explicitly: it copies only the documented allowlist into a `postMessage` and displays the received event for QA. A reviewed production bridge or analytics transport is a future manual integration requiring explicit approval; that bridge is not part of the release package.

The selected game surface already contains the exact BerlinWalk wordmark. Do not add a global BerlinWalk attribution badge around this dedicated game iframe.
