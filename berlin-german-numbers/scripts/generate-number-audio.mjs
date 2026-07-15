#!/usr/bin/env node
// Generate German number pronunciations (0-100) with ElevenLabs for the
// berlin-german-numbers widget. Uses the same German narrator already used by
// the Hidden Berlin audio route (Stephan). Output: berlin-german-numbers/audio/<n>.mp3
//
// Run from the workspace root:
//   source scripts/load-api-keys.sh
//   node berlinwalk-widgets/berlin-german-numbers/scripts/generate-number-audio.mjs

import { existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const widgetRoot = path.resolve(here, '..');
const audioDir = path.join(widgetRoot, 'audio');
const apiKey = process.env.ELEVENLABS_API_KEY;
const apiRoot = 'https://api.elevenlabs.io/v1';
const outputFormat = 'mp3_44100_64';

if (!apiKey) {
  throw new Error('Missing ELEVENLABS_API_KEY. Run from the workspace root: source scripts/load-api-keys.sh');
}

const narrator = {
  id: 'IWm8DnJ4NGjFI7QAM5lM',
  name: 'Stephan - Warm and friendly German voice',
  model: 'eleven_multilingual_v2',
  settings: {
    stability: 0.55,
    similarity_boost: 0.75,
    style: 0.15,
    use_speaker_boost: true,
    speed: 0.9,
  },
};

// German number word for 0-100. Must match the widget's on-screen word so the
// audio and the visible spelling are the same. 100 is spoken "hundert".
const ONES = ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun'];
const PREFIX = ['', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun'];
const TEENS = ['zehn', 'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'];
const TENS = { 20: 'zwanzig', 30: 'dreißig', 40: 'vierzig', 50: 'fünfzig', 60: 'sechzig', 70: 'siebzig', 80: 'achtzig', 90: 'neunzig' };

function germanWord(n) {
  if (n <= 9) return ONES[n];
  if (n <= 19) return TEENS[n - 10];
  if (n === 100) return 'hundert';
  const tens = Math.floor(n / 10) * 10;
  const unit = n % 10;
  if (unit === 0) return TENS[tens];
  return PREFIX[unit] + 'und' + TENS[tens];
}

async function tts(text) {
  const response = await fetch(`${apiRoot}/text-to-speech/${encodeURIComponent(narrator.id)}?output_format=${outputFormat}`, {
    method: 'POST',
    headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
    body: JSON.stringify({ text, model_id: narrator.model, voice_settings: narrator.settings }),
  });
  const content = Buffer.from(await response.arrayBuffer());
  if (!response.ok) throw new Error(`ElevenLabs ${response.status}: ${content.toString('utf8').slice(0, 400)}`);
  return content;
}

function pause(ms) { return new Promise((r) => setTimeout(r, ms)); }

const args = new Set(process.argv.slice(2));
const force = args.has('--force');

mkdirSync(audioDir, { recursive: true });

const generated = [];
const skipped = [];
const manifest = {};

for (let n = 0; n <= 100; n++) {
  const word = germanWord(n);
  manifest[n] = word;
  const file = path.join(audioDir, `${n}.mp3`);
  if (!force && existsSync(file) && statSync(file).size > 1024) {
    skipped.push(n);
    continue;
  }
  const audio = await tts(word);
  writeFileSync(file, audio);
  generated.push(n);
  process.stdout.write(`OK ${n} = ${word} (${audio.length} bytes)\n`);
  await pause(300);
}

writeFileSync(path.join(audioDir, 'manifest.json'), JSON.stringify({
  generatedAt: new Date().toISOString(),
  source: 'ElevenLabs',
  outputFormat,
  narrator: { id: narrator.id, name: narrator.name, model: narrator.model, settings: narrator.settings },
  range: '0-100',
  words: manifest,
}, null, 2) + '\n');

console.log(JSON.stringify({ ok: true, generated: generated.length, skipped: skipped.length, total: 101 }));
