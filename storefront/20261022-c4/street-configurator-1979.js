// "Your West Berlin Street in 1979" (May 1979 aerial of West Berlin and the strip of East Berlin along the Wall): the sister of the 1928 configurator (22 Nov 2026, local candidate).
//
// The 1928 modules stay byte for byte as released: street-configurator.js and aerial-source.js are pinned by tests/design2.test.mjs
// ("protected configurator UI/cart bytes"). So this module does not edit them. createYs1979(base, profile) takes the ALREADY LOADED 1928
// module as `base`, reuses every helper from it (geocoding rows, titles, the print-details string, size and paper prices, geometry,
// colour grading, the cart choices) and returns an object with the same exports the storefront reads from street-configurator.js, with
// four things changed:
//   1. ids: the 1979 poster and the 1979 digital file (passed in `profile`, defined once in storefront-element.js);
//   2. the old photo: May 1979 tiles of WEST Berlin (aerial-1979.js) instead of the Geoportal 1928 WMS;
//   3. the coverage gate: no 1979 photo (tile 404, or more than 2 % empty pixels) = no add to cart, with a clear message;
//   4. what 1979 does not sell: no framed, canvas, Homes, multi-print tiers, gift voucher, preview-by-email, Finder handoff.
// The print contract is untouched: buildCustomText, ysChoices, ysPrice and the layout/colour keys come straight from `base`, so the cart line
// carries exactly the two custom text fields the 1928 poster carries and make_print.py (1979) parses them unchanged. The layout KEY for the
// single large photo stays "1928-only" (the generator only knows that key); only its label says 1979.
import {boxFromWmsUrl, loadAerialPhoto} from './aerial-source.js';
import {loadOldPhoto, loadFrame, EMPTY_LIMIT} from './aerial-1979.js';

const GRID = {w: 1800, h: 2400}, PHOTO = {w: 1400, h: 746}, RING = 26, GROUND_W = 368;
const TX = {cx: 900, capOld: 990, capToday: 1836, title: 2011, area: 2083, coords: 2137, line: 2199, trackOld: 8, trackToday: 10};
const BERLIN = {west: 13.0884, east: 13.7612, north: 52.6755, south: 52.3383};
const NOMINATIM = 'https://nominatim.openstreetmap.org/search', PHOTON = 'https://photon.komoot.io/api/';
const SEARCH_HINT = 'Type the address of a home, yours now or one from years ago, then tap it. The preview is free.';
const SEARCH_HINT_HTML = 'Type the address of a home, yours now or one from years ago, then tap it. <span class="ys-note-free">The preview is free.</span>';
const DIGITAL_SPEC = 'Digital file · JPG + PDF · 45 x 60 cm at 300 ppi';
const DIGITAL_DELIVERY = 'Prints cleanly at 30 x 40 cm too. Nothing is shipped, so it works anywhere.';
const POSTER_DELIVERY = 'Arrives in 3 to 5 working days in Germany, 4 to 9 elsewhere. Frame not included.';

