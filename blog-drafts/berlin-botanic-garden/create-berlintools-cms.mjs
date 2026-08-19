#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SITE_ID = '12ee5ea0-70a7-492f-8020-ffb27cbb630f';
const API_ROOT = 'https://www.wixapis.com';
const COLLECTION = 'BerlinTools';
const SLUG = 'berlin-plant-passport';
const ICON_PATH = path.join(ROOT, 'tools-home/icons/berlin-plant-passport.png');
const WIDGET_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/berlin-plant-passport/';

function headers(extra = {}) {
  if (!process.env.WIX_API_KEY) throw new Error('Missing WIX_API_KEY. Source scripts/load-api-keys.sh first.');
  return { Authorization: process.env.WIX_API_KEY, 'wix-site-id': SITE_ID, ...extra };
}

async function readBody(response) {
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
  const body = await readBody(response);
  if (!response.ok) throw new Error('Wix ' + pathname + ' ' + response.status + ': ' + JSON.stringify(body).slice(0, 900));
  return body;
}

async function exactMatches() {
  const response = await wixFetch('/wix-data/v2/items/query', {
    method: 'POST',
    body: { dataCollectionId: COLLECTION, query: { filter: { slug: SLUG }, paging: { limit: 2 } } },
  });
  return response.dataItems || [];
}

async function uploadIcon() {
  const generated = await wixFetch('/site-media/v1/files/generate-upload-url', {
    method: 'POST',
    body: { mimeType: 'image/png', fileName: SLUG + '.png', private: false, labels: ['berlintools', 'icon', SLUG] },
  });
  if (!generated.uploadUrl) throw new Error('Wix did not return an icon upload URL.');
  const upload = await fetch(generated.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'image/png' },
    body: fs.readFileSync(ICON_PATH),
  });
  const body = await readBody(upload);
  if (!upload.ok) throw new Error('Icon upload failed ' + upload.status + ': ' + JSON.stringify(body).slice(0, 600));
  const file = body.file || body;
  const image = file.media?.image?.image || {};
  if (!file.id || !file.url) throw new Error('Icon upload response has no public media identity.');
  return { id: file.id, url: file.url, width: image.width || 512, height: image.height || 512 };
}

let nextId = 1;
function textNode(text) {
  return { id: 'text_' + nextId++, nodes: [], textData: { decorations: [], text }, type: 'TEXT' };
}
function heading(text) {
  return { headingData: { level: 3, textStyle: { textAlignment: 'AUTO' } }, id: 'heading_' + nextId++, nodes: [textNode(text)], type: 'HEADING' };
}
function paragraph(text) {
  return { id: 'paragraph_' + nextId++, nodes: [textNode(text)], paragraphData: { indentation: 0, textStyle: { lineHeight: '1.7', textAlignment: 'AUTO' } }, type: 'PARAGRAPH' };
}
function bodyContent(sections) {
  nextId = 1;
  const nodes = [];
  for (const [title, text] of sections) {
    nodes.push(heading(title));
    nodes.push(paragraph(text));
  }
  const now = new Date().toISOString();
  return { documentStyle: {}, metadata: { version: 1, createdTimestamp: now, updatedTimestamp: now }, nodes };
}
function jsonLd(name, description) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url: 'https://www.berlinwalk.com/tools/' + SLUG,
    applicationCategory: 'TravelApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  });
}

const tool = {
  title: 'Berlin Plant Passport',
  h1: 'Build a Better Botanic Garden Visit',
  lead: 'Stamp in your weather cover, available time and garden aim to get one calm greenhouse-and-outdoor visit shape for Berlin Dahlem.',
  secondary: 'A local planning lens, not a live ticket, weather or opening-hours service. Check the Garden’s own page before travel.',
  seoTitle: 'Berlin Plant Passport: Plan a Botanic Garden Visit | BerlinWalk',
  seoDescription: 'Free Botanic Garden Berlin tool: stamp your weather cover, time and visit aim into a calm greenhouse-and-outdoor plan.',
  intro: 'Berlin Plant Passport helps you choose a realistic shape for a Botanic Garden visit: glasshouses first when cover matters, outdoor paths when the day is dry, and a short version when time is tight. It does not sell tickets, track a location or claim that a specific display, entrance or opening time will be available.',
  relatedTool1Slug: 'tiergarten-loop-planner',
  relatedTool1Title: 'Tiergarten Loop Planner',
  relatedTool1Url: 'https://www.berlinwalk.com/tools/tiergarten-loop-planner',
  relatedTool2Slug: 'museum-island-one-pick',
  relatedTool2Title: 'Museum Island: Pick One',
  relatedTool2Url: 'https://www.berlinwalk.com/tools/museum-island-one-pick',
  sections: [
    ['How the passport works', 'Choose one answer in each stamp: the weather cover you need, the time you can honestly spare and the part of the Garden you most want to experience. The finished pass gives a compact visit shape rather than a long to-do list.'],
    ['When to use glasshouses first', 'If rain, wind or a short window makes the day fragile, begin with the Great Tropical House and keep one outside loop as a bonus. That gives the visit a centre without betting the whole trip on the weather.'],
    ['When to go outside first', 'On a dry day with more time, take the outdoor garden while your attention is fresh and save glass for the last part. The result is calmer than trying to cross every section in both directions.'],
    ['What this does not promise', 'The tool does not show live weather, ticket stock, event access, entrance queues or opening hours. Check the Botanic Garden’s official visitor page on the day, especially before a weekend or a fixed onward booking.'],
  ],
};

