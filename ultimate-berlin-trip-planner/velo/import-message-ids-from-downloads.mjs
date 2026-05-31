#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const widgetRoot = path.resolve(scriptDir, '..');
const repoRoot = path.resolve(widgetRoot, '..');
const manifestPath = path.join(widgetRoot, 'email/paste-ready/manifest.json');
const defaultOutPath = path.join(widgetRoot, 'email/paste-ready/message-ids.local.json');
const defaultSearchDir = path.join(os.homedir(), 'Downloads');
const defaultBackupDir = path.join(repoRoot, 'output/qa/ultimate-trip-planner-message-id-import');

function usage() {
  console.log(`Usage:
  node ultimate-berlin-trip-planner/velo/import-message-ids-from-downloads.mjs
  node ultimate-berlin-trip-planner/velo/import-message-ids-from-downloads.mjs --write
  node ultimate-berlin-trip-planner/velo/import-message-ids-from-downloads.mjs --from ~/Downloads/message-ids.local.json --write
  node ultimate-berlin-trip-planner/velo/import-message-ids-from-downloads.mjs --list

Dry-run is the default. The helper finds the newest message-ids*.json file in
~/Downloads, validates all five Wix Triggered Email IDs, then writes the
normalized local repo file only when --write is passed.
It accepts full Wix editor URLs shaped like /automations/edit/{MESSAGE_ID}/content/en.

Write mode creates a timestamped backup under:
  output/qa/ultimate-trip-planner-message-id-import/
`);
}

