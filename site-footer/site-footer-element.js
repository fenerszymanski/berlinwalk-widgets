const BW_SITE_FOOTER_BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
const BW_SITE_FOOTER_LOGO_URL = 'https://static.wixstatic.com/media/5a08a3_2f62d59b419643c0994771fac5765c79~mv2.png';
const BW_SITE_FOOTER_LINKS = {
  home: 'https://www.berlinwalk.com/',
  meetingPoint: 'https://www.berlinwalk.com/meeting-point',
  reviews: 'https://www.berlinwalk.com/reviews',
  route: 'https://www.berlinwalk.com/#route',
  faq: 'https://www.berlinwalk.com/#faq',
  guide: 'https://www.berlinwalk.com/the-guide',
  blog: 'https://www.berlinwalk.com/blog',
  plan: 'https://www.berlinwalk.com/berlin-tools',
  widgets: 'https://www.berlinwalk.com/widgets',
  instagram: 'https://www.instagram.com/berlinwalkingtour/',
  transport: 'https://www.berlinwalk.com/post/berlin-public-transport-explained-for-tourists-u-bahn-s-bahn-tram-bus',
  stay: 'https://www.berlinwalk.com/post/where-to-stay-in-berlin-best-neighborhoods-for-every-type-of-tourist',
  bestTime: 'https://www.berlinwalk.com/post/what-s-the-best-time-to-visit-berlin-a-month-by-month-guide',
  airport: 'https://www.berlinwalk.com/post/how-to-get-from-berlin-airport-to-alexanderplatz-the-easy-way'
};

class BWSiteFooterElement extends HTMLElement {
  connectedCallback() {
    this._render();
  }

