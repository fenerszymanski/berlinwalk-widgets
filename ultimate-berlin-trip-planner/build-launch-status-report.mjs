#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const OUT_MD = path.join(scriptDir, 'LAUNCH_STATUS.md');
const OUT_JSON = path.join(scriptDir, 'LAUNCH_STATUS.json');
const TOOL_SLUG = 'ultimate-berlin-trip-planner';

function repoPath(relativePath) {
  return path.join(repoRoot, relativePath);
}

function widgetPath(relativePath) {
  return path.join(scriptDir, relativePath);
}

function read(relativePath) {
  return fs.readFileSync(widgetPath(relativePath), 'utf8');
}

function readRepo(relativePath) {
  return fs.readFileSync(repoPath(relativePath), 'utf8');
}

function readJsonRepo(relativePath) {
  return JSON.parse(readRepo(relativePath));
}

function relative(filePath) {
  return path.relative(repoRoot, filePath).replaceAll(path.sep, '/');
}

function unique(values) {
  return [...new Set(values)].sort();
}

function latestJsonIn(relativeDir, pattern) {
  const dir = repoPath(relativeDir);
  if (!fs.existsSync(dir)) return null;

  const files = fs.readdirSync(dir)
    .filter((name) => pattern.test(name))
    .sort()
    .reverse();

  for (const name of files) {
    const filePath = path.join(dir, name);
    try {
      return {
        filePath,
        relative: relative(filePath),
        json: JSON.parse(fs.readFileSync(filePath, 'utf8'))
      };
    } catch {
      // Keep scanning older evidence.
    }
  }

  return null;
}

function latestLiveSmoke() {
  const latest = latestJsonIn('output/qa/ultimate-trip-planner-live-smoke', /^live-.*\.json$/);
  if (!latest) return null;
  const result = latest.json;
  const leadOk = result?.mode === 'live' && result?.responses?.lead?.ok === true;
  const bookingOk = !result?.bookingPayload || result?.responses?.booking?.ok === true;
  return leadOk && bookingOk ? latest : null;
}

function runAudit() {
  const result = spawnSync('node', ['ultimate-berlin-trip-planner/launch-audit.mjs'], {
    cwd: repoRoot,
    encoding: 'utf8'
  });
  const output = `${result.stdout || ''}${result.stderr || ''}`;
  const summaryMatch = output.match(/Summary:\s*(\d+)\s+pass,\s*(\d+)\s+warn,\s*(\d+)\s+block/i);
  const launchStatusMatch = output.match(/Launch status:\s*(.+)/i);

  return {
    exitCode: result.status,
    summary: summaryMatch
      ? {
          pass: Number(summaryMatch[1]),
          warn: Number(summaryMatch[2]),
          block: Number(summaryMatch[3])
        }
      : null,
    launchStatus: launchStatusMatch ? launchStatusMatch[1].trim() : 'unknown',
    blocks: output.split('\n').filter((line) => line.startsWith('BLOCK ')),
    warns: output.split('\n').filter((line) => line.startsWith('WARN ')),
    output
  };
}

function toolVisibility() {
  const toolsHub = readJsonRepo('tools-hub/data.json');
  const toolsHome = readJsonRepo('tools-home/data.json');
  const tools = Array.isArray(toolsHub) ? toolsHub : toolsHub.tools || [];
  const tool = tools.find((item) => item && item.slug === TOOL_SLUG) || null;
  const status = String(tool?.status || '').toLowerCase();
  const publicVisible = Boolean(tool) && tool.hidden !== true && tool.published !== false && status !== 'draft';
  const inHome = Array.isArray(toolsHome.featuredTools) &&
    toolsHome.featuredTools.some((item) => item && item.slug === TOOL_SLUG);

  return {
    exists: Boolean(tool),
    status: tool?.status || '',
    publicVisible,
    inHome,
    widgetUrl: tool?.widgetUrl || '',
    embedHeight: tool?.embedHeight || null
  };
}

