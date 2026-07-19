import fs from 'node:fs';
const UA='BerlinWalkBlogBot/1.0 (https://www.berlinwalk.com; yusuf.ucuz@gmail.com)';
const PICKS=[
 ['w01-wittenbergplatz','U-Bahnhof Wittenbergplatz, entrance building exterior.jpg'],
 ['w06-rathenauplatz','Rathenauplatz, Berlin-Grunewald, Beton-Cadillacs Wolf Vostell 05 2014.jpg'],
 ['w04-adenauerplatz','Charlottenburg Kurfürstendamm 68.jpg'],
];
const u=new URL('https://commons.wikimedia.org/w/api.php');
u.searchParams.set('action','query');u.searchParams.set('format','json');
u.searchParams.set('titles',PICKS.map(p=>'File:'+p[1]).join('|'));
u.searchParams.set('prop','imageinfo');u.searchParams.set('iiprop','url|size|extmetadata');
const j=await (await fetch(u,{headers:{'User-Agent':UA}})).json();
const by={};for(const p of Object.values(j.query.pages)) by[p.title]=p;
const strip=s=>(s||'').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
const out=[];
for(const [name,file] of PICKS){
  const p=by['File:'+file]; if(!p?.imageinfo){console.error('MISS',file);continue;}
  const ii=p.imageinfo[0], m=ii.extmetadata||{};
  const buf=Buffer.from(await (await fetch(ii.url,{headers:{'User-Agent':UA}})).arrayBuffer());
  fs.writeFileSync(`images/raw/${name}.bin`, buf);
  out.push({name,file,page:ii.descriptionurl,url:ii.url,artist:strip(m.Artist?.value),license:strip(m.LicenseShortName?.value),licurl:m.LicenseUrl?.value||'',src:`${ii.width}x${ii.height}`});
  console.log(name, strip(m.LicenseShortName?.value),'|',strip(m.Artist?.value));
  await new Promise(r=>setTimeout(r,1200));
}
fs.writeFileSync('images/widget-sources.json', JSON.stringify(out,null,1));
