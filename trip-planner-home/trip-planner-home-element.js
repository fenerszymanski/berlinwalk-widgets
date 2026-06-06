const BW_TRIP_PLANNER_HOME_ROOT = (() => {
  const script = document.currentScript;
  const src = script && script.src ? script.src : '';
  if (src.includes('/trip-planner-home/')) {
    return src.replace(/trip-planner-home\/trip-planner-home-element\.js(?:\?.*)?$/, '');
  }
  return 'https://fenerszymanski.github.io/berlinwalk-widgets/';
})();

const BW_TRIP_PLANNER_HOME_URL = 'https://www.berlinwalk.com/berlin-trip-planner';

function bwTripPlannerHomeAsset(path) {
  return `${BW_TRIP_PLANNER_HOME_ROOT}${path}`;
}

class BWTripPlannerHomeElement extends HTMLElement {
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
    const heroImage = bwTripPlannerHomeAsset('ultimate-berlin-trip-planner/assets/berlin-trip-planner-hero.jpg');
    const proofIcons = {
      plan: bwTripPlannerHomeAsset('berlin-trip-planner-page/assets/proof-plan.webp'),
      weather: bwTripPlannerHomeAsset('berlin-trip-planner-page/assets/proof-weather.webp'),
      map: bwTripPlannerHomeAsset('berlin-trip-planner-page/assets/proof-map.webp'),
      guide: bwTripPlannerHomeAsset('berlin-trip-planner-page/assets/proof-guide.webp')
    };

