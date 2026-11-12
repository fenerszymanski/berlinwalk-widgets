// Baskı üreticisinin K1 kaydı; UTF-16 alan sınırı, UTF-8 CRC32.
export const CALENDAR_CONFIG = await fetch(new URL('./calendar-config.json?v=ys-cal-20261112',import.meta.url)).then(r=>{if(!r.ok)throw Error('TAKVIM_AYARI');return r.json()});
export const cleanTitle=t=>String(t).trim().replace(/(?:\s*,)?\s+\d+\s*[a-zA-Z]?(?:\s*[-–/]\s*\d+\s*[a-zA-Z]?)?\s*$/,'').trim();
function text(v,max,required=false){if(typeof v!=='string'||v.length>max||/[|~<>\x00-\x1f\x7f]/.test(v)||(required&&!v.trim()))throw Error('TAKVIM_METNI');return v}
function checksum(s){let c=0xffffffff;for(const b of new TextEncoder().encode(s)){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0)}return ((c^0xffffffff)>>>0).toString(16).padStart(8,'0')}
export function encodeCalendar(spec,max=CALENDAR_CONFIG.fields.maxLength){
 const {limits:L,fields:F}=CALENDAR_CONFIG,{places,lang='de',line=''}=spec;
 if(!['de','en'].includes(lang)||!Array.isArray(places)||places.length<1||places.length>L.places)throw Error('TAKVIM_KAYDI');
 text(line,L.coverLine);
 const rows=places.map(p=>{if(!Number.isFinite(p.lat)||!Number.isFinite(p.lon)||p.lat<52.3383||p.lat>52.6755||p.lon<13.0884||p.lon>13.7612)throw Error('TAKVIM_NOKTASI');return `${p.lat.toFixed(5)},${p.lon.toFixed(5)}|${text(p.title,L.title,true)}|${text(p.area,L.area,true)}`});
 const head=`K1|${lang}|${rows.length}|${line}`;let a=head+'|'+checksum(head+'~'+rows.join('~')),b='K1',i=0;
 while(i<rows.length&&(a+'~'+rows[i]).length<=max)a+='~'+rows[i++];
 while(i<rows.length&&(b+'~'+rows[i]).length<=max)b+='~'+rows[i++];
 if(i<rows.length)throw Error('TAKVIM_ALANI_DOLDU');return {[F.first]:a,[F.second]:b};
}
export function decodeCalendar(fields){
 const F=CALENDAR_CONFIG.fields,a=String(fields[F.first]||'').split('~'),b=String(fields[F.second]??'K1').split('~'),m=a.shift().split('|');
 if(m.length!==5||m[0]!=='K1'||b.shift()!=='K1')throw Error('TAKVIM_KAYDI');
 const rows=[...a,...b].filter(Boolean);if(rows.length!==Number(m[2])||checksum(m.slice(0,4).join('|')+'~'+rows.join('~'))!==m[4])throw Error('TAKVIM_SAGLAMA');
 const places=rows.map(r=>{const p=r.split('|'),c=p[0].split(',');if(p.length!==3||c.length!==2)throw Error('TAKVIM_KAYDI');return {lat:Number(c[0]),lon:Number(c[1]),title:p[1],area:p[2]}}),spec={lang:m[1],line:m[3],places};encodeCalendar(spec);return spec;
}
const distance=(a,b)=>Math.hypot((a.lat-b.lat)*111320,(a.lon-b.lon)*111320*Math.cos(52.5*Math.PI/180));
export function calendarPlan(places){const F=CALENDAR_CONFIG.fillers,spares=F.spares.filter(s=>places.every(p=>distance(s,p)>=F.minDistanceM));return Array.from({length:12},(_,i)=>{if(i<places.length)return {place:places[i],source:'buyer'};let f=F.list[i];if(places.some(p=>distance(f,p)<F.minDistanceM))f=spares.shift();if(!f)throw Error('TAKVIM_YEDEGI');return {place:f,source:'filler:'+f.key}})}
