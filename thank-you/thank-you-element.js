const BW_THANK_YOU_MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Weltzeituhr%20Alexanderplatz%20Berlin';
const BW_THANK_YOU_MEETING_POINT_URL = 'https://www.berlinwalk.com/meeting-point';
const BW_THANK_YOU_TOOLS_URL = 'https://www.berlinwalk.com/berlin-tools';
const BW_THANK_YOU_TRANSPORT_URL = 'https://www.berlinwalk.com/tools/transport-ticket-calculator';
const BW_THANK_YOU_TODAY_URL = 'https://www.berlinwalk.com/tools/whats-open-in-berlin-today';
const BW_THANK_YOU_IMAGE_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/gallery/images/06-1200w.webp';
const BW_THANK_YOU_IMAGE_FALLBACK_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/gallery/images/06-1200w.jpg';
const BW_THANK_YOU_CALENDAR = {
  title: 'BerlinWalk Free Walking Tour',
  location: 'World Clock, Alexanderplatz, 10178 Berlin, Germany',
  timezone: 'Europe/Berlin',
  durationMinutes: 120,
  details: [
    'Your BerlinWalk spot is booked.',
    'Meeting point: World Clock, Alexanderplatz.',
    'Look for the BerlinWalk guide with a green umbrella.',
    'Please arrive 5 minutes early.',
    BW_THANK_YOU_MEETING_POINT_URL
  ].join('\n')
};

class BWThankYouElement extends HTMLElement {
  connectedCallback() {
    document.body.classList.add('bw-thank-you-page-active');
    this._render();
    this._syncCalendarLinksFromPage();
    this._startWixConfirmationHide();
  }

  disconnectedCallback() {
    document.body.classList.remove('bw-thank-you-page-active');
    if (this._bookingObserver) this._bookingObserver.disconnect();
    if (this._hideTimers) this._hideTimers.forEach((timer) => window.clearTimeout(timer));
  }

