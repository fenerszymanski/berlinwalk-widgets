// Berlin street sign: in-browser drawing with the same geometry as content/products/berlin-sign/make_sign.py.
// All layout runs in print pixels (300 ppi, trim 457.2 x 304.8 mm = 5400 x 3600 px, 1 unit U = 1 % of the trim width = 54 px)
// with the generator's own sizes and shrink steps, then the canvas is scaled down. Text is measured with Wobby in the browser;
// the generator measures with its kern table, so the page refuses 0.5 % earlier (SAFETY) than the print would.
export const PRINT_W = 5400, PRINT_H = 3600, U = PRINT_W / 100;
const SAFETY = 0.995;   // 27 Nov 2026: 600 random names and corner pairs gave the same sizes in the browser and in make_sign.py
const INK = '#111111';
export const FONT = 'Wobby';
const font = px => `400 ${px}px ${FONT}`;

let measurer;
function measure(text, px) {
  measurer ||= document.createElement('canvas').getContext('2d');
  measurer.font = font(px);
  return measurer.measureText(text).width;
}
const ARROW_W = 7.5 * U, GAP = 1.5 * U;
const cornerWidth = (c, px) => (c.text ? measure(c.text, px) : 0) + (c.arrow !== 'none' ? ARROW_W + (c.text ? GAP : 0) : 0);

// Sizes like make_sign.render(); errors: name / corners too long for the sign.
export function signLayout(f, strict = true) {
  const k = strict ? SAFETY : 1, m = 3 * U;
  const top = [m, m, 100 * U - m, m + 36 * U], bot = [m, 42 * U, 100 * U - m, PRINT_H - m], boxW = top[2] - top[0];
  const small = Math.round(3.6 * U), errors = [];
  let cs = small;
  const cornerMax = boxW - 8 * U - 4 * U;
  while (cornerWidth(f.left, cs) + cornerWidth(f.right, cs) > cornerMax * k && cs > 2.6 * U) cs -= 2;
  if (cornerWidth(f.left, cs) + cornerWidth(f.right, cs) > cornerMax * k) errors.push('corners');
  const maxW = boxW * 0.9;
  let size = Math.round(12.5 * U);
  while (measure(f.name, size) > maxW * k && size > 8 * U) size -= 4;
  if (measure(f.name, size) > maxW * k) errors.push('name');
  let cap = Math.round(3.5 * U);
  for (const line of f.caption) while (measure(line, cap) > (bot[2] - bot[0] - 6 * U) * k && cap > 2.6 * U) cap -= 2;
  if (f.caption.some(line => measure(line, cap) > (bot[2] - bot[0] - 6 * U) * k)) errors.push('caption');
  return {top, bot, small, cs, size, cap, errors, nameUnits: size / U};
}

