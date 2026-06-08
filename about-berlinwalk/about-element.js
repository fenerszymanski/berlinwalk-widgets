const BW_ABOUT_BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
const BW_ABOUT_CONTACT_URL = 'https://www.instagram.com/berlinwalkingtour/';

class BWAboutCompanyElement extends HTMLElement {
  connectedCallback() {
    this._render();
  }

  _render() {
    this.innerHTML = `
      <style>
        bw-about-company {
          display: block;
          width: 100%;
        }

        .bw-about {
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

        .bw-about *,
        .bw-about *::before,
        .bw-about *::after { box-sizing: border-box; }
        .bw-about h1, .bw-about h2, .bw-about h3, .bw-about p { margin-top: 0; }
        .bw-about a { color: inherit; }

        .bw-about-inner {
          margin: 0 auto;
          max-width: 900px;
          padding: 64px 24px;
          width: 100%;
        }

        .bw-about-hero {
          text-align: center;
          margin-bottom: 56px;
        }

        .bw-about-kicker {
          color: var(--green);
          display: inline-block;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 1.5px;
          margin-bottom: 16px;
          text-transform: uppercase;
        }

        .bw-about-hero h1 {
          color: var(--green);
          font-size: 48px;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 24px;
        }

        .bw-about-hero p {
          color: var(--muted);
          font-family: var(--serif);
          font-size: 18px;
          line-height: 1.6;
          margin: 0 auto;
          max-width: 640px;
        }

        .bw-about-clarification {
          background: #FFFDF0;
          border: 1px solid var(--yellow);
          border-left: 6px solid var(--yellow);
          border-radius: 8px;
          padding: 32px;
          margin-bottom: 56px;
          box-shadow: 0 12px 30px rgba(255, 230, 0, 0.1);
        }

        .bw-about-clarification h2 {
          color: var(--green);
          font-size: 24px;
          font-weight: 800;
          margin-bottom: 12px;
        }

        .bw-about-clarification p {
          color: #4A4000;
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 0;
        }
        .bw-about-clarification strong {
          color: var(--green-dark);
        }

        .bw-about-grid {
          display: grid;
          gap: 48px;
          grid-template-columns: 1fr 1fr;
          margin-bottom: 64px;
        }

        .bw-about-card {
          background: #FFFFFF;
          border-radius: 12px;
          border: 1px solid var(--light-green);
          padding: 36px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
        }

        .bw-about-card h3 {
          color: var(--green);
          font-size: 22px;
          font-weight: 800;
          margin-bottom: 16px;
        }

        .bw-about-card p {
          color: var(--muted);
          font-size: 15px;
          line-height: 1.65;
          margin-bottom: 0;
        }

        .bw-about-cta-banner {
          background: var(--green);
          border-radius: 12px;
          color: #FFFFFF;
          padding: 48px 32px;
          text-align: center;
        }

        .bw-about-cta-banner h2 {
          color: var(--yellow);
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 16px;
        }

        .bw-about-cta-banner p {
          color: rgba(255,255,255,0.9);
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .bw-about-btn {
          align-items: center;
          background: var(--yellow);
          border-radius: 999px;
          color: var(--green);
          display: inline-flex;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.5px;
          padding: 16px 28px;
          text-decoration: none;
          text-transform: uppercase;
          transition: transform 150ms ease, background 150ms ease;
        }

        .bw-about-btn:hover {
          background: #FFF04A;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .bw-about-hero h1 { font-size: 36px; }
          .bw-about-grid { grid-template-columns: 1fr; gap: 24px; }
          .bw-about-clarification { padding: 24px; }
          .bw-about-card { padding: 24px; }
        }
      </style>

      <main class="bw-about">
        <div class="bw-about-inner">
          
          <header class="bw-about-hero">
            <span class="bw-about-kicker">Company Profile</span>
            <h1>About BerlinWalk</h1>
            <p>An independent, locally run walking tour focused on delivering clarity, context, and a genuine human connection to Berlin's complex history.</p>
          </header>

          <section class="bw-about-clarification" aria-labelledby="bw-clarification-title">
            <h2 id="bw-clarification-title">Is BerlinWalk the same as Berlin Walks?</h2>
            <p><strong>No.</strong> BerlinWalk is an independent, tip-based free walking tour founded and operated by Yusuf. We are a completely separate entity and are <strong>not affiliated with the older, paid-tour company "Berlin Walks"</strong> or any large international tour conglomerate. When you book with BerlinWalk, you are supporting an independent local project.</p>
          </section>

          <div class="bw-about-grid">
            <article class="bw-about-card">
              <h3>The Tip-Based Model</h3>
              <p>We operate on a "free-to-join, tip-what-you-want" model. This means there is no upfront ticket price. At the end of the tour, you decide what the experience was worth to you. This keeps high-quality tours accessible to all travelers and ensures the guide is highly motivated to give an excellent performance every single day.</p>
            </article>

            <article class="bw-about-card">
              <h3>Our Philosophy</h3>
              <p>Berlin is not a city that should feel like a checklist. We focus on structure and stories over dry dates and trivia. By walking the route from Alexanderplatz into the historic core, we help visitors see how the layers of medieval, Prussian, divided, and modern Berlin stack on top of one another.</p>
            </article>
          </div>

          <section class="bw-about-cta-banner">
            <h2>Ready to walk?</h2>
            <p>Join the tour and see the city from a new perspective.</p>
            <a href="${BW_ABOUT_BOOKING_URL}" class="bw-about-btn">Book Your Free Spot</a>
          </section>

        </div>
      </main>
    `;
  }
}

if (!customElements.get('bw-about-company')) {
  customElements.define('bw-about-company', BWAboutCompanyElement);
}
