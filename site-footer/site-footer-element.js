const BW_SITE_FOOTER_BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
const BW_SITE_FOOTER_LOGO_URL = 'https://static.wixstatic.com/media/5a08a3_2f62d59b419643c0994771fac5765c79~mv2.png';
const BW_SITE_FOOTER_LINKS = {
  home: 'https://www.berlinwalk.com/',
  meetingPoint: 'https://www.berlinwalk.com/meeting-point',
  reviews: 'https://www.berlinwalk.com/reviews',
  route: 'https://www.berlinwalk.com/berlin-walking-tour-route',
  faq: 'https://www.berlinwalk.com/#faq',
  guide: 'https://www.berlinwalk.com/the-guide',
  blog: 'https://www.berlinwalk.com/blog',
  planner: 'https://www.berlinwalk.com/berlin-trip-planner',
  games: 'https://www.berlinwalk.com/games',
  rewind: 'https://www.berlinwalk.com/games/berlin-rewind',
  battle: 'https://www.berlinwalk.com/games/berlin-battle',
  daySurvival: 'https://www.berlinwalk.com/games/berlin-day-survival',
  bouncer: 'https://www.berlinwalk.com/games/berghain-bouncer',
  smile: 'https://www.berlinwalk.com/games/berlin-smile-challenge',
  tools: 'https://www.berlinwalk.com/berlin-tools',
  widgets: 'https://www.berlinwalk.com/widgets',
  instagram: 'https://www.instagram.com/berlinwalkingtour/',
  facebook: 'https://www.facebook.com/berlinwalkingtour',
  tiktok: 'https://www.tiktok.com/@berlinwalkingtour',
  transport: 'https://www.berlinwalk.com/post/berlin-public-transport-explained-for-tourists-u-bahn-s-bahn-tram-bus',
  stay: 'https://www.berlinwalk.com/post/where-to-stay-in-berlin-best-neighborhoods-for-every-type-of-tourist',
  bestTime: 'https://www.berlinwalk.com/post/what-s-the-best-time-to-visit-berlin-a-month-by-month-guide',
  airport: 'https://www.berlinwalk.com/post/how-to-get-from-berlin-airport-to-alexanderplatz-the-easy-way',
  cityTax: 'https://www.berlinwalk.com/post/berlin-city-tax'
};

const BW_SITE_FOOTER_SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: BW_SITE_FOOTER_LINKS.instagram,
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"></rect><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"></circle><circle cx="17.5" cy="6.5" r="1.35" fill="currentColor"></circle></svg>'
  },
  {
    label: 'Facebook',
    href: BW_SITE_FOOTER_LINKS.facebook,
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M14.2 8.1h2.7V4.4c-.5-.1-2-.2-3.6-.2-3.5 0-5.8 2.1-5.8 6v3.1H4v4.1h3.5V24h4.3v-6.6h3.5l.6-4.1h-4.1v-2.7c0-1.1.3-2.5 2.4-2.5z"></path></svg>'
  },
  {
    label: 'TikTok',
    href: BW_SITE_FOOTER_LINKS.tiktok,
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M16.5 4.2c.4 1.5 1.6 2.8 3.5 3v3.5c-1.3 0-2.5-.3-3.5-1v5.4c0 3.2-2.2 5.4-5.4 5.4-2.8 0-5.1-2-5.1-4.8s2.3-4.8 5.1-4.8c.4 0 .8.1 1.1.2v3.6c-.3-.2-.7-.3-1.1-.3-1 0-1.8.7-1.8 1.7s.8 1.7 1.8 1.7c1.2 0 2-.8 2-2.4V4.2h3.4z"></path></svg>'
  }
];

