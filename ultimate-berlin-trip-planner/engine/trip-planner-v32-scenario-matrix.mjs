#!/usr/bin/env node

import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, '..', '..');
const OUTPUT_DIR = path.join(REPO_ROOT, 'output', 'qa', 'trip-planner-v32-matrix-20260721');
const MANIFEST_PATH = path.join(OUTPUT_DIR, 'scenario-manifest.json');
const RESULTS_PATH = path.join(OUTPUT_DIR, 'results.json');
const SUMMARY_PATH = path.join(OUTPUT_DIR, 'summary.md');
const HUMAN_PATH = path.join(OUTPUT_DIR, 'human-review-manifest.md');
const RAW_LOG_PATH = path.join(OUTPUT_DIR, 'playwright-cli.log');
const BROWSER_HARNESS = path.join(HERE, 'trip-planner-v32-scenario-matrix.browser.js');
const PWCLI = process.env.PWCLI || path.join(os.homedir(), '.codex', 'skills', 'playwright', 'scripts', 'playwright_cli.sh');
const TARGET_SCENARIOS = 72;
const WEATHER_GENERATED_AT = '2026-07-21T12:00:00.000Z';

const DIMENSIONS = {
  tripLength: [1, 2, 3, 4, 5, 6, 7],
  arrivalTime: ['morning', 'afternoon', 'evening'],
  arrivalPoint: ['ber', 'hbf', 'hotel'],
  stayArea: ['mitte', 'east', 'west', 'north'],
  groupType: ['solo', 'couple', 'family'],
  pace: ['gentle', 'balanced', 'packed'],
  calendar: ['weekday', 'monday', 'sunday'],
  weatherMode: ['live', 'rain', 'typical'],
  tourIntent: ['considering', 'booked', 'maybe']
};

const FIXED_ROWS = [
  { key: 'monday-museum', tripLength: 1, arrivalTime: 'morning', arrivalPoint: 'hotel', stayArea: 'mitte', groupType: 'couple', pace: 'balanced', calendar: 'monday', weatherMode: 'live', tourIntent: 'maybe', profile: 'museums' },
  { key: 'sunday-family-rain', tripLength: 3, arrivalTime: 'morning', arrivalPoint: 'ber', stayArea: 'north', groupType: 'family', pace: 'gentle', calendar: 'sunday', weatherMode: 'rain', tourIntent: 'considering', profile: 'family' },
  { key: 'potsdam-four-day', tripLength: 4, arrivalTime: 'morning', arrivalPoint: 'hbf', stayArea: 'west', groupType: 'solo', pace: 'balanced', calendar: 'weekday', weatherMode: 'typical', tourIntent: 'maybe', profile: 'potsdam', expectPotsdam: true },
  { key: 'potsdam-seven-day', tripLength: 7, arrivalTime: 'afternoon', arrivalPoint: 'hotel', stayArea: 'mitte', groupType: 'couple', pace: 'packed', calendar: 'weekday', weatherMode: 'live', tourIntent: 'considering', profile: 'potsdam', expectPotsdam: true },
  { key: 'evening-next-tour', tripLength: 2, arrivalTime: 'evening', arrivalPoint: 'ber', stayArea: 'east', groupType: 'solo', pace: 'balanced', calendar: 'weekday', weatherMode: 'live', tourIntent: 'considering', profile: 'history' },
  { key: 'booked-tour-path', tripLength: 5, arrivalTime: 'morning', arrivalPoint: 'hotel', stayArea: 'mitte', groupType: 'couple', pace: 'balanced', calendar: 'weekday', weatherMode: 'rain', tourIntent: 'booked', profile: 'history' },
  { key: 'west-slow-typical', tripLength: 6, arrivalTime: 'afternoon', arrivalPoint: 'hbf', stayArea: 'west', groupType: 'family', pace: 'gentle', calendar: 'monday', weatherMode: 'typical', tourIntent: 'maybe', profile: 'free' },
  { key: 'east-nightlife-packed', tripLength: 5, arrivalTime: 'afternoon', arrivalPoint: 'hotel', stayArea: 'east', groupType: 'couple', pace: 'packed', calendar: 'sunday', weatherMode: 'live', tourIntent: 'considering', profile: 'nightlife' },
  { key: 'north-museum-rain', tripLength: 4, arrivalTime: 'morning', arrivalPoint: 'ber', stayArea: 'north', groupType: 'family', pace: 'gentle', calendar: 'weekday', weatherMode: 'rain', tourIntent: 'maybe', profile: 'museums' },
  { key: 'one-day-evening', tripLength: 1, arrivalTime: 'evening', arrivalPoint: 'hbf', stayArea: 'mitte', groupType: 'solo', pace: 'packed', calendar: 'sunday', weatherMode: 'typical', tourIntent: 'booked', profile: 'food' },
  { key: 'ber-live-balanced', arrivalDate: '2026-08-04', tripLength: 3, arrivalTime: 'morning', arrivalPoint: 'ber', stayArea: 'mitte', groupType: 'solo', pace: 'balanced', calendar: 'weekday', weatherMode: 'live', tourIntent: 'considering', profile: 'history' },
  { key: 'hotel-free-rain', tripLength: 7, arrivalTime: 'afternoon', arrivalPoint: 'hotel', stayArea: 'east', groupType: 'family', pace: 'gentle', calendar: 'monday', weatherMode: 'rain', tourIntent: 'maybe', profile: 'free' }
];

