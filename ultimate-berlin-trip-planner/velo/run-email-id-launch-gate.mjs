#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const widgetRoot = path.resolve(scriptDir, '..');
const repoRoot = path.resolve(widgetRoot, '..');
const defaultIdsPath = path.join(widgetRoot, 'email/paste-ready/message-ids.local.json');
const defaultOutDir = path.join(repoRoot, 'output/qa/ultimate-trip-planner-email-id-gate');

function usage() {
  console.log(`Usage:
  node ultimate-berlin-trip-planner/velo/run-email-id-launch-gate.mjs
  node ultimate-berlin-trip-planner/velo/run-email-id-launch-gate.mjs --write
  node ultimate-berlin-trip-planner/velo/run-email-id-launch-gate.mjs --import-downloads --write
  node ultimate-berlin-trip-planner/velo/run-email-id-launch-gate.mjs --import-downloads --downloads-dir ~/Downloads --write
  node ultimate-berlin-trip-planner/velo/run-email-id-launch-gate.mjs --import-from ~/Downloads/message-ids.local.json --write
  node ultimate-berlin-trip-planner/velo/run-email-id-launch-gate.mjs --ids path/to/message-ids.local.json

Dry-run is the default. It validates the local message-ID file and dry-runs the
placeholder replacement. With --write it applies IDs, verifies all placeholders
are gone, regenerates the Velo install kit / launch dashboards, runs the Velo
pre-publish gate, and runs the launch audit.

Load WIX_API_KEY before --write if you want the pre-publish gate to verify the
live TripPlannerLeads collection:
  source ../scripts/load-api-keys.sh
`);
}

function parseArgs(argv) {
  const options = {
    idsPath: defaultIdsPath,
    importDownloads: false,
    downloadsDir: '',
    importFrom: '',
    write: false,
    skipPrepublish: false,
    funnelPath: '',
    outDir: defaultOutDir,
    json: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--ids') {
      options.idsPath = argv[index + 1] || '';
      index += 1;
    } else if (arg === '--import-downloads') {
      options.importDownloads = true;
    } else if (arg === '--downloads-dir' || arg === '--search-dir') {
      options.downloadsDir = argv[index + 1] || '';
      options.importDownloads = true;
      index += 1;
    } else if (arg === '--import-from') {
      options.importFrom = argv[index + 1] || '';
      options.importDownloads = true;
      index += 1;
    } else if (arg === '--write') {
      options.write = true;
    } else if (arg === '--skip-prepublish') {
      options.skipPrepublish = true;
    } else if (arg === '--funnel') {
      options.funnelPath = argv[index + 1] || '';
      index += 1;
    } else if (arg === '--out-dir') {
      options.outDir = argv[index + 1] || '';
      index += 1;
    } else if (arg === '--json') {
      options.json = true;
    } else if (!options.idsPath || options.idsPath === defaultIdsPath) {
      options.idsPath = arg;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  options.idsPath = path.resolve(process.cwd(), options.idsPath || defaultIdsPath);
  options.downloadsDir = options.downloadsDir ? path.resolve(process.cwd(), options.downloadsDir) : '';
  options.importFrom = options.importFrom ? path.resolve(process.cwd(), options.importFrom) : '';
  options.outDir = path.resolve(process.cwd(), options.outDir || defaultOutDir);
  options.funnelPath = options.funnelPath ? path.resolve(process.cwd(), options.funnelPath) : '';
  return options;
}

function relative(filePath) {
  return path.relative(repoRoot, filePath).replaceAll(path.sep, '/');
}

function outputPath(options) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  return path.join(options.outDir, `email-id-gate-${stamp}.json`);
}

function commandLabel(command, args) {
  return [path.basename(command), ...args].join(' ');
}

function runNode(script, args, options = {}) {
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: repoRoot,
    encoding: 'utf8',
    env: process.env
  });
  const output = `${result.stdout || ''}${result.stderr || ''}`;
  return {
    name: options.name || path.basename(script),
    command: commandLabel(process.execPath, [script, ...args]),
    exitCode: typeof result.status === 'number' ? result.status : 1,
    ok: result.status === 0,
    skipped: false,
    output
  };
}

function skipped(name, reason) {
  return {
    name,
    command: '',
    exitCode: 0,
    ok: true,
    skipped: true,
    output: reason
  };
}

function recordStep(steps, step) {
  steps.push(step);
  const prefix = step.skipped ? 'SKIP' : step.ok ? 'OK' : 'BLOCK';
  console.log(`${prefix} ${step.name}`);
  if (!step.ok || step.skipped) {
    const detail = step.output.trim().split('\n').slice(0, 8).join('\n');
    if (detail) console.log(detail);
  }
}

function hasFailure(steps) {
  return steps.some((step) => !step.ok);
}

function buildApplyArgs(options, write) {
  const args = [
    'ultimate-berlin-trip-planner/velo/apply-triggered-email-ids.mjs',
    '--ids',
    relative(options.idsPath)
  ];
  if (options.funnelPath) args.push('--funnel', relative(options.funnelPath));
  if (write) args.push('--write');
  return args;
}

