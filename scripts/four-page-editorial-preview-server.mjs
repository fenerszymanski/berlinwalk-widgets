#!/usr/bin/env node

import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.argv.find((arg) => arg.startsWith('--port='))?.slice(7) || 4181);
const METRICS_FILE = path.join(ROOT, 'output/qa/four-page-editorial-20260717/local/atlas-responsive-metrics.json');
const MIME = new Map([
  ['.css', 'text/css; charset=utf-8'], ['.html', 'text/html; charset=utf-8'], ['.js', 'text/javascript; charset=utf-8'],
  ['.jpg', 'image/jpeg'], ['.jpeg', 'image/jpeg'], ['.png', 'image/png'], ['.svg', 'image/svg+xml'],
  ['.webp', 'image/webp'], ['.woff2', 'font/woff2'], ['.ttf', 'font/ttf'], ['.json', 'application/json; charset=utf-8'],
]);

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const relative = decoded.replace(/^\/+/, '');
  const candidate = path.resolve(ROOT, relative || 'page-editorial/preview.html');
  return candidate.startsWith(`${ROOT}${path.sep}`) || candidate === ROOT ? candidate : null;
}

async function serveFile(req, res) {
  let target = safePath(req.url || '/');
  if (!target) {
    res.writeHead(403).end('Forbidden');
    return;
  }
  let stat;
  try { stat = await fs.stat(target); } catch { stat = null; }
  if (stat?.isDirectory()) target = path.join(target, 'index.html');
  try {
    const body = await fs.readFile(target);
    res.writeHead(200, {
      'Content-Type': MIME.get(path.extname(target).toLowerCase()) || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/__four_page_editorial_metrics') {
    let body = '';
    for await (const chunk of req) body += chunk;
    await fs.mkdir(path.dirname(METRICS_FILE), { recursive: true });
    await fs.writeFile(METRICS_FILE, `${JSON.stringify(JSON.parse(body), null, 2)}\n`);
    res.writeHead(204).end();
    return;
  }
  await serveFile(req, res);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Four-page editorial preview: http://127.0.0.1:${PORT}/page-editorial/preview.html`);
});
