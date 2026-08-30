/* tool-event-bridge-host.js — parent/host-page bridge for the
 * interactive-tools platform (Ticket, Address, Hotel, Date Check, Doner,
 * and any later tool). Distributed the same way as embed-resize.js: one
 * external <script> tag on the host page (berlinwalk.com via Wix Custom
 * Code), zero per-widget wiring beyond two data attributes on the iframe:
 *
 *   <iframe data-bw-tool-frame data-bw-tool-slug="berlin-address-time-machine" src="..."></iframe>
 *   <script src="https://fenerszymanski.github.io/berlinwalk-widgets/js/tool-event-bridge-host.js"></script>
 *
 * Responsibilities:
 *  - Verifies every incoming postMessage before trusting it: contract
 *    version match, child-origin rule (see below), event.source identity
 *    against a real tracked iframe on this page, the toolSlug the host
 *    page itself assigned to that iframe, that toolSlug/eventId's shape,
 *    and (defense in depth) that a non-empty actionName is a member of
 *    that specific tool's own closed enum (TOOL_ACTION_ENUMS).
 *  - Child-origin rule: the production GitHub Pages widget origin is
 *    always accepted. A localhost/127.0.0.1 child origin is accepted ONLY
 *    when the HOST PAGE ITSELF is also running on a recognized local-QA
 *    origin -- so a local iframe can be end-to-end tested against a local
 *    parent, but a production parent never accepts a local child, and a
 *    local parent still accepts the real GitHub Pages child too.
 *  - Generates `qualified_view` from real visibility (>=50% of the
 *    iframe, IntersectionObserver) held for a full, UNINTERRUPTED 1s
 *    *while analytics consent is already granted*. If the 1s of
 *    visibility completes before consent is ready, nothing is marked
 *    fired and the observer is NOT disconnected -- a later
 *    `consentPolicyInitialized`/`consentPolicyChanged` signal re-attempts
 *    a fresh 1s dwell from that moment, as long as the iframe is still
 *    visible then. Fires at most once per iframe element, ever.
 *  - Discovers iframes added to the page AFTER initial load (Wix can mount
 *    embeds asynchronously) via MutationObserver, not just a one-shot scan.
 *  - Generates one visitSessionId per page load, held only in a JS
 *    variable (never localStorage/cookie, never written before consent),
 *    and attaches it to every outgoing event, including qualified_view.
 *  - Only calls the backend when Wix's own consent manager reports
 *    analytics consent (window.consentPolicyManager, same check as the
 *    existing berlinwalk-consent-analytics-events.html embed). No consent
 *    -> zero network calls, not just a dropped response.
 *  - On a recognized local-QA host origin, forces qa:true on every
 *    outgoing event (the backend independently requires this and 403s a
 *    local-QA origin that omits it).
 *  - Deduplicates by eventId so a resend (e.g. child retry) is a no-op.
 *
 * This file does not touch berlin-location at all: that is a functional
 * lookup the tool widget can call directly (see
 * BERLIN_LOCATION_ALLOWED_ORIGINS in the content-app backend), independent
 * of analytics consent and independent of this bridge.
 */
