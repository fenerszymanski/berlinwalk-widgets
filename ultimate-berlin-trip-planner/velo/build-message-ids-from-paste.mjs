#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const widgetRoot = path.resolve(scriptDir, '..');
const manifestPath = path.join(widgetRoot, 'email/paste-ready/manifest.json');
const defaultOutPath = path.join(widgetRoot, 'email/paste-ready/message-ids.local.json');

function usage() {
  console.log(`Usage:
  node ultimate-berlin-trip-planner/velo/build-message-ids-from-paste.mjs --from /path/to/raw-urls.txt
  node ultimate-berlin-trip-planner/velo/build-message-ids-from-paste.mjs --from /path/to/raw-urls.txt --write
  pbpaste | node ultimate-berlin-trip-planner/velo/build-message-ids-from-paste.mjs --write

Paste either:
  - 10 raw Wix editor URLs / message IDs in manifest order
  - lines containing placeholders, for example:
    TODO_TRIP_PLANNER_INSTANT: https://manage.wix.com/.../automations/edit/abc123/content/en

Dry-run is the default. Use --write to create message-ids.local.json.
`);
}

function parseArgs(argv) {
  const options = {
    fromPath: '',
    outPath: defaultOutPath,
    write: false,
    json: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--from') {
      options.fromPath = argv[index + 1] || '';
      index += 1;
    } else if (arg === '--out') {
      options.outPath = argv[index + 1] || '';
      index += 1;
    } else if (arg === '--write') {
      options.write = true;
    } else if (arg === '--json') {
      options.json = true;
    } else if (!options.fromPath) {
      options.fromPath = arg;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  options.fromPath = options.fromPath ? path.resolve(process.cwd(), options.fromPath) : '';
  options.outPath = path.resolve(process.cwd(), options.outPath || defaultOutPath);
  return options;
}

function readInput(options) {
  if (options.fromPath) return fs.readFileSync(options.fromPath, 'utf8');
  if (process.stdin.isTTY) return '';
  return fs.readFileSync(0, 'utf8');
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function normalizeMessageId(value) {
  const raw = String(value || '').trim();
  const urlMatch = raw.match(/\/automations\/edit\/([^/?#\s]+)\/content(?:\/[a-z]{2})?/i);
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

function stripTrailingPunctuation(value) {
  return String(value || '').replace(/[),.;]+$/g, '').trim();
}

function extractValue(line) {
  const url = line.match(/https?:\/\/\S+/i);
  if (url) return stripTrailingPunctuation(url[0]);

  const editorPath = line.match(/\/automations\/edit\/\S+/i);
  if (editorPath) return stripTrailingPunctuation(editorPath[0]);

  const afterPlaceholder = line.replace(/TODO_TRIP_PLANNER_[A-Z0-9_]+/g, '').replace(/^[\s:=\-–—]+/, '').trim();
  const cleaned = afterPlaceholder
    .replace(/^\s*[-*]?\s*\d+[.)-]?\s*/, '')
    .replace(/^[A-Za-z][A-Za-z0-9 /._-]{2,60}:\s*/, '')
    .trim();
  return stripTrailingPunctuation(cleaned);
}

function parseRawInput(raw, manifest) {
  const placeholders = manifest.map((item) => item.placeholder);
  const ids = {};
  const labelled = new Set();
  const sequential = [];

  const lines = String(raw || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));

  for (const line of lines) {
    const placeholder = placeholders.find((candidate) => line.includes(candidate));
    const value = extractValue(line);
    if (!value) continue;

    if (placeholder) {
      ids[placeholder] = value;
      labelled.add(placeholder);
    } else {
      sequential.push(value);
    }
  }

  let index = 0;
  for (const item of manifest) {
    if (Object.prototype.hasOwnProperty.call(ids, item.placeholder)) continue;
    ids[item.placeholder] = sequential[index] || '';
    index += 1;
  }

  return {
    ids,
    labelled: [...labelled],
    sequentialUsed: index,
    extraSequential: sequential.slice(index),
    lineCount: lines.length
  };
}

function inspectIds(ids, manifest) {
  const rows = manifest.map((item) => {
    const raw = String(ids[item.placeholder] || '').trim();
    const id = normalizeMessageId(raw);
    const reason = validateMessageId(id);
    return {
      placeholder: item.placeholder,
      path: item.path,
      stage: item.stage,
      raw,
      id,
      reason,
      duplicate: ''
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
    const placeholders = group.join(', ');
    for (const row of rows) {
      if (group.includes(row.placeholder)) row.duplicate = `duplicate ID shared by ${placeholders}`;
    }
  }

  return rows;
}

function buildOutput(rows) {
  const output = {};
  for (const row of rows) output[row.placeholder] = row.id;
  return output;
}

function resultFor(options, raw) {
  const manifest = readJson(manifestPath);
  const parsed = parseRawInput(raw, manifest);
  const rows = inspectIds(parsed.ids, manifest);
  const valid = rows.filter((row) => !row.reason && !row.duplicate).length;
  const missing = rows.filter((row) => row.reason === 'missing').length;
  const invalid = rows.filter((row) => row.reason && row.reason !== 'missing').length;
  const duplicate = rows.filter((row) => row.duplicate).length;
  const ok = valid === rows.length && parsed.extraSequential.length === 0;

  return {
    ok,
    outPath: options.outPath,
    write: options.write,
    parsed,
    summary: {
      total: rows.length,
      valid,
      missing,
      invalid,
      duplicate,
      extraSequential: parsed.extraSequential.length
    },
    output: buildOutput(rows),
    rows
  };
}

function printText(result) {
  console.log('Build Triggered Email ID JSON From Paste');
  console.log(`Output: ${result.outPath}`);
  console.log(`Input lines: ${result.parsed.lineCount}`);
  console.log(`Valid IDs: ${result.summary.valid}/${result.summary.total}`);
  console.log(`Missing: ${result.summary.missing}, invalid: ${result.summary.invalid}, duplicate: ${result.summary.duplicate}, extra sequential: ${result.summary.extraSequential}`);
  console.log('');

  for (const row of result.rows) {
    const status = row.duplicate ? 'DUPLICATE' : row.reason ? row.reason.toUpperCase() : 'OK';
    const idLabel = row.raw && row.raw !== row.id ? `URL -> ${row.id}` : row.id || '(empty)';
    console.log(`- ${row.path}.${row.stage}: ${status}`);
    console.log(`  ${row.placeholder}: ${idLabel}`);
    if (row.duplicate || row.reason) console.log(`  issue: ${row.duplicate || row.reason}`);
  }

  if (result.parsed.extraSequential.length) {
    console.log('');
    console.log('Extra pasted values not used:');
    for (const value of result.parsed.extraSequential) console.log(`- ${normalizeMessageId(value)}`);
  }

  console.log('');
  if (result.ok && result.write) {
    console.log(`Wrote ${result.outPath}`);
    console.log('Next: run check-triggered-email-ids.mjs, then apply-triggered-email-ids.mjs.');
  } else if (result.ok) {
    console.log('Dry run OK. Re-run with --write to create message-ids.local.json.');
  } else {
    console.log('Fix missing, invalid, duplicate, or extra pasted values before writing.');
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

  let raw = '';
  try {
    raw = readInput(options);
  } catch (error) {
    console.error(`Could not read input: ${error.message}`);
    process.exitCode = 1;
    return;
  }

  if (!raw.trim()) {
    console.error('No pasted IDs found. Pass --from raw-urls.txt or pipe text on stdin.');
    usage();
    process.exitCode = 1;
    return;
  }

  let result;
  try {
    result = resultFor(options, raw);
  } catch (error) {
    console.error(`Could not build message-ID JSON: ${error.message}`);
    process.exitCode = 1;
    return;
  }

  if (options.write && result.ok) {
    fs.writeFileSync(options.outPath, `${JSON.stringify(result.output, null, 2)}\n`, 'utf8');
  }

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    printText(result);
  }

  process.exitCode = result.ok ? 0 : 1;
}

main();
