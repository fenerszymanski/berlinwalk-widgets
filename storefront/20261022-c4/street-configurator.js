import {HOMES_CONFIG,encodeHomes,decodeHomes} from './homes-encoding.js';
import {mountHomes,countChoice,isHomes,homesReady} from './homes-configurator.js?v=ys-framed-20261111';
import {loadAerialPhoto,loadAerialImage} from './aerial-source.js';
export {HOMES_CONFIG,decodeHomes};
// Palette file is byte-identical to generator/print-options.json; no independent CSS colour approximation.
export const PRINT_OPTIONS = await fetch(new URL('./print-options.json', import.meta.url)).then(r => {if(!r.ok)throw Error('PRINT_OPTIONS_UNAVAILABLE');return r.json();});
export const ysLayout = state => Object.hasOwn(PRINT_OPTIONS.layouts,state.layout) ? state.layout : 'then-now';
export const ysColour = state => Object.hasOwn(PRINT_OPTIONS.themes,state.colour) ? state.colour : 'sepia';
export const optionNames = state => ({layout:PRINT_OPTIONS.layouts[ysLayout(state)], colour:PRINT_OPTIONS.themes[ysColour(state)].name});
export function parsePrintDetails(value) {
  const point=/Map point\s*(-?[0-9.]+)\s*,\s*(-?[0-9.]+)/.exec(value || '');
  const fields=Object.fromEntries([...String(value||'').matchAll(/(?:^|\/\/|\|)\s*(Title|Area|Line|Ref|Layout|Colour):\s*(.*?)(?=\s*(?:\/\/|\|)|$)/gi)].map(m=>[m[1].toLowerCase(),m[2].trim()]));
  return point && fields.title && fields.area ? {...fields,lat:Number(point[1]),lon:Number(point[2])} : null;
}
// Same Pillow L conversion, 1% autocontrast LUT and three-stop palette as the print.
export function gradePixels(source, theme, archive) {
  const out=new Uint8ClampedArray(source.length), grey=new Uint8Array(source.length/4), hist=new Uint32Array(256);
  if(archive) {
    for(let i=0;i<grey.length;i++){const p=i*4;grey[i]=(19595*source[p]+38470*source[p+1]+7471*source[p+2]+32768)>>16;hist[grey[i]]++;}
    let lo=0,hi=255,cut=Math.floor(grey.length/100),n=cut;
    while(lo<255 && n>=hist[lo])n-=hist[lo++];n=cut;
    while(hi>0 && n>=hist[hi])n-=hist[hi--];
    const lut=Array.from({length:256},(_,g)=>hi<=lo?g:Math.max(0,Math.min(255,Math.floor((g-lo)*255/(hi-lo)))));
    for(let i=0;i<grey.length;i++){const v=lut[grey[i]],p=i*4;for(let c=0;c<3;c++)out[p+c]=v<127?theme.black[c]+Math.floor(v*(theme.mid[c]-theme.black[c])/127):theme.mid[c]+Math.floor((v-127)*(theme.white[c]-theme.mid[c])/128);out[p+3]=255;}
  } else {
    for(let p=0;p<source.length;p+=4){const lum=.299*source[p]+.587*source[p+1]+.114*source[p+2];for(let c=0;c<3;c++){const v=lum+(source[p+c]-lum)*theme.sat;out[p+c]=Math.floor(theme.lo[c]+(theme.hi[c]-theme.lo[c])*v/255+.5);}out[p+3]=255;}
  }
  return out;
}
// "Your Berlin Street in 1928" configurator (store product only). Geometry is identical to
// content/products/your-street-1928/SPEC.md and generator/make_print.py, layout "A6 white" (utm33).
// Pure browser code: Photon geocoding with Nominatim as fallback (Berlin only), two WMS GetMap <img> previews (1928 above, today below,
// the same ground at the same scale), tap-to-move ring.
export const YS_PRODUCT_ID = '8aaf5412-7f21-42c7-acfb-85dd8417d68c';
export const YS_FIELDS = Object.freeze({
  address: 'Address or place in Berlin',
  details: 'Print details (set by the map)',
});
// Wix allows two custom text fields per product here, so map point, title, area and the personal line share the second one.
export const YS_LIMITS = Object.freeze({address: 80, details: 200, title: 24, area: 30, line: 40});
// Layout "A6 white" (24 Oct 2026) on make_print.py's 1800 x 2400 design grid: two photos of 1400 x 746 units at x = 200 (y = 200 and 1046, placed in storefront.css),
// both showing the identical ground box, 368 m wide and 196.09 m tall (3.8043 units per metre), centred on the buyer's point. Ring: 26 m outer radius, stroke inside it.
const GRID = {w: 1800, h: 2400}, PHOTO = {w: 1400, h: 746};
const GROUND_W = 368, GROUND_H = GROUND_W * PHOTO.h / PHOTO.w, RING = 26, RING_STROKE = 8;
const SCREEN_PX = [720, 384];   // WMS pixels per photo on screen, the 1400 : 746 shape (the print asks for 2756 x 1468). 720 since 24 Oct 2026
                                 // (Yusuf: protect the preview): sharp on a phone, about 80 dpi if a screenshot is printed at 30 x 40 cm
// Text block, baselines on the design grid, everything centred on x = 900. The two captions are letter-spaced (8 and 10 units); the generator centres the
// letters without the trailing space, SVG text-anchor includes it, so x moves right by half the spacing.
const TX = {cx: 900, cap1928: 990, capToday: 1836, title: 2011, area: 2083, coords: 2137, line: 2199, track1928: 8, trackToday: 10};
const WMS_1928 = 'https://gdi.berlin.de/services/wms/luftbild_1928_04', LAYER_1928 = 'c_luftbilder_1928_04_raster';
const WMS_TODAY = 'https://gdi.berlin.de/services/wms/truedop_2026', LAYER_TODAY = 'truedop_2026';
const BERLIN = {west: 13.0884, east: 13.7612, north: 52.6755, south: 52.3383};
const NOMINATIM = 'https://nominatim.openstreetmap.org/search';
// Photon (komoot, OpenStreetMap data) forgives typos ("fisherinsel") and is built for search-as-you-type; Nominatim is not.
const PHOTON = 'https://photon.komoot.io/api/';

// Photo loading lives in aerial-source.js since 10 Nov 2026: Geoportal first, then my own copy of the two layers, then
// slow retries with a plain message (bilingual through ys-de.js). Same arguments and the same first steps as before.
export {loadAerialPhoto};

