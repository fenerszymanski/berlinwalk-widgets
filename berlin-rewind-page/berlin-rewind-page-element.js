const SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : '';
const BASE_URL = SCRIPT_URL
  ? new URL('../', SCRIPT_URL).toString()
  : 'https://fenerszymanski.github.io/berlinwalk-widgets/';
const ASSET_BUILD = 'berlin-rewind-mvp-20260705';
const GAMES_PREVIEW_BUILD = 'games-preview-rail-20260629c';

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

class BwBerlinRewindPage extends HTMLElement {
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
    const source = new URL(`${BASE_URL}berlin-rewind/`);
    source.searchParams.set('v', ASSET_BUILD);
    source.searchParams.set('attribution', 'none');
    source.searchParams.set('resize', 'none');
    source.searchParams.set('parent_path', window.location.pathname || '/games/berlin-rewind');
    source.searchParams.set('parent_url', window.location.href || 'https://www.berlinwalk.com/games/berlin-rewind');
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
        bw-berlin-rewind-page {
          --green: #1B5E20;
          --green-dark: #102414;
          --yellow: #FFE600;
          --lime: #7CB342;
          --cream: #FAFAF5;
          --paper: #FFFFFF;
          --ink: #212121;
          --muted: #556155;
          background:
            linear-gradient(90deg, rgba(27, 94, 32, 0.07) 1px, transparent 1px),
            linear-gradient(180deg, rgba(27, 94, 32, 0.07) 1px, transparent 1px),
            var(--cream);
          background-size: 34px 34px;
          color: var(--ink);
          display: block;
          font-family: "Space Grotesk", Arial, sans-serif;
          overflow: visible;
          width: 100%;
        }

        .bw-rewind-page {
          display: grid;
          gap: 32px 56px;
          grid-template-areas:
            "copy game"
            "cta game"
            "more more";
          grid-template-columns: minmax(0, 1fr) minmax(360px, 460px);
          margin: 0 auto;
          max-width: 1180px;
          padding: clamp(48px, 7svh, 64px) 24px 24px;
        }

        .bw-rewind-copy {
          align-self: start;
          grid-area: copy;
          min-width: 0;
        }

        .bw-rewind-eyebrow {
          background: var(--yellow);
          border: 2px solid var(--green-dark);
          border-radius: 999px;
          box-shadow: 4px 4px 0 var(--green-dark);
          color: var(--green-dark);
          display: inline-flex;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.12em;
          margin-bottom: 26px;
          padding: 8px 12px;
          text-transform: uppercase;
        }

        .bw-rewind-copy h1 {
          color: var(--green-dark);
          font-family: Fraunces, Georgia, serif;
          font-size: clamp(56px, 7vw, 98px);
          line-height: 0.92;
          margin: 0 0 20px;
        }

        .bw-rewind-copy h1 span {
          color: #E63946;
          display: block;
        }

        .bw-rewind-copy p {
          color: var(--muted);
          font-size: clamp(18px, 1.6vw, 22px);
          font-weight: 700;
          line-height: 1.56;
          margin: 0 0 18px;
          max-width: 620px;
        }

        .bw-rewind-list {
          display: grid;
          gap: 12px;
          list-style: none;
          margin: 0;
          max-width: 560px;
          padding: 0;
        }

        .bw-rewind-list li {
          align-items: center;
          color: var(--green-dark);
          display: flex;
          font-size: 15px;
          font-weight: 800;
          gap: 12px;
          line-height: 1.35;
        }

        .bw-rewind-list li::before {
          background: var(--lime);
          border: 2px solid var(--green-dark);
          border-radius: 50%;
          content: "";
          flex: 0 0 12px;
          height: 12px;
          width: 12px;
        }

        .bw-rewind-cta {
          align-self: start;
          background: rgba(255, 255, 255, 0.82);
          border: 2px solid var(--green-dark);
          border-left: 6px solid #E63946;
          border-radius: 18px;
          box-shadow: 8px 8px 0 rgba(16, 36, 20, 0.16);
          grid-area: cta;
          padding: 22px;
        }

