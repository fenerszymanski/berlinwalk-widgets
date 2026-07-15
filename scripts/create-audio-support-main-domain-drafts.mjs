#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const WIDGET_ROOT = process.env.BERLINWALK_WIDGET_ROOT || path.resolve(SCRIPT_DIR, '..');
const SITE_ID = '12ee5ea0-70a7-492f-8020-ffb27cbb630f';
const MEMBER_ID = '5a08a3af-4b9b-4403-9de7-3e26eba72dc0';
const API_ROOT = 'https://www.wixapis.com';
const TOURIST_TIPS = '6da64e22-3360-42ec-a558-e906e4deeb19';
const TOUR_ROUTE = 'f9b304de-4490-4535-b9e9-64b8f2ff63b0';
const FAQ_DATA_PATH = path.join(WIDGET_ROOT, 'faq', 'data.json');
const QS_DATA_PATH = path.join(WIDGET_ROOT, 'quick-summary', 'data.json');
const UPLOAD_CACHE_PATH = path.join(WIDGET_ROOT, 'tmp', 'audio-support-main-domain-20260715', 'wix-upload-cache.json');
const EMBED_VERSION = '20260715audio-support-v1';

const POSTS = {
  'berlin-audio-guide-app-vs-no-app': {
    title: 'Berlin Audio Guide App vs No-App Audio Tour: Which Is Better?',
    slug: 'berlin-audio-guide-app-vs-no-app',
    seoTitle: 'Berlin Audio Guide App vs No-App Audio Tour',
    description: 'Compare a Berlin audio guide app with a no-app browser tour: offline backup, battery, data, GPS and which format fits one focused walk.',
    excerpt: 'A practical Berlin field test for audio guide apps, no-app browser routes and MP3 backups. Compare setup, battery, offline use and all five BerlinWalk routes before choosing.',
    socialTitle: 'Berlin Audio Guide App vs No-App: The Real Field Test',
    socialDescription: 'The best format is the one that still works outside Nordbahnhof. Compare apps, browser routes and MP3 backups before your Berlin walk.',
    hashtags: ['berlin', 'berlinwalk', 'audioguide', 'selfguidedtour', 'berlintravel'],
    keywords: ['Berlin audio guide app', 'no-app audio tour Berlin', 'Berlin audio tour offline', 'Berlin walking tour audio guide', 'Berlin audio guide comparison'],
    tagLabels: ['Berlin Audio Guides', 'Self-Guided Walks', 'Berlin Travel Tips', 'Audio Tours'],
    categoryIds: [TOURIST_TIPS],
    bodyPath: 'blog-drafts/berlin-audio-guide-app-vs-no-app.body.md',
    statePath: 'blog-drafts/berlin-audio-guide-app-vs-no-app.wix.json',
    coverPath: 'blog-drafts/images/hidden-places-central-berlin/optimized/05-alexanderplatz-world-clock.jpg',
    coverAlt: 'The World Clock and TV Tower at Alexanderplatz, where several Berlin audio walks begin or finish.',
    widgetSlug: 'berlin-audio-format-field-test',
    expectedImages: 5,
    embeds: {
      '{{quick-summary}}': { id: 'quick_summary_audio_app_vs_no_app', url: `https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/?post=berlin-audio-guide-app-vs-no-app&v=${EMBED_VERSION}`, height: '1250' },
      '{{widget:berlin-audio-format-field-test}}': { id: 'widget_audio_format_field_test', url: `https://fenerszymanski.github.io/berlinwalk-widgets/berlin-audio-format-field-test/?v=${EMBED_VERSION}`, height: '2100' },
      '{{faq}}': { id: 'faq_audio_app_vs_no_app', url: `https://fenerszymanski.github.io/berlinwalk-widgets/faq/?post=berlin-audio-guide-app-vs-no-app&v=${EMBED_VERSION}`, height: '1500' },
    },
  },
  'self-guided-berlin-walking-tour-audio-guide': {
    title: 'Self-Guided Berlin Walking Tour with Audio: How to Choose a Route',
    slug: 'self-guided-berlin-walking-tour-audio-guide',
    seoTitle: 'Self-Guided Berlin Walking Tour with Audio',
    description: 'Choose a self-guided Berlin walking tour with audio by real start point, finish, duration and subject. Compare five €4.99 routes and a free sampler.',
    excerpt: 'Compare the real start, finish and walking time of five self-guided Berlin audio routes. Use the route map, offline checklist and guide-versus-audio rule before setting off.',
    socialTitle: 'Self-Guided Berlin Walking Tour with Audio: Pick the Right Route',
    socialDescription: 'See every route start and finish on one map, then choose a Berlin audio walk that fits the real shape of your day.',
    hashtags: ['berlin', 'berlinwalk', 'selfguidedwalk', 'audiotour', 'berlinroute'],
    keywords: ['self-guided Berlin walking tour with audio', 'Berlin walking tour audio guide', 'self-guided Berlin tour', 'Berlin audio walking tour', 'Berlin audio route'],
    tagLabels: ['Berlin Audio Guides', 'Self-Guided Walks', 'Berlin Tour Routes', 'Berlin Travel Tips'],
    categoryIds: [TOUR_ROUTE, TOURIST_TIPS],
    bodyPath: 'blog-drafts/self-guided-berlin-walking-tour-audio-guide.body.md',
    statePath: 'blog-drafts/self-guided-berlin-walking-tour-audio-guide.wix.json',
    coverPath: 'blog-drafts/images/berlin-wall-memorial-bernauer-strasse/optimized/01-bernauer-memorial-strip-cover.jpg',
    coverAlt: 'The preserved former border strip at the Berlin Wall Memorial on Bernauer Strasse.',
    widgetSlug: 'berlin-audio-route-map',
    expectedImages: 5,
    embeds: {
      '{{quick-summary}}': { id: 'quick_summary_self_guided_audio', url: `https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/?post=self-guided-berlin-walking-tour-audio-guide&v=${EMBED_VERSION}`, height: '1250' },
      '{{widget:berlin-audio-route-map}}': { id: 'widget_berlin_audio_route_map', url: `https://fenerszymanski.github.io/berlinwalk-widgets/berlin-audio-route-map/?v=${EMBED_VERSION}`, height: '1900' },
      '{{faq}}': { id: 'faq_self_guided_audio', url: `https://fenerszymanski.github.io/berlinwalk-widgets/faq/?post=self-guided-berlin-walking-tour-audio-guide&v=${EMBED_VERSION}`, height: '1500' },
    },
  },
};

