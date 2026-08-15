const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const elementPath = path.join(__dirname, 'content-upgrade-card-element.js');
const injectorPath = path.join(root, 'js', 'lead-form-inject.js');
const journeyPath = path.join(root, 'js', 'blog-journey-inject.js');
const elementSource = fs.readFileSync(elementPath, 'utf8');
const injectorSource = fs.readFileSync(injectorPath, 'utf8');
const journeySource = fs.readFileSync(journeyPath, 'utf8');

const skipSlugs = [
  'how-many-days-in-berlin',
  'one-day-in-berlin',
  'weekend-in-berlin-48-hour-itinerary',
  '2-days-in-berlin-itinerary',
  'berlin-in-3-days-the-perfect-itinerary-from-a-local-guide',
  'berlin-first-time-visitor-mistakes-12-things-to-know-before-you-go',
  'best-museums-in-berlin-first-time-visitors',
  'is-berlin-walkable',
  'berlin-with-kids',
  'berlin-accessibility',
  'berlin-itinerary-for-couples',
  'travelling-alone-in-berlin-day-plan',
];
const secondarySlugs = [
  'is-berlin-safe-for-solo-travelers-an-honest-local-perspective',
  'how-to-spend-a-sunday-in-berlin',
  'are-shops-open-on-sunday-in-berlin-what-you-need-to-know',
  'berlin-on-a-monday',
  'berlin-heatwave-day-plan',
  'vegan-berlin-guide-2026',
];
const historySlugs = [
  'why-berlin-doesn-t-have-a-beautiful-old-town-and-why-that-s-the-point',
  'why-berlin-s-streets-are-so-wide-it-wasn-t-always-the-plan',
  'where-was-the-berlin-wall-interactive-map',
  'the-ampelmann-how-a-traffic-light-became-berlin-s-most-beloved-symbol',
  'unter-den-linden-berlin',
  'why-is-berlin-founding-year-1237',
];

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
    BW_CONTENT_UPGRADE_TEST_HOOKS: true,
    BW_HISTORY_LEAD_TEST_HOOKS: true,
    BW_CONTENT_UPGRADE_EXPERIMENT_CONFIG: options.config || {},
    BW_HISTORY_LEAD_EXPERIMENT_CONFIG: options.historyConfig || {},
    BW_DISABLE_CONTENT_UPGRADE: options.disableGlobal === true,
    BW_DISABLE_HISTORY_LEAD: options.disableHistory === true,
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
  const pathname = options.pathname || '/post/how-many-days-in-berlin';
  const location = {
    pathname,
    search: options.search || '',
    href: `https://www.berlinwalk.com${pathname}${options.search || ''}`,
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
    hooks: window.__bwContentUpgradeTestHooks,
    historyHooks: window.__bwHistoryLeadTestHooks,
    store,
    setAnalytics(value) { analytics = Boolean(value); },
    setRandom(value) { random = value; },
  };
}