// ---- Words (English and German, one table). Strings shared with the 1928 page stay English here and go through ys-de.js like on the 1928 page. ----
// What the flight covers (Yusuf, 22 Nov 2026): West Berlin, and along the Wall also a strip of East Berlin on the other side (Pariser Platz is in it). Further east
// there is no 1979 photo; the page then recommends my 1928 print for the same spot.
export const TEXT_1979 = Object.freeze({
  en: Object.freeze({
    name: 'Your West Berlin Street in 1979', place: 'May 1979 and today',
    lead: 'The home you live in now, or one you left years ago, seen from above in May 1979 and today. West Berlin and the strip of East Berlin along the Wall.',
    leadDigital: 'Your Berlin home as a JPG and PDF. Nothing is shipped.',
    altOld: 'Aerial photograph of your home in 1979, with a cross on your building',
    altRec: 'Aerial photograph of your home in 1928, with a cross on your building',
    sampleAlt: 'Example print: Spandauer Damm in 1979 and today',
    find: 'Find your home in 1979',
    captionPoster: (size, verb) => `Your poster, ${size}: 1979 above, today below, same ground and scale. ${verb} either photo to move the cross.`,
    captionDigital: verb => `Your digital file: 1979 above, today below, same ground and scale. ${verb} either photo to move the cross.`,
    captionOnly: 'Your home in 1979. One large aerial photograph, with your building marked.',
    captionRec: verb => `This spot in 1928 above, today below, same ground and scale. ${verb} either photo to move the cross.`,
    verbs: ['Click', 'Tap'],
    layouts: {'then-now': '1979 & today', '1928-only': '1979 only'},
    checking: 'Checking the 1979 photo…',
    whyChecking: 'Checking the 1979 photo for your spot…',
    whyBlocked: 'There is no 1979 photo here. Pick another spot to continue.',
    whyError: 'The 1979 photo has not loaded yet. Try again in a moment.',
    errorBlock: 'The 1979 photo could not load. Search for the place again, or try again in a moment.',
    // The plain message: shown only when the 1928 recommendation cannot be drawn (the 1928 photo did not load).
    noCover: link => `There is no 1979 aerial photo for this spot. The May 1979 flight covered West Berlin and the streets along the Wall on the eastern side; for places further east, see ${link('my 1928 print')}.`,
    // The recommendation card (blocked spot, 1928 photo of the same box in the old-photo slot). east: the spot lies in former East Berlin, more than 250 m
    // from the sector border; hole: every other blocked spot (a gap in West Berlin, the border zone, anything the polygons cannot place).
    recommend: {
      east: {head: 'The May 1979 flight did not reach this part of East Berlin.', line: 'It covered West Berlin and the streets along the Wall on the eastern side. My 1928 print shows this exact spot.'},
      hole: {head: 'There is no 1979 photo for this exact spot.', line: 'My 1928 print shows this exact spot, East and West.'},
      button: 'See this address in 1928',
      from: price => `from ${price}`,
      // On the photo itself (the sheet shows a 1928 picture in the old-photo slot): a band across the picture and a large corner tag, so nobody mistakes it for the 1979 poster.
      band: '1928 · This spot is not in the 1979 photo', tag: '1928',
    },
    photo: {loading: 'Loading the 1979 photo…', retrying: 'Retrying the 1979 photo…', down: 'The 1979 photo is not coming through. I keep trying here.', gaveUp: 'The 1979 photo could not load. Search for the place again later.'},
    // FAQ: {shared} items are the 1928 page's own question and answer (storefront-element.js YS_FAQ, found by question text; ys-de.js translates them);
    // the 1928 "more than one home" question is left out because the 1979 print has one home only.
    faq: [
      {q: 'Why West Berlin?', a: link => `The May 1979 aerial survey I use was flown over West Berlin. Along the Wall it also caught a strip of East Berlin, so many streets near the border are in it too, Pariser Platz for example. Further east there is no 1979 photo; for those addresses <a href="${link}" data-ys-1928-link>my 1928 print</a> shows the spot.`},
      {q: 'How do I know if my address is covered?', a: () => 'Type it in. The preview loads the 1979 photo of your spot. If there is none, it tells you, and you cannot add the print to your cart.'},
      {shared: 'Which paper should I pick?'},
      {q: 'Is a frame included?', a: () => 'No, the poster comes unframed.'},
      {q: 'What if the 1979 photo is blank at my spot?', a: () => 'The 1979 survey did not cover every corner, even in West Berlin. The preview shows exactly what I print: if the top photo is blank or missing, it tells you and the print cannot go in your cart. Pick a place nearby.'},
      {shared: 'Can I change the text after I order?'},
      {shared: 'Where do you deliver, and how long does it take?'},
      {shared: 'Can I return it?'},
    ],
    attr: ({photon, osm, sources}) => `Address search by <a href="${photon}" target="_blank" rel="noopener noreferrer">Photon</a> and <a href="${osm}" target="_blank" rel="noopener noreferrer">© OpenStreetMap contributors</a>. Aerial photographs: Geoportal Berlin, dl-de/zero-2.0. <a href="${sources}" target="_blank" rel="noopener" data-ys-sources>Image credits &amp; licences</a>`,
  }),
  de: Object.freeze({
    name: 'Deine West-Berliner Straße 1979', place: 'Mai 1979 und heute',
    lead: 'Gib die Adresse deines Zuhauses ein, heute oder von früher, und sieh es kostenlos von oben, im Mai 1979 und heute. West-Berlin und der Streifen Ost-Berlins entlang der Mauer. Als Poster bestellen kannst du es, musst du aber nicht.',
    leadDigital: 'Dein Berliner Zuhause als JPG und PDF. Kein Versand.',
    altOld: 'Luftbild deines Zuhauses von 1979, mit einem Kreuz auf deinem Gebäude',
    altRec: 'Luftbild deines Zuhauses von 1928, mit einem Kreuz auf deinem Gebäude',
    sampleAlt: 'Beispieldruck: Spandauer Damm 1979 und heute',
    find: 'Finde dein Zuhause 1979',
    captionPoster: (size, verb) => `Dein Poster, ${size}: oben 1979, unten heute, gleicher Ausschnitt und Maßstab. ${verb} auf ein Foto, um das Kreuz zu verschieben.`,
    captionDigital: verb => `Deine digitale Datei: oben 1979, unten heute, gleicher Ausschnitt und Maßstab. ${verb} auf ein Foto, um das Kreuz zu verschieben.`,
    captionOnly: 'Dein Zuhause 1979. Ein großes Luftbild, dein Gebäude ist markiert.',
    captionRec: verb => `Diese Stelle um 1928 oben, heute unten, gleicher Ausschnitt und Maßstab. ${verb} auf ein Foto, um das Kreuz zu verschieben.`,
    verbs: ['Klicke', 'Tippe'],
    layouts: {'then-now': '1979 und heute', '1928-only': 'Nur 1979'},
    checking: 'Das Foto von 1979 wird geprüft…',
    whyChecking: 'Das Foto von 1979 wird für deine Stelle geprüft…',
    whyBlocked: 'Hier gibt es kein Foto von 1979. Wähle eine andere Stelle, um weiterzumachen.',
    whyError: 'Das Foto von 1979 ist noch nicht geladen. Versuche es gleich noch einmal.',
    errorBlock: 'Das Foto von 1979 konnte nicht geladen werden. Suche den Ort noch einmal oder versuche es gleich erneut.',
    noCover: link => `Für diese Stelle gibt es kein Luftbild von 1979. Der Bildflug vom Mai 1979 erfasste West-Berlin und die Straßen entlang der Mauer auf der Ostseite; für Orte weiter östlich siehe ${link('meinen Druck von 1928')}.`,
    recommend: {
      east: {head: 'Der Bildflug vom Mai 1979 hat diesen Teil Ost-Berlins nicht erreicht.', line: 'Er zeigt West-Berlin und die Straßen entlang der Mauer auf der Ostseite. Mein Druck von 1928 zeigt genau diese Stelle.'},
      hole: {head: 'Für genau diese Stelle gibt es kein Foto von 1979.', line: 'Mein Druck von 1928 zeigt genau diese Stelle, in Ost und West.'},
      button: 'Diese Adresse in 1928 ansehen',
      from: price => `ab ${price}`,
      band: '1928 · Diese Stelle ist nicht auf dem Foto von 1979', tag: '1928',
    },
    photo: {loading: 'Das Foto von 1979 wird geladen…', retrying: 'Das Foto von 1979 wird erneut geladen…', down: 'Das Foto von 1979 kommt gerade nicht an. Ich versuche es hier weiter.', gaveUp: 'Das Foto von 1979 konnte nicht geladen werden. Suche den Ort später noch einmal.'},
    faq: [
      {q: 'Warum West-Berlin?', a: link => `Die Luftbildbefliegung vom Mai 1979, die ich verwende, wurde über West-Berlin geflogen. Entlang der Mauer hat sie auch einen Streifen Ost-Berlins erfasst, viele Straßen nahe der Grenze sind also dabei, zum Beispiel der Pariser Platz. Weiter östlich gibt es kein Foto von 1979; solche Adressen zeigt <a href="${link}" data-ys-1928-link>mein Druck von 1928</a>.`},
      {q: 'Woher weiß ich, ob meine Adresse dabei ist?', a: () => 'Gib sie ein. Die Vorschau lädt das Foto von 1979 für deine Stelle. Gibt es dort keins, sagt sie es dir, und du kannst den Druck nicht in den Warenkorb legen.'},
      {shared: 'Which paper should I pick?'},
      {q: 'Ist ein Rahmen dabei?', a: () => 'Nein, das Poster wird ungerahmt geliefert.'},
      {q: 'Was, wenn das Foto von 1979 an meiner Stelle leer ist?', a: () => 'Die Befliegung von 1979 deckte nicht jede Ecke ab, auch in West-Berlin nicht. Die Vorschau zeigt genau, was ich drucke: Ist das obere Foto leer oder fehlt es, sagt sie es dir, und du kannst den Druck nicht in den Warenkorb legen. Wähle einen Ort in der Nähe.'},
      {shared: 'Can I change the text after I order?'},
      {shared: 'Where do you deliver, and how long does it take?'},
      {shared: 'Can I return it?'},
    ],
    attr: ({photon, osm, sources}) => `Adresssuche von <a href="${photon}" target="_blank" rel="noopener noreferrer">Photon</a> und <a href="${osm}" target="_blank" rel="noopener noreferrer">© OpenStreetMap-Mitwirkenden</a>. Luftbilder: Geoportal Berlin, dl-de/zero-2.0. <a href="${sources}" target="_blank" rel="noopener" data-ys-sources>Bildnachweise &amp; Lizenzen</a>`,
  }),
});
// ---- Which side of the Wall a spot was on (22 Nov 2026) --------------------------------------------------------------------------------------------------
// data/berlin-sides-1989.json: the East and the West Berlin side areas of the audited Address Time Machine reconstruction (97 official ALKIS Ortsteile mapped to
// East or West with Berlin's own old-district mapping, topology checked 30 Aug 2026), simplified to 10 m, EPSG:25833. An administrative reconstruction, not a legal
// border, so "East Berlin" is only said for a spot inside the East area AND more than NEAR_BORDER_M from the West area (the dataset's own rule for "near the Wall").
export const NEAR_BORDER_M = 250;
const SIDES_URL = new URL('./data/berlin-sides-1989.json', import.meta.url).href;
let sidesRequest = null;
export const loadSides = (fetchImpl = globalThis.fetch.bind(globalThis)) => sidesRequest || (sidesRequest = fetchImpl(SIDES_URL).then(response => { if (!response.ok) throw new Error('SIDES_UNAVAILABLE'); return response.json(); }).catch(error => { sidesRequest = null; throw error; }));
function inRing(x, y, flat) {
  let inside = false;
  for (let i = 0, j = flat.length / 2 - 1; i < flat.length / 2; j = i++) {
    const xi = flat[2 * i], yi = flat[2 * i + 1], xj = flat[2 * j], yj = flat[2 * j + 1];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
const inAreas = (areas, x, y) => areas.some(area => inRing(x, y, area.outer) && !area.holes.some(hole => inRing(x, y, hole)));
function edgeDistance(areas, x, y) {
  let best = Infinity;
  for (const area of areas) for (const flat of [area.outer, ...area.holes]) {
    const n = flat.length / 2;
    for (let i = 0; i < n; i++) {
      const x1 = flat[2 * i], y1 = flat[2 * i + 1], x2 = flat[2 * ((i + 1) % n)], y2 = flat[2 * ((i + 1) % n) + 1], dx = x2 - x1, dy = y2 - y1, len = dx * dx + dy * dy;
      const t = len ? Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / len)) : 0;
      best = Math.min(best, Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy)));
    }
  }
  return best;
}
// {side: 'east' | 'near-border' | 'west' | 'other', margin: metres to the other side's area}. Only 'east' may be called East Berlin on the page.
export function classifySide(sides, lat, lon, utm33) {
  const [easting, northing] = utm33(lat, lon), x = easting - sides.origin[0], y = northing - sides.origin[1];
  if (inAreas(sides.east, x, y)) { const margin = edgeDistance(sides.west, x, y); return {side: margin >= NEAR_BORDER_M ? 'east' : 'near-border', margin: Math.round(margin)}; }
  return {side: inAreas(sides.west, x, y) ? 'west' : 'other', margin: Math.round(edgeDistance(sides.east, x, y))};
}
// The spot as it travels to the 1928 page: in the URL FRAGMENT, which no server, pixel or analytics request ever carries (the 1928 page reads it once on load and
// removes it from the address at once, like its Finder and e-mail tokens). Point to five decimals, title, area and address as the print and the cart carry them.
export function spotFragment(state) {
  const q = new URLSearchParams();
  q.set('ys', `${Number(state.lat).toFixed(5)},${Number(state.lon).toFixed(5)}`);
  for (const [key, value] of [['t', state.title], ['a', state.area], ['q', state.address]]) if (value) q.set(key, String(value));
  return q.toString();
}
const deMoney = value => `${Number(value).toFixed(2).replace('.', ',')} €`;
export const isGerman = (search = typeof location !== 'undefined' ? location.search : '') => new URLSearchParams(search).get('lang') === 'de';
export const textFor = german => TEXT_1979[german ? 'de' : 'en'];
const verbOf = german => textFor(german).verbs[globalThis.matchMedia?.('(pointer: fine)')?.matches ? 0 : 1];
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