function parseArgs() {
  const args = process.argv.slice(2);
  const slugIndex = args.indexOf('--slug');
  const slug = slugIndex >= 0 ? args[slugIndex + 1] : 'all';
  const modes = ['--write', '--preflight', '--readback'].filter((flag) => args.includes(flag));
  if (modes.length > 1) throw new Error(`Choose only one network mode: ${modes.join(', ')}`);
  if (slug !== 'all' && !POSTS[slug]) throw new Error(`Unknown --slug ${slug}`);
  return {
    slug,
    mode: args.includes('--write') ? 'write' : args.includes('--preflight') ? 'preflight' : args.includes('--readback') ? 'readback' : 'dry-run',
  };
}

function selectedPosts(slug) {
  return slug === 'all' ? Object.values(POSTS) : [POSTS[slug]];
}

function readJson(filePath, fallback = {}) {
  try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return fallback; throw error; }
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function absolute(relativePath) { return path.join(WIDGET_ROOT, relativePath); }

function imageDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) break;
      const marker = buffer[offset + 1];
      const length = buffer.readUInt16BE(offset + 2);
      if (marker >= 0xc0 && marker <= 0xc3) return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
      offset += 2 + length;
    }
  }
  if (buffer.toString('ascii', 1, 4) === 'PNG') return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  throw new Error(`Unsupported image format: ${filePath}`);
}

function requireKey() {
  if (!process.env.WIX_API_KEY) throw new Error('Missing WIX_API_KEY. From the workspace root run: source scripts/load-api-keys.sh');
}

function headers(extra = {}) {
  requireKey();
  return { Authorization: process.env.WIX_API_KEY, 'wix-site-id': SITE_ID, ...extra };
}

async function readResponse(response) {
  const text = await response.text();
  if (!text) return {};
  try { return JSON.parse(text); }
  catch { return { raw: text }; }
}

