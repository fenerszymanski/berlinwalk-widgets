#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const API_ROOT = 'https://www.wixapis.com';
const DEFAULT_SITE_ID = '12ee5ea0-70a7-492f-8020-ffb27cbb630f';
const BLOG_BASE = 'https://www.berlinwalk.com';
const BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';

const CATEGORY_FALLBACKS = {
  '6da64e22-3360-42ec-a558-e906e4deeb19': { label: 'Tourist Tips', slug: 'tourist-tips' },
  'f9b304de-4490-4535-b9e9-64b8f2ff63b0': { label: 'Tour Route', slug: 'tour-route' },
  '97df9d0a-4e2e-49fc-bbc8-12f48f5bf671': { label: 'Berlin Myths', slug: 'berlin-myths' },
  'af526c68-60e5-4783-a31b-4e215760626f': { label: 'Before & After', slug: 'before-after' },
  'bf46ccbb-3db8-499a-95fe-4623868d6e1a': { label: 'German Language', slug: 'german-language' },
  '5f58da11-347d-43f0-b3c3-2cb1cdeb7a79': { label: 'Berlin History', slug: 'berlin-history' },
};

const TOPICS = [
  {
    key: 'first-day',
    label: 'First Day in Berlin',
    navLabel: 'First day',
    kicker: 'Start here',
    description: 'Airport, luggage, tickets, toilets, Sunday rules, and the small practical decisions that shape the first 24 hours.',
    slugs: [
      'berlin-first-time-visitor-mistakes-12-things-to-know-before-you-go',
      'how-to-get-from-berlin-airport-to-alexanderplatz-the-easy-way',
      'luggage-storage-in-berlin-2026',
      'public-toilets-in-berlin',
      'are-shops-open-on-sunday-in-berlin',
      'berlin-public-transport-explained-for-tourists-u-bahn-s-bahn-tram-bus',
    ],
    match: /(first-time|airport|alexanderplatz|luggage|toilet|sunday|transport|ticket|welcome|tap water|drinking water|safe|cash|credit card)/i,
  },
  {
    key: 'practical',
    label: 'Practical Berlin',
    navLabel: 'Practical',
    kicker: 'Useful now',
    description: 'Clear answers for transport, money, luggage, safety, weather, and planning decisions visitors actually search for.',
    slugs: [
      'berlin-public-transport-explained-for-tourists-u-bahn-s-bahn-tram-bus',
      'is-berlin-expensive-a-realistic-daily-budget-for-2026-tourists',
      'is-berlin-safe-to-visit-an-honest-2026-guide',
      'can-you-use-credit-cards-in-berlin-a-tourist-s-guide-to-paying-in-germany',
      'where-to-stay-in-berlin-best-neighborhoods-for-every-type-of-tourist',
      'average-temperature-in-berlin-by-month-a-complete-climate-guide',
    ],
    match: /(budget|expensive|safe|credit|cash|where to stay|temperature|weather|transport|welcome|ticket|tip|packing)/i,
  },
  {
    key: 'free-budget',
    label: 'Free & Budget',
    navLabel: 'Free',
    kicker: 'Save smart',
    description: 'Free museums, low-cost sightseeing, budget logic, and places that feel worth your time without draining the trip.',
    slugs: [
      'free-things-to-do-in-berlin-2026',
      'which-berlin-museums-are-free-2026',
      'how-to-visit-the-reichstag-dome-for-free-and-why-you-should-book-now',
      'bus-100-berlin-the-4-sightseeing-tour-locals-don-t-want-you-to-know-about',
      'the-myth-of-cheap-berlin-what-changed-and-why-it-still-matters-for-tourists',
      'is-museum-island-free-tickets-prices-and-what-to-actually-skip',
    ],
    match: /(free|budget|cheap|save|museum pass|welcomecard|single tickets|bus 100|reichstag)/i,
  },
  {
    key: 'route-stories',
    label: 'Tour Route Stories',
    navLabel: 'Route',
    kicker: 'Walk the core',
    description: 'The places around the BerlinWalk route, explained as story layers rather than postcard stops.',
    slugs: [
      '12-stops-through-berlin-s-ancient-core-what-you-ll-see-on-our-free-walking-tour',
      'why-our-tour-starts-at-alexanderplatz-and-not-at-brandenburg-gate',
      'the-weltzeituhr-why-alexanderplatz-has-a-world-clock',
      '7-things-most-tourists-dont-know-about-the-berliner-dom',
      'humboldt-forum-berlin-free-entry-big-controversy-is-it-worth-visiting',
      'hackescher-markt-where-our-tour-ends-and-your-berlin-adventure-begins',
    ],
    match: /(tour|route|alexanderplatz|world clock|weltzeituhr|berliner dom|humboldt|museum island|hackescher|lustgarten|rotes rathaus|marx|engels|neptune|spree)/i,
  },
  {
    key: 'history-myths',
    label: 'Berlin History & Myths',
    navLabel: 'History',
    kicker: 'Context',
    description: 'Berlin history, myths, before-and-after stories, and the background that makes the city click.',
    slugs: [
      'where-was-the-berlin-wall-interactive-map',
      'the-ampelmann-how-a-traffic-light-became-berlin-s-most-beloved-symbol',
      'alexanderplatz-then-and-now-from-medieval-market-to-modern-chaos',
      'why-berlin-doesn-t-have-a-beautiful-old-town-and-why-that-s-the-point',
      'how-berlin-was-divided-a-simple-guide-to-east-vs-west',
      'did-jfk-really-call-himself-a-jelly-donut-the-ich-bin-ein-berliner-myth',
    ],
    match: /(history|myth|wall|cold war|gdr|east|west|before|after|then|now|wwii|nazi|prussia|ampelmann|jfk|old town|rebuilt)/i,
  },
  {
    key: 'food-nightlife',
    label: 'Food & Nightlife',
    navLabel: 'Food',
    kicker: 'After the walk',
    description: 'Food, coffee, currywurst, clubs, and the useful bits of Berlin culture around eating and going out.',
    slugs: [
      'best-currywurst-places-in-berlin-2026',
      'what-to-eat-in-berlin-12-must-try-local-foods',
      '5-best-döner-kebab-spots-in-berlin-you-need-to-try-in-2026',
      'where-to-eat-near-alexanderplatz-without-getting-ripped-off',
      '5-best-coffee-shops-near-hackescher-markt-a-local-s-guide',
      'what-to-wear-to-berlin-clubs',
    ],
    match: /(food|eat|currywurst|döner|doner|coffee|club|nightlife|menu|tip in berlin|restaurants?)/i,
  },
  {
    key: 'when-to-visit',
    label: 'Month-by-Month Berlin',
    navLabel: 'Months',
    kicker: 'Timing',
    description: 'Weather, daylight, crowds, events, and what each season feels like on foot.',
    slugs: [
      'berlin-in-september-2026',
      'berlin-in-august-2026',
      'berlin-in-july-2026',
      'visiting-berlin-in-june',
      'what-s-the-best-time-to-visit-berlin-a-month-by-month-guide',
      'average-temperature-in-berlin-by-month-a-complete-climate-guide',
    ],
    match: /(january|february|march|april|may|june|july|august|september|october|november|december|month|weather|temperature|rain|summer|winter|spring|autumn|fall|best time)/i,
  },
];

