#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');

const ROOT = path.resolve(__dirname, '..');
const BRAND_ROOT = process.env.BERLINWALK_BRAND_ROOT;
if (!BRAND_ROOT) throw new Error('Set BERLINWALK_BRAND_ROOT to the workspace brand directory.');

const OUT = path.join(ROOT, 'audio-tours', 'assets', 'social');
const W = 1200;
const H = 630;
const COLORS = {
  ink: '#102414',
  green: '#1B5E20',
  yellow: '#FFE600',
  lime: '#7CB342',
  cream: '#FAFAF5',
  white: '#FFFFFF',
};

const PHOTO_URLS = {
  hidden: 'https://app.berlinwalk.com/assets/hidden-berlin-audio-route/photos/generated/hidden-berlin-premium-hero-v1.jpg',
  death: 'https://app.berlinwalk.com/assets/death-strip-audio-route/photos/bernauer-memorial-strip.jpg',
  medieval: 'https://app.berlinwalk.com/assets/medieval-berlin-audio-tour/photos/marienkirche-tv-tower.jpg',
  reich: 'https://app.berlinwalk.com/assets/third-reich-berlin-audio-tour/photos/topography-site-wall.jpg',
  kreuzberg: 'https://app.berlinwalk.com/assets/kreuzberg-street-art-audio-tour/photos/oberbaumbruecke.jpg',
};

function registerFonts() {
  const registrations = [
    [path.join(BRAND_ROOT, 'fonts', 'editorial-v2', 'Fraunces-Variable.ttf'), 'Fraunces'],
    [path.join(BRAND_ROOT, 'fonts', 'editorial-v2', 'SpaceGrotesk-Variable.ttf'), 'Space Grotesk'],
    [path.join(BRAND_ROOT, 'fonts', 'editorial-v2', 'IBMPlexMono-SemiBold.ttf'), 'IBM Plex Mono'],
  ];
  for (const [file, family] of registrations) {
    if (!GlobalFonts.registerFromPath(file, family)) throw new Error(`Could not register ${family}`);
  }
}

async function loadRemoteImage(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return loadImage(Buffer.from(await response.arrayBuffer()));
}

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
}

function drawCover(ctx, image, x, y, width, height, positionX = 0.5, positionY = 0.5, radius = 0) {
  const scale = Math.max(width / image.width, height / image.height);
  const sw = width / scale;
  const sh = height / scale;
  const sx = Math.max(0, Math.min(image.width - sw, (image.width - sw) * positionX));
  const sy = Math.max(0, Math.min(image.height - sh, (image.height - sh) * positionY));
  ctx.save();
  if (radius) {
    roundedRect(ctx, x, y, width, height, radius);
    ctx.clip();
  }
  ctx.drawImage(image, sx, sy, sw, sh, x, y, width, height);
  ctx.restore();
}

function drawContain(ctx, image, x, y, width, height) {
  const scale = Math.min(width / image.width, height / image.height);
  const dw = image.width * scale;
  const dh = image.height * scale;
  ctx.drawImage(image, x, y + (height - dh) / 2, dw, dh);
}

function drawKicker(ctx, text, x, y, color = COLORS.yellow, align = 'left') {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = '600 16px "IBM Plex Mono"';
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawLines(ctx, lines, x, y, lineHeight, align = 'left') {
  ctx.save();
  ctx.textAlign = align;
  lines.forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight));
  ctx.restore();
}

function addTint(ctx, x, y, width, height, color, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
  ctx.restore();
}

function drawVariantA(images) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = COLORS.ink;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = COLORS.yellow;
  ctx.fillRect(0, 0, W, 8);
  ctx.fillRect(606, 0, 10, H);

  drawContain(ctx, images.logoYellow, 62, 42, 230, 56);
  drawKicker(ctx, 'PRESS PLAY. STEP INTO BERLIN.', 64, 164);
  ctx.fillStyle = COLORS.cream;
  ctx.font = 'bold 82px Fraunces';
  drawLines(ctx, ['Berlin', 'Audio Tours'], 62, 250, 82);
  ctx.fillStyle = 'rgba(250,250,245,0.82)';
  ctx.font = '500 25px "Space Grotesk"';
  drawLines(ctx, ['Five self-guided walks, written around', 'the places where the history happened.'], 64, 464, 34);
  drawKicker(ctx, 'BERLINWALK.COM/AUDIO-TOURS', 64, 578, COLORS.lime);

  const x = 642;
  drawCover(ctx, images.hidden, x, 32, 326, 274, 0.62, 0.53, 14);
  drawCover(ctx, images.medieval, 980, 32, 188, 274, 0.63, 0.38, 14);
  drawCover(ctx, images.death, x, 318, 188, 280, 0.55, 0.48, 14);
  drawCover(ctx, images.reich, 842, 318, 146, 280, 0.48, 0.5, 14);
  drawCover(ctx, images.kreuzberg, 1000, 318, 168, 280, 0.5, 0.5, 14);
  addTint(ctx, x, 32, 526, 566, COLORS.green, 0.08);
  return canvas;
}

