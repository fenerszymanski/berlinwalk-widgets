#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const widgetRoot = path.resolve(scriptDir, '..');
const manifestPath = path.join(widgetRoot, 'email/paste-ready/manifest.json');
const defaultIdsPath = path.join(widgetRoot, 'email/paste-ready/message-ids.local.json');
const funnelPath = path.join(scriptDir, 'tripPlannerFunnel.js');

function usage() {
  console.log(`Usage:
  node ultimate-berlin-trip-planner/velo/check-triggered-email-ids.mjs
  node ultimate-berlin-trip-planner/velo/check-triggered-email-ids.mjs --ids ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json
  node ultimate-berlin-trip-planner/velo/check-triggered-email-ids.mjs --require-applied
  node ultimate-berlin-trip-planner/velo/check-triggered-email-ids.mjs --funnel /path/to/temp-tripPlannerFunnel.js --require-applied
  node ultimate-berlin-trip-planner/velo/check-triggered-email-ids.mjs --json

This read-only helper validates the local message-ID file before applying IDs.
It accepts raw Wix Triggered Email message IDs or editor URLs shaped like
/automations/edit/{MESSAGE_ID}/content/en.
`);
}

function parseArgs(argv) {
  const options = {
    idsPath: '',
    funnelPath,
    json: false,
    requireApplied: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--ids') {
      options.idsPath = argv[index + 1] || '';
      index += 1;
    } else if (arg === '--json') {
      options.json = true;
    } else if (arg === '--require-applied') {
      options.requireApplied = true;
    } else if (arg === '--funnel') {
      options.funnelPath = argv[index + 1] || '';
      index += 1;
    } else if (!options.idsPath) {
      options.idsPath = arg;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!options.idsPath) options.idsPath = defaultIdsPath;
  options.idsPath = path.resolve(process.cwd(), options.idsPath);
  options.funnelPath = path.resolve(process.cwd(), options.funnelPath || funnelPath);
  return options;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function normalizeMessageId(value) {
  const raw = String(value || '').trim();
  const urlMatch = raw.match(/\/automations\/edit\/([^/?#]+)\/content(?:\/[a-z]{2})?/i);
  if (urlMatch) return decodeURIComponent(urlMatch[1]).trim();
  return raw;
}

function valueFor(ids, item) {
  const keys = [
    item.placeholder,
    `${item.path}.${item.stage}`,
    `${item.path}_${item.stage}`,
    `${item.path}-${item.stage}`
  ];

  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(ids, key)) {
      return {
        key,
        value: ids[key]
      };
    }
  }

  return {
    key: item.placeholder,
    value: ''
  };
}

function validateMessageId(id) {
  if (!id) return 'missing';
  if (/TODO|PASTE|REPLACE|MESSAGE_ID|YOUR-/i.test(id)) return 'still looks like a placeholder';
  if (/\s/.test(id)) return 'contains whitespace';
  if (/[<>{}'"]/.test(id)) return 'contains unsafe punctuation';
  if (id.length < 6 || id.length > 120) return 'unexpected length';
  return '';
}

function stageLabel(stage) {
  const labels = {
    instant: 'instant',
    minus7: '7 days before',
    minus3: '3 days before',
    minus1: '1 day before',
    dayOf: 'arrival day'
  };
  return labels[stage] || stage;
}

function inspect(options) {
  const manifest = readJson(manifestPath);
  const idsFileExists = fs.existsSync(options.idsPath);
  const ids = idsFileExists ? readJson(options.idsPath) : {};
  const funnel = fs.existsSync(options.funnelPath) ? fs.readFileSync(options.funnelPath, 'utf8') : '';

  const rows = manifest.map((item) => {
    const { key, value } = valueFor(ids, item);
    const raw = String(value || '').trim();
    const id = normalizeMessageId(raw);
    const reason = idsFileExists ? validateMessageId(id) : 'ID file missing';
    const placeholderPresent = funnel.includes(`'${item.placeholder}'`);
    const applied = Boolean(id && funnel.includes(`'${id}'`));

    return {
      branch: item.path,
      stage: item.stage,
      stageLabel: stageLabel(item.stage),
      placeholder: item.placeholder,
      html: item.html,
      subject: item.subject,
      inputKey: key,
      raw,
      id,
      reason,
      placeholderPresent,
      applied,
      duplicate: ''
    };
  });

  const byId = new Map();
  for (const row of rows) {
    if (row.reason || !row.id) continue;
    if (!byId.has(row.id)) byId.set(row.id, []);
    byId.get(row.id).push(row);
  }

  for (const group of byId.values()) {
    if (group.length < 2) continue;
    const placeholders = group.map((row) => row.placeholder).join(', ');
    for (const row of group) {
      row.duplicate = `duplicate ID shared by ${placeholders}`;
    }
  }

  const validRows = rows.filter((row) => !row.reason && !row.duplicate);
  const missingRows = rows.filter((row) => /missing/i.test(row.reason));
  const invalidRows = rows.filter((row) => row.reason && !/missing/i.test(row.reason));
  const duplicateRows = rows.filter((row) => row.duplicate);
  const appliedRows = rows.filter((row) => row.applied && !row.placeholderPresent);
  const pendingApplyRows = validRows.filter((row) => row.placeholderPresent);

  const ok = idsFileExists &&
    validRows.length === rows.length &&
    duplicateRows.length === 0 &&
    (!options.requireApplied || appliedRows.length === rows.length);

  return {
    ok,
    idsPath: options.idsPath,
    funnelPath: options.funnelPath,
    idsFileExists,
    requireApplied: options.requireApplied,
    summary: {
      total: rows.length,
      valid: validRows.length,
      missing: missingRows.length,
      invalid: invalidRows.length,
      duplicate: duplicateRows.length,
      applied: appliedRows.length,
      pendingApply: pendingApplyRows.length
    },
    rows
  };
}

function statusFor(row) {
  if (row.duplicate) return 'DUPLICATE';
  if (row.reason) return row.reason.toUpperCase();
  if (row.applied && !row.placeholderPresent) return 'APPLIED';
  if (row.placeholderPresent) return 'VALID, NOT APPLIED';
  return 'VALID, FUNNEL CHECK UNKNOWN';
}

function printText(result) {
  console.log('Triggered Email ID Progress');
  console.log(`IDs file: ${result.idsPath}`);
  console.log(`Funnel file: ${result.funnelPath}`);
  console.log(`IDs file exists: ${result.idsFileExists ? 'yes' : 'no'}`);
  console.log(`Valid IDs: ${result.summary.valid}/${result.summary.total}`);
  console.log(`Missing: ${result.summary.missing}, invalid: ${result.summary.invalid}, duplicate: ${result.summary.duplicate}`);
  console.log(`Applied in Velo: ${result.summary.applied}/${result.summary.total}`);
  if (result.requireApplied) console.log('Require applied mode: yes');
  console.log('');

  for (const row of result.rows) {
    const label = `${row.branch}.${row.stage}`;
    const idLabel = row.id || '(empty)';
    const source = row.raw && row.raw !== row.id ? 'URL -> ' : '';
    const detail = row.duplicate || row.reason || '';
    console.log(`- ${label.padEnd(15)} ${statusFor(row)}`);
    console.log(`  placeholder: ${row.placeholder}`);
    console.log(`  html: ${row.html}`);
    console.log(`  id: ${source}${idLabel}`);
    if (detail) console.log(`  issue: ${detail}`);
  }

  console.log('');
  if (result.ok) {
    if (result.requireApplied) {
      console.log(`OK: all ${result.summary.total} IDs are valid and applied in tripPlannerFunnel.js.`);
    } else {
      console.log(`OK: all ${result.summary.total} IDs are valid. Next dry-run apply-triggered-email-ids.mjs, then run with --write.`);
    }
  } else if (!result.idsFileExists) {
    console.log('Next: create email/paste-ready/message-ids.local.json from the copy-kit JSON builder.');
  } else if (result.summary.valid === result.summary.total && result.summary.pendingApply > 0) {
    console.log('Next: run apply-triggered-email-ids.mjs in dry-run, then with --write.');
  } else {
    console.log('Next: fix the rows marked missing, invalid, or duplicate before applying IDs.');
  }
}

function main() {
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

  let result;
  try {
    result = inspect(options);
  } catch (error) {
    console.error(`Could not inspect Triggered Email IDs: ${error.message}`);
    process.exitCode = 1;
    return;
  }

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    printText(result);
  }

  process.exitCode = result.ok ? 0 : 1;
}

main();
