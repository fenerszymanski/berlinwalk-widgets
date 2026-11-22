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
// 3. Journey lane (Yusuf, 29 Oct 2026: "yap bunu da"), only when the visitor allowed ANALYTICS in the Wix banner: each step goes to the
//    consented booking-funnel endpoint (/api/track-paid-event, PaidFunnelEvents) with a random journey id held in memory for this page
//    load (never stored on the device; Wix's in-site navigation keeps it, a reload starts a new one). Lane 1 stays identifier-free and is
//    never joined to it. With consent the journey id also goes into the cart line's "Ref:" (window.__bwStoreJourneyRef), so a paid Wix
//    order can be matched to its steps.
// window.__bwStoreFunnel logs what was counted, sent to the pixel or skipped (and why), for QA.
const W = typeof window !== 'undefined' ? window : {};
const ENDPOINT = 'https://app.berlinwalk.com/api/traffic-count';
const HOSTS = ['www.walkofberlin.com', 'www.berlinwalk.com'];
export const YS_ID = '8aaf5412-7f21-42c7-acfb-85dd8417d68c';
export const YS_MOUNTED_IDS = ['33c1b670-fadc-4bcf-a1a5-82cc14b668ea','6cf293bb-ae66-4cc0-a028-e6c08a15b325'];
export const YS_DIGITAL_ID = '9b6fbecf-32e4-27dc-f3e6-9c887fe7f495';   // its digital file (26 Oct 2026); add counts land on the 1928 page path
export const YS_PATH = '/product-page/your-berlin-street-in-1928-personalised-aerial-print-30-x-40-cm';
const STORE_PATH = '/category/all-products';
const PIXEL_STEPS = {search: 'YSSearch', pick: 'YSPick', preview: 'YSPreview', seen: 'YSSeen'};
const JOURNEY_ENDPOINT = 'https://app.berlinwalk.com/api/track-paid-event';
const JOURNEY_STEPS = {search: 'bw_store_ys_search', pick: 'bw_store_ys_pick', preview: 'bw_store_ys_preview', addtap: 'bw_store_ys_add_tap', seen: 'bw_store_ys_seen', mailsend: 'bw_store_ys_mail_send'};
const done = new Set();
let successfulAddSequence=0;
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
  const here = String(W.location?.pathname || '').replace(/^\/de(?=\/|$)/, '').replace(/\/+$/, '').toLowerCase();
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
    if (adTag && AD_STEPS.has(step) && !base.startsWith(AD_BASE)) count(step, AD_BASE + adTag);
    return true;
  } catch (e) { return false; }
}
// Ad tag (Yusuf approved 21 Nov 2026, Meta ad review item 6a). The utm_content of the URL a visitor arrived on, counted as an aggregate on this same page counter so
// every ad's landing views (and the steps taken on that same page load) can be read next to Meta's link clicks. Path form /ad-tag/<tag>/step-<name>: three
// segments (the counter's own contract), and step paths are already left out of the site totals. The tag is the lowercase utm_content, [a-z0-9._-] only, at most
// 40 characters, and only when utm_source is one of our own channels. It is held in memory for this document only: no cookie, no storage, no identifier,
// no query string leaves the browser, and the visitor is never joined to anything. A full page load without UTM (the store opens product pages from a
// category page that way) starts untagged on purpose: carrying the tag further would need storage.
const AD_BASE = '/ad-tag/';
const AD_SOURCES = new Set(['meta', 'facebook', 'instagram', 'newsletter', 'whatsapp', 'short_link', 'store', 'google', 'blog', 'tool']);
const AD_STEPS = new Set(['add', 'option', 'size-guide', 'checkout']);
export function adTagOf(search) {
  try {
    const q = new URLSearchParams(search || '');
    const tag = String(q.get('utm_content') || '').trim().toLowerCase();
    return /^[a-z0-9][a-z0-9._-]{0,39}$/.test(tag) && AD_SOURCES.has(String(q.get('utm_source') || '').trim().toLowerCase()) ? tag : '';
  } catch (e) { return ''; }
}
const adTag = adTagOf(W.location?.search);
// Called by the storefront element once its data has loaded (never at import, so the privacy rules of count() apply at that moment); once per document and tag.
export function adLanding() { if (adTag) count('landing', AD_BASE + adTag); }
function analyticsAllowed() {
  try { return W.consentPolicyManager?.getCurrentConsentPolicy?.()?.policy?.analytics === true; } catch (e) { return false; }
}
// Paid store attribution: only named tests, both consents, tab scope and 30-minute inactivity.
// No address/search/cover text or advertising click identifiers enter storage or event payloads.
const PAID_STORE_KEY = 'wob-store-paid-session-v1';
const LEGACY_GOOGLE_KEY = 'wob-google-1928-session-v1';
const PAID_STORE_CAMPAIGNS = {
 '1928_de_gdn_pilot': {source:'google',medium:'display',contents:['01-deine-strasse','02-dein-zuhause','03-geschenk']},
 'w46_1928_de': {source:'meta',medium:'paid_social',contents:['d1','d2','d3','d4']},
 'cal2027_de': {source:'meta',medium:'paid_social',contents:['k1','k2','k3','k4']},
};
function paidStoreContext() {
 try {
  const clear=()=>{W.sessionStorage?.removeItem(PAID_STORE_KEY);W.sessionStorage?.removeItem(LEGACY_GOOGLE_KEY);if(W.__bwStorePaidJourneyRef===W.__bwStoreJourneyRef)delete W.__bwStoreJourneyRef;delete W.__bwStorePaidJourneyRef;};
  const policy=W.consentPolicyManager?.getCurrentConsentPolicy?.()?.policy||{};
  if(!policy.analytics||!policy.advertising||W.navigator?.globalPrivacyControl){clear();return null;}
  const q=new URLSearchParams(W.location.search),campaign=q.get('utm_campaign'),spec=PAID_STORE_CAMPAIGNS[campaign];
  const qa=q.get('qa')==='1'||/^codex_/.test(q.get('utm_content')||'');
  const incoming=spec&&q.get('utm_source')===spec.source&&q.get('utm_medium')===spec.medium;
  const content=incoming&&(spec.contents.includes(q.get('utm_content'))||qa&&q.get('utm_content')==='codex_qa')?q.get('utm_content'):'';
  let c;try{c=JSON.parse(W.sessionStorage.getItem(PAID_STORE_KEY)||W.sessionStorage.getItem(LEGACY_GOOGLE_KEY)||'null');}catch{}
  const known=PAID_STORE_CAMPAIGNS[c?.utmCampaign];
  if(c&&(!known||c.utmSource!==known.source||c.utmMedium!==known.medium||!Number.isFinite(c.expires)||c.expires<=Date.now()||!/^[a-f0-9]{32}$/.test(c.sessionId)||!(known.contents.includes(c.utmContent)||c.utmContent===''||c.isQa===true&&c.utmContent==='codex_qa')))c=null;
  if((q.has('utm_campaign')||q.has('utm_source')||q.has('utm_medium'))&&!incoming){clear();return null;}
  if(incoming&&c&&(c.utmCampaign!==campaign||c.utmContent!==content||Boolean(c.isQa)!==qa))c=null;
  if(!c&&incoming){const bytes=new Uint8Array(16);W.crypto.getRandomValues(bytes);c={sessionId:Array.from(bytes,x=>x.toString(16).padStart(2,'0')).join(''),utmSource:spec.source,utmMedium:spec.medium,utmCampaign:campaign,utmContent:content,...(qa?{isQa:true}:{})};}
  if(!c){clear();return null;}
  c.expires=Date.now()+30*60*1000;W.sessionStorage.setItem(PAID_STORE_KEY,JSON.stringify(c));W.sessionStorage.removeItem(LEGACY_GOOGLE_KEY);return c;
 }catch{return null;}
}
W.document?.addEventListener('consentPolicyChanged',()=>paidStoreContext());
W.document?.addEventListener('consentPolicyInitialized',()=>paidStoreContext());
paidStoreContext();
function journeyId() {
  if (!W.__bwStoreJourney) {
    const bytes = new Uint8Array(9);
    try { W.crypto.getRandomValues(bytes); } catch (e) { return ''; }
    W.__bwStoreJourney = Array.from(bytes, b => (b % 36).toString(36)).join('') + Date.now().toString(36).slice(-3);
  }
  return W.__bwStoreJourney;
}
// Consented journey event. Each step once per page load; nothing is sent (and no id made) without analytics consent.
export function journey(eventName, path, payload = {}) {
  const why = skipReason();
  if (why) { log.skipped.push({journey: eventName, why}); return false; }
  if (!analyticsAllowed()) { log.skipped.push({journey: eventName, why: 'consent'}); return false; }
  const campaign = paidStoreContext();
  const id = campaign?.sessionId || journeyId(); if (!id) return false;
  const k = `journey:${eventName}:${path}${campaign ? ':'+id : ''}`;
  if (done.has(k)) return false;
  done.add(k);
  // Native 1928 cart Ref accepts at most 16 characters; keep the full paid session separate.
  const orderJourneyId=campaign?id.slice(0,16):id;
  W.__bwStoreJourneyRef = orderJourneyId;
  if(campaign)W.__bwStorePaidJourneyRef=orderJourneyId;
  try {
    W.fetch(JOURNEY_ENDPOINT, {method: 'POST', mode: 'cors', credentials: 'omit', cache: 'no-store', keepalive: true, referrerPolicy: 'no-referrer',
      headers: {'content-type': 'application/json'}, body: JSON.stringify({eventName, eventId: `${id}:${eventName}:${Date.now().toString(36)}`, sessionId: id, journeyId: orderJourneyId,
        consentGranted: true, analyticsConsent: true, ...(campaign ? {advertisingConsent:true,utmSource:campaign.utmSource,utmMedium:campaign.utmMedium,utmCampaign:campaign.utmCampaign,utmContent:campaign.utmContent} : {}), pagePath: path, timestamp: new Date().toISOString(), payload:{...payload,...(campaign?.isQa?{isQa:true}:{})}})}).catch(() => {});
    (log.journey = log.journey || []).push(eventName);
    return true;
  } catch (e) { return false; }
}
function adsAllowed() {
  try { return W.navigator?.globalPrivacyControl !== true && W.consentPolicyManager?.getCurrentConsentPolicy?.()?.policy?.advertising === true && typeof W.fbq === 'function'; } catch (e) { return false; }
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
// Calendar (13 Nov 2026, for the Dein Berlin 2027 ads): CalPlace goes to the pixel once per page load when the visitor adds their first
// own place (the ad set optimises for it, like YSPreview for the 1928 print); its cart add sends AddToCart through added().
const CAL_ID = 'd35601ed-3b43-4269-afb9-32e7c3b1e128';
const CAL_PATH='/product-page/dein-berlin-2027-personalised-wall-calendar';
let calendarPlaced=false;
export function calendarStep(step,details={}) {
 if(['calendar-place','calendar-preview','calendar-add'].includes(step))count(step,CAL_PATH);
 if(step==='calendar-place'){calendarPlaced=true;journey('bw_store_calendar_place',CAL_PATH,{productId:CAL_ID});pixel('trackCustom','CalPlace',{content_ids:[CAL_ID],content_type:'product'},step);}
 if(step==='calendar-preview'&&calendarPlaced&&details.ownPhotosReady===true)journey('bw_store_calendar_preview',CAL_PATH,{productId:CAL_ID});
}
// profile (22 Nov 2026): the sister product "Your Berlin Street in 1979" passes its own {path, posterId}; the steps then count under its page path and name
// its product id, so the two prints stay apart in every lane. Called with one argument (the 1928 page) nothing changes.
export function ysStep(step, profile) {
  const path = profile?.path || YS_PATH, id = profile?.posterId || YS_ID;
  count(step, path);
  if(['search','preview'].includes(step))W.WobCampaignFunnel?.emit('interest',step==='search'?'street_search':'street_preview');
  if (JOURNEY_STEPS[step]) journey(JOURNEY_STEPS[step], path, {productId: id});
  if (PIXEL_STEPS[step]) pixel('trackCustom', PIXEL_STEPS[step], {content_ids: [id], content_type: 'product'}, profile ? step + ':' + id : step);
}
// "+ Add another address" under the 1928 lines in the cart page or side cart (9 Nov 2026): lane 1 only, a path under the 1928 page like its other
// steps, once per page load. No journey or pixel event: the backend journey allowlist and the pixel have no such event.
export function ysAddAnother() {
  count('add-another', YS_PATH);
}
export function added(product, quantity = 1) {
  if (!product?.wixProductId) return;
  count('add', pathOf(product));
  W.WobCampaignFunnel?.emit('cart','add_to_cart');
  campaignGaEvent('add_to_cart',{currency:product.currency||'EUR',value:money(product.priceCents)*quantity,items:[{item_id:product.wixProductId,item_name:product.name,price:money(product.priceCents),quantity}]});
  journey('bw_store_add', pathOf(product), {productId: product.wixProductId, quantity});
  pixel('track', 'AddToCart', {content_ids: [product.wixProductId], content_type: 'product', content_name: product.name, value: money(product.priceCents) * quantity, currency: product.currency || 'EUR'}, product.wixProductId+':'+(++successfulAddSequence));
}
// Consent-free count only: Wix's checkout page sends InitiateCheckout to the pixel itself.
export function checkout(cart, profiles = []) {
  const lines = cart?.lines || [];
  count('checkout', STORE_PATH);
  W.WobCampaignFunnel?.emit('checkout','begin_checkout');
  journey('bw_store_checkout', STORE_PATH, {productIds: lines.map(line => line.productId).slice(0, 10), items: lines.length});
  if (lines.some(line => line.productId === YS_ID || line.productId === YS_DIGITAL_ID || YS_MOUNTED_IDS.includes(line.productId))) count('checkout', YS_PATH);
  if (lines.some(line => line.productId === YS_DIGITAL_ID)) count('checkout-digital', YS_PATH);
  for (const profile of profiles) {   // sister products (1979): their own page path, counted once per page load like the 1928 ones
    if (lines.some(line => line.productId === profile.posterId || line.productId === profile.digitalId)) count('checkout', profile.path);
    if (lines.some(line => line.productId === profile.digitalId)) count('checkout-digital', profile.path);
  }
}

function campaignGaEvent(name,data){
 if(navigator.globalPrivacyControl)return;var policy;try{policy=window.consentPolicyManager.getCurrentConsentPolicy().policy;}catch{return;}if(policy.analytics!==true)return;
 window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
 if(!window.__wobCommerceGAConfigured){window.__wobCommerceGAConfigured=true;window.gtag('consent','update',{analytics_storage:'granted',ad_storage:policy.advertising===true?'granted':'denied'});window.gtag('js',new Date());window.gtag('config','G-4HWBTM07N2',{send_page_view:false,cookie_domain:'walkofberlin.com'});if(!document.querySelector('script[src*="googletagmanager.com/gtag/"]')){var tag=document.createElement('script');tag.async=true;tag.src='https://www.googletagmanager.com/gtag/js?id=G-4HWBTM07N2';document.head.append(tag);}}
 window.gtag('event',name,Object.assign({send_to:'G-4HWBTM07N2',transport_type:'beacon'},data));
}

// Storefront fall back to Wix's own shop (14 Nov 2026, Yusuf: "yes, add it"): the cart BRIDGE_TIMEOUT of 13 Nov had no record at all.
// Lane 1: one identifier-free count per page load under the page's own path (step-fallback-timeout / step-fallback-error).
// GA4: bw_store_fallback with the reason code, only with analytics consent (campaignGaEvent). Nothing else.
export function fallback(reason) {
 const page=String(W.location?.pathname||'').replace(/^\/de(?=\/|$)/,'').replace(/\/+$/,'').toLowerCase()||'/';
 const code=String(reason||'SHOP_UNAVAILABLE').replace(/[^A-Z0-9_]/gi,'').slice(0,40)||'SHOP_UNAVAILABLE';
 count(code==='BRIDGE_TIMEOUT'?'fallback-timeout':'fallback-error',page);
 try{campaignGaEvent('bw_store_fallback',{reason:code,page_path:page});}catch(e){}
}

// Own catalogue copy (18 Nov 2026): after the loading view showed prices from data/catalog-snapshot.json, the first live Velo
// catalogue is compared once. One identifier-free count per page load: step-snapshot-match or step-snapshot-mismatch.
export function snapshotCheck(match) {
 const page=String(W.location?.pathname||'').replace(/^\/de(?=\/|$)/,'').replace(/\/+$/,'').toLowerCase()||'/';
 count(match?'snapshot-match':'snapshot-mismatch',page);
}

// Design 2 navigation: aggregate counter only. No query or pixel events.
export function design2Step(step) {
 if(!['hero','menu-posters','menu-gifts','menu-explore','search','search-empty','recommendation-similar','recommendation-hang-together','recommendation-explore','second-item'].includes(step))return;
 const lang=/^\/de(?:\/|$)/.test(W.location?.pathname||'')||/\/category\/(?:berlin-poster|berlin-geschenke|berlin-kalender-2027)\/?$/.test(W.location?.pathname||'')||new URLSearchParams(W.location?.search||'').get('lang')==='de'?'de':'en';
 count('design2-'+step+'-'+lang,STORE_PATH);
}

// Early product view (19 Nov 2026): aggregate counter only. shown = the page drew sizes and the buy button from our own catalogue copy;
// add = "Add to cart" tapped before the bridge was ready; sent = that add went to the cart; refused = the live catalogue said no.
export function earlyStep(step) {
 if(!['shown','add','sent','refused'].includes(step))return;
 const page=String(W.location?.pathname||'').replace(/^\/de(?=\/|$)/,'').replace(/\/+$/,'').toLowerCase()||'/';
 count('early-'+step,page);
}

// Product page interest (20 Nov 2026, store-wide): aggregate counter only, once per page load under the product's own path.
// option = a size, colour, paper or other option was changed; info-delivery = "Delivery & returns" opened; info-other = any other section opened.
export function pageStep(step) {
 if(!['option','info-delivery','info-other','buy-bar','drawer-checkout','size-guide'].includes(step))return;   // buy-bar = phone bottom bar tapped, drawer-checkout = Checkout in the cart drawer (20 Nov 2026)
 const page=String(W.location?.pathname||'').replace(/^\/de(?=\/|$)/,'').replace(/\/+$/,'').toLowerCase()||'/';
 if(!page.startsWith('/product-page/'))return;
 count(step,page);
}
