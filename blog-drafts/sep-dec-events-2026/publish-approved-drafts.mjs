#!/usr/bin/env node

// Guarded publisher for the eleven Sep–Dec 2026 event drafts. It is deliberately
// read-only by default. The one explicit flag below records the approved batch,
// creates one journalled Wix publish attempt per exact draft, and leaves any
// unproven publication for GET-only recovery instead of retrying a POST.

import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  canonicalSha256,
  draftProtectedView,
  publishDailyBlogOnce,
} from '../../scripts/publish-daily-blog-once.mjs';

const BATCH_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(BATCH_DIR, '../..');
const SITE_ID = '12ee5ea0-70a7-492f-8020-ffb27cbb630f';
const API_ROOT = 'https://www.wixapis.com';
const PAGES_ROOT = 'https://fenerszymanski.github.io/berlinwalk-widgets';
const BLOG_ROOT = 'https://www.berlinwalk.com';
const TOOL_COLLECTION = 'BerlinTools';
const PUBLISH_FLAG = '--publish-approved-by-yusuf';
const OUTPUT_ROOT = path.join(ROOT, 'output', 'qa', 'sep-dec-events-2026', 'sep-dec-events-20260822-publish');
const DRAFT_BASELINE_PATH = path.join(ROOT, 'output', 'qa', 'sep-dec-events-2026', 'sep-dec-events-20260822-drafts', 'wix', 'draft-readback.json');
const CMS_BASELINE_PATH = path.join(ROOT, 'output', 'qa', 'sep-dec-events-2026', 'sep-dec-events-20260822-cms', 'wix', 'cms-readback.json');
const METADATA_PATH = path.join(BATCH_DIR, 'batch-post-metadata.json');
const RELATED_BLOG_FIELDS = ['relatedBlogTitle', 'relatedBlogPath', 'relatedBlogUrl', 'relatedBlogDescription'];
const LEAK_PATTERN = /(?:Sources to Recheck Before Publishing|Sources and Notes|Research Notes|Widget Plan|Status:|Slug idea:|Meta title:|Meta description:|AI-generated|ChatGPT|logged-in|No paid image API|source prompt|visual-sources\.md|Codex|Claude)/i;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function rawSha(value) {
  return createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
  fs.renameSync(temporary, filePath);
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function nowRunId() {
  return `publish-${new Date().toISOString().replace(/[:.]/g, '-').replace(/Z$/, 'Z')}`;
}

function parseArgs(argv) {
  const args = { publish: false, finishPublished: false, runId: null };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === PUBLISH_FLAG) args.publish = true;
    else if (arg === '--finish-published') args.finishPublished = true;
    else if (arg === '--run-id') {
      const value = argv[index + 1];
      assert(value && !value.startsWith('--'), '--run-id needs a value');
      assert(/^[A-Za-z0-9._-]+$/.test(value), '--run-id may use only letters, numbers, dot, underscore, and dash');
      args.runId = value;
      index += 1;
    } else if (arg === '--help' || arg === '-h') {
      console.log(`Usage:\n  node blog-drafts/sep-dec-events-2026/publish-approved-drafts.mjs\n  node blog-drafts/sep-dec-events-2026/publish-approved-drafts.mjs ${PUBLISH_FLAG} [--run-id <run-id>]\n  node blog-drafts/sep-dec-events-2026/publish-approved-drafts.mjs --finish-published --run-id <run-id>`);
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  assert(!(args.publish && args.finishPublished), `${PUBLISH_FLAG} and --finish-published cannot be combined`);
  if (args.finishPublished) assert(args.runId, '--finish-published requires the original --run-id');
  return args;
}

function headers() {
  assert(process.env.WIX_API_KEY, 'WIX_API_KEY is not loaded. Source scripts/load-api-keys.sh first.');
  return {
    Authorization: process.env.WIX_API_KEY,
    'wix-site-id': SITE_ID,
    'Content-Type': 'application/json',
  };
}

async function wixRequest(pathname, options = {}) {
  const response = await fetch(`${API_ROOT}${pathname}`, {
    method: options.method || 'GET',
    headers: headers(),
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: AbortSignal.timeout(30_000),
  });
  const raw = await response.text();
  let body = {};
  try { body = raw ? JSON.parse(raw) : {}; } catch { body = { raw: raw.slice(0, 1_000) }; }
  return { response, body };
}

async function wixFetch(pathname, options = {}) {
  const result = await wixRequest(pathname, options);
  if (!result.response.ok) {
    throw new Error(`Wix ${options.method || 'GET'} ${pathname}: HTTP ${result.response.status} ${JSON.stringify(result.body).slice(0, 700)}`);
  }
  return result.body;
}

async function readDraft(id) {
  const body = await wixFetch(`/blog/v3/draft-posts/${encodeURIComponent(id)}?fieldsets=RICH_CONTENT`);
  return body.draftPost || body;
}

async function readPublishedMaybe(id) {
  const result = await wixRequest(`/blog/v3/posts/${encodeURIComponent(id)}?fieldsets=RICH_CONTENT`);
  if (result.response.status === 404) return null;
  if (!result.response.ok) throw new Error(`Wix published GET ${id}: HTTP ${result.response.status}`);
  return result.body.post || result.body;
}

async function queryCms(toolSlug) {
  const body = await wixFetch('/wix-data/v2/items/query', {
    method: 'POST',
    body: {
      dataCollectionId: TOOL_COLLECTION,
      consistentRead: true,
      query: { filter: { slug: toolSlug }, paging: { limit: 2 } },
    },
  });
  return body.dataItems || [];
}

function nodeText(node) {
  const fragments = [];
  const visit = (value) => {
    if (!value || typeof value !== 'object') return;
    if (value.type === 'TEXT' && value.textData?.text) fragments.push(value.textData.text);
    for (const child of value.nodes || []) visit(child);
  };
  visit(node);
  return fragments.join(' ').replace(/\s+/g, ' ').trim();
}

function captionCount(nodes) {
  return nodes.filter((node) => {
    const style = node.paragraphData?.textStyle || {};
    const decorations = node.nodes?.flatMap((child) => child.textData?.decorations || []) || [];
    return node.type === 'PARAGRAPH'
      && style.textAlignment === 'CENTER'
      && String(style.lineHeight) === '1.45'
      && decorations.some((item) => item.type === 'ITALIC')
      && decorations.some((item) => item.type === 'FONT_SIZE' && Number(item.fontSizeData?.value) === 12);
  }).length;
}

function draftFacts(draft) {
  const nodes = draft.richContent?.nodes || [];
  const plainText = nodes.map(nodeText).join(' ').replace(/\s+/g, ' ').trim();
  return {
    id: draft.id,
    title: draft.title,
    slug: draft.seoSlug || draft.slug || '',
    status: draft.status,
    hasUnpublishedChanges: draft.hasUnpublishedChanges,
    images: nodes.filter((node) => node.type === 'IMAGE').length,
    captions: captionCount(nodes),
    embeds: nodes.filter((node) => node.type === 'HTML').map((node) => node.htmlData?.url || ''),
    h1: nodes.filter((node) => node.type === 'HEADING' && Number(node.headingData?.level) === 1).length,
    nativeImageCredits: nodes.filter((node) => node.type === 'COLLAPSIBLE_LIST' && /Image credits/i.test(nodeText(node))).length,
    seoTags: draft.seoData?.tags?.length || 0,
    richContentSha256: rawSha(draft.richContent || {}),
    seoDataSha256: rawSha(draft.seoData || {}),
    protectedFieldsSha256: canonicalSha256(draftProtectedView(draft)),
    plainText,
  };
}

function sameMembers(first = [], second = []) {
  return JSON.stringify([...first].sort()) === JSON.stringify([...second].sort());
}

function relationFor(post, publicUrl) {
  return {
    relatedBlogTitle: post.title,
    relatedBlogPath: `/post/${post.slug}`,
    relatedBlogUrl: publicUrl,
    relatedBlogDescription: post.excerpt,
  };
}

function relationState(data, expected) {
  const values = Object.fromEntries(RELATED_BLOG_FIELDS.map((field) => [field, data?.[field] ?? '']));
  if (RELATED_BLOG_FIELDS.every((field) => values[field] === '')) return 'BLANK';
  if (RELATED_BLOG_FIELDS.every((field) => values[field] === expected[field])) return 'CORRECT';
  return 'UNEXPECTED';
}

function stableCmsHash(data) {
  const copy = { ...(data || {}) };
  // Wix returns system metadata inside `data`; a target-only PATCH necessarily
  // advances `_updatedDate`, which is not a user-content mutation.
  delete copy._updatedDate;
  for (const field of RELATED_BLOG_FIELDS) delete copy[field];
  return canonicalSha256(copy);
}

async function fetchText(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
        signal: AbortSignal.timeout(30_000),
      });
      const body = await response.text();
      return { response, body };
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await sleep(500 * attempt);
    }
  }
  throw lastError;
}

function htmlAttribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'));
  return match?.[2] || '';
}

function canonicalFromHtml(html) {
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = match[0];
    if (/\brel\s*=\s*(["'])canonical\1/i.test(tag)) return htmlAttribute(tag, 'href');
  }
  return '';
}

function robotsFromHtml(html) {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = match[0];
    if (htmlAttribute(tag, 'name').toLowerCase() === 'robots') return htmlAttribute(tag, 'content');
  }
  return '';
}

async function verifyPublicPost(post, attempts = 45) {
  const expectedUrl = `${BLOG_ROOT}/post/${post.slug}`;
  let lastProblem = 'not checked';
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const { response, body } = await fetchText(`${expectedUrl}?publish-readback=${Date.now()}`);
      const canonical = canonicalFromHtml(body);
      const robots = robotsFromHtml(body).toLowerCase();
      const expectedWidget = `${PAGES_ROOT}/${post.toolSlug}/`;
      const problems = [];
      if (!response.ok) problems.push(`HTTP ${response.status}`);
      if (new URL(response.url).pathname.replace(/\/$/, '') !== `/post/${post.slug}`) problems.push('final-url');
      if (canonical !== expectedUrl) problems.push(`canonical=${canonical || 'missing'}`);
      if (!robots.includes('index') || !robots.includes('follow') || !robots.includes('max-image-preview:large')) problems.push('robots');
      if (!/property\s*=\s*["']og:image["']/i.test(body)) problems.push('og:image');
      if (!/BlogPosting/.test(body) || !/FAQPage/.test(body)) problems.push('schema');
      if (!body.includes(expectedWidget)) problems.push('widget');
      // The exact Ricos body is checked through the API before publishing and
      // hash-locked by the journal afterwards. The full Wix HTML also contains
      // unrelated global JavaScript string literals such as "Status:", so it
      // is not a valid article-body leak surface.
      if (!problems.length) {
        return {
          checkedAt: new Date().toISOString(),
          attempts: attempt,
          publicUrl: expectedUrl,
          canonical,
          robots,
          widgetUrl: expectedWidget,
        };
      }
      lastProblem = problems.join(', ');
    } catch (error) {
      lastProblem = String(error.message || error);
    }
    if (attempt < attempts) await sleep(2_000);
  }
  throw new Error(`${post.slug}: public post verification did not pass (${lastProblem})`);
}

function loadPlan() {
  const metadata = readJson(METADATA_PATH);
  const draftBaseline = readJson(DRAFT_BASELINE_PATH);
  const cmsBaseline = readJson(CMS_BASELINE_PATH);
  assert(metadata.batch === 'sep-dec-events-2026' && metadata.posts?.length === 11, 'Batch metadata must contain exactly 11 posts');
  assert(draftBaseline.batch === 'sep-dec-events-2026' && draftBaseline.drafts?.length === 11, 'Draft baseline must contain exactly 11 drafts');
  assert(cmsBaseline.batch === 'sep-dec-events-2026' && cmsBaseline.tools?.length === 11, 'CMS baseline must contain exactly 11 tools');

  const baselineBySlug = new Map(draftBaseline.drafts.map((draft) => [draft.slug, draft]));
  const cmsByTool = new Map(cmsBaseline.tools.map((tool) => [tool.slug, tool]));
  const seenIds = new Set();
  const plans = metadata.posts.map((post) => {
    const draft = baselineBySlug.get(post.slug);
    const cms = cmsByTool.get(post.toolSlug);
    assert(draft, `${post.slug}: missing draft baseline`);
    assert(cms, `${post.slug}: missing CMS baseline for ${post.toolSlug}`);
    assert(draft.title === post.title, `${post.slug}: baseline title does not match metadata`);
    assert(!seenIds.has(draft.draftId), `${post.slug}: duplicate draft ID in baseline`);
    seenIds.add(draft.draftId);
    return { post, draft, cms };
  });
  assert(plans.length === 11 && new Set(plans.map((plan) => plan.post.toolSlug)).size === 11, 'Plan identities are not one-to-one');
  return plans;
}

async function preflightPlan(plan, { requirePublished = false } = {}) {
  const [draft, published, cmsRows, widget, toolPage] = await Promise.all([
    readDraft(plan.draft.draftId),
    readPublishedMaybe(plan.draft.draftId),
    queryCms(plan.post.toolSlug),
    fetchText(`${PAGES_ROOT}/${plan.post.toolSlug}/?publish-preflight=${Date.now()}`),
    fetchText(`${BLOG_ROOT}/tools/${plan.post.toolSlug}?publish-preflight=${Date.now()}`),
  ]);
  const facts = draftFacts(draft);
  const expected = plan.draft;
  const problems = [];
  if (facts.id !== expected.draftId || facts.title !== expected.title || facts.slug !== expected.slug) problems.push('draft identity');
  if (requirePublished) {
    if (facts.status !== 'PUBLISHED' || facts.hasUnpublishedChanges !== false) problems.push(`published draft state ${facts.status}/${facts.hasUnpublishedChanges}`);
    if (!published || published.id !== expected.draftId || published.title !== expected.title || published.slug !== expected.slug || rawSha(published.richContent || {}) !== expected.richContentSha256) problems.push('published pair');
  } else {
    if (facts.status !== 'UNPUBLISHED' || facts.hasUnpublishedChanges !== true) problems.push(`draft state ${facts.status}/${facts.hasUnpublishedChanges}`);
    if (published) problems.push('published collision');
  }
  if (facts.images !== expected.images || facts.captions !== expected.captions || facts.h1 !== 0 || facts.nativeImageCredits !== expected.nativeImageCredits || facts.seoTags !== expected.seoTags) problems.push('draft structure');
  if (!sameMembers(facts.embeds, expected.embeds)) problems.push('draft embeds');
  if (facts.richContentSha256 !== expected.richContentSha256 || facts.seoDataSha256 !== expected.seoDataSha256) problems.push('draft hash drift');
  if (LEAK_PATTERN.test(facts.plainText) || /\b(?:we|our|us)\b/i.test(facts.plainText) || /—|\brather than\b/i.test(facts.plainText)) problems.push('public language gate');
  if (cmsRows.length !== 1 || cmsRows[0].id !== plan.cms.cmsItemId) problems.push('CMS identity');
  const cmsData = cmsRows[0]?.data || {};
  if (cmsData.slug !== plan.post.toolSlug || cmsData.title !== plan.cms.title || cmsData.widgetUrl !== `${PAGES_ROOT}/${plan.post.toolSlug}/` || cmsData.iconUrl !== plan.cms.iconUrl) problems.push('CMS data');
  if (rawSha(cmsData.bodyContent) !== plan.cms.bodyContentSha256 || rawSha(cmsData.jsonLd) !== plan.cms.jsonLdSha256) problems.push('CMS hash drift');
  const relationExpected = requirePublished && published
    ? relationFor({ ...plan.post, title: published.title, excerpt: published.excerpt }, `${BLOG_ROOT}/post/${plan.post.slug}`)
    : relationFor({ ...plan.post, excerpt: plan.post.description }, `${BLOG_ROOT}/post/${plan.post.slug}`);
  const currentRelation = relationState(cmsData, relationExpected);
  if ((!requirePublished && currentRelation !== 'BLANK') || (requirePublished && !['BLANK', 'CORRECT'].includes(currentRelation))) problems.push('CMS relatedBlog state');
  if (!widget.response.ok || /Page Not Found|Error 404/i.test(widget.body) || !/<html\b/i.test(widget.body)) problems.push('widget asset');
  if (!toolPage.response.ok || new URL(toolPage.response.url).pathname.replace(/\/$/, '') !== `/tools/${plan.post.toolSlug}` || /Page Not Found|Error 404/i.test(toolPage.body) || !toolPage.body.includes(plan.cms.title)) problems.push('tool page');
  if (problems.length) throw new Error(`${plan.post.slug}: preflight blocked (${problems.join(', ')})`);
  return { plan, draft, facts, cmsData, cmsStableHash: stableCmsHash(cmsData) };
}

function writePostManifest(runDir, preflight, packageCommit) {
  const { plan, facts } = preflight;
  const identity = {
    runId: path.basename(runDir),
    draftId: plan.draft.draftId,
    postSlug: plan.post.slug,
    toolSlug: plan.post.toolSlug,
    packageCommit,
    siteId: SITE_ID,
    title: plan.post.title,
  };
  const expectedDraft = {
    title: plan.post.title,
    hashAlgorithm: 'canonical-json-sha256-v1',
    richContentSha256: canonicalSha256(preflight.draft.richContent),
    seoDataSha256: canonicalSha256(preflight.draft.seoData),
    protectedFieldsSha256: facts.protectedFieldsSha256,
    publishManagedSlugs: Array.isArray(preflight.draft.slugs) ? preflight.draft.slugs : [],
  };
  writeJson(path.join(runDir, 'run-manifest.json'), {
    ...identity,
    identity,
    wix: { siteId: SITE_ID, publishEndpoint: `/blog/v3/draft-posts/${plan.draft.draftId}/publish` },
  });
  writeJson(path.join(runDir, 'prepublish-check.json'), {
    decision: 'PASS',
    identity: { runId: identity.runId, draftId: identity.draftId, postSlug: identity.postSlug },
    expectedDraft,
  });
  return identity;
}

async function bindCms(preflight, publicProof) {
  const { plan, cmsStableHash } = preflight;
  const rowsBefore = await queryCms(plan.post.toolSlug);
  assert(rowsBefore.length === 1 && rowsBefore[0].id === plan.cms.cmsItemId, `${plan.post.slug}: CMS identity drift before binding`);
  const beforeData = rowsBefore[0].data || {};
  assert(beforeData._id === plan.cms.cmsItemId && beforeData._createdDate, `${plan.post.slug}: CMS system identity drift before binding`);
  assert(stableCmsHash(beforeData) === cmsStableHash, `${plan.post.slug}: non-target CMS data changed before binding`);
  const published = await readPublishedMaybe(plan.draft.draftId);
  assert(published?.id === plan.draft.draftId && published.slug === plan.post.slug, `${plan.post.slug}: published identity is not verified before CMS binding`);
  assert(typeof published.excerpt === 'string' && published.excerpt.trim(), `${plan.post.slug}: published excerpt is missing`);
  const expected = relationFor({ ...plan.post, title: published.title, excerpt: published.excerpt }, publicProof.publicUrl);
  const currentRelation = relationState(beforeData, expected);
  assert(currentRelation !== 'UNEXPECTED', `${plan.post.slug}: CMS relatedBlog contains unexpected data`);
  if (currentRelation === 'BLANK') {
    await wixFetch(`/wix-data/v2/items/${encodeURIComponent(plan.cms.cmsItemId)}`, {
      method: 'PATCH',
      body: {
        dataCollectionId: TOOL_COLLECTION,
        patch: {
          dataItemId: plan.cms.cmsItemId,
          fieldModifications: RELATED_BLOG_FIELDS.map((field) => ({
            fieldPath: field,
            action: 'SET_FIELD',
            setFieldOptions: { value: expected[field] },
          })),
        },
      },
    });
  }
  const rowsAfter = await queryCms(plan.post.toolSlug);
  assert(rowsAfter.length === 1 && rowsAfter[0].id === plan.cms.cmsItemId, `${plan.post.slug}: CMS readback identity mismatch`);
  const afterData = rowsAfter[0].data || {};
  assert(afterData._id === beforeData._id && canonicalSha256(afterData._createdDate) === canonicalSha256(beforeData._createdDate), `${plan.post.slug}: CMS system identity changed`);
  assert(stableCmsHash(afterData) === cmsStableHash, `${plan.post.slug}: CMS PATCH changed non-target data`);
  assert(relationState(afterData, expected) === 'CORRECT', `${plan.post.slug}: CMS relatedBlog readback mismatch`);
  return { cmsItemId: plan.cms.cmsItemId, slug: plan.post.toolSlug, ...expected, patched: currentRelation === 'BLANK' };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const runId = args.runId || nowRunId();
  const runDir = path.join(OUTPUT_ROOT, runId);
  const packageCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim();
  const plans = loadPlan();
  const preflight = [];

  for (const plan of plans) {
    const checked = await preflightPlan(plan, { requirePublished: args.finishPublished });
    preflight.push(checked);
    console.log(`${plan.post.slug}: PREFLIGHT PASS`);
  }

  const preflightReport = {
    checkedAt: new Date().toISOString(),
    decision: args.finishPublished ? 'PUBLISHED_RECOVERY_PASS' : 'PASS',
    runId,
    packageCommit,
    count: preflight.length,
    posts: preflight.map(({ plan, facts }) => ({
      draftId: plan.draft.draftId,
      slug: plan.post.slug,
      toolSlug: plan.post.toolSlug,
      title: plan.post.title,
      richContentSha256: facts.richContentSha256,
      seoDataSha256: facts.seoDataSha256,
    })),
  };
  writeJson(path.join(runDir, 'batch-prepublish.json'), preflightReport);
  if (!args.publish && !args.finishPublished) {
    console.log(JSON.stringify({ mode: 'READ_ONLY_PREFLIGHT', runDir, count: preflight.length }, null, 2));
    return;
  }

  const completed = [];
  if (args.finishPublished) {
    for (const checked of preflight) {
      completed.push({
        slug: checked.plan.post.slug,
        draftId: checked.plan.draft.draftId,
        receipt: { decision: 'PUBLISHED', terminalState: 'PUBLISHED', mode: 'GET_ONLY_POSTPUBLISH_RECOVERY', postCallsThisInvocation: 0 },
      });
    }
  } else {
    try {
      for (const checked of preflight) {
        const postRunDir = path.join(runDir, 'posts', checked.plan.post.slug);
        writePostManifest(postRunDir, checked, packageCommit);
        const receipt = await publishDailyBlogOnce({
          runDir: postRunDir,
          widgetRoot: ROOT,
          polls: 45,
          pollMs: 1_000,
          timeoutMs: 30_000,
        });
        assert(receipt.decision === 'PUBLISHED' && receipt.terminalState === 'PUBLISHED', `${checked.plan.post.slug}: journal did not return a verified publish receipt`);
        completed.push({ slug: checked.plan.post.slug, draftId: checked.plan.draft.draftId, receipt });
        writeJson(path.join(runDir, 'batch-state.json'), { status: 'PUBLISHING', completed, total: preflight.length, updatedAt: new Date().toISOString() });
        console.log(`${checked.plan.post.slug}: PUBLISHED + GET VERIFIED`);
      }
    } catch (error) {
      writeJson(path.join(runDir, 'batch-state.json'), { status: 'PUBLISHED_PARTIAL', completed, total: preflight.length, failedAt: new Date().toISOString(), error: String(error.message || error) });
      throw error;
    }
  }

  const publicProofs = [];
  for (const checked of preflight) {
    const proof = await verifyPublicPost(checked.plan.post);
    publicProofs.push({ slug: checked.plan.post.slug, ...proof });
    console.log(`${checked.plan.post.slug}: PUBLIC URL VERIFIED`);
  }

  const cmsBindings = [];
  for (const checked of preflight) {
    const proof = publicProofs.find((entry) => entry.slug === checked.plan.post.slug);
    cmsBindings.push(await bindCms(checked, proof));
    console.log(`${checked.plan.post.slug}: CMS RELATED BLOG VERIFIED`);
  }

  const result = {
    completedAt: new Date().toISOString(),
    decision: 'PUBLISHED',
    terminalState: 'PUBLISHED_PENDING_INDEX_AND_BROWSER_QA',
    runId,
    packageCommit,
    count: completed.length,
    posts: completed,
    publicProofs,
    cmsBindings,
  };
  writeJson(path.join(runDir, 'batch-complete.json'), result);
  writeJson(path.join(runDir, 'batch-state.json'), { status: result.terminalState, completed, total: preflight.length, updatedAt: result.completedAt });
  console.log(JSON.stringify({ decision: result.decision, runDir, count: result.count }, null, 2));
}

main().catch((error) => {
  console.error(`ERROR: ${error.stack || error.message || String(error)}`);
  process.exit(1);
});
