#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SITE_ID = '12ee5ea0-70a7-492f-8020-ffb27cbb630f';
const API_ROOT = 'https://www.wixapis.com';
const COLLECTION = 'BerlinTools';
const RUN_ID = '2026-08-19-1436-Europe-Berlin';
const SLUG = 'berlin-concrete-clue-chain';
const ICON_PATH = path.join(ROOT, 'tools-home/icons/berlin-concrete-clue-chain.png');
const WIDGET_URL = `https://fenerszymanski.github.io/berlinwalk-widgets/${SLUG}/`;
const REPORT_PATH = path.join(ROOT, 'output/qa/daily-blog-sol/2026-08-19', RUN_ID, 'wix/cms-readback.json');
const RELATED_FIELDS = ['relatedBlogTitle', 'relatedBlogPath', 'relatedBlogUrl', 'relatedBlogDescription'];

const tool = {
  title: 'Berlin Concrete Clue Chain',
  h1: 'Read Four Berlin Concrete Buildings Through Their Visible Clues',
  lead: 'Follow four visible building clues to separate a specialist exterior detour, a Kreuzberg gallery stop, a lived-in housing block and an Alexanderplatz counterpoint.',
  secondary: 'A short visual-reading tool for visitors. It does not promise live access, opening times or a fixed route.',
  seoTitle: 'Berlin Concrete Clue Chain: Read Four Post-War Buildings | BerlinWalk',
  seoDescription: 'Free Berlin architecture tool: follow four visible clues through Mäusebunker, St. Agnes, Corbusierhaus and Haus des Lehrers.',
  intro: 'Berlin Concrete Clue Chain lets you read one façade detail at a time instead of treating every concrete building as the same. Work through the service tubes of Mäusebunker, the former church form of St. Agnes, the coloured housing rhythm of Corbusierhaus and the mosaic base of Haus des Lehrers. Each reveal ends with a useful kind of detour, not an invented access promise.',
  relatedTool1Slug: 'berlin-bauhaus-lineage-map',
  relatedTool1Title: 'Berlin Bauhaus Lineage Map',
  relatedTool1Url: 'https://www.berlinwalk.com/tools/berlin-bauhaus-lineage-map',
  relatedTool2Slug: 'berlin-pink-pipe-decoder',
  relatedTool2Title: 'Berlin Pink Pipe Decoder',
  relatedTool2Url: 'https://www.berlinwalk.com/tools/berlin-pink-pipe-decoder',
  sections: [
    ['How the clue chain works', 'Choose the visible clue that belongs to each building. A correct choice reveals what the form tells you and gives one practical exterior, gallery, residential or Alexanderplatz move. A wrong choice is only an invitation to look again.'],
    ['What the four stops are', 'Mäusebunker is the specialist exterior-first stop in Lichterfelde. St. Agnes is the former Kreuzberg church now used by a gallery. Corbusierhaus is a residential post-war modernist counterpoint in Westend. Haus des Lehrers is the fast Alexanderplatz comparison with its large mosaic base.'],
    ['What this tool does not promise', 'The tool does not give live opening hours, interior access, transport times or a public-entry guarantee. Check a current official source before building a day around an interior visit, and view residential places from public space.'],
    ['Useful next move', 'If you want the city-centre history first, start at Alexanderplatz and add Haus des Lehrers to that day. Save Mäusebunker for a day when the building itself is the reason for the detour.'],
  ],
};

