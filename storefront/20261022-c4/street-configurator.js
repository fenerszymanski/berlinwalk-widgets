// "Your Berlin Street in 1928" configurator (store product only). Geometry is identical to
// content/products/your-street-1928/SPEC.md and generator/make_print.py (utm33).
// Pure browser code: Nominatim geocoding (Berlin only), two WMS GetMap <img> previews, tap-to-move ring.
export const YS_PRODUCT_ID = '8aaf5412-7f21-42c7-acfb-85dd8417d68c';
export const YS_FIELDS = Object.freeze({
  address: 'Address or place in Berlin',
  details: 'Print details (set by the map)',
});
// Wix allows two custom text fields per product here, so map point, title, area and the personal line share the second one.
export const YS_LIMITS = Object.freeze({address: 80, details: 200, title: 24, area: 30, line: 40});
const HERO_W = 368, HERO_H = 321.4, INSET = 130, RING = 26;
const HERO_PX = [736, 643], INSET_PX = 400;
const WMS_1928 = 'https://gdi.berlin.de/services/wms/luftbild_1928_04', LAYER_1928 = 'c_luftbilder_1928_04_raster';
const WMS_TODAY = 'https://gdi.berlin.de/services/wms/truedop_2026', LAYER_TODAY = 'truedop_2026';
const BERLIN = {west: 13.0884, east: 13.7612, north: 52.6755, south: 52.3383};
const NOMINATIM = 'https://nominatim.openstreetmap.org/search';

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
export const heroUrl = (lat, lon) => { const [x, y] = utm33(lat, lon); return wmsUrl(WMS_1928, LAYER_1928, x, y, HERO_W, HERO_H, HERO_PX[0], HERO_PX[1]); };
export const insetUrl = (lat, lon) => { const [x, y] = utm33(lat, lon); return wmsUrl(WMS_TODAY, LAYER_TODAY, x, y, INSET, INSET, INSET_PX, INSET_PX); };
// Pixel offset inside the displayed hero (fractions 0..1, origin top-left) to a new lat/lon.
export function movePoint(lat, lon, fx, fy) {
  const [cx, cy] = utm33(lat, lon);
  return fromUtm33(cx + (fx - 0.5) * HERO_W, cy + (0.5 - fy) * HERO_H, [lat, lon]).map(v => Math.round(v * 1e5) / 1e5);
}
export const inBerlin = (lat, lon) => lat >= BERLIN.south && lat <= BERLIN.north && lon >= BERLIN.west && lon <= BERLIN.east;
// No control characters, no field separators; collapsed spaces.
export const clean = (value, max) => String(value ?? '').normalize('NFC').replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\/\/|\|/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
export function titleFrom(result) {
  const a = result?.address || {};
  return clean(a.road || a.pedestrian || a.footway || a.square || result?.name || '', 80).toUpperCase().slice(0, YS_LIMITS.title).trim();
}
export function areaFrom(result) {
  const a = result?.address || {};
  const area = clean(a.suburb || a.city_district || a.borough || a.neighbourhood || '', 40);
  const line = area ? `${area}, Berlin` : 'Berlin';
  return line.length <= YS_LIMITS.area ? line : (area.slice(0, YS_LIMITS.area - 8).trim() + ', Berlin').slice(0, YS_LIMITS.area);
}
export function addressLabel(result) {
  const a = result?.address || {};
  const street = [a.road || result?.name, a.house_number].filter(Boolean).join(' ');
  return clean([street, a.postcode, 'Berlin'].filter(Boolean).join(', '), YS_LIMITS.address) || clean(result?.display_name, YS_LIMITS.address);
}
// The two values the cart line carries. Exact keys = the product's custom text field titles.
export function buildCustomText(state) {
  const title = clean(state.title, YS_LIMITS.title).toUpperCase(), area = clean(state.area, YS_LIMITS.area), line = clean(state.line, YS_LIMITS.line);
  const [lat, lon] = [Number(state.lat), Number(state.lon)];
  const parts = [`Map point ${lat.toFixed(5)}, ${lon.toFixed(5)}`, `Title: ${title} | Area: ${area}`];
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
const RING_SVG = (vw, vh, r, stroke) => `<svg class="ys-ring" viewBox="0 0 ${vw} ${vh}" preserveAspectRatio="none" aria-hidden="true"><circle cx="${vw / 2}" cy="${vh / 2}" r="${r}" fill="none" stroke="#FFE600" stroke-width="${stroke}"/></svg>`;
// The preview is the print itself: a 30 x 40 cm sheet laid out on make_print.py's 1800 x 2400 design grid (CSS unit --u = 1/1800 of the sheet width).
// Title size follows the generator: 118 (96 above 16 letters), shrunk until it fits the 1060-unit column left of the inset.
export const titleSize = title => (String(title || '').length <= 16 ? 118 : 96);

// `host` holds two slots ([data-ys-slot="visual"], [data-ys-slot="form"]) and the add button ([data-ys-add]). Rebuilt from `state` whenever the storefront re-renders. `api.add(customText)` returns a promise; `api.busy()` says whether the cart is locked.
export function mountConfigurator(host, state, api) {
  const L = YS_LIMITS;
  const visual = host.querySelector('[data-ys-slot="visual"]'), formSlot = host.querySelector('[data-ys-slot="form"]');
  visual.innerHTML = `<div class="ys-visual">
      <div class="ys-stage">
        <div class="ys-sheet" data-ys="sheet" ${state.lat ? '' : 'hidden'}>
          <div class="ys-hero" data-ys="hero">
            <img class="ys-1928" alt="Aerial photograph of your spot in 1928, with a yellow ring on your building" decoding="async">
            ${RING_SVG(HERO_W, HERO_H, RING, 2.1)}
            <span class="ys-year" aria-hidden="true">1928</span>
            <span class="ys-status" data-ys="status" role="status"></span>
          </div>
          <div class="ys-words">
            <div class="ys-ptitle" data-ys="ptitle"></div>
            <div class="ys-parea" data-ys="parea"></div>
            <span class="ys-rule" aria-hidden="true"></span>
            <div class="ys-pline" data-ys="pline"></div>
            <div class="ys-pcap">The same spot from above, 1928 and today.</div>
          </div>
          <div class="ys-inset" data-ys="inset">
            <img alt="Aerial photograph of the same spot today, with a yellow ring" decoding="async">
            ${RING_SVG(INSET, INSET, RING, 1.6)}
          </div>
          <span class="ys-today">Today</span>
          <span class="ys-pcredit">Aerial photographs: Geoportal Berlin, dl-de/zero-2.0</span>
          <span class="ys-pbrand">Walk of Berlin</span>
        </div>
        <div class="ys-sheet ys-sample" data-ys="example" ${state.lat ? 'hidden' : ''}><img src="${esc(api.sample)}" alt="Example print of a Berlin square in 1928 and today"></div>
      </div>
      <p class="ys-caption" data-ys="caption">${state.lat ? 'Your poster, 30 x 40 cm. Tap the 1928 photo to move the ring onto your building.' : 'Example poster, 30 x 40 cm. Search for your own address to see your street.'}</p>
    </div>`;
  formSlot.innerHTML = `<div class="ys-form">
      <label class="ys-label" for="ys-q">Your address or a place in Berlin</label>
      <div class="ys-search"><input id="ys-q" data-ys="q" type="search" autocomplete="off" enterkeyhint="search" maxlength="${L.address}" placeholder="e.g. Chamissoplatz" value="${esc(state.query || '')}"><button type="button" class="outline" data-ys="go">Search</button></div>
      <ul class="ys-results" data-ys="results" role="listbox" aria-label="Matching places" hidden></ul>
      <p class="ys-note" data-ys="searchnote" role="status"></p>
      <p class="ys-attr">Search by <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap contributors</a>. Berlin only.</p>
      <div class="ys-fields" data-ys="fields" ${state.lat ? '' : 'hidden'}>
        <div class="ys-row"><label>Title on the print<input data-ys="title" maxlength="${L.title}" autocapitalize="characters" value="${esc(state.title || '')}"></label><label>Area line<input data-ys="area" maxlength="${L.area}" value="${esc(state.area || '')}"></label></div>
        <label>Your line on the print (optional)<input data-ys="line" maxlength="${L.line}" placeholder="e.g. Lena &amp; Jonas · here since 2021" value="${esc(state.line || '')}"></label>
        <p class="ys-hint">The house number is never printed. Tap the 1928 photo to move the ring onto your building.</p>
        <label class="ys-check"><input type="checkbox" data-ys="seen" ${state.seen ? 'checked' : ''}><span>I can see the 1928 aerial photo at my spot. A blank white picture means there is no 1928 photo there (far eastern edge of Berlin).</span></label>
      </div>
      <p class="ys-credit">Aerial photographs: Geoportal Berlin, dl-de/zero-2.0.</p>
    </div>`;
  const $ = name => host.querySelector(`[data-ys="${name}"]`);
  const heroImg = $('hero').querySelector('img'), insetImg = $('inset').querySelector('img');
  const ptitle = $('ptitle'), parea = $('parea'), pline = $('pline');
  // Poster words follow the inputs; the title shrinks in 4-unit steps until it fits its column.
  function paintWords() {
    ptitle.textContent = clean(state.title, L.title).toUpperCase(); parea.textContent = clean(state.area, L.area);
    pline.textContent = clean(state.line, L.line); pline.hidden = !pline.textContent;
    let size = titleSize(ptitle.textContent);
    ptitle.style.setProperty('--fs', size);
    while (size > 48 && ptitle.scrollWidth > ptitle.clientWidth + 1) { size -= 4; ptitle.style.setProperty('--fs', size); }
  }
  document.fonts?.ready?.then(() => { if (host.isConnected) paintWords(); });
  const status = $('status'), results = $('results'), note = $('searchnote'), input = $('q');
  const setStatus = text => { status.textContent = text; status.hidden = !text; };
  const refreshButton = () => { const b = host.getRootNode().querySelector?.('[data-ys-add]'); if (b) b.disabled = !readyToAdd(state) || api.busy(); const why = host.getRootNode().querySelector?.('[data-ys-why]'); if (why) why.textContent = readyToAdd(state) ? '' : (!state.lat ? 'Search for your address to continue.' : (!state.seen ? 'Confirm that you can see the 1928 photo to continue.' : 'Fill in the title and area lines to continue.')); };
  api.refresh = refreshButton;

  function showPoint(fresh) {
    if (!state.lat) return;
    $('sheet').hidden = false; $('example').hidden = true; $('fields').hidden = false;
    $('caption').textContent = 'Your poster, 30 x 40 cm. Tap the 1928 photo to move the ring onto your building.';
    paintWords();
    setStatus('Loading the 1928 photo…');
    const mine = state.token = (state.token || 0) + 1;
    heroImg.onload = () => { if (state.token === mine) setStatus(''); };
    heroImg.onerror = () => { if (state.token === mine) setStatus('The aerial photo service did not answer. Try again in a moment.'); };
    insetImg.onerror = () => {};
    heroImg.src = heroUrl(state.lat, state.lon);
    insetImg.src = insetUrl(state.lat, state.lon);
    if (fresh) state.seen = false, host.querySelector('[data-ys="seen"]').checked = false;
    refreshButton();
  }
  // ---- Nominatim: Berlin viewbox, bounded, Germany only. Browsers cannot set a User-Agent, so the contact address goes in the email parameter. Max one request per second, debounced. ----
  let timer = 0, controller = null;
  const spacing = 1100;
  async function search(q) {
    q = clean(q, 80);
    if (q.length < 3) { results.hidden = true; note.textContent = q ? 'Keep typing (at least 3 letters).' : ''; return; }
    const wait = Math.max(0, (api.lastSearchAt || 0) + spacing - Date.now());
    if (wait) await new Promise(r => setTimeout(r, wait));
    if (clean(input.value, 80) !== q) return;
    controller?.abort(); controller = new AbortController();
    api.lastSearchAt = Date.now(); note.textContent = 'Searching…';
    try {
      const url = `${NOMINATIM}?format=jsonv2&addressdetails=1&limit=5&countrycodes=de&bounded=1&viewbox=${BERLIN.west},${BERLIN.north},${BERLIN.east},${BERLIN.south}&q=${encodeURIComponent(q + ', Berlin')}&email=info@berlinwalk.com`;
      const response = await fetch(url, {signal: controller.signal, headers: {Accept: 'application/json'}});
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const rows = (await response.json()).filter(r => inBerlin(Number(r.lat), Number(r.lon)));
      state.results = rows;
      results.innerHTML = rows.map((r, i) => `<li role="option"><button type="button" data-ys-pick="${i}">${esc(clean(r.display_name, 110))}</button></li>`).join('');
      results.hidden = rows.length === 0;
      note.textContent = rows.length ? 'Choose your place:' : 'Nothing found in Berlin. Try the street name with a house number.';
    } catch (error) {
      if (error.name !== 'AbortError') note.textContent = 'The address search did not answer. Try again in a moment.';
    }
  }
  const schedule = () => { clearTimeout(timer); timer = setTimeout(() => search(input.value), 900); };
  input.addEventListener('input', () => { state.query = input.value; schedule(); });
  input.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); clearTimeout(timer); search(input.value); } });
  $('go').addEventListener('click', () => { clearTimeout(timer); search(input.value); });
  results.addEventListener('click', event => {
    const pick = event.target.closest('[data-ys-pick]'); if (!pick) return;
    const r = state.results?.[Number(pick.dataset.ysPick)]; if (!r) return;
    Object.assign(state, {lat: Math.round(Number(r.lat) * 1e5) / 1e5, lon: Math.round(Number(r.lon) * 1e5) / 1e5, address: addressLabel(r), title: titleFrom(r), area: areaFrom(r), query: input.value});
    host.querySelector('[data-ys="title"]').value = state.title; host.querySelector('[data-ys="area"]').value = state.area;
    results.hidden = true; note.textContent = ''; showPoint(true);
  });
  // ---- Tap the 1928 photo: pixel offset -> metres -> new point ----
  $('hero').addEventListener('click', event => {
    if (!state.lat) return;
    const box = heroImg.getBoundingClientRect(); if (!box.width || !box.height) return;
    const [lat, lon] = movePoint(state.lat, state.lon, (event.clientX - box.left) / box.width, (event.clientY - box.top) / box.height);
    if (!inBerlin(lat, lon)) return;
    state.lat = lat; state.lon = lon; showPoint(false);
  });
  for (const name of ['title', 'area', 'line']) {
    host.querySelector(`[data-ys="${name}"]`).addEventListener('input', event => { state[name] = event.target.value; paintWords(); refreshButton(); });
  }
  host.querySelector('[data-ys="seen"]').addEventListener('change', event => { state.seen = event.target.checked; refreshButton(); });
  if (state.lat) showPoint(false);
  refreshButton();
}
