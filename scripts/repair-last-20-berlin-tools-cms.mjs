#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const API_ROOT = 'https://www.wixapis.com';
const SITE_ID = process.env.WIX_SITE_ID || '12ee5ea0-70a7-492f-8020-ffb27cbb630f';
const COLLECTION_ID = 'BerlinTools';
const APPLY = process.argv.includes('--apply');
const UNKNOWN_ARGS = process.argv.slice(2).filter((arg) => arg !== '--apply');
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT_DIR = path.join(REPO_ROOT, 'output', 'qa', 'blog-last20-quality-repair-20260819', 'berlin-tools-cms');
const CACHE_BUST = '20260819quality1';

if (UNKNOWN_ARGS.length) throw new Error(`Unknown argument(s): ${UNKNOWN_ARGS.join(', ')}`);

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

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function comparable(value) {
  const copy = clone(value || {});
  if (copy.metadata) {
    delete copy.metadata.createdTimestamp;
    delete copy.metadata.updatedTimestamp;
  }
  return copy;
}

function cleanCurrentData(data) {
  const copy = clone(data || {});
  for (const key of ['_id', '_createdDate', '_updatedDate', '_owner', '_revision']) delete copy[key];
  return copy;
}

function jsonLd(name, description, slug) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url: `https://www.berlinwalk.com/tools/${slug}`,
    applicationCategory: 'TravelApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  });
}

function replaceTextNode(richContent, id, expected, replacement) {
  let count = 0;
  function walk(value) {
    if (!value || typeof value !== 'object') return;
    if (value.type === 'TEXT' && value.id === id) {
      if (value.textData?.text !== expected) {
        throw new Error(`Body guard failed for ${id}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(value.textData?.text)}`);
      }
      value.textData.text = replacement;
      count += 1;
    }
    if (Array.isArray(value.nodes)) value.nodes.forEach(walk);
  }
  walk(richContent);
  if (count !== 1) throw new Error(`Body guard failed for ${id}: found ${count} matching node(s)`);
}

