#!/usr/bin/env node

/** Static contract and release-safety checks for the four editorial pages. */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BUILD = 'four-page-editorial-20260717';
const files = {
  css: 'page-editorial/page-editorial.css',
  head: 'page-editorial/four-page-editorial-system-head.html',
  meeting: 'meeting-point/meeting-point-element.js',
  meetingIndex: 'meeting-point/index.html',
  reviews: 'reviews/reviews-element.js',
  reviewsIndex: 'reviews/index.html',
  guide: 'the-guide/the-guide-element.js',
  guideIndex: 'the-guide/index.html',
  route: 'route-story/route-story-element.js',
  routeIndex: 'route-story/index.html',
};

const source = Object.fromEntries(await Promise.all(Object.entries(files).map(async ([key, relative]) => [
  key,
  await fs.readFile(path.join(ROOT, relative), 'utf8'),
])));

const checks = [];
function check(name, condition) {
  checks.push({ name, ok: Boolean(condition) });
  if (!condition) process.exitCode = 1;
}

function containsAll(value, needles) {
  return needles.every((needle) => value.includes(needle));
}

function count(value, pattern) {
  return (value.match(pattern) || []).length;
}

const components = [source.meeting, source.reviews, source.guide, source.route];
const indexes = [source.meetingIndex, source.reviewsIndex, source.guideIndex, source.routeIndex];

check('all four components expose the editorial marker', components.every((value) =>
  value.includes('bw-page-editorial') && value.includes(`data-editorial-build="${BUILD}"`)));
check('custom element tags remain unchanged',
  source.meeting.includes("customElements.define('bw-meeting-point'") &&
  source.reviews.includes("customElements.define('bw-reviews'") &&
  source.guide.includes("customElements.define('bw-the-guide'") &&
  source.route.includes("customElements.define('bw-route-story'"));
check('all four local full-page previews load the shared stylesheet', indexes.every((value) =>
  value.includes('../page-editorial/page-editorial.css')));
check('all four local full-page previews include real header and footer elements', indexes.every((value) =>
  value.includes('<bw-site-header') && value.includes('<bw-site-footer')));