(function (root, factory) {
  var api = factory();
  root.BWToolEventHost = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  // Auto-install for real browser usage, same drop-in contract as
  // embed-resize.js. A no-op in Node (no window/document), which is what
  // makes the pure functions below unit-testable via require().
  if (typeof window !== 'undefined' && typeof document !== 'undefined') api.install();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // Must match TOOL_PLATFORM_CONTRACT_VERSION in
  // berlinwalk-content-app/api/_lib/tool-platform-shared.js and
  // CONTRACT_VERSION in tool-event-bridge.js -- a message whose `v` does
  // not match this exact string is rejected, not best-effort accepted.
  var CONTRACT_VERSION = '20260830a';
  var CHILD_SENDABLE_EVENT_NAMES = ['start', 'complete', 'share_success', 'cta_click', 'action'];
  var EVENT_ID_PATTERN = /^bwte_[0-9a-f]{32}$/;
  var TOOL_SLUG_PATTERN = /^[a-z][a-z0-9-]{1,58}[a-z0-9]$/;

  // The real, production widget origin -- always accepted, on any host origin.
  var GITHUB_PAGES_CHILD_ORIGIN = 'https://fenerszymanski.github.io';
  // A local dev server for the widget itself, any port -- accepted ONLY
  // when the host page is also on a recognized local-QA origin (see
  // isAllowedChildOrigin below).
  var LOCAL_CHILD_ORIGIN_PATTERN = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;

  var PRODUCTION_HOST_ORIGINS = ['https://www.berlinwalk.com', 'https://berlinwalk.com'];
  var LOCAL_QA_HOST_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:8765', 'http://127.0.0.1:8765'];
  var DEFAULT_ENDPOINT = 'https://berlinwalk-content-app.vercel.app/api?route=tool-event';
  var QUALIFIED_VIEW_VISIBILITY_RATIO = 0.5;
  var QUALIFIED_VIEW_DWELL_MS = 1000;
  var SEEN_EVENT_ID_CAP = 500;
  var VISIT_SESSION_ID_PREFIX = 'bwts_';

  // Mirrors TOOL_ACTION_ENUMS in berlinwalk-content-app/api/_lib/tool-platform-shared.js
  // and tool-event-bridge.js. Checked here too (defense in depth, same as
  // the eventId/toolSlug shape checks below) -- the server is still the
  // real gate. A shape/regex check is not enough on its own: `Yusuf_Ucuz`,
  // `HotelAdlon`, and `Unter_den_Linden_77` would all pass a
  // letters/digits/underscore pattern while still being a real name, a
  // real hotel, and a real address.
  var TOOL_ACTION_ENUMS = {
    'berlin-ticket-machine-simulator': [
      'practice_selected', 'challenge_selected', 'scenario_started', 'answer_selected',
      'challenge_abandoned', 'replay_selected', 'share_opened',
    ],
    'berlin-address-time-machine': [
      'address_submitted', 'map_pin_selected', 'geolocation_selected', 'address_resolved',
      'layer_1989_selected', 'layer_today_selected', 'result_east', 'result_west',
      'result_near_border', 'result_outside_scope',
    ],
    'berlin-hotel-location-checker': [
      'address_submitted', 'map_pin_selected', 'priority_selected', 'address_resolved',
      'score_calculated', 'vbb_opened', 'article_opened', 'planner_opened', 'tour_opened',
    ],
    'berlin-dates-check': [],
    'berlin-doner-price-index': [
      'region_filter_selected', 'product_filter_selected', 'period_selected',
      'map_opened', 'source_opened',
    ],
  };

  function isNonEmptyString(value) {
    return typeof value === 'string' && value.length > 0;
  }

  function inArray(list, value) {
    for (var i = 0; i < list.length; i += 1) if (list[i] === value) return true;
    return false;
  }

  function isAllowedChildOrigin(childOrigin, hostIsLocalQa) {
    if (childOrigin === GITHUB_PAGES_CHILD_ORIGIN) return true;
    if (hostIsLocalQa && LOCAL_CHILD_ORIGIN_PATTERN.test(childOrigin || '')) return true;
    return false;
  }

  function isAllowedAction(toolSlug, actionName) {
    if (actionName === '') return true;
    var allowed = TOOL_ACTION_ENUMS[toolSlug] || [];
    return inArray(allowed, actionName);
  }

  // Pure validator: is this a genuine, well-shaped, current-contract
  // bw-tool-event message from the exact iframe the host page thinks it
  // is? `context` must be computed by the caller from live browser state
  // (event.origin, whether event.source matches a real tracked iframe's
  // contentWindow, that iframe's own data-bw-tool-slug, and whether the
  // host page itself is on a local-QA origin) -- this function itself
  // makes no DOM calls, so it is directly unit-testable.
  function isValidIncomingMessage(data, context) {
    context = context || {};
    if (!data || typeof data !== 'object') return false;
    if (data.type !== 'bw-tool-event') return false;
    if (data.v !== CONTRACT_VERSION) return false;
    if (!isAllowedChildOrigin(context.origin, !!context.hostIsLocalQa)) return false;
    if (context.sourceMatchesTrackedIframe !== true) return false;
    if (!isNonEmptyString(data.toolSlug) || !TOOL_SLUG_PATTERN.test(data.toolSlug)) return false;
    if (data.toolSlug !== context.expectedToolSlug) return false;
    if (!isNonEmptyString(data.eventName) || !inArray(CHILD_SENDABLE_EVENT_NAMES, data.eventName)) return false;
    if (!isNonEmptyString(data.eventId) || !EVENT_ID_PATTERN.test(data.eventId)) return false;
    var actionName = typeof data.actionName === 'string' ? data.actionName : '';
    if (!isAllowedAction(data.toolSlug, actionName)) return false;
    return true;
  }

  function analyticsConsentGranted(win) {
    try {
      var manager = win.consentPolicyManager;
      var current = manager && typeof manager.getCurrentConsentPolicy === 'function'
        ? manager.getCurrentConsentPolicy()
        : null;
      var policy = (current && (current.policy || current)) || {};
      return policy.analytics === true;
    } catch (e) {
      return false;
    }
  }

  function isLocalQaHostOrigin(origin) {
    return inArray(LOCAL_QA_HOST_ORIGINS, origin);
  }

  function isKnownHostOrigin(origin) {
    return inArray(PRODUCTION_HOST_ORIGINS, origin) || isLocalQaHostOrigin(origin);
  }

  function randomHex(byteCount) {
    var bytes;
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      bytes = new Uint8Array(byteCount);
      crypto.getRandomValues(bytes);
    } else {
      bytes = [];
      for (var i = 0; i < byteCount; i += 1) bytes.push(Math.floor(Math.random() * 256));
    }
    var out = '';
    for (var j = 0; j < bytes.length; j += 1) {
      var h = bytes[j].toString(16);
      out += h.length === 1 ? '0' + h : h;
    }
    return out;
  }

  function generateVisitSessionId() {
    return VISIT_SESSION_ID_PREFIX + randomHex(16);
  }

  function buildOutgoingBody(eventName, toolSlug, opts) {
    opts = opts || {};
    return {
      eventName: eventName,
      toolSlug: toolSlug,
      eventId: opts.eventId || ('bwte_' + randomHex(16)),
      visitSessionId: opts.visitSessionId || '',
      actionName: opts.actionName || '',
      metadata: opts.metadata || {},
      consentGranted: true,
      analyticsConsent: true,
      qa: !!opts.qa,
    };
  }

  function sendEvent(endpoint, body, win) {
    try {
      if (!win.fetch) return;
      win.fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        keepalive: true,
      }).catch(function () {});
    } catch (e) { /* best-effort, never throw into the host page */ }
  }

  // Bounded FIFO membership set: caps memory on a long-lived page without
  // ever forgetting a *recent* eventId, which is the only window a
  // legitimate retry would land in.
  function createSeenEventIdSet(cap) {
    cap = cap || SEEN_EVENT_ID_CAP;
    var order = [];
    var set = Object.create(null);
    return {
      has: function (id) { return !!set[id]; },
      add: function (id) {
        if (set[id]) return;
        set[id] = true;
        order.push(id);
        if (order.length > cap) delete set[order.shift()];
      },
    };
  }

  function install(options) {
    options = options || {};
    var win = options.window || (typeof window !== 'undefined' ? window : null);
    var doc = options.document || (typeof document !== 'undefined' ? document : null);
    if (!win || !doc) return null;
    if (win.__bwToolEventHostInstalled) return win.__bwToolEventHostInstance;
    win.__bwToolEventHostInstalled = true;

    var endpoint = options.endpoint || win.BW_TOOL_EVENT_ENDPOINT || DEFAULT_ENDPOINT;
    var hostOrigin = options.hostOrigin || (win.location && win.location.origin) || '';
    var hostIsLocalQa = isLocalQaHostOrigin(hostOrigin) || !!options.forceLocalQa;
    var forceQa = hostIsLocalQa || !!options.forceQa;
    // One session id per page load. In memory only: never localStorage,
    // never a cookie, never written anywhere before this line runs (which
    // itself does not touch storage), so there is nothing to clear on
    // consent withdrawal beyond letting the page reload.
    var visitSessionId = generateVisitSessionId();

    var seenEventIds = createSeenEventIdSet();
    var qualifiedViewFired = typeof WeakSet !== 'undefined' ? new WeakSet() : null;
    var qualifiedViewFallback = [];
    var watchedIframes = typeof WeakSet !== 'undefined' ? new WeakSet() : null;
    var watchedIframesFallback = [];
    var qualifiedViewRetryHandlers = []; // re-attempted after a consent event

    function alreadyFiredQualifiedView(el) {
      return qualifiedViewFired ? qualifiedViewFired.has(el) : qualifiedViewFallback.indexOf(el) !== -1;
    }
    function markQualifiedViewFired(el) {
      if (qualifiedViewFired) qualifiedViewFired.add(el);
      else qualifiedViewFallback.push(el);
    }
    function alreadyWatching(el) {
      return watchedIframes ? watchedIframes.has(el) : watchedIframesFallback.indexOf(el) !== -1;
    }
    function markWatching(el) {
      if (watchedIframes) watchedIframes.add(el);
      else watchedIframesFallback.push(el);
    }

    function maybeSend(eventName, toolSlug, opts) {
      if (!analyticsConsentGranted(win)) return; // no consent -> zero writes, always
      var withSession = Object.create(null);
      for (var key in opts) if (Object.prototype.hasOwnProperty.call(opts, key)) withSession[key] = opts[key];
      withSession.visitSessionId = visitSessionId;
      withSession.qa = forceQa || !!opts.qa;
      sendEvent(endpoint, buildOutgoingBody(eventName, toolSlug, withSession), win);
    }

    function handleMessage(event) {
      var iframes = doc.querySelectorAll('iframe[data-bw-tool-frame]');
      var matchedIframe = null;
      for (var i = 0; i < iframes.length; i += 1) {
        if (iframes[i].contentWindow === event.source) { matchedIframe = iframes[i]; break; }
      }
      var expectedSlug = matchedIframe ? matchedIframe.getAttribute('data-bw-tool-slug') : null;
      var valid = isValidIncomingMessage(event.data, {
        origin: event.origin,
        sourceMatchesTrackedIframe: !!matchedIframe,
        expectedToolSlug: expectedSlug,
        hostIsLocalQa: hostIsLocalQa,
      });
      if (!valid) return;
      var data = event.data;
      if (seenEventIds.has(data.eventId)) return; // duplicate -> silently ignored, not re-sent
      seenEventIds.add(data.eventId);
      maybeSend(data.eventName, data.toolSlug, {
        eventId: data.eventId,
        actionName: data.actionName,
        metadata: data.metadata,
      });
    }

    // qualified_view is only ever marked fired -- and the observer only
    // ever disconnected -- at the instant it is actually sent. A dwell
    // that completes while consent is not yet granted leaves the observer
    // running; onConsentMaybeChanged() below re-attempts a FRESH 1s dwell
    // (not an immediate fire) once consent becomes available, as long as
    // the iframe is still visible at that moment.
    function watchQualifiedView(iframeEl) {
      if (alreadyWatching(iframeEl)) return; // never attach a second observer to the same iframe
      markWatching(iframeEl);
      var toolSlug = iframeEl.getAttribute('data-bw-tool-slug');
      if (!toolSlug || typeof win.IntersectionObserver === 'undefined') return;

      var dwellTimer = null;
      var isCurrentlyVisible = false;

      function clearDwell() {
        if (dwellTimer) { win.clearTimeout(dwellTimer); dwellTimer = null; }
      }

      function attemptDwell() {
        if (alreadyFiredQualifiedView(iframeEl) || dwellTimer || !isCurrentlyVisible) return;
        dwellTimer = win.setTimeout(function () {
          dwellTimer = null;
          if (alreadyFiredQualifiedView(iframeEl)) return;
          if (!analyticsConsentGranted(win)) return; // dwell satisfied, consent not ready -- wait, do not fire/disconnect
          markQualifiedViewFired(iframeEl);
          maybeSend('qualified_view', toolSlug, { eventId: 'bwte_' + randomHex(16) });
          observer.disconnect();
        }, QUALIFIED_VIEW_DWELL_MS);
      }

      var observer = new win.IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i += 1) {
          var entry = entries[i];
          if (alreadyFiredQualifiedView(iframeEl)) { observer.disconnect(); return; }
          if (entry.isIntersecting && entry.intersectionRatio >= QUALIFIED_VIEW_VISIBILITY_RATIO) {
            isCurrentlyVisible = true;
            attemptDwell();
          } else {
            isCurrentlyVisible = false;
            clearDwell();
          }
        }
      }, { threshold: [0, QUALIFIED_VIEW_VISIBILITY_RATIO] });
      observer.observe(iframeEl);
      qualifiedViewRetryHandlers.push(attemptDwell);
    }

    // A consent decision (initial or changed) can arrive after a visible
    // iframe already completed its 1s dwell with no consent yet. Re-attempt
    // every registered watcher; each one no-ops unless it is currently
    // visible with no dwell already in flight, so this is safe to call at
    // any time.
    function onConsentMaybeChanged() {
      for (var i = 0; i < qualifiedViewRetryHandlers.length; i += 1) qualifiedViewRetryHandlers[i]();
    }

    function scanForToolFrames(root) {
      var scope = root || doc;
      if (scope.matches && scope.matches('iframe[data-bw-tool-frame]')) watchQualifiedView(scope);
      var iframes = scope.querySelectorAll ? scope.querySelectorAll('iframe[data-bw-tool-frame]') : [];
      for (var i = 0; i < iframes.length; i += 1) watchQualifiedView(iframes[i]);
    }

    win.addEventListener('message', handleMessage, false);
    win.addEventListener('consentPolicyInitialized', onConsentMaybeChanged, false);
    win.addEventListener('consentPolicyChanged', onConsentMaybeChanged, false);

    function initialScanAndObserve() {
      scanForToolFrames(doc);
      // Wix (and other page builders) can mount an embed's iframe well
      // after DOMContentLoaded. Without this, a tool added dynamically
      // never gets its qualified_view watcher at all.
      if (typeof win.MutationObserver !== 'undefined' && doc.body) {
        var mutationObserver = new win.MutationObserver(function (mutations) {
          for (var i = 0; i < mutations.length; i += 1) {
            var added = mutations[i].addedNodes || [];
            for (var j = 0; j < added.length; j += 1) {
              var node = added[j];
              if (node.nodeType === 1) scanForToolFrames(node);
            }
          }
        });
        mutationObserver.observe(doc.body, { childList: true, subtree: true });
      }
    }

    if (doc.readyState === 'loading') {
      doc.addEventListener('DOMContentLoaded', initialScanAndObserve);
    } else {
      initialScanAndObserve();
    }

    var instance = {
      handleMessage: handleMessage,
      scanForToolFrames: scanForToolFrames,
      onConsentMaybeChanged: onConsentMaybeChanged,
      endpoint: endpoint,
      visitSessionId: visitSessionId,
      hostIsLocalQa: hostIsLocalQa,
    };
    win.__bwToolEventHostInstance = instance;
    return instance;
  }

  return {
    CONTRACT_VERSION: CONTRACT_VERSION,
    CHILD_SENDABLE_EVENT_NAMES: CHILD_SENDABLE_EVENT_NAMES.slice(),
    GITHUB_PAGES_CHILD_ORIGIN: GITHUB_PAGES_CHILD_ORIGIN,
    PRODUCTION_HOST_ORIGINS: PRODUCTION_HOST_ORIGINS.slice(),
    LOCAL_QA_HOST_ORIGINS: LOCAL_QA_HOST_ORIGINS.slice(),
    DEFAULT_ENDPOINT: DEFAULT_ENDPOINT,
    QUALIFIED_VIEW_VISIBILITY_RATIO: QUALIFIED_VIEW_VISIBILITY_RATIO,
    QUALIFIED_VIEW_DWELL_MS: QUALIFIED_VIEW_DWELL_MS,
    install: install,
    // Exposed for unit tests; the pure functions here have no DOM dependency.
    _internal: {
      isValidIncomingMessage: isValidIncomingMessage,
      isAllowedChildOrigin: isAllowedChildOrigin,
      isAllowedAction: isAllowedAction,
      analyticsConsentGranted: analyticsConsentGranted,
      isLocalQaHostOrigin: isLocalQaHostOrigin,
      isKnownHostOrigin: isKnownHostOrigin,
      buildOutgoingBody: buildOutgoingBody,
      createSeenEventIdSet: createSeenEventIdSet,
      generateVisitSessionId: generateVisitSessionId,
    },
  };
});
