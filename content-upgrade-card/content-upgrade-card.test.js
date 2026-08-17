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
  // 2026-08-18 coverage expansion (CODEX_HANDOFF_MAGNET_COVERAGE_100_20260818.md)
  'how-to-spend-a-sunday-in-berlin',
  'berlin-on-a-monday',
  'berlin-heatwave-day-plan',
  'is-berlin-safe-for-solo-travelers-an-honest-local-perspective',
  'berlin-last-day',
  'what-to-do-in-berlin-when-it-rains-12-indoor-activities-worth-your-time',
  'berlin-in-the-rain',
  'berlin-with-parents',
  'berlin-sights-near-alexanderplatz-walking-distance',
  'hidden-places-central-berlin',
  '7-best-photo-spots-in-berlin-most-tourists-walk-right-past',
  '5-mistakes-tourists-make-at-alexanderplatz',
  'berlin-tourist-scams',
  'berlin-hop-on-hop-off-bus-worth-it',
  'what-to-book-in-advance-in-berlin',
  'bus-100-berlin-the-4-sightseeing-tour-locals-don-t-want-you-to-know-about',
  'free-things-to-do-in-berlin-2026',
];
// vegan is reserved for the Phase 2 food magnet; shops-open-sunday stays on the
// booking card. Both must remain outside every content-upgrade experiment.
const secondarySlugs = [
  'are-shops-open-on-sunday-in-berlin-what-you-need-to-know',
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
  // Deliverability is still warming up, so the success screen must always tell
  // people where the email actually landed.
  assert.match(elementSource, /class="spam-note"/);
  assert.match(elementSource, /Look in spam or junk/);
  assert.match(elementSource, /\.spam-note\{[^}]*color:#123d18/);
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

test('orchestrator keeps the 29 Skip List slugs and registers the approved magnet fleet', () => {
  const ctx = makeInjectorContext({ config: { stage: 'pilot' } });
  assert.deepEqual(Array.from(ctx.hooks.slugs).sort(), [...skipSlugs].sort());
  assert.deepEqual(skipSlugs.filter((slug) => historySlugs.includes(slug)), []);
  assert.deepEqual(skipSlugs.filter((slug) => secondarySlugs.includes(slug)), []);
  assert.equal(ctx.hooks.safetySlug, '');
  assert.equal(ctx.hooks.placement, 'blog_inline_booking_slot');
  assert.equal(ctx.hooks.magnetConfigs.length, 4);
  assert.deepEqual(JSON.parse(JSON.stringify(ctx.hooks.magnetConfigs[0])), {
    experimentId: 'berlin_skip_list_v1',
    assetId: 'berlin-skip-list',
    assetVersion: '2026-08-v1',
    storageKey: 'bwContentUpgrade.berlinSkipList.v1',
    apiBase: 'https://app.berlinwalk.com/api/download-lead',
    elementUrl: 'https://fenerszymanski.github.io/berlinwalk-widgets/content-upgrade-card/content-upgrade-card-element.js?v=20260817-magnet1',
    placement: 'blog_inline_booking_slot',
    controlType: 'private-tour',
    controlUrl: 'https://www.berlinwalk.com/private-tour',
    slugs: [...skipSlugs],
  });
  assert.equal(JSON.stringify(ctx.hooks.magnetConfigs.slice(1).map((magnet) => magnet.assetId)), JSON.stringify([
    'berlin-pass-decision-sheet',
    'berlin-arrival-card',
    'berlin-day-trip-compare-sheet'
  ]));
  assert.match(injectorSource, /if \(history\.inExperiment\) return \{ owner: 'history'/);
  assert.match(injectorSource, /if \(contentUpgrade\.inExperiment\) return \{ owner: 'content-upgrade'/);
  assert.match(injectorSource, /data-bw-private-tour-cta/);
  assert.doesNotMatch(injectorSource, /transport_ticket_pocket_card_v1/);
  // berlin-ticket-machines is deliberately IN the arrival cluster since the
  // 2026-08-18 expansion; the old Transport Pocket Card exclusion no longer
  // applies to the slug itself, only to the retired experiment id above.
});

test('the four magnet slug lists are disjoint and exclude the history experiment slugs', () => {
  const ctx = makeInjectorContext({ config: { stage: 'pilot' } });
  const lists = ctx.hooks.magnetConfigs.map((magnet) => magnet.slugs);
  const seen = new Map();
  for (const [index, list] of lists.entries()) {
    for (const slug of list) {
      assert.equal(seen.has(slug), false, `${slug} appears in magnets ${seen.get(slug)} and ${index}`);
      seen.set(slug, index);
      assert.equal(historySlugs.includes(slug), false, `${slug} collides with the history experiment`);
    }
  }
  assert.equal(seen.size, 103);
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

test('all 29 primary slugs are eligible only in pilot', () => {
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

test('component supports an optional config-driven calculator gate mode, teaser mode unchanged by default', () => {
  // Off by default: an element with no gate-mode attribute still renders the
  // original static teaser + gate-copy path used by the other three magnets.
  assert.match(elementSource, /class="teasers" aria-label="Three Skip List examples"/);
  assert.match(elementSource, /class="gate-copy"/);
  assert.match(elementSource, /copy\.gateCopy/);

  // On path: gated behind gate-mode="calculator" + a validated calc-config object.
  assert.match(elementSource, /getAttribute\('gate-mode'\)/);
  assert.match(elementSource, /parseJsonObjectAttribute\(this, 'calc-config'\)/);
  assert.match(elementSource, /_calc\(\)\s*\{/);
  assert.match(elementSource, /mode === 'calculator'/);
  assert.match(elementSource, /class="calc-q"/);
  assert.match(elementSource, /class="calc-opt"/);
  assert.match(elementSource, /aria-pressed/);
  assert.match(elementSource, /class="calc-verdict"/);
  assert.match(elementSource, /class="calc-stamp"/);
  assert.match(elementSource, /bw-content-upgrade-calc-done/);

  // Shadow DOM only, yellow-surface verdict box uses the required dark-green text.
  assert.match(elementSource, /this\._root = this\.attachShadow/);
  assert.match(elementSource, /\.calc-verdict\{background:#fffbe0/);
  assert.match(elementSource, /\.calc-verdict-text\{color:#123d18!important/);
});

test('pass magnet is the only one wired to the calculator gate; registry ids untouched', () => {
  assert.match(injectorSource, /experimentId: 'berlin_pass_calculator_v1'/);
  assert.match(injectorSource, /storageKey: 'bwContentUpgrade\.berlinPassCalc\.v1'/);
  assert.match(injectorSource, /assetId: 'berlin-pass-decision-sheet'/);
  assert.match(injectorSource, /submitLabel: 'Email me the sheet with my numbers'/);
  assert.equal(injectorSource.includes('berlin_pass_sheet_v1'), false);
  assert.equal(injectorSource.includes('bwContentUpgrade.berlinPassSheet.v1'), false);

  // Isolation: exactly one magnet (pass) carries gate-mode/calc-config; the
  // other three (skip-list, arrival-card, day-trip) are untouched.
  assert.equal((injectorSource.match(/gateMode:/g) || []).length, 1);
  assert.equal((injectorSource.match(/calcConfig:/g) || []).length, 1);
  assert.match(injectorSource, /if \(copy\.gateMode\) element\.setAttribute\('gate-mode', copy\.gateMode\);/);
  assert.match(injectorSource, /if \(copy\.calcConfig\) element\.setAttribute\('calc-config', JSON\.stringify\(copy\.calcConfig\)\);/);

  const ctx = makeInjectorContext({ config: { stage: 'pilot' } });
  const passMagnet = ctx.hooks.magnetConfigs[1];
  assert.equal(passMagnet.assetId, 'berlin-pass-decision-sheet');
  assert.equal(passMagnet.experimentId, 'berlin_pass_calculator_v1');
  assert.equal(passMagnet.storageKey, 'bwContentUpgrade.berlinPassCalc.v1');
  assert.equal(passMagnet.elementUrl.includes('?v=20260817-magnet1'), true);
});

test('pass calculator verdict table matches the locked prices and gating exactly', () => {
  const start = injectorSource.indexOf('calcConfig: {');
  const end = injectorSource.indexOf("placeholder: 'Answer all three questions.'", start);
  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  const block = injectorSource.slice(start, end);

  // Three locked questions, exact prompts and option values.
  assert.equal(block.includes('How many days are you in Berlin?'), true);
  assert.equal(block.includes('Be honest: how many paid museums will you actually enter?'), true);
  assert.equal(block.includes('Do you want transit included?'), true);
  [
    "value: '1', label: '1'",
    "value: '2-3', label: '2-3'",
    "value: '4+', label: '4+'",
    "value: '0-1', label: '0-1'",
    "value: '3+', label: '3+'",
    "value: 'Yes', label: 'Yes'",
    "value: 'No', label: 'No'",
  ].forEach((needle) => assert.equal(block.includes(needle), true, needle));

  // Museum axis (evaluated first) — every locked base line, verbatim.
  assert.equal(block.includes('No pass. Pay single tickets; a lot of the best things are free anyway.'), true);
  assert.equal(block.includes('the €24 island day ticket wins (two singles are €28)'), true);
  assert.equal(block.includes('stay on Museum Island and take the €24 island day ticket. The €32 Museumspass only wins if you leave the island.'), true);
  assert.equal(block.includes("museums: '3+', days: ['2-3', '4+'], line: 'The €32 Museumspass wins. You break even inside the third museum and it covers 30+ museums over 3 consecutive days.'"), true);

  // Transit addendum — only appended when transit = Yes; €32 stays inside the M=3+/D>=2 line.
  assert.equal(block.includes('For transit, a €11.20 AB day ticket per day is the honest baseline. The €39.50 WelcomeCard 72h is €5.90 more than three day tickets; it only pays off if you use the discounts.'), true);
  assert.equal(block.includes("museums: '3+', days: '2-3', line: 'If you want transit plus free Museum Island entry in one card, the €62 WelcomeCard Museum Island is €3.60 cheaper than Museumspass plus day tickets, but it covers only the island.'"), true);
  assert.equal(block.includes("museums: '3+', days: '4+', line: 'Museumspass runs 3 consecutive days; pick which 3.'"), true);
  assert.equal(block.includes('Prices checked 16 August 2026'), true);

  // No invented numbers: every euro figure in the block is one of the locked prices.
  const lockedAmounts = ['€24', '€28', '€32', '€11.20', '€39.50', '€5.90', '€62', '€3.60'];
  const foundAmounts = block.match(/€[0-9]+(?:\.[0-9]+)?/g) || [];
  foundAmounts.forEach((amount) => assert.equal(lockedAmounts.includes(amount), true, 'unexpected amount: ' + amount));
});

test('calc-done reuses the existing gate_view/form_start analytics mechanism, no new API fields', () => {
  assert.equal(injectorSource.includes('bw_lead_asset_calc_done'), true);
  assert.match(injectorSource, /bw-content-upgrade-calc-done['"]?,\s*function \(\) \{\s*sendContentUpgradeEvent\('bw_lead_asset_calc_done', assignment\);/);
  // download-lead submission payload is untouched: no calc-specific field added.
  const payloadStart = elementSource.indexOf('_submissionPayload(form, email, copy, overrides) {');
  const payloadEnd = elementSource.indexOf('\n    }', payloadStart);
  assert.notEqual(payloadStart, -1);
  const payloadBody = elementSource.slice(payloadStart, payloadEnd);
  assert.equal(payloadBody.includes('calcAnswers'), false);
  assert.equal(payloadBody.includes('verdict'), false);
  assert.equal(payloadBody.includes('days'), false);
  assert.equal(payloadBody.includes('museums'), false);
});
