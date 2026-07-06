(function () {
  const SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : '';
  const BASE_URL = SCRIPT_URL && !/static\.wixstatic\.com/i.test(SCRIPT_URL)
    ? new URL('../', SCRIPT_URL).toString()
    : 'https://fenerszymanski.github.io/berlinwalk-widgets/';
  const ASSET_VERSION = 'games-page-rewind-cover-20260706b';
  const GAMES = [
    {
      id: 'berlin-rewind',
      kicker: 'Daily archive',
      title: 'Berlin Rewind',
      lead: 'Three historical Berlin photos per day. Guess the year and district before the archive answers back.',
      how: 'Everyone gets the same daily set, so the score, streak, and emoji grid mean something when you share them.',
      duration: 'About 1 min',
      difficulty: 'Photo history',
      player: 'Curious walkers',
      image: 'berlin-rewind/assets/social/berlin-rewind-social-1200x630.jpg',
      href: 'https://www.berlinwalk.com/games/berlin-rewind',
      button: 'Play Berlin Rewind',
      accent: 'archive'
    },
    {
      id: 'berlin-battle',
      kicker: 'Choice battle',
      title: 'Berlin Battle',
      lead: 'Pick your winner across food, districts, museums, nights out, transport and tiny Berlin loyalties.',
      how: 'Fast this-or-that rounds narrow the city down until one Berlin favorite survives.',
      duration: 'Under 1 min',
      difficulty: 'Pick a winner',
      player: 'Fast opinions',
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
      duration: 'Under 1 min',
      difficulty: 'Door test',
      player: 'Nightlife mood',
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
      duration: 'Under 1 min',
      difficulty: 'Social puzzle',
      player: 'Dry humor',
      image: 'berlin-smile-challenge/assets/social/berlin-smile-challenge-social-1200x630.jpg',
      href: 'https://www.berlinwalk.com/games/berlin-smile-challenge',
      button: 'Start the challenge',
      accent: 'red'
    },
    {
      id: 'berlin-day-survival',
      kicker: 'Day survival',
      title: 'Berlin Day Survival',
      lead: 'Pick a budget, survive six small Berlin decisions, and see if your first day stays smart or turns into snack chaos.',
      how: 'Choose EUR 10, EUR 15 or EUR 20, manage food, water and energy, then get a shareable Berlin day type.',
      duration: 'Under 1 min',
      difficulty: 'Budget survival',
      player: 'First-day instincts',
      image: 'berlin-day-survival/assets/social/berlin-day-survival-social-1200x630.jpg',
      href: 'https://www.berlinwalk.com/games/berlin-day-survival',
      button: 'Survive the day',
      accent: 'day'
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
      this.innerHTML = `
        <style>${this._styles()}</style>
        <main class="bw-games-page" aria-labelledby="bw-games-title">
          <section class="bw-games-hero">
            <div class="bw-games-hero-shade" aria-hidden="true"></div>
            <div class="bw-games-hero-inner">
              <p class="bw-games-kicker">Playable Berlin</p>
              <h1 id="bw-games-title">BerlinWalk Games</h1>
              <p class="bw-games-hero-lead">Playable Berlin for the moment before you go outside and test the real city. Rewind the archive, pick a winner, pass the door, survive the day, or try to make Berlin smile.</p>
            </div>
          </section>

          <section class="bw-games-modes" id="bw-games-modes" aria-labelledby="bw-games-modes-title">
            <div class="bw-games-section-head">
              <p class="bw-games-section-kicker">Pick your mode</p>
              <h2 id="bw-games-modes-title">Choose your way into Berlin</h2>
              <p>Each live game has a different job: archive memory, taste, instinct, night pressure, first-day survival, or social weather.</p>
            </div>
            <div class="bw-games-grid">
              ${gameCards}
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
              <div><dt>Play time</dt><dd>${this._escapeHtml(game.duration)}</dd></div>
              <div><dt>Game type</dt><dd>${this._escapeHtml(game.difficulty)}</dd></div>
              <div><dt>Vibe</dt><dd>${this._escapeHtml(game.player)}</dd></div>
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

      const targetHeight = `${Math.min(Math.max(height, 760), 6200)}px`;
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
          --arcade: #061A0C;
          --screen: #082A12;
          --cyan: #34D6B4;
          background: var(--arcade);
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
          isolation: isolate;
          min-height: min(520px, 68svh);
          overflow: hidden;
          padding: clamp(86px, 10vw, 124px) 24px clamp(44px, 7vw, 72px);
          position: relative;
          background:
            linear-gradient(135deg, transparent 0 43%, rgba(250, 250, 245, 0.36) 43% 52%, transparent 52%),
            linear-gradient(45deg, transparent 0 64%, rgba(230, 57, 70, 0.16) 64% 72%, transparent 72%),
            radial-gradient(circle at 78% 24%, rgba(250, 250, 245, 0.36), transparent 22%),
            radial-gradient(circle at 88% 78%, rgba(52, 214, 180, 0.22), transparent 24%),
            repeating-linear-gradient(90deg, rgba(6, 26, 12, 0.09) 0 2px, transparent 2px 34px),
            repeating-linear-gradient(0deg, rgba(6, 26, 12, 0.06) 0 2px, transparent 2px 34px),
            var(--yellow);
          border-bottom: 0;
          box-shadow: inset 0 0 0 8px var(--green), inset 0 -10px 0 rgba(250, 250, 245, 0.72);
        }

        .bw-games-hero-shade {
          inset: 0;
          position: absolute;
        }

        .bw-games-hero::before,
        .bw-games-hero::after {
          content: "";
          inset: 0;
          pointer-events: none;
          position: absolute;
          z-index: 3;
        }

        .bw-games-hero::before {
          background:
            repeating-linear-gradient(0deg, rgba(27, 94, 32, 0.06) 0 1px, transparent 1px 7px),
            repeating-linear-gradient(90deg, rgba(230, 57, 70, 0.055) 0 1px, transparent 1px 24px);
          mix-blend-mode: screen;
          opacity: 0.6;
        }

        .bw-games-hero::after {
          border: 8px solid rgba(27, 94, 32, 0.72);
          box-shadow: inset 0 0 0 3px rgba(255, 230, 0, 0.82);
        }

        .bw-games-hero-shade {
          background:
            linear-gradient(90deg, rgba(255, 230, 0, 0.16) 0%, rgba(255, 230, 0, 0.02) 62%, rgba(27, 94, 32, 0.08) 100%),
            linear-gradient(0deg, rgba(250, 250, 245, 0.16) 0%, rgba(250, 250, 245, 0) 56%);
          z-index: 1;
        }

        .bw-games-hero-inner {
          color: var(--green-dark);
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
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0;
          line-height: 1.2;
          text-transform: uppercase;
        }

        .bw-games-kicker {
          align-items: center;
          background: var(--green);
          box-shadow: 5px 5px 0 var(--cyan);
          color: var(--yellow);
          display: inline-flex;
          min-height: 32px;
          padding: 0 12px;
        }

        .bw-games-hero h1 {
          color: var(--green);
          font-size: clamp(54px, 8vw, 118px);
          font-weight: 950;
          letter-spacing: 0;
          line-height: 0.88;
          margin-top: 12px;
          max-width: 880px;
          text-shadow: 5px 5px 0 var(--cream), 10px 10px 0 rgba(52, 214, 180, 0.82);
        }

        .bw-games-hero-lead {
          color: rgba(6, 26, 12, 0.78);
          font-size: clamp(18px, 2vw, 24px);
          font-weight: 700;
          line-height: 1.5;
          margin-top: 22px;
          max-width: 720px;
        }

        .bw-games-btn,
        .bw-game-play,
        .bw-games-mobile-bar a {
          align-items: center;
          border: 3px solid var(--arcade);
          border-radius: 0;
          box-shadow: 5px 5px 0 rgba(52, 214, 180, 0.92);
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
          color: var(--green-dark) !important;
        }

        .bw-games-btn-secondary {
          background: rgba(250, 250, 245, 0.95);
          border-color: var(--yellow);
          color: var(--green-dark);
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

        .bw-games-modes {
          background:
            radial-gradient(circle at 12% 18%, rgba(255, 230, 0, 0.16), transparent 26%),
            radial-gradient(circle at 88% 4%, rgba(52, 214, 180, 0.12), transparent 28%),
            repeating-linear-gradient(90deg, rgba(27, 94, 32, 0.035) 0 1px, transparent 1px 36px),
            linear-gradient(180deg, #FFFFFF 0%, var(--cream) 100%);
          margin-top: -30px;
          padding: clamp(78px, 8vw, 112px) 24px clamp(54px, 7vw, 86px);
          position: relative;
          z-index: 4;
        }

        .bw-games-modes::before {
          background:
            linear-gradient(180deg, #FFFFFF 0%, var(--cream) 100%);
          clip-path: polygon(0 48%, 8% 34%, 18% 48%, 30% 28%, 42% 48%, 55% 32%, 68% 48%, 80% 30%, 92% 48%, 100% 36%, 100% 100%, 0 100%);
          content: "";
          height: 76px;
          inset: -44px 0 auto;
          position: absolute;
          z-index: -1;
        }

        .bw-games-modes::after {
          background:
            linear-gradient(180deg, rgba(6, 26, 12, 0.12), transparent 38px);
          content: "";
          height: 72px;
          inset: -30px 0 auto;
          opacity: 0.24;
          pointer-events: none;
          position: absolute;
          z-index: -2;
        }

        .bw-games-modes > * {
          position: relative;
          z-index: 1;
        }

        .bw-games-section-head {
          margin: 0 auto clamp(28px, 4vw, 44px);
          max-width: 1180px;
          width: min(1180px, calc(100vw - 48px));
        }

        .bw-games-section-head h2,
        .bw-games-board-copy h2 {
          color: var(--green);
          font-size: clamp(34px, 5vw, 68px);
          font-weight: 950;
          letter-spacing: 0;
          line-height: 0.96;
          margin-top: 8px;
        }

        .bw-games-section-head p:last-child,
        .bw-games-board-copy p {
          color: var(--muted);
          font-size: clamp(16px, 1.6vw, 20px);
          font-weight: 650;
          line-height: 1.55;
          margin-top: 16px;
          max-width: 720px;
        }

        .bw-games-grid {
          align-items: stretch;
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin: 0 auto;
          max-width: 1180px;
          width: min(1180px, calc(100vw - 48px));
        }

        .bw-game-card {
          background: var(--white);
          border: 4px solid var(--arcade);
          border-radius: 0;
          box-shadow: 8px 8px 0 var(--yellow), 0 18px 52px rgba(27, 94, 32, 0.12);
          display: flex;
          flex-direction: column;
          height: 100%;
          min-width: 0;
          overflow: hidden;
          transform: translateY(0);
        }

        .bw-game-card-image {
          aspect-ratio: 16 / 10;
          background: var(--green-dark);
          border-bottom: 4px solid var(--arcade);
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
          display: grid;
          flex: 1;
          grid-template-rows: auto auto minmax(72px, auto) auto minmax(68px, auto) auto;
          padding: 22px;
        }

        .bw-game-card-green .bw-game-kicker {
          color: var(--green);
        }

        .bw-game-card-archive .bw-game-kicker {
          color: #5C3B1E;
        }

        .bw-game-card-night .bw-game-kicker {
          color: #111111;
        }

        .bw-game-card-red .bw-game-kicker {
          color: var(--red);
        }

        .bw-game-card-day .bw-game-kicker {
          color: #1D8A99;
        }

        .bw-game-card-split .bw-game-kicker {
          color: var(--green-dark);
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
          display: -webkit-box;
          font-size: 15px;
          font-weight: 650;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          line-height: 1.55;
          margin-top: 13px;
          min-height: 70px;
          overflow: hidden;
        }

        .bw-game-meta {
          border-block: 3px solid rgba(6, 26, 12, 0.16);
          display: grid;
          gap: 0;
          grid-template-columns: 1fr;
          margin-top: 18px;
          min-height: 142px;
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
          display: -webkit-box;
          font-size: 13px;
          font-weight: 650;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          line-height: 1.55;
          margin-top: 16px;
          min-height: 62px;
          overflow: hidden;
        }

        .bw-game-how strong {
          color: var(--green);
        }

        .bw-game-play {
          align-self: end;
          margin-top: auto;
          width: 100%;
        }

        .bw-game-how + .bw-game-play {
          margin-top: 20px;
        }

        .bw-games-board {
          background: var(--green-dark);
          color: var(--white);
          display: grid;
          gap: 34px;
          grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
          padding: clamp(58px, 7vw, 86px) max(24px, calc((100vw - 1180px) / 2));
          position: relative;
        }

        .bw-games-board::before {
          background: repeating-linear-gradient(0deg, rgba(255, 230, 0, 0.08) 0 1px, transparent 1px 7px);
          content: "";
          inset: 0;
          pointer-events: none;
          position: absolute;
        }

        .bw-games-board > * {
          position: relative;
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
          border: 2px solid rgba(255, 230, 0, 0.42);
          border-radius: 0;
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

        .bw-games-mobile-bar {
          display: none;
        }

        @media (min-width: 981px) {
          .bw-games-hero {
            padding-bottom: 72px;
          }

          .bw-games-hero-inner {
            transform: translateY(12px);
          }
        }

        @media (max-width: 980px) {
          .bw-games-hero {
            min-height: 500px;
            padding-top: 108px;
          }

          .bw-games-hero-shade {
            background:
              linear-gradient(90deg, rgba(255, 230, 0, 0.18) 0%, rgba(255, 230, 0, 0.02) 62%, rgba(27, 94, 32, 0.08) 100%),
              linear-gradient(0deg, rgba(250, 250, 245, 0.18) 0%, rgba(250, 250, 245, 0) 56%);
          }

          .bw-games-grid,
          .bw-games-board {
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
            min-height: 470px;
            padding: 94px 18px 58px;
          }

          .bw-games-hero-inner,
          .bw-games-section-head,
          .bw-games-grid {
            width: min(100%, calc(100vw - 36px));
          }

          .bw-games-hero h1 {
            font-size: clamp(43px, 14.2vw, 62px);
            max-width: 100%;
            text-shadow: 3px 3px 0 var(--cream), 6px 6px 0 rgba(52, 214, 180, 0.82);
          }

          .bw-games-modes {
            margin-top: -18px;
            padding-left: 18px;
            padding-right: 18px;
            padding-top: 70px;
          }

          .bw-game-card-body {
            padding: 18px;
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
