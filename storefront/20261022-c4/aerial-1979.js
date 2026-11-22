// The old photo of "Your West Berlin Street in 1979": the May 1979 aerial survey, flown over West Berlin; along the Wall it also caught a strip of East Berlin (22 Nov 2026).
//
// There is no Geoportal WMS for this survey, so the photo is always drawn from my own tile copy: the same public mirror, the same
// 256 m / 512 px grid and the same north-up orientation as the 1928 and today layers (folder 1979, EPSG:25833). Licence of the
// photographs: Geoportal Berlin, Datenlizenz Deutschland Zero 2.0.
//   HTTP 404 on a tile    = no 1979 photo on that 256 m square (East Berlin beyond the strip along the Wall, outside the survey, a gap).
//   tile value 0 (black)  = no data inside a partly covered tile (the survey edge). The print generator treats exactly 0 as no data; the
//                           browser allows JPEG noise up to NO_DATA_MAX. No-data pixels are drawn white and photo pixels never get brighter
//                           than PHOTO_CAP, exactly like content/products/your-street-1979/generator/src1979.py, so "white" means "no photo".
// Coverage gate (Yusuf's rule, same as the 1928 calendar check): when the box needs any tile that is missing, or more than 2 % of its
// rendered pixels are empty (all channels >= 250, or transparent), there is no printable 1979 photo and the buy buttons stay off.
import {mirrorPlan, mirrorBase, RETRY_PLAN_MS} from './aerial-source.js';

export const NO_DATA_MAX = 2;
export const PHOTO_CAP = 248;
export const EMPTY_LIMIT = 0.02;
export const TILE_PX = 512;
export const tileUrl = (base, folder, tx, ty) => `${base}/${folder}/${tx}/${ty}.jpg`;
export const tileUrl1979 = (base, tx, ty) => tileUrl(base, '1979', tx, ty);

// One empty-pixel rule for the whole store: transparent, or white in all three channels.
export const isEmptyPixel = (r, g, b, a) => a < 10 || (r >= 250 && g >= 250 && b >= 250);
export function emptyShare(rgba) {
  let n = 0;
  for (let i = 0; i < rgba.length; i += 4) if (isEmptyPixel(rgba[i], rgba[i + 1], rgba[i + 2], rgba[i + 3])) n++;
  return rgba.length ? n / (rgba.length / 4) : 1;
}

// Pure: draw the frame `plan` (from mirrorPlan) out of decoded tiles. tiles = [{tx, ty, gray: Uint8Array(512 * 512) | null}], gray null =
// missing tile (all no data). Bilinear sampling of the mosaic, no-data mask by nearest pixel (so a photo edge never turns the sea of
// white into grey), then white for no data and PHOTO_CAP for photo. Returns {rgba, share}; share is measured on the rendered pixels.
export function composeFromGray({plan, tiles, pw, ph, noData = 'black'}) {
  const isNoData = noData === 'white' ? v => v >= 250 : v => v <= NO_DATA_MAX;
  const W = plan.width, H = plan.height, mosaic = new Uint8Array(W * H);
  const byKey = new Map(tiles.map(t => [t.tx + '/' + t.ty, t]));
  for (const slot of plan.tiles) {
    const gray = byKey.get(slot.tx + '/' + slot.ty)?.gray;
    if (!gray) continue;
    for (let y = 0; y < TILE_PX; y++) mosaic.set(gray.subarray(y * TILE_PX, (y + 1) * TILE_PX), (slot.y + y) * W + slot.x);
  }
  const {sx, sy, sw, sh} = plan.crop, rgba = new Uint8ClampedArray(pw * ph * 4);
  const at = (x, y) => mosaic[Math.max(0, Math.min(H - 1, y)) * W + Math.max(0, Math.min(W - 1, x))];
  for (let oy = 0; oy < ph; oy++) {
    const v = sy + (oy + 0.5) * sh / ph - 0.5, v0 = Math.floor(v), fv = v - v0;
    for (let ox = 0; ox < pw; ox++) {
      const u = sx + (ox + 0.5) * sw / pw - 0.5, u0 = Math.floor(u), fu = u - u0, p = (oy * pw + ox) * 4;
      const nearest = at(Math.round(u), Math.round(v));
      let value = 255;
      if (!isNoData(nearest)) {
        const top = at(u0, v0) * (1 - fu) + at(u0 + 1, v0) * fu, bottom = at(u0, v0 + 1) * (1 - fu) + at(u0 + 1, v0 + 1) * fu;
        value = Math.min(PHOTO_CAP, Math.round(top * (1 - fv) + bottom * fv));
      }
      rgba[p] = rgba[p + 1] = rgba[p + 2] = value; rgba[p + 3] = 255;
    }
  }
  return {rgba, share: emptyShare(rgba)};
}

