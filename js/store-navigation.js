// Shared Store navigation. Header/home links are generated from this module by
// scripts/sync-store-navigation.mjs; the Store reads the same routes at runtime.
export const STORE_HOME = 'https://walkofberlin.com/category/all-products';
export const STORE_PERSONALISED_PRODUCT = 'https://walkofberlin.com/product-page/your-berlin-street-in-1928-personalised-aerial-print-30-x-40-cm';
export const STORE_CALENDAR_PRODUCT = 'https://walkofberlin.com/product-page/berlin-2027-wall-calendar-a3';
// Dein Berlin 2027, the personalised calendar (listed 13 Nov 2026, Yusuf: "store'da, menüde vs nerede gerekli varsa koyalım. ana sayfa da olabilir").
export const STORE_PERSONAL_CALENDAR_PRODUCT = 'https://walkofberlin.com/product-page/dein-berlin-2027-personalised-wall-calendar';
export const STORE_AUDIO_HUB = 'https://walkofberlin.com/audio-tours';
export const STORE_LABELS = Object.freeze({all:'All products',print:'Posters',personalised:'Personalised prints',newspapers:'Personal newspapers',calendar:'2027 Calendars',audio:'Audio walks',guides:'Guides'});
const FILTERS = {all:['all'],print:['all','everyday','landmarks','stories','districts','sets'],personalised:['all'],newspapers:['all'],calendar:['all'],audio:['all'],guides:['all']};
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
  'digital-downloads':['print','all'],
  'berlin-poster':['print','all'],
  'berlin-geschenke':['all','all'],
  'berlin-kalender-2027':['calendar','all'],
  'berlin-christmas-gifts':['all','all']
};
// German landing pages (Yusuf, 30 Oct 2026): native Wix categories that Google can read. The Store draws them with their own
// heading and products, and only without ?tab= or ?collection=, so a tab click on one of them is the normal Store.
// The Christmas selection (Yusuf, 30 Oct 2026): the calendar, then the voucher card, then six posters from the most-watched reels on IG + FB (read 30 Oct 2026, all reels), in that order.
const GIFT_SELECTION = Object.freeze(['np-birthday','np-big-day','8aaf5412-7f21-42c7-acfb-85dd8417d68c','d35601ed-3b43-4269-afb9-32e7c3b1e128','trio','3a236fae-16fe-495e-8031-0e799c1bbf38','5d4474b8-8ad7-40a4-8005-7a73579adb75','8e2956c5-74e6-440e-b4c3-6cf0a3df23f2','1f9ad3cb-74f8-48ac-ac53-f41e71a09610','52d20d32-021d-4024-875c-440d29784322','3f54173e-df8a-4de3-ba9b-5e2fb29bc3eb','54584152-d3f1-4197-86e0-1c4c99ba5ccf']);
// The newspapers on the German gift page open their German pages (Yusuf, 1 Nov 2026).
export const GIFT_CARDS_DE = Object.freeze({
  'np-birthday':{name:'Der Erste Tag',place:'Zum Geburtstag',typeLine:'PERSÖNLICHE ZEITUNG · 8 SEITEN',image:'np-birthday-de.jpg',alt:'Titelseite einer Muster-Geburtstagszeitung',cardSummary:'Acht gedruckte Seiten über den Tag der Geburt: echte Nachrichten, echtes Wetter und die Geschichten der Familie.',productUrl:'https://editions.walkofberlin.com/geburtstag?utm_source=store&utm_medium=internal&utm_campaign=gift-week-202611&utm_content=store-gifts',actionLabel:'AUSGABE GESTALTEN →'},
  'np-big-day':{name:'Der Große Tag',place:'Zur Hochzeit',typeLine:'PERSÖNLICHE ZEITUNG · 8 SEITEN',image:'np-big-day-de.jpg',alt:'Titelseite einer Muster-Hochzeitszeitung',cardSummary:'Acht gedruckte Seiten über den Hochzeitstag: was Berlin machte, das Wetter, der Tag auf der Karte und Briefe der Gäste.',productUrl:'https://editions.walkofberlin.com/hochzeit?utm_source=store&utm_medium=internal&utm_campaign=gift-week-202611&utm_content=store-gifts',actionLabel:'AUSGABE GESTALTEN →'},
  "tv":{"name": "Berliner Fernsehturm", "place": "Mitte", "cardSummary": "Der Fernsehturm am Alexanderplatz als Poster für deine Wand.", "productUrl": "https://walkofberlin.com/product-page/berlin-tv-tower-poster-mitte-fernsehturm-art-print-30-x-40-cm?lang=de&utm_source=store&utm_campaign=gift-week-202611&utm_content=store-gifts-de", "actionLabel": "DETAILS ANSEHEN →"},
  "pr-gleisdreieck":{"name": "Gleisdreieck", "place": "Kreuzberg", "cardSummary": "Die Gleise und Wege am Gleisdreieck als Berliner Poster.", "productUrl": "https://walkofberlin.com/product-page/gleisdreieck-berlin-art-print?lang=de&utm_source=store&utm_campaign=gift-week-202611&utm_content=store-gifts-de", "actionLabel": "DETAILS ANSEHEN →"},
  "pr-siegessaeule":{"name": "Siegessäule", "place": "Tiergarten", "cardSummary": "Die Berliner Siegessäule im Tiergarten als Poster für deine Wand.", "productUrl": "https://walkofberlin.com/product-page/siegessaeule-berlin-art-print?lang=de&utm_source=store&utm_campaign=gift-week-202611&utm_content=store-gifts-de", "actionLabel": "DETAILS ANSEHEN →"},
  "wc":{"name": "Weltzeituhr am Alexanderplatz", "place": "Alexanderplatz", "cardSummary": "Die Weltzeituhr am Alexanderplatz als Berliner Poster.", "productUrl": "https://walkofberlin.com/product-page/berlin-world-clock-poster-alexanderplatz-art-print-30-x-40-cm?lang=de&utm_source=store&utm_campaign=gift-week-202611&utm_content=store-gifts-de", "actionLabel": "DETAILS ANSEHEN →"},
  "pr-berolina-modernist":{"name": "Berolina, ein Berliner Wahrzeichen", "place": "Alexanderplatz", "cardSummary": "Die frühere Berolina-Statue in einer modernen Berliner Illustration.", "productUrl": "https://walkofberlin.com/product-page/berolina-modernist-berlin-art-print?lang=de&utm_source=store&utm_campaign=gift-week-202611&utm_content=store-gifts-de", "actionLabel": "DETAILS ANSEHEN →"},
  "pr-friedrichshain-kreuzberg":{"name": "Friedrichshain-Kreuzberg", "place": "Oberbaumbrücke", "cardSummary": "Die Oberbaumbrücke verbindet die beiden Teile des Bezirks. Hol dir die Illustration als Poster.", "productUrl": "https://walkofberlin.com/product-page/friedrichshain-kreuzberg-art-print?lang=de&utm_source=store&utm_campaign=gift-week-202611&utm_content=store-gifts-de", "actionLabel": "DETAILS ANSEHEN →"},
  "dein-berlin-2027":{"name": "Dein Berlin 2027", "place": "Deine Berliner Orte", "cardSummary": "Ein Wandkalender mit ihren Berliner Orten: jeden Monat einer davon von oben, 1928 und heute.", "productUrl": "https://walkofberlin.com/product-page/dein-berlin-2027-personalised-wall-calendar?lang=de&utm_source=store&utm_campaign=gift-week-202611&utm_content=store-gifts-de", "actionLabel": "DETAILS ANSEHEN →"},
  "pr-berlin-2027-wall-calendar":{"name": "Berlin Wandkalender 2027", "place": "12 Berliner Bezirke", "cardSummary": "Ein Berliner Bezirk für jeden Monat. Gedruckter A3-Wandkalender, ohne Rabatt.", "productUrl": "https://walkofberlin.com/product-page/berlin-2027-wall-calendar-a3?lang=de&utm_source=store&utm_campaign=gift-week-202611&utm_content=store-gifts-de", "actionLabel": "DETAILS ANSEHEN →"},
  "ys":{"name": "Deine Berliner Straße um 1928", "place": "Dein Zuhause, damals und heute", "cardSummary": "Wähle deine Berliner Adresse. Ich mache daraus einen Druck mit Luftbildern von 1928 und heute.", "productUrl": "https://walkofberlin.com/product-page/your-berlin-street-in-1928-personalised-aerial-print-30-x-40-cm?lang=de&utm_source=store&utm_campaign=gift-week-202611&utm_content=store-gifts-de", "actionLabel": "DETAILS ANSEHEN →"},
  'trio':{name:'Drei Berliner Audio-Spaziergänge',place:'Berliner Mauer, Hidden Berlin und Mittelalter',cardSummary:'Drei selbstgeführte Spaziergänge mit englischen Hörkapiteln, MP3-Dateien und Routen als PDF. Die Audio-Texte sind auf Englisch.',productUrl:'https://walkofberlin.com/products/berlin-audio-trio-bundle?lang=de&utm_source=store&utm_campaign=gift-week-202611&utm_content=store-gifts-de',actionLabel:'DETAILS ANSEHEN →'}
});
export const STORE_LANDINGS = Object.freeze({
  'berlin-poster':{title:'Berlin Poster',text:'Das sind meine Berlin Poster: Wahrzeichen wie Fernsehturm und Weltzeituhr, die Berliner Bezirke und kleine Alltagsszenen wie der Späti an der Ecke. Jedes Poster wird auf Bestellung gedruckt. Die Produktseiten sind auf Englisch.',category:'print'},
  'berlin-geschenke':{lang:'de',title:'Berlin Geschenke, für einen Menschen und seinen Ort',text:'Zum Geburtstag in Berlin passt eine Zeitung über den Tag der Geburt. Für jemanden, der die Stadt vermisst, nehme ich eine Straße im Luftbild von 1928 oder ein Poster von einem vertrauten Ort. Du findest hier auch drei englische Audio-Spaziergänge als Paket und zwei Wandkalender für 2027, einen davon mit ihren eigenen Orten.',productIds:GIFT_SELECTION,cards:GIFT_CARDS_DE,voucher:{after:99,title:'Gutschein: Deine Straße 1928',text:'Du verschenkst den Gutschein, die beschenkte Person wählt ihre Straße. Code und Karte zum Ausdrucken kommen per E-Mail.',file:'Datei',print:'Poster',more:'Adresse bekannt? Gestalte das Poster direkt'}},
  'berlin-christmas-gifts':{lang:'en',title:'Berlin Christmas gifts, for their place in the city',text:'For a Berlin birthday, I would start with a newspaper about the day they were born. For someone who misses the city, try their street in a 1928 aerial photograph or a poster of a familiar place. I have also selected three English audio walks as a bundle and two 2027 wall calendars, one of them made from their own places.',productIds:GIFT_SELECTION,voucher:{after:99,title:'Voucher: Your Berlin Street in 1928',text:'Give the voucher and let them choose their street. The code and a printable card arrive by email.',file:'File',print:'Poster',more:'Know the address? Make the print directly'}},
  'berlin-kalender-2027':{title:'Berlin Kalender 2027',text:'Dein Berlin 2027 ist ein Wandkalender mit deinen eigenen Orten: Jeder Monat zeigt einen Ort aus deinem Leben von oben, 1928 und heute. Mein Bezirkskalender zeigt für jeden Monat einen Bezirk, vom Fernsehturm in Mitte bis zum Borsigtor in Reinickendorf, gedruckt in A3 oder als Datei zum Selberdrucken. Die Seite von Dein Berlin 2027 gibt es auf Deutsch, die anderen Produktseiten sind auf Englisch.',productIds:["d35601ed-3b43-4269-afb9-32e7c3b1e128", "54584152-d3f1-4197-86e0-1c4c99ba5ccf", "8022f602-c244-954d-7744-b56ce8a9a71d"]}
});
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
  // 13 Nov 2026 (Yusuf: "menüden takvime bastığında sadece diğer takvim geliyor"): one line, the calendar tab with Dein Berlin 2027 first.
  {label:STORE_LABELS.calendar,href:storeHref('calendar')},
  {label:STORE_LABELS.audio,href:storeHref('audio')},
  {label:STORE_LABELS.guides,href:storeHref('guides')}
]);
export const STORE_HOME_CARDS = Object.freeze([
  {label:'PRINTED & SHIPPED',title:'Art prints',imageUrl:'https://static.wixstatic.com/media/5a08a3_23f9eb0a33794b8aaf7474e5a99f0b1c~mv2.jpg/v1/fit/w_480,h_480,q_85/file.jpg',alt:'Friedrichshain-Kreuzberg art print showing the Oberbaum Bridge',text:'Berlin landmarks, district illustrations and stories from my reels, printed to order. Choose the paper and size on the product page.',href:storeHref('print'),cta:'Browse art prints'},
  {label:'12 EVERYDAY SCENES',title:'Berlin Everyday',imageUrl:'https://fenerszymanski.github.io/berlinwalk-widgets/storefront/20261022-c4/assets/everyday-01-tempelhof.jpg',alt:'Tempelhof art print showing the former airport runway',text:'Tempelhof’s runway, the Späti after dark and Marzahn’s buildings. Choose from 12 Berlin scenes as a paper print.',href:storeHref('print','everyday'),cta:'See Berlin Everyday'},
  {label:'MADE WITH YOUR PLACES',title:'Dein Berlin 2027',imageUrl:'https://fenerszymanski.github.io/berlinwalk-widgets/storefront/20261022-c4/assets/calendar-20261112/wall-cover.webp',alt:'Illustrated preview of the Dein Berlin 2027 wall calendar on a wall, its cover showing a Berlin square from above',text:'A 2027 wall calendar of your own Berlin places, each month one of them from above in 1928 and today. Preview every month before you order.',href:STORE_PERSONAL_CALENDAR_PRODUCT,cta:'Make your calendar'},
  {label:'PRINT AT HOME',title:'Printable downloads',imageUrl:'https://static.wixstatic.com/media/5a08a3_e1ee5add72f44c8abc4f19f4a76035f5~mv2.jpg/v1/fit/w_640,h_480,q_85/file.jpg',alt:'Twelve Berlin district illustrations arranged in a grid of frames',text:'Berlin artwork and a 2027 calendar as downloadable files. Print them yourself; no physical item is shipped.',href:storeHref('digital'),cta:'Browse printable downloads'}
]);

