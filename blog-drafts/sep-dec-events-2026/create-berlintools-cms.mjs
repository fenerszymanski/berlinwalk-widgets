#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import {
  API_ROOT,
  BATCH_SLUG,
  ROOT,
  SITE_ID,
  WIDGET_ROOT,
  assert,
  assertSupportEntries,
  batchReportPath,
  iconPlanFor,
  loadImageManifest,
  parseArgs,
  readBatchMetadata,
  readBody,
  readJson,
  resolveInputPath,
  sha256,
  toolsHubRecords,
  writeJson,
} from './wix-batch-common.mjs';

const COLLECTION = 'BerlinTools';
const RELATED_BLOG_FIELDS = ['relatedBlogTitle', 'relatedBlogPath', 'relatedBlogUrl', 'relatedBlogDescription'];
const USAGE = `Usage:
  node blog-drafts/${BATCH_SLUG}/create-berlintools-cms.mjs --image-manifest <path> --cms-manifest <path>
  node blog-drafts/${BATCH_SLUG}/create-berlintools-cms.mjs --image-manifest <path> --cms-manifest <path> --apply --run-id <run-id>

The first command is a local-only dry run. --apply is the only mode that calls Wix.
It inserts one new BerlinTools record per exact tool slug and leaves all relatedBlog* fields blank.`;

function assertUrl(value, label) {
  assert(typeof value === 'string' && value, `${label} must be a non-empty URL`);
  let parsed;
  try { parsed = new URL(value); } catch { throw new Error(`${label} must be a valid URL`); }
  assert(parsed.protocol === 'https:', `${label} must use https`);
}

function asToolMap(rawTools) {
  assert(rawTools && typeof rawTools === 'object', 'CMS manifest tools must be an object or an array');
  if (!Array.isArray(rawTools)) return new Map(Object.entries(rawTools));
  const map = new Map();
  for (const entry of rawTools) {
    assert(entry && typeof entry.slug === 'string' && entry.slug, 'CMS manifest tools array entries need a slug');
    assert(!map.has(entry.slug), `CMS manifest has duplicate tool plan: ${entry.slug}`);
    map.set(entry.slug, entry);
  }
  return map;
}

function loadCmsManifest(inputPath) {
  const manifest = readJson(inputPath, 'BerlinTools CMS manifest');
  assert(manifest.batch === BATCH_SLUG, `BerlinTools CMS manifest must identify ${BATCH_SLUG}`);
  return { manifest, toolPlans: asToolMap(manifest.tools) };
}

function validateToolPlan(post, plan) {
  assert(plan && typeof plan === 'object' && !Array.isArray(plan), `CMS manifest has no plan for ${post.toolSlug}`);
  for (const key of ['title', 'h1', 'lead', 'secondary', 'intro', 'seoTitle', 'seoDescription']) {
    assert(typeof plan[key] === 'string' && plan[key].trim(), `${post.toolSlug} CMS ${key} is required`);
  }
  assert(Array.isArray(plan.sections) && plan.sections.length >= 3, `${post.toolSlug} CMS needs at least three body sections`);
  const sections = plan.sections.map((section, index) => {
    const title = Array.isArray(section) ? section[0] : section?.title;
    const body = Array.isArray(section) ? section[1] : section?.body;
    assert(typeof title === 'string' && title.trim(), `${post.toolSlug} CMS section ${index + 1} needs a title`);
    assert(typeof body === 'string' && body.trim(), `${post.toolSlug} CMS section ${index + 1} needs body text`);
    return [title.trim(), body.trim()];
  });
  assert(Array.isArray(plan.relatedTools) && plan.relatedTools.length === 2, `${post.toolSlug} CMS needs exactly two related tools`);
  const relatedTools = plan.relatedTools.map((related, index) => {
    assert(related && typeof related === 'object', `${post.toolSlug} related tool ${index + 1} must be an object`);
    for (const key of ['slug', 'title', 'url']) assert(typeof related[key] === 'string' && related[key].trim(), `${post.toolSlug} related tool ${index + 1} ${key} is required`);
    assert(related.slug !== post.toolSlug, `${post.toolSlug} may not name itself as a related tool`);
    assertUrl(related.url, `${post.toolSlug} related tool ${index + 1} url`);
    assert(related.url === `https://www.berlinwalk.com/tools/${related.slug}`, `${post.toolSlug} related tool ${index + 1} URL must exactly match its slug`);
    return { slug: related.slug.trim(), title: related.title.trim(), url: related.url.trim() };
  });
  assert(new Set(relatedTools.map((related) => related.slug)).size === 2, `${post.toolSlug} related tools must be distinct`);
  for (const field of RELATED_BLOG_FIELDS) assert(plan[field] === undefined || plan[field] === null || plan[field] === '', `${post.toolSlug} ${field} must remain blank until the matching Blog post is published`);
  return {
    title: plan.title.trim(),
    h1: plan.h1.trim(),
    lead: plan.lead.trim(),
    secondary: plan.secondary.trim(),
    intro: plan.intro.trim(),
    seoTitle: plan.seoTitle.trim(),
    seoDescription: plan.seoDescription.trim(),
    sections,
    relatedTools,
  };
}

