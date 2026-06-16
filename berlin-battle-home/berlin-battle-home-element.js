const BW_BATTLE_HOME_ROOT = (() => {
  const script = document.currentScript;
  const src = script && script.src ? script.src : '';
  if (src.includes('/berlin-battle-home/')) {
    return src.replace(/berlin-battle-home\/berlin-battle-home-element\.js(?:\?.*)?$/, '');
  }
  return 'https://fenerszymanski.github.io/berlinwalk-widgets/';
})();

const BW_BATTLE_HOME_GAME_URL = 'https://www.berlinwalk.com/games/berlin-battle?utm_source=home&utm_medium=section&utm_campaign=berlin_battle_home&utm_content=play';
const BW_BATTLE_HOME_BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based?utm_source=home&utm_medium=section&utm_campaign=berlin_battle_home&utm_content=book';
const BW_BATTLE_HOME_ASSET_VERSION = '2026-06-16-editorial-illustration';

function bwBattleHomeAsset(path, version = BW_BATTLE_HOME_ASSET_VERSION) {
  const separator = path.includes('?') ? '&' : '?';
  return `${BW_BATTLE_HOME_ROOT}${path}${version ? `${separator}v=${version}` : ''}`;
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
    const foodCover = bwBattleHomeAsset('berlin-battle/assets/topics/food-battle-cover.webp');
    const districtCover = bwBattleHomeAsset('berlin-battle/assets/topics/district-battle-cover.webp');
    const museumCover = bwBattleHomeAsset('berlin-battle/assets/topics/museum-battle-cover.webp');
    const nightCover = bwBattleHomeAsset('berlin-battle/assets/topics/night-battle-cover.webp');
    const districtCard = bwBattleHomeAsset('berlin-battle/assets/cards/districts/kreuzberg.webp');
    const museumCard = bwBattleHomeAsset('berlin-battle/assets/cards/museums/neues-museum.webp');
    const nightCard = bwBattleHomeAsset('berlin-battle/assets/cards/night/rooftop-sunset.webp');

    this.innerHTML = `
      <style>
        bw-berlin-battle-home {
          display: block;
          width: 100%;
        }

        .bw-battle-home {
          --green: #1B5E20;
          --green-dark: #073B16;
          --yellow: #FFE600;
          --lime: #7CB342;
          --cream: #FAFAF5;
          --text: #212121;
          --muted: #4E5A4E;
          background: var(--cream);
          box-sizing: border-box;
          color: var(--text);
          font-family: Montserrat, Arial, sans-serif;
          margin: 0 calc((100% - 100vw) / 2);
          max-width: 100vw;
          overflow: hidden;
          padding: 72px 24px;
          width: 100vw;
        }

        .bw-battle-home *,
        .bw-battle-home *::before,
        .bw-battle-home *::after {
          box-sizing: border-box;
        }

        .bw-battle-home :where(h2, h3, p) {
          margin: 0;
        }

        .bw-battle-home a {
          color: inherit;
        }

        .bw-battle-home-inner {
          display: grid;
          gap: 34px;
          grid-template-columns: minmax(0, 0.86fr) minmax(420px, 0.74fr);
          margin: 0 auto;
          max-width: 1160px;
        }

        .bw-battle-home-copy {
          align-self: center;
          min-width: 0;
        }

        .bw-battle-home-kicker {
          color: var(--green);
          display: block;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0;
          line-height: 1.25;
          margin-bottom: 12px;
          text-transform: uppercase;
        }

        .bw-battle-home-title {
          color: var(--green);
          font-size: clamp(38px, 5vw, 66px);
          font-weight: 900;
          letter-spacing: 0;
          line-height: 0.96;
          margin-bottom: 18px;
          max-width: 720px;
        }

        .bw-battle-home-lead {
          color: var(--muted);
          font-size: clamp(17px, 2vw, 22px);
          font-weight: 650;
          line-height: 1.48;
          margin-bottom: 34px;
          max-width: 720px;
        }

        .bw-battle-home-actions {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 22px;
        }

        .bw-battle-home-btn {
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

        .bw-battle-home-btn:focus-visible,
        .bw-battle-mode:focus-visible {
          outline: 3px solid rgba(255, 230, 0, 0.9);
          outline-offset: 3px;
        }

        .bw-battle-home-btn-primary {
          background: var(--yellow);
          box-shadow: 0 14px 28px rgba(27, 94, 32, 0.16);
          color: var(--green);
        }

        .bw-battle-home-btn-secondary {
          background: #FFFFFF;
          border: 1px solid #C5E1A5;
          color: var(--green);
        }

        .bw-battle-home-btn:hover,
        .bw-battle-home-btn:focus-visible {
          transform: translateY(-2px);
        }

        .bw-battle-home-proof {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .bw-battle-home-proof span {
          align-items: center;
          background: #FFFFFF;
          border: 1px solid #C5E1A5;
          border-radius: 999px;
          color: var(--green);
          display: inline-flex;
          font-size: 13px;
          font-weight: 850;
          min-height: 34px;
          padding: 0 12px;
        }

        .bw-battle-home-visual {
          align-self: stretch;
          background:
            linear-gradient(135deg, var(--green-dark) 0%, var(--green) 56%, var(--cream) 56%, var(--cream) 100%);
          border: 1px solid rgba(27, 94, 32, 0.22);
          border-radius: 8px;
          box-shadow: 0 22px 50px rgba(18, 63, 22, 0.18);
          color: #FFFFFF;
          min-height: 420px;
          overflow: hidden;
          position: relative;
        }

        .bw-battle-home-visual-bg {
          bottom: 0;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
        }

        .bw-battle-home-visual-bg::before {
          background: rgba(255, 255, 255, 0.14);
          border: 1px solid rgba(255, 255, 255, 0.18);
          content: "";
          inset: 24px 28px 24px 18px;
          position: absolute;
          transform: rotate(-2deg);
        }

        .bw-battle-home-visual-bg::after {
          background:
            linear-gradient(180deg, rgba(7, 59, 22, 0.12), rgba(7, 59, 22, 0.34)),
            repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.08) 0, rgba(255, 255, 255, 0.08) 1px, transparent 1px, transparent 52px);
          bottom: 0;
          content: "";
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
        }

        .bw-battle-home-preview {
          display: grid;
          gap: 16px;
          grid-template-rows: auto minmax(0, 1fr) auto;
          min-height: 420px;
          padding: 18px;
          position: relative;
          z-index: 1;
        }

        .bw-battle-home-preview-top {
          align-items: center;
          display: flex;
          justify-content: space-between;
          gap: 12px;
        }

        .bw-battle-home-preview-top strong {
          color: var(--yellow);
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0;
          line-height: 1.2;
          text-transform: uppercase;
        }

        .bw-battle-home-preview-top span {
          color: rgba(255, 255, 255, 0.84);
          font-size: 13px;
          font-weight: 800;
          line-height: 1.2;
        }

        .bw-battle-home-card-board {
          display: grid;
          gap: 12px;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
          grid-template-rows: repeat(2, minmax(120px, 1fr));
          min-height: 0;
        }

        .bw-battle-home-feature-card {
          background: #FFFFFF;
          border: 1px solid rgba(27, 94, 32, 0.16);
          border-radius: 8px;
          color: var(--text);
          display: grid;
          grid-template-rows: minmax(0, 1fr) auto;
          height: 100%;
          min-width: 0;
          opacity: 0;
          overflow: hidden;
          transform: translateY(14px);
          transition: opacity 460ms ease-out, transform 460ms ease-out;
        }

        .bw-battle-home-feature-card:first-child {
          grid-row: 1 / -1;
          transform: rotate(-1.5deg) translateY(14px);
        }

        .bw-battle-home-feature-card:nth-child(2) {
          transform: rotate(1deg) translateY(14px);
        }

        .bw-battle-home-feature-card:nth-child(3) {
          transform: rotate(-0.8deg) translateY(14px);
        }

        .bw-battle-home.ready .bw-battle-home-feature-card,
        .bw-battle-home.ready .bw-battle-mode {
          opacity: 1;
          transform: translateY(0);
        }

        .bw-battle-home-feature-card:nth-child(1) {
          transition-delay: 80ms;
        }

        .bw-battle-home-feature-card:nth-child(2) {
          transition-delay: 160ms;
        }

        .bw-battle-home-feature-card:nth-child(3) {
          transition-delay: 240ms;
        }

        .bw-battle-home-feature-card img {
          display: block;
          height: 100%;
          min-height: 0;
          object-fit: cover;
          width: 100%;
        }

        .bw-battle-home-feature-card span {
          color: var(--green);
          display: block;
          font-size: 14px;
          font-weight: 900;
          line-height: 1.18;
          padding: 11px 12px;
        }

        .bw-battle-home-result {
          background: rgba(255, 255, 255, 0.92);
          border-left: 6px solid var(--yellow);
          border-radius: 8px;
          color: var(--green);
          padding: 14px 16px;
        }

        .bw-battle-home-result span {
          display: block;
          font-size: 12px;
          font-weight: 900;
          line-height: 1.25;
          margin-bottom: 4px;
          text-transform: uppercase;
        }

        .bw-battle-home-result strong {
          display: block;
          font-size: 24px;
          font-weight: 900;
          line-height: 1.1;
        }

        .bw-battle-home-modes {
          display: grid;
          gap: 12px;
          grid-column: 1 / -1;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          margin-top: 4px;
        }

        .bw-battle-mode {
          background: #FFFFFF;
          border: 1px solid #C5E1A5;
          border-radius: 8px;
          color: inherit;
          min-width: 0;
          opacity: 0;
          overflow: hidden;
          text-decoration: none;
          transform: translateY(12px);
          transition: border-color 160ms ease, box-shadow 160ms ease, opacity 420ms ease-out, transform 420ms ease-out;
        }

        .bw-battle-mode:nth-child(1) { transition-delay: 60ms; }
        .bw-battle-mode:nth-child(2) { transition-delay: 120ms; }
        .bw-battle-mode:nth-child(3) { transition-delay: 180ms; }
        .bw-battle-mode:nth-child(4) { transition-delay: 240ms; }

        .bw-battle-mode:hover,
        .bw-battle-mode:focus-visible {
          border-color: var(--green);
          box-shadow: 0 12px 26px rgba(27, 94, 32, 0.14);
          transform: translateY(-2px);
        }

        .bw-battle-mode img {
          aspect-ratio: 16 / 10;
          display: block;
          height: auto;
          object-fit: cover;
          width: 100%;
        }

        .bw-battle-mode span {
          color: var(--green);
          display: block;
          font-size: 14px;
          font-weight: 900;
          line-height: 1.18;
          padding: 12px;
        }

        @media (max-width: 940px) {
          .bw-battle-home {
            padding: 58px 18px;
          }

          .bw-battle-home-inner {
            grid-template-columns: minmax(0, 1fr);
          }

          .bw-battle-home-visual {
            min-height: 390px;
          }

          .bw-battle-home-preview {
            min-height: 390px;
          }
        }

        @media (max-width: 620px) {
          .bw-battle-home {
            padding: 48px 14px;
          }

          .bw-battle-home-title {
            font-size: clamp(34px, 11vw, 48px);
          }

          .bw-battle-home-actions,
          .bw-battle-home-btn {
            width: 100%;
          }

          .bw-battle-home-btn {
            padding-left: 14px;
            padding-right: 14px;
          }

          .bw-battle-home-preview {
            gap: 14px;
            padding: 14px;
          }

          .bw-battle-home-card-board {
            gap: 8px;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            grid-template-rows: minmax(136px, 1fr);
          }

          .bw-battle-home-feature-card:first-child {
            grid-row: auto;
          }

          .bw-battle-home-feature-card span {
            font-size: 12px;
            min-height: 40px;
            padding: 9px;
          }

          .bw-battle-home-modes {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .bw-battle-mode span {
            font-size: 13px;
            padding: 10px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bw-battle-home *,
          .bw-battle-home *::before,
          .bw-battle-home *::after {
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      </style>
      <section class="bw-battle-home" aria-labelledby="bw-battle-home-title">
        <div class="bw-battle-home-inner">
          <div class="bw-battle-home-copy">
            <span class="bw-battle-home-kicker">BerlinWalk game</span>
            <h2 class="bw-battle-home-title" id="bw-battle-home-title">Find your Berlin winner before the walk.</h2>
            <p class="bw-battle-home-lead">Pick between Berlin food, districts, museums and nights. Get a personal winner, then come walk the real city with me.</p>
            <div class="bw-battle-home-actions">
              <a class="bw-battle-home-btn bw-battle-home-btn-primary" href="${BW_BATTLE_HOME_GAME_URL}">Play Berlin Battle</a>
              <a class="bw-battle-home-btn bw-battle-home-btn-secondary" href="${BW_BATTLE_HOME_BOOKING_URL}">Book the walking tour</a>
            </div>
            <div class="bw-battle-home-proof" aria-label="Berlin Battle quick facts">
              <span>Four battles</span>
              <span>Personal winner</span>
              <span>Share card</span>
            </div>
          </div>
          <div class="bw-battle-home-visual" aria-label="Berlin Battle preview">
            <div class="bw-battle-home-visual-bg" aria-hidden="true"></div>
            <div class="bw-battle-home-preview">
              <div class="bw-battle-home-preview-top">
                <strong>Berlin Battle</strong>
                <span>Choose a Berlin mood</span>
              </div>
              <div class="bw-battle-home-card-board" aria-hidden="true">
                <div class="bw-battle-home-feature-card">
                  <img src="${districtCard}" alt="" width="640" height="640" loading="lazy" decoding="async">
                  <span>District mood</span>
                </div>
                <div class="bw-battle-home-feature-card">
                  <img src="${museumCard}" alt="" width="640" height="640" loading="lazy" decoding="async">
                  <span>Museum day</span>
                </div>
                <div class="bw-battle-home-feature-card">
                  <img src="${nightCard}" alt="" width="640" height="640" loading="lazy" decoding="async">
                  <span>Berlin night</span>
                </div>
              </div>
              <div class="bw-battle-home-result">
                <span>Your result card</span>
                <strong>My Berlin winner</strong>
              </div>
            </div>
          </div>
          <div class="bw-battle-home-modes" aria-label="Berlin Battle modes">
            <a class="bw-battle-mode" href="${BW_BATTLE_HOME_GAME_URL}">
              <img src="${foodCover}" alt="" width="960" height="600" loading="lazy" decoding="async">
              <span>Food Battle</span>
            </a>
            <a class="bw-battle-mode" href="${BW_BATTLE_HOME_GAME_URL}">
              <img src="${districtCover}" alt="" width="960" height="600" loading="lazy" decoding="async">
              <span>District Battle</span>
            </a>
            <a class="bw-battle-mode" href="${BW_BATTLE_HOME_GAME_URL}">
              <img src="${museumCover}" alt="" width="960" height="600" loading="lazy" decoding="async">
              <span>Museum Battle</span>
            </a>
            <a class="bw-battle-mode" href="${BW_BATTLE_HOME_GAME_URL}">
              <img src="${nightCover}" alt="" width="960" height="600" loading="lazy" decoding="async">
              <span>Night Battle</span>
            </a>
          </div>
        </div>
      </section>
    `;
  }

  _observeEntrance() {
    const section = this.querySelector('.bw-battle-home');
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
}

if (!customElements.get('bw-berlin-battle-home')) {
  customElements.define('bw-berlin-battle-home', BWBerlinBattleHomeElement);
}
