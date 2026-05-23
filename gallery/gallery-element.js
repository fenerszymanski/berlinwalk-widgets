const BW_GALLERY_DATA_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/gallery/data.json';
const BW_GALLERY_IMAGE_BASE = 'https://fenerszymanski.github.io/berlinwalk-widgets/gallery/images';

class BWGalleryElement extends HTMLElement {
  constructor() {
    super();
    this._animated = false;
    this._observer = null;
    this._lightboxOpen = false;
    this._lightboxIndex = 0;
    this._photos = [];
    this._lastFocus = null;
    this._touchStartX = 0;
    this._controller = null;
    this._previousBodyOverflow = '';
  }

  connectedCallback() {
    this._controller = new AbortController();
    this._renderShell();
    this._setupInteractions();
    this._loadDataAndRender();
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
    if (this._controller) this._controller.abort();
    if (this._lightboxOpen) this._closeLightbox(false);
  }

  _renderShell() {
    this.innerHTML = `
      <style>
        bw-gallery {
          display: block;
          width: 100%;
        }

        .bw-gallery {
          background: #FFFFFF;
          color: #212121;
          font-family: Montserrat, Arial, sans-serif;
          margin: 0;
          max-width: 100%;
          overflow-x: hidden;
          padding: 64px 24px;
        }

        .bw-gallery *,
        .bw-gallery *::before,
        .bw-gallery *::after {
          box-sizing: border-box;
        }

        .bw-gallery h2,
        .bw-gallery p {
          margin-top: 0;
        }

        .bw-gallery .bw-gallery-inner {
          margin: 0 auto;
          max-width: 1280px;
        }

        .bw-gallery .bw-gallery-header {
          max-width: 840px;
        }

        .bw-gallery .bw-gallery-eyebrow {
          color: #1B5E20;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.4px;
          line-height: 1.35;
          margin: 0;
          text-transform: uppercase;
        }

        .bw-gallery .bw-gallery-title {
          color: #1B5E20;
          font-size: 42px;
          font-weight: 800;
          letter-spacing: 0;
          line-height: 1.12;
          margin: 12px 0 0;
        }

        .bw-gallery .bw-gallery-lead {
          color: #4E5A4E;
          font-family: Merriweather, Georgia, serif;
          font-size: 16px;
          font-style: italic;
          line-height: 1.65;
          margin: 14px 0 0;
          max-width: 620px;
        }

        .bw-gallery .bw-gallery-grid {
          display: grid;
          gap: 12px;
          grid-template-areas:
            "a a b c d d"
            "a a e e f f"
            "g g e e i i"
            "h h h h i i";
          grid-template-columns: repeat(6, minmax(0, 1fr));
          grid-template-rows: repeat(4, minmax(150px, 1fr));
          margin-top: 36px;
          min-height: 820px;
        }

        .bw-gallery .bw-tile {
          appearance: none;
          background: #FFFFFF;
          border: 0;
          border-radius: 8px;
          box-shadow: 0 4px 18px rgba(27, 94, 32, 0.08);
          cursor: pointer;
          display: block;
          min-height: 0;
          opacity: 0;
          overflow: hidden;
          padding: 0;
          position: relative;
          text-align: left;
          transform: translateY(18px);
          transition: box-shadow 220ms ease, opacity 420ms ease, transform 420ms ease;
          width: 100%;
        }

        .bw-gallery .bw-tile.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .bw-gallery .bw-tile:focus-visible {
          outline: 3px solid #FFE600;
          outline-offset: 3px;
        }

        .bw-gallery .bw-tile picture,
        .bw-gallery .bw-tile img {
          display: block;
          height: 100%;
          width: 100%;
        }

        .bw-gallery .bw-tile img {
          object-fit: cover;
          transform: scale(1);
          transition: filter 260ms ease, transform 260ms ease;
        }

        .bw-gallery .bw-tile:hover,
        .bw-gallery .bw-tile:focus-visible {
          box-shadow: 0 10px 30px rgba(27, 94, 32, 0.16);
        }

        .bw-gallery .bw-tile:hover img,
        .bw-gallery .bw-tile:focus-visible img {
          filter: brightness(1.05);
          transform: scale(1.04);
        }

        .bw-gallery .bw-caption {
          background: linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.68));
          bottom: 0;
          color: #FFFFFF;
          display: block;
          font-size: 13px;
          font-weight: 700;
          left: 0;
          line-height: 1.35;
          opacity: 0;
          padding: 42px 16px 14px;
          position: absolute;
          right: 0;
          text-shadow: 0 1px 8px rgba(0, 0, 0, 0.28);
          transform: translateY(10px);
          transition: opacity 220ms ease, transform 220ms ease;
        }

        .bw-gallery .bw-tile:hover .bw-caption,
        .bw-gallery .bw-tile:focus-visible .bw-caption {
          opacity: 1;
          transform: translateY(0);
        }

        .bw-gallery .bw-gallery-placeholder {
          align-items: center;
          background: #F2F8E8;
          color: #1B5E20;
          display: flex;
          font-size: 13px;
          font-weight: 800;
          height: 100%;
          justify-content: center;
          min-height: 160px;
          padding: 16px;
          text-align: center;
          width: 100%;
        }

        .bw-gallery .bw-instagram-cta {
          color: #1B5E20;
          display: inline-flex;
          font-size: 15px;
          font-weight: 800;
          line-height: 1.4;
          margin-top: 26px;
          text-decoration: none;
          text-underline-offset: 4px;
        }

        .bw-gallery .bw-instagram-cta:hover,
        .bw-gallery .bw-instagram-cta:focus-visible {
          text-decoration: underline;
        }

        .bw-gallery .bw-instagram-cta:focus-visible {
          outline: 3px solid rgba(27, 94, 32, 0.3);
          outline-offset: 3px;
        }

        .bw-gallery .bw-gallery-error {
          color: #4E5A4E;
          font-family: Merriweather, Georgia, serif;
          line-height: 1.6;
          margin: 32px 0 0;
        }

        .bw-gallery .bw-lightbox {
          align-items: center;
          background: rgba(12, 20, 12, 0.92);
          display: grid;
          grid-template-columns: 64px minmax(0, 1fr) 64px;
          grid-template-rows: 64px minmax(0, 1fr) auto;
          inset: 0;
          padding: 20px;
          position: fixed;
          z-index: 9999;
        }

        .bw-gallery .bw-lightbox[hidden] {
          display: none;
        }

        .bw-gallery .bw-lightbox-close,
        .bw-gallery .bw-lightbox-nav {
          align-items: center;
          appearance: none;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 999px;
          color: #FFFFFF;
          cursor: pointer;
          display: inline-flex;
          font-size: 28px;
          height: 44px;
          justify-content: center;
          line-height: 1;
          padding: 0;
          width: 44px;
        }

        .bw-gallery .bw-lightbox-close:hover,
        .bw-gallery .bw-lightbox-nav:hover,
        .bw-gallery .bw-lightbox-close:focus-visible,
        .bw-gallery .bw-lightbox-nav:focus-visible {
          background: rgba(255, 255, 255, 0.2);
          outline: 2px solid #FFE600;
          outline-offset: 3px;
        }

        .bw-gallery .bw-lightbox-close {
          grid-column: 3;
          justify-self: end;
        }

        .bw-gallery .bw-lightbox-nav.prev {
          grid-column: 1;
          grid-row: 2;
          justify-self: start;
        }

        .bw-gallery .bw-lightbox-nav.next {
          grid-column: 3;
          grid-row: 2;
          justify-self: end;
        }

        .bw-gallery .bw-lightbox-frame {
          align-self: center;
          grid-column: 2;
          grid-row: 2;
          justify-self: center;
          max-height: calc(100vh - 180px);
          max-width: min(100%, 1180px);
          min-width: 0;
        }

        .bw-gallery .bw-lightbox-picture,
        .bw-gallery .bw-lightbox-picture img {
          display: block;
          max-height: calc(100vh - 180px);
          max-width: 100%;
        }

        .bw-gallery .bw-lightbox-picture img {
          border-radius: 8px;
          box-shadow: 0 18px 80px rgba(0, 0, 0, 0.35);
          height: auto;
          object-fit: contain;
          width: auto;
        }

        .bw-gallery .bw-lightbox-meta {
          color: #FFFFFF;
          grid-column: 1 / -1;
          grid-row: 3;
          justify-self: center;
          max-width: 720px;
          padding-top: 18px;
          text-align: center;
        }

        .bw-gallery .bw-lightbox-caption {
          font-size: 15px;
          font-weight: 800;
          line-height: 1.45;
          margin: 0;
        }

        .bw-gallery .bw-lightbox-count {
          color: rgba(255, 255, 255, 0.7);
          font-size: 12px;
          font-weight: 700;
          margin: 6px 0 0;
        }

        .bw-gallery .bw-lightbox-dots {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          margin-top: 12px;
        }

        .bw-gallery .bw-lightbox-dot {
          appearance: none;
          background: rgba(255, 255, 255, 0.35);
          border: 0;
          border-radius: 999px;
          cursor: pointer;
          height: 9px;
          padding: 0;
          width: 9px;
        }

        .bw-gallery .bw-lightbox-dot[aria-current="true"] {
          background: #FFE600;
          width: 28px;
        }

        .bw-gallery .bw-lightbox-dot:focus-visible {
          outline: 2px solid #FFE600;
          outline-offset: 4px;
        }

        .bw-gallery .bw-skeleton-tile {
          animation: bw-gallery-shimmer 1200ms linear infinite;
          background: linear-gradient(90deg, #F2F8E8 0%, #FFFFFF 45%, #F2F8E8 90%);
          background-size: 220% 100%;
          border-radius: 8px;
          min-height: 160px;
        }

        @keyframes bw-gallery-shimmer {
          from { background-position: 120% 0; }
          to { background-position: -120% 0; }
        }

        @media (max-width: 900px) {
          .bw-gallery {
            padding: 56px 20px;
          }

          .bw-gallery .bw-gallery-grid {
            grid-template-areas:
              "a a"
              "a a"
              "b c"
              "d e"
              "f f"
              "g g"
              "h h"
              "i i";
            grid-template-columns: repeat(2, minmax(0, 1fr));
            grid-template-rows: repeat(8, minmax(170px, 1fr));
            min-height: 1360px;
          }

          .bw-gallery .bw-lightbox {
            grid-template-columns: 52px minmax(0, 1fr) 52px;
            padding: 16px;
          }
        }

        @media (max-width: 520px) {
          .bw-gallery {
            padding: 40px 16px;
          }

          .bw-gallery .bw-gallery-title {
            font-size: 31px;
          }

          .bw-gallery .bw-gallery-grid {
            display: flex;
            flex-direction: column;
            gap: 12px;
            min-height: 0;
          }

          .bw-gallery .bw-tile {
            aspect-ratio: 4 / 3;
            min-height: 0;
          }

          .bw-gallery .bw-caption {
            opacity: 1;
            transform: none;
          }

          .bw-gallery .bw-lightbox {
            grid-template-columns: 48px minmax(0, 1fr) 48px;
            grid-template-rows: 56px minmax(0, 1fr) auto;
            padding: 12px;
          }

          .bw-gallery .bw-lightbox-close,
          .bw-gallery .bw-lightbox-nav {
            height: 40px;
            width: 40px;
          }

          .bw-gallery .bw-lightbox-frame,
          .bw-gallery .bw-lightbox-picture,
          .bw-gallery .bw-lightbox-picture img {
            max-height: calc(100vh - 170px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bw-gallery .bw-tile,
          .bw-gallery .bw-tile img,
          .bw-gallery .bw-caption,
          .bw-gallery .bw-skeleton-tile {
            animation: none;
            transition: none;
          }

          .bw-gallery .bw-tile,
          .bw-gallery .bw-tile.is-visible,
          .bw-gallery .bw-caption {
            transform: none;
          }
        }
      </style>

      <section class="bw-gallery" aria-labelledby="bw-gallery-title">
        <div class="bw-gallery-inner">
          <header class="bw-gallery-header">
            <p class="bw-gallery-eyebrow">BERLINWALK - BERLIN, ON FOOT</p>
            <h2 class="bw-gallery-title" id="bw-gallery-title">What the walk actually looks like</h2>
            <p class="bw-gallery-lead">Real photos from recent tours. No stock images, no filters.</p>
          </header>

          <div class="bw-gallery-grid" data-gallery-grid aria-live="polite">
            ${this._renderSkeleton()}
          </div>

          <a class="bw-instagram-cta" href="https://www.instagram.com/berlinwalkingtour/">More moments on Instagram - @berlinwalkingtour</a>
        </div>

        <div class="bw-lightbox" data-lightbox role="dialog" aria-modal="true" aria-label="Photo gallery viewer" aria-hidden="true" hidden>
          <button class="bw-lightbox-close" type="button" data-close aria-label="Close gallery">x</button>
          <button class="bw-lightbox-nav prev" type="button" data-prev aria-label="Previous photo">&#8249;</button>
          <div class="bw-lightbox-frame">
            <picture class="bw-lightbox-picture">
              <source data-lightbox-source type="image/webp">
              <img data-lightbox-img src="" alt="">
            </picture>
          </div>
          <button class="bw-lightbox-nav next" type="button" data-next aria-label="Next photo">&#8250;</button>
          <div class="bw-lightbox-meta">
            <p class="bw-lightbox-caption" data-lightbox-caption></p>
            <p class="bw-lightbox-count" data-lightbox-count></p>
            <div class="bw-lightbox-dots" data-lightbox-dots aria-label="Choose photo"></div>
          </div>
        </div>
      </section>
    `;
  }

