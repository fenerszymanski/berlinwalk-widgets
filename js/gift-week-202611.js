/* Walk of Berlin gift-week surfaces. The Wix bootstrap is OFF until the coordinator enables it.
 * Original DOM nodes, forms and listeners are retained for automatic restoration.
 */
(function () {
  'use strict';
  if (window.BWGiftWeek202611) return;
  var START = Date.parse('2026-11-01T20:00:00+01:00');
  var DISCOUNT_END = Date.parse('2026-11-08T23:59:00+01:00');
  var SURFACES_END = Date.parse('2026-11-15T23:59:00+01:00');
  var records = new Map();
  var running = false;
  var observer;
  var lastPhase;
  
  function phase(now) {
    now = now === undefined ? Date.now() : Number(now);
    if (window.BW_GIFT_WEEK_202611_ENABLED !== true || now < START || now >= SURFACES_END) return 'off';
    return now < DISCOUNT_END ? 'discount' : 'gifts';
  }
  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  function href(source, surface, path) {
    var u = new URL(path || '/gifts', 'https://walkofberlin.com');
    u.searchParams.set('utm_source', source === 'tool' ? 'tool' : 'blog');
    u.searchParams.set('utm_medium', 'internal');
    u.searchParams.set('utm_campaign', 'gift-week-202611');
    u.searchParams.set('utm_content', surface);
    return u.href;
  }
  function message(lang) {
    if (lang === 'de') return phase() === 'discount' ? '20 % auf Berlin-Geschenke bis 8. November' : 'Berlin-Geschenke für Menschen, die die Stadt lieben';
    return phase() === 'discount' ? '20% off gifts until 8 November' : 'Berlin gifts for someone who loves the city';
  }
  // These are existing live products. A practical article without a close match
  // goes to the gift selection; it never invents a product or discounts the tour.
  function productFor(path) {
    path = String(path || location.pathname).toLowerCase();
    if (/wall|cold-war|east-or-west|divided|checkpoint/.test(path)) return { title: 'A Berlin street, seen from 1928', text: 'Choose an address and see it in the aerial photographs from 1928. I offer it as a print, a digital file or a gift voucher.', path: '/product-page/your-berlin-street-in-1928-personalised-aerial-print-30-x-40-cm', cta: 'Choose a street' };
    if (/christmas|gift|birthday|wedding/.test(path)) return { title: 'A newspaper made for one person', text: 'A birthday or wedding date becomes eight pages of real news, weather and personal letters. Open the sample before choosing your edition.', path: 'https://editions.walkofberlin.com/birthday', cta: 'See the personal newspaper' };
    if (/walk|museum|history|medieval|old-town|reich|landmark/.test(path)) return { title: 'Berlin history, at your own pace', text: 'My audio walks follow the Berlin Wall, Hidden Berlin and Medieval Berlin. Choose one route or the three-walk bundle.', path: '/audio-tours', cta: 'Explore the audio walks' };
    if (/tempelhof|späti|spaeti|district|neukölln|neukolln|fernsehturm|tv-tower|ubahn|u-bahn|transport|train/.test(path)) return { title: 'Berlin places for your wall', text: 'The Späti, Tempelhof and Berlin’s districts appear in my poster collection. Choose a print or a file to print yourself.', path: '/category/all-products?tab=print', cta: 'Browse the posters' };
    return { title: 'Berlin gifts, from prints to personal newspapers', text: 'I have put my personal newspapers, 1928 street prints, audio walks and posters together. Choose a gift for someone who lives in Berlin or misses it.', path: '/gifts', cta: 'Explore Berlin gifts' };
  }
  function link(source, surface, path, label) {
    return '<a class="bw-gw-button" href="' + esc(href(source, surface, path)) + '">' + esc(label) + '</a>';
  }
  function pair(source, surface) {
    return '<div class="bw-gw-pair">' +
      '<article class="bw-gw-card"><p class="bw-gw-kicker">MADE FOR ONE PERSON</p><h3>Personal newspapers</h3><p>A birthday or wedding date, told through real news, weather and letters. I make each eight-page edition for one person.</p>' + link(source, surface + '_newspaper', 'https://editions.walkofberlin.com/birthday', 'See the personal newspaper') + '</article>' +
      '<article class="bw-gw-card"><p class="bw-gw-kicker">' + esc(phase() === 'discount' ? 'GIFT WEEK' : 'BERLIN GIFTS') + '</p><h3>' + esc(message()) + '</h3><p>1928 street prints, audio walks, posters and personal newspapers.' + (phase() === 'discount' ? ' The calendar, Trip Planner, walking tour, Night In and small guides are outside the discount.' : ' Choose something for someone who lives in Berlin or misses it.') + '</p>' + link(source, surface + '_gifts', '/gifts', 'Explore Berlin gifts') + '</article></div>';
  }
  function content(kind) {
    if (kind === 'tool' || kind === 'category' || kind === 'home') return pair(kind === 'tool' ? 'tool' : 'blog', kind + '_cards');
    if (kind === 'closing') {
      var p = productFor();
      return '<div class="bw-gw-card bw-gw-closing"><p class="bw-gw-kicker">' + esc(message()) + '</p><h2>' + esc(p.title) + '</h2><p>' + esc(p.text) + '</p><div class="bw-gw-actions">' + link('blog', 'post_end_' + p.cta.toLowerCase().replace(/[^a-z0-9]+/g, '_'), p.path, p.cta) + (p.path === '/gifts' ? '' : '<a class="bw-gw-text" href="' + esc(href('blog', 'post_end_gifts')) + '">All Berlin gifts →</a>') + '</div></div>';
    }
    if (kind === 'bar') return '<div class="bw-gw-bar"><button type="button" class="bw-gw-close" aria-label="Close gift message">×</button><p class="bw-gw-kicker">WALK OF BERLIN</p><strong>' + esc(message()) + '</strong>' + link('blog', 'post_letter_bar', '/gifts', 'Explore gifts') + '</div>';
    return '<div class="bw-gw-card"><p class="bw-gw-kicker">' + esc(kind === 'rail' ? 'BERLIN GIFTS' : 'A GIFT FROM BERLIN') + '</p><' + (kind === 'rail' ? 'strong' : 'h3') + '>' + esc(message()) + '</' + (kind === 'rail' ? 'strong' : 'h3') + '>' + (kind === 'rail' ? '' : '<p>Personal newspapers, your street in 1928, audio walks and posters. Open my gift selection and choose what fits.</p>') + link('blog', kind === 'rail' ? 'post_rail' : 'post_inline_box', '/gifts', 'Explore Berlin gifts') + '</div>';
  }
  function restore(node, rec) {
    rec.promo.remove();
    while (rec.original.firstChild) node.insertBefore(rec.original.firstChild, rec.original);
    rec.original.remove();
    if (rec.label === null) node.removeAttribute('aria-label'); else node.setAttribute('aria-label', rec.label);
    ['aria-labelledby', 'aria-describedby'].forEach(function (name) {
      var value = rec.references[name];
      if (value === null) node.removeAttribute(name); else node.setAttribute(name, value);
    });
    node.removeAttribute('data-bw-gw-surface');
    records.delete(node);
  }
  function decorate(node, kind) {
    if (!node) return;
    var current = phase();
    var rec = records.get(node);
    if (current === 'off') { if (rec) restore(node, rec); return; }
    if (rec && rec.original.parentNode !== node) { records.delete(node); rec = null; }
    if (!rec) {
      var original = document.createElement('div');
      original.hidden = true;
      original.setAttribute('data-bw-gw-original', '');
      while (node.firstChild) original.appendChild(node.firstChild);
      var promo = document.createElement('div');
      promo.className = 'bw-gw-promo';
      rec = { original: original, promo: promo, phase: '', kind: '', path: '', label: node.getAttribute('aria-label'), references: { 'aria-labelledby': node.getAttribute('aria-labelledby'), 'aria-describedby': node.getAttribute('aria-describedby') } };
      records.set(node, rec);
      node.appendChild(original); node.appendChild(promo);
      node.setAttribute('data-bw-gw-surface', kind);
      node.setAttribute('aria-label', 'Walk of Berlin gifts');
      node.removeAttribute('aria-labelledby'); node.removeAttribute('aria-describedby');
    }
    if (rec.phase === current && rec.kind === kind && rec.path === location.pathname) return;
    rec.phase = current; rec.kind = kind; rec.path = location.pathname;
    rec.promo.innerHTML = content(kind);
    var close = rec.promo.querySelector('.bw-gw-close');
    if (close) close.addEventListener('click', function () { node.classList.remove('bw-lb-open'); });
  }
  function style() {
    if (document.getElementById('bw-gift-week-202611-style')) return;
    var node = document.createElement('style'); node.id = 'bw-gift-week-202611-style';
    node.textContent = [
      '[data-bw-gw-original],[data-bw-gw-original][hidden]{display:none!important}',
      'html[data-bw-gift-week="discount"] [data-bw-gw-suppressed],html[data-bw-gift-week="gifts"] [data-bw-gw-suppressed]{display:none!important}',
      '.bw-gw-promo,.bw-gw-promo *{box-sizing:border-box;min-width:0}',
      '[data-bw-gw-surface]>.bw-gw-promo{width:100%;max-width:100%;grid-column:1 / -1}',
      '.bw-gw-card{background:#FAFAF5;color:#212121;padding:24px;border:1px solid #cbd8c6;font-family:Montserrat,Arial,sans-serif;text-align:left}',
      '.bw-gw-promo .bw-gw-kicker{font:700 11px/1.4 Montserrat,Arial,sans-serif!important;color:#1B5E20!important;letter-spacing:.06em!important;margin:0 0 8px!important}',
      'html[data-bw-gift-week] [data-bw-gw-surface] .bw-gw-promo.bw-gw-promo h2,html[data-bw-gift-week] [data-bw-gw-surface] .bw-gw-promo.bw-gw-promo h3{font:600 clamp(22px,3vw,32px)/1.16 Georgia,serif!important;letter-spacing:normal!important;color:#123D18!important;margin:0 0 12px!important;overflow-wrap:anywhere}',
      '.bw-gw-promo p:not(.bw-gw-kicker){font:400 15px/1.55 Montserrat,Arial,sans-serif!important;color:#212121!important;margin:0 0 18px!important}',
      '.bw-gw-promo a.bw-gw-button,.bw-gw-promo a.bw-gw-button:is(:hover,:focus,:active,:visited){display:inline-flex!important;align-items:center;justify-content:center;padding:12px 18px!important;min-height:44px;max-width:100%;border:0!important;border-radius:999px;background:#FFE600!important;color:#123D18!important;font:700 13px/1.35 Montserrat,Arial,sans-serif!important;text-decoration:none!important;white-space:normal;text-align:center;overflow-wrap:anywhere}',
      '.bw-gw-promo a:focus-visible,.bw-gw-close:focus-visible{outline:3px solid #1B5E20;outline-offset:4px}',
      '.bw-gw-pair{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;width:100%}',
      '.bw-gw-pair .bw-gw-card{display:flex;flex-direction:column;align-items:flex-start}.bw-gw-pair .bw-gw-button{margin-top:auto}',
      '.bw-gw-actions{display:flex;align-items:center;flex-wrap:wrap;gap:18px}.bw-gw-promo .bw-gw-text{color:#123D18!important;font:600 13px/1.4 Montserrat,Arial,sans-serif!important}',
      '[data-bw-gw-surface="rail"] .bw-gw-card{padding:16px}[data-bw-gw-surface="rail"] strong{display:block;font:600 21px/1.2 Georgia,serif;margin-bottom:14px}',
      '[data-bw-gw-surface="closing"],[data-bw-gw-surface="category"],[data-bw-gw-surface="tool"]{display:block!important;padding:24px!important;background:#123D18!important}',
      '[data-bw-gw-surface="home"]{display:block!important}',
      '#bw-letter-bar[data-bw-gw-surface="bar"]{padding:12px 42px 12px 14px!important;max-width:620px!important}',
      '.bw-gw-bar{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:3px 12px;align-items:center}.bw-gw-bar .bw-gw-kicker{grid-column:1!important;margin:0!important}.bw-gw-bar strong{grid-column:1;font:600 16px/1.3 Georgia,serif}.bw-gw-bar .bw-gw-button{grid-column:2;grid-row:1 / 3}',
      '.bw-gw-close{position:absolute;right:7px;top:6px;border:0;background:transparent;font:24px/1 Arial;color:#123D18;width:28px;height:32px;cursor:pointer}',
      '.bw-letter-inline .bw-gw-close{display:none}',
      '@media(max-width:600px){.bw-gw-pair{grid-template-columns:1fr}.bw-gw-card{padding:20px}.bw-gw-bar strong{font-size:15px}.bw-gw-bar .bw-gw-button{font-size:12px!important;padding:10px 12px!important}[data-bw-gw-surface="closing"],[data-bw-gw-surface="category"],[data-bw-gw-surface="tool"]{padding:16px!important}}'
    ].join('');
    document.head.appendChild(node);
  }
  function scan() {
    if (running) return;
    running = true;
    if (observer) observer.disconnect();
    try {
      var current = phase();
      if (lastPhase !== current) { document.documentElement.setAttribute('data-bw-gift-week', current); lastPhase = current; }
      // placeSurface retains a temporarily detached card during Wix hydration.
      // Keep its restoration record too, or a later reattach would wrap a
      // campaign inside another campaign and leave a stale discount at expiry.
      if (current === 'off') {
        records.forEach(function (rec, node) { restore(node, rec); });
        document.querySelectorAll('[data-bw-gw-suppressed]').forEach(function (n) { n.removeAttribute('data-bw-gw-suppressed'); });
        return;
      }
      style();
      function all(selector, kind) { document.querySelectorAll(selector).forEach(function (n) { decorate(n, kind); }); }
      all('#bw-letter-bar.bw-letter-inline', 'inline');
      all('#bw-letter-bar:not(.bw-letter-inline)', 'bar');
      all('[data-bw-date-check-card]', 'inline');
      all('.bw-c-rail-tour,.bw-ci-rail-tour', 'rail');
      all('.bw-c-tourband', 'closing');
      if (/^\/tools\/[^/]+\/?$/i.test(location.pathname)) {
        var nativeToolBand = document.querySelector('#comp-mozmgdoo,[data-bw-shell-v2-tour-band]');
        if (nativeToolBand) decorate(nativeToolBand, 'tool');
        else all('.bw-tool-bridge', 'tool');
      }
      all('.bw-lib-letter,.bw-ci-tourband', 'category');
      all('.bwh-doors,.bw-home-two-doors__shop', 'home');
      // There is one inline gift box and a small dismissible bar, not a stack
      // of competing tour, date and arrival-email promotions.
      document.querySelectorAll('[data-bw-blog-booking],[data-bw-eastwest-card],[data-bw-arrival-offer]').forEach(function (n) { if (!n.hasAttribute('data-bw-gw-suppressed')) n.setAttribute('data-bw-gw-suppressed', ''); });
    } finally {
      if (observer) observer.observe(document.documentElement, { childList: true, subtree: true });
      running = false;
    }
  }
  window.BWGiftWeek202611 = { phase: phase, href: href, message: message, productFor: productFor, decorate: decorate, scan: scan, start: START, discountEnd: DISCOUNT_END, surfacesEnd: SURFACES_END };
  observer = new MutationObserver(scan);
  scan();
  // Exact boundaries also work in a tab kept open all week. Wake/SPA paths are
  // reconciled immediately; timers are capped so a changed system clock recovers.
  function tick() {
    scan();
    var now = Date.now();
    var next = [START, DISCOUNT_END, SURFACES_END].filter(function (t) { return t > now; })[0];
    setTimeout(tick, Math.min(30000, next ? Math.max(1, next - now) : 30000));
  }
  tick();
  document.addEventListener('visibilitychange', scan);
  window.addEventListener('pageshow', scan);
  window.addEventListener('popstate', scan);
})();
