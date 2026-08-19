#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SITE_ID = '12ee5ea0-70a7-492f-8020-ffb27cbb630f';
const API_ROOT = 'https://www.wixapis.com';
const MEMBER_ID = '5a08a3af-4b9b-4403-9de7-3e26eba72dc0';
const CATEGORY_ID = '6da64e22-3360-42ec-a558-e906e4deeb19';
const SLUG = 'berlin-botanic-garden';
const TOOL_SLUG = 'berlin-plant-passport';
const TITLE = 'Berlin Botanic Garden: Is It Worth the Trip From Mitte?';
const DRAFT_DIR = 'blog-drafts/berlin-botanic-garden';
const BODY_PATH = path.join(ROOT, DRAFT_DIR, 'berlin-botanic-garden.body.md');
const FAQ_PATH = path.join(ROOT, 'faq/data.json');
const EMBED_VERSION = '20260819bp1';
const EMBEDS = {
  '{{quick-summary}}': {
    id: 'quick_summary_berlin_botanic_garden',
    url: 'https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/?post=berlin-botanic-garden&v=' + EMBED_VERSION,
    height: '1120',
  },
  '{{widget:berlin-plant-passport}}': {
    id: 'widget_berlin_plant_passport',
    url: 'https://fenerszymanski.github.io/berlinwalk-widgets/berlin-plant-passport/?v=' + EMBED_VERSION,
    height: '1820',
  },
  '{{faq}}': {
    id: 'faq_berlin_botanic_garden',
    url: 'https://fenerszymanski.github.io/berlinwalk-widgets/faq/?post=berlin-botanic-garden&v=' + EMBED_VERSION,
    height: '1360',
  },
};

const POST = {
  title: TITLE,
  slug: SLUG,
  seoTitle: 'Berlin Botanic Garden: Tickets, Greenhouses & Is It Worth It?',
  description: 'An honest guide to Berlin Botanic Garden in Dahlem: glasshouses, outdoor paths, current tickets and the kind of visit that makes the trip worthwhile.',
  excerpt: 'Use the glasshouses and weather to shape a Botanic Garden visit that feels calmer than another rushed Berlin landmark.',
  socialTitle: 'Berlin Botanic Garden: Is It Worth Leaving Mitte For?',
  socialDescription: 'A glasshouse-first plan for a calm Dahlem garden day, with the practical checks that matter before you go.',
  hashtags: ['berlin', 'berlinwalk', 'botanicgarden', 'dahlem', 'berlintips'],
  keywords: ['Berlin Botanic Garden', 'Botanical Garden Berlin', 'Berlin Botanic Garden tickets', 'Berlin greenhouses', 'Botanic Garden Dahlem'],
  coverPath: 'images/optimized/01-tropical-house-exterior.jpg',
};

