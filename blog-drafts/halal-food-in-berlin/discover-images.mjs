import fs from 'fs';
const UA = { 'User-Agent': 'BerlinWalkBlogBot/1.0 (https://www.berlinwalk.com; contact via berlinwalk.com)' };
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const queries = [
  'Sonnenallee Neukölln Berlin',
  'Döner kebab Berlin',
  'Döner kebab',
  'Şehitlik Mosque Berlin',
  'Sehitlik Camii Berlin',
  'Berlin Arab food mezze hummus',
  'Baklava Turkish sweets',
  'Kottbusser Tor Berlin street',
  'Turkish grill Berlin lahmacun',
  'Berlin Neukölln Arab bakery',
];
const strip = s => (s||'').replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
const out = [];
for (const q of queries){
  const api = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch='+encodeURIComponent('filetype:bitmap '+q)+'&gsrnamespace=6&gsrlimit=6&prop=imageinfo&iiprop=url|extmetadata|size';
  let j;
  for(let a=0;a<4;a++){ try{ const r=await fetch(api,{headers:UA}); j=JSON.parse(await r.text()); break; }catch(e){ await sleep(2000*(a+1)); } }
  if(!j||!j.query){ console.log('Q FAIL', q); continue; }
  for(const p of Object.values(j.query.pages)){
    const im=(p.imageinfo||[])[0]; if(!im) continue; const m=im.extmetadata||{};
    if(im.width<1000||im.height<700) continue;
    out.push({ query:q, file:p.title.replace(/^File:/,''), size:im.width+'x'+im.height,
      license:(m.LicenseShortName||{}).value||'', artist:strip((m.Artist||{}).value).slice(0,50),
      descUrl:im.descriptionurl });
  }
  await sleep(800);
}
fs.writeFileSync('discover-candidates.json', JSON.stringify(out,null,2));
console.log('Found', out.length, 'candidates');
for(const c of out) console.log(c.license.padEnd(16), c.size.padEnd(11), c.file.slice(0,60));
