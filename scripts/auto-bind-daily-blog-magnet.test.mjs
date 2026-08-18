import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import {
  HISTORY_PROTECTED_SLUGS,
  assertMagnetListInvariants,
  bindDailyBlogPost,
  classifyDailyBlogPost,
  readMagnetSlugLists,
} from './auto-bind-daily-blog-magnet.mjs';

const root = path.resolve(import.meta.dirname, '..');
const injectorSource = fs.readFileSync(path.join(root, 'js', 'lead-form-inject.js'), 'utf8');
const blogIndex = JSON.parse(fs.readFileSync(path.join(root, 'blog-index', 'data.json'), 'utf8'));

const mappingFixtures = [
  [{ slug: 'daily-itinerary-fixture', categorySlug: 'tourist-tips', topicLabel: 'First Day in Berlin', title: 'How Many Days in Berlin? A First-Time Itinerary' }, 'berlin-skip-list'],
  [{ slug: 'daily-ticket-fixture', categorySlug: 'tourist-tips', topicLabel: 'Free & Budget', title: 'Which Museum Pass and Paid Tickets Fit This Day?' }, 'berlin-pass-decision-sheet'],
  [{ slug: 'daily-arrival-fixture', categorySlug: 'tourist-tips', topicLabel: 'Practical Berlin', title: 'Berlin Airport Arrival: Stations, Zones and Luggage' }, 'berlin-arrival-card'],
  [{ slug: 'daily-day-trip-fixture', categorySlug: 'tourist-tips', topicLabel: 'Practical Berlin', title: 'A Day Trip Outside Berlin by Train' }, 'berlin-day-trip-compare-sheet'],
  [{ slug: 'daily-german-fixture', categorySlug: 'german-language', topicLabel: 'First Day in Berlin', title: 'German Phrases for Berlin Signs' }, 'berlin-german-cheat-card'],
  [{ slug: 'daily-food-fixture', categorySlug: 'tourist-tips', topicLabel: 'Food & Nightlife', title: 'Where to Eat and Order in Berlin' }, 'berlin-food-decision-card'],
  [{ slug: 'daily-neighborhood-fixture', categorySlug: 'tourist-tips', topicLabel: 'Practical Berlin', title: 'Where to Stay: Berlin Neighbourhoods Compared' }, 'berlin-neighborhood-matcher'],
  [{ slug: 'daily-rules-fixture', categorySlug: 'tourist-tips', topicLabel: 'Practical Berlin', title: 'Pfand, Tipping and Unwritten Rules in Berlin' }, 'berlin-unwritten-rules-card'],
  [{ slug: 'daily-month-fixture', categorySlug: 'tourist-tips', topicLabel: 'Month-by-Month Berlin', title: 'Berlin in October: Weather and What to Pack' }, 'berlin-month-planner-card'],
];

test('maps every approved daily-blog branch to exactly one live asset', () => {
  for (const [post, assetId] of mappingFixtures) {
    const decision = classifyDailyBlogPost(post);
    assert.equal(decision.assetId, assetId, `${post.slug} mapped by ${decision.rule}`);
  }
});

test('keeps route, event, history and unknown posts on booking', () => {
  const fixtures = [
    [{ slug: 'route-fixture', categorySlug: 'tourist-tips', topicLabel: 'Tour Route Stories', title: 'A Landmark on the Berlin Route' }, 'no-magnet-tour-route'],
    [{ slug: 'event-fixture', categorySlug: 'tourist-tips', topicLabel: 'Practical Berlin', title: 'Berlin Marathon 2026: What Visitors Need to Know' }, 'no-magnet-2026-event'],
    [{ slug: 'history-fixture', categorySlug: 'berlin-history', topicLabel: 'Berlin History & Myths', title: 'A Berlin Monument Then and Now' }, 'no-magnet-history'],
    [{ slug: HISTORY_PROTECTED_SLUGS[0], categorySlug: 'tourist-tips', topicLabel: 'First Day in Berlin', title: 'A Planning Guide' }, 'no-magnet-history'],
    [{ slug: 'unknown-fixture', categorySlug: 'tourist-tips', topicLabel: 'Practical Berlin', title: 'Why Are the Pipes Pink?' }, 'no-magnet-unmapped'],
  ];
  for (const [post, rule] of fixtures) {
    const decision = classifyDailyBlogPost(post);
    assert.equal(decision.assetId, null, post.slug);
    assert.equal(decision.rule, rule, post.slug);
  }
});

