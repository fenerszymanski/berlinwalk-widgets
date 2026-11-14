(() => {
const BW_HEADER_NAV_VERSION = 'clothing-discovery-20261114';
if (customElements.get('bw-site-header')?.navigationVersion === BW_HEADER_NAV_VERSION
  || customElements.get('bw-site-header-desktop-align')?.navigationVersion === BW_HEADER_NAV_VERSION) return;

const BW_HEADER_SCRIPT_URL = (document.currentScript && document.currentScript.src) || 'https://fenerszymanski.github.io/berlinwalk-widgets/site-header/site-header-element.js';
// Walk of Berlin wordmark (A15a, live 2 October 2026). The old berlinwalk-wordmark-*
// files stay in assets/ untouched. The "formerly berlinwalk.com" line is HTML text in
// IBM Plex Mono SemiBold, the same font file the blog pages load as BWPlexMono.
const BW_HEADER_LOGO_URL = new URL('../assets/walkofberlin-wordmark-green.png', BW_HEADER_SCRIPT_URL).href;
const BW_HEADER_LOGO_ON_GREEN_URL = new URL('../assets/walkofberlin-wordmark-yellow.png', BW_HEADER_SCRIPT_URL).href;
const BW_HEADER_MONO_URL = new URL('../brand/fonts/editorial-v2/IBMPlexMono-SemiBold.woff2', BW_HEADER_SCRIPT_URL).href;
const BW_HEADER_MENU_FONT_URL = new URL('../home-two-doors/assets/fonts/Fraunces-Variable-latin.woff2', BW_HEADER_SCRIPT_URL).href;
// Berlin Then and Now (service 145cb27e). The legacy booking path stays
// reachable for guests who booked before 30 September, but nothing links to it.
const BW_HEADER_BUILD = BW_HEADER_NAV_VERSION;
const BW_HEADER_BOOKING_URL = 'https://www.walkofberlin.com/book-berlin-walking-tour/berlin-then-and-now';
const BW_HEADER_TOUR_FACTS = ['about 2.5 hours', 'max 10 people', '€15']
  .map((fact) => `<span class="bw-header-fact">${fact}</span>`)
  .join(' · ');
const BW_HEADER_LINKS = {
  home: 'https://www.walkofberlin.com/',
  allTours: 'https://walkofberlin.com/all-tours',
  guidedTours: 'https://walkofberlin.com/berlin-then-and-now',
  virtualTourCategory: 'https://walkofberlin.com/all-tours#tour-virtual',
  privateTour: 'https://www.walkofberlin.com/private-tour',
  route: 'https://www.walkofberlin.com/berlin-walking-tour-route',
  guide: 'https://www.walkofberlin.com/the-guide',
  historyStory: 'https://www.walkofberlin.com/berlin-history-story',
  wallTimeline: 'https://www.walkofberlin.com/berlin-wall-timeline',
  reviews: 'https://www.walkofberlin.com/reviews',
  meetingPoint: 'https://www.walkofberlin.com/meeting-point',
  plan: 'https://www.walkofberlin.com/berlin-tools',
  planner: 'https://www.walkofberlin.com/berlin-trip-planner',
  landmarksGuide: 'https://www.walkofberlin.com/products/berlin-landmarks-guide',
  audioTours: 'https://www.walkofberlin.com/audio-tours',
  virtualTours: 'https://www.walkofberlin.com/virtual-walking-tours',
  weeklyLetter: 'https://www.walkofberlin.com/weekly',
  shop: 'https://www.walkofberlin.com/category/all-products',
  shopCalendar: 'https://www.walkofberlin.com/category/wall-calendars',
  shopDistricts: 'https://www.walkofberlin.com/category/berlin-districts-prints',
  shopLandmarks: 'https://www.walkofberlin.com/category/berlin-landmark-posters',
  shopReels: 'https://www.walkofberlin.com/category/berlin-reels-collection',
  shopPrintables: 'https://www.walkofberlin.com/category/digital-downloads',
  photoMissions: 'https://www.walkofberlin.com/products/hidden-berlin-photo-missions',
  games: 'https://www.walkofberlin.com/games',
  timeDetective: 'https://www.walkofberlin.com/games/berlin-time-detective',
  whereInBerlin: 'https://www.walkofberlin.com/games/where-in-berlin',
  berlinBattle: 'https://www.walkofberlin.com/games/berlin-battle',
  berghainBouncer: 'https://www.walkofberlin.com/games/berghain-bouncer',
  kitkatDoorTest: 'https://www.walkofberlin.com/games/kitkat-door-test',
  daySurvival: 'https://www.walkofberlin.com/games/berlin-day-survival',
  berlinRewind: 'https://www.walkofberlin.com/games/berlin-rewind',
  smileChallenge: 'https://www.walkofberlin.com/games/berlin-smile-challenge',
  blog: 'https://www.walkofberlin.com/blog',
  // The blog menu points at the real Wix blog categories, each of which now
  // renders its own category page, instead of at #bw-topic anchors inside the
  // /blog hub. Two taxonomies were being shown as one: the hub's seven derived
  // topics and the seven categories a post is actually filed under.
  blogLivingInBerlin: 'https://www.walkofberlin.com/blog/categories/living-in-berlin',
  blogTouristTips: 'https://www.walkofberlin.com/blog/categories/tourist-tips',
  blogBerlinHistory: 'https://www.walkofberlin.com/blog/categories/berlin-history',
  blogTourRoute: 'https://www.walkofberlin.com/blog/categories/tour-route',
  blogGermanLanguage: 'https://www.walkofberlin.com/blog/categories/german-language',
  blogBerlinMyths: 'https://www.walkofberlin.com/blog/categories/berlin-myths',
  blogBeforeAfter: 'https://www.walkofberlin.com/blog/categories/before-after',
  firstDayRescue: 'https://www.walkofberlin.com/products/berlin-first-day-rescue-plan',
  dateCheck: 'https://www.walkofberlin.com/berlin-dates-check',
  whatsOpen: 'https://www.walkofberlin.com/tools/whats-open-in-berlin-today',
  ticketCalculator: 'https://www.walkofberlin.com/tools/transport-ticket-calculator',
  luggageStorage: 'https://www.walkofberlin.com/tools/berlin-luggage-storage'
};

// BEGIN GENERATED STORE NAVIGATION
const BW_HEADER_STORE_LINKS = [
  {
    "label": "All products",
    "href": "https://walkofberlin.com/category/all-products?tab=all"
  },
  {
    "label": "Posters",
    "href": "https://walkofberlin.com/category/all-products?tab=print"
  },
  {
    "label": "Personalised prints",
    "href": "https://walkofberlin.com/product-page/your-berlin-street-in-1928-personalised-aerial-print-30-x-40-cm"
  },
  {
    "label": "Personal newspapers",
    "href": "https://walkofberlin.com/category/all-products?tab=newspapers"
  },
  {
    "label": "2027 Calendars",
    "href": "https://walkofberlin.com/category/all-products?tab=calendar"
  },
  {
    "label": "Audio walks",
    "href": "https://walkofberlin.com/category/all-products?tab=audio"
  },
  {
    "label": "Guides",
    "href": "https://walkofberlin.com/category/all-products?tab=guides"
  }
];
const BW_HEADER_STORE_HOME = "https://walkofberlin.com/category/all-products?tab=all";
// END GENERATED STORE NAVIGATION

// BEGIN GENERATED DESIGN2 STORE MENU
const BW_HEADER_STORE_DESIGN2 = true;
const BW_HEADER_STORE_DESIGN2_EN = [
  {
    "id": "posters",
    "label": "Posters",
    "de": "Poster",
    "href": "https://walkofberlin.com/category/all-products?tab=print",
    "items": [
      {
        "label": "All posters",
        "de": "Alle Poster",
        "href": "https://walkofberlin.com/category/all-products?tab=print"
      },
      {
        "label": "Everyday",
        "de": "Berliner Alltag",
        "href": "https://walkofberlin.com/category/all-products?tab=print&collection=everyday"
      },
      {
        "label": "Landmarks",
        "de": "Wahrzeichen",
        "href": "https://walkofberlin.com/category/all-products?tab=print&collection=landmarks"
      },
      {
        "label": "Berlin Stories",
        "de": "Berliner Geschichten",
        "href": "https://walkofberlin.com/category/all-products?tab=print&collection=stories"
      },
      {
        "label": "Districts",
        "de": "Bezirke",
        "href": "https://walkofberlin.com/category/all-products?tab=print&collection=districts"
      },
      {
        "label": "Sets",
        "de": "Sets",
        "href": "https://walkofberlin.com/category/all-products?tab=print&collection=sets"
      },
      {
        "label": "Print at home",
        "de": "Zum Selbstdrucken",
        "href": "https://walkofberlin.com/category/all-products?tab=print&format=digital"
      }
    ]
  },
  {
    "id": "clothing",
    "label": "Clothing",
    "de": "Kleidung",
    "href": "https://www.walkofberlin.com/category/berlin-t-shirts",
    "items": [
      {
        "label": "All T-shirts",
        "de": "Alle T-Shirts",
        "href": "https://www.walkofberlin.com/category/berlin-t-shirts"
      }
    ]
  },
  {
    "id": "gifts",
    "label": "Gifts",
    "de": "Geschenke",
    "href": "https://walkofberlin.com/category/berlin-christmas-gifts",
    "hrefDe": "https://walkofberlin.com/de/category/berlin-geschenke",
    "items": [
      {
        "label": "Your street in 1928",
        "de": "Deine Straße 1928",
        "href": "https://walkofberlin.com/product-page/your-berlin-street-in-1928-personalised-aerial-print-30-x-40-cm"
      },
      {
        "label": "1928 digital file",
        "de": "1928 als digitale Datei",
        "href": "https://walkofberlin.com/product-page/your-berlin-street-in-1928-digital-file"
      },
      {
        "label": "Gift a digital file",
        "de": "Digitale Datei verschenken",
        "href": "https://walkofberlin.com/product-page/your-berlin-street-in-1928-digital-gift"
      },
      {
        "label": "Dein Berlin 2027 · personalised calendar",
        "de": "Dein Berlin 2027 · persönlicher Kalender",
        "href": "https://walkofberlin.com/product-page/dein-berlin-2027-personalised-wall-calendar"
      },
      {
        "label": "Berlin 2027 wall calendar",
        "de": "Berlin Wandkalender 2027",
        "href": "https://walkofberlin.com/product-page/berlin-2027-wall-calendar-a3"
      },
      {
        "label": "Personal newspapers",
        "de": "Persönliche Zeitungen",
        "href": "https://walkofberlin.com/category/all-products?tab=newspapers"
      },
      {
        "label": "1928 gift voucher",
        "de": "1928-Gutschein",
        "href": "https://walkofberlin.com/product-page/gift-your-berlin-street-in-1928-poster-gift"
      }
    ]
  },
  {
    "id": "explore",
    "label": "Explore Berlin",
    "de": "Berlin entdecken",
    "noteDe": "Alle auf Englisch",
    "href": "https://walkofberlin.com/category/all-products?tab=audio",
    "items": [
      {
        "label": "Audio walks",
        "de": "Audiotouren",
        "href": "https://walkofberlin.com/category/all-products?tab=audio"
      },
      {
        "label": "Trip Planner",
        "de": "Reiseplaner",
        "href": "https://walkofberlin.com/berlin-trip-planner"
      },
      {
        "label": "Guides & photo missions",
        "de": "Guides & Foto-Missionen",
        "href": "https://walkofberlin.com/category/all-products?tab=guides"
      },
      {
        "label": "Virtual tours & Night In",
        "de": "Virtuelle Touren & Night In",
        "href": "https://walkofberlin.com/category/all-products?tab=guides&view=virtual"
      }
    ]
  }
];
const BW_HEADER_STORE_DESIGN2_DE = [
  {
    "id": "posters",
    "label": "Poster",
    "de": "Poster",
    "href": "https://walkofberlin.com/de/category/all-products?tab=print",
    "items": [
      {
        "label": "Alle Poster",
        "de": "Alle Poster",
        "href": "https://walkofberlin.com/de/category/all-products?tab=print"
      },
      {
        "label": "Berliner Alltag",
        "de": "Berliner Alltag",
        "href": "https://walkofberlin.com/de/category/all-products?tab=print&collection=everyday"
      },
      {
        "label": "Wahrzeichen",
        "de": "Wahrzeichen",
        "href": "https://walkofberlin.com/de/category/all-products?tab=print&collection=landmarks"
      },
      {
        "label": "Berliner Geschichten",
        "de": "Berliner Geschichten",
        "href": "https://walkofberlin.com/de/category/all-products?tab=print&collection=stories"
      },
      {
        "label": "Bezirke",
        "de": "Bezirke",
        "href": "https://walkofberlin.com/de/category/all-products?tab=print&collection=districts"
      },
      {
        "label": "Sets",
        "de": "Sets",
        "href": "https://walkofberlin.com/de/category/all-products?tab=print&collection=sets"
      },
      {
        "label": "Zum Selbstdrucken",
        "de": "Zum Selbstdrucken",
        "href": "https://walkofberlin.com/de/category/all-products?tab=print&format=digital"
      }
    ]
  },
  {
    "id": "clothing",
    "label": "Kleidung",
    "de": "Kleidung",
    "href": "https://www.walkofberlin.com/de/category/berlin-t-shirts",
    "items": [
      {
        "label": "Alle T-Shirts",
        "de": "Alle T-Shirts",
        "href": "https://www.walkofberlin.com/de/category/berlin-t-shirts"
      }
    ]
  },
  {
    "id": "gifts",
    "label": "Geschenke",
    "de": "Geschenke",
    "href": "https://walkofberlin.com/de/category/berlin-geschenke",
    "hrefDe": "https://walkofberlin.com/de/category/berlin-geschenke",
    "items": [
      {
        "label": "Deine Straße 1928",
        "de": "Deine Straße 1928",
        "href": "https://walkofberlin.com/de/product-page/your-berlin-street-in-1928-personalised-aerial-print-30-x-40-cm"
      },
      {
        "label": "1928 als digitale Datei",
        "de": "1928 als digitale Datei",
        "href": "https://walkofberlin.com/de/product-page/your-berlin-street-in-1928-digital-file"
      },
      {
        "label": "Digitale Datei verschenken",
        "de": "Digitale Datei verschenken",
        "href": "https://walkofberlin.com/de/product-page/your-berlin-street-in-1928-digital-gift"
      },
      {
        "label": "Dein Berlin 2027 · persönlicher Kalender",
        "de": "Dein Berlin 2027 · persönlicher Kalender",
        "href": "https://walkofberlin.com/de/product-page/dein-berlin-2027-personalised-wall-calendar"
      },
      {
        "label": "Berlin Wandkalender 2027",
        "de": "Berlin Wandkalender 2027",
        "href": "https://walkofberlin.com/de/product-page/berlin-2027-wall-calendar-a3"
      },
      {
        "label": "Persönliche Zeitungen",
        "de": "Persönliche Zeitungen",
        "href": "https://walkofberlin.com/de/category/all-products?tab=newspapers"
      },
      {
        "label": "1928-Gutschein",
        "de": "1928-Gutschein",
        "href": "https://walkofberlin.com/de/product-page/gift-your-berlin-street-in-1928-poster-gift"
      }
    ]
  },
  {
    "id": "explore",
    "label": "Berlin entdecken",
    "de": "Berlin entdecken",
    "noteDe": "Alle auf Englisch",
    "href": "https://walkofberlin.com/de/category/all-products?tab=audio",
    "items": [
      {
        "label": "Audiotouren",
        "de": "Audiotouren",
        "href": "https://walkofberlin.com/de/category/all-products?tab=audio"
      },
      {
        "label": "Reiseplaner",
        "de": "Reiseplaner",
        "href": "https://walkofberlin.com/berlin-trip-planner"
      },
      {
        "label": "Guides & Foto-Missionen",
        "de": "Guides & Foto-Missionen",
        "href": "https://walkofberlin.com/de/category/all-products?tab=guides"
      },
      {
        "label": "Virtuelle Touren & Night In",
        "de": "Virtuelle Touren & Night In",
        "href": "https://walkofberlin.com/de/category/all-products?tab=guides&view=virtual"
      }
    ],
    "note": "Alle auf Englisch"
  }
];
// END GENERATED DESIGN2 STORE MENU

// One menu model for desktop disclosures and mobile accordions.
// The store's generated links remain owned by sync-store-navigation.mjs.
const BW_HEADER_LEGACY_GROUPS = [
  {key:'posters',label:'Posters',items:[
    {label:'All posters',href:'https://walkofberlin.com/category/all-products?tab=print'},
    {label:'Berlin landmarks',href:BW_HEADER_LINKS.shopLandmarks},
    {label:'Berlin districts',href:BW_HEADER_LINKS.shopDistricts},
    {label:'Everyday Berlin',href:'https://walkofberlin.com/category/berlin-everyday-posters'},
    {label:'Berlin Reels collection',href:BW_HEADER_LINKS.shopReels},
  ]},
  {key:'street',label:'Your street in 1928',items:[
    {label:'Printed poster',href:'https://walkofberlin.com/product-page/your-berlin-street-in-1928-personalised-aerial-print-30-x-40-cm'},
    {label:'Digital file',href:'https://walkofberlin.com/product-page/your-berlin-street-in-1928-digital-file'},
    {label:'Gift a poster',href:'https://walkofberlin.com/product-page/gift-your-berlin-street-in-1928-poster-gift'},
    {label:'Gift a digital file',href:'https://walkofberlin.com/product-page/gift-your-berlin-street-in-1928-digital-gift'},
  ]},
  {key:'audio',label:'Audio walks',items:[
    {label:'All audio walks',href:BW_HEADER_LINKS.audioTours},
    {label:'Berlin Audio Trio',href:'https://walkofberlin.com/products/berlin-audio-trio-bundle'},
    {label:'Medieval Berlin',href:'https://walkofberlin.com/products/medieval-berlin-audio-tour'},
    {label:'Hidden Berlin',href:'https://walkofberlin.com/products/hidden-berlin-audio-route'},
    {label:'The Berlin Wall',href:'https://walkofberlin.com/products/death-strip-audio-route'},
    {label:'Third Reich Berlin',href:'https://walkofberlin.com/products/third-reich-berlin-audio-tour'},
  ]},
  {key:'guides',label:'Guides',items:[
    {label:'All guides',href:'https://walkofberlin.com/category/all-products?tab=guides'},
    {label:'Berlin Trip Planner',href:BW_HEADER_LINKS.planner},
    {label:'First-Day Rescue Plan',href:BW_HEADER_LINKS.firstDayRescue},
    {label:'Berlin Landmarks Guide',href:BW_HEADER_LINKS.landmarksGuide},
    {label:'Photo Missions',href:BW_HEADER_LINKS.photoMissions},
    {label:'Berlin Night In',href:'https://walkofberlin.com/products/berlin-night-in'},
  ]},
  {key:'blog',label:'Blog',items:[
    {label:'All posts',href:BW_HEADER_LINKS.blog},
    {label:'Living in Berlin',href:BW_HEADER_LINKS.blogLivingInBerlin},
    {label:'Tourist tips',href:BW_HEADER_LINKS.blogTouristTips},
    {label:'Berlin history',href:BW_HEADER_LINKS.blogBerlinHistory},
    {label:'Stories from the Route',href:BW_HEADER_LINKS.blogTourRoute},
    {label:'German language',href:BW_HEADER_LINKS.blogGermanLanguage},
    {label:'Berlin myths',href:BW_HEADER_LINKS.blogBerlinMyths},
    {label:'Before & After',href:BW_HEADER_LINKS.blogBeforeAfter},
  ]},
  {key:'tools',label:'Free tools',items:[
    {label:'All Berlin Tools',href:BW_HEADER_LINKS.plan},
    {label:'Berlin Date Check',href:BW_HEADER_LINKS.dateCheck},
    {label:'Transport Ticket Calculator',href:BW_HEADER_LINKS.ticketCalculator},
    {label:"What's Open Today",href:BW_HEADER_LINKS.whatsOpen},
    {label:'First-Day Planner',href:'https://walkofberlin.com/tools/berlin-first-day-planner'},
    {label:'Berlin games',href:BW_HEADER_LINKS.games},
    {label:'Embed these tools',href:'https://walkofberlin.com/widgets'},
  ]},
  {key:'walk',label:'Walk with me',items:[
    {label:'Berlin Then and Now',href:BW_HEADER_BOOKING_URL},
    {label:'All tours',href:BW_HEADER_LINKS.allTours},
    {label:'Private tours',href:BW_HEADER_LINKS.privateTour},
    {label:'Virtual tours',href:'https://walkofberlin.com/virtual-tours'},
    {label:'Meeting point',href:BW_HEADER_LINKS.meetingPoint},
    {label:'The route',href:BW_HEADER_LINKS.route},
    {label:'Meet Yusuf',href:BW_HEADER_LINKS.guide},
    {label:'Reviews',href:BW_HEADER_LINKS.reviews},
  ]},
  {key:'shop',label:BW_HEADER_STORE_DESIGN2&&(bwHeaderGermanPage())?'Shop':'Store',items:BW_HEADER_STORE_DESIGN2?((bwHeaderGermanPage())?BW_HEADER_STORE_DESIGN2_DE:BW_HEADER_STORE_DESIGN2_EN):BW_HEADER_STORE_LINKS},
];
// Keep the legacy switch available, but simplify the live navigation from one model.
// Wix's German home alias loads /de and then navigates to /, retaining /de as
// its same-origin referrer. Preserve that one German entry path in the header;
// ordinary English home visits and links from other German pages stay English.
function bwHeaderGermanPage(){
 if(/^\/de(?:\/|$)/.test(location.pathname)||new URLSearchParams(location.search).get('lang')==='de')return true;
 if(location.pathname!=='/')return false;
 try{const ref=new URL(document.referrer);return ref.origin===location.origin&&ref.pathname.replace(/\/+$/,'')==='/de';}catch{return false;}
}
const BW_HEADER_GERMAN = bwHeaderGermanPage();
const BW_HEADER_DE = {
 'Walk with me':'Mit mir durch Berlin','Free tools':'Kostenlose Tools','All posts':'Alle Beiträge',
 'Living in Berlin':'Leben in Berlin','Tourist tips':'Tipps für Besucher','Berlin history':'Berliner Geschichte',
 'Stories from the Route':'Geschichten von der Route','German language':'Deutsche Sprache','Berlin myths':'Berliner Mythen','Before & After':'Damals & heute',
 'All Berlin Tools':'Alle Berlin-Tools','Berlin Date Check':'Berlin-Termincheck','Transport Ticket Calculator':'Fahrkartenrechner',
 "What's Open Today":'Was heute geöffnet ist','First-Day Planner':'Planer für den ersten Tag','Berlin games':'Berlin-Spiele','Embed these tools':'Tools einbetten',
 'Berlin Then and Now':'Berlin damals und heute','All tours':'Alle Touren','Private tours':'Private Touren','Virtual tours':'Virtuelle Touren',
 'Meeting point':'Treffpunkt','The route':'Die Route','Meet Yusuf':'Yusuf kennenlernen','Reviews':'Bewertungen'
};
const BW_HEADER_DESIGN2_HOME = 'https://walkofberlin.com'+(BW_HEADER_GERMAN?'/de':'')+'/category/all-products';
const bwHeaderGermanHref = href => {const u=new URL(href);if(BW_HEADER_GERMAN&&/(^|\.)walkofberlin\.com$/.test(u.hostname)&&/^\/(?:blog(?:\/|$)|$)/.test(u.pathname)){u.pathname='/de'+u.pathname.replace(/\/$/,'');u.searchParams.set('lang','de');}return u.href;};
if(BW_HEADER_STORE_DESIGN2)BW_HEADER_LINKS.home=bwHeaderGermanHref(BW_HEADER_LINKS.home);
const BW_HEADER_MENU_GROUPS = BW_HEADER_STORE_DESIGN2?['shop','walk','blog','tools'].map(key=>{
 const group=BW_HEADER_LEGACY_GROUPS.find(g=>g.key===key);
 return {...group,label:key==='shop'?'Store':BW_HEADER_GERMAN?(BW_HEADER_DE[group.label]||group.label):group.label,
 items:key==='shop'?group.items:group.items.map(i=>({...i,href:bwHeaderGermanHref(i.href),label:BW_HEADER_GERMAN?(BW_HEADER_DE[i.label]||i.label):i.label}))};
}):BW_HEADER_LEGACY_GROUPS;
function bwHeaderNavigateLink(event,link) {
 if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.target==='_blank'||link.hasAttribute('download'))return;
 // Explicit document navigation preserves query filters that Wix's router discards.
 event.preventDefault();event.stopPropagation();location.assign(link.href);
}
const bwHeaderEscape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const bwHeaderCommercePage = () => location.pathname.replace(/\/+$/,'') === '/products/berlin-landmarks-guide';
const bwHeaderCommerceBridge = () => {const link=document.createElement('a');link.className='bw-header-book bw-header-commerce-bridge';link.href=BW_HEADER_BOOKING_URL;link.textContent=BW_HEADER_GERMAN?'Termine ansehen und buchen':'See dates and book';return link;};
const bwHeaderItems = group => group.items.map(item=>item.items?`<li class="bw-header-store-group"><a class="bw-header-store-group-title" href="${bwHeaderEscape(item.href)}">${bwHeaderEscape(item.label)}</a>${item.note?`<small class="bw-header-store-note">${bwHeaderEscape(item.note)}</small>`:''}<ul>${item.items.map(link=>`<li><a href="${bwHeaderEscape(link.href)}">${bwHeaderEscape(link.label)}</a></li>`).join('')}</ul></li>`:`<li><a href="${bwHeaderEscape(item.href)}">${bwHeaderEscape(item.label)}</a></li>`).join('');
const bwHeaderMobileItems = group => group.items.map(item=>item.items?`<section class="bw-header-store-mobile-group"><a class="bw-header-store-group-title" href="${bwHeaderEscape(item.href)}">${bwHeaderEscape(item.label)}</a>${item.note?`<small class="bw-header-store-note">${bwHeaderEscape(item.note)}</small>`:''}${item.items.map(link=>`<a href="${bwHeaderEscape(link.href)}">${bwHeaderEscape(link.label)}</a>`).join('')}</section>`:`<a href="${bwHeaderEscape(item.href)}">${bwHeaderEscape(item.label)}</a>`).join('');

const BW_HEADER_INSTANCES = new Set();
let BW_HEADER_ACTIVE_INSTANCE = null;
let BW_HEADER_RECONCILE_FRAME = 0;
let BW_HEADER_INSTANCE_SEQUENCE = 0;
let BW_HEADER_SCROLL_LOCK_OWNER = null;

// The All Tours content mounts after Wix. Wait for its real mobile card,
// since the format-heading anchor itself uses display:contents on phones.
function bwHeaderScrollToVirtualTours() {
  if (location.pathname.replace(/\/$/, '') !== '/all-tours' || location.hash !== '#tour-virtual') return;
  let observer, timeout, scheduled = false;
  const cleanup = () => {
    observer?.disconnect();
    clearTimeout(timeout);
    document.removeEventListener('load', attempt, true);
  };
  const attempt = () => {
    const root = document.getElementById('bw-all-tours-root');
    const heading = root?.querySelector('#tour-virtual');
    const stylesheet = [...document.querySelectorAll('link[rel="stylesheet"]')]
      .find(link => link.href.includes('/all-tours/assets/'));
    if (!heading || (stylesheet && !stylesheet.sheet) || scheduled) return;
    const target = getComputedStyle(heading).display === 'contents' ? heading.closest('article') : heading;
    if (!target || target.getBoundingClientRect().height < 2) return;
    scheduled = true;
    cleanup();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const headerBottom = Math.max(0, ...[...document.querySelectorAll('.bw-header-main')]
        .filter(el => el.getBoundingClientRect().height > 0).map(el => el.getBoundingClientRect().bottom));
      window.scrollTo({ top: Math.max(0, scrollY + target.getBoundingClientRect().top - headerBottom - 16), behavior: 'instant' });
      const title = heading.querySelector('h2');
      if (title) { title.setAttribute('tabindex', '-1'); title.focus({ preventScroll: true }); }
    }));
  };
  observer = new MutationObserver(attempt);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('load', attempt, true);
  timeout = setTimeout(cleanup, 20000);
  attempt();
}

