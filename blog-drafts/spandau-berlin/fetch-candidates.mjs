import fs from 'node:fs';
const FILES = [
  'Aerial image of Spandau Citadel (view from the southeast).jpg',
  'Zitadelle B-Spandau 07-2017 img2.jpg',
  'Torgebäude der Zitadelle Spandau 20170611 20.jpg',
  'Zitadelle Spandau Palas & Juliusturm.jpg',
  '20190330 Zitadelle Spandau 01.jpg',
  'St. Nikolai-Kirche Berlin-Spandau 2026-04-06 01.jpg',
  'St. Nikolai-Kirche Berlin-Spandau 2026-04-06 02.jpg',
  'GotischesHausSpandau(Berlin)msu-2023-0I9A-2904-.jpg',
  'Stadtmauer & Turm & Befestigungsanlage & Stadtbefestigung Hoher Steinweg 02.jpg',
  'Reste der Stadtmauer aus dem 14. Jahrhundert in Spandau.jpg',
  'Reformationsplatz Berlin-Spandau 2026-04-06 01.jpg',
  'Reformationsplatz Berlin-Spandau 2026-04-06 04.jpg',
  '20190330 St. Marien am Behnitz 01.jpg',
  'Havel Lindenufer Spandau.JPG',
  'Zitadelle Spandau-Torhaus-1.JPG',
];
const meta = [];
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
for (const f of FILES) {
  await sleep(8000);
  const api = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=' + encodeURIComponent('File:' + f) + '&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=2000';
  let j;
  for (let attempt = 0; attempt < 5; attempt++) {
    const resp = await fetch(api, { headers: { 'User-Agent': 'BerlinWalkResearch/1.0 (berlinwalk.com; contact via site)' } });
    const text = await resp.text();
    try { j = JSON.parse(text); break; } catch { console.log('RATE ' + f + ' retry ' + attempt); await sleep(20000); }
  }
  if (!j) { console.log('FAIL ' + f); continue; }
  const p = Object.values(j.query.pages)[0];
  const ii = p.imageinfo?.[0];
  if (!ii) { console.log('MISS ' + f); continue; }
  const m = ii.extmetadata || {};
  const artist = (m.Artist?.value || '').replace(/<[^>]+>/g, '').trim();
  const rec = {
    file: f,
    descUrl: ii.descriptionurl,
    thumb: ii.thumburl,
    full: ii.url,
    width: ii.width, height: ii.height,
    license: m.LicenseShortName?.value, licenseUrl: m.LicenseUrl?.value || '',
    artist,
  };
  meta.push(rec);
  const out = 'images/raw/' + f.replace(/[^\w.\-]+/g, '_');
  if (!fs.existsSync(out)) {
    const r = await fetch(ii.thumburl, { headers: { 'User-Agent': 'BerlinWalkResearch/1.0 (berlinwalk.com)' } });
    fs.writeFileSync(out, Buffer.from(await r.arrayBuffer()));
  }
  console.log('OK ' + f + ' | ' + rec.license + ' | ' + artist.slice(0, 60));
}
fs.writeFileSync('images/candidates.json', JSON.stringify(meta, null, 2));
