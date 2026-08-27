/* date-check-skeleton.js - early widget mount + loading card for
 * /berlin-dates-check.
 *
 * The Wix SSR HTML ships the Date Check host div empty. Wix mounts its own
 * iframe only after client hydration, which put the first useful paint at
 * 12s+ on a phone. This helper, loaded at parse time from the head embed
 * (with the Date Check page embed as a late fallback loader):
 *
 *   1. injects the REAL widget iframe into the host as soon as the host div
 *      is parsed, with arrival/nights forwarded from the page URL, so the
 *      widget loads in parallel with the Wix boot;
 *   2. paints a dark branded loading card over the host until the widget
 *      posts its first bw-resize height;
 *   3. hides the duplicate iframe Wix mounts later, and re-adds ours in the
 *      same mutation batch if hydration wipes it (one cached sub-second
 *      reload, measured);
 *   4. pre-sets data-bw-date-check-query-forwarded so the page embed treats
 *      our iframe as already parameterised and never re-navigates it.
 *
 * The page embed's own bw-resize handler then sizes and scrolls our iframe,
 * because it targets the first iframe inside the host.
 */
(function () {
  if (window.__bwDcSkel) return;
  window.__bwDcSkel = true;

  var HOST_ID = 'comp-mt1ukxpy';
  var TOOL_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/berlin-dates-check/index.html';
  var DEADLINE = Date.now() + 60000;
  var skeletonDone = false;
  var observer = null;
  var lastHeight = 0;

  function onRoute() {
    return (location.pathname.replace(/\/+$/, '') || '/') === '/berlin-dates-check';
  }

  function isSafeArrival(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
    var parts = value.split('-').map(Number);
    var date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 12));
    return date.getUTCFullYear() === parts[0] && date.getUTCMonth() === parts[1] - 1 && date.getUTCDate() === parts[2];
  }

  // The widget runs cross-origin in an iframe, so its own readUtm() sees this
  // iframe's URL, not the page's. Wix's referrer policy strips the query from
  // document.referrer too, so campaign attribution is only recoverable by
  // forwarding it onto the frame src here. Without this every arrival lands in
  // LeadAssetEvents with empty utm columns and the blog card looks unclicked.
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id'];

  function safeUtm(value) {
    if (typeof value !== 'string' || !value) return '';
    if (value.length > 120) return '';
    return /^[A-Za-z0-9_.\-]+$/.test(value) ? value : '';
  }

  function forwardUtm(pageUrl, frameUrl) {
    for (var i = 0; i < UTM_KEYS.length; i += 1) {
      var key = UTM_KEYS[i];
      var clean = safeUtm(pageUrl.searchParams.get(key));
      if (clean) frameUrl.searchParams.set(key, clean);
    }
  }

  function toolSrc() {
    var url;
    try { url = new URL(TOOL_URL); } catch (e) { return TOOL_URL; }
    var page;
    try { page = new URL(window.location.href); } catch (e) { return url.toString(); }
    var arrival = page.searchParams.get('arrival') || '';
    var nights = page.searchParams.get('nights') || '';
    var status = page.searchParams.get('lead_asset_status') || '';
    if (isSafeArrival(arrival) && /^[1-7]$/.test(nights)) {
      url.searchParams.set('arrival', arrival);
      url.searchParams.set('nights', nights);
      if (status === 'confirmed' || status === 'sent') url.searchParams.set('lead_asset_status', status);
    }
    forwardUtm(page, url);
    return url.toString();
  }

  function ensureFrame() {
    if (!onRoute() || Date.now() > DEADLINE) return;
    var host = document.getElementById(HOST_ID);
    if (!host) return;
    if (host.querySelector('iframe[data-bw-early]')) return;
    // If Wix's own iframe is already sized (fast load, or this script arrived
    // very late), the page works without us: do not mount a second widget.
    var wixFrame = host.querySelector('iframe');
    if (wixFrame && wixFrame.style && wixFrame.style.height) return;
    if (!document.getElementById('bw-dc-early-s')) {
      var css = document.createElement('style');
      css.id = 'bw-dc-early-s';
      // Hide Wix's own late iframe. It still runs the widget and posts its own
      // bw-resize, but both this script and the page embed ignore it by source,
      // so its height (garbage at zero width) is irrelevant and it takes no space.
      css.textContent = '#' + HOST_ID + ' iframe:not([data-bw-early]){display:none!important;width:0!important;height:0!important;}'
        + '#' + HOST_ID + ' iframe[data-bw-early]{display:block;width:100%;border:0;min-height:300px;}';
      (document.head || document.documentElement).appendChild(css);
    }
    var frame = document.createElement('iframe');
    frame.setAttribute('data-bw-early', '1');
    frame.setAttribute('data-bw-date-check-query-forwarded', '1');
    frame.setAttribute('title', 'Berlin Date Check');
    frame.src = toolSrc();
    // After a hydration wipe the replacement iframe reloads from cache; hold the
    // last reported height with `height` (NOT min-height) so the page does not
    // collapse during the reload but the iframe can still SHRINK when the widget
    // content shrinks (e.g. the lead gate collapses after submit). A min-height
    // floor here locked the iframe taller than its content and left a large
    // blank gap on returning visitors.
    if (lastHeight) frame.style.height = lastHeight + 'px';
    host.insertBefore(frame, host.firstChild);
  }

  function ensureSkeleton() {
    if (skeletonDone || !onRoute() || Date.now() > DEADLINE) return;
    var host = document.getElementById(HOST_ID);
    if (!host || host.querySelector('#bw-dc-skel')) return;
    if (!document.getElementById('bw-dc-skel-s')) {
      var style = document.createElement('style');
      style.id = 'bw-dc-skel-s';
      style.textContent = '#bw-dc-skel{position:absolute;inset:0;z-index:5;display:flex;flex-direction:column;justify-content:center;gap:12px;padding:7%;box-sizing:border-box;background-color:#102414;background-image:linear-gradient(rgba(250,250,245,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(250,250,245,.05) 1px,transparent 1px);background-size:34px 34px;color:#FAFAF5;pointer-events:none}'
        + '#bw-dc-skel b{color:#C5E1A5;font:600 11px/1 "IBM Plex Mono","SFMono-Regular",Consolas,monospace;letter-spacing:.18em}'
        + '#bw-dc-skel span{font:600 clamp(19px,4.6vw,30px)/1.15 Fraunces,Georgia,serif}'
        + '#bw-dc-skel i{display:block;height:9px;border-radius:5px;background:rgba(250,250,245,.28);animation:bwdcp 1.3s ease-in-out infinite}'
        + '#bw-dc-skel i:nth-of-type(2){animation-delay:.2s}#bw-dc-skel i:nth-of-type(3){animation-delay:.4s}'
        + '@keyframes bwdcp{0%,100%{opacity:.45}50%{opacity:1}}'
        + '@media (prefers-reduced-motion:reduce){#bw-dc-skel i{animation:none}}';
      (document.head || document.documentElement).appendChild(style);
    }
    var card = document.createElement('div');
    card.id = 'bw-dc-skel';
    card.setAttribute('aria-hidden', 'true');
    card.innerHTML = '<b>BERLIN DATE CHECK</b><span>Reading your Berlin dates…</span><i style="width:74%"></i><i style="width:52%"></i><i style="width:36%"></i>';
    if (window.getComputedStyle(host).position === 'static') {
      host.style.setProperty('position', 'relative', 'important');
    }
    host.appendChild(card);
  }

  function removeSkeleton() {
    skeletonDone = true;
    var card = document.getElementById('bw-dc-skel');
    if (card) card.remove();
    var style = document.getElementById('bw-dc-skel-s');
    if (style) style.remove();
  }

  function tick() {
    if (Date.now() > DEADLINE) {
      if (observer) observer.disconnect();
      removeSkeleton();
      return;
    }
    if (!onRoute()) {
      var stray = document.getElementById('bw-dc-skel');
      if (stray) stray.remove();
      return;
    }
    ensureFrame();
    ensureSkeleton();
  }

  window.addEventListener('message', function (event) {
    var data = event.data || {};
    if (data.src !== 'berlin-dates-check' || data.type !== 'bw-resize') return;
    // Only trust the widget running inside OUR early iframe. Wix mounts a second
    // (parked, off-screen) iframe that also runs the widget and posts its own
    // bw-resize; accepting that height polluted the re-add hold value.
    var early = document.querySelector('#' + HOST_ID + ' iframe[data-bw-early]');
    if (!early || event.source !== early.contentWindow) return;
    var height = Number(data.height);
    if (isFinite(height) && height >= 200 && height <= 20000) lastHeight = Math.ceil(height);
    // Never let a stale inline min-height keep the iframe taller than its
    // content. The page embed owns the explicit height; we just clear any floor
    // so the iframe can track a shrink (the CSS 300px floor still applies).
    early.style.minHeight = '';
    removeSkeleton();
  });

  observer = new MutationObserver(tick);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  tick();
  document.addEventListener('DOMContentLoaded', tick);
})();
