/* BerlinWalk blog engagement pilot. Default-off, analytics-consent-gated. */
(function () {
  'use strict';

  var SCRIPT_URL = (document.currentScript && document.currentScript.src) || 'https://fenerszymanski.github.io/berlinwalk-widgets/js/blog-engagement-pilot.js';
  var BASE_URL = new URL('../', SCRIPT_URL).toString();
  var MANIFEST_URL = BASE_URL + 'experiments/blog-engagement-pilot-v1/manifest.json?v=20260824a';
  var DEFAULT_ENDPOINT = 'https://berlinwalk-content-app.vercel.app/api/blog-engagement';
  var INSTALL_VERSION = '20260824a';
  var INSTALL_KEY = '__bwBlogEngagementPilotInstall';
  var QUICK_SUMMARY_ORIGIN = 'https://fenerszymanski.github.io';
  var QUICK_SUMMARY_PATH = '/berlinwalk-widgets/quick-summary/';
  var STORAGE_KEY = 'bwBlogEngagement.v1';
  var CONSENT_EVENTS = ['consentPolicyChanged', 'consentPolicyInitialized', 'ucConsentEvent', 'bwConsentPolicyChanged'];
  var TEST_MODE = Boolean(window.BW_BLOG_ENGAGEMENT_TEST_HOOKS);
  var installRecord = null;
  var state = {
    manifest: null,
    slug: '',
    spec: null,
    body: null,
    headings: [],
    qsFrame: null,
    qsLoadBound: typeof WeakSet === 'function' ? new WeakSet() : null,
    primaryFrame: null,
    variant: 'control',
    mode: 'off',
    qa: false,
    nonce: '',
    pageViewId: '',
    sent: {},
    observed: typeof WeakSet === 'function' ? new WeakSet() : null,
    visibilityTimers: [],
    qualifiedTimer: null,
    qualifiedRead: null,
    activeSeconds: 0,
    activeTimer: null,
    boundaryTimer: null,
    mutationObserver: null,
    refreshTimer: null,
    pathTimer: null,
    lastLocation: location.pathname + location.search,
    listenersInstalled: false,
    assignmentLocks: {}
  };

  function runtimeEnabled() {
    var config = window.BW_BLOG_ENGAGEMENT_CONFIG;
    return Boolean(config && config.enabled === true);
  }

  function clean(value) {
    return String(value || '').normalize('NFKC').replace(/\s+/g, ' ').trim();
  }

  function currentSlug() {
    return location.pathname.indexOf('/post/') === 0
      ? location.pathname.replace(/^\/post\//, '').replace(/\/+$/, '')
      : '';
  }

  function queryOverride() {
    try {
      var value = new URLSearchParams(location.search || '').get('bwBlogEngagement');
      return value === 'control' || value === 'utility' || value === '0' ? value : '';
    } catch (error) {
      return '';
    }
  }

  function currentConsentPolicy() {
    try {
      var manager = window.consentPolicyManager;
      var current = manager && typeof manager.getCurrentConsentPolicy === 'function'
        ? manager.getCurrentConsentPolicy()
        : null;
      if (current && current.defaultPolicy === true) {
        var config = null;
        try {
          config = window.wixTagManager && typeof window.wixTagManager.getConfig === 'function'
            ? window.wixTagManager.getConfig()
            : null;
        } catch (configError) {}
        if (!config || config.gdprEnforcedGeo !== false) return {};
      }
      var policy = current && (current.policy || current);
      if (policy && typeof policy === 'object') return policy;
    } catch (error) {}
    try {
      var match = document.cookie.match(/(?:^|;\s*)consent-policy=([^;]+)/);
      if (!match) return {};
      var parsed = JSON.parse(decodeURIComponent(match[1]));
      return parsed && (parsed.policy || parsed) || {};
    } catch (error) {
      return {};
    }
  }

  function granted(value) {
    return value === true || value === 1 || value === '1' || value === 'true';
  }

  function analyticsAllowed() {
    var policy = currentConsentPolicy();
    var nested = policy && policy.consent && typeof policy.consent === 'object' ? policy.consent : {};
    var value = policy && (policy.analytics ?? policy.anl ?? policy.analyticsConsent ?? nested.analytics);
    return granted(value);
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
    } catch (error) {}
    var fallback = '';
    for (var i = 0; i < 32; i += 1) fallback += Math.floor(Math.random() * 16).toString(16);
    return prefix + '_' + fallback;
  }

  function claimInstall(host, version) {
    var existing = host && host[INSTALL_KEY];
    if (existing && existing.active === true) {
      return { acquired: false, record: existing };
    }
    var record = {
      active: true,
      version: version,
      assignmentLocks: existing && existing.assignmentLocks && typeof existing.assignmentLocks === 'object'
        ? existing.assignmentLocks
        : {}
    };
    if (host) host[INSTALL_KEY] = record;
    return { acquired: true, record: record };
  }

  function scheduleTimes(manifest) {
    var schedule = manifest && manifest.schedule || {};
    var measurementStart = Date.parse(schedule.measurementStart || '');
    var experimentStart = Date.parse(schedule.experimentStart || '');
    var experimentEnd = Date.parse(schedule.experimentEnd || '');
    if (!Number.isFinite(measurementStart) || !Number.isFinite(experimentStart) || !Number.isFinite(experimentEnd)) return null;
    if (!(measurementStart < experimentStart && experimentStart < experimentEnd)) return null;
    return {
      measurementStart: measurementStart,
      experimentStart: experimentStart,
      experimentEnd: experimentEnd
    };
  }

  function manifestMode(manifest, now, config, override) {
    if (override === '0') return 'off';
    if (override === 'control' || override === 'utility') return 'experiment';
    if (!config || config.enabled !== true) return 'off';
    var time = now instanceof Date ? now.getTime() : new Date(now || Date.now()).getTime();
    var schedule = scheduleTimes(manifest);
    if (!Number.isFinite(time) || !schedule) return 'off';
    if (time >= schedule.measurementStart && time < schedule.experimentStart) return 'measure';
    if (time >= schedule.experimentStart && time < schedule.experimentEnd) return 'experiment';
    return 'off';
  }

  function nextScheduleBoundary(manifest, now) {
    var schedule = scheduleTimes(manifest);
    var time = now instanceof Date ? now.getTime() : new Date(now || Date.now()).getTime();
    if (!schedule || !Number.isFinite(time)) return 0;
    var boundaries = [schedule.measurementStart, schedule.experimentStart, schedule.experimentEnd];
    for (var i = 0; i < boundaries.length; i += 1) {
      if (boundaries[i] > time) return boundaries[i];
    }
    return 0;
  }

  function storedAssignment(manifest, now, storage) {
    try {
      var raw = storage && storage.getItem(STORAGE_KEY);
      var item = raw ? JSON.parse(raw) : null;
      var ttlDays = Number(manifest.assignment && manifest.assignment.ttlDays || 28);
      var assignedAt = item && Date.parse(item.assignedAt || '');
      var age = now.getTime() - assignedAt;
      var fresh = Number.isFinite(assignedAt) && age >= 0 && age < ttlDays * 86400000;
      if (item && fresh && item.experimentId === manifest.experimentId && item.version === manifest.version && (item.variant === 'control' || item.variant === 'utility')) return item.variant;
    } catch (error) {}
    return '';
  }

  function assignmentLockKey(manifest) {
    return String(manifest && manifest.experimentId || '') + ':' + String(manifest && manifest.version || '');
  }

  function lockAssignment(memory, key, variant) {
    if (memory && key && (variant === 'control' || variant === 'utility')) memory[key] = variant;
    return variant;
  }

  function assignVariant(manifest, options) {
    options = options || {};
    var override = options.override || '';
    if (override === 'control' || override === 'utility') return override;
    if (options.mode === 'measure') return 'measure';
    if (options.mode !== 'experiment') return 'control';
    var memory = options.pageMemory && typeof options.pageMemory === 'object' ? options.pageMemory : null;
    var lockKey = assignmentLockKey(manifest);
    if (!options.analytics) return lockAssignment(memory, lockKey, 'control');
    if (memory && (memory[lockKey] === 'control' || memory[lockKey] === 'utility')) return memory[lockKey];
    var now = options.now instanceof Date ? options.now : new Date(options.now || Date.now());
    var storage;
    try {
      storage = options.storage !== undefined ? options.storage : window.localStorage;
    } catch (storageError) {
      storage = null;
    }
    var existing = storedAssignment(manifest, now, storage);
    if (existing) return lockAssignment(memory, lockKey, existing);
    var assignment = manifest && manifest.assignment || {};
    var weight = Number(assignment.utilityWeight);
    var controlWeight = Number(assignment.controlWeight);
    if (!Number.isFinite(weight) || !Number.isFinite(controlWeight) || weight < 0 || weight > 1 || controlWeight < 0 || controlWeight > 1 || Math.abs(weight + controlWeight - 1) > 0.000001) {
      return lockAssignment(memory, lockKey, 'control');
    }
    var randomValue = typeof options.random === 'function' ? options.random() : Math.random();
    var variant = randomValue < weight ? 'utility' : 'control';
    var record = {
      experimentId: manifest.experimentId,
      version: manifest.version,
      variant: variant,
      assignedAt: now.toISOString()
    };
    try {
      if (!storage || typeof storage.setItem !== 'function' || typeof storage.getItem !== 'function') throw new Error('storage unavailable');
      storage.setItem(STORAGE_KEY, JSON.stringify(record));
      var verified = storedAssignment(manifest, now, storage);
      if (verified !== variant) throw new Error('assignment persistence failed');
    } catch (error) {
      try { if (storage && typeof storage.removeItem === 'function') storage.removeItem(STORAGE_KEY); } catch (removeError) {}
      variant = 'control';
    }
    return lockAssignment(memory, lockKey, variant);
  }

  function exactFrame(body, path, requiredQuery) {
    if (!body || !path) return null;
    var matches = Array.prototype.filter.call(body.querySelectorAll('iframe[src]'), function (frame) {
      try {
        var url = new URL(frame.src, location.href);
        if (url.origin !== QUICK_SUMMARY_ORIGIN || url.pathname.replace(/\/+$/, '/') !== path.replace(/\/+$/, '/')) return false;
        var expected = requiredQuery || {};
        return Object.keys(expected).every(function (key) { return url.searchParams.get(key) === String(expected[key]); });
      } catch (error) {
        return false;
      }
    });
    return matches.length === 1 ? matches[0] : null;
  }

  function eligibleContext(manifest, sourceSlug, doc) {
    var spec = manifest && manifest.slugs && manifest.slugs[sourceSlug];
    if (!doc || !doc.documentElement || doc.documentElement.getAttribute('data-bw-redesign') !== '1') return null;
    if (!spec || !Array.isArray(spec.sections) || spec.sections.length !== 4) return null;
    if (spec.primaryKind !== 'utility_iframe' && spec.primaryKind !== 'commercial_cta_iframe') return null;
    var body = doc.querySelector('[data-hook="post-description"], [data-hook="post-content"], [data-hook="rich-content-viewer"], [data-hook="rich-content"], .blog-post-page-content');
    if (!body || typeof body.getAttribute !== 'function' || body.getAttribute('data-bw-blog-post-body') !== '1') return null;
    var articleHeadings = Array.prototype.filter.call(body.querySelectorAll('h2'), function (node) {
      return !node.closest('[data-bw-redesign-end], [data-bw-leadform], [data-bw-tourcta], [data-bw-date-check-card], [data-bw-blog-booking]');
    });
    var headings = spec.sections.map(function (label) {
      var matches = articleHeadings.filter(function (node) { return clean(node.textContent) === clean(label); });
      return matches.length === 1 ? matches[0] : null;
    });
    if (headings.some(function (node) { return !node; }) || new Set(headings).size !== 4) return null;
    if (headings.some(function (node) { return !node.id || doc.getElementById(node.id) !== node; })) return null;
    if (!spec.quickSummaryPost || typeof spec.quickSummaryPost !== 'string') return null;
    var qsFrame = exactFrame(body, QUICK_SUMMARY_PATH, { post: spec.quickSummaryPost });
    if (!qsFrame) return null;
    var primaryFrame = exactFrame(body, spec.primaryPath, spec.requiredQuery || {});
    if (!primaryFrame || primaryFrame === qsFrame) return null;
    return { spec: spec, body: body, headings: headings, qsFrame: qsFrame, primaryFrame: primaryFrame };
  }

  function validChildMessage(event, frame, sourceSlug, quickSummaryPost, nonce) {
    if (!event || event.origin !== QUICK_SUMMARY_ORIGIN || !frame || event.source !== frame.contentWindow) return false;
    var data = event.data;
    if (!data || typeof data !== 'object' || data.quickSummaryPost !== quickSummaryPost) return false;
    if (data.type === 'bw-blog-engagement-ready') return true;
    return data.type === 'bw-blog-engagement-jump' && data.sourceSlug === sourceSlug && Boolean(nonce) && data.nonce === nonce;
  }

  function viewportBand() {
    var width = Number(window.innerWidth || document.documentElement.clientWidth || 0);
    if (width < 600) return 'mobile';
    if (width < 1001) return 'tablet';
    return 'desktop';
  }

  function eventKey(eventName, fields) {
    fields = fields || {};
    return [eventName, fields.surface || '', fields.action || '', fields.progressBand || '', fields.activeTimeBand || '', fields.sectionIndex || ''].join(':');
  }

  function retryableStatus(status) {
    return status === 408 || status === 425 || status === 429 || status >= 500;
  }

  function postEventWithRetry(payload, options) {
    options = options || {};
    var fetcher = options.fetcher || function (url, init) { return window.fetch(url, init); };
    var schedule = options.schedule || function (callback, delay) { return window.setTimeout(callback, delay); };
    var allowed = options.allowed || analyticsAllowed;
    var retryDelays = [1000, 4000];
    var body = JSON.stringify(payload);
    return new Promise(function (resolve) {
      function finishOrRetry(attempt, retry) {
        if (!retry || attempt >= retryDelays.length) {
          resolve(false);
          return;
        }
        schedule(function () { deliver(attempt + 1); }, retryDelays[attempt]);
      }
      function deliver(attempt) {
        if (!allowed()) {
          resolve(false);
          return;
        }
        var request;
        try {
          request = fetcher(DEFAULT_ENDPOINT, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            keepalive: true,
            body: body
          });
        } catch (error) {
          finishOrRetry(attempt, true);
          return;
        }
        Promise.resolve(request).then(function (response) {
          if (response && response.ok) {
            resolve(true);
            return;
          }
          finishOrRetry(attempt, Boolean(response && retryableStatus(Number(response.status || 0))));
        }).catch(function () {
          finishOrRetry(attempt, true);
        });
      }
      deliver(0);
    });
  }

  function sendEvent(eventName, fields) {
    fields = fields || {};
    if (!analyticsAllowed() || !state.manifest || !state.pageViewId || state.mode === 'off') return false;
    var key = eventKey(eventName, fields);
    if (state.sent[key]) return false;
    var payload = {
      eventName: eventName,
      eventId: randomId('bwbe'),
      pageViewId: state.pageViewId,
      sourceSlug: state.slug,
      experimentId: state.manifest.experimentId,
      variant: state.variant,
      redesignVersion: state.manifest.version,
      surface: fields.surface || '',
      action: fields.action || '',
      progressBand: fields.progressBand || '',
      activeTimeBand: fields.activeTimeBand || '',
      sectionIndex: fields.sectionIndex ? String(fields.sectionIndex) : '',
      viewportBand: viewportBand(),
      qa: state.qa,
      analyticsConsent: true
    };
    state.sent[key] = { eventId: payload.eventId, status: 'pending' };
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: 'bw_blog_engagement' }, payload));
    postEventWithRetry(payload).then(function (delivered) {
      var record = state.sent[key];
      if (record && record.eventId === payload.eventId) record.status = delivered ? 'delivered' : 'failed';
    });
    return true;
  }

  function sendQuickSummaryConfig(variant) {
    if (!state.qsFrame || !state.qsFrame.contentWindow || !state.spec) return;
    try {
      var currentFrameUrl = state.qsFrame.contentWindow.location.href;
      if (!currentFrameUrl || currentFrameUrl === 'about:blank' || new URL(currentFrameUrl, location.href).origin !== QUICK_SUMMARY_ORIGIN) return;
    } catch (crossOriginReady) {
      // Reading location throws only after the exact iframe has reached its
      // cross-origin document. At that point postMessage is safe to send.
    }
    state.qsFrame.contentWindow.postMessage({
      type: 'bw-blog-engagement-config',
      experimentId: state.manifest.experimentId,
      version: state.manifest.version,
      nonce: state.nonce,
      variant: variant === 'utility' ? 'utility' : 'control',
      sourceSlug: state.slug,
      quickSummaryPost: state.spec.quickSummaryPost,
      buttons: state.spec.sections.map(function (label, index) {
        return { label: label, sectionIndex: index + 1 };
      })
    }, QUICK_SUMMARY_ORIGIN);
  }

  function viewportInsideSection(heading, nextHeading) {
    if (!heading || !heading.isConnected || document.visibilityState === 'hidden') return false;
    var center = window.scrollY + window.innerHeight * 0.5;
    var top = heading.getBoundingClientRect().top + window.scrollY;
    var bottom = nextHeading && nextHeading.isConnected
      ? nextHeading.getBoundingClientRect().top + window.scrollY
      : Math.max(top + window.innerHeight, state.body.getBoundingClientRect().bottom + window.scrollY);
    return center >= top && center < bottom;
  }

  function qualifiedReadTransition(readState, inside, now) {
    if (!readState) return false;
    var time = Number(now);
    if (!inside || !Number.isFinite(time)) {
      readState.visibleSince = null;
      return false;
    }
    if (!Number.isFinite(readState.visibleSince)) {
      readState.visibleSince = time;
      return false;
    }
    return time - readState.visibleSince >= 8000;
  }

  function clearQualifiedRead() {
    if (state.qualifiedTimer) clearInterval(state.qualifiedTimer);
    state.qualifiedTimer = null;
    state.qualifiedRead = null;
  }

  function checkQualifiedRead() {
    var read = state.qualifiedRead;
    if (!read) return;
    var inside = viewportInsideSection(read.target, read.next);
    if (!qualifiedReadTransition(read, inside, Date.now())) return;
    sendEvent('interaction', { surface: read.surface, action: 'qualified_section_read', sectionIndex: read.sectionIndex });
    clearQualifiedRead();
  }

  function beginQualifiedRead(surface, sectionIndex) {
    clearQualifiedRead();
    var target = state.headings[sectionIndex - 1];
    if (!target) return false;
    var allBodyHeadings = state.body ? Array.prototype.slice.call(state.body.querySelectorAll('h2')) : [];
    var targetPosition = allBodyHeadings.indexOf(target);
    var next = targetPosition >= 0 ? allBodyHeadings[targetPosition + 1] : null;
    state.qualifiedRead = {
      surface: surface,
      sectionIndex: sectionIndex,
      target: target,
      next: next,
      visibleSince: null
    };
    state.qualifiedTimer = setInterval(checkQualifiedRead, 250);
    checkQualifiedRead();
    return true;
  }

  function jumpToSection(surface, sectionIndex) {
    var target = state.headings[sectionIndex - 1];
    if (!target) return false;
    var reduced = false;
    try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (error) {}
    target.style.setProperty('scroll-margin-top', '90px');
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    try { target.focus({ preventScroll: true }); } catch (error) { try { target.focus(); } catch (focusError) {} }
    sendEvent('interaction', { surface: surface, action: surface === 'quick_summary' ? 'quick_summary_jump' : 'toc_click', sectionIndex: sectionIndex });
    beginQualifiedRead(surface, sectionIndex);
    return true;
  }

  function onMessage(event) {
    if (!validChildMessage(event, state.qsFrame, state.slug, state.spec && state.spec.quickSummaryPost, state.nonce)) return;
    if (event.data.type === 'bw-blog-engagement-ready') {
      sendQuickSummaryConfig(state.variant);
      return;
    }
    if (state.variant !== 'utility') return;
    var index = Number(event.data.sectionIndex);
    if (!Number.isInteger(index) || index < 1 || index > 4) return;
    if (clean(event.data.label) !== clean(state.spec.sections[index - 1])) return;
    jumpToSection('quick_summary', index);
  }

  function bookingPath(href) {
    try {
      var path = new URL(href, location.href).pathname;
      return path.indexOf('/book-berlin-walking-tour') === 0 || path === '/free-berlin-walking-tour';
    } catch (error) {
      return false;
    }
  }

  function interactionForClick(target, activeBody) {
    if (!target || !(activeBody || state.body) || typeof target.closest !== 'function') return null;
    var toc = target.closest('.bw-c-rail-list a[href^="#"], .bw-c-mobile-toc a[href^="#"]');
    if (toc) {
      var id = String(toc.getAttribute('href') || '').slice(1);
      var index = state.headings.findIndex(function (heading) { return heading.id === id; });
      if (index >= 0) return { surface: 'toc', action: 'toc_click', sectionIndex: index + 1, jump: true };
    }
    if (target.closest('.bw-c-rail-tool')) return { surface: 'article_tool', action: 'article_tool_open' };
    if (target.closest('.bw-c-related a')) return { surface: 'related_guides', action: 'related_click' };
    if (target.closest('.bw-c-share a, .bw-c-share button')) return { surface: 'share', action: 'share_click' };
    var pilotTourLink = target.closest('[data-bw-redesign-c="rail"] .bw-c-rail-tour a.bw-c-book[href], [data-bw-redesign-end="1"] .bw-c-tourband a.bw-c-book[href]');
    var pilotTourHref = pilotTourLink && (pilotTourLink.href || (typeof pilotTourLink.getAttribute === 'function' ? pilotTourLink.getAttribute('href') : ''));
    if (pilotTourHref && bookingPath(pilotTourHref)) return { surface: 'tour_cta', action: 'tour_click' };
    return null;
  }

  function onClick(event) {
    var item = interactionForClick(event.target);
    if (!item) return;
    if (item.jump) {
      beginQualifiedRead(item.surface, item.sectionIndex);
      sendEvent('interaction', item);
      return;
    }
    sendEvent('interaction', item);
  }

  function onInput(event) {
    if (event.target && event.target.closest('[data-bw-date-check-card]')) {
      sendEvent('interaction', { surface: 'date_check', action: 'date_check_start' });
    }
  }

  function validDateCheckSuccessEvent(event, expectedSlug) {
    if (!event || event.type !== 'bw-date-check-blog-submit' || event.defaultPrevented) return false;
    var target = event.target;
    if (!target || typeof target.closest !== 'function' || !target.closest('[data-bw-date-check-card]')) return false;
    var detail = event.detail;
    if (!detail || !/^\d{4}-\d{2}-\d{2}$/.test(String(detail.arrival || '')) || !/^[1-7]$/.test(String(detail.nights || ''))) return false;
    try {
      var url = new URL(detail.targetUrl, location.href);
      return url.origin === new URL(location.href).origin &&
        url.pathname === '/berlin-dates-check' &&
        url.searchParams.get('arrival') === String(detail.arrival) &&
        url.searchParams.get('nights') === String(detail.nights) &&
        url.searchParams.get('utm_source') === 'blog' &&
        url.searchParams.get('utm_medium') === 'inline_tool' &&
        url.searchParams.get('utm_campaign') === 'berlin_date_check' &&
        url.searchParams.get('utm_content') === String(expectedSlug || '');
    } catch (error) {
      return false;
    }
  }

  function onDateCheckSuccess(event) {
    if (!validDateCheckSuccessEvent(event, state.slug)) return;
    sendEvent('interaction', { surface: 'date_check', action: 'date_check_submit' });
  }

  function observeSurface(node, surface) {
    if (!node || !node.isConnected || !analyticsAllowed()) return;
    if (state.observed && state.observed.has(node)) return;
    if (state.observed) state.observed.add(node);
    if (typeof window.IntersectionObserver !== 'function') return;
    var timer = null;
    var observer = new window.IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          if (timer) return;
          timer = setTimeout(function () {
            sendEvent('surface_view', { surface: surface });
            observer.disconnect();
          }, 1000);
        } else if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      });
    }, { threshold: [0.5] });
    observer.observe(node);
    state.visibilityTimers.push({ observer: observer, timer: function () { return timer; } });
  }

  function bindSurfaces() {
    observeSurface(state.qsFrame, 'quick_summary');
    if (state.primaryFrame) observeSurface(state.primaryFrame, state.spec.primaryKind === 'commercial_cta_iframe' ? 'tour_cta' : 'article_tool');
    observeSurface(document.querySelector('[data-bw-date-check-card]'), 'date_check');
    observeSurface(document.querySelector('.bw-c-related'), 'related_guides');
    observeSurface(document.querySelector('.bw-c-tourband'), 'tour_cta');
  }

  function readProgress() {
    if (!analyticsAllowed() || !state.body) return;
    var rect = state.body.getBoundingClientRect();
    var top = rect.top + window.scrollY;
    var bottom = rect.bottom + window.scrollY;
    var height = Math.max(1, bottom - top);
    var ratio = Math.max(0, Math.min(1, (window.scrollY + window.innerHeight - top) / height));
    if (ratio >= 0.25) sendEvent('read_25', { progressBand: '25' });
    if (ratio >= 0.50) sendEvent('read_50', { progressBand: '50' });
    if (ratio >= 0.75) sendEvent('read_75', { progressBand: '75' });
    if (ratio >= 0.90) sendEvent('read_complete', { progressBand: '90' });
  }

  function startActiveTimer() {
    if (state.activeTimer || !analyticsAllowed()) return;
    state.activeTimer = setInterval(function () {
      if (document.visibilityState === 'hidden') return;
      state.activeSeconds += 1;
      if (state.activeSeconds >= 30) sendEvent('active_30s', { activeTimeBand: '30' });
      if (state.activeSeconds >= 90) sendEvent('active_90s', { activeTimeBand: '90' });
    }, 1000);
  }

  function clearObservers() {
    state.visibilityTimers.forEach(function (entry) {
      try { entry.observer.disconnect(); } catch (error) {}
      var timer = entry.timer();
      if (timer) clearTimeout(timer);
    });
    state.visibilityTimers = [];
    state.observed = typeof WeakSet === 'function' ? new WeakSet() : null;
  }

  function resetTrackingCycle() {
    clearObservers();
    clearQualifiedRead();
    clearInterval(state.activeTimer);
    state.pageViewId = '';
    state.sent = {};
    state.activeSeconds = 0;
    state.activeTimer = null;
  }

  function resetPage(nextSlug) {
    if (state.qsFrame && state.qsFrame.contentWindow) sendQuickSummaryConfig('control');
    resetTrackingCycle();
    state.slug = nextSlug;
    state.spec = null;
    state.body = null;
    state.headings = [];
    state.qsFrame = null;
    state.qsLoadBound = typeof WeakSet === 'function' ? new WeakSet() : null;
    state.primaryFrame = null;
    state.nonce = randomId('bwnonce');
    state.variant = 'control';
    state.mode = 'off';
  }

  function scheduleBoundaryRefresh() {
    clearTimeout(state.boundaryTimer);
    state.boundaryTimer = null;
    if (!state.manifest) return;
    var boundary = nextScheduleBoundary(state.manifest, new Date());
    if (!boundary) return;
    var remaining = boundary - Date.now() + 25;
    var delay = Math.max(25, Math.min(2147483000, remaining));
    state.boundaryTimer = setTimeout(function () {
      state.boundaryTimer = null;
      applyCurrentPage();
    }, delay);
  }

  function applyCurrentPage() {
    if (!state.manifest) return;
    scheduleBoundaryRefresh();
    var sourceSlug = currentSlug();
    if (sourceSlug !== state.slug) resetPage(sourceSlug);
    var override = queryOverride();
    state.qa = override === 'control' || override === 'utility';
    var nextMode = manifestMode(state.manifest, new Date(), { enabled: runtimeEnabled() }, override);
    if (nextMode !== state.mode) {
      if (state.qsFrame && state.qsFrame.contentWindow) sendQuickSummaryConfig('control');
      resetTrackingCycle();
      state.mode = nextMode;
    }
    if (state.mode === 'off' || !sourceSlug || !state.manifest.slugs[sourceSlug]) {
      if (state.qsFrame) sendQuickSummaryConfig('control');
      resetTrackingCycle();
      return;
    }
    var context = eligibleContext(state.manifest, sourceSlug, document);
    if (!context) {
      if (state.qsFrame) sendQuickSummaryConfig('control');
      resetTrackingCycle();
      return;
    }
    var analytics = analyticsAllowed();
    state.variant = assignVariant(state.manifest, {
      override: override,
      mode: state.mode,
      analytics: analytics,
      storage: window.localStorage,
      pageMemory: state.assignmentLocks,
      now: new Date()
    });
    state.spec = context.spec;
    state.body = context.body;
    state.headings = context.headings;
    state.qsFrame = context.qsFrame;
    state.primaryFrame = context.primaryFrame;
    sendQuickSummaryConfig(state.variant);
    if (!state.qsLoadBound || !state.qsLoadBound.has(state.qsFrame)) {
      if (state.qsLoadBound) state.qsLoadBound.add(state.qsFrame);
      state.qsFrame.addEventListener('load', function () { sendQuickSummaryConfig(state.variant); });
    }
    if (!analytics) return;
    if (!state.pageViewId) state.pageViewId = randomId('bwpv');
    sendEvent('eligible_view');
    bindSurfaces();
    startActiveTimer();
    readProgress();
  }

  function scheduleRefresh() {
    clearTimeout(state.refreshTimer);
    state.refreshTimer = setTimeout(applyCurrentPage, 100);
  }

  function onConsentChange() {
    if (!analyticsAllowed()) {
      try { window.localStorage.removeItem(STORAGE_KEY); } catch (error) {}
      if (state.qsFrame) sendQuickSummaryConfig(state.qa ? state.variant : 'control');
      if (!state.qa && state.manifest) lockAssignment(state.assignmentLocks, assignmentLockKey(state.manifest), 'control');
      resetTrackingCycle();
    }
    scheduleRefresh();
  }

  function installListeners() {
    if (state.listenersInstalled) return;
    state.listenersInstalled = true;
    window.addEventListener('message', onMessage);
    window.addEventListener('scroll', readProgress, { passive: true });
    window.addEventListener('scroll', checkQualifiedRead, { passive: true });
    window.addEventListener('resize', checkQualifiedRead, { passive: true });
    document.addEventListener('visibilitychange', checkQualifiedRead);
    document.addEventListener('click', onClick, true);
    document.addEventListener('input', onInput, true);
    window.addEventListener('bw-date-check-blog-submit', onDateCheckSuccess);
    CONSENT_EVENTS.forEach(function (name) {
      window.addEventListener(name, onConsentChange);
      document.addEventListener(name, onConsentChange);
    });
    state.mutationObserver = new MutationObserver(scheduleRefresh);
    state.mutationObserver.observe(document.documentElement, { childList: true, subtree: true });
    state.pathTimer = setInterval(function () {
      var currentLocation = location.pathname + location.search;
      if (currentLocation === state.lastLocation) return;
      state.lastLocation = currentLocation;
      scheduleRefresh();
    }, 500);
  }

  function boot(manifest) {
    if (!manifest || manifest.version !== INSTALL_VERSION || !scheduleTimes(manifest)) {
      if (installRecord) installRecord.active = false;
      return;
    }
    state.manifest = manifest;
    state.assignmentLocks = installRecord && installRecord.assignmentLocks || {};
    state.nonce = randomId('bwnonce');
    installListeners();
    scheduleBoundaryRefresh();
    [0, 250, 900, 2200, 6000, 15000, 30000].forEach(function (delay) { setTimeout(applyCurrentPage, delay); });
  }

  if (TEST_MODE) {
    window.__bwBlogEngagementTestHooks = {
      clean: clean,
      randomId: randomId,
      claimInstall: claimInstall,
      manifestMode: manifestMode,
      nextScheduleBoundary: nextScheduleBoundary,
      assignVariant: assignVariant,
      eligibleContext: eligibleContext,
      validChildMessage: validChildMessage,
      interactionForClick: interactionForClick,
      validDateCheckSuccessEvent: validDateCheckSuccessEvent,
      qualifiedReadTransition: qualifiedReadTransition,
      postEventWithRetry: postEventWithRetry,
      analyticsAllowed: analyticsAllowed,
      storageKey: STORAGE_KEY,
      installKey: INSTALL_KEY,
      installVersion: INSTALL_VERSION,
      quickSummaryOrigin: QUICK_SUMMARY_ORIGIN,
      quickSummaryPath: QUICK_SUMMARY_PATH
    };
    return;
  }

  var initialOverride = queryOverride();
  if (initialOverride === '0' || (!runtimeEnabled() && initialOverride !== 'control' && initialOverride !== 'utility')) return;
  var claimed = claimInstall(window, INSTALL_VERSION);
  if (!claimed.acquired) return;
  installRecord = claimed.record;
  fetch(MANIFEST_URL, { cache: 'force-cache' })
    .then(function (response) { if (!response.ok) throw new Error('manifest unavailable'); return response.json(); })
    .then(boot)
    .catch(function () { if (installRecord) installRecord.active = false; });
})();
