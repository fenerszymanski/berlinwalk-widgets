import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const body = await readFile(join(here, 'berlin-then-and-now.body.md'), 'utf8');
const seo = JSON.parse(await readFile(join(here, 'seo.json'), 'utf8'));
const summary = JSON.parse(await readFile(join(here, 'quick-summary.json'), 'utf8'));
const faq = JSON.parse(await readFile(join(here, 'faq.json'), 'utf8'));
const manifest = JSON.parse(await readFile(join(here, 'image-manifest.json'), 'utf8'));
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

const proseForCount = body
  .replace(/https?:\/\/\S+/g, '')
  .replace(/[{}<>#_*()[\]]/g, ' ')
  .split(/\s+/)
  .filter(Boolean);

check(seo.status === 'UNPUBLISHED_LOCAL_PACKAGE', 'Package must remain unpublished.');
check(seo.title === 'Berlin Then and Now: How to See the City That Disappeared', 'Title mismatch.');
check(seo.slug === 'berlin-then-and-now', 'Slug mismatch.');
check(proseForCount.length >= 1600 && proseForCount.length <= 1900, `Body word count ${proseForCount.length} is outside 1600–1900.`);
check(!/^#\s+/m.test(body), 'Body contains a Markdown H1.');
check(!body.includes('—'), 'Body contains an em dash.');
check(!/\b(we|our|us)\b/i.test(body.replace(/https?:\/\/\S+/g, '')), 'Body uses collective business voice.');
check((body.match(/{{quick-summary}}/g) || []).length === 1, 'Quick Summary placeholder must appear once.');
check((body.match(/{{widget:mehringplatz-time-layer-viewer}}/g) || []).length === 1, 'Viewer placeholder must appear once.');
check((body.match(/^### .+\?$/gm) || []).length === 4, 'Body must contain four FAQ questions.');
check(summary.items.length === 4, 'Quick Summary must contain four items.');
check(faq.items.length === 4, 'FAQ JSON must contain four answers.');
check(manifest.images.length >= 5, 'At least five licensed images are required.');
check(manifest.policy.generatedReconstructions === false, 'Generated reconstruction flag must remain false.');
check(body.includes('utm_content=berlin_then_now_mehringplatz'), 'Tracked lead CTA is missing.');
check(body.includes('https://denkmaldatenbank.berlin.de/'), 'Official monument source is missing.');
check(seo.internalLinks.every((link) => body.includes(link)), 'One or more planned internal links are missing from the body.');

for (const image of manifest.images) {
  for (const relative of [image.localRaw, image.localOptimized]) {
    try {
      const fileStat = await stat(join(here, relative));
      check(fileStat.size > 10_000, `${relative} is unexpectedly small.`);
    } catch {
      failures.push(`${relative} is missing.`);
    }
  }
  const optimized = await readFile(join(here, image.localOptimized));
  const digest = createHash('sha256').update(optimized).digest('hex');
  check(digest === image.optimizedSha256, `${image.localOptimized} SHA-256 does not match manifest.`);
  check(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/.test(image.sourcePage), `${image.id} needs a Commons source page.`);
  check(/^(Public domain|CC BY)/.test(image.licence), `${image.id} has an unapproved licence label.`);
}

if (failures.length) {
  console.error(`Package validation failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Package validation passed: ${proseForCount.length} words, ${manifest.images.length} licensed images, ${faq.items.length} FAQ answers.`);