// The verdict for one frame. missing = tile paths that answered 404 (the gate shuts for any of them, whatever the pixels say).
export const verdict = ({missing = [], share}) => missing.length ? 'missing' : share > EMPTY_LIMIT ? 'empty' : 'ok';

// ---- Browser glue ----------------------------------------------------------------------------------------------------------------
export class TileError extends Error {}
async function fetchTile(url, {fetchImpl, timeoutMs}) {
  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  const timer = controller && setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(url, {mode: 'cors', credentials: 'omit', signal: controller?.signal});
    if (response.status === 404) return null;
    if (!response.ok) throw new TileError('HTTP ' + response.status);
    return await response.blob();
  } catch (error) {
    throw error instanceof TileError ? error : new TileError(error?.name === 'AbortError' ? 'timeout' : 'network');
  } finally { if (timer) clearTimeout(timer); }
}
// JPEG blob -> 512 x 512 grey values (the red channel of the decoded tile; the tiles are single-channel JPEGs).
export async function decodeGray(blob) {
  const bitmap = await createImageBitmap(blob, {colorSpaceConversion: 'none'}).catch(() => createImageBitmap(blob));
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = TILE_PX;
  const context = canvas.getContext('2d', {willReadFrequently: true});
  context.drawImage(bitmap, 0, 0, TILE_PX, TILE_PX);
  bitmap.close?.();
  const {data} = context.getImageData(0, 0, TILE_PX, TILE_PX), gray = new Uint8Array(TILE_PX * TILE_PX);
  for (let i = 0; i < gray.length; i++) gray[i] = data[i * 4];
  return gray;
}
// One frame: fetch its tiles in parallel, compose, judge. Throws TileError when a tile fails for any reason except a plain 404.
export async function loadFrame(box, {base = mirrorBase(), folder = '1979', noData = 'black', fetchImpl = globalThis.fetch.bind(globalThis), decode = decodeGray, timeoutMs = 12000} = {}) {
  if (!base) throw new TileError('MIRROR_OFF');
  const plan = mirrorPlan(box), missing = [];
  const tiles = await Promise.all(plan.tiles.map(async slot => {
    const blob = await fetchTile(tileUrl(base, folder, slot.tx, slot.ty), {fetchImpl, timeoutMs});
    if (!blob) { missing.push(`${slot.tx}/${slot.ty}`); return {tx: slot.tx, ty: slot.ty, gray: null}; }
    return {tx: slot.tx, ty: slot.ty, gray: await decode(blob)};
  }));
  const out = composeFromGray({plan, tiles, pw: box.pw, ph: box.ph, noData});
  return {...out, missing, tiles: plan.tiles.length, width: box.pw, height: box.ph, kind: verdict({missing, share: out.share})};
}
const toObjectUrl = ({rgba, width, height}) => new Promise((resolve, reject) => {
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  canvas.getContext('2d').putImageData(new ImageData(rgba, width, height), 0, 0);
  canvas.toBlob(blob => blob ? resolve(URL.createObjectURL(blob)) : reject(new Error('ENCODE')), 'image/png');
});