test('keeps month context and language specialist categories ahead of broad title terms', () => {
  assert.equal(classifyDailyBlogPost({
    slug: 'berlin-in-december-2026',
    categorySlug: 'tourist-tips',
    topicLabel: 'Month-by-Month Berlin',
    title: 'Berlin in December 2026: Christmas Markets and Weather',
  }).assetId, 'berlin-month-planner-card');
  assert.equal(classifyDailyBlogPost({
    slug: 'berlin-festival-2026',
    categorySlug: 'tourist-tips',
    topicLabel: 'First Day in Berlin',
    title: 'Festival of Lights Berlin 2026: Visitor Guide',
  }).assetId, null);
  assert.equal(classifyDailyBlogPost({
    slug: 'berlin-train-announcements',
    categorySlug: 'german-language',
    topicLabel: 'Month-by-Month Berlin',
    title: 'Berlin Train Announcements Decoded',
  }).assetId, 'berlin-german-cheat-card');
});

test('binds only an indexed post and edits the selected list once', () => {
  const post = { slug: 'daily-binding-fixture', categorySlug: 'tourist-tips', topicLabel: 'Food & Nightlife', title: 'A Berlin Restaurant Decision' };
  const fixtureIndex = { ...blogIndex, allPosts: [...blogIndex.allPosts, post] };
  const result = bindDailyBlogPost({ injectorSource, blogIndex: fixtureIndex, post });
  assert.equal(result.status, 'bound');
  assert.equal(result.changed, true);
  const configs = readMagnetSlugLists(result.source);
  const owners = configs.filter((config) => config.slugs.includes(post.slug)).map((config) => config.assetId);
  assert.deepEqual(owners, ['berlin-food-decision-card']);
  assertMagnetListInvariants({ injectorSource: result.source, blogIndex: fixtureIndex, addedSlugs: [post.slug] });
});

test('dry-run and retry are idempotent, while a different owner fails closed', () => {
  const post = { slug: 'daily-idempotency-fixture', categorySlug: 'tourist-tips', topicLabel: 'Food & Nightlife', title: 'Berlin Food at Night' };
  const fixtureIndex = { ...blogIndex, allPosts: [...blogIndex.allPosts, post] };
  const dryRun = bindDailyBlogPost({ injectorSource, blogIndex: fixtureIndex, post, dryRun: true });
  assert.equal(dryRun.status, 'would-bind');
  assert.equal(dryRun.changed, false);
  const first = bindDailyBlogPost({ injectorSource, blogIndex: fixtureIndex, post });
  const retry = bindDailyBlogPost({ injectorSource: first.source, blogIndex: fixtureIndex, post });
  assert.equal(retry.status, 'already-bound');
  assert.equal(retry.changed, false);
  assert.throws(() => bindDailyBlogPost({
    injectorSource: first.source,
    blogIndex: fixtureIndex,
    post: { ...post, categorySlug: 'tourist-tips', topicLabel: 'Practical Berlin', title: 'Berlin Airport Arrival' },
  }), /lead magnet slug collision/);
});

test('checks disjointness, history protection and the current blog index without growing-count assertions', () => {
  const result = assertMagnetListInvariants({ injectorSource, blogIndex });
  assert.equal(result.owners.size > 0, true);
  assert.equal(result.missingLegacySlugs.every((slug) => slug.length > 0), true);
  assert.deepEqual([...result.owners.entries()].filter(([, assetId]) => !assetId), []);
});
