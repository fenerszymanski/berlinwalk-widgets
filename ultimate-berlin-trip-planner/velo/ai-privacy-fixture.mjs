#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const base = new URL('../', import.meta.url);
const [indexHtml, funnelSource, httpSource] = await Promise.all([
  readFile(new URL('index.html', base), 'utf8'),
  readFile(new URL('velo/tripPlannerFunnel.js', base), 'utf8'),
  readFile(new URL('velo/http-functions.js', base), 'utf8'),
]);

assert.doesNotMatch(indexHtml, /_functions\/tripPlannerAi|generativelanguage|requestAiEnhancement|bw_trip_planner_ai_/i);
assert.doesNotMatch(funnelSource, /generativelanguage|wix-fetch|wix-secrets-backend|getSecret\(|generateContent|TripPlannerAiBudget/i);
assert.match(funnelSource, /enhanceTripPlannerPlan[\s\S]*?ai_disabled/);
assert.match(httpSource, /post_tripPlannerAi[\s\S]*?status:\s*410[\s\S]*?ai_disabled/);
assert.doesNotMatch(httpSource, /enhanceTripPlannerPlan/);

console.log(JSON.stringify({
  ok: true,
  runtimeAi: 'disabled',
  browserAiRequests: 0,
  modelNetworkCalls: 0,
  legacyEndpoint: '410 ai_disabled',
}, null, 2));
