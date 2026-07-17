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
const eligibleSlugs = [
  'why-berlin-doesn-t-have-a-beautiful-old-town-and-why-that-s-the-point',
  'why-berlin-s-streets-are-so-wide-it-wasn-t-always-the-plan',
  'where-was-the-berlin-wall-interactive-map',
  'the-ampelmann-how-a-traffic-light-became-berlin-s-most-beloved-symbol',
  'unter-den-linden-berlin',
  'why-is-berlin-founding-year-1237',
];
const exactConsentCopy = 'Email me Story 2 now and Story 3 about 48 hours later. These two emails include Berlin history and may also include information about BerlinWalk walking tours. I can unsubscribe at any time. Read the Privacy Policy.';
const exactInlineConsentCopy = 'Send me Story 2 now and Story 3 in about 48 hours. They may include BerlinWalk tour information.';
const exactNewsletterCopy = 'Also send me occasional Berlin history, new articles and walking-tour updates after this series.';

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
    BW_DISABLE_HISTORY_LEAD: options.disableGlobal === true,
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

test('element keeps the series consent required and adds a separate optional newsletter choice', () => {
  assert.equal(elementSource.includes(exactConsentCopy), true);
  assert.equal(elementSource.includes(exactInlineConsentCopy), true);
  assert.equal(elementSource.includes(exactNewsletterCopy), true);
  assert.match(elementSource, /history-series-v2-2026-07-17/);
  assert.match(elementSource, /history-series-v3-compact-2026-07-17/);
  assert.match(elementSource, /history-newsletter-v1-2026-07-17/);
  assert.match(elementSource, /<strong>Optional newsletter<\/strong>/);
  assert.match(elementSource, /Check your inbox\. Click the confirmation link to open Story 2\./);
  assert.doesNotMatch(elementSource, /name="consent"[^>]*\schecked(?:\s|>)/);
  assert.doesNotMatch(elementSource, /name="newsletterConsent"[^>]*\schecked(?:\s|>)/);
  assert.match(elementSource, /newsletterConsent: Boolean\(newsletterConsent && newsletterConsent\.checked\)/);
  assert.match(elementSource, /newsletterConsentVersion: newsletterConsent && newsletterConsent\.checked \? NEWSLETTER_CONSENT_VERSION : ''/);
  assert.match(elementSource, /consentVersion: mode === 'inline' \? INLINE_CONSENT_VERSION : CONSENT_VERSION/);
  assert.match(elementSource, /analyticsAllowed\(\)/);
  assert.match(elementSource, /noindex,follow/);
  assert.match(elementSource, /credentials: 'include'/);
  assert.match(elementSource, /_resolveStoryAccess\(\)/);
  assert.match(elementSource, /payload\.access !== true/);
  assert.match(elementSource, /data-bw-history-access/);
  assert.doesNotMatch(elementSource, /Story 3 arrives 48 hours/);
});

test('standalone blog iframe can preserve canonical article attribution', () => {
  assert.match(elementSource, /function getUtm\(element\)/);
  assert.match(elementSource, /window\.BW_HISTORY_LEAD_EMBED_CONTEXT \|\| \{\}/);
  assert.match(elementSource, /element && element\.getAttribute\('source-slug'\)/);
  assert.match(elementSource, /function sourcePageUrl\(element\)/);
  assert.match(elementSource, /element && element\.getAttribute\('source-url'\)/);
  assert.match(elementSource, /sourceSlug: sourceSlug\(this\)/);
  assert.match(elementSource, /sourceUrl: sourcePageUrl\(this\)/);
  assert.match(elementSource, /pageUrl: sourcePageUrl\(this\)/);
  assert.match(elementSource, /utm: getUtm\(this\)/);
});

