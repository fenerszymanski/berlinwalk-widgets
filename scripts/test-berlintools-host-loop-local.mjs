#!/usr/bin/env node

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const WIDGET_ROOT = path.resolve(path.dirname(SCRIPT_PATH), '..');
const WORKSPACE_ROOT = path.resolve(WIDGET_ROOT, '..');
const OUTPUT_ROOT = path.join(
  WORKSPACE_ROOT,
  'output/qa/berlintools-full-audit-20260812/phase-b-local/host-loop',
);
const RUNS_ROOT = path.join(OUTPUT_ROOT, 'runs');
const LATEST_POINTER_PATH = path.join(OUTPUT_ROOT, 'latest-run.json');
const LOCK_PATH = path.join(OUTPUT_ROOT, '.host-loop-run.lock');
const resizeSourcePath = path.join(WORKSPACE_ROOT, 'berlinwalk-widget-auto-resize-custom-code.js');
const shellSourcePath = path.join(WIDGET_ROOT, 'js/berlintools-single-page-shell-v2.js');
const shellCssPath = path.join(WIDGET_ROOT, 'css/berlintools-single-page-shell-v2.css');
const templatePolishPath = path.join(WORKSPACE_ROOT, 'berlintools-template-design-polish.html');
const BASELINE_COMMIT = 'cbdddc';
const VIEWPORTS = [1280, 1018, 390, 358];
const SMOKE_ONLY = process.env.BW_HOST_LOOP_SMOKE === '1';
const RUN_COUNT = SMOKE_ONLY ? 1 : 2;
const REMOUNT_CAP = 8;
const SCENARIO_TIMEOUT_MS = 12000;
const COMPARISON_TIMEOUT_MS = 300000;
const activeScenarioPages = new Set();
const activeBrowsers = new Set();

const ROUTES = [
  {
    slug: 'reichstag-slot-window',
    kind: 'reichstag',
    baseHeight: 420,
    expandedHeight: 902,
    interactionModel: 'synthetic-dom-expand-shrink-slot-options',
  },
  {
    slug: 'berlin-booking-deadline-planner',
    kind: 'planner',
    baseHeight: 720,
    expandedHeight: 1730,
    interactionModel: 'synthetic-dom-expand-shrink-planner-result',
  },
  {
    slug: 'vegan-berlin-map',
    kind: 'map',
    baseHeight: 520,
    expandedHeight: 1040,
    interactionModel: 'synthetic-dom-expand-shrink-map-result-panel',
  },
  {
    slug: 'berlin-weather-by-month',
    kind: 'weather',
    baseHeight: 460,
    expandedHeight: 940,
    interactionModel: 'synthetic-dom-expand-shrink-month-detail',
    secondary: {
      id: 'weather-secondary',
      kind: 'weather-secondary',
      baseHeight: 260,
      expandedHeight: 380,
    },
  },
  {
    slug: 'berlin-marathon-day',
    kind: 'marathon',
    baseHeight: 540,
    expandedHeight: 1120,
    interactionModel: 'synthetic-dom-expand-shrink-race-day-result',
  },
];

const ROUTE_SCHEMA = {
  version: 'host-loop-v3-five-pilot',
  slugs: ROUTES.map((route) => route.slug),
  viewports: VIEWPORTS,
  expectedScenarioCount: ROUTES.length * VIEWPORTS.length,
  expectedComparisonScenarioCount: ROUTES.length * VIEWPORTS.length * 2,
  expectedPilotCount: 5,
};

const [resizeSource, candidateShellSource, candidateShellCss, templateSource, testRunnerSource] =
  await Promise.all([
    fs.readFile(resizeSourcePath, 'utf8'),
    fs.readFile(shellSourcePath, 'utf8'),
    fs.readFile(shellCssPath, 'utf8'),
    fs.readFile(templatePolishPath, 'utf8'),
    fs.readFile(SCRIPT_PATH, 'utf8'),
  ]);

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function extractTag(source, tagName, id) {
  const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = source.match(
    new RegExp(
      `<${tagName}[^>]*\\bid=["']${escapedId}["'][^>]*>([\\s\\S]*?)</${tagName}>`,
      'i',
    ),
  );
  assert.ok(match, 'missing template tag: ' + tagName + '#' + id);
  return match[1];
}

function extractTemplateScript(source) {
  const match = source.match(/<script>\s*([\s\S]*?)\s*<\/script>\s*$/i);
  assert.ok(match, 'missing terminal template polish script');
  return match[1];
}

const templateDesignCss = extractTag(
  templateSource,
  'style',
  'berlintools-template-design-polish-css',
);
const templateDesignScript = extractTemplateScript(templateSource);

assert.equal(
  sha256(resizeSource),
  'abbdc1af034c55cd4f8198c24d8c8b93643dd19ae0af99e51db5aa8f34e9de05',
  'rev18 resize source changed; local loop fixture must preserve it byte-for-byte',
);
assert.doesNotMatch(candidateShellCss, /\*\s*:has\(iframe\)/, 'broad *:has(iframe) selector remains');
assert.match(candidateShellCss, />\s*div:has\(iframe\)/, 'narrow direct private-chain :has selector missing');
assert.match(candidateShellCss, />\s*div:has\(iframe\)\s*>\s*div:has\(iframe\)\s*>\s*div:has\(iframe\)/, 'three-level private-chain selector missing');
assert.match(candidateShellCss, /@layer\s+bw-host-repair\b/, 'host repair cascade layer missing');

function gitShow(repoRelativePath) {
  return execFileSync(
    'git',
    ['-C', WIDGET_ROOT, 'show', BASELINE_COMMIT + ':' + repoRelativePath],
    { encoding: 'utf8' },
  );
}

const baselineShellSource = gitShow('js/berlintools-single-page-shell-v2.js');
const baselineShellCss = gitShow('css/berlintools-single-page-shell-v2.css');
const baselineCommitHash = execFileSync(
  'git',
  ['-C', WIDGET_ROOT, 'rev-parse', BASELINE_COMMIT + '^{commit}'],
  { encoding: 'utf8' },
).trim();
const workingTreeCommitHash = execFileSync(
  'git',
  ['-C', WIDGET_ROOT, 'rev-parse', 'HEAD^{commit}'],
  { encoding: 'utf8' },
).trim();

const SOURCE_METADATA = {
  rev18: {
    path: path.relative(WORKSPACE_ROOT, resizeSourcePath),
    sha256: sha256(resizeSource),
  },
  baseline: {
    kind: 'git-show',
    commitRef: BASELINE_COMMIT,
    commitHash: baselineCommitHash,
    jsPath: 'js/berlintools-single-page-shell-v2.js',
    cssPath: 'css/berlintools-single-page-shell-v2.css',
    jsSha256: sha256(baselineShellSource),
    cssSha256: sha256(baselineShellCss),
  },
  candidate: {
    kind: 'working-tree-read',
    gitCommitHash: workingTreeCommitHash,
    sourceIdentity: 'working tree at HEAD; uncommitted candidate files are hashed below',
    jsPath: path.relative(WIDGET_ROOT, shellSourcePath),
    cssPath: path.relative(WIDGET_ROOT, shellCssPath),
    jsSha256: sha256(candidateShellSource),
    cssSha256: sha256(candidateShellCss),
  },
  templatePolish: {
    path: path.relative(WORKSPACE_ROOT, templatePolishPath),
    sha256: sha256(templateSource),
    cssSha256: sha256(templateDesignCss),
    scriptSha256: sha256(templateDesignScript),
  },
  testRunner: {
    path: path.relative(WIDGET_ROOT, SCRIPT_PATH),
    sha256: sha256(testRunnerSource),
  },
};

const LIVE_LEGACY_SELECTOR =
  'html.bw-tools-detail body #comp-mozc935g3 #comp-mozco5et';
