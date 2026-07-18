#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const faqDataPath = path.join(repoRoot, 'faq', 'data.json');
const slugMapPath = path.join(repoRoot, 'faq', 'slug-map.json');
const outputPath = path.join(repoRoot, 'faq', 'inject.js');

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

function buildInject({ slugMap, schemas }) {
  return `/* Auto-generated from /faq/data.json and /faq/slug-map.json - do not edit by hand. */
(function () {
  var SLUG_MAP = ${JSON.stringify(slugMap, null, 2)};

  var SCHEMAS = ${JSON.stringify(schemas, null, 2)};

  function currentSlug() {
    var parts = window.location.pathname.split('/').filter(Boolean);
    return parts[parts.length - 1] || '';
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

  function injectSchema(schemaKey) {
    var schema = SCHEMAS[schemaKey];
    if (!schema || document.getElementById('bw-faq-jsonld') || existingFaqSchema()) return;
    var script = document.createElement('script');
    script.id = 'bw-faq-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  var schemaKey = SLUG_MAP[currentSlug()];
  if (schemaKey) injectSchema(schemaKey);
})();
`;
}

function main() {
  const faqData = readJson(faqDataPath);
  const slugMap = readJson(slugMapPath);
  const schemas = {};
  const mappedKeys = new Set(Object.values(slugMap));

  for (const [key, config] of Object.entries(faqData).filter(([key]) => mappedKeys.has(key))) {
    const schema = faqSchemaFor(config);
    if (schema?.mainEntity?.length) schemas[key] = schema;
  }

  validate({ faqData, slugMap, schemas });
  fs.writeFileSync(outputPath, buildInject({ slugMap, schemas }));

  console.log(`Generated ${path.relative(repoRoot, outputPath)}`);
  console.log(`FAQ entries: ${Object.keys(schemas).length}`);
  console.log(`Slug mappings: ${Object.keys(slugMap).length}`);
}

main();
