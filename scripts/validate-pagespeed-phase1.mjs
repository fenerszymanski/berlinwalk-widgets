#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const errors = [];

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function check(condition, message) {
  if (!condition) errors.push(message);
}

const faqData = readJson('faq/data.json');
const slugMap = readJson('faq/slug-map.json');
const faqTargets = new Map(Object.keys(faqData).map((key) => [key, key]));
Object.entries(slugMap).forEach(([slug, key]) => faqTargets.set(slug, key));
for (const [slug, key] of faqTargets) {
  const shardPath = path.join(repoRoot, 'faq', 'data', `${slug}.json`);
  check(fs.existsSync(shardPath), `Missing FAQ shard: ${slug}`);
  if (!fs.existsSync(shardPath)) continue;
  const shard = JSON.parse(fs.readFileSync(shardPath, 'utf8'));
  check(shard.key === key, `FAQ shard key mismatch: ${slug}`);
  check(Boolean(shard.config), `FAQ shard config missing: ${slug}`);
}

const quickData = readJson('quick-summary/data.json');
for (const [slug, config] of Object.entries(quickData)) {
  const shardPath = path.join(repoRoot, 'quick-summary', 'data', `${slug}.json`);
  check(fs.existsSync(shardPath), `Missing Quick Summary shard: ${slug}`);
  if (!fs.existsSync(shardPath)) continue;
  check(JSON.stringify(JSON.parse(fs.readFileSync(shardPath, 'utf8'))) === JSON.stringify(config), `Quick Summary shard mismatch: ${slug}`);
}

const faqInject = read('faq/inject.js');
check(Buffer.byteLength(faqInject) < 4096, `FAQ loader exceeds 4 KB: ${Buffer.byteLength(faqInject)}`);
check(!faqInject.includes('var SCHEMAS'), 'FAQ loader still embeds the full schema map.');
check(faqInject.includes("parts[0] !== 'post'"), 'FAQ loader does not self-skip non-post routes.');

const aggregate = readJson('blog-index/data.json');
const index = readJson('blog-index/index.json');
const archive = readJson('blog-index/archive.json');
check(!Object.hasOwn(index, 'allPosts'), 'Blog index payload still contains allPosts.');
check(Array.isArray(archive.allPosts), 'Blog archive payload is missing allPosts.');
check(JSON.stringify(archive.allPosts) === JSON.stringify(aggregate.allPosts), 'Blog archive posts differ from aggregate data.');
check(index.updatedAt === aggregate.updatedAt && archive.updatedAt === aggregate.updatedAt, 'Blog split timestamps are not aligned.');
const aggregateGzip = zlib.gzipSync(read('blog-index/data.json')).length;
const indexGzip = zlib.gzipSync(read('blog-index/index.json')).length;
check(indexGzip < aggregateGzip * 0.4, `Blog initial payload reduction is too small: ${aggregateGzip} -> ${indexGzip}`);

const toolsSource = read('tools-hub/tools-hub-element.js');
const context = {
  URL,
  HTMLElement: class {},
  customElements: { get() { return true; }, define() {} },
};
vm.runInNewContext(`${toolsSource}\nthis.__bwIconRendition = bwToolsHubWixIconRendition;`, context);
const sourceIcon = 'https://static.wixstatic.com/media/example~mv2.png';
const renderedIcon = context.__bwIconRendition(sourceIcon, 160);
check(renderedIcon.includes('/v1/fill/w_160,h_160,al_c,q_80,enc_avif,quality_auto/'), 'Wix icon rendition parameters are missing.');
check(context.__bwIconRendition('https://example.com/icon.png', 160) === 'https://example.com/icon.png', 'Non-Wix icons should remain unchanged.');
check(toolsSource.includes('srcset='), 'Tools Hub icons are missing responsive srcset.');

const blogElement = read('blog-index/blog-index-element.js');
const blogSidebar = read('js/blog-sidebar-inject.js');
const blogJourney = read('js/blog-journey-inject.js');
check(blogElement.includes('blog-index/index.json') || blogElement.includes("'./index.json'"), 'Blog element does not use the small index payload.');
check(blogSidebar.includes('blog-index/index.json?v=20260719-phase1'), 'Blog sidebar does not share the versioned index payload.');
check(blogJourney.includes('blog-index/archive.json?v=20260719-phase1'), 'Blog journey does not use the archive payload.');
check(blogElement.includes('__BW_BLOG_DATA_PROMISES') && blogSidebar.includes('__BW_BLOG_DATA_PROMISES'), 'Blog index fetches do not share a global promise cache.');

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(`PASS: ${faqTargets.size} FAQ shards, ${Object.keys(quickData).length} Quick Summary shards.`);
console.log(`PASS: blog initial gzip ${aggregateGzip} -> ${indexGzip} bytes.`);
console.log('PASS: Tools Hub responsive Wix AVIF rendition and shared blog fetch contracts.');
