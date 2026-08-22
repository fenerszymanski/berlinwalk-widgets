#!/usr/bin/env node

/**
 * Downloads only the explicitly listed Wikimedia Commons source images, creates
 * 1600px-max JPEG masters, and records reproducible local source metadata.
 *
 * Default mode is read-only. `--apply` is required before any download or
 * filesystem mutation. This script deliberately never writes Wix Media.
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const BATCH_DIR = path.join(ROOT, 'blog-drafts', 'sep-dec-events-2026');
const MANIFEST_PATH = path.join(BATCH_DIR, 'commons-image-sources.json');
const QA_DIR = path.join(ROOT, 'output', 'qa', 'sep-dec-events-2026', 'images');
const apply = process.argv.includes('--apply');
const onlySlug = process.argv.find((arg) => arg.startsWith('--slug='))?.slice('--slug='.length) || null;

const assert = (condition, message) => { if (!condition) throw new Error(message); };
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, value) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`); };
const writeText = (file, value) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, value); };
const groupBy = (items, keyFn) => items.reduce((groups, item) => {
  const key = keyFn(item);
  (groups[key] ||= []).push(item);
  return groups;
}, {});
const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function imageSize(file) {
  const output = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' });
  const width = Number(output.match(/pixelWidth:\s*(\d+)/)?.[1]);
  const height = Number(output.match(/pixelHeight:\s*(\d+)/)?.[1]);
  assert(Number.isFinite(width) && Number.isFinite(height), `Cannot read dimensions: ${file}`);
  return { width, height };
}

function normalise(entry) {
  const required = ['slug', 'filename', 'role', 'caption', 'altText', 'descriptionUrl', 'fullUrl', 'creator', 'licenseName', 'sourceDimensions', 'mimeType'];
  for (const key of required) assert(entry[key] !== undefined && entry[key] !== '', `Missing ${key} for ${entry.slug || 'unknown'}/${entry.filename || 'unknown'}`);
  const sourceDimensions = Array.isArray(entry.sourceDimensions)
    ? entry.sourceDimensions.map(Number)
    : String(entry.sourceDimensions).match(/^(\d+)\s*[x×]\s*(\d+)$/)?.slice(1).map(Number);
  assert(Array.isArray(sourceDimensions) && sourceDimensions.length === 2 && sourceDimensions.every((value) => Number.isFinite(value) && value > 0), `Invalid sourceDimensions: ${entry.slug}/${entry.filename}`);
  assert(entry.mimeType === 'image/jpeg', `Only JPEG Commons sources are supported: ${entry.slug}/${entry.filename}`);
  assert(!/[()]/.test(entry.descriptionUrl), `descriptionUrl must percent-encode literal parentheses: ${entry.descriptionUrl}`);
  assert(entry.filename.endsWith('.jpg'), `Final optimized filename must be .jpg: ${entry.filename}`);
  return { ...entry, sourceDimensions };
}

function sourcesMarkdown(slug, records) {
  const lines = [
    `# Image sources — ${slug}`,
    '',
    'Internal source record. Reader-facing licence lines are generated into the article Ricos Image credits disclosure, not from this file.',
    '',
  ];
  for (const record of records) {
    const licence = record.licenseUrl ? `[${record.licenseName}](${record.licenseUrl})` : record.licenseName;
    lines.push(`## ${record.filename}`, '', `- Role: ${record.role}`, `- Caption: ${record.caption}`, `- Alt text: ${record.altText}`, `- Source: [Wikimedia Commons description](${record.descriptionUrl})`, `- Creator: ${record.creator}`, `- Licence: ${licence}`, `- Source-page dimensions: ${record.sourceDimensions.join(' × ')}`, `- Downloaded derivative: ${record.downloadUrl}`, `- Downloaded dimensions: ${record.downloadedDimensions.width} × ${record.downloadedDimensions.height}`, `- Downloaded SHA-256: ${record.rawSha256}`, `- Optimized SHA-256: ${record.optimizedSha256}`, `- Optimized dimensions: ${record.optimizedDimensions.width} × ${record.optimizedDimensions.height}`, '');
  }
  return `${lines.join('\n')}\n`;
}

function downloadCommonsSource(url, outputPath, label) {
  const temporary = `${outputPath}.${process.pid}.download`;
  try {
    execFileSync('curl', [
      '--fail', '--location', '--silent', '--show-error', '--max-time', '45',
      '--user-agent', 'BerlinWalk-source-prep/1.0 (source-record)',
      '--output', temporary, url,
    ], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    const bytes = fs.readFileSync(temporary);
    assert(bytes.length > 10_000, `Commons response is unexpectedly small for ${label}`);
    fs.renameSync(temporary, outputPath);
  } catch (error) {
    const detail = String(error.stderr || error.message || '').replace(/\s+/g, ' ').trim();
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
    if (/429/.test(detail)) throw new Error(`Commons rate limit for ${label}: server rejected this request; stop and retry after its backoff window`);
    throw new Error(`Commons download failed for ${label}: ${detail || 'curl failed'}`);
  }
}

function commonsThumbnailUrl(record) {
  const source = new URL(record.descriptionUrl);
  assert(source.hostname === 'commons.wikimedia.org', `Commons description URL must be on commons.wikimedia.org: ${record.descriptionUrl}`);
  const pathname = decodeURIComponent(source.pathname);
  const prefix = '/wiki/File:';
  assert(pathname.startsWith(prefix), `Commons description URL must identify a File page: ${record.descriptionUrl}`);
  const title = pathname.slice(prefix.length);
  assert(title, `Commons description URL has no file title: ${record.descriptionUrl}`);
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(title)}?width=1600`;
}

async function downloadAndOptimise(record) {
  const draftDir = path.join(ROOT, 'blog-drafts', record.slug);
  const rawDir = path.join(draftDir, 'images', 'raw');
  const optimizedDir = path.join(draftDir, 'images', 'optimized');
  const rawPath = path.join(rawDir, record.filename);
  const optimizedPath = path.join(optimizedDir, record.filename);
  const downloadUrl = commonsThumbnailUrl(record);

  fs.mkdirSync(rawDir, { recursive: true });
  fs.mkdirSync(optimizedDir, { recursive: true });
  if (!fs.existsSync(rawPath)) {
    downloadCommonsSource(downloadUrl, rawPath, `${record.slug}/${record.filename}`);
    await sleep(10000);
  }
  execFileSync('sips', ['--resampleHeightWidthMax', '1600', '-s', 'format', 'jpeg', '-s', 'formatOptions', '86', rawPath, '--out', optimizedPath], { stdio: 'pipe' });
  const downloadedDimensions = imageSize(rawPath);
  const optimizedDimensions = imageSize(optimizedPath);
  assert(Math.max(optimizedDimensions.width, optimizedDimensions.height) <= 1600, `Optimized image exceeds 1600px: ${optimizedPath}`);
  return {
    ...record,
    rawPath: path.relative(ROOT, rawPath),
    optimizedPath: path.relative(path.join(ROOT, 'blog-drafts', record.slug), optimizedPath),
    downloadUrl,
    downloadedDimensions,
    rawSha256: sha256(fs.readFileSync(rawPath)),
    optimizedSha256: sha256(fs.readFileSync(optimizedPath)),
    optimizedDimensions,
    downloadedAt: new Date().toISOString(),
  };
}

async function main() {
  assert(fs.existsSync(MANIFEST_PATH), `Missing source manifest: ${MANIFEST_PATH}`);
  const manifest = readJson(MANIFEST_PATH).map(normalise);
  const selected = manifest.filter((entry) => !onlySlug || entry.slug === onlySlug);
  assert(selected.length, onlySlug ? `No source records for --slug=${onlySlug}` : 'Source manifest is empty');
  const duplicates = selected.filter((entry, index) => selected.findIndex((candidate) => candidate.slug === entry.slug && candidate.filename === entry.filename) !== index);
  assert(!duplicates.length, `Duplicate slug/filename source records: ${duplicates.map((entry) => `${entry.slug}/${entry.filename}`).join(', ')}`);

  const planned = Object.entries(groupBy(selected, (entry) => entry.slug)).map(([slug, entries]) => ({ slug, commonsImages: entries.length, files: entries.map((entry) => entry.filename) }));
  if (!apply) {
    console.log(JSON.stringify({ mode: 'DRY_RUN', manifest: path.relative(ROOT, MANIFEST_PATH), selected: selected.length, bySlug: planned, missingPerPost: planned.filter((item) => item.commonsImages < 4).map((item) => ({ slug: item.slug, commonsImages: item.commonsImages })) }, null, 2));
    return;
  }

  const completed = [];
  for (const record of selected) completed.push(await downloadAndOptimise(record));
  for (const [slug, entries] of Object.entries(groupBy(completed, (entry) => entry.slug))) {
    const sorted = entries.toSorted((a, b) => a.filename.localeCompare(b.filename));
    const draftDir = path.join(ROOT, 'blog-drafts', slug);
    writeJson(path.join(draftDir, 'images', 'sources.json'), sorted);
    writeText(path.join(draftDir, 'visual-sources.md'), sourcesMarkdown(slug, sorted));
  }
  const result = { mode: 'APPLIED', completedAt: new Date().toISOString(), selected: completed.length, bySlug: Object.entries(groupBy(completed, (entry) => entry.slug)).map(([slug, entries]) => ({ slug, commonsImages: entries.length, optimized: entries.map((entry) => ({ filename: entry.filename, dimensions: entry.optimizedDimensions, sha256: entry.optimizedSha256 })) })) };
  writeJson(path.join(QA_DIR, 'commons-prep.json'), result);
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => { console.error(`ERROR: ${error.stack || error.message}`); process.exit(1); });
