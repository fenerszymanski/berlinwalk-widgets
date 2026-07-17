#!/usr/bin/env node

/** Disables only the four-page Editorial CSS embed, with protected-embed guards. */

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE_ID = '12ee5ea0-70a7-492f-8020-ffb27cbb630f';
const WIX_API_ROOT = 'https://www.wixapis.com';
const EMBED_NAME = 'BerlinWalk Four Page Editorial System';
const DEFAULT_BACKUP = path.join(ROOT, 'output/qa/four-page-editorial-20260717/baseline/manifest.json');
const DEFAULT_RELEASE_RECEIPT = path.join(ROOT, 'output/qa/four-page-editorial-20260717/release/stage-receipt.json');
const DEFAULT_ROLLBACK_RECEIPT = path.join(ROOT, 'output/qa/four-page-editorial-20260717/release/rollback-stage-receipt.json');
const CSS_PATH = 'page-editorial/page-editorial.css';
const PROTECTED_NAMES = [
  'BerlinWalk Route Story SEO',
  'BerlinWalk Route Story Layout Fix',
  'BerlinWalk Core Web Vitals Reserve Head',
  'BerlinWalk Core Web Vitals Reserve Head Live',
  'BerlinWalk Site Footer Restore',
  'sticky for desktop',
];

function parseArgs(argv) {
  const commitArg = argv.find((value) => value.startsWith('--commit='));
  const backupArg = argv.find((value) => value.startsWith('--backup='));
  const releaseReceiptArg = argv.find((value) => value.startsWith('--release-receipt='));
  const rollbackReceiptArg = argv.find((value) => value.startsWith('--rollback-receipt='));
  const known = new Set(['--dry-run', '--no-publish', '--publish-only', '--help']);
  const unknown = argv.filter((value) =>
    !known.has(value) && !value.startsWith('--commit=') && !value.startsWith('--backup=') &&
    !value.startsWith('--release-receipt=') && !value.startsWith('--rollback-receipt='));
  if (unknown.length) throw new Error(`Unknown argument(s): ${unknown.join(', ')}`);
  return {
    commit: commitArg ? commitArg.slice('--commit='.length).trim().toLowerCase() : '',
    backup: backupArg ? path.resolve(backupArg.slice('--backup='.length)) : DEFAULT_BACKUP,
    releaseReceipt: releaseReceiptArg ? path.resolve(releaseReceiptArg.slice('--release-receipt='.length)) : DEFAULT_RELEASE_RECEIPT,
    rollbackReceipt: rollbackReceiptArg ? path.resolve(rollbackReceiptArg.slice('--rollback-receipt='.length)) : DEFAULT_ROLLBACK_RECEIPT,
    dryRun: argv.includes('--dry-run'),
    noPublish: argv.includes('--no-publish'),
    publishOnly: argv.includes('--publish-only'),
    help: argv.includes('--help'),
  };
}

function validateArgs(args) {
  if (!/^[0-9a-f]{40}$/.test(args.commit)) throw new Error('Provide the live fixed commit with --commit=<sha>.');
  if (args.publishOnly && (args.dryRun || args.noPublish)) {
    throw new Error('--publish-only cannot be combined with --dry-run or --no-publish.');
  }
  if (!args.publishOnly && !args.dryRun && !args.noPublish) {
    throw new Error('Rollback staging requires --no-publish. Publish only after staged readback.');
  }
}

function requireWixKey() {
  if (!process.env.WIX_API_KEY) throw new Error('WIX_API_KEY is missing. Load it from Keychain first.');
}

