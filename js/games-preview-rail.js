(function () {
  const SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : '';
  const BASE_URL = SCRIPT_URL
    ? new URL('../', SCRIPT_URL).toString()
    : 'https://fenerszymanski.github.io/berlinwalk-widgets/';
  const BUILD = 'games-preview-rail-no-rewind-20260707a';

  const GAMES = [
    {
      id: 'berlin-battle',
      title: 'Berlin Battle',
      kicker: 'Choice battle',
      lead: 'Pick winners across food, districts, museums, nights out and tiny Berlin loyalties.',
      image: 'berlin-battle/assets/social/berlin-battle-social-1200x630.jpg',
      href: 'https://www.berlinwalk.com/games/berlin-battle',
      cta: 'Play Battle'
    },
    {
      id: 'berlin-day-survival',
      title: 'Berlin Day Survival',
      kicker: 'Budget game',
      lead: 'Choose a tiny first-day budget and see whether Berlin keeps your wallet alive.',
      image: 'berlin-day-survival/assets/social/berlin-day-survival-social-1200x630.jpg',
      href: 'https://www.berlinwalk.com/games/berlin-day-survival',
      cta: 'Survive the day'
    },
    {
      id: 'berghain-bouncer',
      title: 'Berghain Bouncer',
      kicker: 'Door test',
      lead: 'A quick club-door pressure game with outfits, answers and one hard look.',
      image: 'berlin-bouncer/assets/social/berlin-bouncer-social-1200x630.jpg',
      href: 'https://www.berlinwalk.com/games/berghain-bouncer',
      cta: 'Try the door'
    },
    {
      id: 'berlin-smile-challenge',
      title: 'Berlin Smile Challenge',
      kicker: 'Social puzzle',
      lead: 'Seven tiny social tests. One mission: make a Berliner almost smile.',
      image: 'berlin-smile-challenge/assets/social/berlin-smile-challenge-social-1200x630.jpg',
      href: 'https://www.berlinwalk.com/games/berlin-smile-challenge',
      cta: 'Start challenge'
    }
  ];

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function asset(path) {
    const url = new URL(path, BASE_URL);
    url.searchParams.set('v', BUILD);
    return url.toString();
  }

  function gameUrl(game, source, content) {
    const url = new URL(game.href);
    url.searchParams.set('utm_source', source || 'game_page');
    url.searchParams.set('utm_medium', 'game_preview');
    url.searchParams.set('utm_campaign', 'berlinwalk_games');
    url.searchParams.set('utm_content', content || game.id);
    return url.toString();
  }

  function ensureStyles() {
    if (document.getElementById('bw-games-preview-rail-css')) return;
    const style = document.createElement('style');
    style.id = 'bw-games-preview-rail-css';
    style.textContent = `
      .bw-games-preview-rail {
        --gp-bg: rgba(255, 255, 255, 0.82);
        --gp-card: #FFFFFF;
        --gp-ink: #073B16;
        --gp-muted: #53615B;
        --gp-line: rgba(27, 94, 32, 0.18);
        --gp-yellow: #FFE600;
        --gp-green: #1B5E20;
        --gp-red: #E63946;
        color: var(--gp-ink);
        display: block;
        font-family: Montserrat, Arial, sans-serif;
        margin: 38px auto 0;
        max-width: 1180px;
        min-width: 0;
        width: 100%;
      }

      .bw-games-preview-rail[data-theme="night"] {
        --gp-bg: #111111;
        --gp-card: #181818;
        --gp-ink: #FFFFFF;
        --gp-muted: #B9C0B8;
        --gp-line: rgba(230, 255, 0, 0.26);
        --gp-yellow: #E6FF00;
        --gp-green: #E6FF00;
        --gp-red: #888888;
      }

      .bw-games-preview-rail,
      .bw-games-preview-rail * {
        box-sizing: border-box;
      }

      .bw-games-preview-head {
        align-items: end;
        display: flex;
        gap: 16px;
        justify-content: space-between;
        margin: 0 0 16px;
      }

      .bw-games-preview-kicker {
        color: var(--gp-green);
        font-size: 12px;
        font-weight: 950;
        letter-spacing: 0.12em;
        line-height: 1;
        margin: 0 0 8px;
        text-transform: uppercase;
      }

      .bw-games-preview-head h2 {
        color: var(--gp-ink);
        font-size: clamp(24px, 3vw, 38px);
        font-weight: 950;
        letter-spacing: 0;
        line-height: 1.02;
        margin: 0;
      }

      .bw-games-preview-head a {
        align-items: center;
        background: var(--gp-yellow);
        border: 2px solid var(--gp-ink);
        border-radius: 8px;
        color: var(--gp-ink);
        display: inline-flex;
        flex: 0 0 auto;
        font-size: 13px;
        font-weight: 950;
        min-height: 42px;
        padding: 10px 14px;
        text-decoration: none;
      }

      .bw-games-preview-grid {
        display: grid;
        gap: 14px;
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .bw-games-preview-card {
        background: var(--gp-card);
        border: 1px solid var(--gp-line);
        border-radius: 8px;
        box-shadow: 0 14px 34px rgba(8, 36, 16, 0.10);
        color: var(--gp-ink);
        display: grid;
        min-width: 0;
        overflow: hidden;
        text-decoration: none;
      }

      .bw-games-preview-card img {
        aspect-ratio: 16 / 9;
        background: rgba(27, 94, 32, 0.08);
        display: block;
        height: auto;
        object-fit: cover;
        width: 100%;
      }

      .bw-games-preview-card[data-game="berlin-day-survival"] img {
        object-position: 24% center;
      }

      .bw-games-preview-card[data-game="berlin-smile-challenge"] img {
        object-position: 43% center;
      }

      .bw-games-preview-body {
        display: grid;
        gap: 8px;
        padding: 14px;
      }

      .bw-games-preview-body span {
        color: var(--gp-red);
        font-size: 11px;
        font-weight: 950;
        letter-spacing: 0.08em;
        line-height: 1;
        text-transform: uppercase;
      }

      .bw-games-preview-body strong {
        color: var(--gp-ink);
        font-size: 18px;
        font-weight: 950;
        line-height: 1.08;
      }

      .bw-games-preview-body p {
        color: var(--gp-muted);
        font-size: 13px;
        font-weight: 750;
        line-height: 1.35;
        margin: 0;
      }

      .bw-games-preview-body em {
        color: var(--gp-green);
        font-size: 12px;
        font-style: normal;
        font-weight: 950;
        line-height: 1.1;
        margin-top: 2px;
      }

      @media (max-width: 760px) {
        .bw-games-preview-rail {
          margin-top: 30px;
        }

        .bw-games-preview-head {
          align-items: start;
          display: grid;
        }

        .bw-games-preview-head a {
          justify-self: start;
        }

        .bw-games-preview-grid {
          grid-template-columns: 1fr;
        }

        .bw-games-preview-card {
          grid-template-columns: 124px minmax(0, 1fr);
        }

        .bw-games-preview-card img {
          aspect-ratio: auto;
          height: 100%;
          min-height: 132px;
        }

        .bw-games-preview-body {
          padding: 12px;
        }

        .bw-games-preview-body strong {
          font-size: 16px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function render(container, options) {
    if (!container) return;
    const opts = options || {};
    const current = opts.current || '';
    const source = opts.source || current || 'game_page';
    const items = GAMES.filter((game) => game.id !== current).slice(0, 3);
    ensureStyles();
    container.className = 'bw-games-preview-rail';
    if (opts.theme) container.dataset.theme = opts.theme;
    container.innerHTML = `
      <div class="bw-games-preview-head">
        <div>
          <p class="bw-games-preview-kicker">Keep playing</p>
          <h2>Try another Berlin game</h2>
        </div>
        <a href="${gameUrl({ href: 'https://www.berlinwalk.com/games' }, source, 'all_games')}">All games</a>
      </div>
      <div class="bw-games-preview-grid">
        ${items.map((game) => `
          <a class="bw-games-preview-card" data-game="${escapeHtml(game.id)}" href="${gameUrl(game, source, game.id)}">
            <img src="${asset(game.image)}" alt="${escapeHtml(game.title)} preview image" loading="eager" decoding="async">
            <span class="bw-games-preview-body">
              <span>${escapeHtml(game.kicker)}</span>
              <strong>${escapeHtml(game.title)}</strong>
              <p>${escapeHtml(game.lead)}</p>
              <em>${escapeHtml(game.cta)} -&gt;</em>
            </span>
          </a>
        `).join('')}
      </div>
    `;
  }

  window.BerlinWalkGamesPreviewRail = {
    render,
    games: GAMES.slice()
  };
})();
