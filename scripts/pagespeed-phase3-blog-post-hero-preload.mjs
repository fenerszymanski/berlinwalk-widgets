#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const API_ROOT = 'https://www.wixapis.com';
const SITE_ID = '12ee5ea0-70a7-492f-8020-ffb27cbb630f';
const PUBLIC_ORIGIN = 'https://www.berlinwalk.com';
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WORKSPACE_ROOT = path.resolve(REPO_ROOT, '..');

function parseArgs(argv) {
  const options = {
    slug: '',
    mode: '',
    backup: '',
    receipt: '',
  };

  for (const arg of argv) {
    if (arg === '--dry-run') options.mode = 'dry-run';
    else if (arg === '--stage') options.mode = 'stage';
    else if (arg === '--publish-only') options.mode = 'publish-only';
    else if (arg === '--unstage') options.mode = 'unstage';
    else if (arg === '--rollback') options.mode = 'rollback';
    else if (arg === '--self-test') options.mode = 'self-test';
    else if (arg.startsWith('--slug=')) options.slug = arg.slice('--slug='.length).trim();
    else if (arg.startsWith('--backup=')) options.backup = arg.slice('--backup='.length).trim();
    else if (arg.startsWith('--receipt=')) options.receipt = arg.slice('--receipt='.length).trim();
    else if (arg === '--help') options.mode = 'help';
    else throw new Error(`Unknown argument: ${arg}`);
  }

  if (!options.mode) throw new Error('Choose exactly one mode: --dry-run, --stage, --publish-only, --unstage, --rollback, or --self-test.');
  const modeFlags = argv.filter((arg) => ['--dry-run', '--stage', '--publish-only', '--unstage', '--rollback', '--self-test'].includes(arg));
  if (modeFlags.length !== 1) throw new Error('Choose exactly one execution mode.');
  if (!['self-test', 'help'].includes(options.mode) && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(options.slug)) {
    throw new Error('A lowercase URL slug is required with --slug=<slug>.');
  }

  const evidenceDir = path.join(
    WORKSPACE_ROOT,
    'output',
    'performance',
    'pagespeed-phase3-2026-07-20',
    'phase3c-blog-post-preload',
  );
  options.backup ||= path.join(evidenceDir, `${options.slug}-backup.json`);
  options.receipt ||= path.join(evidenceDir, `${options.slug}-receipt.json`);
  return options;
}

function usage() {
  console.log(`Usage:
  node scripts/pagespeed-phase3-blog-post-hero-preload.mjs --self-test
  node scripts/pagespeed-phase3-blog-post-hero-preload.mjs --slug=<slug> --dry-run
  node scripts/pagespeed-phase3-blog-post-hero-preload.mjs --slug=<slug> --stage
  node scripts/pagespeed-phase3-blog-post-hero-preload.mjs --slug=<slug> --publish-only
  node scripts/pagespeed-phase3-blog-post-hero-preload.mjs --slug=<slug> --unstage
  node scripts/pagespeed-phase3-blog-post-hero-preload.mjs --slug=<slug> --rollback

The live release is intentionally split into stage and publish-only gates.
Rollback restores only the exact backed-up seoData and republishes it.`);
}

function sha256(value) {
  return crypto.createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}

function same(a, b) {
  return JSON.stringify(canonicalize(a)) === JSON.stringify(canonicalize(b));
}

function authHeaders() {
  if (!process.env.WIX_API_KEY) {
    throw new Error('Missing WIX_API_KEY. From the repo run: source ../scripts/load-api-keys.sh');
  }
  return {
    Authorization: process.env.WIX_API_KEY,
    'wix-site-id': SITE_ID,
    'Content-Type': 'application/json',
  };
}

