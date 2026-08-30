#!/usr/bin/env node

import crypto from 'node:crypto';
import {
  lstat,
  readFile,
  readdir,
} from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '_public-dist');
const errors = [];
const warnings = [];
const files = [];

const ALLOWED_EXTENSIONS = new Set([
  '.avif', '.css', '.geojson', '.gif', '.html', '.ico', '.jpeg', '.jpg',
  '.js', '.json', '.m4a', '.mjs', '.mp3', '.mp4', '.ogg', '.otf', '.pdf', '.png',
  '.svg', '.ttf', '.txt', '.vtt', '.wav', '.webm', '.webp', '.woff', '.woff2',
]);
const TEXT_EXTENSIONS = new Set(['.css', '.geojson', '.html', '.js', '.json', '.mjs', '.svg', '.txt', '.vtt']);
const FORBIDDEN_DIRECTORIES = new Set([
  '.agents', '.claude', '.git', '.github', '.playwright-cli', '_src', 'archive',
  'chatgpt-standard-2026-06-12', 'email', 'mockups', 'node_modules', 'output', 'performance', 'previews', 'qa',
  'research', 'scripts', 'source', 'test', 'tests', 'velo',
]);
const FORBIDDEN_ROOTS = new Set([
  'berlinwalk-widgets', 'blog-post-mockup', 'content-upgrade-card',
  'email-journey', 'performance', 'public-repo', 'security',
]);
const REQUIRED_PATHS = [
  '.nojekyll',
  '_compat/wix/e7ea2563499af1987863402a1c181dfcbd44b3a5/booking-calendar-element.js',
  '_compat/wix/f985d8f5288df84d46e904298ad9186236561df1/history-lead-magnet-element.js',
  'audio-tour/audio-tour-element.js',
  'audio-tour/index.html',
  'blog-index/index.json',
  'booking-calendar/book-now-intro-patch.js',
  'css/brand.css',
  'embed-resize.js',
  'homepage-editorial/homepage-editorial.css',
  'history-lead-magnet/assets-manifest.json',
  'history-lead-magnet/history-lead-magnet-element.js',
  'js/blog-journey-inject.js',
  'js/brand.js',
  'kitkat-door-test/index.html',
  'page-editorial/page-editorial.css',
  'tools-hub/data.json',
  'tools-hub/tools-hub-element.js',
  'widgets-hub/widgets-hub-element.js',
];
const EXPECTED_COMPATIBILITY_HASHES = new Map([
  ['homepage-editorial/homepage-editorial.css', '7077de8a302995ad3ad2db5caeb9c6b3f674ee979fac2e8176848f272c2c2ee3'],
  ['_compat/wix/f985d8f5288df84d46e904298ad9186236561df1/history-lead-magnet-element.js', '83559f72195084595b178cbbdb9c12f505328bfbf73b2d9469c33b50c25d46d0'],
  ['_compat/wix/e7ea2563499af1987863402a1c181dfcbd44b3a5/booking-calendar-element.js', '468312ec8492c74fb036e968b78974313711290b836313c4de9570aaf3a6d5c5'],
]);
const REQUIRED_SUBRESOURCE_INTEGRITY = [
  {
    file: 'east-west-1989/index.html',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js',
    integrity: 'sha384-NElt3Op+9NBMCYaef5HxeJmU4Xeard/Lku8ek6hoPTvYkQPh3zLIrJP7KiRocsxO',
  },
  {
    file: 'east-west-1989/index.html',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/Turf.js/6.5.0/turf.min.js',
    integrity: 'sha384-82q0nm29xZzIo5BMtDYnh2/NxeO6FoaK1S/0nF84w3cEsqbBfun3JdMyDVYWfVY5',
  },
];
const ALLOWED_EMAILS = new Set(['info@berlinwalk.com', 'you@example.com']);
const MAX_PUBLIC_FILE_BYTES = 20 * 1024 * 1024;

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    const relative = path.relative(root, absolute).split(path.sep).join('/');
    const metadata = await lstat(absolute);
    if (metadata.isSymbolicLink()) {
      errors.push(`symlink found: ${relative}`);
      continue;
    }
    if (entry.isDirectory()) await walk(absolute);
    else if (entry.isFile()) files.push({ absolute, relative, size: metadata.size });
  }
}

await walk(root);
const fileSet = new Set(files.map(({ relative }) => relative));

for (const required of REQUIRED_PATHS) {
  if (!fileSet.has(required)) errors.push(`required file missing: ${required}`);
}

for (const [relative, expectedHash] of EXPECTED_COMPATIBILITY_HASHES) {
  if (!fileSet.has(relative)) continue;
  const actualHash = sha256(await readFile(path.join(root, relative)));
  if (actualHash !== expectedHash) errors.push(`compatibility asset changed: ${relative}`);
}

