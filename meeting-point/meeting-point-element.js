const BW_MEETING_POINT_MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Weltzeituhr%20Alexanderplatz%20Berlin';
const BW_MEETING_POINT_BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
const BW_MEETING_POINT_IMAGE_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/gallery/images/06-1200w.webp';
const BW_MEETING_POINT_IMAGE_FALLBACK_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/gallery/images/06-1200w.jpg';

class BWMeetingPointElement extends HTMLElement {
  connectedCallback() {
    this._render();
  }

  _render() {
    this.innerHTML = `
      <style>
        bw-meeting-point {
          display: block;
          width: 100%;
        }

        .bw-meeting-point {
          --serif: Merriweather, Georgia, serif;
          background: #FAFAF5;
          color: #212121;
          font-family: Montserrat, Arial, sans-serif;
          margin: 0;
          max-width: 100%;
          overflow-x: hidden;
        }

        .bw-meeting-point *,
        .bw-meeting-point *::before,
        .bw-meeting-point *::after {
          box-sizing: border-box;
        }

        .bw-meeting-point h1,
        .bw-meeting-point h2,
        .bw-meeting-point h3,
        .bw-meeting-point p {
          margin-top: 0;
        }

        .bw-meeting-point a {
          color: inherit;
        }

        .bw-meeting-point .bw-mp-hero {
          background:
            linear-gradient(90deg, rgba(255, 230, 0, 0.14) 0 1px, transparent 1px 80px),
            linear-gradient(#FAFAF5, #F6F8EF);
          border-top: 6px solid #1B5E20;
          padding: 58px 24px 44px;
          position: relative;
        }

        .bw-meeting-point .bw-mp-inner {
          margin: 0 auto;
          max-width: 1120px;
        }

        .bw-meeting-point .bw-mp-hero-grid {
          align-items: center;
          display: grid;
          gap: 36px;
          grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.8fr);
        }

        .bw-meeting-point .bw-mp-eyebrow {
          color: #1B5E20;
          display: inline-flex;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.6px;
          line-height: 1.35;
          margin-bottom: 18px;
          text-transform: uppercase;
        }

        .bw-meeting-point h1 {
          color: #1B5E20;
          font-size: 52px;
          font-weight: 800;
          letter-spacing: 0;
          line-height: 1.03;
          margin-bottom: 18px;
          max-width: 680px;
        }

        .bw-meeting-point .bw-mp-highlight {
          background: #FFE600;
          box-decoration-break: clone;
          color: #1B5E20;
          padding: 0 8px 4px;
          -webkit-box-decoration-break: clone;
        }

        .bw-meeting-point .bw-mp-hero-lead {
          color: #4E5A4E;
          font-family: var(--serif);
          font-size: 18px;
          line-height: 1.65;
          margin-bottom: 28px;
          max-width: 680px;
        }

        .bw-meeting-point .bw-mp-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .bw-meeting-point .bw-mp-btn {
          align-items: center;
          border-radius: 999px;
          display: inline-flex;
          font-size: 14px;
          font-weight: 800;
          justify-content: center;
          letter-spacing: 0.5px;
          min-height: 48px;
          padding: 14px 22px;
          text-decoration: none;
          text-transform: uppercase;
          transition: background 160ms ease, color 160ms ease, transform 160ms ease;
        }

        .bw-meeting-point .bw-mp-btn-primary {
          background: #1B5E20;
          color: #FFFFFF;
        }

        .bw-meeting-point .bw-mp-btn-primary:hover,
        .bw-meeting-point .bw-mp-btn-primary:focus-visible {
          background: #124516;
          transform: translateY(-1px);
        }

        .bw-meeting-point .bw-mp-btn-secondary {
          background: #FFE600;
          color: #1B5E20;
        }

        .bw-meeting-point .bw-mp-btn-secondary:hover,
        .bw-meeting-point .bw-mp-btn-secondary:focus-visible {
          background: #fff04a;
          transform: translateY(-1px);
        }

        .bw-meeting-point .bw-mp-btn-ghost {
          border: 2px solid #1B5E20;
          color: #1B5E20;
        }

        .bw-meeting-point .bw-mp-btn-ghost:hover,
        .bw-meeting-point .bw-mp-btn-ghost:focus-visible {
          background: #1B5E20;
          color: #FFFFFF;
          transform: translateY(-1px);
        }

        .bw-meeting-point .bw-mp-btn:focus-visible {
          outline: 3px solid rgba(255, 230, 0, 0.9);
          outline-offset: 3px;
        }

        .bw-meeting-point .bw-mp-wayfinder {
          background: #FFFFFF;
          border-radius: 8px;
          box-shadow: 0 18px 44px rgba(27, 94, 32, 0.18);
          color: #212121;
          overflow: hidden;
          position: relative;
        }

        .bw-meeting-point .bw-mp-wayfinder-top {
          align-items: center;
          background: #FFE600;
          color: #1B5E20;
          display: flex;
          font-size: 12px;
          font-weight: 800;
          justify-content: space-between;
          letter-spacing: 1.2px;
          padding: 13px 16px;
          text-transform: uppercase;
        }

        .bw-meeting-point .bw-mp-photo-card {
          margin: 0;
          position: relative;
        }

        .bw-meeting-point .bw-mp-photo-card img {
          aspect-ratio: 16 / 10;
          display: block;
          height: 100%;
          object-fit: cover;
          width: 100%;
        }

        .bw-meeting-point .bw-mp-photo-caption {
          background: rgba(27, 94, 32, 0.9);
          bottom: 14px;
          color: #FFFFFF;
          font-size: 12px;
          font-weight: 800;
          left: 14px;
          letter-spacing: 0.9px;
          padding: 8px 11px;
          position: absolute;
          text-transform: uppercase;
        }

        .bw-meeting-point .bw-mp-wayfinder h2 {
          color: #1B5E20;
          font-size: 26px;
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 8px;
        }

        .bw-meeting-point .bw-mp-wayfinder p {
          color: #4E5A4E;
          font-family: var(--serif);
          font-size: 15px;
          line-height: 1.55;
          margin-bottom: 0;
        }

        .bw-meeting-point .bw-mp-wayfinder-copy {
          padding: 22px 24px 20px;
        }

        .bw-meeting-point .bw-mp-board-list {
          border-top: 1px solid #C5E1A5;
          display: grid;
          gap: 0;
        }

        .bw-meeting-point .bw-mp-board-row {
          align-items: center;
          border-bottom: 1px solid #C5E1A5;
          display: grid;
          gap: 14px;
          grid-template-columns: 96px minmax(0, 1fr);
          padding: 14px 24px;
        }

        .bw-meeting-point .bw-mp-board-label {
          color: #1B5E20;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.3px;
          text-transform: uppercase;
        }

        .bw-meeting-point .bw-mp-board-value {
          color: #212121;
          font-size: 15px;
          font-weight: 700;
          line-height: 1.35;
        }

        .bw-meeting-point .bw-mp-map-band {
          background: #1B5E20;
          color: #FFFFFF;
          padding: 28px 24px 34px;
        }

        .bw-meeting-point .bw-mp-map-shell {
          display: grid;
          gap: 22px;
          grid-template-columns: minmax(0, 0.72fr) minmax(0, 1.28fr);
        }

        .bw-meeting-point .bw-mp-map-copy {
          align-self: center;
        }

        .bw-meeting-point .bw-mp-map-copy h2 {
          color: #FFFFFF;
          font-size: 30px;
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 12px;
        }

        .bw-meeting-point .bw-mp-map-copy p {
          color: rgba(255, 255, 255, 0.86);
          font-family: var(--serif);
          font-size: 16px;
          line-height: 1.65;
          margin-bottom: 20px;
        }

        .bw-meeting-point .bw-mp-map-frame {
          background:
            linear-gradient(90deg, rgba(27, 94, 32, 0.08) 0 1px, transparent 1px 48px),
            linear-gradient(rgba(27, 94, 32, 0.08) 0 1px, transparent 1px 48px),
            #FAFAF5;
          border: 4px solid #FFE600;
          border-radius: 8px;
          min-height: 420px;
          overflow: hidden;
          position: relative;
        }

        .bw-meeting-point .bw-mp-map-poster {
          color: #212121;
          display: block;
          height: 100%;
          min-height: 420px;
          position: relative;
          text-decoration: none;
          width: 100%;
        }

        .bw-meeting-point .bw-mp-map-road {
          background: #C5E1A5;
          border-radius: 999px;
          display: block;
          height: 16px;
          left: 9%;
          position: absolute;
          right: 8%;
          top: 48%;
          transform: rotate(-8deg);
        }

        .bw-meeting-point .bw-mp-map-road::before,
        .bw-meeting-point .bw-mp-map-road::after {
          background: #C5E1A5;
          border-radius: 999px;
          content: "";
          display: block;
          height: 14px;
          position: absolute;
          width: 68%;
        }

        .bw-meeting-point .bw-mp-map-road::before {
          left: 8%;
          top: -92px;
          transform: rotate(42deg);
        }

        .bw-meeting-point .bw-mp-map-road::after {
          right: 2%;
          top: 92px;
          transform: rotate(38deg);
        }

        .bw-meeting-point .bw-mp-map-station,
        .bw-meeting-point .bw-mp-map-end,
        .bw-meeting-point .bw-mp-map-pin,
        .bw-meeting-point .bw-mp-map-cta {
          position: absolute;
          z-index: 2;
        }

        .bw-meeting-point .bw-mp-map-station,
        .bw-meeting-point .bw-mp-map-end {
          background: #FFFFFF;
          border: 1px solid #C5E1A5;
          border-radius: 8px;
          box-shadow: 0 8px 20px rgba(27, 94, 32, 0.08);
          color: #1B5E20;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.6px;
          padding: 10px 12px;
          text-transform: uppercase;
        }

        .bw-meeting-point .bw-mp-map-station {
          left: 9%;
          top: 16%;
        }

        .bw-meeting-point .bw-mp-map-end {
          bottom: 16%;
          right: 10%;
        }

        .bw-meeting-point .bw-mp-map-pin {
          align-items: center;
          background: #1B5E20;
          border: 5px solid #FFE600;
          border-radius: 50%;
          color: #FFFFFF;
          display: flex;
          font-size: 13px;
          font-weight: 800;
          height: 112px;
          justify-content: center;
          left: 50%;
          line-height: 1.15;
          padding: 12px;
          text-align: center;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 112px;
        }

        .bw-meeting-point .bw-mp-map-pin::after {
          border-left: 12px solid transparent;
          border-right: 12px solid transparent;
          border-top: 18px solid #FFE600;
          bottom: -20px;
          content: "";
          left: 50%;
          position: absolute;
          transform: translateX(-50%);
        }

        .bw-meeting-point .bw-mp-map-cta {
          background: #FFE600;
          border-radius: 999px;
          bottom: 20px;
          color: #1B5E20;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.8px;
          left: 20px;
          padding: 10px 14px;
          text-transform: uppercase;
        }

        .bw-meeting-point .bw-mp-map-poster:hover .bw-mp-map-cta,
        .bw-meeting-point .bw-mp-map-poster:focus-visible .bw-mp-map-cta {
          background: #fff04a;
        }

        .bw-meeting-point .bw-mp-map-poster:focus-visible {
          outline: 3px solid #FFFFFF;
          outline-offset: -8px;
        }

        .bw-meeting-point .bw-mp-main {
          padding: 44px 24px 58px;
        }

        .bw-meeting-point .bw-mp-route-strip {
          background: #FFFFFF;
          border: 1px solid #C5E1A5;
          border-radius: 8px;
          display: grid;
          gap: 0;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-bottom: 34px;
          overflow: hidden;
        }

        .bw-meeting-point .bw-mp-route-stop {
          min-width: 0;
          padding: 22px 24px;
          position: relative;
        }

        .bw-meeting-point .bw-mp-route-stop + .bw-mp-route-stop {
          border-left: 1px solid #C5E1A5;
        }

        .bw-meeting-point .bw-mp-route-stop::before {
          background: #1B5E20;
          border: 4px solid #FFE600;
          border-radius: 50%;
          content: "";
          display: block;
          height: 20px;
          margin-bottom: 12px;
          width: 20px;
        }

        .bw-meeting-point .bw-mp-route-stop h3 {
          color: #1B5E20;
          font-size: 18px;
          font-weight: 800;
          line-height: 1.25;
          margin-bottom: 8px;
        }

        .bw-meeting-point .bw-mp-route-stop p {
          color: #4E5A4E;
          font-family: var(--serif);
          font-size: 15px;
          line-height: 1.55;
          margin-bottom: 0;
        }

        .bw-meeting-point .bw-mp-guidance {
          display: grid;
          gap: 24px;
          grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
        }

        .bw-meeting-point .bw-mp-panel {
          background: #FFFFFF;
          border: 1px solid #C5E1A5;
          border-radius: 8px;
          padding: 26px;
        }

        .bw-meeting-point .bw-mp-panel h2 {
          color: #1B5E20;
          font-size: 25px;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 12px;
        }

        .bw-meeting-point .bw-mp-panel p {
          color: #4E5A4E;
          font-family: var(--serif);
          font-size: 15.5px;
          line-height: 1.65;
          margin-bottom: 0;
        }

        .bw-meeting-point .bw-mp-checklist {
          display: grid;
          gap: 12px;
          margin: 0;
          padding: 0;
        }

        .bw-meeting-point .bw-mp-checklist li {
          color: #212121;
          display: grid;
          font-size: 15px;
          gap: 10px;
          grid-template-columns: 22px minmax(0, 1fr);
          line-height: 1.55;
          list-style: none;
        }

        .bw-meeting-point .bw-mp-checklist li::before {
          color: #1B5E20;
          content: "✓";
          font-weight: 800;
        }

        .bw-meeting-point .bw-mp-final {
          background: #FAFAF5;
          border-top: 1px solid #C5E1A5;
          padding: 42px 24px 48px;
          text-align: center;
        }

        .bw-meeting-point .bw-mp-final h2 {
          color: #1B5E20;
          font-size: 30px;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 10px;
        }

        .bw-meeting-point .bw-mp-final p {
          color: #4E5A4E;
          font-family: var(--serif);
          font-size: 16px;
          line-height: 1.6;
          margin: 0 auto 22px;
          max-width: 620px;
        }

        @media (max-width: 980px) {
          .bw-meeting-point .bw-mp-hero-grid,
          .bw-meeting-point .bw-mp-map-shell,
          .bw-meeting-point .bw-mp-guidance {
            grid-template-columns: 1fr;
          }

          .bw-meeting-point .bw-mp-route-strip {
            grid-template-columns: 1fr;
          }

          .bw-meeting-point .bw-mp-route-stop + .bw-mp-route-stop {
            border-left: 0;
            border-top: 1px solid #C5E1A5;
          }
        }

        @media (max-width: 560px) {
          .bw-meeting-point .bw-mp-hero {
            padding: 44px 18px 34px;
          }

          .bw-meeting-point h1 {
            font-size: 38px;
          }

          .bw-meeting-point .bw-mp-hero-lead {
            font-size: 16px;
          }

          .bw-meeting-point .bw-mp-actions,
          .bw-meeting-point .bw-mp-btn {
            width: 100%;
          }

          .bw-meeting-point .bw-mp-board-row {
            grid-template-columns: 1fr;
            gap: 4px;
          }

          .bw-meeting-point .bw-mp-map-band,
          .bw-meeting-point .bw-mp-main,
          .bw-meeting-point .bw-mp-final {
            padding-left: 16px;
            padding-right: 16px;
          }

          .bw-meeting-point .bw-mp-map-frame,
          .bw-meeting-point .bw-mp-map-poster {
            min-height: 320px;
          }

          .bw-meeting-point .bw-mp-map-pin {
            height: 96px;
            width: 96px;
          }

          .bw-meeting-point .bw-mp-panel {
            padding: 22px;
          }

          .bw-meeting-point .bw-mp-final h2 {
            font-size: 25px;
          }
        }
      </style>

      <section class="bw-meeting-point">
        <header class="bw-mp-hero">
          <div class="bw-mp-inner bw-mp-hero-grid">
            <div>
              <span class="bw-mp-eyebrow">Meeting Point</span>
              <h1>Meet at the <span class="bw-mp-highlight">World Clock</span></h1>
              <p class="bw-mp-hero-lead">Your BerlinWalk tour starts at the Weltzeituhr on Alexanderplatz. Arrive 5 minutes early, look for the green umbrella, and get ready to walk from Alexanderplatz to Hackescher Markt.</p>
              <div class="bw-mp-actions">
                <a class="bw-mp-btn bw-mp-btn-primary" href="${BW_MEETING_POINT_MAPS_URL}" target="_blank" rel="noopener">Open in Google Maps</a>
                <a class="bw-mp-btn bw-mp-btn-ghost" href="${BW_MEETING_POINT_BOOKING_URL}">Book the Tour</a>
              </div>
            </div>

            <aside class="bw-mp-wayfinder" aria-label="Quick meeting point board">
              <div class="bw-mp-wayfinder-top">
                <span>BerlinWalk</span>
                <span>Tour start</span>
              </div>
              <figure class="bw-mp-photo-card">
                <picture>
                  <source srcset="${BW_MEETING_POINT_IMAGE_URL}" type="image/webp">
                  <img src="${BW_MEETING_POINT_IMAGE_FALLBACK_URL}" alt="Alexanderplatz World Clock, the BerlinWalk meeting point" loading="eager">
                </picture>
                <figcaption class="bw-mp-photo-caption">This is the spot</figcaption>
              </figure>
              <div class="bw-mp-wayfinder-copy">
                <h2>Weltzeituhr</h2>
                <p>The large rotating World Clock in the middle of Alexanderplatz.</p>
              </div>
              <div class="bw-mp-board-list">
                <div class="bw-mp-board-row">
                  <span class="bw-mp-board-label">Look for</span>
                  <span class="bw-mp-board-value">Green umbrella</span>
                </div>
                <div class="bw-mp-board-row">
                  <span class="bw-mp-board-label">Arrive</span>
                  <span class="bw-mp-board-value">5 minutes early</span>
                </div>
                <div class="bw-mp-board-row">
                  <span class="bw-mp-board-label">Finish</span>
                  <span class="bw-mp-board-value">Near Hackescher Markt</span>
                </div>
              </div>
            </aside>
          </div>
        </header>

        <section class="bw-mp-map-band" aria-labelledby="bw-mp-map-title">
          <div class="bw-mp-inner bw-mp-map-shell">
            <div class="bw-mp-map-copy">
              <h2 id="bw-mp-map-title">Go to Alexanderplatz station, then find the World Clock</h2>
              <p>Alexanderplatz is one of Berlin's easiest meeting points, with U-Bahn, S-Bahn, tram, bus, and regional train connections nearby. Once you are on the square, the World Clock is the round landmark people gather around.</p>
              <a class="bw-mp-btn bw-mp-btn-secondary" href="${BW_MEETING_POINT_MAPS_URL}" target="_blank" rel="noopener">Open map</a>
            </div>
            <div class="bw-mp-map-frame">
              <a class="bw-mp-map-poster" href="${BW_MEETING_POINT_MAPS_URL}" target="_blank" rel="noopener" aria-label="Open the meeting point in Google Maps">
                <span class="bw-mp-map-road" aria-hidden="true"></span>
                <span class="bw-mp-map-station">Alexanderplatz station</span>
                <span class="bw-mp-map-pin">World Clock<br>meeting point</span>
                <span class="bw-mp-map-end">Hackescher Markt finish</span>
                <span class="bw-mp-map-cta">Open in Google Maps</span>
              </a>
            </div>
          </div>
        </section>

        <main class="bw-mp-main">
          <div class="bw-mp-inner">
            <section class="bw-mp-route-strip" aria-label="Tour route summary">
              <div class="bw-mp-route-stop">
                <h3>Start</h3>
                <p>Weltzeituhr / World Clock, Alexanderplatz</p>
              </div>
              <div class="bw-mp-route-stop">
                <h3>Walk</h3>
                <p>About 2 hours through Berlin's historic center</p>
              </div>
              <div class="bw-mp-route-stop">
                <h3>End</h3>
                <p>Hackescher Markt, with cafes, food, and S-Bahn connections</p>
              </div>
            </section>

            <section class="bw-mp-guidance">
              <div class="bw-mp-panel">
                <h2>If you are late</h2>
                <p>The group can only wait a few minutes before starting. If you are running late, message us through your booking confirmation and we will tell you whether you can still join nearby.</p>
              </div>
              <div class="bw-mp-panel">
                <h2>Before you arrive</h2>
                <ul class="bw-mp-checklist">
                  <li>Check the weather and dress for walking.</li>
                  <li>Bring water in summer or an extra layer in winter.</li>
                  <li>Keep your phone charged so you can find the group easily.</li>
                </ul>
              </div>
            </section>
          </div>
        </main>

        <footer class="bw-mp-final">
          <div class="bw-mp-inner">
            <h2>Ready to walk through Berlin's historic center?</h2>
            <p>Reserve your spot for the free tip-based Berlin walking tour from Alexanderplatz to Hackescher Markt.</p>
            <a class="bw-mp-btn bw-mp-btn-primary" href="${BW_MEETING_POINT_BOOKING_URL}">Book your spot</a>
          </div>
        </footer>
      </section>
    `;
  }
}

if (!customElements.get('bw-meeting-point')) {
  customElements.define('bw-meeting-point', BWMeetingPointElement);
}
