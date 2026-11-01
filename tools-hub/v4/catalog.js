export function createCatalog(data, shortLeads, ASSETS_BASE) {
function toolImage(raw) {
 try { const u=new URL(raw);if(u.hostname!=='static.wixstatic.com')return raw;const asset=u.pathname.split('/v1/')[0];return u.origin+asset+'/v1/fill/w_80,h_80,al_c,q_80,enc_avif,quality_auto/tool.avif'; } catch { return raw; }
}

const PAGE_SIZE = 24;
const categories = data.hubCategories;

const shortLabels = {
  TripPlans: 'Trip plans & first day',
  Transport: 'Transport & arrival',
  MoneyShopping: 'Money & costs',
  Essentials: 'Open today & essentials',
  WeatherOutdoor: 'Weather & outdoors',
  FoodNightlife: 'Food & nights out',
  EventsSports: 'Events & festivals',
  CultureLandmarks: 'History & culture',
};

const mobileLabels = {
  TripPlans: 'Trips',
  Transport: 'Transport',
  MoneyShopping: 'Money',
  Essentials: 'Open today',
  WeatherOutdoor: 'Weather',
  FoodNightlife: 'Food',
  EventsSports: 'Events',
  CultureLandmarks: 'History',
};

const CATALOG_PARAM_KEYS = new Set(['q', 'category', 'type', 'page']);

const STOPWORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'around',
  'at',
  'be',
  'berlin',
  'berliner',
  'by',
  'can',
  'do',
  'does',
  'for',
  'from',
  'get',
  'go',
  'how',
  'i',
  'in',
  'into',
  'is',
  'it',
  'me',
  'my',
  'near',
  'of',
  'on',
  'or',
  'should',
  'the',
  'there',
  'this',
  'to',
  'use',
  'what',
  'whats',
  'when',
  'where',
  'which',
  'who',
  'why',
  'with',
  'you',
  'your',
]);

const SHORT_EXACT_ABBREVIATIONS = new Set([
  'ber',
  'bvg',
  'csd',
  'ddr',
  'fex',
  'ice',
  'ifa',
  'ilb',
  'omu',
  'ov',
  'sbahn',
  'sim',
  'sup',
  'ubahn',
  'ulb',
  'ust',
  'vat',
  'vbb',
  'wbs',
  'wc',
  'zlb',
  'zob',
]);

const QUERY_SYNONYMS = {
  flughafen: ['ber', 'airport', 'airports', 'flight', 'layover', 'schonefeld', 'tegel'],
  airport: ['ber', 'airport', 'airports', 'flight', 'layover'],
  airports: ['ber', 'airport', 'airports', 'flight', 'layover'],
  ber: ['ber', 'airport'],
  sbahn: ['sbahn', 'ringbahn', 'rail', 'train', 's41', 's42'],
  ubahn: ['ubahn', 'subway', 'underground', 'metro', 'u8', 'rail'],
  toilets: ['toilet', 'toilets', 'wc', 'restroom', 'bathroom', 'loo'],
  toilet: ['toilet', 'toilets', 'wc', 'restroom', 'bathroom', 'loo'],
  toilette: ['toilet', 'toilets', 'wc'],
  klo: ['toilet', 'toilets', 'wc'],
  wc: ['toilet', 'toilets', 'wc'],
  restroom: ['toilet', 'toilets'],
  bathroom: ['toilet', 'toilets'],
  gepack: ['luggage', 'baggage', 'locker', 'suitcase', 'bag'],
  koffer: ['luggage', 'baggage', 'locker', 'suitcase'],
  schliessfach: ['luggage', 'locker', 'bag'],
  baggage: ['luggage', 'bag', 'suitcase', 'locker'],
  suitcase: ['luggage', 'bag', 'locker'],
  lockers: ['luggage', 'locker', 'bag'],
  locker: ['luggage', 'locker', 'bag'],
  regen: ['rain', 'rainy', 'rainfall', 'indoor', 'weather'],
  rainy: ['rain', 'rainy', 'rainfall', 'indoor', 'weather'],
  rainfall: ['rain', 'rainy', 'rainfall', 'weather'],
  fahrkarte: ['ticket', 'tickets', 'fare', 'pass', 'bvg'],
  fahrschein: ['ticket', 'tickets', 'fare', 'pass', 'bvg'],
  offnungszeiten: ['open', 'today', 'hours', 'sunday', 'holiday', 'closed'],
  geoffnet: ['open', 'today', 'sunday', 'holiday'],
  feiertag: ['holiday', 'open', 'sunday', 'closed'],
  sonntag: ['sunday', 'open', 'shopping', 'spati'],
  trinkgeld: ['tip', 'tipping'],
  apotheke: ['pharmacy', 'medical', 'medicine', 'doctor', 'emergency'],
  pfand: ['pfand', 'bottle', 'deposit', 'refund'],
  spati: ['spati', 'late', 'sunday', 'convenience'],
  kiosk: ['spati', 'late', 'sunday'],
};

