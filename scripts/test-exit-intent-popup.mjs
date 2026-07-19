#!/usr/bin/env node

import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const SOURCE = fs.readFileSync(new URL('../js/exit-intent-popup.js', import.meta.url), 'utf8');
const ASSETS = [
  ['tour-museum-island-560.avif', 25 * 1024],
  ['tour-museum-island-560.webp', 35 * 1024],
  ['tour-museum-island-1120.avif', 60 * 1024],
  ['tour-museum-island-1120.webp', 100 * 1024],
];

{
  assert.match(SOURCE, /Give me 2 hours\. I\\'ll make Berlin make sense\./);
  assert.match(SOURCE, /Meet me at the World Clock\. Reserving is free, and you tip at the end\./);
  assert.match(SOURCE, />Reserve a free spot<\/a>/);
  assert.match(SOURCE, /<picture>/);
  assert.match(SOURCE, /type="image\/avif"/);
  assert.match(SOURCE, /type="image\/webp"/);
  assert.match(SOURCE, /alt="Yusuf guiding a BerlinWalk group on Museum Island"/);
  assert.equal(SOURCE.includes('fonts.googleapis.com'), false, 'popup must not request Google Fonts');
  assert.equal(SOURCE.includes('backdrop-filter'), false, 'popup must not use GPU-heavy backdrop blur');
  assert.equal(SOURCE.includes('next-tour-slot.js'), false, 'popup must not request a second scheduling script');

  for (const [file, maximumBytes] of ASSETS) {
    const asset = new URL(`../exit-popup/assets/${file}`, import.meta.url);
    const stat = fs.statSync(asset);
    assert.ok(stat.size > 0, `${file} must not be empty`);
    assert.ok(stat.size <= maximumBytes, `${file} must stay under ${maximumBytes} bytes`);
  }
}

function storage(initial = {}) {
  const values = new Map(Object.entries(initial));
  const writes = [];
  const reads = [];
  const removals = [];
  return {
    getItem(key) {
      reads.push(String(key));
      return values.has(String(key)) ? values.get(String(key)) : null;
    },
    setItem(key, value) {
      writes.push([String(key), String(value)]);
      values.set(String(key), String(value));
    },
    removeItem(key) {
      removals.push(String(key));
      values.delete(String(key));
    },
    reads,
    writes,
    removals,
    values,
  };
}

function harness({
  search = '',
  pathname = '/post/test-exit-popup',
  analytics = false,
  localInitial = {},
  sessionInitial = {},
} = {}) {
  let analyticsState = analytics;
  const localStorage = storage(localInitial);
  const sessionStorage = storage(sessionInitial);
  const fetches = [];
  const layer = [];
  const listeners = {};
  const document = {
    cookie: '',
    currentScript: null,
    readyState: 'loading',
    addEventListener(name, handler) { listeners[`document:${name}`] = handler; },
    removeEventListener() {},
    getElementById() { return null; },
    querySelector() { return null; },
    createElement() { return { set src(value) { this._src = value; }, async: false }; },
    head: { appendChild() {} },
    body: { appendChild() {}, classList: { add() {}, remove() {} } },
    documentElement: { classList: { add() {}, remove() {} } },
  };

  const window = {
    BW_EXIT_POPUP_TEST_HOOKS: true,
    location: {
      hostname: 'www.berlinwalk.com',
      origin: 'https://www.berlinwalk.com',
      pathname,
      search,
      href: `https://www.berlinwalk.com${pathname}${search}`,
    },
    innerWidth: 1280,
    screen: { width: 1440 },
    localStorage,
    sessionStorage,
    dataLayer: layer,
    consentPolicyManager: {
      getCurrentConsentPolicy() { return { policy: { analytics: analyticsState } }; },
    },
    crypto: globalThis.crypto,
    fetch(url, options) {
      fetches.push({ url, options });
      return Promise.resolve({ ok: true, status: 204 });
    },
    setTimeout() { return 1; },
    clearTimeout() {},
    addEventListener(name, handler) { listeners[`window:${name}`] = handler; },
    requestAnimationFrame() {},
  };
  window.window = window;
  window.document = document;

  const context = vm.createContext({
    window,
    document,
    navigator: { sendBeacon() { throw new Error('beacon should not be needed'); } },
    URL,
    URLSearchParams,
    Intl,
    Date,
    Math,
    Object,
    Array,
    Boolean,
    String,
    Number,
    RegExp,
    JSON,
    Uint32Array,
    Blob,
    console,
  });
  new vm.Script(SOURCE, { filename: 'exit-intent-popup.js' }).runInContext(context);
  return {
    hooks: window.__bwExitPopupTestHooks,
    window,
    document,
    localStorage,
    sessionStorage,
    fetches,
    layer,
    listeners,
    setAnalytics(value) { analyticsState = Boolean(value); },
  };
}

{
  const test = harness({ analytics: false });
  const destination = test.hooks.bookingDestination();
  assert.equal(destination.attributionMode, 'exit_default');
  assert.equal(test.localStorage.reads.length, 0, 'localStorage must not be read before analytics consent');
  assert.equal(test.sessionStorage.reads.length, 0, 'sessionStorage must not be read before analytics consent');
  assert.equal(test.hooks.trackEvent('bw_exit_popup_view', { triggerType: 'exit_intent' }), false);
  assert.equal(test.fetches.length, 0, 'first-party tracking must be silent before analytics consent');
  assert.equal(test.layer.length, 0, 'dataLayer must be silent before analytics consent');
  assert.equal(test.localStorage.writes.length, 0, 'local analytics storage must be silent before consent');
  assert.equal(test.sessionStorage.writes.length, 0, 'session analytics storage must be silent before consent');
}

{
  const test = harness({
    analytics: true,
    search: '?utm_source=google&utm_medium=cpc&utm_campaign=berlin_summer&gclid=abc_123&email=hidden%40example.com',
    localInitial: {
      'bwVisitorId.v1': 'bw_v_existing',
      'bwPaidTracking.v1': JSON.stringify({
        visitorId: 'bw_v_existing',
        firstPage: 'https://www.berlinwalk.com/blog?email=hidden%40example.com',
        landingPage: 'https://www.berlinwalk.com/post/source?email=hidden%40example.com',
        utm_source: 'old_source',
      }),
    },
    sessionInitial: { 'bwSessionId.v1': 'bw_s_existing' },
  });
  const destination = new URL(test.hooks.bookingDestination().href);
  assert.equal(destination.searchParams.get('utm_source'), 'google');
  assert.equal(destination.searchParams.get('utm_medium'), 'cpc');
  assert.equal(destination.searchParams.get('utm_campaign'), 'berlin_summer');
  assert.equal(destination.searchParams.get('gclid'), 'abc_123');
  assert.equal(destination.searchParams.has('email'), false);

  assert.equal(test.hooks.trackEvent('bw_exit_popup_view', { triggerType: 'exit_intent' }), true);
  assert.equal(test.hooks.trackEvent('bw_exit_popup_view', { triggerType: 'exit_intent' }), false);
  assert.equal(test.fetches.length, 1, 'an event type must be sent once per session');
  assert.equal(test.layer.length, 1);

  const request = test.fetches[0];
  const body = JSON.parse(request.options.body);
  assert.equal(request.url, 'https://app.berlinwalk.com/api/pf-event');
  assert.equal(body.pagePath, '/post/test-exit-popup');
  assert.equal(body.landingPage, '/post/source');
  assert.equal(body.firstPage, '/blog');
  assert.equal(body.referrer, '');
  assert.equal(body.sessionId, 'bw_s_existing');
  assert.equal(body.visitorId, 'bw_v_existing');
  assert.equal(body.utmSource, 'google');
  assert.equal(body.gclid, 'abc_123');
  assert.equal(body.payload.qa, false);
  assert.equal(body.payload.previewMode, false);
  assert.equal(Object.hasOwn(body, 'pageUrl'), false);
  assert.equal(JSON.stringify(body).includes('hidden@example.com'), false);
  assert.equal(JSON.stringify(body).includes('hidden%40example.com'), false);
  assert.equal(test.localStorage.writes.some(([key]) => key === 'bwPaidTracking.v1'), false, 'stored paid attribution must not be overwritten');
}

{
  const test = harness({
    analytics: true,
    search: '?utm_source=embed&utm_medium=widget&utm_campaign=tool_footer',
    localInitial: {
      'bwVisitorId.v1': 'bw_v_paid',
      'bwPaidTracking.v1': JSON.stringify({
        visitorId: 'bw_v_paid',
        utm_source: 'meta',
        utm_medium: 'paid_social',
        utm_campaign: 'berlin_walk_paid',
        fbc: 'fb.1.safe-click',
      }),
    },
    sessionInitial: { 'bwSessionId.v1': 'bw_s_paid' },
  });
  const destination = new URL(test.hooks.bookingDestination().href);
  assert.equal(destination.searchParams.get('utm_source'), 'meta', 'stored paid source must beat current internal attribution');
  assert.equal(destination.searchParams.get('utm_medium'), 'paid_social');
  assert.equal(destination.searchParams.get('utm_campaign'), 'berlin_walk_paid');
  assert.equal(destination.searchParams.get('fbc'), 'fb.1.safe-click');
  assert.equal(destination.searchParams.get('utm_content'), null);
  assert.equal(test.hooks.bookingDestination().attributionMode, 'stored_paid');
}

{
  const test = harness({
    analytics: true,
    search: '?utm_source=embed&utm_medium=widget',
    localInitial: {
      'bwPaidTracking.v1': JSON.stringify({
        isPaid: true,
        utm_source: 'meta',
        utm_campaign: 'berlin_walk_july',
      }),
    },
  });
  const destination = new URL(test.hooks.bookingDestination().href);
  assert.equal(destination.searchParams.get('utm_source'), 'meta');
  assert.equal(destination.searchParams.get('utm_campaign'), 'berlin_walk_july');
  assert.equal(test.hooks.measurementState().isPaid, true);
}

{
  const organic = harness({
    analytics: true,
    search: '?utm_source=google&utm_medium=organic&utm_campaign=berlin_history',
  });
  const organicDestination = new URL(organic.hooks.bookingDestination().href);
  assert.equal(organicDestination.searchParams.get('utm_source'), 'berlinwalk');
  assert.equal(organicDestination.searchParams.get('utm_medium'), 'exit_popup');
  assert.equal(organic.hooks.measurementState().isPaid, false, 'google organic must not be classified as paid');

  const paid = harness({
    analytics: true,
    search: '?utm_source=google&utm_medium=cpc&utm_campaign=berlin_walk&gclid=safe_gclid',
  });
  assert.equal(paid.hooks.measurementState().isPaid, true);
  assert.equal(paid.hooks.bookingDestination().attributionMode, 'current_paid');
}

{
  const test = harness({ analytics: true });
  assert.equal(
    test.hooks.safePath('/confirm/08f4b3f7-a541-4f14-831d-60d8530fac62?token=secret'),
    '/confirm/[redacted]',
  );
  assert.equal(
    test.hooks.safePath('/lead/person%40example.com'),
    '/lead/[redacted]',
  );
}

{
  const test = harness({
    analytics: true,
    localInitial: {
      'bwVisitorId.v1': 'bw_v_revoke',
      'bwPaidTracking.v1': JSON.stringify({ utm_source: 'meta', utm_medium: 'paid_social' }),
    },
    sessionInitial: { 'bwSessionId.v1': 'bw_s_revoke' },
  });
  test.listeners['document:DOMContentLoaded']();
  assert.equal(test.hooks.trackEvent('bw_exit_popup_view', { triggerType: 'exit_intent' }), true);
  assert.equal(test.fetches.length, 1);
  assert.equal(test.sessionStorage.values.get('bwExitPopupEventSent.v1.bw_exit_popup_view'), '1');

  test.setAnalytics(false);
  test.listeners['window:consentPolicyChanged']();
  assert.equal(test.localStorage.values.has('bwVisitorId.v1'), false);
  assert.equal(test.localStorage.values.has('bwPaidTracking.v1'), false);
  assert.equal(test.sessionStorage.values.has('bwSessionId.v1'), false);
  assert.equal(test.sessionStorage.values.has('bwExitPopupEventSent.v1.bw_exit_popup_view'), false);
  assert.equal(test.hooks.trackEvent('bw_exit_popup_view', { triggerType: 'exit_intent' }), false);
  assert.equal(test.fetches.length, 1);

  test.setAnalytics(true);
  test.listeners['window:consentPolicyChanged']();
  assert.equal(test.hooks.trackEvent('bw_exit_popup_view', { triggerType: 'exit_intent' }), true, 'fresh consent must start a fresh dedupe epoch');
  assert.equal(test.fetches.length, 2);
}

{
  const test = harness({
    analytics: true,
    search: '?bwExitPreview=1&utm_campaign=person%40example.com',
  });
  const destination = new URL(test.hooks.bookingDestination().href);
  assert.equal(destination.searchParams.get('utm_campaign'), 'organic_booking', 'unsafe attribution must be replaced by the safe fallback');
  assert.equal(destination.toString().includes('example.com'), false);
  assert.equal(test.hooks.trackEvent('bw_exit_popup_close', { closeReason: 'x_button' }), true);
  const body = JSON.parse(test.fetches[0].options.body);
  assert.equal(body.payload.qa, true);
  assert.equal(body.payload.previewMode, true);
  assert.equal(body.payload.closeReason, 'x_button');
}

console.log('PASS exit-intent-popup consent, attribution, PII and per-session event contract');
