// Store funnel measurement (Yusuf, 24 Oct 2026: "funnelda ölçümde hiç eksiklik kalmasın"). Two lanes, nothing else:
// 1. Consent-free step counts on my own page counter (app.berlinwalk.com/api/traffic-count), with the same contract and the same skip
//    rules as the site's page-view counter embed: the body is only {"v":1,"p":"<path>"}; no cookie, no storage, no identifier, no query
//    string. A step is counted as a path under the page it belongs to (e.g. /product-page/<slug>/step-preview), once per page load.
//    Purchases are not counted here: the Wix order is the record (its cart line carries "Ref:").
// 2. Meta pixel events, only when the visitor allowed advertising (window.consentPolicyManager) and the site's pixel is loaded:
//    AddToCart and the custom steps of the personalised print (YSSearch, YSPick, YSPreview, YSSeen). Measured on the live site
//    (24 Oct 2026, consented test browser): Wix's own Meta integration already sends ViewContent (product page), InitiateCheckout
//    (Wix checkout page) and Purchase (thank-you page) with event ids, but no AddToCart for this storefront's own add button. So this
//    file sends only what Wix does not, never a second ViewContent, InitiateCheckout or Purchase.
// window.__bwStoreFunnel logs what was counted, sent to the pixel or skipped (and why), for QA.
const W = typeof window !== 'undefined' ? window : {};
const ENDPOINT = 'https://app.berlinwalk.com/api/traffic-count';
const HOSTS = ['www.walkofberlin.com', 'www.berlinwalk.com'];
export const YS_ID = '8aaf5412-7f21-42c7-acfb-85dd8417d68c';
export const YS_DIGITAL_ID = '9b6fbecf-32e4-27dc-f3e6-9c887fe7f495';   // its digital file (26 Oct 2026); add counts land on the 1928 page path
export const YS_PATH = '/product-page/your-berlin-street-in-1928-personalised-aerial-print-30-x-40-cm';
const STORE_PATH = '/category/all-products';
const PIXEL_STEPS = {search: 'YSSearch', pick: 'YSPick', preview: 'YSPreview', seen: 'YSSeen'};
const done = new Set();
const log = W.__bwStoreFunnel = W.__bwStoreFunnel || {counted: [], pixel: [], skipped: []};

function skipReason() {
  try {
    if (W.location.protocol !== 'https:' || !HOSTS.includes(W.location.hostname)) return 'host';
    if (W.top !== W.self) return 'frame';
  } catch (e) { return 'frame'; }
  const N = W.navigator || {};
  if (N.webdriver === true) return 'webdriver';
  if (N.globalPrivacyControl === true) return 'gpc';
  try { if (W.localStorage.getItem('bwTrafficCountOptOut') === '1') return 'optout'; } catch (e) { /* storage blocked: count like the page counter does */ }
  if (typeof W.fetch !== 'function') return 'nofetch';
  return '';
}
const pathOf = product => {
  try { const p = new URL(product?.productUrl || '', 'https://www.walkofberlin.com').pathname.replace(/\/+$/, '').toLowerCase(); if (p.startsWith('/product-page/')) return p; } catch (e) { /* fall through */ }
  const here = String(W.location?.pathname || '').replace(/\/+$/, '').toLowerCase();
  return here.startsWith('/product-page/') ? here : STORE_PATH;
};
export function count(step, base) {
  const path = `${base}/step-${step}`;
  if (done.has(path)) return false;
  done.add(path);
  const why = skipReason();
  if (why) { log.skipped.push({path, why}); return false; }
  try {
    W.fetch(ENDPOINT, {method: 'POST', mode: 'cors', credentials: 'omit', cache: 'no-store', keepalive: true, referrerPolicy: 'no-referrer',
      headers: {'content-type': 'text/plain'}, body: JSON.stringify({v: 1, p: path})}).catch(() => {});
    log.counted.push(path);
    return true;
  } catch (e) { return false; }
}
function adsAllowed() {
  try { return W.consentPolicyManager?.getCurrentConsentPolicy?.()?.policy?.advertising === true && typeof W.fbq === 'function'; } catch (e) { return false; }
}
// Not marked as sent while consent is missing, so a step after the visitor accepts the banner still reaches the pixel.
export function pixel(kind, name, data, key) {
  const k = `pixel:${name}:${key || ''}`;
  if (done.has(k)) return false;
  if (!adsAllowed()) { log.skipped.push({pixel: name, why: 'consent'}); return false; }
  done.add(k);
  try { W.fbq(kind, name, data); log.pixel.push(name); return true; } catch (e) { return false; }
}
const money = cents => Math.round(Number(cents) || 0) / 100;

// Steps of the personalised print's designer: search, pick, preview (both photos loaded), seen (checkbox), noresult, photoerror.
export function ysStep(step) {
  count(step, YS_PATH);
  if (PIXEL_STEPS[step]) pixel('trackCustom', PIXEL_STEPS[step], {content_ids: [YS_ID], content_type: 'product'}, step);
}
export function added(product, quantity = 1) {
  if (!product?.wixProductId) return;
  count('add', pathOf(product));
  pixel('track', 'AddToCart', {content_ids: [product.wixProductId], content_type: 'product', content_name: product.name, value: money(product.priceCents) * quantity, currency: product.currency || 'EUR'}, product.wixProductId);
}
// Consent-free count only: Wix's checkout page sends InitiateCheckout to the pixel itself.
export function checkout(cart) {
  const lines = cart?.lines || [];
  count('checkout', STORE_PATH);
  if (lines.some(line => line.productId === YS_ID || line.productId === YS_DIGITAL_ID)) count('checkout', YS_PATH);
  if (lines.some(line => line.productId === YS_DIGITAL_ID)) count('checkout-digital', YS_PATH);
}
