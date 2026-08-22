#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const strict = process.argv.includes('--strict');
const metadata = JSON.parse(fs.readFileSync(path.join(ROOT, 'blog-drafts/sep-dec-events-2026/batch-post-metadata.json'), 'utf8'));
const quick = JSON.parse(fs.readFileSync(path.join(ROOT, 'quick-summary/data.json'), 'utf8'));
const faq = JSON.parse(fs.readFileSync(path.join(ROOT, 'faq/data.json'), 'utf8'));
const toolsHub = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools-hub/data.json'), 'utf8'));

function exists(relative) {
  return fs.existsSync(path.join(ROOT, relative));
}

function report(level, slug, message) {
  console.log(`${level}\t${slug}\t${message}`);
}

let failures = 0;
let pending = 0;
for (const post of metadata.posts) {
  const { slug, toolSlug } = post;
  const bodyPath = path.join(ROOT, 'blog-drafts', slug, `${slug}.body.md`);
  if (!fs.existsSync(bodyPath)) {
    report('FAIL', slug, 'body is missing');
    failures += 1;
    continue;
  }
  const body = fs.readFileSync(bodyPath, 'utf8');
  const placeholders = ['{{quick-summary}}', `{{widget:${toolSlug}}}`, '{{faq}}'];
  for (const placeholder of placeholders) {
    const count = body.split(placeholder).length - 1;
    if (count !== 1) {
      report('FAIL', slug, `${placeholder} count is ${count}, expected 1`);
      failures += 1;
    }
  }
  if (/^#\s+/m.test(body)) {
    report('FAIL', slug, 'body contains a forbidden H1');
    failures += 1;
  }
  if (!quick[slug] || quick[slug].items?.length < 4) {
    report('FAIL', slug, 'Quick Summary entry is missing or too short');
    failures += 1;
  }
  if (!faq[slug] || faq[slug].items?.length < 5) {
    report('FAIL', slug, 'FAQ entry is missing or too short');
    failures += 1;
  }
  if (!exists(`quick-summary/data/${slug}.json`) || !exists(`faq/data/${slug}.json`)) {
    report('FAIL', slug, 'Quick Summary or FAQ shard is missing');
    failures += 1;
  }
  if (!exists(`${toolSlug}/index.html`) || !exists(`${toolSlug}/SOURCE_NOTES.md`)) {
    report('FAIL', slug, 'widget source or source notes are missing');
    failures += 1;
  }

  const imageCount = [...body.matchAll(/^!\[.*?]\(.*?\)$/gm)].length;
  if (imageCount < 4) {
    report('PENDING', slug, `article image package is incomplete (${imageCount}/4 body images)`);
    pending += 1;
  }
  const hasIcon = exists(`tools-home/icons/${toolSlug}.png`) || exists(`tools-home/icons/${toolSlug}-160.png`);
  if (!hasIcon) {
    report('PENDING', slug, 'dedicated tool icon is not yet produced');
    pending += 1;
  }
  const toolCollection = Array.isArray(toolsHub)
    ? toolsHub
    : Array.isArray(toolsHub.tools)
      ? toolsHub.tools
      : [];
  const toolRecord = toolCollection.find((item) => item.slug === toolSlug);
  if (!toolRecord) {
    report('PENDING', slug, 'tools-hub registry and CMS record are not yet prepared');
    pending += 1;
  }
}

if (!failures) report('PASS', 'batch', `${metadata.posts.length} local content, data and widget packages are structurally present`);
if (failures || (strict && pending)) process.exitCode = 1;
