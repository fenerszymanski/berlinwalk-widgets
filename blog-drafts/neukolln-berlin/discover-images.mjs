// Discover candidate Wikimedia Commons images per Neukölln subject.
const subjects = {
  koernerpark: ['Körnerpark Berlin', 'Körnerpark Neukölln', 'Körnerpark fountain'],
  rixdorf: ['Richardplatz Berlin', 'Böhmisches Dorf Berlin', 'Rixdorf Berlin Richardplatz'],
  maybachufer: ['Maybachufer market Berlin', 'Türkischer Markt Maybachufer', 'Landwehrkanal Maybachufer'],
  hermannplatz: ['Hermannplatz Berlin', 'Karl-Marx-Straße Neukölln', 'Rathaus Neukölln'],
  klunkerkranich: ['Klunkerkranich Berlin', 'Neukölln skyline rooftop'],
  sonnenallee: ['Sonnenallee Berlin Neukölln'],
  tempelhof_edge: ['Schillerkiez Berlin', 'Tempelhofer Feld Oderstraße'],
};
async function search(term){
  const url='https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=6&gsrsearch='+encodeURIComponent(term)+'&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=320';
  try{
    const j=await (await fetch(url)).json();
    const pages=j.query?j.query.pages:{};
    return Object.values(pages).map(p=>{
      const im=(p.imageinfo||[])[0]||{};
      const m=im.extmetadata||{};
      return {title:p.title, w:im.width, h:im.height, license:(m.LicenseShortName||{}).value||'?', descUrl:im.descriptionurl};
    }).filter(x=>x.w);
  }catch(e){return [{error:e.message}];}
}
for (const [k,terms] of Object.entries(subjects)){
  console.log('\n=== '+k+' ===');
  const seen=new Set();
  for (const t of terms){
    const res=await search(t);
    for (const r of res){
      if(r.error){console.log('  ERR',r.error);continue;}
      if(seen.has(r.title))continue; seen.add(r.title);
      const ratio=(r.w/r.h).toFixed(2);
      console.log('  '+r.w+'x'+r.h+' ('+ratio+') ['+r.license+'] '+r.title.replace('File:',''));
    }
  }
}
