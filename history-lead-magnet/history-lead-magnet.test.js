const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const injectorPath = path.join(root, 'js', 'lead-form-inject.js');
const elementPath = path.join(__dirname, 'history-lead-magnet-element.js');
const injectorSource = fs.readFileSync(injectorPath, 'utf8');
const elementSource = fs.readFileSync(elementPath, 'utf8');

function controlFunctionHash() {
  const start = injectorSource.indexOf('  function buildBookingCard() {');
  const end = injectorSource.indexOf('\n\n  /* The history lead experiment', start);
  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  return crypto.createHash('sha256').update(injectorSource.slice(start, end)).digest('hex');
}

function makeInjectorContext(options = {}) {
  const store = new Map();
  let analytics = Boolean(options.analytics);
  let random = options.random == null ? 0.05 : options.random;
  const listeners = {};
  const document = {
    cookie: '',
    readyState: 'loading',
    referrer: '',
    body: null,
    head: { appendChild() {} },
    addEventListener(name, fn) { listeners[`document:${name}`] = fn; },
    removeEventListener() {},
    getElementById() { return null; },
    querySelector() { return null; },
    createElement() {
      return {
        addEventListener() {},
        setAttribute() {},
        style: {},
      };
    },
  };
  const window = {
    BW_HISTORY_LEAD_TEST_HOOKS: true,
    BW_HISTORY_LEAD_EXPERIMENT_CONFIG: options.config || {},
    addEventListener(name, fn) { listeners[`window:${name}`] = fn; },
    removeEventListener() {},
    consentPolicyManager: {
      getCurrentConsentPolicy() { return { analytics }; },
    },
    localStorage: {
      getItem(key) { return store.has(key) ? store.get(key) : null; },
      setItem(key, value) { store.set(key, String(value)); },
    },
    crypto: {
      getRandomValues(values) {
        values[0] = Math.floor(random * 4294967296);
        return values;
      },
    },
    customElements: { get() { return null; } },
    location: null,
    innerWidth: 390,
    innerHeight: 844,
  };
  const location = {
    pathname: options.pathname || '/post/why-berlin-doesn-t-have-a-beautiful-old-town-and-why-that-s-the-point',
    search: options.search || '',
    href: 'https://www.berlinwalk.com' + (options.pathname || '/post/why-berlin-doesn-t-have-a-beautiful-old-town-and-why-that-s-the-point') + (options.search || ''),
  };
  window.window = window;
  window.document = document;
  window.location = location;
  const context = vm.createContext({
    window,
    document,
    location,
    console: { log() {}, warn() {} },
    URL,
    URLSearchParams,
    Uint32Array,
    Date,
    Math,
    Number,
    Object,
    JSON,
    Promise,
    decodeURIComponent,
    encodeURIComponent,
    setTimeout() { return 1; },
    clearTimeout() {},
    setInterval() { return 1; },
    MutationObserver: class { observe() {} disconnect() {} },
    fetch() { return Promise.resolve({ ok: true, json: () => Promise.resolve({}) }); },
  });
  vm.runInContext(injectorSource, context, { filename: injectorPath });
  return {
    hooks: window.__bwHistoryLeadTestHooks,
    location,
    window,
    store,
    setAnalytics(value) { analytics = Boolean(value); },
    setRandom(value) { random = value; },
  };
}

test('keeps the approved booking-card control byte equivalent', () => {
  assert.equal(
    controlFunctionHash(),
    'af298cb3e2aedff4e7c1423eb7bdf0d82ade59599af98f384dcd69600fb4414e'
  );
});

