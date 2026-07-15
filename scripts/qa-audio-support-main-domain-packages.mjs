#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PRODUCTS = [
  '/products/hidden-berlin-audio-route',
  '/products/death-strip-audio-route',
  '/products/medieval-berlin-audio-tour',
  '/products/third-reich-berlin-audio-tour',
  '/products/kreuzberg-street-art-audio-tour',
];

const POSTS = [
  {
    slug: 'berlin-audio-guide-app-vs-no-app',
    bodyPath: 'blog-drafts/berlin-audio-guide-app-vs-no-app.body.md',
    title: 'Berlin Audio Guide App vs No-App Audio Tour: Which Is Better?',
    seoTitle: 'Berlin Audio Guide App vs No-App Audio Tour',
    focus: 'Berlin audio guide app',
    sibling: '/post/self-guided-berlin-walking-tour-audio-guide',
    widget: 'berlin-audio-format-field-test/index.html',
    widgetPlaceholder: '{{widget:berlin-audio-format-field-test}}',
  },
  {
    slug: 'self-guided-berlin-walking-tour-audio-guide',
    bodyPath: 'blog-drafts/self-guided-berlin-walking-tour-audio-guide.body.md',
    title: 'Self-Guided Berlin Walking Tour with Audio: How to Choose a Route',
    seoTitle: 'Self-Guided Berlin Walking Tour with Audio',
    focus: 'self-guided Berlin walking tour with audio',
    sibling: '/post/berlin-audio-guide-app-vs-no-app',
    widget: 'berlin-audio-route-map/index.html',
    widgetPlaceholder: '{{widget:berlin-audio-route-map}}',
  },
];

const errors = [];
const checks = [];
function read(relativePath) { return fs.readFileSync(path.join(ROOT, relativePath), 'utf8'); }
function assert(condition, message) {
  if (!condition) errors.push(message);
  else checks.push(message);
}

const quickSummary = JSON.parse(read('quick-summary/data.json'));
const faq = JSON.parse(read('faq/data.json'));
const slugMap = JSON.parse(read('faq/slug-map.json'));
const draftScript = read('scripts/create-audio-support-main-domain-drafts.mjs');

