#!/usr/bin/env node

import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const API_ROOT = 'https://www.wixapis.com';
const SITE_ID = '12ee5ea0-70a7-492f-8020-ffb27cbb630f';
const EMBED_NAME = 'BerlinWalk PageSpeed Phase 3 Homepage Hero Preload';
const SCRIPT_ID = 'bw-pagespeed-phase3-homepage-hero-preload';
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_FILE = path.resolve(SCRIPT_DIR, '..', 'performance', 'phase3', 'batch-a-homepage-hero-preload.html');
const MAX_EMBED_HTML_LENGTH = 15000;

const STATE_GATES = [
  { id: '56b07e8d-d779-41f7-afd6-e9e9e718624e', name: 'BerlinWalk Core Web Vitals Reserve Head', enabled: false, revision: '4' },
  { id: '4ad456c9-fdcb-40ad-9759-2b0a3e644e5c', name: 'BerlinWalk Core Web Vitals Reserve Head Live', enabled: false, revision: '3' },
  { id: '1590470b-3da7-436f-a8ae-014cd652c503', name: 'BerlinWalk Homepage Hero LCP Head', enabled: false, revision: '3' },
  { id: '7a268f04-116e-4da7-aab1-470e14fb8066', name: 'BerlinWalk tour CTA', enabled: false, revision: '2' },
  { id: '07a590f5-cb47-4571-ae83-abfda523c6f7', name: 'BerlinWalk Homepage Hydration Height Reserve', enabled: true, revision: '6' },
  { id: 'f84c52d1-baaa-46dd-b6b5-a10d6d690bf0', name: 'BerlinWalk PageSpeed Phase 2 Low Risk Mobile Reserve', enabled: true, revision: '1' },
  { id: 'f05c4356-6333-4a47-a0f0-f7b0370fe291', name: 'BerlinWalk PageSpeed Phase 2 Commercial Template Reserve', enabled: true, revision: '1' },
  { id: 'cb7c9a3c-48cc-4ba4-b941-2e283947c35e', name: 'BerlinWalk Booking Funnel UI Safe', enabled: true, revision: '17' },
  { id: 'cf3e6235-ecb2-4fef-942a-c747bafd91b9', name: 'BerlinWalk Booking Next Action Patch', enabled: true, revision: '13' },
  { id: '55e83be1-c79c-49e7-a8d4-13462b206c5c', name: 'BerlinWalk Consent Privacy Guard', enabled: true, revision: '2' },
  { id: '9f0b3b6a-9721-4122-80e1-38a8e6789692', name: 'BerlinWalk Consent-Gated Analytics Events', enabled: true, revision: '7' },
  { id: 'c26f5eb6-3768-4253-a18a-9de4a273951c', name: 'BerlinWalk Booking Funnel Advertising Events', enabled: true, revision: '7' },
  { id: 'cdd1bfca-4173-42e0-9c18-a066f7c03559', name: 'exit-intent-popup.js', enabled: true, revision: '15' },
];

