#!/usr/bin/env node

/**
 * Stages or publishes the CSS-only BerlinWalk four-page editorial embed.
 *
 * Safe release flow:
 *   source scripts/load-api-keys.sh
 *   node scripts/upsert-four-page-editorial-system-embed.mjs --commit=<sha> --backup=<manifest> --dry-run
 *   node scripts/upsert-four-page-editorial-system-embed.mjs --commit=<sha> --backup=<manifest> --enable --no-publish
 *   node scripts/upsert-four-page-editorial-system-embed.mjs --commit=<sha> --backup=<manifest> --publish-only
 */

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE_ID = '12ee5ea0-70a7-492f-8020-ffb27cbb630f';
const WIX_API_ROOT = 'https://www.wixapis.com';
const EMBED_NAME = 'BerlinWalk Four Page Editorial System';
const SOURCE_FILE = path.join(ROOT, 'page-editorial/four-page-editorial-system-head.html');
const DEFAULT_BACKUP = path.join(ROOT, 'output/qa/four-page-editorial-20260717/baseline/manifest.json');
const DEFAULT_RECEIPT = path.join(ROOT, 'output/qa/four-page-editorial-20260717/release/stage-receipt.json');
const COMMIT_TOKEN = '__EDITORIAL_COMMIT__';
const CSS_PATH = 'page-editorial/page-editorial.css';
const CSS_MARKER = 'BerlinWalk four-page editorial system';
const MAX_EMBED_HTML_LENGTH = 15000;
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
  const receiptArg = argv.find((value) => value.startsWith('--receipt='));
  const known = new Set(['--dry-run', '--no-publish', '--enable', '--disable', '--publish-only', '--help']);
  const unknown = argv.filter((value) =>
    !known.has(value) && !value.startsWith('--commit=') && !value.startsWith('--backup=') && !value.startsWith('--receipt='));
  if (unknown.length) throw new Error(`Unknown argument(s): ${unknown.join(', ')}`);
  return {
    commit: commitArg ? commitArg.slice('--commit='.length).trim().toLowerCase() : '',
    backup: backupArg ? path.resolve(backupArg.slice('--backup='.length)) : DEFAULT_BACKUP,
    receipt: receiptArg ? path.resolve(receiptArg.slice('--receipt='.length)) : DEFAULT_RECEIPT,
    dryRun: argv.includes('--dry-run'),
    noPublish: argv.includes('--no-publish'),
    enable: argv.includes('--enable'),
    disable: argv.includes('--disable'),
    publishOnly: argv.includes('--publish-only'),
    help: argv.includes('--help'),
  };
}

function validateArgs(args) {
  if (!/^[0-9a-f]{40}$/.test(args.commit)) {
    throw new Error('Provide a fixed 40-character commit with --commit=<sha>.');
  }
  if (args.enable && args.disable) throw new Error('Use only one of --enable or --disable.');
  if (args.publishOnly && (args.enable || args.disable || args.dryRun || args.noPublish)) {
    throw new Error('--publish-only can only be combined with --commit and --backup.');
  }
  if (!args.publishOnly && !args.dryRun && !args.noPublish) {
    throw new Error('Mutating stage commands require --no-publish. Use --publish-only after readback.');
  }
  if (!args.publishOnly && !args.dryRun && !args.enable && !args.disable) {
    throw new Error('Choose --enable or --disable when staging.');
  }
}

function requireWixKey() {
  if (!process.env.WIX_API_KEY) {
    throw new Error('WIX_API_KEY is missing. Load it from Keychain before running this script.');
  }
  return process.env.WIX_API_KEY;
}