class BWSiteFooterElement extends HTMLElement {
  connectedCallback() {
    this._render();
    this._bindPrivacySettingsLink();
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
          grid-template-columns: minmax(280px, 1.2fr) repeat(4, minmax(120px, 0.55fr));
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

        .bw-site-footer .bw-social-follow {
          align-items: flex-start;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin: -4px 0 22px;
          max-width: 430px;
        }

        .bw-site-footer .bw-social-label {
          color: var(--yellow);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1px;
          line-height: 1;
          text-transform: uppercase;
        }

        .bw-site-footer .bw-social-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .bw-site-footer .bw-social-link {
          align-items: center;
          background: rgba(250, 250, 245, 0.06);
          border: 1px solid rgba(197, 225, 165, 0.34);
          border-radius: 999px;
          color: var(--cream);
          display: inline-flex;
          height: 40px;
          justify-content: center;
          text-decoration: none;
          transition: background 160ms ease, border-color 160ms ease, color 160ms ease, transform 160ms ease;
          width: 40px;
        }

        .bw-site-footer .bw-social-link:hover,
        .bw-site-footer .bw-social-link:focus-visible {
          background: var(--yellow);
          border-color: var(--yellow);
          color: var(--green-dark);
          transform: translateY(-2px);
        }

        .bw-site-footer .bw-social-link svg {
          display: block;
          height: 18px;
          width: 18px;
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
          align-items: center;
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

        .bw-site-footer .bw-badge-new {
          align-items: center;
          align-self: flex-start;
          background: var(--yellow);
          border-radius: 999px;
          color: var(--green-dark);
          display: inline-flex;
          flex: 0 0 auto;
          font-size: 8px;
          font-weight: 800;
          justify-content: center;
          letter-spacing: 0.5px;
          line-height: 1;
          margin-left: 6px;
          min-height: 16px;
          padding: 2px 6px;
          vertical-align: middle;
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

        .bw-site-footer .bw-footer-bottom a,
        .bw-site-footer .bw-footer-bottom button {
          background: transparent;
          border: 0;
          color: inherit;
          cursor: pointer;
          font: inherit;
          font-weight: 700;
          padding: 0;
          text-decoration: none;
          transition: color 160ms ease;
        }

        .bw-site-footer .bw-footer-bottom a:hover,
        .bw-site-footer .bw-footer-bottom a:focus-visible,
        .bw-site-footer .bw-footer-bottom button:hover,
        .bw-site-footer .bw-footer-bottom button:focus-visible {
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
                <img class="bw-logo-img" src="${BW_SITE_FOOTER_LOGO_URL}" alt="BerlinWalk" width="1080" height="450" loading="lazy" decoding="async">
              </a>
              <p>Free tip-based walking tours through Berlin's historic centre, built for travellers who want the city to make sense while they are standing inside it.</p>
              ${this._renderSocialLinks()}
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

            ${this._renderLinkColumn('Play', [
              ['All Games', BW_SITE_FOOTER_LINKS.games],
              ['Berlin Rewind', BW_SITE_FOOTER_LINKS.rewind],
              ['Berlin Battle', BW_SITE_FOOTER_LINKS.battle],
              ['Berlin Day Survival', BW_SITE_FOOTER_LINKS.daySurvival],
              ['Berghain Bouncer', BW_SITE_FOOTER_LINKS.bouncer],
              ['Berlin Smile Challenge', BW_SITE_FOOTER_LINKS.smile]
            ])}

            ${this._renderLinkColumn('Explore', [
              ['The Guide', BW_SITE_FOOTER_LINKS.guide],
              ['Blog', BW_SITE_FOOTER_LINKS.blog],
              ['Berlin Trip Planner', BW_SITE_FOOTER_LINKS.planner],
              ['Berlin Tools', BW_SITE_FOOTER_LINKS.tools],
              ['Embed Berlin Tools', BW_SITE_FOOTER_LINKS.widgets],
              ['Instagram', BW_SITE_FOOTER_LINKS.instagram]
            ])}

            ${this._renderLinkColumn('Practical Berlin', [
              ['Berlin Transport', BW_SITE_FOOTER_LINKS.transport],
              ['Where to Stay', BW_SITE_FOOTER_LINKS.stay],
              ['Best Time to Visit', BW_SITE_FOOTER_LINKS.bestTime],
              ['Airport to Alexanderplatz', BW_SITE_FOOTER_LINKS.airport],
              ['Berlin City Tax', BW_SITE_FOOTER_LINKS.cityTax]
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
              <button type="button" data-bw-privacy-settings="true">Privacy Settings</button>
            </div>
          </div>
        </div>
      </footer>
    `;
  }

  _bindPrivacySettingsLink() {
    var button = this.querySelector('[data-bw-privacy-settings]');
    if (!button) return;
    button.addEventListener('click', this._openConsentSettings.bind(this));
  }

  _openConsentSettings(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    try {
      if (typeof window.BWOpenConsentSettings === 'function') {
        window.BWOpenConsentSettings(event);
        return;
      }
    } catch (err) {}
    try {
      if (window.UC_UI && typeof window.UC_UI.showSecondLayer === 'function') {
        window.UC_UI.showSecondLayer();
        return;
      }
      if (window.__ucCmp && typeof window.__ucCmp.showSecondLayer === 'function') {
        window.__ucCmp.showSecondLayer();
        return;
      }
      if (window.UC_UI && typeof window.UC_UI.showFirstLayer === 'function') {
        window.UC_UI.showFirstLayer();
        return;
      }
      if (window.__ucCmp && typeof window.__ucCmp.showFirstLayer === 'function') {
        window.__ucCmp.showFirstLayer();
      }
    } catch (err) {}
    try {
      document.dispatchEvent(new CustomEvent('bwOpenConsentSettings'));
    } catch (err) {}
  }

  _renderLinkColumn(title, links) {
    return `
      <nav class="bw-footer-col" aria-label="${this._escapeHtml(title)}">
        <h3>${this._escapeHtml(title)}</h3>
        <ul class="bw-footer-links">
          ${links.map(([label, href]) => {
            var labelHtml = this._escapeHtml(label);
            return '<li><a href="' + this._escapeAttribute(href) + '">' + labelHtml + '</a></li>';
          }).join('')}
        </ul>
      </nav>
    `;
  }

  _renderSocialLinks() {
    return `
      <nav class="bw-social-follow" aria-label="Follow BerlinWalk on social media">
        <span class="bw-social-label">Follow me</span>
        <div class="bw-social-list">
          ${BW_SITE_FOOTER_SOCIAL_LINKS.map((link) => `
            <a class="bw-social-link" href="${this._escapeAttribute(link.href)}" target="_blank" rel="noopener noreferrer" aria-label="${this._escapeAttribute(link.label)}">
              ${link.icon}
            </a>
          `).join('')}
        </div>
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
