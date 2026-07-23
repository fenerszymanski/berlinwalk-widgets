#!/usr/bin/env node
// One-shot: add baltic-sea-day-trip-from-berlin QS + FAQ entries and the
// baltic-beach-day-planner tools-hub entry to the repo data files.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SLUG = 'baltic-sea-day-trip-from-berlin';
const TOOL = 'baltic-beach-day-planner';

const qsPath = path.join(root, 'quick-summary/data.json');
const faqPath = path.join(root, 'faq/data.json');
const slugMapPath = path.join(root, 'faq/slug-map.json');
const toolsPath = path.join(root, 'tools-hub/data.json');

const qs = JSON.parse(fs.readFileSync(qsPath, 'utf8'));
const faq = JSON.parse(fs.readFileSync(faqPath, 'utf8'));
const slugMap = JSON.parse(fs.readFileSync(slugMapPath, 'utf8'));
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

if (qs[SLUG] || faq[SLUG]) throw new Error('Slug already present in QS/FAQ data');
if (tools.tools.some((t) => t.slug === TOOL)) throw new Error('Tool slug already present');

qs[SLUG] = {
  title: 'Baltic Sea Day Trip: Quick Summary',
  icon: '🌊',
  kicker: 'BERLINWALK.COM • TOURIST TIPS',
  items: [
    '**The Baltic coast starts less than three hours from Berlin by train.** Warnemünde is the fastest sand: RE5 to Rostock, a 21-minute S-Bahn hop, and the beach begins 400 metres from the platform.',
    '**Three towns cover almost every version of the trip**: Warnemünde for speed and the widest beach, the Usedom imperial resorts Heringsdorf and Ahlbeck for piers and villa architecture, Binz on Rügen for grandeur at the very edge of day-trip range.',
    '**Every regional connection runs on the Deutschlandticket** (63 euros a month in 2026), including the Usedom resort railway and the Rostock S-Bahn. Fast IC and ICE trains need a separate DB ticket.',
    '**Plan the return before you leave.** The last comfortable trains leave Warnemünde around 21:00, Heringsdorf around 19:33 and Binz between 16:00 and 18:00; later options arrive in Berlin well past midnight.',
    '**Small beach costs are real but tiny**: day spa fees of roughly 2 to 3 euros, beach chair rental around 15 euros a day, and the water in high summer sits between 17 and 20 degrees.',
    '**The 2026 Stadtbahn closure does not block the coast**: trains north leave from the low-level platforms at Hauptbahnhof and stop at Gesundbrunnen as normal.',
  ],
};

faq[SLUG] = {
  title: 'Baltic Sea from Berlin: FAQ',
  subtitle: 'Trains, tickets, beach fees and which coast town fits your day.',
  items: [
    {
      q: 'How far is the Baltic Sea from Berlin?',
      a: 'The closest worthwhile beach is Warnemünde, about two and a half to three hours door to sand: RE5 or InterCity from Berlin Hauptbahnhof to Rostock, then a 21-minute S-Bahn ride. Usedom takes roughly four hours, Binz on Rügen about four as well.',
    },
    {
      q: 'What is the cheapest way to reach the Baltic from Berlin?',
      a: 'The Deutschlandticket, 63 euros a month in 2026, covers every regional train on these routes, including the RE5 to Rostock, the RE3 plus the Usedom resort railway to Heringsdorf, and the Rostock S-Bahn to Warnemünde. Only IC and ICE trains need a separate ticket.',
    },
    {
      q: 'Which Baltic beach is best for a first one-day visit?',
      a: 'Warnemünde. It has the shortest journey, the widest beach, the 1898 lighthouse, the Alter Strom harbour with its fish-roll kiosks, and the station sits 400 metres from the sand. Usedom rewards a longer day; Binz really wants an overnight.',
    },
    {
      q: 'Can you do Rügen and Binz as a day trip from Berlin?',
      a: 'Barely. Regional connections take around four hours each way, and the one direct morning InterCity arrives around noon. It works on a long summer day with a perfect forecast, but arriving at noon and leaving by early evening shortchanges the place. If Rügen is the goal, stay a night.',
    },
    {
      q: 'Do I need to book the trains in advance?',
      a: 'Regional trains have no seat reservations and no booking requirement; with a Deutschlandticket you simply board. On sunny summer weekends they fill up, so board at Hauptbahnhof or Gesundbrunnen early. For the fast IC to Rostock or Binz, an advance Sparpreis fare is usually cheaper than buying on the day.',
    },
    {
      q: 'Is the Baltic warm enough to swim in?',
      a: 'In July and August the water usually reaches 17 to 20 degrees. That is a real swim, refreshing rather than warm, and the wind is constant enough that a light jacket and a rented beach chair both earn their keep.',
    },
    {
      q: 'Are the beaches free?',
      a: 'The sand is public, but German resort towns charge a small day spa fee: 2.25 euros in Warnemünde and around 3 euros in the Usedom and Rügen resorts, paid at machines or kiosks on the promenade. Beach chairs rent separately for about 15 euros a day.',
    },
  ],
};

if (!slugMap[SLUG]) slugMap[SLUG] = SLUG;

tools.tools.push({
  slug: TOOL,
  title: 'Baltic Beach Day Planner',
  lead: 'Race Warnemünde, Usedom and Binz against each other for one day by the sea. Pick your departure, ticket and return deadline and see how much real beach time each coast pays out.',
  category: 'Discovery',
  hubCategory: 'TripPlans',
  type: 'Planner',
  tags: ['baltic sea', 'beach', 'day trip', 'Warnemünde', 'Usedom', 'Binz', 'Rügen', 'Deutschlandticket', 'trains'],
  aliases: ['baltic sea day trip', 'beach day planner', 'warnemunde from berlin', 'usedom from berlin', 'binz from berlin', 'beach near berlin'],
  image: 'https://fenerszymanski.github.io/berlinwalk-widgets/tools-home/icons/baltic-beach-day-planner.png',
  widgetUrl: `https://fenerszymanski.github.io/berlinwalk-widgets/${TOOL}/`,
  embedHeight: 1650,
  relatedBlog: '/post/best-day-trips-from-berlin',
  iconStatus: 'pending',
});

fs.writeFileSync(qsPath, `${JSON.stringify(qs, null, 2)}\n`);
fs.writeFileSync(faqPath, `${JSON.stringify(faq, null, 2)}\n`);
fs.writeFileSync(slugMapPath, `${JSON.stringify(slugMap, null, 2)}\n`);
fs.writeFileSync(toolsPath, `${JSON.stringify(tools, null, 2)}\n`);
console.log('OK data files updated');
