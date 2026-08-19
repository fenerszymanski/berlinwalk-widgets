#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SITE_ID = '12ee5ea0-70a7-492f-8020-ffb27cbb630f';
const API_ROOT = 'https://www.wixapis.com';
const MEMBER_ID = '5a08a3af-4b9b-4403-9de7-3e26eba72dc0';
const CATEGORY_ID = '6da64e22-3360-42ec-a558-e906e4deeb19';
const SLUG = 'berlin-opera-for-first-time-visitors';
const TOOL_SLUG = 'berlin-opera-house-reader';
const TITLE = 'Berlin Opera for First-Time Visitors: Which House Fits Your Evening?';
const DRAFT_DIR = 'blog-drafts/berlin-opera-for-first-time-visitors';
const BODY_PATH = path.join(ROOT, DRAFT_DIR, 'berlin-opera-for-first-time-visitors.body.md');
const FAQ_PATH = path.join(ROOT, DRAFT_DIR, 'faq.json');
const EMBED_VERSION = '20260819opr1';
const EMBEDS = {
  '{{quick-summary}}': {
    id: 'quick_summary_berlin_opera_for_first_time_visitors',
    url: 'https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/?post=berlin-opera-for-first-time-visitors&v=' + EMBED_VERSION,
    height: '1220',
  },
  '{{widget:berlin-opera-house-reader}}': {
    id: 'widget_berlin_opera_house_reader',
    url: 'https://fenerszymanski.github.io/berlinwalk-widgets/berlin-opera-house-reader/?v=' + EMBED_VERSION,
    height: '1870',
  },
  '{{faq}}': {
    id: 'faq_berlin_opera_for_first_time_visitors',
    url: 'https://fenerszymanski.github.io/berlinwalk-widgets/faq/?post=berlin-opera-for-first-time-visitors&v=' + EMBED_VERSION,
    height: '1430',
  },
};

const POST = {
  seoTitle: 'Berlin Opera for First-Time Visitors: Which House Fits?',
  description: "Choose Berlin's opera house by neighbourhood, current venue, travel and surtitles: a first-time visitor guide to Staatsoper, Deutsche Oper and Komische Oper.",
  excerpt: 'Choose a Berlin opera evening by the part of the city you want, then use the production page for the final venue, language and seating check.',
  socialTitle: 'Which Berlin Opera House Fits Your Evening?',
  socialDescription: 'A practical first-time guide to Staatsoper, Deutsche Oper and Komische Oper at Schillertheater.',
  hashtags: ['berlin', 'berlinwalk', 'berlinopera', 'berlintips', 'charlottenburg', 'mitte'],
  keywords: ['Berlin opera for tourists', 'Berlin opera houses', 'Staatsoper Unter den Linden', 'Deutsche Oper Berlin', 'Komische Oper Berlin'],
  coverPath: 'images/optimized/01-staatsoper-cover.jpg',
};

let sequence = 1;
function id(prefix) { return prefix + '_' + sequence++; }
function assert(condition, message) { if (!condition) throw new Error(message); }

function headers(extra = {}) {
  if (!process.env.WIX_API_KEY) throw new Error('Missing WIX_API_KEY. Source scripts/load-api-keys.sh first.');
  return { Authorization: process.env.WIX_API_KEY, 'wix-site-id': SITE_ID, ...extra };
}

async function responseBody(response) {
  const text = await response.text();
  if (!text) return {};
  try { return JSON.parse(text); } catch { return { raw: text.slice(0, 800) }; }
}

