#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_ID = '12ee5ea0-70a7-492f-8020-ffb27cbb630f';
const API_ROOT = 'https://www.wixapis.com';
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const WIDGET_ROOT = process.env.BERLINWALK_WIDGET_ROOT || path.resolve(SCRIPT_DIR, '..');
const BODY_PATH = path.join(WIDGET_ROOT, 'blog-drafts/weekend-in-berlin-48-hours.body.md');
const STATE_PATH = path.join(WIDGET_ROOT, 'blog-drafts/weekend-in-berlin-48-hours.wix.json');
const UPLOAD_CACHE_PATH = path.join(WIDGET_ROOT, 'output/qa/weekend-in-berlin-48-hours-20260715/wix-upload-cache.json');
const FAQ_DATA_PATH = path.join(WIDGET_ROOT, 'faq/data.json');
const MEMBER_ID = '5a08a3af-4b9b-4403-9de7-3e26eba72dc0';
const TOURIST_TIPS_CATEGORY_ID = '6da64e22-3360-42ec-a558-e906e4deeb19';
const EMBED_VERSION = '20260715w48h1';
const WIDGET_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/berlin-weekend-arrival-board/';

const POST = {
  title: 'Weekend in Berlin: A 48-Hour Itinerary That Fits Your Arrival',
  slug: 'weekend-in-berlin-48-hour-itinerary',
  seoTitle: 'Weekend in Berlin: A Realistic 48-Hour Itinerary',
  description: 'Plan a weekend in Berlin around your real arrival time: Friday evening, a central Saturday route, Bernauer Strasse and Mauerpark on Sunday.',
  excerpt: 'A realistic 48-hour Berlin itinerary for Friday-evening or Saturday-morning arrivals, with one central Saturday line, a slower Sunday and no cross-city race.',
  socialTitle: 'Weekend in Berlin: A 48-Hour Plan That Fits Your Arrival',
  socialDescription: 'Friday evening, one clear Saturday line and a slower Berlin Sunday, adjusted to the hours you really have.',
  hashtags: ['berlin', 'berlinwalk', 'weekendinberlin', '48hoursinberlin', 'berlinitinerary'],
  keywords: [
    'weekend in Berlin',
    '48 hours in Berlin',
    'Berlin weekend itinerary',
    'Berlin in two days',
    'first weekend in Berlin',
  ],
  tagLabels: ['Weekend in Berlin', '48 Hours in Berlin', 'Berlin Itinerary', 'Berlin Trip Planner', 'First Time in Berlin'],
  coverPath: 'blog-drafts/images/weekend-in-berlin-48-hours/optimized/01-museum-island-tv-tower.jpg',
  toolSlug: 'berlin-weekend-arrival-board',
};

const EMBEDS = {
  '{{quick-summary}}': {
    id: 'quick_summary_weekend_in_berlin_48_hours',
    url: `https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/?post=${POST.slug}&v=${EMBED_VERSION}`,
    height: '1180',
  },
  '{{widget:berlin-weekend-arrival-board}}': {
    id: 'widget_berlin_weekend_arrival_board',
    url: `${WIDGET_URL}?v=${EMBED_VERSION}`,
    height: '1800',
  },
  '{{faq}}': {
    id: 'faq_weekend_in_berlin_48_hours',
    url: `https://fenerszymanski.github.io/berlinwalk-widgets/faq/?post=${POST.slug}&v=${EMBED_VERSION}`,
    height: '1420',
  },
};

let nextId = 1;

function id(prefix) {
  return `${prefix}_${nextId++}`;
}

function args() {
  const list = process.argv.slice(2);
  const execute = list.includes('--create-unpublished-draft');
  return {
    dryRun: list.includes('--dry-run') || !execute,
    execute,
    preflight: list.includes('--preflight'),
    readback: list.includes('--readback'),
  };
}

