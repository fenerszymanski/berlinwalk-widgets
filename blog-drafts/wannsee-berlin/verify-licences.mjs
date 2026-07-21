const UA = 'BerlinWalkBlogBot/1.0 (https://www.berlinwalk.com; yusuf.ucuz@gmail.com)';
const FILES = {
  'cover-strandbad-wannsee': 'File:Strandkörbe im Strandbad Wannsee (13932250353).jpg',
  'wannsee-sailboats': 'File:Segeln auf dem Wannsee.jpg',
  'liebermann-garden': 'File:Liebermann-Villa - Blumengarten am Gärtnerhaus.JPG',
  'wannsee-conference-house': 'File:Haus der Wannsee-Konferenz.jpg',
  'pfaueninsel-castle': 'File:Pfaueninsel Schloss.jpg',
  'pfaueninsel-peacock': 'File:Pfaueninsel-7723.jpg',
  'f10-ferry-wannsee': 'File:2018-08-07 DE Berlin-Steglitz-Zehlendorf, Großer Wannsee @ Ronnebypromenade, Wannsee 04810960 Linie F10 (49716829158).jpg',
};
const out = {};
for (const [key, title] of Object.entries(FILES)) {
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata|size&titles=' + encodeURIComponent(title);
  const j = await (await fetch(url, { headers: { 'User-Agent': UA } })).json();
  const page = Object.values(j.query.pages)[0];
  const info = page.imageinfo?.[0];
  const md = info?.extmetadata || {};
  const strip = (s) => String(s || '').replace(/<[^>]*>/g, '').trim();
  out[key] = {
    title: page.title,
    descriptionUrl: info?.descriptionurl,
    width: info?.width, height: info?.height,
    license: strip(md.LicenseShortName?.value),
    licenseUrl: strip(md.LicenseUrl?.value),
    artist: strip(md.Artist?.value),
    attributionRequired: strip(md.AttributionRequired?.value),
  };
  console.log(key, '|', out[key].license, '| attr:', out[key].attributionRequired, '|', out[key].artist.slice(0, 40), '|', out[key].width + 'x' + out[key].height);
}
import fs from 'node:fs';
fs.writeFileSync('images/licence-verification.json', JSON.stringify(out, null, 2) + '\n');
