(function () {
  const SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : '';
  const BASE_URL = SCRIPT_URL
    ? new URL('../', SCRIPT_URL).toString()
    : 'https://fenerszymanski.github.io/berlinwalk-widgets/';
  const WIDGET_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/ultimate-berlin-trip-planner/';
  const BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';

  const asset = (path) => new URL(path, BASE_URL).toString();

  function ensureFont() {
    if (document.querySelector('link[data-bw-trip-page-font]')) return;
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://fonts.gstatic.com';
    preconnect.crossOrigin = 'anonymous';

    const font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Merriweather:wght@400;700&display=swap';
    font.dataset.bwTripPageFont = 'true';

    document.head.appendChild(preconnect);
    document.head.appendChild(font);
  }

  function validHeight(value) {
    return typeof value === 'number' && Number.isFinite(value) && value > 320 && value < 7000;
  }

  class BWBerlinTripPlannerPage extends HTMLElement {
    connectedCallback() {
      ensureFont();
      this._render();
      this._bind();
      this._setupPlannerResize();
    }

    disconnectedCallback() {
      if (this._messageHandler) window.removeEventListener('message', this._messageHandler);
      if (this._resizeObserver) this._resizeObserver.disconnect();
    }

    _plannerSrc() {
      const url = new URL(WIDGET_URL);
      const current = new URLSearchParams(window.location.search || '');
      const keys = [
        'context',
        'date',
        'tripLength',
        'arrivalTime',
        'arrivalPoint',
        'stayArea',
        'groupType',
        'firstTime',
        'interests',
        'budgetStyle',
        'mustHandle',
        'pace',
        'tourIntent',
        'weather',
        'planAccess'
      ];
      keys.forEach((key) => {
        if (current.has(key)) url.searchParams.set(key, current.get(key));
      });
      if (!url.searchParams.has('context')) url.searchParams.set('context', 'tool');
      url.searchParams.set('source', current.get('source') || 'berlin_trip_planner_page');
      url.searchParams.set('attribution', 'none');
      return url.toString();
    }

    _render() {
      const heroImage = asset('ultimate-berlin-trip-planner/assets/berlin-trip-planner-hero.jpg');
      const yusufImage = 'https://static.wixstatic.com/media/5a08a3_ac78d5df37b2486ab6662cf3872ea9a6~mv2.jpg/v1/fill/w_900,h_1125,al_c,q_85/file.jpg';
      const proofPlanIcon = asset('berlin-trip-planner-page/assets/proof-plan.webp');
      const proofWeatherIcon = asset('berlin-trip-planner-page/assets/proof-weather.webp');
      const proofMapIcon = asset('berlin-trip-planner-page/assets/proof-map.webp');
      const proofGuideIcon = asset('berlin-trip-planner-page/assets/proof-guide.webp');
      const processArrivalArt = asset('berlin-trip-planner-page/assets/process-arrival.webp');
      const processEnergyArt = asset('berlin-trip-planner-page/assets/process-energy.webp');
      const processTourArt = asset('berlin-trip-planner-page/assets/process-tour.webp');
      const arrivalArt = asset('ultimate-berlin-trip-planner/assets/day-art/day-oil-arrival.webp');
      const wallArt = asset('ultimate-berlin-trip-planner/assets/day-art/day-oil-wall.webp');
      const museumArt = asset('ultimate-berlin-trip-planner/assets/day-art/day-oil-museums.webp');
      const foodArt = asset('ultimate-berlin-trip-planner/assets/day-art/day-oil-food.webp');

      this.innerHTML = `
        <style>${this._styles()}</style>
        <main class="bw-trip-page" style="--hero-image: url('${heroImage}'); --compare-image: url('${processEnergyArt}');">
          <section class="bw-trip-hero" aria-labelledby="bw-trip-page-title">
            <div class="bw-trip-hero-shade"></div>
            <div class="bw-trip-inner bw-trip-hero-inner">
              <p class="bw-trip-kicker">BerlinWalk local planner</p>
              <h1 id="bw-trip-page-title">Berlin Trip Planner</h1>
              <p class="bw-trip-hero-copy">Build a realistic 1 to 7 day Berlin plan around your arrival date, first day, weather, opening-day traps, map links, and the best BerlinWalk tour slot.</p>
              <div class="bw-trip-actions">
                <a class="bw-trip-btn bw-trip-btn-primary" href="#planner">Build my plan</a>
              </div>
              <div class="bw-trip-proof" aria-label="Planner highlights">
                <span><img src="${proofPlanIcon}" alt="" aria-hidden="true"><b>1-7 days</b><em>Daily route rhythm</em></span>
                <span><img src="${proofWeatherIcon}" alt="" aria-hidden="true"><b>Weather aware</b><em>Live or monthly fallback</em></span>
                <span><img src="${proofMapIcon}" alt="" aria-hidden="true"><b>Map ready</b><em>Route and place links</em></span>
                <span><img src="${proofGuideIcon}" alt="" aria-hidden="true"><b>Local guide</b><em>Yusuf's route read</em></span>
              </div>
            </div>
          </section>

          <section class="bw-trip-planner-band" id="planner" aria-label="Berlin trip planner widget">
            <div class="bw-trip-inner">
              <div class="bw-trip-planner-head">
                <div>
                  <p class="bw-trip-section-kicker">Start here</p>
                  <h2>Answer a few basics, then get your Berlin plan.</h2>
                </div>
                <p>Build a quick preview first. If the route feels useful, send it to yourself to keep the full plan, map links, print view, and PDF export.</p>
              </div>
              <div class="bw-trip-widget-shell">
                <iframe data-bw-trip-planner-frame src="${this._plannerSrc()}" title="Berlin Trip Planner" loading="eager"></iframe>
              </div>
            </div>
          </section>

          <section class="bw-trip-section bw-trip-why" id="why">
            <div class="bw-trip-inner">
              <div class="bw-trip-section-head">
                <p class="bw-trip-section-kicker">Why this page exists</p>
                <h2>Most Berlin plans break on the first day.</h2>
                <p>Arrival time, BER tickets, Sunday rules, museum closures, weather, and overpacked routes are what usually make a Berlin itinerary feel messy. This planner starts with those constraints first.</p>
              </div>
              <div class="bw-trip-steps">
                <article>
                  <img class="bw-trip-step-art" src="${processArrivalArt}" alt="">
                  <div class="bw-trip-step-body">
                    <span>01</span>
                    <h3>Set the arrival reality</h3>
                    <p>Tell it when you land, where you start, how long you stay, and what kind of trip you want.</p>
                  </div>
                </article>
                <article>
                  <img class="bw-trip-step-art" src="${processEnergyArt}" alt="">
                  <div class="bw-trip-step-body">
                    <span>02</span>
                    <h3>Get a route that respects energy</h3>
                    <p>The plan keeps days area-by-area, avoids repeat loops, and saves heavier stops for better moments.</p>
                  </div>
                </article>
                <article>
                  <img class="bw-trip-step-art" src="${processTourArt}" alt="">
                  <div class="bw-trip-step-body">
                    <span>03</span>
                    <h3>Use BerlinWalk at the right time</h3>
                    <p>If the walking tour fits, the planner places it early enough to give the rest of the trip more context.</p>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <section class="bw-trip-section bw-trip-guide">
            <div class="bw-trip-inner bw-trip-guide-grid">
              <figure class="bw-trip-guide-photo">
                <img src="${yusufImage}" alt="Yusuf from BerlinWalk">
              </figure>
              <div class="bw-trip-guide-copy">
                <p class="bw-trip-section-kicker">Built by BerlinWalk</p>
                <h2>It should feel like a local guide checked your route before you arrived.</h2>
                <p>This is not a generic AI itinerary. The planner uses fixed Berlin rules first: when the tour runs, when museums are risky, how arrival days behave, when Potsdam makes sense, and where a day should slow down instead of spreading across the city.</p>
                <a class="bw-trip-text-link" href="${BOOKING_URL}">Book the BerlinWalk tour</a>
              </div>
            </div>
          </section>

          <section class="bw-trip-section bw-trip-covers">
            <div class="bw-trip-inner">
              <div class="bw-trip-section-head">
                <p class="bw-trip-section-kicker">What it plans</p>
                <h2>A full trip, not just a sightseeing list.</h2>
              </div>
              <div class="bw-trip-cover-grid">
                <article>
                  <img src="${arrivalArt}" alt="Berlin arrival day illustration">
                  <h3>Arrival day</h3>
                  <p>BER, Hauptbahnhof, hotel starts, tickets, food, first walk, and when to stop.</p>
                </article>
                <article>
                  <img src="${wallArt}" alt="Berlin Wall route illustration">
                  <h3>Wall and Cold War</h3>
                  <p>Wall Memorial, East Side Gallery, Topography of Terror, and smart ordering.</p>
                </article>
                <article>
                  <img src="${museumArt}" alt="Museum Island illustration">
                  <h3>Museums and history</h3>
                  <p>One strong museum anchor, central history, rain backup, and timed-entry cues.</p>
                </article>
                <article>
                  <img src="${foodArt}" alt="Berlin food and neighborhood illustration">
                  <h3>Food and neighborhoods</h3>
                  <p>Kreuzberg, Prenzlauer Berg, Hackescher Markt, simple dinners, and local pauses.</p>
                </article>
              </div>
            </div>
          </section>

          <section class="bw-trip-section bw-trip-compare">
            <div class="bw-trip-inner bw-trip-compare-grid">
              <div>
                <p class="bw-trip-section-kicker">Use it when</p>
                <h2>You want a plan before you arrive, but you do not want to overplan Berlin.</h2>
              </div>
              <ul>
                <li><b>First time in Berlin:</b> start with context, then build around the city center.</li>
                <li><b>Short trip:</b> protect the first day and avoid wasting energy on cross-town jumps.</li>
                <li><b>Longer stay:</b> add neighborhoods, museums, low-budget days, and Potsdam only when it fits.</li>
                <li><b>Weather uncertainty:</b> keep museum, market, mall, and cafe backup options inside the same area.</li>
              </ul>
            </div>
          </section>

          <section class="bw-trip-section bw-trip-final">
            <div class="bw-trip-inner bw-trip-final-box">
              <p class="bw-trip-section-kicker">Ready when you are</p>
              <h2>Build your Berlin plan now.</h2>
              <p>It takes a few minutes. Start with your arrival date and let the plan shape itself around the trip you actually have.</p>
              <div class="bw-trip-actions">
                <a class="bw-trip-btn bw-trip-btn-primary" href="#planner">Open the planner</a>
              </div>
            </div>
          </section>
        </main>
      `;
    }

    _bind() {
      this.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (event) => {
          const target = this.querySelector(link.getAttribute('href'));
          if (!target) return;
          event.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
    }

    _setupPlannerResize() {
      const frame = this.querySelector('[data-bw-trip-planner-frame]');
      if (!frame) return;

      const setHeight = (height) => {
        const next = Math.ceil(height) + 8;
        frame.style.height = `${next}px`;
        frame.style.minHeight = `${next}px`;
      };

      this._messageHandler = (event) => {
        if (event.source !== frame.contentWindow) return;
        if (!event.data || event.data.type !== 'bw-resize' || !validHeight(event.data.height)) return;
        setHeight(event.data.height);
      };

      window.addEventListener('message', this._messageHandler);
      setHeight(1900);
    }

    _styles() {
      return `
        bw-berlin-trip-planner-page {
          display: block;
          width: 100%;
        }

        .bw-trip-page {
          --green: #1B5E20;
          --green-dark: #0E3214;
          --yellow: #FFE600;
          --lime: #7CB342;
          --light-green: #C5E1A5;
          --cream: #FAFAF5;
          --text: #212121;
          --muted: #4E5A4E;
          --blue: #2F80ED;
          --blue-soft: #EAF4FF;
          background: var(--cream);
          color: var(--text);
          font-family: Montserrat, Arial, sans-serif;
          overflow-x: hidden;
          width: 100%;
        }

        .bw-trip-page *,
        .bw-trip-page *::before,
        .bw-trip-page *::after {
          box-sizing: border-box;
        }

        .bw-trip-page h1,
        .bw-trip-page h2,
        .bw-trip-page h3,
        .bw-trip-page p,
        .bw-trip-page figure {
          margin-top: 0;
        }

        .bw-trip-page a {
          color: inherit;
        }

        .bw-trip-inner {
          margin: 0 auto;
          max-width: 1180px;
          width: min(100% - 40px, 1180px);
        }

        .bw-trip-hero {
          align-items: end;
          background-image: var(--hero-image);
          background-position: center;
          background-size: cover;
          display: grid;
          min-height: clamp(560px, 78vh, 760px);
          overflow: hidden;
          position: relative;
        }

        .bw-trip-hero-shade {
          background:
            linear-gradient(90deg, rgba(14, 50, 20, 0.92) 0%, rgba(14, 50, 20, 0.76) 43%, rgba(14, 50, 20, 0.26) 100%),
            linear-gradient(0deg, rgba(14, 50, 20, 0.94) 0%, rgba(14, 50, 20, 0) 32%);
          inset: 0;
          position: absolute;
        }

        .bw-trip-hero-inner {
          padding: 88px 0 54px;
          position: relative;
          z-index: 1;
        }

        .bw-trip-kicker,
        .bw-trip-section-kicker {
          color: var(--yellow);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 2.3px;
          line-height: 1.35;
          margin-bottom: 14px;
          text-transform: uppercase;
        }

        .bw-trip-section-kicker {
          color: var(--green);
        }

        .bw-trip-hero h1 {
          color: #FFFFFF;
          font-size: clamp(56px, 8vw, 112px);
          font-weight: 900;
          letter-spacing: 0;
          line-height: 0.92;
          margin-bottom: 24px;
          max-width: 980px;
        }

        .bw-trip-hero-copy {
          color: rgba(255, 255, 255, 0.92);
          font-size: clamp(18px, 2vw, 26px);
          font-weight: 600;
          line-height: 1.45;
          margin-bottom: 28px;
          max-width: 860px;
        }

        .bw-trip-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 26px;
        }

        .bw-trip-btn {
          align-items: center;
          border-radius: 999px;
          display: inline-flex;
          font-size: 13px;
          font-weight: 900;
          justify-content: center;
          letter-spacing: 0.8px;
          min-height: 52px;
          padding: 15px 24px;
          text-decoration: none;
          text-transform: uppercase;
          transition: transform 160ms ease, background 160ms ease, color 160ms ease;
        }

        .bw-trip-btn:hover,
        .bw-trip-btn:focus-visible {
          transform: translateY(-1px);
        }

        .bw-trip-btn-primary {
          background: var(--yellow);
          color: var(--green);
        }

        .bw-trip-btn-secondary {
          background: rgba(255, 255, 255, 0.13);
          border: 1px solid rgba(255, 255, 255, 0.46);
          color: #FFFFFF;
        }

        .bw-trip-proof {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          max-width: 1080px;
        }

        .bw-trip-proof span {
          align-items: stretch;
          background: rgba(250, 250, 245, 0.13);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.86);
          display: grid;
          font-size: 12px;
          grid-template-columns: 96px 1fr;
          line-height: 1.45;
          min-height: 96px;
          min-width: 0;
          overflow: hidden;
          padding: 0;
        }

        .bw-trip-proof img {
          display: block;
          grid-row: 1 / span 2;
          height: 100%;
          min-height: 96px;
          object-fit: cover;
          width: 96px;
        }

        .bw-trip-proof b {
          color: var(--yellow);
          display: block;
          font-size: 13px;
          margin: auto 14px 2px;
          min-width: 0;
        }

        .bw-trip-proof em {
          display: block;
          font-style: normal;
          grid-column: 2;
          margin: 0 14px auto;
          min-width: 0;
        }

        .bw-trip-planner-band {
          background:
            linear-gradient(180deg, #FFFFFF 0%, #F7FAF1 100%);
          border-bottom: 1px solid #DCE8C8;
          border-top: 8px solid var(--yellow);
          padding: 38px 0 54px;
        }

        .bw-trip-planner-head {
          align-items: end;
          display: grid;
          gap: 24px;
          grid-template-columns: minmax(0, 0.9fr) minmax(280px, 0.56fr);
          margin-bottom: 24px;
        }

        .bw-trip-planner-head h2,
        .bw-trip-section-head h2,
        .bw-trip-guide-copy h2,
        .bw-trip-compare h2,
        .bw-trip-final h2 {
          color: var(--green);
          font-size: clamp(34px, 5vw, 58px);
          font-weight: 900;
          letter-spacing: 0;
          line-height: 1.02;
          margin-bottom: 14px;
        }

        .bw-trip-planner-head p,
        .bw-trip-section-head p,
        .bw-trip-guide-copy p,
        .bw-trip-final p {
          color: var(--muted);
          font-size: 17px;
          font-weight: 500;
          line-height: 1.65;
          margin-bottom: 0;
        }

        .bw-trip-widget-shell {
          background: #FFFFFF;
          border: 1px solid #DCE8C8;
          border-radius: 18px;
          box-shadow: 0 24px 60px rgba(27, 94, 32, 0.14);
          overflow: hidden;
        }

        .bw-trip-widget-shell iframe {
          border: 0;
          display: block;
          height: 1900px;
          min-height: 1900px;
          width: 100%;
        }

        .bw-trip-section {
          padding: 72px 0;
        }

        .bw-trip-section-head {
          max-width: 820px;
          margin-bottom: 30px;
        }

        .bw-trip-why {
          background: var(--cream);
        }

        .bw-trip-steps {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .bw-trip-steps article,
        .bw-trip-cover-grid article,
        .bw-trip-final-box {
          background: #FFFFFF;
          border: 1px solid #DCE8C8;
          border-radius: 10px;
        }

        .bw-trip-steps article {
          min-width: 0;
          overflow: hidden;
          padding: 0;
        }

        .bw-trip-step-art {
          aspect-ratio: 16 / 9;
          display: block;
          object-fit: cover;
          width: 100%;
        }

        .bw-trip-step-body {
          padding: 22px 24px 24px;
        }

        .bw-trip-steps span {
          align-items: center;
          background: var(--yellow);
          border-radius: 999px;
          color: var(--green);
          display: inline-flex;
          font-size: 12px;
          font-weight: 900;
          height: 38px;
          justify-content: center;
          margin-bottom: 18px;
          width: 38px;
        }

        .bw-trip-page h3 {
          color: var(--green);
          font-size: 22px;
          font-weight: 900;
          line-height: 1.18;
          margin-bottom: 10px;
        }

        .bw-trip-steps p,
        .bw-trip-cover-grid p,
        .bw-trip-compare li {
          color: var(--muted);
          font-size: 15px;
          font-weight: 500;
          line-height: 1.58;
          margin-bottom: 0;
        }

        .bw-trip-guide {
          background: #0E3214;
          color: #FFFFFF;
        }

        .bw-trip-guide-grid {
          align-items: center;
          display: grid;
          gap: 42px;
          grid-template-columns: minmax(270px, 0.45fr) minmax(0, 0.9fr);
        }

        .bw-trip-guide-photo {
          aspect-ratio: 4 / 5;
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 18px;
          margin: 0;
          overflow: hidden;
        }

        .bw-trip-guide-photo img {
          display: block;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          width: 100%;
        }

        .bw-trip-guide .bw-trip-section-kicker,
        .bw-trip-final .bw-trip-section-kicker {
          color: var(--yellow);
        }

        .bw-trip-guide-copy h2,
        .bw-trip-guide-copy p {
          color: #FFFFFF;
        }

        .bw-trip-guide-copy p {
          color: rgba(255, 255, 255, 0.84);
          max-width: 780px;
        }

        .bw-trip-text-link {
          color: var(--yellow);
          display: inline-flex;
          font-weight: 900;
          margin-top: 20px;
          text-decoration: none;
        }

        .bw-trip-covers {
          background: linear-gradient(180deg, #FFFFFF, #F6FAEF);
        }

        .bw-trip-cover-grid {
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .bw-trip-cover-grid article {
          overflow: hidden;
        }

        .bw-trip-cover-grid img {
          aspect-ratio: 16 / 10;
          display: block;
          height: auto;
          object-fit: cover;
          width: 100%;
        }

        .bw-trip-cover-grid h3,
        .bw-trip-cover-grid p {
          padding-left: 18px;
          padding-right: 18px;
        }

        .bw-trip-cover-grid h3 {
          margin-bottom: 8px;
          margin-top: 18px;
        }

        .bw-trip-cover-grid p {
          padding-bottom: 22px;
        }

        .bw-trip-compare {
          background: #EDF7E8;
          isolation: isolate;
          overflow: hidden;
          position: relative;
        }

        .bw-trip-compare::before {
          background-image: var(--compare-image);
          background-position: center;
          background-size: cover;
          content: "";
          filter: blur(18px);
          inset: -32px;
          opacity: 0.76;
          position: absolute;
          transform: scale(1.03);
          z-index: -2;
        }

        .bw-trip-compare::after {
          background:
            linear-gradient(90deg, rgba(250, 250, 245, 0.88) 0%, rgba(250, 250, 245, 0.66) 48%, rgba(237, 247, 232, 0.58) 100%);
          content: "";
          inset: 0;
          position: absolute;
          z-index: -1;
        }

        .bw-trip-compare-grid {
          display: grid;
          gap: 42px;
          grid-template-columns: minmax(0, 0.78fr) minmax(320px, 0.82fr);
        }

        .bw-trip-compare ul {
          display: grid;
          gap: 12px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .bw-trip-compare li {
          background: rgba(255, 255, 255, 0.84);
          border: 1px solid rgba(197, 225, 165, 0.78);
          border-left: 6px solid var(--green);
          border-radius: 10px;
          box-shadow: 0 16px 36px rgba(27, 94, 32, 0.08);
          padding: 16px 18px;
        }

        .bw-trip-compare b {
          color: var(--green);
        }

        .bw-trip-final {
          background: var(--cream);
        }

        .bw-trip-final-box {
          background:
            linear-gradient(135deg, rgba(27, 94, 32, 0.98), rgba(14, 50, 20, 0.98));
          border: 0;
          color: #FFFFFF;
          padding: clamp(30px, 6vw, 58px);
        }

        .bw-trip-final h2,
        .bw-trip-final p {
          color: #FFFFFF;
          max-width: 760px;
        }

        .bw-trip-final p {
          color: rgba(255, 255, 255, 0.84);
        }

        .bw-trip-final .bw-trip-actions {
          margin-bottom: 0;
          margin-top: 30px;
        }

        .bw-trip-final .bw-trip-btn-primary {
          color: var(--green);
        }

        @media (max-width: 960px) {
          .bw-trip-proof,
          .bw-trip-cover-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .bw-trip-planner-head,
          .bw-trip-guide-grid,
          .bw-trip-compare-grid {
            grid-template-columns: 1fr;
          }

          .bw-trip-steps {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .bw-trip-inner {
            width: min(100% - 24px, 1180px);
          }

          .bw-trip-hero {
            min-height: 680px;
          }

          .bw-trip-hero-shade {
            background:
              linear-gradient(180deg, rgba(14, 50, 20, 0.68) 0%, rgba(14, 50, 20, 0.92) 62%, rgba(14, 50, 20, 0.98) 100%);
          }

          .bw-trip-hero-inner {
            padding: 58px 0 34px;
          }

          .bw-trip-proof,
          .bw-trip-cover-grid {
            grid-template-columns: 1fr;
          }

          .bw-trip-actions {
            display: grid;
          }

          .bw-trip-btn {
            width: 100%;
          }

          .bw-trip-planner-band,
          .bw-trip-section {
            padding-left: 0;
            padding-right: 0;
          }

          .bw-trip-widget-shell {
            border-left: 0;
            border-radius: 12px;
            border-right: 0;
            margin-left: -12px;
            margin-right: -12px;
          }
        }
      `;
    }
  }

  if (!customElements.get('bw-berlin-trip-planner-page')) {
    customElements.define('bw-berlin-trip-planner-page', BWBerlinTripPlannerPage);
  }
})();
