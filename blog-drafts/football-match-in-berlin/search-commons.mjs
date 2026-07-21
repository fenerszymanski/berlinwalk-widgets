const UA = 'BerlinWalkBlogBot/1.0 (https://www.berlinwalk.com; yusuf.ucuz@gmail.com)';
const terms = process.argv.slice(2);
const API = 'https://commons.wikimedia.org/w/api.php';

for (const t of terms) {
  const u = new URL(API);
  u.searchParams.set('action', 'query');
  u.searchParams.set('format', 'json');
  u.searchParams.set('generator', 'search');
  u.searchParams.set('gsrsearch', `filetype:bitmap ${t}`);
  u.searchParams.set('gsrnamespace', '6');
  u.searchParams.set('gsrlimit', '18');
  u.searchParams.set('prop', 'imageinfo');
  u.searchParams.set('iiprop', 'url|size|extmetadata');
  u.searchParams.set('iiurlwidth', '900');
  const r = await fetch(u, { headers: { 'User-Agent': UA } });
  const j = await r.json();
  const pages = Object.values(j.query?.pages || {});
  console.log(`\n### ${t} (${pages.length})`);
  for (const p of pages) {
    const ii = p.imageinfo?.[0]; if (!ii) continue;
    const m = ii.extmetadata || {};
    const lic = (m.LicenseShortName?.value || '?').replace(/<[^>]+>/g, '');
    const art = (m.Artist?.value || '?').replace(/<[^>]+>/g, '').trim().slice(0, 40);
    if (/^(GFDL|Fair use|Non-free)/i.test(lic)) continue;
    if (ii.width < 1400) continue;
    console.log(`${p.title} | ${ii.width}x${ii.height} | ${lic} | ${art} | ${ii.thumburl}`);
  }
}