const LIVE_LEGACY_PRIVATE_CHAIN_SELECTORS = [
  LIVE_LEGACY_SELECTOR + ' > .private-shell',
  LIVE_LEGACY_SELECTOR + ' > .private-shell > .private-viewport',
  LIVE_LEGACY_SELECTOR + ' > .private-shell > .private-viewport > .private-frame',
];
const LIVE_LEGACY_LOAD_ORDER = [
  'rev18 resize runtime head script',
  'shell CSS',
  'berlintools-template-design-polish.html style#berlintools-template-design-polish-css',
  'active Wix legacy host/private/iframe envelope (two-ID selectors)',
  'fixture setup observers and DOM',
  'berlintools-template-design-polish.html terminal script',
  'shell JS',
];

const ACTIVE_LEGACY_ENVELOPE_CSS = `
/* Exact live legacy ancestor, deliberately loaded after template CSS. */
@media (min-width: 1025px) {
  ${LIVE_LEGACY_SELECTOR} {
    aspect-ratio: 1 / 1.18796 !important;
    background: #FFFFFF !important;
    height: 1211.71px !important;
    inset: 0 !important;
    max-width: 1020px !important;
    min-height: 1211.71px !important;
    overflow: hidden !important;
    position: absolute !important;
    width: min(100% - 72px, 1020px) !important;
  }
  ${LIVE_LEGACY_PRIVATE_CHAIN_SELECTORS.join(',\n  ')},
  ${LIVE_LEGACY_SELECTOR} iframe {
    height: 720px !important;
    inset: 0 !important;
    overflow: hidden !important;
    position: absolute !important;
    width: 100% !important;
  }
}
@media (max-width: 1024px) {
  ${LIVE_LEGACY_SELECTOR} {
    aspect-ratio: 1 / 1.18796 !important;
    background: #FFFFFF !important;
    height: 1211.71px !important;
    inset: 0 !important;
    max-width: 700px !important;
    min-height: 1211.71px !important;
    overflow: hidden !important;
    position: absolute !important;
    width: min(100% - 32px, 700px) !important;
  }
  ${LIVE_LEGACY_PRIVATE_CHAIN_SELECTORS.join(',\n  ')},
  ${LIVE_LEGACY_SELECTOR} iframe {
    height: 720px !important;
    inset: 0 !important;
    overflow: hidden !important;
    position: absolute !important;
    width: 100% !important;
  }
}
/* Weather's secondary iframe is intentionally left on its own legacy envelope. */
#weather-secondary-host {
  aspect-ratio: 1 / 1.2 !important;
  background: #FFFFFF !important;
  height: 360px !important;
  min-height: 360px !important;
  overflow: hidden !important;
  position: relative !important;
  width: min(100% - 32px, 520px) !important;
}
#weather-secondary-host > .secondary-private-shell,
#weather-secondary-host > .secondary-private-shell > .secondary-private-viewport,
#weather-secondary-host > .secondary-private-shell > .secondary-private-viewport > .secondary-private-frame,
#weather-secondary-host iframe {
  height: 280px !important;
  inset: 0 !important;
  overflow: hidden !important;
  position: absolute !important;
  width: 100% !important;
}
`;

function writeJsonAtomic(filePath, value) {
  const tempPath = filePath + '.tmp-' + process.pid;
  return fs
    .writeFile(tempPath, JSON.stringify(value, null, 2) + '\n')
    .then(() => fs.rename(tempPath, filePath));
}

function stripScriptWrapper(source) {
  return source.replace(/^\s*<script[^>]*>/i, '').replace(/<\/script>\s*$/i, '');
}

function routeProfile(route, channel) {
  if (channel === 'secondary') return route.secondary;
  return route;
}

