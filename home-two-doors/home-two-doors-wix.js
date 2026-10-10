/* Homepage-only adapter. Disable its Wix embed to restore the original page. */
(() => {
  'use strict';
  if (window.__bwTwoDoorsAdapter) return;
  window.__bwTwoDoorsAdapter = true;
  const base = new URL('./', document.currentScript.src);
  const style = document.createElement('style');
  style.textContent = `
    html.bw-two-doors-active, html.bw-two-doors-active body { overflow-x:clip!important; }
    #c1dmp .bw-two-doors-layout { display:flex!important; flex-direction:column!important; gap:0!important; height:auto!important; min-height:0!important; }
    #c1dmp .bw-two-doors-layout > #comp-kbgakxea { position:relative!important; inset:auto!important; order:0!important; flex:none!important; width:100%!important; margin:0!important; }
    #c1dmp .bw-two-doors-layout > #PAGE_SECTIONSc1dmp { display:block!important; order:1!important; width:100%!important; min-height:0!important; height:auto!important; margin:0!important; padding:0!important; }
    #PAGE_SECTIONSc1dmp.bw-two-doors-mounted > :not(bw-home-two-doors) { display:none!important; }
    #PAGE_SECTIONSc1dmp.bw-two-doors-mounted > bw-home-two-doors { display:block!important; width:100%!important; }
    #c1dmp .bw-two-doors-layout > #comp-mpbojue4 { order:2!important; position:relative!important; inset:auto!important; width:100%!important; margin:0!important; }
  `;
  document.head.appendChild(style);
  // The HEAD embed starts CSS and the element in parallel with this adapter.
  // Reuse those nodes even when either resource finished before we executed.
  // Older embeds still work through the same stylesheet/element fallback.
  let css = document.head.querySelector('link[rel="stylesheet"][data-bw-home-two-doors-css]');
  if (!css) {
    css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = new URL('home-two-doors-live.css?release=first-screen-20261010b', base).href;
    css.dataset.bwHomeTwoDoorsCss = 'true';
  }
  let cssReady = !!css.sheet;
  css.addEventListener('load', () => { cssReady = true; reconcile(); }, { once: true });
  if (!css.isConnected) document.head.appendChild(css);
  let script = document.head.querySelector('script[data-bw-home-two-doors-script]');
  if (!script && !customElements.get('bw-home-two-doors')) {
    script = document.createElement('script');
    script.src = new URL('home-two-doors-element.js?release=first-screen-20261010', base).href;
    script.dataset.bwHomeTwoDoorsScript = 'true';
  }
  if (script) {
    script.addEventListener('load', reconcile, { once: true });
    if (!script.isConnected) document.head.appendChild(script);
  }
  let mounted = null;
  let layout = null;
  let component = null;
  let earlyOfferRefreshed = false;
  function setClass(node, name, active) {
    if (node && node.classList.contains(name) !== active) node.classList.toggle(name, active);
  }
  function mountIntact() {
    return mounted?.isConnected && component?.parentElement === mounted
      && mounted.parentElement === layout
      && mounted.classList.contains('bw-two-doors-mounted')
      && layout.classList.contains('bw-two-doors-layout')
      && document.documentElement.classList.contains('bw-two-doors-active');
  }
  function clearMount() {
    setClass(layout, 'bw-two-doors-layout', false);
    setClass(mounted, 'bw-two-doors-mounted', false);
    mounted = null;
    layout = null;
  }
  function reconcile() {
    const isHome = location.pathname === '/';
    if (!isHome) {
      setClass(document.documentElement, 'bw-two-doors-active', false);
      component?.remove();
      clearMount();
      return;
    }
    if (!cssReady || !customElements.get('bw-home-two-doors')) return;
    if (mountIntact()) return;
    const main = document.getElementById('PAGE_SECTIONSc1dmp');
    if (!main || !main.parentElement.querySelector('#comp-kbgakxea') || !main.querySelector('bw-hero-home')) return;
    if (mounted !== main || layout !== main.parentElement) clearMount();
    const existing = main.querySelector('bw-home-two-doors');
    if (existing) {
      component = existing;
    } else {
      // Reuse the rendered node when Wix hydration replaces the container, so
      // the hero is not rebuilt (second LCP paint, refetched reviews/dates).
      if (!component) {
        component = document.createElement('bw-home-two-doors');
        component.setAttribute('embedded', '');
      }
      main.prepend(component);
    }
    setClass(main, 'bw-two-doors-mounted', true);
    setClass(document.documentElement, 'bw-two-doors-active', true);
    setClass(main.parentElement, 'bw-two-doors-layout', true);
    mounted = main;
    layout = main.parentElement;
    // An early mount can paint before the offer's DOMContentLoaded pass.
    // Render only this component; the global observer waits for document parsing.
    if (!earlyOfferRefreshed && document.readyState === 'loading'
      && typeof window.BWTourOffer?.render === 'function') {
      earlyOfferRefreshed = true;
      window.BWTourOffer.render(component);
    }
  }
  let scheduled = false;
  new MutationObserver(() => {
    // Reviews, audio controls and price text change inside the mounted page.
    // They cannot affect its placement: avoid re-querying the Wix shell or
    // rewriting its classes for every such change (including our own mount).
    if (location.pathname === '/') {
      if (!cssReady || !customElements.get('bw-home-two-doors') || mountIntact()) return;
    } else if (!mounted) return;
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; reconcile(); });
  }).observe(document.documentElement, { childList:true, subtree:true });
  window.addEventListener('popstate', reconcile);
  customElements.whenDefined('bw-home-two-doors').then(reconcile);
  reconcile();
})();