const PRIMARY_INTENT_BOOSTS = {
  ticket: {
    'transport-ticket-calculator': 650,
    'berlin-phone-ticket-picker': 520,
    'berlin-zone-ticket-decoder': 480,
    'welcomecard-calculator': 880,
    'berlin-ticket-machine-simulator': 340,
    'berlin-deutschlandticket-checker': 320,
    'berlin-pass-cost-comparison': 300,
  },
  open: {
    'whats-open-in-berlin-today': 900,
    'berlin-sunday-shopping': 760,
    'berlin-public-holiday-checker': 720,
    'berlin-monday-plan-checker': 680,
    'berlin-sunday-planner': 520,
  },
  museum: {
    'berlin-museums-map': 650,
    'museum-island-one-pick': 520,
    'berlin-museum-ticket-desk': 480,
    'berlin-museum-three-slot-builder': 340,
    'berlin-museum-bag-planner': 320,
  },
  toilet: {
    'berlin-public-toilets': 450,
  },
  rain: {
    'berlin-weather-by-month': 420,
    'berlin-indoor-play-bill': 360,
    'berlin-walking-kit': 350,
    'berlin-family-day-planner': 330,
    'berlin-attractions-worth-it-matcher': 310,
    'berlin-museums-map': 290,
  },
  ber: {
    'berlin-ber-airport-departure-planner': 450,
    'ber-dawn-departure-map': 380,
    'berlin-airports': 360,
    'berlin-layover-planner': 340,
    'ber-flight-compensation-line': 320,
  },
  flughafen: {
    'berlin-ber-airport-departure-planner': 450,
    'ber-dawn-departure-map': 380,
    'berlin-airports': 360,
    'berlin-layover-planner': 340,
    'ber-flight-compensation-line': 320,
  },
  luggage: {
    'berlin-luggage-storage': 450,
    'berlin-station-arrival-planner': 320,
    'berlin-museum-bag-planner': 300,
    'berlin-check-in-gap-planner': 280,
  },
  sbahn: {
    'berlin-ringbahn': 420,
    'berlin-rail-decoder': 380,
    'berlin-night-transport-checker': 340,
    'berlin-zone-ticket-decoder': 320,
    'transport-ticket-calculator': 300,
  },
};

const CURATED_TOOL_ALIASES = {
  'transport-ticket-calculator': [
    'ticket',
    'tickets',
    'bvg ticket',
    'public transport ticket',
    'fare calculator',
    'fahrkarte',
    'fahrschein',
    's bahn ticket',
    'u bahn ticket',
  ],
  'berlin-phone-ticket-picker': [
    'ticket',
    'tickets',
    'bvg app ticket',
    'phone ticket',
    'fahrkarte',
    's bahn ticket',
    'u bahn ticket',
  ],
  'berlin-zone-ticket-decoder': [
    'ticket',
    'tickets',
    'ab abc ticket',
    'zone ab abc',
    'airport ticket',
    'ber',
    'flughafen',
    's bahn',
  ],
  'welcomecard-calculator': [
    'ticket',
    'tickets',
    'welcomecard',
    'tourist pass',
    'transport pass',
  ],
  'berlin-pass-cost-comparison': [
    'ticket',
    'tickets',
    'citytourcard',
    'museum pass',
    'welcomecard',
  ],
  'berlin-deutschlandticket-checker': [
    'ticket',
    'tickets',
    'deutschlandticket',
    '63 euro ticket',
    'ber',
    'flughafen',
  ],
  'berlin-ticket-machine-simulator': [
    'ticket',
    'tickets',
    'bvg machine',
    'validate ticket',
    'fahrkarte',
  ],
  'whats-open-in-berlin-today': [
    'open',
    'what is open today',
    'whats open today',
    'open today',
    'open now',
    'is berlin open today',
    'sunday open',
    'holiday open',
    'offnungszeiten',
    'geoffnet',
  ],
  'berlin-sunday-shopping': [
    'open',
    'open today',
    'what is open today',
    'sunday open',
    'supermarket open sunday',
    'sonntag',
    'offnungszeiten',
  ],
  'berlin-public-holiday-checker': [
    'open',
    'open today',
    'what is open today',
    'holiday open',
    'feiertag',
  ],
  'berlin-monday-plan-checker': [
    'open',
    'open today',
    'monday open',
    'closed museums monday',
  ],
  'berlin-sunday-planner': [
    'open',
    'sunday open',
    'what is open on sunday',
  ],
  'berlin-museums-map': [
    'museum',
    'museums',
    'museum map',
    'berlin museums',
    'rain',
    'rainy day',
  ],
  'museum-island-one-pick': [
    'museum',
    'museums',
    'museum island',
    'museumsinsel',
  ],
  'berlin-museum-ticket-desk': [
    'museum',
    'museums',
    'museum ticket',
    'museum price',
  ],
  'berlin-museum-three-slot-builder': [
    'museum',
    'museums',
    'museum planner',
  ],
  'berlin-museum-closure-timeline': [
    'museum',
    'museums',
    'pergamon closed',
    'museum renovation',
  ],
  'berlin-museum-bag-planner': [
    'museum',
    'museums',
    'luggage',
    'bag',
    'cloakroom',
    'locker',
  ],
  'berlin-public-toilets': [
    'toilet',
    'toilets',
    'public toilet',
    'public toilets',
    'wc',
    'restroom',
    'bathroom',
    'loo',
    'toilette',
    'klo',
  ],
  'berlin-weather-by-month': [
    'rain',
    'rainy',
    'rainfall',
    'weather',
    'regen',
    'temperature',
  ],
  'berlin-indoor-play-bill': [
    'rain',
    'rainy',
    'rainy day',
    'indoor',
    'regen',
  ],
  'berlin-walking-kit': [
    'rain',
    'rainy',
    'rain gear',
    'weather forecast',
    'regen',
  ],
  'berlin-attractions-worth-it-matcher': [
    'rain',
    'rainy day',
    'indoor attractions',
  ],
  'berlin-family-day-planner': [
    'rain',
    'rainy day',
    'kids rain',
  ],
  'berlin-ber-airport-departure-planner': [
    'ber',
    'ber airport',
    'flughafen',
    'flughafen ber',
    'airport departure',
    'flight',
    'fex',
    's9',
  ],
  'ber-dawn-departure-map': [
    'ber',
    'ber airport',
    'flughafen',
    'flughafen ber',
    'early flight',
    'airport night train',
  ],
  'berlin-airports': [
    'ber',
    'ber airport',
    'flughafen',
    'flughafen ber',
    'tegel',
    'schonefeld',
    'tempelhof',
    'airport',
  ],
  'berlin-layover-planner': [
    'ber',
    'ber airport',
    'flughafen',
    'flughafen ber',
    'airport layover',
    'stopover',
  ],
  'ber-flight-compensation-line': [
    'ber',
    'ber airport',
    'flughafen',
    'flight delay',
    'airport compensation',
  ],
  'berlin-luggage-storage': [
    'luggage',
    'baggage',
    'suitcase',
    'locker',
    'lockers',
    'bag drop',
    'left luggage',
    'gepack',
    'koffer',
    'schliessfach',
  ],
  'berlin-station-arrival-planner': [
    'luggage',
    'baggage',
    'arrival station',
    'hauptbahnhof',
    's bahn',
  ],
  'berlin-check-in-gap-planner': [
    'luggage',
    'suitcase',
    'before check in',
  ],
  'berlin-ringbahn': [
    'sbahn',
    's bahn',
    's41',
    's42',
    'ring line',
    'circle line',
  ],
  'berlin-rail-decoder': [
    'sbahn',
    's bahn',
    'ubahn',
    'u bahn',
    's41',
    's42',
    'u8',
    'fex',
    're1',
  ],
  'berlin-night-transport-checker': [
    'sbahn',
    's bahn',
    'ubahn',
    'u bahn',
    'night train',
    'night bus',
  ],
  'berlin-station-exit-map': [
    'sbahn',
    's bahn',
    'ubahn',
    'u bahn',
    'station exit',
  ],
  'berlin-ubahn-etiquette': [
    'ubahn',
    'u bahn',
    'sbahn',
    's bahn',
    'subway rules',
  ],
  'berlin-ghost-stations': [
    'ubahn',
    'u bahn',
    'sbahn',
    's bahn',
    'geisterbahnhofe',
  ],
};

