import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const injectorPath = path.join(root, 'js', 'lead-form-inject.js');
const journeyPath = path.join(root, 'js', 'blog-journey-inject.js');
const injectorSource = await readFile(injectorPath, 'utf8');
const journeySource = await readFile(journeyPath, 'utf8');
const blogIndex = JSON.parse(await readFile(path.join(root, 'blog-index', 'data.json'), 'utf8'));

function injectorHooks() {
  const listeners = new Map();
  const document = {
    readyState: 'loading',
    body: null,
    head: { appendChild() {} },
    addEventListener(name, fn) { listeners.set(`document:${name}`, fn); },
    removeEventListener() {},
    querySelector() { return null; },
    querySelectorAll() { return []; },
    getElementById() { return null; },
  };
  const location = {
    pathname: '/post/global-contract-fixture',
    search: '',
    href: 'https://www.berlinwalk.com/post/global-contract-fixture',
  };
  const window = {
    BW_BLOG_INJECTOR_TEST_HOOKS: true,
    document,
    location,
    window: null,
    addEventListener(name, fn) { listeners.set(`window:${name}`, fn); },
    removeEventListener() {},
    setTimeout() { return 1; },
    clearTimeout() {},
    setInterval() { return 1; },
    getComputedStyle(node) { return node && node.computedStyle || { display: 'block', visibility: 'visible' }; },
    consentPolicyManager: { getCurrentConsentPolicy() { return { analytics: false }; } },
  };
  window.window = window;
  const context = vm.createContext({
    window,
    document,
    location,
    console: { log() {}, warn() {} },
    URL,
    URLSearchParams,
    Date,
    Intl,
    Math,
    Number,
    Object,
    JSON,
    Promise,
    CustomEvent: class CustomEvent {},
    MutationObserver: class { observe() {} disconnect() {} },
    setTimeout() { return 1; },
    clearTimeout() {},
    setInterval() { return 1; },
  });
  vm.runInContext(injectorSource, context, { filename: injectorPath });
  assert.ok(window.__bwBlogInjectorTestHooks);
  return window.__bwBlogInjectorTestHooks;
}

function fakeBody(tags) {
  const body = {
    querySelectorAll() { return body.blocks; },
    contains(node) { return body.blocks.includes(node); },
  };
  body.blocks = tags.map((tag, index) => ({
    nodeType: 1,
    tagName: tag,
    textContent: `Article block ${index + 1}`,
    parentElement: body,
    parentNode: body,
    children: [],
    closest(selector) {
      if (selector.includes('figure,li') && (tag === 'FIGURE' || tag === 'LI')) return null;
      return null;
    },
  }));
  return body;
}

function nestedLastBlockBody() {
  const body = { querySelectorAll() { return body.blocks; } };
  const laterWrapper = { parentNode: body, parentElement: body, nextElementSibling: null };
  const firstWrapper = { parentNode: body, parentElement: body, nextElementSibling: laterWrapper };
  const paddedWrapper = { parentNode: firstWrapper, parentElement: firstWrapper, nextElementSibling: null };
  const first = {
    nodeType: 1, tagName: 'P', textContent: 'First block', parentNode: paddedWrapper,
    parentElement: paddedWrapper, nextElementSibling: null, children: [], closest() { return null; },
  };
  const anchor = {
    nodeType: 1, tagName: 'H2', textContent: 'Anchor block', parentNode: paddedWrapper,
    parentElement: paddedWrapper, nextElementSibling: null, children: [], closest() { return null; },
  };
  const later = {
    nodeType: 1, tagName: 'P', textContent: 'Later block', parentNode: laterWrapper,
    parentElement: laterWrapper, nextElementSibling: null, children: [], closest() { return null; },
  };
  first.nextElementSibling = anchor;
  body.blocks = [first, anchor, later];
  return { body, anchor, firstWrapper };
}

