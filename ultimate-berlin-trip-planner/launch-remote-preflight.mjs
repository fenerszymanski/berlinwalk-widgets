#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const SITE_ID = '12ee5ea0-70a7-492f-8020-ffb27cbb630f';
const API_ROOT = 'https://www.wixapis.com';
const OUTPUT_DIR = 'output/qa/ultimate-trip-planner-remote-preflight';
const TOOL_SLUG = 'ultimate-berlin-trip-planner';
const COLLECTION_ID = 'TripPlannerLeads';
const AI_BUDGET_COLLECTION_ID = 'TripPlannerAiBudget';
const TOOL_COLLECTION_ID = 'BerlinTools';
const CRITICAL_COLLECTION_FIELDS = [
  'leadKey',
  'email',
  'arrivalDate',
  'tripLength',
  'tripStyle',
  'dayOperations',
  'bookAheadNeeded',
  'conversionSignal',
  'conversionScore',
  'conversionTier',
  'conversionNextAction',
  'conversionReasons',
  'bookingStatus',
  'bookedAt',
  'aiRequestCount',
  'aiLastRequestedAt',
  'aiLimitReachedAt'
];
const CRITICAL_AI_BUDGET_FIELDS = [
  'periodKey',
  'periodType',
  'periodLabel',
  'requestCount',
  'limit',
  'createdAt',
  'updatedAt',
  'limitReachedAt'
];

function usage() {
  console.log(`Usage:
  node ultimate-berlin-trip-planner/launch-remote-preflight.mjs
  node ultimate-berlin-trip-planner/launch-remote-preflight.mjs --out output/qa/ultimate-trip-planner-remote-preflight/check.json

Non-mutating remote checks:
  - GitHub Pages widget URL reachability
  - Wix dynamic tool URL reachability
  - Velo endpoint OPTIONS status
  - BerlinTools slug existence, when WIX_API_KEY is set
  - TripPlannerLeads and TripPlannerAiBudget collection existence and critical fields, when WIX_API_KEY is set

Load the Wix key from the workspace root first when you want CMS checks:
  source ../scripts/load-api-keys.sh
`);
}

