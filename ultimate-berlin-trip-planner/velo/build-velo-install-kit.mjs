#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const widgetRoot = path.resolve(scriptDir, '..');
const outFile = path.join(scriptDir, 'install-kit.html');

const SOURCES = [
  {
    id: 'funnel',
    title: 'Backend/tripPlannerFunnel.js',
    badge: 'Add file',
    source: 'tripPlannerFunnel.js',
    target: 'Create this backend file in Wix Developer Tools.',
    note: 'Paste the full source into a new Backend file named tripPlannerFunnel.js.'
  },
  {
    id: 'http',
    title: 'Backend/http-functions.js',
    badge: 'Merge exports',
    source: 'http-functions.js',
    target: 'Merge into the existing live Backend/http-functions.js file.',
    note: 'Keep existing live endpoints. Add the imports and tripPlannerLead/tripPlannerBooking handlers from this source.'
  },
  {
    id: 'jobs',
    title: 'jobs.config',
    badge: 'Merge job',
    source: 'jobs.config',
    target: 'Merge into the live scheduled jobs config.',
    note: 'Add the hourly processTripPlannerDueEmails job. If jobs.config already has jobs, merge the object into that jobs array.'
  }
];

function read(relativePath) {
  return fs.readFileSync(path.join(scriptDir, relativePath), 'utf8');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function copyButton(targetId, label = 'Copy') {
  return `<button class="bw-copy" type="button" data-copy-target="${targetId}">${escapeHtml(label)}</button>`;
}

function sourcePanel(item) {
  const source = read(item.source);
  const sourceId = `source-${item.id}`;
  const lineCount = source.split('\n').length;
  const bytes = Buffer.byteLength(source, 'utf8');

  return `
    <section class="bw-panel" id="${escapeHtml(item.id)}">
      <div class="bw-panel-head">
        <div>
          <p class="bw-kicker">${escapeHtml(item.badge)}</p>
          <h2>${escapeHtml(item.title)}</h2>
        </div>
        ${copyButton(sourceId, 'Copy source')}
      </div>
      <p class="bw-target">${escapeHtml(item.target)}</p>
      <p class="bw-note">${escapeHtml(item.note)}</p>
      <div class="bw-meta">
        <span>${lineCount} lines</span>
        <span>${formatBytes(bytes)}</span>
        <span>${escapeHtml(item.source)}</span>
      </div>
      <textarea id="${sourceId}" readonly spellcheck="false">${escapeHtml(source)}</textarea>
    </section>`;
}

function checklistHtml(todoCount) {
  const idWarning = todoCount
    ? `<li class="is-warning">Apply the 10 Triggered Email message IDs before pasting Velo. Current source still has <strong>${todoCount}</strong> TODO_TRIP_PLANNER placeholders.</li>`
    : '<li class="is-good">Triggered Email placeholders are gone in the generated source.</li>';

  return `
    <ol class="bw-checklist">
      <li>Run the pre-publish gate commands below from <code>berlinwalk-widgets/</code>.</li>
      ${idWarning}
      <li>Confirm <code>TripPlannerLeads</code> passes remote preflight with all critical fields verified.</li>
      <li>Create <code>Backend/tripPlannerFunnel.js</code> in Wix and paste the full source below.</li>
      <li>Merge the <code>tripPlannerLead</code> and <code>tripPlannerBooking</code> handlers into live <code>Backend/http-functions.js</code>.</li>
      <li>Merge the hourly <code>processTripPlannerDueEmails</code> entry into <code>jobs.config</code>.</li>
      <li>Publish Wix, then run remote preflight and the live smoke helper with a real test inbox.</li>
    </ol>`;
}

function prePublishPanel(todoCount) {
  const commands = [
    'node ultimate-berlin-trip-planner/velo/run-email-id-launch-gate.mjs --import-downloads',
    'source ../scripts/load-api-keys.sh',
    'node ultimate-berlin-trip-planner/velo/run-email-id-launch-gate.mjs --import-downloads --write',
    'node ultimate-berlin-trip-planner/velo/import-message-ids-from-downloads.mjs',
    'node ultimate-berlin-trip-planner/velo/import-message-ids-from-downloads.mjs --write',
    'node ultimate-berlin-trip-planner/velo/check-triggered-email-ids.mjs --ids ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json',
    'node ultimate-berlin-trip-planner/velo/apply-triggered-email-ids.mjs --ids ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json',
    'node ultimate-berlin-trip-planner/velo/apply-triggered-email-ids.mjs --ids ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json --write',
    'node ultimate-berlin-trip-planner/velo/check-triggered-email-ids.mjs --ids ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json --require-applied',
    'source ../scripts/load-api-keys.sh',
    'node ultimate-berlin-trip-planner/velo/prepublish-gate.mjs',
    'node ultimate-berlin-trip-planner/launch-remote-preflight.mjs',
    'node ultimate-berlin-trip-planner/velo/build-velo-install-kit.mjs',
    'node ultimate-berlin-trip-planner/launch-audit.mjs'
  ].join('\n');
  const gateText = todoCount
    ? 'Do not paste/publish Velo yet. Create the 10 Wix Triggered Email templates, bulk-paste their editor URLs in copy-kit.html, then run these commands.'
    : 'The email IDs are applied. Run these commands once more before pasting the Velo source below.';

  return `
    <section class="bw-panel bw-prepublish">
      <div class="bw-panel-head">
        <div>
          <p class="bw-kicker">Before Wix paste</p>
          <h2>Pre-publish gate</h2>
        </div>
        ${copyButton('prepublish-commands', 'Copy gate commands')}
      </div>
      <p class="bw-target">${escapeHtml(gateText)}</p>
      <p class="bw-note">The copy kit is at <code>ultimate-berlin-trip-planner/email/paste-ready/copy-kit.html</code>. Its bulk box accepts all 10 Wix editor URLs in template order. If the JSON downloads to <code>~/Downloads</code>, the gate runner can import, validate, apply, regenerate, preflight, and audit in one dry-run-first flow. The <code>--write</code> apply step creates a timestamped local backup under <code>output/qa/ultimate-trip-planner-email-id-apply/</code>.</p>
      <textarea id="prepublish-commands" readonly spellcheck="false">${escapeHtml(commands)}</textarea>
    </section>`;
}

function commandPanel() {
  const commands = [
    'source ../scripts/load-api-keys.sh',
    'node ultimate-berlin-trip-planner/launch-audit.mjs',
    'node ultimate-berlin-trip-planner/launch-remote-preflight.mjs',
    'node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --live --email YOUR_TEST_EMAIL@example.com',
    'node ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs --live --email YOUR_TEST_EMAIL@example.com --booking',
    'node ultimate-berlin-trip-planner/launch-audit.mjs'
  ].join('\n');

  return `
    <section class="bw-panel bw-commands">
      <div class="bw-panel-head">
        <div>
          <p class="bw-kicker">After publish</p>
          <h2>Smoke commands</h2>
        </div>
        ${copyButton('smoke-commands', 'Copy commands')}
      </div>
      <p class="bw-note">Run these from <code>${escapeHtml(path.basename(path.dirname(widgetRoot)))}/berlinwalk-widgets/</code> after the Wix site is published.</p>
      <textarea id="smoke-commands" readonly spellcheck="false">${escapeHtml(commands)}</textarea>
    </section>`;
}

function htmlPage() {
  const funnelSource = read('tripPlannerFunnel.js');
  const todos = [...funnelSource.matchAll(/TODO_TRIP_PLANNER_[A-Z0-9_]+/g)].map((match) => match[0]);
  const uniqueTodos = [...new Set(todos)].sort();
  const panels = SOURCES.map(sourcePanel).join('\n');
  const generatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ultimate Berlin Trip Planner Velo Install Kit</title>
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
        linear-gradient(135deg, rgba(255, 230, 0, 0.15), transparent 36rem),
        var(--cream);
    }

    main {
      width: min(1180px, calc(100% - 32px));
      margin: 0 auto;
      padding: 28px 0 42px;
    }

    .bw-hero {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(280px, 380px);
      gap: 22px;
      align-items: stretch;
      margin-bottom: 20px;
    }

    .bw-title,
    .bw-status,
    .bw-panel {
      border: 1px solid var(--line);
      background: rgba(255, 255, 255, 0.82);
      border-radius: 8px;
      box-shadow: 0 14px 34px rgba(27, 94, 32, 0.08);
    }

    .bw-title {
      padding: 26px;
    }

    .bw-status {
      padding: 22px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 16px;
    }

    .bw-brand {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      color: var(--green);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0;
      font-size: 0.82rem;
    }

    .bw-brand-mark {
      width: 38px;
      height: 38px;
      border-radius: 7px;
      display: grid;
      place-items: center;
      background: linear-gradient(135deg, var(--yellow), var(--lime));
      color: var(--green);
      font-weight: 900;
      font-size: 1.35rem;
    }

    h1,
    h2,
    p {
      margin-top: 0;
    }

    h1 {
      margin: 18px 0 10px;
      color: var(--green);
      font-size: clamp(2rem, 4vw, 4.15rem);
      line-height: 0.98;
      letter-spacing: 0;
    }

    h2 {
      color: var(--green);
      font-size: 1.25rem;
      margin-bottom: 0;
      letter-spacing: 0;
    }

    .bw-lead {
      max-width: 720px;
      color: var(--muted);
      font-size: 1.02rem;
      line-height: 1.6;
      margin-bottom: 0;
    }

    .bw-kicker {
      margin-bottom: 5px;
      color: var(--green);
      font-size: 0.75rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .bw-status strong {
      color: var(--green);
    }

    .bw-alert {
      border-radius: 8px;
      padding: 12px 13px;
      background: #fff9c9;
      border: 1px solid rgba(255, 190, 0, 0.55);
      color: #5b4600;
      line-height: 1.45;
      font-size: 0.93rem;
    }

    .bw-alert.is-good {
      background: #eef8e8;
      border-color: rgba(124, 179, 66, 0.5);
      color: var(--green);
    }

    .bw-check-card {
      margin-bottom: 20px;
      padding: 22px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.72);
    }

    .bw-checklist {
      margin: 14px 0 0;
      padding-left: 24px;
      color: var(--muted);
      line-height: 1.65;
    }

    .bw-checklist li {
      padding-left: 4px;
    }

    .bw-checklist .is-warning {
      color: #735300;
      font-weight: 700;
    }

    .bw-checklist .is-good {
      color: var(--green);
      font-weight: 700;
    }

    .bw-grid {
      display: grid;
      gap: 18px;
    }

    .bw-panel {
      overflow: hidden;
    }

    .bw-panel-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding: 18px 18px 0;
    }

    .bw-target,
    .bw-note,
    .bw-meta {
      margin-left: 18px;
      margin-right: 18px;
    }

    .bw-target {
      margin-top: 13px;
      margin-bottom: 5px;
      color: var(--ink);
      font-weight: 800;
    }

    .bw-note {
      margin-bottom: 12px;
      color: var(--muted);
      line-height: 1.55;
    }

    .bw-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 12px;
    }

    .bw-meta span {
      display: inline-flex;
      align-items: center;
      min-height: 26px;
      border-radius: 999px;
      padding: 5px 10px;
      background: rgba(197, 225, 165, 0.45);
      color: var(--green);
      font-size: 0.78rem;
      font-weight: 800;
    }

    textarea {
      display: block;
      width: 100%;
      min-height: 360px;
      resize: vertical;
      border: 0;
      border-top: 1px solid var(--line);
      background: #101610;
      color: #f4fff1;
      padding: 16px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 0.78rem;
      line-height: 1.5;
      white-space: pre;
    }

    .bw-commands textarea {
      min-height: 150px;
    }

    .bw-prepublish textarea {
      min-height: 210px;
    }

    .bw-copy {
      border: 0;
      border-radius: 999px;
      background: var(--green);
      color: #fff;
      padding: 10px 14px;
      font-weight: 900;
      cursor: pointer;
      white-space: nowrap;
      box-shadow: 0 8px 18px rgba(27, 94, 32, 0.18);
    }

    .bw-copy:hover,
    .bw-copy:focus-visible {
      background: #0f4514;
      outline: 3px solid rgba(255, 230, 0, 0.8);
      outline-offset: 2px;
    }

    code {
      color: var(--green);
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 0.9em;
      font-weight: 700;
    }

    .bw-footer-note {
      margin: 18px 0 0;
      color: var(--muted);
      line-height: 1.55;
      font-size: 0.92rem;
    }

    @media (max-width: 780px) {
      main {
        width: min(100% - 22px, 1180px);
        padding-top: 16px;
      }

      .bw-hero {
        grid-template-columns: 1fr;
      }

      .bw-panel-head {
        align-items: flex-start;
        flex-direction: column;
      }

      .bw-copy {
        width: 100%;
      }

      textarea {
        min-height: 300px;
        font-size: 0.74rem;
      }
    }
  </style>