const HERO_SLUGS = {
  lead: 'nikolaiviertel-rebuilt-old-town',
  secondary: [
    'berlin-first-time-visitor-mistakes-12-things-to-know-before-you-go',
    'public-toilets-in-berlin',
    'how-to-get-from-berlin-airport-to-alexanderplatz-the-easy-way',
  ],
};

const START_HERE_LINKS = [
  {
    title: 'Book the free walking tour',
    url: BOOKING_URL,
    type: 'Tour',
    summary: 'A 2 hours route from the World Clock at Alexanderplatz to near Hackescher Markt.',
  },
  {
    title: 'Meeting point guide',
    url: `${BLOG_BASE}/meeting-point`,
    type: 'Tour day',
    summary: 'Find the World Clock, arrival advice, map links, and what to look for.',
  },
  {
    title: 'Berlin tools',
    url: `${BLOG_BASE}/berlin-tools`,
    type: 'Tools',
    summary: 'Ticket, weather, luggage, toilet, safety, free-things, and first-day helpers.',
  },
];

const SPOTLIGHT_TOOLS = [
  {
    title: 'Berlin First-Day Planner',
    slug: 'berlin-first-day-planner',
    url: `${BLOG_BASE}/tools/berlin-first-day-planner`,
    summary: 'Build a realistic first-day plan around arrival time, luggage, weather, and the tour.',
  },
  {
    title: 'Berlin Public Toilet Finder',
    slug: 'berlin-public-toilets',
    url: `${BLOG_BASE}/tools/berlin-public-toilets`,
    summary: 'Find official toilets, free options, and accessible locations around the city.',
  },
  {
    title: 'Berlin Transport Ticket Calculator',
    slug: 'transport-ticket-calculator',
    url: `${BLOG_BASE}/tools/transport-ticket-calculator`,
    summary: 'Pick the cheapest ticket for the actual journeys you plan to take.',
  },
];

