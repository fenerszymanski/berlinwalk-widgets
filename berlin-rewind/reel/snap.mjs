#!/usr/bin/env node
/**
 * Debug helper: capture still frames from the built reel HTML at given
 * timestamps (ms). Usage:
 *   node snap.mjs out/reel-2026-07-08.html /tmp/snaps 1200 4000 7500
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function findChromium() {
  const root = path.join(os.homedir(), 'Library', 'Caches', 'ms-playwright');
  const entries = fs.existsSync(root) ? fs.readdirSync(root) : [];
  const pick = (prefix, rel) => entries
    .filter((e) => e.startsWith(prefix) && /-\d+$/.test(e))
    .sort((a, b) => Number(b.split('-').pop()) - Number(a.split('-').pop()))
    .map((e) => path.join(root, e, rel))
    .find((p) => fs.existsSync(p));
  return (
    pick('chromium_headless_shell-', 'chrome-mac-arm64/headless_shell')
    || pick('chromium-', 'chrome-mac-arm64/Chromium.app/Contents/MacOS/Chromium')
  );
}

const [htmlArg, outDir, ...times] = process.argv.slice(2);
const htmlPath = path.resolve(__dirname, htmlArg);
fs.mkdirSync(outDir, { recursive: true });

const { chromium } = await import('playwright-core');
const browser = await chromium.launch({ executablePath: findChromium() });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto(`file://${htmlPath}?still`);
await page.waitForFunction('window.__ready === true', { timeout: 30000 });
console.log('duration:', await page.evaluate('window.__duration'));

for (const t of times) {
  await page.evaluate(`window.__seek(${Number(t)})`);
  const file = path.join(outDir, `t${String(t).padStart(6, '0')}.png`);
  await page.screenshot({ path: file });
  console.log('saved', file);
}
await browser.close();