async function wixFetch(pathname, options = {}) {
  const response = await fetch(`${API_ROOT}${pathname}`, {
    method: options.method || 'GET',
    headers: { ...headers({ 'Content-Type': 'application/json' }), ...(options.headers || {}) },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const body = await readResponse(response);
  if (!response.ok) throw new Error(`Wix ${options.method || 'GET'} ${pathname} failed (${response.status}): ${JSON.stringify(body).slice(0, 900)}`);
  return body;
}

async function uploadImage(post, localPath, altText) {
  const filePath = absolute(localPath);
  const filename = path.basename(filePath);
  const mimeType = filename.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
  const fallback = imageDimensions(filePath);
  const generated = await wixFetch('/site-media/v1/files/generate-upload-url', {
    method: 'POST',
    body: { mimeType, fileName: filename, private: false, labels: ['blog', 'berlinwalk', post.slug] },
  });
  if (!generated.uploadUrl) throw new Error(`Upload URL missing for ${filename}`);
  const uploaded = await fetch(generated.uploadUrl, { method: 'PUT', headers: { 'Content-Type': mimeType }, body: fs.readFileSync(filePath) });
  const payload = await readResponse(uploaded);
  if (!uploaded.ok) throw new Error(`Upload failed for ${filename}: ${uploaded.status} ${JSON.stringify(payload).slice(0, 500)}`);
  const file = payload.file || payload;
  const image = file.media?.image?.image || {};
  return { id: file.id, url: file.url, width: image.width || fallback.width, height: image.height || fallback.height, filename, altText };
}

let nextId = 1;
function id(prefix) { return `${prefix}_${nextId++}`; }
function textNode(text, decorations = []) { return { type: 'TEXT', id: id('text'), nodes: [], textData: { text, decorations } }; }
function linkDecoration(url) { return { type: 'LINK', linkData: { link: { url, target: 'BLANK' } } }; }

function inlineNodes(markdown, inherited = []) {
  const nodes = [];
  let cursor = 0;
  function pushText(value, decorations = inherited) { if (value) nodes.push(textNode(value, decorations)); }
  while (cursor < markdown.length) {
    if (markdown.startsWith('**', cursor)) {
      const end = markdown.indexOf('**', cursor + 2);
      if (end !== -1) {
        nodes.push(...inlineNodes(markdown.slice(cursor + 2, end), [...inherited, { type: 'BOLD', fontWeightValue: 700 }]));
        cursor = end + 2;
        continue;
      }
    }
    if (markdown.startsWith('_', cursor)) {
      const end = markdown.indexOf('_', cursor + 1);
      if (end !== -1) {
        nodes.push(...inlineNodes(markdown.slice(cursor + 1, end), [...inherited, { type: 'ITALIC' }]));
        cursor = end + 1;
        continue;
      }
    }
    if (markdown[cursor] === '[') {
      const labelEnd = markdown.indexOf(']', cursor + 1);
      const urlStart = labelEnd !== -1 ? markdown.indexOf('(', labelEnd) : -1;
      const urlEnd = urlStart !== -1 ? markdown.indexOf(')', urlStart) : -1;
      if (labelEnd !== -1 && urlStart === labelEnd + 1 && urlEnd !== -1) {
        const label = markdown.slice(cursor + 1, labelEnd);
        let url = markdown.slice(urlStart + 1, urlEnd);
        if (url.startsWith('/')) url = `https://www.berlinwalk.com${url}`;
        nodes.push(...inlineNodes(label, [...inherited, linkDecoration(url)]));
        cursor = urlEnd + 1;
        continue;
      }
    }
    let next = markdown.length;
    for (const marker of ['**', '_', '[']) {
      const index = markdown.indexOf(marker, cursor + 1);
      if (index !== -1) next = Math.min(next, index);
    }
    pushText(markdown.slice(cursor, next));
    cursor = next;
  }
  return nodes.length ? nodes : [textNode('')];
}

function paragraph(text, lineHeight = '1.7') {
  return { type: 'PARAGRAPH', id: id('paragraph'), nodes: inlineNodes(text), paragraphData: { textStyle: { textAlignment: 'AUTO', lineHeight }, indentation: 0 } };
}

function captionParagraph(text) {
  const clean = text.replace(/^_/, '').replace(/_$/, '');
  const decorations = [{ type: 'FONT_SIZE', fontSizeData: { unit: 'PX', value: 12 } }, { type: 'ITALIC' }];
  return { type: 'PARAGRAPH', id: id('caption'), nodes: inlineNodes(clean, decorations), paragraphData: { textStyle: { textAlignment: 'CENTER', lineHeight: '1.45' }, indentation: 0 } };
}

function heading(text, level) { return { type: 'HEADING', id: id('heading'), nodes: [textNode(text)], headingData: { level, textStyle: { textAlignment: 'AUTO' } } }; }

function htmlNode(embed) {
  return {
    type: 'HTML', id: embed.id, nodes: [],
    htmlData: {
      containerData: { width: { custom: '940' }, alignment: 'CENTER', spoiler: { enabled: false }, height: { custom: embed.height }, textWrap: true },
      url: embed.url, source: 'HTML', autoHeight: false,
    },
  };
}

function imageNode(media) {
  return {
    type: 'IMAGE', id: id('image'), nodes: [],
    imageData: {
      containerData: { width: { size: 'CONTENT' }, alignment: 'CENTER', textWrap: true },
      image: { src: { id: media.id }, width: media.width, height: media.height },
      altText: media.altText,
    },
  };
}

function bulletList(items) {
  return { type: 'BULLETED_LIST', id: id('bulleted_list'), nodes: items.map((item) => ({ type: 'LIST_ITEM', id: id('list_item'), nodes: [paragraph(item, '1.6')] })) };
}

function parseMarkdown(post, markdown, uploadedByPath) {
  nextId = 1;
  const nodes = [];
  let paragraphs = [];
  let bullets = [];
  let captionExpected = false;
  function flushBullets() { if (bullets.length) { nodes.push(bulletList(bullets)); bullets = []; } }
  function flushParagraphs() {
    if (!paragraphs.length) return;
    flushBullets();
    const text = paragraphs.join(' ').replace(/\s+/g, ' ').trim();
    nodes.push(captionExpected ? captionParagraph(text) : paragraph(text));
    captionExpected = false;
    paragraphs = [];
  }
  function requireCaption(context) { if (captionExpected) throw new Error(`${post.slug}: image must be followed by a caption before ${context}`); }
  for (const raw of markdown.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) { flushParagraphs(); flushBullets(); continue; }
    if (post.embeds[line]) { flushParagraphs(); flushBullets(); requireCaption('embed'); nodes.push(htmlNode(post.embeds[line])); continue; }
    const image = line.match(/^!\[(.*?)]\((.*?)\)$/);
    if (image) {
      flushParagraphs(); flushBullets(); requireCaption('another image');
      const media = uploadedByPath.get(image[2]);
      if (!media) throw new Error(`${post.slug}: missing uploaded media for ${image[2]}`);
      nodes.push(imageNode({ ...media, altText: image[1] }));
      captionExpected = true;
      continue;
    }
    if (/^#\s+/.test(line)) throw new Error(`${post.slug}: publish body must not contain a Markdown H1`);
    const h2 = line.match(/^##\s+(.+)$/);
    if (h2) { flushParagraphs(); flushBullets(); requireCaption('H2'); nodes.push(heading(h2[1], 2)); continue; }
    const h3 = line.match(/^###\s+(.+)$/);
    if (h3) { flushParagraphs(); flushBullets(); requireCaption('H3'); nodes.push(heading(h3[1], 3)); continue; }
    const bullet = line.match(/^-\s+(.+)$/);
    if (bullet) { flushParagraphs(); requireCaption('list'); bullets.push(bullet[1]); continue; }
    flushBullets();
    paragraphs.push(line);
  }
  flushParagraphs(); flushBullets(); requireCaption('end of document');
  const now = new Date().toISOString();
  return {
    nodes,
    metadata: { version: 1, createdTimestamp: now, updatedTimestamp: now },
    documentStyle: { paragraph: { lineHeight: '1.7' }, headerOne: { lineHeight: '1.12' }, headerTwo: { lineHeight: '1.15' }, headerThree: { lineHeight: '1.18' } },
  };
}

function collectImages(markdown) {
  const images = [];
  const regex = /^!\[(.*?)]\((.*?)\)$/gm;
  let match;
  while ((match = regex.exec(markdown)) !== null) images.push({ altText: match[1], relPath: match[2] });
  return images;
}

function captionCount(richContent) {
  return (richContent.nodes || []).filter((node) => {
    if (node.type !== 'PARAGRAPH') return false;
    const decorations = node.nodes?.flatMap((child) => child.textData?.decorations || []) || [];
    return node.paragraphData?.textStyle?.textAlignment === 'CENTER'
      && String(node.paragraphData?.textStyle?.lineHeight) === '1.45'
      && decorations.some((item) => item.type === 'ITALIC')
      && decorations.some((item) => item.type === 'FONT_SIZE' && Number(item.fontSizeData?.value) === 12);
  }).length;
}

function plainText(value) {
  return String(value || '').replace(/\*\*/g, '').replace(/_/g, '').replace(/\[([^\]]+)]\([^)]+\)/g, '$1').trim();
}

function faqSchema(post) {
  const config = readJson(FAQ_DATA_PATH)[post.slug];
  if (!config?.items?.length) throw new Error(`${post.slug}: FAQ data missing`);
  return {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: config.items.map((item) => ({ '@type': 'Question', name: plainText(item.q), acceptedAnswer: { '@type': 'Answer', text: plainText(item.a) } })),
  };
}

function seoData(post, cover) {
  const canonical = `https://www.berlinwalk.com/post/${post.slug}`;
  const blogPosting = {
    '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, description: post.description, image: [cover.url],
    author: { '@type': 'Person', name: 'Yusuf Ucuz' }, publisher: { '@type': 'Organization', name: 'BerlinWalk', url: 'https://www.berlinwalk.com' },
    mainEntityOfPage: canonical, inLanguage: 'en',
  };
  const meta = (props, custom = true) => ({ type: 'meta', props, children: '', custom, disabled: false });
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
      { type: 'script', props: { type: 'application/ld+json' }, children: JSON.stringify(faqSchema(post)), custom: true, disabled: false },
    ],
    settings: { preventAutoRedirect: false, keywords: post.keywords.map((term, index) => ({ term, isMain: index === 0 })) },
  };
}