function parseArgs(argv) {
  const args = {
    siteId: process.env.WIX_SITE_ID || DEFAULT_SITE_ID,
    out: 'blog-index/data.json',
    limit: 100,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];
    if (arg === '--site-id') args.siteId = next, i += 1;
    else if (arg === '--out') args.out = next, i += 1;
    else if (arg === '--limit') args.limit = Number(next), i += 1;
    else if (arg === '--help' || arg === '-h') {
      console.log('Usage: source ../scripts/load-api-keys.sh && node scripts/generate-blog-index-data.mjs --out blog-index/data.json');
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!Number.isFinite(args.limit) || args.limit < 1) throw new Error('--limit must be positive');
  return args;
}

function authHeaders(siteId) {
  if (!process.env.WIX_API_KEY) {
    throw new Error('Missing WIX_API_KEY. From the repo root run: source ../scripts/load-api-keys.sh');
  }
  return {
    Authorization: process.env.WIX_API_KEY,
    'wix-site-id': siteId,
    'Content-Type': 'application/json',
  };
}

async function wixFetch(pathname, { method = 'GET', body, siteId }) {
  const response = await fetch(`${API_ROOT}${pathname}`, {
    method,
    headers: authHeaders(siteId),
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text.slice(0, 800) };
  }
  if (!response.ok) {
    const message = data?.message || data?.raw || text.slice(0, 800);
    throw new Error(`Wix ${method} ${pathname} failed (${response.status}): ${message}`);
  }
  return data;
}

async function getCategories(siteId) {
  try {
    const data = await wixFetch('/blog/v3/categories?fieldsets=URL&paging.limit=100', { siteId });
    const map = new Map();
    for (const category of data.categories || []) {
      map.set(category.id, {
        label: category.label || category.title || category.slug || 'Blog',
        slug: category.slug || category.url?.path?.split('/').filter(Boolean).pop() || '',
      });
    }
    return map;
  } catch {
    return new Map();
  }
}

async function getPosts(siteId, maxPosts) {
  const limit = Math.min(100, maxPosts);
  let offset = 0;
  const posts = [];

  while (posts.length < maxPosts) {
    const data = await wixFetch('/blog/v3/posts/query', {
      method: 'POST',
      siteId,
      body: {
        query: {
          paging: { limit, offset },
          sort: [{ fieldName: 'firstPublishedDate', order: 'DESC' }],
        },
        fieldsets: ['URL'],
      },
    });
    const batch = data.posts || [];
    posts.push(...batch);
    if (batch.length < limit) break;
    offset += batch.length;
  }

  return posts.slice(0, maxPosts);
}

function cleanText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function stripHtml(value) {
  return cleanText(String(value || '').replace(/<[^>]+>/g, ' '));
}

function categoryFor(post, categories) {
  const id = post.categoryIds?.[0];
  return categories.get(id) || CATEGORY_FALLBACKS[id] || { label: 'Berlin Guide', slug: 'berlin-guide' };
}

function imageUrl(image, width = 960, height = 640) {
  if (!image?.url) return '';
  if (!image.id) return image.url;
  const filename = encodeURIComponent(image.filename || `${image.id}.jpg`);
  return `https://static.wixstatic.com/media/${image.id}/v1/fill/w_${width},h_${height},fp_0.50_0.50,q_88,enc_avif,quality_auto/${filename}`;
}

function topicFor(post) {
  const haystack = `${post.title || ''} ${post.excerpt || ''} ${post.slug || ''}`;
  const explicit = TOPICS.find((topic) => topic.slugs.includes(post.slug));
  if (explicit) return explicit;
  return TOPICS.find((topic) => topic.match.test(haystack)) || TOPICS[1];
}

