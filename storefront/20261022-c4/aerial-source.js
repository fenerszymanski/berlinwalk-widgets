// Aerial photos that survive a Geoportal outage (10 Nov 2026).
//
// Geoportal Berlin's WMS stays the first source and its URLs are unchanged. When it does not answer, the same frame is
// drawn from my own copy of the two layers (mirror tiles cut once from the same WMS; licence dl-de/zero-2.0), so the
// preview still appears. When the copy cannot help either, the visitor gets a plain message and the page keeps retrying
// Geoportal slowly while it stays open. Only fixed, aggregate step names leave the browser: no address, coordinates,
// URL, visitor ID or raw error text.
//
// Mirror layout: <base>/<1928|today>/<tx>/<ty>.jpg with tx = floor(E / 256), ty = floor(N / 256) in EPSG:25833 metres.
// Every tile is 512 x 512 px for 256 x 256 m (2 px per metre; the 720 px preview of 368 m needs 1.96), north up, cut on a
// fixed grid so a tile never changes. The copy is drawn into a canvas and handed to the page as a same-origin blob: URL,
// so the existing capture and colour grading (drawImage + getImageData) work on it exactly as on a Geoportal image.

export const MIRROR_GRID = Object.freeze({metres: 256, px: 512});
const MIRROR_DIR = Object.freeze({archive: '1928', today: 'today'});
const LAYERS = ['archive', 'today'];
// The mirror's public HTTPS base. null = no copy: the slower retries and the outage message still apply, the copy step is skipped.
const MIRROR_BASE_DEFAULT = 'https://tosi6dgkrksg1reh.public.blob.vercel-storage.com/aerial/v1';   // Vercel Blob store walkofberlin-aerial-mirror (fra1)
let mirrorRoot = MIRROR_BASE_DEFAULT;
const okBase = base => typeof base === 'string' && /^(https:\/\/[a-z0-9.-]+|http:\/\/(localhost|127\.0\.0\.1)(:\d+)?)(\/[A-Za-z0-9._~\/-]*)?$/.test(base);
export function setMirrorBase(base) { mirrorRoot = okBase(base) ? base.replace(/\/+$/, '') : null; return mirrorRoot; }
export const mirrorBase = () => mirrorRoot;

// ---- Geometry (pure) ------------------------------------------------------------------------------------------------
// The frame a Geoportal GetMap URL asks for. Only our own two layers in EPSG:25833 qualify for the copy.
export function layerOfWmsUrl(url) {
  const s = String(url || '');
  if (!s.startsWith('https://gdi.berlin.de/services/wms/')) return null;
  return /\/luftbild_1928_04\?/.test(s) ? 'archive' : /\/truedop_\d{4}\?/.test(s) ? 'today' : null;
}
export function boxFromWmsUrl(url) {
  let u; try { u = new URL(url); } catch { return null; }
  const p = k => u.searchParams.get(k);
  const [a, b, c, d] = String(p('BBOX') || '').split(',').map(Number), pw = Number(p('WIDTH')), ph = Number(p('HEIGHT'));
  if (p('CRS') !== 'EPSG:25833' || ![a, b, c, d, pw, ph].every(Number.isFinite) || c <= a || d <= b || pw < 1 || ph < 1) return null;
  return {cx: (a + c) / 2, cy: (b + d) / 2, w: c - a, h: d - b, pw, ph};
}
// Which tiles a frame needs and where the frame sits in their mosaic (north up, mosaic pixels).
export function mirrorPlan({cx, cy, w, h, pw, ph}, grid = MIRROR_GRID) {
  if (![cx, cy, w, h, pw, ph].every(Number.isFinite) || w <= 0 || h <= 0 || pw < 1 || ph < 1 || pw > 2048 || ph > 2048) throw new Error('MIRROR_BOX');
  const m = grid.metres, k = grid.px / m;
  const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - h / 2, y1 = cy + h / 2;
  const tx0 = Math.floor(x0 / m), tx1 = Math.ceil(x1 / m) - 1, ty0 = Math.floor(y0 / m), ty1 = Math.ceil(y1 / m) - 1;
  const cols = tx1 - tx0 + 1, rows = ty1 - ty0 + 1;
  if (cols < 1 || rows < 1 || cols * rows > 16) throw new Error('MIRROR_BOX');   // a preview needs 6 tiles at most (9 for "1928 only")
  const tiles = [];
  for (let ty = ty1; ty >= ty0; ty--) for (let tx = tx0; tx <= tx1; tx++) tiles.push({tx, ty, x: (tx - tx0) * grid.px, y: (ty1 - ty) * grid.px});
  return {cols, rows, width: cols * grid.px, height: rows * grid.px, tiles,
    crop: {sx: (x0 - tx0 * m) * k, sy: ((ty1 + 1) * m - y1) * k, sw: w * k, sh: h * k}, pw, ph};
}
export const tileUrl = (base, layer, tx, ty) => `${base}/${MIRROR_DIR[layer]}/${tx}/${ty}.jpg`;

