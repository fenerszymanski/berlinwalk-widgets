#!/usr/bin/env node

/*
 * Read-only 30-day measurement gate for Berlin History Story V1.
 *
 * Run from the BerlinWalk workspace after the page has been verified live:
 *   node berlinwalk-widgets/scripts/measure-berlin-history-story-30d.mjs \
 *     --start YYYY-MM-DD --end YYYY-MM-DD --format markdown
 *
 * Dates are Europe/Berlin calendar dates and end is exclusive. The command
 * intentionally writes no files and never changes GA4 or Search Console.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { google } = require('googleapis');
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

const TIMEZONE = 'Europe/Berlin';
const CANONICAL_URL = 'https://www.berlinwalk.com/berlin-history-story';
const PAGE_PATH = '/berlin-history-story';
const EVENT_NAMES = [
  'bw_history_story_closing_cta_click',
  'bw_history_story_wall_timeline_click',
];
const THRESHOLD_DAILY_VIEWS = 3.6;
const GSC_DELAY_DAYS = 3;

function findWorkspaceRoot() {
  let current = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
  for (;;) {
    if (fs.existsSync(path.join(current, 'PROJECT_MEMORY.md')) && fs.existsSync(path.join(current, 'scripts', 'load-api-keys.sh'))) return current;
    const parent = path.dirname(current);
    if (parent === current) throw new Error('BerlinWalk workspace root was not found. Run from the BerlinWalk workspace.');
    current = parent;
  }
}

const READ_SCOPES = [
  'https://www.googleapis.com/auth/analytics.readonly',
  'https://www.googleapis.com/auth/webmasters.readonly',
];

function tokenScopeSet(tokens) {
  return new Set(String(tokens?.scope || '').split(/\s+/).filter(Boolean));
}

async function getReadOnlyAuthClient() {
  const root = findWorkspaceRoot();
  const keysPath = process.env.BW_GOOGLE_OAUTH_KEYS_PATH || path.join(root, 'oauth2.keys.json');
  const tokenPath = process.env.BW_GOOGLE_REPORTING_TOKEN_PATH || path.join(root, 'tokens.json');
  if (!fs.existsSync(keysPath) || !fs.existsSync(tokenPath)) {
    throw new Error('Read-only Google reporting credentials are unavailable. No OAuth setup or token write was attempted.');
  }
  const keys = JSON.parse(fs.readFileSync(keysPath, 'utf8'));
  const tokens = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
  const missingScopes = READ_SCOPES.filter((scope) => !tokenScopeSet(tokens).has(scope));
  if (missingScopes.length) throw new Error('Google reporting token is missing required read-only scopes. No OAuth setup or token write was attempted.');
  if (!keys?.installed?.client_id || !keys?.installed?.client_secret) throw new Error('Google OAuth client configuration is invalid.');
  const authClient = new google.auth.OAuth2(keys.installed.client_id, keys.installed.client_secret, 'http://localhost:3000');
  authClient.setCredentials(tokens);
  await authClient.getAccessToken();
  return authClient;
}

function parseArgs(argv) {
  const args = {
    start: '',
    end: '',
    format: 'markdown',
    propertyId: process.env.GA4_PROPERTY_ID || '',
    propertyHint: process.env.GA4_PROPERTY_HINT || 'berlinwalk',
    siteUrl: process.env.GSC_SITE_URL || '',
    siteHint: process.env.GSC_SITE_HINT || 'berlinwalk',
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];
    if (arg === '--start') args.start = next, index += 1;
    else if (arg === '--end') args.end = next, index += 1;
    else if (arg === '--format') args.format = next, index += 1;
    else if (arg === '--property-id') args.propertyId = next, index += 1;
    else if (arg === '--property-hint') args.propertyHint = next, index += 1;
    else if (arg === '--site-url') args.siteUrl = next, index += 1;
    else if (arg === '--site-hint') args.siteHint = next, index += 1;
    else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else throw new Error('Unknown argument: ' + arg);
  }
  validateDate(args.start, '--start');
  validateDate(args.end, '--end');
  if (daysBetween(args.start, args.end) !== 30) throw new Error('The measurement window must be exactly 30 Europe/Berlin calendar days: [start, end).');
  if (!['markdown', 'json'].includes(args.format)) throw new Error('--format must be markdown or json');
  return args;
}

function printHelp() {
  console.log([
    'Usage:',
    '  node berlinwalk-widgets/scripts/measure-berlin-history-story-30d.mjs \\',
    '    --start YYYY-MM-DD --end YYYY-MM-DD [--format markdown|json]',
    '',
    'The 30-day window is [start, end) in Europe/Berlin.',
    'Run no earlier than three full days after end so Search Console data can settle.',
    'The command is read-only against Google and writes no local files.',
  ].join('\n'));
}

function validateDate(value, label) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) throw new Error(label + ' must be YYYY-MM-DD');
  const parsed = new Date(String(value) + 'T12:00:00Z');
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) throw new Error(label + ' is not a valid calendar date');
}

function addDays(date, amount) {
  const [year, month, day] = date.split('-').map(Number);
  const value = new Date(Date.UTC(year, month - 1, day));
  value.setUTCDate(value.getUTCDate() + amount);
  return value.toISOString().slice(0, 10);
}

function daysBetween(start, end) {
  return Math.round((Date.parse(end + 'T00:00:00Z') - Date.parse(start + 'T00:00:00Z')) / 86400000);
}

function berlinToday() {
  const pieces = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE, year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date());
  const values = Object.fromEntries(pieces.map((piece) => [piece.type, piece.value]));
  return values.year + '-' + values.month + '-' + values.day;
}

function number(value) {
  return Number.isFinite(Number(value)) ? Number(value) : 0;
}

function stringFilter(fieldName, value) {
  return { filter: { fieldName, stringFilter: { matchType: 'EXACT', value, caseSensitive: true } } };
}

function andFilters(...filters) {
  return { andGroup: { expressions: filters } };
}

async function discoverProperty(authClient, hint, requestedId = '') {
  const admin = google.analyticsadmin({ version: 'v1beta', auth: authClient });
  const summary = await admin.accountSummaries.list();
  const candidates = [];
  for (const account of summary.data.accountSummaries || []) {
    for (const property of account.propertySummaries || []) {
      candidates.push({
        id: String(property.property || '').split('/')[1] || '',
        account: String(account.displayName || account.name || ''),
        name: String(property.displayName || ''),
      });
    }
  }
  const needle = String(hint || '').toLowerCase();
  const matches = candidates.filter((item) => item.name.toLowerCase().includes(needle) || item.account.toLowerCase().includes(needle));
  if (requestedId) {
    const requested = matches.find((item) => item.id === requestedId);
    if (!requested) throw new Error('The requested GA4 property ID is not an accessible BerlinWalk property matching the supplied hint.');
    return requested;
  }
  if (matches.length !== 1 || !matches[0]?.id) {
    throw new Error(matches.length
      ? 'More than one GA4 property matches the BerlinWalk hint. Set the exact --property-id and --property-hint.'
      : 'BerlinWalk GA4 property was not found. Set the exact --property-id and --property-hint.');
  }
  return matches[0];
}

async function discoverSite(searchconsole, hint, requestedSiteUrl = '') {
  const response = await searchconsole.sites.list();
  const sites = response.data.siteEntry || [];
  const needle = String(hint || '').toLowerCase();
  const matches = sites.filter((site) => String(site.siteUrl || '').toLowerCase().includes(needle));
  if (requestedSiteUrl) {
    const requested = matches.find((site) => site.siteUrl === requestedSiteUrl);
    if (!requested) throw new Error('The requested Search Console site URL is not an accessible BerlinWalk property matching the supplied hint.');
    return requested.siteUrl;
  }
  if (matches.length !== 1 || !matches[0]?.siteUrl) {
    throw new Error(matches.length
      ? 'More than one Search Console property matches the BerlinWalk hint. Set the exact --site-url.'
      : 'BerlinWalk Search Console property was not found. Set the exact --site-url.');
  }
  return matches[0].siteUrl;
}

async function ga4Report(client, propertyId, args, options) {
  const [response] = await client.runReport({
    property: 'properties/' + propertyId,
    dateRanges: [{ startDate: args.start, endDate: addDays(args.end, -1) }],
    dimensions: (options.dimensions || []).map((name) => ({ name })),
    metrics: (options.metrics || []).map((name) => ({ name })),
    dimensionFilter: options.dimensionFilter,
    orderBys: options.orderBy ? [{ dimension: { dimensionName: options.orderBy } }] : undefined,
    limit: options.limit || 100,
  });
  return response.rows || [];
}

function rowValues(row, dimensions, metrics) {
  const values = {};
  dimensions.forEach((name, index) => { values[name] = row.dimensionValues?.[index]?.value || ''; });
  metrics.forEach((name, index) => { values[name] = number(row.metricValues?.[index]?.value); });
  return values;
}

async function readGa4(args, authClient) {
  const property = await discoverProperty(authClient, args.propertyHint, args.propertyId);
  const client = new BetaAnalyticsDataClient({ authClient });
  const pageFilter = stringFilter('pagePath', PAGE_PATH);
  const summaryMetrics = ['screenPageViews', 'userEngagementDuration'];
  const [summaryRows, dailyRows, ...eventRows] = await Promise.all([
    ga4Report(client, property.id, args, { metrics: summaryMetrics, dimensionFilter: pageFilter, limit: 1 }),
    ga4Report(client, property.id, args, { dimensions: ['date'], metrics: summaryMetrics, dimensionFilter: pageFilter, orderBy: 'date', limit: 31 }),
    ...EVENT_NAMES.map((eventName) => ga4Report(client, property.id, args, {
      metrics: ['eventCount'],
      dimensionFilter: andFilters(stringFilter('eventName', eventName), pageFilter),
      limit: 1
    })),
  ]);
  const summary = rowValues(summaryRows[0] || {}, [], summaryMetrics);
  const pageViews = summary.screenPageViews;
  const engagementSeconds = summary.userEngagementDuration;
  return {
    state: 'KNOWN',
    propertyId: property.id,
    propertyName: property.name || '',
    page: {
      pagePath: PAGE_PATH,
      views: pageViews,
      viewsPerDay: pageViews / 30,
      engagementSeconds,
      averageEngagementSecondsPerRecordedView: pageViews ? engagementSeconds / pageViews : 0,
      timeDefinition: 'GA4 userEngagementDuration divided by GA4 screenPageViews, both filtered to exact pagePath /berlin-history-story. This is the frozen average-time definition for this gate.',
      daily: dailyRows.map((row) => rowValues(row, ['date'], summaryMetrics)),
    },
    events: Object.fromEntries(EVENT_NAMES.map((name, index) => [name, {
      eventCount: rowValues(eventRows[index][0] || {}, [], ['eventCount']).eventCount,
      source: 'GA4 exact eventName and exact pagePath match; event name is unique to Berlin History Story V1.',
    }])),
  };
}

async function readGsc(args, authClient) {
  const searchconsole = google.webmasters({ version: 'v3', auth: authClient });
  const siteUrl = await discoverSite(searchconsole, args.siteHint, args.siteUrl);
  const requestBody = {
    startDate: args.start,
    endDate: addDays(args.end, -1),
    dimensionFilterGroups: [{ filters: [{ dimension: 'page', operator: 'equals', expression: CANONICAL_URL }] }],
  };
  const [total, daily] = await Promise.all([
    searchconsole.searchanalytics.query({ siteUrl, requestBody: { ...requestBody, rowLimit: 1 } }),
    searchconsole.searchanalytics.query({ siteUrl, requestBody: { ...requestBody, dimensions: ['date'], rowLimit: 31 } }),
  ]);
  const totalRow = total.data.rows?.[0] || {};
  return {
    state: 'KNOWN',
    siteUrl,
    canonicalUrl: CANONICAL_URL,
    clicks: number(totalRow.clicks),
    impressions: number(totalRow.impressions),
    ctr: number(totalRow.ctr) * 100,
    position: number(totalRow.position),
    daily: (daily.data.rows || []).map((row) => ({
      date: row.keys?.[0] || '', clicks: number(row.clicks), impressions: number(row.impressions),
      ctr: number(row.ctr) * 100, position: number(row.position),
    })),
  };
}

function unknown(error) {
  return { state: 'UNKNOWN', error: error?.message || String(error) };
}

function decision(ga4, gsc) {
  if (ga4.state !== 'KNOWN' || gsc.state !== 'KNOWN') {
    return { state: 'UNKNOWN_BLOCKED', reason: 'A required data source is unavailable or not mature. UNKNOWN is not zero and does not decide expansion.' };
  }
  if (ga4.page.viewsPerDay >= THRESHOLD_DAILY_VIEWS) {
    return { state: 'EXPANSION_ELIGIBLE', reason: 'Raw GA4 recorded views meet or exceed 108 total / 3.6 per day. Review the full evidence before any 24-scene work.' };
  }
  return { state: 'NO_EXPANSION', reason: 'Raw GA4 recorded views are below 108 total / 3.6 per day. Do not apply the old consent-adjustment proxy to this threshold.' };
}

function markdown(report) {
  const ga4 = report.ga4;
  const gsc = report.gsc;
  const ga4Rows = ga4.state === 'KNOWN'
    ? ga4.page.daily.map((row) => '| ' + row.date + ' | ' + row.screenPageViews + ' | ' + row.userEngagementDuration.toFixed(1) + ' |').join('\n')
    : '| UNKNOWN | - | - |';
  const eventRows = ga4.state === 'KNOWN'
    ? Object.entries(ga4.events).map(([name, data]) => '| ' + name + ' | ' + data.eventCount + ' |').join('\n')
    : '| UNKNOWN | - |';
  return [
    '# Berlin History Story V1 - 30-day measurement',
    '',
    'Window: ' + report.window.start + ' to ' + report.window.end + ' (end exclusive, Europe/Berlin)',
    'Generated: ' + report.generatedAt,
    '',
    '## Decision',
    '',
    '- **' + report.decision.state + '** — ' + report.decision.reason,
    '',
    '## GA4',
    '',
    ga4.state === 'KNOWN'
      ? '- Exact page path: `' + PAGE_PATH + '`\n- Views: **' + ga4.page.views + '**\n- Views/day: **' + ga4.page.viewsPerDay.toFixed(2) + '**\n- Average engagement seconds per recorded view: **' + ga4.page.averageEngagementSecondsPerRecordedView.toFixed(1) + '**\n- Definition: ' + ga4.page.timeDefinition
      : '- **UNKNOWN** — ' + ga4.error,
    '',
    '| Date | Views | Engagement seconds |',
    '|---|---:|---:|',
    ga4Rows,
    '',
    '### Required click events',
    '',
    '| Event | Count |',
    '|---|---:|',
    eventRows,
    '',
    '## Search Console',
    '',
    gsc.state === 'KNOWN'
      ? '- Exact canonical: `' + CANONICAL_URL + '`\n- Clicks: **' + gsc.clicks + '**\n- Impressions: **' + gsc.impressions + '**\n- CTR: **' + gsc.ctr.toFixed(2) + '%**\n- Average position: **' + gsc.position.toFixed(2) + '**'
      : '- **' + gsc.state + '** — ' + (gsc.reason || gsc.error),
    '',
  ].join('\n');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  let authClient;
  let authError;
  try { authClient = await getReadOnlyAuthClient(); } catch (error) { authError = error; }
  let ga4;
  if (!authClient) ga4 = unknown(authError);
  else try { ga4 = await readGa4(args, authClient); } catch (error) { ga4 = unknown(error); }
  const today = berlinToday();
  const gscReadyOn = addDays(args.end, GSC_DELAY_DAYS);
  let gsc;
  if (!authClient) {
    gsc = unknown(authError);
  } else if (today < gscReadyOn) {
    gsc = { state: 'PENDING_GSC', reason: 'Search Console is intentionally deferred until ' + gscReadyOn + ' Europe/Berlin to allow its reporting delay.' };
  } else {
    try { gsc = await readGsc(args, authClient); } catch (error) { gsc = unknown(error); }
  }
  const report = {
    generatedAt: new Date().toISOString(),
    window: { start: args.start, end: args.end, endExclusive: true, timezone: TIMEZONE, days: 30, gscReadyOn },
    ga4,
    gsc,
    threshold: { rawGa4Total: 108, rawGa4ViewsPerDay: THRESHOLD_DAILY_VIEWS, adjustment: 'None. Do not multiply raw GA4 numbers by a consent proxy.' },
    decision: decision(ga4, gsc),
  };
  process.stdout.write(args.format === 'json' ? JSON.stringify(report, null, 2) + '\n' : markdown(report));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