function parseArgs(argv) {
  const options = { outPath: '' };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--out') {
      options.outPath = argv[index + 1] || '';
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function outputPath(options) {
  if (options.outPath) return path.resolve(process.cwd(), options.outPath);
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  return path.resolve(process.cwd(), OUTPUT_DIR, `remote-preflight-${stamp}.json`);
}

function wixHeaders(apiKey) {
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

async function fetchWithTimeout(url, options = {}, settings = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    const body = settings.keepBody === false ? null : await readBody(response);
    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      url,
      body
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      statusText: error && error.name === 'AbortError' ? 'timeout' : 'fetch_error',
      url,
      error: error && error.message ? error.message : String(error)
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function wixFetch(apiKey, apiPath, options = {}) {
  return await fetchWithTimeout(`${API_ROOT}${apiPath}`, {
    ...options,
    headers: {
      ...wixHeaders(apiKey),
      ...(options.headers || {})
    }
  });
}

function extractDataItemId(item) {
  return item?._id || item?.id || item?.dataItemId || item?.data?._id || null;
}

async function queryBerlinToolsSlug(apiKey) {
  const result = await wixFetch(apiKey, '/wix-data/v2/items/query', {
    method: 'POST',
    body: JSON.stringify({
      dataCollectionId: TOOL_COLLECTION_ID,
      query: {
        filter: { slug: TOOL_SLUG },
        paging: { limit: 3 }
      }
    })
  });

  const items = result.body && (result.body.dataItems || result.body.items) || [];
  return {
    ok: result.ok,
    status: result.status,
    count: Array.isArray(items) ? items.length : 0,
    itemIds: Array.isArray(items) ? items.map(extractDataItemId).filter(Boolean) : [],
    body: result.ok ? undefined : result.body
  };
}

async function getCollection(apiKey, collectionId) {
  const result = await wixFetch(apiKey, `/wix-data/v2/collections/${encodeURIComponent(collectionId)}`, {
    method: 'GET'
  });
  const collection = result.body && (result.body.collection || result.body.dataCollection || result.body);
  const fields = collection && (collection.fields || collection.fieldDefinitions) || [];
  const fieldList = Array.isArray(fields)
    ? fields
    : Object.entries(fields || {}).map(([key, value]) => ({ key, ...(typeof value === 'object' ? value : {}) }));
  const fieldKeys = fieldList.map((field) => field && (field.key || field.id || field.fieldKey)).filter(Boolean);
  const criticalFields = collectionId === COLLECTION_ID
    ? CRITICAL_COLLECTION_FIELDS
    : (collectionId === AI_BUDGET_COLLECTION_ID ? CRITICAL_AI_BUDGET_FIELDS : []);
  const missingCriticalFields = criticalFields.filter((key) => !fieldKeys.includes(key));

  return {
    ok: result.ok,
    status: result.status,
    fieldCount: fieldList.length,
    criticalFieldCount: criticalFields.length,
    missingCriticalFields,
    schemaOk: criticalFields.length ? result.ok && missingCriticalFields.length === 0 : result.ok,
    body: result.ok ? undefined : result.body
  };
}

function line(status, label, detail = '') {
  const suffix = detail ? ` - ${detail}` : '';
  console.log(`${status} ${label}${suffix}`);
}

function summarize(result) {
  const checks = result.checks;

  if (checks.githubWidget.status === 200) {
    line('OK', 'GitHub Pages widget is reachable', checks.githubWidget.url);
  } else {
    line('WARN', 'GitHub Pages widget is not reachable', `${checks.githubWidget.status} ${checks.githubWidget.statusText}`);
  }

  if (checks.liveToolPage.status === 200) {
    line('INFO', 'Wix dynamic tool URL returns 200', checks.liveToolPage.url);
  } else {
    line('INFO', 'Wix dynamic tool URL is not live yet', `${checks.liveToolPage.status} ${checks.liveToolPage.statusText}`);
  }

  for (const endpoint of ['leadOptions', 'aiOptions', 'bookingOptions']) {
    const check = checks[endpoint];
    const label = endpoint === 'leadOptions'
      ? 'tripPlannerLead OPTIONS'
      : (endpoint === 'aiOptions' ? 'tripPlannerAi OPTIONS' : 'tripPlannerBooking OPTIONS');
    if (check.status === 204) {
      line('OK', `${label} is live`);
    } else {
      line('INFO', `${label} is not published yet`, `${check.status} ${check.statusText}`);
    }
  }

  if (!checks.wixApiKeyPresent) {
    line('INFO', 'WIX_API_KEY is not loaded', 'CMS and collection checks skipped.');
    return;
  }

  if (checks.berlinToolsSlug.ok && checks.berlinToolsSlug.count === 0) {
    line('OK', 'BerlinTools slug is free', TOOL_SLUG);
  } else if (checks.berlinToolsSlug.ok) {
    line('INFO', 'BerlinTools slug already exists', checks.berlinToolsSlug.itemIds.join(', ') || `${checks.berlinToolsSlug.count} item(s)`);
  } else {
    line('WARN', 'BerlinTools slug check failed', `HTTP ${checks.berlinToolsSlug.status}`);
  }

  if (checks.tripPlannerCollection.ok && checks.tripPlannerCollection.schemaOk) {
    line('OK', 'TripPlannerLeads collection exists', `${checks.tripPlannerCollection.fieldCount} field(s) visible via API; critical fields verified`);
  } else if (checks.tripPlannerCollection.ok) {
    line('WARN', 'TripPlannerLeads collection schema needs attention', `missing ${checks.tripPlannerCollection.missingCriticalFields.join(', ')}`);
  } else {
    line('INFO', 'TripPlannerLeads collection not found yet', `HTTP ${checks.tripPlannerCollection.status}`);
  }

  if (checks.tripPlannerAiBudgetCollection.ok && checks.tripPlannerAiBudgetCollection.schemaOk) {
    line('OK', 'TripPlannerAiBudget collection exists', `${checks.tripPlannerAiBudgetCollection.fieldCount} field(s) visible via API; critical fields verified`);
  } else if (checks.tripPlannerAiBudgetCollection.ok) {
    line('WARN', 'TripPlannerAiBudget collection schema needs attention', `missing ${checks.tripPlannerAiBudgetCollection.missingCriticalFields.join(', ')}`);
  } else {
    line('INFO', 'TripPlannerAiBudget collection not found yet', `HTTP ${checks.tripPlannerAiBudgetCollection.status}`);
  }
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

  const wixApiKey = String(process.env.WIX_API_KEY || '').trim();
  const checks = {
    githubWidget: await fetchWithTimeout(
      `https://fenerszymanski.github.io/berlinwalk-widgets/${TOOL_SLUG}/?v=remote-preflight`,
      {},
      { keepBody: false }
    ),
    liveToolPage: await fetchWithTimeout(
      `https://www.berlinwalk.com/tools/${TOOL_SLUG}`,
      {
        headers: {
          Accept: 'text/html,application/xhtml+xml'
        }
      },
      { keepBody: false }
    ),
    leadOptions: await fetchWithTimeout(
      'https://www.berlinwalk.com/_functions/tripPlannerLead',
      { method: 'OPTIONS' },
      { keepBody: false }
    ),
    aiOptions: await fetchWithTimeout(
      'https://www.berlinwalk.com/_functions/tripPlannerAi',
      { method: 'OPTIONS' },
      { keepBody: false }
    ),
    bookingOptions: await fetchWithTimeout(
      'https://www.berlinwalk.com/_functions/tripPlannerBooking',
      { method: 'OPTIONS' },
      { keepBody: false }
    ),
    wixApiKeyPresent: Boolean(wixApiKey)
  };

  if (wixApiKey) {
    checks.berlinToolsSlug = await queryBerlinToolsSlug(wixApiKey);
    checks.tripPlannerCollection = await getCollection(wixApiKey, COLLECTION_ID);
    checks.tripPlannerAiBudgetCollection = await getCollection(wixApiKey, AI_BUDGET_COLLECTION_ID);
  }

  const result = {
    generatedAt: new Date().toISOString(),
    nonMutating: true,
    checks
  };
  const outPath = outputPath(options);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2) + '\n');
  summarize(result);
  console.log(`Result written to ${path.relative(process.cwd(), outPath)}`);
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exitCode = 1;
});
