(function () {
  const SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : '';
  const BASE_URL = SCRIPT_URL
    ? new URL('../', SCRIPT_URL).toString()
    : 'https://fenerszymanski.github.io/berlinwalk-widgets/';
  const GAME_PATH = 'berlin-battle/';
  const BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
  const ASSET_BUILD = 'battle-game-focus-20260623';
  const GAMES_PREVIEW_BUILD = 'games-preview-rail-20260629c';
  const TOPIC_TITLES = {
    food: 'Berlin Food Battle',
    districts: 'Berlin District Battle',
    museums: 'Berlin Museum Battle',
    clubs: 'Berlin Night Battle',
    transport: 'Berlin Transport Battle',
    'techno-clubs': 'Berlin Techno Club Battle',
    'doner-shops': 'D&ouml;ner Shops Battle',
    'currywurst-shops': 'Currywurst Shops Battle',
    'parks-lakes': 'Berlin Park &amp; Lakes Battle',
    'ubahn-sbahn-lines': 'Berlin U-Bahn &amp; S-Bahn Lines Battle',
  };

  function ensureFont() {
    if (document.querySelector('link[data-bw-battle-page-font]')) return;
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://fonts.gstatic.com';
    preconnect.crossOrigin = 'anonymous';

    const font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,800;9..144,900&family=Space+Grotesk:wght@400;600;700&display=swap';
    font.dataset.bwBattlePageFont = 'true';

    document.head.appendChild(preconnect);
    document.head.appendChild(font);
  }

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
      ['topic', 'winner', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'].forEach((key) => {
        if (current.has(key)) url.searchParams.set(key, current.get(key));
      });
      url.searchParams.set('source', current.get('source') || 'berlin_battle_page');
      url.searchParams.set('parent_path', window.location.pathname || '/games/berlin-battle');
      url.searchParams.set('parent_url', window.location.href);
      url.searchParams.set('attribution', 'none');
      url.searchParams.set('v', ASSET_BUILD);
      return url.toString();
    }

    _directTopicId() {
      const current = new URLSearchParams(window.location.search || '');
      const topic = (current.get('topic') || '').replace(/[^a-z0-9_-]/gi, '');
      return TOPIC_TITLES[topic] ? topic : '';
    }

    _render() {
      const directTopicId = this._directTopicId();
      const isDirectPlay = Boolean(directTopicId);
      const pageClass = isDirectPlay ? 'bw-battle-page bw-battle-page-direct' : 'bw-battle-page';
      const heroTitle = isDirectPlay ? 'Pick your Berlin winner' : 'Berlin Battle';
      const heroAccent = isDirectPlay ? '' : '<span>Pick Your Winner</span>';
      const heroLead = isDirectPlay
        ? 'Your first match is ready below. Tap one card and keep choosing until one Berlin favorite wins.'
        : 'Food, districts, museums, night plans, transport lines and tiny Berlin loyalties go head to head. Pick fast, get a winner, then meet the real city outside the screen.';
      const featureList = isDirectPlay
        ? ''
        : '<ul class="bw-battle-feature-list"><li>Choose between real Berlin favorites</li><li>Start any one of 10 battle modes</li><li>Get a shareable winner card</li><li>Turn the picks into places to visit</li></ul>';
      const deviceLabel = isDirectPlay ? TOPIC_TITLES[directTopicId] : '10 Battle Modes';

      this.innerHTML = `
        <style>${this._styles()}</style>
        <main class="${pageClass}" aria-labelledby="bw-battle-title">
          <section class="bw-battle-stage">
            <div class="bw-battle-layout">
              <div class="bw-battle-copy">
                <div class="bw-battle-eyebrow">Playable Now</div>
                <h1 id="bw-battle-title">${heroTitle}${heroAccent}</h1>
                <p class="bw-battle-lead">${heroLead}</p>
                ${featureList}
              </div>

              <div class="bw-battle-device" id="battle-game">
                <div class="bw-battle-device-label" aria-hidden="true">
                  <span>BerlinWalk</span>
                  <strong>${deviceLabel}</strong>
                </div>
                <div class="bw-battle-screen">
                  <iframe
                    data-bw-battle-frame
                    data-src="${this._gameSrc()}"
                    src="about:blank"
                    allow="web-share; clipboard-write"
                    title="Berlin Battle game"
                    loading="eager"
                    scrolling="no"></iframe>
                </div>
              </div>

              <div class="bw-battle-tour-cta">
                <h3>Want the real city version?</h3>
                <p>After your winner, come walk the streets behind the choices. Join my tip-based Berlin walking tour and turn the game into places you can stand in.</p>
                <a href="${BOOKING_URL}">Book the Walking Tour</a>
              </div>
            </div>
            <section class="bw-battle-games-preview" data-bw-games-preview aria-label="More BerlinWalk games"></section>
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
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      });
      this._renderGamesPreview();
    }

    _renderGamesPreview() {
      const target = this.querySelector('[data-bw-games-preview]');
      if (!target) return;
      loadGamesPreviewRail(() => {
        if (!window.BerlinWalkGamesPreviewRail) return;
        window.BerlinWalkGamesPreviewRail.render(target, {
          current: 'berlin-battle',
          source: 'berlin_battle_page'
        });
      });
    }

    _setupGameResize() {
      this._gameFrame = this.querySelector('[data-bw-battle-frame]');
      if (!this._gameFrame) return;

      this._hasChildResize = false;
      this._timers = [];

      const setFrameHeight = (height, fromChild) => {
        if (!isValidHeight(height)) return;
        if (!fromChild && this._hasChildResize) return;
        if (fromChild) this._hasChildResize = true;
        this._gameFrame.style.height = `${Math.ceil(height)}px`;
      };

      const queueGameFocus = () => {
        [80, 260].forEach((delay) => {
          this._timers.push(window.setTimeout(() => this._focusGameDevice(), delay));
        });
      };

      this._messageHandler = (event) => {
        if (!this._gameFrame || event.source !== this._gameFrame.contentWindow) return;
        if (!event.data || !event.data.type) return;
        if (event.data.type === 'bw-resize') {
          setFrameHeight(event.data.height + 10, true);
          return;
        }
        if (event.data.type === 'bw-battle-focus-game') {
          queueGameFocus();
        }
      };
      window.addEventListener('message', this._messageHandler);

      this._frameLoadHandler = () => {
        setFrameHeight(620, false);
      };
      this._gameFrame.addEventListener('load', this._frameLoadHandler);

      const pendingSrc = this._gameFrame.dataset.src;
      if (pendingSrc) this._gameFrame.src = pendingSrc;

      [200, 800, 1800].forEach((delay) => {
        this._timers.push(window.setTimeout(() => setFrameHeight(620, false), delay));
      });
    }

    _focusGameDevice() {
      const device = this.querySelector('.bw-battle-device');
      if (!device) return;
      const rect = device.getBoundingClientRect();
      if (!rect.height) return;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 720;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const visibleTop = Math.max(18, (viewportHeight - Math.min(rect.height, viewportHeight - 24)) / 2);
      const top = Math.max(0, scrollY + rect.top - visibleTop);
      const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({
        top: Math.round(top),
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    }

    _styles() {
      return `
        bw-berlin-battle-page {
          --bb-paper: #FFF2DC;
          --bb-paper-deep: #FFE1B5;
          --bb-ink: #102B36;
          --bb-ink-soft: rgba(16, 43, 54, 0.78);
          --bb-coral: #FF5A3D;
          --bb-coral-dark: #CF321E;
          --bb-teal: #147B78;
          --bb-sun: #FFD447;
          --bb-white: #FFFCF5;
          --bb-line: rgba(16, 43, 54, 0.18);
          display: block;
          font-family: 'Space Grotesk', Arial, sans-serif;
          color: var(--bb-ink);
          background: var(--bb-paper);
          overflow: visible;
          position: relative;
          z-index: 0;
        }

        bw-berlin-battle-page,
        .bw-battle-page,
        .bw-battle-page *,
        .bw-battle-page *::before,
        .bw-battle-page *::after {
          box-sizing: border-box;
        }

        .bw-battle-page {
          background:
            linear-gradient(90deg, rgba(255, 90, 61, 0.08), rgba(20, 123, 120, 0.10)),
            repeating-linear-gradient(90deg, rgba(16, 43, 54, 0.035) 0, rgba(16, 43, 54, 0.035) 1px, transparent 1px, transparent 72px),
            var(--bb-paper);
          color: var(--bb-ink);
          font-family: 'Space Grotesk', Arial, sans-serif;
          overflow: hidden;
        }

        .bw-battle-stage {
          padding: 58px 20px 64px;
          position: relative;
        }

        .bw-battle-stage::before {
          background:
            linear-gradient(135deg, transparent 0, transparent 48%, rgba(255, 90, 61, 0.18) 48%, rgba(255, 90, 61, 0.18) 52%, transparent 52%),
            linear-gradient(45deg, transparent 0, transparent 47%, rgba(20, 123, 120, 0.16) 47%, rgba(20, 123, 120, 0.16) 51%, transparent 51%);
          content: "";
          inset: 0;
          opacity: 0.6;
          pointer-events: none;
          position: absolute;
        }

        .bw-battle-layout {
          align-items: start;
          display: grid;
          gap: 36px 58px;
          grid-template-areas:
            "content game"
            "cta game";
          grid-template-columns: minmax(0, 1fr) minmax(330px, 460px);
          grid-template-rows: auto minmax(0, 1fr);
          margin: 0 auto;
          max-width: 1200px;
          position: relative;
          z-index: 1;
        }

        .bw-battle-games-preview {
          margin-top: 48px;
          position: relative;
          z-index: 1;
        }

        .bw-battle-copy {
          grid-area: content;
          max-width: 650px;
          min-width: 0;
        }

        .bw-battle-eyebrow {
          background: var(--bb-sun);
          border: 2px solid var(--bb-ink);
          border-radius: 6px;
          box-shadow: 5px 5px 0 rgba(16, 43, 54, 0.18);
          color: var(--bb-ink);
          display: inline-block;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0;
          line-height: 1.2;
          margin: 0 0 22px;
          padding: 7px 12px;
          text-transform: uppercase;
        }

        .bw-battle-copy h1 {
          color: var(--bb-ink);
          font-family: 'Fraunces', Georgia, serif;
          font-size: 88px;
          font-weight: 900;
          letter-spacing: 0;
          line-height: 0.88;
          margin: 0;
        }

        .bw-battle-copy h1 span {
          color: var(--bb-coral);
          display: block;
          font-family: 'Space Grotesk', Arial, sans-serif;
          font-size: 52px;
          font-weight: 900;
          letter-spacing: 0;
          line-height: 0.94;
          margin-top: 10px;
          text-transform: uppercase;
        }

        .bw-battle-lead {
          color: var(--bb-ink-soft);
          font-size: 20px;
          font-weight: 600;
          line-height: 1.55;
          margin: 26px 0 0;
          max-width: 580px;
        }

        .bw-battle-feature-list {
          display: grid;
          gap: 12px;
          list-style: none;
          margin: 34px 0 0;
          padding: 0;
        }

        .bw-battle-feature-list li {
          align-items: center;
          color: var(--bb-ink);
          display: flex;
          font-size: 16px;
          font-weight: 700;
          gap: 12px;
          line-height: 1.35;
        }

        .bw-battle-feature-list li::before {
          background: var(--bb-coral);
          border: 2px solid var(--bb-ink);
          content: "";
          display: block;
          flex: 0 0 auto;
          height: 10px;
          transform: rotate(45deg);
          width: 10px;
        }

        .bw-battle-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 34px;
        }

        .bw-battle-btn,
        .bw-battle-tour-cta a {
          align-items: center;
          border: 2px solid var(--bb-ink);
          border-radius: 6px;
          display: inline-flex;
          font-size: 15px;
          font-weight: 900;
          justify-content: center;
          letter-spacing: 0;
          min-height: 48px;
          padding: 13px 20px;
          text-decoration: none;
          text-transform: uppercase;
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
        }

        .bw-battle-btn:hover,
        .bw-battle-btn:focus-visible,
        .bw-battle-tour-cta a:hover,
        .bw-battle-tour-cta a:focus-visible {
          outline: none;
          transform: translateY(-2px);
        }

        .bw-battle-btn-primary,
        .bw-battle-tour-cta a {
          background: var(--bb-coral);
          box-shadow: 6px 6px 0 var(--bb-ink);
          color: var(--bb-white);
        }

        .bw-battle-btn-primary:hover,
        .bw-battle-btn-primary:focus-visible,
        .bw-battle-tour-cta a:hover,
        .bw-battle-tour-cta a:focus-visible {
          background: var(--bb-coral-dark);
          box-shadow: 4px 4px 0 var(--bb-ink);
        }

        .bw-battle-device {
          align-self: start;
          background: var(--bb-ink);
          border: 8px solid var(--bb-ink);
          border-radius: 32px;
          box-shadow: 20px 22px 0 rgba(20, 123, 120, 0.24), 0 28px 60px rgba(16, 43, 54, 0.22);
          grid-area: game;
          margin: 0 auto;
          max-width: 460px;
          padding: 10px;
          position: relative;
          width: min(100%, 460px);
        }

        .bw-battle-device::before {
          border: 3px solid var(--bb-coral);
          border-radius: 32px;
          content: "";
          inset: 16px -18px -18px 16px;
          pointer-events: none;
          position: absolute;
          transform: rotate(1.5deg);
          z-index: -1;
        }

        .bw-battle-device-label {
          align-items: center;
          background: var(--bb-sun);
          border: 2px solid var(--bb-ink);
          border-radius: 20px 20px 8px 8px;
          color: var(--bb-ink);
          display: flex;
          font-size: 12px;
          font-weight: 900;
          gap: 12px;
          justify-content: space-between;
          letter-spacing: 0;
          line-height: 1.1;
          padding: 10px 14px;
          text-transform: uppercase;
        }

        .bw-battle-device-label strong {
          color: var(--bb-teal);
          font-size: 12px;
          letter-spacing: 0;
          text-align: right;
        }

        .bw-battle-screen {
          background: var(--bb-white);
          border-radius: 22px;
          margin-top: 10px;
          overflow: hidden;
        }

        .bw-battle-screen iframe {
          border: 0;
          display: block;
          height: 620px;
          overflow: hidden;
          width: 100%;
        }

        .bw-battle-tour-cta {
          align-self: start;
          background: rgba(255, 252, 245, 0.92);
          border: 2px solid var(--bb-ink);
          border-left: 8px solid var(--bb-coral);
          border-radius: 8px;
          box-shadow: 10px 10px 0 rgba(16, 43, 54, 0.12);
          grid-area: cta;
          max-width: 650px;
          padding: 24px;
        }

        .bw-battle-tour-cta h3 {
          color: var(--bb-ink);
          font-size: 19px;
          font-weight: 900;
          letter-spacing: 0;
          line-height: 1.15;
          margin: 0 0 9px;
        }

        .bw-battle-tour-cta p {
          color: var(--bb-ink-soft);
          font-size: 15px;
          font-weight: 600;
          line-height: 1.5;
          margin: 0 0 18px;
        }

        .bw-battle-tour-cta a {
          min-height: 44px;
          padding: 11px 18px;
        }

        .bw-battle-page-direct .bw-battle-stage {
          padding: 18px 16px 40px;
        }

        .bw-battle-page-direct .bw-battle-layout {
          align-items: start;
          gap: 16px;
          grid-template-areas:
            "content"
            "game"
            "cta";
          grid-template-columns: minmax(0, 1fr);
          grid-template-rows: auto auto auto;
          max-width: 1120px;
        }

        .bw-battle-page-direct .bw-battle-copy {
          background: rgba(255, 252, 245, 0.86);
          border: 1px solid var(--bb-line);
          border-left: 6px solid var(--bb-coral);
          border-radius: 8px;
          max-width: 100%;
          padding: 16px 18px;
        }

        .bw-battle-page-direct .bw-battle-eyebrow {
          box-shadow: none;
          font-size: 11px;
          margin-bottom: 7px;
          padding: 5px 9px;
        }

        .bw-battle-page-direct .bw-battle-copy h1 {
          font-family: 'Space Grotesk', Arial, sans-serif;
          font-size: 34px;
          line-height: 1;
          text-transform: uppercase;
        }

        .bw-battle-page-direct .bw-battle-lead {
          font-size: 15px;
          line-height: 1.4;
          margin-top: 7px;
          max-width: 760px;
        }

        .bw-battle-page-direct .bw-battle-feature-list,
        .bw-battle-page-direct .bw-battle-actions {
          display: none;
        }

        .bw-battle-page-direct .bw-battle-device {
          border-radius: 20px;
          max-width: 1120px;
          padding: 8px;
          width: 100%;
        }

        .bw-battle-page-direct .bw-battle-device::before {
          display: none;
        }

        .bw-battle-page-direct .bw-battle-screen {
          border-radius: 12px;
        }

        .bw-battle-page-direct .bw-battle-tour-cta {
          max-width: 100%;
        }

        @media (max-width: 960px) {
          .bw-battle-stage {
            padding: 48px 18px 54px;
          }

          .bw-battle-layout {
            gap: 34px;
            grid-template-areas:
              "content"
              "game"
              "cta";
            grid-template-columns: minmax(0, 1fr);
            grid-template-rows: auto auto auto;
          }

          .bw-battle-copy {
            max-width: 720px;
          }

          .bw-battle-copy h1 {
            font-size: 66px;
          }

          .bw-battle-copy h1 span {
            font-size: 40px;
          }

          .bw-battle-lead {
            font-size: 18px;
            max-width: 640px;
          }

          .bw-battle-device {
            max-width: 460px;
          }

          .bw-battle-tour-cta {
            max-width: 720px;
          }
        }

        @media (max-width: 620px) {
          .bw-battle-stage {
            padding: 34px 12px 42px;
          }

          .bw-battle-copy h1 {
            font-size: 48px;
          }

          .bw-battle-copy h1 span {
            font-size: 30px;
          }

          .bw-battle-lead {
            font-size: 17px;
            line-height: 1.48;
          }

          .bw-battle-feature-list {
            gap: 10px;
            margin-top: 26px;
          }

          .bw-battle-feature-list li {
            font-size: 15px;
          }

          .bw-battle-actions,
          .bw-battle-btn,
          .bw-battle-tour-cta a {
            width: 100%;
          }

          .bw-battle-btn,
          .bw-battle-tour-cta a {
            min-width: 0;
          }

          .bw-battle-device {
            border-width: 6px;
            border-radius: 24px;
            box-shadow: 10px 14px 0 rgba(20, 123, 120, 0.22), 0 18px 42px rgba(16, 43, 54, 0.18);
            padding: 7px;
          }

          .bw-battle-device::before {
            inset: 12px -10px -10px 12px;
          }

          .bw-battle-device-label {
            align-items: flex-start;
            border-radius: 16px 16px 7px 7px;
            flex-direction: column;
            gap: 4px;
          }

          .bw-battle-device-label strong {
            text-align: left;
          }

          .bw-battle-screen {
            border-radius: 16px;
          }

          .bw-battle-tour-cta {
            padding: 20px;
          }

          .bw-battle-page-direct .bw-battle-stage {
            padding: 14px 10px 34px;
          }

          .bw-battle-page-direct .bw-battle-copy h1 {
            font-size: 28px;
          }

          .bw-battle-page-direct .bw-battle-lead {
            font-size: 13px;
          }
        }

        @media (max-width: 420px) {
          .bw-battle-copy h1 {
            font-size: 40px;
          }

          .bw-battle-copy h1 span {
            font-size: 25px;
          }
        }
      `;
    }
  }

  if (!customElements.get('bw-berlin-battle-page')) {
    customElements.define('bw-berlin-battle-page', BWBerlinBattlePage);
  }
})();
