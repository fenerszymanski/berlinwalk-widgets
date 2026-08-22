#!/usr/bin/env node

/**
 * Builds the only image manifest accepted by the Wix Blog and BerlinTools
 * batch writers. It joins the checked Commons ledger to the exact, READY Wix
 * Media icon readback. Default mode is read-only; --apply writes one manifest.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const BATCH_DIR = path.join(ROOT, 'blog-drafts', 'sep-dec-events-2026');
const METADATA_PATH = path.join(BATCH_DIR, 'batch-post-metadata.json');
const SOURCES_PATH = path.join(BATCH_DIR, 'commons-image-sources.json');
const DEFAULT_OUTPUT = path.join(BATCH_DIR, 'wix-asset-manifest.json');

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

const QUICK_SUMMARY_HEIGHTS = Object.freeze({
  'film-festivals-berlin-autumn': 780,
  'giant-kite-festival-berlin': 720,
  'ice-hockey-basketball-berlin': 660,
  'pyronale-berlin': 660,
  'tag-der-clubkultur-berlin': 720,
  'berlin-food-week': 780,
  'jazzfest-berlin': 660,
  'berlin-science-week': 740,
  'berlin-freedom-week': 720,
  'christmas-garden-berlin': 720,
  'berlin-christmas-events-beyond-markets': 780,
});

const FAQ_HEIGHT = 860;

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

function sourceLabel(descriptionUrl) {
  const parsed = new URL(descriptionUrl);
  const decoded = decodeURIComponent(parsed.pathname.split('/').at(-1) || 'Wikimedia Commons image')
    .replace(/^File:/i, '')
    .replace(/\.[a-z0-9]{2,5}$/i, '')
    .replace(/_/g, ' ')
    .trim();
  return decoded || 'Wikimedia Commons image';
}

function requiredReadyIcon(readback, toolSlug) {
  const icon = readback.icons?.find((entry) => entry.slug === toolSlug);
  assert(icon, `Icon readback is missing ${toolSlug}`);
  assert(icon.uploadReadback?.operationStatus === 'READY', `${toolSlug} Wix icon is not READY`);
  assert(icon.uploadReadback?.width === 512 && icon.uploadReadback?.height === 512, `${toolSlug} Wix icon dimensions are not 512x512`);
  assert(icon.wixMedia?.id && icon.wixMedia?.url, `${toolSlug} Wix icon has no id/url`);
  return { path: icon.path, wixMedia: { id: icon.wixMedia.id, url: icon.wixMedia.url } };
}

function buildManifest(metadata, sources, readback, embedVersion) {
  assert(metadata.batch === 'sep-dec-events-2026' && Array.isArray(metadata.posts) && metadata.posts.length === 11, 'Batch metadata must name the exact 11 posts');
  assert(readback.batch === metadata.batch && readback.status === 'COMPLETED' && readback.completedIconCount === 11, 'Icon readback is not a completed exact-11 run');
  const plans = {};
  const toolIcons = {};

  for (const post of metadata.posts) {
    const imageSources = sources.filter((source) => source.slug === post.slug).sort((left, right) => left.filename.localeCompare(right.filename));
    assert(imageSources.length === 4, `${post.slug} needs exactly four Commons sources`);
    const images = imageSources.map((source) => {
      for (const field of ['filename', 'descriptionUrl', 'creator', 'licenseName', 'licenseUrl']) {
        assert(typeof source[field] === 'string' && source[field].trim(), `${post.slug}/${field} is required for reader-facing credits`);
      }
      return {
        path: `images/optimized/${source.filename}`,
        sourceType: 'commons',
        credit: {
          label: sourceLabel(source.descriptionUrl),
          author: source.creator,
          licenseLabel: source.licenseName,
          licenseUrl: source.licenseUrl,
          sourceUrl: source.descriptionUrl,
          via: 'Wikimedia Commons',
        },
      };
    });
    const icon = requiredReadyIcon(readback, post.toolSlug);
    assert(Number.isInteger(TOOL_HEIGHTS[post.toolSlug]), `No measured widget height for ${post.toolSlug}`);
    assert(Number.isInteger(QUICK_SUMMARY_HEIGHTS[post.slug]), `No measured quick-summary height for ${post.slug}`);
    plans[post.slug] = {
      embedVersion,
      coverPath: images[0].path,
      images,
      embedHeights: {
        quickSummary: QUICK_SUMMARY_HEIGHTS[post.slug],
        tool: TOOL_HEIGHTS[post.toolSlug],
        faq: FAQ_HEIGHT,
      },
    };
    toolIcons[post.toolSlug] = icon;
  }

  assert(Object.keys(plans).length === 11 && Object.keys(toolIcons).length === 11, 'The manifest must contain the exact 11 post and icon plans');
  return { batch: metadata.batch, posts: plans, toolIcons };
}

function writeJsonAtomically(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  fs.renameSync(temporaryPath, filePath);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const iconReadbackArg = args.value('--icon-readback');
  const embedVersion = args.value('--embed-version');
  const outputArg = args.value('--output');
  assert(iconReadbackArg, '--icon-readback is required');
  assert(embedVersion && /^[0-9a-f]{7,64}$/i.test(embedVersion), '--embed-version must be a Git commit SHA');
  const iconReadbackPath = path.resolve(process.cwd(), iconReadbackArg);
  const outputPath = outputArg ? path.resolve(process.cwd(), outputArg) : DEFAULT_OUTPUT;
  const manifest = buildManifest(
    readJson(METADATA_PATH, 'Batch metadata'),
    readJson(SOURCES_PATH, 'Commons source ledger'),
    readJson(iconReadbackPath, 'Exact Wix icon readback'),
    embedVersion,
  );
  if (args.has('--apply')) writeJsonAtomically(outputPath, manifest);
  console.log(JSON.stringify({
    mode: args.has('--apply') ? 'APPLIED' : 'DRY_RUN',
    output: path.relative(ROOT, outputPath),
    batch: manifest.batch,
    posts: Object.keys(manifest.posts).length,
    icons: Object.keys(manifest.toolIcons).length,
    embedVersion,
  }, null, 2));
}

main();
