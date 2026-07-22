const QUERIES=['Völkerschlachtdenkmal Leipzig exterior monument reflecting pool','Völkerschlachtdenkmal Wasserbecken','Monument Battle of the Nations Leipzig'];
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
for(const q of QUERIES){
 const api='https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srnamespace=6&srlimit=14&srsearch='+encodeURIComponent(q+' filetype:bitmap');
 const r=await fetch(api,{headers:{'User-Agent':'BerlinWalkResearch/1.0 (berlinwalk.com)'}});
 const j=await r.json().catch(()=>null);
 console.log('== '+q);
 for(const s of j?.query?.search||[]) console.log('   '+s.title.replace('File:',''));
 await sleep(3000);
}
