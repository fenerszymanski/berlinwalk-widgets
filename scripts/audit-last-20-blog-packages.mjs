#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const API_ROOT = 'https://www.wixapis.com';
const SITE_ID = process.env.WIX_SITE_ID || '12ee5ea0-70a7-492f-8020-ffb27cbb630f';
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_LIMIT = 20;
const INTERNAL_LEAKS = [
  'Sources to Recheck Before Publishing',
  'Sources and Notes',
  'Research Notes',
  'Widget Plan',
  'Status:',
  'Slug idea:',
  'Meta title:',
  'Meta description:',
  'AI-generated',
  'ChatGPT',
  'logged-in',
  'No paid image API',
  'source prompt',
  'visual-sources.md',
  'Codex',
  'Claude',
];
const GENERIC_PHRASES = [
  'keep walking in the same area',
  'avoid another cross-city journey',
  'make the day easier',
  'one clear anchor',
  'one good anchor',
  'make the day smaller',
  'rushed checklist',
  'the practical move',
  'that is the better',
  'this is the better',
  'the point is not',
  'the point is to',
  'decision aid',
  'decision point',
];

function parseArgs(argv) {
  const args = {
    limit: DEFAULT_LIMIT,
    outDir: path.join(REPO_ROOT, 'output', 'qa', 'blog-last20-quality-audit-20260819'),
  };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--limit') args.limit = Number(argv[++i]);
    else if (argv[i] === '--out-dir') args.outDir = path.resolve(argv[++i]);
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  if (!Number.isInteger(args.limit) || args.limit < 1 || args.limit > 100) {
    throw new Error('--limit must be an integer between 1 and 100');
  }
  return args;
}

