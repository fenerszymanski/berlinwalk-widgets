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
      'what-is-a-spati-berlin',
      'berlin-public-transport-explained-for-tourists-u-bahn-s-bahn-tram-bus',
      'grocery-shopping-in-berlin',
      'lost-property-berlin',
      'doctor-in-berlin',
      'drink-alcohol-in-public-berlin',
    ],
    match: /(first-time|airport|alexanderplatz|luggage|lost property|lost phone|lost wallet|lost passport|toilet|sunday|späti|spaeti|spati|public drinking|transport|ticket|welcome|tap water|drinking water|safe|cash|credit card)/i,
  },
  {
    key: 'practical',
    label: 'Practical Berlin',
    navLabel: 'Practical',
    kicker: 'Useful now',
    description: 'Clear answers for transport, money, luggage, safety, weather, and planning decisions visitors actually search for.',
    slugs: [
      'pharmacy-in-berlin',
      'doctor-in-berlin',
      'berlin-bike-lanes-tourists',
      'grocery-shopping-in-berlin',
      'lost-property-berlin',
      'drink-alcohol-in-public-berlin',
      'where-to-watch-2026-world-cup-in-berlin',
      'best-day-trips-from-berlin',
      'berlin-public-transport-explained-for-tourists-u-bahn-s-bahn-tram-bus',
      'taxi-in-berlin',
      'berlin-public-holidays-2026',
      'is-berlin-expensive-a-realistic-daily-budget-for-2026-tourists',
      'is-berlin-safe-to-visit-an-honest-2026-guide',
      'can-you-use-credit-cards-in-berlin-a-tourist-s-guide-to-paying-in-germany',
      'shopping-in-berlin',
      'what-is-a-spati-berlin',
      'pfand-in-germany',
      'berlin-city-tax',
      'where-to-stay-in-berlin-best-neighborhoods-for-every-type-of-tourist',
      'average-temperature-in-berlin-by-month-a-complete-climate-guide',
      'what-to-book-in-advance-in-berlin',
    ],
    match: /(world cup|public viewing|fan mile|football|soccer|lost property|lost phone|lost wallet|lost passport|public drinking|alcohol|budget|expensive|safe|credit|cash|city tax|accommodation tax|hotel tax|tourist tax|public holiday|public holidays|bank holiday|shop closures?|holiday closures?|pfand|deposit|bottle return|recycling|taxi|uber|bolt taxi|free now|rideshare|ride-hailing|späti|spaeti|spati|shopping|shop|stores?|flea market|vintage|souvenir|where to stay|temperature|weather|transport|welcome|ticket|tip|packing)/i,
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
      'pfand-in-germany',
    ],
    match: /(free|budget|cheap|save|pfand|deposit|bottle return|refund|museum pass|welcomecard|single tickets|bus 100|reichstag)/i,
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
      'why-is-berlin-founding-year-1237',
      'where-was-the-berlin-wall-interactive-map',
      'east-side-gallery-berlin-guide',
      'the-ampelmann-how-a-traffic-light-became-berlin-s-most-beloved-symbol',
      'alexanderplatz-then-and-now-from-medieval-market-to-modern-chaos',
      'why-berlin-doesn-t-have-a-beautiful-old-town-and-why-that-s-the-point',
      'how-berlin-was-divided-a-simple-guide-to-east-vs-west',
      'did-jfk-really-call-himself-a-jelly-donut-the-ich-bin-ein-berliner-myth',
      'sachsenhausen-from-berlin',
      'charlottenburg-palace-berlin',
      'traenenpalast-berlin',
      'topography-of-terror-berlin',
      'tempelhof-airport-berlin',
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
      'vegan-berlin-guide-2026',
      'what-is-a-spati-berlin',
      'best-currywurst-places-in-berlin-2026',
      'what-to-eat-in-berlin-12-must-try-local-foods',
      '5-best-döner-kebab-spots-in-berlin-you-need-to-try-in-2026',
      'where-to-eat-near-alexanderplatz-without-getting-ripped-off',
      '5-best-coffee-shops-near-hackescher-markt-a-local-s-guide',
      'what-to-wear-to-berlin-clubs',
      'berlin-restaurant-phrases',
    ],
    match: /(food|eat|vegan|plant-based|plant based|currywurst|döner|doner|coffee|club|nightlife|späti|spaeti|spati|menu|tip in berlin|restaurants?)/i,
  },
  {
    key: 'when-to-visit',
    label: 'Month-by-Month Berlin',
    navLabel: 'Months',
    kicker: 'Timing',
    description: 'Weather, daylight, crowds, events, and what each season feels like on foot.',
    slugs: [
      'berlin-in-january-2027',
      'berlin-in-february-2027',
      'berlin-in-march-2027',
      'berlin-in-april-2027',
      'berlin-in-may-2027',
      'visiting-berlin-in-june',
      'berlin-in-july-2026',
      'berlin-in-august-2026',
      'berlin-in-september-2026',
      'berlin-in-october-2026',
      'berlin-in-november-2026',
      'berlin-in-december-2026',
      'what-s-the-best-time-to-visit-berlin-a-month-by-month-guide',
      'average-temperature-in-berlin-by-month-a-complete-climate-guide',
    ],
    shelfLimit: 12,
    match: /(january|february|march|april|may|june|july|august|september|october|november|december|month|weather|temperature|rain|summer|winter|spring|autumn|fall|best time)/i,
  },
];

