#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const faqDataPath = path.join(repoRoot, 'faq', 'data.json');
const slugMapPath = path.join(repoRoot, 'faq', 'slug-map.json');
const injectPath = path.join(repoRoot, 'faq', 'inject.js');
const blogDraftsDir = path.join(repoRoot, 'blog-drafts');
const siteBase = 'https://www.berlinwalk.com/post/';

const STOPWORDS = new Set([
  'about', 'after', 'again', 'berlin', 'berlinwalk', 'could', 'every', 'first',
  'germany', 'guide', 'should', 'there', 'these', 'thing', 'things', 'through',
  'tourist', 'tourists', 'where', 'which', 'while', 'would',
]);

function parseArgs(argv) {
  const args = {
    live: false,
    rendered: false,
    output: '',
    slugs: [],
    limit: 0,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];
    if (arg === '--live') args.live = true;
    else if (arg === '--rendered') args.rendered = true;
    else if (arg === '--output') args.output = next, i += 1;
    else if (arg === '--slugs') args.slugs = next.split(',').map((v) => v.trim()).filter(Boolean), i += 1;
    else if (arg === '--limit') args.limit = Number(next), i += 1;
    else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function printHelp() {
  console.log(`Usage:
  node scripts/audit-faq-seo.mjs
  node scripts/audit-faq-seo.mjs --live --slugs pfand-in-germany,what-is-a-spati-berlin
  node scripts/audit-faq-seo.mjs --output output/qa/faq-seo-audit-20260612.md

Options:
  --live             Fetch live post HTML and check that faq/inject.js is present.
  --rendered         Try a Playwright rendered-DOM check for #bw-faq-jsonld.
  --slugs a,b,c      Restrict live checks to selected blog slugs.
  --limit N          Restrict live checks to the first N mapped slugs.
  --output path      Write the markdown report to a file.
`);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function markdownToPlainText(value) {
  return String(value || '')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)(?:\s+"[^"]*")?\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function groupsFor(config) {
  if (Array.isArray(config?.tabs) && config.tabs.length) {
    return config.tabs.flatMap((tab) => Array.isArray(tab.items) ? tab.items : []);
  }
  return Array.isArray(config?.items) ? config.items : [];
}

function parseInjectedObject(varName, source) {
  const startMarker = `var ${varName} = `;
  const endMarker = varName === 'SLUG_MAP' ? '\n\n  var SCHEMAS' : '\n\n  function currentSlug';
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);
  if (start === -1 || end === -1) throw new Error(`Could not parse ${varName} from faq/inject.js`);
  const objectText = source.slice(start + startMarker.length, end).replace(/;\s*$/, '');
  return Function(`return (${objectText});`)();
}

function schemaMarkdownLeaks(schemaObject) {
  const text = JSON.stringify(schemaObject);
  return {
    boldMarkers: (text.match(/\*\*/g) || []).length,
    underlineMarkers: (text.match(/__/g) || []).length,
    markdownLinks: (text.match(/\[[^\]]+\]\(https?:\/\/[^)]+\)/g) || []).length,
  };
}

function findDraftSource(slug, faqKey) {
  const candidates = [
    `${slug}.md`,
    `${slug}.body.md`,
    `${faqKey}.md`,
    `${faqKey}.body.md`,
  ].map((file) => path.join(blogDraftsDir, file));

  return candidates.find((filePath) => fs.existsSync(filePath)) || '';
}

