const BW_BOOK_ANCHOR_ID = 'book';
const BW_BOOK_MEETING_POINT_URL = 'https://www.berlinwalk.com/meeting-point';
const BW_BOOK_PRIVATE_TOUR_URL = 'https://www.berlinwalk.com/private-tour';
const BW_BOOK_THE_GUIDE_URL = 'https://www.berlinwalk.com/the-guide';
const BW_BOOK_REVIEWS_URL = 'https://www.berlinwalk.com/reviews';
const BW_BOOK_WORLD_CLOCK_IMAGE_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/gallery/images/06-1200w.webp';
const BW_BOOK_WORLD_CLOCK_IMAGE_FALLBACK_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/gallery/images/06-1200w.jpg';
const BW_BOOK_NEXT_TOUR_SLOT_FALLBACK_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/js/next-tour-slot.js';
const BW_BOOK_NEXT_TOUR_SLOT_URL = resolveBookAssetUrl('../js/next-tour-slot.js', BW_BOOK_NEXT_TOUR_SLOT_FALLBACK_URL);

let bwBookNextTourSlotPromise = null;

function resolveBookAssetUrl(relativePath, fallbackUrl) {
  try {
    if (document.currentScript && document.currentScript.src) {
      return new URL(relativePath, document.currentScript.src).toString();
    }
  } catch {}
  return fallbackUrl;
}

function ensureBookNextTourSlotHelper() {
  if (typeof window.bwNextTourSlot === 'function') return Promise.resolve(window.bwNextTourSlot);
  if (bwBookNextTourSlotPromise) return bwBookNextTourSlotPromise;
  bwBookNextTourSlotPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${BW_BOOK_NEXT_TOUR_SLOT_URL}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(window.bwNextTourSlot), { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = BW_BOOK_NEXT_TOUR_SLOT_URL;
    script.async = true;
    script.onload = () => resolve(window.bwNextTourSlot);
    script.onerror = reject;
    document.head.appendChild(script);
  }).catch(() => null);
  return bwBookNextTourSlotPromise;
}

function readBookNextTourSlot() {
  try {
    if (typeof window.bwNextTourSlot === 'function') return window.bwNextTourSlot();
  } catch {}
  return null;
}

