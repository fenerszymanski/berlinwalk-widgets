#!/usr/bin/env node

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  PublishBlockedError,
  canonicalSha256,
  draftProtectedView,
  publishDailyBlogOnce,
  publishIdentityKey,
} from './publish-daily-blog-once.mjs';

function jsonResponse(status, body = {}) {
  return {
    status,
    async text() { return status === 404 ? '' : JSON.stringify(body); },
  };
}

function createFixture() {
  const runDir = fs.mkdtempSync(path.join(os.tmpdir(), 'berlinwalk-publish-once-'));
  const identity = {
    runId: '2026-08-14-1205-Europe-Berlin',
    draftId: '11111111-2222-4333-8444-555555555555',
    postSlug: 'morning-or-afternoon-berlin-test',
    toolSlug: 'berlin-time-test',
    packageCommit: '0123456789abcdef0123456789abcdef01234567',
    siteId: '12ee5ea0-70a7-492f-8020-ffb27cbb630f',
  };
  const title = 'Morning or Afternoon in Berlin?';
  const richContent = {
    nodes: [{ id: 'p1', type: 'PARAGRAPH', nodes: [{ id: 't1', type: 'TEXT', textData: { decorations: [], text: 'Exact body.' } }] }],
  };
  const seoData = { tags: [{ type: 'title', children: 'Exact SEO title' }] };
  const protectedFields = {
    title,
    memberId: 'member-1',
    excerpt: 'Exact excerpt',
    media: { displayed: true },
    categoryIds: ['category-1'],
    tagIds: ['tag-1'],
    hashtags: [],
    seoSlug: identity.postSlug,
    seoData,
    language: 'en',
    commentingEnabled: true,
    featured: false,
    minutesToRead: 4,
    pricingPlanIds: [],
  };
  const unpublishedDraft = {
    id: identity.draftId,
    ...protectedFields,
    status: 'UNPUBLISHED',
    hasUnpublishedChanges: true,
    slugs: [],
    richContent,
  };
  const publishedDraft = {
    ...unpublishedDraft,
    status: 'PUBLISHED',
    hasUnpublishedChanges: false,
    slugs: [identity.postSlug],
    firstPublishedDate: '2026-08-14T10:05:00.000Z',
    lastPublishedDate: '2026-08-14T10:05:01.000Z',
  };
  const publishedPost = {
    id: identity.draftId,
    title,
    slug: identity.postSlug,
    richContent,
    firstPublishedDate: '2026-08-14T10:05:00.000Z',
    lastPublishedDate: '2026-08-14T10:05:01.000Z',
  };
  const manifest = {
    schemaVersion: 1,
    ...identity,
    title,
    wixSiteId: identity.siteId,
    publishEndpoint: `/blog/v3/draft-posts/${identity.draftId}/publish`,
  };
  const prepublish = {
    schemaVersion: 1,
    decision: 'PASS',
    identity: {
      runId: identity.runId,
      draftId: identity.draftId,
      postSlug: identity.postSlug,
    },
    draft: {
      title,
      hashAlgorithm: 'canonical-json-sha256-v1',
      richContentSha256: canonicalSha256(richContent),
      seoDataSha256: canonicalSha256(seoData),
      protectedFieldsSha256: canonicalSha256(draftProtectedView(unpublishedDraft)),
      publishManagedSlugs: [],
    },
  };
  fs.writeFileSync(path.join(runDir, 'run-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  fs.writeFileSync(path.join(runDir, 'prepublish-check.json'), `${JSON.stringify(prepublish, null, 2)}\n`);

  return {
    runDir,
    identity,
    title,
    unpublishedDraft,
    publishedDraft,
    publishedPost,
    cleanup() { fs.rmSync(runDir, { recursive: true, force: true }); },
  };
}

function journalFor(fixture) {
  const publishPath = `/blog/v3/draft-posts/${encodeURIComponent(fixture.identity.draftId)}/publish`;
  const identity = { ...fixture.identity, publishPath };
  return {
    schemaVersion: 1,
    identityKey: publishIdentityKey(identity),
    ...fixture.identity,
    publishPath,
    maxPostAttempts: 1,
    postAttemptCount: 1,
    status: 'POST_DISPATCH_RESERVED',
    reservedAt: '2026-08-14T10:05:00.000Z',
    prepublishManagedSlugs: { present: true, values: [] },
  };
}

function route(url, fixture) {
  const parsed = new URL(url);
  const draftPath = `/blog/v3/draft-posts/${fixture.identity.draftId}`;
  const publishedPath = `/blog/v3/posts/${fixture.identity.draftId}`;
  const publishPath = `${draftPath}/publish`;
  if (parsed.pathname === publishPath) return 'publish';
  if (parsed.pathname === draftPath) return 'draft';
  if (parsed.pathname === publishedPath) return 'published';
  throw new Error(`Unexpected mock URL: ${url}`);
}

function runtime(runDir, fetchImpl) {
  return {
    runDir,
    fetchImpl,
    token: 'test-token',
    apiBase: 'https://mock.wix.invalid',
    polls: 1,
    pollMs: 0,
    timeoutMs: 1_000,
    sleepImpl: async () => {},
  };
}

test('happy path reserves the journal and sends exactly one POST', async (t) => {
  const fixture = createFixture();
  t.after(fixture.cleanup);
  let published = false;
  let postCalls = 0;
  const fetchImpl = async (url, options = {}) => {
    const target = route(url, fixture);
    if (target === 'publish') {
      assert.equal(options.method, 'POST');
      postCalls += 1;
      published = true;
      return jsonResponse(200, { postId: fixture.identity.draftId });
    }
    if (target === 'draft') return jsonResponse(200, { draftPost: published ? fixture.publishedDraft : fixture.unpublishedDraft });
    return published ? jsonResponse(200, { post: fixture.publishedPost }) : jsonResponse(404);
  };

  const receipt = await publishDailyBlogOnce(runtime(fixture.runDir, fetchImpl));
  assert.equal(receipt.decision, 'PUBLISHED');
  assert.equal(receipt.postCallsThisInvocation, 1);
  assert.equal(postCalls, 1);
  const journal = JSON.parse(fs.readFileSync(path.join(fixture.runDir, 'publish-journal.json')));
  assert.equal(journal.postAttemptCount, 1);
  assert.equal(journal.status, 'PUBLISHED_VERIFIED');
});

test('a crash journal recovers by GET with zero POST calls', async (t) => {
  const fixture = createFixture();
  t.after(fixture.cleanup);
  fs.writeFileSync(path.join(fixture.runDir, 'publish-journal.json'), `${JSON.stringify(journalFor(fixture), null, 2)}\n`);
  let postCalls = 0;
  const fetchImpl = async (url) => {
    const target = route(url, fixture);
    if (target === 'publish') {
      postCalls += 1;
      throw new Error('POST must not run during recovery');
    }
    if (target === 'draft') return jsonResponse(200, { draftPost: fixture.publishedDraft });
    return jsonResponse(200, { post: fixture.publishedPost });
  };

  const receipt = await publishDailyBlogOnce(runtime(fixture.runDir, fetchImpl));
  assert.equal(receipt.mode, 'GET_ONLY_RECOVERY');
  assert.equal(receipt.postCallsThisInvocation, 0);
  assert.equal(postCalls, 0);
});

test('Wix publish-managed slugs may change from [] to [postSlug]', async (t) => {
  const fixture = createFixture();
  t.after(fixture.cleanup);
  let published = false;
  const fetchImpl = async (url) => {
    const target = route(url, fixture);
    if (target === 'publish') {
      published = true;
      return jsonResponse(200, { postId: fixture.identity.draftId });
    }
    if (target === 'draft') return jsonResponse(200, { draftPost: published ? fixture.publishedDraft : fixture.unpublishedDraft });
    return published ? jsonResponse(200, { post: fixture.publishedPost }) : jsonResponse(404);
  };

  await publishDailyBlogOnce(runtime(fixture.runDir, fetchImpl));
  const readback = JSON.parse(fs.readFileSync(path.join(fixture.runDir, 'publish-readback.json')));
  assert.deepEqual(readback.publishManagedSlugs.before.values, []);
  assert.deepEqual(readback.publishManagedSlugs.after.values, [fixture.identity.postSlug]);
});

test('published schema uses slug and may omit seoData and slugs', async (t) => {
  const fixture = createFixture();
  t.after(fixture.cleanup);
  fs.writeFileSync(path.join(fixture.runDir, 'publish-journal.json'), `${JSON.stringify(journalFor(fixture), null, 2)}\n`);
  const publishedWithoutDraftOnlyFields = { ...fixture.publishedPost };
  assert.equal(Object.prototype.hasOwnProperty.call(publishedWithoutDraftOnlyFields, 'seoData'), false);
  assert.equal(Object.prototype.hasOwnProperty.call(publishedWithoutDraftOnlyFields, 'slugs'), false);
  assert.equal(Object.prototype.hasOwnProperty.call(publishedWithoutDraftOnlyFields, 'seoSlug'), false);

  const fetchImpl = async (url) => {
    const target = route(url, fixture);
    if (target === 'publish') throw new Error('Unexpected POST');
    if (target === 'draft') return jsonResponse(200, { draftPost: fixture.publishedDraft });
    return jsonResponse(200, { post: publishedWithoutDraftOnlyFields });
  };

  const receipt = await publishDailyBlogOnce(runtime(fixture.runDir, fetchImpl));
  assert.equal(receipt.published.slug, fixture.identity.postSlug);
  assert.equal(receipt.decision, 'PUBLISHED');
});

test('ambiguous transport blocks and a rerun never sends a second POST', async (t) => {
  const fixture = createFixture();
  t.after(fixture.cleanup);
  let postCalls = 0;
  const fetchImpl = async (url) => {
    const target = route(url, fixture);
    if (target === 'publish') {
      postCalls += 1;
      throw new Error('socket closed after dispatch');
    }
    if (target === 'draft') return jsonResponse(200, { draftPost: fixture.unpublishedDraft });
    return jsonResponse(404);
  };

  await assert.rejects(
    publishDailyBlogOnce(runtime(fixture.runDir, fetchImpl)),
    (error) => error instanceof PublishBlockedError
      && error.receipt.terminalState === 'PUBLISHED_PARTIAL'
      && error.receipt.noSecondPostAllowed === true,
  );
  assert.equal(postCalls, 1);

  await assert.rejects(
    publishDailyBlogOnce(runtime(fixture.runDir, fetchImpl)),
    (error) => error instanceof PublishBlockedError
      && error.receipt.terminalState === 'PUBLISHED_PARTIAL'
      && error.receipt.postCallsThisInvocation === 0,
  );
  assert.equal(postCalls, 1, 'rerun must stay GET-only');
  const journal = JSON.parse(fs.readFileSync(path.join(fixture.runDir, 'publish-journal.json')));
  assert.equal(journal.postAttemptCount, 1);
  assert.equal(journal.status, 'UNPROVEN_NO_RETRY');
});

