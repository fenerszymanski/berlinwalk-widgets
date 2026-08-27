const SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : '';
const BASE_URL = SCRIPT_URL 
  ? new URL('../', SCRIPT_URL).toString() 
  : 'https://fenerszymanski.github.io/berlinwalk-widgets/';
const ASSET_BUILD = 'bouncer-r1-r3-v20260825';
const GAMES_PREVIEW_BUILD = 'games-preview-rail-hero-preview-20260708a';
const BOUNCER_CONTEXT_MESSAGE = 'bw-berghain-bouncer-context';
const BOUNCER_READY_MESSAGE = 'bw-berghain-bouncer-ready';
const BOUNCER_VISIBLE_MESSAGE = 'bw-berghain-bouncer-visible';
const BOUNCER_TRACK_MESSAGE = 'bw-berghain-bouncer-track';
const BOUNCER_PAGE_SESSION_KEY = 'bw_berghain_bouncer_page_session_id';
const BOUNCER_ENTRY_VARIANT_KEY = 'bw_berghain_bouncer_entry_variant_v1';
const BOUNCER_LOCAL_HOSTS = new Set(['localhost', '127.0.0.1']);
const BOUNCER_IFRAME_ORIGINS = new Set([
  'https://fenerszymanski.github.io',
  'https://cdn.jsdelivr.net',
  'https://raw.githubusercontent.com',
  'https://raw.githack.com',
  'http://localhost:8000',
  'http://localhost:8765',
  'http://127.0.0.1:8000',
  'http://127.0.0.1:8765',
]);

function bouncerStorageGet(storage, key) {
  try {
    return storage && typeof storage.getItem === 'function' ? storage.getItem(key) || '' : '';
  } catch (error) {
    return '';
  }
}

function bouncerStorageSet(storage, key, value) {
  try {
    if (storage && typeof storage.setItem === 'function') storage.setItem(key, value);
  } catch (error) {
    /* Storage is optional. */
  }
}

function bouncerRandomId(prefix) {
  try {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return `${prefix}_${window.crypto.randomUUID()}`;
    }
    if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
      const bytes = new Uint8Array(16);
      window.crypto.getRandomValues(bytes);
      return `${prefix}_${Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')}`;
    }
  } catch (error) {
    /* Fall through to a non-identifying in-memory fallback. */
  }
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function bouncerSafeToken(value, max = 120) {
  return String(value || '')
    .trim()
    .replace(/[^a-zA-Z0-9._~:/+%-]/g, '')
    .slice(0, max);
}

function bouncerTruthy(value) {
  return ['1', 'true', 'yes', 'on'].includes(String(value || '').trim().toLowerCase());
}

function bouncerAnalyticsConsent() {
  try {
    const manager = window.consentPolicyManager;
    const current = manager && typeof manager.getCurrentConsentPolicy === 'function'
      ? manager.getCurrentConsentPolicy()
      : null;
    const policy = current && (current.policy || current);
    const nested = policy && policy.consent && typeof policy.consent === 'object' ? policy.consent : {};
    const value = policy && (policy.analytics ?? policy.anl ?? policy.analyticsConsent ?? policy.analyticsStorage ?? nested.analytics);
    if (value === true || value === 1 || String(value || '').toLowerCase() === 'true') return 'granted';
    if (value === false || value === 0 || String(value || '').toLowerCase() === 'false') return 'denied';
  } catch (error) {
    /* Treat an unavailable consent manager as unknown. */
  }
  return 'unknown';
}

function bouncerCanonicalParentUrl() {
  const canonical = document.querySelector('link[rel="canonical"]');
  const candidates = [
    canonical && canonical.href,
    window.location.href,
    document.referrer,
  ].filter(Boolean);
  for (const raw of candidates) {
    try {
      const url = new URL(raw, window.location.href);
      // An about:blank shell is not a useful page identity; prefer the safe
      // referrer when Wix has supplied one to an embedded document.
      if (url.protocol === 'about:' && document.referrer && raw !== document.referrer) continue;
      url.search = '';
      url.hash = '';
      return url.toString();
    } catch (error) {
      /* Try the next candidate. */
    }
  }
  return '';
}