for (const required of REQUIRED_SUBRESOURCE_INTEGRITY) {
  if (!fileSet.has(required.file)) {
    errors.push(`SRI host file missing: ${required.file}`);
    continue;
  }
  const body = await readFile(path.join(root, required.file), 'utf8');
  const tag = (body.match(/<script\b[^>]*>/gi) || []).find((candidate) => candidate.includes(`src="${required.src}"`));
  if (!tag || !tag.includes(`integrity="${required.integrity}"`) || !/crossorigin=["']anonymous["']/i.test(tag)) {
    errors.push(`required subresource integrity missing or changed: ${required.file} -> ${required.src}`);
  }
}

function forbiddenFilename(relative) {
  const base = path.posix.basename(relative);
  if (/(?:codex|claude|chatgpt|imagegen)/i.test(relative)) return true;
  if (/^GENERATION_NOTES\.json$/i.test(base)) return true;
  if (/^(?:_test|temp-|test[-_.])/i.test(base)) return true;
  if (/^qa(?:[-_.]|$)/i.test(base)) return true;
  if (/\.(?:test|spec)\.(?:html|js|json)$/i.test(base)) return true;
  if (/(?:^|[-_.])receipt(?:[-_.]|$)/i.test(base)) return true;
  if (/(?:^|[-_.])preview(?:[-_.]|$)/i.test(base) && path.extname(base).toLowerCase() === '.html') return true;
  if (/^(?:LAUNCH_CONTROL_ROOM\.html|LAUNCH_STATUS\.json)$/i.test(base)) return true;
  if (/^(?:release-manifest|local-delivery-manifest|arrival-kit-placement-manifest)\.json$/i.test(base)) return true;
  if (relative === 'tools-home/icons/manifest.json') return true;
  if (relative === 'gallery/source-mapping.json') return true;
  if (relative === 'berlin-walkable-areas-planner/assets/berlin-walkable-areas-hero-source.png') return true;
  if (relative === 'page-editorial/four-page-editorial-system-head.html') return true;
  if (relative === 'page-editorial/comparison.html') return true;
  return false;
}

for (const file of files) {
  const parts = file.relative.split('/');
  const base = path.posix.basename(file.relative);
  const extension = path.extname(file.relative).toLowerCase();
  if (FORBIDDEN_ROOTS.has(parts[0])) errors.push(`forbidden root entry: ${file.relative}`);
  if (parts.some((part) => FORBIDDEN_DIRECTORIES.has(part))) errors.push(`forbidden directory: ${file.relative}`);
  if (base.startsWith('.') && base !== '.nojekyll') errors.push(`unexpected dotfile: ${file.relative}`);
  if (file.relative !== '_headers' && file.relative !== '.nojekyll' && !ALLOWED_EXTENSIONS.has(extension)) {
    errors.push(`extension is not allowlisted: ${file.relative}`);
  }
  if (forbiddenFilename(file.relative)) errors.push(`internal or temporary filename: ${file.relative}`);
  if (file.size > MAX_PUBLIC_FILE_BYTES) errors.push(`file exceeds 20 MiB public limit: ${file.relative}`);
}

const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const forbiddenSecretPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{20,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bAIza[0-9A-Za-z_-]{30,}\b/,
  /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/,
  /\bsk_(?:live|test)_[A-Za-z0-9]{16,}\b/,
  /\bsk-proj-[A-Za-z0-9_-]{20,}\b/,
];
const forbiddenInternalMarkers = [
  /\/Users\//,
  /\/private\/tmp\//,
  /\/var\/folders\//,
  /file:\/\/\//,
  /\b(?:OPENAI|WIX|GEMINI|ELEVENLABS)_API_KEY\b/,
  /\b(?:SESSION_LOG|PROJECT_MEMORY|AGENTS|CLAUDE)\.md\b/,
];
const oldCommitPin = /https:\/\/cdn\.jsdelivr\.net\/gh\/fenerszymanski\/berlinwalk-widgets@([0-9a-f]{7,40})\//gi;

for (const file of files) {
  const extension = path.extname(file.relative).toLowerCase();
  if (!TEXT_EXTENSIONS.has(extension) || file.size > 12_000_000) continue;
  const body = await readFile(file.absolute, 'utf8');
  for (const pattern of forbiddenInternalMarkers) {
    if (pattern.test(body)) errors.push(`internal marker found: ${file.relative}`);
  }
  for (const pattern of forbiddenSecretPatterns) {
    if (pattern.test(body)) errors.push(`credential-like value found: ${file.relative}`);
  }
  for (const match of body.matchAll(emailPattern)) {
    const email = match[0].toLowerCase();
    if (!ALLOWED_EMAILS.has(email)) errors.push(`unexpected email address: ${file.relative}`);
  }
  if (oldCommitPin.test(body)) errors.push(`old public Git commit dependency found: ${file.relative}`);
  oldCommitPin.lastIndex = 0;
  if (extension === '.json') {
    try {
      JSON.parse(body);
    } catch {
      errors.push(`invalid JSON: ${file.relative}`);
    }
    if (/"(?:contact|lead|booking)Id"\s*:\s*"[^"\s]+"/i.test(body)) {
      errors.push(`non-empty customer identifier found: ${file.relative}`);
    }
  }
}

