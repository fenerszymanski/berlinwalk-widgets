#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_ID = '12ee5ea0-70a7-492f-8020-ffb27cbb630f';
const API_ROOT = 'https://www.wixapis.com';
const COLLECTION_ID = 'TripPlannerLeads';
const AI_BUDGET_COLLECTION_ID = 'TripPlannerAiBudget';
const OUTPUT_DIR = 'output/qa/ultimate-trip-planner-prepublish-gate';
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

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const widgetRoot = path.resolve(scriptDir, '..');
const manifestPath = path.join(widgetRoot, 'email/paste-ready/manifest.json');
const defaultIdsPath = path.join(widgetRoot, 'email/paste-ready/message-ids.local.json');
const funnelPath = path.join(scriptDir, 'tripPlannerFunnel.js');
const httpFunctionsPath = path.join(scriptDir, 'http-functions.js');
const jobsConfigPath = path.join(scriptDir, 'jobs.config');
const emailMarketingSubscriptionPath = path.join(scriptDir, 'emailMarketingSubscription.js');

function usage() {
  console.log(`Usage:
  node ultimate-berlin-trip-planner/velo/prepublish-gate.mjs
  node ultimate-berlin-trip-planner/velo/prepublish-gate.mjs --ids ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json
  node ultimate-berlin-trip-planner/velo/prepublish-gate.mjs --json

Run after the 5 Triggered Email IDs have been applied, before pasting Velo into Wix.
Load WIX_API_KEY first so the live TripPlannerLeads collection can be verified:
  source ../scripts/load-api-keys.sh
`);
}

