import fs from 'node:fs';
const UA = 'BerlinWalkBlogBot/1.0 (https://www.berlinwalk.com; yusuf.ucuz@gmail.com)';
const PICKS = [
  ['01-kurfurstendamm-berlin-cover', '20220812 Kaiser-Wilhelm-Gedächtniskirche.jpg'],
  ['02-kurfurstendamm-berlin-tauentzienstrasse-axis', 'Tauentzienstr from KaDeWe.jpg'],
  ['03-kurfurstendamm-berlin-street-ubahn-entrance', '2023-01-23 Kurfürstendamm (Berlin-Charlottenburg) 3.jpg'],
  ['04-kurfurstendamm-berlin-bikini-berlin', 'Bikinihs KW GedKirche Astoria.jpg'],
  ['05-kurfurstendamm-berlin-savignyplatz', 'Charlottenburg Savignyplatz 03.jpg'],
  ['06-kurfurstendamm-berlin-schaubuehne', 'Berlin Schaubühne nachts.jpg'],
  ['07-kurfurstendamm-berlin-tauentzienstrasse-1978', '1978-04-XX Berlin-Charlottenburg Tauentzienstraße b.jpg'],
];
const titles = PICKS.map(([, f]) => 'File:' + f).join('|');
const u = new URL('https://commons.wikimedia.org/w/api.php');
u.searchParams.set('action', 'query'); u.searchParams.set('format', 'json');
u.searchParams.set('titles', titles);
u.searchParams.set('prop', 'imageinfo');
u.searchParams.set('iiprop', 'url|size|extmetadata');
const j = await (await fetch(u, { headers: { 'User-Agent': UA } })).json();
const byTitle = {};
for (const p of Object.values(j.query.pages)) byTitle[p.title] = p;
const out = [];
for (const [name, file] of PICKS) {
  const p = byTitle['File:' + file];
  if (!p || !p.imageinfo) { console.error('MISSING', file); continue; }
  const ii = p.imageinfo[0]; const m = ii.extmetadata || {};
  const strip = (s) => (s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const rec = {
    name, file,
    page: ii.descriptionurl,
    url: ii.url,
    artist: strip(m.Artist?.value) || '?',
    license: strip(m.LicenseShortName?.value) || '?',
    licurl: m.LicenseUrl?.value || '',
    src: `${ii.width}x${ii.height}`,
  };
  const buf = Buffer.from(await (await fetch(ii.url, { headers: { 'User-Agent': UA } })).arrayBuffer());
  const ext = ii.url.split('.').pop().toLowerCase();
  fs.writeFileSync(`images/raw/${name}.${ext}`, buf);
  rec.rawfile = `${name}.${ext}`;
  out.push(rec);
  console.log(name, rec.license, '|', rec.artist, '|', rec.src, '|', Math.round(buf.length / 1024) + 'KB');
  await new Promise(r => setTimeout(r, 1200));
}
fs.writeFileSync('images/sources.json', JSON.stringify(out, null, 1));
