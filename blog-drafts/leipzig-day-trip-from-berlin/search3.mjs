const api='https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srnamespace=6&srlimit=15&srsearch='+encodeURIComponent('Bachdenkmal Leipzig Denkmal filetype:bitmap');
const r=await fetch(api,{headers:{'User-Agent':'BerlinWalkResearch/1.0 (berlinwalk.com)'}});
const j=await r.json();
for(const s of j?.query?.search||[]) console.log(s.title.replace('File:',''));
