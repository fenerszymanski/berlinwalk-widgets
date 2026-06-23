const SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : '';
const BASE_URL = SCRIPT_URL
  ? new URL('../', SCRIPT_URL).toString()
  : 'https://fenerszymanski.github.io/berlinwalk-widgets/';
const ASSET_BUILD = 'smile-scenes-20260623';

class BwBerlinSmileChallengePage extends HTMLElement {
  connectedCallback() {
    this._render();
    this._bind();
  }

  disconnectedCallback() {
    if (this._messageHandler) window.removeEventListener('message', this._messageHandler);
    if (this._handleHostResize) window.removeEventListener('resize', this._handleHostResize);
    if (this._resizeObserver) this._resizeObserver.disconnect();
    if (this._timers) this._timers.forEach((timer) => window.clearTimeout(timer));
  }

  _gameUrl() {
    const source = new URL(`${BASE_URL}berlin-smile-challenge/`);
    source.searchParams.set('v', ASSET_BUILD);
    source.searchParams.set('parent_path', window.location.pathname || '/games/berlin-smile-challenge');
    source.searchParams.set('parent_url', window.location.href || 'https://www.berlinwalk.com/games/berlin-smile-challenge');

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
        bw-berlin-smile-challenge-page {
          display: block;
          width: 100%;
          background:
            linear-gradient(115deg, rgba(230, 57, 70, 0.12) 0 18%, transparent 18% 100%),
            repeating-linear-gradient(90deg, rgba(16, 46, 56, 0.055) 0 1px, transparent 1px 44px),
            #FFF7E8;
          color: #102E38;
          font-family: Montserrat, Arial, sans-serif;
          overflow: hidden;
        }

        bw-berlin-smile-challenge-page *,
        bw-berlin-smile-challenge-page *::before,
        bw-berlin-smile-challenge-page *::after {
          box-sizing: border-box;
        }

        .bw-smile-page {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(360px, 470px);
          grid-template-areas:
            "content game"
            "cta game";
          gap: 34px 62px;
          margin: 0 auto;
          max-width: 1180px;
          min-height: 860px;
          padding: clamp(54px, 7vw, 82px) 24px 42px;
        }

        .bw-smile-content {
          align-self: start;
          grid-area: content;
        }

        .bw-smile-eyebrow {
          background: #FFE600;
          border: 2px solid #102E38;
          border-radius: 8px;
          box-shadow: 4px 4px 0 #102E38;
          color: #102E38;
          display: inline-flex;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.14em;
          margin-bottom: 30px;
          padding: 8px 12px;
          text-transform: uppercase;
        }

        .bw-smile-content h1 {
          color: #102E38;
          font-size: clamp(56px, 7.4vw, 104px);
          font-weight: 950;
          letter-spacing: -0.055em;
          line-height: 0.9;
          margin: 0 0 24px;
          max-width: 720px;
        }

        .bw-smile-content h1 span {
          color: #E63946;
          display: block;
        }

        .bw-smile-lead {
          color: #53615B;
          font-size: clamp(18px, 1.7vw, 22px);
          font-weight: 800;
          line-height: 1.55;
          margin: 0 0 32px;
          max-width: 620px;
        }

        .bw-smile-list {
          display: grid;
          gap: 14px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .bw-smile-list li {
          align-items: center;
          color: #102E38;
          display: flex;
          font-size: 15px;
          font-weight: 850;
          gap: 12px;
        }

        .bw-smile-list li::before {
          background: #E63946;
          border: 2px solid #102E38;
          box-shadow: 2px 2px 0 #102E38;
          content: "";
          flex: 0 0 10px;
          height: 10px;
          transform: rotate(45deg);
          width: 10px;
        }

        .bw-smile-tour-cta {
          align-self: start;
          background: rgba(255, 255, 255, 0.72);
          border: 2px solid #102E38;
          border-left: 7px solid #E63946;
          border-radius: 12px;
          box-shadow: 6px 6px 0 #102E38;
          grid-area: cta;
          max-width: 650px;
          padding: 24px;
        }

        .bw-smile-tour-cta h2 {
          font-size: 20px;
          margin: 0 0 8px;
        }

        .bw-smile-tour-cta p {
          color: #53615B;
          font-size: 14px;
          font-weight: 750;
          line-height: 1.5;
          margin: 0 0 16px;
        }

        .bw-smile-tour-cta a {
          align-items: center;
          background: #FFE600;
          border: 2px solid #102E38;
          border-radius: 9px;
          box-shadow: 4px 4px 0 #102E38;
          color: #102E38;
          display: inline-flex;
          font-size: 13px;
          font-weight: 950;
          min-height: 44px;
          padding: 11px 16px;
          text-decoration: none;
          text-transform: uppercase;
        }

        .bw-smile-device {
          align-self: start;
          background: #102E38;
          border-radius: 32px;
          box-shadow: 12px 12px 0 #E63946, 0 26px 70px rgba(16, 46, 56, 0.24);
          grid-area: game;
          max-width: 470px;
          min-height: 720px;
          overflow: hidden;
          padding: 12px;
          position: relative;
          width: 100%;
        }

        .bw-smile-device::before {
          background: #FFE600;
          border-radius: 999px;
          content: "";
          height: 16px;
          left: 50%;
          position: absolute;
          top: 7px;
          transform: translateX(-50%);
          width: 72px;
          z-index: 2;
        }

        .bw-smile-frame {
          background: #FFF7E8;
          border: 0;
          border-radius: 22px;
          display: block;
          min-height: 720px;
          overflow: hidden;
          width: 100%;
        }

        .bw-smile-more {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 26px;
        }

        .bw-smile-more a {
          background: rgba(255, 255, 255, 0.66);
          border: 1px solid rgba(16, 46, 56, 0.22);
          border-radius: 999px;
          color: #102E38;
          font-size: 12px;
          font-weight: 900;
          padding: 9px 12px;
          text-decoration: none;
        }

        @media (max-width: 940px) {
          .bw-smile-page {
            grid-template-columns: 1fr;
            grid-template-areas:
              "content"
              "game"
              "cta";
            gap: 32px;
            min-height: 0;
            padding: 48px 20px 38px;
          }

          .bw-smile-content {
            text-align: left;
          }

          .bw-smile-content h1 {
            font-size: clamp(48px, 15vw, 86px);
          }

          .bw-smile-device {
            justify-self: center;
            max-width: 430px;
            min-height: 680px;
            border-radius: 22px;
            box-shadow: 8px 8px 0 #E63946, 0 20px 48px rgba(16, 46, 56, 0.2);
          }

          .bw-smile-frame {
            min-height: 680px;
          }
        }

        @media (max-width: 520px) {
          .bw-smile-page {
            padding: 40px 14px 30px;
          }

          .bw-smile-device {
            padding: 8px;
          }
        }
      </style>

      <main class="bw-smile-page">
        <section class="bw-smile-content" aria-labelledby="bw-smile-title">
          <div class="bw-smile-eyebrow">Playable now</div>
          <h1 id="bw-smile-title">Can You Make <span>a Berliner Smile?</span></h1>
          <p class="bw-smile-lead">Seven tiny social tests. One almost impossible mission: get a Berliner to soften their face.</p>
          <ul class="bw-smile-list">
            <li>Pick the least annoying thing to say</li>
            <li>Hear the dry Berlin reaction in every scene</li>
            <li>Protect the Patience Meter before it collapses</li>
            <li>Leave with a shareable almost-smile result</li>
          </ul>
          <div class="bw-smile-more" aria-label="More BerlinWalk games">
            <a href="https://www.berlinwalk.com/games/berlin-battle">Berlin Battle</a>
            <a href="https://www.berlinwalk.com/games/berghain-bouncer">Berghain Bouncer</a>
          </div>
        </section>

        <section class="bw-smile-device" aria-label="Berlin Smile Challenge game">
          <iframe
            class="bw-smile-frame"
            title="Can You Make a Berliner Smile?"
            loading="eager"
            allow="clipboard-write; web-share; autoplay"
            referrerpolicy="strict-origin-when-cross-origin"></iframe>
        </section>

        <aside class="bw-smile-tour-cta">
          <h2>If you survive the social weather...</h2>
          <p>Come walk the city with me. I run a tip-based Berlin walking tour through the places where the real city starts to make sense.</p>
          <a href="https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based">Book the walking tour</a>
        </aside>
      </main>
    `;
  }

  _bind() {
    const iframe = this.querySelector('.bw-smile-frame');
    this._timers = [];
    this._messageHandler = (event) => {
      if (!event.data || event.data.type !== 'bw-resize') return;
      const height = Number(event.data.height || 0);
      if (!height || height < 500) return;
      const framedHeight = Math.min(Math.max(height, 680), 1180);
      iframe.style.height = `${framedHeight}px`;
      const device = this.querySelector('.bw-smile-device');
      if (device) device.style.minHeight = `${framedHeight + 24}px`;
      this._queueHostSync();
    };
    window.addEventListener('message', this._messageHandler);
    iframe.src = this._gameUrl();

    this._handleHostResize = () => this._queueHostSync();
    window.addEventListener('resize', this._handleHostResize, { passive: true });
    if ('ResizeObserver' in window) {
      this._resizeObserver = new ResizeObserver(() => this._queueHostSync());
      const page = this.querySelector('.bw-smile-page');
      if (page) this._resizeObserver.observe(page);
    }
    this._queueHostSync();
    this._timers.push(window.setTimeout(() => this._queueHostSync(), 250));
    this._timers.push(window.setTimeout(() => this._queueHostSync(), 1000));
  }

  _queueHostSync() {
    window.requestAnimationFrame(() => this._syncWixHostHeight());
  }

  _syncWixHostHeight() {
    const page = this.querySelector('.bw-smile-page');
    if (!page) return;
    const height = Math.ceil(page.getBoundingClientRect().height + 8);
    if (!height || height < 600) return;

    const wixShell = this.parentElement;
    const targets = [
      this,
      wixShell,
      wixShell && wixShell.parentElement,
      this.closest('section'),
    ].filter(Boolean);

    const targetHeight = `${Math.min(Math.max(height, 720), 2200)}px`;
    targets.forEach((target) => {
      target.style.setProperty('height', targetHeight, 'important');
      target.style.setProperty('min-height', targetHeight, 'important');
    });
  }
}

if (!customElements.get('bw-berlin-smile-challenge-page')) {
  customElements.define('bw-berlin-smile-challenge-page', BwBerlinSmileChallengePage);
}
