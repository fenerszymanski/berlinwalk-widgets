const SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : '';
const BASE_URL = SCRIPT_URL
  ? new URL('../', SCRIPT_URL).toString()
  : 'https://fenerszymanski.github.io/berlinwalk-widgets/';
const ASSET_BUILD = 'day-survival-height-lock-20260707b';
const GAMES_PREVIEW_BUILD = 'games-preview-rail-20260629c';
const NATIVE_GAME_BUILD = 'native-games-20260707a';

function loadGamesPreviewRail(callback) {
  if (window.BerlinWalkGamesPreviewRail) {
    callback();
    return;
  }
  const existing = document.querySelector('script[data-bw-games-preview-rail]');
  if (existing) {
    existing.addEventListener('load', callback, { once: true });
    return;
  }
  const script = document.createElement('script');
  script.src = new URL(`js/games-preview-rail.js?v=${GAMES_PREVIEW_BUILD}`, BASE_URL).toString();
  script.defer = true;
  script.dataset.bwGamesPreviewRail = 'true';
  script.addEventListener('load', callback, { once: true });
  document.head.appendChild(script);
}

function loadNativeGameMount(callback) {
  if (window.BerlinWalkNativeGameMount) {
    callback();
    return;
  }
  const existing = document.querySelector('script[data-bw-native-game-mount]');
  if (existing) {
    existing.addEventListener('load', callback, { once: true });
    return;
  }
  const script = document.createElement('script');
  script.src = new URL(`js/native-game-mount.js?v=${NATIVE_GAME_BUILD}`, BASE_URL).toString();
  script.defer = true;
  script.dataset.bwNativeGameMount = 'true';
  script.addEventListener('load', callback, { once: true });
  document.head.appendChild(script);
}

class BwBerlinDaySurvivalPage extends HTMLElement {
  connectedCallback() {
    this._render();
    this._bind();
  }

  disconnectedCallback() {
    if (this._handleHostResize) window.removeEventListener('resize', this._handleHostResize);
    if (this._resizeObserver) this._resizeObserver.disconnect();
    if (this._timers) this._timers.forEach((timer) => window.clearTimeout(timer));
  }

