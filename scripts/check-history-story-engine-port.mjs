#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_COMMIT = '2eee9c45d3da46946e872c8b8cf96500bcc5e52f';
const SOURCE_BLOB_SHA256 = '8e737b380981d6708ad7b50cbd91beaa5f14b4b82216a10d628fbe6dbf65be7d';
const SEED_COMMIT = '94ba03f2e4ca69e9f969298752b5414b956751fd';
const WALL_RUNTIME_PATH = 'berlin-wall-timeline/wall-timeline-element.js';
const STORY_RUNTIME_PATH = 'berlin-history-story/history-story-element.js';

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function gitShow(revision, path) {
  return execFileSync('git', ['show', revision + ':' + path], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function gitPasses(args) {
  try {
    execFileSync('git', args, { cwd: ROOT, stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function gitText(args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function count(value, needle) {
  return value.split(needle).length - 1;
}

try {
  const source = gitShow(SOURCE_COMMIT, WALL_RUNTIME_PATH);
  const seed = gitShow(SEED_COMMIT, STORY_RUNTIME_PATH);
  const runtime = gitShow('HEAD', STORY_RUNTIME_PATH);
  const mapData = JSON.parse(gitShow('HEAD', 'berlin-history-story/assets/map/map-data.json'));

  assert(sha256(source) === SOURCE_BLOB_SHA256, 'The recorded Wall source SHA-256 does not match its source commit.');
  assert(sha256(seed) === sha256(source), 'The private seed commit is not byte-identical to the recorded Wall source.');
  assert(gitPasses(['merge-base', '--is-ancestor', SEED_COMMIT, 'HEAD']), 'The byte-identical seed is not an ancestor of HEAD.');
  assert(gitPasses(['diff', '--quiet', 'HEAD', '--', STORY_RUNTIME_PATH]), 'Runtime has uncommitted changes; commit the data-swap before asserting it.');
  assert(gitPasses(['diff', '--quiet', 'HEAD', '--', 'berlin-history-story/assets/map/map-data.json']), 'Map package has uncommitted changes; commit it before asserting it.');

  const orderedMethods = [
    'connectedCallback()',
    'disconnectedCallback()',
    '    _render()',
    '    _wire()',
    '    _svg(',
    '    _loadRealMap()',
    '    _buildRealMap(data)',
    '    _camera(',
    '    _yearFor(',
    '    _update()',
  ];
  let previousIndex = -1;
  orderedMethods.forEach((token) => {
    const index = runtime.indexOf(token, previousIndex + 1);
    assert(index > previousIndex, 'Ported runtime is missing or reorders core method: ' + token);
    previousIndex = index;
  });

  const dictatorshipStart = runtime.indexOf("key: 'dictatorship'");
  const sectorsStart = runtime.indexOf("key: 'sectors'", dictatorshipStart + 1);
  assert(dictatorshipStart >= 0 && sectorsStart > dictatorshipStart, 'Cannot isolate the Dictatorship chapter data.');
  assert(!runtime.slice(dictatorshipStart, sectorsStart).includes('BOOK_URL'), 'The Dictatorship chapter must not contain a sales CTA.');

  const forbidden = ['bw-wt', 'bwwt', 'BWWallTimeline', 'AUDIO_URL', 'death-strip-audio-route', 'e75629a8-15bc-40de-b8e7-a9e24a8ffc55'];
  forbidden.forEach((needle) => assert(!runtime.includes(needle), 'Forbidden inherited runtime identity: ' + needle));
  assert(count(runtime, 'berlin-wall-timeline') === 1, 'Only the Wall chapter deep link may retain the Wall Timeline slug.');
  assert(count(runtime, "key: '") === 12, 'History Story must contain exactly twelve chapter records.');
  assert(count(runtime, '<h1') === 1, 'History Story must render exactly one H1.');
  assert(runtime.includes('function cover()') && runtime.includes('id="bw-hs-cover-title"') && runtime.includes('href="#bw-hs-story-start"'), 'History Story must keep its unnumbered cover and native scrolly anchor outside the chapter records.');
  assert(runtime.includes('assets/photos/berlin-coelln-plan-1652-hero.jpg') && runtime.includes('fetchpriority="high"'), 'History Story cover must use the real optimized 1652-plan derivative as its eager archive window.');
  assert(count(runtime, 'Book my Free Berlin Walking Tour') === 1, 'History Story must render exactly one final Free Tour CTA.');
  assert(['Alexanderplatz', '2 hours', '11 stops, 16 places and about 3 km', 'does not follow the Berlin Wall line'].every((value) => runtime.includes(value)), 'Final tour facts are incomplete.');
  assert(runtime.includes('new IntersectionObserver') && runtime.includes("position = 'fixed'") && runtime.includes("position = 'absolute'"), 'Scroll observer or sticky-stage core is missing.');
  assert(runtime.includes("fetch(BASE_URL + 'assets/map/map-data.json'") && runtime.includes("data-map-state', 'fallback'"), 'Map loader/fallback core is missing.');
  assert(runtime.includes('prefers-reduced-motion: reduce') && runtime.includes('#bwqa=<scrollY>'), 'Reduced-motion base or QA hook is missing.');
  assert(mapData.version === 'berlin-history-story-map-v1', 'Map package still carries the old Wall Timeline version identity.');

  console.log(JSON.stringify({
    status: 'PASS',
    verifiedHead: gitText(['rev-parse', 'HEAD']),
    sourceCommit: SOURCE_COMMIT,
    seedCommit: SEED_COMMIT,
    sourceSha256: sha256(source),
    seedSha256: sha256(seed),
    chapters: 12,
    mapVersion: mapData.version,
  }, null, 2));
} catch (error) {
  console.error('FAIL:', error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
