const BW_BOOK_ANCHOR_ID = 'book';
const BW_BOOK_MEETING_POINT_URL = 'https://www.berlinwalk.com/meeting-point';
const BW_BOOK_THE_GUIDE_URL = 'https://www.berlinwalk.com/the-guide';
const BW_BOOK_REVIEWS_URL = 'https://www.berlinwalk.com/reviews';
const BW_BOOK_WORLD_CLOCK_IMAGE_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/gallery/images/06-1200w.webp';
const BW_BOOK_WORLD_CLOCK_IMAGE_FALLBACK_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/gallery/images/06-1200w.jpg';

const BW_BOOK_SHARED_STYLES = `
  .bw-book {
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

  .bw-book *,
  .bw-book *::before,
  .bw-book *::after {
    box-sizing: border-box;
  }

  .bw-book h1,
  .bw-book h2,
  .bw-book h3,
  .bw-book p,
  .bw-book ol,
  .bw-book ul,
  .bw-book figure {
    margin-top: 0;
  }

  .bw-book a {
    color: inherit;
  }

  .bw-book .bw-book-inner {
    margin-left: auto !important;
    margin-right: auto !important;
    max-width: 1120px !important;
    padding: 0 24px;
    width: 100%;
  }

  .bw-book .bw-book-eyebrow {
    color: var(--green);
    display: inline-flex;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 1.6px;
    line-height: 1.35;
    margin-bottom: 16px;
    text-transform: uppercase;
  }

  .bw-book .bw-book-highlight {
    background: var(--yellow);
    box-decoration-break: clone;
    color: var(--green);
    padding: 0 8px 4px;
    -webkit-box-decoration-break: clone;
  }

  .bw-book .bw-book-btn {
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

  .bw-book .bw-book-btn-primary {
    background: var(--green);
    color: #FFFFFF;
  }

  .bw-book .bw-book-btn-primary:hover,
  .bw-book .bw-book-btn-primary:focus-visible {
    background: #124516;
    transform: translateY(-1px);
  }

  .bw-book .bw-book-btn-yellow {
    background: var(--yellow);
    color: var(--green);
  }

  .bw-book .bw-book-btn-yellow:hover,
  .bw-book .bw-book-btn-yellow:focus-visible {
    background: #fff04a;
    transform: translateY(-1px);
  }

  .bw-book .bw-book-btn-ghost {
    border: 2px solid var(--green);
    color: var(--green);
  }

  .bw-book .bw-book-btn-ghost:hover,
  .bw-book .bw-book-btn-ghost:focus-visible {
    background: var(--green);
    color: #FFFFFF;
    transform: translateY(-1px);
  }

  .bw-book .bw-book-btn:focus-visible,
  .bw-book a:focus-visible {
    outline: 3px solid rgba(255, 230, 0, 0.9);
    outline-offset: 3px;
  }
`;

class BWBookHeroElement extends HTMLElement {
  connectedCallback() {
    this._render();
  }

