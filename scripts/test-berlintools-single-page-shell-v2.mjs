#!/usr/bin/env node

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

function compile(label, source) {
  try {
    new Function(source);
  } catch (error) {
    throw new Error(`${label}: ${error.message}`);
  }
}

function compileInlineScripts(label, html) {
  const scripts = [];
  const pattern = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = pattern.exec(html))) {
    if (/\bsrc\s*=/.test(match[1])) continue;
    scripts.push(match[2]);
  }
  assert.ok(scripts.length, `${label}: no inline script found`);
  scripts.forEach((source, index) => compile(`${label} inline script ${index + 1}`, source));
}

const shell = read('js/berlintools-single-page-shell-v2.js');
const shellCss = read('css/berlintools-single-page-shell-v2.css');
const brand = read('js/brand.js');
const bridge = read('js/blog-journey-inject.js');
const loader = read('wix/berlintools-single-page-shell-v2.html');

compile('shell JS', shell);
compile('brand JS', brand);
compile('bridge JS', bridge);

assert.match(shell, /surface|bw-tools-shell-v2/);
assert.match(shell, /var ENABLE_ALL = true/);
assert.match(shellCss, /#comp-mozco5et/);
assert.match(shellCss, /#bw-desktop-cta/);
assert.match(brand, /surface.*tool-page|tool-page.*surface/s);
assert.match(loader, /__COMMIT_SHA__/);
assert.match(loader, /berlintools-single-page-shell-v2\.js/);
assert.match(loader, /cdn\.jsdelivr\.net\/gh\/fenerszymanski\/berlinwalk-widgets@/);

for (const file of [
  'transport-calculator/index.html',
  'luggage-storage-map/index.html',
  'berlin-first-day-planner/index.html',
]) {
  const html = read(file);
  compileInlineScripts(file, html);
  assert.match(html, /data-bw-tool-header/);
  assert.match(html, /data-bw-surface="tool-page"/);
  assert.doesNotMatch(html, /\bEUR\b|\beuro\b/);
}

const bridgeSection = bridge.slice(bridge.indexOf('function insertToolBridge'), bridge.indexOf('function hideNativeEndMatter'));
assert.doesNotMatch(bridgeSection, /renderJourneyCard|relatedPostForTool/);
assert.match(bridgeSection, /bw-tool-bridge-book/);

console.log(JSON.stringify({ ok: true, checked: 8 }, null, 2));