function mediaData(cover) {
  return { wixMedia: { image: { id: cover.id, url: cover.url, height: cover.height, width: cover.width, altText: cover.altText, filename: cover.filename } }, displayed: true, custom: false, altText: cover.altText };
}

function structureReport(post, richContent) {
  const nodes = richContent.nodes || [];
  const images = nodes.filter((node) => node.type === 'IMAGE');
  const embeds = nodes.filter((node) => node.type === 'HTML');
  const h1 = nodes.filter((node) => node.type === 'HEADING' && Number(node.headingData?.level) === 1).length;
  const captions = captionCount(richContent);
  return {
    slug: post.slug, nodes: nodes.length, images: images.length, imagesWithAlt: images.filter((node) => node.imageData?.altText?.trim()).length,
    embeds: embeds.length, embedUrls: embeds.map((node) => node.htmlData?.url), h1, captions,
    bytes: Buffer.byteLength(JSON.stringify(richContent), 'utf8'),
  };
}

function requireStructure(post, report) {
  if (report.images !== post.expectedImages || report.imagesWithAlt !== post.expectedImages) throw new Error(`${post.slug}: expected ${post.expectedImages} images with alt text, got ${report.images}/${report.imagesWithAlt}`);
  if (report.embeds !== 3) throw new Error(`${post.slug}: expected 3 embeds, got ${report.embeds}`);
  if (report.h1 !== 0) throw new Error(`${post.slug}: body H1 must be 0, got ${report.h1}`);
  if (report.captions !== post.expectedImages) throw new Error(`${post.slug}: expected ${post.expectedImages} styled captions, got ${report.captions}`);
}

