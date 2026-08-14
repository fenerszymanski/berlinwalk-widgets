#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const DEFAULT_API_BASE = 'https://www.wixapis.com';
const HASH_ALGORITHM = 'canonical-json-sha256-v1';
const PROTECTED_DRAFT_FIELDS = [
  'title',
  'memberId',
  'excerpt',
  'media',
  'categoryIds',
  'tagIds',
  'hashtags',
  'seoSlug',
  'seoData',
  'language',
  'commentingEnabled',
  'featured',
  'minutesToRead',
  'pricingPlanIds',
];

export class PublishBlockedError extends Error {
  constructor(message, receipt) {
    super(message);
    this.name = 'PublishBlockedError';
    this.receipt = receipt;
  }
}

function canonicalize(value) {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map((item) => canonicalize(item));
  const result = {};
  for (const key of Object.keys(value).sort()) {
    if (value[key] !== undefined) result[key] = canonicalize(value[key]);
  }
  return result;
}

export function canonicalSha256(value) {
  const json = JSON.stringify(canonicalize(value));
  return createHash('sha256').update(json).digest('hex');
}

function fileSha256(filePath) {
  return createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

export function draftProtectedView(draft) {
  const view = {};
  for (const field of PROTECTED_DRAFT_FIELDS) {
    view[field] = Object.prototype.hasOwnProperty.call(draft, field) ? draft[field] : null;
  }
  return view;
}

export function publishIdentityKey(identity) {
  return canonicalSha256({
    runId: identity.runId,
    draftId: identity.draftId,
    postSlug: identity.postSlug,
    toolSlug: identity.toolSlug,
    packageCommit: identity.packageCommit,
    siteId: identity.siteId,
    publishPath: identity.publishPath,
  });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJsonAtomic(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  const fd = fs.openSync(temporary, 'wx', 0o600);
  try {
    fs.writeFileSync(fd, `${JSON.stringify(value, null, 2)}\n`);
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }
  fs.renameSync(temporary, filePath);
}

function fsyncDirectory(directory) {
  let fd;
  try {
    fd = fs.openSync(directory, 'r');
    fs.fsyncSync(fd);
  } catch {
    // Some filesystems do not support directory fsync. The atomic link still holds.
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
}

function createJsonExclusive(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.${process.pid}.${Date.now()}.reserve`;
  const fd = fs.openSync(temporary, 'wx', 0o600);
  try {
    fs.writeFileSync(fd, `${JSON.stringify(value, null, 2)}\n`);
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }

  try {
    fs.linkSync(temporary, filePath);
    fsyncDirectory(path.dirname(filePath));
    return true;
  } catch (error) {
    if (error.code === 'EEXIST') return false;
    throw error;
  } finally {
    try { fs.unlinkSync(temporary); } catch { /* best-effort temp cleanup */ }
  }
}

function valueFrom(sources, keys) {
  for (const source of sources) {
    if (!source || typeof source !== 'object') continue;
    for (const key of keys) {
      if (source[key] !== undefined && source[key] !== null && source[key] !== '') return source[key];
    }
  }
  return null;
}

function normalizeHash(value, label) {
  assert(typeof value === 'string' && /^[a-f0-9]{64}$/i.test(value), `${label} must be a SHA-256 hash`);
  return value.toLowerCase();
}

function resolveConfiguration(manifest, prepublish, apiBase) {
  const manifestIdentity = manifest.identity || {};
  const prepublishIdentity = prepublish.identity || {};
  const expected = prepublish.expectedDraft || prepublish.draft || manifest.expectedDraft || {};
  const manifestSources = [manifestIdentity, manifest];

  const runId = valueFrom(manifestSources, ['runId']);
  const draftId = valueFrom(manifestSources, ['draftId']);
  const postSlug = valueFrom(manifestSources, ['postSlug', 'slug']);
  const toolSlug = valueFrom(manifestSources, ['toolSlug']);
  const packageCommit = valueFrom(manifestSources, ['packageCommit', 'currentSourceHead']);
  const siteId = valueFrom([manifest.wix, manifestIdentity, manifest], ['siteId', 'wixSiteId']);
  const title = valueFrom([manifestIdentity, manifest, expected, prepublishIdentity], ['title']);

  for (const [label, value] of Object.entries({ runId, draftId, postSlug, toolSlug, packageCommit, siteId, title })) {
    assert(typeof value === 'string' && value.trim(), `Manifest is missing ${label}`);
  }

  const decision = String(valueFrom([prepublish], ['decision', 'status', 'result']) || '').toUpperCase();
  assert(decision === 'PASS', 'Prepublish report is not PASS');
  assert(prepublishIdentity.runId === runId, 'Prepublish runId does not match manifest');
  assert(prepublishIdentity.draftId === draftId, 'Prepublish draftId does not match manifest');
  assert((prepublishIdentity.postSlug || prepublishIdentity.slug) === postSlug, 'Prepublish postSlug does not match manifest');

  const expectedTitle = valueFrom([expected], ['title']);
  if (expectedTitle !== null) assert(expectedTitle === title, 'Prepublish title does not match manifest');

  const richContentSha256 = normalizeHash(
    valueFrom([expected], ['richContentSha256', 'richSha256']),
    'Prepublish richContentSha256',
  );
  const seoDataSha256 = normalizeHash(
    valueFrom([expected], ['seoDataSha256', 'seoSha256']),
    'Prepublish seoDataSha256',
  );
  const protectedHashValue = valueFrom(
    [expected],
    ['protectedFieldsSha256', 'normalizedProtectedFieldsSha256', 'normalizedBusinessSha256'],
  );
  const protectedFieldsSha256 = normalizeHash(
    protectedHashValue || (expected.protectedFields ? canonicalSha256(expected.protectedFields) : null),
    'Prepublish protectedFieldsSha256',
  );

  if (expected.hashAlgorithm !== undefined) {
    assert(expected.hashAlgorithm === HASH_ALGORITHM, `Unsupported prepublish hash algorithm: ${expected.hashAlgorithm}`);
  }

  const publishPath = `/blog/v3/draft-posts/${encodeURIComponent(draftId)}/publish`;
  const configuredPublishEndpoint = valueFrom([manifest.wix, manifest], ['publishEndpoint', 'publishUrl']);
  if (configuredPublishEndpoint) {
    const configuredPath = new URL(configuredPublishEndpoint, apiBase).pathname;
    assert(configuredPath === publishPath, 'Manifest publish endpoint does not match draftId');
  }

  const identity = { runId, draftId, postSlug, toolSlug, packageCommit, siteId, publishPath };
  return {
    ...identity,
    identityKey: publishIdentityKey(identity),
    title,
    apiBase,
    publishUrl: new URL(publishPath, apiBase).toString(),
    draftUrl: new URL(`/blog/v3/draft-posts/${encodeURIComponent(draftId)}?fieldsets=RICH_CONTENT`, apiBase).toString(),
    publishedUrl: new URL(`/blog/v3/posts/${encodeURIComponent(draftId)}?fieldsets=RICH_CONTENT`, apiBase).toString(),
    expected: {
      hashAlgorithm: HASH_ALGORITHM,
      richContentSha256,
      seoDataSha256,
      protectedFieldsSha256,
      publishManagedSlugsBefore: expected.publishManagedSlugs ?? expected.slugs ?? [],
    },
  };
}

function responsePostId(json) {
  return json?.postId || json?.post?.id || json?.id || null;
}

async function requestJson(fetchImpl, url, options, timeoutMs) {
  try {
    const response = await fetchImpl(url, {
      ...options,
      signal: AbortSignal.timeout(timeoutMs),
    });
    const text = await response.text();
    let json = null;
    try { json = text ? JSON.parse(text) : {}; } catch { json = null; }
    return { transport: 'RECEIVED', http: response.status, json };
  } catch (error) {
    return {
      transport: 'AMBIGUOUS',
      http: null,
      json: null,
      error: String(error?.message || error).slice(0, 300),
    };
  }
}

function unwrapDraft(result) {
  return result?.json?.draftPost || result?.json;
}

function unwrapPublished(result) {
  return result?.json?.post || result?.json;
}

function inspectManagedSlugs(value, postSlug, phase) {
  if (value === undefined || value === null) return { present: false, values: null };
  assert(Array.isArray(value), `${phase} slugs is not an array`);
  assert(value.length <= 1 && value.every((slug) => slug === postSlug), `${phase} slugs contains an unexpected value`);
  if (phase === 'published draft') assert(value.length === 1, 'Published draft slugs did not resolve to the exact post slug');
  return { present: true, values: [...value] };
}

function verifyDraftContent(draft, config, phase) {
  assert(draft?.id === config.draftId, `${phase} draft ID mismatch`);
  assert(draft?.title === config.title, `${phase} draft title mismatch`);
  assert(draft?.seoSlug === config.postSlug, `${phase} draft seoSlug mismatch`);
  assert(canonicalSha256(draft.richContent) === config.expected.richContentSha256, `${phase} draft richContent drift`);
  assert(canonicalSha256(draft.seoData) === config.expected.seoDataSha256, `${phase} draft seoData drift`);
  assert(
    canonicalSha256(draftProtectedView(draft)) === config.expected.protectedFieldsSha256,
    `${phase} draft protected fields drift`,
  );
  return inspectManagedSlugs(draft.slugs, config.postSlug, phase);
}

function validTimestamp(value) {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}

function verifyPublishedPair(draft, published, config) {
  const managedSlugs = verifyDraftContent(draft, config, 'published draft');
  assert(draft.status === 'PUBLISHED', `Published draft status is ${draft.status || 'missing'}`);
  assert(draft.hasUnpublishedChanges === false, 'Published draft still has unpublished changes');

  assert(published?.id === config.draftId, 'Published post ID mismatch');
  assert(published?.title === config.title, 'Published post title mismatch');
  assert(published?.slug === config.postSlug, 'Published post slug mismatch');
  assert(canonicalSha256(published.richContent) === config.expected.richContentSha256, 'Published post richContent drift');
  assert(validTimestamp(published.firstPublishedDate), 'Published post firstPublishedDate is missing or invalid');
  assert(validTimestamp(published.lastPublishedDate), 'Published post lastPublishedDate is missing or invalid');
  assert(Date.parse(published.lastPublishedDate) >= Date.parse(published.firstPublishedDate), 'Published timestamps are out of order');
  if (published.hasUnpublishedChanges !== undefined) {
    assert(published.hasUnpublishedChanges === false, 'Published post reports unpublished changes');
  }

  return {
    draft: {
      id: draft.id,
      status: draft.status,
      hasUnpublishedChanges: draft.hasUnpublishedChanges,
      seoSlug: draft.seoSlug,
      richContentSha256: config.expected.richContentSha256,
      seoDataSha256: config.expected.seoDataSha256,
      protectedFieldsSha256: config.expected.protectedFieldsSha256,
      publishManagedSlugs: managedSlugs,
    },
    published: {
      id: published.id,
      title: published.title,
      slug: published.slug,
      firstPublishedDate: published.firstPublishedDate,
      lastPublishedDate: published.lastPublishedDate,
      richContentSha256: config.expected.richContentSha256,
    },
  };
}

function validateJournal(journal, config) {
  assert(journal?.schemaVersion === 1, 'Existing publish journal schema is not supported');
  assert(journal.identityKey === config.identityKey, 'Existing publish journal belongs to another package identity');
  assert(journal.runId === config.runId && journal.draftId === config.draftId, 'Existing publish journal identity mismatch');
  assert(journal.postSlug === config.postSlug && journal.siteId === config.siteId, 'Existing publish journal target mismatch');
  assert(journal.publishPath === config.publishPath, 'Existing publish journal endpoint mismatch');
  assert(journal.maxPostAttempts === 1 && journal.postAttemptCount === 1, 'Existing publish journal does not reserve exactly one attempt');
}

async function getOnlyReadback(config, runtime) {
  const polls = [];
  let verified = null;
  for (let attempt = 1; attempt <= runtime.polls; attempt += 1) {
    const [draftResult, publishedResult] = await Promise.all([
      requestJson(runtime.fetchImpl, config.draftUrl, { headers: runtime.headers }, runtime.timeoutMs),
      requestJson(runtime.fetchImpl, config.publishedUrl, { headers: runtime.headers }, runtime.timeoutMs),
    ]);
    const draft = unwrapDraft(draftResult);
    const published = unwrapPublished(publishedResult);
    const observation = {
      attempt,
      checkedAt: runtime.nowIso(),
      draftTransport: draftResult.transport,
      draftHttp: draftResult.http,
      draftStatus: draft?.status || null,
      draftHasUnpublishedChanges: draft?.hasUnpublishedChanges ?? null,
      publishedTransport: publishedResult.transport,
      publishedHttp: publishedResult.http,
      publishedId: published?.id || null,
      verificationError: null,
    };

    if (draftResult.http === 200 && publishedResult.http === 200) {
      try {
        verified = verifyPublishedPair(draft, published, config);
      } catch (error) {
        observation.verificationError = String(error.message).slice(0, 300);
      }
    }
    polls.push(observation);
    if (verified) break;
    if (attempt < runtime.polls) await runtime.sleepImpl(runtime.pollMs);
  }
  return { verified, polls };
}

function evidencePaths(runDir) {
  return {
    journal: path.join(runDir, 'publish-journal.json'),
    response: path.join(runDir, 'publish-response.json'),
    readback: path.join(runDir, 'publish-readback.json'),
    receipt: path.join(runDir, 'publish-receipt.json'),
  };
}

export async function publishDailyBlogOnce(options) {
  const runDir = path.resolve(options.runDir);
  const manifestPath = path.resolve(options.manifestPath || path.join(runDir, 'run-manifest.json'));
  const prepublishPath = path.resolve(options.prepublishPath || path.join(runDir, 'prepublish-check.json'));
  const apiBase = new URL(options.apiBase || DEFAULT_API_BASE).toString();
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  const timeoutMs = Number(options.timeoutMs ?? 30_000);
  const polls = Number(options.polls ?? 12);
  const pollMs = Number(options.pollMs ?? 2_000);
  const sleepImpl = options.sleepImpl || ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
  const now = options.now || (() => new Date());
  const nowIso = () => {
    const value = now();
    return (value instanceof Date ? value : new Date(value)).toISOString();
  };
  const paths = evidencePaths(runDir);
  let attemptReserved = false;
  let config = null;
  let postCallsThisInvocation = 0;

  assert(typeof fetchImpl === 'function', 'fetch is unavailable');
  assert(Number.isInteger(polls) && polls >= 1, 'polls must be a positive integer');
  assert(Number.isFinite(pollMs) && pollMs >= 0, 'poll-ms must be zero or greater');
  assert(Number.isFinite(timeoutMs) && timeoutMs > 0, 'timeout-ms must be positive');

  try {
    const manifest = readJson(manifestPath);
    const prepublish = readJson(prepublishPath);
    config = resolveConfiguration(manifest, prepublish, apiBase);
    const token = options.token ?? process.env.WIX_API_KEY;
    assert(typeof token === 'string' && token.length > 0, 'WIX_API_KEY is not loaded');
    const headers = {
      Authorization: token,
      'wix-site-id': config.siteId,
      'Content-Type': 'application/json',
    };
    const runtime = { fetchImpl, timeoutMs, polls, pollMs, sleepImpl, nowIso, headers };

    let journal = null;
    let mode = 'ONE_POST';

    if (fs.existsSync(paths.journal)) {
      journal = readJson(paths.journal);
      validateJournal(journal, config);
      attemptReserved = true;
      mode = 'GET_ONLY_RECOVERY';
    } else {
      const [draftResult, publishedResult] = await Promise.all([
        requestJson(fetchImpl, config.draftUrl, { headers }, timeoutMs),
        requestJson(fetchImpl, config.publishedUrl, { headers }, timeoutMs),
      ]);
      assert(draftResult.transport === 'RECEIVED' && draftResult.http === 200, 'Prepublish draft GET did not return HTTP 200');
      const draft = unwrapDraft(draftResult);
      const beforeSlugs = verifyDraftContent(draft, config, 'prepublish');
      assert(draft.status === 'UNPUBLISHED', `Prepublish draft status is ${draft.status || 'missing'}`);
      assert(draft.hasUnpublishedChanges === true, 'Prepublish draft hasUnpublishedChanges is not true');
      assert(publishedResult.transport === 'RECEIVED' && publishedResult.http === 404, 'Published endpoint is not HTTP 404 before the reserved publish attempt');

      const expectedBefore = config.expected.publishManagedSlugsBefore;
      if (expectedBefore !== null && expectedBefore !== undefined) {
        assert(
          JSON.stringify(beforeSlugs.values ?? []) === JSON.stringify(expectedBefore),
          'Prepublish publish-managed slugs do not match the prepublish report',
        );
      }

      const reservation = {
        schemaVersion: 1,
        identityKey: config.identityKey,
        runId: config.runId,
        draftId: config.draftId,
        postSlug: config.postSlug,
        toolSlug: config.toolSlug,
        packageCommit: config.packageCommit,
        siteId: config.siteId,
        publishPath: config.publishPath,
        maxPostAttempts: 1,
        postAttemptCount: 1,
        status: 'POST_DISPATCH_RESERVED',
        reservedAt: nowIso(),
        hashAlgorithm: HASH_ALGORITHM,
        manifestSha256: fileSha256(manifestPath),
        prepublishSha256: fileSha256(prepublishPath),
        prepublishManagedSlugs: beforeSlugs,
      };

      if (createJsonExclusive(paths.journal, reservation)) {
        journal = reservation;
        attemptReserved = true;
        postCallsThisInvocation = 1;
        const postResult = await requestJson(
          fetchImpl,
          config.publishUrl,
          { method: 'POST', headers, body: '{}' },
          timeoutMs,
        );
        const responseEvidence = {
          recordedAt: nowIso(),
          transport: postResult.transport,
          http: postResult.http,
          postId: responsePostId(postResult.json),
          error: postResult.error || null,
        };
        writeJsonAtomic(paths.response, responseEvidence);
        journal = {
          ...journal,
          status: postResult.transport === 'RECEIVED' ? 'POST_RESPONSE_RECEIVED' : 'POST_TRANSPORT_AMBIGUOUS',
          response: responseEvidence,
        };
        writeJsonAtomic(paths.journal, journal);
      } else {
        journal = readJson(paths.journal);
        validateJournal(journal, config);
        attemptReserved = true;
        mode = 'GET_ONLY_RECOVERY_AFTER_RESERVATION_RACE';
      }
    }

    const readback = await getOnlyReadback(config, runtime);
    if (!readback.verified) {
      const evidence = {
        schemaVersion: 1,
        checkedAt: nowIso(),
        decision: 'UNPROVEN_NO_RETRY',
        terminalState: 'PUBLISHED_PARTIAL',
        mode,
        identityKey: config.identityKey,
        postCallsThisInvocation,
        postAttemptUpperBound: 1,
        noSecondPostAllowed: true,
        polls: readback.polls,
      };
      writeJsonAtomic(paths.readback, evidence);
      journal = { ...journal, status: 'UNPROVEN_NO_RETRY', lastReadbackAt: evidence.checkedAt };
      writeJsonAtomic(paths.journal, journal);
      throw new PublishBlockedError('Publish state is unproven; a second POST is forbidden', evidence);
    }

    const readbackEvidence = {
      schemaVersion: 1,
      checkedAt: nowIso(),
      decision: 'PUBLISHED',
      mode,
      identityKey: config.identityKey,
      postCallsThisInvocation,
      postAttemptUpperBound: 1,
      noSecondPostAllowed: true,
      publishManagedSlugs: {
        before: journal.prepublishManagedSlugs || { present: true, values: config.expected.publishManagedSlugsBefore },
        after: readback.verified.draft.publishManagedSlugs,
      },
      draft: readback.verified.draft,
      published: readback.verified.published,
      polls: readback.polls,
    };
    writeJsonAtomic(paths.readback, readbackEvidence);
    journal = { ...journal, status: 'PUBLISHED_VERIFIED', verifiedAt: readbackEvidence.checkedAt };
    writeJsonAtomic(paths.journal, journal);

    const receipt = {
      schemaVersion: 1,
      decision: 'PUBLISHED',
      terminalState: 'PUBLISHED',
      mode,
      runId: config.runId,
      draftId: config.draftId,
      postSlug: config.postSlug,
      identityKey: config.identityKey,
      postCallsThisInvocation,
      postAttemptUpperBound: 1,
      noSecondPostAllowed: true,
      published: readback.verified.published,
      evidence: {
        journal: path.basename(paths.journal),
        response: fs.existsSync(paths.response) ? path.basename(paths.response) : null,
        readback: path.basename(paths.readback),
      },
    };
    writeJsonAtomic(paths.receipt, receipt);
    return receipt;
  } catch (error) {
    if (error instanceof PublishBlockedError && error.receipt?.terminalState === 'PUBLISHED_PARTIAL') {
      const receipt = {
        ...error.receipt,
        runId: config?.runId || null,
        draftId: config?.draftId || null,
        postSlug: config?.postSlug || null,
      };
      writeJsonAtomic(paths.receipt, receipt);
      throw new PublishBlockedError(error.message, receipt);
    }

    const terminalState = attemptReserved ? 'PUBLISHED_PARTIAL' : 'BLOCKED_UNPUBLISHED';
    const receipt = {
      schemaVersion: 1,
      decision: 'BLOCKED_NO_RETRY',
      terminalState,
      recordedAt: nowIso(),
      runId: config?.runId || null,
      draftId: config?.draftId || null,
      postSlug: config?.postSlug || null,
      identityKey: config?.identityKey || null,
      postCallsThisInvocation,
      postAttemptUpperBound: attemptReserved ? 1 : 0,
      noSecondPostAllowed: attemptReserved,
      error: String(error?.message || error).slice(0, 500),
    };
    writeJsonAtomic(paths.receipt, receipt);
    throw new PublishBlockedError(receipt.error, receipt);
  }
}

function usage() {
  return [
    'Usage:',
    '  node scripts/publish-daily-blog-once.mjs --run-dir <dir> [options]',
    '',
    'Options:',
    '  --manifest <file>    Default: <run-dir>/run-manifest.json',
    '  --prepublish <file>  Default: <run-dir>/prepublish-check.json',
    '  --api-base <url>     Default: https://www.wixapis.com',
    '  --polls <n>          Default: 12',
    '  --poll-ms <ms>       Default: 2000',
    '  --timeout-ms <ms>    Default: 30000',
  ].join('\n');
}

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--help' || argument === '-h') return { help: true };
    const next = argv[index + 1];
    assert(next !== undefined && !next.startsWith('--'), `Missing value for ${argument}`);
    if (argument === '--run-dir') result.runDir = next;
    else if (argument === '--manifest') result.manifestPath = next;
    else if (argument === '--prepublish') result.prepublishPath = next;
    else if (argument === '--api-base') result.apiBase = next;
    else if (argument === '--polls') result.polls = Number(next);
    else if (argument === '--poll-ms') result.pollMs = Number(next);
    else if (argument === '--timeout-ms') result.timeoutMs = Number(next);
    else throw new Error(`Unknown option: ${argument}`);
    index += 1;
  }
  return result;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(`${usage()}\n`);
    return;
  }
  assert(options.runDir, '--run-dir is required');
  try {
    const receipt = await publishDailyBlogOnce(options);
    process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
  } catch (error) {
    const output = error instanceof PublishBlockedError ? error.receipt : { decision: 'ERROR', error: error.message };
    process.stderr.write(`${JSON.stringify(output, null, 2)}\n`);
    process.exitCode = 2;
  }
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : null;
if (invokedPath === fileURLToPath(import.meta.url)) await main();

