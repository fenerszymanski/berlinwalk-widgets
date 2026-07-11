#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const gameRoot = path.resolve(here, '..');
const data = JSON.parse(fs.readFileSync(path.join(gameRoot, 'data.json'), 'utf8'));
const checkAssets = !process.argv.includes('--no-assets');
const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function optionFor(answer) {
  const question = data.questions.find((item) => item.id === answer.questionId);
  return question?.options.find((item) => item.id === answer.optionId);
}

function calculateMatch(answers) {
  const sums = Object.fromEntries(data.axes.map((axis) => [axis, 0]));
  const affinity = {};
  for (const answer of answers) {
    const option = optionFor(answer);
    for (const axis of data.axes) sums[axis] += Number(option.axes?.[axis] || 0);
    for (const [districtId, amount] of Object.entries(option.affinity || {})) {
      affinity[districtId] = (affinity[districtId] || 0) + Number(amount || 0);
    }
  }

  const answerCount = Math.max(1, answers.length);
  const ranked = data.districts.map((district) => {
    const profileSimilarity = data.axes.reduce((total, axis) => {
      const answerAverage = sums[axis] / answerCount;
      const distance = Math.abs(answerAverage - Number(district.profile?.[axis] || 0));
      return total + (1 - distance / 4);
    }, 0) / Math.max(1, data.axes.length);
    const affinityScore = Math.max(0, Math.min(1, Number(affinity[district.id] || 0) / (answerCount * 3 * 2)));
    return { district, score: profileSimilarity * 0.85 + affinityScore * 0.15, affinityScore };
  }).sort((a, b) => b.score - a.score || b.affinityScore - a.affinityScore || a.district.id.localeCompare(b.district.id));

  return ranked[0].district.id;
}

assert(Array.isArray(data.axes) && data.axes.length === 6, 'Expected exactly six lifestyle axes.');
assert(Array.isArray(data.questions) && data.questions.length === 6, 'Expected exactly six questions.');
assert(Array.isArray(data.districts) && data.districts.length === 12, 'Expected all twelve Berlin boroughs.');

const districtIds = new Set(data.districts.map((district) => district.id));
assert(districtIds.size === 12, 'District IDs must be unique.');

for (const district of data.districts) {
  for (const axis of data.axes) {
    const value = district.profile?.[axis];
    assert(Number.isFinite(value) && value >= -2 && value <= 2, `${district.id}: invalid profile value for ${axis}.`);
  }
  if (checkAssets) assert(fs.existsSync(path.join(gameRoot, district.poster)), `${district.id}: missing result poster ${district.poster}.`);
}

for (const question of data.questions) {
  assert(Array.isArray(question.options) && question.options.length === 4, `${question.id}: expected exactly four options.`);
  const optionIds = new Set(question.options.map((option) => option.id));
  assert(optionIds.size === 4, `${question.id}: option IDs must be unique.`);
  for (const option of question.options) {
    for (const axis of data.axes) {
      const value = option.axes?.[axis];
      assert(Number.isFinite(value) && value >= -2 && value <= 2, `${question.id}/${option.id}: invalid axis value for ${axis}.`);
    }
    const entries = Object.entries(option.affinity || {});
    assert(entries.length <= 3, `${question.id}/${option.id}: affinity must cover at most three boroughs.`);
    for (const [districtId, amount] of entries) {
      assert(districtIds.has(districtId), `${question.id}/${option.id}: unknown borough ${districtId}.`);
      assert(Number.isFinite(amount) && amount >= 0 && amount <= 2, `${question.id}/${option.id}: affinity for ${districtId} must be 0..2.`);
    }
    if (checkAssets) assert(fs.existsSync(path.join(gameRoot, option.image)), `${question.id}/${option.id}: missing option image ${option.image}.`);
  }
}

const outcomes = Object.fromEntries(data.districts.map((district) => [district.id, 0]));
const answers = [];

function visit(questionIndex) {
  if (questionIndex === data.questions.length) {
    outcomes[calculateMatch(answers)] += 1;
    return;
  }
  const question = data.questions[questionIndex];
  for (const option of question.options) {
    answers.push({ questionId: question.id, optionId: option.id });
    visit(questionIndex + 1);
    answers.pop();
  }
}

visit(0);
const totalPaths = Object.values(outcomes).reduce((total, value) => total + value, 0);
for (const [districtId, count] of Object.entries(outcomes)) {
  const share = count / totalPaths;
  assert(count > 0, `${districtId}: is unreachable in the 4^6 answer matrix.`);
  assert(share >= 0.03 && share <= 0.15, `${districtId}: ${Math.round(share * 1000) / 10}% share is outside the 3-15% balance guardrail.`);
}

const report = {
  ok: errors.length === 0,
  checkAssets,
  questions: data.questions.length,
  districts: data.districts.length,
  answerPaths: totalPaths,
  outcomeBalance: Object.fromEntries(Object.entries(outcomes).map(([id, count]) => [id, { count, share: Number((count / totalPaths).toFixed(4)) }])),
  errors
};

console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exit(1);
