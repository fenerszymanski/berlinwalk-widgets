#!/usr/bin/env node

/**
 * Inserts the approved four-image layout into each event article exactly once.
 * It reads the internal Commons source ledger for alt text and captions, and
 * deliberately adds no public provenance beyond the future native Wix credit
 * disclosure token. Default mode validates and reports planned edits; --verify
 * validates the finished layout without attempting to apply it a second time.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const BATCH_DIR = path.join(ROOT, 'blog-drafts', 'sep-dec-events-2026');
const METADATA = JSON.parse(fs.readFileSync(path.join(BATCH_DIR, 'batch-post-metadata.json'), 'utf8'));
const SOURCES = JSON.parse(fs.readFileSync(path.join(BATCH_DIR, 'commons-image-sources.json'), 'utf8'));
const apply = process.argv.includes('--apply');
const verify = process.argv.includes('--verify');
assert(!(apply && verify), 'Use either --apply or --verify, not both');

const LAYOUT = Object.freeze({
  'film-festivals-berlin-autumn': [
    ['beforeToken', '{{quick-summary}}', 'film-festivals-berlin-autumn-01-kino-international.jpg'],
    ['beforeHeading', '## Choose the kind of night before you choose a title', 'film-festivals-berlin-autumn-02-city-kino-wedding.jpg'],
    ['beforeHeading', '## English-friendly is a screening-level decision', 'film-festivals-berlin-autumn-03-silent-green.jpg'],
    ['beforeHeading', '## Let one cinema decide the shape of the evening', 'film-festivals-berlin-autumn-04-kino-babylon.jpg'],
  ],
  'giant-kite-festival-berlin': [
    ['beforeToken', '{{quick-summary}}', 'giant-kite-festival-berlin-01-tempelhofer-kite-festival.jpg'],
    ['beforeHeading', '## Pick your entrance by direction, not by a guessed meeting point', 'giant-kite-festival-berlin-02-kites-on-field.jpg'],
    ['beforeHeading', '## Choose the approach that matches your direction', 'giant-kite-festival-berlin-03-runway.jpg'],
    ['beforeHeading', '## Keep the Berlin around it close', 'giant-kite-festival-berlin-04-panorama.jpg'],
  ],
  'ice-hockey-basketball-berlin': [
    ['beforeToken', '{{quick-summary}}', 'ice-hockey-basketball-berlin-01-uber-arena.jpg'],
    ['beforeHeading', '## Treat ticket prices as a changing line', 'ice-hockey-basketball-berlin-02-uber-platz-night.jpg'],
    ['beforeHeading', '## Go for the sport, not for a language promise', 'ice-hockey-basketball-berlin-03-oberbaumbruecke.jpg'],
    ['beforeHeading', '## Let Friedrichshain hold the rest of the evening', 'ice-hockey-basketball-berlin-04-oberbaumbruecke-night.jpg'],
  ],
  'pyronale-berlin': [
    ['beforeToken', '{{quick-summary}}', 'pyronale-berlin-01-pyronale-2017-cover.jpg'],
    ['beforeHeading', '## Choose Friday or Saturday with a real reason', 'pyronale-berlin-02-pyronale-2017.jpg'],
    ['beforeHeading', '## The South Gate is a planning fact', 'pyronale-berlin-03-olympiastadion-south-gate.jpg'],
    ['beforeHeading', '## Protect the later part of the weekend', 'pyronale-berlin-04-pyronale-2024.jpg'],
  ],
  'tag-der-clubkultur-berlin': [
    ['beforeToken', '{{quick-summary}}', 'tag-der-clubkultur-berlin-01-sisyphos.jpg'],
    ['beforeHeading', '## Treat the event page as the authority', 'tag-der-clubkultur-berlin-02-club-der-visionaere.jpg'],
    ['beforeHeading', '## Keep your Berlin geography honest', 'tag-der-clubkultur-berlin-03-kater-blau.jpg'],
    ['beforeHeading', '## A good TAG DER CLUBKULTUR plan', 'tag-der-clubkultur-berlin-04-kulturbrauerei.jpg'],
  ],
  'berlin-food-week': [
    ['beforeToken', '{{quick-summary}}', 'berlin-food-week-01-bikini-berlin.jpg'],
    ['beforeHeading', '## Read the access label before you build a day around it', 'berlin-food-week-02-kantstrasse-peking-ducks.jpg'],
    ['beforeHeading', '## Make House of Food one City West afternoon', 'berlin-food-week-03-city-west-orientation.jpg'],
    ['beforeHeading', '## The useful Berlin Food Week question', 'berlin-food-week-04-markthalle-neun.jpg'],
  ],
  'jazzfest-berlin': [
    ['beforeToken', '{{quick-summary}}', 'jazzfest-berlin-01-2013-forecourt.jpg'],
    ['beforeHeading', '## Do not build a route from an old festival map', 'jazzfest-berlin-02-festspiele-exterior.jpg'],
    ['beforeHeading', '## Give the confirmed venue one sensible surrounding plan', 'jazzfest-berlin-03-grosse-buehne.jpg'],
    ['beforeHeading', '## The Jazzfest Berlin booking rule', 'jazzfest-berlin-04-philharmonie.jpg'],
  ],
  'berlin-science-week': [
    ['beforeToken', '{{quick-summary}}', 'berlin-science-week-01-hkw-exterior.jpg'],
    ['beforeHeading', '## Start from one question that matters to you', 'berlin-science-week-02-hkw-night.jpg'],
    ['beforeHeading', '## Wait for published density before choosing three days', 'berlin-science-week-03-kongresshalle-steps.jpg'],
    ['beforeHeading', '## Build one confirmed venue into a normal Berlin day', 'berlin-science-week-04-cafe-moskau.jpg'],
  ],
  'berlin-freedom-week': [
    ['beforeToken', '{{quick-summary}}', 'berlin-freedom-week-01-bernauer-memorial.jpg'],
    ['beforeHeading', '## Build 9 November around a place, not a programme card', 'berlin-freedom-week-02-chapel-of-reconciliation.jpg'],
    ['beforeHeading', '## What has to wait for the final programme', 'berlin-freedom-week-03-bernauer-wall.jpg'],
    ['beforeHeading', '## The better Berlin Freedom Week plan', 'berlin-freedom-week-04-bernauer-watchtower.jpg'],
  ],
  'christmas-garden-berlin': [
    ['beforeToken', '{{quick-summary}}', 'christmas-garden-berlin-01-tropenhaus-2024.jpg'],
    ['beforeHeading', '## Your ticket gives you a 20-minute arrival window', 'christmas-garden-berlin-02-grosses-tropenhaus.jpg'],
    ['beforeHeading', '## Choose the entrance that fits your journey', 'christmas-garden-berlin-03-botanischer-garten-station.jpg'],
    ['beforeHeading', '## The better Christmas Garden plan', 'christmas-garden-berlin-04-botanical-garden-architecture.jpg'],
  ],
  'berlin-christmas-events-beyond-markets': [
    ['beforeToken', '{{quick-summary}}', 'berlin-christmas-events-beyond-markets-01-schloss-friedrichsfelde.jpg'],
    ['beforeHeading', '## Choose the place before the poster', 'berlin-christmas-events-beyond-markets-02-tempodrom.jpg'],
    ['beforeHeading', '## The date overlaps that make the decision easier', 'berlin-christmas-events-beyond-markets-03-olympiastadion-night.jpg'],
    ['beforeHeading', '## The better Christmas plan', 'berlin-christmas-events-beyond-markets-04-louis-lewandowski.jpg'],
  ],
});

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function occurrences(value, needle) {
  return value.split(needle).length - 1;
}

function sourceIndex() {
  const records = new Map();
  for (const source of SOURCES) {
    assert(source && source.slug && source.filename && source.altText && source.caption, 'Every image source needs slug, filename, altText and caption');
    assert(!/[—]/.test(source.caption), `${source.slug}/${source.filename} caption contains a forbidden em dash`);
    assert(!new RegExp(['rather', 'than'].join('\\s+'), 'i').test(source.caption), `${source.slug}/${source.filename} caption contains forbidden contrast wording`);
    const key = `${source.slug}/${source.filename}`;
    assert(!records.has(key), `Duplicate source record: ${key}`);
    records.set(key, source);
  }
  return records;
}

function imageBlock(source) {
  return `![${source.altText}](images/optimized/${source.filename})\n\n_${source.caption}_\n\n`;
}

function writeAtomically(file, value) {
  const temporary = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, value, 'utf8');
  fs.renameSync(temporary, file);
}

function planFor(post, sources) {
  const layout = LAYOUT[post.slug];
  assert(Array.isArray(layout) && layout.length === 4, `${post.slug} needs exactly four layout placements`);
  const bodyPath = path.join(ROOT, 'blog-drafts', post.slug, `${post.slug}.body.md`);
  const original = fs.readFileSync(bodyPath, 'utf8');
  assert(!/^#\s+/m.test(original), `${post.slug} has a forbidden H1`);
  assert(occurrences(original, '{{quick-summary}}') === 1, `${post.slug} needs one Quick Summary token`);
  assert(occurrences(original, `{{widget:${post.toolSlug}}}`) === 1, `${post.slug} needs one widget token`);
  assert(occurrences(original, '{{faq}}') === 1, `${post.slug} needs one FAQ token`);
  assert(occurrences(original, '{{article-image-credits}}') === 0, `${post.slug} already has an Image credits token`);
  assert(!/^!\[.*?]\(.*?\)$/gm.test(original), `${post.slug} already has a Markdown image; refuse to append a second layout`);

  const insertions = layout.map(([kind, target, filename]) => {
    const source = sources.get(`${post.slug}/${filename}`);
    assert(source, `${post.slug} is missing source metadata for ${filename}`);
    const needle = target;
    assert((kind === 'beforeToken' || kind === 'beforeHeading'), `${post.slug} has invalid layout kind ${kind}`);
    assert(occurrences(original, needle) === 1, `${post.slug} layout target must occur once: ${needle}`);
    return { index: original.indexOf(needle), block: imageBlock(source), filename };
  });
  assert(new Set(insertions.map((entry) => entry.filename)).size === 4, `${post.slug} reuses an image filename`);
  insertions.push({ index: original.indexOf('{{faq}}'), block: '{{article-image-credits}}\n\n', filename: 'article-image-credits' });
  const rendered = insertions
    .sort((left, right) => right.index - left.index)
    .reduce((body, insertion) => `${body.slice(0, insertion.index)}${insertion.block}${body.slice(insertion.index)}`, original);
  assert([...rendered.matchAll(/^!\[.*?]\(.*?\)$/gm)].length === 4, `${post.slug} rendered image count is not four`);
  assert(occurrences(rendered, '{{article-image-credits}}') === 1, `${post.slug} rendered Image credits token is not one`);
  return { bodyPath, rendered, filenames: layout.map((entry) => entry[2]) };
}

function verifyFor(post, sources) {
  const layout = LAYOUT[post.slug];
  assert(Array.isArray(layout) && layout.length === 4, `${post.slug} needs exactly four layout placements`);
  const bodyPath = path.join(ROOT, 'blog-drafts', post.slug, `${post.slug}.body.md`);
  const body = fs.readFileSync(bodyPath, 'utf8');
  assert(!/^#\s+/m.test(body), `${post.slug} has a forbidden H1`);
  assert(occurrences(body, '{{quick-summary}}') === 1, `${post.slug} needs one Quick Summary token`);
  assert(occurrences(body, `{{widget:${post.toolSlug}}}`) === 1, `${post.slug} needs one widget token`);
  assert(occurrences(body, '{{faq}}') === 1, `${post.slug} needs one FAQ token`);
  assert(occurrences(body, '{{article-image-credits}}') === 1, `${post.slug} needs one Image credits token`);
  assert(body.indexOf('{{article-image-credits}}') < body.indexOf('{{faq}}'), `${post.slug} Image credits must precede the FAQ`);

  const expectedImages = [];
  for (const [kind, target, filename] of layout) {
    assert(kind === 'beforeToken' || kind === 'beforeHeading', `${post.slug} has invalid layout kind ${kind}`);
    const source = sources.get(`${post.slug}/${filename}`);
    assert(source, `${post.slug} is missing source metadata for ${filename}`);
    const block = imageBlock(source);
    assert(occurrences(body, block) === 1, `${post.slug} must contain one exact captioned image block for ${filename}`);
    assert(body.includes(`${block}${target}`), `${post.slug} image block for ${filename} must occur directly before ${target}`);
    expectedImages.push(`images/optimized/${filename}`);
  }
  const actualImages = [...body.matchAll(/^!\[.*?]\((.*?)\)$/gm)].map((match) => match[1]);
  assert(JSON.stringify(actualImages) === JSON.stringify(expectedImages), `${post.slug} image order does not match the approved layout`);
  return { bodyPath, filenames: layout.map((entry) => entry[2]) };
}

const sources = sourceIndex();
assert(METADATA.batch === 'sep-dec-events-2026' && METADATA.posts?.length === 11, 'Batch metadata must contain the exact eleven posts');
assert(Object.keys(LAYOUT).length === 11, 'Image layout must contain exactly eleven posts');
const reports = METADATA.posts.map((post) => {
  assert(LAYOUT[post.slug], `Image layout has no post ${post.slug}`);
  const plan = verify ? verifyFor(post, sources) : planFor(post, sources);
  if (apply) writeAtomically(plan.bodyPath, plan.rendered);
  return { slug: post.slug, mode: apply ? 'APPLIED' : verify ? 'VERIFIED' : 'DRY_RUN', images: plan.filenames, imageCreditsToken: true };
});
console.log(JSON.stringify({ batch: METADATA.batch, mode: apply ? 'APPLIED' : verify ? 'VERIFIED' : 'DRY_RUN', posts: reports }, null, 2));
