// Re-download full-resolution Commons originals for the chosen set, then
// optimize to 1600px long edge / q86 JPEG masters for Wix upload.
// Usage: node optimize.mjs   (reads chosen.json: { rawName: outputName })
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const UA = 'BerlinWalkBlogBot/1.0 (https://www.berlinwalk.com; yusuf.ucuz@gmail.com)';
const RAW = 'images/raw';
const OUT = 'images/optimized';
fs.mkdirSync(OUT, { recursive: true });

const chosen = JSON.parse(fs.readFileSync('chosen.json', 'utf8'));

for (const [rawName, spec] of Object.entries(chosen)) {
  const outName = typeof spec === 'string' ? spec : spec.out;
  const crop = typeof spec === 'string' ? null : spec.crop; // [x,y,w,h] fractions
  const meta = JSON.parse(fs.readFileSync(path.join(RAW, `${rawName}.json`), 'utf8'));
  const fullPath = path.join(RAW, `${rawName}-full.jpg`);
  if (!fs.existsSync(fullPath)) {
    const buf = Buffer.from(await (await fetch(meta.fullUrl, { headers: { 'User-Agent': UA } })).arrayBuffer());
    fs.writeFileSync(fullPath, buf);
    console.log('DL', rawName, (buf.length / 1e6).toFixed(1) + 'MB');
  }
  const dst = path.join(OUT, `${outName}.jpg`);
  const py = `
from PIL import Image
im = Image.open(${JSON.stringify(fullPath)}).convert('RGB')
crop = ${crop ? JSON.stringify(crop) : 'None'}
if crop:
    w,h = im.size
    im = im.crop((int(crop[0]*w), int(crop[1]*h), int(crop[2]*w), int(crop[3]*h)))
im.thumbnail((1600,1600), Image.LANCZOS)
im.save(${JSON.stringify(dst)}, 'JPEG', quality=86, optimize=True, progressive=True)
print(${JSON.stringify(outName)}, im.size)
`;
  execFileSync('python3', ['-c', py], { stdio: 'inherit' });
}
