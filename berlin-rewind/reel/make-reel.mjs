#!/usr/bin/env node
/**
 * Berlin Rewind — daily social reel generator.
 *
 * Builds a 1080x1920 guess-the-year reel (mp4, 30fps, H.264) from the game's
 * daily photo schedule. Photos and fonts are embedded into a self-contained
 * HTML scene (template.html), then rendered frame-by-frame with headless
 * Chromium and encoded with ffmpeg.
 *
 * Usage:
 *   node make-reel.mjs                  # today's set (Europe/Berlin)
 *   node make-reel.mjs --date 2026-07-08
 *   node make-reel.mjs --html-only     # just build out/reel-<date>.html
 *
 * Requires: npm install (playwright-core + @ffmpeg-installer/ffmpeg).
 * Chromium comes from the local Playwright browser cache (~/Library/Caches/ms-playwright).
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const CACHE_DIR = path.join(__dirname, 'cache');
const OUT_DIR = path.join(__dirname, 'out');
const FPS = 30;
const UA = 'BerlinWalkReelBot/1.0 (https://www.berlinwalk.com)';

/* ---------- args ---------- */
const args = process.argv.slice(2);
const getArg = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : null;
};
const htmlOnly = args.includes('--html-only');
const date = getArg('--date')
  || new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Berlin' });

/* ---------- load game data ---------- */
const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const photosAll = readJson(path.join(DATA_DIR, 'photos.json'));
const schedule = readJson(path.join(DATA_DIR, 'schedule.json'));
const districts = readJson(path.join(DATA_DIR, 'districts.json'));
const lines = readJson(path.join(__dirname, 'lines.json'));

const day = schedule[date];
if (!day) {
  console.error(`No schedule entry for ${date}. Available: ${Object.keys(schedule).join(', ')}`);
  process.exit(1);
}

const photoById = Object.fromEntries(photosAll.map((p) => [p.id, p]));
const todays = day.ids.map((id) => {
  const p = photoById[id];
  if (!p) throw new Error(`Photo ${id} not found in photos.json`);
  return p;
});

/* ---------- fetch + embed photos ---------- */
fs.mkdirSync(CACHE_DIR, { recursive: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

async function photoDataUri(p) {
  const cached = path.join(CACHE_DIR, `${p.id}.jpg`);
  if (!fs.existsSync(cached)) {
    console.log(`fetching ${p.id} …`);
    const res = await fetch(p.img, { headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error(`Failed to fetch ${p.img}: ${res.status}`);
    fs.writeFileSync(cached, Buffer.from(await res.arrayBuffer()));
  }
  return `data:image/jpeg;base64,${fs.readFileSync(cached).toString('base64')}`;
}

const dateLabel = new Date(`${date}T12:00:00`)
  .toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  .toUpperCase();

const reelPhotos = [];
for (const p of todays) {
  if (!lines[p.id]) console.warn(`WARN: no reveal line for ${p.id} in lines.json — using title only`);
  reelPhotos.push({
    id: p.id,
    title: p.title,
    year: p.year,
    districtLabel: districts.districts[p.district]?.label || p.district,
    difficulty: p.difficulty,
    credit: p.credit,
    line: lines[p.id] || '',
    imgData: await photoDataUri(p)
  });
}

const reelData = {
  date,
  dateLabel,
  theme: day.theme,
  creditSummary: 'Bundesarchiv / CC BY-SA 3.0 DE',
  photos: reelPhotos
};

/* ---------- build html ---------- */
const template = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
const fontsCss = fs.readFileSync(path.join(__dirname, 'fonts', 'fonts-inline.css'), 'utf8');
const html = template
  .replace('/*__FONTS_CSS__*/', fontsCss)
  .replace('__REEL_DATA_JSON__', JSON.stringify(reelData));

const htmlPath = path.join(OUT_DIR, `reel-${date}.html`);
fs.writeFileSync(htmlPath, html);
console.log(`built ${path.relative(process.cwd(), htmlPath)} (${(html.length / 1024 / 1024).toFixed(1)}MB)`);

if (htmlOnly) process.exit(0);

/* ---------- locate chromium + ffmpeg ---------- */
function findChromium() {
  const root = path.join(os.homedir(), 'Library', 'Caches', 'ms-playwright');
  const entries = fs.existsSync(root) ? fs.readdirSync(root) : [];
  const pick = (prefix, rel) => entries
    .filter((e) => e.startsWith(prefix) && /-\d+$/.test(e))
    .sort((a, b) => Number(b.split('-').pop()) - Number(a.split('-').pop()))
    .map((e) => path.join(root, e, rel))
    .find((p) => fs.existsSync(p));
  return (
    pick('chromium_headless_shell-', 'chrome-headless-shell-mac-arm64/chrome-headless-shell')
    || pick('chromium_headless_shell-', 'chrome-headless-shell-mac-x64/chrome-headless-shell')
    || pick('chromium-', 'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing')
    || pick('chromium-', 'chrome-mac/Chromium.app/Contents/MacOS/Chromium')
  );
}

// If the cache layout isn't recognized, leave undefined and let
// playwright-core resolve its own registry path.
const chromiumPath = findChromium();

const { chromium } = await import('playwright-core');
const ffmpegPath = (await import('@ffmpeg-installer/ffmpeg')).default.path;

/* ---------- render ---------- */
const mp4Path = path.join(OUT_DIR, `berlin-rewind-reel-${date}.mp4`);
console.log(`chromium: ${chromiumPath || '(playwright-core default)'}`);
console.log(`ffmpeg:   ${ffmpegPath}`);

const browser = await chromium.launch({ executablePath: chromiumPath });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto(`file://${htmlPath}?still`);
await page.waitForFunction('window.__ready === true', { timeout: 30000 });
const duration = await page.evaluate('window.__duration');
const frames = Math.ceil((duration / 1000) * FPS);
console.log(`duration ${(duration / 1000).toFixed(1)}s → ${frames} frames @ ${FPS}fps`);

const ff = spawn(ffmpegPath, [
  '-y', '-hide_banner', '-loglevel', 'error',
  '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
  '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
  mp4Path
], { stdio: ['pipe', 'inherit', 'inherit'] });

const ffDone = new Promise((resolve, reject) => {
  ff.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))));
});

const t0 = Date.now();
for (let f = 0; f < frames; f++) {
  await page.evaluate(`window.__seek(${(f / FPS) * 1000})`);
  const png = await page.screenshot({ type: 'png' });
  if (!ff.stdin.write(png)) {
    await new Promise((res) => ff.stdin.once('drain', res));
  }
  if (f % 100 === 0) {
    const rate = (f + 1) / ((Date.now() - t0) / 1000);
    console.log(`frame ${f}/${frames} (${rate.toFixed(1)} fps render)`);
  }
}
ff.stdin.end();
await ffDone;
await browser.close();

const sizeMb = (fs.statSync(mp4Path).size / 1024 / 1024).toFixed(1);
console.log(`\ndone: ${path.relative(process.cwd(), mp4Path)} (${sizeMb}MB, ${(duration / 1000).toFixed(1)}s)`);
