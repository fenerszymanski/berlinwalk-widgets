const BW_ROUTE_DATA_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/route/data.json';
const BW_ROUTE_LOCAL_DATA_URL = document.currentScript && document.currentScript.src
  ? new URL('./data.json', document.currentScript.src).href
  : './data.json';
const BW_ROUTE_BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
const BW_ROUTE_STORY_URL = 'https://www.berlinwalk.com/berlin-walking-tour-route';

class BWRouteElement extends HTMLElement {
  constructor() {
    super();
    this._data = null;
    this._activeStopId = null;
    this._observer = null;
    this._pathDrawn = false;
    this._controller = null;
    this._map = null;
    this._stopCard = null;
    this._previousPin = null;
    this._timers = [];
    this._cardHideTimer = null;

    this._handleMapClick = this._handleMapClick.bind(this);
    this._handleMapKeydown = this._handleMapKeydown.bind(this);
    this._handleDocumentKeydown = this._handleDocumentKeydown.bind(this);
    this._handleStopCardClick = this._handleStopCardClick.bind(this);
  }

  async connectedCallback() {
    this._controller = new AbortController();
    this._renderLoading();

    try {
      this._data = await this._loadData();
      this._normalizeLocalAssetUrls();
      this._render();
      this._setupAnimations();
      this._setupInteractions();
    } catch (err) {
      this._renderError();
    }
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
    if (this._controller) this._controller.abort();
    if (this._map) {
      this._map.removeEventListener('click', this._handleMapClick);
      this._map.removeEventListener('keydown', this._handleMapKeydown);
    }
    if (this._stopCard) this._stopCard.removeEventListener('click', this._handleStopCardClick);
    document.removeEventListener('keydown', this._handleDocumentKeydown);
    if (this._cardHideTimer) window.clearTimeout(this._cardHideTimer);
    this._timers.forEach(timer => window.clearTimeout(timer));
    this._timers = [];
  }