function headers(extra = {}) {
  if (!process.env.WIX_API_KEY) throw new Error('Missing WIX_API_KEY. Run: source scripts/load-api-keys.sh');
  return { Authorization: process.env.WIX_API_KEY, 'wix-site-id': SITE_ID, ...extra };
}

async function readResponse(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

async function wixFetch(pathname, options = {}) {
  const response = await fetch(`${API_ROOT}${pathname}`, {
    method: options.method || 'GET',
    headers: {
      ...headers({ 'Content-Type': 'application/json' }),
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const body = await readResponse(response);
  if (!response.ok) {
    throw new Error(`Wix ${options.method || 'GET'} ${pathname} failed (${response.status}): ${JSON.stringify(body).slice(0, 900)}`);
  }
  return body;
}

function readJson(filePath, fallback = {}) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return fallback;
    throw error;
  }
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function imageDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) break;
      const marker = buffer[offset + 1];
      const length = buffer.readUInt16BE(offset + 2);
      if (marker >= 0xc0 && marker <= 0xc3) {
        return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
      }
      offset += 2 + length;
    }
  }
  if (buffer.toString('ascii', 1, 4) === 'PNG') return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  throw new Error(`Unsupported image format: ${filePath}`);
}

async function uploadImage(localPath, altText) {
  const absolute = path.isAbsolute(localPath) ? localPath : path.join(WIDGET_ROOT, localPath);
  const filename = path.basename(absolute);
  const mimeType = filename.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
  const { width, height } = imageDimensions(absolute);
  const generated = await wixFetch('/site-media/v1/files/generate-upload-url', {
    method: 'POST',
    body: { mimeType, fileName: filename, private: false, labels: ['blog', 'berlinwalk', POST.slug] },
  });
  if (!generated.uploadUrl) throw new Error(`Upload URL missing for ${filename}`);
  const uploaded = await fetch(generated.uploadUrl, { method: 'PUT', headers: { 'Content-Type': mimeType }, body: fs.readFileSync(absolute) });
  const uploadBody = await readResponse(uploaded);
  if (!uploaded.ok) throw new Error(`Upload failed for ${filename}: ${uploaded.status} ${JSON.stringify(uploadBody).slice(0, 500)}`);
  const file = uploadBody.file || uploadBody;
  const image = file.media?.image?.image || {};
  return { id: file.id, url: file.url, width: image.width || width, height: image.height || height, filename, altText };
}

function textNode(text, decorations = []) {
  return { type: 'TEXT', id: id('text'), nodes: [], textData: { text, decorations } };
}

function linkDecoration(url) {
  return { type: 'LINK', linkData: { link: { url, target: 'BLANK' } } };
}

function inlineNodes(markdown, inheritedDecorations = []) {
  const nodes = [];
  let i = 0;
  function pushText(value, decorations = inheritedDecorations) {
    if (value) nodes.push(textNode(value, decorations));
  }
  while (i < markdown.length) {
    if (markdown.startsWith('**', i)) {
      const end = markdown.indexOf('**', i + 2);
      if (end !== -1) {
        nodes.push(...inlineNodes(markdown.slice(i + 2, end), [...inheritedDecorations, { type: 'BOLD', fontWeightValue: 700 }]));
        i = end + 2;
        continue;
      }
    }
    if (markdown.startsWith('_', i)) {
      const end = markdown.indexOf('_', i + 1);
      if (end !== -1) {
        nodes.push(...inlineNodes(markdown.slice(i + 1, end), [...inheritedDecorations, { type: 'ITALIC' }]));
        i = end + 1;
        continue;
      }
    }
    if (markdown[i] === '[') {
      const textEnd = markdown.indexOf(']', i + 1);
      const urlStart = textEnd !== -1 ? markdown.indexOf('(', textEnd) : -1;
      const urlEnd = urlStart !== -1 ? markdown.indexOf(')', urlStart) : -1;
      if (textEnd !== -1 && urlStart === textEnd + 1 && urlEnd !== -1) {
        const label = markdown.slice(i + 1, textEnd);
        let url = markdown.slice(urlStart + 1, urlEnd);
        if (url.startsWith('/')) url = `https://www.berlinwalk.com${url}`;
        nodes.push(...inlineNodes(label, [...inheritedDecorations, linkDecoration(url)]));
        i = urlEnd + 1;
        continue;
      }
    }
    let next = markdown.length;
    for (const marker of ['**', '_', '[']) {
      const markerIndex = markdown.indexOf(marker, i + 1);
      if (markerIndex !== -1) next = Math.min(next, markerIndex);
    }
    pushText(markdown.slice(i, next));
    i = next;
  }
  return nodes.length ? nodes : [textNode('')];
}

