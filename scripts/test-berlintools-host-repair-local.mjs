#!/usr/bin/env node

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const WIDGET_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WORKSPACE_ROOT = path.resolve(WIDGET_ROOT, '..');
const OUTPUT_ROOT = path.join(
  WORKSPACE_ROOT,
  'output/qa/berlintools-full-audit-20260812/phase-b-local/host',
);
const resizeSource = path.join(WORKSPACE_ROOT, 'berlinwalk-widget-auto-resize-custom-code.js');
const shellSourcePath = path.join(WIDGET_ROOT, 'js/berlintools-single-page-shell-v2.js');
const shellCssPath = path.join(WIDGET_ROOT, 'css/berlintools-single-page-shell-v2.css');
const EXPECTED_REV18_SHA256 =
  'abbdc1af034c55cd4f8198c24d8c8b93643dd19ae0af99e51db5aa8f34e9de05';
const PILOTS = [
  'reichstag-slot-window',
  'berlin-booking-deadline-planner',
  'vegan-berlin-map',
  'berlin-weather-by-month',
  'berlin-marathon-day',
  'alex-mistakes',
  'baltic-beach-day-planner',
  'jewish-museum-visit-sequence',
  'east-side-gallery-murals',
  'watch-world-cup-2026-berlin',
  'transport-ticket-calculator',
  'schoneberg-plaque-check',
  'berlin-transport-backup-planner',
  'berlin-club-picker',
  'berlin-sign-decoder',
  'dresden-day-clock',
  'berlin-crosswalk-standoff',
  'berlin-daylight-hours',
  'museum-island-one-pick',
  'are-you-ready-for-berlin-quiz',
  'berlin-pools',
  'berlin-lakes',
  'berlin-landmarks-map',
  'berlin-first-day-planner',
  'berlin-city-tax-calculator',
  'berlin-viewpoint-finder',
  'berlin-ticket-machine-simulator',
  'berlin-connectivity-picker',
  'connectivity-picker',
  'berlin-3-day-itinerary',
  'open-monument-day-shortlist',
];
const VIEWPORTS = [1018, 390, 358];

const [resizeSourceText, shellSource, shellCss] = await Promise.all([
  fs.readFile(resizeSource, 'utf8'),
  fs.readFile(shellSourcePath, 'utf8'),
  fs.readFile(shellCssPath, 'utf8'),
]);

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function compile(label, source) {
  try {
    new Function(source);
  } catch (error) {
    throw new Error(label + ': ' + error.message);
  }
}

function between(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  assert.ok(start >= 0, 'missing start marker: ' + startMarker);
  assert.ok(end > start, 'missing end marker: ' + endMarker);
  return source.slice(start, end);
}

assert.equal(
  sha256(resizeSourceText),
  EXPECTED_REV18_SHA256,
  'rev18 resize source changed; local phase must preserve it byte-for-byte',
);
compile('shell JS', shellSource);

