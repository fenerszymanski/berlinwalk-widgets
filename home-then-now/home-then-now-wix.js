/* Homepage-only adapter for "Berlin, then and now". Disable its Wix embed to restore the previous page. */
(() => {
  'use strict';
  if (window.__bwHomeThenNowAdapter) return;
  window.__bwHomeThenNowAdapter = true;
  const base = new URL('./', document.currentScript.src);
  const style = document.createElement('style');
  style.textContent = `
    html.bw-home-then-now-active, html.bw-home-then-now-active body { overflow-x:clip!important; }
    #c1dmp .bw-home-then-now-layout { display:flex!important; flex-direction:column!important; gap:0!important; height:auto!important; min-height:0!important; }
    #c1dmp .bw-home-then-now-layout > #comp-kbgakxea { position:relative!important; inset:auto!important; order:0!important; flex:none!important; width:100%!important; margin:0!important; }
    #c1dmp .bw-home-then-now-layout > #PAGE_SECTIONSc1dmp { display:block!important; order:1!important; width:100%!important; min-height:0!important; height:auto!important; margin:0!important; padding:0!important; }
    #PAGE_SECTIONSc1dmp.bw-home-then-now-mounted > :not(bw-home-then-now) { display:none!important; }
    #PAGE_SECTIONSc1dmp.bw-home-then-now-mounted > bw-home-then-now { display:block!important; width:100%!important; }
    #c1dmp .bw-home-then-now-layout > #comp-mpbojue4 { order:2!important; position:relative!important; inset:auto!important; width:100%!important; margin:0!important; }
  `;
  document.head.appendChild(style);
  // The HEAD embed starts CSS and the element in parallel with this adapter.
  // Reuse those nodes even when either resource finished before we executed.
  let css = document.querySelector('link[rel="stylesheet"][data-bw-home-then-now-css],style[data-bw-home-then-now-css]');
  if (!css) {
    css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = new URL('home-then-now.css?release=home-then-now-20261029', base).href;
    css.dataset.bwHomeThenNowCss = 'true';
  }
  let cssReady = css.localName === 'style' || !!css.sheet;
  css.addEventListener('load', () => { cssReady = true; reconcile(); }, { once: true });
  if (!css.isConnected) document.head.appendChild(css);
  let script = document.head.querySelector('script[data-bw-home-then-now-script]');
  if (!script && !customElements.get('bw-home-then-now')) {
    script = document.createElement('script');
    script.src = new URL('home-then-now-element.js?release=home-then-now-20261029', base).href;
    script.dataset.bwHomeThenNowScript = 'true';
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
      && mounted.classList.contains('bw-home-then-now-mounted')
      && layout.classList.contains('bw-home-then-now-layout')
      && document.documentElement.classList.contains('bw-home-then-now-active');
  }
  function clearMount() {
    setClass(layout, 'bw-home-then-now-layout', false);
    setClass(mounted, 'bw-home-then-now-mounted', false);
    mounted = null;
    layout = null;
  }
  function reconcile() {
    const readyScreen = window.__bwHomeReadyBoot;
    if (readyScreen?.ready || readyScreen?.pending) {
      component?.remove();
      clearMount();
      setClass(document.documentElement, 'bw-home-then-now-active', false);
      return;
    }
    const isHome = location.pathname === '/';
    if (!isHome) {
      setClass(document.documentElement, 'bw-home-then-now-active', false);
      component?.remove();
      clearMount();
      return;
    }
    if (!cssReady || !customElements.get('bw-home-then-now')) return;
    if (mountIntact()) return;
    const main = document.getElementById('PAGE_SECTIONSc1dmp');
    if (!main || !main.parentElement.querySelector('#comp-kbgakxea') || !main.querySelector('bw-hero-home')) return;
    if (mounted !== main || layout !== main.parentElement) clearMount();
    const existing = main.querySelector('bw-home-then-now');
    if (existing) {
      component = existing;
    } else {
      // Reuse the rendered node when Wix hydration replaces the container, so the
      // element is not rebuilt (and its letter form state is not lost).
      if (!component) {
        component = document.createElement('bw-home-then-now');
        component.setAttribute('embedded', '');
      }
      main.prepend(component);
    }
    setClass(main, 'bw-home-then-now-mounted', true);
    setClass(document.documentElement, 'bw-home-then-now-active', true);
    setClass(main.parentElement, 'bw-home-then-now-layout', true);
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
    // Element content and price text change inside the mounted page.
    // They cannot affect its placement: avoid re-querying the Wix shell or
    // rewriting its classes for every such change (including our own mount).
    if (window.__bwHomeReadyBoot?.ready || window.__bwHomeReadyBoot?.pending) return;
    if (location.pathname === '/') {
      if (!cssReady || !customElements.get('bw-home-then-now') || mountIntact()) return;
    } else if (!mounted) return;
    if (scheduled) return;
    scheduled = true;
    // rAF alone stalls in hidden or throttled views (some in-app browsers);
    // the timer makes sure a Wix re-render never leaves the page unmounted.
    const run = () => { if (!scheduled) return; scheduled = false; reconcile(); };
    requestAnimationFrame(run);
    setTimeout(run, 150);
  }).observe(document.documentElement, { childList:true, subtree:true });
  window.addEventListener('popstate', reconcile);
  window.addEventListener('bw-home-ready', reconcile);
  customElements.whenDefined('bw-home-then-now').then(reconcile);
  reconcile();
})();
