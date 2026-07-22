const QUERIES = [
  'Leipzig Markt Altes Rathaus',
  'Leipzig Hauptbahnhof Halle interior',
  'Nikolaikirche Leipzig interior columns',
  'Thomaskirche Leipzig',
  'Bach statue Leipzig Thomaskirche',
  'Völkerschlachtdenkmal',
  'Mädlerpassage Leipzig',
  'Auerbachs Keller Leipzig',
  'Zeitgeschichtliches Forum Leipzig',
  'Runde Ecke Leipzig',
];
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
for (const q of QUERIES) {
  const api='https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srnamespace=6&srlimit=12&srsearch='+encodeURIComponent(q+' filetype:bitmap');
  const resp=await fetch(api,{headers:{'User-Agent':'BerlinWalkResearch/1.0 (berlinwalk.com)'}});
  const j=await resp.json().catch(()=>null);
  console.log('== '+q);
  for(const r of j?.query?.search||[]) console.log('   '+r.title.replace('File:',''));
  await sleep(3000);
}
