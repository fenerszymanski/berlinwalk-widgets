const SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : '';
const BASE_URL = SCRIPT_URL
  ? new URL('../', SCRIPT_URL).toString()
  : 'https://fenerszymanski.github.io/berlinwalk-widgets/';
const ASSET_BUILD = 'kitkat-door-test-page-v8-20260827';
const GAMES_PREVIEW_BUILD = 'games-preview-rail-kitkat-door-test-20260825';

function loadGamesPreviewRail(callback) {
  if (window.BerlinWalkGamesPreviewRail) {
    callback();
    return;
  }
  const existing = document.querySelector('script[data-bw-games-preview-rail]');
  if (existing) {
    existing.addEventListener('load', callback, { once: true });
    return;
  }
  const script = document.createElement('script');
  script.src = new URL(`js/games-preview-rail.js?v=${GAMES_PREVIEW_BUILD}`, BASE_URL).toString();
  script.defer = true;
  script.dataset.bwGamesPreviewRail = 'true';
  script.addEventListener('load', callback, { once: true });
  document.head.appendChild(script);
}

class BwKitkatDoorTestPage extends HTMLElement {
  connectedCallback() {
    // Styles below are scoped to this class, not the host tag name: the live
    // Wix page's Custom Element still carries the tag it was duplicated from
    // (the Editor has no UI to rename an existing element's tag), so tag-name
    // selectors would silently fail to match on that page.
    this.classList.add('kkp-host');
    this._releaseHostHeight();
    this._ensureFont();
    this._render();
    this._bind();
    this._syncWixHostHeight();
  }

  disconnectedCallback() {
    if (this._handleHostResize) window.removeEventListener('resize', this._handleHostResize);
    if (this._syncTimers) this._syncTimers.forEach((id) => window.clearTimeout(id));
    if (this._playNowHandler) {
      const playNow = this.querySelector('#kkp-play-now');
      if (playNow) playNow.removeEventListener('click', this._playNowHandler);
    }
  }

  _ensureFont() {
    if (document.querySelector('link[data-bw-kkp-font]')) return;
    const font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap';
    font.dataset.bwKkpFont = 'true';
    document.head.appendChild(font);
  }

