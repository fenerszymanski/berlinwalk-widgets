/* Berlin Then and Now: the dated offer display. Checkout prices are enforced separately in Wix. */
(() => {
  'use strict';
  if (window.BWTourOffer) { window.BWTourOffer.refresh(); return; }
  const START = Date.parse('2026-10-07T22:00:00Z');
  const END = Date.parse('2026-11-07T23:00:00Z');
  const active = (now = Date.now()) => now >= START && now < END;
  const price = (day, now = Date.now()) => active(now) && (!day || day >= '2026-10-08' && day <= '2026-11-07') ? 20 : 25;
  const scopes = 'bw-home-two-doors,bw-route-story,bw-meeting-point,bw-then-now-landing,bw-the-guide,.bw-footer-note,.bw-home-booking-facts,.bw-blog-booking-facts,.bw-c-rail-choice-walk,.bw-c-tourband-sub,.bw-ci-rt-line,.bw-exit-copy,.bw-tools-shell-v2-tour-facts,#bw-ca05-strip,[data-bw-tour-offer-scope]';
  const excluded = 'bw-tour-checkout,[data-bw-offer-price],script,style,textarea,input,select,code,pre,del';
  const context = /Berlin Then and Now|2[.,]5\s*h(?:ours?)?|11 stops|archive photo|World Clock|max(?:imum)?\s*10|walking tour with me/i;
  const token = /(?:€\s*25|EUR\s+25)(?:[.,]00)?(?!\d|[.,]\d)/g;
  const observed = new WeakSet();
  const replaced = new Set();
  const schemas = new Map();
  let scheduled = false;

  function inTour(node, inherited) {
    let p = node.parentElement;
    if (!p || p.closest(excluded)) return false;
    if (inherited || p.closest(scopes)) return true;
    // In tools and audio pages only the nearby guided-tour paragraph qualifies.
    for (let depth = 0; p && depth < 3; depth++, p = p.parentElement) {
      if (/^(BODY|HTML|MAIN)$/.test(p.tagName)) break;
      const text = p.textContent || '';
      if (text.length < 700 && context.test(text)) return true;
    }
    return false;
  }
  function display(node) {
    const text = node.nodeValue;
    if (node.parentElement.closest('summary') && /^What is included in the €25\?$/.test(text.trim())) {
      node.nodeValue = 'What is included in the walk?'; return;
    }
    token.lastIndex = 0;
    if (!token.test(text)) return;
    token.lastIndex = 0;
    const fragment = document.createDocumentFragment();
    let at = 0, m;
    while ((m = token.exec(text))) {
      fragment.append(document.createTextNode(text.slice(at, m.index)));
      const span = document.createElement('span');
      span.dataset.bwOfferPrice = '';
      span.dataset.regularPrice = m[0];
      span.style.cssText = 'display:inline;white-space:normal';
      const amount = document.createElement('span');
      amount.style.cssText = 'white-space:nowrap';
      const old = document.createElement('del'); old.textContent = '€25';
      old.style.cssText = 'font-size:.82em;opacity:.65;font-weight:500';
      const current = document.createElement('strong'); current.textContent = '€20';
      current.style.cssText = 'font-weight:800;color:inherit';
      amount.append(old, document.createTextNode(' '), current);
      const label = document.createElement('small');
      label.textContent = 'Limited-time offer · 8 Oct–7 Nov';
      label.style.cssText = 'display:block;font-family:inherit;font-size:11px;font-weight:600;line-height:1.4;text-transform:none;letter-spacing:0;margin:3px 0;color:inherit';
      span.append(amount, label); fragment.append(span); replaced.add(span);
      at = m.index + m[0].length;
    }
    fragment.append(document.createTextNode(text.slice(at)));
    node.replaceWith(fragment);
  }
  function updateSchema(root) {
    for (const script of root.querySelectorAll('script[type="application/ld+json"]')) {
      if (schemas.has(script)) continue;
      let json; try { json = JSON.parse(script.textContent); } catch { continue; }
      let changed = false;
      const walk = (value, tour = false) => {
        if (!value || typeof value !== 'object') return;
        if (Array.isArray(value)) { value.forEach(x => walk(x, tour)); return; }
        tour = tour || /Then and Now/i.test(value.name || '') || /then-and-now/.test(value.url || value['@id'] || '');
        if (tour && value['@type'] === 'Offer' && Number(value.price) === 25 && value.priceCurrency === 'EUR') {
          value.price = 20; value.priceValidUntil = '2026-11-07'; changed = true;
        }
        Object.values(value).forEach(x => walk(x, tour));
      };
      walk(json);
      if (changed) { schemas.set(script, script.textContent); script.textContent = JSON.stringify(json); }
    }
  }
  function visit(root, inherited = false) {
    if (!observed.has(root)) {
      observed.add(root);
      new MutationObserver(queue).observe(root, { childList: true, subtree: true, characterData: true });
    }
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = []; let node;
    while ((node = walker.nextNode())) if (inTour(node, inherited)) nodes.push(node);
    nodes.forEach(display);
    updateSchema(root);
    for (const el of root.querySelectorAll('*')) if (el.shadowRoot) visit(el.shadowRoot, inherited || el.matches(scopes));
  }
  function refresh() {
    scheduled = false;
    if (!active()) {
      for (const span of replaced) if (span.isConnected) span.replaceWith(document.createTextNode(span.dataset.regularPrice));
      replaced.clear();
      for (const [script, original] of schemas) if (script.isConnected) script.textContent = original;
      schemas.clear(); return;
    }
    if (document.body) visit(document);
  }
  function queue() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(refresh); }
  }
  window.BWTourOffer = Object.freeze({ active, price, refresh });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refresh, { once: true });
  else refresh();
  // Handles late custom-element registration, SPA navigation, and an open page at expiry.
  setInterval(refresh, 5000);
})();