export function utm33(lat, lon) {
  const a = 6378137.0, f = 1 / 298.257222101, e2 = f * (2 - f), k0 = 0.9996, lon0 = 15 * Math.PI / 180;
  const la = lat * Math.PI / 180, lo = lon * Math.PI / 180;
  const N = a / Math.sqrt(1 - e2 * Math.sin(la) ** 2), T = Math.tan(la) ** 2, ep2 = e2 / (1 - e2), C = ep2 * Math.cos(la) ** 2, A = Math.cos(la) * (lo - lon0);
  const M = a * ((1 - e2 / 4 - 3 * e2 ** 2 / 64 - 5 * e2 ** 3 / 256) * la - (3 * e2 / 8 + 3 * e2 ** 2 / 32 + 45 * e2 ** 3 / 1024) * Math.sin(2 * la)
    + (15 * e2 ** 2 / 256 + 45 * e2 ** 3 / 1024) * Math.sin(4 * la) - (35 * e2 ** 3 / 3072) * Math.sin(6 * la));
  const x = 500000 + k0 * N * (A + (1 - T + C) * A ** 3 / 6 + (5 - 18 * T + T * T + 72 * C - 58 * ep2) * A ** 5 / 120);
  const y = k0 * (M + N * Math.tan(la) * (A * A / 2 + (5 - T + 9 * C + 4 * C * C) * A ** 4 / 24 + (61 - 58 * T + T * T + 600 * C - 330 * ep2) * A ** 6 / 720));
  return [x, y];
}
// Inverse by Newton steps on the forward projection (metre offsets are tiny, three steps are exact to well under a millimetre).
export function fromUtm33(x, y, seed) {
  let [lat, lon] = seed;
  for (let i = 0; i < 4; i++) {
    const [cx, cy] = utm33(lat, lon);
    lat += (y - cy) / 111320;
    lon += (x - cx) / (111320 * Math.cos(lat * Math.PI / 180));
  }
  return [lat, lon];
}
export function wmsUrl(base, layer, cx, cy, w, h, pw, ph) {
  const bbox = [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2].map(v => v.toFixed(2)).join(',');
  return `${base}?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=${layer}&STYLES=&CRS=EPSG%3A25833&BBOX=${bbox}&WIDTH=${pw}&HEIGHT=${ph}&FORMAT=image%2Fpng`;
}
// Both photos ask for the same BBOX and the same pixel size: only the layer differs.
export const url1928 = (lat, lon, only = false) => { const [x, y] = utm33(lat, lon); return wmsUrl(WMS_1928, LAYER_1928, x, y, GROUND_W, only ? GROUND_W * 1592 / 1400 : GROUND_H, SCREEN_PX[0], only ? Math.round(SCREEN_PX[0]*1592/1400) : SCREEN_PX[1]); };
export const urlToday = (lat, lon) => { const [x, y] = utm33(lat, lon); return wmsUrl(WMS_TODAY, LAYER_TODAY, x, y, GROUND_W, GROUND_H, SCREEN_PX[0], SCREEN_PX[1]); };
// Pixel offset inside either displayed photo (fractions 0..1, origin top-left) to a new lat/lon. Both photos show the same ground box, so the maths is the same.
export function movePoint(lat, lon, fx, fy, only = false) {
  const [cx, cy] = utm33(lat, lon);
  return fromUtm33(cx + (fx - 0.5) * GROUND_W, cy + (0.5 - fy) * (only ? GROUND_W * 1592 / 1400 : GROUND_H), [lat, lon]).map(v => Math.round(v * 1e5) / 1e5);
}
// The line under the area on the print: the point to four decimals, like make_print.py. The cart carries the point to five decimals and the
// generator rounds that value, so round to five first (52.509849996 -> 52.50985 -> 52.5099 on the print, not 52.5098).
const r5 = v => Number(Number(v).toFixed(5));
export const coordsText = (lat, lon) => (Number.isFinite(lat) && Number.isFinite(lon) ? `${r5(lat).toFixed(4)}° N, ${r5(lon).toFixed(4)}° E` : '');
export const inBerlin = (lat, lon) => lat >= BERLIN.south && lat <= BERLIN.north && lon >= BERLIN.west && lon <= BERLIN.east;
// No control characters, no field separators; collapsed spaces.
export const clean = (value, max) => String(value ?? '').normalize('NFC').replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\/\/|\|/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
// Which name goes on the poster. A street or an address gives the street. A named landmark the buyer picked (station, square,
// park, church, memorial, attraction) keeps its own name when it fits the title, else the street it is on: the "Bernauer Straße"
// U-Bahn station sits on Brunnenstraße, "Alexanderplatz" station on Dircksenstraße. A shop, cafe or office gives its street
// (picking "Humana" at Oranienstraße 25 must not print HUMANA). Too long with no street: cut at a word boundary.
const LANDMARK_KEYS = new Set(['railway', 'public_transport', 'tourism', 'historic', 'leisure', 'place', 'natural', 'waterway', 'bridge', 'landuse']);
const LANDMARK_AMENITIES = new Set(['place_of_worship', 'townhall', 'theatre', 'arts_centre', 'library', 'university', 'college', 'school', 'hospital', 'fountain', 'bus_station', 'ferry_terminal', 'planetarium']);
const fitTitle = text => {
  const u = String(text || '').toUpperCase().trim();
  if (u.length <= YS_LIMITS.title) return u;
  const cut = u.slice(0, YS_LIMITS.title + 1).lastIndexOf(' ');
  return (cut >= 12 ? u.slice(0, cut) : u.slice(0, YS_LIMITS.title)).trim();
};
export function titleFrom(result) {
  const a = result?.address || {};
  const street = clean(a.road || a.pedestrian || a.footway || '', 80), name = clean(result?.name || '', 80);
  const [key, value] = result?.osm || [result?.category, result?.type];          // Photon rows carry osm, Nominatim rows category/type
  const landmark = Boolean(name) && name !== street && key !== 'highway' && (LANDMARK_KEYS.has(key) || (key === 'amenity' && LANDMARK_AMENITIES.has(value)));
  if (landmark && name.toUpperCase().length <= YS_LIMITS.title) return name.toUpperCase();
  return fitTitle(street || clean(a.square || '', 80) || name);
}
export function areaFrom(result) {
  const a = result?.address || {};
  const area = clean(a.suburb || a.city_district || a.borough || a.neighbourhood || '', 40);
  const line = area ? `${area}, Berlin` : 'Berlin';
  return line.length <= YS_LIMITS.area ? line : (area.slice(0, YS_LIMITS.area - 8).trim() + ', Berlin').slice(0, YS_LIMITS.area);
}
// Photon feature -> the Nominatim-like row the helpers above read. A street result names the road; a square, park or district keeps its name.
export function fromPhoton(feature) {
  const p = feature?.properties || {}, [lon, lat] = feature?.geometry?.coordinates || [];
  const isStreet = p.osm_key === 'highway' || p.type === 'street';
  const road = isStreet ? (p.name || p.street || '') : (p.street || '');
  return {lat: Number(lat), lon: Number(lon), name: p.name || '', city: p.city || '', osm: [p.osm_key || '', p.osm_value || ''],
    address: {road, house_number: p.housenumber || '', postcode: p.postcode || '', suburb: p.district || (p.type === 'district' ? p.name : ''), square: road ? '' : (p.name || '')}};
}
// Two lines for a suggestion: the place itself, then where it is.
export function placeLines(result) {
  const a = result?.address || {}, street = [a.road, a.house_number].filter(Boolean).join(' ');
  const main = clean(result?.name && result.name !== a.road ? result.name : (street || result?.name || result?.display_name), 70);
  const sub = clean([main === clean(street, 70) ? '' : street, a.postcode, a.suburb || a.city_district, 'Berlin'].filter(Boolean).join(', '), 90);
  return [main, sub];
}
export function addressLabel(result) {
  const a = result?.address || {};
  const street = [a.road || result?.name, a.house_number].filter(Boolean).join(' ');
  return clean([street, a.postcode, 'Berlin'].filter(Boolean).join(', '), YS_LIMITS.address) || clean(result?.display_name, YS_LIMITS.address);
}
// The two values the cart line carries. Exact keys = the product's custom text field titles.
// Ad reference for the order (24 Oct 2026, Meta test bw_ys_oct2026 and the walkofberlin.com/1928 short link): read from this page's
// own address at add time, nothing is stored on the device. "Ref:" sits before "Line:", so make_print.py's parser is unchanged (the
// title/area stop at the first "//", the line runs to the end), and it is trimmed or left out so the line is never cut.
export function adRef(search = (typeof location !== 'undefined' ? location.search : '')) {
  const q = new URLSearchParams(search || '');
  const tidy = v => String(v || '').toLowerCase().replace(/[^a-z0-9_.-]+/g, '').slice(0, 32);
  const src = tidy(q.get('utm_source')), content = tidy(q.get('utm_content'));
  return src ? (content ? `${src}/${content}` : src) : '';
}
// Where the buyer came from (Yusuf, 5 Nov 2026, after order #10162 could not be traced: "Evet, ekle"). One coarse label, read once when this
// module first loads, from the landing address's query and the browser referrer (Wix's in-site navigation keeps the first referrer). Only a
// platform name or a referring site's host goes into the order, never a full URL, path or click id; nothing is stored on the device.
const SOURCE_HOSTS = [[/(^|\.)instagram\.com$/, 'instagram'], [/(^|\.)(facebook\.com|fb\.com|fb\.me)$/, 'facebook'], [/(^|\.)threads\.(net|com)$/, 'threads'],
  [/(^|\.)google\.[a-z.]+$/, 'google'], [/(^|\.)bing\.com$/, 'bing'], [/(^|\.)duckduckgo\.com$/, 'duckduckgo'], [/(^|\.)ecosia\.org$/, 'ecosia'],
  [/(^|\.)(t\.co|x\.com|twitter\.com)$/, 'x'], [/(^|\.)(youtube\.com|youtu\.be)$/, 'youtube'], [/(^|\.)tiktok\.com$/, 'tiktok'],
  [/(^|\.)(linkedin\.com|lnkd\.in)$/, 'linkedin'], [/(^|\.)reddit\.com$/, 'reddit'], [/(^|\.)pinterest\.[a-z.]+$/, 'pinterest'],
  [/(^|\.)(chatgpt\.com|openai\.com)$/, 'chatgpt'], [/(^|\.)perplexity\.ai$/, 'perplexity'],
  [/(^|\.)(walkofberlin\.com|walksofberlin\.com|berlinwalk\.com)$/, 'site']];
