#!/usr/bin/env node

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const OUT_PATH = resolve('output/qa/transport-depth-refresh-pages-proof.json');

const TARGETS = [
  {
    key: 'quickSummaryData',
    url: 'https://fenerszymanski.github.io/berlinwalk-widgets/quick-summary/data.json',
    required: [
      '€39.50 (72h)',
      '€10 for 72h',
      'activate the ticket before the journey begins',
      'AB covers Berlin city',
    ],
    stale: [
      'Basic (no transport) from €9',
      'Museum Island version (€62) often wins',
      'Digital tickets are validated automatically',
    ],
  },
  {
    key: 'faqInject',
    url: 'https://fenerszymanski.github.io/berlinwalk-widgets/faq/inject.js',
    required: [
      '€39.50 for 72 hours',
      'cannot be imported into the Berlin WelcomeCard app',
      '24-hour AB ticket at €11.20',
      'activate before the journey begins',
    ],
    stale: [
      'The 3-Day Museum Pass Berlin (€36)',
      'zones AB at around €9.50',
      'validated automatically at the moment of purchase',
    ],
  },
];

async function fetchCheck(target) {
  const res = await fetch(target.url, { redirect: 'follow' });
  const body = await res.text();
  const presentRequired = target.required.filter((marker) => body.includes(marker));
  const presentStale = target.stale.filter((marker) => body.includes(marker));
  return {
    key: target.key,
    url: target.url,
    status: res.status,
    lastModified: res.headers.get('last-modified'),
    etag: res.headers.get('etag'),
    required: {
      total: target.required.length,
      present: presentRequired,
      missing: target.required.filter((marker) => !body.includes(marker)),
    },
    stale: {
      total: target.stale.length,
      present: presentStale,
      cleared: target.stale.filter((marker) => !body.includes(marker)),
    },
    ok: res.ok && presentRequired.length === target.required.length && presentStale.length === 0,
  };
}

async function main() {
  const results = [];
  for (const target of TARGETS) {
    results.push(await fetchCheck(target));
  }

  const summary = {
    checkedAt: new Date().toISOString(),
    ok: results.every((item) => item.ok),
    results,
  };

  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, `${JSON.stringify(summary, null, 2)}\n`);

  console.log(JSON.stringify(summary, null, 2));
  if (!summary.ok) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error?.stack || String(error));
  process.exit(1);
});
