import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, 'data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const allowedTypes = new Set(['Planner', 'Calculator', 'Map', 'Guide', 'Audio', 'Quiz', 'Game']);
const errors = [];

function fail(message) {
  errors.push(message);
}

if (!Array.isArray(data.hubCategories) || !data.hubCategories.length) {
  fail('hubCategories must be a non-empty array.');
}

const categoryKeys = new Set();
for (const category of data.hubCategories || []) {
  if (!category || typeof category !== 'object') {
    fail('hubCategories contains a non-object entry.');
    continue;
  }
  if (!category.key) fail('A hub category is missing key.');
  if (!category.label) fail(`Category ${category.key || '(unknown)'} is missing label.`);
  if (!category.blurb) fail(`Category ${category.key || '(unknown)'} is missing blurb.`);
  if (categoryKeys.has(category.key)) fail(`Duplicate hub category key: ${category.key}`);
  categoryKeys.add(category.key);
}

if (!Array.isArray(data.tools) || !data.tools.length) {
  fail('tools must be a non-empty array.');
}

const seenSlugs = new Set();
const visibleCounts = new Map();
let visibleCount = 0;

for (const tool of data.tools || []) {
  const slug = tool && tool.slug ? tool.slug : '(missing slug)';
  if (!tool || typeof tool !== 'object') {
    fail('tools contains a non-object entry.');
    continue;
  }

  if (!tool.slug) fail('A tool is missing slug.');
  if (seenSlugs.has(tool.slug)) fail(`Duplicate tool slug: ${tool.slug}`);
  seenSlugs.add(tool.slug);

  for (const field of ['title', 'lead', 'category', 'image', 'widgetUrl']) {
    if (!tool[field]) fail(`${slug} is missing ${field}.`);
  }

  if (!Number.isFinite(tool.embedHeight)) fail(`${slug} is missing numeric embedHeight.`);
  if (!tool.hubCategory) fail(`${slug} is missing hubCategory.`);
  if (tool.hubCategory && !categoryKeys.has(tool.hubCategory)) {
    fail(`${slug} uses unknown hubCategory: ${tool.hubCategory}`);
  }
  if (!tool.type) fail(`${slug} is missing type.`);
  if (tool.type && !allowedTypes.has(tool.type)) fail(`${slug} uses unknown type: ${tool.type}`);
  if (!Array.isArray(tool.tags) || !tool.tags.length) fail(`${slug} needs at least one tag.`);
  if (!Array.isArray(tool.aliases)) fail(`${slug} aliases must be an array.`);

  const status = String(tool.status || '').toLowerCase();
  const visible = Boolean(tool.widgetUrl) && tool.hidden !== true && tool.published !== false && status !== 'draft';
  if (visible) {
    visibleCount += 1;
    visibleCounts.set(tool.hubCategory, (visibleCounts.get(tool.hubCategory) || 0) + 1);
  }
}

if (errors.length) {
  console.error(errors.map(error => `- ${error}`).join('\n'));
  process.exit(1);
}

const countSummary = [...visibleCounts.entries()]
  .map(([key, count]) => `${key}:${count}`)
  .join(', ');

console.log(`OK: ${data.tools.length} tools, ${visibleCount} visible, ${categoryKeys.size} hub categories.`);
console.log(`Visible category counts: ${countSummary}`);