async function wixFetch(pathname, options = {}) {
  const response = await fetch(API_ROOT + pathname, {
    method: options.method || 'GET',
    headers: headers({ 'Content-Type': 'application/json', ...(options.headers || {}) }),
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const body = await responseBody(response);
  if (!response.ok) throw new Error('Wix ' + (options.method || 'GET') + ' ' + pathname + ' failed (' + response.status + '): ' + JSON.stringify(body).slice(0, 900));
  return body;
}

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
  throw new Error('Unsupported image format: ' + filePath);
}

async function uploadImage(relPath, altText) {
  const absolute = path.join(path.dirname(BODY_PATH), relPath);
  const filename = path.basename(absolute);
  const dimensions = imageDimensions(absolute);
  const generated = await wixFetch('/site-media/v1/files/generate-upload-url', {
    method: 'POST',
    body: { mimeType: 'image/jpeg', fileName: filename, private: false, labels: ['blog', 'berlinwalk', SLUG] },
  });
  assert(generated.uploadUrl, 'Upload URL missing for ' + filename);
  const upload = await fetch(generated.uploadUrl, { method: 'PUT', headers: { 'Content-Type': 'image/jpeg' }, body: fs.readFileSync(absolute) });
  const uploaded = await responseBody(upload);
  if (!upload.ok) throw new Error('Upload failed for ' + filename + ': ' + upload.status + ' ' + JSON.stringify(uploaded).slice(0, 600));
  const file = uploaded.file || uploaded;
  const image = file.media?.image?.image || {};
  assert(file.id && file.url, 'Upload response missing media identity for ' + filename);
  return { id: file.id, url: file.url, width: image.width || dimensions.width, height: image.height || dimensions.height, filename, altText };
}

function textNode(text, decorations = []) {
  return { type: 'TEXT', id: id('text'), nodes: [], textData: { text, decorations } };
}
function linkDecoration(url) {
  return { type: 'LINK', linkData: { link: { url, target: 'BLANK' } } };
}
function inlineNodes(markdown, inherited = []) {
  const nodes = [];
  let cursor = 0;
  const add = (text, decorations = inherited) => { if (text) nodes.push(textNode(text, decorations)); };
  while (cursor < markdown.length) {
    if (markdown.startsWith('**', cursor)) {
      const end = markdown.indexOf('**', cursor + 2);
      if (end !== -1) { nodes.push(...inlineNodes(markdown.slice(cursor + 2, end), [...inherited, { type: 'BOLD', fontWeightValue: 700 }])); cursor = end + 2; continue; }
    }
    if (markdown[cursor] === '_') {
      const end = markdown.indexOf('_', cursor + 1);
      if (end !== -1) { nodes.push(...inlineNodes(markdown.slice(cursor + 1, end), [...inherited, { type: 'ITALIC' }])); cursor = end + 1; continue; }
    }
    if (markdown[cursor] === '[') {
      const labelEnd = markdown.indexOf(']', cursor + 1);
      const urlStart = labelEnd !== -1 ? markdown.indexOf('(', labelEnd) : -1;
      const urlEnd = urlStart !== -1 ? markdown.indexOf(')', urlStart) : -1;
      if (labelEnd !== -1 && urlStart === labelEnd + 1 && urlEnd !== -1) {
        const label = markdown.slice(cursor + 1, labelEnd);
        let url = markdown.slice(urlStart + 1, urlEnd);
        if (url.startsWith('/')) url = 'https://www.berlinwalk.com' + url;
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
    add(markdown.slice(cursor, next));
    cursor = next;
  }
  return nodes.length ? nodes : [textNode('')];
}
function paragraph(text, lineHeight = '1.7') {
  return { type: 'PARAGRAPH', id: id('paragraph'), nodes: inlineNodes(text), paragraphData: { textStyle: { textAlignment: 'AUTO', lineHeight }, indentation: 0 } };
}
function caption(text) {
  const clean = text.replace(/^_/, '').replace(/_$/, '');
  return { type: 'PARAGRAPH', id: id('caption'), nodes: inlineNodes(clean, [{ type: 'FONT_SIZE', fontSizeData: { unit: 'PX', value: 12 } }, { type: 'ITALIC' }]), paragraphData: { textStyle: { textAlignment: 'CENTER', lineHeight: '1.45' }, indentation: 0 } };
}
function heading(text, level) {
  return { type: 'HEADING', id: id('heading'), nodes: [textNode(text)], headingData: { level, textStyle: { textAlignment: 'AUTO' } } };
}
function imageNode(media) {
  return { type: 'IMAGE', id: id('image'), nodes: [], imageData: { containerData: { width: { size: 'CONTENT' }, alignment: 'CENTER', textWrap: true }, image: { src: { id: media.id }, width: media.width, height: media.height }, altText: media.altText } };
}
function htmlNode(embed) {
  return { type: 'HTML', id: embed.id, nodes: [], htmlData: { containerData: { width: { custom: '940' }, alignment: 'CENTER', height: { custom: embed.height }, textWrap: true }, url: embed.url, source: 'HTML', autoHeight: false } };
}
function bulletList(items) {
  return { type: 'BULLETED_LIST', id: id('bulleted_list'), nodes: items.map((item) => ({ type: 'LIST_ITEM', id: id('list_item'), nodes: [paragraph(item, '1.6')] })) };
}

function parseMarkdown(markdown, mediaByPath) {
  sequence = 1;
  const nodes = [];
  const lines = markdown.split(/\r?\n/);
  let paragraphBuffer = [];
  let listBuffer = [];
  let captionNext = false;
  function requireCaption(kind) { if (captionNext) throw new Error('Each markdown image needs a caption before ' + kind + '.'); }
  function flushList() { if (listBuffer.length) { nodes.push(bulletList(listBuffer)); listBuffer = []; } }
  function flushParagraph() {
    if (!paragraphBuffer.length) return;
    const text = paragraphBuffer.join(' ').replace(/\s+/g, ' ').trim();
    nodes.push(captionNext ? caption(text) : paragraph(text));
    captionNext = false;
    paragraphBuffer = [];
  }
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) { flushParagraph(); flushList(); continue; }
    if (EMBEDS[line]) { flushParagraph(); flushList(); requireCaption('an embed'); nodes.push(htmlNode(EMBEDS[line])); continue; }
    const imageMatch = line.match(/^!\[(.*?)]\((.*?)\)$/);
    if (imageMatch) {
      flushParagraph(); flushList(); requireCaption('another image');
      const media = mediaByPath.get(imageMatch[2]);
      if (!media) throw new Error('Missing media for ' + imageMatch[2]);
      nodes.push(imageNode({ ...media, altText: imageMatch[1] }));
      captionNext = true;
      continue;
    }
    const h1 = line.match(/^#\s+(.+)$/);
    if (h1) throw new Error('The body contains a Markdown H1.');
    const h2 = line.match(/^##\s+(.+)$/);
    if (h2) { flushParagraph(); flushList(); requireCaption('an H2'); nodes.push(heading(h2[1], 2)); continue; }
    const h3 = line.match(/^###\s+(.+)$/);
    if (h3) { flushParagraph(); flushList(); requireCaption('an H3'); nodes.push(heading(h3[1], 3)); continue; }
    const bullet = line.match(/^-\s+(.+)$/);
    if (bullet) { flushParagraph(); requireCaption('a list'); listBuffer.push(bullet[1]); continue; }
    flushList();
    paragraphBuffer.push(line);
  }
  flushParagraph();
  flushList();
  requireCaption('the end of the document');
  const now = new Date().toISOString();
  return { nodes, metadata: { version: 1, createdTimestamp: now, updatedTimestamp: now }, documentStyle: { paragraph: { lineHeight: '1.7' }, headerOne: { lineHeight: '1.12' }, headerTwo: { lineHeight: '1.15' }, headerThree: { lineHeight: '1.18' } } };
}

function creditLine(label, sourceUrl, author, licence, licenceUrl) {
  return {
    type: 'PARAGRAPH', id: id('credit'), nodes: [
      textNode(label, [linkDecoration(sourceUrl)]), textNode(': ' + author + ', '), textNode(licence, [linkDecoration(licenceUrl)]), textNode(', via Wikimedia Commons.'),
    ], paragraphData: { textStyle: { textAlignment: 'AUTO', lineHeight: '1.55' }, indentation: 0 },
  };
}
function imageCreditsNode() {
  return {
    type: 'COLLAPSIBLE_LIST', id: 'article_image_credits_berlin_opera_for_first_time_visitors', nodes: [{
      type: 'COLLAPSIBLE_ITEM', id: 'article_image_credits_berlin_opera_for_first_time_visitors_item', nodes: [
        { type: 'COLLAPSIBLE_ITEM_TITLE', id: 'article_image_credits_berlin_opera_for_first_time_visitors_title', nodes: [{ type: 'PARAGRAPH', id: 'article_image_credits_berlin_opera_for_first_time_visitors_title_p', nodes: [textNode('Image credits')], paragraphData: { textStyle: { textAlignment: 'AUTO' }, indentation: 0 } }] },
        { type: 'COLLAPSIBLE_ITEM_BODY', id: 'article_image_credits_berlin_opera_for_first_time_visitors_body', nodes: [
          paragraph('Source and licence details for the 4 photographs used in this article.', '1.55'),
          creditLine('Staatsoper Unter den Linden', 'https://commons.wikimedia.org/wiki/File:Berlin_-_Staatsoper_Unter_den_Linden.jpg', 'Marek Śliwecki', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/'),
          creditLine('Deutsche Oper Berlin', 'https://commons.wikimedia.org/wiki/File:Deutsche_Oper_Berlin,_Blick_von_Osten.jpg', 'Manfred Brückels', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0/'),
          creditLine('Schillertheater', 'https://commons.wikimedia.org/wiki/File:Berlin_Schillertheater.JPG', 'Bukk', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0/'),
          creditLine('Staatsoper auditorium', 'https://commons.wikimedia.org/wiki/File:Berlin_Staatsoper_Zuschauerraum_2.jpg', 'Andreas Praefcke', 'CC BY 3.0', 'https://creativecommons.org/licenses/by/3.0/'),
        ] },
      ],
    }], collapsibleListData: { containerData: { alignment: 'CENTER', textWrap: true }, expandOnlyOne: false, initialExpandedItems: 'NONE', direction: 'LTR' },
  };
}

function plain(value) {
  return String(value || '').replace(/\*\*/g, '').replace(/_/g, '').replace(/\[([^\]]+)]\([^)]+\)/g, '$1').trim();
}
function seoData(cover, faq) {
  const canonical = 'https://www.berlinwalk.com/post/' + SLUG;
  const blogPosting = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: TITLE, description: POST.description, image: [cover.url], author: { '@type': 'Person', name: 'Yusuf Ucuz' }, publisher: { '@type': 'Organization', name: 'BerlinWalk', url: 'https://www.berlinwalk.com' }, mainEntityOfPage: canonical, inLanguage: 'en' };
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.items.map((item) => ({ '@type': 'Question', name: plain(item.q), acceptedAnswer: { '@type': 'Answer', text: plain(item.a) } })) };
  const meta = (props, custom = true) => ({ type: 'meta', props, children: '', custom, disabled: false });
  return { tags: [
    { type: 'title', children: POST.seoTitle, custom: false, disabled: false },
    meta({ name: 'description', content: POST.description }, false), meta({ name: 'robots', content: 'index, follow, max-image-preview:large' }),
    meta({ property: 'og:title', content: POST.socialTitle }, false), meta({ property: 'og:description', content: POST.socialDescription }, false), meta({ property: 'og:type', content: 'article' }), meta({ property: 'og:url', content: canonical }), meta({ property: 'og:image', content: cover.url }), meta({ property: 'og:image:alt', content: cover.altText }),
    meta({ name: 'twitter:card', content: 'summary_large_image' }), meta({ name: 'twitter:title', content: POST.socialTitle }), meta({ name: 'twitter:description', content: POST.socialDescription }), meta({ name: 'twitter:image', content: cover.url }), meta({ name: 'twitter:image:alt', content: cover.altText }),
    { type: 'script', props: { type: 'application/ld+json' }, children: JSON.stringify(blogPosting), custom: true, disabled: false }, { type: 'script', props: { type: 'application/ld+json' }, children: JSON.stringify(faqSchema), custom: true, disabled: false },
  ], settings: { preventAutoRedirect: false, keywords: POST.keywords.map((term, index) => ({ term, isMain: index === 0 })) } };
}

async function findBySlug(collection, key) {
  const found = [];
  for (let offset = 0; offset < 2000; offset += 100) {
    const payload = await wixFetch('/blog/v3/' + collection + '/query', { method: 'POST', body: { query: { paging: { limit: 100, offset } } } });
    const items = payload[key] || [];
    found.push(...items.filter((item) => item.seoSlug === SLUG || (item.slugs || []).includes(SLUG)));
    if (items.length < 100) break;
  }
  return found;
}

async function main() {
  const execute = process.argv.includes('--create-unpublished-draft');
  const body = fs.readFileSync(BODY_PATH, 'utf8').trim();
  const faq = JSON.parse(fs.readFileSync(FAQ_PATH, 'utf8'));
  if (/^#\s+/m.test(body)) throw new Error('The body contains a Markdown H1.');
  const markdownImages = [...body.matchAll(/^!\[(.*?)]\((.*?)\)$/gm)].map((match) => ({ altText: match[1], relPath: match[2] }));
  assert(markdownImages.length === 4, 'Expected four editorial images, got ' + markdownImages.length);
  if (!execute) {
    const media = new Map(markdownImages.map((image, index) => [image.relPath, { id: 'dry_' + index, url: 'dry://' + path.basename(image.relPath), ...imageDimensions(path.join(path.dirname(BODY_PATH), image.relPath)), altText: image.altText }]));
    const content = parseMarkdown(body, media);
    content.nodes.push(imageCreditsNode());
    console.log(JSON.stringify({ mode: 'DRY_RUN', images: markdownImages.length, embeds: content.nodes.filter((node) => node.type === 'HTML').length, bodyH1: content.nodes.filter((node) => node.type === 'HEADING' && node.headingData?.level === 1).length, captions: content.nodes.filter((node) => node.type === 'PARAGRAPH' && node.paragraphData?.textStyle?.textAlignment === 'CENTER').length, imageCredits: content.nodes.filter((node) => node.type === 'COLLAPSIBLE_LIST' && node.collapsibleListData?.initialExpandedItems === 'NONE').length }, null, 2));
    return;
  }
  const [drafts, published] = await Promise.all([findBySlug('draft-posts', 'draftPosts'), findBySlug('posts', 'posts')]);
  if (drafts.length || published.length) throw new Error('Slug collision: drafts=' + drafts.map((item) => item.id).join(',') + ' published=' + published.map((item) => item.id).join(','));
  const media = new Map();
  for (const image of markdownImages) media.set(image.relPath, await uploadImage(image.relPath, image.altText));
  const cover = media.get(POST.coverPath);
  const richContent = parseMarkdown(body, media);
  richContent.nodes.push(imageCreditsNode());
  const draftPost = {
    title: TITLE, memberId: MEMBER_ID, excerpt: POST.excerpt, featured: false, commentingEnabled: false, language: 'en', categoryIds: [CATEGORY_ID], hashtags: POST.hashtags, minutesToRead: Math.max(4, Math.round(body.split(/\s+/).filter(Boolean).length / 220)), seoSlug: SLUG, slugs: [SLUG], seoData: seoData(cover, faq), richContent,
    media: { wixMedia: { image: { id: cover.id, url: cover.url, height: cover.height, width: cover.width, altText: cover.altText, filename: cover.filename } }, displayed: true, custom: false, altText: cover.altText },
  };
  const created = await wixFetch('/blog/v3/draft-posts', { method: 'POST', body: { draftPost, fieldsets: ['RICH_CONTENT'], publish: false } });
  const createdId = (created.draftPost || created).id;
  assert(createdId, 'Create draft returned no ID');
  const verifiedPayload = await wixFetch('/blog/v3/draft-posts/' + encodeURIComponent(createdId) + '?fieldsets=RICH_CONTENT');
  const verified = verifiedPayload.draftPost || verifiedPayload;
  const nodes = verified.richContent?.nodes || [];
  const report = { mode: 'CREATED', draftId: verified.id, title: verified.title, status: verified.status, hasUnpublishedChanges: verified.hasUnpublishedChanges, seoSlug: verified.seoSlug, categoryIds: verified.categoryIds, images: nodes.filter((node) => node.type === 'IMAGE').length, imageAlts: nodes.filter((node) => node.type === 'IMAGE' && node.imageData?.altText?.trim()).length, embeds: nodes.filter((node) => node.type === 'HTML').map((node) => ({ url: node.htmlData?.url, height: node.htmlData?.containerData?.height?.custom, hasSpoiler: Object.prototype.hasOwnProperty.call(node.htmlData?.containerData || {}, 'spoiler') })), bodyH1: nodes.filter((node) => node.type === 'HEADING' && Number(node.headingData?.level) === 1).length, captions: nodes.filter((node) => node.type === 'PARAGRAPH' && node.paragraphData?.textStyle?.textAlignment === 'CENTER').length, imageCredits: nodes.filter((node) => node.type === 'COLLAPSIBLE_LIST' && node.collapsibleListData?.initialExpandedItems === 'NONE').length, seoTags: verified.seoData?.tags?.length || 0, media: [...media.entries()].map(([relPath, item]) => ({ relPath, id: item.id, url: item.url, width: item.width, height: item.height })), editUrl: 'https://manage.wix.com/dashboard/' + SITE_ID + '/blog/drafts/' + verified.id + '/edit' };
  if (report.status !== 'UNPUBLISHED' || report.seoSlug !== SLUG || report.images !== 4 || report.imageAlts !== 4 || report.embeds.length !== 3 || report.bodyH1 !== 0 || report.captions !== 4 || report.imageCredits !== 1 || report.embeds.some((item) => item.hasSpoiler)) throw new Error('Draft readback did not meet package shape: ' + JSON.stringify(report));
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => { console.error('ERROR:', error.message || error); process.exit(1); });
