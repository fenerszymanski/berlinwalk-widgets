import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import {
  GLOBAL_BLOG_CONTRACT,
  HISTORY_PROTECTED_SLUGS,
  assertMagnetListInvariants,
  bindDailyBlogPost,
  classifyDailyBlogPost,
  readMagnetSlugLists,
} from './auto-bind-daily-blog-magnet.mjs';

const root = path.resolve(import.meta.dirname, '..');
const injectorSource = await readFile(path.join(root, 'js', 'lead-form-inject.js'), 'utf8');
const blogIndex = JSON.parse(await readFile(path.join(root, 'blog-index', 'data.json'), 'utf8'));

test('daily magnet binding is retired behind the global Date Check contract', () => {
  assert.equal(GLOBAL_BLOG_CONTRACT, 'date-check-global-v1');
  assert.deepEqual(HISTORY_PROTECTED_SLUGS, []);
  assert.deepEqual(readMagnetSlugLists(injectorSource), []);
  assert.doesNotMatch(injectorSource, /CONTENT_UPGRADE_MAGNETS|bw-history-lead-magnet|bw-content-upgrade-card|bw-date-check-teaser/);
});

test('every indexed post resolves to the same global surface with no asset owner', () => {
  const posts = blogIndex.allPosts.filter((post) => post && post.slug);
  assert.ok(posts.length > 100);
  for (const post of posts) {
    assert.deepEqual(classifyDailyBlogPost(post), { assetId: null, rule: 'global-date-check', slug: post.slug });
    const result = bindDailyBlogPost({ injectorSource, blogIndex, post });
    assert.equal(result.status, 'retired');
    assert.equal(result.changed, false);
    assert.equal(result.assetId, null);
  }
});

test('invariant check never returns legacy slug owners and still validates new posts', () => {
  const fixture = { slug: 'global-contract-fixture' };
  const fixtureIndex = { ...blogIndex, allPosts: [...blogIndex.allPosts, fixture] };
  const result = assertMagnetListInvariants({ injectorSource, blogIndex: fixtureIndex, addedSlugs: [fixture.slug] });
  assert.deepEqual(result.configs, []);
  assert.equal(result.owners.size, 0);
  assert.deepEqual(result.missingLegacySlugs, []);
});

test('unknown or unindexed binding fails closed', () => {
  assert.throws(() => classifyDailyBlogPost({ title: 'No slug' }), /post slug/);
  assert.throws(() => bindDailyBlogPost({ injectorSource, blogIndex, post: { slug: 'not-in-index' } }), /not in blog-index/);
});