function foldAscii(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '');
}

function normalizeText(value) {
  return foldAscii(value)
    .replace(/['’`]/g, '')
    .replace(/\b([su])\s*-\s*bahn\b/g, '$1bahn')
    .replace(/\b([su])\s+bahn\b/g, '$1bahn')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function stemToken(token) {
  const t = String(token || '').trim();
  if (t.length <= 3 || SHORT_EXACT_ABBREVIATIONS.has(t)) return t;
  if (t === 'rainy' || t === 'rainfall' || t === 'raining' || t === 'rains') return 'rain';
  if (t === 'tipping' || t === 'tips') return 'tip';
  if (t === 'opening' || t === 'opened' || t === 'opens') return 'open';
  if (t === 'ferries') return 'ferry';
  if (t === 'libraries') return 'library';
  if (t === 'families') return 'family';
  if (t === 'pharmacies') return 'pharmacy';
  if (t === 'cemeteries') return 'cemetery';
  if (t === 'embassies') return 'embassy';
  if (t === 'passes') return 'pass';
  if (t === 'buses') return 'bus';
  if (t === 'taxes') return 'tax';
  if (t === 'beaches') return 'beach';
  if (t === 'churches') return 'church';
  if (t === 'dishes') return 'dish';
  if (t === 'boxes') return 'box';
  if (t.endsWith('ies') && t.length > 5) return `${t.slice(0, -3)}y`;
  if (t.endsWith('s') && !t.endsWith('ss') && !t.endsWith('us') && !t.endsWith('is') && t.length > 4) {
    return t.slice(0, -1);
  }
  return t;
}

function tokenize(value) {
  const norm = normalizeText(value);
  if (!norm) return [];
  return norm.split(' ').filter(Boolean);
}

function editDistance1(a, b) {
  if (a === b) return true;
  const la = a.length;
  const lb = b.length;
  if (Math.abs(la - lb) > 1) return false;
  if (la < 5 || lb < 5) return false;
  if (a[0] !== b[0]) return false;

  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < la && j < lb) {
    if (a[i] === b[j]) {
      i += 1;
      j += 1;
      continue;
    }
    if (edits >= 1) return false;
    edits += 1;
    if (i + 1 < la && j + 1 < lb && a[i] === b[j + 1] && a[i + 1] === b[j]) {
      i += 2;
      j += 2;
      continue;
    }
    if (la > lb) {
      i += 1;
    } else if (lb > la) {
      j += 1;
    } else {
      i += 1;
      j += 1;
    }
  }
  if (i < la || j < lb) edits += 1;
  return edits <= 1;
}

const CORE_VOCABULARY = new Set(Object.keys(QUERY_SYNONYMS));

function getShortLead(tool) {
  if (shortLeads[tool.slug]) return shortLeads[tool.slug];
  const cleaned = String(tool.lead || '')
    .trim()
    .replace(/\btip-based walking tours\b/gi, 'walking tours')
    .replace(/\s*—\s*/g, ', ');
  const m = cleaned.match(/^(.+?[.!?])(?:\s|$)/);
  return m ? m[1] : cleaned;
}

function buildSearchIndex(tool, shortLead) {
  const titleNorm = normalizeText(tool.title);
  const slugNorm = normalizeText(tool.slug.replace(/-/g, ' '));
  const tagsNorm = (tool.tags || []).map((t) => normalizeText(t)).filter(Boolean);
  const aliasesNorm = [
    ...(tool.aliases || []),
    ...(CURATED_TOOL_ALIASES[tool.slug] || []),
  ].map((a) => normalizeText(a)).filter(Boolean);
  const shortLeadNorm = normalizeText(shortLead);
  const leadNorm = normalizeText(tool.lead);

  const titleTokens = tokenize(titleNorm);
  const slugTokens = tokenize(slugNorm);
  const tagTokens = tagsNorm.flatMap((t) => tokenize(t));
  const aliasTokens = aliasesNorm.flatMap((a) => tokenize(a));
  const leadTokens = [...tokenize(shortLeadNorm), ...tokenize(leadNorm)];

  const titleTokenSet = new Set(titleTokens);
  const titleStemSet = new Set(titleTokens.map(stemToken));
  const slugTokenSet = new Set(slugTokens);
  const slugStemSet = new Set(slugTokens.map(stemToken));
  const tagTokenSet = new Set(tagTokens);
  const tagStemSet = new Set(tagTokens.map(stemToken));
  const aliasTokenSet = new Set(aliasTokens);
  const aliasStemSet = new Set(aliasTokens.map(stemToken));
  const leadTokenSet = new Set(leadTokens);
  const leadStemSet = new Set(leadTokens.map(stemToken));

  const allTokens = new Set([
    ...titleTokenSet,
    ...slugTokenSet,
    ...tagTokenSet,
    ...aliasTokenSet,
    ...leadTokenSet,
  ]);

  for (const tok of [...titleTokenSet, ...slugTokenSet, ...tagTokenSet, ...aliasTokenSet]) {
    if (tok.length >= 5) CORE_VOCABULARY.add(tok);
    const st = stemToken(tok);
    if (st.length >= 5) CORE_VOCABULARY.add(st);
  }

  const hasExactBer =
    titleTokenSet.has('ber')
    || slugTokenSet.has('ber')
    || tagTokenSet.has('ber')
    || aliasTokenSet.has('ber')
    || leadTokenSet.has('ber');

  return {
    titleNorm,
    slugNorm,
    tagsNorm,
    aliasesNorm,
    titleTokens,
    titleTokenSet,
    titleStemSet,
    slugTokenSet,
    slugStemSet,
    tagTokenSet,
    tagStemSet,
    aliasTokenSet,
    aliasStemSet,
    leadTokenSet,
    leadStemSet,
    allTokens,
    hasExactBer,
  };
}

const tools = data.tools
  .filter(
    (t) =>
      t.widgetUrl
      && t.hidden !== true
      && t.published !== false
      && String(t.status || '').toLowerCase() !== 'draft',
  )
  .map((t) => {
    const shortLead = getShortLead(t);
    return {
      ...t,
      shortLead,
      _idx: buildSearchIndex(t, shortLead),
    };
  })
  .sort(
    (a, b) =>
      a.title.localeCompare(b.title, 'en', { sensitivity: 'base' })
      || a.slug.localeCompare(b.slug),
  );

const types = [...new Set(tools.map((t) => t.type).filter(Boolean))].sort();

const FEATURED_SLUGS = [
  'transport-ticket-calculator',
  'whats-open-in-berlin-today',
  'berlin-first-day-planner',
  'berlin-dates-check',
  'berlin-luggage-storage',
  'berlin-daily-budget',
];

const featured = FEATURED_SLUGS.map(
  (slug) =>
    tools.find((t) => t.slug === slug)
    || tools.find((t) => slug === 'berlin-dates-check' && t.title === 'Berlin Date Check'),
).filter(Boolean);

function resolveTypoCandidates(token) {
  if (token.length < 5 || SHORT_EXACT_ABBREVIATIONS.has(token)) return [];
  const matches = [];
  for (const vocabWord of CORE_VOCABULARY) {
    if (editDistance1(token, vocabWord)) {
      matches.push(vocabWord);
    }
  }
  return matches;
}

function expandTokenVariants(rawToken) {
  const stem = stemToken(rawToken);
  const directSynonyms = [
    ...(QUERY_SYNONYMS[rawToken] || []),
    ...(QUERY_SYNONYMS[stem] || []),
  ];
  const exactVariants = new Set([rawToken, stem]);
  const synonymVariants = new Set();
  for (const syn of directSynonyms) {
    for (const part of tokenize(syn)) {
      synonymVariants.add(part);
      synonymVariants.add(stemToken(part));
    }
  }
  return {
    rawToken,
    stem,
    isBerToken: rawToken === 'ber',
    exactVariants: [...exactVariants],
    synonymVariants: [...synonymVariants],
    typoCandidates: resolveTypoCandidates(rawToken),
  };
}

function buildQueryPlan(rawQuery) {
  const normQuery = normalizeText(rawQuery);
  if (!normQuery) return null;
  const rawTokens = tokenize(normQuery);
  if (rawTokens.length === 0) return null;

  const nonStopTokens = rawTokens.filter((t) => !STOPWORDS.has(t));
  const effectiveTokens = nonStopTokens.length > 0
    ? nonStopTokens
    : rawTokens.filter((t) => t !== 'berlin' && t !== 'berliner');
  const activeTokens = effectiveTokens.length > 0 ? effectiveTokens : rawTokens;

  return {
    rawQuery: String(rawQuery || '').trim(),
    normQuery,
    rawTokens,
    activeTokens,
    tokenGroups: activeTokens.map(expandTokenVariants),
  };
}

function scoreSingleToken(idx, tokenGroup, allowTypo = false) {
  const { rawToken, isBerToken, exactVariants, synonymVariants } = tokenGroup;

  if (isBerToken) {
    if (!idx.hasExactBer) return 0;
    let berScore = 0;
    if (idx.titleTokenSet.has('ber') || idx.slugTokenSet.has('ber')) berScore += 220;
    if (idx.aliasTokenSet.has('ber') || idx.tagTokenSet.has('ber')) berScore += 140;
    if (idx.leadTokenSet.has('ber')) berScore += 45;
    if (idx.titleStemSet.has('airport') || idx.slugStemSet.has('airport') || idx.tagStemSet.has('airport')) {
      berScore += 95;
    }
    return berScore;
  }

  let best = 0;

  for (const v of exactVariants) {
    if (v === 'ber') continue;
    let s = 0;
    if (idx.titleTokenSet.has(v) || idx.titleStemSet.has(v)) s += 180;
    if (idx.slugTokenSet.has(v) || idx.slugStemSet.has(v)) s += 130;
    if (idx.aliasTokenSet.has(v) || idx.aliasStemSet.has(v)) s += 120;
    if (idx.tagTokenSet.has(v) || idx.tagStemSet.has(v)) s += 105;
    if (idx.leadTokenSet.has(v) || idx.leadStemSet.has(v)) s += 28;
    if (s > best) best = s;
  }

  if (best === 0 && rawToken.length >= 4 && !SHORT_EXACT_ABBREVIATIONS.has(rawToken)) {
    for (const tok of idx.titleTokens) {
      if (tok !== 'berlin' && tok !== 'berliner' && tok.startsWith(rawToken)) {
        best = Math.max(best, 110);
      }
    }
    for (const tok of idx.tagTokenSet) {
      if (tok !== 'berlin' && tok !== 'berliner' && tok.startsWith(rawToken)) {
        best = Math.max(best, 75);
      }
    }
    for (const tok of idx.aliasTokenSet) {
      if (tok !== 'berlin' && tok !== 'berliner' && tok.startsWith(rawToken)) {
        best = Math.max(best, 80);
      }
    }
  }

  if (synonymVariants.length > 0) {
    let synBest = 0;
    for (const sv of synonymVariants) {
      if (sv === 'ber') {
        if (idx.hasExactBer) {
          let b = 0;
          if (idx.titleTokenSet.has('ber') || idx.slugTokenSet.has('ber')) b += 170;
          if (idx.aliasTokenSet.has('ber') || idx.tagTokenSet.has('ber')) b += 125;
          if (idx.leadTokenSet.has('ber')) b += 35;
          synBest = Math.max(synBest, b);
        }
        continue;
      }
      let b = 0;
      if (idx.titleTokenSet.has(sv) || idx.titleStemSet.has(sv)) b += 145;
      if (idx.slugTokenSet.has(sv) || idx.slugStemSet.has(sv)) b += 110;
      if (idx.aliasTokenSet.has(sv) || idx.aliasStemSet.has(sv)) b += 100;
      if (idx.tagTokenSet.has(sv) || idx.tagStemSet.has(sv)) b += 85;
      if (idx.leadTokenSet.has(sv) || idx.leadStemSet.has(sv)) b += 20;
      if (b > synBest) synBest = b;
    }
    if (synBest > best) best = synBest;
  }

  if (best === 0 && allowTypo && tokenGroup.typoCandidates && tokenGroup.typoCandidates.length > 0) {
    for (const cand of tokenGroup.typoCandidates) {
      const candStem = stemToken(cand);
      let tScore = 0;
      if (idx.titleTokenSet.has(cand) || idx.titleStemSet.has(candStem)) tScore += 70;
      if (idx.slugTokenSet.has(cand) || idx.slugStemSet.has(candStem)) tScore += 55;
      if (idx.aliasTokenSet.has(cand) || idx.aliasStemSet.has(candStem)) tScore += 50;
      if (idx.tagTokenSet.has(cand) || idx.tagStemSet.has(candStem)) tScore += 45;
      if (tScore > best) best = tScore;
    }
  }

  return best;
}

function scoreToolWithPlan(tool, plan, allowTypo = false) {
  if (!plan) return 1;
  const idx = tool._idx;

  if (plan.activeTokens.length === 1 && (plan.activeTokens[0] === 'berlin' || plan.activeTokens[0] === 'berliner')) {
    return idx.allTokens.has('berlin') || idx.allTokens.has('berliner') ? 10 : 0;
  }

  let totalScore = 0;
  for (const group of plan.tokenGroups) {
    const tokenScore = scoreSingleToken(idx, group, allowTypo);
    if (tokenScore <= 0) return 0;
    totalScore += tokenScore;
  }

  const qNorm = plan.normQuery;
  const activePhrase = plan.activeTokens.join(' ');

  if (idx.titleNorm === qNorm || idx.slugNorm === qNorm) {
    totalScore += 500;
  } else if (idx.titleNorm.startsWith(`${qNorm} `) || idx.titleNorm.endsWith(` ${qNorm}`)) {
    totalScore += 260;
  }

  if (activePhrase.length >= 4 && activePhrase !== 'ber') {
    if (idx.titleNorm.includes(activePhrase)) totalScore += 220;
    if (idx.slugNorm.includes(activePhrase)) totalScore += 180;
    if (idx.aliasesNorm.some((a) => a === activePhrase || a === qNorm || stemToken(a) === activePhrase)) totalScore += 280;
    else if (idx.aliasesNorm.some((a) => a.includes(activePhrase) || a.includes(qNorm))) totalScore += 160;
    if (idx.tagsNorm.some((t) => t === activePhrase || t === qNorm || stemToken(t) === activePhrase)) totalScore += 190;
  }

  if (plan.rawTokens.length >= 2) {
    let rawMatchesInTitle = 0;
    for (const rt of plan.rawTokens) {
      const rst = stemToken(rt);
      if (idx.titleTokenSet.has(rt) || idx.titleStemSet.has(rst) || idx.slugTokenSet.has(rt) || idx.slugStemSet.has(rst)) {
        rawMatchesInTitle += 1;
      }
    }
    if (rawMatchesInTitle >= 2) {
      totalScore += rawMatchesInTitle * 85;
    }
  }

  for (const group of plan.tokenGroups) {
    const keysToCheck = new Set([group.rawToken, group.stem, ...(allowTypo ? (group.typoCandidates || []) : [])]);
    for (const k of keysToCheck) {
      const table = PRIMARY_INTENT_BOOSTS[k];
      if (table && table[tool.slug]) {
        totalScore += table[tool.slug];
      }
    }
  }

  if (FEATURED_SLUGS.includes(tool.slug) && totalScore >= 180) {
    totalScore += 35;
  }

  return totalScore;
}

// Resolve typo fallback once for the full catalog, then apply filters. Otherwise
// choosing a category with no exact match silently changes "parking" to "packing".
const searchCache = new Map();
function rankCatalog(q) {
  const cacheKey = normalizeText(q);
  if (searchCache.has(cacheKey)) return searchCache.get(cacheKey);
  const plan = buildQueryPlan(q);
  if (!plan) {
    return { list: tools, usedTypoFallback: false };
  }

  const scored = [];
  for (const tool of tools) {
    const score = scoreToolWithPlan(tool, plan, false);
    if (score > 0) scored.push({ tool, score });
  }

  let usedTypoFallback = false;
  if (scored.length === 0 && plan.tokenGroups.some((g) => g.typoCandidates && g.typoCandidates.length > 0)) {
    for (const tool of tools) {
      const score = scoreToolWithPlan(tool, plan, true);
      if (score > 0) scored.push({ tool, score });
    }
    usedTypoFallback = scored.length > 0;
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (
      a.tool.title.localeCompare(b.tool.title, 'en', { sensitivity: 'base' })
      || a.tool.slug.localeCompare(b.tool.slug)
    );
  });

  const result = {
    list: scored.map((entry) => entry.tool),
    usedTypoFallback,
  };
  if (searchCache.size >= 32) searchCache.delete(searchCache.keys().next().value);
  searchCache.set(cacheKey, result);
  return result;
}

function searchAndRank(q = '', category = '', type = '') {
  const ranked = rankCatalog(q);
  return {
    ...ranked,
    list: ranked.list.filter(t =>
      (!category || (t.hubCategory || t.category) === category)
      && (!type || t.type === type)),
  };
}

function resolveCategoryParam(rawCategory) {
  if (!rawCategory) return '';
  const clean = String(rawCategory).trim();
  const exact = categories.find((c) => c.key === clean);
  if (exact) return exact.key;
  const lower = clean.toLowerCase();
  const ci = categories.find(
    (c) =>
      c.key.toLowerCase() === lower
      || (shortLabels[c.key] || '').toLowerCase() === lower
      || (mobileLabels[c.key] || '').toLowerCase() === lower,
  );
  return ci ? ci.key : '';
}

function resolveTypeParam(rawType) {
  if (!rawType) return '';
  const clean = String(rawType).trim();
  if (types.includes(clean)) return clean;
  const lower = clean.toLowerCase();
  return types.find((t) => t.toLowerCase() === lower) || '';
}

function state(search = '') {
  const p = search instanceof URLSearchParams
    ? search
    : new URLSearchParams(String(search).replace(/^\?/, ''));
  const q = (p.get('q') || '').trim().slice(0, 150);
  const category = resolveCategoryParam(p.get('category'));
  const type = resolveTypeParam(p.get('type'));

  const extraParams = [];
  for (const [k, v] of p.entries()) {
    if (!CATALOG_PARAM_KEYS.has(k)) {
      extraParams.push([k, v]);
    }
  }

  const { list, usedTypoFallback } = searchAndRank(q, category, type);
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const page = Math.min(pages, Math.max(1, Number.parseInt(p.get('page'), 10) || 1));
  const items = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const showFeatured = !q && !category && !type && page === 1;
  const sortLabel = q ? 'Sorted by relevance' : 'Sorted A–Z';

  // Type counts computed on (q, category) without type filter
  const poolWithoutType = searchAndRank(q, category, '').list;
  const allTypesCount = poolWithoutType.length;
  const typeOptions = types.map((tName) => ({
    type: tName,
    count: poolWithoutType.filter((tool) => tool.type === tName).length,
    active: type === tName,
  }));

  // Category counts computed on (q, type)
  const allCategoriesCount = searchAndRank(q, '', type).list.length;
  const categoryCounts = Object.fromEntries(
    categories.map((c) => [c.key, searchAndRank(q, c.key, type).list.length]),
  );

  let emptyState = null;
  if (list.length === 0) {
    const scopeParts = [];
    if (category) scopeParts.push(shortLabels[category] || category);
    if (type) scopeParts.push(type);
    const scopeLabel = scopeParts.join(' · ') || 'selected filters';

    if (q && (category || type)) {
      const globalMatches = searchAndRank(q, '', '').list.length;
      if (globalMatches > 0) {
        emptyState = {
          kind: 'scoped-search',
          scopeLabel,
          globalMatches,
        };
      }
    }

    if (!emptyState && !q && (category || type)) {
      const categoryOnlyCount = category ? searchAndRank('', category, '').list.length : tools.length;
      const typeOnlyCount = type ? searchAndRank('', '', type).list.length : tools.length;
      emptyState = {
        kind: 'filter-combination',
        scopeLabel,
        categoryLabel: category ? shortLabels[category] : 'All tools',
        typeLabel: type,
        categoryOnlyCount,
        typeOnlyCount,
      };
    }

    if (!emptyState) {
      emptyState = {
        kind: 'global-search',
      };
    }
  }

  return {
    q,
    category,
    type,
    extraParams,
    list,
    pages,
    page,
    items,
    showFeatured,
    sortLabel,
    usedTypoFallback,
    allTypesCount,
    typeOptions,
    allCategoriesCount,
    categoryCounts,
    emptyState,
  };
}

function href(s = {}, patch = {}) {
  const next = { ...s, ...patch };
  const p = new URLSearchParams();
  for (const k of ['q', 'category', 'type']) {
    if (next[k]) p.set(k, next[k]);
  }
  if (next.page > 1) p.set('page', String(next.page));
  const extra = Array.isArray(next.extraParams) ? next.extraParams : [];
  for (const [k, v] of extra) {
    if (!CATALOG_PARAM_KEYS.has(k)) {
      p.append(k, v);
    }
  }
  return '/berlin-tools' + (p.size ? `?${p}` : '');
}

const esc = (s) =>
  String(s ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]),
  );

