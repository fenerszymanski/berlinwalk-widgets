// Gift Week dates are absolute Berlin instants. The switch is OFF until the coordinator enables each system.
export const CONFIG_URL='https://fenerszymanski.github.io/berlinwalk-widgets/storefront/20261022-c4/data/gift-week-202611.json';
export function active(config,system,now=Date.now()) {return config?.id==='gift-week-202611'&&config?.systems?.[system]===true&&now>=Date.parse(config.start)&&now<Date.parse(config.end);}
export function systemOf(product){return product.source==='wix'?'wix':product.externalSourceKey?.startsWith('newspaper-')?'newspaper':'audio';}
export function entry(config,product){return product.source==='wix'?config?.products?.[product.wixProductId]:config?.external?.[product.externalSourceKey];}
export function saleCents(cents){return Math.round(cents*80/100);}
export function reference(config,id,choices){const row=config?.products?.[id];if(!row)return null;return choices?(()=>{const v=row.variants?.find(v=>Object.keys(v.choices).every(k=>v.choices[k]===choices[k]));return v?.lowest30??v?.price??null;})():row.lowest30;}
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function money(amount,currency='EUR',de=false){return new Intl.NumberFormat(de?'de-DE':'en-IE',{style:'currency',currency}).format(amount);}
export function priceHtml({amount,regular,lowest30=regular,currency='EUR',de=false,enabled=false,from=false}){
 const formatted=money(amount,currency,de),prefix=from?(de?'Ab ':'From '):'';
 if(!enabled||!Number.isFinite(regular)||Math.round(amount*100)>=Math.round(regular*100))return esc(prefix+formatted);
 return `<span class="gw-prices"><del>${esc(prefix+money(regular,currency,de))}</del> <strong>${esc(prefix+formatted)}</strong> <span class="gw-badge">−20%</span><small>${de?'Niedrigster Preis der letzten 30 Tage:':'Lowest price in the last 30 days:'} ${esc(money(lowest30,currency,de))}</small></span>`;
}
export function countdownHtml(config,de=false,now=Date.now()){
 if(!['wix','audio','newspaper'].some(s=>active(config,s,now)))return '';
 return `<aside class="gw-countdown" aria-label="${de?'Aktionsende':'Offer ends'}"><strong>${de?'Geschenkewoche · 20% auf ausgewählte Produkte':'Gift Week · 20% off selected products'}</strong><span>${de?'Bis 8. November, 23:59 Uhr (Berlin)':'Until 8 November, 23:59 Berlin'} · <time data-gw-end="${esc(config.end)}"></time></span><small>${de?'Kalender, Trip Planner, Stadtführung, Night In und kleine Reiseführer sind ausgenommen.':'Calendars, Trip Planner, the walking tour, Night In and small guides are excluded.'}</small></aside>`;
}
export function tick(root,now=Date.now()) {for(const el of root.querySelectorAll('[data-gw-end]')){const seconds=Math.max(0,Math.ceil((Date.parse(el.dataset.gwEnd)-now)/1000));const d=Math.floor(seconds/86400),h=Math.floor(seconds/3600)%24,m=Math.floor(seconds/60)%60,s=seconds%60;el.textContent=`${d}d ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;}}