for (const post of POSTS) {
  const body = read(post.bodyPath);
  const lower = body.toLowerCase();
  const imageLines = [...body.matchAll(/^!\[([^\]]+)\]\(([^)]+)\)$/gm)];
  const captionLines = [...body.matchAll(/^_[^\n]+_$/gm)];
  const placeholders = [...body.matchAll(/^\{\{[^\n]+\}\}$/gm)].map((match) => match[0]);
  const words = body.replace(/\{\{[^}]+\}\}/g, '').split(/\s+/).filter(Boolean).length;
  const internalLinks = [...body.matchAll(/https:\/\/www\.berlinwalk\.com\/[^)\s]+/g)].map((match) => match[0]);
  const externalLinks = [...body.matchAll(/https:\/\/[^)\s]+/g)].map((match) => match[0]).filter((url) => !url.includes('berlinwalk.com'));

  assert(!/^# /m.test(body), `${post.slug}: body has no Markdown H1`);
  assert(words >= 1100, `${post.slug}: body has at least 1,100 words (${words})`);
  assert(imageLines.length === 5, `${post.slug}: exactly five inline images (${imageLines.length})`);
  assert(captionLines.length === 5, `${post.slug}: exactly five caption lines (${captionLines.length})`);
  assert(placeholders.length === 3 && placeholders.includes('{{quick-summary}}') && placeholders.includes(post.widgetPlaceholder) && placeholders.includes('{{faq}}'), `${post.slug}: Quick Summary, original widget and FAQ placeholders are present`);
  assert(lower.includes(post.focus.toLowerCase()), `${post.slug}: focus phrase appears in the body`);
  assert(new RegExp(`^## .*${post.focus.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'im').test(body), `${post.slug}: focus phrase appears in an H2`);
  assert(internalLinks.length >= 9, `${post.slug}: at least nine internal links (${internalLinks.length})`);
  assert(externalLinks.length >= 2, `${post.slug}: at least two authoritative external links (${externalLinks.length})`);
  assert(PRODUCTS.every((url) => body.includes(`https://www.berlinwalk.com${url}`)), `${post.slug}: all five paid route links are present`);
  assert(body.includes('€4.99'), `${post.slug}: current €4.99 price is present`);
  assert(body.includes(`https://www.berlinwalk.com${post.sibling}`), `${post.slug}: sibling support post is linked on the main domain`);
  assert(!/app\.berlinwalk\.com/i.test(body), `${post.slug}: no app-domain link remains`);
  assert(!/—/.test(body), `${post.slug}: no em dash remains`);
  assert(!/\b(?:we|our|ours|us)\b/i.test(body), `${post.slug}: public voice does not drift into collective first person`);
  assert(!/(AI-generated|ChatGPT|Codex|Claude|visual-sources\.md|Sources to Recheck Before Publishing)/i.test(body), `${post.slug}: no internal production language leaks`);

  for (const [, alt, relativePath] of imageLines) {
    assert(Boolean(alt.trim()), `${post.slug}: image alt text is non-empty`);
    assert(fs.existsSync(path.join(ROOT, relativePath)), `${post.slug}: local image exists (${relativePath})`);
  }

  const qs = quickSummary[post.slug];
  assert(Boolean(qs) && Array.isArray(qs.items) && qs.items.length === 6, `${post.slug}: Quick Summary has six useful items`);
  const faqSet = faq[post.slug];
  assert(Boolean(faqSet) && Array.isArray(faqSet.items) && faqSet.items.length >= 6, `${post.slug}: FAQ has at least six questions`);
  assert(faqSet?.items?.every((item) => item.q?.trim() && item.a?.trim()), `${post.slug}: every FAQ item has a question and answer`);
  assert(slugMap[post.slug] === post.slug, `${post.slug}: FAQ slug map resolves exactly`);
  assert(draftScript.includes(`title: '${post.title}'`) && draftScript.includes(`seoTitle: '${post.seoTitle}'`), `${post.slug}: draft script contains the intended title and SEO title`);

  const widget = read(post.widget);
  assert(widget.includes('[hidden] { display: none !important; }'), `${post.slug}: widget protects the true hidden state`);
  assert(/id="creditsLayer" hidden/.test(widget) && /aria-expanded="false"/.test(widget), `${post.slug}: image credits are closed by default`);
  assert(/min-height:\s*44px/.test(widget), `${post.slug}: widget includes 44px touch targets`);
  assert(widget.includes('--yellow: #ffe600') && widget.includes('color: var(--green-dark)'), `${post.slug}: yellow surfaces use dark text`);
  assert(!/—/.test(widget), `${post.slug}: widget has no em dash`);
  assert(!/(AI-generated|ChatGPT|Codex|Claude)/i.test(widget), `${post.slug}: widget has no internal production language`);
}

const routeMap = read('berlin-audio-route-map/index.html');
for (const id of ['hidden', 'wall', 'medieval', 'third-reich', 'kreuzberg', 'sample']) {
  assert(routeMap.includes(`id: '${id}'`), `route map: ${id} route exists`);
}
for (const url of PRODUCTS) assert(routeMap.includes(`https://www.berlinwalk.com${url}`), `route map: ${url} links to the main domain`);
assert(routeMap.includes("dashArray: strong ? '9 7' : '5 8'") && routeMap.includes('Route span, not the exact path'), 'route map: orientation span is visibly and textually distinguished from turn-by-turn navigation');

const fieldTest = read('berlin-audio-format-field-test/index.html');
for (const scene of ['hotel:', 'nordbahnhof:', 'bernauer:', 'mauerpark:']) assert(fieldTest.includes(scene), `field test: ${scene.slice(0, -1)} scene exists`);
for (const format of ['data-format="app"', 'data-format="browser"', 'data-format="mp3"']) assert(fieldTest.includes(format), `field test: ${format} comparison card exists`);

if (errors.length) {
  console.error(`FAILED: ${errors.length} of ${errors.length + checks.length} checks`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`PASS: ${checks.length} package checks across ${POSTS.length} articles.`);
for (const post of POSTS) console.log(`- ${post.slug}: article, images, Quick Summary, FAQ and widget ready for draft-only handoff`);