function childHtml(profile, channel) {
  const baseHeight = profile.baseHeight;
  const expandedHeight = profile.expandedHeight;
  const liveHeight = Math.max(120, expandedHeight - baseHeight);
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; min-height: 100%; }
  body { background: #FAFAF5; font: 16px/1.5 Arial, sans-serif; }
  #fixture-widget { min-height: ${baseHeight}px; padding: 20px; }
  #fixture-widget .card { min-height: ${Math.max(120, baseHeight - 90)}px; border: 1px solid #DCE8C8; background: #fff; padding: 16px; }
  #fixture-widget .extra { display: none; min-height: ${liveHeight}px; margin-top: 16px; border-top: 1px solid #DCE8C8; }
  #fixture-widget.interacted .extra { display: block; }
  #fixture-widget .interaction-live { min-height: ${liveHeight}px; margin-top: 16px; border-top: 1px solid #DCE8C8; }
</style></head><body>
<main id="fixture-widget"><div class="card"><strong>${profile.kind}</strong><p>${channel === 'secondary' ? 'Secondary iframe fixture.' : 'Primary expanding interaction fixture.'}</p><div class="extra">Hidden optional result content.</div></div></main>
<script>
(function () {
  var root = document.getElementById('fixture-widget');
  var lastReported = 0;
  var pending = false;
  function directHeight() {
    var max = 0;
    for (var i = 0; i < document.body.children.length; i += 1) {
      var child = document.body.children[i];
      var rect = child.getBoundingClientRect();
      var style = getComputedStyle(child);
      max = Math.max(max, rect.bottom + (parseFloat(style.marginBottom) || 0));
    }
    return Math.ceil(max);
  }
  function report(phase) {
    var height = directHeight();
    if (height > 0 && Math.abs(height - lastReported) > 2) {
      lastReported = height;
      parent.postMessage({ type: 'bw-resize', height: height, channel: '${channel}', phase: phase || 'resize' }, '*');
      parent.postMessage({ type: 'fixture-child-message', channel: '${channel}' }, '*');
    }
  }
  function throttled(phase) {
    if (pending) return;
    pending = true;
    (requestAnimationFrame || function (callback) { setTimeout(callback, 16); })(function () {
      pending = false;
      report(phase);
    });
  }
  new ResizeObserver(function () {
    parent.postMessage({ type: 'fixture-child-resize-observer', channel: '${channel}' }, '*');
    throttled('resize-observer');
  }).observe(document.body);
  new MutationObserver(function () {
    parent.postMessage({ type: 'fixture-child-mutation-observer', channel: '${channel}' }, '*');
    throttled('mutation-observer');
  }).observe(document.body, { childList: true, subtree: true, characterData: true });
  window.addEventListener('resize', function () { throttled('window-resize'); });
  window.addEventListener('message', function (event) {
    if (!event.data || event.data.type !== 'fixture-interaction') return;
    var enabled = Boolean(event.data.enabled);
    root.classList.toggle('interacted', enabled);
    var live = root.querySelector('.interaction-live');
    if (enabled && !live) {
      live = document.createElement('div');
      live.className = 'interaction-live';
      live.textContent = 'Interaction result content.';
      root.appendChild(live);
    } else if (!enabled && live) {
      live.remove();
    }
    parent.postMessage({
      type: 'fixture-interaction-ack',
      channel: '${channel}',
      phase: enabled ? 'expand' : 'shrink',
      height: directHeight(),
    }, '*');
    throttled(enabled ? 'interaction-expand' : 'interaction-shrink');
  });
  report('initial');
})();
</script></body></html>`;
}

function fixtureSetupScript(hasSecondary) {
  return `<script>
(function () {
  var cap = ${REMOUNT_CAP};
  var counters = window.__loopCounters = {
    parentResizeObserver: 0,
    parentMutationObserver: 0,
    primaryMessageCount: 0,
    secondaryMessageCount: 0,
    childResizeObserver: 0,
    childMutationObserver: 0,
    primaryInteractionExpandAck: 0,
    primaryInteractionShrinkAck: 0,
    primaryInteractionAckHeight: 0,
    secondaryInteractionAck: 0,
    remounts: 0,
    markerMutations: 0,
    secondaryMutationRecords: 0,
    secondaryRemounts: 0,
    secondaryMarkerMutations: 0,
    forbiddenGeometryMutations: [],
    secondaryGeometryMutations: [],
    trackingEnabled: false
  };
  function channelOf(event) {
    var primary = document.querySelector('#comp-mozco5et iframe');
    var secondary = document.querySelector('#weather-secondary-host iframe');
    if (primary && event.source === primary.contentWindow) return 'primary';
    if (secondary && event.source === secondary.contentWindow) return 'secondary';
    return event.data && event.data.channel === 'secondary' ? 'secondary' : 'unknown';
  }
  window.addEventListener('message', function (event) {
    if (!event.data) return;
    var channel = channelOf(event);
    if (event.data.type === 'bw-resize') {
      if (channel === 'primary') counters.primaryMessageCount += 1;
      if (channel === 'secondary') counters.secondaryMessageCount += 1;
    }
    if (event.data.type === 'fixture-child-resize-observer') counters.childResizeObserver += 1;
    if (event.data.type === 'fixture-child-mutation-observer') counters.childMutationObserver += 1;
    if (event.data.type === 'fixture-interaction-ack') {
      if (channel === 'primary' && event.data.phase === 'expand') counters.primaryInteractionExpandAck += 1;
      if (channel === 'primary' && event.data.phase === 'shrink') counters.primaryInteractionShrinkAck += 1;
      if (channel === 'primary') counters.primaryInteractionAckHeight = Math.max(counters.primaryInteractionAckHeight, Number(event.data.height) || 0);
      if (channel === 'secondary') counters.secondaryInteractionAck += 1;
    }
  });
  function installPrimary() {
    var host = document.getElementById('comp-mozco5et');
    if (!host || host.getAttribute('data-fixture-observed') === '1') return;
    host.setAttribute('data-fixture-observed', '1');
    new ResizeObserver(function () { counters.parentResizeObserver += 1; }).observe(host);
    new MutationObserver(function (records) {
      counters.parentMutationObserver += records.length;
      records.forEach(function (record) {
        if (record.type !== 'attributes' || !/^data-bw-host-repair-/.test(record.attributeName || '')) return;
        counters.markerMutations += 1;
        if (counters.remounts >= cap) return;
        window.setTimeout(function () {
          if (counters.remounts >= cap) return;
          var current = host.querySelector('iframe');
          if (!current) return;
          var replacement = document.createElement('iframe');
          replacement.id = current.id;
          replacement.title = current.title;
          replacement.src = current.src;
          replacement.setAttribute('data-fixture-remount', String(counters.remounts + 1));
          current.replaceWith(replacement);
          counters.remounts += 1;
        }, 0);
      });
    }).observe(host, { attributes: true, childList: true, subtree: true });
  }
  function installSecondary() {
    var host = document.getElementById('weather-secondary-host');
    if (!host || host.getAttribute('data-fixture-observed') === '1') return;
    host.setAttribute('data-fixture-observed', '1');
    new MutationObserver(function (records) {
      counters.secondaryMutationRecords += records.length;
      records.forEach(function (record) {
        if (record.type === 'attributes' && /^data-bw-host-repair-/.test(record.attributeName || '')) counters.secondaryMarkerMutations += 1;
      });
    }).observe(host, { attributes: true, childList: true, subtree: true });
  }
  function installGeometryObserver() {
    new MutationObserver(function (records) {
      if (!counters.trackingEnabled) return;
      records.forEach(function (record) {
        if (record.type !== 'attributes' || record.attributeName !== 'style') return;
        var target = record.target;
        var id = target && target.id;
        var secondary = id === 'weather-secondary-host' || id === 'weather-secondary-frame';
        var forbidden = id === 'comp-mozco5et' || id === 'comp-mozc935g3' || id === 'comp-mozmt2at' || id === 'comp-mozn18up' || id === 'comp-moznh5yl' || id === 'comp-mozp1zlv' || id === 'page-grid' || id === 'SITE_PAGES' || target === document.documentElement;
        if (secondary) counters.secondaryGeometryMutations.push({ id: id, property: record.attributeName });
        if (forbidden) counters.forbiddenGeometryMutations.push({ id: id || 'documentElement', property: record.attributeName });
      });
    }).observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ['style'] });
    window.__resetFixtureGeometryTracking = function () {
      counters.forbiddenGeometryMutations = [];
      counters.secondaryGeometryMutations = [];
      counters.trackingEnabled = true;
    };
  }
  function install() {
    installPrimary();
    if (${hasSecondary ? 'true' : 'false'}) installSecondary();
    installGeometryObserver();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
})();
</script>`;
}

function fixtureMarkup(route, css, resizeScript, source) {
  const iframeUrl = 'https://fenerszymanski.github.io/berlinwalk-widgets/' + route.slug + '/index.html?host=berlinwalk&surface=tool-page';
  const secondaryMarkup = route.secondary
    ? `<div id="weather-secondary-host" data-secondary-host="1"><div class="secondary-private-shell"><div class="secondary-private-viewport"><div class="secondary-private-frame"><iframe id="weather-secondary-frame" title="secondary weather fixture" src="https://fenerszymanski.github.io/berlinwalk-widgets/${route.secondary.id}/index.html?host=berlinwalk&surface=secondary"></iframe></div></div></div></div>`
    : '';
  return `<!doctype html>
<html class="bw-tools-shell-v2 bw-tools-detail" data-bw-host-repair="off">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<script>window.fetch = function () { return Promise.reject(new Error('fixture catalog disabled')); };</script>
<script id="rev18-resize-runtime">${stripScriptWrapper(resizeScript)}</script>
<style id="fixture-base-css">
  html, body { margin: 0; padding: 0; width: 100%; }
  #page-grid, #SITE_PAGES { width: 100%; }
  #comp-mozco5et { aspect-ratio: 1 / 1.18796; height: 1211.71px; min-height: 1211.71px; overflow: hidden; background: #fff; }
  #comp-mozco5et > .private-shell,
  #comp-mozco5et > .private-shell > .private-viewport,
  #comp-mozco5et > .private-shell > .private-viewport > .private-frame { position: absolute; inset: 0; height: 720px; overflow: hidden; width: 100%; }
  #comp-mozco5et iframe { position: absolute; inset: 0; height: 720px; width: 100%; }
  #next-section { min-height: 160px; padding: 24px; background: #F2F8E8; }
</style>
<style id="berlintools-shell-css">${css}</style>
<style id="berlintools-template-design-polish-css">${templateDesignCss}</style>
<style id="active-live-legacy-envelope">${ACTIVE_LEGACY_ENVELOPE_CSS}</style>
</head>
<body id="page-grid">${fixtureSetupScript(Boolean(route.secondary))}<div id="SITE_PAGES">
<section id="comp-mozc935g3"><div class="comp-mozc935g3-container">
  <div id="comp-mozch2i3"><h1>${route.kind}</h1></div>
  <div id="comp-mozck6is"><p>Fixture lead.</p></div>
  <div id="comp-mozcllqt"><p>Fixture secondary.</p></div>
  <div id="comp-mozco5et"><div class="private-shell"><div class="private-viewport"><div class="private-frame"><iframe id="primary-frame" title="primary ${route.kind} fixture" src="${iframeUrl}"></iframe></div></div></div></div>
  ${secondaryMarkup}
