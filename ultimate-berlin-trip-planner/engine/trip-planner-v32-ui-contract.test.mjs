import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const plannerRoot = path.resolve(here, '..');
const indexHtml = fs.readFileSync(path.join(plannerRoot, 'index.html'), 'utf8');

function customerEmailText() {
  const markdown = fs.readdirSync(path.join(plannerRoot, 'email'))
    .filter((name) => /^e\d-.*\.md$/.test(name))
    .map((name) => fs.readFileSync(path.join(plannerRoot, 'email', name), 'utf8'));
  const html = fs.readdirSync(path.join(plannerRoot, 'email', 'paste-ready'))
    .filter((name) => /^e\d-.*\.html$/.test(name))
    .map((name) => fs.readFileSync(path.join(plannerRoot, 'email', 'paste-ready', name), 'utf8'));
  return markdown.concat(html).join('\n').toLowerCase();
}

test('paid web plan renders one active day and provides previous/next controls', () => {
  assert.match(indexHtml, /daysEl\.innerHTML\s*=\s*artifactFullDayHtml\(activeDay\)/);
  assert.doesNotMatch(indexHtml, /daysEl\.innerHTML\s*=\s*view\.days\.map\(artifactFullDayHtml\)/);
  assert.match(indexHtml, />Previous day<\/button>/);
  assert.match(indexHtml, />Next day<\/button>/);
  assert.match(indexHtml, /artifactRevealDay\s*=\s*fullDayNumber;\s*renderFullPlan\(\);/);
});

test('paid transfer cards expose the engine instruction and a descriptive map link', () => {
  assert.match(indexHtml, /bw-artifact-full-transfer-instruction/);
  assert.match(indexHtml, /escapeHtml\(transfer\.instruction\)/);
  assert.match(indexHtml, /Open this route in Google Maps/);
});

test('booked-tour sales CTA stays hidden and preparation uses the meeting-point map', () => {
  assert.match(indexHtml, /\.bw-plan-tour-book\[hidden\]\s*\{\s*display:\s*none;/s);
  assert.match(indexHtml, /state\.tourIntent === 'booked'[\s\S]*Check the date and time in your booking confirmation\.[\s\S]*url:\s*meetingPointUrl\(\)/);
  assert.match(indexHtml, /if \(!cta \|\| cta\.kind === 'meeting'\)\s*\{\s*link\.hidden = true;/s);
});

test('paid web plan meets the V3.2 mobile reading-size contract', () => {
  assert.match(indexHtml, /\.bw-artifact-full-block p\s*\{[^}]*font-size:\s*16px/s);
  assert.match(indexHtml, /\.bw-artifact-full-weather small\s*\{[^}]*font-size:\s*14px/s);
  assert.match(indexHtml, /\.bw-artifact-full-day-hero h3\s*\{[^}]*font-size:\s*28px/s);
  assert.match(indexHtml, /\.bw-artifact-full-day-controls button\s*\{[^}]*min-height:\s*46px/s);
});

test('current customer surfaces contain none of the rejected product jargon', () => {
  const publicText = (indexHtml + '\n' + customerEmailText()).toLowerCase();
  const rejected = [
    'get central without over-solving berlin',
    'over-solving',
    'route windows',
    'stored itinerary',
    'same stored plan',
    'live guardrails',
    'take an abc train',
    'your trip spine',
  ];
  rejected.forEach((phrase) => assert.equal(publicText.includes(phrase), false, phrase));
});

test('the planner form and weather explanation use short direct sentences', () => {
  assert.match(indexHtml, /Tell me about your Berlin trip\./);
  assert.match(indexHtml, /Where and when do you arrive\?/);
  assert.match(indexHtml, /Choose your pace and practical needs\./);
  assert.match(indexHtml, /Live forecast from Open-Meteo\. Checked/);
  assert.match(indexHtml, /Typical seasonal conditions\. This is not a forecast\./);
  assert.doesNotMatch(indexHtml, /Tell me the shape of your days in Berlin/);
  assert.doesNotMatch(indexHtml, /What should this trip make easy/);
});

test('the decision receipt names the selected stay area instead of a generic day label', () => {
  assert.match(indexHtml, /var firstArea = labels\.stayArea \|\| artifactAreaForDay\(first\);/);
  assert.match(indexHtml, /Day 1 ends after check-in and dinner near your stay in /);
  assert.doesNotMatch(indexHtml, /firstArtifactDay\.area \|\| compactPreviewArea\(first\)/);
});
