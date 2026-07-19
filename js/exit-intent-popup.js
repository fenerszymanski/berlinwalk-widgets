/* exit-intent-popup.js - desktop-only BerlinWalk exit-intent popup.
 * Load sitewide via Wix Custom Code, body-end.
 */
(function () {
  var BOOKING_URL = 'https://www.berlinwalk.com/free-berlin-walking-tour';
  var TRACK_ENDPOINT = 'https://app.berlinwalk.com/api/pf-event';
  var VISITOR_KEY = 'bwVisitorId.v1';
  var ANALYTICS_SESSION_KEY = 'bwSessionId.v1';
  var PAID_TRACKING_KEY = 'bwPaidTracking.v1';
  var EVENT_SENT_PREFIX = 'bwExitPopupEventSent.v1.';
  var ATTRIBUTION_KEYS = [
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id',
    'fbclid', 'fbc', 'fbp', 'gclid', 'gbraid', 'wbraid'
  ];
  var HERO_IMAGE_URL = getImageUrl('hero');
  var SESSION_KEY = 'bw-exit-intent-triggered';
  var DESKTOP_MIN_WIDTH = 1024;
  var STYLE_ID = 'bw-exit-intent-styles';
  var OVERLAY_ID = 'bw-exit-intent-popup';
  var DWELL_TIME_MS = isPreviewForced() ? 500 : 30000;
  var NEXT_TOUR_SLOT_URL = resolveAdjacentScriptUrl('next-tour-slot.js');
  var DEFAULT_START_LABELS = ['11:30'];
  var SUMMER_START_LABELS = ['11:30', '15:30'];
  var SAME_DAY_CUTOFF_LEAD_MINUTES = 180;
  var DOUBLE_SLOT_START_MONTH_DAY = 703;
  var DOUBLE_SLOT_END_MONTH_DAY = 930;
  var DAY_MS = 24 * 60 * 60 * 1000;
  var TOUR_DAYS = { Tue: true, Wed: true, Thu: true, Fri: true, Sat: true };

  var dwellReady = false;
  var popupShown = false;
  var currentStep = 1;
  var closeTracked = false;
  var nextTourSlotRequested = false;
  var sentEvents = {};

  function resolveAdjacentScriptUrl(fileName) {
    try {
      if (document.currentScript && document.currentScript.src) {
        return new URL(fileName, document.currentScript.src).toString();
      }
    } catch (err) {}
    return 'https://fenerszymanski.github.io/berlinwalk-widgets/js/' + fileName;
  }

  function getImageUrl(type) {
    var file = 'berlin-trip-planner-hero.jpg';

    if (/^(localhost|127\.0\.0\.1)$/.test(window.location.hostname)) {
      return 'ultimate-berlin-trip-planner/assets/' + file;
    }
    return 'https://fenerszymanski.github.io/berlinwalk-widgets/ultimate-berlin-trip-planner/assets/' + file;
  }

  function isPreviewForced() {
    var host = window.location.hostname;
    var isSafeHost = /^(localhost|127\.0\.0\.1)$/.test(host) ||
      host === 'www.berlinwalk.com' ||
      host === 'berlinwalk.com';
    return isSafeHost && (
      window.location.search.indexOf('forceExitPreview=1') !== -1 ||
      window.location.search.indexOf('bwExitPreview=1') !== -1
    );
  }

  function safeSessionGet(key) {
    try {
      return window.sessionStorage.getItem(key);
    } catch (err) {
      return null;
    }
  }

  function safeSessionSet(key, value) {
    try {
      window.sessionStorage.setItem(key, value);
    } catch (err) {}
  }

  function safeStorageRemove(storage, key) {
    try {
      storage.removeItem(key);
    } catch (err) {}
  }

  function safeStorageGet(storage, key) {
    try {
      return storage.getItem(key);
    } catch (err) {
      return null;
    }
  }

  function currentConsentPolicy() {
    try {
      var manager = window.consentPolicyManager;
      var current = manager && typeof manager.getCurrentConsentPolicy === 'function'
        ? manager.getCurrentConsentPolicy()
        : null;
      current = current && (current.policy || current);
      if (current && Object.keys(current).length) return current;
    } catch (err) {}
    try {
      var match = document.cookie.match(/(?:^|;\s*)consent-policy=([^;]+)/);
      return match ? JSON.parse(decodeURIComponent(match[1])) : {};
    } catch (err) {
      return {};
    }
  }

  function analyticsAllowed() {
    var policy = currentConsentPolicy();
    return policy.analytics === true || policy.anl === true || policy.anl === 1;
  }

  function randomId(prefix) {
    try {
      if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
        var values = new Uint32Array(4);
        window.crypto.getRandomValues(values);
        return prefix + '_' + Array.prototype.map.call(values, function (value) {
          return value.toString(16).padStart(8, '0');
        }).join('');
      }
    } catch (err) {}
    return prefix + '_' + Math.random().toString(36).slice(2) + '_' + Date.now().toString(36);
  }

  function safeIdentifier(value) {
    value = String(value || '').trim();
    if (!value || value.length > 140 || !/^[A-Za-z0-9._:-]+$/.test(value)) return '';
    return value;
  }

  function decodedPathSegment(value) {
    var result = String(value || '');
    for (var attempt = 0; attempt < 2; attempt += 1) {
      try {
        var next = decodeURIComponent(result);
        if (next === result) break;
        result = next;
      } catch (err) {
        break;
      }
    }
    return result;
  }

  function pathSegmentLooksSensitive(segment) {
    var value = decodedPathSegment(segment).trim();
    if (!value) return false;
    if (/\b[^\s/@]+@[^\s/@]+\.[^\s/@]+\b/i.test(value)) return true;
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) return true;
    if (/^\+?[0-9][0-9().\s-]{7,}$/.test(value)) return true;
    if (/^[A-Za-z0-9_]{28,}$/.test(value) && /[A-Za-z]/.test(value) && /[0-9]/.test(value)) return true;
    return false;
  }

  function safePath(value) {
    var raw = String(value || '').trim();
    if (!raw || /mailto:|[<>\\]/i.test(raw)) return '';
    try {
      var parsed = new URL(raw, window.location.origin);
      var pathname = String(parsed.pathname || '/');
      if (!pathname || pathname.length > 400 || /[<>\\]/i.test(pathname)) return '';
      return pathname
        .split('/')
        .map(function (segment) { return pathSegmentLooksSensitive(segment) ? '[redacted]' : segment; })
        .join('/')
        .replace(/\/{2,}/g, '/');
    } catch (err) {
      return '';
    }
  }

  function safeAttributionValue(value, maxLength) {
    value = String(value || '').trim();
    maxLength = maxLength || 220;
    if (!value || value.length > maxLength) return '';
    if (/@|%40|:\/\/|mailto:|[<>\\/]/i.test(value)) return '';
    if (!/^[A-Za-z0-9][A-Za-z0-9._~:+ -]*$/.test(value)) return '';
    return value;
  }

  function readJSON(storage, key) {
    try {
      var raw = storage.getItem(key);
      var parsed = raw ? JSON.parse(raw) : null;
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch (err) {
      return {};
    }
  }

  function getOrCreateId(storage, key, prefix) {
    try {
      var existing = safeIdentifier(storage.getItem(key));
      if (existing) return existing;
      var value = randomId(prefix);
      storage.setItem(key, value);
      return value;
    } catch (err) {
      return randomId(prefix);
    }
  }

  function emptyAttribution() {
    return {
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
      utm_content: '',
      utm_term: '',
      utm_id: '',
      fbclid: '',
      fbc: '',
      fbp: '',
      gclid: '',
      gbraid: '',
      wbraid: ''
    };
  }

  function sanitizeAttribution(source) {
    var clean = emptyAttribution();
    source = source || {};
    ATTRIBUTION_KEYS.forEach(function (key) {
      var maxLength = /clid$|^(fbc|fbp|gclid|gbraid|wbraid)$/.test(key) ? 260 : 220;
      clean[key] = safeAttributionValue(source[key], maxLength);
    });
    return clean;
  }

  function currentAttribution() {
    var values = {};
    try {
      var params = new URLSearchParams(window.location.search || '');
      ATTRIBUTION_KEYS.forEach(function (key) {
        values[key] = params.get(key) || '';
      });
    } catch (err) {}
    return sanitizeAttribution(values);
  }

  function storedAttribution(tracking) {
    tracking = tracking || {};
    var values = {};
    ATTRIBUTION_KEYS.forEach(function (key) {
      values[key] = tracking[key] || '';
    });
    return sanitizeAttribution(values);
  }

  function isPaidAttribution(values) {
    values = values || {};
    if (values.fbclid || values.fbc || values.gclid || values.gbraid || values.wbraid) return true;
    var source = String(values.utm_source || '').toLowerCase();
    var medium = String(values.utm_medium || '').toLowerCase();
    var campaign = String(values.utm_campaign || '').toLowerCase();
    if (/^(cpc|ppc|paid|paid_search|paid_social|display|retargeting)$/.test(medium)) return true;
    if (/\b(cpc|ppc|paid_search|paid_social|retargeting)\b/.test(medium + ' ' + campaign)) return true;
    if (/^(meta|facebook|instagram|fb|ig)$/.test(source) && /\b(paid|ads?)\b/.test(medium + ' ' + campaign)) return true;
    if (source === 'google' && /\b(cpc|ppc|paid|paid_search|display)\b/.test(medium + ' ' + campaign)) return true;
    return false;
  }

  function fallbackAttribution() {
    var fallback = emptyAttribution();
    fallback.utm_source = 'berlinwalk';
    fallback.utm_medium = 'exit_popup';
    fallback.utm_campaign = 'organic_booking';
    fallback.utm_content = isPreviewForced() ? 'exit_popup_qa' : 'exit_popup';
    return { values: fallback, mode: 'exit_default' };
  }

  function resolveAttribution(tracking) {
    var current = currentAttribution();
    if (isPaidAttribution(current)) return { values: current, mode: 'current_paid' };

    var stored = storedAttribution(tracking);
    var storedHasEvidence = ATTRIBUTION_KEYS.some(function (key) { return Boolean(stored[key]); });
    var storedPaidFlag = tracking && (tracking.isPaid === true || tracking.isPaid === 'true');
    if (isPaidAttribution(stored) || (storedHasEvidence && storedPaidFlag)) {
      return { values: stored, mode: 'stored_paid' };
    }

    return fallbackAttribution();
  }

  function attributionForLink() {
    var current = currentAttribution();
    if (isPaidAttribution(current)) return { values: current, mode: 'current_paid' };

    if (analyticsAllowed()) {
      return resolveAttribution(readJSON(window.localStorage, PAID_TRACKING_KEY));
    }

    return fallbackAttribution();
  }

  function bookingDestination() {
    var destination = new URL(BOOKING_URL, window.location.origin);
    var attribution = attributionForLink();
    ATTRIBUTION_KEYS.forEach(function (key) {
      if (attribution.values[key]) destination.searchParams.set(key, attribution.values[key]);
    });
    return { href: destination.toString(), attributionMode: attribution.mode };
  }

  function measurementState() {
    if (!analyticsAllowed()) return null;
    var tracking = readJSON(window.localStorage, PAID_TRACKING_KEY);
    var attribution = resolveAttribution(tracking);
    var visitorId = safeIdentifier(safeStorageGet(window.localStorage, VISITOR_KEY)) || safeIdentifier(tracking.visitorId);
    var sessionId = safeIdentifier(safeStorageGet(window.sessionStorage, ANALYTICS_SESSION_KEY));
    if (!visitorId) visitorId = getOrCreateId(window.localStorage, VISITOR_KEY, 'bw_v');
    if (!sessionId) sessionId = getOrCreateId(window.sessionStorage, ANALYTICS_SESSION_KEY, 'bw_s');
    return {
      visitorId: visitorId,
      sessionId: sessionId,
      tracking: tracking,
      attribution: attribution,
      isPaid: attribution.mode === 'stored_paid' || isPaidAttribution(attribution.values)
    };
  }

  function isExcludedPage() {
    var path = window.location.pathname.toLowerCase();
    return path.indexOf('/tools/') === 0 ||
      path.indexOf('/products/') === 0 ||
      path.indexOf('/book-berlin-walking-tour') === 0 ||
      path.indexOf('/free-berlin-walking-tour') === 0 ||
      path.indexOf('/berlin-trip-planner') === 0 ||
      path.indexOf('/thank-you') !== -1 ||
      path.indexOf('/thank_you') !== -1 ||
      path.indexOf('/booking-confirmation') !== -1 ||
      path.indexOf('/bookings-confirmation') !== -1;
  }

  function isDesktop() {
    return isPreviewForced() || window.innerWidth >= DESKTOP_MIN_WIDTH;
  }

  function shouldRun() {
    var alreadyShown = analyticsAllowed() ? safeSessionGet(SESSION_KEY) : null;
    return isDesktop() && !isExcludedPage() && !alreadyShown;
  }

  function ensureNextTourSlotHelper() {
    if (typeof window.bwNextTourSlot === 'function') return;
    if (nextTourSlotRequested) return;
    nextTourSlotRequested = true;
    var script = document.createElement('script');
    script.src = NEXT_TOUR_SLOT_URL;
    script.async = true;
    document.head.appendChild(script);
  }

  function eventStorageKey(name) {
    return EVENT_SENT_PREFIX + name;
  }

  function eventAlreadySent(name) {
    return Boolean(sentEvents[name] || safeSessionGet(eventStorageKey(name)) === '1');
  }

  function markEventSent(name) {
    sentEvents[name] = true;
    safeSessionSet(eventStorageKey(name), '1');
  }

  function endpointPayload(name, detail, state) {
    var values = state.attribution.values;
    var pagePath = safePath(window.location.pathname) || '/';
    var firstPage = safePath(state.tracking.firstPage) || pagePath;
    var landingPage = safePath(state.tracking.landingPage) || firstPage;
    var now = new Date();
    return {
      eventName: name,
      eventId: randomId('bw_e'),
      consentGranted: true,
      analyticsConsent: true,
      consent: { analytics: true },
      timestamp: now.toISOString(),
      eventDate: now.toISOString().slice(0, 10),
      sessionId: state.sessionId,
      visitorId: state.visitorId,
      isPaid: state.isPaid,
      pagePath: pagePath,
      referrer: '',
      landingPage: landingPage,
      firstPage: firstPage,
      utmSource: values.utm_source,
      utmMedium: values.utm_medium,
      utmCampaign: values.utm_campaign,
      utmContent: values.utm_content,
      utmTerm: values.utm_term,
      utmId: values.utm_id,
      fbclid: values.fbclid,
      fbc: values.fbc,
      fbp: values.fbp,
      gclid: values.gclid,
      gbraid: values.gbraid,
      wbraid: values.wbraid,
      screenWidth: String(window.screen && window.screen.width || ''),
      viewportWidth: String(window.innerWidth || ''),
      payload: {
        popupStep: currentStep,
        triggerType: safeAttributionValue(detail.triggerType, 40),
        closeReason: safeAttributionValue(detail.closeReason, 40),
        ctaPath: safePath(detail.ctaPath),
        previewMode: isPreviewForced(),
        qa: isPreviewForced(),
        attributionMode: state.attribution.mode
      }
    };
  }

  function sendFirstParty(body) {
    var serialized = JSON.stringify(body);

    function beaconFallback() {
      try {
        if (navigator.sendBeacon) {
          navigator.sendBeacon(TRACK_ENDPOINT, new Blob([serialized], { type: 'application/json' }));
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
          body: serialized
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

  function trackEvent(name, detail) {
    if (!analyticsAllowed() || eventAlreadySent(name)) return false;
    var state = measurementState();
    if (!state) return false;
    detail = detail || {};

    markEventSent(name);
    var data = {
      event_category: 'exit_intent_popup',
      page_path: safePath(window.location.pathname) || '/',
      popup_step: currentStep,
      trigger_type: safeAttributionValue(detail.triggerType, 40),
      close_reason: safeAttributionValue(detail.closeReason, 40),
      cta_path: safePath(detail.ctaPath),
      preview_mode: isPreviewForced(),
      qa: isPreviewForced(),
      attribution_mode: state.attribution.mode
    };

    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({ event: name }, data));
    } catch (err) {}
    try {
      if (typeof window.gtag === 'function') window.gtag('event', name, data);
    } catch (err) {}
    sendFirstParty(endpointPayload(name, detail, state));
    return true;
  }

  function berlinParts(date) {
    var map = {};
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Berlin',
      weekday: 'short',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(date).forEach(function (part) {
      if (part.type !== 'literal') map[part.type] = part.value;
    });
    return {
      dateKey: map.year + '-' + map.month + '-' + map.day,
      month: Number(map.month),
      day: Number(map.day),
      weekdayShort: map.weekday,
      weekdayLabel: new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Berlin', weekday: 'long' }).format(date),
      hour: Number(map.hour),
      minute: Number(map.minute),
    };
  }

  function isDoubleSlotDay(parts) {
    var key = (parts.month * 100) + parts.day;
    return key >= DOUBLE_SLOT_START_MONTH_DAY && key <= DOUBLE_SLOT_END_MONTH_DAY;
  }

  function startLabelsForDay(parts) {
    return isDoubleSlotDay(parts) ? SUMMER_START_LABELS.slice() : DEFAULT_START_LABELS.slice();
  }

  function minutesForLabel(label) {
    var parts = String(label || '').split(':');
    return (Number(parts[0]) * 60) + Number(parts[1]);
  }

  function bookableStartLabels(targetParts, todayParts) {
    var labels = startLabelsForDay(targetParts);
    if (!todayParts || targetParts.dateKey !== todayParts.dateKey) return labels;
    var nowMinutes = (todayParts.hour * 60) + todayParts.minute;
    return labels.filter(function (label) {
      return nowMinutes < (minutesForLabel(label) - SAME_DAY_CUTOFF_LEAD_MINUTES);
    });
  }

  function slotsLabelFor(labels) {
    if (!labels.length) return '';
    if (labels.length === 1) return labels[0];
    return labels[0] + ' and ' + labels[1];
  }

  function nextTourLine() {
    try {
      if (typeof window.bwNextTourSlot === 'function') {
        var slot = window.bwNextTourSlot();
        if (slot && slot.relativeLabel && slot.slotsLabel) {
          return 'Next walk' + (slot.slotCount > 1 ? 's' : '') + ': ' + slot.relativeLabel + ' at ' + slot.slotsLabel + '. Free, tip-based.';
        }
      }
      var now = new Date();
      var today = berlinParts(now);
      var tomorrow = berlinParts(new Date(now.getTime() + DAY_MS));
      var target = null;
      var labels = [];

      if (TOUR_DAYS[today.weekdayShort]) {
        labels = bookableStartLabels(today, today);
      }
      if (labels.length) {
        target = today;
      } else {
        for (var offset = 1; offset <= 8; offset += 1) {
          var candidate = berlinParts(new Date(now.getTime() + (offset * DAY_MS)));
          if (TOUR_DAYS[candidate.weekdayShort]) {
            target = candidate;
            labels = bookableStartLabels(candidate, today);
            break;
          }
        }
      }

      var slotsLabel = slotsLabelFor(labels);
      if (!target || !slotsLabel) return '';
      var relativeLabel = target.weekdayLabel;
      if (target.dateKey === today.dateKey) relativeLabel = 'Today (' + target.weekdayShort + ')';
      else if (target.dateKey === tomorrow.dateKey) relativeLabel = 'Tomorrow (' + target.weekdayShort + ')';
      return 'Next walk' + (labels.length > 1 ? 's' : '') + ': ' + relativeLabel + ' at ' + slotsLabel + '. Free, tip-based.';
    } catch (err) {
      return '';
    }
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700;800;900&display=swap");',
      '.bw-exit-lock{overflow:hidden!important;}',
      '.bw-exit-overlay{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:28px;background:rgba(9,18,10,.62);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);font-family:Montserrat,Arial,sans-serif;color:#FAFAF5;opacity:0;pointer-events:none;transition:opacity .22s ease;}',
      '.bw-exit-overlay.bw-exit-visible{opacity:1;pointer-events:auto;}',
      '.bw-exit-card{position:relative;width:min(560px,100%);border-radius:8px;border:1px solid rgba(255,230,0,.24);background:rgba(27,94,32,.96);box-shadow:0 30px 80px rgba(0,0,0,.42);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);overflow:hidden;transform:translateY(14px) scale(.98);transition:transform .22s ease;}',
      '.bw-exit-overlay.bw-exit-visible .bw-exit-card{transform:translateY(0) scale(1);}',
      '.bw-exit-card:before{content:"";position:absolute;inset:0 0 auto;height:5px;background:linear-gradient(90deg,#FFE600,#7CB342,#FAFAF5);}',
      '.bw-exit-media{position:relative;aspect-ratio:16/7;min-height:210px;overflow:hidden;background:#123d16;}',
      '.bw-exit-media img{width:100%;height:100%;display:block;object-fit:cover;}',
      '.bw-exit-media:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,20,9,0) 28%,rgba(8,20,9,.42) 100%);}',
      '.bw-exit-badge{position:absolute;left:22px;bottom:18px;z-index:2;max-width:calc(100% - 44px);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;border-radius:999px;background:rgba(27,94,32,.88);color:#FFE600;border:1px solid rgba(255,230,0,.32);padding:8px 12px;font-size:11px;font-weight:900;letter-spacing:1.3px;text-transform:uppercase;box-shadow:0 10px 24px rgba(0,0,0,.24);}',
      '.bw-exit-inner{position:relative;padding:28px 38px 34px;text-align:left;}',
      '.bw-exit-close{position:absolute;top:14px;right:14px;width:36px;height:36px;border:0;border-radius:50%;background:rgba(250,250,245,.1);color:#FAFAF5;font:800 24px/1 Arial,sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;transition:background-color .18s ease,transform .18s ease;}',
      '.bw-exit-close:hover,.bw-exit-close:focus-visible{background:rgba(250,250,245,.18);transform:rotate(90deg);outline:2px solid rgba(255,230,0,.7);outline-offset:2px;}',
      '.bw-exit-step{display:none;}',
      '.bw-exit-step.bw-exit-active{display:block;animation:bwExitIn .18s ease both;}',
      '@keyframes bwExitIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}',
      '.bw-exit-kicker{margin:0 0 12px;color:#FFE600;font-size:11px;font-weight:900;letter-spacing:2.1px;text-transform:uppercase;}',
      '.bw-exit-title{margin:0 44px 12px 0;color:#FFFFFF;font-size:34px;line-height:1.05;font-weight:900;letter-spacing:0;}',
      '.bw-exit-next{margin:0 0 14px;color:#C5E1A5;font-size:14px;font-weight:800;line-height:1.4;}',
      '.bw-exit-copy{margin:0 0 24px;color:#FAFAF5;font-size:15px;line-height:1.55;font-weight:500;max-width:39em;}',
      '.bw-exit-actions{display:grid;gap:12px;}',
      '.bw-exit-primary{font-family:Montserrat,Arial,sans-serif;cursor:pointer;text-decoration:none;}',
      '.bw-exit-primary{border:0;border-radius:8px;background:#FFE600;color:#1B5E20;font-size:15px;font-weight:900;line-height:1.2;text-align:center;padding:16px 20px;box-shadow:0 10px 24px rgba(255,230,0,.18);transition:transform .18s ease,box-shadow .18s ease,background-color .18s ease;}',
      '.bw-exit-primary:hover,.bw-exit-primary:focus-visible{background:#fff066;transform:translateY(-1px);box-shadow:0 14px 28px rgba(255,230,0,.26);outline:0;}',
      '@media (prefers-reduced-motion:reduce){.bw-exit-overlay,.bw-exit-card,.bw-exit-step,.bw-exit-close,.bw-exit-primary{transition:none!important;animation:none!important;}}'
    ].join('');
    document.head.appendChild(style);
  }

  function closePopup(reason) {
    var overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) return;

    if (!closeTracked) {
      closeTracked = true;
      trackEvent('bw_exit_popup_close', { closeReason: reason || 'unknown' });
    }

    overlay.classList.remove('bw-exit-visible');
    document.documentElement.classList.remove('bw-exit-lock');
    document.body.classList.remove('bw-exit-lock');
    document.removeEventListener('keydown', handleKeydown);
    setTimeout(function () {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, 240);
  }

  function handleKeydown(event) {
    if (event.key === 'Escape') {
      closePopup('escape');
    }
    if (event.key === 'Tab') {
      trapFocus(event);
    }
  }

  function trapFocus(event) {
    var overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) return;

    var focusable = overlay.querySelectorAll('.bw-exit-close,.bw-exit-step.bw-exit-active a[href],.bw-exit-step.bw-exit-active button:not([disabled])');
    if (!focusable.length) return;

    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function renderPopup() {
    injectStyles();
    var nextLine = nextTourLine();
    var booking = bookingDestination();

    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    overlay.className = 'bw-exit-overlay';
    overlay.innerHTML = [
      '<div class="bw-exit-card" role="dialog" aria-modal="true" aria-labelledby="bw-exit-title">',
      '<button class="bw-exit-close" type="button" aria-label="Close" data-bw-exit-close>&times;</button>',
      '<div class="bw-exit-media">',
        '<img src="' + HERO_IMAGE_URL + '" alt="Berlin Cathedral illustration" width="720" height="404">',
        '<span class="bw-exit-badge">Berlin Walking Tour</span>',
      '</div>',
      '<div class="bw-exit-inner">',
      '<section class="bw-exit-step bw-exit-active" data-bw-exit-step="1">',
      '<p class="bw-exit-kicker">Free, tip-based</p>',
      '<h2 class="bw-exit-title" id="bw-exit-title">Before you leave, book your Berlin walk.</h2>',
      (nextLine ? '<p class="bw-exit-next">' + nextLine + '</p>' : ''),
      '<p class="bw-exit-copy">Yusuf here! If you want the city to make sense early in your trip, reserve a free spot on my Berlin walk. No upfront payment, tip-based at the end, about 2 hours.</p>',
      '<div class="bw-exit-actions">',
      '<a class="bw-exit-primary" href="' + booking.href + '" data-bw-exit-book data-bw-exit-attribution="' + booking.attributionMode + '">Book Walking Tour</a>',
      '</div>',
      '</section>',
      '</div>',
      '</div>'
    ].join('');

    document.body.appendChild(overlay);
    bindPopupEvents(overlay);
    document.documentElement.classList.add('bw-exit-lock');
    document.body.classList.add('bw-exit-lock');
    window.requestAnimationFrame(function () {
      overlay.classList.add('bw-exit-visible');
      var closeButton = overlay.querySelector('[data-bw-exit-close]');
      if (closeButton) closeButton.focus();
    });
  }

  function bindPopupEvents(overlay) {
    var closeButton = overlay.querySelector('[data-bw-exit-close]');
    var bookButton = overlay.querySelector('[data-bw-exit-book]');

    closeButton.addEventListener('click', function () {
      closePopup('x_button');
    });
    bookButton.addEventListener('click', function () {
      trackEvent('bw_exit_popup_book_click', { ctaPath: safePath(BOOKING_URL) });
      closePopup('book_click');
    });
    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) closePopup('overlay_click');
    });

    document.addEventListener('keydown', handleKeydown);
  }

  function showPopup() {
    if (!dwellReady || popupShown || !shouldRun() || document.getElementById(OVERLAY_ID)) return;

    popupShown = true;
    closeTracked = false;
    if (analyticsAllowed()) safeSessionSet(SESSION_KEY, String(Date.now()));
    renderPopup();
    trackEvent('bw_exit_popup_view', { triggerType: isPreviewForced() ? 'preview' : 'exit_intent' });
  }

  function flushVisiblePopupView() {
    if (!analyticsAllowed()) return;
    var overlay = document.getElementById(OVERLAY_ID);
    if (!popupShown || !overlay || !overlay.classList.contains('bw-exit-visible')) return;
    safeSessionSet(SESSION_KEY, String(Date.now()));
    trackEvent('bw_exit_popup_view', { triggerType: isPreviewForced() ? 'preview' : 'exit_intent' });
  }

  function installConsentListeners() {
    function clearAnalyticsState() {
      sentEvents = {};
      safeStorageRemove(window.localStorage, VISITOR_KEY);
      safeStorageRemove(window.localStorage, PAID_TRACKING_KEY);
      safeStorageRemove(window.sessionStorage, ANALYTICS_SESSION_KEY);
      safeStorageRemove(window.sessionStorage, SESSION_KEY);
      ['bw_exit_popup_view', 'bw_exit_popup_close', 'bw_exit_popup_book_click'].forEach(function (name) {
        safeStorageRemove(window.sessionStorage, eventStorageKey(name));
      });
    }

    function handleConsentUpdate() {
      if (!analyticsAllowed()) {
        clearAnalyticsState();
        return;
      }
      flushVisiblePopupView();
      window.setTimeout(flushVisiblePopupView, 50);
      window.setTimeout(flushVisiblePopupView, 250);
    }
    ['consentPolicyChanged', 'consentPolicyInitialized', 'ucConsentEvent'].forEach(function (name) {
      window.addEventListener(name, handleConsentUpdate);
      document.addEventListener(name, handleConsentUpdate);
    });
  }

  function handleMouseLeave(event) {
    if (event.clientY <= 0 || event.clientY < 20) showPopup();
  }

  function handleMouseOut(event) {
    if (!event.relatedTarget && event.clientY < 20) showPopup();
  }

  function boot() {
    installConsentListeners();
    ensureNextTourSlotHelper();
    window.setTimeout(function () {
      dwellReady = true;
      if (isPreviewForced()) showPopup();
    }, DWELL_TIME_MS);

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseout', handleMouseOut);
  }

  if (window.BW_EXIT_POPUP_TEST_HOOKS === true) {
    window.__bwExitPopupTestHooks = {
      analyticsAllowed: analyticsAllowed,
      attributionForLink: attributionForLink,
      bookingDestination: bookingDestination,
      measurementState: measurementState,
      safeAttributionValue: safeAttributionValue,
      safePath: safePath,
      trackEvent: trackEvent
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
