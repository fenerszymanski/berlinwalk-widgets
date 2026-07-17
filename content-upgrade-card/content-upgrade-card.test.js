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

const exactConsentCopy = 'By requesting this card, I agree to receive the Berlin Transport Ticket Pocket Card and occasional BerlinWalk emails about Berlin travel tips, new guides, products and walking tours. I can unsubscribe at any time. Read the Privacy Policy.';
const transportSlugs = [
  'berlin-public-transport-explained-for-tourists-u-bahn-s-bahn-tram-bus',
  'berlin-ticket-machines',
  'buy-berlin-transport-tickets-on-your-phone',
  'berlin-ab-abc-ticket-zones',
  'do-you-really-need-to-validate-your-ticket-on-berlin-trains',
  'berlin-u-bahn-fine',
  'deutschlandticket-berlin-tourists',
  'u-bahn-vs-s-bahn-berlin',
  'berlin-trams-guide',
  'berlin-night-transport',
  'bus-100-berlin-the-4-sightseeing-tour-locals-don-t-want-you-to-know-about',
  'berlin-public-transport-ferries',
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
  const pathname = options.pathname || '/post/berlin-ticket-machines';
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

test('component keeps one explicit bundled disclosure and no checkbox', () => {
  assert.equal(elementSource.includes(exactConsentCopy), true);
  assert.match(elementSource, /transport-ticket-pocket-card-bundled-v1-2026-07-18/);
  assert.match(elementSource, /consent:\s*true/);
  assert.doesNotMatch(elementSource, /type=["']checkbox["']/i);
  assert.doesNotMatch(elementSource, /newsletterConsent/);
  assert.match(elementSource, /Email me the ticket card/);
  assert.match(elementSource, /https:\/\/app\.berlinwalk\.com\/api\/download-lead/);
  assert.match(elementSource, /url\.searchParams\.set\('action', 'submit'\)/);
  assert.match(elementSource, /Check your inbox\./);
  assert.match(elementSource, /Confirm your email to open the ticket card\./);
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
  assert.match(elementSource, /data-bw-content-upgrade-ready/);
  assert.match(elementSource, /bw-content-upgrade-error/);
});

test('orchestrator owns the exact 12 transport slugs with no history overlap', () => {
  const ctx = makeInjectorContext({ config: { stage: 'pilot' } });
  assert.deepEqual(Array.from(ctx.hooks.slugs).sort(), [...transportSlugs].sort());
  assert.deepEqual(transportSlugs.filter((slug) => historySlugs.includes(slug)), []);
  assert.equal(ctx.hooks.safetySlug, 'berlin-ticket-machines');
  assert.equal(ctx.hooks.placement, 'blog_inline_booking_slot');
  assert.match(injectorSource, /if \(history\.inExperiment\) return \{ owner: 'history'/);
  assert.match(injectorSource, /if \(contentUpgrade\.inExperiment\) return \{ owner: 'content-upgrade'/);
  assert.match(injectorSource, /document\.querySelector\('\[' \+ MARKER \+ '\]'\)/);
  assert.match(injectorSource, /element\.setAttribute\(MARKER, '1'\)/);
});

test('normal traffic remains booking-only while forced query choices are deterministic', () => {
  const normal = makeInjectorContext({ pathname: '/post/berlin-ticket-machines' });
  assert.equal(normal.hooks.assignment().inExperiment, false);
  assert.equal(normal.hooks.slotDecision().owner, 'booking');

  const variant = makeInjectorContext({ pathname: '/post/unrelated', search: '?bwDownloadLead=variant' });
  assert.equal(variant.hooks.assignment().variant, 'variant');
  assert.equal(variant.hooks.assignment().inExperiment, true);
  assert.equal(variant.hooks.assignment().qa, true);
  assert.equal(variant.hooks.slotDecision().owner, 'content-upgrade');

  const control = makeInjectorContext({ pathname: '/post/unrelated', search: '?bwDownloadLead=control' });
  assert.equal(control.hooks.assignment().variant, 'control');
  assert.equal(control.hooks.assignment().inExperiment, true);
  assert.equal(control.hooks.slotDecision().owner, 'content-upgrade');

  const killed = makeInjectorContext({ pathname: '/post/berlin-ticket-machines', search: '?bwDownloadLead=0', config: { stage: 'pilot' } });
  assert.equal(killed.hooks.assignment().inExperiment, false);
  assert.equal(killed.hooks.slotDecision().owner, 'booking');
});

test('history retains strict slot priority when both products are forced', () => {
  const ctx = makeInjectorContext({
    pathname: '/post/unrelated',
    search: '?bwHistoryLead=variant&bwDownloadLead=variant',
  });
  assert.equal(ctx.historyHooks.assignment().inExperiment, true);
  assert.equal(ctx.hooks.assignment().inExperiment, true);
  assert.equal(ctx.hooks.slotDecision().owner, 'history');
  assert.equal(ctx.hooks.slotDecision().assignment.variant, 'variant');
});

test('24-hour safety is 10% only on berlin-ticket-machines', () => {
  const startedAt = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const variant = makeInjectorContext({
    pathname: '/post/berlin-ticket-machines',
    random: 0.05,
    config: { stage: 'safety', safetyStartedAt: startedAt },
  });
  assert.equal(variant.hooks.effectiveStage(), 'ramp');
  assert.equal(variant.hooks.assignment().variant, 'variant');
  assert.equal(variant.hooks.assignment().inExperiment, true);

  const control = makeInjectorContext({
    pathname: '/post/berlin-ticket-machines',
    random: 0.15,
    config: { stage: 'safety', safetyStartedAt: startedAt },
  });
  assert.equal(control.hooks.assignment().variant, 'control');
  assert.equal(control.hooks.assignment().inExperiment, true);

  const other = makeInjectorContext({
    pathname: '/post/berlin-ab-abc-ticket-zones',
    random: 0.05,
    config: { stage: 'safety', safetyStartedAt: startedAt },
  });
  assert.equal(other.hooks.assignment().inExperiment, false);
});

test('safety advances after 24 hours to 90/10 pilot on all 12 slugs', async (t) => {
  const startedAt = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();
  for (const slug of transportSlugs) {
    await t.test(slug, () => {
      const variant = makeInjectorContext({
        pathname: `/post/${slug}`,
        random: 0.89,
        config: { stage: 'safety', safetyStartedAt: startedAt },
      });
      assert.equal(variant.hooks.effectiveStage(), 'pilot');
      assert.equal(variant.hooks.assignment().variant, 'variant');
      assert.equal(variant.hooks.assignment().inExperiment, true);

      const control = makeInjectorContext({
        pathname: `/post/${slug}`,
        random: 0.95,
        config: { stage: 'safety', safetyStartedAt: startedAt },
      });
      assert.equal(control.hooks.assignment().variant, 'control');
      assert.equal(control.hooks.assignment().inExperiment, true);
    });
  }
});

test('stable assignment is persisted only after analytics consent', () => {
  const ctx = makeInjectorContext({
    analytics: false,
    random: 0.05,
    config: { stage: 'pilot' },
  });
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

test('all four transport collisions are absent from the global FDR bridge map', () => {
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

test('orchestrator and component agree on the canonical asset version', () => {
  assert.match(elementSource, /DEFAULT_ASSET_VERSION = '2026-07-v1'/);
  assert.match(injectorSource, /CONTENT_UPGRADE_ASSET_VERSION = '2026-07-v1'/);
  assert.match(injectorSource, /element\.setAttribute\('asset-version', CONTENT_UPGRADE_ASSET_VERSION\)/);
});

test('orchestrator uses the backend lead-asset event contract without PII', () => {
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
  assert.equal(payload.assetId, 'berlin-transport-ticket-pocket-card');
  assert.equal(payload.assetVersion, '2026-07-v1');
  assert.equal(payload.analyticsConsent, true);
  assert.match(payload.assignmentId, /^cua_[a-f0-9]{32}$/);
  assert.equal(JSON.stringify(payload).includes('@'), false);
});
