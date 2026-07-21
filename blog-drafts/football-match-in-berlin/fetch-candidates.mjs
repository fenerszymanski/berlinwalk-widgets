import fs from 'node:fs';
import path from 'node:path';

const UA = 'BerlinWalkBlogBot/1.0 (https://www.berlinwalk.com; yusuf.ucuz@gmail.com)';
const OUT = path.join(process.cwd(), 'images/raw');
fs.mkdirSync(OUT, { recursive: true });

// title -> local name
const WANT = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'candidates.json'), 'utf8'));

for (const [title, name] of Object.entries(WANT)) {
  const u = new URL('https://commons.wikimedia.org/w/api.php');
  u.searchParams.set('action', 'query');
  u.searchParams.set('format', 'json');
  u.searchParams.set('titles', title);
  u.searchParams.set('prop', 'imageinfo');
  u.searchParams.set('iiprop', 'url|size|extmetadata');
  u.searchParams.set('iiurlwidth', '2000');
  const r = await fetch(u, { headers: { 'User-Agent': UA } });
  const j = await r.json();
  const page = Object.values(j.query?.pages || {})[0];
  const ii = page?.imageinfo?.[0];
  if (!ii) { console.log('MISS', title); continue; }
  const m = ii.extmetadata || {};
  const strip = (v) => String(v || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const meta = {
    title,
    descriptionUrl: ii.descriptionurl,
    license: strip(m.LicenseShortName?.value),
    licenseUrl: strip(m.LicenseUrl?.value),
    artist: strip(m.Artist?.value),
    credit: strip(m.Credit?.value),
    dateOriginal: strip(m.DateTimeOriginal?.value),
    width: ii.width,
    height: ii.height,
    fullUrl: ii.url,
  };
  const buf = Buffer.from(await (await fetch(ii.thumburl, { headers: { 'User-Agent': UA } })).arrayBuffer());
  fs.writeFileSync(path.join(OUT, `${name}.jpg`), buf);
  fs.writeFileSync(path.join(OUT, `${name}.json`), JSON.stringify(meta, null, 2));
  console.log('OK', name, ii.width + 'x' + ii.height, meta.license, '|', meta.artist.slice(0, 50));
}