function bwHeaderNavigateTourLink(event, link) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
  event.preventDefault();
  event.stopPropagation();
  const target = new URL(link.href);
  // A full document navigation runs the page's existing mount code. Wix SPA
  // interception otherwise swaps the native shell without running that code.
  if (target.pathname === location.pathname && target.hash === '#tour-virtual') {
    location.hash = target.hash;
    bwHeaderScrollToVirtualTours();
  } else {
    window.location.assign(link.href);
  }
}

function bwHeaderVisibilityScore(instance) {
  if (!instance || !instance.isConnected) return 0;
  let node = instance;
  let depth = 0;
  while (node && node.nodeType === 1 && depth < 12) {
    const style = window.getComputedStyle(node);
    if (
      node.hidden ||
      node.getAttribute('aria-hidden') === 'true' ||
      style.display === 'none' ||
      style.visibility === 'hidden' ||
      Number.parseFloat(style.opacity || '1') === 0
    ) return 0;
    node = node.parentElement;
    depth++;
  }
  const rect = instance.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2) return 0;
  return rect.width * rect.height;
}

function bwHeaderReconcile() {
  BW_HEADER_RECONCILE_FRAME = 0;
  const candidates = Array.from(BW_HEADER_INSTANCES)
    .map((instance) => ({ instance, score: bwHeaderVisibilityScore(instance) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);
  let next = candidates[0]?.instance || null;
  const activeCandidate = candidates.find(({ instance }) => instance === BW_HEADER_ACTIVE_INSTANCE);
  if (activeCandidate && activeCandidate.score >= (candidates[0]?.score || 0) * 0.99) {
    next = BW_HEADER_ACTIVE_INSTANCE;
  }
  if (next === BW_HEADER_ACTIVE_INSTANCE) {
    if (next && !next._runtimeActive) next._activateRuntime();
    return;
  }
  const previous = BW_HEADER_ACTIVE_INSTANCE;
  BW_HEADER_ACTIVE_INSTANCE = next;
  if (previous) previous._deactivateRuntime();
  if (next) next._activateRuntime();
}

function bwHeaderScheduleReconcile() {
  if (BW_HEADER_RECONCILE_FRAME) return;
  BW_HEADER_RECONCILE_FRAME = window.requestAnimationFrame(bwHeaderReconcile);
}

class BWHeaderElement extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;
    const prerenderPrefix = 'bw-header-ready-screen';
    const adopt = !this._prerenderChecked && this._hasPrerenderedMarkup(prerenderPrefix);
    if (!adopt && !this._prerenderChecked && this.dataset.bwPrerender === 'ready-screen-v1'
      && !this._prerenderParsed && document.readyState === 'loading') {
      if (!this._prerenderWaiting) {
        this._prerenderWaiting = true;
        document.addEventListener('DOMContentLoaded', () => {
          this._prerenderParsed = true;
          this._prerenderWaiting = false;
          if (this.isConnected) this.connectedCallback();
        }, { once: true });
      }
      return;
    }
    this._connected = true;
    this._prerenderChecked = true;
    this._instanceId = adopt ? prerenderPrefix : this._instanceId || `bw-header-instance-${++BW_HEADER_INSTANCE_SEQUENCE}`;
    this._mobileMenuId = `${this._instanceId}-mobile-menu`;
    this._tourMenuId = `${this._instanceId}-tour-menu`;
    this._productsMenuId = `${this._instanceId}-products-menu`;
    this._gamesMenuId = `${this._instanceId}-games-menu`;
    this._blogMenuId = `${this._instanceId}-blog-menu`;
    this._shopMenuId = `${this._instanceId}-shop-menu`;
    this._hacksMenuId = `${this._instanceId}-hacks-menu`;
    this.dataset.bwNavigation = "20260917"; // Keep the retired nav-patch guard.
    this.dataset.bwNavigationVersion = BW_HEADER_NAV_VERSION;
    this.dataset.bwHeaderBuild = BW_HEADER_BUILD;
    if (!adopt) this._render();
    this._needsRuntimeRender = false;
    BW_HEADER_INSTANCES.add(this);
    if (typeof bwHeaderStoreMode === 'function') bwHeaderStoreMode();
    this._visibilityChangeHandler = bwHeaderScheduleReconcile;
    window.addEventListener('resize', this._visibilityChangeHandler, { passive: true });
    if ('ResizeObserver' in window) {
      this._visibilityObserver = new ResizeObserver(this._visibilityChangeHandler);
      this._visibilityTargets = [];
      let node = this;
      let depth = 0;
      while (node && node.nodeType === 1 && depth < 8) {
        this._visibilityObserver.observe(node);
        this._visibilityTargets.push(node);
        node = node.parentElement;
        depth++;
      }
    }
    bwHeaderScheduleReconcile();
  }

  _hasPrerenderedMarkup(prefix) {
    if (this.dataset.bwPrerender !== 'ready-screen-v1'
      || !this.querySelector('style')
      || !this.querySelector('.bw-header-wrap > .bw-header')
      || !this.querySelector('.bw-header-logo img[src]')
      || !this.querySelector('.bw-header-progress-bar')
      || !this.querySelector('.bw-header-mobile-close')) return false;
    if (!this.querySelector('[data-bw-unified-menu]')) return false;
    // Ready-screen markup can carry English links on a German home page.
    const store=this.querySelector('.bw-header-store-link');
    if(BW_HEADER_STORE_DESIGN2&&store?.href!==BW_HEADER_DESIGN2_HOME)return false;
    const controls = [
      ['.bw-header-hamburger','mobile-menu','.bw-header-mobile'],
      ...BW_HEADER_MENU_GROUPS.map(group=>['.bw-header-dropdown-trigger',`${group.key}-menu`,'.bw-header-submenu']),
    ];
    return controls.every(([trigger, suffix, menu]) => {
      const id = `${prefix}-${suffix}`;
      return this.querySelector(`${trigger}[aria-controls="${id}"][aria-expanded="false"]`)
        && this.querySelector(`${menu}[id="${id}"]`)
        && document.querySelectorAll(`[id="${id}"]`).length === 1;
    });
  }

  disconnectedCallback() {
    this._connected = false;
    if (this._visibilityObserver) this._visibilityObserver.disconnect();
    if (this._visibilityChangeHandler) window.removeEventListener('resize', this._visibilityChangeHandler);
    this._visibilityObserver = null;
    this._visibilityTargets = null;
    this._visibilityChangeHandler = null;
    BW_HEADER_INSTANCES.delete(this);
    if (BW_HEADER_ACTIVE_INSTANCE === this) BW_HEADER_ACTIVE_INSTANCE = null;
    this._deactivateRuntime();
    bwHeaderScheduleReconcile();
  }

  _activateRuntime() {
    if (this._runtimeActive || !this.isConnected || BW_HEADER_ACTIVE_INSTANCE !== this) return;
    if (this._needsRuntimeRender) {
      this._render();
      this._needsRuntimeRender = false;
    }
    this._runtimeActive = true;
    this._setupScroll();
    this._setupMobile();
    this._setupDropdown();
    this.querySelector('.bw-header-tour-link')?.addEventListener('click', event => bwHeaderNavigateTourLink(event, event.currentTarget));
    this._setupViewportMode();
    this.querySelectorAll('a[href]').forEach(a=>a.addEventListener('click',e=>bwHeaderNavigateLink(e,a)));
  }

  _deactivateRuntime() {
    if (!this._runtimeActive) return;
    this._runtimeActive = false;
    if (this._setMobileOpen) this._setMobileOpen(false);
    if (this._scrollTargets && this._scrollHandler) {
      this._scrollTargets.forEach((target) => {
        if (target && target.removeEventListener) target.removeEventListener('scroll', this._scrollHandler);
      });
    }
    if (this._scrollIntentTargets && this._scrollIntentHandler) {
      this._scrollIntentTargets.forEach((target) => {
        if (target && target.removeEventListener) target.removeEventListener('wheel', this._scrollIntentHandler);
        if (target && target.removeEventListener) target.removeEventListener('touchmove', this._scrollIntentHandler);
        if (target && target.removeEventListener) target.removeEventListener('keydown', this._scrollIntentHandler);
      });
    }
    this._setHeaderHidden(false);
    if (this._keyHandler) document.removeEventListener('keydown', this._keyHandler);
    if (this._dropdownKeyHandler) document.removeEventListener('keydown', this._dropdownKeyHandler);
    if (this._docClickHandler) document.removeEventListener('click', this._docClickHandler);
    if (this._docFocusHandler) document.removeEventListener('focusin', this._docFocusHandler);
    if (this._dropdownReposition) {
      window.removeEventListener('resize', this._dropdownReposition);
      window.removeEventListener('scroll', this._dropdownReposition);
    }
    if (this._viewportModeHandler) window.removeEventListener('resize', this._viewportModeHandler);
    if (this._dropdownContexts) {
      this._dropdownContexts.forEach((context) => {
        if (context.cancelClose) context.cancelClose();
      });
    }
    if (this._mobileOverlay && this._mobileOverlay.parentNode === document.body) {
      document.body.removeChild(this._mobileOverlay);
    }
    if (this._dropdownMenus) {
      this._dropdownMenus.forEach((menu) => {
        if (menu && menu.parentNode === document.body) document.body.removeChild(menu);
      });
    } else if (this._dropdownMenu && this._dropdownMenu.parentNode === document.body) {
      document.body.removeChild(this._dropdownMenu);
    }
    if (BW_HEADER_SCROLL_LOCK_OWNER === this) {
      BW_HEADER_SCROLL_LOCK_OWNER = null;
      document.body.style.overflow = '';
    }
    this._keyHandler = null;
    this._dropdownKeyHandler = null;
    this._docClickHandler = null;
    this._docFocusHandler = null;
    this._dropdownReposition = null;
    this._viewportModeHandler = null;
    this._dropdownContexts = null;
    this._dropdownMenus = null;
    this._mobileOverlay = null;
    this._setMobileOpen = null;
    this._closeDropdowns = null;
    this._scrollTargets = null;
    this._scrollHandler = null;
    this._needsRuntimeRender = this.isConnected;
  }

  _isEffectivelyHidden() {
    let node = this;
    while (node && node.nodeType === 1) {
      const style = window.getComputedStyle(node);
      if (style.display === 'none' || style.visibility === 'hidden') return true;
      node = node.parentElement;
    }
    return false;
  }

  _setupScroll() {
    const header = this.querySelector('.bw-header-wrap');
    const progress = this.querySelector('.bw-header-progress-bar');
    if (!header) return;
    this._headerShell = this._findHeaderShell();
    this._lastScrollY = this._getScrollY();
    this._setHeaderHidden(false);
    let ticking = false;
    const update = () => {
      const y = this._getScrollY();
      header.classList.remove('bw-header-shrunk');
      if (progress) {
        const docH = (document.documentElement.scrollHeight || 0) - (window.innerHeight || 0);
        const pct = docH > 0 ? Math.max(0, Math.min(100, (y / docH) * 100)) : 0;
        progress.style.width = pct + '%';
      }
      this._setHeaderHidden(false);
      this._lastScrollY = y;
      ticking = false;
    };
    this._scrollHandler = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };
    this._scrollTargets = [
      window,
      document,
      document.documentElement,
      document.body,
      document.scrollingElement
    ].filter((target, index, list) => target && list.indexOf(target) === index);
    this._scrollTargets.forEach((target) => target.addEventListener('scroll', this._scrollHandler, { passive: true }));
    update();
  }

  _getScrollY() {
    const doc = document.documentElement;
    const body = document.body;
    const scrolling = document.scrollingElement;
    return Math.max(
      window.scrollY || 0,
      window.pageYOffset || 0,
      scrolling ? scrolling.scrollTop || 0 : 0,
      doc ? doc.scrollTop || 0 : 0,
      body ? body.scrollTop || 0 : 0
    );
  }

  _findHeaderShell() {
    let node = this.parentElement;
    let depth = 0;
    let shell = null;
    while (node && node !== document.body && depth < 10) {
      const className = typeof node.className === 'string' ? node.className : '';
      if (className.includes('wixui-header') || node.tagName.toLowerCase() === 'header') {
        shell = node;
      }
      node = node.parentElement;
      depth++;
    }
    return shell;
  }

  _setHeaderHidden(hidden) {
    const target = this._headerShell || this;
    if (!target) return;
    this._headerHidden = false;
    target.style.setProperty('transition', 'none', 'important');
    target.style.setProperty('will-change', 'auto', 'important');
    target.style.setProperty('transform', 'translateY(0)', 'important');
    target.style.setProperty('pointer-events', 'auto', 'important');
  }

  _setupMobile() {
    const btn = this.querySelector('.bw-header-hamburger');
    const overlay = this.querySelector('.bw-header-mobile');
    if (!btn || !overlay) return;

    // Portal the overlay to <body> to escape ancestor transform/sticky
    // contexts (Wix header wrapper uses transforms). Without this,
    // position:fixed becomes effectively position:absolute inside the
    // Wix header and the overlay gets clipped to the header height.
    if (overlay.parentNode !== document.body) {
      document.body.appendChild(overlay);
    }
    this._mobileOverlay = overlay;

    const closeBtn = overlay.querySelector('.bw-header-mobile-close');
    const mobileSections = Array.from(overlay.querySelectorAll('details.bw-header-mobile-section'));
    mobileSections.forEach((section) => {
      const summary = section.querySelector('summary');
      if (!summary) return;
      summary.addEventListener('click', () => {
        mobileSections.forEach((other) => {
          if (other !== section) other.open = false;
        });
      });
      const sectionLink = summary.querySelector('.bw-header-mobile-section-link');
      if (sectionLink) sectionLink.addEventListener('click', (e) => {
        this._setMobileOpen?.(false);
        bwHeaderNavigateTourLink(e, sectionLink);
      });
    });
    const setOpen = (open) => {
      if (open && (!this._runtimeActive || BW_HEADER_ACTIVE_INSTANCE !== this)) return;
      overlay.classList.toggle('bw-header-mobile-open', open);
      btn.classList.toggle('bw-header-hamburger-open', open);
      btn.setAttribute('aria-expanded', String(open));
      overlay.setAttribute('aria-hidden', String(!open));
      overlay.toggleAttribute('inert', !open);
      if (!open) mobileSections.forEach((section) => { section.open = false; });
      if (open) {
        this._closeDropdowns?.();
        closeBtn?.focus({preventScroll:true});
        if (BW_HEADER_SCROLL_LOCK_OWNER && BW_HEADER_SCROLL_LOCK_OWNER !== this) {
          BW_HEADER_SCROLL_LOCK_OWNER._setMobileOpen?.(false);
        }
        BW_HEADER_SCROLL_LOCK_OWNER = this;
        document.body.style.overflow = 'hidden';
      } else if (BW_HEADER_SCROLL_LOCK_OWNER === this) {
        BW_HEADER_SCROLL_LOCK_OWNER = null;
        document.body.style.overflow = '';
      }
    };
    this._setMobileOpen = setOpen;
    btn.addEventListener('click', () => setOpen(!overlay.classList.contains('bw-header-mobile-open')));
    if (closeBtn) closeBtn.addEventListener('click', () => {
      setOpen(false);
      btn.focus();
    });
    overlay.querySelectorAll('a').forEach((a) => a.addEventListener('click', (event) => {
      setOpen(false);
      if (!a.classList.contains('bw-header-mobile-section-link') && a.closest('details')?.querySelector('.bw-header-mobile-tour-label')) bwHeaderNavigateTourLink(event, a);else bwHeaderNavigateLink(event,a);
    }));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        setOpen(false);
        btn.focus();
      }
    });
    this._keyHandler = (e) => {
      if (e.key === 'Tab' && overlay.classList.contains('bw-header-mobile-open')) {
        const focusables=[...overlay.querySelectorAll('a,button,summary')].filter(el=>{
          const details=el.closest('details');
          return (!details||details.open||details.querySelector('summary')?.contains(el))
            &&el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden';
        });
        const first=focusables[0],last=focusables.at(-1);
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
      }
      if (e.key === 'Escape' && overlay.classList.contains('bw-header-mobile-open')) {
        e.preventDefault();
        setOpen(false);
        btn.focus();
      }
    };
    document.addEventListener('keydown', this._keyHandler);
  }

  _setupViewportMode() {
    this._mobileMode = window.innerWidth <= (BW_HEADER_STORE_DESIGN2?980:1100);
    this._viewportModeHandler = () => {
      if (!this._runtimeActive) return;
      const nextMobileMode = window.innerWidth <= (BW_HEADER_STORE_DESIGN2?980:1100);
      if (nextMobileMode === this._mobileMode) return;
      this._mobileMode = nextMobileMode;
      if (this._closeDropdowns) this._closeDropdowns();
      if (this._setMobileOpen) this._setMobileOpen(false);
    };
    window.addEventListener('resize', this._viewportModeHandler, { passive: true });
  }

  _setupDropdown() {
    const dropdowns = Array.from(this.querySelectorAll('.bw-header-dropdown'));
    if (!dropdowns.length) return;

    const contexts = [];
    this._dropdownMenus = [];

    const closeAll = (except) => {
      contexts.forEach((context) => {
        if (context !== except) {
          context.cancelClose();
          context.setOpen(false);
        }
      });
    };

    dropdowns.forEach((wrap) => {
      const trigger = wrap.querySelector('.bw-header-dropdown-trigger');
      const menu = wrap.querySelector('.bw-header-submenu');
      if (!trigger || !menu) return;

      // Portal each dropdown to <body> for the same transform-ancestor reason.
      if (menu.parentNode !== document.body) {
        document.body.appendChild(menu);
      }
      this._dropdownMenus.push(menu);

      const positionMenu = () => {
        const rect = (wrap.matches('.bw-header-tours-dropdown,.bw-header-store-dropdown') ? wrap : trigger).getBoundingClientRect();
        const menuRect = menu.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const viewportW = window.innerWidth || document.documentElement.clientWidth;
        const viewportH = window.innerHeight || document.documentElement.clientHeight;
        let left = cx - menuRect.width / 2;
        if (left < 12) left = 12;
        if (left + menuRect.width > viewportW - 12) left = viewportW - 12 - menuRect.width;
        menu.style.top = (rect.bottom + 10) + 'px';
        menu.style.left = left + 'px';
        menu.style.maxHeight = Math.max(60, viewportH - rect.bottom - 22) + 'px';
      };
      const setOpen = (open) => {
        wrap.classList.toggle('bw-header-dropdown-open', open);
        menu.hidden = !open;
        menu.toggleAttribute('inert',!open);
        menu.classList.toggle('bw-header-submenu-open', open);
        trigger.setAttribute('aria-expanded', String(open));
        if (open) positionMenu();
      };
      let closeTimer = null;
      let openedByHover = false;
      const cancelClose = () => {
        if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
      };
      const scheduleClose = () => {
        cancelClose();
        closeTimer = setTimeout(() => setOpen(false), 220);
      };
      const context = { wrap, trigger, menu, positionMenu, setOpen, cancelClose };
      contexts.push(context);

      const isLinkTrigger = trigger.tagName === 'A' && trigger.hasAttribute('href');
      if (!isLinkTrigger) trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        cancelClose();
        closeAll(context);
        const isPointerClick = e.detail > 0;
        const isOpen = wrap.classList.contains('bw-header-dropdown-open');
        if (isPointerClick && openedByHover && isOpen) {
          openedByHover = false;
          setOpen(true);
        } else {
          openedByHover = false;
          setOpen(!isOpen);
        }
      });
      trigger.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
        event.preventDefault(); cancelClose(); closeAll(context); setOpen(true);
        const links = [...menu.querySelectorAll('a')];
        (event.key === 'ArrowUp' ? links[links.length - 1] : links[0])?.focus();
      });
      menu.addEventListener('keydown', (event) => {
        const links = [...menu.querySelectorAll('a')];
        const index = links.indexOf(document.activeElement);
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          links[(index + (event.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length]?.focus();
        }
        if (event.key === 'Tab' && ((event.shiftKey && index === 0) || (!event.shiftKey && index === links.length - 1))) {
          setOpen(false); trigger.focus();
        }
      });
      wrap.addEventListener('mouseenter', () => {
        cancelClose();
        closeAll(context);
        if (!wrap.classList.contains('bw-header-dropdown-open')) openedByHover = true;
        setOpen(true);
      });
      wrap.addEventListener('focusin',()=>{if(this._escapeClosing)return;cancelClose();closeAll(context);setOpen(true);});
      wrap.addEventListener('mouseleave', scheduleClose);
      menu.addEventListener('mouseenter', cancelClose);
      menu.addEventListener('mouseleave', scheduleClose);
      menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', (event) => {
        closeAll();
        if (wrap.classList.contains('bw-header-tours-dropdown')) bwHeaderNavigateTourLink(event, link);else bwHeaderNavigateLink(event,link);
      }));
      if (trigger.getBoundingClientRect().width > 0) positionMenu();
    });

    this._dropdownContexts = contexts;
    this._closeDropdowns = () => closeAll();
    this._docClickHandler = (e) => {
      const insideDropdown = contexts.some((context) => context.wrap.contains(e.target) || context.menu.contains(e.target));
      if (!insideDropdown) closeAll();
    };
    document.addEventListener('click', this._docClickHandler);
    this._docFocusHandler = event => closeAll(contexts.find(context=>context.wrap.contains(event.target)||context.menu.contains(event.target)));
    document.addEventListener('focusin',this._docFocusHandler);
    this._dropdownKeyHandler = (event) => {
      if (event.key !== 'Escape') return;
      const openContext = contexts.find((context) => context.wrap.classList.contains('bw-header-dropdown-open'));
      if (!openContext) return;
      event.preventDefault();
      closeAll();
      this._escapeClosing=true;openContext.trigger.focus();this._escapeClosing=false;
    };
    document.addEventListener('keydown', this._dropdownKeyHandler);
    this._dropdownReposition = () => {
      contexts.forEach((context) => {
        if (context.wrap.classList.contains('bw-header-dropdown-open')) context.positionMenu();
      });
    };
    window.addEventListener('resize', this._dropdownReposition);
    window.addEventListener('scroll', this._dropdownReposition, { passive: true });
  }

  _render() {
    const checkout=this.querySelector('form[data-bw-landmarks-guide-header-checkout]')||this._preservedCommerceForm;
    if(checkout)this._preservedCommerceForm=checkout;
    this.innerHTML = `
      <style>
        @font-face {
          font-family: BWPlexMono;
          font-style: normal;
          font-weight: 600;
          font-display: swap;
          src: url(${BW_HEADER_MONO_URL}) format('woff2');
        }
        @font-face {
          font-family: BWMenuFraunces;
          font-style: normal;
          font-weight: 100 900;
          font-display: swap;
          src: url(${BW_HEADER_MENU_FONT_URL}) format('woff2');
        }

        bw-site-header, bw-site-header-desktop-align {
          display: block;
          width: 100%;
        }

        .bw-header-wrap {
          --green: #1B5E20;
          --green-dark: #102414;
          --yellow: #FFE600;
          --lime: #7CB342;
          --light-green: #C5E1A5;
          --cream: #FAFAF5;
          --text: #212121;
          --muted: #4E5A4E;
          background: #FFFFFF;
          color: var(--text);
          font-family: Montserrat, Arial, sans-serif;
          margin: 0;
          position: relative;
          width: 100%;
          z-index: 100;
        }

        .bw-header-wrap *,
        .bw-header-wrap *::before,
        .bw-header-wrap *::after {
          box-sizing: border-box;
        }

        .bw-header-wrap a {
          color: inherit;
          text-decoration: none;
        }

        .bw-header-inner {
          margin: 0 auto;
          max-width: 1280px;
          padding: 0 24px;
          width: 100%;
        }

        /* Top mini-bar */
        .bw-header-top {
          background: var(--green);
          color: #FFFFFF;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.6px;
          line-height: 1;
          overflow: hidden;
          transition: max-height 220ms ease, opacity 180ms ease;
          max-height: 36px;
          opacity: 1;
        }

        .bw-header-top-items {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 6px 18px;
          justify-content: center;
          padding: 11px 0;
        }

        .bw-header-top-item {
          align-items: center;
          display: inline-flex;
          gap: 6px;
        }

        .bw-header-top-star {
          color: var(--yellow);
          font-size: 13px;
          line-height: 1;
        }

        .bw-header-top-name {
          color: var(--yellow);
        }

        .bw-header-fact {
          white-space: nowrap;
        }

        .bw-header-top-sep {
          color: rgba(255, 255, 255, 0.35);
          font-size: 10px;
        }

        /* Main bar */
        .bw-header {
          background: #FFFFFF;
          border-bottom: 1px solid transparent;
          transition: padding 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
        }

        .bw-header-main {
          align-items: center;
          display: flex;
          gap: 24px;
          justify-content: space-between;
          padding: 28px 24px;
          transition: padding 200ms ease;
        }

        .bw-header-logo {
          align-items: flex-start;
          display: inline-flex;
          flex: 0 0 auto;
          flex-direction: column;
        }

        .bw-header-logo img {
          display: block;
          height: 36px;
          transition: height 200ms ease;
          width: auto;
        }

        .bw-header-formerly {
          color: #1B5E20;
          display: block;
          font-family: BWPlexMono, monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.04em;
          line-height: 1;
          margin-top: 4px;
          white-space: nowrap;
        }

        .bw-header-nav {
          flex: 1 1 auto;
        }

        .bw-header-nav-list {
          align-items: center;
          display: flex;
          gap: 4px;
          justify-content: center;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .bw-header-nav-list > li {
          flex: 0 0 auto;
        }

        .bw-header-nav-list > li > a,
        .bw-header-nav-list > li > .bw-header-dropdown-trigger {
          white-space: nowrap;
        }

        .bw-header-nav a,
        .bw-header-dropdown-trigger {
          background: none;
          border: 0;
          border-radius: 8px;
          color: var(--green);
          cursor: pointer;
          font-family: BWMenuFraunces, Georgia, serif;
          font-size: 17px;
          font-weight: 500;
          letter-spacing: 0;
          line-height: 1.2;
          padding: 12px 11px;
          text-transform: none;
          transition: background 140ms ease, color 140ms ease;
        }

        .bw-header-nav a:hover,
        .bw-header-nav a:focus-visible,
        .bw-header-dropdown-trigger:hover,
        .bw-header-dropdown-trigger:focus-visible {
          background: var(--cream);
        }
        .bw-header-nav a:focus-visible,
        .bw-header-dropdown-trigger:focus-visible {
          outline: 2px solid var(--green);
          outline-offset: 2px;
        }

        .bw-header-wrap .bw-badge-new,
        .bw-header-mobile .bw-badge-new {
          background: var(--yellow);
          color: var(--green-dark);
          font-size: 8px;
          font-weight: 900;
          padding: 2px 5px;
          border-radius: 999px;
          margin-left: 6px;
          display: inline-flex;
          align-items: center;
          vertical-align: middle;
          letter-spacing: 0.6px;
          line-height: 1;
          text-transform: uppercase;
        }

        .bw-header-mobile .bw-badge-new {
          font-size: 9px;
          letter-spacing: 0.7px;
          margin-left: 8px;
          padding: 3px 7px;
          transform: translateY(-3px);
        }

        .bw-header-submenu .bw-badge-new {
          background: var(--yellow);
          color: var(--green-dark);
          font-size: 8px;
          font-weight: 900;
          padding: 2px 6px;
          border-radius: 999px;
          margin-left: 8px;
          display: inline-flex;
          align-items: center;
          vertical-align: middle;
          letter-spacing: 0.6px;
          line-height: 1;
          text-transform: uppercase;
        }

        .bw-header-dropdown {
          position: relative;
        }
        .bw-header-tour-heading {
          align-items: center;
          display: flex;
        }
        .bw-header-nav .bw-header-tour-link {
          padding-right: 3px;
          white-space: nowrap;
        }
        .bw-header-tour-heading .bw-header-dropdown-trigger {
          justify-content: center;
          min-height: 44px;
          min-width: 32px;
          padding: 10px 6px;
        }
        .bw-header-tours-submenu { min-width: 285px; }

        .bw-header-dropdown-trigger {
          align-items: center;
          display: inline-flex;
          gap: 4px;
        }

        .bw-header-dropdown-trigger .bw-header-caret {
          font-size: 10px;
          line-height: 1;
          transition: transform 160ms ease;
        }

        .bw-header-dropdown-open .bw-header-dropdown-trigger .bw-header-caret {
          transform: rotate(180deg);
        }

        .bw-header-submenu {
          --green: #1B5E20;
          --green-dark: #102414;
          --yellow: #FFE600;
          --light-green: #C5E1A5;
          --cream: #FAFAF5;
          background: #FFFFFF;
          border: 1px solid var(--light-green);
          border-radius: 10px;
          box-shadow: 0 18px 44px rgba(27, 94, 32, 0.16);
          font-family: BWMenuFraunces, Georgia, serif;
          left: 0;
          list-style: none;
          margin: 0;
          min-width: 240px;
          opacity: 0;
          overflow-y: auto;
          overscroll-behavior: contain;
          padding: 10px;
          pointer-events: none;
          position: fixed;
          top: 0;
          transform: translateY(-4px);
          transition: opacity 160ms ease, transform 160ms ease;
          visibility: hidden;
          z-index: 2147483647;
        }
        .bw-header-submenu * { box-sizing: border-box; }
        .bw-header-submenu[data-bw-store-menu="design2"]{width:min(800px,calc(100vw - 24px));display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
        .bw-header-store-group{min-width:0;list-style:none}
        .bw-header-store-group ul{margin:0;padding:0;list-style:none}
        .bw-header-store-note{display:block;padding:0 14px 8px;color:#526452;font-family:inherit;font-size:13px;font-weight:400;line-height:1.4}
        .bw-header-submenu .bw-header-store-group-title{font-weight:700;border-bottom:1px solid #c5e1a5}
        .bw-header-submenu .bw-header-store-group a{white-space:normal;overflow-wrap:anywhere}
        .bw-header-nav .bw-header-clothing-link{display:inline-block;text-decoration:none;white-space:nowrap}
        .bw-header-nav .bw-header-store-link{text-decoration:none;padding:12px 0 12px 11px;display:inline-block}
        .bw-header-store-expand{padding:12px 0!important;min-width:20px;margin-left:4px}
        .bw-header-nav button:focus:not(:focus-visible){outline:none;box-shadow:none}
        .bw-header-store-mobile-group{padding:12px 0;border-top:1px solid #c5e1a555}
        .bw-header-store-mobile-group>.bw-header-store-group-title{font-weight:700}

        .bw-header-submenu a:focus-visible{outline:2px solid var(--green);outline-offset:-2px}
        .bw-header-submenu[hidden] {display:none!important}
        .bw-header-submenu a {
          color: inherit;
          text-decoration: none;
        }

        .bw-header-submenu.bw-header-submenu-open {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
          visibility: visible;
        }

        .bw-header-submenu a {
          border-radius: 6px;
          color: var(--green);
          display: block;
          font-size: 17px;
          font-weight: 500;
          letter-spacing: 0;
          line-height: 1.3;
          padding: 12px 14px;
          text-transform: none;
        }

        .bw-header-submenu a:hover,
        .bw-header-submenu a:focus-visible {
          background: var(--cream);
          color: var(--green-dark);
        }

        .bw-header-cta {
          align-items: center;
          display: flex;
          flex: 0 0 auto;
          gap: 12px;
        }

        .bw-header-mobile-book { display: none; }
        .bw-header-nav-list[data-bw-home-nav], .bw-header-home-store { display: none; }
        @media (min-width: ${BW_HEADER_STORE_DESIGN2?981:1101}px) and (max-width: 1279px) {
          .bw-header-main { gap: 10px; padding-left: 16px; padding-right: 16px; }
          .bw-header-logo img { height: 28px; }
          .bw-header-nav a, .bw-header-dropdown-trigger { padding-left: 7px; padding-right: 7px; font-size: 16px; letter-spacing: 0; }
          .bw-header-nav .bw-header-tour-link { padding-right: 2px; }
          .bw-header-cta .bw-header-book { padding-left: 14px; padding-right: 14px; letter-spacing: .6px; font-size: 12px; }
        }
        @media (min-width: ${BW_HEADER_STORE_DESIGN2?981:1101}px) and (max-width: 1070px) {
          .bw-header-nav a, .bw-header-dropdown-trigger { padding-left: 5px; padding-right: 5px; font-size: 15px; white-space: nowrap; }
          .bw-header-cta .bw-header-book { padding-left: 12px; padding-right: 12px; letter-spacing: .3px; }
        }
        .bw-header-book {
          align-items: center;
          background: var(--yellow);
          border-radius: 999px;
          color: var(--green);
          display: inline-flex;
          font-size: 13px;
          font-weight: 800;
          justify-content: center;
          letter-spacing: 1px;
          line-height: 1;
          min-height: 44px;
          padding: 12px 22px;
          text-transform: uppercase;
          transition: background 160ms ease, color 160ms ease, transform 160ms ease;
        }

        .bw-header-book:hover,
        .bw-header-book:focus-visible {
          background: #fff04a;
          color: var(--green-dark);
          outline: none;
          transform: translateY(-1px);
        }

        .bw-header-hamburger {
          background: none;
          border: 0;
          cursor: pointer;
          display: none;
          flex-direction: column;
          gap: 5px;
          height: 44px;
          justify-content: center;
          padding: 8px;
          width: 44px;
        }

        .bw-header-hamburger span {
          background: var(--green);
          border-radius: 2px;
          display: block;
          height: 2.5px;
          transition: transform 200ms ease, opacity 160ms ease;
          width: 24px;
        }

        .bw-header-hamburger-open span:nth-child(1) {
          transform: translateY(7.5px) rotate(45deg);
        }
        .bw-header-hamburger-open span:nth-child(2) {
          opacity: 0;
        }
        .bw-header-hamburger-open span:nth-child(3) {
          transform: translateY(-7.5px) rotate(-45deg);
        }

        /* Scroll progress */
        .bw-header-progress {
          background: rgba(27, 94, 32, 0.06);
          height: 2px;
          position: relative;
          width: 100%;
        }

        .bw-header-progress-bar {
          background: linear-gradient(90deg, var(--green), var(--lime), var(--yellow));
          height: 100%;
          transition: width 80ms linear;
          width: 0%;
        }

        /* Shrunk state */
        .bw-header-shrunk .bw-header-top {
          max-height: 0;
          opacity: 0;
        }

        .bw-header-shrunk .bw-header {
          box-shadow: none;
        }

        .bw-header-shrunk .bw-header-main {
          padding: 8px 24px;
        }

        .bw-header-shrunk .bw-header-logo img {
          height: 28px;
        }

        .bw-header-shrunk .bw-header-formerly {
          font-size: 9px;
          margin-top: 3px;
        }

        .bw-header-shrunk .bw-header-book {
          min-height: 38px;
          padding: 10px 18px;
        }

        /* Focus styles */
        .bw-header-wrap a:focus-visible,
        .bw-header-wrap button:focus-visible {
          outline: 3px solid var(--green);
          outline-offset: 2px;
        }

        /* Mobile overlay */
        .bw-header-mobile {
          --green: #1B5E20;
          --green-dark: #102414;
          --yellow: #FFE600;
          --light-green: #C5E1A5;
          --cream: #FAFAF5;
          background: rgba(16, 36, 20, 0.92);
          font-family: Montserrat, Arial, sans-serif;
          inset: 0;
          opacity: 0;
          pointer-events: none;
          position: fixed;
          transition: opacity 220ms ease;
          z-index: 2147483646;
        }
        .bw-header-mobile * { box-sizing: border-box; }
        .bw-header-mobile a {
          color: inherit;
          text-decoration: none;
        }

        .bw-header-mobile-open {
          opacity: 1;
          pointer-events: auto;
        }

        .bw-header-mobile-inner {
          background: var(--green);
          color: #FFFFFF;
          display: flex;
          flex-direction: column;
          height: 100%;
          margin-left: auto;
          max-width: 420px;
          padding: 20px 24px 24px;
          transform: translateX(100%);
          transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
          width: 100%;
        }

        .bw-header-mobile-open .bw-header-mobile-inner {
          transform: translateX(0);
        }

        .bw-header-mobile-head {
          align-items: center;
          display: flex;
          justify-content: space-between;
          margin-bottom: 28px;
        }

        .bw-header-mobile-head img {
          display: block;
          height: 30px;
          max-width: calc(100% - 56px);
          width: auto;
        }

        .bw-header-mobile-close {
          background: none;
          border: 0;
          color: #FFFFFF;
          cursor: pointer;
          font-size: 32px;
          height: 44px;
          line-height: 1;
          padding: 0;
          width: 44px;
        }

        .bw-header-mobile-nav {
          display: flex;
          flex: 1 1 auto;
          flex-direction: column;
          gap: 4px;
          overflow-y: auto;
        }

        /* Wix can briefly serve an old enabled Products embed after it is
           disabled. Its marked legacy section must not duplicate this menu. */
        .bw-header-mobile[data-bw-navigation="20260917"] .bw-header-mobile-nav > [data-bw-products-patch] {
          display: none !important;
        }

        .bw-header-mobile-nav a {
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          color: #FFFFFF;
          display: block;
          font-family: BWMenuFraunces, Georgia, serif;
          font-size: 22px;
          font-weight: 500;
          letter-spacing: 0;
          line-height: 1.2;
          padding: 14px 0;
          text-transform: none;
        }

        .bw-header-mobile-nav a:hover {
          color: var(--yellow);
        }

        .bw-header-mobile-section-label {
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          color: #FFFFFF;
          cursor: pointer;
          font-family: BWMenuFraunces, Georgia, serif;
          font-size: 22px;
          font-weight: 500;
          letter-spacing: 0;
          line-height: 1.2;
          padding: 14px 0;
          text-transform: none;
        }

        /* A direct leaf reserves the parent disclosure marker width without implying expansion. */
        .bw-header-mobile[data-bw-navigation] .bw-header-mobile-nav > a.bw-header-mobile-section-label { padding: 14px 0 14px 14px !important; }

        .bw-header-mobile-section-label::marker {
          color: var(--yellow);
          font-size: 13px;
        }

        .bw-header-mobile-section[open] .bw-header-mobile-section-label {
          color: var(--yellow);
        }

        .bw-header-mobile-section-label .bw-header-mobile-section-link {
          border-bottom: 0;
          color: inherit;
          display: inline;
          font-size: inherit;
          font-weight: inherit;
          letter-spacing: inherit;
          padding: 0;
        }

        .bw-header-mobile-section a {
          font-size: 18px;
          padding: 12px 0 12px 18px;
        }
        .bw-header-mobile-nav a:focus-visible,
        .bw-header-mobile-section-label:focus-visible {
          outline: 2px solid var(--yellow);
          outline-offset: -2px;
        }

        .bw-header-mobile-cta {
          margin-top: 22px;
        }

        .bw-header-mobile-cta .bw-header-book {
          background: var(--yellow);
          color: var(--green);
          font-size: 14px;
          min-height: 52px;
          width: 100%;
        }

        .bw-header-mobile-cta .bw-header-book:hover {
          background: #fff04a;
        }

        .bw-header-mobile-trust {
          color: rgba(255, 255, 255, 0.7);
          font-family: Merriweather, Georgia, serif;
          font-size: 13px;
          line-height: 1.5;
          margin: 14px 0 0;
          text-align: center;
        }

        .bw-header-mobile-trust strong {
          color: var(--yellow);
          font-family: Montserrat, Arial, sans-serif;
          font-weight: 800;
        }

        /* Compact breakpoint */
        @media (max-width: ${BW_HEADER_STORE_DESIGN2?980:1100}px) {
          .bw-header-top {
            display: none !important;
          }
          .bw-header-nav {
            display: none !important;
          }
          .bw-header-cta .bw-header-book {
            display: none !important;
          }
          .bw-header-cta a.bw-header-mobile-book,
          .bw-header-cta a.bw-header-mobile-book:is(:hover, :focus, :active, :visited) {
            display: inline-flex !important; align-items: center; justify-content: center;
            background: #FFE600; color: #123D18 !important; border-radius: 999px;
            min-height: 44px; padding: 0 14px; font-size: 12px; font-weight: 800;
            text-decoration: none; line-height: 1;
          }
          .bw-header-hamburger {
            display: flex !important;
          }
          .bw-header {
            background: #FFFFFF !important;
          }
          .bw-header-main {
            align-items: center !important;
            background: #FFFFFF !important;
            display: flex !important;
            flex-direction: row !important;
            gap: 8px;
            justify-content: space-between !important;
            min-height: 90px;
            padding: 10px 18px !important;
          }
          .bw-header-logo {
            display: inline-flex !important;
            flex: 0 0 auto;
          }
          .bw-header-logo img {
            display: block !important;
            height: 28px !important;
            max-width: min(200px, calc(100vw - 160px));
            width: auto !important;
          }
          .bw-header-formerly {
            font-size: 9px;
            margin-top: 3px;
          }
          .bw-header-cta {
            display: flex !important;
            flex: 0 0 auto;
          }
          .bw-header-shrunk .bw-header-main {
            min-height: 56px;
            padding: 8px 18px !important;
          }
          .bw-header-shrunk .bw-header-logo img {
            height: 26px !important;
          }
        }
      </style>

      <div class="bw-header-wrap">
        <div class="bw-header-top" aria-hidden="false">
          <div class="bw-header-inner">
            <div class="bw-header-top-items">
              <span class="bw-header-top-item" data-bw-header-tour-line="true"><span class="bw-header-top-name">Berlin Then and Now</span> · ${BW_HEADER_TOUR_FACTS}</span>
            </div>
          </div>
        </div>

        <header class="bw-header" role="banner">
          <div class="bw-header-inner bw-header-main">
            <a class="bw-header-logo" href="${BW_HEADER_LINKS.home}" aria-label="Walk of Berlin home">
              <img src="${BW_HEADER_LOGO_URL}" alt="Walk of Berlin" width="900" height="142" loading="eager" decoding="async">
              <span class="bw-header-formerly">formerly berlinwalk.com</span>
            </a>

            <nav class="bw-header-nav" aria-label="Primary" data-bw-unified-menu="${BW_HEADER_NAV_VERSION}">
              <ul class="bw-header-nav-list" data-bw-home-nav>${BW_HEADER_MENU_GROUPS.filter(group=>BW_HEADER_STORE_DESIGN2||group.key!=='shop').map(group=>`${group.key==='walk'?`<li><a class="bw-header-clothing-link" href="https://www.walkofberlin.com/${BW_HEADER_GERMAN?'de/':''}category/berlin-t-shirts">${BW_HEADER_GERMAN?'Kleidung':'Clothing'}</a></li>`:''}
                <li class="bw-header-dropdown ${group.key==='walk'?'bw-header-tours-dropdown':''}">
                  ${group.key==='shop'?`<a class="bw-header-store-link" href="${BW_HEADER_DESIGN2_HOME}">Store</a><button class="bw-header-dropdown-trigger bw-header-store-expand" type="button" aria-label="${BW_HEADER_GERMAN?'Store-Menü öffnen':'Open Store menu'}" aria-expanded="false" aria-controls="${this._instanceId}-shop-menu"><span class="bw-header-caret" aria-hidden="true">⌄</span></button>`:`<button class="bw-header-dropdown-trigger" type="button" aria-expanded="false" aria-controls="${this._instanceId}-${group.key}-menu">${bwHeaderEscape(group.label)} <span class="bw-header-caret" aria-hidden="true">⌄</span></button>`}
                  <ul id="${this._instanceId}-${group.key}-menu" class="bw-header-submenu" aria-label="${bwHeaderEscape(group.label)}"${group.key==='shop'&&BW_HEADER_STORE_DESIGN2?' data-bw-store-menu="design2"':''} hidden inert>${bwHeaderItems(group)}</ul>
                </li>`).join('')}</ul>
            </nav>

            <div class="bw-header-cta">
              ${BW_HEADER_STORE_DESIGN2?'':`<div class="bw-header-dropdown bw-header-store-dropdown">
                <button class="bw-header-home-store bw-header-dropdown-trigger" type="button" aria-expanded="false" aria-controls="${this._instanceId}-shop-menu">${bwHeaderEscape(BW_HEADER_MENU_GROUPS.find(group=>group.key==='shop').label)} <span class="bw-header-caret" aria-hidden="true">⌄</span></button>
                <ul id="${this._instanceId}-shop-menu" class="bw-header-submenu" aria-label="Store" data-bw-store-menu="${BW_HEADER_STORE_DESIGN2?'design2':'legacy'}" hidden inert>${bwHeaderItems(BW_HEADER_MENU_GROUPS.find(group=>group.key==='shop'))}</ul>
              </div>`}
              <a class="bw-header-book bw-header-commerce-bridge" href="${BW_HEADER_BOOKING_URL}">${BW_HEADER_GERMAN?'Termine ansehen und buchen':'See dates and book'}</a>
              <button class="bw-header-hamburger" type="button" aria-label="${BW_HEADER_GERMAN?'Menü öffnen':'Open menu'}" aria-expanded="false" aria-controls="${this._mobileMenuId}">
                <span></span><span></span><span></span>
              </button>
            </div>
          </div>

          <div class="bw-header-progress" aria-hidden="true">
            <div class="bw-header-progress-bar"></div>
          </div>
        </header>

        <div id="${this._mobileMenuId}" class="bw-header-mobile" data-bw-navigation="20260917" aria-hidden="true" aria-label="Mobile menu" inert>
          <div class="bw-header-mobile-inner">
            <div class="bw-header-mobile-head">
              <img src="${BW_HEADER_LOGO_ON_GREEN_URL}" alt="Walk of Berlin" width="900" height="142">
              <button class="bw-header-mobile-close" type="button" aria-label="${BW_HEADER_GERMAN?'Menü schließen':'Close menu'}">×</button>
            </div>

            <nav class="bw-header-mobile-nav" aria-label="Mobile primary">
              ${BW_HEADER_MENU_GROUPS.map(group=>`${group.key==='walk'?`<a class="bw-header-mobile-section-label" href="https://www.walkofberlin.com/${BW_HEADER_GERMAN?'de/':''}category/berlin-t-shirts">${BW_HEADER_GERMAN?'Kleidung':'Clothing'}</a>`:''}<details class="bw-header-mobile-section" data-bw-menu-group="${group.key}">
                <summary class="bw-header-mobile-section-label ${group.key==='walk'?'bw-header-mobile-tour-label':''}">${bwHeaderEscape(group.label)}</summary>
                ${group.key==='shop'?`<a href="${BW_HEADER_DESIGN2_HOME}">${BW_HEADER_GERMAN?'Alle Produkte':'All products'}</a>`:''}${bwHeaderMobileItems(group)}
              </details>`).join('')}
            </nav>
          </div>
        </div>
      </div>
    `;
    if(bwHeaderCommercePage()&&this._preservedCommerceForm){
      this.querySelector('.bw-header-commerce-bridge')?.replaceWith(this._preservedCommerceForm);
      this._preservedCommerceForm=null;
    }
  }
}