const BW_BOOK_SHARED_STYLES = `
  .bw-book [hidden] {
    display: none !important;
  }

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
    this._syncNextWalk();
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
          margin-left: auto;
          margin-right: auto;
          max-width: 1120px;
          width: 100%;
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

  .bw-book .bw-book-cta-note {
    color: var(--green-dark);
    font-size: 13px;
    font-weight: 700;
    line-height: 1.5;
    margin: 14px 0 0;
    max-width: 520px;
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
                <span class="bw-book-eyebrow">Berlin Then and Now</span>
                <h1>Pick a date. Meet me at the <span class="bw-book-highlight">World Clock</span>. Walk the Berlin that disappeared.</h1>
                <p class="bw-book-hero-lead">Berlin's old city did not survive. I walk you through where it stood and hold up an archive photo of the same place at every stop.</p>

                <div class="bw-book-meta" aria-label="Tour key facts">
                  <span class="bw-book-meta-chip">€25 per person</span>
                  <span class="bw-book-meta-chip">About 2.5 hours</span>
                  <span class="bw-book-meta-chip">Max 10 people</span>
                  <span class="bw-book-meta-chip">English</span>
                </div>

                <div class="bw-book-actions">
                  <a class="bw-book-btn bw-book-btn-primary" href="#${BW_BOOK_ANCHOR_ID}">Pick your date ↓</a>
                  <a class="bw-book-btn bw-book-btn-ghost" href="${BW_BOOK_MEETING_POINT_URL}">Meeting point</a>
                </div>
                <p class="bw-book-cta-note">The walk starts at 12:30 at the World Clock on Alexanderplatz and needs at least 2 guests. If you are the only guest two hours before the start, I cancel it and refund you in full.</p>

                <div class="bw-book-trust" aria-label="Guest reviews">
                  <span>Read what guests say on my <a href="${BW_BOOK_REVIEWS_URL}">reviews page</a>.</span>
                </div>
              </div>

              <aside class="bw-book-hero-card" aria-label="Tour at a glance">
                <h2>At a glance</h2>
                <dl>
                  <div data-bw-book-next-walk-row hidden><dt>Next walk</dt><dd data-bw-book-next-walk>Loading...</dd></div>
                  <div><dt>Price</dt><dd>€25 per person</dd></div>
                  <div><dt>Duration</dt><dd>About 2.5 hours, about 3 km</dd></div>
                  <div><dt>Start</dt><dd>12:30, World Clock, Alexanderplatz</dd></div>
                  <div><dt>Ends at</dt><dd>Hackescher Markt</dd></div>
                  <div><dt>Group</dt><dd>2 to 10 people</dd></div>
                  <div><dt>Language</dt><dd>English</dd></div>
                </dl>
                <p class="bw-book-hero-card-foot">Cancel up to 24 hours before the start for a full refund, or move to another date if there is space.</p>
              </aside>
            </div>
          </div>
        </div>
        <div id="${BW_BOOK_ANCHOR_ID}" class="bw-book-anchor" aria-hidden="true"></div>
      </section>
    `;
  }

  _syncNextWalk() {
    const apply = () => {
      const slot = readBookNextTourSlot();
      const row = this.querySelector('[data-bw-book-next-walk-row]');
      const value = this.querySelector('[data-bw-book-next-walk]');
      if (!row || !value || !slot || !slot.relativeLabel || !slot.slotsLabel) return false;
      value.textContent = `${slot.relativeLabel} ${slot.slotsLabel}`;
      row.hidden = false;
      return true;
    };

    if (apply()) return;
    ensureBookNextTourSlotHelper().then(() => {
      apply();
    }).catch(() => {});
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

        .bw-book .bw-book-private {
          border-top: 1px solid rgba(255, 255, 255, 0.28);
          color: rgba(255, 255, 255, 0.86);
          font-family: var(--serif);
          font-size: 16px;
          line-height: 1.6;
          margin: 30px auto 0;
          max-width: 560px;
          padding-top: 22px;
        }

        .bw-book .bw-book-private a {
          color: #FFE600;
          font-family: Montserrat, Arial, sans-serif;
          font-weight: 700;
          text-decoration: underline;
          text-underline-offset: 3px;
          white-space: nowrap;
        }

        .bw-book .bw-book-private a:hover,
        .bw-book .bw-book-private a:focus-visible {
          color: #FFFFFF;
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
              <h2>A walk through the old city that disappeared.</h2>
              <p class="bw-book-section-lead">The streets where Berlin grew up were cleared after the war, and much of what people call the old town today is a 1980s rebuild. I show you where the old city stood, one archive photo at a time.</p>
            </div>
            <div class="bw-book-included" role="list">
              <article class="bw-book-included-card" role="listitem">
                <strong>About 2.5 hours on foot</strong>
                <span>About 3 km at an easy pace, with a stop every few minutes.</span>
              </article>
              <article class="bw-book-included-card" role="listitem">
                <strong>The guide who built the route</strong>
                <span>Me, Yusuf, on every walk. Not a rotating script.</span>
              </article>
              <article class="bw-book-included-card" role="listitem">
                <strong>11 stops covering 16 places</strong>
                <span>From the World Clock and the TV Tower to Museum Island and Hackescher Markt.</span>
              </article>
              <article class="bw-book-included-card" role="listitem">
                <strong>An archive photo at every stop</strong>
                <span>See what stood in the same place before, and what is left of it now.</span>
              </article>
            </div>
          </div>
        </div>

        <div class="bw-book-section">
          <div class="bw-book-inner">
            <div class="bw-book-section-head">
              <span class="bw-book-eyebrow">What to expect on the walk</span>
              <h2>From Alexanderplatz to Hackescher Markt.</h2>
              <p class="bw-book-section-lead">A short outline of the 11 stops. The pace shifts with the group, the weather, and the questions you bring.</p>
            </div>
            <ol class="bw-book-route">
              <li><span class="bw-book-route-num">1</span><div><strong>The World Clock and the TV Tower</strong><p>Why East Berlin's flagship square looks the way it does, and what stood here before.</p></div></li>
              <li><span class="bw-book-route-num">2</span><div><strong>Rotes Rathaus, Neptunbrunnen and the Marienkirche</strong><p>The red town hall, the fountain, and the medieval church that outlived the streets around it.</p></div></li>
              <li><span class="bw-book-route-num">3</span><div><strong>Marx-Engels-Forum, the Sanchi Gate and the Humboldt Forum</strong><p>An open park where a dense old quarter once stood, and the rebuilt palace facade across the river.</p></div></li>
              <li><span class="bw-book-route-num">4</span><div><strong>Lustgarten, Berliner Dom and Museum Island</strong><p>How a sandy island in the Spree became one of the great museum complexes in Europe.</p></div></li>
              <li><span class="bw-book-route-num">5</span><div><strong>Friedrichsbrücke to Hackescher Markt</strong><p>Across the Spree to the end of the walk, with cafes, food and S-Bahn connections close by.</p></div></li>
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
                <p>Hard to miss and easy to reach, right above U-Bahn and S-Bahn Alexanderplatz. Come 5 minutes before 12:30 and look for my green umbrella.</p>
                <a class="bw-book-btn bw-book-btn-ghost" href="${BW_BOOK_MEETING_POINT_URL}">Meeting point details →</a>
              </div>
            </div>
          </div>
        </div>

        <div class="bw-book-section">
          <div class="bw-book-inner">
            <aside class="bw-book-explainer" aria-labelledby="bw-book-price-title">
              <span class="bw-book-eyebrow">Price and cancellation</span>
              <h2 id="bw-book-price-title">€25 per person, paid when you book.</h2>
              <p>That is the same price on every site that sells it. The group is never bigger than 10, and a walk needs at least 2 guests. If you are the only guest two hours before the start, I cancel the walk, refund you in full and give you one of my audio walks for free.</p>
              <p>Cancel up to 24 hours before the start and you get a full refund, or move to another date if there is space. Later than that, or if you do not come, I cannot refund. If I have to cancel, for weather or anything else, you get your money back in full.</p>
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
                <summary>What is Berlin Then and Now?</summary>
                <p>It is my walking tour through the part of Berlin that is gone. The streets where the city grew up were cleared after the war, and much of what people call the old town today is a 1980s rebuild. At every stop I hold up an archive photo of the same place, so you can see what stood there and what is left.</p>
              </details>
              <details>
                <summary>How long is it and where does it go?</summary>
                <p>About 2.5 hours and about 3 km on foot. We start at the World Clock on Alexanderplatz and end at Hackescher Markt: 11 stops covering 16 places, from the TV Tower and the Marienkirche to the Humboldt Forum and Museum Island.</p>
              </details>
              <details>
                <summary>How much does it cost?</summary>
                <p>€25 per person, paid when you book. That is the same price on every site that sells it.</p>
              </details>
              <details>
                <summary>How big is the group, and does my date run?</summary>
                <p>No more than 10 people. A walk needs at least 2 guests. If you are the only guest two hours before the start, I cancel the walk, refund you in full and give you one of my audio walks for free.</p>
              </details>
              <details>
                <summary>Where do I meet you?</summary>
                <p>At the World Clock (Weltzeituhr) on Alexanderplatz. Come 5 minutes before the start and look for my green umbrella.</p>
              </details>
              <details>
                <summary>Can I cancel or change my date?</summary>
                <p>Yes. Cancel up to 24 hours before the start and you get a full refund, or move to another date if there is space. Later than that I cannot refund. If I have to cancel, for weather or anything else, you get your money back in full.</p>
              </details>
              <details>
                <summary>What if it rains?</summary>
                <p>The walk runs in light rain, so bring a jacket. If the weather makes it unsafe, I cancel and refund you in full.</p>
              </details>
              <details>
                <summary>Is it in English, and can I book it just for my group?</summary>
                <p>The walk is in English. For your own group I run private walks: €249 for up to 6 people or €299 for up to 10.</p>
              </details>
            </div>
          </div>
        </div>

        <div class="bw-book-ending">
          <div class="bw-book-inner">
            <h2>Ready to walk the Berlin that disappeared?</h2>
            <p>Pick a date and meet me at the World Clock at 12:30.</p>
            <a class="bw-book-btn bw-book-btn-yellow" href="#${BW_BOOK_ANCHOR_ID}">Pick your date ↑</a>
            <p class="bw-book-private">Coming with your own group? I also run this walk privately: €249 for up to 6 people or €299 for up to 10. <a href="${BW_BOOK_PRIVATE_TOUR_URL}">See private walks</a></p>
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