export function createYs1979(base, profile) {
  const {PRINT_OPTIONS, ysLayout, ysColour, ysSize, ysPaper, ysPrice, ysDigital, readyToCheck, clean, coordsText, inBerlin, movePoint, utm33, urlToday, gradePixels,
    titleFrom, areaFrom, fromPhoton, placeLines, addressLabel, titleSize, euro, YS_LIMITS, YS_SIZES, YS_PAPERS} = base;
  const T = () => textFor(isGerman());
  const layoutLabel = key => T().layouts[key] || PRINT_OPTIONS.layouts[key];
  const optionNames = state => ({layout: layoutLabel(ysLayout(state)), colour: PRINT_OPTIONS.themes[ysColour(state)].name});
  const ysProductId = state => ysDigital(state) ? profile.digitalId : profile.posterId;
  // The old photo covers the same ground box as today's photo (368 m wide, 746:1400 high; 1592:1400 for the single large photo); asking
  // urlToday for the box keeps the geometry in one place, the 1928 module.
  const oldBox = (lat, lon, only) => {
    const box = boxFromWmsUrl(urlToday(lat, lon));
    return only ? {...box, h: box.w * 1592 / 1400, ph: Math.round(box.pw * 1592 / 1400)} : box;
  };
  const oldPhotoBlocked = state => state.cover === 'blocked';
  // The recommendation card is on screen: blocked, and the 1928 photo of the same box is the picture on the sheet.
  const recActive = state => oldPhotoBlocked(state) && !!state.rec;
  // Everything the print needs AND a verified 1979 photo: no add button works without it (the storefront's add handler asks this too).
  const readyToAdd = state => readyToCheck(state) && state.cover === 'ok';
  const noCoverHtml = (german, link) => T().noCover(label => `<a href="${escape(link)}" data-ys-1928-link>${escape(label)}</a>`);
  // The recommendation card: what the buyer reads and presses when the 1979 gate is shut and the 1928 photo of the same spot is on screen.
  const toLink1928 = (german, state) => `${german ? profile.page1928.de : profile.page1928.en}#${spotFragment(state)}`;
  const cardHtml = (german, side, link, price) => {
    const r = T().recommend, kind = side === 'east' ? r.east : r.hole, hint = Number.isFinite(price) ? r.from(german ? deMoney(price) : euro(price)) : '';
    return `<p class="ys-rec-head"><strong>${escape(kind.head)}</strong></p><p class="ys-rec-line">${escape(kind.line)}</p><p class="ys-rec-go"><a class="ys-rec-button" href="${escape(link)}" data-ys-to1928>${escape(r.button)}</a>${hint ? `<span class="ys-rec-price">${escape(hint)}</span>` : ''}</p>`;
  };
  const CROSS_SVG = (() => {
    const r = RING * PHOTO.w / GROUND_W, g = r * 0.35, L = r * 0.75, x = PHOTO.w / 2, y = PHOTO.h / 2;
    const arms = [[x - L, y, x - g, y], [x + g, y, x + L, y], [x, y - L, x, y - g], [x, y + g, x, y + L]].map(a => a.map(v => v.toFixed(2)));
    const draw = (stroke, w) => arms.map(([x1, y1, x2, y2]) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${w}"/>`).join('');
    return `<svg class="ys-ring" viewBox="0 0 ${PHOTO.w} ${PHOTO.h}" aria-hidden="true">${draw('#141414', 4.4)}${draw('#FAF7EE', 2.4)}</svg>`;
  })();
  const captionFor = (state, live) => {
    const t = T(), verb = verbOf(isGerman());
    if (live && state.rec) return t.captionRec(verb);
    if (live && ysLayout(state) === '1928-only') return t.captionOnly;
    if (ysDigital(state)) return live ? t.captionDigital(verb) : 'Example file. Search an address to see your home, then add your own words.';
    return live ? t.captionPoster(ysSize(state), verb) : 'Example poster, SIZE. Search an address to see your home, then add your own words.'.replace('SIZE', ysSize(state));
  };

  function mountConfigurator(host, state, api) {
    api.homesCleanup?.(); api.cleanup1979?.();
    if (state.homesCount) state.homesCount = 0;
    if (state.format !== 'digital') state.format = 'poster';
    const L = YS_LIMITS, de = isGerman();
    const currentPrice = s => api.variantPrice ? api.variantPrice(s) : ysPrice(s);
    const showPrice = (el, amount) => { if (el) el.innerHTML = api.priceHtml ? api.priceHtml(amount, state) : euro(amount); };
    const hasQuickFormats = api.variants && api.digital && Number.isFinite(api.digitalPrice);
    const visual = host.querySelector('[data-ys-slot="visual"]'), formSlot = host.querySelector('[data-ys-slot="form"]');
    visual.innerHTML = `<div class="ys-visual">
      <div class="ys-stage">
        <div class="ys-sheet" data-ys="sheet" ${state.lat ? '' : 'hidden'}>
          <div class="ys-photo ys-photo-1928" data-ys="photo-1928">
            <img class="ys-1928" alt="${escape(T().altOld)}" decoding="async">
            ${CROSS_SVG}
            <span class="ys-wm" aria-hidden="true"></span>
            <span class="ys-status" data-ys="status" role="status"></span>
            <span class="ys-rec-tag" data-ys="rectag" aria-hidden="true" hidden></span>
            <span class="ys-rec-band" data-ys="recband" hidden></span>
          </div>
          <div class="ys-photo ys-photo-today" data-ys="photo-today">
            <img class="ys-todayimg" alt="Aerial photograph of the same spot today, same ground and scale, with a cross on the same spot" decoding="async">
            ${CROSS_SVG}
            <span class="ys-wm" aria-hidden="true"></span>
            <span class="ys-status" data-ys="status-today" role="status" hidden></span>
          </div>
          <svg class="ys-type" viewBox="0 0 ${GRID.w} ${GRID.h}" role="group" aria-label="Text on the print">
            <text class="ys-cap ys-cap-1928" x="${TX.cx + TX.trackOld / 2}" y="${TX.capOld}">1979</text>
            <text class="ys-cap ys-cap-today" x="${TX.cx + TX.trackToday / 2}" y="${TX.capToday}">${de ? 'HEUTE' : 'TODAY'}</text>
            <text class="ys-ptitle" data-ys="ptitle" x="${TX.cx}" y="${TX.title}"></text>
            <text class="ys-parea" data-ys="parea" x="${TX.cx}" y="${TX.area}"></text>
            <text class="ys-pcoords" data-ys="pcoords" x="${TX.cx}" y="${TX.coords}"></text>
            <text class="ys-pline" data-ys="pline" x="${TX.cx}" y="${TX.line}"></text>
          </svg>
          <button type="button" class="ys-words-tag" data-ys="wordstag" hidden><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M11.3 1.9a1.5 1.5 0 0 1 2.1 0l.7.7a1.5 1.5 0 0 1 0 2.1L5.6 13.2 2 14l.8-3.6z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg><span>Your words</span></button>
        </div>
        <div class="ys-sheet ys-sample" data-ys="example" ${state.lat ? 'hidden' : ''}><img src="${escape(api.sample)}" alt="${escape(T().sampleAlt)}"><span class="ys-words-tag" aria-hidden="true"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M11.3 1.9a1.5 1.5 0 0 1 2.1 0l.7.7a1.5 1.5 0 0 1 0 2.1L5.6 13.2 2 14l.8-3.6z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg><span>Where we met · 1979</span></span></div>
      </div>
      <p class="ys-caption" data-ys="caption">${escape(captionFor(state, !!state.lat))}</p>
      <div class="ys-nocover" data-ys="nocover" role="status" aria-live="polite" hidden></div>
      <div class="ys-quick${hasQuickFormats ? ' ys-quick-with-formats' : ''}" data-ys="quick" ${state.lat ? '' : 'hidden'}>
        ${hasQuickFormats ? `<div class="ys-quick-formats" role="group" aria-label="Choose your format">
          <button type="button" data-ys-quick-format="digital" aria-pressed="${ysDigital(state)}"><strong>Digital file</strong><small>JPG + PDF</small></button>
          <button type="button" data-ys-quick-format="print" aria-pressed="${!ysDigital(state)}"><strong>Physical print</strong><small><span data-ys="quickprintkind"></span><span data-ys="quickprintsize"></span></small></button>
        </div>
        <p class="ys-quick-delivery" data-ys="quickdelivery"></p>` : ''}
        <button type="button" class="primary" data-ys-quickadd disabled>Add to cart</button>
        <p class="ys-quick-spec"><span data-ys="quickspec">Personalised print</span><span class="ys-quick-sep"> · </span><button type="button" class="ys-link" data-ys-jump>Change size, paper or text</button></p>
        ${base.trustHtml(true, 'ys-trust-compact')}
      </div>
    </div>`;
    const searchHtml = `<div class="ys-form ys-searchform">
      <label class="ys-label ys-find" for="ys-q">${escape(T().find)}</label>
      <div class="ys-search"><input id="ys-q" data-ys="q" type="search" autocomplete="off" enterkeyhint="search" maxlength="${L.address}" placeholder="e.g. Kurfürstendamm" value="${escape(state.query || '')}"><button type="button" class="outline" data-ys="go">Search</button></div>
      <p class="ys-note ys-note-hint" data-ys="searchnote" role="status">${SEARCH_HINT_HTML}</p>
      <div class="ys-resultswrap"><ul class="ys-results" data-ys="results" role="listbox" aria-label="Matching places" hidden></ul></div>
    </div>`;
    const optionsHtml = `<div class="ys-form ys-optform">
      <div class="ys-fields" data-ys="fields" ${state.lat ? '' : 'hidden'}>
        <div class="ys-row"><label>Title on the print<input data-ys="title" maxlength="${L.title}" autocapitalize="characters" value="${escape(state.title || '')}"></label><label>Area line<input data-ys="area" maxlength="${L.area}" value="${escape(state.area || '')}"></label></div>
        <label>Your words on the print (optional)<input data-ys="line" maxlength="${L.line}" placeholder="Home since 1979" value="${escape(state.line || '')}"></label>
        <p class="ys-hint">The house number is never printed.</p>
      </div>
      <div class="ys-format ys-format-top" data-ys="format" ${api.digital ? '' : 'hidden'}>
        <span class="ys-label" id="ys-format-l">What you get</span>
        <div class="ys-sizes ys-formats" role="radiogroup" aria-labelledby="ys-format-l">${[['poster', 'Poster', true], ['digital', 'Digital file', api.digital]].filter(([, , available]) => available).map(([key, label]) => `<button type="button" role="radio" class="ys-size" data-ys-format="${key}" aria-checked="${(state.format || 'poster') === key}"><span>${label}</span></button>`).join('')}</div>
      </div>
      <div class="ys-choice-row" data-ys="layoutrow" role="group" aria-label="Layout"><span class="ys-label">Layout</span><div class="ys-layouts" role="radiogroup" aria-label="Layout">${Object.keys(PRINT_OPTIONS.layouts).map(key => `<button type="button" role="radio" data-ys-layout="${key}" aria-checked="${key === ysLayout(state)}">${escape(layoutLabel(key))}</button>`).join('')}</div></div>
      <div class="ys-choice-row" role="group" aria-label="Colour"><span class="ys-label">Colour <small data-ys="colourname">${escape(optionNames(state).colour)}</small></span><div class="ys-swatches" role="radiogroup" aria-label="Colour">${Object.entries(PRINT_OPTIONS.themes).map(([key, t]) => `<button type="button" role="radio" data-ys-colour="${key}" title="${escape(t.name)}" aria-label="${escape(t.name)}" aria-checked="${key === ysColour(state)}" style="--swatch:rgb(${t.mid.join(',')});--paper:rgb(${t.bg.join(',')})"><span aria-hidden="true"></span></button>`).join('')}</div></div>
      <details class="ys-options" data-ys="options" ${state.optionsOpen ? 'open' : ''} ${api.variants && !ysDigital(state) ? '' : 'hidden'}>
        <summary><span class="ys-options-t">Size and paper</span><span class="ys-options-v" data-ys="optsummary"></span></summary>
        <div class="ys-options-body">
          <div class="ys-variant" data-ys="variant" ${api.variants && !ysDigital(state) ? '' : 'hidden'}>
            <span class="ys-label" id="ys-size-l">Size</span>
            <div class="ys-sizes" role="radiogroup" aria-labelledby="ys-size-l">${YS_SIZES.map(z => `<button type="button" role="radio" class="ys-size" data-ys-size="${escape(z)}" aria-checked="${z === ysSize(state)}">${escape(z)}<small data-ys-sizeprice="${escape(z)}"></small></button>`).join('')}</div>
            <label class="ys-label" for="ys-paper" data-ys="paperlabel">Paper</label>
            <select id="ys-paper" data-ys="paper">${YS_PAPERS.map(p => `<option value="${escape(p.name)}" ${p.name === ysPaper(state).name ? 'selected' : ''}>${escape(p.name)}</option>`).join('')}</select>
            <p class="ys-hint" data-ys="papernote"></p>
          </div>
        </div>
      </details>
    </div>`;
    const searchSlot = host.querySelector('[data-ys-slot="search"]');
    if (searchSlot) { searchSlot.innerHTML = searchHtml; formSlot.innerHTML = optionsHtml; } else formSlot.innerHTML = searchHtml + optionsHtml;
    const $ = name => host.querySelector(`[data-ys="${name}"]`);
    const quickFormats = [...host.querySelectorAll('[data-ys-quick-format]')];
    const optSummary = text => { $('optsummary').textContent = text; };
    $('options').addEventListener('toggle', () => { state.optionsOpen = $('options').open; });
    function paintVariant() {
      if (!api.digital && ysDigital(state)) state.format = 'poster';
      const kind = ysDigital(state) ? 'digital' : 'poster';
      $('paper').value = ysPaper(state).name;
      host.querySelectorAll('[data-ys-format]').forEach(b => b.setAttribute('aria-checked', String(b.dataset.ysFormat === (state.format || 'poster'))));
      if (hasQuickFormats) {
        quickFormats.forEach(button => button.setAttribute('aria-pressed', String((button.dataset.ysQuickFormat === 'digital') === ysDigital(state))));
        $('quickprintkind').textContent = 'Poster';
        $('quickprintsize').textContent = ysSize(state);
        $('quickdelivery').textContent = ysDigital(state) ? 'Sent by email within 24 hours' : 'Delivery in Germany in 3 to 5 working days';
      }
      $('options').hidden = !api.variants || ysDigital(state);
      $('variant').hidden = !api.variants || ysDigital(state);
      const delivery = host.querySelector('.ys-buy .delivery'); if (delivery) delivery.textContent = ysDigital(state) ? DIGITAL_DELIVERY : POSTER_DELIVERY;
      const root = host.getRootNode().querySelectorAll ? host.getRootNode() : host;
      root.querySelectorAll('[data-ys-legal]').forEach(el => { el.hidden = el.dataset.ysLegal !== kind; });
      root.querySelectorAll('[data-ys-shipping]').forEach(el => { el.hidden = ysDigital(state); });
      host.querySelector('[data-ys-jump]').textContent = ysDigital(state) ? 'Change format or text' : 'Change size, paper or text';
      if (ysDigital(state)) {
        if (!Number.isFinite(api.digitalPrice)) return;
        const label = euro(api.digitalPrice);
        optSummary(`Digital file · ${label}`);
        showPrice(host.querySelector('.product-title .price'), api.digitalPrice);
        const spec = host.querySelector('.ys-buy .spec'); if (spec) spec.textContent = DIGITAL_SPEC;
        const add = host.querySelector('[data-ys-add]'); if (add) add.textContent = `Add to cart · ${label}`;
        host.querySelector('[data-ys-quickadd]').textContent = `Add to cart · ${label}`;
        $('quickspec').textContent = 'Digital file · JPG + PDF';
        $('caption').textContent = captionFor(state, !!state.lat);
        return;
      }
      if (!api.variants) { optSummary('Printed poster'); $('caption').textContent = captionFor(state, !!state.lat); return; }
      const paper = ysPaper(state);
      host.querySelectorAll('[data-ys-size]').forEach(b => b.setAttribute('aria-checked', String(b.dataset.ysSize === ysSize(state))));
      host.querySelectorAll('[data-ys-sizeprice]').forEach(el => { el.textContent = euro(currentPrice({...state, size: el.dataset.ysSizeprice})); });
      $('papernote').textContent = paper.note;
      optSummary(`${ysSize(state)} · ${paper.name} · ${euro(currentPrice(state))}`);
      showPrice(host.querySelector('.product-title .price'), currentPrice(state));
      const spec = host.querySelector('.ys-buy .spec'); if (spec) spec.textContent = `Personalised print · ${ysSize(state)} · ${paper.name}`;
      const add = host.querySelector('[data-ys-add]'); if (add) add.textContent = `Add to cart · ${euro(currentPrice(state))}`;
      host.querySelector('[data-ys-quickadd]').textContent = `Add to cart · ${euro(currentPrice(state))}`;
      $('quickspec').textContent = `${ysSize(state)} · ${paper.name}`;
      $('caption').textContent = captionFor(state, !!state.lat);
    }
    host.querySelectorAll('[data-ys-size]').forEach(b => b.addEventListener('click', () => { state.size = b.dataset.ysSize; paintVariant(); }));
    function chooseFormat(format) {
      const previous = state.format || 'poster';
      if (format === previous || api.busy()) return;
      if (!ysDigital(state)) state.lastPrintFormat = previous;
      state.format = format;
      if (format === 'digital') api.track?.('digital');
      paintVariant();
      refreshButton();
    }
    host.querySelectorAll('[data-ys-format]').forEach(button => button.addEventListener('click', () => chooseFormat(button.dataset.ysFormat)));
    quickFormats.forEach(button => button.addEventListener('click', () => chooseFormat(button.dataset.ysQuickFormat === 'digital' ? 'digital' : 'poster')));
    $('paper').addEventListener('change', e => { state.paper = e.target.value; paintVariant(); });
    queueMicrotask(paintVariant);
    api.cancelPhotos?.();
    const ptitle = $('ptitle'), parea = $('parea'), pcoords = $('pcoords'), pline = $('pline');
    function paintWords() {
      ptitle.textContent = clean(state.title, L.title).toUpperCase().replaceAll('ẞ', 'SS'); parea.textContent = clean(state.area, L.area);
      pcoords.textContent = coordsText(Number(state.lat), Number(state.lon));
      const line = clean(state.line, L.line);
      pline.textContent = line || 'Same ground, same scale.'; pline.classList.toggle('ys-fallback', !line);
      $('wordstag').hidden = !!line;
      let size = titleSize(ptitle.textContent);
      ptitle.style.setProperty('--fs', size);
      const width = () => { try { return ptitle.getComputedTextLength(); } catch { return 0; } };
      while (size > 48 && width() > PHOTO.w) { size -= 4; ptitle.style.setProperty('--fs', size); }
    }
    const rawPhotos = new Map();
    function paintPhoto(layer) {
      const data = rawPhotos.get(layer); if (!data) return;
      const slot = $(layer === 'archive' ? 'photo-1928' : 'photo-today');
      let canvas = slot.querySelector('canvas'); if (!canvas) { canvas = document.createElement('canvas'); canvas.setAttribute('aria-hidden', 'true'); slot.querySelector('img').after(canvas); }
      canvas.width = data.width; canvas.height = data.height;
      canvas.getContext('2d').putImageData(new ImageData(gradePixels(data.data, PRINT_OPTIONS.themes[ysColour(state)], layer === 'archive'), data.width, data.height), 0, 0);
    }
    function capturePhoto(layer) {
      const img = $(layer === 'archive' ? 'photo-1928' : 'photo-today').querySelector('img'), c = document.createElement('canvas');
      c.width = img.naturalWidth; c.height = img.naturalHeight; const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0);
      rawPhotos.set(layer, ctx.getImageData(0, 0, c.width, c.height)); paintPhoto(layer);
    }
    function paintOptions() {
      const only = ysLayout(state) === '1928-only', t = PRINT_OPTIONS.themes[ysColour(state)], sheet = $('sheet');
      sheet.dataset.layout = ysLayout(state); sheet.dataset.colour = ysColour(state);
      for (const key of ['bg', 'main', 'ink', 'grey', 'key']) sheet.style.setProperty('--print-' + key, `rgb(${t[key].join(',')})`);
      host.querySelectorAll('[data-ys-layout]').forEach(b => b.setAttribute('aria-checked', String(b.dataset.ysLayout === ysLayout(state))));
      host.querySelectorAll('[data-ys-colour]').forEach(b => b.setAttribute('aria-checked', String(b.dataset.ysColour === ysColour(state))));
      $('colourname').textContent = optionNames(state).colour;
      const cap = host.querySelector('.ys-cap-1928'); cap.setAttribute('y', only ? TX.capToday : TX.capOld);
      $('photo-today').hidden = only; host.querySelector('.ys-cap-today').style.display = only ? 'none' : '';
      const cross = $('photo-1928').querySelector('.ys-ring'); cross.setAttribute('viewBox', only ? '0 -423 1400 1592' : '0 0 1400 746');
      for (const layer of rawPhotos.keys()) paintPhoto(layer);
      $('caption').textContent = captionFor(state, !!state.lat);
    }
    host.querySelectorAll('[data-ys-layout]').forEach(b => b.addEventListener('click', () => { if (state.layout === b.dataset.ysLayout) return; state.layout = b.dataset.ysLayout; api.track?.('layout-' + state.layout); paintOptions(); if (state.lat) showPoint(true); }));
    host.querySelectorAll('[data-ys-colour]').forEach(b => b.addEventListener('click', () => { if (state.colour === b.dataset.ysColour) return; state.colour = b.dataset.ysColour; api.track?.('colour-' + state.colour); paintOptions(); }));
    queueMicrotask(paintOptions);
    let fontsReady = null;
    const ensureFonts = () => {
      if (!fontsReady) fontsReady = (document.fonts?.load ? Promise.all([["400 118px 'DM Serif Display'", 'POTSDAMER PLATZ'], ["600 28px 'Space Grotesk'", '1979 TODAY'], ["300 40px 'Space Grotesk'", 'Berlin'], ["500 42px 'Space Grotesk'", 'Berlin'], ["400 30px 'IBM Plex Mono'", '52.5098° N, 13.3756° E']]
        .map(([face, text]) => document.fonts.load(face, text))).catch(() => []) : Promise.resolve([])).then(() => { if (host.isConnected && state.lat) paintWords(); });
      return fontsReady;
    };
    const status = $('status'), statusToday = $('status-today'), results = $('results'), note = $('searchnote'), input = $('q'), nocover = $('nocover');
    const setNote = (text, choose = false) => { if (text) note.textContent = text; else note.innerHTML = SEARCH_HINT_HTML; note.classList.toggle('ys-choose', !!text && choose); note.classList.toggle('ys-note-hint', !text); };
    const setStatus = text => { status.textContent = text; status.hidden = !text; };
    const setStatusToday = text => { statusToday.textContent = text; statusToday.hidden = !text; };
    // The message under the preview: the gate's reason in words, with the link to my 1928 print when the spot has no 1979 photo.
    const paintCover = () => {
      const blocked = oldPhotoBlocked(state), loading = state.cover === 'loading' && !!state.lat, failed = state.cover === 'error';
      nocover.hidden = !(blocked || failed || loading);
      nocover.dataset.state = state.cover || '';
      nocover.dataset.rec = state.rec ? state.rec.side : '';
      nocover.classList.toggle('is-blocked', (blocked && !state.rec) || failed);
      nocover.classList.toggle('ys-recommend', blocked && !!state.rec);
      // set the markup only when it changes: a press on the card button must never meet a freshly rebuilt button (this runs on every keystroke in the text fields too)
      const html = blocked && state.rec ? cardHtml(de, state.rec.side, toLink1928(de, state), api.price1928) : blocked ? noCoverHtml(de, de ? profile.page1928.de : profile.page1928.en)
        : failed ? escape(T().errorBlock) : loading ? escape(T().checking) : null;
      if (html !== null && nocover._html !== html) { nocover._html = html; nocover.innerHTML = html; }
      paintRec();
    };
    // While the 1928 photo stands in for the missing 1979 one, the sheet is a recommendation card, not the 1979 poster: band and corner tag on the picture, the print words
    // and the layout choice out of sight. Everything comes back exactly when a covered spot is picked (state.rec is null again then). Idempotent: runs on every refresh.
    const paintRec = () => {
      const on = recActive(state), r = T().recommend;
      $('sheet').toggleAttribute('data-rec', on);
      const band = $('recband'), tag = $('rectag');
      if (on && band.textContent !== r.band) band.textContent = r.band;
      if (on && tag.textContent !== r.tag) tag.textContent = r.tag;
      band.hidden = tag.hidden = !on;
      $('layoutrow').hidden = on;
      $('fields').toggleAttribute('data-rec', on);   // title, area and words cannot be printed for this spot: out of sight too
    };
    const refreshButton = () => {
      const ready = readyToCheck(state), off = !ready || api.busy() || state.cover !== 'ok';
      const b = host.getRootNode().querySelector?.('[data-ys-add]'); if (b) b.disabled = off;
      host.querySelector('[data-ys-quickadd]').disabled = off; $('quick').hidden = !state.lat;
      const why = host.getRootNode().querySelector?.('[data-ys-why]');
      if (why) why.textContent = recActive(state) ? '' : !ready ? (!state.lat ? (results.hidden ? 'Search for your address to continue.' : 'Tap one of the places under the search box.') : 'Fill in the title and area lines to continue.')
        : state.cover === 'blocked' ? T().whyBlocked : state.cover === 'error' ? T().whyError : state.cover === 'loading' ? T().whyChecking : '';
      paintCover();
    };
    api.refresh = refreshButton;
    const onOldPhoto = ({kind, share, alt}) => {
      state.cover = kind === 'ok' ? 'ok' : kind === 'error' ? 'error' : 'blocked';
      state.coverKind = kind; state.coverShare = share; state.seen = kind === 'ok';
      state.rec = state.cover === 'blocked' && alt ? {side: alt.side === 'east' ? 'east' : 'hole'} : null;   // the 1928 photo is on screen: show the card
      const capOld = host.querySelector('.ys-cap-1928'); if (capOld) capOld.textContent = state.rec ? '1928' : '1979';
      const img = $('photo-1928').querySelector('img'); if (img) img.alt = state.rec ? T().altRec : T().altOld;
      $('caption').textContent = captionFor(state, !!state.lat);
      api.track?.(kind === 'ok' ? 'seen' : kind === 'error' ? 'photoerror' : 'blank');
      refreshButton();
    };
    // The recommendation: the 1928 photo of the same box (same tiles folder layout, white = no photo) and the side of the Wall the spot was on. Null when the 1928
    // photo is not there either (then the page keeps its plain message).
    async function alternativeFrame(box) {
      const [sides, frame] = await Promise.all([loadSides().catch(() => null), loadFrame(box, {folder: '1928', noData: 'white'}).catch(() => null)]);
      if (!frame || frame.kind !== 'ok') return null;
      const side = sides ? classifySide(sides, state.lat, state.lon, utm33).side : 'other';
      return {frame, side, share: frame.share};
    }
    function showPoint(fresh) {
      if (!state.lat) return;
      $('sheet').hidden = false; $('example').hidden = true; $('fields').hidden = false;
      $('caption').textContent = captionFor(state, true);
      paintWords(); ensureFonts();
      api.cancelPhotos?.();
      const mine = state.token = (state.token || 0) + 1;
      const valid = () => state.token === mine && host.isConnected;
      const loaded = new Set(), only = ysLayout(state) === '1928-only', layers = only ? ['archive'] : ['archive', 'today'];
      rawPhotos.clear(); host.querySelectorAll('.ys-photo canvas').forEach(c => c.remove()); paintOptions();
      // The storefront re-renders (and remounts this form) around an add, with the same spot and layout: the verdict already given stands until the reload answers.
      const key = [state.lat, state.lon, ysLayout(state)].join('|'), keep = state.cover === 'ok' && state.coverKey === key;
      if (!keep) { state.cover = 'loading'; state.coverKind = ''; state.coverShare = null; state.seen = false; state.rec = null; const capOld = host.querySelector('.ys-cap-1928'); if (capOld) capOld.textContent = '1979'; }
      state.coverKey = key;
      const both = layer => {
        if (!valid()) return;
        capturePhoto(layer); loaded.add(layer);
        if (loaded.size === layers.length && state.cover === 'ok') api.track?.('preview');
      };
      const cancel = [loadOldPhoto({slot: $('photo-1928'), box: oldBox(state.lat, state.lon, only), valid, track: step => api.track?.(step), status: setStatus,
        text: T().photo, result: onOldPhoto, loaded: () => both('archive'), alternative: () => alternativeFrame(oldBox(state.lat, state.lon, only))})];
      if (!only) cancel.push(loadAerialPhoto({slot: $('photo-today'), url: urlToday(state.lat, state.lon), layer: 'today', valid, track: step => api.track?.(step), status: setStatusToday, loaded: () => both('today')}));
      api.cancelPhotos = () => cancel.forEach(stop => stop());
      refreshButton();
    }
    // ---- Search: Photon first, Nominatim when Photon fails or finds nothing (one request per second, contact email). ----
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
      results.innerHTML = rows.map((r, i) => { const [main, sub] = placeLines(r); return `<li role="option"><button type="button" class="ys-pick" data-ys-pick="${i}">${PIN}<span class="ys-pick-text"><strong>${escape(main)}</strong><small>${escape(sub)}</small></span><span class="ys-pick-go" aria-hidden="true">›</span></button></li>`; }).join('');
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
    // Tap either photo: pixel offset -> metres -> new point (both photos show the same ground box).
    for (const name of ['photo-1928', 'photo-today']) {
      $(name).addEventListener('click', event => {
        if (!state.lat) return;
        const box = $(name).querySelector('img').getBoundingClientRect(); if (!box.width || !box.height) return;
        const [lat, lon] = movePoint(state.lat, state.lon, (event.clientX - box.left) / box.width, (event.clientY - box.top) / box.height, name === 'photo-1928' && ysLayout(state) === '1928-only');
        if (!inBerlin(lat, lon)) return;
        state.lat = lat; state.lon = lon; showPoint(false);
      });
    }
    $('wordstag').addEventListener('click', () => { const field = host.querySelector('[data-ys="line"]'); field.scrollIntoView({behavior: 'smooth', block: 'center'}); field.focus({preventScroll: true}); });
    for (const name of ['title', 'area', 'line']) {
      host.querySelector(`[data-ys="${name}"]`).addEventListener('input', event => { state[name] = event.target.value; paintWords(); refreshButton(); });
    }
    // Add buttons. Both are disabled until the 1979 photo is verified; this guard also stops a stale click from reaching the storefront's handler.
    const realAdd = () => host.getRootNode().querySelector?.('[data-ys-add]');
    host.addEventListener('click', event => {
      const t = event.target.closest?.('[data-ys-quickadd], [data-ys-add], [data-ys-jump]'); if (!t) return;
      if (t.matches('[data-ys-jump]')) { if (!$('options').hidden) { $('options').open = true; state.optionsOpen = true; } $('fields').scrollIntoView({behavior: 'smooth', block: 'start'}); return; }
      if (!readyToAdd(state) || api.busy()) { event.stopPropagation(); return; }
      api.track?.('addtap');
      if (t.matches('[data-ys-quickadd]')) realAdd()?.click();
    });
    // The press on the card button is counted as its own funnel step. The store page takes over clicks on store links at the host (capture phase, to navigate with the exact
    // URL), so a listener inside the form would never run: this one sits on the window and runs first (mouse, touch and the Enter key all arrive as a click).
    const onCardClick = event => { if (event.composedPath().some(node => node?.matches?.('[data-ys-to1928]'))) api.track?.('ys79-to-1928'); };
    window.addEventListener('click', onCardClick, true);
    api.cleanup1979 = () => window.removeEventListener('click', onCardClick, true);
    if (state.lat) showPoint(false);
    refreshButton();
  }

  return Object.freeze({...base, YS_PRODUCT_ID: profile.posterId, YS_DIGITAL_ID: profile.digitalId, YS_FRAMED_ID: '', YS_CANVAS_ID: '', ysProductId, readyToAdd,
    ysMounted: () => false, recActive, optionNames, mountConfigurator, oldBox, captionFor, EMPTY_LIMIT, profile, textFor, isGerman, classifySide, spotFragment, loadSides});
}