// Store mode (Yusuf, 29 Oct 2026). On store routes the header keeps only the logo: the tour band, the site menu, the hamburger and the
// yellow book buttons are hidden, so the store's own bar is the menu, and Wix's header box collapses to fit (no empty band left behind).
// The footer drops the tour copy, the four link columns and the tour facts, and its bottom row gains Contact and a small "Image credits"
// item that the storefront fills (window.__bwStoreCreditsHtml). Works on prerendered and rendered markup alike, and follows Wix's
// in-site navigation.
// /berlin-trip-planner and the Photo Missions page are store product pages since 29 Oct 2026 (trip-planner-store,
// photo-missions-store elements).
const BW_HEADER_STORE_ROUTE = /^\/(?:de\/)?(?:category|product-page|cart-page|thank-you-page|store|shop|berlin-trip-planner|products\/hidden-berlin-photo-missions)(?:\/|$)/;
function bwHeaderStoreMode() {
  const store = BW_HEADER_STORE_ROUTE.test(location.pathname);
  const home = location.pathname === '/';
  if (document.getElementById('bw-header-store-mode-css')?.dataset.navigationVersion !== BW_HEADER_NAV_VERSION) {
    document.getElementById('bw-header-store-mode-css')?.remove();
    const style = document.createElement('style');
    style.id = 'bw-header-store-mode-css';
    style.dataset.navigationVersion=BW_HEADER_NAV_VERSION;
    // On <html>, because the mobile menu is moved out of the element; the doubled attribute outranks the header's own !important rules
    // for the mobile book button (.bw-header-cta a.bw-header-mobile-book:is(...)).
    const m = 'html[data-bw-store-mode][data-bw-store-mode]';
    const f = `${m} #bw-site-footer-restore`;
    const h = 'html[data-bw-home-mode][data-bw-home-mode]';
    const fc = ':is(html[data-bw-store-mode][data-bw-store-mode],html[data-bw-home-mode][data-bw-home-mode]) #bw-site-footer-restore';
    style.textContent = [`${m} .bw-header-top`, `${m} [data-bw-header-tour-line]`, `${m} a.bw-header-book`, `${m} .bw-header-cta a.bw-header-book`, `${m} .bw-header-cta a.bw-header-mobile-book`, `${m} .bw-header-cta a.bw-header-mobile-book:is(:hover, :focus, :active, :visited)`,
      `${m} .bw-header-nav`, `${m} .bw-header-hamburger`, `${m} .bw-header-mobile`,
      `${f} .bw-footer-col`, `${f} .bw-footer-note-grid`, `${f} .bw-footer-cta`, `${f} .bw-footer-brand > p`,
      `${h} .bw-header-top`, `${h} [data-bw-header-tour-line]`, `${h} a.bw-header-book`, `${h} .bw-header-cta a.bw-header-book`, `${h} .bw-header-cta a.bw-header-mobile-book`, `${h} .bw-header-cta a.bw-header-mobile-book:is(:hover, :focus, :active, :visited)`,
      `${h} .bw-header-nav-list:not([data-bw-home-nav])`].join(',') + '{display:none!important}' + [
      // Wix sizes the header box for the tour band; let it shrink to the logo row.
      `${m} header[id] [class*="-container"]{grid-template-rows:minmax(0,auto)!important}`,
      `${m} header[id] bw-site-header,${m} header[id] [id$="_r_comp-mpcjk2pf"],${m} header[id] [id$="_r_comp-mpcks8xv"]{min-height:0!important;height:auto!important}`,
      `${m} .bw-header-main{padding-top:16px!important;padding-bottom:16px!important;min-height:0!important}`,
      `${f} .bw-footer-main{display:block!important}`,
      `${f} .bw-footer-brand{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px 32px}`,
      `${f} .bw-logo-link{margin:0!important}`,
      `${f} .bw-social-follow{display:flex;flex-direction:row!important;flex:0 1 auto;flex-wrap:wrap;gap:8px 20px;margin:0!important;max-width:100%}`,
      `${f} .bw-social-follow a{white-space:nowrap}`,
      `${f} .bw-footer-inner{padding-top:32px!important;padding-bottom:24px!important}`,
      `${fc} .bw-footer-bottom-links{position:relative}`,
      `${fc} [data-bw-store-credits]{display:inline-flex}`,
      `${fc} [data-bw-store-credits]>summary{cursor:pointer;list-style:none;color:rgba(250,250,245,.78);font-size:14px;font-weight:800;line-height:1.35}`,
      `${fc} [data-bw-store-credits]>summary::-webkit-details-marker{display:none}`,
      `${fc} [data-bw-store-credits]>div{position:absolute;right:0;bottom:calc(100% + 10px);width:min(560px,calc(100vw - 36px));max-height:260px;overflow:auto;background:#FAFAF5;color:#102414;padding:16px;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.3);z-index:5;font:400 13px/1.55 Georgia,serif;text-align:left}`,
      `${fc} [data-bw-store-credits]>div p{color:inherit;font:inherit;margin:0;max-width:none}`,
      `${fc} [data-bw-store-credits]>div p+p{margin-top:10px}`,
      `${fc} [data-bw-store-credits]>div a{color:inherit;display:inline;font:inherit;text-decoration:underline}`,
      // Shared navigation uses the approved homepage appearance on every normal route.
      // The removed desktop CTA no longer owns a flex slot; the remaining menu ends at the right inset.
      `@media(min-width:${BW_HEADER_STORE_DESIGN2?981:1101}px){html[data-bw-unified-navigation]:not([data-bw-header-commerce]) .bw-header-nav-list{justify-content:flex-end}html[data-bw-unified-navigation]:not([data-bw-header-commerce]) .bw-header-cta{display:none}}`,
      `html[data-bw-unified-navigation] .bw-header-top,html[data-bw-unified-navigation] [data-bw-header-tour-line],html[data-bw-unified-navigation] .bw-header-commerce-bridge{display:none!important}`,
      `html[data-bw-unified-navigation] .bw-header-nav-list[data-bw-home-nav]{display:flex!important}`,
      `html[data-bw-unified-navigation] .bw-header-home-store{display:inline-flex!important;align-items:center;justify-content:center;gap:6px;min-height:44px;padding:12px 22px;border-radius:999px;border:0;background:#123D18;color:#FAFAF5!important;font-family:Montserrat,Arial,sans-serif;font-size:13px;font-weight:800;letter-spacing:1px;line-height:1;text-transform:uppercase;text-decoration:none}`,
      `html[data-bw-unified-navigation] .bw-header-home-store:is(:hover,:focus-visible){background:#1B5E20}`,
      `${m} .bw-header-store-dropdown{display:none!important}`,
      `html[data-bw-header-commerce] .bw-header-store-dropdown{display:none!important}`,
      `html[data-bw-header-commerce] .bw-header-cta .bw-header-commerce-bridge{display:inline-flex!important}`,
      `@media (max-width:1100px){html[data-bw-header-commerce] .bw-header-cta .bw-header-commerce-bridge{display:none!important}html[data-bw-unified-navigation] .bw-header-home-store{background:none;color:#123D18!important;padding:12px 8px;font-size:15px;letter-spacing:0;text-transform:none;font-weight:700}}`,
      `html[data-bw-unified-navigation] header[id] [class*="-container"]{grid-template-rows:minmax(0,auto)!important}`,
      `html[data-bw-unified-navigation] header[id] bw-site-header,html[data-bw-unified-navigation] header[id] [id$="_r_comp-mpcjk2pf"],html[data-bw-unified-navigation] header[id] [id$="_r_comp-mpcks8xv"]{min-height:0!important;height:auto!important}`,
].join('');
    document.head.appendChild(style);
  }
  document.documentElement.setAttribute('data-bw-unified-navigation',BW_HEADER_NAV_VERSION);
  document.documentElement.toggleAttribute('data-bw-header-commerce', bwHeaderCommercePage());
  for(const instance of BW_HEADER_INSTANCES){
    const checkout=instance.querySelector('form[data-bw-landmarks-guide-header-checkout]');
    if(!bwHeaderCommercePage()&&checkout){instance._preservedCommerceForm=checkout;checkout.replaceWith(bwHeaderCommerceBridge());}
    else if(bwHeaderCommercePage()&&!checkout&&instance._preservedCommerceForm){instance.querySelector('.bw-header-commerce-bridge')?.replaceWith(instance._preservedCommerceForm);instance._preservedCommerceForm=null;}
  }
  document.documentElement.toggleAttribute('data-bw-store-mode', store);
  document.documentElement.toggleAttribute('data-bw-home-mode', home);
  document.querySelectorAll('bw-site-header').forEach((header) => {
    header.toggleAttribute('data-bw-store-mode', store);
    header.toggleAttribute('data-bw-home-mode', home);
  });
}
// The footer is drawn by the separate footer-restore embed and may mount late or re-render, so the store items are re-checked every tick.
function bwHeaderStoreFooter() {
  const links = document.querySelector('#bw-site-footer-restore .bw-footer-bottom-links');
  if (!links) return;
  const store = BW_HEADER_STORE_ROUTE.test(location.pathname);
  const home = location.pathname === '/';
  const credits = String((store ? window.__bwStoreCreditsHtml : home ? window.__bwHomeCreditsHtml : '') || '');
  let contact = links.querySelector('[data-bw-store-contact]');
  // The strategy footer (29 Oct 2026) already carries Contact; add the store's own only to an older footer without one.
  if (store && !contact && !links.querySelector('a[href="/contact"]')) links.insertAdjacentHTML('afterbegin', '<a href="/contact" data-bw-store-contact>Contact</a>');
  if (!store && contact) contact.remove();
  let clothing = links.querySelector('[data-bw-store-clothing]');
  if (store && !clothing) links.insertAdjacentHTML('afterbegin', `<a data-bw-store-clothing href="https://www.walkofberlin.com/${BW_HEADER_GERMAN?'de/':''}category/berlin-t-shirts">${BW_HEADER_GERMAN?'Kleidung':'Clothing'}</a>`);
  if (!store && clothing) clothing.remove();
  let details = links.querySelector('[data-bw-store-credits]');
  if (!credits) { if (details) details.remove(); return; }
  if (!details) {
    links.insertAdjacentHTML('beforeend', '<details data-bw-store-credits><summary>Image credits</summary><div></div></details>');
    details = links.querySelector('[data-bw-store-credits]');
  }
  if (details.bwHtml !== credits) { details.lastElementChild.innerHTML = credits; details.bwHtml = credits; }
}
document.addEventListener('pointerdown', (event) => {
  const details = document.querySelector('[data-bw-store-credits][open]');
  if (details && !details.contains(event.target)) details.open = false;
});
let bwHeaderStorePath = '';
function bwHeaderStoreModeWatch() {
  bwHeaderStoreFooter();
  if (location.pathname === bwHeaderStorePath) return;
  bwHeaderStorePath = location.pathname;
  BW_HEADER_INSTANCES.forEach(instance=>{instance._closeDropdowns?.();instance._setMobileOpen?.(false);});
  bwHeaderStoreMode();
  bwHeaderScheduleReconcile();
}