assert.match(shellSource, /var HOST_REPAIR_MODE = 'pilot'/);
for (const slug of PILOTS) {
  assert.ok(
    shellSource.includes("'" + slug + "'") || shellSource.includes('"' + slug + '"'),
    'missing pilot slug: ' + slug,
  );
}
assert.match(shellSource, /data-bw-host-repair/);
assert.match(shellSource, /bw-host-repair-/);
assert.doesNotMatch(shellSource, /function markHostRepairChain/);
assert.doesNotMatch(shellSource, /data-bw-host-repair-(?:host|frame|private)/);
assert.doesNotMatch(shellSource, /setAttribute\(\s*['"]data-bw-host-repair-(?:host|frame|private)/);

const toolsRuntime = between(
  resizeSourceText,
  'function installToolsDetailRuntime()',
  'if (isToolsDetail)',
);
const toolsRuntimeCode = toolsRuntime.replace(/\/\/[^\n]*/g, '');
assert.doesNotMatch(toolsRuntimeCode, /\+\s*4/);
assert.match(resizeSourceText, /event\.origin !== 'https:\/\/fenerszymanski\.github\.io'/);
assert.match(toolsRuntime, /requestAnimationFrame/);
assert.match(toolsRuntime, /Math\.abs\(pendingHeight - lastHeight\) <= 2/);
assert.match(resizeSourceText, /event\.data\.height \+ 4/);

const repairMarker = '/*\n * Host repair pilot.';
const repairCssStart = shellCss.indexOf(repairMarker);
assert.ok(repairCssStart >= 0, 'host repair CSS marker missing');
const repairCss = shellCss.slice(repairCssStart);
for (const marker of [
  'data-bw-host-repair="pilot"',
  'aspect-ratio: auto !important',
  'background: #FAFAF5 !important',
  'height: auto !important',
  'min-height: 0 !important',
  'overflow: visible !important',
  'position: relative !important',
  'inset: auto !important',
  'width: 100% !important',
  '@layer bw-host-repair',
  '> div:has(iframe)',
  '> div:has(iframe) > div:has(iframe) > div:has(iframe)',
]) {
  assert.ok(repairCss.includes(marker), 'missing CSS marker: ' + marker);
}
assert.doesNotMatch(
  repairCss,
  /max-width:\s*1120px\s*!important/,
  'host repair must not broaden the existing host width contract',
);
assert.match(repairCss, /body #comp-mozco5et(?:,|\s)/);
assert.doesNotMatch(repairCss, /data-bw-host-repair-private/);
assert.doesNotMatch(repairCss, /#comp-moz(?:c935g3|mt2at|n18up|nh5yl|p1zlv)|PAGES_CONTAINER|SITE_PAGES/);
assert.doesNotMatch(repairCss, /#comp-mozco5et[^{}]*\{[^}]*height:\s*\d+px/);

const baseCss = shellCss.slice(0, repairCssStart);
const conflictingOverlayCss = [
  'html.bw-tools-detail body #comp-mozc935g3 #comp-mozco5et {',
  '  aspect-ratio: 1 / 1.18796 !important;',
  '  background: #FFFFFF !important;',
  '  height: 1211.71px !important;',
  '  inset: 0 !important;',
  '  min-height: 1211.71px !important;',
  '  overflow: hidden !important;',
  '  position: absolute !important;',
  '}',
  'html.bw-tools-detail.bw-tools-shell-v2 body #comp-mozc935g3 #comp-mozco5et {',
  '  max-width: 1020px !important;',
  '  width: min(100% - 72px, 1020px) !important;',
  '}',
  'html.bw-tools-detail body #comp-mozc935g3 #comp-mozco5et > .private-shell,',
  'html.bw-tools-detail body #comp-mozc935g3 #comp-mozco5et > .private-shell > .private-viewport,',
  'html.bw-tools-detail body #comp-mozc935g3 #comp-mozco5et > .private-shell > .private-viewport > .private-frame {',
  '  height: 420px !important;',
  '  inset: 0 !important;',
  '  overflow: hidden !important;',
  '  position: absolute !important;',
  '  width: 100% !important;',
  '}',
  'html.bw-tools-detail body #comp-mozc935g3 #comp-mozco5et iframe {',
  '  height: 420px !important;',
  '  inset: 0 !important;',
  '  position: absolute !important;',
  '  width: 100% !important;',
  '}',
  '@media (max-width: 1024px) {',
  '  html.bw-tools-detail.bw-tools-shell-v2 body #comp-mozc935g3 #comp-mozco5et {',
  '    max-width: 700px !important;',
  '    width: min(100% - 32px, 700px) !important;',
  '  }',
  '}',
].join('\n');

function fixtureMarkup() {
  return [
    '<!doctype html>',
    '<html class="bw-tools-detail bw-tools-shell-v2" data-bw-host-repair="off">',
    '<head><meta charset="utf-8">',
    '<style>', baseCss, '</style>',
    '<style>', repairCss, '</style>',
    '<style>', conflictingOverlayCss, '</style>',
    '<style>html,body{margin:0;padding:0;width:100%;}</style>',
    '</head><body>',
    '<section id="comp-mozc935g3"><div class="comp-mozc935g3-container">',
    '<div id="comp-mozch2i3"><h1>Fixture heading</h1></div>',
    '<div id="comp-mozck6is"><p>Fixture lead</p></div>',
    '<div id="comp-mozcllqt"><p>Fixture secondary</p></div>',
    '<div id="comp-mozco5et"><div class="private-shell" style="height:420px!important"><div class="private-viewport" style="height:420px!important"><div class="private-frame" style="height:420px!important">',
    '<iframe title="fixture widget" style="height:420px!important" srcdoc="<p>Fixture widget</p>"></iframe>',
    '</div></div></div></div></section>',
    '<section id="comp-mozmt2at"><div id="comp-mozmtefi"><p>Intro</p></div></section>',
    '<section id="comp-mozn18up"><div id="comp-mozn27df"><h2>Body</h2><p>Text</p></div></section>',
    '<section id="comp-moznh5yl"><div id="comp-moznhogf"></div></section>',
    '<section id="comp-mozp1zlv"></section><div id="comp-mozmgdoo"></div>',
    '</body></html>',
  ].join('');
}

const fixtureScriptStub =
  '<script>window.fetch = function () { return Promise.reject(new Error("fixture catalog disabled")); };</script>';

const results = [];
const screenshots = [];
const controlMetricsByViewport = new Map();
let server;
let browser;

try {
  server = http.createServer((request, response) => {
    if (!request.url || !request.url.startsWith('/tools/')) {
      response.writeHead(404);
      response.end('not found');
      return;
    }
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    response.end(fixtureMarkup().replace('<head>', '<head>' + fixtureScriptStub));
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 0;
  assert.ok(port, 'fixture server did not receive a port');

  browser = await chromium.launch({ headless: true });
  for (const viewportWidth of VIEWPORTS) {
    for (const routeAndMode of [
      ['/tools/host-repair-control', 'off'],
      ['/tools/reichstag-slot-window', 'pilot'],
    ]) {
      const route = routeAndMode[0];
      const expectedMode = routeAndMode[1];
      const page = await browser.newPage({
        viewport: { width: viewportWidth, height: 844 },
      });
      const pageErrors = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));
      await page.goto('http://127.0.0.1:' + port + route, { waitUntil: 'domcontentloaded' });
      await page.addScriptTag({ content: shellSource });
      await page.waitForFunction(() => document.documentElement.hasAttribute('data-bw-host-repair'));
      await page.waitForTimeout(80);

      const metrics = await page.evaluate(() => {
        const root = document.documentElement;
        const host = document.getElementById('comp-mozco5et');
        const privateChain = Array.from(host.querySelectorAll(':scope > .private-shell, :scope > .private-shell > .private-viewport, :scope > .private-shell > .private-viewport > .private-frame'));
        const privateShell = privateChain[0];
        const frame = host.querySelector(':scope > .private-shell > .private-viewport > .private-frame iframe');
        const read = (node) => {
          const style = getComputedStyle(node);
          const rect = node.getBoundingClientRect();
          return {
            width: rect.width,
            height: rect.height,
            position: style.position,
            inset: style.inset,
            overflow: style.overflow,
            aspectRatio: style.aspectRatio,
            backgroundColor: style.backgroundColor,
            boxSizing: style.boxSizing,
            borderTopWidth: style.borderTopWidth,
            borderRightWidth: style.borderRightWidth,
            borderBottomWidth: style.borderBottomWidth,
            borderLeftWidth: style.borderLeftWidth,
            minHeight: style.minHeight,
            maxHeight: style.maxHeight,
          };
        };
        return {
          mode: root.getAttribute('data-bw-host-repair'),
          hostRepairClass: root.classList.contains('bw-host-repair-pilot'),
          hostMarker: host.getAttribute('data-bw-host-repair-host'),
          privateMarker: privateShell.getAttribute('data-bw-host-repair-private'),
          frameMarker: frame.getAttribute('data-bw-host-repair-frame'),
          host: read(host),
          privateShell: read(privateShell),
          privateChain: privateChain.map(read),
          frame: read(frame),
        };
      });

      assert.equal(metrics.mode, expectedMode, route + ' mode at ' + viewportWidth);
      if (expectedMode === 'pilot') {
        assert.equal(metrics.hostRepairClass, true);
        assert.equal(metrics.hostMarker, null);
        assert.equal(metrics.privateMarker, null);
        assert.equal(metrics.frameMarker, null);
        assert.equal(metrics.host.position, 'relative');
        assert.ok(metrics.host.inset === 'auto' || metrics.host.inset === '0px');
        assert.equal(metrics.host.overflow, 'visible');
        assert.match(metrics.host.aspectRatio, /^auto/);
        assert.equal(metrics.host.backgroundColor, 'rgb(250, 250, 245)');
        assert.ok(Math.abs(metrics.host.height - 420) <= 4, 'pilot host height ' + metrics.host.height);
        assert.equal(metrics.privateChain.length, 3);
        assert.ok(metrics.privateChain.every((node) => Math.abs(node.height - 420) <= 4));
        assert.ok(Math.abs(metrics.frame.height - 420) <= 4);
        assert.ok(metrics.privateChain.every((node) => node.position === 'relative' && node.overflow === 'visible'));
        assert.equal(metrics.frame.position, 'relative');
        const controlMetrics = controlMetricsByViewport.get(viewportWidth);
        assert.ok(controlMetrics, 'missing equivalent pre-repair control at ' + viewportWidth);
        assert.ok(
          Math.abs(metrics.host.width - controlMetrics.host.width) <= 0.5,
          'pilot/control host width parity ' + metrics.host.width + '/' + controlMetrics.host.width,
        );
        assert.equal(controlMetrics.privateChain.length, 3);
        for (let index = 0; index < metrics.privateChain.length; index += 1) {
          assert.ok(
            Math.abs(metrics.privateChain[index].width - controlMetrics.privateChain[index].width) <= 0.5,
            'pilot/control private width parity at wrapper ' + index + ' ' +
              metrics.privateChain[index].width +
              '/' +
              controlMetrics.privateChain[index].width,
          );
        }
        const hostBorderX =
          Number.parseFloat(metrics.host.borderLeftWidth) +
          Number.parseFloat(metrics.host.borderRightWidth);
        const hostBorderY =
          Number.parseFloat(metrics.host.borderTopWidth) +
          Number.parseFloat(metrics.host.borderBottomWidth);
        assert.ok(
          Math.abs(metrics.host.width - metrics.privateChain[0].width - hostBorderX) <= 0.5,
          'pilot host/private width delta only intentional host border',
        );
        assert.ok(
          Math.abs(metrics.host.height - metrics.privateChain[0].height - hostBorderY) <= 0.5,
          'pilot host/private height delta only intentional host border',
        );
        assert.ok(Math.abs(metrics.frame.width - metrics.privateChain[2].width) <= 0.5);
        assert.ok(Math.abs(metrics.frame.height - metrics.privateChain[2].height) <= 0.5);
      } else {
        assert.equal(metrics.hostRepairClass, false);
        assert.equal(metrics.hostMarker, null);
        assert.equal(metrics.privateMarker, null);
        assert.equal(metrics.frameMarker, null);
        assert.equal(metrics.host.position, 'relative');
        assert.equal(metrics.host.inset, '0px');
        assert.equal(metrics.host.overflow, 'hidden');
        assert.doesNotMatch(metrics.host.aspectRatio, /^auto/);
        assert.equal(metrics.host.backgroundColor, 'rgb(255, 255, 255)');
        assert.ok(metrics.host.height > 1200, 'control host height ' + metrics.host.height);
        assert.equal(metrics.privateChain.length, 3);
        assert.ok(metrics.privateChain.every((node) => node.position === 'absolute'));
        assert.equal(metrics.frame.position, 'absolute');
        assert.ok(metrics.host.width < viewportWidth, 'control width ' + metrics.host.width);
        controlMetricsByViewport.set(viewportWidth, metrics);
      }
      assert.deepEqual(pageErrors, [], route + ' page errors at ' + viewportWidth);

      const screenshotPath = path.join(
        OUTPUT_ROOT,
        expectedMode + '-' + viewportWidth + '.png',
      );
      await page.screenshot({ path: screenshotPath, fullPage: false });
      screenshots.push(screenshotPath);
      results.push({ route, expectedMode, viewportWidth, metrics });
      await page.close();
    }
  }
} finally {
  if (browser) await browser.close();
  if (server) await new Promise((resolve) => server.close(resolve));
}

await fs.mkdir(OUTPUT_ROOT, { recursive: true });
const receipt = {
  ok: true,
  phase: 'B-local-only',
  status: 'PASS_LOCAL_ONLY',
  testedAt: new Date().toISOString(),
  blockers: [
    'Live Wix/Chrome/CMS was intentionally not touched; coordinator-owned Stage 3 canary publish and fresh clean Chrome acceptance remain required.',
  ],
  liveWrites: false,
  overlaySourcesModified: [],
  changedSources: [
    'berlinwalk-widgets/js/berlintools-single-page-shell-v2.js',
    'berlinwalk-widgets/css/berlintools-single-page-shell-v2.css',
    'berlinwalk-widgets/scripts/test-berlintools-host-repair-local.mjs',
  ],
  preservedByteForByte: {
    source: 'berlinwalk-widget-auto-resize-custom-code.js',
    sha256: sha256(resizeSourceText),
    expectedRev18Sha256: EXPECTED_REV18_SHA256,
  },
  pilotSlugs: PILOTS,
  viewports: VIEWPORTS,
  fixture: {
    activeOverlayRules:
      'simulated desktop width:min(100% - 72px,1020px)/max-width:1020px and mobile width:min(100% - 32px,700px)/max-width:700px, plus aspect, absolute positioning, fixed height, clipping and white canvas',
    assertions: [
      'pilot route data flag/class is produced by shell JS',
      'pilot CSS wins over conflicting overlay rules',
      'non-pilot route remains on conflicting overlay geometry',
      'pilot host/private iframe chain is normal flow/cream and keeps width parity with the equivalent pre-repair control',
      'pilot host/private width and height deltas account only for the computed intentional host border',
      'iframe computed border is read back without guessing or changing it to border:0',
      'tools branch has no +4px while legacy non-tools +4px remains',
      'no host-repair CSS selector targets section/page-grid geometry',
    ],
  },
  results,
  screenshots,
};
await fs.writeFile(
  path.join(OUTPUT_ROOT, 'host-repair-local-receipt.json'),
  JSON.stringify(receipt, null, 2) + '\n',
);
console.log(JSON.stringify({
  ok: true,
  checked: results.length,
  screenshots: screenshots.length,
  receipt: path.join(OUTPUT_ROOT, 'host-repair-local-receipt.json'),
}, null, 2));
