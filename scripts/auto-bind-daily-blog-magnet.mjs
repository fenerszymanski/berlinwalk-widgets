#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/*
 * Daily magnet binding is retired. Every public blog post now receives the
 * global Date Check card and the compact tour booking card from
 * js/lead-form-inject.js. Keep these exports as a fail-closed compatibility
 * surface for old automation callers, but never recreate a slug-to-magnet map.
 */

export const GLOBAL_BLOG_CONTRACT = 'date-check-global-v1';
export const HISTORY_PROTECTED_SLUGS = Object.freeze([]);

function assertPost(post) {
  if (!post || !post.slug) throw new Error('daily binding requires a post slug');
  return String(post.slug);
}

function assertIndexed(blogIndex, slug) {
  if (!blogIndex || !Array.isArray(blogIndex.allPosts)) return;
  if (!blogIndex.allPosts.some((post) => String(post.slug || '') === slug)) {
    throw new Error(`blog post is not in blog-index/data.json: ${slug}`);
  }
}

export function classifyDailyBlogPost(post) {
  const slug = assertPost(post);
  return Object.freeze({ assetId: null, rule: 'global-date-check', slug });
}

export function readMagnetSlugLists(injectorSource) {
  if (typeof injectorSource !== 'string') throw new Error('injector source must be text');
  if (/CONTENT_UPGRADE_MAGNETS|bw-history-lead-magnet|bw-content-upgrade-card|bw-date-check-teaser/.test(injectorSource)) {
    throw new Error('retired blog magnet surface found in injector');
  }
  return [];
}

export function assertPostInBlogIndex(blogIndex, slug) {
  assertIndexed(blogIndex, String(slug || ''));
}

export function assertMagnetListInvariants({ injectorSource, blogIndex, addedSlugs = [] }) {
  const configs = readMagnetSlugLists(injectorSource);
  const owners = new Map();
  for (const slug of addedSlugs) assertIndexed(blogIndex, String(slug));
  return { configs, owners, missingLegacySlugs: [] };
}

export function bindDailyBlogPost({ injectorSource, blogIndex, post }) {
  const slug = assertPost(post);
  assertIndexed(blogIndex, slug);
  assertMagnetListInvariants({ injectorSource, blogIndex });
  const decision = classifyDailyBlogPost(post);
  return {
    changed: false,
    status: 'retired',
    slug,
    assetId: null,
    rule: decision.rule,
    source: injectorSource,
  };
}

function parseArgs(argv) {
  const args = { slug: '', help: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--slug' || arg === '--post-slug') args.slug = argv[++index] || '';
    else if (arg === '--dry-run') continue;
    else if (arg === '--help' || arg === '-h') args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log('Daily magnet binding is retired. Every indexed blog post receives the global Date Check and tour-calendar surfaces automatically.');
    return;
  }
  if (!args.slug) throw new Error('--slug is required so the global contract can verify the published post index');
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const [injectorSource, blogIndexSource] = await Promise.all([
    readFile(path.join(root, 'js', 'lead-form-inject.js'), 'utf8'),
    readFile(path.join(root, 'blog-index', 'data.json'), 'utf8'),
  ]);
  const blogIndex = JSON.parse(blogIndexSource);
  const post = blogIndex.allPosts.find((item) => String(item?.slug || '') === args.slug);
  if (!post) throw new Error(`blog post is not in blog-index/data.json: ${args.slug}`);
  const result = bindDailyBlogPost({ injectorSource, blogIndex, post });
  console.log(JSON.stringify({ contract: GLOBAL_BLOG_CONTRACT, ...result, source: undefined }, null, 2));
}

const isMain = Boolean(process.argv[1]) && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
