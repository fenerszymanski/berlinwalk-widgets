/* Essential tool content boots before Wix. A private fixed surface follows an
 * owned spacer in the Wix slot; the live iframe never enters Wix's remount tree. */
(function () {
  'use strict';
  var match = location.pathname.match(/^\/tools\/([^/]+)\/?$/);
  if (!match || !new URLSearchParams(location.search).has('bwFastTool')) return;
  var slug = decodeURIComponent(match[1]);
  var previous = window.BW_FAST_INLINE;
  if (previous && previous.slug === slug) return;
  if (previous) previous.stop();
  var url = '', host = null, spacer = null, portal = null, frame = null, observer, resizeObserver, queued = false, stopped = false;
  var height = 1200, frameLoadCount = 0;
  var tracked = ['berlin-ticket-machine-simulator', 'berlin-address-time-machine', 'berlin-hotel-location-checker', 'berlin-dates-check', 'berlin-doner-price-index'];
  window.BW_FAST_INLINE = { slug: slug, stop: stop };
  function stop() {
    stopped = true;
    if (observer) observer.disconnect();
    if (resizeObserver) resizeObserver.disconnect();
    window.removeEventListener('message', receive);
    window.removeEventListener('resize', schedule);
    document.removeEventListener('scroll', schedule, true);
    if (portal) portal.remove();
    if (host && host.shadowRoot) { host.shadowRoot.textContent = ''; host.shadowRoot.appendChild(document.createElement('slot')); host.removeAttribute('aria-owns'); }
  }
  function valid(value) {
    try { var u = new URL(value); return u.origin === 'https://fenerszymanski.github.io' && u.pathname.startsWith('/berlinwalk-widgets/') && u.searchParams.get('surface') === 'tool-page' ? u.href : ''; } catch (_) { return ''; }
  }
  function schedule() { if (queued || stopped) return; queued = true; requestAnimationFrame(place); }
  function place() {
    queued = false;
    if (!portal || !spacer || !spacer.isConnected) return;
    var entry = portal.querySelector('.entry');
    var total = height + entry.getBoundingClientRect().height;
    if (Math.abs(spacer.getBoundingClientRect().height - total) > 1) spacer.style.height = Math.ceil(total) + 'px';
    var r = spacer.getBoundingClientRect();
    portal.style.left = r.left + 'px'; portal.style.top = r.top + 'px'; portal.style.width = r.width + 'px';
    portal.style.visibility = r.width > 0 ? 'visible' : 'hidden';
  }
  function deferNative() {
    if (!host) return;
    var native = host.querySelectorAll('iframe');
    for (var i = 0; i < native.length; i++) {
      if (!native[i].hasAttribute('data-bw-fast-hidden')) {
        native[i].loading = 'lazy'; native[i].setAttribute('data-bw-fast-hidden', '1');
      }
    }
  }
  function mount() {
    if (stopped || !url || !document.body) return;
    if (!portal) {
      portal = document.createElement('div'); portal.id = 'bw-fast-inline-surface'; portal.setAttribute('role', 'group'); portal.setAttribute('aria-label', 'Interactive Berlin tool');
      portal.style.cssText = 'position:fixed;z-index:5;left:0;top:0;width:100%;visibility:hidden;background:#fff;box-sizing:border-box';
      var entry = document.createElement('div'); entry.className = 'entry'; entry.textContent = 'START HERE';
      entry.style.cssText = 'box-sizing:border-box;padding:13px 16px 22px;color:#123D18;background:#f8f9f3;font:700 11px/1.4 Arial,sans-serif;letter-spacing:.07em'; portal.appendChild(entry);
      frame = document.createElement('iframe'); frame.title = 'Berlin tool'; frame.name = 'bw-fast-tool'; frame.loading = 'eager'; frame.setAttribute('allow', 'fullscreen; geolocation *'); frame.setAttribute('scrolling', 'no');
      frame.style.cssText = 'display:block;width:100%;height:1200px;border:0;background:#fff'; frame.setAttribute('data-bw-fast-tool-frame', slug);
      if (tracked.indexOf(slug) !== -1) { frame.setAttribute('data-bw-tool-frame', '1'); frame.setAttribute('data-bw-tool-slug', slug); }
      frame.addEventListener('load', function () { frameLoadCount++; portal.setAttribute('data-bw-fast-load-count', frameLoadCount); portal.setAttribute('data-bw-fast-loaded-ms', Math.round(performance.now())); });
      frame.src = url; portal.appendChild(frame); document.body.appendChild(portal); portal.setAttribute('data-bw-fast-request-ms', Math.round(performance.now()));
    }
    var current = document.getElementById('comp-mozco5et');
    if (!current) return;
    if (current !== host || !spacer || !spacer.isConnected) {
      host = current;
      var shadow = host.shadowRoot || host.attachShadow({ mode: 'open' });
      shadow.textContent = '';
      spacer = document.createElement('div'); spacer.setAttribute('aria-hidden', 'true'); spacer.style.cssText = 'display:block;width:100%;height:1251px'; shadow.appendChild(spacer);
      host.setAttribute('data-bw-fast-tool', slug); host.setAttribute('aria-owns', portal.id);
      if (resizeObserver) resizeObserver.disconnect();
      if (typeof ResizeObserver === 'function') { resizeObserver = new ResizeObserver(schedule); resizeObserver.observe(spacer); }
    }
    deferNative(); schedule();
  }
  function receive(event) {
    if (!frame || !frame.isConnected || event.source !== frame.contentWindow || event.origin !== 'https://fenerszymanski.github.io') return;
    var d = event.data;
    if (!d || d.type !== 'bw-resize' || typeof d.height !== 'number' || !isFinite(d.height) || d.height <= 0 || d.height > 30000) return;
    height = Math.ceil(d.height); frame.style.height = height + 'px'; portal.setAttribute('data-bw-fast-ready-ms', Math.round(performance.now())); schedule();
  }
  window.addEventListener('message', receive);
  window.addEventListener('resize', schedule, { passive: true });
  document.addEventListener('scroll', schedule, { passive: true, capture: true });
  observer = new MutationObserver(mount); observer.observe(document.documentElement, { childList: true, subtree: true });
  fetch('https://fenerszymanski.github.io/berlinwalk-widgets/tools-hub/tool-loading-links.json?v=20261014', { credentials: 'omit' })
    .then(function (r) { if (!r.ok) throw Error('Missing links'); return r.json(); })
    .then(function (links) { url = valid(links[slug]); mount(); }).catch(function () {});
})();
