#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SITE_ID = '12ee5ea0-70a7-492f-8020-ffb27cbb630f';
const API_ROOT = 'https://www.wixapis.com';
const COLLECTION = 'BerlinTools';
const SLUG = 'berlin-opera-house-reader';
const ICON_PATH = path.join(ROOT, 'tools-home/icons/berlin-opera-house-reader.png');
const WIDGET_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/berlin-opera-house-reader/';

function assert(condition, message) { if (!condition) throw new Error(message); }
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
  const response = await fetch(API_ROOT + pathname, { method: options.method || 'GET', headers: headers({ 'Content-Type': 'application/json', ...(options.headers || {}) }), body: options.body ? JSON.stringify(options.body) : undefined });
  const body = await readBody(response);
  if (!response.ok) throw new Error('Wix ' + pathname + ' ' + response.status + ': ' + JSON.stringify(body).slice(0, 900));
  return body;
}
async function exactMatches() {
  const response = await wixFetch('/wix-data/v2/items/query', { method: 'POST', body: { dataCollectionId: COLLECTION, query: { filter: { slug: SLUG }, paging: { limit: 2 } } } });
  return response.dataItems || [];
}
async function uploadIcon() {
  const generated = await wixFetch('/site-media/v1/files/generate-upload-url', { method: 'POST', body: { mimeType: 'image/png', fileName: SLUG + '.png', private: false, labels: ['berlintools', 'icon', SLUG] } });
  assert(generated.uploadUrl, 'Wix did not return an icon upload URL.');
  const upload = await fetch(generated.uploadUrl, { method: 'PUT', headers: { 'Content-Type': 'image/png' }, body: fs.readFileSync(ICON_PATH) });
  const body = await readBody(upload);
  if (!upload.ok) throw new Error('Icon upload failed ' + upload.status + ': ' + JSON.stringify(body).slice(0, 600));
  const file = body.file || body;
  const image = file.media?.image?.image || {};
  assert(file.id && file.url, 'Icon upload response has no public media identity.');
  return { id: file.id, url: file.url, width: image.width || 512, height: image.height || 512 };
}

let nextId = 1;
function textNode(text) { return { id: 'text_' + nextId++, nodes: [], textData: { decorations: [], text }, type: 'TEXT' }; }
function heading(text) { return { headingData: { level: 3, textStyle: { textAlignment: 'AUTO' } }, id: 'heading_' + nextId++, nodes: [textNode(text)], type: 'HEADING' }; }
function paragraph(text) { return { id: 'paragraph_' + nextId++, nodes: [textNode(text)], paragraphData: { indentation: 0, textStyle: { lineHeight: '1.7', textAlignment: 'AUTO' } }, type: 'PARAGRAPH' }; }
function bodyContent(sections) {
  nextId = 1;
  const nodes = [];
  for (const [title, text] of sections) { nodes.push(heading(title)); nodes.push(paragraph(text)); }
  const now = new Date().toISOString();
  return { documentStyle: {}, metadata: { version: 1, createdTimestamp: now, updatedTimestamp: now }, nodes };
}
function jsonLd(name, description) {
  return JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebApplication', name, description, url: 'https://www.berlinwalk.com/tools/' + SLUG, applicationCategory: 'TravelApplication', operatingSystem: 'All', offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' } });
}