// ---- Drawing the copy (browser) -------------------------------------------------------------------------------------
function plainImage(url, timeoutMs) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    const timer = setTimeout(() => { img.onload = img.onerror = null; img.removeAttribute('src'); reject(new Error('timeout')); }, timeoutMs);
    img.onload = () => { clearTimeout(timer); resolve(img); };
    img.onerror = () => { clearTimeout(timer); reject(new Error('loaderror')); };
    img.src = url;
  });
}
export async function mirrorCanvas({layer, cx, cy, w, h, pw, ph, base = mirrorRoot, timeoutMs = 12000}) {
  if (!base) throw new Error('MIRROR_OFF');
  if (!LAYERS.includes(layer)) throw new Error('Unknown aerial layer');
  const plan = mirrorPlan({cx, cy, w, h, pw, ph});
  const images = await Promise.all(plan.tiles.map(t => plainImage(tileUrl(base, layer, t.tx, t.ty), timeoutMs)));
  // Tiles first at their own size on whole pixels (no seams), then one resampling step to the frame.
  const mosaic = document.createElement('canvas');
  mosaic.width = plan.width; mosaic.height = plan.height;
  const m = mosaic.getContext('2d');
  plan.tiles.forEach((t, i) => m.drawImage(images[i], t.x, t.y, MIRROR_GRID.px, MIRROR_GRID.px));
  const out = document.createElement('canvas');
  out.width = pw; out.height = ph;
  const o = out.getContext('2d');
  o.imageSmoothingEnabled = true; o.imageSmoothingQuality = 'high';
  o.drawImage(mosaic, plan.crop.sx, plan.crop.sy, plan.crop.sw, plan.crop.sh, 0, 0, pw, ph);
  return out;
}
export async function mirrorObjectUrl(options) {
  const canvas = await mirrorCanvas(options);
  const blob = await new Promise((resolve, reject) => canvas.toBlob(b => (b ? resolve(b) : reject(new Error('MIRROR_ENCODE'))), 'image/png'));
  return URL.createObjectURL(blob);
}
// For pages that load a picture with new Image() (Homes, /street): Geoportal, then the copy, then Geoportal once more.
// Resolves with a loaded, CORS-clean image; rejects only when all three fail.
export async function loadAerialImage(url, {timeoutMs = 10000, retryTimeoutMs = 25000, track = () => {}} = {}) {
  const emit = step => { try { track(step); } catch {} };
  const layer = layerOfWmsUrl(url);
  try { return await plainImage(url, timeoutMs); } catch {}
  if (mirrorRoot && layer) {
    try {
      const objectUrl = await mirrorObjectUrl({layer, ...boxFromWmsUrl(url)});
      const img = await plainImage(objectUrl, 15000);
      emit(`photo${layer}mirror`);
      setTimeout(() => { try { URL.revokeObjectURL(objectUrl); } catch {} }, 120000);   // callers may copy img.src right away
      return img;
    } catch { emit(`photo${layer}mirrorfailed`); }
  }
  return plainImage(url, retryTimeoutMs);
}

// ---- The product page photo slots -----------------------------------------------------------------------------------
// After the outage message: quiet Geoportal retries while the page stays open, about 10 minutes in all.
export const RETRY_PLAN_MS = Object.freeze([10000, 20000, 30000, 60000, 60000, 120000, 120000, 180000]);
const LABEL = Object.freeze({archive: '1928', today: 'current'});
export const PHOTO_TEXT = Object.freeze({
  loading: layer => `Loading the ${LABEL[layer]} photo…`,
  retrying: layer => `Retrying the ${LABEL[layer]} photo…`,
  down: layer => `The ${LABEL[layer]} photo is not coming through: Berlin's aerial photo service is down right now. I keep trying here. You can also send this spot to your inbox and look again later.`,
  gaveUp: layer => `The ${LABEL[layer]} photo could not load: Berlin's aerial photo service is still down. Search for the place again later, or send this spot to your inbox.`,
});