async function main() {
  if (!process.argv.includes('--apply')) {
    const matches = await exactMatches();
    console.log(JSON.stringify({ mode: 'DRY_RUN', slug: SLUG, exactSlugMatches: matches.map((item) => item.id), widgetUrl: WIDGET_URL, relatedBlogFields: 'blank-before-publish' }, null, 2));
    if (matches.length) throw new Error('The exact BerlinTools slug already exists.');
    return;
  }

  const before = await exactMatches();
  if (before.length) throw new Error('The exact BerlinTools slug already exists: ' + before.map((item) => item.id).join(', '));
  const icon = await uploadIcon();
  const desired = {
    slug: SLUG,
    title: tool.title,
    h1: tool.h1,
    lead: tool.lead,
    secondary: tool.secondary,
    intro: tool.intro,
    seoTitle: tool.seoTitle,
    seoDescription: tool.seoDescription,
    jsonLd: jsonLd(tool.title, tool.lead),
    widgetUrl: WIDGET_URL,
    secondaryWidgetUrl: '',
    iconUrl: icon.url,
    bodyContent: bodyContent(tool.sections),
    'link-berlin-tools-title': '/tools/' + SLUG,
    relatedTool1Slug: tool.relatedTool1Slug,
    relatedTool1Title: tool.relatedTool1Title,
    relatedTool1Url: tool.relatedTool1Url,
    relatedTool2Slug: tool.relatedTool2Slug,
    relatedTool2Title: tool.relatedTool2Title,
    relatedTool2Url: tool.relatedTool2Url,
    relatedBlogTitle: '',
    relatedBlogPath: '',
    relatedBlogUrl: '',
    relatedBlogDescription: '',
  };
  const created = await wixFetch('/wix-data/v2/items', {
    method: 'POST',
    body: { dataCollectionId: COLLECTION, dataItem: { data: desired } },
  });
  const createdItem = created.dataItem || created;
  const itemId = createdItem.id || createdItem.data?._id;
  if (!itemId) throw new Error('CMS create response did not include an item ID.');
  const after = await exactMatches();
  if (after.length !== 1 || after[0].id !== itemId) throw new Error('CMS readback did not return one exact item.');
  const data = after[0].data || {};
  for (const key of ['slug', 'title', 'h1', 'lead', 'secondary', 'seoTitle', 'seoDescription', 'widgetUrl', 'iconUrl', 'relatedBlogTitle', 'relatedBlogPath', 'relatedBlogUrl', 'relatedBlogDescription']) {
    if (data[key] !== desired[key]) throw new Error('CMS readback mismatch for ' + key);
  }
  console.log(JSON.stringify({
    mode: 'CREATED',
    itemId,
    slug: data.slug,
    title: data.title,
    h1: data.h1,
    widgetUrl: data.widgetUrl,
    icon: { ...icon, relatedBlogFieldsBlank: !data.relatedBlogTitle && !data.relatedBlogPath && !data.relatedBlogUrl && !data.relatedBlogDescription },
    relatedBlogFields: {
      relatedBlogTitle: data.relatedBlogTitle,
      relatedBlogPath: data.relatedBlogPath,
      relatedBlogUrl: data.relatedBlogUrl,
      relatedBlogDescription: data.relatedBlogDescription,
    },
  }, null, 2));
}

main().catch((error) => {
  console.error('ERROR:', error.message || error);
  process.exit(1);
});
