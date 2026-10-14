/* A slow Wix hydration must not look like a missing tool. This notice owns
 * only its fixed overlay; it never mounts/reloads or sizes a Wix iframe. */
(function () {
  'use strict';
  var path = window.location.pathname.match(/^\/tools\/([^/]+)\/?$/);
  if (!path) return;
  var slug = decodeURIComponent(path[1]);
  var previous = window.BW_TOOL_LOADING_STATUS;
  if (previous && previous.slug === slug) return;
  if (previous && previous.stop) previous.stop();
  var ready = false, notice = null, direct = '', frame = null, delay;
  window.BW_TOOL_LOADING_STATUS = { slug: slug, stop: finish };
  var host = 'https://fenerszymanski.github.io';
  function validUrl(value) {
    try { var u = new URL(value); return u.origin === host && u.pathname.indexOf('/berlinwalk-widgets/') === 0 && u.searchParams.get('surface') === 'tool-page' ? u.href : ''; } catch (_) { return ''; }
  }
  function finish() { ready = true; window.clearTimeout(delay); window.removeEventListener('message', onResize); if (notice) { notice.remove(); notice = null; } if (observer) observer.disconnect(); }
  function sync() {
    var next = document.querySelector('#comp-mozco5et iframe');
    if (!next) return;
    var source = validUrl(next.getAttribute('src') || '');
    if (!source || next === frame) return;
    frame = next;
    direct = source;
    frame.addEventListener('load', function () { if (frame === next && validUrl(next.getAttribute('src') || '')) finish(); }, { once: true });
    if (notice) show();
  }
  function show() {
    if (ready || !document.body) return;
    if (!notice) {
      notice = document.createElement('aside');
      notice.id = 'bw-tool-loading-status';
      notice.setAttribute('role', 'status');
      notice.style.cssText = 'position:fixed;z-index:2147483000;right:12px;bottom:12px;max-width:calc(100vw - 24px);box-sizing:border-box;padding:12px 16px;border:1px solid #FFE600;border-radius:8px;background:#123D18;color:#fff;font:14px/1.45 Arial,sans-serif;box-shadow:0 4px 18px #0003';
      var copy = document.createElement('span'); copy.textContent = 'The tool is loading. '; notice.appendChild(copy);
      document.body.appendChild(notice);
    }
    if (direct && !notice.querySelector('a')) {
      var link = document.createElement('a'); link.href = direct; link.textContent = 'Open it directly';
      link.style.cssText = 'display:inline-block;color:#FFE600;text-decoration:underline;font-weight:700;padding:6px 0';
      notice.appendChild(link);
    }
  }
  function onResize(event) {
    var current = document.querySelector('#comp-mozco5et iframe');
    if (event.origin !== host || !current || current.contentWindow !== event.source) return;
    var d = event.data;
    if (!d || typeof d !== 'object') return;
    var height = d.height || d.payload && d.payload.height;
    if (['bw-resize', 'resize', 'setHeight'].indexOf(d.type) !== -1 && typeof height === 'number' && isFinite(height) && height > 0 && height <= 30000) finish();
  }
  window.addEventListener('message', onResize);
  var observer;
  function start() {
    if (ready) return;
    sync();
    observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
    delay = window.setTimeout(show, 6000);
  }
  fetch('https://fenerszymanski.github.io/berlinwalk-widgets/tools-hub/tool-loading-links.json?v=20261014', { credentials: 'omit' })
    .then(function (r) { if (!r.ok) throw new Error('Unavailable'); return r.json(); })
    .then(function (links) { direct = direct || validUrl(links[slug]); if (notice) show(); }).catch(function () {});
  if (document.body) start(); else {
    var bodyObserver = new MutationObserver(function () {
      if (document.body) { bodyObserver.disconnect(); start(); }
    });
    bodyObserver.observe(document.documentElement, { childList: true });
  }
})();
