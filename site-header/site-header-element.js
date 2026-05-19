const BW_HEADER_LOGO_URL = 'https://static.wixstatic.com/media/5a08a3_2f62d59b419643c0994771fac5765c79~mv2.png';
const BW_HEADER_BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
const BW_HEADER_LINKS = {
  home: 'https://www.berlinwalk.com/',
  tour: 'https://www.berlinwalk.com/',
  guide: 'https://www.berlinwalk.com/the-guide',
  reviews: 'https://www.berlinwalk.com/reviews',
  meetingPoint: 'https://www.berlinwalk.com/meeting-point',
  plan: 'https://www.berlinwalk.com/berlin-tools',
  blog: 'https://www.berlinwalk.com/blog',
  widgets: 'https://www.berlinwalk.com/widgets',
  faq: 'https://www.berlinwalk.com/#faq'
};

class BWHeaderElement extends HTMLElement {
  connectedCallback() {
    this._render();
    this._setupScroll();
    this._setupMobile();
    this._setupDropdown();
  }

  disconnectedCallback() {
    if (this._scrollHandler) window.removeEventListener('scroll', this._scrollHandler);
    if (this._keyHandler) document.removeEventListener('keydown', this._keyHandler);
    if (this._docClickHandler) document.removeEventListener('click', this._docClickHandler);
    if (this._dropdownReposition) {
      window.removeEventListener('resize', this._dropdownReposition);
      window.removeEventListener('scroll', this._dropdownReposition);
    }
    document.body.style.overflow = '';
  }

