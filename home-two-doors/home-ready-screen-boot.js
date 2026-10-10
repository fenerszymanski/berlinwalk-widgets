/* Homepage first paint. The payload is built from the canonical components. */
(() => {
  'use strict';
  if (location.pathname !== '/' || window.__bwHomeReadyBoot) return;
  const state = window.__bwHomeReadyBoot = { pending: true, ready: false, failed: false, version: 'ready-screen-v1' };
  let shell;
  let layout;
  let nativeMain;
  const activeClass = 'bw-home-ready-active';
  const layoutClass = 'bw-home-ready-wix-layout';
  function reconcile() {
    const home = location.pathname === '/';
    if (home && state.ready) {
      if (!shell.isConnected) document.body.prepend(shell);
      document.documentElement.classList.add(activeClass);
      nativeMain = document.getElementById('PAGE_SECTIONSc1dmp');
      const nextLayout = nativeMain?.parentElement;
      if (layout !== nextLayout) {
        layout?.classList.remove(layoutClass);
        layout = nextLayout;
      }
      if (layout && !layout.classList.contains(layoutClass)) layout.classList.add(layoutClass);
    } else {
      document.documentElement.classList.remove(activeClass);
      layout?.classList.remove(layoutClass);
      layout = null;
      nativeMain = null;
      shell?.remove();
    }
  }
  function changed() {
    // A healthy shell never depends on changes inside its painted content.
    // The native Wix container needs only one layout marker per replacement.
    if (state.ready && location.pathname === '/' && shell.isConnected
      && nativeMain?.isConnected && nativeMain.parentElement === layout
      && layout?.isConnected && layout.classList.contains(layoutClass)) return;
    reconcile();
  }
  async function start() {
    try {
      if (typeof DecompressionStream !== 'function' || typeof window.BWTourOffer?.render !== 'function') throw new Error('Ready screen prerequisites unavailable');
      const chunks = window.__bwHomeReadyPayload;
      if (!Array.isArray(chunks) || chunks.some(chunk => typeof chunk !== 'string')) throw new Error('Incomplete ready screen');
      const binary = atob(chunks.join(''));
      const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
      const payload = JSON.parse(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text());
      if (payload.version !== state.version || typeof payload.html !== 'string' || typeof payload.css !== 'string') throw new Error('Invalid ready screen version');
      const template = document.createElement('template');
      template.innerHTML = payload.html;
      const home = template.content.querySelector('bw-home-two-doors[data-bw-prerender="ready-screen-v1"]');
      const header = template.content.querySelector('bw-site-header[data-bw-prerender="ready-screen-v1"]');
      if (!home?.querySelector('#bw-home-two-doors-title') || !home.querySelector('.bw-home-two-doors__door--live img') || !header?.querySelector('.bw-header-logo')) throw new Error('Invalid ready screen markup');
      shell = document.createElement('div');
      shell.id = 'bw-home-ready-shell';
      shell.hidden = true;
      const css = document.createElement('style');
      css.dataset.bwHomeTwoDoorsCss = 'true';
      css.textContent = payload.css + '\n#bw-home-ready-shell{display:block;width:100%;position:relative}#bw-home-ready-shell[hidden]{display:none!important}html.bw-home-ready-active,html.bw-home-ready-active body{overflow-x:clip!important}html.bw-home-ready-active body{margin:0!important}html.bw-home-ready-active #site-root{min-height:0!important}.bw-home-ready-wix-layout{display:flex!important;flex-direction:column!important;gap:0!important;height:auto!important;min-height:0!important}.bw-home-ready-wix-layout>#comp-kbgakxea,.bw-home-ready-wix-layout>#PAGE_SECTIONSc1dmp{display:none!important}.bw-home-ready-wix-layout>#comp-mpbojue4{position:relative!important;inset:auto!important;order:2!important;width:100%!important;margin:0!important}';
      shell.append(css, template.content);
      // Complete child markup exists before connection, regardless of whether
      // the component definitions or this payload arrived first.
      document.body.prepend(shell);
      window.BWTourOffer.render(shell);
      if (!home.querySelector('#bw-home-two-doors-title')) throw new Error('Ready screen hydration failed');
      state.ready = true;
      state.pending = false;
      shell.hidden = false;
      reconcile();
      window.dispatchEvent(new Event('bw-home-ready'));
      new MutationObserver(changed).observe(document.documentElement, { childList: true, subtree: true });
      window.addEventListener('popstate', reconcile);
    } catch (error) {
      state.pending = false;
      state.failed = true;
      shell?.remove();
      layout?.classList.remove(layoutClass);
      document.documentElement.classList.remove(activeClass);
      window.dispatchEvent(new Event('bw-home-ready'));
    } finally {
      delete window.__bwHomeReadyPayload;
    }
  }
  start();
})();
