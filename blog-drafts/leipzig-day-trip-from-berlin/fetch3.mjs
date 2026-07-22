import fs from 'node:fs';
const FILES=['Leipzig, Johann-Sebastian-Bach-Denkmal (Februar 2026).jpg','MKBler - 900 - Neues Bachdenkmal (Leipzig).jpg','Bachdenkmal Leipzig Thomaskirchhof.jpg'];
const meta=JSON.parse(fs.readFileSync('images/candidates.json','utf8'));
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
for(const f of FILES){
 await sleep(4000);
 const api='https://commons.wikimedia.org/w/api.php?action=query&format=json&titles='+encodeURIComponent('File:'+f)+'&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=2000';
 let j; for(let a=0;a<5;a++){const r=await fetch(api,{headers:{'User-Agent':'BerlinWalkResearch/1.0 (berlinwalk.com)'}});const t=await r.text();try{j=JSON.parse(t);break}catch{await sleep(15000)}}
 const p=Object.values(j.query.pages)[0]; const ii=p.imageinfo?.[0];
 if(!ii){console.log('MISS '+f);continue}
 const m=ii.extmetadata||{};
 const artist=(m.Artist?.value||'').replace(/<[^>]+>/g,'').trim();
 meta.push({file:f,descUrl:ii.descriptionurl,thumb:ii.thumburl,full:ii.url,width:ii.width,height:ii.height,license:m.LicenseShortName?.value,licenseUrl:m.LicenseUrl?.value||'',artist});
 const out='images/raw/bach2_'+f.replace(/[^\w.\-]+/g,'_');
 if(!fs.existsSync(out)){const r=await fetch(ii.thumburl,{headers:{'User-Agent':'BerlinWalkResearch/1.0 (berlinwalk.com)'}});fs.writeFileSync(out,Buffer.from(await r.arrayBuffer()))}
 console.log('OK '+f+' | '+(m.LicenseShortName?.value)+' | '+ii.width+'x'+ii.height+' | '+artist.slice(0,50));
}
fs.writeFileSync('images/candidates.json',JSON.stringify(meta,null,2));
