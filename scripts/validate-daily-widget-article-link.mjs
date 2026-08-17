#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readAttribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'));
  return match ? match[2] : null;
}

function postSlugFromHref(href) {
  try {
    const url = new URL(href, 'https://www.berlinwalk.com');
    if (url.origin !== 'https://www.berlinwalk.com') return null;
    const match = url.pathname.match(/^\/post\/([^/]+)\/?$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export function validateDailyWidgetArticleLinks({ toolSlug, postSlug, rootDir = REPO_ROOT }) {
  assert(/^[a-z0-9-]+$/.test(toolSlug), 'toolSlug must be a lowercase slug');
  assert(/^[a-z0-9-]+$/.test(postSlug), 'postSlug must be a lowercase slug');

  const widgetPath = path.join(rootDir, toolSlug, 'index.html');
  assert(fs.existsSync(widgetPath), `Daily widget source is missing: ${widgetPath}`);
  const html = fs.readFileSync(widgetPath, 'utf8');
  const postLinks = [];

  for (const match of html.matchAll(/<a\b[^>]*>/gi)) {
    const tag = match[0];
    const href = readAttribute(tag, 'href');
    const linkedPostSlug = href ? postSlugFromHref(href) : null;
    if (!linkedPostSlug) continue;

    if (linkedPostSlug === postSlug) {
      throw new Error(
        `Daily widget ${toolSlug} links back to its embedded post ${postSlug}. The outer BerlinTools CMS related-blog card owns that reciprocal link.`,
      );
    }

    const target = readAttribute(tag, 'target');
    const rel = readAttribute(tag, 'rel') || '';
    assert(
      target === '_blank' && /(?:^|\s)noopener(?:\s|$)/i.test(rel),
      `Widget guide link ${href} must use target="_blank" rel="noopener" because Wix iframes cannot safely navigate the parent page.`,
    );
    postLinks.push(href);
  }

  return { widgetPath, postLinks };
}

function parseArgs(argv) {
  const result = { rootDir: REPO_ROOT };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const value = argv[index + 1];
    if (arg === '--tool-slug') result.toolSlug = value, index += 1;
    else if (arg === '--post-slug') result.postSlug = value, index += 1;
    else if (arg === '--root') result.rootDir = path.resolve(value), index += 1;
    else if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/validate-daily-widget-article-link.mjs --tool-slug <tool> --post-slug <post>');
      process.exit(0);
    } else throw new Error(`Unknown argument: ${arg}`);
  }
  assert(result.toolSlug, 'Missing --tool-slug');
  assert(result.postSlug, 'Missing --post-slug');
  return result;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = validateDailyWidgetArticleLinks(parseArgs(process.argv.slice(2)));
  console.log(`PASS ${path.relative(REPO_ROOT, result.widgetPath)} (${result.postLinks.length} outward guide link${result.postLinks.length === 1 ? '' : 's'})`);
}
