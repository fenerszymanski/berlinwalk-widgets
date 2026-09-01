#!/usr/bin/env node

// Read-only release check for the Berlin History Story related-reading layer.
// It reads the current published Wix Blog graph; it never writes Wix or files.

import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { requireWixKey, wixFetch } from '../../../../berlinwalk-content-app/api/_lib/wix.js';

const SITE_ORIGIN = 'https://www.berlinwalk.com';
const SITE_HOSTS = new Set(['berlinwalk.com', 'www.berlinwalk.com']);
const CONCURRENCY = 6;

const OFFICIAL_POSTS = [
  { slug: 'beautiful-u-bahn-stations-berlin', title: 'The Most Beautiful U-Bahn Stations in Berlin: Which Ones Are Worth Getting Off At' },
  { slug: 'berlin-brutalist-architecture', title: 'Berlin Brutalist Architecture: Four Concrete Buildings Worth a Detour' },
  { slug: 'berlin-cemeteries', title: 'Berlin Cemeteries: How to Pick the One That Fits Your Day' },
  { slug: 'berlin-courtyards-hoefe', title: 'The Hidden Courtyards of Berlin: A Walk Through the Höfe Around Hackescher Markt' },
  { slug: 'berlin-wall-in-mitte-city-centre', title: 'The Berlin Wall in Mitte: Where the Line Crosses the Centre' },
  { slug: 'berlin-wall-map-overlay-where-you-are-standing', title: 'Berlin Wall Map Overlay: How to Read Where You Are Standing' },
  { slug: 'berliner-unterwelten', title: "Berliner Unterwelten: How to Actually Get Into Berlin's Bunker Tours" },
  { slug: 'deutsches-technikmuseum-berlin', title: 'Deutsches Technikmuseum Berlin: The Giant Museum With a Plane on the Roof' },
  { slug: 'free-berlin-memorials', title: 'Free Berlin Memorials: Four Powerful Places That Are Easy to Visit' },
  { slug: 'gemaldegalerie-berlin', title: 'Gemäldegalerie Berlin: The Old Masters Gallery Most Visitors Miss' },
  { slug: 'jewish-museum-berlin-guide', title: 'Jewish Museum Berlin: Free Entry, How Long and What to See' },
  { slug: 'koepenick-berlin', title: 'Köpenick Berlin: The Palace, the Lake and the Fake Captain Who Fooled Prussia' },
  { slug: 'oberbaumbruecke-berlin', title: "The Oberbaumbrücke: Berlin's Prettiest Bridge and the Border That Ran Through It" },
  { slug: 'stasi-museum-berlin', title: 'Stasi Museum Berlin: The Secret Police HQ and Prison' },
  { slug: 'teufelsberg-berlin', title: 'Teufelsberg Berlin: The Cold War Spy Station on a Man-Made Hill' },
  { slug: 'two-of-everything-in-berlin', title: 'Two of Everything in Berlin: The East and West Twins and Which One to Visit' },
];

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function postSlug(post) {
  return String(post?.seoSlug || post?.slug || '').trim();
}

function unwrapPost(payload) {
  return payload?.post || payload;
}

function parseInternalPostUrl(rawUrl) {
  const raw = String(rawUrl || '').trim();
  if (!raw) return null;
  let parsed;
  try {
    parsed = new URL(raw, SITE_ORIGIN);
  } catch {
    return null;
  }
  if (!SITE_HOSTS.has(parsed.hostname.toLowerCase())) return null;
  const parts = parsed.pathname.split('/').filter(Boolean);
  if (parts.length !== 2 || parts[0] !== 'post' || !parts[1]) return null;
  try {
    return decodeURIComponent(parts[1]);
  } catch {
    return null;
  }
}

function extractInternalPostSlugs(richContent) {
  const slugs = [];
  const seenLinks = new WeakSet();

  function record(link) {
    if (!link || typeof link !== 'object' || seenLinks.has(link)) return;
    seenLinks.add(link);
    const slug = parseInternalPostUrl(link.url);
    if (slug) slugs.push(slug);
  }

  function visit(value) {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    record(value.linkData?.link);
    record(value.buttonData?.link);
    Object.values(value).forEach(visit);
  }

  visit(richContent || {});
  return slugs;
}

async function queryPublishedReferences() {
  const rows = [];
  for (let offset = 0; ; offset += 100) {
    const payload = await wixFetch('/blog/v3/draft-posts/query', {
      method: 'POST',
      body: { query: { paging: { limit: 100, offset } } },
    });
    const page = payload?.draftPosts || [];
    rows.push(...page);
    if (page.length < 100) break;
  }
  return rows.filter((row) => row.status === 'PUBLISHED');
}

