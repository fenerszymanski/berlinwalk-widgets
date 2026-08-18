#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

const INJECTOR_START = 'var CONTENT_UPGRADE_MAGNETS = [';
const INJECTOR_END = '\n  function contentUpgradeMagnetForSlug';

// These are pre-existing Phase 1 aliases that remain in the injector for old
// direct URLs, although the current generated blog index no longer lists them.
// New daily bindings are never allowed to join this exception set.
export const PREEXISTING_LEGACY_MAGNET_SLUGS = Object.freeze([
  'is-the-ddr-museum-worth-it-tickets-queues-and-what-to-expect-in-2026',
  'victory-column-berlin-view-tickets-and-climb-tips',
  'museum-pass',
  'welcomecard',
  'berlin-before-hotel-check-in-what-to-do-with-luggage-and-time',
  'berlin-ab-or-abc-ticket-which-zone-do-tourists-need',
  'airport-to-alex',
  'berlin-deutschlandticket-tourists',
  'potsdam-from-berlin-train-tickets-and-sanssouci-day-trip-plan',
]);

// Keep this list aligned with the history experiment's protected rollout
// slugs. The content-upgrade injector must never own any of them.
export const HISTORY_PROTECTED_SLUGS = Object.freeze([
  'why-berlin-doesn-t-have-a-beautiful-old-town-and-why-that-s-the-point',
  'why-berlin-s-streets-are-so-wide-it-wasn-t-always-the-plan',
  'where-was-the-berlin-wall-interactive-map',
  'the-ampelmann-how-a-traffic-light-became-berlin-s-most-beloved-symbol',
  'unter-den-linden-berlin',
  'why-is-berlin-founding-year-1237',
  'alexanderplatz-then-and-now-from-medieval-market-to-modern-chaos',
]);

const NO_MAGNET_CATEGORY_SLUGS = new Set([
  'tour-route',
  'berlin-myths',
  'before-after',
  'berlin-history',
]);

const NO_MAGNET_TOPIC_LABELS = new Set([
  'tour route stories',
  'berlin history and myths',
]);

const MAGNET_IDS = Object.freeze({
  tripPlanning: 'berlin-skip-list',
  paidAttractions: 'berlin-pass-decision-sheet',
  arrival: 'berlin-arrival-card',
  dayTrip: 'berlin-day-trip-compare-sheet',
  german: 'berlin-german-cheat-card',
  food: 'berlin-food-decision-card',
  neighborhood: 'berlin-neighborhood-matcher',
  unwrittenRules: 'berlin-unwritten-rules-card',
  month: 'berlin-month-planner-card',
});

const RULES = Object.freeze({
  tripPlanning: 'trip-planning',
  paidAttractions: 'paid-attractions',
  arrival: 'arrival-logistics',
  dayTrip: 'day-trip',
  german: 'german-language',
  food: 'food-nightlife',
  neighborhood: 'neighborhood',
  unwrittenRules: 'unwritten-rules',
  month: 'month-planning',
  route: 'no-magnet-tour-route',
  event: 'no-magnet-2026-event',
  history: 'no-magnet-history',
  unmapped: 'no-magnet-unmapped',
});