const icon = (n) => `<img class="ui-icon" src="${ASSETS_BASE}ui/${n}.svg" alt="" width="20" height="20">`;

function row(t, i, extra = '') {
  let url = t.href || `https://walkofberlin.com/tools/${t.slug}`;
  url = url
    .replace('https://www.berlinwalk.com', 'https://walkofberlin.com')
    .replace('https://www.walkofberlin.com', 'https://walkofberlin.com');
  const copy = t.shortLead || shortLeads[t.slug] || t.lead;
  return `<li class="tool-item ${extra}"><a class="tool-row" href="${esc(url)}" aria-label="${esc(t.title)}" data-slug="${esc(t.slug)}"><img class="tool-icon" src="${esc(toolImage(t.image))}" alt="" width="40" height="40" loading="${i < 3 ? 'eager' : 'lazy'}"><div class="row-copy"><div class="row-heading"><h3>${esc(t.title)}</h3></div><p><strong class="type-prefix">${esc(t.type || 'Tool')}</strong><span class="type-sep" aria-hidden="true"> · </span>${esc(copy)}</p></div>${icon('arrow-up-right')}</a></li>`;
}

function suggestions(items, empty = false) {
  return `<section class="suggestions ${empty ? 'recovery' : ''}" aria-labelledby="suggestions-title"><h2 id="suggestions-title">${empty ? 'Try one of these' : 'Start with these'}</h2><p class="section-intro">Useful tools for common Berlin questions.</p><ul class="tool-list">${items.map((t, i) => row(t, i, !empty && i > 2 ? 'extra-suggestion' : '')).join('')}</ul>${!empty ? '<button type="button" class="suggestion-toggle" aria-expanded="false">Show 3 more</button>' : ''}</section>`;
}

