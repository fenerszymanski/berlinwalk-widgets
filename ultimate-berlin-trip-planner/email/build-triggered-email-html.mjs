#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const emailDir = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(emailDir, 'paste-ready');

const LOGO_URL = 'https://static.wixstatic.com/media/5a08a3_2f62d59b419643c0994771fac5765c79~mv2.png';
const SITE_URL = 'https://www.berlinwalk.com';
const INSTAGRAM_URL = 'https://www.instagram.com/berlinwalkingtour';

const EMAILS = [
  {
    source: 'e0-instant-plan.md',
    output: 'e0-instant-plan.html',
    path: 'sales',
    stage: 'instant',
    placeholder: 'TODO_TRIP_PLANNER_INSTANT',
    eyebrow: 'Your plan'
  },
  {
    source: 'e1-seven-days-before.md',
    output: 'e1-seven-days-before.html',
    path: 'sales',
    stage: 'minus7',
    placeholder: 'TODO_TRIP_PLANNER_MINUS_7',
    eyebrow: 'One week before'
  },
  {
    source: 'e2-three-days-before.md',
    output: 'e2-three-days-before.html',
    path: 'sales',
    stage: 'minus3',
    placeholder: 'TODO_TRIP_PLANNER_MINUS_3',
    eyebrow: 'Three days before'
  },
  {
    source: 'e3-one-day-before.md',
    output: 'e3-one-day-before.html',
    path: 'sales',
    stage: 'minus1',
    placeholder: 'TODO_TRIP_PLANNER_MINUS_1',
    eyebrow: 'Tomorrow'
  },
  {
    source: 'e4-arrival-day.md',
    output: 'e4-arrival-day.html',
    path: 'sales',
    stage: 'dayOf',
    placeholder: 'TODO_TRIP_PLANNER_DAY_OF',
    eyebrow: 'Arrival day'
  },
  {
    source: 'booked-e0-instant-plan.md',
    output: 'booked-e0-instant-plan.html',
    path: 'booked',
    stage: 'instant',
    placeholder: 'TODO_TRIP_PLANNER_INSTANT_BOOKED',
    eyebrow: 'Booked path'
  },
  {
    source: 'booked-e1-seven-days-before.md',
    output: 'booked-e1-seven-days-before.html',
    path: 'booked',
    stage: 'minus7',
    placeholder: 'TODO_TRIP_PLANNER_MINUS_7_BOOKED',
    eyebrow: 'Booked path'
  },
  {
    source: 'booked-e2-three-days-before.md',
    output: 'booked-e2-three-days-before.html',
    path: 'booked',
    stage: 'minus3',
    placeholder: 'TODO_TRIP_PLANNER_MINUS_3_BOOKED',
    eyebrow: 'Booked path'
  },
  {
    source: 'booked-e3-one-day-before.md',
    output: 'booked-e3-one-day-before.html',
    path: 'booked',
    stage: 'minus1',
    placeholder: 'TODO_TRIP_PLANNER_MINUS_1_BOOKED',
    eyebrow: 'Booked path'
  },
  {
    source: 'booked-e4-arrival-day.md',
    output: 'booked-e4-arrival-day.html',
    path: 'booked',
    stage: 'dayOf',
    placeholder: 'TODO_TRIP_PLANNER_DAY_OF_BOOKED',
    eyebrow: 'Booked path'
  }
];