function buildCheckArgs(options, requireApplied = false) {
  const args = [
    'ultimate-berlin-trip-planner/velo/check-triggered-email-ids.mjs',
    '--ids',
    relative(options.idsPath)
  ];
  if (options.funnelPath) args.push('--funnel', relative(options.funnelPath));
  if (requireApplied) args.push('--require-applied');
  return args;
}

function writeResult(options, result) {
  fs.mkdirSync(options.outDir, { recursive: true });
  const outPath = outputPath(options);
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2) + '\n');
  return outPath;
}

function printSummary(result, outPath) {
  console.log('');
  console.log(`Mode: ${result.write ? 'WRITE' : 'DRY RUN'}`);
  console.log(`Ready for next launch step: ${result.ok ? 'YES' : 'NO'}`);
  console.log(`Evidence: ${relative(outPath)}`);

  if (result.ok && !result.write) {
    console.log('Next: re-run with --write after confirming the 10 IDs are real.');
  } else if (result.ok) {
    console.log('Next: paste/publish the Velo source in Wix, then run live smoke.');
  } else {
    console.log('Next: fix the first BLOCK above, then re-run this gate.');
  }
}

function runGate(options) {
  const steps = [];

  if (options.importDownloads) {
    const importArgs = [
      'ultimate-berlin-trip-planner/velo/import-message-ids-from-downloads.mjs',
      '--out',
      relative(options.idsPath)
    ];
    if (options.downloadsDir) importArgs.push('--search-dir', relative(options.downloadsDir));
    if (options.importFrom) importArgs.push('--from', relative(options.importFrom));
    if (options.write) importArgs.push('--write');
    recordStep(steps, runNode(importArgs[0], importArgs.slice(1), { name: 'Import message IDs from Downloads' }));
    if (hasFailure(steps)) return steps;
    if (!options.write) {
      recordStep(steps, skipped('Validate/apply imported IDs', 'Import dry-run succeeded. Re-run with --write to create the local ID file before applying.'));
      return steps;
    }
  }

  recordStep(steps, runNode(buildCheckArgs(options)[0], buildCheckArgs(options).slice(1), { name: 'Validate message IDs' }));
  if (hasFailure(steps)) return steps;

  recordStep(steps, runNode(buildApplyArgs(options, options.write)[0], buildApplyArgs(options, options.write).slice(1), { name: options.write ? 'Apply message IDs' : 'Dry-run message ID apply' }));
  if (hasFailure(steps)) return steps;

  if (!options.write) {
    recordStep(steps, skipped('Post-apply launch checks', 'Dry-run mode stops before mutating tripPlannerFunnel.js.'));
    return steps;
  }

  recordStep(steps, runNode(buildCheckArgs(options, true)[0], buildCheckArgs(options, true).slice(1), { name: 'Verify IDs are applied' }));
  if (hasFailure(steps)) return steps;

  if (options.funnelPath) {
    recordStep(steps, skipped('Real launch regeneration', 'Temp funnel QA mode stops before regenerating launch artifacts or reading the real Velo source.'));
    return steps;
  }

  recordStep(steps, runNode('ultimate-berlin-trip-planner/velo/build-velo-install-kit.mjs', [], { name: 'Regenerate Velo install kit' }));
  if (hasFailure(steps)) return steps;

  recordStep(steps, runNode('ultimate-berlin-trip-planner/build-launch-control-room.mjs', [], { name: 'Regenerate launch control room' }));
  if (hasFailure(steps)) return steps;

  recordStep(steps, runNode('ultimate-berlin-trip-planner/build-launch-status-report.mjs', [], { name: 'Regenerate launch status' }));
  if (hasFailure(steps)) return steps;

  if (options.skipPrepublish) {
    recordStep(steps, skipped('Velo pre-publish gate', 'Skipped by --skip-prepublish.'));
  } else {
    recordStep(steps, runNode('ultimate-berlin-trip-planner/velo/prepublish-gate.mjs', ['--ids', relative(options.idsPath)], { name: 'Velo pre-publish gate' }));
    if (hasFailure(steps)) return steps;
  }

  recordStep(steps, runNode('ultimate-berlin-trip-planner/launch-audit.mjs', [], { name: 'Launch audit' }));
  return steps;
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

  const steps = runGate(options);
  const result = {
    generatedAt: new Date().toISOString(),
    write: options.write,
    importDownloads: options.importDownloads,
    downloadsDir: options.downloadsDir,
    importFrom: options.importFrom,
    idsPath: options.idsPath,
    funnelPath: options.funnelPath || path.join(scriptDir, 'tripPlannerFunnel.js'),
    ok: !hasFailure(steps),
    steps
  };
  const outPath = writeResult(options, result);

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    printSummary(result, outPath);
  }

  if (!result.ok) process.exitCode = 1;
}

main();