function pagination(s) {
  if (s.pages === 1) return '';
  const pages = [...new Set([1, s.page - 1, s.page, s.page + 1, s.pages])]
    .filter((p) => p > 0 && p <= s.pages)
    .sort((a, b) => a - b);
  return `<nav class="pagination" aria-label="Catalog pages"><span class="page-range">Showing ${(s.page - 1) * PAGE_SIZE + 1}–${Math.min(s.page * PAGE_SIZE, s.list.length)} of ${s.list.length}</span><div class="page-controls">${s.page > 1 ? `<a data-state href="${href(s, { page: s.page - 1 })}" rel="prev" aria-label="Previous page">${icon('arrow-left')}<span>Previous</span></a>` : ''}<span class="mobile-page">Page ${s.page} of ${s.pages}</span><span class="page-numbers">${pages.map((p, i) => (i && p - pages[i - 1] > 1 ? '<span class="ellipsis">…</span>' : '') + `<a data-state href="${href(s, { page: p })}" ${p === s.page ? 'aria-current="page"' : ''} aria-label="Page ${p}">${p}</a>`).join('')}</span>${s.page < s.pages ? `<a data-state href="${href(s, { page: s.page + 1 })}" rel="next" aria-label="Next page"><span>Next</span>${icon('arrow-right')}</a>` : ''}</div></nav>`;
}

