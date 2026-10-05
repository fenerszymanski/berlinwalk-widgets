// Branding adapter for the published immutable V4 planner landing.
// Keep the native renderer, pricing, purchase origin and tracking untouched.
(() => {
  if (window.__bwPlannerBrandRefresh) return;
  window.__bwPlannerBrandRefresh = true;
  const scriptUrl = document.currentScript?.src;
  const logo = scriptUrl ? new URL('../assets/walkofberlin-wordmark-white.png', scriptUrl).href : 'https://fenerszymanski.github.io/berlinwalk-widgets/assets/walkofberlin-wordmark-white.png';
  const attr = (el, key, value) => { if (el.getAttribute(key) !== value) el.setAttribute(key, value); };
  const styleId = 'bw-planner-brand-refresh-css';
  const roots = new WeakSet();
  function refresh(root) {
    if (location.pathname.replace(/\/+$/, '') !== '/berlin-trip-planner') return;
    root.querySelectorAll('.bw-v4-logo img, .bw-v4-footer-trust img').forEach(img => {
      attr(img, 'src', logo); attr(img, 'alt', 'Walk of Berlin');
      attr(img, 'width', '140'); attr(img, 'height', '22');
    });
    root.querySelectorAll('img[alt="Yusuf, BerlinWalk guide"]').forEach(img => attr(img, 'alt', 'Yusuf, Walk of Berlin guide'));
    root.querySelectorAll('[aria-label="BerlinWalk home"]').forEach(el => attr(el, 'aria-label', 'Walk of Berlin home'));
    root.querySelectorAll('[aria-label="BerlinWalk trip planning information"]').forEach(el => attr(el, 'aria-label', 'Walk of Berlin trip planning information'));
    root.querySelectorAll('a[href]').forEach(a => {
      const raw = a.getAttribute('href');
      try {
        const url = /^https?:\/\//i.test(raw) ? new URL(raw) : null;
        if (!url) return;
        if (url.hostname === 'berlinwalk.com' || url.hostname === 'www.berlinwalk.com') {
          url.hostname = 'walkofberlin.com'; attr(a, 'href', url.href);
        } else if (url.hostname === 'www.instagram.com' && /^\/berlinwalkingtour\/?$/.test(url.pathname)) {
          url.pathname = '/walkofberlin/'; attr(a, 'href', url.href);
        }
      } catch (_) {}
      if (a.textContent.trim() === 'berlinwalk.com') a.textContent = 'walkofberlin.com';
      if (a.textContent.trim() === '@berlinwalkingtour') a.textContent = '@walkofberlin';
    });
  }
  function attach() {
    if (location.pathname.replace(/\/+$/, '') !== '/berlin-trip-planner') return;
    document.querySelectorAll('bw-berlin-trip-planner-page').forEach(root => {
      if (!roots.has(root)) {
        roots.add(root);
        new MutationObserver(() => refresh(root)).observe(root, {subtree:true, childList:true, attributes:true, attributeFilter:['src','href','alt','aria-label']});
      }
      refresh(root);
    });
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style'); style.id = styleId;
      style.textContent = '.bw-v4-native .bw-v4-logo{flex:0 0 140px;width:140px}.bw-v4-native .bw-v4-logo img,.bw-v4-native .bw-v4-footer-trust img{width:140px!important;height:auto!important;object-fit:contain}.bw-v4-native .bw-v4-header-inner{flex-wrap:wrap;gap:12px;padding-block:8px}.bw-v4-native .bw-v4-footer-trust{flex-wrap:wrap}';
      document.head.appendChild(style);
    }
  }
  new MutationObserver(attach).observe(document.documentElement, {subtree:true, childList:true});
  window.addEventListener('popstate', attach);
  attach();
})();