  _render() {
    const iframeUrl = new URL(`kitkat-door-test/index.html?attribution=none&resize=none&v=${ASSET_BUILD}`, BASE_URL);
    this.innerHTML = `
      <style>
        .kkp-host {
          --kkp-black: #0A0002;
          --kkp-panel: #150207;
          --kkp-red: #E4002B;
          --kkp-neon: #FF2ECC;
          --kkp-neon-dim: rgba(255, 46, 204, 0.22);
          --kkp-white: #F5EDEF;
          --kkp-gray: #B8A2A8;
          --kkp-yellow: #FFE600;
          display: block;
          font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
          background:
            radial-gradient(1100px 620px at 12% -6%, rgba(228, 0, 43, 0.22), transparent 58%),
            radial-gradient(1000px 720px at 104% 34%, rgba(255, 46, 204, 0.20), transparent 56%),
            radial-gradient(900px 900px at 60% 118%, rgba(255, 46, 204, 0.10), transparent 60%),
            var(--kkp-black);
          color: var(--kkp-white);
          position: relative;
          z-index: 0;
        }

        .kkp-host *,
        .kkp-host *::before,
        .kkp-host *::after {
          box-sizing: border-box;
        }

        .kkp-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(340px, 420px);
          grid-template-areas:
            "content game"
            "features game"
            "cta game"
            "seo seo"
            "more more";
          gap: 40px 60px;
          max-width: 1180px;
          margin: 0 auto;
          align-items: center;
          padding: clamp(40px, 6svh, 56px) 20px 20px;
          position: relative;
          z-index: 1;
        }

        .kkp-content { grid-area: content; min-width: 0; }
        .kkp-features { grid-area: features; min-width: 0; }

        .kkp-eyebrow {
          color: var(--kkp-red);
          box-shadow: 0 0 20px rgba(228, 0, 43, 0.35), inset 0 0 12px rgba(228, 0, 43, 0.12);
          text-shadow: 0 0 10px rgba(228, 0, 43, 0.5);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 20px;
          display: inline-block;
          border: 1px solid var(--kkp-red);
          padding: 6px 12px;
          border-radius: 4px;
        }

        .kkp-content h1 {
          font-size: clamp(38px, 5.5vw, 72px);
          font-weight: 900;
          line-height: 0.98;
          margin: 0 0 20px 0;
          text-transform: uppercase;
          letter-spacing: -1px;
          background: linear-gradient(180deg, #FFFFFF 0%, #F5EDEF 42%, #C9B7BD 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .kkp-content h1 span {
          color: var(--kkp-neon);
          -webkit-text-fill-color: var(--kkp-neon);
          display: block;
          text-shadow: 0 0 26px rgba(255, 46, 204, 0.6), 0 0 6px rgba(255, 46, 204, 0.45);
        }

        .kkp-content p {
          color: var(--kkp-gray);
          font-size: clamp(16px, 1.4vw, 18px);
          line-height: 1.6;
          margin: 0 0 32px 0;
          max-width: 480px;
        }

        .kkp-play-now {
          display: none;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--kkp-red);
          border-radius: 6px;
          background: var(--kkp-red);
          color: var(--kkp-white);
          cursor: pointer;
          font: inherit;
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 0.8px;
          padding: 13px 20px;
          text-transform: uppercase;
          min-height: 44px;
        }

        .kkp-play-now:hover { background: #FF1440; }

        .kkp-play-now:focus-visible,
        .kkp-tour-cta a:focus-visible,
        .kkp-games-preview a:focus-visible,
        .kkp-links a:focus-visible {
          outline: 3px solid var(--kkp-yellow);
          outline-offset: 3px;
        }

        .kkp-feature-list {
          list-style: none;
          padding: 0;
          margin: 0 0 32px 0;
        }

        .kkp-feature-list li {
          font-size: 15px;
          color: var(--kkp-white);
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .kkp-feature-list li::before {
          content: "\\25CF";
          color: var(--kkp-neon);
          font-size: 11px;
        }

        .kkp-tour-cta {
          grid-area: cta;
          min-width: 0;
          background: var(--kkp-panel);
          padding: 22px;
          border-radius: 14px;
          border-left: 4px solid var(--kkp-neon);
          align-self: start;
        }

        .kkp-tour-cta h3 { margin: 0 0 8px 0; font-size: 17px; }
        .kkp-tour-cta p { font-size: 14px; margin: 0 0 14px 0; max-width: none; }

        .kkp-tour-cta a {
          color: var(--kkp-black);
          background: var(--kkp-yellow);
          text-decoration: none;
          padding: 12px 18px;
          border-radius: 6px;
          font-weight: 800;
          font-size: 14px;
          text-transform: uppercase;
          display: inline-block;
        }

        .kkp-tour-cta a:hover { background: #FFF066; }

        .kkp-device {
          grid-area: game;
          min-width: 0;
          position: relative;
          display: flex;
          flex-direction: column;
          width: min(100%, 420px);
          max-width: 420px;
          height: clamp(640px, calc(100svh - 100px), 760px);
          margin: 0 auto;
          background: var(--kkp-panel);
          border-radius: 32px;
          box-shadow: 0 0 0 8px #1D0510, 0 30px 80px rgba(0,0,0,0.7), 0 0 70px var(--kkp-neon-dim);
          overflow: hidden;
          isolation: isolate;
          animation: kkp-bezel 3.4s ease-in-out infinite;
        }

        @keyframes kkp-bezel {
          0%, 100% { box-shadow: 0 0 0 8px #1D0510, 0 30px 80px rgba(0,0,0,0.7), 0 0 70px var(--kkp-neon-dim); }
          50% { box-shadow: 0 0 0 8px #1D0510, 0 30px 80px rgba(0,0,0,0.7), 0 0 120px rgba(255, 46, 204, 0.42); }
        }

        .kkp-device-bar {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          gap: 9px;
          height: 34px;
          padding: 0 16px;
          background: #120206;
          border-bottom: 1px solid rgba(255, 46, 204, 0.28);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--kkp-gray);
        }

        .kkp-device-bar::before {
          content: "";
          flex: 0 0 auto;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--kkp-red);
          box-shadow: 0 0 8px var(--kkp-red);
          animation: kkp-livedot 1.8s ease-in-out infinite;
        }

        @keyframes kkp-livedot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }

        @media (prefers-reduced-motion: reduce) {
          .kkp-device { animation: none; }
          .kkp-device-bar::before { animation: none; }
        }

        .kkp-device iframe {
          flex: 1 1 auto;
          width: 100%;
          min-height: 0;
          border: none;
          display: block;
        }

        .kkp-seo-support {
          grid-area: seo;
          min-width: 0;
          grid-template-columns: minmax(0, 1fr);
          border-top: 1px solid rgba(255, 46, 204, 0.25);
          padding: 36px clamp(0px, 2vw, 12px) 10px;
          display: grid;
          gap: 34px;
        }

        .kkp-seo-support h2 {
          color: var(--kkp-neon);
          font-size: clamp(22px, 2.6vw, 30px);
          line-height: 1.1;
          margin: 0 0 14px;
          text-transform: uppercase;
        }

        .kkp-seo-support p {
          color: #D8CDD1;
          font-size: 15px;
          line-height: 1.65;
          margin: 0 0 12px;
          max-width: 820px;
        }

        .kkp-disclosure {
          background: var(--kkp-panel);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 10px;
          padding: 16px 18px;
          font-size: 13px;
          line-height: 1.6;
          color: var(--kkp-gray);
          max-width: 820px;
        }

        .kkp-dress-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .kkp-dress-col h3 {
          font-size: 15px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0 0 12px;
        }

        .kkp-dress-col.works h3 { color: #7CFFB0; }
        .kkp-dress-col.fails h3 { color: #FF6B7A; }

        .kkp-dress-col ul {
          margin: 0;
          padding-left: 18px;
          color: #D8CDD1;
          font-size: 14px;
          line-height: 1.6;
        }

        .kkp-advice {
          margin-top: 16px;
          font-size: 14px;
          line-height: 1.6;
          color: var(--kkp-white);
          border-left: 3px solid var(--kkp-neon);
          padding-left: 14px;
        }

        .kkp-advice strong { color: var(--kkp-neon); }

        table.kkp-nights-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13.5px;
          margin-top: 4px;
        }

        table.kkp-nights-table th,
        table.kkp-nights-table td {
          text-align: left;
          padding: 10px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          color: #D8CDD1;
        }

        table.kkp-nights-table th {
          color: var(--kkp-white);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .kkp-checked-stamp {
          font-size: 12px;
          color: var(--kkp-gray);
          margin-top: 10px;
        }

        .kkp-practical-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 8px;
          font-size: 14px;
          color: #D8CDD1;
        }

        .kkp-practical-list strong { color: var(--kkp-white); }

        .kkp-faq {
          display: grid;
          gap: 16px;
          margin: 0;
          max-width: 820px;
        }

        .kkp-faq dt {
          color: var(--kkp-white);
          font-size: 15px;
          font-weight: 800;
          margin: 0 0 4px;
        }

        .kkp-faq dd {
          color: #BFC6C1;
          font-size: 14px;
          line-height: 1.6;
          margin: 0;
        }

        /* Sits inside .kkp-seo-support's own grid, not the page grid, so it
           must not claim a page-level grid area. */
        .kkp-links {
          display: flex;
          flex-wrap: wrap;
          gap: 10px 24px;
          padding-top: 4px;
        }

        .kkp-links a {
          color: var(--kkp-neon);
          font-size: 14px;
          text-decoration: underline;
        }

        .kkp-games-preview { grid-area: more; min-width: 0; }

        @media (max-width: 960px) {
          .kkp-layout {
            grid-template-columns: minmax(0, 1fr);
            grid-template-areas:
              "content"
              "features"
              "game"
              "seo"
              "cta"
              "more";
            padding: 40px 18px 20px;
            gap: 32px;
          }

          .kkp-content { text-align: center; }
          .kkp-content p, .kkp-feature-list { margin-left: auto; margin-right: auto; text-align: left; max-width: 420px; }
          .kkp-tour-cta { text-align: left; }

          .kkp-device {
            width: min(100%, 380px);
            /* The outer Wix page owns scrolling. Keep the fixed game surface
               tall enough for narrow-screen wrapping instead of clipping
               choices behind a non-scrollable child iframe. */
            height: clamp(740px, calc(100svh - 40px), 760px);
            border-radius: 22px;
          }

          .kkp-dress-grid { grid-template-columns: 1fr; gap: 20px; }

          table.kkp-nights-table { display: block; overflow-x: auto; }

          .kkp-host[data-entry-variant="mobile_play_now"] .kkp-layout {
            grid-template-areas:
              "content"
              "game"
              "features"
              "seo"
              "cta"
              "more";
          }

          .kkp-host[data-entry-variant="mobile_play_now"] .kkp-play-now {
            display: inline-flex;
            margin: -8px auto 0;
            min-width: min(100%, 220px);
          }
        }
      </style>

      <main class="kkp-layout">

        <div class="kkp-content">
          <div class="kkp-eyebrow">Fictional door test</div>
          <h1>KitKat Club<span>Door Test</span></h1>
          <p>Latex, leather, effort, nerve. Nine honest questions about what is under your coat and how you carry it, then the fictional KitKat door decides if you are getting in tonight.</p>
          <button class="kkp-play-now" id="kkp-play-now" type="button">PLAY NOW</button>
        </div>

        <div class="kkp-features">
          <ul class="kkp-feature-list">
            <li>Pick tonight's party first, the door reads differently each time</li>
            <li>Nine quick outfit, effort and attitude questions</li>
            <li>One honest verdict, one concrete fix, replay any time</li>
          </ul>
        </div>

        <div class="kkp-device" id="kkp-game">
          <div class="kkp-device-bar" aria-hidden="true">The Door · Interactive</div>
          <iframe
            src="${iframeUrl.toString()}"
            allow="clipboard-write"
            scrolling="no"
            title="KitKat Club Door Test">
          </iframe>
        </div>

        <div class="kkp-tour-cta">
          <h3>Survived the door test?</h3>
          <p>My ~2h tip-based walking tour starts at Alexanderplatz and explores the historic centre of former East Berlin.</p>
          <a href="https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based">Book the Walking Tour</a>
        </div>

        <section class="kkp-seo-support" aria-labelledby="kkp-explainer-title">

          <div>
            <h2 id="kkp-explainer-title">What This Page Actually Is</h2>
            <p>I built this because every guest on my tour asks the same nervous question about KitKat. This is a quick, honest door simulation, not the real club and not affiliated with it. Play it, then read what actually works below.</p>
            <p class="kkp-disclosure">This is an independent fan-made game by a Berlin tour guide. I am not affiliated with KitKatClub. KitKat is an adult, sex-positive venue with a strict door and a strict camera policy. This page keeps it practical: what the dress code expects and how the door decides.</p>
          </div>

          <div>
            <h2>The Real KitKat Dress Code</h2>
            <div class="kkp-dress-grid">
              <div class="kkp-dress-col works">
                <h3>What works</h3>
                <ul>
                  <li>Full latex, leather or vinyl looks, considered head to toe</li>
                  <li>Harnesses, corsets, bodysuits and mesh over dark basics</li>
                  <li>Bold, elaborate costume with real thought behind it</li>
                  <li>Drag and expressive fetish styling</li>
                  <li>One strong committed element, worn with confidence</li>
                </ul>
              </div>
              <div class="kkp-dress-col fails">
                <h3>What fails</h3>
                <ul>
                  <li>Jeans and a plain going-out top</li>
                  <li>Clean sneakers or trainers from a full day of sightseeing</li>
                  <li>"I just wanted to see what it's like" energy</li>
                  <li>Half-measures: one fetish item over an ordinary outfit</li>
                  <li>Loud groups, phones out, tourist energy in the queue</li>
                </ul>
              </div>
            </div>
            <p class="kkp-advice"><strong>My advice:</strong> pick one strong element, latex, leather, or a real costume, and commit to it. Half-measures in street shoes are the fastest no in Berlin.</p>
          </div>

          <div>
            <h2>Party Nights and Door Strictness</h2>
            <table class="kkp-nights-table">
              <thead><tr><th>Night</th><th>Party</th><th>Door strictness</th></tr></thead>
              <tbody>
                <tr><td>Saturday</td><td>CarneBall Bizarre</td><td>Strictest, full fetish/latex expected</td></tr>
                <tr><td>Sunday</td><td>Nachspiel, from roughly 7-8am</td><td>Afterparty, same crowd as Saturday</td></tr>
                <tr><td>Monday</td><td>Electric Monday</td><td>Moderate</td></tr>
                <tr><td>Wednesday</td><td>Symbiotikka</td><td>Moderate</td></tr>
                <tr><td>Thursday</td><td>Unity</td><td>Moderate, queer-leaning</td></tr>
                <tr><td>Friday</td><td>Rotates: Four Play, GEGEN, Psycho, Mystic Rose, PIEPSHOW</td><td>Varies by event</td></tr>
              </tbody>
            </table>
            <p class="kkp-checked-stamp">Checked on 25 August 2026. Nights and names change; check kitkatclub.org for the current program before you go.</p>
          </div>

          <div>
            <h2>Practical Details</h2>
            <ul class="kkp-practical-list">
              <li><strong>Address:</strong> Köpenicker Str. 76, 10179 Berlin</li>
              <li><strong>Nearest station:</strong> U Heinrich-Heine-Straße (U8), about a minute's walk</li>
              <li><strong>Entry fee:</strong> roughly €15-25 depending on the night, cash only</li>
              <li><strong>Age:</strong> adults only, standard German club door policy, bring ID</li>
              <li><strong>Camera policy:</strong> phones and cameras are not allowed inside. Expect a sticker or tape over your camera at the door, and expect to leave it in your bag or the cloakroom for the night</li>
            </ul>
            <p class="kkp-checked-stamp">Checked on 25 August 2026.</p>
          </div>

          <div>
            <h2>Frequently Asked Questions</h2>
            <dl class="kkp-faq" aria-label="KitKat door test questions">
              <div>
                <dt>What do men wear to KitKat Berlin?</dt>
                <dd>Leather, latex, harnesses over a bare or fitted torso, or a full fetish costume. Plain jeans and a t-shirt is the fastest way to get turned away.</dd>
              </div>
              <div>
                <dt>What do women wear to KitKat Berlin?</dt>
                <dd>Latex, leather, lingerie, mesh, corsetry or bold costume. The common thread is commitment, not a specific item.</dd>
              </div>
              <div>
                <dt>Are sneakers OK at KitKat?</dt>
                <dd>Clean sneakers alone usually read as unfinished. Pair them with a real outfit built around them, or switch to boots or heels that match the look.</dd>
              </div>
              <div>
                <dt>Can I bring my phone into KitKat?</dt>
                <dd>You can bring it in your bag, but you cannot use it. Expect a sticker over the camera at the door and expect to leave it away for the night.</dd>
              </div>
              <div>
                <dt>How strict is the KitKat door compared to Berghain?</dt>
                <dd>Different test. Berghain reads the room and the crowd mix. KitKat reads your outfit and your effort specifically, especially on Saturday's CarneBall Bizarre.</dd>
              </div>
              <div>
                <dt>Is there an entry fee at KitKat?</dt>
                <dd>Yes, roughly €15-25 depending on the night, cash only at the door.</dd>
              </div>
              <div>
                <dt>What if I get turned away at KitKat?</dt>
                <dd>It happens to plenty of people. Change one thing, commit harder to it, and try a different, less strict night first if you're new to this.</dd>
              </div>
              <div>
                <dt>Does KitKat have a strict dress code every night?</dt>
                <dd>The core expectation holds most nights, but strictness shifts by event. Saturday's CarneBall Bizarre is the strictest test in the city.</dd>
              </div>
            </dl>
          </div>

          <nav class="kkp-links" aria-label="Related pages">
            <a href="https://www.berlinwalk.com/games">All BerlinWalk games</a>
            <a href="https://www.berlinwalk.com/post/what-to-wear-to-berlin-clubs">Full Berlin club dress-code guide</a>
          </nav>

        </section>

        <section class="kkp-games-preview" data-bw-games-preview aria-label="More BerlinWalk games"></section>

      </main>
    `;
  }

