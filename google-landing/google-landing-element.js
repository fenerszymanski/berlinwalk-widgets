(function () {
  const SCRIPT_URL = document.currentScript?.src || '';
  const ROOT_URL = SCRIPT_URL
    ? new URL('../', SCRIPT_URL).toString()
    : 'https://fenerszymanski.github.io/berlinwalk-widgets/';
  const AVAILABILITY_ENDPOINT = 'https://berlinwalk-content-app.vercel.app/api/booking-calendar-availability';
  const BOOKING_URL = 'https://www.berlinwalk.com/booking-form';

  const asset = (path) => new URL(path, ROOT_URL).toString();

  function ensureAssets() {
    if (!document.querySelector('link[data-bw-google-font]')) {
      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = 'https://fonts.gstatic.com';
      preconnect.crossOrigin = 'anonymous';
      const font = document.createElement('link');
      font.rel = 'stylesheet';
      font.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,600,1,0&display=swap';
      font.dataset.bwGoogleFont = 'true';
      document.head.append(preconnect, font);
    }
  }

  function cleanPath(pathname) {
    return (pathname || '/').replace(/\/+$/, '') || '/';
  }

  class BWGoogleLandingElement extends HTMLElement {
    constructor() {
      super();
      this.state = {
        loading: true,
        error: '',
        slots: [],
        selectedDate: '',
        selectedSlotId: '',
      };
    }

    connectedCallback() {
      ensureAssets();
      this._activateLanding();
      this._render();
      this._loadAvailability();
      if (/^(?:localhost|127\.0\.0\.1)$/i.test(window.location.hostname)) {
        this._track('bw_booking_page_view', { source: 'google_search_landing' });
      }
    }

    disconnectedCallback() {
      document.documentElement.classList.remove('bw-google-landing-active');
      document.body?.classList.remove('bw-google-landing-active');
    }

    async _loadAvailability() {
      try {
        const endpoint = new URL(AVAILABILITY_ENDPOINT);
        endpoint.searchParams.set('days', this.getAttribute('availability-days') || '365');
        endpoint.searchParams.set('guests', '1');
        const response = await fetch(endpoint.toString(), { credentials: 'omit' });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Availability failed');
        const slots = this._normalizeSlots(data.slots || []);
        if (!slots.length) throw new Error('No open dates found');
        this.state.slots = slots;
        this.state.selectedDate = this._dateKey(slots[0].startDate);
        this.state.selectedSlotId = slots[0].id;
        this.state.loading = false;
        this.state.error = '';
      } catch (error) {
        this.state.loading = false;
        this.state.error = 'Live dates could not load. Please try again.';
        console.error('BerlinWalk Google landing availability error:', error);
      }
      this._render();
    }

    _normalizeSlots(slots) {
      return slots
        .map((slot, index) => {
          if (!slot?.startDate) return null;
          return {
            ...slot,
            id: String(slot.id || slot.sessionId || `${slot.startDate}-${index}`),
            sessionId: slot.sessionId || slot.eventId || slot.id || '',
            timezone: slot.timezone || 'Europe/Berlin',
          };
        })
        .filter(Boolean)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    }

    _variant() {
      const value = (new URLSearchParams(window.location.search).get('utm_content') || '').toLowerCase();
      return value.includes('english_tour') || value.includes('english-tour') ? 'english_tour' : 'free_tour';
    }

    _headline() {
      return this._variant() === 'english_tour'
        ? 'English Walking Tour in Berlin'
        : 'Free Berlin Walking Tour in English';
    }

    _render() {
      const selected = this._selectedSlot();
      const dates = this._availableDates();
      const selectedDateSlots = this._slotsForDate(this.state.selectedDate);
      const heroImage = asset('gallery/images/06-1600w.webp');
      const guideImage = asset('gallery/images/13-1200w.webp');
      const logoImage = asset('google-landing/assets/bw-coin.png');
      const headline = this._headline();

      this.innerHTML = `
        <style>${this._styles()}</style>
        <main class="bw-gsl" data-headline-variant="${this._variant()}">
          <header class="bw-gsl-header">
            <a class="bw-gsl-brand" href="https://www.berlinwalk.com/" aria-label="BerlinWalk.com home">
              <img src="${logoImage}" alt="" width="54" height="54">
              <span>BerlinWalk.com</span>
            </a>
            <a class="bw-gsl-details" href="#bw-google-route" data-scroll-route>
              Tour details
              <span class="material-symbols-rounded" aria-hidden="true">arrow_forward_ios</span>
            </a>
          </header>

          <section class="bw-gsl-intro" aria-labelledby="bw-gsl-title">
            <p class="bw-gsl-eyebrow">Free to reserve · Tip-based</p>
            <h1 id="bw-gsl-title">${headline}</h1>
            <p class="bw-gsl-lead">Walk Berlin's historic centre with Yusuf, starting at the World Clock.</p>
            <div class="bw-gsl-proof" aria-label="Tour trust signals">
              <span><i class="material-symbols-rounded" aria-hidden="true">star</i>9.8/10 on FreeTour</span>
              <span><i class="material-symbols-rounded" aria-hidden="true">groups</i>Small groups</span>
            </div>
          </section>

          <figure class="bw-gsl-photo">
            <img src="${heroImage}" alt="World Clock at Alexanderplatz, the BerlinWalk meeting point">
          </figure>

          <section class="bw-gsl-book-wrap" id="bw-google-book" aria-label="Live BerlinWalk availability">
            <div class="bw-gsl-book-card">
              ${this._availabilityMarkup(selected, dates, selectedDateSlots)}
            </div>
          </section>

          <section class="bw-gsl-facts" aria-label="Tour facts">
            <span><i class="material-symbols-rounded" aria-hidden="true">schedule</i><b>~2h</b></span>
            <span><i class="material-symbols-rounded" aria-hidden="true">chat_bubble</i><b>English</b></span>
            <span><i class="material-symbols-rounded" aria-hidden="true">location_on</i><b>World Clock</b></span>
          </section>

          <section class="bw-gsl-route" id="bw-google-route">
            <p class="bw-gsl-section-label">The walk</p>
            <h2>From World Clock to Hackescher Markt</h2>
            <p>I start at Alexanderplatz, cross Berlin's historic centre and finish near Hackescher Markt. You see the places first, then I connect the history around them.</p>
            <div class="bw-gsl-route-grid">
              <article>
                <span>Start</span>
                <h3>World Clock</h3>
                <p>Meet at Alexanderplatz, beside the World Clock.</p>
              </article>
              <article>
                <span>Finish</span>
                <h3>Hackescher Markt</h3>
                <p>End near cafés, museums and S-Bahn connections.</p>
              </article>
            </div>
          </section>

          <section class="bw-gsl-guide">
            <img src="${guideImage}" alt="Yusuf, the BerlinWalk guide, holding historic Berlin photographs">
            <div>
              <p class="bw-gsl-section-label">Your guide</p>
              <h2>I guide every walk myself.</h2>
              <p>I use photographs, street details and the places in front of us to make Berlin's historic centre easier to understand.</p>
            </div>
          </section>

          <section class="bw-gsl-faq">
            <p class="bw-gsl-section-label">Before you reserve</p>
            <h2>Three quick answers</h2>
            <details open>
              <summary>Do I pay now?</summary>
              <p>No. Reserving is free. You decide the tip after the walk.</p>
            </details>
            <details>
              <summary>Where do we meet?</summary>
              <p>At the World Clock on Alexanderplatz. Your confirmation includes the exact meeting details.</p>
            </details>
            <details>
              <summary>How long is the walk?</summary>
              <p>About 2 hours, finishing near Hackescher Markt.</p>
            </details>
          </section>

          <section class="bw-gsl-final">
            <div>
              <p class="bw-gsl-section-label">Live availability</p>
              <h2>Choose your date while there are still spots.</h2>
            </div>
            <a href="#bw-google-book" data-scroll-book>See available dates</a>
          </section>

          <footer class="bw-gsl-footer">
            <span>BerlinWalk.com</span>
            <a href="https://www.instagram.com/berlinwalkingtour/">@berlinwalkingtour</a>
          </footer>
        </main>
      `;

      this._bind();
      document.title = `${headline} | BerlinWalk`;
    }

    _availabilityMarkup(selected, dates, selectedDateSlots) {
      if (this.state.loading) {
        return `
          <div class="bw-gsl-loading" role="status">
            <span class="bw-gsl-spinner" aria-hidden="true"></span>
            <strong>Loading live availability...</strong>
          </div>
        `;
      }

      if (this.state.error || !selected) {
        const fallback = this._bookingHref(null);
        return `
          <div class="bw-gsl-error" role="alert">
            <p>Live dates could not load.</p>
            <a href="${this._escape(fallback)}" target="_top">Open the booking calendar</a>
          </div>
        `;
      }

      return `
        <p class="bw-gsl-next">Next walk</p>
        <h2 class="bw-gsl-selected-date">${this._escape(this._longDate(selected.startDate))}</h2>
        <div class="bw-gsl-time-options" aria-label="Tour time">
          ${selectedDateSlots.map((slot) => `
            <button type="button" data-slot-id="${this._escape(slot.id)}" class="${slot.id === selected.id ? 'is-active' : ''}" aria-pressed="${slot.id === selected.id}">
              ${this._escape(this._time(slot.startDate))}
            </button>
          `).join('')}
        </div>
        <div class="bw-gsl-date-strip" role="listbox" aria-label="Available tour dates">
          ${dates.slice(0, 14).map((date) => `
            <button type="button" role="option" data-date="${date}" class="${date === this.state.selectedDate ? 'is-active' : ''}" aria-selected="${date === this.state.selectedDate}">
              <span>${this._escape(this._weekday(date))}</span>
              <b>${this._escape(String(Number(date.slice(8, 10))))}</b>
            </button>
          `).join('')}
        </div>
        <p class="bw-gsl-reassurance">Free reservation. No upfront payment.</p>
        <a class="bw-gsl-cta" href="${this._escape(this._bookingHref(selected))}" target="_top" data-continue>
          Reserve your free spot
        </a>
      `;
    }

    _bind() {
      this.querySelectorAll('[data-date]').forEach((button) => {
        button.addEventListener('click', () => {
          const date = button.getAttribute('data-date') || '';
          const firstSlot = this._slotsForDate(date)[0];
          if (!firstSlot) return;
          this.state.selectedDate = date;
          this.state.selectedSlotId = firstSlot.id;
          this._track('bw_booking_pick_date_click', {
            source: 'google_search_landing',
            date,
          });
          this._render();
        });
      });

      this.querySelectorAll('[data-slot-id]').forEach((button) => {
        button.addEventListener('click', () => {
          const slotId = button.getAttribute('data-slot-id') || '';
          const slot = this.state.slots.find((item) => item.id === slotId);
          if (!slot) return;
          this.state.selectedSlotId = slotId;
          this._track('bw_booking_slot_select', {
            source: 'google_search_landing',
            date: this._dateKey(slot.startDate),
            time: this._time(slot.startDate),
          });
          this._render();
        });
      });

      const continueLink = this.querySelector('[data-continue]');
      if (continueLink) {
        continueLink.addEventListener('click', () => {
          const slot = this._selectedSlot();
          this._track('bw_booking_next_click', {
            source: 'google_search_landing',
            date: slot ? this._dateKey(slot.startDate) : '',
            time: slot ? this._time(slot.startDate) : '',
          });
        });
      }

      this.querySelectorAll('[data-scroll-book]').forEach((link) => {
        link.addEventListener('click', (event) => {
          event.preventDefault();
          this.querySelector('#bw-google-book')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      });

      this.querySelectorAll('[data-scroll-route]').forEach((link) => {
        link.addEventListener('click', (event) => {
          event.preventDefault();
          this.querySelector('#bw-google-route')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
    }

    _activateLanding() {
      document.documentElement.classList.add('bw-google-landing-active');
      document.body?.classList.add('bw-google-landing-active');
      document.querySelectorAll('#SITE_CONTAINER, #site-root').forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        node.style.setProperty('display', 'none', 'important');
      });
    }

    _selectedSlot() {
      return this.state.slots.find((slot) => slot.id === this.state.selectedSlotId)
        || this._slotsForDate(this.state.selectedDate)[0]
        || null;
    }

    _slotsForDate(date) {
      return this.state.slots.filter((slot) => this._dateKey(slot.startDate) === date);
    }

    _availableDates() {
      return [...new Set(this.state.slots.map((slot) => this._dateKey(slot.startDate)))];
    }

    _dateKey(value) {
      return String(value || '').slice(0, 10);
    }

    _todayKey() {
      const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Berlin',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).formatToParts(new Date());
      const byType = Object.fromEntries(parts.map((part) => [part.type, part.value]));
      return `${byType.year}-${byType.month}-${byType.day}`;
    }

    _longDate(value) {
      const dateKey = this._dateKey(value);
      const label = new Intl.DateTimeFormat('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        timeZone: 'Europe/Berlin',
      }).format(new Date(value));
      return dateKey === this._todayKey() ? `Today, ${label}` : label;
    }

    _weekday(dateKey) {
      return new Intl.DateTimeFormat('en-GB', {
        weekday: 'short',
        timeZone: 'Europe/Berlin',
      }).format(new Date(`${dateKey}T12:00:00+02:00`));
    }

    _time(value) {
      return new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Europe/Berlin',
      }).format(new Date(value));
    }

    _bookingHref(slot) {
      const url = new URL(BOOKING_URL);
      if (slot) {
        url.searchParams.set('bookings_timezone', slot.timezone || 'Europe/Berlin');
        if (slot.serviceId) url.searchParams.set('bookings_serviceId', slot.serviceId);
        if (slot.locationId) url.searchParams.set('bookings_locationId', slot.locationId);
        if (slot.sessionId || slot.eventId) url.searchParams.set('bookings_sessionId', slot.sessionId || slot.eventId);
      }
      const incoming = new URL(window.location.href);
      [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_content',
        'utm_term',
        'utm_id',
        'gclid',
        'gbraid',
        'wbraid',
        'fbclid',
        'fbc',
        'fbp',
      ].forEach((param) => {
        if (incoming.searchParams.has(param)) url.searchParams.set(param, incoming.searchParams.get(param));
      });
      if (!url.searchParams.has('utm_source')) url.searchParams.set('utm_source', 'google');
      if (!url.searchParams.has('utm_medium')) url.searchParams.set('utm_medium', 'paid_search');
      if (!url.searchParams.has('utm_campaign')) url.searchParams.set('utm_campaign', 'bw_booking_search_test_jul2026');
      if (!url.searchParams.has('utm_content')) url.searchParams.set('utm_content', this._variant());
      return url.toString();
    }

    _params() {
      const params = new URLSearchParams(window.location.search);
      return {
        utm_source: params.get('utm_source') || '',
        utm_medium: params.get('utm_medium') || '',
        utm_campaign: params.get('utm_campaign') || '',
        utm_content: params.get('utm_content') || '',
        utm_term: params.get('utm_term') || '',
        gclid: params.get('gclid') || '',
        gbraid: params.get('gbraid') || '',
        wbraid: params.get('wbraid') || '',
        fbclid: params.get('fbclid') || '',
        fbc: params.get('fbc') || '',
        fbp: params.get('fbp') || '',
      };
    }

    _track(name, detail) {
      const params = this._params();
      const payload = {
        ...(detail || {}),
        headlineVariant: this._variant(),
        gclid: params.gclid,
        gbraid: params.gbraid,
        wbraid: params.wbraid,
      };
      if (/^(?:localhost|127\.0\.0\.1)$/i.test(window.location.hostname)) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: name, page_path: window.location.pathname, ...payload });
        return true;
      }
      document.dispatchEvent(new CustomEvent('bwBookingFunnelEvent', {
        detail: { name, payload },
      }));
      return true;
    }

    _escape(value) {
      return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    _styles() {
      return `
        html.bw-google-landing-active,
        html.bw-google-landing-active body {
          background: #FAFAF5 !important;
          margin: 0 !important;
          min-height: 100% !important;
          padding: 0 !important;
        }

        html.bw-google-landing-active #SITE_CONTAINER,
        html.bw-google-landing-active #site-root,
        body.bw-google-landing-active #bw-sticky-cta,
        body.bw-google-landing-active #bw-desktop-cta,
        body.bw-google-landing-active [data-bw-tourcta] {
          display: none !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }

        bw-google-landing {
          display: block !important;
          position: relative;
          width: 100% !important;
          z-index: 10;
        }

        .bw-gsl {
          --green: #1B5E20;
          --green-dark: #0C3B16;
          --green-ink: #083511;
          --yellow: #FFE600;
          --cream: #FAFAF5;
          --white: #FFFFFF;
          --ink: #202220;
          --muted: #4E5A4E;
          --line: #DADAD0;
          background: var(--cream);
          color: var(--ink);
          font-family: Montserrat, Arial, sans-serif;
          font-size: 16px;
          letter-spacing: 0;
          line-height: 1.45;
          margin: 0 auto;
          min-height: 100vh;
          overflow: hidden;
          width: 100%;
        }

        .bw-gsl *,
        .bw-gsl *::before,
        .bw-gsl *::after { box-sizing: border-box; }

        .bw-gsl a { color: inherit; }
        .bw-gsl img { display: block; max-width: 100%; }
        .bw-gsl h1,
        .bw-gsl h2,
        .bw-gsl h3,
        .bw-gsl p,
        .bw-gsl figure { margin: 0; }

        .bw-gsl-header {
          align-items: center;
          background: rgba(250, 250, 245, 0.98);
          border-bottom: 1px solid var(--line);
          display: flex;
          justify-content: space-between;
          min-height: 76px;
          padding: 12px clamp(20px, 5vw, 54px);
        }

        .bw-gsl-brand {
          align-items: center;
          display: inline-flex;
          gap: 12px;
          text-decoration: none;
        }

        .bw-gsl-brand img {
          border-radius: 50%;
          height: 44px;
          object-fit: cover;
          width: 44px;
        }

        .bw-gsl-brand span {
          color: var(--green-ink);
          font-size: clamp(18px, 4.8vw, 27px);
          font-weight: 800;
          letter-spacing: -0.04em;
        }

        .bw-gsl-details {
          align-items: center;
          display: inline-flex;
          font-size: 13px;
          font-weight: 700;
          gap: 5px;
          min-height: 44px;
          text-decoration: none;
        }

        .bw-gsl-details .material-symbols-rounded { font-size: 18px; }

        .bw-gsl-intro {
          margin: 0 auto;
          max-width: 1120px;
          padding: clamp(34px, 7vw, 72px) clamp(24px, 6vw, 64px) 26px;
        }

        .bw-gsl-eyebrow,
        .bw-gsl-section-label {
          color: var(--green);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.045em;
          text-transform: uppercase;
        }

        .bw-gsl-intro h1 {
          color: var(--green-ink);
          font-size: clamp(39px, 10.8vw, 72px);
          font-weight: 900;
          letter-spacing: -0.055em;
          line-height: 0.99;
          margin-top: 14px;
          max-width: 980px;
        }

        .bw-gsl-lead {
          font-size: clamp(18px, 4.9vw, 26px);
          font-weight: 500;
          line-height: 1.38;
          margin-top: 24px !important;
          max-width: 720px;
        }

        .bw-gsl-proof {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 16px 20px;
          margin-top: 26px;
        }

        .bw-gsl-proof span {
          align-items: center;
          display: inline-flex;
          font-size: 14px;
          font-weight: 600;
          gap: 9px;
        }

        .bw-gsl-proof span + span {
          border-left: 1px solid #C9C9BE;
          padding-left: 20px;
        }

        .bw-gsl-proof i {
          align-items: center;
          background: var(--green-ink);
          border-radius: 50%;
          color: white;
          display: inline-flex;
          font-size: 18px;
          height: 38px;
          justify-content: center;
          width: 38px;
        }

        .bw-gsl-photo {
          height: clamp(210px, 38vw, 430px);
          overflow: hidden;
          width: 100%;
        }

        .bw-gsl-photo img {
          height: 100%;
          object-fit: cover;
          object-position: center 40%;
          width: 100%;
        }

        .bw-gsl-book-wrap {
          margin: -30px auto 0;
          max-width: 880px;
          padding: 0 clamp(20px, 5vw, 36px);
          position: relative;
          z-index: 2;
        }

        .bw-gsl-book-card {
          background: rgba(255, 255, 255, 0.98);
          border: 1px solid #E3E3DA;
          border-radius: 18px;
          box-shadow: 0 10px 32px rgba(28, 42, 29, 0.12);
          min-height: 320px;
          padding: clamp(24px, 5vw, 40px);
        }

        .bw-gsl-next {
          color: var(--green-ink);
          font-size: 20px;
          font-weight: 500;
        }

        .bw-gsl-selected-date {
          font-size: clamp(26px, 7vw, 40px);
          font-weight: 800;
          letter-spacing: -0.035em;
          line-height: 1.06;
          margin-top: 8px !important;
        }

        .bw-gsl-time-options {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 12px;
        }

        .bw-gsl-time-options button {
          appearance: none;
          background: transparent;
          border: 0;
          border-radius: 9px;
          color: var(--green);
          cursor: pointer;
          font: inherit;
          font-size: clamp(42px, 12vw, 64px);
          font-weight: 800;
          letter-spacing: -0.055em;
          line-height: 1;
          min-height: 58px;
          padding: 2px 4px;
        }

        .bw-gsl-time-options button:not(.is-active) {
          color: #7A8779;
          font-size: clamp(28px, 8vw, 42px);
          outline: 1px solid #BDD4B8;
          padding: 6px 12px;
        }

        .bw-gsl-time-options button:focus-visible,
        .bw-gsl-date-strip button:focus-visible,
        .bw-gsl-cta:focus-visible,
        .bw-gsl-final a:focus-visible {
          outline: 3px solid #9B8700;
          outline-offset: 3px;
        }

        .bw-gsl-date-strip {
          display: grid;
          gap: 10px;
          grid-auto-columns: minmax(76px, 1fr);
          grid-auto-flow: column;
          margin-top: 18px;
          overflow-x: auto;
          padding: 2px 2px 7px;
          scroll-snap-type: x proximity;
          scrollbar-color: #B7CDB2 transparent;
          scrollbar-width: thin;
        }

        .bw-gsl-date-strip button {
          appearance: none;
          background: #FFFFFF;
          border: 1px solid #7CAB72;
          border-radius: 10px;
          color: var(--ink);
          cursor: pointer;
          display: grid;
          font: inherit;
          min-height: 74px;
          padding: 10px 12px;
          place-content: center;
          scroll-snap-align: start;
        }

        .bw-gsl-date-strip button.is-active {
          background: var(--green);
          border-color: var(--green);
          color: #FFFFFF;
        }

        .bw-gsl-date-strip button span {
          font-size: 15px;
          font-weight: 600;
          line-height: 1;
        }

        .bw-gsl-date-strip button b {
          font-size: 26px;
          font-weight: 800;
          line-height: 1.05;
          margin-top: 4px;
        }

        .bw-gsl-reassurance {
          font-size: 14px;
          margin-top: 16px !important;
        }

        .bw-gsl a.bw-gsl-cta,
        .bw-gsl a.bw-gsl-cta:visited {
          align-items: center;
          background: var(--yellow);
          border-radius: 10px;
          color: var(--green-ink) !important;
          display: flex;
          font-size: clamp(17px, 4.7vw, 22px);
          font-weight: 800;
          justify-content: center;
          margin-top: 16px;
          min-height: 60px;
          padding: 14px 18px;
          text-align: center;
          text-decoration: none;
          transition: transform 160ms ease, box-shadow 160ms ease;
        }

        .bw-gsl a.bw-gsl-cta:hover {
          box-shadow: 0 7px 18px rgba(130, 112, 0, 0.2);
          transform: translateY(-1px);
        }

        .bw-gsl-loading,
        .bw-gsl-error {
          align-items: center;
          display: flex;
          flex-direction: column;
          gap: 18px;
          justify-content: center;
          min-height: 260px;
          text-align: center;
        }

        .bw-gsl-spinner {
          animation: bw-gsl-spin 900ms linear infinite;
          border: 4px solid #DDE7DA;
          border-radius: 50%;
          border-top-color: var(--green);
          height: 42px;
          width: 42px;
        }

        @keyframes bw-gsl-spin { to { transform: rotate(360deg); } }

        .bw-gsl-error a {
          background: var(--yellow);
          border-radius: 10px;
          color: var(--green-ink) !important;
          font-weight: 800;
          padding: 14px 18px;
          text-decoration: none;
        }

        .bw-gsl-facts {
          align-items: stretch;
          border: 1px solid var(--line);
          border-radius: 14px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          margin: 38px auto 0;
          max-width: 880px;
          width: calc(100% - clamp(40px, 10vw, 72px));
        }

        .bw-gsl-facts span {
          align-items: center;
          display: flex;
          font-size: 14px;
          gap: 8px;
          justify-content: center;
          min-height: 72px;
          padding: 12px 8px;
          text-align: center;
        }

        .bw-gsl-facts span + span { border-left: 1px solid var(--line); }
        .bw-gsl-facts i { color: var(--green-ink); font-size: 28px; }
        .bw-gsl-facts b { color: var(--green-ink); font-size: 14px; }

        .bw-gsl-route,
        .bw-gsl-guide,
        .bw-gsl-faq {
          margin: 0 auto;
          max-width: 1120px;
          padding: clamp(62px, 9vw, 104px) clamp(24px, 6vw, 64px) 0;
        }

        .bw-gsl-route > h2,
        .bw-gsl-guide h2,
        .bw-gsl-faq > h2,
        .bw-gsl-final h2 {
          color: var(--green-ink);
          font-size: clamp(34px, 8.7vw, 58px);
          font-weight: 900;
          letter-spacing: -0.05em;
          line-height: 1.02;
          margin-top: 10px;
        }

        .bw-gsl-route > p:not(.bw-gsl-section-label) {
          color: var(--muted);
          font-size: clamp(17px, 4.3vw, 21px);
          margin-top: 20px;
          max-width: 820px;
        }

        .bw-gsl-route-grid {
          display: grid;
          gap: 14px;
          margin-top: 30px;
        }

        .bw-gsl-route-grid article {
          background: #FFFFFF;
          border: 1px solid #D8E2D6;
          border-left: 5px solid var(--yellow);
          border-radius: 12px;
          padding: 22px;
        }

        .bw-gsl-route-grid article span {
          color: var(--green);
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .bw-gsl-route-grid h3 {
          color: var(--green-ink);
          font-size: 23px;
          margin-top: 5px;
        }

        .bw-gsl-route-grid p {
          color: var(--muted);
          margin-top: 8px;
        }

        .bw-gsl-guide {
          align-items: center;
          display: grid;
          gap: 28px;
        }

        .bw-gsl-guide img {
          aspect-ratio: 4 / 3;
          border-radius: 16px;
          height: 100%;
          object-fit: cover;
          object-position: center 38%;
          width: 100%;
        }

        .bw-gsl-guide div > p:last-child {
          color: var(--muted);
          font-size: 18px;
          margin-top: 18px;
        }

        .bw-gsl-faq details {
          background: #FFFFFF;
          border: 1px solid var(--line);
          border-radius: 12px;
          margin-top: 12px;
          padding: 0 20px;
        }

        .bw-gsl-faq details:first-of-type { margin-top: 28px; }

        .bw-gsl-faq summary {
          color: var(--green-ink);
          cursor: pointer;
          font-size: 17px;
          font-weight: 800;
          min-height: 60px;
          padding: 18px 28px 18px 0;
          position: relative;
        }

        .bw-gsl-faq details p {
          color: var(--muted);
          padding: 0 0 20px;
        }

        .bw-gsl-final {
          align-items: center;
          background: var(--yellow);
          color: var(--green-ink);
          display: grid;
          gap: 28px;
          margin-top: clamp(62px, 10vw, 110px);
          padding: clamp(42px, 8vw, 76px) clamp(24px, 6vw, 64px);
        }

        .bw-gsl-final h2 { color: var(--green-ink); max-width: 800px; }

        .bw-gsl a[data-scroll-book],
        .bw-gsl a[data-scroll-book]:visited {
          align-items: center;
          background: var(--green);
          border-radius: 10px;
          color: #FFFFFF !important;
          display: inline-flex;
          font-size: 17px;
          font-weight: 800;
          justify-content: center;
          min-height: 58px;
          padding: 14px 20px;
          text-decoration: none;
        }

        .bw-gsl-footer {
          align-items: center;
          background: var(--green-dark);
          color: #FFFFFF;
          display: flex;
          font-size: 13px;
          font-weight: 700;
          justify-content: space-between;
          min-height: 76px;
          padding: 18px clamp(24px, 6vw, 64px);
        }

        .bw-gsl-footer a { color: #FFFFFF; }

        @media (min-width: 760px) {
          .bw-gsl-header { min-height: 86px; }
          .bw-gsl-brand img { height: 52px; width: 52px; }
          .bw-gsl-details { font-size: 16px; }
          .bw-gsl-route-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .bw-gsl-guide { grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); }
          .bw-gsl-final { grid-template-columns: minmax(0, 1fr) auto; }
          .bw-gsl a[data-scroll-book] { min-width: 240px; }
        }

        @media (min-width: 1000px) {
          .bw-gsl {
            display: grid;
            grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
          }

          .bw-gsl-header,
          .bw-gsl-facts,
          .bw-gsl-route,
          .bw-gsl-guide,
          .bw-gsl-faq,
          .bw-gsl-final,
          .bw-gsl-footer {
            grid-column: 1 / -1;
          }

          .bw-gsl-intro {
            align-self: stretch;
            display: flex;
            flex-direction: column;
            grid-column: 1;
            grid-row: 2;
            justify-content: center;
            margin: 0;
            max-width: none;
            padding: 64px 56px 64px clamp(56px, 7vw, 108px);
          }

          .bw-gsl-intro h1 { font-size: clamp(52px, 4.35vw, 66px); }
          .bw-gsl-photo { grid-column: 2; grid-row: 2; height: 700px; }
          .bw-gsl-photo img { object-position: center 42%; }

          .bw-gsl-book-wrap {
            align-self: end;
            grid-column: 2;
            grid-row: 2;
            margin: 0 36px 36px;
            max-width: none;
            padding: 0;
          }

          .bw-gsl-book-card { min-height: 0; padding: 28px; }
          .bw-gsl-facts { margin-top: 32px; }
        }

        @media (min-width: 1000px) and (max-width: 1150px) {
          .bw-gsl-proof { align-items: flex-start; flex-direction: column; gap: 12px; }
          .bw-gsl-proof span + span { border-left: 0; padding-left: 0; }
        }

        @media (max-width: 520px) {
          .bw-gsl-header { min-height: 58px; padding: 7px 18px; }
          .bw-gsl-brand { gap: 9px; }
          .bw-gsl-brand img { height: 38px; width: 38px; }
          .bw-gsl-brand span { font-size: 20px; }
          .bw-gsl-details { font-size: 12px; }
          .bw-gsl-intro { padding: 18px 24px 29px; }
          .bw-gsl-eyebrow { font-size: 12px; }
          .bw-gsl-intro h1 { font-size: clamp(35px, 8.7vw, 37px); letter-spacing: -0.075em; line-height: 1; margin-top: 11px; }
          .bw-gsl-lead { font-size: 16px; line-height: 1.34; margin-top: 12px !important; }
          .bw-gsl-proof { gap: 10px 12px; margin-top: 12px; }
          .bw-gsl-proof span { font-size: 13px; gap: 7px; }
          .bw-gsl-proof span + span { padding-left: 12px; }
          .bw-gsl-proof i { font-size: 16px; height: 28px; width: 28px; }
          .bw-gsl-photo { height: 235px; }
          .bw-gsl-photo img { max-width: none; transform: scale(1.32); }
          .bw-gsl-book-wrap { margin-top: -28px; padding-inline: 20px; }
          .bw-gsl-book-card { border-radius: 16px; min-height: 0; padding: 20px; }
          .bw-gsl-next { font-size: 16px; }
          .bw-gsl-selected-date { font-size: 23px; margin-top: 3px !important; }
          .bw-gsl-time-options { margin-top: 2px; }
          .bw-gsl-time-options button { font-size: 38px; min-height: 44px; }
          .bw-gsl-time-options button:not(.is-active) { font-size: 25px; }
          .bw-gsl-date-strip { grid-auto-columns: 77px; margin-top: 7px; width: 251px; }
          .bw-gsl-date-strip button { min-height: 52px; padding: 5px 8px; }
          .bw-gsl-date-strip button span { font-size: 12px; }
          .bw-gsl-date-strip button b { font-size: 20px; margin-top: 2px; }
          .bw-gsl-reassurance { font-size: 12px; margin-top: 6px !important; }
          .bw-gsl a.bw-gsl-cta { font-size: 18px; min-height: 54px; margin-top: 7px; padding-block: 10px; }
          .bw-gsl-facts { margin-top: 20px; }
          .bw-gsl-facts span { flex-direction: row; gap: 7px; min-height: 44px; padding-block: 5px; }
          .bw-gsl-facts i { font-size: 23px; font-variation-settings: 'FILL' 0, 'wght' 600, 'GRAD' 0, 'opsz' 24; }
          .bw-gsl-facts b { font-size: 12px; font-weight: 600; }
          .bw-gsl-route { padding-top: 14px; }
          .bw-gsl-route > .bw-gsl-section-label { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .bw-gsl *,
          .bw-gsl *::before,
          .bw-gsl *::after {
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `;
    }
  }

  if (!customElements.get('bw-google-landing')) {
    customElements.define('bw-google-landing', BWGoogleLandingElement);
  }

  if (cleanPath(window.location.pathname) === '/book-berlin-walking-tour' && !document.querySelector('bw-google-landing')) {
    const mount = () => {
      if (document.querySelector('bw-google-landing')) return;
      document.body.appendChild(document.createElement('bw-google-landing'));
    };
    if (document.body) mount();
    else document.addEventListener('DOMContentLoaded', mount, { once: true });
  }
})();
