// Shared Store navigation. Header/home links are generated from this module by
// scripts/sync-store-navigation.mjs; the Store reads the same routes at runtime.
export const STORE_HOME = 'https://walkofberlin.com/category/all-products';
export const STORE_PERSONALISED_PRODUCT = 'https://walkofberlin.com/product-page/your-berlin-street-in-1928-personalised-aerial-print-30-x-40-cm';
export const STORE_CALENDAR_PRODUCT = 'https://walkofberlin.com/product-page/berlin-2027-wall-calendar-a3';
export const STORE_AUDIO_HUB = 'https://walkofberlin.com/audio-tours';
export const STORE_LABELS = Object.freeze({all:'All products',print:'Art prints',digital:'Printable downloads',personalised:'Personalised prints',calendar:'2027 Wall Calendar',audio:'Audio walks'});
const FILTERS = {all:['all'],print:['all','everyday','landmarks','stories','districts'],digital:['all','dl-everyday','dl-landmarks','dl-stories','dl-districts','dl-sets','dl-calendars'],personalised:['all'],calendar:['all'],audio:['all']};
const LEGACY_ROUTES = {
  'all-products':['all','all'],
  'berlin-landmark-posters':['print','landmarks'],
  'berlin-reels-collection':['print','stories'],
  'berlin-districts-prints':['print','districts'],
  'berlin-everyday-posters':['print','everyday'],
  'wall-calendars':['calendar','all'],
  'digital-downloads':['digital','all']
};
export function storeHref(category='all', filter='all') {
  if (!FILTERS[category]?.includes(filter)) throw new TypeError('Unknown Store category or collection');
  const target = new URL(category==='digital' ? 'https://walkofberlin.com/category/digital-downloads' : STORE_HOME);
  // Explicit All also keeps retired menu-injection scripts from matching this
  // link as an unversioned collection entry while their embed is being retired.
  target.searchParams.set('tab',category);
  if (filter!=='all') target.searchParams.set('collection',filter);
  return target.href;
}
export function resolveStoreRoute({categorySlug='all-products', search=''}={}) {
  const query=new URLSearchParams(search);
  const mapped=LEGACY_ROUTES[categorySlug||'all-products'];
  if (!mapped) return {ok:false,reason:'unknown-category'};
  const category=query.get('tab')||mapped[0];
  const filter=query.get('collection')||(query.has('tab')?'all':mapped[1]);
  if (!FILTERS[category]?.includes(filter)) return {ok:false,reason:'unknown-collection'};
  return {ok:true,category,filter};
}
export const STORE_MENU = Object.freeze([
  {label:STORE_LABELS.all,href:storeHref()},
  {label:STORE_LABELS.print,href:storeHref('print')},
  {label:STORE_LABELS.digital,href:storeHref('digital')},
  {label:STORE_LABELS.personalised,href:STORE_PERSONALISED_PRODUCT},
  {label:STORE_LABELS.calendar,href:STORE_CALENDAR_PRODUCT},
  {label:STORE_LABELS.audio,href:STORE_AUDIO_HUB}
]);
export const STORE_HOME_CARDS = Object.freeze([
  {label:'PRINTED & SHIPPED',title:'Art prints',imageUrl:'https://static.wixstatic.com/media/5a08a3_23f9eb0a33794b8aaf7474e5a99f0b1c~mv2.jpg/v1/fit/w_480,h_480,q_85/file.jpg',alt:'Friedrichshain-Kreuzberg art print showing the Oberbaum Bridge',text:'Berlin landmarks, district illustrations and stories from my reels, printed to order. Choose the paper and size on the product page.',href:storeHref('print'),cta:'Browse art prints'},
  {label:'12 EVERYDAY SCENES',title:'Berlin Everyday',imageUrl:'https://fenerszymanski.github.io/berlinwalk-widgets/storefront/20261022-c4/assets/everyday-01-tempelhof.jpg',alt:'Tempelhof art print showing the former airport runway',text:'Tempelhof’s runway, the Späti after dark and Marzahn’s buildings. Choose from 12 Berlin scenes as a paper print.',href:storeHref('print','everyday'),cta:'See Berlin Everyday'},
  {label:'FOR YOUR WALL',title:'Berlin 2027 Wall Calendar',imageUrl:'https://static.wixstatic.com/media/5a08a3_de1802442ecc44c8afac5a2b5fbaeef9~mv2.jpg/v1/fit/w_640,h_480,q_85/file.jpg',alt:'Berlin 2027 A3 wall calendar open at January, with the TV Tower above the month grid',text:'One Berlin district for every month, with Berlin public holidays and school holidays. Check the product page for price and delivery dates.',href:STORE_CALENDAR_PRODUCT,cta:'See the calendar'},
  {label:'PRINT AT HOME',title:'Printable downloads',imageUrl:'https://static.wixstatic.com/media/5a08a3_e1ee5add72f44c8abc4f19f4a76035f5~mv2.jpg/v1/fit/w_640,h_480,q_85/file.jpg',alt:'Twelve Berlin district illustrations arranged in a grid of frames',text:'Berlin artwork and a 2027 calendar as downloadable files. Print them yourself; no physical item is shipped.',href:storeHref('digital'),cta:'Browse printable downloads'}
]);