function blogPackage() {
  const bodyPath = repoPath('blog-drafts/ultimate-berlin-trip-planner.body.md');
  const draftPath = repoPath('blog-drafts/ultimate-berlin-trip-planner.md');
  const draftCreatorPath = repoPath('../create-wix-ultimate-trip-planner-blog-draft.mjs');
  const body = fs.existsSync(bodyPath) ? fs.readFileSync(bodyPath, 'utf8') : '';
  const draft = fs.existsSync(draftPath) ? fs.readFileSync(draftPath, 'utf8') : '';
  const draftId = (draft.match(/Wix draft ID:\s*`([^`]+)`/) || [])[1] || '';
  const editUrl = (draft.match(/Wix edit URL:\s*`([^`]+)`/) || [])[1] || '';
  return {
    bodyExists: Boolean(body),
    widgetNearTop: body.includes('{{widget:ultimate-berlin-trip-planner}}') &&
      body.indexOf('{{widget:ultimate-berlin-trip-planner}}') < 2500,
    quickSummary: body.includes('{{quick-summary}}'),
    faq: body.includes('{{faq}}'),
    draftCreatorExists: fs.existsSync(draftCreatorPath),
    wixDraftId: draftId,
    editUrl
  };
}

function collectState() {
  const funnel = read('velo/tripPlannerFunnel.js');
  const todos = unique([...funnel.matchAll(/TODO_TRIP_PLANNER_[A-Z0-9_]+/g)].map((match) => match[0]));
  const preflight = latestJsonIn('output/qa/ultimate-trip-planner-remote-preflight', /^remote-preflight-.*\.json$/);
  const smoke = latestLiveSmoke();
  const checks = preflight?.json?.checks || {};
  const audit = runAudit();
  const visibility = toolVisibility();
  const blog = blogPackage();

  const gates = [
    {
      id: 'triggered_email_ids',
      label: 'Triggered Email IDs',
      status: todos.length ? 'block' : 'pass',
      detail: todos.length ? `${todos.length} TODO_TRIP_PLANNER placeholders remain.` : 'All message IDs are applied.'
    },
    {
      id: 'trip_planner_collection',
      label: 'TripPlannerLeads collection',
      status: checks.tripPlannerCollection?.ok && checks.tripPlannerCollection?.schemaOk !== false ? 'pass' : 'warn',
      detail: checks.tripPlannerCollection?.ok
        ? checks.tripPlannerCollection?.schemaOk === false
          ? `Missing critical fields: ${(checks.tripPlannerCollection.missingCriticalFields || []).join(', ')}.`
          : `${checks.tripPlannerCollection.fieldCount} fields visible via API; critical fields verified.`
        : 'Latest remote preflight does not prove the collection.'
    },
    {
      id: 'velo_endpoints',
      label: 'Velo endpoints',
      status: checks.leadOptions?.status === 204 && checks.bookingOptions?.status === 204 ? 'pass' : 'warn',
      detail: `lead OPTIONS ${checks.leadOptions?.status || 'unknown'}, booking OPTIONS ${checks.bookingOptions?.status || 'unknown'}.`
    },
    {
      id: 'live_smoke',
      label: 'Live lead/booking smoke',
      status: smoke ? 'pass' : 'warn',
      detail: smoke ? smoke.relative : 'No passing live smoke evidence found.'
    },
    {
      id: 'tool_page',
      label: 'Live Wix tool page',
      status: checks.liveToolPage?.status === 200 ? 'pass' : 'warn',
      detail: `Latest remote preflight status ${checks.liveToolPage?.status || 'unknown'}.`
    },
    {
      id: 'visibility',
      label: 'Public visibility',
      status: visibility.publicVisible ? 'pass' : 'hold',
      detail: visibility.publicVisible ? 'Ultimate is public in tools-hub.' : 'Ultimate is still protected as draft.'
    },
    {
      id: 'homepage',
      label: 'Homepage shortcut',
      status: visibility.inHome ? 'pass' : 'hold',
      detail: visibility.inHome ? 'Ultimate appears in tools-home/data.json.' : 'Homepage shortcut is not enabled yet.'
    },
    {
      id: 'blog',
      label: 'SEO blog package',
      status: blog.bodyExists && blog.widgetNearTop && blog.quickSummary && blog.faq ? 'pass' : 'warn',
      detail: blog.bodyExists ? 'Body draft has widget/summary/FAQ placeholders.' : 'Body draft missing.'
    },
    {
      id: 'blog_draft',
      label: 'Wix Blog draft',
      status: blog.wixDraftId && blog.draftCreatorExists ? 'pass' : 'hold',
      detail: blog.wixDraftId
        ? `Draft ${blog.wixDraftId} is created but unpublished.`
        : 'No Wix draft ID recorded yet.'
    }
  ];

  const blockers = gates.filter((gate) => gate.status === 'block');
  const warnings = gates.filter((gate) => gate.status === 'warn');
  const holds = gates.filter((gate) => gate.status === 'hold');
  const visibilityHeld = holds.some((gate) => gate.id === 'visibility');
  const homepageHeld = holds.some((gate) => gate.id === 'homepage');
  const verdict = blockers.length
    ? 'NOT READY'
    : warnings.length
      ? 'WAITING FOR LIVE QA'
      : visibilityHeld
        ? 'READY FOR VISIBILITY RELEASE'
        : homepageHeld
          ? 'PUBLIC TOOL LIVE - HOMEPAGE HELD'
          : 'PUBLIC LAUNCH COMPLETE';

  return {
    generatedAt: new Date().toISOString(),
    verdict,
    audit,
    todos,
    preflight: preflight
      ? {
          file: preflight.relative,
          githubWidgetStatus: checks.githubWidget?.status || null,
          liveToolPageStatus: checks.liveToolPage?.status || null,
          leadOptionsStatus: checks.leadOptions?.status || null,
          bookingOptionsStatus: checks.bookingOptions?.status || null,
          berlinToolsSlugCount: checks.berlinToolsSlug?.count ?? null,
          tripPlannerCollectionOk: checks.tripPlannerCollection?.ok === true,
          tripPlannerCollectionFieldCount: checks.tripPlannerCollection?.fieldCount || null
        }
      : null,
    smoke: smoke
      ? {
          file: smoke.relative
        }
      : null,
    visibility,
    blog,
    gates,
    nextActions: nextActions({ blockers, warnings, holds })
  };
}