test('asset manifest exposes only complete approved image pairs', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'assets-manifest.json'), 'utf8'));
  assert.equal(manifest.status, 'approved-assets');
  assert.deepEqual(Object.keys(manifest.stories).sort(), ['bethlehem', 'engelbecken', 'monbijou']);
  Object.values(manifest.stories).forEach((story) => {
    assert.equal(story.approved, true);
    for (const asset of [story.archive, story.current]) {
      assert.match(asset.src, /^assets\/optimized\/.+\.jpg$/);
      assert.ok(asset.alt);
      assert.ok(asset.creator);
      assert.ok(asset.sourceName);
      assert.match(asset.sourcePage, /^https:\/\//);
      assert.match(asset.licenseUrl, /^https:\/\//);
      assert.ok(asset.changes);
      assert.equal(fs.existsSync(path.join(__dirname, asset.src)), true);
    }
  });
});

test('element contains the required consent and success copy without a prechecked checkbox', () => {
  assert.match(elementSource, /Email me the next two Berlin stories and occasional BerlinWalk updates\./);
  assert.match(elementSource, /Check your inbox\. Click the confirmation link to open Story 2\./);
  assert.doesNotMatch(elementSource, /name="consent"[^>]*\schecked(?:\s|>)/);
  assert.match(elementSource, /analyticsAllowed\(\)/);
  assert.match(elementSource, /noindex,follow/);
  assert.match(elementSource, /credentials: 'include'/);
  assert.match(elementSource, /_resolveStoryAccess\(\)/);
  assert.match(elementSource, /payload\.access !== true/);
  assert.match(elementSource, /data-bw-history-access/);
  assert.doesNotMatch(elementSource, /Story 3 arrives 48 hours/);
});

test('safety stage uses 10% on only the old-town slug for the first 24 hours', () => {
  const ctx = makeInjectorContext({
    random: 0.05,
    config: { stage: 'safety', safetyStartedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
  });
  assert.equal(ctx.hooks.effectiveStage(), 'ramp');
  assert.equal(ctx.hooks.assignment().variant, 'variant');

  ctx.location.pathname = '/post/why-berlin-s-streets-are-so-wide-it-wasn-t-always-the-plan';
  ctx.hooks.resetBucket();
  assert.equal(ctx.hooks.assignment().inExperiment, false);
});

test('safety stage becomes 50/50 on two slugs after 24 hours and leaves Alexanderplatz off', () => {
  const ctx = makeInjectorContext({
    random: 0.20,
    pathname: '/post/why-berlin-s-streets-are-so-wide-it-wasn-t-always-the-plan',
    config: { stage: 'safety', safetyStartedAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString() },
  });
  assert.equal(ctx.hooks.effectiveStage(), 'pilot');
  assert.equal(ctx.hooks.assignment().variant, 'variant');

  ctx.location.pathname = '/post/alexanderplatz-then-and-now-from-medieval-market-to-modern-chaos';
  ctx.hooks.resetBucket();
  assert.equal(ctx.hooks.assignment().inExperiment, false);
});

test('assignment persistence starts only after analytics consent', () => {
  const ctx = makeInjectorContext({
    analytics: false,
    random: 0.05,
    config: { stage: 'ramp' },
  });
  assert.equal(ctx.hooks.assignment().variant, 'variant');
  assert.equal(ctx.store.has(ctx.hooks.storageKey), false);
  ctx.setAnalytics(true);
  assert.equal(ctx.hooks.assignment().variant, 'variant');
  assert.equal(ctx.store.has(ctx.hooks.storageKey), true);
});

test('forced QA and kill-switch query parameters are deterministic', () => {
  const variant = makeInjectorContext({ pathname: '/post/unrelated', search: '?bwHistoryLead=variant' });
  assert.deepEqual(
    JSON.parse(JSON.stringify(variant.hooks.assignment())),
    { variant: 'variant', inExperiment: true, qa: true, stage: 'qa' }
  );
  const killed = makeInjectorContext({ search: '?bwHistoryLead=0', config: { stage: 'pilot' } });
  assert.equal(killed.hooks.assignment().variant, 'control');
  assert.equal(killed.hooks.assignment().inExperiment, false);
});