const tool = {
  title: 'Berlin Opera House Reader',
  h1: 'Read Berlin’s Opera Houses Before You Plan the Evening',
  lead: 'Open three programme folds to separate a Mitte opera evening from a west-Berlin venue, then keep the exact production page as your final check.',
  secondary: 'A calm venue reader for first-time visitors. It does not compare ticket prices, check availability or choose a performance for you.',
  seoTitle: 'Berlin Opera House Reader: Choose the Right Venue | BerlinWalk',
  seoDescription: 'Free Berlin opera guide: compare Staatsoper, Deutsche Oper and Komische Oper at Schillertheater by neighbourhood and current venue.',
  intro: 'Berlin opera is easier when you start with the physical evening rather than a vague best-house search. Open the fixed programme folds to read the venue, the nearby part of the city and the last fact that still belongs on the current production page. The tool does not take booking data, price tickets or promise that a listing is current.',
  relatedTool1Slug: 'berlin-first-day-planner',
  relatedTool1Title: 'Berlin First Day Planner',
  relatedTool1Url: 'https://www.berlinwalk.com/tools/berlin-first-day-planner',
  relatedTool2Slug: 'berlin-address-compass',
  relatedTool2Title: 'Berlin Address Compass',
  relatedTool2Url: 'https://www.berlinwalk.com/tools/berlin-address-compass',
  sections: [
    ['What the reader gives you', 'Berlin Opera House Reader opens a short programme fold for Staatsoper Unter den Linden, Deutsche Oper Berlin and Komische Oper at Schillertheater. Each fold keeps a venue in its actual part of the city before you decide on an evening.'],
    ['What you still need to check', 'Use the individual official production page for the exact date, language, surtitles, running time, accessibility notes, seat availability and venue. Those details can change by performance, so a general tool should never guess them.'],
    ['How to use the result', 'If you want a Mitte evening, begin with Staatsoper. If your day is in Charlottenburg or City West, read Deutsche Oper and Komische Oper at Schillertheater. Then save the exact address published by the production you actually choose.'],
    ['A useful next move', 'Keep the ticket and venue address together on your phone, leave the hotel with time to arrive calmly and let one good evening have its own space in the trip.'],
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
    slug: SLUG, title: tool.title, h1: tool.h1, lead: tool.lead, secondary: tool.secondary, intro: tool.intro, seoTitle: tool.seoTitle, seoDescription: tool.seoDescription, jsonLd: jsonLd(tool.title, tool.lead), widgetUrl: WIDGET_URL, secondaryWidgetUrl: '', iconUrl: icon.url, bodyContent: bodyContent(tool.sections), 'link-berlin-tools-title': '/tools/' + SLUG,
    relatedTool1Slug: tool.relatedTool1Slug, relatedTool1Title: tool.relatedTool1Title, relatedTool1Url: tool.relatedTool1Url, relatedTool2Slug: tool.relatedTool2Slug, relatedTool2Title: tool.relatedTool2Title, relatedTool2Url: tool.relatedTool2Url,
    relatedBlogTitle: '', relatedBlogPath: '', relatedBlogUrl: '', relatedBlogDescription: '',
  };
  const created = await wixFetch('/wix-data/v2/items', { method: 'POST', body: { dataCollectionId: COLLECTION, dataItem: { data: desired } } });
  const createdItem = created.dataItem || created;
  const itemId = createdItem.id || createdItem.data?._id;
  assert(itemId, 'CMS create response did not include an item ID.');
  const after = await exactMatches();
  if (after.length !== 1 || after[0].id !== itemId) throw new Error('CMS readback did not return one exact item.');
  const data = after[0].data || {};
  for (const key of ['slug', 'title', 'h1', 'lead', 'secondary', 'seoTitle', 'seoDescription', 'widgetUrl', 'iconUrl', 'relatedBlogTitle', 'relatedBlogPath', 'relatedBlogUrl', 'relatedBlogDescription']) if (data[key] !== desired[key]) throw new Error('CMS readback mismatch for ' + key);
  console.log(JSON.stringify({ mode: 'CREATED', itemId, slug: data.slug, title: data.title, h1: data.h1, widgetUrl: data.widgetUrl, icon: { ...icon, relatedBlogFieldsBlank: !data.relatedBlogTitle && !data.relatedBlogPath && !data.relatedBlogUrl && !data.relatedBlogDescription }, relatedBlogFields: { relatedBlogTitle: data.relatedBlogTitle, relatedBlogPath: data.relatedBlogPath, relatedBlogUrl: data.relatedBlogUrl, relatedBlogDescription: data.relatedBlogDescription } }, null, 2));
}

main().catch((error) => { console.error('ERROR:', error.message || error); process.exit(1); });