async function wixFetch(pathname, { method = 'GET', body } = {}) {
  const response = await fetch(`${API_ROOT}${pathname}`, {
    method,
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const raw = await response.text();
  let data = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = { raw: raw.slice(0, 1000) };
  }
  if (!response.ok) {
    throw new Error(`Wix ${method} ${pathname} failed (${response.status}): ${data.message || data.raw || raw.slice(0, 1000)}`);
  }
  return data;
}

async function findPublishedPost(slug) {
  let offset = 0;
  while (offset < 500) {
    const payload = await wixFetch('/blog/v3/posts/query', {
      method: 'POST',
      body: {
        query: {
          paging: { limit: 100, offset },
          sort: [{ fieldName: 'firstPublishedDate', order: 'DESC' }],
        },
        fieldsets: ['URL'],
      },
    });
    const posts = payload.posts || [];
    const match = posts.find((post) => post.slug === slug);
    if (match) return match;
    if (posts.length < 100) break;
    offset += posts.length;
  }
  throw new Error(`Published Wix Blog post not found for slug: ${slug}`);
}

async function getDraft(id) {
  const payload = await wixFetch(`/blog/v3/draft-posts/${encodeURIComponent(id)}?fieldsets=RICH_CONTENT`);
  return payload.draftPost || payload;
}

function protectedSnapshot(draft) {
  return {
    id: draft.id,
    title: draft.title,
    excerpt: draft.excerpt,
    richContent: draft.richContent,
    media: draft.media,
    categoryIds: draft.categoryIds,
    tagIds: draft.tagIds,
    relatedPostIds: draft.relatedPostIds,
    pricingPlanIds: draft.pricingPlanIds,
    seoSlug: draft.seoSlug,
    slugs: draft.slugs,
    language: draft.language,
    commentingEnabled: draft.commentingEnabled,
  };
}

function getCoverImage(draft) {
  const image = draft.media?.wixMedia?.image;
  if (!image?.id || !image?.width || !image?.height) {
    throw new Error('Draft has no complete Wix cover image metadata. Refusing to guess a preload URL.');
  }
  if (!/^5a08a3_[A-Za-z0-9]+~mv2\.(?:jpe?g|png|webp)$/i.test(image.id)) {
    throw new Error(`Unsupported Wix cover image ID: ${image.id}`);
  }
  return image;
}

export function buildDesktopHeroUrl(image, width = 740) {
  const height = Math.round((width * Number(image.height)) / Number(image.width));
  if (!Number.isFinite(height) || height < 1) throw new Error('Invalid cover image dimensions.');
  return `https://static.wixstatic.com/media/${image.id}/v1/fill/w_${width},h_${height},al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/${image.id}`;
}

function isPhase3HeroTag(tag) {
  return tag?.type === 'link'
    && tag.props?.rel === 'preload'
    && tag.props?.as === 'image'
    && tag.props?.media === '(min-width: 769px)'
    && tag.props?.fetchpriority === 'high'
    && /^https:\/\/static\.wixstatic\.com\/media\/[^/]+\/v1\/fill\/w_740,h_\d+,al_c,q_85,usm_0\.66_1\.00_0\.01,enc_avif,quality_auto\//.test(tag.props?.href || '');
}

export function buildSeoDataWithHeroPreload(seoData, image) {
  const current = seoData || { tags: [], settings: {} };
  const tags = Array.isArray(current.tags) ? current.tags : [];
  const foreignImagePreloads = tags.filter((tag) => (
    tag?.type === 'link'
    && tag.props?.rel === 'preload'
    && tag.props?.as === 'image'
    && !isPhase3HeroTag(tag)
  ));
  if (foreignImagePreloads.length) {
    throw new Error('The post already has an unrelated image preload. Stop to avoid duplicate critical-image downloads.');
  }

  const preserved = tags.filter((tag) => !isPhase3HeroTag(tag));
  const preload = {
    type: 'link',
    props: {
      rel: 'preload',
      as: 'image',
      href: buildDesktopHeroUrl(image),
      media: '(min-width: 769px)',
      fetchpriority: 'high',
    },
    children: '',
    custom: true,
    disabled: false,
  };
  return {
    ...current,
    tags: [...preserved, preload],
  };
}

function phase3Tags(seoData) {
  return (seoData?.tags || []).filter(isPhase3HeroTag);
}

async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

function assertProtectedUnchanged(before, after, label) {
  const beforeProtected = protectedSnapshot(before);
  const afterProtected = protectedSnapshot(after);
  if (!same(beforeProtected, afterProtected)) {
    throw new Error(`${label}: a non-SEO protected post field changed. Stop before publish.`);
  }
}

function assertStageReadback(before, after, plannedSeoData) {
  assertProtectedUnchanged(before, after, 'Stage readback');
  if (!same(after.seoData, plannedSeoData)) throw new Error('Stage readback seoData differs from the planned payload.');
  if (phase3Tags(after.seoData).length !== 1) throw new Error('Stage readback does not contain exactly one Phase 3 hero preload.');
  if (!after.hasUnpublishedChanges) throw new Error('Wix did not report the staged post as having unpublished changes.');
}

async function patchSeoData(id, seoData) {
  return wixFetch(`/blog/v3/draft-posts/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: { draftPost: { id, seoData }, fieldsets: ['RICH_CONTENT'] },
  });
}

async function publishDraft(id) {
  return wixFetch(`/blog/v3/draft-posts/${encodeURIComponent(id)}/publish`, { method: 'POST', body: {} });
}

async function publicHeadReadback(slug, expectedHref, { attempts = 12, intervalMs = 5000 } = {}) {
  const url = `${PUBLIC_ORIGIN}/post/${slug}`;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const response = await fetch(`${url}?bw_phase3=${Date.now()}`, {
      headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
    });
    const html = await response.text();
    const matchingLink = (html.match(/<link\b[^>]*>/gi) || []).some((tag) => (
      tag.includes(expectedHref) && /\brel=["']preload["']/i.test(tag)
    ));
    if (response.ok && matchingLink) {
      return { ok: true, attempt, status: response.status, url, expectedHref };
    }
    if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  return { ok: false, attempts, url, expectedHref };
}

function selfTest() {
  const image = {
    id: '5a08a3_b97f474209584bb1bfa2ec1436716bbf~mv2.jpg',
    width: 1600,
    height: 1080,
  };
  const url = buildDesktopHeroUrl(image);
  const expected = 'https://static.wixstatic.com/media/5a08a3_b97f474209584bb1bfa2ec1436716bbf~mv2.jpg/v1/fill/w_740,h_500,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/5a08a3_b97f474209584bb1bfa2ec1436716bbf~mv2.jpg';
  if (url !== expected) throw new Error(`URL self-test failed: ${url}`);
  const original = { tags: [{ type: 'title', children: 'Example', custom: false, disabled: false }], settings: { preventAutoRedirect: false } };
  const first = buildSeoDataWithHeroPreload(original, image);
  const second = buildSeoDataWithHeroPreload(first, image);
  if (phase3Tags(first).length !== 1 || phase3Tags(second).length !== 1) throw new Error('Idempotency self-test failed.');
  if (!same(first, second)) throw new Error('Repeated build changed seoData.');
  if (!same(first.tags[0], original.tags[0])) throw new Error('Existing SEO tag was not preserved.');
  console.log(JSON.stringify({ ok: true, tests: 4, desktopOnly: true, url }, null, 2));
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.mode === 'help') return usage();
  if (options.mode === 'self-test') return selfTest();

  const published = await findPublishedPost(options.slug);
  const draft = await getDraft(published.id);
  if (draft.id !== published.id) throw new Error('Published/draft ID mismatch.');
  const image = getCoverImage(draft);
  const plannedSeoData = buildSeoDataWithHeroPreload(draft.seoData, image);
  const plannedTag = phase3Tags(plannedSeoData)[0];
  const publicUrl = `${PUBLIC_ORIGIN}/post/${options.slug}`;

  if (options.mode === 'dry-run') {
    console.log(JSON.stringify({
      ok: true,
      mode: options.mode,
      id: draft.id,
      slug: options.slug,
      publicUrl,
      status: draft.status,
      hasUnpublishedChanges: draft.hasUnpublishedChanges,
      desktopOnly: true,
      reason: 'The measured mobile LCP is text; preloading the hero on mobile would compete for bandwidth.',
      image,
      preload: plannedTag,
      protectedHash: sha256(protectedSnapshot(draft)),
      seoDataBeforeHash: sha256(draft.seoData),
      seoDataAfterHash: sha256(plannedSeoData),
      backup: options.backup,
      receipt: options.receipt,
    }, null, 2));
    return;
  }

  if (options.mode === 'stage') {
    if (draft.status !== 'PUBLISHED') {
      throw new Error(`Stage requires PUBLISHED; got ${draft.status}.`);
    }
    if (draft.hasUnpublishedChanges) {
      const existingBackup = await readJson(options.backup);
      if (existingBackup.id !== draft.id || existingBackup.slug !== options.slug || existingBackup.siteId !== SITE_ID) {
        throw new Error('Existing staged backup identity does not match the requested post.');
      }
      if (sha256(protectedSnapshot(draft)) !== existingBackup.protectedHash) {
        throw new Error('Existing staged protected content does not match its backup.');
      }
      if (!same(draft.seoData, plannedSeoData) || phase3Tags(draft.seoData).length !== 1) {
        throw new Error('Post already has unrelated unpublished changes. Refusing to adopt the stage.');
      }
      const adoptedReceipt = {
        schemaVersion: 1,
        stagedAt: new Date().toISOString(),
        siteId: SITE_ID,
        id: draft.id,
        slug: options.slug,
        publicUrl,
        backup: options.backup,
        protectedHash: sha256(protectedSnapshot(draft)),
        seoDataHash: sha256(draft.seoData),
        preload: phase3Tags(draft.seoData)[0],
        published: false,
        adoptedAfterWixNormalization: true,
      };
      await writeJson(options.receipt, adoptedReceipt);
      console.log(JSON.stringify({ ok: true, mode: options.mode, staged: true, published: false, adoptedAfterWixNormalization: true, backup: options.backup, receipt: options.receipt, preload: adoptedReceipt.preload }, null, 2));
      return;
    }
    const backup = {
      schemaVersion: 1,
      createdAt: new Date().toISOString(),
      siteId: SITE_ID,
      id: draft.id,
      slug: options.slug,
      publicUrl,
      lastPublishedDate: draft.lastPublishedDate,
      protectedHash: sha256(protectedSnapshot(draft)),
      seoDataHash: sha256(draft.seoData),
      seoData: draft.seoData,
      coverImage: image,
    };
    await writeJson(options.backup, backup);
    await patchSeoData(draft.id, plannedSeoData);
    const staged = await getDraft(draft.id);
    assertStageReadback(draft, staged, plannedSeoData);
    const receipt = {
      schemaVersion: 1,
      stagedAt: new Date().toISOString(),
      siteId: SITE_ID,
      id: draft.id,
      slug: options.slug,
      publicUrl,
      backup: options.backup,
      protectedHash: sha256(protectedSnapshot(staged)),
      seoDataHash: sha256(staged.seoData),
      preload: phase3Tags(staged.seoData)[0],
      published: false,
    };
    await writeJson(options.receipt, receipt);
    console.log(JSON.stringify({ ok: true, mode: options.mode, staged: true, published: false, backup: options.backup, receipt: options.receipt, preload: receipt.preload }, null, 2));
    return;
  }

  const backup = await readJson(options.backup);
  if (backup.id !== draft.id || backup.slug !== options.slug || backup.siteId !== SITE_ID) {
    throw new Error('Backup identity does not match the requested post.');
  }

  if (options.mode === 'unstage') {
    if (sha256(protectedSnapshot(draft)) !== backup.protectedHash) {
      throw new Error('Protected post content drifted since backup. Refusing automatic unstage.');
    }
    await patchSeoData(draft.id, backup.seoData);
    const restoredDraft = await getDraft(draft.id);
    assertProtectedUnchanged(draft, restoredDraft, 'Unstage readback');
    if (!same(restoredDraft.seoData, backup.seoData)) throw new Error('Unstage seoData mismatch.');
    console.log(JSON.stringify({
      ok: true,
      mode: options.mode,
      unstaged: true,
      published: false,
      id: draft.id,
      slug: options.slug,
      hasUnpublishedChanges: restoredDraft.hasUnpublishedChanges,
      note: restoredDraft.hasUnpublishedChanges
        ? 'The draft now equals the backup, but Wix still flags unpublished changes. Do not publish without a separate decision.'
        : 'The draft matches the live backup and Wix cleared the unpublished-change flag.',
    }, null, 2));
    return;
  }

  if (options.mode === 'rollback') {
    if (sha256(protectedSnapshot(draft)) !== backup.protectedHash) {
      throw new Error('Protected post content drifted since backup. Refusing automatic rollback.');
    }
    await patchSeoData(draft.id, backup.seoData);
    const restoredDraft = await getDraft(draft.id);
    assertProtectedUnchanged(draft, restoredDraft, 'Rollback stage');
    if (!same(restoredDraft.seoData, backup.seoData)) throw new Error('Rollback seoData stage mismatch.');
    await publishDraft(draft.id);
    const finalDraft = await getDraft(draft.id);
    if (finalDraft.hasUnpublishedChanges) throw new Error('Rollback publish left unpublished changes.');
    if (!same(finalDraft.seoData, backup.seoData)) throw new Error('Rollback publish seoData mismatch.');
    console.log(JSON.stringify({ ok: true, mode: options.mode, rolledBack: true, published: true, id: draft.id, slug: options.slug }, null, 2));
    return;
  }

  const receipt = await readJson(options.receipt);
  if (receipt.id !== draft.id || receipt.slug !== options.slug || receipt.siteId !== SITE_ID) {
    throw new Error('Receipt identity does not match the requested post.');
  }
  if (!draft.hasUnpublishedChanges) throw new Error('Publish-only requires the staged unpublished change.');
  if (sha256(protectedSnapshot(draft)) !== receipt.protectedHash) throw new Error('Protected post content drifted after stage.');
  if (sha256(draft.seoData) !== receipt.seoDataHash) throw new Error('Staged seoData drifted after stage.');
  if (phase3Tags(draft.seoData).length !== 1) throw new Error('Publish-only expected exactly one Phase 3 preload.');
  await publishDraft(draft.id);
  const finalDraft = await getDraft(draft.id);
  if (finalDraft.hasUnpublishedChanges) throw new Error('Publish completed but Wix still reports unpublished changes.');
  if (sha256(protectedSnapshot(finalDraft)) !== receipt.protectedHash) throw new Error('Protected content changed during publish.');
  if (sha256(finalDraft.seoData) !== receipt.seoDataHash) throw new Error('Published seoData differs from staged seoData.');
  const live = await publicHeadReadback(options.slug, receipt.preload.props.href);
  const finalReceipt = { ...receipt, published: true, publishedAt: new Date().toISOString(), live };
  await writeJson(options.receipt, finalReceipt);
  if (!live.ok) throw new Error('Wix API publish succeeded, but the public preload marker did not appear within the bounded readback window.');
  console.log(JSON.stringify({ ok: true, mode: options.mode, published: true, id: draft.id, slug: options.slug, preload: receipt.preload, live, rollback: `node scripts/pagespeed-phase3-blog-post-hero-preload.mjs --slug=${options.slug} --rollback` }, null, 2));
}

const isEntry = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isEntry) {
  main().catch((error) => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  });
}
