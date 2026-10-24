/* Essential tool content boots before Wix. A private absolute surface follows an
 * owned spacer in the Wix slot; the live iframe never enters Wix's remount tree. */
(function () {
  'use strict';
  var match = location.pathname.match(/^\/tools\/([^/]+)\/?$/);
  var flag = new URLSearchParams(location.search).get('bwFastTool');
  if (!match || flag === '0' || !(window.BW_FAST_TOOLS_ENABLED || flag === '1')) return;
  var slug = decodeURIComponent(match[1]);
  if (slug === 'berlin-ticket-machine-simulator' && !document.getElementById('bw-ticket-partner-analytics')) {
    var partnerAnalytics = document.createElement('script');
    partnerAnalytics.id = 'bw-ticket-partner-analytics';
    partnerAnalytics.src = 'https://fenerszymanski.github.io/berlinwalk-widgets/js/ticket-partner-analytics.js?v=20261024b';
    partnerAnalytics.async = true;
    document.head.appendChild(partnerAnalytics);
  }
  var previous = window.BW_FAST_INLINE;
  if (previous && previous.slug === slug) return;
  if (previous) previous.stop();
  var secondaryUrls = {"berlin-lakes":"https://fenerszymanski.github.io/berlinwalk-widgets/lake-finder/?surface=tool-page","what-to-pack-berlin":"https://fenerszymanski.github.io/berlinwalk-widgets/rain-outfit/?surface=tool-page","berlin-weather-by-month":"https://fenerszymanski.github.io/berlinwalk-widgets/avgtemp-monthly/?surface=tool-page","transport-ticket-calculator":"https://fenerszymanski.github.io/berlinwalk-widgets/transport-compare/?surface=tool-page","welcomecard-calculator":"https://fenerszymanski.github.io/berlinwalk-widgets/welcomecard-compare/?surface=tool-page","berlin-safety":"https://fenerszymanski.github.io/berlinwalk-widgets/safety-compare/?surface=tool-page","berlin-pools":"https://fenerszymanski.github.io/berlinwalk-widgets/pool-finder/?surface=tool-page","best-month-to-visit-berlin":"https://fenerszymanski.github.io/berlinwalk-widgets/avgtemp-bestmonth/?surface=tool-page"};
  var primaryStop = boot('comp-mozco5et', 'bw-fast-inline-surface', '');
  var secondaryStop = secondaryUrls[slug] ? boot('comp-moznhogf', 'bw-fast-secondary-surface', secondaryUrls[slug]) : null;
  window.BW_FAST_INLINE = { slug: slug, stop: function () { if (secondaryStop) secondaryStop(); primaryStop(); window.BW_FAST_INLINE = null; } };
  function boot(slotId, surfaceId, configuredUrl) {
  var url = valid(configuredUrl), host = null, spacer = null, portal = null, frame = null, observer, resizeObserver, queued = false, stopped = false;
  var height = 1200, frameLoadCount = 0, positionedBody = false, bodyPosition = '', bodyPriority = '', scrollStyle;
  // Spacer height: growth applies at once; a shrink waits for the frame's load event and then until the widget
  // height has held for 700 ms, so the early bw-resize (122 px before the real 1287 px on berlin-3-day-itinerary)
  // never collapses and regrows the page. While the visitor works inside the tool (focus in the frame), shrinks
  // apply at once as before.
  var applied = 1251, shrinkTarget = 0, shrinkDue = 0, shrinkTimer = 0;
  // Known short widgets start near their real height instead of 1200 px: [narrow viewport < 768 px, wide].
  var hint = configuredUrl ? null : {"berlin-weather-by-month":[500,380]}[slug];
  if (hint) { height = hint[innerWidth < 768 ? 0 : 1]; applied = height + 51; }
  var tracked = ['berlin-ticket-machine-simulator', 'berlin-address-time-machine', 'berlin-hotel-location-checker', 'berlin-dates-check', 'berlin-doner-price-index'];
  function stop() {
    stopped = true;
    if (observer) observer.disconnect();
    if (resizeObserver) resizeObserver.disconnect();
    clearTimeout(shrinkTimer);
    window.removeEventListener('message', receive);
    window.removeEventListener('resize', schedule);
    document.removeEventListener('scroll', schedule, true);
    if (document.fonts) document.fonts.removeEventListener('loadingdone', schedule);
    if (portal) portal.remove();
    if (scrollStyle) scrollStyle.remove();
    document.documentElement.removeAttribute('data-bw-fast-document');
    if (positionedBody && document.body.style.getPropertyValue('position') === 'relative') {
      if (bodyPosition) document.body.style.setProperty('position', bodyPosition, bodyPriority); else document.body.style.removeProperty('position');
    }
    if (host && host.querySelector('[data-bw-fast-secondary-source]')) host.querySelector('[data-bw-fast-secondary-source]').remove();
    if (host && host.shadowRoot) { host.shadowRoot.textContent = ''; host.shadowRoot.appendChild(document.createElement('slot')); host.removeAttribute('aria-owns'); }
  }
  function valid(value) {
    try {
      var u = new URL(value);
      if (u.origin !== 'https://fenerszymanski.github.io' || !u.pathname.startsWith('/berlinwalk-widgets/')) return '';
      // Wix warmup HTML can retain a previous CMS URL after a release.
      if (slug === 'berlin-ticket-machine-simulator' && u.pathname.replace(/\/$/, '') === '/berlinwalk-widgets/berlin-ticket-machine-simulator') u.searchParams.set('release', '20261024-arrival-pilot');
      u.searchParams.set('surface', 'tool-page'); return u.href;
    } catch (_) { return ''; }
  }
  function warmupUrl() {
    var node = document.getElementById('wix-warmup-data');
    if (!node || !node.textContent) return '';
    try {
      var budget = 10000;
      function find(value) {
        if (!value || typeof value !== 'object' || --budget < 0) return '';
        if (value[slotId] && value[slotId].url) return valid(value[slotId].url);
        var keys = Object.keys(value);
        for (var i = 0; i < keys.length; i++) { var found = find(value[keys[i]]); if (found) return found; }
        return '';
      }
      return find(JSON.parse(node.textContent));
    } catch (_) { return ''; }
  }
  function schedule() { if (queued || stopped) return; queued = true; requestAnimationFrame(place); }
  function place() {
    queued = false;
    if (stopped || !portal || !spacer || !spacer.isConnected) return;
    var entry = portal.querySelector('.entry');
    var total = Math.ceil(height + entry.getBoundingClientRect().height);
    if (total < applied - 1 && shrinkDue !== total && document.activeElement !== frame) {
      if (frameLoadCount && shrinkTarget !== total) {
        shrinkTarget = total; clearTimeout(shrinkTimer);
        shrinkTimer = setTimeout(function () { shrinkTimer = 0; shrinkDue = shrinkTarget; schedule(); }, 700);
      }
    } else {
      clearTimeout(shrinkTimer); shrinkTimer = shrinkTarget = shrinkDue = 0;
      if (Math.abs(applied - total) > 1) applied = total;
    }
    if (Math.abs(spacer.getBoundingClientRect().height - applied) > 1) spacer.style.height = applied + 'px';
    var r = spacer.getBoundingClientRect();
    var bodyRect = document.body.getBoundingClientRect();
    portal.style.left = (r.left - bodyRect.left + document.body.scrollLeft - document.body.clientLeft) + 'px';
    portal.style.top = (r.top - bodyRect.top + document.body.scrollTop - document.body.clientTop) + 'px';
    portal.style.width = r.width + 'px';
    portal.style.visibility = r.width > 0 ? 'visible' : 'hidden';
    if (r.width > 0 && tracked.indexOf(slug) !== -1) {
      frame.setAttribute('data-bw-tool-frame', '1'); frame.setAttribute('data-bw-tool-slug', slug);
      var bridge = window.BWToolEventHost && window.BWToolEventHost.install();
      if (bridge && bridge.scanForToolFrames) bridge.scanForToolFrames(frame);
    }
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
    if (stopped || !document.body) return;
    url = url || warmupUrl();
    if (!url) return;
    if (!portal) {
      document.documentElement.setAttribute('data-bw-fast-document', '1');
      scrollStyle = document.createElement('style'); scrollStyle.id = surfaceId + '-document-scroll';
      scrollStyle.textContent = 'html[data-bw-fast-document="1"]{overflow-y:auto!important}html[data-bw-fast-document="1"]:has(body[style*="overflow: hidden"]){overflow-y:hidden!important}html[data-bw-fast-document="1"].bw-tools-detail.bw-tools-shell-v2 body{height:auto!important}html[data-bw-fast-document="1"].bw-tools-detail.bw-tools-shell-v2 body:not([style*="overflow: hidden"]){overflow-y:visible!important;overflow-x:clip!important}';
      document.head.appendChild(scrollStyle);
      if (getComputedStyle(document.body).position === 'static') {
        bodyPosition = document.body.style.getPropertyValue('position'); bodyPriority = document.body.style.getPropertyPriority('position');
        document.body.style.setProperty('position', 'relative'); positionedBody = true;
      }
      portal = document.createElement('div'); portal.id = surfaceId; portal.setAttribute('role', 'group'); portal.setAttribute('aria-label', 'Interactive Berlin tool');
      portal.style.cssText = 'position:absolute;z-index:5;left:0;top:0;width:100%;visibility:hidden;background:#fff;box-sizing:border-box';
      var entry = document.createElement('div'); entry.className = 'entry'; entry.textContent = 'START HERE';
      entry.style.cssText = 'box-sizing:border-box;padding:13px 16px 22px;color:#123D18;background:#f8f9f3;font:700 11px/1.4 Arial,sans-serif;letter-spacing:.07em'; portal.appendChild(entry);
      var before = document.createElement('span'); before.tabIndex = 0; before.textContent = 'Previous page content';
      before.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)';
      before.addEventListener('focus', function () { var target = document.querySelector('[data-bw-shell-v2-breadcrumb]'); if (target) target.focus(); }); portal.appendChild(before);
      frame = document.createElement('iframe'); frame.title = 'Berlin tool'; frame.name = configuredUrl ? 'bw-fast-secondary' : 'bw-fast-tool'; frame.loading = 'eager'; frame.setAttribute('allow', configuredUrl ? 'fullscreen' : 'fullscreen; geolocation *'); frame.setAttribute('scrolling', 'no');
      frame.style.cssText = 'display:block;width:100%;height:' + height + 'px;border:0;background:#fff'; frame.setAttribute('data-bw-fast-tool-frame', slug);
      frame.addEventListener('load', function () { frameLoadCount++; portal.setAttribute('data-bw-fast-load-count', frameLoadCount); portal.setAttribute('data-bw-fast-loaded-ms', Math.round(performance.now())); schedule(); });
      frame.src = url; portal.appendChild(frame);
      var after = document.createElement('span'); after.tabIndex = 0; after.textContent = 'Continue reading'; after.style.cssText = before.style.cssText;
      after.addEventListener('focus', function () { var target = document.querySelector('#comp-mozmt2at a,#comp-mozn18up a,#comp-mozmgdoo a,#comp-mozp1zlv a'); if (target) target.focus(); }); portal.appendChild(after);
      document.body.appendChild(portal); portal.setAttribute('data-bw-fast-request-ms', Math.round(performance.now()));
    }
    var current = document.getElementById(slotId);
    if (!current) return;
    if (current !== host || !spacer || !spacer.isConnected) {
      host = current;
      var shadow = host.shadowRoot || host.attachShadow({ mode: 'open' });
      shadow.textContent = '';
      spacer = document.createElement('div'); spacer.tabIndex = 0; spacer.setAttribute('aria-label', 'Use the tool controls'); spacer.addEventListener('focus', function () { frame.focus(); }); spacer.style.cssText = 'display:block;width:100%;height:' + applied + 'px'; shadow.appendChild(spacer);
      var hostStyle = document.createElement('style'); hostStyle.textContent = ':host{height:auto!important;min-height:0!important;max-height:none!important}'; shadow.appendChild(hostStyle);
      host.setAttribute('data-bw-fast-tool', slug); host.setAttribute('aria-owns', portal.id);
      if (resizeObserver) resizeObserver.disconnect();
      if (typeof ResizeObserver === 'function') { resizeObserver = new ResizeObserver(schedule); resizeObserver.observe(spacer); }
    }
    if (configuredUrl && !host.querySelector('[data-bw-fast-secondary-source]')) {
      var sourceLink = document.createElement('a'); sourceLink.href = url; sourceLink.setAttribute('data-bw-fast-secondary-source', '1'); sourceLink.setAttribute('aria-hidden', 'true');
      // Unslotted light DOM stays hidden, but the shell sees a real source and keeps this optional section open.
      host.appendChild(sourceLink);
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
  if (document.fonts) document.fonts.addEventListener('loadingdone', schedule);
  observer = new MutationObserver(mount); observer.observe(document.documentElement, { childList: true, subtree: true });
  mount();
  function fallback() {
    mount();
    if (url || stopped) return;
    fetch('https://fenerszymanski.github.io/berlinwalk-widgets/tools-hub/tool-loading-links.json?v=20261014', { credentials: 'omit' })
      .then(function (r) { if (!r.ok) throw Error('Missing links'); return r.json(); })
      .then(function (links) { url = url || valid(links[slug]); mount(); }).catch(function () {});
  }
  fallback();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  return stop;
  }
})();
