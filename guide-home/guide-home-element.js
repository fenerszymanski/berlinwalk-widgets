const BW_GUIDE_HOME_BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
const BW_GUIDE_HOME_GUIDE_URL = 'https://www.berlinwalk.com/the-guide';
const BW_GUIDE_HOME_IMAGE_URL = 'https://static.wixstatic.com/media/5a08a3_ac78d5df37b2486ab6662cf3872ea9a6~mv2.jpg/v1/fill/w_900,h_675,al_c,q_85/file.jpg';

class BWGuideHomeElement extends HTMLElement {
  connectedCallback() {
    this._render();
  }

  _render() {
    this.innerHTML = `
      <style>
        bw-guide-home {
          display: block;
          width: 100%;
        }

        .bw-guide-home {
          --green: #1B5E20;
          --yellow: #FFE600;
          --lime: #7CB342;
          --light-green: #C5E1A5;
          --cream: #FAFAF5;
          --text: #212121;
          --muted: #4E5A4E;
          --serif: Merriweather, Georgia, serif;
          background: #FFFFFF;
          color: var(--text);
          font-family: Montserrat, Arial, sans-serif;
          margin: 0;
          max-width: 100%;
          overflow-x: hidden;
          padding: 72px 24px;
        }

        .bw-guide-home *,
        .bw-guide-home *::before,
        .bw-guide-home *::after {
          box-sizing: border-box;
        }

        .bw-guide-home h2,
        .bw-guide-home h3,
        .bw-guide-home p,
        .bw-guide-home figure {
          margin-top: 0;
        }

        .bw-guide-home a {
          color: inherit;
        }

        .bw-guide-home .bw-guide-home-inner {
          align-items: center;
          display: grid;
          gap: 54px;
          grid-template-columns: minmax(320px, 0.86fr) minmax(0, 1fr);
          margin: 0 auto;
          max-width: 1120px;
        }

        .bw-guide-home .bw-guide-home-visual {
          margin: 0;
          position: relative;
        }

        .bw-guide-home .bw-guide-home-photo {
          border-radius: 8px;
          box-shadow: 0 18px 42px rgba(27, 94, 32, 0.18);
          display: block;
          overflow: hidden;
          position: relative;
        }

        .bw-guide-home .bw-guide-home-photo::after {
          background: linear-gradient(180deg, transparent 48%, rgba(16, 36, 20, 0.46));
          bottom: 0;
          content: "";
          left: 0;
          pointer-events: none;
          position: absolute;
          right: 0;
          top: 0;
        }

        .bw-guide-home .bw-guide-home-photo img {
          aspect-ratio: 4 / 3;
          display: block;
          height: auto;
          object-fit: cover;
          object-position: center center;
          width: 100%;
        }

        .bw-guide-home .bw-guide-home-photo-tag {
          background: var(--yellow);
          border-radius: 999px;
          bottom: 18px;
          color: var(--green);
          font-size: 12px;
          font-weight: 800;
          left: 18px;
          letter-spacing: 1px;
          padding: 9px 13px;
          position: absolute;
          text-transform: uppercase;
          z-index: 2;
        }

        .bw-guide-home .bw-guide-home-note {
          background: var(--green);
          border-radius: 8px;
          bottom: -28px;
          box-shadow: 0 14px 28px rgba(27, 94, 32, 0.2);
          color: #FFFFFF;
          max-width: 310px;
          padding: 18px 20px;
          position: absolute;
          right: -22px;
          z-index: 3;
        }

        .bw-guide-home .bw-guide-home-note strong {
          color: var(--yellow);
          display: block;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.1px;
          margin-bottom: 7px;
          text-transform: uppercase;
        }

        .bw-guide-home .bw-guide-home-note span {
          display: block;
          font-family: var(--serif);
          font-size: 14px;
          line-height: 1.55;
        }

        .bw-guide-home .bw-guide-home-copy {
          min-width: 0;
        }

        .bw-guide-home .bw-guide-home-kicker {
          color: var(--green);
          display: inline-flex;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.5px;
          line-height: 1.35;
          margin-bottom: 14px;
          text-transform: uppercase;
        }

        .bw-guide-home .bw-guide-home-title {
          color: var(--green);
          font-size: 46px;
          font-weight: 800;
          letter-spacing: 0;
          line-height: 1.08;
          margin-bottom: 16px;
          max-width: 640px;
        }

        .bw-guide-home .bw-guide-home-highlight {
          background: var(--yellow);
          box-decoration-break: clone;
          color: var(--green);
          padding: 0 8px 4px;
          -webkit-box-decoration-break: clone;
        }

        .bw-guide-home .bw-guide-home-lead {
          color: var(--muted);
          font-family: var(--serif);
          font-size: 18px;
          line-height: 1.68;
          margin-bottom: 22px;
          max-width: 650px;
        }

        .bw-guide-home .bw-guide-home-proof {
          border-bottom: 1px solid var(--light-green);
          border-top: 1px solid var(--light-green);
          display: grid;
          gap: 14px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-bottom: 24px;
          padding: 17px 0;
        }

        .bw-guide-home .bw-guide-home-proof-item strong {
          color: var(--green);
          display: block;
          font-size: 14px;
          font-weight: 800;
          line-height: 1.25;
          margin-bottom: 4px;
        }

        .bw-guide-home .bw-guide-home-proof-item span {
          color: var(--muted);
          display: block;
          font-size: 13px;
          line-height: 1.45;
        }

        .bw-guide-home .bw-guide-home-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .bw-guide-home .bw-guide-home-btn {
          align-items: center;
          border-radius: 999px;
          display: inline-flex;
          font-size: 13px;
          font-weight: 800;
          justify-content: center;
          letter-spacing: 0.7px;
          min-height: 48px;
          padding: 14px 22px;
          text-decoration: none;
          text-transform: uppercase;
          transition: background 160ms ease, color 160ms ease, transform 160ms ease;
        }

        .bw-guide-home .bw-guide-home-btn-primary {
          background: var(--green);
          color: #FFFFFF;
        }

        .bw-guide-home .bw-guide-home-btn-primary:hover,
        .bw-guide-home .bw-guide-home-btn-primary:focus-visible {
          background: #124516;
          transform: translateY(-1px);
        }

        .bw-guide-home .bw-guide-home-btn-secondary {
          background: var(--yellow);
          color: var(--green);
        }

        .bw-guide-home .bw-guide-home-btn-secondary:hover,
        .bw-guide-home .bw-guide-home-btn-secondary:focus-visible {
          background: #fff04a;
          transform: translateY(-1px);
        }

        .bw-guide-home .bw-guide-home-btn:focus-visible,
        .bw-guide-home a:focus-visible {
          outline: 3px solid rgba(255, 230, 0, 0.9);
          outline-offset: 3px;
        }

        @media (max-width: 980px) {
          .bw-guide-home {
            padding: 58px 22px;
          }

          .bw-guide-home .bw-guide-home-inner {
            gap: 42px;
            grid-template-columns: 1fr;
          }

          .bw-guide-home .bw-guide-home-visual {
            max-width: 620px;
          }

          .bw-guide-home .bw-guide-home-note {
            right: 18px;
          }
        }

        @media (max-width: 620px) {
          .bw-guide-home {
            padding: 48px 18px;
          }

          .bw-guide-home .bw-guide-home-title {
            font-size: 34px;
          }

          .bw-guide-home .bw-guide-home-lead {
            font-size: 16px;
          }

          .bw-guide-home .bw-guide-home-note {
            margin-top: 14px;
            max-width: none;
            position: static;
          }

          .bw-guide-home .bw-guide-home-proof {
            grid-template-columns: 1fr;
          }

          .bw-guide-home .bw-guide-home-actions {
            align-items: stretch;
            flex-direction: column;
          }

          .bw-guide-home .bw-guide-home-btn {
            width: 100%;
          }
        }
      </style>

      <section class="bw-guide-home" aria-labelledby="bw-guide-home-title">
        <div class="bw-guide-home-inner">
          <figure class="bw-guide-home-visual">
            <div class="bw-guide-home-photo">
              <img src="${BW_GUIDE_HOME_IMAGE_URL}" alt="Yusuf guiding a BerlinWalk tour in front of the Rotes Rathaus" loading="lazy" decoding="async">
              <figcaption class="bw-guide-home-photo-tag">Your local guide</figcaption>
            </div>
            <div class="bw-guide-home-note">
              <strong>On the route</strong>
              <span>Old photos, vanished streets, clear context, and the stories most visitors walk past.</span>
            </div>
          </figure>

          <div class="bw-guide-home-copy">
            <span class="bw-guide-home-kicker">The Guide</span>
            <h2 id="bw-guide-home-title" class="bw-guide-home-title">Meet <span class="bw-guide-home-highlight">Yusuf</span>, your Berlin guide</h2>
            <p class="bw-guide-home-lead">Berlin makes more sense when someone connects the layers. I built BerlinWalk to turn the city from a list of sights into a story you can actually follow on foot.</p>

            <div class="bw-guide-home-proof" aria-label="Tour highlights">
              <div class="bw-guide-home-proof-item">
                <strong>12 stops</strong>
                <span>Alexanderplatz to Hackescher Markt.</span>
              </div>
              <div class="bw-guide-home-proof-item">
                <strong>About 2 hours</strong>
                <span>Relaxed pace, no rushed checklist.</span>
              </div>
              <div class="bw-guide-home-proof-item">
                <strong>5.0 rating</strong>
                <span>Stories, humor, and real context.</span>
              </div>
            </div>

            <div class="bw-guide-home-actions">
              <a class="bw-guide-home-btn bw-guide-home-btn-primary" href="${BW_GUIDE_HOME_GUIDE_URL}">Meet Yusuf</a>
              <a class="bw-guide-home-btn bw-guide-home-btn-secondary" href="${BW_GUIDE_HOME_BOOKING_URL}">Book your spot</a>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

if (!customElements.get('bw-guide-home')) {
  customElements.define('bw-guide-home', BWGuideHomeElement);
}