function parseArgs(argv) {
  const options = {
    idsPath: defaultIdsPath,
    outPath: '',
    json: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--ids') {
      options.idsPath = argv[index + 1] || '';
      index += 1;
    } else if (arg === '--out') {
      options.outPath = argv[index + 1] || '';
      index += 1;
    } else if (arg === '--json') {
      options.json = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  options.idsPath = path.resolve(process.cwd(), options.idsPath || defaultIdsPath);
  return options;
}

function outputPath(options) {
  if (options.outPath) return path.resolve(process.cwd(), options.outPath);
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  return path.resolve(process.cwd(), OUTPUT_DIR, `prepublish-gate-${stamp}.json`);
}

function normalizeMessageId(value) {
  const raw = String(value || '').trim();
  const urlMatch = raw.match(/\/automations\/edit\/([^/?#]+)\/content(?:\/[a-z]{2})?/i);
  if (urlMatch) return decodeURIComponent(urlMatch[1]).trim();
  return raw;
}

function validateMessageId(id) {
  if (!id) return 'missing';
  if (/TODO|PASTE|REPLACE|MESSAGE_ID|YOUR-/i.test(id)) return 'still looks like a placeholder';
  if (/\s/.test(id)) return 'contains whitespace';
  if (/[<>{}'"]/.test(id)) return 'contains unsafe punctuation';
  if (id.length < 6 || id.length > 120) return 'unexpected length';
  return '';
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function inspectIds(idsPath) {
  const manifest = readJson(manifestPath);
  const idsFileExists = fs.existsSync(idsPath);
  const ids = idsFileExists ? readJson(idsPath) : {};
  const funnel = fs.readFileSync(funnelPath, 'utf8');
  const rows = manifest.map((item) => {
    const raw = String(ids[item.placeholder] || '').trim();
    const id = normalizeMessageId(raw);
    const reason = idsFileExists ? validateMessageId(id) : 'ID file missing';
    const placeholderPresent = funnel.includes(`'${item.placeholder}'`);
    const applied = Boolean(id && funnel.includes(`'${id}'`) && !placeholderPresent);
    return {
      path: item.path,
      stage: item.stage,
      placeholder: item.placeholder,
      html: item.html,
      raw,
      id,
      reason,
      duplicate: '',
      applied,
      placeholderPresent
    };
  });

  const byId = new Map();
  for (const row of rows) {
    if (row.reason || !row.id) continue;
    if (!byId.has(row.id)) byId.set(row.id, []);
    byId.get(row.id).push(row.placeholder);
  }
  for (const group of byId.values()) {
    if (group.length < 2) continue;
    const detail = `duplicate ID shared by ${group.join(', ')}`;
    for (const row of rows) {
      if (group.includes(row.placeholder)) row.duplicate = detail;
    }
  }

  return {
    idsFileExists,
    total: rows.length,
    valid: rows.filter((row) => !row.reason && !row.duplicate).length,
    applied: rows.filter((row) => row.applied).length,
    missing: rows.filter((row) => /missing/i.test(row.reason)).length,
    invalid: rows.filter((row) => row.reason && !/missing/i.test(row.reason)).length,
    duplicate: rows.filter((row) => row.duplicate).length,
    rows
  };
}

function inspectSource() {
  const funnel = fs.readFileSync(funnelPath, 'utf8');
  const httpFunctions = fs.readFileSync(httpFunctionsPath, 'utf8');
  const jobsConfig = fs.readFileSync(jobsConfigPath, 'utf8');
  const emailMarketingSubscription = fs.existsSync(emailMarketingSubscriptionPath)
    ? fs.readFileSync(emailMarketingSubscriptionPath, 'utf8')
    : '';
  const todos = [...new Set([...funnel.matchAll(/TODO_TRIP_PLANNER_[A-Z0-9_]+/g)].map((match) => match[0]))].sort();
  const aiPayloadValidatorStart = funnel.indexOf('function validateAiEnhancementPayload');
  const aiPayloadValidatorEnd = funnel.indexOf('async function readFirstSecret', aiPayloadValidatorStart);
  const aiPayloadValidator = aiPayloadValidatorStart >= 0 && aiPayloadValidatorEnd > aiPayloadValidatorStart
    ? funnel.slice(aiPayloadValidatorStart, aiPayloadValidatorEnd)
    : '';

  return {
    todos,
    hasLeadEndpoint: /export\s+async\s+function\s+post_tripPlannerLead/.test(httpFunctions) &&
      /export\s+function\s+options_tripPlannerLead/.test(httpFunctions),
    hasAiEndpoint: /export\s+async\s+function\s+post_tripPlannerAi/.test(httpFunctions) &&
      /export\s+function\s+options_tripPlannerAi/.test(httpFunctions) &&
      /enhanceTripPlannerPlan/.test(httpFunctions),
    hasBookingEndpoint: /export\s+async\s+function\s+post_tripPlannerBooking/.test(httpFunctions) &&
      /export\s+function\s+options_tripPlannerBooking/.test(httpFunctions),
    hasEmailMarketingSubscription: /import\s+\{\s*subscribeEmailMarketing\s*\}\s+from\s+['"]backend\/emailMarketingSubscription['"]/.test(funnel) &&
      /subscribeLeadEmailMarketing/.test(funnel) &&
      /subscriptionDebug/.test(funnel) &&
      /subscribed/.test(funnel) &&
      /export\s+async\s+function\s+subscribeEmailMarketing/.test(emailMarketingSubscription) &&
      /email-marketing\/v1\/email-subscriptions/.test(emailMarketingSubscription) &&
      /subscriptionStatus:\s*'SUBSCRIBED'/.test(emailMarketingSubscription),
    hasGeminiBackend: /export\s+async\s+function\s+enhanceTripPlannerPlan/.test(funnel) &&
      /GEMINI_API_KEY/.test(funnel) &&
      /gemini-2\.5-flash/.test(funnel) &&
      /responseJsonSchema/.test(funnel) &&
      /maxOutputTokens:\s*1200/.test(funnel) &&
      /thinkingBudget:\s*0/.test(funnel) &&
      /missing_api_key/.test(funnel) &&
      /AI_DAILY_GENERATION_LIMIT\s*=\s*5000/.test(funnel) &&
      /AI_MONTHLY_GENERATION_LIMIT\s*=\s*AI_DAILY_GENERATION_LIMIT\s*\*\s*30/.test(funnel),
    hasAiPrivacyScrub: /PRIVATE_TEXT_PATTERN/.test(funnel) &&
      /cleanPublicPlannerText/.test(funnel) &&
      /cleanPublicPlannerRecord/.test(aiPayloadValidator) &&
      /cleanPublicPlannerList/.test(aiPayloadValidator),
    aiPayloadAvoidsEmail: Boolean(aiPayloadValidator) && !/\bemail\b/i.test(aiPayloadValidator),
    hasAiQuotaGuard: /AI_GENERATION_LIMIT\s*=\s*2/.test(funnel) &&
      /AI_BUDGET_COLLECTION\s*=\s*'TripPlannerAiBudget'/.test(funnel) &&
      /function\s+checkAiLeadQuota/.test(funnel) &&
      /function\s+claimAiLeadQuota/.test(funnel) &&
      /function\s+claimAiBudget/.test(funnel) &&
      /aiRequestCount/.test(funnel) &&
      /aiLastRequestedAt/.test(funnel) &&
      /aiLimitReachedAt/.test(funnel) &&
      /ai_budget_daily_limit/.test(funnel) &&
      /ai_budget_monthly_limit/.test(funnel) &&
      /quotaEmail/.test(funnel),
    hasScheduler: /processTripPlannerDueEmails/.test(jobsConfig) &&
      /"cronExpression"\s*:\s*"0 \* \* \* \*"/.test(jobsConfig),
    bookedSuppression: /shouldSuppressUltimateReminder/.test(funnel) &&
      /booked_existing_sequence/.test(funnel) &&
      !/bookedMessageId/.test(funnel)
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

function criticalFieldsFor(collectionId) {
  if (collectionId === COLLECTION_ID) return CRITICAL_COLLECTION_FIELDS;
  if (collectionId === AI_BUDGET_COLLECTION_ID) return CRITICAL_AI_BUDGET_FIELDS;
  return [];
}

async function fetchCollection(apiKey, collectionId) {
  const response = await fetch(`${API_ROOT}/wix-data/v2/collections/${encodeURIComponent(collectionId)}?consistentRead=true`, {
    method: 'GET',
    headers: {
      Authorization: apiKey,
      'wix-site-id': SITE_ID,
      'Content-Type': 'application/json'
    }
  });
  const body = await readBody(response);
  const collection = body && (body.collection || body.dataCollection || body);
  const fields = collection && (collection.fields || collection.fieldDefinitions) || [];
  const fieldList = Array.isArray(fields)
    ? fields
    : Object.entries(fields || {}).map(([key, value]) => ({ key, ...(typeof value === 'object' ? value : {}) }));
  const fieldKeys = fieldList.map((field) => field && (field.key || field.id || field.fieldKey)).filter(Boolean);
  const criticalFields = criticalFieldsFor(collectionId);
  const missingCriticalFields = criticalFields.filter((key) => !fieldKeys.includes(key));

  return {
    ok: response.ok,
    status: response.status,
    fieldCount: fieldList.length,
    collectionId,
    missingCriticalFields,
    schemaOk: response.ok && missingCriticalFields.length === 0,
    body: response.ok ? undefined : body
  };
}

function check(name, ok, detail, status = 'BLOCK') {
  return {
    name,
    ok: Boolean(ok),
    status: ok ? 'PASS' : status,
    detail
  };
}

function writeResult(options, result) {
  const outPath = outputPath(options);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2) + '\n');
  return outPath;
}

function printText(result, outPath) {
  console.log('Ultimate Trip Planner Velo Pre-publish Gate');
  for (const item of result.checks) {
    console.log(`${item.status} ${item.name} - ${item.detail}`);
  }
  console.log('');
  console.log(`Summary: ${result.summary.pass} pass, ${result.summary.warn} warn, ${result.summary.block} block`);
  console.log(`Ready for Velo paste: ${result.readyForVeloPaste ? 'YES' : 'NO'}`);
  console.log(`Result written to ${path.relative(process.cwd(), outPath)}`);
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

  const idState = inspectIds(options.idsPath);
  const sourceState = inspectSource();
  const checks = [
    check('Triggered Email ID file exists', idState.idsFileExists, idState.idsFileExists ? options.idsPath : 'message-ids.local.json is missing'),
    check('All 5 IDs are valid and unique', idState.valid === idState.total && idState.duplicate === 0, `${idState.valid}/${idState.total} valid, duplicate rows ${idState.duplicate}`),
    check('All 5 IDs are applied in tripPlannerFunnel.js', idState.applied === idState.total, `${idState.applied}/${idState.total} applied`),
    check('No TODO_TRIP_PLANNER placeholders remain', sourceState.todos.length === 0, sourceState.todos.length ? sourceState.todos.join(', ') : 'no placeholders found'),
    check('Velo HTTP endpoints are present', sourceState.hasLeadEndpoint && sourceState.hasBookingEndpoint, 'tripPlannerLead and tripPlannerBooking handlers'),
    check('Email Marketing subscription helper is wired', sourceState.hasEmailMarketingSubscription, 'consenting leads call subscribeEmailMarketing and expose subscriptionDebug'),
    check('Velo AI polish endpoint is present', sourceState.hasAiEndpoint, 'tripPlannerAi options/post handlers call enhanceTripPlannerPlan'),
    check('Gemini backend is fail-soft and bounded', sourceState.hasGeminiBackend, 'Gemini 2.5 Flash, backend-only secret names, responseJsonSchema, maxOutputTokens 1200, thinkingBudget 0, missing-key fallback'),
    check('AI enhancement payload is privacy-scrubbed', sourceState.hasAiPrivacyScrub, 'Gemini-bound text fields drop private-looking text before prompt assembly'),
    check('AI enhancement payload avoids email', sourceState.aiPayloadAvoidsEmail, 'validateAiEnhancementPayload should not accept or forward email/PII to Gemini'),
    check('AI quota guard is backend-enforced', sourceState.hasAiQuotaGuard, 'email + arrival date max 2 Gemini generations before quota fallback'),
    check('Hourly scheduler is present', sourceState.hasScheduler, 'processTripPlannerDueEmails hourly job'),
    check('Booked leads suppress Ultimate reminders', sourceState.bookedSuppression, 'existing Wix booking sequence owns booked-guest prep')
  ];

  const apiKey = String(process.env.WIX_API_KEY || '').trim();
  let collection = null;
  let aiBudgetCollection = null;
  if (!apiKey) {
    checks.push(check('WIX_API_KEY is loaded for remote collection gate', false, 'Run: source ../scripts/load-api-keys.sh'));
  } else {
    collection = await fetchCollection(apiKey, COLLECTION_ID);
    checks.push(check(
      'TripPlannerLeads critical fields pass remote gate',
      collection.schemaOk,
      collection.schemaOk ? `${collection.fieldCount} fields visible; critical fields verified` : `HTTP ${collection.status}; missing ${collection.missingCriticalFields.join(', ') || '(unknown)'}`
    ));
    aiBudgetCollection = await fetchCollection(apiKey, AI_BUDGET_COLLECTION_ID);
    checks.push(check(
      'TripPlannerAiBudget critical fields pass remote gate',
      aiBudgetCollection.schemaOk,
      aiBudgetCollection.schemaOk ? `${aiBudgetCollection.fieldCount} fields visible; critical fields verified` : `HTTP ${aiBudgetCollection.status}; missing ${aiBudgetCollection.missingCriticalFields.join(', ') || '(unknown)'}`
    ));
  }

  const summary = {
    pass: checks.filter((item) => item.status === 'PASS').length,
    warn: checks.filter((item) => item.status === 'WARN').length,
    block: checks.filter((item) => item.status === 'BLOCK').length
  };
  const result = {
    generatedAt: new Date().toISOString(),
    readyForVeloPaste: summary.block === 0,
    idsPath: options.idsPath,
    idState,
    sourceState,
    collection,
    aiBudgetCollection,
    checks,
    summary
  };
  const outPath = writeResult(options, result);

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    printText(result, outPath);
  }

  if (!result.readyForVeloPaste) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exitCode = 1;
});