function nextActions({ blockers, warnings, holds }) {
  if (blockers.some((gate) => gate.id === 'triggered_email_ids')) {
    const actions = [
      'Open WIX_EMAIL_SETUP_TR.md next to email/paste-ready/copy-kit.html.',
      'Create the 5 Wix Triggered Email templates from the copy kit.',
      'Export message-ids.local.json from the copy kit, import it from Downloads, or build it from 5 pasted URLs with build-message-ids-from-paste.mjs.',
      'Run run-email-id-launch-gate.mjs first in dry-run, then with --write after loading WIX_API_KEY.',
      'Regenerate Velo install kit and publish Velo in Wix Developer Tools.'
    ];
    if (warnings.some((gate) => gate.id === 'trip_planner_collection')) {
      actions.splice(5, 0, 'Run create-trip-planner-leads-collection.mjs --live --sync-fields to patch missing collection fields.');
    }
    return actions;
  }

  if (warnings.some((gate) => gate.id === 'trip_planner_collection')) {
    return [
      'Run create-trip-planner-leads-collection.mjs --live --sync-fields.',
      'Run launch-remote-preflight.mjs again until TripPlannerLeads critical fields pass.'
    ];
  }

  if (warnings.some((gate) => gate.id === 'velo_endpoints')) {
    return [
      'Publish Backend/tripPlannerFunnel.js, http-functions.js handlers, and jobs.config in Wix.',
      'Run launch-remote-preflight.mjs until both Velo OPTIONS handlers are live.'
    ];
  }

  if (warnings.some((gate) => gate.id === 'live_smoke')) {
    return [
      'Run live-smoke-trip-planner.mjs --live with a real test email.',
      'Run live-smoke-trip-planner.mjs --live --booking to prove booked-branch behavior.'
    ];
  }

  if (warnings.some((gate) => gate.id === 'tool_page')) {
    return [
      'Insert the BerlinTools CMS row with insert-ultimate-berlin-trip-planner.js.',
      'Run launch-remote-preflight.mjs until the live tool page returns 200.'
    ];
  }

  if (holds.some((gate) => gate.id === 'visibility')) {
    return [
      'Run release-visibility.mjs, then release-visibility.mjs --write --regenerate-widgets-seo.',
      'QA /berlin-tools and /widgets before adding the homepage shortcut.'
    ];
  }

  if (holds.some((gate) => gate.id === 'blog_draft')) {
    return [
      'Run create-wix-ultimate-trip-planner-blog-draft.mjs in dry-run, then with --write after loading WIX_API_KEY.',
      'Review the created Wix Blog draft before publishing.'
    ];
  }

  if (holds.some((gate) => gate.id === 'homepage')) {
    return [
      'QA the live /tools/ultimate-berlin-trip-planner page and /widgets listing after pushing repo changes.',
      'Add the homepage shortcut later with release-visibility.mjs --write --include-home --regenerate-widgets-seo only after final page QA.'
    ];
  }

  return [
    'Publish or QA the SEO blog draft.',
    'Record final live smoke and page QA evidence.'
  ];
}