function bouncerCanonicalParentPath() {
  try {
    return new URL(bouncerCanonicalParentUrl() || window.location.href, window.location.href).pathname || '/';
  } catch (error) {
    return window.location.pathname || '';
  }
}

function bouncerUtmContext() {
  const params = new URLSearchParams(window.location.search || '');
  return {
    utmSource: bouncerSafeToken(params.get('utm_source')),
    utmMedium: bouncerSafeToken(params.get('utm_medium')),
    utmCampaign: bouncerSafeToken(params.get('utm_campaign')),
    utmContent: bouncerSafeToken(params.get('utm_content')),
    utmTerm: bouncerSafeToken(params.get('utm_term')),
  };
}

function bouncerReferrerDomain() {
  try {
    return new URL(document.referrer || '').hostname.toLowerCase().slice(0, 180);
  } catch (error) {
    return '';
  }
}

function bouncerDeviceClass(viewportWidth) {
  const width = Number(viewportWidth || 0);
  if (!Number.isFinite(width) || width <= 0) return 'unknown';
  if (width < 700) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

function bouncerEntryVariantFor(element, consentState) {
  const params = new URLSearchParams(window.location.search || '');
  const explicit = element.getAttribute('data-experiment-variant')
    || params.get('bouncer_variant')
    || params.get('experiment_variant');
  if (explicit) return bouncerSafeToken(explicit, 60) || 'control';
  if (element._bwEntryVariant) {
    if (consentState === 'granted' && !bouncerStorageGet(window.sessionStorage, BOUNCER_ENTRY_VARIANT_KEY)) {
      bouncerStorageSet(window.sessionStorage, BOUNCER_ENTRY_VARIANT_KEY, element._bwEntryVariant);
    }
    return element._bwEntryVariant;
  }

  // Unknown/denied pages get an in-memory choice. Persist the page-session
  // assignment only after analytics consent is granted.
  const existing = consentState === 'granted'
    ? bouncerStorageGet(window.sessionStorage, BOUNCER_ENTRY_VARIANT_KEY)
    : '';
  const variant = existing === 'mobile_play_now' || existing === 'control'
    ? existing
    : (Math.random() < 0.5 ? 'control' : 'mobile_play_now');
  element._bwEntryVariant = variant;
  if (consentState === 'granted' && !existing) {
    bouncerStorageSet(window.sessionStorage, BOUNCER_ENTRY_VARIANT_KEY, variant);
  }
  return variant;
}

function bouncerPageSessionId(element, consentState) {
  const canPersist = consentState === 'granted';
  if (element._bwPageSessionId) {
    if (canPersist && !bouncerStorageGet(window.sessionStorage, BOUNCER_PAGE_SESSION_KEY)) {
      bouncerStorageSet(window.sessionStorage, BOUNCER_PAGE_SESSION_KEY, element._bwPageSessionId);
    }
    return element._bwPageSessionId;
  }
  const existing = canPersist ? bouncerStorageGet(window.sessionStorage, BOUNCER_PAGE_SESSION_KEY) : '';
  const value = existing || bouncerRandomId('bbouncer_p');
  element._bwPageSessionId = value;
  if (canPersist && !existing) bouncerStorageSet(window.sessionStorage, BOUNCER_PAGE_SESSION_KEY, value);
  return value;
}

function bouncerContextFor(element) {
  const params = new URLSearchParams(window.location.search || '');
  const consentState = bouncerAnalyticsConsent();
  const utm = bouncerUtmContext();
  const viewportWidth = Math.round(Number(window.innerWidth || document.documentElement?.clientWidth || 0)) || 0;
  const qaFromQuery = bouncerTruthy(params.get('bw_qa') || params.get('isQa') || params.get('qa'));
  const isQa = qaFromQuery || /^codex[_-]/i.test(utm.utmContent);
  const qaLabel = bouncerSafeToken(
    params.get('qa_label') || params.get('qaLabel') || element.getAttribute('data-qa-label') || '',
    80,
  );
  const entryVariant = bouncerEntryVariantFor(element, consentState);
  const parentUrl = bouncerCanonicalParentUrl();
  const context = {
    parentPath: bouncerCanonicalParentPath(),
    parentUrl,
    pageSessionId: bouncerPageSessionId(element, consentState),
    referrerDomain: bouncerReferrerDomain(),
    parentViewportWidth: viewportWidth,
    deviceClass: bouncerDeviceClass(viewportWidth),
    experimentVariant: entryVariant,
    challengeId: bouncerSafeToken(params.get('challenge') || params.get('challengeId') || '', 100),
    analyticsConsent: consentState,
    isQa,
    qaLabel,
    sourceContext: bouncerSafeToken(element.getAttribute('data-source') || 'berghain_bouncer_page', 80),
    ...utm,
  };
  if (isQa && !context.qaLabel) context.qaLabel = 'qa';
  return context;
}

function bouncerIframeOrigin(iframe) {
  try {
    const origin = new URL(iframe.src, window.location.href).origin;
    if (BOUNCER_IFRAME_ORIGINS.has(origin)) return origin;
    if (BOUNCER_LOCAL_HOSTS.has(String(window.location.hostname || '').toLowerCase()) && origin === window.location.origin) return origin;
    return '';
  } catch (error) {
    return '';
  }
}

function loadGamesPreviewRail(callback) {
  if (window.BerlinWalkGamesPreviewRail) {
    callback();
    return;
  }
  const existing = document.querySelector('script[data-bw-games-preview-rail]');
  if (existing) {
    existing.addEventListener('load', callback, { once: true });
    return;
  }
  const script = document.createElement('script');
  script.src = new URL(`js/games-preview-rail.js?v=${GAMES_PREVIEW_BUILD}`, BASE_URL).toString();
  script.defer = true;
  script.dataset.bwGamesPreviewRail = 'true';
  script.addEventListener('load', callback, { once: true });
  document.head.appendChild(script);
}

class BwBerlinBouncerPage extends HTMLElement {
  connectedCallback() {
    this._ensureFont();
    this._render();
    this._bind();
    this._syncWixHostHeight();
  }

  disconnectedCallback() {
    if (this._handleHostResize) {
      window.removeEventListener('resize', this._handleHostResize);
    }
    if (this._handleBouncerMessage) window.removeEventListener('message', this._handleBouncerMessage);
    if (this._handleConsentChange) {
      document.removeEventListener('consentPolicyChanged', this._handleConsentChange);
      document.removeEventListener('consentPolicyInitialized', this._handleConsentChange);
    }
    if (this._visibilityObserver) this._visibilityObserver.disconnect();
    if (this._visibilityTimer) window.clearTimeout(this._visibilityTimer);
    if (this._visibilityFallbackHandler) {
      window.removeEventListener('scroll', this._visibilityFallbackHandler);
      window.removeEventListener('resize', this._visibilityFallbackHandler);
    }
    if (this._visibilityChangeHandler) document.removeEventListener('visibilitychange', this._visibilityChangeHandler);
    if (this._iframeLoadHandler && this._iframe) this._iframe.removeEventListener('load', this._iframeLoadHandler);
    if (this._playNowHandler) {
      const playNow = this.querySelector('#bouncer-play-now');
      if (playNow) playNow.removeEventListener('click', this._playNowHandler);
    }
    if (this._tourClickHandler) {
      const link = this.querySelector('.bw-bouncer-tour-cta a');
      if (link) link.removeEventListener('click', this._tourClickHandler);
    }
    if (this._gamesPreviewClickHandler) {
      const preview = this.querySelector('[data-bw-games-preview]');
      if (preview) preview.removeEventListener('click', this._gamesPreviewClickHandler);
    }
  }

  _ensureFont() {
    if (document.querySelector('link[data-bw-bouncer-page-font]')) return;
    const font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;600;700&display=swap';
    font.dataset.bwBouncerPageFont = 'true';
    document.head.appendChild(font);
  }

  _render() {
    const entryVariant = bouncerEntryVariantFor(this, bouncerAnalyticsConsent());
    this.dataset.entryVariant = entryVariant;
    const iframeUrl = new URL(`berlin-bouncer/index.html?attribution=none&resize=none&v=${ASSET_BUILD}`, BASE_URL);
    const parentParams = new URLSearchParams(window.location.search || '');
    const challengeId = bouncerSafeToken(parentParams.get('challenge') || parentParams.get('challengeId') || '', 100);
    if (challengeId) iframeUrl.searchParams.set('challenge', challengeId);
    if (parentParams.get('tracking') === 'local' || parentParams.get('local_tracking') === '1') {
      iframeUrl.searchParams.set('tracking', 'local');
    }
    this.innerHTML = `
      <style>
        bw-berlin-bouncer-page {
          --bw-dark: #070707;
          --bw-neon: #E6FF00;
          --bw-neon-dim: rgba(230, 255, 0, 0.2);
          --bw-gray: #888888;
          --bw-white: #FFFFFF;
          display: block;
          font-family: 'Chakra Petch', sans-serif;
          background: var(--bw-dark);
          box-shadow: 0 96px 0 0 var(--bw-dark);
          color: var(--bw-white);
          overflow: visible;
          position: relative;
          z-index: 0;
        }

        bw-berlin-bouncer-page *,
        bw-berlin-bouncer-page *::before,
        bw-berlin-bouncer-page *::after {
          box-sizing: border-box;
        }

        .bw-bouncer-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(340px, 420px);
          grid-template-areas:
            "content game"
            "features game"
            "cta game"
            "seo seo"
            "more more";
          gap: 40px 60px;
          max-width: 1200px;
          margin: 0 auto;
          align-items: center;
          min-height: 0 !important;
          padding: clamp(48px, 7svh, 56px) 20px 20px;
          position: relative;
          z-index: 1;
        }

        .bw-bouncer-content {
          grid-area: content;
        }

        .bw-bouncer-features {
          grid-area: features;
        }

        .bw-bouncer-eyebrow {
          color: var(--bw-neon);
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 4px;
          text-transform: uppercase;
          margin-bottom: 24px;
          display: inline-block;
          border: 1px solid var(--bw-neon);
          padding: 6px 12px;
          border-radius: 4px;
        }

        .bw-bouncer-content h1 {
          font-size: clamp(48px, 6vw, 96px);
          font-weight: 900;
          line-height: 0.9;
          margin: 0 0 24px 0;
          text-transform: uppercase;
          letter-spacing: -2px;
        }

        .bw-bouncer-content h1 span {
          color: var(--bw-gray);
          display: block;
        }

        .bw-bouncer-content p {
          color: var(--bw-gray);
          font-size: clamp(16px, 1.5vw, 20px);
          line-height: 1.6;
          margin: 0 0 40px 0;
          max-width: 500px;
        }

        .bw-bouncer-play-now {
          display: none;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--bw-neon);
          border-radius: 6px;
          background: var(--bw-neon);
          color: var(--bw-dark);
          cursor: pointer;
          font: inherit;
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 0.8px;
          padding: 13px 20px;
          text-transform: uppercase;
        }

        .bw-bouncer-play-now:hover {
          background: #CCFF00;
          transform: translateY(-1px);
        }

        .bw-bouncer-play-now:focus-visible,
        .bw-bouncer-tour-cta a:focus-visible,
        .bw-bouncer-games-preview a:focus-visible {
          outline: 3px solid var(--bw-neon);
          outline-offset: 4px;
        }

        .bw-bouncer-feature-list {
          list-style: none;
          padding: 0;
          margin: 0 0 40px 0;
        }

        .bw-bouncer-feature-list li {
          font-size: 16px;
          color: var(--bw-white);
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .bw-bouncer-feature-list li::before {
          content: "●";
          color: var(--bw-neon);
          font-size: 12px;
        }

        .bw-bouncer-tour-cta {
          grid-area: cta;
          background: #111;
          padding: 24px;
          border-radius: 16px;
          border-left: 4px solid var(--bw-neon);
          align-self: start;
        }

        .bw-bouncer-games-preview {
          grid-area: more;
          min-width: 0;
        }
        
        .bw-bouncer-tour-cta h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
        }
        
        .bw-bouncer-tour-cta p {
          font-size: 14px;
          margin: 0 0 16px 0;
        }
        
        .bw-bouncer-tour-cta a {
          color: var(--bw-dark);
          background: var(--bw-neon);
          text-decoration: none;
          padding: 12px 20px;
          border-radius: 6px;
          font-weight: 800;
          font-size: 14px;
          text-transform: uppercase;
          display: inline-block;
          transition: background 0.2s, transform 0.2s;
        }

        .bw-bouncer-tour-cta a:hover {
          background: #CCFF00;
          transform: translateY(-2px);
        }

        .bw-bouncer-seo-support {
          grid-area: seo;
          background: #111;
          border-top: 1px solid rgba(230, 255, 0, 0.35);
          padding: 28px clamp(20px, 4vw, 44px) 30px;
        }

        .bw-bouncer-seo-support h2 {
          color: var(--bw-neon);
          font-size: clamp(24px, 3vw, 36px);
          line-height: 1;
          margin: 0 0 14px;
        }

        .bw-bouncer-seo-support p,
        .bw-bouncer-seo-support dd {
          color: #D5D5D5;
          font-size: 15px;
          line-height: 1.65;
          margin: 0;
          max-width: 900px;
        }

        .bw-bouncer-seo-support .bw-bouncer-disclaimer {
          color: var(--bw-neon);
          font-size: 13px;
          font-weight: 700;
          margin-top: 12px;
        }

        .bw-bouncer-faq {
          display: grid;
          gap: 14px;
          margin: 24px 0 0;
        }

        .bw-bouncer-faq dt {
          color: var(--bw-white);
          font-size: 15px;
          font-weight: 800;
          margin: 0 0 4px;
        }

        .bw-bouncer-faq dd {
          color: #BFC6C1;
          font-size: 14px;
          line-height: 1.55;
        }

        .bw-bouncer-device {
          grid-area: game;
          position: relative;
          width: min(100%, 420px);
          max-width: 420px;
          height: clamp(560px, calc(100svh - 170px), 680px) !important;
          min-height: 0 !important;
          max-height: 680px !important;
          margin: 0 auto;
          background: #111;
          border-radius: 40px;
          box-shadow: 0 0 0 10px #222, 0 30px 80px rgba(0,0,0,0.8), 0 0 100px var(--bw-neon-dim);
          overflow: hidden;
          isolation: isolate;
        }

        .bw-bouncer-device iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100% !important;
          min-height: 0 !important;
          border: none;
          display: block;
        }

        /* Mobile Layout */
        @media (max-width: 960px) {
          .bw-bouncer-layout {
            grid-template-columns: 1fr;
            grid-template-areas:
              "content"
              "features"
              "game"
              "seo"
              "cta"
              "more";
            padding: 48px 20px 20px;
            gap: 40px;
          }
          
          .bw-bouncer-content {
            padding-right: 0;
            text-align: center;
          }
          
          .bw-bouncer-content p, 
          .bw-bouncer-feature-list {
            margin-left: auto;
            margin-right: auto;
            text-align: left;
            max-width: 400px;
          }

          .bw-bouncer-tour-cta {
            text-align: left;
          }

          .bw-bouncer-device {
            width: min(100%, 380px);
            height: clamp(500px, calc(100svh - 88px), 620px) !important;
            max-height: 620px !important;
            border-radius: 20px;
            box-shadow: 0 0 0 6px #222, 0 20px 40px rgba(0,0,0,0.8);
          }

          bw-berlin-bouncer-page[data-entry-variant="mobile_play_now"] .bw-bouncer-layout {
            grid-template-areas:
              "content"
              "game"
              "features"
              "seo"
              "cta"
              "more";
          }

          bw-berlin-bouncer-page[data-entry-variant="mobile_play_now"] .bw-bouncer-play-now {
            display: inline-flex;
            margin: -12px auto 0;
            min-width: min(100%, 220px);
          }
        }
      </style>

      <main class="bw-bouncer-layout">
        
        <div class="bw-bouncer-content">
          <div class="bw-bouncer-eyebrow">Playable Now</div>
          <h1>Can You Get <span>Into Berghain?</span></h1>
          <p>Play this fast Berghain simulator, choose your outfit and test your door instincts in under a minute.</p>
          <button class="bw-bouncer-play-now" id="bouncer-play-now" type="button">PLAY NOW</button>
        </div>

        <div class="bw-bouncer-features">
          <ul class="bw-bouncer-feature-list">
            <li>Choose your outfit wisely</li>
            <li>Answer under 10-second pressure</li>
            <li>Read the room before the final door</li>
            <li>Get a fictional result persona</li>
          </ul>
        </div>

        <div class="bw-bouncer-device" id="bouncer-game">
          <iframe 
            src="${iframeUrl.toString()}"
            allow="autoplay; clipboard-write; web-share; shared-storage"
            scrolling="no"
            title="Berghain Simulator">
          </iframe>
        </div>

        <div class="bw-bouncer-tour-cta">
          <h3>Survived the door?</h3>
          <p>My ~2h tip-based walking tour starts at Alexanderplatz and explores the historic centre of former East Berlin.</p>
          <a href="https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based">Book the Walking Tour</a>
        </div>

        <section class="bw-bouncer-seo-support" aria-labelledby="bouncer-how-title">
          <h2 id="bouncer-how-title">How the Berghain Simulator Works</h2>
          <p>Treat this as a quick fictional Berlin club-door game, not a dress-code calculator. First choose an outfit, then decide who you are queuing with and how you handle the wait. At the door, each question gives you about 10 seconds: answer calmly, keep the night moving and see how the fictional bouncer reads the moment. A result card gives you a playful outcome and a chance to try again or challenge a friend. It cannot forecast a real decision, and no outfit, answer or queue tactic guarantees entry.</p>
          <p class="bw-bouncer-disclaimer">This independent fictional simulator is for entertainment only. It is not affiliated with Berghain and cannot predict real entry decisions.</p>
          <dl class="bw-bouncer-faq" aria-label="Berghain simulator questions">
            <div>
              <dt>What is the Berghain simulator?</dt>
              <dd>A short fictional decision game about outfit, queue and door moments.</dd>
            </div>
            <div>
              <dt>Does this simulator predict whether I will get into Berghain?</dt>
              <dd>No. The result is playful and cannot predict a real admission decision.</dd>
            </div>
            <div>
              <dt>Is this an official Berghain game?</dt>
              <dd>No. It is an independent BerlinWalk entertainment game.</dd>
            </div>
            <div>
              <dt>How long does the game take?</dt>
              <dd>Most timed runs take about 20–40 seconds, depending on your choices.</dd>
            </div>
          </dl>
        </section>

        <section class="bw-bouncer-games-preview" data-bw-games-preview aria-label="More BerlinWalk games"></section>

      </main>
    `;
  }

  _bind() {
    this._handleHostResize = () => this._syncWixHostHeight();
    window.addEventListener('resize', this._handleHostResize, { passive: true });
    this._iframe = this.querySelector('.bw-bouncer-device iframe');
    this._iframeOrigin = this._iframe ? bouncerIframeOrigin(this._iframe) : '';
    this._handleBouncerMessage = (event) => {
      if (!this._iframe || event.source !== this._iframe.contentWindow) return;
      if (!this._iframeOrigin || event.origin !== this._iframeOrigin) return;
      const data = event.data && typeof event.data === 'object' ? event.data : null;
      if (!data) return;
      if (data.type === BOUNCER_READY_MESSAGE) {
        this._sendBouncerContext();
      }
    };
    window.addEventListener('message', this._handleBouncerMessage);
    this._iframeLoadHandler = () => this._sendBouncerContext();
    if (this._iframe) this._iframe.addEventListener('load', this._iframeLoadHandler);
    const playNow = this.querySelector('#bouncer-play-now');
    if (playNow) {
      this._playNowHandler = () => {
        const device = this.querySelector('.bw-bouncer-device');
        if (!device) return;
        const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        device.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        window.setTimeout(() => {
          if (this._iframe && typeof this._iframe.focus === 'function') this._iframe.focus({ preventScroll: true });
        }, reduceMotion ? 0 : 450);
      };
      playNow.addEventListener('click', this._playNowHandler);
    }
    this._handleConsentChange = () => this._sendBouncerContext();
    document.addEventListener('consentPolicyChanged', this._handleConsentChange);
    document.addEventListener('consentPolicyInitialized', this._handleConsentChange);
    this._bindParentClicks();
    this._setupVisibilityTracking();
    this._sendBouncerContext();
    this._renderGamesPreview();
    window.setTimeout(() => this._syncWixHostHeight(), 100);
    window.setTimeout(() => this._syncWixHostHeight(), 800);
  }

  _sendBouncerContext() {
    if (!this._iframe || !this._iframe.contentWindow || !this._iframeOrigin) return;
    const context = bouncerContextFor(this);
    this._lastBouncerContext = context;
    this._syncVisibilityStorage(context);
    try {
      this._iframe.contentWindow.postMessage({ type: BOUNCER_CONTEXT_MESSAGE, context }, this._iframeOrigin);
      if (this._visibilityEligible) {
        this._iframe.contentWindow.postMessage({ type: BOUNCER_VISIBLE_MESSAGE }, this._iframeOrigin);
      }
    } catch (error) {
      /* The iframe may disappear during Wix page transitions. */
    }
  }

  _syncVisibilityStorage(context) {
    // Visibility qualification remains in memory until analytics consent is
    // granted. Do not probe or mutate sessionStorage on unknown/denied paths.
    if (!context || context.analyticsConsent !== 'granted') {
      this._visibilityStorageKey = '';
      return;
    }
    const pageSessionId = context.pageSessionId;
    if (!pageSessionId) return;
    const visibilityKey = `${BOUNCER_PAGE_SESSION_KEY}:visible:${pageSessionId}`;
    if (this._visibilityStorageKey !== visibilityKey) {
      this._visibilityStorageKey = visibilityKey;
      if (!this._visibilityEligible && bouncerStorageGet(window.sessionStorage, visibilityKey) === '1') {
        this._visibilityEligible = true;
      }
    }
    if (this._visibilityEligible) bouncerStorageSet(window.sessionStorage, visibilityKey, '1');
  }

  _sendBouncerTrack(eventName, payload = {}) {
    if (!this._iframe || !this._iframe.contentWindow || !this._iframeOrigin) return;
    const allowedEvent = /^bw_berlin_bouncer_[a-z0-9_]{1,90}$/.test(String(eventName || ''));
    if (!allowedEvent) return;
    try {
      this._iframe.contentWindow.postMessage({
        type: BOUNCER_TRACK_MESSAGE,
        eventName,
        payload,
      }, this._iframeOrigin);
    } catch (error) {
      /* Parent click measurement is optional outside a live iframe. */
    }
  }

  _bindParentClicks() {
    const tourLink = this.querySelector('.bw-bouncer-tour-cta a');
    if (tourLink) {
      this._tourClickHandler = () => {
        this._sendBouncerTrack('bw_berlin_bouncer_tour_cta_click', {
          ctaName: 'walking_tour',
          href: this._safeClickPath(tourLink.href),
        });
      };
      tourLink.addEventListener('click', this._tourClickHandler);
    }

    const preview = this.querySelector('[data-bw-games-preview]');
    if (preview) {
      this._gamesPreviewClickHandler = (event) => {
        const target = event.target && typeof event.target.closest === 'function'
          ? event.target.closest('a')
          : null;
        if (!target || !preview.contains(target)) return;
        this._sendBouncerTrack('bw_berlin_bouncer_next_game_click', {
          game: target.getAttribute('data-game') || target.textContent || '',
          href: this._safeClickPath(target.href),
        });
      };
      preview.addEventListener('click', this._gamesPreviewClickHandler);
    }
  }

  _safeClickPath(href) {
    try {
      const url = new URL(href, window.location.href);
      return `${url.origin}${url.pathname}`.slice(0, 500);
    } catch (error) {
      return '';
    }
  }

  _setupVisibilityTracking() {
    const target = this.querySelector('.bw-bouncer-device');
    if (!target) return;
    const context = bouncerContextFor(this);
    this._visibilityEligible = false;
    this._visibilityStorageKey = '';
    this._syncVisibilityStorage(context);
    this._visibilityTimer = null;
    this._visibilityState = false;

    const resetTimer = () => {
      this._visibilityState = false;
      if (this._visibilityTimer) {
        window.clearTimeout(this._visibilityTimer);
        this._visibilityTimer = null;
      }
    };
    const qualify = () => {
      if (this._visibilityEligible || this._visibilityTimer || document.visibilityState === 'hidden') return;
      this._visibilityTimer = window.setTimeout(() => {
        this._visibilityTimer = null;
        if (!this._visibilityState || document.visibilityState === 'hidden') return;
        this._visibilityEligible = true;
        this._sendBouncerContext();
      }, 1000);
    };
    const updateState = (ratio) => {
      const visible = Number(ratio) >= 0.5 && document.visibilityState !== 'hidden';
      if (!visible) {
        resetTimer();
        return;
      }
      this._visibilityState = true;
      qualify();
    };

    if ('IntersectionObserver' in window) {
      this._visibilityObserver = new IntersectionObserver((entries) => {
        const entry = entries[0];
        updateState(entry && entry.isIntersecting ? entry.intersectionRatio : 0);
      }, { threshold: [0, 0.5] });
      this._visibilityObserver.observe(target);
    } else {
      this._visibilityFallbackHandler = () => {
        const rect = target.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
        const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
        updateState(rect.height > 0 ? visibleHeight / rect.height : 0);
      };
      window.addEventListener('scroll', this._visibilityFallbackHandler, { passive: true });
      window.addEventListener('resize', this._visibilityFallbackHandler, { passive: true });
      this._visibilityFallbackHandler();
    }
    this._visibilityChangeHandler = () => {
      if (document.visibilityState === 'hidden') resetTimer();
    };
    document.addEventListener('visibilitychange', this._visibilityChangeHandler);
  }

  _renderGamesPreview() {
    const target = this.querySelector('[data-bw-games-preview]');
    if (!target) return;
    loadGamesPreviewRail(() => {
      if (!window.BerlinWalkGamesPreviewRail) return;
      window.BerlinWalkGamesPreviewRail.render(target, {
        current: 'berghain-bouncer',
        source: 'berghain_bouncer_page',
        theme: 'night'
      });
      this._syncWixHostHeight();
    });
  }

  _syncWixHostHeight() {
    const wixShell = this.parentElement;
    if (!wixShell || !wixShell.id || !wixShell.id.startsWith('comp-')) return;

    const targets = [
      wixShell,
      wixShell.parentElement,
      this.closest('section'),
    ].filter(Boolean);

    const layout = this.querySelector('.bw-bouncer-layout');
    const height = layout ? Math.ceil(layout.getBoundingClientRect().height + 24) : 850;
    const isDesktop = window.matchMedia('(min-width: 961px)').matches;
    targets.forEach((target) => {
      if (isDesktop) {
        const targetHeight = `${Math.min(Math.max(height, 850), 2400)}px`;
        target.style.setProperty('height', targetHeight, 'important');
        target.style.setProperty('min-height', targetHeight, 'important');
      } else {
        target.style.removeProperty('height');
        target.style.removeProperty('min-height');
      }
    });
  }
}

if (!customElements.get('bw-berlin-bouncer-page')) {
  customElements.define('bw-berlin-bouncer-page', BwBerlinBouncerPage);
}
