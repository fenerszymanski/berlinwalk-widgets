// Gift Week korunur. Black Friday ayrı veri ve canlı varyant fiyatı ile çalışır.
export const BF_ID='black-friday-202611';
export const BF_PRODUCT_IDS=Object.freeze(['8aaf5412-7f21-42c7-acfb-85dd8417d68c','33c1b670-fadc-4bcf-a1a5-82cc14b668ea','d35601ed-3b43-4269-afb9-32e7c3b1e128']);
export function bfActive(config,now=Date.now()) {
  return config?.schema===1&&config.id===BF_ID&&config.systems?.wix===true&&
    config.start==='2026-11-27T00:00:00+01:00'&&config.end==='2026-12-01T00:00:00+01:00'&&
    now>=Date.parse(config.start)&&now<Date.parse(config.end);
}
export function sameChoices(a,b) {
  return !!a&&!!b&&Object.keys(a).length===Object.keys(b).length&&Object.keys(a).every(k=>a[k]===b[k]);
}
const cents=n=>Number.isFinite(n)?Math.round(n*100):null;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=(n,de)=>new Intl.NumberFormat(de?'de-DE':'en-IE',{style:'currency',currency:'EUR'}).format(n);
export function bfSelection(config,id,native,choices,amount) {
  if(!native||native.visible===false)return null;
  const rows=config?.products?.[id]?.variants||[];
  let selected;
  if(choices)selected=native.variants?.find(v=>v.visible===true&&v.inStock===true&&sameChoices(v.choices,choices));
  // 27 Nov 2026: a "From" price is the cheapest sellable Black Friday variant (it matched the product's base price before,
  // which after the price switch is no longer the cheapest one, e.g. the framed print showed 69,90 instead of 59,90).
  else if(native.requiresOptions)selected=(native.variants||[]).filter(v=>v.visible===true&&v.inStock===true&&Number.isFinite(v.price)&&rows.some(r=>sameChoices(r.choices,v.choices))).sort((a,b)=>a.price-b.price)[0];
  const picked=choices||selected?.choices||{};
  const row=rows.find(r=>sameChoices(r.choices,picked));
  const actual=selected?.price??(!native.requiresOptions&&!choices?(native.discountedPrice??native.price):null);
  const clean=native.requiresOptions||cents(native.price)===cents(native.discountedPrice??native.price);
  return {row,actual,clean};
}
export function bfPriceHtml({config,id,native,amount,choices,de=false,from=false,now=Date.now()}) {
  const picked=bfSelection(config,id,native,choices,amount);
  const actual=Number.isFinite(picked?.actual)?picked.actual:amount;
  const prefix=from?(de?'Ab ':'From '):'';
  const plain=esc(prefix+money(actual,de));
  const row=picked?.row;
  if(!bfActive(config,now)||!row||!picked.clean||cents(picked.actual)!==cents(row.sale)||
    !Number.isFinite(row.reference)||!Number.isFinite(row.price)||!(row.sale<row.reference&&row.reference<=row.price))return plain;
  const label=de?'Black Friday · bis Montag, 30. November':'Black Friday · until Monday 30 November';
  const note=de?'Niedrigster Preis der letzten 30 Tage:':'Lowest price in the last 30 days:';
  return `<span class="gw-prices bf-prices" data-bf-price><span class="gw-badge">${esc(label)}</span> <del>${esc(prefix+money(row.reference,de))}</del> <strong>${esc(prefix+money(row.sale,de))}</strong><small>${esc(note+' '+money(row.reference,de)+'.')}</small></span>`;
}
// 27 Nov 2026: the product page code reads the size x paper variants only for its own poster products and the framed/canvas
// prints, so the 1928 poster reached the store without variants and its Black Friday price never showed (the page drew its
// fixed table, 29,90). During the window only, a BF product that needs options but came without variants takes them from our
// hourly Wix catalogue copy, and only from a copy made after the window opened and at most 3 hours old. Display only: the cart
// looks the variant up by its names and Wix charges its own price.
export const BF_COPY_MAX_AGE=3*3600000;
export function bfFillVariants(config,catalogue,copy,now=Date.now()) {
  if(!bfActive(config,now)||!Array.isArray(catalogue?.products))return [];
  const at=Date.parse(copy?.generatedAt),start=Date.parse(config.start);
  if(copy?.schema!==2||copy?.kind!=='catalog-snapshot'||!Array.isArray(copy.products)||!Number.isFinite(at)||at<start||at>now+300000||now-at>BF_COPY_MAX_AGE)return [];
  const filled=[];
  for(const id of BF_PRODUCT_IDS){
    const live=catalogue.products.find(p=>p?.productId===id);
    if(!live||live.requiresOptions!==true||(Array.isArray(live.variants)&&live.variants.length))continue;
    const rows=(copy.products.find(p=>p?.productId===id)?.variants||[]).filter(v=>v&&v.choices&&typeof v.choices==='object'&&Number.isFinite(v.price))
      .map(v=>({choices:{...v.choices},price:v.price,visible:v.visible===true,inStock:v.inStock===true,source:'catalog-copy'}));
    if(rows.length){live.variants=rows;filled.push(id);}
  }
  return filled;
}
