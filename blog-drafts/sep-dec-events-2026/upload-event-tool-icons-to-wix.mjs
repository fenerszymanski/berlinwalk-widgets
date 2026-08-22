#!/usr/bin/env node

/**
 * Scoped Media Manager uploader for the September–December 2026 event tools.
 *
 * This deliberately does not read or write either icon manifest, tools-hub
 * data, CMS data, or Blog data. With no arguments it is a local-only
 * validation pass. The only network-capable route is the explicit command:
 *
 *   node upload-event-tool-icons-to-wix.mjs --apply --run-id <safe-id>
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import {
  API_ROOT,
  BATCH_SLUG,
  ROOT,
  SITE_ID,
  assert,
  batchReportPath,
  imageDimensions,
} from './wix-batch-common.mjs';

const SCHEMA_VERSION = 'berlinwalk.sep-dec-events-2026.tool-icon-upload.v1';
const SCOPE = 'exact-11-event-tool-icons-512px';
const MIME_TYPE = 'image/png';
const CACHE_FILE = 'tool-icon-upload-cache.json';
const REPORT_FILE = 'tool-icon-upload-readback.json';
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const READY_POLL_ATTEMPTS = 8;
const READY_POLL_DELAY_MS = 750;

const EXPECTED_SLUGS = Object.freeze([
  'berlin-autumn-film-language-board',
  'tempelhof-kite-day-approach',
  'uber-arena-night-cost-clock',
  'berlin-double-closure-weekend',
  'clubkultur-week-door-free-finder',
  'food-week-can-i-actually-go',
  'jazzfest-room-comparator',
  'science-week-three-day-window',
  'november-nine-hour-line',
  'christmas-garden-closed-night-calendar',
  'berlin-christmas-window-overlap',
]);

const EXPECTED_ICONS = Object.freeze(EXPECTED_SLUGS.map((slug) => Object.freeze({
  slug,
  relativePath: `tools-home/icons/${slug}.png`,
})));

assert(EXPECTED_ICONS.length === 11, 'The scoped event-icon uploader must contain exactly 11 icons');
assert(new Set(EXPECTED_SLUGS).size === EXPECTED_SLUGS.length, 'Scoped event-icon uploader contains duplicate slugs');

const USAGE = `Usage:
  node blog-drafts/${BATCH_SLUG}/upload-event-tool-icons-to-wix.mjs
  node blog-drafts/${BATCH_SLUG}/upload-event-tool-icons-to-wix.mjs --apply --run-id <safe-run-id>

Default mode validates exactly 11 local 512px PNG files and makes zero Wix calls.
The --apply form is the only mode that can call Wix Media. It writes only:
  output/qa/${BATCH_SLUG}/<safe-run-id>/wix/${CACHE_FILE}
  output/qa/${BATCH_SLUG}/<safe-run-id>/wix/${REPORT_FILE}
`;

function parseArgs(argv) {
  const parsed = { apply: false, help: false, runId: null };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--help' || token === '-h') {
      parsed.help = true;
      continue;
    }
    if (token === '--apply') {
      assert(!parsed.apply, '--apply may be supplied only once');
      parsed.apply = true;
      continue;
    }
    if (token.startsWith('--apply=')) {
      throw new Error('--apply is a bare confirmation flag. Use --apply --run-id <safe-run-id>.');
    }
    if (token === '--run-id') {
      assert(parsed.runId === null, '--run-id may be supplied only once');
      const value = argv[index + 1];
      assert(value && !value.startsWith('--'), '--run-id requires a value');
      parsed.runId = value;
      index += 1;
      continue;
    }
    if (token.startsWith('--run-id=')) {
      throw new Error('--run-id must be supplied as --run-id <safe-run-id>.');
    }
    throw new Error(`Unknown argument: ${token}.\n${USAGE}`);
  }

  if (parsed.help) return parsed;
  if (parsed.apply) {
    assert(parsed.runId, '--run-id is required with --apply');
    assert(/^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$/.test(parsed.runId), '--run-id must be 1-80 safe characters: letters, numbers, dots, underscores or hyphens');
  } else {
    assert(parsed.runId === null, '--run-id is allowed only with the explicit --apply mode');
  }
  return parsed;
}

function absoluteInsideRoot(relativePath) {
  const absolutePath = path.resolve(ROOT, relativePath);
  assert(absolutePath.startsWith(`${ROOT}${path.sep}`), `Icon path escapes the repository: ${relativePath}`);
  return absolutePath;
}

function fileSha256(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function verifyPng512(entry) {
  assert(entry && typeof entry.slug === 'string' && entry.slug, 'Every scoped icon needs a slug');
  assert(entry.relativePath === `tools-home/icons/${entry.slug}.png`, `Unexpected icon path for ${entry.slug}`);
  const absolutePath = absoluteInsideRoot(entry.relativePath);
  assert(fs.existsSync(absolutePath), `Missing required icon: ${entry.relativePath}`);
  const stats = fs.statSync(absolutePath);
  assert(stats.isFile(), `Required icon is not a file: ${entry.relativePath}`);
  const bytes = fs.readFileSync(absolutePath);
  assert(bytes.length >= PNG_SIGNATURE.length && bytes.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE), `Required icon is not a PNG: ${entry.relativePath}`);
  const dimensions = imageDimensions(absolutePath);
  assert(dimensions.width === 512 && dimensions.height === 512, `${entry.relativePath} must be exactly 512x512, found ${dimensions.width}x${dimensions.height}`);
  return {
    slug: entry.slug,
    path: entry.relativePath,
    absolutePath,
    bytes: stats.size,
    sha256: fileSha256(absolutePath),
    dimensions,
  };
}

function buildInventory() {
  const inventory = EXPECTED_ICONS.map(verifyPng512);
  assert(inventory.length === 11, 'The local event-icon inventory must contain exactly 11 files');
  assert(new Set(inventory.map((entry) => entry.slug)).size === 11, 'The local event-icon inventory has duplicate slugs');
  return inventory;
}

function validateWixUrl(url, label) {
  assert(typeof url === 'string' && url.trim(), `${label} URL is missing`);
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`${label} URL is invalid`);
  }
  assert(parsed.protocol === 'https:', `${label} URL must use HTTPS`);
  assert(parsed.hostname === 'wixstatic.com' || parsed.hostname.endsWith('.wixstatic.com'), `${label} URL must be a Wix static-media URL`);
  return parsed.toString();
}

function sanitizeReadback(file) {
  assert(file && typeof file === 'object', 'Wix Media upload response does not contain a file object');
  assert(typeof file.id === 'string' && file.id, 'Wix Media upload response does not contain a file id');
  const url = validateWixUrl(file.url, 'Wix Media upload response');
  const image = file.media?.image?.image || {};
  const width = Number.isInteger(image.width) ? image.width : null;
  const height = Number.isInteger(image.height) ? image.height : null;
  if (width !== null) assert(width === 512, `Wix Media readback width for ${file.id} is ${width}, expected 512`);
  if (height !== null) assert(height === 512, `Wix Media readback height for ${file.id} is ${height}, expected 512`);
  if (file.operationStatus) assert(file.operationStatus !== 'FAILED', `Wix Media processing failed for ${file.id}`);
  return {
    id: file.id,
    url,
    displayName: typeof file.displayName === 'string' ? file.displayName : null,
    mediaType: typeof file.mediaType === 'string' ? file.mediaType : null,
    operationStatus: typeof file.operationStatus === 'string' ? file.operationStatus : null,
    width,
    height,
  };
}

function validateCacheEntry(entry, inventoryEntry) {
  if (!entry || typeof entry !== 'object') return null;
  if (entry.sha256 !== inventoryEntry.sha256) return null;
  if (entry.slug !== inventoryEntry.slug || entry.path !== inventoryEntry.path) return null;
  if (!entry.wixMedia || !entry.uploadReadback) return null;
  try {
    const readback = sanitizeReadback(entry.uploadReadback);
    if (entry.wixMedia.id !== readback.id || entry.wixMedia.url !== readback.url) return null;
    if (readback.operationStatus !== 'READY' || readback.width !== 512 || readback.height !== 512) return null;
    return {
      slug: inventoryEntry.slug,
      path: inventoryEntry.path,
      sha256: inventoryEntry.sha256,
      bytes: inventoryEntry.bytes,
      dimensions: inventoryEntry.dimensions,
      source: 'cache',
      wixMedia: { id: readback.id, url: readback.url },
      uploadReadback: readback,
      uploadedAt: typeof entry.uploadedAt === 'string' ? entry.uploadedAt : null,
      fileName: typeof entry.fileName === 'string' ? entry.fileName : null,
    };
  } catch {
    return null;
  }
}

function readCache(cachePath, runId) {
  if (!fs.existsSync(cachePath)) {
    return {
      schemaVersion: SCHEMA_VERSION,
      batch: BATCH_SLUG,
      scope: SCOPE,
      runId,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      icons: {},
    };
  }
  let cache;
  try {
    cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
  } catch (error) {
    throw new Error(`Existing icon-upload cache is not valid JSON: ${error.message}`);
  }
  assert(cache && typeof cache === 'object', 'Existing icon-upload cache must be an object');
  assert(cache.schemaVersion === SCHEMA_VERSION, 'Existing icon-upload cache has an unexpected schema version');
  assert(cache.batch === BATCH_SLUG && cache.scope === SCOPE, 'Existing icon-upload cache belongs to another batch or scope');
  assert(cache.runId === runId, 'Existing icon-upload cache belongs to another run id');
  assert(cache.icons && typeof cache.icons === 'object' && !Array.isArray(cache.icons), 'Existing icon-upload cache has invalid icons data');
  return cache;
}

function writeJsonAtomically(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  try {
    fs.writeFileSync(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 });
    fs.renameSync(temporaryPath, filePath);
  } finally {
    if (fs.existsSync(temporaryPath)) fs.unlinkSync(temporaryPath);
  }
}

function headers() {
  assert(process.env.WIX_API_KEY, 'WIX_API_KEY is not loaded. Source scripts/load-api-keys.sh only for an explicit --apply run.');
  return {
    Authorization: process.env.WIX_API_KEY,
    'wix-site-id': SITE_ID,
    'Content-Type': 'application/json',
  };
}

function safeExcerpt(value) {
  return String(value || '')
    .replace(/https?:\/\/[^\s"'<>]+/gi, '[url redacted]')
    .replace(/(authorization\s*[:=]\s*)[^,\s"'}]+/gi, '$1[redacted]')
    .slice(0, 800);
}

async function generateUploadUrl(fileName, labels, activity) {
  const requestHeaders = headers();
  activity.generateUploadUrlCalls += 1;
  const response = await fetch(`${API_ROOT}/site-media/v1/files/generate-upload-url`, {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify({ mimeType: MIME_TYPE, fileName, private: false, labels }),
    signal: AbortSignal.timeout(30000),
  });
  const raw = await response.text();
  let payload = {};
  try {
    payload = raw ? JSON.parse(raw) : {};
  } catch {
    payload = { raw: safeExcerpt(raw) };
  }
  if (!response.ok) {
    throw new Error(`Wix Media generate-upload-url failed (HTTP ${response.status}): ${safeExcerpt(JSON.stringify(payload))}`);
  }
  assert(typeof payload.uploadUrl === 'string' && payload.uploadUrl.startsWith('https://'), 'Wix Media did not return an HTTPS upload URL');
  return payload.uploadUrl;
}

async function uploadToGeneratedUrl(uploadUrl, filePath, slug, activity) {
  activity.uploadPutCalls += 1;
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': MIME_TYPE },
    body: fs.readFileSync(filePath),
    signal: AbortSignal.timeout(60000),
  });
  const raw = await response.text();
  let payload = {};
  try {
    payload = raw ? JSON.parse(raw) : {};
  } catch {
    payload = { raw: safeExcerpt(raw) };
  }
  if (!response.ok) {
    throw new Error(`Wix Media upload failed for ${slug} (HTTP ${response.status}): ${safeExcerpt(JSON.stringify(payload))}`);
  }
  return payload.file || payload;
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function readMediaFileById(fileId, activity) {
  activity.getFileByIdCalls += 1;
  const response = await fetch(`${API_ROOT}/site-media/v1/files/get-file-by-id?fileId=${encodeURIComponent(fileId)}`, {
    method: 'GET',
    headers: headers(),
    signal: AbortSignal.timeout(30000),
  });
  const raw = await response.text();
  let payload = {};
  try {
    payload = raw ? JSON.parse(raw) : {};
  } catch {
    payload = { raw: safeExcerpt(raw) };
  }
  if (!response.ok) throw new Error(`Wix Media get-file-by-id failed for ${fileId} (HTTP ${response.status}): ${safeExcerpt(JSON.stringify(payload))}`);
  const file = payload.file || payload.files?.[0] || payload;
  return sanitizeReadback(file);
}

async function waitForReady(uploadReadback, activity) {
  for (let attempt = 1; attempt <= READY_POLL_ATTEMPTS; attempt += 1) {
    const mediaReadback = await readMediaFileById(uploadReadback.id, activity);
    assert(mediaReadback.id === uploadReadback.id, `Wix Media GET returned a different file id for ${uploadReadback.id}`);
    assert(mediaReadback.url === uploadReadback.url, `Wix Media GET returned a different URL for ${uploadReadback.id}`);
    assert(mediaReadback.width === 512 && mediaReadback.height === 512, `Wix Media GET must confirm 512x512 for ${uploadReadback.id}`);
    if (mediaReadback.operationStatus === 'READY') return mediaReadback;
    if (mediaReadback.operationStatus === 'FAILED') throw new Error(`Wix Media processing failed for ${uploadReadback.id}`);
    if (attempt < READY_POLL_ATTEMPTS) await delay(READY_POLL_DELAY_MS);
  }
  throw new Error(`Wix Media file ${uploadReadback.id} did not reach READY after ${READY_POLL_ATTEMPTS} checks`);
}

async function uploadIcon(inventoryEntry, runId, activity) {
  const fileName = `berlinwalk-event-tool-icon-20260822-${inventoryEntry.slug}.png`;
  const labels = ['berlinwalk', 'berlintools', 'tool-icon', BATCH_SLUG, inventoryEntry.slug, runId];
  const uploadUrl = await generateUploadUrl(fileName, labels, activity);
  // The presigned URL is intentionally never written to disk or printed.
  const uploadResponse = sanitizeReadback(await uploadToGeneratedUrl(uploadUrl, inventoryEntry.absolutePath, inventoryEntry.slug, activity));
  const uploadReadback = await waitForReady(uploadResponse, activity);
  activity.successfulUploads += 1;
  return {
    slug: inventoryEntry.slug,
    path: inventoryEntry.path,
    sha256: inventoryEntry.sha256,
    bytes: inventoryEntry.bytes,
    dimensions: inventoryEntry.dimensions,
    source: 'uploaded',
    fileName,
    uploadedAt: new Date().toISOString(),
    wixMedia: { id: uploadReadback.id, url: uploadReadback.url },
    uploadReadback,
  };
}

function reportFor({ runId, cache, inventory, resultBySlug, startedAt, status, activity }) {
  const icons = inventory.map((entry) => resultBySlug.get(entry.slug) || {
    slug: entry.slug,
    path: entry.path,
    sha256: entry.sha256,
    bytes: entry.bytes,
    dimensions: entry.dimensions,
    source: 'pending',
    wixMedia: null,
    uploadReadback: null,
  });
  const completed = icons.filter((icon) => icon.wixMedia);
  return {
    schemaVersion: SCHEMA_VERSION,
    batch: BATCH_SLUG,
    scope: SCOPE,
    runId,
    status,
    startedAt,
    updatedAt: new Date().toISOString(),
    expectedIconCount: EXPECTED_ICONS.length,
    expectedSlugs: EXPECTED_SLUGS,
    completedIconCount: completed.length,
    uploadedThisInvocation: icons.filter((icon) => icon.source === 'uploaded').length,
    cachedThisInvocation: icons.filter((icon) => icon.source === 'cache').length,
    wixCallsThisInvocation: activity.generateUploadUrlCalls + activity.uploadPutCalls + activity.getFileByIdCalls,
    remoteAttempts: {
      generateUploadUrlCalls: activity.generateUploadUrlCalls,
      uploadPutCalls: activity.uploadPutCalls,
      getFileByIdCalls: activity.getFileByIdCalls,
      successfulUploads: activity.successfulUploads,
    },
    remoteSequence: [
      'POST /site-media/v1/files/generate-upload-url',
      'PUT <returned uploadUrl>',
      'GET /site-media/v1/files/get-file-by-id until READY',
    ],
    readbackOrigin: 'The exact Wix Media get-file-by-id readback after the PUT upload reaches READY.',
    note: 'No Blog, CMS, manifest, tools-hub, or publish endpoint is called by this script.',
    icons,
    toolIcons: Object.fromEntries(completed.map((icon) => [icon.slug, {
      path: icon.path,
      wixMedia: icon.wixMedia,
    }])),
    cachePath: path.relative(ROOT, batchReportPath(runId, CACHE_FILE)),
    reportPath: path.relative(ROOT, batchReportPath(runId, REPORT_FILE)),
    cacheUpdatedAt: cache.updatedAt,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(USAGE);
    return;
  }

  const inventory = buildInventory();
  if (!args.apply) {
    console.log(JSON.stringify({
      mode: 'DRY_RUN_LOCAL_ONLY',
      batch: BATCH_SLUG,
      scope: SCOPE,
      wixCalls: 0,
      expectedIconCount: inventory.length,
      icons: inventory.map(({ slug, path: iconPath, sha256, bytes, dimensions }) => ({ slug, path: iconPath, sha256, bytes, dimensions })),
    }, null, 2));
    return;
  }

  const cachePath = batchReportPath(args.runId, CACHE_FILE);
  const reportPath = batchReportPath(args.runId, REPORT_FILE);
  const cache = readCache(cachePath, args.runId);
  const startedAt = new Date().toISOString();
  const resultBySlug = new Map();
  const activity = { generateUploadUrlCalls: 0, uploadPutCalls: 0, getFileByIdCalls: 0, successfulUploads: 0 };

  for (const entry of inventory) {
    const cached = validateCacheEntry(cache.icons[entry.slug], entry);
    if (cached) resultBySlug.set(entry.slug, cached);
  }

  // An in-progress receipt makes any partial explicit run safely resumable.
  writeJsonAtomically(reportPath, reportFor({
    runId: args.runId,
    cache,
    inventory,
    resultBySlug,
    startedAt,
    status: 'IN_PROGRESS',
    activity,
  }));

  try {
    for (const entry of inventory) {
      if (resultBySlug.has(entry.slug)) continue;
      const uploaded = await uploadIcon(entry, args.runId, activity);
      cache.icons[entry.slug] = {
        slug: uploaded.slug,
        path: uploaded.path,
        sha256: uploaded.sha256,
        fileName: uploaded.fileName,
        uploadedAt: uploaded.uploadedAt,
        wixMedia: uploaded.wixMedia,
        uploadReadback: uploaded.uploadReadback,
      };
      cache.updatedAt = new Date().toISOString();
      writeJsonAtomically(cachePath, cache);
      resultBySlug.set(entry.slug, uploaded);
      writeJsonAtomically(reportPath, reportFor({
        runId: args.runId,
        cache,
        inventory,
        resultBySlug,
        startedAt,
        status: 'IN_PROGRESS',
        activity,
      }));
    }
  } catch (error) {
    writeJsonAtomically(reportPath, reportFor({
      runId: args.runId,
      cache,
      inventory,
      resultBySlug,
      startedAt,
      status: 'FAILED_PARTIAL',
      activity,
    }));
    throw error;
  }

  const report = reportFor({
    runId: args.runId,
    cache,
    inventory,
    resultBySlug,
    startedAt,
    status: 'COMPLETED',
    activity,
  });
  assert(report.completedIconCount === 11, `Expected 11 completed icon receipts, found ${report.completedIconCount}`);
  writeJsonAtomically(reportPath, report);
  console.log(JSON.stringify({
    mode: 'UPLOADED_AND_RECORDED',
    batch: BATCH_SLUG,
    runId: args.runId,
    iconCount: report.completedIconCount,
    uploadedThisInvocation: report.uploadedThisInvocation,
    cachedThisInvocation: report.cachedThisInvocation,
    wixCallsThisInvocation: report.wixCallsThisInvocation,
    reportPath: report.reportPath,
    cachePath: report.cachePath,
    toolIcons: report.toolIcons,
  }, null, 2));
}

main().catch((error) => {
  console.error(`ERROR: ${safeExcerpt(error?.stack || error?.message || error)}`);
  process.exit(1);
});
