#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const SITE_ID = '12ee5ea0-70a7-492f-8020-ffb27cbb630f';
const API_ROOT = 'https://www.wixapis.com';
const COLLECTION_ID = 'TripPlannerLeads';
const OUTPUT_DIR = 'output/qa/ultimate-trip-planner-lead-report';
const DEFAULT_LIMIT = 100;

function usage() {
  console.log(`Usage:
  node ultimate-berlin-trip-planner/velo/report-trip-planner-leads.mjs
  node ultimate-berlin-trip-planner/velo/report-trip-planner-leads.mjs --live --limit 200
  node ultimate-berlin-trip-planner/velo/report-trip-planner-leads.mjs --live --include-emails

Dry-run by default. Live mode is read-only and requires:
  source ../scripts/load-api-keys.sh

Options:
  --live             Read TripPlannerLeads through Wix Data.
  --limit N          Max leads to read in live mode. Default: ${DEFAULT_LIMIT}.
  --include-emails   Include raw emails in the JSON. Default output masks them.
  --out FILE         Write report to a specific JSON path.
`);
}

function parseArgs(argv) {
  const options = {
    live: false,
    includeEmails: false,
    limit: DEFAULT_LIMIT,
    outPath: ''
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--live') {
      options.live = true;
    } else if (arg === '--include-emails') {
      options.includeEmails = true;
    } else if (arg === '--limit') {
      options.limit = Number(argv[index + 1] || DEFAULT_LIMIT);
      index += 1;
    } else if (arg === '--out') {
      options.outPath = argv[index + 1] || '';
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  options.limit = Math.max(1, Math.min(1000, Math.round(options.limit || DEFAULT_LIMIT)));
  return options;
}

function outputPath(options) {
  if (options.outPath) return path.resolve(process.cwd(), options.outPath);
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const mode = options.live ? 'live' : 'dry-run';
  return path.resolve(process.cwd(), OUTPUT_DIR, `lead-report-${mode}-${stamp}.json`);
}

function wixHeaders() {
  const apiKey = String(process.env.WIX_API_KEY || '').trim();
  if (!apiKey) throw new Error('Missing WIX_API_KEY. Run: source ../scripts/load-api-keys.sh');
  return {
    Authorization: apiKey,
    'wix-site-id': SITE_ID,
    'Content-Type': 'application/json'
  };
}

async function readBody(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { text };
  }
}

async function wixFetch(apiPath, options = {}) {
  const response = await fetch(`${API_ROOT}${apiPath}`, {
    ...options,
    headers: {
      ...wixHeaders(),
      ...(options.headers || {})
    }
  });
  const body = await readBody(response);
  if (!response.ok) throw new Error(`Wix read failed: ${response.status} ${JSON.stringify(body)}`);
  return body;
}

function dataFromItem(item) {
  const dataItem = item && (item.dataItem || item.item || item);
  return dataItem && (dataItem.data || dataItem) || {};
}

async function readLiveLeads(options) {
  const body = await wixFetch('/wix-data/v2/items/query', {
    method: 'POST',
    body: JSON.stringify({
      dataCollectionId: COLLECTION_ID,
      query: {
        paging: { limit: options.limit }
      },
      returnTotalCount: true
    })
  });
  const items = body.dataItems || body.items || [];
  return Array.isArray(items) ? items.map(dataFromItem) : [];
}

function pad2(value) {
  return String(value).padStart(2, '0');
}

