#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GAME_DIR = path.resolve(__dirname, '..');
const DATA_PATH = path.join(GAME_DIR, 'data.json');
const API_ROOT = 'https://api.elevenlabs.io/v1';
const OUTPUT_FORMAT = 'mp3_44100_128';

const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  throw new Error('Missing ELEVENLABS_API_KEY. Run from workspace root: source scripts/load-api-keys.sh');
}

const data = JSON.parse(readFileSync(DATA_PATH, 'utf8'));
const generated = [];
const skipped = [];

function targetPath(relativePath) {
  return path.join(GAME_DIR, relativePath);
}

function hasAudioFile(relativePath) {
  const file = targetPath(relativePath);
  return existsSync(file) && statSync(file).size > 1024;
}

function ensureDir(file) {
  mkdirSync(path.dirname(file), { recursive: true });
}

async function elevenPost(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg'
    },
    body: JSON.stringify(body)
  });
  const arrayBuffer = await response.arrayBuffer();
  if (!response.ok) {
    const text = Buffer.from(arrayBuffer).toString('utf8');
    throw new Error(`ElevenLabs ${response.status}: ${text.slice(0, 500)}`);
  }
  return Buffer.from(arrayBuffer);
}

async function generateTts(option) {
  if (hasAudioFile(option.voiceFile)) {
    skipped.push(option.voiceFile);
    return;
  }
  const file = targetPath(option.voiceFile);
  ensureDir(file);
  const url = `${API_ROOT}/text-to-speech/${encodeURIComponent(data.audio.voiceId)}?output_format=${OUTPUT_FORMAT}`;
  const audio = await elevenPost(url, {
    text: option.reply,
    model_id: data.audio.voiceModel || 'eleven_multilingual_v2',
    voice_settings: {
      stability: 0.78,
      similarity_boost: 0.68,
      style: 0.16,
      use_speaker_boost: true
    }
  });
  writeFileSync(file, audio);
  generated.push(option.voiceFile);
  await delay(350);
}

async function generateAmbience(scene) {
  const relativePath = scene.ambience.file;
  if (hasAudioFile(relativePath)) {
    skipped.push(relativePath);
    return;
  }
  const file = targetPath(relativePath);
  ensureDir(file);
  const url = `${API_ROOT}/sound-generation?output_format=${OUTPUT_FORMAT}`;
  const audio = await elevenPost(url, {
    text: `${scene.ambience.prompt}. ${data.audio.ambiencePromptSuffix}`,
    duration_seconds: Number(scene.ambience.durationSeconds || 8),
    prompt_influence: 0.35
  });
  writeFileSync(file, audio);
  generated.push(relativePath);
  await delay(500);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

for (const scene of data.scenes) {
  await generateAmbience(scene);
}

for (const scene of data.scenes) {
  for (const option of scene.options) {
    await generateTts(option);
  }
}

const notesPath = path.join(GAME_DIR, 'assets/audio/GENERATION_NOTES.json');
writeFileSync(notesPath, JSON.stringify({
  generatedAt: new Date().toISOString(),
  source: 'ElevenLabs',
  outputFormat: OUTPUT_FORMAT,
  voiceId: data.audio.voiceId,
  voiceName: data.audio.voiceName,
  voiceDirection: data.audio.voiceDirection,
  generated,
  skipped,
  totalAudioFiles: generated.length + skipped.length
}, null, 2) + '\n');

console.log(JSON.stringify({
  ok: true,
  generated: generated.length,
  skipped: skipped.length,
  notes: path.relative(process.cwd(), notesPath)
}, null, 2));
