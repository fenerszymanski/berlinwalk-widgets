import fs from 'node:fs';
const FILES = [
  'Leipzig - Markt + Altes Rathaus 05 ies.jpg',
  'Leipzig - Markt + Altes Rathaus 04 ies.jpg',
  'Leipzig - Markt + Altes Rathaus 01 ies.jpg',
  'I11 338 Bf Leipzig Hbf, Bahnsteighallen Ostseite.jpg',
  'J23 656 Bf Leipzig Hbf, Bahnsteig 10-11.jpg',
  '20090908165MDR Leipzig Nikolaikirche zum Altar.jpg',
  'Nicolaikirche Leipzig Innenraum.JPG',
  'Интерьер церкви Св.Николая.jpg',
  'Thomaskirche Leipzig Westseite 2013.jpg',
  'Leipzig, de Thomaskirche Dm09290637 IMG 6906 2025-05-11 10.52.jpg',
  'Exterior of Thomaskirche (Leipzig) 2025.jpg',
  'Thomaskirche leipzig bach.jpg',
  'Johann Sebastian Bach - Leipzig.jpg',
  'Völkerschlachtdenkmal C-M.jpg',
  'Völkerschlachtdenkmal Leipzig 2020090838.jpg',
  'Völkerschlachtdenkmal Leipzig 2020090805.jpg',
  '20200912 Mädlerpassage 03.jpg',
  '20200912 Mädlerpassage 01.jpg',
  'Mädlerpassage Leipzig Eingang.jpg',
  'Runde-Ecke-Leipzig.jpg',
  'Leipzig - Dittrichring - Runde Ecke 07 ies.jpg',
];
fs.mkdirSync('images/raw',{recursive:true});
const meta = [];
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
for (const f of FILES) {
  await sleep(4000);
  const api = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=' + encodeURIComponent('File:' + f) + '&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=2000';
  let j;
  for (let attempt = 0; attempt < 5; attempt++) {
    const resp = await fetch(api, { headers: { 'User-Agent': 'BerlinWalkResearch/1.0 (berlinwalk.com; contact via site)' } });
    const text = await resp.text();
    try { j = JSON.parse(text); break; } catch { console.log('RATE ' + f + ' retry ' + attempt); await sleep(15000); }
  }
  if (!j) { console.log('FAIL ' + f); continue; }
  const p = Object.values(j.query.pages)[0];
  const ii = p.imageinfo?.[0];
  if (!ii) { console.log('MISS ' + f); continue; }
  const m = ii.extmetadata || {};
  const artist = (m.Artist?.value || '').replace(/<[^>]+>/g, '').trim();
  const rec = { file: f, descUrl: ii.descriptionurl, thumb: ii.thumburl, full: ii.url, width: ii.width, height: ii.height, license: m.LicenseShortName?.value, licenseUrl: m.LicenseUrl?.value || '', artist };
  meta.push(rec);
  const out = 'images/raw/' + f.replace(/[^\w.\-]+/g, '_');
  if (!fs.existsSync(out)) {
    const r = await fetch(ii.thumburl, { headers: { 'User-Agent': 'BerlinWalkResearch/1.0 (berlinwalk.com)' } });
    fs.writeFileSync(out, Buffer.from(await r.arrayBuffer()));
  }
  console.log('OK ' + f + ' | ' + rec.license + ' | ' + ii.width + 'x' + ii.height + ' | ' + artist.slice(0, 50));
}
fs.writeFileSync('images/candidates.json', JSON.stringify(meta, null, 2));
