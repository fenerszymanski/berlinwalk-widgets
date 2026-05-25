const BW_THANK_YOU_MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Weltzeituhr%20Alexanderplatz%20Berlin';
const BW_THANK_YOU_MEETING_POINT_URL = 'https://www.berlinwalk.com/meeting-point';
const BW_THANK_YOU_TOOLS_URL = 'https://www.berlinwalk.com/berlin-tools';
const BW_THANK_YOU_TRANSPORT_URL = 'https://www.berlinwalk.com/tools/transport-ticket-calculator';
const BW_THANK_YOU_TODAY_URL = 'https://www.berlinwalk.com/tools/whats-open-in-berlin-today';
const BW_THANK_YOU_IMAGE_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/gallery/images/06-1200w.webp';
const BW_THANK_YOU_IMAGE_FALLBACK_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/gallery/images/06-1200w.jpg';

class BWThankYouElement extends HTMLElement {
  connectedCallback() {
    document.body.classList.add('bw-thank-you-page-active');
    this._render();
  }

  disconnectedCallback() {
    document.body.classList.remove('bw-thank-you-page-active');
  }

  _render() {
    this.innerHTML = `
      <style>
        bw-thank-you {
          display: block;
          width: 100%;
        }

        body.bw-thank-you-page-active #bw-sticky-cta,
        body.bw-thank-you-page-active #bw-desktop-cta {
          display: none !important;
        }

        .bw-thank-you {
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

        .bw-thank-you *,
        .bw-thank-you *::before,
        .bw-thank-you *::after {
          box-sizing: border-box;
        }

        .bw-thank-you h1,
        .bw-thank-you h2,
        .bw-thank-you h3,
        .bw-thank-you p,
        .bw-thank-you figure,
        .bw-thank-you ol,
        .bw-thank-you dl,
        .bw-thank-you dd {
          margin-top: 0;
        }

        .bw-thank-you dd {
          margin-left: 0;
        }

        .bw-thank-you a {
          color: inherit;
        }

        .bw-thank-you .bw-ty-inner {
          margin: 0 auto;
          max-width: 1120px;
          padding: 0 24px;
          width: 100%;
        }

        .bw-thank-you .bw-ty-hero {
          background:
            linear-gradient(90deg, rgba(255, 230, 0, 0.14) 0 1px, transparent 1px 82px),
            linear-gradient(180deg, #FFFFFF 0%, #F5F8EF 100%);
          border-top: 6px solid var(--green);
          padding: 54px 0 46px;
          position: relative;
        }

        .bw-thank-you .bw-ty-hero-grid {
          align-items: start;
          display: grid;
          gap: 44px;
          grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.78fr);
        }

        .bw-thank-you .bw-ty-eyebrow {
          align-items: center;
          color: var(--green);
          display: inline-flex;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0;
          line-height: 1.35;
          margin-bottom: 18px;
          text-transform: uppercase;
        }

        .bw-thank-you .bw-ty-eyebrow::before {
          background: var(--yellow);
          border: 3px solid var(--green);
          border-radius: 999px;
          content: "";
          display: inline-block;
          height: 18px;
          margin-right: 10px;
          width: 18px;
        }

        .bw-thank-you h1 {
          color: var(--green);
          font-size: 54px;
          font-weight: 800;
          letter-spacing: 0;
          line-height: 1.02;
          margin-bottom: 18px;
          max-width: 700px;
        }

        .bw-thank-you .bw-ty-highlight {
          background: var(--yellow);
          box-decoration-break: clone;
          color: var(--green);
          padding: 0 8px 5px;
          -webkit-box-decoration-break: clone;
        }

        .bw-thank-you .bw-ty-lead {
          color: var(--muted);
          font-family: var(--serif);
          font-size: 18px;
          line-height: 1.68;
          margin-bottom: 26px;
          max-width: 680px;
        }

        .bw-thank-you .bw-ty-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 22px;
        }

        .bw-thank-you .bw-ty-btn {
          align-items: center;
          border-radius: 999px;
          display: inline-flex;
          font-size: 13px;
          font-weight: 800;
          justify-content: center;
          letter-spacing: 0;
          min-height: 48px;
          padding: 14px 22px;
          text-decoration: none;
          text-transform: uppercase;
          transition: background 160ms ease, color 160ms ease, transform 160ms ease;
        }

        .bw-thank-you .bw-ty-btn-primary {
          background: var(--green);
          color: #FFFFFF;
        }

        .bw-thank-you .bw-ty-btn-primary:hover,
        .bw-thank-you .bw-ty-btn-primary:focus-visible {
          background: #124516;
          transform: translateY(-1px);
        }

        .bw-thank-you .bw-ty-btn-secondary {
          background: var(--yellow);
          color: var(--green);
        }

        .bw-thank-you .bw-ty-btn-secondary:hover,
        .bw-thank-you .bw-ty-btn-secondary:focus-visible {
          background: #fff04a;
          transform: translateY(-1px);
        }

        .bw-thank-you .bw-ty-btn:focus-visible,
        .bw-thank-you a:focus-visible {
          outline: 3px solid rgba(255, 230, 0, 0.9);
          outline-offset: 3px;
        }

        .bw-thank-you .bw-ty-inbox-note {
          align-items: flex-start;
          background: #FFFFFF;
          border-left: 6px solid var(--yellow);
          box-shadow: 0 12px 30px rgba(27, 94, 32, 0.1);
          display: grid;
          gap: 12px;
          grid-template-columns: 42px minmax(0, 1fr);
          max-width: 650px;
          padding: 18px 20px;
        }

        .bw-thank-you .bw-ty-inbox-mark {
          align-items: center;
          background: var(--green);
          border-radius: 999px;
          color: #FFFFFF;
          display: inline-flex;
          font-size: 13px;
          font-weight: 800;
          height: 34px;
          justify-content: center;
          line-height: 1;
          width: 34px;
        }

        .bw-thank-you .bw-ty-inbox-note strong {
          color: var(--green);
          display: block;
          font-size: 14px;
          font-weight: 800;
          line-height: 1.35;
          margin-bottom: 4px;
        }

        .bw-thank-you .bw-ty-inbox-note p {
          color: var(--muted);
          font-size: 14px;
          line-height: 1.55;
          margin-bottom: 0;
        }

        .bw-thank-you .bw-ty-pass {
          background: var(--green-dark);
          border-radius: 8px;
          box-shadow: 0 24px 58px rgba(16, 36, 20, 0.24);
          color: #FFFFFF;
          overflow: hidden;
          position: relative;
        }

        .bw-thank-you .bw-ty-pass-top {
          align-items: center;
          background: var(--yellow);
          color: var(--green);
          display: flex;
          font-size: 12px;
          font-weight: 800;
          justify-content: space-between;
          line-height: 1.35;
          padding: 13px 16px;
          text-transform: uppercase;
        }

        .bw-thank-you .bw-ty-pass figure {
          margin: 0;
          position: relative;
        }

        .bw-thank-you .bw-ty-pass img {
          aspect-ratio: 4 / 3;
          display: block;
          height: 100%;
          object-fit: cover;
          width: 100%;
        }

        .bw-thank-you .bw-ty-photo-badge {
          background: rgba(27, 94, 32, 0.92);
          bottom: 14px;
          color: #FFFFFF;
          font-size: 12px;
          font-weight: 800;
          left: 14px;
          padding: 8px 11px;
          position: absolute;
          text-transform: uppercase;
        }

        .bw-thank-you .bw-ty-pass-body {
          padding: 22px 24px 24px;
        }

        .bw-thank-you .bw-ty-pass h2 {
          color: #FFFFFF;
          font-size: 25px;
          font-weight: 800;
          letter-spacing: 0;
          line-height: 1.15;
          margin-bottom: 8px;
        }

        .bw-thank-you .bw-ty-pass-copy {
          color: rgba(255, 255, 255, 0.78);
          font-family: var(--serif);
          font-size: 14px;
          line-height: 1.55;
          margin-bottom: 18px;
        }

        .bw-thank-you .bw-ty-facts {
          border-top: 1px solid rgba(197, 225, 165, 0.3);
          display: grid;
          gap: 0;
          margin: 0;
        }

        .bw-thank-you .bw-ty-fact {
          border-bottom: 1px solid rgba(197, 225, 165, 0.3);
          display: grid;
          gap: 12px;
          grid-template-columns: 92px minmax(0, 1fr);
          padding: 13px 0;
        }

        .bw-thank-you .bw-ty-fact dt {
          color: var(--light-green);
          font-size: 11px;
          font-weight: 800;
          line-height: 1.35;
          text-transform: uppercase;
        }

        .bw-thank-you .bw-ty-fact dd {
          color: #FFFFFF;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.4;
          margin-bottom: 0;
        }

        .bw-thank-you .bw-ty-next {
          background: var(--green);
          color: #FFFFFF;
          padding: 44px 0;
        }

        .bw-thank-you .bw-ty-section-head {
          display: grid;
          gap: 16px;
          grid-template-columns: minmax(0, 0.7fr) minmax(0, 1fr);
          margin-bottom: 26px;
        }

        .bw-thank-you .bw-ty-section-head h2 {
          color: inherit;
          font-size: 34px;
          font-weight: 800;
          letter-spacing: 0;
          line-height: 1.12;
          margin-bottom: 0;
        }

        .bw-thank-you .bw-ty-section-head p {
          color: rgba(255, 255, 255, 0.78);
          font-family: var(--serif);
          font-size: 16px;
          line-height: 1.62;
          margin-bottom: 0;
        }

        .bw-thank-you .bw-ty-steps {
          counter-reset: bw-ty-step;
          display: grid;
          gap: 14px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .bw-thank-you .bw-ty-step {
          background: rgba(255, 255, 255, 0.09);
          border: 1px solid rgba(197, 225, 165, 0.28);
          border-radius: 8px;
          counter-increment: bw-ty-step;
          min-height: 190px;
          padding: 22px 22px 20px;
        }

        .bw-thank-you .bw-ty-step::before {
          align-items: center;
          background: var(--yellow);
          border-radius: 999px;
          color: var(--green);
          content: counter(bw-ty-step);
          display: inline-flex;
          font-size: 14px;
          font-weight: 800;
          height: 34px;
          justify-content: center;
          margin-bottom: 18px;
          width: 34px;
        }

        .bw-thank-you .bw-ty-step h3 {
          color: #FFFFFF;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: 0;
          line-height: 1.25;
          margin-bottom: 9px;
        }

        .bw-thank-you .bw-ty-step p {
          color: rgba(255, 255, 255, 0.78);
          font-size: 14px;
          line-height: 1.58;
          margin-bottom: 0;
        }

        .bw-thank-you .bw-ty-plan {
          padding: 44px 0 56px;
        }

        .bw-thank-you .bw-ty-plan .bw-ty-section-head {
          color: var(--text);
        }

        .bw-thank-you .bw-ty-plan .bw-ty-section-head p {
          color: var(--muted);
        }

        .bw-thank-you .bw-ty-links {
          display: grid;
          gap: 14px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .bw-thank-you .bw-ty-link-card {
          background: #FFFFFF;
          border: 1px solid var(--light-green);
          border-radius: 8px;
          color: var(--text);
          display: grid;
          min-height: 178px;
          padding: 22px;
          text-decoration: none;
          transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
        }

        .bw-thank-you .bw-ty-link-card:hover,
        .bw-thank-you .bw-ty-link-card:focus-visible {
          border-color: var(--green);
          box-shadow: 0 16px 34px rgba(27, 94, 32, 0.14);
          transform: translateY(-2px);
        }

        .bw-thank-you .bw-ty-link-kicker {
          color: var(--green);
          font-size: 11px;
          font-weight: 800;
          line-height: 1.35;
          margin-bottom: 13px;
          text-transform: uppercase;
        }

        .bw-thank-you .bw-ty-link-card h3 {
          color: var(--green);
          font-size: 21px;
          font-weight: 800;
          letter-spacing: 0;
          line-height: 1.18;
          margin-bottom: 10px;
        }

        .bw-thank-you .bw-ty-link-card p {
          color: var(--muted);
          font-size: 14px;
          line-height: 1.58;
          margin-bottom: 16px;
        }

        .bw-thank-you .bw-ty-link-action {
          align-self: end;
          color: var(--green);
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
        }

        @media (prefers-reduced-motion: reduce) {
          .bw-thank-you .bw-ty-btn,
          .bw-thank-you .bw-ty-link-card {
            transition: none;
          }
        }

        @media (max-width: 900px) {
          .bw-thank-you .bw-ty-hero-grid,
          .bw-thank-you .bw-ty-section-head {
            grid-template-columns: 1fr;
          }

          .bw-thank-you .bw-ty-hero-grid {
            gap: 34px;
          }

          .bw-thank-you h1 {
            font-size: 42px;
          }

          .bw-thank-you .bw-ty-steps,
          .bw-thank-you .bw-ty-links {
            grid-template-columns: 1fr;
          }

          .bw-thank-you .bw-ty-step,
          .bw-thank-you .bw-ty-link-card {
            min-height: auto;
          }
        }

        @media (max-width: 560px) {
          .bw-thank-you .bw-ty-inner {
            padding: 0 18px;
          }

          .bw-thank-you .bw-ty-hero {
            padding: 38px 0 34px;
          }

          .bw-thank-you h1 {
            font-size: 34px;
            line-height: 1.06;
          }

          .bw-thank-you .bw-ty-lead {
            font-size: 16px;
          }

          .bw-thank-you .bw-ty-actions {
            align-items: stretch;
            flex-direction: column;
          }

          .bw-thank-you .bw-ty-btn {
            width: 100%;
          }

          .bw-thank-you .bw-ty-inbox-note {
            grid-template-columns: 1fr;
          }

          .bw-thank-you .bw-ty-pass-body {
            padding: 20px 20px 22px;
          }

          .bw-thank-you .bw-ty-fact {
            gap: 6px;
            grid-template-columns: 1fr;
          }

          .bw-thank-you .bw-ty-section-head h2 {
            font-size: 28px;
          }

          .bw-thank-you .bw-ty-next {
            padding: 36px 0;
          }

          .bw-thank-you .bw-ty-plan {
            padding: 36px 0 44px;
          }
        }
      </style>

      <section class="bw-thank-you" aria-labelledby="bw-ty-title">
        <div class="bw-ty-hero">
          <div class="bw-ty-inner bw-ty-hero-grid">
            <div data-bw-ty-reveal>
              <span class="bw-ty-eyebrow">Booking confirmed</span>
              <h1 id="bw-ty-title">You are booked. See you at the <span class="bw-ty-highlight">World Clock.</span></h1>
              <p class="bw-ty-lead">Thank you for reserving your spot on BerlinWalk. Your confirmation email is on its way with the date, time, and booking details. I am looking forward to walking Berlin with you.</p>
              <div class="bw-ty-actions" aria-label="Useful tour-day links">
                <a class="bw-ty-btn bw-ty-btn-primary" href="${BW_THANK_YOU_MAPS_URL}" target="_blank" rel="noopener">Open meeting point map</a>
                <a class="bw-ty-btn bw-ty-btn-secondary" href="${BW_THANK_YOU_MEETING_POINT_URL}">View meeting point guide</a>
              </div>
              <div class="bw-ty-inbox-note">
                <span class="bw-ty-inbox-mark">OK</span>
                <div>
                  <strong>Check your inbox before the tour.</strong>
                  <p>The confirmation email carries the practical booking details. If you have a question, reply to that email and I will see it there.</p>
                </div>
              </div>
            </div>

            <aside class="bw-ty-pass" aria-label="Tour day details" data-bw-ty-reveal>
              <div class="bw-ty-pass-top">
                <span>Tour day card</span>
                <span>BerlinWalk</span>
              </div>
              <figure>
                <img src="${BW_THANK_YOU_IMAGE_URL}" alt="Alexanderplatz World Clock, the BerlinWalk meeting point" loading="eager" decoding="async" onerror="this.onerror=null;this.src='${BW_THANK_YOU_IMAGE_FALLBACK_URL}';">
                <figcaption class="bw-ty-photo-badge">World Clock, Alexanderplatz</figcaption>
              </figure>
              <div class="bw-ty-pass-body">
                <h2>Meet me here.</h2>
                <p class="bw-ty-pass-copy">The walk starts at the large rotating World Clock in the middle of Alexanderplatz.</p>
                <dl class="bw-ty-facts">
                  <div class="bw-ty-fact">
                    <dt>Look for</dt>
                    <dd>BerlinWalk guide with a green umbrella</dd>
                  </div>
                  <div class="bw-ty-fact">
                    <dt>Arrive</dt>
                    <dd>5 minutes early, so the group can leave on time</dd>
                  </div>
                  <div class="bw-ty-fact">
                    <dt>Walk</dt>
                    <dd>About 2 hours, ending near Hackescher Markt</dd>
                  </div>
                </dl>
              </div>
            </aside>
          </div>
        </div>

        <section class="bw-ty-next" aria-labelledby="bw-ty-next-title">
          <div class="bw-ty-inner">
            <div class="bw-ty-section-head" data-bw-ty-reveal>
              <h2 id="bw-ty-next-title">Your next 3 steps</h2>
              <p>Keep it simple: save the place, check the email, and arrive calm.</p>
            </div>
            <ol class="bw-ty-steps">
              <li class="bw-ty-step" data-bw-ty-reveal>
                <h3>Save the meeting point</h3>
                <p>Open the map now and keep the World Clock pinned. Alexanderplatz station is large, but the landmark is easy to find once you are on the square.</p>
              </li>
              <li class="bw-ty-step" data-bw-ty-reveal>
                <h3>Use the confirmation email</h3>
                <p>The email is your booking reference. It includes the practical details and the easiest place to reply if something changes.</p>
              </li>
              <li class="bw-ty-step" data-bw-ty-reveal>
                <h3>Come ready to walk</h3>
                <p>Wear comfortable shoes, check the weather, and bring curiosity. The tour is free to book and tip-based at the end.</p>
              </li>
            </ol>
          </div>
        </section>

        <section class="bw-ty-plan" aria-labelledby="bw-ty-plan-title">
          <div class="bw-ty-inner">
            <div class="bw-ty-section-head" data-bw-ty-reveal>
              <h2 id="bw-ty-plan-title">Plan the rest of your Berlin day</h2>
              <p>Since your tour spot is sorted, these are the most useful BerlinWalk tools to check before you arrive.</p>
            </div>
            <div class="bw-ty-links">
              <a class="bw-ty-link-card" href="${BW_THANK_YOU_TRANSPORT_URL}" data-bw-ty-reveal>
                <span class="bw-ty-link-kicker">Tickets</span>
                <h3>Which transport ticket do you need?</h3>
                <p>Compare Berlin AB, ABC, day tickets, and WelcomeCard logic before you ride to Alexanderplatz.</p>
                <span class="bw-ty-link-action">Open tool</span>
              </a>
              <a class="bw-ty-link-card" href="${BW_THANK_YOU_TODAY_URL}" data-bw-ty-reveal>
                <span class="bw-ty-link-kicker">Today</span>
                <h3>What is open in Berlin today?</h3>
                <p>Quickly check Sundays, public holidays, supermarkets, museums, transport, and practical services.</p>
                <span class="bw-ty-link-action">Check today</span>
              </a>
              <a class="bw-ty-link-card" href="${BW_THANK_YOU_TOOLS_URL}" data-bw-ty-reveal>
                <span class="bw-ty-link-kicker">Planning</span>
                <h3>Use the Berlin planning tools</h3>
                <p>Weather, budget, luggage, toilets, free things to do, and practical maps for your trip.</p>
                <span class="bw-ty-link-action">Explore tools</span>
              </a>
            </div>
          </div>
        </section>
      </section>
    `;
  }

}

if (!customElements.get('bw-thank-you')) {
  customElements.define('bw-thank-you', BWThankYouElement);
}