function relatedToolSlugFor(post) {
  const s = `${post.slug || ''} ${post.title || ''}`.toLowerCase();
  if (/(toilet)/.test(s)) return 'berlin-public-toilets';
  if (/(luggage|storage|suitcase)/.test(s)) return 'berlin-luggage-storage';
  if (/(drinking-water|tap-water|water fountain)/.test(s)) return 'berlin-drinking-water';
  if (/(airport|transport|ticket|validate|u-bahn|s-bahn|bus-100)/.test(s)) return 'transport-ticket-calculator';
  if (/(welcomecard)/.test(s)) return 'welcomecard-calculator';
  if (/(budget|expensive|cheap|credit|cash)/.test(s)) return 'berlin-daily-budget';
  if (/(first-time|3-days|itinerary)/.test(s)) return 'berlin-first-day-planner';
  if (/(weather|temperature|july|august|september|june|rain|pack|month)/.test(s)) return 'best-month-to-visit-berlin';
  if (/(free-things|free-museums|museum-island-free|reichstag)/.test(s)) return 'berlin-free-things-to-do';
  if (/(safe|safety|solo)/.test(s)) return 'berlin-safety';
  if (/(wall|east|west|cold-war)/.test(s)) return 'east-or-west-1989';
  if (/(lake)/.test(s)) return 'berlin-lakes';
  if (/(pool|swimming)/.test(s)) return 'berlin-pools';
  if (/(currywurst)/.test(s)) return 'berlin-currywurst-finder';
  if (/(club|nightlife|dress-code)/.test(s)) return 'berlin-club-picker';
  return '';
}

function normalizePost(post, categories) {
  const category = categoryFor(post, categories);
  const topic = topicFor(post);
  const image = post.media?.wixMedia?.image || post.coverMedia?.image || null;
  const path = post.url?.path || `/post/${post.slug}`;
  return {
    title: cleanText(post.title),
    slug: post.slug,
    path,
    url: `${BLOG_BASE}${path}`,
    excerpt: stripHtml(post.excerpt || post.description || ''),
    category: category.label,
    categorySlug: category.slug,
    topic: topic.key,
    topicLabel: topic.label,
    readTime: post.minutesToRead ? `${post.minutesToRead} min read` : '',
    publishedDate: post.firstPublishedDate || post.publishedDate || '',
    image: imageUrl(image, 980, 650),
    thumb: imageUrl(image, 520, 360),
    alt: cleanText(image?.altText || post.title),
    relatedToolSlug: relatedToolSlugFor(post),
  };
}

function bySlug(posts) {
  return new Map(posts.map((post) => [post.slug, post]));
}

function pickPosts(posts, slugs, fallbackTopic, count) {
  const map = bySlug(posts);
  const picked = [];
  const seen = new Set();
  for (const slug of slugs) {
    const post = map.get(slug);
    if (post && !seen.has(post.slug)) {
      picked.push(post);
      seen.add(post.slug);
    }
  }
  if (picked.length < count) {
    for (const post of posts) {
      if (post.topic === fallbackTopic && !seen.has(post.slug)) {
        picked.push(post);
        seen.add(post.slug);
      }
      if (picked.length >= count) break;
    }
  }
  return picked.slice(0, count);
}

function buildData(posts) {
  const map = bySlug(posts);
  const lead = map.get(HERO_SLUGS.lead) || posts[0];
  const secondary = pickPosts(posts, HERO_SLUGS.secondary, 'first-day', 3).filter((post) => post.slug !== lead.slug);

  return {
    updatedAt: new Date().toISOString(),
    source: 'Wix Blog API',
    totalPosts: posts.length,
    bookingUrl: BOOKING_URL,
    navTopics: TOPICS.map(({ key, label, navLabel }) => ({ key, label, navLabel })),
    hero: { lead, secondary: secondary.slice(0, 3) },
    startHere: START_HERE_LINKS,
    tools: SPOTLIGHT_TOOLS,
    shelves: TOPICS.map((topic) => ({
      key: topic.key,
      title: topic.label,
      navLabel: topic.navLabel,
      kicker: topic.kicker,
      description: topic.description,
      posts: pickPosts(posts, topic.slugs, topic.key, 6),
    })),
    latest: posts.slice(0, 12),
    allPosts: posts,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const repoRoot = path.resolve(__dirname, '..');
  const outPath = path.resolve(repoRoot, args.out);

  const [categories, rawPosts] = await Promise.all([
    getCategories(args.siteId),
    getPosts(args.siteId, args.limit),
  ]);
  const posts = rawPosts.map((post) => normalizePost(post, categories));
  const data = buildData(posts);

  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${path.relative(repoRoot, outPath)} with ${posts.length} posts`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
