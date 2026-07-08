(function () {
  const SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : '';
  const BASE_URL = SCRIPT_URL && SCRIPT_URL.includes('/berlin-pulse-page/')
    ? SCRIPT_URL.replace(/berlin-pulse-page\/berlin-pulse-page-element\.js(?:\?.*)?$/, '')
    : 'https://fenerszymanski.github.io/berlinwalk-widgets/';
  const BUILD = 'berlin-pulse-page-20260708a';
  const BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based?utm_source=game&utm_medium=berlin_pulse_page&utm_campaign=berlinwalk_games&utm_content=book_tour';
  const GAMES_URL = 'https://www.berlinwalk.com/games?utm_source=game&utm_medium=berlin_pulse_page&utm_campaign=berlinwalk_games&utm_content=all_games';

  function asset(path) {
    const url = new URL(path, BASE_URL);
    url.searchParams.set('v', BUILD);
    return url.toString();
  }

  function ensureFont() {
    if (document.querySelector('link[data-bw-pulse-font]')) return;
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://fonts.gstatic.com';
    preconnect.crossOrigin = 'anonymous';
    const font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800;900&family=Merriweather:wght@700&display=swap';
    font.dataset.bwPulseFont = 'true';
    document.head.appendChild(preconnect);
    document.head.appendChild(font);
  }

  function loadScript(src, marker) {
    return new Promise((resolve) => {
      if (document.querySelector(`script[data-${marker}]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.defer = true;
      script.dataset[marker.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = 'true';
      script.addEventListener('load', () => resolve(), { once: true });
      script.addEventListener('error', () => resolve(), { once: true });
      document.head.appendChild(script);
    });
  }

  class BWBerlinPulsePageElement extends HTMLElement {
    connectedCallback() {
      ensureFont();
      this._render();
      this._loadDependencies();
      this._syncSoon();
    }

    disconnectedCallback() {
      if (this._resizeObserver) this._resizeObserver.disconnect();
      if (this._resizeHandler) window.removeEventListener('resize', this._resizeHandler);
    }

    async _loadDependencies() {
      await Promise.all([
        customElements.get('bw-berlin-pulse')
          ? Promise.resolve()
          : loadScript(asset('berlin-pulse/berlin-pulse-element.js'), 'bw-pulse-widget'),
        window.BerlinWalkGamesPreviewRail
          ? Promise.resolve()
          : loadScript(asset('js/games-preview-rail.js'), 'bw-pulse-games-rail')
      ]);
      this._renderRail();
      this._syncSoon();
    }

    _renderRail() {
      const target = this.querySelector('[data-pulse-games-rail]');
      if (!target || !window.BerlinWalkGamesPreviewRail) return;
      window.BerlinWalkGamesPreviewRail.render(target, {
        current: 'berlin-pulse',
        source: 'berlin_pulse_page'
      });
    }

    _render() {
      const cover = asset('berlin-pulse/assets/social/berlin-pulse-social-1200x630.jpg');
      this.innerHTML = `
        <style>${this._styles()}</style>
        <main class="bw-pulse-page" aria-labelledby="bw-pulse-page-title">
          <section class="bw-pulse-page-hero" style="--pulse-cover:url('${cover}')">
            <div class="bw-pulse-page-shade" aria-hidden="true"></div>
            <div class="bw-pulse-page-hero-inner">
              <p class="bw-pulse-page-kicker">Daily Berlin mood game</p>
              <h1 id="bw-pulse-page-title">Berlin Pulse</h1>
              <p>Berlin changes faster than most plans. I have made the mistake of chasing every option at once, so this game asks for one daily call: what does the city reward today?</p>
              <div class="bw-pulse-page-actions">
                <a href="#play-berlin-pulse">Play today's pulse</a>
                <a href="${BOOKING_URL}">Walk the real city</a>
              </div>
            </div>
          </section>

          <section id="play-berlin-pulse" class="bw-pulse-page-game" aria-label="Berlin Pulse game">
            <bw-berlin-pulse></bw-berlin-pulse>
          </section>

          <section class="bw-pulse-page-note" aria-labelledby="bw-pulse-note-title">
            <div>
              <p class="bw-pulse-page-kicker">One useful call</p>
              <h2 id="bw-pulse-note-title">Use the mood, then choose a real move.</h2>
            </div>
            <p>The result will not plan your whole day. It should do something more useful: push you toward one simple Berlin decision before the city turns into a checklist.</p>
            <a href="${GAMES_URL}">All BerlinWalk games</a>
          </section>

          <section class="bw-pulse-page-rail" data-pulse-games-rail></section>
        </main>
      `;
    }

    _syncSoon() {
      this._resizeHandler = this._resizeHandler || (() => this._syncHeight());
      window.addEventListener('resize', this._resizeHandler, { passive: true });
      if (!this._resizeObserver && 'ResizeObserver' in window) {
        this._resizeObserver = new ResizeObserver(() => this._syncHeight());
        this._resizeObserver.observe(this);
      }
      window.requestAnimationFrame(() => this._syncHeight());
      [250, 900, 1800, 3200].forEach((delay) => window.setTimeout(() => this._syncHeight(), delay));
    }

    _syncHeight() {
      const page = this.querySelector('.bw-pulse-page');
      if (!page) return;
      const height = Math.ceil(page.getBoundingClientRect().height);
      if (!height || height < 900) return;
      const targetHeight = `${Math.min(Math.max(height, 1200), 9000)}px`;
      [this, this.parentElement, this.closest('section')].filter(Boolean).forEach((target) => {
        target.style.setProperty('height', targetHeight, 'important');
        target.style.setProperty('min-height', targetHeight, 'important');
      });
    }

    _styles() {
      return `
        bw-berlin-pulse-page{display:block;width:100%}
        .bw-pulse-page{--green:#1B5E20;--dark:#061A0C;--yellow:#FFE600;--cream:#FAFAF5;--paper:#fff;--muted:#516052;--red:#E63946;color:#212121;font-family:Montserrat,Arial,sans-serif;margin:0 calc((100% - 100vw)/2);max-width:100vw;overflow:hidden;width:100vw}
        .bw-pulse-page *{box-sizing:border-box}
        .bw-pulse-page h1,.bw-pulse-page h2,.bw-pulse-page p{margin:0}
        .bw-pulse-page a{color:inherit}
        .bw-pulse-page-hero{align-items:end;background-image:linear-gradient(90deg,rgba(6,26,12,.86) 0%,rgba(6,26,12,.64) 38%,rgba(6,26,12,.16) 70%),var(--pulse-cover);background-position:center;background-size:cover;color:#fff;display:grid;min-height:min(680px,82svh);padding:clamp(94px,12vw,142px) 24px clamp(46px,7vw,72px);position:relative}
        .bw-pulse-page-hero:after{background:linear-gradient(90deg,var(--yellow),transparent 46%);bottom:0;content:"";height:6px;left:0;position:absolute;right:0}
        .bw-pulse-page-shade{background:repeating-linear-gradient(90deg,rgba(255,255,255,.06) 0 1px,transparent 1px 36px);inset:0;pointer-events:none;position:absolute}
        .bw-pulse-page-hero-inner,.bw-pulse-page-note,.bw-pulse-page-rail{margin:0 auto;max-width:1180px;width:min(1180px,calc(100vw - 48px))}
        .bw-pulse-page-hero-inner{position:relative;z-index:1}
        .bw-pulse-page-kicker{color:var(--yellow);font-size:12px;font-weight:950;letter-spacing:.08em;line-height:1;margin-bottom:13px;text-transform:uppercase}
        .bw-pulse-page h1{font-size:clamp(58px,10vw,128px);font-weight:950;letter-spacing:0;line-height:.86;max-width:820px;text-shadow:5px 5px 0 rgba(6,26,12,.45)}
        .bw-pulse-page-hero p{color:rgba(250,250,245,.9);font-size:clamp(18px,2vw,24px);font-weight:750;line-height:1.45;margin-top:20px;max-width:700px}
        .bw-pulse-page-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px}
        .bw-pulse-page-actions a,.bw-pulse-page-note a{align-items:center;border:2px solid rgba(250,250,245,.45);border-radius:8px;display:inline-flex;font-size:14px;font-weight:950;justify-content:center;min-height:50px;padding:13px 18px;text-decoration:none}
        .bw-pulse-page-actions a:first-child,.bw-pulse-page-note a{background:var(--yellow);border-color:var(--dark);box-shadow:5px 5px 0 rgba(52,214,180,.82);color:var(--dark)}
        .bw-pulse-page-game{background:linear-gradient(180deg,#FAFAF5 0%,#fff 100%);padding:clamp(26px,5vw,54px) 24px}
        .bw-pulse-page-game bw-berlin-pulse{display:block;margin:0 auto;max-width:1180px}
        .bw-pulse-page-note{align-items:center;background:#fff;border-block:1px solid rgba(27,94,32,.16);display:grid;gap:22px;grid-template-columns:minmax(0,.9fr) minmax(0,1fr) auto;padding:clamp(28px,5vw,48px) 0}
        .bw-pulse-page-note .bw-pulse-page-kicker{color:var(--red)}
        .bw-pulse-page-note h2{color:var(--green);font-size:clamp(28px,4.5vw,52px);font-weight:950;letter-spacing:0;line-height:.98}
        .bw-pulse-page-note p{color:var(--muted);font-size:16px;font-weight:750;line-height:1.55}
        .bw-pulse-page-note a{white-space:nowrap}
        .bw-pulse-page-rail{padding:0 0 clamp(40px,6vw,74px)}
        @media(max-width:860px){.bw-pulse-page-hero{min-height:600px;padding:92px 18px 40px}.bw-pulse-page-hero-inner,.bw-pulse-page-note,.bw-pulse-page-rail{width:min(100%,calc(100vw - 36px))}.bw-pulse-page-note{grid-template-columns:1fr}.bw-pulse-page-note a{justify-self:start;white-space:normal}.bw-pulse-page-actions{display:grid}.bw-pulse-page-actions a{width:100%}}
      `;
    }
  }

  if (!customElements.get('bw-berlin-pulse-page')) {
    customElements.define('bw-berlin-pulse-page', BWBerlinPulsePageElement);
  }
})();