function bridgeChecks(post) {
  const body = readBody(post);
  assert(fs.existsSync(path.join(ROOT, post.toolSlug, 'index.html')), `${post.toolSlug} widget index.html is missing`);
  for (const token of ['{{quick-summary}}', `{{widget:${post.toolSlug}}}`, '{{faq}}']) {
    const count = body.split(token).length - 1;
    assert(count === 1, `${post.slug} must contain ${token} exactly once before its CMS tool can be created`);
  }
  assert(!/^#\s+/m.test(body), `${post.slug} contains a forbidden Markdown H1`);
  assertSupportEntries(post);
}

function validateToolHub(post, plan, icon) {
  const record = toolsHubRecords().find((item) => item.slug === post.toolSlug);
  assert(record, `tools-hub data has no record for ${post.toolSlug}`);
  const expectedWidgetUrl = `${WIDGET_ROOT}/${post.toolSlug}/`;
  assert(record.title === plan.title, `${post.toolSlug} tools-hub title must match the CMS manifest`);
  assert(record.lead === plan.lead, `${post.toolSlug} tools-hub lead must match the CMS manifest`);
  assert(record.widgetUrl === expectedWidgetUrl, `${post.toolSlug} tools-hub widgetUrl must be ${expectedWidgetUrl}`);
  assert(record.image === icon.wixMedia.url, `${post.toolSlug} tools-hub image must use the exact uploaded Wix icon URL`);
  assert(Number.isInteger(Number(record.embedHeight)) && Number(record.embedHeight) >= 120, `${post.toolSlug} tools-hub needs a numeric embedHeight`);
  return record;
}

let nextId = 0;
function textNode(text) {
  return { type: 'TEXT', id: `text_${++nextId}`, nodes: [], textData: { decorations: [], text } };
}
function heading(text) {
  return { type: 'HEADING', id: `heading_${++nextId}`, nodes: [textNode(text)], headingData: { level: 3, textStyle: { textAlignment: 'AUTO' } } };
}
function paragraph(text) {
  return { type: 'PARAGRAPH', id: `paragraph_${++nextId}`, nodes: [textNode(text)], paragraphData: { indentation: 0, textStyle: { lineHeight: '1.7', textAlignment: 'AUTO' } } };
}
function richBody(sections) {
  nextId = 0;
  const nodes = [];
  for (const [title, body] of sections) nodes.push(heading(title), paragraph(body));
  const now = new Date().toISOString();
  return { documentStyle: {}, metadata: { version: 1, createdTimestamp: now, updatedTimestamp: now }, nodes };
}

function buildJsonLd(slug, plan) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: plan.title,
    description: plan.lead,
    url: `https://www.berlinwalk.com/tools/${slug}`,
    applicationCategory: 'TravelApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  });
}

