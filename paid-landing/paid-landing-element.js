(function () {
  const SCRIPT_URL = document.currentScript?.src || '';
  const BASE_URL = SCRIPT_URL
    ? new URL('../', SCRIPT_URL).toString()
    : 'https://fenerszymanski.github.io/berlinwalk-widgets/';
  const CALENDAR_SCRIPT_URL = new URL('booking-calendar/booking-calendar-element.js', BASE_URL).toString();
  const TRACK_ENDPOINT = 'https://berlinwalk-content-app.vercel.app/api/pf-event';
  const LOGO_URL = 'https://static.wixstatic.com/media/5a08a3_2f62d59b419643c0994771fac5765c79~mv2.png';

  const asset = (path) => new URL(path, BASE_URL).toString();

  function ensureBookingCalendar() {
    if (customElements.get('bw-booking-calendar')) return Promise.resolve();
    if (window.__bwBookingCalendarLoading) return window.__bwBookingCalendarLoading;

    window.__bwBookingCalendarLoading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = CALENDAR_SCRIPT_URL;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });

    return window.__bwBookingCalendarLoading;
  }

  function ensureFont() {
    if (document.querySelector('link[data-bw-paid-landing-font]')) return;
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://fonts.gstatic.com';
    preconnect.crossOrigin = 'anonymous';

    const font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap';
    font.dataset.bwPaidLandingFont = 'true';

    document.head.appendChild(preconnect);
    document.head.appendChild(font);
  }

  class BWPaidLandingElement extends HTMLElement {
    connectedCallback() {
      ensureFont();
      ensureBookingCalendar().catch((error) => {
        console.error('BerlinWalk paid landing calendar loader failed:', error);
      });
      this._render();
      this._bind();
      this._track('bw_booking_page_view', { source: 'paid_landing' });
    }

    disconnectedCallback() {
      if (this._stickyObserver) this._stickyObserver.disconnect();
      if (this._scrollHandler) window.removeEventListener('scroll', this._scrollHandler);
      if (this._resizeHandler) window.removeEventListener('resize', this._resizeHandler);
    }

    _render() {
      const heroImage = asset('gallery/images/06-1600w.webp');
      const routeImage = asset('gallery/images/08-1600w.webp');
      const guideImage = asset('gallery/images/13-1200w.webp');
      const featureStory = asset('gallery/images/10-1200w.webp');
      const featureLogistics = asset('gallery/images/11-1200w.webp');
      const featureTip = asset('gallery/images/01-1200w.webp');

      this.innerHTML = `
        <style>${this._styles()}</style>
        <main class="bw-paid-landing" style="--bw-paid-hero-image: url('${heroImage}'); --bw-paid-route-image: url('${routeImage}'); --bw-paid-guide-image: url('${guideImage}');">
          <div class="bw-paid-top-strip">9.8 / 10 on FreeTour - Free to reserve - Daily 11:30 - World Clock, Alexanderplatz</div>

          <section class="bw-paid-hero" id="bw-paid-book">
            <div class="bw-paid-inner">
              <div class="bw-paid-mini-nav" aria-label="BerlinWalk">
                <img class="bw-paid-logo" src="${LOGO_URL}" alt="BerlinWalk">
                <span>Tip-based walking tour through historic Berlin</span>
              </div>

              <div class="bw-paid-hero-grid">
                <div class="bw-paid-hero-copy">
                  <p class="bw-paid-eyebrow">No upfront payment</p>
                  <h1>Free Berlin Walking Tour</h1>
                  <p class="bw-paid-lead">Meet at the World Clock, walk the historic centre in about 2 hours, and understand what you are looking at while Berlin is still fresh.</p>
                  <div class="bw-paid-facts" aria-label="Tour facts">
                    <span>~2 hours</span>
                    <span>12 stops</span>
                    <span>English</span>
                    <span>Tip-based</span>
                    <span>Small groups</span>
                  </div>
                  <div class="bw-paid-actions">
                    <a class="bw-paid-button bw-paid-button-primary" href="#bw-paid-calendar" data-scroll-target="bw-paid-calendar" data-track-pick-date>Pick your date</a>
                    <a class="bw-paid-button bw-paid-button-secondary" href="#bw-paid-route" data-scroll-target="bw-paid-route">See the route</a>
                  </div>
                  <p class="bw-paid-note">Phone number is used only for tour-day coordination if you are late or cannot find the group.</p>
                </div>

                <aside class="bw-paid-booking-panel" id="bw-paid-calendar" aria-label="Pick your tour date">
                  <div class="bw-paid-booking-above">
                    <strong>Live availability</strong>
                    <span>Free reservation, details next</span>
                  </div>
                  <bw-booking-calendar
                    availability-days="${this.getAttribute('availability-days') || '365'}"
                    service-title="Pick your tour date"
                    cta-label="Reserve your spot">
                  </bw-booking-calendar>
                </aside>
              </div>
            </div>
          </section>

          <section class="bw-paid-trust" aria-label="Trust signals">
            <div class="bw-paid-inner bw-paid-trust-grid">
              <div><b>Free to reserve</b>No card and no upfront payment.</div>
              <div><b>Central start</b>World Clock, Alexanderplatz.</div>
              <div><b>Clear finish</b>Near Hackescher Markt.</div>
              <div><b>Local guide</b>Berlin explained while you walk.</div>
            </div>
          </section>

          <section class="bw-paid-section" id="bw-paid-why">
            <div class="bw-paid-inner">
              <div class="bw-paid-section-head">
                <h2>A first Berlin walk that makes the city click</h2>
                <p>Built for travellers who want context, practical orientation, and a confident first route through the historic centre.</p>
              </div>

              <div class="bw-paid-feature-grid">
                <article class="bw-paid-feature">
                  <div class="bw-paid-feature-img" style="background-image: url('${featureStory}');"></div>
                  <div class="bw-paid-feature-body">
                    <b>Stories you can see</b>
                    <p>Old images, maps, and street-level details connect the places in front of you with the Berlin that used to stand there.</p>
                  </div>
                </article>
                <article class="bw-paid-feature">
                  <div class="bw-paid-feature-img" style="background-image: url('${featureLogistics}');"></div>
                  <div class="bw-paid-feature-body">
                    <b>Easy first-day logistics</b>
                    <p>Start centrally, walk at a practical pace, and finish near food, transit, museums, and the rest of your Berlin day.</p>
                  </div>
                </article>
                <article class="bw-paid-feature">
                  <div class="bw-paid-feature-img" style="background-image: url('${featureTip}');"></div>
                  <div class="bw-paid-feature-body">
                    <b>Tip-based, not prepaid</b>
                    <p>Reserve for free. At the end, you decide the tip based on the value of the walk and your own budget.</p>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <section class="bw-paid-route" id="bw-paid-route" aria-label="Tour route preview">
            <div class="bw-paid-inner bw-paid-route-layout">
              <div class="bw-paid-route-copy">
                <p class="bw-paid-eyebrow">The route</p>
                <h2>From World Clock to Hackescher Markt</h2>
                <p>The walk is designed as one clear story through Berlin's historic centre, not a random checklist of sights.</p>
              </div>

              <div class="bw-paid-route-map" aria-label="Route summary">
                <div class="bw-paid-route-line" aria-hidden="true">
                  <span>1</span>
                  <i></i>
                  <span>12</span>
                  <i></i>
                  <span>2h</span>
                </div>
                <div class="bw-paid-route-labels">
                  <div>
                    <b>Start at Alexanderplatz</b>
                    <small>Meet at the World Clock, easy to reach by U-Bahn, S-Bahn, tram, and bus.</small>
                  </div>
                  <div>
                    <b>Connect 12 stops</b>
                    <small>Medieval Berlin, Museum Island, political memory, and practical shortcuts between sights.</small>
                  </div>
                  <div>
                    <b>Finish near Hackescher Markt</b>
                    <small>Simple handoff to lunch, museums, transport, or your next Berlin plan.</small>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="bw-paid-section bw-paid-guide">
            <div class="bw-paid-inner bw-paid-guide-layout">
              <div class="bw-paid-guide-photo" role="img" aria-label="BerlinWalk guide Yusuf with historic photos on tour"></div>
              <div class="bw-paid-guide-copy">
                <p class="bw-paid-eyebrow">Your guide</p>
                <h2>Berlin explained by a local guide, not a script.</h2>
                <p>Yusuf built BerlinWalk for visitors who want the city to make sense while they are standing inside it.</p>
                <ul>
                  <li>Small-group format, practical pace, and clear meeting instructions.</li>
                  <li>Historical context without turning the walk into a lecture.</li>
                  <li>Useful local tips for what to do after the tour ends.</li>
                </ul>
              </div>
            </div>
          </section>

          <section class="bw-paid-section">
            <div class="bw-paid-inner">
              <div class="bw-paid-section-head">
                <h2>Quick answers before you reserve</h2>
                <p>Short, practical answers for the questions that usually slow people down.</p>
              </div>
              <div class="bw-paid-faq-grid">
                <details open>
                  <summary>Do I pay anything now?</summary>
                  <p>No. The reservation is free and there is no upfront payment. You can tip at the end of the walk.</p>
                </details>
                <details>
                  <summary>Where do we meet?</summary>
                  <p>At the World Clock on Alexanderplatz. The exact meeting details are included in the booking confirmation.</p>
                </details>
                <details>
                  <summary>How long is the walk?</summary>
                  <p>About 2 hours, ending near Hackescher Markt.</p>
                </details>
                <details>
                  <summary>Why do you ask for a phone number?</summary>
                  <p>Only for tour-day coordination, especially if you are late or cannot find the group.</p>
                </details>
              </div>
            </div>
          </section>

          <section class="bw-paid-final-cta">
            <div class="bw-paid-inner">
              <div>
                <h2>Pick a date while there are still spots.</h2>
                <p>Reserve for free now. Add your attendee details on the next step.</p>
              </div>
              <a class="bw-paid-button" href="#bw-paid-calendar" data-scroll-target="bw-paid-calendar" data-track-pick-date>Pick your date</a>
            </div>
          </section>

          <div class="bw-paid-sticky-cta">
            <a class="bw-paid-button" href="#bw-paid-calendar" data-scroll-target="bw-paid-calendar" data-track-pick-date>Pick your date</a>
          </div>
        </main>
      `;
    }

    _bind() {
      const links = Array.from(this.querySelectorAll('[data-scroll-target]'));
      links.forEach((link) => {
        link.addEventListener('click', (event) => {
          event.preventDefault();
          const target = this.querySelector(`#${link.getAttribute('data-scroll-target')}`);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (link.hasAttribute('data-track-pick-date')) {
            this._track('bw_booking_pick_date_click', {
              label: link.textContent.trim(),
              source: 'paid_landing_anchor',
            });
          }
        });
      });

      const calendar = this.querySelector('bw-booking-calendar');
      if (calendar) {
        calendar.addEventListener('bw-booking-calendar-change', (event) => {
          const detail = event.detail || {};
          const eventName = detail.action === 'slot' ? 'bw_booking_slot_select' : 'bw_booking_pick_date_click';
          this._track(eventName, {
            source: 'booking_calendar',
            action: detail.action,
            date: detail.date,
            time: detail.time,
          });
        });
        calendar.addEventListener('bw-booking-calendar-continue', (event) => {
          const detail = event.detail || {};
          this._track('bw_booking_next_click', {
            source: 'booking_calendar',
            date: detail.date,
            time: detail.time,
          });
        });
      }

      this._setupStickyCta(calendar);
    }

    _setupStickyCta(calendar) {
      const sticky = this.querySelector('.bw-paid-sticky-cta');
      let calendarVisible = true;

      const update = () => {
        if (!sticky) return;
        const shouldShow = !calendarVisible && window.scrollY > 260 && window.innerWidth <= 620;
        sticky.classList.toggle('is-visible', shouldShow);
      };

      this._scrollHandler = update;
      this._resizeHandler = update;

      if (sticky && calendar && 'IntersectionObserver' in window) {
        this._stickyObserver = new IntersectionObserver((entries) => {
          calendarVisible = entries.some((entry) => entry.isIntersecting);
          update();
        }, { threshold: 0.05 });
        this._stickyObserver.observe(calendar);
      }

      window.addEventListener('scroll', this._scrollHandler, { passive: true });
      window.addEventListener('resize', this._resizeHandler);
    }

    _track(name, detail) {
      const now = new Date().toISOString();
      const params = this._params();
      const payload = {
        event: name,
        eventName: name,
        pagePath: window.location.pathname,
        detail: detail || {},
        ts: now,
      };

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(payload);

      if (typeof window.gtag === 'function') {
        window.gtag('event', name, detail || {});
      }
      if (typeof window.fbq === 'function') {
        window.fbq('trackCustom', name, detail || {});
      }

      if (!/(^|\.)berlinwalk\.com$/i.test(window.location.hostname)) return;

      fetch(TRACK_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          eventName: name,
          timestamp: now,
          sessionId: this._sessionId(),
          pagePath: window.location.pathname,
          landingPage: window.location.href,
          referrer: document.referrer || '',
          isPaid: true,
          screenWidth: String(window.screen && window.screen.width || ''),
          viewportWidth: String(window.innerWidth || ''),
          utmSource: params.utm_source,
          utmMedium: params.utm_medium,
          utmCampaign: params.utm_campaign,
          utmContent: params.utm_content,
          utmTerm: params.utm_term,
          fbclid: params.fbclid,
          fbc: params.fbc,
          fbp: params.fbp,
          payload: detail || {},
        }),
      }).catch(() => {});
    }

    _sessionId() {
      try {
        const key = 'bw_paid_landing_session_id';
        const existing = window.sessionStorage.getItem(key);
        if (existing) return existing;
        const next = `bwpl_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
        window.sessionStorage.setItem(key, next);
        return next;
      } catch {
        return `bwpl_${Date.now().toString(36)}`;
      }
    }

    _params() {
      const params = new URLSearchParams(window.location.search);
      return {
        utm_source: params.get('utm_source') || '',
        utm_medium: params.get('utm_medium') || '',
        utm_campaign: params.get('utm_campaign') || '',
        utm_content: params.get('utm_content') || '',
        utm_term: params.get('utm_term') || '',
        fbclid: params.get('fbclid') || '',
        fbc: params.get('fbc') || '',
        fbp: params.get('fbp') || '',
      };
    }

    _styles() {
      return `
        .bw-paid-landing {
          --green: #1B5E20;
          --green-dark: #0E2A13;
          --yellow: #FFE600;
          --cream: #FAFAF5;
          --white: #FFFFFF;
          --ink: #212121;
          --muted: #4E5A4E;
          --line: #DCE3DD;
          background: var(--cream);
          color: var(--ink);
          font-family: Montserrat, Arial, sans-serif;
          letter-spacing: 0;
          line-height: 1.5;
          margin: 0;
          min-height: 100vh;
          overflow-x: hidden;
          width: 100%;
        }

        .bw-paid-landing *,
        .bw-paid-landing *::before,
        .bw-paid-landing *::after {
          box-sizing: border-box;
        }

        .bw-paid-landing a {
          color: inherit;
        }

        .bw-paid-landing img {
          display: block;
          max-width: 100%;
        }

        .bw-paid-landing h1,
        .bw-paid-landing h2,
        .bw-paid-landing h3,
        .bw-paid-landing p {
          margin-top: 0;
        }

        .bw-paid-top-strip {
          background: var(--green);
          color: var(--white);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0;
          padding: 8px 16px;
          text-align: center;
        }

        .bw-paid-hero {
          background:
            linear-gradient(90deg, rgba(10, 34, 13, 0.94) 0%, rgba(10, 34, 13, 0.78) 43%, rgba(10, 34, 13, 0.36) 100%),
            linear-gradient(0deg, rgba(10, 34, 13, 0.72) 0%, rgba(10, 34, 13, 0) 42%),
            var(--bw-paid-hero-image);
          background-position: center;
          background-size: cover;
          color: var(--white);
          min-height: clamp(640px, 86svh, 780px);
          padding: clamp(18px, 3vw, 34px) 16px clamp(28px, 5vw, 54px);
        }

        .bw-paid-inner {
          margin: 0 auto;
          max-width: 1120px;
          min-width: 0;
          width: 100%;
        }

        .bw-paid-mini-nav {
          align-items: center;
          display: flex;
          gap: 18px;
          justify-content: space-between;
          margin-bottom: clamp(28px, 6vw, 74px);
        }

        .bw-paid-logo {
          background: rgba(255, 255, 255, 0.96);
          border-radius: 6px;
          padding: 8px 14px;
          width: 176px;
        }

        .bw-paid-mini-nav span {
          color: #E7F2E3;
          font-size: 12px;
          font-weight: 800;
          text-align: right;
          text-transform: uppercase;
        }

        .bw-paid-hero-grid {
          align-items: center;
          display: grid;
          gap: clamp(22px, 5vw, 58px);
          grid-template-columns: minmax(0, 1.06fr) minmax(340px, 420px);
          min-width: 0;
        }

        .bw-paid-eyebrow {
          color: var(--yellow);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.04em;
          margin: 0 0 10px;
          text-transform: uppercase;
        }

        .bw-paid-hero h1 {
          color: inherit;
          font-size: clamp(42px, 6vw, 78px);
          line-height: 0.95;
          margin-bottom: 0;
          max-width: 10ch;
          text-wrap: balance;
        }

        .bw-paid-lead {
          color: #F1F8EE;
          font-size: clamp(16px, 1.8vw, 20px);
          font-weight: 700;
          line-height: 1.45;
          margin: 18px 0 0;
          max-width: 58ch;
        }

        .bw-paid-facts {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 22px 0 0;
        }

        .bw-paid-facts span {
          background: rgba(255, 255, 255, 0.14);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 999px;
          color: var(--white);
          font-size: 12px;
          font-weight: 800;
          line-height: 1;
          padding: 10px 12px;
          text-transform: uppercase;
        }

        .bw-paid-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin: 24px 0 0;
        }

        .bw-paid-button {
          align-items: center;
          border-radius: 8px;
          display: inline-flex;
          font-size: 15px;
          font-weight: 800;
          justify-content: center;
          min-height: 46px;
          padding: 0 18px;
          text-decoration: none;
        }

        .bw-paid-button-primary {
          background: var(--yellow);
          color: var(--ink);
        }

        .bw-paid-button-secondary {
          background: rgba(255, 255, 255, 0.95);
          color: var(--green);
        }

        .bw-paid-note {
          color: #DDEED8;
          font-size: 13px;
          font-weight: 700;
          margin: 14px 0 0;
          max-width: 58ch;
        }

        .bw-paid-booking-panel {
          color: var(--ink);
          min-width: 0;
        }

        .bw-paid-booking-above {
          align-items: center;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(255, 255, 255, 0.68);
          border-radius: 10px 10px 0 0;
          color: var(--green);
          display: flex;
          gap: 10px;
          justify-content: space-between;
          padding: 10px 12px;
        }

        .bw-paid-booking-above strong,
        .bw-paid-booking-above span {
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .bw-paid-booking-above span {
          color: var(--muted);
          font-size: 11px;
          text-align: right;
        }

        .bw-paid-booking-panel bw-booking-calendar .bw-cal-shell {
          border-top-left-radius: 0;
          border-top-right-radius: 0;
          box-shadow: 0 22px 60px rgba(0, 0, 0, 0.28);
        }

        .bw-paid-booking-panel bw-booking-calendar .bw-cal-cta {
          color: #FFFFFF;
        }

        .bw-paid-section {
          padding: clamp(34px, 5vw, 64px) 16px;
        }

        .bw-paid-trust {
          background: var(--white);
          border-bottom: 1px solid var(--line);
          border-top: 1px solid var(--line);
          padding: 18px 16px;
        }

        .bw-paid-trust-grid {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .bw-paid-trust-grid div {
          border-left: 4px solid var(--yellow);
          color: var(--muted);
          font-size: 13px;
          font-weight: 700;
          padding: 4px 0 4px 10px;
        }

        .bw-paid-trust-grid b {
          color: var(--green);
          display: block;
          font-size: 15px;
          line-height: 1.2;
          margin-bottom: 2px;
        }

        .bw-paid-section-head {
          display: grid;
          gap: 8px;
          margin: 0 0 20px;
          max-width: 760px;
        }

        .bw-paid-section-head h2 {
          color: var(--green);
          font-size: clamp(30px, 4vw, 46px);
          line-height: 1.02;
          margin: 0;
          text-wrap: balance;
        }

        .bw-paid-section-head p {
          color: var(--muted);
          font-size: 16px;
          font-weight: 700;
          margin: 0;
        }

        .bw-paid-feature-grid {
          display: grid;
          gap: 14px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .bw-paid-feature {
          background: var(--white);
          border: 1px solid var(--line);
          border-radius: 8px;
          overflow: hidden;
        }

        .bw-paid-feature-img {
          aspect-ratio: 16 / 10;
          background-position: center;
          background-size: cover;
        }

        .bw-paid-feature-body {
          padding: 16px;
        }

        .bw-paid-feature b {
          color: var(--green);
          display: block;
          font-size: 18px;
          line-height: 1.2;
          margin-bottom: 8px;
        }

        .bw-paid-feature p {
          color: var(--muted);
          font-size: 14px;
          font-weight: 600;
          margin: 0;
        }

        .bw-paid-route {
          background:
            linear-gradient(90deg, rgba(14, 42, 19, 0.98) 0%, rgba(14, 42, 19, 0.92) 45%, rgba(14, 42, 19, 0.72) 100%),
            var(--bw-paid-route-image);
          background-position: center;
          background-size: cover;
          color: var(--white);
          overflow: hidden;
          padding: clamp(44px, 6vw, 78px) 16px;
        }

        .bw-paid-route-layout {
          display: grid;
          gap: 26px;
          grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
          min-width: 0;
        }

        .bw-paid-route-copy h2 {
          color: var(--yellow);
          font-size: clamp(32px, 4vw, 50px);
          line-height: 1;
          margin: 0 0 12px;
        }

        .bw-paid-route-copy p {
          color: #DFEDDB;
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 0;
          max-width: 62ch;
        }

        .bw-paid-route-map {
          align-self: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 18px;
        }

        .bw-paid-route-line {
          align-items: center;
          display: grid;
          gap: 8px;
          grid-template-columns: auto 1fr auto 1fr auto;
          margin-bottom: 16px;
        }

        .bw-paid-route-line span {
          align-items: center;
          background: var(--yellow);
          border-radius: 999px;
          color: var(--ink);
          display: inline-flex;
          font-size: 12px;
          font-weight: 800;
          height: 34px;
          justify-content: center;
          width: 34px;
        }

        .bw-paid-route-line i {
          border-top: 3px dashed var(--yellow);
          min-width: 0;
        }

        .bw-paid-route-labels {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .bw-paid-route-labels b {
          color: var(--white);
          display: block;
          font-size: 14px;
          line-height: 1.2;
          margin-bottom: 3px;
        }

        .bw-paid-route-labels small {
          color: #CFE4C8;
          display: block;
          font-size: 12px;
          font-weight: 700;
          line-height: 1.35;
        }

        .bw-paid-guide {
          background: var(--white);
        }

        .bw-paid-guide-layout {
          align-items: center;
          display: grid;
          gap: 24px;
          grid-template-columns: minmax(260px, 0.42fr) minmax(0, 0.58fr);
          min-width: 0;
        }

        .bw-paid-guide-photo {
          aspect-ratio: 4 / 5;
          background:
            linear-gradient(180deg, rgba(10, 34, 13, 0), rgba(10, 34, 13, 0.66)),
            var(--bw-paid-guide-image);
          background-position: center;
          background-size: cover;
          border-radius: 8px;
          min-height: 360px;
        }

        .bw-paid-guide-copy h2 {
          color: var(--green);
          font-size: clamp(30px, 4vw, 46px);
          line-height: 1.02;
          margin: 0 0 12px;
          overflow-wrap: anywhere;
        }

        .bw-paid-guide-copy p {
          color: var(--muted);
          font-size: 16px;
          font-weight: 700;
          margin: 0 0 16px;
        }

        .bw-paid-guide-copy ul {
          display: grid;
          gap: 10px;
          margin: 0;
          padding: 0;
        }

        .bw-paid-guide-copy li {
          align-items: start;
          color: var(--ink);
          display: grid;
          font-size: 14px;
          font-weight: 700;
          gap: 9px;
          grid-template-columns: 22px 1fr;
          list-style: none;
        }

        .bw-paid-guide-copy li::before {
          background: var(--yellow);
          border-radius: 999px;
          content: "";
          height: 10px;
          margin-top: 6px;
          width: 10px;
        }

        .bw-paid-faq-grid {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .bw-paid-faq-grid details {
          background: var(--white);
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 14px 16px;
        }

        .bw-paid-faq-grid summary {
          color: var(--green);
          cursor: pointer;
          font-weight: 800;
        }

        .bw-paid-faq-grid p {
          color: var(--muted);
          font-size: 14px;
          font-weight: 600;
          margin: 10px 0 0;
        }

        .bw-paid-final-cta {
          background: var(--yellow);
          color: var(--ink);
          padding: clamp(34px, 5vw, 64px) 16px;
        }

        .bw-paid-final-cta .bw-paid-inner {
          align-items: center;
          display: grid;
          gap: 18px;
          grid-template-columns: 1fr auto;
        }

        .bw-paid-final-cta h2 {
          font-size: clamp(28px, 4vw, 44px);
          line-height: 1.02;
          margin: 0;
        }

        .bw-paid-final-cta p {
          font-weight: 800;
          margin: 8px 0 0;
        }

        .bw-paid-final-cta .bw-paid-button {
          background: var(--green);
          color: var(--white);
          min-width: 190px;
        }

        .bw-paid-sticky-cta {
          bottom: 12px;
          display: none;
          left: 12px;
          position: fixed;
          right: 12px;
          z-index: 20;
        }

        .bw-paid-sticky-cta a {
          background: var(--yellow);
          border: 1px solid rgba(33, 33, 33, 0.12);
          border-radius: 999px;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.22);
          color: var(--ink);
          display: flex;
          font-weight: 800;
          justify-content: center;
          min-height: 52px;
          text-decoration: none;
          width: 100%;
        }

        @media (max-width: 940px) {
          .bw-paid-hero {
            min-height: auto;
          }

          .bw-paid-hero-grid,
          .bw-paid-route-layout,
          .bw-paid-guide-layout,
          .bw-paid-final-cta .bw-paid-inner {
            grid-template-columns: minmax(0, 1fr);
          }

          .bw-paid-booking-panel {
            max-width: 430px;
          }

          .bw-paid-trust-grid,
          .bw-paid-feature-grid,
          .bw-paid-faq-grid {
            grid-template-columns: 1fr 1fr;
          }

          .bw-paid-guide-photo {
            aspect-ratio: 16 / 10;
            min-height: 280px;
          }
        }

        @media (max-width: 620px) {
          .bw-paid-top-strip {
            font-size: 11px;
            padding: 7px 8px;
          }

          .bw-paid-hero {
            padding-left: 10px;
            padding-right: 10px;
          }

          .bw-paid-mini-nav {
            align-items: start;
            display: grid;
            gap: 10px;
            margin-bottom: 20px;
          }

          .bw-paid-mini-nav span {
            text-align: left;
          }

          .bw-paid-logo {
            width: 142px;
          }

          .bw-paid-hero h1 {
            font-size: 38px;
          }

          .bw-paid-lead {
            font-size: 15px;
            line-height: 1.4;
            margin-top: 12px;
          }

          .bw-paid-facts {
            gap: 6px;
            margin-top: 16px;
          }

          .bw-paid-facts span {
            font-size: 11px;
            padding: 9px 10px;
          }

          .bw-paid-actions,
          .bw-paid-note {
            display: none;
          }

          .bw-paid-button {
            width: 100%;
          }

          .bw-paid-booking-panel {
            max-width: none;
          }

          .bw-paid-booking-above {
            align-items: start;
            display: grid;
            gap: 2px;
            justify-content: start;
          }

          .bw-paid-booking-above span {
            text-align: left;
          }

          .bw-paid-trust-grid,
          .bw-paid-feature-grid,
          .bw-paid-faq-grid,
          .bw-paid-route-labels {
            grid-template-columns: 1fr;
          }

          .bw-paid-route-line {
            grid-template-columns: auto 1fr auto;
          }

          .bw-paid-route-line span:nth-of-type(3),
          .bw-paid-route-line i:nth-of-type(2) {
            display: none;
          }

          .bw-paid-guide-photo {
            min-height: 240px;
          }

          .bw-paid-final-cta {
            padding-bottom: 86px;
          }

          .bw-paid-sticky-cta {
            display: block;
            opacity: 0;
            pointer-events: none;
            transform: translateY(120%);
            transition: opacity 180ms ease, transform 180ms ease;
          }

          .bw-paid-sticky-cta.is-visible {
            opacity: 1;
            pointer-events: auto;
            transform: translateY(0);
          }
        }
      `;
    }
  }

  if (!customElements.get('bw-paid-landing')) {
    customElements.define('bw-paid-landing', BWPaidLandingElement);
  }
}());
