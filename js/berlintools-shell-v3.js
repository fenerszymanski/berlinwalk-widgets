/* Shell V3 pilot for /tools/berlin-safety (round 2). Adds the root class (also set by the head embed, idempotent),
   one reserved icon per related card, and the notes accordion state. Layout and first paint come from CSS: the
   accordion's first-paint state and the empty sections are CSS rules, so this script only sets attributes that CSS
   already matches (no layout change). It writes no text nodes and fetches nothing (fonts are in <head>). */
(function () {
  'use strict';
  if (!/^\/tools\/berlin-safety\/?$/i.test(location.pathname)) return;
  var root = document.documentElement;
  root.classList.add('bw-shell-v3');

  var ICON = 'https://fenerszymanski.github.io/berlinwalk-widgets/tools-hub/icons-clean/';
  var CARDS = ['comp-mozp2aft', 'comp-mozp3f25'];
  var NOTES = 'comp-mozn27df';

  function byId(id) { return document.getElementById(id); }
  function icons() {
    CARDS.forEach(function (id) {
      var card = byId(id);
      if (!card || card.querySelector(':scope > .bw-shell-v3-icon')) return;
      var a = card.querySelector('a[href]');
      var m = a && (a.getAttribute('href') || '').match(/\/tools\/([^\/?#]+)/);
      if (!m) return;
      var wrap = document.createElement('span');
      wrap.className = 'bw-shell-v3-icon';
      wrap.setAttribute('aria-hidden', 'true');
      var img = document.createElement('img');
      img.width = 44; img.height = 44; img.alt = ''; img.loading = 'lazy'; img.decoding = 'async';
      img.src = ICON + decodeURIComponent(m[1]).toLowerCase() + '.webp';
      wrap.appendChild(img);
      card.insertBefore(wrap, card.firstChild);
    });
  }
  // Notes: the headings are the direct children of one parent (the Ricos block list). A heading starts a group and
  // the non-heading siblings after it belong to that group. CSS already shows group 1 and hides groups 2+ on first
  // paint (selectors on :has(> h2, h3)); this sets the same state as attributes so toggles can override it.
  function isHead(el) { return el.tagName === 'H2' || el.tagName === 'H3'; }
  function headsOf(view) { return Array.prototype.slice.call(view.querySelectorAll('h2, h3')); }
  function parentOf(heads) {
    var p = heads.length ? heads[0].parentElement : null;
    return p && heads.every(function (h) { return h.parentElement === p; }) ? p : null;
  }
  function sync(view) {
    var heads = headsOf(view);
    var p = parentOf(heads);
    if (!p) return;
    var cur = null;
    Array.prototype.forEach.call(p.children, function (k) {
      if (isHead(k)) {
        if (!k.hasAttribute('data-bw-v3-acc')) {
          k.setAttribute('data-bw-v3-acc', '');
          k.setAttribute('role', 'button');
          k.tabIndex = 0;
          k.setAttribute('aria-expanded', cur === null ? 'true' : 'false');
        }
        cur = k;
        return;
      }
      if (cur) k.setAttribute('data-bw-v3-open', cur.getAttribute('aria-expanded') === 'true' ? '1' : '0');
    });
  }
  function toggle(h) {
    h.setAttribute('aria-expanded', h.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
    var v = byId(NOTES);
    if (v) sync(v);
  }
  function listen() {
    // Delegated on the stable page section, so a Wix re-render of the viewer keeps working. Attached once.
    var host = document.querySelector('main[id^="PAGE_SECTIONS"]') || document.body;
    if (host.hasAttribute('data-bw-v3-listen')) return;
    host.setAttribute('data-bw-v3-listen', '');
    host.addEventListener('click', function (e) {
      var h = e.target.closest && e.target.closest('#comp-mozn27df :is(h2, h3)');
      if (h && h.hasAttribute('data-bw-v3-acc')) toggle(h);
    });
    host.addEventListener('keydown', function (e) {
      var h = e.target;
      if ((e.key === 'Enter' || e.key === ' ') && h.hasAttribute && h.hasAttribute('data-bw-v3-acc') && h.closest('#comp-mozn27df')) {
        e.preventDefault();
        toggle(h);
      }
    });
  }
  function apply() {
    icons();
    var v = byId(NOTES);
    if (v) sync(v);
    listen();
  }
  // Wix renders the cards and the notes viewer after load and may re-render them. Apply the idempotent steps
  // every 250 ms for 15 s after load, then stop. Bounded, no observer.
  function start() {
    var n = 0;
    (function tick() { apply(); if (++n < 60) setTimeout(tick, 250); })();
  }
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
})();