// Drop-in for the live loadAerialPhoto (same arguments, same step names for the first two attempts). Order:
//   1. Geoportal (timeoutMs)                       first failure: photoerror | photoerrortoday, photo<layer><reason>
//   2. my copy, straight away (when there is one)  photo<layer>mirror, or photo<layer>mirrorfailed
//   3. Geoportal again after retryMs               photo<layer>recovered, or photo<layer><reason> + photo<layer>failed + message
//   4. quiet Geoportal retries on retryPlanMs      photo<layer>healed; no step per failed retry; paused while the tab is hidden
// Every attempt uses a fresh image node, so late events from a cancelled request cannot complete the next one.
export function loadAerialPhoto({slot, url, layer, valid = () => true, track = () => {}, status = () => {}, loaded = () => {},
  timeoutMs = 10000, mirrorTimeoutMs = 15000, retryMs = 1000, retryPlanMs = RETRY_PLAN_MS, fallback,
  later = setTimeout, clear = clearTimeout, online = () => globalThis.navigator?.onLine !== false,
  hidden = () => globalThis.document?.visibilityState === 'hidden'}) {
  if (!LAYERS.includes(layer)) throw new Error('Unknown aerial layer');
  if (fallback === undefined) {
    fallback = mirrorRoot && layerOfWmsUrl(url) === layer
      ? () => { const box = boxFromWmsUrl(url); return box ? mirrorObjectUrl({layer, ...box}) : Promise.reject(new Error('MIRROR_BOX')); }
      : null;
  }
  let cancelled = false, timer, image = null, objectUrl = null, quiet = 0;
  const active = () => !cancelled && valid();
  const emit = step => { try { track(step); } catch {} };   // measurement never blocks the preview
  const say = text => { try { status(text); } catch {} };
  const free = () => { if (objectUrl) { try { URL.revokeObjectURL(objectUrl); } catch {} objectUrl = null; } };
  const stopImage = () => { if (image) { image.onload = image.onerror = null; image.removeAttribute('src'); } };
  const reasonOf = reason => (reason === 'loaderror' || reason === 'timeout') && !online() ? 'offline' : reason;

  function attempt(kind) {
    if (!active()) return;
    clear(timer);
    if (kind === 'quiet' && hidden()) { timer = later(() => attempt('quiet'), 5000); return; }   // no network while hidden
    const previous = slot.querySelector('img');
    const img = image = previous.cloneNode(false);
    img.removeAttribute('src');
    previous.replaceWith(img);
    let settled = false;
    const done = reason => {
      if (settled || !active()) return;
      settled = true; clear(timer); img.onload = img.onerror = null;
      if (!reason) { succeed(kind); return; }
      stopImage();
      fail(kind, reason);
    };
    img.onload = () => done('');
    img.onerror = () => done('loaderror');   // an image error exposes no HTTP status
    timer = later(() => done('timeout'), kind === 'mirror' ? mirrorTimeoutMs : timeoutMs);
    if (kind === 'primary') say(PHOTO_TEXT.loading(layer));
    else if (kind === 'retry') say(PHOTO_TEXT.retrying(layer));
    img.crossOrigin = 'anonymous';
    if (kind !== 'mirror') { img.src = url; return; }
    Promise.resolve().then(fallback).then(next => {
      if (settled || !active()) { try { URL.revokeObjectURL(next); } catch {} return; }
      free(); objectUrl = next; img.src = next;
    }, () => done('mirrorerror'));
  }
  function succeed(kind) {
    say('');
    if (kind === 'mirror') emit(`photo${layer}mirror`);
    else if (kind === 'retry') emit(`photo${layer}recovered`);
    else if (kind === 'quiet') emit(`photo${layer}healed`);
    loaded();
  }
  function fail(kind, reason) {
    if (kind === 'primary') {
      emit(layer === 'archive' ? 'photoerror' : 'photoerrortoday');
      emit(`photo${layer}${reasonOf(reason)}`);
      if (fallback) { attempt('mirror'); return; }   // straight away: the copy does not depend on Geoportal
      say(PHOTO_TEXT.retrying(layer)); timer = later(() => attempt('retry'), retryMs); return;
    }
    if (kind === 'mirror') {
      emit(`photo${layer}mirrorfailed`);
      say(PHOTO_TEXT.retrying(layer)); timer = later(() => attempt('retry'), retryMs); return;
    }
    if (kind === 'retry') {
      emit(`photo${layer}${reasonOf(reason)}`);
      emit(`photo${layer}failed`);
      say(PHOTO_TEXT.down(layer));
      quiet = 0;
      if (retryPlanMs.length) timer = later(() => attempt('quiet'), retryPlanMs[0]);
      else say(PHOTO_TEXT.gaveUp(layer));
      return;
    }
    quiet += 1;   // a quiet retry failed: no counter step, try again later or stop
    if (quiet < retryPlanMs.length) timer = later(() => attempt('quiet'), retryPlanMs[quiet]);
    else say(PHOTO_TEXT.gaveUp(layer));
  }
  attempt('primary');
  return () => { cancelled = true; clear(timer); stopImage(); free(); };
}
