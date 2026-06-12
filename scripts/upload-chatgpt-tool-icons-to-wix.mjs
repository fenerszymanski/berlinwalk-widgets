#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const ICONS_DIR = path.join(ROOT, 'tools-home', 'icons');
const SET_DIR = path.join(ICONS_DIR, 'chatgpt-standard-2026-06-12');
const MANIFEST_PATH = path.join(ICONS_DIR, 'manifest.json');
const HUB_DATA_PATH = path.join(ROOT, 'tools-hub', 'data.json');
const HOME_DATA_PATH = path.join(ROOT, 'tools-home', 'data.json');
const CACHE_PATH = path.join(SET_DIR, 'wix-upload-cache.json');
const API_ROOT = 'https://www.wixapis.com';
const SITE_ID = '12ee5ea0-70a7-492f-8020-ffb27cbb630f';

function parseArgs(argv) {
  return {
    dryRun: argv.includes('--dry-run'),
    force: argv.includes('--force'),
  };
}

function headers(contentType = 'application/json') {
  if (!process.env.WIX_API_KEY) {
    throw new Error('Missing WIX_API_KEY. Run from workspace root: source scripts/load-api-keys.sh');
  }
  const out = {
    Authorization: process.env.WIX_API_KEY,
    'wix-site-id': SITE_ID,
  };
  if (contentType) out['Content-Type'] = contentType;
  return out;
}

async function readJson(filePath, fallback) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return fallback;
    throw error;
  }
}

async function writeJson(filePath, value) {
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function wixFetch(pathname, { method = 'GET', body } = {}) {
  const response = await fetch(`${API_ROOT}${pathname}`, {
    method,
    headers: headers(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  let parsed;
  try {
    parsed = text ? JSON.parse(text) : {};
  } catch {
    parsed = { raw: text };
  }
  if (!response.ok) {
    throw new Error(`Wix ${method} ${pathname} failed (${response.status}): ${text.slice(0, 500)}`);
  }
  return parsed;
}

async function uploadPng(entry) {
  const slug = entry.slug;
  const buffer = await fs.readFile(entry.png512);
  const fileName = `berlinwalk-tool-icon-chatgpt-20260612-${slug}.png`;
  const generated = await wixFetch('/site-media/v1/files/generate-upload-url', {
    method: 'POST',
    body: {
      mimeType: 'image/png',
      fileName,
      private: false,
      labels: ['berlinwalk', 'berlintools', 'tool-icons', 'chatgpt-standard-20260612'],
    },
  });
  if (!generated.uploadUrl) throw new Error(`Missing uploadUrl for ${slug}`);
  const uploaded = await fetch(generated.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'image/png' },
    body: buffer,
  });
  const text = await uploaded.text();
  if (!uploaded.ok) throw new Error(`Upload failed for ${slug}: ${uploaded.status} ${text.slice(0, 500)}`);
  const payload = JSON.parse(text);
  const file = payload.file || payload;
  const image = file.media?.image?.image || {};
  return {
    slug,
    id: file.id,
    url: file.url,
    fileName,
    width: image.width || 512,
    height: image.height || 512,
  };
}

function withToolImages(data, urlBySlug) {
  return {
    ...data,
    tools: (data.tools || []).map((tool) => ({
      ...tool,
      image: urlBySlug.get(tool.slug) || tool.image,
    })),
  };
}

function withFeaturedImages(data, urlBySlug) {
  return {
    ...data,
    featuredTools: (data.featuredTools || []).map((tool) => ({
      ...tool,
      image: urlBySlug.get(tool.slug) || tool.image,
    })),
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const manifest = await readJson(MANIFEST_PATH, []);
  const cache = await readJson(CACHE_PATH, {});
  const uploads = [];

  for (const entry of manifest) {
    if (!entry.slug || !entry.png512) continue;
    const cached = cache[entry.slug];
    if (cached?.url && !args.force) {
      uploads.push(cached);
      continue;
    }
    if (args.dryRun) {
      uploads.push({ slug: entry.slug, url: entry.wixUrl || entry.githubPagesUrl || null, dryRun: true });
      continue;
    }
    const uploaded = await uploadPng(entry);
    cache[entry.slug] = uploaded;
    uploads.push(uploaded);
    await writeJson(CACHE_PATH, cache);
    console.log(`uploaded ${entry.slug}: ${uploaded.id}`);
  }

  const urlBySlug = new Map(uploads.filter((u) => u.url).map((u) => [u.slug, u.url]));
  const updatedManifest = manifest.map((entry) => ({
    ...entry,
    wixUrl: urlBySlug.get(entry.slug) || entry.wixUrl || null,
  }));

  if (!args.dryRun) {
    await writeJson(MANIFEST_PATH, updatedManifest);
    await writeJson(path.join(SET_DIR, 'manifest.json'), updatedManifest);
    const hubData = await readJson(HUB_DATA_PATH, {});
    const homeData = await readJson(HOME_DATA_PATH, {});
    await writeJson(HUB_DATA_PATH, withToolImages(hubData, urlBySlug));
    await writeJson(HOME_DATA_PATH, withFeaturedImages(homeData, urlBySlug));
    await writeJson(path.join(SET_DIR, 'wix-upload-summary.json'), uploads);
  }

  console.log(JSON.stringify({
    ok: true,
    dryRun: args.dryRun,
    force: args.force,
    manifestCount: manifest.length,
    uploadedOrCached: uploads.length,
    updatedUrls: urlBySlug.size,
    cachePath: CACHE_PATH,
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
