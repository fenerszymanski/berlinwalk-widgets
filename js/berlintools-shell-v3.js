/* BerlinTools Shell V3 (layout A) for /tools/<slug>. The head embed decides which slugs get V3: it puts html.bw-shell-v3
   on allow-listed slugs and loads this file only then, so this script runs only when that class is already there.
   It adds one reserved icon per related card and the notes accordion state. Layout and first paint come from CSS: the
   accordion's first-paint state and the empty sections are CSS rules, so this script only sets attributes that CSS
   already matches (no layout change). It writes no text nodes and fetches nothing (fonts are in <head>). */
(function () {
  'use strict';
  var root = document.documentElement;
  if (!/^\/tools\/[^\/]+\/?$/i.test(location.pathname) || !root.classList.contains('bw-shell-v3')) return;

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
      // A slug without a clean icon keeps the empty cream tile instead of a broken image.
      img.onerror = function () { img.remove(); };
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
      if (!cur) return;
      // Write only on a real change: re-setting the same value restyled every notes paragraph on each pass.
      var open = cur.getAttribute('aria-expanded') === 'true' ? '1' : '0';
      if (k.getAttribute('data-bw-v3-open') !== open) k.setAttribute('data-bw-v3-open', open);
    });
  }
  function toggle(h) {
    var v = byId(NOTES);
    // A click before the first sync (or after Wix re-rendered the viewer) marks the headings first.
    if (v && !h.hasAttribute('data-bw-v3-acc')) sync(v);
    if (!h.hasAttribute('data-bw-v3-acc')) return;
    h.setAttribute('aria-expanded', h.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
    if (v) sync(v);
  }
  var listening = false;
  function listen() {
    // Delegated on document, which Wix never replaces (it swaps the whole <main> after load). Attached once.
    if (listening) return;
    listening = true;
    var host = document;
    host.addEventListener('click', function (e) {
      var h = e.target.closest && e.target.closest('#comp-mozn27df :is(h2, h3)');
      if (h) toggle(h);
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
  // Wix replaces the whole <main> about 4 s after load (measured 15 Oct 2026), which drops the heading marks, the icons
  // and the delegated click listener. Apply the idempotent steps when the DOM is ready and at load, and re-apply (coalesced,
  // 40 ms) when nodes are added anywhere in <body>, for 15 s after load; then the observer stops. sync() writes
  // only real changes and attribute writes are not observed, so it cannot feed itself. Until 15 Oct 2026 this polled every
  // 250 ms for 15 s, rewriting the state of every notes paragraph each time; Yusuf saw the right-rail notes blink.
  var queued = false;
  // setTimeout, not requestAnimationFrame: rAF does not run in a background tab, timers do (throttled).
  function schedule() { if (queued) return; queued = true; setTimeout(function () { queued = false; apply(); }, 40); }
  function observe() {
    if (typeof MutationObserver !== 'function' || !document.body) return;
    var mo = new MutationObserver(schedule);
    mo.observe(document.body, { childList: true, subtree: true });
    // Stop 15 s after the page is both loaded and visible (a background tab hydrates late).
    var armed = false;
    function arm() {
      if (armed || document.readyState !== 'complete' || document.visibilityState === 'hidden') return;
      armed = true;
      setTimeout(function () { mo.disconnect(); document.removeEventListener('visibilitychange', arm); }, 15000);
    }
    window.addEventListener('load', arm, { once: true });
    document.addEventListener('visibilitychange', arm);
    arm();
  }
  function ready() { apply(); observe(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, { once: true });
  else ready();
  if (document.readyState !== 'complete') window.addEventListener('load', apply, { once: true });
})();