function arrow(ctx, x, y, dir) {
  const shaft = 5.5 * U, head = 2 * U, half = 1.35 * U, th = 0.6 * U;
  // Shaft and head are filled one by one: in one path the left head (drawn the other way round) would cancel the overlap.
  const tri = (a, b, c) => { ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.lineTo(...c); ctx.closePath(); ctx.fill(); };
  if (dir === 'right') { ctx.fillRect(x, y - th / 2, shaft, th); tri([x + shaft - 0.3 * U, y - half], [x + shaft - 0.3 * U + head, y], [x + shaft - 0.3 * U, y + half]); }
  else { tri([x + head + 0.3 * U, y - half], [x + 0.3 * U, y], [x + head + 0.3 * U, y + half]); ctx.fillRect(x + head, y - th / 2, shaft, th); }
}
// PIL anchor "lm": y is halfway between the font's ascender and descender.
function text(ctx, s, x, y, px) {
  ctx.font = font(px);
  const mt = ctx.measureText(s), asc = mt.fontBoundingBoxAscent ?? px * 0.8, desc = mt.fontBoundingBoxDescent ?? px * 0.2;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y + (asc - desc) / 2);
}
function corner(ctx, c, x, y, px, align) {
  if (!c.text && c.arrow === 'none') return;
  let x0 = align === 'left' ? x : x - cornerWidth(c, px);
  if (c.arrow === 'left') { arrow(ctx, x0, y, 'left'); x0 += ARROW_W + GAP; }
  if (c.text) { text(ctx, c.text, x0, y, px); x0 += measure(c.text, px) + GAP; }
  if (c.arrow === 'right') arrow(ctx, x0, y, 'right');
}
function box(ctx, b, r, bw) {
  ctx.beginPath(); ctx.lineWidth = bw;
  ctx.roundRect(b[0] + bw / 2, b[1] + bw / 2, b[2] - b[0] - bw, b[3] - b[1] - bw, Math.max(0, r - bw / 2));
  ctx.stroke();
}
// Draws the trimmed sign (no bleed) into ctx with its top left at (x, y) and the given width in canvas pixels.
export function drawSign(ctx, f, x, y, width, {exampleName = false} = {}) {
  const L = signLayout(f, false), s = width / PRINT_W;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#fdfdfb'; ctx.fillRect(0, 0, PRINT_W, PRINT_H);
  ctx.fillStyle = INK; ctx.strokeStyle = INK;
  const bw = Math.round(U), r = Math.round(1.3 * U);
  box(ctx, L.top, r, bw);
  if (f.caption.length) box(ctx, L.bot, r, bw);
  if (f.ortsteil) text(ctx, `Ortsteil ${f.ortsteil}`, L.top[0] + 4 * U, L.top[1] + 3 * U + L.small / 2, L.small);
  const mid = L.top[3] - 3 * U - L.small / 2;
  corner(ctx, f.left, L.top[0] + 4 * U, mid, L.cs, 'left');
  corner(ctx, f.right, L.top[2] - 4 * U, mid, L.cs, 'right');
  const hasCorners = f.left.text || f.right.text || f.left.arrow !== 'none' || f.right.arrow !== 'none';
  let cy = (L.top[1] + L.top[3]) / 2 + 0.6 * U;
  if (f.ortsteil && !hasCorners) cy += 1.5 * U;
  if (exampleName) ctx.fillStyle = '#9a978e';
  text(ctx, f.name, (L.top[0] + L.top[2]) / 2 - measure(f.name, L.size) / 2, cy, L.size);
  ctx.fillStyle = INK;
  if (f.caption.length) {
    const lh = L.cap * 1.34, y0 = (L.bot[1] + L.bot[3]) / 2 - lh * (f.caption.length - 1) / 2;
    f.caption.forEach((line, i) => text(ctx, line, (L.bot[0] + L.bot[2]) / 2 - measure(line, L.cap) / 2, y0 + i * lh, L.cap));
  }
  ctx.restore();
  return L;
}

