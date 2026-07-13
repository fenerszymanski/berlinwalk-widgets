(function () {
  const SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : '';
  const BASE_URL = SCRIPT_URL
    ? new URL('../', SCRIPT_URL).toString()
    : 'https://fenerszymanski.github.io/berlinwalk-widgets/';
  const WIDGET_PATH = 'ultimate-berlin-trip-planner/';
  const BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';

  const asset = (path) => new URL(path, BASE_URL).toString();

  function currentConsentPolicy() {
    try {
      const manager = window.consentPolicyManager;
      const current = manager && typeof manager.getCurrentConsentPolicy === 'function'
        ? manager.getCurrentConsentPolicy()
        : null;
      return current && (current.policy || current) || {};
    } catch (error) {
      return {};
    }
  }

  function analyticsConsent() {
    return currentConsentPolicy().analytics === true;
  }

  function advertisingConsent() {
    const policy = currentConsentPolicy();
    return policy.advertising === true || policy.marketing === true;
  }

  function functionalConsent() {
    return currentConsentPolicy().functional === true;
  }

  function cookieValue(name) {
    try {
      const prefix = `${String(name || '')}=`;
      const part = String(document.cookie || '').split(';').map((item) => item.trim()).find((item) => item.startsWith(prefix));
      return part ? decodeURIComponent(part.slice(prefix.length)) : '';
    } catch (error) {
      return '';
    }
  }

  function metaAttribution() {
    if (!advertisingConsent()) return { fbclid: '', fbc: '', fbp: '' };
    try {
      const params = new URLSearchParams(window.location.search || '');
      const fbclid = String(params.get('fbclid') || '').slice(0, 220);
      const fbc = String(params.get('fbc') || cookieValue('_fbc') || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : '')).slice(0, 260);
      const fbp = String(params.get('fbp') || cookieValue('_fbp') || '').slice(0, 260);
      return { fbclid, fbc, fbp };
    } catch (error) {
      return { fbclid: '', fbc: '', fbp: '' };
    }
  }

  function plannerParentUrl() {
    try {
      const url = new URL(window.location.href);
      if (!advertisingConsent()) ['fbclid', 'fbc', 'fbp'].forEach((key) => url.searchParams.delete(key));
      return url.toString();
    } catch (error) {
      return window.location.href;
    }
  }

  function ensureFont() {
    if (document.querySelector('link[data-bw-trip-page-font]')) return;
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://fonts.gstatic.com';
    preconnect.crossOrigin = 'anonymous';

    const font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Merriweather:wght@400;700&display=swap';
    font.dataset.bwTripPageFont = 'true';

    document.head.appendChild(preconnect);
    document.head.appendChild(font);
  }

  function validHeight(value) {
    return typeof value === 'number' && Number.isFinite(value) && value > 320 && value < 30000;
  }

  function validScrollTop(value) {
    return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value < 30000;
  }

  class BWBerlinTripPlannerPage extends HTMLElement {
    connectedCallback() {
      ensureFont();
      this._render();
      this._bind();
      this._setupPlannerResize();
      this._setupWixTopGapGuard();
    }

    disconnectedCallback() {
      if (this._messageHandler) window.removeEventListener('message', this._messageHandler);
      if (this._consentHandler) {
        document.removeEventListener('consentPolicyChanged', this._consentHandler);
        document.removeEventListener('consentPolicyInitialized', this._consentHandler);
      }
      if (this._resizeObserver) this._resizeObserver.disconnect();
      if (this._plannerFrameLoadHandler && this._plannerFrame) this._plannerFrame.removeEventListener('load', this._plannerFrameLoadHandler);
      if (this._plannerResizeHandler) {
        window.removeEventListener('resize', this._plannerResizeHandler);
        if (window.visualViewport) window.visualViewport.removeEventListener('resize', this._plannerResizeHandler);
      }
      if (this._plannerResizeTimers) this._plannerResizeTimers.forEach((timer) => window.clearTimeout(timer));
      if (this._plannerContentObserver) this._plannerContentObserver.disconnect();
      if (this._gapTimers) this._gapTimers.forEach((timer) => window.clearTimeout(timer));
      if (this._gapResizeHandler) {
        window.removeEventListener('resize', this._gapResizeHandler);
        if (window.visualViewport) window.visualViewport.removeEventListener('resize', this._gapResizeHandler);
      }
      if (this._gapResizeObserver) this._gapResizeObserver.disconnect();
      if (this._gapRaf) window.cancelAnimationFrame(this._gapRaf);
    }

    _plannerSrc() {
      const url = new URL(WIDGET_PATH, BASE_URL);
      const current = new URLSearchParams(window.location.search || '');
      const keys = [
        'context',
        'date',
        'tripLength',
        'arrivalTime',
        'arrivalPoint',
        'stayArea',
        'groupType',
        'firstTime',
        'interests',
        'budgetStyle',
        'mustHandle',
        'pace',
        'tourIntent',
        'weather',
        'planAccess',
        'resetUnlock',
        'forceLeadError',
        'forceAiError',
        'mockAi',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_content',
        'utm_term',
        'trip_planner_session_id',
        'trip_planner_order',
        'trip_planner_checkout'
      ];
      keys.forEach((key) => {
        if (current.has(key)) url.searchParams.set(key, current.get(key));
      });
      if (!url.searchParams.has('context')) url.searchParams.set('context', 'tool');
      url.searchParams.set('source', current.get('source') || 'berlin_trip_planner_page');
      url.searchParams.set('parent_path', window.location.pathname || '/berlin-trip-planner');
      url.searchParams.set('parent_url', plannerParentUrl());
      url.searchParams.set('attribution', 'none');
      url.searchParams.set('analytics_consent', analyticsConsent() ? '1' : '0');
      url.searchParams.set('advertising_consent', advertisingConsent() ? '1' : '0');
      url.searchParams.set('functional_consent', functionalConsent() ? '1' : '0');
      const meta = metaAttribution();
      if (meta.fbclid) url.searchParams.set('fbclid', meta.fbclid);
      if (meta.fbc) url.searchParams.set('fbc', meta.fbc);
      if (meta.fbp) url.searchParams.set('fbp', meta.fbp);
      return url.toString();
    }

    _render() {
      const heroImage = asset('ultimate-berlin-trip-planner/assets/berlin-trip-planner-hero.jpg');
      const yusufImage = 'https://static.wixstatic.com/media/5a08a3_ac78d5df37b2486ab6662cf3872ea9a6~mv2.jpg/v1/fill/w_900,h_1125,al_c,q_85/file.jpg';
      const proofPlanIcon = asset('berlin-trip-planner-page/assets/proof-plan.webp');
      const proofWeatherIcon = asset('berlin-trip-planner-page/assets/proof-weather.webp');
      const proofMapIcon = asset('berlin-trip-planner-page/assets/proof-map.webp');
      const proofGuideIcon = asset('berlin-trip-planner-page/assets/proof-guide.webp');
      const mapArt = asset('route/assets/berlin-mitte-illustration.png');
      const arrivalArt = asset('ultimate-berlin-trip-planner/assets/day-art/day-oil-arrival.webp');
      const historyArt = asset('ultimate-berlin-trip-planner/assets/day-art/day-oil-history.webp');
      const museumArt = asset('ultimate-berlin-trip-planner/assets/day-art/day-oil-museums.webp');
      const foodArt = asset('ultimate-berlin-trip-planner/assets/day-art/day-oil-food.webp');

      this.innerHTML = `
        <style>${this._styles()}</style>
        <main class="bw-trip-page">
          <section class="bw-trip-hero" aria-labelledby="bw-trip-page-title">
            <div class="bw-trip-inner bw-trip-hero-grid">
              <div class="bw-trip-hero-message">
                <div class="bw-trip-hero-copy-wrap">
                  <p class="bw-trip-kicker">Berlin Trip Planner</p>
                  <h1 id="bw-trip-page-title">A Berlin plan built around the days you actually have.</h1>
                  <span class="bw-trip-title-rule" aria-hidden="true"></span>
                  <p class="bw-trip-hero-copy">Choose your arrival date. Get daily stops grouped by area, Google Maps links, weather checks, and a printable PDF.</p>
                  <div class="bw-trip-actions">
                    <a class="bw-trip-btn bw-trip-btn-primary" href="#planner">Build my Berlin plan</a>
                  </div>
                  <p class="bw-trip-trust-line">Free preview · 1–7 days · No account needed</p>
                </div>
                <figure class="bw-trip-hero-art">
                  <img src="${heroImage}" alt="Illustrated summer view of Museum Island and the Berlin TV Tower">
                </figure>
              </div>

              <aside class="bw-trip-preview" aria-label="Example three-day Berlin plan">
                <div class="bw-trip-preview-top">
                  <strong>Sun 26 Jul – Tue 28 Jul 2026</strong>
                  <span>3 days</span>
                </div>
                <figure class="bw-trip-preview-map">
                  <img src="${mapArt}" alt="Illustrated map of central Berlin">
                  <figcaption>Alexanderplatz · Mitte</figcaption>
                </figure>
                <article class="bw-trip-preview-day bw-trip-preview-day-open">
                  <div class="bw-trip-preview-day-head">
                    <strong>Day 1 · Mitte</strong>
                    <span>Open map</span>
                  </div>
                  <div class="bw-trip-preview-stops">
                    <figure><img src="${arrivalArt}" alt="Alexanderplatz illustration"><figcaption>Alexanderplatz</figcaption></figure>
                    <figure><img src="${museumArt}" alt="Museum Island illustration"><figcaption>Museum Island</figcaption></figure>
                    <figure><img src="${foodArt}" alt="Hackescher Markt illustration"><figcaption>Hackescher Markt</figcaption></figure>
                    <figure><img src="${historyArt}" alt="Gendarmenmarkt illustration"><figcaption>Gendarmenmarkt</figcaption></figure>
                  </div>
                </article>
                <div class="bw-trip-preview-day"><strong>Day 2 · Kreuzberg &amp; Neukölln</strong><span>View</span></div>
                <div class="bw-trip-preview-day"><strong>Day 3 · Prenzlauer Berg</strong><span>View</span></div>
                <div class="bw-trip-preview-paid">
                  <div><strong>Full 3-day plan — €7.99</strong><span>Daily stops · Maps · PDF · Opening checks</span></div>
                  <a href="#planner">View plan</a>
                </div>
              </aside>
            </div>
          </section>

          <section class="bw-trip-proof-band" aria-label="Planner benefits">
            <div class="bw-trip-inner bw-trip-proof">
              <span><img src="${proofPlanIcon}" alt="" aria-hidden="true"><b>Grouped by area</b></span>
              <span><img src="${proofWeatherIcon}" alt="" aria-hidden="true"><b>Weather checked</b></span>
              <span><img src="${proofMapIcon}" alt="" aria-hidden="true"><b>Google Maps ready</b></span>
              <span><img src="${proofGuideIcon}" alt="" aria-hidden="true"><b>Local guide logic</b></span>
            </div>
          </section>

          <section class="bw-trip-planner-band" id="planner" aria-label="Berlin trip planner widget">
            <div class="bw-trip-inner">
              <div class="bw-trip-planner-head">
                <div>
                  <p class="bw-trip-section-kicker">Start your plan</p>
                  <h2>Tell me when you arrive.</h2>
                </div>
                <p>The free preview starts with your real dates. You can change every answer before the plan is built.</p>
              </div>
              <div class="bw-trip-widget-shell">
                <iframe data-bw-trip-planner-frame src="${this._plannerSrc()}" title="Berlin Trip Planner" loading="eager" scrolling="no"></iframe>
              </div>
            </div>
          </section>

          <section class="bw-trip-section bw-trip-guide">
            <div class="bw-trip-inner bw-trip-guide-grid">
              <figure class="bw-trip-guide-photo">
                <img src="${yusufImage}" alt="Yusuf from BerlinWalk">
              </figure>
              <div class="bw-trip-guide-copy">
                <p class="bw-trip-section-kicker">Your guide in Berlin</p>
                <h2>I check the route before it becomes your plan.</h2>
                <p>I use the same opening-day, arrival-time, and area checks I give guests before the tour. If you start at BER, Hauptbahnhof, Alexanderplatz, or your hotel, the first stop should make sense from there.</p>
                <a class="bw-trip-text-link" href="${BOOKING_URL}">Book the BerlinWalk tour</a>
              </div>
            </div>
          </section>

          <section class="bw-trip-section bw-trip-final">
            <div class="bw-trip-inner bw-trip-final-box">
              <div>
                <p class="bw-trip-section-kicker">Start with the dates you know</p>
                <h2>Your Berlin days can begin here.</h2>
                <p>Choose your arrival date and trip length. The first preview is free.</p>
              </div>
              <div class="bw-trip-actions">
                <a class="bw-trip-btn bw-trip-btn-primary" href="#planner">Build my Berlin plan</a>
              </div>
            </div>
          </section>
        </main>
      `;
    }

    _bind() {
      this.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (event) => {
          const target = this.querySelector(link.getAttribute('href'));
          if (!target) return;
          event.preventDefault();
          const scrollTarget = target.id === 'planner'
            ? target.querySelector('.bw-trip-widget-shell') || target
            : target;
          scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
    }

    _setupPlannerResize() {
      const frame = this.querySelector('[data-bw-trip-planner-frame]');
      if (!frame) return;
      this._plannerFrame = frame;
      this._plannerResizeTimers = [];

      let lastHeight = 0;
      const setHeight = (height) => {
        const next = Math.ceil(height) + 8;
        if (Math.abs(next - lastHeight) < 2) return;
        lastHeight = next;
        frame.style.height = `${next}px`;
        frame.style.minHeight = `${next}px`;
      };

      const plannerOrigin = () => {
        try {
          return new URL(frame.src, window.location.href).origin;
        } catch (error) {
          return '';
        }
      };

      const isPlannerMessage = (event) => {
        const origin = plannerOrigin();
        return Boolean(event.source === frame.contentWindow && event.origin && origin && event.origin === origin);
      };

      const readFrameHeight = () => {
        try {
          const doc = frame.contentDocument;
          if (!doc) return 0;
          const root = doc.documentElement;
          const body = doc.body;
          const planner = doc.querySelector('#bw-trip-planner');
          const plannerBottom = planner ? Math.ceil(planner.getBoundingClientRect().bottom + (frame.contentWindow ? frame.contentWindow.scrollY : 0)) : 0;
          return Math.max(
            root ? root.scrollHeight : 0,
            body ? body.scrollHeight : 0,
            plannerBottom
          );
        } catch (error) {
          return 0;
        }
      };

      const syncFromReadableFrame = () => {
        const height = readFrameHeight();
        if (validHeight(height)) setHeight(height);
      };

      const scheduleHeightChecks = () => {
        if (this._plannerResizeTimers) this._plannerResizeTimers.forEach((timer) => window.clearTimeout(timer));
        this._plannerResizeTimers = [];
        [0, 120, 360, 700, 1200, 2200].forEach((delay) => {
          const timer = window.setTimeout(syncFromReadableFrame, delay);
          this._plannerResizeTimers.push(timer);
        });
      };

      const watchReadableFrame = () => {
        syncFromReadableFrame();
        if (!window.ResizeObserver || this._plannerContentObserver) return;
        try {
          const doc = frame.contentDocument;
          if (!doc || !doc.body) return;
          this._plannerContentObserver = new ResizeObserver(syncFromReadableFrame);
          this._plannerContentObserver.observe(doc.body);
          const planner = doc.querySelector('#bw-trip-planner');
          if (planner) this._plannerContentObserver.observe(planner);
        } catch (error) {}
      };

      const scrollToPlannerOffset = (top) => {
        const frameBox = frame.getBoundingClientRect();
        const absoluteTop = window.scrollY + frameBox.top + top - 10;
        window.scrollTo({
          top: Math.max(0, Math.round(absoluteTop)),
          behavior: 'smooth'
        });
      };

      const validTripPlannerEvent = (name) => /^bw_trip_planner_[a-z0-9_]{1,90}$/.test(String(name || ''));

      const sendConsentToPlanner = () => {
        try {
          if (!frame.contentWindow) return;
          const meta = metaAttribution();
          frame.contentWindow.postMessage({
            type: 'bw-consent-update',
            analytics: analyticsConsent(),
            advertising: advertisingConsent(),
            functional: functionalConsent(),
            fbclid: meta.fbclid,
            fbc: meta.fbc,
            fbp: meta.fbp
          }, plannerOrigin() || '*');
        } catch (error) {}
      };

      const pushPlannerAnalyticsEvent = (eventName, payload) => {
        const allowAnalytics = analyticsConsent();
        const allowAdvertising = advertisingConsent();
        if (!allowAnalytics && !allowAdvertising) return;
        const detail = payload && typeof payload === 'object' ? payload : {};
        const analyticsPayload = Object.assign({}, detail, {
          parent_path: window.location.pathname || '/berlin-trip-planner',
          parent_location: window.location.href,
          event_source: 'ultimate_berlin_trip_planner_iframe'
        });
        try {
          if (allowAnalytics) {
            window.dataLayer = window.dataLayer || [];
            if (Array.isArray(window.dataLayer)) {
              window.dataLayer.push(Object.assign({}, analyticsPayload, { event: eventName }));
            }
            if (typeof window.gtag === 'function') window.gtag('event', eventName, analyticsPayload);
          }
          if (allowAdvertising && typeof window.fbq === 'function') window.fbq('trackCustom', eventName, analyticsPayload);
        } catch (error) {}
      };

      const pushPlannerMetaPurchase = (purchase) => {
        if (!advertisingConsent() || !purchase || typeof window.fbq !== 'function') return;
        const orderId = String(purchase.eventId || '');
        if (!/^tppo_[A-Za-z0-9_-]{12,}$/.test(orderId)) return;
        if (
          purchase.eventName !== 'Purchase' ||
          Number(purchase.value) !== 7.99 ||
          String(purchase.currency || '').toUpperCase() !== 'EUR' ||
          purchase.contentType !== 'product' ||
          !Array.isArray(purchase.contentIds) ||
          purchase.contentIds.length !== 1 ||
          purchase.contentIds[0] !== 'trip_planner_detailed_7_99'
        ) return;
        const storageKey = `bwTripPlannerMetaPurchase.v1:${orderId}`;
        this._metaPurchaseOrderIds = this._metaPurchaseOrderIds || new Set();
        try {
          if (
            this._metaPurchaseOrderIds.has(orderId) ||
            (window.sessionStorage && window.sessionStorage.getItem(storageKey)) ||
            (window.localStorage && window.localStorage.getItem(storageKey))
          ) return;
        } catch (error) {
          if (this._metaPurchaseOrderIds.has(orderId)) return;
        }
        window.fbq('track', 'Purchase', {
          value: 7.99,
          currency: 'EUR',
          content_ids: ['trip_planner_detailed_7_99'],
          content_type: 'product'
        }, { eventID: orderId });
        this._metaPurchaseOrderIds.add(orderId);
        try { if (window.sessionStorage) window.sessionStorage.setItem(storageKey, '1'); } catch (error) {}
        try { if (window.localStorage) window.localStorage.setItem(storageKey, '1'); } catch (error) {}
      };

      const cleanParentCheckoutParams = () => {
        try {
          const url = new URL(window.location.href);
          ['trip_planner_session_id', 'trip_planner_order', 'trip_planner_checkout'].forEach((key) => url.searchParams.delete(key));
          window.history.replaceState({}, document.title, url.toString());
        } catch (error) {}
      };

      this._messageHandler = (event) => {
        if (!event.data) return;
        const isResize = event.data.type === 'bw-resize' && validHeight(event.data.height);
        const isScroll = event.data.type === 'bw-scroll-to' && validScrollTop(event.data.top);
        const isTrackingEvent = event.data.type === 'bw-trip-planner-event' && validTripPlannerEvent(event.data.event);
        const isMetaPurchase = event.data.type === 'bw-trip-planner-purchase';
        const isCheckoutCleanup = event.data.type === 'bw-trip-planner-checkout-cleanup';
        if (!isResize && !isScroll && !isTrackingEvent && !isMetaPurchase && !isCheckoutCleanup) return;
        if (!isPlannerMessage(event)) return;

        if (isCheckoutCleanup) {
          cleanParentCheckoutParams();
          return;
        }
        if (isMetaPurchase) {
          pushPlannerMetaPurchase(event.data.purchase);
          return;
        }
        if (isTrackingEvent) {
          pushPlannerAnalyticsEvent(event.data.event, event.data.payload);
          return;
        }
        if (isResize) {
          setHeight(event.data.height);
          scheduleHeightChecks();
          return;
        }
        if (isScroll) {
          if (validHeight(event.data.height)) setHeight(event.data.height);
          scheduleHeightChecks();
          scrollToPlannerOffset(event.data.top);
        }
      };

      window.addEventListener('message', this._messageHandler);
      this._consentHandler = sendConsentToPlanner;
      document.addEventListener('consentPolicyChanged', this._consentHandler);
      document.addEventListener('consentPolicyInitialized', this._consentHandler);
      this._plannerFrameLoadHandler = () => {
        if (this._plannerContentObserver) {
          this._plannerContentObserver.disconnect();
          this._plannerContentObserver = null;
        }
        watchReadableFrame();
        scheduleHeightChecks();
        sendConsentToPlanner();
      };
      frame.addEventListener('load', this._plannerFrameLoadHandler);
      this._plannerResizeHandler = scheduleHeightChecks;
      window.addEventListener('resize', this._plannerResizeHandler);
      if (window.visualViewport) window.visualViewport.addEventListener('resize', this._plannerResizeHandler);
      setHeight(1900);
      scheduleHeightChecks();
      window.setTimeout(sendConsentToPlanner, 800);
    }

    _setupWixTopGapGuard() {
      this._gapTimers = [];

      const clearGapTimers = () => {
        this._gapTimers.forEach((timer) => window.clearTimeout(timer));
        this._gapTimers = [];
      };

      const later = (callback, delay) => {
        const timer = window.setTimeout(callback, delay);
        this._gapTimers.push(timer);
      };

      const sync = () => {
        const section = this.closest('section.wixui-section');
        this.style.marginTop = '';
        this.style.marginBottom = '';
        delete this.dataset.bwWixTopGap;

        const wrapper = this.parentElement;
        const container = wrapper && wrapper.parentElement;
        if (!section || !wrapper || !container) return;

        // Wix live centers custom-element wrappers inside a generated grid when
        // the viewport width changes. Pin this page wrapper to the top instead.
        wrapper.style.alignSelf = 'start';
        wrapper.style.justifySelf = 'stretch';
        wrapper.style.placeSelf = 'start stretch';
        wrapper.style.height = 'auto';
        wrapper.style.maxWidth = '100%';
        wrapper.style.minHeight = '0';
        wrapper.style.minWidth = '0';
        wrapper.style.overflowX = 'clip';
        wrapper.style.overflowY = 'visible';
        wrapper.style.width = '100%';

        container.style.alignItems = 'start';
        container.style.justifyItems = 'stretch';
        container.style.gridTemplateRows = 'auto';
        container.style.height = 'auto';
        container.style.maxWidth = '100%';
        container.style.minHeight = '0';
        container.style.minWidth = '0';
        container.style.overflowX = 'clip';
        container.style.overflowY = 'visible';

        section.style.height = 'auto';
        section.style.maxWidth = '100%';
        section.style.minHeight = '0';
        section.style.minWidth = '0';
        section.style.overflowX = 'clip';
        section.style.overflowY = 'visible';
        this.style.height = 'auto';
        this.style.maxWidth = '100%';
        this.style.minHeight = '0';
        this.style.minWidth = '0';
        this.style.overflowX = 'clip';
        this.style.overflowY = 'visible';
        this.dataset.bwWixLayoutFixed = 'true';
      };

      const runInFrame = () => {
        if (this._gapRaf) window.cancelAnimationFrame(this._gapRaf);
        this._gapRaf = window.requestAnimationFrame(sync);
      };

      const scheduleSync = () => {
        clearGapTimers();
        runInFrame();
        [120, 320, 720, 1400].forEach((delay) => later(runInFrame, delay));
      };

      sync();
      [60, 250, 800, 1600].forEach((delay) => later(sync, delay));
      this._gapResizeHandler = scheduleSync;
      window.addEventListener('resize', this._gapResizeHandler, { passive: true });
      if (window.visualViewport) window.visualViewport.addEventListener('resize', this._gapResizeHandler, { passive: true });

      const section = this.closest('section.wixui-section');
      if (section && 'ResizeObserver' in window) {
        this._gapResizeObserver = new ResizeObserver(scheduleSync);
        this._gapResizeObserver.observe(section);
        if (this.parentElement) this._gapResizeObserver.observe(this.parentElement);
      }
    }

    _styles() {
      return `
        bw-berlin-trip-planner-page {
          display: block;
          max-width: 100%;
          min-width: 0;
          overflow-x: clip;
          width: 100%;
        }

        .bw-trip-page {
          --green: #1B5E20;
          --green-dark: #123D18;
          --yellow: #FFE600;
          --lime: #7CB342;
          --light-green: #C5E1A5;
          --cream: #FAFAF5;
          --paper: #FFFDF7;
          --text: #212121;
          --muted: #4E5A4E;
          --line: #DCE8C8;
          background: var(--cream);
          color: var(--text);
          font-family: Montserrat, Arial, sans-serif;
          max-width: 100%;
          min-width: 0;
          overflow-x: clip;
          width: 100%;
        }

        .bw-trip-page *,
        .bw-trip-page *::before,
        .bw-trip-page *::after {
          box-sizing: border-box;
        }

        .bw-trip-page h1,
        .bw-trip-page h2,
        .bw-trip-page h3,
        .bw-trip-page p,
        .bw-trip-page figure {
          margin-top: 0;
        }

        .bw-trip-page a {
          color: inherit;
        }

        .bw-trip-inner {
          margin: 0 auto;
          max-width: 1260px;
          min-width: 0;
          width: min(100% - 48px, 1260px);
        }

        .bw-trip-hero {
          background: var(--paper);
          border-bottom: 1px solid var(--line);
          padding: 60px 0 46px;
        }

        .bw-trip-hero-grid {
          align-items: stretch;
          display: grid;
          gap: clamp(28px, 3vw, 36px);
          grid-template-columns: minmax(0, 1fr) minmax(510px, 1fr);
        }

        .bw-trip-hero-message {
          display: grid;
          grid-template-rows: auto 260px;
          min-height: 720px;
          overflow: hidden;
        }

        .bw-trip-hero-copy-wrap {
          padding: clamp(38px, 5vw, 66px) clamp(28px, 4.5vw, 58px) 34px;
        }

        .bw-trip-kicker,
        .bw-trip-section-kicker {
          color: var(--green);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 2.1px;
          line-height: 1.35;
          margin-bottom: 16px;
          text-transform: uppercase;
        }

        .bw-trip-hero h1 {
          color: #16251A;
          font-family: Merriweather, Georgia, serif;
          font-size: clamp(46px, 4.9vw, 70px);
          font-weight: 700;
          letter-spacing: -2.2px;
          line-height: 1.06;
          margin-bottom: 20px;
          max-width: 690px;
        }

        .bw-trip-title-rule {
          background: var(--green);
          display: block;
          height: 3px;
          margin: 0 0 22px;
          width: 76px;
        }

        .bw-trip-hero-copy {
          color: var(--muted);
          font-size: clamp(17px, 1.7vw, 21px);
          font-weight: 500;
          line-height: 1.6;
          margin-bottom: 26px;
          max-width: 620px;
        }

        .bw-trip-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 12px;
        }

        .bw-trip-btn {
          align-items: center;
          border-radius: 10px;
          display: inline-flex;
          font-size: 15px;
          font-weight: 900;
          justify-content: center;
          min-height: 56px;
          padding: 16px 26px;
          text-decoration: none;
          transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
        }

        .bw-trip-btn:hover,
        .bw-trip-btn:focus-visible {
          transform: translateY(-2px);
        }

        .bw-trip-btn:focus-visible,
        .bw-trip-text-link:focus-visible,
        .bw-trip-preview a:focus-visible {
          outline: 3px solid var(--lime);
          outline-offset: 4px;
        }

        .bw-trip-page .bw-trip-btn-primary,
        .bw-trip-page .bw-trip-btn-primary:visited {
          background: var(--yellow);
          box-shadow: 0 12px 24px rgba(180, 155, 0, 0.18);
          color: var(--green-dark);
        }

        .bw-trip-btn-primary:hover,
        .bw-trip-btn-primary:focus-visible {
          background: #FFF04A;
          box-shadow: 0 15px 28px rgba(180, 155, 0, 0.24);
        }

        .bw-trip-trust-line {
          color: #5D695D;
          font-size: 13px;
          font-weight: 600;
          line-height: 1.4;
          margin-bottom: 0;
        }

        .bw-trip-hero-art {
          height: 260px;
          margin: 0;
          overflow: hidden;
        }

        .bw-trip-hero-art img {
          display: block;
          height: 100%;
          object-fit: cover;
          object-position: center 60%;
          width: 100%;
        }

        .bw-trip-preview {
          background: #FFFFFF;
          border: 1px solid #D9E3CE;
          border-radius: 24px;
          box-shadow: 0 28px 64px rgba(27, 94, 32, 0.12);
          display: grid;
          gap: 14px;
          min-height: 720px;
          padding: 24px;
        }

        .bw-trip-preview-top,
        .bw-trip-preview-day,
        .bw-trip-preview-day-head,
        .bw-trip-preview-paid {
          align-items: center;
          display: flex;
          justify-content: space-between;
        }

        .bw-trip-preview-top strong {
          color: var(--text);
          font-size: 15px;
          line-height: 1.3;
        }

        .bw-trip-preview-top > span {
          border: 1px solid var(--line);
          border-radius: 999px;
          color: var(--green);
          font-size: 12px;
          font-weight: 800;
          padding: 7px 13px;
        }

        .bw-trip-preview-map {
          border-radius: 14px;
          height: 235px;
          margin: 0;
          overflow: hidden;
          position: relative;
        }

        .bw-trip-preview-map img {
          display: block;
          height: 100%;
          object-fit: cover;
          width: 100%;
        }

        .bw-trip-preview-map figcaption {
          background: rgba(27, 94, 32, 0.92);
          border-radius: 7px;
          bottom: 12px;
          color: #FFFFFF;
          font-size: 12px;
          font-weight: 800;
          left: 12px;
          padding: 8px 10px;
          position: absolute;
        }

        .bw-trip-preview-day {
          border: 1px solid #E0E8D6;
          border-radius: 12px;
          color: var(--green-dark);
          font-size: 13px;
          min-height: 48px;
          padding: 13px 15px;
        }

        .bw-trip-preview-day > span,
        .bw-trip-preview-day-head > span {
          color: #5A675A;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .bw-trip-preview-day-open {
          align-items: stretch;
          display: grid;
          gap: 12px;
          padding: 15px;
        }

        .bw-trip-preview-stops {
          display: grid;
          gap: 8px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .bw-trip-preview-stops figure {
          border: 1px solid #E4E9DD;
          border-radius: 8px;
          margin: 0;
          overflow: hidden;
        }

        .bw-trip-preview-stops img {
          aspect-ratio: 4 / 3;
          display: block;
          object-fit: cover;
          width: 100%;
        }

        .bw-trip-preview-stops figcaption {
          color: #263226;
          font-size: 10px;
          font-weight: 800;
          line-height: 1.25;
          padding: 8px;
        }

        .bw-trip-preview-paid {
          background: #FFFBE5;
          border: 1px solid #E9E1AE;
          border-radius: 12px;
          gap: 16px;
          padding: 14px 15px;
        }

        .bw-trip-preview-paid div {
          display: grid;
          gap: 3px;
        }

        .bw-trip-preview-paid strong {
          color: #243024;
          font-size: 13px;
        }

        .bw-trip-preview-paid span {
          color: #687168;
          font-size: 10px;
          font-weight: 600;
        }

        .bw-trip-preview-paid a {
          background: var(--yellow);
          border-radius: 8px;
          color: #173C1B;
          flex: 0 0 auto;
          font-size: 12px;
          font-weight: 900;
          padding: 11px 14px;
          text-decoration: none;
        }

        .bw-trip-proof-band {
          background: #FFFFFF;
          border-bottom: 1px solid var(--line);
          padding: 0;
        }

        .bw-trip-proof {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .bw-trip-proof span {
          align-items: center;
          border-right: 1px solid #E6EDD9;
          display: flex;
          gap: 12px;
          min-height: 86px;
          padding: 16px 22px;
        }

        .bw-trip-proof span:last-child {
          border-right: 0;
        }

        .bw-trip-proof img {
          height: 42px;
          object-fit: contain;
          width: 42px;
        }

        .bw-trip-proof b {
          color: #243024;
          font-size: 14px;
          line-height: 1.3;
        }

        .bw-trip-planner-band {
          background: var(--cream);
          padding: 42px 0 54px;
        }

        .bw-trip-planner-head {
          align-items: end;
          display: grid;
          gap: 32px;
          grid-template-columns: minmax(0, 0.85fr) minmax(300px, 0.55fr);
          margin-bottom: 22px;
        }

        .bw-trip-section-kicker {
          margin-bottom: 10px;
        }

        .bw-trip-planner-head h2,
        .bw-trip-guide-copy h2,
        .bw-trip-final h2 {
          color: #173C1B;
          font-family: Merriweather, Georgia, serif;
          font-size: clamp(32px, 4vw, 50px);
          font-weight: 700;
          letter-spacing: -1px;
          line-height: 1.08;
          margin-bottom: 0;
        }

        .bw-trip-planner-head > p,
        .bw-trip-guide-copy > p,
        .bw-trip-final p {
          color: var(--muted);
          font-size: 16px;
          font-weight: 500;
          line-height: 1.65;
          margin-bottom: 0;
        }

        .bw-trip-widget-shell {
          background: transparent;
          border: 0;
          border-radius: 0;
          box-shadow: none;
          margin-inline: auto;
          max-width: 900px;
          min-width: 0;
          overflow: visible;
          width: 100%;
        }

        .bw-trip-widget-shell iframe {
          border: 0;
          display: block;
          height: 1900px;
          min-height: 1900px;
          max-width: 100%;
          min-width: 0;
          overflow: hidden;
          width: 100%;
        }

        .bw-trip-section {
          padding: 56px 0;
        }

        .bw-trip-guide {
          background: #F2F6EA;
          border-bottom: 1px solid var(--line);
          border-top: 1px solid var(--line);
        }

        .bw-trip-guide-grid {
          align-items: center;
          display: grid;
          gap: 40px;
          grid-template-columns: 320px minmax(0, 1fr);
        }

        .bw-trip-guide-photo {
          aspect-ratio: 4 / 3;
          border-radius: 18px;
          margin: 0;
          overflow: hidden;
        }

        .bw-trip-guide-photo img {
          display: block;
          height: 100%;
          object-fit: cover;
          object-position: center 34%;
          width: 100%;
        }

        .bw-trip-guide-copy {
          max-width: 790px;
        }

        .bw-trip-guide-copy > p {
          margin-top: 18px;
        }

        .bw-trip-text-link {
          color: var(--green);
          display: inline-flex;
          font-size: 14px;
          font-weight: 900;
          margin-top: 22px;
          text-decoration: underline;
          text-decoration-color: var(--yellow);
          text-decoration-thickness: 4px;
          text-underline-offset: 5px;
        }

        .bw-trip-final {
          background: #FFFFFF;
        }

        .bw-trip-final-box {
          align-items: center;
          background: var(--green-dark);
          border-radius: 20px;
          color: #FFFFFF;
          display: flex;
          gap: 32px;
          justify-content: space-between;
          padding: 38px 42px;
        }

        .bw-trip-final .bw-trip-section-kicker {
          color: var(--yellow);
        }

        .bw-trip-final h2,
        .bw-trip-final p {
          color: #FFFFFF;
        }

        .bw-trip-final p {
          color: rgba(255, 255, 255, 0.82);
          margin-top: 12px;
        }

        .bw-trip-final .bw-trip-actions {
          flex: 0 0 auto;
          margin: 0;
        }

        @media (max-width: 1040px) {
          .bw-trip-hero-grid {
            grid-template-columns: 1fr;
          }

          .bw-trip-hero-message,
          .bw-trip-preview {
            min-height: 0;
          }

          .bw-trip-hero-message {
            grid-template-columns: minmax(0, 1fr) 320px;
            grid-template-rows: 1fr;
          }

          .bw-trip-hero-art {
            height: 100%;
          }

          .bw-trip-proof {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .bw-trip-proof span:nth-child(2) {
            border-right: 0;
          }

          .bw-trip-proof span:nth-child(-n + 2) {
            border-bottom: 1px solid #E6EDD9;
          }
        }

        @media (max-width: 760px) {
          .bw-trip-inner {
            width: min(100% - 24px, 1260px);
          }

          .bw-trip-hero {
            padding: 18px 0 28px;
          }

          .bw-trip-hero-grid {
            gap: 18px;
          }

          .bw-trip-hero-message {
            background: #FDFBF4;
            border-radius: 16px;
            grid-template-columns: 1fr;
            grid-template-rows: auto 210px;
          }

          .bw-trip-hero-copy-wrap {
            padding: 30px 24px 26px;
          }

          .bw-trip-hero h1 {
            font-size: clamp(38px, 11vw, 54px);
            letter-spacing: -1.4px;
          }

          .bw-trip-actions,
          .bw-trip-btn {
            width: 100%;
          }

          .bw-trip-preview {
            border-radius: 16px;
            gap: 10px;
            padding: 14px;
          }

          .bw-trip-preview-map {
            height: 190px;
          }

          .bw-trip-preview-stops figcaption {
            font-size: 9px;
            padding: 6px;
          }

          .bw-trip-preview-paid {
            align-items: stretch;
            flex-direction: column;
          }

          .bw-trip-preview-paid a {
            text-align: center;
          }

          .bw-trip-proof {
            grid-template-columns: 1fr;
          }

          .bw-trip-proof span,
          .bw-trip-proof span:nth-child(2) {
            border-bottom: 1px solid #E6EDD9;
            border-right: 0;
            min-height: 68px;
            padding: 12px 16px;
          }

          .bw-trip-proof span:last-child {
            border-bottom: 0;
          }

          .bw-trip-proof img {
            height: 36px;
            width: 36px;
          }

          .bw-trip-planner-band {
            padding: 30px 0 38px;
          }

          .bw-trip-planner-head,
          .bw-trip-guide-grid {
            grid-template-columns: 1fr;
          }

          .bw-trip-planner-head {
            gap: 10px;
          }

          .bw-trip-widget-shell {
            border: 0;
            border-radius: 0;
          }

          .bw-trip-section {
            padding: 38px 0;
          }

          .bw-trip-guide-grid {
            gap: 24px;
          }

          .bw-trip-guide-photo {
            aspect-ratio: 16 / 10;
          }

          .bw-trip-final-box {
            align-items: stretch;
            flex-direction: column;
            padding: 28px 24px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bw-trip-btn {
            transition: none;
          }
        }
      `;
    }

    _stylesLegacy() {
      return `
        bw-berlin-trip-planner-page {
          display: block;
          max-width: 100%;
          min-width: 0;
          overflow-x: clip;
          width: 100%;
        }

        .bw-trip-page {
          --green: #1B5E20;
          --green-dark: #0E3214;
          --yellow: #FFE600;
          --lime: #7CB342;
          --light-green: #C5E1A5;
          --cream: #FAFAF5;
          --text: #212121;
          --muted: #4E5A4E;
          --blue: #2F80ED;
          --blue-soft: #EAF4FF;
          background: var(--cream);
          color: var(--text);
          font-family: Montserrat, Arial, sans-serif;
          max-width: 100%;
          min-width: 0;
          overflow-x: clip;
          width: 100%;
        }

        .bw-trip-inner,
        .bw-trip-hero,
        .bw-trip-hero-inner,
        .bw-trip-planner-band,
        .bw-trip-widget-shell,
        .bw-trip-section,
        .bw-trip-proof,
        .bw-trip-steps,
        .bw-trip-cover-grid,
        .bw-trip-guide-grid,
        .bw-trip-compare-grid,
        .bw-trip-final-box {
          max-width: 100%;
          min-width: 0;
          overflow-x: clip;
        }

        @supports not (overflow: clip) {
          bw-berlin-trip-planner-page,
          .bw-trip-page,
          .bw-trip-inner,
          .bw-trip-hero,
          .bw-trip-hero-inner,
          .bw-trip-planner-band,
          .bw-trip-widget-shell,
          .bw-trip-section,
          .bw-trip-proof,
          .bw-trip-steps,
          .bw-trip-cover-grid,
          .bw-trip-guide-grid,
          .bw-trip-compare-grid,
          .bw-trip-final-box {
            overflow-x: hidden;
          }
        }

        .bw-trip-page *,
        .bw-trip-page *::before,
        .bw-trip-page *::after {
          box-sizing: border-box;
        }

        .bw-trip-page h1,
        .bw-trip-page h2,
        .bw-trip-page h3,
        .bw-trip-page p,
        .bw-trip-page figure {
          margin-top: 0;
        }

        .bw-trip-page a {
          color: inherit;
        }

        .bw-trip-inner {
          margin: 0 auto;
          max-width: 1180px;
          width: min(100% - 40px, 1180px);
        }

        .bw-trip-hero {
          align-items: end;
          background-image: var(--hero-image);
          background-position: center;
          background-size: cover;
          display: grid;
          min-height: clamp(560px, 78vh, 760px);
          overflow: hidden;
          position: relative;
        }

        .bw-trip-hero-shade {
          background:
            linear-gradient(90deg, rgba(14, 50, 20, 0.92) 0%, rgba(14, 50, 20, 0.76) 43%, rgba(14, 50, 20, 0.26) 100%),
            linear-gradient(0deg, rgba(14, 50, 20, 0.94) 0%, rgba(14, 50, 20, 0) 32%);
          inset: 0;
          position: absolute;
        }

        .bw-trip-hero-inner {
          padding: 88px 0 54px;
          position: relative;
          z-index: 1;
        }

        .bw-trip-kicker,
        .bw-trip-section-kicker {
          color: var(--yellow);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 2.3px;
          line-height: 1.35;
          margin-bottom: 14px;
          text-transform: uppercase;
        }

        .bw-trip-section-kicker {
          color: var(--green);
        }

        .bw-trip-hero h1 {
          color: #FFFFFF;
          font-size: clamp(56px, 8vw, 112px);
          font-weight: 900;
          letter-spacing: 0;
          line-height: 0.92;
          margin-bottom: 24px;
          max-width: 980px;
        }

        .bw-trip-hero-copy {
          color: rgba(255, 255, 255, 0.92);
          font-size: clamp(18px, 2vw, 26px);
          font-weight: 600;
          line-height: 1.45;
          margin-bottom: 28px;
          max-width: 860px;
        }

        .bw-trip-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 26px;
        }

        .bw-trip-btn {
          align-items: center;
          border-radius: 999px;
          display: inline-flex;
          font-size: 13px;
          font-weight: 900;
          justify-content: center;
          letter-spacing: 0.8px;
          min-height: 52px;
          padding: 15px 24px;
          text-decoration: none;
          text-transform: uppercase;
          transition: transform 160ms ease, background 160ms ease, color 160ms ease;
        }

        .bw-trip-btn:hover,
        .bw-trip-btn:focus-visible {
          transform: translateY(-1px);
        }

        .bw-trip-btn-primary {
          background: var(--yellow);
          color: var(--green);
        }

        .bw-trip-btn-secondary {
          background: rgba(255, 255, 255, 0.13);
          border: 1px solid rgba(255, 255, 255, 0.46);
          color: #FFFFFF;
        }

        .bw-trip-proof {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          max-width: 1080px;
        }

        .bw-trip-proof span {
          align-items: stretch;
          background: rgba(250, 250, 245, 0.13);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.86);
          display: grid;
          font-size: 12px;
          grid-template-columns: 104px 1fr;
          line-height: 1.45;
          min-height: 96px;
          min-width: 0;
          overflow: hidden;
          padding: 0;
        }

        .bw-trip-proof img {
          background: transparent;
          border-right: 0;
          display: block;
          grid-row: 1 / span 2;
          height: 100%;
          min-height: 96px;
          object-fit: contain;
          padding: 0;
          width: 104px;
        }

        .bw-trip-proof b {
          color: var(--yellow);
          display: block;
          font-size: 13px;
          margin: auto 14px 2px;
          min-width: 0;
        }

        .bw-trip-proof em {
          display: block;
          font-style: normal;
          grid-column: 2;
          margin: 0 14px auto;
          min-width: 0;
        }

        .bw-trip-planner-band {
          background:
            linear-gradient(180deg, #FFFFFF 0%, #F7FAF1 100%);
          border-bottom: 1px solid #DCE8C8;
          border-top: 8px solid var(--yellow);
          padding: 38px 0 54px;
        }

        .bw-trip-planner-head {
          align-items: end;
          display: grid;
          gap: 24px;
          grid-template-columns: minmax(0, 0.9fr) minmax(280px, 0.56fr);
          margin-bottom: 24px;
        }

        .bw-trip-planner-head h2,
        .bw-trip-section-head h2,
        .bw-trip-guide-copy h2,
        .bw-trip-compare h2,
        .bw-trip-final h2 {
          color: var(--green);
          font-size: clamp(34px, 5vw, 58px);
          font-weight: 900;
          letter-spacing: 0;
          line-height: 1.02;
          margin-bottom: 14px;
        }

        .bw-trip-planner-head p,
        .bw-trip-section-head p,
        .bw-trip-guide-copy p,
        .bw-trip-final p {
          color: var(--muted);
          font-size: 17px;
          font-weight: 500;
          line-height: 1.65;
          margin-bottom: 0;
        }

        .bw-trip-widget-shell {
          background: #FFFFFF;
          border: 1px solid #DCE8C8;
          border-radius: 18px;
          box-shadow: 0 24px 60px rgba(27, 94, 32, 0.14);
          overflow: hidden;
        }

        .bw-trip-widget-shell iframe {
          border: 0;
          display: block;
          height: 1900px;
          min-height: 1900px;
          max-width: 100%;
          min-width: 0;
          overflow: hidden;
          width: 100%;
        }

        .bw-trip-section {
          padding: 72px 0;
        }

        .bw-trip-section-head {
          max-width: 820px;
          margin-bottom: 30px;
        }

        .bw-trip-why {
          background: var(--cream);
        }

        .bw-trip-steps {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .bw-trip-steps article,
        .bw-trip-cover-grid article,
        .bw-trip-final-box {
          background: #FFFFFF;
          border: 1px solid #DCE8C8;
          border-radius: 10px;
        }

        .bw-trip-steps article {
          min-width: 0;
          overflow: hidden;
          padding: 0;
        }

        .bw-trip-step-art {
          aspect-ratio: 16 / 9;
          display: block;
          object-fit: cover;
          width: 100%;
        }

        .bw-trip-step-body {
          padding: 22px 24px 24px;
        }

        .bw-trip-steps span {
          align-items: center;
          background: var(--yellow);
          border-radius: 999px;
          color: var(--green);
          display: inline-flex;
          font-size: 12px;
          font-weight: 900;
          height: 38px;
          justify-content: center;
          margin-bottom: 18px;
          width: 38px;
        }

        .bw-trip-page h3 {
          color: var(--green);
          font-size: 22px;
          font-weight: 900;
          line-height: 1.18;
          margin-bottom: 10px;
        }

        .bw-trip-steps p,
        .bw-trip-cover-grid p,
        .bw-trip-compare li {
          color: var(--muted);
          font-size: 15px;
          font-weight: 500;
          line-height: 1.58;
          margin-bottom: 0;
        }

        .bw-trip-guide {
          background: #0E3214;
          color: #FFFFFF;
        }

        .bw-trip-guide-grid {
          align-items: center;
          display: grid;
          gap: 42px;
          grid-template-columns: minmax(270px, 0.45fr) minmax(0, 0.9fr);
        }

        .bw-trip-guide-photo {
          aspect-ratio: 4 / 5;
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 18px;
          margin: 0;
          overflow: hidden;
        }

        .bw-trip-guide-photo img {
          display: block;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          width: 100%;
        }

        .bw-trip-guide .bw-trip-section-kicker,
        .bw-trip-final .bw-trip-section-kicker {
          color: var(--yellow);
        }

        .bw-trip-guide-copy h2,
        .bw-trip-guide-copy p {
          color: #FFFFFF;
        }

        .bw-trip-guide-copy p {
          color: rgba(255, 255, 255, 0.84);
          max-width: 780px;
        }

        .bw-trip-text-link {
          color: var(--yellow);
          display: inline-flex;
          font-weight: 900;
          margin-top: 20px;
          text-decoration: none;
        }

        .bw-trip-covers {
          background: linear-gradient(180deg, #FFFFFF, #F6FAEF);
        }

        .bw-trip-cover-grid {
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .bw-trip-cover-grid article {
          overflow: hidden;
        }

        .bw-trip-cover-grid img {
          aspect-ratio: 16 / 10;
          display: block;
          height: auto;
          object-fit: cover;
          width: 100%;
        }

        .bw-trip-cover-grid h3,
        .bw-trip-cover-grid p {
          padding-left: 18px;
          padding-right: 18px;
        }

        .bw-trip-cover-grid h3 {
          margin-bottom: 8px;
          margin-top: 18px;
        }

        .bw-trip-cover-grid p {
          padding-bottom: 22px;
        }

        .bw-trip-compare {
          background: #EDF7E8;
          isolation: isolate;
          overflow: hidden;
          position: relative;
        }

        .bw-trip-compare::before {
          background-image: var(--compare-image);
          background-position: center;
          background-size: cover;
          content: "";
          filter: blur(18px);
          inset: -32px;
          opacity: 0.76;
          position: absolute;
          transform: scale(1.03);
          z-index: -2;
        }

        .bw-trip-compare::after {
          background:
            linear-gradient(90deg, rgba(250, 250, 245, 0.88) 0%, rgba(250, 250, 245, 0.66) 48%, rgba(237, 247, 232, 0.58) 100%);
          content: "";
          inset: 0;
          position: absolute;
          z-index: -1;
        }

        .bw-trip-compare-grid {
          display: grid;
          gap: 42px;
          grid-template-columns: minmax(0, 0.78fr) minmax(320px, 0.82fr);
        }

        .bw-trip-compare ul {
          display: grid;
          gap: 12px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .bw-trip-compare li {
          background: rgba(255, 255, 255, 0.84);
          border: 1px solid rgba(197, 225, 165, 0.78);
          border-left: 6px solid var(--green);
          border-radius: 10px;
          box-shadow: 0 16px 36px rgba(27, 94, 32, 0.08);
          padding: 16px 18px;
        }

        .bw-trip-compare b {
          color: var(--green);
        }

        .bw-trip-final {
          background: var(--cream);
        }

        .bw-trip-final-box {
          background:
            linear-gradient(135deg, rgba(27, 94, 32, 0.98), rgba(14, 50, 20, 0.98));
          border: 0;
          color: #FFFFFF;
          padding: clamp(30px, 6vw, 58px);
        }

        .bw-trip-final h2,
        .bw-trip-final p {
          color: #FFFFFF;
          max-width: 760px;
        }

        .bw-trip-final p {
          color: rgba(255, 255, 255, 0.84);
        }

        .bw-trip-final .bw-trip-actions {
          margin-bottom: 0;
          margin-top: 30px;
        }

        .bw-trip-final .bw-trip-btn-primary {
          color: var(--green);
        }

        @media (max-width: 960px) {
          .bw-trip-proof,
          .bw-trip-cover-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .bw-trip-planner-head,
          .bw-trip-guide-grid,
          .bw-trip-compare-grid {
            grid-template-columns: 1fr;
          }

          .bw-trip-steps {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .bw-trip-inner {
            width: min(100% - 24px, 1180px);
          }

          .bw-trip-hero {
            min-height: 680px;
          }

          .bw-trip-hero-shade {
            background:
              linear-gradient(180deg, rgba(14, 50, 20, 0.68) 0%, rgba(14, 50, 20, 0.92) 62%, rgba(14, 50, 20, 0.98) 100%);
          }

          .bw-trip-hero-inner {
            padding: 58px 0 34px;
          }

          .bw-trip-proof,
          .bw-trip-cover-grid {
            grid-template-columns: 1fr;
          }

          .bw-trip-actions {
            display: grid;
          }

          .bw-trip-btn {
            width: 100%;
          }

          .bw-trip-planner-band,
          .bw-trip-section {
            padding-left: 0;
            padding-right: 0;
          }

          .bw-trip-widget-shell {
            border-left: 0;
            border-radius: 12px;
            border-right: 0;
            margin-left: 0;
            margin-right: 0;
          }
        }
      `;
    }
  }

  if (!customElements.get('bw-berlin-trip-planner-page')) {
    customElements.define('bw-berlin-trip-planner-page', BWBerlinTripPlannerPage);
  }
})();
