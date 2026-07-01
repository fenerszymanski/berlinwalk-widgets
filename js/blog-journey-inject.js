/* blog-journey-inject.js - polishes Wix Blog post reading flow, adds mobile
 * guide chips, a topic-aware inline tool prompt, and a next-step module.
 * Loaded site-wide via Wix Custom Code.
 */
(function () {
  var DATA_URL = window.BW_BLOG_DATA_URL || 'https://fenerszymanski.github.io/berlinwalk-widgets/blog-index/data.json';
  var TOOLS_DATA_URL = window.BW_TOOLS_DATA_URL || 'https://fenerszymanski.github.io/berlinwalk-widgets/tools-hub/data.json';
  var STYLE_ID = 'bw-blog-journey-style';
  var STABILITY_STYLE_ID = 'bw-blog-journey-stability-style';
  var POST_BODY_MARKER = 'data-bw-blog-post-body';
  var POST_TITLE_MARKER = 'data-bw-blog-post-title';
  var MOBILE_NAV_MARKER = 'data-bw-blog-mobile-nav';
  var MOBILE_MARKER = 'data-bw-blog-mobile-guide';
  var TOOL_MARKER = 'data-bw-blog-tool-prompt';
  var JOURNEY_MARKER = 'data-bw-blog-journey';
  var BACK_TOP_MARKER = 'data-bw-blog-back-top';
  var EMPTY_PARAGRAPH_MARKER = 'data-bw-empty-paragraph';
  var WIDGET_BLOCK_MARKER = 'data-bw-blog-widget-block';
  var NATIVE_END_MARKER = 'data-bw-native-blog-end-hidden';
  var MIN_MOBILE_WIDTH = 900;
  var TOUR_IMAGE = 'https://static.wixstatic.com/media/5a08a3_ac78d5df37b2486ab6662cf3872ea9a6~mv2.jpg/v1/fill/w_700,h_420,al_c,q_86,enc_avif,quality_auto/file.jpg';
  var TOOL_ICON_BASE_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/tools-home/icons/';
  var DEFAULT_TOOL_IMAGE = TOOL_ICON_BASE_URL + 'generic-tool.svg';
  var BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
  var BOOKING_NEXT_ACTION_PATCH_URL = 'https://cdn.jsdelivr.net/gh/fenerszymanski/berlinwalk-widgets@d0ef0f3/booking-calendar/book-now-intro-patch.js';
  var TRIP_PLANNER_URL = 'https://www.berlinwalk.com/berlin-trip-planner';
  var TRACK_ENDPOINT = 'https://berlinwalk-content-app.vercel.app/api/pf-event';
  var ATTRIBUTION_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id', 'fbclid', 'fbc', 'fbp'];
  var dataCache = null;
  var dataPromise = null;
  var renderTimer = null;
  var observer = null;
  var lastPath = location.pathname;
  var backTopScrollHandler = null;
  var bootAt = Date.now();
  var readyTimer = null;

  installDelayedConsentGuard();
  loadBookingNextActionPatch();
  installConsentGatedBookingAnalytics();
  installConsentSettingsUi();

  function installDelayedConsentGuard() {
    if (window.__bwDelayedConsentGuard) return;
    window.__bwDelayedConsentGuard = true;

    var analyticsKeys = {
      'bwPaidTracking.v1': true,
      'bwVisitorId.v1': true,
      'bwSessionId.v1': true,
      'bwTripPlannerTracking.v1': true,
      'bwTripPlannerVisitorId.v1': true,
      'bwTripPlannerSessionId.v1': true
    };
    var functionalKeys = {
      'bwStickyCtaDismissed.v1': true,
      'bwStickyCtaMinimized.v1': true,
      'bw_sticky_cta_closed': true,
      'bw_desktop_cta_dismissed': true
    };
    var firstPartyEventRe = /berlinwalk-content-app\.vercel\.app\/api\/(?:pf-event|tp-event)/i;
    var metaEventRe = /(?:facebook\.com\/tr|connect\.facebook\.net|\/_serverless\/analytics-reporter\/facebook\/event)/i;

    function readCookiePolicy() {
      try {
        var match = document.cookie.match(/(?:^|;\s*)consent-policy=([^;]+)/);
        return match ? JSON.parse(decodeURIComponent(match[1])) : {};
      } catch (err) {
        return {};
      }
    }

    function policy() {
      var current = currentConsentPolicy();
      return current && Object.keys(current).length ? current : readCookiePolicy();
    }

    function hasConsent(kind) {
      var current = policy();
      if (kind === 'analytics') return current.analytics === true || current.anl === true || current.anl === 1;
      if (kind === 'advertising') return current.advertising === true || current.adv === true || current.adv === 1;
      if (kind === 'functional') return current.functional === true || current.func === true || current.func === 1;
      return false;
    }

    function urlFrom(input) {
      try {
        if (typeof input === 'string') return input;
        if (input && typeof input.url === 'string') return input.url;
      } catch (err) {}
      return '';
    }

    function shouldBlock(url) {
      if (!url) return false;
      if (firstPartyEventRe.test(url)) return !hasConsent('analytics');
      if (metaEventRe.test(url)) return !hasConsent('advertising');
      return false;
    }

    function okResponse() {
      if (typeof Response === 'function') return new Response(null, { status: 204, statusText: 'Blocked by BerlinWalk consent guard' });
      return { ok: true, status: 204, text: function () { return Promise.resolve(''); }, json: function () { return Promise.resolve({}); } };
    }

    function guardStorage(storage, keyMap, consentKind) {
      var guardMap = window.__bwDelayedConsentStorageGuards || (window.__bwDelayedConsentStorageGuards = {});
      var guardKey = (storage === window.localStorage ? 'local' : 'session') + ':' + consentKind;
      if (!storage || !storage.setItem || guardMap[guardKey]) return;
      var nativeSetItem = storage.setItem;
      var nativeRemoveItem = storage.removeItem;
      storage.setItem = function (key) {
        var name = String(key || '');
        if (keyMap[name] && !hasConsent(consentKind)) return undefined;
        return nativeSetItem.apply(this, arguments);
      };
      guardMap[guardKey] = true;

      function clearBlockedKeys() {
        if (hasConsent(consentKind)) return;
        Object.keys(keyMap).forEach(function (key) {
          try { nativeRemoveItem.call(storage, key); } catch (err) {}
        });
      }

      clearBlockedKeys();
      [250, 1000, 3000, 7000].forEach(function (delay) {
        window.setTimeout(clearBlockedKeys, delay);
      });
      window.addEventListener('consentPolicyChanged', clearBlockedKeys);
      window.addEventListener('consentPolicyInitialized', clearBlockedKeys);
      window.addEventListener('ucConsentEvent', clearBlockedKeys);
    }

    guardStorage(window.localStorage, analyticsKeys, 'analytics');
    guardStorage(window.sessionStorage, analyticsKeys, 'analytics');
    guardStorage(window.localStorage, functionalKeys, 'functional');
    guardStorage(window.sessionStorage, functionalKeys, 'functional');

    if (window.fetch && !window.fetch.__bwDelayedConsentGuarded) {
      var nativeFetch = window.fetch;
      var guardedFetch = function (input, init) {
        if (shouldBlock(urlFrom(input))) return Promise.resolve(okResponse());
        return nativeFetch.apply(this, arguments);
      };
      guardedFetch.__bwDelayedConsentGuarded = true;
      window.fetch = guardedFetch;
    }

    if (navigator.sendBeacon && !navigator.sendBeacon.__bwDelayedConsentGuarded) {
      var nativeSendBeacon = navigator.sendBeacon.bind(navigator);
      var guardedSendBeacon = function (url, data) {
        if (shouldBlock(urlFrom(url))) return true;
        return nativeSendBeacon(url, data);
      };
      guardedSendBeacon.__bwDelayedConsentGuarded = true;
      navigator.sendBeacon = guardedSendBeacon;
    }
  }

  function isBookingFlowPatchPage() {
    var path = location.pathname.toLowerCase();
    return path.indexOf('/book-berlin-walking-tour/') === 0 || path.indexOf('/booking-form') === 0;
  }

  function loadBookingNextActionPatch() {
    if (!isBookingFlowPatchPage()) return;
    if (document.querySelector('script[src="' + BOOKING_NEXT_ACTION_PATCH_URL + '"]')) return;
    var script = document.createElement('script');
    script.src = BOOKING_NEXT_ACTION_PATCH_URL;
    script.defer = true;
    document.head.appendChild(script);
  }

  function installConsentGatedBookingAnalytics() {
    if (window.__bwConsentAnalyticsEventsInstalled) return;
    window.__bwConsentAnalyticsEventsInstalled = true;

    var path = window.location.pathname.toLowerCase();
    var isBookingService = path === '/book-berlin-walking-tour' || path.indexOf('/book-berlin-walking-tour/') === 0;
    var isBookingForm = path.indexOf('/booking-form') === 0;
    var isThankYou = path.indexOf('/thank-you-page') === 0;
    var isBookingFlow = isBookingService || isBookingForm || path.indexOf('/booking-confirmation') === 0 || isThankYou;
    if (!isBookingFlow) return;

    var params = new URLSearchParams(window.location.search || '');
    var storeKey = 'bwPaidTracking.v1';
    var visitorKey = 'bwVisitorId.v1';
    var sessionKey = 'bwSessionId.v1';
    var tracking = null;
    var sent = {};

    function policy() {
      var current = currentConsentPolicy();
      return current && Object.keys(current).length ? current : {};
    }

    function analyticsAllowed() {
      return policy().analytics === true;
    }

    function randomId(prefix) {
      return prefix + '_' + Math.random().toString(36).slice(2) + '_' + Date.now().toString(36);
    }

    function readJSON(storage, key) {
      try {
        var raw = storage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      } catch (err) {
        return null;
      }
    }

    function writeJSON(storage, key, value) {
      try { storage.setItem(key, JSON.stringify(value)); } catch (err) {}
    }

    function getOrCreateId(storage, key, prefix) {
      try {
        var existing = storage.getItem(key);
        if (existing) return existing;
        var value = randomId(prefix);
        storage.setItem(key, value);
        return value;
      } catch (err) {
        return randomId(prefix);
      }
    }

    function hasPaidSignal(data) {
      var joined = [data.utm_source, data.utm_medium, data.utm_campaign].join(' ').toLowerCase();
      return /(^|[^a-z])(meta|facebook|instagram|fb|ig|paid|cpc|paid_social)([^a-z]|$)/i.test(joined);
    }

    function initTracking() {
      if (!analyticsAllowed()) return null;
      var stored = readJSON(window.localStorage, storeKey) || {};
      var current = {
        utm_source: params.get('utm_source') || '',
        utm_medium: params.get('utm_medium') || '',
        utm_campaign: params.get('utm_campaign') || '',
        utm_content: params.get('utm_content') || '',
        utm_term: params.get('utm_term') || ''
      };
      var hasCurrent = Boolean(current.utm_source || current.utm_medium || current.utm_campaign || current.utm_content || current.utm_term);
      var merged = Object.assign({}, stored);
      if (!merged.visitorId) merged.visitorId = getOrCreateId(window.localStorage, visitorKey, 'bw_v');
      merged.sessionId = getOrCreateId(window.sessionStorage, sessionKey, 'bw_s');
      if (!merged.firstPage) merged.firstPage = window.location.pathname;
      if (!merged.landingPage) merged.landingPage = window.location.href;
      if (!merged.createdAt) merged.createdAt = new Date().toISOString();
      if (hasCurrent || !stored.utm_source) {
        Object.keys(current).forEach(function (key) {
          if (current[key]) merged[key] = current[key];
        });
        merged.landingPage = stored.landingPage || window.location.href;
      }
      delete merged.fbclid;
      delete merged.fbc;
      delete merged.fbp;
      merged.isPaid = hasPaidSignal(merged);
      merged.updatedAt = new Date().toISOString();
      writeJSON(window.localStorage, storeKey, merged);
      return merged;
    }

    function ensureTracking() {
      if (!tracking) tracking = initTracking();
      return tracking;
    }

    function serverEventName(name) {
      return name === 'bw_book_link_click' ? 'bw_booking_pick_date_click' : name;
    }

    function sendEndpoint(name, payload, state) {
      var body = JSON.stringify({
        eventName: serverEventName(name),
        eventId: randomId('bw_e'),
        consentGranted: true,
        analyticsConsent: true,
        consent: { analytics: true },
        timestamp: new Date().toISOString(),
        eventDate: new Date().toISOString().slice(0, 10),
        sessionId: state.sessionId,
        visitorId: state.visitorId,
        isPaid: Boolean(state.isPaid),
        pagePath: window.location.pathname,
        pageUrl: window.location.href,
        referrer: document.referrer || '',
        landingPage: state.landingPage || '',
        firstPage: state.firstPage || '',
        utmSource: state.utm_source || '',
        utmMedium: state.utm_medium || '',
        utmCampaign: state.utm_campaign || '',
        utmContent: state.utm_content || '',
        utmTerm: state.utm_term || '',
        screenWidth: String(window.screen && window.screen.width || ''),
        viewportWidth: String(window.innerWidth || ''),
        payload: payload || {}
      });

      function beaconFallback() {
        try {
          if (navigator.sendBeacon) {
            navigator.sendBeacon(TRACK_ENDPOINT, new Blob([body], { type: 'application/json' }));
          }
        } catch (err) {}
      }

      try {
        if (window.fetch) {
          window.fetch(TRACK_ENDPOINT, {
            method: 'POST',
            mode: 'cors',
            keepalive: true,
            headers: { 'Content-Type': 'application/json' },
            body: body
          }).then(function (response) {
            if (!response || !response.ok) beaconFallback();
          }).catch(beaconFallback);
          return;
        }
      } catch (err) {
        beaconFallback();
        return;
      }
      beaconFallback();
    }

    function sendEvent(name, detail) {
      if (!analyticsAllowed()) return false;
      var state = ensureTracking();
      if (!state) return false;
      var payload = Object.assign({
        page_path: window.location.pathname,
        utm_source: state.utm_source || params.get('utm_source') || '',
        utm_medium: state.utm_medium || params.get('utm_medium') || '',
        utm_campaign: state.utm_campaign || params.get('utm_campaign') || ''
      }, detail || {});
      try {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(Object.assign({ event: name }, payload));
      } catch (err) {}
      try {
        if (typeof window.gtag === 'function') window.gtag('event', name, payload);
      } catch (err) {}
      sendEndpoint(name, payload, state);
      return true;
    }

    function once(key, name, detail) {
      if (sent[key]) return;
      if (sendEvent(name, detail)) sent[key] = true;
    }

    function sendInitialBookingEvents() {
      if (isBookingService) once('booking_page_view', 'bw_booking_page_view', {});
      if (isBookingForm) once('booking_form_view', 'bw_booking_form_view', {});
      if (isThankYou) once('booking_complete', 'bw_booking_complete', {});
    }

    document.addEventListener('bwBookingFunnelEvent', function (event) {
      var detail = event.detail || {};
      if (detail.name) sendEvent(detail.name, detail.payload || {});
    });
    document.addEventListener('bwStickyCtaEvent', function (event) {
      var detail = event.detail || {};
      if (detail.name) sendEvent(detail.name, detail.payload || {});
    });
    document.addEventListener('consentPolicyChanged', sendInitialBookingEvents);
    document.addEventListener('consentPolicyInitialized', sendInitialBookingEvents);
    sendInitialBookingEvents();
    window.setTimeout(sendInitialBookingEvents, 800);
  }

  function installConsentSettingsUi() {
    if (window.__bwConsentSettingsUiInstalled) return;
    window.__bwConsentSettingsUiInstalled = true;

    var STYLE_MARKER = 'bw-consent-settings-ui-style';
    var LINK_MARKER = 'data-bw-privacy-settings';
    var HIDE_SELECTORS = [
      '[data-testid="uc-privacy-button"]',
      '[data-testid*="privacy-button"]',
      '[data-testid*="PrivacyButton"]',
      '.uc-privacy-button',
      '.uc-privacy-icon',
      'button[aria-label="Privacy Settings"]',
      'button[aria-label="Privacy settings"]',
      'button[aria-label="Open Privacy Settings"]'
    ].join(',');

    function addStyle(root) {
      try {
        if (!root || root.getElementById && root.getElementById(STYLE_MARKER)) return;
        if (!root.querySelector || root.querySelector('#' + STYLE_MARKER)) return;
        var style = document.createElement('style');
        style.id = STYLE_MARKER;
        style.textContent = [
          HIDE_SELECTORS + '{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}',
          '.bw-privacy-settings-link{background:transparent;border:0;color:inherit;cursor:pointer;font:inherit;font-weight:700;padding:0;text-decoration:none}',
          '.bw-privacy-settings-link:hover,.bw-privacy-settings-link:focus-visible{color:#fff;outline:0;text-decoration:none}',
          '.bw-privacy-settings-link:focus-visible{box-shadow:0 2px 0 #FFE600}'
        ].join('');
        (root.head || root).appendChild(style);
      } catch (err) {}
    }

    function looksLikePrivacyButton(el) {
      if (!el || el.nodeType !== 1) return false;
      if (el.hasAttribute && el.hasAttribute(LINK_MARKER)) return false;
      var label = [
        el.getAttribute('aria-label') || '',
        el.getAttribute('title') || '',
        el.getAttribute('data-testid') || '',
        el.className || '',
        el.textContent || ''
      ].join(' ').toLowerCase();
      if (label.indexOf('privacy') === -1 && label.indexOf('consent') === -1 && label.indexOf('uc-') === -1) return false;
      var rect = el.getBoundingClientRect ? el.getBoundingClientRect() : { width: 0, height: 0 };
      return rect.width <= 90 && rect.height <= 90;
    }

    function collectConsentRoots() {
      var roots = [document];
      try {
        document.querySelectorAll('#usercentrics-root,[id*="usercentrics"],[class*="usercentrics"],[data-testid*="uc-"]').forEach(function (el) {
          roots.push(el);
          if (el.shadowRoot) roots.push(el.shadowRoot);
        });
        Array.prototype.forEach.call(document.body ? document.body.children : [], function (el) {
          if (el.shadowRoot) roots.push(el.shadowRoot);
        });
      } catch (err) {}
      return roots.filter(function (root, index, list) {
        return root && list.indexOf(root) === index;
      });
    }

    function hidePrivacyButtons(root) {
      try {
        if (!root || !root.querySelectorAll) return;
        addStyle(root);
        root.querySelectorAll(HIDE_SELECTORS).forEach(function (el) {
          el.style.setProperty('display', 'none', 'important');
          el.style.setProperty('visibility', 'hidden', 'important');
          el.style.setProperty('pointer-events', 'none', 'important');
        });
        root.querySelectorAll('button,[role="button"],a').forEach(function (el) {
          if (!looksLikePrivacyButton(el)) return;
          el.style.setProperty('display', 'none', 'important');
          el.style.setProperty('visibility', 'hidden', 'important');
          el.style.setProperty('pointer-events', 'none', 'important');
        });
      } catch (err) {}
    }

    function openConsentSettings(event) {
      if (event) event.preventDefault();
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
          return;
        }
      } catch (err) {}
      try {
        document.dispatchEvent(new CustomEvent('bwOpenConsentSettings'));
      } catch (err) {}
    }

    function addFooterLink() {
      try {
        if (document.querySelector('[' + LINK_MARKER + ']')) return;
        var footerLinks = document.querySelector('.bw-site-footer .bw-footer-bottom-links');
        var footer = footerLinks || document.querySelector('.bw-site-footer footer, .bw-site-footer, footer');
        if (!footer) return;
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'bw-privacy-settings-link';
        button.setAttribute(LINK_MARKER, 'true');
        button.textContent = 'Privacy Settings';
        button.addEventListener('click', openConsentSettings);
        footer.appendChild(button);
      } catch (err) {}
    }

    function run() {
      addStyle(document);
      collectConsentRoots().forEach(hidePrivacyButtons);
      addFooterLink();
    }

    document.addEventListener('click', function (event) {
      var target = event.target && event.target.closest ? event.target.closest('[' + LINK_MARKER + ']') : null;
      if (target) openConsentSettings(event);
    });
    run();
    [250, 1000, 3000, 7000, 12000].forEach(function (delay) {
      window.setTimeout(run, delay);
    });
  }

  var BLOG_CATEGORIES = [
    { slug: 'tourist-tips', label: 'Tourist Tips', url: 'https://www.berlinwalk.com/blog/categories/tourist-tips' },
    { slug: 'tour-route', label: 'Tour Route', url: 'https://www.berlinwalk.com/blog/categories/tour-route' },
    { slug: 'berlin-history', label: 'History', url: 'https://www.berlinwalk.com/blog/categories/berlin-history' },
    { slug: 'berlin-myths', label: 'Berlin Myths', url: 'https://www.berlinwalk.com/blog/categories/berlin-myths' },
    { slug: 'before-after', label: 'Before & After', url: 'https://www.berlinwalk.com/blog/categories/before-after' },
    { slug: 'german-language', label: 'German Language', url: 'https://www.berlinwalk.com/blog/categories/german-language' }
  ];

  var TOOL_FALLBACKS = {
    'berlin-first-day-planner': {
      title: 'Berlin First-Day Planner',
      url: 'https://www.berlinwalk.com/tools/berlin-first-day-planner',
      summary: 'Turn arrival time, luggage, weather, and energy into a realistic first-day plan.'
    },
    'berlin-public-toilets': {
      title: 'Berlin Public Toilet Finder',
      url: 'https://www.berlinwalk.com/tools/berlin-public-toilets',
      summary: 'Find official toilets, free options, and accessible locations around Berlin.'
    },
    'berlin-luggage-storage': {
      title: 'Berlin Luggage Storage Map',
      url: 'https://www.berlinwalk.com/tools/berlin-luggage-storage',
      summary: 'Find lockers, station storage, airport options, and app pickup points.'
    },
    'transport-ticket-calculator': {
      title: 'Berlin Transport Ticket Calculator',
      url: 'https://www.berlinwalk.com/tools/transport-ticket-calculator',
      summary: 'Pick the right ticket for the journeys you actually plan to take.'
    },
    'best-month-to-visit-berlin': {
      title: 'Best Month to Visit Berlin',
      url: 'https://www.berlinwalk.com/tools/best-month-to-visit-berlin',
      summary: 'Compare months by weather, light, crowds, and walking comfort.'
    },
    'berlin-daily-budget': {
      title: 'Berlin Daily Budget Calculator',
      url: 'https://www.berlinwalk.com/tools/berlin-daily-budget',
      summary: 'Estimate your daily Berlin costs without generic Europe averages.'
    },
    'berlin-free-things-to-do': {
      title: 'Free Things to Do in Berlin',
      url: 'https://www.berlinwalk.com/tools/berlin-free-things-to-do',
      summary: 'Map genuinely free attractions, viewpoints, museums, and walks.'
    },
    'berlin-safety': {
      title: 'Berlin Safety Map',
      url: 'https://www.berlinwalk.com/tools/berlin-safety',
      summary: 'Check practical safety notes by neighborhood and traveler type.'
    },
    'east-or-west-1989': {
      title: 'East or West Berlin in 1989?',
      url: 'https://www.berlinwalk.com/tools/east-or-west-1989',
      summary: 'Pick a landmark and see which side of the Wall it was on.'
    },
    'berlin-currywurst-finder': {
      title: 'Berlin Currywurst Finder',
      url: 'https://www.berlinwalk.com/tools/berlin-currywurst-finder',
      summary: 'Find the currywurst stand that fits your route, appetite, and timing.'
    },
    'berlin-club-picker': {
      title: 'Berlin Club Picker',
      url: 'https://www.berlinwalk.com/tools/berlin-club-picker',
      summary: 'Match your night, outfit, group, and door-difficulty comfort.'
    }
  };

  var TOOL_ICON_FALLBACKS = {
    'berlin-first-day-planner': TOOL_ICON_BASE_URL + 'berlin-first-day-planner-160.png',
    'berlin-public-toilets': TOOL_ICON_BASE_URL + 'berlin-public-toilets-160.png',
    'berlin-luggage-storage': TOOL_ICON_BASE_URL + 'berlin-luggage-storage-160.png',
    'transport-ticket-calculator': TOOL_ICON_BASE_URL + 'transport-ticket-calculator-160.png',
    'best-month-to-visit-berlin': TOOL_ICON_BASE_URL + 'best-month-to-visit-berlin-160.png',
    'berlin-daily-budget': TOOL_ICON_BASE_URL + 'berlin-daily-budget-160.png',
    'berlin-free-things-to-do': TOOL_ICON_BASE_URL + 'berlin-free-things-to-do-160.png',
    'berlin-safety': TOOL_ICON_BASE_URL + 'berlin-safety-160.png',
    'east-or-west-1989': TOOL_ICON_BASE_URL + 'east-or-west-1989-160.png',
    'berlin-currywurst-finder': TOOL_ICON_BASE_URL + 'berlin-currywurst-finder-160.png',
    'berlin-club-picker': TOOL_ICON_BASE_URL + 'berlin-club-picker-160.png'
  };

  function isPostPage() {
    return location.pathname.indexOf('/post/') === 0;
  }

  function currentSlug() {
    return location.pathname.split('/').filter(Boolean).pop() || '';
  }

  function cleanText(text) {
    return String(text || '').replace(/\s+/g, ' ').trim();
  }

  function escapeHtml(text) {
    return String(text || '').replace(/[&<>"']/g, function (ch) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
    });
  }

  function escapeAttr(text) {
    return escapeHtml(text).replace(/`/g, '&#96;');
  }

  function isVisible(el) {
    while (el && el !== document.body && el.nodeType === 1) {
      var style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
      el = el.parentElement;
    }
    return true;
  }

  function findPostBody() {
    var selectors = [
      '[data-hook="post-content"]',
      '[data-hook="rich-content-viewer"]',
      '[data-hook="rich-content"]',
      '.post-content',
      '.rich-content',
      '.blog-post-page-content',
      'article',
      'main'
    ];
    for (var i = 0; i < selectors.length; i++) {
      var el = document.querySelector(selectors[i]);
      if (el && el.querySelectorAll('p').length >= 3) return el;
    }
    return null;
  }

  function slugify(text) {
    return cleanText(text)
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 64) || 'section';
  }

  function escapeSelector(value) {
    if (window.CSS && window.CSS.escape) return window.CSS.escape(value);
    return String(value).replace(/[^a-zA-Z0-9_-]/g, '\\$&');
  }

  function collectHeadings(body) {
    var raw = body ? body.querySelectorAll('h2, h3') : [];
    var used = {};
    var items = [];
    for (var i = 0; i < raw.length && items.length < 7; i++) {
      var heading = raw[i];
      var text = cleanText(heading.textContent);
      if (!text || text.length < 3) continue;
      if (/^(share|related posts?|recent posts?|comments?|leave a reply)$/i.test(text)) continue;
      if (heading.closest('[' + MOBILE_NAV_MARKER + '], [' + MOBILE_MARKER + '], [' + TOOL_MARKER + '], [' + JOURNEY_MARKER + '], [data-bw-leadform], [data-bw-tourcta]')) continue;
      if (!isVisible(heading)) continue;
      var base = slugify(text);
      var id = heading.id || 'bw-guide-' + base;
      var suffix = 2;
      while (used[id] || document.querySelectorAll('#' + escapeSelector(id)).length > (heading.id ? 1 : 0)) {
        id = 'bw-guide-' + base + '-' + suffix;
        suffix++;
      }
      used[id] = true;
      heading.id = id;
      items.push({ id: id, text: text, level: heading.tagName.toLowerCase(), node: heading });
    }
    return items;
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"]{color:#212121;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] [' + EMPTY_PARAGRAPH_MARKER + '="1"]{display:none!important;height:0!important;line-height:0!important;margin:0!important;min-height:0!important;padding:0!important;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] p:not(.bw-blog-mobile-guide-title):not(.bw-blog-journey-intro):not(.bw-blog-tool-copy):not([' + EMPTY_PARAGRAPH_MARKER + ']){font-family:Merriweather,Georgia,serif!important;font-size:18px!important;line-height:1.74!important;margin:0 0 18px!important;}',
      'body.bw-blog-post-enhanced [' + POST_TITLE_MARKER + '="1"]{color:#212121!important;display:block!important;font-family:Montserrat,Arial,sans-serif!important;font-weight:900!important;font-variation-settings:"wght" 900!important;letter-spacing:0!important;line-height:1.06!important;max-width:100%!important;width:100%!important;-webkit-text-stroke:.18px currentColor!important;text-shadow:.18px 0 0 currentColor,-.18px 0 0 currentColor!important;}',
      'body.bw-blog-post-enhanced [' + POST_TITLE_MARKER + '="1"] *{color:inherit!important;font-family:inherit!important;font-size:inherit!important;font-style:normal!important;font-weight:900!important;font-variation-settings:"wght" 900!important;letter-spacing:0!important;line-height:inherit!important;-webkit-text-stroke:.18px currentColor!important;text-shadow:.18px 0 0 currentColor,-.18px 0 0 currentColor!important;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] h2,body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] h3{font-family:Montserrat,Arial,sans-serif!important;font-weight:900!important;font-variation-settings:"wght" 900!important;letter-spacing:0!important;color:#212121!important;scroll-margin-top:96px;-webkit-text-stroke:.12px currentColor!important;text-shadow:.12px 0 0 currentColor!important;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] h2 *,body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] h3 *{color:inherit!important;font-family:inherit!important;font-size:inherit!important;font-style:normal!important;font-weight:900!important;font-variation-settings:"wght" 900!important;letter-spacing:0!important;line-height:inherit!important;-webkit-text-stroke:.12px currentColor!important;text-shadow:.12px 0 0 currentColor!important;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] h2{border-top:2px solid #212121;font-size:clamp(28px,4vw,38px)!important;line-height:1.06!important;margin:42px 0 14px!important;padding-top:24px!important;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] h3{font-size:clamp(21px,3vw,26px)!important;line-height:1.12!important;margin:30px 0 10px!important;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] a:not(.bw-blog-mobile-nav-home):not(.bw-blog-mobile-nav-item):not(.bw-blog-mobile-guide-list a):not(.bw-blog-tool-button):not(.bw-blog-journey-card){color:#1B5E20!important;text-decoration-color:#FFE600!important;text-decoration-thickness:3px!important;text-underline-offset:3px!important;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] img{max-width:100%;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] [' + WIDGET_BLOCK_MARKER + '="1"]{display:block!important;margin-bottom:34px!important;}',
      'body.bw-blog-post-enhanced [data-bw-leadform]{margin:38px 0!important;}',
      '.bw-blog-mobile-nav,.bw-blog-mobile-guide,.bw-blog-tool-prompt,.bw-blog-journey,.bw-blog-back-top{box-sizing:border-box;font-family:Montserrat,Arial,sans-serif;color:#212121;}',
      '.bw-blog-mobile-nav *,.bw-blog-mobile-guide *,.bw-blog-tool-prompt *,.bw-blog-journey *{box-sizing:border-box;}',
      '.bw-blog-mobile-nav{display:none;}',
      '.bw-blog-mobile-nav-brand{align-items:center;background:#FFE600;color:#212121;display:inline-flex;font-size:12px;font-weight:900;letter-spacing:1.25px;line-height:1;max-width:100%;min-height:34px;padding:0 12px;text-transform:uppercase;white-space:nowrap;}',
      '.bw-blog-mobile-nav-divider{border-top:2px solid #212121;height:0;margin:18px 0 24px;}',
      '.bw-blog-mobile-nav-home{align-items:center;background:#1B5E20;border:1px solid #1B5E20;border-radius:0;color:#FFFFFF!important;display:inline-flex;font-size:13px;font-weight:900;line-height:1;min-height:36px;padding:0 16px;text-decoration:none!important;white-space:nowrap;}',
      '.bw-blog-mobile-nav-scroll{margin:0;overflow:hidden;position:relative;}',
      '.bw-blog-mobile-nav-scroll:after{background:linear-gradient(90deg,rgba(250,250,245,0),#FAFAF5 80%);content:"";display:block;height:100%;pointer-events:none;position:absolute;right:0;top:0;width:28px;}',
      '.bw-blog-mobile-nav-label{color:#1B5E20;display:block;font-size:11px;font-weight:900;letter-spacing:2px;line-height:1;margin:22px 0 11px;text-transform:uppercase;}',
      '.bw-blog-mobile-nav-list{display:flex;gap:9px;list-style:none;margin:0;overflow-x:auto;padding:0 28px 2px 0;scrollbar-width:none;}',
      '.bw-blog-mobile-nav-list::-webkit-scrollbar{display:none;}',
      '.bw-blog-mobile-nav-list a{align-items:center;background:#FFFFFF;border:2px solid #212121;border-radius:0;color:#212121!important;display:inline-flex;font-size:12px;font-weight:900;line-height:1;min-height:36px;padding:0 13px;text-decoration:none!important;white-space:nowrap;}',
      '.bw-blog-mobile-nav-list a.bw-blog-mobile-nav-active{background:#FFE600;border-color:#212121;color:#212121!important;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] .bw-blog-mobile-nav a{text-decoration:none!important;text-decoration-color:transparent!important;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] .bw-blog-mobile-nav .bw-blog-mobile-nav-home{color:#FFFFFF!important;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] .bw-blog-mobile-nav-list a{color:#212121!important;}',
      '.bw-blog-mobile-guide{background:#FAFAF5;border-top:2px solid #212121;border-bottom:2px solid #212121;margin:18px 0 24px;padding:16px 0 14px;}',
      '.bw-blog-mobile-guide-title{color:#1B5E20;font-size:11px;font-weight:900;letter-spacing:1.5px;line-height:1;margin:0 0 12px;text-transform:uppercase;}',
      '.bw-blog-mobile-guide-list{display:flex;gap:8px;list-style:none;margin:0;overflow-x:auto;padding:1px 0 6px;scrollbar-width:none;}',
      '.bw-blog-mobile-guide-list::-webkit-scrollbar{display:none;}',
      '.bw-blog-mobile-guide-list a{background:#FFFFFF;border:1px solid #212121;border-radius:0;color:#212121;display:inline-flex;font-size:12px;font-weight:900;line-height:1.15;min-height:36px;padding:0 12px;align-items:center;text-decoration:none;white-space:nowrap;}',
      '.bw-blog-mobile-nav a:focus-visible,.bw-blog-mobile-guide-list a:focus-visible,.bw-blog-tool-prompt a:focus-visible,.bw-blog-journey a:focus-visible,.bw-blog-back-top:focus-visible{outline:3px solid rgba(255,230,0,.9);outline-offset:3px;}',
      '.bw-blog-tool-prompt{align-items:center;background:#FAFAF5;border:2px solid #212121;display:grid;gap:20px;grid-template-columns:minmax(0,1fr) auto;margin:34px 0;padding:22px;}',
      '.bw-blog-tool-kicker,.bw-blog-journey-kicker{color:#1B5E20;display:block;font-size:11px;font-weight:900;letter-spacing:1.5px;line-height:1;margin:0 0 10px;text-transform:uppercase;}',
      '.bw-blog-tool-prompt strong{color:#212121;display:block;font-size:24px;font-weight:900;line-height:1.08;margin:0 0 7px;}',
      '.bw-blog-tool-copy{color:#4E5A4E!important;display:block;font-family:Merriweather,Georgia,serif!important;font-size:15px!important;line-height:1.48!important;margin:0!important;}',
      '.bw-blog-tool-button{align-items:center;background:#FFE600;border:1px solid #212121;color:#212121;display:inline-flex;font-size:12px;font-weight:900;justify-content:center;letter-spacing:.8px;min-height:42px;padding:0 15px;text-decoration:none;text-transform:uppercase;white-space:nowrap;}',
      '.bw-blog-journey{background:#111111;color:#FFFFFF;margin:42px 0 34px;padding:28px;position:relative;overflow:hidden;}',
      '.bw-blog-journey:before{background:linear-gradient(90deg,#FFE600,#7CB342);content:"";display:block;height:5px;left:0;position:absolute;top:0;width:100%;}',
      '.bw-blog-journey-kicker{color:#FFE600;}',
      '.bw-blog-journey h2{color:#FFFFFF!important;font-size:clamp(27px,4vw,36px)!important;font-weight:900!important;letter-spacing:0!important;line-height:1.06!important;margin:0 0 8px!important;padding:0!important;border:0!important;}',
      '.bw-blog-journey-intro{color:rgba(255,255,255,.86);font-family:Merriweather,Georgia,serif;font-size:15px;line-height:1.58;margin:0 0 22px;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] .bw-blog-journey h2{border:0!important;color:#FFFFFF!important;font-size:clamp(27px,4vw,36px)!important;line-height:1.06!important;margin:0 0 8px!important;padding:0!important;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] .bw-blog-journey .bw-blog-journey-intro{color:rgba(255,255,255,.86)!important;font-family:Merriweather,Georgia,serif!important;font-size:15px!important;line-height:1.58!important;margin:0 0 22px!important;}',
      '.bw-blog-journey-grid{display:grid;gap:14px;grid-template-columns:repeat(3,minmax(0,1fr));margin-bottom:22px;}',
      '.bw-blog-related-title{color:#FFE600!important;font-size:13px!important;font-weight:900!important;letter-spacing:1.4px!important;line-height:1!important;margin:0 0 14px!important;text-transform:uppercase;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] .bw-blog-related-title{border:0!important;color:#FFE600!important;font-size:13px!important;line-height:1!important;margin:0 0 14px!important;padding:0!important;}',
      '.bw-blog-related-grid{display:grid;gap:14px;grid-template-columns:repeat(3,minmax(0,1fr));}',
      '.bw-blog-journey-card{background:#FFFFFF;border:0;color:#212121;display:flex;flex-direction:column;min-width:0;overflow:hidden;text-decoration:none;transition:box-shadow .16s ease,transform .16s ease;}',
      '.bw-blog-journey-card:hover{box-shadow:0 14px 28px rgba(0,0,0,.25);transform:translateY(-2px);}',
      '.bw-blog-journey-image{aspect-ratio:16/9;background:#E8EEE6;display:block;overflow:hidden;width:100%;}',
      '.bw-blog-journey-image img{display:block;height:100%!important;object-fit:cover;width:100%!important;}',
      '.bw-blog-journey-card-use-a-tool .bw-blog-journey-image{align-items:center;background:linear-gradient(135deg,#FFFDF1 0%,#E8F5E4 100%);display:flex;justify-content:center;padding:24px;}',
      '.bw-blog-journey-card-use-a-tool .bw-blog-journey-image img{height:82px!important;max-height:70%;max-width:82px;object-fit:contain;width:82px!important;}',
      '.bw-blog-journey-content{display:flex;flex:1;flex-direction:column;padding:14px 15px 16px;}',
      '.bw-blog-journey-label{color:#1B5E20;display:block;font-size:10px;font-weight:900;letter-spacing:1.2px;line-height:1;margin-bottom:9px;text-transform:uppercase;}',
      '.bw-blog-journey-card strong{color:#212121;display:block;font-size:16px;font-weight:900;line-height:1.16;overflow-wrap:break-word;}',
      '[data-bw-tourcta]{display:none!important;}',
      '.bw-blog-back-top{align-items:center;background:#212121;border:2px solid #FFE600;border-radius:999px;bottom:24px;box-shadow:0 12px 28px rgba(0,0,0,.22);color:#FFFFFF;cursor:pointer;display:flex;font-size:22px;font-weight:900;height:44px;justify-content:center;opacity:0;pointer-events:none;position:fixed;right:22px;text-decoration:none;transform:translateY(10px);transition:opacity .18s ease,transform .18s ease,background .18s ease;visibility:hidden;width:44px;z-index:8500;}',
      '.bw-blog-back-top:hover{background:#1B5E20;}',
      '.bw-blog-back-top-visible{opacity:1;pointer-events:auto;transform:translateY(0);visibility:visible;}',
      '[' + NATIVE_END_MARKER + '="1"]{display:none!important;}',
      '@media (max-width:899px){html.bw-blog-mobile-preparing:not(.bw-blog-enhanced-ready):not(.bw-blog-mobile-prep-timeout) [data-hook="post"],html.bw-blog-mobile-preparing:not(.bw-blog-enhanced-ready):not(.bw-blog-mobile-prep-timeout) article{opacity:0!important;pointer-events:none!important;}body.bw-blog-post-enhanced [data-hook="post-page"] *:not(:has(> .bw-blog-mobile-nav)) > [data-hook="post"]{margin-top:270px!important;}body.bw-blog-post-enhanced [data-hook="post-page"] *:has(> .bw-blog-mobile-nav) > [data-hook="post"]{margin-top:0!important;}}',
      '@media (min-width:900px){.bw-blog-mobile-nav,.bw-blog-mobile-guide{display:none!important;}}',
      '@media (max-width:899px){body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] [' + WIDGET_BLOCK_MARKER + '="1"]{margin-bottom:28px!important;}}',
      '@media (max-width:899px){body.bw-blog-post-enhanced [' + POST_TITLE_MARKER + '="1"]{font-size:clamp(32px,8.4vw,35px)!important;line-height:1.06!important;margin-top:18px!important;}body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] p:not(.bw-blog-mobile-guide-title):not(.bw-blog-journey-intro):not(.bw-blog-tool-copy):not([' + EMPTY_PARAGRAPH_MARKER + ']){font-size:17px!important;line-height:1.68!important;margin-bottom:17px!important;}body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] h2{font-size:28px!important;margin-top:34px!important;}body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] h3{font-weight:900!important;}.bw-blog-mobile-nav{background:#FAFAF5;border:0;border-bottom:2px solid #212121;display:block;margin:0 0 28px;padding:24px 0 20px;position:relative;}.bw-blog-mobile-nav:before{background:#1B5E20;content:"";display:block;height:5px;left:0;position:absolute;right:0;top:0;}.bw-blog-mobile-nav:after{background:#212121;content:"";display:block;height:2px;left:0;position:absolute;right:0;top:86px;}.bw-blog-tool-prompt{align-items:start;grid-template-columns:1fr;margin:28px 0;padding:18px;}.bw-blog-tool-button{justify-self:start;}.bw-blog-journey{margin:32px 0 28px;padding:24px 18px;}.bw-blog-journey-grid,.bw-blog-related-grid{grid-template-columns:1fr;}.bw-blog-journey h2{font-size:26px!important;}.bw-blog-back-top{bottom:92px;right:14px;width:42px;height:42px;font-size:21px;}}'
    ].join('\n');
    (document.head || document.documentElement).appendChild(style);
  }

  function markBlogReady() {
    document.documentElement.classList.add('bw-blog-enhanced-ready');
    document.documentElement.classList.remove('bw-blog-mobile-preparing');
    if (document.body) document.body.classList.add('bw-blog-enhanced-ready');
    clearTimeout(readyTimer);
    readyTimer = null;
  }

  function injectStabilityStyle() {
    if (!isPostPage()) return;
    document.documentElement.classList.add('bw-blog-post-head', 'bw-blog-mobile-preparing');
    document.documentElement.classList.remove('bw-blog-enhanced-ready', 'bw-blog-mobile-prep-timeout');
    if (document.body) document.body.classList.remove('bw-blog-enhanced-ready');

    if (!document.getElementById(STABILITY_STYLE_ID)) {
      var style = document.createElement('style');
      style.id = STABILITY_STYLE_ID;
      style.textContent = '@media (max-width:899px){html.bw-blog-mobile-preparing:not(.bw-blog-enhanced-ready):not(.bw-blog-mobile-prep-timeout) [data-hook="post"],html.bw-blog-mobile-preparing:not(.bw-blog-enhanced-ready):not(.bw-blog-mobile-prep-timeout) article{opacity:0!important;pointer-events:none!important;}}';
      (document.head || document.documentElement).appendChild(style);
    }

    clearTimeout(readyTimer);
    readyTimer = setTimeout(function () {
      document.documentElement.classList.add('bw-blog-mobile-prep-timeout');
      markBlogReady();
    }, 2600);
  }

  function loadData() {
    if (dataCache) return Promise.resolve(dataCache);
    if (dataPromise) return dataPromise;
    dataPromise = Promise.all([
      fetch(DATA_URL, { cache: 'no-cache' }).then(function (response) {
        if (!response.ok) throw new Error('blog data unavailable');
        return response.json();
      }),
      fetch(TOOLS_DATA_URL, { cache: 'no-cache' }).then(function (response) {
        if (!response.ok) return { tools: [] };
        return response.json();
      }).catch(function () { return { tools: [] }; })
    ])
      .then(function (payloads) {
        var data = payloads[0] || {};
        data.toolsHub = (payloads[1] && payloads[1].tools) || [];
        dataCache = data;
        return data;
      })
      .catch(function () {
        dataCache = { allPosts: [], tools: [], toolsHub: [], bookingUrl: 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based' };
        return dataCache;
      });
    return dataPromise;
  }

  function currentPost(data) {
    var slug = currentSlug();
    return (data.allPosts || []).filter(function (post) { return post.slug === slug; })[0] || null;
  }

  function relatedPost(data, post) {
    var topic = post && post.topic;
    var posts = data.allPosts || [];
    for (var i = 0; i < posts.length; i++) {
      if (posts[i].slug !== (post && post.slug) && posts[i].topic === topic) return posts[i];
    }
    for (var j = 0; j < posts.length; j++) {
      if (posts[j].slug !== (post && post.slug)) return posts[j];
    }
    return null;
  }

  function relatedPosts(data, post, limit) {
    var posts = data.allPosts || [];
    var current = post && post.slug;
    var topic = post && post.topic;
    var picked = [];
    var seen = {};

    function add(candidate) {
      if (!candidate || !candidate.slug || candidate.slug === current || seen[candidate.slug]) return;
      if (!candidate.url || !candidate.title) return;
      seen[candidate.slug] = true;
      picked.push(candidate);
    }

    posts.forEach(function (candidate) {
      if (topic && candidate.topic === topic) add(candidate);
    });
    posts.forEach(add);
    return picked.slice(0, limit || 6);
  }

  function cloneTool(tool, slug) {
    if (!tool) return null;
    var copy = {};
    Object.keys(tool).forEach(function (key) {
      copy[key] = tool[key];
    });
    if (!copy.slug && slug) copy.slug = slug;
    return copy;
  }

  function relatedTool(data, post) {
    var slug = post && post.relatedToolSlug;
    var match = null;
    if (slug) {
      match = (data.toolsHub || []).filter(function (item) { return item.slug === slug; })[0] ||
        (data.tools || []).filter(function (item) { return item.slug === slug; })[0] ||
        TOOL_FALLBACKS[slug];
    }
    var tool = cloneTool(match || (data.tools || [])[0] || TOOL_FALLBACKS['berlin-first-day-planner'], slug || 'berlin-first-day-planner');
    if (tool && tool.slug && !tool.url) tool.url = 'https://www.berlinwalk.com/tools/' + tool.slug;
    if (tool && !tool.summary && tool.lead) tool.summary = tool.lead;
    if (tool && tool.slug && !tool.image) tool.image = TOOL_ICON_FALLBACKS[tool.slug] || DEFAULT_TOOL_IMAGE;
    return tool;
  }

  function normalizePostSpacing(body) {
    if (!body) return;
    body.querySelectorAll('p').forEach(function (paragraph) {
      if (paragraph.closest('[' + MOBILE_NAV_MARKER + '], [' + MOBILE_MARKER + '], [' + TOOL_MARKER + '], [' + JOURNEY_MARKER + '], [data-bw-leadform], [data-bw-tourcta]')) return;
      var hasMedia = paragraph.querySelector('img,iframe,video,svg,canvas,button,audio');
      var text = String(paragraph.textContent || '').replace(/\u00a0/g, ' ').trim();
      if (!hasMedia && !text) {
        paragraph.setAttribute(EMPTY_PARAGRAPH_MARKER, '1');
        paragraph.setAttribute('aria-hidden', 'true');
      } else {
        paragraph.removeAttribute(EMPTY_PARAGRAPH_MARKER);
        paragraph.removeAttribute('aria-hidden');
      }
    });
    normalizeWidgetFrameSpacing(body);
  }

  function widgetContentChildren(parent, frameBlock) {
    return Array.prototype.filter.call(parent.children || [], function (child) {
      if (child === frameBlock) return true;
      var tag = (child.tagName || '').toUpperCase();
      if (tag === 'SCRIPT' || tag === 'STYLE') return false;
      var hasMedia = child.querySelector && child.querySelector('img,iframe,video,svg,canvas,button,audio');
      var text = String(child.textContent || '').replace(/\u00a0/g, ' ').trim();
      if (!hasMedia && !text) return false;
      return true;
    });
  }

  function findWidgetFrameBlock(frame, body) {
    var block = frame;
    var parent = frame.parentElement;
    var depth = 0;
    while (parent && parent !== body && depth < 5) {
      var tag = (parent.tagName || '').toUpperCase();
      if (tag === 'BODY' || tag === 'MAIN' || tag === 'ARTICLE' || tag === 'SECTION') break;
      var contentChildren = widgetContentChildren(parent, block);
      if (contentChildren.length !== 1 || contentChildren[0] !== block) break;
      block = parent;
      parent = parent.parentElement;
      depth++;
    }
    return block;
  }

  function normalizeWidgetFrameSpacing(body) {
    if (!body) return;
    body.querySelectorAll('[' + WIDGET_BLOCK_MARKER + ']').forEach(function (oldBlock) {
      oldBlock.removeAttribute(WIDGET_BLOCK_MARKER);
    });
    body.querySelectorAll('iframe[src*="fenerszymanski.github.io/berlinwalk-widgets/"]').forEach(function (frame) {
      if (frame.closest('[' + MOBILE_NAV_MARKER + '], [' + MOBILE_MARKER + '], [' + TOOL_MARKER + '], [' + JOURNEY_MARKER + '], [data-bw-leadform], [data-bw-tourcta]')) return;
      findWidgetFrameBlock(frame, body).setAttribute(WIDGET_BLOCK_MARKER, '1');
    });
  }

  function findPostTitle() {
    var headings = document.querySelectorAll('h1');
    for (var i = 0; i < headings.length; i++) {
      var heading = headings[i];
      if (heading.closest('[' + MOBILE_NAV_MARKER + '], [' + MOBILE_MARKER + '], [' + TOOL_MARKER + '], [' + JOURNEY_MARKER + '], [data-bw-leadform], [data-bw-tourcta]')) continue;
      if (!isVisible(heading)) continue;
      if (cleanText(heading.textContent).length > 8) return heading;
    }
    return null;
  }

  function normalizePostTitleTypography() {
    var title = findPostTitle();
    document.querySelectorAll('[' + POST_TITLE_MARKER + ']').forEach(function (oldTitle) {
      if (oldTitle !== title) oldTitle.removeAttribute(POST_TITLE_MARKER);
    });
    if (!title) return;
    title.setAttribute(POST_TITLE_MARKER, '1');
    title.style.setProperty('font-family', 'Montserrat, Arial, sans-serif', 'important');
    title.style.setProperty('display', 'block', 'important');
    title.style.setProperty('width', '100%', 'important');
    title.style.setProperty('max-width', '100%', 'important');
    title.style.setProperty('font-weight', '900', 'important');
    title.style.setProperty('font-variation-settings', '"wght" 900', 'important');
    title.style.setProperty('letter-spacing', '0', 'important');
    title.style.setProperty('line-height', '1.06', 'important');
    title.style.setProperty('color', '#212121', 'important');
    title.style.setProperty('-webkit-text-stroke', '.18px currentColor', 'important');
    title.style.setProperty('text-shadow', '.18px 0 0 currentColor, -.18px 0 0 currentColor', 'important');
    var wrapper = title.parentElement;
    for (var depth = 0; wrapper && depth < 4; depth++) {
      if ((wrapper.tagName || '').toUpperCase() === 'HEADER') break;
      wrapper.style.setProperty('width', '100%', 'important');
      wrapper.style.setProperty('max-width', '100%', 'important');
      if (window.getComputedStyle(wrapper.parentElement || wrapper).display.indexOf('flex') !== -1) {
        wrapper.style.setProperty('flex', '0 1 100%', 'important');
      }
      wrapper = wrapper.parentElement;
    }
    title.querySelectorAll('*').forEach(function (node) {
      node.style.setProperty('color', 'inherit', 'important');
      node.style.setProperty('font-family', 'inherit', 'important');
      node.style.setProperty('font-size', 'inherit', 'important');
      node.style.setProperty('font-style', 'normal', 'important');
      node.style.setProperty('font-weight', '900', 'important');
      node.style.setProperty('font-variation-settings', '"wght" 900', 'important');
      node.style.setProperty('letter-spacing', '0', 'important');
      node.style.setProperty('line-height', 'inherit', 'important');
      node.style.setProperty('-webkit-text-stroke', '.18px currentColor', 'important');
      node.style.setProperty('text-shadow', '.18px 0 0 currentColor, -.18px 0 0 currentColor', 'important');
    });
  }

  function normalizeHeadingTypography(body) {
    if (!body) return;
    body.querySelectorAll('h2, h3').forEach(function (heading) {
      if (heading.closest('[' + MOBILE_NAV_MARKER + '], [' + MOBILE_MARKER + '], [' + TOOL_MARKER + '], [' + JOURNEY_MARKER + '], [data-bw-leadform], [data-bw-tourcta]')) return;
      heading.style.setProperty('font-family', 'Montserrat, Arial, sans-serif', 'important');
      heading.style.setProperty('font-weight', '900', 'important');
      heading.style.setProperty('font-variation-settings', '"wght" 900', 'important');
      heading.style.setProperty('letter-spacing', '0', 'important');
      heading.style.setProperty('color', '#212121', 'important');
      heading.style.setProperty('-webkit-text-stroke', '.12px currentColor', 'important');
      heading.style.setProperty('text-shadow', '.12px 0 0 currentColor', 'important');
      heading.querySelectorAll('*').forEach(function (node) {
        node.style.setProperty('color', 'inherit', 'important');
        node.style.setProperty('font-family', 'inherit', 'important');
        node.style.setProperty('font-size', 'inherit', 'important');
        node.style.setProperty('font-style', 'normal', 'important');
        node.style.setProperty('font-weight', '900', 'important');
        node.style.setProperty('font-variation-settings', '"wght" 900', 'important');
        node.style.setProperty('letter-spacing', '0', 'important');
        node.style.setProperty('line-height', 'inherit', 'important');
        node.style.setProperty('-webkit-text-stroke', '.12px currentColor', 'important');
        node.style.setProperty('text-shadow', '.12px 0 0 currentColor', 'important');
      });
    });
  }

  function markPostBody(body) {
    document.body.classList.add('bw-blog-post-enhanced');
    document.querySelectorAll('[' + POST_BODY_MARKER + ']').forEach(function (oldBody) {
      if (oldBody !== body) oldBody.removeAttribute(POST_BODY_MARKER);
    });
    body.setAttribute(POST_BODY_MARKER, '1');
  }

  function activeCategorySlug(data) {
    var post = currentPost(data || {});
    if (post && post.categorySlug && categorySlugExists(post.categorySlug)) return post.categorySlug;
    var path = location.pathname.toLowerCase();
    if (/(german|language|speak)/.test(path)) return 'german-language';
    if (/(before-after|then-and-now|then-now|rebuilt|changed)/.test(path)) return 'before-after';
    if (/(myth|myths)/.test(path)) return 'berlin-myths';
    if (/(history|wall|cold-war|reichstag|museum|church|death|nikolaiviertel|ampelmann)/.test(path)) return 'berlin-history';
    if (/(route|itinerary|walking-tour|tour-starts|12-stops|hackescher|humboldt|weltzeituhr|berliner-dom)/.test(path)) return 'tour-route';
    return 'tourist-tips';
  }

  function categorySlugExists(slug) {
    return BLOG_CATEGORIES.some(function (category) {
      return category.slug === slug;
    });
  }

  function mobileBlogNavHtml(active) {
    return '<span class="bw-blog-mobile-nav-brand">Berlin Travel &amp; History Notes</span>' +
      '<div class="bw-blog-mobile-nav-divider" aria-hidden="true"></div>' +
      '<a class="bw-blog-mobile-nav-home" href="https://www.berlinwalk.com/blog" target="_top">Blog Home</a>' +
      '<div class="bw-blog-mobile-nav-scroll">' +
      '<span class="bw-blog-mobile-nav-label">Categories</span>' +
      '<ul class="bw-blog-mobile-nav-list">' +
      BLOG_CATEGORIES.map(function (category) {
        var cls = ' class="bw-blog-mobile-nav-item' + (category.slug === active ? ' bw-blog-mobile-nav-active' : '') + '"';
        return '<li><a' + cls + ' href="' + escapeAttr(category.url) + '" target="_top" data-bw-blog-category="' + escapeAttr(category.slug) + '">' + escapeHtml(category.label) + '</a></li>';
      }).join('') +
      '</ul>' +
      '</div>';
  }

  function updateMobileBlogNavActive(nav, active) {
    if (!nav || nav.getAttribute('data-bw-blog-mobile-active') === active) return false;
    nav.querySelectorAll('.bw-blog-mobile-nav-item').forEach(function (link) {
      link.classList.toggle('bw-blog-mobile-nav-active', link.getAttribute('data-bw-blog-category') === active);
    });
    nav.setAttribute('data-bw-blog-mobile-active', active);
    return true;
  }

  function scrollMobileBlogNavToActive(nav, force) {
    if (!nav || (window.innerWidth || document.documentElement.clientWidth) >= MIN_MOBILE_WIDTH) return;
    var list = nav.querySelector('.bw-blog-mobile-nav-list');
    var active = nav.querySelector('.bw-blog-mobile-nav-active');
    if (!list || !active) return;
    var activeSlug = active.getAttribute('data-bw-blog-category') || '';
    if (!force && nav.getAttribute('data-bw-blog-mobile-scroll-active') === activeSlug) return;
    nav.setAttribute('data-bw-blog-mobile-scroll-active', activeSlug);
    setTimeout(function () {
      list.scrollLeft = Math.max(0, active.offsetLeft - 12);
    }, 0);
  }

  function insertMobileBlogNav(body, data) {
    if (!body) return;
    var active = activeCategorySlug(data);
    var nav = document.querySelector('[' + MOBILE_NAV_MARKER + ']');
    var shouldScroll = false;
    if (!nav) {
      nav = document.createElement('nav');
      nav.className = 'bw-blog-mobile-nav';
      nav.setAttribute(MOBILE_NAV_MARKER, '1');
      nav.setAttribute('aria-label', 'Blog navigation');
      nav.innerHTML = mobileBlogNavHtml(active);
      nav.setAttribute('data-bw-blog-mobile-active', active);
      shouldScroll = true;
    } else if (!nav.querySelector('.bw-blog-mobile-nav-item')) {
      nav.innerHTML = mobileBlogNavHtml(active);
      nav.setAttribute('data-bw-blog-mobile-active', active);
      shouldScroll = true;
    } else {
      shouldScroll = updateMobileBlogNavActive(nav, active);
    }
    var article = body.closest('article');
    if (article && article.contains(body) && article.parentNode && article.parentNode !== document.body) {
      if (nav.parentNode !== article.parentNode || nav.nextSibling !== article) article.parentNode.insertBefore(nav, article);
    } else {
      if (body.firstElementChild !== nav) body.insertBefore(nav, body.firstElementChild || null);
    }
    scrollMobileBlogNavToActive(nav, shouldScroll);
  }

  function hasExistingToolReference(body, tool) {
    if (!body || !tool || !tool.url) return false;
    var slug = (tool.url.split('/').filter(Boolean).pop() || '').toLowerCase();
    if (!slug) return false;
    var widgetSlug = '';
    if (tool.widgetUrl) widgetSlug = (tool.widgetUrl.split('/').filter(Boolean).pop() || '').toLowerCase();
    var selector = 'a[href*="/tools/' + escapeSelector(slug) + '"], iframe[src*="/' + escapeSelector(slug) + '"]';
    if (widgetSlug) selector += ', iframe[src*="/' + escapeSelector(widgetSlug) + '/"], a[href*="/' + escapeSelector(widgetSlug) + '/"]';
    var refs = body.querySelectorAll(selector);
    for (var i = 0; i < refs.length; i++) {
      if (!refs[i].closest('[' + TOOL_MARKER + '], [' + JOURNEY_MARKER + ']')) return true;
    }
    return false;
  }

  function hasEmbeddedArticleTool(body, tool) {
    if (!body) return false;
    var frames = body.querySelectorAll('iframe[src*="fenerszymanski.github.io/berlinwalk-widgets/"]');
    for (var i = 0; i < frames.length; i++) {
      var src = frames[i].getAttribute('src') || '';
      if (frames[i].closest('[' + TOOL_MARKER + '], [' + JOURNEY_MARKER + ']')) continue;
      if (/\/(quick-summary|faq)\//.test(src)) continue;
      return true;
    }
    return hasExistingToolReference(body, tool);
  }

  function findToolInsertionPoint(body, items) {
    var start = items && items.length > 1 ? items[1].node : (items && items.length ? items[0].node : null);
    var node = start ? start.nextElementSibling : null;
    while (node) {
      var tag = (node.tagName || '').toUpperCase();
      if (tag === 'H2' || tag === 'H3') break;
      if (tag === 'P' && isVisible(node) && cleanText(node.textContent).length > 40) return { parent: node.parentNode, after: node };
      node = node.nextElementSibling;
    }
    var paragraphs = body.querySelectorAll('p');
    var seen = 0;
    for (var i = 0; i < paragraphs.length; i++) {
      var paragraph = paragraphs[i];
      if (!isVisible(paragraph)) continue;
      if (paragraph.closest('[' + MOBILE_NAV_MARKER + '], [' + MOBILE_MARKER + '], [' + TOOL_MARKER + '], [' + JOURNEY_MARKER + '], [data-bw-leadform], [data-bw-tourcta]')) continue;
      if (cleanText(paragraph.textContent).length < 40) continue;
      seen++;
      if (seen >= 2) return { parent: paragraph.parentNode, after: paragraph };
    }
    return null;
  }

  function toolPromptSettled() {
    // Wait until the page has finished loading and a short buffer has passed, so
    // Wix has had time to inject the article's real tool iframes. Inserting the
    // fallback "Useful now" prompt before those iframes exist and then removing
    // it once they load (hasEmbeddedArticleTool flips to true) is what caused the
    // visible blink right after the first/second paragraph. Almost every post
    // embeds its own tool, so once settled the prompt is correctly suppressed and
    // never paints; genuinely tool-less posts just get it a moment later.
    return document.readyState === 'complete' && (Date.now() - bootAt) >= 1200;
  }

  function insertToolPrompt(body, data, items) {
    if (!toolPromptSettled()) return;
    var old = document.querySelector('[' + TOOL_MARKER + ']');
    if (!body) {
      if (old) old.remove();
      return;
    }
    var post = currentPost(data);
    var tool = relatedTool(data, post);
    if (!tool || !tool.url || hasEmbeddedArticleTool(body, tool)) {
      if (old) old.remove();
      return;
    }
    var promptKey = tool.slug || tool.url;
    if (old && old.getAttribute('data-bw-blog-tool-key') === promptKey) return;
    if (old) old.remove();
    var point = findToolInsertionPoint(body, items);
    if (!point || !point.parent || !point.after) return;

    var prompt = document.createElement('aside');
    prompt.className = 'bw-blog-tool-prompt';
    prompt.setAttribute(TOOL_MARKER, '1');
    prompt.setAttribute('data-bw-blog-tool-key', promptKey);
    prompt.setAttribute('aria-label', 'Useful Berlin tool');
    prompt.innerHTML =
      '<div>' +
        '<span class="bw-blog-tool-kicker">Useful now</span>' +
        '<strong>' + escapeHtml(tool.title) + '</strong>' +
        '<p class="bw-blog-tool-copy">' + escapeHtml(tool.summary || 'Make the practical next step faster.') + '</p>' +
      '</div>' +
      '<a class="bw-blog-tool-button" href="' + escapeAttr(tool.url) + '" target="_top" data-bw-blog-tool-click="' + escapeAttr(tool.title) + '">Open tool</a>';

    prompt.addEventListener('click', function (event) {
      var link = event.target.closest('[data-bw-blog-tool-click]');
      if (!link) return;
      pushEvent('bw_blog_tool_prompt_click', {
        slug: currentSlug(),
        tool: link.getAttribute('data-bw-blog-tool-click'),
        href: link.href
      });
    });

    point.parent.insertBefore(prompt, point.after.nextSibling);
    pushEvent('bw_blog_tool_prompt_view', {
      slug: currentSlug(),
      tool: tool.title
    });
  }

  function insertMobileGuide(body, items) {
    var old = document.querySelector('[' + MOBILE_MARKER + ']');
    if (!body || !items || items.length < 2) {
      if (old) old.remove();
      return;
    }
    var guideKey = items.map(function (item) { return item.id; }).join('|');
    if (old && old.getAttribute('data-bw-blog-mobile-guide-key') === guideKey) return;
    if (old) old.remove();
    var firstHeading = items[0].node;
    var nav = document.createElement('nav');
    nav.className = 'bw-blog-mobile-guide';
    nav.setAttribute(MOBILE_MARKER, '1');
    nav.setAttribute('data-bw-blog-mobile-guide-key', guideKey);
    nav.setAttribute('aria-label', 'In this guide');
    nav.innerHTML =
      '<p class="bw-blog-mobile-guide-title">In this guide</p>' +
      '<ol class="bw-blog-mobile-guide-list">' +
      items.map(function (item) {
        return '<li><a href="#' + escapeAttr(item.id) + '">' + escapeHtml(item.text) + '</a></li>';
      }).join('') +
      '</ol>';
    nav.addEventListener('click', function (event) {
      var link = event.target.closest('a[href^="#"]');
      if (!link) return;
      var target = document.getElementById(link.getAttribute('href').slice(1));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', link.getAttribute('href'));
    });
    firstHeading.parentNode.insertBefore(nav, firstHeading);
  }

  function postIntentText(post) {
    return cleanText([
      post && post.slug,
      post && post.title,
      post && post.categorySlug,
      post && post.category,
      post && post.topic,
      post && post.topicLabel,
      location.pathname
    ].join(' ')).toLowerCase();
  }

  function postIntentClass(post) {
    var text = postIntentText(post);
    if (/(world[- ]?cup|football|fan mile|club|nightlife|techno|bar|beer|festival|christmas market|event|events|concert|party)/.test(text)) {
      return 'event-context';
    }
    if (/(airport|arrival|transport|ticket|toilet|toilets|luggage|locker|budget|cost|weather|rain|heat|free things|safety|scam|pharmacy|sunday|monday|opening|cash|sim card|museum pass|day ticket|public transport|packing|tap water|first day)/.test(text)) {
      return 'planner-first';
    }
    if (post && (post.categorySlug === 'berlin-history' || post.categorySlug === 'tour-route')) {
      return 'direct-booking';
    }
    if (/(wall|cold war|history|reichstag|brandenburg gate|museum island|unter den linden|alexanderplatz|weltzeituhr|world clock|berliner dom|berlin cathedral|bebelplatz|hackescher|nikolaiviertel|checkpoint charlie|topography|potsdamer platz|walking tour|route|itinerary|third reich|gdr|east berlin|west berlin|soviet|prussian)/.test(text)) {
      return 'direct-booking';
    }
    return 'soft-planning';
  }

  function journeyUtmUrl(rawUrl, slug, content, medium) {
    try {
      var url = new URL(rawUrl, window.location.href);
      var incoming = new URL(window.location.href);
      ATTRIBUTION_KEYS.forEach(function (key) {
        if (incoming.searchParams.has(key) && !url.searchParams.has(key)) {
          url.searchParams.set(key, incoming.searchParams.get(key));
        }
      });
      if (!url.searchParams.has('utm_source')) url.searchParams.set('utm_source', 'berlinwalk');
      if (!url.searchParams.has('utm_medium')) url.searchParams.set('utm_medium', medium || 'blog_bridge');
      if (!url.searchParams.has('utm_campaign')) url.searchParams.set('utm_campaign', 'blog_journey_bridge');
      if (!url.searchParams.has('utm_content')) {
        url.searchParams.set('utm_content', slugify((slug || currentSlug() || 'post') + '_' + (content || 'next_step')));
      }
      return url.toString();
    } catch (err) {
      return rawUrl;
    }
  }

  function bookingJourneyCard(bookingUrl, title, context) {
    return {
      label: 'Free walk',
      title: title || 'Walk this context with me in Berlin',
      url: bookingUrl,
      image: TOUR_IMAGE,
      bookLink: true,
      bookContext: context || 'blog_journey_booking',
      ctaKind: 'booking'
    };
  }

  function plannerJourneyCard(post, title, context) {
    var slug = post && post.slug || currentSlug();
    return {
      label: 'Plan it',
      kind: 'tool',
      title: title || 'Build a Berlin Trip Pack',
      url: journeyUtmUrl(TRIP_PLANNER_URL, slug, context || 'trip_planner', 'blog_bridge'),
      image: TOOL_ICON_FALLBACKS['berlin-first-day-planner'] || DEFAULT_TOOL_IMAGE,
      ctaKind: 'trip_planner'
    };
  }

  function toolJourneyCard(tool, post, label) {
    if (!tool || !tool.url || !tool.title) return null;
    return {
      label: label || 'Use a tool',
      kind: 'tool',
      title: tool.title,
      url: journeyUtmUrl(tool.url, post && post.slug, 'tool_' + (tool.slug || slugify(tool.title)), 'blog_tool_bridge'),
      image: tool.image,
      ctaKind: 'tool'
    };
  }

  function relatedJourneyCard(related) {
    if (!related || !related.url || !related.title) return null;
    return {
      label: 'Read next',
      title: related.title,
      url: related.url,
      image: related.thumb || related.image,
      ctaKind: 'related'
    };
  }

  function dedupeJourneyCards(cards, limit) {
    var seen = {};
    var picked = [];
    (cards || []).forEach(function (card) {
      if (!card || !card.url || !card.title || picked.length >= (limit || 3)) return;
      var key = String(card.url).split('?')[0].toLowerCase() + '|' + String(card.title).toLowerCase();
      if (seen[key]) return;
      seen[key] = true;
      picked.push(card);
    });
    return picked;
  }

  function journeyStrategy(post, tool, posts, bookingUrl) {
    var intent = postIntentClass(post);
    var toolCard = toolJourneyCard(tool, post);
    var plannerCard = plannerJourneyCard(post);
    var readCard = relatedJourneyCard(posts && posts[0]);
    var directBookCard = bookingJourneyCard(bookingUrl, 'Walk this context with me in Berlin', 'blog_journey_direct_booking');
    var softBookCard = bookingJourneyCard(bookingUrl, 'Book my 2-hour Berlin orientation walk', 'blog_journey_soft_booking');
    var strategy = {
      intent: intent,
      kicker: 'Next step',
      title: 'Turn this guide into a Berlin plan',
      intro: 'Keep going with the right next step for this topic, without turning every article into a sales pitch.',
      cards: []
    };

    if (intent === 'direct-booking') {
      strategy.title = 'Walk this context in Berlin';
      strategy.intro = 'If this guide made the city clearer, the easiest next step is my ~2h tip-based walk: free reservation, no upfront payment.';
      strategy.cards = dedupeJourneyCards([directBookCard, toolCard, readCard, plannerCard], 3);
      return strategy;
    }

    if (intent === 'planner-first') {
      strategy.title = 'Make the practical part easier';
      strategy.intro = 'For utility topics, start with planning help first. Book the walk later only if it fits the trip you are building.';
      strategy.cards = dedupeJourneyCards([toolCard, plannerCard, readCard, softBookCard], 3);
      return strategy;
    }

    if (intent === 'event-context') {
      strategy.title = 'Plan around this Berlin moment';
      strategy.intro = 'Use this as context for your trip, then choose whether a walk, a tool, or another guide is the useful next move.';
      strategy.cards = dedupeJourneyCards([plannerCard, toolCard, softBookCard, readCard], 3);
      return strategy;
    }

    strategy.title = 'Turn this into a Berlin day';
    strategy.intro = 'Build a route first, then keep reading or book the walk if you want the city context in person.';
    strategy.cards = dedupeJourneyCards([plannerCard, toolCard, readCard, softBookCard], 3);
    return strategy;
  }

  function findJourneyInsertionPoint(body) {
    var candidates = body.querySelectorAll('p, li, blockquote');
    for (var i = candidates.length - 1; i >= 0; i--) {
      var el = candidates[i];
      if (!isVisible(el)) continue;
      if (el.closest('[' + MOBILE_NAV_MARKER + '], [' + MOBILE_MARKER + '], [' + TOOL_MARKER + '], [' + JOURNEY_MARKER + '], [data-bw-leadform], [data-bw-tourcta]')) continue;
      if (cleanText(el.textContent).length < 24) continue;
      return { parent: el.parentNode, after: el };
    }
    return { parent: body, after: body.lastElementChild };
  }

  function cardImage(card) {
    return card.image || card.thumb || (card.kind === 'tool' ? DEFAULT_TOOL_IMAGE : TOUR_IMAGE);
  }

  function renderJourneyCard(card) {
    var image = cardImage(card);
    var key = slugify(card.label || card.title);
    var bookAttrs = card.bookLink ? ' data-book-link="1" data-bw-book-context="' + escapeAttr(card.bookContext || key) + '"' : '';
    var ctaKind = card.ctaKind ? ' data-bw-journey-cta-kind="' + escapeAttr(card.ctaKind) + '"' : '';
    return '<a class="bw-blog-journey-card bw-blog-journey-card-' + escapeAttr(key) + '" href="' + escapeAttr(card.url) + '" target="_top" data-bw-blog-journey-click="' + escapeAttr(card.label) + '"' + ctaKind + bookAttrs + '>' +
      '<span class="bw-blog-journey-image" aria-hidden="true"><img src="' + escapeAttr(image) + '" alt="" loading="lazy"></span>' +
      '<span class="bw-blog-journey-content">' +
        '<span class="bw-blog-journey-label">' + escapeHtml(card.label) + '</span>' +
        '<strong>' + escapeHtml(card.title) + '</strong>' +
      '</span>' +
    '</a>';
  }

  function insertJourney(body, data) {
    if (!body) return;
    var post = currentPost(data);
    var posts = relatedPosts(data, post, 7);
    var tool = relatedTool(data, post);
    var bookingUrl = data.bookingUrl || 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
    var strategy = journeyStrategy(post, tool, posts, bookingUrl);
    var cards = strategy.cards || [];
    if (!cards.length) return;
    var journeyKey = [
      post && post.slug,
      strategy.intent,
      tool && (tool.slug || tool.url),
      cards.map(function (card) { return (card.ctaKind || card.label) + ':' + card.title; }).join(','),
      posts.map(function (related) { return related.slug || related.url; }).join(',')
    ].join('|');
    var old = document.querySelector('[' + JOURNEY_MARKER + ']');
    if (old && old.getAttribute('data-bw-blog-journey-key') === journeyKey) return;
    if (old) old.remove();

    var section = document.createElement('section');
    section.className = 'bw-blog-journey';
    section.setAttribute(JOURNEY_MARKER, '1');
    section.setAttribute('data-bw-blog-journey-key', journeyKey);
    section.setAttribute('data-bw-blog-journey-intent', strategy.intent);
    section.setAttribute('aria-label', 'Next steps from this guide');
    section.innerHTML =
      '<span class="bw-blog-journey-kicker">' + escapeHtml(strategy.kicker || 'Next step') + '</span>' +
      '<h2>' + escapeHtml(strategy.title) + '</h2>' +
      '<p class="bw-blog-journey-intro">' + escapeHtml(strategy.intro) + '</p>' +
      '<div class="bw-blog-journey-grid">' +
      cards.slice(0, 3).map(renderJourneyCard).join('') +
      '</div>' +
      (posts.length ? '<h3 class="bw-blog-related-title">Related guides</h3>' +
      '<div class="bw-blog-related-grid">' +
      posts.slice(1, 7).map(function (related) {
        return renderJourneyCard({
          label: related.topicLabel || related.category || 'Guide',
          title: related.title,
          url: related.url,
          image: related.thumb || related.image
        });
      }).join('') +
      '</div>' : '');

    section.addEventListener('click', function (event) {
      var link = event.target.closest('[data-bw-blog-journey-click]');
      if (!link) return;
      var payload = {
        label: link.getAttribute('data-bw-blog-journey-click'),
        slug: currentSlug(),
        href: link.href,
        intent: section.getAttribute('data-bw-blog-journey-intent') || '',
        cta_kind: link.getAttribute('data-bw-journey-cta-kind') || '',
        book_context: link.getAttribute('data-bw-book-context') || ''
      };
      pushEvent('bw_blog_journey_click', payload);
      if (link.hasAttribute('data-book-link')) pushEvent('bw_blog_journey_booking_click', payload);
    });

    var point = findJourneyInsertionPoint(body);
    if (point.before) point.parent.insertBefore(section, point.before);
    else if (point.after && point.after.parentNode === point.parent) point.parent.insertBefore(section, point.after.nextSibling);
    else point.parent.appendChild(section);
    pushEvent('bw_blog_journey_view', {
      slug: currentSlug(),
      intent: strategy.intent,
      card_count: cards.length
    });
  }

  function hideNativeEndMatter() {
    var labels = ['Related Posts', 'Comments'];
    var candidates = document.querySelectorAll('h1,h2,h3,h4,[role="heading"],p,span,div');
    var postBody = document.querySelector('[' + POST_BODY_MARKER + '="1"]');

    function isUnsafeEndMatterContainer(el) {
      if (!el || el === document.body || el === document.documentElement) return true;
      var tag = (el.tagName || '').toUpperCase();
      if (tag === 'MAIN' || tag === 'ARTICLE') return true;
      if (el.hasAttribute(POST_BODY_MARKER) || el.hasAttribute(JOURNEY_MARKER)) return true;
      if (postBody && el.contains(postBody)) return true;
      if (el.querySelector && el.querySelector('[' + POST_BODY_MARKER + '], [' + JOURNEY_MARKER + ']')) return true;
      return false;
    }

    function chooseContainer(el, label) {
      var node = el;
      for (var depth = 0; depth < 8 && node.parentElement && node.parentElement !== document.body; depth++) {
        var parent = node.parentElement;
        if (parent.closest('[' + JOURNEY_MARKER + '], [' + MOBILE_NAV_MARKER + '], [' + MOBILE_MARKER + '], [' + TOOL_MARKER + ']')) break;
        if (isUnsafeEndMatterContainer(parent)) break;
        var text = cleanText(parent.textContent);
        var hasRelatedShape = label === 'Related Posts' && text.indexOf('Related Posts') !== -1 && parent.querySelectorAll('a,img').length >= 2 && text.length < 1200;
        var hasCommentsShape = label === 'Comments' && (text.indexOf('Comments') !== -1 || text.indexOf("Commenting on this post") !== -1) && text.length < 700;
        if (hasRelatedShape || hasCommentsShape) return parent;
      }
      return node;
    }

    for (var i = 0; i < candidates.length; i++) {
      var text = cleanText(candidates[i].textContent);
      var isCommentUnavailable = text.indexOf("Commenting on this post") !== -1 && text.length < 220;
      if (labels.indexOf(text) === -1 && !isCommentUnavailable) continue;
      if (candidates[i].closest('[' + JOURNEY_MARKER + '], [' + MOBILE_NAV_MARKER + '], [' + MOBILE_MARKER + '], [' + TOOL_MARKER + ']')) continue;
      var label = text.indexOf('Related Posts') !== -1 ? 'Related Posts' : 'Comments';
      var container = chooseContainer(candidates[i], label);
      if (container && !isUnsafeEndMatterContainer(container)) {
        container.setAttribute(NATIVE_END_MARKER, '1');
        container.setAttribute('aria-hidden', 'true');
      }
    }
  }

  function currentConsentPolicy() {
    try {
      var manager = window.consentPolicyManager;
      var current = manager && typeof manager.getCurrentConsentPolicy === 'function'
        ? manager.getCurrentConsentPolicy()
        : null;
      return current && (current.policy || current) || {};
    } catch (err) {
      return {};
    }
  }

  function analyticsConsent() {
    return currentConsentPolicy().analytics === true;
  }

  function pushEvent(name, params) {
    if (!analyticsConsent()) return false;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: name }, params || {}));
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
    return true;
  }

  function isBookEntryHref(href) {
    try {
      var url = new URL(href, window.location.href);
      var path = url.pathname.toLowerCase();
      return path === '/book' || path.indexOf('/book-berlin-walking-tour') === 0;
    } catch (err) {
      return false;
    }
  }

  function applyBookAttribution(url, context) {
    var incoming = new URL(window.location.href);
    ATTRIBUTION_KEYS.forEach(function (key) {
      if (incoming.searchParams.has(key)) url.searchParams.set(key, incoming.searchParams.get(key));
    });
    if (!url.searchParams.has('utm_source')) url.searchParams.set('utm_source', 'berlinwalk');
    if (!url.searchParams.has('utm_medium')) url.searchParams.set('utm_medium', 'blog_bridge');
    if (!url.searchParams.has('utm_campaign')) url.searchParams.set('utm_campaign', 'utility_blog_booking_bridge');
    if (!url.searchParams.has('utm_content')) url.searchParams.set('utm_content', currentSlug() + '_' + context);
    return url;
  }

  function trackBookLinkClick(link, context) {
    context = link.getAttribute('data-bw-book-context') || context || 'blog_book_link';
    var currentUrl = new URL(window.location.href);
    var params = currentUrl.searchParams;
    var trackingBody = {
      eventName: 'bw_booking_pick_date_click',
      consentGranted: true,
      analyticsConsent: true,
      consent: { analytics: true },
      pagePath: window.location.pathname,
      landingPage: window.location.href,
      referrer: document.referrer || '',
      utmSource: params.get('utm_source') || '',
      utmMedium: params.get('utm_medium') || '',
      utmCampaign: params.get('utm_campaign') || '',
      utmContent: params.get('utm_content') || '',
      utmTerm: params.get('utm_term') || '',
      fbclid: '',
      isPaid: Boolean(params.get('utm_source')),
      screenWidth: String(window.screen && window.screen.width || ''),
      viewportWidth: String(window.innerWidth || document.documentElement.clientWidth || ''),
      payload: {
        link_kind: 'blog_book_link',
        cta_name: context
      }
    };
    if (!pushEvent('bw_book_link_click', {
      cta_name: context,
      page_path: window.location.pathname
    })) return;
    try {
      window.fetch(TRACK_ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        keepalive: true,
        body: JSON.stringify(trackingBody)
      }).catch(function () {});
    } catch (err) {}
  }

  function decorateBlogBookLinks() {
    if (!isPostPage()) return;
    document.querySelectorAll('a[href]').forEach(function (link) {
      var rawHref = link.getAttribute('href') || '';
      if (!isBookEntryHref(rawHref)) return;
      var context = link.getAttribute('data-bw-book-context') || (link.classList.contains('bw-btn') ? 'mobile_sticky_book' : 'blog_book_link');
      link.setAttribute('data-book-link', '1');
      link.setAttribute('data-bw-book-context', context);
      link.href = applyBookAttribution(new URL(BOOKING_URL, window.location.href), context).toString();
      if (link.getAttribute('data-bw-book-click-bound') === '1') return;
      link.setAttribute('data-bw-book-click-bound', '1');
      link.addEventListener('click', function () {
        trackBookLinkClick(link, context);
      });
    });
  }

  function insertBackToTop() {
    var button = document.querySelector('[' + BACK_TOP_MARKER + ']');
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'bw-blog-back-top';
      button.setAttribute(BACK_TOP_MARKER, '1');
      button.setAttribute('aria-label', 'Back to top');
      button.innerHTML = '&uarr;';
      button.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        pushEvent('bw_blog_back_top_click', { slug: currentSlug() });
      });
      document.body.appendChild(button);
    }
    if (backTopScrollHandler) window.removeEventListener('scroll', backTopScrollHandler);
    backTopScrollHandler = function () {
      button.classList.toggle('bw-blog-back-top-visible', window.scrollY > 640);
    };
    window.addEventListener('scroll', backTopScrollHandler, { passive: true });
    backTopScrollHandler();
  }

  function render() {
    if (!isPostPage()) {
      removeInjected();
      return;
    }
    injectStyle();
    var body = findPostBody();
    if (!body) return;
    markPostBody(body);
    normalizePostTitleTypography();
    normalizePostSpacing(body);
    normalizeHeadingTypography(body);
    insertBackToTop();
    var items = collectHeadings(body);
    insertMobileBlogNav(body, dataCache);
    insertMobileGuide(body, items);
    markBlogReady();
    decorateBlogBookLinks();
    loadData().then(function (data) {
      insertMobileBlogNav(body, data);
      insertToolPrompt(body, data, items);
      insertJourney(body, data);
      hideNativeEndMatter();
      decorateBlogBookLinks();
    });
  }

  function removeInjected() {
    var mobileNav = document.querySelector('[' + MOBILE_NAV_MARKER + ']');
    var mobile = document.querySelector('[' + MOBILE_MARKER + ']');
    var tool = document.querySelector('[' + TOOL_MARKER + ']');
    var journey = document.querySelector('[' + JOURNEY_MARKER + ']');
    var backTop = document.querySelector('[' + BACK_TOP_MARKER + ']');
    if (mobileNav) mobileNav.remove();
    if (mobile) mobile.remove();
    if (tool) tool.remove();
    if (journey) journey.remove();
    if (backTop) backTop.remove();
    if (backTopScrollHandler) {
      window.removeEventListener('scroll', backTopScrollHandler);
      backTopScrollHandler = null;
    }
    clearTimeout(readyTimer);
    readyTimer = null;
    document.documentElement.classList.remove('bw-blog-mobile-preparing', 'bw-blog-enhanced-ready', 'bw-blog-mobile-prep-timeout');
    document.body.classList.remove('bw-blog-post-enhanced');
    document.body.classList.remove('bw-blog-enhanced-ready');
    document.querySelectorAll('[' + POST_BODY_MARKER + ']').forEach(function (oldBody) {
      oldBody.removeAttribute(POST_BODY_MARKER);
    });
    document.querySelectorAll('[' + POST_TITLE_MARKER + ']').forEach(function (oldTitle) {
      oldTitle.removeAttribute(POST_TITLE_MARKER);
    });
    document.querySelectorAll('[' + NATIVE_END_MARKER + ']').forEach(function (el) {
      el.removeAttribute(NATIVE_END_MARKER);
      el.removeAttribute('aria-hidden');
    });
  }

  function scheduleRender() {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(render, 80);
  }

  function boot() {
    bootAt = Date.now();
    if (isPostPage()) {
      injectStabilityStyle();
      injectStyle();
    }
    [0, 80, 220, 520, 1100, 2400, 4200, 7000].forEach(function (delay) {
      setTimeout(render, delay);
    });
    if (observer) observer.disconnect();
    observer = new MutationObserver(function () {
      if (!isPostPage()) return;
      var body = findPostBody();
      normalizePostTitleTypography();
      if (body) normalizePostSpacing(body);
      if (body) normalizeHeadingTypography(body);
      hideNativeEndMatter();
      decorateBlogBookLinks();
      // Gap-free top-nav restore: Wix/React repeatedly wipes nodes it does not
      // own while the post page hydrates, including our top mobile nav. Restoring
      // it via scheduleRender() (an 80ms macrotask) let at least one paint happen
      // with the nav gone, which read as a "blink" on mobile and bounced the post
      // body by the 270px reserve margin. Re-insert it synchronously here instead:
      // the observer callback is a microtask that runs before the next paint, so
      // the removed frame is never shown.
      if (body && !document.querySelector('[' + MOBILE_NAV_MARKER + ']')) {
        insertMobileBlogNav(body, dataCache);
      }
      var needsMobileGuide = body && collectHeadings(body).length >= 2;
      if (!document.querySelector('[' + JOURNEY_MARKER + ']') || (needsMobileGuide && !document.querySelector('[' + MOBILE_MARKER + ']'))) {
        scheduleRender();
      }
    });
    if (document.body) observer.observe(document.body, { childList: true, subtree: true });
  }

  if (isPostPage()) {
    injectStabilityStyle();
    injectStyle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  setInterval(function () {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      removeInjected();
      boot();
    }
  }, 300);
})();
