import fs from 'fs';
const UA = { 'User-Agent': 'BerlinWalkBlogBot/1.0 (https://www.berlinwalk.com; contact via berlinwalk.com)' };
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const files = [
  ['sonnenallee-a','Berlin Sonnenallee 1.jpg'],
  ['sonnenallee-b','Sonnenallee Berlin-Neukölln 2020-06-26 01.jpg'],
  ['doner-a','Chicken Döner in Berlin.jpg'],
  ['doner-b','Döner Kebab, Berlin, 2010 (01).jpg'],
  ['doner-c','Döner Kebab plate with onions.jpg'],
  ['mosque-a','Şehitlik mosque Berlin by ZUFAr.jpg'],
  ['mosque-b','Turk Sehitlik Camii 24.jpg'],
  ['mosque-c','Turk Sehitlik Camii 28.jpg'],
  ['sweets-a','Shop with traditional Turkish sweets 03.jpg'],
  ['sweets-b','Baklava 2.jpg'],
  ['market-maybachufer','Berlin Wochenmarkt Maybachufer-20241206-RM-152528.jpg'],
  ['kottbusser-tor','Kottbusser Tor - Berlin - panoramio.jpg'],
];
const strip = s => (s||'').replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
const meta = [];
for (const [key,name] of files){
  const api = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&titles='+encodeURIComponent('File:'+name)+'&prop=imageinfo&iiprop=url|extmetadata|size';
  let j;
  for(let a=0;a<4;a++){ try{ const r=await fetch(api,{headers:UA}); j=JSON.parse(await r.text()); break; }catch(e){ await sleep(2500*(a+1)); } }
  if(!j){ console.log(key,'META FAIL'); continue; }
  const p = Object.values(j.query.pages)[0];
  if(!p.imageinfo){ console.log(key,'NO IMAGEINFO'); continue; }
  const im = p.imageinfo[0]; const m = im.extmetadata||{};
  const rec = { key, file:name, artist: strip((m.Artist||{}).value), license:(m.LicenseShortName||{}).value||'',
    licenseUrl:(m.LicenseUrl||{}).value||'', credit: strip((m.Credit||{}).value), descUrl: im.descriptionurl, size: im.width+'x'+im.height };
  const dl = 'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(name)+'?width=1800';
  const buf = Buffer.from(await (await fetch(dl,{headers:UA})).arrayBuffer());
  fs.writeFileSync('images/raw/'+key+'.jpg', buf);
  rec.localKB = Math.round(buf.length/1024);
  meta.push(rec);
  console.log(key.padEnd(20), rec.size.padEnd(11), '['+rec.license+']', (rec.localKB+'KB').padEnd(8), '| '+rec.artist.slice(0,44));
  await sleep(1200);
}
fs.writeFileSync('image-meta.json', JSON.stringify(meta,null,2));
console.log('\nSaved image-meta.json ('+meta.length+' files)');
