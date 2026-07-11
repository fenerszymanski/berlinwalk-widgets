#!/usr/bin/env node

import { existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const gameRoot = path.resolve(here, '..');
const apiKey = process.env.ELEVENLABS_API_KEY;
const apiRoot = 'https://api.elevenlabs.io/v1';
const outputFormat = 'mp3_44100_128';

if (!apiKey) {
  throw new Error('Missing ELEVENLABS_API_KEY. Run from the workspace root: source scripts/load-api-keys.sh');
}

// This is the existing narrator used by the Hidden Berlin Audio Route. It is
// deliberately not the account holder's voice clone.
const narrator = {
  id: 'IWm8DnJ4NGjFI7QAM5lM',
  name: 'Stephan - Warm and friendly German voice',
  model: 'eleven_multilingual_v2',
  settings: {
    stability: 0.5,
    similarity_boost: 0.75,
    style: 0.25,
    use_speaker_boost: true,
    speed: 1
  }
};

const ambiences = [
  ['canal-morning', 'Gentle Berlin canal water, distant bicycle tyres on paving, a few soft birds, early summer morning, no speech, calm and close, seamless game ambience.', 9],
  ['city-evening', 'Natural Berlin evening street atmosphere, distant conversation without intelligible words, a passing tram far away, small cafe life, no music, no speech, seamless game ambience.', 9],
  ['ubahn', 'Berlin U-Bahn platform ambience, low train rumble in the distance, doors far away, footsteps, airy station reverb, no intelligible announcements or speech, seamless game ambience.', 8],
  ['home', 'Quiet Berlin Altbau courtyard in daylight, faint wind through leaves, a bicycle rolling past in the distance, no speech, warm and domestic, seamless game ambience.', 8],
  ['night-city', 'Berlin night street atmosphere, soft low urban hum, distant bicycle, a muted club bass far away, no voices or intelligible speech, tasteful and understated, seamless game ambience.', 8],
  ['sunday', 'A slow Berlin Sunday park, soft leaves, distant children playing, a bicycle bell far away, no speech, generous open air, seamless game ambience.', 9]
];

const stingers = [
  ['cup', 'A single warm ceramic coffee cup set down on a cafe table, close and clean, no background music.', 1],
  ['footsteps', 'A short burst of confident footsteps on Berlin cobblestones, dry and close, no background music.', 1],
  ['market', 'A brief fabric and paper rustle from a lively outdoor market, warm and tactile, no speech.', 1],
  ['water', 'A soft short lapping water sound at a Berlin lakeshore, calm and clean, no music.', 1],
  ['city', 'A crisp understated Berlin city transition: a distant tram passing and a tiny urban swell, no speech, no music.', 1],
  ['glass', 'A small friendly glass clink at an outdoor Berlin table, brief and natural, no background music.', 1],
  ['announcement', 'A short neutral Berlin transit chime with a low station ambience, no words or speech.', 1],
  ['bike', 'A single Berlin bicycle bell followed by a light roll-away, close and playful, no music.', 1]
];

const resultLines = {
  mitte: 'Mitte. You collect Berlin by story. I would choose one route with context and let the details do the work.',
  'friedrichshain-kreuzberg': 'Friedrichshain-Kreuzberg. You want the city alive around you. Keep the plan loose and follow the side street that looks more interesting.',
  pankow: 'Pankow. You move best at Berlin’s calmer pace. Find a good table, notice the courtyard, and do not rush the next hour.',
  'charlottenburg-wilmersdorf': 'Charlottenburg-Wilmersdorf. You like Berlin with a good building and a useful plan. Pair one cultural stop with a proper walk.',
  spandau: 'Spandau. You are looking for Berlin without the race. An old-town detour and one clear story will suit you well.',
  'steglitz-zehlendorf': 'Steglitz-Zehlendorf. You like the open part of Berlin, but you plan the return. Pick one lake and give yourself enough daylight.',
  'tempelhof-schoeneberg': 'Tempelhof-Schöneberg. You like Berlin social and open to the sky. Bring somebody along, then let the afternoon make itself.',
  neukoelln: 'Neukölln. You follow a good detour. Pick an area, leave the checklist behind, and see where the side streets take you.',
  'treptow-koepenick': 'Treptow-Köpenick. Water gives your Berlin day a shape. Take the longer train ride and keep walking when the centre falls away.',
  'marzahn-hellersdorf': 'Marzahn-Hellersdorf. You notice space before hype. A broad view and a practical route will make the city feel larger.',
  lichtenberg: 'Lichtenberg. You make Berlin work by keeping it simple. One calm stop and one reliable connection are enough.',
  reinickendorf: 'Reinickendorf. You need some air around the day. Follow a green edge, take the slower route once, and keep the evening light.'
};

const args = new Set(process.argv.slice(2));
const onlyVoice = args.has('--voice');
const onlyEffects = args.has('--effects');
const generated = [];
const skipped = [];

function output(relativePath) {
  return path.join(gameRoot, relativePath);
}

function exists(relativePath) {
  const target = output(relativePath);
  return existsSync(target) && statSync(target).size > 1024;
}

function makeDirectory(relativePath) {
  mkdirSync(path.dirname(output(relativePath)), { recursive: true });
}

async function post(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg'
    },
    body: JSON.stringify(body)
  });
  const content = Buffer.from(await response.arrayBuffer());
  if (!response.ok) throw new Error(`ElevenLabs ${response.status}: ${content.toString('utf8').slice(0, 500)}`);
  return content;
}

