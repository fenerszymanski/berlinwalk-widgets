#!/usr/bin/env node
// Adds the Quick Summary + FAQ + slug-map entries for how-to-order-at-a-berlin-bakery.
// Idempotent: overwrites the key if it already exists. Run from repo root.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SLUG = 'how-to-order-at-a-berlin-bakery';

const QS = {
  title: 'Ordering at a Berlin Bakery: Quick Summary',
  icon: '🥐',
  kicker: 'BERLINWALK.COM • GERMAN LANGUAGE',
  items: [
    '**Every bakery order follows the same short pattern**, so you only need one opening line: "Ich hätte gern..." (I would like...), then name what you want and finish with "bitte".',
    '**Greet before you order.** A quick "Hallo" or "Guten Morgen" is the normal courteous start; skipping it can read as abrupt.',
    '**Learn the two Berlin words that phrasebooks miss**: a bread roll is a *Schrippe* here (a *Brötchen* elsewhere), and the jam doughnut is a *Pfannkuchen*, not a *Berliner*.',
    '**They will ask you two or three things back**: "Noch etwas?" (anything else?), "Zum Hieressen oder zum Mitnehmen?" (eat in or take away?) and "Bar oder Karte?" (cash or card?).',
    '**Carry a little cash.** Some small bakeries are cash-only or set a card minimum; many chains and café-bakeries take cards. Check the till sign and keep a backup.',
    '**If the German runs out, point.** "Einmal das, bitte" (one of those, please) at the glass case gets you served anywhere in Berlin.',
  ],
};

const FAQ = {
  title: 'Ordering at a Berlin Bakery: FAQ',
  subtitle: 'The words, the questions back, and the small habits that get you served.',
  items: [
    {
      q: 'How do you order at a bakery in Berlin?',
      a: 'Greet first with "Hallo" or "Guten Morgen", then open with "Ich hätte gern..." (I would like...), name what you want, and finish with "bitte". A full order sounds like "Ich hätte gern eine Schrippe und einen Pfannkuchen, bitte." You do not need perfect grammar, and you can point at the case for anything you cannot name.',
    },
    {
      q: 'What is a Schrippe?',
      a: 'A Schrippe is the Berlin word for a plain bread roll, which the rest of Germany calls a Brötchen. You will see it on price labels and hear it at the counter. Both words work, but asking for a Schrippe sounds local.',
    },
    {
      q: 'Why is a Berliner called a Pfannkuchen in Berlin?',
      a: 'The jam-filled, sugar-dusted doughnut that most of Germany calls a "Berliner" is simply a "Pfannkuchen" in Berlin. Ask for "einen Berliner" here and you will still be understood, but say Pfannkuchen if you want no confusion at all.',
    },
    {
      q: 'What will the person behind the counter ask me?',
      a: 'Usually three things: "Noch etwas?" (anything else?), "Zum Hieressen oder zum Mitnehmen?" (to eat in or take away?), and "Bar oder Karte?" (cash or card?). Short answers are fine: "Nein, danke", "zum Mitnehmen", "Karte".',
    },
    {
      q: 'Do Berlin bakeries take card?',
      a: 'Many chains and café-bakeries take cards, but some small neighbourhood bakeries are cash-only or set a card minimum. Glance for a card symbol at the till and keep a little cash as a backup.',
    },
    {
      q: 'What if I do not know the German word for what I want?',
      a: 'Point and say "Einmal das, bitte" (one of those, please). The whole order is standing in the glass case, so pointing is completely normal and gets you served everywhere in Berlin. Add "und einen Kaffee" if you want a coffee with it.',
    },
  ],
};

function upsert(file, key, value) {
  const p = path.join(ROOT, file);
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  const existed = Object.prototype.hasOwnProperty.call(data, key);
  data[key] = value;
  fs.writeFileSync(p, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`${existed ? 'updated' : 'added'} ${key} in ${file}`);
}

upsert('quick-summary/data.json', SLUG, QS);
upsert('faq/data.json', SLUG, FAQ);

const smPath = path.join(ROOT, 'faq/slug-map.json');
const sm = JSON.parse(fs.readFileSync(smPath, 'utf8'));
sm[SLUG] = SLUG;
fs.writeFileSync(smPath, `${JSON.stringify(sm, null, 2)}\n`);
console.log(`slug-map: ${SLUG} -> ${SLUG}`);