const HUMAN_REVIEW = [
  ['monday-museum', 'Monday opening logic, primary venue status, and the named indoor Plan B.'],
  ['sunday-family-rain', 'Sunday closures, family pace, rain swap, and realistic breaks.'],
  ['potsdam-four-day', 'Berlin Hbf to Potsdam Hbf outbound/return chain and the separated palace, park, and meal stops.'],
  ['potsdam-seven-day', 'Potsdam placement inside a dense seven-day plan and return before the evening.'],
  ['evening-next-tour', 'Quiet arrival night followed by the first valid 11:30 or 15:30 tour slot.'],
  ['booked-tour-path', 'Booked-tour language contains preparation, not another sales recommendation.'],
  ['west-slow-typical', 'West Berlin geography, gentle pace, and typical-weather honesty.'],
  ['east-nightlife-packed', 'Nightlife energy protection and no unnecessary next-morning overload.'],
  ['north-museum-rain', 'Prenzlauer Berg base, family transfers, museum opening logic, and rain backup.'],
  ['one-day-evening', 'A one-day evening arrival does not invent a full sightseeing day.'],
  ['ber-live-balanced', 'BER arrival transfer, luggage step, tour timing, and live weather timestamp.'],
  ['hotel-free-rain', 'Seven-day route diversity, free-place logic, meal placement, and repeated-stop scan.']
];

function cartesian(dimensions) {
  const keys = Object.keys(dimensions);
  const rows = [];
  const visit = (index, row) => {
    if (index === keys.length) {
      rows.push({ ...row });
      return;
    }
    const key = keys[index];
    dimensions[key].forEach((value) => visit(index + 1, { ...row, [key]: value }));
  };
  visit(0, {});
  return rows;
}

function valueToken(value) {
  return typeof value === 'number' ? String(value) : value;
}

function rowKey(row) {
  return Object.keys(DIMENSIONS).map((key) => `${key}=${valueToken(row[key])}`).join('|');
}

function pairKeys(row) {
  const keys = Object.keys(DIMENSIONS);
  const pairs = [];
  for (let first = 0; first < keys.length; first += 1) {
    for (let second = first + 1; second < keys.length; second += 1) {
      const a = keys[first];
      const b = keys[second];
      pairs.push(`${a}=${valueToken(row[a])}::${b}=${valueToken(row[b])}`);
    }
  }
  return pairs;
}

function requiredPairs() {
  const keys = Object.keys(DIMENSIONS);
  const pairs = new Set();
  for (let first = 0; first < keys.length; first += 1) {
    for (let second = first + 1; second < keys.length; second += 1) {
      const a = keys[first];
      const b = keys[second];
      DIMENSIONS[a].forEach((aValue) => DIMENSIONS[b].forEach((bValue) => {
        pairs.add(`${a}=${valueToken(aValue)}::${b}=${valueToken(bValue)}`);
      }));
    }
  }
  return pairs;
}

