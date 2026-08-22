#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import {
  API_ROOT,
  BATCH_SLUG,
  MEMBER_ID,
  ROOT,
  SITE_ID,
  TOURIST_TIPS_CATEGORY_ID,
  assert,
  assertArticleShell,
  assertSupportEntries,
  batchReportPath,
  bodyPathFor,
  embedsFor,
  imageDimensions,
  loadImageManifest,
  markdownImages,
  mimeTypeFor,
  parseArgs,
  plainMarkdown,
  readBatchMetadata,
  readBody,
  resolveInputPath,
  sha256,
  validateImagePlan,
  writeJson,
} from './wix-batch-common.mjs';

const USAGE = `Usage:
  node blog-drafts/${BATCH_SLUG}/create-wix-drafts.mjs --image-manifest <path>
  node blog-drafts/${BATCH_SLUG}/create-wix-drafts.mjs --image-manifest <path> --apply --run-id <run-id>

The first command is a local-only dry run. --apply is the only mode that calls Wix,
uploads media, or creates drafts. It always sends publish:false.`;

const MEDIA_READY_POLL_ATTEMPTS = 8;
const MEDIA_READY_POLL_DELAY_MS = 750;

function textNode(id, text, decorations = []) {
  return { type: 'TEXT', id, nodes: [], textData: { text, decorations } };
}

function linkDecoration(url) {
  return { type: 'LINK', linkData: { link: { url, target: 'BLANK' } } };
}

