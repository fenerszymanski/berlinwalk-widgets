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
    querySelectorAll(selector = '') {
      const requested = new Set(String(selector).toUpperCase().split(',').map((tag) => tag.trim()));
      return body.blocks.filter((block) => !requested.size || requested.has(block.tagName));
    },
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

test('Date Check insertion stays after the tour card anchor and later editorial copy', () => {
  const hooks = injectorHooks();
  const bookingBody = fakeBody(['H2', 'P', 'H2', 'P', 'P', 'H2', 'P']);
  const bookingPoint = hooks.findBookingInsertionPoint(bookingBody);
  assert.equal(bookingPoint.after, bookingBody.blocks[3]);
  assert.equal(hooks.findDateCheckInsertionPoint(bookingBody, bookingPoint).after, bookingBody.blocks[6]);
  assert.equal(hooks.findDateCheckInsertionPoint(bookingBody, null), null);

  const shortBody = fakeBody(['H2', 'P']);
  const shortBookingPoint = hooks.findBookingInsertionPoint(shortBody);
  assert.equal(hooks.findDateCheckInsertionPoint(shortBody, shortBookingPoint), null);

  const photoBody = fakeBody(['P', 'FIGURE', 'P', 'H2', 'P', 'H2', 'P', 'P', 'H2', 'P', 'P']);
  const photoBookingPoint = hooks.findBookingInsertionPoint(photoBody);
  const photoDatePoint = hooks.findDateCheckInsertionPoint(photoBody, photoBookingPoint);
  assert.equal(photoBookingPoint.after, photoBody.blocks[6]);
  assert.equal(photoDatePoint.after, photoBody.blocks[9]);
  assert.notEqual(photoDatePoint.after, photoBody.blocks[1]);
  assert.ok(photoBody.blocks.indexOf(photoDatePoint.after) > photoBody.blocks.indexOf(photoBookingPoint.after));
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
  assert.equal(hooks.syncSurfaceGutters(card, body, true), true);
  assert.deepEqual(values.get('width'), { value: 'calc(100% + 36px)', priority: '' });
  assert.deepEqual(values.get('margin-left'), { value: '-18px', priority: 'important' });
  assert.deepEqual(values.get('margin-right'), { value: '-18px', priority: 'important' });

  card.getBoundingClientRect = () => ({ left: 36, right: 581 });
  assert.equal(hooks.syncSurfaceGutters(card, body, true), true);
  assert.equal(values.size, 0);
});

test('desktop surfaces use the repeated article text column instead of the wider Wix parent', () => {
  const hooks = injectorHooks();
  const makeBlock = (left, right, text = 'A real article paragraph with enough text') => ({
    nodeType: 1,
    tagName: 'P',
    textContent: text,
    parentElement: null,
    closest() { return null; },
    getBoundingClientRect() { return { left, right, width: right - left, height: 80 }; },
  });
  const blocks = [
    makeBlock(192, 932),
    makeBlock(192, 932),
    makeBlock(192, 932),
    makeBlock(92, 1032),
  ];
  const body = {
    querySelectorAll() { return blocks; },
    getBoundingClientRect() { return { left: 92, right: 1032, width: 940, height: 3000 }; },
  };
  blocks.forEach((block) => { block.parentElement = body; });
  assert.deepEqual({ ...hooks.findContentColumn(body) }, { left: 192, right: 932, width: 740, count: 3 });
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
  assert.match(injectorSource, /syncSurfaceGutters\(booking, body, false\)/);
  assert.match(injectorSource, /syncSurfaceGutters\(dateCard, body, true\)/);
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
  assert.match(injectorSource, /placement: 'blog_inline_after_tour'/);
  assert.match(injectorSource, /dataLayer\.push/);
  assert.match(injectorSource, /bw-date-check-blog-submit/);
  assert.doesNotMatch(injectorSource, /type=["']email["']/i);
  assert.equal((injectorSource.match(/data-bw-date-check-card/g) || []).length >= 1, true);
  assert.equal((injectorSource.match(/data-bw-blog-booking/g) || []).length >= 1, true);
});

test('Date Check mobile CSS and custom date display resist physical Safari overflow', () => {
  assert.match(injectorSource, /bw-date-check-blog-card__title/);
  assert.match(injectorSource, /\.bw-date-check-blog-card\[data-bw-date-check-card\] \.bw-date-check-blog-card__title\{[^}]*padding:0!important[^}]*color:#fff!important/);
  assert.match(injectorSource, /\.bw-date-check-blog-card\[data-bw-date-check-card\] \.bw-date-check-blog-card__copy\{[^}]*font:400 15px\/1\.48 Montserrat[^}]*color:rgba\(255,255,255,\.94\)!important/);
  assert.match(injectorSource, /\.bw-date-check-blog-card__field\{[^}]*min-width:0[^}]*max-width:100%/);
  assert.match(injectorSource, /bw-date-check-blog-card__date-control\{[^}]*overflow:hidden[^}]*contain:inline-size/);
  assert.match(injectorSource, /bw-date-check-blog-card__date-control input\{[^}]*width:100%!important[^}]*opacity:0!important/);
  assert.match(injectorSource, /bw-date-check-blog-card__date-display/);
  assert.match(injectorSource, /new Intl\.DateTimeFormat\('en-GB'/);
  assert.match(injectorSource, /Select arrival date/);
  assert.match(injectorSource, /font:600 16px\/1 Montserrat/);
  assert.match(injectorSource, /bw-date-check-blog-card__date-control,.bw-date-check-blog-card__field select\{height:52px;min-height:52px\}/);
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