  _render() {
    this.innerHTML = `
      <style>
        bw-thank-you {
          display: block;
          width: 100%;
        }

        body.bw-thank-you-page-active #bw-sticky-cta,
        body.bw-thank-you-page-active #bw-desktop-cta,
        body.bw-thank-you-page-active #thankYouPage1 {
          display: none !important;
          height: 0 !important;
          margin: 0 !important;
          min-height: 0 !important;
          overflow: hidden !important;
          padding: 0 !important;
          visibility: hidden !important;
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

        .bw-thank-you .bw-ty-calendar[hidden] {
          display: none !important;
        }

        .bw-thank-you .bw-ty-calendar {
          align-items: center;
          background: var(--green-dark);
          border: 1px solid rgba(197, 225, 165, 0.34);
          border-radius: 8px;
          box-shadow: 0 18px 42px rgba(16, 36, 20, 0.18);
          color: #FFFFFF;
          display: grid;
          gap: 18px;
          grid-template-columns: minmax(0, 1fr) auto;
          margin-top: 16px;
          max-width: 650px;
          padding: 18px 20px;
        }

        .bw-thank-you .bw-ty-calendar-kicker {
          color: var(--yellow);
          display: block;
          font-size: 11px;
          font-weight: 800;
          line-height: 1.35;
          margin-bottom: 5px;
          text-transform: uppercase;
        }

        .bw-thank-you .bw-ty-calendar strong {
          display: block;
          font-size: 16px;
          font-weight: 800;
          line-height: 1.35;
          margin-bottom: 4px;
        }

        .bw-thank-you .bw-ty-calendar p {
          color: rgba(255, 255, 255, 0.78);
          font-family: var(--serif);
          font-size: 14px;
          line-height: 1.55;
          margin-bottom: 0;
        }

        .bw-thank-you .bw-ty-calendar-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: flex-end;
        }

        .bw-thank-you .bw-ty-calendar-actions .bw-ty-btn {
          min-height: 42px;
          padding: 12px 16px;
          white-space: nowrap;
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

          .bw-thank-you .bw-ty-calendar {
            align-items: stretch;
            grid-template-columns: 1fr;
          }

          .bw-thank-you .bw-ty-calendar-actions {
            flex-direction: column;
          }

          .bw-thank-you .bw-ty-calendar-actions .bw-ty-btn {
            width: 100%;
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
              <div class="bw-ty-calendar" data-bw-ty-calendar hidden aria-live="polite">
                <div>
                  <span class="bw-ty-calendar-kicker">Add to calendar</span>
                  <strong>Save your tour time</strong>
                  <p data-bw-ty-calendar-copy></p>
                </div>
                <div class="bw-ty-calendar-actions" aria-label="Calendar links">
                  <a class="bw-ty-btn bw-ty-btn-secondary" data-bw-ty-calendar-google href="#" target="_blank" rel="noopener">Google Calendar</a>
                  <a class="bw-ty-btn bw-ty-btn-primary" data-bw-ty-calendar-ics href="#" download="berlinwalk-tour.ics">Apple / Outlook</a>
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

  _startWixConfirmationHide() {
    const hide = () => this._hideWixBookingConfirmation();
    hide();
    this._hideTimers = [250, 800, 1600, 3200, 5200].map((delay) => window.setTimeout(hide, delay));
    if (!document.body || !('MutationObserver' in window)) return;
    this._bookingObserver = new MutationObserver(() => hide());
    this._bookingObserver.observe(document.body, { childList: true, subtree: true });
  }

  _hideWixBookingConfirmation() {
    this._syncCalendarLinksFromPage();

    const targets = new Set();
    const directSelectors = [
      '#thankYouPage1',
      '[data-testid="thankYouPage1"]',
      '[data-hook="thankYouPage1"]',
      '[aria-label="Thank You Page"]',
      '[aria-label="Booking Confirmation"]'
    ];

    directSelectors.forEach((selector) => {
      try {
        document.querySelectorAll(selector).forEach((node) => {
          if (!this.contains(node)) targets.add(this._findWixHideTarget(node) || node);
        });
      } catch (error) {
        // Ignore selector support differences in Wix/editor contexts.
      }
    });

    document.querySelectorAll('h1, h2, h3, [role="heading"], p, span, div').forEach((node) => {
      if (this.contains(node)) return;
      if ((node.textContent || '').trim() !== 'Booking Confirmation') return;
      const target = this._findWixHideTarget(node);
      if (target) targets.add(target);
    });

    targets.forEach((target) => {
      if (!target || target === document.body || target === document.documentElement || this.contains(target)) return;
      target.setAttribute('aria-hidden', 'true');
      target.style.setProperty('display', 'none', 'important');
      target.style.setProperty('height', '0', 'important');
      target.style.setProperty('min-height', '0', 'important');
      target.style.setProperty('margin', '0', 'important');
      target.style.setProperty('padding', '0', 'important');
      target.style.setProperty('overflow', 'hidden', 'important');
      target.style.setProperty('visibility', 'hidden', 'important');
    });
  }

  _syncCalendarLinksFromPage() {
    if (this._calendarReady) return;
    const booking = this._getCalendarBookingDetails();
    if (!booking) return;
    this._calendarReady = true;
    this._renderCalendarLinks(booking);
  }

  _getCalendarBookingDetails() {
    const attributeBooking = this._getCalendarBookingFromAttributes();
    if (attributeBooking) return attributeBooking;

    const candidates = [];
    const directSelectors = [
      '#thankYouPage1',
      '[data-testid="thankYouPage1"]',
      '[data-hook="thankYouPage1"]',
      '[aria-label="Thank You Page"]',
      '[aria-label="Booking Confirmation"]'
    ];

    directSelectors.forEach((selector) => {
      try {
        document.querySelectorAll(selector).forEach((node) => {
          if (!this.contains(node)) candidates.push(node);
        });
      } catch (error) {
        // Ignore selector support differences in Wix/editor contexts.
      }
    });

    document.querySelectorAll('h1, h2, h3, [role="heading"], p, span, div').forEach((node) => {
      if (this.contains(node)) return;
      if ((node.textContent || '').trim() !== 'Booking Confirmation') return;
      const target = this._findWixHideTarget(node);
      if (target) candidates.push(target);
    });

    for (const candidate of candidates) {
      const text = this._getReadableText(candidate);
      const parsed = this._parseBookingDateTime(text);
      if (parsed) return this._createCalendarBooking(parsed);
    }

    return null;
  }

  _getCalendarBookingFromAttributes() {
    const startRaw =
      this.getAttribute('tour-start') ||
      this.getAttribute('data-tour-start') ||
      this.getAttribute('datetime') ||
      this.getAttribute('date-time') ||
      this.getAttribute('data-date-time');
    if (!startRaw) return null;

    const start = this._parseBookingDateTime(startRaw);
    if (!start) return null;

    const endRaw = this.getAttribute('tour-end') || this.getAttribute('data-tour-end');
    const end = endRaw ? this._parseBookingDateTime(endRaw) : null;
    return this._createCalendarBooking(start, end);
  }

  _createCalendarBooking(start, end) {
    return {
      title: BW_THANK_YOU_CALENDAR.title,
      location: BW_THANK_YOU_CALENDAR.location,
      timezone: BW_THANK_YOU_CALENDAR.timezone,
      details: BW_THANK_YOU_CALENDAR.details,
      start,
      end: end || this._addMinutesToDateParts(start, BW_THANK_YOU_CALENDAR.durationMinutes)
    };
  }

  _renderCalendarLinks(booking) {
    const calendar = this.querySelector('[data-bw-ty-calendar]');
    if (!calendar) return;

    const google = calendar.querySelector('[data-bw-ty-calendar-google]');
    const ics = calendar.querySelector('[data-bw-ty-calendar-ics]');
    const copy = calendar.querySelector('[data-bw-ty-calendar-copy]');
    const displayDate = this._formatDisplayDate(booking.start);

    if (copy) copy.textContent = `${booking.title} - ${displayDate}`;
    if (google) google.href = this._buildGoogleCalendarUrl(booking);
    if (ics) {
      ics.href = this._buildIcsDataUrl(booking);
      ics.setAttribute('download', `berlinwalk-tour-${this._formatCompactDate(booking.start).toLowerCase()}.ics`);
    }

    calendar.hidden = false;
  }

  _parseBookingDateTime(value) {
    const text = this._normalizeBookingText(value);
    if (!text) return null;

    const iso = text.match(/\b(\d{4})-(\d{1,2})-(\d{1,2})(?:t|\s+)(\d{1,2}):(\d{2})\b/i);
    if (iso) {
      return this._buildDateParts(iso[1], iso[2], iso[3], iso[4], iso[5]);
    }

    const monthName = '(jan(?:uary|uar)?|feb(?:ruary|ruar)?|maerz|mar(?:ch|z)?|apr(?:il)?|may|mai|jun(?:e|i)?|jul(?:y|i)?|aug(?:ust)?|sep(?:t|tember)?|oct(?:ober)?|okt(?:ober)?|nov(?:ember)?|dec(?:ember)?|dez(?:ember)?)';
    const timePart = '(\\d{1,2})(?::(\\d{2}))?\\s*(am|pm)?';
    const afterDate = '(?:,?\\s*(?:at|um)?\\s*)';

    const monthFirst = new RegExp(`\\b${monthName}\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?\\.?[,]?\\s+(\\d{4})${afterDate}${timePart}\\b`, 'i');
    const monthFirstMatch = text.match(monthFirst);
    if (monthFirstMatch) {
      return this._buildDateParts(
        monthFirstMatch[3],
        this._monthNumber(monthFirstMatch[1]),
        monthFirstMatch[2],
        monthFirstMatch[4],
        monthFirstMatch[5] || '0',
        monthFirstMatch[6]
      );
    }

    const dayFirst = new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)?\\.?\\s+${monthName}\\.?[,]?\\s+(\\d{4})${afterDate}${timePart}\\b`, 'i');
    const dayFirstMatch = text.match(dayFirst);
    if (dayFirstMatch) {
      return this._buildDateParts(
        dayFirstMatch[3],
        this._monthNumber(dayFirstMatch[2]),
        dayFirstMatch[1],
        dayFirstMatch[4],
        dayFirstMatch[5] || '0',
        dayFirstMatch[6]
      );
    }