const assert = (ok, message) => { if (!ok) throw new Error(message); };
function headers(extra = {}) { assert(process.env.WIX_API_KEY, 'WIX_API_KEY is not loaded. Source scripts/load-api-keys.sh first.'); return { Authorization: process.env.WIX_API_KEY, 'wix-site-id': SITE_ID, 'Content-Type': 'application/json', ...extra }; }
async function readBody(response) { const raw = await response.text(); try { return raw ? JSON.parse(raw) : {}; } catch { return { raw: raw.slice(0, 1000) }; } }
async function wixFetch(pathname, options = {}) {
  const response = await fetch(`${API_ROOT}${pathname}`, { method: options.method || 'GET', headers: headers(options.headers || {}), body: options.body ? JSON.stringify(options.body) : undefined, signal: AbortSignal.timeout(30000) });
  const body = await readBody(response);
  if (!response.ok) throw new Error(`Wix ${options.method || 'GET'} ${pathname} HTTP ${response.status}: ${JSON.stringify(body).slice(0, 1000)}`);
  return body;
}
const writeJson = (file, value) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`); };
async function exactMatches() {
  const result = await wixFetch('/wix-data/v2/items/query', { method: 'POST', body: { dataCollectionId: COLLECTION, query: { filter: { slug: SLUG }, paging: { limit: 2 } } } });
  return result.dataItems || [];
}
async function uploadIcon() {
  const generated = await wixFetch('/site-media/v1/files/generate-upload-url', { method: 'POST', body: { mimeType: 'image/png', fileName: `${SLUG}.png`, private: false, labels: ['berlintools', 'icon', SLUG, RUN_ID] } });
  assert(generated.uploadUrl, 'Wix did not return an icon upload URL');
  const response = await fetch(generated.uploadUrl, { method: 'PUT', headers: { 'Content-Type': 'image/png' }, body: fs.readFileSync(ICON_PATH), signal: AbortSignal.timeout(60000) });
  const body = await readBody(response);
  if (!response.ok) throw new Error(`Icon upload failed HTTP ${response.status}: ${JSON.stringify(body).slice(0, 800)}`);
  const file = body.file || body; const image = file.media?.image?.image || {};
  assert(file.id && file.url, 'Icon upload response has no public media identity');
  return { id: file.id, url: file.url, width: image.width || 512, height: image.height || 512 };
}
let nextId = 0;
function textNode(text) { return { type: 'TEXT', id: `text_${++nextId}`, nodes: [], textData: { decorations: [], text } }; }
function heading(text) { return { type: 'HEADING', id: `heading_${++nextId}`, nodes: [textNode(text)], headingData: { level: 3, textStyle: { textAlignment: 'AUTO' } } }; }
function paragraph(text) { return { type: 'PARAGRAPH', id: `paragraph_${++nextId}`, nodes: [textNode(text)], paragraphData: { indentation: 0, textStyle: { lineHeight: '1.7', textAlignment: 'AUTO' } } }; }
function bodyContent(sections) { nextId = 0; const nodes = []; for (const [title, text] of sections) { nodes.push(heading(title), paragraph(text)); } const now = new Date().toISOString(); return { documentStyle: {}, metadata: { version: 1, createdTimestamp: now, updatedTimestamp: now }, nodes }; }
function jsonLd() { return JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebApplication', name: tool.title, description: tool.lead, url: `https://www.berlinwalk.com/tools/${SLUG}`, applicationCategory: 'TravelApplication', operatingSystem: 'All', offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' } }); }
function report(item, icon, mode) {
  const data = item.data || {};
  const output = { runId: RUN_ID, checkedAt: new Date().toISOString(), mode, cmsItemId: item.id, slug: data.slug, title: data.title, h1: data.h1, widgetUrl: data.widgetUrl, iconUrl: data.iconUrl, icon, relatedBlogFieldsBlank: RELATED_FIELDS.every((field) => data[field] === ''), relatedBlogFields: Object.fromEntries(RELATED_FIELDS.map((field) => [field, data[field]])) };
  writeJson(REPORT_PATH, output); return output;
}
async function main() {
  const apply = process.argv.includes('--apply');
  const before = await exactMatches();
  if (!apply) { console.log(JSON.stringify({ mode: 'DRY_RUN', runId: RUN_ID, slug: SLUG, exactSlugMatches: before.map((item) => item.id), widgetUrl: WIDGET_URL, relatedBlogFields: 'blank-before-publish' }, null, 2)); if (before.length) throw new Error(`CMS slug collision: ${before.map((item) => item.id).join(', ')}`); return; }
  assert(!before.length, `CMS slug collision: ${before.map((item) => item.id).join(', ')}`);
  const icon = await uploadIcon();
  const desired = {
    slug: SLUG, title: tool.title, h1: tool.h1, lead: tool.lead, secondary: tool.secondary, intro: tool.intro, seoTitle: tool.seoTitle, seoDescription: tool.seoDescription, jsonLd: jsonLd(), widgetUrl: WIDGET_URL, secondaryWidgetUrl: '', iconUrl: icon.url, seoImage: icon.url, bodyContent: bodyContent(tool.sections), 'link-berlin-tools-title': `/tools/${SLUG}`,
    relatedTool1Slug: tool.relatedTool1Slug, relatedTool1Title: tool.relatedTool1Title, relatedTool1Url: tool.relatedTool1Url, relatedTool2Slug: tool.relatedTool2Slug, relatedTool2Title: tool.relatedTool2Title, relatedTool2Url: tool.relatedTool2Url,
    relatedBlogTitle: '', relatedBlogPath: '', relatedBlogUrl: '', relatedBlogDescription: '',
  };
  const created = await wixFetch('/wix-data/v2/items', { method: 'POST', body: { dataCollectionId: COLLECTION, dataItem: { data: desired } } });
  const itemId = (created.dataItem || created).id || (created.dataItem || created).data?._id;
  assert(itemId, 'CMS create response did not include an item ID');
  const after = await exactMatches(); assert(after.length === 1 && after[0].id === itemId, 'CMS readback did not find exactly the item that was created');
  const data = after[0].data || {};
  for (const key of ['slug', 'title', 'h1', 'lead', 'secondary', 'seoTitle', 'seoDescription', 'widgetUrl', 'iconUrl', 'seoImage', ...RELATED_FIELDS]) assert(data[key] === desired[key], `CMS readback mismatch: ${key}`);
  const output = report(after[0], icon, 'CREATED'); assert(output.relatedBlogFieldsBlank, 'Related blog fields must remain blank until publication');
  console.log(JSON.stringify(output, null, 2));
}
main().catch((error) => { console.error(`ERROR: ${error.stack || error.message}`); process.exit(1); });
