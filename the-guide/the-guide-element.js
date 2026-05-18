const BW_GUIDE_BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
const BW_GUIDE_REVIEWS_URL = 'https://www.berlinwalk.com/reviews';
const BW_GUIDE_MEETING_POINT_URL = 'https://www.berlinwalk.com/meeting-point';
const BW_GUIDE_PROFILE_IMAGE_URL = 'https://static.wixstatic.com/media/5a08a3_ac78d5df37b2486ab6662cf3872ea9a6~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg';
const BW_GUIDE_GROUP_IMAGE_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/gallery/images/05-1200w.webp';
const BW_GUIDE_WORLD_CLOCK_IMAGE_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/gallery/images/06-1200w.webp';

class BWTheGuideElement extends HTMLElement {
  connectedCallback() {
    this._render();
  }

  _render() {
    this.innerHTML = `
      <style>
        bw-the-guide {
          display: block;
          width: 100%;
        }

        .bw-guide {
          --green: #1B5E20;
          --green-dark: #102414;
          --yellow: #FFE600;
          --lime: #7CB342;
          --light-green: #C5E1A5;
          --cream: #FAFAF5;
          --text: #212121;
          --muted: #4E5A4E;
          --serif: Merriweather, Georgia, serif;
          background: var(--cream);
          color: var(--text);
          font-family: Montserrat, Arial, sans-serif;
          margin: 0;
          max-width: 100%;
          overflow-x: hidden;
        }

        .bw-guide *,
        .bw-guide *::before,
        .bw-guide *::after {
          box-sizing: border-box;
        }

        .bw-guide h1,
        .bw-guide h2,
        .bw-guide h3,
        .bw-guide p,
        .bw-guide figure {
          margin-top: 0;
        }

        .bw-guide a {
          color: inherit;
        }

        .bw-guide .bw-guide-inner {
          margin: 0 auto;
          max-width: 1160px;
          width: 100%;
        }

        .bw-guide .bw-guide-hero {
          background:
            linear-gradient(90deg, rgba(255, 230, 0, 0.16) 0 1px, transparent 1px 84px),
            linear-gradient(180deg, #FFFFFF, #F5F8EF);
          border-top: 6px solid var(--green);
          padding: 58px 24px 54px;
        }

        .bw-guide .bw-guide-hero-grid {
          align-items: start;
          display: grid;
          gap: 42px;
          grid-template-columns: minmax(0, 1fr) minmax(320px, 0.78fr);
        }

        .bw-guide .bw-guide-kicker {
          color: var(--green);
          display: inline-flex;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.6px;
          line-height: 1.35;
          margin-bottom: 18px;
          text-transform: uppercase;
        }

        .bw-guide h1 {
          color: var(--green);
          font-size: 54px;
          font-weight: 800;
          letter-spacing: 0;
          line-height: 1.02;
          margin-bottom: 18px;
          max-width: 720px;
        }

        .bw-guide .bw-guide-highlight {
          background: var(--yellow);
          box-decoration-break: clone;
          color: var(--green);
          padding: 0 8px 4px;
          -webkit-box-decoration-break: clone;
        }

        .bw-guide .bw-guide-lead {
          color: var(--muted);
          font-family: var(--serif);
          font-size: 18px;
          line-height: 1.68;
          margin-bottom: 26px;
          max-width: 700px;
        }

        .bw-guide .bw-guide-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .bw-guide .bw-guide-btn {
          align-items: center;
          border-radius: 999px;
          display: inline-flex;
          font-size: 13px;
          font-weight: 800;
          justify-content: center;
          letter-spacing: 0.6px;
          min-height: 48px;
          padding: 14px 22px;
          text-decoration: none;
          text-transform: uppercase;
          transition: background 160ms ease, color 160ms ease, transform 160ms ease;
        }

        .bw-guide .bw-guide-btn-primary {
          background: var(--green);
          color: #FFFFFF;
        }

        .bw-guide .bw-guide-btn-primary:hover,
        .bw-guide .bw-guide-btn-primary:focus-visible {
          background: #124516;
          transform: translateY(-1px);
        }

        .bw-guide .bw-guide-btn-secondary {
          background: var(--yellow);
          color: var(--green);
        }

        .bw-guide .bw-guide-btn-secondary:hover,
        .bw-guide .bw-guide-btn-secondary:focus-visible {
          background: #fff04a;
          transform: translateY(-1px);
        }

        .bw-guide .bw-guide-btn-ghost {
          border: 2px solid var(--green);
          color: var(--green);
        }

        .bw-guide .bw-guide-btn-ghost:hover,
        .bw-guide .bw-guide-btn-ghost:focus-visible {
          background: var(--green);
          color: #FFFFFF;
          transform: translateY(-1px);
        }

        .bw-guide .bw-guide-btn:focus-visible,
        .bw-guide a:focus-visible {
          outline: 3px solid rgba(255, 230, 0, 0.9);
          outline-offset: 3px;
        }

        .bw-guide .bw-guide-profile {
          background: #FFFFFF;
          border-radius: 8px;
          box-shadow: 0 18px 44px rgba(27, 94, 32, 0.16);
          overflow: hidden;
        }

        .bw-guide .bw-guide-profile-img {
          aspect-ratio: 3 / 4;
          display: block;
          object-fit: cover;
          object-position: center top;
          width: 100%;
        }

        .bw-guide .bw-guide-profile-copy {
          padding: 22px 24px 24px;
        }

        .bw-guide .bw-guide-profile-copy h2 {
          color: var(--green);
          font-size: 27px;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 8px;
        }

        .bw-guide .bw-guide-profile-copy p {
          color: var(--muted);
          font-family: var(--serif);
          font-size: 15px;
          line-height: 1.58;
          margin-bottom: 0;
        }

        .bw-guide .bw-guide-stat-row {
          border-top: 1px solid var(--light-green);
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .bw-guide .bw-guide-stat {
          padding: 16px 12px;
          text-align: center;
        }

        .bw-guide .bw-guide-stat strong {
          color: var(--green);
          display: block;
          font-size: 20px;
          font-weight: 800;
          line-height: 1.15;
        }

        .bw-guide .bw-guide-stat span {
          color: var(--muted);
          display: block;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.8px;
          margin-top: 4px;
          text-transform: uppercase;
        }

        .bw-guide .bw-guide-section {
          padding: 58px 24px;
        }

        .bw-guide .bw-guide-section-white {
          background: #FFFFFF;
        }

        .bw-guide .bw-guide-section-dark {
          background: var(--green-dark);
          color: #FFFFFF;
        }

        .bw-guide .bw-guide-section-head {
          margin-bottom: 28px;
          max-width: 760px;
        }

        .bw-guide .bw-guide-section-head h2 {
          color: var(--green);
          font-size: 34px;
          font-weight: 800;
          letter-spacing: 0;
          line-height: 1.15;
          margin-bottom: 10px;
        }

        .bw-guide .bw-guide-section-dark .bw-guide-section-head h2 {
          color: #FFFFFF;
        }

        .bw-guide .bw-guide-section-head p {
          color: var(--muted);
          font-family: var(--serif);
          font-size: 16px;
          line-height: 1.65;
          margin-bottom: 0;
        }

        .bw-guide .bw-guide-section-dark .bw-guide-section-head p {
          color: rgba(250, 250, 245, 0.8);
        }

        .bw-guide .bw-guide-belief-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .bw-guide .bw-guide-belief {
          background: #FFFFFF;
          border: 1px solid var(--light-green);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          min-height: 220px;
          overflow: hidden;
        }

        .bw-guide .bw-guide-belief::before {
          background: var(--yellow);
          content: "";
          display: block;
          height: 5px;
          width: 100%;
        }

        .bw-guide .bw-guide-belief-body {
          padding: 22px 20px 24px;
        }

        .bw-guide .bw-guide-belief h3 {
          color: var(--green);
          font-size: 18px;
          font-weight: 800;
          line-height: 1.25;
          margin-bottom: 10px;
        }

        .bw-guide .bw-guide-belief p {
          color: var(--muted);
          font-size: 14px;
          line-height: 1.58;
          margin-bottom: 0;
        }

        .bw-guide .bw-guide-story-grid {
          align-items: center;
          display: grid;
          gap: 38px;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
        }

        .bw-guide .bw-guide-photo-stack {
          display: grid;
          gap: 14px;
          grid-template-columns: 0.85fr 1fr;
        }

        .bw-guide .bw-guide-photo {
          border-radius: 8px;
          box-shadow: 0 16px 34px rgba(0, 0, 0, 0.16);
          overflow: hidden;
          position: relative;
        }

        .bw-guide .bw-guide-photo:first-child {
          margin-top: 52px;
        }

        .bw-guide .bw-guide-photo img {
          display: block;
          height: 100%;
          object-fit: cover;
          width: 100%;
        }

        .bw-guide .bw-guide-photo-large {
          aspect-ratio: 5 / 8;
        }

        .bw-guide .bw-guide-photo-small {
          aspect-ratio: 16 / 11;
        }

        .bw-guide .bw-guide-caption {
          background: rgba(16, 36, 20, 0.88);
          bottom: 12px;
          color: #FFFFFF;
          font-size: 11px;
          font-weight: 800;
          left: 12px;
          letter-spacing: 0.8px;
          padding: 7px 9px;
          position: absolute;
          text-transform: uppercase;
        }

        .bw-guide .bw-guide-story-copy h2 {
          color: var(--green);
          font-size: 34px;
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 16px;
        }

        .bw-guide .bw-guide-story-copy p {
          color: var(--muted);
          font-family: var(--serif);
          font-size: 16px;
          line-height: 1.72;
          margin-bottom: 16px;
        }

        .bw-guide .bw-guide-story-copy p:last-child {
          margin-bottom: 0;
        }

        .bw-guide .bw-guide-quote-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .bw-guide .bw-guide-quote {
          border: 1px solid rgba(197, 225, 165, 0.28);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          min-height: 230px;
          padding: 24px;
        }

        .bw-guide .bw-guide-quote p {
          color: rgba(250, 250, 245, 0.88);
          font-family: var(--serif);
          font-size: 15px;
          line-height: 1.66;
          margin-bottom: 18px;
        }

        .bw-guide .bw-guide-quote footer {
          color: var(--yellow);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1px;
          margin-top: auto;
          text-transform: uppercase;
        }

        .bw-guide .bw-guide-route {
          background: var(--green);
          border-radius: 8px;
          color: #FFFFFF;
          display: grid;
          gap: 22px;
          grid-template-columns: minmax(0, 1fr) auto;
          margin-top: 30px;
          padding: 24px;
        }

        .bw-guide .bw-guide-route h3 {
          color: var(--yellow);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 1.2px;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .bw-guide .bw-guide-route p {
          color: rgba(255, 255, 255, 0.86);
          font-family: var(--serif);
          font-size: 15px;
          line-height: 1.62;
          margin-bottom: 0;
          max-width: 740px;
        }

        .bw-guide .bw-guide-route-line {
          align-items: center;
          display: grid;
          gap: 10px;
          grid-template-columns: auto minmax(88px, 1fr) auto minmax(88px, 1fr) auto;
          min-width: 330px;
        }

        .bw-guide .bw-guide-route-dot {
          background: var(--yellow);
          border: 3px solid rgba(255, 255, 255, 0.2);
          border-radius: 999px;
          height: 18px;
          width: 18px;
        }

        .bw-guide .bw-guide-route-track {
          background: repeating-linear-gradient(90deg, var(--yellow) 0 12px, transparent 12px 20px);
          height: 3px;
        }

        .bw-guide .bw-guide-final {
          background:
            linear-gradient(90deg, rgba(255, 230, 0, 0.16) 0 1px, transparent 1px 84px),
            var(--cream);
          padding: 58px 24px 64px;
          text-align: center;
        }

        .bw-guide .bw-guide-final h2 {
          color: var(--green);
          font-size: 36px;
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 12px;
        }

        .bw-guide .bw-guide-final p {
          color: var(--muted);
          font-family: var(--serif);
          font-size: 16px;
          line-height: 1.65;
          margin: 0 auto 24px;
          max-width: 680px;
        }

        .bw-guide .bw-guide-final-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
        }

        @media (max-width: 980px) {
          .bw-guide .bw-guide-hero-grid,
          .bw-guide .bw-guide-story-grid {
            grid-template-columns: 1fr;
          }

          .bw-guide .bw-guide-profile {
            max-width: 520px;
          }

          .bw-guide .bw-guide-belief-grid,
          .bw-guide .bw-guide-quote-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .bw-guide .bw-guide-route {
            grid-template-columns: 1fr;
          }

          .bw-guide .bw-guide-route-line {
            min-width: 0;
          }
        }

        @media (max-width: 620px) {
          .bw-guide .bw-guide-hero,
          .bw-guide .bw-guide-section,
          .bw-guide .bw-guide-final {
            padding-left: 18px;
            padding-right: 18px;
          }

          .bw-guide .bw-guide-hero {
            padding-top: 44px;
          }

          .bw-guide h1 {
            font-size: 40px;
          }

          .bw-guide .bw-guide-lead {
            font-size: 16px;
          }

          .bw-guide .bw-guide-actions,
          .bw-guide .bw-guide-final-actions {
            align-items: stretch;
            flex-direction: column;
          }

          .bw-guide .bw-guide-btn {
            width: 100%;
          }

          .bw-guide .bw-guide-stat-row,
          .bw-guide .bw-guide-belief-grid,
          .bw-guide .bw-guide-quote-grid,
          .bw-guide .bw-guide-photo-stack {
            grid-template-columns: 1fr;
          }

          .bw-guide .bw-guide-photo:first-child {
            margin-top: 0;
          }

          .bw-guide .bw-guide-section-head h2,
          .bw-guide .bw-guide-story-copy h2,
          .bw-guide .bw-guide-final h2 {
            font-size: 28px;
          }

          .bw-guide .bw-guide-route-line {
            grid-template-columns: auto minmax(40px, 1fr) auto minmax(40px, 1fr) auto;
          }
        }
      </style>

      <main class="bw-guide">
        <section class="bw-guide-hero" aria-labelledby="bw-guide-title">
          <div class="bw-guide-inner bw-guide-hero-grid">
            <div>
              <span class="bw-guide-kicker">The Guide</span>
              <h1 id="bw-guide-title">Meet <span class="bw-guide-highlight">Yusuf</span>, your Berlin guide</h1>
              <p class="bw-guide-lead">I do not want Berlin to feel like a checklist. I want it to click: where the city began, why it kept changing, and how the layers of medieval, Prussian, imperial, Nazi, divided, and modern Berlin still sit on top of each other.</p>
              <div class="bw-guide-actions">
                <a class="bw-guide-btn bw-guide-btn-primary" href="${BW_GUIDE_BOOKING_URL}">Book your spot</a>
                <a class="bw-guide-btn bw-guide-btn-secondary" href="${BW_GUIDE_REVIEWS_URL}">Read reviews</a>
                <a class="bw-guide-btn bw-guide-btn-ghost" href="${BW_GUIDE_MEETING_POINT_URL}">Meeting point</a>
              </div>
            </div>

            <aside class="bw-guide-profile" aria-label="Yusuf profile">
              <img class="bw-guide-profile-img" src="${BW_GUIDE_PROFILE_IMAGE_URL}" alt="Yusuf Ucuz, BerlinWalk guide" loading="eager" decoding="async">
              <div class="bw-guide-profile-copy">
                <h2>Yusuf Ucuz</h2>
                <p>Local guide behind BerlinWalk. I build routes for curious visitors who want clear context, good stories, and a human sense of the city.</p>
              </div>
              <div class="bw-guide-stat-row" aria-label="Guide highlights">
                <div class="bw-guide-stat"><strong>5.0</strong><span>Rating</span></div>
                <div class="bw-guide-stat"><strong>12</strong><span>Stops</span></div>
                <div class="bw-guide-stat"><strong>~2h</strong><span>Walk</span></div>
              </div>
            </aside>
          </div>
        </section>

        <section class="bw-guide-section bw-guide-section-white" aria-labelledby="bw-guide-approach-title">
          <div class="bw-guide-inner">
            <header class="bw-guide-section-head">
              <h2 id="bw-guide-approach-title">A walking tour should make the city easier to read.</h2>
              <p>The route is built around clarity: fewer random facts, more connections. You should leave with a mental map of Berlin, not just a camera roll.</p>
            </header>

            <div class="bw-guide-belief-grid">
              ${this._renderBelief('Context before trivia', 'Dates matter, but only when they help you understand why a place changed and why it still feels the way it does.')}
              ${this._renderBelief('Stories with structure', "The walk moves from Alexanderplatz into Berlin's older core, so the city unfolds in a sequence instead of a blur.")}
              ${this._renderBelief('Old images, real places', 'Historic photos and maps help you compare what stood here before with what you are looking at now.')}
              ${this._renderBelief('Questions welcome', 'The best moments often come from what guests notice. Curiosity is part of the route, not an interruption.')}
            </div>
          </div>
        </section>

        <section class="bw-guide-section" aria-labelledby="bw-guide-story-title">
          <div class="bw-guide-inner bw-guide-story-grid">
            <div class="bw-guide-photo-stack" aria-label="BerlinWalk tour moments">
              <figure class="bw-guide-photo bw-guide-photo-large">
                <img src="${BW_GUIDE_GROUP_IMAGE_URL}" alt="Yusuf with BerlinWalk guests during a walking tour" loading="eager" decoding="async">
                <figcaption class="bw-guide-caption">On the route</figcaption>
              </figure>
              <figure class="bw-guide-photo bw-guide-photo-small">
                <img src="${BW_GUIDE_WORLD_CLOCK_IMAGE_URL}" alt="World Clock at Alexanderplatz, the BerlinWalk meeting point" loading="eager" decoding="async">
                <figcaption class="bw-guide-caption">Starting point</figcaption>
              </figure>
            </div>

            <div class="bw-guide-story-copy">
              <h2 id="bw-guide-story-title">Berlin is not one story. It is a stack of unfinished ones.</h2>
              <p>That is what makes guiding here interesting. One square can carry a medieval market, a royal ambition, a vanished neighborhood, a socialist redesign, and a modern tourist mistake at the same time.</p>
              <p>My job is to slow the city down enough that you can see those layers. The tour is relaxed, but it is not shallow. It is built for first-time visitors, history lovers, solo travellers, and anyone who has looked at Berlin and thought: I know this is important, but I need someone to connect it.</p>
              <p>The walk starts at the World Clock on Alexanderplatz and ends near Hackescher Markt, through the part of Berlin where the city began and kept reinventing itself.</p>
            </div>
          </div>

          <div class="bw-guide-inner">
            <aside class="bw-guide-route" aria-label="BerlinWalk route summary">
              <div>
                <h3>Route logic</h3>
                <p>Alexanderplatz to Hackescher Markt, about 2 hours. A compact walk through Berlin's old centre, Museum Island, hidden medieval corners, Prussian power, East Berlin traces, and the stories most visitors miss.</p>
              </div>
              <div class="bw-guide-route-line" aria-hidden="true">
                <span class="bw-guide-route-dot"></span>
                <span class="bw-guide-route-track"></span>
                <span class="bw-guide-route-dot"></span>
                <span class="bw-guide-route-track"></span>
                <span class="bw-guide-route-dot"></span>
              </div>
            </aside>
          </div>
        </section>

        <section class="bw-guide-section bw-guide-section-dark" aria-labelledby="bw-guide-reviews-title">
          <div class="bw-guide-inner">
            <header class="bw-guide-section-head">
              <h2 id="bw-guide-reviews-title">What guests remember</h2>
              <p>The best reviews are not just about facts. They are about feeling oriented, surprised, and looked after.</p>
            </header>

            <div class="bw-guide-quote-grid">
              ${this._renderQuote('Yusuf the tour guide was extraordinary. You must take his tour for a thoughtful, funny and well-timed experience.', 'Samyukta V., India')}
              ${this._renderQuote('This one felt completely different. It is more about the real origins of Berlin, where the city actually started and how much of it disappeared.', 'Michal D., Poland')}
              ${this._renderQuote('Every stop felt relevant and engaging. Yusuf managed to navigate through centuries of history.', 'Karen Sells Brown, USA')}
            </div>
          </div>
        </section>

        <section class="bw-guide-final" aria-label="Book BerlinWalk">
          <div class="bw-guide-inner">
            <h2>Walk Berlin with the person who built the route.</h2>
            <p>Book your free spot, meet at the World Clock, and spend about 2 hours seeing Berlin's historic centre with context.</p>
            <div class="bw-guide-final-actions">
              <a class="bw-guide-btn bw-guide-btn-primary" href="${BW_GUIDE_BOOKING_URL}">Book your spot</a>
              <a class="bw-guide-btn bw-guide-btn-ghost" href="${BW_GUIDE_REVIEWS_URL}">Read more reviews</a>
            </div>
          </div>
        </section>
      </main>
    `;
  }

  _renderBelief(title, text) {
    return `
      <article class="bw-guide-belief">
        <div class="bw-guide-belief-body">
          <h3>${this._escapeHtml(title)}</h3>
          <p>${this._escapeHtml(text)}</p>
        </div>
      </article>
    `;
  }

  _renderQuote(text, author) {
    return `
      <blockquote class="bw-guide-quote">
        <p>${this._escapeHtml(text)}</p>
        <footer>${this._escapeHtml(author)}</footer>
      </blockquote>
    `;
  }

  _escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

if (!customElements.get('bw-the-guide')) {
  customElements.define('bw-the-guide', BWTheGuideElement);
}