// Design 2 is additive: the legacy exports above remain byte-for-byte compatible.
// The publication patch flips this together with STORE_DESIGN2 in the storefront.
export const STORE_DESIGN2_MENU = true;
export const STORE_MENU_DESIGN2 = Object.freeze([
  {id:'posters',label:'Posters',de:'Poster',href:storeHref('print'),items:[
    {label:'All posters',de:'Alle Poster',href:storeHref('print')},
    ...[['everyday','Everyday','Berliner Alltag'],['landmarks','Landmarks','Wahrzeichen'],['stories','Berlin Stories','Berliner Geschichten'],['districts','Districts','Bezirke'],['sets','Sets','Sets']].map(([id,label,de])=>({label,de,href:storeHref('print',id)})),
    {label:'Print at home',de:'Zum Selbstdrucken',href:storeHref('print')+'&format=digital'}
  ]},
  {id:'gifts',label:'Gifts',de:'Geschenke',href:'https://walkofberlin.com/category/berlin-christmas-gifts',hrefDe:'https://walkofberlin.com/de/category/berlin-geschenke',items:[
    {label:'Your street in 1928',de:'Deine Straße 1928',href:STORE_PERSONALISED_PRODUCT},
    {label:'Dein Berlin 2027',de:'Dein Berlin 2027',href:STORE_PERSONAL_CALENDAR_PRODUCT},
    {label:'Berlin 2027 wall calendar',de:'Berlin Wandkalender 2027',href:STORE_CALENDAR_PRODUCT},
    {label:'Personal newspapers',de:'Persönliche Zeitungen',href:storeHref('newspapers')},
    {label:'1928 gift voucher',de:'1928-Gutschein',href:'https://walkofberlin.com/product-page/gift-your-berlin-street-in-1928-poster-gift'}
  ]},
  {id:'explore',label:'Explore Berlin',de:'Berlin entdecken',href:storeHref('audio'),items:[
    {label:'Audio walks',de:'Audiotouren',href:storeHref('audio')},
    {label:'Trip Planner',de:'Reiseplaner',href:'https://walkofberlin.com/berlin-trip-planner'},
    {label:'Guides & photo missions',de:'Guides & Foto-Missionen',href:storeHref('guides')},
    {label:'Virtual tours & Night In',de:'Virtuelle Touren & Night In',href:storeHref('guides')+'&view=virtual'}
  ]}
]);
export function design2Href(href,german=false) {
  const target=new URL(href,STORE_HOME);
  if(german&&target.hostname.endsWith('walkofberlin.com')) {
    if(/^\/(?:category|product-page|cart-page)(?:\/|$)/.test(target.pathname)){target.pathname='/de'+target.pathname;target.searchParams.delete('lang');}
    else if(/^\/products\//.test(target.pathname))target.searchParams.set('lang','de');
  }
  return target.href;
}