function dateKey(date) {
  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`;
}

function addDays(days) {
  const date = new Date();
  date.setUTCHours(12, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + days);
  return dateKey(date);
}

function sampleLeads() {
  return [
    {
      email: 'classic.hot@example.com',
      arrivalDate: addDays(4),
      tripLength: 3,
      tripStyle: 'Classic first trip',
      arrivalWindow: 'near_forecast',
      tourIntent: 'Considering',
      conversionScore: 84,
      conversionTier: 'high_prep_need',
      conversionNextAction: 'Save the World Clock context point before arrival',
      conversionSignal: '84/100 - prep-ready lead; early context point recommended',
      intentStage: 'planning_ready',
      stayArea: 'Mitte / Alexanderplatz',
      source: 'tool'
    },
    {
      email: 'family.warm@example.com',
      arrivalDate: addDays(9),
      tripLength: 5,
      tripStyle: 'Family / slower pace',
      arrivalWindow: 'near_forecast',
      tourIntent: 'Considering',
      conversionScore: 68,
      conversionTier: 'medium_prep_need',
      conversionNextAction: 'Send family-friendly first-route prep',
      intentStage: 'planning_ready',
      familyOrSlow: 'yes',
      stayArea: 'Prenzlauer Berg',
      source: 'blog'
    },
    {
      email: 'booked.prep@example.com',
      arrivalDate: addDays(2),
      tripLength: 4,
      tripStyle: 'History + museums',
      conversionScore: 92,
      conversionTier: 'booked_prep',
      conversionNextAction: 'Send World Clock meeting prep',
      intentStage: 'booked',
      tourIntent: 'Already booked',
      bookingStatus: 'confirmed',
      bookedAt: new Date().toISOString(),
      source: 'tool'
    },
    {
      email: 'researching.custom@example.com',
      arrivalDate: addDays(18),
      tripLength: 7,
      tripStyle: 'Custom mix',
      arrivalWindow: 'future_planning',
      tourIntent: 'Not sure',
      conversionScore: 41,
      conversionTier: 'researching',
      conversionNextAction: 'Keep Berlin planning value high',
      intentStage: 'researching',
      source: 'blog'
    },
    {
      email: 'error.watch@example.com',
      arrivalDate: addDays(1),
      tripLength: 2,
      tripStyle: 'Food + nightlife',
      conversionScore: 73,
      conversionTier: 'medium_prep_need',
      conversionNextAction: 'Save first context point, protect late night energy',
      intentStage: 'planning_ready',
      instantError: 'missing_message_id',
      source: 'tool'
    }
  ];
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function maskEmail(email) {
  const normalized = normalizeEmail(email);
  if (!normalized || !normalized.includes('@')) return '';
  const [local, domain] = normalized.split('@');
  const localMask = local.length <= 2 ? `${local[0] || '*'}*` : `${local.slice(0, 2)}***`;
  return `${localMask}@${domain}`;
}

function emailHash(email) {
  const normalized = normalizeEmail(email);
  if (!normalized) return '';
  return crypto.createHash('sha256').update(normalized).digest('hex').slice(0, 12);
}

function isBooked(lead) {
  const status = String(lead.bookingStatus || '').toLowerCase();
  const inactive = ['cancelled', 'canceled', 'refunded', 'declined', 'no_show', 'no-show'];
  if (inactive.includes(status)) return false;
  return Boolean(lead.bookedAt || ['booked', 'confirmed', 'self_reported_booked'].includes(status));
}

function scoreOf(lead) {
  const value = Number(lead.conversionScore || 0);
  return Number.isFinite(value) ? value : 0;
}

function daysUntil(dateValue) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dateValue || ''))) return null;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const target = new Date(`${dateValue}T00:00:00Z`);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

function countBy(leads, key) {
  return leads.reduce((acc, lead) => {
    const value = String(lead[key] || '(blank)').trim() || '(blank)';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function hasSendError(lead) {
  return ['instantError', 'minus7Error', 'minus3Error', 'minus1Error', 'dayOfError']
    .some((field) => String(lead[field] || '').trim());
}

function compactLead(lead, options) {
  const row = {
    emailHash: emailHash(lead.email),
    email: options.includeEmails ? normalizeEmail(lead.email) : maskEmail(lead.email),
    arrivalDate: lead.arrivalDate || '',
    daysUntilArrival: daysUntil(lead.arrivalDate),
    tripLength: lead.tripLength || '',
    tripStyle: lead.tripStyle || '',
    conversionScore: scoreOf(lead),
    conversionTier: lead.conversionTier || '',
    conversionNextAction: lead.conversionNextAction || '',
    intentStage: lead.intentStage || '',
    tourIntent: lead.tourIntent || '',
    bookingStatus: lead.bookingStatus || '',
    booked: isBooked(lead),
    source: lead.source || ''
  };
  if (!options.includeEmails) row.emailMasked = row.email;
  return row;
}

function summarize(leads, options) {
  const totalScore = leads.reduce((sum, lead) => sum + scoreOf(lead), 0);
  const unbooked = leads.filter((lead) => !isBooked(lead));
  const upcoming = unbooked
    .filter((lead) => {
      const days = daysUntil(lead.arrivalDate);
      return days != null && days >= 0 && days <= 7;
    })
    .sort((a, b) => (daysUntil(a.arrivalDate) || 999) - (daysUntil(b.arrivalDate) || 999) || scoreOf(b) - scoreOf(a));
  const hot = unbooked
    .filter((lead) => scoreOf(lead) >= 70 || String(lead.conversionTier || '').includes('hot'))
    .sort((a, b) => scoreOf(b) - scoreOf(a) || String(a.arrivalDate || '').localeCompare(String(b.arrivalDate || '')));
  const errors = leads.filter(hasSendError);

  return {
    count: leads.length,
    bookedCount: leads.filter(isBooked).length,
    unbookedCount: unbooked.length,
    averageConversionScore: leads.length ? Math.round(totalScore / leads.length) : 0,
    arrivingNext7Days: upcoming.length,
    sendErrorCount: errors.length,
    byConversionTier: countBy(leads, 'conversionTier'),
    byTripStyle: countBy(leads, 'tripStyle'),
    byArrivalWindow: countBy(leads, 'arrivalWindow'),
    byIntentStage: countBy(leads, 'intentStage'),
    byTourIntent: countBy(leads, 'tourIntent'),
    byTripLength: countBy(leads, 'tripLength'),
    bySource: countBy(leads, 'source'),
    priorityLeads: hot.slice(0, 12).map((lead) => compactLead(lead, options)),
    upcomingArrivals: upcoming.slice(0, 12).map((lead) => compactLead(lead, options)),
    sendErrors: errors.slice(0, 12).map((lead) => ({
      ...compactLead(lead, options),
      errors: ['instantError', 'minus7Error', 'minus3Error', 'minus1Error', 'dayOfError']
        .filter((field) => String(lead[field] || '').trim())
        .map((field) => `${field}: ${String(lead[field]).slice(0, 180)}`)
    }))
  };
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

  let leads;
  try {
    leads = options.live ? await readLiveLeads(options) : sampleLeads();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
    return;
  }

  const report = {
    generatedAt: new Date().toISOString(),
    mode: options.live ? 'live_read_only' : 'dry_run_fixture',
    collectionId: COLLECTION_ID,
    limit: options.limit,
    includeEmails: options.includeEmails,
    privacy: options.includeEmails ? 'raw emails included by explicit flag' : 'emails masked; stable emailHash included',
    summary: summarize(leads, options)
  };

  const outPath = outputPath(options);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  console.log(`${options.live ? 'LIVE READ' : 'DRY RUN'}: ${leads.length} lead(s) summarized.`);
  console.log(`Priority leads: ${report.summary.priorityLeads.length}`);
  console.log(`Upcoming arrivals: ${report.summary.upcomingArrivals.length}`);
  console.log(`Send errors: ${report.summary.sendErrorCount}`);
  console.log(`Result written to ${path.relative(process.cwd(), outPath)}`);
}

main();
