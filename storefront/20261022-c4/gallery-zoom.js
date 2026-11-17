// Product photo zoom (Yusuf, 17 Nov 2026: "bu ürün fotoğraflarında zoom opsiyonu yok").
// Desktop: hovering the main photo magnifies it under the cursor; a click opens the full-screen view.
// Phone: a tap opens the full-screen view; pinch, double tap or tap toggles zoom, one finger pans.
// The full-screen view is a native <dialog> (top layer), so Wix transforms around the element cannot clip it.
// It swaps in a larger file when one exists: the original behind a responsive LCP version, or the Wix product
// photo when it is verifiably the same picture.
const STAGE_IMG = '.gallery-stage>img';
const HOVER = () => matchMedia('(hover:hover) and (pointer:fine)').matches;

function largerSources(src) {
  try {
    const u = new URL(src);
    const m = u.pathname.match(/^(.*\/assets\/)lcp-\d{8}\/(.+?)(?:-thumb|-card)?(?:-\d{3,4})?\.webp$/);
    if (m) return [m[1] + m[2] + '.jpg', m[1] + m[2] + '.png'].map(p => new URL(p, u.origin).href).concat(src);
    if (/static\.wixstatic\.com$/.test(u.hostname)) {
      const id = u.pathname.match(/^\/media\/([^/]+)/);
      if (id) return ['https://static.wixstatic.com/media/' + id[1] + '/v1/fit/w_2400,h_2400,q_90/' + id[1], src];
    }
  } catch {}
  return [src];
}
function loadImage(src) {
  return new Promise(resolve => { const im = new Image(); im.crossOrigin = 'anonymous'; im.decoding = 'async'; im.onload = () => resolve(im); im.onerror = () => resolve(null); im.src = src; });
}
// A tiny grey thumbnail of a loaded image, or null when the canvas is tainted.
function signature(im) {
  try { const c = document.createElement('canvas'); c.width = 12; c.height = 16; const x = c.getContext('2d', {willReadFrequently: true}); x.drawImage(im, 0, 0, 12, 16); const d = x.getImageData(0, 0, 12, 16).data, out = []; for (let i = 0; i < d.length; i += 4) out.push(d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11); return out; } catch { return null; }
}
// The Wix product photo is often the same artwork at twice the size, but on some products it is a different
// picture (a mockup, a square crop). Use it only when ratio and a 12x16 thumbnail both match what is on screen.
// Wix catalogue media come as wix:image://v1/<file>/<name>#originWidth=..; the CDN serves the original at /media/<file>.
function wixMediaUrl(value) {
  const m = String(value || '').match(/^wix:image:\/\/v1\/([^/#]+)/);
  return m ? 'https://static.wixstatic.com/media/' + m[1] : /^https:\/\//.test(value || '') ? value : '';
}
async function bestSource(shownSrc, nativeSrc) {
  nativeSrc = wixMediaUrl(nativeSrc);
  const shown = await loadImage(shownSrc);
  const list = [...(nativeSrc ? [{src: nativeSrc, verify: true}] : []), ...largerSources(shownSrc).filter(s => s !== shownSrc).map(src => ({src, verify: false}))];
  for (const c of list) {
    const im = await loadImage(c.src);
    if (!im || !shown) continue;
    if (im.naturalWidth <= shown.naturalWidth * 1.15) continue;
    if (Math.abs(im.naturalWidth / im.naturalHeight - shown.naturalWidth / shown.naturalHeight) > 0.01) continue;
    if (c.verify) { const a = signature(im), b = signature(shown); if (!a || !b) continue; let diff = 0; for (let i = 0; i < a.length; i++) diff += Math.abs(a[i] - b[i]); if (diff / a.length > 14) continue; }
    return c.src;
  }
  return null;
}

const CSS = `
.gallery-stage>img.gz-ready{cursor:zoom-in}
.gallery-stage>img.gz-hover{transition:transform .08s linear}
.gz-dialog{position:fixed;inset:0;width:100vw;height:100dvh;max-width:none;max-height:none;margin:0;padding:0;border:0;background:#f4f3ee;overflow:hidden;color:var(--green,#123d18)}
.gz-dialog::backdrop{background:#123d18cc}
.gz-dialog .gz-frame{position:absolute;inset:0;overflow:hidden;touch-action:none;cursor:zoom-in;user-select:none;-webkit-user-select:none}
.gz-dialog.gz-zoomed .gz-frame{cursor:grab}
.gz-dialog .gz-frame img{position:absolute;left:0;top:0;transform-origin:0 0;max-width:none;max-height:none;-webkit-user-drag:none;will-change:transform}
.gz-dialog .gz-close{position:absolute;top:max(12px,env(safe-area-inset-top));right:12px;z-index:2;width:48px;height:48px;border-radius:50%;border:1px solid #aeb7a8;background:#fafaf5;font-size:28px;line-height:1;cursor:pointer;color:inherit}
.gz-dialog .gz-hint{position:absolute;left:50%;bottom:max(14px,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:2;margin:0;padding:6px 14px;border-radius:20px;background:#fafaf5e6;font-size:13px;white-space:nowrap;pointer-events:none;transition:opacity .2s}
.gz-dialog.gz-zoomed .gz-hint{opacity:0}
`;

export function installGalleryZoom(Store) {
  const P = Store.prototype;
  if (P.gzInstalled) return;
  P.gzInstalled = true;
  const oldRender = P.render;
  P.render = function () { const r = oldRender.apply(this, arguments); try { this.gzBind(); } catch {} return r; };

  P.gzText = function (en, de) { return this.campaignGerman?.() ? de : en; };

  P.gzBind = function () {
    const root = this.shadowRoot; if (!root) return;
    if (!root.querySelector('style[data-gz]')) { const s = document.createElement('style'); s.dataset.gz = '1'; s.textContent = CSS; root.append(s); }
    for (const img of root.querySelectorAll(STAGE_IMG)) {
      if (img.closest('.ys-gallery,[data-ys-host]') || img.classList.contains('gz-ready')) continue;
      img.classList.add('gz-ready');
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', this.gzText('Zoom the photo', 'Foto vergrößern'));
    }
    if (this.gzBound) return;
    this.gzBound = true;
    const target = e => e.target?.closest?.(STAGE_IMG + '.gz-ready');
    root.addEventListener('click', e => { const img = target(e); if (img) { e.preventDefault(); this.gzOpen(img); } });
    root.addEventListener('keydown', e => { const img = target(e); if (img && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); this.gzOpen(img); } });
    // Desktop hover magnifier inside the stage.
    root.addEventListener('mousemove', e => {
      const img = target(e); if (!img || !HOVER()) return;
      const r = img.getBoundingClientRect();
      img.classList.add('gz-hover');
      img.style.transformOrigin = ((e.clientX - r.left) / r.width * 100) + '% ' + ((e.clientY - r.top) / r.height * 100) + '%';
      img.style.transform = 'scale(2)';
    });
    root.addEventListener('mouseout', e => { const img = target(e); if (img && !img.contains(e.relatedTarget)) { img.style.transform = ''; img.classList.remove('gz-hover'); } });
  };

  P.gzOpen = async function (img) {
    img.style.transform = ''; img.classList.remove('gz-hover');
    this.measure?.('design2Step', 'photo-zoom');
    const root = this.shadowRoot;
    let dlg = root.querySelector('dialog.gz-dialog');
    if (!dlg) {
      dlg = document.createElement('dialog');
      dlg.className = 'gz-dialog';
      dlg.innerHTML = '<div class="gz-frame"><img alt=""></div><button type="button" class="gz-close"></button><p class="gz-hint"></p>';
      root.append(dlg);
      this.gzWire(dlg);
    }
    const big = dlg.querySelector('img');
    const token = (this.gzToken = (this.gzToken || 0) + 1);
    dlg.setAttribute('aria-label', img.alt || this.gzText('Product photo', 'Produktfoto'));
    dlg.querySelector('.gz-close').setAttribute('aria-label', this.gzText('Close', 'Schließen'));
    dlg.querySelector('.gz-close').textContent = '×';
    dlg.querySelector('.gz-hint').textContent = HOVER() ? this.gzText('Click or scroll to zoom · Esc to close', 'Klicken oder scrollen zum Zoomen · Esc schließt') : this.gzText('Pinch or double tap to zoom', 'Mit zwei Fingern oder Doppeltippen zoomen');
    big.alt = img.alt || '';
    big.src = img.currentSrc || img.src;
    if (!dlg.open) dlg.showModal();
    const fit = () => dlg.gzFit?.(big.naturalWidth || img.naturalWidth, big.naturalHeight || img.naturalHeight);
    if (big.complete) fit(); else big.onload = fit;
    const product = this.model?.products?.find(p => p.wixProductId === this.productViewId?.());
    const best = await bestSource(img.currentSrc || img.src, product?.nativeImageUrl || '');
    if (best && dlg.open && token === this.gzToken && best !== big.src) { const keep = dlg.gzState?.(); big.onload = () => { dlg.gzFit(big.naturalWidth, big.naturalHeight, keep); }; big.src = best; }
  };

  P.gzWire = function (dlg) {
    const frame = dlg.querySelector('.gz-frame'), big = frame.querySelector('img');
    let base = 1, s = 1, x = 0, y = 0, w = 1, h = 1;
    const pts = new Map(); let pinch = null, drag = null, moved = false, lastTap = 0;
    const apply = () => {
      const fw = frame.clientWidth, fh = frame.clientHeight, dw = w * s, dh = h * s;
      x = dw <= fw ? (fw - dw) / 2 : Math.min(0, Math.max(fw - dw, x));
      y = dh <= fh ? (fh - dh) / 2 : Math.min(0, Math.max(fh - dh, y));
      big.style.width = w + 'px'; big.style.height = h + 'px';
      big.style.transform = `translate(${x}px,${y}px) scale(${s})`;
      dlg.classList.toggle('gz-zoomed', s > base * 1.01);
    };
    const zoomAt = (ns, cx, cy) => {
      ns = Math.min(base * 5, Math.max(base, ns));
      x = cx - (cx - x) * ns / s; y = cy - (cy - y) * ns / s; s = ns; apply();
    };
    dlg.gzFit = (nw, nh, keep) => {
      if (!nw || !nh) return;
      const fw = frame.clientWidth, fh = frame.clientHeight;
      w = nw; h = nh; base = Math.min(fw / nw, fh / nh);
      if (keep) { const ratio = keep.w / nw; s = keep.s * ratio; base = Math.min(fw / nw, fh / nh); x = keep.x; y = keep.y; }
      else { s = base; x = 0; y = 0; }
      apply();
    };
    dlg.gzState = () => ({s, x, y, w});
    const local = e => { const r = frame.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    frame.addEventListener('pointerdown', e => {
      frame.setPointerCapture?.(e.pointerId); pts.set(e.pointerId, local(e)); moved = false;
      if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = {d: Math.hypot(a[0] - b[0], a[1] - b[1]), s}; drag = null; }
      else drag = {px: local(e)[0], py: local(e)[1], x, y};
    });
    frame.addEventListener('pointermove', e => {
      if (!pts.has(e.pointerId)) return;
      pts.set(e.pointerId, local(e));
      if (pinch && pts.size === 2) {
        const [a, b] = [...pts.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]);
        moved = true; zoomAt(pinch.s * d / pinch.d, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
      } else if (drag) {
        const [px, py] = local(e);
        if (Math.abs(px - drag.px) + Math.abs(py - drag.py) > 6) moved = true;
        if (s > base * 1.01) { x = drag.x + px - drag.px; y = drag.y + py - drag.py; apply(); }
      }
    });
    // Mouse: a click toggles 2.5x at the cursor. Touch: a double tap toggles it (a single tap
    // is left alone so it cannot fight a pinch or a pan).
    const up = e => {
      const had = pts.has(e.pointerId); pts.delete(e.pointerId);
      if (pts.size < 2) pinch = null;
      if (!pts.size) drag = null;
      if (!had || pts.size || moved || e.type === 'pointercancel') return;
      const [cx, cy] = local(e);
      if (e.pointerType === 'touch') { const now = Date.now(); if (now - lastTap > 300) { lastTap = now; return; } lastTap = 0; }
      if (s > base * 1.01) { s = base; apply(); } else zoomAt(base * 2.5, cx, cy);
    };
    frame.addEventListener('pointerup', up);
    frame.addEventListener('pointercancel', up);
    frame.addEventListener('wheel', e => { e.preventDefault(); const [cx, cy] = local(e); zoomAt(s * Math.exp(-e.deltaY * 0.0015), cx, cy); }, {passive: false});
    dlg.querySelector('.gz-close').addEventListener('click', () => dlg.close());
    dlg.addEventListener('close', () => { big.removeAttribute('src'); pts.clear(); pinch = drag = null; });
    addEventListener('resize', () => { if (dlg.open) dlg.gzFit(w, h); });
  };
}
