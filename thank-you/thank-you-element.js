const BW_THANK_YOU_MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Weltzeituhr%20Alexanderplatz%20Berlin';
const BW_THANK_YOU_MEETING_POINT_URL = 'https://www.berlinwalk.com/meeting-point';
const BW_THANK_YOU_TOOLS_URL = 'https://www.berlinwalk.com/berlin-tools';
const BW_THANK_YOU_TRANSPORT_URL = 'https://www.berlinwalk.com/tools/transport-ticket-calculator';
const BW_THANK_YOU_TODAY_URL = 'https://www.berlinwalk.com/tools/whats-open-in-berlin-today';
const BW_THANK_YOU_IMAGE_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/gallery/images/06-1200w.webp';
const BW_THANK_YOU_IMAGE_FALLBACK_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/gallery/images/06-1200w.jpg';
const BW_THANK_YOU_MAP_TILES = [
  'https://tile.openstreetmap.org/16/35209/21491.png',
  'https://tile.openstreetmap.org/16/35210/21491.png',
  'https://tile.openstreetmap.org/16/35209/21492.png',
  'https://tile.openstreetmap.org/16/35210/21492.png'
];
const BW_THANK_YOU_WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';
const BW_THANK_YOU_WEATHER_COORDS = {
  latitude: 52.521918,
  longitude: 13.413215
};
const BW_THANK_YOU_FORECAST_DAYS = 16;
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
    this._setupInteractionTracking();
    this._syncCalendarLinksFromPage();
    this._syncTourDayAssistantFromPage();
    this._syncManageBookingLinkFromPage();
    this._startWixConfirmationHide();
  }

  disconnectedCallback() {
    document.body.classList.remove('bw-thank-you-page-active');
    if (this._bookingObserver) this._bookingObserver.disconnect();
    if (this._hideTimers) this._hideTimers.forEach((timer) => window.clearTimeout(timer));
    if (this._countdownTimer) window.clearInterval(this._countdownTimer);
    if (this._forecastAbortController) this._forecastAbortController.abort();
    if (this._trackClickHandler) this.removeEventListener('click', this._trackClickHandler);
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
        .bw-thank-you strong,
        .bw-thank-you figure,
        .bw-thank-you ol,
        .bw-thank-you dl,
        .bw-thank-you dd {
          margin-top: 0;
          overflow-wrap: break-word;
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

        .bw-thank-you .bw-ty-hero-grid > *,
        .bw-thank-you .bw-ty-section-head > *,
        .bw-thank-you .bw-ty-assistant-card,
        .bw-thank-you .bw-ty-step,
        .bw-thank-you .bw-ty-link-card {
          min-width: 0;
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

        .bw-thank-you .bw-ty-change {
          align-items: center;
          background: #FFFFFF;
          border: 1px solid rgba(27, 94, 32, 0.16);
          border-left: 6px solid var(--green);
          box-shadow: 0 12px 28px rgba(27, 94, 32, 0.1);
          display: grid;
          gap: 16px;
          grid-template-columns: minmax(0, 1fr) auto;
          margin-top: 16px;
          max-width: 650px;
          padding: 17px 18px;
        }

        .bw-thank-you .bw-ty-change-kicker {
          color: var(--green);
          display: block;
          font-size: 11px;
          font-weight: 800;
          line-height: 1.35;
          margin-bottom: 5px;
          text-transform: uppercase;
        }

        .bw-thank-you .bw-ty-change strong {
          color: var(--green);
          display: block;
          font-size: 16px;
          font-weight: 800;
          line-height: 1.35;
          margin-bottom: 4px;
        }

        .bw-thank-you .bw-ty-change p {
          color: var(--muted);
          font-size: 14px;
          line-height: 1.55;
          margin-bottom: 0;
        }

        .bw-thank-you .bw-ty-change .bw-ty-btn {
          min-height: 42px;
          padding: 12px 16px;
          white-space: nowrap;
        }

        .bw-thank-you .bw-ty-change .bw-ty-btn[hidden] {
          display: none !important;
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

        .bw-thank-you .bw-ty-assistant {
          background:
            linear-gradient(180deg, #FFFFFF 0%, #F8FBF2 100%);
          border-top: 1px solid rgba(27, 94, 32, 0.13);
          color: var(--text);
          padding: 44px 0;
        }

        .bw-thank-you .bw-ty-assistant .bw-ty-section-head {
          color: var(--text);
        }

        .bw-thank-you .bw-ty-assistant .bw-ty-section-head p {
          color: var(--muted);
        }

        .bw-thank-you .bw-ty-assistant-grid {
          align-items: stretch;
          display: grid;
          gap: 14px;
          grid-template-columns: minmax(230px, 0.7fr) minmax(0, 1fr) minmax(280px, 1fr);
        }

        .bw-thank-you .bw-ty-assistant-card {
          background: #FFFFFF;
          border: 1px solid rgba(27, 94, 32, 0.16);
          border-radius: 8px;
          box-shadow: 0 16px 34px rgba(27, 94, 32, 0.09);
          min-height: 260px;
          overflow: hidden;
          padding: 22px;
          position: relative;
        }

        .bw-thank-you .bw-ty-assistant-card::before {
          background: var(--yellow);
          content: "";
          height: 5px;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
        }

        .bw-thank-you .bw-ty-card-kicker {
          color: var(--green);
          display: block;
          font-size: 11px;
          font-weight: 800;
          line-height: 1.35;
          margin-bottom: 13px;
          text-transform: uppercase;
        }

        .bw-thank-you .bw-ty-assistant-card h3 {
          color: var(--green);
          font-size: 23px;
          font-weight: 800;
          letter-spacing: 0;
          line-height: 1.12;
          margin-bottom: 10px;
        }

        .bw-thank-you .bw-ty-assistant-card p {
          color: var(--muted);
          font-size: 14px;
          line-height: 1.58;
          margin-bottom: 0;
        }

        .bw-thank-you .bw-ty-countdown-value {
          color: var(--green);
          display: block;
          font-size: 31px;
          font-weight: 800;
          line-height: 1.02;
          margin-bottom: 10px;
        }

        .bw-thank-you .bw-ty-countdown-date {
          border-top: 1px solid rgba(27, 94, 32, 0.16);
          color: var(--green);
          display: block;
          font-size: 12px;
          font-weight: 800;
          line-height: 1.4;
          margin-top: 18px;
          padding-top: 14px;
          text-transform: uppercase;
        }

        .bw-thank-you .bw-ty-weather-metrics {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin: 18px 0;
        }

        .bw-thank-you .bw-ty-weather-metrics[hidden],
        .bw-thank-you .bw-ty-outfit[hidden] {
          display: none !important;
        }

        .bw-thank-you .bw-ty-weather-metric {
          background: #F5F8EF;
          border: 1px solid rgba(197, 225, 165, 0.7);
          border-radius: 8px;
          min-height: 78px;
          padding: 12px;
        }

        .bw-thank-you .bw-ty-weather-metric span {
          color: var(--muted);
          display: block;
          font-size: 10px;
          font-weight: 800;
          line-height: 1.35;
          margin-bottom: 7px;
          text-transform: uppercase;
        }

        .bw-thank-you .bw-ty-weather-metric strong {
          color: var(--green);
          display: block;
          font-size: 19px;
          font-weight: 800;
          line-height: 1.1;
        }

        .bw-thank-you .bw-ty-outfit {
          background: var(--green-dark);
          border-left: 6px solid var(--yellow);
          border-radius: 8px;
          color: #FFFFFF;
          padding: 16px 17px;
        }

        .bw-thank-you .bw-ty-outfit strong {
          color: var(--yellow);
          display: block;
          font-size: 13px;
          font-weight: 800;
          line-height: 1.35;
          margin-bottom: 7px;
          text-transform: uppercase;
        }

        .bw-thank-you .bw-ty-outfit p {
          color: rgba(255, 255, 255, 0.82);
          font-size: 14px;
          line-height: 1.55;
        }

        .bw-thank-you .bw-ty-map-card {
          display: grid;
          gap: 15px;
          grid-template-rows: auto minmax(180px, 1fr) auto;
          padding: 22px;
        }

        .bw-thank-you .bw-ty-map-frame {
          aspect-ratio: 4 / 3;
          background: #E8F0E0;
          border-radius: 8px;
          display: block;
          min-height: 190px;
          overflow: hidden;
          position: relative;
          width: 100%;
        }

        .bw-thank-you .bw-ty-map-tile-grid {
          aspect-ratio: 1 / 1;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          grid-template-rows: repeat(2, minmax(0, 1fr));
          left: 0;
          position: absolute;
          top: -18%;
          width: 100%;
        }

        .bw-thank-you .bw-ty-map-tile-grid img {
          display: block;
          height: 100%;
          object-fit: cover;
          width: 100%;
        }

        .bw-thank-you .bw-ty-map-pin {
          background: var(--green);
          border: 4px solid var(--yellow);
          border-radius: 999px;
          box-shadow: 0 8px 18px rgba(16, 36, 20, 0.35);
          height: 26px;
          left: 40%;
          position: absolute;
          top: 47%;
          transform: translate(-50%, -50%);
          width: 26px;
          z-index: 2;
        }

        .bw-thank-you .bw-ty-map-label {
          background: rgba(16, 36, 20, 0.9);
          border-left: 5px solid var(--yellow);
          bottom: 14px;
          color: #FFFFFF;
          font-size: 12px;
          font-weight: 800;
          left: 14px;
          line-height: 1.25;
          padding: 8px 10px;
          position: absolute;
          text-transform: uppercase;
          z-index: 2;
        }

        .bw-thank-you .bw-ty-map-credit {
          background: rgba(255, 255, 255, 0.88);
          bottom: 8px;
          color: var(--muted);
          font-size: 9px;
          font-weight: 700;
          line-height: 1.2;
          padding: 4px 6px;
          position: absolute;
          right: 8px;
          z-index: 2;
        }

        .bw-thank-you .bw-ty-map-card .bw-ty-btn {
          justify-self: start;
          min-height: 42px;
          padding: 12px 16px;
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
          .bw-thank-you .bw-ty-links,
          .bw-thank-you .bw-ty-assistant-grid {
            grid-template-columns: 1fr;
          }

          .bw-thank-you .bw-ty-step,
          .bw-thank-you .bw-ty-link-card,
          .bw-thank-you .bw-ty-assistant-card {
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

          .bw-thank-you .bw-ty-change {
            align-items: stretch;
            grid-template-columns: 1fr;
          }

          .bw-thank-you .bw-ty-calendar-actions {
            flex-direction: column;
          }

          .bw-thank-you .bw-ty-calendar-actions .bw-ty-btn {
            width: 100%;
          }

          .bw-thank-you .bw-ty-change .bw-ty-btn {
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

          .bw-thank-you .bw-ty-weather-metrics {
            grid-template-columns: 1fr;
          }

          .bw-thank-you .bw-ty-map-card .bw-ty-btn {
            width: 100%;
          }

          .bw-thank-you .bw-ty-next {
            padding: 36px 0;
          }

          .bw-thank-you .bw-ty-assistant {
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
                <a class="bw-ty-btn bw-ty-btn-primary" href="${BW_THANK_YOU_MAPS_URL}" target="_blank" rel="noopener" data-bw-ty-event="directions_clicked">Open meeting point map</a>
                <a class="bw-ty-btn bw-ty-btn-secondary" href="${BW_THANK_YOU_MEETING_POINT_URL}" data-bw-ty-event="meeting_guide_clicked">View meeting point guide</a>
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
                  <a class="bw-ty-btn bw-ty-btn-secondary" data-bw-ty-calendar-google data-bw-ty-event="calendar_added" href="#" target="_blank" rel="noopener">Google Calendar</a>
                  <a class="bw-ty-btn bw-ty-btn-primary" data-bw-ty-calendar-ics data-bw-ty-event="calendar_added" href="#" download="berlinwalk-tour.ics">Apple / Outlook</a>
                </div>
              </div>
              <div class="bw-ty-change" data-bw-ty-change>
                <div>
                  <span class="bw-ty-change-kicker">Change of plans?</span>
                  <strong>Move or cancel your booking</strong>
                  <p data-bw-ty-change-copy>Use the change or cancel link in your confirmation email. That is the safest route because it is attached to your exact booking.</p>
                </div>
                <a class="bw-ty-btn bw-ty-btn-primary" data-bw-ty-manage-link data-bw-ty-event="manage_booking_clicked" href="#" target="_blank" rel="noopener" hidden>View or change booking</a>
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

        <section class="bw-ty-assistant" aria-labelledby="bw-ty-assistant-title" data-bw-ty-assistant>
          <div class="bw-ty-inner">
            <div class="bw-ty-section-head" data-bw-ty-reveal>
              <h2 id="bw-ty-assistant-title">Tour day assistant</h2>
              <p>Live forecast, what to wear, directions, and a countdown in one place before you leave for Alexanderplatz.</p>
            </div>
            <div class="bw-ty-assistant-grid">
              <article class="bw-ty-assistant-card" data-bw-ty-countdown-card data-bw-ty-reveal>
                <span class="bw-ty-card-kicker">Countdown</span>
                <strong class="bw-ty-countdown-value" data-bw-ty-countdown-value>Tour time loading</strong>
                <p data-bw-ty-countdown-copy>The live countdown appears here when Wix exposes your booking time.</p>
                <time class="bw-ty-countdown-date" data-bw-ty-countdown-date></time>
              </article>

              <article class="bw-ty-assistant-card" data-bw-ty-weather-card data-bw-ty-reveal aria-live="polite">
                <span class="bw-ty-card-kicker">Weather + what to wear</span>
                <h3 data-bw-ty-weather-title>Forecast appears here</h3>
                <p data-bw-ty-weather-status>Berlin weather loves suspense. Once your tour date is detected, this turns into a forecast and outfit note.</p>
                <div class="bw-ty-weather-metrics" data-bw-ty-weather-metrics hidden>
                  <div class="bw-ty-weather-metric">
                    <span>Feels like</span>
                    <strong data-bw-ty-weather-temp></strong>
                  </div>
                  <div class="bw-ty-weather-metric">
                    <span>Rain chance</span>
                    <strong data-bw-ty-weather-rain></strong>
                  </div>
                  <div class="bw-ty-weather-metric">
                    <span>Wind</span>
                    <strong data-bw-ty-weather-wind></strong>
                  </div>
                </div>
                <div class="bw-ty-outfit" data-bw-ty-outfit hidden>
                  <strong data-bw-ty-outfit-title>Wear this</strong>
                  <p data-bw-ty-outfit-copy></p>
                </div>
              </article>

              <article class="bw-ty-assistant-card bw-ty-map-card" data-bw-ty-map-card data-bw-ty-reveal>
                <div>
                  <span class="bw-ty-card-kicker">Meeting point map</span>
                  <h3>World Clock, Alexanderplatz</h3>
                  <p>Arrive 5 minutes early and look for the BerlinWalk guide with a green umbrella.</p>
                </div>
                <div class="bw-ty-map-frame" role="img" aria-label="Map to the World Clock at Alexanderplatz">
                  <div class="bw-ty-map-tile-grid" aria-hidden="true">
                    ${BW_THANK_YOU_MAP_TILES.map((tileUrl) => `<img src="${tileUrl}" alt="" loading="eager" decoding="async">`).join('')}
                  </div>
                  <span class="bw-ty-map-pin" aria-hidden="true"></span>
                  <span class="bw-ty-map-label">World Clock</span>
                  <span class="bw-ty-map-credit">Map data OpenStreetMap</span>
                </div>
                <a class="bw-ty-btn bw-ty-btn-primary" href="${BW_THANK_YOU_MAPS_URL}" target="_blank" rel="noopener" data-bw-ty-event="directions_clicked">Open in Google Maps</a>
              </article>
            </div>
          </div>
        </section>

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
              <a class="bw-ty-link-card" href="${BW_THANK_YOU_TRANSPORT_URL}" data-bw-ty-event="planning_tool_clicked" data-bw-ty-reveal>
                <span class="bw-ty-link-kicker">Tickets</span>
                <h3>Which transport ticket do you need?</h3>
                <p>Compare Berlin AB, ABC, day tickets, and WelcomeCard logic before you ride to Alexanderplatz.</p>
                <span class="bw-ty-link-action">Open tool</span>
              </a>
              <a class="bw-ty-link-card" href="${BW_THANK_YOU_TODAY_URL}" data-bw-ty-event="planning_tool_clicked" data-bw-ty-reveal>
                <span class="bw-ty-link-kicker">Today</span>
                <h3>What is open in Berlin today?</h3>
                <p>Quickly check Sundays, public holidays, supermarkets, museums, transport, and practical services.</p>
                <span class="bw-ty-link-action">Check today</span>
              </a>
              <a class="bw-ty-link-card" href="${BW_THANK_YOU_TOOLS_URL}" data-bw-ty-event="planning_tool_clicked" data-bw-ty-reveal>
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

  _setupInteractionTracking() {
    this._trackedEvents = this._trackedEvents || new Set();
    this._trackClickHandler = (event) => {
      const target = event.target && event.target.closest ? event.target.closest('[data-bw-ty-event]') : null;
      if (!target || !this.contains(target)) return;
      this._track(target.getAttribute('data-bw-ty-event'), {
        label: this._normalizeBookingText(target.textContent || '').slice(0, 90),
        href: target.getAttribute('href') || ''
      });
    };
    this.addEventListener('click', this._trackClickHandler);
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
    this._syncTourDayAssistantFromPage();
    this._syncManageBookingLinkFromPage();

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

  _syncManageBookingLinkFromPage() {
    if (this._manageBookingReady) return;
    const url = this._getManageBookingUrl();
    if (!url) return;
    this._manageBookingReady = true;
    this._renderManageBookingLink(url);
  }

  _getManageBookingUrl() {
    const attributeUrl =
      this.getAttribute('manage-booking-url') ||
      this.getAttribute('data-manage-booking-url') ||
      this.getAttribute('change-booking-url') ||
      this.getAttribute('data-change-booking-url');
    const normalizedAttributeUrl = this._normalizeManageBookingUrl(attributeUrl);
    if (normalizedAttributeUrl) return normalizedAttributeUrl;

    const candidates = this._getBookingConfirmationCandidates();
    const linkPattern = /(manage|change|modify|reschedule|cancel|view).{0,28}booking|booking.{0,28}(manage|change|modify|reschedule|cancel|view)|reschedule|cancel/i;
    const hrefPattern = /(manage|booking|bookings|reschedule|cancel)/i;

    for (const candidate of candidates) {
      const links = candidate.querySelectorAll ? Array.from(candidate.querySelectorAll('a[href]')) : [];
      for (const link of links) {
        const label = this._normalizeBookingText(link.textContent || link.getAttribute('aria-label') || '');
        const href = link.getAttribute('href') || '';
        if (!linkPattern.test(label) && !hrefPattern.test(href)) continue;
        const normalizedUrl = this._normalizeManageBookingUrl(href);
        if (normalizedUrl) return normalizedUrl;
      }
    }

    return null;
  }

  _getBookingConfirmationCandidates() {
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

    return candidates;
  }

  _normalizeManageBookingUrl(value) {
    const raw = String(value || '').trim();
    if (!raw || /^javascript:/i.test(raw) || /^mailto:/i.test(raw) || /^tel:/i.test(raw)) return null;

    try {
      const base = window.location && window.location.origin ? window.location.origin : 'https://www.berlinwalk.com';
      const url = new URL(raw, base);
      if (!/^https?:$/i.test(url.protocol)) return null;
      return url.href;
    } catch (error) {
      return null;
    }
  }

  _renderManageBookingLink(url) {
    const link = this.querySelector('[data-bw-ty-manage-link]');
    const copy = this.querySelector('[data-bw-ty-change-copy]');
    if (!link) return;

    link.href = url;
    link.hidden = false;
    if (copy) {
      copy.textContent = 'This opens the personal manage-booking link from Wix, so you can move or cancel the exact reservation without creating a duplicate.';
    }
  }

  _syncTourDayAssistantFromPage() {
    if (this._tourDayReady) return;
    const booking = this._getCalendarBookingDetails();
    if (!booking) return;
    this._tourDayReady = true;
    this._renderTourDayAssistant(booking);
  }

  _getCalendarBookingDetails() {
    if (this._bookingDetails) return this._bookingDetails;

    const attributeBooking = this._getCalendarBookingFromAttributes();
    if (attributeBooking) {
      this._bookingDetails = attributeBooking;
      return attributeBooking;
    }

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
      if (parsed) {
        this._bookingDetails = this._createCalendarBooking(parsed);
        return this._bookingDetails;
      }
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

  _renderTourDayAssistant(booking) {
    const dateEl = this.querySelector('[data-bw-ty-countdown-date]');
    if (dateEl) {
      dateEl.textContent = this._formatDisplayDate(booking.start);
      dateEl.setAttribute('datetime', this._formatLocalDateTime(booking.start));
    }

    this._startCountdown(booking);
    this._loadTourDayWeather(booking);
    this._trackOnce('tour_day_assistant_ready', {
      tour_date: this._formatForecastDay(booking.start)
    });
  }

  _startCountdown(booking) {
    if (this._countdownTimer) window.clearInterval(this._countdownTimer);

    const startDate = this._datePartsToTimeZoneDate(booking.start, booking.timezone);
    if (!startDate || Number.isNaN(startDate.getTime())) return;

    const update = () => this._renderCountdown(startDate, booking);
    update();
    this._countdownTimer = window.setInterval(update, 30000);
  }

  _renderCountdown(startDate, booking) {
    const value = this.querySelector('[data-bw-ty-countdown-value]');
    const copy = this.querySelector('[data-bw-ty-countdown-copy]');
    if (!value || !copy) return;

    const now = Date.now();
    const diffMs = startDate.getTime() - now;
    const durationMs = BW_THANK_YOU_CALENDAR.durationMinutes * 60 * 1000;

    if (diffMs <= -durationMs) {
      value.textContent = 'Tour time passed';
      copy.textContent = 'If your plans changed, use the confirmation email as the easiest reply point.';
      if (this._countdownTimer) window.clearInterval(this._countdownTimer);
      return;
    }

    if (diffMs <= 0) {
      value.textContent = 'Head to the World Clock';
      copy.textContent = 'The tour is starting now. Look for the BerlinWalk guide with a green umbrella.';
      return;
    }

    const totalMinutes = Math.max(1, Math.ceil(diffMs / 60000));
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;
    const parts = [];

    if (days) parts.push(this._formatCountdownUnit(days, 'day'));
    if (hours || days) parts.push(this._formatCountdownUnit(hours, 'hour'));
    parts.push(this._formatCountdownUnit(minutes, 'minute'));

    value.textContent = parts.slice(0, 3).join(' ');
    copy.textContent =
      days > 0
        ? 'Check back closer to the tour for the sharpest weather call.'
        : 'Leave enough time for Alexanderplatz station and the short walk across the square.';

    if (booking && booking.start) {
      const dateEl = this.querySelector('[data-bw-ty-countdown-date]');
      if (dateEl) dateEl.textContent = this._formatDisplayDate(booking.start);
    }
  }

  _formatCountdownUnit(value, label) {
    return `${value} ${label}${value === 1 ? '' : 's'}`;
  }

  async _loadTourDayWeather(booking) {
    const weatherCard = this.querySelector('[data-bw-ty-weather-card]');
    if (!weatherCard) return;

    const daysUntilTour = this._daysFromTodayInBerlin(booking.start);
    if (daysUntilTour < -1) {
      this._renderWeatherFallback(
        'Tour date already passed',
        'The weather widget is built for the days before the walk. Use the meeting point map if you still need directions.',
        'Practical baseline',
        'Comfortable walking shoes and a layer you can remove are still the safest Berlin setup.'
      );
      return;
    }

    if (daysUntilTour > BW_THANK_YOU_FORECAST_DAYS - 1) {
      this._renderWeatherFallback(
        'Berlin weather is still thinking',
        `Your tour is too far out for a reliable forecast. Berlin weather has politely refused to make promises this early, so check back closer to the walk.`,
        'Early packing wisdom',
        'Plan for comfortable walking shoes, a light layer, and a small rain layer if your trip is in spring or autumn.'
      );
      this._trackOnce('weather_forecast_pending', {
        tour_date: this._formatForecastDay(booking.start),
        days_until_tour: daysUntilTour
      });
      return;
    }

    this._setWeatherLoading(booking);

    try {
      if (this._forecastAbortController) this._forecastAbortController.abort();
      this._forecastAbortController = 'AbortController' in window ? new AbortController() : null;

      const response = await fetch(this._buildWeatherUrl(), {
        signal: this._forecastAbortController ? this._forecastAbortController.signal : undefined
      });
      if (!response.ok) throw new Error(`Weather request failed: ${response.status}`);

      const data = await response.json();
      const forecast = this._extractTourForecast(data, booking);
      if (!forecast) throw new Error('No matching tour forecast');

      this._renderWeatherForecast(booking, forecast);
      this._trackOnce('weather_forecast_viewed', {
        tour_date: this._formatForecastDay(booking.start),
        rain_probability: forecast.rainProbability
      });
    } catch (error) {
      if (error && error.name === 'AbortError') return;
      this._renderWeatherFallback(
        'Weather check unavailable',
        'The live forecast could not load just now. The meeting point map and countdown still work.',
        'Safe walking setup',
        'Wear comfortable shoes and bring one layer you can add or remove. If the sky looks doubtful, pack a light rain jacket.'
      );
      this._trackOnce('weather_forecast_error', {
        tour_date: this._formatForecastDay(booking.start)
      });
    }
  }

  _setWeatherLoading(booking) {
    const title = this.querySelector('[data-bw-ty-weather-title]');
    const status = this.querySelector('[data-bw-ty-weather-status]');
    const metrics = this.querySelector('[data-bw-ty-weather-metrics]');
    const outfit = this.querySelector('[data-bw-ty-outfit]');

    if (title) title.textContent = 'Checking Alexanderplatz weather';
    if (status) status.textContent = `Loading the forecast for ${this._formatDisplayDate(booking.start)}.`;
    if (metrics) metrics.hidden = true;
    if (outfit) outfit.hidden = true;
  }

  _renderWeatherForecast(booking, forecast) {
    const title = this.querySelector('[data-bw-ty-weather-title]');
    const status = this.querySelector('[data-bw-ty-weather-status]');
    const metrics = this.querySelector('[data-bw-ty-weather-metrics]');
    const temp = this.querySelector('[data-bw-ty-weather-temp]');
    const rain = this.querySelector('[data-bw-ty-weather-rain]');
    const wind = this.querySelector('[data-bw-ty-weather-wind]');
    const outfit = this.querySelector('[data-bw-ty-outfit]');
    const outfitTitle = this.querySelector('[data-bw-ty-outfit-title]');
    const outfitCopy = this.querySelector('[data-bw-ty-outfit-copy]');
    const advice = this._buildOutfitAdvice(forecast);

    if (title) title.textContent = `${forecast.condition}, around ${this._formatTemperature(forecast.temperature)}`;
    if (status) {
      status.textContent = `For ${this._formatDisplayDate(booking.start)} near the World Clock. Forecasts can still change, so this is your practical starting point.`;
    }
    if (temp) {
      temp.textContent = this._formatTemperature(
        Number.isFinite(forecast.apparentTemperature) ? forecast.apparentTemperature : forecast.temperature
      );
    }
    if (rain) rain.textContent = this._formatPercent(forecast.rainProbability);
    if (wind) wind.textContent = this._formatWind(forecast.windSpeed);
    if (metrics) metrics.hidden = false;
    if (outfitTitle) outfitTitle.textContent = advice.title;
    if (outfitCopy) outfitCopy.textContent = advice.copy;
    if (outfit) outfit.hidden = false;

    this._trackOnce('outfit_viewed', {
      tour_date: this._formatForecastDay(booking.start),
      outfit_type: advice.title
    });
  }

  _renderWeatherFallback(titleText, statusText, outfitTitleText, outfitCopyText) {
    const title = this.querySelector('[data-bw-ty-weather-title]');
    const status = this.querySelector('[data-bw-ty-weather-status]');
    const metrics = this.querySelector('[data-bw-ty-weather-metrics]');
    const outfit = this.querySelector('[data-bw-ty-outfit]');
    const outfitTitle = this.querySelector('[data-bw-ty-outfit-title]');
    const outfitCopy = this.querySelector('[data-bw-ty-outfit-copy]');

    if (title) title.textContent = titleText;
    if (status) status.textContent = statusText;
    if (metrics) metrics.hidden = true;
    if (outfitTitle) outfitTitle.textContent = outfitTitleText;
    if (outfitCopy) outfitCopy.textContent = outfitCopyText;
    if (outfit) outfit.hidden = false;
  }

  _buildWeatherUrl() {
    const params = new URLSearchParams({
      latitude: String(BW_THANK_YOU_WEATHER_COORDS.latitude),
      longitude: String(BW_THANK_YOU_WEATHER_COORDS.longitude),
      timezone: BW_THANK_YOU_CALENDAR.timezone,
      forecast_days: String(BW_THANK_YOU_FORECAST_DAYS),
      temperature_unit: 'celsius',
      wind_speed_unit: 'kmh',
      precipitation_unit: 'mm',
      hourly: 'temperature_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_gusts_10m',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max'
    });
    return `${BW_THANK_YOU_WEATHER_API_URL}?${params.toString()}`;
  }

  _extractTourForecast(data, booking) {
    const hourly = data && data.hourly ? data.hourly : {};
    const daily = data && data.daily ? data.daily : {};
    const dayKey = this._formatForecastDay(booking.start);
    const hourlyTimes = Array.isArray(hourly.time) ? hourly.time : [];
    const indexes = [];
    const end = this._addMinutesToDateParts(booking.start, BW_THANK_YOU_CALENDAR.durationMinutes);
    const sameEndDay = this._isSameDateParts(booking.start, end);
    const endHour = sameEndDay ? end.hour : 23;

    hourlyTimes.forEach((time, index) => {
      const parts = this._parseForecastTime(time);
      if (!parts || this._formatForecastDay(parts) !== dayKey) return;
      if (parts.hour >= booking.start.hour && parts.hour <= endHour) indexes.push(index);
    });

    if (!indexes.length) {
      hourlyTimes.forEach((time, index) => {
        const parts = this._parseForecastTime(time);
        if (!parts || this._formatForecastDay(parts) !== dayKey) return;
        if (Math.abs(parts.hour - booking.start.hour) <= 1) indexes.push(index);
      });
    }

    const dailyIndex = Array.isArray(daily.time) ? daily.time.indexOf(dayKey) : -1;
    const minTemp = this._dailyNumber(daily, 'temperature_2m_min', dailyIndex);
    const maxTemp = this._dailyNumber(daily, 'temperature_2m_max', dailyIndex);
    let temperature = this._roundNumber(this._meanNumbers(this._hourlyNumbers(hourly, 'temperature_2m', indexes)));
    let apparentTemperature = this._roundNumber(this._meanNumbers(this._hourlyNumbers(hourly, 'apparent_temperature', indexes)));
    let rainProbability = this._roundNumber(this._maxNumber(this._hourlyNumbers(hourly, 'precipitation_probability', indexes)));
    let precipitation = this._roundNumber(this._sumNumbers(this._hourlyNumbers(hourly, 'precipitation', indexes)), 1);
    let windSpeed = this._roundNumber(this._maxNumber(this._hourlyNumbers(hourly, 'wind_speed_10m', indexes)));
    const gusts = this._roundNumber(this._maxNumber(this._hourlyNumbers(hourly, 'wind_gusts_10m', indexes)));
    let weatherCode = this._mostSignificantWeatherCode(this._hourlyNumbers(hourly, 'weather_code', indexes));

    if (temperature === null && minTemp !== null && maxTemp !== null) temperature = this._roundNumber((minTemp + maxTemp) / 2);
    if (apparentTemperature === null) apparentTemperature = temperature;
    if (rainProbability === null) rainProbability = this._roundNumber(this._dailyNumber(daily, 'precipitation_probability_max', dailyIndex));
    if (precipitation === null) precipitation = this._roundNumber(this._dailyNumber(daily, 'precipitation_sum', dailyIndex), 1);
    if (windSpeed === null) windSpeed = this._roundNumber(this._dailyNumber(daily, 'wind_speed_10m_max', dailyIndex));
    if (weatherCode === null) weatherCode = this._dailyNumber(daily, 'weather_code', dailyIndex);

    if (temperature === null && rainProbability === null && windSpeed === null && weatherCode === null) return null;

    return {
      temperature,
      apparentTemperature,
      rainProbability,
      precipitation,
      windSpeed,
      gusts,
      weatherCode,
      condition: this._weatherCodeLabel(weatherCode),
      minTemp,
      maxTemp
    };
  }

  _buildOutfitAdvice(forecast) {
    const temp = forecast.apparentTemperature !== null ? forecast.apparentTemperature : forecast.temperature;
    const rain = forecast.rainProbability || 0;
    const precipitation = forecast.precipitation || 0;
    const wind = forecast.gusts || forecast.windSpeed || 0;
    const rainy = rain >= 55 || precipitation >= 1 || this._isRainCode(forecast.weatherCode);
    const maybeRain = !rainy && rain >= 30;
    let title = 'Comfortable walking setup';
    const pieces = [];

    if (rainy) {
      title = 'Rain-ready walking setup';
      pieces.push('Wear a waterproof jacket and shoes that handle wet pavement.');
    } else if (maybeRain) {
      title = 'Light rain backup';
      pieces.push('Bring a light rain layer or compact umbrella, just in case.');
    }

    if (temp !== null && temp <= 3) {
      title = rainy ? title : 'Cold-weather walking setup';
      pieces.push('Use a warm coat, hat, and gloves; the tour stays outdoors.');
    } else if (temp !== null && temp <= 9) {
      pieces.push('Add a warm layer under your jacket.');
    } else if (temp !== null && temp <= 16) {
      pieces.push('A jacket or sweater is sensible for a 2-hour walk.');
    } else if (temp !== null && temp >= 25) {
      title = rainy ? title : 'Warm-day walking setup';
      pieces.push('Wear light layers and bring water.');
    }

    if (wind >= 45) {
      pieces.push('Choose a windproof layer; umbrellas can be awkward on open squares.');
    }

    if (!pieces.length) {
      pieces.push('Comfortable shoes and one light layer are enough for most of the walk.');
    }

    return {
      title,
      copy: pieces.join(' ')
    };
  }

  _hourlyNumbers(hourly, key, indexes) {
    const values = hourly && Array.isArray(hourly[key]) ? hourly[key] : [];
    return indexes
      .map((index) => Number(values[index]))
      .filter((value) => Number.isFinite(value));
  }

  _dailyNumber(daily, key, index) {
    if (!daily || index < 0 || !Array.isArray(daily[key])) return null;
    const value = Number(daily[key][index]);
    return Number.isFinite(value) ? value : null;
  }

  _meanNumbers(values) {
    if (!values.length) return null;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  _maxNumber(values) {
    if (!values.length) return null;
    return Math.max(...values);
  }

  _sumNumbers(values) {
    if (!values.length) return null;
    return values.reduce((sum, value) => sum + value, 0);
  }

  _roundNumber(value, decimals = 0) {
    if (!Number.isFinite(value)) return null;
    const factor = 10 ** decimals;
    return Math.round(value * factor) / factor;
  }

  _mostSignificantWeatherCode(codes) {
    if (!codes.length) return null;
    return codes.reduce((best, code) => {
      if (best === null) return code;
      return this._weatherCodeSeverity(code) > this._weatherCodeSeverity(best) ? code : best;
    }, null);
  }

  _weatherCodeSeverity(code) {
    const value = Number(code);
    if ([95, 96, 99].includes(value)) return 10;
    if ([85, 86].includes(value)) return 9;
    if ([75, 82].includes(value)) return 8;
    if ([73, 81].includes(value)) return 7;
    if ([65, 71, 80].includes(value)) return 6;
    if ([63, 67].includes(value)) return 5;
    if ([61, 66].includes(value)) return 4;
    if ([45, 48, 51, 53, 55, 56, 57].includes(value)) return 3;
    if ([2, 3].includes(value)) return 2;
    if (value === 1) return 1;
    return 0;
  }

  _weatherCodeLabel(code) {
    const value = Number(code);
    if (value === 0) return 'Clear weather';
    if ([1, 2].includes(value)) return 'Partly cloudy';
    if (value === 3) return 'Overcast';
    if ([45, 48].includes(value)) return 'Foggy';
    if ([51, 53, 55, 56, 57].includes(value)) return 'Drizzle';
    if ([61, 63, 65, 66, 67].includes(value)) return 'Rain likely';
    if ([71, 73, 75, 77, 85, 86].includes(value)) return 'Snow possible';
    if ([80, 81, 82].includes(value)) return 'Showers possible';
    if ([95, 96, 99].includes(value)) return 'Thunderstorms possible';
    return 'Berlin weather';
  }

  _isRainCode(code) {
    const value = Number(code);
    return [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(value);
  }

  _formatTemperature(value) {
    return Number.isFinite(value) ? `${Math.round(value)} C` : 'Check forecast';
  }

  _formatPercent(value) {
    return Number.isFinite(value) ? `${Math.round(value)}%` : 'Check';
  }

  _formatWind(value) {
    return Number.isFinite(value) ? `${Math.round(value)} km/h` : 'Check';
  }

  _parseForecastTime(value) {
    const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    if (!match) return null;
    return this._buildDateParts(match[1], match[2], match[3], match[4], match[5]);
  }

  _formatLocalDateTime(parts) {
    return `${this._formatForecastDay(parts)}T${this._pad(parts.hour)}:${this._pad(parts.minute)}:00`;
  }

  _formatForecastDay(parts) {
    return `${parts.year}-${this._pad(parts.month)}-${this._pad(parts.day)}`;
  }

  _isSameDateParts(first, second) {
    return first.year === second.year && first.month === second.month && first.day === second.day;
  }

  _daysFromTodayInBerlin(parts) {
    const today = this._dateToPartsInTimeZone(new Date(), BW_THANK_YOU_CALENDAR.timezone);
    const todayMs = Date.UTC(today.year, today.month - 1, today.day);
    const targetMs = Date.UTC(parts.year, parts.month - 1, parts.day);
    return Math.round((targetMs - todayMs) / 86400000);
  }

  _datePartsToTimeZoneDate(parts, timeZone) {
    const desiredLocalMs = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute || 0, 0);
    let utcMs = desiredLocalMs;

    for (let index = 0; index < 3; index++) {
      const zoned = this._dateToPartsInTimeZone(new Date(utcMs), timeZone);
      const zonedMs = Date.UTC(zoned.year, zoned.month - 1, zoned.day, zoned.hour, zoned.minute, zoned.second || 0);
      const diff = zonedMs - desiredLocalMs;
      if (Math.abs(diff) < 1000) break;
      utcMs -= diff;
    }

    return new Date(utcMs);
  }

  _dateToPartsInTimeZone(date, timeZone) {
    const parts = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      hour: '2-digit',
      hourCycle: 'h23',
      minute: '2-digit',
      month: '2-digit',
      second: '2-digit',
      timeZone,
      year: 'numeric'
    }).formatToParts(date);
    const result = {};

    parts.forEach((part) => {
      if (part.type === 'literal') return;
      result[part.type] = Number(part.value);
    });

    if (result.hour === 24) result.hour = 0;
    return {
      year: result.year,
      month: result.month,
      day: result.day,
      hour: result.hour || 0,
      minute: result.minute || 0,
      second: result.second || 0
    };
  }

  _trackOnce(eventName, params = {}) {
    this._trackedEvents = this._trackedEvents || new Set();
    if (this._trackedEvents.has(eventName)) return;
    this._trackedEvents.add(eventName);
    this._track(eventName, params);
  }

  _track(eventName, params = {}) {
    const event = `bw_${eventName}`;
    try {
      if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event, ...params });
      if (typeof window.gtag === 'function') window.gtag('event', event, params);
    } catch (error) {
      // Analytics must never block the confirmation experience.
    }
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
