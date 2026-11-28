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
// Apparel launch: preserve legacy exports; enable the new category only in current Design 2.
FILTERS.apparel=['all'];
FILTERS.hoodies=['all'];
FILTERS.clothing=['all','t-shirts','hoodies'];
LEGACY_ROUTES['berlin-clothing']=['clothing','all'];
export function clothingHref(filter='all'){if(!FILTERS.clothing.includes(filter))throw new TypeError('Unknown clothing filter');const u=new URL('https://walkofberlin.com/category/berlin-clothing');if(filter!=='all')u.searchParams.set('collection',filter);return u.href;}
LEGACY_ROUTES['berlin-hoodies']=['hoodies','all'];
LEGACY_ROUTES['berlin-t-shirts']=['apparel','all'];
LEGACY_ROUTES['berliner-sprueche']=['apparel','all'];   // not 'clothing': syncClothingSeo would rewrite title and canonical to /category/berlin-clothing
LEGACY_ROUTES['berlin-u-bahn-poster']=['print','all'];   // Berlin U-Bahn Poster (28 Nov 2026): print tab like berlin-poster; the landing draws the 11 station prints
// Premium tote bags (24 Nov 2026): their own category, listed under Gifts in the menu.
FILTERS['tote-bags']=['all'];
LEGACY_ROUTES['berlin-tote-bags']=['tote-bags','all'];
FILTERS['berlin-mugs']=['all'];
LEGACY_ROUTES['berlin-mugs']=['berlin-mugs','all'];
export const STORE_MENU_DESIGN2 = Object.freeze([
  {id:'posters',label:'Posters',de:'Poster',href:storeHref('print'),items:[
    {label:'All posters',de:'Alle Poster',href:storeHref('print')},
    ...[['everyday','Everyday','Berliner Alltag'],['landmarks','Landmarks','Wahrzeichen'],['stories','Berlin Stories','Berliner Geschichten'],['districts','Districts','Bezirke'],['sets','Sets','Sets']].map(([id,label,de])=>({label,de,href:storeHref('print',id)})),
    {label:'U-Bahn posters',de:'U-Bahn-Poster',href:'https://walkofberlin.com/category/berlin-u-bahn-poster'},
    {label:'Print at home',de:'Zum Selbstdrucken',href:storeHref('print')+'&format=digital'}
  ]},
  {id:'clothing',label:'Clothing',de:'Kleidung',href:clothingHref(),allLabel:'All clothing',allDe:'Alle Kleidung',items:[{label:'T-shirts',de:'T-Shirts',href:'https://walkofberlin.com/category/berlin-t-shirts'},{label:'Hoodies',de:'Hoodies',href:'https://walkofberlin.com/category/berlin-hoodies'},{label:'Tote bags',de:'Stoffbeutel',href:'https://walkofberlin.com/category/berlin-tote-bags'},{label:'Berliner Sprüche',de:'Berliner Sprüche',href:'https://walkofberlin.com/category/berliner-sprueche'}]},
  {id:'gifts',label:'Gifts',de:'Geschenke',href:'https://walkofberlin.com/category/berlin-christmas-gifts',hrefDe:'https://walkofberlin.com/de/category/berlin-geschenke',items:[
    // Six items since 28 Nov 2026 (Yusuf: the Gifts menu had become too crowded). Newspapers, the two calendars, the digital file, the digital gift and the voucher left the list as separate lines (all still on sale and on the gift page); the calendars share one line, the mugs have their own.
    {label:'Your street in 1928',de:'Deine Straße 1928',href:STORE_PERSONALISED_PRODUCT},
    {label:'Your West Berlin street in 1979',de:'Deine West-Berliner Straße 1979',href:'https://walkofberlin.com/product-page/your-west-berlin-street-in-1979-personalised-aerial-print'},
    {label:'Your name on a street sign',de:'Dein Name als Straßenschild',href:'https://walkofberlin.com/product-page/berlin-street-sign-with-your-name'},
    {label:'2027 Calendars',de:'Kalender 2027',href:storeHref('calendar')},
    {label:'Berlin Mugs',de:'Berlin-Tassen',href:'https://walkofberlin.com/category/berlin-mugs'},
    {label:'Digital gifts & vouchers',de:'Digitale Geschenke & Gutscheine',href:'https://walkofberlin.com/category/berlin-christmas-gifts#xg-email',hrefDe:'https://walkofberlin.com/de/category/berlin-geschenke#xg-email'}
  ]},
  {id:'explore',label:'Explore Berlin',de:'Berlin entdecken',noteDe:'Alle auf Englisch',href:storeHref('audio'),items:[
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

// Berliner Sprüche (Store SEO step 3, Yusuf 25 Nov 2026: "Hepsini yap"): native Wix collection dfc86900, 19 slogan pieces. The landing lists 13 cards in design order
// (hoodie, T-shirt, Zurückbleiben bitte also the tote): the T-shirt card is the design card and carries Classic and Premium, so the Premium ids stay out (they drew a second, identical card). STORE_LANDINGS above is frozen and the legacy part of this file is append-only,
// so new landings live here; the storefront merges both. German text on both URLs like berlin-poster; utm:false keeps the product links clean.
export const STORE_LANDINGS_EXTRA = Object.freeze({
  'berliner-sprueche':{title:'Berliner Sprüche auf T-Shirts und Hoodies',text:"Das sind Sätze, die man in Berlin jeden Tag hört, und ich habe sie auf T-Shirts, Hoodies und einen Stoffbeutel gesetzt.\n\nZurückbleiben bitte: die Ansage in der U-Bahn, kurz bevor die Türen schließen. Wer in Berlin wohnt, hört sie jeden Tag und sagt sie irgendwann selbst, halb im Spaß, wenn jemand zu nah an der Tür steht.\n\nMit Karte bitte: der Satz an der Supermarktkasse und am Späti, seit fast überall mit Karte bezahlt wird. Früher hieß es in Berlin oft Nur Bargeld, heute hört man an jeder Kasse Mit Karte bitte.\n\nZug fällt aus: die Zeile auf der Anzeige am S-Bahnsteig, die jeder kennt und keiner lesen will.\n\nWegbier: das Bier für den Weg, am Späti gekauft und unterwegs getrunken.\n\nZu verschenken: der Zettel auf der Kiste vor der Haustür, in der Bücher, Teller oder ein alter Toaster auf einen neuen Besitzer warten.\n\nPfand: die Flasche, die man neben den Mülleimer stellt und nicht hinein, damit jemand sie mitnehmen kann. Auf meinem Motiv steht dazu: You deserve better.\n\nAlle Stücke sind unisex in S bis 3XL und werden auf Bestellung gedruckt. Das Material steht für jede Farbe auf der Produktseite. Die Produktseiten sind auf Englisch.\n\nIn English: T-shirts, hoodies and a tote bag with the lines Berliners hear every day, from Zurückbleiben bitte on the U-Bahn to Mit Karte bitte at the till, printed to order.",productIds:["bcd6e352-e848-4202-8039-5965a9e33e9a", "14f414a1-7cae-4004-955c-3ba08f5e677b", "cdd7fbf3-2b1d-41de-84b3-d37beee82787", "b01a9cf1-d970-4dc5-a03c-50b0f93a00cb", "4050130b-5e00-4cb2-99f5-90181cca1806", "783d5296-6ab3-44bb-b2f8-be896f5b7899", "0e2862e7-d9b0-4f5e-9ac4-7484009add6a", "a26d87cd-5947-4f7f-b6e1-f2c6d42849c3", "83e81dbe-8819-44f1-abdc-50f6ccc0c9e2", "6ecba539-d756-4181-8f66-f680b6d36929", "78a2b015-49e6-4d46-a4a2-9137198f33f1", "d0d4e797-61fa-4476-990a-3b7cd14de889", "07e2a2e4-84d9-4853-9521-f06339691506"],utm:false},
  // Berlin U-Bahn Poster (wave 2 item 8, Yusuf 28 Nov 2026): native Wix collection d9fefaa1, 11 physical station and line prints. English text; the T-shirt/Premium trap does not apply (posters carry their printable twin on the same card).
  'berlin-u-bahn-poster':{lang:'en',title:"Berlin U-Bahn posters: stations and lines",text:"I made these prints for people who look at a Berlin station and see more than a place to change trains. Kottbusser Tor shows a yellow U-Bahn crossing above the curved balconies of Neues Kreuzberger Zentrum. At Schlesisches Tor you stand on the pavement under the viaduct, with the station tower further along and no train in sight. Gleisdreieck is a close, graphic view of a yellow train on a steel bridge, and Two U-Bahn Profiles puts a Kleinprofil and a Großprofil train side by side on the same scale. Ghost Stations tells the story of the sealed stations under East Berlin after 13 August 1961, and the tram map shows how today's yellow routes still trace the old border.\n\nThree prints show station buildings: the thatched roof of Dahlem-Dorf on the U3, the open steel dome of Nollendorfplatz in Schöneberg and the green-roofed hall at Wittenbergplatz. Two follow the S-Bahn: the long curve on the brick arches at Hackescher Markt and the passage under the arches at Savignyplatz in Charlottenburg.\n\nEvery print is made to order on paper and sent unframed. All come in 30 x 40 cm and 50 x 70 cm; Ghost Stations and the tram map also come in 45 x 60 cm. Each design also exists as a printable download. My advice: start with the station you actually use, and check the two sizes against your wall before you order.",productIds:["cd3b2f77-7311-4ba2-ba3e-ca5f80fb2665", "bff3fa49-832f-4044-9175-08a60e0f4137", "5d4474b8-8ad7-40a4-8005-7a73579adb75", "075fc392-c6af-4497-bf2e-9e911809ed99", "6722fada-c4d9-4ac0-ab8a-6e2c6e911823", "7c2f473b-ecbd-4a19-9d1f-18a12fa56652", "3ec962f4-b4a5-4cb1-858c-ddfc9af1c10d", "bc489d9d-0d8e-4520-8ae5-14aa1b4c1c3a", "76898232-91ee-45fb-83fd-f8377ba54610", "8a4fc4d9-76f1-4cd1-a4cd-ea6d20190157", "e236bbb0-9f06-4921-a535-aa5ad8be3656"],utm:false},
  // Overrides of frozen legacy landings (merged key by key by the storefront: the legacy object stays untouched, these fields win). Long copy: first paragraph visible, the rest under Read more / Mehr lesen.
  'berlin-poster':{text:"Das sind meine Berlin Poster: Wahrzeichen wie Fernsehturm und Weltzeituhr, die Berliner Bezirke und kleine Alltagsszenen wie der Späti an der Ecke. Jedes Poster wird auf Bestellung gedruckt. Die Produktseiten sind auf Englisch.\n\nSo wählst du aus: Die meisten Motive gibt es in 30 × 40 cm und 50 × 70 cm, ungerahmt, damit du deinen eigenen Rahmen nehmen kannst. 30 × 40 cm passt über einen Schreibtisch oder in einen Flur, 50 × 70 cm trägt eine ganze Wand. Viele Motive gibt es auch als Datei zum Selberdrucken.\n\nFür wen: Wahrzeichen für Besucher, die etwas Bekanntes mitnehmen wollen, Bezirke für alle, die in einem Kiez wohnen oder gewohnt haben, Alltagsszenen für Leute, die Berlin von innen kennen. Die U-Bahn-Motive wie Kottbusser Tor sind für alle, die jeden Tag unter der Stadt unterwegs sind.\n\nIn English: my Berlin art prints of landmarks, districts and everyday scenes, unframed in 30 × 40 cm or 50 × 70 cm, printed to order."},
  'berlin-geschenke':{more:["Welches Geschenk für wen? Für Leute, die in Berlin wohnen oder gewohnt haben, ist die eigene Straße im Luftbild von 1928 das persönlichste Geschenk: Du gibst die Adresse ein und bekommst die Straße von oben, darunter dieselbe Stelle heute. Für Kollegen und Freunde passt eine Tasse mit einem echten Berliner Ort oder ein T-Shirt mit einem Satz, den jeder Berliner kennt, wie Zurückbleiben bitte. Für Wohnung und Wand gibt es Poster von Wahrzeichen, Bezirken und Alltagsszenen. Alles wird auf Bestellung gemacht, deshalb lieber etwas früher bestellen als in letzter Minute.", "In English: gifts for people who live in Berlin or love the city, from a personalised 1928 aerial print of their own street to mugs, T-shirts and posters, all made to order."]}
});
// Intro text for categories that are not landings (the normal listing keeps its filters, sorting and design cards): same first-paragraph-plus-Read-more block, English, shown only on the bare category address.
export const STORE_INTROS = Object.freeze({
  'berlin-mugs':{lang:'en',text:"These are my Berlin mugs: six white ceramic mugs, 325 ml (11 oz), each showing a real Berlin place on an ordinary day. Kotti with a yellow U-Bahn on the viaduct, Sunday karaoke at Mauerpark, the Brandenburger Tor in warm red, a bench in the Tiergarten, a sailboat on the Wannsee and a pavilion in the Gärten der Welt. The handle and the inside match the colours of the picture. Every mug is made to order and ships to Germany, the UK, the US and the rest of the EU."},
  'berlin-hoodies':{lang:'en',text:"My Berlin hoodies carry my own designs of the city: lines Berliners hear every day, like Zurückbleiben bitte, Mit Karte bitte and Zug fällt aus, and places like the Späti on the corner, Tempelhof, Teufelsberg and the Brandenburger Tor. They are unisex, in S to 3XL, and printed to order, with the material for each colour on the product page. They ship to Germany, the UK, the US and the rest of the EU. The sayings are also on T-shirts in my Berliner Sprüche collection."},
  'berlin-t-shirts':{lang:'en',text:"My Berlin T-shirts carry my own designs of the city: lines Berliners hear every day, like Mit Karte bitte, Zug fällt aus, Zurückbleiben bitte and Wegbier, and places like the Späti on the corner, Tempelhof, Teufelsberg, Schönhauser Allee and Berlin in Pink. Each design comes as a Classic or a Premium unisex T-shirt in S to 3XL, with the material for each colour on the product page. Every shirt is printed to order and ships to Germany, the UK, the US and the rest of the EU. The sayings are also on hoodies in my Berliner Sprüche collection."},
  'berlin-tote-bags':{lang:'en',text:"Two Berlin tote bags in heavy cotton. Zurückbleiben bitte puts the U-Bahn announcement across the front, in a natural bag with dark lettering or a black bag with white lettering. Berlin in Pink shows the pink groundwater pipes that run above Berlin streets around building sites, over a row of Altbau houses. Both are printed to order and big enough for a laptop, a few groceries or a Späti run. They ship to Germany, the UK, the US and the rest of the EU."}
});