function paragraph(text, lineHeight = '1.7') {
  return { type: 'PARAGRAPH', id: id('paragraph'), nodes: inlineNodes(text), paragraphData: { textStyle: { textAlignment: 'AUTO', lineHeight }, indentation: 0 } };
}

function captionParagraph(text) {
  const clean = text.replace(/^_/, '').replace(/_$/, '');
  const decorations = [
    { type: 'FONT_SIZE', fontSizeData: { unit: 'PX', value: 12 } },
    { type: 'ITALIC' },
  ];
  return {
    type: 'PARAGRAPH',
    id: id('caption'),
    nodes: inlineNodes(clean, decorations),
    paragraphData: { textStyle: { textAlignment: 'CENTER', lineHeight: '1.45' }, indentation: 0 },
  };
}

function heading(text, level) {
  return { type: 'HEADING', id: id('heading'), nodes: [textNode(text)], headingData: { level, textStyle: { textAlignment: 'AUTO' } } };
}

function htmlNode(embed) {
  return {
    type: 'HTML',
    id: embed.id,
    nodes: [],
    htmlData: {
      containerData: { width: { custom: '940' }, alignment: 'CENTER', spoiler: { enabled: false }, height: { custom: embed.height }, textWrap: true },
      url: embed.url,
      source: 'HTML',
      autoHeight: false,
    },
  };
}

function imageNode(media) {
  return {
    type: 'IMAGE',
    id: id('image'),
    nodes: [],
    imageData: {
      containerData: { width: { size: 'CONTENT' }, alignment: 'CENTER', textWrap: true },
      image: { src: { id: media.id }, width: media.width, height: media.height },
      altText: media.altText,
    },
  };
}

function bulletList(items) {
  return {
    type: 'BULLETED_LIST',
    id: id('bulleted_list'),
    nodes: items.map((text) => ({ type: 'LIST_ITEM', id: id('list_item'), nodes: [paragraph(text, '1.6')] })),
  };
}

