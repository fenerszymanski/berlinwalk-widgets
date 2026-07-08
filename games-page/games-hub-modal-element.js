(function () {
  const SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : '';
  const BASE_URL = SCRIPT_URL
    ? new URL('../', SCRIPT_URL).toString()
    : 'https://fenerszymanski.github.io/berlinwalk-widgets/';
  const ASSET_VERSION = 'games-hub-modal-hero-preview-20260708a';
  const BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based?utm_source=games&utm_medium=hub_alt&utm_campaign=berlinwalk_games&utm_content=book_tour';

  const FILTERS = [
    { id: 'all', label: 'All modes' },
    { id: 'quick', label: 'Quick start' },
    { id: 'share', label: 'Shareable' },
    { id: 'sound', label: 'Sound' },
    { id: 'night', label: 'Night' }
  ];

  const GAMES = [
    {
      id: 'berlin-battle',
      title: 'Berlin Battle',
      short: 'Pick your Berlin winner.',
      lane: 'Preference battle',
      image: 'berlin-battle/assets/social/berlin-battle-social-1200x630.jpg',
      href: 'https://www.berlinwalk.com/games/berlin-battle',
      filters: ['quick', 'share'],
      duration: '2-4 min',
      start: 'Instant',
      bestFor: 'Friends, food opinions, Kiez debates',
      score: 'Winner card',
      lead: 'A fast series of this-or-that choices across food, districts, museums, nightlife, transport and Berlin habits.',
      rules: [
        'Choose one card per round.',
        'The winner keeps advancing.',
        'The final card becomes your Berlin winner.'
      ],
      tourBridge: 'Good for people who want to turn their taste into actual places to visit after the game.',
      cta: 'Play Berlin Battle'
    },
    {
      id: 'berghain-bouncer',
      title: 'Berghain Bouncer',
      short: 'Can you get in?',
      lane: 'Pressure test',
      image: 'berlin-bouncer/assets/social/berlin-bouncer-social-1200x630.jpg',
      href: 'https://www.berlinwalk.com/games/berghain-bouncer',
      filters: ['quick', 'share', 'night'],
      duration: '60 sec',
      start: 'Immediate',
      bestFor: 'Club curiosity, short attention spans',
      score: 'Door result',
      lead: 'A tense little club-door simulator where outfit, answer and timing decide whether the night starts or stops.',
      rules: [
        'Answer under time pressure.',
        'Pick the least suspicious move.',
        'Accept the door verdict.'
      ],
      tourBridge: 'Strongest when a Berlin nightlife article or Story needs a playful challenge link.',
      cta: 'Try the door'
    },
    {
      id: 'berlin-day-survival',
      title: 'Berlin Day Survival',
      short: 'Can your budget survive Berlin?',
      lane: 'Budget instinct',
      image: 'berlin-day-survival-v2/assets/social/berlin-day-survival-v2-social-1200x630.jpg',
      href: 'https://www.berlinwalk.com/games/berlin-day-survival',
      filters: ['quick', 'share'],
      duration: 'Under 1 min',
      start: 'Pick a budget',
      bestFor: 'First-day visitors, budget instincts, food choices',
      score: 'Survival result',
      lead: 'A quick first-day budget test where water, food, tiredness and one wrong tourist move can change the whole day.',
      rules: [
        'Choose €10, €15 or €20.',
        'Make six real Berlin decisions.',
        'See whether your wallet and energy survive.'
      ],
      tourBridge: 'Useful for visitors who want Berlin to feel less random before they start spending money in the city.',
      cta: 'Survive the day'
    },
    {
      id: 'berlin-rewind',
      title: 'Berlin Rewind',
      short: 'Guess old Berlin photos.',
      lane: 'Archive clue game',
      image: 'berlin-rewind/assets/social/berlin-rewind-social-1200x630.jpg',
      href: 'https://www.berlinwalk.com/games/berlin-rewind',
      filters: ['quick', 'share'],
      duration: 'Under 2 min',
      start: 'Daily set',
      bestFor: 'History eyes, repeat visits, photo clues',
      score: 'Daily archive score',
      lead: 'A daily Berlin archive game: read the photo, guess the year and district, and come back for the next set.',
      rules: [
        'Study the archive photo.',
        'Guess the year and Berlin district.',
        'Keep your daily streak alive.'
      ],
      tourBridge: 'Best for visitors who like then-and-now Berlin and want the city to feel layered before the walk.',
      cta: 'Play Rewind'
    },
    {
      id: 'berlin-smile-challenge',
      title: 'Berlin Smile Challenge',
      short: 'Make Berlin almost smile.',
      lane: 'Social puzzle',
      image: 'berlin-smile-challenge/assets/social/berlin-smile-challenge-social-1200x630.jpg',
      href: 'https://www.berlinwalk.com/games/berlin-smile-challenge',
      filters: ['share', 'sound'],
      duration: '3-5 min',
      start: 'One tap',
      bestFor: 'Dry humor, social instincts',
      score: 'Patience result',
      lead: 'Seven small Berlin social situations where the right answer is usually the least annoying one.',
      rules: [
        'Read the scene.',
        'Choose one line.',
        'Protect the patience meter until the result.'
      ],
      tourBridge: 'Best for visitors who like Berlin humor and want the city to feel human before they join the walk.',
      cta: 'Start the challenge'
    }
  ];

  function ensureFont() {
    if (document.querySelector('link[data-bw-games-hub-font]')) return;
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://fonts.gstatic.com';
    preconnect.crossOrigin = 'anonymous';

    const font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800;900&family=Merriweather:wght@700&display=swap';
    font.dataset.bwGamesHubFont = 'true';

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
    url.searchParams.set('utm_medium', 'hub_alt');
    url.searchParams.set('utm_campaign', 'berlinwalk_games');
    url.searchParams.set('utm_content', content || game.id);
    return url.toString();
  }

  class BWGamesHubModalElement extends HTMLElement {
    connectedCallback() {
      ensureFont();
      this._selectedId = GAMES[0].id;
      this._filter = 'all';
      this._render();
      this._bind();
      this._renderDetail();
      this._setupHostResize();
    }

    disconnectedCallback() {
      if (this._resizeObserver) this._resizeObserver.disconnect();
      if (this._hostResizeHandler) window.removeEventListener('resize', this._hostResizeHandler);
      if (this._timers) this._timers.forEach((timer) => window.clearTimeout(timer));
    }

    _render() {
      this.innerHTML = `
        <style>${this._styles()}</style>
        <main class="bw-games-hub" aria-labelledby="bw-games-hub-title">
          <section class="bw-hub-shell">
            <header class="bw-hub-top">
              <div>
                <p class="bw-hub-kicker">Game hub</p>
                <h1 id="bw-games-hub-title">Choose your Berlin game mode</h1>
              </div>
              <a class="bw-hub-tour" href="${BOOKING_URL}">Walk the real city</a>
            </header>

            <div class="bw-hub-layout">
              <aside class="bw-hub-sidebar" aria-label="Game filters">
                <p class="bw-panel-label">Filter</p>
                <div class="bw-filter-group" role="group" aria-label="Filter game modes">
                  ${FILTERS.map((filter) => `
                    <button type="button" class="bw-filter-btn" data-filter="${filter.id}" aria-pressed="${filter.id === 'all' ? 'true' : 'false'}">${this._escapeHtml(filter.label)}</button>
                  `).join('')}
                </div>
                <div class="bw-hub-note">
                  <strong>Best first pick</strong>
                  <span>Use Berlin Battle when someone has never played a BerlinWalk game before.</span>
                </div>
              </aside>

              <section class="bw-game-list" aria-label="Game modes">
                ${GAMES.map((game) => this._renderModeButton(game)).join('')}
              </section>

              <aside class="bw-game-detail" aria-live="polite" aria-label="Selected game details"></aside>
            </div>
          </section>
        </main>
      `;
    }

    _renderModeButton(game) {
      return `
        <button type="button" class="bw-mode-row" data-game-id="${game.id}" data-filters="${game.filters.join(' ')}" aria-pressed="${game.id === this._selectedId ? 'true' : 'false'}">
          <span class="bw-mode-thumb">
            <img src="${asset(game.image)}" alt="" width="1200" height="630" loading="lazy" decoding="async">
          </span>
          <span class="bw-mode-copy">
            <span class="bw-mode-lane">${this._escapeHtml(game.lane)}</span>
            <strong>${this._escapeHtml(game.title)}</strong>
            <em>${this._escapeHtml(game.short)}</em>
          </span>
          <span class="bw-mode-meta">${this._escapeHtml(game.duration)}</span>
        </button>
      `;
    }

    _bind() {
      this.querySelectorAll('.bw-filter-btn').forEach((button) => {
        button.addEventListener('click', () => this._setFilter(button.dataset.filter || 'all'));
      });

      this.querySelectorAll('.bw-mode-row').forEach((button) => {
        button.addEventListener('click', () => this._setSelected(button.dataset.gameId));
      });
    }

    _setFilter(filterId) {
      this._filter = filterId;
      this.querySelectorAll('.bw-filter-btn').forEach((button) => {
        button.setAttribute('aria-pressed', String(button.dataset.filter === filterId));
      });

      const visibleRows = [];
      this.querySelectorAll('.bw-mode-row').forEach((row) => {
        const filters = (row.dataset.filters || '').split(/\s+/);
        const visible = filterId === 'all' || filters.indexOf(filterId) !== -1;
        row.hidden = !visible;
        if (visible) visibleRows.push(row);
      });

      if (!visibleRows.some((row) => row.dataset.gameId === this._selectedId) && visibleRows[0]) {
        this._setSelected(visibleRows[0].dataset.gameId);
      } else {
        this._queueHostSync();
      }
    }

    _setSelected(gameId) {
      if (!GAMES.some((game) => game.id === gameId)) return;
      this._selectedId = gameId;
      this.querySelectorAll('.bw-mode-row').forEach((row) => {
        row.setAttribute('aria-pressed', String(row.dataset.gameId === gameId));
      });
      this._renderDetail();
      this._queueHostSync();
    }

    _renderDetail() {
      const detail = this.querySelector('.bw-game-detail');
      const game = GAMES.find((item) => item.id === this._selectedId) || GAMES[0];
      if (!detail || !game) return;

      detail.innerHTML = `
        <div class="bw-detail-image">
          <img src="${asset(game.image)}" alt="${this._escapeAttribute(game.title + ' cover art')}" width="1200" height="630" loading="eager" decoding="async">
        </div>
        <div class="bw-detail-body">
          <p class="bw-panel-label">${this._escapeHtml(game.lane)}</p>
          <h2>${this._escapeHtml(game.title)}</h2>
          <p class="bw-detail-lead">${this._escapeHtml(game.lead)}</p>

          <dl class="bw-detail-stats">
            <div><dt>Time</dt><dd>${this._escapeHtml(game.duration)}</dd></div>
            <div><dt>Start</dt><dd>${this._escapeHtml(game.start)}</dd></div>
            <div><dt>Result</dt><dd>${this._escapeHtml(game.score)}</dd></div>
          </dl>

          <section class="bw-detail-rules" aria-label="${this._escapeAttribute(game.title + ' rules')}">
            <h3>How it works</h3>
            <ol>
              ${game.rules.map((rule) => `<li>${this._escapeHtml(rule)}</li>`).join('')}
            </ol>
          </section>

          <section class="bw-detail-fit">
            <h3>Best for</h3>
            <p>${this._escapeHtml(game.bestFor)}</p>
          </section>

          <section class="bw-detail-fit">
            <h3>Tour bridge</h3>
            <p>${this._escapeHtml(game.tourBridge)}</p>
          </section>

          <div class="bw-detail-actions">
            <a class="bw-detail-play" href="${gameUrl(game, 'detail_' + game.id)}">${this._escapeHtml(game.cta)} <span aria-hidden="true">-></span></a>
            <a class="bw-detail-secondary" href="${BOOKING_URL}">Book the walk</a>
          </div>
        </div>
      `;
    }

    _setupHostResize() {
      this._timers = [];
      this._hostResizeHandler = () => this._queueHostSync();
      window.addEventListener('resize', this._hostResizeHandler, { passive: true });
      if ('ResizeObserver' in window) {
        this._resizeObserver = new ResizeObserver(() => this._queueHostSync());
        const page = this.querySelector('.bw-games-hub');
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
      const page = this.querySelector('.bw-games-hub');
      if (!page) return;
      const height = Math.ceil(page.getBoundingClientRect().height);
      if (!height || height < 600) return;

      const wixShell = this.parentElement;
      const targets = [this];
      if (wixShell && wixShell.id && wixShell.id.indexOf('comp-') === 0) {
        targets.push(wixShell, wixShell.parentElement, this.closest('section'));
      }

      const targetHeight = `${Math.min(Math.max(height, 760), 3800)}px`;
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
        bw-games-hub-modal {
          display: block;
          width: 100%;
        }

        .bw-games-hub {
          --green: #1B5E20;
          --green-dark: #092811;
          --yellow: #FFE600;
          --lime: #7CB342;
          --cream: #FAFAF5;
          --white: #FFFFFF;
          --ink: #212121;
          --muted: #4E5A4E;
          --red: #E63946;
          background:
            linear-gradient(90deg, rgba(255, 230, 0, 0.12), transparent 30%, rgba(230, 57, 70, 0.08)),
            repeating-linear-gradient(90deg, rgba(27, 94, 32, 0.05) 0 1px, transparent 1px 52px),
            var(--cream);
          color: var(--ink);
          font-family: Montserrat, Arial, sans-serif;
          margin: 0 calc((100% - 100vw) / 2);
          max-width: 100vw;
          min-height: 100svh;
          overflow: hidden;
          padding: clamp(30px, 4vw, 48px) 24px clamp(42px, 5vw, 62px);
          width: 100vw;
        }

        .bw-games-hub *,
        .bw-games-hub *::before,
        .bw-games-hub *::after {
          box-sizing: border-box;
        }

        .bw-games-hub :where(h1, h2, h3, p, dl, dd, ol) {
          margin: 0;
        }

        .bw-hub-shell {
          margin: 0 auto;
          max-width: 1280px;
          width: min(1280px, calc(100vw - 48px));
        }

        .bw-hub-top {
          align-items: end;
          display: flex;
          gap: 22px;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .bw-hub-kicker,
        .bw-panel-label,
        .bw-mode-lane {
          color: var(--green);
          display: block;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0;
          line-height: 1.15;
          text-transform: uppercase;
        }

        .bw-hub-top h1 {
          color: var(--green-dark);
          font-size: clamp(38px, 5.6vw, 82px);
          font-weight: 950;
          letter-spacing: 0;
          line-height: 0.92;
          margin-top: 8px;
          max-width: 820px;
        }

        .bw-hub-tour,
        .bw-detail-play,
        .bw-detail-secondary {
          align-items: center;
          border-radius: 8px;
          display: inline-flex;
          font-size: 14px;
          font-weight: 900;
          justify-content: center;
          min-height: 50px;
          padding: 0 18px;
          text-decoration: none;
          transition: background 160ms ease, border-color 160ms ease, color 160ms ease, transform 160ms ease;
          white-space: nowrap;
        }

        .bw-hub-tour,
        .bw-detail-play {
          background: var(--yellow);
          color: var(--green-dark);
        }

        .bw-detail-secondary {
          background: var(--white);
          border: 1px solid rgba(27, 94, 32, 0.18);
          color: var(--green);
        }

        .bw-hub-tour:hover,
        .bw-detail-play:hover,
        .bw-detail-secondary:hover {
          transform: translateY(-2px);
        }

        .bw-games-hub a:focus-visible,
        .bw-games-hub button:focus-visible {
          outline: 3px solid rgba(255, 230, 0, 0.88);
          outline-offset: 3px;
        }

        .bw-hub-layout {
          align-items: start;
          display: grid;
          gap: 16px;
          grid-template-columns: 220px minmax(340px, 0.9fr) minmax(420px, 1.1fr);
        }

        .bw-hub-sidebar,
        .bw-game-list,
        .bw-game-detail {
          min-width: 0;
        }

        .bw-hub-sidebar {
          position: sticky;
          top: 18px;
        }

        .bw-filter-group {
          display: grid;
          gap: 8px;
          margin-top: 12px;
        }

        .bw-filter-btn {
          align-items: center;
          background: rgba(255, 255, 255, 0.68);
          border: 1px solid rgba(27, 94, 32, 0.18);
          border-radius: 8px;
          color: var(--green-dark);
          cursor: pointer;
          display: flex;
          font: inherit;
          font-size: 13px;
          font-weight: 850;
          justify-content: space-between;
          min-height: 44px;
          padding: 0 12px;
          text-align: left;
        }

        .bw-filter-btn::after {
          background: rgba(27, 94, 32, 0.16);
          border-radius: 999px;
          content: "";
          height: 9px;
          width: 9px;
        }

        .bw-filter-btn[aria-pressed="true"] {
          background: var(--green);
          border-color: var(--green);
          color: var(--white);
        }

        .bw-filter-btn[aria-pressed="true"]::after {
          background: var(--yellow);
        }

        .bw-hub-note {
          border-top: 3px solid var(--red);
          color: var(--muted);
          font-size: 13px;
          font-weight: 650;
          line-height: 1.5;
          margin-top: 22px;
          padding-top: 16px;
        }

        .bw-hub-note strong {
          color: var(--green-dark);
          display: block;
          font-size: 14px;
          font-weight: 950;
          margin-bottom: 5px;
        }

        .bw-game-list {
          display: grid;
          gap: 10px;
        }

        .bw-mode-row {
          align-items: center;
          background: rgba(255, 255, 255, 0.76);
          border: 1px solid rgba(27, 94, 32, 0.16);
          border-radius: 8px;
          color: inherit;
          cursor: pointer;
          display: grid;
          font: inherit;
          gap: 14px;
          grid-template-columns: 112px minmax(0, 1fr) auto;
          min-height: 106px;
          padding: 10px;
          text-align: left;
          transition: background 160ms ease, border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
          width: 100%;
        }

        .bw-mode-row[hidden] {
          display: none;
        }

        .bw-mode-row[aria-pressed="true"] {
          background: var(--white);
          border-color: var(--green);
          box-shadow: inset 5px 0 0 var(--yellow), 0 18px 40px rgba(27, 94, 32, 0.12);
        }

        .bw-mode-row:hover {
          transform: translateY(-1px);
        }

        .bw-mode-thumb {
          aspect-ratio: 16 / 10;
          background: var(--green-dark);
          border-radius: 6px;
          display: block;
          overflow: hidden;
        }

        .bw-mode-thumb img {
          display: block;
          height: 100%;
          object-fit: cover;
          width: 100%;
        }

        .bw-mode-copy {
          display: grid;
          gap: 4px;
          min-width: 0;
        }

        .bw-mode-copy strong {
          color: var(--green-dark);
          font-size: 20px;
          font-weight: 950;
          line-height: 1.05;
        }

        .bw-mode-copy em {
          color: var(--muted);
          font-size: 13px;
          font-style: normal;
          font-weight: 700;
          line-height: 1.35;
        }

        .bw-mode-meta {
          background: #ECF5DF;
          border-radius: 999px;
          color: var(--green);
          font-size: 11px;
          font-weight: 950;
          padding: 7px 9px;
          white-space: nowrap;
        }

        .bw-game-detail {
          background: var(--white);
          border: 1px solid rgba(27, 94, 32, 0.16);
          border-radius: 8px;
          box-shadow: 0 22px 58px rgba(27, 94, 32, 0.12);
          overflow: hidden;
        }

        .bw-detail-image {
          aspect-ratio: 16 / 8;
          background: var(--green-dark);
          overflow: hidden;
        }

        .bw-detail-image img {
          display: block;
          height: 100%;
          object-fit: cover;
          width: 100%;
        }

        .bw-detail-body {
          padding: clamp(20px, 3vw, 30px);
        }

        .bw-detail-body h2 {
          color: var(--green-dark);
          font-size: clamp(34px, 4vw, 56px);
          font-weight: 950;
          letter-spacing: 0;
          line-height: 0.94;
          margin-top: 8px;
        }

        .bw-detail-lead {
          color: var(--muted);
          font-size: 16px;
          font-weight: 650;
          line-height: 1.55;
          margin-top: 14px;
        }

        .bw-detail-stats {
          display: grid;
          gap: 1px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 20px;
        }

        .bw-detail-stats div {
          background: #F4F7EC;
          padding: 12px;
        }

        .bw-detail-stats dt {
          color: rgba(33, 33, 33, 0.56);
          font-size: 10px;
          font-weight: 950;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .bw-detail-stats dd {
          color: var(--green-dark);
          font-size: 13px;
          font-weight: 950;
          line-height: 1.25;
        }

        .bw-detail-rules,
        .bw-detail-fit {
          border-top: 1px solid rgba(27, 94, 32, 0.14);
          margin-top: 22px;
          padding-top: 18px;
        }

        .bw-detail-body h3 {
          color: var(--green);
          font-size: 14px;
          font-weight: 950;
          margin-bottom: 10px;
          text-transform: uppercase;
        }

        .bw-detail-rules ol {
          color: var(--ink);
          display: grid;
          gap: 8px;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.45;
          padding-left: 20px;
        }

        .bw-detail-fit p {
          color: var(--muted);
          font-size: 14px;
          font-weight: 650;
          line-height: 1.55;
        }

        .bw-detail-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 24px;
        }

        @media (max-width: 1080px) {
          .bw-hub-layout {
            grid-template-columns: 200px minmax(0, 1fr);
          }

          .bw-game-detail {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 760px) {
          .bw-games-hub {
            padding: 24px 16px 38px;
          }

          .bw-hub-shell {
            width: min(100%, calc(100vw - 32px));
          }

          .bw-hub-top {
            align-items: start;
            flex-direction: column;
          }

          .bw-hub-top h1 {
            font-size: clamp(36px, 13vw, 58px);
          }

          .bw-hub-layout {
            grid-template-columns: 1fr;
          }

          .bw-hub-sidebar {
            position: static;
          }

          .bw-filter-group {
            display: flex;
            gap: 8px;
            margin: 12px -16px 0;
            overflow-x: auto;
            padding: 0 16px 4px;
            scroll-snap-type: x mandatory;
          }

          .bw-filter-btn {
            flex: 0 0 auto;
            min-width: max-content;
            scroll-snap-align: start;
          }

          .bw-hub-note {
            display: none;
          }

          .bw-mode-row {
            grid-template-columns: 92px minmax(0, 1fr);
            min-height: 94px;
          }

          .bw-mode-meta {
            grid-column: 2;
            justify-self: start;
          }

          .bw-detail-stats {
            grid-template-columns: 1fr;
          }

          .bw-detail-actions a {
            width: 100%;
          }
        }

        @media (max-width: 420px) {
          .bw-mode-row {
            grid-template-columns: 78px minmax(0, 1fr);
            gap: 11px;
            padding: 8px;
          }

          .bw-mode-copy strong {
            font-size: 18px;
          }

          .bw-mode-copy em {
            font-size: 12px;
          }
        }
      `;
    }
  }

  if (!customElements.get('bw-games-hub-modal')) {
    customElements.define('bw-games-hub-modal', BWGamesHubModalElement);
  }
})();
