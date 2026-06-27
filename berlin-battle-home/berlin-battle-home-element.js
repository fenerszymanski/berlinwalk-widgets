const BW_GAMES_HOME_ROOT = (() => {
  const script = document.currentScript;
  const src = script && script.src ? script.src : '';
  if (src.includes('/berlin-battle-home/')) {
    return src.replace(/berlin-battle-home\/berlin-battle-home-element\.js(?:\?.*)?$/, '');
  }
  return 'https://fenerszymanski.github.io/berlinwalk-widgets/';
})();

const BW_GAMES_HOME_URL = 'https://www.berlinwalk.com/games?utm_source=home&utm_medium=section&utm_campaign=berlinwalk_games_home&utm_content=all_games';
const BW_GAMES_HOME_BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based?utm_source=home&utm_medium=section&utm_campaign=berlinwalk_games_home&utm_content=book';
const BW_GAMES_HOME_ASSET_VERSION = 'games-home-day-survival-20260627';

const BW_GAMES_HOME_ITEMS = [
  {
    id: 'berlin-battle',
    kicker: 'Choice battle',
    title: 'Berlin Battle',
    lead: 'Pick your Berlin winner across food, districts, museums, nightlife, transport and tiny city loyalties.',
    meta: '10 battle modes',
    href: 'https://www.berlinwalk.com/games/berlin-battle',
    cta: 'Play Battle',
    image: 'berlin-battle/assets/social/berlin-battle-social-1200x630.jpg'
  },
  {
    id: 'berghain-bouncer',
    kicker: 'Door test',
    title: 'Berghain Bouncer',
    lead: 'A quick club-door pressure game with outfits, answers and very Berlin judgement.',
    meta: '10-second pressure',
    href: 'https://www.berlinwalk.com/games/berghain-bouncer',
    cta: 'Try the door',
    image: 'berlin-bouncer/assets/social/berlin-bouncer-social-1200x630.jpg'
  },
  {
    id: 'berlin-smile-challenge',
    kicker: 'Social puzzle',
    title: 'Berlin Smile Challenge',
    lead: 'Seven small social tests. Try to make a Berliner almost smile.',
    meta: '7 dry-humor scenes',
    href: 'https://www.berlinwalk.com/games/berlin-smile-challenge',
    cta: 'Start Challenge',
    image: 'berlin-smile-challenge/assets/social/berlin-smile-challenge-social-1200x630.jpg'
  },
  {
    id: 'berlin-day-survival',
    kicker: 'Day survival',
    title: 'Berlin Day Survival',
    lead: 'Pick a budget and survive six snack, water and energy decisions in Berlin.',
    meta: '6 city decisions',
    href: 'https://www.berlinwalk.com/games/berlin-day-survival',
    cta: 'Survive the day',
    image: 'berlin-day-survival/assets/social/berlin-day-survival-social-1200x630.jpg'
  }
];

function bwGamesHomeAsset(path, version = BW_GAMES_HOME_ASSET_VERSION) {
  const separator = path.includes('?') ? '&' : '?';
  return `${BW_GAMES_HOME_ROOT}${path}${version ? `${separator}v=${version}` : ''}`;
}

function bwGamesHomeUrl(game, content) {
  const url = new URL(game.href);
  url.searchParams.set('utm_source', 'home');
  url.searchParams.set('utm_medium', 'section');
  url.searchParams.set('utm_campaign', 'berlinwalk_games_home');
  url.searchParams.set('utm_content', content || game.id);
  return url.toString();
}

class BWBerlinBattleHomeElement extends HTMLElement {
  constructor() {
    super();
    this._observer = null;
  }

