const SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : '';
const BASE_URL = SCRIPT_URL
  ? new URL('../', SCRIPT_URL).toString()
  : 'https://fenerszymanski.github.io/berlinwalk-widgets/';
const ASSET_BUILD = 'berlin-rewind-mvp-20260705';
const GAMES_PREVIEW_BUILD = 'games-preview-rail-hero-preview-20260708a';

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
    if (this._handleMessage) window.removeEventListener('message', this._handleMessage);
    if (this._timers) this._timers.forEach((timer) => window.clearTimeout(timer));
  }

  _gameUrl() {
    const source = new URL(`${BASE_URL}berlin-rewind/`);
    source.searchParams.set('v', ASSET_BUILD);
    source.searchParams.set('attribution', 'none');
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
          --red: #E63946;
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
          gap: clamp(28px, 4vw, 44px);
          margin: 0 auto;
          max-width: 1180px;
          padding: clamp(36px, 6vw, 60px) clamp(16px, 4vw, 32px) clamp(40px, 6vw, 64px);
        }

        .bw-rewind-hero {
          max-width: 860px;
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
          margin-bottom: 22px;
          padding: 8px 12px;
          text-transform: uppercase;
        }

        .bw-rewind-hero h1 {
          color: var(--green-dark);
          font-family: Fraunces, Georgia, serif;
          font-size: clamp(40px, 6vw, 72px);
          line-height: 0.96;
          margin: 0 0 16px;
        }

        .bw-rewind-hero h1 span {
          color: var(--red);
        }

        .bw-rewind-hero p {
          color: var(--muted);
          font-size: clamp(17px, 1.5vw, 21px);
          font-weight: 700;
          line-height: 1.55;
          margin: 0;
          max-width: 720px;
        }

        .bw-rewind-features {
          display: grid;
          gap: 14px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          list-style: none;
          margin: 22px 0 0;
          padding: 0;
        }

        .bw-rewind-features li {
          align-items: flex-start;
          background: rgba(255, 255, 255, 0.78);
          border: 1px solid rgba(27, 94, 32, 0.16);
          border-radius: 14px;
          color: var(--green-dark);
          display: flex;
          font-size: 14px;
          font-weight: 800;
          gap: 12px;
          line-height: 1.4;
          padding: 14px 16px;
        }

        .bw-rewind-features li::before {
          background: var(--lime);
          border: 2px solid var(--green-dark);
          border-radius: 50%;
          content: "";
          flex: 0 0 12px;
          height: 12px;
          margin-top: 3px;
          width: 12px;
        }

        /* Game stage — full width, no phone frame, auto-height iframe.
           The game document is transparent, so its own card floats on the
           page grid and the parent scroll handles everything (no nested scroll). */
        .bw-rewind-stage {
          width: 100%;
        }

        .bw-rewind-frame {
          background: transparent;
          border: 0;
          display: block;
          height: 640px;
          width: 100%;
        }

        .bw-rewind-cta {
          background: rgba(255, 255, 255, 0.82);
          border: 2px solid var(--green-dark);
          border-left: 6px solid var(--red);
          border-radius: 18px;
          box-shadow: 8px 8px 0 rgba(16, 36, 20, 0.16);
          display: grid;
          gap: 8px;
          padding: clamp(20px, 3vw, 28px);
        }

        .bw-rewind-cta h2 {
          color: var(--green-dark);
          font-family: Fraunces, Georgia, serif;
          font-size: clamp(22px, 2.4vw, 28px);
          margin: 0;
        }

        .bw-rewind-cta p {
          color: var(--muted);
          font-size: 15px;
          font-weight: 700;
          line-height: 1.55;
          margin: 0 0 6px;
          max-width: 760px;
        }

        .bw-rewind-cta a {
          align-items: center;
          align-self: start;
          background: var(--yellow);
          border: 2px solid var(--green-dark);
          border-radius: 10px;
          box-shadow: 4px 4px 0 var(--green-dark);
          color: var(--green-dark);
          display: inline-flex;
          font-size: 13px;
          font-weight: 900;
          min-height: 48px;
          padding: 0 18px;
          text-decoration: none;
          text-transform: uppercase;
        }

        .bw-rewind-cta a:hover {
          transform: translateY(-2px);
        }

        .bw-rewind-more {
          min-width: 0;
        }

        @media (max-width: 720px) {
          .bw-rewind-features {
            grid-template-columns: 1fr;
          }
        }
      </style>

      <section class="bw-rewind-page">
        <header class="bw-rewind-hero">
          <span class="bw-rewind-eyebrow">Flagship daily game</span>
          <h1>Berlin <span>Rewind</span></h1>
          <p>Berlin is one of those cities where the same corner can look like three different countries depending on the decade. Read the street, guess the year, guess the district, then see what story was hiding there. A new set drops after Berlin midnight.</p>
          <ul class="bw-rewind-features">
            <li>Three archival Berlin photos per day, shared by everyone.</li>
            <li>Score comes from the year and the district, not vague vibes.</li>
            <li>Each reveal ends with a short Berlin note in my voice.</li>
          </ul>
        </header>

        <div class="bw-rewind-stage">
          <iframe class="bw-rewind-frame" src="${this._gameUrl()}" title="Berlin Rewind by BerlinWalk" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" scrolling="no"></iframe>
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
    this._frame = this.querySelector('.bw-rewind-frame');
    this._handleMessage = (event) => {
      if (!this._frame || event.source !== this._frame.contentWindow) return;
      const data = event.data;
      if (!data || data.type !== 'bw-resize') return;
      const height = Math.round(Number(data.height) || 0);
      if (height < 320) return;
      // Small buffer so the iframe is always a hair taller than the game's
      // reported content height. The game shell has a collapsing bottom margin
      // that bw-resize does not count, which would otherwise leave a few px of
      // internal scroll. The extra strip is transparent and blends into the page.
      this._frame.style.height = `${height + 16}px`;
    };
    window.addEventListener('message', this._handleMessage);

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
