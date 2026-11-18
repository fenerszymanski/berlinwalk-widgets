import {clothingCards,garmentDesign,syncClothingSeo} from './clothing.js?v=clothing-page-20261116-v1';
import {qualityOf,displayName,designName,designCards,designRepresentative,QUALITY_TEXT,installQuality} from './tshirt-designs.js?v=hoodies-20261116-v1';
import {extrasEnabled,prepareExtras,installExtras} from './store-extras.js?v=xmas-gifts-20261117-v1';
import {COLOR_SWATCHES,apparelCardColors,apparelCardSelection,apparelCardProduct,colorName} from './apparel-card-colors.js?v=hoodies-20261116-v1';
import {DESIGN2_TEXT,translateDesign2} from './ys-de.js?v=mobile-home-20261118-v1';
import {matchesSearch,familyFor,recommendationRows,nativeRecommendationEligible} from './design2-catalog.js?v=hoodies-20261116-v1';
import {languageUrl,navigateLanguageLink} from './language-navigation.js?v=store-design2-fix4b-20261113-v1';
import {installGalleryZoom} from './gallery-zoom.js?v=zoom-sort-20261117-v1';
let recommendations,translations,exploreImages,listingOrder=null;
// Sort data for store listings (Yusuf, 17 Nov 2026). Built by scripts/store-listing-order.mjs; a missing file keeps the curated order.
// Selections survive Wix replacing the loading element within the same document.
const apparelSelections=new Map();
const HOME_APPAREL=['shirt-berlin-in-pink','shirt-berlin-uhr','hoodie-tempelhof','hoodie-teufelsberg'];
const listingOrderReady=fetch(new URL('data/listing-order.json?v=zoom-sort-20261117-v1',import.meta.url)).then(r=>r.ok?r.json():null).catch(()=>null).then(j=>{if(j&&Array.isArray(j.popular)&&j.created&&typeof j.created==='object')listingOrder=j;});
export const prepare=Promise.all(['recommendations.json','de-store.json','explore-images.json'].map(file=>fetch(new URL('data/'+file+'?v='+(file==='explore-images.json'?'xmas-audio-20261116-v1':file==='de-store.json'?'xmas-audio-20261116-v1':'xmas-audio-20261116-v1'),import.meta.url)).then(r=>{if(!r.ok)throw Error('DESIGN2_DATA_UNAVAILABLE');return r.json();}))).then(([r,t,i])=>{recommendations=r;translations=t;exploreImages=i;}).then(()=>listingOrderReady).then(()=>extrasEnabled()?prepareExtras:undefined);
// The legacy page has two question groups. Keep every body and legal hook,
// merge their accordions, and retain the contact sentence after the last item.
export function mergeProductQuestions(root) {
 for(const info of root.querySelectorAll('.product-info')) {
  const faq=info.querySelector('.ys-faq'),disclosures=info.querySelector('.disclosures');
  if(!faq||!disclosures)continue;
  const contact=faq.querySelector('.ys-contact');
  const shipping=[...faq.querySelectorAll(':scope > details')].find(d=>d.querySelector('summary')?.textContent.startsWith('Where do you deliver'));
  for(const detail of [...disclosures.querySelectorAll(':scope > details')]) {
   if(shipping&&detail.matches('.delivery-returns')) {
    const body=shipping.querySelector('.details-body');
    for(const child of [...detail.querySelector('.details-body').children]) {
     const exactRepeat=child.matches('p')&&!child.attributes.length&&[...body.children].some(n=>n.outerHTML===child.outerHTML);
     if(!exactRepeat)body.append(child);
    }
    detail.remove();
   }else faq.insertBefore(detail,contact);
  }
  // Attribution and other non-accordion content must remain on the page.
  for(const node of [...disclosures.childNodes])faq.insertBefore(node,contact);
  disclosures.remove();
 }
}
export function install(Store,{asset,esc,STORE_LOGO,money,editionHref,isDigital,POSTER_DELIVERY_SHORT,NOTICE_GIFT,cartPageUrl,ysGermanTab}) {
 if(Store.prototype.design2Installed)return;
 const P=Store.prototype,old=Object.fromEntries(['shopbar','langSwitch','card','shop','product','skeletonBar','skeletonCard','skeletonShop','skeletonProduct','render','input','click','change','storeHref','connectedCallback','disconnectedCallback','ensureLink','applyContextCategory','navigateStore','signalReady','showWhenStyled','campaignGerman','landingView'].map(k=>[k,P[k]]));
 P.design2Installed=true;
 P.creditText=function(){const de=this.campaignGerman();return `<p>${de?'Explore-Berlin-Karten: lizenzierte Adobe-Stock-Fotos.':'Explore Berlin cards: licensed Adobe Stock photographs.'} <a href="https://stock.adobe.com/images/berlin-panorama-great-view-in-the-city-center/297782708" target="_blank" rel="noopener">${de?'Berliner Stadtpanorama':'Berlin skyline'} (297782708)</a>; <a href="https://stock.adobe.com/images/panorama-of-the-illuminated-brandenburger-tor-in-berlin-at-dawn-with-no-people/339049498" target="_blank" rel="noopener">${de?'Brandenburger Tor':'Brandenburg Gate'} (339049498)</a>; <a href="https://stock.adobe.com/images/high-resolution-image-of-the-museum-island-in-berlin-with-the-cathedral/636143031" target="_blank" rel="noopener">${de?'Berliner Dom und Museumsinsel':'Berliner Dom and Museum Island'} (636143031)</a>; <a href="https://stock.adobe.com/images/289999064" target="_blank" rel="noopener">${de?'Berliner Mauerrest':'Berlin Wall remnant'} (289999064)</a>; <a href="https://stock.adobe.com/images/781238330" target="_blank" rel="noopener">${de?'Bahnhof Friedrichstraße':'Friedrichstraße station'} (781238330)</a>; <a href="https://stock.adobe.com/images/305214431" target="_blank" rel="noopener">${de?'Berliner Bahngleise bei Sonnenuntergang':'Berlin railway tracks at sunset'} (305214431)</a>. ${de?'Zugeschnitten und verkleinert. Adobe Stock Standardlizenz.':'Cropped and resized. Adobe Stock Standard licence.'}</p><p>${de?'Explore-Bilder: Fotos von Yusuf Ucuz und lizenzierte Adobe-Stock-Fotografie.':'Explore pictures: photographs by Yusuf Ucuz and licensed Adobe Stock photography.'}</p><p>${de?'Topographie des Terrors':'Topography of Terror'}: <a href="https://commons.wikimedia.org/wiki/File:Topographie_des_Terrors_November_2013.jpg" target="_blank" rel="noopener">Arild Vågen</a>, <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener">CC BY-SA 3.0</a>. Anhalter Bahnhof: <a href="https://commons.wikimedia.org/wiki/File:Berlin_Anhalter_Bahnhof_-_01.jpg" target="_blank" rel="noopener">Carlos Delgado</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a>. ${de?'Fotos für die Karten zugeschnitten; es gelten die ursprünglichen Lizenzen.':'Photographs cropped for the cards; original licences apply.'}</p>`;};
 const legacyCredits=P.credits;
 P.credits=function(){const html=legacyCredits.call(this);if(!window.__bwStoreCreditsHtml.includes('Explore pictures:')&&!window.__bwStoreCreditsHtml.includes('Explore-Bilder:'))window.__bwStoreCreditsHtml+=this.creditText();return html;};
 const oldTile=P.tile;
 P.tile=function(product){const picture=exploreImages[product.id];if(picture)return `<a class="tile d2-picture" href="${esc(editionHref(product.productUrl))}"><img class="tile-photo" src="${esc(asset('assets/'+picture.image))}" alt="${esc(this.campaignGerman()?picture.altDe:picture.alt)}" width="${picture.width}" height="${picture.height}" loading="lazy" decoding="async">${picture.badge?`<span class="d2-kind-badge"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${picture.badge==='audio'?'<path d="M4 14v-3a8 8 0 0 1 16 0v3M4 12h3v8H4zM17 12h3v8h-3z"/>':picture.badge==='plan'?'<path d="M5 5h5l4 14h5M8 5h11M5 19h6"/><circle cx="5" cy="5" r="2"/><circle cx="19" cy="19" r="2"/>':picture.badge==='photo'?'<path d="M3 6h4l2-3h6l2 3h4v15H3Z"/><circle cx="12" cy="13" r="4"/>':picture.badge==='virtual'||picture.badge==='video'?'<rect x="2" y="3" width="20" height="14" rx="2"/><path d="m10 7 5 3-5 3ZM8 21h8m-4-4v4"/>':'<path d="M12 5C8 2 3 4 3 4v15s5-2 9 1c4-3 9-1 9-1V4s-5-2-9 1Zm0 0v15"/>'}</svg>${esc(this.campaignGerman()?picture.badgeDe:picture.badgeEn)}</span>`:''}${this.campaignGerman()&&this.d2explore(product)?`<span class="d2-language-badge">${esc(this.d2text('In English'))}</span>`:''}</a>`;return oldTile.call(this,product.id==='dein-berlin-2027'?{...product,image:'design2/calendar-cover.webp?v=1',imageFit:'contain'}:product);};
 const fontsReady=Promise.all([document.fonts.load("600 48px 'Fraunces'"),document.fonts.load("400 16px 'Space Grotesk'"),document.fonts.load("400 12px 'IBM Plex Mono'")]).catch(()=>{});
 P.showWhenStyled=function(box){fontsReady.then(()=>{if(this.isConnected)old.showWhenStyled.call(this,box);});};
 P.campaignGerman=function(){return /^\/de(?:\/|$)/.test(location.pathname)||old.campaignGerman.call(this)||(this.skeletonRoute().mode==='cart'&&ysGermanTab())||/\/category\/(?:berlin-poster|berlin-geschenke|berlin-kalender-2027)\/?$/.test(location.pathname);};
 // Christmas gift guide (Yusuf, 17 Nov 2026: "şu sayfayı elden geçirelim, şu an çok kısıtlı kaldı ... gifty ve christmasy look"):
// the two gift landings draw four themed shelves instead of one grid (d2giftGuide). Kept here, not in js/store-navigation.js, which may only grow at its end.
const GIFT_GUIDE_SECTIONS = Object.freeze([
  {id:'personal',ids:['ys','ys-framed','dein-berlin-2027','np-birthday'],voucher:true,
   en:{title:'Their own Berlin',text:'Made from their address, their places or their big day.'},
   de:{title:'Ihr eigenes Berlin',text:'Aus ihrer Adresse, ihren Orten oder ihrem großen Tag gemacht.'}},
  {id:'wear',ids:['hoodie-tempelhof-sf500','shirt-tempelhof-classic','hoodie-teufelsberg-sf500','shirt-teufelsberg-classic','hoodie-berlin-uhr-sf500','shirt-berlin-uhr-classic','hoodie-spaeti-sf500','shirt-spaeti-classic'],more:'clothing',
   en:{title:'Wear Berlin',text:'My Berlin designs on T-shirts and fleece hoodies. Free shipping to Germany, the EU, the UK and the US.',more:'All clothing'},
   de:{title:'Berlin zum Anziehen',text:'Meine Berliner Motive auf T-Shirts und Fleece-Hoodies. Kostenloser Versand nach Deutschland, in die EU, nach Großbritannien und in die USA.',more:'Alle Kleidung'}},
  {id:'wall',ids:['tv','wc','pr-berolina-modernist','ed-print-01-tempelhof','ed-print-09-teufelsberg','pr-siegessaeule','pr-gleisdreieck','pr-berlin-2027-wall-calendar'],more:'print',
   en:{title:'For their wall',text:'Posters of places they know, printed to order. Frames not included.',more:'All posters'},
   de:{title:'Für ihre Wand',text:'Poster von Orten, die sie kennen, auf Bestellung gedruckt. Ohne Rahmen.',more:'Alle Poster'}},
  {id:'email',ids:['au-christmas-mitte','trio','dl-berlin-landmarks-set-of-5','dl-berlin-icons-set-of-3'],chip:{de:'Per E-Mail'},
   en:{title:'Last-minute, by email',text:'These arrive by email, so they still work on Christmas Eve. The audio walks are in English.'},
   de:{title:'Last Minute per E-Mail',text:'Diese Geschenke kommen per E-Mail und klappen deshalb auch noch an Heiligabend. Die Audio-Spaziergänge sind auf Englisch.'}}
]);
const GIFT_GUIDE = Object.freeze({
  en:{kicker:'Christmas gifts',title:'Berlin gifts for Christmas',text:'I picked these for people and their places in the city: their street in 1928, a hoodie with their corner of Berlin, a poster for the wall or an audio walk for the holidays.',jump:'Jump to',
      post:'Most printed gifts: order by 16 December for delivery in Germany before Christmas. Each product page shows its own date.',email:'Digital gifts and vouchers arrive by email.',late:'Too late for the post? Digital gifts and vouchers still arrive by email.'},
  de:{kicker:'Weihnachtsgeschenke',title:'Berlin-Geschenke zu Weihnachten',text:'Ich habe sie für Menschen und ihre Orte in der Stadt ausgesucht: ihre Straße im Luftbild von 1928, ein Hoodie mit ihrer Ecke von Berlin, ein Poster für die Wand oder ein Audio-Spaziergang für die Feiertage.',jump:'Direkt zu',
      post:'Die meisten gedruckten Geschenke: bis 16. Dezember bestellen, damit sie vor Weihnachten in Deutschland ankommen. Jede Produktseite zeigt ihr eigenes Datum.',email:'Digitale Geschenke und Gutscheine kommen per E-Mail.',late:'Zu spät für die Post? Digitale Geschenke und Gutscheine kommen trotzdem per E-Mail.'},
  postUntil:'2026-12-17T00:00:00+01:00',festiveUntil:'2026-12-27T00:00:00+01:00',sections:GIFT_GUIDE_SECTIONS
});
const XG_SLUGS=['berlin-christmas-gifts','berlin-geschenke'];
// Christmas gift guide (17 Nov 2026): themed shelves, a dated post line and festive styling for the two gift landings.
const XG_BOW='<svg class="xg-bow" viewBox="0 0 120 80" aria-hidden="true"><path d="M60 40C44 14 14 6 10 22s24 26 50 18" fill="#E63946"/><path d="M60 40c16-26 46-34 50-18s-24 26-50 18" fill="#c62f3b"/><path d="M60 40l-22 34 12-2 6 8 4-40zM60 40l22 34-12-2-6 8-4-40z" fill="#E63946"/><circle cx="60" cy="40" r="9" fill="#a8222d"/></svg>';
const XG_STAR='<svg class="xg-star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.5l2.6 6.9 7.4.3-5.8 4.6 2 7.2L12 16.3l-6.2 4.2 2-7.2L2 8.7l7.4-.3z"/></svg>';
const XG_ORN={personal:'M12 3h0a2 2 0 0 1 2 2v1h-4V5a2 2 0 0 1 2-2zm-7 7a7 7 0 1 0 14 0 7 7 0 0 0-14 0z',wear:'M8 3l-5 3 2 5 2-1v11h10V10l2 1 2-5-5-3c-.5 1.5-2 2.5-4 2.5S8.5 4.5 8 3z',wall:'M3 4h18v14H3zM6 15l4-5 3 3 2-2 3 4z',email:'M3 6h18v12H3zm0 0l9 7 9-7'};
// Jump chips live in the shadow root; a capture listener on the document scrolls to the shelf before Wix's router sees the hash link.
if(!window.__xgJump){window.__xgJump=true;document.addEventListener('click',event=>{const path=event.composedPath?.()||[];const a=path.find(n=>n?.dataset?.xgJump);if(!a)return;const root=a.getRootNode?.();const target=root?.getElementById?.('xg-'+a.dataset.xgJump);if(!target)return;event.preventDefault();event.stopPropagation();target.scrollIntoView({block:'start',behavior:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});},true);}
P.d2giftGuide=function(page,model,skeleton){
 const de=page.lang==='de',g=GIFT_GUIDE,t=g[de?'de':'en'],now=Date.now(),festive=now<Date.parse(g.festiveUntil),post=now<Date.parse(g.postUntil);
 const render=p=>skeleton||this.d2Loading?this.skeletonCard(p):this.card(p);
 const find=id=>model.products.find(p=>p.wixProductId===id||p.id===id);
 const item=(product,section)=>{const o={...product,...page.cards?.[product.id]};try{const u=new URL(o.productUrl);u.searchParams.set('utm_source','store');u.searchParams.set('utm_campaign','xmas-gifts-202611');u.searchParams.set('utm_content','gifts-'+section+'-'+(de?'de':'en'));o.productUrl=u.href;}catch{}return {...o,cardSummary:this.layer.cardSummary(o.cardSummary||o.description),imageFit:section==='wear'?'cover':(o.imageFit||'contain')};};
 let voucher='';
 if(page.voucher){try{voucher=this.gift?.giftCardHtml?.(this.giftOffersAll(),page.voucher,{assetUrl:asset,printUrl:this.navigation.STORE_PERSONALISED_PRODUCT,redirecting:this.cartRedirect==='gift'})||'';if(skeleton)voucher=voucher.replace(/data-action="gift-add"/g,'data-action="preview-wait" aria-disabled="true" aria-busy="true"');}catch{voucher='';}}
 const more=s=>s.more==='clothing'?this.navigation.clothingHref():s.more==='print'?this.navigation.storeHref('print'):'';
 const sections=g.sections.map(s=>{const rows=s.ids.map(find).filter(Boolean);const cards=(s.id==='wear'?designCards(rows,model.products):rows).map(p=>render(item(p,s.id)));if(s.voucher&&voucher)cards.push(voucher);if(!cards.length)return '';const st=s[de?'de':'en'],href=more(s);
  return `<section class="wrap xg-shelf" id="xg-${s.id}" data-xg-section="${s.id}"><div class="xg-head"><svg class="xg-orn" viewBox="0 0 24 24" aria-hidden="true"><path d="${XG_ORN[s.id]||XG_ORN.personal}"/></svg><div><h2 class="bw-raw">${esc(st.title)}</h2><p class="bw-raw">${esc(st.text)}</p></div>${href?`<a class="xg-more bw-raw" href="${esc(href)}">${esc(st.more)} →</a>`:''}</div><div class="grid category-grid d2-grid${s.voucher?' d2-gifts-grid':''}">${cards.join('')}</div></section>`;}).join('');
 const jump=g.sections.filter(s=>s.ids.some(find)).map(s=>`<a href="#xg-${s.id}" data-xg-jump="${s.id}">${esc((de&&s.chip?.de)||s[de?'de':'en'].title)}</a>`).join('');
 const strip=festive?`<div class="wrap xg-post bw-raw" role="note">${XG_STAR}<p><strong>${esc(post?t.post:t.late)}</strong>${post?` <span>${esc(t.email)}</span>`:''}</p></div>`:'';
 return `<div class="xg${festive?' xg-festive':''}" lang="${de?'de':'en'}"><section class="xg-hero"><div class="xg-snow" aria-hidden="true"></div><div class="wrap xg-hero-inner"><div class="xg-hero-copy"><span class="xg-kicker bw-raw">${XG_STAR}${esc(t.kicker)}</span><h1 class="lead bw-raw">${esc(t.title)}</h1><p class="bw-raw">${esc(t.text)}</p><nav class="xg-jump bw-raw" aria-label="${esc(t.jump)}">${jump}</nav></div><div class="xg-gift" aria-hidden="true"><div class="xg-box"><span class="xg-ribbon-v"></span><span class="xg-ribbon-h"></span>${XG_BOW}</div></div></div></section>${strip}${sections}${this.credits?this.credits():''}</div>`;
};
P.xgGuide=function(){return this.landing?.voucher&&XG_SLUGS.includes(this.skeletonRoute?.().categorySlug)?GIFT_GUIDE:null;};
P.landingView=function(){if(this.xgGuide()){const t=document.createElement('template');t.innerHTML=this.d2giftGuide(this.landing,this.model||this.skeletonModel,false);for(const price of t.content.querySelectorAll('[data-gift-card] .gift-card-prices>div'))price.classList.add('price');if(this.campaignGerman())for(const a of t.content.querySelectorAll('a[href]:not([href^="#"])'))a.setAttribute('href',this.d2href(a.getAttribute('href')));return t.innerHTML;}
 const html=old.landingView.call(this),t=document.createElement('template');t.innerHTML=html;if(this.landing?.voucher)t.content.querySelector('.category-grid')?.classList.add('d2-gifts-grid');const sortGrid=this.landing?.category&&!this.landing.productIds&&!this.landing.voucher?t.content.querySelector('.category-grid'):null;if(sortGrid){const model=this.model||this.skeletonModel,cards=[...sortGrid.children].filter(c=>c.dataset.product),byId=new Map(cards.map(c=>[c.dataset.product,c])),ps=cards.map(c=>model.products.find(p=>p.id===c.dataset.product)).filter(Boolean);if(ps.length===cards.length&&ps.length>1){for(const p of this.d2sortCards(ps,model))sortGrid.append(byId.get(p.id));sortGrid.insertAdjacentHTML('beforebegin',this.d2sortBar(ps.length));}}for(const price of t.content.querySelectorAll('[data-gift-card] .gift-card-prices>div'))price.classList.add('price');if(this.campaignGerman())for(const a of t.content.querySelectorAll('a[href]'))a.setAttribute('href',this.d2href(a.getAttribute('href')));return t.innerHTML;};
 P.d2posterPrice=function(product,twin,format){
  const line=(label,p)=>Number.isFinite(p?.priceCents)?`<span class="d2-price-line"><span class="d2-price-label">${esc(label)}</span> ${this.campaignPrice(p).replace(/^(Ab|From) /,m=>m.toLowerCase())}</span>`:'';
  if(format!=='all')return line(this.d2text(format==='digital'?'Digital file':'Printed poster'),product);
  const [print,file]=isDigital(product)?[twin,product]:[product,twin];
  return `<span class="d2-price-pair">${line(this.d2text('Poster'),print)}${line(this.d2text('File'),file)}</span>`;
 };
 const posterOptions=P.posterOptions;P.posterOptions=function(product,pack){const html=posterOptions.call(this,product,pack);if(!this.campaignGerman()||product.group!=='apparel')return html;const t=document.createElement('template');t.innerHTML=html;for(const option of t.content.querySelectorAll('[data-poster-option=Color] option'))option.textContent=colorName(option.value,true);return t.innerHTML;};
 P.d2hoodiePrice=function(p,value=p.priceCents/100){return this.campaignGerman()?new Intl.NumberFormat('de-DE',{style:'currency',currency:p.currency}).format(value):'EUR '+value.toFixed(2);};
 P.d2text=function(en){return displayName(this.campaignGerman()?(QUALITY_TEXT[en]||DESIGN2_TEXT[en]||translations['design2:'+en]||translations[en]||en):en);};
 P.d2href=function(href){return this.navigation.design2Href(href,this.campaignGerman());};
 P.storeHref=function(...args){return this.d2href(old.storeHref.apply(this,args));};
 P.d2explore=function(p){return p.source==='external'&&p.categoryIds?.some(c=>['audio','guides'].includes(c));};
 P.d2languageNote=function(){return this.campaignGerman()?`<p class="d2-language-note bw-raw">${esc(this.d2text('All in English'))}</p>`:'';};
 P.d2product=function(p){if(!this.campaignGerman())return {...p,name:displayName(p.name)};const override=this.navigation.GIFT_CARDS_DE?.[p.id]||{};const target=override.productUrl||p.productUrl;return {...p,name:displayName(this.d2explore(p)?p.name:override.name||this.d2text(p.name)),place:override.place||this.d2text(p.place),alt:translations['@alt: '+p.alt]||p.alt,image:override.image||p.image,typeLine:['np-first-day','np-last-day'].includes(p.id)?this.d2text(p.typeLine)+' · ENGLISCH':p.typeLine,productUrl:this.d2href(target)};};
 P.d2groups=function(){return this.navigation.STORE_MENU_DESIGN2.map(g=>({...g,label:this.d2text(g.label),allLabel:this.d2text(g.allLabel||'View all'),href:this.d2href(this.campaignGerman()&&g.hrefDe?g.hrefDe:g.href),items:g.items.map(i=>({...i,label:this.d2text(i.label),href:this.d2href(i.href)}))}));};
 P.langSwitch=function(){const t=document.createElement('template');t.innerHTML=old.langSwitch.call(this);const slug=location.pathname.split('/').filter(Boolean).at(-1),en=t.content.querySelector('[hreflang="en"]'),de=t.content.querySelector('[hreflang="de"]');let target;
 if(slug==='berlin-poster')target=this.navigation.storeHref('print');else if(slug==='berlin-kalender-2027')target=this.navigation.storeHref('calendar');else if(slug==='berlin-geschenke')target='https://walkofberlin.com/category/berlin-christmas-gifts';
 if(target&&en){const u=new URL(target),original=new URL(en.getAttribute('href'),location.origin);for(const [k,v] of original.searchParams)if(k!=='lang'&&k!=='baseline')u.searchParams.set(k,v);en.setAttribute('href',u.href);}
 if(slug==='berlin-christmas-gifts'&&de){const u=new URL(de.getAttribute('href'),location.origin);u.pathname='/de/category/berlin-geschenke';de.setAttribute('href',u.pathname+u.search);}
 const choices=this.posterChoices?.[this.productViewId()];for(const a of t.content.querySelectorAll('a')){const u=new URL(a.getAttribute('href'),location.origin);if(choices?.Size)u.searchParams.set('size',choices.Size);if(choices?.Paper)u.searchParams.set('paper',choices.Paper);if(choices?.Color)u.searchParams.set('color',choices.Color);u.hash=location.hash;a.setAttribute('href',languageUrl(u.href,a.hreflang));}return t.innerHTML;};

 P.d2search=function(){return `<form class="d2-search bw-raw" role="search" data-d2-search><label class="sr-only" for="d2-query">${esc(this.d2text('Search the store'))}</label><input id="d2-query" name="q" type="search" maxlength="100" autocomplete="off" placeholder="${esc(this.d2text('Search the store…'))}" value="${esc(new URLSearchParams(location.search).get('q')||'')}"><button type="submit" aria-label="${esc(this.d2text('Search'))}">${esc(this.d2text('Search'))}</button></form>`;};
 P.shopbar=function(){const groups=this.d2groups(),product=this.skeletonRoute().mode!=='shop';return `<aside class="shopbar d2-bar bw-raw"><div class="wrap d2-bar-row"><a class="shopbar-home" aria-label="${esc(this.d2text('Store home'))}" href="${esc(this.storeHref())}">${STORE_LOGO}</a><button type="button" class="d2-browse" aria-expanded="false" aria-controls="d2-groups" data-d2-browse>${esc(this.d2text('Browse categories'))}</button><nav class="d2-groups${this.campaignGerman()?' d2-groups-de':''}" id="d2-groups" aria-label="${esc(this.d2text('Store categories'))}">${groups.map(g=>`<div class="d2-group"><button type="button" aria-expanded="false" aria-controls="d2-menu-${g.id}" data-d2-group="${g.id}">${g.id==='explore'?`<span class="d2-explore-wide">${esc(g.label)}</span><span class="d2-explore-compact">${esc(this.d2text('Explore'))}</span>`:esc(g.label)}</button><div class="d2-menu" id="d2-menu-${g.id}" hidden>${this.campaignGerman()&&g.id==='explore'?`<small class="d2-menu-note">${esc(this.d2text('All in English'))}</small>`:''}<a class="d2-all" href="${esc(g.href)}">${esc(g.allLabel)}</a>${g.items.map(i=>`<a href="${esc(i.href)}">${esc(i.label)}</a>`).join('')}</div></div>`).join('')}</nav><div class="d2-bar-search ${product?'d2-compact-search':''}">${this.d2search()}</div><button type="button" class="d2-search-toggle" data-d2-search-toggle aria-expanded="false" aria-label="${esc(this.d2text('Search the store'))}"><img src="${esc(asset('assets/design2/search.svg?v=1'))}" width="20" height="20" alt=""></button>${this.langSwitch()}<a class="cart-link" href="${esc(cartPageUrl(this.campaignGerman()))}">${esc(this.d2text('Cart'))} (${this.cart?this.cart.count:'—'})</a></div></aside>`;};
 P.skeletonBar=function(){return this.shopbar();};
 P.d2cardNative=function(product){
  return (this.catalogue?.products||this.snapshotRows())?.find(row=>row.productId===product.wixProductId);
 };
 P.d2swatches=function(product,color,enabled){
  const colors=apparelCardColors(product,this.d2cardNative(product));
  if(!colors.length)return '';
  const de=this.campaignGerman();
  return `<div class="d2-color-options" role="group" aria-label="${de?'Verfügbare Farben':'Available colours'}">${colors.map(value=>`<button type="button" class="d2-color-swatch" data-d2-color="${esc(value)}" data-d2-color-product="${esc(product.id)}" aria-label="${esc(colorName(value,de))}" title="${esc(colorName(value,de))}" aria-pressed="${value===color}" ${enabled?'':'disabled'} style="--swatch:${COLOR_SWATCHES[value][0]}"><span aria-hidden="true"></span></button>`).join('')}<span class="d2-color-name" aria-live="polite">${esc(colorName(color,de))}</span></div>`;
 };
 P.card=function(product,feature=false,format='all',model=this.model||this.skeletonModel){
  const merged=!!qualityOf(product);
  if(merged){
   product=designRepresentative(product,model?.products||[product]);
   product={...product,name:designName(product),typeLine:'UNISEX T-SHIRT · CLASSIC / PREMIUM'};
  }
  if(this.context.mode==='cart')return old.card.call(this,product,feature);
  const apparel=product.group==='apparel',poster=product.categoryIds?.includes('print');
  const ready=!this.d2Loading&&(!apparel||(product.priceCents>0&&/^https:\/\/[^/]+\/(?:de\/)?product-page\/[^/?#]+/.test(product.productUrl)));
  const color=apparelCardSelection(product,apparelSelections.get(product.id),this.d2cardNative(product));
  const p=this.d2product(ready?apparelCardProduct(product,color):product);
  const href=apparel&&!ready?'':editionHref(p.productUrl);
  const twin=poster?model?.getTwin(product):null;
  const typeLine=this.d2text(p.typeLine||'');
  const type=product.apparelKind==='hoodie'?this.cardType(product,model)
   :poster?this.d2text(twin?'Printed / Digital':isDigital(product)?'Digital file':'Printed poster')
   :this.d2explore(product)?typeLine.replace(/ · ENGLISCH$/,''):typeLine;
  const art={...p,imageFit:product.source==='external'||poster?'contain':p.imageFit};
  const tile=href?this.tile(art):this.tile({...art,productUrl:null}).replace(' href="#"','');
  let price='';
  if(!ready&&product.source!=='external')price='<span class="sk-block sk-price"></span>';
  else if(poster&&(format!=='all'||twin))price=this.d2posterPrice(product,twin,format);
  else if(Number.isFinite(product.priceCents)){
   if(product.apparelKind==='hoodie')price=this.d2hoodiePrice(product);
   else if(merged)price=this.campaignGerman()?'ab '+new Intl.NumberFormat('de-DE',{style:'currency',currency:product.currency}).format(product.priceCents/100):'from EUR '+(product.priceCents/100).toFixed(2);
   else price=this.campaignPrice(product);
  }
  const external=product.source==='external'?'d2-external '+(product.id.startsWith('np-')?'d2-paper-cover':product.id.startsWith('gd-')?'d2-green-cover':'d2-dark-cover'):'';
  return `<article class="${feature?'feature':'card'} d2-card ${external} bw-raw" data-product="${esc(product.id)}" ${apparel&&ready?'data-d2-apparel-ready':''}>${tile}<div class="${feature?'feature-copy':'card-copy'}"><a class="product-name"${href?` href="${esc(href)}"`:''}>${esc(p.name)}</a><span class="place">${esc(p.place)}</span>${poster&&format!=='all'?'':`<span class="type">${esc(type)}</span>`}${this.d2swatches(product,color,ready)}<div class="card-bottom"><span class="price">${price}</span>${href?`<a class="d2-card-link sr-only" href="${esc(href)}">${esc(this.d2text('View design'))}: ${esc(p.name)}</a>`:''}</div></div></article>`;
 };
 P.skeletonCard=function(p,feature=false,format='all'){
  const before=this.d2Loading;
  this.d2Loading=!this.catalogue&&!this.snapshotUsable();
  try{return this.card(p,feature,format,this.skeletonModel);}finally{this.d2Loading=before;}
 };
 P.d2collections=function(){return `<nav class="d2-collections bw-raw" aria-label="${esc(this.d2text('Collections'))}">${[['all','All posters'],['everyday','Everyday'],['landmarks','Landmarks'],['stories','Berlin Stories'],['districts','Districts'],['sets','Sets']].map(([id,label])=>`<a href="${esc((()=>{const u=new URL(this.storeHref('print',id)),format=new URLSearchParams(location.search).get('format');if(['printed','digital'].includes(format))u.searchParams.set('format',format);return u.href;})())}" ${this.category==='print'&&this.filter===id?'aria-current="page"':''}>${esc(this.d2text(label))}</a>`).join('')}</nav>`;};
 P.d2personal=function(model){return `<section class="wrap d2-personal"><h2 class="sr-only">${esc(this.d2text('Personal Berlin gifts'))}</h2><div class="d2-personal-grid">${[['ys','Find your street'],['dein-berlin-2027','Make your calendar']].map(([id,label])=>{const p=model.products.find(p=>p.id===id);if(!p)return '';const item=this.d2product(p);return `<article class="d2-personal-card bw-raw" data-product="${esc(id)}"><a class="d2-sample" href="${esc(item.productUrl)}"><img src="${esc(this.image(id==='dein-berlin-2027'?{...item,image:'design2/calendar-cover.webp?v=1'}:item))}" alt="${esc(item.alt||item.name)}" width="600" height="600" loading="lazy"></a><div><h2><a href="${esc(item.productUrl)}">${esc(item.name)}</a></h2><p>${esc(item.place)}</p><span class="price">${this.d2Loading?'<span class="sk-block sk-price"></span>':this.campaignPrice(p)}</span><a class="outline" href="${esc(item.productUrl)}">${esc(this.d2text(label))}</a></div></article>`;}).join('')}</div></section>`;};
 P.d2clothing=function(model){
  const cards=designCards(model.products.filter(p=>p.group==='apparel'));
  const key=p=>p.id.split('-')[0]+'-'+garmentDesign(p);
  const preferred=HOME_APPAREL.map(id=>cards.find(p=>key(p)===id)).filter(Boolean);
  const candidates=[...preferred,...cards],used=new Set();
  // Fill each garment row without repeating the same artwork across rows.
  const products=[];
  for(const hoodie of [false,true]){
   let count=0;
   for(const p of candidates){
    const id=garmentDesign(p);
    if((p.apparelKind==='hoodie')!==hoodie||used.has(id))continue;
    products.push(p);
    used.add(id);
    if(++count===2)break;
   }
  }
  if(!products.length)return '';
  const href=this.d2href(this.navigation.clothingHref());
  return `<section class="wrap d2-shelf" data-d2-clothing><div class="d2-clothing-head bw-raw"><h2 class="d2-section-title">${esc(this.d2text('Clothing'))}</h2><a href="${esc(href)}">${esc(this.d2text('All clothing'))} →</a></div><p class="bw-raw">${esc(this.d2text('Berlin designs on T-shirts and fleece hoodies.'))}</p><div class="grid category-grid d2-grid">${products.map(p=>this.d2Loading?this.skeletonCard(p):this.card(p)).join('')}</div></section>`;
 };
 P.d2homeHero=function(){
  const holiday=Date.now()<Date.parse(GIFT_GUIDE.festiveUntil);
  const de=this.campaignGerman();
  const gifts=holiday?this.navigation.STORE_MENU_DESIGN2.find(group=>group.id==='gifts'):null;
  const copy=holiday
   ? de?{title:'Berlin-Geschenke zu Weihnachten',cta:'Geschenke entdecken',alt:'Verpackte Geschenke mit Tannenzweig auf einer Holzkommode.'}
       : {title:'Christmas gifts from Berlin',cta:'Explore gifts',alt:'Wrapped gifts and a fir sprig on an oak console.'}
   : {title:this.d2text('Find your Berlin.'),cta:this.d2text('Shop the prints'),alt:this.d2text('Two Berlin prints in oak frames above a cabinet.')};
  const image=holiday?'holiday-20261118':'hero';
  const version=holiday?'':'?v=3';
  const href=gifts?this.d2href(de?gifts.hrefDe:gifts.href):this.storeHref('print');
  return `<section class="d2-hero${holiday?' d2-hero-holiday':''} bw-raw">
   <picture><source media="(max-width:740px)" srcset="${esc(asset(`assets/design2/${image}-mobile.webp${version}`))}" width="780" height="700"><img src="${esc(asset(`assets/design2/${image}-desktop.webp${version}`))}" alt="${esc(copy.alt)}" width="1600" height="900" fetchpriority="high" decoding="async"></picture>
   <div class="d2-hero-copy"><h1>${esc(copy.title)}</h1><a class="primary" data-d2-hero href="${esc(href)}">${esc(copy.cta)}<span aria-hidden="true">→</span></a></div>
  </section>${holiday?'':`<div class="wrap d2-hero-notes bw-raw"><small>${esc(this.d2text('Styling example · Frames not included'))}</small></div>`}`;
 };
 P.d2home=function(model){const render=p=>this.d2Loading?this.skeletonCard(p):this.card(p);const posters=model.getCategoryView('print')?.products.slice(0,8)||[];return `${this.d2homeHero()}${this.d2personal(model)}<section class="wrap d2-shelf">${this.d2collections()}<div class="grid category-grid d2-grid">${posters.map(render).join('')}</div></section>${this.d2clothing(model)}<section class="wrap d2-shelf"><h2 class="d2-section-title bw-raw">${esc(this.d2text('My picks'))}</h2><div class="d2-picks">${['berlin-after-dark','room-to-breathe','berlin-clocks'].map(id=>{const pick=recommendations.pairSelections.find(p=>p.id===id);if(!pick)return '';const ps=pick.families.map(id=>recommendations.families.find(f=>f.id===id)).map(f=>f?.members.map(id=>model.products.find(p=>p.id===id)).find(p=>p?.fulfilment?.cartEligible&&!isDigital(p))).filter(Boolean);if(ps.length<2)return '';return `<section><h3 class="bw-raw">${esc(this.d2text(pick.name))}</h3><div class="d2-pair">${ps.slice(0,2).map(render).join('')}</div></section>`;}).join('')}</div></section><section class="wrap d2-shelf"><h2 class="d2-section-title bw-raw">${esc(this.d2text('Explore Berlin'))}</h2>${this.d2languageNote()}<div class="d2-explore">${['trio','gd-trip-planner','gd-landmarks'].map(id=>model.products.find(p=>p.id===id)).filter(Boolean).map(render).join('')}</div></section><p class="wrap d2-delivery bw-raw">${esc(this.d2text(POSTER_DELIVERY_SHORT))}</p>${this.credits()}`;};
 P.d2clothingFilters=function(){return `<p class="bw-raw">${esc(this.d2text('Berlin designs on T-shirts and hoodies. Choose a garment, then pick your colour and size.'))}</p><nav class="d2-formats bw-raw" data-clothing-filters aria-label="${esc(this.d2text('Garment'))}">${[['all','All'],['t-shirts','T-shirts'],['hoodies','Hoodies']].map(([id,label])=>`<a href="${esc(this.d2href(this.navigation.clothingHref(id)))}" ${this.filter===id?'aria-current="page"':''}>${esc(this.d2text(label))}</a>`).join('')}</nav>`;};
 // Store listing sort (Yusuf, 17 Nov 2026: Most popular default, Newest, Cheapest). A card stands for its
 // printed/digital twin and every colour/quality member of the same design, so it ranks by its best member.
 // Lowest price uses the cheapest format the card offers; a product missing from the data file counts as newest.
 const D2_SORTS=[['popular','Most popular','Beliebteste'],['newest','Newest','Neueste'],['price','Lowest price','Preis aufsteigend']];
 P.d2sortValue=function(){const s=new URLSearchParams(location.search).get('sort');return D2_SORTS.some(([id])=>id===s)?s:'popular';};
 P.d2sortCards=function(cards,model,format='all'){const sort=this.d2sortValue(),all=model.products||[];
  const members=card=>{const ids=new Set([card.wixProductId]);const twin=model.getTwin?.(card);if(twin)ids.add(twin.wixProductId);if(qualityOf(card)){const name=designName(card);for(const p of all)if(qualityOf(p)&&designName(p)===name)ids.add(p.wixProductId);}ids.delete(undefined);return [...ids];};
  const key=card=>{const ids=members(card);if(sort==='price'){const twin=format==='all'?model.getTwin?.(card):null,prices=[card.priceCents,twin?.priceCents].filter(Number.isFinite);return prices.length?Math.min(...prices):Infinity;}if(!listingOrder)return 0;if(sort==='newest'){const d=ids.map(id=>listingOrder.created[id]||'').sort().pop()||'';return d?-Date.parse(d+'T00:00:00Z'):-Infinity;}const r=ids.map(id=>listingOrder.popular.indexOf(id)).filter(i=>i>=0);return r.length?Math.min(...r):Infinity;};
  return cards.map((card,i)=>({card,i,k:key(card)})).sort((a,b)=>(a.k===b.k?0:a.k<b.k?-1:1)||a.i-b.i).map(x=>x.card);};
 P.d2sortBar=function(count){const de=this.campaignGerman(),now=this.d2sortValue();return `<div class="d2-sortbar bw-raw"><span class="d2-count">${count} ${de?(count===1?'Produkt':'Produkte'):(count===1?'product':'products')}</span><label class="d2-sort"><span>${de?'Sortieren':'Sort by'}</span><select data-d2-sort aria-label="${de?'Produkte sortieren':'Sort products'}">${D2_SORTS.map(([id,en,dt])=>`<option value="${id}" ${id===now?'selected':''}>${esc(de?dt:en)}</option>`).join('')}</select></label></div>`;};
 P.change=function(event){const f=event.target;if(f?.matches?.('[data-d2-sort]')){const u=new URL(location.href);if(f.value==='popular')u.searchParams.delete('sort');else u.searchParams.set('sort',f.value);if(u.href!==location.href)history.replaceState({...history.state},'',u);this.measure?.('design2Step','sort-'+f.value);this.render();this.shadowRoot.querySelector('[data-d2-sort]')?.focus({preventScroll:true});return;}return old.change.call(this,event);};
 P.d2listing=function(model){const q=new URLSearchParams(location.search),search=q.get('q')?.trim()||'',format=q.get('format')||'all',selected=model.getCategoryView(this.category,this.filter);let products=selected?.products||model.products;
 if(this.category==='print'&&format==='digital')products=(model.getCategoryView('print',this.filter)?.products||[]).map(p=>isDigital(p)?p:model.getTwin(p)).filter(p=>p&&isDigital(p));
 if(this.category==='print'&&format==='printed')products=products.filter(p=>!isDigital(p));
 if(q.get('view')==='explore')products=model.products.filter(p=>p.categoryIds?.some(c=>['audio','guides'].includes(c)));
 if(q.get('view')==='virtual')products=products.filter(p=>/virtual|night-in/.test(p.id));
 if(search){const matched=model.products.filter(p=>matchesSearch(p,search,{family:familyFor(recommendations,p.id),translations})),ids=new Set(matched.map(p=>{if(p.apparelKind==='hoodie')return p.id;if(qualityOf(p))return designRepresentative(p,model.products).id;if(p.apparelKind==='hoodie')return p.id;const family=familyFor(recommendations,p.id),representative=family?.members.map(id=>model.products.find(p=>p.id===id)).find(p=>p&&!isDigital(p));return representative?.id||p.id;}));products=model.products.filter(p=>ids.has(p.id));}
 products=this.category==='clothing'&&!search?clothingCards(products,model.products):designCards(products,model.products);
 const cardFormat=this.category==='print'&&!search&&['digital','printed'].includes(format)?format:'all';
 products=this.d2sortCards(products,model,cardFormat);const keepSort=u=>{const s=new URLSearchParams(location.search).get('sort');if(s)u.searchParams.set('sort',s);return u;};
 const title=q.get('view')==='explore'?'Explore Berlin':search?'Search results':this.category==='print'?this.filter==='all'?'All posters':({everyday:'Everyday',landmarks:'Landmarks',stories:'Berlin Stories',districts:'Districts',sets:'Sets'}[this.filter]):selected?.title||'Available products';
 return `<section class="wrap d2-listing"><h1 class="d2-list-title bw-raw">${esc(this.d2text(this.category==='clothing'&&!search?'Berlin Clothing':title))}</h1>${this.category==='clothing'&&!search?this.d2clothingFilters():''}${this.campaignGerman()&&!search&&(['audio','guides'].includes(this.category)||['virtual','explore'].includes(q.get('view')))?`<p class="d2-language-intro bw-raw">${esc(this.d2text('My audio walks, guides and virtual tours are available in English.'))}</p>`:''}${search?`<p class="bw-raw d2-query">${esc(search)}</p>`:''}${this.category==='print'&&!search?this.d2collections()+`<nav class="d2-formats bw-raw" aria-label="${esc(this.d2text('Format'))}">${[['all','All'],['printed','Printed'],['digital','Digital']].map(([id,label])=>{const u=keepSort(new URL(this.storeHref('print',this.filter)));if(id!=='all')u.searchParams.set('format',id);return `<a href="${esc(u.href)}" ${format===id?'aria-current="page"':''}>${esc(this.d2text(label))}</a>`;}).join('')}</nav>`:''}${products.length>1?this.d2sortBar(products.length):''}<div class="grid category-grid d2-grid">${products.map(p=>this.d2Loading?this.skeletonCard(p,false,cardFormat):this.card(p,false,cardFormat,model)).join('')}</div>${!products.length?`<div class="d2-empty bw-raw"><h2>${esc(this.d2text('No results found.'))}</h2><p>${esc(this.d2text('Try one of these categories.'))}</p><nav>${this.d2groups().map(g=>`<a class="outline" href="${esc(g.href)}">${esc(g.label)}</a>`).join('')}</nav></div>`:''}</section>`;};
 P.shop=function(){if(this.routeError)return old.shop.call(this);const model=this.model||this.skeletonModel;if(this.landing)return this.landingView();const q=new URLSearchParams(location.search);return this.category==='all'&&!q.get('q')&&!q.get('view')?this.d2home(model):this.d2listing(model);};
 P.skeletonShop=function(route,model){const routeState=this.navigation.resolveStoreRoute({categorySlug:route.categorySlug||'all-products',search:location.search});const saved={category:this.category,filter:this.filter,landing:this.landing,d2Loading:this.d2Loading};this.category=routeState.category||'all';this.filter=routeState.filter||'all';const q=new URLSearchParams(location.search);this.landing=!q.has('tab')&&!q.has('collection')?this.navigation.STORE_LANDINGS?.[route.categorySlug]||null:null;this.d2Loading=!this.catalogue&&!this.snapshotUsable();try{return this.skeletonBar(model,this.category)+(this.xgGuide()?this.d2giftGuide(this.landing,model,true):this.landing?old.skeletonShop.call(this,route,model).replace(/^.*?<\/aside>/s,''):this.shop());}finally{Object.assign(this,saved);}};
 P.skeletonProduct=function(route,model){const html=old.skeletonProduct.call(this,route,model),special=route.productId==='8aaf5412-7f21-42c7-acfb-85dd8417d68c'||route.productId==='d35601ed-3b43-4269-afb9-32e7c3b1e128';return special?html:html.replace('<div class="wrap">','<div class="wrap d2-standard">');};
 P.d2rowTarget=function(cards,kind){
 if(kind==='explore')return {href:this.storeHref('all')+'&view=explore',label:'Explore all audio walks & guides'};
 const ps=Array.isArray(cards)?cards:[cards],all=test=>ps.length>0&&ps.every(test);
 if(all(p=>p.categoryIds?.includes('audio')))return {href:this.storeHref('audio'),label:'All audio walks'};
 if(all(p=>p.categoryIds?.includes('guides')))return {href:this.storeHref('guides'),label:'All guides'};
 const poster=p=>p.categoryIds?.includes('print')||p.categoryIds?.includes('digital');
 if(all(poster)){
  if(all(isDigital))return {href:this.storeHref('print')+'&format=digital',label:'Print at home'};
  const collection=['everyday','landmarks','stories','districts','sets'].find(id=>all(p=>this.model.getCategoryView('print',id)?.products.some(x=>x.id===p.id)));
  return {href:this.storeHref('print',collection||'all'),label:collection?({everyday:'All Everyday posters',landmarks:'All Landmarks posters',stories:'All Berlin Stories posters',districts:'All Districts posters',sets:'All poster sets'}[collection]):'All posters'};
 }
 if(all(p=>p.id==='ys'||p.group==='ys1928-mounted'||/calendar|gift|newspaper/.test(p.id+' '+p.kind)||p.categoryIds?.some(c=>['calendar','personalised','newspapers'].includes(c))))return {href:this.d2href(this.campaignGerman()?'https://walkofberlin.com/de/category/berlin-geschenke':'https://walkofberlin.com/category/berlin-christmas-gifts'),label:'All gifts'};
 return {href:this.storeHref('all'),label:'All products'};
 };
 P.d2recommendations=function(product){
 const gifts=(familyFor(recommendations,product.id)?.similarOnly?this.giftOffersAll():[]).map(o=>({...o.info,wixProductId:o.id,productUrl:o.row.productPageUrl,priceCents:Math.round(o.price*100),currency:o.row.currency,source:'wix',inStock:true,status:'available',action:'view',fulfilment:{cartEligible:true}}));
 const products=designCards([...this.model.products,...gifts.filter(g=>!this.model.products.some(p=>p.id===g.id))].filter(p=>p.source!=='wix'||nativeRecommendationEligible(this.catalogue?.products.find(row=>row.productId===p.wixProductId),{trustedBridge:true})),this.model.products),rows=recommendationRows(recommendations,product,products,designCards(this.related(product),this.model.products),{similarLimit:4,hangLimit:4,exploreLimit:4}),usedLinks=new Set();
 return [['similar','Similar designs'],['hang-together','Made to hang together'],['explore','Explore Berlin']].map(([kind,title])=>{
  const ps=rows[kind];if(ps.length<2)return ''; // Omit a lone eligible card; never stretch it or leave a two-column orphan.
  let target=this.d2rowTarget(ps,kind);
  if(usedLinks.has(target.href))target=ps.every(p=>p.categoryIds?.includes('print')||p.categoryIds?.includes('digital'))?{href:this.storeHref('print'),label:'All posters'}:null;
  if(target&&usedLinks.has(target.href))target=null;
  if(target)usedLinks.add(target.href);
  // Recommendation trees are assembled off-document. Eager loading prevents a
  // native lazy-image observer from remaining attached to a discarded staging tree.
  return `<section class="d2-recommendations bw-raw" data-d2-recommendations="${kind}"><h2>${esc(this.d2text(title))}</h2>${kind==='explore'?this.d2languageNote():''}<div class="grid category-grid d2-grid">${ps.map(p=>this.card(p).replace('<article ',`<article data-d2-rec="${kind}" `).replaceAll('loading="lazy"','loading="eager"')).join('')}</div>${target?`<a class="d2-view-all" href="${esc(target.href)}">${esc(this.d2text(target.label))} →</a>`:''}</section>`;
 }).join('');
 };
 P.d2giftOffer=function(){return this.context.mode==='product'&&this.gift?.isGiftId(this.context.productId)?this.giftOffersAll().find(o=>o.id===this.context.productId):null;};
 P.signalReady=function(){if(!this.d2FontsReady){if(!this.d2FontsWaiting){this.d2FontsWaiting=true;fontsReady.then(()=>{if(this.isConnected){this.d2FontsReady=true;this.signalReady();this.render();}});}return;}if(!this.d2giftOffer())return old.signalReady.call(this);if(this.readySent||!this.model)return;const sheet=this.shadowRoot.querySelector('link[rel=stylesheet]');if(sheet&&!sheet.sheet){sheet.addEventListener('load',()=>this.signalReady(),{once:true});return;}this.readySent=true;this.dispatchEvent(new CustomEvent('shop-render-ready',{detail:{channel:'wob:shop-cart:v1'},bubbles:true,composed:true}));};
 P.d2giftProduct=function(offer){const item=this.d2product({...offer.info,productUrl:offer.row.productPageUrl}),product={...offer.info,wixProductId:offer.id,priceCents:Math.round(offer.price*100),currency:offer.row.currency,source:'wix'};if(this.giftOpen===undefined)this.giftOpen=true;if(!this.giftKind)this.giftKind=offer.kind;return `<div class="wrap d2-standard d2-special"><nav class="breadcrumb"><a href="${esc(this.storeHref())}">Store</a> / ${esc(item.name)}</nav><section class="product-layout"><div class="product-title"><h1>${esc(item.name)}</h1><span class="place">${esc(item.place)}</span><span class="price">${this.campaignPrice(product)}</span></div><div class="gallery"><div class="gallery-stage"><img src="${esc(this.image(item))}" alt="${esc(item.alt)}" width="600" height="800" decoding="async" fetchpriority="high"></div></div><div class="buy-box">${this.giftEntry()}<p class="delivery">${esc(this.d2text(offer.info.giftNote))}</p></div><section class="product-info"><p>${esc(this.d2text(NOTICE_GIFT))}</p>${this.legalLinks()}${this.withdrawButton()}</section></section>${this.d2recommendations(product)}</div>`;};
 P.product=function(){const giftOffer=this.d2giftOffer();if(giftOffer)return this.d2giftProduct(giftOffer);let html=old.product.call(this);const product=this.model.products.find(p=>p.wixProductId===this.productViewId());if(!product||!html)return html;const template=document.createElement('template');template.innerHTML=html;template.content.querySelector('.more')?.remove();mergeProductQuestions(template.content);for(const story of template.content.querySelectorAll('.story')){const body=story.querySelector(':scope > div');if(!body?.textContent.trim())story.remove();}if(this.campaignGerman()&&product.id!=='ys'&&product.id!=='dein-berlin-2027'){const h=template.content.querySelector('.product-title h1'),place=template.content.querySelector('.product-title .place');if(h)h.textContent=this.d2text(product.name);if(place)place.textContent=this.d2text(product.place);const crumb=template.content.querySelector('.breadcrumb');if(crumb?.lastChild?.nodeType===3)crumb.lastChild.textContent=' / '+this.d2text(product.name);}if(product.apparelKind==='hoodie'){const price=template.content.querySelector('.product-title .price'),n=this.catalogue?.products.find(n=>n.productId===product.wixProductId),pack=this.posterPack(product,n);if(price)price.textContent=this.d2hoodiePrice(product,pack?.selected?.price??product.priceCents/100);}const ysLayout=template.content.querySelector('.ys-layout');if(ysLayout){const visual=document.createElement('div'),content=document.createElement('div');visual.className='d2-ys-visual';content.className='d2-ys-content';const info=ysLayout.querySelector('.product-info');for(const node of [...ysLayout.children]){if(node===info)continue;(node.matches('.gallery')?visual:content).append(node);}if(info){for(const node of [...info.children])(node.matches('.story,.p12-real-print')?visual:content).append(node);info.remove();}ysLayout.append(visual,content);}const shell=template.content.querySelector('.wrap');if(shell){const special=product.id==='ys'||product.group==='ys1928-mounted'||product.id==='dein-berlin-2027'||/^gift-/.test(product.id);shell.classList.add(special?'d2-special':'d2-standard');const rec=document.createElement('template');rec.innerHTML=this.d2recommendations(product);shell.append(rec.content);}return template.innerHTML;};
 P.applyContextCategory=function(){old.applyContextCategory.call(this);};
 P.d2navigate=function(href,event){
 const anchor=event.target?.closest?.('a[href]');
 if(navigateLanguageLink(event,anchor,{currentLanguage:this.campaignGerman()?'de':'en',beforeNavigate:language=>{
  this.d2closeMenus();
  if(this.context.mode==='cart'&&anchor.closest('.lang-switch'))try{const choice=JSON.parse(sessionStorage.getItem('bwYsLastChoice')||'null');if(choice)sessionStorage.setItem('bwYsLastChoice',JSON.stringify({...choice,lang:language}));}catch{}
 }}))return true;
 if((event.button!==undefined&&event.button!==0)||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return false;
 if(anchor&&((anchor.target&&anchor.target!=='_self')||anchor.hasAttribute('download')))return false;
 const target=new URL(href,location.href),local=['walkofberlin.com','www.walkofberlin.com',location.hostname].includes(target.hostname);
 if(!local||!/^\/(?:de\/)?(?:category|product-page)\//.test(target.pathname))return false;
 event.preventDefault();event.stopImmediatePropagation();
 const menu=event.target?.closest?.('.d2-group')?.querySelector('[data-d2-group]');
 if(menu)this.measure('design2Step','menu-'+menu.dataset.d2Group);
 this.d2closeMenus();
 if(target.pathname===location.pathname&&this.context.mode==='shop'){
  const next=new URL(location.href);next.search=target.search;next.hash=target.hash;
  if(next.href!==location.href)history.pushState({...history.state},'',next);
  this.applyContextCategory();this.render();this.scrollIntoView({block:'start',behavior:'instant'});
  const heading=this.shadowRoot.querySelector('.surface h1');if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}
 }else{
  // Wix SPA navigation can lose a query and reuse a stale element/context.
  // A document navigation runs the existing page bridge with the exact URL.
  target.protocol=location.protocol;target.host=location.host;location.assign(target.href);
 }
 return true;
 };
 P.d2closeMenus=function(focus=false){this.shadowRoot.querySelectorAll('[data-d2-group][aria-expanded="true"]').forEach(b=>{b.setAttribute('aria-expanded','false');this.shadowRoot.getElementById(b.getAttribute('aria-controls')).hidden=true;if(focus)b.focus();});};
 P.click=function(event){const el=event.target;
 const swatch=el.closest?.('[data-d2-color]');
 if(swatch){
  const loading=swatch.closest('.skeleton'),surface=loading||swatch.closest('.surface');
  const model=loading?this.skeletonModel:this.model;
  const product=model?.products.find(p=>p.id===swatch.dataset.d2ColorProduct),color=swatch.dataset.d2Color;
  if(swatch.disabled||!product||!apparelCardColors(product,this.d2cardNative(product)).includes(color))return;
  event.preventDefault();
  event.stopImmediatePropagation();
  apparelSelections.set(product.id,color);
  for(const card of surface.querySelectorAll('article[data-product]')){
   if(card.dataset.product!==product.id)continue;
   const active=card.contains(this.shadowRoot.activeElement),template=document.createElement('template'),feature=card.classList.contains('feature');
   template.innerHTML=loading?this.skeletonCard(product,feature):this.card(product,feature);
   const next=template.content.firstElementChild;
   card.replaceWith(next);
   if(active)[...next.querySelectorAll('[data-d2-color]')].find(b=>b.dataset.d2Color===color)?.focus({preventScroll:true});
  }
  return;
 }
if(el.closest?.('[data-d2-hero]'))this.measure('design2Step','hero');const rec=el.closest?.('[data-d2-rec]');if(rec&&el.closest('a'))this.measure('design2Step',rec.dataset.d2Rec==='hang-together'?'recommendation-hang-together':rec.dataset.d2Rec==='similar'?'recommendation-similar':'recommendation-explore');const group=el.closest?.('[data-d2-group]');if(group){const open=group.getAttribute('aria-expanded')!=='true';this.d2closeMenus();group.setAttribute('aria-expanded',String(open));this.shadowRoot.getElementById(group.getAttribute('aria-controls')).hidden=!open;if(open)this.measure('design2Step','menu-'+group.dataset.d2Group);return;}
 const browse=el.closest?.('[data-d2-browse]');if(browse){const on=browse.getAttribute('aria-expanded')!=='true';browse.setAttribute('aria-expanded',String(on));this.shadowRoot.querySelector('.d2-groups').classList.toggle('d2-open',on);return;}
 const search=el.closest?.('[data-d2-search-toggle]');if(search){const on=search.getAttribute('aria-expanded')!=='true';search.setAttribute('aria-expanded',String(on));this.shadowRoot.querySelector('.d2-bar-search').classList.toggle('d2-open',on);if(on)this.shadowRoot.querySelector('#d2-query')?.focus();return;}
 const a=el.closest?.('a[href]');if(a&&this.d2navigate(a.href,event))return;
 this.d2closeMenus();return old.click.call(this,event);};
 P.render=function(){if(this.catalogue)this.d2Loading=false;old.render.call(this);syncClothingSeo(this);this.credits();const address=this.shadowRoot.querySelector('#cal-search');if(address)address.placeholder=this.d2text('Berlin address');
 if(!this.d2NavigationBound){this.d2NavigationBound=true;this.shadowRoot.addEventListener('click',event=>{const a=event.target.closest?.('a[href]');if(!a||a.target==='_blank'||a.hasAttribute('download'))return;const rec=a.closest('[data-d2-rec]');if(this.d2navigate(a.href,event)){if(rec)this.measure('design2Step','recommendation-'+rec.dataset.d2Rec);if(a.matches('[data-d2-hero]'))this.measure('design2Step','hero');}},true);}
for(const crumb of this.shadowRoot.querySelectorAll('.breadcrumb > a:first-child,.breadcrumb > span:first-child')){crumb.classList.add('bw-raw');crumb.textContent='Store';}if(this.d2Outside&&!this.d2OutsideAttached){window.addEventListener('pointerdown',this.d2Outside);this.d2OutsideAttached=true;}if(this.campaignGerman())translateDesign2(this.shadowRoot,translations);for(const el of this.shadowRoot.querySelectorAll('.product-title h1,.breadcrumb,.cart-line h3')){const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let node;while((node=walker.nextNode()))node.textContent=displayName(node.textContent);}if(!this.d2Bound){this.d2Bound=true;this.d2Key=event=>{if(event.key==='Escape'){this.d2closeMenus(true);const browse=this.shadowRoot.querySelector('[data-d2-browse]');if(browse?.getAttribute('aria-expanded')==='true'){browse.setAttribute('aria-expanded','false');this.shadowRoot.querySelector('.d2-groups')?.classList.remove('d2-open');browse.focus();}const search=this.shadowRoot.querySelector('[data-d2-search-toggle]');if(search?.getAttribute('aria-expanded')==='true'){search.setAttribute('aria-expanded','false');this.shadowRoot.querySelector('.d2-bar-search')?.classList.remove('d2-open');search.focus();}}
 const trigger=event.target.closest?.('[data-d2-group]');if(trigger&&['ArrowDown','ArrowUp'].includes(event.key)){event.preventDefault();if(trigger.getAttribute('aria-expanded')!=='true')trigger.click();const links=this.shadowRoot.getElementById(trigger.getAttribute('aria-controls')).querySelectorAll('a');(event.key==='ArrowDown'?links[0]:links[links.length-1])?.focus();}
 const link=event.target.closest?.('.d2-menu a');if(link&&['ArrowDown','ArrowUp','Home','End'].includes(event.key)){event.preventDefault();const links=[...link.parentElement.querySelectorAll('a')],i=links.indexOf(link);links[event.key==='Home'?0:event.key==='End'?links.length-1:(i+(event.key==='ArrowDown'?1:-1)+links.length)%links.length]?.focus();}};this.shadowRoot.addEventListener('keydown',this.d2Key);this.shadowRoot.addEventListener('focusout',event=>{if(event.relatedTarget&&!event.relatedTarget.closest?.('.d2-group')&&!this.d2PointerLink)this.d2closeMenus();});this.shadowRoot.addEventListener('pointerdown',event=>{this.d2PointerLink=!!event.target.closest?.('.d2-menu a');});this.shadowRoot.addEventListener('pointerup',()=>setTimeout(()=>{this.d2PointerLink=false;},0));this.d2Outside=e=>{if(!e.composedPath().includes(this))this.d2closeMenus();};window.addEventListener('pointerdown',this.d2Outside);this.d2OutsideAttached=true;this.shadowRoot.addEventListener('submit',event=>{if(!event.target.matches('[data-d2-search]'))return;event.preventDefault();const value=event.target.querySelector('input').value.trim().slice(0,100);const u=new URL(this.storeHref());if(value)u.searchParams.set('q',value);this.measure('design2Step','search');const found=this.model?.products.some(p=>matchesSearch(p,value,{family:familyFor(recommendations,p.id),translations}));if(value&&!found)this.measure('design2Step','search-empty');if(!this.d2navigate(u.href,event))location.assign(u.href);});}};
 P.disconnectedCallback=function(){window.removeEventListener('pointerdown',this.d2Outside);this.d2OutsideAttached=false;return old.disconnectedCallback.call(this);};
 installExtras(Store);
 installQuality(Store,{esc});
 installGalleryZoom(Store);
}
