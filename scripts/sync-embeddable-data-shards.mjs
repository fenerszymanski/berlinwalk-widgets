#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const APPLY_FLAG = '--apply';
const rawArgs = process.argv.slice(2);
const apply = rawArgs.includes(APPLY_FLAG);
const slugs = rawArgs.filter((arg) => arg !== APPLY_FLAG);

if (!slugs.length) {
  throw new Error('Pass at least one exact post slug. Add --apply to write the matching Quick Summary and FAQ shards.');
}
if (new Set(slugs).size !== slugs.length) throw new Error('Duplicate slug argument.');
for (const slug of slugs) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Invalid slug: ${slug}`);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function faqSchema(config) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (config.items || []).map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

function expectedShard(kind, slug, config) {
  const file = path.join(ROOT, kind, 'data', `${slug}.json`);
  const current = fs.existsSync(file) ? readJson(file) : null;
  if (kind === 'quick-summary') {
    if (current && Object.hasOwn(current, 'config')) return { ...current, config };
    return config;
  }
  const envelope = current && Object.hasOwn(current, 'config')
    ? { ...current, version: current.version || 1, slug, key: slug, config }
    : { version: 1, slug, key: slug, config };
  if (current && Object.hasOwn(current, 'schema')) envelope.schema = faqSchema(config);
  return envelope;
}

function writeAtomic(file, value) {
  const temporary = `${file}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  fs.renameSync(temporary, file);
}

const aggregates = {
  'quick-summary': readJson(path.join(ROOT, 'quick-summary', 'data.json')),
  faq: readJson(path.join(ROOT, 'faq', 'data.json')),
};

const changes = [];
for (const slug of slugs) {
  for (const kind of ['quick-summary', 'faq']) {
    const config = aggregates[kind][slug];
    if (!config) throw new Error(`${kind}: aggregate entry missing for ${slug}`);
    const file = path.join(ROOT, kind, 'data', `${slug}.json`);
    const expected = expectedShard(kind, slug, config);
    const before = fs.existsSync(file) ? readJson(file) : null;
    const changed = JSON.stringify(before) !== JSON.stringify(expected);
    changes.push({ kind, slug, file: path.relative(ROOT, file), changed });
    if (apply && changed) writeAtomic(file, expected);
  }
}

for (const item of changes) console.log(`${item.changed ? 'CHANGE' : 'OK'} ${item.kind} ${item.slug} -> ${item.file}`);
if (!apply) {
  console.log('Dry run only. Re-run with --apply to write changed shards.');
} else {
  const changed = changes.filter((item) => item.changed).length;
  console.log(`Applied ${changed} shard update(s); ${changes.length - changed} already matched.`);
}