  connectedCallback() {
    this._render();
    this._observeEntrance();
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  _render() {
    const gameCards = BW_GAMES_HOME_ITEMS.map((game, index) => `
      <article class="bw-games-home-card bw-games-home-card-${game.id}" style="--delay:${80 + index * 90}ms">
        <a class="bw-games-home-card-image" href="${bwGamesHomeUrl(game, `image_${game.id}`)}" aria-label="${this._escapeAttribute(`Play ${game.title}`)}">
          <img src="${bwGamesHomeAsset(game.image)}" alt="${this._escapeAttribute(`${game.title} cover art`)}" width="1200" height="630" loading="lazy" decoding="async">
        </a>
        <div class="bw-games-home-card-body">
          <p class="bw-games-home-card-kicker">${this._escapeHtml(game.kicker)}</p>
          <h3>${this._escapeHtml(game.title)}</h3>
          <p>${this._escapeHtml(game.lead)}</p>
          <div class="bw-games-home-card-foot">
            <span>${this._escapeHtml(game.meta)}</span>
            <a href="${bwGamesHomeUrl(game, `button_${game.id}`)}">${this._escapeHtml(game.cta)} <span aria-hidden="true">-&gt;</span></a>
          </div>
        </div>
      </article>
    `).join('');

    this.innerHTML = `
      <style>
        bw-berlin-battle-home {
          display: block;
          height: auto !important;
          min-height: 0 !important;
          width: 100%;
        }

        #comp-mqew6dkh,
        #comp-mqew6dkh .comp-mqew6dkh-container,
        #comp-mqew6lnt,
        section:has(bw-berlin-battle-home),
        section:has(bw-berlin-battle-home) > .max-width-container,
        [id^="comp-"]:has(> bw-berlin-battle-home),
        [id^="comp-"]:has(bw-berlin-battle-home) {
          height: auto !important;
          min-height: 0 !important;
        }

        #comp-mqew6dkh .comp-mqew6dkh-container,
        section:has(bw-berlin-battle-home) > .max-width-container {
          grid-template-rows: auto !important;
        }

        .bw-games-home {
          --green: #1B5E20;
          --green-dark: #073B16;
          --yellow: #FFE600;
          --lime: #7CB342;
          --cream: #FAFAF5;
          --paper: #FFFFFF;
          --text: #212121;
          --muted: #526052;
          background:
            linear-gradient(90deg, rgba(27, 94, 32, 0.07) 1px, transparent 1px),
            linear-gradient(180deg, rgba(27, 94, 32, 0.07) 1px, transparent 1px),
            var(--cream);
          background-size: 34px 34px;
          box-sizing: border-box;
          color: var(--text);
          font-family: Montserrat, Arial, sans-serif;
          margin: 0 calc((100% - 100vw) / 2);
          max-width: 100vw;
          overflow: hidden;
          padding: clamp(34px, 4.6vw, 54px) 24px;
          position: relative;
          width: 100vw;
        }

        .bw-games-home::before {
          background: var(--yellow);
          content: "";
          height: 4px;
          left: 0;
          position: absolute;
          right: 32%;
          top: 0;
        }

        .bw-games-home *,
        .bw-games-home *::before,
        .bw-games-home *::after {
          box-sizing: border-box;
        }

        .bw-games-home :where(h2, h3, p) {
          margin: 0;
        }

        .bw-games-home a {
          color: inherit;
        }

        .bw-games-home-inner {
          display: grid;
          gap: clamp(22px, 3vw, 34px);
          grid-template-columns: minmax(0, 1fr);
          margin: 0 auto;
          max-width: 1240px;
          width: min(1240px, calc(100vw - 48px));
        }

        .bw-games-home-copy {
          align-self: center;
          min-width: 0;
        }

        .bw-games-home-kicker {
          color: var(--green);
          display: block;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0;
          line-height: 1.25;
          margin-bottom: 12px;
          text-transform: uppercase;
        }

        .bw-games-home-title {
          color: var(--green);
          font-size: clamp(34px, 4.2vw, 54px);
          font-weight: 900;
          letter-spacing: 0;
          line-height: 0.98;
          margin-bottom: 14px;
          max-width: 520px;
        }

        .bw-games-home-lead {
          color: var(--muted);
          font-size: clamp(16px, 1.35vw, 18px);
          font-weight: 650;
          line-height: 1.42;
          margin-bottom: 20px;
          max-width: 520px;
        }

        .bw-games-home-actions {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .bw-games-home-btn {
          align-items: center;
          border-radius: 999px;
          display: inline-flex;
          font-size: 14px;
          font-weight: 900;
          justify-content: center;
          letter-spacing: 0;
          line-height: 1.1;
          min-height: 52px;
          padding: 0 22px;
          text-decoration: none;
          transition: background 160ms ease, border-color 160ms ease, box-shadow 160ms ease, color 160ms ease, transform 160ms ease;
        }

        .bw-games-home-btn:focus-visible,
        .bw-games-home-card a:focus-visible {
          outline: 3px solid rgba(255, 230, 0, 0.9);
          outline-offset: 3px;
        }

        .bw-games-home-btn-primary {
          background: var(--yellow);
          box-shadow: 0 14px 28px rgba(27, 94, 32, 0.16);
          color: var(--green);
        }

        .bw-games-home-btn-secondary {
          background: var(--paper);
          border: 1px solid #C5E1A5;
          color: var(--green);
        }

        .bw-games-home-btn:hover,
        .bw-games-home-btn:focus-visible {
          transform: translateY(-2px);
        }

        .bw-games-home.ready .bw-games-home-card {
          opacity: 1;
          transform: translateY(0);
        }

        .bw-games-home-grid {
          display: grid;
          gap: 14px;
          min-width: 0;
        }

        .bw-games-home-card {
          background: var(--paper);
          border: 1px solid #C5E1A5;
          border-radius: 8px;
          box-shadow: 0 16px 34px rgba(27, 94, 32, 0.1);
          color: inherit;
          display: grid;
          grid-template-columns: minmax(128px, 0.44fr) minmax(0, 1fr);
          min-width: 0;
          opacity: 0;
          overflow: hidden;
          transform: translateY(12px);
          transition: border-color 160ms ease, box-shadow 160ms ease, opacity 420ms ease-out, transform 420ms ease-out;
          transition-delay: var(--delay);
        }

        .bw-games-home-card:hover,
        .bw-games-home-card:focus-within {
          border-color: var(--green);
          box-shadow: 0 18px 38px rgba(27, 94, 32, 0.16);
          transform: translateY(-2px);
        }

        .bw-games-home-card-image {
          background: #EAF3DF;
          color: inherit;
          display: block;
          min-height: 100%;
          overflow: hidden;
          text-decoration: none;
        }

        .bw-games-home-card-image img {
          display: block;
          height: 100%;
          min-height: 136px;
          object-fit: cover;
          width: 100%;
        }

        .bw-games-home-card-body {
          display: grid;
          gap: 8px;
          min-width: 0;
          padding: 15px 16px 14px;
        }

        .bw-games-home-card-kicker {
          color: var(--lime);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0;
          line-height: 1.1;
          text-transform: uppercase;
        }

        .bw-games-home-card h3 {
          color: var(--green);
          font-size: clamp(20px, 2vw, 26px);
          font-weight: 900;
          letter-spacing: 0;
          line-height: 1;
        }

        .bw-games-home-card p:not(.bw-games-home-card-kicker) {
          color: var(--muted);
          font-size: 14px;
          font-weight: 650;
          line-height: 1.4;
        }

        .bw-games-home-card-foot {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 10px 14px;
          justify-content: space-between;
          margin-top: 4px;
        }

        .bw-games-home-card-foot span {
          color: var(--green-dark);
          font-size: 12px;
          font-weight: 850;
          line-height: 1.2;
        }

        .bw-games-home-card-foot a {
          color: var(--green);
          font-size: 13px;
          font-weight: 900;
          line-height: 1.2;
          text-decoration: none;
        }

        @media (min-width: 1040px) {
          .bw-games-home-inner {
            align-items: center;
            grid-template-columns: minmax(350px, 0.72fr) minmax(500px, 1.28fr);
          }

          .bw-games-home-card:nth-child(2) {
            margin-left: 18px;
          }
        }

        @media (min-width: 1180px) {
          .bw-games-home-inner {
            margin-left: max(24px, calc((100vw - 1560px) / 2));
            margin-right: auto;
            max-width: none;
            width: min(1180px, calc(100vw - 260px));
          }
        }

        @media (min-width: 1640px) {
          .bw-games-home-inner {
            width: min(1440px, calc(100vw - 370px));
          }
        }

        @media (max-width: 940px) {
          .bw-games-home {
            padding: 58px 18px;
          }
        }

        @media (max-width: 680px) {
          .bw-games-home {
            padding: 48px 14px;
          }

          .bw-games-home-inner {
            width: min(100%, calc(100vw - 28px));
          }

          .bw-games-home-title {
            font-size: clamp(34px, 11vw, 48px);
          }

          .bw-games-home-actions,
          .bw-games-home-btn {
            width: 100%;
          }

          .bw-games-home-btn {
            padding-left: 14px;
            padding-right: 14px;
          }

          .bw-games-home-card {
            grid-template-columns: minmax(0, 1fr);
          }

          .bw-games-home-card-image img {
            aspect-ratio: 16 / 9;
            height: auto;
            min-height: 0;
          }

          .bw-games-home-card-body {
            padding: 16px 16px 15px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bw-games-home *,
          .bw-games-home *::before,
          .bw-games-home *::after {
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      </style>
      <section class="bw-games-home" aria-labelledby="bw-games-home-title">
        <div class="bw-games-home-inner">
          <div class="bw-games-home-copy">
            <span class="bw-games-home-kicker">BerlinWalk games</span>
            <h2 class="bw-games-home-title" id="bw-games-home-title">Play Berlin before you walk it.</h2>
            <p class="bw-games-home-lead">Three quick games for different Berlin moods: pick your city winner, face the club door, or try to make Berlin almost smile. Then come walk the real city with me.</p>
            <div class="bw-games-home-actions">
              <a class="bw-games-home-btn bw-games-home-btn-primary" href="${BW_GAMES_HOME_URL}">See all games</a>
              <a class="bw-games-home-btn bw-games-home-btn-secondary" href="${BW_GAMES_HOME_BOOKING_URL}">Book the walking tour</a>
            </div>
          </div>
          <div class="bw-games-home-grid" aria-label="BerlinWalk games">
            ${gameCards}
          </div>
        </div>
      </section>
    `;
  }

  _observeEntrance() {
    const section = this.querySelector('.bw-games-home');
    if (!section) return;
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      section.classList.add('ready');
      return;
    }
    this._observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        section.classList.add('ready');
        if (this._observer) this._observer.disconnect();
      });
    }, { threshold: 0.25 });
    this._observer.observe(section);
  }

  _escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  _escapeAttribute(value) {
    return this._escapeHtml(value);
  }
}

if (!customElements.get('bw-berlin-battle-home')) {
  customElements.define('bw-berlin-battle-home', BWBerlinBattleHomeElement);
}