export function sourceLabel(search = '', referrer = '') {
  const q = new URLSearchParams(search || ''), tidy = v => String(v || '').toLowerCase().replace(/[^a-z0-9_.-]+/g, '').slice(0, 24);
  let host = ''; try { host = new URL(referrer).hostname.toLowerCase().replace(/^www\./, ''); } catch (e) { host = ''; }
  const known = SOURCE_HOSTS.find(([re]) => re.test(host))?.[1] || '';
  if (q.get('utm_source')) return tidy(q.get('utm_source'));
  if (q.has('gclid') || q.has('gbraid') || q.has('wbraid')) return 'google-ads';
  if (q.has('fbclid')) return known === 'instagram' || known === 'facebook' ? known : 'meta';
  if (known) return known;
  return host ? tidy(host) : 'direct';
}
const LANDING_SOURCE = typeof location !== 'undefined' ? sourceLabel(location.search, typeof document !== 'undefined' ? document.referrer : '') : '';
// Spot restored from the "send this preview to my inbox" email (27 Oct 2026). The mail links to the product page with #p=<token>: an opaque
// 32-character random token in the URL FRAGMENT, which is never sent in an HTTP request or a Referer header. The spot itself never appears in
// a URL (this page runs the Meta pixel and analytics, which record page URLs). The token is read from location.hash, removed from the address
// at once (path and query stay), then exchanged for the saved context by one GET to the content app. A ?p= in the query is accepted as a
// fallback and removed the same way. An unknown or expired token just opens the page as usual.
export const PREVIEW_TOKEN = /^[A-Za-z0-9_-]{32}$/;
// Pure: {token, search, hash} where search/hash are the query and fragment WITHOUT the token. `changed` says whether the address needs rewriting.
export function splitPreviewToken(hash = (typeof location !== 'undefined' ? location.hash : ''), search = (typeof location !== 'undefined' ? location.search : '')) {
  const h = new URLSearchParams(String(hash || '').replace(/^#/, '')), q = new URLSearchParams(search || '');
  const fromHash = h.get('p') || '', fromQuery = q.get('p') || '';
  const token = PREVIEW_TOKEN.test(fromHash) ? fromHash : (PREVIEW_TOKEN.test(fromQuery) ? fromQuery : '');
  const changed = h.has('p') || q.has('p');
  h.delete('p'); q.delete('p');
  const hs = h.toString(), qs = q.toString();
  return {token, changed, search: qs ? `?${qs}` : '', hash: hs ? `#${hs}` : ''};
}
// Reads the token and rewrites the address (replaceState: no new history entry, no reload) before anything else happens.
export function takePreviewToken() {
  const found = splitPreviewToken();
  if (found.changed) { try { history.replaceState(history.state, '', location.pathname + found.search + found.hash); } catch (e) { /* address stays; the token is still used once */ } }
  return found.token;
}
export const CONTEXT_ENDPOINT = 'https://app.berlinwalk.com/api/download-lead?action=previewContext&p=';
// The server answers {lat, lon, title, area, format, size, paper}; it is checked again here before it touches the page. The personal line is never
// stored or emailed (semantic review 28 Oct 2026), so the email no longer promises the print "exactly as you left it".
export function spotFromPreview(preview) {
  const lat = Math.round(Number(preview?.lat) * 1e5) / 1e5, lon = Math.round(Number(preview?.lon) * 1e5) / 1e5;
  if (!inBerlin(lat, lon)) return null;
  const title = clean(preview?.title, YS_LIMITS.title).toUpperCase();
  if (!title) return null;
  const area = clean(preview?.area, YS_LIMITS.area);
  return {lat, lon, title, area, address: clean([title, area].filter(Boolean).join(', '), YS_LIMITS.address),
    format: preview?.format === 'digital' ? 'digital' : 'poster', size: ({'30x40': YS_SIZES[0], '45x60': YS_SIZES[1]})[preview?.size] || '',
    paper: preview?.format !== 'digital' && YS_PAPERS.some(p => p.name === preview?.paper) ? preview.paper : '', layout:ysLayout(preview||{}),colour:ysColour(preview||{})};
}
// What the preview-mail endpoint takes as `preview` (the server rounds and re-validates it; a house number is stripped there too).
export const mailPreview = state => ({lat: Number(state.lat), lon: Number(state.lon), title: clean(state.title, YS_LIMITS.title).toUpperCase(), area: clean(state.area, YS_LIMITS.area),layout:ysLayout(state),colour:ysColour(state),
  format: ysDigital(state) ? 'digital' : 'poster', size: ysDigital(state) ? '' : ysSize(state), paper: ysDigital(state) ? '' : ysPaper(state).name});
export const MAIL_ENDPOINT = 'https://app.berlinwalk.com/api/download-lead?action=previewSubmit';
export const MAIL_ASSET = {assetId: 'street-1928-preview', consentVersion: 'street-1928-preview-letter-v1-2026-10-27', consentMethod: 'optional_unticked_checkbox_with_doi'};
// Shown next to the unticked box. Must stay word for word the registry's consentText (lead-asset-registry.js), which is what gets stored.
export const MAIL_CONSENT = 'Also send me a few emails about my street print, and Walk of Berlin Weekly, the Monday letter about Berlin. I can unsubscribe from any email with one click. Read the';
export const mailMessage = (status, marketing) => {
  if (status === 200) return marketing === 'pending' ? 'Sent. Two emails are on their way: your preview, and one asking you to confirm the extra emails.'
    : marketing === 'already_confirmed' ? 'Sent. You already confirmed my emails, so nothing more to do. Check your inbox in a minute.'
    : marketing === 'failed' ? 'Your preview is on its way. I could not start the extra emails just now, so tick the box and send again later if you still want them.'
    : 'Sent. Check your inbox in a minute (and the spam folder).';
  if (status === 400) return 'That did not work. Check the email address and that a spot is picked, then try again.';
  if (status === 429) return 'Too many tries from here. Please wait a few minutes and try again.';
  return 'I could not send it just now. Please try again in a minute, or write to info@walkofberlin.com.';
};
export function buildCustomText(state, search) {
  if(isHomes(state))return encodeHomes({homes:state.homes.slice(0,Number(state.homesCount)),heading:state.heading,colour:ysColour(state),lang:new URLSearchParams(search??location.search).get('lang')==='de'?'de':'en',ref:adRef(search).slice(0,24)});
  const title = clean(state.title, YS_LIMITS.title).toUpperCase(), area = clean(state.area, YS_LIMITS.area), line = clean(state.line, YS_LIMITS.line);
  const [lat, lon] = [Number(state.lat), Number(state.lon)];
  // Compact delimiters preserve all printable text within Wix's actual 200-character limit.
  const parts = [`Map point ${lat.toFixed(5)},${lon.toFixed(5)}`, `Title:${title}|Area:${area}`, ...(line ? [`Line:${line}`] : []), `Layout:${ysLayout(state)}`, `Colour:${ysColour(state)}`];
  if(new URLSearchParams(search??(typeof location!=='undefined'?location.search:'')).get('lang')==='de')parts.push('Lang:de');
  const journeyRef = typeof window !== 'undefined' && /^[a-z0-9]{6,16}$/.test(window.__bwStoreJourneyRef || '') ? `j${window.__bwStoreJourneyRef}` : '';
  const ref = [LANDING_SOURCE && `src.${LANDING_SOURCE}`, journeyRef, adRef(search)].filter(Boolean).join('~');   // source first, so a short room keeps it
  const room = YS_LIMITS.details - parts.join('//').length - '//Ref:'.length;
  if (ref && room >= 6) parts.push(`Ref:${ref.slice(0,room)}`);
  const details=parts.join('//');
  if(details.length>YS_LIMITS.details)throw Error('PRINT_DETAILS_TOO_LONG');
  return {[YS_FIELDS.address]:clean(state.address,YS_LIMITS.address),[YS_FIELDS.details]:details};
}
// Size x paper variants (Yusuf, 24 Oct 2026). Prices mirror the Wix variants (output/store-variants-20261024/variants.json);
// Wix charges its own variant price at checkout, these only label the choice.
export const YS_SIZES = Object.freeze(['30 x 40 cm', '45 x 60 cm']);
export const YS_PAPERS = Object.freeze([
  {name: 'Premium Matte', note: '200 g matte paper, smooth and white. My pick.', price: [34.90, 47.90]},
  {name: 'Classic Matte', note: '170 g matte paper, a little lighter.', price: [29.90, 44.90]},
  {name: 'Museum-Quality Matte', note: '250 g archival paper, warm off-white.', price: [49.90, 69.90]},
  {name: 'Premium Semi-Gloss', note: '200 g paper with a soft sheen.', price: [34.90, 47.90]},
  {name: 'Classic Semi-Gloss', note: '170 g paper with a soft sheen, a little lighter.', price: [29.90, 44.90]},
]);
export const YS_FRAMED_ID = '33c1b670-fadc-4bcf-a1a5-82cc14b668ea';
export const YS_CANVAS_ID = '6cf293bb-ae66-4cc0-a028-e6c08a15b325';
export const YS_FRAMES = Object.freeze(['Black', 'White', 'Natural wood']);
export const ysMounted = state => !isHomes(state) && ['framed','canvas'].includes(state.format);
export const ysFrame = state => YS_FRAMES.includes(state.frame) ? state.frame : 'Black';
export const YS_FRAMED_PAPERS = Object.freeze([
  {name:'Premium Matte',note:'200 g matte paper, smooth and white. My pick.'},
  {name:'Fine Art',note:'Fine Art paper, printed with 12 inks for deeper tones.'}
]);
const sizeKey = state => ysMounted(state) ? state.format+'Size' : 'size';
export const ysSize = state => (YS_SIZES.includes(state[sizeKey(state)]) ? state[sizeKey(state)] : YS_SIZES[0]);
// The page opens on the cheapest poster, 30 x 40 Classic Matte (Yusuf, 26 Oct 2026: "default printed seçili ürün bence en ucuz olanı olmalı").
const YS_DEFAULT_PAPER = 'Classic Matte';
export const ysPaper = state => ysMounted(state) && state.format==='framed' ? YS_FRAMED_PAPERS.find(p=>p.name===state.framedPaper)||YS_FRAMED_PAPERS[0] : YS_PAPERS.find(p => p.name === state.paper) || YS_PAPERS.find(p => p.name === YS_DEFAULT_PAPER);
// Homes prices did not change on 12 Nov 2026 (single-poster prices fell for the Posterflow route), so they keep their own table.
const HOMES_PRICES = Object.freeze({'Premium Matte': [59.90, 74.90], 'Classic Matte': [54.90, 69.90], 'Museum-Quality Matte': [69.90, 89.90], 'Premium Semi-Gloss': [59.90, 74.90], 'Classic Semi-Gloss': [54.90, 69.90]});
export const ysPrice = state => isHomes(state) ? HOMES_PRICES[ysPaper(state).name][YS_SIZES.indexOf(ysSize(state))] : ysPaper(state).price[YS_SIZES.indexOf(ysSize(state))];
export const ysChoices = state => ysMounted(state) ? state.format==='canvas' ? {Size:ysSize(state)} : {Size:ysSize(state),Frame:ysFrame(state),Paper:ysPaper(state).name} : ({Size: ysSize(state), Paper: ysPaper(state).name});
export const euro = n => `€${n.toFixed(2)}`;
// Digital file (Yusuf, 26 Oct 2026: a cheap print-it-yourself version next to the poster). A separate Wix digital product with the same two
// map fields; the file is made with make_print.py --digital and sent by email. Offered only when the shop catalogue carries that product.
export const YS_DIGITAL_ID = '9b6fbecf-32e4-27dc-f3e6-9c887fe7f495';
export const YS_DIGITAL_PRICE = 14.90;
export const ysDigital = state => state.format === 'digital';
export const ysProductId = state => isHomes(state) ? HOMES_CONFIG.products[ysDigital(state)?"digital":"poster"] : (ysDigital(state) ? YS_DIGITAL_ID : ysMounted(state) ? (state.format==='framed'?YS_FRAMED_ID:YS_CANVAS_ID) : YS_PRODUCT_ID);
const DIGITAL_SPEC = 'Digital file · JPG + PDF · 45 x 60 cm at 300 ppi';
const DIGITAL_DELIVERY = 'Prints cleanly at 30 x 40 cm too. Nothing is shipped, so it works anywhere.';
export const MOUNTED_DELIVERY = 'Free delivery. Germany 5 to 8 working days, most of the EU and the UK 6 to 12, US 8 to 14. Exact days at checkout.';
export const MOUNTED_CHRISTMAS = 'For Christmas: order framed or canvas by 8 December (Germany), 4 December (most of the EU, UK) or 1 December (US).';
export const mountedChristmasOpen = (now=Date.now()) => now < Date.parse('2026-12-09T00:00:00+01:00');
export const FRAMED_SPEC = 'Wooden frame with acrylic glass. Hanging kit included.';
export const CANVAS_SPEC = 'On canvas, stretched over a 2 cm wooden frame. Ready to hang.';
const POSTER_DELIVERY = 'Arrives in 3 to 5 working days in Germany, 4 to 9 elsewhere. Frame not included.';
const captionFor = (state, live) => live && ysLayout(state)==='1928-only' ? 'Your home in 1928. One large aerial photograph, with your building marked.' : (ysDigital(state) ? (live ? CAPTION_LIVE.replace('Your poster, SIZE', 'Your digital file') : 'Example file. Search an address to see your home, then add your own words.') : (live ? CAPTION_LIVE : CAPTION_EXAMPLE).replace('SIZE', ysSize(state)));
// Everything the print needs except the buyer's "yes, I see the 1928 photo": the add buttons are live from here on (25 Oct 2026).
export function readyToCheck(state) {
  if(isHomes(state))return homesReady(state);
  return Number.isFinite(state.lat) && Number.isFinite(state.lon) && inBerlin(state.lat, state.lon) && clean(state.address, 80).length > 0 &&
    clean(state.title, 24).length > 0 && clean(state.area, 30).length > 0;
}
// The cart request itself still needs that yes, given once per spot in the confirm panel the add buttons open.
export const readyToAdd = state => isHomes(state) ? homesReady(state) : readyToCheck(state) && state.seen === true;

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
// One marker per photo, centred, in the photo's own 1400 x 746 units: the survey cross of make_print.ring() (26 Oct 2026, Yusuf picked it
// over the yellow ring). Arms from 0.35 to 0.75 of the 26 m radius (98.91 units), cream 2.4 units on a dark 4.4-unit hairline, open centre.
const CROSS_SVG = (() => {
  const r = RING * PHOTO.w / GROUND_W, g = r * 0.35, L = r * 0.75, x = PHOTO.w / 2, y = PHOTO.h / 2;
  const arms = [[x - L, y, x - g, y], [x + g, y, x + L, y], [x, y - L, x, y - g], [x, y + g, x, y + L]].map(a => a.map(v => v.toFixed(2)));
  const draw = (stroke, w) => arms.map(([x1, y1, x2, y2]) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${w}"/>`).join('');
  return `<svg class="ys-ring" viewBox="0 0 ${PHOTO.w} ${PHOTO.h}" aria-hidden="true">${draw('#141414', 4.4)}${draw('#FAF7EE', 2.4)}</svg>`;
})();
const RING_SVG = CROSS_SVG;
// The preview is the print itself: a 30 x 40 cm sheet laid out on make_print.py's 1800 x 2400 design grid (CSS unit --u = 1/1800 of the sheet width; the words are SVG text on the same grid).
// Title size follows the generator: 118 (96 above 16 letters), shrunk by 4 until it fits the 1400-unit width of the photos (never below 48).
export const titleSize = title => (String(title || '').length <= 16 ? 118 : 96);
const CAPTION_LIVE = `Your poster, SIZE: 1928 above, today below, same ground and scale. ${globalThis.matchMedia?.('(pointer: fine)')?.matches?'Click':'Tap'} either photo to move the cross.`;
const CAPTION_EXAMPLE = 'Example poster, SIZE. Search an address to see your home, then add your own words.';
// Trust strip next to the add buttons (Yusuf, 27 Oct 2026). True statements only: the poster ships free to DE, EU, UK and US; Gelato prints it in
// Czechia or Poland, so "Printed in Europe" and never "Germany"; a misprinted or damaged poster is reprinted free (YS_FAQ says the same); checkout
// takes cards only today, so no other payment brand is named or shown. The card marks themselves sit in the buy box (storefront-element.js).
const TRUST_ICON = {
  truck: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 6h11v9H2zM13 9h4l3 3v3h-7zM6 18.5a1.5 1.5 0 1 0 0-.01M17 18.5a1.5 1.5 0 1 0 0-.01"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s6-5.6 6-11a6 6 0 0 0-12 0c0 5.4 6 11 6 11zM12 12.2a2.2 2.2 0 1 0 0-.01"/></svg>',
  redo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 3-6.2M4 4v4.5h4.5"/></svg>',
  lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18v12H3zM3 7l9 6 9-6"/></svg>',
  file: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h8l4 4v14H6zM14 3v4h4"/></svg>',
};
const TRUST = {
  poster: [['truck', 'Free delivery to Germany, the EU, the UK and the US'], ['pin', 'Printed in Europe'], ['redo', 'Misprinted or damaged? Reprinted free']],
  digital: [['mail', 'Sent by email within 24 hours'], ['file', 'JPG and PDF, 45 x 60 cm at 300 ppi'], ['redo', 'Something wrong with the file? I fix it']],
};
const trustItems = kind => TRUST[kind].map(([icon, text]) => `<li>${TRUST_ICON[icon]}<span>${text}</span></li>`).join('');
// `secure` adds the "Secure checkout" item (the compact copy under the poster has no card marks next to it).
export const trustHtml = (secure = false, cls = '') => ['poster', 'digital'].map(kind => `<ul class="ys-trust ${cls}" data-ys-legal="${kind}" ${kind === 'digital' ? 'hidden' : ''} aria-label="Why you can buy with confidence">${trustItems(kind)}${secure ? `<li>${TRUST_ICON.lock}<span>Secure checkout</span></li>` : ''}</ul>`).join('');
// The line under the search box reads as a hint until a search runs (it keeps one line of height, so nothing below it moves).
const SEARCH_HINT = 'Type the address of a home, yours now or one from years ago, then tap it. The preview is free.';
// Yusuf, 25 Oct 2026: only 4 of the first 174 previews got past the old "I can see the 1928 photo" checkbox, which kept the add button grey two
// screens below the poster. Now an add button sits right under the poster and both add buttons are live; tapping one asks the same question
// once, in place, and "Yes" adds to the cart. `where` is "quick" (under the poster) or "form" (the buy box).
const confirmHtml = where => `<div class="ys-confirm" data-ys-confirm="${where}" role="group" aria-label="Check the 1928 photo" hidden>
      <p><strong>Quick check before it goes in your cart:</strong> can you see the 1928 aerial photo in the top picture? Nothing is ordered yet. If it is blank white, the 1928 survey did not reach that spot (far eastern edge of Berlin).</p>
      <div class="ys-confirm-row"><button type="button" class="primary" data-ys-yes>Yes, add to cart</button><button type="button" class="ys-link" data-ys-no>It is blank</button></div>
      <p class="ys-confirm-no" data-ys-noinfo hidden>The 1928 survey did not reach that spot, so I cannot print it. Try a place nearby, or tap the photo to move the cross.</p>
    </div>`;

// `host` holds two slots ([data-ys-slot="visual"], [data-ys-slot="form"]) and the add button ([data-ys-add]). Rebuilt from `state` whenever the storefront re-renders. `api.add(customText)` returns a promise; `api.busy()` says whether the cart is locked.
export function mountConfigurator(host, state, api) {
  api.homesCleanup?.();
  if(isHomes(state)&&['framed','canvas'].includes(state.format))state.format='poster';
  if(isHomes(state))return mountHomes(host,state,api,{PRINT_OPTIONS,gradePixels,utm33,fromUtm33,wmsUrl,loadAerialImage,inBerlin,fromPhoton,addressLabel,titleFrom,areaFrom,YS_SIZES,YS_PAPERS,ysSize,ysPaper,ysPrice});
  const L = YS_LIMITS;
  const currentPrice=state=>api.variantPrice?api.variantPrice(state):ysPrice(state);
  const showPrice=(el,amount)=>{if(el)el.innerHTML=api.priceHtml?api.priceHtml(amount,state):euro(amount);};
  const visual = host.querySelector('[data-ys-slot="visual"]'), formSlot = host.querySelector('[data-ys-slot="form"]');
  visual.innerHTML = `<div class="ys-visual">
      <div class="ys-stage">
        <div class="ys-sheet" data-ys="sheet" ${state.lat ? '' : 'hidden'}>
          <div class="ys-photo ys-photo-1928" data-ys="photo-1928">
            <img class="ys-1928" alt="Aerial photograph of your home in 1928, with a cross on your building" decoding="async">
            ${RING_SVG}
            <span class="ys-wm" aria-hidden="true"></span>
            <span class="ys-status" data-ys="status" role="status"></span>
          </div>
          <div class="ys-photo ys-photo-today" data-ys="photo-today">
            <img class="ys-todayimg" alt="Aerial photograph of the same spot today, same ground and scale, with a cross on the same spot" decoding="async">
            ${RING_SVG}
            <span class="ys-wm" aria-hidden="true"></span>
            <span class="ys-status" data-ys="status-today" role="status" hidden></span>
          </div>
          <svg class="ys-type" viewBox="0 0 ${GRID.w} ${GRID.h}" role="group" aria-label="Text on the print">
            <text class="ys-cap ys-cap-1928" x="${TX.cx + TX.track1928 / 2}" y="${TX.cap1928}">1928</text>
            <text class="ys-cap ys-cap-today" x="${TX.cx + TX.trackToday / 2}" y="${TX.capToday}">${new URLSearchParams(location.search).get('lang')==='de'?'HEUTE':'TODAY'}</text>
            <text class="ys-ptitle" data-ys="ptitle" x="${TX.cx}" y="${TX.title}"></text>
            <text class="ys-parea" data-ys="parea" x="${TX.cx}" y="${TX.area}"></text>
            <text class="ys-pcoords" data-ys="pcoords" x="${TX.cx}" y="${TX.coords}"></text>
            <text class="ys-pline" data-ys="pline" x="${TX.cx}" y="${TX.line}"></text>
          </svg>
          <button type="button" class="ys-words-tag" data-ys="wordstag" hidden><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M11.3 1.9a1.5 1.5 0 0 1 2.1 0l.7.7a1.5 1.5 0 0 1 0 2.1L5.6 13.2 2 14l.8-3.6z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg><span>Your words</span></button>
        </div>
        <div class="ys-sheet ys-sample" data-ys="example" ${state.lat ? 'hidden' : ''}><img src="${esc(api.sample)}" alt="Example print: Chamissoplatz in 1928 and today"><span class="ys-words-tag" aria-hidden="true"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M11.3 1.9a1.5 1.5 0 0 1 2.1 0l.7.7a1.5 1.5 0 0 1 0 2.1L5.6 13.2 2 14l.8-3.6z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg><span>Home since 2014</span></span></div>
      </div>
      <div class="ys-mockups" data-ys-mockups hidden><p>Example rooms. Your print shows the address you choose.</p><div data-ys-picture="framed"><img data-ys-frame-image alt="Framed print in an example room" width="1200" height="1200" loading="lazy"><img data-ys-frame-sizes src="${new URL('./assets/framed-20261111/room-two-sizes.webp',import.meta.url).href}" alt="Framed prints at 30 x 40 cm and 45 x 60 cm side by side" width="1200" height="1200" loading="lazy"></div><div data-ys-picture="canvas"><img src="${new URL('./assets/framed-20261111/canvas-front.webp',import.meta.url).href}" alt="Illustrated canvas front" width="1200" height="1200" loading="lazy"><img src="${new URL('./assets/framed-20261111/canvas-angle.webp',import.meta.url).href}" alt="Illustrated canvas with a 2 cm edge" width="1200" height="1200" loading="lazy"></div></div>
      <p class="ys-caption" data-ys="caption">${captionFor(state, !!state.lat)}</p>
      <div class="ys-quick" data-ys="quick" ${state.lat ? '' : 'hidden'}>
        <button type="button" class="primary" data-ys-quickadd>Add to cart</button>
        <p class="ys-quick-spec"><span data-ys="quickspec">Personalised print</span><span class="ys-quick-sep"> · </span><button type="button" class="ys-link" data-ys-jump>Change size, paper or text</button></p>
        ${confirmHtml('quick')}
        ${trustHtml(true, 'ys-trust-compact')}
      </div>
      <form class="ys-mail" data-ys="mail" novalidate ${state.lat ? '' : 'hidden'}>
        <p class="ys-mail-t"><strong>Not ready yet?</strong> Send this preview to your inbox and come back to it later.</p>
        <div class="ys-mail-row">
          <label class="ys-mail-l" for="ys-mail-email">Your email</label>
          <input id="ys-mail-email" data-ys="mailemail" type="email" inputmode="email" autocomplete="email" autocapitalize="none" maxlength="120" placeholder="you@example.com" required>
          <button type="submit" class="outline" data-ys="mailgo">Send it to me</button>
        </div>
        <input class="ys-hp" data-ys="mailhp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
        <label class="ys-mail-check"><input type="checkbox" data-ys="mailconsent"><span>${esc(MAIL_CONSENT)} <a href="https://walkofberlin.com/privacy-policy" target="_blank" rel="noopener">Privacy Policy</a>.</span></label>
        <p class="ys-mail-fine">Leave the box unticked and I send this one email and nothing else.</p>
        <p class="ys-mail-status" data-ys="mailstatus" role="status" aria-live="polite"></p>
      </form>
    </div>`;
  // Address search first (own slot, top of the page on a phone and top of the right column on desktop). The suggestions list floats over the
  // content below the box, so it never pushes the poster down while it fills in.
  const searchHtml = `<div class="ys-form ys-searchform">
      <label class="ys-label ys-find" for="ys-q">Find your home in 1928</label>
      <div class="ys-search"><input id="ys-q" data-ys="q" type="search" autocomplete="off" enterkeyhint="search" maxlength="${L.address}" placeholder="e.g. Chamissoplatz" value="${esc(state.query || '')}"><button type="button" class="outline" data-ys="go">Search</button></div>
      <p class="ys-note ys-note-hint" data-ys="searchnote" role="status">${SEARCH_HINT}</p>
      <div class="ys-resultswrap"><ul class="ys-results" data-ys="results" role="listbox" aria-label="Matching places" hidden></ul></div>
    </div>`;
  const optionsHtml = `<div class="ys-form ys-optform">
      <div class="ys-fields" data-ys="fields" ${state.lat ? '' : 'hidden'}>
        <div class="ys-row"><label>Title on the print<input data-ys="title" maxlength="${L.title}" autocapitalize="characters" value="${esc(state.title || '')}"></label><label>Area line<input data-ys="area" maxlength="${L.area}" value="${esc(state.area || '')}"></label></div>
        <label>Your words on the print (optional)<input data-ys="line" maxlength="${L.line}" placeholder="Home since 2014" value="${esc(state.line || '')}"></label>
        <p class="ys-hint">The house number is never printed.</p>
      </div>
      <div class="ys-format ys-format-top" data-ys="format" ${api.digital||api.framed||api.canvas ? '' : 'hidden'}>
        <span class="ys-label" id="ys-format-l">What you get</span>
        <div class="ys-sizes ys-formats" role="radiogroup" aria-labelledby="ys-format-l">${[['poster','Poster',true],['framed','Framed',api.framed],['canvas','Canvas',api.canvas],['digital','Digital file',api.digital]].filter(([, ,available])=>available).map(([key,label])=>`<button type="button" role="radio" class="ys-size" data-ys-format="${key}" aria-checked="${(state.format||'poster')===key}"><span>${label}</span></button>`).join('')}</div>
      </div>
      <div class="ys-choice-row" role="group" aria-label="Layout"><span class="ys-label">Layout</span><div class="ys-layouts" role="radiogroup" aria-label="Layout">${Object.entries(PRINT_OPTIONS.layouts).map(([key,name])=>`<button type="button" role="radio" data-ys-layout="${key}" aria-checked="${key===ysLayout(state)}"><img class="ys-layout-thumb" src="${new URL(`./assets/options/sepia-${key}${new URLSearchParams(location.search).get('lang')==='de'?'-de':''}.jpg`,import.meta.url).href}" alt="">${name}</button>`).join('')}</div></div>
      <div class="ys-choice-row" role="group" aria-label="Colour"><span class="ys-label">Colour <small data-ys="colourname">${optionNames(state).colour}</small></span><div class="ys-swatches" role="radiogroup" aria-label="Colour">${Object.entries(PRINT_OPTIONS.themes).map(([key,t])=>`<button type="button" role="radio" data-ys-colour="${key}" title="${esc(t.name)}" aria-label="${esc(t.name)}" aria-checked="${key===ysColour(state)}" style="--swatch:rgb(${t.mid.join(',')});--paper:rgb(${t.bg.join(',')})"><span aria-hidden="true"></span></button>`).join('')}</div></div>
      <details class="ys-options" data-ys="options" ${state.optionsOpen ? 'open' : ''} ${api.variants && !ysDigital(state) ? '' : 'hidden'}>
        <summary><span class="ys-options-t">Size and paper</span><span class="ys-options-v" data-ys="optsummary"></span></summary>
        <div class="ys-options-body">
          <div class="ys-variant" data-ys="variant" ${api.variants && !ysDigital(state) ? '' : 'hidden'}>
            <span class="ys-label" id="ys-size-l">Size</span>
            <div class="ys-sizes" role="radiogroup" aria-labelledby="ys-size-l">${YS_SIZES.map(z => `<button type="button" role="radio" class="ys-size" data-ys-size="${esc(z)}" aria-checked="${z === ysSize(state)}">${esc(z)}<small data-ys-sizeprice="${esc(z)}"></small></button>`).join('')}</div>
            <div data-ys="framechoices" hidden><span class="ys-label" id="ys-frame-l">Frame</span><div class="ys-frames" role="radiogroup" aria-labelledby="ys-frame-l">${YS_FRAMES.map((name,i)=>`<button type="button" role="radio" class="ys-frame" data-ys-frame="${name}" aria-checked="${ysFrame(state)===name}"><span class="ys-frame-dot" style="--frame-colour:${['#242522','#efeee9','#be9869'][i]}" aria-hidden="true"></span><span>${name}</span></button>`).join('')}</div></div>
            <label class="ys-label" for="ys-paper" data-ys="paperlabel">Paper</label>
            <select id="ys-paper" data-ys="paper">${YS_PAPERS.map(p => `<option value="${esc(p.name)}" ${p.name === ysPaper(state).name ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}</select>
            <p class="ys-hint" data-ys="papernote"></p>
          </div>
        </div>
      </details>
      ${confirmHtml('form')}
    </div>`;
  const searchSlot = host.querySelector('[data-ys-slot="search"]');
  if (searchSlot) { searchSlot.innerHTML = searchHtml; formSlot.innerHTML = optionsHtml; } else formSlot.innerHTML = searchHtml + optionsHtml;
  const $ = name => host.querySelector(`[data-ys="${name}"]`);
  // Size and paper: the price, caption and button follow the choice; Wix still charges its own variant price.
  const optSummary = text => { $('optsummary').textContent = text; };
  $('options').addEventListener('toggle', () => { state.optionsOpen = $('options').open; });
  function paintVariant() {
    if ((!api.digital && ysDigital(state)) || (ysMounted(state) && !api[state.format])) state.format = 'poster';
    const mounted=ysMounted(state),canvas=mounted&&state.format==='canvas',framed=mounted&&!canvas;
    const kind=mounted?'poster':ysDigital(state)?'digital':'poster';
    const stage=host.querySelector('.ys-stage');stage.dataset.format=mounted?state.format:'poster';stage.dataset.frame=ysFrame(state);
    stage.style.setProperty('--frame-ratio',String(12/(ysSize(state)===YS_SIZES[1]?450:300)));
    const papers=framed?YS_FRAMED_PAPERS:YS_PAPERS;
    if($('paper').dataset.kind!==(framed?'framed':'poster')){$('paper').innerHTML=papers.map(p=>`<option value="${esc(p.name)}">${esc(p.name)}</option>`).join('');$('paper').dataset.kind=framed?'framed':'poster';}
    $('paper').value=ysPaper(state).name;$('paper').hidden=canvas;$('paperlabel').hidden=canvas;$('papernote').hidden=canvas;$('framechoices').hidden=!framed;
    host.querySelector('.ys-options-t').textContent=canvas?'Size':framed?'Size, frame and paper':'Size and paper';
    if(mounted){$('options').open=true;state.optionsOpen=true;}
    host.querySelectorAll('[data-ys-frame]').forEach(b=>b.setAttribute('aria-checked',String(b.dataset.ysFrame===ysFrame(state))));
    host.querySelectorAll('[data-ys-poster-only]').forEach(el=>el.hidden=mounted||ysDigital(state));
    const multi=host.querySelector('[data-ys-multi]');if(multi)multi.hidden=mounted;
    $('mail').hidden=mounted||!state.lat;
    const gift=host.querySelector('[data-ys-gift]');if(gift)gift.hidden=mounted;
    const root=host.getRootNode();
    root.querySelectorAll('[data-ys-mounted-spec]').forEach(el=>{el.hidden=!mounted;el.textContent=framed?FRAMED_SPEC:CANVAS_SPEC;});
    root.querySelectorAll('[data-ys-mounted-christmas]').forEach(el=>{el.hidden=!mounted||!mountedChristmasOpen();});
    root.querySelectorAll('[data-ys-mounted-delivery]').forEach(el=>el.hidden=!mounted);
    root.querySelectorAll('[data-ys-mounted-saving]').forEach(el=>el.hidden=!mounted||api.multiPaused===true);
    root.querySelectorAll('[data-ys-shipping]').forEach(el=>{el.hidden=mounted||ysDigital(state);});
    const shots=host.querySelector('[data-ys-mockups]');if(shots){shots.hidden=!mounted;shots.querySelectorAll('[data-ys-picture]').forEach(el=>el.hidden=el.dataset.ysPicture!==(framed?'framed':'canvas'));}
    const frameImage=host.querySelector('[data-ys-frame-image]');if(frameImage){const room={'Black':'room-study-black','White':'room-living-white','Natural wood':'room-two-sizes'}[ysFrame(state)]||'room-study-black';frameImage.src=new URL('./assets/framed-20261111/'+room+'.webp',import.meta.url).href;const sizes=host.querySelector('[data-ys-frame-sizes]');if(sizes)sizes.hidden=room==='room-two-sizes';}
       // the digital product is not in the catalogue: poster only
    $('options').hidden = (!api.variants&&!mounted) || ysDigital(state);   // only the poster has sizes and papers; the format choice sits above the box
    host.querySelectorAll('[data-ys-format]').forEach(b => b.setAttribute('aria-checked', String(b.dataset.ysFormat === (state.format||'poster'))));
    $('variant').hidden = (!api.variants&&!mounted) || ysDigital(state);
    const delivery = host.querySelector('.ys-buy .delivery'); if (delivery) delivery.textContent = mounted ? MOUNTED_DELIVERY : ysDigital(state) ? DIGITAL_DELIVERY : POSTER_DELIVERY;
    (host.getRootNode().querySelectorAll ? host.getRootNode() : host).querySelectorAll('[data-ys-legal]').forEach(el => { el.hidden = el.dataset.ysLegal !== kind || (mounted&&el.hasAttribute('data-ys-poster-only'));  });
    host.querySelector('[data-ys-jump]').textContent = ysDigital(state) ? 'Change format or text' : mounted ? 'Change options or text' : 'Change size, paper or text';
    if (ysDigital(state)) {
      if(!Number.isFinite(api.digitalPrice))return;
      const label = euro(api.digitalPrice);
      optSummary(`Digital file · ${label}`);
      const price = host.querySelector('.product-title .price'); showPrice(price,api.digitalPrice);
      const spec = host.querySelector('.ys-buy .spec'); if (spec) spec.textContent = DIGITAL_SPEC;
      const add = host.querySelector('[data-ys-add]'); if (add) add.textContent = `Add to cart · ${label}`;
      host.querySelector('[data-ys-quickadd]').textContent = `Add to cart · ${label}`;
      $('quickspec').textContent = 'Digital file · JPG + PDF';
      host.querySelectorAll('[data-ys-yes]').forEach(b => { b.textContent = `Yes, add to cart · ${label}`; });
      $('caption').textContent = captionFor(state, !!state.lat);
      return;
    }
    if(mounted){
      const amount=currentPrice(state),label=Number.isFinite(amount)?euro(amount):'Currently unavailable';
      const parts=[state.format==='framed'?'Framed print':'Canvas print',ysSize(state),...(framed?[ysFrame(state)+' frame',ysPaper(state).name+' paper']:[])];
      host.querySelectorAll('[data-ys-size]').forEach(b=>b.setAttribute('aria-checked',String(b.dataset.ysSize===ysSize(state))));
      host.querySelectorAll('[data-ys-sizeprice]').forEach(el=>{const price=currentPrice({...state,[sizeKey(state)]:el.dataset.ysSizeprice});el.textContent=Number.isFinite(price)?euro(price):'Currently unavailable';});
      $('papernote').textContent=ysPaper(state).note;
      optSummary(parts.slice(1).join(' · ')+' · '+label);
      const price=host.querySelector('.product-title .price');if(Number.isFinite(amount))showPrice(price,amount);else if(price)price.textContent=label;
      host.querySelector('.ys-buy .spec').textContent=parts.join(' · ');
      host.querySelectorAll('[data-ys-add],[data-ys-quickadd]').forEach(b=>b.textContent='Add to cart · '+label);
      host.querySelectorAll('[data-ys-yes]').forEach(b=>b.textContent='Yes, add to cart · '+label);
      $('quickspec').textContent=parts.join(' · ');$('caption').textContent=captionFor(state,!!state.lat);refreshButton();
      return;
    }
    if (!api.variants) { optSummary('Printed poster'); $('caption').textContent = captionFor(state, !!state.lat); return; }   // the picker shows only once the Wix product has its size x paper variants
    const i = YS_SIZES.indexOf(ysSize(state)), paper = ysPaper(state);
    host.querySelectorAll('[data-ys-size]').forEach(b => b.setAttribute('aria-checked', String(b.dataset.ysSize === ysSize(state))));
    host.querySelectorAll('[data-ys-sizeprice]').forEach(el => { el.textContent = euro(currentPrice({...state,size:el.dataset.ysSizeprice})); });
    $('papernote').textContent = paper.note;
    optSummary(`${ysSize(state)} · ${paper.name} · ${euro(currentPrice(state))}`);
    const price = host.querySelector('.product-title .price'); showPrice(price,currentPrice(state));
    const spec = host.querySelector('.ys-buy .spec'); if (spec) spec.textContent = `Personalised print · ${ysSize(state)} · ${paper.name}`;
    const add = host.querySelector('[data-ys-add]'); if (add) add.textContent = `Add to cart · ${euro(currentPrice(state))}`;
    host.querySelector('[data-ys-quickadd]').textContent = `Add to cart · ${euro(currentPrice(state))}`;
    $('quickspec').textContent = `${ysSize(state)} · ${paper.name}`;
    host.querySelectorAll('[data-ys-yes]').forEach(b => { b.textContent = `Yes, add to cart · ${euro(currentPrice(state))}`; });
    $('caption').textContent = captionFor(state, !!state.lat);
  }
  host.querySelectorAll('[data-ys-size]').forEach(b => b.addEventListener('click', () => { state[sizeKey(state)] = b.dataset.ysSize; paintVariant(); }));
  host.querySelectorAll('[data-ys-format]').forEach(b => b.addEventListener('click', () => { const was=state.format||'poster';state.format=b.dataset.ysFormat;if(state.format!==was&&['digital','framed','canvas'].includes(state.format))api.track?.(state.format); paintVariant(); }));
  $('paper').addEventListener('change', e => { state[ysMounted(state)?'framedPaper':'paper'] = e.target.value; paintVariant(); });
  host.querySelectorAll('[data-ys-frame]').forEach(b=>b.addEventListener('click',()=>{state.frame=b.dataset.ysFrame;paintVariant();}));
  queueMicrotask(paintVariant);
  api.cancelPhotos?.();
  const ptitle = $('ptitle'), parea = $('parea'), pcoords = $('pcoords'), pline = $('pline');
  // Poster words follow the inputs (title, area, coordinates of the current point, personal line or the grey fallback); the title shrinks in 4-unit steps until it fits 1400 units.
  function paintWords() {
    ptitle.textContent = clean(state.title, L.title).toUpperCase().replaceAll("ẞ","SS"); parea.textContent = clean(state.area, L.area);
    pcoords.textContent = coordsText(Number(state.lat), Number(state.lon));
    const line = clean(state.line, L.line);
    pline.textContent = line || 'Same ground, same scale.'; pline.classList.toggle('ys-fallback', !line);
    $('wordstag').hidden = !!line;   // the yellow "Your words" tag points at the empty line until the buyer writes one (5 Nov 2026, Yusuf)
    let size = titleSize(ptitle.textContent);
    ptitle.style.setProperty('--fs', size);
    const width = () => { try { return ptitle.getComputedTextLength(); } catch { return 0; } };   // 0 while the sheet is not rendered
    while (size > 48 && width() > PHOTO.w) { size -= 4; ptitle.style.setProperty('--fs', size); }
  }
  const rawPhotos=new Map();
  function paintPhoto(layer) {
    const data=rawPhotos.get(layer);if(!data)return;
    const slot=$(layer==='archive'?'photo-1928':'photo-today');
    let canvas=slot.querySelector('canvas');if(!canvas){canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');slot.querySelector('img').after(canvas);}
    canvas.width=data.width;canvas.height=data.height;
    canvas.getContext('2d').putImageData(new ImageData(gradePixels(data.data,PRINT_OPTIONS.themes[ysColour(state)],layer==='archive'),data.width,data.height),0,0);
  }
  function capturePhoto(layer) {
    const img=$(layer==='archive'?'photo-1928':'photo-today').querySelector('img'),c=document.createElement('canvas');
    c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);rawPhotos.set(layer,ctx.getImageData(0,0,c.width,c.height));paintPhoto(layer);
  }
  function paintOptions() {
    const only=ysLayout(state)==='1928-only',t=PRINT_OPTIONS.themes[ysColour(state)],sheet=$('sheet');
    sheet.dataset.layout=ysLayout(state);sheet.dataset.colour=ysColour(state);
    for(const key of ['bg','main','ink','grey','key'])sheet.style.setProperty('--print-'+key,`rgb(${t[key].join(',')})`);
    host.querySelectorAll('[data-ys-layout]').forEach(b=>b.setAttribute('aria-checked',String(b.dataset.ysLayout===ysLayout(state))));
    host.querySelectorAll('[data-ys-colour]').forEach(b=>b.setAttribute('aria-checked',String(b.dataset.ysColour===ysColour(state))));
    $('colourname').textContent=optionNames(state).colour;
    const cap=host.querySelector('.ys-cap-1928');cap.setAttribute('y',only?TX.capToday:TX.cap1928);
    $('photo-today').hidden=only;host.querySelector('.ys-cap-today').style.display=only?'none':'';
    const cross=$('photo-1928').querySelector('.ys-ring');cross.setAttribute('viewBox',only?'0 -423 1400 1592':'0 0 1400 746');
    for(const layer of rawPhotos.keys())paintPhoto(layer);
    $('caption').textContent=captionFor(state,!!state.lat);
    if(!state.lat)$('example').querySelector('img').src=ysColour(state)==='sepia'&&ysLayout(state)==='then-now'?api.sample:new URL(`./assets/options/${ysColour(state)}-${ysLayout(state)}${new URLSearchParams(location.search).get('lang')==='de'?'-de':''}.jpg`,import.meta.url).href;
  }
  host.querySelectorAll('[data-ys-layout]').forEach(b=>b.addEventListener('click',()=>{if(state.layout===b.dataset.ysLayout)return;state.layout=b.dataset.ysLayout;state.seen=false;state.confirming=null;api.track?.('layout-'+state.layout);paintOptions();if(state.lat)showPoint(true);}));
  host.querySelectorAll('[data-ys-colour]').forEach(b=>b.addEventListener('click',()=>{if(state.colour===b.dataset.ysColour)return;state.colour=b.dataset.ysColour;api.track?.('colour-'+state.colour);paintOptions();}));
  queueMicrotask(paintOptions);
  // The sheet's fonts (DM Serif Display, Space Grotesk, IBM Plex Mono) are only fetched when first needed; once they are in, the title is fitted again (a fallback font measures differently).
  let fontsReady = null;
  const ensureFonts = () => {
    if (!fontsReady) fontsReady = (document.fonts?.load ? Promise.all([["400 118px 'DM Serif Display'", 'POTSDAMER PLATZ'], ["600 28px 'Space Grotesk'", '1928 TODAY'], ["300 40px 'Space Grotesk'", 'Berlin'], ["500 42px 'Space Grotesk'", 'Berlin'], ["400 30px 'IBM Plex Mono'", '52.5098° N, 13.3756° E']]
      .map(([face, text]) => document.fonts.load(face, text))).catch(() => []) : Promise.resolve([])).then(() => { if (host.isConnected && state.lat) paintWords(); });
    return fontsReady;
  };
  const status = $('status'), statusToday = $('status-today'), results = $('results'), note = $('searchnote'), input = $('q');
  // The note line always holds a line of text (hint, "Searching…", "Tap your place…", an error), so its height never changes.
  const setNote = (text, choose = false) => { note.textContent = text || SEARCH_HINT; note.classList.toggle('ys-choose', !!text && choose); note.classList.toggle('ys-note-hint', !text); };
  const setStatus = text => { status.textContent = text; status.hidden = !text; };
  const setStatusToday = text => { statusToday.textContent = text; statusToday.hidden = !text; };
  // The confirm panel shows under the button that opened it (state.confirming = "quick" | "form"); it survives storefront re-renders.
  const paintConfirm = () => { host.querySelectorAll('[data-ys-confirm]').forEach(p => { p.hidden = !state.lat || state.seen === true || state.confirming !== p.dataset.ysConfirm; if (p.hidden) p.querySelector('[data-ys-noinfo]').hidden = true; }); };
  const refreshButton = () => {
    const ready = readyToCheck(state), off = !ready || api.busy() || (ysMounted(state)&&!Number.isFinite(currentPrice(state)));
    const b = host.getRootNode().querySelector?.('[data-ys-add]'); if (b) b.disabled = off;
    host.querySelector('[data-ys-quickadd]').disabled = off; $('quick').hidden = !state.lat;
    host.querySelectorAll('[data-ys-yes]').forEach(y => { y.disabled = off; });
    const why = host.getRootNode().querySelector?.('[data-ys-why]'); if (why) why.textContent = ready ? '' : (!state.lat ? (results.hidden ? 'Search for your address to continue.' : 'Tap one of the places under the search box.') : 'Fill in the title and area lines to continue.');
    paintConfirm();
  };
  api.refresh = refreshButton;

  function showPoint(fresh) {
    if (!state.lat) return;
    $('sheet').hidden = false; $('example').hidden = true; $('fields').hidden = false;
    $('mail').hidden = ysMounted(state);
    if (!api.mailboxSeen) { api.mailboxSeen = true; api.track?.('mailbox'); }   // funnel: the preview exists and the mail box is on screen
    if (fresh) paintMail('');
    $('caption').textContent = captionFor(state, true);
    paintWords(); ensureFonts();
    api.cancelPhotos?.();
    const mine = state.token = (state.token || 0) + 1;
    const valid = () => state.token === mine && host.isConnected;
    const loaded = new Set();
    const layers=ysLayout(state)==='1928-only'?['archive']:['archive','today'];
    rawPhotos.clear();host.querySelectorAll('.ys-photo canvas').forEach(c=>c.remove());paintOptions();
    const both = layer => { if (valid()) { capturePhoto(layer);loaded.add(layer); if (loaded.size === layers.length) api.track?.('preview'); } };
    const cancel = layers.map(layer => loadAerialPhoto({
      slot: $(layer === 'archive' ? 'photo-1928' : 'photo-today'),
      url: layer === 'archive' ? url1928(state.lat, state.lon, ysLayout(state)==='1928-only') : urlToday(state.lat, state.lon),
      layer, valid, track: step => api.track?.(step), status: layer === 'archive' ? setStatus : setStatusToday,
      loaded: () => both(layer),
    }));
    api.cancelPhotos = () => cancel.forEach(stop => stop());
    if (fresh) state.seen = false, state.confirming = null;   // a new spot may be outside the 1928 survey: ask again
    refreshButton();
  }
  // ---- Search: Photon first (typo-tolerant, Berlin bbox), Nominatim when Photon fails or finds nothing (max one request per second, contact email). ----
  let timer = 0, controller = null;
  const spacing = 1100;
  const PIN = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.6A2.6 2.6 0 1 1 12 6.4a2.6 2.6 0 0 1 0 5.2z"/></svg>';
  async function photon(q, signal) {
    const url = `${PHOTON}?q=${encodeURIComponent(q)}&limit=10&lang=de&bbox=${BERLIN.west},${BERLIN.south},${BERLIN.east},${BERLIN.north}`;
    const response = await fetch(url, {signal, headers: {Accept: 'application/json'}});
    if (!response.ok) throw new Error('HTTP ' + response.status);
    return ((await response.json()).features || []).map(fromPhoton).filter(r => r.city === 'Berlin');
  }
  async function nominatim(q, signal) {
    const wait = Math.max(0, (api.lastSearchAt || 0) + spacing - Date.now());
    if (wait) await new Promise(r => setTimeout(r, wait));
    api.lastSearchAt = Date.now();
    const url = `${NOMINATIM}?format=jsonv2&addressdetails=1&limit=5&countrycodes=de&bounded=1&viewbox=${BERLIN.west},${BERLIN.north},${BERLIN.east},${BERLIN.south}&q=${encodeURIComponent(q + ', Berlin')}&email=info@berlinwalk.com`;
    const response = await fetch(url, {signal, headers: {Accept: 'application/json'}});
    if (!response.ok) throw new Error('HTTP ' + response.status);
    return (await response.json()).map(r => ({...r, lat: Number(r.lat), lon: Number(r.lon)}));
  }
  async function search(q) {
    q = clean(q, 80);
    if (q.length < 3) { results.hidden = true; setNote(q ? 'Keep typing (at least 3 letters).' : ''); refreshButton(); return; }
    api.track?.('search');
    controller?.abort(); controller = new AbortController(); const {signal} = controller;
    setNote('Searching…');
    let rows = [];
    try { rows = await photon(q, signal); } catch (error) { if (error.name === 'AbortError') return; }
    try { if (!rows.length && clean(input.value, 80) === q) rows = await nominatim(q, signal); } catch (error) { if (error.name === 'AbortError') return; if (!rows.length) { setNote('The address search did not answer. Try again in a moment.'); return; } }
    if (clean(input.value, 80) !== q) return;
    const seen = new Set();
    rows = rows.filter(r => inBerlin(r.lat, r.lon)).filter(r => { const key = [placeLines(r)[0], r.address?.suburb || r.address?.city_district || ''].join('|').toLowerCase(); return !seen.has(key) && seen.add(key); }).slice(0, 5);
    state.results = rows;
    results.innerHTML = rows.map((r, i) => { const [main, sub] = placeLines(r); return `<li role="option"><button type="button" class="ys-pick" data-ys-pick="${i}">${PIN}<span class="ys-pick-text"><strong>${esc(main)}</strong><small>${esc(sub)}</small></span><span class="ys-pick-go" aria-hidden="true">›</span></button></li>`; }).join('');
    results.hidden = rows.length === 0;
    setNote(rows.length ? 'Tap your place to put it on the poster:' : 'Nothing found in Berlin. Check the spelling, or try the street name with a house number.', rows.length > 0);
    if (!rows.length) api.track?.('noresult');
    refreshButton();
  }
  const schedule = () => { clearTimeout(timer); timer = setTimeout(() => search(input.value), 450); };
  input.addEventListener('input', () => { state.query = input.value; schedule(); });
  input.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); clearTimeout(timer); search(input.value); } });
  $('go').addEventListener('click', () => { clearTimeout(timer); search(input.value); });
  results.addEventListener('click', event => {
    const pick = event.target.closest('[data-ys-pick]'); if (!pick) return;
    const r = state.results?.[Number(pick.dataset.ysPick)]; if (!r) return;
    Object.assign(state, {lat: Math.round(Number(r.lat) * 1e5) / 1e5, lon: Math.round(Number(r.lon) * 1e5) / 1e5, address: addressLabel(r), title: titleFrom(r), area: areaFrom(r), query: input.value});
    host.querySelector('[data-ys="title"]').value = state.title; host.querySelector('[data-ys="area"]').value = state.area;
    results.hidden = true; setNote(''); showPoint(true); api.track?.('pick');
    const box = $('sheet').getBoundingClientRect();
    if (box.bottom < 90 || box.top > innerHeight - 90) $('sheet').scrollIntoView({behavior: 'smooth', block: 'start'});
  });
  // ---- Tap either photo: pixel offset -> metres -> new point (both show the same ground box, so the maths is the same) ----
  for (const name of ['photo-1928', 'photo-today']) {
    $(name).addEventListener('click', event => {
      if (!state.lat) return;
      const box = $(name).querySelector('img').getBoundingClientRect(); if (!box.width || !box.height) return;
      const [lat, lon] = movePoint(state.lat, state.lon, (event.clientX - box.left) / box.width, (event.clientY - box.top) / box.height, name==='photo-1928' && ysLayout(state)==='1928-only');
      if (!inBerlin(lat, lon)) return;
      state.lat = lat; state.lon = lon; showPoint(false);
    });
  }
  $('wordstag').addEventListener('click', () => { const input = $('line'); input.scrollIntoView({behavior: 'smooth', block: 'center'}); input.focus({preventScroll: true}); });
  for (const name of ['title', 'area', 'line']) {
    host.querySelector(`[data-ys="${name}"]`).addEventListener('input', event => { state[name] = event.target.value; paintWords(); refreshButton(); });
  }
  // Add buttons: before the 1928 yes they open the confirm panel instead of the cart (the click stops here, so the storefront's handler on the
  // shadow root never sees it); after it the buy-box button adds as before and the button under the poster presses it.
  // Funnel: addtap = an add button tapped with a printable spot, seen = "Yes" in the panel, blank = "It is blank", add = the cart took it (storefront).
  const realAdd = () => host.getRootNode().querySelector?.('[data-ys-add]');
  host.addEventListener('click', event => {
    const t = event.target.closest?.('[data-ys-quickadd], [data-ys-add], [data-ys-yes], [data-ys-no], [data-ys-jump]'); if (!t) return;
    if (t.matches('[data-ys-jump]')) { if (!$('options').hidden) { $('options').open = true; state.optionsOpen = true; } $('fields').scrollIntoView({behavior: 'smooth', block: 'start'}); return; }
    if (t.matches('[data-ys-no]')) { t.closest('[data-ys-confirm]').querySelector('[data-ys-noinfo]').hidden = false; api.track?.('blank'); return; }
    if (t.matches('[data-ys-yes]')) { if (!readyToCheck(state) || api.busy()) return; state.seen = true; state.confirming = null; api.track?.('seen'); refreshButton(); realAdd()?.click(); return; }
    if (!readyToCheck(state)) return;
    api.track?.('addtap');
    if (state.seen === true) { if (t.matches('[data-ys-quickadd]')) realAdd()?.click(); return; }
    event.stopPropagation();
    state.confirming = t.matches('[data-ys-quickadd]') ? 'quick' : 'form'; paintConfirm();
    const panel = host.querySelector(`[data-ys-confirm="${state.confirming}"]`);
    if (panel.getBoundingClientRect().bottom > innerHeight - 16) panel.scrollIntoView({behavior: 'smooth', block: 'nearest'});
    panel.querySelector('[data-ys-yes]').focus({preventScroll: true});
  });
  // ---- Send this preview to my inbox: success and error states under the poster ----
  function paintMail(kind, text = '') {
    const status = $('mailstatus'); status.textContent = text; status.dataset.kind = kind || '';
    $('mailgo').disabled = kind === 'busy'; $('mailgo').textContent = kind === 'busy' ? 'Sending…' : (kind === 'ok' ? 'Send again' : 'Send it to me');
  }
  const mailForm = $('mail');
  mailForm.addEventListener('focusin', () => { if (!state.mailStartedAt || Date.now() - Date.parse(state.mailStartedAt) > 12 * 3600e3) state.mailStartedAt = new Date().toISOString(); });
  mailForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (!readyToCheck(state) || $('mailgo').disabled) return;
    const email = $('mailemail').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { paintMail('error', 'Please enter a valid email address.'); $('mailemail').focus(); return; }
    paintMail('busy', 'Sending…');
    const consent = $('mailconsent').checked, q = new URLSearchParams(location.search), preview = mailPreview(state);
    const startedAt = state.mailStartedAt || new Date(Date.now() - 5000).toISOString();
    try {
      const response = await fetch(MAIL_ENDPOINT, {method: 'POST', mode: 'cors', credentials: 'omit', headers: {'content-type': 'application/json'}, body: JSON.stringify({
        ...(consent ? MAIL_ASSET : {assetId: MAIL_ASSET.assetId}), email, consent, preview,
        pagePath: location.pathname, utm: {source: q.get('utm_source') || '', medium: q.get('utm_medium') || '', campaign: q.get('utm_campaign') || '', content: q.get('utm_content') || '', term: q.get('utm_term') || ''},
        website: host.querySelector('[data-ys="mailhp"]').value, startedAt, submittedAt: new Date().toISOString(),
        idempotencyKey: `ys-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`})});
      const body = await response.json().catch(() => ({}));
      if (response.ok) { paintMail('ok', mailMessage(200, body.marketing)); api.track?.('mailsend'); if (consent && body.marketing === 'pending') api.track?.('mailconsent'); }
      else paintMail('error', mailMessage(response.status));
    } catch (e) { paintMail('error', mailMessage(0)); }
  });
  // ---- Spot from the emailed link: ?p=<token> -> saved context -> the usual preview ----
  // Once per page load. A banner hand-over must not replace the spot the visitor came back for, so it is switched off while a token is present.
  async function restoreFromToken(token) {
    const quiet = () => { api.track?.('restorefail'); if (host.isConnected && !state.lat) setNote('I could not reopen your saved preview. The link may be older than 30 days, so search your address to start again.'); };
    try {
      const response = await fetch(CONTEXT_ENDPOINT + token, {method: 'GET', mode: 'cors', credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer'});
      if (!response.ok) return quiet();
      const spot = spotFromPreview((await response.json()).preview);
      if (!spot) return quiet();
      if (state.lat) return;                                   // the visitor already picked a spot while this was loading
      Object.assign(state, {lat: spot.lat, lon: spot.lon, title: spot.title, area: spot.area, address: spot.address, query: spot.title, format: spot.format, layout:spot.layout,colour:spot.colour,size: spot.size || state.size, paper: spot.paper || state.paper});
      api.track?.('restored');
      if (!host.isConnected) return;                           // the storefront re-rendered meanwhile: the new mount builds from state
      $('title').value = state.title; $('area').value = state.area; input.value = state.query; $('paper').value = ysPaper(state).name;
      paintVariant(); showPoint(true); refreshButton();
    } catch (e) { quiet(); }
  }
  const emailedToken = !state.lat && !api.restoreDone ? takePreviewToken() : '';
  if (emailedToken) { api.restoreDone = true; api.handoffDone = true; restoreFromToken(emailedToken); }
  if (state.lat) showPoint(false);
  refreshButton();
  // After a handed-over address the poster scrolls into view once; the storefront may re-render (and remount) meanwhile, so retry on the live node.
  function scrollSheetSoon() {
    [500, 1500, 3000].forEach(t => setTimeout(() => {
      if (!api.scrollSheet || Date.now() - api.scrollSheet > 8000) return;
      const sheet = host.isConnected ? $('sheet') : null;
      if (!sheet || sheet.hidden) return;
      const top = sheet.getBoundingClientRect().top;
      // The search box now sits right above the poster, so a poster that is already in the upper part of the screen stays where it is (no jump).
      if (top >= 0 && top < innerHeight * 0.55) { api.scrollSheet = 0; return; }
      sheet.scrollIntoView({block: 'start'}); if (Math.abs(sheet.getBoundingClientRect().top) < 120) api.scrollSheet = 0;
    }, t));
  }
  if (api.scrollSheet && state.lat) scrollSheetSoon();
  // Address typed into the homepage banner (Yusuf, 25 Oct 2026): it arrives in sessionStorage (never in the URL, so it does not
  // reach analytics or the pixel), is used once, and runs the normal search; the first Berlin result goes straight onto the poster.
  if (!state.lat && !api.handoffDone) {
    api.handoffDone = true;
    let handed = '';
    try { const raw = JSON.parse(sessionStorage.getItem('bwYsStreet') || 'null'); sessionStorage.removeItem('bwYsStreet'); if (raw && Date.now() - raw.at < 10 * 60 * 1000) handed = clean(raw.q, 80); } catch (e) {}
    if (handed.length >= 3) {
      input.value = handed; state.query = handed;
      search(handed).then(() => { if (state.results?.length && !state.lat) { results.querySelector('[data-ys-pick="0"]')?.click(); api.scrollSheet = Date.now(); scrollSheetSoon(); } });
    }
  }
  countChoice(host,state,api,()=>mountConfigurator(host,state,api));

}