function localPackage(post) {
  const body = fs.readFileSync(absolute(post.bodyPath), 'utf8').trim();
  const qs = readJson(QS_DATA_PATH)[post.slug];
  const faq = readJson(FAQ_DATA_PATH)[post.slug];
  if (!qs?.items?.length) throw new Error(`${post.slug}: Quick Summary data missing`);
  if (!faq?.items?.length) throw new Error(`${post.slug}: FAQ data missing`);
  const uploaded = new Map();
  for (const [index, image] of collectImages(body).entries()) {
    const filePath = absolute(image.relPath);
    if (!fs.existsSync(filePath)) throw new Error(`${post.slug}: image missing ${image.relPath}`);
    const dims = imageDimensions(filePath);
    uploaded.set(image.relPath, { id: `dry_image_${index + 1}`, url: `dry://${path.basename(filePath)}`, width: dims.width, height: dims.height, filename: path.basename(filePath), altText: image.altText });
  }
  const richContent = parseMarkdown(post, body, uploaded);
  const report = structureReport(post, richContent);
  requireStructure(post, report);
  return { body, uploaded, richContent, report };
}

async function findBySlug(post, pathname, collectionKey) {
  let offset = 0;
  while (offset < 2500) {
    const payload = await wixFetch(pathname, { method: 'POST', body: { query: { paging: { limit: 100, offset } } } });
    const items = payload[collectionKey] || [];
    const match = items.find((item) => item.seoSlug === post.slug || item.slugs?.includes(post.slug) || item.title === post.title);
    if (match) return match;
    if (items.length < 100) return null;
    offset += items.length;
  }
  throw new Error(`${post.slug}: collision scan exceeded 2500 ${collectionKey}`);
}