</div></section>
<div id="hero-boundary" aria-hidden="true"></div>
<section id="comp-mozmt2at"><div id="comp-mozmtefi"><p>Intro.</p></div></section>
<section id="comp-mozn18up"><div id="comp-mozn27df"><h2>Body</h2><p>Body text.</p></div></section>
<section id="comp-moznh5yl"><div id="comp-moznhogf"></div></section>
<section id="comp-mozp1zlv"></section><div id="comp-mozmgdoo"></div>
<section id="next-section">Next section boundary.</section>
</div>
<script id="berlintools-template-design-polish-script">${templateDesignScript}</script>
${source ? '<script id="berlintools-shell-js">' + source + '</script>' : ''}</body></html>`;
}

function repairSelectors() {
  const root = 'html[data-bw-host-repair="pilot"].bw-host-repair-pilot body ';
  const host = root + '#comp-mozco5et';
  const wrapperRoot = host + ' > div:has(iframe)';
  const privateSelectors = [
    wrapperRoot,
    wrapperRoot + ' > div:has(iframe)',
    wrapperRoot + ' > div:has(iframe) > div:has(iframe)',
  ].join(', ');
  return {
    host,
    private: privateSelectors,
    iframe: wrapperRoot + ' iframe',
  };
}

function scenarioKey(result) {
  return result.slug + '/' + result.viewportWidth;
}

function sourceMetaForVariant(variant) {
  return variant.label === 'baseline-cbdddc' ? SOURCE_METADATA.baseline : SOURCE_METADATA.candidate;
}

async function runScenario({ browser, serverPort, route, viewportWidth, variant, runOutputRoot }) {
  const page = await browser.newPage({ viewport: { width: viewportWidth, height: 900 } });
  activeScenarioPages.add(page);
  const counters = {
    slug: route.slug,
    kind: route.kind,
    viewportWidth,
    parentResizeObserver: 0,
    parentMutationObserver: 0,
    primaryMessageCount: 0,
    secondaryMessageCount: 0,
    childResizeObserver: 0,
    childMutationObserver: 0,
    primaryInteractionExpandAck: 0,
    primaryInteractionShrinkAck: 0,
    primaryInteractionAckHeight: 0,
    secondaryInteractionAck: 0,
    remounts: 0,
    markerMutations: 0,
    secondaryMutationRecords: 0,
    secondaryRemounts: 0,
    secondaryMarkerMutations: 0,
    forbiddenGeometryMutations: [],
    secondaryGeometryMutations: [],
  };
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.route('https://fenerszymanski.github.io/berlinwalk-widgets/**', async (intercepted) => {
    const url = intercepted.request().url();
    const channel = url.includes('/weather-secondary/') ? 'secondary' : 'primary';
    const profile = routeProfile(route, channel);
    await intercepted.fulfill({
      status: 200,
      contentType: 'text/html; charset=utf-8',
      body: childHtml(profile, channel),
    });
  });
  try {
    await page.goto('http://127.0.0.1:' + serverPort + '/tools/' + route.slug, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.documentElement.getAttribute('data-bw-host-repair') === 'pilot');
    await page.locator('#comp-mozco5et iframe').scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(3300);

    const capture = () => page.evaluate((selectors) => {
      const nodePath = (node) => {
        const parts = [];
        let current = node;
        while (current && current !== document.documentElement) {
          const className = typeof current.className === 'string'
            ? current.className.trim().split(/\s+/).filter(Boolean).slice(0, 2).join('.')
            : '';
          parts.unshift(current.id ? '#' + current.id : className ? '.' + className : current.tagName.toLowerCase());
          current = current.parentElement;
        }
        return parts.join(' > ');
      };
      const read = (node) => {
        if (!node) return null;
        const style = getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        return {
          id: node.id,
          className: String(node.className || ''),
          path: nodePath(node),
          width: rect.width,
          height: rect.height,
          top: rect.top,
          bottom: rect.bottom,
          position: style.position,
          overflow: style.overflow,
          aspectRatio: style.aspectRatio,
          backgroundColor: style.backgroundColor,
          inlineHeight: node.style.height,
          inlineMinHeight: node.style.minHeight,
          borderTopWidth: style.borderTopWidth,
          borderRightWidth: style.borderRightWidth,
          borderBottomWidth: style.borderBottomWidth,
          borderLeftWidth: style.borderLeftWidth,
        };
      };
      const matchNodes = (selector) => Array.from(document.querySelectorAll(selector)).map((node) => read(node));
      const host = document.getElementById('comp-mozco5et');
      const privateChain = host
        ? Array.from(host.querySelectorAll(':scope > .private-shell, :scope > .private-shell > .private-viewport, :scope > .private-shell > .private-viewport > .private-frame'))
        : [];
      const privateShell = privateChain[0] || null;
      const frame = host && host.querySelector(':scope > .private-shell > .private-viewport > .private-frame iframe');
      const secondaryHost = document.getElementById('weather-secondary-host');
      const secondaryPrivateChain = secondaryHost
        ? Array.from(secondaryHost.querySelectorAll(':scope > .secondary-private-shell, :scope > .secondary-private-shell > .secondary-private-viewport, :scope > .secondary-private-shell > .secondary-private-viewport > .secondary-private-frame'))
        : [];
      const secondaryPrivate = secondaryPrivateChain[0] || null;
      const secondaryFrame = secondaryHost && secondaryHost.querySelector(':scope > .secondary-private-shell > .secondary-private-viewport > .secondary-private-frame iframe');
      const styleSheetOrder = Array.from(document.styleSheets).map((sheet, index) => {
        const owner = sheet.ownerNode;
        const text = owner && owner.textContent ? owner.textContent : '';
        return {
          index,
          id: owner && owner.id ? owner.id : null,
          hasRepairLayer: /@layer\s+bw-host-repair\b/.test(text),
          hasExactLegacySelector: text.includes('html.bw-tools-detail body #comp-mozc935g3 #comp-mozco5et'),
        };
      });
      const shellSheet = styleSheetOrder.find((sheet) => sheet.id === 'berlintools-shell-css');
      const templateSheet = styleSheetOrder.find((sheet) => sheet.id === 'berlintools-template-design-polish-css');
      const legacySheet = styleSheetOrder.find((sheet) => sheet.id === 'active-live-legacy-envelope');
      const primaryRepairMatches = {
        host: matchNodes(selectors.host),
        private: matchNodes(selectors.private),
        iframe: matchNodes(selectors.iframe),
      };
      const matchedPrivateNodes = Array.from(document.querySelectorAll(selectors.private));
      const matchedIframeNodes = Array.from(document.querySelectorAll(selectors.iframe));
      const secondaryRepairMatches = secondaryHost ? {
        host: secondaryHost.matches(selectors.host) ? 1 : 0,
        private: secondaryPrivateChain.filter((node) => matchedPrivateNodes.includes(node)).length,
        iframe: secondaryFrame && matchedIframeNodes.includes(secondaryFrame) ? 1 : 0,
      } : null;
      return {
        host: read(host),
        privateShell: read(privateShell),
        privateChain: privateChain.map(read),
        frame: read(frame),
        secondary: secondaryHost ? {
          host: read(secondaryHost),
          privateShell: read(secondaryPrivate),
          privateChain: secondaryPrivateChain.map(read),
          frame: read(secondaryFrame),
        } : null,
        repairMatches: primaryRepairMatches,
        repairMatchCounts: Object.fromEntries(Object.entries(primaryRepairMatches).map(([key, nodes]) => [key, nodes.length])),
        secondaryRepairMatches,
        cascadeProof: {
          styleSheetOrder,
          shellSheetIndex: shellSheet ? shellSheet.index : null,
          templateSheetIndex: templateSheet ? templateSheet.index : null,
          legacySheetIndex: legacySheet ? legacySheet.index : null,
          repairLayerPresentInShell: Boolean(shellSheet && shellSheet.hasRepairLayer),
          exactTwoIdLegacySelectorPresentInActiveEnvelope: Boolean(legacySheet && legacySheet.hasExactLegacySelector),
          importantLayerOrderExpected: Boolean(shellSheet && legacySheet && shellSheet.index < legacySheet.index),
          computedPrimary: {
            host: read(host),
            privateChain: privateChain.map(read),
            frame: read(frame),
          },
        },
        nextTop: document.getElementById('next-section').getBoundingClientRect().top,
        heroBottom: document.getElementById('comp-mozc935g3').getBoundingClientRect().bottom,
        bodyScrollWidth: document.body.scrollWidth,
        documentScrollWidth: document.documentElement.scrollWidth,
        bodyScrollHeight: document.body.scrollHeight,
        rootHeight: document.documentElement.style.height,
        rootMinHeight: document.documentElement.style.minHeight,
      };
    }, repairSelectors());

    const initial = await capture();

    async function interact(enabled) {
      await page.locator('#comp-mozco5et iframe').scrollIntoViewIfNeeded();
      await page.evaluate((value) => {
        if (window.__resetFixtureGeometryTracking) window.__resetFixtureGeometryTracking();
        const frame = document.querySelector('#comp-mozco5et iframe');
        if (frame && frame.contentWindow) frame.contentWindow.postMessage({ type: 'fixture-interaction', enabled: value, channel: 'primary' }, 'https://fenerszymanski.github.io');
      }, enabled);
      await page.waitForTimeout(750);
      return capture();
    }

    const expanded = await interact(true);
    const shrink = await interact(false);
    const fixtureCounters = await page.evaluate(() => window.__loopCounters);
    Object.assign(counters, fixtureCounters);
    const screenshotPath = path.join(
      runOutputRoot,
      'screenshots',
      variant.label + '-' + route.slug + '-' + viewportWidth + '.png',
    );
    await fs.mkdir(path.dirname(screenshotPath), { recursive: true });
    await page.screenshot({ path: screenshotPath, fullPage: false });
    return {
      label: variant.label,
      slug: route.slug,
      kind: route.kind,
      viewportWidth,
      initial,
      expanded,
      shrink,
      counters,
      pageErrors,
      screenshot: path.relative(WORKSPACE_ROOT, screenshotPath),
    };
  } finally {
    activeScenarioPages.delete(page);
    if (!page.isClosed()) await page.close();
  }
}

async function runScenarioWithTimeout(args) {
  let timer;
  let timedOut = false;
  const scenario = runScenario(args);
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(async () => {
      timedOut = true;
      await Promise.all(
        Array.from(activeScenarioPages, (page) =>
          page.isClosed() ? Promise.resolve() : page.close().catch(() => {}),
        ),
      );
      reject(new Error('scenario timeout after ' + SCENARIO_TIMEOUT_MS + 'ms: ' + args.variant.label + '/' + args.route.slug + '/' + args.viewportWidth));
    }, SCENARIO_TIMEOUT_MS);
  });
  try {
    return await Promise.race([scenario, timeout]);
  } finally {
    clearTimeout(timer);
    if (timedOut) await scenario.catch(() => {});
  }
}

function assertScenarioSchema(result) {
  assert.equal(typeof result.slug, 'string', 'scenario result missing slug');
  assert.equal(typeof result.kind, 'string', 'scenario result missing kind');
  assert.equal(typeof result.viewportWidth, 'number', 'scenario result missing viewport');
  assert.equal(result.slug, result.counters.slug, 'scenario slug schema mismatch');
  assert.equal(result.kind, result.counters.kind, 'scenario kind schema mismatch');
  assert.equal(result.viewportWidth, result.counters.viewportWidth, 'scenario viewport schema mismatch');
  assert.ok(result.initial && result.expanded && result.shrink, 'scenario missing three geometry phases');
}

function styleSnapshot(node) {
  if (!node) return null;
  return {
    width: node.width,
    height: node.height,
    position: node.position,
    overflow: node.overflow,
    aspectRatio: node.aspectRatio,
    backgroundColor: node.backgroundColor,
    inlineHeight: node.inlineHeight,
    inlineMinHeight: node.inlineMinHeight,
  };
}

function secondaryUnchanged(result) {
  if (!result.initial.secondary) return true;
  const phases = [result.initial.secondary, result.expanded.secondary, result.shrink.secondary];
  const baseline = JSON.stringify({
    host: styleSnapshot(phases[0].host),
    privateChain: (phases[0].privateChain || []).map(styleSnapshot),
    frame: styleSnapshot(phases[0].frame),
  });
  return phases.slice(1).every((phase) => JSON.stringify({
    host: styleSnapshot(phase.host),
    privateChain: (phase.privateChain || []).map(styleSnapshot),
    frame: styleSnapshot(phase.frame),
  }) === baseline);
}

function buildComparison({ runId, startedAt, completedAt, baselineReceipt, candidateReceipt }) {
  const allResults = [...baselineReceipt.results, ...candidateReceipt.results];
  allResults.forEach(assertScenarioSchema);
  const expectedCount = ROUTE_SCHEMA.expectedScenarioCount;
  const baselineLoopScenarios = baselineReceipt.results.filter(
    (result) => result.counters.remounts >= REMOUNT_CAP && result.counters.markerMutations >= REMOUNT_CAP,
  );
  const candidateNoLoopScenarios = candidateReceipt.results.filter(
    (result) => result.counters.remounts === 0 && result.counters.markerMutations === 0,
  );
  const baselineByScenario = new Map(baselineReceipt.results.map((result) => [scenarioKey(result), result]));
  const candidatePredicateResults = [];
  for (const result of candidateReceipt.results) {
    const control = baselineByScenario.get(scenarioKey(result));
    const phases = [result.initial, result.expanded, result.shrink];
    const controlPhases = control ? [control.initial, control.expanded, control.shrink] : [];
    const privateChainNaturalFlow = phases.every((phase) =>
      Array.isArray(phase.privateChain) &&
      phase.privateChain.length === 3 &&
      phase.privateChain.every((node) => node.position === 'relative' && node.overflow === 'visible' && node.bottom <= phase.host.bottom + 2),
    );
    const privateChainWidthParity = Boolean(
      control &&
      phases.every((phase, index) => {
        const controlPhase = controlPhases[index];
        return Array.isArray(phase.privateChain) &&
          Array.isArray(controlPhase.privateChain) &&
          phase.privateChain.length === controlPhase.privateChain.length &&
          phase.privateChain.every((node, nodeIndex) => Math.abs(node.width - controlPhase.privateChain[nodeIndex].width) <= 0.5);
      }),
    );
    const widthParityWithBaselineControl = Boolean(
      control &&
        Math.abs(result.initial.host.width - control.initial.host.width) <= 0.5 &&
        Math.abs(result.initial.frame.width - control.initial.frame.width) <= 0.5 &&
        Math.abs(result.expanded.host.width - control.expanded.host.width) <= 0.5 &&
        Math.abs(result.shrink.host.width - control.shrink.host.width) <= 0.5,
    );
    const predicates = {
      parentResizeObserverBounded: result.counters.parentResizeObserver <= 20,
      parentMutationObserverBounded: result.counters.parentMutationObserver <= 500,
      childResizeObserverBounded: result.counters.childResizeObserver <= 24,
      childMutationObserverBounded: result.counters.childMutationObserver <= 24,
      primaryResizeMessageBounded: result.counters.primaryMessageCount <= 20,
      noRootSectionPageGridGeometryMutation: result.counters.forbiddenGeometryMutations.length === 0,
      noPageErrors: result.pageErrors.length === 0,
      hostNaturalFlowAllPhases: [result.initial, result.expanded, result.shrink].every((phase) => phase.host.position === 'relative' && phase.host.overflow === 'visible'),
      hostAspectSurfaceRepaired: result.initial.host.aspectRatio.startsWith('auto') && result.initial.host.backgroundColor === 'rgb(250, 250, 245)',
      privateChainNaturalFlowAllPhases: privateChainNaturalFlow,
      iframeNaturalFlowAllPhases: phases.every((phase) => phase.frame.position === 'relative'),
      iframeBrowserOverflowContract: phases.every((phase) => phase.frame.overflow === 'clip' || phase.frame.overflow === 'visible'),
      frameInsideHostAllPhases: phases.every((phase) => phase.frame.bottom <= phase.host.bottom + 2),
      hostFrameBottomDeltaAllPhases: phases.every((phase) => Math.abs(phase.host.bottom - phase.frame.bottom) <= 4),
      hostHeroFlowGapAllPhases: phases.every((phase) => phase.heroBottom - phase.host.bottom <= 100),
      noHorizontalOverflowAllPhases: phases.every((phase) => phase.bodyScrollWidth <= result.viewportWidth + 1 && phase.documentScrollWidth <= result.viewportWidth + 1),
      expandAckReceived: result.counters.primaryInteractionExpandAck >= 1,
      shrinkAckReceived: result.counters.primaryInteractionShrinkAck >= 1,
      childReportedExpandedHeight: result.counters.primaryInteractionAckHeight >= result.initial.frame.height + 50,
      expandedFrameGrew: result.expanded.frame.height > result.initial.frame.height + 50,
      shrinkReturnedNearInitial: result.shrink.frame.height <= result.initial.frame.height + 4,
      widthParityWithBaselineControl,
      privateChainWidthParityWithBaselineControl: privateChainWidthParity,
      repairHostMatchIsPrimaryOnly: result.initial.repairMatches.host.length === 1 && result.initial.repairMatches.host[0].id === 'comp-mozco5et',
      repairPrivateMatchIsThreeLevelPrimaryChain: result.initial.repairMatches.private.length === 3 && result.initial.repairMatches.private.map((node) => node.className).join('|') === 'private-shell|private-viewport|private-frame',
      repairIframeMatchIsPrimaryOnly: result.initial.repairMatches.iframe.length === 1 && result.initial.repairMatches.iframe[0].id === 'primary-frame',
      candidateNoBroadHasSelector: !candidateShellCss.includes('*:has(iframe)'),
      browserComputedImportantLayerWinsOverLegacyEnvelope: phases.every((phase) =>
        phase.cascadeProof &&
        phase.cascadeProof.repairLayerPresentInShell &&
        phase.cascadeProof.exactTwoIdLegacySelectorPresentInActiveEnvelope &&
        phase.cascadeProof.importantLayerOrderExpected &&
        phase.cascadeProof.computedPrimary.host.position === 'relative' &&
        phase.cascadeProof.computedPrimary.privateChain.length === 3 &&
        phase.cascadeProof.computedPrimary.privateChain.every((node) => node.position === 'relative' && node.overflow === 'visible') &&
        phase.cascadeProof.computedPrimary.frame.position === 'relative',
      ),
    };
    if (result.initial.secondary) {
      predicates.secondaryStyleUnchanged = secondaryUnchanged(result);
      predicates.secondaryHadNoGeometryMutation = result.counters.secondaryGeometryMutations.length === 0;
      predicates.secondaryHadNoMarkerMutation = result.counters.secondaryMarkerMutations === 0 && result.counters.secondaryRemounts === 0;
      predicates.secondaryWasNotMatchedByPrimaryRepair = [result.initial, result.expanded, result.shrink].every((phase) =>
        phase.secondaryRepairMatches &&
        phase.secondaryRepairMatches.host === 0 &&
        phase.secondaryRepairMatches.private === 0 &&
        phase.secondaryRepairMatches.iframe === 0,
      );
    }
    const observations = {
      heroHostGapInitialPx: result.initial.heroBottom - result.initial.host.bottom,
      heroHostGapExpandedPx: result.expanded.heroBottom - result.expanded.host.bottom,
      heroHostGapShrinkPx: result.shrink.heroBottom - result.shrink.host.bottom,
      nextSectionGapInitialPx: result.initial.nextTop - result.initial.host.bottom,
      nextSectionGapExpandedPx: result.expanded.nextTop - result.expanded.host.bottom,
      nextSectionGapShrinkPx: result.shrink.nextTop - result.shrink.host.bottom,
      nextSectionGapAcceptance: 'LIVE_ONLY_GATE_NOT_USED_FOR_LOCAL_PASS',
      matchedRepairNodes: {
        initial: result.initial.repairMatches,
        expanded: result.expanded.repairMatches,
        shrink: result.shrink.repairMatches,
      },
      matchedRepairCounts: {
        initial: result.initial.repairMatchCounts,
        expanded: result.expanded.repairMatchCounts,
        shrink: result.shrink.repairMatchCounts,
      },
      privateChainGeometry: {
        initial: result.initial.privateChain,
        expanded: result.expanded.privateChain,
        shrink: result.shrink.privateChain,
      },
      browserComputedCascade: {
        initial: result.initial.cascadeProof,
        expanded: result.expanded.cascadeProof,
        shrink: result.shrink.cascadeProof,
      },
      secondaryRepairMatchCounts: result.initial.secondary ? {
        initial: result.initial.secondaryRepairMatches,
        expanded: result.expanded.secondaryRepairMatches,
        shrink: result.shrink.secondaryRepairMatches,
      } : null,
      secondaryStyleSnapshot: result.initial.secondary ? {
        host: styleSnapshot(result.initial.secondary.host),
        privateChain: (result.initial.secondary.privateChain || []).map(styleSnapshot),
        frame: styleSnapshot(result.initial.secondary.frame),
      } : null,
    };
    result.geometryPredicates = predicates;
    result.geometryObservations = observations;
    result.geometryContractPass = Object.values(predicates).every(Boolean);
    candidatePredicateResults.push({ slug: result.slug, viewportWidth: result.viewportWidth, pass: result.geometryContractPass, failures: Object.entries(predicates).filter(([, value]) => value !== true).map(([key]) => key) });
  }
  const candidateBoundedScenarios = candidateReceipt.results.filter((result) => result.geometryContractPass === true);
  const baselineLegacyConflictScenarios = baselineReceipt.results.filter((result) =>
    !result.initial.host.aspectRatio.startsWith('auto') &&
    result.initial.host.height > 1000 &&
    result.initial.host.overflow === 'hidden' &&
    result.initial.host.backgroundColor === 'rgb(255, 255, 255)' &&
    Array.isArray(result.initial.privateChain) &&
    result.initial.privateChain.length === 3 &&
    result.initial.privateChain.every((node) => node.position === 'absolute') &&
    result.initial.frame.position === 'absolute',
  );
  const candidateLegacyDefeatedScenarios = candidateReceipt.results.filter((result) =>
    result.initial.host.position === 'relative' &&
    Array.isArray(result.initial.privateChain) &&
    result.initial.privateChain.length === 3 &&
    result.initial.privateChain.every((node) => node.position === 'relative') &&
    result.initial.frame.position === 'relative',
  );
  const wrapperMatchPass = candidateReceipt.results.every((result) =>
    result.initial.repairMatches.private.length === 3 &&
    result.expanded.repairMatches.private.length === 3 &&
    result.shrink.repairMatches.private.length === 3,
  ) && candidateReceipt.results.filter((result) => result.initial.secondary).every((result) =>
    result.initial.secondaryRepairMatches.private === 0 &&
    result.expanded.secondaryRepairMatches.private === 0 &&
    result.shrink.secondaryRepairMatches.private === 0,
  );
  candidateReceipt.geometryContract = {
    status: candidateBoundedScenarios.length === candidateReceipt.results.length ? 'PASS' : 'FAIL',
    passedScenarios: candidateBoundedScenarios.length,
    totalScenarios: candidateReceipt.results.length,
    namedPredicateResults: candidatePredicateResults,
    liveOnlyGate: 'next-section external gap requires coordinator-owned five-tool live Chrome pilot measurement',
  };
  return {
    runId,
    startedAt,
    completedAt,
    status: 'BASELINE_GIT_SHOW_VS_WORKING_TREE_EXACT_LIVE_OVERLAY',
    ok:
      baselineReceipt.results.length === expectedCount &&
      candidateReceipt.results.length === expectedCount &&
      baselineLoopScenarios.length === expectedCount &&
      candidateNoLoopScenarios.length === expectedCount &&
      candidateBoundedScenarios.length === expectedCount &&
      baselineLegacyConflictScenarios.length === expectedCount &&
      candidateLegacyDefeatedScenarios.length === expectedCount &&
      wrapperMatchPass,
    routeSchemaGuard: {
      ...ROUTE_SCHEMA,
      baselineResultCount: baselineReceipt.results.length,
      candidateResultCount: candidateReceipt.results.length,
      comparisonResultCount: baselineReceipt.results.length + candidateReceipt.results.length,
      schemaPass: baselineReceipt.results.length === expectedCount && candidateReceipt.results.length === expectedCount,
    },
    scenarioCountGuard: {
      expectedPerVariant: expectedCount,
      expectedPerComparison: expectedCount * 2,
      actualPerVariant: {
        baseline: baselineReceipt.results.length,
        candidate: candidateReceipt.results.length,
      },
      actualPerComparison: baselineReceipt.results.length + candidateReceipt.results.length,
      pass: baselineReceipt.results.length + candidateReceipt.results.length === expectedCount * 2,
    },
    viewportSchemaGuard: {
      expected: VIEWPORTS,
      baseline: [...new Set(baselineReceipt.results.map((result) => result.viewportWidth))].sort((a, b) => a - b),
      candidate: [...new Set(candidateReceipt.results.map((result) => result.viewportWidth))].sort((a, b) => a - b),
    },
    legacyOverlay: {
      sourcePath: path.relative(WORKSPACE_ROOT, templatePolishPath),
      sourceSha256: sha256(templateSource),
      selector: LIVE_LEGACY_SELECTOR,
      privateSelectors: LIVE_LEGACY_PRIVATE_CHAIN_SELECTORS,
      iframeSelector: LIVE_LEGACY_SELECTOR + ' iframe',
      loadOrder: LIVE_LEGACY_LOAD_ORDER,
      exactTemplateCssSelectorVerified: templateDesignCss.includes(LIVE_LEGACY_SELECTOR),
      syntheticThreeWrapperConflictModel: true,
      baselineConflictScenarios: baselineLegacyConflictScenarios.length,
      candidateDefeatedScenarios: candidateLegacyDefeatedScenarios.length,
    },
    baseline: {
      receipt: 'baseline-cbdddc-receipt.json',
      source: SOURCE_METADATA.baseline,
      scenarios: baselineReceipt.results.length,
      loopScenarios: baselineLoopScenarios.length,
    },
    candidate: {
      receipt: 'candidate-host-repair-receipt.json',
      source: SOURCE_METADATA.candidate,
      scenarios: candidateReceipt.results.length,
      noLoopScenarios: candidateNoLoopScenarios.length,
      boundedGeometryScenarios: candidateBoundedScenarios.length,
      widthParityScenarios: candidateReceipt.results.filter((result) => result.geometryPredicates && result.geometryPredicates.widthParityWithBaselineControl).length,
    },
    assertions: {
      exactTwoIdLegacyOverlayModeled: baselineLegacyConflictScenarios.length === expectedCount,
      baselineEveryScenarioReachedRemountAndMarkerCaps: baselineLoopScenarios.length === expectedCount,
      candidateEveryScenarioHadZeroRemountsAndMarkerMutations: candidateNoLoopScenarios.length === expectedCount,
      candidateEveryScenarioPassedNamedGeometryContract: candidateBoundedScenarios.length === expectedCount,
      candidatePreservedBaselineWidths: candidateReceipt.results.filter((result) => result.geometryPredicates && result.geometryPredicates.widthParityWithBaselineControl).length === expectedCount,
      noRootSectionPageGridGeometryMutation: candidateReceipt.results.every((result) => result.counters.forbiddenGeometryMutations.length === 0),
      noBroadHasSelector: !candidateShellCss.includes('*:has(iframe)'),
      primaryPrivateMatchedWrapperCount: candidateReceipt.results.every((result) => result.initial.repairMatches.private.length === 3),
      secondaryPrivateMatchedWrapperCount: candidateReceipt.results.filter((result) => result.initial.secondary).every((result) => result.initial.secondaryRepairMatches.private === 0),
      browserComputedLayerOrderProof: candidateReceipt.results.every((result) => result.initial.cascadeProof && result.initial.cascadeProof.importantLayerOrderExpected),
    },
    wrapperMatchGuard: {
      expectedPrimaryPrivateWrapperCount: 3,
      primaryInitialCounts: [...new Set(candidateReceipt.results.map((result) => result.initial.repairMatches.private.length))].sort((a, b) => a - b),
      primaryExpandedCounts: [...new Set(candidateReceipt.results.map((result) => result.expanded.repairMatches.private.length))].sort((a, b) => a - b),
      primaryShrinkCounts: [...new Set(candidateReceipt.results.map((result) => result.shrink.repairMatches.private.length))].sort((a, b) => a - b),
      weatherSecondaryInitialCounts: [...new Set(candidateReceipt.results.filter((result) => result.initial.secondary).map((result) => result.initial.secondaryRepairMatches.private))].sort((a, b) => a - b),
      pass: wrapperMatchPass,
    },
    sourceHashes: {
      testRunnerSha256: SOURCE_METADATA.testRunner.sha256,
      resizeRev18Sha256: SOURCE_METADATA.rev18.sha256,
      baselineShellJsSha256: SOURCE_METADATA.baseline.jsSha256,
      baselineShellCssSha256: SOURCE_METADATA.baseline.cssSha256,
      candidateShellJsSha256: SOURCE_METADATA.candidate.jsSha256,
      candidateShellCssSha256: SOURCE_METADATA.candidate.cssSha256,
    },
    syntheticInteractionModel: {
      label: 'local-browser synthetic DOM expand/shrink fixture; not live widget semantics',
      routes: ROUTES.map((route) => ({ slug: route.slug, model: route.interactionModel, baseHeight: route.baseHeight, expandedHeight: route.expandedHeight, secondary: route.secondary || null })),
      expandThenShrink: true,
    },
    liveOnlyGates: [
      'next-section external gap remains LIVE_ONLY_GATE_NOT_USED_FOR_LOCAL_PASS',
      'fresh clean Chrome desktop/mobile five-tool pilot remains coordinator-owned',
    ],
    receipts: {
      baseline: 'baseline-cbdddc-receipt.json',
      candidate: 'candidate-host-repair-receipt.json',
    },
  };
}

function buildVariantReceipt({ runId, startedAt, completedAt, variant, results, failures }) {
  return {
    runId,
    startedAt,
    completedAt,
    status: failures.length === 0 && results.length === ROUTE_SCHEMA.expectedScenarioCount
      ? 'COMPLETE'
      : 'INCOMPLETE_SCENARIOS',
    ok: failures.length === 0 && results.length === ROUTE_SCHEMA.expectedScenarioCount,
    variant: variant.label,
    sourceIdentity: sourceMetaForVariant(variant),
    rev18: SOURCE_METADATA.rev18,
    testRunnerSha256: SOURCE_METADATA.testRunner.sha256,
    routeSchemaGuard: ROUTE_SCHEMA,
    viewportSchemaGuard: VIEWPORTS,
    templateLegacyOverlay: {
      sourcePath: path.relative(WORKSPACE_ROOT, templatePolishPath),
      sourceSha256: sha256(templateSource),
      selector: LIVE_LEGACY_SELECTOR,
      loadOrder: LIVE_LEGACY_LOAD_ORDER,
    },
    remountCap: REMOUNT_CAP,
    scenarioTimeoutMs: SCENARIO_TIMEOUT_MS,
    results,
    failures,
  };
}

async function runVariant({ runId, runOutputRoot, startedAt, activeVariant, serverPort, browser }) {
  const results = [];
  const failures = [];
  const checkpointPath = path.join(runOutputRoot, activeVariant.label + '-checkpoint.json');
  const receiptPath = path.join(runOutputRoot, activeVariant.label + '-receipt.json');
  const checkpointBase = {
    runId,
    variant: activeVariant.label,
    startedAt,
    sourceIdentity: sourceMetaForVariant(activeVariant),
    rev18: SOURCE_METADATA.rev18,
    testRunnerSha256: SOURCE_METADATA.testRunner.sha256,
    routeSchemaGuard: ROUTE_SCHEMA,
    viewportSchemaGuard: VIEWPORTS,
    remountCap: REMOUNT_CAP,
    scenarioTimeoutMs: SCENARIO_TIMEOUT_MS,
  };
  await writeJsonAtomic(checkpointPath, { ...checkpointBase, status: 'RUNNING', results, failures });
  for (const viewportWidth of VIEWPORTS) {
    for (const route of ROUTES) {
      try {
        results.push(await runScenarioWithTimeout({ browser, serverPort, route, viewportWidth, variant: activeVariant, runOutputRoot }));
      } catch (error) {
        failures.push({ slug: route.slug, viewportWidth, message: error.message });
        await writeJsonAtomic(checkpointPath, { ...checkpointBase, status: 'SCENARIO_FAILED', completedScenarios: results.length, results, failures });
        break;
      }
      await writeJsonAtomic(checkpointPath, { ...checkpointBase, status: 'RUNNING', completedScenarios: results.length, results, failures });
    }
    if (failures.length > 0) break;
  }
  const completedAt = new Date().toISOString();
  const receipt = buildVariantReceipt({ runId, startedAt, completedAt, variant: activeVariant, results, failures });
  await writeJsonAtomic(receiptPath, receipt);
  await writeJsonAtomic(checkpointPath, { ...checkpointBase, status: 'COMPLETE', completedAt, completedScenarios: results.length, failures, receipt: path.basename(receiptPath) });
  return receipt;
}

async function runComparison(runId) {
  const runOutputRoot = path.join(RUNS_ROOT, runId);
  await fs.mkdir(runOutputRoot, { recursive: false });
  await fs.mkdir(path.join(runOutputRoot, 'screenshots'), { recursive: true });
  const startedAt = new Date().toISOString();
  const variants = [
    { label: 'baseline-cbdddc', source: baselineShellSource, css: baselineShellCss },
    { label: 'candidate-host-repair', source: candidateShellSource, css: candidateShellCss },
  ];
  let server;
  let browser;
  let activeVariant;
  try {
    server = http.createServer((request, response) => {
      const match = String(request.url || '').match(/^\/tools\/([^/?]+)/);
      const route = ROUTES.find((candidate) => candidate.slug === (match && match[1]));
      if (!route) {
        response.writeHead(404);
        response.end('not found');
        return;
      }
      assert.ok(activeVariant, 'fixture variant is not selected');
      response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      response.end(fixtureMarkup(route, activeVariant.css, resizeSource, activeVariant.source));
    });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    const serverPort = typeof address === 'object' && address ? address.port : 0;
    assert.ok(serverPort, 'fixture server did not receive a port');
    browser = await chromium.launch({ headless: true });
    activeBrowsers.add(browser);
    const receipts = new Map();
    for (const variant of variants) {
      activeVariant = variant;
      receipts.set(variant.label, await runVariant({ runId, runOutputRoot, startedAt, activeVariant, serverPort, browser }));
    }
    const baselineReceipt = receipts.get('baseline-cbdddc');
    const candidateReceipt = receipts.get('candidate-host-repair');
    assert.ok(baselineReceipt && candidateReceipt, 'variant receipt missing');
    const comparison = buildComparison({ runId, startedAt, completedAt: new Date().toISOString(), baselineReceipt, candidateReceipt });
    await writeJsonAtomic(path.join(runOutputRoot, 'candidate-host-repair-receipt.json'), candidateReceipt);
    await writeJsonAtomic(path.join(runOutputRoot, 'comparison-receipt.json'), comparison);
    await writeJsonAtomic(path.join(runOutputRoot, 'run-checkpoint.json'), {
      runId,
      startedAt,
      completedAt: comparison.completedAt,
      status: comparison.ok ? 'PASS' : 'FAIL',
      runMode: SMOKE_ONLY ? 'smoke' : 'full',
      expectedComparisonScenarioCount: ROUTE_SCHEMA.expectedComparisonScenarioCount,
      actualComparisonScenarioCount: comparison.scenarioCountGuard.actualPerComparison,
      wrapperMatchGuard: comparison.wrapperMatchGuard,
      comparison: 'comparison-receipt.json',
      baseline: 'baseline-cbdddc-receipt.json',
      candidate: 'candidate-host-repair-receipt.json',
    });
    return { runId, startedAt, completedAt: comparison.completedAt, ok: comparison.ok, runOutputRoot, comparison };
  } finally {
    activeBrowsers.delete(browser);
    if (browser) await browser.close().catch(() => {});
    if (server) await new Promise((resolve) => server.close(resolve));
  }
}

async function runWithHardTimeout(promise, label, timeoutMs) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(async () => {
      await Promise.all(Array.from(activeScenarioPages, (page) => page.isClosed() ? Promise.resolve() : page.close().catch(() => {})));
      await Promise.all(Array.from(activeBrowsers, (browser) => browser.close().catch(() => {})));
      reject(new Error(label + ' hard timeout after ' + timeoutMs + 'ms'));
    }, timeoutMs);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  await fs.mkdir(OUTPUT_ROOT, { recursive: true });
  await fs.mkdir(RUNS_ROOT, { recursive: true });
  const lockHandle = await fs.open(LOCK_PATH, 'wx');
  const allRuns = [];
  try {
    await lockHandle.writeFile(JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString(), runnerSha256: SOURCE_METADATA.testRunner.sha256 }) + '\n');
    for (let index = 0; index < RUN_COUNT; index += 1) {
      const runId = new Date().toISOString().replace(/[-:.TZ]/g, '') + '-' + process.pid + '-' + randomUUID().slice(0, 8);
      try {
        allRuns.push(await runWithHardTimeout(runComparison(runId), 'comparison ' + (index + 1), COMPARISON_TIMEOUT_MS));
      } catch (error) {
        allRuns.push({ runId, ok: false, error: error.message });
      }
    }
    const completedAt = new Date().toISOString();
    const latest = {
      updatedAt: completedAt,
      runnerSha256: SOURCE_METADATA.testRunner.sha256,
      runMode: SMOKE_ONLY ? 'smoke' : 'full',
      runCount: RUN_COUNT,
      expectedComparisonScenarioCount: ROUTE_SCHEMA.expectedComparisonScenarioCount,
      allPass: allRuns.length === RUN_COUNT && allRuns.every((run) => run.ok === true),
      runs: allRuns.map((run) => ({
        runId: run.runId,
        ok: run.ok,
        comparison: run.runOutputRoot ? path.relative(WORKSPACE_ROOT, path.join(run.runOutputRoot, 'comparison-receipt.json')) : null,
        error: run.error || null,
      })),
    };
    await writeJsonAtomic(LATEST_POINTER_PATH, latest);
    console.log(JSON.stringify({ ok: latest.allPass, runCount: RUN_COUNT, runs: latest.runs, latestPointer: path.relative(WORKSPACE_ROOT, LATEST_POINTER_PATH) }, null, 2));
    assert.equal(latest.allPass, true, 'two consecutive clean full comparisons failed');
  } finally {
    await lockHandle.close();
    await fs.unlink(LOCK_PATH).catch(() => {});
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
