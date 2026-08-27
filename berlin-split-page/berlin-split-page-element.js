const SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : '';
const BASE_URL = SCRIPT_URL
  ? new URL('../', SCRIPT_URL).toString()
  : 'https://fenerszymanski.github.io/berlinwalk-widgets/';
const ASSET_BUILD = 'berlin-split-v1-20260629';

class BwBerlinSplitPage extends HTMLElement {
  connectedCallback() {
    this._ensureFont();
    this._render();
    this._bind();
  }

  disconnectedCallback() {
    if (this._messageHandler) window.removeEventListener('message', this._messageHandler);
    if (this._handleHostResize) window.removeEventListener('resize', this._handleHostResize);
    if (this._resizeObserver) this._resizeObserver.disconnect();
    if (this._timers) this._timers.forEach((timer) => window.clearTimeout(timer));
  }

  _ensureFont() {
    if (document.querySelector('link[data-bw-split-page-font]')) return;
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://fonts.gstatic.com';
    preconnect.crossOrigin = 'anonymous';
    const font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800;900&family=Merriweather:wght@700;900&display=swap';
    font.dataset.bwSplitPageFont = 'true';
    document.head.appendChild(preconnect);
    document.head.appendChild(font);
  }

  _gameUrl() {
    const source = new URL(`${BASE_URL}berlin-split/`);
    source.searchParams.set('v', ASSET_BUILD);
    source.searchParams.set('attribution', 'none');
    source.searchParams.set('resize', 'none');
    source.searchParams.set('parent_path', window.location.pathname || '/games/berlin-split');
    source.searchParams.set('parent_url', window.location.href || 'https://www.berlinwalk.com/games/berlin-split');

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
        bw-berlin-split-page {
          --green: #1B5E20;
          --green-dark: #073B16;
          --yellow: #FFE600;
          --lime: #7CB342;
          --cream: #FAFAF5;
          --paper: #FFFFFF;
          --ink: #212121;
          --muted: #5A655A;
          --red: #E63946;
          background:
            linear-gradient(90deg, rgba(27, 94, 32, 0.07) 1px, transparent 1px),
            linear-gradient(180deg, rgba(27, 94, 32, 0.07) 1px, transparent 1px),
            var(--cream);
          background-size: 38px 38px;
          color: var(--ink);
          display: block;
          font-family: Montserrat, Arial, sans-serif;
          overflow: visible;
          position: relative;
          width: 100%;
        }

        bw-berlin-split-page *,
        bw-berlin-split-page *::before,
        bw-berlin-split-page *::after {
          box-sizing: border-box;
        }

        bw-berlin-split-page::before {
          background: var(--yellow);
          content: "";
          height: 6px;
          left: 0;
          position: absolute;
          right: 30%;
          top: 0;
        }

        .bw-split-page {
          display: grid;
          gap: 34px 52px;
          grid-template-columns: minmax(0, 0.88fr) minmax(520px, 1.12fr);
          margin: 0 auto;
          max-width: 1240px;
          min-height: 0 !important;
          padding: clamp(48px, 7svh, 72px) 24px 28px;
        }

        .bw-split-copy {
          align-self: start;
          min-width: 0;
        }

        .bw-split-kicker {
          background: var(--yellow);
          border: 2px solid var(--green-dark);
          border-radius: 7px;
          box-shadow: 4px 4px 0 var(--green-dark);
          color: var(--green-dark);
          display: inline-flex;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0;
          margin-bottom: 28px;
          min-height: 34px;
          padding: 8px 12px;
          text-transform: uppercase;
        }

        .bw-split-copy h1 {
          color: var(--green-dark);
          font-family: Merriweather, Georgia, serif;
          font-size: clamp(52px, 7.2vw, 104px);
          font-weight: 900;
          letter-spacing: 0;
          line-height: 0.92;
          margin: 0 0 22px;
          max-width: 720px;
        }

        .bw-split-copy h1 span {
          color: var(--red);
          display: block;
        }

        .bw-split-lead {
          color: var(--muted);
          font-size: clamp(18px, 1.65vw, 22px);
          font-weight: 800;
          line-height: 1.52;
          margin: 0 0 28px;
          max-width: 660px;
        }

        .bw-split-list {
          display: grid;
          gap: 13px;
          list-style: none;
          margin: 0 0 30px;
          padding: 0;
        }

        .bw-split-list li {
          align-items: center;
          color: var(--green-dark);
          display: flex;
          font-size: 15px;
          font-weight: 850;
          gap: 12px;
          line-height: 1.35;
        }

        .bw-split-list li::before {
          background: var(--lime);
          border: 2px solid var(--green-dark);
          box-shadow: 2px 2px 0 var(--green-dark);
          content: "";
          flex: 0 0 11px;
          height: 11px;
          width: 11px;
        }

        .bw-split-tour-cta {
          background: rgba(255, 255, 255, 0.7);
          border: 2px solid var(--green-dark);
          border-left: 7px solid var(--yellow);
          border-radius: 8px;
          box-shadow: 6px 6px 0 rgba(7, 59, 22, 0.14);
          max-width: 650px;
          padding: 22px;
        }

        .bw-split-tour-cta h2 {
          color: var(--green-dark);
          font-size: 20px;
          font-weight: 950;
          line-height: 1.15;
          margin: 0 0 8px;
        }

        .bw-split-tour-cta p {
          color: var(--muted);
          font-size: 14px;
          font-weight: 750;
          line-height: 1.5;
          margin: 0 0 16px;
        }

        .bw-split-tour-cta a {
          align-items: center;
          background: var(--green);
          border: 2px solid var(--green-dark);
          border-radius: 7px;
          box-shadow: 4px 4px 0 var(--yellow);
          color: var(--paper);
          display: inline-flex;
          font-size: 13px;
          font-weight: 950;
          min-height: 44px;
          padding: 11px 16px;
          text-decoration: none;
          text-transform: uppercase;
        }

        .bw-split-device {
          align-self: start;
          background: #073B16;
          border-radius: 22px;
          box-shadow: 12px 12px 0 var(--yellow), 0 28px 80px rgba(7, 59, 22, 0.2);
          min-height: 760px !important;
          overflow: hidden;
          padding: 12px;
          position: relative;
          width: 100%;
        }

        .bw-split-frame {
          background: var(--cream);
          border: 0;
          border-radius: 14px;
          display: block;
          height: 760px !important;
          min-height: 760px !important;
          width: 100%;
        }

        @media (max-width: 980px) {
          .bw-split-page {
            grid-template-columns: 1fr;
            padding: 38px 16px 26px;
          }

          .bw-split-device {
            min-height: 780px !important;
            padding: 8px;
          }

          .bw-split-frame {
            height: 780px !important;
            min-height: 780px !important;
          }
        }

        @media (max-width: 520px) {
          .bw-split-copy h1 {
            font-size: 44px;
          }

          .bw-split-device {
            border-radius: 16px;
            box-shadow: 6px 6px 0 var(--yellow);
            margin-left: -4px;
            margin-right: -4px;
            min-height: 820px !important;
          }

          .bw-split-frame {
            border-radius: 10px;
            height: 820px !important;
            min-height: 820px !important;
          }
        }
      </style>
      <main class="bw-split-page">
        <section class="bw-split-copy" aria-labelledby="bw-split-title">
          <span class="bw-split-kicker">Archive map game</span>
          <h1 id="bw-split-title">Berlin Split <span>The Lost Archive</span></h1>
          <p class="bw-split-lead">Can you read Berlin before the Wall disappears? Inspect files, place evidence, protect the archive, and break the tourist version of East and West Berlin.</p>
          <ul class="bw-split-list">
            <li>Ten archive missions across the divided and rebuilt city.</li>
            <li>Integrity, clues, checkpoints and ranked endings.</li>
            <li>No trivia cards: you read the map, restore files and make calls.</li>
          </ul>
          <aside class="bw-split-tour-cta">
            <h2>You restored the archive. Now walk the real city.</h2>
            <p>My walking tour follows the same kind of layered Berlin: old center, war damage, Wall traces, rebuilding, and the details tourists usually miss.</p>
            <a href="https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based?utm_source=berlin_split&utm_medium=game_page&utm_campaign=berlin_split&utm_content=page_cta">Book the Berlin walking tour</a>
          </aside>
        </section>
        <section class="bw-split-device" id="berlin-split-game" aria-label="Berlin Split game">
          <iframe class="bw-split-frame" title="Berlin Split: The Lost Archive game" loading="eager" allow="web-share" src="${this._gameUrl()}"></iframe>
        </section>
      </main>
    `;
  }

  _bind() {
    this._messageHandler = (event) => {
      const data = event && event.data ? event.data : {};
      if (data.type === 'bw-resize' && data.height) {
        const frame = this.querySelector('.bw-split-frame');
        if (frame && window.innerWidth > 980) {
          frame.style.height = `${Math.max(740, Number(data.height) || 740)}px`;
        }
      }
    };
    window.addEventListener('message', this._messageHandler);
    this._setupHostResize();
  }

  _setupHostResize() {
    this._handleHostResize = () => this._postHostHeight();
    window.addEventListener('resize', this._handleHostResize, { passive: true });
    this._resizeObserver = new ResizeObserver(() => this._postHostHeight());
    this._resizeObserver.observe(this);
    this._timers = [80, 400, 1200].map((delay) => window.setTimeout(() => this._postHostHeight(), delay));
  }

  _postHostHeight() {
    window.requestAnimationFrame(() => {
      const height = Math.ceil(this.getBoundingClientRect().height || 900);
      window.parent.postMessage({ type: 'bw-resize', height }, '*');
    });
  }
}

if (!customElements.get('bw-berlin-split-page')) {
  customElements.define('bw-berlin-split-page', BwBerlinSplitPage);
}