const EVENT_RE = /(?:berlin\s+)?(?:pride|csd|marathon|world cup|fiba|basketball world cup|football match|festival|art week|musikfest|literature festival|long night of museums|rave the planet|open monument day|innotrans|ifa|oktoberfest|christmas markets?)/i;
const HISTORY_TEXT_RE = /(?:\bhistory\b|historical|memorial|monument|then and now|before and after|berlin wall|cold war|gdr|nazi|prussia|ampelmann|old town|rebuilt|cathedral|church)/i;
const TRIP_PLANNING_RE = /(?:itinerary|\b\d+\s*days?\b|how many days|first[- ]time|weekend|one day|day plan|with (?:kids|parents)|travell?ing alone|solo travel|trip plan|plan your berlin)/i;
const DAY_TRIP_RE = /(?:day trip|outside berlin|from berlin to|potsdam|hamburg|leipzig|dresden|spreewald|wannsee|baltic sea|tropical islands)/i;
const NEIGHBORHOOD_RE = /(?:neighbou?rhood|where to stay|district|borough|kiez|area to stay|city west|kreuzberg|neuk[oö]lln|friedrichshain|prenzlauer|sch[oö]neberg|kurf[uü]rstendamm|nikolaiviertel)/i;
const FOOD_RE = /(?:food|eat|restaurant|bakery|breakfast|brunch|coffee|currywurst|d[oö]ner|vegan|halal|bar|club|nightlife|beer|drink|sp[aä]ti|menu|christmas markets?)/i;
const GERMAN_RE = /(?:\bgerman\b|language|phrase|phrases|signs?|speak german|pronounc|translation|words? every tourist|halb acht|entschuldigung|schadenfreude|feierabend|berliner schnauze)/i;
const RULES_RE = /(?:etiquette|unwritten rules?|jaywalk|tipp(?:ing)?|pfand|deposit|cash|credit card|money|tax|fine|smok(?:e|ing)|public drinking|shop closures?|shops? open|validate your ticket|tourist scams?|practical rules?)/i;
const ARRIVAL_RE = /(?:airport|arrival|landing|station|hauptbahnhof|train station|transport|u[- ]?bahn|s[- ]?bahn|tram|bus|ticket zone|zone|deutschlandticket|luggage|layover|late[- ]night transport|first day|taxi|uber|ride app)/i;
const PAID_ATTRACTION_RE = /(?:museum|museum island|pass|welcome ?card|city tour card|paid attraction|admission|entry|tickets?|dome|tower|palace|gallery|spy museum|what to book in advance)/i;
const MONTH_RE = /(?:january|february|march|april|may|june|july|august|september|october|november|december|month|weather|temperature|rain|summer|winter|spring|autumn|fall|best time to visit|when to visit|daylight|season)/i;

function normalizeText(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeCategorySlug(value) {
  return normalizeText(value).replace(/\s+/g, '-');
}

function postText(post) {
  return normalizeText([post.slug, post.title].filter(Boolean).join(' '));
}

function postTopic(post) {
  return normalizeText(post.topicLabel || post.topic || '');
}

function postCategorySlug(post) {
  return normalizeCategorySlug(post.categorySlug || post.category || '');
}

function result(assetId, rule) {
  return Object.freeze({ assetId, rule });
}

/**
 * Resolve only the newly published post. Unclear subjects deliberately return
 * no magnet so a booking card remains the safe fallback.
 */
export function classifyDailyBlogPost(post) {
  if (!post || !post.slug) throw new Error('daily magnet binding requires a post slug');

  const slug = String(post.slug);
  const text = postText(post);
  const topic = postTopic(post);
  const categorySlug = postCategorySlug(post);
  const monthContext = topic === 'month by month berlin' && !TRIP_PLANNING_RE.test(text);

  if (HISTORY_PROTECTED_SLUGS.includes(slug)) return result(null, RULES.history);
  if (NO_MAGNET_CATEGORY_SLUGS.has(categorySlug)) return result(null, RULES.history);

  // A month guide may mention a dated festival or Christmas markets as part
  // of its calendar context. The Month Planner still owns that guide; a post
  // whose subject is the dated event itself is handled by EVENT_RE below.
  if (EVENT_RE.test(text) && /\b2026\b/i.test(text) && !monthContext) {
    return result(null, RULES.event);
  }

  // German Language is a specialist category, but practical-rule terms such
  // as Pfand still belong to Unwritten Rules and food-topic phrases belong to
  // the Food card.
  if (categorySlug === 'german-language' && !RULES_RE.test(text)) {
    return result(MAGNET_IDS.german, RULES.german);
  }

  if (monthContext) {
    return result(MAGNET_IDS.month, RULES.month);
  }

  // These are explicit specialist categories/signals. They take precedence
  // over a broad topic label such as “Tour Route Stories”.
  if (topic === 'food and nightlife') return result(MAGNET_IDS.food, RULES.food);
  if (GERMAN_RE.test(text)) return result(MAGNET_IDS.german, RULES.german);
  if (TRIP_PLANNING_RE.test(text)) return result(MAGNET_IDS.tripPlanning, RULES.tripPlanning);

  if (NO_MAGNET_TOPIC_LABELS.has(topic)) {
    return result(null, topic === 'tour route stories' ? RULES.route : RULES.history);
  }
  if (HISTORY_TEXT_RE.test(text)) return result(null, RULES.history);

  if (FOOD_RE.test(text)) return result(MAGNET_IDS.food, RULES.food);
  if (NEIGHBORHOOD_RE.test(text)) return result(MAGNET_IDS.neighborhood, RULES.neighborhood);
  if (DAY_TRIP_RE.test(text)) return result(MAGNET_IDS.dayTrip, RULES.dayTrip);
  if (RULES_RE.test(text)) return result(MAGNET_IDS.unwrittenRules, RULES.unwrittenRules);
  if (ARRIVAL_RE.test(text)) return result(MAGNET_IDS.arrival, RULES.arrival);
  if (PAID_ATTRACTION_RE.test(text)) return result(MAGNET_IDS.paidAttractions, RULES.paidAttractions);
  if (MONTH_RE.test(text)) return result(MAGNET_IDS.month, RULES.month);

  if (topic === 'first day in berlin') return result(MAGNET_IDS.tripPlanning, RULES.tripPlanning);
  return result(null, RULES.unmapped);
}

function injectorRegion(source) {
  const start = source.indexOf(INJECTOR_START);
  const end = source.indexOf(INJECTOR_END, start);
  if (start === -1 || end === -1) throw new Error('CONTENT_UPGRADE_MAGNETS block not found');
  return { start, end, source: source.slice(start, end) };
}

/** Read the public injector config without executing browser code. */
export function readMagnetSlugLists(injectorSource) {
  const { source } = injectorRegion(injectorSource);
  const configs = [];
  const configRe = /assetId:\s*'([^']+)'[\s\S]*?slugs:\s*\[([\s\S]*?)\]/g;
  let match;
  while ((match = configRe.exec(source))) {
    configs.push({
      assetId: match[1],
      slugs: [...match[2].matchAll(/'([^']+)'/g)].map((item) => item[1]),
    });
  }
  if (!configs.length) throw new Error('no magnet slug lists found');
  return configs;
}