function localPathFromUrl(value, sourceRelative) {
  let candidate = value.trim().replace(/^['"]|['"]$/g, '');
  if (!candidate || candidate.startsWith('#') || /^(?:data:|blob:|mailto:|tel:|javascript:|https?:|\/\/)/i.test(candidate)) return null;
  if (candidate.includes('${') || candidate.includes('{{') || candidate.includes('`')) return null;
  candidate = candidate.split('#')[0].split('?')[0];
  if (!candidate) return null;
  try { candidate = decodeURIComponent(candidate); } catch {}
  if (candidate.startsWith('/berlinwalk-widgets/')) candidate = candidate.slice('/berlinwalk-widgets/'.length);
  else if (candidate.startsWith('/')) return null;
  const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(sourceRelative), candidate));
  return resolved.endsWith('/') ? `${resolved}index.html` : resolved;
}

const referencePatterns = [
  /<(?:script|img|audio|source|iframe)\b[^>]*?\b(?:src|poster)=["']([^"']+)["']/gi,
  /<link\b[^>]*?\bhref=["']([^"']+)["']/gi,
  /\bsrcset=["']([^"']+)["']/gi,
  /url\(\s*["']?([^"')]+)["']?\s*\)/gi,
];

const moduleReferencePatterns = [
  /\bfrom\s+["']([^"']+)["']/gi,
  /\bimport\s*["']([^"']+)["']/gi,
  /\bimport\s*\(\s*["']([^"']+)["']\s*\)/gi,
];

for (const file of files) {
  if (!['.css', '.html'].includes(path.extname(file.relative).toLowerCase()) || file.size > 12_000_000) continue;
  const body = await readFile(file.absolute, 'utf8');
  for (const pattern of referencePatterns) {
    for (const match of body.matchAll(pattern)) {
      const values = pattern.source.startsWith('\\bsrcset')
        ? match[1].split(',').map((item) => item.trim().split(/\s+/)[0])
        : [match[1]];
      for (const value of values) {
        const target = localPathFromUrl(value, file.relative);
        if (!target) continue;
        if (!fileSet.has(target)) warnings.push(`unresolved static reference: ${file.relative} -> ${target}`);
      }
    }
  }
}

for (const file of files) {
  if (!['.js', '.mjs'].includes(path.extname(file.relative).toLowerCase()) || file.size > 12_000_000) continue;
  const body = await readFile(file.absolute, 'utf8');
  for (const pattern of moduleReferencePatterns) {
    for (const match of body.matchAll(pattern)) {
      if (!/^(?:\.{1,2}\/|\/)/.test(match[1])) continue;
      const localPath = localPathFromUrl(match[1], file.relative);
      if (localPath && !fileSet.has(localPath)) {
        errors.push(`missing local module reference: ${file.relative} -> ${localPath}`);
      }
    }
  }
}

const toolsData = JSON.parse(await readFile(path.join(root, 'tools-hub/data.json'), 'utf8'));
const tools = toolsData.tools || [];
let visibleTools = 0;
for (const tool of tools) {
  if (tool.hidden || tool.draft) continue;
  visibleTools += 1;
  const prefix = 'https://fenerszymanski.github.io/berlinwalk-widgets/';
  if (typeof tool.widgetUrl !== 'string' || !tool.widgetUrl.startsWith(prefix)) continue;
  const relative = tool.widgetUrl.slice(prefix.length).split(/[?#]/)[0].replace(/^\/+|\/+$/g, '');
  const entry = relative ? `${relative}/index.html` : 'index.html';
  if (!fileSet.has(entry)) errors.push(`visible tool entry missing: ${tool.slug} -> ${entry}`);
}

const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
const uniqueErrors = [...new Set(errors)].sort();
const uniqueWarnings = [...new Set(warnings)].sort();
console.log(JSON.stringify({
  root,
  files: files.length,
  bytes: totalBytes,
  visibleTools,
  errors: uniqueErrors,
  warnings: uniqueWarnings.slice(0, 250),
  warningCount: uniqueWarnings.length,
}, null, 2));
process.exitCode = uniqueErrors.length ? 1 : 0;