const TARGETS = [
  {
    id: '1c6add4a-2e68-40e3-9f4a-8a5013b38a7f',
    slug: 'berlin-solo-day-path',
    expected: {
      h1: 'Berlin Solo Day Path: Build a Day With One Good Anchor',
      lead: 'Choose one Berlin anchor, one middle hinge and one finish mood. Build a realistic solo day around real places, not a list of pins.',
      secondary: 'A three-step planning path for solo visitors choosing between a history-led, quieter or neighbourhood-led Berlin day.',
      intro: 'Start with the mood you need from Berlin today. The path adds one real middle hinge and one flexible finish, then gives you a three-stop day shape to check against live transport and opening information.',
      seoDescription: 'Choose one Berlin anchor, one middle hinge and one finish mood. Build a realistic solo day around Alexanderplatz, Museum Island, Tiergarten or Kreuzberg.',
      jsonLd: '{"@context":"https://schema.org","@type":"WebApplication","name":"Berlin Solo Day Path","description":"Choose one Berlin anchor, one middle hinge and one flexible finish for a realistic solo day.","url":"https://www.berlinwalk.com/tools/berlin-solo-day-path","applicationCategory":"TravelApplication","operatingSystem":"All","offers":{"@type":"Offer","price":"0","priceCurrency":"EUR"}}',
      widgetUrl: 'https://fenerszymanski.github.io/berlinwalk-widgets/berlin-solo-day-path/',
      relatedBlogTitle: 'Travelling Alone in Berlin: Build a Day With One Good Anchor',
      relatedBlogDescription: 'Travelling alone in Berlin is easier with one good anchor. Build a three-stop day around real places, then keep the finish flexible.',
    },
    next: {
      h1: 'Berlin Solo Day Path: Pick the Right Area',
      lead: 'Choose the historic centre, Tiergarten or Kreuzberg first, then build a solo Berlin day with one proper stop and a nearby finish.',
      secondary: 'A three-step planning path that turns three real choices into 27 place-led solo day routes.',
      intro: 'Choose the part of Berlin you want first. Then choose one proper middle stop and a nearby finish. The tool returns real places and 27 distinct combinations; it does not promise live opening hours, tickets, travel time or transport.',
      seoDescription: 'Choose the historic centre, Tiergarten or Kreuzberg, then build one of 27 solo Berlin day routes with a proper stop and a nearby finish.',
      jsonLd: jsonLd('Berlin Solo Day Path', 'Choose the historic centre, Tiergarten or Kreuzberg, then build one of 27 place-led solo Berlin day routes.', 'berlin-solo-day-path'),
      widgetUrl: `https://fenerszymanski.github.io/berlinwalk-widgets/berlin-solo-day-path/?v=${CACHE_BUST}`,
      relatedBlogTitle: 'Travelling Alone in Berlin: Pick the Right Area for Your Solo Day',
      relatedBlogDescription: 'Choose the historic centre, Tiergarten or Kreuzberg first, then build a solo day with one proper stop and a flexible finish.',
    },
    body: [
      ['text_2', 'One anchor, one hinge, one finish', 'One area, one proper stop, one nearby finish'],
      ['text_4', 'Choose the mood you need first: history around Alexanderplatz and Museum Island, a quieter reset through Tiergarten, or neighbourhood life around Kottbusser Tor and Markthalle Neun.', 'Choose where you want to begin first: the historic centre around Alexanderplatz and Museum Island, Tiergarten for a quieter reset, or Kreuzberg around Kottbusser Tor and Markthalle Neun.'],
      ['text_12', 'Use the BVG connection search shortly before you leave each anchor. If a place is already giving the day a good pace, staying there is often the better decision.', 'Use the BVG connection search shortly before you leave each place. Check official venue details as well, because the tool does not use live opening or transport data.'],
    ],
  },
  {
    id: 'e86f6dd4-b21b-4a64-90a3-ad57365c7cea',
    slug: 'berlin-private-route-brief',
    expected: {
      h1: 'Berlin Private Route Brief: See the Route Before You Enquire',
      lead: 'See the real 11-stop BerlinWalk route across 16 places, then pick the version of the walk your group needs before you enquire.',
      secondary: 'A free map of the historic centre route I actually walk, with the six versions groups ask me for.',
      intro: 'The route does not change when a walk goes private. The same eleven stops run from the World Clock at Alexanderplatz to Hackescher Markt, about three kilometres in about two hours. What changes is your date, your group and where the time goes. Pick the version your group needs and the map shows which stops keep it.',
      seoDescription: 'See the real 11-stop BerlinWalk route across 16 places, then pick the version of the private walk your group needs before you enquire.',
      jsonLd: '{"@context":"https://schema.org","@type":"WebApplication","name":"Berlin Private Route Brief","description":"See the real 11-stop BerlinWalk route across 16 places and pick the version of the private walk your group needs.","url":"https://www.berlinwalk.com/tools/berlin-private-route-brief","applicationCategory":"TravelApplication","operatingSystem":"All","offers":{"@type":"Offer","price":"0","priceCurrency":"EUR"}}',
      widgetUrl: 'https://fenerszymanski.github.io/berlinwalk-widgets/berlin-private-route-brief/',
      relatedBlogDescription: 'Start with three real Berlin places, then choose a fixed central walk or a private route that fits the group day.',
    },
    next: {
      h1: 'Berlin Private Route Brief: Pick the Version Your Group Needs',
      lead: 'Compare six private-walk versions in Berlin\'s historic centre, then see which main stopping points keep the time before you enquire.',
      secondary: 'A map of the main historic-centre stopping points with six pace and emphasis versions that can be confirmed for a private group.',
      intro: 'A private walk can stay in the historic centre around Alexanderplatz, Museum Island and Hackescher Markt while changing where the time goes. Pick one of six versions and see which main stopping points keep the time. The map is a planning brief, not a promised final route. I confirm the final order, meeting point and access fit after you share the group details.',
      seoDescription: 'Compare six private-walk versions in Berlin\'s historic centre and see which main stopping points keep the time before you enquire.',
      jsonLd: jsonLd('Berlin Private Route Brief', 'Compare six private-walk versions in Berlin\'s historic centre and see which main stopping points keep the time.', 'berlin-private-route-brief'),
      widgetUrl: `https://fenerszymanski.github.io/berlinwalk-widgets/berlin-private-route-brief/?v=${CACHE_BUST}`,
      relatedBlogDescription: 'Choose between the fixed public walk and a private historic-centre route whose pace and emphasis can be confirmed around your group.',
    },
    body: [
      ['text_2', 'See the route I actually walk', 'Compare the main stopping points'],
      ['text_4', 'Eleven stops across sixteen places, from the World Clock at Alexanderplatz to Hackescher Markt. About three kilometres, about two hours on foot. A private walk follows the same line, so the map here is the route rather than a suggestion.', 'The map shows the main historic-centre stopping points in walking order. It is a planning brief, not a promised final route or turn-by-turn navigation. I confirm the final order and meeting point after you share the group details.'],
      ['text_8', 'The classic centre, with children, step-free and slow, the 20th century, Museum Island focus, or just the highlights. Choose one and the map shows which stops keep the time and which ones I let go. That is what a private date changes, not the city.', 'Choose the classic centre, a version with children, a slower pace, the 20th century, a Museum Island focus or just the highlights. The map shows which main stopping points keep the time, while I confirm the final plan with you.'],
      ['text_12', 'A private walk is your own date, your group only, and one price for the whole group. The route stays in the historic centre, so keep Charlottenburg Palace or the East Side Gallery as a separate part of your trip. Check opening hours, tickets and access needs before you fix the day.', 'A private walk is your group\'s confirmed date and plan. The route stays in the historic centre, so keep Charlottenburg Palace or the East Side Gallery as a separate part of your trip. Share opening-hour, ticket and access needs before I confirm the day.'],
    ],
  },
  {
    id: '236b5839-161c-47f7-9770-2e82918ce4e6',
    slug: 'berlin-day-duet',
    expected: {
      h1: 'Berlin Day Duet: Find the Shared Hinge',
      lead: 'Two travellers privately choose two real Berlin postcards each, then reveal one shared hinge and a workable shape for the day.',
      seoDescription: 'Choose two Berlin places privately, pass the phone and reveal a shared anchor plus one personal stop for each traveller.',
      jsonLd: '{"@context":"https://schema.org","@type":"WebApplication","name":"Berlin Day Duet","description":"Two travellers privately choose two real Berlin postcards each, then reveal one shared hinge and a workable shape for the day.","url":"https://www.berlinwalk.com/tools/berlin-day-duet","applicationCategory":"TravelApplication","operatingSystem":"All","offers":{"@type":"Offer","price":"0","priceCurrency":"EUR"}}',
      widgetUrl: 'https://fenerszymanski.github.io/berlinwalk-widgets/berlin-day-duet/',
      relatedBlogDescription: 'A practical Berlin day for couples with different interests, connected by one shared hinge.',
    },
    next: {
      h1: 'Berlin Day Duet: Find the Shared Stop',
      lead: 'Two travellers privately choose two real Berlin postcards each, then reveal one shared stop and a workable shape for the day.',
      seoDescription: 'Choose two Berlin places privately, pass the phone and reveal a shared stop plus one personal choice for each traveller.',
      jsonLd: jsonLd('Berlin Day Duet', 'Two travellers privately choose two real Berlin postcards each, then reveal one shared stop and a workable shape for the day.', 'berlin-day-duet'),
      widgetUrl: `https://fenerszymanski.github.io/berlinwalk-widgets/berlin-day-duet/?v=${CACHE_BUST}`,
      relatedBlogDescription: 'A practical Berlin day for couples with different interests, connected by one shared pause.',
    },
    body: [],
  },
];

