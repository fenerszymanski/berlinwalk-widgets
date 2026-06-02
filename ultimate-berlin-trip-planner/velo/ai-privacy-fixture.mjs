#!/usr/bin/env node

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const widgetRoot = path.resolve(scriptDir, '..');
const repoRoot = path.resolve(widgetRoot, '..');
const sourcePath = path.join(scriptDir, 'tripPlannerFunnel.js');
const outputDir = path.join(repoRoot, 'output/qa/ultimate-trip-planner-ai-privacy-fixture');

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = { out: '' };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--out') {
      parsed.out = args[index + 1] || '';
      index += 1;
    } else if (arg.startsWith('--out=')) {
      parsed.out = arg.slice('--out='.length);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return parsed;
}

function timestampSlug() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function transformFunnelSource() {
  let source = fs.readFileSync(sourcePath, 'utf8');
  source = source.replace(/^import .+;$/gm, '');
  source = source.replace(/export\s+async\s+function\s+/g, 'async function ');
  return `${source}

return {
  enhanceTripPlannerPlan,
  validateAiEnhancementPayload
};`;
}

function loadFunnelRuntime({ secretValue = '', fetchImpl = async () => ({ ok: false, status: 500, text: async () => '' }) } = {}) {
  const factory = new Function(
    'wixData',
    'contacts',
    'triggeredEmails',
    'getSecret',
    'fetch',
    transformFunnelSource()
  );

  return factory(
    {},
    {},
    {},
    async () => secretValue,
    fetchImpl
  );
}

function fixturePayload() {
  return {
    inputs: {
      arrivalDate: '2026-07-14',
      tripLength: '3 days',
      arrivalTime: 'Before 09:00',
      arrivalPoint: 'BER Airport',
      stayArea: 'Mitte / Alexanderplatz',
      groupType: 'Solo',
      firstTime: 'Yes',
      interests: 'History, food, yusuf@example.com',
      budgetStyle: 'Smart spend',
      mustHandle: 'Rain backup',
      pace: 'Balanced',
      tourIntent: 'Considering'
    },
    weather: {
      title: 'Summer day',
      mode: 'Monthly fallback',
      copy: 'Send details to private@example.com',
      advice: 'Carry a layer'
    },
    tourSlot: {
      dayLabel: 'Day 2',
      dateLabel: '2026-07-15',
      timeLabel: '11:30-13:30',
      booked: 'no'
    },
    plan: {
      title: 'Ultimate plan for hidden@example.com',
      summary: 'Arrival, one main route, then BerlinWalk context.',
      ticket: 'BER needs ABC.',
      tourFit: 'Day 2 at 11:30',
      arrivalStatus: 'Weekday',
      days: [
        {
          dayNumber: 1,
          date: 'Tue, 14 Jul 2026',
          title: 'Arrival day',
          theme: 'Arrival',
          places: ['World Clock', 'Museum Island', 'mail@example.com'],
          blocks: [
            {
              time: '09:00-10:45',
              title: 'Get central',
              copy: 'This line contains bad@example.com and must not reach Gemini.'
            }
          ],
          risks: ['Arrival logistics']
        }
      ]
    }
  };
}

function fakeGeminiBody() {
  return JSON.stringify({
    candidates: [{
      content: {
        parts: [{
          text: JSON.stringify({
            headline: 'Local guide read',
            localRead: 'Keep the first day narrow and useful.',
            watchOut: 'Do not overload arrival day.',
            tourNote: 'Use BerlinWalk once as context if the slot fits.',
            dayNotes: [{
              dayNumber: 1,
              headline: 'Keep it simple',
              note: 'Stay near the first area.',
              nextMove: 'Open the first map.'
            }]
          })
        }]
      }
    }],
    usageMetadata: {
      promptTokenCount: 400,
      candidatesTokenCount: 90,
      totalTokenCount: 490
    }
  });
}

function assertNoPrivateText(value) {
  const text = JSON.stringify(value);
  assert.equal(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text), false, 'Gemini-bound payload/prompt still contains email-like text');
}

async function main() {
  const options = parseArgs();
  const missingKeyRuntime = loadFunnelRuntime({ secretValue: '' });
  const missingKeyResult = await missingKeyRuntime.enhanceTripPlannerPlan(fixturePayload());
  assert.equal(missingKeyResult.ok, false);
  assert.equal(missingKeyResult.reason, 'missing_api_key');

  let capturedRequest = null;
  const runtime = loadFunnelRuntime({
    secretValue: 'fixture-gemini-key',
    fetchImpl: async (url, request) => {
      capturedRequest = {
        url,
        body: JSON.parse(request.body)
      };
      return {
        ok: true,
        status: 200,
        text: async () => fakeGeminiBody()
      };
    }
  });

  const sanitizedInput = runtime.validateAiEnhancementPayload(fixturePayload());
  assertNoPrivateText(sanitizedInput);

  const result = await runtime.enhanceTripPlannerPlan(fixturePayload());
  assert.equal(result.ok, true);
  assert.equal(result.enhancement.provider, 'gemini');
  assert.equal(result.enhancement.model, 'fixture-gemini-key');
  assert.equal(result.enhancement.usage.totalTokens, 490);
  assert.ok(capturedRequest, 'Gemini fetch was not called');
  assert.equal(capturedRequest.body.generationConfig.thinkingConfig.thinkingBudget, 0);
  assert.equal(capturedRequest.body.generationConfig.responseMimeType, 'application/json');
  assert.ok(capturedRequest.body.generationConfig.responseJsonSchema, 'responseJsonSchema missing');
  assertNoPrivateText(capturedRequest.body.contents);

  const evidence = {
    generatedAt: new Date().toISOString(),
    missingKeyFailSoft: {
      ok: missingKeyResult.ok,
      reason: missingKeyResult.reason
    },
    privacyScrub: {
      sanitizedInputHasPrivateText: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(JSON.stringify(sanitizedInput)),
      promptHasPrivateText: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(JSON.stringify(capturedRequest.body.contents))
    },
    geminiRequest: {
      url: capturedRequest.url,
      modelUrlUsesFixtureKey: /fixture-gemini-key/.test(capturedRequest.url),
      thinkingBudget: capturedRequest.body.generationConfig.thinkingConfig.thinkingBudget,
      responseMimeType: capturedRequest.body.generationConfig.responseMimeType,
      hasResponseJsonSchema: Boolean(capturedRequest.body.generationConfig.responseJsonSchema)
    },
    enhancement: {
      ok: result.ok,
      provider: result.enhancement.provider,
      model: result.enhancement.model,
      dayNotes: result.enhancement.dayNotes.length,
      totalTokens: result.enhancement.usage.totalTokens
    }
  };

  const outPath = options.out
    ? path.resolve(process.cwd(), options.out)
    : path.join(outputDir, `ai-privacy-fixture-${timestampSlug()}.json`);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(evidence, null, 2) + '\n');
  console.log('Ultimate Trip Planner AI privacy fixture: PASS');
  console.log(`Result written to ${path.relative(process.cwd(), outPath)}`);
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exitCode = 1;
});