async function collisions(post) {
  return {
    draft: await findBySlug(post, '/blog/v3/draft-posts/query', 'draftPosts'),
    published: await findBySlug(post, '/blog/v3/posts/query', 'posts'),
  };
}

async function ensureTag(label) {
  const created = await fetch(`${API_ROOT}/blog/v3/tags`, { method: 'POST', headers: headers({ 'Content-Type': 'application/json' }), body: JSON.stringify({ label }) });
  if (created.ok) { const tag = (await created.json()).tag; if (tag?.id) return tag.id; }
  const existing = await wixFetch(`/blog/v3/tags/labels/${encodeURIComponent(label)}`);
  const tag = existing.tag || existing;
  if (!tag.id) throw new Error(`Could not create/find tag ${label}`);
  return tag.id;
}

async function uploadedPackage(post, local) {
  const cache = readJson(UPLOAD_CACHE_PATH, {});
  const uploaded = new Map();
  for (const image of collectImages(local.body)) {
    const key = `${post.slug}:${image.relPath}`;
    let media = cache[key];
    if (!media) {
      media = await uploadImage(post, image.relPath, image.altText);
      cache[key] = media;
      writeJson(UPLOAD_CACHE_PATH, cache);
      console.log(`OK ${post.slug}: uploaded ${path.basename(image.relPath)} -> ${media.id}`);
    } else {
      console.log(`OK ${post.slug}: cached ${path.basename(image.relPath)} -> ${media.id}`);
    }
    uploaded.set(image.relPath, { ...media, altText: image.altText });
  }
  return uploaded;
}

async function verifyDraft(post, draftId) {
  const payload = await wixFetch(`/blog/v3/draft-posts/${encodeURIComponent(draftId)}?fieldsets=RICH_CONTENT`);
  return payload.draftPost || payload;
}