// A plain painted wall (drawn, not a photo): warm plaster, soft light from the top left, a white skirting board. The sign gets
// a thin light edge and a faint sheen (3 mm aluminium), and the wall view carries its real size as a dimension line.
function wall(ctx, w, h) {
  const g = ctx.createLinearGradient(0, 0, w * 0.4, h);
  g.addColorStop(0, '#ece7dd'); g.addColorStop(1, '#d6cdbd');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  const light = ctx.createRadialGradient(w * 0.3, -h * 0.15, 10, w * 0.3, -h * 0.15, w * 0.9);
  light.addColorStop(0, 'rgba(255,252,244,.6)'); light.addColorStop(1, 'rgba(255,252,244,0)');
  ctx.fillStyle = light; ctx.fillRect(0, 0, w, h);
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  ctx.fillStyle = 'rgba(80,66,40,.035)';
  for (let i = 0; i < 2600; i++) ctx.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2, 1 + rnd() * 2);
  const sk = h * 0.07;
  const floor = ctx.createLinearGradient(0, h - sk * 1.6, 0, h);
  floor.addColorStop(0, 'rgba(60,45,25,0)'); floor.addColorStop(1, 'rgba(60,45,25,.10)');
  ctx.fillStyle = floor; ctx.fillRect(0, h - sk * 1.6, w, sk * 1.6);
  ctx.fillStyle = '#f4f1ea'; ctx.fillRect(0, h - sk, w, sk);
  ctx.fillStyle = 'rgba(60,50,30,.2)'; ctx.fillRect(0, h - sk, w, 2);
  ctx.fillStyle = '#a88c69'; ctx.fillRect(0, h - sk * 0.16, w, sk * 0.16);
}
// The panel with its 3 mm edge: a lit grey side to the right and below (seen slightly from the left and above).
function panel(ctx, x, y, sw, sh, shadow) {
  const d = Math.max(2, sw * 0.0066);
  ctx.save();
  ctx.shadowColor = `rgba(40,30,15,${shadow})`; ctx.shadowBlur = sw * 0.045; ctx.shadowOffsetX = sw * 0.01; ctx.shadowOffsetY = sw * 0.028;
  ctx.fillStyle = '#9d9d96'; ctx.fillRect(x, y, sw + d, sh + d);
  ctx.restore();
  const side = ctx.createLinearGradient(x + sw, 0, x + sw + d, 0);
  side.addColorStop(0, '#d9d9d3'); side.addColorStop(1, '#a4a49d');
  ctx.fillStyle = side; ctx.beginPath(); ctx.moveTo(x + sw, y); ctx.lineTo(x + sw + d, y + d); ctx.lineTo(x + sw + d, y + sh + d); ctx.lineTo(x + sw, y + sh); ctx.fill();
  const bottom = ctx.createLinearGradient(0, y + sh, 0, y + sh + d);
  bottom.addColorStop(0, '#cfcfc9'); bottom.addColorStop(1, '#9a9a93');
  ctx.fillStyle = bottom; ctx.beginPath(); ctx.moveTo(x, y + sh); ctx.lineTo(x + sw, y + sh); ctx.lineTo(x + sw + d, y + sh + d); ctx.lineTo(x + d, y + sh + d); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.fillRect(x, y, sw, sh);
}
function sheen(ctx, x, y, sw, sh) {
  const g = ctx.createLinearGradient(x, y, x + sw, y + sh);
  g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.42, 'rgba(255,255,255,.16)'); g.addColorStop(0.5, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(120,120,110,.05)');
  ctx.fillStyle = g; ctx.fillRect(x, y, sw, sh);
  ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, sw - 1, sh - 1);
}
function dimension(ctx, x0, y0, x1, y1, label, px) {
  const vertical = x0 === x1, t = px * 0.45, mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
  ctx.save(); ctx.strokeStyle = 'rgba(43,49,40,.55)'; ctx.lineWidth = Math.max(1, px * 0.08);
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
  if (vertical) { ctx.moveTo(x0 - t, y0); ctx.lineTo(x0 + t, y0); ctx.moveTo(x1 - t, y1); ctx.lineTo(x1 + t, y1); }
  else { ctx.moveTo(x0, y0 - t); ctx.lineTo(x0, y0 + t); ctx.moveTo(x1, y1 - t); ctx.lineTo(x1, y1 + t); }
  ctx.stroke();
  ctx.font = `500 ${px}px "Space Grotesk", sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = 'rgba(43,49,40,.85)';
  if (vertical) { ctx.translate(mx + px * 0.95, my); ctx.rotate(Math.PI / 2); ctx.fillText(label, 0, 0); }
  else ctx.fillText(label, mx, my + px * 0.95);
  ctx.restore();
}
// view 'wall': the sign on a wall with its size; 'close' / 'mini': the sign alone, as large as the canvas allows.
export function drawScene(canvas, f, {view = 'wall', exampleName = false, labels = ['45.7 cm', '30.5 cm']} = {}) {
  const ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  if (view === 'close' || view === 'mini') {
    ctx.fillStyle = '#ebe7de'; ctx.fillRect(0, 0, w, h);
    const fillTo = view === 'mini' ? 0.95 : 0.94, sw = Math.min(w * fillTo, h * fillTo * PRINT_W / PRINT_H), sh = sw * PRINT_H / PRINT_W, x = (w - sw) / 2 - sw * 0.003, y = (h - sh) / 2 - sw * 0.003;
    panel(ctx, x, y, sw, sh, 0.26);
    const L = drawSign(ctx, f, x, y, sw, {exampleName});
    sheen(ctx, x, y, sw, sh);
    return L;
  }
  wall(ctx, w, h);
  const sw = w * 0.64, sh = sw * PRINT_H / PRINT_W, x = (w - sw) / 2, y = h * 0.13;
  panel(ctx, x, y, sw, sh, 0.36);
  const L = drawSign(ctx, f, x, y, sw, {exampleName});
  sheen(ctx, x, y, sw, sh);
  const px = Math.round(w * 0.019), gap = w * 0.025;
  dimension(ctx, x, y + sh + gap, x + sw, y + sh + gap, labels[0], px);
  dimension(ctx, x + sw + gap, y, x + sw + gap, y + sh, labels[1], px);
  return L;
}
