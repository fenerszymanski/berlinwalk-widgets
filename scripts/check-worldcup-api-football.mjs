#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const TZ = 'Europe/Berlin';
const ROOT = path.resolve(import.meta.dirname, '..');
const INDEX_HTML = path.join(ROOT, 'worldcup-fixtures', 'index.html');
const API_URL = 'https://v3.football.api-sports.io/fixtures?league=1&season=2026&timezone=Europe%2FBerlin';
const STATUS_URL = 'https://v3.football.api-sports.io/status';
const FINAL_STATUSES = new Set(['FT', 'AET', 'PEN']);

const args = new Set(process.argv.slice(2));
const wantJson = args.has('--json');
const strict = args.has('--strict');
const statusOnly = args.has('--status');

function keyFromKeychain() {
  try {
    return execFileSync('security', [
      'find-generic-password',
      '-a',
      process.env.USER || '',
      '-s',
      'berlinwalk-apisports-api-key',
      '-w',
    ], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

function getApiKey() {
  return (process.env.APISPORTS_API_KEY || keyFromKeychain()).trim();
}

function extractArrayLiteral(source, name) {
  const marker = `var ${name} =`;
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) throw new Error(`Missing ${name} declaration`);
  const start = source.indexOf('[', markerIndex);
  if (start === -1) throw new Error(`Missing ${name} array literal`);

  let depth = 0;
  let quote = '';
  let escaped = false;
  for (let i = start; i < source.length; i += 1) {
    const ch = source[i];
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === quote) {
        quote = '';
      }
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (ch === '[') depth += 1;
    if (ch === ']') {
      depth -= 1;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  throw new Error(`Unclosed ${name} array literal`);
}

function readLocalRows() {
  const source = fs.readFileSync(INDEX_HTML, 'utf8');
  const M = Function(`"use strict"; return (${extractArrayLiteral(source, 'M')});`)();
  const KO = Function(`"use strict"; return (${extractArrayLiteral(source, 'KO')});`)();

  const group = M.map((r, index) => ({
    code: `G${index + 1}`,
    stage: `Group ${r[4]}`,
    date: r[0],
    time: r[1],
    home: r[2],
    away: r[3],
    final: typeof r[5] === 'number' && typeof r[6] === 'number',
    homeGoals: r[5],
    awayGoals: r[6],
    status: r[7] || '',
    penaltyHome: undefined,
    penaltyAway: undefined,
    source: 'M',
  }));

  const knockout = KO.map((r) => ({
    code: r[1],
    stage: r[0],
    date: r[2],
    time: r[3],
    home: r[4],
    away: r[5],
    final: typeof r[10] === 'number' && typeof r[11] === 'number',
    homeGoals: r[10],
    awayGoals: r[11],
    status: r[12] || '',
    penaltyHome: r[13],
    penaltyAway: r[14],
    source: 'KO',
  }));

  return { group, knockout, all: [...group, ...knockout] };
}

function berlinParts(dateLike) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(dateLike));
  const get = (type) => parts.find((part) => part.type === type)?.value;
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    time: `${get('hour')}:${get('minute')}`,
  };
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[.'`]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .toLowerCase();
}

const TEAM_ALIASES = new Map(Object.entries({
  'usa': 'united states',
  'united states of america': 'united states',
  'bosnia herzegovina': 'bosnia and herzegovina',
  'bosnia and herzegovina': 'bosnia and herzegovina',
  'congo dr': 'dr congo',
  'congo d r': 'dr congo',
  'democratic republic of the congo': 'dr congo',
  'cote divoire': 'ivory coast',
  'cote d ivoire': 'ivory coast',
  'ivory coast': 'ivory coast',
  'cape verde islands': 'cape verde',
  'cabo verde': 'cape verde',
  'czech republic': 'czechia',
  'korea republic': 'south korea',
  'republic of korea': 'south korea',
  'iran islamic republic': 'iran',
  'curacao': 'curacao',
  'turkey': 'turkiye',
  'turkiye': 'turkiye',
}));

function teamKey(team) {
  const normalized = normalizeText(team);
  return TEAM_ALIASES.get(normalized) || normalized;
}

function concreteTeam(team) {
  return !/^(winner|loser|tbd|ef|wq|ws|ls)\b/i.test(String(team || '').trim());
}

function orderedPair(row) {
  return `${teamKey(row.home)}__${teamKey(row.away)}`;
}

function unorderedPair(row) {
  return [teamKey(row.home), teamKey(row.away)].sort().join('__');
}

function normalizeStatus(status) {
  return status === 'PEN' ? 'PSO' : status;
}

async function loadApiFixtures(apiKey) {
  const response = await fetch(API_URL, {
    headers: {
      'x-apisports-key': apiKey,
      'accept': 'application/json',
    },
  });
  const quota = {};
  for (const [name, value] of response.headers.entries()) {
    if (/ratelimit|requests/i.test(name)) quota[name] = value;
  }
  if (!response.ok) {
    throw new Error(`API-Football request failed: HTTP ${response.status}`);
  }
  const payload = await response.json();
  if (payload?.errors && Object.keys(payload.errors).length) {
    if (payload.errors.plan) {
      throw new Error(`API-Football plan limit: ${payload.errors.plan}`);
    }
    throw new Error(`API-Football returned errors: ${JSON.stringify(payload.errors)}`);
  }
  return { payload, quota };
}

async function loadApiStatus(apiKey) {
  const response = await fetch(STATUS_URL, {
    headers: {
      'x-apisports-key': apiKey,
      'accept': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`API-Football status request failed: HTTP ${response.status}`);
  }
  const payload = await response.json();
  if (payload?.errors && Object.keys(payload.errors).length) {
    throw new Error(`API-Football status returned errors: ${JSON.stringify(payload.errors)}`);
  }
  return payload.response || {};
}

function mapApiRows(fixtures) {
  return fixtures.map((fixture) => {
    const { date, time } = berlinParts(fixture.fixture.date);
    const short = fixture.fixture.status.short || '';
    return {
      id: fixture.fixture.id,
      stage: fixture.league.round || '',
      date,
      time,
      home: fixture.teams.home.name,
      away: fixture.teams.away.name,
      final: FINAL_STATUSES.has(short),
      homeGoals: fixture.goals.home,
      awayGoals: fixture.goals.away,
      penaltyHome: fixture.score?.penalty?.home,
      penaltyAway: fixture.score?.penalty?.away,
      status: normalizeStatus(short),
      rawStatus: short,
    };
  });
}

function indexApiRows(apiRows) {
  const byOrdered = new Map();
  const byUnordered = new Map();
  for (const row of apiRows) {
    const ordered = orderedPair(row);
    const unordered = unorderedPair(row);
    byOrdered.set(ordered, [...(byOrdered.get(ordered) || []), row]);
    byUnordered.set(unordered, [...(byUnordered.get(unordered) || []), row]);
  }
  return { byOrdered, byUnordered };
}

function bestApiMatch(local, index) {
  const orderedCandidates = index.byOrdered.get(orderedPair(local)) || [];
  const unorderedCandidates = index.byUnordered.get(unorderedPair(local)) || [];
  const candidates = orderedCandidates.length ? orderedCandidates : unorderedCandidates;
  if (!candidates.length) return null;
  return candidates.find((row) => row.date === local.date) || candidates[0];
}

function sameScore(local, api) {
  if (local.homeGoals !== api.homeGoals || local.awayGoals !== api.awayGoals) return false;
  if (local.status === 'PSO') {
    return local.penaltyHome === api.penaltyHome && local.penaltyAway === api.penaltyAway;
  }
  return true;
}

function audit(localRows, apiRows) {
  const index = indexApiRows(apiRows);
  const localConcrete = localRows.all.filter((row) => concreteTeam(row.home) && concreteTeam(row.away));
  const missingApiMatch = [];
  const timeMismatches = [];
  const scoreMismatches = [];
  const missingFinals = [];

  for (const local of localConcrete) {
    const api = bestApiMatch(local, index);
    if (!api) {
      missingApiMatch.push(local);
      continue;
    }
    if (api.date !== local.date || api.time !== local.time) {
      timeMismatches.push({ local, api });
    }
    if (api.final && !local.final) {
      missingFinals.push({ local, api });
      continue;
    }
    if (api.final && local.final && !sameScore(local, api)) {
      scoreMismatches.push({ local, api });
    }
  }

  return { missingApiMatch, timeMismatches, scoreMismatches, missingFinals };
}

function summarizeList(items, formatter, limit = 20) {
  const lines = items.slice(0, limit).map(formatter);
  if (items.length > limit) lines.push(`... ${items.length - limit} more`);
  return lines;
}

function textReport(report) {
  const { payload, quota, apiRows, localRows, auditResult } = report;
  const scoredGroup = localRows.group.filter((row) => row.final).length;
  const scoredKo = localRows.knockout.filter((row) => row.final).length;
  const apiFinals = apiRows.filter((row) => row.final).length;
  const lines = [];
  lines.push('API-Football World Cup audit');
  lines.push(`Endpoint: fixtures?league=1&season=2026&timezone=${TZ}`);
  lines.push(`API fixtures: ${payload.results}; API finals: ${apiFinals}`);
  lines.push(`Local scored fixtures: M ${scoredGroup}/${localRows.group.length}, KO ${scoredKo}/${localRows.knockout.length}`);
  if (Object.keys(quota).length) lines.push(`Quota headers: ${JSON.stringify(quota)}`);
  lines.push(`Missing final scores locally: ${auditResult.missingFinals.length}`);
  for (const line of summarizeList(auditResult.missingFinals, ({ local, api }) =>
    `  - ${local.code}: ${local.home} ${api.homeGoals}-${api.awayGoals} ${local.away} (${api.status || api.rawStatus}, ${api.date} ${api.time})`
  )) lines.push(line);
  lines.push(`Score mismatches: ${auditResult.scoreMismatches.length}`);
  for (const line of summarizeList(auditResult.scoreMismatches, ({ local, api }) =>
    `  - ${local.code}: local ${local.home} ${local.homeGoals}-${local.awayGoals} ${local.away} (${local.status || 'n/a'}), API ${api.home} ${api.homeGoals}-${api.awayGoals} ${api.away} (${api.status || api.rawStatus})`
  )) lines.push(line);
  lines.push(`Kick-off/team date mismatches: ${auditResult.timeMismatches.length}`);
  for (const line of summarizeList(auditResult.timeMismatches, ({ local, api }) =>
    `  - ${local.code}: local ${local.home} vs ${local.away} ${local.date} ${local.time}; API ${api.home} vs ${api.away} ${api.date} ${api.time}`
  )) lines.push(line);
  lines.push(`Local concrete fixtures not found in API response: ${auditResult.missingApiMatch.length}`);
  for (const line of summarizeList(auditResult.missingApiMatch, (local) =>
    `  - ${local.code}: ${local.home} vs ${local.away} (${local.date} ${local.time})`
  )) lines.push(line);
  return `${lines.join('\n')}\n`;
}

async function main() {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Missing APISPORTS_API_KEY. Run: source ../scripts/load-api-keys.sh');
  }
  if (statusOnly) {
    const status = await loadApiStatus(apiKey);
    const response = {
      plan: status.subscription?.plan || '',
      active: Boolean(status.subscription?.active),
      currentRequests: status.requests?.current,
      dailyLimit: status.requests?.limit_day,
      subscriptionEnd: status.subscription?.end || '',
    };
    if (wantJson) {
      console.log(JSON.stringify(response, null, 2));
    } else {
      console.log('API-Football account status');
      console.log(`Plan: ${response.plan}`);
      console.log(`Active: ${response.active}`);
      console.log(`Requests today: ${response.currentRequests}/${response.dailyLimit}`);
      console.log(`Subscription end: ${response.subscriptionEnd}`);
    }
    return;
  }
  const localRows = readLocalRows();
  const { payload, quota } = await loadApiFixtures(apiKey);
  const apiRows = mapApiRows(payload.response || []);
  const auditResult = audit(localRows, apiRows);
  const report = { payload: { results: payload.results }, quota, apiRows, localRows, auditResult };

  if (wantJson) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    process.stdout.write(textReport(report));
  }

  const hasStrictFindings = auditResult.missingFinals.length ||
    auditResult.scoreMismatches.length ||
    auditResult.timeMismatches.length ||
    auditResult.missingApiMatch.length;
  if (strict && hasStrictFindings) process.exitCode = 2;
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