  async _loadData() {
    const urls = [BW_ROUTE_DATA_URL];
    if (BW_ROUTE_LOCAL_DATA_URL !== BW_ROUTE_DATA_URL) urls.push(BW_ROUTE_LOCAL_DATA_URL);

    let lastError = null;
    for (const url of urls) {
      try {
        const res = await fetch(url, { signal: this._controller.signal });
        if (!res.ok) throw new Error(`Route data unavailable: ${res.status}`);
        return await res.json();
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError || new Error('Route data unavailable');
  }

  _normalizeLocalAssetUrls() {
    if (!this._data || !this._data.image || BW_ROUTE_LOCAL_DATA_URL === BW_ROUTE_DATA_URL) return;

    const localAssetBase = new URL('./assets/', BW_ROUTE_LOCAL_DATA_URL).href;
    const remoteAssetBase = 'https://fenerszymanski.github.io/berlinwalk-widgets/route/assets/';

    ['src', 'src2x'].forEach(key => {
      if (typeof this._data.image[key] === 'string') {
        this._data.image[key] = this._data.image[key].replace(remoteAssetBase, localAssetBase);
      }
    });
  }

  _renderLoading() {
    this.innerHTML = `
      <style>${this._styles()}</style>
      <section class="bw-route" role="region" aria-labelledby="bw-route-title">
        <div class="bw-route-inner">
          <header class="bw-route-header">
            <h2 id="bw-route-title" class="bw-route-title">The <span class="bw-route-title-accent">Route</span></h2>
            <p class="bw-route-subtitle">Loading the route...</p>
          </header>
          <div class="bw-route-map-wrapper bw-route-skeleton" aria-hidden="true"></div>
        </div>
      </section>
    `;
  }

  _renderError() {
    this.innerHTML = `
      <style>${this._styles()}</style>
      <section class="bw-route" role="region" aria-labelledby="bw-route-title">
        <div class="bw-route-inner">
          <header class="bw-route-header">
            <h2 id="bw-route-title" class="bw-route-title">The <span class="bw-route-title-accent">Route</span></h2>
            <p class="bw-route-subtitle">Alexanderplatz &rarr; Hackescher Markt</p>
          </header>
          <div class="bw-route-map-wrapper bw-route-error">
            <p>Map temporarily unavailable. Visit our booking page to read about the tour.</p>
            <a href="${BW_ROUTE_BOOKING_URL}" target="_blank" rel="noopener">Book your free spot</a>
          </div>
        </div>
      </section>
    `;
  }

  _render() {
    const image = this._data.image;
    const stops = this._data.stops || [];
    const meta = this._data.meta || {};

    this.innerHTML = `
      <style>${this._styles()}</style>
      <section class="bw-route" role="region" aria-labelledby="bw-route-title">
        <div class="bw-route-inner">
          <header class="bw-route-header">
            <h2 id="bw-route-title" class="bw-route-title">The <span class="bw-route-title-accent">Route</span></h2>
            <p class="bw-route-subtitle">Alexanderplatz &rarr; Hackescher Markt</p>
            <div class="bw-route-meta" aria-label="${this._escapeAttr(this._metaLabel(meta))}">
              <span class="bw-route-meta-item">&#128205; ${this._escapeHTML(meta.stopCount || stops.length)} stops</span>
              <span class="bw-route-meta-item">&#128336; ${this._compactDuration(meta.duration)}</span>
              <span class="bw-route-meta-item">&#128694; ${this._compactDistance(meta.distance)}</span>
            </div>
          </header>

          <div class="bw-route-map-wrapper">
            <div class="bw-route-map" role="application" aria-label="Interactive tour map">
              <img
                class="bw-route-map-image"
                src="${this._escapeAttr(image.src)}"
                srcset="${this._escapeAttr(image.src)} 1x, ${this._escapeAttr(image.src2x)} 2x"
                alt="${this._escapeAttr(image.alt)}"
                loading="lazy"
              >
              <svg class="bw-route-path-overlay" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <path class="bw-route-path" d="${this._escapeAttr(this._pathD(stops))}" fill="none" />
              </svg>
              <div class="bw-route-pins">
                ${stops.map(stop => this._renderPin(stop)).join('')}
              </div>
            </div>
          </div>

          <div class="bw-route-cta" aria-label="Explore or book the BerlinWalk route">
            <a class="bw-route-btn bw-route-btn-primary" href="${BW_ROUTE_STORY_URL}">Explore the full story map</a>
            <a class="bw-route-btn bw-route-btn-ghost" href="${BW_ROUTE_BOOKING_URL}">Book your free spot</a>
          </div>

          <div class="bw-route-stop-card" role="region" aria-live="polite" hidden></div>
        </div>
      </section>
    `;

    this._map = this.querySelector('.bw-route-map');
    this._stopCard = this.querySelector('.bw-route-stop-card');
  }

  _renderPin(stop) {
    return `
      <button
        class="bw-route-pin"
        style="left:${this._escapeAttr(stop.x)}%; top:${this._escapeAttr(stop.y)}%;"
        type="button"
        data-stop-id="${this._escapeAttr(stop.id)}"
        aria-label="Stop ${this._escapeAttr(stop.id)}: ${this._escapeAttr(stop.name)}"
        aria-expanded="false"
      >
        <span class="bw-route-pin-number">${this._escapeHTML(stop.id)}</span>
      </button>
    `;
  }

  _renderStopCard(stop) {
    const hasImage = Boolean(stop.image);

    return `
      <button class="bw-route-stop-close" type="button" aria-label="Close stop details">&times;</button>
      <div class="bw-route-stop-content ${hasImage ? 'has-image' : 'no-image'}">
        <div class="bw-route-stop-text">
          <div class="bw-route-stop-number">STOP ${String(stop.id).padStart(2, '0')}</div>
          <h3 class="bw-route-stop-name">${this._escapeHTML(stop.name)}</h3>
          <p class="bw-route-stop-location">${this._escapeHTML(stop.location)}</p>
          <p class="bw-route-stop-hook">${this._escapeHTML(stop.hook)}</p>
        </div>
        ${hasImage ? `
          <div class="bw-route-stop-image">
            <img src="${this._escapeAttr(stop.image)}" alt="${this._escapeAttr(stop.name)}" loading="lazy">
          </div>
        ` : ''}
      </div>
    `;
  }

  _setupAnimations() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      this._showMap();
      this._drawPath(true);
      this._showPins(true);
      return;
    }

    this._observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this._pathDrawn) {
          this._pathDrawn = true;
          this._showMap();
          this._timers.push(window.setTimeout(() => this._drawPath(false), 400));
          this._timers.push(window.setTimeout(() => this._showPins(false), 1650));
          this._observer.disconnect();
        }
      });
    }, { threshold: 0.2 });

    this._observer.observe(this);
  }

  _setupInteractions() {
    if (!this._map || !this._stopCard) return;
    this._map.addEventListener('click', this._handleMapClick);
    this._map.addEventListener('keydown', this._handleMapKeydown);
    this._stopCard.addEventListener('click', this._handleStopCardClick);
    document.addEventListener('keydown', this._handleDocumentKeydown);
  }

  _handleMapClick(event) {
    const pin = event.target.closest('.bw-route-pin');
    if (!pin || !this.contains(pin)) return;
    this._selectStop(Number(pin.dataset.stopId));
  }

  _handleMapKeydown(event) {
    const pin = event.target.closest('.bw-route-pin');
    if (!pin || !this.contains(pin)) return;

    const pins = Array.from(this.querySelectorAll('.bw-route-pin'));
    const index = pins.indexOf(pin);
    let nextIndex = index;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this._selectStop(Number(pin.dataset.stopId));
      return;
    }

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % pins.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + pins.length) % pins.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = pins.length - 1;
    else return;

    event.preventDefault();
    pins[nextIndex].focus();
  }

  _handleDocumentKeydown(event) {
    if (event.key === 'Escape' && this._activeStopId !== null) {
      this._deselectStop(true);
    }
  }

  _handleStopCardClick(event) {
    if (event.target.closest('.bw-route-stop-close')) this._deselectStop(true);
  }

  _selectStop(id) {
    if (this._activeStopId === id) {
      this._deselectStop(true);
      return;
    }

    const stop = this._findStop(id);
    if (!stop || !this._stopCard) return;
    if (this._cardHideTimer) {
      window.clearTimeout(this._cardHideTimer);
      this._cardHideTimer = null;
    }

    this._activeStopId = id;
    this._previousPin = this.querySelector(`.bw-route-pin[data-stop-id="${id}"]`);

    this.querySelectorAll('.bw-route-pin').forEach(pin => {
      const isActive = Number(pin.dataset.stopId) === id;
      pin.classList.toggle('active', isActive);
      pin.setAttribute('aria-expanded', String(isActive));
    });

    this._stopCard.hidden = false;
    this._stopCard.innerHTML = this._renderStopCard(stop);
    window.requestAnimationFrame(() => {
      this._stopCard.classList.add('visible');
      this._scrollCardIfNeeded();
    });

    this._timers.push(window.setTimeout(() => {
      if (this._activeStopId === id) {
        const closeButton = this._stopCard.querySelector('.bw-route-stop-close');
        if (closeButton) closeButton.focus();
      }
    }, 430));
  }

  _deselectStop(restoreFocus) {
    const activePin = this._activeStopId !== null
      ? this.querySelector(`.bw-route-pin[data-stop-id="${this._activeStopId}"]`)
      : this._previousPin;

    this._activeStopId = null;

    this.querySelectorAll('.bw-route-pin').forEach(pin => {
      pin.classList.remove('active');
      pin.setAttribute('aria-expanded', 'false');
    });

    if (this._stopCard) {
      this._stopCard.classList.remove('visible');
      if (this._cardHideTimer) window.clearTimeout(this._cardHideTimer);
      this._cardHideTimer = window.setTimeout(() => {
        if (this._activeStopId === null && this._stopCard) {
          this._stopCard.hidden = true;
          this._stopCard.innerHTML = '';
        }
        this._cardHideTimer = null;
      }, 400);
    }

    if (restoreFocus && activePin) activePin.focus();
  }

  _showMap() {
    const image = this.querySelector('.bw-route-map-image');
    if (image) image.classList.add('visible');
  }

  _drawPath(instant) {
    const path = this.querySelector('.bw-route-path');
    if (!path) return;

    if (instant) {
      path.style.strokeDasharray = '';
      path.style.strokeDashoffset = '';
      path.classList.add('drawn');
      return;
    }

    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    window.requestAnimationFrame(() => {
      path.classList.add('drawn');
      path.style.strokeDashoffset = 0;
    });
    this._timers.push(window.setTimeout(() => {
      path.style.strokeDasharray = '1 1';
      path.style.strokeDashoffset = 0;
    }, 2500));
  }

  _showPins(instant) {
    this.querySelectorAll('.bw-route-pin').forEach((pin, index) => {
      if (instant) {
        pin.classList.add('visible');
        return;
      }

      this._timers.push(window.setTimeout(() => {
        pin.classList.add('visible');
      }, index * 100));
    });
  }

  _scrollCardIfNeeded() {
    if (!this._stopCard || !('scrollIntoView' in this._stopCard)) return;
    const rect = this._stopCard.getBoundingClientRect();
    if (rect.bottom > window.innerHeight || rect.top < 0) {
      this._stopCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  _findStop(id) {
    return (this._data.stops || []).find(stop => Number(stop.id) === Number(id));
  }

  _pathD(stops) {
    if (!stops.length) return '';
    return stops.map((stop, index) => `${index === 0 ? 'M' : 'L'} ${stop.x},${stop.y}`).join(' ');
  }

  _metaLabel(meta) {
    return `${meta.stopCount || 12} stops, ${meta.duration || '~2 hours'}, ${meta.distance || '~3 km'}`;
  }

  _compactDuration(duration) {
    return this._escapeHTML(String(duration || '~2 hours').replace(/\s*hours?\b/i, 'h'));
  }

  _compactDistance(distance) {
    return this._escapeHTML(String(distance || '~3 km').replace(/\s+/g, ''));
  }

  _escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));
  }

  _escapeAttr(value) {
    return this._escapeHTML(value);
  }

  _styles() {
    return `
        bw-route {
          background: #FAFAF5;
          display: block;
          width: 100%;
        }

        .bw-route {
          --serif: Merriweather, Georgia, serif;
          background: #FAFAF5;
          color: #212121;
          font-family: Montserrat, Arial, sans-serif;
          margin: 0;
          max-width: 100%;
          overflow-x: hidden;
          padding: 64px 32px;
        }

        .bw-route *,
        .bw-route *::before,
        .bw-route *::after {
          box-sizing: border-box;
        }

        .bw-route .bw-route-inner {
          margin: 0 auto;
          max-width: 1200px;
        }

        .bw-route .bw-route-header {
          margin: 0 0 40px;
          text-align: center;
        }

        .bw-route .bw-route-title {
          color: #1B5E20;
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.01em;
          line-height: 1.2;
          margin: 0;
        }

        .bw-route .bw-route-title-accent {
          color: #FFE600;
        }

        .bw-route .bw-route-subtitle {
          color: #4E5A4E;
          font-family: var(--serif);
          font-size: 16px;
          font-style: italic;
          line-height: 1.55;
          margin: 12px auto 0;
        }

        .bw-route .bw-route-meta {
          align-items: center;
          color: #4E5A4E;
          display: flex;
          flex-wrap: wrap;
          font-size: 13px;
          font-weight: 700;
          gap: 8px;
          justify-content: center;
          letter-spacing: 0.08em;
          line-height: 1.4;
          margin-top: 16px;
          text-transform: uppercase;
        }

        .bw-route .bw-route-meta-item {
          align-items: center;
          display: inline-flex;
          gap: 6px;
          white-space: nowrap;
        }

        .bw-route .bw-route-meta-item + .bw-route-meta-item::before {
          color: #C8C8C8;
          content: "\\00B7";
          font-weight: 800;
          margin-right: 8px;
        }

        .bw-route .bw-route-map-wrapper {
          aspect-ratio: 16 / 9;
          background: #FFFFFF;
          border: 1px solid #E8E8E8;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          position: relative;
          width: 100%;
        }

        .bw-route .bw-route-map {
          height: 100%;
          position: relative;
          width: 100%;
        }

        .bw-route .bw-route-map-image {
          display: block;
          height: 100%;
          left: 0;
          object-fit: cover;
          opacity: 0;
          position: absolute;
          top: 0;
          transition: opacity 600ms ease-out;
          width: 100%;
        }

        .bw-route .bw-route-map-image.visible {
          opacity: 1;
        }

        .bw-route .bw-route-path-overlay {
          height: 100%;
          left: 0;
          pointer-events: none;
          position: absolute;
          top: 0;
          width: 100%;
        }

        .bw-route .bw-route-path {
          stroke: #FFE600;
          stroke-dasharray: 1 1;
          stroke-linecap: round;
          stroke-width: 0.5;
          transition: stroke-dashoffset 2500ms ease-in-out;
        }

        .bw-route .bw-route-path.drawn {
          stroke-dashoffset: 0;
        }

        .bw-route .bw-route-pins {
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          width: 100%;
        }

        .bw-route .bw-route-pin {
          --pin-scale: 0.5;
          align-items: center;
          appearance: none;
          background: #FFE600;
          border: 2px solid #1B5E20;
          border-radius: 999px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
          color: #1B5E20;
          cursor: pointer;
          display: inline-flex;
          height: 32px;
          justify-content: center;
          min-height: 32px;
          min-width: 32px;
          opacity: 0;
          padding: 0;
          position: absolute;
          transform: translate(-50%, -50%) scale(var(--pin-scale));
          transition: opacity 280ms ease-out, transform 150ms ease-out, box-shadow 150ms ease-out, background-color 150ms ease-out, border-color 150ms ease-out, color 150ms ease-out;
          width: 32px;
          z-index: 5;
        }

        .bw-route .bw-route-pin.visible {
          --pin-scale: 1;
          opacity: 1;
        }

        .bw-route .bw-route-pin.active {
          --pin-scale: 1.2;
          background: #1B5E20;
          border-color: #FFE600;
          color: #FFE600;
          z-index: 12;
        }

        .bw-route .bw-route-pin:focus-visible {
          outline: 3px solid #1B5E20;
          outline-offset: 2px;
          z-index: 15;
        }

        .bw-route .bw-route-pin-number {
          color: currentColor;
          font-size: 13px;
          font-weight: 800;
          line-height: 1;
        }

        @media (hover: hover) and (pointer: fine) {
          .bw-route .bw-route-pin.visible:hover {
            --pin-scale: 1.15;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
            z-index: 10;
          }

          .bw-route .bw-route-pin.active:hover {
            --pin-scale: 1.2;
          }
        }

        .bw-route .bw-route-stop-card {
          background: #FAFAF5;
          border: 1px solid #E8E8E8;
          border-radius: 12px;
          margin-top: 24px;
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          padding: 0 24px;
          position: relative;
          transition: max-height 400ms ease-out, opacity 300ms ease-out, padding 400ms ease-out;
        }

        .bw-route .bw-route-cta {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          margin-top: 24px;
        }

        .bw-route .bw-route-btn {
          align-items: center;
          border-radius: 999px;
          display: inline-flex;
          font-size: 13px;
          font-weight: 800;
          justify-content: center;
          letter-spacing: 0.5px;
          line-height: 1.2;
          min-height: 46px;
          padding: 13px 20px;
          text-decoration: none;
          text-transform: uppercase;
          transition: background 160ms ease, color 160ms ease, transform 160ms ease;
        }

        .bw-route .bw-route-btn::after {
          content: ">";
          font-size: 14px;
          margin-left: 9px;
        }

        .bw-route .bw-route-btn-primary {
          background: #1B5E20;
          color: #FFFFFF;
        }

        .bw-route .bw-route-btn-primary:hover,
        .bw-route .bw-route-btn-primary:focus-visible {
          background: #124516;
          transform: translateY(-1px);
        }

        .bw-route .bw-route-btn-ghost {
          border: 2px solid #1B5E20;
          color: #1B5E20;
        }

        .bw-route .bw-route-btn-ghost:hover,
        .bw-route .bw-route-btn-ghost:focus-visible {
          background: #1B5E20;
          color: #FFFFFF;
          transform: translateY(-1px);
        }

        .bw-route .bw-route-btn:focus-visible {
          outline: 3px solid rgba(255, 230, 0, 0.9);
          outline-offset: 3px;
        }

        .bw-route .bw-route-stop-card.visible {
          max-height: 600px;
          opacity: 1;
          overflow: visible;
          padding-bottom: 28px;
          padding-top: 28px;
        }

        .bw-route .bw-route-stop-content {
          display: flex;
          gap: 24px;
          padding-right: 40px;
        }

        .bw-route .bw-route-stop-content.no-image .bw-route-stop-text {
          flex: 1 1 100%;
        }

        .bw-route .bw-route-stop-content.has-image .bw-route-stop-text {
          flex: 1 1 60%;
        }

        .bw-route .bw-route-stop-content.has-image .bw-route-stop-image {
          flex: 1 1 40%;
        }

        .bw-route .bw-route-stop-number {
          background: #1B5E20;
          border-radius: 999px;
          color: #FFE600;
          display: inline-flex;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          line-height: 1;
          margin-bottom: 12px;
          padding: 7px 10px;
          text-transform: uppercase;
        }

        .bw-route .bw-route-stop-name {
          color: #1B5E20;
          font-size: 22px;
          font-weight: 800;
          line-height: 1.2;
          margin: 0;
        }

        .bw-route .bw-route-stop-location {
          color: #4E5A4E;
          font-family: var(--serif);
          font-size: 14px;
          font-style: italic;
          line-height: 1.5;
          margin: 6px 0 0;
        }

        .bw-route .bw-route-stop-hook {
          color: #212121;
          font-size: 15px;
          font-weight: 400;
          line-height: 1.6;
          margin: 14px 0 0;
          max-width: 540px;
        }

        .bw-route .bw-route-stop-image img {
          border-radius: 8px;
          display: block;
          height: auto;
          width: 100%;
        }

        .bw-route .bw-route-stop-close {
          align-items: center;
          appearance: none;
          background: transparent;
          border: 0;
          border-radius: 999px;
          color: #4E5A4E;
          cursor: pointer;
          display: inline-flex;
          font-size: 22px;
          height: 32px;
          justify-content: center;
          line-height: 1;
          padding: 0;
          position: absolute;
          right: 14px;
          top: 14px;
          transition: background-color 160ms ease, color 160ms ease;
          width: 32px;
        }

        .bw-route .bw-route-stop-close:hover {
          background: #E8E8E8;
          color: #1B5E20;
        }

        .bw-route .bw-route-stop-close:focus-visible {
          outline: 2px solid #1B5E20;
          outline-offset: 2px;
        }

        .bw-route .bw-route-skeleton {
          animation: bw-route-pulse 1400ms ease-in-out infinite;
          background: #F0EDE8;
        }

        .bw-route .bw-route-error {
          align-items: center;
          background: #FAFAF5;
          color: #4E5A4E;
          display: flex;
          flex-direction: column;
          font-family: var(--serif);
          font-size: 16px;
          gap: 12px;
          justify-content: center;
          padding: 24px;
          text-align: center;
        }

        .bw-route .bw-route-error p {
          margin: 0;
        }

        .bw-route .bw-route-error a {
          color: #1B5E20;
          font-family: Montserrat, Arial, sans-serif;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-underline-offset: 4px;
        }

        @keyframes bw-route-pulse {
          0%,
          100% {
            opacity: 0.78;
          }

          50% {
            opacity: 1;
          }
        }

        @media (max-width: 767px) {
          .bw-route {
            padding: 48px 20px;
          }

          .bw-route .bw-route-title {
            font-size: 26px;
          }

          .bw-route .bw-route-subtitle {
            font-size: 15px;
          }

          .bw-route .bw-route-meta {
            font-size: 12px;
            gap: 7px;
          }

          .bw-route .bw-route-meta-item + .bw-route-meta-item::before {
            margin-right: 7px;
          }

          .bw-route .bw-route-cta {
            align-items: stretch;
            flex-direction: column;
          }

          .bw-route .bw-route-btn {
            width: 100%;
          }

          .bw-route .bw-route-pin {
            height: 28px;
            min-height: 28px;
            min-width: 28px;
            width: 28px;
          }

          .bw-route .bw-route-pin::before {
            content: "";
            inset: -8px;
            position: absolute;
          }

          .bw-route .bw-route-pin-number {
            font-size: 11px;
          }

          .bw-route .bw-route-stop-card {
            padding-left: 18px;
            padding-right: 18px;
          }

          .bw-route .bw-route-stop-card.visible {
            padding-bottom: 24px;
            padding-top: 24px;
          }

          .bw-route .bw-route-stop-content,
          .bw-route .bw-route-stop-content.has-image {
            flex-direction: column;
            gap: 18px;
            padding-right: 34px;
          }

          .bw-route .bw-route-stop-name {
            font-size: 19px;
          }
        }

        @media (max-width: 420px) {
          .bw-route .bw-route-meta {
            align-items: center;
            flex-direction: column;
          }

          .bw-route .bw-route-meta-item + .bw-route-meta-item::before {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bw-route .bw-route-map-image,
          .bw-route .bw-route-path,
          .bw-route .bw-route-pin,
          .bw-route .bw-route-stop-card {
            transition: none;
          }

          .bw-route .bw-route-skeleton {
            animation: none;
          }
        }
      `;
  }
}

if (!customElements.get('bw-route')) {
  customElements.define('bw-route', BWRouteElement);
}