function parseArgs(argv) {
  const options = {
    fromPath: '',
    searchDir: defaultSearchDir,
    outPath: defaultOutPath,
    backupDir: defaultBackupDir,
    backup: true,
    write: false,
    list: false,
    json: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--from') {
      options.fromPath = argv[index + 1] || '';
      index += 1;
    } else if (arg === '--search-dir') {
      options.searchDir = argv[index + 1] || '';
      index += 1;
    } else if (arg === '--out') {
      options.outPath = argv[index + 1] || '';
      index += 1;
    } else if (arg === '--backup-dir') {
      options.backupDir = argv[index + 1] || '';
      index += 1;
    } else if (arg === '--no-backup') {
      options.backup = false;
    } else if (arg === '--write') {
      options.write = true;
    } else if (arg === '--list') {
      options.list = true;
    } else if (arg === '--json') {
      options.json = true;
    } else if (!options.fromPath) {
      options.fromPath = arg;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  options.fromPath = options.fromPath ? resolveUserPath(options.fromPath) : '';
  options.searchDir = resolveUserPath(options.searchDir || defaultSearchDir);
  options.outPath = path.resolve(process.cwd(), options.outPath || defaultOutPath);
  options.backupDir = path.resolve(process.cwd(), options.backupDir || defaultBackupDir);
  return options;
}

function resolveUserPath(filePath) {
  const raw = String(filePath || '').trim();
  if (raw === '~') return os.homedir();
  if (raw.startsWith('~/')) return path.join(os.homedir(), raw.slice(2));
  return path.resolve(process.cwd(), raw);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function candidateFiles(searchDir) {
  if (!fs.existsSync(searchDir)) return [];
  return fs.readdirSync(searchDir)
    .filter((name) => /^message-ids[\w.\- ()]*\.json$/i.test(name))
    .map((name) => {
      const filePath = path.join(searchDir, name);
      const stat = fs.statSync(filePath);
      return {
        filePath,
        name,
        mtimeMs: stat.mtimeMs,
        size: stat.size
      };
    })
    .filter((file) => file.size > 0)
    .sort((a, b) => b.mtimeMs - a.mtimeMs);
}

function chooseSource(options) {
  if (options.fromPath) {
    return {
      sourcePath: options.fromPath,
      candidates: fs.existsSync(options.fromPath)
        ? [{
            filePath: options.fromPath,
            name: path.basename(options.fromPath),
            mtimeMs: fs.statSync(options.fromPath).mtimeMs,
            size: fs.statSync(options.fromPath).size
          }]
        : []
    };
  }

  const candidates = candidateFiles(options.searchDir);
  return {
    sourcePath: candidates[0]?.filePath || '',
    candidates
  };
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

function inspectIds(sourcePath) {
  const manifest = readJson(manifestPath);
  const ids = readJson(sourcePath);
  const rows = manifest.map((item) => {
    const { key, value } = valueFor(ids, item);
    const raw = String(value || '').trim();
    const id = normalizeMessageId(raw);
    return {
      branch: item.path,
      stage: item.stage,
      placeholder: item.placeholder,
      inputKey: key,
      raw,
      id,
      reason: validateMessageId(id),
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
    const detail = `duplicate ID shared by ${group.join(', ')}`;
    for (const row of rows) {
      if (group.includes(row.placeholder)) row.duplicate = detail;
    }
  }

  return rows;
}

function normalizedPayload(rows) {
  const payload = {};
  for (const row of rows) payload[row.placeholder] = row.id;
  return payload;
}

function summarizeRows(rows) {
  const validRows = rows.filter((row) => !row.reason && !row.duplicate);
  return {
    total: rows.length,
    valid: validRows.length,
    missing: rows.filter((row) => row.reason === 'missing').length,
    invalid: rows.filter((row) => row.reason && row.reason !== 'missing').length,
    duplicate: rows.filter((row) => row.duplicate).length
  };
}

function backupFileName(targetPath) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const base = path.basename(targetPath).replace(/\.json$/, '');
  return `${base}.before-import-${stamp}.json`;
}

function writeOutput(options, payload) {
  let backupPath = '';
  if (fs.existsSync(options.outPath) && options.backup) {
    fs.mkdirSync(options.backupDir, { recursive: true });
    backupPath = path.join(options.backupDir, backupFileName(options.outPath));
    fs.writeFileSync(backupPath, fs.readFileSync(options.outPath, 'utf8'));
  }

  fs.mkdirSync(path.dirname(options.outPath), { recursive: true });
  fs.writeFileSync(options.outPath, JSON.stringify(payload, null, 2) + '\n');
  return backupPath;
}

function resultFor(options) {
  const { sourcePath, candidates } = chooseSource(options);
  if (!sourcePath || !fs.existsSync(sourcePath)) {
    const total = readJson(manifestPath).length;
    return {
      ok: false,
      write: options.write,
      sourcePath,
      outPath: options.outPath,
      candidates,
      summary: { total, valid: 0, missing: total, invalid: 0, duplicate: 0 },
      rows: [],
      issue: options.fromPath ? 'source file not found' : `no message-ids*.json file found in ${options.searchDir}`
    };
  }

  const rows = inspectIds(sourcePath);
  const summary = summarizeRows(rows);
  const ok = summary.valid === summary.total && summary.duplicate === 0;
  const payload = normalizedPayload(rows);
  let backupPath = '';

  if (ok && options.write) {
    backupPath = writeOutput(options, payload);
  }

  return {
    ok,
    write: options.write,
    sourcePath,
    outPath: options.outPath,
    backupPath,
    candidates,
    summary,
    payload,
    rows
  };
}

function printList(options, candidates) {
  console.log(`Message ID JSON candidates in ${options.searchDir}:`);
  if (!candidates.length) {
    console.log('- none found');
    return;
  }

  for (const candidate of candidates) {
    console.log(`- ${candidate.name} (${new Date(candidate.mtimeMs).toISOString()}, ${candidate.size} bytes)`);
  }
}

function printText(result) {
  console.log('Import Triggered Email IDs From Downloads');
  console.log(`Source: ${result.sourcePath || '(none)'}`);
  console.log(`Output: ${result.outPath}`);
  console.log(`Valid IDs: ${result.summary.valid}/${result.summary.total}`);
  console.log(`Missing: ${result.summary.missing}, invalid: ${result.summary.invalid}, duplicate: ${result.summary.duplicate}`);

  if (result.issue) {
    console.log('');
    console.log(`Issue: ${result.issue}`);
    console.log('Next: download message-ids.local.json from copy-kit.html, or pass --from /path/to/file.');
    return;
  }

  console.log('');
  for (const row of result.rows) {
    const status = row.duplicate ? 'DUPLICATE' : row.reason ? row.reason.toUpperCase() : 'OK';
    const idLabel = row.raw && row.raw !== row.id ? `URL -> ${row.id}` : row.id || '(empty)';
    console.log(`- ${row.branch}.${row.stage}: ${status}`);
    console.log(`  ${row.placeholder}: ${idLabel}`);
    if (row.duplicate || row.reason) console.log(`  issue: ${row.duplicate || row.reason}`);
  }

  console.log('');
  if (!result.ok) {
    console.log('Fix missing, placeholder, invalid, or duplicate IDs before importing.');
  } else if (result.write) {
    if (result.backupPath) console.log(`Backup: ${path.relative(process.cwd(), result.backupPath)}`);
    console.log(`Wrote ${path.relative(process.cwd(), result.outPath)}`);
    console.log('Next: run check-triggered-email-ids.mjs, then apply-triggered-email-ids.mjs.');
  } else {
    console.log('Dry run OK. Re-run with --write to import the normalized local JSON file.');
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

  const chosen = chooseSource(options);
  if (options.list) {
    printList(options, chosen.candidates);
    return;
  }

  let result;
  try {
    result = resultFor(options);
  } catch (error) {
    console.error(`Could not import Triggered Email IDs: ${error.message}`);
    process.exitCode = 1;
    return;
  }

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    printText(result);
  }

  if (!result.ok) process.exitCode = 1;
}

main();
