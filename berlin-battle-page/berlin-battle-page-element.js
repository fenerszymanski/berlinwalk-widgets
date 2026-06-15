(function () {
  const SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : '';
  const BASE_URL = SCRIPT_URL
    ? new URL('../', SCRIPT_URL).toString()
    : 'https://fenerszymanski.github.io/berlinwalk-widgets/';
  const GAME_PATH = 'berlin-battle/';
  const BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
  const ROUTE_URL = 'https://www.berlinwalk.com/berlin-walking-tour-route';

  const asset = (path) => new URL(path, BASE_URL).toString();

  function ensureFont() {
    if (document.querySelector('link[data-bw-battle-page-font]')) return;
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://fonts.gstatic.com';
    preconnect.crossOrigin = 'anonymous';

    const font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Merriweather:wght@400;700&display=swap';
    font.dataset.bwBattlePageFont = 'true';

    document.head.appendChild(preconnect);
    document.head.appendChild(font);
  }

  function isValidHeight(value) {
    return typeof value === 'number' && Number.isFinite(value) && value > 300 && value < 8000;
  }

  class BWBerlinBattlePage extends HTMLElement {
    connectedCallback() {
      ensureFont();
      this._render();
      this._bind();
      this._setupGameResize();
    }

    disconnectedCallback() {
      if (this._messageHandler) window.removeEventListener('message', this._messageHandler);
      if (this._frameLoadHandler && this._gameFrame) this._gameFrame.removeEventListener('load', this._frameLoadHandler);
      if (this._resizeObserver) this._resizeObserver.disconnect();
      if (this._timers) this._timers.forEach((timer) => window.clearTimeout(timer));
    }

    _gameSrc() {
      const url = new URL(GAME_PATH, BASE_URL);
      const current = new URLSearchParams(window.location.search || '');
      ['winner', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'].forEach((key) => {
        if (current.has(key)) url.searchParams.set(key, current.get(key));
      });
      url.searchParams.set('source', current.get('source') || 'berlin_battle_page');
      url.searchParams.set('parent_path', window.location.pathname || '/games/berlin-battle');
      url.searchParams.set('parent_url', window.location.href);
      url.searchParams.set('attribution', 'none');
      url.searchParams.set('v', 'all-modes-chatgpt-assets-20260615');
      return url.toString();
    }

    _render() {
      const heroImage = asset('berlin-battle/assets/social/berlin-battle-social-1200x630.jpg');
      const foodImage = asset('berlin-battle/assets/topics/food-battle-cover.webp');
      const districtImage = asset('berlin-battle/assets/topics/district-battle-cover.webp');
      const museumImage = asset('berlin-battle/assets/topics/museum-battle-cover.webp');
      const nightImage = asset('berlin-battle/assets/topics/night-battle-cover.webp');

      this.innerHTML = `
        <style>${this._styles()}</style>
        <main class="bw-battle-page" style="--battle-hero: url('${heroImage}');" aria-labelledby="bw-battle-title">
          <section class="bw-battle-hero">
            <div class="bw-battle-hero-media" aria-hidden="true"></div>
            <div class="bw-battle-hero-overlay" aria-hidden="true"></div>
            <div class="bw-battle-inner bw-battle-hero-inner">
              <p class="bw-battle-kicker">BerlinWalk game</p>
              <h1 id="bw-battle-title">Berlin Battle</h1>
              <p class="bw-battle-lead">A quick this-or-that game for Berlin tastes, neighborhoods, museums and nights.</p>
              <div class="bw-battle-actions">
                <a class="bw-battle-btn bw-battle-btn-primary" href="#battle-game">Play now</a>
                <a class="bw-battle-btn bw-battle-btn-ghost" href="${ROUTE_URL}">See the walking route</a>
              </div>
            </div>
          </section>

          <section class="bw-battle-strip" aria-label="Berlin Battle modes">
            <div class="bw-battle-inner bw-battle-mode-grid">
              <article>
                <img src="${foodImage}" alt="">
                <div>
                  <span>Live mode</span>
                  <strong>Berlin Food Battle</strong>
                </div>
              </article>
              <article>
                <img src="${districtImage}" alt="">
                <div>
                  <span>Live mode</span>
                  <strong>Berlin District Battle</strong>
                </div>
              </article>
              <article>
                <img src="${museumImage}" alt="">
                <div>
                  <span>Live mode</span>
                  <strong>Berlin Museum Battle</strong>
                </div>
              </article>
              <article>
                <img src="${nightImage}" alt="">
                <div>
                  <span>Live mode</span>
                  <strong>Berlin Night Battle</strong>
                </div>
              </article>
            </div>
          </section>

          <section class="bw-battle-game-band" id="battle-game" aria-label="Berlin Battle game">
            <div class="bw-battle-inner">
              <div class="bw-battle-game-head">
                <div>
                  <p class="bw-battle-section-kicker">Play the game</p>
                  <h2>Choose your winner.</h2>
                </div>
                <p>Pick a mode, choose between two Berlin options, and let the bracket find your winner.</p>
              </div>
              <div class="bw-battle-game-shell">
                <iframe
                  data-bw-battle-frame
                  src="${this._gameSrc()}"
                  allow="web-share; clipboard-write"
                  title="Berlin Battle game"
                  loading="eager"
                  scrolling="no"></iframe>
              </div>
            </div>
          </section>

          <section class="bw-battle-final" aria-label="BerlinWalk connection">
            <div class="bw-battle-inner bw-battle-final-box">
              <div>
                <p class="bw-battle-section-kicker">After the game</p>
                <h2>Want the real city version?</h2>
                <p>Berlin Battle is the playful warm-up. On the walking tour, I connect the places, stories and route stops that make Berlin start to click.</p>
              </div>
              <a class="bw-battle-btn bw-battle-btn-primary" href="${BOOKING_URL}">Walk Berlin with me</a>
            </div>
          </section>
        </main>
      `;
    }

    _bind() {
      this.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (event) => {
          const target = this.querySelector(link.getAttribute('href'));
          if (!target) return;
          event.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
    }

    _setupGameResize() {
      this._gameFrame = this.querySelector('[data-bw-battle-frame]');
      if (!this._gameFrame) return;

      const setFrameHeight = (height) => {
        if (!isValidHeight(height)) return;
        this._gameFrame.style.height = `${Math.ceil(height)}px`;
      };

      this._messageHandler = (event) => {
        if (!this._gameFrame || event.source !== this._gameFrame.contentWindow) return;
        if (!event.data || event.data.type !== 'bw-resize') return;
        setFrameHeight(event.data.height + 10);
      };
      window.addEventListener('message', this._messageHandler);

      this._frameLoadHandler = () => {
        setFrameHeight(620);
      };
      this._gameFrame.addEventListener('load', this._frameLoadHandler);

      this._timers = [200, 800, 1800].map((delay) => window.setTimeout(() => setFrameHeight(620), delay));
    }

    _styles() {
      return `
        bw-berlin-battle-page {
          --bw-green: #1B5E20;
          --bw-green-dark: #123F16;
          --bw-yellow: #FFE600;
          --bw-lime: #7CB342;
          --bw-light-green: #C5E1A5;
          --bw-cream: #FAFAF5;
          --bw-white: #FFFFFF;
          --bw-text: #212121;
          --bw-muted: #526052;
          --bw-border: rgba(27, 94, 32, 0.16);
          display: block;
          font-family: Montserrat, Arial, sans-serif;
          color: var(--bw-text);
          background: var(--bw-cream);
        }

        bw-berlin-battle-page,
        .bw-battle-page,
        .bw-battle-page *,
        .bw-battle-page *::before,
        .bw-battle-page *::after {
          box-sizing: border-box;
        }

        .bw-battle-page {
          background: var(--bw-cream);
          color: var(--bw-text);
          font-family: Montserrat, Arial, sans-serif;
          overflow: hidden;
        }

        .bw-battle-inner {
          width: min(1120px, calc(100% - 32px));
          margin: 0 auto;
        }

        .bw-battle-hero {
          min-height: clamp(390px, 48vw, 560px);
          position: relative;
          display: grid;
          align-items: end;
          isolation: isolate;
          background: var(--bw-green-dark);
        }

        .bw-battle-hero-media {
          position: absolute;
          inset: 0;
          background-image: var(--battle-hero);
          background-size: cover;
          background-position: center;
          transform: scale(1.01);
          z-index: -2;
        }

        .bw-battle-hero-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(18, 63, 22, 0.90) 0%, rgba(18, 63, 22, 0.66) 38%, rgba(18, 63, 22, 0.18) 100%),
            linear-gradient(0deg, rgba(18, 63, 22, 0.84) 0%, rgba(18, 63, 22, 0.08) 48%);
          z-index: -1;
        }

        .bw-battle-hero-inner {
          padding: clamp(76px, 9vw, 112px) 0 clamp(28px, 4vw, 42px);
        }

        .bw-battle-kicker,
        .bw-battle-section-kicker {
          color: var(--bw-yellow);
          display: block;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 2px;
          line-height: 1.2;
          margin: 0 0 12px;
          text-transform: uppercase;
        }

        .bw-battle-hero h1 {
          color: var(--bw-white);
          font-size: clamp(52px, 9vw, 112px);
          font-weight: 900;
          letter-spacing: 0;
          line-height: 0.88;
          margin: 0;
          max-width: 760px;
        }

        .bw-battle-lead {
          color: #EEF7E6;
          font-size: clamp(17px, 2.1vw, 24px);
          font-weight: 750;
          line-height: 1.42;
          margin: 20px 0 0;
          max-width: 720px;
        }

        .bw-battle-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 24px;
        }

        .bw-battle-btn {
          align-items: center;
          border-radius: 999px;
          display: inline-flex;
          font-size: 13px;
          font-weight: 900;
          justify-content: center;
          min-height: 46px;
          padding: 14px 18px;
          text-decoration: none;
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
        }

        .bw-battle-btn:hover,
        .bw-battle-btn:focus-visible {
          outline: none;
          transform: translateY(-1px);
        }

        .bw-battle-btn-primary {
          background: var(--bw-yellow);
          color: var(--bw-green);
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.18);
        }

        .bw-battle-btn-ghost {
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.42);
          color: var(--bw-white);
        }

        .bw-battle-strip {
          background:
            linear-gradient(180deg, rgba(18, 63, 22, 0) 0%, rgba(27, 94, 32, 0.92) 58%, var(--bw-green) 100%);
          border-top: 0;
          color: var(--bw-white);
          margin-top: -86px;
          padding: 0 0 18px;
          position: relative;
          z-index: 3;
        }

        .bw-battle-mode-grid {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .bw-battle-mode-grid article {
          align-items: center;
          background: rgba(27, 94, 32, 0.88);
          border: 1px solid rgba(255, 255, 255, 0.24);
          border-radius: 10px;
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.16);
          display: grid;
          gap: 12px;
          grid-template-columns: 76px minmax(0, 1fr);
          min-width: 0;
          padding: 10px;
        }

        .bw-battle-mode-grid img {
          aspect-ratio: 16 / 10;
          border-radius: 8px;
          display: block;
          object-fit: cover;
          width: 76px;
        }

        .bw-battle-mode-grid span {
          color: var(--bw-yellow);
          display: block;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.2px;
          line-height: 1.2;
          text-transform: uppercase;
        }

        .bw-battle-mode-grid strong {
          color: var(--bw-white);
          display: block;
          font-size: 15px;
          font-weight: 900;
          line-height: 1.18;
          margin-top: 4px;
        }

        .bw-battle-game-band {
          padding: clamp(28px, 5vw, 54px) 0;
        }

        .bw-battle-game-head {
          align-items: end;
          display: grid;
          gap: 18px;
          grid-template-columns: minmax(0, 0.8fr) minmax(280px, 0.55fr);
          margin-bottom: 18px;
        }

        .bw-battle-game-head .bw-battle-section-kicker,
        .bw-battle-final .bw-battle-section-kicker {
          color: var(--bw-green);
        }

        .bw-battle-game-head h2,
        .bw-battle-final h2 {
          color: var(--bw-text);
          font-size: clamp(30px, 4.8vw, 58px);
          font-weight: 900;
          letter-spacing: 0;
          line-height: 0.96;
          margin: 0;
        }

        .bw-battle-game-head p,
        .bw-battle-final p {
          color: var(--bw-muted);
          font-size: 16px;
          font-weight: 700;
          line-height: 1.55;
          margin: 0;
        }

        .bw-battle-game-shell {
          background:
            linear-gradient(135deg, rgba(255, 230, 0, 0.15), rgba(124, 179, 66, 0.10)),
            var(--bw-cream);
          border: 1px solid var(--bw-border);
          border-radius: 16px;
          box-shadow: 0 18px 50px rgba(18, 63, 22, 0.13);
          overflow: hidden;
        }

        .bw-battle-game-shell iframe {
          border: 0;
          display: block;
          height: 620px;
          overflow: hidden;
          width: 100%;
        }

        .bw-battle-final {
          padding: 0 0 clamp(34px, 6vw, 70px);
        }

        .bw-battle-final-box {
          align-items: center;
          background: var(--bw-white);
          border: 1px solid var(--bw-border);
          border-left: 8px solid var(--bw-yellow);
          border-radius: 14px;
          display: grid;
          gap: 22px;
          grid-template-columns: minmax(0, 1fr) auto;
          padding: clamp(20px, 4vw, 34px);
        }

        .bw-battle-final .bw-battle-btn-primary {
          background: var(--bw-green);
          color: var(--bw-white);
        }

        @media (max-width: 820px) {
          .bw-battle-inner {
            width: min(100% - 24px, 1120px);
          }

          .bw-battle-hero {
            min-height: 480px;
          }

          .bw-battle-hero-overlay {
            background:
              linear-gradient(0deg, rgba(18, 63, 22, 0.92) 0%, rgba(18, 63, 22, 0.54) 62%, rgba(18, 63, 22, 0.14) 100%);
          }

          .bw-battle-mode-grid {
            grid-template-columns: minmax(0, 1fr);
          }

          .bw-battle-strip {
            margin-top: -58px;
          }

          .bw-battle-game-head,
          .bw-battle-final-box {
            grid-template-columns: minmax(0, 1fr);
          }

          .bw-battle-final-box .bw-battle-btn {
            justify-self: start;
          }
        }

        @media (max-width: 520px) {
          .bw-battle-hero {
            min-height: 460px;
          }

          .bw-battle-hero-inner {
            padding-bottom: 30px;
          }

          .bw-battle-actions,
          .bw-battle-final-box .bw-battle-btn {
            width: 100%;
          }

          .bw-battle-btn {
            width: 100%;
          }

          .bw-battle-final-box .bw-battle-btn {
            justify-self: stretch;
            max-width: 100%;
            min-width: 0;
            width: auto;
          }

          .bw-battle-mode-grid article {
            grid-template-columns: 68px minmax(0, 1fr);
          }

          .bw-battle-strip {
            margin-top: -44px;
          }

          .bw-battle-mode-grid img {
            width: 68px;
          }

          .bw-battle-game-shell {
            border-radius: 12px;
          }
        }
      `;
    }
  }

  if (!customElements.get('bw-berlin-battle-page')) {
    customElements.define('bw-berlin-battle-page', BWBerlinBattlePage);
  }
})();