function parseMarkdown(markdown, uploadedByPath = new Map()) {
  nextId = 1;
  const nodes = [];
  const lines = markdown.split(/\r?\n/);
  let paragraphBuffer = [];
  let listBuffer = [];
  let nextParagraphIsCaption = false;
  function flushList() {
    if (!listBuffer.length) return;
    nodes.push(bulletList(listBuffer));
    listBuffer = [];
  }
  function flushParagraph() {
    if (!paragraphBuffer.length) return;
    flushList();
    const text = paragraphBuffer.join(' ').replace(/\s+/g, ' ').trim();
    nodes.push(nextParagraphIsCaption ? captionParagraph(text) : paragraph(text));
    nextParagraphIsCaption = false;
    paragraphBuffer = [];
  }
  function requireCaptionBefore(kind) {
    if (nextParagraphIsCaption) throw new Error(`Markdown image must be followed by a caption paragraph before ${kind}.`);
  }
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }
    if (EMBEDS[line]) {
      flushParagraph();
      flushList();
      requireCaptionBefore('an embed');
      nodes.push(htmlNode(EMBEDS[line]));
      continue;
    }
    const imageMatch = line.match(/^!\[(.*?)]\((.*?)\)$/);
    if (imageMatch) {
      flushParagraph();
      flushList();
      requireCaptionBefore('another image');
      const relPath = imageMatch[2];
      const media = uploadedByPath.get(relPath);
      if (!media) throw new Error(`Missing uploaded media for markdown image: ${relPath}`);
      nodes.push(imageNode({ ...media, altText: imageMatch[1] }));
      nextParagraphIsCaption = true;
      continue;
    }
    const h1 = line.match(/^# (.+)$/);
    if (h1) throw new Error('Publish body must not include a Markdown H1.');
    const h2 = line.match(/^## (.+)$/);
    if (h2) {
      flushParagraph();
      flushList();
      requireCaptionBefore('an H2');
      nodes.push(heading(h2[1], 2));
      continue;
    }
    const h3 = line.match(/^### (.+)$/);
    if (h3) {
      flushParagraph();
      flushList();
      requireCaptionBefore('an H3');
      nodes.push(heading(h3[1], 3));
      continue;
    }
    const bullet = line.match(/^-\s+(.+)$/);
    if (bullet) {
      flushParagraph();
      requireCaptionBefore('a list');
      listBuffer.push(bullet[1]);
      continue;
    }
    flushList();
    paragraphBuffer.push(line);
  }
  flushParagraph();
  flushList();
  requireCaptionBefore('the end of the document');
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

function collectMarkdownImages(markdown) {
  const images = [];
  const re = /^!\[(.*?)]\((.*?)\)$/gm;
  let match;
  while ((match = re.exec(markdown)) !== null) images.push({ altText: match[1], relPath: match[2] });
  return images;
}

function markdownToPlainText(value) {
  return String(value || '').replace(/\*\*/g, '').replace(/_/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim();
}

function faqSchema() {
  const faq = readJson(FAQ_DATA_PATH)[POST.slug];
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (faq.items || []).map((item) => ({
      '@type': 'Question',
      name: markdownToPlainText(item.q),
      acceptedAnswer: { '@type': 'Answer', text: markdownToPlainText(item.a) },
    })),
  };
}

function seoData(cover) {
  const canonical = `https://www.berlinwalk.com/post/${POST.slug}`;
  const blogPosting = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: POST.title,
    description: POST.description,
    image: [cover.url],
    author: { '@type': 'Person', name: 'Yusuf Ucuz' },
    publisher: { '@type': 'Organization', name: 'BerlinWalk', url: 'https://www.berlinwalk.com' },
    mainEntityOfPage: canonical,
    inLanguage: 'en',
  };
  const meta = (props, custom = true) => ({ type: 'meta', props, children: '', custom, disabled: false });
  return {
    tags: [
      { type: 'title', children: POST.seoTitle, custom: false, disabled: false },
      meta({ name: 'description', content: POST.description }, false),
      // canonical: omitted on purpose. Wix auto self-canonicalizes blog posts; a custom canonical set to the final short slug mismatches the title-derived DRAFT url and trips the SEO Assistant "canonical refers to a different URL" warning until publish.
      meta({ name: 'robots', content: 'index, follow, max-image-preview:large' }, true),
      meta({ property: 'og:title', content: POST.socialTitle }, false),
      meta({ property: 'og:description', content: POST.socialDescription }, false),
      meta({ property: 'og:type', content: 'article' }, true),
      meta({ property: 'og:url', content: canonical }, true),
      meta({ property: 'og:image', content: cover.url }, true),
      meta({ property: 'og:image:alt', content: cover.altText }, true),
      meta({ name: 'twitter:card', content: 'summary_large_image' }, true),
      meta({ name: 'twitter:title', content: POST.socialTitle }, true),
      meta({ name: 'twitter:description', content: POST.socialDescription }, true),
      meta({ name: 'twitter:image', content: cover.url }, true),
      meta({ name: 'twitter:image:alt', content: cover.altText }, true),
      { type: 'script', props: { type: 'application/ld+json' }, children: JSON.stringify(blogPosting), custom: true, disabled: false },
      { type: 'script', props: { type: 'application/ld+json' }, children: JSON.stringify(faqSchema()), custom: true, disabled: false },
    ],
    settings: { preventAutoRedirect: false, keywords: POST.keywords.map((term, index) => ({ term, isMain: index === 0 })) },
  };
}

async function findExistingTag(label) {
  try {
    const existing = await wixFetch(`/blog/v3/tags/labels/${encodeURIComponent(label)}`, { method: 'GET' });
    const tag = existing.tag || existing;
    return tag.id || null;
  } catch (error) {
    console.warn(`WARN existing tag not found, leaving label out of tagIds: ${label}`);
    return null;
  }
}

async function findExistingDraft() {
  const state = readJson(STATE_PATH, {});
  if (state.draftId) {
    try {
      const payload = await wixFetch(`/blog/v3/draft-posts/${encodeURIComponent(state.draftId)}`, { method: 'GET' });
      const draft = payload.draftPost || payload;
      if (draft?.id) return draft;
    } catch (error) {
      console.warn(`WARN state draft lookup failed for ${state.draftId}: ${error.message}`);
    }
  }
  const titlePayload = await wixFetch('/blog/v3/draft-posts/query', {
    method: 'POST',
    body: { query: { filter: { title: POST.title }, paging: { limit: 1 } } },
  });
  if (titlePayload.draftPosts?.[0]) return titlePayload.draftPosts[0];
  return findBySlug('/blog/v3/draft-posts/query', 'draftPosts');
}

async function findPublishedCollision() {
  const titlePayload = await wixFetch('/blog/v3/posts/query', {
    method: 'POST',
    body: { query: { filter: { title: POST.title }, paging: { limit: 1 } } },
  });
  if (titlePayload.posts?.[0]) return titlePayload.posts[0];
  return findBySlug('/blog/v3/posts/query', 'posts');
}

async function findBySlug(pathname, collectionKey) {
  const limit = 100;
  let offset = 0;
  while (offset < 2000) {
    const payload = await wixFetch(pathname, {
      method: 'POST',
      body: { query: { paging: { limit, offset } } },
    });
    const items = payload[collectionKey] || [];
    const match = items.find((item) => item.seoSlug === POST.slug || item.slugs?.includes(POST.slug));
    if (match) return match;
    if (items.length < limit) return null;
    offset += items.length;
  }
  throw new Error(`Collision preflight exceeded 2000 ${collectionKey} records`);
}

async function verifyDraft(draftId) {
  const payload = await wixFetch(`/blog/v3/draft-posts/${encodeURIComponent(draftId)}?fieldsets=RICH_CONTENT`, { method: 'GET' });
  return payload.draftPost || payload;
}

function draftMedia(cover) {
  return {
    wixMedia: { image: { id: cover.id, url: cover.url, height: cover.height, width: cover.width, altText: cover.altText, filename: cover.filename } },
    displayed: true,
    custom: false,
    altText: cover.altText,
  };
}

function captionStyleCount(richContent) {
  return (richContent.nodes || []).filter((node) => {
    if (node.type !== 'PARAGRAPH') return false;
    const textStyle = node.paragraphData?.textStyle || {};
    const decorations = node.nodes?.flatMap((child) => child.textData?.decorations || []) || [];
    return textStyle.textAlignment === 'CENTER'
      && String(textStyle.lineHeight) === '1.45'
      && decorations.some((d) => d.type === 'ITALIC')
      && decorations.some((d) => d.type === 'FONT_SIZE' && Number(d.fontSizeData?.value) === 12);
  }).length;
}

async function createOrUpdateDraft({ dryRun }) {
  const body = fs.readFileSync(BODY_PATH, 'utf8').trim();
  if (/^#\s+/m.test(body)) throw new Error('Publish body contains a Markdown H1.');
  const markdownImages = collectMarkdownImages(body);
  let existing = null;
  if (!dryRun) {
    existing = await findExistingDraft();
    const publishedCollision = await findPublishedCollision();
    if (publishedCollision) {
      throw new Error(`Published post collision for title/slug: ${publishedCollision.id}`);
    }
    if (existing && existing.status !== 'UNPUBLISHED') {
      throw new Error(`Refusing to patch non-draft post ${existing.id}: status=${existing.status}`);
    }
    console.log(`OK collision preflight: ${existing ? `updating draft ${existing.id}` : 'no matching draft or published post'}`);
  }
  const uploadedByPath = new Map();
  if (dryRun) {
    markdownImages.forEach((image, index) => {
      const dims = imageDimensions(path.join(WIDGET_ROOT, image.relPath));
      uploadedByPath.set(image.relPath, { id: `dry_image_${index + 1}`, url: `dry://${path.basename(image.relPath)}`, width: dims.width, height: dims.height, filename: path.basename(image.relPath), altText: image.altText });
    });
  } else {
    const uploadCache = readJson(UPLOAD_CACHE_PATH, {});
    for (const image of markdownImages) {
      let uploaded = uploadCache[image.relPath];
      if (uploaded) {
        console.log(`OK cached upload ${path.basename(image.relPath)} -> ${uploaded.id}`);
      } else {
        uploaded = await uploadImage(image.relPath, image.altText);
        uploadCache[image.relPath] = uploaded;
        writeJson(UPLOAD_CACHE_PATH, uploadCache);
        console.log(`OK uploaded ${path.basename(image.relPath)} -> ${uploaded.id}`);
      }
      uploadedByPath.set(image.relPath, { ...uploaded, altText: image.altText });
    }
  }
  const COVER_ALT = 'Bode Museum on Museum Island beside the River Spree, with the Berlin TV Tower behind it.';
  if (!uploadedByPath.has(POST.coverPath)) {
    if (dryRun) {
      const dims = imageDimensions(path.join(WIDGET_ROOT, POST.coverPath));
      uploadedByPath.set(POST.coverPath, { id: 'dry_cover', url: `dry://${path.basename(POST.coverPath)}`, width: dims.width, height: dims.height, filename: path.basename(POST.coverPath), altText: COVER_ALT });
    } else {
      const uploadCache = readJson(UPLOAD_CACHE_PATH, {});
      let uploaded = uploadCache[POST.coverPath];
      if (uploaded) {
        console.log(`OK cached cover ${path.basename(POST.coverPath)} -> ${uploaded.id}`);
      } else {
        uploaded = await uploadImage(POST.coverPath, COVER_ALT);
        uploadCache[POST.coverPath] = uploaded;
        writeJson(UPLOAD_CACHE_PATH, uploadCache);
        console.log(`OK uploaded cover ${path.basename(POST.coverPath)} -> ${uploaded.id}`);
      }
      uploadedByPath.set(POST.coverPath, { ...uploaded, altText: COVER_ALT });
    }
  }
  const cover = uploadedByPath.get(POST.coverPath);
  if (!cover) throw new Error(`Missing cover upload for ${POST.coverPath}`);
  const richContent = parseMarkdown(body, uploadedByPath);
  const imageCount = richContent.nodes.filter((node) => node.type === 'IMAGE').length;
  const htmlCount = richContent.nodes.filter((node) => node.type === 'HTML').length;
  const h1Count = richContent.nodes.filter((node) => node.type === 'HEADING' && Number(node.headingData?.level) === 1).length;
  const captionCount = captionStyleCount(richContent);
  const richBytes = Buffer.byteLength(JSON.stringify(richContent), 'utf8');
  console.log(`OK richContent: ${richContent.nodes.length} nodes, ${imageCount} images, ${htmlCount} HTML embeds, h1=${h1Count}, captions=${captionCount}, ${richBytes} bytes`);
  if (imageCount !== captionCount) throw new Error(`Caption style count mismatch: images=${imageCount}, captions=${captionCount}`);
  if (imageCount !== 6) throw new Error(`Expected 6 inline images, got ${imageCount}`);
  if (htmlCount !== 3) throw new Error(`Expected 3 HTML embeds, got ${htmlCount}`);
  if (h1Count !== 0) throw new Error(`Body H1 count must be 0, got ${h1Count}`);
  if (dryRun) return { dryRun: true, imageCount, htmlCount, richBytes };

  const tagIds = [];
  for (const label of POST.tagLabels) {
    const tagId = await findExistingTag(label);
    if (tagId) {
      tagIds.push(tagId);
      console.log(`OK existing tag "${label}" -> ${tagId}`);
    }
  }

  const wordCount = body.split(/\s+/).filter(Boolean).length;
  const draftPost = {
    title: POST.title,
    memberId: MEMBER_ID,
    excerpt: POST.excerpt,
    featured: false,
    commentingEnabled: false,
    language: 'en',
    categoryIds: [TOURIST_TIPS_CATEGORY_ID],
    hashtags: POST.hashtags,
    tagIds,
    minutesToRead: Math.max(3, Math.round(wordCount / 220)),
    seoSlug: POST.slug,
    slugs: [POST.slug],
    seoData: seoData(cover),
    richContent,
    media: draftMedia(cover),
  };
  const result = existing
    ? await wixFetch(`/blog/v3/draft-posts/${encodeURIComponent(existing.id)}`, { method: 'PATCH', body: { draftPost: { id: existing.id, ...draftPost }, fieldsets: ['RICH_CONTENT'] } })
    : await wixFetch('/blog/v3/draft-posts', { method: 'POST', body: { draftPost, fieldsets: ['RICH_CONTENT'], publish: false } });
  const draft = result.draftPost || result;
  const draftId = draft?.id || existing?.id;
  if (!draftId) throw new Error('Draft operation returned no ID');
  const verified = await verifyDraft(draftId);
  const verifiedImages = verified.richContent?.nodes?.filter((node) => node.type === 'IMAGE').length || 0;
  const verifiedHtml = verified.richContent?.nodes?.filter((node) => node.type === 'HTML').length || 0;
  const verifiedH1 = verified.richContent?.nodes?.filter((node) => node.type === 'HEADING' && Number(node.headingData?.level) === 1).length || 0;
  const verifiedCaptions = captionStyleCount(verified.richContent || {});
  writeJson(STATE_PATH, {
    draftId,
    editUrl: `https://manage.wix.com/dashboard/${SITE_ID}/blog/drafts/${draftId}/edit`,
    publicUrl: `https://www.berlinwalk.com/post/${POST.slug}`,
    updatedAt: new Date().toISOString(),
  });
  console.log(`OK ${existing ? 'updated' : 'created'} Wix draft: ${draftId}`);
  console.log(`OK verified: status=${verified.status}, hasUnpublishedChanges=${verified.hasUnpublishedChanges}, slug=${verified.seoSlug}, images=${verifiedImages}, htmlEmbeds=${verifiedHtml}, h1=${verifiedH1}, captions=${verifiedCaptions}`);
  console.log(`OK edit URL: https://manage.wix.com/dashboard/${SITE_ID}/blog/drafts/${draftId}/edit`);
  if (verified.status !== 'UNPUBLISHED') throw new Error(`Draft must remain UNPUBLISHED, got ${verified.status}`);
  if (verified.seoSlug !== POST.slug) throw new Error(`Draft slug mismatch: ${verified.seoSlug}`);
  if (verifiedImages !== 6 || verifiedHtml !== 3 || verifiedH1 !== 0 || verifiedCaptions !== 6) {
    throw new Error(`Draft structure mismatch after write: images=${verifiedImages}, embeds=${verifiedHtml}, h1=${verifiedH1}, captions=${verifiedCaptions}`);
  }
  return verified;
}

async function readback() {
  const state = readJson(STATE_PATH, {});
  const draftId = state.draftId || (await findExistingDraft())?.id;
  if (!draftId) throw new Error('No draft ID found for readback');
  const draft = await verifyDraft(draftId);
  const nodes = draft.richContent?.nodes || [];
  const imageNodes = nodes.filter((node) => node.type === 'IMAGE');
  const htmlNodes = nodes.filter((node) => node.type === 'HTML');
  const images = imageNodes.length;
  const embeds = htmlNodes.length;
  const h1 = nodes.filter((node) => node.type === 'HEADING' && Number(node.headingData?.level) === 1).length;
  const captions = captionStyleCount(draft.richContent || {});
  const seoTags = draft.seoData?.tags?.length || 0;
  const bold = nodes.flatMap((n) => n.nodes || []).flatMap((c) => c.textData?.decorations || []).filter((d) => d.type === 'BOLD').length;
  const bulletLists = nodes.filter((n) => n.type === 'BULLETED_LIST').length;
  const listItems = nodes.filter((n) => n.type === 'BULLETED_LIST').reduce((sum, n) => sum + (n.nodes?.length || 0), 0);
  const serialized = JSON.stringify(draft.richContent || {});
  const leakTerms = ['AI-generated', 'ChatGPT', 'Codex', 'Claude', 'prompt', 'workflow'].filter((term) => serialized.includes(term));
  console.log(JSON.stringify({
    id: draftId,
    title: draft.title,
    status: draft.status,
    hasUnpublishedChanges: draft.hasUnpublishedChanges,
    seoSlug: draft.seoSlug,
    categoryIds: draft.categoryIds,
    tagIds: draft.tagIds,
    images,
    imagesWithAlt: imageNodes.filter((node) => node.imageData?.altText?.trim()).length,
    embeds,
    embedUrls: htmlNodes.map((node) => node.htmlData?.url || ''),
    embedHeights: htmlNodes.map((node) => node.htmlData?.containerData?.height?.custom || ''),
    h1,
    captions,
    bold,
    bulletLists,
    listItems,
    seoTags,
    leakTerms,
    editUrl: `https://manage.wix.com/dashboard/${SITE_ID}/blog/drafts/${draftId}/edit`,
    publicUrl: `https://www.berlinwalk.com/post/${POST.slug}`,
  }, null, 2));
  if (draft.status !== 'UNPUBLISHED') throw new Error(`Draft must remain UNPUBLISHED, got ${draft.status}`);
  if (draft.seoSlug !== POST.slug) throw new Error(`Draft slug mismatch: ${draft.seoSlug}`);
  if (images !== 6 || embeds !== 3 || h1 !== 0 || captions !== 6 || imageNodes.some((node) => !node.imageData?.altText?.trim())) {
    throw new Error(`Draft readback structure mismatch: images=${images}, embeds=${embeds}, h1=${h1}, captions=${captions}`);
  }
  if (leakTerms.length) throw new Error(`Internal production terms leaked into rich content: ${leakTerms.join(', ')}`);
  return draft;
}

async function preflight() {
  const existing = await findExistingDraft();
  const publishedCollision = await findPublishedCollision();
  console.log(JSON.stringify({
    title: POST.title,
    seoSlug: POST.slug,
    existingDraftId: existing?.id || null,
    publishedCollisionId: publishedCollision?.id || null,
    safeToCreate: !existing && !publishedCollision,
    safeToUpdateDraft: Boolean(existing) && !publishedCollision,
  }, null, 2));
  if (publishedCollision) throw new Error(`Published post collision for title/slug: ${publishedCollision.id}`);
}

async function main() {
  const options = args();
  if (options.preflight) await preflight();
  else if (options.readback) await readback();
  else await createOrUpdateDraft({ dryRun: options.dryRun });
}

main().catch((error) => {
  console.error('ERROR:', error.message || error);
  process.exit(1);
});