</head>
<body>
  <main>
    <section class="bw-hero">
      <div class="bw-title">
        <div class="bw-brand"><span class="bw-brand-mark">BW</span><span>BerlinWalk internal install kit</span></div>
        <h1>Ultimate Planner Velo install</h1>
        <p class="bw-lead">Use this local page when moving the Ultimate Berlin Trip Planner backend into Wix. It keeps the three paste points visible, copyable, and in launch order.</p>
      </div>
      <aside class="bw-status">
        <div>
          <p class="bw-kicker">Generated</p>
          <p><strong>${escapeHtml(generatedAt)}</strong></p>
          <p class="bw-footer-note">Source folder: <code>ultimate-berlin-trip-planner/velo/</code></p>
        </div>
        <div class="bw-alert${uniqueTodos.length ? '' : ' is-good'}">
          ${uniqueTodos.length
            ? `Current Velo source still contains ${uniqueTodos.length} Triggered Email placeholder IDs. Apply real IDs before live publish.`
            : 'Triggered Email placeholders are gone in this generated source.'}
        </div>
      </aside>
    </section>

    <section class="bw-check-card">
      <p class="bw-kicker">Publish order</p>
      <h2>Do this in Wix Developer Tools</h2>
      ${checklistHtml(uniqueTodos.length)}
    </section>

    <div class="bw-grid">
      ${prePublishPanel(uniqueTodos.length)}
      ${panels}
      ${commandPanel()}
    </div>
  </main>

  <script>
    const statusText = (button, text) => {
      const original = button.dataset.originalText || button.textContent;
      button.dataset.originalText = original;
      button.textContent = text;
      window.setTimeout(() => {
        button.textContent = button.dataset.originalText;
      }, 1600);
    };

    const copyValue = async (button) => {
      const target = document.getElementById(button.dataset.copyTarget);
      if (!target) return;
      target.focus();
      target.select();

      try {
        await navigator.clipboard.writeText(target.value);
        statusText(button, 'Copied');
      } catch (error) {
        const ok = document.execCommand('copy');
        statusText(button, ok ? 'Copied' : 'Select text');
      }
    };

    document.addEventListener('click', (event) => {
      const button = event.target.closest('[data-copy-target]');
      if (button) copyValue(button);
    });
  </script>
</body>
</html>
`;
}

fs.writeFileSync(outFile, htmlPage(), 'utf8');
console.log(`Wrote ${path.relative(process.cwd(), outFile)}`);