function authHeaders() {
  if (!process.env.WIX_API_KEY) throw new Error('Missing WIX_API_KEY. Run the root scripts/load-api-keys.sh loader.');
  return {
    Authorization: process.env.WIX_API_KEY,
    'wix-site-id': SITE_ID,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

async function wixFetch(pathname, { method = 'GET', body } = {}) {
  const response = await fetch(`${API_ROOT}${pathname}`, {
    method,
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const raw = await response.text();
  let payload = {};
  try { payload = raw ? JSON.parse(raw) : {}; } catch { payload = { raw }; }
  if (!response.ok) {
    throw new Error(`Wix ${method} ${pathname} failed (${response.status}): ${payload.message || raw.slice(0, 500)}`);
  }
  return payload;
}

function sha256(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function cleanText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function nodeText(value) {
  const parts = [];
  function walk(item) {
    if (!item || typeof item !== 'object') return;
    if (item.type === 'TEXT' && typeof item.textData?.text === 'string') parts.push(item.textData.text);
    if (Array.isArray(item.nodes)) item.nodes.forEach(walk);
  }
  walk(value);
  return cleanText(parts.join(' '));
}

function walkObjects(value, visitor) {
  if (!value || typeof value !== 'object') return;
  visitor(value);
  if (Array.isArray(value)) value.forEach((item) => walkObjects(item, visitor));
  else Object.values(value).forEach((item) => walkObjects(item, visitor));
}

function collectStrings(value) {
  const strings = [];
  walkObjects(value, (item) => {
    for (const entry of Object.values(item)) {
      if (typeof entry === 'string') strings.push(entry);
    }
  });
  return strings;
}

function collectUrls(value) {
  const urls = new Set();
  for (const string of collectStrings(value)) {
    for (const match of string.matchAll(/https?:\/\/[^\s"'<>\\]+/g)) {
      urls.add(match[0].replace(/[),.;]+$/, ''));
    }
  }
  return [...urls].sort();
}

function collectNodes(richContent) {
  const nodes = [];
  walkObjects(richContent?.nodes || [], (item) => {
    if (typeof item.type === 'string') nodes.push(item);
  });
  return nodes;
}

function countWords(text) {
  return (text.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || []).length;
}

function countMatches(text, regex) {
  return [...text.matchAll(regex)].length;
}

function markdownToPlain(markdown) {
  return cleanText(markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[>*_`~]/g, ' ')
    .replace(/\{\{[^}]+\}\}/g, ' '));
}

async function findBodyFiles() {
  const matches = new Map();
  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const absolute = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(absolute);
      else if (entry.name.endsWith('.body.md')) {
        matches.set(entry.name.slice(0, -'.body.md'.length), absolute);
      }
    }
  }
  await walk(path.join(REPO_ROOT, 'blog-drafts'));
  return matches;
}

async function queryLatestPublished(limit) {
  const payload = await wixFetch('/blog/v3/posts/query', {
    method: 'POST',
    body: {
      query: {
        paging: { limit, offset: 0 },
        sort: [{ fieldName: 'firstPublishedDate', order: 'DESC' }],
      },
      fieldsets: ['URL'],
    },
  });
  return payload.posts || [];
}

async function queryBerlinTools() {
  const items = [];
  for (let offset = 0; offset < 500; offset += 100) {
    const payload = await wixFetch('/wix-data/v2/items/query', {
      method: 'POST',
      body: {
        dataCollectionId: 'BerlinTools',
        query: { paging: { limit: 100, offset } },
      },
    });
    const batch = payload.dataItems || [];
    items.push(...batch);
    if (batch.length < 100) break;
  }
  return items.map((item) => ({ id: item.id || item.data?.id || item.data?._id || '', ...item.data }));
}

function samePostPath(value, slug) {
  if (!value) return false;
  const normalized = String(value).replace(/^https?:\/\/(?:www\.)?berlinwalk\.com/i, '').replace(/\/$/, '');
  return normalized === `/post/${slug}`;
}

function widgetFolderFromUrl(value) {
  try {
    const url = new URL(value);
    if (url.hostname !== 'fenerszymanski.github.io') return '';
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts[0] !== 'berlinwalk-widgets') return '';
    return parts[1] || '';
  } catch {
    return '';
  }
}

function liveTextFromRichContent(richContent) {
  return cleanText((richContent?.nodes || []).map(nodeText).filter(Boolean).join('\n'));
}

function summarizeRichContent(richContent, bodyText) {
  const allNodes = collectNodes(richContent);
  const topNodes = (richContent?.nodes || []).map((node, index) => ({
    index,
    id: node.id || '',
    type: node.type || '',
    headingLevel: node.headingData?.level ?? null,
    text: nodeText(node),
    urls: collectUrls(node),
  }));
  const imageNodes = allNodes.filter((node) => node.type === 'IMAGE');
  const htmlNodes = allNodes.filter((node) => node.type === 'HTML');
  const headingNodes = allNodes.filter((node) => node.type === 'HEADING');
  const collapsibleNodes = allNodes.filter((node) => node.type === 'COLLAPSIBLE_LIST');
  const paragraphNodes = allNodes.filter((node) => node.type === 'PARAGRAPH');
  const embeddedUrls = [...new Set(htmlNodes.flatMap(collectUrls))].sort();
  const missingAltImages = imageNodes
    .map((node) => ({ id: node.id || '', alt: cleanText(node.imageData?.altText || node.imageData?.image?.altText || '') }))
    .filter((image) => !image.alt);
  const placeholders = [...new Set((bodyText.match(/\{\{[^}]+\}\}/g) || []))];
  const internalLeaks = INTERNAL_LEAKS.filter((phrase) => bodyText.toLowerCase().includes(phrase.toLowerCase()));
  const genericPhrases = GENERIC_PHRASES.filter((phrase) => bodyText.toLowerCase().includes(phrase));
  const voice = {
    firstPersonSingular: countMatches(bodyText, /\b(?:I|my|me)\b/gi),
    collectiveWe: countMatches(bodyText, /\bwe\b/gi),
    collectiveOur: countMatches(bodyText, /\bour\b/gi),
    collectiveUs: countMatches(bodyText, /\bus\b/gi),
    emDash: countMatches(bodyText, /—/g),
    badDuration: countMatches(bodyText, /\b1h\s*45m\b|1\s*h(?:our)?\s*45\s*m(?:in(?:ute)?s?)?/gi),
  };
  return {
    wordCount: countWords(bodyText),
    topLevelNodeCount: richContent?.nodes?.length || 0,
    allNodeCount: allNodes.length,
    paragraphCount: paragraphNodes.length,
    headingCount: headingNodes.length,
    bodyH1Count: headingNodes.filter((node) => node.headingData?.level === 1).length,
    imageCount: imageNodes.length,
    missingAltImages,
    htmlEmbedCount: htmlNodes.length,
    embeddedUrls,
    collapsibleListCount: collapsibleNodes.length,
    placeholders,
    internalLeaks,
    genericPhrases,
    voice,
    topNodes,
  };
}

function sentenceInventory(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map(cleanText)
    .filter((sentence) => countWords(sentence) >= 7);
}

function ngrams(text, size = 5) {
  const words = (text.toLowerCase().match(/[a-z0-9'’-]+/g) || [])
    .map((word) => word.replace(/[’]/g, "'"));
  const result = new Set();
  for (let i = 0; i <= words.length - size; i += 1) result.add(words.slice(i, i + size).join(' '));
  return result;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const rawDir = path.join(args.outDir, 'raw');
  const bodyDir = path.join(args.outDir, 'bodies');
  await fs.mkdir(rawDir, { recursive: true });
  await fs.mkdir(bodyDir, { recursive: true });

  const [latest, berlinTools, bodyFiles, toolsHubRaw, blogIndexRaw] = await Promise.all([
    queryLatestPublished(args.limit),
    queryBerlinTools(),
    findBodyFiles(),
    fs.readFile(path.join(REPO_ROOT, 'tools-hub', 'data.json'), 'utf8'),
    fs.readFile(path.join(REPO_ROOT, 'blog-index', 'data.json'), 'utf8'),
  ]);
  const toolsHub = JSON.parse(toolsHubRaw).tools || [];
  const blogIndex = JSON.parse(blogIndexRaw).allPosts || [];
  const blogIndexBySlug = new Map(blogIndex.map((post) => [post.slug, post]));

  const results = [];
  for (let index = 0; index < latest.length; index += 1) {
    const listed = latest[index];
    const id = listed.id || listed.draftPostId;
    const [publishedPayload, draftPayload] = await Promise.all([
      wixFetch(`/blog/v3/posts/${encodeURIComponent(id)}?fieldsets=RICH_CONTENT`),
      wixFetch(`/blog/v3/draft-posts/${encodeURIComponent(id)}?fieldsets=RICH_CONTENT`),
    ]);
    const published = publishedPayload.post || publishedPayload;
    const draft = draftPayload.draftPost || draftPayload;
    const slug = published.slug || published.seoSlug || listed.slug;
    const richContent = published.richContent || draft.richContent || { nodes: [] };
    const bodyText = liveTextFromRichContent(richContent);
    const richSummary = summarizeRichContent(richContent, bodyText);
    const sourcePath = bodyFiles.get(slug) || '';
    const sourceMarkdown = sourcePath ? await fs.readFile(sourcePath, 'utf8') : '';
    const sourcePlain = markdownToPlain(sourceMarkdown);
    const postPath = `/post/${slug}`;
    const cmsMatches = berlinTools.filter((tool) =>
      samePostPath(tool.relatedBlogPath, slug) || samePostPath(tool.relatedBlogUrl, slug));
    const embeddedFolders = [...new Set(richSummary.embeddedUrls.map(widgetFolderFromUrl).filter(Boolean))];
    const embeddedToolMatches = toolsHub.filter((tool) => {
      const folder = widgetFolderFromUrl(tool.widgetUrl || '');
      return folder && embeddedFolders.includes(folder);
    });
    const indexToolSlug = blogIndexBySlug.get(slug)?.relatedToolSlug || '';
    const cmsToolSlugs = [...new Set(cmsMatches.map((tool) => tool.slug).filter(Boolean))];
    const embeddedToolSlugs = [...new Set(embeddedToolMatches.map((tool) => tool.slug).filter(Boolean))];
    const likelyToolSlugs = [...new Set([...cmsToolSlugs, ...embeddedToolSlugs])];

    await fs.writeFile(path.join(rawDir, `${slug}.published.json`), `${JSON.stringify(publishedPayload, null, 2)}\n`);
    await fs.writeFile(path.join(rawDir, `${slug}.draft.json`), `${JSON.stringify(draftPayload, null, 2)}\n`);
    await fs.writeFile(path.join(bodyDir, `${slug}.txt`), `${bodyText}\n`);

    results.push({
      order: index + 1,
      id,
      slug,
      title: published.title || listed.title,
      firstPublishedDate: published.firstPublishedDate || listed.firstPublishedDate || '',
      lastPublishedDate: published.lastPublishedDate || listed.lastPublishedDate || '',
      status: draft.status || published.status || 'PUBLISHED',
      hasUnpublishedChanges: draft.hasUnpublishedChanges ?? null,
      canonicalUrl: published.url?.url || `https://www.berlinwalk.com${postPath}`,
      sourcePath: sourcePath ? path.relative(REPO_ROOT, sourcePath) : '',
      sourceWordCount: countWords(sourcePlain),
      sourceLiveWordDelta: countWords(sourcePlain) - richSummary.wordCount,
      publishedRichContentSha256: sha256(richContent),
      draftRichContentSha256: sha256(draft.richContent || {}),
      richContentParity: sha256(richContent) === sha256(draft.richContent || {}),
      ...richSummary,
      toolBinding: {
        cmsToolSlugs,
        embeddedToolSlugs,
        likelyToolSlugs,
        embeddedFolders,
        blogIndexRelatedToolSlug: indexToolSlug,
        indexMatchesLikelyTool: likelyToolSlugs.length === 0 ? !indexToolSlug : likelyToolSlugs.includes(indexToolSlug),
        cmsItems: cmsMatches.map((tool) => ({
          id: tool.id,
          slug: tool.slug || '',
          title: tool.title || tool.h1 || '',
          widgetUrl: tool.widgetUrl || '',
          relatedBlogPath: tool.relatedBlogPath || '',
          relatedBlogUrl: tool.relatedBlogUrl || '',
        })),
      },
    });
  }

  const sentenceMap = new Map();
  const ngramMap = new Map();
  for (const result of results) {
    const text = await fs.readFile(path.join(bodyDir, `${result.slug}.txt`), 'utf8');
    for (const sentence of sentenceInventory(text)) {
      const key = sentence.toLowerCase();
      const entry = sentenceMap.get(key) || { sentence, slugs: [] };
      entry.slugs.push(result.slug);
      sentenceMap.set(key, entry);
    }
    for (const phrase of ngrams(text, 5)) {
      const slugs = ngramMap.get(phrase) || [];
      slugs.push(result.slug);
      ngramMap.set(phrase, slugs);
    }
  }
  const repeatedSentences = [...sentenceMap.values()]
    .filter((entry) => new Set(entry.slugs).size >= 2)
    .map((entry) => ({ ...entry, slugs: [...new Set(entry.slugs)] }))
    .sort((a, b) => b.slugs.length - a.slugs.length || a.sentence.localeCompare(b.sentence));
  const repeatedFiveGrams = [...ngramMap.entries()]
    .filter(([, slugs]) => new Set(slugs).size >= 4)
    .map(([phrase, slugs]) => ({ phrase, slugs: [...new Set(slugs)] }))
    .sort((a, b) => b.slugs.length - a.slugs.length || a.phrase.localeCompare(b.phrase));

  const output = {
    schemaVersion: 'berlinwalk-last20-blog-quality-audit-1.0',
    generatedAt: new Date().toISOString(),
    mutationPerformed: false,
    siteId: SITE_ID,
    limit: args.limit,
    repoCommit: '',
    results,
    corpus: { repeatedSentences, repeatedFiveGrams },
  };
  await fs.writeFile(path.join(args.outDir, 'inventory.json'), `${JSON.stringify(output, null, 2)}\n`);

  const lines = [
    '# BerlinWalk last 20 blog packages — mechanical inventory',
    '',
    `Generated: ${output.generatedAt}`,
    '',
    'This is a read-only mechanical inventory. Editorial and visual judgment is recorded separately.',
    '',
    '| # | Post | Words | Images | HTML embeds | H1 | leaks/placeholders | voice flags | likely tool | index tool | binding |',
    '|---:|---|---:|---:|---:|---:|---|---|---|---|---|',
  ];
  for (const result of results) {
    const leaks = [...result.internalLeaks, ...result.placeholders].join(', ') || 'none';
    const voiceFlags = [
      result.voice.collectiveWe ? `we=${result.voice.collectiveWe}` : '',
      result.voice.collectiveOur ? `our=${result.voice.collectiveOur}` : '',
      result.voice.collectiveUs ? `us=${result.voice.collectiveUs}` : '',
      result.voice.emDash ? `em-dash=${result.voice.emDash}` : '',
      result.voice.badDuration ? `bad-duration=${result.voice.badDuration}` : '',
    ].filter(Boolean).join(', ') || 'none';
    lines.push(`| ${result.order} | ${result.slug} | ${result.wordCount} | ${result.imageCount} | ${result.htmlEmbedCount} | ${result.bodyH1Count} | ${leaks} | ${voiceFlags} | ${result.toolBinding.likelyToolSlugs.join(', ') || 'none'} | ${result.toolBinding.blogIndexRelatedToolSlug || 'none'} | ${result.toolBinding.indexMatchesLikelyTool ? 'PASS' : 'FAIL'} |`);
  }
  lines.push('', `Repeated exact sentences across posts: ${repeatedSentences.length}`, `Five-word phrases present in 4+ posts: ${repeatedFiveGrams.length}`, '');
  await fs.writeFile(path.join(args.outDir, 'mechanical-report.md'), `${lines.join('\n')}\n`);

  console.log(JSON.stringify({
    ok: true,
    mutationPerformed: false,
    outDir: args.outDir,
    posts: results.length,
    bindingFailures: results.filter((result) => !result.toolBinding.indexMatchesLikelyTool).map((result) => result.slug),
    placeholders: results.filter((result) => result.placeholders.length).map((result) => ({ slug: result.slug, placeholders: result.placeholders })),
    internalLeaks: results.filter((result) => result.internalLeaks.length).map((result) => ({ slug: result.slug, internalLeaks: result.internalLeaks })),
  }, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error.message, mutationPerformed: false }, null, 2));
  process.exitCode = 1;
});
