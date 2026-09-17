/* Homepage-only adapter. Disable its Wix embed to restore the original page. */
(() => {
  'use strict';
  if (window.__bwTwoDoorsAdapter) return;
  window.__bwTwoDoorsAdapter = true;
  const base = new URL('./', document.currentScript.src);
  const style = document.createElement('style');
  style.textContent = `
    #c1dmp .bw-two-doors-layout { display:flex!important; flex-direction:column!important; gap:0!important; height:auto!important; min-height:0!important; }
    #c1dmp .bw-two-doors-layout > #comp-kbgakxea { position:relative!important; inset:auto!important; order:0!important; flex:none!important; width:100%!important; margin:0!important; }
    #c1dmp .bw-two-doors-layout > #PAGE_SECTIONSc1dmp { display:block!important; order:1!important; width:100%!important; min-height:0!important; height:auto!important; margin:0!important; padding:0!important; }
    #PAGE_SECTIONSc1dmp.bw-two-doors-mounted > :not(bw-home-two-doors) { display:none!important; }
    #PAGE_SECTIONSc1dmp.bw-two-doors-mounted > bw-home-two-doors { display:block!important; width:100%!important; }
    #c1dmp .bw-two-doors-layout > #comp-mpbojue4 { order:2!important; position:relative!important; inset:auto!important; width:100%!important; margin:0!important; }
  `;
  document.head.appendChild(style);
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = new URL('home-two-doors-live.css', base).href;
  css.dataset.bwHomeTwoDoorsCss = 'true';
  let cssReady = false;
  css.onload = () => { cssReady = true; reconcile(); };
  document.head.appendChild(css);
  const script = document.createElement('script');
  script.src = new URL('home-two-doors-element.js', base).href;
  script.onload = () => reconcile();
  document.head.appendChild(script);
  let mounted = null;
  function reconcile() {
    const isHome = /^\/$/.test(location.pathname);
    if (!isHome) {
      if (mounted) {
        mounted.parentElement?.classList.remove('bw-two-doors-layout');
        mounted.classList.remove('bw-two-doors-mounted');
        mounted.querySelector('bw-home-two-doors')?.remove();
        mounted = null;
      }
      return;
    }
    if (!cssReady || !customElements.get('bw-home-two-doors')) return;
    const main = document.getElementById('PAGE_SECTIONSc1dmp');
    if (!main || !main.parentElement.querySelector('#comp-kbgakxea') || !main.querySelector('bw-hero-home')) return;
    if (!main.querySelector('bw-home-two-doors')) {
      const component = document.createElement('bw-home-two-doors');
      component.setAttribute('embedded', '');
      main.prepend(component);
    }
    main.classList.add('bw-two-doors-mounted');
    main.parentElement.classList.add('bw-two-doors-layout');
    mounted = main;
  }
  let scheduled = false;
  new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; reconcile(); });
  }).observe(document.documentElement, { childList:true, subtree:true });
  window.addEventListener('popstate', reconcile);
  reconcile();
})();
