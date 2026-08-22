#!/usr/bin/env node

/**
 * Records the exact 11 approved event-tool icon assets without exposing image
 * generation provenance in the public icon manifest.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const BATCH_DIR = path.join(ROOT, 'blog-drafts', 'sep-dec-events-2026');
const METADATA_PATH = path.join(BATCH_DIR, 'batch-post-metadata.json');
const CMS_PATH = path.join(BATCH_DIR, 'cms-manifest.json');
const ICON_MANIFEST_PATH = path.join(ROOT, 'tools-home', 'icons', 'manifest.json');

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
  assert(icon?.uploadReadback?.operationStatus === 'READY', `${toolSlug} needs READY Wix Media readback`);
  assert(icon.uploadReadback.width === 512 && icon.uploadReadback.height === 512, `${toolSlug} Wix Media icon is not 512x512`);
  assert(typeof icon.wixMedia?.url === 'string' && icon.wixMedia.url.startsWith('https://static.wixstatic.com/'), `${toolSlug} has no Wix static icon URL`);
  return icon.wixMedia.url;
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
  const manifest = readJson(ICON_MANIFEST_PATH, 'Icon manifest');
  const readback = readJson(path.resolve(process.cwd(), readbackArg), 'Exact Wix icon readback');
  assert(metadata.batch === 'sep-dec-events-2026' && metadata.posts?.length === 11, 'Batch must contain exactly 11 posts');
  assert(readback.batch === metadata.batch && readback.status === 'COMPLETED' && readback.completedIconCount === 11, 'Icon readback must be a completed exact-11 run');
  assert(Array.isArray(manifest), 'Icon manifest must be an array');

  const targetSlugs = new Set(metadata.posts.map((post) => post.toolSlug));
  const existing = manifest.filter((entry) => targetSlugs.has(entry.slug));
  assert(!existing.length, `Icon manifest already contains event tool slugs: ${existing.map((entry) => entry.slug).join(', ')}`);
  const records = metadata.posts.map((post) => {
    const title = cms.tools?.[post.toolSlug]?.title;
    assert(typeof title === 'string' && title, `CMS title missing for ${post.toolSlug}`);
    const wixUrl = readyIcon(readback, post.toolSlug);
    return {
      slug: post.toolSlug,
      title,
      category: 'Events',
      png512: `tools-home/icons/${post.toolSlug}.png`,
      png160: `tools-home/icons/${post.toolSlug}-160.png`,
      githubPagesUrl: `https://fenerszymanski.github.io/berlinwalk-widgets/tools-home/icons/${post.toolSlug}-160.png`,
      wixUrl,
    };
  });
  assert(records.length === 11 && new Set(records.map((record) => record.slug)).size === 11, 'Icon update must contain exact 11 unique records');
  assert(records.every((record) => !('model' in record || 'promptSource' in record || 'sourceSheet' in record)), 'Public icon records must not expose generation provenance');
  const result = [...manifest, ...records];
  if (args.has('--apply')) writeJsonAtomically(ICON_MANIFEST_PATH, result);
  console.log(JSON.stringify({ mode: args.has('--apply') ? 'APPLIED' : 'DRY_RUN', batch: metadata.batch, added: records }, null, 2));
}

main();