function drawVariantB(images) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  drawCover(ctx, images.hidden, 0, 0, W, H, 0.63, 0.55);
  const gradient = ctx.createLinearGradient(0, 0, 800, 0);
  gradient.addColorStop(0, 'rgba(2,13,7,0.98)');
  gradient.addColorStop(0.55, 'rgba(2,13,7,0.78)');
  gradient.addColorStop(1, 'rgba(2,13,7,0.18)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = COLORS.yellow;
  ctx.fillRect(0, 0, W, 8);

  drawContain(ctx, images.logoYellow, 64, 42, 220, 54);
  drawKicker(ctx, 'AUDIO WALKS BY BERLINWALK', 64, 152);
  ctx.fillStyle = COLORS.cream;
  ctx.font = 'bold 82px Fraunces';
  drawLines(ctx, ['Press play.', 'Step into Berlin.'], 62, 242, 80);
  ctx.fillStyle = 'rgba(250,250,245,0.84)';
  ctx.font = '500 24px "Space Grotesk"';
  ctx.fillText('Five self-guided audio walks', 64, 426);

  const frames = [images.death, images.medieval, images.reich, images.kreuzberg];
  frames.forEach((image, index) => {
    const fx = 64 + index * 164;
    drawCover(ctx, image, fx, 466, 150, 112, 0.5, 0.5, 9);
    ctx.strokeStyle = index === 0 ? COLORS.yellow : 'rgba(250,250,245,0.42)';
    ctx.lineWidth = index === 0 ? 4 : 2;
    roundedRect(ctx, fx, 466, 150, 112, 9);
    ctx.stroke();
  });
  drawKicker(ctx, 'BERLINWALK.COM/AUDIO-TOURS', 1170, 582, COLORS.yellow, 'right');
  return canvas;
}

function drawVariantC(images) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = COLORS.cream;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = COLORS.green;
  ctx.fillRect(0, 0, 492, H);
  ctx.fillStyle = COLORS.yellow;
  ctx.fillRect(492, 0, 8, H);

  drawContain(ctx, images.logoYellow, 56, 42, 220, 54);
  drawKicker(ctx, 'FIVE ROUTES. ONE CLEAR START.', 58, 158);
  ctx.fillStyle = COLORS.cream;
  ctx.font = 'bold 68px Fraunces';
  drawLines(ctx, ['Berlin', 'Audio Tours'], 56, 244, 72);
  ctx.fillStyle = 'rgba(250,250,245,0.84)';
  ctx.font = '500 23px "Space Grotesk"';
  drawLines(ctx, ['Self-guided walks through', 'Berlin history, on your phone.'], 58, 441, 33);
  drawKicker(ctx, 'BERLINWALK.COM/AUDIO-TOURS', 58, 576, COLORS.yellow);

  drawCover(ctx, images.hidden, 532, 34, 406, 264, 0.63, 0.5, 16);
  drawCover(ctx, images.medieval, 956, 34, 212, 264, 0.62, 0.42, 16);
  drawCover(ctx, images.death, 532, 316, 212, 280, 0.52, 0.48, 16);
  drawCover(ctx, images.reich, 762, 316, 188, 280, 0.5, 0.5, 16);
  drawCover(ctx, images.kreuzberg, 968, 316, 200, 280, 0.5, 0.5, 16);
  ctx.strokeStyle = 'rgba(16,36,20,0.18)';
  ctx.lineWidth = 2;
  [[532,34,406,264],[956,34,212,264],[532,316,212,280],[762,316,188,280],[968,316,200,280]].forEach(([x,y,w,h]) => {
    roundedRect(ctx, x, y, w, h, 16);
    ctx.stroke();
  });
  return canvas;
}