  _render() {
    this.innerHTML = `
      <style>
        bw-book-hero {
          display: block;
          width: 100%;
        }

        ${BW_BOOK_SHARED_STYLES}

        .bw-book .bw-book-hero {
          background:
            linear-gradient(90deg, rgba(255, 230, 0, 0.16) 0 1px, transparent 1px 84px),
            linear-gradient(180deg, #FFFFFF, #F5F8EF);
          border-top: 6px solid var(--green);
          padding: 56px 0 20px;
          position: relative;
        }

        .bw-book .bw-book-hero-grid {
          align-items: center;
          display: grid;
          gap: 48px;
          grid-template-columns: minmax(0, 1fr) minmax(320px, 400px);
          justify-content: space-between;
        }

        .bw-book .bw-book-hero h1 {
          color: var(--green);
          font-size: 52px;
          font-weight: 800;
          line-height: 1.02;
          margin-bottom: 18px;
          max-width: 640px;
        }

        .bw-book .bw-book-hero-lead {
          color: var(--muted);
          font-family: var(--serif);
          font-size: 18px;
          line-height: 1.68;
          margin-bottom: 26px;
          max-width: 620px;
        }

        .bw-book .bw-book-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 26px;
        }

        .bw-book .bw-book-meta-chip {
          background: #FFFFFF;
          border: 1px solid var(--light-green);
          border-radius: 999px;
          color: var(--green);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.4px;
          padding: 8px 14px;
          text-transform: uppercase;
        }

        .bw-book .bw-book-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .bw-book .bw-book-trust {
          align-items: center;
          color: var(--muted);
          display: flex;
          flex-wrap: wrap;
          font-family: var(--serif);
          font-size: 14px;
          gap: 14px;
          line-height: 1.45;
          margin-top: 28px;
        }

        .bw-book .bw-book-trust-score {
          background: var(--green);
          border-radius: 6px;
          color: #FFFFFF;
          font-family: Montserrat, Arial, sans-serif;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.6px;
          padding: 6px 10px;
        }

        .bw-book .bw-book-trust a {
          color: var(--green);
          font-family: Montserrat, Arial, sans-serif;
          font-weight: 700;
          text-decoration: underline;
        }

        .bw-book .bw-book-hero-card {
          background: #FFFFFF;
          border: 1px solid var(--light-green);
          border-radius: 12px;
          box-shadow: 0 18px 44px rgba(27, 94, 32, 0.12);
          max-width: 360px;
          padding: 22px 22px 18px;
        }

        .bw-book .bw-book-hero-card h2 {
          color: var(--green);
          font-size: 18px;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 14px;
        }

        .bw-book .bw-book-hero-card dl {
          display: grid;
          gap: 10px;
          margin: 0;
        }

        .bw-book .bw-book-hero-card dl > div {
          align-items: baseline;
          display: flex;
          gap: 12px;
          justify-content: space-between;
        }

        .bw-book .bw-book-hero-card dt {
          color: var(--muted);
          font-family: var(--serif);
          font-size: 14px;
          line-height: 1.4;
        }

        .bw-book .bw-book-hero-card dd {
          color: var(--green);
          font-size: 14px;
          font-weight: 800;
          line-height: 1.3;
          margin: 0;
          text-align: right;
        }

        .bw-book .bw-book-hero-card-foot {
          border-top: 1px dashed var(--light-green);
          color: var(--muted);
          font-family: var(--serif);
          font-size: 13px;
          line-height: 1.55;
          margin-top: 16px;
          padding-top: 14px;
        }

        .bw-book .bw-book-anchor {
          height: 0;
          margin: 0;
          padding: 0;
          scroll-margin-top: 80px;
        }

        @media (max-width: 880px) {
          .bw-book .bw-book-hero {
            padding: 44px 0 14px;
          }
          .bw-book .bw-book-hero-grid {
            gap: 28px;
            grid-template-columns: minmax(0, 1fr);
          }
          .bw-book .bw-book-hero h1 {
            font-size: 38px;
          }
          .bw-book .bw-book-hero-lead {
            font-size: 16px;
          }
          .bw-book .bw-book-hero-card {
            max-width: 100%;
          }
        }
      </style>

      <section class="bw-book">
        <div class="bw-book-hero">
          <div class="bw-book-inner">
            <div class="bw-book-hero-grid">
              <div>
                <span class="bw-book-eyebrow">Book the tour</span>
                <h1>Pick a date. Meet at the <span class="bw-book-highlight">World Clock</span>. Walk Berlin with a local.</h1>
                <p class="bw-book-hero-lead">A small-group walk through Berlin's historic centre, with stories most visitors miss. Free to book, tip-based at the end, runs in English daily.</p>

                <div class="bw-book-meta" aria-label="Tour key facts">
                  <span class="bw-book-meta-chip">Free · Tip-based</span>
                  <span class="bw-book-meta-chip">~2 hours</span>
                  <span class="bw-book-meta-chip">English</span>
                  <span class="bw-book-meta-chip">Daily</span>
                </div>

                <div class="bw-book-actions">
                  <a class="bw-book-btn bw-book-btn-primary" href="#${BW_BOOK_ANCHOR_ID}">Pick your date ↓</a>
                  <a class="bw-book-btn bw-book-btn-ghost" href="${BW_BOOK_MEETING_POINT_URL}">Meeting point</a>
                </div>

                <div class="bw-book-trust" aria-label="Tour rating">
                  <span class="bw-book-trust-score">9.8 / 10</span>
                  <span>On <a href="https://www.freetour.com/company/97387" rel="noopener" target="_blank">FreeTour</a>, from real walkers who took the same tour.</span>
                </div>
              </div>

              <aside class="bw-book-hero-card" aria-label="Tour at a glance">
                <h2>At a glance</h2>
                <dl>
                  <div><dt>Price</dt><dd>Free · Tip-based</dd></div>
                  <div><dt>Duration</dt><dd>~2 hours</dd></div>
                  <div><dt>Meeting point</dt><dd>World Clock, Alexanderplatz</dd></div>
                  <div><dt>Ends near</dt><dd>Hackescher Markt</dd></div>
                  <div><dt>Language</dt><dd>English</dd></div>
                </dl>
                <p class="bw-book-hero-card-foot">No payment to book. Tip your guide at the end based on what the walk was worth to you.</p>
              </aside>
            </div>
          </div>
        </div>
        <div id="${BW_BOOK_ANCHOR_ID}" class="bw-book-anchor" aria-hidden="true"></div>
      </section>
    `;
  }
}

