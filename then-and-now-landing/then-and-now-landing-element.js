(() => {
  'use strict';
  const scriptUrl = document.currentScript?.src;
  if (!scriptUrl || customElements.get('bw-then-now-landing')) return;
  const base = new URL('./', scriptUrl);
  const approvedOrigins = new Set(['https://app.berlinwalk.com']);
  const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(base.hostname) && base.origin === location.origin;
  if (!approvedOrigins.has(base.origin) && !isLocal) return;
  if (!document.querySelector('script[data-bw-tour-offer-loader]')) { const offer = document.createElement('script'); offer.dataset.bwTourOfferLoader = ''; offer.src = new URL('tour-offer.js?v=20261008-layout1', base).href; document.head.append(offer); }
  const CONFIG_ENDPOINT = 'https://app.berlinwalk.com/api/tour-landing-config';

  const absoluteUrl = (value) => new URL(value, base).href;
  const cssUrls = (css) => css.replace(/url\((['"]?)([^)'"\s]+)\1\)/g, (match, quote, value) => {
    if (/^(?:data:|#)/i.test(value)) return match;
    return `url("${absoluteUrl(value)}")`;
  });
  function rewriteAssets(root) {
    for (const node of root.querySelectorAll('[src]')) node.setAttribute('src', absoluteUrl(node.getAttribute('src')));
    for (const node of root.querySelectorAll('[href]')) {
      const href = node.getAttribute('href');
      if (href && !href.startsWith('#')) node.setAttribute('href', absoluteUrl(href));
    }
    for (const node of root.querySelectorAll('[srcset]')) {
      // Wix transformation paths contain commas; split on complete URL + descriptor pairs.
      const candidates = [...node.getAttribute('srcset').matchAll(/(\S+)\s+(\d+w|\d+(?:\.\d+)?x)(?:\s*,\s*|$)/g)];
      if (candidates.length) node.setAttribute('srcset', candidates.map(([, url, descriptor]) => `${absoluteUrl(url)} ${descriptor}`).join(', '));
    }
  }
  function installFonts(css) {
    if (document.querySelector('style[data-bw-tour-landing-fonts]')) return;
    const fontRules = css.match(/@font-face\{[^}]+\}/g);
    if (!fontRules?.length) return;
    const style = document.createElement('style');
    style.dataset.bwTourLandingFonts = '';
    style.textContent = fontRules.join('\n');
    document.head.append(style);
  }

  class BerlinThenNowLanding extends HTMLElement {
    static observedAttributes = ['page-query', 'config-endpoint'];
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._generation = 0;
      this._controller = null;
      this._records = undefined;
    }
    connectedCallback() { this._mount(); }
    disconnectedCallback() {
      this._generation++;
      this._abort?.abort();
      this._controller?.destroy();
      this._controller = null;
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (!this.isConnected || oldValue === newValue) return;
      if (name === 'page-query' && this._controller) this._controller.setSearch(newValue || '');
      else if (name === 'config-endpoint' && this._controller) this._mount();
    }
    set records(value) {
      this._records = value;
      if (this._controller) this._controller.setRecords(value);
    }
    get state() { return this._controller?.state; }
    refresh() { if (this.isConnected) return this._mount(); }
    async _mount() {
      const generation = ++this._generation;
      this._abort?.abort();
      this._controller?.destroy();
      this._controller = null;
      const abort = new AbortController();
      this._abort = abort;
      const signal = abort.signal;
      const timeout = setTimeout(() => abort.abort(), 12000);
      this.shadowRoot.replaceChildren();
      const loading = document.createElement('p');
      loading.textContent = 'Loading the walk…';
      loading.style.cssText = 'margin:0;padding:32px;color:#123d18;background:#fafaf5;font:16px Arial,sans-serif';
      this.shadowRoot.append(loading);
      try {
        const [htmlResponse, cssResponse, module] = await Promise.all([
          fetch(new URL('index.html', base), { credentials: 'omit', signal }),
          fetch(new URL('landing.css', base), { credentials: 'omit', signal }),
          import(new URL('landing.mjs', base).href),
        ]);
        if (!htmlResponse.ok || !cssResponse.ok) throw new Error('Landing template unavailable');
        const [html, rawCss] = await Promise.all([htmlResponse.text(), cssResponse.text()]);
        if (!this.isConnected || generation !== this._generation) return;
        const template = new DOMParser().parseFromString(html, 'text/html');
        for (const script of template.querySelectorAll('script')) script.remove();
        const body = document.createElement('div');
        body.dataset.bwLandingBody = '';
        body.innerHTML = template.body.innerHTML;
        rewriteAssets(body);
        const css = cssUrls(rawCss);
        installFonts(css);
        const style = document.createElement('style');
        style.textContent = css;
        this.shadowRoot.replaceChildren(style, body);
        const endpoint = this.getAttribute('config-endpoint') || CONFIG_ENDPOINT;
        const localConfig = isLocal ? window.__BW_LANDING_CONFIG__ || {} : {};
        const records = this._records ?? (isLocal ? window.__BW_LANDING_RECORDS__ : undefined);
        this._controller = module.mountLanding(this.shadowRoot, {
          assetBase: base.href,
          search: this.getAttribute('page-query') ?? location.search,
          records,
          config: { ...localConfig, endpoint, showVerifiedCapacity: false },
          onHeight: (height, metrics) => {
            if (generation !== this._generation || !this.isConnected || !Number.isFinite(height) || height < 1) return;
            if (this.style.height !== `${height}px`) this.style.height = `${height}px`;
            this.dispatchEvent(new CustomEvent('bw-tour-landing-height', { detail: metrics, bubbles: true, composed: true }));
          },
          onState: (state) => this.dispatchEvent(new CustomEvent('bw-tour-landing-ready', { detail: state, bubbles: true, composed: true })),
        });
        await this._controller.ready;
      } catch (error) {
        if (!this.isConnected || generation !== this._generation) return;
        const fallback = document.createElement('div');
        fallback.style.cssText = 'padding:32px;color:#123d18;background:#fafaf5;font:16px/1.6 Arial,sans-serif';
        const text = document.createElement('p');
        text.textContent = 'Berlin Then and Now · about 2.5 hours · maximum 10 guests · €25';
        const link = document.createElement('a');
        link.textContent = 'See dates and book';
        link.href = 'https://walkofberlin.com/book-berlin-walking-tour/berlin-then-and-now';
        fallback.append(text, link);
        this.shadowRoot.replaceChildren(fallback);
        this.style.height = '160px';
        this.dispatchEvent(new CustomEvent('bw-tour-landing-height', { detail: { height: 160 }, bubbles: true, composed: true }));
        this.dispatchEvent(new CustomEvent('bw-tour-landing-error', { detail: { reason: 'template-unavailable' }, bubbles: true, composed: true }));
      } finally { clearTimeout(timeout); }
    }
  }
  customElements.define('bw-then-now-landing', BerlinThenNowLanding);
})();