function blogIndexSlugs(blogIndex) {
  if (!blogIndex || !Array.isArray(blogIndex.allPosts)) {
    throw new Error('blog-index/data.json must contain allPosts');
  }
  return new Set(blogIndex.allPosts.map((post) => String(post.slug || '')).filter(Boolean));
}

export function assertPostInBlogIndex(blogIndex, slug) {
  if (!blogIndexSlugs(blogIndex).has(String(slug))) {
    throw new Error(`daily magnet post slug is not in blog-index/data.json: ${slug}`);
  }
}

export function assertMagnetListInvariants({ injectorSource, blogIndex, addedSlugs = [] }) {
  const configs = readMagnetSlugLists(injectorSource);
  const owners = new Map();
  const history = new Set(HISTORY_PROTECTED_SLUGS);
  for (const config of configs) {
    for (const slug of config.slugs) {
      if (owners.has(slug)) {
        throw new Error(`lead magnet slug collision: ${slug}`);
      }
      owners.set(slug, config.assetId);
      if (history.has(slug)) {
        throw new Error(`history slug is assigned to a content-upgrade magnet: ${slug}`);
      }
    }
  }

  const indexSlugs = blogIndex ? blogIndexSlugs(blogIndex) : null;
  const missing = indexSlugs
    ? [...owners.keys()].filter((slug) => !indexSlugs.has(slug))
    : [];
  const unexpectedMissing = missing.filter((slug) => !PREEXISTING_LEGACY_MAGNET_SLUGS.includes(slug));
  if (unexpectedMissing.length) {
    throw new Error(`magnet slug missing from blog-index/data.json: ${unexpectedMissing.join(', ')}`);
  }

  for (const slug of addedSlugs) assertPostInBlogIndex(blogIndex, slug);
  return { configs, owners, missingLegacySlugs: missing };
}

