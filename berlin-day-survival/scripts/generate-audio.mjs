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

function ensureDir(file) {
  mkdirSync(path.dirname(file), { recursive: true });
}

function hasAudioFile(relativePath, minBytes = 1024) {
  const file = targetPath(relativePath);
  return existsSync(file) && statSync(file).size > minBytes;
}

function voicePath(roundId, choiceId, effectId = '') {
  const suffix = effectId ? `-${effectId}` : '';
  return `assets/audio/voice/${roundId}-${choiceId}${suffix}.mp3`;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

async function generateTts(relativePath, text) {
  if (hasAudioFile(relativePath)) {
    skipped.push(relativePath);
    return;
  }
  const file = targetPath(relativePath);
  ensureDir(file);
  const url = `${API_ROOT}/text-to-speech/${encodeURIComponent(data.audio.voiceId)}?output_format=${OUTPUT_FORMAT}`;
  const audio = await elevenPost(url, {
    text,
    model_id: data.audio.voiceModel || 'eleven_multilingual_v2',
    voice_settings: {
      stability: 0.82,
      similarity_boost: 0.68,
      style: 0.12,
      use_speaker_boost: true
    }
  });
  writeFileSync(file, audio);
  generated.push(relativePath);
  await delay(350);
}

async function generateAmbience(round) {
  const relativePath = round.ambience.file;
  if (hasAudioFile(relativePath)) {
    skipped.push(relativePath);
    return;
  }
  const file = targetPath(relativePath);
  ensureDir(file);
  const url = `${API_ROOT}/sound-generation?output_format=${OUTPUT_FORMAT}`;
  const audio = await elevenPost(url, {
    text: `${round.ambience.prompt}. ${data.audio.ambiencePromptSuffix}`,
    duration_seconds: Number(round.ambience.durationSeconds || 8),
    prompt_influence: 0.35
  });
  writeFileSync(file, audio);
  generated.push(relativePath);
  await delay(500);
}

function writeWav(relativePath, samples) {
  if (hasAudioFile(relativePath, 100)) {
    skipped.push(relativePath);
    return;
  }
  const sampleRate = 44100;
  const bytesPerSample = 2;
  const dataSize = samples.length * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * bytesPerSample, 28);
  buffer.writeUInt16LE(bytesPerSample, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  samples.forEach((sample, index) => {
    const value = Math.max(-1, Math.min(1, sample));
    buffer.writeInt16LE(Math.round(value * 32767), 44 + index * 2);
  });
  const file = targetPath(relativePath);
  ensureDir(file);
  writeFileSync(file, buffer);
  generated.push(relativePath);
}

function tone({ duration = 0.18, frequency = 620, frequencyEnd = frequency, gain = 0.22, type = 'sine' }) {
  const sampleRate = 44100;
  const total = Math.floor(sampleRate * duration);
  const samples = [];
  for (let i = 0; i < total; i += 1) {
    const t = i / sampleRate;
    const p = i / Math.max(1, total - 1);
    const freq = frequency + (frequencyEnd - frequency) * p;
    const phase = 2 * Math.PI * freq * t;
    let raw = Math.sin(phase);
    if (type === 'square') raw = raw >= 0 ? 1 : -1;
    if (type === 'triangle') raw = (2 / Math.PI) * Math.asin(Math.sin(phase));
    const envelope = Math.sin(Math.PI * p);
    samples.push(raw * envelope * gain);
  }
  return samples;
}

function makeUiSounds() {
  writeWav(data.audio.ui.select, tone({ duration: 0.12, frequency: 580, frequencyEnd: 860, gain: 0.15, type: 'triangle' }));
  writeWav(data.audio.ui.coin, [
    ...tone({ duration: 0.08, frequency: 840, frequencyEnd: 1120, gain: 0.18, type: 'sine' }),
    ...tone({ duration: 0.1, frequency: 1180, frequencyEnd: 920, gain: 0.11, type: 'triangle' })
  ]);
  writeWav(data.audio.ui.warning, tone({ duration: 0.18, frequency: 220, frequencyEnd: 150, gain: 0.2, type: 'square' }));
  writeWav(data.audio.ui.result, [
    ...tone({ duration: 0.1, frequency: 420, frequencyEnd: 680, gain: 0.15, type: 'triangle' }),
    ...tone({ duration: 0.12, frequency: 680, frequencyEnd: 940, gain: 0.14, type: 'triangle' }),
    ...tone({ duration: 0.16, frequency: 940, frequencyEnd: 1260, gain: 0.12, type: 'sine' })
  ]);
}

for (const round of data.rounds) {
  await generateAmbience(round);
}

for (const round of data.rounds) {
  for (const choice of round.choices) {
    await generateTts(voicePath(round.id, choice.id), choice.feedback);
    for (const [effectId, effect] of Object.entries(choice.conditionEffects || {})) {
      if (effect.feedback) await generateTts(voicePath(round.id, choice.id, effectId), effect.feedback);
    }
  }
}

makeUiSounds();

const notesPath = path.join(GAME_DIR, 'assets/audio/GENERATION_NOTES.json');
writeFileSync(notesPath, JSON.stringify({
  generatedAt: new Date().toISOString(),
  source: 'ElevenLabs for ambience and feedback voice; local PCM synthesis for UI sounds',
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
