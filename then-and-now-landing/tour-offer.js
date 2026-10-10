/* Berlin Then and Now: the dated offer display. Checkout prices are enforced separately in Wix. */
(() => {
  'use strict';
  const VERSION = '20261010-scoped1';
  if (window.BWTourOffer && window.BWTourOffer.version === VERSION) { window.BWTourOffer.refresh(); return; }
  const START = Date.parse('2026-10-07T22:00:00Z');
  const END = Date.parse('2026-11-07T23:00:00Z');
  const active = (now = Date.now()) => now >= START && now < END;
  const price = (day, now = Date.now()) => active(now) && (!day || day >= '2026-10-08' && day <= '2026-11-07') ? 20 : 25;
  const scopes = 'bw-home-two-doors,bw-route-story,bw-meeting-point,bw-then-now-landing,bw-the-guide,.bw-footer-note,.bw-home-booking-facts,.bw-blog-booking-facts,.bw-c-rail-choice-walk,.bw-c-tourband-sub,.bw-ci-rt-line,.bw-exit-copy,.bw-tools-shell-v2-tour-facts,#bw-ca05-strip,[data-bw-tour-offer-scope]';
  const excluded = 'bw-tour-checkout,[data-bw-offer-price],script,style,textarea,input,select,code,pre,del';
  const context = /Berlin Then and Now|2[.,]5\s*h(?:ours?)?|11 stops|archive photo|World Clock|max(?:imum)?\s*10|walking tour with me/i;
  const token = /(?:€\s*25|EUR\s+25)(?:[.,]00)?(?!\d|[.,]\d)/g;
  const roots = new Set([document]);
  const pending = new Set();
  const definitions = new Map();
  const styleValues = new Map();
  const replaced = new Set();
  const schemas = new Map();
  let scheduled = false;
  let campaignActive;
  let boundaryTimer;
  const observer = new MutationObserver(changes);

  function matching(root, selector) {
    return [...(root.nodeType === 1 && root.matches(selector) ? [root] : []),
      ...(root.querySelectorAll ? root.querySelectorAll(selector) : [])];
  }
  function styleOnce(element, value) {
    if (!styleValues.has(value)) {
      const sample = document.createElement('span');
      sample.style.cssText = value;
      styleValues.set(value, sample.style.cssText);
    }
    const normalized = styleValues.get(value);
    if (element.style.cssText !== normalized) element.style.cssText = normalized;
  }
  function inheritedScope(root) {
    let host = root.getRootNode().host;
    while (host) {
      if (host.matches(scopes) || host.closest(scopes)) return true;
      host = host.getRootNode().host;
    }
    return false;
  }

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
      label.textContent = ' · Limited-time offer';
      label.style.cssText = 'display:inline;font-family:inherit;font-size:12px;font-weight:600;line-height:inherit;white-space:nowrap;text-transform:none;letter-spacing:0;margin:0;color:inherit';
      span.append(amount, label); fragment.append(span); replaced.add(span);
      at = m.index + m[0].length;
    }
    fragment.append(document.createTextNode(text.slice(at)));
    node.replaceWith(fragment);
  }
  function tidy(root) {
    // Price replacements inherit the surrounding line; never introduce block rows in fact bars or chips.
    for (const span of matching(root, '[data-bw-offer-price]')) {
      styleOnce(span, 'display:inline;white-space:normal');
      const label = span.querySelector('small');
      if (label) {
        if (label.textContent !== ' · Limited-time offer') label.textContent = ' · Limited-time offer';
        const compact = !!span.closest('#bw-ca05-strip li,.bw-home-booking-facts li,.bw-blog-booking-facts li,.bw-home-two-doors__chip,.bw-home-two-doors__facts');
        styleOnce(label, 'display:' + (compact ? 'none' : 'inline') + ';font-family:inherit;font-size:12px;font-weight:600;line-height:inherit;white-space:nowrap;text-transform:none;letter-spacing:0;margin:0;color:inherit');
      }
      replaced.add(span);
    }
    // The published Wix frontend still emits the old date detail on every guest/date render.
    // Keep this removal narrow; the selected-date pricing and all payment rules remain untouched.
    for (const detail of matching(root, 'small')) {
      if (!detail.matches('bw-tour-checkout .bwtc-guests .bwtc-hint small')) continue;
      if (/^For walks from 8 Oct to 7 Nov 2026/.test(detail.textContent.trim())) {
        const lineBreak = detail.previousSibling;
        if (lineBreak && lineBreak.nodeName === 'BR') lineBreak.remove();
        detail.remove();
      }
    }
  }
  function updateSchema(root) {
    for (const script of matching(root, 'script[type="application/ld+json"]')) {
      if (schemas.get(script)?.rendered === script.textContent) continue;
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
      if (changed) {
        const original = script.textContent, rendered = JSON.stringify(json);
        schemas.set(script, { original, rendered });
        script.textContent = rendered;
      } else schemas.delete(script);
    }
  }
  // A shadow root is invisible to the document observer. Discover it once on
  // insertion or custom-element upgrade, then observe only its own changes.
  function discover(element) {
    if (element.shadowRoot) {
      roots.add(element.shadowRoot);
      visit(element.shadowRoot);
    }
    const name = element.localName;
    if (!name?.includes('-') || customElements.get(name)) return;
    if (!definitions.has(name)) {
      const hosts = new Set();
      definitions.set(name, hosts);
      customElements.whenDefined(name).then(() => {
        definitions.delete(name);
        for (const host of hosts) if (host.isConnected) enqueue(host);
      });
    }
    definitions.get(name).add(element);
  }
  function visit(root) {
    if (!root.isConnected && root !== document) return;
    const inherited = inheritedScope(root);
    const nodes = [];
    const inspect = node => {
      if (node.nodeType === 1) discover(node);
      else if (node.nodeType === 3 && inTour(node, inherited)) nodes.push(node);
    };
    inspect(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) inspect(node);
    nodes.forEach(display);
    tidy(root);
    updateSchema(root);
  }
  function enqueue(node) {
    if (!node?.isConnected) return;
    // Text mutations need their small parent, including a JSON-LD script or
    // a re-rendered checkout hint. Never promote a mutation to the whole page.
    if (node.nodeType === 3) node = node.parentNode;
    if (node) pending.add(node);
    if (!scheduled) { scheduled = true; requestAnimationFrame(flush); }
  }
  function changes(records) {
    if (!active()) { if (campaignActive) refresh(); return; }
    for (const record of records) {
      if (record.type === 'characterData') enqueue(record.target);
      else {
        // Replacing script text or a compact paragraph may change an existing
        // price sibling. Restrict that contextual rescan to a small container.
        const target = record.target;
        if (target.nodeType === 1 && !/^(BODY|HTML|MAIN)$/.test(target.tagName) &&
            (target.textContent || '').length < 700) enqueue(target);
        else for (const node of record.addedNodes) enqueue(node);
      }
    }
  }
  function reconnect() {
    for (const root of roots) {
      if (root !== document && !root.host.isConnected) { roots.delete(root); continue; }
      observer.observe(root, { childList: true, subtree: true, characterData: true });
    }
  }
  function flush() {
    scheduled = true;
    if (!active()) { scheduled = false; refresh(); return; }
    // Include already queued external work, then suspend observation while
    // applying our own DOM changes. Those writes cannot schedule another pass.
    changes(observer.takeRecords());
    observer.disconnect();
    const work = [...pending]; pending.clear();
    scheduled = false;
    try {
      for (const root of work) {
        if (work.some(other => other !== root && other.contains(root))) continue;
        visit(root);
      }
      for (const span of replaced) if (!span.isConnected) replaced.delete(span);
      for (const script of schemas.keys()) if (!script.isConnected) schemas.delete(script);
    } finally { reconnect(); }
  }
  function scheduleBoundary() {
    clearTimeout(boundaryTimer);
    const now = Date.now(), next = now < START ? START : now < END ? END : null;
    if (next !== null) boundaryTimer = setTimeout(() => {
      if (active() !== campaignActive) refresh();
      else scheduleBoundary(); // Browser timeout maximum is about 24.8 days.
    }, Math.min(next - now, 2147483647));
  }
  function refresh() {
    observer.disconnect();
    pending.clear();
    campaignActive = active();
    if (!campaignActive) {
      for (const span of replaced) if (span.isConnected) span.replaceWith(document.createTextNode(span.dataset.regularPrice));
      replaced.clear();
      for (const [script, value] of schemas) {
        if (script.isConnected && script.textContent === value.rendered) script.textContent = value.original;
      }
      schemas.clear();
    } else if (document.body) {
      try { visit(document); } finally { reconnect(); }
    }
    scheduleBoundary();
  }
  window.BWTourOffer = Object.freeze({ version: VERSION, active, price, refresh });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refresh, { once: true });
  else refresh();
  // DOM insertion handles SPA renders. Waking a suspended page only checks the
  // campaign boundary; it does not walk the document again on every focus.
  const checkBoundary = () => { if (active() !== campaignActive) refresh(); };
  document.addEventListener('visibilitychange', checkBoundary);
  window.addEventListener('pageshow', checkBoundary);
})();