function stableHash(value) {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function selectRows() {
  const all = cartesian(DIMENSIONS);
  const selected = FIXED_ROWS.map((row) => ({ ...row }));
  const selectedKeys = new Set(selected.map(rowKey));
  const uncovered = requiredPairs();
  selected.forEach((row) => pairKeys(row).forEach((pair) => uncovered.delete(pair)));

  while (uncovered.size && selected.length < TARGET_SCENARIOS) {
    let best = null;
    let bestScore = -1;
    let bestHash = Infinity;
    for (const row of all) {
      const key = rowKey(row);
      if (selectedKeys.has(key)) continue;
      let score = 0;
      pairKeys(row).forEach((pair) => { if (uncovered.has(pair)) score += 1; });
      const hash = stableHash(key);
      if (score > bestScore || (score === bestScore && hash < bestHash)) {
        best = row;
        bestScore = score;
        bestHash = hash;
      }
    }
    if (!best || bestScore <= 0) break;
    selected.push({ ...best });
    selectedKeys.add(rowKey(best));
    pairKeys(best).forEach((pair) => uncovered.delete(pair));
  }

  const remaining = all
    .filter((row) => !selectedKeys.has(rowKey(row)))
    .sort((first, second) => stableHash(rowKey(first)) - stableHash(rowKey(second)));
  for (const row of remaining) {
    if (selected.length >= TARGET_SCENARIOS) break;
    selected.push({ ...row });
    selectedKeys.add(rowKey(row));
  }

  const required = requiredPairs();
  const covered = new Set();
  selected.forEach((row) => pairKeys(row).forEach((pair) => covered.add(pair)));
  const missing = [...required].filter((pair) => !covered.has(pair));
  return {
    rows: selected,
    coverage: {
      strategy: 'risk-based fixed cases plus deterministic pairwise set cover',
      dimensions: Object.fromEntries(Object.entries(DIMENSIONS).map(([key, values]) => [key, values.slice()])),
      requiredPairs: required.size,
      coveredPairs: required.size - missing.length,
      missingPairs: missing,
      percent: Number((((required.size - missing.length) / required.size) * 100).toFixed(2))
    }
  };
}

function dateFor(calendar) {
  if (calendar === 'monday') return '2026-09-07';
  if (calendar === 'sunday') return '2026-09-13';
  return '2026-09-15';
}

function addDays(dateKey, amount) {
  const date = new Date(`${dateKey}T12:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

function weatherDay(dateKey, mode) {
  if (mode === 'typical') {
    return {
      dateKey,
      mode: 'Monthly average',
      kind: 'typical',
      isForecast: false,
      source: 'berlin-monthly-climate',
      checkedAt: '',
      reason: 'outside_live_window',
      highC: 20,
      lowC: 11,
      rainProbability: 30,
      precipitationMm: null,
      windKmh: null,
      weatherCode: null,
      title: 'Typical September conditions, 20 C high',
      cue: 'Not a forecast. Use this for packing, then check live weather closer to arrival.'
    };
  }
  const rainy = mode === 'rain';
  return {
    dateKey,
    mode: 'Live forecast',
    kind: 'live',
    isForecast: true,
    source: 'open-meteo',
    checkedAt: WEATHER_GENERATED_AT,
    reason: 'inside_live_window',
    highC: rainy ? 16 : 22,
    lowC: rainy ? 12 : 14,
    rainProbability: rainy ? 82 : 18,
    precipitationMm: rainy ? 5.2 : 0.1,
    windKmh: rainy ? 18 : 12,
    weatherCode: rainy ? 63 : 1,
    title: rainy ? 'Rain likely, 16 C' : 'Mainly clear, 22 C',
    cue: rainy
      ? 'Take a rain jacket and waterproof shoes. Use the indoor backup if the rain continues.'
      : 'Good walking rhythm: one light layer is usually enough.'
  };
}

function profileFor(row, index) {
  if (row.profile) return row.profile;
  return ['history', 'museums', 'food', 'free', 'nightlife', 'history'][index % 6];
}

function scenarioFor(row, index) {
  const arrivalDate = row.arrivalDate || dateFor(row.calendar);
  let profile = profileFor(row, index);
  if (profile === 'potsdam' && (row.tripLength < 4 || row.arrivalTime === 'evening')) profile = 'history';
  const profileInterests = {
    history: ['history', 'wall'],
    museums: ['museums', 'history'],
    food: ['food', 'history'],
    free: ['free', 'history'],
    nightlife: ['food', 'nightlife', 'wall'],
    family: ['history', 'free'],
    potsdam: ['potsdam', 'history']
  };
  const interests = profileInterests[profile] || profileInterests.history;
  const mustHandle = ['rain'];
  if (profile === 'museums') mustHandle.push('reservations');
  if (row.groupType === 'family') mustHandle.push('kids');
  const dailyWeather = {};
  for (let dayIndex = 0; dayIndex < row.tripLength; dayIndex += 1) {
    const dateKey = addDays(arrivalDate, dayIndex);
    dailyWeather[dateKey] = weatherDay(dateKey, row.weatherMode);
  }
  const fixedKey = row.key || '';
  const id = fixedKey || `matrix-${String(index + 1).padStart(3, '0')}`;
  return {
    id,
    title: fixedKey ? fixedKey.replace(/-/g, ' ') : `Pairwise scenario ${index + 1}`,
    dimensions: Object.fromEntries(Object.keys(DIMENSIONS).map((key) => [key, row[key]])),
    profile,
    weatherMode: row.weatherMode,
    weatherGeneratedAt: WEATHER_GENERATED_AT,
    dailyWeather,
    input: {
      arrivalDate,
      tripLength: row.tripLength,
      arrivalTime: row.arrivalTime,
      arrivalPoint: row.arrivalPoint,
      stayArea: row.stayArea,
      groupType: row.groupType,
      firstTime: index % 5 === 0 ? 'no' : (index % 3 === 0 ? 'longago' : 'yes'),
      interests,
      budgetStyle: index % 4 === 0 ? 'comfort' : (index % 5 === 0 ? 'low' : 'smart'),
      mustHandle,
      pace: row.pace,
      tourIntent: row.tourIntent
    },
    expect: {
      potsdam: row.expectPotsdam === true
    }
  };
}

function queryFor(scenario) {
  const params = new URLSearchParams({
    qaArtifactV3: '1',
    planAccess: '1',
    date: scenario.input.arrivalDate,
    tripLength: String(scenario.input.tripLength),
    arrivalTime: scenario.input.arrivalTime,
    arrivalPoint: scenario.input.arrivalPoint,
    stayArea: scenario.input.stayArea,
    groupType: scenario.input.groupType,
    firstTime: scenario.input.firstTime,
    interests: scenario.input.interests.join(','),
    budgetStyle: scenario.input.budgetStyle,
    mustHandle: scenario.input.mustHandle.join(','),
    pace: scenario.input.pace,
    tourIntent: scenario.input.tourIntent
  });
  if (scenario.id !== 'ber-live-balanced') params.set('weather', 'off');
  if (scenario.weatherMode === 'rain') params.set('mockRainDays', '1,2');
  return `/ultimate-berlin-trip-planner/?${params}`;
}

function mimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return ({
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.woff2': 'font/woff2'
  })[ext] || 'application/octet-stream';
}

async function staticServer() {
  const server = http.createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url || '/', 'http://127.0.0.1');
      let relative = decodeURIComponent(requestUrl.pathname).replace(/^\/+/, '');
      if (!relative || relative.endsWith('/')) relative += 'index.html';
      const target = path.resolve(REPO_ROOT, relative);
      if (target !== REPO_ROOT && !target.startsWith(`${REPO_ROOT}${path.sep}`)) {
        response.writeHead(403).end('Forbidden');
        return;
      }
      const body = await fs.readFile(target);
      response.writeHead(200, {
        'Content-Type': mimeType(target),
        'Cache-Control': 'no-store'
      });
      response.end(body);
    } catch (error) {
      response.writeHead(error && error.code === 'ENOENT' ? 404 : 500).end('Not found');
    }
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  return server;
}

function runCli(args) {
  return new Promise((resolve) => {
    const child = spawn(PWCLI, args, {
      cwd: REPO_ROOT,
      env: { ...process.env, NO_COLOR: '1' },
      stdio: ['ignore', 'pipe', 'pipe']
    });
    let stdout = '';
    let stderr = '';
    const maxBuffer = 64 * 1024 * 1024;
    const append = (current, chunk) => {
      const next = current + chunk.toString('utf8');
      return next.length > maxBuffer ? next.slice(next.length - maxBuffer) : next;
    };
    child.stdout.on('data', (chunk) => { stdout = append(stdout, chunk); });
    child.stderr.on('data', (chunk) => { stderr = append(stderr, chunk); });
    const timer = setTimeout(() => child.kill('SIGTERM'), 180000);
    child.on('error', (error) => {
      clearTimeout(timer);
      resolve({ status: 1, stdout, stderr: `${stderr}\n${error.message}` });
    });
    child.on('close', (status, signal) => {
      clearTimeout(timer);
      resolve({ status: status == null ? 1 : status, signal, stdout, stderr });
    });
  });
}

function parseCliResult(output) {
  const match = String(output || '').match(/### Result\s*\n([\s\S]*?)\n### Ran Playwright code/);
  if (!match) throw new Error('Playwright CLI did not return a parseable JSON result.');
  return JSON.parse(match[1]);
}

function humanReviewMarkdown(manifest) {
  const lookup = new Map(manifest.scenarios.map((scenario) => [scenario.id, scenario]));
  const lines = [
    '# Trip Planner V3.2 Human Review Manifest',
    '',
    'Status: **PENDING HUMAN REVIEW**',
    '',
    'These 12 cases complement the automated matrix. Review the web result and downloaded PDF from the same scenario. Confirm route sense, plain language, visual hierarchy, and that every named Plan B venue is actually usable on that date.',
    '',
    '| # | Scenario | Review focus | Local preview |',
    '|---:|---|---|---|'
  ];
  HUMAN_REVIEW.forEach(([id, focus], index) => {
    const scenario = lookup.get(id);
    if (!scenario) throw new Error(`Human-review scenario is missing: ${id}`);
    const query = queryFor(scenario).replace(/\|/g, '%7C');
    lines.push(`| ${index + 1} | \`${id}\` | ${focus} | \`http://127.0.0.1:<PORT>${query}\` |`);
  });
  lines.push(
    '',
    'For every case record: `PASS`, `FAIL`, exact day/block, web screenshot, PDF page, and the smallest reproducible input change.',
    '',
    'The automated suite can prove that the primary route does not keep a known closed place. It cannot prove that every place named inside free-text Plan B copy is open, so Monday/Sunday Plan B wording must remain part of this human review.'
  );
  return `${lines.join('\n')}\n`;
}

