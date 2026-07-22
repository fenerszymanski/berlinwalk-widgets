const queries = process.argv.slice(2);
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
for (const q of queries) {
  const api='https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=25&gsrsearch='+encodeURIComponent(q)+'&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=320';
  const r=await fetch(api,{headers:{'User-Agent':'BerlinWalkResearch/1.0 (berlinwalk.com)'}});
  const j=await r.json();
  const pages=Object.values(j?.query?.pages||{});
  console.log('=== '+q+' ('+pages.length+') ===');
  for (const p of pages){
    const ii=p.imageinfo?.[0]; if(!ii) continue;
    const m=ii.extmetadata||{};
    const lic=m.LicenseShortName?.value||'?';
    if(!/cc|pd|public|falls|attribution/i.test(lic)) continue;
    if(ii.width<1200) continue;
    console.log(`${p.title.replace('File:','')} | ${ii.width}x${ii.height} | ${lic}`);
  }
  await sleep(3000);
}