const LINK_LABELS = {
  bookingUrl: 'Book the free walking tour',
  meetingPointUrl: 'Open the World Clock meeting point',
  firstDayPlannerUrl: 'Open the First-Day Planner',
  ticketCalculatorUrl: 'Open the ticket calculator',
  whatsOpenUrl: 'Check what is open today',
  dailyBudgetUrl: 'Open the daily budget calculator'
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inlineMarkdown(value) {
  const withoutVariableTicks = String(value).replace(/`(\$\{[A-Za-z_][A-Za-z0-9_]*\})`/g, '$1');
  return escapeHtml(withoutVariableTicks)
    .replace(/\*\*([^*]+)\*\*/g, '<strong style="color: #1B5E20;">$1</strong>');
}

function plainText(value) {
  return String(value)
    .replace(/`/g, '')
    .replace(/\*\*/g, '')
    .trim();
}

function extractVariables(value) {
  return [...String(value).matchAll(/\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g)].map((match) => match[1]);
}

function parseMarkdown(fileName) {
  const source = fs.readFileSync(path.join(emailDir, fileName), 'utf8').replace(/\r\n/g, '\n');
  const lines = source.split('\n');
  const title = plainText(lines.find((line) => line.startsWith('# ')) || fileName).replace(/^#\s*/, '');
  const subjectLine = lines.find((line) => line.startsWith('Subject:'));
  const preheaderLine = lines.find((line) => line.startsWith('Preheader:'));
  const preheaderIndex = lines.findIndex((line) => line.startsWith('Preheader:'));
  const bodyLines = stripSignature(lines.slice(preheaderIndex + 1));

  return {
    title,
    subject: plainText(subjectLine ? subjectLine.replace(/^Subject:\s*/, '') : title),
    preheader: plainText(preheaderLine ? preheaderLine.replace(/^Preheader:\s*/, '') : ''),
    bodyLines,
    variables: [...new Set(extractVariables(source))].sort()
  };
}

function stripSignature(lines) {
  const trimmed = [...lines];
  while (trimmed.length && !trimmed[0].trim()) trimmed.shift();
  while (trimmed.length && !trimmed[trimmed.length - 1].trim()) trimmed.pop();

  for (let index = trimmed.length - 1; index >= Math.max(0, trimmed.length - 8); index -= 1) {
    if (plainText(trimmed[index]) === 'Yusuf') {
      return trimmed.slice(0, index);
    }
  }

  return trimmed;
}

function row(inner, padding = '0 28px 18px') {
  return `        <tr>
          <td style="padding: ${padding};">
${inner}
          </td>
        </tr>`;
}

function paragraph(text) {
  return `            <p style="margin: 0; font-family: Montserrat, 'Helvetica Neue', Arial, sans-serif; font-size: 15px; line-height: 1.72; color: #212121;">${inlineMarkdown(text)}</p>`;
}

function sectionTitle(text) {
  return `            <p style="margin: 0; font-family: Montserrat, 'Helvetica Neue', Arial, sans-serif; font-size: 11px; line-height: 1.45; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: #1B5E20;">${inlineMarkdown(text.replace(/:$/, ''))}</p>`;
}

function variableCard(text) {
  return `            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse; background: #FAFAF5; border-left: 5px solid #FFE600;">
              <tr>
                <td style="padding: 18px 20px;">
                  <p style="margin: 0; font-family: Montserrat, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; line-height: 1.65; color: #212121; font-weight: 700;">${inlineMarkdown(text)}</p>
                </td>
              </tr>
            </table>`;
}

function button(label, href) {
  return `            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse;">
              <tr>
                <td style="background: #1B5E20; text-align: center;">
                  <a href="${escapeHtml(href)}" style="display: block; padding: 16px 18px; font-family: Montserrat, 'Helvetica Neue', Arial, sans-serif; font-size: 12px; line-height: 1.3; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; color: #FFE600; text-decoration: none;">${escapeHtml(label)}</a>
                </td>
              </tr>
            </table>`;
}

function renderList(items) {
  const rows = items.map((item, index) => {
    const border = index === items.length - 1 ? '' : ' border-bottom: 1px solid #DCE8C8;';
    return `              <tr>
                <td width="22" style="padding: 12px 0; vertical-align: top;${border}">
                  <p style="margin: 0; font-family: Montserrat, 'Helvetica Neue', Arial, sans-serif; font-size: 17px; line-height: 1; color: #1B5E20;">&bull;</p>
                </td>
                <td style="padding: 10px 0 12px; vertical-align: top;${border}">
                  <p style="margin: 0; font-family: Montserrat, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; line-height: 1.62; color: #212121;">${inlineMarkdown(item)}</p>
                </td>
              </tr>`;
  }).join('\n');

  return `            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse; background: #FFFFFF;">
${rows}
            </table>`;
}

function renderBody(lines) {
  const html = [];
  let list = [];

  function flushList() {
    if (!list.length) return;
    html.push(row(renderList(list), '0 28px 18px'));
    list = [];
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      continue;
    }

    if (line.startsWith('- ')) {
      list.push(line.slice(2).trim());
      continue;
    }

    flushList();

    const bareVariable = line.match(/^\$\{([A-Za-z_][A-Za-z0-9_]*)\}$/);
    if (bareVariable && LINK_LABELS[bareVariable[1]]) {
      html.push(row(button(LINK_LABELS[bareVariable[1]], line), '4px 28px 22px'));
      continue;
    }

    const boldOnly = line.match(/^\*\*(.+)\*\*$/);
    if (boldOnly) {
      if (/\$\{[A-Za-z_][A-Za-z0-9_]*\}/.test(boldOnly[1])) {
        html.push(row(variableCard(boldOnly[1]), '0 28px 20px'));
      } else {
        html.push(row(`            <h2 style="margin: 0; font-family: Merriweather, Georgia, 'Times New Roman', serif; font-size: 20px; line-height: 1.35; font-weight: 700; color: #1B5E20;">${inlineMarkdown(boldOnly[1])}</h2>`, '4px 28px 14px'));
      }
      continue;
    }

    if (/^[A-Z][A-Za-z0-9 /'&.-]{2,80}:$/.test(line)) {
      html.push(row(sectionTitle(line), '10px 28px 8px'));
      continue;
    }

    html.push(row(paragraph(line)));
  }

  flushList();
  return html.join('\n');
}

function renderEmail(item, parsed) {
  const safeSubject = escapeHtml(parsed.subject);
  const safePreheader = escapeHtml(parsed.preheader);
  const safeTitle = escapeHtml(parsed.title);
  const hiddenPreheader = safePreheader ? `<div style="display: none; max-height: 0; overflow: hidden; opacity: 0; color: transparent; line-height: 1px; font-size: 1px;">${safePreheader}</div>` : '';

  return `<!--
=============================================================================
${safeTitle}
Paste-ready HTML for the Wix Triggered Email HTML block.

Source: ultimate-berlin-trip-planner/email/${item.source}
Path: ${item.path}
Stage: ${item.stage}
Velo message ID placeholder: ${item.placeholder}

Subject: ${safeSubject}
Preheader: ${safePreheader}

In Wix Developer Tools -> Triggered Emails, create/open the template and copy
everything between HTML BLOCK START and HTML BLOCK END into the HTML block.
Then copy the resulting messageId from the Wix editor URL and replace
${item.placeholder} in velo/tripPlannerFunnel.js.
=============================================================================
-->

<!-- HTML BLOCK START -->
${hiddenPreheader}
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; max-width: 640px; margin: 0 auto; background: #FAFAF5; border-collapse: collapse; table-layout: fixed;">
  <tr>
    <td style="background: #FAFAF5; padding: 22px 24px 18px; text-align: center;">
      <img src="${LOGO_URL}" alt="BerlinWalk" width="184" style="display: inline-block; width: 184px; max-width: 72%; height: auto; border: 0;">
    </td>
  </tr>

  <tr>
    <td style="padding: 0 12px 26px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #FFFFFF; border-collapse: collapse; border: 1px solid #DCE8C8;">
        <tr>
          <td style="background: #1B5E20; padding: 30px 28px 28px;">
            <p style="margin: 0 0 10px; font-family: Montserrat, 'Helvetica Neue', Arial, sans-serif; font-size: 11px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; color: #FFE600;">${escapeHtml(item.eyebrow)}</p>
            <h1 style="margin: 0 0 14px; font-family: Merriweather, Georgia, 'Times New Roman', serif; font-size: 28px; line-height: 1.18; font-weight: 700; color: #FFFFFF;">${safeSubject}</h1>
            <p style="margin: 0; font-family: Montserrat, 'Helvetica Neue', Arial, sans-serif; font-size: 15px; line-height: 1.65; color: #EAF3DE;">${safePreheader}</p>
          </td>
        </tr>

${renderBody(parsed.bodyLines)}

        <tr>
          <td style="padding: 16px 28px 34px;">
            <p style="margin: 0 0 4px; font-family: Montserrat, 'Helvetica Neue', Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #212121;">See you in Berlin,</p>
            <p style="margin: 0 0 2px; font-family: Merriweather, Georgia, 'Times New Roman', serif; font-size: 20px; line-height: 1.3; font-weight: 700; color: #1B5E20;">Yusuf</p>
            <p style="margin: 0; font-family: Montserrat, 'Helvetica Neue', Arial, sans-serif; font-size: 12px; line-height: 1.5; letter-spacing: 0.08em; text-transform: uppercase; color: #4E5A4E;">BerlinWalk</p>
          </td>
        </tr>

        <tr>
          <td style="background: #1B5E20; padding: 22px 28px; text-align: center;">
            <p style="margin: 0 0 8px; font-family: Montserrat, 'Helvetica Neue', Arial, sans-serif; font-size: 13px; line-height: 1.5; color: #FFE600;">
              <a href="${SITE_URL}" style="color: #FFE600; text-decoration: none; font-weight: 700;">berlinwalk.com</a>
              <span style="color: #7CB342;">&nbsp;|&nbsp;</span>
              <a href="${INSTAGRAM_URL}" style="color: #FFE600; text-decoration: none; font-weight: 700;">@berlinwalkingtour</a>
            </p>
            <p style="margin: 0; font-family: Montserrat, 'Helvetica Neue', Arial, sans-serif; font-size: 11px; line-height: 1.5; color: #C5E1A5;">You are receiving this because you asked for an Ultimate Berlin Trip Planner email from BerlinWalk.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
<!-- HTML BLOCK END -->
`;
}

function renderReadme(manifest) {
  const rows = manifest.map((item) => `| ${item.path} | ${item.stage} | \`${item.placeholder}\` | [${item.html}](${item.html}) | ${item.subject} |`).join('\n');
  return `# Ultimate Berlin Trip Planner Paste-Ready Triggered Emails

Generated from the markdown files one folder up.

Regenerate after copy changes:

\`\`\`bash
node ultimate-berlin-trip-planner/email/build-triggered-email-html.mjs
\`\`\`

## Wix Paste Workflow

1. Open Wix Developer Tools -> Triggered Emails and create a new Triggered Email template. Do not create an automation workflow for these ten templates; Velo sends them by message ID.
2. Copy the Wix template name from the matching card in \`copy-kit.html\` and use it as the template name in Wix.
3. Paste the subject and preheader from the same card.
4. Open the HTML/custom body editor and paste everything between \`HTML BLOCK START\` and \`HTML BLOCK END\` from the matching HTML file.
5. Save the template.
6. Put the resulting messageIds, or the Wix editor URLs containing them, into a local JSON file shaped like \`message-ids.template.json\`.
7. If the copy kit downloaded \`message-ids.local.json\` to your Downloads folder, import it into the repo:

\`\`\`bash
node ultimate-berlin-trip-planner/velo/import-message-ids-from-downloads.mjs
node ultimate-berlin-trip-planner/velo/import-message-ids-from-downloads.mjs --write
\`\`\`

8. Preferred fast path after the 10 IDs exist:

\`\`\`bash
node ultimate-berlin-trip-planner/velo/run-email-id-launch-gate.mjs --import-downloads
source ../scripts/load-api-keys.sh
node ultimate-berlin-trip-planner/velo/run-email-id-launch-gate.mjs --import-downloads --write
\`\`\`

9. Or check the local ID file manually:

\`\`\`bash
node ultimate-berlin-trip-planner/velo/check-triggered-email-ids.mjs --ids ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json
\`\`\`

10. Dry-run the replacement:

\`\`\`bash
node ultimate-berlin-trip-planner/velo/apply-triggered-email-ids.mjs --ids ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json
\`\`\`

11. If the dry run is clean, apply it:

\`\`\`bash
node ultimate-berlin-trip-planner/velo/apply-triggered-email-ids.mjs --ids ultimate-berlin-trip-planner/email/paste-ready/message-ids.local.json --write
\`\`\`

12. Run \`node ultimate-berlin-trip-planner/launch-audit.mjs\`.

Shortcut: open \`copy-kit.html\` for one-page copy buttons, Wix template names,
subject/preheader blocks, HTML blocks, a setup checklist export, setup progress
checkboxes, ID validation, a bulk URL paste box, and a message-ID JSON builder.
The same checklist is also generated as \`setup-checklist.txt\`.

## Template Map

| Path | Stage | Velo Placeholder | HTML | Subject |
| --- | --- | --- | --- | --- |
${rows}

## Notes

- HTML is table-based with inline CSS only.
- No \`<style>\`, \`<script>\`, \`<svg>\`, or external font tags are used.
- Wix variables keep the \`\${var_name}\` syntax expected by Velo Triggered Emails.
- Booked-path placeholders intentionally stay separate from sales-path placeholders so missing booked IDs skip safely instead of sending sales copy.
`;
}

function renderMessageIdsTemplate(manifest) {
  const ids = {};
  for (const item of manifest) {
    ids[item.placeholder] = `PASTE_${item.path.toUpperCase()}_${item.stage.toUpperCase()}_MESSAGE_ID_OR_EDITOR_URL_HERE`;
  }
  return JSON.stringify(ids, null, 2) + '\n';
}

function renderSetupChecklist(manifest) {
  const lines = [
    'Ultimate Berlin Trip Planner Triggered Email Setup Checklist',
    '',
    'Use Wix Developer Tools -> Triggered Emails.',
    'Do not create automation workflows for these ten templates; Velo sends them by message ID.',
    '',
    'For each item: create template -> paste name -> subject -> preheader -> HTML body -> save -> paste editor URL/message ID into copy-kit.html.',
    ''
  ];

  manifest.forEach((item, index) => {
    lines.push(
      `${index + 1}. ${wixTemplateNameFor(item)}`,
      `   Branch/stage: ${item.path}.${item.stage}`,
      `   Placeholder: ${item.placeholder}`,
      `   Subject: ${item.subject}`,
      `   Preheader: ${item.preheader || '(none)'}`,
      `   HTML file: ${item.html}`,
      '   Wix editor URL / message ID:',
      ''
    );
  });

  lines.push(
    'After all 10 URLs/IDs are collected:',
    '1. Paste them into copy-kit.html or download message-ids.local.json.',
    '2. Run: node ultimate-berlin-trip-planner/velo/run-email-id-launch-gate.mjs --import-downloads',
    '3. Then source ../scripts/load-api-keys.sh and rerun with --write.'
  );

  return `${lines.join('\n')}\n`;
}

function renderPreview(manifest) {
  const sections = manifest.map((item) => {
    const html = fs.readFileSync(path.join(outDir, item.html), 'utf8');
    return `<section style="margin: 0 0 44px;">
  <h2 style="font-family: Montserrat, Arial, sans-serif; color: #1B5E20;">${escapeHtml(item.path)} / ${escapeHtml(item.stage)} - ${escapeHtml(item.subject)}</h2>
  ${html}
</section>`;
  }).join('\n');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ultimate Berlin Trip Planner Email Preview</title>
</head>
<body style="margin: 0; padding: 28px; background: #F3F6EC;">
${sections}
</body>
</html>
`;
}

function htmlBlockFrom(source) {
  const match = source.match(/<!-- HTML BLOCK START -->([\s\S]*?)<!-- HTML BLOCK END -->/);
  return match ? match[1].trim() : source.trim();
}

function labelFor(item) {
  const branch = item.path === 'booked' ? 'Booked' : 'Sales';
  const labels = {
    instant: 'Instant',
    minus7: '7 days before',
    minus3: '3 days before',
    minus1: '1 day before',
    dayOf: 'Arrival day'
  };
  return `${branch} - ${labels[item.stage] || item.stage}`;
}

function wixTemplateNameFor(item) {
  const branch = item.path === 'booked' ? 'Booked' : 'Sales';
  const labels = {
    instant: 'Instant Plan',
    minus7: '7 Days Before',
    minus3: '3 Days Before',
    minus1: '1 Day Before',
    dayOf: 'Arrival Day'
  };
  return `Ultimate Planner - ${branch} - ${labels[item.stage] || item.stage}`;
}

function renderCopyKit(manifest) {
  const setupChecklist = renderSetupChecklist(manifest);
  const cards = manifest.map((item, index) => {
    const html = fs.readFileSync(path.join(outDir, item.html), 'utf8');
    const block = htmlBlockFrom(html);
    const templateName = wixTemplateNameFor(item);
    const templateNameId = `template-name-${index}`;
    const htmlId = `html-block-${index}`;
    const subjectId = `subject-${index}`;
    const preheaderId = `preheader-${index}`;
    const messageId = `message-id-${index}`;

    return `<article class="email-card" data-card-placeholder="${escapeHtml(item.placeholder)}" data-card-index="${index + 1}" data-template-name="${escapeHtml(templateName)}" data-placeholder="${escapeHtml(item.placeholder)}">
      <div class="card-head">
        <div>
          <span class="branch ${escapeHtml(item.path)}">${escapeHtml(item.path)}</span>
          <h2>${escapeHtml(labelFor(item))}</h2>
          <p>${escapeHtml(item.placeholder)}</p>
        </div>
        <div class="card-badges">
          <span class="state-chip" data-card-state>Not started</span>
          <span class="count">${index + 1}/10</span>
        </div>
      </div>

      <div class="field-row">
        <label for="${templateNameId}">Wix template name</label>
        <button type="button" data-copy-target="${templateNameId}">Copy name</button>
      </div>
      <input id="${templateNameId}" class="copy-input" readonly value="${escapeHtml(templateName)}">

      <div class="field-row">
        <label for="${subjectId}">Subject</label>
        <button type="button" data-copy-target="${subjectId}">Copy subject</button>
      </div>
      <textarea id="${subjectId}" readonly rows="2">${escapeHtml(item.subject)}</textarea>

      <div class="field-row">
        <label for="${preheaderId}">Preheader</label>
        <button type="button" data-copy-target="${preheaderId}">Copy preheader</button>
      </div>
      <textarea id="${preheaderId}" readonly rows="2">${escapeHtml(item.preheader)}</textarea>

      <div class="field-row">
        <label for="${htmlId}">HTML body block</label>
        <button type="button" data-copy-target="${htmlId}">Copy HTML</button>
      </div>
      <textarea id="${htmlId}" readonly rows="12">${escapeHtml(block)}</textarea>

      <label class="message-label" for="${messageId}">Paste Wix message ID or editor URL after saving</label>
      <input id="${messageId}" data-message-id="${escapeHtml(item.placeholder)}" type="text" placeholder="https://manage.wix.com/.../automations/edit/{MESSAGE_ID}/content/en">
      <div class="id-status" data-id-status="${escapeHtml(item.placeholder)}">Waiting for ID.</div>

      <div class="setup-checklist" aria-label="Setup checklist for ${escapeHtml(labelFor(item))}">
        <label><input type="checkbox" data-progress-placeholder="${escapeHtml(item.placeholder)}" data-progress-kind="created"> Template created in Wix</label>
        <label><input type="checkbox" data-progress-placeholder="${escapeHtml(item.placeholder)}" data-progress-kind="subject"> Subject and preheader pasted</label>
        <label><input type="checkbox" data-progress-placeholder="${escapeHtml(item.placeholder)}" data-progress-kind="html"> HTML block pasted</label>
        <label><input type="checkbox" data-progress-placeholder="${escapeHtml(item.placeholder)}" data-progress-kind="saved"> Template saved and URL copied</label>
      </div>
    </article>`;
  }).join('\n');

  const placeholderJson = JSON.stringify(manifest.map((item) => item.placeholder));
  const setupChecklistHtml = escapeHtml(setupChecklist);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ultimate Berlin Trip Planner Triggered Email Copy Kit</title>
  <style>
    :root {
      --green: #1B5E20;
      --yellow: #FFE600;
      --lime: #7CB342;
      --cream: #FAFAF5;
      --border: #DCE8C8;
      --text: #212121;
      --muted: #4E5A4E;
      --white: #FFFFFF;
    }

    * {
      box-sizing: border-box;
    }

    body {
      background: var(--cream);
      color: var(--text);
      font-family: Montserrat, Arial, sans-serif;
      margin: 0;
      padding: 28px;
    }

    .wrap {
      margin: 0 auto;
      max-width: 1180px;
    }

    .hero {
      background: var(--green);
      color: var(--white);
      padding: 24px;
    }

    .hero p {
      color: #DDEFC7;
      line-height: 1.55;
      margin: 8px 0 0;
      max-width: 880px;
    }

    .kicker,
    .branch,
    label,
    .message-label {
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .kicker {
      color: var(--yellow);
      display: block;
      margin-bottom: 8px;
    }

    h1,
    h2,
    p {
      margin-top: 0;
    }

    h1 {
      font-family: Merriweather, Georgia, serif;
      font-size: 34px;
      line-height: 1.12;
      margin-bottom: 0;
    }

    .grid {
      display: grid;
      gap: 16px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      margin-top: 18px;
    }

    .email-card,
    .json-panel {
      background: var(--white);
      border: 1px solid var(--border);
      padding: 18px;
    }

    .card-head {
      align-items: start;
      display: flex;
      gap: 16px;
      justify-content: space-between;
      margin-bottom: 14px;
    }

    .branch {
      color: var(--green);
      display: inline-flex;
      margin-bottom: 8px;
    }

    .branch.booked {
      color: #2F80ED;
    }

    h2 {
      color: var(--green);
      font-size: 20px;
      line-height: 1.18;
      margin-bottom: 6px;
    }

    .card-head p {
      color: var(--muted);
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 12px;
      line-height: 1.35;
      margin-bottom: 0;
      overflow-wrap: anywhere;
    }

    .card-badges {
      align-items: flex-end;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .count {
      background: var(--yellow);
      color: var(--green);
      font-size: 12px;
      font-weight: 900;
      padding: 8px 10px;
      white-space: nowrap;
    }

    .state-chip {
      background: #F0F6E8;
      color: var(--green);
      font-size: 11px;
      font-weight: 900;
      line-height: 1;
      padding: 8px 10px;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .email-card.is-complete {
      border-color: var(--lime);
      box-shadow: inset 0 0 0 2px rgba(124, 179, 66, 0.22);
    }

    .email-card.is-id-invalid input[data-message-id] {
      border-color: #E63946;
      box-shadow: inset 0 0 0 1px rgba(230, 57, 70, 0.35);
    }

    .email-card.is-id-valid input[data-message-id] {
      border-color: var(--lime);
      box-shadow: inset 0 0 0 1px rgba(124, 179, 66, 0.35);
    }

    .field-row {
      align-items: center;
      display: flex;
      gap: 10px;
      justify-content: space-between;
      margin: 12px 0 7px;
    }

    label,
    .message-label {
      color: var(--green);
      display: block;
    }

    textarea,
    input {
      border: 1px solid var(--border);
      color: var(--text);
      font: 13px/1.45 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      padding: 10px;
      resize: vertical;
      width: 100%;
    }

    textarea:focus,
    input:focus,
    button:focus {
      outline: 3px solid rgba(255, 230, 0, 0.75);
      outline-offset: 2px;
    }

    button {
      background: var(--green);
      border: 0;
      color: var(--yellow);
      cursor: pointer;
      font: 900 12px/1 Montserrat, Arial, sans-serif;
      letter-spacing: 0.04em;
      padding: 10px 12px;
      text-transform: uppercase;
    }

    button:hover {
      background: #143F17;
    }

    .message-label {
      margin: 14px 0 7px;
    }

    .id-status {
      color: var(--muted);
      font-size: 12px;
      font-weight: 800;
      line-height: 1.45;
      margin-top: 7px;
      min-height: 18px;
    }

    .id-status.is-error {
      color: #B4232F;
    }

    .id-status.is-ok {
      color: var(--green);
    }

    .setup-checklist {
      border-top: 1px solid var(--border);
      display: grid;
      gap: 8px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      margin-top: 14px;
      padding-top: 14px;
    }

    .setup-checklist label {
      align-items: flex-start;
      color: var(--text);
      display: flex;
      gap: 8px;
      letter-spacing: 0;
      line-height: 1.35;
      text-transform: none;
    }

    .setup-checklist input {
      accent-color: var(--green);
      margin-top: 1px;
      width: auto;
    }

    .json-panel {
      margin-top: 18px;
      position: sticky;
      top: 12px;
      z-index: 2;
    }

    .json-panel h2 {
      margin-bottom: 6px;
    }

    .json-panel p {
      color: var(--muted);
      font-size: 13px;
      line-height: 1.5;
      margin-bottom: 12px;
    }

    .progress-board {
      border: 1px solid var(--border);
      margin: 12px 0;
      padding: 12px;
    }

    .next-action {
      align-items: center;
      background: #F0F6E8;
      border: 1px solid var(--border);
      display: grid;
      gap: 10px;
      grid-template-columns: minmax(0, 1fr) auto;
      margin: 12px 0;
      padding: 12px;
    }

    .next-action strong,
    .next-action span {
      display: block;
      min-width: 0;
    }

    .next-action strong {
      color: var(--green);
      font-size: 13px;
      line-height: 1.35;
    }

    .next-action span {
      color: var(--muted);
      font-size: 12px;
      font-weight: 700;
      line-height: 1.45;
      margin-top: 2px;
      overflow-wrap: anywhere;
    }

    .setup-export {
      background: #FFFCE0;
      border: 1px solid #E6D45C;
      margin: 12px 0;
      padding: 12px;
    }

    .setup-export summary {
      color: var(--green);
      cursor: pointer;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .setup-export textarea {
      margin-top: 10px;
      min-height: 220px;
    }

    .bulk-panel {
      background: #F7FAEF;
      border: 1px solid var(--border);
      margin: 12px 0;
      padding: 12px;
    }

    .bulk-panel label {
      margin-bottom: 7px;
    }

    .bulk-panel textarea {
      min-height: 104px;
    }

    .bulk-help {
      color: var(--muted);
      display: block;
      font-size: 12px;
      font-weight: 800;
      line-height: 1.45;
      margin-top: 7px;
    }

    .progress-track {
      background: #E9F2DA;
      height: 10px;
      overflow: hidden;
    }

    .progress-fill {
      background: linear-gradient(90deg, var(--green), var(--lime), var(--yellow));
      height: 100%;
      transition: width 0.2s ease;
      width: 0%;
    }

    .mini-stats {
      display: grid;
      gap: 8px;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      margin-top: 10px;
    }

    .mini-stat {
      background: #F7FAEF;
      padding: 10px;
    }

    .mini-stat strong {
      color: var(--green);
      display: block;
      font-size: 20px;
      line-height: 1;
    }

    .mini-stat span {
      color: var(--muted);
      display: block;
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0.08em;
      margin-top: 6px;
      text-transform: uppercase;
    }

    .health {
      color: var(--muted);
      font-size: 12px;
      font-weight: 800;
      line-height: 1.45;
      margin-top: 10px;
    }

    .health.is-ok {
      color: var(--green);
    }

    .health.is-error {
      color: #B4232F;
    }

    .json-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 10px 0 0;
    }

    .status {
      color: var(--muted);
      font-size: 12px;
      font-weight: 800;
      margin-top: 8px;
      min-height: 18px;
    }

    @media (max-width: 860px) {
      body {
        padding: 16px;
      }

      .grid {
        grid-template-columns: 1fr;
      }

      h1 {
        font-size: 28px;
      }

      .json-panel {
        position: static;
      }

      .mini-stats,
      .setup-checklist,
      .next-action {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <main class="wrap">
    <section class="hero">
      <span class="kicker">BerlinWalk launch kit</span>
      <h1>Ultimate Berlin Trip Planner Triggered Emails</h1>
      <p>Use Wix Developer Tools -> Triggered Emails, not an automation workflow. Create the ten templates, paste each subject, preheader, and HTML body, then paste the saved editor URL or message ID back into the matching input. The JSON panel at the bottom builds the local ID file for the apply helper.</p>
    </section>

    <section class="json-panel" aria-label="Message ID builder">
      <h2>Message ID JSON</h2>
      <p>After all ten templates are saved in Wix, copy or download this JSON as <code>message-ids.local.json</code>. If it lands in Downloads, run <code>import-message-ids-from-downloads.mjs</code>, then run the apply helper from the repo root.</p>
      <div class="progress-board">
        <div class="progress-track" aria-label="Setup progress"><div class="progress-fill" data-progress-fill></div></div>
        <div class="mini-stats">
          <div class="mini-stat"><strong data-template-count>0/10</strong><span>Templates ready</span></div>
          <div class="mini-stat"><strong data-id-count>0/10</strong><span>Valid IDs</span></div>
          <div class="mini-stat"><strong data-check-count>0/40</strong><span>Checklist ticks</span></div>
        </div>
        <div class="health" data-id-health>Waiting for Wix message IDs.</div>
      </div>
      <div class="next-action" aria-label="Next template to create">
        <div>
          <strong data-next-label>Start with template 1/10.</strong>
          <span data-next-detail>Copy the Wix template name, then subject, preheader, and HTML.</span>
        </div>
        <button type="button" data-scroll-next>Next missing template</button>
      </div>
      <details class="setup-export">
        <summary>One-page setup checklist</summary>
        <textarea id="setup-checklist-text" readonly rows="10">${setupChecklistHtml}</textarea>
        <div class="json-actions">
          <button type="button" data-copy-target="setup-checklist-text">Copy checklist</button>
        </div>
      </details>
      <div class="bulk-panel" aria-label="Bulk message ID paste">
        <label for="bulk-message-ids">Bulk paste Wix URLs or IDs</label>
        <textarea id="bulk-message-ids" rows="5" placeholder="Paste 10 editor URLs in template order, or labelled lines like TODO_TRIP_PLANNER_INSTANT: https://manage.wix.com/.../automations/edit/.../content/en"></textarea>
        <span class="bulk-help">Labelled lines can be in any order. Unlabelled lines are assigned in the template order below.</span>
        <div class="json-actions">
          <button type="button" data-apply-bulk-ids>Apply bulk IDs</button>
          <button type="button" data-clear-bulk-ids>Clear bulk box</button>
        </div>
      </div>
      <textarea id="message-json" readonly rows="8">{}</textarea>
      <div class="json-actions">
        <button type="button" data-build-json>Refresh JSON</button>
        <button type="button" data-copy-target="message-json">Copy JSON</button>
        <button type="button" data-download-json>Download JSON</button>
        <button type="button" data-reset-progress>Reset saved progress</button>
      </div>
      <div class="status" data-status></div>
    </section>

    <section class="grid">
${cards}
    </section>
  </main>

  <script>
    const PLACEHOLDERS = ${placeholderJson};
    const STORAGE_KEY = 'bwUltimateTripPlannerEmailCopyKit.v1';

    function textFrom(id) {
      const element = document.getElementById(id);
      return element ? element.value : '';
    }

    async function copyText(text) {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
      }

      const scratch = document.createElement('textarea');
      scratch.value = text;
      scratch.setAttribute('readonly', '');
      scratch.style.position = 'fixed';
      scratch.style.opacity = '0';
      document.body.appendChild(scratch);
      scratch.select();
      document.execCommand('copy');
      scratch.remove();
    }

    function setStatus(message) {
      const status = document.querySelector('[data-status]');
      if (status) status.textContent = message;
    }

    function normalizeMessageId(value) {
      const raw = String(value || '').trim();
      const urlMatch = raw.match(/\\/automations\\/edit\\/([^/?#]+)\\/content(?:\\/[a-z]{2})?/i);
      if (urlMatch) return decodeURIComponent(urlMatch[1]).trim();
      return raw;
    }

    function validateMessageId(id) {
      if (!id) return 'missing';
      if (/TODO|PASTE|REPLACE|MESSAGE_ID|YOUR-/i.test(id)) return 'still looks like a placeholder';
      if (/\\s/.test(id)) return 'contains whitespace';
      if (/[<>{}'"]/.test(id)) return 'contains unsafe punctuation';
      if (id.length < 6 || id.length > 120) return 'unexpected length';
      return '';
    }

    function readState() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {};
      } catch (error) {
        return {};
      }
    }

    function writeState() {
      const state = { ids: {}, checks: {} };
      const bulk = document.getElementById('bulk-message-ids');
      state.bulk = bulk ? bulk.value : '';
      for (const placeholder of PLACEHOLDERS) {
        const input = document.querySelector('[data-message-id="' + placeholder + '"]');
        state.ids[placeholder] = input ? input.value : '';
        state.checks[placeholder] = {};
        document.querySelectorAll('[data-progress-placeholder="' + placeholder + '"]').forEach(function (checkbox) {
          state.checks[placeholder][checkbox.getAttribute('data-progress-kind')] = checkbox.checked;
        });
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        // Local files can be opened in restricted browser contexts. Progress is still usable in-session.
      }
    }

    function restoreState() {
      const state = readState();
      const bulk = document.getElementById('bulk-message-ids');
      if (bulk && typeof state.bulk === 'string') bulk.value = state.bulk;
      for (const placeholder of PLACEHOLDERS) {
        const input = document.querySelector('[data-message-id="' + placeholder + '"]');
        if (input && state.ids && Object.prototype.hasOwnProperty.call(state.ids, placeholder)) {
          input.value = state.ids[placeholder] || '';
        }
        const checks = state.checks && state.checks[placeholder] ? state.checks[placeholder] : {};
        document.querySelectorAll('[data-progress-placeholder="' + placeholder + '"]').forEach(function (checkbox) {
          const kind = checkbox.getAttribute('data-progress-kind');
          checkbox.checked = Boolean(checks[kind]);
        });
      }
    }

    function stripTrailingPunctuation(value) {
      return String(value || '').replace(/[),.;]+$/g, '').trim();
    }

    function extractBulkValue(line) {
      const url = line.match(/https?:\\/\\/\\S+/i);
      if (url) return stripTrailingPunctuation(url[0]);

      const editorPath = line.match(/\\/automations\\/edit\\/\\S+/i);
      if (editorPath) return stripTrailingPunctuation(editorPath[0]);

      const afterPlaceholder = line
        .replace(/TODO_TRIP_PLANNER_[A-Z0-9_]+/g, '')
        .replace(/^[\\s:=\\-]+/, '')
        .trim();
      const cleaned = afterPlaceholder
        .replace(/^\\s*[-*]?\\s*\\d+[.)-]?\\s*/, '')
        .replace(/^[A-Za-z][A-Za-z0-9 /._-]{2,60}:\\s*/, '')
        .trim();
      return stripTrailingPunctuation(cleaned);
    }

    function parseBulkIds(raw) {
      const ids = {};
      const labelled = [];
      const sequential = [];
      const lines = String(raw || '')
        .replace(/\\r\\n/g, '\\n')
        .split('\\n')
        .map(function (line) { return line.trim(); })
        .filter(function (line) { return line && line.charAt(0) !== '#'; });

      lines.forEach(function (line) {
        const placeholder = PLACEHOLDERS.find(function (candidate) {
          return line.indexOf(candidate) !== -1;
        });
        const value = extractBulkValue(line);
        if (!value) return;
        if (placeholder) {
          ids[placeholder] = value;
          labelled.push(placeholder);
        } else {
          sequential.push(value);
        }
      });

      let index = 0;
      PLACEHOLDERS.forEach(function (placeholder) {
        if (Object.prototype.hasOwnProperty.call(ids, placeholder)) return;
        if (index < sequential.length) {
          ids[placeholder] = sequential[index];
          index += 1;
        }
      });

      return {
        ids: ids,
        lineCount: lines.length,
        labelled: labelled,
        sequentialUsed: index,
        extraSequential: sequential.slice(index)
      };
    }

    function applyBulkIds() {
      const bulk = document.getElementById('bulk-message-ids');
      const parsed = parseBulkIds(bulk ? bulk.value : '');
      let applied = 0;

      PLACEHOLDERS.forEach(function (placeholder) {
        if (!Object.prototype.hasOwnProperty.call(parsed.ids, placeholder)) return;
        const input = document.querySelector('[data-message-id="' + placeholder + '"]');
        if (!input) return;
        input.value = parsed.ids[placeholder] || '';
        applied += input.value ? 1 : 0;
      });

      buildJson();
      if (parsed.extraSequential.length) {
        setStatus('Applied ' + applied + ' bulk ID(s). ' + parsed.extraSequential.length + ' extra pasted value(s) were ignored.');
      } else if (applied) {
        setStatus('Applied ' + applied + ' bulk ID(s) from ' + parsed.lineCount + ' pasted line(s).');
      } else {
        setStatus('No usable Wix URLs or message IDs found in the bulk box.');
      }
    }

    function inspectRows() {
      const rows = PLACEHOLDERS.map(function (placeholder) {
        const input = document.querySelector('[data-message-id="' + placeholder + '"]');
        const raw = input ? input.value.trim() : '';
        const id = normalizeMessageId(raw);
        return {
          placeholder: placeholder,
          input: input,
          raw: raw,
          id: id,
          reason: validateMessageId(id),
          duplicate: ''
        };
      });

      const byId = {};
      rows.forEach(function (row) {
        if (row.reason || !row.id) return;
        byId[row.id] = byId[row.id] || [];
        byId[row.id].push(row.placeholder);
      });

      rows.forEach(function (row) {
        if (row.reason || !row.id || !byId[row.id] || byId[row.id].length < 2) return;
        row.duplicate = 'duplicate ID shared by ' + byId[row.id].join(', ');
      });

      return rows;
    }

    function checkedCountFor(placeholder) {
      return Array.from(document.querySelectorAll('[data-progress-placeholder="' + placeholder + '"]')).filter(function (checkbox) {
        return checkbox.checked;
      }).length;
    }

    function updateCards(rows) {
      rows.forEach(function (row) {
        const card = document.querySelector('[data-card-placeholder="' + row.placeholder + '"]');
        const status = document.querySelector('[data-id-status="' + row.placeholder + '"]');
        const checked = checkedCountFor(row.placeholder);
        const idOk = !row.reason && !row.duplicate;
        const complete = checked === 4 && idOk;

        if (card) {
          card.classList.toggle('is-complete', complete);
          card.classList.toggle('is-id-valid', idOk);
          card.classList.toggle('is-id-invalid', Boolean(row.raw && !idOk));
          const chip = card.querySelector('[data-card-state]');
          if (chip) {
            if (complete) chip.textContent = 'Ready';
            else if (idOk) chip.textContent = 'ID ok';
            else chip.textContent = checked + '/4 done';
          }
        }

        if (status) {
          status.classList.toggle('is-ok', idOk);
          status.classList.toggle('is-error', Boolean(row.raw && !idOk));
          if (!row.raw) status.textContent = 'Waiting for ID.';
          else if (row.duplicate) status.textContent = row.duplicate;
          else if (row.reason) status.textContent = row.reason;
          else if (row.raw !== row.id) status.textContent = 'URL detected. JSON will use message ID: ' + row.id;
          else status.textContent = 'Valid message ID.';
        }
      });
    }

    function updateSummary(rows) {
      const validIds = rows.filter(function (row) { return !row.reason && !row.duplicate; }).length;
      const cards = Array.from(document.querySelectorAll('[data-card-placeholder]'));
      const completeCards = cards.filter(function (card) { return card.classList.contains('is-complete'); }).length;
      const nextCard = cards.find(function (card) { return !card.classList.contains('is-complete'); });
      const checked = Array.from(document.querySelectorAll('[data-progress-kind]')).filter(function (checkbox) { return checkbox.checked; }).length;
      const issueRows = rows.filter(function (row) { return row.raw && (row.reason || row.duplicate); });
      const fill = document.querySelector('[data-progress-fill]');
      const templateCount = document.querySelector('[data-template-count]');
      const idCount = document.querySelector('[data-id-count]');
      const checkCount = document.querySelector('[data-check-count]');
      const health = document.querySelector('[data-id-health]');
      const nextLabel = document.querySelector('[data-next-label]');
      const nextDetail = document.querySelector('[data-next-detail]');
      const progress = Math.round(((checked + validIds) / (PLACEHOLDERS.length * 5)) * 100);

      if (fill) fill.style.width = progress + '%';
      if (templateCount) templateCount.textContent = completeCards + '/10';
      if (idCount) idCount.textContent = validIds + '/10';
      if (checkCount) checkCount.textContent = checked + '/40';
      if (nextLabel && nextDetail) {
        if (nextCard) {
          const index = nextCard.getAttribute('data-card-index') || '?';
          const name = nextCard.getAttribute('data-template-name') || 'Next template';
          nextLabel.textContent = 'Next: template ' + index + '/10';
          nextDetail.textContent = name;
        } else {
          nextLabel.textContent = 'All ten templates are ready.';
          nextDetail.textContent = 'Download message-ids.local.json and run the launch gate.';
        }
      }
      if (health) {
        health.classList.toggle('is-ok', validIds === PLACEHOLDERS.length && issueRows.length === 0);
        health.classList.toggle('is-error', issueRows.length > 0);
        if (validIds === PLACEHOLDERS.length && issueRows.length === 0) {
          health.textContent = 'All ten IDs are valid. Download message-ids.local.json and run the checker.';
        } else if (issueRows.length) {
          health.textContent = issueRows.length + ' ID issue(s): ' + issueRows.map(function (row) { return row.placeholder; }).join(', ');
        } else {
          health.textContent = (PLACEHOLDERS.length - validIds) + ' message ID(s) still missing.';
        }
      }
    }

    function buildJson() {
      const payload = {};
      const rows = inspectRows();
      const missing = [];

      rows.forEach(function (row) {
        payload[row.placeholder] = row.id || row.raw;
        if (!row.raw) missing.push(row.placeholder);
      });

      const target = document.getElementById('message-json');
      if (target) target.value = JSON.stringify(payload, null, 2);
      updateCards(rows);
      updateSummary(rows);
      writeState();
      setStatus(missing.length ? missing.length + ' message IDs still empty.' : 'All ten message ID slots are filled.');
      return payload;
    }

    function scrollToNextCard() {
      buildJson();
      const cards = Array.from(document.querySelectorAll('[data-card-placeholder]'));
      const nextCard = cards.find(function (card) { return !card.classList.contains('is-complete'); }) || cards[0];
      if (!nextCard) return;
      nextCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const copyName = nextCard.querySelector('[data-copy-target^="template-name-"]');
      if (copyName) copyName.focus();
      setStatus('Moved to ' + (nextCard.getAttribute('data-template-name') || 'the next template') + '.');
    }

    document.addEventListener('click', async function (event) {
      const copyButton = event.target.closest('[data-copy-target]');
      if (copyButton) {
        const targetId = copyButton.getAttribute('data-copy-target');
        await copyText(textFrom(targetId));
        setStatus('Copied ' + targetId + '.');
        return;
      }

      if (event.target.closest('[data-scroll-next]')) {
        scrollToNextCard();
        return;
      }

      if (event.target.closest('[data-build-json]')) {
        buildJson();
        return;
      }

      if (event.target.closest('[data-download-json]')) {
        const payload = buildJson();
        const blob = new Blob([JSON.stringify(payload, null, 2) + '\\n'], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'message-ids.local.json';
        link.click();
        URL.revokeObjectURL(url);
        setStatus('Downloaded message-ids.local.json. Next terminal step: node ultimate-berlin-trip-planner/velo/run-email-id-launch-gate.mjs --import-downloads');
        return;
      }

      if (event.target.closest('[data-apply-bulk-ids]')) {
        applyBulkIds();
        return;
      }

      if (event.target.closest('[data-clear-bulk-ids]')) {
        const bulk = document.getElementById('bulk-message-ids');
        if (bulk) bulk.value = '';
        buildJson();
        setStatus('Bulk box cleared. Message ID fields were not changed.');
        return;
      }

      if (event.target.closest('[data-reset-progress]')) {
        document.querySelectorAll('[data-message-id]').forEach(function (input) { input.value = ''; });
        document.querySelectorAll('[data-progress-kind]').forEach(function (checkbox) { checkbox.checked = false; });
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
          // Ignore restricted localStorage contexts.
        }
        buildJson();
        setStatus('Progress reset.');
      }
    });

    document.addEventListener('input', function (event) {
      if (event.target.matches('[data-message-id]') || event.target.id === 'bulk-message-ids') buildJson();
    });

    document.addEventListener('change', function (event) {
      if (event.target.matches('[data-progress-kind]')) buildJson();
    });

    restoreState();
    buildJson();
  </script>
</body>
</html>
`;
}

function main() {
  fs.mkdirSync(outDir, { recursive: true });

  const manifest = EMAILS.map((item) => {
    const parsed = parseMarkdown(item.source);
    const html = renderEmail(item, parsed);
    fs.writeFileSync(path.join(outDir, item.output), html);
    return {
      source: item.source,
      html: item.output,
      path: item.path,
      stage: item.stage,
      placeholder: item.placeholder,
      subject: parsed.subject,
      preheader: parsed.preheader,
      variables: parsed.variables
    };
  });

  fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  fs.writeFileSync(path.join(outDir, 'message-ids.template.json'), renderMessageIdsTemplate(manifest));
  fs.writeFileSync(path.join(outDir, 'setup-checklist.txt'), renderSetupChecklist(manifest));
  fs.writeFileSync(path.join(outDir, 'README.md'), renderReadme(manifest));
  fs.writeFileSync(path.join(outDir, 'preview.html'), renderPreview(manifest));
  fs.writeFileSync(path.join(outDir, 'copy-kit.html'), renderCopyKit(manifest));

  console.log(`Generated ${manifest.length} paste-ready emails in ${path.relative(process.cwd(), outDir)}`);
}

main();