function summaryMarkdown(manifest, results) {
  const topIssues = Object.entries(results.issueCounts || {}).sort((first, second) => second[1] - first[1]);
  const lines = [
    '# Trip Planner V3.2 Scenario Matrix',
    '',
    `Overall: **${results.status}**`,
    '',
    `- Automated scenarios: ${results.total}`,
    `- Passed: ${results.passed}`,
    `- Failed: ${results.failed}`,
    `- Pairwise coverage: ${manifest.coverage.coveredPairs}/${manifest.coverage.requiredPairs} (${manifest.coverage.percent}%)`,
    '- Human-review cases: 12 (manifest prepared; review remains manual)',
    '- Runtime source: local `index.html` through the exported V2/V3 QA APIs in a real Chromium session',
    '- Pace mapping uses the real runtime values: `gentle` = slow, `balanced` = balanced, `packed` = intense.',
    '',
    '## Machine-checked contracts',
    '',
    '- 1-7 day count, dates, input preservation, schema, validator, idempotence and content-aware PDF pagination.',
    '- Visible block order equals the stored day route; browser, PDF and email delivery snapshots are identical.',
    '- Canonical non-overlapping time ranges, transfer continuity, duration + buffer totals, simple transfer instructions and Google Maps links.',
    '- Duplicate day routes, duplicate blocks, and a meal that returns to an earlier activity place.',
    '- No known closed primary place, non-empty Plan B, valid tour times, and explicit Potsdam outbound/return legs in required cases.',
    '- Live weather timestamps, typical-weather non-forecast wording, rain truth, and PDF/map offline limits.',
    '',
    '## Current gaps'
  ];
  if (!topIssues.length) lines.push('', '- None found by the automated matrix.');
  else {
    lines.push('');
    topIssues.forEach(([code, count]) => lines.push(`- \`${code}\`: ${count} scenario(s)`));
  }
  const validatorIssues = Object.entries(results.artifactValidatorCodeCounts || {}).sort((first, second) => second[1] - first[1]);
  if (validatorIssues.length) {
    lines.push('', '### Artifact validator breakdown', '');
    validatorIssues.forEach(([code, count]) => lines.push(`- \`${code}\`: ${count} occurrence(s)`));
  }
  lines.push(
    '',
    '## Deliberate limitation',
    '',
    'Plan B is stored as free text. The suite verifies that each day has Plan B and that the primary route does not keep a known closed place, but named Plan B alternatives still require the 12-case human review.'
  );
  return `${lines.join('\n')}\n`;
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const selection = selectRows();
  const scenarios = selection.rows.map(scenarioFor);
  const manifest = {
    schemaVersion: '1.0.0',
    generatedAt: new Date().toISOString(),
    target: TARGET_SCENARIOS,
    coverage: selection.coverage,
    scenarios
  };
  await fs.writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  await fs.writeFile(HUMAN_PATH, humanReviewMarkdown(manifest), 'utf8');

  if (scenarios.length < 60) throw new Error(`Scenario target missed: ${scenarios.length} < 60`);
  if (manifest.coverage.percent !== 100) throw new Error(`Pairwise coverage missed: ${manifest.coverage.percent}%`);

  const server = await staticServer();
  const address = server.address();
  const port = address && typeof address === 'object' ? address.port : 0;
  const session = `tp-v32-matrix-${process.pid}`;
  const logs = [];
  let results;

  try {
    const open = await runCli(['--session', session, 'open', `http://127.0.0.1:${port}/ultimate-berlin-trip-planner/?qaArtifactV3=1&weather=off`]);
    logs.push(open.stdout || '', open.stderr || '');
    if (open.status !== 0) throw new Error(`Playwright open failed (${open.status}): ${open.stderr || open.stdout}`);

    const run = await runCli(['--session', session, 'run-code', '--filename', BROWSER_HARNESS]);
    logs.push(run.stdout || '', run.stderr || '');
    if (run.status !== 0) throw new Error(`Playwright matrix failed (${run.status}): ${run.stderr || run.stdout}`);
    results = parseCliResult(run.stdout);
  } finally {
    const close = await runCli(['--session', session, 'close']);
    logs.push(close.stdout || '', close.stderr || '');
    await new Promise((resolve) => server.close(resolve));
    await fs.writeFile(RAW_LOG_PATH, logs.join('\n'), 'utf8');
  }

  await fs.writeFile(RESULTS_PATH, `${JSON.stringify(results, null, 2)}\n`, 'utf8');
  await fs.writeFile(SUMMARY_PATH, summaryMarkdown(manifest, results), 'utf8');

  console.log(`Trip Planner V3.2 matrix: ${results.passed}/${results.total} PASS`);
  console.log(`Pairwise coverage: ${manifest.coverage.coveredPairs}/${manifest.coverage.requiredPairs} (${manifest.coverage.percent}%)`);
  console.log(`Human review manifest: ${HUMAN_REVIEW.length} cases`);
  if (results.failed) {
    Object.entries(results.issueCounts || {})
      .sort((first, second) => second[1] - first[1])
      .forEach(([code, count]) => console.log(`- ${code}: ${count}`));
    process.exitCode = 1;
  }
}

await main();
