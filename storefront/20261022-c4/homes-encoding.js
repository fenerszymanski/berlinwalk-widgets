// İki Wix alanına sığan, sürümü belli kayıt. Sınır sessizce metin kesmez.
export const HOMES_CONFIG = await fetch(new URL('./homes-config.json', import.meta.url)).then(r=>{if(!r.ok)throw Error('EV_AYARLARI_OKUNAMADI');return r.json()});
export function checkedText(value, max, required=false) {
  const s=String(value??'').normalize('NFC');
  if(s.length>max || /[|~\u0000-\u001f\u007f<>]/.test(s) || (required&&!s.trim()))throw Error('EV_METNI_GECERSIZ');
  return s;
}
const coord=(n,min,max)=>{if(!Number.isFinite(n)||n<min||n>max)throw Error('EV_NOKTASI_GECERSIZ');return n.toFixed(5)};
export function checksum(value){let c=0xffffffff;for(const b of new TextEncoder().encode(value)){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0)}return ((c^0xffffffff)>>>0).toString(16).padStart(8,'0')}
export function encodeHomes(value) {
  const {homes,heading,colour='sepia',ref='',lang='en'}=value,L=HOMES_CONFIG.limits,F=HOMES_CONFIG.fields;
  if(!Array.isArray(homes)||![2,3].includes(homes.length)||!['sepia','bw','cream','blue','dark'].includes(colour))throw Error('EV_KAYDI_GECERSIZ');
  const rows=homes.map(h=>[coord(h.lat,52.3383,52.6755)+','+coord(h.lon,13.0884,13.7612),checkedText(h.title,L.title,true),checkedText(h.area,L.area,true),checkedText(h.line,L.line)].join('|'));
  if(!['en','de'].includes(lang))throw Error('EV_DILI_GECERSIZ');
  const version=lang==='de'?'H2':'H1';
  const meta=[version,homes.length,colour,checkedText(heading,L.heading,true),checkedText(ref,L.ref)].join('|');
  const second=version+'~'+rows.slice(1).join('~');
  const first=meta+'|'+checksum(meta+'~'+rows[0]+'\n'+second)+'~'+rows[0];
  if(first.length>200||second.length>200)throw Error('EV_ALANI_COK_UZUN');
  return {[F.first]:first,[F.second]:second};
}
export function decodeHomes(fields) {
  const F=HOMES_CONFIG.fields,a=String(fields[F.first]||'').split('~'),b=String(fields[F.second]||'').split('~');
  const meta=a.shift().split('|');
  if(a.length!==1||b.shift()!==meta[0]||meta.length!==6||!['H1','H2'].includes(meta[0]))throw Error('EV_KAYDI_GECERSIZ');
  const homes=[...a,...b].map(s=>{const p=s.split('|'),point=p[0].split(',');if(p.length!==4||point.length!==2||!point.every(x=>/^\d{2}\.\d{5}$/.test(x)))throw Error('EV_KAYDI_GECERSIZ');return {lat:Number(point[0]),lon:Number(point[1]),title:p[1],area:p[2],line:p[3]}});
  if(homes.length!==Number(meta[1]))throw Error('EV_SAYISI_GECERSIZ');
  const result={homes,colour:meta[2],heading:meta[3],ref:meta[4],...(meta[0]==='H2'?{lang:'de'}:{})};
  const canonical=encodeHomes(result);
  if(canonical[F.first]!==fields[F.first]||canonical[F.second]!==fields[F.second])throw Error('EV_KAYDI_GECERSIZ');
  return result;
}