        .bw-rewind-cta h2 {
          color: var(--green-dark);
          font-family: Fraunces, Georgia, serif;
          font-size: 24px;
          margin: 0 0 8px;
        }

        .bw-rewind-cta p {
          color: var(--muted);
          font-size: 14px;
          font-weight: 700;
          line-height: 1.5;
          margin: 0 0 14px;
        }

        .bw-rewind-cta a {
          align-items: center;
          background: var(--yellow);
          border: 2px solid var(--green-dark);
          border-radius: 10px;
          box-shadow: 4px 4px 0 var(--green-dark);
          color: var(--green-dark);
          display: inline-flex;
          font-size: 13px;
          font-weight: 900;
          min-height: 48px;
          padding: 0 16px;
          text-decoration: none;
          text-transform: uppercase;
        }

        .bw-rewind-device {
          align-self: start;
          background: var(--green-dark);
          border-radius: 34px;
          box-shadow: 12px 12px 0 #E63946, 0 28px 70px rgba(8, 36, 16, 0.28);
          grid-area: game;
          height: clamp(560px, calc(100svh - 170px), 720px) !important;
          max-height: 720px !important;
          max-width: 460px;
          overflow: hidden;
          padding: 12px;
          position: relative;
          width: 100%;
        }

        .bw-rewind-device::before {
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

        .bw-rewind-device iframe {
          background: var(--paper);
          border: 0;
          border-radius: 24px;
          display: block;
          height: 100%;
          width: 100%;
        }

        .bw-rewind-more {
          grid-area: more;
          min-width: 0;
        }

        @media (max-width: 980px) {
          .bw-rewind-page {
            grid-template-areas:
              "copy"
              "game"
              "cta"
              "more";
            grid-template-columns: 1fr;
          }

          .bw-rewind-device {
            justify-self: center;
            width: min(100%, 460px);
          }
        }

        @media (max-width: 420px) {
          .bw-rewind-page {
            padding-left: 14px;
            padding-right: 14px;
          }
        }
      </style>

      <section class="bw-rewind-page">
        <div class="bw-rewind-copy">
          <span class="bw-rewind-eyebrow">Flagship daily game</span>
          <h1>Berlin <span>Rewind</span></h1>
          <p>Berlin is one of those cities where the same corner can look like three different countries depending on the decade. This game turns that feeling into one daily habit: read the street, guess the year, guess the district, then see what story was hiding there.</p>
          <ul class="bw-rewind-list">
            <li>Three archival Berlin photos per day, shared by everyone.</li>
            <li>Score comes from the year and the district, not vague vibes.</li>
            <li>Each reveal ends with a short Berlin note in my voice, not a dry museum label.</li>
          </ul>
        </div>

        <div class="bw-rewind-device">
          <iframe src="${this._gameUrl()}" title="Berlin Rewind by BerlinWalk" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
        </div>

        <aside class="bw-rewind-cta">
          <h2>Why this one matters</h2>
          <p>Berlin Rewind is the game that connects fastest back to the actual walking tour. A lot of these corners still sit in the route I guide through the centre. The fun part is scoring well. The better part is seeing how much older Berlin is still standing in plain sight.</p>
          <a href="https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based?utm_source=games&utm_medium=rewind&utm_campaign=bw_rewind&utm_content=page_cta">Walk the real route</a>
        </aside>

        <div class="bw-rewind-more" id="bw-rewind-more"></div>
      </section>
    `;
  }

  _bind() {
    loadGamesPreviewRail(() => {
      const mount = this.querySelector('#bw-rewind-more');
      if (!mount || !window.BerlinWalkGamesPreviewRail) return;
      window.BerlinWalkGamesPreviewRail.render(mount, {
        theme: 'light',
        source: 'rewind_page',
      });
    });
  }
}

if (!customElements.get('bw-berlin-rewind-page')) {
  customElements.define('bw-berlin-rewind-page', BwBerlinRewindPage);
}
