// Presentation families only: never replace native IDs, variants or feed records.
export const qualityOf=p=>p?.group==='apparel'&&/-(classic|premium)$/.exec(p.id)?.[1]||null;
export const designKey=p=>qualityOf(p)?p.id.replace(/-(classic|premium)$/,''):null;
export const displayName=name=>name.replace(/Berolina — Modernist/g,'Berolina Modernist').replace(/T-([Ss]hirt)/g,'T‑$1');
export const designName=p=>p.name.replace(/ (Classic|Premium)(?= T-shirt$)/,'').replace(/Berolina — Modernist/g,'Berolina Modernist');
export function designMembers(p,products){const key=designKey(p);return key?products.filter(x=>designKey(x)===key):[];}
export function designRepresentative(p,products){const members=designMembers(p,products);return members.find(x=>qualityOf(x)==='classic')||members[0]||p;}
export function designCards(rows,products=rows){const used=new Set();return rows.flatMap(p=>{const key=designKey(p);if(!key)return [p];if(used.has(key))return [];used.add(key);return [designRepresentative(p,products)];});}
export function designReviewIds(p,products){const members=designMembers(p,products);return (members.length?members:[p]).map(x=>x.wixProductId).filter(Boolean);}
export const QUALITY_TEXT=Object.freeze({
 'Quality':'Qualität',
 'Ring-spun cotton · tubular unisex fit.':'Ringgesponnene Baumwolle · schlauchförmiger Unisex-Schnitt.',
 'Airlume combed ring-spun cotton · side-seamed, tailored unisex fit.':'Gekämmte, ringgesponnene Airlume-Baumwolle · taillierter Unisex-Schnitt mit Seitennähten.',
 'Ten Berlin designs. Choose Classic or Premium on the design page.':'Zehn Berlin-Motive. Wähle Classic oder Premium auf der Motivseite.',
 'UNISEX T-SHIRT · CLASSIC / PREMIUM':'UNISEX-T-SHIRT · CLASSIC / PREMIUM'
});
export function mergeDesignReviews(lists){return [...new Map(lists.flatMap(x=>x.reviews||[]).map(r=>[r.id,r])).values()];}
export const qualityNote=q=>q==='classic'?'Ring-spun cotton · tubular unisex fit.':'Airlume combed ring-spun cotton · side-seamed, tailored unisex fit.';
export function selectedQualityProduct(entry,products,quality){return designMembers(entry,products).find(p=>qualityOf(p)===quality)||entry;}
export function installQuality(Store,{esc}){
 const P=Store.prototype,view=P.productViewId,product=P.product,click=P.click,render=P.render,disconnect=P.disconnectedCallback;
 P.designReviewIds=function(p){return designReviewIds(p,this.presentation||this.model?.products||[]);};
 P.product=function(){const html=product.call(this),rows=this.model?.products||[],p=rows.find(x=>x.wixProductId===this.productViewId());if(!qualityOf(p))return html;
  const t=document.createElement('template');t.innerHTML=html;const name=this.d2text(designName(p)),h=t.content.querySelector('.product-title h1');if(h)h.textContent=name;
  const price=t.content.querySelector('.product-title .price'),native=this.catalogue?.products.find(x=>x.productId===p.wixProductId),pack=this.posterPack(p,native);if(price){const value=pack?.selected?.price??p.priceCents/100;price.textContent=this.campaignGerman()?new Intl.NumberFormat('de-DE',{style:'currency',currency:p.currency}).format(value):'EUR '+value.toFixed(2);}
  const crumb=t.content.querySelector('.breadcrumb');if(crumb?.lastChild?.nodeType===3)crumb.lastChild.textContent=' / '+name;
  const options=document.createElement('fieldset');options.className='tshirt-quality bw-raw';options.dataset.design=designKey(p);const q=qualityOf(p);
  options.innerHTML=`<legend>${esc(this.d2text('Quality'))}</legend><div class="tshirt-quality-options">${['classic','premium'].map(quality=>{const item=designMembers(p,rows).find(x=>qualityOf(x)===quality),available=item&&item.status==='available'&&item.inStock===true;return `<button type="button" data-tshirt-quality="${quality}" aria-pressed="${quality===q}" ${!available||this.busy||this.uncertain?'disabled':''}><strong>${quality==='classic'?'Classic':'Premium'} <span>${item?this.campaignGerman()?new Intl.NumberFormat('de-DE',{style:'currency',currency:item.currency}).format(item.priceCents/100):'EUR '+(item.priceCents/100).toFixed(2):'—'}</span></strong><small>${esc(this.d2text(qualityNote(quality)))}</small></button>`;}).join('')}</div>`;
  const buy=t.content.querySelector('.buy-box');buy?.prepend(options);return t.innerHTML;
 };
 P.click=function(event){const button=event.target.closest?.('[data-tshirt-quality]');if(!button)return click.call(this,event);event.preventDefault();if(button.disabled)return;const rows=this.model?.products||[],current=rows.find(p=>p.wixProductId===this.productViewId()),next=selectedQualityProduct(current,rows,button.dataset.tshirtQuality);if(!next||next===current)return;
  // Wix deliberately returns variants only for the current native route. Navigate
  // to its sibling so native availability and cart resolution stay authoritative.
  const u=new URL(this.d2href(next.productUrl));u.search=location.search;u.searchParams.set('quality',button.dataset.tshirtQuality);u.searchParams.delete('color');u.searchParams.delete('size');u.hash='';location.assign(u.href);
 };
 P.render=function(){if(!this.tshirtPop){this.tshirtPop=()=>{if(this.context.mode==='product'&&qualityOf(this.model?.products.find(p=>p.wixProductId===view.call(this)))){this.view='poster';this.render();}};window.addEventListener('popstate',this.tshirtPop);}render.call(this);if(this.context.mode!=='product')return;const rows=this.model?.products||[],p=rows.find(x=>x.wixProductId===this.productViewId());if(!qualityOf(p))return;
  const wanted=new URLSearchParams(location.search).get('quality'),target=selectedQualityProduct(p,rows,wanted);if(target.wixProductId!==p.wixProductId){const u=new URL(this.d2href(target.productUrl));u.search=location.search;u.searchParams.delete('color');u.searchParams.delete('size');location.replace(u.href);return;}
  const representative=designRepresentative(p,rows),u=new URL(this.d2href(representative.productUrl));u.search='';u.hash='';u.host='www.walkofberlin.com';const canonical=u.href;
  const links=[...document.head.querySelectorAll('link[rel="canonical"]')];let link=links.shift();if(!link){link=document.createElement('link');link.rel='canonical';document.head.append(link);}link.href=canonical;for(const extra of links)extra.remove();
  document.title=this.d2text(designName(p))+' | Walk of Berlin';const title=document.head.querySelector('meta[property="og:title"]');if(title)title.content=document.title;
  const og=document.head.querySelector('meta[property="og:url"]');if(og)og.content=canonical;
  for(const a of document.head.querySelectorAll('link[rel="alternate"][hreflang]')){if(['en','de','x-default'].includes(a.hreflang)){const target=new URL(canonical);target.pathname=target.pathname.replace(/^\/de(?=\/)/,'');if(a.hreflang==='de')target.pathname='/de'+target.pathname;a.href=target.href;}}
  // Consolidate rendered product SEO without advertising a review or changing native feed SEO.
  const group={"@context":"https://schema.org","@type":"ProductGroup","@id":canonical+'#design',name:this.d2text(designName(p)),url:canonical,productGroupID:designKey(p),brand:{'@type':'Brand',name:'Walk of Berlin'},image:this.image(p),variesBy:['https://schema.org/material'],hasVariant:designMembers(p,rows).map(item=>({"@type":"Product",name:item.name,productID:item.wixProductId,image:this.image(item),material:qualityOf(item)==='classic'?'Ring-spun cotton':'Airlume combed ring-spun cotton',model:qualityOf(item)==='classic'?'Classic':'Premium',isVariantOf:{'@id':canonical+'#design'},additionalProperty:[{'@type':'PropertyValue',name:'Quality',value:qualityOf(item)==='classic'?'Classic':'Premium'}],url:this.d2href(item.productUrl),offers:{"@type":"Offer",price:(item.priceCents/100).toFixed(2),priceCurrency:item.currency,availability:'https://schema.org/'+(item.inStock?'InStock':'OutOfStock'),url:this.d2href(item.productUrl)}}))};
  let found=false;for(const script of document.head.querySelectorAll('script[type="application/ld+json"]')){try{const value=JSON.parse(script.textContent);const replace=v=>{if(Array.isArray(v))return v.map(replace);if(v&&typeof v==='object'){if(['Product','ProductGroup'].includes(v['@type'])){found=true;return group;}if(v['@graph'])v['@graph']=replace(v['@graph']);}return v;};const result=replace(value);script.textContent=JSON.stringify(result);}catch{}}
  if(!found){const script=document.createElement('script');script.type='application/ld+json';script.dataset.tshirtSeo='';script.textContent=JSON.stringify(group);document.head.append(script);}
 };
 P.disconnectedCallback=function(){window.removeEventListener('popstate',this.tshirtPop);this.tshirtPop=null;return disconnect.call(this);};
}