function desiredData(post, plan, icon) {
  const [relatedOne, relatedTwo] = plan.relatedTools;
  return {
    slug: post.toolSlug,
    title: plan.title,
    h1: plan.h1,
    lead: plan.lead,
    secondary: plan.secondary,
    intro: plan.intro,
    seoTitle: plan.seoTitle,
    seoDescription: plan.seoDescription,
    jsonLd: buildJsonLd(post.toolSlug, plan),
    widgetUrl: `${WIDGET_ROOT}/${post.toolSlug}/`,
    secondaryWidgetUrl: '',
    iconUrl: icon.wixMedia.url,
    seoImage: icon.wixMedia.url,
    bodyContent: richBody(plan.sections),
    'link-berlin-tools-title': `/tools/${post.toolSlug}`,
    relatedTool1Slug: relatedOne.slug,
    relatedTool1Title: relatedOne.title,
    relatedTool1Url: relatedOne.url,
    relatedTool2Slug: relatedTwo.slug,
    relatedTool2Title: relatedTwo.title,
    relatedTool2Url: relatedTwo.url,
    relatedBlogTitle: '',
    relatedBlogPath: '',
    relatedBlogUrl: '',
    relatedBlogDescription: '',
  };
}

function prepareTools() {
  const args = parseArgs(process.argv.slice(2));
  const imageManifestPath = resolveInputPath(args.value('--image-manifest'), '--image-manifest');
  const cmsManifestPath = resolveInputPath(args.value('--cms-manifest'), '--cms-manifest');
  const metadata = readBatchMetadata();
  const imageManifest = loadImageManifest(imageManifestPath);
  const cmsManifest = loadCmsManifest(cmsManifestPath);
  const prepared = metadata.posts.map((post) => {
    bridgeChecks(post);
    const plan = validateToolPlan(post, cmsManifest.toolPlans.get(post.toolSlug));
    const icon = iconPlanFor(imageManifest, post.toolSlug);
    const hubRecord = validateToolHub(post, plan, icon);
    return { post, plan, icon, hubRecord, desired: desiredData(post, plan, icon) };
  });
  return { args, prepared };
}

function headers(extra = {}) {
  assert(process.env.WIX_API_KEY, 'WIX_API_KEY is not loaded. Source scripts/load-api-keys.sh only for an explicit --apply run.');
  return { Authorization: process.env.WIX_API_KEY, 'wix-site-id': SITE_ID, 'Content-Type': 'application/json', ...extra };
}

async function wixFetch(pathname, options = {}) {
  const response = await fetch(`${API_ROOT}${pathname}`, {
    method: options.method || 'GET',
    headers: headers(options.headers || {}),
    body: options.body ? JSON.stringify(options.body) : undefined,
    signal: AbortSignal.timeout(30000),
  });
  const raw = await response.text();
  let body = {};
  try { body = raw ? JSON.parse(raw) : {}; } catch { body = { raw: raw.slice(0, 1000) }; }
  if (!response.ok) throw new Error(`Wix ${options.method || 'GET'} ${pathname} HTTP ${response.status}: ${JSON.stringify(body).slice(0, 1000)}`);
  return body;
}

async function queryExact(slug) {
  const response = await wixFetch('/wix-data/v2/items/query', {
    method: 'POST',
    body: { dataCollectionId: COLLECTION, query: { filter: { slug }, paging: { limit: 2 } } },
  });
  return response.dataItems || [];
}

async function assertNoCmsCollisions(prepared) {
  const targets = new Set(prepared.map((item) => item.post.toolSlug));
  const hits = [];
  for (let offset = 0; offset < 5000; offset += 100) {
    const response = await wixFetch('/wix-data/v2/items/query', {
      method: 'POST',
      body: { dataCollectionId: COLLECTION, query: { paging: { limit: 100, offset } } },
    });
    const page = response.dataItems || [];
    hits.push(...page.filter((item) => targets.has(item.data?.slug)));
    if (page.length < 100) break;
  }
  assert(!hits.length, `Exact BerlinTools collision guard blocked this batch: ${hits.map((item) => `${item.id}:${item.data?.slug}`).join(', ')}`);
}

