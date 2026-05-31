#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const outFile = path.join(scriptDir, 'LAUNCH_CONTROL_ROOM.html');

function repoPath(relativePath) {
  return path.join(repoRoot, relativePath);
}

function widgetPath(relativePath) {
  return path.join(scriptDir, relativePath);
}

function exists(relativePath) {
  return fs.existsSync(repoPath(relativePath));
}

function readRepo(relativePath) {
  return fs.readFileSync(repoPath(relativePath), 'utf8');
}

function readWidget(relativePath) {
  return fs.readFileSync(widgetPath(relativePath), 'utf8');
}

function readJsonRepo(relativePath) {
  return JSON.parse(readRepo(relativePath));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function unique(values) {
  return [...new Set(values)].sort();
}

function findUltimateTool(toolsHub) {
  const tools = Array.isArray(toolsHub) ? toolsHub : toolsHub.tools || [];
  return tools.find((tool) => tool && tool.slug === 'ultimate-berlin-trip-planner') || null;
}

function latestJsonIn(relativePath, pattern) {
  const absolute = repoPath(relativePath);
  if (!fs.existsSync(absolute)) return null;

  const names = fs.readdirSync(absolute)
    .filter((name) => pattern.test(name))
    .sort()
    .reverse();

  for (const name of names) {
    const file = path.join(absolute, name);
    try {
      return {
        file,
        relative: path.relative(repoRoot, file).replaceAll(path.sep, '/'),
        json: JSON.parse(fs.readFileSync(file, 'utf8'))
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

function statusCard({ state, eyebrow, title, detail, action }) {
  return `
    <article class="bw-status-card is-${escapeHtml(state)}">
      <p class="bw-eyebrow">${escapeHtml(eyebrow)}</p>
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(detail)}</p>
      ${action ? `<div class="bw-card-action">${action}</div>` : ''}
    </article>`;
}

function linkButton(href, label, variant = '') {
  return `<a class="bw-button${variant ? ` ${escapeHtml(variant)}` : ''}" href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;
}

function copyButton(targetId, label = 'Copy') {
  return `<button class="bw-copy" type="button" data-copy-target="${escapeHtml(targetId)}">${escapeHtml(label)}</button>`;
}

function commandBlock(id, title, commands) {
  return `
    <section class="bw-command-card">
      <div class="bw-command-head">
        <h3>${escapeHtml(title)}</h3>
        ${copyButton(id, 'Copy commands')}
      </div>
      <textarea id="${escapeHtml(id)}" readonly spellcheck="false">${escapeHtml(commands.trim())}</textarea>
    </section>`;
}

function fileTile({ title, href, detail, status = 'Ready' }) {
  return `
    <a class="bw-file-tile" href="${escapeHtml(href)}">
      <span>${escapeHtml(status)}</span>
      <strong>${escapeHtml(title)}</strong>
      <small>${escapeHtml(detail)}</small>
    </a>`;
}

function buildModel() {
  const funnel = readWidget('velo/tripPlannerFunnel.js');
  const todos = unique([...funnel.matchAll(/TODO_TRIP_PLANNER_[A-Z0-9_]+/g)].map((match) => match[0]));
  const toolsHub = readJsonRepo('tools-hub/data.json');
  const toolsHome = readJsonRepo('tools-home/data.json');
  const ultimateTool = findUltimateTool(toolsHub);
  const homeTools = Array.isArray(toolsHome.featuredTools) ? toolsHome.featuredTools : [];
  const preflight = latestJsonIn('output/qa/ultimate-trip-planner-remote-preflight', /^remote-preflight-.*\.json$/);
  const smoke = latestLiveSmoke();
  const blogBody = exists('blog-drafts/ultimate-berlin-trip-planner.body.md')
    ? readRepo('blog-drafts/ultimate-berlin-trip-planner.body.md')
    : '';
  const runbook = readWidget('LAUNCH_RUNBOOK.md');

  const checks = preflight?.json?.checks || {};
  const leadStatus = checks.leadOptions?.status || 0;
  const bookingStatus = checks.bookingOptions?.status || 0;
  const collectionOk = checks.tripPlannerCollection?.ok === true && checks.tripPlannerCollection?.schemaOk !== false;
  const collectionMissing = checks.tripPlannerCollection?.missingCriticalFields || [];
  const berlinToolsFree = checks.berlinToolsSlug?.ok === true && checks.berlinToolsSlug?.count === 0;
  const toolPageLive = checks.liveToolPage?.status === 200;
  const widgetReachable = checks.githubWidget?.status === 200;
  const visibilitySafe = Boolean(ultimateTool && String(ultimateTool.status || '').toLowerCase() === 'draft' && !homeTools.some((tool) => tool?.slug === 'ultimate-berlin-trip-planner'));
  const blogReady = blogBody.includes('{{widget:ultimate-berlin-trip-planner}}') &&
    blogBody.includes('{{quick-summary}}') &&
    blogBody.includes('{{faq}}');

  return {
    generatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    todos,
    preflight,
    smoke,
    leadStatus,
    bookingStatus,
    collectionOk,
    collectionMissing,
    berlinToolsFree,
    toolPageLive,
    widgetReachable,
    visibilitySafe,
    blogReady,
    runbookStepCount: (runbook.match(/^##\s+\d+\./gm) || []).length
  };
}

function page() {
  const model = buildModel();
  const emailState = model.todos.length ? 'block' : 'ready';
  const veloState = model.leadStatus === 204 && model.bookingStatus === 204 ? 'ready' : 'pending';
  const smokeState = model.smoke ? 'ready' : 'pending';
  const cmsState = model.toolPageLive ? 'ready' : 'pending';
  const visibilityState = model.visibilitySafe ? 'safe' : 'block';
  const blogState = model.blogReady ? 'ready' : 'pending';

  const regenerateCommands = `
node ultimate-berlin-trip-planner/email/build-triggered-email-html.mjs
node ultimate-berlin-trip-planner/velo/build-velo-install-kit.mjs
node ultimate-berlin-trip-planner/build-launch-control-room.mjs`;

  const messageIdCommands = `
node ultimate-berlin-trip-planner/velo/run-email-id-launch-gate.mjs --import-downloads
source ../scripts/load-api-keys.sh
node ultimate-berlin-trip-planner/velo/run-email-id-launch-gate.mjs --import-downloads --write
node ultimate-berlin-trip-planner/velo/import-message-ids-from-downloads.mjs
node ultimate-berlin-trip-planner/velo/import-message-ids-from-downloads.mjs --write
pbpaste | node ultimate-berlin-trip-planner/velo/build-message-ids-from-paste.mjs
pbpaste | node ultimate-berlin-trip-planner/velo/build-message-ids-from-paste.mjs --write
node ultimate-berlin-trip-planner/velo/check-triggered-email-ids.mjs --ids ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json
node ultimate-berlin-trip-planner/velo/apply-triggered-email-ids.mjs --ids ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json
node ultimate-berlin-trip-planner/velo/apply-triggered-email-ids.mjs --ids ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json --write
node ultimate-berlin-trip-planner/velo/check-triggered-email-ids.mjs --ids ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json --require-applied
node ultimate-berlin-trip-planner/launch-audit.mjs`;

  const smokeCommands = `
source ../scripts/load-api-keys.sh
node ultimate-berlin-trip-planner/launch-remote-preflight.mjs
node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --live --email YOUR_TEST_EMAIL@example.com
node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --live --email YOUR_TEST_EMAIL@example.com --booking
node ultimate-berlin-trip-planner/launch-audit.mjs`;

  const sequenceCommands = `
node ultimate-berlin-trip-planner/velo/simulate-email-sequence.mjs --arrival 2026-06-12 --signup 2026-06-01
node ultimate-berlin-trip-planner/velo/simulate-email-sequence.mjs --arrival 2026-06-12 --job-date 2026-06-09 --hour 10
node ultimate-berlin-trip-planner/velo/simulate-email-sequence.mjs --arrival 2026-06-12 --signup 2026-06-01 --booked`;

  const leadReportCommands = `
node ultimate-berlin-trip-planner/velo/report-trip-planner-leads.mjs
source ../scripts/load-api-keys.sh
node ultimate-berlin-trip-planner/velo/report-trip-planner-leads.mjs --live --limit 200`;

  const cmsCommands = `
source ../scripts/load-api-keys.sh
node ../insert-ultimate-berlin-trip-planner.js --dry-run
node ../insert-ultimate-berlin-trip-planner.js`;

  const visibilityCommands = `
node ultimate-berlin-trip-planner/release-visibility.mjs
node ultimate-berlin-trip-planner/release-visibility.mjs --write --regenerate-widgets-seo
node ultimate-berlin-trip-planner/release-visibility.mjs --write --include-home --regenerate-widgets-seo`;

  const finalAuditCommands = `
node ultimate-berlin-trip-planner/launch-audit.mjs
node ultimate-berlin-trip-planner/launch-remote-preflight.mjs
git diff --check -- ultimate-berlin-trip-planner tools-hub/data.json tools-home/data.json widgets-hub/index.html widgets-hub/widgets-hub-element.js`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ultimate Berlin Trip Planner Launch Control Room</title>
  <style>
    :root {
      --green: #1B5E20;
      --yellow: #FFE600;
      --lime: #7CB342;
      --light: #C5E1A5;
      --cream: #FAFAF5;
      --ink: #212121;
      --muted: #4E5A4E;
      --line: rgba(27, 94, 32, 0.2);
      --red: #E63946;
      font-family: Montserrat, Arial, sans-serif;
      color: var(--ink);
      background: var(--cream);
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      background:
        linear-gradient(135deg, rgba(255, 230, 0, 0.16), transparent 34rem),
        linear-gradient(225deg, rgba(124, 179, 66, 0.16), transparent 30rem),
        var(--cream);
    }

    main {
      width: min(1200px, calc(100% - 32px));
      margin: 0 auto;
      padding: 28px 0 44px;
    }

    .bw-hero,
    .bw-section,
    .bw-status-card,
    .bw-command-card,
    .bw-file-tile {
      border: 1px solid var(--line);
      background: rgba(255, 255, 255, 0.84);
      border-radius: 8px;
      box-shadow: 0 14px 34px rgba(27, 94, 32, 0.08);
    }

    .bw-hero {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
      gap: 22px;
      padding: 24px;
      margin-bottom: 20px;
    }

    .bw-brand {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      color: var(--green);
      font-size: 0.78rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .bw-mark {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: grid;
      place-items: center;
      color: var(--green);
      background: linear-gradient(135deg, var(--yellow), var(--lime));
      font-weight: 900;
      letter-spacing: 0;
    }

    h1,
    h2,
    h3,
    p {
      margin-top: 0;
    }

    h1 {
      max-width: 780px;
      margin: 18px 0 12px;
      color: var(--green);
      font-size: clamp(2.1rem, 4vw, 4rem);
      line-height: 0.98;
      letter-spacing: 0;
    }

    h2 {
      margin-bottom: 14px;
      color: var(--green);
      font-size: 1.35rem;
      letter-spacing: 0;
    }

    h3 {
      margin-bottom: 8px;
      color: var(--green);
      font-size: 1.02rem;
      letter-spacing: 0;
    }

    .bw-lead {
      max-width: 760px;
      margin-bottom: 0;
      color: var(--muted);
      line-height: 1.62;
      font-size: 1.02rem;
    }

    .bw-hero-side {
      display: grid;
      gap: 12px;
      align-content: center;
    }

    .bw-big-status {
      padding: 16px;
      border-radius: 8px;
      background: #fff9c9;
      border: 1px solid rgba(255, 190, 0, 0.55);
      color: #5b4600;
      line-height: 1.45;
      font-weight: 700;
    }

    .bw-big-status strong {
      display: block;
      margin-bottom: 4px;
      color: var(--green);
      font-size: 1.35rem;
    }

    .bw-section {
      padding: 20px;
      margin-top: 18px;
    }

    .bw-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
    }

    .bw-status-card {
      min-height: 180px;
      padding: 18px;
      position: relative;
      overflow: hidden;
    }

    .bw-status-card::before {
      content: "";
      position: absolute;
      inset: 0 0 auto 0;
      height: 5px;
      background: var(--lime);
    }

    .bw-status-card.is-block::before {
      background: var(--red);
    }

    .bw-status-card.is-pending::before {
      background: var(--yellow);
    }

    .bw-status-card.is-safe::before,
    .bw-status-card.is-ready::before {
      background: var(--green);
    }

    .bw-status-card p {
      color: var(--muted);
      line-height: 1.5;
      margin-bottom: 0;
    }

    .bw-eyebrow {
      margin-bottom: 7px !important;
      color: var(--green) !important;
      font-size: 0.72rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .bw-card-action {
      margin-top: 14px;
    }

    .bw-button,
    .bw-copy {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 40px;
      border: 0;
      border-radius: 999px;
      background: var(--green);
      color: #fff;
      padding: 10px 14px;
      font: inherit;
      font-weight: 900;
      text-decoration: none;
      cursor: pointer;
      white-space: nowrap;
      box-shadow: 0 8px 18px rgba(27, 94, 32, 0.18);
    }

    .bw-button.is-light {
      background: #eef8e8;
      color: var(--green);
      box-shadow: none;
      border: 1px solid var(--line);
    }

    .bw-button:hover,
    .bw-button:focus-visible,
    .bw-copy:hover,
    .bw-copy:focus-visible {
      outline: 3px solid rgba(255, 230, 0, 0.78);
      outline-offset: 2px;
    }

    .bw-file-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;
    }

    .bw-file-tile {
      display: grid;
      gap: 6px;
      padding: 15px;
      color: var(--ink);
      text-decoration: none;
    }

    .bw-file-tile span {
      width: fit-content;
      border-radius: 999px;
      padding: 4px 8px;
      background: rgba(197, 225, 165, 0.55);
      color: var(--green);
      font-size: 0.7rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .bw-file-tile small {
      color: var(--muted);
      line-height: 1.4;
    }

    .bw-command-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }

    .bw-command-card {
      overflow: hidden;
    }

    .bw-command-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 16px 16px 0;
    }

    textarea {
      display: block;
      width: 100%;
      min-height: 126px;
      resize: vertical;
      margin-top: 12px;
      border: 0;
      border-top: 1px solid var(--line);
      background: #101610;
      color: #f4fff1;
      padding: 15px;
      font: 0.78rem/1.5 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      white-space: pre;
    }

    .bw-next {
      display: grid;
      grid-template-columns: 72px minmax(0, 1fr);
      gap: 16px;
      align-items: center;
      padding: 16px;
      border-radius: 8px;
      background: #fff9c9;
      border: 1px solid rgba(255, 190, 0, 0.55);
      color: #5b4600;
    }

    .bw-next strong {
      color: var(--green);
    }

    .bw-next-number {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      display: grid;
      place-items: center;
      background: var(--green);
      color: #fff;
      font-size: 1.6rem;
      font-weight: 900;
    }

    code {
      color: var(--green);
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 0.9em;
      font-weight: 700;
    }

    @media (max-width: 900px) {
      main {
        width: min(100% - 22px, 1200px);
        padding-top: 16px;
      }

      .bw-hero,
      .bw-grid,
      .bw-file-grid,
      .bw-command-grid {
        grid-template-columns: 1fr;
      }

      .bw-command-head {
        align-items: flex-start;
        flex-direction: column;
      }

      .bw-copy,
      .bw-button {
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <main>
    <section class="bw-hero">
      <div>
        <div class="bw-brand"><span class="bw-mark">BW</span><span>BerlinWalk internal launch page</span></div>
        <h1>Ultimate Planner Launch Control Room</h1>
        <p class="bw-lead">One local page for the remaining handoff: email template IDs, Velo paste kit, live smoke tests, CMS insert, draft visibility, and blog publish order.</p>
      </div>
      <aside class="bw-hero-side">
        <div class="bw-big-status">
          <strong>${model.todos.length ? 'Not ready' : 'Ready for Wix smoke'}</strong>
          ${model.todos.length ? `${model.todos.length} Triggered Email IDs still use TODO placeholders.` : 'Triggered Email placeholders are gone.'}
        </div>
        <p class="bw-lead">Generated ${escapeHtml(model.generatedAt)}. File: <code>LAUNCH_CONTROL_ROOM.html</code>. Runbook sections detected: ${model.runbookStepCount}.</p>
      </aside>
    </section>

    <section class="bw-section">
      <h2>Launch State</h2>
      <div class="bw-grid">
        ${statusCard({
          state: emailState,
          eyebrow: 'Blocker',
          title: 'Triggered Email IDs',
          detail: model.todos.length ? `${model.todos.length} real Wix message IDs still need to replace TODO_TRIP_PLANNER placeholders.` : 'All Triggered Email IDs are applied.',
          action: linkButton('email/paste-ready/copy-kit.html', 'Open email copy kit')
        })}
        ${statusCard({
          state: model.collectionOk ? 'ready' : 'pending',
          eyebrow: 'Data',
          title: 'TripPlannerLeads',
          detail: model.collectionOk
            ? 'Remote preflight sees the live collection and critical fields.'
            : model.collectionMissing.length
              ? `Collection exists, but missing critical fields: ${model.collectionMissing.join(', ')}.`
              : 'Collection proof is missing from latest remote preflight.',
          action: model.preflight ? `<small><code>${escapeHtml(model.preflight.relative)}</code></small>` : ''
        })}
        ${statusCard({
          state: veloState,
          eyebrow: 'Backend',
          title: 'Velo endpoints',
          detail: veloState === 'ready' ? 'Lead and booking OPTIONS handlers are published.' : `Current latest preflight: lead ${model.leadStatus || 'unknown'}, booking ${model.bookingStatus || 'unknown'}.`,
          action: linkButton('velo/install-kit.html', 'Open Velo install kit')
        })}
        ${statusCard({
          state: smokeState,
          eyebrow: 'QA',
          title: 'Live smoke evidence',
          detail: model.smoke ? `Latest passing smoke: ${model.smoke.relative}` : 'No passing live lead/booking smoke JSON yet.',
          action: ''
        })}
        ${statusCard({
          state: cmsState,
          eyebrow: 'CMS',
          title: 'BerlinTools page',
          detail: cmsState === 'ready' ? 'The live dynamic tool URL returned 200.' : model.berlinToolsFree ? 'Slug is still free. Insert CMS only after live smoke passes.' : 'Slug is not confirmed free in latest preflight.',
          action: ''
        })}
        ${statusCard({
          state: visibilityState,
          eyebrow: 'Safety',
          title: 'Public visibility',
          detail: model.visibilitySafe ? 'Ultimate is still draft and not in homepage shortcuts.' : 'Visibility protection needs review before pushing.',
          action: ''
        })}
        ${statusCard({
          state: model.widgetReachable ? 'ready' : 'pending',
          eyebrow: 'Widget',
          title: 'GitHub Pages',
          detail: model.widgetReachable ? 'Remote preflight reaches the widget URL.' : 'Widget URL was not reachable in latest preflight.',
          action: linkButton('https://fenerszymanski.github.io/berlinwalk-widgets/ultimate-berlin-trip-planner/?context=tool&date=2026-06-01&tripLength=3&v=launch-control', 'Open live widget')
        })}
        ${statusCard({
          state: blogState,
          eyebrow: 'SEO',
          title: 'Blog package',
          detail: blogState ? 'Body draft has widget, Quick Summary, and FAQ placeholders.' : 'Blog body package needs review before publish.',
          action: linkButton('blog-drafts/ultimate-berlin-trip-planner.body.md', 'Open body draft', 'is-light')
        })}
        ${statusCard({
          state: 'safe',
          eyebrow: 'Rule',
          title: 'Publish order',
          detail: 'Emails first, Velo second, smoke third, CMS/visibility fourth, blog last.',
          action: linkButton('LAUNCH_RUNBOOK.md', 'Open runbook', 'is-light')
        })}
      </div>
    </section>

    <section class="bw-section">
      <h2>Open The Right Kit</h2>
      <div class="bw-file-grid">
        ${fileTile({ title: 'Triggered Email copy kit', href: 'email/paste-ready/copy-kit.html', detail: 'Subject, preheader, HTML block, and message ID JSON builder.' })}
        ${fileTile({ title: 'Turkish email setup', href: 'WIX_EMAIL_SETUP_TR.md', detail: 'Yusuf-facing step-by-step Wix email setup checklist.' })}
        ${fileTile({ title: 'Triggered Email API notes', href: 'TRIGGERED_EMAIL_API_NOTES.md', detail: 'Why template creation remains a Wix dashboard step for launch.' })}
        ${fileTile({ title: 'Velo install kit', href: 'velo/install-kit.html', detail: 'Copyable backend source panels and smoke commands.' })}
        ${fileTile({ title: 'Launch status report', href: 'LAUNCH_STATUS.md', detail: 'Markdown verdict with gates, evidence, blockers, and next actions.' })}
        ${fileTile({ title: 'Launch runbook', href: 'LAUNCH_RUNBOOK.md', detail: 'Manual order for Wix, CMS, visibility, and blog.' })}
        ${fileTile({ title: 'Research backlog', href: 'RESEARCH_BACKLOG.md', detail: 'Product state, QA evidence, and future polish notes.' })}
      </div>
    </section>

    <section class="bw-section">
      <h2>Next Manual Move</h2>
      <div class="bw-next">
        <div class="bw-next-number">1</div>
        <p><strong>Create the 5 Wix Triggered Emails first.</strong> Use the email copy kit, paste each template, copy each Wix editor URL into the JSON builder, save <code>message-ids.local.json</code>, then run the Message ID commands below. Do not create a booked-path Ultimate set; the existing booking email sequence already handles booked guests.</p>
      </div>
    </section>

    <section class="bw-section">
      <h2>Command Blocks</h2>
      <div class="bw-command-grid">
        ${commandBlock('cmd-regenerate', 'Regenerate local kits', regenerateCommands)}
        ${commandBlock('cmd-message-ids', 'Apply message IDs', messageIdCommands)}
        ${commandBlock('cmd-smoke', 'Post-publish live smoke', smokeCommands)}
        ${commandBlock('cmd-sequence', 'Email sequence simulator', sequenceCommands)}
        ${commandBlock('cmd-lead-report', 'Lead report after launch', leadReportCommands)}
        ${commandBlock('cmd-cms', 'CMS insert after smoke', cmsCommands)}
        ${commandBlock('cmd-visibility', 'Visibility release after CMS QA', visibilityCommands)}
        ${commandBlock('cmd-final-audit', 'Final local audit', finalAuditCommands)}
      </div>
    </section>
  </main>

  <script>
    const restoreText = (button, text) => {
      const original = button.dataset.originalText || button.textContent;
      button.dataset.originalText = original;
      button.textContent = text;
      window.setTimeout(() => {
        button.textContent = button.dataset.originalText;
      }, 1500);
    };

    const copyTarget = async (button) => {
      const target = document.getElementById(button.dataset.copyTarget);
      if (!target) return;
      target.focus();
      target.select();

      try {
        await navigator.clipboard.writeText(target.value);
        restoreText(button, 'Copied');
      } catch {
        const ok = document.execCommand('copy');
        restoreText(button, ok ? 'Copied' : 'Select text');
      }
    };

    document.addEventListener('click', (event) => {
      const button = event.target.closest('[data-copy-target]');
      if (button) copyTarget(button);
    });
  </script>
</body>
</html>
`;
}

fs.writeFileSync(outFile, page().replace(/[ \t]+$/gm, ''), 'utf8');
console.log(`Wrote ${path.relative(process.cwd(), outFile)}`);