async function mapWithConcurrency(items, worker) {
  const results = new Array(items.length);
  let next = 0;
  async function run() {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await worker(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, run));
  return results;
}

async function readPublishedPost(reference) {
  return unwrapPost(await wixFetch('/blog/v3/posts/' + encodeURIComponent(reference.id) + '?fieldsets=RICH_CONTENT'));
}

async function readLocalPayload() {
  const source = await readFile(new URL('../berlin-history-story/related-history-posts.js', import.meta.url), 'utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(source, sandbox, { filename: 'related-history-posts.js' });
  return Array.isArray(sandbox.window.BERLIN_HISTORY_STORY_RELATED_POSTS)
    ? sandbox.window.BERLIN_HISTORY_STORY_RELATED_POSTS
    : [];
}

function buildReport(posts, localPayload) {
  const bySlug = new Map(posts.map((post) => [postSlug(post), post]).filter(([slug]) => slug));
  const inboundSources = new Map([...bySlug.keys()].map((slug) => [slug, new Set()]));
  const allPairs = new Set();
  const publishedTargetPairs = new Set();
  let selfLinkOccurrences = 0;

  for (const post of posts) {
    const sourceSlug = postSlug(post);
    if (!sourceSlug) continue;
    for (const targetSlug of extractInternalPostSlugs(post.richContent)) {
      if (targetSlug === sourceSlug) {
        selfLinkOccurrences += 1;
        continue;
      }
      const pair = sourceSlug + '\u0000' + targetSlug;
      allPairs.add(pair);
      if (!bySlug.has(targetSlug)) continue;
      publishedTargetPairs.add(pair);
      inboundSources.get(targetSlug).add(sourceSlug);
    }
  }

  const zeroInboundSlugs = [...bySlug.keys()]
    .filter((slug) => inboundSources.get(slug).size === 0)
    .sort();
  const expectedSlugs = OFFICIAL_POSTS.map((post) => post.slug).sort();
  const officialPosts = OFFICIAL_POSTS.map((expected) => {
    const current = bySlug.get(expected.slug);
    const inboundUniqueSources = current ? inboundSources.get(expected.slug).size : null;
    return {
      slug: expected.slug,
      title: expected.title,
      published: Boolean(current),
      titleMatches: current?.title === expected.title,
      inboundUniqueSources,
    };
  });
  const localPayloadMatches = JSON.stringify(localPayload) === JSON.stringify(OFFICIAL_POSTS.map((post) => ({
    ...post,
    url: SITE_ORIGIN + '/post/' + post.slug,
  })));
  const failures = officialPosts.filter((post) => !post.published || !post.titleMatches || post.inboundUniqueSources !== 0);
  if (!localPayloadMatches) failures.push({ reason: 'Local related-history-posts.js does not match the official verified payload.' });

  return {
    status: failures.length ? 'FAIL' : 'PASS',
    checkedAt: new Date().toISOString(),
    method: 'Published draft-post references; GET each published post with RICH_CONTENT; recurse only linkData.link and buttonData.link; normalize first-party /post/<slug>; decode; exclude self-links; inbound only from published sources to published targets.',
    publishedPosts: posts.length,
    uniqueNormalizedFirstPartyPairs: allPairs.size,
    uniquePairsWithPublishedTarget: publishedTargetPairs.size,
    selfLinkOccurrences,
    zeroInboundPosts: zeroInboundSlugs.length,
    zeroInboundSlugListSha256: sha256(JSON.stringify(zeroInboundSlugs)),
    officialScopeSlugListSha256: sha256(JSON.stringify(expectedSlugs)),
    localPayloadMatches,
    officialPosts,
    failures,
  };
}

async function main() {
  if (process.argv.includes('--help')) {
    console.log('Usage: source ../../../scripts/load-api-keys.sh && node scripts/check-history-story-related-links.mjs');
    return;
  }
  requireWixKey();
  const references = await queryPublishedReferences();
  const posts = await mapWithConcurrency(references, readPublishedPost);
  const localPayload = await readLocalPayload();
  const report = buildReport(posts, localPayload);
  console.log(JSON.stringify(report, null, 2));
  if (report.status !== 'PASS') process.exitCode = 1;
}

main().catch((error) => {
  console.error(error?.stack || error?.message || error);
  process.exitCode = 1;
});