    this.innerHTML = `
      <style>
        bw-trip-planner-home {
          display: block;
          width: 100%;
        }

        .bw-trip-planner-home {
          --green: #1B5E20;
          --green-dark: #073B16;
          --yellow: #FFE600;
          --lime: #7CB342;
          --cream: #FAFAF5;
          --text: #212121;
          --muted: #E7F0E1;
          background: var(--green-dark);
          box-sizing: border-box;
          color: #FFFFFF;
          font-family: Montserrat, Arial, sans-serif;
          margin: 0 calc((100% - 100vw) / 2);
          max-width: 100vw;
          overflow: hidden;
          position: relative;
          width: 100vw;
        }

        .bw-trip-planner-home *,
        .bw-trip-planner-home *::before,
        .bw-trip-planner-home *::after {
          box-sizing: border-box;
        }

        .bw-trip-planner-home h2,
        .bw-trip-planner-home p {
          margin-top: 0;
        }

        .bw-trip-planner-home a {
          color: inherit;
        }

        .bw-trip-planner-home .bw-trip-planner-bg {
          bottom: 0;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
          z-index: 0;
        }

        .bw-trip-planner-home .bw-trip-planner-bg img {
          display: block;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          width: 100%;
        }

        .bw-trip-planner-home .bw-trip-planner-bg::after {
          background:
            linear-gradient(90deg, rgba(7, 59, 22, 0.94) 0%, rgba(10, 65, 25, 0.89) 42%, rgba(7, 59, 22, 0.68) 100%),
            linear-gradient(180deg, rgba(7, 59, 22, 0.12), rgba(7, 59, 22, 0.34));
          bottom: 0;
          content: "";
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
        }

        .bw-trip-planner-home .bw-trip-planner-inner {
          align-items: center;
          display: grid;
          gap: 36px;
          grid-template-columns: minmax(0, 0.85fr) minmax(360px, 0.75fr);
          margin: 0 auto;
          max-width: 1180px;
          min-height: 430px;
          padding: 70px 24px;
          position: relative;
          z-index: 1;
        }

        .bw-trip-planner-home .bw-trip-planner-copy {
          max-width: 710px;
          min-width: 0;
        }

        .bw-trip-planner-home .bw-trip-planner-kicker {
          color: var(--yellow);
          display: block;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 5px;
          line-height: 1.25;
          margin-bottom: 14px;
          text-transform: uppercase;
        }

        .bw-trip-planner-home .bw-trip-planner-title {
          color: #FFFFFF;
          font-size: clamp(42px, 6vw, 82px);
          font-weight: 900;
          letter-spacing: 0;
          line-height: 0.94;
          margin-bottom: 22px;
          max-width: 720px;
        }

        .bw-trip-planner-home .bw-trip-planner-lead {
          color: rgba(255, 255, 255, 0.9);
          font-size: clamp(18px, 2.2vw, 25px);
          font-weight: 500;
          line-height: 1.45;
          margin-bottom: 26px;
          max-width: 760px;
        }

        .bw-trip-planner-home .bw-trip-planner-actions {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
        }

        .bw-trip-planner-home .bw-trip-planner-btn {
          align-items: center;
          border-radius: 999px;
          display: inline-flex;
          font-size: 13px;
          font-weight: 900;
          justify-content: center;
          letter-spacing: 1px;
          line-height: 1;
          min-height: 56px;
          padding: 0 28px;
          text-decoration: none;
          text-transform: uppercase;
          transition: background 160ms ease, box-shadow 160ms ease, transform 160ms ease;
        }

        .bw-trip-planner-home .bw-trip-planner-btn-primary {
          background: var(--yellow);
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.18);
          color: var(--green-dark);
        }

        .bw-trip-planner-home .bw-trip-planner-btn-primary:hover,
        .bw-trip-planner-home .bw-trip-planner-btn-primary:focus-visible {
          background: #FFFFFF;
          color: var(--green);
          transform: translateY(-2px);
        }

        .bw-trip-planner-home .bw-trip-planner-note {
          color: rgba(255, 255, 255, 0.82);
          font-size: 13px;
          font-weight: 700;
          line-height: 1.45;
        }

        .bw-trip-planner-home .bw-trip-planner-btn:focus-visible {
          outline: 3px solid rgba(255, 230, 0, 0.95);
          outline-offset: 4px;
        }

        .bw-trip-planner-home .bw-trip-planner-panel {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 8px;
          box-shadow: 0 28px 70px rgba(0, 0, 0, 0.22);
          display: grid;
          gap: 12px;
          padding: 14px;
        }

        .bw-trip-planner-home .bw-trip-planner-proof {
          align-items: stretch;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: #FFFFFF;
          display: grid;
          grid-template-columns: 96px minmax(0, 1fr);
          min-height: 96px;
          overflow: hidden;
          text-decoration: none;
          transform: translateY(12px);
          transition: background 160ms ease, border-color 160ms ease, opacity 420ms ease-out, transform 420ms ease-out;
        }

        .bw-trip-planner-home.ready .bw-trip-planner-proof {
          opacity: 1;
          transform: translateY(0);
        }

        .bw-trip-planner-home .bw-trip-planner-proof:hover,
        .bw-trip-planner-home .bw-trip-planner-proof:focus-visible {
          background: rgba(255, 255, 255, 0.16);
          border-color: rgba(255, 230, 0, 0.74);
        }

        .bw-trip-planner-home .bw-trip-planner-proof:focus-visible {
          outline: 3px solid rgba(255, 230, 0, 0.95);
          outline-offset: 3px;
        }

        .bw-trip-planner-home .bw-trip-planner-proof:nth-child(1) { transition-delay: 30ms; }
        .bw-trip-planner-home .bw-trip-planner-proof:nth-child(2) { transition-delay: 90ms; }
        .bw-trip-planner-home .bw-trip-planner-proof:nth-child(3) { transition-delay: 150ms; }
        .bw-trip-planner-home .bw-trip-planner-proof:nth-child(4) { transition-delay: 210ms; }

        .bw-trip-planner-home .bw-trip-planner-proof-image {
          align-items: center;
          background: #F8F7EA;
          display: flex;
          justify-content: center;
          min-height: 96px;
          padding: 9px;
        }

        .bw-trip-planner-home .bw-trip-planner-proof-image img {
          display: block;
          height: 100%;
          max-height: 78px;
          max-width: 78px;
          object-fit: contain;
          width: 100%;
        }

        .bw-trip-planner-home .bw-trip-planner-proof-copy {
          align-self: center;
          min-width: 0;
          padding: 14px 16px;
        }

        .bw-trip-planner-home .bw-trip-planner-proof strong {
          color: var(--yellow);
          display: block;
          font-size: 19px;
          font-weight: 900;
          line-height: 1.15;
          margin-bottom: 5px;
        }

        .bw-trip-planner-home .bw-trip-planner-proof span {
          color: rgba(255, 255, 255, 0.88);
          display: block;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.35;
        }

        .bw-trip-planner-home .bw-trip-planner-mini {
          align-items: center;
          border-top: 1px solid rgba(255, 255, 255, 0.18);
          color: rgba(255, 255, 255, 0.84);
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          justify-content: space-between;
          padding-top: 13px;
        }

        .bw-trip-planner-home .bw-trip-planner-mini span {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1px;
          line-height: 1.35;
          text-transform: uppercase;
        }

        @media (max-width: 980px) {
          .bw-trip-planner-home .bw-trip-planner-inner {
            grid-template-columns: 1fr;
            min-height: 0;
            padding: 58px 24px;
          }

          .bw-trip-planner-home .bw-trip-planner-panel {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .bw-trip-planner-home .bw-trip-planner-mini {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 640px) {
          .bw-trip-planner-home .bw-trip-planner-inner {
            gap: 28px;
            padding: 50px 18px;
          }

          .bw-trip-planner-home .bw-trip-planner-kicker {
            font-size: 11px;
            letter-spacing: 3px;
          }

          .bw-trip-planner-home .bw-trip-planner-title {
            font-size: clamp(39px, 14vw, 58px);
            line-height: 0.98;
            margin-bottom: 18px;
          }

          .bw-trip-planner-home .bw-trip-planner-lead {
            font-size: 18px;
            line-height: 1.48;
          }

          .bw-trip-planner-home .bw-trip-planner-actions {
            align-items: stretch;
            flex-direction: column;
          }

          .bw-trip-planner-home .bw-trip-planner-btn {
            width: 100%;
          }

          .bw-trip-planner-home .bw-trip-planner-note {
            text-align: center;
          }

          .bw-trip-planner-home .bw-trip-planner-panel {
            grid-template-columns: 1fr;
            padding: 10px;
          }

          .bw-trip-planner-home .bw-trip-planner-proof {
            grid-template-columns: 82px minmax(0, 1fr);
            min-height: 82px;
          }

          .bw-trip-planner-home .bw-trip-planner-proof-image {
            min-height: 82px;
          }

          .bw-trip-planner-home .bw-trip-planner-proof-image img {
            max-height: 66px;
            max-width: 66px;
          }

          .bw-trip-planner-home .bw-trip-planner-proof strong {
            font-size: 17px;
          }

          .bw-trip-planner-home .bw-trip-planner-proof span {
            font-size: 13px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bw-trip-planner-home .bw-trip-planner-btn,
          .bw-trip-planner-home .bw-trip-planner-proof {
            transition: none;
          }
        }
      </style>

      <section class="bw-trip-planner-home" aria-labelledby="bw-trip-planner-home-title">
        <div class="bw-trip-planner-bg" aria-hidden="true">
          <img src="${heroImage}" alt="" loading="lazy">
        </div>

        <div class="bw-trip-planner-inner">
          <div class="bw-trip-planner-copy">
            <span class="bw-trip-planner-kicker">BerlinWalk local planner</span>
            <h2 id="bw-trip-planner-home-title" class="bw-trip-planner-title">Berlin Trip Planner</h2>
            <p class="bw-trip-planner-lead">Build a realistic 1 to 7 day Berlin plan around your arrival date, first day, weather, map links, and the best BerlinWalk tour slot.</p>
            <div class="bw-trip-planner-actions">
              <a class="bw-trip-planner-btn bw-trip-planner-btn-primary" href="${BW_TRIP_PLANNER_HOME_URL}" target="_top">Build my plan</a>
              <span class="bw-trip-planner-note">Free preview first. Email unlocks the full phone-ready plan.</span>
            </div>
          </div>

          <div class="bw-trip-planner-panel" aria-label="Planner highlights">
            <a class="bw-trip-planner-proof" href="${BW_TRIP_PLANNER_HOME_URL}" target="_top">
              <span class="bw-trip-planner-proof-image" aria-hidden="true"><img src="${proofIcons.plan}" alt="" loading="lazy"></span>
              <span class="bw-trip-planner-proof-copy"><strong>1 to 7 days</strong><span>Daily route rhythm</span></span>
            </a>
            <a class="bw-trip-planner-proof" href="${BW_TRIP_PLANNER_HOME_URL}" target="_top">
              <span class="bw-trip-planner-proof-image" aria-hidden="true"><img src="${proofIcons.weather}" alt="" loading="lazy"></span>
              <span class="bw-trip-planner-proof-copy"><strong>Weather aware</strong><span>Live or monthly fallback</span></span>
            </a>
            <a class="bw-trip-planner-proof" href="${BW_TRIP_PLANNER_HOME_URL}" target="_top">
              <span class="bw-trip-planner-proof-image" aria-hidden="true"><img src="${proofIcons.map}" alt="" loading="lazy"></span>
              <span class="bw-trip-planner-proof-copy"><strong>Map ready</strong><span>Routes and place links</span></span>
            </a>
            <a class="bw-trip-planner-proof" href="${BW_TRIP_PLANNER_HOME_URL}" target="_top">
              <span class="bw-trip-planner-proof-image" aria-hidden="true"><img src="${proofIcons.guide}" alt="" loading="lazy"></span>
              <span class="bw-trip-planner-proof-copy"><strong>Local guide</strong><span>Yusuf's route read</span></span>
            </a>
            <div class="bw-trip-planner-mini" aria-hidden="true">
              <span>Arrival first</span>
              <span>Daily areas</span>
              <span>PDF + print</span>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  _observeEntrance() {
    const section = this.querySelector('.bw-trip-planner-home');
    if (!section) return;

    if (!('IntersectionObserver' in window)) {
      section.classList.add('ready');
      return;
    }

    this._observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        section.classList.add('ready');
        if (this._observer) this._observer.disconnect();
      });
    }, { threshold: 0.18 });

    this._observer.observe(section);
  }
}

if (!customElements.get('bw-trip-planner-home')) {
  customElements.define('bw-trip-planner-home', BWTripPlannerHomeElement);
}