test('global contract covers every indexed slug without a legacy allowlist', () => {
  const posts = blogIndex.allPosts.filter((post) => post && post.slug);
  assert.ok(posts.length > 100);
  assert.match(injectorSource, /location\.pathname\.indexOf\('\/post\/'\) === 0/);
  assert.match(injectorSource, /BW_ENABLE_BLOG_BOOKING|bwBlogBooking=1/);
  assert.doesNotMatch(injectorSource, /CONTENT_UPGRADE_MAGNETS|bw-history-lead-magnet|bw-content-upgrade-card|bw-date-check-teaser/);
  assert.doesNotMatch(injectorSource, /historyLead|contentUpgrade|legacyMagnet|MAGNET_SLUG|eligibleSlug/i);
  assert.match(injectorSource, /data-bw-blog-booking/);
  assert.match(injectorSource, /data-bw-date-check-card/);
  for (const post of posts) assert.ok(String(post.slug).trim().length > 0);
});

test('Date Check insertion anchors after roughly 10% of short, long and headingless bodies', () => {
  const hooks = injectorHooks();
  assert.equal(hooks.dateCheckAnchorIndex(0), -1);
  assert.equal(hooks.dateCheckAnchorIndex(1), 0);
  assert.equal(hooks.dateCheckAnchorIndex(2), 0);
  assert.equal(hooks.dateCheckAnchorIndex(10), 0);
  assert.equal(hooks.dateCheckAnchorIndex(20), 1);
  assert.equal(hooks.dateCheckAnchorIndex(100), 9);

  for (const count of [1, 2, 10, 20, 100]) {
    const body = fakeBody(Array.from({ length: count }, () => 'P'));
    const point = hooks.findDateCheckInsertionPoint(body);
    assert.equal(point.parent, body);
    assert.equal(point.after, body.blocks[hooks.dateCheckAnchorIndex(count)]);
  }
  const headingless = fakeBody(['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P']);
  assert.equal(hooks.findDateCheckInsertionPoint(headingless).after, headingless.blocks[0]);
  assert.equal(hooks.findDateCheckInsertionPoint(fakeBody([])), null);

  const bookingBody = fakeBody(['H2', 'P', 'H2', 'P', 'P', 'H2', 'P']);
  assert.equal(hooks.findBookingInsertionPoint(bookingBody).after, bookingBody.blocks[3]);
});

test('Date Check escapes a padded Wix wrapper when its anchor is the last real child', () => {
  const hooks = injectorHooks();
  const { body, anchor, firstWrapper } = nestedLastBlockBody();
  const point = hooks.insertionTarget(anchor, body);
  assert.equal(point.parent, body);
  assert.equal(point.after, firstWrapper);
});

test('Date Check compensates for a padded Wix parent without creating overflow on an unpadded parent', () => {
  const hooks = injectorHooks();
  const values = new Map();
  const style = {
    setProperty(name, value, priority = '') { values.set(name, { value, priority }); },
    removeProperty(name) { values.delete(name); },
  };
  const card = { style, getBoundingClientRect() { return { left: 54, right: 563 }; } };
  const body = { getBoundingClientRect() { return { left: 36, right: 581 }; } };
  assert.equal(hooks.syncSurfaceGutters(card, body), true);
  assert.deepEqual(values.get('width'), { value: 'calc(100% + 36px)', priority: '' });
  assert.deepEqual(values.get('margin-left'), { value: '-18px', priority: 'important' });
  assert.deepEqual(values.get('margin-right'), { value: '-18px', priority: 'important' });

  card.getBoundingClientRect = () => ({ left: 36, right: 581 });
  assert.equal(hooks.syncSurfaceGutters(card, body), true);
  assert.equal(values.size, 0);
});

test('Date Check handoff keeps arrival, nights and exact blog UTM contract', () => {
  const hooks = injectorHooks();
  const target = hooks.dateCheckTargetUrl(
    'https://www.berlinwalk.com/berlin-dates-check',
    'where-to-stay-in-berlin',
    '2026-09-17',
    '4',
    'https://www.berlinwalk.com/post/where-to-stay-in-berlin'
  );
  assert.equal(target.pathname, '/berlin-dates-check');
  assert.deepEqual(Object.fromEntries(target.searchParams), {
    arrival: '2026-09-17',
    nights: '4',
    utm_source: 'blog',
    utm_medium: 'inline_tool',
    utm_campaign: 'berlin_date_check',
    utm_content: 'where-to-stay-in-berlin',
  });
  assert.equal(hooks.validDateFields('2026-09-17', '4', '2026-08-22', '2029-08-22'), true);
  assert.equal(hooks.validDateFields('', '4', '2026-08-22', '2029-08-22'), false);
  assert.equal(hooks.validDateFields('2026-09-17', '8', '2026-08-22', '2029-08-22'), false);
  assert.equal(hooks.validDateFields('2025-09-17', '4', '2026-08-22', '2029-08-22'), false);
  assert.equal(hooks.validDateFields('2026-02-31', '4', '2026-01-01', '2029-01-01'), false);
});