  _gameUrl() {
    const source = new URL(`${BASE_URL}berlin-day-survival/`);
    source.searchParams.set('v', ASSET_BUILD);
    source.searchParams.set('attribution', 'none');
    source.searchParams.set('resize', 'none');
    source.searchParams.set('parent_path', window.location.pathname || '/games/berlin-day-survival');
    source.searchParams.set('parent_url', window.location.href || 'https://www.berlinwalk.com/games/berlin-day-survival');

    const current = new URLSearchParams(window.location.search || '');
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'tracking'].forEach((key) => {
      const value = current.get(key);
      if (value) source.searchParams.set(key, value);
    });
    return source.toString();
  }

  _render() {
    this.innerHTML = `
      <style>
        bw-berlin-day-survival-page {
          --green: #1B5E20;
          --green-dark: #073B16;
          --yellow: #FFE600;
          --lime: #7CB342;
          --cream: #FAFAF5;
          --paper: #FFFFFF;
          --ink: #212121;
          --muted: #526052;
          --red: #E63946;
          --sky: #1D8A99;
          background:
            linear-gradient(90deg, rgba(27, 94, 32, 0.07) 1px, transparent 1px),
            linear-gradient(180deg, rgba(27, 94, 32, 0.07) 1px, transparent 1px),
            var(--cream);
          background-size: 34px 34px;
          color: var(--ink);
          display: block;
          font-family: Montserrat, Arial, sans-serif;
          overflow: visible;
          position: relative;
          width: 100%;
        }

        bw-berlin-day-survival-page::before {
          background: var(--yellow);
          content: "";
          height: 5px;
          left: 0;
          position: absolute;
          right: 36%;
          top: 0;
        }

        bw-berlin-day-survival-page *,
        bw-berlin-day-survival-page *::before,
        bw-berlin-day-survival-page *::after {
          box-sizing: border-box;
        }

        .bw-day-page {
          display: grid;
          gap: 34px 58px;
          grid-template-areas:
            "content game"
            "cta game"
            "more more";
          grid-template-columns: minmax(0, 1fr) minmax(360px, 460px);
          margin: 0 auto;
          max-width: 1180px;
          min-height: 0 !important;
          padding: clamp(48px, 7svh, 64px) 24px 24px;
        }

        .bw-day-content {
          align-self: start;
          grid-area: content;
          min-width: 0;
        }

        .bw-day-eyebrow {
          background: var(--yellow);
          border: 2px solid var(--green-dark);
          border-radius: 8px;
          box-shadow: 4px 4px 0 var(--green-dark);
          color: var(--green-dark);
          display: inline-flex;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.12em;
          margin-bottom: 28px;
          padding: 8px 12px;
          text-transform: uppercase;
        }

        .bw-day-content h1 {
          color: var(--green-dark);
          font-size: clamp(56px, 7.2vw, 102px);
          font-weight: 950;
          letter-spacing: 0;
          line-height: 0.9;
          margin: 0 0 22px;
          max-width: 720px;
        }

        .bw-day-content h1 span {
          color: var(--red);
          display: block;
        }

        .bw-day-lead {
          color: var(--muted);
          font-size: clamp(18px, 1.65vw, 22px);
          font-weight: 800;
          line-height: 1.52;
          margin: 0 0 30px;
          max-width: 650px;
        }

        .bw-day-list {
          display: grid;
          gap: 13px;
          list-style: none;
          margin: 0;
          max-width: 560px;
          padding: 0;
        }

        .bw-day-list li {
          align-items: center;
          color: var(--green-dark);
          display: flex;
          font-size: 15px;
          font-weight: 850;
          gap: 12px;
        }

        .bw-day-list li::before {
          background: var(--lime);
          border: 2px solid var(--green-dark);
          box-shadow: 2px 2px 0 var(--green-dark);
          content: "";
          flex: 0 0 11px;
          height: 11px;
          transform: rotate(45deg);
          width: 11px;
        }

        .bw-day-tour-cta {
          align-self: start;
          background: rgba(255, 255, 255, 0.78);
          border: 2px solid var(--green-dark);
          border-left: 7px solid var(--red);
          border-radius: 12px;
          box-shadow: 6px 6px 0 var(--green-dark);
          grid-area: cta;
          max-width: 650px;
          padding: 24px;
        }

        .bw-day-games-preview {
          grid-area: more;
          min-width: 0;
        }

        .bw-day-tour-cta h2 {
          color: var(--green-dark);
          font-size: 20px;
          margin: 0 0 8px;
        }

        .bw-day-tour-cta p {
          color: var(--muted);
          font-size: 14px;
          font-weight: 750;
          line-height: 1.5;
          margin: 0 0 16px;
        }

        .bw-day-tour-cta a {
          align-items: center;
          background: var(--yellow);
          border: 2px solid var(--green-dark);
          border-radius: 9px;
          box-shadow: 4px 4px 0 var(--green-dark);
          color: var(--green-dark);
          display: inline-flex;
          font-size: 13px;
          font-weight: 950;
          min-height: 44px;
          padding: 11px 16px;
          text-decoration: none;
          text-transform: uppercase;
        }

        .bw-day-device {
          align-self: start;
          background: var(--green-dark);
          border-radius: 34px;
          box-shadow: 12px 12px 0 var(--red), 0 28px 70px rgba(8, 36, 16, 0.28);
          grid-area: game;
          height: clamp(560px, calc(100svh - 170px), 700px) !important;
          max-height: 700px !important;
          max-width: 460px;
          min-height: 0 !important;
          overflow: hidden;
          padding: 12px;
          position: relative;
          width: 100%;
        }

        .bw-day-device::before {
          background: var(--yellow);
          border-radius: 999px;
          content: "";
          height: 16px;
          left: 50%;
          position: absolute;
          top: 7px;
          transform: translateX(-50%);
          width: 74px;
          z-index: 2;
        }

        .bw-day-frame {
          background: var(--cream);
          border-radius: 23px;
          display: block;
          height: 100% !important;
          min-height: 0 !important;
          overflow: hidden;
          width: 100%;
        }

        @media (max-width: 960px) {
          .bw-day-page {
            gap: 34px;
            grid-template-areas:
              "content"
              "game"
              "cta"
              "more";
            grid-template-columns: 1fr;
            padding: 44px 18px 20px;
          }

          .bw-day-content {
            text-align: center;
          }

          .bw-day-content h1 {
            font-size: clamp(44px, 13.5vw, 70px);
            margin-left: auto;
            margin-right: auto;
          }

          .bw-day-lead {
            margin-left: auto;
            margin-right: auto;
          }

          .bw-day-list {
            margin-left: auto;
            margin-right: auto;
            text-align: left;
          }

          .bw-day-device {
            border-radius: 24px;
            box-shadow: 8px 8px 0 var(--red), 0 20px 44px rgba(8, 36, 16, 0.22);
            height: clamp(548px, calc(100svh - 82px), 640px) !important;
            margin: 0 auto;
            max-height: 640px !important;
            max-width: 390px;
            padding: 10px;
          }

          .bw-day-frame {
            border-radius: 17px;
          }

          .bw-day-tour-cta {
            margin: 0 auto;
            max-width: 390px;
          }
        }
      </style>

      <main class="bw-day-page">
        <section class="bw-day-content" aria-labelledby="bw-day-title">
          <div class="bw-day-eyebrow">Playable now</div>
          <h1 id="bw-day-title">Berlin Day <span>Survival</span></h1>
          <p class="bw-day-lead">Pick a budget, survive six small Berlin decisions, and find out whether your day ends as smart wandering or late-night damage control.</p>
          <ul class="bw-day-list">
            <li>Choose EUR 10, EUR 15 or EUR 20</li>
            <li>Handle breakfast, water, lunch, benches and late-night food</li>
            <li>Play with scene sounds, dry feedback voice and share cards</li>
          </ul>
        </section>

        <div class="bw-day-device" id="berlin-day-survival-game">
          <div
            class="bw-day-frame"
            data-bw-native-game
            data-game-url="${this._gameUrl()}"
            role="application"
            aria-label="Berlin Day Survival game"></div>
        </div>

        <section class="bw-day-tour-cta">
          <h2>Survived the snacks?</h2>
          <p>Now let me show you the city properly. Join my ~2h Berlin walking tour from Alexanderplatz and make the first day make sense.</p>
          <a href="https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based?utm_source=game_page&utm_medium=berlin_day_survival&utm_campaign=berlinwalk_games&utm_content=page_cta">Book the Walking Tour</a>
        </section>

        <section class="bw-day-games-preview" data-bw-games-preview aria-label="More BerlinWalk games"></section>
      </main>
    `;
  }

  _bind() {
    this._handleHostResize = () => this._syncWixHostHeight();
    window.addEventListener('resize', this._handleHostResize, { passive: true });
    if ('ResizeObserver' in window) {
      this._resizeObserver = new ResizeObserver(() => this._queueHostSync());
      const page = this.querySelector('.bw-day-page');
      if (page) this._resizeObserver.observe(page);
    }
    this._timers = [120, 700, 1600].map((delay) => window.setTimeout(() => this._syncWixHostHeight(), delay));
    this._renderGamesPreview();
    this._mountNativeGame();
    this._syncWixHostHeight();
  }

  _mountNativeGame() {
    const host = this.querySelector('[data-bw-native-game]');
    if (!host) return;
    loadNativeGameMount(() => {
      if (!window.BerlinWalkNativeGameMount) return;
      window.BerlinWalkNativeGameMount.mount({
        host,
        url: host.dataset.gameUrl,
        baseUrl: new URL('berlin-day-survival/', BASE_URL).toString(),
        kind: 'day-survival'
      });
    });
  }

  _renderGamesPreview() {
    const target = this.querySelector('[data-bw-games-preview]');
    if (!target) return;
    loadGamesPreviewRail(() => {
      if (!window.BerlinWalkGamesPreviewRail) return;
      window.BerlinWalkGamesPreviewRail.render(target, {
        current: 'berlin-day-survival',
        source: 'berlin_day_survival_page'
      });
      this._queueHostSync();
    });
  }

  _queueHostSync() {
    window.requestAnimationFrame(() => this._syncWixHostHeight());
  }

  _syncWixHostHeight() {
    const page = this.querySelector('.bw-day-page');
    if (!page) return;
    const height = Math.ceil(page.getBoundingClientRect().height);
    const wixShell = this.parentElement;
    if (!wixShell || !wixShell.id || !wixShell.id.startsWith('comp-')) return;

    const targets = [
      wixShell,
      wixShell.parentElement,
      this.closest('section'),
    ].filter(Boolean);

    const targetHeight = `${Math.min(Math.max(height + 8, 760), 2400)}px`;
    targets.forEach((target) => {
      target.style.setProperty('height', targetHeight, 'important');
      target.style.setProperty('min-height', targetHeight, 'important');
    });
  }
}

if (!customElements.get('bw-berlin-day-survival-page')) {
  customElements.define('bw-berlin-day-survival-page', BwBerlinDaySurvivalPage);
}
