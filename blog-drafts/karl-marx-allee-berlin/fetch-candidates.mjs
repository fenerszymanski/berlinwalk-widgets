import fs from 'node:fs';
const FILES = [
  'Karl-Marx-Allee Berlin during new year 2021 01.jpg',
  'Berlin, Karl-Marx-Allee 56-68 (27. Dezember 2019).jpg',
  'Karl-Marx-Allee, Berlin (12.09.20)-1.jpg',
  'Karl-Marx-Allee, Berlin (12.09.20)-2.jpg',
  '2019-08-06 Karl-Marx-Allee, Berlin.jpg',
  'Frankfurter Tor November 2013.jpg',
  'Frankfurter Tor Westansicht Berlin April 2006 022.jpg',
  'Berlin-Friedrichshain, de noordelijke Frankfurter Tor Dm09085171 IMG 5345 2024-09-05 09.00.jpg',
  'Strausberger Platz HeGro.jpg',
  'Kelet-Berlin, Karl-Marx-Allee a Strausberger Platz felé nézve. Fortepan 50924.jpg',
  'Kelet-Berlin, Strausberger Platz, szemben a Karl Marx Allee. Fortepan 60022.jpg',
  'Kino International, Berlin-msu-2021-3439-.jpg',
  'Kino International Berlin, 2024 (02).jpg',
  'Cafe Moskau, Berlin-msu-2021-3718-.jpg',
  'Café Moskau (Berlin)-3991-n-.jpg',
  'Hochhaus an der Weberwiese (Karl-Marx-Allee, Berlin) (6074759112).jpg',
  'Cafe-Sibylle Berlin-msu-2021-3502-.jpg',
  'Stalindenkmal Berlin Ohr.JPG',
  'Portal Karl-Marx-Allee 81 in Berlin.jpg',
  '2019-08-08 Karl-Marx-Allee view from the Berliner Fernsehturm.jpg',
];
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
  const rec = { file: f, descUrl: ii.descriptionurl, thumb: ii.thumburl, full: ii.url, width: ii.width, height: ii.height, license: m.LicenseShortName?.value, licenseUrl: m.LicenseUrl?.value || '', artist, credit:(m.Credit?.value||'').replace(/<[^>]+>/g,' ').trim().slice(0,120), date:(m.DateTimeOriginal?.value||'').slice(0,40) };
  meta.push(rec);
  const out = 'images/raw/' + f.replace(/[^\w.\-]+/g, '_');
  if (!fs.existsSync(out)) {
    const r = await fetch(ii.thumburl, { headers: { 'User-Agent': 'BerlinWalkResearch/1.0 (berlinwalk.com)' } });
    fs.writeFileSync(out, Buffer.from(await r.arrayBuffer()));
  }
  console.log('OK ' + f + ' | ' + rec.license + ' | ' + artist.slice(0, 50) + ' | ' + rec.date);
}
fs.writeFileSync('images/candidates.json', JSON.stringify(meta, null, 2));
console.log('DONE', meta.length);
