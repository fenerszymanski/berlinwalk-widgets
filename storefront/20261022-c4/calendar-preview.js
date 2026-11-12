import {CALENDAR_CONFIG as C,calendarPlan,cleanTitle} from './calendar-encoding.js?v=ys-cal-20261112';
import {PRINT_OPTIONS,gradePixels,utm33,wmsUrl} from './street-configurator.js';
import {loadAerialImage} from './aerial-source.js';
const G=C.geometry,theme=PRINT_OPTIONS.themes.sepia;
const rgb=v=>'rgb('+v.join(',')+')';
const imageCache=new Map();
export function image(url){if(!imageCache.has(url))imageCache.set(url,loadAerialImage(url).catch(e=>{imageCache.delete(url);throw e}));return imageCache.get(url)}
function raw(img){const c=document.createElement('canvas');c.width=img.naturalWidth||img.width;c.height=img.naturalHeight||img.height;const x=c.getContext('2d');x.drawImage(img,0,0);return x.getImageData(0,0,c.width,c.height)}
export async function buyerPhotos(place){
 const [x,y]=utm33(place.lat,place.lon),g=G.month,c=G.cover;
 const url=(today,w,h,ground)=>wmsUrl('https://gdi.berlin.de/services/wms/'+(today?'truedop_2026':'luftbild_1928_04'),today?'truedop_2026':'c_luftbilder_1928_04_raster',x,y,ground,ground*h/w,600,Math.round(600*h/w));
 const results=await Promise.all([image(url(false,g.photoW,g.photoH,g.groundW)),image(url(true,g.photoW,g.photoH,g.groundW)),image(url(false,c.photoW,c.photoH,c.groundW))]);
 let emptyShare=0;const photos=results.map((im,i)=>{const d=raw(im);if(i!==1){let n=0;for(let k=0;k<d.data.length;k+=4)if(d.data[k+3]<10||(d.data[k]>=250&&d.data[k+1]>=250&&d.data[k+2]>=250))n++;emptyShare=Math.max(emptyShare,n/(d.width*d.height))}const c=document.createElement('canvas');c.width=d.width;c.height=d.height;c.getContext('2d').putImageData(new ImageData(gradePixels(d.data,theme,i!==1),d.width,d.height),0,0);return c});
 return {photos,emptyShare,coverage:emptyShare>.02?'blank':'ok'};
}
function marker(x,cx,cy,w,ground){const r=G.ringM*w/ground,g=r*.35,l=r*.75;for(const [a,b,c,d] of [[cx-l,cy,cx-g,cy],[cx+g,cy,cx+l,cy],[cx,cy-l,cx,cy-g],[cx,cy+g,cx,cy+l]]){for(const [colour,width] of [['#141414',.97],['#faf7ee',.53]]){x.strokeStyle=colour;x.lineWidth=width;x.beginPath();x.moveTo(a,b);x.lineTo(c,d);x.stroke()}}}
function words(x,s,cx,y,em,serif=false,colour=theme.main,align='center',max=265,tracking=0){x.fillStyle=rgb(colour);x.textAlign=align;x.textBaseline='alphabetic';let size=em;const set=()=>x.font=`${size}px "${serif?'DM Serif Display':'Space Grotesk'}"`;set();while(size>4&&x.measureText(s).width+tracking*Math.max(0,s.length-1)>max){size-=.5;set()}if(!tracking){x.fillText(s,cx,y);return}let left=cx-(Array.from(s).reduce((n,c)=>n+x.measureText(c).width,0)+tracking*(s.length-1))/2;x.textAlign='left';for(const c of s){x.fillText(c,left,y);left+=x.measureText(c).width+tracking}}
export async function drawCalendar(canvas,state,index,asset){
 const plan=calendarPlan(state.places),entry=plan[Math.max(0,index-1)],p=entry.place,cover=index===0,g=cover?G.cover:G.month,m=G.margin,T=C.text[state.lang],W=G.trim[0],H=G.trim[1];
 const imgs=entry.source==='buyer'?p.photos:await Promise.all(['1928','today'].map(k=>image(asset('assets/calendar-20261112/fillers/'+p.key+'-'+k+'.webp'))));
 const out=document.createElement('canvas');out.width=canvas.width||891;out.height=Math.round(out.width*H/W);const x=out.getContext('2d');x.scale(out.width/W,out.height/H);x.fillStyle=rgb(theme.bg);x.fillRect(0,0,W,H);
 function photo(img,left){if(!img)return;x.drawImage(img,left,g.photoY,g.photoW,g.photoH);x.strokeStyle=rgb(theme.key);x.lineWidth=.33;x.strokeRect(left-.5,g.photoY-.5,g.photoW+1,g.photoH+1);marker(x,left+g.photoW/2,g.photoY+g.photoH/2,g.photoW,g.groundW)}
 if(cover){photo(imgs?.[2]||imgs?.[0],m.x);words(x,cleanTitle(p.title).toUpperCase()+' · '+p.area.toUpperCase()+' · 1928',W/2,g.captionY,g.captionEm,false,theme.grey,'center',265,.45);words(x,state.line.trim()||T.defaultLine,W/2,g.lineY,g.lineEmMax,true,theme.main,'center',255);words(x,String(C.product.year),W/2,g.yearY,g.yearEm,true,theme.ink);words(x,T.sub,W/2,g.subY,g.subEm,false,theme.grey)}
 else{
  photo(imgs?.[0],m.x);photo(imgs?.[1],m.x+g.photoW+g.photoGap);words(x,'1928',m.x+g.photoW/2,g.captionY,3.6,false,theme.main,'center',128,.7);words(x,T.today,m.x+g.photoW+g.photoGap+g.photoW/2,g.captionY,3.6,false,theme.main,'center',128,.8);
  words(x,cleanTitle(p.title).toUpperCase().replace(/ẞ/g,'SS'),W/2,g.titleY,g.titleEm,true);words(x,p.area,W/2,g.areaY,g.areaEm,false,theme.grey);
  x.strokeStyle=rgb(theme.key);x.lineWidth=.3;x.beginPath();x.moveTo(m.x,g.ruleY);x.lineTo(W-m.x,g.ruleY);x.stroke();words(x,T.months[index-1],m.x,g.monthY,g.monthEm,true,theme.ink,'left',230);words(x,String(C.product.year),W-m.x-10,g.monthY,g.yearEm,false,theme.main,'center',35,.9);
  const cw=(W-2*m.x)/7,first=(new Date(Date.UTC(C.product.year,index-1,1)).getUTCDay()+6)%7,n=new Date(Date.UTC(C.product.year,index,0)).getUTCDate(),rows=Math.ceil((first+n)/7),rh=(g.gridBottom-g.gridTop)/rows;
  T.weekdays.forEach((v,i)=>words(x,v.toUpperCase(),m.x+i*cw+2.2,g.weekdayY,g.weekdayEm,false,i===6?theme.main:theme.grey,'left',cw));
  for(let r=0;r<=rows;r++){x.strokeStyle=rgb(r===0||r===rows?theme.key:[222,222,216]);x.lineWidth=.25;x.beginPath();x.moveTo(m.x,g.gridTop+r*rh);x.lineTo(W-m.x,g.gridTop+r*rh);x.stroke()}
  for(let day=1;day<=n;day++){const k=first+day-1,r=Math.floor(k/7),col=k%7,cx=m.x+col*cw+2.2,cy=g.gridTop+r*rh,date=`${C.product.year}-${String(index).padStart(2,'0')}-${String(day).padStart(2,'0')}`,h=C.holidays.days.find(h=>h[0]===date);x.textBaseline='top';x.textAlign='left';x.font=`${g.dayEm}px "Space Grotesk"`;x.fillStyle=rgb(col===6||h?theme.main:theme.ink);x.fillText(String(day),cx,cy+2.4);if(h){x.font=`${g.holidayEm}px "Space Grotesk"`;let lines=[],line='';for(const word of h[state.lang==='de'?1:2].split(' ')){const s=(line+' '+word).trim();if(x.measureText(s).width<=cw-3.4||!line)line=s;else{lines.push(line);line=word}}lines.push(line);lines.slice(0,2).forEach((s,i)=>x.fillText(s,cx,cy+11.8+i*4.4))}}
 }
 canvas.width=out.width;canvas.height=out.height;canvas.getContext('2d').drawImage(out,0,0);return entry;
}
