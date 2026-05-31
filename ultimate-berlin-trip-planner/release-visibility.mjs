#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const TOOL_SLUG = 'ultimate-berlin-trip-planner';
const TOOLS_HUB_PATH = path.join(repoRoot, 'tools-hub', 'data.json');
const TOOLS_HOME_PATH = path.join(repoRoot, 'tools-home', 'data.json');
const WIDGETS_SEO_SCRIPT = path.join(repoRoot, 'widgets-hub', '_regenerate_seo.py');
const DEFAULT_BACKUP_DIR = path.join(repoRoot, 'output/qa/ultimate-trip-planner-visibility-release');

function usage() {
  console.log(`Usage:
  node ultimate-berlin-trip-planner/release-visibility.mjs
  node ultimate-berlin-trip-planner/release-visibility.mjs --write
  node ultimate-berlin-trip-planner/release-visibility.mjs --write --include-home
  node ultimate-berlin-trip-planner/release-visibility.mjs --write --include-home --home-position 0 --regenerate-widgets-seo
  node ultimate-berlin-trip-planner/release-visibility.mjs --write --no-backup
  node ultimate-berlin-trip-planner/release-visibility.mjs --force --write --tools-hub /tmp/tools-hub.json --tools-home /tmp/tools-home.json

Dry-run by default. --write is guarded and refuses to change visibility unless:
  - all TODO_TRIP_PLANNER message IDs are gone
  - a successful live smoke JSON exists
  - the latest remote preflight sees the Wix tool page return 200

Use --force only for local recovery when you deliberately want to bypass those gates.
Write mode creates timestamped backups under:
  output/qa/ultimate-trip-planner-visibility-release/
`);
}

