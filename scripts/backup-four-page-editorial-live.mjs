#!/usr/bin/env node

/**
 * Captures the four editorial page baselines before a Wix release.
 *
 * Read-only: this script fetches public pages/assets and Wix custom embeds,
 * then writes a local rollback/evidence bundle. It never updates or publishes.
 */

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const SITE_ID = '12ee5ea0-70a7-492f-8020-ffb27cbb630f';
const WIX_API_ROOT = 'https://www.wixapis.com';
const DEFAULT_OUTPUT = path.resolve('output/qa/four-page-editorial-20260717/baseline');

const PAGES = [
  { key: 'meeting-point', url: 'https://www.berlinwalk.com/meeting-point' },
  { key: 'route', url: 'https://www.berlinwalk.com/berlin-walking-tour-route' },
  { key: 'reviews', url: 'https://www.berlinwalk.com/reviews' },
  { key: 'the-guide', url: 'https://www.berlinwalk.com/the-guide' },
];

const COMPONENTS = [
  {
    key: 'meeting-point-element',
    url: 'https://fenerszymanski.github.io/berlinwalk-widgets/meeting-point/meeting-point-element.js',
  },
  {
    key: 'route-story-element',
    url: 'https://fenerszymanski.github.io/berlinwalk-widgets/route-story/route-story-element.js',
  },
  {
    key: 'reviews-element',
    url: 'https://fenerszymanski.github.io/berlinwalk-widgets/reviews/reviews-element.js',
  },
  {
    key: 'the-guide-element',
    url: 'https://fenerszymanski.github.io/berlinwalk-widgets/the-guide/the-guide-element.js',
  },
];

const RELEVANT_EMBED_NAMES = new Set([
  'BerlinWalk Route Story SEO',
  'BerlinWalk Route Story Layout Fix',
  'BerlinWalk Core Web Vitals Reserve Head',
  'BerlinWalk Core Web Vitals Reserve Head Live',
  'BerlinWalk Site Footer Restore',
  'sticky for desktop',
  'BerlinWalk Four Page Editorial System',
]);

const REQUIRED_PROTECTED_EMBED_NAMES = [
  'BerlinWalk Route Story SEO',
  'BerlinWalk Route Story Layout Fix',
  'BerlinWalk Core Web Vitals Reserve Head',
  'BerlinWalk Core Web Vitals Reserve Head Live',
  'BerlinWalk Site Footer Restore',
  'sticky for desktop',
];

function parseArgs(argv) {
  const outputArg = argv.find((value) => value.startsWith('--output='));
  const unknown = argv.filter((value) => !value.startsWith('--output='));
  if (unknown.length) throw new Error(`Unknown argument(s): ${unknown.join(', ')}`);
  return {
    output: outputArg ? path.resolve(outputArg.slice('--output='.length)) : DEFAULT_OUTPUT,
  };
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function requireWixKey() {
  if (!process.env.WIX_API_KEY) {
    throw new Error('WIX_API_KEY is missing. Load it from Keychain before running this read-only backup.');
  }
  return process.env.WIX_API_KEY;
}

async function wixFetch(pathname) {
  const response = await fetch(`${WIX_API_ROOT}${pathname}`, {
    headers: {
      Authorization: requireWixKey(),
      'wix-site-id': SITE_ID,
      'Content-Type': 'application/json',
    },
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Wix GET ${pathname} failed (${response.status}): ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : null;
}

async function capturePublicResource(entry, output, extension) {
  const response = await fetch(entry.url, {
    redirect: 'follow',
    headers: { 'Cache-Control': 'no-cache' },
  });
  const body = await response.text();
  if (response.status !== 200) {
    throw new Error(`Public baseline fetch failed (${response.status}): ${entry.url}`);
  }
  const filename = `${entry.key}.${extension}`;
  await fs.writeFile(path.join(output, filename), body);
  return {
    key: entry.key,
    requestedUrl: entry.url,
    finalUrl: response.url,
    status: response.status,
    contentType: response.headers.get('content-type') || '',
    contentLength: body.length,
    etag: response.headers.get('etag') || '',
    lastModified: response.headers.get('last-modified') || '',
    sha256: sha256(body),
    file: filename,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  requireWixKey();
  await fs.mkdir(args.output, { recursive: true });

  const pageReadbacks = [];
  for (const page of PAGES) {
    pageReadbacks.push(await capturePublicResource(page, args.output, 'html'));
  }

  const componentReadbacks = [];
  for (const component of COMPONENTS) {
    componentReadbacks.push(await capturePublicResource(component, args.output, 'js'));
  }

  const customEmbedData = await wixFetch('/embeds/v1/custom-embeds?paging.limit=100');
  if (customEmbedData?.pagingMetadata?.hasNext) {
    throw new Error('Wix custom-embed list is paginated; refusing an incomplete baseline.');
  }
  const allEmbeds = customEmbedData?.customEmbeds || [];
  for (const name of REQUIRED_PROTECTED_EMBED_NAMES) {
    const matches = allEmbeds.filter((embed) => embed.name === name);
    if (matches.length !== 1) {
      throw new Error(`Expected exactly one protected embed named ${name}; found ${matches.length}.`);
    }
  }
  const duplicateRelevantNames = [...RELEVANT_EMBED_NAMES].filter((name) =>
    allEmbeds.filter((embed) => embed.name === name).length > 1);
  if (duplicateRelevantNames.length) {
    throw new Error(`Duplicate relevant Wix embed names: ${duplicateRelevantNames.join(', ')}`);
  }
  const embeds = allEmbeds
    .filter((embed) => RELEVANT_EMBED_NAMES.has(embed.name))
    .map((embed) => {
      const html = embed.embedData?.html || '';
      return {
        id: embed.id,
        revision: embed.revision,
        name: embed.name,
        enabled: embed.enabled,
        loadOnce: embed.loadOnce,
        domain: embed.domain,
        position: embed.position,
        embedData: { ...embed.embedData, html },
        htmlLength: html.length,
        sha256: sha256(html),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const manifest = {
    capturedAt: new Date().toISOString(),
    pages: pageReadbacks,
    components: componentReadbacks,
    embeds,
  };
  await fs.writeFile(path.join(args.output, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

  console.log(JSON.stringify({
    ok: true,
    output: args.output,
    pages: pageReadbacks.map(({ key, status, sha256: hash }) => ({ key, status, sha256: hash })),
    components: componentReadbacks.map(({ key, status, sha256: hash }) => ({ key, status, sha256: hash })),
    embeds: embeds.map(({ name, id, revision, enabled, sha256: hash }) => ({ name, id, revision, enabled, sha256: hash })),
  }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