const IMAGE_CREDITS = [
  {
    label: 'Great Tropical House at the Botanic Garden Berlin',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Gro%C3%9Fes_Tropenhaus_Botanischer_Garten_Dahlem_2024-11-02_01.jpg',
    creator: 'Leonhard Lenz',
    licence: 'CC0',
    licenceUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  {
    label: 'Inside the Tropical House',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Botanischer_Garten_-_Im_Tropenhaus_(Inside_the_Tropical_House)_-_geo.hlipp.de_-_26730.jpg',
    creator: 'Colin Smith',
    licence: 'CC BY-SA 2.0',
    licenceUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
  },
  {
    label: 'Italian Garden at the Botanic Garden Berlin',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Italienischer_Garten.jpg',
    creator: 'Burkhard Mücke',
    licence: 'CC BY-SA 4.0',
    licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  {
    label: 'Path in the Botanic Garden arboretum',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2018_05_26_-_Weg_im_Arboretum.jpg',
    creator: 'R.P. Braun',
    licence: 'CC BY-SA 4.0',
    licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
];

let nextId = 1;

function id(prefix) {
  return prefix + '_' + nextId++;
}

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
  const mimeType = filename.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
  const dimensions = imageDimensions(absolute);
  const generated = await wixFetch('/site-media/v1/files/generate-upload-url', {
    method: 'POST',
    body: { mimeType, fileName: filename, private: false, labels: ['blog', 'berlinwalk', SLUG] },
  });
  if (!generated.uploadUrl) throw new Error('Upload URL missing for ' + filename);
  const upload = await fetch(generated.uploadUrl, { method: 'PUT', headers: { 'Content-Type': mimeType }, body: fs.readFileSync(absolute) });
  const body = await responseBody(upload);
  if (!upload.ok) throw new Error('Upload failed for ' + filename + ': ' + upload.status + ' ' + JSON.stringify(body).slice(0, 600));
  const file = body.file || body;
  const image = file.media?.image?.image || {};
  if (!file.id || !file.url) throw new Error('Upload response missing media identity for ' + filename);
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
  function addText(text, decorations = inherited) {
    if (text) nodes.push(textNode(text, decorations));
  }
  while (cursor < markdown.length) {
    if (markdown.startsWith('**', cursor)) {
      const end = markdown.indexOf('**', cursor + 2);
      if (end !== -1) {
        nodes.push(...inlineNodes(markdown.slice(cursor + 2, end), [...inherited, { type: 'BOLD', fontWeightValue: 700 }]));
        cursor = end + 2;
        continue;
      }
    }
    if (markdown[cursor] === '_') {
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
    addText(markdown.slice(cursor, next));
    cursor = next;
  }
  return nodes.length ? nodes : [textNode('')];
}

function paragraph(text, lineHeight = '1.7') {
  return { type: 'PARAGRAPH', id: id('paragraph'), nodes: inlineNodes(text), paragraphData: { textStyle: { textAlignment: 'AUTO', lineHeight }, indentation: 0 } };
}

function caption(text) {
  const clean = text.replace(/^_/, '').replace(/_$/, '');
  return {
    type: 'PARAGRAPH',
    id: id('caption'),
    nodes: inlineNodes(clean, [{ type: 'FONT_SIZE', fontSizeData: { unit: 'PX', value: 12 } }, { type: 'ITALIC' }]),
    paragraphData: { textStyle: { textAlignment: 'CENTER', lineHeight: '1.45' }, indentation: 0 },
  };
}

function heading(text, level) {
  return { type: 'HEADING', id: id('heading'), nodes: [textNode(text)], headingData: { level, textStyle: { textAlignment: 'AUTO' } } };
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

function htmlNode(embed) {
  return {
    type: 'HTML',
    id: embed.id,
    nodes: [],
    htmlData: {
      containerData: { width: { custom: '940' }, alignment: 'CENTER', height: { custom: embed.height }, textWrap: true },
      url: embed.url,
      source: 'HTML',
      autoHeight: false,
    },
  };
}

function bulletList(items) {
  return {
    type: 'BULLETED_LIST',
    id: id('bulleted_list'),
    nodes: items.map((item) => ({ type: 'LIST_ITEM', id: id('list_item'), nodes: [paragraph(item, '1.6')] })),
  };
}

function collapsibleCredits() {
  const prefix = 'article_image_credits_' + SLUG.replace(/[^a-z0-9]+/g, '_');
  const creditParagraph = (entry, index) => ({
    type: 'PARAGRAPH',
    id: prefix + '_credit_' + index,
    nodes: [
      { type: 'TEXT', id: prefix + '_credit_' + index + '_source', nodes: [], textData: { text: entry.label, decorations: [linkDecoration(entry.sourceUrl)] } },
      { type: 'TEXT', id: prefix + '_credit_' + index + '_by', nodes: [], textData: { text: ': ' + entry.creator + ', ', decorations: [] } },
      { type: 'TEXT', id: prefix + '_credit_' + index + '_licence', nodes: [], textData: { text: entry.licence, decorations: [linkDecoration(entry.licenceUrl)] } },
      { type: 'TEXT', id: prefix + '_credit_' + index + '_via', nodes: [], textData: { text: ', via Wikimedia Commons.', decorations: [] } },
    ],
    paragraphData: { textStyle: { textAlignment: 'AUTO', lineHeight: '1.55' }, indentation: 0 },
  });
  return {
    type: 'COLLAPSIBLE_LIST',
    id: prefix,
    nodes: [{
      type: 'COLLAPSIBLE_ITEM',
      id: prefix + '_item',
      nodes: [
        {
          type: 'COLLAPSIBLE_ITEM_TITLE',
          id: prefix + '_title',
          nodes: [{
            type: 'PARAGRAPH',
            id: prefix + '_title_paragraph',
            nodes: [textNode('Image credits')],
            paragraphData: { textStyle: { textAlignment: 'AUTO' }, indentation: 0 },
          }],
        },
        {
          type: 'COLLAPSIBLE_ITEM_BODY',
          id: prefix + '_body',
          nodes: [
            {
              type: 'PARAGRAPH',
              id: prefix + '_intro',
              nodes: [textNode('Source and licence details for the 4 photographs used in this article.')],
              paragraphData: { textStyle: { textAlignment: 'AUTO', lineHeight: '1.55' }, indentation: 0 },
            },
            ...IMAGE_CREDITS.map(creditParagraph),
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
  };
}

function parseMarkdown(markdown, mediaByPath) {
  nextId = 1;
  const nodes = [];
  const lines = markdown.split(/\r?\n/);
  let paragraphBuffer = [];
  let listBuffer = [];
  let captionNext = false;
  function requireCaption(kind) {
    if (captionNext) throw new Error('Each markdown image needs a caption before ' + kind + '.');
  }
  function flushList() {
    if (!listBuffer.length) return;
    nodes.push(bulletList(listBuffer));
    listBuffer = [];
  }
  function flushParagraph() {
    if (!paragraphBuffer.length) return;
    const text = paragraphBuffer.join(' ').replace(/\s+/g, ' ').trim();
    nodes.push(captionNext ? caption(text) : paragraph(text));
    captionNext = false;
    paragraphBuffer = [];
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
      requireCaption('an embed');
      nodes.push(htmlNode(EMBEDS[line]));
      continue;
    }
    const imageMatch = line.match(/^!\[(.*?)]\((.*?)\)$/);
    if (imageMatch) {
      flushParagraph();
      flushList();
      requireCaption('another image');
      const media = mediaByPath.get(imageMatch[2]);
      if (!media) throw new Error('Missing media for ' + imageMatch[2]);
      nodes.push(imageNode({ ...media, altText: imageMatch[1] }));
      captionNext = true;
      continue;
    }
    const h1 = line.match(/^#\s+(.+)$/);
    if (h1) throw new Error('The body contains a Markdown H1.');
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
      listBuffer.push(bullet[1]);
      continue;
    }
    flushList();
    paragraphBuffer.push(line);
  }
  flushParagraph();
  flushList();
  requireCaption('the end of the document');
  nodes.push(collapsibleCredits());
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

function plain(value) {
  return String(value || '').replace(/\*\*/g, '').replace(/_/g, '').replace(/\[([^\]]+)]\([^)]+\)/g, '$1').trim();
}

function seoData(cover) {
  const faq = JSON.parse(fs.readFileSync(FAQ_PATH, 'utf8'))[SLUG];
  const canonical = 'https://www.berlinwalk.com/post/' + SLUG;
  const blogPosting = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: TITLE,
    description: POST.description,
    image: [cover.url],
    author: { '@type': 'Person', name: 'Yusuf Ucuz' },
    publisher: { '@type': 'Organization', name: 'BerlinWalk', url: 'https://www.berlinwalk.com' },
    mainEntityOfPage: canonical,
    inLanguage: 'en',
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (faq.items || []).map((item) => ({
      '@type': 'Question',
      name: plain(item.q),
      acceptedAnswer: { '@type': 'Answer', text: plain(item.a) },
    })),
  };
  const meta = (props, custom = true) => ({ type: 'meta', props, children: '', custom, disabled: false });
  return {
    tags: [
      { type: 'title', children: POST.seoTitle, custom: false, disabled: false },
      meta({ name: 'description', content: POST.description }, false),
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
      { type: 'script', props: { type: 'application/ld+json' }, children: JSON.stringify(faqSchema), custom: true, disabled: false },
    ],
    settings: { preventAutoRedirect: false, keywords: POST.keywords.map((term, index) => ({ term, isMain: index === 0 })) },
  };
}

async function findBySlug(collection, key) {
  const found = [];
  let offset = 0;
  while (offset < 2000) {
    const payload = await wixFetch('/blog/v3/' + collection + '/query', { method: 'POST', body: { query: { paging: { limit: 100, offset } } } });
    const items = payload[key] || [];
    found.push(...items.filter((item) => item.seoSlug === SLUG || (item.slugs || []).includes(SLUG)));
    if (items.length < 100) break;
    offset += items.length;
  }
  return found;
}

async function main() {
  const execute = process.argv.includes('--create-unpublished-draft');
  const body = fs.readFileSync(BODY_PATH, 'utf8').trim();
  if (/^#\s+/m.test(body)) throw new Error('The body contains a Markdown H1.');
  const markdownImages = [...body.matchAll(/^!\[(.*?)]\((.*?)\)$/gm)].map((match) => ({ altText: match[1], relPath: match[2] }));
  if (markdownImages.length !== 4) throw new Error('Expected four editorial images, got ' + markdownImages.length);

  if (!execute) {
    const media = new Map(markdownImages.map((image, index) => [image.relPath, { id: 'dry_' + index, url: 'dry://' + path.basename(image.relPath), ...imageDimensions(path.join(path.dirname(BODY_PATH), image.relPath)), altText: image.altText }]));
    const content = parseMarkdown(body, media);
    console.log(JSON.stringify({ mode: 'DRY_RUN', images: markdownImages.length, embeds: content.nodes.filter((node) => node.type === 'HTML').length, bodyH1: content.nodes.filter((node) => node.type === 'HEADING' && node.headingData?.level === 1).length, captions: content.nodes.filter((node) => node.type === 'PARAGRAPH' && node.paragraphData?.textStyle?.textAlignment === 'CENTER').length }, null, 2));
    return;
  }

  const [drafts, published] = await Promise.all([findBySlug('draft-posts', 'draftPosts'), findBySlug('posts', 'posts')]);
  if (drafts.length || published.length) throw new Error('Slug collision: drafts=' + drafts.map((item) => item.id).join(',') + ' published=' + published.map((item) => item.id).join(','));

  const media = new Map();
  for (const image of markdownImages) media.set(image.relPath, await uploadImage(image.relPath, image.altText));
  const cover = media.get(POST.coverPath);
  const richContent = parseMarkdown(body, media);
  const draftPost = {
    title: TITLE,
    memberId: MEMBER_ID,
    excerpt: POST.excerpt,
    featured: false,
    commentingEnabled: false,
    language: 'en',
    categoryIds: [CATEGORY_ID],
    hashtags: POST.hashtags,
    minutesToRead: Math.max(3, Math.round(body.split(/\s+/).filter(Boolean).length / 220)),
    seoSlug: SLUG,
    slugs: [SLUG],
    seoData: seoData(cover),
    richContent,
    media: {
      wixMedia: { image: { id: cover.id, url: cover.url, height: cover.height, width: cover.width, altText: cover.altText, filename: cover.filename } },
      displayed: true,
      custom: false,
      altText: cover.altText,
    },
  };
  const created = await wixFetch('/blog/v3/draft-posts', { method: 'POST', body: { draftPost, fieldsets: ['RICH_CONTENT'], publish: false } });
  const createdId = (created.draftPost || created).id;
  if (!createdId) throw new Error('Create draft returned no ID');
  const verifiedPayload = await wixFetch('/blog/v3/draft-posts/' + encodeURIComponent(createdId) + '?fieldsets=RICH_CONTENT');
  const verified = verifiedPayload.draftPost || verifiedPayload;
  const nodes = verified.richContent?.nodes || [];
  const report = {
    mode: 'CREATED',
    draftId: verified.id,
    title: verified.title,
    status: verified.status,
    hasUnpublishedChanges: verified.hasUnpublishedChanges,
    seoSlug: verified.seoSlug,
    categoryIds: verified.categoryIds,
    images: nodes.filter((node) => node.type === 'IMAGE').length,
    imageAlts: nodes.filter((node) => node.type === 'IMAGE' && node.imageData?.altText?.trim()).length,
    embeds: nodes.filter((node) => node.type === 'HTML').map((node) => ({ url: node.htmlData?.url, height: node.htmlData?.containerData?.height?.custom, hasSpoiler: Object.prototype.hasOwnProperty.call(node.htmlData?.containerData || {}, 'spoiler') })),
    bodyH1: nodes.filter((node) => node.type === 'HEADING' && Number(node.headingData?.level) === 1).length,
    captions: nodes.filter((node) => node.type === 'PARAGRAPH' && node.paragraphData?.textStyle?.textAlignment === 'CENTER').length,
    collapsibleCredits: nodes.filter((node) => node.type === 'COLLAPSIBLE_LIST').map((node) => ({
      initialExpandedItems: node.collapsibleListData?.initialExpandedItems,
      entries: node.nodes?.[0]?.nodes?.[1]?.nodes?.length || 0,
    })),
    seoTags: verified.seoData?.tags?.length || 0,
    media: [...media.entries()].map(([relPath, item]) => ({ relPath, id: item.id, url: item.url, width: item.width, height: item.height })),
    editUrl: 'https://manage.wix.com/dashboard/' + SITE_ID + '/blog/drafts/' + verified.id + '/edit',
  };
  if (report.status !== 'UNPUBLISHED' || report.seoSlug !== SLUG || report.images !== 4 || report.imageAlts !== 4 || report.embeds.length !== 3 || report.bodyH1 !== 0 || report.captions !== 4 || report.collapsibleCredits.length !== 1 || report.collapsibleCredits[0].initialExpandedItems !== 'NONE' || report.collapsibleCredits[0].entries !== 5 || report.embeds.some((item) => item.hasSpoiler)) {
    throw new Error('Draft readback did not meet package shape: ' + JSON.stringify(report));
  }
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error('ERROR:', error.message || error);
  process.exit(1);
});
