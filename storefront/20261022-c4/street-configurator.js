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
export const url1928 = (lat, lon) => { const [x, y] = utm33(lat, lon); return wmsUrl(WMS_1928, LAYER_1928, x, y, GROUND_W, GROUND_H, SCREEN_PX[0], SCREEN_PX[1]); };
export const urlToday = (lat, lon) => { const [x, y] = utm33(lat, lon); return wmsUrl(WMS_TODAY, LAYER_TODAY, x, y, GROUND_W, GROUND_H, SCREEN_PX[0], SCREEN_PX[1]); };
// Pixel offset inside either displayed photo (fractions 0..1, origin top-left) to a new lat/lon. Both photos show the same ground box, so the maths is the same.
export function movePoint(lat, lon, fx, fy) {
  const [cx, cy] = utm33(lat, lon);
  return fromUtm33(cx + (fx - 0.5) * GROUND_W, cy + (0.5 - fy) * GROUND_H, [lat, lon]).map(v => Math.round(v * 1e5) / 1e5);
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
export function buildCustomText(state, search) {
  const title = clean(state.title, YS_LIMITS.title).toUpperCase(), area = clean(state.area, YS_LIMITS.area), line = clean(state.line, YS_LIMITS.line);
  const [lat, lon] = [Number(state.lat), Number(state.lon)];
  const parts = [`Map point ${lat.toFixed(5)}, ${lon.toFixed(5)}`, `Title: ${title} | Area: ${area}`];
  const ref = adRef(search), room = YS_LIMITS.details - [...parts, ...(line ? [`Line: ${line}`] : [])].join(' // ').length - ' // Ref: '.length;
  if (ref && room >= 6) parts.push(`Ref: ${ref.slice(0, room)}`);
  if (line) parts.push(`Line: ${line}`);
  return {
    [YS_FIELDS.address]: clean(state.address, YS_LIMITS.address),
    [YS_FIELDS.details]: parts.join(' // ').slice(0, YS_LIMITS.details),
  };
}
export function readyToAdd(state) {
  return Number.isFinite(state.lat) && Number.isFinite(state.lon) && inBerlin(state.lat, state.lon) && clean(state.address, 80).length > 0 &&
    clean(state.title, 24).length > 0 && clean(state.area, 30).length > 0 && state.seen === true;
}

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
// One ring per photo, centred, in the photo's own 1400 x 746 units: 26 m outer radius = 98.91 units, the 8-unit stroke inside it (circle r = 94.91).
const RING_SVG = `<svg class="ys-ring" viewBox="0 0 ${PHOTO.w} ${PHOTO.h}" aria-hidden="true"><circle cx="${PHOTO.w / 2}" cy="${PHOTO.h / 2}" r="${(RING * PHOTO.w / GROUND_W - RING_STROKE / 2).toFixed(2)}" fill="none" stroke="#FFE600" stroke-width="${RING_STROKE}"/></svg>`;
// The preview is the print itself: a 30 x 40 cm sheet laid out on make_print.py's 1800 x 2400 design grid (CSS unit --u = 1/1800 of the sheet width; the words are SVG text on the same grid).
// Title size follows the generator: 118 (96 above 16 letters), shrunk by 4 until it fits the 1400-unit width of the photos (never below 48).
export const titleSize = title => (String(title || '').length <= 16 ? 118 : 96);
const CAPTION_LIVE = 'Your poster, 30 x 40 cm: 1928 above, today below, same ground and scale. Tap either photo to move the ring onto your building.';
const CAPTION_EXAMPLE = 'Example poster, 30 x 40 cm. Search for your own address to see your street.';

// `host` holds two slots ([data-ys-slot="visual"], [data-ys-slot="form"]) and the add button ([data-ys-add]). Rebuilt from `state` whenever the storefront re-renders. `api.add(customText)` returns a promise; `api.busy()` says whether the cart is locked.
export function mountConfigurator(host, state, api) {
  const L = YS_LIMITS;
  const visual = host.querySelector('[data-ys-slot="visual"]'), formSlot = host.querySelector('[data-ys-slot="form"]');
  visual.innerHTML = `<div class="ys-visual">
      <div class="ys-stage">
        <div class="ys-sheet" data-ys="sheet" ${state.lat ? '' : 'hidden'}>
          <div class="ys-photo ys-photo-1928" data-ys="photo-1928">
            <img class="ys-1928" alt="Aerial photograph of your spot in 1928, with a yellow ring on your building" decoding="async">
            ${RING_SVG}
            <span class="ys-wm" aria-hidden="true"></span>
            <span class="ys-status" data-ys="status" role="status"></span>
          </div>
          <div class="ys-photo ys-photo-today" data-ys="photo-today">
            <img class="ys-todayimg" alt="Aerial photograph of the same spot today, same ground and scale, with a yellow ring" decoding="async">
            ${RING_SVG}
            <span class="ys-wm" aria-hidden="true"></span>
            <span class="ys-status" data-ys="status-today" role="status" hidden></span>
          </div>
          <svg class="ys-type" viewBox="0 0 ${GRID.w} ${GRID.h}" role="group" aria-label="Text on the print">
            <text class="ys-cap ys-cap-1928" x="${TX.cx + TX.track1928 / 2}" y="${TX.cap1928}">1928</text>
            <text class="ys-cap ys-cap-today" x="${TX.cx + TX.trackToday / 2}" y="${TX.capToday}">TODAY</text>
            <text class="ys-ptitle" data-ys="ptitle" x="${TX.cx}" y="${TX.title}"></text>
            <text class="ys-parea" data-ys="parea" x="${TX.cx}" y="${TX.area}"></text>
            <text class="ys-pcoords" data-ys="pcoords" x="${TX.cx}" y="${TX.coords}"></text>
            <text class="ys-pline" data-ys="pline" x="${TX.cx}" y="${TX.line}"></text>
          </svg>
        </div>
        <div class="ys-sheet ys-sample" data-ys="example" ${state.lat ? 'hidden' : ''}><img src="${esc(api.sample)}" alt="Example print: Potsdamer Platz in 1928 and today"></div>
      </div>
      <p class="ys-caption" data-ys="caption">${state.lat ? CAPTION_LIVE : CAPTION_EXAMPLE}</p>
    </div>`;
  formSlot.innerHTML = `<div class="ys-form">
      <label class="ys-label" for="ys-q">Your address or a place in Berlin</label>
      <div class="ys-search"><input id="ys-q" data-ys="q" type="search" autocomplete="off" enterkeyhint="search" maxlength="${L.address}" placeholder="e.g. Potsdamer Platz" value="${esc(state.query || '')}"><button type="button" class="outline" data-ys="go">Search</button></div>
      <p class="ys-note" data-ys="searchnote" role="status"></p>
      <ul class="ys-results" data-ys="results" role="listbox" aria-label="Matching places" hidden></ul>
      <p class="ys-attr">Search by <a href="https://photon.komoot.io" target="_blank" rel="noopener noreferrer">Photon</a> and <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap contributors</a>. Berlin only. Aerial photographs: Geoportal Berlin, dl-de/zero-2.0.</p>
      <div class="ys-fields" data-ys="fields" ${state.lat ? '' : 'hidden'}>
        <div class="ys-row"><label>Title on the print<input data-ys="title" maxlength="${L.title}" autocapitalize="characters" value="${esc(state.title || '')}"></label><label>Area line<input data-ys="area" maxlength="${L.area}" value="${esc(state.area || '')}"></label></div>
        <label>Your line on the print (optional)<input data-ys="line" maxlength="${L.line}" placeholder="e.g. Lena &amp; Jonas · here since 2021" value="${esc(state.line || '')}"></label>
        <p class="ys-hint">The house number is never printed. Tap either photo to move the ring onto your building.</p>
        <label class="ys-check"><input type="checkbox" data-ys="seen" ${state.seen ? 'checked' : ''}><span>I can see the 1928 aerial photo at my spot. A blank white picture means there is no 1928 photo there (far eastern edge of Berlin).</span></label>
      </div>
    </div>`;
  const $ = name => host.querySelector(`[data-ys="${name}"]`);
  const img1928 = $('photo-1928').querySelector('img'), imgToday = $('photo-today').querySelector('img');
  const ptitle = $('ptitle'), parea = $('parea'), pcoords = $('pcoords'), pline = $('pline');
  // Poster words follow the inputs (title, area, coordinates of the current point, personal line or the grey fallback); the title shrinks in 4-unit steps until it fits 1400 units.
  function paintWords() {
    ptitle.textContent = clean(state.title, L.title).toUpperCase(); parea.textContent = clean(state.area, L.area);
    pcoords.textContent = coordsText(Number(state.lat), Number(state.lon));
    const line = clean(state.line, L.line);
    pline.textContent = line || 'Same ground, same scale.'; pline.classList.toggle('ys-fallback', !line);
    let size = titleSize(ptitle.textContent);
    ptitle.style.setProperty('--fs', size);
    const width = () => { try { return ptitle.getComputedTextLength(); } catch { return 0; } };   // 0 while the sheet is not rendered
    while (size > 48 && width() > PHOTO.w) { size -= 4; ptitle.style.setProperty('--fs', size); }
  }
  // The sheet's fonts (DM Serif Display, Space Grotesk, IBM Plex Mono) are only fetched when first needed; once they are in, the title is fitted again (a fallback font measures differently).
  let fontsReady = null;
  const ensureFonts = () => {
    if (!fontsReady) fontsReady = (document.fonts?.load ? Promise.all([["400 118px 'DM Serif Display'", 'POTSDAMER PLATZ'], ["600 28px 'Space Grotesk'", '1928 TODAY'], ["300 40px 'Space Grotesk'", 'Berlin'], ["500 42px 'Space Grotesk'", 'Berlin'], ["400 30px 'IBM Plex Mono'", '52.5098° N, 13.3756° E']]
      .map(([face, text]) => document.fonts.load(face, text))).catch(() => []) : Promise.resolve([])).then(() => { if (host.isConnected && state.lat) paintWords(); });
    return fontsReady;
  };
  const status = $('status'), statusToday = $('status-today'), results = $('results'), note = $('searchnote'), input = $('q');
  const setStatus = text => { status.textContent = text; status.hidden = !text; };
  const setStatusToday = text => { statusToday.textContent = text; statusToday.hidden = !text; };
  const refreshButton = () => { const b = host.getRootNode().querySelector?.('[data-ys-add]'); if (b) b.disabled = !readyToAdd(state) || api.busy(); const why = host.getRootNode().querySelector?.('[data-ys-why]'); if (why) why.textContent = readyToAdd(state) ? '' : (!state.lat ? (results.hidden ? 'Search for your address to continue.' : 'Tap one of the places under the search box.') : (!state.seen ? 'Confirm that you can see the 1928 photo to continue.' : 'Fill in the title and area lines to continue.')); };
  api.refresh = refreshButton;

  function showPoint(fresh) {
    if (!state.lat) return;
    $('sheet').hidden = false; $('example').hidden = true; $('fields').hidden = false;
    $('caption').textContent = CAPTION_LIVE;
    paintWords(); ensureFonts();
    setStatus('Loading the 1928 photo…'); setStatusToday('');
    const mine = state.token = (state.token || 0) + 1;
    let loaded = 0; const both = () => { if (state.token === mine && ++loaded === 2) api.track?.('preview'); };   // funnel: both photos on screen
    img1928.onload = () => { if (state.token === mine) setStatus(''); both(); };
    imgToday.onload = both;
    img1928.onerror = () => { if (state.token === mine) { setStatus('The aerial photo service did not answer. Try again in a moment.'); api.track?.('photoerror'); } };
    imgToday.onerror = () => { if (state.token === mine) setStatusToday('Today’s photo did not load. Try again in a moment.'); };
    img1928.src = url1928(state.lat, state.lon);
    imgToday.src = urlToday(state.lat, state.lon);
    if (fresh) state.seen = false, host.querySelector('[data-ys="seen"]').checked = false;
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
    if (q.length < 3) { results.hidden = true; note.textContent = q ? 'Keep typing (at least 3 letters).' : ''; note.classList.remove('ys-choose'); refreshButton(); return; }
    api.track?.('search');
    controller?.abort(); controller = new AbortController(); const {signal} = controller;
    note.textContent = 'Searching…'; note.classList.remove('ys-choose');
    let rows = [];
    try { rows = await photon(q, signal); } catch (error) { if (error.name === 'AbortError') return; }
    try { if (!rows.length && clean(input.value, 80) === q) rows = await nominatim(q, signal); } catch (error) { if (error.name === 'AbortError') return; if (!rows.length) { note.textContent = 'The address search did not answer. Try again in a moment.'; return; } }
    if (clean(input.value, 80) !== q) return;
    const seen = new Set();
    rows = rows.filter(r => inBerlin(r.lat, r.lon)).filter(r => { const key = [placeLines(r)[0], r.address?.suburb || r.address?.city_district || ''].join('|').toLowerCase(); return !seen.has(key) && seen.add(key); }).slice(0, 5);
    state.results = rows;
    results.innerHTML = rows.map((r, i) => { const [main, sub] = placeLines(r); return `<li role="option"><button type="button" class="ys-pick" data-ys-pick="${i}">${PIN}<span class="ys-pick-text"><strong>${esc(main)}</strong><small>${esc(sub)}</small></span><span class="ys-pick-go" aria-hidden="true">›</span></button></li>`; }).join('');
    results.hidden = rows.length === 0;
    note.textContent = rows.length ? 'Tap your place to put it on the poster:' : 'Nothing found in Berlin. Check the spelling, or try the street name with a house number.';
    if (!rows.length) api.track?.('noresult');
    note.classList.toggle('ys-choose', rows.length > 0);
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
    results.hidden = true; note.textContent = ''; note.classList.remove('ys-choose'); showPoint(true); api.track?.('pick');
    const box = $('sheet').getBoundingClientRect();
    if (box.bottom < 90 || box.top > innerHeight - 90) $('sheet').scrollIntoView({behavior: 'smooth', block: 'start'});
  });
  // ---- Tap either photo: pixel offset -> metres -> new point (both show the same ground box, so the maths is the same) ----
  for (const [name, img] of [['photo-1928', img1928], ['photo-today', imgToday]]) {
    $(name).addEventListener('click', event => {
      if (!state.lat) return;
      const box = img.getBoundingClientRect(); if (!box.width || !box.height) return;
      const [lat, lon] = movePoint(state.lat, state.lon, (event.clientX - box.left) / box.width, (event.clientY - box.top) / box.height);
      if (!inBerlin(lat, lon)) return;
      state.lat = lat; state.lon = lon; showPoint(false);
    });
  }
  for (const name of ['title', 'area', 'line']) {
    host.querySelector(`[data-ys="${name}"]`).addEventListener('input', event => { state[name] = event.target.value; paintWords(); refreshButton(); });
  }
  host.querySelector('[data-ys="seen"]').addEventListener('change', event => { state.seen = event.target.checked; if (state.seen) api.track?.('seen'); refreshButton(); });
  if (state.lat) showPoint(false);
  refreshButton();
}