function createRicosBuilder(post, embeds, sourceCredits) {
  let nextId = 0;
  const id = (prefix) => `${prefix}_${++nextId}`;
  const makeText = (text, decorations = []) => textNode(id('text'), text, decorations);

  function inlineNodes(value, inherited = []) {
    const nodes = [];
    let cursor = 0;
    const push = (text, decorations = inherited) => { if (text) nodes.push(makeText(text, decorations)); };
    while (cursor < value.length) {
      if (value.startsWith('**', cursor)) {
        const end = value.indexOf('**', cursor + 2);
        if (end !== -1) {
          nodes.push(...inlineNodes(value.slice(cursor + 2, end), [...inherited, { type: 'BOLD', fontWeightValue: 700 }]));
          cursor = end + 2;
          continue;
        }
      }
      if (value[cursor] === '_') {
        const end = value.indexOf('_', cursor + 1);
        if (end !== -1) {
          nodes.push(...inlineNodes(value.slice(cursor + 1, end), [...inherited, { type: 'ITALIC' }]));
          cursor = end + 1;
          continue;
        }
      }
      if (value[cursor] === '[') {
        const labelEnd = value.indexOf(']', cursor + 1);
        const urlStart = labelEnd >= 0 ? value.indexOf('(', labelEnd) : -1;
        const urlEnd = urlStart >= 0 ? value.indexOf(')', urlStart) : -1;
        if (labelEnd >= 0 && urlStart === labelEnd + 1 && urlEnd >= 0) {
          let url = value.slice(urlStart + 1, urlEnd);
          if (url.startsWith('/')) url = `https://www.berlinwalk.com${url}`;
          nodes.push(...inlineNodes(value.slice(cursor + 1, labelEnd), [...inherited, linkDecoration(url)]));
          cursor = urlEnd + 1;
          continue;
        }
      }
      let next = value.length;
      for (const marker of ['**', '_', '[']) {
        const found = value.indexOf(marker, cursor + 1);
        if (found !== -1) next = Math.min(next, found);
      }
      push(value.slice(cursor, next));
      cursor = next;
    }
    return nodes.length ? nodes : [makeText('')];
  }

  const paragraph = (value, lineHeight = '1.7') => ({
    type: 'PARAGRAPH', id: id('paragraph'), nodes: inlineNodes(value),
    paragraphData: { textStyle: { textAlignment: 'AUTO', lineHeight }, indentation: 0 },
  });
  const caption = (value) => ({
    type: 'PARAGRAPH', id: id('caption'),
    nodes: inlineNodes(value.replace(/^_/, '').replace(/_$/, ''), [{ type: 'FONT_SIZE', fontSizeData: { unit: 'PX', value: 12 } }, { type: 'ITALIC' }]),
    paragraphData: { textStyle: { textAlignment: 'CENTER', lineHeight: '1.45' }, indentation: 0 },
  });
  const heading = (value, level) => ({
    type: 'HEADING', id: id('heading'), nodes: [makeText(value)],
    headingData: { level, textStyle: { textAlignment: 'AUTO' } },
  });
  const imageNode = (media, altText) => ({
    type: 'IMAGE', id: id('image'), nodes: [],
    imageData: {
      containerData: { width: { size: 'CONTENT' }, alignment: 'CENTER', textWrap: true },
      image: { src: { id: media.id }, width: media.width, height: media.height },
      altText,
    },
  });
  const htmlNode = (embed) => ({
    type: 'HTML', id: embed.id, nodes: [],
    htmlData: {
      containerData: { width: { custom: '940' }, alignment: 'CENTER', height: { custom: embed.height }, textWrap: true },
      url: embed.url,
      source: 'HTML',
      autoHeight: false,
    },
  });
  const bulletList = (items) => ({
    type: 'BULLETED_LIST', id: id('bulleted_list'),
    nodes: items.map((item) => ({ type: 'LIST_ITEM', id: id('list_item'), nodes: [paragraph(item, '1.6')] })),
  });
  const creditsId = `article_image_credits_${post.slug.replace(/-/g, '_')}`;
  const creditText = (suffix, text, decorations = []) => textNode(`${creditsId}_${suffix}`, text, decorations);
  const plural = sourceCredits.length === 1 ? 'image' : 'images';
  const creditsNode = () => ({
    type: 'COLLAPSIBLE_LIST', id: creditsId,
    nodes: [{
      type: 'COLLAPSIBLE_ITEM', id: `${creditsId}_item`, nodes: [
        {
          type: 'COLLAPSIBLE_ITEM_TITLE', id: `${creditsId}_title`, nodes: [{
            type: 'PARAGRAPH', id: `${creditsId}_title_p`, nodes: [creditText('title_t', 'Image credits')],
            paragraphData: { textStyle: { textAlignment: 'AUTO' }, indentation: 0 },
          }],
        },
        {
          type: 'COLLAPSIBLE_ITEM_BODY', id: `${creditsId}_body`, nodes: [
            {
              type: 'PARAGRAPH', id: `${creditsId}_intro`,
              nodes: [creditText('intro_t', `Source and licence details for the ${sourceCredits.length} sourced ${plural} used in this article.`)],
              paragraphData: { textStyle: { textAlignment: 'AUTO', lineHeight: '1.55' }, indentation: 0 },
            },
            ...sourceCredits.map((credit, index) => ({
              type: 'PARAGRAPH', id: `${creditsId}_credit_${index}`, nodes: [
                creditText(`credit_${index}_source`, credit.label, [linkDecoration(credit.sourceUrl)]),
                creditText(`credit_${index}_by`, `: ${credit.author}, `),
                creditText(`credit_${index}_license`, credit.licenseLabel, credit.licenseUrl ? [linkDecoration(credit.licenseUrl)] : []),
                creditText(`credit_${index}_via`, `, via ${credit.via}.`),
              ],
              paragraphData: { textStyle: { textAlignment: 'AUTO', lineHeight: '1.55' }, indentation: 0 },
            })),
          ],
        },
      ],
    }],
    collapsibleListData: {
      containerData: { alignment: 'CENTER', textWrap: true },
      expandOnlyOne: false,
      initialExpandedItems: 'NONE',
      direction: 'LTR',
    },
  });

  function parseMarkdown(markdown, mediaByPath) {
    const nodes = [];
    let paragraphs = [];
    let list = [];
    let captionExpected = false;
    const requireCaption = (where) => assert(!captionExpected, `${post.slug}: every image needs one italic caption before ${where}`);
    const flushList = () => {
      if (!list.length) return;
      requireCaption('a list');
      nodes.push(bulletList(list));
      list = [];
    };
    const flushParagraph = () => {
      if (!paragraphs.length) return;
      const value = paragraphs.join(' ').replace(/\s+/g, ' ').trim();
      if (captionExpected) {
        assert(paragraphs.length === 1 && /^_.+_$/.test(value), `${post.slug}: image captions must be one italic Markdown line, for example _Context caption._`);
        nodes.push(caption(value));
        captionExpected = false;
      } else {
        nodes.push(paragraph(value));
      }
      paragraphs = [];
    };

    for (const raw of markdown.split(/\r?\n/)) {
      const line = raw.trim();
      if (!line) {
        flushParagraph();
        flushList();
        continue;
      }
      if (line === '{{article-image-credits}}') {
        flushParagraph();
        flushList();
        requireCaption('the Image credits disclosure');
        nodes.push(creditsNode());
        continue;
      }
      if (embeds[line]) {
        flushParagraph();
        flushList();
        requireCaption('an embed');
        nodes.push(htmlNode(embeds[line]));
        continue;
      }
      if (/^\{\{.*}}$/.test(line)) throw new Error(`${post.slug}: unsupported token ${line}`);
      const image = line.match(/^!\[(.*?)]\((.*?)\)$/);
      if (image) {
        flushParagraph();
        flushList();
        requireCaption('another image');
        const media = mediaByPath.get(image[2].trim());
        assert(media, `${post.slug}: missing media for ${image[2]}`);
        nodes.push(imageNode(media, image[1].trim()));
        captionExpected = true;
        continue;
      }
      if (/^#\s+/.test(line)) throw new Error(`${post.slug}: a Wix Blog body must not contain a Markdown H1`);
      const h2 = line.match(/^##\s+(.+)$/);
      if (h2) {
        flushParagraph();
        flushList();
        requireCaption('an H2');
        nodes.push(heading(h2[1], 2));
        continue;
      }
      const h3 = line.match(/^###\s+(.+)$/);
      if (h3) {
        flushParagraph();
        flushList();
        requireCaption('an H3');
        nodes.push(heading(h3[1], 3));
        continue;
      }
      const bullet = line.match(/^-\s+(.+)$/);
      if (bullet) {
        flushParagraph();
        requireCaption('a list');
        list.push(bullet[1]);
        continue;
      }
      flushList();
      paragraphs.push(line);
    }
    flushParagraph();
    flushList();
    requireCaption('the end of the article');
    const now = new Date().toISOString();
    return {
      nodes,
      metadata: { version: 1, createdTimestamp: now, updatedTimestamp: now },
      documentStyle: {
        paragraph: { lineHeight: '1.7' },
        headerOne: { lineHeight: '1.12' },
        headerTwo: { lineHeight: '1.15' },
        headerThree: { lineHeight: '1.18' },
      },
    };
  }

  return { parseMarkdown, creditsId };
}

function buildSeoData(post, support, cover) {
  const canonical = `https://www.berlinwalk.com/post/${post.slug}`;
  const meta = (props, custom = true) => ({ type: 'meta', props, children: '', custom, disabled: false });
  const blogPosting = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: [cover.url],
    author: { '@type': 'Person', name: 'Yusuf Ucuz' },
    publisher: { '@type': 'Organization', name: 'BerlinWalk', url: 'https://www.berlinwalk.com' },
    mainEntityOfPage: canonical,
    inLanguage: 'en',
    articleSection: 'Tourist Tips',
    keywords: post.focusKeywords.join(', '),
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: support.faq.items.map((item) => ({
      '@type': 'Question',
      name: plainMarkdown(item.q),
      acceptedAnswer: { '@type': 'Answer', text: plainMarkdown(item.a) },
    })),
  };
  return {
    tags: [
      { type: 'title', children: post.seoTitle, custom: false, disabled: false },
      meta({ name: 'description', content: post.description }, false),
      meta({ name: 'robots', content: 'index, follow, max-image-preview:large' }),
      meta({ property: 'og:title', content: post.socialTitle }, false),
      meta({ property: 'og:description', content: post.socialDescription }, false),
      meta({ property: 'og:type', content: 'article' }),
      meta({ property: 'og:url', content: canonical }),
      meta({ property: 'og:image', content: cover.url }),
      meta({ property: 'og:image:alt', content: cover.altText }),
      meta({ name: 'twitter:card', content: 'summary_large_image' }),
      meta({ name: 'twitter:title', content: post.socialTitle }),
      meta({ name: 'twitter:description', content: post.socialDescription }),
      meta({ name: 'twitter:image', content: cover.url }),
      meta({ name: 'twitter:image:alt', content: cover.altText }),
      { type: 'script', props: { type: 'application/ld+json' }, children: JSON.stringify(blogPosting), custom: true, disabled: false },
      { type: 'script', props: { type: 'application/ld+json' }, children: JSON.stringify(faqSchema), custom: true, disabled: false },
    ],
    settings: {
      preventAutoRedirect: false,
      keywords: post.focusKeywords.map((term, index) => ({ term, isMain: index === 0 })),
    },
  };
}

function preparePost(post, manifest) {
  const body = readBody(post);
  assertArticleShell(post, body);
  const support = assertSupportEntries(post);
  const plan = validateImagePlan(post, body, manifest.postPlans.get(post.slug));
  const embeds = embedsFor(post, plan);
  const mediaByPath = new Map(plan.images.map((image, index) => [image.path, {
    id: `dry_${post.slug}_${index + 1}`,
    url: `dry://${path.basename(image.path)}`,
    width: image.dimensions.width,
    height: image.dimensions.height,
    filename: path.basename(image.path),
    altText: image.altText,
  }]));
  const ricos = createRicosBuilder(post, embeds, plan.sourceCredits);
  const richContent = ricos.parseMarkdown(body, mediaByPath);
  return { post, body, support, plan, embeds, richContent, creditsId: ricos.creditsId };
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

async function queryAllBlog(collection, itemKey) {
  const items = [];
  for (let offset = 0; offset < 5000; offset += 100) {
    const response = await wixFetch(`/blog/v3/${collection}/query`, {
      method: 'POST',
      body: { query: { paging: { limit: 100, offset } } },
    });
    const page = response[itemKey] || [];
    items.push(...page);
    if (page.length < 100) return items;
  }
  throw new Error(`Wix ${collection} collision scan exceeded 5,000 rows`);
}

async function assertNoBlogCollisions(prepared) {
  const slugs = new Set(prepared.map(({ post }) => post.slug));
  const titles = new Set(prepared.map(({ post }) => post.title));
  const find = (items) => items.filter((item) => {
    const itemSlugs = [item.seoSlug, ...(Array.isArray(item.slugs) ? item.slugs : [])].filter(Boolean);
    return titles.has(item.title) || itemSlugs.some((slug) => slugs.has(slug));
  });
  const [drafts, published] = await Promise.all([
    queryAllBlog('draft-posts', 'draftPosts'),
    queryAllBlog('posts', 'posts'),
  ]);
  const draftHits = find(drafts);
  const publishedHits = find(published);
  assert(!draftHits.length && !publishedHits.length, `Exact Blog collision guard blocked this batch: drafts=${draftHits.map((item) => item.id).join(',') || 'none'} published=${publishedHits.map((item) => item.id).join(',') || 'none'}`);
}

async function tagId(label) {
  const response = await wixFetch(`/blog/v3/tags/labels/${encodeURIComponent(label)}`);
  const tag = response.tag || response;
  assert(tag.id, `Missing existing Wix tag: ${label}`);
  return tag.id;
}

async function uploadImage(prepared, image) {
  const generated = await wixFetch('/site-media/v1/files/generate-upload-url', {
    method: 'POST',
    body: {
      mimeType: mimeTypeFor(image.absolutePath),
      fileName: path.basename(image.absolutePath),
      private: false,
      labels: ['blog', 'berlinwalk', BATCH_SLUG, prepared.post.slug],
    },
  });
  assert(generated.uploadUrl, `No Wix upload URL for ${prepared.post.slug}/${image.path}`);
  const response = await fetch(generated.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': mimeTypeFor(image.absolutePath) },
    body: fs.readFileSync(image.absolutePath),
    signal: AbortSignal.timeout(60000),
  });
  const raw = await response.text();
  let body = {};
  try { body = raw ? JSON.parse(raw) : {}; } catch { body = { raw: raw.slice(0, 1000) }; }
  if (!response.ok) throw new Error(`Wix upload failed for ${prepared.post.slug}/${image.path}: HTTP ${response.status} ${JSON.stringify(body).slice(0, 800)}`);
  const uploaded = mediaRecord(body.file || body, prepared, image);
  return waitForMediaReady(uploaded, prepared, image);
}

function mediaRecord(file, prepared, image) {
  assert(file && typeof file === 'object', `Wix media response is invalid for ${prepared.post.slug}/${image.path}`);
  assert(file.id && file.url, `Wix media response has no public identity for ${prepared.post.slug}/${image.path}`);
  const wixImage = file.media?.image?.image || {};
  const width = Number.isInteger(wixImage.width) ? wixImage.width : image.dimensions.width;
  const height = Number.isInteger(wixImage.height) ? wixImage.height : image.dimensions.height;
  return {
    id: file.id,
    url: file.url,
    width,
    height,
    operationStatus: file.operationStatus || null,
    filename: path.basename(image.absolutePath),
    altText: image.altText,
  };
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function waitForMediaReady(uploaded, prepared, image) {
  for (let attempt = 1; attempt <= MEDIA_READY_POLL_ATTEMPTS; attempt += 1) {
    const response = await wixFetch(`/site-media/v1/files/get-file-by-id?fileId=${encodeURIComponent(uploaded.id)}`);
    const readback = mediaRecord(response.file || response.files?.[0] || response, prepared, image);
    assert(readback.id === uploaded.id, `Wix media GET returned a different file id for ${prepared.post.slug}/${image.path}`);
    assert(readback.url === uploaded.url, `Wix media GET returned a different URL for ${prepared.post.slug}/${image.path}`);
    assert(readback.width === image.dimensions.width && readback.height === image.dimensions.height, `Wix media GET dimensions differ for ${prepared.post.slug}/${image.path}`);
    if (readback.operationStatus === 'READY') return readback;
    if (readback.operationStatus === 'FAILED') throw new Error(`Wix media processing failed for ${prepared.post.slug}/${image.path}`);
    if (attempt < MEDIA_READY_POLL_ATTEMPTS) await delay(MEDIA_READY_POLL_DELAY_MS);
  }
  throw new Error(`Wix media file did not reach READY for ${prepared.post.slug}/${image.path}`);
}

function cacheKey(prepared, image) {
  return `${prepared.post.slug}/${image.path}`;
}

function fileHash(filePath) {
  return sha256(fs.readFileSync(filePath));
}

function buildDraftPost(prepared, mediaByPath, tagIds) {
  const cover = mediaByPath.get(prepared.plan.coverPath);
  assert(cover, `${prepared.post.slug} cover did not upload`);
  const ricos = createRicosBuilder(prepared.post, prepared.embeds, prepared.plan.sourceCredits);
  const richContent = ricos.parseMarkdown(prepared.body, mediaByPath);
  return {
    title: prepared.post.title,
    memberId: MEMBER_ID,
    excerpt: prepared.post.excerpt,
    featured: false,
    commentingEnabled: false,
    language: 'en',
    categoryIds: [TOURIST_TIPS_CATEGORY_ID],
    tagIds,
    minutesToRead: Math.max(4, Math.round(prepared.body.split(/\s+/).filter(Boolean).length / 220)),
    seoSlug: prepared.post.slug,
    slugs: [prepared.post.slug],
    seoData: buildSeoData(prepared.post, prepared.support, cover),
    richContent,
    media: {
      wixMedia: { image: { id: cover.id, url: cover.url, width: cover.width, height: cover.height, altText: cover.altText, filename: cover.filename } },
      displayed: true,
      custom: false,
      altText: cover.altText,
    },
  };
}

async function fetchDraft(draftId) {
  const response = await wixFetch(`/blog/v3/draft-posts/${encodeURIComponent(draftId)}?fieldsets=RICH_CONTENT`);
  return response.draftPost || response;
}

function hasCaptionStyle(node) {
  if (node.type !== 'PARAGRAPH' || node.paragraphData?.textStyle?.textAlignment !== 'CENTER' || String(node.paragraphData?.textStyle?.lineHeight) !== '1.45') return false;
  return (node.nodes || []).some((text) => (text.textData?.decorations || []).some((decoration) => decoration.type === 'ITALIC')
    && (text.textData?.decorations || []).some((decoration) => decoration.type === 'FONT_SIZE' && Number(decoration.fontSizeData?.value) === 12));
}

function verifyDraft(prepared, draft) {
  const nodes = draft.richContent?.nodes || [];
  const images = nodes.filter((node) => node.type === 'IMAGE');
  const embeds = nodes.filter((node) => node.type === 'HTML');
  const credits = nodes.filter((node) => node.type === 'COLLAPSIBLE_LIST' && node.id === prepared.creditsId);
  const captions = nodes.filter(hasCaptionStyle);
  assert(draft.title === prepared.post.title, `${prepared.post.slug} draft title readback mismatch`);
  assert(draft.seoSlug === prepared.post.slug, `${prepared.post.slug} draft slug readback mismatch`);
  assert(draft.status === 'UNPUBLISHED' && draft.hasUnpublishedChanges === true, `${prepared.post.slug} is not an UNPUBLISHED draft`);
  assert(images.length === 4 && images.every((node) => node.imageData?.altText?.trim()), `${prepared.post.slug} draft needs four images with alt text`);
  assert(embeds.length === 3, `${prepared.post.slug} draft needs exactly three embeds`);
  const expectedUrls = Object.values(prepared.embeds).map((embed) => embed.url).sort();
  const actualUrls = embeds.map((node) => node.htmlData?.url).sort();
  assert(JSON.stringify(actualUrls) === JSON.stringify(expectedUrls), `${prepared.post.slug} draft embed URLs read back differently`);
  assert(!nodes.some((node) => node.type === 'HEADING' && Number(node.headingData?.level) === 1), `${prepared.post.slug} draft has a forbidden H1`);
  assert(captions.length === 4, `${prepared.post.slug} draft needs four 12px italic centred captions`);
  assert(credits.length === 1 && credits[0].collapsibleListData?.initialExpandedItems === 'NONE', `${prepared.post.slug} draft needs one default-closed native Image credits disclosure`);
  const creditBody = credits[0]?.nodes?.[0]?.nodes?.find((node) => node.type === 'COLLAPSIBLE_ITEM_BODY');
  assert((creditBody?.nodes || []).length === prepared.plan.sourceCredits.length + 1, `${prepared.post.slug} dynamic public credit count readback mismatch`);
  assert((draft.seoData?.tags || []).length >= 16, `${prepared.post.slug} draft SEO readback is incomplete`);
  return {
    draftId: draft.id,
    slug: draft.seoSlug,
    title: draft.title,
    status: draft.status,
    hasUnpublishedChanges: draft.hasUnpublishedChanges,
    images: images.length,
    captions: captions.length,
    embeds: actualUrls,
    sourceCreditCount: prepared.plan.sourceCredits.length,
    nativeImageCredits: credits.length,
    seoTags: draft.seoData?.tags?.length || 0,
    richContentSha256: sha256(draft.richContent),
    seoDataSha256: sha256(draft.seoData),
    editUrl: `https://manage.wix.com/dashboard/${SITE_ID}/blog/drafts/${draft.id}/edit`,
  };
}

function dryRunReport(prepared) {
  return {
    slug: prepared.post.slug,
    toolSlug: prepared.post.toolSlug,
    bodyPath: path.relative(ROOT, bodyPathFor(prepared.post)),
    targetStatus: 'UNPUBLISHED',
    images: prepared.plan.images.length,
    generatedImages: prepared.plan.images.filter((image) => image.sourceType === 'generated').length,
    sourceCreditCount: prepared.plan.sourceCredits.length,
    captions: prepared.richContent.nodes.filter(hasCaptionStyle).length,
    embeds: Object.values(prepared.embeds).map((embed) => ({ url: embed.url, height: embed.height })),
    nativeImageCredits: prepared.richContent.nodes.filter((node) => node.type === 'COLLAPSIBLE_LIST' && node.id === prepared.creditsId).length,
    richContentSha256: sha256(prepared.richContent),
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.has('--help')) {
    console.log(USAGE);
    return;
  }
  const imageManifestPath = resolveInputPath(args.value('--image-manifest'), '--image-manifest');
  assert(args.value('--apply') === undefined, '--apply is a bare confirmation flag and does not accept a value');
  const apply = args.has('--apply');
  const runId = apply ? args.value('--run-id') : null;
  if (apply) assert(runId, '--run-id is required with --apply');

  const metadata = readBatchMetadata();
  const manifest = loadImageManifest(imageManifestPath);
  const prepared = metadata.posts.map((post) => preparePost(post, manifest));
  if (!apply) {
    console.log(JSON.stringify({
      mode: 'DRY_RUN_LOCAL_ONLY',
      batch: BATCH_SLUG,
      wixCalls: 0,
      targetStatus: 'UNPUBLISHED',
      posts: prepared.map(dryRunReport),
    }, null, 2));
    return;
  }

  const cachePath = batchReportPath(runId, 'image-upload-cache.json');
  const statePath = batchReportPath(runId, 'draft-state.json');
  const readbackPath = batchReportPath(runId, 'draft-readback.json');
  const uploadCache = fs.existsSync(cachePath) ? JSON.parse(fs.readFileSync(cachePath, 'utf8')) : {};

  await assertNoBlogCollisions(prepared);
  const uniqueTagLabels = [...new Set(prepared.flatMap(({ post }) => post.tagLabels))];
  const tagIdsByLabel = new Map(await Promise.all(uniqueTagLabels.map(async (label) => [label, await tagId(label)])));
  const mediaByPost = new Map();
  for (const item of prepared) {
    const media = new Map();
    for (const image of item.plan.images) {
      const key = cacheKey(item, image);
      const hash = fileHash(image.absolutePath);
      const cached = uploadCache[key];
      const uploaded = cached?.sha256 === hash && cached.media?.id && cached.media?.url
        ? cached.media
        : await uploadImage(item, image);
      uploadCache[key] = { sha256: hash, media: uploaded };
      writeJson(cachePath, uploadCache);
      media.set(image.path, { ...uploaded, altText: image.altText });
    }
    mediaByPost.set(item.post.slug, media);
  }

  // A second full scan keeps the collision guard immediately adjacent to the only draft-create request.
  await assertNoBlogCollisions(prepared);
  const draftPosts = prepared.map((item) => buildDraftPost(item, mediaByPost.get(item.post.slug), item.post.tagLabels.map((label) => tagIdsByLabel.get(label))));
  const created = await wixFetch('/blog/v3/bulk/draft-posts/create', {
    method: 'POST',
    body: { draftPosts, publish: false },
  });
  const results = created.results || [];
  const state = results.map((result, index) => {
    const metadataResult = result.itemMetadata || result;
    const originalIndex = Number.isInteger(metadataResult.originalIndex) ? metadataResult.originalIndex : index;
    return {
      originalIndex,
      slug: prepared[originalIndex]?.post.slug,
      draftId: metadataResult.id || null,
      success: metadataResult.success === true,
      error: result.error || metadataResult.error || null,
    };
  });
  writeJson(statePath, { runId, batch: BATCH_SLUG, targetStatus: 'UNPUBLISHED', createdAt: new Date().toISOString(), drafts: state });
  assert(results.length === prepared.length && state.every((result) => result.success && result.draftId), `Wix bulk draft creation was partial: ${JSON.stringify(state)}`);

  const readback = [];
  for (const result of state.sort((a, b) => a.originalIndex - b.originalIndex)) {
    const item = prepared[result.originalIndex];
    readback.push(verifyDraft(item, await fetchDraft(result.draftId)));
  }
  writeJson(readbackPath, { runId, batch: BATCH_SLUG, targetStatus: 'UNPUBLISHED', checkedAt: new Date().toISOString(), drafts: readback });
  console.log(JSON.stringify({ mode: 'CREATED_UNPUBLISHED', runId, batch: BATCH_SLUG, drafts: readback }, null, 2));
}

main().catch((error) => {
  console.error(`ERROR: ${error.stack || error.message}`);
  process.exit(1);
});
