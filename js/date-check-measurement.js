/* Consent-gated, first-party measurement for the inline Berlin Date Check card. */
(function () {
  'use strict';
  if (window.BWDateCheckMeasurement) return;
  var ENDPOINT = 'https://app.berlinwalk.com/api/download-lead?action=event';
  var EXPERIMENT = 'berlin_date_check_blog_card_ab_v2_2026_09';
  var VERSION = 'date-check-direct-v2-2026-10-05';
  var CONSENT_EVENTS = ['consentPolicyChanged', 'consentPolicyInitialized', 'ucConsentEvent', 'bwConsentPolicyChanged'];
  var ERROR_CODES = ['network', 'http', 'validation', 'unavailable'];
  var bindings = new WeakMap();
  // Wix may replace a card's DOM node while the same article is still open.
  // Keep the logical event receipts in page memory, without retaining DOM nodes.
  var logicalCards = new Map();
  var pageJourneys = new Map();

  function token(value, fallback) {
    return typeof value === 'string' && /^[a-z0-9][a-z0-9._-]{0,99}$/i.test(value) ? value : fallback;
  }

  function randomToken(prefix) {
    // Do not manufacture persistent identifiers or fall back to non-cryptographic IDs.
    if (!window.crypto || typeof window.crypto.getRandomValues !== 'function') return '';
    var bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    return prefix + Array.prototype.map.call(bytes, function (n) { return n.toString(16).padStart(2, '0'); }).join('');
  }

  function policy() {
    try {
      var manager = window.consentPolicyManager;
      var current = manager && typeof manager.getCurrentConsentPolicy === 'function' ? manager.getCurrentConsentPolicy() : null;
      if (!current || typeof current !== 'object') return {};
      if (current.defaultPolicy === true) {
        var config = window.wixTagManager && typeof window.wixTagManager.getConfig === 'function' ? window.wixTagManager.getConfig() : null;
        if (!config || config.gdprEnforcedGeo !== false) return {};
      }
      return current.policy && typeof current.policy === 'object' ? current.policy : current;
    } catch (error) { return {}; }
  }

  function granted(value) { return value === true || value === 1 || value === '1' || value === 'true'; }
  function consent(kind) {
    var current = policy();
    return granted(current[kind] !== undefined ? current[kind] : current[kind === 'analytics' ? 'anl' : 'adv']);
  }

  function safePath(value) {
    return typeof value === 'string' && /^\/[A-Za-z0-9/_-]*$/.test(value) && value.length <= 300 ? value : '/';
  }

  function safeDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return '';
    var parts = value.split('-').map(Number);
    var date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    return date.getUTCFullYear() === parts[0] && date.getUTCMonth() === parts[1] - 1 && date.getUTCDate() === parts[2] ? value : '';
  }

  function calendarDaysUntil(value) {
    try {
      var parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
      var today = {};
      parts.forEach(function (part) { today[part.type] = part.value; });
      return Math.round((Date.parse(value + 'T00:00:00Z') - Date.parse(today.year + '-' + today.month + '-' + today.day + 'T00:00:00Z')) / 86400000);
    } catch (error) { return undefined; }
  }

  function bind(card, options) {
    if (!card || typeof card.addEventListener !== 'function') return null;
    if (bindings.has(card)) return bindings.get(card);
    options = options || {};
    var source = options.sourceSlug === undefined ? safePath(window.location.pathname).split('/').filter(Boolean).pop() || '' : String(options.sourceSlug);
    if (!/^[a-z0-9](?:[a-z0-9-]{0,118}[a-z0-9])?$/.test(source)) return null;
    var variant = options.variant === 'form' ? 'form' : 'direct_email';
    var placement = variant === 'form' ? 'blog_inline_after_tour' : 'blog_inline_direct_email';
    var version = token(options.version, variant === 'form' ? 'date-check-measurement-v1-2026-10-05' : VERSION);
    var pagePath = safePath(window.location.pathname);
    var logicalKey = JSON.stringify([pagePath, source, version, variant, options.qa === true]);
    if (!logicalCards.has(logicalKey)) logicalCards.set(logicalKey, { sent: {}, requests: {}, started: false });
    var logical = logicalCards.get(logicalKey);
    var sent = logical.sent;
    var requests = logical.requests;
    var visible = false;
    var disposed = false;
    var wasConnected = false;
    var timer = null;
    var observer = null;
    var attempt = null;

    function cancelTimer() {
      if (timer !== null) window.clearTimeout(timer);
      timer = null;
    }

    function liveCard() {
      if (disposed) return false;
      if (safePath(window.location.pathname) !== pagePath) { dispose(); return false; }
      if (card.isConnected === false) {
        // bind() can run while the form is being built, just before insertion.
        if (wasConnected) dispose();
        return false;
      }
      wasConnected = true;
      return true;
    }

    function journey() {
      var id = pageJourneys.get(pagePath);
      if (!id) {
        id = randomToken('dcj_');
        if (id) pageJourneys.set(pagePath, id);
      }
      return id;
    }

    function analyticsContext() {
      if (!liveCard() || !consent('analytics')) return { analyticsConsentAtSubmit: false, advertisingConsentAtSubmit: false, advertisingConsent: false };
      var pageJourney = journey();
      if (!pageJourney) return { analyticsConsentAtSubmit: false, advertisingConsentAtSubmit: false, advertisingConsent: false };
      var advertising = consent('advertising');
      return {
        analyticsConsentAtSubmit: true,
        advertisingConsentAtSubmit: advertising,
        advertisingConsent: advertising,
        journeyId: pageJourney,
        attributionClass: 'blog',
        entryPoint: 'blog_card',
        cardExperiment: EXPERIMENT,
        cardVariant: 'form',
        cardSourceSlug: source,
        sourceSlug: source,
        pagePath: pagePath,
        experiment: version,
        variant: variant,
        placement: placement
      };
    }

    function payload(stage, data, requestId) {
      var pageJourney = journey();
      var id = randomToken('dcbe_');
      if (!id || !pageJourney) return null;
      var event = {
        eventId: id,
        eventName: 'bw_date_check_blog_card_' + stage,
        assetId: 'berlin-date-check',
        analyticsConsent: true,
        advertisingConsent: consent('advertising'),
        journeyId: pageJourney,
        sourceSlug: source,
        pagePath: pagePath,
        entryPoint: 'blog_card',
        cardExperiment: EXPERIMENT,
        cardVariant: 'form',
        cardSourceSlug: source,
        attributionClass: 'blog',
        experiment: version,
        variant: variant,
        version: variant === 'form' ? 1 : 2,
        placement: placement,
        controlType: stage === 'error' ? (ERROR_CODES.indexOf(data && data.code) >= 0 ? data.code : 'unavailable') : stage,
        screenWidth: Math.max(0, Math.min(10000, Number(window.innerWidth) || 0)),
        qa: options.qa === true
      };
      if (requestId) event.requestId = requestId;
      var date = safeDate(data && data.arrivalDate);
      var nights = Number(data && data.nights);
      if (date && Number.isInteger(nights) && nights >= 1 && nights <= 7) {
        event.arrivalDate = date;
        event.nights = nights;
        var until = calendarDaysUntil(date);
        if (Number.isInteger(until) && until >= 0 && until <= 3660) event.daysUntilArrival = until;
      }
      if (event.advertisingConsent) {
        var params = new URLSearchParams(window.location.search || '');
        var utm = {};
        ['source', 'medium', 'campaign', 'content', 'term'].forEach(function (key) {
          var value = params.get('utm_' + key);
          if (typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/.test(value)) utm[key] = value;
        });
        if (Object.keys(utm).length) event.utm = utm;
      }
      return event;
    }

    function transport(entry) {
      if (!liveCard() || !consent('analytics') || entry.inFlight || entry.complete || typeof window.fetch !== 'function') return;
      Promise.resolve().then(function () {
        // A remount may take over a queued receipt before this microtask runs.
        if (!liveCard() || !consent('analytics') || entry.inFlight || entry.complete) return;
        // Re-read advertising consent at each attempt; withdrawal cannot replay a campaign.
        if (!consent('advertising')) { entry.body.advertisingConsent = false; delete entry.body.utm; }
        entry.inFlight = true;
        var result;
        try {
          result = window.fetch(ENDPOINT, {
            method: 'POST', credentials: 'omit', keepalive: true,
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(entry.body)
          });
        } catch (error) { entry.inFlight = false; return; }
        return Promise.resolve(result).then(function (response) {
          entry.complete = Boolean(response && response.ok);
        }).catch(function () {}).then(function () { entry.inFlight = false; });
      });
    }

    function emit(stage, data, key, requestId) {
      if (!liveCard() || !consent('analytics') || sent[key]) return false;
      var body = payload(stage, data, requestId);
      if (!body) return false;
      sent[key] = true;
      var entry = requests[key] = { body: body, inFlight: false, complete: false };
      // Use exactly one Google route. This POST remains the canonical report source.
      var googleFields = { event_id: body.eventId, placement: placement, source_slug: source, experiment: version, variant: variant };
      try {
        if (typeof window.gtag === 'function') window.gtag('event', body.eventName, googleFields);
        else {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push(Object.assign({ event: body.eventName }, googleFields));
        }
      } catch (googleError) {}
      transport(entry);
      return true;
    }

    function start() {
      if (!liveCard()) return false;
      logical.started = true;
      return emit('start', null, 'start');
    }

    function refresh() {
      if (!liveCard()) return;
      cancelTimer();
      if (!consent('analytics')) return;
      emit('mount', null, 'mount');
      if (logical.started) emit('start', null, 'start');
      if (visible && document.visibilityState !== 'hidden' && !sent.seen) {
        timer = window.setTimeout(function () {
          timer = null;
          if (visible && document.visibilityState !== 'hidden') emit('seen', null, 'seen');
        }, 1000);
      }
      Object.keys(requests).forEach(function (key) { transport(requests[key]); });
    }

    function submit(data) {
      // A new conscious attempt gets a new request ID; retries reuse its event ID.
      attempt = liveCard() && consent('analytics') ? { id: randomToken('dcr_'), data: { arrivalDate: data && data.arrivalDate, nights: data && data.nights } } : null;
      if (!attempt || !attempt.id) return null;
      start();
      emit('submit', attempt.data, 'submit:' + attempt.id, attempt.id);
      return attempt.id;
    }

    function accepted(requestId) {
      if (!attempt || (requestId && requestId !== attempt.id)) return false;
      return emit('accepted', attempt.data, 'accepted:' + attempt.id, attempt.id);
    }

    function error(code, requestId) {
      if (!attempt || (requestId && requestId !== attempt.id)) return false;
      return emit('error', { code: code }, 'error:' + attempt.id, attempt.id);
    }

    function dispose() {
      if (disposed) return;
      disposed = true;
      cancelTimer();
      if (observer) observer.disconnect();
      card.removeEventListener('focusin', start);
      card.removeEventListener('input', start);
      CONSENT_EVENTS.forEach(function (name) { window.removeEventListener(name, refresh); document.removeEventListener(name, refresh); });
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('online', refresh);
      bindings.delete(card);
      // Pending logical receipts can be retried by a replacement card, with the same ID.
      requests = {};
      attempt = null;
    }

    card.addEventListener('focusin', start);
    card.addEventListener('input', start);
    CONSENT_EVENTS.forEach(function (name) { window.addEventListener(name, refresh); document.addEventListener(name, refresh); });
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('online', refresh);
    if (typeof window.IntersectionObserver === 'function') {
      observer = new window.IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.target && entry.target !== card) return;
          visible = entry.isIntersecting === true && entry.intersectionRatio >= 0.5;
        });
        refresh();
      }, { threshold: [0, 0.5] });
      observer.observe(card);
    }
    var api = { start: start, submit: submit, accepted: accepted, error: error, analyticsContext: analyticsContext, refresh: refresh, dispose: dispose };
    bindings.set(card, api);
    refresh();
    return api;
  }

  window.BWDateCheckMeasurement = { bind: bind, analyticsAllowed: function () { return consent('analytics'); }, advertisingAllowed: function () { return consent('advertising'); }, version: VERSION };
})();