test('full mode keeps its host-page contrast defenses', () => {
  assert.match(elementSource, /class="bw-history-lead__gate-title" role="heading" aria-level="3"/);
  assert.match(elementSource, /class="bw-history-lead__gate-description"/);
  assert.match(elementSource, /class="bw-blog-tool-button"[^>]+data-bw-history-tour/);
  assert.match(elementSource, /\.bw-history-lead__gate-title\{color:#fff!important/);
  assert.match(elementSource, /\.bw-history-lead__gate-description\{color:#d7e7d3!important/);
  assert.match(elementSource, /\.bw-history-lead__tour a\.bw-blog-tool-button,[^}]+\{background:var\(--green\)!important;color:#fff!important/);
});

test('inline mode is a compact split offer with actual before/now photos and three delivery states', () => {
  assert.match(elementSource, /_renderInlineSampler\(storyId, story\)/);
  assert.match(elementSource, /class="bw-history-lead__inline-ribbon"/);
  assert.match(elementSource, /Read one place now\. I&[a-z]+;ll send the next two\./);
  assert.match(elementSource, /class="bw-history-lead__inline-grid"/);
  assert.match(elementSource, /class="bw-history-lead__inline-visual" data-bw-comparison/);
  assert.match(elementSource, /<figcaption>Before<\/figcaption>/);
  assert.match(elementSource, /<figcaption>Now<\/figcaption>/);
  assert.match(elementSource, /ultimate-berlin-trip-planner\/assets\/berlinwalk-logo-rounded\.png/);
  assert.equal(fs.existsSync(path.join(root, 'ultimate-berlin-trip-planner', 'assets', 'berlinwalk-logo-rounded.png')), true);
  assert.match(elementSource, /A palace became this park\./);
  assert.match(elementSource, /01<\/span><span class="bw-history-lead__step-state">Open/);
  assert.match(elementSource, /02<\/span><span class="bw-history-lead__step-state">Email now/);
  assert.match(elementSource, /03<\/span><span class="bw-history-lead__step-state">48 hours/);
  assert.match(elementSource, /Reveal Story 2/);
  assert.match(elementSource, /grid-template-columns:minmax\(0,1\.08fr\) minmax\(420px,\.92fr\)/);
  assert.match(elementSource, /@media\(max-width:899px\).*grid-template-columns:1fr/);
});

test('inline breakout sits above the real sticky blog sidebar without changing the booking control', () => {
  assert.match(elementSource, /bw-history-lead-magnet\[mode="inline"\]\{contain:inline-size;display:block;isolation:isolate;position:relative;z-index:9050\}/);
  assert.match(elementSource, /body\.bw-history-lead-inline-active \[data-bw-blog-post-body="1"\]\{z-index:auto!important\}/);
  assert.match(elementSource, /body\.bw-history-lead-inline-active \.bw-blog-sidebar\{z-index:9000!important\}/);
  assert.match(elementSource, /box-shadow:0 16px 32px rgba\(16,36,20,\.18\)/);
  assert.match(elementSource, /@media\(min-width:1024px\) and \(max-width:1279px\)\{\.bw-history-lead--inline\{max-width:none;width:calc\(100% \+ 280px\)\}\}/);
  assert.match(elementSource, /@media\(min-width:1280px\)\{\.bw-history-lead--inline\{max-width:none;width:1088px\}\}/);
  assert.match(elementSource, /document\.body\.classList\.add\('bw-history-lead-inline-active'\)/);
  assert.match(injectorSource, /function clearHistoryInlineLayering\(\)/);
  assert.match(injectorSource, /restoreBookingControl[\s\S]*clearHistoryInlineLayering\(\)/);
});

test('safety stage uses 10% on every eligible article for the first 24 hours', async (t) => {
  for (const slug of eligibleSlugs) {
    await t.test(slug, () => {
      const variant = makeInjectorContext({
        pathname: `/post/${slug}`,
        random: 0.05,
        config: { stage: 'safety', safetyStartedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
      });
      assert.equal(variant.hooks.effectiveStage(), 'ramp');
      assert.equal(variant.hooks.assignment().variant, 'variant');
      assert.equal(variant.hooks.assignment().inExperiment, true);

      const control = makeInjectorContext({
        pathname: `/post/${slug}`,
        random: 0.15,
        config: { stage: 'safety', safetyStartedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
      });
      assert.equal(control.hooks.assignment().variant, 'control');
      assert.equal(control.hooks.assignment().inExperiment, true);
    });
  }

  const unrelated = makeInjectorContext({
    pathname: '/post/unrelated',
    random: 0.05,
    config: { stage: 'safety', safetyStartedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
  });
  assert.equal(unrelated.hooks.assignment().inExperiment, false);
});

test('safety stage becomes 50/50 on every eligible article after 24 hours', async (t) => {
  for (const slug of eligibleSlugs) {
    await t.test(slug, () => {
      const variant = makeInjectorContext({
        pathname: `/post/${slug}`,
        random: 0.20,
        config: { stage: 'safety', safetyStartedAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString() },
      });
      assert.equal(variant.hooks.effectiveStage(), 'pilot');
      assert.equal(variant.hooks.assignment().variant, 'variant');

      const control = makeInjectorContext({
        pathname: `/post/${slug}`,
        random: 0.60,
        config: { stage: 'safety', safetyStartedAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString() },
      });
      assert.equal(control.hooks.assignment().variant, 'control');
      assert.equal(control.hooks.assignment().inExperiment, true);
    });
  }

  const alexanderplatz = makeInjectorContext({
    pathname: '/post/alexanderplatz-then-and-now-from-medieval-market-to-modern-chaos',
    random: 0.20,
    config: { stage: 'safety', safetyStartedAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString() },
  });
  assert.equal(alexanderplatz.hooks.assignment().inExperiment, false);
});

test('assignment ID persistence starts only after analytics consent and remains stable', () => {
  const ctx = makeInjectorContext({
    analytics: false,
    random: 0.05,
    config: { stage: 'ramp' },
  });
  const beforeConsent = ctx.hooks.assignment();
  assert.equal(beforeConsent.variant, 'variant');
  assert.equal(beforeConsent.assignmentId, '');
  assert.equal(ctx.store.has(ctx.hooks.storageKey), false);

  ctx.setAnalytics(true);
  const afterConsent = ctx.hooks.assignment();
  assert.equal(afterConsent.variant, 'variant');
  assert.match(afterConsent.assignmentId, /^hwa_[a-f0-9]{32}$/);
  assert.equal(ctx.store.has(ctx.hooks.storageKey), true);
  const persisted = JSON.parse(ctx.store.get(ctx.hooks.storageKey));
  assert.equal(persisted.assignmentId, afterConsent.assignmentId);
  assert.ok(Math.abs(persisted.bucket - 0.05) < 1e-8);

  ctx.setRandom(0.90);
  ctx.hooks.resetBucket();
  const repeated = ctx.hooks.assignment();
  assert.equal(repeated.variant, 'variant');
  assert.equal(repeated.assignmentId, afterConsent.assignmentId);
});

test('forced QA and kill-switch query parameters are deterministic', () => {
  const variant = makeInjectorContext({ pathname: '/post/unrelated', search: '?bwHistoryLead=variant' });
  const forced = variant.hooks.assignment();
  assert.equal(forced.variant, 'variant');
  assert.equal(forced.inExperiment, true);
  assert.equal(forced.qa, true);
  assert.equal(forced.stage, 'qa');
  assert.equal(forced.acquisitionCohort, 'blog_forced_qa');
  assert.equal(forced.placement, 'blog_inline_booking_slot');
  assert.equal(forced.assignmentId, '');

  const killed = makeInjectorContext({ search: '?bwHistoryLead=0', config: { stage: 'pilot' } });
  assert.equal(killed.hooks.assignment().variant, 'control');
  assert.equal(killed.hooks.assignment().inExperiment, false);

  const globallyKilled = makeInjectorContext({ disableGlobal: true, config: { stage: 'pilot' } });
  assert.equal(globallyKilled.hooks.assignment().variant, 'control');
  assert.equal(globallyKilled.hooks.assignment().inExperiment, false);
});

test('event payload carries PII-free cohort, placement, assignment and consent fields', () => {
  const ctx = makeInjectorContext({
    analytics: true,
    random: 0.05,
    pathname: '/post/where-was-the-berlin-wall-interactive-map',
    config: { stage: 'ramp' },
  });
  const assignment = ctx.hooks.assignment();
  const payload = ctx.hooks.eventPayload('bw_history_lead_experiment_view', assignment);
  assert.equal(payload.acquisitionCohort, 'blog_relevant_rollout');
  assert.equal(payload.placement, 'blog_inline_booking_slot');
  assert.equal(payload.analyticsConsentAtSubmit, true);
  assert.equal(payload.assignmentId, assignment.assignmentId);
  assert.match(payload.assignmentId, /^hwa_[a-f0-9]{32}$/);
  assert.equal(JSON.stringify(payload).includes('@'), false);

  assert.match(elementSource, /acquisitionCohort: tracking\.acquisitionCohort/);
  assert.match(elementSource, /placement: tracking\.placement/);
  assert.match(elementSource, /assignmentId: tracking\.assignmentId/);
  assert.match(elementSource, /analyticsConsentAtSubmit: tracking\.analyticsConsentAtSubmit/);
  assert.match(elementSource, /DIRECT_ACQUISITION_COHORT = 'direct_landing'/);
  assert.match(elementSource, /DIRECT_PLACEMENT = 'history_landing_full'/);
});

test('configuration and element failures are fail-safe to the existing booking control', () => {
  const brokenConfig = new Proxy({}, {
    get() { throw new Error('broken config'); },
  });
  const ctx = makeInjectorContext({ config: brokenConfig });
  const assignment = ctx.hooks.assignment();
  assert.equal(assignment.variant, 'control');
  assert.equal(assignment.inExperiment, false);
  assert.equal(ctx.hooks.fallbackAssignment().variant, 'control');
  assert.match(injectorSource, /restoreBookingControl\(requestedPath, assignment, error/);
  assert.match(injectorSource, /data-bw-history-lead-ready/);
  assert.match(injectorSource, /bw-history-lead-error/);
  assert.match(elementSource, /setAttribute\('data-bw-history-lead-ready', 'error'\)/);
});
