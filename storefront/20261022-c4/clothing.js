import {designCards,qualityOf} from './tshirt-designs.js?v=hoodies-20261116-v1';
// Presentation order only; native commerce and availability stay in the catalogue.
export const garmentDesign=p=>p.id.replace(/^shirt-|^hoodie-/g,'').replace(/-(classic|premium|sf500)$/,'');
export function clothingCards(rows,products=rows){
 const cards=designCards(rows,products),order=new Map();
 for(const p of products)if(qualityOf(p)&&!order.has(garmentDesign(p)))order.set(garmentDesign(p),order.size);
 return cards.sort((a,b)=>(order.get(garmentDesign(a))??999)-(order.get(garmentDesign(b))??999)||Number(a.apparelKind==='hoodie')-Number(b.apparelKind==='hoodie'));
}
export function clothingSeo(german=false){
 const base='https://www.walkofberlin.com',path='/category/berlin-clothing';
 return {title:german?'Berlin Kleidung – T-Shirts & Hoodies | Walk of Berlin':'Berlin Clothing – T-shirts & Hoodies | Walk of Berlin',description:german?'Berlin-Motive von Tempelhof und Späti bis zu alltäglichen Zugansagen auf T-Shirts und Hoodies. Wähle dein Motiv, dann Farbe und Größe.':'Berlin designs, from Tempelhof and the Späti to everyday train announcements on T-shirts and hoodies. Choose your design, then pick your colour and size.',canonical:base+(german?'/de':'')+path,en:base+path,de:base+'/de'+path};
}
// Native Wix SEO must carry the same values before release. This handles filters
// and removes query parameters from the rendered canonical, without touching robots.
export function syncClothingSeo(store){
 const active=store.context?.mode==='shop'&&store.category==='clothing'&&!new URLSearchParams(location.search).get('q');
 if(!active){if(store.clothingSeoUndo){store.clothingSeoUndo();store.clothingSeoUndo=null;}return;}
 if(!store.clothingSeoUndo){const title=document.title,undo=[];store.clothingSeoUndo=()=>{document.title=title;for(const fn of undo.reverse())fn();};store.clothingSeoOriginals=undo;}
 const undo=store.clothingSeoOriginals,meta=clothingSeo(store.campaignGerman());document.title=meta.title;
 const set=(selector,tag,attrs,value,field)=>{
  let node=document.head.querySelector(selector);
  if(!node){node=document.createElement(tag);for(const [k,v] of Object.entries(attrs))node.setAttribute(k,v);document.head.append(node);undo.push(()=>node.remove());}
  else if(!node.dataset.clothingSeoSaved){const old=node.getAttribute(field);node.dataset.clothingSeoSaved='1';undo.push(()=>{if(old===null)node.removeAttribute(field);else node.setAttribute(field,old);delete node.dataset.clothingSeoSaved;});}
  node.setAttribute(field,value);
 };
 set('meta[name="description"]','meta',{name:'description'},meta.description,'content');
 set('meta[property="og:title"]','meta',{property:'og:title'},meta.title,'content');
 set('meta[property="og:description"]','meta',{property:'og:description'},meta.description,'content');
 set('meta[property="og:url"]','meta',{property:'og:url'},meta.canonical,'content');
 set('link[rel="canonical"]','link',{rel:'canonical'},meta.canonical,'href');
 for(const lang of ['en','de','x-default'])set(`link[rel="alternate"][hreflang="${lang}"]`,'link',{rel:'alternate',hreflang:lang},lang==='de'?meta.de:meta.en,'href');
}