function drawVariantD(images) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  const frames = [images.hidden, images.death, images.medieval, images.reich, images.kreuzberg];
  frames.forEach((image, index) => drawCover(ctx, image, index * 240, 0, 240, H, 0.5, 0.5));
  addTint(ctx, 0, 0, W, H, COLORS.ink, 0.35);
  ctx.fillStyle = COLORS.yellow;
  ctx.fillRect(0, 0, W, 8);
  ctx.fillRect(0, H - 8, W, 8);

  ctx.fillStyle = 'rgba(16,36,20,0.94)';
  roundedRect(ctx, 92, 122, 1016, 386, 22);
  ctx.fill();
  ctx.strokeStyle = 'rgba(250,250,245,0.34)';
  ctx.lineWidth = 2;
  roundedRect(ctx, 92, 122, 1016, 386, 22);
  ctx.stroke();

  drawContain(ctx, images.logoYellow, 482, 156, 236, 58);
  drawKicker(ctx, 'PRESS PLAY. STEP INTO BERLIN.', 600, 263, COLORS.yellow, 'center');
  ctx.fillStyle = COLORS.cream;
  ctx.font = 'bold 87px Fraunces';
  ctx.textAlign = 'center';
  ctx.fillText('Berlin Audio Tours', 600, 363);
  ctx.fillStyle = 'rgba(250,250,245,0.82)';
  ctx.font = '500 25px "Space Grotesk"';
  ctx.fillText('Five self-guided walks through Berlin history', 600, 419);
  drawKicker(ctx, 'BERLINWALK.COM/AUDIO-TOURS', 600, 466, COLORS.lime, 'center');
  return canvas;
}

async function saveJpeg(canvas, filename, quality = 91) {
  const output = path.join(OUT, filename);
  fs.writeFileSync(output, await canvas.encode('jpeg', quality));
  return output;
}

async function main() {
  registerFonts();
  fs.mkdirSync(OUT, { recursive: true });
  const [hidden, death, medieval, reich, kreuzberg, logoYellow] = await Promise.all([
    loadRemoteImage(PHOTO_URLS.hidden),
    loadRemoteImage(PHOTO_URLS.death),
    loadRemoteImage(PHOTO_URLS.medieval),
    loadRemoteImage(PHOTO_URLS.reich),
    loadRemoteImage(PHOTO_URLS.kreuzberg),
    loadImage(path.join(ROOT, 'assets', 'berlinwalk-wordmark-yellow.png')),
  ]);
  const images = { hidden, death, medieval, reich, kreuzberg, logoYellow };
  const variants = [
    ['audio-tours-social-a-editorial-split-1200x630.jpg', drawVariantA(images)],
    ['audio-tours-social-b-cinematic-1200x630.jpg', drawVariantB(images)],
    ['audio-tours-social-c-editorial-atlas-1200x630.jpg', drawVariantC(images)],
    ['audio-tours-social-d-five-routes-1200x630.jpg', drawVariantD(images)],
  ];
  const paths = [];
  for (const [filename, canvas] of variants) paths.push(await saveJpeg(canvas, filename));
  paths.unshift(await saveJpeg(variants[0][1], 'audio-tours-social-1200x630.jpg'));

  const sheet = createCanvas(1220, 1300);
  const sctx = sheet.getContext('2d');
  sctx.fillStyle = '#E5E9E3';
  sctx.fillRect(0, 0, 1220, 1300);
  sctx.fillStyle = COLORS.ink;
  sctx.font = '600 18px "IBM Plex Mono"';
  const labels = ['A  EDITORIAL SPLIT', 'B  CINEMATIC NIGHT', 'C  EDITORIAL ATLAS', 'D  FIVE ROUTES'];
  for (let index = 0; index < variants.length; index += 1) {
    const x = index % 2 === 0 ? 10 : 615;
    const y = index < 2 ? 10 : 655;
    sctx.fillText(labels[index], x + 12, y + 24);
    sctx.drawImage(variants[index][1], x, y + 35, 595, 312.375);
    sctx.strokeStyle = 'rgba(16,36,20,0.25)';
    sctx.strokeRect(x, y + 35, 595, 312.375);
  }
  await saveJpeg(sheet, 'audio-tours-social-directions-contact-sheet.jpg', 88);
  process.stdout.write(`${paths.join('\n')}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
