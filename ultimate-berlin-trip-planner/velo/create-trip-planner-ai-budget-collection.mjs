#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const SITE_ID = '12ee5ea0-70a7-492f-8020-ffb27cbb630f';
const API_ROOT = 'https://www.wixapis.com';
const COLLECTION_ID = 'TripPlannerAiBudget';
const OUTPUT_DIR = 'output/qa/ultimate-trip-planner-ai-budget-collection';

const FIELD_DEFINITIONS = [
  ['periodKey', 'Period Key', 'TEXT'],
  ['periodType', 'Period Type', 'TEXT'],
  ['periodLabel', 'Period Label', 'TEXT'],
  ['requestCount', 'Request Count', 'NUMBER'],
  ['limit', 'Limit', 'NUMBER'],
  ['createdAt', 'Created At', 'DATETIME'],
  ['updatedAt', 'Updated At', 'DATETIME'],
  ['limitReachedAt', 'Limit Reached At', 'DATETIME']
];

function usage() {
  console.log(`Usage:
  node ultimate-berlin-trip-planner/velo/create-trip-planner-ai-budget-collection.mjs
  node ultimate-berlin-trip-planner/velo/create-trip-planner-ai-budget-collection.mjs --live
  node ultimate-berlin-trip-planner/velo/create-trip-planner-ai-budget-collection.mjs --live --sync-fields

Dry-run by default. Load WIX_API_KEY first:
  source ../scripts/load-api-keys.sh

Notes:
  This collection stores only daily/monthly Gemini spend counters. It does not
  need visitor email or lead data.
`);
}

function parseArgs(argv) {
  const options = {
    live: false,
    outPath: '',
    syncFields: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--live') {
      options.live = true;
    } else if (arg === '--sync-fields' || arg === '--sync-missing-fields') {
      options.syncFields = true;
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
  const mode = options.live ? (options.syncFields ? 'live-sync' : 'live') : 'dry-run';
  return path.resolve(process.cwd(), OUTPUT_DIR, `${mode}-${stamp}.json`);
}

function collectionPayload() {
  return {
    collection: {
      id: COLLECTION_ID,
      displayName: 'Trip Planner AI Budget',
      displayField: 'periodKey',
      fields: FIELD_DEFINITIONS.map(([key, displayName, type]) => ({ key, displayName, type })),
      permissions: {
        insert: 'ADMIN',
        update: 'ADMIN',
        remove: 'ADMIN',
        read: 'ADMIN'
      }
    }
  };
}

function headers() {
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
      ...headers(),
      ...(options.headers || {})
    }
  });
  const body = await readBody(response);
  return { response, body };
}

function collectionFrom(body) {
  return body && (body.collection || body.dataCollection || body);
}

function fieldsFrom(collection) {
  const fields = collection && (collection.fields || collection.fieldDefinitions) || [];
  if (Array.isArray(fields)) return fields;
  return Object.entries(fields).map(([key, value]) => ({ key, ...(typeof value === 'object' ? value : {}) }));
}

function fieldKey(field) {
  return field && (field.key || field.id || field.fieldKey) || '';
}

function expectedFieldMap() {
  return new Map(FIELD_DEFINITIONS.map(([key, displayName, type]) => [key, { key, displayName, type }]));
}

function verifyCollection(collection) {
  const fields = fieldsFrom(collection);
  const actual = new Map(fields.map((field) => [fieldKey(field), field]));
  const missing = [];
  const wrongType = [];

  for (const expected of expectedFieldMap().values()) {
    const actualField = actual.get(expected.key);
    if (!actualField) {
      missing.push(expected.key);
      continue;
    }
    if (actualField.type && actualField.type !== expected.type) {
      wrongType.push(`${expected.key}: expected ${expected.type}, got ${actualField.type}`);
    }
  }

  return {
    fieldCount: fields.length,
    expectedFieldCount: FIELD_DEFINITIONS.length,
    missing,
    wrongType
  };
}

async function getExistingCollection() {
  const { response, body } = await wixFetch(`/wix-data/v2/collections/${encodeURIComponent(COLLECTION_ID)}?consistentRead=true`, {
    method: 'GET'
  });
  if (response.status === 404) return { exists: false, status: response.status, body };
  if (!response.ok) throw new Error(`Collection read failed: ${response.status} ${JSON.stringify(body)}`);
  return {
    exists: true,
    status: response.status,
    collection: collectionFrom(body),
    body
  };
}