  _renderSkeleton() {
    return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'].map(area => (
      `<div class="bw-skeleton-tile" style="grid-area:${area}" aria-hidden="true"></div>`
    )).join('');
  }

  async _loadDataAndRender() {
    try {
      const response = await fetch(BW_GALLERY_DATA_URL);
      if (!response.ok) throw new Error('Gallery data unavailable');
      const data = await response.json();
      this._photos = Array.isArray(data.photos) ? data.photos : [];
      if (!this._photos.length) throw new Error('No photos found');
      this._renderGrid();
      this._setupAnimations();
    } catch (error) {
      this._renderError();
    }
  }

  _renderGrid() {
    const grid = this.querySelector('[data-gallery-grid]');
    if (!grid) return;
    grid.removeAttribute('aria-live');
    grid.innerHTML = this._photos.map((photo, index) => this._renderTile(photo, index)).join('');
  }

  _renderTile(photo, index) {
    return `
      <button class="bw-tile" type="button" data-photo-index="${index}" style="grid-area:${this._escapeAttribute(photo.area || '')}" aria-label="Open photo: ${this._escapeAttribute(photo.caption || '')}">
        ${this._renderPicture(photo)}
        <span class="bw-caption">${this._escapeHtml(photo.caption || '')}</span>
      </button>
    `;
  }

  _renderPicture(photo) {
    const ratio = this._parseRatio(photo.aspectRatio || '1/1');
    const isHero = photo.area === 'a';
    return `
      <picture>
        <source type="image/webp" srcset="${this._srcsetFor(photo, 'webp')}" sizes="${this._escapeAttribute(photo.sizes || '100vw')}">
        <img
          src="${BW_GALLERY_IMAGE_BASE}/${this._escapeAttribute(photo.id)}-800w.jpg"
          srcset="${this._srcsetFor(photo, 'jpg')}"
          sizes="${this._escapeAttribute(photo.sizes || '100vw')}"
          alt="${this._escapeAttribute(photo.alt || '')}"
          width="800"
          height="${Math.round(800 * ratio.h / ratio.w)}"
          loading="${isHero ? 'eager' : 'lazy'}"
          decoding="async"
          ${isHero ? 'fetchpriority="high"' : ''}
        >
      </picture>
    `;
  }

  _setupInteractions() {
    const signal = this._controller.signal;

    this.addEventListener('click', (event) => {
      const tile = event.target.closest('.bw-tile');
      if (tile) {
        this._openLightbox(Number(tile.dataset.photoIndex || 0), tile);
        return;
      }

      if (event.target.closest('[data-close]')) {
        this._closeLightbox(true);
        return;
      }

      if (event.target.closest('[data-prev]')) {
        this._showPhoto(this._lightboxIndex - 1);
        return;
      }

      if (event.target.closest('[data-next]')) {
        this._showPhoto(this._lightboxIndex + 1);
        return;
      }

      const dot = event.target.closest('.bw-lightbox-dot');
      if (dot) {
        this._showPhoto(Number(dot.dataset.photoIndex || 0));
        return;
      }

      const lightbox = this.querySelector('[data-lightbox]');
      if (event.target === lightbox) this._closeLightbox(true);
    }, { signal });

    document.addEventListener('keydown', (event) => {
      if (!this._lightboxOpen) return;
      if (event.key === 'Escape') this._closeLightbox(true);
      if (event.key === 'ArrowLeft') this._showPhoto(this._lightboxIndex - 1);
      if (event.key === 'ArrowRight') this._showPhoto(this._lightboxIndex + 1);
      if (event.key === 'Tab') this._trapFocus(event);
    }, { signal });

    this.addEventListener('touchstart', (event) => {
      if (!this._lightboxOpen || !event.changedTouches.length) return;
      this._touchStartX = event.changedTouches[0].clientX;
    }, { signal, passive: true });

    this.addEventListener('touchend', (event) => {
      if (!this._lightboxOpen || !event.changedTouches.length) return;
      const delta = event.changedTouches[0].clientX - this._touchStartX;
      if (Math.abs(delta) < 48) return;
      this._showPhoto(this._lightboxIndex + (delta < 0 ? 1 : -1));
    }, { signal, passive: true });
  }

  _openLightbox(index, trigger) {
    const lightbox = this.querySelector('[data-lightbox]');
    const close = this.querySelector('[data-close]');
    if (!lightbox || !this._photos.length) return;

    this._lastFocus = trigger || document.activeElement;
    this._previousBodyOverflow = document.body.style.overflow;
    this._showPhoto(index);
    this._lightboxOpen = true;
    lightbox.hidden = false;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (close) close.focus();
  }

  _closeLightbox(restoreFocus) {
    const lightbox = this.querySelector('[data-lightbox]');
    const img = this.querySelector('[data-lightbox-img]');
    const source = this.querySelector('[data-lightbox-source]');
    if (!lightbox) return;

    this._lightboxOpen = false;
    lightbox.hidden = true;
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = this._previousBodyOverflow || '';
    if (img) img.removeAttribute('src');
    if (source) source.removeAttribute('srcset');
    if (restoreFocus && this._lastFocus && typeof this._lastFocus.focus === 'function') {
      this._lastFocus.focus();
    }
  }

  _showPhoto(index) {
    if (!this._photos.length) return;
    this._lightboxIndex = (index + this._photos.length) % this._photos.length;
    const photo = this._photos[this._lightboxIndex];
    const source = this.querySelector('[data-lightbox-source]');
    const img = this.querySelector('[data-lightbox-img]');
    const caption = this.querySelector('[data-lightbox-caption]');
    const count = this.querySelector('[data-lightbox-count]');

    if (source) source.srcset = `${BW_GALLERY_IMAGE_BASE}/${photo.id}-full.webp`;
    if (img) {
      img.src = `${BW_GALLERY_IMAGE_BASE}/${photo.id}-full.jpg`;
      img.alt = photo.alt || '';
    }
    if (caption) caption.textContent = photo.caption || '';
    if (count) count.textContent = `${this._lightboxIndex + 1} of ${this._photos.length}`;
    this._renderLightboxDots();
  }

  _renderLightboxDots() {
    const dots = this.querySelector('[data-lightbox-dots]');
    if (!dots) return;
    dots.innerHTML = this._photos.map((photo, index) => `
      <button
        class="bw-lightbox-dot"
        type="button"
        data-photo-index="${index}"
        aria-label="Open photo ${index + 1}"
        ${index === this._lightboxIndex ? 'aria-current="true"' : ''}
      ></button>
    `).join('');
  }

  _trapFocus(event) {
    const lightbox = this.querySelector('[data-lightbox]');
    if (!lightbox) return;
    const focusable = Array.from(lightbox.querySelectorAll('button, [href], img, [tabindex]:not([tabindex="-1"])'))
      .filter(el => !el.disabled && el.offsetParent !== null);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  _setupAnimations() {
    const tiles = Array.from(this.querySelectorAll('.bw-tile'));
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      this._animated = true;
      tiles.forEach(tile => tile.classList.add('is-visible'));
      return;
    }

    this._observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        this._observer.unobserve(entry.target);
      });
    }, { threshold: 0.3 });

    tiles.forEach((tile, index) => {
      tile.style.transitionDelay = `${index * 60}ms`;
      this._observer.observe(tile);
    });
  }

  _renderError() {
    const grid = this.querySelector('[data-gallery-grid]');
    if (!grid) return;
    grid.outerHTML = '<p class="bw-gallery-error">Gallery photos are unavailable right now.</p>';
  }

  _srcsetFor(photo, format) {
    return [400, 800, 1200, 1600].map(width => (
      `${BW_GALLERY_IMAGE_BASE}/${this._escapeAttribute(photo.id)}-${width}w.${format} ${width}w`
    )).join(', ');
  }

  _parseRatio(ratio) {
    const parts = String(ratio).split('/').map(Number);
    return { w: parts[0] || 1, h: parts[1] || 1 };
  }

  _escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  _escapeAttribute(value) {
    return this._escapeHtml(value).replace(/'/g, '&#39;');
  }
}

if (!customElements.get('bw-gallery')) {
  customElements.define('bw-gallery', BWGalleryElement);
}