function parseArgs(argv) {
  const options = {
    write: false,
    includeHome: false,
    force: false,
    backup: true,
    backupDir: DEFAULT_BACKUP_DIR,
    toolsHubPath: TOOLS_HUB_PATH,
    toolsHomePath: TOOLS_HOME_PATH,
    homePosition: 0,
    regenerateWidgetsSeo: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--write') {
      options.write = true;
    } else if (arg === '--include-home') {
      options.includeHome = true;
    } else if (arg === '--force') {
      options.force = true;
    } else if (arg === '--no-backup') {
      options.backup = false;
    } else if (arg === '--backup-dir') {
      options.backupDir = path.resolve(process.cwd(), argv[index + 1] || DEFAULT_BACKUP_DIR);
      index += 1;
    } else if (arg === '--tools-hub') {
      options.toolsHubPath = path.resolve(process.cwd(), argv[index + 1] || TOOLS_HUB_PATH);
      index += 1;
    } else if (arg === '--tools-home') {
      options.toolsHomePath = path.resolve(process.cwd(), argv[index + 1] || TOOLS_HOME_PATH);
      index += 1;
    } else if (arg === '--regenerate-widgets-seo') {
      options.regenerateWidgetsSeo = true;
    } else if (arg === '--home-position') {
      const value = Number.parseInt(argv[index + 1], 10);
      if (!Number.isInteger(value) || value < 0) {
        throw new Error('--home-position expects a non-negative integer');
      }
      options.homePosition = value;
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function unique(values) {
  return [...new Set(values)].sort();
}

function relative(filePath) {
  return path.relative(repoRoot, filePath).replaceAll(path.sep, '/');
}

function findTool(toolsHub) {
  const tools = Array.isArray(toolsHub) ? toolsHub : toolsHub.tools || [];
  return {
    tools,
    tool: tools.find((item) => item && item.slug === TOOL_SLUG) || null
  };
}

function latestJsonIn(relativeDir, pattern) {
  const dir = path.join(repoRoot, relativeDir);
  if (!fs.existsSync(dir)) return null;

  const names = fs.readdirSync(dir)
    .filter((name) => pattern.test(name))
    .sort()
    .reverse();

  for (const name of names) {
    const filePath = path.join(dir, name);
    try {
      return {
        filePath,
        relative: relative(filePath),
        json: JSON.parse(fs.readFileSync(filePath, 'utf8'))
      };
    } catch {
      // Keep scanning.
    }
  }

  return null;
}

function liveSmokeEvidence() {
  const latest = latestJsonIn('output/qa/ultimate-trip-planner-live-smoke', /^live-.*\.json$/);
  if (!latest) return null;
  const result = latest.json;
  const leadOk = result?.mode === 'live' && result?.responses?.lead?.ok === true;
  const bookingOk = !result?.bookingPayload || result?.responses?.booking?.ok === true;
  return leadOk && bookingOk ? latest : null;
}

function latestRemotePreflight() {
  return latestJsonIn('output/qa/ultimate-trip-planner-remote-preflight', /^remote-preflight-.*\.json$/);
}

function visibilityState(tool) {
  const status = String(tool?.status || '').toLowerCase();
  if (!tool) return 'missing';
  if (tool.hidden === true || tool.published === false || status === 'draft') return 'draft';
  return 'public';
}

function collectGates() {
  const funnel = fs.readFileSync(path.join(scriptDir, 'velo', 'tripPlannerFunnel.js'), 'utf8');
  const todos = unique([...funnel.matchAll(/TODO_TRIP_PLANNER_[A-Z0-9_]+/g)].map((match) => match[0]));
  const smoke = liveSmokeEvidence();
  const preflight = latestRemotePreflight();
  const liveToolPageStatus = preflight?.json?.checks?.liveToolPage?.status || 0;

  return {
    todos,
    smoke,
    preflight,
    liveToolPageStatus,
    blockers: [
      todos.length ? `${todos.length} Triggered Email placeholders remain` : '',
      smoke ? '' : 'No passing live smoke evidence found',
      liveToolPageStatus === 200 ? '' : `Wix tool page is not live in latest preflight (status ${liveToolPageStatus || 'unknown'})`
    ].filter(Boolean)
  };
}

function releaseTool(tool) {
  const next = { ...tool };
  delete next.status;
  delete next.hidden;
  if (next.published === false) delete next.published;
  return next;
}

function homeEntryFromTool(tool) {
  return {
    slug: tool.slug,
    title: tool.title,
    lead: tool.lead,
    image: tool.image
  };
}

function updateToolsHome(toolsHome, tool, position) {
  const featured = Array.isArray(toolsHome.featuredTools) ? [...toolsHome.featuredTools] : [];
  const existingIndex = featured.findIndex((item) => item && item.slug === TOOL_SLUG);
  const entry = homeEntryFromTool(tool);

  if (existingIndex !== -1) {
    featured[existingIndex] = {
      ...featured[existingIndex],
      ...entry
    };
    return {
      next: {
        ...toolsHome,
        featuredTools: featured
      },
      action: `Updated existing homepage shortcut at position ${existingIndex}.`
    };
  }

  const insertAt = Math.min(position, featured.length);
  featured.splice(insertAt, 0, entry);
  return {
    next: {
      ...toolsHome,
      featuredTools: featured
    },
    action: `Inserted homepage shortcut at position ${insertAt}.`
  };
}

function runWidgetsSeo() {
  const result = spawnSync('python3', [WIDGETS_SEO_SCRIPT], {
    cwd: repoRoot,
    encoding: 'utf8'
  });
  if (result.status !== 0) {
    throw new Error(`widgets SEO regeneration failed:\n${result.stderr || result.stdout}`);
  }
  return (result.stdout || '').trim();
}

function backupFileName(filePath) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const base = path.basename(filePath).replace(/\.json$/, '');
  return `${base}.before-visibility-release-${stamp}.json`;
}

function backupJsonFile(filePath, options) {
  if (!options.backup) return '';
  fs.mkdirSync(options.backupDir, { recursive: true });
  const backupPath = path.join(options.backupDir, backupFileName(filePath));
  fs.writeFileSync(backupPath, fs.readFileSync(filePath, 'utf8'));
  return backupPath;
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

  const gates = collectGates();
  const toolsHub = readJson(options.toolsHubPath);
  const { tools, tool } = findTool(toolsHub);
  const toolsHome = readJson(options.toolsHomePath);
  const homeHasTool = Array.isArray(toolsHome.featuredTools) &&
    toolsHome.featuredTools.some((item) => item && item.slug === TOOL_SLUG);

  if (!tool) {
    console.error(`Could not find ${TOOL_SLUG} in tools-hub/data.json`);
    process.exitCode = 1;
    return;
  }

  const currentVisibility = visibilityState(tool);
  const releasedTool = releaseTool(tool);
  const hubChanged = JSON.stringify(tool) !== JSON.stringify(releasedTool);
  const homeUpdate = options.includeHome ? updateToolsHome(toolsHome, releasedTool, options.homePosition) : null;
  const willRegenerateSeo = options.regenerateWidgetsSeo && (hubChanged || options.write);

  console.log(`Ultimate visibility release (${options.write ? 'WRITE' : 'DRY RUN'})`);
  console.log(`- Current tools-hub visibility: ${currentVisibility}`);
  console.log(`- Triggered Email placeholders: ${gates.todos.length}`);
  console.log(`- Live smoke: ${gates.smoke ? gates.smoke.relative : 'missing'}`);
  console.log(`- Latest remote preflight: ${gates.preflight ? gates.preflight.relative : 'missing'}`);
  console.log(`- Wix tool page status: ${gates.liveToolPageStatus || 'unknown'}`);
  console.log(`- Homepage shortcut currently present: ${homeHasTool ? 'yes' : 'no'}`);

  if (hubChanged) {
    console.log('- tools-hub/data.json would remove draft/hidden/published:false visibility flags.');
  } else {
    console.log('- tools-hub/data.json already looks public for Ultimate.');
  }

  if (homeUpdate) {
    console.log(`- tools-home/data.json would ${homeUpdate.action}`);
  } else {
    console.log('- tools-home/data.json would not be changed. Add --include-home after final page QA if desired.');
  }

  if (options.regenerateWidgetsSeo) {
    console.log('- widgets-hub/SEO_ADDITIONAL_TAGS.md would be regenerated after visibility change.');
  }

  if (!options.force && gates.blockers.length) {
    console.log('\nRelease gates not met:');
    for (const blocker of gates.blockers) console.log(`- ${blocker}`);
    if (options.write) {
      console.log('\nNo files written. Re-run after the gates pass, or use --force only for deliberate recovery.');
      process.exitCode = 1;
    }
    return;
  }

  if (!options.write) {
    console.log('\nDry run only. Add --write when launch smoke and CMS page checks are ready.');
    return;
  }

  const backups = [
    backupJsonFile(options.toolsHubPath, options)
  ].filter(Boolean);

  const nextToolsHub = Array.isArray(toolsHub)
    ? tools.map((item) => (item && item.slug === TOOL_SLUG ? releasedTool : item))
    : {
        ...toolsHub,
        tools: tools.map((item) => (item && item.slug === TOOL_SLUG ? releasedTool : item))
      };

  writeJson(options.toolsHubPath, nextToolsHub);
  console.log(`\nWrote ${relative(options.toolsHubPath)}`);

  if (homeUpdate) {
    const homeBackup = backupJsonFile(options.toolsHomePath, options);
    if (homeBackup) backups.push(homeBackup);
    writeJson(options.toolsHomePath, homeUpdate.next);
    console.log(`Wrote ${relative(options.toolsHomePath)}`);
  }

  for (const backupPath of backups) {
    console.log(`Backup: ${relative(backupPath)}`);
  }

  if (willRegenerateSeo) {
    const output = runWidgetsSeo();
    console.log(output);
  }

  console.log('Visibility release complete. Run launch-audit and manual page QA next.');
}

main();