function statusIcon(status) {
  if (status === 'pass') return 'PASS';
  if (status === 'block') return 'BLOCK';
  if (status === 'warn') return 'WARN';
  return 'HOLD';
}

function markdown(state) {
  const auditSummary = state.audit.summary
    ? `${state.audit.summary.pass} pass, ${state.audit.summary.warn} warn, ${state.audit.summary.block} block`
    : 'unknown';

  const lines = [
    '# Ultimate Berlin Trip Planner Launch Status',
    '',
    `Generated: ${state.generatedAt}`,
    '',
    `## Verdict: ${state.verdict}`,
    '',
    `Launch audit: ${auditSummary} (${state.audit.launchStatus})`,
    '',
    '## Gates',
    '',
    '| Gate | Status | Detail |',
    '| --- | --- | --- |',
    ...state.gates.map((gate) => `| ${gate.label} | ${statusIcon(gate.status)} | ${gate.detail.replaceAll('|', '\\|')} |`),
    '',
    '## Evidence',
    '',
    `- Latest remote preflight: ${state.preflight ? `\`${state.preflight.file}\`` : 'missing'}`,
    `- Latest passing live smoke: ${state.smoke ? `\`${state.smoke.file}\`` : 'missing'}`,
    `- Visibility: ${state.visibility.publicVisible ? 'public' : 'draft/protected'}, homepage shortcut ${state.visibility.inHome ? 'enabled' : 'not enabled'}`,
    `- Widget URL: ${state.visibility.widgetUrl || 'missing'}`,
    `- Blog package: ${state.blog.bodyExists ? 'body draft exists' : 'missing'}; widget near top ${state.blog.widgetNearTop ? 'yes' : 'no'}; quick summary ${state.blog.quickSummary ? 'yes' : 'no'}; FAQ ${state.blog.faq ? 'yes' : 'no'}`,
    `- Wix Blog draft: ${state.blog.wixDraftId || 'missing'}${state.blog.editUrl ? ` (${state.blog.editUrl})` : ''}`,
    '',
    '## Current Blockers And Warnings',
    '',
    ...(state.audit.blocks.length ? state.audit.blocks.map((line) => `- ${line}`) : ['- No audit blockers.']),
    ...(state.audit.warns.length ? state.audit.warns.map((line) => `- ${line}`) : []),
    '',
    '## Next Actions',
    '',
    ...state.nextActions.map((action, index) => `${index + 1}. ${action}`),
    '',
    '## Command Shortcuts',
    '',
    '```bash',
    'node ultimate-berlin-trip-planner/launch-audit.mjs',
    'node ultimate-berlin-trip-planner/velo/run-email-id-launch-gate.mjs --import-downloads',
    'source ../scripts/load-api-keys.sh',
    'node ultimate-berlin-trip-planner/velo/run-email-id-launch-gate.mjs --import-downloads --write',
    'node ultimate-berlin-trip-planner/velo/import-message-ids-from-downloads.mjs --write',
    'pbpaste | node ultimate-berlin-trip-planner/velo/build-message-ids-from-paste.mjs --write',
    'node ultimate-berlin-trip-planner/velo/check-triggered-email-ids.mjs --ids ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json',
    'source ../scripts/load-api-keys.sh',
    'node ultimate-berlin-trip-planner/launch-remote-preflight.mjs',
    'node ultimate-berlin-trip-planner/velo/create-trip-planner-leads-collection.mjs --live --sync-fields',
    'node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --live --email YOUR_TEST_EMAIL@example.com',
    'node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --live --email YOUR_TEST_EMAIL@example.com --booking',
    'node ultimate-berlin-trip-planner/velo/simulate-email-sequence.mjs --arrival 2026-06-12 --signup 2026-06-01',
    'node ultimate-berlin-trip-planner/velo/report-trip-planner-leads.mjs --live --limit 200',
    'node ultimate-berlin-trip-planner/release-visibility.mjs',
    '```',
    ''
  ];

  return `${lines.join('\n')}\n`;
}

function main() {
  const state = collectState();
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
  fs.writeFileSync(OUT_MD, markdown(state), 'utf8');
  console.log(`Wrote ${relative(OUT_MD)}`);
  console.log(`Wrote ${relative(OUT_JSON)}`);
  console.log(`Verdict: ${state.verdict}`);
}

main();
