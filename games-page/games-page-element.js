(function () {
  const SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : '';
  const BASE_URL = SCRIPT_URL
    ? new URL('../', SCRIPT_URL).toString()
    : 'https://fenerszymanski.github.io/berlinwalk-widgets/';
  const ASSET_VERSION = 'games-page-v1-20260623';
  const BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based?utm_source=games&utm_medium=hub&utm_campaign=berlinwalk_games&utm_content=book_tour';

  const GAMES = [
    {
      id: 'berlin-battle',
      kicker: 'Choice battle',
      title: 'Berlin Battle',
      lead: 'Pick your winner across food, districts, museums, nights out, transport and tiny Berlin loyalties.',
      how: 'Fast this-or-that rounds narrow the city down until one Berlin favorite survives.',
      duration: '2-4 min',
      difficulty: 'Easy start',
      player: 'Solo or group',
      image: 'berlin-battle/assets/social/berlin-battle-social-1200x630.jpg',
      href: 'https://www.berlinwalk.com/games/berlin-battle',
      button: 'Play Berlin Battle',
      accent: 'green'
    },
    {
      id: 'berghain-bouncer',
      kicker: 'Pressure game',
      title: 'Berghain Bouncer',
      lead: 'A 10-second club-door test with outfits, answers and one very Berlin kind of judgement.',
      how: 'Choose fast, stay calm, and see if the door lets you into the night.',
      duration: '60 sec',
      difficulty: 'High pressure',
      player: 'Solo challenge',
      image: 'berlin-bouncer/assets/social/berlin-bouncer-social-1200x630.jpg',
      href: 'https://www.berlinwalk.com/games/berghain-bouncer',
      button: 'Try the door',
      accent: 'night'
    },
    {
      id: 'berlin-smile-challenge',
      kicker: 'Social puzzle',
      title: 'Berlin Smile Challenge',
      lead: 'Seven small social tests. One mission: make a Berliner almost smile without destroying the patience meter.',
      how: 'Read the room, pick the least annoying answer, and leave with a shareable result.',
      duration: '3-5 min',
      difficulty: 'Sneaky',
      player: 'Best with sound',
      image: 'berlin-smile-challenge/assets/social/berlin-smile-challenge-social-1200x630.jpg',
      href: 'https://www.berlinwalk.com/games/berlin-smile-challenge',
      button: 'Start the challenge',
      accent: 'red'
    }
  ];

  function ensureFont() {
    if (document.querySelector('link[data-bw-games-font]')) return;
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://fonts.gstatic.com';
    preconnect.crossOrigin = 'anonymous';

    const font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800;900&family=Merriweather:wght@700&display=swap';
    font.dataset.bwGamesFont = 'true';

    document.head.appendChild(preconnect);
    document.head.appendChild(font);
  }

  function asset(path) {
    const url = new URL(path, BASE_URL);
    url.searchParams.set('v', ASSET_VERSION);
    return url.toString();
  }

  function gameUrl(game, content) {
    const url = new URL(game.href);
    url.searchParams.set('utm_source', 'games');
    url.searchParams.set('utm_medium', 'hub');
    url.searchParams.set('utm_campaign', 'berlinwalk_games');
    url.searchParams.set('utm_content', content || game.id);
    return url.toString();
  }

  class BWGamesPageElement extends HTMLElement {
    connectedCallback() {
      ensureFont();
      this._render();
      this._bind();
      this._setupHostResize();
    }

    disconnectedCallback() {
      if (this._resizeObserver) this._resizeObserver.disconnect();
      if (this._hostResizeHandler) window.removeEventListener('resize', this._hostResizeHandler);
      if (this._timers) this._timers.forEach((timer) => window.clearTimeout(timer));
    }

    _render() {
      const gameCards = GAMES.map((game, index) => this._renderGameCard(game, index)).join('');
      const heroImages = GAMES.map((game, index) => `
        <img
          class="bw-games-hero-image bw-games-hero-image-${index + 1}"
          src="${asset(game.image)}"
          alt=""
          width="1200"
          height="630"
          ${index === 0 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'}
          decoding="async">
      `).join('');

      this.innerHTML = `
        <style>${this._styles()}</style>
        <main class="bw-games-page" aria-labelledby="bw-games-title">
          <section class="bw-games-hero">
            <div class="bw-games-hero-media" aria-hidden="true">
              ${heroImages}
            </div>
            <div class="bw-games-hero-shade" aria-hidden="true"></div>
            <div class="bw-games-hero-inner">
              <p class="bw-games-kicker">Playable Berlin</p>
              <h1 id="bw-games-title">BerlinWalk Games</h1>
              <p class="bw-games-hero-lead">Quick games for the moment before you go outside and test the real city. Pick a winner, pass the door, or try to make Berlin smile.</p>
              <div class="bw-games-actions" aria-label="Primary actions">
                <a class="bw-games-btn bw-games-btn-primary" href="#bw-games-modes">Choose a game</a>
                <a class="bw-games-btn bw-games-btn-secondary" href="${BOOKING_URL}">Book the walking tour</a>
              </div>
              <dl class="bw-games-hero-facts" aria-label="Games summary">
                <div><dt>Games</dt><dd>3 live modes</dd></div>
                <div><dt>Start</dt><dd>Seconds, not setup</dd></div>
                <div><dt>Best played</dt><dd>On mobile</dd></div>
              </dl>
            </div>
          </section>

          <section class="bw-games-modes" id="bw-games-modes" aria-labelledby="bw-games-modes-title">
            <div class="bw-games-section-head">
              <p class="bw-games-section-kicker">Pick your mode</p>
              <h2 id="bw-games-modes-title">Three ways into Berlin</h2>
              <p>Each game has a different job: taste, instinct, or social weather. They are light enough to start in a queue, but specific enough to feel like Berlin.</p>
            </div>
            <div class="bw-games-grid">
              ${gameCards}
            </div>
          </section>

          <section class="bw-games-why" aria-labelledby="bw-games-why-title">
            <div class="bw-games-why-inner">
              <div class="bw-games-why-copy">
                <p class="bw-games-section-kicker">Why this page exists</p>
                <h2 id="bw-games-why-title">Play first. Walk it after.</h2>
                <p>The games give visitors a fast Berlin feeling before they commit to a plan. The walking tour gives the same curiosity a real route, real streets, and real context.</p>
              </div>
              <ol class="bw-games-reasons">
                <li>
                  <strong>Fast signal</strong>
                  <span>Visitors understand the vibe before reading a long guide.</span>
                </li>
                <li>
                  <strong>Shareable result</strong>
                  <span>Each game ends with a result that can travel outside the page.</span>
                </li>
                <li>
                  <strong>Tour bridge</strong>
                  <span>The final step points back to the 2 hour BerlinWalk route.</span>
                </li>
              </ol>
            </div>
          </section>

          <section class="bw-games-board" aria-labelledby="bw-games-board-title">
            <div class="bw-games-board-copy">
              <p class="bw-games-section-kicker">Game board</p>
              <h2 id="bw-games-board-title">Live modes, no fake counters.</h2>
              <p>This hub shows the playable modes and their role. When real cross-game stats are wired later, this is the place to add them.</p>
            </div>
            <div class="bw-games-status-list">
              ${GAMES.map((game) => `
                <a href="${gameUrl(game, 'board_' + game.id)}">
                  <span>${this._escapeHtml(game.kicker)}</span>
                  <strong>${this._escapeHtml(game.title)}</strong>
                  <em>Playable now</em>
                </a>
              `).join('')}
            </div>
          </section>

          <section class="bw-games-faq" aria-labelledby="bw-games-faq-title">
            <div class="bw-games-section-head">
              <p class="bw-games-section-kicker">Quick answers</p>
              <h2 id="bw-games-faq-title">Before you play</h2>
            </div>
            <div class="bw-games-faq-grid">
              <article>
                <h3>Are the games free?</h3>
                <p>Yes. They are quick BerlinWalk games and do not need an account or download.</p>
              </article>
              <article>
                <h3>Do they work on phones?</h3>
                <p>Yes. The page is designed mobile-first because most people will play from Instagram, search, or a link tap.</p>
              </article>
              <article>
                <h3>Is this the walking tour?</h3>
                <p>No. The games are the playful door in. The tour is the real 2 hour route from Alexanderplatz toward Hackescher Markt.</p>
              </article>
            </div>
          </section>

          <nav class="bw-games-mobile-bar" aria-label="Games quick action">
            <a href="#bw-games-modes">Choose a game</a>
          </nav>
        </main>
      `;
    }

    _renderGameCard(game, index) {
      return `
        <article class="bw-game-card bw-game-card-${game.accent}" style="--delay:${index * 90}ms">
          <a class="bw-game-card-image" href="${gameUrl(game, 'card_image_' + game.id)}" aria-label="${this._escapeAttribute('Play ' + game.title)}">
            <img src="${asset(game.image)}" alt="${this._escapeAttribute(game.title + ' cover art')}" width="1200" height="630" loading="lazy" decoding="async">
          </a>
          <div class="bw-game-card-body">
            <p class="bw-game-kicker">${this._escapeHtml(game.kicker)}</p>
            <h3>${this._escapeHtml(game.title)}</h3>
            <p class="bw-game-lead">${this._escapeHtml(game.lead)}</p>
            <dl class="bw-game-meta">
              <div><dt>Time</dt><dd>${this._escapeHtml(game.duration)}</dd></div>
              <div><dt>Mode</dt><dd>${this._escapeHtml(game.difficulty)}</dd></div>
              <div><dt>Best for</dt><dd>${this._escapeHtml(game.player)}</dd></div>
            </dl>
            <p class="bw-game-how"><strong>How it plays:</strong> ${this._escapeHtml(game.how)}</p>
            <a class="bw-game-play" href="${gameUrl(game, 'card_button_' + game.id)}">${this._escapeHtml(game.button)} <span aria-hidden="true">-></span></a>
          </div>
        </article>
      `;
    }

    _bind() {
      this.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (event) => {
          const target = this.querySelector(link.getAttribute('href'));
          if (!target) return;
          event.preventDefault();
          target.scrollIntoView({
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
            block: 'start'
          });
        });
      });
    }

    _setupHostResize() {
      this._timers = [];
      this._hostResizeHandler = () => this._queueHostSync();
      window.addEventListener('resize', this._hostResizeHandler, { passive: true });
      if ('ResizeObserver' in window) {
        this._resizeObserver = new ResizeObserver(() => this._queueHostSync());
        const page = this.querySelector('.bw-games-page');
        if (page) this._resizeObserver.observe(page);
      }
      this._queueHostSync();
      [250, 1000, 2200].forEach((delay) => {
        this._timers.push(window.setTimeout(() => this._queueHostSync(), delay));
      });
    }

    _queueHostSync() {
      window.requestAnimationFrame(() => this._syncWixHostHeight());
    }

    _syncWixHostHeight() {
      const page = this.querySelector('.bw-games-page');
      if (!page) return;
      const height = Math.ceil(page.getBoundingClientRect().height);
      if (!height || height < 600) return;

      const wixShell = this.parentElement;
      const targets = [this];
      if (wixShell && wixShell.id && wixShell.id.indexOf('comp-') === 0) {
        targets.push(wixShell, wixShell.parentElement, this.closest('section'));
      }

      const targetHeight = `${Math.min(Math.max(height, 760), 4200)}px`;
      targets.filter(Boolean).forEach((target) => {
        target.style.setProperty('height', targetHeight, 'important');
        target.style.setProperty('min-height', targetHeight, 'important');
      });
    }

    _escapeHtml(value) {
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    _escapeAttribute(value) {
      return this._escapeHtml(value);
    }

    _styles() {
      return `
        bw-games-page {
          display: block;
          width: 100%;
        }

        .bw-games-page {
          --green: #1B5E20;
          --green-dark: #0A2A12;
          --yellow: #FFE600;
          --lime: #7CB342;
          --cream: #FAFAF5;
          --white: #FFFFFF;
          --ink: #212121;
          --muted: #4E5A4E;
          --red: #E63946;
          background: var(--cream);
          color: var(--ink);
          font-family: Montserrat, Arial, sans-serif;
          margin: 0 calc((100% - 100vw) / 2);
          max-width: 100vw;
          overflow: hidden;
          width: 100vw;
        }

        .bw-games-page *,
        .bw-games-page *::before,
        .bw-games-page *::after {
          box-sizing: border-box;
        }

        .bw-games-page :where(h1, h2, h3, p, dl, dd, ol) {
          margin: 0;
        }

        .bw-games-page a {
          color: inherit;
        }

        .bw-games-hero {
          align-items: end;
          display: grid;
          min-height: min(760px, 82svh);
          overflow: hidden;
          padding: clamp(98px, 12vw, 150px) 24px clamp(42px, 7vw, 70px);
          position: relative;
        }

        .bw-games-hero-media,
        .bw-games-hero-shade {
          inset: 0;
          position: absolute;
        }

        .bw-games-hero-media {
          background: var(--green-dark);
          display: grid;
          grid-template-columns: 1.25fr 0.75fr;
          grid-template-rows: 1fr 1fr;
        }

        .bw-games-hero-image {
          display: block;
          filter: saturate(1.08) contrast(1.02);
          height: 100%;
          object-fit: cover;
          width: 100%;
        }

        .bw-games-hero-image-1 {
          grid-row: 1 / span 2;
        }

        .bw-games-hero-image-2,
        .bw-games-hero-image-3 {
          border-left: 4px solid rgba(255, 230, 0, 0.72);
        }

        .bw-games-hero-image-3 {
          border-top: 4px solid rgba(255, 230, 0, 0.72);
        }

        .bw-games-hero-shade {
          background:
            linear-gradient(90deg, rgba(5, 20, 9, 0.94) 0%, rgba(5, 20, 9, 0.78) 41%, rgba(5, 20, 9, 0.38) 72%, rgba(5, 20, 9, 0.58) 100%),
            linear-gradient(0deg, rgba(5, 20, 9, 0.72) 0%, rgba(5, 20, 9, 0.06) 52%, rgba(5, 20, 9, 0.2) 100%);
          z-index: 1;
        }

        .bw-games-hero-inner {
          color: var(--white);
          margin: 0 auto;
          max-width: 1180px;
          position: relative;
          width: min(1180px, calc(100vw - 48px));
          z-index: 2;
        }

        .bw-games-kicker,
        .bw-games-section-kicker,
        .bw-game-kicker {
          color: var(--yellow);
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0;
          line-height: 1.2;
          text-transform: uppercase;
        }

        .bw-games-hero h1 {
          color: var(--yellow);
          font-size: clamp(54px, 8vw, 118px);
          font-weight: 950;
          letter-spacing: 0;
          line-height: 0.88;
          margin-top: 12px;
          max-width: 880px;
          text-shadow: 0 18px 54px rgba(0, 0, 0, 0.42);
        }

        .bw-games-hero-lead {
          color: rgba(255, 255, 255, 0.9);
          font-size: clamp(18px, 2vw, 24px);
          font-weight: 700;
          line-height: 1.5;
          margin-top: 22px;
          max-width: 720px;
          text-shadow: 0 12px 34px rgba(0, 0, 0, 0.42);
        }

        .bw-games-actions {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .bw-games-btn,
        .bw-game-play,
        .bw-games-mobile-bar a {
          align-items: center;
          border-radius: 8px;
          display: inline-flex;
          font-size: 14px;
          font-weight: 900;
          justify-content: center;
          letter-spacing: 0;
          line-height: 1.1;
          min-height: 50px;
          padding: 0 20px;
          text-decoration: none;
          transition: background 160ms ease, border-color 160ms ease, color 160ms ease, transform 160ms ease;
        }

        .bw-games-btn-primary,
        .bw-game-play,
        .bw-games-mobile-bar a {
          background: var(--yellow);
          color: var(--green-dark);
        }

        .bw-games-btn-secondary {
          background: rgba(250, 250, 245, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.38);
          color: var(--white);
        }

        .bw-games-btn:hover,
        .bw-game-play:hover,
        .bw-games-mobile-bar a:hover {
          transform: translateY(-2px);
        }

        .bw-games-page a:focus-visible,
        .bw-games-page button:focus-visible {
          outline: 3px solid rgba(255, 230, 0, 0.88);
          outline-offset: 3px;
        }

        .bw-games-hero-facts {
          display: grid;
          gap: 1px;
          grid-template-columns: repeat(3, minmax(0, 190px));
          margin-top: 38px;
          max-width: 620px;
        }

        .bw-games-hero-facts div {
          background: rgba(250, 250, 245, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 14px;
        }

        .bw-games-hero-facts dt {
          color: rgba(255, 255, 255, 0.66);
          font-size: 11px;
          font-weight: 900;
          line-height: 1;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .bw-games-hero-facts dd {
          color: var(--white);
          font-size: 14px;
          font-weight: 900;
          line-height: 1.25;
        }

        .bw-games-modes,
        .bw-games-faq {
          padding: clamp(54px, 7vw, 86px) 24px;
        }

        .bw-games-section-head {
          margin: 0 auto clamp(28px, 4vw, 44px);
          max-width: 1180px;
          width: min(1180px, calc(100vw - 48px));
        }

        .bw-games-section-head h2,
        .bw-games-why-copy h2,
        .bw-games-board-copy h2 {
          color: var(--green);
          font-size: clamp(34px, 5vw, 68px);
          font-weight: 950;
          letter-spacing: 0;
          line-height: 0.96;
          margin-top: 8px;
        }

        .bw-games-section-head p:last-child,
        .bw-games-why-copy p:last-child,
        .bw-games-board-copy p {
          color: var(--muted);
          font-size: clamp(16px, 1.6vw, 20px);
          font-weight: 650;
          line-height: 1.55;
          margin-top: 16px;
          max-width: 720px;
        }

        .bw-games-grid {
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin: 0 auto;
          max-width: 1180px;
          width: min(1180px, calc(100vw - 48px));
        }

        .bw-game-card {
          background: var(--white);
          border: 1px solid rgba(27, 94, 32, 0.16);
          border-radius: 8px;
          box-shadow: 0 18px 52px rgba(27, 94, 32, 0.1);
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
          transform: translateY(0);
        }

        .bw-game-card-image {
          aspect-ratio: 16 / 10;
          background: var(--green-dark);
          display: block;
          overflow: hidden;
        }

        .bw-game-card-image img {
          display: block;
          height: 100%;
          object-fit: cover;
          transition: transform 220ms ease;
          width: 100%;
        }

        .bw-game-card:hover .bw-game-card-image img {
          transform: scale(1.035);
        }

        .bw-game-card-body {
          display: flex;
          flex: 1;
          flex-direction: column;
          padding: 22px;
        }

        .bw-game-card-green .bw-game-kicker {
          color: var(--green);
        }

        .bw-game-card-night .bw-game-kicker {
          color: #111111;
        }

        .bw-game-card-red .bw-game-kicker {
          color: var(--red);
        }

        .bw-game-card h3 {
          color: var(--ink);
          font-size: clamp(25px, 2.4vw, 36px);
          font-weight: 950;
          letter-spacing: 0;
          line-height: 1;
          margin-top: 8px;
        }

        .bw-game-lead {
          color: var(--muted);
          font-size: 15px;
          font-weight: 650;
          line-height: 1.55;
          margin-top: 13px;
        }

        .bw-game-meta {
          border-block: 1px solid rgba(27, 94, 32, 0.16);
          display: grid;
          gap: 0;
          grid-template-columns: 1fr;
          margin-top: 18px;
          padding-block: 8px;
        }

        .bw-game-meta div {
          align-items: baseline;
          display: flex;
          gap: 12px;
          justify-content: space-between;
          padding: 8px 0;
        }

        .bw-game-meta dt {
          color: rgba(33, 33, 33, 0.58);
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .bw-game-meta dd {
          color: var(--ink);
          font-size: 13px;
          font-weight: 900;
          text-align: right;
        }

        .bw-game-how {
          color: var(--ink);
          font-size: 13px;
          font-weight: 650;
          line-height: 1.55;
          margin-top: 16px;
        }

        .bw-game-how strong {
          color: var(--green);
        }

        .bw-game-play {
          margin-top: auto;
          width: 100%;
        }

        .bw-game-how + .bw-game-play {
          margin-top: 20px;
        }

        .bw-games-why {
          background:
            linear-gradient(90deg, rgba(255, 230, 0, 0.18), transparent 44%),
            repeating-linear-gradient(90deg, rgba(27, 94, 32, 0.055) 0 1px, transparent 1px 58px),
            #ECF5DF;
          padding: clamp(58px, 7vw, 92px) 24px;
        }

        .bw-games-why-inner {
          display: grid;
          gap: 44px;
          grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
          margin: 0 auto;
          max-width: 1180px;
          width: min(1180px, calc(100vw - 48px));
        }

        .bw-games-reasons {
          counter-reset: reason;
          display: grid;
          gap: 18px;
          list-style: none;
          padding: 0;
        }

        .bw-games-reasons li {
          align-items: start;
          border-top: 2px solid rgba(27, 94, 32, 0.18);
          counter-increment: reason;
          display: grid;
          gap: 10px;
          grid-template-columns: 82px minmax(0, 1fr);
          padding-top: 18px;
        }

        .bw-games-reasons li::before {
          color: var(--red);
          content: counter(reason, decimal-leading-zero);
          font-family: Merriweather, Georgia, serif;
          font-size: 42px;
          font-weight: 700;
          line-height: 1;
        }

        .bw-games-reasons strong {
          color: var(--green);
          display: block;
          font-size: clamp(22px, 2.4vw, 32px);
          font-weight: 950;
          line-height: 1.05;
        }

        .bw-games-reasons span {
          color: var(--muted);
          display: block;
          font-size: 15px;
          font-weight: 650;
          line-height: 1.55;
          margin-top: 6px;
        }

        .bw-games-board {
          background: var(--green-dark);
          color: var(--white);
          display: grid;
          gap: 34px;
          grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
          padding: clamp(58px, 7vw, 86px) max(24px, calc((100vw - 1180px) / 2));
        }

        .bw-games-board-copy h2,
        .bw-games-board-copy p {
          color: var(--white);
        }

        .bw-games-board-copy p {
          color: rgba(250, 250, 245, 0.78);
        }

        .bw-games-status-list {
          display: grid;
          gap: 10px;
        }

        .bw-games-status-list a {
          align-items: center;
          background: rgba(250, 250, 245, 0.08);
          border: 1px solid rgba(255, 230, 0, 0.22);
          border-radius: 8px;
          display: grid;
          gap: 8px;
          grid-template-columns: 0.7fr 1fr auto;
          min-height: 76px;
          padding: 16px;
          text-decoration: none;
          transition: background 160ms ease, border-color 160ms ease, transform 160ms ease;
        }

        .bw-games-status-list a:hover {
          background: rgba(250, 250, 245, 0.12);
          border-color: rgba(255, 230, 0, 0.42);
          transform: translateX(3px);
        }

        .bw-games-status-list span {
          color: var(--yellow);
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .bw-games-status-list strong {
          color: var(--white);
          font-size: 20px;
          font-weight: 950;
          line-height: 1.1;
        }

        .bw-games-status-list em {
          border: 1px solid rgba(197, 225, 165, 0.35);
          border-radius: 999px;
          color: rgba(250, 250, 245, 0.82);
          font-size: 12px;
          font-style: normal;
          font-weight: 900;
          justify-self: end;
          padding: 7px 10px;
          white-space: nowrap;
        }

        .bw-games-faq-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin: 0 auto;
          max-width: 1180px;
          width: min(1180px, calc(100vw - 48px));
        }

        .bw-games-faq article {
          border-top: 4px solid var(--green);
          padding-top: 18px;
        }

        .bw-games-faq h3 {
          color: var(--green);
          font-size: 20px;
          font-weight: 950;
          line-height: 1.16;
        }

        .bw-games-faq p {
          color: var(--muted);
          font-size: 15px;
          font-weight: 650;
          line-height: 1.55;
          margin-top: 10px;
        }

        .bw-games-mobile-bar {
          display: none;
        }

        @media (max-width: 980px) {
          .bw-games-hero {
            min-height: 720px;
            padding-top: 108px;
          }

          .bw-games-hero-media {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr;
          }

          .bw-games-hero-image-1 {
            grid-row: auto;
          }

          .bw-games-hero-image-2,
          .bw-games-hero-image-3 {
            display: none;
          }

          .bw-games-hero-shade {
            background:
              linear-gradient(0deg, rgba(5, 20, 9, 0.86) 0%, rgba(5, 20, 9, 0.58) 55%, rgba(5, 20, 9, 0.38) 100%),
              linear-gradient(90deg, rgba(5, 20, 9, 0.88), rgba(5, 20, 9, 0.42));
          }

          .bw-games-grid,
          .bw-games-why-inner,
          .bw-games-board,
          .bw-games-faq-grid {
            grid-template-columns: 1fr;
          }

          .bw-games-board {
            padding-left: 24px;
            padding-right: 24px;
          }

          .bw-games-status-list a {
            grid-template-columns: 1fr;
          }

          .bw-games-status-list em {
            justify-self: start;
          }
        }

        @media (max-width: 640px) {
          .bw-games-hero {
            min-height: 680px;
            padding: 96px 18px 34px;
          }

          .bw-games-hero-inner,
          .bw-games-section-head,
          .bw-games-grid,
          .bw-games-why-inner,
          .bw-games-faq-grid {
            width: min(100%, calc(100vw - 36px));
          }

          .bw-games-hero h1 {
            font-size: clamp(48px, 16vw, 72px);
          }

          .bw-games-actions {
            align-items: stretch;
            flex-direction: column;
          }

          .bw-games-actions .bw-games-btn {
            width: 100%;
          }

          .bw-games-hero-facts {
            grid-template-columns: 1fr;
          }

          .bw-games-modes,
          .bw-games-faq {
            padding-left: 18px;
            padding-right: 18px;
          }

          .bw-game-card-body {
            padding: 18px;
          }

          .bw-games-reasons li {
            grid-template-columns: 56px minmax(0, 1fr);
          }

          .bw-games-reasons li::before {
            font-size: 32px;
          }

          .bw-games-mobile-bar {
            background: rgba(250, 250, 245, 0.96);
            border-top: 1px solid rgba(27, 94, 32, 0.16);
            bottom: 0;
            display: block;
            padding: 10px 14px max(10px, env(safe-area-inset-bottom));
            position: sticky;
            z-index: 20;
          }

          .bw-games-mobile-bar a {
            min-height: 48px;
            width: 100%;
          }
        }
      `;
    }
  }

  if (!customElements.get('bw-games-page')) {
    customElements.define('bw-games-page', BWGamesPageElement);
  }
})();
