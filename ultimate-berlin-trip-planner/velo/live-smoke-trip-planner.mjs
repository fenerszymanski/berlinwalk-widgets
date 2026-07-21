#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_BASE_URL = 'https://www.berlinwalk.com';
const BRANDED_PLANNER_URL = 'https://www.berlinwalk.com/berlin-trip-planner';
const OUTPUT_DIR = 'output/qa/ultimate-trip-planner-live-smoke';

function usage() {
  console.log(`Usage:
  node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --email you@example.com
  node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --live --email you@example.com
  node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --live --email you@example.com --booking
  node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --live --ai-only

Defaults to dry-run. It prints and records the payloads but does not call Wix
unless --live is present.

Options:
  --email EMAIL       Required for --live. Optional for dry-run.
  --arrival DATE     YYYY-MM-DD. Defaults to 10 days from today.
  --tripLength N     1-7. Defaults to 3.
  --base URL         Defaults to https://www.berlinwalk.com.
  --booking          Also POST /_functions/tripPlannerBooking after lead.
  --ai               Also verify that the legacy /_functions/tripPlannerAi endpoint returns 410 ai_disabled.
  --ai-only          Only verify the legacy AI-disabled response; no lead, email, or booking write.
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
    ai: false,
    aiOnly: false,
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
    } else if (arg === '--ai') {
      options.ai = true;
    } else if (arg === '--ai-only') {
      options.ai = true;
      options.aiOnly = true;
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

function buildPlannerPageUrl(options, arrivalDate, tripLength) {
  const url = new URL(BRANDED_PLANNER_URL);
  url.searchParams.set('context', 'tool');
  url.searchParams.set('date', arrivalDate);
  url.searchParams.set('tripLength', String(tripLength));
  url.searchParams.set('arrivalTime', 'morning');
  url.searchParams.set('arrivalPoint', 'ber');
  url.searchParams.set('stayArea', 'mitte');
  url.searchParams.set('groupType', 'solo');
  url.searchParams.set('firstTime', 'yes');
  url.searchParams.set('interests', 'history,wall,food,museums');
  url.searchParams.set('budgetStyle', 'smart');
  url.searchParams.set('mustHandle', 'rain');
  url.searchParams.set('pace', 'balanced');
  url.searchParams.set('tourIntent', 'considering');
  url.searchParams.set('planAccess', '1');
  url.searchParams.set('source', 'codex_live_smoke');
  return url.toString();
}

function buildLeadPayload(options) {
  const arrivalDate = options.arrivalDate || dateKey(addDays(new Date(), 10));
  const tripLength = Math.max(1, Math.min(7, Math.round(options.tripLength || 3)));
  const recommendedTourDate = dateKey(addDays(new Date(`${arrivalDate}T12:00:00Z`), 1));

  return {
    email: options.email || `ultimate-planner-smoke+${Date.now()}@example.com`,
    arrivalDate,
    tripLength,
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
    carryPack: 'Save the exact plan link, route map, trip calendar, and BerlinWalk calendar hold. The print-ready PDF is generated inside the unlocked planner.',
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
    page: buildPlannerPageUrl(options, arrivalDate, tripLength),
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
  const prefix = options.live ? 'live' : 'dry-run';
  const suffix = options.aiOnly ? '-ai-only' : '';
  return path.resolve(process.cwd(), OUTPUT_DIR, `${prefix}${suffix}-${stamp}.json`);
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

  if (options.booking && options.aiOnly) {
    console.error('--booking cannot be combined with --ai-only because --ai-only intentionally skips lead/booking writes.');
    process.exitCode = 1;
    return;
  }

  if (options.live && !options.aiOnly && !validEmail(options.email)) {
    console.error('--live requires a real --email address unless --ai-only is used.');
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
  const aiPayload = options.ai ? { compatibilityCheck: 'trip_planner_3_1_ai_disabled' } : null;
  const aiPrivacy = options.ai ? {
    checked: true,
    piiIncluded: false,
    quotaEmailIncluded: false,
    runtimeAiDisabled: true
  } : null;
  const baseUrl = String(options.baseUrl || DEFAULT_BASE_URL).replace(/\/$/, '');
  const result = {
    mode: options.live ? 'live' : 'dry-run',
    generatedAt: new Date().toISOString(),
    baseUrl,
    aiOnly: options.aiOnly,
    leadPayload: options.aiOnly ? null : leadPayload,
    bookingPayload: options.booking ? bookingPayload : null,
    aiPayload: options.ai ? aiPayload : null,
    aiPrivacy,
    aiCost: null,
    responses: {}
  };

  if (!options.live) {
    const outPath = writeResult(options, result);
    console.log('DRY RUN: no network calls made.');
    if (!options.aiOnly) console.log(`Lead endpoint: ${baseUrl}/_functions/tripPlannerLead`);
    if (options.booking) console.log(`Booking endpoint: ${baseUrl}/_functions/tripPlannerBooking`);
    if (options.ai) console.log(`AI endpoint: ${baseUrl}/_functions/tripPlannerAi`);
    console.log(`Result written to ${path.relative(process.cwd(), outPath)}`);
    return;
  }

  if (!options.aiOnly) {
    result.responses.lead = await postJson(`${baseUrl}/_functions/tripPlannerLead`, leadPayload);
    assertResult('tripPlannerLead', result.responses.lead, (body) => {
      if (!body.leadId) throw new Error('tripPlannerLead response missing leadId');
      if (body.subscribed !== true) {
        const detail = body.subscriptionDebug ? JSON.stringify(body.subscriptionDebug) : 'missing subscriptionDebug';
        throw new Error(`tripPlannerLead did not subscribe Email Marketing contact: ${detail}`);
      }
    });
  }

  if (options.booking) {
    result.responses.booking = await postJson(`${baseUrl}/_functions/tripPlannerBooking`, bookingPayload);
    assertResult('tripPlannerBooking', result.responses.booking, (body) => {
      if (!Number.isFinite(Number(body.matched))) throw new Error('tripPlannerBooking response missing matched count');
    });
  }

  if (options.ai) {
    result.responses.ai = await postJson(`${baseUrl}/_functions/tripPlannerAi`, aiPayload);
    if (result.responses.ai.status !== 410 || result.responses.ai.body?.error !== 'ai_disabled') {
      throw new Error(`tripPlannerAi expected HTTP 410 ai_disabled, received HTTP ${result.responses.ai.status}`);
    }
  }

  const outPath = writeResult(options, result);
  console.log(`LIVE OK: ${options.aiOnly ? 'tripPlannerAi only' : `tripPlannerLead${options.booking ? ' + tripPlannerBooking' : ''}${options.ai ? ' + tripPlannerAi' : ''}`}`);
  if (options.ai) console.log('Legacy AI endpoint: HTTP 410 ai_disabled (expected).');
  console.log(`Result written to ${path.relative(process.cwd(), outPath)}`);
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exitCode = 1;
});
