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
  var SHARE_MARKER = 'data-bw-blog-share-bar';
  var MOBILE_NAV_MARKER = 'data-bw-blog-mobile-nav';
  var MOBILE_MARKER = 'data-bw-blog-mobile-guide';
  var TOOL_MARKER = 'data-bw-blog-tool-prompt';
  var JOURNEY_MARKER = 'data-bw-blog-journey';
  var JOURNEY_LAYOUT_VERSION = 'blog-journey-action-cards-20260709a';
  var SHARE_LAYOUT_VERSION = 'blog-top-share-20260709a';
  var BACK_TOP_MARKER = 'data-bw-blog-back-top';
  var EMPTY_PARAGRAPH_MARKER = 'data-bw-empty-paragraph';
  var WIDGET_BLOCK_MARKER = 'data-bw-blog-widget-block';
  var NATIVE_END_MARKER = 'data-bw-native-blog-end-hidden';
  var MIN_MOBILE_WIDTH = 900;
  var TOUR_IMAGE = 'https://static.wixstatic.com/media/5a08a3_ac78d5df37b2486ab6662cf3872ea9a6~mv2.jpg/v1/fill/w_700,h_420,al_c,q_86,enc_avif,quality_auto/file.jpg';
  var TOOL_ICON_BASE_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/tools-home/icons/';
  var DEFAULT_TOOL_IMAGE = TOOL_ICON_BASE_URL + 'generic-tool.svg';
  var BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
  var BOOKING_DEST_SERVICE = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
  var BOOKING_DEST_LANDING = 'https://www.berlinwalk.com/free-berlin-walking-tour';
  var BOOKING_EXPERIMENT_VARIANT = 'service';
  var BOOKING_NEXT_ACTION_PATCH_URL = 'https://cdn.jsdelivr.net/gh/fenerszymanski/berlinwalk-widgets@d0ef0f3/booking-calendar/book-now-intro-patch.js';
  var TRIP_PLANNER_URL = 'https://www.berlinwalk.com/berlin-trip-planner';
  var TRACK_ENDPOINT = 'https://berlinwalk-content-app.vercel.app/api/pf-event';
  var ATTRIBUTION_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id', 'fbclid', 'fbc', 'fbp'];
  var NEXT_TOUR_SLOT_URL = resolveAdjacentScriptUrl('next-tour-slot.js');
  var dataCache = null;
  var dataPromise = null;
  var renderTimer = null;
  var observer = null;
  var lastPath = location.pathname;
  var backTopScrollHandler = null;
  var bootAt = Date.now();
  var readyTimer = null;
  var nextTourSlotRequested = false;

  installDelayedConsentGuard();
  loadBookingNextActionPatch();
  installConsentGatedBookingAnalytics();
  installConsentSettingsUi();

  function resolveAdjacentScriptUrl(fileName) {
    try {
      if (document.currentScript && document.currentScript.src) {
        return new URL(fileName, document.currentScript.src).toString();
      }
    } catch (err) {}
    return 'https://fenerszymanski.github.io/berlinwalk-widgets/js/' + fileName;
  }

  function ensureNextTourSlotHelper() {
    if (!isPostPage() && !isToolPage()) return;
    if (typeof window.bwNextTourSlot === 'function') return;
    if (nextTourSlotRequested) return;
    nextTourSlotRequested = true;
    var script = document.createElement('script');
    script.src = NEXT_TOUR_SLOT_URL;
    script.async = true;
    script.onload = scheduleRender;
    script.onerror = function () {};
    document.head.appendChild(script);
  }

  function getNextTourSlot() {
    try {
      if (typeof window.bwNextTourSlot === 'function') return window.bwNextTourSlot();
    } catch (err) {}
    return null;
  }

  function getNextTourSlots(count) {
    try {
      if (typeof window.bwNextTourSlots === 'function') return window.bwNextTourSlots({ count: count || 2 }) || [];
    } catch (err) {}
    var slot = getNextTourSlot();
    return slot ? [slot] : [];
  }

  function trimRelativeLabel(label) {
    return String(label || '').replace(/\s*\([^)]+\)/g, '').trim();
  }

  function fullStartLabel(start) {
    if (!start) return '';
    if (start.relativeLabel) {
      var relative = trimRelativeLabel(start.relativeLabel);
      if (relative) return relative;
    }
    if (start.weekdayLabel) return start.weekdayLabel;
    return start.weekdayShort || '';
  }

  function compactStartLabel(start) {
    if (!start) return '';
    if (start.compactRelativeLabel) return start.compactRelativeLabel;
    var relative = trimRelativeLabel(start.relativeLabel);
    if (relative === 'Today' || relative === 'Tomorrow') return relative;
    return start.weekdayShort || relative || '';
  }

  function startEntriesLabel(starts, compact) {
    if (!starts || !starts.length) return '';
    var labelFor = compact ? compactStartLabel : fullStartLabel;
    if (starts.length === 1) {
      return labelFor(starts[0]) + ' ' + starts[0].startLabel;
    }
    if (starts[0].dateKey === starts[1].dateKey) {
      return labelFor(starts[0]) + ' ' + starts[0].startLabel + ' + ' + starts[1].startLabel;
    }
    return labelFor(starts[0]) + ' ' + starts[0].startLabel + ' + ' + labelFor(starts[1]) + ' ' + starts[1].startLabel;
  }

  function getNextTourStarts(count) {
    try {
      if (typeof window.bwNextTourStarts === 'function') return window.bwNextTourStarts({ count: count || 2 }) || [];
    } catch (err) {}
    var slot = getNextTourSlot();
    if (!slot || !slot.startLabels || !slot.startLabels.length) return [];
    return slot.startLabels.slice(0, count || 2).map(function (label, index) {
      return {
        dateKey: slot.dateKey,
        weekdayShort: slot.weekdayShort,
        weekdayLabel: slot.weekdayLabel,
        relativeLabel: slot.relativeLabel,
        compactRelativeLabel: index === 0 ? trimRelativeLabel(slot.relativeLabel) || slot.weekdayShort : '',
        startLabel: label,
      };
    });
  }

  function getNextTourStartsLabel(count, compact) {
    return startEntriesLabel(getNextTourStarts(count), compact !== false);
  }

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
        var target = root === document ? document.head : (root && root.host ? root : null);
        if (!target) return;
        if (target.querySelector && target.querySelector('#' + STYLE_MARKER)) return;
        var style = document.createElement('style');
        style.id = STYLE_MARKER;
        style.textContent = [
          HIDE_SELECTORS + '{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}',
          '.bw-privacy-settings-link{background:transparent;border:0;color:inherit;cursor:pointer;font:inherit;font-weight:700;padding:0;text-decoration:none}',
          '.bw-privacy-settings-link:hover,.bw-privacy-settings-link:focus-visible{color:#fff;outline:0;text-decoration:none}',
          '.bw-privacy-settings-link:focus-visible{box-shadow:0 2px 0 #FFE600}',
          '.bw-consent-preferences{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:rgba(16,36,20,.62);padding:18px}',
          '.bw-consent-preferences__panel{width:min(560px,100%);max-height:calc(100vh - 36px);overflow:auto;border-radius:8px;background:#FAFAF5;color:#102414;box-shadow:0 22px 70px rgba(0,0,0,.35);font-family:Montserrat,Arial,sans-serif}',
          '.bw-consent-preferences__head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;padding:22px 24px 12px}',
          '.bw-consent-preferences__head h2{font-size:22px;line-height:1.2;margin:0 0 7px;font-weight:800}',
          '.bw-consent-preferences__head p{font-size:14px;line-height:1.55;margin:0;color:#31553a}',
          '.bw-consent-preferences__close{border:0;background:#102414;color:#FAFAF5;border-radius:999px;cursor:pointer;font-size:18px;font-weight:800;height:32px;line-height:1;width:32px}',
          '.bw-consent-preferences__body{display:grid;gap:10px;padding:10px 24px 18px}',
          '.bw-consent-preferences__row{align-items:center;border:1px solid rgba(27,94,32,.18);border-radius:8px;display:grid;gap:16px;grid-template-columns:1fr auto;padding:14px 15px}',
          '.bw-consent-preferences__row strong{display:block;font-size:14px;font-weight:800;margin-bottom:3px}',
          '.bw-consent-preferences__row span span{color:#48664f;display:block;font-size:12.5px;line-height:1.45}',
          '.bw-consent-preferences__row input{accent-color:#1B5E20;height:22px;width:22px}',
          '.bw-consent-preferences__row input:disabled{cursor:not-allowed;opacity:.65}',
          '.bw-consent-preferences__actions{display:flex;flex-wrap:wrap;gap:10px;justify-content:flex-end;padding:0 24px 24px}',
          '.bw-consent-preferences__actions button{border-radius:6px;cursor:pointer;font:inherit;font-size:13px;font-weight:800;padding:10px 14px}',
          '.bw-consent-preferences__secondary{background:transparent;border:1px solid rgba(27,94,32,.32);color:#1B5E20}',
          '.bw-consent-preferences__primary{background:#FFE600;border:1px solid #FFE600;color:#102414}'
        ].join('');
        target.appendChild(style);
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

    function hasVisibleConsentLayer() {
      try {
        var text = document.body ? document.body.textContent || '' : '';
        var hasSettingsText = text.indexOf('Categories') !== -1 && text.indexOf('Save Settings') !== -1;
        var dialogs = document.querySelectorAll('[role="dialog"],dialog');
        for (var i = 0; i < dialogs.length; i += 1) {
          var rect = dialogs[i].getBoundingClientRect();
          var style = window.getComputedStyle(dialogs[i]);
          if (rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden') {
            return true;
          }
        }
        return hasSettingsText;
      } catch (err) {
        return false;
      }
    }

    function getCurrentConsentPolicy() {
      try {
        var current = window.consentPolicyManager && typeof window.consentPolicyManager.getCurrentConsentPolicy === 'function'
          ? window.consentPolicyManager.getCurrentConsentPolicy()
          : null;
        var policy = current && current.policy ? current.policy : {};
        return {
          functional: policy.functional !== false,
          analytics: policy.analytics === true,
          advertising: policy.advertising === true,
          dataToThirdParty: policy.dataToThirdParty === true
        };
      } catch (err) {
        return {
          functional: false,
          analytics: false,
          advertising: false,
          dataToThirdParty: false
        };
      }
    }

    function clearTrackingState(next) {
      try {
        if (!next.analytics) {
          ['bwPaidTracking.v1', 'bwVisitorId.v1', 'bwSessionId.v1', 'bwTripPlannerVisitorId.v1', 'bwTripPlannerSessionId.v1'].forEach(function (key) {
            try { window.localStorage.removeItem(key); } catch (err) {}
            try { window.sessionStorage.removeItem(key); } catch (err) {}
          });
        }
        if (!next.advertising) {
          ['_fbp', '_fbc'].forEach(function (name) {
            document.cookie = name + '=; Max-Age=0; path=/';
            document.cookie = name + '=; Max-Age=0; path=/; domain=.berlinwalk.com';
          });
        }
      } catch (err) {}
    }

    function setConsentPolicy(next) {
      var policy = {
        essential: true,
        functional: !!next.functional,
        analytics: !!next.analytics,
        advertising: !!next.advertising,
        dataToThirdParty: !!next.advertising
      };
      try {
        if (window.consentPolicyManager && typeof window.consentPolicyManager.setConsentPolicy === 'function') {
          window.consentPolicyManager.setConsentPolicy(policy);
        }
      } catch (err) {}
      try {
        if (typeof window.setConsentPolicy === 'function') window.setConsentPolicy(policy);
      } catch (err) {}
      clearTrackingState(policy);
      try {
        window.dispatchEvent(new CustomEvent('bwConsentPolicyChanged', { detail: policy }));
      } catch (err) {}
    }

    function closeConsentPreferencesFallback() {
      try {
        var existing = document.getElementById('bw-consent-preferences');
        if (existing) existing.remove();
      } catch (err) {}
    }

    function consentRow(key, title, body, checked, disabled) {
      return [
        '<label class="bw-consent-preferences__row">',
        '<span><strong>' + title + '</strong><span>' + body + '</span></span>',
        '<input type="checkbox" name="' + key + '"' + (checked ? ' checked' : '') + (disabled ? ' disabled' : '') + '>',
        '</label>'
      ].join('');
    }

    function showConsentPreferencesFallback() {
      try {
        closeConsentPreferencesFallback();
        var state = getCurrentConsentPolicy();
        var modal = document.createElement('div');
        modal.id = 'bw-consent-preferences';
        modal.className = 'bw-consent-preferences';
        modal.innerHTML = [
          '<div class="bw-consent-preferences__panel" role="dialog" aria-modal="true" aria-labelledby="bw-consent-preferences-title">',
          '<div class="bw-consent-preferences__head">',
          '<div><h2 id="bw-consent-preferences-title">Privacy Settings</h2>',
          '<p>Change optional cookies and tracking for this browser. Essential items stay on so the site works.</p></div>',
          '<button class="bw-consent-preferences__close" type="button" data-bw-consent-close aria-label="Close">x</button>',
          '</div>',
          '<div class="bw-consent-preferences__body">',
          consentRow('essential', 'Essential', 'Required for the basic site and booking flow.', true, true),
          consentRow('functional', 'Functional', 'Remembers choices that improve the way the site behaves.', state.functional, false),
          consentRow('analytics', 'Analytics', 'Helps measure which pages and booking steps work.', state.analytics, false),
          consentRow('advertising', 'Marketing', 'Allows advertising measurement and Meta or Google ad signals.', state.advertising, false),
          '</div>',
          '<div class="bw-consent-preferences__actions">',
          '<button class="bw-consent-preferences__secondary" type="button" data-bw-consent-deny>Deny optional</button>',
          '<button class="bw-consent-preferences__secondary" type="button" data-bw-consent-accept>Accept all</button>',
          '<button class="bw-consent-preferences__primary" type="button" data-bw-consent-save>Save settings</button>',
          '</div>',
          '</div>'
        ].join('');
        document.body.appendChild(modal);

        function readModalPolicy() {
          return {
            functional: !!modal.querySelector('input[name="functional"]').checked,
            analytics: !!modal.querySelector('input[name="analytics"]').checked,
            advertising: !!modal.querySelector('input[name="advertising"]').checked
          };
        }

        function saveAndClose(policy) {
          setConsentPolicy(policy);
          closeConsentPreferencesFallback();
        }

        modal.addEventListener('click', function (event) {
          if (event.target === modal || event.target.hasAttribute('data-bw-consent-close')) closeConsentPreferencesFallback();
          if (event.target.hasAttribute('data-bw-consent-deny')) saveAndClose({ functional: false, analytics: false, advertising: false });
          if (event.target.hasAttribute('data-bw-consent-accept')) saveAndClose({ functional: true, analytics: true, advertising: true });
          if (event.target.hasAttribute('data-bw-consent-save')) saveAndClose(readModalPolicy());
        });
        var closeButton = modal.querySelector('[data-bw-consent-close]');
        if (closeButton) closeButton.focus();
      } catch (err) {}
    }

    function tryNativeConsentSettings() {
      try {
        if (window.UC_UI && typeof window.UC_UI.showSecondLayer === 'function') {
          window.UC_UI.showSecondLayer();
          return true;
        }
        if (window.__ucCmp && typeof window.__ucCmp.showSecondLayer === 'function') {
          window.__ucCmp.showSecondLayer();
          return true;
        }
        if (window.UC_UI && typeof window.UC_UI.showFirstLayer === 'function') {
          window.UC_UI.showFirstLayer();
          return true;
        }
        if (window.__ucCmp && typeof window.__ucCmp.showFirstLayer === 'function') {
          window.__ucCmp.showFirstLayer();
          return true;
        }
      } catch (err) {}
      return false;
    }

    function openConsentSettings(event) {
      if (event) event.preventDefault();
      var attemptedNative = tryNativeConsentSettings();
      if (attemptedNative) {
        window.setTimeout(function () {
          if (!hasVisibleConsentLayer()) showConsentPreferencesFallback();
        }, 900);
        return;
      }
      showConsentPreferencesFallback();
    }

    function cleanupMisplacedStyles() {
      try {
        var uiRoot = document.getElementById('usercentrics-cmp-ui');
        if (!uiRoot) return;
        Array.prototype.forEach.call(uiRoot.children, function (el) {
          if (el.id === STYLE_MARKER) el.remove();
        });
      } catch (err) {
        try {
          Array.prototype.forEach.call(document.querySelectorAll('#usercentrics-cmp-ui > #' + STYLE_MARKER), function (el) {
            el.remove();
          });
        } catch (innerErr) {}
      }
    }

    function dispatchOpenConsentSettings(event) {
      if (event) {
        event.preventDefault();
        if (event.stopPropagation) event.stopPropagation();
      }
      openConsentSettings(event);
    }

    function exposeConsentSettingsOpener() {
      window.BWOpenConsentSettings = dispatchOpenConsentSettings;
      try {
        document.addEventListener('bwOpenConsentSettings', dispatchOpenConsentSettings);
      } catch (err) {}
    }

    function ensureFooterHandlers() {
      try {
        document.querySelectorAll('[' + LINK_MARKER + ']').forEach(function (button) {
          if (button.getAttribute('data-bw-privacy-bound') === 'true') return;
          button.setAttribute('data-bw-privacy-bound', 'true');
          button.addEventListener('click', dispatchOpenConsentSettings);
        });
      } catch (err) {}
    }

    function addFooterLink() {
      try {
        if (!document.querySelector('[' + LINK_MARKER + ']')) {
          var footerLinks = document.querySelector('.bw-site-footer .bw-footer-bottom-links');
          var footer = footerLinks || document.querySelector('.bw-site-footer footer, .bw-site-footer, footer');
          if (!footer) return;
          var button = document.createElement('button');
          button.type = 'button';
          button.className = 'bw-privacy-settings-link';
          button.setAttribute(LINK_MARKER, 'true');
          button.textContent = 'Privacy Settings';
          footer.appendChild(button);
        }
        ensureFooterHandlers();
      } catch (err) {}
    }

    function run() {
      cleanupMisplacedStyles();
      addStyle(document);
      collectConsentRoots().forEach(hidePrivacyButtons);
      addFooterLink();
    }

    document.addEventListener('click', function (event) {
      var target = event.target && event.target.closest ? event.target.closest('[' + LINK_MARKER + ']') : null;
      if (target) dispatchOpenConsentSettings(event);
    });
    exposeConsentSettingsOpener();
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

  function isToolPage() {
    var path = String(location.pathname || '').toLowerCase();
    if (path === '/tools' || path === '/tools/') return false;
    return path.indexOf('/tools/') === 0;
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
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] a:not(.bw-blog-share-link):not(.bw-blog-mobile-nav-home):not(.bw-blog-mobile-nav-item):not(.bw-blog-mobile-guide-list a):not(.bw-blog-tool-button):not(.bw-blog-journey-card){color:#1B5E20!important;text-decoration-color:#FFE600!important;text-decoration-thickness:3px!important;text-underline-offset:3px!important;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] img{max-width:100%;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] [' + WIDGET_BLOCK_MARKER + '="1"]{display:block!important;margin-bottom:34px!important;}',
      'body.bw-blog-post-enhanced [data-bw-leadform]{margin:38px 0!important;}',
      '.bw-blog-share-bar,.bw-blog-mobile-nav,.bw-blog-mobile-guide,.bw-blog-tool-prompt,.bw-blog-journey,.bw-blog-back-top{box-sizing:border-box;font-family:Montserrat,Arial,sans-serif;color:#212121;}',
      '.bw-blog-share-bar *,.bw-blog-mobile-nav *,.bw-blog-mobile-guide *,.bw-blog-tool-prompt *,.bw-blog-journey *{box-sizing:border-box;}',
      '.bw-blog-share-bar{align-items:center;border-top:1px solid #D7E2CE;border-bottom:1px solid #D7E2CE;display:grid;gap:12px;grid-template-columns:auto minmax(0,1fr);margin:16px 0 30px;padding:14px 0;}',
      '.bw-blog-share-label{color:#1B5E20;display:block;font-size:11px;font-weight:900;letter-spacing:1.5px;line-height:1;text-transform:uppercase;white-space:nowrap;}',
      '.bw-blog-share-actions{align-items:center;display:flex;flex-wrap:wrap;gap:8px;min-width:0;}',
      '.bw-blog-share-link,.bw-blog-share-copy{align-items:center;background:#FFFFFF;border:1px solid #C5E1A5;border-radius:0;color:#212121!important;cursor:pointer;display:inline-flex;font-family:Montserrat,Arial,sans-serif!important;font-size:12px;font-weight:900;justify-content:center;letter-spacing:.2px;line-height:1;min-height:36px;padding:0 12px;text-decoration:none!important;white-space:nowrap;}',
      '.bw-blog-share-link:hover,.bw-blog-share-copy:hover{background:#FAFAF5;border-color:#1B5E20;color:#1B5E20!important;}',
      '.bw-blog-share-copy[data-bw-share-copied="1"]{background:#FFE600;border-color:#212121;color:#212121!important;}',
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
      '.bw-blog-share-bar a:focus-visible,.bw-blog-share-copy:focus-visible,.bw-blog-mobile-nav a:focus-visible,.bw-blog-mobile-guide-list a:focus-visible,.bw-blog-tool-prompt a:focus-visible,.bw-blog-journey a:focus-visible,.bw-blog-back-top:focus-visible{outline:3px solid rgba(255,230,0,.9);outline-offset:3px;}',
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
      '.bw-blog-journey-card-kind-tool{background:#FAFAF5;border:1px solid rgba(197,225,165,.85);justify-content:center;position:relative;}',
      '.bw-blog-journey-card-kind-tool .bw-blog-journey-image{align-items:center;aspect-ratio:1;background:#F3F8EF;border:1px solid #C5E1A5;border-radius:8px;display:flex;height:54px;justify-content:center;margin:16px 16px 0;overflow:hidden;padding:8px;width:54px;}',
      '.bw-blog-journey-card-kind-tool .bw-blog-journey-image img{height:100%!important;max-height:38px;max-width:38px;object-fit:contain;width:100%!important;}',
      '.bw-blog-journey-content{display:flex;flex:1;flex-direction:column;padding:14px 15px 16px;}',
      '.bw-blog-journey-label{color:#1B5E20;display:block;font-size:10px;font-weight:900;letter-spacing:1.2px;line-height:1;margin-bottom:9px;text-transform:uppercase;}',
      '.bw-blog-journey-card strong{color:#212121;display:block;font-size:16px;font-weight:900;line-height:1.16;overflow-wrap:break-word;}',
      '.bw-blog-journey-proof{align-self:flex-start;background:#F3F8EF;border:1px solid #C5E1A5;border-radius:999px;color:#1B5E20;display:inline-flex;font-size:11px;font-weight:900;letter-spacing:.2px;line-height:1.2;margin-top:10px;padding:6px 9px;}',
      '.bw-blog-journey-card-copy{color:#4E5A4E;display:block;font-family:Merriweather,Georgia,serif;font-size:14px;line-height:1.46;margin-top:10px;}',
      '.bw-blog-journey-card-kind-tool .bw-blog-journey-card-copy{-webkit-box-orient:vertical;-webkit-line-clamp:2;display:-webkit-box;overflow:hidden;}',
      '.bw-blog-journey-action{align-self:flex-start;border-bottom:3px solid #FFE600;color:#1B5E20;display:inline-flex;font-size:11px;font-weight:900;letter-spacing:.7px;line-height:1;margin-top:13px;padding-bottom:3px;text-transform:uppercase;}',
      '.bw-tool-bridge{margin:34px 0 26px;padding:28px 28px 24px;}',
      '.bw-tool-bridge-main{align-items:center;display:grid;gap:18px;grid-template-columns:minmax(0,1fr) auto;}',
      '.bw-tool-bridge-book{min-height:48px;padding:0 18px;}',
      '.bw-tool-bridge-secondary{display:grid;gap:14px;grid-template-columns:minmax(0,1fr);margin-top:18px;}',
      '[data-bw-tourcta]{display:none!important;}',
      '.bw-blog-back-top{align-items:center;background:#212121;border:2px solid #FFE600;border-radius:999px;bottom:24px;box-shadow:0 12px 28px rgba(0,0,0,.22);color:#FFFFFF;cursor:pointer;display:flex;font-size:22px;font-weight:900;height:44px;justify-content:center;opacity:0;pointer-events:none;position:fixed;right:22px;text-decoration:none;transform:translateY(10px);transition:opacity .18s ease,transform .18s ease,background .18s ease;visibility:hidden;width:44px;z-index:8500;}',
      '.bw-blog-back-top:hover{background:#1B5E20;}',
      '.bw-blog-back-top-visible{opacity:1;pointer-events:auto;transform:translateY(0);visibility:visible;}',
      '[' + NATIVE_END_MARKER + '="1"]{display:none!important;}',
      '@media (max-width:899px){html.bw-blog-mobile-preparing:not(.bw-blog-enhanced-ready):not(.bw-blog-mobile-prep-timeout) [data-hook="post"],html.bw-blog-mobile-preparing:not(.bw-blog-enhanced-ready):not(.bw-blog-mobile-prep-timeout) article{opacity:0!important;pointer-events:none!important;}body.bw-blog-post-enhanced [data-hook="post-page"] *:not(:has(> .bw-blog-mobile-nav)) > [data-hook="post"]{margin-top:270px!important;}body.bw-blog-post-enhanced [data-hook="post-page"] *:has(> .bw-blog-mobile-nav) > [data-hook="post"]{margin-top:0!important;}}',
      '@media (min-width:900px){.bw-blog-mobile-nav,.bw-blog-mobile-guide{display:none!important;}}',
      '@media (max-width:899px){body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] [' + WIDGET_BLOCK_MARKER + '="1"]{margin-bottom:28px!important;}.bw-blog-share-bar{display:grid;grid-template-columns:1fr;margin:8px 0 24px;padding:13px 0;}.bw-blog-share-actions{flex-wrap:nowrap;overflow-x:auto;padding-bottom:2px;scrollbar-width:none;}.bw-blog-share-actions::-webkit-scrollbar{display:none;}.bw-blog-share-link,.bw-blog-share-copy{flex:0 0 auto;min-height:36px;}}',
      '@media (max-width:899px){body.bw-blog-post-enhanced [' + POST_TITLE_MARKER + '="1"]{font-size:clamp(32px,8.4vw,35px)!important;line-height:1.06!important;margin-top:18px!important;}body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] p:not(.bw-blog-mobile-guide-title):not(.bw-blog-journey-intro):not(.bw-blog-tool-copy):not([' + EMPTY_PARAGRAPH_MARKER + ']){font-size:17px!important;line-height:1.68!important;margin-bottom:17px!important;}body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] h2{font-size:28px!important;margin-top:34px!important;}body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] h3{font-weight:900!important;}.bw-blog-mobile-nav{background:#FAFAF5;border:0;border-bottom:2px solid #212121;display:block;margin:0 0 28px;padding:24px 0 20px;position:relative;}.bw-blog-mobile-nav:before{background:#1B5E20;content:"";display:block;height:5px;left:0;position:absolute;right:0;top:0;}.bw-blog-mobile-nav:after{background:#212121;content:"";display:block;height:2px;left:0;position:absolute;right:0;top:86px;}.bw-blog-tool-prompt{align-items:start;grid-template-columns:1fr;margin:28px 0;padding:18px;}.bw-blog-tool-button,.bw-tool-bridge-book{justify-self:start;}.bw-blog-journey{margin:32px 0 28px;padding:24px 18px;}.bw-tool-bridge-main,.bw-blog-journey-grid,.bw-blog-related-grid{grid-template-columns:1fr;}.bw-blog-journey h2{font-size:26px!important;}.bw-blog-back-top{bottom:92px;right:14px;width:42px;height:42px;font-size:21px;}}',
      '@media (max-width:899px){.bw-blog-journey{background:#102414;margin:34px calc(50% - 50vw) 32px!important;max-width:100vw;overflow:hidden;padding:30px max(20px, env(safe-area-inset-right)) 34px max(20px, env(safe-area-inset-left));width:100vw;}.bw-blog-journey>*{margin-left:auto;margin-right:auto;max-width:560px;}.bw-blog-journey:before{height:6px;}.bw-blog-journey-kicker{font-size:12px;letter-spacing:1.4px;margin-bottom:12px;}body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] .bw-blog-journey h2{font-size:28px!important;line-height:1.05!important;margin-bottom:10px!important;}body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] .bw-blog-journey .bw-blog-journey-intro{font-size:15px!important;line-height:1.62!important;margin-bottom:24px!important;}.bw-blog-journey-grid{gap:16px;margin-bottom:28px;}.bw-blog-related-title{font-size:13px!important;letter-spacing:1.4px!important;margin:4px auto 16px!important;}.bw-blog-related-grid{gap:16px;}.bw-blog-journey-card{border:1px solid rgba(197,225,165,.22);box-shadow:0 14px 30px rgba(0,0,0,.24);width:100%;}.bw-blog-journey-content{padding:16px 16px 18px;}.bw-blog-journey-card strong{font-size:18px;line-height:1.12;}.bw-blog-journey-grid .bw-blog-journey-card-kind-tool{align-items:center;background:#FAFAF5;display:grid;grid-template-columns:minmax(0,1fr) 74px;min-height:132px;}.bw-blog-journey-grid .bw-blog-journey-card-kind-tool .bw-blog-journey-image{grid-column:2;grid-row:1;height:54px;margin:16px 16px 16px 0;width:54px;}.bw-blog-journey-grid .bw-blog-journey-card-kind-tool .bw-blog-journey-content{grid-column:1;grid-row:1;justify-content:center;padding:16px 0 18px 16px;}.bw-blog-journey-grid .bw-blog-journey-card-kind-tool strong{font-size:17px;line-height:1.12;}.bw-blog-journey-grid .bw-blog-journey-card-kind-tool .bw-blog-journey-card-copy{font-size:13.5px;line-height:1.42;margin-top:9px;}.bw-blog-related-grid .bw-blog-journey-card{display:grid;grid-template-columns:minmax(104px,34%) minmax(0,1fr);min-height:132px;}.bw-blog-related-grid .bw-blog-journey-image{aspect-ratio:auto;height:100%;min-height:132px;}.bw-blog-related-grid .bw-blog-journey-content{justify-content:center;padding:14px 14px 15px;}.bw-blog-related-grid .bw-blog-journey-card strong{font-size:16px;line-height:1.15;}.bw-blog-related-grid .bw-blog-journey-label{font-size:10px;margin-bottom:8px;}}',
      '@media (max-width:360px){.bw-blog-journey{padding-left:16px;padding-right:16px;}.bw-blog-journey-grid .bw-blog-journey-card-kind-tool{grid-template-columns:minmax(0,1fr) 62px;min-height:124px;}.bw-blog-journey-grid .bw-blog-journey-card-kind-tool .bw-blog-journey-image{height:46px;margin-right:12px;width:46px;}.bw-blog-journey-grid .bw-blog-journey-card-kind-tool .bw-blog-journey-content{padding:14px 0 15px 14px;}.bw-blog-journey-grid .bw-blog-journey-card-kind-tool strong{font-size:16px;}.bw-blog-related-grid .bw-blog-journey-card{grid-template-columns:96px minmax(0,1fr);min-height:124px;}.bw-blog-related-grid .bw-blog-journey-image{min-height:124px;}.bw-blog-related-grid .bw-blog-journey-content{padding:12px;}.bw-blog-related-grid .bw-blog-journey-card strong{font-size:15px;}}'
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
      }).catch(function () {
        return { allPosts: [], tools: [], bookingUrl: BOOKING_URL };
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

  function currentTool(data) {
    var slug = currentSlug();
    if (!slug) return null;
    var match = (data.toolsHub || []).filter(function (item) { return item.slug === slug; })[0] ||
      (data.tools || []).filter(function (item) { return item.slug === slug; })[0] ||
      TOOL_FALLBACKS[slug];
    var tool = cloneTool(match, slug);
    if (!tool) return null;
    if (!tool.url) tool.url = 'https://www.berlinwalk.com/tools/' + slug;
    if (!tool.summary && tool.lead) tool.summary = tool.lead;
    if (!tool.image) tool.image = TOOL_ICON_FALLBACKS[tool.slug] || DEFAULT_TOOL_IMAGE;
    return tool;
  }

  function relatedPostForTool(data, tool) {
    if (!tool || !tool.slug) return null;
    var posts = data.allPosts || [];
    for (var i = 0; i < posts.length; i++) {
      if (posts[i].relatedToolSlug === tool.slug && posts[i].url && posts[i].title) return posts[i];
    }
    return null;
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

  function sharePageUrl() {
    try {
      var canonical = document.querySelector('link[rel="canonical"]');
      if (canonical && canonical.href && /^https?:\/\//i.test(canonical.href)) {
        return canonical.href.split('#')[0];
      }
    } catch (err) {}
    try {
      var url = new URL(window.location.href);
      url.search = '';
      url.hash = '';
      return url.toString();
    } catch (err) {
      return window.location.href.split('#')[0].split('?')[0];
    }
  }

  function sharePageTitle() {
    var title = findPostTitle();
    var text = cleanText(title && title.textContent || '');
    if (text) return text;
    return cleanText((document.title || '').replace(/\s*\|\s*BerlinWalk.*$/i, '')) || 'BerlinWalk guide';
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () {
        return fallbackCopy(text);
      });
    }
    return Promise.resolve(fallbackCopy(text));
  }

  function fallbackCopy(text) {
    var box = document.createElement('textarea');
    box.value = text;
    box.setAttribute('readonly', 'readonly');
    box.style.position = 'fixed';
    box.style.left = '-9999px';
    box.style.top = '0';
    document.body.appendChild(box);
    box.focus();
    box.select();
    try { document.execCommand('copy'); } catch (err) {}
    box.remove();
    return true;
  }

  function markShareCopied(button) {
    if (!button) return;
    var label = button.getAttribute('data-bw-share-original') || cleanText(button.textContent) || 'Copy link';
    button.setAttribute('data-bw-share-original', label);
    button.setAttribute('data-bw-share-copied', '1');
    button.textContent = 'Copied';
    window.clearTimeout(button.__bwShareCopiedTimer);
    button.__bwShareCopiedTimer = window.setTimeout(function () {
      button.removeAttribute('data-bw-share-copied');
      button.textContent = label;
    }, 1800);
  }

  function insertShareBar(body) {
    if (!body) return;
    var url = sharePageUrl();
    var title = sharePageTitle();
    var key = url + '|' + title;
    var old = document.querySelector('[' + SHARE_MARKER + ']');
    if (old && old.getAttribute('data-bw-blog-share-key') === key) return;
    if (old) old.remove();

    var text = title + ' ' + url;
    var encodedUrl = encodeURIComponent(url);
    var encodedText = encodeURIComponent(text);
    var bar = document.createElement('aside');
    bar.className = 'bw-blog-share-bar';
    bar.setAttribute(SHARE_MARKER, '1');
    bar.setAttribute('data-bw-blog-share-key', key);
    bar.setAttribute('data-bw-blog-share-version', SHARE_LAYOUT_VERSION);
    bar.setAttribute('aria-label', 'Share this guide');
    bar.innerHTML =
      '<span class="bw-blog-share-label">Share this guide</span>' +
      '<div class="bw-blog-share-actions">' +
        '<a class="bw-blog-share-link" href="https://wa.me/?text=' + encodedText + '" target="_blank" rel="noopener" data-bw-share-channel="whatsapp">WhatsApp</a>' +
        '<a class="bw-blog-share-link" href="https://www.facebook.com/sharer/sharer.php?u=' + encodedUrl + '" target="_blank" rel="noopener" data-bw-share-channel="facebook">Facebook</a>' +
        '<a class="bw-blog-share-link" href="https://twitter.com/intent/tweet?url=' + encodedUrl + '&text=' + encodeURIComponent(title) + '" target="_blank" rel="noopener" data-bw-share-channel="x">X</a>' +
        '<button class="bw-blog-share-copy" type="button" data-bw-share-channel="copy">Copy link</button>' +
      '</div>';

    bar.addEventListener('click', function (event) {
      var target = event.target.closest('[data-bw-share-channel]');
      if (!target) return;
      var channel = target.getAttribute('data-bw-share-channel') || '';
      pushEvent('bw_blog_share_click', {
        slug: currentSlug(),
        channel: channel,
        href: channel === 'copy' ? url : (target.href || '')
      });
      if (channel !== 'copy') return;
      event.preventDefault();
      copyToClipboard(url).then(function () {
        markShareCopied(target);
      }).catch(function () {
        markShareCopied(target);
      });
    });

    var first = body.firstElementChild;
    while (first && first.matches && first.matches('[' + MOBILE_NAV_MARKER + '],[' + MOBILE_MARKER + '],[' + TOOL_MARKER + '],[' + JOURNEY_MARKER + ']')) {
      first = first.nextElementSibling;
    }
    body.insertBefore(bar, first || null);
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

  function normalizeBookingVariant(value) {
    return value === 'landing' ? 'landing' : 'service';
  }

  function activeBookingVariant() {
    return normalizeBookingVariant(BOOKING_EXPERIMENT_VARIANT);
  }

  function resolveBookingDestination() {
    return activeBookingVariant() === 'landing' ? BOOKING_DEST_LANDING : BOOKING_DEST_SERVICE;
  }

  function bookingVariantSuffix(variant) {
    return normalizeBookingVariant(variant) === 'landing' ? 'landing' : 'svc';
  }

  function stripBookingContentSuffixes(value) {
    var output = String(value || '');
    var previous = '';
    while (output && output !== previous) {
      previous = output;
      output = output.replace(/_(nextslot|svc|landing)$/i, '');
    }
    return output;
  }

  function bookingContentValue(context, variant) {
    var incoming = new URL(window.location.href);
    var incomingContent = incoming.searchParams.get('utm_content') || currentSlug() || 'post';
    var base = slugify(stripBookingContentSuffixes(incomingContent)) || slugify(currentSlug() || 'post');
    var suffixes = [];
    if (context && /nextslot/i.test(context)) suffixes.push('nextslot');
    suffixes.push(bookingVariantSuffix(variant));
    return slugify(base + '_' + suffixes.join('_'));
  }

  function bookingJourneyCard(bookingUrl, title, context) {
    var slot = getNextTourSlot();
    var nextToursLabel = getNextTourStartsLabel(2, false);
    var variant = activeBookingVariant();
    var bookingTitle = title || 'Walk this context with me in Berlin';
    if (nextToursLabel) {
      bookingTitle = 'Next tours: ' + nextToursLabel;
    }
    return {
      label: 'Free walk',
      title: bookingTitle,
      copy: slot ? 'Free, tip-based, about 2 hours. Reserve a spot, pay nothing upfront.' : '',
      url: bookingUrl,
      image: TOUR_IMAGE,
      bookLink: true,
      bookContext: context || 'blog_journey_booking',
      bookEvent: 'bw_blog_book_bridge_click',
      bookLinkKind: 'booking_bridge',
      bookOnceKey: 'bw_blog_book_bridge_click:' + (currentSlug() || 'post'),
      bookingVariant: variant,
      proofChip: '9.8/10 on FreeTour',
      ctaKind: 'booking'
    };
  }

  function plannerJourneyCard(post, title, context) {
    var slug = post && post.slug || currentSlug();
    return {
      label: 'Plan it',
      kind: 'tool',
      title: title || 'Build a Berlin Trip Pack',
      copy: 'Turn this guide into a simple route and timing plan.',
      url: journeyUtmUrl(TRIP_PLANNER_URL, slug, context || 'trip_planner', 'blog_bridge'),
      image: TOOL_ICON_FALLBACKS['berlin-first-day-planner'] || DEFAULT_TOOL_IMAGE,
      actionText: 'Plan route',
      ctaKind: 'trip_planner'
    };
  }

  function toolJourneyCard(tool, post, label) {
    if (!tool || !tool.url || !tool.title) return null;
    return {
      label: label || 'Use a tool',
      kind: 'tool',
      title: tool.title,
      copy: tool.summary || tool.lead || 'Use it when this detail affects what you do next.',
      url: journeyUtmUrl(tool.url, post && post.slug, 'tool_' + (tool.slug || slugify(tool.title)), 'blog_tool_bridge'),
      image: tool.image,
      actionText: 'Open tool',
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
    var directBookCard = bookingJourneyCard(bookingUrl, 'Walk this context with me in Berlin', 'blog_journey_direct_booking_nextslot');
    var softBookCard = bookingJourneyCard(bookingUrl, 'Book my 2-hour Berlin orientation walk', 'blog_journey_soft_booking_nextslot');
    var strategy = {
      intent: intent,
      kicker: 'Next step',
      title: 'Turn this guide into a Berlin plan',
      intro: 'Keep going with the right next step for this topic, without turning every article into a sales pitch.',
      cards: []
    };

    if (intent === 'direct-booking') {
      strategy.title = 'Walk this context in Berlin';
      strategy.intro = 'If this guide made the city clearer, the easiest next step is my tip-based walk: free reservation, no upfront payment, about 2 hours.';
      strategy.cards = dedupeJourneyCards([directBookCard, toolCard, readCard], 3);
      return strategy;
    }

    if (intent === 'planner-first') {
      strategy.title = 'Make the practical part easier';
      strategy.intro = 'For utility topics, start with planning help first. Book the walk later only if it fits the trip you are building.';
      strategy.cards = dedupeJourneyCards([toolCard, softBookCard, plannerCard, readCard], 3);
      return strategy;
    }

    if (intent === 'event-context') {
      strategy.title = 'Plan around this Berlin moment';
      strategy.intro = 'Use this as context for your trip, then choose whether a walk, a tool, or another guide is the useful next move.';
      strategy.cards = dedupeJourneyCards([plannerCard, softBookCard, toolCard, readCard], 3);
      return strategy;
    }

    strategy.title = 'Turn this into a Berlin day';
    strategy.intro = 'Build a route first, then keep reading or book the walk if you want the city context in person.';
    strategy.cards = dedupeJourneyCards([plannerCard, softBookCard, toolCard, readCard], 3);
    return strategy;
  }

  function findJourneyInsertionPoint(body) {
    var candidates = body.querySelectorAll('p, li, blockquote');
    for (var i = candidates.length - 1; i >= 0; i--) {
      var el = candidates[i];
      if (!isVisible(el)) continue;
      if (el.closest('[' + MOBILE_NAV_MARKER + '], [' + MOBILE_MARKER + '], [' + TOOL_MARKER + '], [' + JOURNEY_MARKER + '], [data-bw-leadform], [data-bw-tourcta]')) continue;
      if (cleanText(el.textContent).length < 24) continue;
      return journeyInsertionTarget(el, body);
    }
    return { parent: body, after: body.lastElementChild };
  }

  function journeyInsertionTarget(el, body) {
    var list = el && el.closest && el.closest('ul,ol');
    if (list && body.contains(list) && list.parentNode) {
      var outer = list;
      while (outer.parentElement) {
        var parentList = outer.parentElement.closest && outer.parentElement.closest('ul,ol');
        if (!parentList || !body.contains(parentList) || parentList === outer) break;
        outer = parentList;
      }
      return { parent: outer.parentNode, after: outer };
    }
    return { parent: el.parentNode, after: el };
  }

  function cardImage(card) {
    return card.image || card.thumb || (card.kind === 'tool' ? DEFAULT_TOOL_IMAGE : TOUR_IMAGE);
  }

  function renderJourneyCard(card) {
    var image = cardImage(card);
    var key = slugify(card.label || card.title);
    var bookAttrs = card.bookLink ? ' data-book-link="1" data-bw-book-context="' + escapeAttr(card.bookContext || key) + '"' : '';
    if (card.bookEvent) bookAttrs += ' data-bw-book-event="' + escapeAttr(card.bookEvent) + '"';
    if (card.bookLinkKind) bookAttrs += ' data-bw-book-link-kind="' + escapeAttr(card.bookLinkKind) + '"';
    if (card.bookOnceKey) bookAttrs += ' data-bw-book-once-key="' + escapeAttr(card.bookOnceKey) + '"';
    if (card.bookingVariant) bookAttrs += ' data-bw-book-variant="' + escapeAttr(card.bookingVariant) + '"';
    var ctaKind = card.ctaKind ? ' data-bw-journey-cta-kind="' + escapeAttr(card.ctaKind) + '"' : '';
    var classes = [
      'bw-blog-journey-card',
      'bw-blog-journey-card-' + key
    ];
    if (card.kind) classes.push('bw-blog-journey-card-kind-' + slugify(card.kind));
    if (card.ctaKind) classes.push('bw-blog-journey-card-' + slugify(card.ctaKind));
    return '<a class="' + escapeAttr(classes.join(' ')) + '" href="' + escapeAttr(card.url) + '" target="_top" data-bw-blog-journey-click="' + escapeAttr(card.label) + '"' + ctaKind + bookAttrs + '>' +
      '<span class="bw-blog-journey-image" aria-hidden="true"><img src="' + escapeAttr(image) + '" alt="" loading="lazy"></span>' +
      '<span class="bw-blog-journey-content">' +
        '<span class="bw-blog-journey-label">' + escapeHtml(card.label) + '</span>' +
        '<strong>' + escapeHtml(card.title) + '</strong>' +
        (card.proofChip ? '<span class="bw-blog-journey-proof">' + escapeHtml(card.proofChip) + '</span>' : '') +
        (card.copy ? '<span class="bw-blog-journey-card-copy">' + escapeHtml(card.copy) + '</span>' : '') +
        (card.actionText ? '<span class="bw-blog-journey-action">' + escapeHtml(card.actionText) + '</span>' : '') +
      '</span>' +
    '</a>';
  }

  function insertJourney(body, data) {
    if (!body) return;
    var post = currentPost(data);
    var posts = relatedPosts(data, post, 7);
    var tool = relatedTool(data, post);
    var bookingUrl = resolveBookingDestination();
    var strategy = journeyStrategy(post, tool, posts, bookingUrl);
    var cards = strategy.cards || [];
    if (!cards.length) return;
    var journeyKey = [
      post && post.slug,
      JOURNEY_LAYOUT_VERSION,
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
    section.setAttribute('data-bw-blog-journey-layout', JOURNEY_LAYOUT_VERSION);
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
        book_context: link.getAttribute('data-bw-book-context') || '',
        variant: link.getAttribute('data-bw-book-variant') || ''
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

  function toolWidgetFrameSource(frame) {
    return String(frame && (frame.getAttribute('src') || frame.getAttribute('data-src') || '') || '').toLowerCase();
  }

  function findToolWidgetFrame(tool) {
    var frames = Array.prototype.slice.call(document.querySelectorAll('iframe'));
    var widgetPath = tool && tool.widgetUrl ? String(tool.widgetUrl).toLowerCase().replace(/^https?:/, '') : '';
    var slugPath = tool && tool.slug ? '/' + String(tool.slug).toLowerCase() + '/' : '';
    var fallback = null;
    for (var i = 0; i < frames.length; i++) {
      var src = toolWidgetFrameSource(frames[i]);
      if (!src || src.indexOf('fenerszymanski.github.io/berlinwalk-widgets/') === -1) continue;
      if (/\/(faq|quick-summary)\//.test(src)) continue;
      if (widgetPath && src.indexOf(widgetPath) !== -1) return frames[i];
      if (slugPath && src.indexOf(slugPath) !== -1) return frames[i];
      if (!fallback) fallback = frames[i];
    }
    return fallback;
  }

  function findToolBridgeAnchor(tool) {
    var frame = findToolWidgetFrame(tool);
    if (frame) {
      var section = frame.closest('section');
      if (section && section.parentNode) return { parent: section.parentNode, after: section };
      var wrapper = frame.closest('div,article,main');
      if (wrapper && wrapper.parentNode) return { parent: wrapper.parentNode, after: wrapper };
    }
    if (!frame && (Date.now() - bootAt) < 2500) return null;
    var footer = document.querySelector('footer,[data-hook="footer"],[role="contentinfo"]');
    if (footer && footer.parentNode) return { parent: footer.parentNode, before: footer };
    var main = document.querySelector('main');
    if (main) return { parent: main, after: main.lastElementChild };
    return null;
  }

  function toolBridgeTitle(slot) {
    if (slot && slot.relativeLabel && slot.slotsLabel) {
      return 'Next free walk' + (slot.slotCount > 1 ? 's' : '') + ': ' + slot.relativeLabel + ' at ' + slot.slotsLabel;
    }
    return 'Next free walk: Tue-Sat at 11:30';
  }

  function insertToolBridge(data) {
    var tool = currentTool(data);
    if (!tool || !tool.url) return;
    var bookingUrl = toolBridgeBookingUrl(tool);
    var related = relatedPostForTool(data, tool);
    var slot = getNextTourSlot();
    var journeyKey = [
      'tool',
      tool.slug || currentSlug(),
      toolBridgeTitle(slot),
      related && related.slug || ''
    ].join('|');
    var old = document.querySelector('[' + JOURNEY_MARKER + ']');
    if (old && old.getAttribute('data-bw-blog-journey-key') === journeyKey) return;
    if (old) old.remove();

    var point = findToolBridgeAnchor(tool);
    if (!point || !point.parent) return;

    var section = document.createElement('section');
    section.className = 'bw-blog-journey bw-tool-bridge';
    section.setAttribute(JOURNEY_MARKER, '1');
    section.setAttribute('data-bw-blog-journey-key', journeyKey);
    section.setAttribute('data-bw-blog-journey-intent', 'tool_bridge');
    section.setAttribute('data-bw-blog-journey-surface', 'tool');
    section.setAttribute('aria-label', 'Book a Berlin walking tour from this tool');
    section.innerHTML =
      '<span class="bw-blog-journey-kicker">While you are in Berlin</span>' +
      '<div class="bw-tool-bridge-main">' +
        '<div>' +
          '<h2>' + escapeHtml(toolBridgeTitle(slot)) + '</h2>' +
          '<p class="bw-blog-journey-intro">I meet at the World Clock on Alexanderplatz. About 2 hours, tip-based, reserve a spot and pay nothing upfront.</p>' +
        '</div>' +
        '<a class="bw-blog-tool-button bw-tool-bridge-book" href="' + escapeAttr(bookingUrl) + '" target="_top" data-book-link="1" data-bw-book-context="tool_bridge_booking" data-bw-book-event="bw_tool_book_bridge_click" data-bw-book-link-kind="tool_bridge" data-bw-book-once-key="bw_tool_book_bridge_click:' + escapeAttr(tool.slug || currentSlug() || 'tool') + '" data-bw-book-variant="' + escapeAttr(activeBookingVariant()) + '">Reserve a free spot</a>' +
      '</div>' +
      (related ? '<div class="bw-tool-bridge-secondary">' + renderJourneyCard({
        label: 'Read next',
        title: related.title,
        url: related.url,
        image: related.thumb || related.image,
        ctaKind: 'tool_related'
      }) + '</div>' : '');

    section.addEventListener('click', function (event) {
      var link = event.target.closest('a[href]');
      if (!link) return;
      if (link.hasAttribute('data-book-link')) {
        trackBookLinkClick(link, 'tool_bridge_booking');
      }
    });

    if (point.before) point.parent.insertBefore(section, point.before);
    else if (point.after && point.after.parentNode === point.parent) point.parent.insertBefore(section, point.after.nextSibling);
    else point.parent.appendChild(section);

    sessionOnce('bw_tool_bridge_view:' + (tool.slug || currentSlug() || 'tool'), function () {
      return trackPaidEvent('bw_tool_bridge_view', {
        slug: currentSlug(),
        tool_slug: tool.slug || '',
        slot_count: slot && slot.slotCount || 0,
        booking_variant: activeBookingVariant()
      });
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

    function isFooterLike(el) {
      if (!el || !el.closest) return false;
      if (el.closest('footer,#SITE_FOOTER,#bw-site-footer-restore,.bw-site-footer')) return true;
      var node = el;
      for (var depth = 0; depth < 5 && node && node !== document.body; depth++) {
        var haystack = ((node.id || '') + ' ' + (node.className || '')).toLowerCase();
        if (haystack.indexOf('footer') !== -1) return true;
        node = node.parentElement;
      }
      return false;
    }

    function isNativeShareControl(el) {
      if (!el || !el.closest || el.closest('[' + SHARE_MARKER + '], [' + JOURNEY_MARKER + '], [' + MOBILE_NAV_MARKER + '], [' + MOBILE_MARKER + '], [' + TOOL_MARKER + ']')) return false;
      if (isFooterLike(el)) return false;
      var semantic = cleanText([
        el.getAttribute('aria-label') || '',
        el.getAttribute('title') || '',
        el.getAttribute('data-testid') || '',
        el.textContent || ''
      ].join(' ')).toLowerCase();
      var href = String(el.getAttribute('href') || '').toLowerCase();
      if (/facebook|twitter|x\.com|whatsapp|pinterest|mailto:|print|copy link|share/.test(semantic + ' ' + href)) return true;
      if (/^x$|^f$|^in$/.test(semantic)) return true;
      if (/\bcopy\b/.test(semantic) && /\blink\b/.test(semantic)) return true;
      return false;
    }

    function shareControlCount(el) {
      if (!el || !el.querySelectorAll) return 0;
      return Array.prototype.filter.call(el.querySelectorAll('a,button,[role="button"]'), isNativeShareControl).length;
    }

    function chooseShareContainer(control) {
      var node = control;
      var best = null;
      for (var depth = 0; depth < 8 && node && node.parentElement && node.parentElement !== document.body; depth++) {
        var parent = node.parentElement;
        if (parent.closest('[' + SHARE_MARKER + '], [' + JOURNEY_MARKER + '], [' + MOBILE_NAV_MARKER + '], [' + MOBILE_MARKER + '], [' + TOOL_MARKER + ']')) break;
        if (isFooterLike(parent) || isUnsafeEndMatterContainer(parent)) break;
        var controls = shareControlCount(parent);
        var allControls = parent.querySelectorAll('a,button,[role="button"]').length;
        var text = cleanText(parent.textContent);
        var rect = parent.getBoundingClientRect ? parent.getBoundingClientRect() : { width: 0, height: 0 };
        if (controls >= 3 && allControls <= 12 && text.length < 500 && rect.width >= 80 && rect.height <= 260) {
          best = parent;
        }
        node = parent;
      }
      return best;
    }

    function hideNativeShareBlocks() {
      var controls = document.querySelectorAll('a,button,[role="button"]');
      for (var j = 0; j < controls.length; j++) {
        if (!isNativeShareControl(controls[j])) continue;
        var shareContainer = chooseShareContainer(controls[j]);
        if (shareContainer && !isUnsafeEndMatterContainer(shareContainer) && !isFooterLike(shareContainer)) {
          shareContainer.setAttribute(NATIVE_END_MARKER, '1');
          shareContainer.setAttribute('aria-hidden', 'true');
        }
      }
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

    hideNativeShareBlocks();
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

  function applyBookAttribution(url, context, options) {
    options = options || {};
    var incoming = new URL(window.location.href);
    ATTRIBUTION_KEYS.forEach(function (key) {
      if (incoming.searchParams.has(key)) url.searchParams.set(key, incoming.searchParams.get(key));
    });
    url.searchParams.set('utm_content', options.content || bookingContentValue(context, activeBookingVariant()));
    if (options.forceSource) url.searchParams.set('utm_source', options.forceSource);
    else if (!url.searchParams.has('utm_source')) url.searchParams.set('utm_source', 'berlinwalk');
    url.searchParams.set('utm_medium', options.medium || 'blog_bridge');
    if (options.forceCampaign) url.searchParams.set('utm_campaign', options.forceCampaign);
    else if (!url.searchParams.has('utm_campaign')) url.searchParams.set('utm_campaign', options.campaign || 'utility_blog_booking_bridge');
    return url;
  }

  function toolBridgeBookingUrl(tool) {
    var slug = tool && tool.slug || currentSlug() || 'tool';
    return applyBookAttribution(new URL(resolveBookingDestination(), window.location.href), 'tool_bridge_booking', {
      forceSource: 'berlinwalk',
      medium: 'tool_bridge',
      forceCampaign: 'utility_tool_booking_bridge',
      content: slugify(slug + '_toolbridge_nextslot')
    }).toString();
  }

  function trackPaidEvent(eventName, payload) {
    payload = payload || {};
    var currentUrl = new URL(window.location.href);
    var params = currentUrl.searchParams;
    if (!pushEvent(eventName, Object.assign({ page_path: window.location.pathname }, payload))) return false;
    try {
      window.fetch(TRACK_ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          eventName: eventName === 'bw_book_link_click' ? 'bw_booking_pick_date_click' : eventName,
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
          payload: payload
        })
      }).catch(function () {});
    } catch (err) {}
    return true;
  }

  function sessionOnce(key, callback) {
    if (!key) return callback();
    try {
      if (window.sessionStorage && window.sessionStorage.getItem(key) === '1') return false;
    } catch (err) {}
    var sent = callback();
    if (!sent) return false;
    try {
      if (window.sessionStorage) window.sessionStorage.setItem(key, '1');
    } catch (err) {}
    return true;
  }

  function trackBookLinkClick(link, context) {
    context = link.getAttribute('data-bw-book-context') || context || 'blog_book_link';
    var eventName = link.getAttribute('data-bw-book-event') || 'bw_book_link_click';
    var linkKind = link.getAttribute('data-bw-book-link-kind') || 'blog_book_link';
    var onceKey = link.getAttribute('data-bw-book-once-key') || '';
    var variant = normalizeBookingVariant(link.getAttribute('data-bw-book-variant') || activeBookingVariant());
    var journey = link.closest('[' + JOURNEY_MARKER + ']');
    var journeyIntent = journey ? (journey.getAttribute('data-bw-blog-journey-intent') || '') : '';

    sessionOnce(onceKey, function () {
      return trackPaidEvent(eventName, {
        cta_name: context,
        link_kind: linkKind,
        journey_intent: journeyIntent,
        cta_kind: link.getAttribute('data-bw-journey-cta-kind') || '',
        variant: variant
      });
    });
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
    if (!isPostPage() && !isToolPage()) {
      removeInjected();
      return;
    }
    ensureNextTourSlotHelper();
    injectStyle();
    if (isToolPage()) {
      loadData().then(function (data) {
        insertToolBridge(data);
      });
      return;
    }
    var body = findPostBody();
    if (!body) return;
    markPostBody(body);
    normalizePostTitleTypography();
    normalizePostSpacing(body);
    normalizeHeadingTypography(body);
    insertBackToTop();
    insertShareBar(body);
    var items = collectHeadings(body);
    insertMobileBlogNav(body, dataCache);
    insertMobileGuide(body, items);
    hideNativeEndMatter();
    markBlogReady();
    decorateBlogBookLinks();
    loadData().then(function (data) {
      insertMobileBlogNav(body, data);
      insertShareBar(body);
      insertToolPrompt(body, data, items);
      insertJourney(body, data);
      hideNativeEndMatter();
      decorateBlogBookLinks();
    });
  }

  function removeInjected() {
    var mobileNav = document.querySelector('[' + MOBILE_NAV_MARKER + ']');
    var mobile = document.querySelector('[' + MOBILE_MARKER + ']');
    var share = document.querySelector('[' + SHARE_MARKER + ']');
    var tool = document.querySelector('[' + TOOL_MARKER + ']');
    var journey = document.querySelector('[' + JOURNEY_MARKER + ']');
    var backTop = document.querySelector('[' + BACK_TOP_MARKER + ']');
    if (mobileNav) mobileNav.remove();
    if (mobile) mobile.remove();
    if (share) share.remove();
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
    } else if (isToolPage()) {
      injectStyle();
    }
    [0, 80, 220, 520, 1100, 2400, 4200, 7000].forEach(function (delay) {
      setTimeout(render, delay);
    });
    if (observer) observer.disconnect();
    observer = new MutationObserver(function () {
      if (isPostPage()) {
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
        if (body && !document.querySelector('[' + SHARE_MARKER + ']')) {
          insertShareBar(body);
        }
        var needsMobileGuide = body && collectHeadings(body).length >= 2;
        if (!document.querySelector('[' + JOURNEY_MARKER + ']') || !document.querySelector('[' + SHARE_MARKER + ']') || (needsMobileGuide && !document.querySelector('[' + MOBILE_MARKER + ']'))) {
          scheduleRender();
        }
        return;
      }
      if (isToolPage() && !document.querySelector('[' + JOURNEY_MARKER + ']')) {
        scheduleRender();
      }
    });
    if (document.body) observer.observe(document.body, { childList: true, subtree: true });
  }

  if (isPostPage()) {
    injectStabilityStyle();
    injectStyle();
  } else if (isToolPage()) {
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
