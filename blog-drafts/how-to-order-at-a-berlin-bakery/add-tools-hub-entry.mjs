#!/usr/bin/env node
// Adds (or updates) the tools-hub entry for berlin-bakery-counter. Run from repo root.
import fs from 'node:fs';
import path from 'node:path';

const SLUG = 'berlin-bakery-counter';
const p = path.join(process.cwd(), 'tools-hub/data.json');
const hub = JSON.parse(fs.readFileSync(p, 'utf8'));
const arr = hub.tools || hub;

const entry = {
  slug: SLUG,
  title: 'Berlin Bakery Counter',
  lead: 'Rehearse a real German bakery order before you are standing in the queue. Tap what you want and this trainer writes the correct sentence, then walks you through the questions the counter asks back.',
  category: 'Discovery',
  hubCategory: 'FoodNightlife',
  type: 'Guide',
  tags: ['german', 'language', 'bakery', 'Bäckerei', 'Schrippe', 'Pfannkuchen', 'Brötchen', 'ordering', 'phrases', 'food'],
  aliases: ['order at a berlin bakery', 'german bakery phrases', 'how to order bread in germany', 'schrippe meaning', 'berliner vs pfannkuchen', 'bakery german'],
  image: '',
  widgetUrl: `https://fenerszymanski.github.io/berlinwalk-widgets/${SLUG}/`,
  embedHeight: 1750,
  relatedBlog: '/post/how-to-order-at-a-berlin-bakery',
  iconStatus: 'pending',
  cmsItemId: '',
};

const idx = arr.findIndex((t) => t.slug === SLUG);
if (idx >= 0) { arr[idx] = { ...arr[idx], ...entry }; console.log('updated existing tools-hub entry'); }
else { arr.push(entry); console.log('added tools-hub entry'); }

fs.writeFileSync(p, `${JSON.stringify(hub, null, 2)}\n`);
console.log('tools count now', arr.length);