// Curated featured block (the hero + 5-story rail), not just the newest posts.
// Mix: current/timely topics, proven-popular posts, and the newest practical
// guides. Keep this curated because the /blog hero is the first editorial
// signal visitors see before the Latest shelf.
const HERO_SLUGS = {
  lead: 'berlin-heatwave-day-plan',
  secondary: [
    'berlin-bike-lanes-tourists',
    'doctor-in-berlin',
    'lost-property-berlin',
    'drink-alcohol-in-public-berlin',
    'topography-of-terror-berlin',
    'berlin-public-transport-ferries',
    'where-to-watch-2026-world-cup-in-berlin',
    'berlin-ber-airport-departure-guide',
    'sachsenhausen-from-berlin',
    'grocery-shopping-in-berlin',
    'pharmacy-in-berlin',
    'alternative-transport-berlin',
    'berlin-night-transport',
    'berlin-public-transport-explained-for-tourists-u-bahn-s-bahn-tram-bus',
    'berlin-public-holidays-2026',
    'tax-free-shopping-berlin-vat-refund',
    'berlin-with-kids',
    'berlin-hauptbahnhof-guide',
  ],
};

const REQUIRED_SLUGS = [
  'what-is-a-spati-berlin',
  'why-is-berlin-founding-year-1237',
  // Featured curation picks: guarantee they are fetched even if older than the
  // default window so the curated hero/rail survives a regen.
  'berlin-heatwave-day-plan',
  'berlin-bike-lanes-tourists',
  'doctor-in-berlin',
  'lost-property-berlin',
  'drink-alcohol-in-public-berlin',
  'berlin-ber-airport-departure-guide',
  'berlin-public-transport-ferries',
  'sachsenhausen-from-berlin',
  'charlottenburg-palace-berlin',
  'grocery-shopping-in-berlin',
  'pharmacy-in-berlin',
  'berlin-night-transport',
  'tax-free-shopping-berlin-vat-refund',
  'berlin-with-kids',
  'berlin-hauptbahnhof-guide',
  'berlin-public-holidays-2026',
  'where-to-watch-2026-world-cup-in-berlin',
  'berlin-public-transport-explained-for-tourists-u-bahn-s-bahn-tram-bus',
  'where-was-the-berlin-wall-interactive-map',
  'topography-of-terror-berlin',
  'taxi-in-berlin',
  'alternative-transport-berlin',
  'berlin-city-tax',
  'how-to-get-from-berlin-airport-to-alexanderplatz-the-easy-way',
  'public-toilets-in-berlin',
  // Durable shelf/homepage picks.
  'pfand-in-germany',
  'tipping-in-berlin',
  'what-is-a-spati-berlin',
  'why-is-berlin-founding-year-1237',
  // Other protected topical/shelf picks.
  'what-is-a-free-walking-tour-how-tip-based-tours-actually-work',
  'how-much-should-you-tip-on-a-free-walking-tour-in-berlin',
  'the-best-views-in-berlin-you-can-find-on-foot',
  'visiting-berlin-in-june',
  '5-best-döner-kebab-spots-in-berlin-you-need-to-try-in-2026',
];

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
    title: 'Medieval Berlin Mini Walk Planner',
    slug: 'medieval-berlin-mini-walk',
    url: `${BLOG_BASE}/tools/medieval-berlin-mini-walk`,
    summary: 'Trace Berlin and Cölln around Alexanderplatz, Nikolaiviertel and Museum Island.',
  },
  {
    title: 'Berlin Landmarks Map',
    slug: 'berlin-landmarks-map',
    url: `${BLOG_BASE}/tools/berlin-landmarks-map`,
    summary: 'Find the central landmarks, memorials, museums and viewpoints that frame the historic core.',
  },
  {
    title: 'Späti Survival Checker',
    slug: 'spati-survival-checker',
    url: `${BLOG_BASE}/tools/spati-survival-checker`,
    summary: 'Check whether a Späti, station shop, pharmacy, toilet finder, or supermarket is the right fix.',
  },
  {
    title: 'Vegan Berlin Interactive Map',
    slug: 'vegan-berlin-locations-map',
    url: `${BLOG_BASE}/tools/vegan-berlin-locations-map`,
    summary: 'Find the best vegan spots near your hotel with a filterable Berlin map.',
  },
  {
    title: 'Berlin First-Day Planner',
    slug: 'berlin-first-day-planner',
    url: `${BLOG_BASE}/tools/berlin-first-day-planner`,
    summary: 'Build a realistic first-day plan around arrival time, luggage, weather, and the tour.',
  },
];

