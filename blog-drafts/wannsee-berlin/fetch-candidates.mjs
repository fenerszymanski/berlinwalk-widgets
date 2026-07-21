import fs from 'node:fs';
const UA = 'BerlinWalkBlogBot/1.0 (https://www.berlinwalk.com; yusuf.ucuz@gmail.com)';
const CAND = {
  '1a-strandbad-entrance': 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Nikolassee_Strandbad_Wannsee_Empfangsgeb%C3%A4ude-001.jpg',
  '1b-strandkoerbe': 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Strandk%C3%B6rbe_im_Strandbad_Wannsee_%2813932250353%29.jpg',
  '2a-castle-2025': 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Pfaueninsel-Schloss-aussen-hoch-2025-07-HS.jpg',
  '2b-castle-havel': 'https://upload.wikimedia.org/wikipedia/commons/7/70/Pfaueninsel_Schloss.jpg',
  '3a-peacock-display': 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Pfaueninsel-7723.jpg',
  '3b-peacock-grass': 'https://upload.wikimedia.org/wikipedia/commons/8/87/Pfau_auf_der_Pfaueninsel_20150818_11.jpg',
  '4a-liebermann-garden': 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Liebermann-Villa_-_Blumengarten_am_G%C3%A4rtnerhaus.JPG',
  '5a-ghwk-garden': 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Haus_der_Wannsee-Konferenz.jpg',
  '5b-ghwk-court': 'https://upload.wikimedia.org/wikipedia/commons/0/00/Haus_der_Wannsee-Konferenz_2015_01.jpg',
  '6a-regatta': 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Segel_Regatta_auf_dem_Wannsee.jpg',
  '6b-sails': 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Segeln_auf_dem_Wannsee.jpg',
  '6c-lake-pano': 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Gro%C3%9Fer_Wannsee_seen_from_Wannseebr%C3%BCcke_Berlin_2020-09-18_04.jpg',
  '7a-f10-pier': 'https://upload.wikimedia.org/wikipedia/commons/c/cf/2018-08-07_DE_Berlin-Steglitz-Zehlendorf%2C_Gro%C3%9Fer_Wannsee_%40_Ronnebypromenade%2C_Wannsee_04810960_Linie_F10_%2849716829158%29.jpg',
};
fs.mkdirSync('images/raw', { recursive: true });
for (const [name, url] of Object.entries(CAND)) {
  const dst = `images/raw/${name}-full.jpg`;
  if (fs.existsSync(dst)) { console.log('SKIP', name); continue; }
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) { console.log('FAIL', name, res.status); continue; }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dst, buf);
  fs.writeFileSync(`images/raw/${name}.json`, JSON.stringify({ fullUrl: url }, null, 2));
  console.log('DL', name, (buf.length / 1e6).toFixed(1) + 'MB');
}