BWHeaderElement.navigationVersion = BW_HEADER_NAV_VERSION;
if (!customElements.get('bw-site-header')) {
  customElements.define('bw-site-header', BWHeaderElement);
}
{
  // Preserve the native tag (and product-adapter selectors) when an older
  // cached Wix script registered first. Its runtime is cleaned before mounting
  // the new element inside that host; do not mutate a registered prototype.
  if(!customElements.get('bw-site-header-desktop-align'))customElements.define('bw-site-header-desktop-align', class extends BWHeaderElement {});
  const upgrade = () => {
    for (const host of document.querySelectorAll('bw-site-header')) {
      if(host.constructor.navigationVersion===BW_HEADER_NAV_VERSION&&!host.querySelector('bw-site-header-unified,bw-site-header-design2,bw-site-header-design2-fix4,bw-site-header-design2-fix5,bw-site-header-design2-fix5b,bw-site-header-design2-fix6'))continue;
      if(host.querySelector('bw-site-header-desktop-align'))continue;
      // Preserve older compatibility hosts: their observers use the direct
      // child tag as an upgrade guard. Removing it makes two builds fight.
      const legacy=[host,...host.querySelectorAll('bw-site-header-unified,bw-site-header-design2,bw-site-header-design2-fix4,bw-site-header-design2-fix5,bw-site-header-design2-fix5b,bw-site-header-design2-fix6')];
      const mount=legacy.at(-1);
      const next=document.createElement('bw-site-header-desktop-align');
      next._preservedCommerceForm=host.querySelector('form[data-bw-landmarks-guide-header-checkout]');
      next._preservedCommerceForm?.remove();
      for(const previous of legacy)previous.disconnectedCallback?.();
      mount.replaceChildren(next);
      host.dataset.bwNavigation='20260917';
      host.dataset.bwNavigationVersion=BW_HEADER_NAV_VERSION;
    }
  };
  let frame;
  new MutationObserver(()=>{if(!frame)frame=requestAnimationFrame(()=>{frame=null;upgrade();});})
    .observe(document.documentElement,{childList:true,subtree:true});
  upgrade();
}
bwHeaderStoreModeWatch();
window.addEventListener('popstate', bwHeaderStoreModeWatch);
setInterval(bwHeaderStoreModeWatch, 500);
bwHeaderScrollToVirtualTours();
})();