async function createCollection() {
  const { response, body } = await wixFetch('/wix-data/v2/collections', {
    method: 'POST',
    body: JSON.stringify(collectionPayload())
  });

  if (response.status === 409) return { alreadyExists: true, status: response.status, body };
  if (!response.ok) throw new Error(`Collection create failed: ${response.status} ${JSON.stringify(body)}`);

  return {
    created: true,
    status: response.status,
    collection: collectionFrom(body),
    body
  };
}

async function createCollectionField(field) {
  const { response, body } = await wixFetch('/wix-data/v2/collections/create-field', {
    method: 'POST',
    body: JSON.stringify({
      dataCollectionId: COLLECTION_ID,
      field
    })
  });

  if (!response.ok) {
    throw new Error(`Field create failed for ${field.key}: ${response.status} ${JSON.stringify(body)}`);
  }

  return {
    key: field.key,
    status: response.status,
    collection: collectionFrom(body),
    body
  };
}

async function syncMissingFields(missingKeys) {
  const expected = expectedFieldMap();
  const patched = [];
  for (const key of missingKeys) {
    const field = expected.get(key);
    if (!field) continue;
    const result = await createCollectionField(field);
    patched.push({
      key,
      status: result.status
    });
  }
  return patched;
}

function writeResult(options, result) {
  const outPath = outputPath(options);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2) + '\n');
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

  const planned = collectionPayload();
  const result = {
    mode: options.live ? 'live' : 'dry-run',
    generatedAt: new Date().toISOString(),
    collectionId: COLLECTION_ID,
    plannedFieldCount: FIELD_DEFINITIONS.length,
    permissions: planned.collection.permissions,
    syncFields: options.syncFields,
    created: false,
    existing: null,
    verification: null,
    verificationBeforeSync: null,
    syncedFields: []
  };

  if (!options.live) {
    const outPath = writeResult(options, { ...result, planned });
    console.log(`DRY RUN: ${COLLECTION_ID}`);
    console.log(`Fields: ${FIELD_DEFINITIONS.length}`);
    console.log('Permissions: read/insert/update/remove = ADMIN');
    console.log(`Result written to ${path.relative(process.cwd(), outPath)}`);
    return;
  }

  const existingBefore = await getExistingCollection();
  result.existing = existingBefore.exists;

  if (!existingBefore.exists) {
    const created = await createCollection();
    result.created = Boolean(created.created);
    result.createStatus = created.status;
  }

  const existingAfter = await getExistingCollection();
  if (!existingAfter.exists) throw new Error(`${COLLECTION_ID} was not found after create attempt.`);

  result.verification = verifyCollection(existingAfter.collection);
  result.verificationBeforeSync = result.verification;

  if (options.syncFields && result.verification.missing.length) {
    result.syncedFields = await syncMissingFields(result.verification.missing);
    const afterSync = await getExistingCollection();
    result.verification = verifyCollection(afterSync.collection);
  }

  const outPath = writeResult(options, result);
  const problems = [
    ...result.verification.missing.map((field) => `missing ${field}`),
    ...result.verification.wrongType
  ];

  if (problems.length) {
    console.log(`${COLLECTION_ID} exists but schema needs attention:`);
    for (const problem of problems) console.log(`- ${problem}`);
    if (result.verification.missing.length && !options.syncFields) {
      console.log('Run again with --live --sync-fields to patch missing collection fields.');
    }
    console.log(`Result written to ${path.relative(process.cwd(), outPath)}`);
    process.exitCode = 1;
    return;
  }

  console.log(`${result.created ? 'CREATED' : 'OK'}: ${COLLECTION_ID}`);
  console.log(`Fields verified: ${result.verification.expectedFieldCount}`);
  if (result.syncedFields.length) {
    console.log(`Synced fields: ${result.syncedFields.map((field) => field.key).join(', ')}`);
  }
  console.log(`Result written to ${path.relative(process.cwd(), outPath)}`);
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exitCode = 1;
});