function renderResultsLabel(s) {
  const catLabel = s.category ? shortLabels[s.category] : '';
  if (s.q) {
    const scope = [catLabel, s.type].filter(Boolean).join(' · ');
    return scope ? `Search results in ${scope}` : 'Search results';
  }
  const base = catLabel || 'All tools';
  return s.type ? `${base} · ${s.type}` : base;
}

function renderEmpty(s) {
  const st = s.emptyState || { kind: 'global-search' };

  if (st.kind === 'scoped-search') {
    const resWord = st.globalMatches === 1 ? 'result' : 'results';
    return `<div class="empty" data-empty-kind="scoped-search"><h3>No results in ${esc(st.scopeLabel)}.</h3><p>Your search matched ${st.globalMatches} ${resWord} outside this filter.</p><div class="empty-actions"><a data-state class="empty-btn empty-btn-primary" href="${href(s, { category: '', type: '', page: 1 })}">See ${st.globalMatches} ${resWord} in all tools</a><a data-state class="empty-btn" href="${href(s, { q: '', page: 1 })}">Clear search</a></div></div>${suggestions(featured.slice(0, 3), true)}`;
  }

  if (st.kind === 'filter-combination') {
    const typeLower = (st.typeLabel || 'selected').toLowerCase();
    return `<div class="empty" data-empty-kind="filter-combination"><h3>No ${esc(typeLower)} tools in ${esc(st.categoryLabel)}.</h3><p>There are ${st.categoryOnlyCount} tools in ${esc(st.categoryLabel)} and ${st.typeOnlyCount} ${esc(typeLower)} ${st.typeOnlyCount === 1 ? 'tool' : 'tools'} across all categories.</p><div class="empty-actions">${s.category ? `<a data-state class="empty-btn empty-btn-primary" href="${href(s, { type: '', page: 1 })}">Show all ${st.categoryOnlyCount} in ${esc(st.categoryLabel)}</a>` : ''}${s.type ? `<a data-state class="empty-btn" href="${href(s, { category: '', page: 1 })}">Show all ${st.typeOnlyCount} ${esc(st.typeLabel)} tools</a>` : ''}</div></div>${suggestions(featured.slice(0, 3), true)}`;
  }

  return `<div class="empty" data-empty-kind="global-search"><h3>No tools found.</h3><p>Try a landmark, station, neighborhood, or practical topic such as tickets, museum, BER airport, Sunday, or luggage.</p><div class="empty-actions"><a data-state class="empty-btn empty-btn-primary" href="${href(s, { q: '', category: '', type: '', page: 1 })}">Clear search</a></div></div>${suggestions(featured.slice(0, 3), true)}`;
}