async function writeDraft(post) {
  const local = localPackage(post);
  const found = await collisions(post);
  if (found.published) throw new Error(`${post.slug}: published collision ${found.published.id}. Refusing to write.`);
  const media = await uploadedPackage(post, local);
  const richContent = parseMarkdown(post, local.body, media);
  requireStructure(post, structureReport(post, richContent));
  const cover = media.get(post.coverPath);
  if (!cover) throw new Error(`${post.slug}: cover is not one of the body images`);
  const tagIds = [];
  for (const label of post.tagLabels) tagIds.push(await ensureTag(label));
  const wordCount = local.body.split(/\s+/).filter(Boolean).length;
  const draftPost = {
    title: post.title, memberId: MEMBER_ID, excerpt: post.excerpt, featured: false, commentingEnabled: false, language: 'en',
    categoryIds: post.categoryIds, hashtags: post.hashtags, tagIds, minutesToRead: Math.max(4, Math.round(wordCount / 220)),
    seoSlug: post.slug, slugs: [post.slug], seoData: seoData(post, cover), richContent, media: mediaData({ ...cover, altText: post.coverAlt }),
  };
  const result = found.draft
    ? await wixFetch(`/blog/v3/draft-posts/${encodeURIComponent(found.draft.id)}`, { method: 'PATCH', body: { draftPost: { id: found.draft.id, ...draftPost }, fieldsets: ['RICH_CONTENT'] } })
    : await wixFetch('/blog/v3/draft-posts', { method: 'POST', body: { draftPost, fieldsets: ['RICH_CONTENT'] } });
  const draftId = (result.draftPost || result)?.id || found.draft?.id;
  if (!draftId) throw new Error(`${post.slug}: draft operation returned no ID`);
  const verified = await verifyDraft(post, draftId);
  const report = structureReport(post, verified.richContent || {});
  requireStructure(post, report);
  if (verified.status !== 'UNPUBLISHED') throw new Error(`${post.slug}: draft must remain UNPUBLISHED, got ${verified.status}`);
  if (verified.seoSlug !== post.slug) throw new Error(`${post.slug}: readback slug mismatch ${verified.seoSlug}`);
  writeJson(absolute(post.statePath), {
    draftId,
    editUrl: `https://manage.wix.com/dashboard/${SITE_ID}/blog/drafts/${draftId}/edit`,
    publicUrl: `https://www.berlinwalk.com/post/${post.slug}`,
    status: 'UNPUBLISHED',
    updatedAt: new Date().toISOString(),
  });
  console.log(JSON.stringify({ mode: found.draft ? 'updated' : 'created', draftId, status: verified.status, hasUnpublishedChanges: verified.hasUnpublishedChanges, ...report }, null, 2));
}

async function readback(post) {
  const state = readJson(absolute(post.statePath), {});
  const found = state.draftId ? { id: state.draftId } : await findBySlug(post, '/blog/v3/draft-posts/query', 'draftPosts');
  if (!found?.id) throw new Error(`${post.slug}: no draft ID found`);
  const draft = await verifyDraft(post, found.id);
  const report = structureReport(post, draft.richContent || {});
  requireStructure(post, report);
  const serialized = JSON.stringify(draft.richContent || {});
  const leaks = ['AI-generated', 'ChatGPT', 'Codex', 'Claude', 'visual-sources.md', 'Sources to Recheck Before Publishing'].filter((term) => serialized.includes(term));
  if (leaks.length) throw new Error(`${post.slug}: internal terms leaked: ${leaks.join(', ')}`);
  if (draft.status !== 'UNPUBLISHED') throw new Error(`${post.slug}: expected UNPUBLISHED, got ${draft.status}`);
  if (draft.seoSlug !== post.slug) throw new Error(`${post.slug}: readback slug mismatch ${draft.seoSlug}`);
  console.log(JSON.stringify({
    id: draft.id, title: draft.title, status: draft.status, hasUnpublishedChanges: draft.hasUnpublishedChanges, seoSlug: draft.seoSlug,
    categoryIds: draft.categoryIds, tagIds: draft.tagIds, seoTags: draft.seoData?.tags?.length || 0, ...report,
    editUrl: `https://manage.wix.com/dashboard/${SITE_ID}/blog/drafts/${draft.id}/edit`, publicUrl: `https://www.berlinwalk.com/post/${post.slug}`,
  }, null, 2));
}

async function main() {
  const options = parseArgs();
  console.log(`Mode: ${options.mode}. No publish endpoint exists in this script.`);
  for (const post of selectedPosts(options.slug)) {
    if (options.mode === 'dry-run') {
      const local = localPackage(post);
      console.log(JSON.stringify({ mode: 'dry-run', title: post.title, ...local.report }, null, 2));
    } else if (options.mode === 'preflight') {
      const found = await collisions(post);
      console.log(JSON.stringify({ slug: post.slug, existingDraftId: found.draft?.id || null, publishedCollisionId: found.published?.id || null, safeToCreate: !found.draft && !found.published, safeToUpdateDraft: Boolean(found.draft) && !found.published }, null, 2));
      if (found.published) process.exitCode = 1;
    } else if (options.mode === 'write') {
      await writeDraft(post);
    } else {
      await readback(post);
    }
  }
}

main().catch((error) => {
  console.error('ERROR:', error.message || error);
  process.exit(1);
});
