#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const SITE_ID = '12ee5ea0-70a7-492f-8020-ffb27cbb630f';
const IMAGE_PATH = path.join(ROOT, 'audio-tours', 'assets', 'social', 'audio-tours-social-1200x630.jpg');
const RECEIPT_PATH = path.join(ROOT, 'audio-tours', 'assets', 'social', 'wix-upload-receipt.json');
const APPLY = process.argv.includes('--apply');

async function readResponse(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

async function wixFetch(endpoint, options = {}) {
  const response = await fetch(`https://www.wixapis.com${endpoint}`, {
    ...options,
    headers: {
      Authorization: process.env.WIX_API_KEY,
      'wix-site-id': SITE_ID,
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const body = await readResponse(response);
  if (!response.ok) throw new Error(`Wix API ${response.status}: ${JSON.stringify(body).slice(0, 700)}`);
  return body;
}

async function main() {
  if (!fs.existsSync(IMAGE_PATH)) throw new Error(`Missing final image: ${IMAGE_PATH}`);
  const stat = fs.statSync(IMAGE_PATH);
  if (!APPLY) {
    console.log(JSON.stringify({
      mode: 'dry-run',
      siteId: SITE_ID,
      imagePath: IMAGE_PATH,
      fileName: path.basename(IMAGE_PATH),
      mimeType: 'image/jpeg',
      sizeInBytes: stat.size,
      destination: RECEIPT_PATH,
    }, null, 2));
    return;
  }
  if (!process.env.WIX_API_KEY) throw new Error('Missing WIX_API_KEY. Run source scripts/load-api-keys.sh first.');

  const generated = await wixFetch('/site-media/v1/files/generate-upload-url', {
    method: 'POST',
    body: {
      mimeType: 'image/jpeg',
      fileName: path.basename(IMAGE_PATH),
      private: false,
      labels: ['berlinwalk', 'audio-tours', 'social-share'],
    },
  });
  if (!generated.uploadUrl) throw new Error('Wix did not return an upload URL.');

  const uploadedResponse = await fetch(generated.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'image/jpeg' },
    body: fs.readFileSync(IMAGE_PATH),
  });
  const uploadedBody = await readResponse(uploadedResponse);
  if (!uploadedResponse.ok) {
    throw new Error(`Wix Media upload ${uploadedResponse.status}: ${JSON.stringify(uploadedBody).slice(0, 700)}`);
  }

  const file = uploadedBody.file || uploadedBody;
  const image = file.media?.image?.image || {};
  const receipt = {
    uploadedAt: new Date().toISOString(),
    siteId: SITE_ID,
    localPath: path.relative(ROOT, IMAGE_PATH),
    wixMediaId: file.id,
    wixUrl: file.url,
    displayName: file.displayName || path.basename(IMAGE_PATH),
    operationStatus: file.operationStatus || 'READY',
    width: image.width || 1200,
    height: image.height || 630,
    sizeInBytes: file.sizeInBytes || stat.size,
  };
  fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify(receipt, null, 2));
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