  _bind() {
    this._handleHostResize = () => this._syncWixHostHeight();
    window.addEventListener('resize', this._handleHostResize, { passive: true });
    const playNow = this.querySelector('#kkp-play-now');
    if (playNow) {
      this._playNowHandler = () => {
        const device = this.querySelector('.kkp-device');
        if (!device) return;
        const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        device.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      };
      playNow.addEventListener('click', this._playNowHandler);
    }
    this._renderGamesPreview();
    // Wix re-pins the host height on its own reflows (fonts, late sections,
    // breakpoint settle), so re-assert past each of those rather than once.
    this._syncTimers = [100, 800, 2500].map((delay) =>
      window.setTimeout(() => this._syncWixHostHeight(), delay));
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => this._syncWixHostHeight());
    }
  }

  _renderGamesPreview() {
    const target = this.querySelector('[data-bw-games-preview]');
    if (!target) return;
    loadGamesPreviewRail(() => {
      if (!window.BerlinWalkGamesPreviewRail) return;
      window.BerlinWalkGamesPreviewRail.render(target, {
        current: 'kitkat-door-test',
        source: 'kitkat_door_test_page',
        theme: 'night',
      });
      this._syncWixHostHeight();
    });
  }

  // Wix sizes a Custom Element from the box it had in the Editor and writes
  // that as an inline pixel height on the host. This page is far taller than
  // any Editor box, so that height has to be released before anything is
  // measured: otherwise the layout reports the clipped height, every ancestor
  // gets sized to it, and the real content spills out over the rest of the page.
  _releaseHostHeight() {
    this.style.setProperty('height', 'auto', 'important');
    this.style.setProperty('min-height', '0', 'important');
    // Wix also stamps that same pinned height onto the element's first child,
    // which is this component's own layout root. Left in place it clamps the
    // grid to the Editor box no matter what the host is allowed to do, so the
    // layout has to be handed back to its content too before measuring.
    const layout = this.querySelector('.kkp-layout');
    if (layout) {
      layout.style.removeProperty('height');
      layout.style.removeProperty('min-height');
    }
  }

  _syncWixHostHeight() {
    this._releaseHostHeight();
    const wixShell = this.parentElement;
    if (!wixShell || !wixShell.id || !wixShell.id.startsWith('comp-')) return;
    const layout = this.querySelector('.kkp-layout');
    if (!layout) return;
    // Measured with the host already unpinned, so this is true content height
    // and does not depend on whatever height the ancestors currently carry.
    // That independence is what keeps the sync from feeding back into itself.
    const height = Math.ceil(layout.getBoundingClientRect().height);
    if (!height) return;
    const targets = [wixShell, wixShell.parentElement, this.closest('section')].filter(Boolean);
    targets.forEach((target) => {
      target.style.setProperty('height', `${height}px`, 'important');
      target.style.setProperty('min-height', `${height}px`, 'important');
    });
  }
}

if (!customElements.get('bw-kitkat-door-test-page')) {
  customElements.define('bw-kitkat-door-test-page', BwKitkatDoorTestPage);
}

// The live Wix page for this game was duplicated from berghain-bouncer's page
// and the Editor UI has no way to rename an existing Custom Element's tag, so
// the DOM still carries the old tag. The Custom Elements spec forbids reusing
// one constructor under two tag names, so register a trivial subclass there.
class BwKitkatDoorTestPageLegacyTag extends BwKitkatDoorTestPage {}
if (!customElements.get('bw-berlin-bouncer-page')) {
  customElements.define('bw-berlin-bouncer-page', BwKitkatDoorTestPageLegacyTag);
}