function verifyCmsItem(item, expected) {
  const data = item.data || {};
  for (const key of [
    'slug', 'title', 'h1', 'lead', 'secondary', 'intro', 'seoTitle', 'seoDescription', 'jsonLd', 'widgetUrl',
    'secondaryWidgetUrl', 'iconUrl', 'seoImage', 'link-berlin-tools-title',
    'relatedTool1Slug', 'relatedTool1Title', 'relatedTool1Url', 'relatedTool2Slug', 'relatedTool2Title', 'relatedTool2Url',
    ...RELATED_BLOG_FIELDS,
  ]) assert(data[key] === expected[key], `${expected.slug} CMS readback mismatch: ${key}`);
  assert(data.bodyContent?.nodes?.length === expected.bodyContent.nodes.length, `${expected.slug} CMS bodyContent readback mismatch`);
  assert(RELATED_BLOG_FIELDS.every((field) => data[field] === ''), `${expected.slug} relatedBlog fields are not blank`);
  return {
    cmsItemId: item.id,
    slug: data.slug,
    title: data.title,
    h1: data.h1,
    widgetUrl: data.widgetUrl,
    iconUrl: data.iconUrl,
    relatedBlogFieldsBlank: true,
    bodyContentSha256: sha256(data.bodyContent),
    jsonLdSha256: sha256(data.jsonLd),
  };
}

function dryRunReport(item) {
  return {
    slug: item.post.toolSlug,
    title: item.plan.title,
    widgetUrl: item.desired.widgetUrl,
    iconPath: item.icon.path,
    wixIconUrl: item.icon.wixMedia.url,
    bodySections: item.plan.sections.length,
    relatedTools: item.plan.relatedTools.map((tool) => tool.slug),
    relatedBlogFields: 'blank-before-post-publication',
    cmsDataSha256: sha256(item.desired),
  };
}

async function main() {
  const earlyArgs = parseArgs(process.argv.slice(2));
  if (earlyArgs.has('--help')) {
    console.log(USAGE);
    return;
  }
  const { args, prepared } = prepareTools();
  assert(args.value('--apply') === undefined, '--apply is a bare confirmation flag and does not accept a value');
  const apply = args.has('--apply');
  const runId = apply ? args.value('--run-id') : null;
  if (apply) assert(runId, '--run-id is required with --apply');
  if (!apply) {
    console.log(JSON.stringify({
      mode: 'DRY_RUN_LOCAL_ONLY',
      batch: BATCH_SLUG,
      wixCalls: 0,
      relatedBlogPolicy: 'blank until the matching Blog post is published',
      tools: prepared.map(dryRunReport),
    }, null, 2));
    return;
  }

  const statePath = batchReportPath(runId, 'cms-state.json');
  const readbackPath = batchReportPath(runId, 'cms-readback.json');
  await assertNoCmsCollisions(prepared);
  const state = [];
  for (const item of prepared) {
    // This exact-slug query is intentionally repeated immediately before every insert.
    const before = await queryExact(item.post.toolSlug);
    assert(!before.length, `${item.post.toolSlug} collision appeared after batch preflight: ${before.map((entry) => entry.id).join(', ')}`);
    const created = await wixFetch('/wix-data/v2/items', {
      method: 'POST',
      body: { dataCollectionId: COLLECTION, dataItem: { data: item.desired } },
    });
    const createdItem = created.dataItem || created;
    const itemId = createdItem.id || createdItem.data?._id;
    assert(itemId, `${item.post.toolSlug} CMS create response did not contain an item ID`);
    state.push({ slug: item.post.toolSlug, cmsItemId: itemId, createdAt: new Date().toISOString() });
    writeJson(statePath, { runId, batch: BATCH_SLUG, status: 'CREATED_UNVERIFIED', tools: state });
  }

  const readback = [];
  for (const item of prepared) {
    const matches = await queryExact(item.post.toolSlug);
    assert(matches.length === 1, `${item.post.toolSlug} CMS readback must return exactly one item, got ${matches.length}`);
    readback.push(verifyCmsItem(matches[0], item.desired));
  }
  writeJson(readbackPath, { runId, batch: BATCH_SLUG, checkedAt: new Date().toISOString(), relatedBlogPolicy: 'blank until post publication', tools: readback });
  console.log(JSON.stringify({ mode: 'CREATED', runId, batch: BATCH_SLUG, tools: readback }, null, 2));
}

main().catch((error) => {
  console.error(`ERROR: ${error.stack || error.message}`);
  process.exit(1);
});