async function wixFetch(pathname, { method = 'GET', body } = {}) {
  const response = await fetch(`${WIX_API_ROOT}${pathname}`, {
    method,
    headers: {
      Authorization: requireWixKey(),
      'wix-site-id': SITE_ID,
      'Content-Type': 'application/json',
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Wix ${method} ${pathname} failed (${response.status}): ${text.slice(0, 500)}`);
  }
  return text ? JSON.parse(text) : null;
}

function sha256(value) {
  const input = typeof value === 'string' ? value : Buffer.from(value || []);
  return crypto.createHash('sha256').update(input).digest('hex');
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

function sameFingerprint(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

async function readBaseline(backupPath) {
  const parsed = JSON.parse(await fs.readFile(backupPath, 'utf8'));
  if (!Array.isArray(parsed.embeds)) throw new Error(`Backup has no embeds array: ${backupPath}`);
  const protectedBaseline = {};
  for (const name of PROTECTED_NAMES) {
    const embed = parsed.embeds.find((candidate) => candidate.name === name) || null;
    if (!embed) throw new Error(`Backup is missing protected embed: ${name}. Re-run the baseline backup.`);
    const actualHash = sha256(embed.embedData?.html || '');
    if (embed.sha256 && embed.sha256 !== actualHash) {
      throw new Error(`Backup hash mismatch for ${name}: recorded ${embed.sha256}, computed ${actualHash}.`);
    }
    protectedBaseline[name] = fingerprint(embed);
  }
  return { parsed, protectedBaseline };
}

async function listCustomEmbeds() {
  const data = await wixFetch('/embeds/v1/custom-embeds?paging.limit=100');
  if (data?.pagingMetadata?.hasNext) {
    throw new Error('Wix custom-embed list is paginated; refusing an incomplete readback.');
  }
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
    const actual = fingerprint(current);
    if (!actual) throw new Error(`${phase}: protected embed is missing: ${name}.`);
    if (!sameFingerprint(actual, baseline[name])) {
      throw new Error(`${phase}: protected embed changed: ${name}.\nExpected ${JSON.stringify(baseline[name])}\nActual ${JSON.stringify(actual)}`);
    }
  }
}

async function buildEmbedHtml(commit) {
  const source = await fs.readFile(SOURCE_FILE, 'utf8');
  if (!source.includes(COMMIT_TOKEN)) throw new Error(`Missing ${COMMIT_TOKEN} in ${SOURCE_FILE}.`);
  const html = source.replace(/<!--[\s\S]*?-->/g, '').trim().replaceAll(COMMIT_TOKEN, commit);
  if (html.length > MAX_EMBED_HTML_LENGTH) {
    throw new Error(`Embed HTML is ${html.length} chars; Wix limit is ${MAX_EMBED_HTML_LENGTH}.`);
  }
  return html;
}

function expectedStylesheetUrl(commit) {
  return `https://cdn.jsdelivr.net/gh/fenerszymanski/berlinwalk-widgets@${commit}/${CSS_PATH}`;
}

function stylesheetHref(html) {
  return String(html || '').match(/<link\b[^>]*\bhref=(['"])([^'"]+)\1[^>]*>/i)?.[2] || '';
}

function markers(html, commit) {
  const href = stylesheetHref(html);
  return {
    commitPinned: href === expectedStylesheetUrl(commit),
    cssPath: html.includes(`/${CSS_PATH}`),
    singleLink: (html.match(/<link\b/gi) || []).length === 1,
    noScript: !/<script\b/i.test(html),
    noInlineStyle: !/<style\b/i.test(html),
    noCommitToken: !html.includes(COMMIT_TOKEN),
  };
}

function assertMarkers(html, commit, phase) {
  const result = markers(html, commit);
  if (!Object.values(result).every(Boolean)) {
    throw new Error(`${phase}: Editorial embed markers failed: ${JSON.stringify(result)}`);
  }
  return result;
}

function assertEditorial(embed, expectedHtml, commit, enabled, phase) {
  if (!embed) throw new Error(`${phase}: ${EMBED_NAME} is missing.`);
  assertMarkers(embed.embedData?.html || '', commit, phase);
  const state = {
    name: embed.name === EMBED_NAME,
    enabled: embed.enabled === enabled,
    loadOnce: embed.loadOnce === false,
    domain: embed.domain === 'berlinwalk.com',
    position: embed.position === 'HEAD',
    category: embed.embedData?.category === 'ESSENTIAL',
    exactHtml: (embed.embedData?.html || '') === expectedHtml,
  };
  if (!Object.values(state).every(Boolean)) {
    throw new Error(`${phase}: Editorial state failed: ${JSON.stringify({ state, fingerprint: fingerprint(embed) })}`);
  }
  return state;
}

async function readReceipt(receiptPath) {
  const receipt = JSON.parse(await fs.readFile(receiptPath, 'utf8'));
  if (!receipt || receipt.name !== EMBED_NAME || !receipt.editorial || !receipt.commit) {
    throw new Error(`Invalid stage receipt: ${receiptPath}`);
  }
  return receipt;
}

async function writeReceipt(receiptPath, value) {
  await fs.mkdir(path.dirname(receiptPath), { recursive: true });
  await fs.writeFile(receiptPath, `${JSON.stringify(value, null, 2)}\n`);
}

function extractFontSource(css) {
  const fontFace = String(css || '').match(/@font-face\s*\{[\s\S]*?\}/i)?.[0] || '';
  const pathMatch = fontFace.match(/url\(\s*(['"]?)([^)'"\s]+)\1\s*\)/i);
  if (!pathMatch) throw new Error('Editorial CSS does not expose a resolvable @font-face URL.');
  return pathMatch[2];
}

async function verifyAssets(commit) {
  const cssUrl = expectedStylesheetUrl(commit);
  const cssResponse = await fetch(cssUrl, { redirect: 'follow', cache: 'no-store' });
  const cssContentType = cssResponse.headers.get('content-type') || '';
  if (cssResponse.status !== 200) throw new Error(`Editorial CSS failed: ${cssResponse.status} ${cssUrl}`);
  if (!cssContentType.toLowerCase().includes('text/css')) {
    throw new Error(`Editorial CSS returned unexpected content type: ${cssContentType || 'missing'}.`);
  }
  const css = await cssResponse.text();
  if (!css.includes(CSS_MARKER)) throw new Error(`Editorial CSS marker missing: ${CSS_MARKER}.`);
  const localCss = await fs.readFile(path.join(ROOT, CSS_PATH), 'utf8');
  const remoteCssSha256 = sha256(css);
  const localCssSha256 = sha256(localCss);
  if (remoteCssSha256 !== localCssSha256) {
    throw new Error(`Remote CSS SHA256 ${remoteCssSha256} does not match local CSS ${localCssSha256}.`);
  }
  const fontSource = extractFontSource(css);
  if (/^(?:data:|https?:|\/)/i.test(fontSource)) {
    throw new Error(`Editorial font must stay a repository-relative asset: ${fontSource}`);
  }
  const fontUrl = new URL(fontSource, cssUrl).href;
  const fontResponse = await fetch(fontUrl, { redirect: 'follow', cache: 'no-store' });
  if (fontResponse.status !== 200) throw new Error(`Editorial font failed: ${fontResponse.status} ${fontUrl}`);
  const remoteFont = new Uint8Array(await fontResponse.arrayBuffer());
  const localFontPath = path.resolve(path.dirname(path.join(ROOT, CSS_PATH)), fontSource);
  if (!localFontPath.startsWith(`${ROOT}${path.sep}`)) throw new Error(`Editorial font escapes the repository: ${localFontPath}`);
  const localFont = await fs.readFile(localFontPath);
  const remoteFontSha256 = sha256(remoteFont);
  const localFontSha256 = sha256(localFont);
  if (remoteFontSha256 !== localFontSha256) {
    throw new Error(`Remote font SHA256 ${remoteFontSha256} does not match local font ${localFontSha256}.`);
  }
  return {
    cssUrl,
    cssStatus: cssResponse.status,
    cssContentType,
    cssSha256: remoteCssSha256,
    localCssSha256,
    fontUrl,
    fontStatus: fontResponse.status,
    fontSha256: remoteFontSha256,
    localFontSha256,
  };
}

async function upsert(current, html, enabled) {
  if (current) {
    const result = await wixFetch(`/embeds/v1/custom-embeds/${current.id}`, {
      method: 'PATCH',
      body: {
        customEmbed: {
          id: current.id,
          revision: current.revision,
          name: current.name,
          enabled,
          loadOnce: false,
          domain: current.domain || 'berlinwalk.com',
          position: 'HEAD',
          embedData: { ...current.embedData, category: 'ESSENTIAL', html },
        },
      },
    });
    return { mode: 'update', embed: result.customEmbed || result };
  }
  const result = await wixFetch('/embeds/v1/custom-embeds', {
    method: 'POST',
    body: {
      customEmbed: {
        name: EMBED_NAME,
        enabled,
        loadOnce: false,
        domain: 'berlinwalk.com',
        position: 'HEAD',
        embedData: { category: 'ESSENTIAL', html },
      },
    },
  });
  return { mode: 'create', embed: result.customEmbed || result };
}

async function publishSite() {
  return wixFetch('/site-publisher/v1/site/publish', { method: 'POST', body: {} });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(`Usage:
  --commit=<sha>   Required immutable 40-character widget commit
  --backup=<path>  Baseline manifest from backup-four-page-editorial-live.mjs
  --receipt=<path> Stage receipt written before publish-only verification
  --dry-run        Verify baseline, Wix draft state and CDN assets; do not write
  --enable         Stage enabled=true (requires --no-publish)
  --disable        Stage enabled=false (requires --no-publish)
  --no-publish     Save one Wix draft revision without publishing
  --publish-only   Fail-closed readback of Editorial, protected embeds and assets, then publish once`);
    return;
  }
  validateArgs(args);
  requireWixKey();
  const baseline = await readBaseline(args.backup);
  const expectedHtml = await buildEmbedHtml(args.commit);
  const expectedMarkers = assertMarkers(expectedHtml, args.commit, 'template');
  const before = await listCustomEmbeds();
  assertProtected(before, baseline.protectedBaseline, 'preflight');
  const current = before.find((embed) => embed.name === EMBED_NAME) || null;
  if (current && (current.embedData?.html || '') !== expectedHtml) {
    throw new Error(`Refusing to overwrite an unknown same-name Editorial embed: ${JSON.stringify(fingerprint(current))}`);
  }

  if (args.publishOnly) {
    const receipt = await readReceipt(args.receipt);
    if (receipt.commit !== args.commit) throw new Error(`Receipt commit ${receipt.commit} does not match ${args.commit}.`);
    if (!sameFingerprint(receipt.protected, baseline.protectedBaseline)) {
      throw new Error('Receipt protected fingerprints do not match the selected baseline.');
    }
    if (!sameFingerprint(fingerprint(current), receipt.editorial)) {
      throw new Error(`Staged Editorial drifted from receipt.\nReceipt ${JSON.stringify(receipt.editorial)}\nCurrent ${JSON.stringify(fingerprint(current))}`);
    }
    assertEditorial(current, expectedHtml, args.commit, true, 'publish readback');
    const readbackMarkers = assertMarkers(current.embedData?.html || '', args.commit, 'publish readback');
    const assets = await verifyAssets(args.commit);
    if (assets.cssSha256 !== receipt.assets?.cssSha256 || assets.fontSha256 !== receipt.assets?.fontSha256) {
      throw new Error('CDN assets drifted from the stage receipt.');
    }
    const publishResponse = await publishSite();
    const after = await listCustomEmbeds();
    assertProtected(after, baseline.protectedBaseline, 'post-publish readback');
    const publishedEditorial = after.find((embed) => embed.name === EMBED_NAME) || null;
    assertEditorial(publishedEditorial, expectedHtml, args.commit, true, 'post-publish readback');
    if (!sameFingerprint(fingerprint(publishedEditorial), receipt.editorial)) {
      throw new Error('Post-publish Editorial fingerprint drifted from the stage receipt.');
    }
    await writeReceipt(args.receipt, { ...receipt, publishedAt: new Date().toISOString(), publishResponse });
    console.log(JSON.stringify({
      ok: true,
      published: true,
      commit: args.commit,
      editorial: fingerprint(publishedEditorial),
      markers: readbackMarkers,
      assets,
      protected: baseline.protectedBaseline,
      publishResponse,
      receipt: args.receipt,
    }, null, 2));
    return;
  }

  const assets = await verifyAssets(args.commit);
  const enabled = args.enable ? true : args.disable ? false : current?.enabled ?? false;
  if (args.dryRun) {
    console.log(JSON.stringify({
      ok: true,
      dryRun: true,
      mode: current ? 'update' : 'create',
      name: EMBED_NAME,
      id: current?.id || null,
      revision: current?.revision || null,
      enabled,
      position: 'HEAD',
      commit: args.commit,
      htmlLength: expectedHtml.length,
      markers: expectedMarkers,
      assets,
      protected: baseline.protectedBaseline,
      publish: false,
    }, null, 2));
    return;
  }

  const result = await upsert(current, expectedHtml, enabled);
  const staged = await listCustomEmbeds();
  assertProtected(staged, baseline.protectedBaseline, 'post-stage readback');
  const stagedEditorial = staged.find((embed) => embed.name === EMBED_NAME) || null;
  assertEditorial(stagedEditorial, expectedHtml, args.commit, enabled, 'stage readback');
  if (!result.embed?.id || result.embed.id !== stagedEditorial.id || String(result.embed.revision) !== String(stagedEditorial.revision)) {
    throw new Error(`Mutation response does not match readback: ${JSON.stringify({ response: fingerprint(result.embed), readback: fingerprint(stagedEditorial) })}`);
  }
  if (current && String(current.revision) === String(stagedEditorial.revision)) {
    throw new Error(`PATCH revision did not advance from ${current.revision}.`);
  }
  const stagedMarkers = assertMarkers(stagedEditorial.embedData?.html || '', args.commit, 'stage readback');
  const receipt = {
    version: 1,
    name: EMBED_NAME,
    stagedAt: new Date().toISOString(),
    commit: args.commit,
    backup: args.backup,
    baselineCapturedAt: baseline.parsed.capturedAt || null,
    editorial: fingerprint(stagedEditorial),
    htmlSha256: sha256(expectedHtml),
    assets,
    protected: baseline.protectedBaseline,
  };
  await writeReceipt(args.receipt, receipt);
  console.log(JSON.stringify({
    ok: true,
    staged: true,
    published: false,
    mode: result.mode,
    editorial: fingerprint(stagedEditorial),
    commit: args.commit,
    markers: stagedMarkers,
    assets,
    protected: baseline.protectedBaseline,
    receipt: args.receipt,
  }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
