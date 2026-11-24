// Pure date arithmetic. UTC noon is a date carrier; inputs always use Berlin's civil date.
// Yusuf opened every 1928 surface on 16 Nov 2026. Keep the legacy timer boundary inert.
export const RELEASE_1928_AT=0;
export function extrasAllowedFor() { return true; }
export function berlinParts(now=new Date()) {
 const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hourCycle:'h23'}).formatToParts(now).map(x=>[x.type,x.value]));
 return {date:`${p.year}-${p.month}-${p.day}`,hour:Number(p.hour)};
}
const day=s=>new Date(s+'T12:00:00Z');
const iso=d=>d.toISOString().slice(0,10);
export function easter(y){const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),n=h+l-7*m+114;return `${y}-${String(Math.floor(n/31)).padStart(2,'0')}-${String(n%31+1).padStart(2,'0')}`;}
export function holidays(y){const fixed=['01-01','01-06','03-08','05-01','08-08','08-15','09-20','10-03','10-31','11-01','12-24','12-25','12-26','12-31','05-03','05-08','10-28','07-05','07-06','09-28','11-11','11-17'];const set=new Set(fixed.map(x=>`${y}-${x}`));for(const offset of [-2,1,39,50,60]){const d=day(easter(y));d.setUTCDate(d.getUTCDate()+offset);set.add(iso(d));}const repent=day(`${y}-11-22`);while(repent.getUTCDay()!==3)repent.setUTCDate(repent.getUTCDate()-1);set.add(iso(repent));return set;}
export const isBusinessDay=s=>![0,6].includes(day(s).getUTCDay())&&!holidays(Number(s.slice(0,4))).has(s);
export function addBusinessDays(s,n){const d=day(s);while(n>0){d.setUTCDate(d.getUTCDate()+1);if(isBusinessDay(iso(d)))n--;}return iso(d);}
// The 1979 print (ys1979, ys1979-framed, ys1979-canvas) is made by the same job as the 1928 print (scripts/ys1928-fulfil.mjs, same Posterflow rule),
// so it takes the same routes and the same approval day. Yusuf, 24 Nov 2026: "Evet, düzelt".
const STREET_POSTER=/^ys(?:1979)?$/,STREET_MOUNTED=/^ys(?:1979)?-(framed|canvas)$/;
export function routeFor(product,selection={},config){
 if(selection.digital||product.nativeProductType==='digital'||product.categoryIds?.includes('digital')||/^dl-|^ed-digital-/.test(product.id))return null;
 if(product.group==='apparel'||product.id.startsWith('shirt-'))return 'gelato-tee';
 const personal=STREET_POSTER.test(product.id)||['ys1928-mounted','ys1979-mounted'].includes(product.group)||STREET_MOUNTED.test(product.id);
 if(product.id==='dein-berlin-2027'||/calendar/i.test(product.typeLine||''))return 'gelato-calendar';
 if(personal){const format=selection.format||(/canvas/.test(product.id)?'canvas':/framed/.test(product.id)?'framed':'poster'),paper=selection.Paper||'Premium Matte',size=String(selection.Size||'30x40').replace(/\s|cm/g,'').replace('×','x');
  if(config.posterflowEnabled&&!selection.homes&&((format==='poster'&&['Classic Matte','Premium Matte','Premium Semi-Gloss','Classic Semi-Gloss'].includes(paper))||(format==='framed'&&size==='30x40'&&paper==='Premium Matte'&&['Black','White','Natural wood'].includes(selection.Frame||'Black'))))return format==='poster'?'posterflow-poster':'posterflow-frame';
  return format==='poster'?'gelato-poster':'gelato-mounted';
 }
 if(product.nativeProductType==='physical'||/PRINT|CANVAS|FRAMED/i.test(product.typeLine||''))return 'gelato-poster';
 return undefined;
}
const addCalendarDays=(s,n)=>{const d=day(s);d.setUTCDate(d.getUTCDate()+n);return iso(d);};
const germanDeliveryDay=s=>{const y=Number(s.slice(0,4)),fixed=['01-01','05-01','10-03','12-25','12-26'];const closed=new Set(fixed.map(d=>`${y}-${d}`));for(const n of [-2,1,39,50])closed.add(addCalendarDays(easter(y),n));return ![0,6].includes(day(s).getUTCDay())&&!closed.has(s);};
function deliveryDay(s,n=0){while(!germanDeliveryDay(s))s=addCalendarDays(s,1);while(n>0){s=addCalendarDays(s,1);if(germanDeliveryDay(s))n--;}return s;}
export function estimate(product,selection,config,now=new Date()){
 const route=routeFor(product,selection,config);if(!route)return {digital:route===null,unsupported:route===undefined};
 const {date,hour}=berlinParts(now);if(date>config.validThrough)return {expired:true,route};
 const r=config.routes[route];if(r.validThrough&&date>r.validThrough)return {expired:true,route};let start=date;
 if(!isBusinessDay(start)){while(!isBusinessDay(start))start=addBusinessDays(start,1);}else if(hour>=config.cutoffHour)start=addBusinessDays(start,1);
 const personal=STREET_POSTER.test(product.id)||/^ys(?:1979)?-/.test(product.id)||product.id==='dein-berlin-2027';
 const approval=personal?Math.max(1,r.approvalBusinessDays):r.approvalBusinessDays;
 const phase=r.productionShippingCalendarDays||r.productionShippingBusinessDays||r.productionBusinessDays.map((n,i)=>n+r.shippingBusinessDays[i]);
 // Quote calendar totals already contain production, weekends and origin holidays.
 // Apply no second production-calendar conversion. Only local cutoff, approval and arrival margin are added.
 const quotedStart=hour>=config.cutoffHour&&germanDeliveryDay(date)?deliveryDay(addCalendarDays(date,1)):date;
 const quotedApproval=approval?deliveryDay(quotedStart,approval):quotedStart;
 const earliest=r.productionShippingCalendarDays?deliveryDay(addCalendarDays(quotedApproval,phase[0])):addBusinessDays(start,approval+phase[0]);
 const latest=r.productionShippingCalendarDays?deliveryDay(addCalendarDays(quotedApproval,phase[1]),r.bufferBusinessDays):addBusinessDays(start,approval+phase[1]+r.bufferBusinessDays);
 const c=config.christmas,gelato=route.startsWith('gelato'),processing=addBusinessDays(start,approval),limit=gelato?c.gelatoLatestArrival:c.posterflowLatestArrival;
 const christmas=Number(date.slice(0,4))===c.year&&latest<=limit&&(!gelato||processing<=c.gelatoOrderBy)&&(product.id!=='dein-berlin-2027'||date<='2026-12-10');
 return {route,earliest,latest,personal,christmas,approval,provider:r.provider};
}
export function dateRange(a,b,de=false){const f=new Intl.DateTimeFormat(de?'de-DE':'en-GB',{weekday:'short',day:'numeric',month:'short',timeZone:'Europe/Berlin'});return f.format(day(a))+' – '+f.format(day(b));}
export function crossFormats(config,product,products){
 const groups=['posters','tees','hoodies'],f=config.families.find(f=>groups.some(k=>(f[k]||[]).includes(product.id)));
 if(!f)return [];const own=groups.find(k=>(f[k]||[]).includes(product.id));
 return groups.filter(k=>k!==own).flatMap(k=>f[k]||[]).map(id=>products.find(p=>p.id===id)).filter(p=>p&&p.inStock!==false&&p.status!=='unavailable');
}
