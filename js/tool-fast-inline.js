/* Essential first-party tool host. Shadow DOM keeps the live tool independent
 * of Wix's later HtmlComponent effects. Only the private iframe is sized. */
(function () {
  'use strict';
  var match = location.pathname.match(/^\/tools\/([^/]+)\/?$/);
  if (!match || !new URLSearchParams(location.search).has('bwFastTool')) return;
  var slug = decodeURIComponent(match[1]), url = '', frame = null, host = null, observer;
  var start = performance.now();
  function mount() {
    if (!url) return;
    var current = document.getElementById('comp-mozco5et');
    if (!current || current === host) return;
    host = current;
    if (host.shadowRoot) return;
    var shadow = host.attachShadow({ mode: 'open' });
    var style = document.createElement('style');
    style.textContent = ':host{display:block}*{box-sizing:border-box}.entry{padding:13px 16px 22px;color:#123D18;background:#f8f9f3;font:700 11px/1.4 Arial,sans-serif;letter-spacing:.07em}.shell{width:100%}iframe{display:block;width:100%;border:0;height:1200px;background:#fff}';
    shadow.appendChild(style);
    var entry = document.createElement('div'); entry.className = 'entry'; entry.textContent = 'START HERE'; shadow.appendChild(entry);
    var shell = document.createElement('div'); shell.className = 'shell'; shadow.appendChild(shell);
    frame = document.createElement('iframe');
    frame.title = 'Berlin tool'; frame.name = 'bw-fast-tool'; frame.loading = 'eager';
    frame.setAttribute('allow', 'fullscreen; geolocation *'); frame.setAttribute('scrolling', 'no');
    frame.setAttribute('data-bw-fast-tool-frame', slug);
    frame.src = url; shell.appendChild(frame);
    host.setAttribute('data-bw-fast-tool', slug);
    host.setAttribute('data-bw-fast-request-ms', Math.round(performance.now() - start));
    frame.addEventListener('load', function () { host.setAttribute('data-bw-fast-loaded-ms', Math.round(performance.now() - start)); });
  }
  window.addEventListener('message', function (event) {
    if (!frame || !frame.isConnected || event.source !== frame.contentWindow || event.origin !== 'https://fenerszymanski.github.io') return;
    var data = event.data;
    if (!data || data.type !== 'bw-resize' || typeof data.height !== 'number' || !isFinite(data.height) || data.height <= 0 || data.height > 30000) return;
    frame.style.height = Math.ceil(data.height) + 'px';
    host.setAttribute('data-bw-fast-ready-ms', Math.round(performance.now() - start));
  });
  function watch() {
    mount(); observer = new MutationObserver(mount); observer.observe(document.documentElement, { childList: true, subtree: true });
  }
  fetch('https://fenerszymanski.github.io/berlinwalk-widgets/tools-hub/tool-loading-links.json?v=20261014', { credentials: 'omit' })
    .then(function (r) { if (!r.ok) throw Error('Missing links'); return r.json(); })
    .then(function (links) { var u = new URL(links[slug]); if (u.origin !== 'https://fenerszymanski.github.io' || !u.pathname.startsWith('/berlinwalk-widgets/') || u.searchParams.get('surface') !== 'tool-page') return; url = u.href; mount(); }).catch(function () {});
  watch();
})();