function typeFallback(s) {
  const options = [{type: '', count: s.allTypesCount}, ...s.typeOptions];
  return `<noscript><nav class="type-fallback" aria-label="Filter by tool type">${options.map(o => `<a href="${esc(href(s, {type: o.type, page: 1}))}" ${s.type === o.type ? 'aria-current="true"' : ''}>${esc(o.type || 'All types')} (${o.count})</a>`).join('')}</nav></noscript>`;
}

function render(s) {
  const label = renderResultsLabel(s);
  return `<div class="heading-band"><div><p class="eyebrow">MAPS, CALCULATORS & LOCAL GUIDES</p><h1>Berlin Tools</h1><p class="total">${tools.length} free tools for Berlin</p></div><form id="search-form" class="search-form" action="/berlin-tools" method="get" role="search"><label class="sr-only" for="search">Search Berlin tools</label>${icon('search')}<input id="search" type="search" name="q" value="${esc(s.q)}" placeholder="Search tickets, what's open, museum, BER, rain…" autocomplete="off">${s.category ? `<input type="hidden" name="category" value="${esc(s.category)}">` : ''}${s.type ? `<input type="hidden" name="type" value="${esc(s.type)}">` : ''}${s.extraParams.map(([k,v]) => `<input type="hidden" name="${esc(k)}" value="${esc(v)}">`).join('')}${s.q ? `<a data-state class="search-clear" href="${href(s, { q: '', page: 1 })}" aria-label="Clear search">${icon('x')}</a>` : ''}<button type="submit" aria-label="Search">${icon('arrow-right')}</button></form></div><div class="catalog-layout"><aside class="sidebar"><nav aria-label="Tool categories" class="category-nav" data-category-nav><h2>Browse by topic</h2><a data-state data-category-key="" href="${href(s, { category: '', page: 1 })}" ${!s.category ? 'aria-current="true"' : ''}><span class="cat-label-desktop">All tools</span><span class="cat-label-mobile">All tools</span><span class="cat-count">${s.allCategoriesCount}</span></a>${categories.map((c) => `<a data-state data-category-key="${esc(c.key)}" href="${href(s, { category: c.key, page: 1 })}" ${s.category === c.key ? 'aria-current="true"' : ''}><span class="cat-label-desktop">${esc(shortLabels[c.key])}</span><span class="cat-label-mobile">${esc(mobileLabels[c.key])}</span><span class="cat-count">${s.categoryCounts[c.key] ?? 0}</span></a>`).join('')}</nav></aside><div class="content">${s.showFeatured ? suggestions(featured) : ''}<section class="results" aria-labelledby="results-title"><div class="results-heading"><div><h2 id="results-title" tabindex="-1">${esc(label)}</h2><p class="result-meta" role="status">${s.list.length} ${s.list.length === 1 ? 'tool' : 'tools'} <span>${esc(s.sortLabel)}</span></p></div><div class="type-filter" data-type-filter><button type="button" class="type-trigger${s.type ? ' is-filtered' : ''}" aria-haspopup="menu" aria-expanded="false" aria-controls="type-popover" data-type-trigger>${icon('sliders-horizontal')}<span>Type: <strong>${esc(s.type || 'All')}</strong></span></button><div class="type-popover" id="type-popover" role="menu" aria-label="Filter by tool type" hidden data-type-popover><div class="type-popover-head" role="presentation"><span>Tool type</span></div><div class="type-options-list" role="none"><a data-state data-type-option role="menuitemradio" tabindex="-1" aria-checked="${!s.type ? 'true' : 'false'}" class="type-option ${!s.type ? 'is-active' : ''}" href="${href(s, { type: '', page: 1 })}"><span>All types</span><span class="type-count">${s.allTypesCount}</span></a>${s.typeOptions.map((opt) => `<a data-state data-type-option role="menuitemradio" tabindex="-1" aria-checked="${opt.active ? 'true' : 'false'}" class="type-option ${opt.active ? 'is-active' : ''}" href="${href(s, { type: opt.type, page: 1 })}"><span>${esc(opt.type)}</span><span class="type-count">${opt.count}</span></a>`).join('')}</div></div></div></div>${typeFallback(s)}${s.q || s.category || s.type ? `<div class="active-filters">${s.category ? `<a data-state href="${href(s, { category: '', page: 1 })}">Category: ${esc(mobileLabels[s.category] || s.category)}${icon('x')}</a>` : ''}${s.type ? `<a data-state href="${href(s, { type: '', page: 1 })}">Type: ${esc(s.type)}${icon('x')}</a>` : ''}${s.q ? `<a data-state href="${href(s, { q: '', page: 1 })}">Clear search${icon('x')}</a>` : ''}${(s.category && s.type) || (s.q && (s.category || s.type)) ? `<a data-state href="${href(s, { q: '', category: '', type: '', page: 1 })}">Reset all${icon('x')}</a>` : ''}</div>` : ''}${s.items.length ? `<ul class="tool-list catalog-list">${s.items.map((t, i) => row(t, i)).join('')}</ul>${pagination(s)}` : renderEmpty(s)}</section></div></div>`;
}

return {PAGE_SIZE,categories,shortLabels,mobileLabels,tools,types,featured,normalizeText,stemToken,tokenize,searchAndRank,state,href,esc,render};
}
