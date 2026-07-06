/* IIFE-wrapped so this script can be executed twice on one page without a
   duplicate top-level declaration crash: the homepage loader executes it early
   (before Wix hydrates) and Wix injects its own late copy from the same URL.
   Function scope keeps the top-level consts private; the guarded
   customElements.define below stays idempotent so the second run is a no-op. */
(() => {
const BW_HERO_HOME_BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
const BW_HERO_HOME_MEETING_URL = 'https://www.berlinwalk.com/meeting-point';

const BW_HERO_HOME_ASSET_BASE = (() => {
  const script = document.currentScript;
  const base = script && script.src ? script.src : window.location.href;
  return new URL('../gallery/images/', base).href;
})();

class BWHeroHomeElement extends HTMLElement {
  connectedCallback() {
    this._ensureHeroPreload();
    this._render();
  }

  _ensureHeroPreload() {
    if (!document.head || document.head.querySelector('link[data-bw-hero-home-preload]')) return;
    const link = document.createElement('link');
    link.setAttribute('data-bw-hero-home-preload', 'true');
    link.rel = 'preload';
    link.as = 'image';
    link.href = `${BW_HERO_HOME_ASSET_BASE}hero-home-museum-island-800w.webp`;
    link.type = 'image/webp';
    link.setAttribute('imagesrcset', `${BW_HERO_HOME_ASSET_BASE}hero-home-museum-island-800w.webp 800w, ${BW_HERO_HOME_ASSET_BASE}hero-home-museum-island-1200w.webp 1200w, ${BW_HERO_HOME_ASSET_BASE}hero-home-museum-island-1600w.webp 1600w`);
    link.setAttribute('imagesizes', '100vw');
    link.setAttribute('fetchpriority', 'high');
    document.head.appendChild(link);
  }

  _render() {
    this.innerHTML = `
      <style>
        bw-hero-home {
          display: block;
          width: 100%;
        }

        .bw-hero-home {
          --serif: Merriweather, Georgia, serif;
          background: #102B14;
          color: #FFFFFF;
          font-family: Montserrat, Arial, sans-serif;
          margin: 0;
          max-width: 100%;
          min-height: min(760px, calc(100svh - 96px));
          overflow: hidden;
          position: relative;
        }

        .bw-hero-home *,
        .bw-hero-home *::before,
        .bw-hero-home *::after {
          box-sizing: border-box;
        }

        .bw-hero-home h1,
        .bw-hero-home p {
          margin-top: 0;
        }

        .bw-hero-home .bw-hero-picture,
        .bw-hero-home .bw-hero-picture img,
        .bw-hero-home .bw-hero-overlay {
          inset: 0;
          position: absolute;
        }

        .bw-hero-home .bw-hero-picture {
          z-index: 0;
        }

        .bw-hero-home .bw-hero-picture img {
          height: 100%;
          object-fit: cover;
          object-position: center 42%;
          width: 100%;
        }

        .bw-hero-home .bw-hero-overlay {
          background:
            linear-gradient(90deg, rgba(9, 28, 12, 0.92) 0%, rgba(13, 43, 17, 0.78) 41%, rgba(9, 28, 12, 0.34) 72%, rgba(9, 28, 12, 0.18) 100%),
            linear-gradient(0deg, rgba(9, 28, 12, 0.58) 0%, rgba(9, 28, 12, 0.08) 42%, rgba(9, 28, 12, 0.26) 100%);
          z-index: 1;
        }

        .bw-hero-home .bw-hero-inner {
          display: grid;
          margin: 0 auto;
          max-width: 1240px;
          min-height: inherit;
          padding: 74px 24px 40px;
          position: relative;
          z-index: 2;
        }

        .bw-hero-home .bw-hero-content {
          align-self: center;
          max-width: 720px;
          padding: 28px 0 34px;
        }

        .bw-hero-home .bw-hero-kicker {
          align-items: center;
          color: #FFE600;
          display: flex;
          flex-wrap: wrap;
          font-size: 12px;
          font-weight: 800;
          gap: 10px;
          letter-spacing: 1px;
          line-height: 1.25;
          margin-bottom: 16px;
          text-transform: uppercase;
        }

        .bw-hero-home .bw-hero-kicker::before {
          background: #FFE600;
          border-radius: 999px;
          content: "";
          display: inline-block;
          height: 9px;
          width: 9px;
        }

        .bw-hero-home .bw-hero-title {
          color: #FFFFFF;
          font-size: clamp(42px, 6vw, 78px);
          font-weight: 800;
          letter-spacing: 0;
          line-height: 0.98;
          margin-bottom: 20px;
          max-width: 780px;
        }

        .bw-hero-home .bw-hero-title-mark {
          color: #FFE600;
          display: inline;
        }

        .bw-hero-home .bw-hero-lead {
          color: rgba(255, 255, 255, 0.92);
          font-family: var(--serif);
          font-size: clamp(18px, 2vw, 23px);
          line-height: 1.55;
          margin-bottom: 28px;
          max-width: 650px;
        }

        .bw-hero-home .bw-hero-actions {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-bottom: 28px;
        }

        .bw-hero-home .bw-hero-btn {
          align-items: center;
          border-radius: 999px;
          display: inline-flex;
          font-size: 14px;
          font-weight: 800;
          justify-content: center;
          letter-spacing: 0.7px;
          min-height: 54px;
          padding: 0 26px;
          text-decoration: none;
          text-transform: uppercase;
          transition: background 160ms ease, border-color 160ms ease, color 160ms ease, transform 160ms ease;
        }

        .bw-hero-home .bw-hero-btn-primary {
          background: #FFE600;
          color: #1B5E20;
          min-width: 214px;
        }

        .bw-hero-home .bw-hero-btn-primary:hover,
        .bw-hero-home .bw-hero-btn-primary:focus-visible {
          background: #fff04a;
          transform: translateY(-1px);
        }

        .bw-hero-home .bw-hero-btn-secondary {
          background: rgba(255, 255, 255, 0.08);
          border: 2px solid rgba(255, 255, 255, 0.72);
          color: #FFFFFF;
        }

        .bw-hero-home .bw-hero-btn-secondary:hover,
        .bw-hero-home .bw-hero-btn-secondary:focus-visible {
          background: #FFFFFF;
          color: #1B5E20;
          transform: translateY(-1px);
        }

        .bw-hero-home .bw-hero-btn:focus-visible,
        .bw-hero-home .bw-hero-review:focus-visible {
          outline: 3px solid rgba(255, 230, 0, 0.95);
          outline-offset: 4px;
        }

        .bw-hero-home .bw-hero-proof {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          max-width: 650px;
        }

        .bw-hero-home .bw-hero-proof-item {
          border-left: 1px solid rgba(255, 230, 0, 0.64);
          min-width: 0;
          padding-left: 13px;
        }

        .bw-hero-home .bw-hero-proof-item strong {
          color: #FFE600;
          display: block;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: 0;
          line-height: 1;
          margin-bottom: 5px;
        }

        .bw-hero-home .bw-hero-proof-item span {
          color: rgba(255, 255, 255, 0.86);
          display: block;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.8px;
          line-height: 1.25;
          text-transform: uppercase;
        }

        .bw-hero-home .bw-hero-bottom {
          align-items: end;
          display: grid;
          gap: 18px;
          grid-template-columns: minmax(0, 1fr) auto;
          margin-top: auto;
        }

        .bw-hero-home .bw-hero-route {
          align-items: center;
          backdrop-filter: blur(10px);
          background: rgba(15, 48, 18, 0.72);
          border: 1px solid rgba(197, 225, 165, 0.34);
          border-radius: 8px;
          display: flex;
          gap: 12px;
          max-width: 680px;
          padding: 12px 14px;
        }

        .bw-hero-home .bw-route-dot {
          background: #FFE600;
          border-radius: 999px;
          flex: 0 0 10px;
          height: 10px;
          width: 10px;
        }

        .bw-hero-home .bw-route-line {
          background: linear-gradient(90deg, #FFE600, rgba(255, 230, 0, 0.12));
          flex: 0 0 60px;
          height: 2px;
        }

        .bw-hero-home .bw-hero-route p {
          color: rgba(255, 255, 255, 0.9);
          font-size: 13px;
          font-weight: 700;
          line-height: 1.35;
          margin-bottom: 0;
        }

        .bw-hero-home .bw-route-copy-mobile {
          display: none;
        }

        .bw-hero-home .bw-hero-route strong {
          color: #FFFFFF;
          font-weight: 800;
        }

        .bw-hero-home .bw-hero-review {
          align-items: center;
          background: #FFFFFF;
          border-radius: 8px;
          color: #1B5E20;
          display: inline-flex;
          gap: 10px;
          min-height: 58px;
          padding: 10px 14px;
          text-decoration: none;
        }

        .bw-hero-home .bw-hero-stars {
          color: #F9A825;
          font-size: 14px;
          letter-spacing: 1px;
          line-height: 1;
        }

        .bw-hero-home .bw-hero-review span:last-child {
          color: #1B5E20;
          display: block;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.5px;
          line-height: 1.25;
          text-transform: uppercase;
          white-space: nowrap;
        }

        @media (max-width: 920px) {
          .bw-hero-home {
            min-height: 720px;
          }

          .bw-hero-home .bw-hero-picture img {
            object-position: 56% center;
          }

          .bw-hero-home .bw-hero-overlay {
            background:
              linear-gradient(90deg, rgba(9, 28, 12, 0.93) 0%, rgba(9, 28, 12, 0.78) 58%, rgba(9, 28, 12, 0.36) 100%),
              linear-gradient(0deg, rgba(9, 28, 12, 0.72) 0%, rgba(9, 28, 12, 0.12) 55%, rgba(9, 28, 12, 0.28) 100%);
          }

          .bw-hero-home .bw-hero-inner {
            min-height: inherit;
            padding-top: 58px;
          }

          .bw-hero-home .bw-hero-content {
            max-width: 680px;
          }

          .bw-hero-home .bw-hero-bottom {
            align-items: stretch;
            grid-template-columns: 1fr;
          }

          .bw-hero-home .bw-hero-review {
            justify-content: center;
            width: fit-content;
          }
        }

        @media (max-width: 640px) {
          .bw-hero-home {
            min-height: calc(100svh - 94px);
          }

          .bw-hero-home .bw-hero-picture img {
            object-position: 58% center;
          }

          .bw-hero-home .bw-hero-overlay {
            background:
              linear-gradient(90deg, rgba(9, 28, 12, 0.94) 0%, rgba(9, 28, 12, 0.84) 64%, rgba(9, 28, 12, 0.54) 100%),
              linear-gradient(0deg, rgba(9, 28, 12, 0.78) 0%, rgba(9, 28, 12, 0.18) 50%, rgba(9, 28, 12, 0.36) 100%);
          }

          .bw-hero-home .bw-hero-inner {
            min-height: inherit;
            padding: 44px 16px calc(40px + env(safe-area-inset-bottom));
          }

          .bw-hero-home .bw-hero-content {
            padding-top: 18px;
          }

          .bw-hero-home .bw-hero-kicker {
            font-size: 11px;
            margin-bottom: 13px;
          }

          .bw-hero-home .bw-hero-title {
            font-size: 42px;
            line-height: 1;
            margin-bottom: 16px;
          }

          .bw-hero-home .bw-hero-lead {
            font-size: 17px;
            line-height: 1.5;
            margin-bottom: 22px;
          }

          .bw-hero-home .bw-hero-actions {
            align-items: stretch;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 22px;
          }

          .bw-hero-home .bw-hero-btn {
            min-height: 52px;
            width: 100%;
          }

          .bw-hero-home .bw-hero-proof {
            gap: 12px 8px;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .bw-hero-home .bw-hero-proof-item strong {
            font-size: 22px;
          }

          .bw-hero-home .bw-hero-bottom {
            transform: translateY(-16px);
          }

          .bw-hero-home .bw-hero-route {
            align-items: center;
            flex-wrap: nowrap;
            padding: 10px 12px;
          }

          .bw-hero-home .bw-route-line {
            flex-basis: 40px;
          }

          .bw-hero-home .bw-hero-route p {
            flex: 1 1 auto;
            font-size: 12px;
            line-height: 1.25;
          }

          .bw-hero-home .bw-route-copy-full {
            display: none;
          }

          .bw-hero-home .bw-route-copy-mobile {
            display: inline;
          }

          .bw-hero-home .bw-hero-review {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bw-hero-home .bw-hero-btn,
          .bw-hero-home .bw-hero-review {
            transition: none;
            transform: none;
          }
        }
      </style>

      <section class="bw-hero-home" aria-labelledby="bw-hero-home-title">
        <picture class="bw-hero-picture">
          <source
            type="image/webp"
            srcset="${BW_HERO_HOME_ASSET_BASE}hero-home-museum-island-800w.webp 800w, ${BW_HERO_HOME_ASSET_BASE}hero-home-museum-island-1200w.webp 1200w, ${BW_HERO_HOME_ASSET_BASE}hero-home-museum-island-1600w.webp 1600w"
            sizes="100vw">
          <img
            src="${BW_HERO_HOME_ASSET_BASE}hero-home-museum-island-1600w.jpg"
            srcset="${BW_HERO_HOME_ASSET_BASE}hero-home-museum-island-800w.jpg 800w, ${BW_HERO_HOME_ASSET_BASE}hero-home-museum-island-1200w.jpg 1200w, ${BW_HERO_HOME_ASSET_BASE}hero-home-museum-island-1600w.jpg 1600w"
            sizes="100vw"
            width="1600"
            height="900"
            alt="BerlinWalk guide Yusuf leading guests outside the Altes Museum on Museum Island"
            loading="eager"
            decoding="async"
            fetchpriority="high">
        </picture>
        <div class="bw-hero-overlay" aria-hidden="true"></div>

        <div class="bw-hero-inner">
          <div class="bw-hero-content">
            <span class="bw-hero-kicker">Tip based · 12 stops · ~2h</span>
            <h1 id="bw-hero-home-title" class="bw-hero-title">Free Berlin <span class="bw-hero-title-mark">Walking Tour</span>.</h1>
            <p class="bw-hero-lead">Berlin was founded in 1237, but most tours skip straight to 1933. In about 2 hours, walk the medieval core from Alexanderplatz to Hackescher Markt with Yusuf, and see the city the way a Berliner reads it: oldest streets first.</p>

            <div class="bw-hero-actions">
              <a class="bw-hero-btn bw-hero-btn-primary" href="${BW_HERO_HOME_BOOKING_URL}" target="_top">Book your free spot</a>
              <a class="bw-hero-btn bw-hero-btn-secondary" href="${BW_HERO_HOME_MEETING_URL}" target="_top">Meeting point</a>
            </div>

            <div class="bw-hero-proof" aria-label="Tour highlights">
              <div class="bw-hero-proof-item">
                <strong>9.8</strong>
                <span>On Freetour</span>
              </div>
              <div class="bw-hero-proof-item">
                <strong>12</strong>
                <span>Story stops</span>
              </div>
              <div class="bw-hero-proof-item">
                <strong>~2h</strong>
                <span>Easy walk</span>
              </div>
              <div class="bw-hero-proof-item">
                <strong>Tip</strong>
                <span>Based</span>
              </div>
            </div>
          </div>

          <div class="bw-hero-bottom">
            <div class="bw-hero-route" aria-label="Tour route">
              <span class="bw-route-dot" aria-hidden="true"></span>
              <span class="bw-route-line" aria-hidden="true"></span>
              <span class="bw-route-dot" aria-hidden="true"></span>
              <p><span class="bw-route-copy-full"><strong>Starts:</strong> World Clock, Alexanderplatz. <strong>Ends:</strong> near Hackescher Markt.</span><span class="bw-route-copy-mobile"><strong>World Clock</strong> to <strong>Hackescher Markt</strong></span></p>
            </div>
            <a class="bw-hero-review" href="https://www.berlinwalk.com/reviews" target="_top">
              <span class="bw-hero-stars" aria-hidden="true">★★★★★</span>
              <span>Read reviews</span>
            </a>
          </div>
        </div>
      </section>
    `;
  }
}

if (!customElements.get('bw-hero-home')) {
  customElements.define('bw-hero-home', BWHeroHomeElement);
}
})();
