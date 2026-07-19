#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const faqDataPath = path.join(repoRoot, 'faq', 'data.json');
const slugMapPath = path.join(repoRoot, 'faq', 'slug-map.json');
const outputPath = path.join(repoRoot, 'faq', 'inject.js');
const faqShardDir = path.join(repoRoot, 'faq', 'data');
const quickSummaryDataPath = path.join(repoRoot, 'quick-summary', 'data.json');
const quickSummaryShardDir = path.join(repoRoot, 'quick-summary', 'data');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function markdownToPlainText(value) {
  return String(value || '')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)(?:\s+"[^"]*")?\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function groupsFor(config) {
  if (Array.isArray(config?.tabs) && config.tabs.length) {
    return config.tabs
      .map((tab) => (Array.isArray(tab.items) ? tab.items : []))
      .flat();
  }
  return Array.isArray(config?.items) ? config.items : [];
}

function faqSchemaFor(config) {
  const items = groupsFor(config);
  if (!items.length) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items
      .filter((item) => item?.q && item?.a)
      .map((item) => ({
        '@type': 'Question',
        name: markdownToPlainText(item.q),
        acceptedAnswer: {
          '@type': 'Answer',
          text: markdownToPlainText(item.a),
        },
      })),
  };
}

function validate({ faqData, slugMap, schemas }) {
  const missing = Object.entries(slugMap)
    .filter(([, faqKey]) => !faqData[faqKey])
    .map(([slug, faqKey]) => `${slug} -> ${faqKey}`);

  if (missing.length) {
    throw new Error(`slug-map.json points to missing FAQ keys:\n${missing.join('\n')}`);
  }

  const schemaText = JSON.stringify(schemas);
  const markdownLeaks = [
    /\*\*/.test(schemaText) && '**',
    /__/.test(schemaText) && '__',
    /\[[^\]]+\]\(https?:\/\/[^)]+\)/.test(schemaText) && 'markdown links',
  ].filter(Boolean);

  if (markdownLeaks.length) {
    throw new Error(`Generated FAQ schema still contains Markdown: ${markdownLeaks.join(', ')}`);
  }
}

function safeShardName(value) {
  const name = String(value || '').trim();
  if (!name || name === '.' || name === '..' || /[\\/\0]/.test(name)) {
    throw new Error(`Unsafe generated shard name: ${name || '(empty)'}`);
  }
  return name;
}

function resetGeneratedDir(dirPath) {
  fs.rmSync(dirPath, { recursive: true, force: true });
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeCompactJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value)}\n`);
}

function writeFaqShards({ faqData, slugMap, schemas }) {
  resetGeneratedDir(faqShardDir);
  const targets = new Map(Object.keys(faqData).map((key) => [key, key]));
  Object.entries(slugMap).forEach(([slug, faqKey]) => targets.set(slug, faqKey));

  for (const [slug, faqKey] of targets) {
    const config = faqData[faqKey];
    if (!config) continue;
    const shard = {
      version: 1,
      slug,
      key: faqKey,
      config,
      schema: schemas[faqKey] || null,
    };
    writeCompactJson(path.join(faqShardDir, `${safeShardName(slug)}.json`), shard);
  }

  return targets.size;
}

function writeQuickSummaryShards() {
  const quickSummaryData = readJson(quickSummaryDataPath);
  resetGeneratedDir(quickSummaryShardDir);
  for (const [slug, config] of Object.entries(quickSummaryData)) {
    writeCompactJson(path.join(quickSummaryShardDir, `${safeShardName(slug)}.json`), config);
  }
  return Object.keys(quickSummaryData).length;
}

function buildInject() {
  return `/* Auto-generated lightweight FAQ JSON-LD loader - do not edit by hand. */
(function () {
  function currentPostSlug() {
    var parts = window.location.pathname.split('/').filter(Boolean);
    if (parts.length !== 2 || parts[0] !== 'post') return '';
    try { return decodeURIComponent(parts[1]); } catch (error) { return parts[1] || ''; }
  }

  function containsFaqPage(value) {
    if (!value || typeof value !== 'object') return false;
    if (Array.isArray(value)) return value.some(containsFaqPage);
    var type = value['@type'];
    if (type === 'FAQPage' || (Array.isArray(type) && type.indexOf('FAQPage') !== -1)) return true;
    return Array.isArray(value['@graph']) && value['@graph'].some(containsFaqPage);
  }

  function existingFaqSchema() {
    var scripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (var i = 0; i < scripts.length; i += 1) {
      try {
        if (containsFaqPage(JSON.parse(scripts[i].textContent || 'null'))) return true;
      } catch (error) {
        // Ignore unrelated malformed JSON-LD and keep checking the page.
      }
    }
    return false;
  }

  function injectSchema(schema) {
    if (!schema || document.getElementById('bw-faq-jsonld') || existingFaqSchema()) return;
    var script = document.createElement('script');
    script.id = 'bw-faq-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  var slug = currentPostSlug();
  if (!slug) return;

  var loaderScript = document.currentScript;
  var loaderUrl = loaderScript && loaderScript.src ? loaderScript.src : '';
  var dataBase = loaderUrl
    ? new URL('./data/', loaderUrl).href
    : 'https://fenerszymanski.github.io/berlinwalk-widgets/faq/data/';
  var version = '';
  try { version = loaderUrl ? new URL(loaderUrl).searchParams.get('v') || '' : ''; } catch (error) {}
  var dataUrl = dataBase + encodeURIComponent(slug) + '.json' + (version ? '?v=' + encodeURIComponent(version) : '');

  fetch(dataUrl, { cache: 'force-cache', credentials: 'omit' })
    .then(function (response) { return response.ok ? response.json() : null; })
    .then(function (payload) { if (payload && payload.schema) injectSchema(payload.schema); })
    .catch(function () {});
})();
`;
}

function main() {
  const faqData = readJson(faqDataPath);
  const slugMap = readJson(slugMapPath);
  const schemas = {};

  for (const [key, config] of Object.entries(faqData)) {
    const schema = faqSchemaFor(config);
    if (schema?.mainEntity?.length) schemas[key] = schema;
  }

  validate({ faqData, slugMap, schemas });
  const faqShardCount = writeFaqShards({ faqData, slugMap, schemas });
  const quickSummaryShardCount = writeQuickSummaryShards();
  fs.writeFileSync(outputPath, buildInject());

  console.log(`Generated ${path.relative(repoRoot, outputPath)}`);
  console.log(`FAQ entries: ${Object.keys(faqData).length}`);
  console.log(`Slug mappings: ${Object.keys(slugMap).length}`);
  console.log(`FAQ shards: ${faqShardCount}`);
  console.log(`Quick Summary shards: ${quickSummaryShardCount}`);
}

main();
