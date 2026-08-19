#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SITE_ID = '12ee5ea0-70a7-492f-8020-ffb27cbb630f';
const MEMBER_ID = '5a08a3af-4b9b-4403-9de7-3e26eba72dc0';
const API_ROOT = 'https://www.wixapis.com';
const RUN_ID = '2026-08-19-1436-Europe-Berlin';
const SLUG = 'berlin-brutalist-architecture';
const TOOL_SLUG = 'berlin-concrete-clue-chain';
const DRAFT_DIR = 'blog-drafts/berlin-brutalist-architecture';
const BODY_PATH = path.join(ROOT, DRAFT_DIR, 'berlin-brutalist-architecture.body.md');
const RUN_DIR = path.join(ROOT, 'output/qa/daily-blog-sol/2026-08-19', RUN_ID);
const STATE_PATH = path.join(RUN_DIR, 'wix/draft-state.json');
const READBACK_PATH = path.join(RUN_DIR, 'wix/draft-readback.json');
const UPLOAD_CACHE = path.join(RUN_DIR, 'wix/image-upload-cache.json');
const ARTICLE_CREDITS_ID = 'article_image_credits_berlin_brutalist_architecture';
const TOURIST_TIPS_CATEGORY_ID = '6da64e22-3360-42ec-a558-e906e4deeb19';
const EMBED_VERSION = '20260819cc1';
const POST = {
  title: 'Berlin Brutalist Architecture: Four Concrete Buildings Worth a Detour',
  excerpt: 'Four Berlin concrete buildings that make a useful architecture detour: Mäusebunker, St. Agnes, Corbusierhaus and Haus des Lehrers, with clear labels for what is and is not Brutalist.',
  seoTitle: 'Berlin Brutalist Architecture: Four Buildings Worth a Detour',
  description: 'Four Berlin concrete buildings worth an exterior-first detour: Mäusebunker, St. Agnes, Corbusierhaus and Haus des Lehrers, with useful context for each.',
  socialTitle: 'Berlin Brutalist Architecture: Four Concrete Buildings Worth a Detour',
  socialDescription: 'An honest architecture detour: two Brutalist stops and two useful Berlin counterpoints that make the difference easier to read.',
  hashtags: ['berlin', 'berlinwalk', 'berlinarchitecture', 'brutalism', 'postwarberlin'],
  keywords: ['Berlin brutalist architecture', 'Mäusebunker Berlin', 'St Agnes Berlin', 'Corbusierhaus Berlin', 'Haus des Lehrers'],
  tagLabels: ['Berlin History', 'Tourist Tips'],
  coverPath: 'images/optimized/01-maeusebunker.jpg',
};
const EMBEDS = {
  '{{quick-summary}}': { id: 'quick_summary_berlin_brutalist_architecture', url: `https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/?post=${SLUG}&v=${EMBED_VERSION}`, height: '1140' },
  [`{{widget:${TOOL_SLUG}}}`]: { id: `widget_${TOOL_SLUG.replace(/-/g, '_')}`, url: `https://fenerszymanski.github.io/berlinwalk-widgets/${TOOL_SLUG}/?v=${EMBED_VERSION}`, height: '1700' },
  '{{faq}}': { id: 'faq_berlin_brutalist_architecture', url: `https://fenerszymanski.github.io/berlinwalk-widgets/faq/?post=${SLUG}&v=${EMBED_VERSION}`, height: '1380' },
};
const CREDITS = [
  { label: 'Mäusebunker, Lichterfelde', author: 'Gunnar Klack', licenseLabel: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/', sourceUrl: 'https://commons.wikimedia.org/wiki/File:2019-06-16-Zentrale-Tierlaboratorien-Forschungseinrichtung-f-experimentelle-Medizin-Maeusebunker-Krahmerstr-Berlin-Lichterfelde_01.jpg' },
  { label: 'St. Agnes, Kreuzberg', author: 'Gunnar Klack', licenseLabel: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/', sourceUrl: 'https://commons.wikimedia.org/wiki/File:St-Agnes-Alexandrinenstr-Berlin-Kreuzberg-03-2017.jpg' },
  { label: 'Corbusierhaus, Westend', author: 'Gunnar Klack', licenseLabel: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Unite-d-Habitation-Corbusierhaus-Berlin-Westend-05-2017a.jpg' },
  { label: 'Haus des Lehrers, Alexanderplatz', author: 'Bahnfrend', licenseLabel: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Haus_des_Lehrers,_2024_(01).jpg' },
];

let nextId = 0;
const id = (prefix) => `${prefix}_${++nextId}`;
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const readJson = (file, fallback = null) => { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (error) { if (error.code === 'ENOENT') return fallback; throw error; } };
const writeJson = (file, value) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`); };
const sha256 = (value) => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');

function headers(extra = {}) {
  assert(process.env.WIX_API_KEY, 'WIX_API_KEY is not loaded. Source scripts/load-api-keys.sh first.');
  return { Authorization: process.env.WIX_API_KEY, 'wix-site-id': SITE_ID, 'Content-Type': 'application/json', ...extra };
}
async function wixFetch(pathname, options = {}) {
  const response = await fetch(`${API_ROOT}${pathname}`, {
    method: options.method || 'GET', headers: headers(options.headers || {}), body: options.body ? JSON.stringify(options.body) : undefined, signal: AbortSignal.timeout(30000),
  });
  const raw = await response.text();
  let body = {};
  try { body = raw ? JSON.parse(raw) : {}; } catch { body = { raw: raw.slice(0, 1000) }; }
  if (!response.ok) throw new Error(`Wix ${options.method || 'GET'} ${pathname} HTTP ${response.status}: ${JSON.stringify(body).slice(0, 1000)}`);
  return body;
}
function imageDimensions(file) {
  const bytes = fs.readFileSync(file);
  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    for (let offset = 2; offset < bytes.length - 9;) {
      if (bytes[offset] !== 0xff) break;
      const marker = bytes[offset + 1]; const length = bytes.readUInt16BE(offset + 2);
      if (marker >= 0xc0 && marker <= 0xc3) return { width: bytes.readUInt16BE(offset + 7), height: bytes.readUInt16BE(offset + 5) };
      offset += 2 + length;
    }
  }
  throw new Error(`Unsupported image format: ${file}`);
}
async function uploadImage(relPath, altText) {
  const absolute = path.join(path.dirname(BODY_PATH), relPath);
  const dimensions = imageDimensions(absolute);
  const generated = await wixFetch('/site-media/v1/files/generate-upload-url', { method: 'POST', body: { mimeType: 'image/jpeg', fileName: path.basename(absolute), private: false, labels: ['blog', 'berlinwalk', SLUG, RUN_ID] } });
  assert(generated.uploadUrl, `No Wix upload URL for ${relPath}`);
  const response = await fetch(generated.uploadUrl, { method: 'PUT', headers: { 'Content-Type': 'image/jpeg' }, body: fs.readFileSync(absolute), signal: AbortSignal.timeout(60000) });
  const raw = await response.text();
  let uploaded = {};
  try { uploaded = raw ? JSON.parse(raw) : {}; } catch { uploaded = { raw: raw.slice(0, 600) }; }
  if (!response.ok) throw new Error(`Wix image upload failed for ${relPath}: HTTP ${response.status} ${JSON.stringify(uploaded).slice(0, 600)}`);
  const file = uploaded.file || uploaded;
  assert(file.id && file.url, `Incomplete Wix media identity for ${relPath}`);
  return { id: file.id, url: file.url, width: dimensions.width, height: dimensions.height, filename: path.basename(absolute), altText };
}
function textNode(text, decorations = []) { return { type: 'TEXT', id: id('text'), nodes: [], textData: { text, decorations } }; }
function linkDecoration(url) { return { type: 'LINK', linkData: { link: { url, target: 'BLANK' } } }; }
function inlineNodes(value, inherited = []) {
  const nodes = []; let cursor = 0;
  const push = (text, decorations = inherited) => { if (text) nodes.push(textNode(text, decorations)); };
  while (cursor < value.length) {
    if (value.startsWith('**', cursor)) { const end = value.indexOf('**', cursor + 2); if (end !== -1) { nodes.push(...inlineNodes(value.slice(cursor + 2, end), [...inherited, { type: 'BOLD', fontWeightValue: 700 }])); cursor = end + 2; continue; } }
    if (value[cursor] === '_') { const end = value.indexOf('_', cursor + 1); if (end !== -1) { nodes.push(...inlineNodes(value.slice(cursor + 1, end), [...inherited, { type: 'ITALIC' }])); cursor = end + 1; continue; } }
    if (value[cursor] === '[') {
      const labelEnd = value.indexOf(']', cursor + 1); const urlStart = labelEnd >= 0 ? value.indexOf('(', labelEnd) : -1; const urlEnd = urlStart >= 0 ? value.indexOf(')', urlStart) : -1;
      if (labelEnd >= 0 && urlStart === labelEnd + 1 && urlEnd >= 0) { let url = value.slice(urlStart + 1, urlEnd); if (url.startsWith('/')) url = `https://www.berlinwalk.com${url}`; nodes.push(...inlineNodes(value.slice(cursor + 1, labelEnd), [...inherited, linkDecoration(url)])); cursor = urlEnd + 1; continue; }
    }
    let next = value.length;
    for (const marker of ['**', '_', '[']) { const found = value.indexOf(marker, cursor + 1); if (found !== -1) next = Math.min(next, found); }
    push(value.slice(cursor, next)); cursor = next;
  }
  return nodes.length ? nodes : [textNode('')];
}
function paragraph(value, lineHeight = '1.7') { return { type: 'PARAGRAPH', id: id('paragraph'), nodes: inlineNodes(value), paragraphData: { textStyle: { textAlignment: 'AUTO', lineHeight }, indentation: 0 } }; }
function caption(value) { const clean = value.replace(/^_/, '').replace(/_$/, ''); return { type: 'PARAGRAPH', id: id('caption'), nodes: inlineNodes(clean, [{ type: 'FONT_SIZE', fontSizeData: { unit: 'PX', value: 12 } }, { type: 'ITALIC' }]), paragraphData: { textStyle: { textAlignment: 'CENTER', lineHeight: '1.45' }, indentation: 0 } }; }
function heading(value, level) { return { type: 'HEADING', id: id('heading'), nodes: [textNode(value)], headingData: { level, textStyle: { textAlignment: 'AUTO' } } }; }
function imageNode(media, altText) { return { type: 'IMAGE', id: id('image'), nodes: [], imageData: { containerData: { width: { size: 'CONTENT' }, alignment: 'CENTER', textWrap: true }, image: { src: { id: media.id }, width: media.width, height: media.height }, altText } }; }
function htmlNode(embed) { return { type: 'HTML', id: embed.id, nodes: [], htmlData: { containerData: { width: { custom: '940' }, alignment: 'CENTER', height: { custom: embed.height }, textWrap: true }, url: embed.url, source: 'HTML', autoHeight: false } }; }
function bulletList(items) { return { type: 'BULLETED_LIST', id: id('list'), nodes: items.map((item) => ({ type: 'LIST_ITEM', id: id('list_item'), nodes: [paragraph(item, '1.6')] })) }; }
function creditTextNode(nodeId, suffix, text, decorations = []) { return { type: 'TEXT', id: `${nodeId}_${suffix}`, nodes: [], textData: { text, decorations } }; }
function creditsNode() {
  return {
    type: 'COLLAPSIBLE_LIST', id: ARTICLE_CREDITS_ID,
    nodes: [{ type: 'COLLAPSIBLE_ITEM', id: `${ARTICLE_CREDITS_ID}_item`, nodes: [
      { type: 'COLLAPSIBLE_ITEM_TITLE', id: `${ARTICLE_CREDITS_ID}_title`, nodes: [{ type: 'PARAGRAPH', id: `${ARTICLE_CREDITS_ID}_title_p`, nodes: [creditTextNode(ARTICLE_CREDITS_ID, 'title_t', 'Image credits')], paragraphData: { textStyle: { textAlignment: 'AUTO' }, indentation: 0 } }] },
      { type: 'COLLAPSIBLE_ITEM_BODY', id: `${ARTICLE_CREDITS_ID}_body`, nodes: [
        { type: 'PARAGRAPH', id: `${ARTICLE_CREDITS_ID}_intro`, nodes: [creditTextNode(ARTICLE_CREDITS_ID, 'intro_t', 'Source and licence details for the 4 images used in this article.')], paragraphData: { textStyle: { textAlignment: 'AUTO', lineHeight: '1.55' }, indentation: 0 } },
        ...CREDITS.map((item, index) => ({ type: 'PARAGRAPH', id: `${ARTICLE_CREDITS_ID}_credit_${index}`, nodes: [
          creditTextNode(ARTICLE_CREDITS_ID, `credit_${index}_source`, item.label, [linkDecoration(item.sourceUrl)]),
          creditTextNode(ARTICLE_CREDITS_ID, `credit_${index}_by`, `: ${item.author}, `),
          creditTextNode(ARTICLE_CREDITS_ID, `credit_${index}_license`, item.licenseLabel, [linkDecoration(item.licenseUrl)]),
          creditTextNode(ARTICLE_CREDITS_ID, `credit_${index}_via`, ', via Wikimedia Commons.'),
        ], paragraphData: { textStyle: { textAlignment: 'AUTO', lineHeight: '1.55' }, indentation: 0 } })),
      ] },
    ] }],
    collapsibleListData: { containerData: { alignment: 'CENTER', textWrap: true }, expandOnlyOne: false, initialExpandedItems: 'NONE', direction: 'LTR' },
  };
}
function parseMarkdown(markdown, mediaByPath) {
  nextId = 0; const nodes = []; let paragraphs = []; let list = []; let captionNext = false;
  const flushList = () => { if (list.length) { nodes.push(bulletList(list)); list = []; } };
  const flushParagraph = () => { if (!paragraphs.length) return; const value = paragraphs.join(' ').replace(/\s+/g, ' ').trim(); nodes.push(captionNext ? caption(value) : paragraph(value)); paragraphs = []; captionNext = false; };
  const requireCaption = (where) => assert(!captionNext, `Every image needs a caption before ${where}`);
  for (const raw of markdown.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) { flushParagraph(); flushList(); continue; }
    if (line === '{{article-image-credits}}') { flushParagraph(); flushList(); requireCaption('Image credits'); nodes.push(creditsNode()); continue; }
    if (EMBEDS[line]) { flushParagraph(); flushList(); requireCaption('an embed'); nodes.push(htmlNode(EMBEDS[line])); continue; }
    const image = line.match(/^!\[(.*?)]\((.*?)\)$/);
    if (image) { flushParagraph(); flushList(); requireCaption('another image'); const media = mediaByPath.get(image[2]); assert(media, `Missing media for ${image[2]}`); nodes.push(imageNode(media, image[1])); captionNext = true; continue; }
    if (/^#\s+/.test(line)) throw new Error('A Wix Blog body must not contain a Markdown H1');
    const h2 = line.match(/^##\s+(.+)$/); if (h2) { flushParagraph(); flushList(); requireCaption('an H2'); nodes.push(heading(h2[1], 2)); continue; }
    const h3 = line.match(/^###\s+(.+)$/); if (h3) { flushParagraph(); flushList(); requireCaption('an H3'); nodes.push(heading(h3[1], 3)); continue; }
    const bullet = line.match(/^-\s+(.+)$/); if (bullet) { flushParagraph(); requireCaption('a list'); list.push(bullet[1]); continue; }
    flushList(); paragraphs.push(line);
  }
  flushParagraph(); flushList(); requireCaption('the end of the article');
  const now = new Date().toISOString();
  return { nodes, metadata: { version: 1, createdTimestamp: now, updatedTimestamp: now }, documentStyle: { paragraph: { lineHeight: '1.7' }, headerOne: { lineHeight: '1.12' }, headerTwo: { lineHeight: '1.15' }, headerThree: { lineHeight: '1.18' } } };
}
function markdownImages(body) { return [...body.matchAll(/^!\[(.*?)]\((.*?)\)$/gm)].map((match) => ({ altText: match[1], relPath: match[2] })); }
function plain(value) { return String(value || '').replace(/\*\*/g, '').replace(/_/g, '').replace(/\[([^\]]+)]\([^)]+\)/g, '$1').replace(/<[^>]+>/g, '').trim(); }
function seoData(cover) {
  const faq = readJson(path.join(ROOT, 'faq/data.json'), {})[SLUG];
  assert(faq?.items?.length === 5, 'FAQ configuration must contain exactly five questions');
  const canonical = `https://www.berlinwalk.com/post/${SLUG}`;
  const meta = (props, custom = true) => ({ type: 'meta', props, children: '', custom, disabled: false });
  const blogPosting = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: POST.title, description: POST.description, image: [cover.url], author: { '@type': 'Person', name: 'Yusuf Ucuz' }, publisher: { '@type': 'Organization', name: 'BerlinWalk', url: 'https://www.berlinwalk.com' }, mainEntityOfPage: canonical, inLanguage: 'en', articleSection: 'Berlin History', keywords: POST.keywords.join(', ') };
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.items.map((item) => ({ '@type': 'Question', name: plain(item.q), acceptedAnswer: { '@type': 'Answer', text: plain(item.a) } })) };
  return { tags: [
    { type: 'title', children: POST.seoTitle, custom: false, disabled: false }, meta({ name: 'description', content: POST.description }, false), meta({ name: 'robots', content: 'index, follow, max-image-preview:large' }),
    meta({ property: 'og:title', content: POST.socialTitle }, false), meta({ property: 'og:description', content: POST.socialDescription }, false), meta({ property: 'og:type', content: 'article' }), meta({ property: 'og:url', content: canonical }), meta({ property: 'og:image', content: cover.url }), meta({ property: 'og:image:alt', content: cover.altText }),
    meta({ name: 'twitter:card', content: 'summary_large_image' }), meta({ name: 'twitter:title', content: POST.socialTitle }), meta({ name: 'twitter:description', content: POST.socialDescription }), meta({ name: 'twitter:image', content: cover.url }), meta({ name: 'twitter:image:alt', content: cover.altText }),
    { type: 'script', props: { type: 'application/ld+json' }, children: JSON.stringify(blogPosting), custom: true, disabled: false }, { type: 'script', props: { type: 'application/ld+json' }, children: JSON.stringify(faqSchema), custom: true, disabled: false },
  ], settings: { preventAutoRedirect: false, keywords: POST.keywords.map((term, index) => ({ term, isMain: index === 0 })) } };
}
async function tagId(label) { const result = await wixFetch(`/blog/v3/tags/labels/${encodeURIComponent(label)}`); const tag = result.tag || result; assert(tag.id, `Missing existing Wix tag: ${label}`); return tag.id; }
async function findCollision() {
  const drafts = await wixFetch('/blog/v3/draft-posts/query', { method: 'POST', body: { query: { filter: { title: POST.title }, paging: { limit: 10 } } } });
  assert(!(drafts.draftPosts || []).length, 'A Wix draft title collision already exists');
  for (let offset = 0; offset < 500; offset += 100) {
    const result = await wixFetch('/blog/v3/posts/query', { method: 'POST', body: { query: { paging: { limit: 100, offset } } } });
    const hit = (result.posts || []).find((post) => post.title === POST.title || post.seoSlug === SLUG || (post.slugs || []).includes(SLUG));
    assert(!hit, `A published Wix post collision exists: ${hit?.id}`);
    if ((result.posts || []).length < 100) break;
  }
}
async function fetchDraft(draftId) { const result = await wixFetch(`/blog/v3/draft-posts/${encodeURIComponent(draftId)}?fieldsets=RICH_CONTENT`); return result.draftPost || result; }
function verifyDraft(draft) {
  const nodes = draft.richContent?.nodes || [];
  const images = nodes.filter((node) => node.type === 'IMAGE');
  const embeds = nodes.filter((node) => node.type === 'HTML');
  const credits = nodes.filter((node) => node.type === 'COLLAPSIBLE_LIST' && node.id === ARTICLE_CREDITS_ID);
  const captions = nodes.filter((node) => node.type === 'PARAGRAPH' && node.paragraphData?.textStyle?.textAlignment === 'CENTER' && String(node.paragraphData?.textStyle?.lineHeight) === '1.45').filter((node) => (node.nodes || []).some((child) => (child.textData?.decorations || []).some((decoration) => decoration.type === 'ITALIC') && (child.textData?.decorations || []).some((decoration) => decoration.type === 'FONT_SIZE' && Number(decoration.fontSizeData?.value) === 12)));
  assert(draft.title === POST.title && draft.seoSlug === SLUG, 'Draft title or slug readback mismatch');
  assert(draft.status === 'UNPUBLISHED' && draft.hasUnpublishedChanges === true, 'Draft is not a new unpublished post');
  assert(images.length === 4 && images.every((node) => node.imageData?.altText?.trim()), 'Draft must have four images with alt text');
  assert(embeds.length === 3 && embeds.every((node) => !Object.hasOwn(node.htmlData?.containerData || {}, 'spoiler')), 'Draft embeds are incomplete or contain unsupported spoiler data');
  assert(!nodes.some((node) => node.type === 'HEADING' && Number(node.headingData?.level) === 1), 'Draft has a forbidden H1');
  assert(captions.length === 4, 'Draft must have four 12px italic centred captions');
  assert(credits.length === 1 && credits[0].collapsibleListData?.initialExpandedItems === 'NONE', 'Draft must have one default-closed native Image credits disclosure');
  assert((draft.seoData?.tags || []).length >= 14, 'Draft SEO is incomplete');
  return { draftId: draft.id, title: draft.title, status: draft.status, hasUnpublishedChanges: draft.hasUnpublishedChanges, seoSlug: draft.seoSlug, imageCount: images.length, embeds: embeds.map((node) => node.htmlData?.url), captions: captions.length, nativeImageCredits: credits.length, seoTags: draft.seoData?.tags?.length || 0, richContentSha256: sha256(draft.richContent), seoDataSha256: sha256(draft.seoData) };
}
async function main() {
  const mode = process.argv.includes('--create-unpublished-draft') ? 'CREATE' : process.argv.includes('--readback') ? 'READBACK' : 'DRY_RUN';
  const body = fs.readFileSync(BODY_PATH, 'utf8').trim();
  assert(!/^#\s+/m.test(body), 'The article body contains a Markdown H1');
  assert((body.match(/\{\{article-image-credits}}/g) || []).length === 1, 'The body requires exactly one Image credits token');
  const images = markdownImages(body); assert(images.length === 4, `Expected exactly four article images, got ${images.length}`);
  if (mode === 'READBACK') { const state = readJson(STATE_PATH, {}); assert(state.draftId, 'No draftId in same-run draft state'); const result = { runId: RUN_ID, checkedAt: new Date().toISOString(), ...verifyDraft(await fetchDraft(state.draftId)) }; writeJson(READBACK_PATH, result); console.log(JSON.stringify(result, null, 2)); return; }
  const media = new Map();
  if (mode === 'DRY_RUN') {
    for (const [index, image] of images.entries()) media.set(image.relPath, { id: `dry_${index}`, url: `dry://${path.basename(image.relPath)}`, ...imageDimensions(path.join(path.dirname(BODY_PATH), image.relPath)), filename: path.basename(image.relPath), altText: image.altText });
    const rich = parseMarkdown(body, media);
    assert(rich.nodes.filter((node) => node.type === 'HTML').length === 3, 'Expected three embeds');
    console.log(JSON.stringify({ mode, runId: RUN_ID, images: images.length, embeds: 3, captions: 4, credits: 1, richContentSha256: sha256(rich) }, null, 2)); return;
  }
  await findCollision();
  const tagIds = await Promise.all(POST.tagLabels.map(tagId));
  const cache = readJson(UPLOAD_CACHE, {});
  for (const image of images) { const uploaded = cache[image.relPath] || await uploadImage(image.relPath, image.altText); cache[image.relPath] = uploaded; media.set(image.relPath, { ...uploaded, altText: image.altText }); writeJson(UPLOAD_CACHE, cache); }
  const cover = media.get(POST.coverPath); assert(cover, 'Cover image was not uploaded');
  const richContent = parseMarkdown(body, media);
  const draftPost = { title: POST.title, memberId: MEMBER_ID, excerpt: POST.excerpt, featured: false, commentingEnabled: false, language: 'en', categoryIds: [TOURIST_TIPS_CATEGORY_ID], hashtags: POST.hashtags, tagIds, minutesToRead: Math.max(4, Math.round(body.split(/\s+/).filter(Boolean).length / 220)), seoSlug: SLUG, slugs: [SLUG], seoData: seoData(cover), richContent, media: { wixMedia: { image: { id: cover.id, url: cover.url, width: cover.width, height: cover.height, altText: cover.altText, filename: cover.filename } }, displayed: true, custom: false, altText: cover.altText } };
  const created = await wixFetch('/blog/v3/draft-posts', { method: 'POST', body: { draftPost, fieldsets: ['RICH_CONTENT'], publish: false } });
  const draftId = (created.draftPost || created).id; assert(draftId, 'Wix did not return a draft ID');
  const verified = await fetchDraft(draftId);
  const result = { runId: RUN_ID, checkedAt: new Date().toISOString(), ...verifyDraft(verified) };
  writeJson(READBACK_PATH, result);
  writeJson(STATE_PATH, { runId: RUN_ID, draftId, postSlug: SLUG, toolSlug: TOOL_SLUG, status: verified.status, hasUnpublishedChanges: verified.hasUnpublishedChanges, editUrl: `https://manage.wix.com/dashboard/${SITE_ID}/blog/drafts/${draftId}/edit`, updatedAt: new Date().toISOString() });
  console.log(JSON.stringify(result, null, 2));
}
main().catch((error) => { console.error(`ERROR: ${error.stack || error.message}`); process.exit(1); });
