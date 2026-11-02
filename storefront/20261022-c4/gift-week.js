// Gift Week dates are absolute Berlin instants. The switch is OFF until the coordinator enables each system.
export const CONFIG_URL='https://fenerszymanski.github.io/berlinwalk-widgets/storefront/20261022-c4/data/gift-week-202611.json';
export function active(config,system,now=Date.now()) {return config?.id==='gift-week-202611'&&config?.systems?.[system]===true&&now>=Date.parse(config.start)&&now<Date.parse(config.end);}
export function systemOf(product){return product.source==='wix'?'wix':product.externalSourceKey?.startsWith('newspaper-')?'newspaper':'audio';}
export function entry(config,product){return product.source==='wix'?config?.products?.[product.wixProductId]:config?.external?.[product.externalSourceKey];}
export function saleCents(cents){return Math.floor(cents*80/1000)*10;}
export function reference(config,id,choices){const row=config?.products?.[id];if(!row)return null;return choices?(()=>{const v=row.variants?.find(v=>Object.keys(v.choices).every(k=>v.choices[k]===choices[k]));return v?.lowest30??v?.price??null;})():row.lowest30;}
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function money(amount,currency='EUR',de=false){return new Intl.NumberFormat(de?'de-DE':'en-IE',{style:'currency',currency}).format(amount);}
export function priceHtml({amount,regular,lowest30=regular,currency='EUR',de=false,enabled=false,from=false}){
 const formatted=money(amount,currency,de),prefix=from?(de?'Ab ':'From '):'';
 if(!enabled||!Number.isFinite(regular)||Math.round(amount*100)>=Math.round(regular*100))return esc(prefix+formatted);
 return `<span class="gw-prices"><del>${esc(prefix+money(regular,currency,de))}</del> <strong>${esc(prefix+formatted)}</strong> <span class="gw-badge">−20%</span><small>${de?'Niedrigster Preis der letzten 30 Tage:':'Lowest price in the last 30 days:'} ${esc(money(lowest30,currency,de))}</small></span>`;
}
const COUNTDOWN_END=Date.parse('2026-11-08T22:59:00Z');
export function countdownText(de=false,now=Date.now()) {
 const remaining=COUNTDOWN_END-now;if(remaining<=0)return '';
 const hours=Math.floor(remaining/3600000),minutes=Math.floor(remaining/60000)%60,pad=n=>String(n).padStart(2,'0');
 return (de?'Endet in ':'Ends in ')+(remaining>86400000?`${Math.floor(hours/24)} ${de?'T':'d'} ${pad(hours%24)} ${de?'Std':'h'}`:`${pad(hours)} ${de?'Std':'h'} ${pad(minutes)} min`);
}
const countdownTicks=new WeakMap();
export function countdownHtml(config,de=false,now=Date.now()){
 if(now>=COUNTDOWN_END||!['wix','audio','newspaper'].some(s=>active(config,s,now)))return '';
 const label=de?'Endet So. 8. Nov., 23:59 Uhr Berlin':'Ends Sun 8 Nov, 23:59 Berlin';
 return `<aside class="gw-countdown" aria-label="${de?'Aktionsende':'Offer ends'}"><strong>${de?'Geschenkewoche · 20% auf ausgewählte Produkte':'Gift Week · 20% off selected products'}</strong><span><time data-gw-end="2026-11-08T22:59:00Z" data-gw-lang="${de?'de':'en'}" datetime="2026-11-08T23:59:00+01:00" role="img" aria-live="off" aria-label="${label}" style="display:inline-block;min-width:20ch;min-height:1.5em;font-variant-numeric:tabular-nums;white-space:nowrap"><b aria-hidden="true" style="font:inherit">${countdownText(de,now)}</b></time></span><small>${de?'Kalender, Trip Planner, Stadtführung, Night In und kleine Reiseführer sind ausgenommen.':'Calendars, Trip Planner, the walking tour, Night In and small guides are excluded.'}</small></aside>`;
}
export function tick(root,now=Date.now()) {
 for(const el of root.querySelectorAll('[data-gw-end]')){
  if(now>=COUNTDOWN_END){el.hidden=true;el.style.display='none';continue;}
  const previous=countdownTicks.get(el);if(previous!==undefined&&now>=previous&&now-previous<30000)continue;
  countdownTicks.set(el,now);const text=el.querySelector('[aria-hidden="true"]');if(text)text.textContent=countdownText(el.dataset.gwLang==='de',now);
 }
}
