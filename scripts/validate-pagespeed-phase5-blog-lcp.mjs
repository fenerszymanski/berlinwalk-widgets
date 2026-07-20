#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const source = fs.readFileSync(path.resolve(here, '../js/blog-journey-inject.js'), 'utf8');
const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

check(!source.includes('html.bw-blog-mobile-preparing:not(.bw-blog-enhanced-ready)'), 'Legacy mobile article prehide selector is still present.');
check(!source.includes('[0, 80, 220, 520, 1100, 2400, 4200, 7000]'), 'Eight eager full-render timers are still present.');
check(source.includes('function renderCritical()'), 'Critical first-paint render is missing.');
check(source.includes('function scheduleEnhancement(delay)'), 'Deferred enhancement scheduler is missing.');
check(source.includes('window.requestIdleCallback(run, { timeout: 1400 })'), 'Idle enhancement gate is missing.');
check(source.includes('body.setAttribute(ENHANCEMENT_MARKER, \'1\')'), 'Enhanced-body idempotency marker is missing.');
check(source.includes("title.closest('header')"), 'Share bar is not anchored after the native post header.');

const observerStart = source.indexOf('observer = new MutationObserver(function ()');
const observerEnd = source.indexOf('if (document.body) observer.observe', observerStart);
const observerSource = observerStart >= 0 && observerEnd > observerStart ? source.slice(observerStart, observerEnd) : '';
check(Boolean(observerSource), 'Mutation observer block could not be found.');
['normalizePostSpacing(', 'normalizeHeadingTypography(', 'hideNativeEndMatter(', 'collectHeadings(', 'decorateBlogBookLinks('].forEach((call) => {
  check(!observerSource.includes(call), `Mutation observer still performs broad work: ${call}`);
});

[
  'installDelayedConsentGuard();',
  'loadBookingNextActionPatch();',
  'installConsentGatedBookingAnalytics();',
  'installConsentSettingsUi();',
  "var TRACK_ENDPOINT = 'https://berlinwalk-content-app.vercel.app/api/pf-event';",
  "var ATTRIBUTION_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id', 'fbclid', 'fbc', 'fbp'];",
  'function applyBookAttribution(',
  'function analyticsConsent()',
].forEach((contract) => {
  check(source.includes(contract), `Protected booking/consent/attribution contract is missing: ${contract}`);
});

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('PASS: blog H1 is not prehidden; heavy post work is idle-deferred.');
console.log('PASS: mutation observer excludes broad DOM scans.');
console.log('PASS: booking, consent, attribution and analytics contracts remain present.');