    const numeric = new RegExp(`\\b(\\d{1,2})[./-](\\d{1,2})[./-](\\d{4})${afterDate}${timePart}\\b`, 'i');
    const numericMatch = text.match(numeric);
    if (numericMatch) {
      const first = Number(numericMatch[1]);
      const second = Number(numericMatch[2]);
      const month = first > 12 ? second : second > 12 ? first : second;
      const day = first > 12 ? first : second > 12 ? second : first;

      return this._buildDateParts(
        numericMatch[3],
        month,
        day,
        numericMatch[4],
        numericMatch[5] || '0',
        numericMatch[6]
      );
    }

    return null;
  }

  _normalizeBookingText(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\u00a0\u200b-\u200d\ufeff]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  _getReadableText(node) {
    if (!node) return '';
    const parts = [];

    const read = (current) => {
      if (!current) return;
      if (current.nodeType === 3) {
        parts.push(current.textContent || '');
        return;
      }
      if (current.nodeType !== 1) return;
      Array.from(current.childNodes || []).forEach(read);
      parts.push(' ');
    };

    read(node);
    return this._normalizeBookingText(parts.join(' '));
  }

  _monthNumber(value) {
    const key = this._normalizeBookingText(value).toLowerCase().replace(/\./g, '');
    const months = {
      jan: 1,
      january: 1,
      januar: 1,
      feb: 2,
      february: 2,
      februar: 2,
      mar: 3,
      march: 3,
      marz: 3,
      maerz: 3,
      apr: 4,
      april: 4,
      may: 5,
      mai: 5,
      jun: 6,
      june: 6,
      juni: 6,
      jul: 7,
      july: 7,
      juli: 7,
      aug: 8,
      august: 8,
      sep: 9,
      sept: 9,
      september: 9,
      oct: 10,
      october: 10,
      okt: 10,
      oktober: 10,
      nov: 11,
      november: 11,
      dec: 12,
      december: 12,
      dez: 12,
      dezember: 12
    };
    return months[key] || null;
  }

  _buildDateParts(year, month, day, hour, minute, period) {
    const result = {
      year: Number(year),
      month: Number(month),
      day: Number(day),
      hour: Number(hour),
      minute: Number(minute || 0)
    };

    const normalizedPeriod = String(period || '').toLowerCase();
    if (normalizedPeriod === 'pm' && result.hour < 12) result.hour += 12;
    if (normalizedPeriod === 'am' && result.hour === 12) result.hour = 0;

    if (!this._isValidDateParts(result)) return null;
    return result;
  }

  _isValidDateParts(parts) {
    if (!parts) return false;
    if (parts.year < 2020 || parts.year > 2100) return false;
    if (parts.month < 1 || parts.month > 12) return false;
    if (parts.hour < 0 || parts.hour > 23) return false;
    if (parts.minute < 0 || parts.minute > 59) return false;

    const daysInMonth = new Date(Date.UTC(parts.year, parts.month, 0)).getUTCDate();
    return parts.day >= 1 && parts.day <= daysInMonth;
  }

  _addMinutesToDateParts(parts, minutes) {
    const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute + minutes));
    return {
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      day: date.getUTCDate(),
      hour: date.getUTCHours(),
      minute: date.getUTCMinutes()
    };
  }

  _formatDisplayDate(parts) {
    const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
    const dateLabel = new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC'
    }).format(date);
    return `${dateLabel} at ${this._pad(parts.hour)}:${this._pad(parts.minute)}`;
  }

  _formatCompactDate(parts) {
    return `${parts.year}${this._pad(parts.month)}${this._pad(parts.day)}T${this._pad(parts.hour)}${this._pad(parts.minute)}00`;
  }

  _buildGoogleCalendarUrl(booking) {
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: booking.title,
      dates: `${this._formatCompactDate(booking.start)}/${this._formatCompactDate(booking.end)}`,
      ctz: booking.timezone,
      details: booking.details,
      location: booking.location
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  _buildIcsDataUrl(booking) {
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//BerlinWalk//Thank You Page//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:berlinwalk-${this._formatCompactDate(booking.start).toLowerCase()}@berlinwalk.com`,
      `DTSTAMP:${timestamp}`,
      `DTSTART;TZID=${booking.timezone}:${this._formatCompactDate(booking.start)}`,
      `DTEND;TZID=${booking.timezone}:${this._formatCompactDate(booking.end)}`,
      `SUMMARY:${this._escapeIcsText(booking.title)}`,
      `LOCATION:${this._escapeIcsText(booking.location)}`,
      `DESCRIPTION:${this._escapeIcsText(booking.details)}`,
      `URL:${BW_THANK_YOU_MEETING_POINT_URL}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ];

    return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.map((line) => this._foldIcsLine(line)).join('\r\n'))}`;
  }

  _escapeIcsText(value) {
    return String(value || '')
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;');
  }

  _foldIcsLine(line) {
    return String(line).replace(/(.{73})/g, '$1\r\n ');
  }

  _pad(value) {
    return String(value).padStart(2, '0');
  }

  _findWixHideTarget(node) {
    let current = node;
    let best = node;
    let depth = 0;

    while (current && current !== document.body && depth < 9) {
      if (current !== node && current.querySelector && current.querySelector('bw-thank-you')) break;
      if (this.contains(current)) return null;

      const rect = current.getBoundingClientRect ? current.getBoundingClientRect() : { width: 0, height: 0 };
      const id = current.id || '';
      const className = typeof current.className === 'string' ? current.className : '';
      const tagName = current.tagName ? current.tagName.toLowerCase() : '';
      const isLikelySection =
        id === 'thankYouPage1' ||
        id.indexOf('thankYouPage') !== -1 ||
        className.indexOf('thankYouPage') !== -1 ||
        tagName === 'section';

      if (rect.width > 280 && rect.height > 90) best = current;
      if (isLikelySection && rect.height > 90) best = current;

      current = current.parentElement;
      depth++;
    }

    return best;
  }
}

if (!customElements.get('bw-thank-you')) {
  customElements.define('bw-thank-you', BWThankYouElement);
}