function pause(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function makeSound(relativePath, prompt, durationSeconds) {
  if (exists(relativePath)) {
    skipped.push(relativePath);
    return;
  }
  makeDirectory(relativePath);
  const audio = await post(`${apiRoot}/sound-generation?output_format=${outputFormat}`, {
    text: prompt,
    duration_seconds: durationSeconds,
    prompt_influence: 0.35
  });
  writeFileSync(output(relativePath), audio);
  generated.push(relativePath);
  await pause(500);
}

async function makeVoice(districtId, line) {
  const relativePath = `assets/audio/results/${districtId}.mp3`;
  if (exists(relativePath)) {
    skipped.push(relativePath);
    return;
  }
  makeDirectory(relativePath);
  const audio = await post(`${apiRoot}/text-to-speech/${encodeURIComponent(narrator.id)}?output_format=${outputFormat}`, {
    text: line,
    model_id: narrator.model,
    voice_settings: narrator.settings
  });
  writeFileSync(output(relativePath), audio);
  generated.push(relativePath);
  await pause(400);
}

if (!onlyVoice) {
  for (const [id, prompt, duration] of ambiences) {
    await makeSound(`assets/audio/ambience/${id}.mp3`, prompt, duration);
  }
  for (const [id, prompt, duration] of stingers) {
    await makeSound(`assets/audio/stingers/${id}.mp3`, prompt, duration);
  }
}

if (!onlyEffects) {
  for (const [districtId, line] of Object.entries(resultLines)) {
    await makeVoice(districtId, line);
  }
}

const notes = {
  generatedAt: new Date().toISOString(),
  source: 'ElevenLabs',
  outputFormat,
  narrator: { id: narrator.id, name: narrator.name, model: narrator.model },
  availableAudioFiles: [
    ...ambiences.map(([id]) => `assets/audio/ambience/${id}.mp3`),
    ...stingers.map(([id]) => `assets/audio/stingers/${id}.mp3`),
    ...Object.keys(resultLines).map((districtId) => `assets/audio/results/${districtId}.mp3`)
  ].filter(exists),
  generated,
  skipped,
  totalAudioFiles: generated.length + skipped.length
};

writeFileSync(output('assets/audio/GENERATION_NOTES.json'), JSON.stringify(notes, null, 2) + '\n');
console.log(JSON.stringify({ ok: true, generated: generated.length, skipped: skipped.length, notes: 'assets/audio/GENERATION_NOTES.json' }, null, 2));