async function queryOne(target) {
  const payload = await wixFetch('/wix-data/v2/items/query', {
    method: 'POST',
    body: {
      dataCollectionId: COLLECTION_ID,
      query: { filter: { slug: target.slug }, paging: { limit: 2 } },
    },
  });
  const matches = payload.dataItems || [];
  if (matches.length !== 1) throw new Error(`Identity guard failed for ${target.slug}: found ${matches.length} CMS items`);
  const item = matches[0];
  if (item.id !== target.id || item.data?.slug !== target.slug) {
    throw new Error(`Identity guard failed for ${target.slug}: expected ${target.id}, got ${item.id}`);
  }
  return item;
}

function makeDesired(target, item) {
  const current = cleanCurrentData(item.data);
  for (const [key, expected] of Object.entries(target.expected)) {
    if (current[key] !== expected) {
      throw new Error(`Field guard failed for ${target.slug}.${key}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(current[key])}`);
    }
  }
  const desired = { ...current, ...target.next };
  desired.bodyContent = clone(current.bodyContent);
  for (const [id, expected, replacement] of target.body) {
    replaceTextNode(desired.bodyContent, id, expected, replacement);
  }
  return desired;
}

function verifyDesired(target, actual, desired) {
  if (actual.id !== target.id || actual.data?.slug !== target.slug) {
    throw new Error(`Readback identity mismatch for ${target.slug}`);
  }
  for (const key of [...Object.keys(target.next), ...(target.body.length ? ['bodyContent'] : [])]) {
    if (JSON.stringify(comparable(actual.data?.[key])) !== JSON.stringify(comparable(desired[key]))) {
      throw new Error(`Readback field mismatch for ${target.slug}.${key}`);
    }
  }
}

