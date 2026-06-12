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
  return `/* Auto-generated from /faq/data.json and /faq/slug-map.json - do not edit by hand. */\n(function () {\n  var SLUG_MAP = ${JSON.stringify(slugMap, null, 2)};\n\n  var SCHEMAS = ${JSON.stringify(schemas, null, 2)};\n\n  function currentSlug() {\n    var parts = window.location.pathname.split('/').filter(Boolean);\n    return parts[parts.length - 1] || '';\n  }\n\n  function injectSchema(schemaKey) {\n    var schema = SCHEMAS[schemaKey];\n    if (!schema || document.getElementById('bw-faq-jsonld')) return;\n    var script = document.createElement('script');\n    script.id = 'bw-faq-jsonld';\n    script.type = 'application/ld+json';\n    script.textContent = JSON.stringify(schema);\n    document.head.appendChild(script);\n  }\n\n  var schemaKey = SLUG_MAP[currentSlug()];\n  if (schemaKey) injectSchema(schemaKey);\n})();\n`;
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