test('component leads with three full Skip List judgements and keeps arrival timing second', () => {
  assert.match(elementSource, /berlin-skip-list-v1-2026-08-15/);
  assert.match(elementSource, /By requesting this list, I agree to receive it by email/);
  assert.match(elementSource, /consent:\s*true/);
  assert.doesNotMatch(elementSource, /type=["']checkbox["']/i);
  assert.doesNotMatch(elementSource, /newsletterConsent/);
  assert.match(elementSource, /Email me the Skip List/);
  assert.match(elementSource, /name="arrivalTiming"/);
  assert.match(elementSource, /arrival-options/);
  assert.match(elementSource, /That is three of nine\. Want all nine as a card you can keep on your phone while you walk\? I will email it\./);
  assert.match(elementSource, /Skip the ride up the TV Tower\.[\s\S]+You queue for a timed slot/);
  assert.match(elementSource, /Skip Checkpoint Charlie\.[\s\S]+It is a rebuilt booth ringed by fast food/);
  assert.match(elementSource, /Skip the Reichstag dome if you have not registered\.[\s\S]+It is free, but you cannot walk in/);
  assert.match(elementSource, /teaser-items/);
  assert.doesNotMatch(elementSource, /<select[^>]+required/i);
  assert.match(elementSource, /arrivalOnly:\s*true/);
  assert.match(elementSource, /content-items/);
  assert.doesNotMatch(elementSource, /berlin-transport-ticket-pocket-card/);
  assert.match(elementSource, /url\.searchParams\.set\('action', 'submit'\)/);
  assert.match(elementSource, /Check your inbox\./);
});

test('component is compact, accessible and has no inner scrolling surface', () => {
  assert.match(elementSource, /role="region" aria-labelledby="bw-content-upgrade-title"/);
  assert.match(elementSource, /aria-live="polite"/);
  assert.match(elementSource, /inputmode="email" autocomplete="email"/);
  assert.match(elementSource, /class="honeypot" hidden aria-hidden="true"/);
  assert.match(elementSource, /@media\(prefers-reduced-motion:reduce\)/);
  assert.match(elementSource, /\[hidden\]\{display:none!important\}/);
  assert.match(elementSource, /background:#ffe600[^}]+color:#123d18!important/);
  assert.doesNotMatch(elementSource, /overflow(?:-y)?:\s*(?:auto|scroll)/i);
  assert.doesNotMatch(elementSource, /max-height\s*:/i);
  assert.match(elementSource, /white-space:normal/);
  assert.match(elementSource, /data-bw-content-upgrade-ready/);
  assert.match(elementSource, /bw-content-upgrade-error/);
});

test('orchestrator owns exactly the 12 primary Skip List slugs', () => {
  const ctx = makeInjectorContext({ config: { stage: 'pilot' } });
  assert.deepEqual(Array.from(ctx.hooks.slugs).sort(), [...skipSlugs].sort());
  assert.deepEqual(skipSlugs.filter((slug) => historySlugs.includes(slug)), []);
  assert.deepEqual(skipSlugs.filter((slug) => secondarySlugs.includes(slug)), []);
  assert.equal(ctx.hooks.safetySlug, '');
  assert.equal(ctx.hooks.placement, 'blog_inline_booking_slot');
  assert.equal(ctx.hooks.magnetConfigs.length, 1);
  assert.deepEqual(JSON.parse(JSON.stringify(ctx.hooks.magnetConfigs[0])), {
    experimentId: 'berlin_skip_list_v1',
    assetId: 'berlin-skip-list',
    assetVersion: '2026-08-v1',
    storageKey: 'bwContentUpgrade.berlinSkipList.v1',
    apiBase: 'https://app.berlinwalk.com/api/download-lead',
    elementUrl: 'https://fenerszymanski.github.io/berlinwalk-widgets/content-upgrade-card/content-upgrade-card-element.js?v=20260816-magnet1',
    placement: 'blog_inline_booking_slot',
    controlType: 'private-tour',
    controlUrl: 'https://www.berlinwalk.com/private-tour',
    slugs: [...skipSlugs],
  });
  assert.match(injectorSource, /if \(history\.inExperiment\) return \{ owner: 'history'/);
  assert.match(injectorSource, /if \(contentUpgrade\.inExperiment\) return \{ owner: 'content-upgrade'/);
  assert.match(injectorSource, /data-bw-private-tour-cta/);
  assert.doesNotMatch(injectorSource, /transport_ticket_pocket_card_v1/);
  assert.doesNotMatch(injectorSource, /berlin-ticket-machines/);
});

test('pilot uses a 50/50 Skip List gate and keeps unrelated posts on booking', () => {
  const normal = makeInjectorContext({ pathname: '/post/how-many-days-in-berlin' });
  assert.equal(normal.hooks.assignment().inExperiment, false);
  assert.equal(normal.hooks.slotDecision().owner, 'booking');

  const variant = makeInjectorContext({ pathname: '/post/how-many-days-in-berlin', random: 0.49, config: { stage: 'pilot' } });
  assert.equal(variant.hooks.assignment().variant, 'variant');
  assert.equal(variant.hooks.assignment().inExperiment, true);
  assert.equal(variant.hooks.assignment().assetId, 'berlin-skip-list');

  const control = makeInjectorContext({ pathname: '/post/how-many-days-in-berlin', random: 0.51, config: { stage: 'pilot' } });
  assert.equal(control.hooks.assignment().variant, 'control');
  assert.equal(control.hooks.assignment().inExperiment, true);
  assert.equal(control.hooks.assignment().controlType, 'private-tour');

  const unrelated = makeInjectorContext({ pathname: '/post/unrelated', config: { stage: 'pilot' } });
  assert.equal(unrelated.hooks.assignment().inExperiment, false);
  assert.equal(unrelated.hooks.slotDecision().owner, 'booking');
});

test('forced QA choices are deterministic and history keeps slot priority', () => {
  const variant = makeInjectorContext({ pathname: '/post/unrelated', search: '?bwDownloadLead=variant' });
  assert.equal(variant.hooks.assignment().variant, 'variant');
  assert.equal(variant.hooks.assignment().inExperiment, true);
  assert.equal(variant.hooks.assignment().qa, true);
  assert.equal(variant.hooks.slotDecision().owner, 'content-upgrade');

  const control = makeInjectorContext({ pathname: '/post/unrelated', search: '?bwDownloadLead=control' });
  assert.equal(control.hooks.assignment().variant, 'control');
  assert.equal(control.hooks.assignment().inExperiment, true);
  assert.equal(control.hooks.slotDecision().owner, 'content-upgrade');

  const both = makeInjectorContext({
    pathname: '/post/unrelated',
    search: '?bwHistoryLead=variant&bwDownloadLead=variant',
  });
  assert.equal(both.historyHooks.assignment().inExperiment, true);
  assert.equal(both.hooks.slotDecision().owner, 'history');
});

test('all 12 primary slugs are eligible only in pilot', () => {
  for (const slug of skipSlugs) {
    const ctx = makeInjectorContext({ pathname: `/post/${slug}`, config: { stage: 'pilot' }, random: 0.49 });
    assert.equal(ctx.hooks.assignment().inExperiment, true, slug);
    assert.equal(ctx.hooks.assignment().variant, 'variant', slug);
  }
  for (const slug of secondarySlugs) {
    const ctx = makeInjectorContext({ pathname: `/post/${slug}`, config: { stage: 'pilot' }, random: 0.49 });
    assert.equal(ctx.hooks.assignment().inExperiment, false, slug);
  }
});

test('stable assignment is persisted only after analytics consent', () => {
  const ctx = makeInjectorContext({ analytics: false, random: 0.05, config: { stage: 'pilot' } });
  const before = ctx.hooks.assignment();
  assert.equal(before.variant, 'variant');
  assert.equal(before.assignmentId, '');
  assert.equal(ctx.store.has(ctx.hooks.storageKey), false);

  ctx.setAnalytics(true);
  const after = ctx.hooks.assignment();
  assert.match(after.assignmentId, /^cua_[a-f0-9]{32}$/);
  assert.equal(ctx.store.has(ctx.hooks.storageKey), true);

  ctx.setRandom(0.99);
  ctx.hooks.resetBucket();
  const repeated = ctx.hooks.assignment();
  assert.equal(repeated.variant, 'variant');
  assert.equal(repeated.assignmentId, after.assignmentId);
});

test('invalid config and element failure paths restore the existing booking control', () => {
  const brokenConfig = new Proxy({}, { get() { throw new Error('broken config'); } });
  const ctx = makeInjectorContext({ config: brokenConfig });
  assert.equal(ctx.hooks.assignment().inExperiment, false);
  assert.equal(ctx.hooks.slotDecision().owner, 'booking');
  assert.equal(ctx.hooks.fallbackAssignment().variant, 'control');
  assert.match(injectorSource, /restoreContentUpgradeBookingControl\(requestedPath, assignment, error/);
  assert.match(injectorSource, /data-bw-content-upgrade-ready/);
  assert.match(injectorSource, /content-upgrade variant unavailable; restored booking control/);
});

test('transport collisions are absent from the global FDR bridge map', () => {
  const start = journeySource.indexOf('  var FDR_BRIDGE_SLUGS = {');
  const end = journeySource.indexOf('\n  };', start);
  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  const bridgeMap = journeySource.slice(start, end);
  [
    'berlin-public-transport-explained-for-tourists-u-bahn-s-bahn-tram-bus',
    'berlin-ab-abc-ticket-zones',
    'do-you-really-need-to-validate-your-ticket-on-berlin-trains',
    'deutschlandticket-berlin-tourists',
  ].forEach((slug) => assert.equal(bridgeMap.includes(slug), false, slug));
  assert.equal(bridgeMap.includes('how-to-get-from-berlin-airport-to-alexanderplatz-the-easy-way'), true);
});

test('orchestrator and component agree on the canonical Skip List version', () => {
  assert.match(elementSource, /DEFAULT_ASSET_VERSION = '2026-08-v1'/);
  assert.match(injectorSource, /assetVersion: '2026-08-v1'/);
  assert.match(injectorSource, /element\.setAttribute\('asset-version', assignment\.assetVersion\)/);
});

test('orchestrator sends the lead-asset contract without PII and records the private-tour control', () => {
  [
    'bw_lead_asset_experiment_view',
    'bw_lead_asset_gate_view',
    'bw_lead_asset_form_start',
    'bw_lead_asset_submit',
    'bw_lead_asset_control_booking_click',
  ].forEach((eventName) => assert.equal(injectorSource.includes(eventName), true, eventName));
  assert.equal(injectorSource.includes('bw_download_'), false);

  const ctx = makeInjectorContext({ analytics: true, config: { stage: 'pilot' } });
  const assignment = ctx.hooks.assignment();
  const payload = ctx.hooks.eventPayload('bw_lead_asset_experiment_view', assignment);
  assert.equal(payload.assetId, 'berlin-skip-list');
  assert.equal(payload.assetVersion, '2026-08-v1');
  assert.equal(payload.experiment, 'berlin_skip_list_v1');
  assert.equal(payload.controlType, 'private-tour');
  assert.match(payload.controlUrl, /www\.berlinwalk\.com\/private-tour/);
  assert.equal(payload.analyticsConsent, true);
  assert.match(payload.assignmentId, /^cua_[a-f0-9]{32}$/);
  assert.equal(JSON.stringify(payload).includes('@'), false);
});