// Same shape as aerial-source.js loadAerialPhoto: draws into the slot's <img> (a blob: URL of the rendered frame, so the page's capture and colour
// grading read it like any other photo), reports through status(). Differences: no Geoportal step, and `result({kind, share, missing})` always
// runs before `loaded()` so the page knows whether the frame may be sold. Network errors retry after retryMs, then on RETRY_PLAN_MS while the page
// stays open; a plain 404 is final. Returns a cancel function.
export function loadOldPhoto({slot, box, valid = () => true, track = () => {}, status = () => {}, result = () => {}, loaded = () => {}, alternative, text,
  retryMs = 1000, retryPlanMs = RETRY_PLAN_MS, load = loadFrame, later = setTimeout, clear = clearTimeout, online = () => globalThis.navigator?.onLine !== false}) {
  let cancelled = false, timer, objectUrl = null, quiet = -1, image = null;
  const active = () => !cancelled && valid();
  const emit = step => { try { track(step); } catch {} };
  const say = message => { try { status(message); } catch {} };
  const free = () => { if (objectUrl) { try { URL.revokeObjectURL(objectUrl); } catch {} objectUrl = null; } };
  function show(frame, alt) {
    // A frame that fails the gate is never shown as a half photo. When `alternative` brought a frame (the 1928 photo of the same box, for the recommendation card)
    // that one is drawn; otherwise the blank placeholder, the same for a missing tile and for a survey edge, so the picture agrees with the message.
    // Tapping the picture still moves the cross.
    const verdictFrame = frame;
    if (frame.kind !== 'ok') frame = alt?.frame ? {...alt.frame, kind: 'ok'} : {...frame, rgba: new Uint8ClampedArray(frame.rgba.length).fill(255)};
    return toObjectUrl(frame).then(url => {
      if (!active()) { URL.revokeObjectURL(url); return; }
      free(); objectUrl = url;
      const previous = slot.querySelector('img');
      const img = image = previous.cloneNode(false);
      img.removeAttribute('src'); previous.replaceWith(img);
      img.onload = () => { img.onload = img.onerror = null; if (!active()) return; say(''); result({kind: verdictFrame.kind, share: verdictFrame.share, missing: verdictFrame.missing, alt: alt ? {side: alt.side, share: alt.share} : null}); loaded(); };
      img.onerror = () => { img.onload = img.onerror = null; if (active()) fail('loaderror'); };
      img.crossOrigin = 'anonymous'; img.src = url;
    }, () => { if (active()) fail('encode'); });
  }
  function fail(reason) {
    emit('photo1979' + (reason === 'timeout' || reason === 'network' ? (online() ? reason : 'offline') : reason));
    if (quiet < 0) { quiet = 0; say(text.retrying); timer = later(attempt, retryMs); return; }
    if (quiet === 0) { emit('photo1979failed'); say(text.down); }
    quiet += 1;
    if (quiet <= retryPlanMs.length) timer = later(attempt, retryPlanMs[quiet - 1]);
    else { say(text.gaveUp); result({kind: 'error', share: null, missing: []}); }
  }
  function attempt() {
    if (!active()) return;
    if (quiet > 0 && globalThis.document?.visibilityState === 'hidden') { timer = later(attempt, 5000); return; }
    if (quiet < 0) say(text.loading);
    Promise.resolve().then(() => load(box)).then(async frame => {
      if (!active()) return;
      let alt = null;
      if (frame.kind !== 'ok' && alternative) { try { alt = await alternative(frame); } catch { alt = null; } if (!active()) return; }
      show(frame, alt);
    }, error => { if (active()) fail(error?.message || 'error'); });
  }
  attempt();
  return () => { cancelled = true; clear(timer); free(); if (image) image.onload = image.onerror = null; };
}
