import fs from 'node:fs';
const FILES = [
  // interiors / buildings
  'Gemäldegalerie Berlin Room XVIII 2025 3.jpg',
  'Gemäldegalerie Berlin Room XVIII 2025 5.jpg',
  'Gemäldegalerie Room 38 2022.jpg',
  'Gemäldegalerie Berlin room 41 01 2022.jpg',
  'Gemäldegalerie Berlin Raum 41 02 2025.jpeg',
  'Le grand hall de la Gemäldegalerie (Berlin) (11476499523).jpg',
  'La coupole d\'entrée de la Gemäldegalerie (Berlin) (11476371994).jpg',
  'Gemäldegalerie Berlin Room I 2024.jpg',
  'Gemäldegalerie am Kulturforum Berlin.JPG',
  'Kulturforum.Berlin.2.jpg',
  'Kulturforum.Berlin.Portal.jpg',
  'Neue Nationalgalerie Berlin 2022-05-21 01.jpg',
  'Neue Nationalgalerie Berlin 2022-05-21 04.jpg',
  'Berliner Philharmonie Tiergartenstraße Berlin.jpg',
  '20220812 Berliner Philharmonie.jpg',
  // paintings (widget + inline)
  'Jan Vermeer van Delft - Young Woman with a Pearl Necklace - Google Art Project.jpg',
  'Pieter Brueghel the Elder - The Dutch Proverbs - Google Art Project.jpg',
  'Caravaggio - Cupid as Victor - Google Art Project.jpg',
  'Rembrandt (circle) - The Man with the Golden Helmet - Google Art Project.jpg',
  'Hans Holbein the Younger - George Gisze - 1532.jpg',
  'Lucas Cranach - Der Jungbrunnen (Gemäldegalerie Berlin).jpg',
  'Jan van Eyck - The Madonna in the Church - Google Art Project.jpg',
  'Raffael 033.jpg',
  'Botticelli - Venus - Gemäldegalerie Berlin.jpg',
  'Albrecht Dürer 078.jpg',
];
const meta = [];
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
fs.mkdirSync('images/raw', { recursive: true });
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
  const license = m.LicenseShortName?.value || '?';
  const licenseUrl = m.LicenseUrl?.value || '';
  const thumb = ii.thumburl || ii.url;
  const out = 'images/raw/' + f.replace(/[^a-zA-Z0-9.]+/g, '-');
  let ok = false;
  for (let attempt = 0; attempt < 4; attempt++) {
    const dl = await fetch(thumb, { headers: { 'User-Agent': 'BerlinWalkResearch/1.0 (berlinwalk.com; contact via site)' } });
    if (dl.ok) { fs.writeFileSync(out, Buffer.from(await dl.arrayBuffer())); ok = true; break; }
    console.log('DL retry ' + f + ' status ' + dl.status);
    await sleep(10000);
  }
  meta.push({ file: f, saved: out, width: ii.width, height: ii.height, license, licenseUrl, artist, descUrl: ii.descriptionurl, ok });
  console.log((ok ? 'OK ' : 'DLFAIL ') + f + ' | ' + license + ' | ' + artist.slice(0, 60));
}
fs.writeFileSync('images/candidates-meta.json', JSON.stringify(meta, null, 2));
console.log('DONE ' + meta.length);
