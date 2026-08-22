#!/usr/bin/env node

/**
 * Adds the exact 11 event tools to the GitHub Pages tools hub. This source
 * change deliberately contains no post URL or relatedBlog field: reciprocal
 * post links are prohibited until each matching Blog post is published.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const BATCH_DIR = path.join(ROOT, 'blog-drafts', 'sep-dec-events-2026');
const METADATA_PATH = path.join(BATCH_DIR, 'batch-post-metadata.json');
const CMS_PATH = path.join(BATCH_DIR, 'cms-manifest.json');
const HUB_PATH = path.join(ROOT, 'tools-hub', 'data.json');

const TYPES = Object.freeze({
  'berlin-autumn-film-language-board': 'Guide',
  'tempelhof-kite-day-approach': 'Planner',
  'uber-arena-night-cost-clock': 'Planner',
  'berlin-double-closure-weekend': 'Planner',
  'clubkultur-week-door-free-finder': 'Guide',
  'food-week-can-i-actually-go': 'Guide',
  'jazzfest-room-comparator': 'Guide',
  'science-week-three-day-window': 'Guide',
  'november-nine-hour-line': 'Guide',
  'christmas-garden-closed-night-calendar': 'Planner',
  'berlin-christmas-window-overlap': 'Planner',
});

const TOOL_HEIGHTS = Object.freeze({
  'berlin-autumn-film-language-board': 1500,
  'tempelhof-kite-day-approach': 1750,
  'uber-arena-night-cost-clock': 1650,
  'berlin-double-closure-weekend': 1950,
  'clubkultur-week-door-free-finder': 2200,
  'food-week-can-i-actually-go': 1500,
  'jazzfest-room-comparator': 1450,
  'science-week-three-day-window': 1550,
  'november-nine-hour-line': 1350,
  'christmas-garden-closed-night-calendar': 1650,
  'berlin-christmas-window-overlap': 1550,
});

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function parseArgs(argv) {
  const values = new Map();
  const flags = new Set();
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--apply') {
      flags.add(token);
      continue;
    }
    if (token.startsWith('--') && argv[index + 1] && !argv[index + 1].startsWith('--')) {
      values.set(token, argv[index + 1]);
      index += 1;
      continue;
    }
    throw new Error(`Unknown or incomplete argument: ${token}`);
  }
  return { has: (name) => flags.has(name), value: (name) => values.get(name) };
}

function readJson(filePath, label) {
  assert(fs.existsSync(filePath), `${label} is missing: ${filePath}`);
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`${label} is not valid JSON: ${error.message}`);
  }
}

function readyIcon(readback, toolSlug) {
  const icon = readback.icons?.find((entry) => entry.slug === toolSlug);
  assert(icon?.uploadReadback?.operationStatus === 'READY', `${toolSlug} needs an exact READY Wix Media readback`);
  assert(icon.uploadReadback.width === 512 && icon.uploadReadback.height === 512, `${toolSlug} icon must read back as 512x512`);
  assert(typeof icon.wixMedia?.url === 'string' && icon.wixMedia.url.startsWith('https://static.wixstatic.com/'), `${toolSlug} has no Wix static icon URL`);
  return icon.wixMedia.url;
}

function makeRecord(post, cmsPlan, iconUrl) {
  assert(cmsPlan && typeof cmsPlan === 'object', `CMS plan missing for ${post.toolSlug}`);
  assert(typeof cmsPlan.title === 'string' && cmsPlan.title, `CMS title missing for ${post.toolSlug}`);
  assert(typeof cmsPlan.lead === 'string' && cmsPlan.lead, `CMS lead missing for ${post.toolSlug}`);
  assert(TYPES[post.toolSlug], `No tools-hub type for ${post.toolSlug}`);
  assert(Number.isInteger(TOOL_HEIGHTS[post.toolSlug]), `No tools-hub height for ${post.toolSlug}`);
  return {
    slug: post.toolSlug,
    title: cmsPlan.title,
    lead: cmsPlan.lead,
    category: 'Discovery',
    hubCategory: 'EventsSports',
    type: TYPES[post.toolSlug],
    tags: [...new Set([...post.focusKeywords, 'berlin events 2026'])],
    aliases: [post.slug.replaceAll('-', ' '), `${post.toolSlug.replaceAll('-', ' ')} tool`],
    widgetUrl: `https://fenerszymanski.github.io/berlinwalk-widgets/${post.toolSlug}/`,
    embedHeight: TOOL_HEIGHTS[post.toolSlug],
    image: iconUrl,
    iconStatus: 'live-wix-media',
    priority: 15,
  };
}

function writeJsonAtomically(filePath, value) {
  const temporaryPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  fs.renameSync(temporaryPath, filePath);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const readbackArg = args.value('--icon-readback');
  assert(readbackArg, '--icon-readback is required');
  const metadata = readJson(METADATA_PATH, 'Batch metadata');
  const cms = readJson(CMS_PATH, 'CMS plan');
  const hub = readJson(HUB_PATH, 'tools-hub data');
  const readback = readJson(path.resolve(process.cwd(), readbackArg), 'Exact Wix icon readback');
  assert(metadata.batch === 'sep-dec-events-2026' && metadata.posts?.length === 11, 'Batch must contain exactly 11 posts');
  assert(readback.batch === metadata.batch && readback.status === 'COMPLETED' && readback.completedIconCount === 11, 'Icon readback must be a completed exact-11 run');
  assert(Array.isArray(hub.tools), 'tools-hub data needs a tools array');

  const targetSlugs = new Set(metadata.posts.map((post) => post.toolSlug));
  const existing = hub.tools.filter((tool) => targetSlugs.has(tool.slug));
  assert(!existing.length, `tools-hub already contains event tool slugs: ${existing.map((tool) => tool.slug).join(', ')}`);
  const records = metadata.posts.map((post) => makeRecord(post, cms.tools?.[post.toolSlug], readyIcon(readback, post.toolSlug)));
  assert(records.length === 11 && new Set(records.map((record) => record.slug)).size === 11, 'tools-hub update must contain exact 11 unique records');
  assert(records.every((record) => !Object.hasOwn(record, 'relatedBlog')), 'Draft-linked tools must not receive a relatedBlog field');
  const result = { ...hub, tools: [...hub.tools, ...records] };
  if (args.has('--apply')) writeJsonAtomically(HUB_PATH, result);
  console.log(JSON.stringify({
    mode: args.has('--apply') ? 'APPLIED' : 'DRY_RUN',
    batch: metadata.batch,
    added: records.map((record) => ({ slug: record.slug, type: record.type, embedHeight: record.embedHeight, image: record.image })),
    relatedBlogFields: 'omitted until matching Blog posts are published',
  }, null, 2));
}

main();