  _setupScroll() {
    const header = this.querySelector('.bw-header-wrap');
    const progress = this.querySelector('.bw-header-progress-bar');
    if (!header) return;
    let ticking = false;
    const update = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      header.classList.toggle('bw-header-shrunk', y > 32);
      if (progress) {
        const docH = (document.documentElement.scrollHeight || 0) - (window.innerHeight || 0);
        const pct = docH > 0 ? Math.max(0, Math.min(100, (y / docH) * 100)) : 0;
        progress.style.width = pct + '%';
      }
      ticking = false;
    };
    this._scrollHandler = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener('scroll', this._scrollHandler, { passive: true });
    update();
  }

  _setupMobile() {
    const btn = this.querySelector('.bw-header-hamburger');
    const overlay = this.querySelector('.bw-header-mobile');
    const closeBtn = this.querySelector('.bw-header-mobile-close');
    if (!btn || !overlay) return;
    const setOpen = (open) => {
      overlay.classList.toggle('bw-header-mobile-open', open);
      btn.classList.toggle('bw-header-hamburger-open', open);
      btn.setAttribute('aria-expanded', String(open));
      overlay.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    };
    btn.addEventListener('click', () => setOpen(!overlay.classList.contains('bw-header-mobile-open')));
    if (closeBtn) closeBtn.addEventListener('click', () => setOpen(false));
    overlay.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) setOpen(false);
    });
    this._keyHandler = (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('bw-header-mobile-open')) setOpen(false);
    };
    document.addEventListener('keydown', this._keyHandler);
  }

  _setupDropdown() {
    const trigger = this.querySelector('.bw-header-dropdown-trigger');
    const menu = this.querySelector('.bw-header-submenu');
    const wrap = this.querySelector('.bw-header-dropdown');
    if (!trigger || !menu || !wrap) return;
    const positionMenu = () => {
      const rect = trigger.getBoundingClientRect();
      const menuRect = menu.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const viewportW = window.innerWidth || document.documentElement.clientWidth;
      let left = cx - menuRect.width / 2;
      if (left < 12) left = 12;
      if (left + menuRect.width > viewportW - 12) left = viewportW - 12 - menuRect.width;
      menu.style.top = (rect.bottom + 10) + 'px';
      menu.style.left = left + 'px';
    };
    const setOpen = (open) => {
      wrap.classList.toggle('bw-header-dropdown-open', open);
      trigger.setAttribute('aria-expanded', String(open));
      if (open) positionMenu();
    };
    let closeTimer = null;
    const cancelClose = () => {
      if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    };
    const scheduleClose = () => {
      cancelClose();
      closeTimer = setTimeout(() => setOpen(false), 220);
    };
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      cancelClose();
      setOpen(!wrap.classList.contains('bw-header-dropdown-open'));
    });
    this._docClickHandler = (e) => {
      if (!wrap.contains(e.target) && !menu.contains(e.target)) {
        cancelClose();
        setOpen(false);
      }
    };
    document.addEventListener('click', this._docClickHandler);
    wrap.addEventListener('mouseenter', () => { cancelClose(); setOpen(true); });
    wrap.addEventListener('mouseleave', scheduleClose);
    menu.addEventListener('mouseenter', cancelClose);
    menu.addEventListener('mouseleave', scheduleClose);
    this._dropdownReposition = () => {
      if (wrap.classList.contains('bw-header-dropdown-open')) positionMenu();
    };
    window.addEventListener('resize', this._dropdownReposition);
    window.addEventListener('scroll', this._dropdownReposition, { passive: true });
  }

  _render() {
    this.innerHTML = `
      <style>
        bw-site-header {
          display: block;
          width: 100%;
        }

        .bw-header-wrap {
          --green: #1B5E20;
          --green-dark: #102414;
          --yellow: #FFE600;
          --lime: #7CB342;
          --light-green: #C5E1A5;
          --cream: #FAFAF5;
          --text: #212121;
          --muted: #4E5A4E;
          background: #FFFFFF;
          color: var(--text);
          font-family: Montserrat, Arial, sans-serif;
          margin: 0;
          position: relative;
          width: 100%;
          z-index: 100;
        }

        .bw-header-wrap *,
        .bw-header-wrap *::before,
        .bw-header-wrap *::after {
          box-sizing: border-box;
        }

        .bw-header-wrap a {
          color: inherit;
          text-decoration: none;
        }

        .bw-header-inner {
          margin: 0 auto;
          max-width: 1280px;
          padding: 0 24px;
          width: 100%;
        }

        /* Top mini-bar */
        .bw-header-top {
          background: var(--green);
          color: #FFFFFF;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.6px;
          line-height: 1;
          overflow: hidden;
          transition: max-height 220ms ease, opacity 180ms ease;
          max-height: 36px;
          opacity: 1;
        }

        .bw-header-top-items {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 6px 18px;
          justify-content: center;
          padding: 11px 0;
        }

        .bw-header-top-item {
          align-items: center;
          display: inline-flex;
          gap: 6px;
        }

        .bw-header-top-star {
          color: var(--yellow);
          font-size: 13px;
          line-height: 1;
        }

        .bw-header-top-sep {
          color: rgba(255, 255, 255, 0.35);
          font-size: 10px;
        }

        /* Main bar */
        .bw-header {
          background: #FFFFFF;
          border-bottom: 1px solid transparent;
          transition: padding 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
        }

        .bw-header-main {
          align-items: center;
          display: flex;
          gap: 24px;
          justify-content: space-between;
          padding: 16px 24px;
          transition: padding 200ms ease;
        }

        .bw-header-logo {
          align-items: center;
          display: inline-flex;
          flex: 0 0 auto;
        }

        .bw-header-logo img {
          display: block;
          height: 72px;
          transition: height 200ms ease;
          width: auto;
        }

        .bw-header-nav {
          flex: 1 1 auto;
        }

        .bw-header-nav-list {
          align-items: center;
          display: flex;
          gap: 4px;
          justify-content: center;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .bw-header-nav a,
        .bw-header-dropdown-trigger {
          background: none;
          border: 0;
          border-radius: 8px;
          color: var(--green);
          cursor: pointer;
          font-family: inherit;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 1.2px;
          line-height: 1;
          padding: 12px 14px;
          text-transform: uppercase;
          transition: background 140ms ease, color 140ms ease;
        }

        .bw-header-nav a:hover,
        .bw-header-nav a:focus-visible,
        .bw-header-dropdown-trigger:hover,
        .bw-header-dropdown-trigger:focus-visible {
          background: var(--cream);
          outline: none;
        }

        .bw-header-dropdown {
          position: relative;
        }

        .bw-header-dropdown-trigger {
          align-items: center;
          display: inline-flex;
          gap: 4px;
        }

        .bw-header-dropdown-trigger .bw-header-caret {
          font-size: 10px;
          line-height: 1;
          transition: transform 160ms ease;
        }

        .bw-header-dropdown-open .bw-header-dropdown-trigger .bw-header-caret {
          transform: rotate(180deg);
        }

        .bw-header-submenu {
          background: #FFFFFF;
          border: 1px solid var(--light-green);
          border-radius: 10px;
          box-shadow: 0 18px 44px rgba(27, 94, 32, 0.16);
          left: 0;
          list-style: none;
          margin: 0;
          min-width: 240px;
          opacity: 0;
          padding: 10px;
          pointer-events: none;
          position: fixed;
          top: 0;
          transform: translateY(-4px);
          transition: opacity 160ms ease, transform 160ms ease;
          z-index: 2147483647;
        }

        .bw-header-dropdown-open .bw-header-submenu {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
        }

        .bw-header-submenu a {
          border-radius: 6px;
          color: var(--green);
          display: block;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.4px;
          line-height: 1.3;
          padding: 12px 14px;
          text-transform: none;
        }

        .bw-header-submenu a:hover,
        .bw-header-submenu a:focus-visible {
          background: var(--cream);
          color: var(--green-dark);
        }

        .bw-header-cta {
          align-items: center;
          display: flex;
          flex: 0 0 auto;
          gap: 12px;
        }

        .bw-header-book {
          align-items: center;
          background: var(--yellow);
          border-radius: 999px;
          color: var(--green);
          display: inline-flex;
          font-size: 13px;
          font-weight: 800;
          justify-content: center;
          letter-spacing: 1px;
          line-height: 1;
          min-height: 44px;
          padding: 12px 22px;
          text-transform: uppercase;
          transition: background 160ms ease, color 160ms ease, transform 160ms ease;
        }

        .bw-header-book:hover,
        .bw-header-book:focus-visible {
          background: #fff04a;
          color: var(--green-dark);
          outline: none;
          transform: translateY(-1px);
        }

        .bw-header-hamburger {
          background: none;
          border: 0;
          cursor: pointer;
          display: none;
          flex-direction: column;
          gap: 5px;
          height: 40px;
          justify-content: center;
          padding: 8px;
          width: 40px;
        }

        .bw-header-hamburger span {
          background: var(--green);
          border-radius: 2px;
          display: block;
          height: 2.5px;
          transition: transform 200ms ease, opacity 160ms ease;
          width: 24px;
        }

        .bw-header-hamburger-open span:nth-child(1) {
          transform: translateY(7.5px) rotate(45deg);
        }
        .bw-header-hamburger-open span:nth-child(2) {
          opacity: 0;
        }
        .bw-header-hamburger-open span:nth-child(3) {
          transform: translateY(-7.5px) rotate(-45deg);
        }

        /* Scroll progress */
        .bw-header-progress {
          background: rgba(27, 94, 32, 0.06);
          height: 2px;
          position: relative;
          width: 100%;
        }

        .bw-header-progress-bar {
          background: linear-gradient(90deg, var(--green), var(--lime), var(--yellow));
          height: 100%;
          transition: width 80ms linear;
          width: 0%;
        }

        /* Shrunk state */
        .bw-header-shrunk .bw-header-top {
          max-height: 0;
          opacity: 0;
        }

        .bw-header-shrunk .bw-header {
          box-shadow: 0 8px 24px rgba(27, 94, 32, 0.08);
        }

        .bw-header-shrunk .bw-header-main {
          padding: 8px 24px;
        }

        .bw-header-shrunk .bw-header-logo img {
          height: 52px;
        }

        .bw-header-shrunk .bw-header-book {
          min-height: 38px;
          padding: 10px 18px;
        }

        /* Focus styles */
        .bw-header-wrap a:focus-visible,
        .bw-header-wrap button:focus-visible {
          outline: 3px solid rgba(255, 230, 0, 0.9);
          outline-offset: 2px;
        }

        /* Mobile overlay */
        .bw-header-mobile {
          background: rgba(16, 36, 20, 0.92);
          inset: 0;
          opacity: 0;
          pointer-events: none;
          position: fixed;
          transition: opacity 220ms ease;
          z-index: 120;
        }

        .bw-header-mobile-open {
          opacity: 1;
          pointer-events: auto;
        }

        .bw-header-mobile-inner {
          background: var(--green);
          color: #FFFFFF;
          display: flex;
          flex-direction: column;
          height: 100%;
          margin-left: auto;
          max-width: 420px;
          padding: 20px 24px 24px;
          transform: translateX(100%);
          transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
          width: 100%;
        }

        .bw-header-mobile-open .bw-header-mobile-inner {
          transform: translateX(0);
        }

        .bw-header-mobile-head {
          align-items: center;
          display: flex;
          justify-content: space-between;
          margin-bottom: 28px;
        }

        .bw-header-mobile-head img {
          background: #FFFFFF;
          border-radius: 6px;
          display: block;
          height: 40px;
          padding: 4px 8px;
          width: auto;
        }

        .bw-header-mobile-close {
          background: none;
          border: 0;
          color: #FFFFFF;
          cursor: pointer;
          font-size: 32px;
          height: 44px;
          line-height: 1;
          padding: 0;
          width: 44px;
        }

        .bw-header-mobile-nav {
          display: flex;
          flex: 1 1 auto;
          flex-direction: column;
          gap: 4px;
          overflow-y: auto;
        }

        .bw-header-mobile-nav a {
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          color: #FFFFFF;
          display: block;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: 0.4px;
          line-height: 1.2;
          padding: 18px 0;
          text-transform: none;
        }

        .bw-header-mobile-nav a:hover {
          color: var(--yellow);
        }

        .bw-header-mobile-section-label {
          color: rgba(255, 255, 255, 0.55);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.6px;
          line-height: 1;
          margin-top: 18px;
          padding: 8px 0 4px;
          text-transform: uppercase;
        }

        .bw-header-mobile-section a {
          font-size: 17px;
          padding: 14px 0;
        }

        .bw-header-mobile-cta {
          margin-top: 22px;
        }

        .bw-header-mobile-cta .bw-header-book {
          background: var(--yellow);
          color: var(--green);
          font-size: 14px;
          min-height: 52px;
          width: 100%;
        }

        .bw-header-mobile-cta .bw-header-book:hover {
          background: #fff04a;
        }

        .bw-header-mobile-trust {
          color: rgba(255, 255, 255, 0.7);
          font-family: Merriweather, Georgia, serif;
          font-size: 13px;
          line-height: 1.5;
          margin: 14px 0 0;
          text-align: center;
        }

        .bw-header-mobile-trust strong {
          color: var(--yellow);
          font-family: Montserrat, Arial, sans-serif;
          font-weight: 800;
        }

        /* Mobile breakpoint */
        @media (max-width: 880px) {
          .bw-header-top {
            display: none !important;
          }
          .bw-header-nav {
            display: none !important;
          }
          .bw-header-cta .bw-header-book {
            display: none !important;
          }
          .bw-header-hamburger {
            display: flex !important;
          }
          .bw-header {
            background: #FFFFFF !important;
          }
          .bw-header-main {
            align-items: center !important;
            background: #FFFFFF !important;
            display: flex !important;
            flex-direction: row !important;
            gap: 12px;
            justify-content: space-between !important;
            min-height: 76px;
            padding: 10px 18px !important;
          }
          .bw-header-logo {
            display: inline-flex !important;
            flex: 0 0 auto;
          }
          .bw-header-logo img {
            display: block !important;
            height: 56px !important;
            max-width: 200px;
            width: auto !important;
          }
          .bw-header-cta {
            display: flex !important;
            flex: 0 0 auto;
          }
          .bw-header-shrunk .bw-header-main {
            min-height: 56px;
            padding: 8px 18px !important;
          }
          .bw-header-shrunk .bw-header-logo img {
            height: 44px !important;
          }
        }
      </style>

      <div class="bw-header-wrap">
        <div class="bw-header-top" aria-hidden="false">
          <div class="bw-header-inner">
            <div class="bw-header-top-items">
              <span class="bw-header-top-item">
                <span class="bw-header-top-star" aria-hidden="true">★</span>
                <span>9.8 / 10 on FreeTour</span>
              </span>
              <span class="bw-header-top-sep" aria-hidden="true">•</span>
              <span class="bw-header-top-item">Free · Tip-based</span>
              <span class="bw-header-top-sep bw-header-top-item-hide-sm" aria-hidden="true">•</span>
              <span class="bw-header-top-item bw-header-top-item-hide-sm">Daily 11:30 · World Clock, Alexanderplatz</span>
            </div>
          </div>
        </div>

        <header class="bw-header" role="banner">
          <div class="bw-header-inner bw-header-main">
            <a class="bw-header-logo" href="${BW_HEADER_LINKS.home}" aria-label="BerlinWalk home">
              <img src="${BW_HEADER_LOGO_URL}" alt="BerlinWalk" loading="eager" decoding="async">
            </a>

            <nav class="bw-header-nav" aria-label="Primary">
              <ul class="bw-header-nav-list">
                <li><a href="${BW_HEADER_LINKS.tour}">Tour</a></li>
                <li><a href="${BW_HEADER_LINKS.guide}">The Guide</a></li>
                <li><a href="${BW_HEADER_LINKS.reviews}">Reviews</a></li>
                <li class="bw-header-dropdown">
                  <button class="bw-header-dropdown-trigger" type="button" aria-haspopup="true" aria-expanded="false">
                    Resources <span class="bw-header-caret" aria-hidden="true">⌄</span>
                  </button>
                  <ul class="bw-header-submenu" role="menu">
                    <li role="none"><a role="menuitem" href="${BW_HEADER_LINKS.meetingPoint}">Meeting Point</a></li>
                    <li role="none"><a role="menuitem" href="${BW_HEADER_LINKS.plan}">Plan Your Visit</a></li>
                    <li role="none"><a role="menuitem" href="${BW_HEADER_LINKS.blog}">Blog</a></li>
                    <li role="none"><a role="menuitem" href="${BW_HEADER_LINKS.widgets}">Embed Berlin Tools</a></li>
                  </ul>
                </li>
              </ul>
            </nav>

            <div class="bw-header-cta">
              <a class="bw-header-book" href="${BW_HEADER_BOOKING_URL}">Book Now</a>
              <button class="bw-header-hamburger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="bw-header-mobile-menu">
                <span></span><span></span><span></span>
              </button>
            </div>
          </div>

          <div class="bw-header-progress" aria-hidden="true">
            <div class="bw-header-progress-bar"></div>
          </div>
        </header>

        <div id="bw-header-mobile-menu" class="bw-header-mobile" aria-hidden="true" aria-label="Mobile menu">
          <div class="bw-header-mobile-inner">
            <div class="bw-header-mobile-head">
              <img src="${BW_HEADER_LOGO_URL}" alt="BerlinWalk">
              <button class="bw-header-mobile-close" type="button" aria-label="Close menu">×</button>
            </div>

            <nav class="bw-header-mobile-nav" aria-label="Mobile primary">
              <a href="${BW_HEADER_LINKS.tour}">Tour</a>
              <a href="${BW_HEADER_LINKS.guide}">The Guide</a>
              <a href="${BW_HEADER_LINKS.reviews}">Reviews</a>

              <div class="bw-header-mobile-section">
                <div class="bw-header-mobile-section-label">Resources</div>
                <a href="${BW_HEADER_LINKS.meetingPoint}">Meeting Point</a>
                <a href="${BW_HEADER_LINKS.plan}">Plan Your Visit</a>
                <a href="${BW_HEADER_LINKS.blog}">Blog</a>
                <a href="${BW_HEADER_LINKS.widgets}">Embed Berlin Tools</a>
              </div>
            </nav>

            <div class="bw-header-mobile-cta">
              <a class="bw-header-book" href="${BW_HEADER_BOOKING_URL}">Book Your Free Tour</a>
              <p class="bw-header-mobile-trust"><strong>★ 9.8 / 10</strong> on FreeTour · Daily 11:30 at the World Clock</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

if (!customElements.get('bw-site-header')) {
  customElements.define('bw-site-header', BWHeaderElement);
}
