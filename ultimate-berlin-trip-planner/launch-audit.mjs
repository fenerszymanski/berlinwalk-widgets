#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const widgetRoot = scriptDir;
const checks = [];

function rel(filePath) {
  return path.relative(repoRoot, filePath).replaceAll(path.sep, '/');
}

function filePath(relativePath) {
  return path.join(repoRoot, relativePath);
}

function exists(relativePath) {
  return fs.existsSync(filePath(relativePath));
}

function read(relativePath) {
  return fs.readFileSync(filePath(relativePath), 'utf8');
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function add(status, label, detail = '') {
  checks.push({ status, label, detail });
}

function pass(label, detail = '') {
  add('PASS', label, detail);
}

function warn(label, ok, detail = '') {
  add(ok ? 'PASS' : 'WARN', label, ok ? '' : detail);
}

function block(label, ok, detail = '') {
  add(ok ? 'PASS' : 'BLOCK', label, ok ? '' : detail);
}

function unique(values) {
  return [...new Set(values)].sort();
}

function findUltimateTool(toolsHub) {
  const tools = Array.isArray(toolsHub) ? toolsHub : toolsHub.tools || [];
  return tools.find((tool) => tool && tool.slug === 'ultimate-berlin-trip-planner');
}

function metadataValue(markdown, label) {
  const pattern = new RegExp(`^${label}:\\s*(.+)$`, 'mi');
  const match = markdown.match(pattern);
  return match ? match[1].trim() : '';
}

function extractEmailVariableKeys(veloSource) {
  const start = veloSource.indexOf('function emailVariables');
  if (start === -1) return new Set();
  const returnStart = veloSource.indexOf('return {', start);
  if (returnStart === -1) return new Set();
  const returnEnd = veloSource.indexOf('\n  };', returnStart);
  if (returnEnd === -1) return new Set();
  const body = veloSource.slice(returnStart, returnEnd);
  return new Set([...body.matchAll(/^\s*([A-Za-z_][A-Za-z0-9_]*):/gm)].map((match) => match[1]));
}

function extractTemplateVariables(markdown) {
  return unique([...markdown.matchAll(/\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g)].map((match) => match[1]));
}

function emailTemplateFiles() {
  const emailDir = path.join(widgetRoot, 'email');
  return fs.readdirSync(emailDir)
    .filter((name) => /^e[0-9]-.*\.md$/.test(name))
    .sort()
    .map((name) => path.join('ultimate-berlin-trip-planner/email', name));
}

function liveSmokeEvidence() {
  const smokeDir = filePath('output/qa/ultimate-trip-planner-live-smoke');
  if (!fs.existsSync(smokeDir)) return null;

  const candidates = fs.readdirSync(smokeDir)
    .filter((name) => /^live-.*\.json$/.test(name))
    .sort()
    .reverse();

  for (const candidate of candidates) {
    const absolute = path.join(smokeDir, candidate);
    try {
      const result = JSON.parse(fs.readFileSync(absolute, 'utf8'));
      const leadOk = result && result.mode === 'live' && result.responses && result.responses.lead && result.responses.lead.ok === true;
      const bookingOk = !result.bookingPayload || (result.responses && result.responses.booking && result.responses.booking.ok === true);
      if (leadOk && bookingOk) return rel(absolute);
    } catch (error) {
      // Keep scanning older smoke files.
    }
  }

  return null;
}

function run() {
  const requiredFiles = [
    'ultimate-berlin-trip-planner/index.html',
    'ultimate-berlin-trip-planner/build-launch-control-room.mjs',
    'ultimate-berlin-trip-planner/LAUNCH_CONTROL_ROOM.html',
    'ultimate-berlin-trip-planner/build-launch-status-report.mjs',
    'ultimate-berlin-trip-planner/LAUNCH_STATUS.md',
    'ultimate-berlin-trip-planner/LAUNCH_STATUS.json',
    'ultimate-berlin-trip-planner/WIX_EMAIL_SETUP_TR.md',
    'ultimate-berlin-trip-planner/TRIGGERED_EMAIL_API_NOTES.md',
    'ultimate-berlin-trip-planner/release-visibility.mjs',
    'ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js',
    'ultimate-berlin-trip-planner/velo/http-functions.js',
    'ultimate-berlin-trip-planner/velo/import-message-ids-from-downloads.mjs',
    'ultimate-berlin-trip-planner/velo/build-message-ids-from-paste.mjs',
    'ultimate-berlin-trip-planner/velo/run-email-id-launch-gate.mjs',
    'ultimate-berlin-trip-planner/velo/check-triggered-email-ids.mjs',
    'ultimate-berlin-trip-planner/velo/apply-triggered-email-ids.mjs',
    'ultimate-berlin-trip-planner/velo/live-smoke-trip-planner.mjs',
    'ultimate-berlin-trip-planner/velo/simulate-email-sequence.mjs',
    'ultimate-berlin-trip-planner/velo/report-trip-planner-leads.mjs',
    'ultimate-berlin-trip-planner/velo/booking-aware-fixture.mjs',
    'ultimate-berlin-trip-planner/velo/create-trip-planner-leads-collection.mjs',
    'ultimate-berlin-trip-planner/velo/prepublish-gate.mjs',
    'ultimate-berlin-trip-planner/velo/build-velo-install-kit.mjs',
    'ultimate-berlin-trip-planner/velo/install-kit.html',
    'ultimate-berlin-trip-planner/velo/jobs.config',
    'ultimate-berlin-trip-planner/velo/README.md',
    'ultimate-berlin-trip-planner/email/README.md',
    'ultimate-berlin-trip-planner/email/build-triggered-email-html.mjs',
    'ultimate-berlin-trip-planner/email/paste-ready/manifest.json',
    'ultimate-berlin-trip-planner/email/paste-ready/message-ids.template.json',
    'ultimate-berlin-trip-planner/email/paste-ready/setup-checklist.txt',
    'ultimate-berlin-trip-planner/email/paste-ready/README.md',
    'ultimate-berlin-trip-planner/email/paste-ready/copy-kit.html',
    'ultimate-berlin-trip-planner/LAUNCH_RUNBOOK.md',
    'ultimate-berlin-trip-planner/launch-remote-preflight.mjs',
    'tools-hub/data.json',
    'tools-home/data.json',
    'tools-home/tools-home-element.js',
    'tools-home/icons/manifest.json',
    'widgets-hub/index.html',
    'widgets-hub/widgets-hub-element.js',
    'quick-summary/data.json',
    'faq/data.json',
    'faq/inject.js',
    'blog-drafts/ultimate-berlin-trip-planner.md',
    'blog-drafts/ultimate-berlin-trip-planner.body.md',
    '../insert-ultimate-berlin-trip-planner.js'
  ];

  for (const requiredFile of requiredFiles) {
    block(`Required file exists: ${requiredFile}`, exists(requiredFile), 'Missing launch artifact.');
  }

  const indexHtml = read('ultimate-berlin-trip-planner/index.html');
  const launchStatusMd = read('ultimate-berlin-trip-planner/LAUNCH_STATUS.md');
  const launchStatusJson = readJson('ultimate-berlin-trip-planner/LAUNCH_STATUS.json');
  const wixEmailSetupTr = read('ultimate-berlin-trip-planner/WIX_EMAIL_SETUP_TR.md');
  const triggeredEmailApiNotes = read('ultimate-berlin-trip-planner/TRIGGERED_EMAIL_API_NOTES.md');
  const visibilityRelease = read('ultimate-berlin-trip-planner/release-visibility.mjs');
  const idImportSource = read('ultimate-berlin-trip-planner/velo/import-message-ids-from-downloads.mjs');
  const messageIdPasteBuilder = read('ultimate-berlin-trip-planner/velo/build-message-ids-from-paste.mjs');
  const emailIdLaunchGateSource = read('ultimate-berlin-trip-planner/velo/run-email-id-launch-gate.mjs');
  const idCheckSource = read('ultimate-berlin-trip-planner/velo/check-triggered-email-ids.mjs');
  const idApplySource = read('ultimate-berlin-trip-planner/velo/apply-triggered-email-ids.mjs');
  const funnel = read('ultimate-berlin-trip-planner/velo/tripPlannerFunnel.js');
  const httpFunctions = read('ultimate-berlin-trip-planner/velo/http-functions.js');
  const bookingAwareFixture = read('ultimate-berlin-trip-planner/velo/booking-aware-fixture.mjs');
  const sequenceSimulatorSource = read('ultimate-berlin-trip-planner/velo/simulate-email-sequence.mjs');
  const leadReportSource = read('ultimate-berlin-trip-planner/velo/report-trip-planner-leads.mjs');
  const jobsConfig = read('ultimate-berlin-trip-planner/velo/jobs.config');
  const veloReadme = read('ultimate-berlin-trip-planner/velo/README.md');
  const emailReadme = read('ultimate-berlin-trip-planner/email/README.md');
  const launchRunbook = read('ultimate-berlin-trip-planner/LAUNCH_RUNBOOK.md');
  const launchControlRoom = read('ultimate-berlin-trip-planner/LAUNCH_CONTROL_ROOM.html');
  const collectionScript = read('ultimate-berlin-trip-planner/velo/create-trip-planner-leads-collection.mjs');
  const prepublishGate = read('ultimate-berlin-trip-planner/velo/prepublish-gate.mjs');
  const remotePreflightSource = read('ultimate-berlin-trip-planner/launch-remote-preflight.mjs');
  const launchStatusBuilder = read('ultimate-berlin-trip-planner/build-launch-status-report.mjs');
  const launchControlBuilder = read('ultimate-berlin-trip-planner/build-launch-control-room.mjs');
  const copyKit = read('ultimate-berlin-trip-planner/email/paste-ready/copy-kit.html');
  const setupChecklist = read('ultimate-berlin-trip-planner/email/paste-ready/setup-checklist.txt');
  const veloInstallKit = read('ultimate-berlin-trip-planner/velo/install-kit.html');
  const pasteReadyManifest = readJson('ultimate-berlin-trip-planner/email/paste-ready/manifest.json');
  const toolsHub = readJson('tools-hub/data.json');
  const toolsHome = readJson('tools-home/data.json');
  const toolsHomeElement = read('tools-home/tools-home-element.js');
  const toolsHomeIconManifest = readJson('tools-home/icons/manifest.json');
  const widgetsHubStatic = read('widgets-hub/index.html');
  const widgetsHubElement = read('widgets-hub/widgets-hub-element.js');
  const toolsHubElement = read('tools-hub/tools-hub-element.js');
  const quickSummary = readJson('quick-summary/data.json');
  const faqData = readJson('faq/data.json');
  const faqInject = read('faq/inject.js');
  const blogDraft = read('blog-drafts/ultimate-berlin-trip-planner.md');
  const blogBody = read('blog-drafts/ultimate-berlin-trip-planner.body.md');
  const cmsInsertSource = read('../insert-ultimate-berlin-trip-planner.js');
  const allEmailTemplateText = emailTemplateFiles().map((template) => read(template)).join('\n\n');
  const iconManifestRows = Array.isArray(toolsHomeIconManifest) ? toolsHomeIconManifest : [];
  const closingBlockObjects = [...indexHtml.matchAll(/\{\s*time:\s*'(?:Later|Evening)'[\s\S]*?\}/g)].map((match) => match[0]);
  const closingBlocksWithCopy = closingBlockObjects.filter((snippet) => !/copy:\s*''/.test(snippet));
  const firstDayBlocksSource = indexHtml.slice(indexHtml.indexOf('function firstDayBlocks'), indexHtml.indexOf('function dayTemplate'));
  const dayTemplateSource = indexHtml.slice(indexHtml.indexOf('function dayTemplate'), indexHtml.indexOf('function dayKeys'));
  const dayClosePlanSource = indexHtml.slice(indexHtml.indexOf('function dayClosePlan'), indexHtml.indexOf('function dayCloseHtml'));
  const firstDayBlockCopies = [...firstDayBlocksSource.matchAll(/'([^']{20,})'/g)]
    .map((match) => match[1])
    .filter((copy) => /^[A-Z]/.test(copy) && !/^Get central|^Use the tour|^Dinner/.test(copy));
  const dayTemplateCopies = [...dayTemplateSource.matchAll(/copy:\s*'([^']*)'/g)]
    .map((match) => match[1])
    .filter(Boolean);
  const longDayCopies = [...firstDayBlockCopies, ...dayTemplateCopies]
    .filter((copy) => copy.length > 90);

  const todos = unique([...funnel.matchAll(/TODO_TRIP_PLANNER_[A-Z0-9_]+/g)].map((match) => match[0]));
  block(
    'Triggered Email message IDs are pasted',
    todos.length === 0,
    todos.length ? `${todos.length} placeholder IDs remain: ${todos.join(', ')}` : 'No TODO_TRIP_PLANNER placeholders found.'
  );

  const expectedTemplates = [
    'ultimate-berlin-trip-planner/email/e0-instant-plan.md',
    'ultimate-berlin-trip-planner/email/e1-seven-days-before.md',
    'ultimate-berlin-trip-planner/email/e2-three-days-before.md',
    'ultimate-berlin-trip-planner/email/e3-one-day-before.md',
    'ultimate-berlin-trip-planner/email/e4-arrival-day.md'
  ];
  const missingTemplates = expectedTemplates.filter((template) => !exists(template));
  block(
    'All 5 planner email template drafts exist',
    missingTemplates.length === 0,
    missingTemplates.length ? `Missing: ${missingTemplates.join(', ')}` : 'Sales/nurture path has five drafts; booked guests stay in the existing booking sequence.'
  );

  const templateVars = unique(emailTemplateFiles().flatMap((template) => extractTemplateVariables(read(template))));
  const veloVars = extractEmailVariableKeys(funnel);
  const unknownVars = templateVars.filter((variable) => !veloVars.has(variable));
  block(
    'Email template variables are exposed by Velo',
    unknownVars.length === 0,
    unknownVars.length ? `Missing Velo variables: ${unknownVars.join(', ')}` : `${templateVars.length} template variables covered.`
  );

  const criticalVars = [
    'planHealth',
    'preArrivalChecklist',
    'baseBrief',
    'budgetPulse',
    'interestLens',
    'paceGuard',
    'weatherStrategy',
    'carryPack',
    'reservationRadar',
    'dayRhythm',
    'dayIntelligence',
    'dayOperations',
    'conversionSignal',
    'conversionScore',
    'conversionTier',
    'conversionNextAction',
    'conversionReasons',
    'tripStyle',
    'bookingUrl',
    'meetingPointUrl'
  ];
  const missingCriticalVars = criticalVars.filter((variable) => !veloVars.has(variable));
  block(
    'Critical plan/email variables are present',
    missingCriticalVars.length === 0,
    missingCriticalVars.length ? `Missing: ${missingCriticalVars.join(', ')}` : `${criticalVars.length} critical variables present.`
  );

  const pasteReadyFiles = Array.isArray(pasteReadyManifest) ? pasteReadyManifest : [];
  const missingPasteReady = pasteReadyFiles
    .map((item) => item && item.html)
    .filter(Boolean)
    .filter((htmlFile) => !exists(`ultimate-berlin-trip-planner/email/paste-ready/${htmlFile}`));
  const pasteReadyHtml = pasteReadyFiles
    .map((item) => item && item.html)
    .filter(Boolean)
    .map((htmlFile) => ({
      htmlFile,
      source: read(`ultimate-berlin-trip-planner/email/paste-ready/${htmlFile}`)
    }));
  const htmlWithForbiddenTags = pasteReadyHtml
    .filter((item) => /<style|<script|<svg|<link/i.test(item.source))
    .map((item) => item.htmlFile);
  const htmlWithoutMarkers = pasteReadyHtml
    .filter((item) => item.source.indexOf('HTML BLOCK START') === -1 || item.source.indexOf('HTML BLOCK END') === -1)
    .map((item) => item.htmlFile);
  const manifestPlaceholders = unique(pasteReadyFiles.map((item) => item && item.placeholder).filter(Boolean));
  const expectedPlaceholders = unique([
    'TODO_TRIP_PLANNER_INSTANT',
    'TODO_TRIP_PLANNER_MINUS_7',
    'TODO_TRIP_PLANNER_MINUS_3',
    'TODO_TRIP_PLANNER_MINUS_1',
    'TODO_TRIP_PLANNER_DAY_OF'
  ]);
  block(
    'Paste-ready Wix email HTML package exists',
    pasteReadyFiles.length === 5 && missingPasteReady.length === 0,
    missingPasteReady.length ? `Missing HTML files: ${missingPasteReady.join(', ')}` : `Manifest has ${pasteReadyFiles.length} templates.`
  );
  block(
    'Paste-ready email HTML is Wix-safe',
    htmlWithForbiddenTags.length === 0 && htmlWithoutMarkers.length === 0,
    [
      htmlWithForbiddenTags.length ? `Forbidden tags: ${htmlWithForbiddenTags.join(', ')}` : '',
      htmlWithoutMarkers.length ? `Missing block markers: ${htmlWithoutMarkers.join(', ')}` : ''
    ].filter(Boolean).join(' ')
  );
  block(
    'Paste-ready placeholders match Velo TODO IDs',
    manifestPlaceholders.length === expectedPlaceholders.length &&
      manifestPlaceholders.every((placeholder) => expectedPlaceholders.indexOf(placeholder) !== -1),
    `Manifest placeholders: ${manifestPlaceholders.join(', ')}`
  );
  const missingCopyKitPlaceholders = expectedPlaceholders.filter((placeholder) => copyKit.indexOf(placeholder) === -1);
  block(
    'Triggered Email copy kit is generated',
    /data-copy-target/.test(copyKit) &&
      /data-message-id/.test(copyKit) &&
      /data-progress-placeholder/.test(copyKit) &&
      /data-id-health/.test(copyKit) &&
      /localStorage/.test(copyKit) &&
      /normalizeMessageId/.test(copyKit) &&
      /data-apply-bulk-ids/.test(copyKit) &&
      /parseBulkIds/.test(copyKit) &&
      /duplicate ID/.test(copyKit) &&
      /message-ids\.local\.json/.test(copyKit) &&
      /HTML body block/.test(copyKit) &&
      /Developer Tools -> Triggered Emails/.test(copyKit) &&
      /not an automation workflow/.test(copyKit) &&
      /Wix template name/.test(copyKit) &&
      /data-scroll-next/.test(copyKit) &&
      /Next missing template/.test(copyKit) &&
      /setup-checklist-text/.test(copyKit) &&
      /Copy checklist/.test(copyKit) &&
      /Ultimate Planner - Sales - Instant Plan/.test(setupChecklist) &&
      /Do not create automation workflows/.test(setupChecklist) &&
      /existing booking email sequence/.test(setupChecklist) &&
      !/TODO_TRIP_PLANNER_[A-Z0-9_]+_BOOKED/.test(copyKit) &&
      missingCopyKitPlaceholders.length === 0,
    missingCopyKitPlaceholders.length ? `Missing placeholders: ${missingCopyKitPlaceholders.join(', ')}` : 'copy-kit.html covers all template placeholders.'
  );
  block(
    'Launch runbook covers manual Wix handoff',
    /Triggered Email/.test(launchRunbook) &&
      /LAUNCH_CONTROL_ROOM\.html/.test(launchRunbook) &&
      /LAUNCH_STATUS\.md/.test(launchRunbook) &&
      /WIX_EMAIL_SETUP_TR\.md/.test(launchRunbook) &&
      /TRIGGERED_EMAIL_API_NOTES\.md/.test(launchRunbook) &&
      /build-launch-status-report\.mjs/.test(launchRunbook) &&
      /message-ids\.local\.json/.test(launchRunbook) &&
      /build-message-ids-from-paste\.mjs/.test(launchRunbook) &&
      /check-triggered-email-ids\.mjs/.test(launchRunbook) &&
      /apply-triggered-email-ids\.mjs/.test(launchRunbook) &&
      /TripPlannerLeads/.test(launchRunbook) &&
      /install-kit\.html/.test(launchRunbook) &&
      /build-velo-install-kit\.mjs/.test(launchRunbook) &&
      /launch-remote-preflight\.mjs/.test(launchRunbook) &&
      /live-smoke-trip-planner\.mjs/.test(launchRunbook) &&
      /release-visibility\.mjs/.test(launchRunbook) &&
      /insert-ultimate-berlin-trip-planner\.js/.test(launchRunbook) &&
      /status: "draft"/.test(launchRunbook),
    'Runbook should cover Triggered Emails, Velo install, live smoke, CMS insert, and draft visibility.'
  );
  block(
    'Launch control room is generated',
      /Launch Control Room/.test(launchControlRoom) &&
      /LAUNCH_STATUS\.md/.test(launchControlRoom) &&
      /WIX_EMAIL_SETUP_TR\.md/.test(launchControlRoom) &&
      /TRIGGERED_EMAIL_API_NOTES\.md/.test(launchControlRoom) &&
      /email\/paste-ready\/copy-kit\.html/.test(launchControlRoom) &&
      /velo\/install-kit\.html/.test(launchControlRoom) &&
      /build-message-ids-from-paste\.mjs/.test(launchControlRoom) &&
      /check-triggered-email-ids\.mjs/.test(launchControlRoom) &&
      /apply-triggered-email-ids\.mjs/.test(launchControlRoom) &&
      /live-smoke-trip-planner\.mjs/.test(launchControlRoom) &&
      /release-visibility\.mjs/.test(launchControlRoom) &&
      /insert-ultimate-berlin-trip-planner\.js/.test(launchControlRoom) &&
      /status-card/.test(launchControlRoom) &&
      /data-copy-target/.test(launchControlRoom),
    'LAUNCH_CONTROL_ROOM.html should link the email kit, Velo kit, message-ID helper, smoke helper, CMS helper, status cards, and copy buttons.'
  );
  block(
    'Turkish Wix email setup handoff exists',
      /Wix Email Kurulumu/.test(wixEmailSetupTr) &&
      /copy-kit\.html/.test(wixEmailSetupTr) &&
      /message-ids\.local\.json/.test(wixEmailSetupTr) &&
      /Developer Tools -> Triggered Emails/.test(wixEmailSetupTr) &&
      /Automation\/workflow olusturma/.test(wixEmailSetupTr) &&
      /build-message-ids-from-paste\.mjs/.test(wixEmailSetupTr) &&
      /check-triggered-email-ids\.mjs/.test(wixEmailSetupTr) &&
      /apply-triggered-email-ids\.mjs/.test(wixEmailSetupTr) &&
      expectedPlaceholders.every((placeholder) => wixEmailSetupTr.indexOf(placeholder) !== -1),
    'WIX_EMAIL_SETUP_TR.md should explain the manual Wix email flow and cover all 10 placeholders.'
  );
  block(
    'Triggered Email API research note exists',
    /Triggered Email API Notes/.test(triggeredEmailApiNotes) &&
      /emailContact/.test(triggeredEmailApiNotes) &&
      /Automations V2/.test(triggeredEmailApiNotes) &&
      /template creation remains/.test(triggeredEmailApiNotes) &&
      /copy-kit\.html/.test(triggeredEmailApiNotes),
    'TRIGGERED_EMAIL_API_NOTES.md should document why the 10 template creation step remains manual.'
  );
  block(
    'Triggered Email downloaded JSON import helper exists',
    /import-message-ids-from-downloads/.test(idImportSource) &&
      /Downloads/.test(idImportSource) &&
      /--write/.test(idImportSource) &&
      /message-ids\.local\.json/.test(idImportSource) &&
      /duplicate ID/.test(idImportSource) &&
      /automations\/edit/.test(idImportSource) &&
      /ultimate-trip-planner-message-id-import/.test(idImportSource),
    'import-message-ids-from-downloads.mjs should dry-run and safely import the copy-kit download from ~/Downloads.'
  );
  block(
    'Triggered Email raw paste builder exists',
    /build-message-ids-from-paste/.test(messageIdPasteBuilder) &&
      /--from/.test(messageIdPasteBuilder) &&
      /--write/.test(messageIdPasteBuilder) &&
      /message-ids\.local\.json/.test(messageIdPasteBuilder) &&
      /duplicate ID/.test(messageIdPasteBuilder) &&
      /automations\/edit/.test(messageIdPasteBuilder),
    'build-message-ids-from-paste.mjs should build message-ids.local.json from 10 pasted Wix editor URLs in dry-run-first mode.'
  );
  block(
    'Triggered Email ID progress checker exists',
      /check-triggered-email-ids/.test(idCheckSource) &&
      /--require-applied/.test(idCheckSource) &&
      /--funnel/.test(idCheckSource) &&
      /--json/.test(idCheckSource) &&
      /message-ids\.local\.json/.test(idCheckSource) &&
      /duplicate ID/.test(idCheckSource) &&
      /automations\/edit/.test(idCheckSource),
    'check-triggered-email-ids.mjs should validate missing, placeholder, duplicate, URL-shaped, and applied IDs without writing files.'
  );
  block(
    'Triggered Email launch gate runner exists',
    /run-email-id-launch-gate/.test(emailIdLaunchGateSource) &&
      /--import-downloads/.test(emailIdLaunchGateSource) &&
      /--downloads-dir/.test(emailIdLaunchGateSource) &&
      /--import-from/.test(emailIdLaunchGateSource) &&
      /check-triggered-email-ids/.test(emailIdLaunchGateSource) &&
      /apply-triggered-email-ids/.test(emailIdLaunchGateSource) &&
      /prepublish-gate/.test(emailIdLaunchGateSource) &&
      /build-velo-install-kit/.test(emailIdLaunchGateSource) &&
      /build-launch-status-report/.test(emailIdLaunchGateSource) &&
      /launch-audit/.test(emailIdLaunchGateSource) &&
      /ultimate-trip-planner-email-id-gate/.test(emailIdLaunchGateSource),
    'run-email-id-launch-gate.mjs should collapse the post-ID validate/apply/regenerate/prepublish/audit sequence into one dry-run-first command.'
  );
  block(
    'Triggered Email ID apply helper writes a local backup',
    /apply-triggered-email-ids/.test(idApplySource) &&
      /defaultBackupDir/.test(idApplySource) &&
      /ultimate-trip-planner-email-id-apply/.test(idApplySource) &&
      /--no-backup/.test(idApplySource) &&
      /--funnel/.test(idApplySource) &&
      /fs\.writeFileSync\(backupPath/.test(idApplySource),
    'apply-triggered-email-ids.mjs should keep write mode recoverable with an output/qa backup and a QA funnel override.'
  );
  block(
    'Launch status report is generated',
    /Verdict:/.test(launchStatusMd) &&
      /Launch audit:/.test(launchStatusMd) &&
      /Triggered Email IDs/.test(launchStatusMd) &&
      /TripPlannerLeads collection/.test(launchStatusMd) &&
      /(Missing critical fields|critical fields verified)/.test(launchStatusMd) &&
      /Velo endpoints/.test(launchStatusMd) &&
      /Live lead\/booking smoke/.test(launchStatusMd) &&
      /Public visibility/.test(launchStatusMd) &&
      /Next Actions/.test(launchStatusMd) &&
      launchStatusJson &&
      Array.isArray(launchStatusJson.gates) &&
      launchStatusJson.gates.length >= 8 &&
      launchStatusJson.preflight &&
      launchStatusJson.visibility,
    'LAUNCH_STATUS.md/json should summarize gates, audit, preflight, visibility, smoke evidence, and next actions.'
  );
  block(
    'Launch status checks collection schema',
    /CRITICAL_COLLECTION_FIELDS/.test(remotePreflightSource) &&
      /conversionSignal/.test(remotePreflightSource) &&
      /conversionScore/.test(remotePreflightSource) &&
      /conversionTier/.test(remotePreflightSource) &&
      /conversionNextAction/.test(remotePreflightSource) &&
      /conversionReasons/.test(remotePreflightSource) &&
      /tripStyle/.test(remotePreflightSource) &&
      /missingCriticalFields/.test(remotePreflightSource) &&
      /schemaOk/.test(remotePreflightSource) &&
      /Missing critical fields/.test(launchStatusBuilder) &&
      /critical fields/.test(launchControlBuilder),
    'Remote preflight/status should fail the data gate when a new critical lead field is missing from TripPlannerLeads.'
  );
  block(
    'Visibility release helper is guarded',
    /Dry-run by default/.test(visibilityRelease) &&
      /--write/.test(visibilityRelease) &&
      /--include-home/.test(visibilityRelease) &&
      /--regenerate-widgets-seo/.test(visibilityRelease) &&
      /DEFAULT_BACKUP_DIR/.test(visibilityRelease) &&
      /ultimate-trip-planner-visibility-release/.test(visibilityRelease) &&
      /--no-backup/.test(visibilityRelease) &&
      /--tools-hub/.test(visibilityRelease) &&
      /--tools-home/.test(visibilityRelease) &&
      /TODO_TRIP_PLANNER/.test(visibilityRelease) &&
      /liveSmokeEvidence/.test(visibilityRelease) &&
      /liveToolPageStatus\s*===\s*200/.test(visibilityRelease) &&
      /delete next\.status/.test(visibilityRelease) &&
      /tools-home\/data\.json/.test(visibilityRelease),
    'release-visibility.mjs should dry-run by default, back up writes, and refuse writes until IDs, live smoke, and live tool page gates pass.'
  );
  block(
    'Velo install kit is generated',
    /Backend\/tripPlannerFunnel\.js/.test(veloInstallKit) &&
      /Backend\/http-functions\.js/.test(veloInstallKit) &&
      /jobs\.config/.test(veloInstallKit) &&
      /data-copy-target/.test(veloInstallKit) &&
      /Pre-publish gate/.test(veloInstallKit) &&
      /check-triggered-email-ids\.mjs/.test(veloInstallKit) &&
      /apply-triggered-email-ids\.mjs/.test(veloInstallKit) &&
      /prepublish-gate\.mjs/.test(veloInstallKit) &&
      /processTripPlannerDueEmails/.test(veloInstallKit) &&
      /tripPlannerLead/.test(veloInstallKit) &&
      /tripPlannerBooking/.test(veloInstallKit),
    'install-kit.html should include copyable pre-publish gates, Velo source panels, endpoint handlers, and the scheduled job.'
  );
  block(
    'Velo pre-publish gate is available',
    /readyForVeloPaste/.test(prepublishGate) &&
      /message-ids\.local\.json/.test(prepublishGate) &&
      /CRITICAL_COLLECTION_FIELDS/.test(prepublishGate) &&
      /tripStyle/.test(prepublishGate) &&
      /TripPlannerLeads critical fields pass remote gate/.test(prepublishGate) &&
      /TODO_TRIP_PLANNER/.test(prepublishGate),
    'Expected a one-command gate that refuses Velo paste until IDs are applied and the live collection schema passes.'
  );

  block(
    'Velo lead endpoint exports are present',
    /export\s+async\s+function\s+post_tripPlannerLead/.test(httpFunctions) &&
      /export\s+function\s+options_tripPlannerLead/.test(httpFunctions),
    'Expected post/options handlers for /_functions/tripPlannerLead.'
  );
  block(
    'Lead report summarizes funnel segments',
    /COLLECTION_ID\s*=\s*'TripPlannerLeads'/.test(leadReportSource) &&
      /dry_run_fixture/.test(leadReportSource) &&
      /--live/.test(leadReportSource) &&
      /--include-emails/.test(leadReportSource) &&
      /emailHash/.test(leadReportSource) &&
      /byConversionTier/.test(leadReportSource) &&
      /byTripStyle/.test(leadReportSource) &&
      /priorityLeads/.test(leadReportSource) &&
      /upcomingArrivals/.test(leadReportSource) &&
      /sendErrors/.test(leadReportSource) &&
      /report-trip-planner-leads\.mjs/.test(veloReadme) &&
      /cmd-lead-report/.test(launchControlBuilder),
    'Expected a dry-run-first, privacy-aware lead report for launch/post-launch conversion operations.'
  );
  block(
    'Email sequence simulator covers scheduler branches',
    /dry_run_email_sequence_simulator/.test(sequenceSimulatorSource) &&
      /folded_into_instant/.test(sequenceSimulatorSource) &&
      /scheduled_before_18/.test(sequenceSimulatorSource) &&
      /window_already_passed/.test(sequenceSimulatorSource) &&
      /--job-date/.test(sequenceSimulatorSource) &&
      /--booked/.test(sequenceSimulatorSource) &&
      /dueNow/.test(sequenceSimulatorSource) &&
      /booked_suppressed_existing_sequence/.test(sequenceSimulatorSource) &&
      /suppressed_after_booking/.test(sequenceSimulatorSource) &&
      /sales_conversion/.test(sequenceSimulatorSource) &&
      /simulate-email-sequence\.mjs/.test(veloReadme) &&
      /cmd-sequence/.test(launchControlBuilder),
    'Expected dry-run simulator for 7/3/1/day-of email schedule and booked-lead suppression.'
  );
  block(
    'Velo booking endpoint exports are present',
    /export\s+async\s+function\s+post_tripPlannerBooking/.test(httpFunctions) &&
      /export\s+function\s+options_tripPlannerBooking/.test(httpFunctions),
    'Expected post/options handlers for /_functions/tripPlannerBooking.'
  );
  block(
    'TripPlannerLeads collection is wired/documented',
    /const\s+COLLECTION\s*=\s*'TripPlannerLeads'/.test(funnel) && /TripPlannerLeads/.test(veloReadme),
    'Collection ID must match Wix Data collection setup.'
  );
  block(
    'TripPlannerLeads setup helper exists',
    /COLLECTION_ID\s*=\s*'TripPlannerLeads'/.test(collectionScript) &&
      /permissions:\s*\{[\s\S]*insert:\s*'ADMIN'[\s\S]*read:\s*'ADMIN'/.test(collectionScript) &&
      /\['conversionSignal',\s*'Conversion Signal',\s*'TEXT'\]/.test(collectionScript) &&
      /\['conversionScore',\s*'Conversion Score',\s*'NUMBER'\]/.test(collectionScript) &&
      /\['conversionTier',\s*'Conversion Tier',\s*'TEXT'\]/.test(collectionScript) &&
      /\['conversionNextAction',\s*'Conversion Next Action',\s*'TEXT'\]/.test(collectionScript) &&
      /\['conversionReasons',\s*'Conversion Reasons',\s*'TEXT'\]/.test(collectionScript) &&
      /verifyCollection/.test(collectionScript) &&
      /patchCollectionField/.test(collectionScript) &&
      /\/patch-field/.test(collectionScript) &&
      /createCollectionField/.test(collectionScript) &&
      /\/create-field/.test(collectionScript) &&
      /--sync-fields/.test(collectionScript) &&
      /--live/.test(collectionScript) &&
      /create-trip-planner-leads-collection\.mjs/.test(launchRunbook),
    'Expected a dry-run-first collection setup helper with admin-only permissions, schema verification, and missing-field sync.'
  );
  block(
    'Hourly scheduled processor is configured',
    /processTripPlannerDueEmails/.test(jobsConfig) && /"cronExpression"\s*:\s*"0 \* \* \* \*"/.test(jobsConfig),
    'jobs.config should run processTripPlannerDueEmails hourly.'
  );
  block(
    'Booked leads suppress Ultimate reminders',
    /shouldSuppressUltimateReminder/.test(funnel) &&
      /booked_existing_sequence/.test(funnel) &&
      !/bookedMessageId/.test(funnel),
    'Existing Wix booking sequence should own booked-guest prep after booking.'
  );
  block(
    'Inactive booking statuses can re-enter pre-booking reminders',
    /cancelled/.test(funnel) && /refunded/.test(funnel) && /no-show/.test(funnel),
    'Expected cancelled/refunded/no-show handling in isBookedLead().'
  );
  block(
    'Booking-aware email behavior has a local fixture',
    /sales-minus3-id/.test(bookingAwareFixture) &&
      /bookedSuppressed/.test(bookingAwareFixture) &&
      /self-reported booked leads suppress/.test(bookingAwareFixture) &&
      /cancelled/.test(bookingAwareFixture) &&
      /markTripPlannerLeadBooked/.test(bookingAwareFixture) &&
      /ultimate-trip-planner-velo/.test(bookingAwareFixture) &&
      /booking-aware-fixture\.mjs/.test(veloReadme),
    'Expected a local Wix mock fixture that proves booked suppression, cancelled-status sales eligibility, self-reported booked suppression, and arrivalDate-scoped booking markers.'
  );

  const ultimateTool = findUltimateTool(toolsHub);
  block('Ultimate entry exists in tools-hub data', Boolean(ultimateTool), 'tools-hub/data.json needs the draft tool row.');
  if (ultimateTool) {
    const status = String(ultimateTool.status || '').toLowerCase();
    block(
      'Draft protection is active in tools-hub data',
      status === 'draft' || ultimateTool.published === false || ultimateTool.hidden === true,
      `Current status=${ultimateTool.status || '(none)'}, published=${String(ultimateTool.published)}.`
    );
    block(
      'Ultimate widgetUrl points to GitHub Pages folder',
      /^https:\/\/fenerszymanski\.github\.io\/berlinwalk-widgets\/ultimate-berlin-trip-planner\/$/.test(ultimateTool.widgetUrl || ''),
      `widgetUrl=${ultimateTool.widgetUrl || '(missing)'}`
    );
  }

  const homeTools = Array.isArray(toolsHome.featuredTools) ? toolsHome.featuredTools : [];
  const homePlannerIconSlugs = ['berlin-first-day-planner', 'hackescher-after-tour-planner'];
  const homePlannerIconRows = homePlannerIconSlugs.map((slug) => iconManifestRows.find((row) => row && row.slug === slug));
  const homePlannerTools = homePlannerIconSlugs.map((slug) => homeTools.find((tool) => tool && tool.slug === slug));
  block(
    'Homepage tool shortcuts do not include Ultimate while draft',
    !homeTools.some((tool) => tool && tool.slug === 'ultimate-berlin-trip-planner'),
    'Move Ultimate into tools-home/data.json only after launch.'
  );
  block(
    'Homepage tools renderer filters draft tools',
    /status\s*!==\s*'draft'/.test(toolsHomeElement) &&
      /published\s*!==\s*false/.test(toolsHomeElement) &&
      /hidden\s*!==\s*true/.test(toolsHomeElement) &&
      /\.slice\(0,\s*8\)/.test(toolsHomeElement),
    'tools-home/tools-home-element.js should hide status:draft, hidden:true, and published:false before taking the first 8 cards.'
  );
  block(
    'Homepage planner icons are launch-ready',
    homePlannerIconRows.every((row) => row && row.model === 'gemini-2.5-flash-image') &&
      exists('tools-home/icons/berlin-first-day-planner-160.png') &&
      exists('tools-home/icons/hackescher-after-tour-planner-160.png') &&
      homePlannerTools.every((tool) => tool && /^https:\/\/fenerszymanski\.github\.io\/berlinwalk-widgets\/tools-home\/icons\/.+-160\.png$/.test(tool.image || '')),
    'Berlin First-Day and Hackescher homepage shortcuts should use generated local 160px icons, not letter placeholders.'
  );
  block(
    'Ultimate icon is prepared but not homepage-visible before launch',
    exists('tools-home/icons/ultimate-berlin-trip-planner-160.png') &&
      ultimateTool &&
      /ultimate-berlin-trip-planner-160\.png$/.test(ultimateTool.image || '') &&
      !homeTools.some((tool) => tool && tool.slug === 'ultimate-berlin-trip-planner'),
    'Keep the Ultimate icon ready in tools-hub, but do not expose the homepage shortcut until launch.'
  );
  block(
    'Tools hub Custom Element filters draft tools',
    /status\s*!==\s*'draft'/.test(toolsHubElement) && /published\s*!==\s*false/.test(toolsHubElement),
    'tools-hub/tools-hub-element.js should hide status:draft and published:false.'
  );
  block(
    'Widgets hub Custom Element filters draft tools',
    /status\s*!==\s*'draft'/.test(widgetsHubElement) && /published\s*!==\s*false/.test(widgetsHubElement),
    'widgets-hub/widgets-hub-element.js should hide status:draft and published:false.'
  );
  block(
    'Static widgets hub SEO does not expose draft Ultimate',
    !/Ultimate Berlin Trip Planner|ultimate-berlin-trip-planner/.test(widgetsHubStatic),
    'Regenerate widgets hub SEO after changing public/draft status.'
  );

  block(
    'Local lead-gate QA params are localhost-only',
    /localHost\s*&&\s*params\.get\('forceLeadError'\)\s*===\s*'1'/.test(indexHtml) &&
      /localHost\s*&&\s*params\.get\('qaUnlock'\)\s*===\s*'1'/.test(indexHtml) &&
      /localHost\s*\|\|\s*params\.get\('resetUnlock'\)\s*!==\s*'1'/.test(indexHtml),
    'forceLeadError/qaUnlock/resetUnlock must not work on live domains.'
  );
  block(
    'PDF itinerary overview exists',
    /function\s+drawItineraryOverviewPage/.test(indexHtml) && /ITINERARY OVERVIEW/.test(indexHtml),
    'Expected the dedicated PDF overview page.'
  );
  block(
    'Day-end closers stay short and separate',
    closingBlockObjects.length >= 8 &&
      closingBlocksWithCopy.length === 0 &&
      /function\s+dayBlockCopy/.test(indexHtml) &&
      /isDayClosingBlock\(day,\s*block,\s*index\)\s*\?\s*''\s*:\s*String\(block\.copy/.test(indexHtml) &&
      /function\s+dayActionBlockItems/.test(indexHtml) &&
      /function\s+dayClosePlan/.test(indexHtml) &&
      /var\s+closeMeta/.test(dayClosePlanSource) &&
      /arrival:\s*\{\s*label:\s*'Arrival'/.test(dayClosePlanSource) &&
      /wall:\s*\{\s*label:\s*'East'/.test(dayClosePlanSource) &&
      /function\s+personalizedCloseChip/.test(indexHtml) &&
      /function\s+dayCloseChips/.test(indexHtml) &&
      /chips:\s*dayCloseChips\(day,\s*type\)/.test(dayClosePlanSource) &&
      /Family pause|Slow finish|Dry exit|Hours checked/.test(indexHtml) &&
      !/Covered backup|Protected break|Water \+ ticket|Save tomorrow|Book only if special|Energy for tomorrow|Backup bar|Cafe reset/.test(dayClosePlanSource) &&
      /function\s+dayCloseHtml/.test(indexHtml) &&
      /function\s+routeReelHtml[\s\S]*dayActionBlockItems\(day\)\.slice\(0,\s*3\)/.test(indexHtml) &&
      /function\s+drawDayCard[\s\S]*var\s+actionBlocks\s*=\s*dayActionBlockItems\(day\)/.test(indexHtml) &&
      /var\s+closeH\s*=\s*closePlan\s*\?\s*Math\.max\(68,\s*46\s*\+\s*measurePillRow\(closeLabels/.test(indexHtml) &&
      /function\s+printDayCloseHtml/.test(indexHtml) &&
      !/shortDayNote|bw-day-check|Local cue/.test(indexHtml),
    closingBlocksWithCopy.length
      ? `${closingBlocksWithCopy.length} closing blocks still have copy.`
      : 'Later/Evening blocks should become visual close strips, not repeated prose or route-reel duplicates.'
  );
  block(
    'Day-card prose stays compact',
    dayTemplateCopies.length >= 14 &&
      firstDayBlockCopies.length >= 7 &&
      longDayCopies.length === 0,
    longDayCopies.length
      ? `Day-card copy over 90 characters: ${longDayCopies.map((copy) => `"${copy}"`).join(', ')}`
      : 'Daily plan copy should read as short actions, not paragraph notes.'
  );
  block(
    'Daily Google Maps pack is visual',
    /function\s+dayMapPackItems/.test(indexHtml) &&
      /function\s+dayMapPackHtml/.test(indexHtml) &&
      /function\s+printDayMapPackHtml/.test(indexHtml) &&
      /bw-day-map-pack/.test(indexHtml) &&
      /Google Maps pack/.test(indexHtml) &&
      /Route plus the real places this day uses/.test(indexHtml) &&
      /dayMapPackHtml\(day\)/.test(indexHtml) &&
      /dayMapPackItems\(day\)\.forEach/.test(indexHtml) &&
      /function\s+drawPdfMapPack/.test(indexHtml) &&
      /function\s+drawDayCard[\s\S]*var\s+mapPack\s*=\s*dayMapPackItems\(day\)/.test(indexHtml) &&
      /drawPdfMapPack\(mapPack,\s*day,\s*mapPackH,\s*accent\)/.test(indexHtml) &&
      /Google Maps route:/.test(indexHtml) &&
      !/Place:\s*'\s*\+\s*link\.label/.test(indexHtml),
    'Each unlocked day should show a compact map-card pack in UI/print/PDF/text instead of a plain stack of location links.'
  );
  block(
    'Daily timebox timeline is visible',
    /function\s+dayBlockWindow/.test(indexHtml) &&
      /function\s+dayBlockTimeHtml/.test(indexHtml) &&
      /bw-block-time-main/.test(indexHtml) &&
      /<b>Timing<\/b>/.test(indexHtml) &&
      /dayBlockWindow\(day,\s*block,\s*index\)/.test(indexHtml) &&
      /09:30-12:00/.test(indexHtml) &&
      /Next 11:30/.test(indexHtml),
    'Expected itinerary blocks, preview chips, print/PDF/text export to expose deterministic time windows.'
  );
  block(
    'Trip calendar export is available',
    /function\s+tripCalendarText/.test(indexHtml) &&
      /function\s+tripCalendarHref/.test(indexHtml) &&
      /DTSTART;VALUE=DATE/.test(indexHtml) &&
      /Day route:/.test(indexHtml) &&
      /Trip calendar/.test(indexHtml) &&
      /data-trip-calendar/.test(indexHtml) &&
      /bw_trip_planner_trip_calendar_click/.test(indexHtml) &&
      /item\.url\.indexOf\('data:'\)\s*!==\s*0/.test(indexHtml),
    'Expected a phone-ready .ics export for the full day-by-day plan without dumping data URLs into text export.'
  );
  block(
    'PDF Carry Pack handles trip calendar rows',
    /function\s+drawPdfCarryPack[\s\S]*var columns = items\.length > 4 \? 3 : 4/.test(indexHtml) &&
      /var rows = Math\.max\(1,\s*Math\.ceil\(items\.length \/ columns\)\)/.test(indexHtml) &&
      /var safeUrl = item\.url && item\.url\.indexOf\('data:'\) !== 0 \? item\.url : ''/.test(indexHtml) &&
      /item\.download[\s\S]*doc\.splitTextToSize\(item\.download/.test(indexHtml),
    'Expected PDF Carry Pack to wrap 5 actions into multiple rows and avoid embedding calendar data URLs as PDF links.'
  );
  block(
    'PDF cover has a document guide',
    /function\s+drawPdfDocumentKit/.test(indexHtml) &&
      /Inside this plan/.test(indexHtml) &&
      /Trip snapshot/.test(indexHtml) &&
      /Overview page/.test(indexHtml) &&
      /Daily cards/.test(indexHtml) &&
      /Essentials/.test(indexHtml) &&
      /drawPdfDocumentKit\(\);[\s\S]*drawPdfPhotoStrip\(\);/.test(indexHtml),
    'Expected the PDF cover to introduce the document structure before the photo/radar/pass sections.'
  );
  block(
    'Visual itinerary overview is visible before the detailed plan',
    /data-itinerary-overview/.test(indexHtml) &&
      /function\s+itineraryOverviewHtml/.test(indexHtml) &&
      /bw-itinerary-grid/.test(indexHtml) &&
      /dayPhotoForType/.test(indexHtml) &&
      /Overview map/.test(indexHtml),
    'Expected a photo-led day index between the Trip Pass and detailed route deck.'
  );
  block(
    'Trip load map summarizes daily intensity visually',
    /data-trip-load-map/.test(indexHtml) &&
      /function\s+tripLoadMapItems/.test(indexHtml) &&
      /function\s+tripLoadMapHtml/.test(indexHtml) &&
      /function\s+tripLoadMapSummary/.test(indexHtml) &&
      /Trip load map/.test(indexHtml) &&
      /Energy, movement, buffer, and watch-outs/.test(indexHtml) &&
      /bw-load-grid/.test(indexHtml) &&
      /renderTripLoadMap\(plan\)/.test(indexHtml) &&
      /tripLoadMapSummary\(plan\)/.test(indexHtml) &&
      /loadMapPrintHtml/.test(indexHtml) &&
      /function\s+drawPdfTripLoadMap/.test(indexHtml) &&
      /drawPdfTripLoadMap\(\);[\s\S]*drawPdfCarryPack\(\);/.test(indexHtml),
    'Expected a compact daily load/intensity map to reach UI, text export, print, and PDF.'
  );
  block(
    'Planner logic shows how inputs shape the itinerary',
    /data-planner-logic/.test(indexHtml) &&
      /function\s+plannerLogicItems/.test(indexHtml) &&
      /function\s+plannerLogicHtml/.test(indexHtml) &&
      /function\s+plannerLogicSummary/.test(indexHtml) &&
      /Planner logic/.test(indexHtml) &&
      /The rules this Berlin plan used from your inputs/.test(indexHtml) &&
      /Arrival rule/.test(indexHtml) &&
      /Tour rule/.test(indexHtml) &&
      /Risk rule/.test(indexHtml) &&
      /bw-logic-grid/.test(indexHtml) &&
      /renderPlannerLogic\(plan\)/.test(indexHtml) &&
      /plannerLogicSummary\(plan\)/.test(indexHtml) &&
      /logicPrintHtml/.test(indexHtml) &&
      /function\s+drawPdfPlannerLogic/.test(indexHtml) &&
      /drawPdfPlannerLogic\(\);[\s\S]*drawPdfCarryPack\(\);/.test(indexHtml),
    'Expected a compact personalization receipt to reach UI, text export, print, and PDF.'
  );
  block(
    'Top header uses a real Berlin visual hero',
    /data-hero-visual/.test(indexHtml) &&
      /bw-head-media/.test(indexHtml) &&
      /hero-home-museum-island-1200w\.jpg/.test(indexHtml) &&
      /Museum Island and Berlin Cathedral in Berlin/.test(indexHtml) &&
      /bw-head-route/.test(indexHtml) &&
      /Route-first itinerary/.test(indexHtml) &&
      /Google Maps links/.test(indexHtml) &&
      /Weather aware/.test(indexHtml) &&
      /Print-ready export/.test(indexHtml),
    'Expected the first viewport to show a real Berlin photo, route cue, and planner feature chips instead of a plain text header.'
  );
  block(
    'Trip style presets reduce form friction',
    /data-trip-presets/.test(indexHtml) &&
      /var\s+TRIP_PRESETS\s*=\s*\[/.test(indexHtml) &&
      /Classic first trip/.test(indexHtml) &&
      /History \+ museums/.test(indexHtml) &&
      /Family \/ slower pace/.test(indexHtml) &&
      /Food \+ nightlife/.test(indexHtml) &&
      /function\s+renderTripPresets/.test(indexHtml) &&
      /function\s+applyTripPreset/.test(indexHtml) &&
      /data-trip-preset/.test(indexHtml) &&
      /syncInputsFromState\(\);[\s\S]*renderPlan\(\);/.test(indexHtml),
    'Expected a visual one-click trip-style shortcut layer that updates multiple planning inputs while keeping detailed controls editable.'
  );
  block(
    'Trip style preset reaches lead segmentation',
    /function\s+tripStyleForLead/.test(indexHtml) &&
      /tripStyle:\s*tripStyleForLead\(\)/.test(indexHtml) &&
      /tripStyle:\s*cleanText\(payload\.tripStyle,\s*'Custom mix'\)/.test(funnel) &&
      /tripStyle:\s*String\(lead\.tripStyle/.test(funnel) &&
      /tripStyle:\s*lead\.tripStyle/.test(funnel) &&
      /\['tripStyle',\s*'Trip Style',\s*'TEXT'\]/.test(collectionScript) &&
      /\$\{tripStyle\}/.test(allEmailTemplateText) &&
      /\$\{tripStyle\}/.test(emailReadme) &&
      /\$\{tripStyle\}/.test(veloReadme),
    'Expected the selected visual trip-style shortcut to move into the lead payload, Wix Data setup, Velo email variables, and instant email copy.'
  );
  block(
    'Mobile first screen has a visual plan peek',
    /data-mobile-peek/.test(indexHtml) &&
      /bw-mobile-peek-card/.test(indexHtml) &&
      /function\s+renderMobilePeek/.test(indexHtml) &&
      /Phone-ready preview/.test(indexHtml) &&
      /renderMobilePeek\(plan\)/.test(indexHtml) &&
      /@media \(max-width: 880px\)[\s\S]*\.bw-mobile-peek[\s\S]*display: grid/.test(indexHtml),
    'Expected mobile users to see a compact photo/map/score preview before the input form without reordering the full result panel.'
  );
  block(
    'Arrival playbook turns first-day logic into a visual operations card',
    /data-arrival-playbook/.test(indexHtml) &&
      /function\s+arrivalPlaybookItems/.test(indexHtml) &&
      /function\s+arrivalPlaybookHtml/.test(indexHtml) &&
      /function\s+renderArrivalPlaybook/.test(indexHtml) &&
      /Arrival playbook/.test(indexHtml) &&
      /Ticket, first move, tour anchor, and first close/.test(indexHtml) &&
      /arrivalPlaybookSummary\(plan\)/.test(indexHtml) &&
      /arrivalPlaybookPrintHtml/.test(indexHtml) &&
      /function\s+drawPdfArrivalPlaybook/.test(indexHtml) &&
      /drawPdfArrivalPlaybook\(\);[\s\S]*drawPdfTripHighlights\(\);/.test(indexHtml),
    'Expected the arrival-specific setup layer to reach UI, text, print, and PDF.'
  );
  block(
    'Trip highlights add a photo-first result layer',
    /data-trip-highlights/.test(indexHtml) &&
      /function\s+tripHighlightItems/.test(indexHtml) &&
      /function\s+tripHighlightsHtml/.test(indexHtml) &&
      /function\s+renderTripHighlights/.test(indexHtml) &&
      /Trip highlights/.test(indexHtml) &&
      /Photo route/.test(indexHtml) &&
      /Start point, BerlinWalk anchor, and final route/.test(indexHtml) &&
      /bw-highlight-grid/.test(indexHtml) &&
      /dayPhotoForType\(type\)/.test(indexHtml) &&
      /renderTripHighlights\(plan\)/.test(indexHtml),
    'Expected a visual Start/Tour/Finish layer above the itinerary overview.'
  );
  block(
    'Trip highlights reach text, print, and PDF exports',
    /Trip highlights[\s\S]*tripHighlightItems\(plan\)\.forEach/.test(indexHtml) &&
      /tripHighlightsPrintHtml/.test(indexHtml) &&
      /function\s+drawPdfTripHighlights/.test(indexHtml) &&
      /drawPdfTripHighlights\(\);/.test(indexHtml),
    'Expected the Start/Tour/Finish visual layer beyond the screen UI.'
  );
  block(
    'Trip radar gives a visual plan health summary',
    /data-trip-radar/.test(indexHtml) &&
      /function\s+tripRadarHtml/.test(indexHtml) &&
      /Trip radar/.test(indexHtml) &&
      /Plan score/.test(indexHtml) &&
      /Tour anchor/.test(indexHtml) &&
      /Opening watch/.test(indexHtml) &&
      /Next move/.test(indexHtml) &&
      /renderTripRadar\(plan\)/.test(indexHtml),
    'Expected a compact score/tour/openings/next-action panel before the Trip Pass.'
  );
  block(
    'Trip radar reaches text, print, and PDF exports',
    /function\s+tripRadarSummary/.test(indexHtml) &&
      /Trip radar[\s\S]*tripRadarSummary\(plan\)/.test(indexHtml) &&
      /tripRadarPrintHtml/.test(indexHtml) &&
      /function\s+drawPdfTripRadar/.test(indexHtml) &&
      /drawPdfTripRadar\(\)/.test(indexHtml),
    'Expected the new score/action panel to appear beyond the screen UI.'
  );
  block(
    'Trip command strip gives immediate map and action anchors',
    /data-trip-command-strip/.test(indexHtml) &&
      /function\s+tripCommandData/.test(indexHtml) &&
      /function\s+tripCommandStripHtml/.test(indexHtml) &&
      /Trip commands/.test(indexHtml) &&
      /Route map/.test(indexHtml) &&
      /Day 1 start/.test(indexHtml) &&
      /Weather\/open/.test(indexHtml) &&
      /renderTripCommandStrip\(plan\)/.test(indexHtml) &&
      /tripCommandSummary\(plan\)/.test(indexHtml) &&
      /commandPrintHtml/.test(indexHtml) &&
      /function\s+drawPdfTripCommands/.test(indexHtml) &&
      /drawPdfTripCommands\(\);[\s\S]*drawPdfTripRadar\(\);/.test(indexHtml),
    'Expected the visual command strip to carry map, Day 1, tour, and opening/weather actions into UI, text, print, and PDF.'
  );
  block(
    'Travel Mode feels like a phone-ready assistant',
    /data-travel-mode-assistant/.test(indexHtml) &&
      /bw-mode-phone/.test(indexHtml) &&
      /bw-mode-photo/.test(indexHtml) &&
      /bw-mode-stop-rail/.test(indexHtml) &&
      /bw-mode-quick-actions/.test(indexHtml) &&
      /mode\.stops/.test(indexHtml) &&
      /Route anchors/.test(indexHtml) &&
      /drawPillRow\(mode\.stops/.test(indexHtml) &&
      /modeStopsHtml/.test(indexHtml),
    'Near-arrival Travel Mode should show a phone card with photo, route anchors, quick actions, and carry into text/print/PDF outputs.'
  );
  block(
    'Lead gate explains the arrival email sequence visually',
    /bw-reminder-flow/.test(indexHtml) &&
      /Arrival reminder timeline/.test(indexHtml) &&
      /data-reminder-rail/.test(indexHtml) &&
      /function\s+arrivalReminderTimeline/.test(indexHtml) &&
      /function\s+renderArrivalReminderTimeline/.test(indexHtml) &&
      /formatReminderDate/.test(indexHtml) &&
      /Window passed/.test(indexHtml) &&
      /Folded in now/.test(indexHtml) &&
      /renderArrivalReminderTimeline\(plan\)/.test(indexHtml) &&
      /World Clock/.test(indexHtml),
    'Expected the email gate to show arrival-date-aware instant, pre-arrival, and arrival-day reminder value.'
  );
  block(
    'Daily timeboxes reach the email sequence',
      /function\s+dayOperationsSummary[\s\S]*dayBlockWindow/.test(indexHtml) &&
      /dayOperations:\s*dayOperationsSummary\(plan\)/.test(indexHtml) &&
      /dayOperations:\s*cleanText\(payload\.dayOperations,\s*'',\s*1200\)/.test(funnel) &&
      /dayOperations:\s*String\(lead\.dayOperations/.test(funnel) &&
      /daily timing \+ operating notes/i.test(allEmailTemplateText) &&
      /deterministic timing windows/.test(emailReadme) &&
      /timing windows plus start \/ transit \/ reserve \/ backup/.test(veloReadme),
    'Expected the existing dayOperations payload/Velo/email variable to carry the visible timebox windows.'
  );
  block(
    'Conversion signal reaches lead storage and email',
    /function\s+conversionSignal\(plan\)/.test(indexHtml) &&
      /function\s+conversionSignalSummary\(plan\)/.test(indexHtml) &&
      /conversionSignal:\s*signal\.summary/.test(indexHtml) &&
      /conversionSignal:\s*cleanText\(payload\.conversionSignal\)/.test(funnel) &&
      /conversionSignal:\s*String\(lead\.conversionSignal/.test(funnel) &&
      /conversionSignal:\s*lead\.conversionSignal/.test(funnel) &&
      /\['conversionSignal',\s*'Conversion Signal',\s*'TEXT'\]/.test(collectionScript) &&
      /\$\{conversionSignal\}/.test(allEmailTemplateText) &&
      /Planner signal/i.test(allEmailTemplateText) &&
      /\$\{conversionSignal\}/.test(emailReadme) &&
      /\$\{conversionSignal\}/.test(veloReadme),
    'Expected the deterministic tour-readiness signal to move from widget payload into Wix Data and triggered emails.'
  );
  block(
    'Machine-readable conversion fields are stored',
    /var signal = conversionSignal\(plan\)/.test(indexHtml) &&
      /conversionScore:\s*signal\.score/.test(indexHtml) &&
      /conversionTier:\s*signal\.tier/.test(indexHtml) &&
      /conversionNextAction:\s*signal\.next/.test(indexHtml) &&
      /conversionReasons:\s*signal\.reasons\.join/.test(indexHtml) &&
      /conversionScore:\s*cleanNumber\(payload\.conversionScore,\s*0,\s*0,\s*100\)/.test(funnel) &&
      /conversionTier:\s*cleanText\(payload\.conversionTier\)/.test(funnel) &&
      /conversionNextAction:\s*cleanText\(payload\.conversionNextAction\)/.test(funnel) &&
      /conversionReasons:\s*cleanText\(payload\.conversionReasons\)/.test(funnel) &&
      /conversionScore:\s*lead\.conversionScore/.test(funnel) &&
      /conversionTier:\s*lead\.conversionTier/.test(funnel) &&
      /conversionNextAction:\s*lead\.conversionNextAction/.test(funnel) &&
      /conversionReasons:\s*lead\.conversionReasons/.test(funnel) &&
      /\['conversionScore',\s*'Conversion Score',\s*'NUMBER'\]/.test(collectionScript) &&
      /\['conversionTier',\s*'Conversion Tier',\s*'TEXT'\]/.test(collectionScript) &&
      /\$\{conversionScore\}/.test(emailReadme) &&
      /\$\{conversionTier\}/.test(veloReadme),
    'Expected score/tier/next-action/reason fields to be stored separately for CRM and email segmentation.'
  );
  block(
    'Route Deck and Day Jump Bar exist',
    /data-route-deck/.test(indexHtml) && /Full plan index/.test(indexHtml),
    'Expected visual route deck and unlocked day index.'
  );
  block(
    'Berlin one-off holiday override includes 2028-06-17',
    /BERLIN_ONE_OFF_HOLIDAYS/.test(indexHtml) && /2028-06-17/.test(indexHtml),
    'Berlin.de one-off public holiday override should stay explicit.'
  );

  block(
    'Blog body draft exists and embeds the widget near the top',
    /{{widget:ultimate-berlin-trip-planner}}/.test(blogBody) && blogBody.indexOf('{{widget:ultimate-berlin-trip-planner}}') < 2500,
    'Public body should include the planner embed early.'
  );
  block(
    'Blog body includes Quick Summary placeholder',
    /{{quick-summary}}/.test(blogBody),
    'Blog publishing flow expects {{quick-summary}}.'
  );
  block(
    'Blog body includes FAQ placeholder',
    /{{faq}}/.test(blogBody),
    'Blog publishing flow expects {{faq}} near the bottom.'
  );
  const bodyH1 = (blogBody.match(/^#\s+(.+)$/m) || [])[1] || '';
  const metaTitle = metadataValue(blogDraft, 'Meta title');
  const metaDescription = metadataValue(blogDraft, 'Meta description');
  const category = metadataValue(blogDraft, 'Category');
  const primaryKeyword = metadataValue(blogDraft, 'Primary keyword');
  block(
    'Blog metadata is present',
    Boolean(metaTitle && metaDescription && category && primaryKeyword),
    `metaTitle=${metaTitle || '(missing)'}, metaDescription=${metaDescription || '(missing)'}, category=${category || '(missing)'}, primaryKeyword=${primaryKeyword || '(missing)'}`
  );
  block(
    'Blog targets the Berlin trip planner keyword',
    /Berlin trip planner/i.test(primaryKeyword) &&
      /Berlin trip planner/i.test(bodyH1) &&
      /Berlin trip planner/i.test(metaDescription),
    `H1=${bodyH1 || '(missing)'}, primaryKeyword=${primaryKeyword || '(missing)'}`
  );
  const requiredBlogLinks = [
    'book-berlin-walking-tour/berlin-free-walking-tour-tip-based',
    '/tools/berlin-first-day-planner',
    '/tools/transport-ticket-calculator',
    '/tools/berlin-daily-budget',
    '/tools/whats-open-in-berlin-today',
    '/tools/berlin-3-day-itinerary',
    '/post/where-to-stay-in-berlin-best-neighborhoods-for-every-type-of-tourist'
  ];
  const missingBlogLinks = requiredBlogLinks.filter((needle) => blogBody.indexOf(needle) === -1);
  block(
    'Blog body contains required internal links',
    missingBlogLinks.length === 0,
    missingBlogLinks.length ? `Missing links containing: ${missingBlogLinks.join(', ')}` : `${requiredBlogLinks.length} key internal links present.`
  );

  const quickSummaryEntry = quickSummary['ultimate-berlin-trip-planner'];
  block(
    'Quick Summary entry exists for Ultimate blog',
    Boolean(quickSummaryEntry && Array.isArray(quickSummaryEntry.items) && quickSummaryEntry.items.length >= 5),
    'quick-summary/data.json should include at least five useful bullets.'
  );
  const faqEntry = faqData['ultimate-berlin-trip-planner'];
  block(
    'FAQ entry exists for Ultimate blog',
    Boolean(faqEntry && Array.isArray(faqEntry.items) && faqEntry.items.length >= 5),
    'faq/data.json should include at least five FAQs.'
  );
  block(
    'FAQ injector maps Ultimate slugs',
    /"ultimate-berlin-trip-planner"\s*:\s*"ultimate-berlin-trip-planner"/.test(faqInject) &&
      /"ultimate-berlin-trip-planner-build-realistic-berlin-itinerary-before-you-arrive"\s*:\s*"ultimate-berlin-trip-planner"/.test(faqInject),
    'faq/inject.js should map the planned blog slug and fallback title slug.'
  );
  block(
    'FAQ schema includes Ultimate questions',
    /"ultimate-berlin-trip-planner"\s*:\s*\{[\s\S]*"@type":\s*"FAQPage"[\s\S]*"Is the Ultimate Berlin Trip Planner free\?"/.test(faqInject),
    'faq/inject.js should include generated FAQPage schema for the Ultimate key.'
  );
  const publicNoteLeaks = /Competitor positioning|Sources and Notes|Journy|AITripPlan|TripTop|BerlinUnlocked/i.test(blogBody);
  block(
    'Public blog body has no competitor/source-note leak',
    !publicNoteLeaks,
    'Keep competitor scan notes out of the public body draft.'
  );
  warn(
    'Research/source notes remain only in the private markdown draft',
    /Competitor positioning notes/.test(blogDraft),
    'No private positioning note found in the full markdown draft.'
  );

  block(
    'BerlinTools CMS insert helper exists',
    exists('../insert-ultimate-berlin-trip-planner.js'),
    'Expected root insert-ultimate-berlin-trip-planner.js.'
  );
  block(
    'BerlinTools CMS insert helper targets Ultimate correctly',
    /slug:\s*"ultimate-berlin-trip-planner"/.test(cmsInsertSource) &&
      /widgetUrl:\s*"https:\/\/fenerszymanski\.github\.io\/berlinwalk-widgets\/ultimate-berlin-trip-planner\/"/.test(cmsInsertSource) &&
      /relatedBlogUrl:\s*"https:\/\/www\.berlinwalk\.com\/post\/ultimate-berlin-trip-planner"/.test(cmsInsertSource) &&
      /"@type":\s*"WebApplication"/.test(cmsInsertSource),
    'CMS helper should use the final slug, GitHub widget URL, related blog URL, and WebApplication schema.'
  );

  const smokeEvidence = liveSmokeEvidence();
  warn(
    'Live Wix smoke test evidence is recorded',
    Boolean(smokeEvidence),
    'No live-*.json result with successful tripPlannerLead response found under output/qa/ultimate-trip-planner-live-smoke/.'
  );
  if (smokeEvidence) pass('Latest live smoke evidence file', smokeEvidence);
}

run();

const blocks = checks.filter((check) => check.status === 'BLOCK');
const warnings = checks.filter((check) => check.status === 'WARN');
const passes = checks.filter((check) => check.status === 'PASS');
const icon = { PASS: 'OK', WARN: 'WARN', BLOCK: 'BLOCK' };

for (const check of checks) {
  const detail = check.detail ? ` - ${check.detail}` : '';
  console.log(`${icon[check.status]} ${check.label}${detail}`);
}

console.log('');
console.log(`Summary: ${passes.length} pass, ${warnings.length} warn, ${blocks.length} block`);

if (blocks.length) {
  console.log('Launch status: NOT READY');
  process.exitCode = 1;
} else {
  console.log('Launch status: ready for manual Wix smoke tests');
}