function normalizeForCoverage(text) {
  return markdownToPlainText(text)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function coverageTokens(question) {
  return normalizeForCoverage(question)
    .split(' ')
    .filter((word) => word.length >= 5 && !STOPWORDS.has(word))
    .slice(0, 8);
}

function stripFaqSection(markdown) {
  const withoutPlaceholders = markdown.replace(/\{\{faq\}\}/g, ' ');
  const split = withoutPlaceholders.split(/\n## FAQ\b/i);
  return split[0] || withoutPlaceholders;
}

function buildCoverageReport({ faqData, slugMap }) {
  return Object.entries(slugMap).map(([slug, faqKey]) => {
    const source = findDraftSource(slug, faqKey);
    const items = groupsFor(faqData[faqKey]);
    if (!source) {
      return { slug, faqKey, status: 'no_local_source', source: '', total: items.length, covered: 0, review: items.length };
    }

    const body = normalizeForCoverage(stripFaqSection(fs.readFileSync(source, 'utf8')));
    let covered = 0;
    const reviewQuestions = [];

    for (const item of items) {
      const tokens = coverageTokens(item.q);
      const matches = tokens.filter((token) => body.includes(token)).length;
      const isCovered = tokens.length === 0 || matches >= Math.min(2, tokens.length);
      if (isCovered) covered += 1;
      else reviewQuestions.push(markdownToPlainText(item.q));
    }

    return {
      slug,
      faqKey,
      status: reviewQuestions.length ? 'review_needed' : 'covered',
      source: path.relative(repoRoot, source),
      total: items.length,
      covered,
      review: reviewQuestions.length,
      reviewQuestions,
    };
  });
}

async function liveHtmlChecks({ slugMap, slugs, limit }) {
  let entries = Object.keys(slugMap);
  if (slugs.length) entries = entries.filter((slug) => slugs.includes(slug));
  if (limit > 0) entries = entries.slice(0, limit);

  const checks = [];
  for (const slug of entries) {
    const url = `${siteBase}${slug}`;
    try {
      const res = await fetch(url, {
        headers: { 'user-agent': 'Mozilla/5.0 BerlinWalk FAQ SEO audit' },
      });
      const html = await res.text();
      checks.push({
        slug,
        url,
        status: res.status,
        hasFaqInject: html.includes('/faq/inject.js'),
        hasJsonLd: html.includes('application/ld+json'),
      });
    } catch (error) {
      checks.push({ slug, url, status: 0, hasFaqInject: false, hasJsonLd: false, error: error.message });
    }
  }
  return checks;
}

async function renderedChecks({ slugMap, slugs, limit }) {
  let entries = Object.keys(slugMap);
  if (slugs.length) entries = entries.filter((slug) => slugs.includes(slug));
  if (limit > 0) entries = entries.slice(0, limit);

  let playwright;
  try {
    playwright = await import('playwright');
  } catch {
    return renderedChecksViaCli(entries);
  }

  const browser = await playwright.chromium.launch({ headless: true });
  const page = await browser.newPage();
  const checks = [];
  for (const slug of entries) {
    const url = `${siteBase}${slug}`;
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
      await page.waitForTimeout(1000);
      checks.push({
        slug,
        url,
        hasRenderedFaqJsonLd: await page.locator('#bw-faq-jsonld').count() > 0,
        schemaType: await page.locator('#bw-faq-jsonld').evaluate((node) => {
          try { return JSON.parse(node.textContent || '{}')['@type'] || ''; }
          catch { return 'parse_error'; }
        }).catch(() => ''),
      });
    } catch (error) {
      checks.push({ slug, url, hasRenderedFaqJsonLd: false, schemaType: '', error: error.message });
    }
  }
  await browser.close();
  return { skipped: '', checks };
}

function parseCliJson(stdout) {
  const payload = JSON.parse(stdout);
  let value = payload.result;
  if (typeof value === 'string') {
    try { value = JSON.parse(value); }
    catch {}
  }
  if (typeof value === 'string') {
    try { value = JSON.parse(value); }
    catch {}
  }
  return value;
}

function renderedChecksViaCli(entries) {
  const codexHome = process.env.CODEX_HOME || path.join(os.homedir(), '.codex');
  const cliPath = path.join(codexHome, 'skills', 'playwright', 'scripts', 'playwright_cli.sh');
  if (!fs.existsSync(cliPath)) {
    return { skipped: 'Playwright is not installed and the Codex Playwright CLI wrapper was not found.', checks: [] };
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bw-faq-seo-'));
  const checks = [];
  const expression = `(() => {
    const node = document.querySelector('#bw-faq-jsonld');
    if (!node) return JSON.stringify({ hasRenderedFaqJsonLd: false, schemaType: '', count: 0 });
    try {
      const data = JSON.parse(node.textContent || '{}');
      return JSON.stringify({
        hasRenderedFaqJsonLd: true,
        schemaType: data['@type'] || '',
        count: Array.isArray(data.mainEntity) ? data.mainEntity.length : 0
      });
    } catch (error) {
      return JSON.stringify({ hasRenderedFaqJsonLd: true, schemaType: 'parse_error', count: 0, error: error.message });
    }
  })()`;

  try {
    entries.forEach((slug, index) => {
      const url = `${siteBase}${slug}`;
      const session = `faqseo-${process.pid}-${index}`;
      try {
        execFileSync(cliPath, ['--session', session, 'open', url, '--json'], {
          cwd: tmpDir,
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'pipe'],
          timeout: 60000,
        });
        const stdout = execFileSync(cliPath, ['--session', session, 'eval', expression, '--json'], {
          cwd: tmpDir,
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'pipe'],
          timeout: 60000,
        });
        const result = parseCliJson(stdout);
        checks.push({ slug, url, ...result });
      } catch (error) {
        checks.push({
          slug,
          url,
          hasRenderedFaqJsonLd: false,
          schemaType: '',
          count: 0,
          error: error.stderr?.toString().trim() || error.message,
        });
      } finally {
        try {
          execFileSync(cliPath, ['--session', session, 'close', '--json'], {
            cwd: tmpDir,
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'pipe'],
            timeout: 30000,
          });
        } catch {}
      }
    });
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  return { skipped: '', checks };
}

