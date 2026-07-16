import fs from 'fs';
const UA = { 'User-Agent': 'BerlinWalkBlogBot/1.0 (https://www.berlinwalk.com; contact via berlinwalk.com)' };
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const files = [
  ['koernerpark-a','Körnerpark0091.jpg'],
  ['koernerpark-b','Körnerpark0048.jpg'],
  ['koernerpark-c','Körnerpark in Berlin-Neukölln, Bild 7.jpg'],
  ['rixdorf-a','Berlin-Neukölln-Böhmisches Dorf DSC7002.jpg'],
  ['rixdorf-b','Neukölln Richardplatz-001.jpg'],
  ['maybachufer-market','Berlin Wochenmarkt Maybachufer-20241206-RM-152528.jpg'],
  ['maybachufer-canal','Berlin Landwehrkanal Maybachufer-20241206-RM-151205.jpg'],
  ['hermannplatz','Berlin Neukoelln Hermannplatz asv2021-03 img1.jpg'],
  ['rathaus','Berlin Neukoelln Rathaus asv2021-03 img1.jpg'],
  ['klunkerkranich','KlunkerkranichBerlin.jpg'],
  ['sonnenallee','Sonnenallee Berlin-Neukölln 2020-06-26 01.jpg'],
];
const strip = s => (s||'').replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
const meta = [];
for (const [key,name] of files){
  const api = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&titles='+encodeURIComponent('File:'+name)+'&prop=imageinfo&iiprop=url|extmetadata|size';
  let j;
  for(let attempt=0;attempt<4;attempt++){
    const resp = await fetch(api,{headers:UA});
    const txt = await resp.text();
    try{ j=JSON.parse(txt); break; }catch(e){ await sleep(2500*(attempt+1)); }
  }
  if(!j){ console.log(key,'META FAIL'); continue; }
  const p = Object.values(j.query.pages)[0];
  const im = p.imageinfo[0]; const m = im.extmetadata||{};
  const rec = { key, file:name,
    artist: strip((m.Artist||{}).value),
    license: (m.LicenseShortName||{}).value||'',
    licenseUrl: (m.LicenseUrl||{}).value||'',
    credit: strip((m.Credit||{}).value),
    descUrl: im.descriptionurl, size: im.width+'x'+im.height };
  const dl = 'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(name)+'?width=1800';
  const buf = Buffer.from(await (await fetch(dl,{headers:UA})).arrayBuffer());
  fs.writeFileSync('images/raw/'+key+'.jpg', buf);
  rec.localKB = Math.round(buf.length/1024);
  meta.push(rec);
  console.log(key.padEnd(20), rec.size.padEnd(11), '['+rec.license+']', (rec.localKB+'KB').padEnd(8), '| '+rec.artist.slice(0,44));
  await sleep(1500);
}
fs.writeFileSync('image-meta.json', JSON.stringify(meta,null,2));
console.log('\nSaved image-meta.json ('+meta.length+' files)');