function parseArgs(argv) {
  const args = {
    siteId: process.env.WIX_SITE_ID || DEFAULT_SITE_ID,
    out: 'blog-index/data.json',
    limit: 150,
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

async function getPopularPosts(siteId, maxPosts = 20) {
  try {
    const data = await wixFetch('/blog/v3/posts/query', {
      method: 'POST',
      siteId,
      body: {
        query: {
          paging: { limit: Math.min(100, maxPosts), offset: 0 },
          sort: [{ fieldName: 'metrics.views', order: 'DESC' }],
        },
        fieldsets: ['URL'],
      },
    });
    return (data.posts || []).slice(0, maxPosts);
  } catch (error) {
    console.warn(`Could not fetch Wix Blog popularity sort: ${error.message}`);
    return [];
  }
}

async function getPostsBySlug(siteId, slugs) {
  const posts = [];
  for (const slug of slugs) {
    try {
      const data = await wixFetch('/blog/v3/posts/query', {
        method: 'POST',
        siteId,
        body: {
          query: {
            filter: { slug },
            paging: { limit: 1, offset: 0 },
          },
          fieldsets: ['URL'],
        },
      });
      if (data.posts?.[0]) posts.push(data.posts[0]);
    } catch (error) {
      console.warn(`Could not fetch required slug ${slug}: ${error.message}`);
    }
  }
  return posts;
}

function mergePosts(primaryPosts, requiredPosts) {
  const byIdOrSlug = new Map();
  for (const post of requiredPosts) {
    byIdOrSlug.set(post.id || post.slug, post);
  }
  for (const post of primaryPosts) {
    byIdOrSlug.set(post.id || post.slug, post);
  }
  return [...byIdOrSlug.values()].sort((a, b) => {
    const aTime = Date.parse(a.firstPublishedDate || a.publishedDate || '') || 0;
    const bTime = Date.parse(b.firstPublishedDate || b.publishedDate || '') || 0;
    return bTime - aTime;
  });
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
  if (/^(berlin-in-|visiting-berlin-in-)/.test(post.slug || '')) {
    return TOPICS.find((topic) => topic.key === 'when-to-visit');
  }
  const explicit = TOPICS.find((topic) => topic.slugs.includes(post.slug));
  if (explicit) return explicit;
  return TOPICS.find((topic) => topic.match.test(haystack)) || TOPICS[1];
}

function relatedToolSlugFor(post) {
  const s = `${post.slug || ''} ${post.title || ''}`.toLowerCase();
  if (/(berlin-transport-strike|transport strike|bvg strike|s-bahn disruption|transport disruption|trains stop)/.test(s)) return 'berlin-transport-backup-planner';
  if (/(berlin-museum-bag-rules|berlin museum bag rules|museum bag rules|museum backpack rules|museum lockers)/.test(s)) return 'berlin-museum-bag-planner';
  if (/(berlin-last-day|berlin last day|before your flight or train|checkout day)/.test(s)) return 'berlin-last-day-buffer-planner';
  if (/(berlin-ab-abc-ticket-zones|berlin ab or abc ticket|berlin ticket zones|berlin fare zones|bvg ticket zones)/.test(s)) return 'berlin-zone-ticket-decoder';
  if (/(victory-column-berlin|victory column berlin|siegessaeule|siegessäule)/.test(s)) return 'victory-column-climb-planner';
  if (/(hohenzollern-berlin|hohenzollern berlin)/.test(s)) return 'hohenzollern-berlin-footprint-map';
  if (/(what-to-book-in-advance-in-berlin|what to book in advance in berlin|reservation guide|booking deadline)/.test(s)) return 'berlin-booking-deadline-planner';
  if (/(berlin-tourist-scams|tourist scams|street sense|fake police|pickpockets)/.test(s)) return 'berlin-street-sense-drill';
  if (/(doctor-in-berlin|doctor in berlin|feel unwell|medical help berlin)/.test(s)) return 'berlin-medical-help-router';
  if (/(breakfast-in-berlin|breakfast in berlin|brunch|bakery breakfast|coffee morning)/.test(s)) return 'berlin-breakfast-clock';
  if (/(german-signs-in-berlin|german signs in berlin|ausgang|ersatzverkehr|sign decoder)/.test(s)) return 'berlin-sign-decoder';
  if (/(berlin-plug-adapter|plug adapter|travel adapter|type f|schuko|berlin sockets|charger|usb-c|power bank)/.test(s)) return 'berlin-plug-adapter-checker';
  if (/(pharmacy|apotheke|notdienst|medicine|116117)/.test(s)) return 'pharmacy-in-berlin-helper';
  if (/(alternative-transport|alternative transport|mobility app|miles|car sharing|bike sharing|scooter)/.test(s)) return 'berlin-mobility-app-picker';
  if (/(zoo-berlin-vs-tierpark|tierpark|zoo berlin vs tierpark)/.test(s)) return '';
  if (/(with-kids|kids|family|families|children|playground|zoo|aquarium)/.test(s)) return 'berlin-family-day-planner';
  if (/(1237|founding|cölln|colln|medieval|nikolaiviertel|old-town|old town)/.test(s)) return 'medieval-berlin-mini-walk';
  if (/(spree|boat-tour|boat tour|river-cruise|river cruise)/.test(s)) return 'berlin-boat-tour-finder';
  if (/(best-views|best views|viewpoint|landmark|weltzeituhr|world clock|alexanderplatz|museum-island|museum island|berliner-dom|berliner dom)/.test(s)) return 'berlin-landmarks-map';
  if (/(world-cup|world cup|public viewing|fan mile|football|soccer)/.test(s)) return 'watch-world-cup-2026-berlin';
  if (/(sachsenhausen-from-berlin|sachsenhausen memorial|oranienburg memorial)/.test(s)) return 'sachsenhausen-visit-planner';
  if (/(potsdamer-platz-berlin|potsdamer platz berlin|potsdamer platz)/.test(s)) return 'potsdamer-platz-time-layer-walk';
  if (/(tempelhof-airport-berlin|tempelhof airport berlin|tempelhofer feld|tempelhof airport tours)/.test(s)) return 'tempelhof-field-planner';
  if (/(day-trip|day trip|potsdam|sachsenhausen|spreewald|dresden|leipzig|wittenberg|tropical-islands|bastei)/.test(s)) return 'berlin-day-trips-finder';
  if (/^(berlin-in-|visiting-berlin-in-)/.test(post.slug || '')) return 'best-month-to-visit-berlin';
  if (/(toilet)/.test(s)) return 'berlin-public-toilets';
  if (/(night-transport|night transport|after-midnight|after midnight|night-bus|night bus|night tram)/.test(s)) return 'berlin-night-transport-checker';
  if (/(späti|spaeti|spati|late-night|late night|sunday rules|corner shop)/.test(s)) return 'spati-survival-checker';
  if (/(lost-property|lost property|fundbüro|fundburo|lost phone|lost wallet|lost passport)/.test(s)) return 'berlin-lost-item-router';
  if (/(luggage|storage|suitcase)/.test(s)) return 'berlin-luggage-storage';
  if (/(drinking-water|tap-water|water fountain)/.test(s)) return 'berlin-drinking-water';
  if (/(berlin-ber-airport-departure-guide|ber airport departure|airport departure|berlin airport security|ber departure)/.test(s)) return 'berlin-ber-airport-departure-planner';
  if (/(charlottenburg-palace-berlin|charlottenburg palace|schloss charlottenburg)/.test(s)) return 'charlottenburg-palace-visit-planner';
  if (/(traenenpalast-berlin|tränenpalast|traenenpalast|palace of tears|friedrichstrasse border crossing|friedrichstraße border crossing)/.test(s)) return 'traenenpalast-visit-planner';
  if (/(topography-of-terror-berlin|topography of terror|nazi terror documentation center|nazi terror museum)/.test(s)) return 'topography-of-terror-visit-planner';
  if (/(berlin-public-transport-ferries|public transport ferries|bvg ferry|f10 ferry|wannsee ferry|f24 rowboat)/.test(s)) return 'berlin-public-transport-ferry-picker';
  if (/(berlin-accessibility|step-free|step free|wheelchair|accessible berlin|accessibility)/.test(s)) return 'berlin-step-free-planner';
  if (/(berlin-bike-lanes-tourists|bike lanes|bike-lane|cycle lane|red bike lane|cycling rules)/.test(s)) return 'berlin-bike-lane-reflex-checker';
  if (/(tip|tipping|gratuity)/.test(s)) return 'berlin-tip-calculator';
  if (/(berlin-restaurant-phrases|restaurant phrases|german restaurant phrases|ordering food|ask for the bill|berlin cafe phrases)/.test(s)) return 'berlin-restaurant-phrase-card';
  if (/(taxi|uber|bolt taxi|free-now|free now|freenow|rideshare|ride-hailing|airport taxi)/.test(s)) return 'berlin-taxi-uber-cost-checker';
  if (/(public-holiday|public holiday|public-holidays|public holidays|bank-holiday|bank holiday|holiday-closures|holiday closures|shop-closures|shop closures|shops-closed|shops closed)/.test(s)) return 'berlin-public-holiday-checker';
  if (/(airport|transport|ticket|validate|u-bahn|s-bahn|bus-100)/.test(s)) return 'transport-ticket-calculator';
  if (/(welcomecard)/.test(s)) return 'welcomecard-calculator';
  if (/(city-tax|city tax|accommodation-tax|accommodation tax|hotel-tax|hotel tax|tourist-tax|tourist tax)/.test(s)) return 'berlin-city-tax-calculator';
  if (/(pfand|bottle-deposit|bottle deposit|deposit bottle|bottle-return|bottle return|recycling)/.test(s)) return 'berlin-pfand-calculator';
  if (/(berlin-flea-markets|flea market|flea-market|vintage market|mauerpark|boxhagener)/.test(s)) return 'berlin-flea-market-picker';
  if (/(shopping|shop|flea-market|vintage|souvenir)/.test(s)) return 'berlin-shopping-areas';
  if (/(vegan|plant-based|plant based)/.test(s)) return 'vegan-berlin-locations-map';
  if (/(budget|expensive|cheap|credit|cash)/.test(s)) return 'berlin-daily-budget';
  if (/(first-time|3-days|itinerary)/.test(s)) return 'berlin-first-day-planner';
  if (/(weather|temperature|january|february|march|april|may|june|july|august|september|october|november|december|rain|pack|month)/.test(s)) return 'best-month-to-visit-berlin';
  if (/(free-things|free-museums|museum-island-free|reichstag)/.test(s)) return 'berlin-free-things-to-do';
  if (/(safe|safety|solo)/.test(s)) return 'berlin-safety';
  if (/(east-side-gallery|east side gallery)/.test(s)) return 'east-side-gallery-murals';
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

function buildData(posts, popularPosts = []) {
  const map = bySlug(posts);
  const lead = map.get(HERO_SLUGS.lead) || posts[0];
  const secondary = pickPosts(posts, HERO_SLUGS.secondary, 'first-day', 5).filter((post) => post.slug !== lead.slug);
  const popular = [];
  const seenPopular = new Set();
  for (const post of popularPosts) {
    if (post?.slug && !seenPopular.has(post.slug)) {
      popular.push(post);
      seenPopular.add(post.slug);
    }
    if (popular.length >= 7) break;
  }

  return {
    updatedAt: new Date().toISOString(),
    source: 'Wix Blog API',
    popularSource: popular.length ? 'Wix Blog metrics.views lifetime sort' : 'Curated fallback',
    totalPosts: posts.length,
    bookingUrl: BOOKING_URL,
    navTopics: TOPICS.map(({ key, label, navLabel }) => ({ key, label, navLabel })),
    hero: { lead, secondary: secondary.slice(0, 5) },
    startHere: START_HERE_LINKS,
    tools: SPOTLIGHT_TOOLS,
    popular,
    shelves: TOPICS.map((topic) => ({
      key: topic.key,
      title: topic.label,
      navLabel: topic.navLabel,
      kicker: topic.kicker,
      description: topic.description,
      posts: pickPosts(posts, topic.slugs, topic.key, topic.shelfLimit || 10),
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

  const [categories, rawPosts, rawPopularPosts, requiredPosts] = await Promise.all([
    getCategories(args.siteId),
    getPosts(args.siteId, args.limit),
    getPopularPosts(args.siteId, 20),
    getPostsBySlug(args.siteId, REQUIRED_SLUGS),
  ]);
  const posts = mergePosts(rawPosts, requiredPosts).map((post) => normalizePost(post, categories));
  const popularPosts = rawPopularPosts.map((post) => normalizePost(post, categories));
  const data = buildData(posts, popularPosts);

  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${path.relative(repoRoot, outPath)} with ${posts.length} posts`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