class BWBookDetailsElement extends HTMLElement {
  connectedCallback() {
    this._render();
  }

  _render() {
    this.innerHTML = `
      <style>
        bw-book-details {
          display: block;
          width: 100%;
        }

        ${BW_BOOK_SHARED_STYLES}

        .bw-book .bw-book-section {
          padding: 56px 0;
        }

        .bw-book .bw-book-section:first-child {
          padding-top: 28px;
        }

        .bw-book .bw-book-section + .bw-book-section {
          border-top: 1px solid #E8ECDF;
        }

        .bw-book .bw-book-section-head {
          margin-bottom: 28px;
          max-width: 760px;
        }

        .bw-book .bw-book-section-head h2 {
          color: var(--green);
          font-size: 34px;
          font-weight: 800;
          letter-spacing: 0;
          line-height: 1.12;
          margin-bottom: 12px;
        }

        .bw-book .bw-book-section-lead {
          color: var(--muted);
          font-family: var(--serif);
          font-size: 17px;
          line-height: 1.7;
        }

        .bw-book .bw-book-included {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .bw-book .bw-book-included-card {
          background: #FFFFFF;
          border: 1px solid var(--light-green);
          border-radius: 10px;
          padding: 18px 18px 16px;
        }

        .bw-book .bw-book-included-card strong {
          color: var(--green);
          display: block;
          font-size: 15px;
          font-weight: 800;
          line-height: 1.25;
          margin-bottom: 6px;
        }

        .bw-book .bw-book-included-card span {
          color: var(--muted);
          display: block;
          font-family: var(--serif);
          font-size: 13.5px;
          line-height: 1.55;
        }

        .bw-book .bw-book-route {
          display: grid;
          gap: 14px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .bw-book .bw-book-route li {
          align-items: flex-start;
          background: #FFFFFF;
          border: 1px solid #E8ECDF;
          border-left: 4px solid var(--green);
          border-radius: 8px;
          display: grid;
          gap: 4px 16px;
          grid-template-columns: 28px minmax(0, 1fr);
          padding: 14px 18px;
        }

        .bw-book .bw-book-route li span.bw-book-route-num {
          color: var(--green);
          font-size: 14px;
          font-weight: 800;
          line-height: 1.3;
        }

        .bw-book .bw-book-route li strong {
          color: var(--green);
          display: block;
          font-size: 15px;
          font-weight: 800;
          line-height: 1.25;
          margin-bottom: 2px;
        }

        .bw-book .bw-book-route li p {
          color: var(--muted);
          font-family: var(--serif);
          font-size: 14px;
          line-height: 1.55;
          margin: 0;
        }

        .bw-book .bw-book-mp-grid {
          align-items: center;
          display: grid;
          gap: 28px;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
        }

        .bw-book .bw-book-mp-img {
          aspect-ratio: 4 / 3;
          background: #E8ECDF;
          border-radius: 10px;
          display: block;
          object-fit: cover;
          width: 100%;
        }

        .bw-book .bw-book-mp-copy h2 {
          color: var(--green);
          font-size: 26px;
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 10px;
        }

        .bw-book .bw-book-mp-copy p {
          color: var(--muted);
          font-family: var(--serif);
          font-size: 16px;
          line-height: 1.65;
          margin-bottom: 14px;
        }

        .bw-book .bw-book-explainer {
          background: #FFFFFF;
          border: 1px solid var(--light-green);
          border-left: 5px solid var(--green);
          border-radius: 10px;
          padding: 22px 24px;
        }

        .bw-book .bw-book-explainer h2 {
          color: var(--green);
          font-size: 22px;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 10px;
        }

        .bw-book .bw-book-explainer p {
          color: var(--muted);
          font-family: var(--serif);
          font-size: 15.5px;
          line-height: 1.65;
          margin-bottom: 10px;
        }

        .bw-book .bw-book-explainer p:last-child {
          margin-bottom: 0;
        }

        .bw-book .bw-book-faq {
          display: grid;
          gap: 12px;
        }

        .bw-book .bw-book-faq details {
          background: #FFFFFF;
          border: 1px solid #E8ECDF;
          border-radius: 8px;
          padding: 16px 20px;
        }

        .bw-book .bw-book-faq details[open] {
          border-color: var(--light-green);
        }

        .bw-book .bw-book-faq summary {
          color: var(--green);
          cursor: pointer;
          font-size: 16px;
          font-weight: 800;
          line-height: 1.3;
          list-style: none;
          padding-right: 28px;
          position: relative;
        }

        .bw-book .bw-book-faq summary::-webkit-details-marker {
          display: none;
        }

        .bw-book .bw-book-faq summary::after {
          color: var(--green);
          content: '+';
          font-size: 22px;
          font-weight: 800;
          line-height: 1;
          position: absolute;
          right: 0;
          top: -1px;
        }

        .bw-book .bw-book-faq details[open] summary::after {
          content: '–';
        }

        .bw-book .bw-book-faq details p {
          color: var(--muted);
          font-family: var(--serif);
          font-size: 15px;
          line-height: 1.65;
          margin-bottom: 0;
          margin-top: 10px;
        }

        .bw-book .bw-book-ending {
          background: var(--green);
          color: #FFFFFF;
          padding: 56px 0;
          text-align: center;
        }

        .bw-book .bw-book-ending h2 {
          color: #FFFFFF;
          font-size: 32px;
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 12px;
        }

        .bw-book .bw-book-ending p {
          color: rgba(255, 255, 255, 0.86);
          font-family: var(--serif);
          font-size: 17px;
          line-height: 1.6;
          margin: 0 auto 22px;
          max-width: 560px;
        }

        @media (max-width: 880px) {
          .bw-book .bw-book-section {
            padding: 44px 0;
          }
          .bw-book .bw-book-section-head h2 {
            font-size: 28px;
          }
          .bw-book .bw-book-included {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .bw-book .bw-book-mp-grid {
            grid-template-columns: minmax(0, 1fr);
          }
          .bw-book .bw-book-ending h2 {
            font-size: 26px;
          }
        }

        @media (max-width: 520px) {
          .bw-book .bw-book-included {
            grid-template-columns: minmax(0, 1fr);
          }
        }
      </style>

      <section class="bw-book">
        <div class="bw-book-section">
          <div class="bw-book-inner">
            <div class="bw-book-section-head">
              <span class="bw-book-eyebrow">What you get</span>
              <h2>A relaxed walk built for first-time visitors and history lovers.</h2>
              <p class="bw-book-section-lead">No rush, no scripts, no fake enthusiasm. Just the stories that make Berlin's centre click — the medieval corner, the royal ambition, the wall that ran through, the city that keeps rebuilding itself.</p>
            </div>
            <div class="bw-book-included" role="list">
              <article class="bw-book-included-card" role="listitem">
                <strong>~2 hours on foot</strong>
                <span>Easy pace, lots of stops, no rush.</span>
              </article>
              <article class="bw-book-included-card" role="listitem">
                <strong>A real local guide</strong>
                <span>Yusuf, the same person every day. Not a rotating script.</span>
              </article>
              <article class="bw-book-included-card" role="listitem">
                <strong>Historic centre, end to end</strong>
                <span>Alexanderplatz to Hackescher Markt, through Berlin's oldest streets.</span>
              </article>
              <article class="bw-book-included-card" role="listitem">
                <strong>Old maps and photos</strong>
                <span>Compare what stood here before with what you are looking at now.</span>
              </article>
            </div>
          </div>
        </div>

        <div class="bw-book-section">
          <div class="bw-book-inner">
            <div class="bw-book-section-head">
              <span class="bw-book-eyebrow">What to expect on the walk</span>
              <h2>One compact route through 800 years of Berlin.</h2>
              <p class="bw-book-section-lead">A loose outline. The walk shifts with the group, the weather, and the questions you bring.</p>
            </div>
            <ol class="bw-book-route">
              <li><span class="bw-book-route-num">1</span><div><strong>Alexanderplatz &amp; the socialist redesign</strong><p>Why East Berlin's flagship square looks the way it does, and what stood here before.</p></div></li>
              <li><span class="bw-book-route-num">2</span><div><strong>Marienkirche &amp; medieval Berlin</strong><p>The 800-year-old church that survived everything, and the medieval city most visitors walk past.</p></div></li>
              <li><span class="bw-book-route-num">3</span><div><strong>Nikolaiviertel &amp; the rebuilt old town</strong><p>Berlin's oldest quarter — destroyed, rebuilt, and quietly strange when you look closely.</p></div></li>
              <li><span class="bw-book-route-num">4</span><div><strong>Museum Island &amp; Prussian ambition</strong><p>How a sandy island in the Spree became one of the great museum complexes in Europe.</p></div></li>
              <li><span class="bw-book-route-num">5</span><div><strong>Hackescher Markt &amp; Berlin's quiet corners</strong><p>Hidden courtyards, traces of the wall, and the parts of Berlin most tours skip.</p></div></li>
            </ol>
          </div>
        </div>

        <div class="bw-book-section">
          <div class="bw-book-inner">
            <div class="bw-book-mp-grid">
              <img class="bw-book-mp-img" src="${BW_BOOK_WORLD_CLOCK_IMAGE_URL}" alt="World Clock at Alexanderplatz, the BerlinWalk meeting point" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${BW_BOOK_WORLD_CLOCK_IMAGE_FALLBACK_URL}';">
              <div class="bw-book-mp-copy">
                <span class="bw-book-eyebrow">Meeting point</span>
                <h2>The World Clock, Alexanderplatz.</h2>
                <p>Hard to miss, easy to reach — directly above U/S-Bahn Alexanderplatz. Look for the guide with a BerlinWalk sign a few minutes before start time.</p>
                <a class="bw-book-btn bw-book-btn-ghost" href="${BW_BOOK_MEETING_POINT_URL}">Meeting point details →</a>
              </div>
            </div>
          </div>
        </div>

        <div class="bw-book-section">
          <div class="bw-book-inner">
            <aside class="bw-book-explainer" aria-labelledby="bw-book-tip-title">
              <span class="bw-book-eyebrow">Free, tip-based — what that means</span>
              <h2 id="bw-book-tip-title">No payment to book. Tip the guide at the end based on what the walk was worth to you.</h2>
              <p>You reserve a spot for free. After the walk, you decide what to tip — based on the value you got, your budget, and how it compares to a paid tour. This is how I make a living, and how the tour stays accessible to travellers on every kind of budget.</p>
              <p>Most guests tip between 10€ and 20€ per person. There is no minimum, no pressure, and no awkward handover script at the end.</p>
            </aside>
          </div>
        </div>

        <div class="bw-book-section">
          <div class="bw-book-inner">
            <div class="bw-book-section-head">
              <span class="bw-book-eyebrow">Frequently asked</span>
              <h2>Quick answers before you book.</h2>
            </div>
            <div class="bw-book-faq">
              <details>
                <summary>Is the tour really free?</summary>
                <p>Yes. There is no charge to book or join. At the end of the walk you decide what to tip based on the value you got — there is no minimum and no pressure.</p>
              </details>
              <details>
                <summary>What does the tour cover?</summary>
                <p>Berlin's historic centre, end to end: Alexanderplatz, the medieval city, Nikolaiviertel, Museum Island, traces of the wall, and the hidden corners around Hackescher Markt.</p>
              </details>
              <details>
                <summary>How long does the tour last?</summary>
                <p>About 2 hours on foot at a relaxed pace, with frequent stops for stories, old photos, and your questions.</p>
              </details>
              <details>
                <summary>What language is the tour in?</summary>
                <p>English. The walk is built around stories and context, so the explanations work for first-time visitors and history lovers alike.</p>
              </details>
              <details>
                <summary>Do we go inside museums or buildings?</summary>
                <p>No. The walk is fully outdoors, so there are no ticket purchases or queues. You will leave the tour with a clear shortlist of museums and interiors worth coming back to on your own.</p>
              </details>
              <details>
                <summary>Will I see the Berlin Wall on this tour?</summary>
                <p>This walk focuses on the historic centre. You will see traces of the wall's path and the East-West divide, but for full Berlin Wall context the East Side Gallery or Bernauer Straße are better dedicated visits afterwards.</p>
              </details>
              <details>
                <summary>How much should I tip?</summary>
                <p>Whatever the walk was worth to you. Most guests tip between 10€ and 20€ per person. Cash is easiest, card works too.</p>
              </details>
            </div>
          </div>
        </div>

        <div class="bw-book-ending">
          <div class="bw-book-inner">
            <h2>Ready to walk Berlin with a local?</h2>
            <p>Free to book. Tip-based at the end. Just pick a date and meet at the World Clock.</p>
            <a class="bw-book-btn bw-book-btn-yellow" href="#${BW_BOOK_ANCHOR_ID}">Pick your date ↑</a>
          </div>
        </div>
      </section>
    `;
  }
}

if (!customElements.get('bw-book-hero')) {
  customElements.define('bw-book-hero', BWBookHeroElement);
}
if (!customElements.get('bw-book-details')) {
  customElements.define('bw-book-details', BWBookDetailsElement);
}
