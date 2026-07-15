#!/usr/bin/env node
import { readFileSync } from 'node:fs';

const forbidden = [
  { name: 'body H1 duplicate', pattern: /^#\s+.+$/m },
  { name: 'sources recheck heading', pattern: /^##\s+Sources to Recheck Before Publishing\b/im },
  { name: 'source notes heading', pattern: /^##\s+Source Notes\b/im },
  { name: 'sources and notes heading', pattern: /^##\s+Sources and Notes\b/im },
  { name: 'research notes heading', pattern: /^##\s+Research Notes\b/im },
  { name: 'widget plan heading', pattern: /^##\s+Widget Plan\b/im },
  { name: 'local draft status', pattern: /^Status:\s/im },
  { name: 'slug idea metadata', pattern: /^Slug idea:\s/im },
  { name: 'meta title metadata', pattern: /^Meta title:\s/im },
  { name: 'meta description metadata', pattern: /^Meta description:\s/im },
  { name: 'AI or process provenance leak', pattern: /\bAI-generated\b/i },
  { name: 'ChatGPT workflow leak', pattern: /\bChatGPT\b/i },
  { name: 'logged-in browser workflow leak', pattern: /\blogged-?in\b/i },
  { name: 'paid image API process leak', pattern: /\b(no\s+paid|paid)\s+(image|video)?\s*API\b/i },
  { name: 'generation workflow leak', pattern: /\b(browser|manual|visual|image|icon)\s+workflow\b/i },
  { name: 'source prompt or output leak', pattern: /\b(source\s+prompt|source\s+output|prompt\/output|prompts\/files)\b/i },
  { name: 'local visual source file leak', pattern: /\bvisual-sources\.md\b/i },
  { name: 'internal automation or tooling leak', pattern: /\b(Codex|Claude|automation|local draft package|unpublished Wix draft workflow)\b/i },
  { name: 'handoff note leak', pattern: /\bhandoff notes?\b/i },
];

const files = process.argv.slice(2);
if (!files.length) {
  console.error('Usage: node scripts/validate-blog-publish-body.mjs <publish-body.md> [...]');
  process.exit(2);
}

let failed = false;
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const hits = forbidden.filter((rule) => rule.pattern.test(text));
  if (hits.length) {
    failed = true;
    console.error(`FAIL ${file}`);
    for (const hit of hits) console.error(`- ${hit.name}`);
  } else {
    console.log(`OK ${file}`);
  }
}

if (failed) process.exit(1);