async function main() {
  const preflights = [];
  for (const target of TARGETS) {
    const item = await queryOne(target);
    const desired = makeDesired(target, item);
    preflights.push({ target, item, desired });
  }

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const plan = {
    generatedAt: new Date().toISOString(),
    mutationPerformed: APPLY,
    targets: preflights.map(({ target, item, desired }) => ({
      id: target.id,
      slug: target.slug,
      beforeHash: sha256(cleanCurrentData(item.data)),
      afterHash: sha256(desired),
      changedFields: [...Object.keys(target.next), ...(target.body.length ? ['bodyContent'] : [])],
    })),
  };
  await fs.writeFile(path.join(OUTPUT_DIR, APPLY ? 'apply-plan.json' : 'dry-run-plan.json'), `${JSON.stringify(plan, null, 2)}\n`);
  console.log(JSON.stringify(plan, null, 2));

  if (!APPLY) {
    console.log('DRY RUN ONLY. Re-run with --apply to update the three exact BerlinTools items.');
    return;
  }

  for (const { target, item, desired } of preflights) {
    const fresh = await queryOne(target);
    const freshDesired = makeDesired(target, fresh);
    if (sha256(freshDesired) !== sha256(desired)) throw new Error(`Fresh pre-write guard drifted for ${target.slug}`);

    await fs.writeFile(path.join(OUTPUT_DIR, `${target.slug}.rollback.json`), `${JSON.stringify(fresh, null, 2)}\n`);
    await wixFetch(`/wix-data/v2/items/${encodeURIComponent(target.id)}`, {
      method: 'PUT',
      body: { dataCollectionId: COLLECTION_ID, dataItem: { id: target.id, data: desired } },
    });
    const readback = await queryOne(target);
    verifyDesired(target, readback, desired);
    await fs.writeFile(path.join(OUTPUT_DIR, `${target.slug}.readback.json`), `${JSON.stringify(readback, null, 2)}\n`);
    console.log(`VERIFIED ${target.slug} ${target.id}`);
  }
}

main().catch((error) => {
  console.error(`ERROR: ${error.message || error}`);
  process.exitCode = 1;
});