check('shared CSS includes all eight verified Wix host IDs', containsAll(source.css, [
  '#comp-mpbnpbye', '#comp-mpbnyd6v', '#comp-mpljwtm6', '#comp-mpljz1bj',
  '#comp-mp6nj8g4', '#comp-mp6njhlp', '#comp-mpbpkb541', '#comp-mpbplddk',
]));
check('shared CSS is gated by the revised component marker', source.css.includes(':has(.bw-page-editorial)'));
check('shared CSS has no global body, html, or main selector', !/(^|\n)\s*(?:body|html|main)(?:\s|,|\{|\.)/m.test(source.css));
check('shared CSS loads the real Fraunces asset', source.css.includes('../home-products/assets/fonts/Fraunces-Variable.ttf'));
check('shared CSS keeps Montserrat body and Merriweather quote tokens',
  source.css.includes('--bw-ed-body-font: Montserrat') && source.css.includes('--bw-ed-quote: Merriweather'));
check('shared CSS keeps yellow CTA text dark',
  source.css.includes('background: var(--bw-ed-yellow);') && source.css.includes('color: var(--bw-ed-ink);'));
check('shared CSS retains the 1280 canvas and required gutters',
  source.css.includes('max-width: 1280px') && source.css.includes('padding-inline: 32px') && source.css.includes('padding-inline: 18px'));

check('HEAD template is one immutable CSS link only',
  count(source.head.replace(/<!--[\s\S]*?-->/g, ''), /<link\b/gi) === 1 &&
  !/<script\b|<style\b/i.test(source.head) &&
  source.head.includes('@__EDITORIAL_COMMIT__/page-editorial/page-editorial.css'));

check('Meeting Point keeps canonical maps and booking URLs', containsAll(source.meeting, [
  'https://www.google.com/maps/search/?api=1&query=Weltzeituhr%20Alexanderplatz%20Berlin',
  'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based',
]));
check('Meeting Point has one labelled H1 and exactly three real arrival steps',
  source.meeting.includes('aria-labelledby="bw-meeting-point-title"') &&
  source.meeting.includes('<h1 id="bw-meeting-point-title">') &&
  count(source.meeting, /class="bw-mp-arrival-step"/g) === 3);
check('Meeting Point removed the fake CSS map', !/bw-mp-map-(?:road|pin|poster|frame)/.test(source.meeting));
check('Meeting Point public support copy uses singular voice',
  source.meeting.includes('message me through your booking confirmation') &&
  !/\b(?:message us|we will|our tour)\b/i.test(source.meeting));

check('Reviews preserves its API and lifecycle guards', containsAll(source.reviews, [
  'https://www.berlinwalk.com/_functions/listReviews?limit=100',
  'new AbortController()',
  'this._controller.abort()',
  'this._cardObserver.disconnect()',
]));
check('Reviews exposes honest async and semantic quote states',
  source.reviews.includes('data-status aria-live="polite"') &&
  source.reviews.includes('<div data-list aria-busy="true">') &&
  !source.reviews.includes('data-list aria-live=') &&
  count(source.reviews, /setAttribute\('aria-busy', 'false'\)/g) >= 3 &&
  source.reviews.includes('<blockquote class="bw-review-quote">'));
check('Reviews calculates average only from valid ratings and labels partial samples',
  source.reviews.includes('Number(review.rating) > 0 && Number(review.rating) <= 5') &&
  source.reviews.includes('Average shown from the latest'));
check('Reviews validates source URL protocols',
  source.reviews.includes("url.protocol === 'https:' || url.protocol === 'http:'"));

check('The Guide keeps canonical page URLs and audio element URL', containsAll(source.guide, [
  'https://www.berlinwalk.com/reviews',
  'https://www.berlinwalk.com/meeting-point',
  'audio-tour/audio-tour-element.js',
  '<bw-audio-tour></bw-audio-tour>',
]));
check('The Guide keeps exact verified guest attribution', containsAll(source.guide, [
  'Samyukta V., India', 'Michal D., Poland', 'Karen S., United Kingdom',
]));
check('The Guide uses semantic quotes and one featured quote',
  source.guide.includes('<blockquote class="bw-guide-quote') &&
  source.guide.includes("featured ? ' bw-guide-quote-featured' : ''"));
check('The Guide audio parent copy is accurate',
  source.guide.includes('A short audio preview written and checked by me.') &&
  !source.guide.includes('recorded in my voice'));
check('The Guide avoids a nested main landmark and lazily loads below-fold photos',
  source.guide.includes('<article class="bw-guide bw-page-editorial"') &&
  !source.guide.includes('<main class="bw-guide bw-page-editorial"') &&
  count(source.guide, /loading="lazy"/g) >= 2);

check('Route preserves canonical URLs and the SEO H1 id', containsAll(source.route, [
  'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based',
  'https://www.berlinwalk.com/meeting-point',
  'https://www.berlinwalk.com/the-guide',
  '<h1 id="bw-rs-title">',
]));
check('Route retains exactly 12 stop data records', count(source.route, /\n\s+id:\s*\d+,/g) === 12);
check('Route retains stop, act and booking analytics contracts', containsAll(source.route, [
  "this._track('bw_route_story_stop_click', { stop_id: id })",
  "this._track('bw_route_story_act_click', { act })",
  "this._track('bw_route_story_book_click', { source: 'route_story' })",
]));
check('Route retains interaction hooks and observer cleanup', containsAll(source.route, [
  'data-stop-target', 'data-act-target', 'data-bw-book-route-story',
  'this._observer.disconnect()', 'aria-current', 'aria-pressed',
]));
check('Route uses real responsive map assets', containsAll(source.route, [
  'berlin-mitte-illustration-720w.webp',
  'berlin-mitte-illustration-960w.webp',
  'berlin-mitte-illustration-1200w.webp',
  'srcset=',
]));
check('Route mobile pins retain an expanded pointer target and unclipped first pin',
  source.route.includes('.bw-rs-pin::after') && source.route.includes('inset: -9px') && source.route.includes('x: 95'));
check('Route does not claim that the free tour follows the Berlin Wall',
  !/walk(?:s|ing)? (?:the|along the) (?:Berlin )?Wall/i.test(source.route));

check('public component strings contain no em dash or en dash glyphs', components.every((value) => !/[—–]/.test(value)));
check('tour duration remains about two hours',
  components.every((value) => !/1h45|1 h 45|one hour and forty-five/i.test(value)) &&
  source.route.includes('<dd>~2h</dd>'));

const failed = checks.filter((item) => !item.ok);
for (const item of checks) console.log(`${item.ok ? 'PASS' : 'FAIL'} ${item.name}`);
console.log(JSON.stringify({ ok: failed.length === 0, checks: checks.length, failed: failed.map((item) => item.name) }, null, 2));
if (failed.length) process.exitCode = 1;