function listBounds(source, assetId) {
  const { start, end } = injectorRegion(source);
  const marker = `assetId: '${assetId}'`;
  const assetStart = source.indexOf(marker, start);
  if (assetStart === -1 || assetStart >= end) throw new Error(`magnet assetId not found: ${assetId}`);
  const open = source.indexOf('[', source.indexOf('slugs:', assetStart));
  const close = source.indexOf(']', open);
  if (open === -1 || close === -1 || close >= end) throw new Error(`slugs list not found: ${assetId}`);
  return { open, close };
}

function appendSlugToInjectorSource(injectorSource, assetId, slug) {
  const { open, close } = listBounds(injectorSource, assetId);
  const closeLineStart = injectorSource.lastIndexOf('\n', close) + 1;
  const body = injectorSource.slice(open + 1, closeLineStart).trim();
  const firstItemMatch = injectorSource.slice(open + 1, closeLineStart).match(/\n([ \t]+)'/);
  const itemIndent = firstItemMatch ? firstItemMatch[1] : '      ';
  let prefix = injectorSource.slice(0, closeLineStart);

  if (body) {
    let last = prefix.length - 1;
    while (last >= 0 && /\s/.test(prefix[last])) last -= 1;
    if (prefix[last] !== ',') prefix = `${prefix.slice(0, last + 1)},${prefix.slice(last + 1)}`;
  }

  return `${prefix}${itemIndent}'${slug}',\n${injectorSource.slice(closeLineStart)}`;
}

export function bindDailyBlogPost({ injectorSource, blogIndex, post, dryRun = false }) {
  if (!post || !post.slug) throw new Error('daily magnet binding requires a post slug');
  const slug = String(post.slug);
  assertPostInBlogIndex(blogIndex, slug);

  const decision = classifyDailyBlogPost(post);
  const before = assertMagnetListInvariants({ injectorSource, blogIndex });
  const existingAssetId = before.owners.get(slug) || null;

  if (HISTORY_PROTECTED_SLUGS.includes(slug) && existingAssetId) {
    throw new Error(`history slug already collides with magnet ${existingAssetId}: ${slug}`);
  }
  if (existingAssetId) {
    if (decision.assetId && existingAssetId !== decision.assetId) {
      throw new Error(`lead magnet slug collision: ${slug} is already in ${existingAssetId}, expected ${decision.assetId}`);
    }
    return { changed: false, status: 'already-bound', slug, assetId: existingAssetId, rule: decision.rule, source: injectorSource };
  }
  if (!decision.assetId) {
    return { changed: false, status: 'no-magnet', slug, assetId: null, rule: decision.rule, source: injectorSource };
  }

  const nextSource = appendSlugToInjectorSource(injectorSource, decision.assetId, slug);
  assertMagnetListInvariants({ injectorSource: nextSource, blogIndex, addedSlugs: [slug] });
  return {
    changed: !dryRun,
    status: dryRun ? 'would-bind' : 'bound',
    slug,
    assetId: decision.assetId,
    rule: decision.rule,
    source: nextSource,
  };
}

function parseArgs(argv) {
  const args = { slug: '', blogIndex: 'blog-index/data.json', injector: 'js/lead-form-inject.js', dryRun: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--slug' || arg === '--post-slug') args.slug = argv[++index] || '';
    else if (arg === '--blog-index') args.blogIndex = argv[++index] || '';
    else if (arg === '--injector') args.injector = argv[++index] || '';
    else if (arg === '--dry-run') args.dryRun = true;
    else if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/auto-bind-daily-blog-magnet.mjs --slug <published-post-slug> [--dry-run]');
      process.exit(0);
    } else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!args.slug) throw new Error('--slug is required');
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const indexPath = path.resolve(args.blogIndex);
  const injectorPath = path.resolve(args.injector);
  const blogIndex = JSON.parse(await fs.readFile(indexPath, 'utf8'));
  const post = blogIndex.allPosts.find((item) => item.slug === args.slug);
  if (!post) throw new Error(`post slug not found in blog-index/data.json: ${args.slug}`);
  const injectorSource = await fs.readFile(injectorPath, 'utf8');
  const result = bindDailyBlogPost({ injectorSource, blogIndex, post, dryRun: args.dryRun });
  if (result.changed) await fs.writeFile(injectorPath, result.source);
  console.log(JSON.stringify({ status: result.status, slug: result.slug, assetId: result.assetId, rule: result.rule, changed: result.changed }));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
