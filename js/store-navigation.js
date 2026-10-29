// Shared Store navigation. Header/home links are generated from this module by
// scripts/sync-store-navigation.mjs; the Store reads the same routes at runtime.
export const STORE_HOME = 'https://walkofberlin.com/category/all-products';
export const STORE_PERSONALISED_PRODUCT = 'https://walkofberlin.com/product-page/your-berlin-street-in-1928-personalised-aerial-print-30-x-40-cm';
export const STORE_CALENDAR_PRODUCT = 'https://walkofberlin.com/product-page/berlin-2027-wall-calendar-a3';
export const STORE_AUDIO_HUB = 'https://walkofberlin.com/audio-tours';
export const STORE_LABELS = Object.freeze({all:'All products',print:'Posters',personalised:'Personalised prints',calendar:'2027 Wall Calendar',audio:'Audio walks',guides:'Guides'});
const FILTERS = {all:['all'],print:['all','everyday','landmarks','stories','districts','sets'],personalised:['all'],calendar:['all'],audio:['all'],guides:['all']};
// Printed posters and their printable files share one category since 29 Oct 2026 (Yusuf: "bir potada eritebiliriz"). Old digital links
// (menu, homepage, ads, bookmarks) land on the matching poster collection.
const DIGITAL_ALIAS = {'all':['print','all'],'dl-everyday':['print','everyday'],'dl-landmarks':['print','landmarks'],'dl-stories':['print','stories'],'dl-districts':['print','districts'],'dl-sets':['print','sets'],'dl-calendars':['calendar','all']};
const LEGACY_ROUTES = {
  'all-products':['all','all'],
  'berlin-landmark-posters':['print','landmarks'],
  'berlin-reels-collection':['print','stories'],
  'berlin-districts-prints':['print','districts'],
  'berlin-everyday-posters':['print','everyday'],
  'wall-calendars':['calendar','all'],
  'digital-downloads':['print','all']
};
export function storeHref(category='all', filter='all') {
  if (category==='digital' && DIGITAL_ALIAS[filter]) [category,filter]=DIGITAL_ALIAS[filter];
  if (!FILTERS[category]?.includes(filter)) throw new TypeError('Unknown Store category or collection');
  const target = new URL(STORE_HOME);
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
  let category=query.get('tab')||mapped[0];
  let filter=query.get('collection')||(query.has('tab')?'all':mapped[1]);
  if (category==='digital') { if (!DIGITAL_ALIAS[filter]) return {ok:false,reason:'unknown-collection'}; [category,filter]=DIGITAL_ALIAS[filter]; }
  if (!FILTERS[category]?.includes(filter)) return {ok:false,reason:'unknown-collection'};
  return {ok:true,category,filter};
}
export const STORE_MENU = Object.freeze([
  {label:STORE_LABELS.all,href:storeHref()},
  {label:STORE_LABELS.print,href:storeHref('print')},
  {label:STORE_LABELS.personalised,href:STORE_PERSONALISED_PRODUCT},
  {label:STORE_LABELS.calendar,href:STORE_CALENDAR_PRODUCT},
  {label:STORE_LABELS.audio,href:storeHref('audio')},
  {label:STORE_LABELS.guides,href:storeHref('guides')}
]);
export const STORE_HOME_CARDS = Object.freeze([
  {label:'PRINTED & SHIPPED',title:'Art prints',imageUrl:'https://static.wixstatic.com/media/5a08a3_23f9eb0a33794b8aaf7474e5a99f0b1c~mv2.jpg/v1/fit/w_480,h_480,q_85/file.jpg',alt:'Friedrichshain-Kreuzberg art print showing the Oberbaum Bridge',text:'Berlin landmarks, district illustrations and stories from my reels, printed to order. Choose the paper and size on the product page.',href:storeHref('print'),cta:'Browse art prints'},
  {label:'12 EVERYDAY SCENES',title:'Berlin Everyday',imageUrl:'https://fenerszymanski.github.io/berlinwalk-widgets/storefront/20261022-c4/assets/everyday-01-tempelhof.jpg',alt:'Tempelhof art print showing the former airport runway',text:'Tempelhof’s runway, the Späti after dark and Marzahn’s buildings. Choose from 12 Berlin scenes as a paper print.',href:storeHref('print','everyday'),cta:'See Berlin Everyday'},
  {label:'FOR YOUR WALL',title:'Berlin 2027 Wall Calendar',imageUrl:'https://static.wixstatic.com/media/5a08a3_de1802442ecc44c8afac5a2b5fbaeef9~mv2.jpg/v1/fit/w_640,h_480,q_85/file.jpg',alt:'Berlin 2027 A3 wall calendar open at January, with the TV Tower above the month grid',text:'One Berlin district for every month, with Berlin public holidays and school holidays. Check the product page for price and delivery dates.',href:STORE_CALENDAR_PRODUCT,cta:'See the calendar'},
  {label:'PRINT AT HOME',title:'Printable downloads',imageUrl:'https://static.wixstatic.com/media/5a08a3_e1ee5add72f44c8abc4f19f4a76035f5~mv2.jpg/v1/fit/w_640,h_480,q_85/file.jpg',alt:'Twelve Berlin district illustrations arranged in a grid of frames',text:'Berlin artwork and a 2027 calendar as downloadable files. Print them yourself; no physical item is shipped.',href:storeHref('digital'),cta:'Browse printable downloads'}
]);
