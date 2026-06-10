#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const widgetRoot = path.resolve(scriptDir, '..');
const repoRoot = path.resolve(widgetRoot, '..');
const funnelPath = path.join(scriptDir, 'tripPlannerFunnel.js');
const manifestPath = path.join(widgetRoot, 'email/paste-ready/manifest.json');
const defaultIdsPath = path.join(widgetRoot, 'email/paste-ready/message-ids.local.json');
const defaultBackupDir = path.join(repoRoot, 'output/qa/ultimate-trip-planner-email-id-apply');

function usage() {
  console.log(`Usage:
  node ultimate-berlin-trip-planner/velo/apply-triggered-email-ids.mjs --ids ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json
  node ultimate-berlin-trip-planner/velo/apply-triggered-email-ids.mjs --ids ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json --write
  node ultimate-berlin-trip-planner/velo/apply-triggered-email-ids.mjs --ids ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json --write --no-backup

The ID file can use either Velo placeholder keys:
  { "TODO_TRIP_PLANNER_INSTANT": "your-message-id" }

or path/stage keys:
  { "prep.instant": "your-message-id" }

Dashboard edit URLs are accepted too. The script extracts the messageId from
URLs shaped like /automations/edit/{MESSAGE_ID}/content/en.

Write mode creates a timestamped local backup under:
  output/qa/ultimate-trip-planner-email-id-apply/

For local QA only, pass --funnel /path/to/temp-tripPlannerFunnel.js.
`);
}

function parseArgs(argv) {
  const options = {
    idsPath: '',
    write: false,
    backup: true,
    backupDir: defaultBackupDir,
    funnelPath
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--write') {
      options.write = true;
    } else if (arg === '--no-backup') {
      options.backup = false;
    } else if (arg === '--backup-dir') {
      options.backupDir = argv[index + 1] || '';
      index += 1;
    } else if (arg === '--funnel') {
      options.funnelPath = argv[index + 1] || '';
      index += 1;
    } else if (arg === '--ids') {
      options.idsPath = argv[index + 1] || '';
      index += 1;
    } else if (!options.idsPath) {
      options.idsPath = arg;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!options.idsPath) options.idsPath = defaultIdsPath;
  options.idsPath = path.resolve(process.cwd(), options.idsPath);
  options.backupDir = path.resolve(process.cwd(), options.backupDir || defaultBackupDir);
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
    if (Object.prototype.hasOwnProperty.call(ids, key)) return ids[key];
  }

  return '';
}

function validateMessageId(id) {
  if (!id) return 'missing';
  if (/TODO|PASTE|REPLACE|MESSAGE_ID|YOUR-/i.test(id)) return 'still looks like a placeholder';
  if (/\s/.test(id)) return 'contains whitespace';
  if (/[<>{}'"]/.test(id)) return 'contains unsafe punctuation';
  if (id.length < 6 || id.length > 120) return 'unexpected length';
  return '';
}

function backupFileName(targetPath) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const base = path.basename(targetPath).replace(/\.js$/, '');
  return `${base}.before-email-ids-${stamp}.js`;
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

  if (!fs.existsSync(options.idsPath)) {
    console.error(`ID file not found: ${options.idsPath}`);
    console.error(`Use message-ids.template.json as the shape, then run this script again.`);
    process.exitCode = 1;
    return;
  }

  const manifest = readJson(manifestPath);
  const ids = readJson(options.idsPath);
  let source = fs.readFileSync(options.funnelPath, 'utf8');
  const replacements = [];
  const errors = [];
  const seenIds = new Map();

  for (const item of manifest) {
    const id = normalizeMessageId(valueFor(ids, item));
    const reason = validateMessageId(id);
    if (reason) {
      errors.push(`${item.placeholder}: ${reason}`);
      continue;
    }

    if (seenIds.has(id)) {
      errors.push(`${item.placeholder}: duplicate ID also used by ${seenIds.get(id)}`);
    } else {
      seenIds.set(id, item.placeholder);
    }

    if (source.indexOf(`'${item.placeholder}'`) === -1) {
      errors.push(`${item.placeholder}: placeholder not found in ${path.basename(options.funnelPath)}`);
      continue;
    }

    replacements.push({
      placeholder: item.placeholder,
      id,
      path: item.path,
      stage: item.stage
    });
  }

  if (errors.length) {
    console.error('Cannot apply Triggered Email IDs:');
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }

  for (const replacement of replacements) {
    source = source.replaceAll(`'${replacement.placeholder}'`, `'${replacement.id}'`);
  }

  const mode = options.write ? 'WRITE' : 'DRY RUN';
  console.log(`${mode}: ${replacements.length} Triggered Email IDs validated.`);
  for (const replacement of replacements) {
    console.log(`- ${replacement.path}.${replacement.stage}: ${replacement.placeholder} -> ${replacement.id}`);
  }

  if (!options.write) {
    console.log('');
    console.log('No files changed. Re-run with --write to update tripPlannerFunnel.js.');
    return;
  }

  let backupPath = '';
  if (options.backup) {
    fs.mkdirSync(options.backupDir, { recursive: true });
    backupPath = path.join(options.backupDir, backupFileName(options.funnelPath));
    fs.writeFileSync(backupPath, fs.readFileSync(options.funnelPath, 'utf8'));
  }

  fs.writeFileSync(options.funnelPath, source);
  console.log('');
  if (backupPath) console.log(`Backup: ${path.relative(process.cwd(), backupPath)}`);
  console.log(`Updated ${path.relative(process.cwd(), options.funnelPath)}`);
  console.log('Next: node ultimate-berlin-trip-planner/launch-audit.mjs');
}

main();
