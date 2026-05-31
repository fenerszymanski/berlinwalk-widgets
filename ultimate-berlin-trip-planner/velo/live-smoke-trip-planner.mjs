#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_BASE_URL = 'https://www.berlinwalk.com';
const OUTPUT_DIR = 'output/qa/ultimate-trip-planner-live-smoke';

function usage() {
  console.log(`Usage:
  node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --email you@example.com
  node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --live --email you@example.com
  node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --live --email you@example.com --booking

Defaults to dry-run. It prints and records the payloads but does not call Wix
unless --live is present.

Options:
  --email EMAIL       Required for --live. Optional for dry-run.
  --arrival DATE     YYYY-MM-DD. Defaults to 10 days from today.
  --tripLength N     1-7. Defaults to 3.
  --base URL         Defaults to https://www.berlinwalk.com.
  --booking          Also POST /_functions/tripPlannerBooking after lead.
  --live             Actually call the live endpoints.
  --out FILE         Optional result JSON path.
`);
}

function parseArgs(argv) {
  const options = {
    baseUrl: DEFAULT_BASE_URL,
    email: '',
    arrivalDate: '',
    tripLength: 3,
    live: false,
    booking: false,
    outPath: ''
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--live') {
      options.live = true;
    } else if (arg === '--booking') {
      options.booking = true;
    } else if (arg === '--email') {
      options.email = argv[index + 1] || '';
      index += 1;
    } else if (arg === '--arrival') {
      options.arrivalDate = argv[index + 1] || '';
      index += 1;
    } else if (arg === '--tripLength') {
      options.tripLength = Number(argv[index + 1] || 3);
      index += 1;
    } else if (arg === '--base') {
      options.baseUrl = argv[index + 1] || DEFAULT_BASE_URL;
      index += 1;
    } else if (arg === '--out') {
      options.outPath = argv[index + 1] || '';
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function pad2(value) {
  return String(value).padStart(2, '0');
}

function dateKey(date) {
  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`;
}

function addDays(date, days) {
  const next = new Date(date.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

function safeJson(value) {
  return JSON.stringify(value, null, 2);
}

function buildLeadPayload(options) {
  const arrivalDate = options.arrivalDate || dateKey(addDays(new Date(), 10));
  const recommendedTourDate = dateKey(addDays(new Date(`${arrivalDate}T12:00:00Z`), 1));

  return {
    email: options.email || `ultimate-planner-smoke+${Date.now()}@example.com`,
    arrivalDate,
    tripLength: Math.max(1, Math.min(7, Math.round(options.tripLength || 3))),
    arrivalTime: 'Late morning / midday',
    arrivalPoint: 'BER Airport',
    stayArea: 'Mitte / Alexanderplatz',
    groupType: 'Solo or couple',
    firstTime: 'First time in Berlin',
    interests: 'History, Berlin Wall, food, museums',
    budgetStyle: 'Smart / mixed budget',
    mustHandle: 'Weather, Sunday/Monday rules, transport tickets',
    pace: 'Balanced',
    tourIntent: 'Interested in BerlinWalk',
    tripStyle: 'Classic first trip',
    planTitle: 'Smoke test Ultimate Berlin trip plan',
    recommendedTourDay: `Best tour fit: Day 2 (${recommendedTourDate}) at 11:30`,
    recommendedTourDate,
    recommendedTourTime: '11:30-13:30',
    meetingPointUrl: 'https://www.google.com/maps/search/?api=1&query=Weltzeituhr%20Alexanderplatz%20Berlin',
    ticket: 'BER arrival usually needs an ABC ticket before boarding.',
    weatherTitle: 'Smoke-test weather summary',
    travelMode: 'Now: get central. Next: keep the first route simple. Later: save the World Clock map.',
    planHealth: 'Ready: route shape, ticket note, and tour timing are present.',
    preArrivalChecklist: 'Save the plan link, check ticket zone, save meeting point, keep one weather fallback.',
    baseBrief: 'Base camp: Mitte gives the cleanest first-route start and late return.',
    budgetPulse: 'Budget: mix free sights with one paid anchor, keep cash for tips and small stops.',
    interestLens: 'History and Wall interests are mapped to central history and East Berlin days.',
    paceGuard: 'Balanced pace: one main area per day, one optional extra, protected food break.',
    weatherStrategy: 'Use live weather close to arrival and monthly fallback for later dates.',
    carryPack: 'Exact link, overview map, tour hold, and PDF backup are ready.',
    reservationRadar: 'Book the tour first, check timed museum entries, keep arrival errands light.',
    planAdvice: 'Smart fix: avoid scattering the first day across too many areas.',
    planSwaps: 'Swap: if rain hits, move one museum or covered market into the same area.',
    dayRhythm: 'Day 1 light, Day 2 story/tour, Day 3 Wall and East Berlin.',
    dayIntelligence: 'Route, energy, spend, and check chips present for every day.',
    dayOperations: 'Start, transit, reserve, and backup notes present for every day.',
    arrivalWindow: 'future_planning',
    tripRisk: 'low',
    tourRecommendation: 'Book the free walking tour early in the trip',
    intentStage: 'sales_ready',
    familyOrSlow: 'no',
    bookAheadNeeded: 'yes',
    conversionSignal: '75/100 - sales-ready planner lead; next action: book or hold the tour',
    conversionScore: 75,
    conversionTier: 'warm_tour_lead',
    conversionNextAction: 'Book or hold the tour before arrival',
    conversionReasons: 'arrival date known, tour early in trip, first-time route shape',
    source: 'codex_live_smoke',
    page: 'https://www.berlinwalk.com/tools/ultimate-berlin-trip-planner?source=codex_live_smoke',
    consent: true
  };
}

function buildBookingPayload(leadPayload) {
  return {
    email: leadPayload.email,
    arrivalDate: leadPayload.arrivalDate,
    bookingId: `codex-smoke-${Date.now()}`,
    tourDate: leadPayload.recommendedTourDate || leadPayload.arrivalDate,
    bookingStatus: 'booked',
    source: 'codex_live_smoke'
  };
}

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch (error) {
    body = { parseError: error.message, text };
  }

  return {
    url,
    status: response.status,
    ok: response.ok,
    body
  };
}

function assertResult(name, result, extraCheck) {
  if (!result.ok) throw new Error(`${name} HTTP ${result.status}`);
  if (!result.body || result.body.ok !== true) throw new Error(`${name} response body did not include ok:true`);
  if (extraCheck) extraCheck(result.body);
}

function outputPath(options) {
  if (options.outPath) return path.resolve(process.cwd(), options.outPath);
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  return path.resolve(process.cwd(), OUTPUT_DIR, `${options.live ? 'live' : 'dry-run'}-${stamp}.json`);
}

function writeResult(options, result) {
  const outPath = outputPath(options);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, safeJson(result) + '\n');
  return outPath;
}

async function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    usage();
    process.exitCode = 1;
    return;
  }

  if (options.help) {
    usage();
    return;
  }

  if (options.live && !validEmail(options.email)) {
    console.error('--live requires a real --email address so the instant email can be checked.');
    process.exitCode = 1;
    return;
  }

  if (options.arrivalDate && !/^\d{4}-\d{2}-\d{2}$/.test(options.arrivalDate)) {
    console.error('--arrival must be YYYY-MM-DD.');
    process.exitCode = 1;
    return;
  }

  const leadPayload = buildLeadPayload(options);
  const bookingPayload = buildBookingPayload(leadPayload);
  const baseUrl = String(options.baseUrl || DEFAULT_BASE_URL).replace(/\/$/, '');
  const result = {
    mode: options.live ? 'live' : 'dry-run',
    generatedAt: new Date().toISOString(),
    baseUrl,
    leadPayload,
    bookingPayload: options.booking ? bookingPayload : null,
    responses: {}
  };

  if (!options.live) {
    const outPath = writeResult(options, result);
    console.log('DRY RUN: no network calls made.');
    console.log(`Lead endpoint: ${baseUrl}/_functions/tripPlannerLead`);
    if (options.booking) console.log(`Booking endpoint: ${baseUrl}/_functions/tripPlannerBooking`);
    console.log(`Result written to ${path.relative(process.cwd(), outPath)}`);
    return;
  }

  result.responses.lead = await postJson(`${baseUrl}/_functions/tripPlannerLead`, leadPayload);
  assertResult('tripPlannerLead', result.responses.lead, (body) => {
    if (!body.leadId) throw new Error('tripPlannerLead response missing leadId');
  });

  if (options.booking) {
    result.responses.booking = await postJson(`${baseUrl}/_functions/tripPlannerBooking`, bookingPayload);
    assertResult('tripPlannerBooking', result.responses.booking, (body) => {
      if (!Number.isFinite(Number(body.matched))) throw new Error('tripPlannerBooking response missing matched count');
    });
  }

  const outPath = writeResult(options, result);
  console.log(`LIVE OK: tripPlannerLead${options.booking ? ' + tripPlannerBooking' : ''}`);
  console.log(`Result written to ${path.relative(process.cwd(), outPath)}`);
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exitCode = 1;
});