test('Date Check is one idempotent no-email surface with consent-safe first-party events', () => {
  assert.match(injectorSource, /removeDuplicateSurfaces\(BOOKING_MARKER\)/);
  assert.match(injectorSource, /removeDuplicateSurfaces\(DATE_CHECK_MARKER\)/);
  assert.match(injectorSource, /ensureSurfacePosition\(bookingPoint, booking\)/);
  assert.match(injectorSource, /ensureSurfacePosition\(datePoint, dateCard\)/);
  assert.match(injectorSource, /MutationObserver/);
  assert.match(injectorSource, /data-bw-blog-mobile-guide/);
  assert.match(injectorSource, /data-bw-blog-mobile-nav/);
  assert.match(injectorSource, /data-bw-blog-tool-prompt/);
  assert.match(injectorSource, /data-bw-blog-journey/);
  assert.match(injectorSource, /data-bw-leadform/);
  assert.match(injectorSource, /bw_date_check_blog_card_mount/);
  assert.match(injectorSource, /bw_date_check_blog_card_seen/);
  assert.match(injectorSource, /intersectionRatio < 0\.5/);
  assert.match(injectorSource, /bw_date_check_blog_card_start/);
  assert.match(injectorSource, /bw_date_check_blog_card_submit/);
  assert.match(injectorSource, /dataLayer\.push/);
  assert.match(injectorSource, /bw-date-check-blog-submit/);
  assert.doesNotMatch(injectorSource, /type=["']email["']/i);
  assert.equal((injectorSource.match(/data-bw-date-check-card/g) || []).length >= 1, true);
  assert.equal((injectorSource.match(/data-bw-blog-booking/g) || []).length >= 1, true);
});

test('Date Check mobile CSS resists Wix typography and Safari date-field overflow', () => {
  assert.match(injectorSource, /bw-date-check-blog-card__title/);
  assert.match(injectorSource, /\.bw-date-check-blog-card\[data-bw-date-check-card\] \.bw-date-check-blog-card__title\{[^}]*padding:0!important[^}]*color:#fff!important/);
  assert.match(injectorSource, /\.bw-date-check-blog-card\[data-bw-date-check-card\] \.bw-date-check-blog-card__copy\{[^}]*font:400 15px\/1\.48 Montserrat[^}]*color:rgba\(255,255,255,\.94\)!important/);
  assert.match(injectorSource, /\.bw-date-check-blog-card__field\{[^}]*min-width:0[^}]*max-width:100%/);
  assert.match(injectorSource, /input,.bw-date-check-blog-card__field select\{[^}]*min-inline-size:0[^}]*max-inline-size:100%/);
  assert.match(injectorSource, /input,.bw-date-check-blog-card__field select\{[^}]*height:54px;min-height:54px/);
  assert.match(injectorSource, /input,.bw-date-check-blog-card__field select\{height:52px;min-height:52px\}/);
  assert.match(injectorSource, /The result is built around your arrival date and number of nights\./);
  assert.match(injectorSource, /\.bw-date-check-blog-card__status:empty\{display:none\}/);
  assert.doesNotMatch(injectorSource, /not a generic Berlin week/);
  assert.doesNotMatch(injectorSource, /<p class="bw-date-check-blog-card__(?:eyebrow|copy|micro|status)"/);
});

test('journey keeps editorial tools, related guides and booking while removing fixed product promotions', () => {
  assert.match(journeySource, /Related guides/);
  assert.match(journeySource, /data-bw-blog-journey/);
  assert.match(journeySource, /bookingJourneyCard/);
  assert.match(journeySource, /toolJourneyCard/);
  assert.match(journeySource, /Quick Summary|quick-summary/);
  assert.match(journeySource, /FAQ|faq/);
  assert.doesNotMatch(journeySource, /FDR|fdr|TRIP_PLANNER|trip-planner|first-day-rescue|plannerJourneyCard|private-tour|content-upgrade/i);
  assert.doesNotMatch(journeySource, /berlin-trip-planner|berlin-first-day-rescue-plan/);
});