async function wixFetch(pathname, { method = 'GET', body } = {}) {
  const response = await fetch(`${WIX_API_ROOT}${pathname}`, {
    method,
    headers: {
      Authorization: process.env.WIX_API_KEY,
      'wix-site-id': SITE_ID,
      'Content-Type': 'application/json',
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Wix ${method} ${pathname} failed (${response.status}): ${text.slice(0, 500)}`);
  return text ? JSON.parse(text) : null;
}

function sha256(value) {
  return crypto.createHash('sha256').update(String(value || '')).digest('hex');
}

function fingerprint(embed) {
  if (!embed) return null;
  const html = embed.embedData?.html || '';
  return {
    name: embed.name,
    id: embed.id,
    revision: String(embed.revision),
    enabled: Boolean(embed.enabled),
    loadOnce: Boolean(embed.loadOnce),
    domain: embed.domain || '',
    position: embed.position,
    category: embed.embedData?.category || '',
    htmlLength: html.length,
    sha256: sha256(html),
  };
}

function same(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

async function readBaseline(backupPath) {
  const parsed = JSON.parse(await fs.readFile(backupPath, 'utf8'));
  if (!Array.isArray(parsed.embeds)) throw new Error(`Backup has no embeds array: ${backupPath}`);
  const protectedBaseline = {};
  for (const name of PROTECTED_NAMES) {
    const embed = parsed.embeds.find((candidate) => candidate.name === name) || null;
    if (!embed) throw new Error(`Backup is missing protected embed: ${name}.`);
    if (embed.sha256 && embed.sha256 !== sha256(embed.embedData?.html || '')) {
      throw new Error(`Backup hash mismatch for ${name}.`);
    }
    protectedBaseline[name] = fingerprint(embed);
  }
  return protectedBaseline;
}

async function listCustomEmbeds() {
  const data = await wixFetch('/embeds/v1/custom-embeds?paging.limit=100');
  if (data?.pagingMetadata?.hasNext) throw new Error('Wix custom-embed list is paginated; refusing incomplete readback.');
  const embeds = data?.customEmbeds || [];
  for (const name of [...PROTECTED_NAMES, EMBED_NAME]) {
    const count = embeds.filter((embed) => embed.name === name).length;
    if (count > 1) throw new Error(`Duplicate Wix custom embeds named ${name}: ${count}.`);
  }
  return embeds;
}

function assertProtected(embeds, baseline, phase) {
  for (const name of PROTECTED_NAMES) {
    const current = embeds.find((embed) => embed.name === name) || null;
    if (!same(fingerprint(current), baseline[name])) throw new Error(`${phase}: protected embed changed: ${name}.`);
  }
}

function expectedUrl(commit) {
  return `https://cdn.jsdelivr.net/gh/fenerszymanski/berlinwalk-widgets@${commit}/${CSS_PATH}`;
}

function assertEditorial(embed, commit, { enabled }) {
  if (!embed) throw new Error(`Editorial embed is missing: ${EMBED_NAME}.`);
  const html = embed.embedData?.html || '';
  const href = html.match(/<link\b[^>]*\bhref=(['"])([^'"]+)\1[^>]*>/i)?.[2] || '';
  if (href !== expectedUrl(commit) || (html.match(/<link\b/gi) || []).length !== 1 || /<script\b|<style\b/i.test(html)) {
    throw new Error('Editorial embed does not match the expected immutable CSS-only source.');
  }
  if (embed.name !== EMBED_NAME || embed.enabled !== enabled || embed.position !== 'HEAD' || embed.loadOnce ||
      embed.domain !== 'berlinwalk.com' || embed.embedData?.category !== 'ESSENTIAL') {
    throw new Error(`Editorial state mismatch: ${JSON.stringify(fingerprint(embed))}`);
  }
}

async function readReceipt(receiptPath, expectedName) {
  const receipt = JSON.parse(await fs.readFile(receiptPath, 'utf8'));
  if (!receipt || receipt.name !== EMBED_NAME || !receipt.editorial || receipt.commit === undefined) {
    throw new Error(`Invalid ${expectedName} receipt: ${receiptPath}`);
  }
  return receipt;
}

async function writeReceipt(receiptPath, value) {
  await fs.mkdir(path.dirname(receiptPath), { recursive: true });
  await fs.writeFile(receiptPath, `${JSON.stringify(value, null, 2)}\n`);
}

async function publishSite() {
  return wixFetch('/site-publisher/v1/site/publish', { method: 'POST', body: {} });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(`Usage:
  --commit=<sha>   Required immutable commit currently stored in Editorial
  --backup=<path>  Baseline protected-embed manifest
  --release-receipt=<path> Exact successful release receipt
  --rollback-receipt=<path> Receipt written after rollback staging
  --dry-run        Verify rollback target and guards; do not write
  --no-publish     Stage enabled=false and verify; do not publish
  --publish-only   Require already-disabled staged state, then publish once`);
    return;
  }
  validateArgs(args);
  requireWixKey();
  const baseline = await readBaseline(args.backup);
  const before = await listCustomEmbeds();
  assertProtected(before, baseline, 'preflight');
  const current = before.find((embed) => embed.name === EMBED_NAME) || null;
  const releaseReceipt = await readReceipt(args.releaseReceipt, 'release');
  if (releaseReceipt.commit !== args.commit) throw new Error('Release receipt commit does not match --commit.');
  if (!same(releaseReceipt.protected, baseline)) throw new Error('Release receipt protected fingerprints do not match baseline.');

  if (args.publishOnly) {
    const rollbackReceipt = await readReceipt(args.rollbackReceipt, 'rollback');
    if (rollbackReceipt.commit !== args.commit || !same(rollbackReceipt.protected, baseline)) {
      throw new Error('Rollback receipt does not match commit or protected baseline.');
    }
    if (!same(fingerprint(current), rollbackReceipt.editorial)) {
      throw new Error('Staged rollback Editorial drifted from rollback receipt.');
    }
    assertEditorial(current, args.commit, { enabled: false });
    const publishResponse = await publishSite();
    const after = await listCustomEmbeds();
    assertProtected(after, baseline, 'post-publish readback');
    const publishedEditorial = after.find((embed) => embed.name === EMBED_NAME) || null;
    assertEditorial(publishedEditorial, args.commit, { enabled: false });
    if (!same(fingerprint(publishedEditorial), rollbackReceipt.editorial)) {
      throw new Error('Post-publish rollback Editorial drifted from rollback receipt.');
    }
    await writeReceipt(args.rollbackReceipt, { ...rollbackReceipt, publishedAt: new Date().toISOString(), publishResponse });
    console.log(JSON.stringify({ ok: true, published: true, editorial: fingerprint(current), protected: baseline, publishResponse, rollbackReceipt: args.rollbackReceipt }, null, 2));
    return;
  }

  if (!same(fingerprint(current), releaseReceipt.editorial)) {
    throw new Error(`Live Editorial does not match the exact release receipt.\nReceipt ${JSON.stringify(releaseReceipt.editorial)}\nCurrent ${JSON.stringify(fingerprint(current))}`);
  }
  assertEditorial(current, args.commit, { enabled: true });
  const plan = { editorial: fingerprint(current), action: 'set enabled=false only', protected: baseline, publish: false };
  if (args.dryRun) {
    console.log(JSON.stringify({ ok: true, dryRun: true, plan }, null, 2));
    return;
  }

  const result = await wixFetch(`/embeds/v1/custom-embeds/${current.id}`, {
    method: 'PATCH',
    body: {
      customEmbed: {
        id: current.id,
        revision: current.revision,
        name: current.name,
        enabled: false,
        loadOnce: current.loadOnce ?? false,
        domain: current.domain || 'berlinwalk.com',
        position: current.position,
        embedData: current.embedData,
      },
    },
  });
  const staged = await listCustomEmbeds();
  assertProtected(staged, baseline, 'post-stage readback');
  const stagedEditorial = staged.find((embed) => embed.name === EMBED_NAME) || null;
  assertEditorial(stagedEditorial, args.commit, { enabled: false });
  const responseEditorial = result.customEmbed || result;
  if (responseEditorial.id !== stagedEditorial.id || String(responseEditorial.revision) !== String(stagedEditorial.revision)) {
    throw new Error('Rollback PATCH response does not match staged readback.');
  }
  if (String(current.revision) === String(stagedEditorial.revision)) {
    throw new Error(`Rollback PATCH revision did not advance from ${current.revision}.`);
  }
  const rollbackReceipt = {
    version: 1,
    name: EMBED_NAME,
    stagedAt: new Date().toISOString(),
    commit: args.commit,
    releaseReceipt: args.releaseReceipt,
    before: fingerprint(current),
    editorial: fingerprint(stagedEditorial),
    protected: baseline,
  };
  await writeReceipt(args.rollbackReceipt, rollbackReceipt);
  console.log(JSON.stringify({ ok: true, staged: true, published: false, result: fingerprint(responseEditorial), readback: fingerprint(stagedEditorial), protected: baseline, rollbackReceipt: args.rollbackReceipt }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
