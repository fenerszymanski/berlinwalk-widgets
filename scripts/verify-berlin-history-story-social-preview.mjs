#!/usr/bin/env node

/*
 * Social-card QA for the independently published History Story page. It makes
 * read-only network requests and writes one local QA evidence JSON only.
 * It requires Wix's final media URL because runtime-injected metadata cannot
 * prove what browser, Twitterbot or Facebook receive from Wix server HTML.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const QA_DIR = path.join(ROOT, 'output', 'qa', 'berlin-history-story-v2');
const OUT_PATH = path.join(QA_DIR, 'social-preview-check.json');
const DEFAULT_PAGE_URL = 'https://www.berlinwalk.com/berlin-history-story';
const EXPECTED = {
  title: 'Berlin, Remade: 12 Chapters in Berlin History | BerlinWalk',
  description: 'Read 12 chapters in Berlin history, from Molkenmarkt and medieval Cölln to Greater Berlin, the Wall and the city today.',
  twitterCard: 'summary_large_image',
  width: '1200',
  height: '630',
};
const AGENTS = [
  { key: 'browser', ua: 'Mozilla/5.0 BerlinWalk social-preview QA' },
  { key: 'twitterbot', ua: 'Twitterbot/1.0' },
  { key: 'facebook', ua: 'facebookexternalhit/1.1' },
];

function parseArgs(argv) {
  let pageUrl = DEFAULT_PAGE_URL;
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === '--url' && argv[index + 1]) {
      pageUrl = argv[index + 1];
      index += 1;
      continue;
    }
    throw new Error('Usage: BW_BERLIN_HISTORY_STORY_SOCIAL_IMAGE=<exact-wix-media-url> node berlinwalk-widgets/scripts/verify-berlin-history-story-social-preview.mjs [--url https://www.berlinwalk.com/berlin-history-story]');
  }
  const url = new URL(pageUrl);
  if (url.protocol !== 'https:' || url.hostname !== 'www.berlinwalk.com' || url.pathname !== '/berlin-history-story') {
    throw new Error('The target must be the canonical HTTPS History Story page on www.berlinwalk.com.');
  }
  const expectedImage = process.env.BW_BERLIN_HISTORY_STORY_SOCIAL_IMAGE || '';
  let imageUrl;
  try { imageUrl = new URL(expectedImage); } catch { throw new Error('Set BW_BERLIN_HISTORY_STORY_SOCIAL_IMAGE to the exact Wix-uploaded social-image URL before running this verifier.'); }
  if (imageUrl.protocol !== 'https:' || !(imageUrl.hostname === 'wixstatic.com' || imageUrl.hostname.endsWith('.wixstatic.com'))) {
    throw new Error('BW_BERLIN_HISTORY_STORY_SOCIAL_IMAGE must be the exact HTTPS Wix static-media URL, not a proxy or local file.');
  }
  return { pageUrl: url.toString(), expectedImage };
}

function decodeHtml(value) {
  return String(value || '')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

function attrs(tag) {
  const output = {};
  const rx = /([a-zA-Z_:.-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/g;
  let match;
  while ((match = rx.exec(tag))) output[match[1].toLowerCase()] = decodeHtml(match[3] || match[4] || match[5] || '');
  return output;
}

function parseHead(html) {
  const head = (html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i) || [null, html])[1] || html;
  const metas = [];
  const links = [];
  let match;
  const metaRx = /<meta\b[^>]*>/gi;
  while ((match = metaRx.exec(head))) metas.push(attrs(match[0]));
  const linkRx = /<link\b[^>]*>/gi;
  while ((match = linkRx.exec(head))) links.push(attrs(match[0]));
  const byName = (name) => metas.filter((item) => item.name === name).map((item) => item.content || '');
  const byProperty = (property) => metas.filter((item) => item.property === property).map((item) => item.content || '');
  return {
    title: decodeHtml((head.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i) || [null, ''])[1]).trim(),
    canonical: (links.find((item) => item.rel === 'canonical') || {}).href || '',
    description: byName('description'), ogTitle: byProperty('og:title'), ogDescription: byProperty('og:description'),
    ogImage: byProperty('og:image'), ogImageWidth: byProperty('og:image:width'), ogImageHeight: byProperty('og:image:height'),
    twitterCard: byName('twitter:card'), twitterTitle: byName('twitter:title'),
    twitterDescription: byName('twitter:description'), twitterImage: byName('twitter:image'),
  };
}

function imageDimensions(bytes) {
  if (bytes.length >= 24 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    return { format: 'png', width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }
  if (bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    for (let offset = 2; offset + 9 < bytes.length;) {
      if (bytes[offset] !== 0xff) { offset += 1; continue; }
      while (bytes[offset] === 0xff) offset += 1;
      const marker = bytes[offset];
      if (marker === 0xd8 || marker === 0xd9 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { offset += 1; continue; }
      if (offset + 2 >= bytes.length) break;
      const length = bytes.readUInt16BE(offset + 1);
      const sof = (marker >= 0xc0 && marker <= 0xc3) || (marker >= 0xc5 && marker <= 0xc7) || (marker >= 0xc9 && marker <= 0xcb) || (marker >= 0xcd && marker <= 0xcf);
      if (sof && offset + 8 < bytes.length) return { format: 'jpeg', width: bytes.readUInt16BE(offset + 6), height: bytes.readUInt16BE(offset + 4) };
      if (length < 2) break;
      offset += 1 + length;
    }
  }
  if (bytes.length >= 30 && bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP') {
    for (let offset = 12; offset + 18 <= bytes.length;) {
      const chunk = bytes.subarray(offset, offset + 4).toString('ascii');
      const length = bytes.readUInt32LE(offset + 4);
      if (chunk === 'VP8X' && offset + 18 <= bytes.length) {
        return { format: 'webp', width: bytes.readUIntLE(offset + 12, 3) + 1, height: bytes.readUIntLE(offset + 15, 3) + 1 };
      }
      if (chunk === 'VP8 ' && offset + 18 <= bytes.length && bytes[offset + 11] === 0x9d && bytes[offset + 12] === 0x01 && bytes[offset + 13] === 0x2a) {
        return { format: 'webp', width: bytes.readUInt16LE(offset + 14) & 0x3fff, height: bytes.readUInt16LE(offset + 16) & 0x3fff };
      }
      if (chunk === 'VP8L' && offset + 14 <= bytes.length && bytes[offset + 8] === 0x2f) {
        const bits = bytes.readUInt32LE(offset + 9);
        return { format: 'webp', width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1 };
      }
      offset += 8 + length + (length % 2);
    }
  }
  return { format: 'unknown', width: 0, height: 0 };
}

async function fetchPage(pageUrl, agent) {
  const response = await fetch(pageUrl, {
    redirect: 'follow', headers: { accept: 'text/html', 'cache-control': 'no-cache', 'user-agent': agent.ua },
  });
  return { agent: agent.key, status: response.status, ok: response.ok, finalUrl: response.url, meta: parseHead(await response.text()) };
}

async function fetchImage(url) {
  const response = await fetch(url, {
    redirect: 'follow',
    headers: { accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8', 'user-agent': 'Twitterbot/1.0' },
  });
  const bytes = Buffer.from(await response.arrayBuffer());
  return {
    status: response.status, ok: response.ok, contentType: response.headers.get('content-type') || '',
    contentLength: Number(response.headers.get('content-length') || bytes.length || 0), bytesFetched: bytes.length,
    dimensions: imageDimensions(bytes), finalUrl: response.url,
  };
}

function one(values, expected) {
  return values.length === 1 && values[0] === expected;
}

function inspect(page, pageUrl, expectedImage) {
  const meta = page.meta;
  return {
    agent: page.agent, statusOk: page.ok, finalUrlOk: page.finalUrl === pageUrl, canonicalOk: meta.canonical === pageUrl,
    titleOk: meta.title === EXPECTED.title && one(meta.ogTitle, EXPECTED.title) && one(meta.twitterTitle, EXPECTED.title),
    descriptionOk: one(meta.description, EXPECTED.description) && one(meta.ogDescription, EXPECTED.description) && one(meta.twitterDescription, EXPECTED.description),
    twitterCardOk: one(meta.twitterCard, EXPECTED.twitterCard), oneOgImage: meta.ogImage.length === 1,
    oneTwitterImage: meta.twitterImage.length === 1, sameExactImage: one(meta.ogImage, expectedImage) && one(meta.twitterImage, expectedImage),
    dimensionsOk: one(meta.ogImageWidth, EXPECTED.width) && one(meta.ogImageHeight, EXPECTED.height), image: meta.twitterImage[0] || meta.ogImage[0] || '',
  };
}

async function main() {
  const { pageUrl, expectedImage } = parseArgs(process.argv.slice(2));
  const pages = [];
  for (const agent of AGENTS) pages.push(await fetchPage(pageUrl, agent));
  const checks = pages.map((page) => inspect(page, pageUrl, expectedImage));
  const image = await fetchImage(expectedImage);
  const imageChecks = {
    statusOk: image.ok, imageFormatOk: /^image\/(jpeg|png|webp)/i.test(image.contentType),
    underFiveMb: image.bytesFetched > 0 && image.bytesFetched < 5 * 1024 * 1024,
    pixelsOk: image.dimensions.width === Number(EXPECTED.width) && image.dimensions.height === Number(EXPECTED.height),
  };
  const ok = checks.every((check) => Object.entries(check).every(([key, value]) => key === 'agent' || key === 'image' || value === true))
    && Object.values(imageChecks).every(Boolean);
  const output = {
    ok, checkedAt: new Date().toISOString(), pageUrl, expectedImage,
    interpretation: ok
      ? 'Native Wix server HTML and the exact social creative pass for browser, Twitterbot and Facebook checks.'
      : 'Do not post or publish: native Wix server HTML or social-image headers do not match the approved History Story settings.',
    pages, checks, image, imageChecks,
  };
  await fs.mkdir(QA_DIR, { recursive: true });
  await fs.writeFile(OUT_PATH, JSON.stringify(output, null, 2) + '\n');
  console.log(JSON.stringify(output, null, 2));
  if (!ok) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