function parseArgs(argv) {
  const modes = ['--apply', '--disable', '--readback'].filter((flag) => argv.includes(flag));
  if (modes.length > 1) throw new Error('Use only one of --apply, --disable, or --readback.');
  const snapshotIndex = argv.indexOf('--snapshot-out');
  if (snapshotIndex !== -1 && !argv[snapshotIndex + 1]) throw new Error('Missing path after --snapshot-out.');
  return {
    mode: argv.includes('--apply') ? 'apply' : argv.includes('--disable') ? 'disable' : argv.includes('--readback') ? 'readback' : 'dry-run',
    noPublish: argv.includes('--no-publish'),
    snapshotOut: snapshotIndex === -1 ? null : path.resolve(argv[snapshotIndex + 1]),
  };
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function headers() {
  if (!process.env.WIX_API_KEY) throw new Error('Missing WIX_API_KEY. Load it with scripts/load-api-keys.sh from the workspace root.');
  return {
    Authorization: process.env.WIX_API_KEY,
    'wix-site-id': SITE_ID,
    'Content-Type': 'application/json',
  };
}

async function wixFetch(pathname, { method = 'GET', body } = {}) {
  const response = await fetch(`${API_ROOT}${pathname}`, {
    method,
    headers: headers(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!response.ok) throw new Error(`Wix ${method} ${pathname} failed (${response.status}): ${text.slice(0, 500)}`);
  return data;
}

function buildEmbedHtml(source) {
  const script = source.match(/<script\b[^>]*>([\s\S]*?)<\/script>/i)?.[1]?.trim();
  if (!script) throw new Error('Source is missing its script element.');
  new Function(script);
  return `<script id="${SCRIPT_ID}">${script}</script>`;
}

function validateHtml(html) {
  const required = [
    SCRIPT_ID,
    "path !== '/'",
    "path !== '/home'",
    'image/webp',
    'hero-home-museum-island-800w.webp',
    'hero-home-museum-island-1600w.webp',
    '(max-width: 768px)',
    '(min-width: 769px)',
    'data-bw-pagespeed-phase3',
    "link.rel = 'preload'",
    "link.as = 'image'",
    "link.fetchPriority = 'high'",
  ];
  const forbidden = [
    '<style',
    'MutationObserver',
    'customElements',
    'innerHTML',
    'document.body',
    'document.documentElement',
    'classList',
    'setTimeout',
    'setInterval',
    'requestAnimationFrame',
    'googletagmanager',
    'facebook.com',
    'booking',
    'consent',
  ];
  const missing = required.filter((marker) => !html.includes(marker));
  const foundForbidden = forbidden.filter((marker) => html.includes(marker));
  if (missing.length) throw new Error(`Missing required markers: ${missing.join(', ')}`);
  if (foundForbidden.length) throw new Error(`Forbidden markers found: ${foundForbidden.join(', ')}`);
  if ((html.match(/<script\b/gi) || []).length !== 1) throw new Error('Expected exactly one hint-only script.');
  if (html.length > MAX_EMBED_HTML_LENGTH) throw new Error(`Embed is ${html.length} chars; Wix limit is ${MAX_EMBED_HTML_LENGTH}.`);
}

function fingerprint(embed) {
  if (!embed) return null;
  const html = embed.embedData?.html || '';
  return {
    id: embed.id,
    name: embed.name,
    revision: String(embed.revision),
    enabled: Boolean(embed.enabled),
    position: embed.position,
    category: embed.embedData?.category || null,
    htmlLength: html.length,
    htmlSha256: sha256(html),
  };
}

async function listEmbeds() {
  const data = await wixFetch('/embeds/v1/custom-embeds?paging.limit=100');
  return data.customEmbeds || [];
}

function validateStateGates(embeds) {
  const problems = [];
  for (const gate of STATE_GATES) {
    const current = embeds.find((embed) => embed.id === gate.id);
    if (!current) problems.push(`${gate.name}: missing ${gate.id}`);
    else {
      if (current.name !== gate.name) problems.push(`${gate.id}: name ${current.name} != ${gate.name}`);
      if (Boolean(current.enabled) !== gate.enabled) problems.push(`${gate.name}: enabled ${current.enabled} != ${gate.enabled}`);
      if (String(current.revision) !== gate.revision) problems.push(`${gate.name}: revision ${current.revision} != ${gate.revision}`);
    }
  }
  if (problems.length) throw new Error(`Live Wix state gate failed:\n- ${problems.join('\n- ')}`);
}

function protectedState(embeds) {
  return STATE_GATES.map((gate) => fingerprint(embeds.find((embed) => embed.id === gate.id)));
}

async function writeSnapshot(filePath, payload) {
  if (!filePath) return;
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

async function publishSite() {
  return wixFetch('/site-publisher/v1/site/publish', { method: 'POST', body: {} });
}

async function patchEmbed(current, html, enabled) {
  const payload = {
    customEmbed: {
      ...(current ? { id: current.id, revision: current.revision } : {}),
      name: EMBED_NAME,
      enabled,
      loadOnce: false,
      domain: current?.domain || 'berlinwalk.com',
      position: 'HEAD',
      embedData: {
        ...(current?.embedData || {}),
        category: 'ESSENTIAL',
        html,
      },
    },
  };
  const data = current
    ? await wixFetch(`/embeds/v1/custom-embeds/${current.id}`, { method: 'PATCH', body: payload })
    : await wixFetch('/embeds/v1/custom-embeds', { method: 'POST', body: payload });
  return data.customEmbed || data;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const source = await fs.readFile(SOURCE_FILE, 'utf8');
  const html = buildEmbedHtml(source);
  validateHtml(html);
  const beforeEmbeds = await listEmbeds();
  validateStateGates(beforeEmbeds);
  const current = beforeEmbeds.find((embed) => embed.name === EMBED_NAME) || null;
  const before = {
    capturedAt: new Date().toISOString(),
    mode: args.mode,
    source: path.relative(path.resolve(SCRIPT_DIR, '..'), SOURCE_FILE),
    sourceLength: source.length,
    embedLength: html.length,
    embedSha256: sha256(html),
    current: fingerprint(current),
    protected: protectedState(beforeEmbeds),
  };
  await writeSnapshot(args.snapshotOut, before);

  if (args.mode === 'dry-run' || args.mode === 'readback') {
    console.log(JSON.stringify({
      ok: true,
      ...before,
      matchesSource: current ? current.embedData?.html === html : false,
      headroom: MAX_EMBED_HTML_LENGTH - html.length,
    }, null, 2));
    return;
  }

  if (args.mode === 'disable' && !current) throw new Error(`${EMBED_NAME} does not exist; there is nothing to disable.`);
  const enabled = args.mode === 'apply';
  const updated = await patchEmbed(current, html, enabled);
  let publishResponse = null;
  if (!args.noPublish) publishResponse = await publishSite();

  const afterEmbeds = await listEmbeds();
  const afterProtected = protectedState(afterEmbeds);
  if (JSON.stringify(before.protected) !== JSON.stringify(afterProtected)) {
    throw new Error('Protected booking/consent/analytics/safe-mode state changed during the batch. Stop and inspect before any further publish.');
  }
  const readback = afterEmbeds.find((embed) => embed.id === updated.id);
  if (!readback) throw new Error('Updated embed is missing from API readback.');
  if (Boolean(readback.enabled) !== enabled) throw new Error(`Readback enabled=${readback.enabled}; expected ${enabled}.`);
  if (readback.position !== 'HEAD') throw new Error(`Readback position=${readback.position}; expected HEAD.`);
  if (readback.embedData?.html !== html) throw new Error('Readback HTML does not match the committed source.');

  console.log(JSON.stringify({
    ok: true,
    mode: args.mode,
    id: readback.id,
    revision: readback.revision,
    enabled: readback.enabled,
    position: readback.position,
    htmlLength: html.length,
    htmlSha256: sha256(html),
    published: !args.noPublish,
    publishResponse,
    protectedStateUnchanged: true,
    rollback: 'node scripts/pagespeed-phase3-home-hero-preload.mjs --disable',
  }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