function renderReport({ faqData, slugMap, injectMap, injectSchemas, leaks, missingRefs, unmappedKeys, coverage, liveChecks, renderedResult }) {
  const failures = [];
  if (missingRefs.length) failures.push(`${missingRefs.length} missing slug-map references`);
  if (leaks.boldMarkers || leaks.underlineMarkers || leaks.markdownLinks) failures.push('Markdown remains in generated schema');

  const coverageSummary = coverage.reduce((acc, row) => {
    acc[row.status] = (acc[row.status] || 0) + 1;
    return acc;
  }, {});

  const lines = [
    '# BerlinWalk FAQ SEO Audit',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Verdict: ${failures.length ? `FAIL (${failures.join(', ')})` : 'PASS'}`,
    '',
    '## Schema Health',
    '',
    `- FAQ data entries: ${Object.keys(faqData).length}`,
    `- Slug mappings: ${Object.keys(slugMap).length}`,
    `- Injected schema entries: ${Object.keys(injectSchemas).length}`,
    `- Missing slug-map references: ${missingRefs.length}`,
    `- Unmapped FAQ keys: ${unmappedKeys.length}`,
    `- Markdown leaks in schema: bold=${leaks.boldMarkers}, underline=${leaks.underlineMarkers}, links=${leaks.markdownLinks}`,
    `- Inject map matches source map: ${JSON.stringify(injectMap) === JSON.stringify(slugMap) ? 'yes' : 'no'}`,
    '',
    '## Body Coverage Heuristic',
    '',
    `- Covered: ${coverageSummary.covered || 0}`,
    `- Review needed: ${coverageSummary.review_needed || 0}`,
    `- No local source: ${coverageSummary.no_local_source || 0}`,
    '',
  ];

  const reviewRows = coverage
    .filter((row) => row.status !== 'covered')
    .slice(0, 40);
  if (reviewRows.length) {
    lines.push('| Slug | FAQ key | Status | Covered | Source |');
    lines.push('| --- | --- | --- | ---: | --- |');
    for (const row of reviewRows) {
      lines.push(`| ${row.slug} | ${row.faqKey} | ${row.status} | ${row.covered}/${row.total} | ${row.source || '-'} |`);
    }
    lines.push('');
  }

  if (liveChecks.length) {
    lines.push('## Live HTML Checks');
    lines.push('');
    lines.push('| Slug | HTTP | faq/inject.js | JSON-LD |');
    lines.push('| --- | ---: | --- | --- |');
    for (const check of liveChecks) {
      lines.push(`| ${check.slug} | ${check.status} | ${check.hasFaqInject ? 'yes' : 'no'} | ${check.hasJsonLd ? 'yes' : 'no'} |`);
    }
    lines.push('');
  }

  if (renderedResult?.skipped) {
    lines.push('## Rendered DOM Checks');
    lines.push('');
    lines.push(`- Skipped: ${renderedResult.skipped}`);
    lines.push('');
  } else if (renderedResult?.checks?.length) {
    lines.push('## Rendered DOM Checks');
    lines.push('');
    lines.push('| Slug | #bw-faq-jsonld | Schema type |');
    lines.push('| --- | --- | --- |');
    for (const check of renderedResult.checks) {
      const schemaType = check.count ? `${check.schemaType || '-'} (${check.count})` : check.schemaType || '-';
      lines.push(`| ${check.slug} | ${check.hasRenderedFaqJsonLd ? 'yes' : 'no'} | ${schemaType} |`);
    }
    lines.push('');
  }

  if (missingRefs.length) {
    lines.push('## Missing References');
    lines.push('');
    missingRefs.forEach((ref) => lines.push(`- ${ref}`));
    lines.push('');
  }

  return `${lines.join('\n')}\n`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const faqData = readJson(faqDataPath);
  const slugMap = readJson(slugMapPath);
  const injectSource = fs.readFileSync(injectPath, 'utf8');
  const injectMap = parseInjectedObject('SLUG_MAP', injectSource);
  const injectSchemas = parseInjectedObject('SCHEMAS', injectSource);
  const leaks = schemaMarkdownLeaks(injectSchemas);
  const missingRefs = Object.entries(slugMap)
    .filter(([, faqKey]) => !faqData[faqKey])
    .map(([slug, faqKey]) => `${slug} -> ${faqKey}`);
  const mappedKeys = new Set(Object.values(slugMap));
  const unmappedKeys = Object.keys(faqData)
    .filter((key) => key !== 'home' && !mappedKeys.has(key));
  const coverage = buildCoverageReport({ faqData, slugMap });
  const liveChecks = args.live ? await liveHtmlChecks({ slugMap, slugs: args.slugs, limit: args.limit }) : [];
  const renderedResult = args.rendered ? await renderedChecks({ slugMap, slugs: args.slugs, limit: args.limit }) : null;
  const report = renderReport({
    faqData,
    slugMap,
    injectMap,
    injectSchemas,
    leaks,
    missingRefs,
    unmappedKeys,
    coverage,
    liveChecks,
    renderedResult,
  });

  if (args.output) {
    const outputPath = path.resolve(repoRoot, args.output);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, report);
    console.log(`Wrote ${path.relative(repoRoot, outputPath)}`);
  } else {
    process.stdout.write(report);
  }

  if (missingRefs.length || leaks.boldMarkers || leaks.underlineMarkers || leaks.markdownLinks) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