  _render() {
    this.innerHTML = `
      <style>
        bw-site-footer {
          display: block;
          width: 100%;
        }

        .bw-site-footer {
          --green: #1B5E20;
          --green-dark: #102414;
          --green-mid: #164E1B;
          --yellow: #FFE600;
          --lime: #7CB342;
          --cream: #FAFAF5;
          --white: #FFFFFF;
          --muted-on-dark: rgba(250, 250, 245, 0.76);
          --serif: Merriweather, Georgia, serif;
          background: var(--green-dark);
          color: var(--cream);
          font-family: Montserrat, Arial, sans-serif;
          margin: 0;
          max-width: 100%;
          overflow: hidden;
          position: relative;
        }

        .bw-site-footer *,
        .bw-site-footer *::before,
        .bw-site-footer *::after {
          box-sizing: border-box;
        }

        .bw-site-footer h2,
        .bw-site-footer h3,
        .bw-site-footer p {
          margin-top: 0;
        }

        .bw-site-footer a {
          color: inherit;
        }

        .bw-site-footer .bw-footer-accent {
          background: linear-gradient(90deg, var(--yellow), var(--lime));
          height: 5px;
          width: 100%;
        }

        .bw-site-footer .bw-footer-inner {
          margin: 0 auto;
          max-width: 1180px;
          padding: 46px 24px 30px;
        }

        .bw-site-footer a:focus-visible {
          outline: 3px solid rgba(255, 230, 0, 0.75);
          outline-offset: 4px;
        }

        .bw-site-footer .bw-footer-main {
          display: grid;
          gap: 34px;
          grid-template-columns: minmax(280px, 1.2fr) repeat(3, minmax(150px, 0.65fr));
        }

        .bw-site-footer .bw-footer-brand {
          min-width: 0;
        }

        .bw-site-footer .bw-logo-link {
          align-items: center;
          background: var(--cream);
          border-radius: 6px;
          display: inline-flex;
          margin-bottom: 18px;
          padding: 10px 12px;
          text-decoration: none;
        }

        .bw-site-footer .bw-logo-img {
          display: block;
          height: auto;
          max-width: min(230px, 100%);
          width: 230px;
        }

        .bw-site-footer .bw-footer-brand p {
          color: var(--muted-on-dark);
          font-family: var(--serif);
          font-size: 15px;
          line-height: 1.7;
          margin-bottom: 22px;
          max-width: 440px;
        }

        .bw-site-footer .bw-route-chip {
          border: 1px solid rgba(197, 225, 165, 0.3);
          border-radius: 8px;
          display: grid;
          gap: 12px;
          max-width: 430px;
          padding: 16px;
        }

        .bw-site-footer .bw-route-line {
          align-items: center;
          display: grid;
          gap: 10px;
          grid-template-columns: auto minmax(60px, 1fr) auto minmax(60px, 1fr) auto;
        }

        .bw-site-footer .bw-route-dot {
          background: var(--yellow);
          border: 3px solid rgba(255, 255, 255, 0.18);
          border-radius: 999px;
          height: 16px;
          width: 16px;
        }

        .bw-site-footer .bw-route-track {
          background: repeating-linear-gradient(
            90deg,
            rgba(255, 230, 0, 0.9) 0 12px,
            transparent 12px 20px
          );
          height: 3px;
        }

        .bw-site-footer .bw-route-stops {
          color: var(--cream);
          display: grid;
          font-size: 12px;
          font-weight: 800;
          gap: 8px;
          grid-template-columns: 1fr auto 1fr;
          letter-spacing: 0.7px;
          text-transform: uppercase;
        }

        .bw-site-footer .bw-route-stops span:nth-child(2) {
          color: var(--yellow);
          text-align: center;
        }

        .bw-site-footer .bw-footer-col h3 {
          color: var(--yellow);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 1.2px;
          margin-bottom: 15px;
          text-transform: uppercase;
        }

        .bw-site-footer .bw-footer-links {
          display: grid;
          gap: 11px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .bw-site-footer .bw-footer-links a {
          color: var(--muted-on-dark);
          display: inline-flex;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.35;
          text-decoration: none;
          transition: color 160ms ease, transform 160ms ease;
        }

        .bw-site-footer .bw-footer-links a:hover,
        .bw-site-footer .bw-footer-links a:focus-visible {
          color: var(--white);
          transform: translateX(2px);
        }

        .bw-site-footer .bw-footer-note-grid {
          border-top: 1px solid rgba(197, 225, 165, 0.22);
          display: grid;
          gap: 14px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 34px;
          padding-top: 22px;
        }

        .bw-site-footer .bw-footer-note {
          color: rgba(250, 250, 245, 0.7);
          font-size: 12.5px;
          font-weight: 700;
          line-height: 1.45;
        }

        .bw-site-footer .bw-footer-note strong {
          color: var(--yellow);
          display: block;
          font-size: 12px;
          letter-spacing: 1px;
          margin-bottom: 4px;
          text-transform: uppercase;
        }

        .bw-site-footer .bw-footer-bottom {
          align-items: center;
          border-top: 1px solid rgba(197, 225, 165, 0.22);
          color: rgba(250, 250, 245, 0.62);
          display: flex;
          flex-wrap: wrap;
          font-size: 12px;
          font-weight: 700;
          gap: 10px 18px;
          justify-content: space-between;
          margin-top: 24px;
          padding-top: 22px;
        }

        .bw-site-footer .bw-footer-bottom-links {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
        }

        .bw-site-footer .bw-footer-bottom a {
          text-decoration: none;
          transition: color 160ms ease;
        }

        .bw-site-footer .bw-footer-bottom a:hover,
        .bw-site-footer .bw-footer-bottom a:focus-visible {
          color: var(--white);
        }

        @media (max-width: 940px) {
          .bw-site-footer .bw-footer-main {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .bw-site-footer .bw-footer-brand {
            grid-column: 1 / -1;
          }

          .bw-site-footer .bw-footer-brand p,
          .bw-site-footer .bw-route-chip {
            max-width: none;
          }
        }

        @media (max-width: 760px) {
          .bw-site-footer .bw-footer-inner {
            padding: 32px 18px 26px;
          }

          .bw-site-footer .bw-footer-main,
          .bw-site-footer .bw-footer-note-grid {
            grid-template-columns: 1fr;
          }

          .bw-site-footer .bw-footer-col {
            border-top: 1px solid rgba(197, 225, 165, 0.18);
            padding-top: 20px;
          }

          .bw-site-footer .bw-route-stops {
            font-size: 11px;
          }
        }

        @media (max-width: 420px) {
          .bw-site-footer .bw-footer-inner {
            padding-left: 14px;
            padding-right: 14px;
          }

          .bw-site-footer .bw-logo-img {
            width: 210px;
          }

          .bw-site-footer .bw-route-chip {
            padding: 14px 12px;
          }
        }
      </style>

      <footer class="bw-site-footer" aria-label="BerlinWalk site footer">
        <div class="bw-footer-accent" aria-hidden="true"></div>
        <div class="bw-footer-inner">
          <div class="bw-footer-main">
            <div class="bw-footer-brand">
              <a class="bw-logo-link" href="${BW_SITE_FOOTER_LINKS.home}" aria-label="BerlinWalk home">
                <img class="bw-logo-img" src="${BW_SITE_FOOTER_LOGO_URL}" alt="BerlinWalk" loading="lazy" decoding="async">
              </a>
              <p>Free tip-based walking tours through Berlin's historic centre, built for travellers who want the city to make sense while they are standing inside it.</p>
              <div class="bw-route-chip" aria-label="BerlinWalk route summary">
                <div class="bw-route-line" aria-hidden="true">
                  <span class="bw-route-dot"></span>
                  <span class="bw-route-track"></span>
                  <span class="bw-route-dot"></span>
                  <span class="bw-route-track"></span>
                  <span class="bw-route-dot"></span>
                </div>
                <div class="bw-route-stops">
                  <span>Alexanderplatz</span>
                  <span>12 stops</span>
                  <span>Hackescher Markt</span>
                </div>
              </div>
            </div>

            ${this._renderLinkColumn('Tour', [
              ['Book Now', BW_SITE_FOOTER_BOOKING_URL],
              ['Meeting Point', BW_SITE_FOOTER_LINKS.meetingPoint],
              ['The Route', BW_SITE_FOOTER_LINKS.route],
              ['Reviews', BW_SITE_FOOTER_LINKS.reviews],
              ['FAQ', BW_SITE_FOOTER_LINKS.faq]
            ])}

            ${this._renderLinkColumn('Explore', [
              ['The Guide', BW_SITE_FOOTER_LINKS.guide],
              ['Blog', BW_SITE_FOOTER_LINKS.blog],
              ['Plan Your Visit', BW_SITE_FOOTER_LINKS.plan],
              ['Embed Berlin Tools', BW_SITE_FOOTER_LINKS.widgets],
              ['Instagram', BW_SITE_FOOTER_LINKS.instagram]
            ])}

            ${this._renderLinkColumn('Practical Berlin', [
              ['Berlin Transport', BW_SITE_FOOTER_LINKS.transport],
              ['Where to Stay', BW_SITE_FOOTER_LINKS.stay],
              ['Best Time to Visit', BW_SITE_FOOTER_LINKS.bestTime],
              ['Airport to Alexanderplatz', BW_SITE_FOOTER_LINKS.airport],
              ['Meeting Point Map', BW_SITE_FOOTER_LINKS.meetingPoint]
            ])}
          </div>

          <div class="bw-footer-note-grid" aria-label="Tour details">
            <div class="bw-footer-note"><strong>Start</strong>World Clock at Alexanderplatz. Look for the green umbrella.</div>
            <div class="bw-footer-note"><strong>Duration</strong>About 2 hours, ending near Hackescher Markt.</div>
            <div class="bw-footer-note"><strong>Price</strong>Free to book, tip based at the end of the walk.</div>
          </div>

          <div class="bw-footer-bottom">
            <span>&copy; 2026 BerlinWalk. All rights reserved.</span>
            <div class="bw-footer-bottom-links">
              <a href="${BW_SITE_FOOTER_LINKS.home}">berlinwalk.com</a>
              <a href="${BW_SITE_FOOTER_LINKS.instagram}">@berlinwalkingtour</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }

  _renderLinkColumn(title, links) {
    return `
      <nav class="bw-footer-col" aria-label="${this._escapeHtml(title)}">
        <h3>${this._escapeHtml(title)}</h3>
        <ul class="bw-footer-links">
          ${links.map(([label, href]) => `
            <li><a href="${this._escapeAttribute(href)}">${this._escapeHtml(label)}</a></li>
          `).join('')}
        </ul>
      </nav>
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

  _escapeAttribute(value) {
    return this._escapeHtml(value);
  }
}

if (!customElements.get('bw-site-footer')) {
  customElements.define('bw-site-footer', BWSiteFooterElement);
}
