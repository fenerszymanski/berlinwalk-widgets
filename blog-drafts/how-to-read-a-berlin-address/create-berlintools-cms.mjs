#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SITE_ID = '12ee5ea0-70a7-492f-8020-ffb27cbb630f';
const API_ROOT = 'https://www.wixapis.com';
const COLLECTION = 'BerlinTools';
const SLUG = 'berlin-address-compass';
const ICON_PATH = path.join(ROOT, 'tools-home/icons/berlin-address-compass.png');
const WIDGET_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/berlin-address-compass/';

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
  title: 'Berlin Address Compass',
  h1: 'Check a Berlin Address Before You Set Off',
  lead: 'Paste a Berlin address and separate the street, exact house number, postcode and arrival note before a small detail turns into the wrong door.',
  secondary: 'A calm local text check for visitors. It does not geocode addresses, track you or promise a route.',
  seoTitle: 'Berlin Address Compass: Check Street, Number & Postcode | BerlinWalk',
  seoDescription: 'Free Berlin address tool: separate a street name, exact house number, postcode and arrival note before you set off.',
  intro: 'Berlin addresses usually become confusing only when one small piece is dropped. This tool keeps the street, number, five-digit postcode and entrance detail visible as four separate checks. It does not search a map or decide that an address is correct; it makes it easier to use the full version in your normal map before you leave.',
  relatedTool1Slug: 'berlin-station-arrival-planner',
  relatedTool1Title: 'Berlin Station Arrival Planner',
  relatedTool1Url: 'https://www.berlinwalk.com/tools/berlin-station-arrival-planner',
  relatedTool2Slug: 'berlin-train-station-first-move',
  relatedTool2Title: 'Berlin Train Station First Move',
  relatedTool2Url: 'https://www.berlinwalk.com/tools/berlin-train-station-first-move',
  sections: [
    ['What this tool checks', 'Paste the address exactly as you received it. Berlin Address Compass looks for a street, a house number including a letter such as 12a, a five-digit postcode and Berlin, plus any arrival word such as courtyard or stairway. It returns a calm check, not a live map pin.'],
    ['Why small details matter', 'A street name alone can put you on the correct block but not at the correct door. Keep the number, any number letter, the postcode and an entrance note together when you move between a booking, a map and the pavement.'],
    ['What it does not do', 'The tool does not transmit what you type, locate a private address, handle door codes, or promise that a map result is correct. Use the completed address in your own navigation app and compare the displayed number when you arrive.'],
    ['Useful next move', 'If you are arriving by train, use the station planner first. If you are already in the historic centre, save the full address of the next stop before you leave the square or station where you have signal and time to check it.'],
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
