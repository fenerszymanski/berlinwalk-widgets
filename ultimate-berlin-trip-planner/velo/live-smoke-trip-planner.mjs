#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_BASE_URL = 'https://www.berlinwalk.com';
const OUTPUT_DIR = 'output/qa/ultimate-trip-planner-live-smoke';
const GEMINI_FLASH_PRICING = {
  model: 'gemini-2.5-flash',
  inputUsdPerMillionTokens: 0.30,
  outputUsdPerMillionTokens: 2.50,
  checkedAt: '2026-06-02',
  source: 'https://ai.google.dev/gemini-api/docs/pricing'
};

function usage() {
  console.log(`Usage:
  node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --email you@example.com
  node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --live --email you@example.com
  node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --live --email you@example.com --booking
  node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --live --email you@example.com --ai
  node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --live --email you@example.com --ai-only

Defaults to dry-run. It prints and records the payloads but does not call Wix
unless --live is present.

Options:
  --email EMAIL       Required for --live. Optional for dry-run.
  --arrival DATE     YYYY-MM-DD. Defaults to 10 days from today.
  --tripLength N     1-7. Defaults to 3.
  --base URL         Defaults to https://www.berlinwalk.com.
  --booking          Also POST /_functions/tripPlannerBooking after lead.
  --ai               Also POST /_functions/tripPlannerAi after lead.
  --ai-only          Only POST /_functions/tripPlannerAi; no new lead/email call. Requires an existing lead for the email + arrival.
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

function cleanNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : 0;
}

function estimateGeminiCost(response) {
  const enhancement = response?.body?.enhancement;
  const usage = enhancement?.usage || {};
  const promptTokens = cleanNumber(usage.promptTokens);
  const outputTokens = cleanNumber(usage.outputTokens);
  const totalTokens = cleanNumber(usage.totalTokens || promptTokens + outputTokens);
  const estimatedUsd = (promptTokens / 1_000_000 * GEMINI_FLASH_PRICING.inputUsdPerMillionTokens) +
    (outputTokens / 1_000_000 * GEMINI_FLASH_PRICING.outputUsdPerMillionTokens);

  if (!promptTokens && !outputTokens && !totalTokens) return null;

  return {
    provider: enhancement?.provider || 'gemini',
    model: enhancement?.model || GEMINI_FLASH_PRICING.model,
    promptTokens,
    outputTokens,
    totalTokens,
    estimatedUsd: Number(estimatedUsd.toFixed(6)),
    estimatedCents: Number((estimatedUsd * 100).toFixed(4)),
    pricing: GEMINI_FLASH_PRICING
  };
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

function buildAiPayload(leadPayload) {
  const arrivalDate = leadPayload.arrivalDate;
  const day2Date = leadPayload.recommendedTourDate || arrivalDate;
  const day3Date = dateKey(addDays(new Date(`${arrivalDate}T12:00:00Z`), 2));

  return {
    quotaEmail: leadPayload.email,
    inputs: {
      arrivalDate,
      tripLength: String(leadPayload.tripLength),
      arrivalTime: leadPayload.arrivalTime,
      arrivalPoint: leadPayload.arrivalPoint,
      stayArea: leadPayload.stayArea,
      groupType: leadPayload.groupType,
      firstTime: leadPayload.firstTime,
      interests: leadPayload.interests,
      budgetStyle: leadPayload.budgetStyle,
      mustHandle: leadPayload.mustHandle,
      pace: leadPayload.pace,
      tourIntent: leadPayload.tourIntent
    },
    weather: {
      title: leadPayload.weatherTitle,
      mode: 'Smoke test fallback',
      copy: 'Use weather notes as a light planning check, not a full forecast.',
      advice: leadPayload.weatherStrategy,
      tripSummary: 'Mild Berlin fallback: keep one rain-safe indoor option and re-check weather close to arrival.'
    },
    tourSlot: {
      dayLabel: 'Day 2',
      dateLabel: day2Date,
      timeLabel: leadPayload.recommendedTourTime,
      booked: 'no'
    },
    plan: {
      title: leadPayload.planTitle,
      summary: 'Smoke test plan with arrival, BerlinWalk tour framework, Wall / Cold War layer, and one museum anchor.',
      ticket: leadPayload.ticket,
      tourFit: leadPayload.recommendedTourDay,
      arrivalStatus: 'Weekday rules apply',
      days: [
        {
          dayNumber: 1,
          date: arrivalDate,
          title: 'Arrival and first Berlin orientation',
          theme: 'Arrival day',
          places: ['World Clock', 'Museum Island', 'Hackescher Markt'],
          blocks: [
            {
              time: '09:00-10:45',
              title: 'Get central without over-solving Berlin',
              copy: 'Use ABC from BER, drop bags if needed, then keep the first walk central.'
            }
          ],
          risks: ['Arrival logistics']
        },
        {
          dayNumber: 2,
          date: day2Date,
          title: 'BerlinWalk tour, then one Wall / Cold War layer',
          theme: 'Tour + Wall / Cold War',
          places: ['World Clock', 'Berlin Wall Memorial', 'Topography of Terror'],
          blocks: [
            {
              time: '11:30-13:30',
              title: 'BerlinWalk at 11:30 from the World Clock',
              copy: 'Use the 2-hour walk as the main city framework.'
            },
            {
              time: '14:00-16:30',
              title: 'Add one Wall / Cold War stop',
              copy: 'After lunch, choose one serious Wall or Cold War stop.'
            }
          ],
          risks: ['Do not overfill the day']
        },
        {
          dayNumber: 3,
          date: day3Date,
          title: 'Museum Island without museum overload',
          theme: 'Museums and royal Berlin',
          places: ['Museum Island', 'Brandenburg Gate', 'Reichstag'],
          blocks: [
            {
              time: '10:30-12:30',
              title: 'Pick one museum anchor',
              copy: 'One checked-open museum beats four rushed ones.'
            }
          ],
          risks: ['Check timed entry']
        }
      ].slice(0, leadPayload.tripLength)
    }
  };
}

function collectStrings(value, pathName = '$', rows = []) {
  if (typeof value === 'string') {
    rows.push({ path: pathName, value });
    return rows;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectStrings(item, `${pathName}[${index}]`, rows));
    return rows;
  }
  if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      collectStrings(item, `${pathName}.${key}`, rows);
    }
  }
  return rows;
}

function assertAiPayloadPrivacy(aiPayload, leadPayload) {
  const quotaEmail = String(aiPayload && aiPayload.quotaEmail || '').trim().toLowerCase();
  const geminiBoundPayload = Object.assign({}, aiPayload);
  delete geminiBoundPayload.quotaEmail;
  const strings = collectStrings(geminiBoundPayload);
  const email = String(leadPayload.email || '').trim().toLowerCase();
  const leakedEmail = email
    ? strings.find((row) => row.value.toLowerCase().includes(email))
    : null;
  const emailLike = strings.find((row) => /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(row.value));
  const emailKey = JSON.stringify(geminiBoundPayload).match(/"[^"]*email[^"]*"\s*:/i);

  if (leakedEmail) {
    throw new Error(`Gemini-bound AI payload includes lead email at ${leakedEmail.path}`);
  }
  if (emailLike) {
    throw new Error(`Gemini-bound AI payload includes email-like text at ${emailLike.path}`);
  }
  if (emailKey) {
    throw new Error('Gemini-bound AI payload includes an email-shaped key');
  }
  if (email && quotaEmail !== email) {
    throw new Error('AI quotaEmail must match the smoke-test lead email for backend quota lookup.');
  }

  return {
    checked: true,
    stringCount: strings.length,
    quotaEmailPresent: Boolean(quotaEmail),
    geminiBoundEmailKey: false,
    geminiBoundEmailLikeText: false,
    geminiBoundLeadEmailIncluded: false
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

  if (options.live && !validEmail(options.email)) {
    console.error('--live requires a real --email address so the lead/AI quota lookup can be checked.');
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
  const aiPayload = buildAiPayload(leadPayload);
  const aiPrivacy = options.ai ? assertAiPayloadPrivacy(aiPayload, leadPayload) : null;
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
    assertResult('tripPlannerAi', result.responses.ai, (body) => {
      if (!body.enhancement || !body.enhancement.routeIntro) throw new Error('tripPlannerAi response missing enhancement.routeIntro');
      if (!Array.isArray(body.enhancement.dayStories)) throw new Error('tripPlannerAi response missing enhancement.dayStories');
    });
    result.aiCost = estimateGeminiCost(result.responses.ai);
  }

  const outPath = writeResult(options, result);
  console.log(`LIVE OK: ${options.aiOnly ? 'tripPlannerAi only' : `tripPlannerLead${options.booking ? ' + tripPlannerBooking' : ''}${options.ai ? ' + tripPlannerAi' : ''}`}`);
  if (result.aiCost) {
    console.log(`Gemini usage: ${result.aiCost.promptTokens} input + ${result.aiCost.outputTokens} output tokens; estimated $${result.aiCost.estimatedUsd}`);
  }
  console.log(`Result written to ${path.relative(process.cwd(), outPath)}`);
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exitCode = 1;
});
