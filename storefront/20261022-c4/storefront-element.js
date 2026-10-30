(function () {
  'use strict';
  const script = document.currentScript;
  if (!script || !script.src || customElements.get('bw-storefront')) return;
  const base = new URL('.', script.src);
  const CHANNEL = 'wob:shop-cart:v1';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const asset = value => {const target=new URL(value,base);if(/\.(?:js|css|json)$/.test(target.pathname))target.searchParams.set('v','christmas3-20261030');return target.href;};
  // Chrome and Safari ignore @font-face inside shadow DOM, so the three faces are registered once on the document with absolute URLs from the element's own base.
  try {if(!document.getElementById('bw-storefront-fonts')){const style=document.createElement('style');style.id='bw-storefront-fonts';style.textContent=[['Fraunces','Fraunces-Variable.ttf','100 900'],['Space Grotesk','SpaceGrotesk-Variable.ttf','300 700'],['IBM Plex Mono','IBMPlexMono-Regular.ttf','400 600'],['DM Serif Display','DMSerifDisplay-Regular.ttf','400']].map(([family,file,weight])=>`@font-face{font-family:'${family}';src:url("${asset('fonts/'+file)}") format("truetype");font-weight:${weight};font-display:swap}`).join('\n')+`
/* Metric-matched stand-ins (27 Oct 2026): while a font file is still downloading, Safari shows the fallback; these two are scaled to the real fonts' widths (measured on the 600-weight headline: Fraunces is about 10% narrower than Georgia Bold, Space Grotesk about 8% wider than Arial) so the headline and the body text hardly change size when the real font arrives. */
@font-face{font-family:'Fraunces Fallback';src:local('Georgia Bold'),local('Georgia-Bold'),local('Georgia');font-weight:100 900;size-adjust:90%}
@font-face{font-family:'Space Grotesk Fallback';src:local('Arial'),local('Helvetica');size-adjust:108%}`;(document.head||document.documentElement).appendChild(style);
    // Start the two fonts above the fold now instead of when the first line of text is laid out inside the shadow root.
    for(const file of ['Fraunces-Variable.ttf','SpaceGrotesk-Variable.ttf']){const link=document.createElement('link');link.rel='preload';link.as='font';link.type='font/ttf';link.crossOrigin='anonymous';link.href=asset('fonts/'+file);document.head.appendChild(link);}}}catch{}
  // One price format everywhere: euro sign, two decimals, dot separator ("€24.90"). Native Wix formatted prices are used first; this covers every fallback.
  const money = (currency, major) => {const number=Number(major);if(major===''||major===null||major===undefined||!Number.isFinite(number))return '';const code=String(currency||'').toUpperCase();return ({EUR:'€',USD:'$',GBP:'£'}[code]||(code?code+' ':''))+number.toFixed(2);};
  const url = value => {if(typeof value!=='string'||!value.trim())return '#';try {const u = new URL(value, 'https://www.walkofberlin.com');return u.protocol === 'https:' ? u.href : '#';} catch {return '#';}};
  const textMoney = value => value?.formattedAmount || (typeof value?.amount === 'string' ? value.amount : 'Not confirmed');
  const nativeImage = value => {if(typeof value!=='string')return '#';const match=/^wix:image:\/\/v1\/([^/#?]+)(?:\/|#|\?|$)/.exec(value);if(match&&/^[a-zA-Z0-9_.~%-]+$/.test(match[1]))return 'https://static.wixstatic.com/media/'+match[1];return url(value);};
  const json = value => {try{return JSON.parse(value || 'null');}catch{return null;}};
  // Native-widget guard release. The site-wide head snippet (wix/head-native-guard.html) hides the original Wix Stores widgets from first paint; this class lets them show again. Called only on terminal fallback paths: the bridge reports the native store restored or not collapsible, the visitor opens the original cart, the bridge times out, or the element's own files fail to load. A transient fail() alone does not release it.
  const releaseNative = () => {try{document.documentElement.classList.add('bw-shop-native');}catch{}};
  // This native digital SKU uses the same required map configurator, never a generic product add.
  const PRODUCT_VIEW_ALIASES = Object.freeze({'9b6fbecf-32e4-27dc-f3e6-9c887fe7f495': Object.freeze({productId:'8aaf5412-7f21-42c7-acfb-85dd8417d68c',format:'digital'})});
  // Neutral shimmer block used by the loading skeleton wherever a price, button or line of text will be.
  // room videos: product id (print and its printable twin) -> asset slug; value = how the video is described
  const ROOM_VIDEOS = {
  "kottbusser-tor": "Kottbusser Tor",
  "mehringplatz": "Mehringplatz",
  "strausberger-platz": "Strausberger Platz",
  "gleisdreieck": "Gleisdreieck",
  "steinstuecken": "Steinstücken",
  "street-lights": "Berlin Street Lights",
  "u-bahn-two-sizes": "Two U-Bahn Profiles",
  "berlin-bear": "Berlin Bear",

  "siegessaeule": "Siegessäule",
'berlin-uhr':'The Berlin-Uhr print','ghost-stations':'The Ghost Stations print','world-clock':'The World Clock print','wasserturm':'The Wasserturm print','tv-tower':'The TV Tower print','tram-map':'The Tram Map and the Wall print','bierpinsel':'The Bierpinsel print','osman-kalin':'The Osman Kalın’s Treehouse print','cafe-achteck':'The Café Achteck print','friedrichshain-kreuzberg':'The Friedrichshain-Kreuzberg print','pankow':'The Pankow print','charlottenburg-wilmersdorf':'The Charlottenburg-Wilmersdorf print','spandau':'The Spandau print','steglitz-zehlendorf':'The Steglitz-Zehlendorf print','tempelhof-schoeneberg':'The Tempelhof-Schöneberg print','neukoelln':'The Neukölln print','treptow-koepenick':'The Treptow-Köpenick print','marzahn-hellersdorf':'The Marzahn-Hellersdorf print','lichtenberg':'The Lichtenberg print','reinickendorf':'The Reinickendorf print','ed-01-tempelhof':'The Tempelhof print','ed-02-pink':'The Berlin in Pink print','ed-03-courtyard':'The Through the Courtyard print','ed-04-spaeti':'The Späti print','ed-05-schoenhauser':'The Schönhauser Allee print','ed-06-up-close':'The Berlin, Up Close print','ed-07-window':'The "A Window in Berlin" print','ed-08-marzahn':'The Marzahn print','ed-09-teufelsberg':'The Teufelsberg print','ed-10-currywurst':'The Currywurst print','ed-11-mauerpark':'The Mauerpark print','ed-12-grunewald':'The Grunewald print','berolina-modernist':'The Berolina Modernist print'};
  const ROOM_IDS = {bu:'berlin-uhr',gs:'ghost-stations',wc:'world-clock',wt:'wasserturm',tv:'tv-tower',tm:'tram-map',bp:'bierpinsel',ok:'osman-kalin',ca:'cafe-achteck','dl-berlin-tram-map':'tram-map','dl-osman-kalin-treehouse':'osman-kalin'};
  // story reels: the Walk of Berlin reel a print came from, cut before the tour CTA (slug -> file, credits record, length)
  const STORY_REELS = {
    'berlin-uhr':{file:'berlin-uhr-reel',credits:'set-theory-clock',length:'1:34',label:'The clock almost nobody could read',ai:'Some archive photos are animated with AI and the voice is AI-generated.'},
    'ghost-stations':{file:'ghost-stations-reel',credits:'ghost-stations',length:'0:42',label:'No train stopped here for 28 years',ai:'Three archive photos are animated with AI, the cover picture is AI-made and the voice is AI-generated.'},
    'osman-kalin':{file:'osman-kalin-reel',credits:'osman-kalin-treehouse',length:'0:49',label:'East Berlin, west of the Wall',ai:'The voice is AI-generated.'},
    'tram-map':{file:'tram-map-reel',credits:'west-berlin-tram',length:'0:36',label:"Berlin's tram map still shows the Wall",ai:'The voice is AI-generated.'},
    'world-clock':{file:'world-clock-reel',credits:'world-clock',length:'1:09',label:"East Berlin's clock showed New York time",ai:'The cover picture is AI-made and the voice is AI-generated.'}};
  const roomSlug = product => {const id=String(product?.id||''),slug=ROOM_IDS[id]||id.replace(/^(pr|dl)-/,'').replace(/^ed-(print|digital)-/,'ed-');return ROOM_VIDEOS[slug]&&/^(pr-|dl-|ed-print-|ed-digital-|bu$|gs$|wc$|wt$|tv$|tm$|bp$|ok$|ca$)/.test(id)?slug:'';};
  const sk = cls => `<span class="sk-block ${cls}"></span>`;
  // Loading skeleton only: product page slug (the keys of PRODUCT_SLUGS in the page code) -> native product id, so the bundled poster of the product being opened can be drawn before the bridge answers. An unknown slug just gets a neutral skeleton.
  const SKELETON_PRODUCTS = Object.fromEntries(Object.entries({
  "kottbusser-tor-berlin-art-print": "cd3b2f77-7311-4ba2-ba3e-ca5f80fb2665",
  "kottbusser-tor-printable-berlin-poster": "d49e53dc-69f9-c5f3-ab11-999827699ecc",
  "mehringplatz-berlin-art-print": "b16be611-bff7-4fce-93b7-2eb2345a9020",
  "mehringplatz-printable-berlin-poster": "f604804a-247f-b64e-bd1c-2c6839e06254",
  "strausberger-platz-berlin-art-print": "d96734fa-ec60-4e0a-9f38-c59ae8459f0a",
  "strausberger-platz-printable-berlin-poster": "c86baec7-48ed-32d1-d8b0-a8d46c27bcc0",
  "gleisdreieck-berlin-art-print": "5d4474b8-8ad7-40a4-8005-7a73579adb75",
  "gleisdreieck-printable-berlin-poster": "e9aa01fa-cda4-549a-9bbf-5399e571f380",
  "steinstuecken-berlin-art-print": "3432e54a-14f5-4d57-97dc-12889399cbb5",
  "steinstuecken-printable-berlin-poster": "4507fae6-3d8b-6a79-7ab0-b3b010908cc0",
  "berlin-street-lights-berlin-art-print": "1aa77312-f6c7-4d6e-b309-ef65dc8fcb75",
  "berlin-street-lights-printable-berlin-poster": "b4759f68-7121-8cec-9bd9-88676849c41c",
  "two-berlin-u-bahn-profiles-berlin-art-print": "075fc392-c6af-4497-bf2e-9e911809ed99",
  "two-berlin-u-bahn-profiles-printable-berlin-poster": "77a8ba1c-92d2-088b-5048-44dc60a240f5",
  "berlin-bear-berlin-art-print": "536eecf0-3fb8-4bfd-9a68-9996860f6ea3",
  "berlin-bear-printable-berlin-poster": "8ec98cfc-353c-dfd7-7865-cb42ca31fb30",

  "siegessaeule-berlin-art-print": "8e2956c5-74e6-440e-b4c3-6cf0a3df23f2",
  "siegessaeule-printable-berlin-poster": "cc2e2464-61a1-b1e7-3f70-8cad2bdefa9e",

    'your-berlin-street-in-1928-digital-file':'8aaf5412-7f21-42c7-acfb-85dd8417d68c',
    'your-berlin-street-in-1928-personalised-aerial-print-30-x-40-cm':'8aaf5412-7f21-42c7-acfb-85dd8417d68c',
    'berolina-modernist-berlin-art-print':'52d20d32-021d-4024-875c-440d29784322',
    "berolina-modernist-printable-berlin-poster":"aa39bafc-c9da-f732-1416-5d7d00cdf215",
    "tempelhof-berlin-art-print": "ed545698-4cbc-41dc-8f0d-5fb0a335d70d",
    "tempelhof-printable-berlin-poster": "ae584657-fa80-a31f-894f-ee2f90096027",
    "berlin-in-pink-berlin-art-print": "4935fe7a-a33e-42c9-a315-4cb5644395a2",
    "berlin-in-pink-printable-berlin-poster": "ed6f94a6-b06d-b045-92b8-35b4e59c9771",
    "through-the-courtyard-berlin-art-print": "777b70f1-3d7f-4286-a73a-25f5858721c1",
    "through-the-courtyard-printable-berlin-poster": "2fa81547-3fe5-2e27-f159-1832e962fcfe",
    "späti-berlin-art-print": "01eb3a93-8d93-41dd-a786-7d730bb2f976",
    "späti-printable-berlin-poster": "1a6f46e4-abbf-d60e-35ca-e8bae2802879",
    "schönhauser-allee-berlin-art-print": "69d12671-9896-46eb-acc8-8f398a1938c3",
    "schönhauser-allee-printable-berlin-poster": "73a6b49e-0435-da63-feb5-ad09d92e86b0",
    "berlin-up-close-berlin-art-print": "3040bf5b-72d6-41b1-923b-c82dbdfabbc1",
    "berlin-up-close-printable-berlin-poster": "d00ef91a-2015-2bad-a728-4f719c80d8df",
    "a-window-in-berlin-berlin-art-print": "3decd6d0-aafd-4aa1-bcf0-5a30453c63b3",
    "a-window-in-berlin-printable-berlin-poster": "bea51a7c-c3f3-fcd5-907b-4223d65e936b",
    "marzahn-berlin-art-print": "21ad834a-4a86-4135-a43f-fc940896fe0a",
    "marzahn-printable-berlin-poster": "bab5589e-cc13-57b0-921f-c192c7ebd2c5",
    "teufelsberg-berlin-art-print": "65587cf3-a81d-441a-84ab-f140888fd431",
    "teufelsberg-printable-berlin-poster": "42bac8cd-a8a9-bdf9-c858-1edbd30ace60",
    "currywurst-berlin-art-print": "eb528417-cda2-4e2d-a46e-00ddd582213e",
    "currywurst-printable-berlin-poster": "249031ee-b803-44ab-cce0-2402d42d5eaa",
    "mauerpark-berlin-art-print": "db5d95e1-c762-4da9-81e4-40e8e8b2a3d4",
    "mauerpark-printable-berlin-poster": "d302f343-cf9f-233f-58fe-f2ef4fb3d9d0",
    "grunewald-berlin-art-print": "788fa678-c3ce-494e-b7a5-6e923a5d4637",
    "grunewald-printable-berlin-poster": "a2ea2403-34ae-052b-4320-287b1b19db8c",
    'friedrichshain-kreuzberg-art-print':'3f54173e-df8a-4de3-ba9b-5e2fb29bc3eb',
    'pankow-art-print':'0354f523-ff49-4b73-b5b9-01c1215a1b20',
    'charlottenburg-wilmersdorf-art-print':'a7ea3f8a-db73-4560-bb54-fdb67e46fbbc',
    'spandau-art-print':'48fd50dd-1a5c-4867-b289-620980283cbc',
    'steglitz-zehlendorf-art-print':'39f091f3-a907-4634-8249-096a097cfbeb',
    'tempelhof-schoeneberg-art-print':'08c22a8d-bc0a-4fb6-a57b-b37c59785e98',
    'neukoelln-art-print':'79862e25-1921-4e8f-9ae8-1334ae133a7e',
    'treptow-koepenick-art-print':'d035e581-eaaf-4ee1-a16a-4c76c106029b',
    'marzahn-hellersdorf-art-print':'ed3108d5-120e-4145-b998-d4277ebc9ca9',
    'lichtenberg-art-print':'a9fd57b3-ea60-4f4a-a8bf-07e6dc7e774f',
    'reinickendorf-art-print':'f00ec7b9-f51d-4602-9a14-250fae7bd563',
    'berlin-2027-wall-calendar-a3':'54584152-d3f1-4197-86e0-1c4c99ba5ccf',
    'osman-kalın-s-treehouse-berlin-art-print-berlin-reels-collection':'08a254a1-9cdb-4cb0-9c0c-098409bcf230',
    'ghost-stations-berlin-art-print-berlin-reels-collection':'6722fada-c4d9-4ac0-ab8a-6e2c6e911823',
    'berlin-tram-map-and-wall-art-print-berlin-reels-collection':'7c2f473b-ecbd-4a19-9d1f-18a12fa56652',
    'berlin-uhr-art-print-berlin-reels-collection':'1e5af6a4-4628-4f6a-adfb-744e2fc2049e',
    'berlin-tv-tower-poster-mitte-fernsehturm-art-print-30-x-40-cm':'3a236fae-16fe-495e-8031-0e799c1bbf38',
    'café-achteck-berlin-poster-green-architecture-art-print-30-x-40-cm':'065e316b-6066-4e5b-9e98-ade7ec33e696',
    'berlin-world-clock-poster-alexanderplatz-art-print-30-x-40-cm':'1f9ad3cb-74f8-48ac-ac53-f41e71a09610',
    'bierpinsel-berlin-poster-steglitz-architecture-art-print-30-x-40-cm':'2156be29-7e90-4ebc-8b1b-c76633ff09e6',
    'wasserturm-berlin-poster-prenzlauer-berg-art-print-30-x-40-cm':'62001c29-9901-4616-ab03-002fbd7a2910',
    'berlin-2027-printable-calendar':'8022f602-c244-954d-7744-b56ce8a9a71d',
    'osman-kalın-s-treehouse-printable':'2149e001-c835-73b9-1bfd-c087d48c625e',
    'ghost-stations-printable':'ee69ccf1-f5ac-288b-bdab-f25ecdec8674',
    'berlin-tram-map-printable':'e4e7e498-0734-f0c8-16c2-f1664489fb11',
    'berlin-uhr-printable':'bf9a00ff-c6b4-a8a8-d263-93645924a2bc',
    'berlin-icons-printable-set-of-3':'69fabc6e-f2fb-e0e9-67dc-cef78cffc44d',
    'berlin-landmarks-printable-set-of-5':'8566a144-d13c-ab44-f73b-0aba7fedbfd5',
    'all-12-berlin-districts-printable-set':'5ad8b924-c473-24a7-e68b-8b8a3e395b80',
    'reinickendorf-printable-poster':'bfcbcb8b-3075-2ba8-76b2-7b8c5ff0bd76',
    'lichtenberg-printable-poster':'7a64328a-e189-7411-190e-99f3ce8fa9b9',
    'marzahn-hellersdorf-printable-poster':'1c6745e0-dfef-af13-3791-8bb8313ee15e',
    'treptow-köpenick-printable-poster':'cece05f1-8b5b-ce12-3d60-5e6b963225b4',
    'neukölln-printable-poster':'004badf9-5cbb-d2e3-fa42-1a6a9ce6c654',
    'tempelhof-schöneberg-printable-poster':'a22bddc7-3731-1482-aad9-4d85995522ac',
    'steglitz-zehlendorf-printable-poster':'84e7492d-e5c4-6637-4ce0-2b76e3ef005d',
    'spandau-printable-poster':'b965e7a4-fc1f-8ab3-d680-7d6e15de1f5f',
    'charlottenburg-wilmersdorf-printable-poster':'37fafd04-bf6d-4175-7f07-ec0b47bb46b3',
    'pankow-printable-poster':'9b072e24-aaca-bb16-ce3b-7d60f8bcf1a6',
    'friedrichshain-kreuzberg-printable-poster':'587ee282-0b93-22f6-69fc-bf34d46f23aa',
    'wasserturm-printable-poster':'ae3fda47-c3aa-ad64-2134-0307dc0510e4',
    'café-achteck-printable-poster':'5de23d66-1570-9111-f62c-a5854b79ca5d',
    'bierpinsel-printable-poster':'d5850545-47f0-e05d-066c-5da5667fe4a9',
    'world-clock-printable-poster':'c5596e7b-07e7-94ab-9961-df5f5dac3113',
    'tv-tower-printable-poster':'2bddb91c-7218-f0fa-279e-22b097b48407'
  }).map(([slug,id])=>[slug.normalize('NFC'),id]));
  const resources = Promise.all([
    import(asset('catalog-layer.js')), import(asset('editorial-helpers.js')), import(asset('street-configurator.js')),
    ...['data/categories.json','data/presentation.json','data/native-bindings.json','data/external-products.json'].map(path => fetch(path==='data/presentation.json'?new URL('data/presentation.json?v=gallery-'+Date.now(),base).href:asset(path),path==='data/presentation.json'?{cache:'no-store'}:undefined)/* gallery-fresh-v1 */.then(response => {if (!response.ok) throw Error('CATALOGUE_METADATA_UNAVAILABLE');return response.json();})),
    import(asset('funnel.js')).catch(() => null),   // measurement must never block the shop
    import(new URL('../../js/store-navigation.js?v=christmas3-20261030',base).href),
    import(asset('gift.js')).catch(() => null)   // gift vouchers must never block the shop
  ]);
  // German layer for the press launch, only with ?lang=de; a failure leaves the English page (30 Oct 2026).
  if(new URLSearchParams(location.search).get('lang')==='de')import(asset('ys-de.js')).catch(()=>{});
  function safeHtml(html) {
    // Native rich text can preserve escaped quote delimiters and escaped block separators.
    // Normalize only tag attribute delimiters and separators between tags, then sanitize.
    const source=String(html||'').replace(/<[^>]*>/g,tag=>tag.replace(/=\\+(["'])/g,'=$1').replace(/\\+(["'])(?=[\s>])/g,'$1')).replace(/>(?:\s|\\+[rn])+</g,'>\n<');
    const doc = new DOMParser().parseFromString(source, 'text/html');
    const keep = new Set(['P','A','STRONG','EM','UL','OL','LI','BR','B','I']);
    for (const el of [...doc.body.querySelectorAll('*')]) {
      if (!keep.has(el.tagName)) {el.replaceWith(...el.childNodes);continue;}
      const href = el.tagName === 'A' ? el.getAttribute('href') : null;
      for (const attribute of [...el.attributes]) el.removeAttribute(attribute.name);
      if (href && url(href) !== '#') {el.href = url(href);el.target = '_blank';el.rel = 'noopener noreferrer';}
    }
    return doc.body.innerHTML.replace(/[\u2013\u2014]/g, ',');
  }
  // Lean pages (27 Oct 2026, Yusuf: "çok yazı var, minimize edelim"): a Wix description is one intro paragraph followed by bold-only heading paragraphs
  // ("Product details", "Printing and delivery", "What you get", ...). The intro stays on the page; every heading section moves into a closed row under the
  // buy box, so nothing is lost but the page opens short. Pure DOM work on the already sanitised markup.
  function splitStory(html) {
    const doc=new DOMParser().parseFromString('<body>'+safeHtml(html)+'</body>','text/html');
    const intro=[],sections=[];let current=null;
    for(const node of [...doc.body.childNodes]){
      const text=(node.textContent||'').replace(/\s+/g,' ').trim();
      if(!text&&!(node.nodeType===1&&node.tagName==='UL'))continue;
      const heading=node.nodeType===1&&node.tagName==='P'&&node.children.length===1&&/^(?:STRONG|B)$/.test(node.firstElementChild.tagName)&&node.firstElementChild.textContent.replace(/\s+/g,' ').trim()===text;
      if(heading){let title=text.replace(/:$/,'');if(title.length>3&&title===title.toUpperCase())title=title.charAt(0)+title.slice(1).toLowerCase();current={title,html:''};sections.push(current);continue;}
      const markup=node.nodeType===1?node.outerHTML:'<p>'+esc(text)+'</p>';
      if(current)current.html+=markup;else intro.push(markup);
    }
    return {intro:intro.join(''),sections};
  }
  // Cart destinations. The page-code bridge (quoteInput in wix/shop-page-custom-element.js) needs only a two-letter country and treats postalCode, subdivision, city and addressLine1 as optional, so the cart asks for country + postal code. `pattern` decides when a postal code looks complete enough to request a quote automatically.
  const DESTINATIONS = [['DE','Germany','Postal code','10115',/^\d{5}$/,'numeric'],['AT','Austria','Postal code','1010',/^\d{4}$/,'numeric'],['FR','France','Postal code','75001',/^\d{5}$/,'numeric'],['NL','Netherlands','Postal code','1012 AB',/^\d{4} ?[A-Za-z]{2}$/,'text'],['GB','United Kingdom','Postcode','SW1A 1AA',/^[A-Za-z]{1,2}\d[A-Za-z\d]? ?\d[A-Za-z]{2}$/,'text'],['US','United States','ZIP code','10001',/^\d{5}(?:-\d{4})?$/,'numeric']].map(([code,label,postal,example,pattern,mode])=>({code,label,postal,example,pattern,mode}));
  // Digital downloads (kind "digital" in presentation.json, or a native digital product type): no shipping, quantity 1, own delivery copy. Rows may override both texts with deliveryNote / deliveryDetails.
  const isDigital = product => product?.kind === 'digital' || product?.nativeProductType === 'digital';
  const STORE_LOGO = "<svg class=\"store-logo\" viewBox=\"0 0 160 60\" aria-hidden=\"true\" focusable=\"false\"><rect x=\"1.75\" y=\"1.75\" width=\"156.5\" height=\"56.5\" rx=\"5\" fill=\"#fff\" stroke=\"currentColor\" stroke-width=\"3.5\"/><svg x=\"8\" y=\"12\" width=\"36\" height=\"36\" viewBox=\"0 0 512 512\"><circle cx=\"256\" cy=\"256\" r=\"248\" fill=\"#1B5E20\"/><circle cx=\"256\" cy=\"256\" r=\"230\" fill=\"#7CB342\"/><circle cx=\"256\" cy=\"256\" r=\"218\" fill=\"#FFE600\"/><g transform=\"translate(-1135.53 -150.39) scale(1.12745)\"><path fill=\"#1B5E20\" fill-rule=\"evenodd\" d=\"M1212.07 282.39C1211.92 286.31 1190.84 312.83 1187.00 317.90C1164.84 347.06 1143.63 377.01 1122.57 407.00C1115.75 416.71 1108.20 426.11 1102.03 436.29C1099.78 439.99 1096.00 444.08 1097.39 448.81C1098.66 453.17 1104.84 455.08 1108.11 457.63C1105.89 463.74 1079.86 478.77 1085.72 489.68C1090.06 497.75 1103.61 498.26 1111.34 498.93C1135.80 501.07 1160.08 499.88 1184.19 495.99C1224.36 489.52 1268.32 473.00 1301.01 448.43C1321.28 433.19 1335.92 417.38 1333.82 390.39C1333.26 383.20 1329.11 374.56 1323.68 369.80C1320.42 366.94 1314.49 364.61 1312.73 360.63C1315.36 357.99 1329.43 352.46 1334.10 349.67C1346.05 342.55 1359.52 331.07 1368.58 320.55C1373.59 314.72 1378.79 308.19 1382.11 301.20C1395.51 272.91 1382.64 247.70 1354.30 237.49C1317.72 224.30 1271.49 227.49 1234.04 234.97C1224.29 236.91 1201.90 239.90 1194.39 245.64C1183.71 253.80 1203.33 277.58 1212.07 282.39Z M1165.94 445.61C1172.95 432.71 1185.37 418.17 1194.11 405.91C1201.59 395.44 1208.23 384.13 1216.18 374.02C1222.46 373.37 1229.55 373.04 1235.81 373.99C1238.97 374.47 1242.21 375.64 1245.39 375.84C1254.72 376.43 1281.14 381.63 1287.76 388.07C1289.78 390.03 1290.32 392.62 1290.06 395.34C1289.13 405.19 1279.67 411.64 1272.71 417.14C1252.72 432.92 1221.68 438.53 1197.44 443.34C1190.62 444.69 1171.99 448.11 1165.94 445.61Z M1356.98 280.17C1356.21 289.92 1340.98 300.61 1333.10 305.22C1312.66 317.19 1291.59 326.23 1268.41 331.35C1260.25 333.15 1251.62 336.69 1243.18 335.98C1242.93 330.59 1260.78 309.59 1264.54 303.45C1272.22 290.93 1266.93 287.92 1267.92 279.39C1275.54 276.30 1301.00 273.07 1309.63 272.89C1318.20 272.70 1323.48 273.45 1331.38 273.84C1339.47 274.24 1350.72 274.31 1356.98 280.17Z\"/></g></svg><line x1=\"52\" y1=\"8\" x2=\"52\" y2=\"52\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-dasharray=\"3 3\"/><path fill=\"currentColor\" d=\"M68.424 38.764Q66.444 38.764 65.047 38.082Q63.65 37.4 62.77 36.278L64.508 34.474000000000004Q65.366 35.464 66.36699999999999 35.937Q67.368 36.41 68.512 36.41Q69.832 36.41 70.536 35.816Q71.24 35.222 71.24 34.1Q71.24 33.176 70.71199999999999 32.703Q70.184 32.230000000000004 68.93 32.032L67.30199999999999 31.768Q65.168 31.394 64.266 30.217Q63.364 29.04 63.364 27.434Q63.364 25.234 64.794 24.057000000000002Q66.224 22.880000000000003 68.754 22.880000000000003Q70.55799999999999 22.880000000000003 71.86699999999999 23.452Q73.176 24.024 73.968 25.014000000000003L72.274 26.818Q71.658 26.092 70.8 25.663Q69.942 25.234 68.776 25.234Q66.268 25.234 66.268 27.302Q66.268 28.182000000000002 66.79599999999999 28.644000000000002Q67.324 29.106 68.6 29.326L70.206 29.612000000000002Q72.208 29.986 73.176 31.086Q74.144 32.186 74.144 33.902Q74.144 34.980000000000004 73.77000000000001 35.871Q73.396 36.762 72.67 37.411Q71.944 38.06 70.87700000000001 38.412000000000006Q69.81 38.764 68.424 38.764ZM87.23 25.520000000000003V38.5H84.37V25.520000000000003H79.75V23.144H91.85V25.520000000000003ZM103.0 38.764Q101.504 38.764 100.404 38.225Q99.304 37.686 98.589 36.674Q97.87400000000001 35.662 97.53300000000002 34.188Q97.19200000000001 32.714 97.19200000000001 30.822Q97.19200000000001 28.951999999999998 97.53300000000002 27.467Q97.87400000000001 25.982 98.589 24.97Q99.304 23.958 100.404 23.419Q101.504 22.880000000000003 103.0 22.880000000000003Q105.992 22.880000000000003 107.4 24.970000000000002Q108.808 27.060000000000002 108.808 30.822Q108.808 34.584 107.4 36.67400000000001Q105.992 38.764 103.0 38.764ZM103.0 36.41Q103.77000000000001 36.41 104.298 36.113Q104.82600000000001 35.816 105.14500000000001 35.266000000000005Q105.464 34.716 105.607 33.913Q105.75 33.11 105.75 32.12V29.502000000000002Q105.75 27.522 105.14500000000001 26.378Q104.54 25.234 103.0 25.234Q101.46000000000001 25.234 100.855 26.378Q100.25 27.522 100.25 29.502000000000002V32.142Q100.25 34.122 100.855 35.266Q101.46000000000001 36.41 103.0 36.41ZM118.242 38.5H115.36000000000001V23.144H121.19000000000001Q123.43400000000001 23.144 124.62200000000001 24.42Q125.81 25.696 125.81 27.896Q125.81 29.59 125.029 30.744999999999997Q124.248 31.9 122.796 32.208L126.07400000000001 38.5H122.906L119.98 32.538H118.242ZM120.596 30.294Q121.762 30.294 122.268 29.820999999999998Q122.774 29.348 122.774 28.314V27.478Q122.774 26.444000000000003 122.268 25.971000000000004Q121.762 25.498 120.596 25.498H118.242V30.294ZM132.626 38.5V23.144H142.328V25.520000000000003H135.508V29.524H142.086V31.9H135.508V36.124H142.328V38.5Z\"/></svg><span class=\"sr-only\">Walk of Berlin Store</span>";
  // Legal copy (Yusuf, 23 Oct 2026: "bunlarla ilerleyelim"). Texts from content/products/your-street-1928/SHOP_CHECKOUT_AND_EMAIL_COPY_DRAFT_EN.md section 1. The two documents and the withdrawal function are served by app.berlinwalk.com.
  const LEGAL = {terms:'https://app.berlinwalk.com/store-terms',withdrawalNotice:'https://app.berlinwalk.com/store-withdrawal',withdraw:'https://app.berlinwalk.com/withdraw',guaranteeImage:'assets/eu-legal-guarantee-notice-en.jpg',guaranteeInfo:'https://europa.eu/youreurope/guarantees'};
  const ACK = 'I agree to the Store Terms and Conditions. I have been given the Withdrawal notices and model withdrawal form.';
  // Cart line (Yusuf, 29 Oct 2026): the one fact a buyer must see stays visible, the full notice opens under Details. The withdraw button stays as it is.
  const NOTICE_PERSONALISED_SHORT = 'Made for you, so the 14-day withdrawal right does not apply. Faulty prints are covered.';
  const NOTICE_PERSONALISED = ['This physical print is made using your selected map point and text. The statutory right of withdrawal does not apply to this personalised physical product. Your statutory rights if the print is faulty or does not match your order remain unaffected.','Please check the map point, title, area and personal line shown in your order before paying.'];
  // Trust blocks on the 1928 page (Yusuf, 26 Oct 2026: items 2, 3, 4, 6, 7). Card marks: Simple Icons (CC0), only the brands the
  // site's Stripe checkout takes (Wix Accept Payments, read 26 Oct 2026: Visa, Mastercard, Amex, Maestro, Discover, Diners, UnionPay, JCB, CB).
  const CARD_MARKS = [['Visa','M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496z'],['Mastercard','M11.343 18.031c.058.049.12.098.181.146-1.177.783-2.59 1.238-4.107 1.238C3.32 19.416 0 16.096 0 12c0-4.095 3.32-7.416 7.416-7.416 1.518 0 2.931.456 4.105 1.238-.06.051-.12.098-.165.15C9.6 7.489 8.595 9.688 8.595 12c0 2.311 1.001 4.51 2.748 6.031zm5.241-13.447c-1.52 0-2.931.456-4.105 1.238.06.051.12.098.165.15C14.4 7.489 15.405 9.688 15.405 12c0 2.31-1.001 4.507-2.748 6.031-.058.049-.12.098-.181.146 1.177.783 2.588 1.238 4.107 1.238C20.68 19.416 24 16.096 24 12c0-4.094-3.32-7.416-7.416-7.416zM12 6.174c-.096.075-.189.15-.28.231C10.156 7.764 9.169 9.765 9.169 12c0 2.236.987 4.236 2.551 5.595.09.08.185.158.28.232.096-.074.189-.152.28-.232 1.563-1.359 2.551-3.359 2.551-5.595 0-2.235-.987-4.236-2.551-5.595-.09-.08-.184-.156-.28-.231z'],['American Express','M16.015 14.378c0-.32-.135-.496-.344-.622-.21-.12-.464-.135-.81-.135h-1.543v2.82h.675v-1.027h.72c.24 0 .39.024.478.125.12.13.104.38.104.55v.35h.66v-.555c-.002-.25-.017-.376-.108-.516-.06-.08-.18-.18-.33-.234l.02-.008c.18-.072.48-.297.48-.747zm-.87.407l-.028-.002c-.09.053-.195.058-.33.058h-.81v-.63h.824c.12 0 .24 0 .33.05.098.048.156.147.15.255 0 .12-.045.215-.134.27zM20.297 15.837H19v.6h1.304c.676 0 1.05-.278 1.05-.884 0-.28-.066-.448-.187-.582-.153-.133-.392-.193-.73-.207l-.376-.015c-.104 0-.18 0-.255-.03-.09-.03-.15-.105-.15-.21 0-.09.017-.166.09-.21.083-.046.177-.066.272-.06h1.23v-.602h-1.35c-.704 0-.958.437-.958.84 0 .9.776.855 1.407.87.104 0 .18.015.225.06.046.03.082.106.082.18 0 .077-.035.15-.08.18-.06.053-.15.07-.277.07zM0 0v10.096L.81 8.22h1.75l.225.464V8.22h2.043l.45 1.02.437-1.013h6.502c.295 0 .56.057.756.236v-.23h1.787v.23c.307-.17.686-.23 1.12-.23h2.606l.24.466v-.466h1.918l.254.465v-.466h1.858v3.948H20.87l-.36-.6v.585h-2.353l-.256-.63h-.583l-.27.614h-1.213c-.48 0-.84-.104-1.08-.24v.24h-2.89v-.884c0-.12-.03-.12-.105-.135h-.105v1.036H6.067v-.48l-.21.48H4.69l-.202-.48v.465H2.235l-.256-.624H1.4l-.256.624H0V24h23.786v-7.108c-.27.135-.613.18-.973.18H21.09v-.255c-.21.165-.57.255-.914.255H14.71v-.9c0-.12-.018-.12-.12-.12h-.075v1.022h-1.8v-1.066c-.298.136-.643.15-.928.136h-.214v.915h-2.18l-.54-.617-.57.6H4.742v-3.93h3.61l.518.602.554-.6h2.412c.28 0 .74.03.942.225v-.24h2.177c.202 0 .644.045.903.225v-.24h3.265v.24c.163-.164.508-.24.803-.24h1.89v.24c.194-.15.464-.24.84-.24h1.176V0H0zM21.156 14.955c.004.005.006.012.01.016.01.01.024.01.032.02l-.042-.035zM23.828 13.082h.065v.555h-.065zM23.865 15.03v-.005c-.03-.025-.046-.048-.075-.07-.15-.153-.39-.215-.764-.225l-.36-.012c-.12 0-.194-.007-.27-.03-.09-.03-.15-.105-.15-.21 0-.09.03-.16.09-.204.076-.045.15-.05.27-.05h1.223v-.588h-1.283c-.69 0-.96.437-.96.84 0 .9.78.855 1.41.87.104 0 .18.015.224.06.046.03.076.106.076.18 0 .07-.034.138-.09.18-.045.056-.136.07-.27.07h-1.288v.605h1.287c.42 0 .734-.118.9-.36h.03c.09-.134.135-.3.135-.523 0-.24-.045-.39-.135-.526zM18.597 14.208v-.583h-2.235V16.458h2.235v-.585h-1.57v-.57h1.533v-.584h-1.532v-.51M13.51 8.787h.685V11.6h-.684zM13.126 9.543l-.007.006c0-.314-.13-.5-.34-.624-.217-.125-.47-.135-.81-.135H10.43v2.82h.674v-1.034h.72c.24 0 .39.03.487.12.122.136.107.378.107.548v.354h.677v-.553c0-.25-.016-.375-.11-.516-.09-.107-.202-.19-.33-.237.172-.07.472-.3.472-.75zm-.855.396h-.015c-.09.054-.195.056-.33.056H11.1v-.623h.825c.12 0 .24.004.33.05.09.04.15.128.15.25s-.047.22-.134.266zM15.92 9.373h.632v-.6h-.644c-.464 0-.804.105-1.02.33-.286.3-.362.69-.362 1.11 0 .512.123.833.36 1.074.232.238.645.31.97.31h.78l.255-.627h1.39l.262.627h1.36v-2.11l1.272 2.11h.95l.002.002V8.786h-.684v1.963l-1.18-1.96h-1.02V11.4L18.11 8.744h-1.004l-.943 2.22h-.3c-.177 0-.362-.03-.468-.134-.125-.15-.186-.36-.186-.662 0-.285.08-.51.194-.63.133-.135.272-.165.516-.165zm1.668-.108l.464 1.118v.002h-.93l.466-1.12zM2.38 10.97l.254.628H4V9.393l.972 2.205h.584l.973-2.202.015 2.202h.69v-2.81H6.118l-.807 1.904-.876-1.905H3.343v2.663L2.205 8.787h-.997L.01 11.597h.72l.26-.626h1.39zm-.688-1.705l.46 1.118-.003.002h-.915l.457-1.12zM11.856 13.62H9.714l-.85.923-.825-.922H5.346v2.82H8l.855-.932.824.93h1.302v-.94h.838c.6 0 1.17-.164 1.17-.945l-.006-.003c0-.78-.598-.93-1.128-.93zM7.67 15.853l-.014-.002H6.02v-.557h1.47v-.574H6.02v-.51H7.7l.733.82-.764.824zm2.642.33l-1.03-1.147 1.03-1.108v2.253zm1.553-1.258h-.885v-.717h.885c.24 0 .42.098.42.344 0 .243-.15.372-.42.372zM9.967 9.373v-.586H7.73V11.6h2.237v-.58H8.4v-.564h1.527V9.88H8.4v-.507']];
  const cardChips = () => `<span class="ys-cards" aria-label="Card payment: Visa, Mastercard, American Express and other cards">${CARD_MARKS.map(([n,d])=>`<span class="ys-card" title="${n}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg></span>`).join('')}<span class="ys-card ys-card-more">+ more cards</span></span>`;
  const YS_FAQ = [
    ['Which paper should I pick?', 'Classic Matte (170 g) is the lightest and cheapest, Premium Matte (200 g) is smoother and whiter, Museum-Quality Matte (250 g) is archival and warm off-white. The semi-gloss papers have a soft sheen. For an old photograph I like matte best.'],
    ['Is a frame included?', 'No, the poster is unframed. 30 x 40 cm is a standard frame size, so a ready-made frame fits.'],
    ['What if the 1928 photo is blank at my spot?', 'The 1928 survey did not cover every corner of today\'s Berlin. The preview shows exactly what I print: if the top photo is blank, pick a place nearby.'],
    ['Can I change the text after I order?', 'Yes, until it goes to print. Write to me with your order number and the new text.'],
    ['Where do you deliver, and how long does it take?', 'The poster ships free to Germany, the other EU countries, the UK and the US: usually 3 to 5 working days to Germany, 4 to 7 to most of the EU, the UK and the US, and 6 to 9 to Bulgaria, Estonia, Finland, Greece, Ireland, Latvia, Lithuania, Portugal and Romania. Checkout shows the time for your country. The digital file comes by email within 24 hours, anywhere.'],
    ['Can I return it?', 'The poster is made for you, so there are no returns for a change of mind. If it arrives misprinted or damaged, I reprint it free. The digital file keeps the 14-day withdrawal right.'],
  ];
  // The one sentence beside the buy button (27 Oct 2026). The full notices stay in the "Withdrawal notice, terms and legal information" section at the foot of the page; the link opens it.
  const YS_LEGALLINE = {poster:'Made for you, so no returns for a change of mind. Faulty prints replaced free.',digital:'Digital file: you keep the 14-day withdrawal right.'};
  const NOTICE_YS_DIGITAL = 'Digital file made from your spot: a JPG and a PDF, sent by email within 24 hours of payment. Nothing is shipped. You can keep the files for your permitted personal use. You retain the 14-day consumer withdrawal right.';
  const NOTICE_GIFT = 'No physical product is shipped. Your code and a printable card arrive by email, normally within the hour and no later than 24 hours after payment. You retain the 14-day consumer withdrawal right while the code is unused.';
  const NOTICE_DIGITAL = 'Digital download: no physical product will be shipped. Your download link is supplied after payment and is valid for 30 days. You can keep the downloaded files for your permitted personal use. You retain the 14-day consumer withdrawal right even if you download or use the files immediately.';
  // Kottbusser Tor V3 only: activate through its exact, resolved presentation/native binding.
  const NOTICE_DIGITAL_CC_BY_SA = "Digital download: no physical product will be shipped. Your download link is supplied after payment and is valid for 30 days. You can keep the downloaded files; the artwork reuse licence is stated below. You retain the 14-day consumer withdrawal right even if you download or use the files immediately.";
  const KOTTI_ARTWORK_REUSE = "<p>The source photographs by Gunnar Klack and any copyrightable contributions in this artwork adaptation are offered under <a href=\"https://creativecommons.org/licenses/by-sa/4.0/\" target=\"_blank\" rel=\"noopener noreferrer\">CC BY-SA 4.0</a>. You may share and adapt the licensed material, including commercially, under its attribution and ShareAlike terms. No additional restriction is imposed on the rights granted by that licence.</p><p>Sources: <a href=\"https://commons.wikimedia.org/wiki/File:Wohnbebauung-Kottbusser-Tor-Nordbloecke-Neues-Kreuzberger-Zentrum-03-2017a.jpg\" target=\"_blank\" rel=\"noopener noreferrer\">NKZ north blocks, March 2017</a>; <a href=\"https://commons.wikimedia.org/wiki/File:Neues-Kreuzberger-Zentrum-Kottbusser-Tor-Skalitzer-Str-Berlin-Kreuzberg-08-2017a.jpg\" target=\"_blank\" rel=\"noopener noreferrer\">NKZ / Skalitzer Straße, August 2017</a>. The scene and facade were artistically reinterpreted with OpenAI ImageGen, enlarged with Adobe Firefly, and cropped for 50 × 70 cm. Keep the source and change notes in LICENCE_AND_CREDITS.txt. This does not imply endorsement.</p><p>This licence covers only copyright material its licensors have authority to license. It does not grant trademark or personality/privacy rights, or independent rights in separately protected works depicted. Room mockups are outside this artwork licence.</p>";
  const GUARANTEE_ALT = 'EU legal guarantee notice. Minimum two-year legal guarantee protection for goods sold in the European Union. Consumers can claim their rights under the legal guarantee of conformity, for example if goods do not match the description or do not function as intended. Sellers are liable for any lack of conformity which existed when the goods were delivered and which becomes apparent within the legal guarantee period, and must offer free repair or free replacement and, in some cases, a price reduction or full reimbursement. Some countries have a longer legal guarantee period. For more information, see europa.eu/youreurope/guarantees. What to do if you receive non-conforming goods: contact the seller as soon as possible to report the issue and provide proof of purchase.';
  const YS_ID = '8aaf5412-7f21-42c7-acfb-85dd8417d68c';
  const DIGITAL_NOTE = 'Download link after payment and by email, valid for 30 days. Nothing is shipped.';
  const DIGITAL_DETAILS = 'Digital download: no shipping. The download link appears on the order confirmation page and in the confirmation email and works for 30 days. The Store Terms and the Withdrawal notices are linked below.';
  class BWStorefront extends HTMLElement {
    static get observedAttributes() {return ['shop-bridge-ready','shop-context','shop-catalogue','shop-cart-response'];}
    constructor() {
      super();this.attachShadow({mode:'open'});this.pending = new Map();this.cart = null;this.catalogue = null;this.model = null;
      this.context = {};this.category = 'all';this.filter = 'all';this.quantity = 1;this.view = 'poster';this.busy = false;
      this.quote = null;this.destination = {};this.selection = null;this.error = '';this.notice = '';this.revealed = false;this.readySent = false;this.delivery = -1;this.quoteRevision=0;
      // Retired Everyday embed rev8 can remain in cached Wix documents after
      // enabled:false. Only its exact native-fallback request is obsolete;
      // ordinary failures and the visitor's original-store action still work.
      this.addEventListener('shop-cart-request',event=>{
        const request=event.detail;
        if(request?.channel===CHANNEL&&request.op==='native-fallback'&&/^everyday-native-\d+$/.test(request.id||'')){
          event.stopImmediatePropagation();event.stopPropagation();
        }
      },true);
      this.shadowRoot.addEventListener('click', event => this.click(event));
      this.shadowRoot.addEventListener('input', event => this.input(event));
      this.shadowRoot.addEventListener('change', event => this.change(event));
      this.shadowRoot.addEventListener('toggle', event => {if(event.target.matches?.('[data-berolina-options]')&&event.target.isConnected)this.berolinaOptionsOpen=event.target.open;}, true);
      this.shadowRoot.addEventListener('submit', event => {event.preventDefault();if(event.target.matches('[data-address-form]'))this.getQuote(true);});
      this.onCreditOutside=event=>{const d=this.shadowRoot.querySelector('.store-visual-credits');if(d?.open&&!event.composedPath().includes(d))d.open=false;};
      this.shadowRoot.addEventListener('keydown',event=>{const d=this.shadowRoot.querySelector('.store-visual-credits');if(event.key==='Escape'&&d?.open){d.open=false;d.querySelector('summary')?.focus();event.stopPropagation();}});
      this.onStoreNavigation=()=>{if(this.context.mode==='shop'){this.applyContextCategory();this.render();}};
      this.onCartViewport=()=>{cancelAnimationFrame(this.cartBarFrame);this.cartBarFrame=requestAnimationFrame(()=>this.syncMobileCheckout());};
    }
    // The stylesheet request starts now, in parallel with the data files, so the skeleton can be drawn as soon as the data arrives. The watchdog is the last resort when the page-code bridge never answers: it falls back to the original store before the guard's own 12 s failsafe would show both at once.
    connectedCallback() {window.addEventListener('pointerdown',this.onCreditOutside);window.addEventListener('popstate',this.onStoreNavigation);this.context=json(this.getAttribute('shop-context'))||{};this.syncConfiguredGuard();if(!this.revealed&&!this.hidden){this.style.display='block';this.style.minHeight='100vh';}window.addEventListener('scroll',this.onCartViewport,{passive:true});window.addEventListener('resize',this.onCartViewport,{passive:true});this.ensureLink();clearTimeout(this.watchdog);this.watchdog=setTimeout(()=>{if(!this.revealed&&!this.hidden){if(!this.isConfiguredDigitalRoute())releaseNative();this.fail('BRIDGE_TIMEOUT');}},Math.max(1500,10500-(globalThis.performance?.now?.()||0)));this.load();}
    disconnectedCallback() {window.removeEventListener('pointerdown',this.onCreditOutside);window.removeEventListener('popstate',this.onStoreNavigation);clearTimeout(this.watchdog);clearTimeout(this.quoteTimer);this.sizeObserver?.disconnect();cancelAnimationFrame(this.sizeFrame);cancelAnimationFrame(this.cartBarFrame);window.removeEventListener('scroll',this.onCartViewport);window.removeEventListener('resize',this.onCartViewport);for(const pending of this.pending.values()){clearTimeout(pending.timer);pending.reject(Error('BRIDGE_DISCONNECTED'));}this.pending.clear();}
    attributeChangedCallback(name, oldValue, value) {
      if(oldValue===value)return;
      if(name==='shop-context') {const next=json(value)||{};if(next.path!==this.context.path){this.quantity=1;this.view='poster';this.readySent=false;this.revealed=false;this.quote=null;this.quoteRevision++;this.ysEntryProductId='';this.configuredFailure=false;}this.context=next;this.syncConfiguredGuard();this.applyContextCategory();this.render();this.signalReady();}
      if(name==='shop-catalogue') {this.catalogue=json(value);this.buildModel();}
      if(name==='shop-cart-response')this.receive(json(value));
      if(name==='shop-bridge-ready')this.start();
    }
    async load() {
      try {const [layer,editorial,ysMod,definitions,presentation,bindings,external,funnel,navigation,gift]=await resources;
        Object.assign(this,{layer,editorial,ysMod,definitions,presentation,bindings,external,funnel,navigation,gift});
        if(this.catalogue)this.buildModel();if(!this.model)this.render();await this.start();
      }catch(error){if(!this.layer&&!this.isConfiguredDigitalRoute())releaseNative();this.fail(error.message);}
    }
    async start() {
      if(!this.layer||this.started||this.getAttribute('shop-bridge-ready')!==CHANNEL)return;
      this.started=true;
      const reads=await Promise.allSettled([this.request('catalog'),this.request('get')]);
      for(let index=0;index<reads.length;index++)if(reads[index].status==='rejected'&&index===0)this.fail(reads[index].reason.message);
      this.render();this.signalReady();
    }
    request(op, fields={}) {
      if(this.getAttribute('shop-bridge-ready')!==CHANNEL)return Promise.reject(Error('BRIDGE_NOT_READY'));
      const id=globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`;
      return new Promise((resolve,reject)=>{
        const timer=setTimeout(()=>{this.pending.delete(id);if(['add','update','remove','checkout'].includes(op))this.uncertain=true;reject(Error('UPDATE_NOT_CONFIRMED'));},20000);
        this.pending.set(id,{resolve,reject,timer,op,quoteRevision:this.quoteRevision});
        this.dispatchEvent(new CustomEvent('shop-cart-request',{detail:{channel:CHANNEL,id,op,...fields},bubbles:true,composed:true}));
      });
    }
    receive(response) {
      if(!response||response.channel!==CHANNEL)return;
      if(Number.isFinite(response.delivery)){if(response.delivery<=this.delivery)return;this.delivery=response.delivery;}
      if(response.event==='render-state') {
        if(this.isConfiguredDigitalRoute()&&(!response.ok||response.nativeCollapsed!==true)){this.showConfiguredFailure(response.error||'CONFIGURATOR_UNAVAILABLE');return;}
        for(const [id,pending] of this.pending)if(pending.op==='native-fallback'){clearTimeout(pending.timer);pending.resolve(response);this.pending.delete(id);}
        if(response.ok&&response.nativeCollapsed){clearTimeout(this.watchdog);this.hidden=false;this.revealed=true;this.style.minHeight='';this.style.display='';this.render();}
        else {releaseNative();this.revealed=false;this.hidden=true;this.style.minHeight='';this.style.display='';this.appliedHeight=0;this.style.height='0px';this.sizeObserver?.disconnect();if(!response.fallback)this.dispatchEvent(new CustomEvent('shop-render-failed',{detail:{channel:CHANNEL},bubbles:true,composed:true}));}
        return;
      }
      if(response.context){this.context=response.context;this.syncConfiguredGuard();}
      if(response.catalogue){this.catalogue=response.catalogue;this.buildModel();}
      if(response.cart) {
        if(this.cart?.signature!==response.cart.signature){this.quote=null;this.quoteRevision++;}
        this.cart=response.cart;this.uncertain=false;if(this.error==='UPDATE_NOT_CONFIRMED')this.error='';
      }
      const pending=this.pending.get(response.id);
      const uncertainMutation=response.uncertain===true||response.refreshRequired===true||response.retryAllowed===false||['APPLIED_CART_UNREADABLE','UNKNOWN'].includes(response.mutationStatus)||(pending&&['add','update','remove','checkout'].includes(pending.op)&&response.ok===false&&response.error==='INVALID_CART_RESPONSE');
      if(uncertainMutation){this.uncertain=true;this.error='UPDATE_NOT_CONFIRMED';}
      if(response.quote&&pending?.op==='quote'&&pending.quoteRevision===this.quoteRevision)this.quote=response.quote;
      if(pending){clearTimeout(pending.timer);this.pending.delete(response.id);response.ok?pending.resolve(response):pending.reject(Error(typeof response.error==='string'?response.error:response.error?.code||'CART_UNAVAILABLE'));}
      if(pending?.op==='quote'&&this.context.mode==='cart'&&this.shadowRoot.querySelector('.quote-area'))this.updateQuoteArea();else this.render();
      this.signalReady();
    }
    nativeProductRow(row) {
      const binding=this.bindings.find(item=>item.wixProductId===row.productId);
      return {id:row.productId,name:row.name,productType:binding?.nativeProductType,collectionIds:binding?.forceNativeCategoryIds?binding.nativeCategoryIds:row.collectionIds?.length?row.collectionIds:binding?.nativeCategoryIds,
        visible:true,stock:{inStock:row.inStock},priceData:{price:row.price,discountedPrice:row.discountedPrice,currency:row.currency},productPageUrl:url(row.productPageUrl),
        description:row.description,additionalInfoSections:row.additionalInfoSections,
        media:{mainMedia:{image:{url:row.mainMedia}}},productOptions:row.requiresOptions||row.directAddAllowed!==true?[{name:'Native options'}]:[]};
    }
    unavailableProduct(id=this.context.productId) {
      if(!this.layer||!this.presentation||!this.bindings||PRODUCT_VIEW_ALIASES[id])return null;
      const native=this.catalogue?.products?.find(row=>row.productId===id),meta=this.presentation.find(item=>item.wixProductId===id&&item.enabled!==false),binding=this.bindings.find(item=>item.wixProductId===id);
      const price=native?.discountedPrice??native?.price;
      if(!native||!meta||!binding||!['physical','digital'].includes(binding.nativeProductType)||native.inStock!==false||native.visible===false||!Number.isFinite(native.price)||native.price<0||!Number.isFinite(price)||price<0||!/^[A-Z]{3}$/.test(native.currency||'')||url(native.productPageUrl)==='#')return null;
      const [product]=this.layer.adaptWixProducts([this.nativeProductRow(native)],[meta]);
      if(!product?.approvedForShop||product.status!=='unavailable'||product.inStock!==false||!Number.isInteger(product.priceCents))return null;
      return {...product,unavailable:true,priceLabel:native.formattedDiscountedPrice||native.formattedPrice||money(native.currency,price)};
    }
    buildModel() {
      if(!this.layer||!Array.isArray(this.catalogue?.products))return;
      try {
        const rows=this.catalogue.products.filter(row=>!PRODUCT_VIEW_ALIASES[row.productId]&&!this.gift?.isGiftId(row.productId)).map(row=>this.nativeProductRow(row));
        const products=[...this.layer.adaptWixProducts(rows,this.presentation),...this.layer.adaptExternalProducts(this.external)];
        products.sort((a,b)=>this.presentation.findIndex(item=>item.id===a.id)-this.presentation.findIndex(item=>item.id===b.id));
        this.model=this.layer.createCatalogModel(products,this.definitions);
        for(const product of this.model.products){const native=this.catalogue.products.find(row=>row.productId===product.wixProductId);product.priceLabel=native?.formattedDiscountedPrice||native?.formattedPrice||money(native?native.currency:product.currency,native?(native.discountedPrice??native.price):this.external.find(item=>item.sourceKey===product.externalSourceKey)?.productSchema?.offers?.price);if(((product.wixProductId==='8aaf5412-7f21-42c7-acfb-85dd8417d68c'||native?.posterOptions)&&native?.requiresOptions)||product.priceFrom)product.priceLabel='From '+product.priceLabel;}
        if(this.productAlias()){if(!this.model.products.some(p=>p.wixProductId===this.productViewId())||!this.ysDigitalNative()){this.showConfiguredFailure('CONFIGURATOR_UNAVAILABLE');return;}this.configuredFailure=false;}
        this.applyContextCategory();this.render();this.signalReady();
      }catch(error){this.fail(error.message);}
    }
    applyContextCategory() {
      if(!this.model||!this.navigation||this.context.mode!=='shop')return;
      const route=this.navigation.resolveStoreRoute({categorySlug:this.context.categorySlug||'all-products',search:location.search});
      this.routeError=!route.ok;
      if(route.ok){this.category=route.category;this.filter=route.filter;}
      const query=new URLSearchParams(location.search);
      this.landing=!query.has('tab')&&!query.has('collection')?this.navigation.STORE_LANDINGS?.[this.context.categorySlug]||null:null;
    }
    storeHref(category='all',filter='all') {return this.navigation.storeHref(category,filter);}
    navigateStore(category,filter,event) {
      if(event.button>0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||this.context.mode!=='shop')return;
      event.preventDefault();
      const target=new URL(location.href);
      target.searchParams.set('tab',category);
      if(filter==='all')target.searchParams.delete('collection');else target.searchParams.set('collection',filter);
      if(target.href!==location.href)history.pushState({...history.state},'',target.href);
      this.applyContextCategory();
      const selected=this.model.getCategoryView(category,filter);
      this.notice=selected?`${selected.title}: ${selected.totalCount} available.`:'All products';
      this.render();
      this.shadowRoot.querySelector(filter==='all'?`[data-category="${category}"]`:`[data-filter="${filter}"]`)?.focus({preventScroll:true});
    }
    isConfiguredDigitalRoute() {
      const path=String(this.context.path||location.pathname||'').split('?')[0].replace(/\/$/,'');
      return path==='/product-page/your-berlin-street-in-1928-digital-file'||!!this.productAlias();
    }
    syncConfiguredGuard() {
      let style=document.getElementById('bw-configured-product-guard');
      if(!style){style=document.createElement('style');style.id='bw-configured-product-guard';style.textContent='html.bw-shop-configured #TPASection_mvaweahn{visibility:hidden!important;max-height:0!important;overflow:hidden!important;animation:none!important}';(document.head||document.documentElement).append(style);}
      document.documentElement.classList.toggle('bw-shop-configured',this.isConfiguredDigitalRoute());
    }
    configuredUnavailableBody() {return '<section class="wrap empty configured-unavailable"><h1>Personalisation is temporarily unavailable</h1><p>This file needs the address and map configurator before it can be ordered. Please refresh the page or <a href="https://walkofberlin.com/contact">contact me</a>.</p><button class="outline" data-action="reload-configured">Refresh</button></section>';}
    renderConfiguredFailure() {
      this.hidden=false;this.revealed=true;this.style.display='block';this.style.minHeight='';
      this.shadowRoot.innerHTML='<style>:host{display:block;background:#fafaf5;color:#123d18;font:16px/1.6 system-ui,sans-serif}.configured-unavailable{max-width:800px;margin:auto;padding:48px 24px}h1{font:600 clamp(28px,5vw,44px)/1.2 Georgia,serif}a{color:inherit}button{min-height:44px;padding:10px 20px;background:#fafaf5;color:#123d18;border:1px solid;border-radius:24px;font:inherit}</style>'+this.configuredUnavailableBody();
      this.watchSize(this.shadowRoot.querySelector('section'));
    }
    showConfiguredFailure(message) {
      this.configuredFailure=true;this.setAttribute('data-configured-status',message||'CONFIGURATOR_UNAVAILABLE');clearTimeout(this.watchdog);this.syncConfiguredGuard();this.renderConfiguredFailure();
      if(!this.readySent){this.readySent=true;this.dispatchEvent(new CustomEvent('shop-render-ready',{detail:{channel:CHANNEL,configuredUnavailable:true},bubbles:true,composed:true}));}
    }
    productAlias() {return this.context.mode==='product'?PRODUCT_VIEW_ALIASES[this.context.productId]||null:null;}
    productViewId() {return this.productAlias()?.productId||this.context.productId;}
    ysDigitalNative() {
      const native=this.catalogue?.products?.find(row=>row.productId===this.ysMod?.YS_DIGITAL_ID);
      const price=native?.discountedPrice??native?.price;
      return native&&native.inStock===true&&Number.isFinite(price)&&price>=0?{native,price}:null;
    }
    // ---- Gift vouchers for the 1928 print (gift.js; 27 Oct 2026). Two ordinary Wix digital products, added through the same bridge "add" as any product. ----
    // Offers = the gifts the catalogue read really carries (a hidden or sold-out product is absent, so no entry and no button). The cart always uses them, the entry also needs the URL gate.
    giftOffersAll() {return this.gift&&this.presentation&&this.catalogue?this.gift.giftOffers(this.catalogue,this.presentation,money):[];}
    giftEntry() {
      if(!this.gift||this.context.mode!=='product'||!this.gift.giftGateOpen())return '';
      return this.gift.giftHtml(this.giftOffersAll(),{open:this.giftOpen,kind:this.giftKind,redirecting:this.cartRedirect==='gift'});
    }
    // Toggle and choice only touch the DOM (and remember the state for the next render), so focus and scroll stay where they are.
    giftClick(action,button) {
      const root=this.shadowRoot.querySelector('[data-ys-gift]');if(!root)return;
      if(action==='gift-toggle'){
        this.giftOpen=!this.giftOpen;
        root.querySelector('[data-action="gift-toggle"]').setAttribute('aria-expanded',String(!!this.giftOpen));
        const panel=root.querySelector('[data-ys-gift-panel]');panel.hidden=!this.giftOpen;
        if(this.giftOpen)try{panel.scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}catch{}
        return;
      }
      this.giftKind=button.dataset.giftKind;
      root.querySelectorAll('[role="radio"][data-gift-kind]').forEach(radio=>radio.setAttribute('aria-checked',String(radio.dataset.giftKind===this.giftKind)));
      const add=root.querySelector('[data-action="gift-add"]');if(add)add.dataset.giftKind=this.giftKind;
    }
    signalReady() {
      if(this.readySent||!this.model||!['shop','product','cart'].includes(this.context.mode))return;
      const stylesheet=this.shadowRoot.querySelector('link[rel=stylesheet]');if(stylesheet&&!stylesheet.sheet){stylesheet.addEventListener('load',()=>this.signalReady(),{once:true});return;}
      if(this.context.mode==='cart'&&!this.cart)return;
      if(this.context.mode==='product'&&!this.model.products.some(p=>p.wixProductId===this.productViewId())&&!this.productAlias()&&!this.unavailableProduct())return;
      this.readySent=true;this.dispatchEvent(new CustomEvent('shop-render-ready',{detail:{channel:CHANNEL},bubbles:true,composed:true}));
    }
    fail(message) {if(this.isConfiguredDigitalRoute()){this.showConfiguredFailure(message);return;}this.setAttribute('data-storefront-error',message||'SHOP_UNAVAILABLE');clearTimeout(this.watchdog);this.error=message||'SHOP_UNAVAILABLE';this.revealed=false;this.hidden=true;this.style.minHeight='';this.style.display='';this.appliedHeight=0;this.style.height='0px';this.sizeObserver?.disconnect();this.render();this.dispatchEvent(new CustomEvent('shop-render-failed',{detail:{channel:CHANNEL},bubbles:true,composed:true}));}
    productMedia(value) {return /^https:\/\//.test(value||'')?url(value):asset('assets/'+value);}
    image(product) {if(product.image)return this.productMedia(product.image);const native=product.source==='external'?'#':nativeImage(product.nativeImageUrl);return native&&native!=='#'?native:'';}
    tile(product) {
      const source=this.image(product);
      return `<a class="tile ${product.imageFit==='cover'?'cover':''} ${product.visualOverlay?'audio-device-card':''}" href="${esc(url(product.productUrl))}"><img class="tile-photo" src="${esc(source)}" alt="${esc(product.alt||product.name)}" loading="lazy">${product.visualOverlay?`<img class="audio-device-overlay" src="${esc(asset('assets/'+product.visualOverlay))}" alt="Illustrative phone and headphones" loading="lazy">`:''}</a>`;
    }
    action(product) {return product.action==='add'?`<button class="outline" data-action="add" data-product="${product.wixProductId}" ${this.busy||this.uncertain?'disabled':''}>Add to cart</button>`:`<a class="outline" href="${esc(url(product.productUrl))}">${esc(product.actionLabel)}</a>`;}
    card(product,feature=false) {return `<article class="${feature?'feature':'card'}" data-product="${product.id}">${this.tile(product)}<div class="${feature?'feature-copy':'card-copy'}"><span class="type">${esc(this.model.getTwin(product)?`${/calendar/i.test(product.name)?'CALENDAR':'POSTER'} · PRINTED OR AS A FILE`:product.typeLine)}</span><a class="product-name" href="${esc(url(product.productUrl))}">${esc(product.name)}</a>${feature?`<p>${esc(this.layer.cardSummary(product.cardSummary||product.description))}</p>`:''}<span class="place">${esc(product.place)}</span><div class="card-bottom"><span class="price">${esc(product.priceLabel)}</span>${this.action(product)}</div></div></article>`;}
    // Desktop dropdown under a store tab: its collections (Yusuf, 29 Oct 2026). Phones keep the chips on the category page.
    tabMenu(categoryId) {
      if(categoryId==='all')return '';
      const view=this.model.getCategoryView(categoryId),filters=(view?.filters||[]).filter(item=>item.count>0);
      if(!filters.length)return '';
      return `<div class="tab-menu">${[{id:'all',label:view.allFilterLabel},...filters].map(item=>`<a href="${esc(this.storeHref(categoryId,item.id))}" data-menu-category="${categoryId}" data-menu-filter="${item.id}">${esc(item.label)}</a>`).join('')}</div>`;
    }
    shopbar() {return `<aside class="shopbar"><div class="wrap shopbar-inner"><a class="shopbar-home" href="${esc(this.storeHref())}">${STORE_LOGO}</a><nav class="tabs" aria-label="Store categories">${this.model.tabs.map(tab=>{const link=`<a href="${esc(this.storeHref(tab.id))}" data-category="${tab.id}" ${this.context.mode==='shop'&&this.category===tab.id?'aria-current="page"':''}>${esc(tab.label)}</a>`,menu=this.tabMenu(tab.id);return menu?`<div class="tab-item">${link}${menu}</div>`:link;}).join('')}</nav><a class="cart-link" href="https://walkofberlin.com/cart-page">Cart (${this.cart?this.cart.count:'—'})</a></div></aside>`;}
    creditText() {const by='<a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a>';return `<p>Audio Trio card: photograph of Anhalter Bahnhof by Carlos Delgado / Wikimedia Commons, ${by}, cropped and resized (<a href="https://commons.wikimedia.org/wiki/File:Berlin_Anhalter_Bahnhof_-_01.jpg" target="_blank" rel="noopener noreferrer">original</a>). The phone and headphones are an AI-generated illustration layered over it, not a screenshot of the audio player.</p><p>Berlin Wall audio walk card: Bernauer Straße at Ackerstraße, 2024, by Traktorminze / Wikimedia Commons, ${by}, cropped (<a href="https://commons.wikimedia.org/wiki/File:Bernauer_Stra%C3%9Fe_Berlin_Ecke_Ackerstra%C3%9Fe_2024.jpg" target="_blank" rel="noopener noreferrer">original</a>). Medieval Berlin audio walk card: Marienkirche by Dosseman / Wikimedia Commons, ${by}, cropped (<a href="https://commons.wikimedia.org/wiki/File:Berlin_Marienkirche_Exterior_0326_02.jpg" target="_blank" rel="noopener noreferrer">original</a>). Third Reich audio walk card: Topography of Terror by Arild Vågen / Wikimedia Commons, <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 3.0</a>, cropped (<a href="https://commons.wikimedia.org/wiki/File:Topographie_des_Terrors_November_2013.jpg" target="_blank" rel="noopener noreferrer">original</a>). Hidden Berlin audio walk card: AI-generated image.</p>`;}
    // shop pages: a quiet footnote under the grid; product pages: a disclosure next to Delivery & returns
    credits() {
      const all=this.category==='all';
      const illustrated=all||['print','calendar'].includes(this.category);
      const aerial=all||this.category==='personalised';
      const audio=all||this.category==='audio';
      // Store isolation (Yusuf, 29 Oct 2026): the credits leave the page for a small "Image credits" item in the store footer, which the
      // site header's store mode draws from this global.
      window.__bwStoreCreditsHtml=`${illustrated?'<p>Poster illustrations created with AI assistance and refined for Walk of Berlin. Frames shown in mockups are not included. The voucher picture on the gift pages is an AI-generated scene with a real 1928 aerial photograph placed on the card.</p>':''}${aerial?'<p>1928 aerial photographs: Geoportal Berlin, <a href="https://www.govdata.de/dl-de/zero-2-0" target="_blank" rel="noopener">Datenlizenz Deutschland Zero 2.0</a>. Sample print pairs archive and present-day aerial views of the same Berlin location.</p>':''}${audio?this.creditText():''}`;
      return '';
    }
    lead() {return 'Berlin posters, personalised prints, audio walks and guides.';}
    shopTitle(selected,filter) {return filter?(filter.id==='sets'?filter.label:`${filter.label} posters`):selected?.title||this.lead();}
    landingView() {
      const page=this.landing,view=page.category?this.model.getCategoryView(page.category,'all'):null;
      const products=page.productIds?page.productIds.map(id=>this.model.products.find(product=>product.wixProductId===id)).filter(Boolean):view?.products||[];
      const cards=products.map(product=>this.card({...product,cardSummary:this.layer.cardSummary(product.cardSummary||product.description),imageFit:product.imageFit||view?.imageFit||'contain'}));
      if(page.voucher)cards.splice(page.voucher.after,0,this.gift?.giftCardHtml?.(this.giftOffersAll(),page.voucher,{assetUrl:asset,printUrl:url(this.navigation.STORE_PERSONALISED_PRODUCT),redirecting:this.cartRedirect==='gift'})||'');
      return `<section class="wrap intro" lang="${esc(page.lang||'de')}"><h1 class="lead">${esc(page.title)}</h1><p>${esc(page.text)}</p></section><section class="wrap shelf"><div class="grid category-grid">${cards.join('')}</div></section>`;
    }
    shop() {
      if(this.routeError)return `<section class="wrap intro"><h1 class="lead">This collection is not available.</h1><p><a href="${esc(this.storeHref())}">Browse all products</a></p></section>`;
      if(this.landing)return this.landingView();
      const selected=this.category==='all'?null:this.model.getCategoryView(this.category,this.filter);
      const filter=selected?.filters.find(item=>item.id===this.filter);
      const title=this.shopTitle(selected,filter);
      return `<section class="wrap intro"><h1 class="lead">${esc(title)}</h1>${!selected?`<p class="gift-entry"><a href="https://walkofberlin.com/category/berlin-christmas-gifts">Looking for a Christmas gift? Start here.</a></p>`:''}${selected?.filters.length?`<nav class="chips" aria-label="Collections"><a href="${esc(this.storeHref(this.category))}" data-filter="all" ${this.filter==='all'?'aria-current="page"':''}>${esc(selected.allFilterLabel)}</a>${selected.filters.map(item=>`<a href="${esc(this.storeHref(this.category,item.id))}" data-filter="${item.id}" ${item.id===this.filter?'aria-current="page"':''}>${esc(item.label)} <span class="collection-count">(${item.count})</span></a>`).join('')}</nav>`:''}</section>${(selected?[selected]:this.model.sections).map(section=>`<section class="wrap shelf"><div class="section-head"><div class="section-title"><h2>${esc(selected?`${section.totalCount} available`:section.title)}</h2><span class="meta">${esc(section.description)}</span></div>${section.browseHref?`<a href="${esc(section.browseHref)}">${esc(section.browseLabel)} →</a>`:section.moreCategoryId?`<a href="${esc(this.storeHref(section.moreCategoryId))}" data-category="${section.moreCategoryId}">${esc(section.moreLabel)} →</a>`:''}</div>${section.products.length?`<div class="${section.layout==='feature'?'feature-grid':'grid'}${selected?' category-grid':''}">${section.products.map(product=>this.card({...product,cardSummary:this.layer.cardSummary(section.featureDescription||product.cardSummary||product.description),imageFit:product.imageFit||section.imageFit},section.layout==='feature')).join('')}</div>`:'<p>No items are available in this collection right now.</p>'}</section>`).join('')}${this.credits()}`;
    }
    quantityControl(value,id='',product=false) {return `<div class="qty"><button data-action="${product?'product-minus':'minus'}" data-line="${esc(id)}" aria-label="Decrease quantity" ${value<=1||this.busy||this.uncertain?'disabled':''}>−</button><output>${value}</output><button data-action="${product?'product-plus':'plus'}" data-line="${esc(id)}" aria-label="Increase quantity" ${value>=99||this.busy||this.uncertain?'disabled':''}>+</button></div>`;}
    storyReel(slug) {
      const reel=STORY_REELS[slug];if(!reel)return '';
      return `<figure class="story-reel"><video controls preload="none" playsinline poster="${esc(asset('assets/story/'+reel.file+'-poster.jpg'))}" aria-label="${esc(reel.label)}: my Walk of Berlin reel about this place"><source src="${esc(asset('assets/story/'+reel.file+'.mp4'))}" type="video/mp4"></video><figcaption>Watch the story (${esc(reel.length)}, sound on). ${esc(reel.ai)} <a href="https://walkofberlin.com/sources?post=${esc(reel.credits)}" target="_blank" rel="noopener">Image credits &amp; licences</a></figcaption></figure>`;
    }
    roomVideo(product) {
      const slug=roomSlug(product),still=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      return `<video class="room${product.roomVideoFit==='contain'?' contain':''}" src="${esc(product.roomVideoUrl?url(product.roomVideoUrl):asset('assets/room/'+slug+'.mp4'))}" poster="${esc(product.roomVideoPosterUrl?url(product.roomVideoPosterUrl):asset('assets/room/'+slug+'-poster.jpg'))}" ${still?'controls':'autoplay loop'} muted playsinline preload="metadata" aria-label="${esc(ROOM_VIDEOS[slug])} in a living room. Styling example, frame not included."></video>`;
    }

    posterPack(product,native) {
      if(!native?.posterOptions||!native.requiresOptions)return null;
      const rows=(native.variants||[]).filter(row=>row.visible===true&&row.choices&&Number.isFinite(row.price));
      const keys=['Size','Paper'].filter(key=>rows.some(row=>Object.hasOwn(row.choices,key)));
      this.posterChoices=this.posterChoices||{};
      let choices=this.posterChoices[product.wixProductId];
      if(!choices){
        // A Google listing links with ?paper= so the page opens on the paper and price the listing showed (30 Oct 2026).
        const wanted=new URLSearchParams(location.search).get('paper');
        const linked=wanted&&rows.find(row=>row.inStock&&/30\s*x\s*40/i.test(row.choices.Size||'')&&row.choices.Paper===wanted);
        const first=linked||rows.find(row=>row.inStock&&/30\s*x\s*40/i.test(row.choices.Size||'')&&(!row.choices.Paper||row.choices.Paper==='Premium Matte'))||rows.find(row=>row.inStock)||rows[0];
        choices=first?{...first.choices}:{};
        this.posterChoices[product.wixProductId]=choices;
      }
      const selected=rows.find(row=>keys.every(key=>row.choices[key]===choices[key]));
      return {rows,keys,choices,selected,canAdd:!!selected&&selected.inStock===true};
    }
    posterOptions(product,pack) {
      if(!pack)return '';
      return `<div class="poster-options">${pack.keys.map(key=>{
        const values=[...new Set(pack.rows.map(row=>row.choices[key]))];
        return `<label>${esc(key)}<select data-poster-option="${esc(key)}" data-poster-product="${esc(product.wixProductId)}" ${this.busy?'disabled':''}>${values.map(value=>{
          const available=pack.rows.some(row=>row.inStock&&row.choices[key]===value&&(key==='Size'||pack.keys.filter(other=>other!==key).every(other=>row.choices[other]===pack.choices[other])));
          return `<option value="${esc(value)}" ${pack.choices[key]===value?'selected':''} ${available?'':'disabled'}>${esc(value)}</option>`;
        }).join('')}</select></label>`;
      }).join('')}</div>`;
    }
    changePosterOption(field) {
      const product=this.model.products.find(p=>p.wixProductId===field.dataset.posterProduct);
      const native=this.catalogue.products.find(p=>p.productId===field.dataset.posterProduct);
      if(!product)return;
      const pack=this.posterPack(product,native),key=field.dataset.posterOption;
      if(!pack||!pack.keys.includes(key))return;
      const next={...pack.choices,[key]:field.value};
      const exact=pack.rows.find(row=>row.inStock&&pack.keys.every(k=>row.choices[k]===next[k]));
      const fallback=pack.rows.find(row=>row.inStock&&row.choices[key]===field.value);
      if(!exact&&!fallback)return;
      this.posterChoices[product.wixProductId]={...(exact||fallback).choices};
      if(product.wixProductId==='52d20d32-021d-4024-875c-440d29784322')this.berolinaOptionsOpen=!!field.closest('[data-berolina-options]')?.open;
      this.render();
      this.shadowRoot.querySelector(`[data-poster-option="${key}"]`)?.focus({preventScroll:true});
    }

    // Print and file are separate Wix products; the switch joins them on one page (posters merged, 29 Oct 2026).
    alternativeFormat(product) {
      const twin=this.model.getTwin(product);
      if(!twin)return '';
      const print=isDigital(product)?twin:product,file=isDigital(product)?product:twin;
      const option=(item,label,note)=>item===product?`<span class="format-option" aria-current="true"><strong>${label}</strong><span>${esc(note)}</span><span class="format-price">${esc(item.priceLabel)}</span></span>`:`<a class="format-option" href="${esc(url(item.productUrl))}"><strong>${label}</strong><span>${esc(note)}</span><span class="format-price">${esc(item.priceLabel)}</span></a>`;
      return `<div class="format-switch" role="group" aria-label="Format">${option(print,'Printed poster','Printed to order and shipped')}${option(file,'Digital file','Download it and print it yourself')}</div>`;
    }
    product() {
      const alias=this.productAlias(),product=this.model.products.find(p=>p.wixProductId===this.productViewId())||(!alias?this.unavailableProduct():null);
      if(alias&&(!product||!this.ysMod||!this.ysDigitalNative()))return this.configuredUnavailableBody();
      if(!product)return '';
      const native=this.catalogue.products.find(p=>p.productId===product.wixProductId);
      if(this.ysMod&&!product.unavailable&&product.wixProductId===this.ysMod.YS_PRODUCT_ID)return this.ysProduct(product,native);
      const pack=product.unavailable?null:this.posterPack(product,native);
      const lifestyle=product.roomImage&&this.view==='room';const extra=/^g\d+$/.test(this.view||'')?product.gallery?.[+this.view.slice(1)]||null:null;
      const room=roomSlug(product),view=room&&(this.view!=='wall'||product.id==='bu')?this.view:'poster',wall=view==='wall',video=view==='video',digital=isDigital(product);
      const posterImage=product.sizeImages?.[pack?.choices?.Size]?this.productMedia(product.sizeImages[pack.choices.Size]):this.image(product);
      const roomAlt=product.roomAlt||'AI room visualization. Frame, furniture and decor not included.';
      const roomCaption=product.roomCaption||'AI room visualization · Frame and decor not included';
      const originalDescription=native?.description||product.description;
      const berolina=product.wixProductId==='52d20d32-021d-4024-875c-440d29784322';
      const parts=splitStory(originalDescription);
      // Berolina's native description has several unheaded paragraphs. Keep the
      // first as the story and place the remaining product facts in a closed row.
      if(berolina&&!parts.sections.length){
        const doc=new DOMParser().parseFromString('<body>'+parts.intro+'</body>','text/html');
        const paragraphs=[...doc.body.children];
        if(paragraphs.length>1){parts.intro=paragraphs[0].outerHTML;parts.sections.push({title:'Print details',html:paragraphs.slice(1).map(node=>node.outerHTML).join('')});}
      }
      const berolinaOptions=berolina&&pack?`<details class="ys-options" data-berolina-options ${this.berolinaOptionsOpen?'open':''}><summary>Size and paper <span class="ys-options-v">${esc(pack.selected?.choices?.Size||'')} · Premium Matte · ${esc(pack.selected?.formattedPrice||money(product.currency,pack.selected?.price))}</span></summary><div class="ys-options-body">${this.posterOptions(product,pack)}</div></details>`:'';
      const berolinaTrust=berolina?`<ul class="ys-trust" aria-label="Print details"><li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h8l4 4v14H6zM14 3v4h4"/></svg><span>Printed to order on 200 gsm premium matte paper</span></li><li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3h16v18H4zM7 6h10v12H7z"/></svg><span>Unframed · 30 × 40 cm or 50 × 70 cm</span></li><li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 6h11v9H2zM13 9h4l3 3v3h-7zM6 18.5a1.5 1.5 0 1 0 0-.01M17 18.5a1.5 1.5 0 1 0 0-.01"/></svg><span>Delivery estimates are shown at checkout</span></li></ul><div class="ys-pay"><span>Secure card checkout</span>${cardChips()}</div><div class="ys-maker"><img src="${esc(asset('assets/yusuf-maker.jpg'))}" alt="Yusuf, the guide behind Walk of Berlin" width="56" height="56" loading="lazy"><p>I'm Yusuf, the guide behind Walk of Berlin. <a href="https://walkofberlin.com/reviews" target="_blank" rel="noopener">What my guests say</a></p></div>`:'';
      const berolinaFaq=berolina?`<section class="ys-faq"><h2>Questions</h2><details><summary>What sizes and paper are available?</summary><div class="details-body"><p>Choose 30 × 40 cm or 50 × 70 cm. Both are printed on 200 gsm premium matte paper. The 50 × 70 cm version has white margins above and below the complete artwork.</p></div></details><details><summary>Is a frame included?</summary><div class="details-body"><p>No, the print is unframed. The room images and video are 3D styling examples; furniture and decor are not included.</p></div></details><details><summary>Can I print it myself?</summary><div class="details-body"><p>This is a physical print. A separate printable download is also available.</p></div></details><p class="ys-contact">Something else? Write to <a href="mailto:info@walkofberlin.com">info@walkofberlin.com</a>.</p></section>`:'';
      // "Printing and delivery" replaces the generic delivery paragraph; a digital "How it works" repeats the download note, so it is not shown twice.
      const deliverySection=digital?null:parts.sections.find(section=>/^printing and delivery$/i.test(section.title));
      const storySections=parts.sections.filter(section=>section!==deliverySection&&!(digital&&/^how it works$/i.test(section.title)));
      const infoSections=(product.nativeAdditionalInfo||[]).filter(info=>!product.visualCreditsHtml||!/^(?:Artwork and image sources|Image credits)$/i.test(info.title||''));
      const visualCredits=product.visualCreditsHtml?safeHtml(product.visualCreditsHtml):product.group==='everyday'?'<p>The artwork was created with AI assistance and enlarged using Adobe Firefly. Room images are AI visualizations; frames, furniture and decor are not included.</p>':'';
      const artworkReuse=this.artworkReuseLicence(product.wixProductId);
      window.__bwStoreCreditsHtml='';
      return `<div class="wrap"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="https://walkofberlin.com/category/all-products">Store</a> / ${esc(product.name)}</nav><section class="product-layout"><div class="product-title"><h1>${esc(product.name)}</h1><span class="place">${esc(product.place)}</span><span class="price">${esc(pack?.selected?(pack.selected.formattedPrice||money(product.currency,pack.selected.price)):product.priceLabel)}</span></div><div class="gallery"><div class="gallery-stage">${video?this.roomVideo(product)+(product.roomCaption?`<p class="gallery-caption">${esc(roomCaption)}</p>`:''):extra?`<img class="extra" src="${esc(this.productMedia(extra.image))}" alt="${esc(extra.alt||product.alt)}">`:`<img class="${wall?'wall':''}" src="${esc(lifestyle?this.productMedia(product.roomImage):wall?asset('assets/berlin-uhr-wall.jpg'):posterImage)}" alt="${esc(lifestyle||wall?roomAlt:product.alt)}">${lifestyle||wall?`<p class="gallery-caption">${esc(roomCaption)}</p>`:''}`}</div><div class="thumbnails"><button class="thumb" data-action="poster" aria-label="${digital?'Show the preview':'Show the poster'}" aria-pressed="${view==='poster'&&!lifestyle&&!extra}"><img src="${esc(posterImage)}" alt=""></button>${product.roomImage?`<button class="thumb" data-action="room" aria-label="Show it in a room" aria-pressed="${!!lifestyle}"><img src="${esc(this.productMedia(product.roomImage))}" alt=""></button>`:''}${room?`<button class="thumb play" data-action="video" aria-label="Play the room video" aria-pressed="${video}"><img src="${esc(product.roomVideoThumbnailUrl?url(product.roomVideoThumbnailUrl):asset('assets/room/'+room+'-thumb.jpg'))}" alt=""><span class="play-badge" aria-hidden="true"></span></button>`:''}${(product.gallery||[]).map((g,i)=>`<button class="thumb" data-action="g${i}" aria-label="Show image ${i+2}" aria-pressed="${extra===g}"><img src="${esc(this.productMedia(g.image))}" alt=""></button>`).join('')}${product.id==='bu'?`<button class="thumb" data-action="wall" aria-label="Show it on a wall" aria-pressed="${wall}"><img src="${esc(asset('assets/berlin-uhr-wall.jpg'))}" alt=""></button>`:''}</div></div><div class="buy-box">${this.alternativeFormat(product)}<p class="spec">${esc(pack?.selected?.choices?.Paper ? pack.selected.choices.Paper+' · '+pack.selected.choices.Size+' · Unframed' : product.typeLine)}</p>${berolina&&pack?berolinaOptions:this.posterOptions(product,pack)}<div class="buy-row ${digital||product.unavailable?'no-qty':''}">${digital||product.unavailable?'':this.quantityControl(this.quantity,'',true)}${product.unavailable?'<button class="primary" type="button" disabled>Out of stock</button>':pack?`<button class="primary" data-action="poster-add" data-product="${product.wixProductId}" ${!pack.canAdd||this.busy||this.uncertain?'disabled':''}>Add to cart</button>`:product.action==='add'?`<button class="primary" data-action="add" data-product="${product.wixProductId}" data-quantity="${digital?1:this.quantity}" ${this.busy||this.uncertain?'disabled':''}>Add to cart</button>`:this.action(product)}</div><p class="delivery">${digital?esc(product.deliveryNote||DIGITAL_NOTE):product.group==='everyday'?'Printed to order by Gelato. Shipping within Germany is included. Frame not included.':'Printed to order by Gelato. Delivery estimates are shown at checkout.'+(/CALENDAR/.test(product.typeLine||'')?'':' Frame not included.')}</p>${berolinaTrust}</div><div class="product-info"><section class="story ${STORY_REELS[room]?'has-reel':''}"><h2>${digital?'About this download':'The story behind this print'}</h2>${this.storyReel(room)}<div>${parts.intro}</div></section>${product.id==='bu'?this.editorial.clockBox()+this.editorial.locationCard(product):''}${berolinaFaq}<section class="disclosures">${storySections.map(section=>`<details><summary>${esc(section.title)}</summary><div class="details-body">${section.html}</div></details>`).join('')}${infoSections.map(info=>`<details><summary>${esc(info.title)}</summary><div class="details-body">${safeHtml(info.description)}</div></details>`).join('')}${artworkReuse?`<details data-artwork-reuse-licence="CC-BY-SA-4.0"><summary>Artwork reuse licence</summary><div class="details-body">${artworkReuse}</div></details>`:''}<details class="delivery-returns"><summary>${digital?'Download &amp; returns':'Delivery &amp; returns'}</summary><div class="details-body">${digital?`<p>${esc(product.deliveryDetails||DIGITAL_DETAILS)}</p>`:`${deliverySection?deliverySection.html:'<p>Printed to order by Gelato.</p>'}<p>Delivery estimates are shown in checkout; the Store Terms and the Withdrawal notices are linked on this page.</p>`}${digital?'':this.guaranteeNotice()}</div></details>${visualCredits?`<details${product.visualCreditsWrap===true?' class="source-credits"':''}><summary>Image credits</summary><div class="details-body">${visualCredits}</div></details>`:''}</section></div></section>${berolina?'':`<section class="more"><h2>More from the shop</h2><div class="grid category-grid">${[...this.related(product),...this.model.products.filter(p=>p.action==='external').slice(0,1)].map(p=>this.card(p)).join('')}</div></section>`}${berolina?`<details class="legal-foot"><summary>Withdrawal notice, terms and legal information</summary><div class="legal-foot-body"><p class="guarantee-line">Damaged or misprinted? You’re covered by EU consumer law. <button type="button" class="link" data-action="show-guarantee">See the official notice</button></p>${this.legalLinks()}${this.withdrawButton()}</div></details>`:`<section class="legal-foot">${digital?'':'<p class="guarantee-line">Damaged or misprinted? You’re covered by EU consumer law. <button type="button" class="link" data-action="show-guarantee">See the official notice</button></p>'}${this.legalLinks()}${this.withdrawButton()}</section>`}</div>`;
    }
    // "Your Berlin Street in 1928": personalised aerial print. The configurator lives in street-configurator.js; state survives re-renders in this.ys.
    ysProduct(product,native) {
      const story=product.storyHtml||native?.description||product.description;
      const digital=this.ys?this.ysMod.ysDigital(this.ys):this.productAlias()?.format==='digital',digitalNative=this.ysDigitalNative();
      const selectedPrice=digital&&digitalNative?(digitalNative.native.formattedDiscountedPrice||digitalNative.native.formattedPrice||money(digitalNative.native.currency,digitalNative.price)):product.priceLabel;
      const digitalStory=product.storyHtmlDigital||digitalNative?.native.description||'<p>Made from your spot and sent by email within 24 hours. Nothing is shipped.</p>';
      return `<div class="wrap ys-wrap"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="https://walkofberlin.com/category/all-products">Store</a> / ${esc(product.name)}</nav><section class="product-layout ys-layout" data-ys-host><div class="product-title"><h1>${esc(product.name)}</h1><span class="place">${esc(product.place)}</span><span class="price">${esc(selectedPrice)}</span><p class="ys-lead">A personalised print of your Berlin street.</p></div><div class="ys-search-slot" data-ys-slot="search"></div><div class="gallery ys-gallery" data-ys-slot="visual"></div><div class="buy-box ys-buy"><p class="spec">${esc(product.typeLine)}</p><div data-ys-slot="form"></div><p class="ys-why" data-ys-why role="status"></p><div class="buy-row no-qty"><button class="primary" data-action="ys-add" data-ys-add disabled>Add to cart</button></div>${this.ysMod.trustHtml?.()||''}${this.giftEntry()}<div class="ys-pay"><span>Secure card checkout</span>${cardChips()}</div><p class="delivery">Arrives in 3 to 5 working days in Germany, 4 to 9 elsewhere. Frame not included.</p><p class="ys-legalline" data-ys-legal="poster">${YS_LEGALLINE.poster} <button type="button" class="link" data-action="show-legal" aria-label="Withdrawal notice and terms">Terms</button></p><p class="ys-legalline" data-ys-legal="digital" hidden>${YS_LEGALLINE.digital} <button type="button" class="link" data-action="show-legal" aria-label="Withdrawal notice and terms">Terms</button></p><div class="ys-maker"><img src="${esc(asset('assets/yusuf-maker.jpg'))}" alt="Yusuf, the guide behind Walk of Berlin, at the Humboldt Forum" width="56" height="56" loading="lazy"><p>Made by me, Yusuf, from Berlin's own aerial photos. <a href="https://walkofberlin.com/reviews" target="_blank" rel="noopener">What my guests say</a></p></div></div><div class="product-info"><section class="story" data-ys-legal="poster" ${digital?'hidden':''}><h2>The story behind this print</h2><div>${safeHtml(story)}</div></section><section class="story" data-ys-legal="digital" ${digital?'':'hidden'}><h2>About this digital file</h2><div>${safeHtml(digitalStory)}</div></section><section class="ys-faq"><h2>Questions</h2>${YS_FAQ.map(([q,a])=>`<details><summary>${esc(q)}</summary><div class="details-body"><p>${esc(a)}</p></div></details>`).join('')}<p class="ys-contact">Something else? Write to <a href="mailto:info@walkofberlin.com">info@walkofberlin.com</a>. I reply within a day.</p></section><section class="disclosures"><details class="delivery-returns"><summary>Delivery &amp; returns</summary><div class="details-body"><p>Printed poster: made to order from your address and printed for you. Free delivery to Germany (usually 3 to 5 working days), most of the EU, the United Kingdom and the United States (4 to 7), and Bulgaria, Estonia, Finland, Greece, Ireland, Latvia, Lithuania, Portugal and Romania (6 to 9).</p><p>Digital file: made from your spot and sent by email within 24 hours, nothing is shipped.</p><p>The Store Terms and the Withdrawal notices are linked on this page.</p>${this.guaranteeNotice()}</div></details><p class="ys-attr">Address search by <a href="https://photon.komoot.io" target="_blank" rel="noopener noreferrer">Photon</a> and <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap contributors</a>. Aerial photographs: Geoportal Berlin, dl-de/zero-2.0.</p></section></div></section><details class="legal-foot" data-ys-legalfoot><summary>Withdrawal notice, terms and legal information</summary><div class="legal-foot-body"><div class="line-legal" data-line-legal="personalised" data-ys-legal="poster"><strong>Personalised physical product</strong>${NOTICE_PERSONALISED.map(t=>`<p>${esc(t)}</p>`).join('')}</div><div class="line-legal" data-line-legal="digital" data-ys-legal="digital" hidden><strong>Personalised digital file</strong><p>${esc(NOTICE_YS_DIGITAL)}</p></div><p class="guarantee-line">Damaged or misprinted? You’re covered by EU consumer law. <button type="button" class="link" data-action="show-guarantee">See the official notice</button></p>${this.legalLinks()}${this.withdrawButton()}</div></details></div>`;
    }
    // After "Yes, add to cart" on the 1928 page the customer goes straight to the cart page (27 Oct 2026, Yusuf: the side cart and the cart page asked for the same step twice).
    // The cart page is where the delivery country and postal code are entered and the quote is made, which the native checkout call needs (the bridge refuses a checkout
    // without a READY quote), so there is no safe shortcut past it. The funnel count for the add has already fired. If the add result is uncertain, or the page does not
    // navigate within 4 s, the side cart opens as before.
    afterYsAdd(gift=false) {
      const openDrawer=()=>{const dialog=this.shadowRoot.querySelector('dialog');if(this.revealed&&dialog&&!dialog.open){dialog.showModal();dialog.querySelector('[data-action="close-drawer"]')?.focus();}};
      if(!this.revealed||this.uncertain||this.error){openDrawer();return;}
      this.cartRedirect=gift?'gift':true;if(gift)this.render();else this.mountYs();
      clearTimeout(this.cartRedirectTimer);
      this.cartRedirectTimer=setTimeout(()=>{try{location.assign('https://walkofberlin.com/cart-page');}catch(e){}},300);
      setTimeout(()=>{if(!this.isConnected||!this.cartRedirect)return;this.cartRedirect=false;this.render();openDrawer();},4500);
    }
    // Funnel measurement (funnel.js); a failure there never touches the shop.
    measure(name,...args){try{this.funnel?.[name]?.(...args);}catch(e){}}
    mountYs() {
      const host=this.shadowRoot.querySelector('[data-ys-host]');if(!host||!this.ysMod)return;
      this.ys=this.ys||{};if(this.ysEntryProductId!==this.context.productId){this.ysEntryProductId=this.context.productId;this.ys.format=this.productAlias()?.format||'poster';}this.ysApi=this.ysApi||{sample:asset('assets/ys-sample.jpg'),busy:()=>this.busy||this.uncertain,track:step=>{try{this.funnel?.ysStep(step);}catch(e){}}};
      this.ysApi.variants=!!this.catalogue?.products?.find(row=>row.productId===this.ysMod.YS_PRODUCT_ID)?.requiresOptions;
      const digital=this.ysDigitalNative();this.ysApi.digital=!!digital;this.ysApi.digitalPrice=digital?.price??null;
      this.ysMod.mountConfigurator(host,this.ys,this.ysApi);
      if(this.cartRedirect===true)queueMicrotask(()=>{host.querySelectorAll('[data-ys-add],[data-ys-quickadd]').forEach(b=>{b.textContent='Added. Opening your cart…';b.disabled=true;});});
    }
    // "More from the shop": same group first, then same kind (digital or print), then the rest; the original order is kept inside each rank.
    related(product) {
      const kind=item=>isDigital(item)?'digital':'print',rank=item=>product.group&&item.group===product.group?0:kind(item)===kind(product)?1:2;
      return this.model.products.map((item,index)=>({item,index})).filter(({item})=>item.id!==product.id&&item.fulfilment.cartEligible).sort((a,b)=>rank(a.item)-rank(b.item)||a.index-b.index).slice(0,2).map(({item})=>item);
    }
    // Cart line values, as the customer should read them. DISPLAY ONLY: line.customText (and what is sent to Wix) is never changed, because the fulfilment script parses
    // "Map point <lat>, <lon> // Title: <T> | Area: <A> // Ref: <r> // Line: <L>" from it. The map point is shown as the rounded coordinates the print carries; the ad Ref stays internal.
    // Anything that does not look like that format is shown as before, field by field.
    lineCustom(line) {
      const fields=line.customText||[],raw=item=>`<p class="meta line-custom"><strong>${esc(item.title)}:</strong> ${esc(item.value)}</p>`;
      const details=fields.find(f=>f.title==='Print details (set by the map)'),address=fields.find(f=>f.title==='Address or place in Berlin');
      const m=details&&/^Map point (-?\d+(?:\.\d+)?), (-?\d+(?:\.\d+)?) \/\/ Title: (.*?) \| Area: (.*?)(?: \/\/ Ref: .*?)?(?: \/\/ Line: (.*))?$/.exec(String(details.value));
      if(!m)return fields.map(raw).join('');
      const lat=Number(m[1]),lon=Number(m[2]),coords=this.ysMod?.coordsText?.(lat,lon)||`${lat.toFixed(4)}° N, ${lon.toFixed(4)}° E`;
      const row=(label,value)=>`<p class="meta line-custom"><strong>${label}:</strong> ${esc(value)}</p>`;
      const place=[m[3].trim(),m[4].trim()].filter(Boolean).join(' · ');
      return (address?row('Your address',address.value):'')+row('On the print',`${place} · ${coords}`)+(m[5]?.trim()?row('Your line',m[5].trim()):'')+fields.filter(f=>f!==details&&f!==address).map(raw).join('');
    }
    lines() {
      // Gift vouchers (gift.js) form their own group, whatever Wix says about shipping: nothing is shipped, the code comes by email.
      const isGift=line=>!!this.gift?.isGiftId(line.productId),rest=this.cart.lines.filter(line=>!isGift(line)),offers=this.giftOffersAll();
      return [['Shipped to you',rest.filter(line=>line.shippable===true)],['Download',rest.filter(line=>line.shippable===false)],['Sent by email',this.cart.lines.filter(isGift)],['Delivery type to confirm',rest.filter(line=>line.shippable===null)]].filter(([,lines])=>lines.length).map(([label,lines])=>`<section class="cart-group"><h2>${label}</h2>${lines.map(line=>{const product=this.model.products.find(p=>p.wixProductId===line.productId),gift=isGift(line)?this.gift.giftLineInfo(line,offers,this.presentation,asset,nativeImage):null;return `<article class="cart-line"><div class="line-image">${gift?(gift.image?`<img src="${esc(gift.image)}" alt="Gift card">`:''):product?`<img src="${esc(this.image(product))}" alt="${esc(product.name)}">`:''}</div><div class="line-main"><h3>${esc(gift?gift.name:product?.name||line.name)}</h3><span class="meta">${esc(gift?gift.typeLine:product?.typeLine||line.itemType||'')}</span>${gift?`<p class="meta line-custom">${esc(gift.note)}</p>`:this.lineCustom(line)}${this.lineNotice(line)}<div class="line-bottom"><div class="line-controls">${line.editable?this.quantityControl(line.quantity,line.lineItemId):`<span>Quantity: ${line.quantity}</span>`}${line.editable?`<button class="text-button" data-action="remove" data-line="${esc(line.lineItemId)}" ${this.busy||this.uncertain?'disabled':''}>Remove</button>`:''}</div><strong class="price">${line.lineTotal?esc(textMoney(line.lineTotal)):`${esc(textMoney(line.unitPrice))} each`}</strong></div>${!line.editable?'<p class="meta">Manage this item in the original cart.</p>':''}</div></article>`;}).join('')}</section>`).join('');
    }
    // ---- Cart: address, automatic quote, delivery choice (Yusuf: fewer steps before checkout) ----
    quoteTimer=0;quoting=false;quoteError='';failedKey='';choiceList=null;lastReason='';
    digitalOnly() {return !!this.cart&&this.cart.count>0&&this.cart.hasShippableItems===false;}
    destinationInfo() {return DESTINATIONS.find(item=>item.code===this.destination.country)||null;}
    postalValue() {return String(this.destination.postalCode??'').trim();}
    postalOk() {const info=this.destinationInfo();return !!info&&info.pattern.test(this.postalValue());}
    destinationReady() {return !!this.cart&&this.cart.hasShippableItems!==null&&this.postalOk();}
    attemptKey() {return JSON.stringify([this.cart?.signature,this.destination.country,this.postalValue()]);}
    // Only the fields the bridge needs are sent; fields hidden from an earlier country never leak into the request.
    quoteInput() {return {expectedCartSignature:this.cart.signature,[this.cart.hasShippableItems?'destination':'billingDestination']:{country:this.destination.country,postalCode:this.postalValue()},...(this.selection?{selection:this.selection}:{})};}
    // A quote is wanted when the destination is complete, nothing is in flight or locked, no current quote exists and the same attempt has not just failed.
    autoQuoteWanted() {return this.context.mode==='cart'&&this.revealed&&this.cart?.count>0&&this.destinationReady()&&!this.busy&&!this.quoting&&!this.uncertain&&!this.quote&&this.failedKey!==this.attemptKey();}
    queueAutoQuote(immediate=false) {clearTimeout(this.quoteTimer);this.quoteTimer=0;if(!this.autoQuoteWanted())return;this.quoteTimer=setTimeout(()=>{this.quoteTimer=0;this.getQuote();},immediate?0:500);}
    quoteErrorMessage() {return ({INVALID_DESTINATION:'Check your postal code and try again.',BRIDGE_DISABLED:'The shop is temporarily unavailable.',CART_CHANGED:'Your cart changed. Check delivery again.'})[this.quoteError]||(this.digitalOnly()?'Tax could not be checked for this country.':'Delivery could not be checked for this address.');}
    // Plain-words reason shown right above the checkout button while it is disabled. Empty string means checkout is ready.
    checkoutReason(wants,quote) {
      const cart=this.cart,country=this.destination.country;
      if(this.uncertain)return 'Refresh your cart to continue.';
      if(cart.hasShippableItems===null)return 'Open the original cart to continue.';
      if(country==='OTHER')return 'Continue in the original cart for this destination.';
      if(!country)return 'Add your country and postal code to continue.';
      if(!this.postalOk())return this.postalValue()?'Enter your full postal code to continue.':'Add your postal code to continue.';
      if(this.quoteError)return this.quoteError==='INVALID_DESTINATION'?'Check your postal code to continue.':'Delivery could not be checked.';
      if(this.quoting||wants)return this.digitalOnly()?'Checking tax…':'Checking delivery…';
      if(this.busy&&!quote)return 'Updating your cart…';
      if(quote?.state==='NO_SHIPPING_AVAILABLE')return 'No delivery method for this address.';
      if(quote?.state==='CHOOSE_SHIPPING')return 'Choose a delivery method to continue.';
      if(quote?.state==='READY')return '';
      return 'Check delivery to continue.';
    }
    // Everything below the address form: delivery choice, READY totals, problem notes and the checkout area. Re-rendered on its own so the address inputs keep focus while a quote loads.
    quoteArea() {
      const cart=this.cart,quote=this.quote&&this.quote.signature===cart.signature?this.quote:null,ready=quote?.state==='READY',wants=this.autoQuoteWanted(),working=this.busy||this.quoting;
      const choices=quote?.choices?.length?quote.choices:(working&&this.choiceList?.signature===cart.signature?this.choiceList.choices:[]);
      const picked=choice=>!!this.selection&&choice.carrierId===this.selection.carrierId&&choice.code===this.selection.code;
      const reason=this.checkoutReason(wants,quote);this.lastReason=reason;
      const idle=!quote&&!working&&!wants&&!this.quoteError&&!this.uncertain&&this.destinationReady();
      const showList=choices.length>1||(choices.length===1&&quote?.state==='CHOOSE_SHIPPING');
      const list=showList?`<div class="quote-choices" role="group" aria-label="Delivery method"><span>Delivery method</span>${choices.map((choice,index)=>`<button class="outline" type="button" data-action="shipping" data-index="${index}" aria-pressed="${picked(choice)}" ${working?'disabled':''}>${picked(choice)?'<span aria-hidden="true">✓</span> ':''}${esc(choice.title)}</button>`).join('')}</div>`:'';
      const method=!showList&&choices.length===1&&choices[0].title?`<span class="meta">${esc(choices[0].title)}</span>`:'';
      const totals=ready?`<div class="native-cart-bottom">${quote.shipping?`<div class="summary-row"><span>Delivery${method}</span><strong>${esc(textMoney(quote.shipping))}</strong></div>`:''}<div class="summary-row"><span>Tax</span><strong>${esc(textMoney(quote.tax))}</strong></div><div class="summary-row"><span>Estimated total</span><strong>${esc(textMoney(quote.total))}</strong></div></div>`:'';
      const note=this.quoteError?`<p class="shipping-note">${esc(this.quoteErrorMessage())}</p><div class="quote-actions"><button class="outline" type="button" data-action="retry-quote">Try again</button><button class="text-button" type="button" data-action="native-fallback">Open the original cart</button></div>`
        :quote?.state==='NO_SHIPPING_AVAILABLE'?'<p class="shipping-note">No delivery method was returned for this address. Check the postal code or open the original cart.</p><div class="quote-actions"><button class="text-button" type="button" data-action="native-fallback">Open the original cart</button></div>'
        :idle?`<div class="quote-actions"><button class="outline" type="button" data-action="retry-quote">${this.digitalOnly()?'Check tax':'Check delivery'}</button></div>`:'';
      return `${list}${totals}${note}<div class="checkout-area">${reason?`<p class="checkout-reason" id="checkout-reason">${esc(reason)}</p>`:''}<div class="legal-box"><p class="legal-ack">${esc(ACK)}</p>${this.legalLinks()}</div><button class="primary" data-action="checkout" ${reason?'aria-describedby="checkout-reason"':''} ${!ready||this.busy||this.quoting||this.uncertain?'disabled':''}>Continue to checkout</button><p class="checkout-note">${this.digitalOnly()?'Final tax is confirmed in checkout.':'Final delivery and tax are confirmed in checkout.'}</p><a href="https://walkofberlin.com/category/all-products">Continue shopping</a></div>`;
    }
    updateQuoteArea() {
      const area=this.shadowRoot.querySelector('.quote-area');if(!area||!this.cart)return;
      const focus=this.shadowRoot.activeElement,inside=focus&&area.contains(focus)?focus:null,action=inside?.dataset.action,index=inside?.dataset.index;
      area.innerHTML=this.quoteArea();
      if(action)area.querySelector(`[data-action="${action}"]${index!==undefined?`[data-index="${index}"]`:''}`)?.focus({preventScroll:true});
      const status=this.shadowRoot.querySelector('[data-quote-status]');if(status)status.textContent=this.lastReason||(this.digitalOnly()?'Tax checked. You can continue to checkout.':'Delivery confirmed. You can continue to checkout.');
      this.onCartViewport();this.queueAutoQuote();
    }
    // Country change: adapt the postal field in place (label, example, keyboard) instead of re-rendering, so browser autofill of country + postal code is never lost.
    refreshCartUi() {
      const form=this.shadowRoot.querySelector('[data-address-form]');
      if(form){
        const info=this.destinationInfo(),other=this.destination.country==='OTHER',field=form.querySelector('[name="postalCode"]'),note=form.querySelector('[data-other-note]');
        if(field){field.closest('label').hidden=other;const label=form.querySelector('[data-postal-label]');if(label)label.textContent=info?.postal||'Postal code';field.placeholder=info?.example||'';field.inputMode=info?.mode||'text';field.setAttribute('autocapitalize',info?.mode==='text'?'characters':'off');}
        if(note)note.hidden=!other;
      }
      this.updateQuoteArea();
    }
    addressForm() {
      const info=this.destinationInfo(),other=this.destination.country==='OTHER';
      return `<form data-address-form novalidate><p class="destination-label">${this.cart.hasShippableItems?'Delivery destination':'Billing destination for tax'}</p><div class="address-grid"><label>Country<select name="country" required><option value="">Choose a country</option>${DESTINATIONS.map(item=>`<option value="${item.code}" ${this.destination.country===item.code?'selected':''}>${item.label}</option>`).join('')}<option value="OTHER" ${other?'selected':''}>Another destination</option></select></label><label ${other?'hidden':''}><span data-postal-label>${esc(info?.postal||'Postal code')}</span><input name="postalCode" value="${esc(this.destination.postalCode||'')}" inputmode="${info?.mode||'text'}" autocomplete="postal-code" autocapitalize="${info?.mode==='text'?'characters':'off'}" enterkeyhint="done" maxlength="12" placeholder="${esc(info?.example||'')}"></label></div><p data-other-note ${other?'':'hidden'}>For another destination, <button class="text-button" data-action="native-fallback" type="button">continue in the original cart</button> to check the available delivery options.</p></form>`;
    }
    // ---- Legal surfaces ----
    legalLinks() {return `<p class="legal-links"><a href="${LEGAL.terms}" target="_blank" rel="noopener">Store Terms</a><a href="${LEGAL.withdrawalNotice}" target="_blank" rel="noopener">Withdrawal notices and model form</a></p>`;}
    withdrawButton() {return `<p class="withdraw-row"><a class="outline withdraw-link" data-withdraw href="${LEGAL.withdraw}" target="_blank" rel="noopener">Withdraw from contract (Vertrag widerrufen)</a></p>`;}
    guaranteeNotice() {return `<section class="eu-guarantee" aria-labelledby="eu-guarantee-title"><h3 id="eu-guarantee-title">EU legal guarantee notice</h3><a href="${esc(asset(LEGAL.guaranteeImage))}" target="_blank" rel="noopener"><img src="${esc(asset(LEGAL.guaranteeImage))}" alt="${esc(GUARANTEE_ALT)}" width="884" height="1200" loading="lazy"></a><p class="meta">Official notice under Regulation (EU) 2025/1960, Annex I. <a href="${LEGAL.guaranteeInfo}" target="_blank" rel="noopener">More about legal guarantees</a></p></section>`;}
    // The native ID comes from trusted catalogue metadata, never the title, URL or cart line.
    artworkReuseLicence(productId) {
      if(typeof productId!=='string'||!productId)return '';
      const rows=(this.presentation||[]).filter(row=>row.wixProductId===productId);
      const family=(this.presentation||[]).filter(row=>row.id==='dl-kottbusser-tor');
      const bindings=(this.bindings||[]).filter(row=>row.wixProductId===productId);
      return rows.length===1&&family.length===1&&rows[0]===family[0]&&rows[0].enabled!==false&&rows[0].kind==='digital'&&rows[0].artworkReuseLicence==='kottbusser-tor-cc-by-sa-4.0-v3'&&bindings.length===1&&bindings[0].nativeProductType==='digital'?KOTTI_ARTWORK_REUSE:'';
    }
    lineNotice(line) {
      if(this.gift?.isGiftId(line.productId))return `<div class="line-legal" data-line-legal="gift"><strong>Digital gift voucher</strong><p>${esc(NOTICE_GIFT)}</p></div>`;
      if(line.productId==='9b6fbecf-32e4-27dc-f3e6-9c887fe7f495')return `<div class="line-legal" data-line-legal="digital"><strong>Personalised digital file</strong><p>${esc(NOTICE_YS_DIGITAL)}</p></div>`;
      if(line.productId===YS_ID||(line.customText||[]).some(field=>!['Size','Paper'].includes(field.title)))return `<div class="line-legal" data-line-legal="personalised"><strong>Personalised physical product</strong><p>${esc(NOTICE_PERSONALISED_SHORT)}</p><details class="line-legal-more"><summary>Details</summary>${NOTICE_PERSONALISED.map(t=>`<p>${esc(t)}</p>`).join('')}</details></div>`;
      const reuse=line.shippable===false?this.artworkReuseLicence(line.productId):'';
      if(reuse)return `<div class="line-legal" data-line-legal="digital" data-artwork-reuse-licence="CC-BY-SA-4.0"><strong>Printable digital product</strong><p>${esc(NOTICE_DIGITAL_CC_BY_SA)}</p>${reuse}</div>`;
      if(line.shippable===false)return `<div class="line-legal" data-line-legal="digital"><strong>Printable digital product</strong><p>${esc(NOTICE_DIGITAL)}</p></div>`;
      return '';
    }
    cartPage() {
      if(!this.cart)return `<section class="wrap empty"><h1>Your cart could not be read.</h1><p>The original cart remains available.</p><button class="primary" data-action="native-fallback">Open original cart</button></section>`;
      if(!this.cart.count)return `<section class="wrap empty"><h1>Your cart is empty.</h1><p>Explore Berlin prints, or listen to a city walk.</p><a class="primary" href="https://walkofberlin.com/category/all-products">Browse the shop</a><div class="grid">${this.model.products.filter(p=>p.fulfilment.cartEligible).slice(0,3).map(p=>this.card(p)).join('')}</div></section>`;
      const form=this.cart.hasShippableItems===null?'<p>Delivery requirements have not been confirmed. Continue in the original cart.</p><button class="outline" data-action="native-fallback">Open original cart</button>':this.addressForm();
      return `<section class="wrap cart-page cart-mode"><h1>Your cart <span class="meta">(${this.cart.count} ${this.cart.count===1?'item':'items'})</span></h1><div class="cart-layout"><div>${this.lines()}<details class="promo"><summary>Promo code</summary><div class="details-body">You can enter a promo code in checkout.</div></details></div><aside class="order-summary"><h2>Order summary</h2><div class="summary-row"><span>Subtotal</span><strong>${esc(textMoney(this.cart.subtotal))}</strong></div>${form}<p class="sr-only" role="status" aria-live="polite" data-quote-status></p><div class="quote-area">${this.quoteArea()}</div>${this.withdrawButton()}</aside></div></section>`;
    }
    // ---- Loading skeleton ----
    // Drawn from the element's own static files only (stylesheet, data/*.json, assets/*), so it appears as soon as they are loaded and before the page-code bridge answers. It shows the shop bar, headings, names, places and bundled poster images, never a price, stock state, link or working button. It uses the same classes and container widths as the real surface and is removed in the same render that reveals the real surface (render-state, native widget collapsed), so the layout hardly moves.
    ensureLink() {let link=this.shadowRoot.querySelector('link[rel=stylesheet]');if(!link){link=document.createElement('link');link.rel='stylesheet';link.href=asset('storefront.css');this.shadowRoot.prepend(link);}return link;}
    watchSize(content) {
      this.sizeObserver?.disconnect();if(!content)return;
      this.sizeObserver=new ResizeObserver(()=>{cancelAnimationFrame(this.sizeFrame);this.sizeFrame=requestAnimationFrame(()=>{const height=Math.ceil(content.getBoundingClientRect().height);if(height>0&&Math.abs(height-(this.appliedHeight||0))>1){this.appliedHeight=height;this.style.height=height+'px';}this.onCartViewport();});});
      this.sizeObserver.observe(content);
    }
    // Page mode before the bridge has sent shop-context: the same routes the page code recognises (/category/..., /product-page/<slug>, /cart-page), read from the address only for this drawing.
    skeletonRoute() {
      const context=this.context||{};
      if(['shop','product','cart'].includes(context.mode))return {mode:context.mode,productId:this.productViewId()||null,categorySlug:context.categorySlug||null};
      let parts=[];try{parts=location.pathname.split('/').filter(Boolean).map(part=>{try{return decodeURIComponent(part).normalize('NFC');}catch{return part;}});}catch{}
      let marker=-1;parts.forEach((part,index)=>{if(['product-page','cart-page','category'].includes(part))marker=index;});
      const route=marker>=0?parts[marker]:'',slug=marker>=0?parts[marker+1]||null:null;
      if(route==='cart-page')return {mode:'cart',productId:null,categorySlug:null};
      if(route==='product-page')return {mode:'product',productId:SKELETON_PRODUCTS[slug]||null,categorySlug:null};
      return {mode:'shop',productId:null,categorySlug:route==='category'?slug:null};
    }
    // The shared catalogue layer groups and orders the shelves. Its commercial fields are placeholders that only satisfy its validation; nothing from them is ever drawn.
    skeletonCatalog() {
      if(this.skeletonModel)return this.skeletonModel;
      const rows=this.presentation.filter(item=>item.wixProductId).map(item=>{const binding=this.bindings.find(entry=>entry.wixProductId===item.wixProductId);return {id:item.wixProductId,name:item.name,productType:binding?.nativeProductType,collectionIds:binding?.nativeCategoryIds||[],visible:true,stock:{inStock:true},priceData:{price:0,currency:'EUR'},productPageUrl:'https://www.walkofberlin.com/',description:'',media:{mainMedia:{image:{url:''}}},productOptions:[]};});
      const products=[...this.layer.adaptWixProducts(rows,this.presentation),...this.layer.adaptExternalProducts(this.external)];
      products.sort((a,b)=>this.presentation.findIndex(item=>item.id===a.id)-this.presentation.findIndex(item=>item.id===b.id));
      return this.skeletonModel=this.layer.createCatalogModel(products,this.definitions);
    }
    skeletonBar(model,current) {return `<aside class="shopbar"><div class="wrap shopbar-inner"><span class="shopbar-home">${STORE_LOGO}</span><nav class="tabs">${model.tabs.map(tab=>`<a ${current===tab.id?'aria-current="page"':''}>${esc(tab.label)}</a>`).join('')}</nav><span class="cart-link">Cart ${sk('sk-count')}</span></div></aside>`;}
    skeletonCard(product,feature=false) {
      const source=this.image(product);
      return `<article class="${feature?'feature':'card'}"><div class="tile ${product.imageFit==='cover'?'cover':''} ${product.visualOverlay?'audio-device-card':''}">${source?`<img class="tile-photo" src="${esc(source)}" alt="" decoding="async">`:''}</div><div class="${feature?'feature-copy':'card-copy'}"><span class="type">${esc(product.typeLine)}</span><span class="product-name">${esc(product.name)}</span>${feature?`<p>${esc(this.layer.cardSummary(product.cardSummary||product.description))}</p>`:''}<span class="place">${esc(product.place)}</span><div class="card-bottom"><span class="price">${sk('sk-price')}</span>${sk('sk-button')}</div></div></article>`;
    }
    skeletonShop(route,model) {
      const resolved=this.navigation.resolveStoreRoute({categorySlug:route.categorySlug||'all-products',search:location.search});
      const category=resolved.ok?resolved.category:'all',filter=resolved.ok?resolved.filter:'all';
      // A landing page draws its own heading and cards here too; the normal Store skeleton showed for over a second first (Yusuf, 30 Oct 2026).
      const query=new URLSearchParams(location.search),landing=!query.has('tab')&&!query.has('collection')?this.navigation.STORE_LANDINGS?.[route.categorySlug]:null;
      if(landing)return this.skeletonLanding(landing,model,category);
      const selected=category==='all'?null:model.getCategoryView(category,filter);
      return `${this.skeletonBar(model,selected?category:'all')}<section class="wrap intro"><h1 class="lead">${esc(this.shopTitle(selected,selected?.filters.find(item=>item.id===filter)))}</h1>${selected?.filters.length?`<nav class="chips"><a>${esc(selected.allFilterLabel)}</a>${selected.filters.map(item=>`<a ${item.id===filter?'aria-current="page"':''}>${esc(item.label)}</a>`).join('')}</nav>`:''}</section>${(selected?[selected]:model.sections).map(section=>`<section class="wrap shelf"><div class="section-head"><div class="section-title"><h2>${esc(section.title)}</h2><span class="meta">${esc(section.description)}</span></div>${section.moreCategoryId?`<a>${esc(section.moreLabel)} →</a>`:''}</div><div class="${section.layout==='feature'?'feature-grid':'grid'}${selected?' category-grid':''}">${section.products.map(product=>this.skeletonCard({...product,imageFit:product.imageFit||section.imageFit},section.layout==='feature')).join('')}</div></section>`).join('')}`;
    }
    skeletonLanding(page,model,category) {
      const view=page.category?model.getCategoryView(page.category,'all'):null;
      const products=page.productIds?page.productIds.map(id=>model.products.find(product=>product.wixProductId===id)).filter(Boolean):view?.products||[];
      const cards=products.map(product=>this.skeletonCard({...product,imageFit:product.imageFit||view?.imageFit||'contain'}));
      if(page.voucher)cards.splice(page.voucher.after,0,`<article class="card gift-card"><div class="tile cover"><img class="tile-photo" src="${esc(asset('assets/gift-voucher-card.jpg'))}" alt="" decoding="async"></div><div class="card-copy"><span class="type">GIFT VOUCHER</span><span class="product-name">${esc(page.voucher.title)}</span><p class="gift-card-text">${esc(page.voucher.text)}</p><div class="gift-card-buttons">${sk('sk-button')}${sk('sk-button')}</div></div></article>`);
      return `${this.skeletonBar(model,category==='all'?'all':category)}<section class="wrap intro"><h1 class="lead">${esc(page.title)}</h1><p>${esc(page.text)}</p></section><section class="wrap shelf"><div class="grid category-grid">${cards.join('')}</div></section>`;
    }
    skeletonProduct(route,model) {
      const item=route.productId?this.presentation.find(entry=>entry.wixProductId===route.productId):null,digital=item?.kind==='digital';
      const photo=item?.image?`<img src="${esc(asset('assets/'+item.image))}" alt="" decoding="async">`:'';
      return `${this.skeletonBar(model,'all')}<div class="wrap"><nav class="breadcrumb"><span>Store</span> / ${item?esc(item.name):sk('sk-crumb')}</nav><section class="product-layout"><div class="product-title">${item?`<h1>${esc(item.name)}</h1><span class="place">${esc(item.place)}</span>`:`<h1>${sk('sk-title')}</h1>`}<span class="price sk-price-line">${sk('sk-price')}</span></div><div class="gallery"><div class="gallery-stage">${photo}</div><div class="thumbnails"><span class="thumb">${photo}</span></div></div><div class="buy-box"><p class="spec">${item?esc(item.typeLine):sk('sk-crumb')}</p><div class="buy-row ${digital?'no-qty':''}">${digital?'':sk('sk-qty')}${sk('sk-primary')}</div><div class="delivery">${sk('sk-line sk-w100')}${sk('sk-line sk-w60')}</div></div></section><div class="product-info"><section class="story"><h2>${digital?'About this download':'The story behind this print'}</h2>${sk('sk-line sk-w100')}${sk('sk-line sk-w100')}${sk('sk-line sk-w100')}${sk('sk-line sk-w60')}</section></div></div>`;
    }
    skeletonCart(model) {
      const line=`<article class="cart-line"><div class="line-image"></div><div class="line-main"><h3>${sk('sk-line sk-w60 sk-heading')}</h3>${sk('sk-line sk-w40')}<div class="line-bottom">${sk('sk-qty')}<span class="price">${sk('sk-price')}</span></div></div></article>`;
      return `${this.skeletonBar(model,'all')}<section class="wrap cart-page"><h1>Your cart</h1><div class="cart-layout"><div><section class="cart-group">${line}${line}</section></div><aside class="order-summary"><h2>${sk('sk-heading')}</h2><div class="summary-row">${sk('sk-label')}${sk('sk-amount')}</div><p class="destination-label">${sk('sk-label')}</p><div class="address-grid">${sk('sk-field')}${sk('sk-field')}</div><div class="checkout-area">${sk('sk-reason')}${sk('sk-primary')}${sk('sk-note')}<span class="sk-link-row">${sk('sk-label')}</span></div></aside></div></section>`;
    }
    showWhenStyled(box) {
      const link=this.ensureLink(),reveal=()=>{if(box.isConnected&&box.hidden)box.hidden=false;this.style.minHeight='';this.style.display='';};
      if(link.sheet)reveal();else{link.addEventListener('load',reveal,{once:true});link.addEventListener('error',reveal,{once:true});}
    }
    // Returns true when a skeleton is in place. Needs the static data; the box stays hidden until the stylesheet is applied, so unstyled markup is never visible.
    renderSkeleton() {
      if(!this.layer||!this.presentation)return false;
      let box=this.shadowRoot.querySelector('.skeleton');
      try {
        const route=this.skeletonRoute(),key=[route.mode,route.productId||'',route.categorySlug||''].join('|');
        if(box&&box.dataset.key===key)return true;
        const model=this.skeletonCatalog();
        const body=route.mode==='cart'?this.skeletonCart(model):route.mode==='product'?this.skeletonProduct(route,model):this.skeletonShop(route,model);
        if(!box){this.ensureLink();box=document.createElement('div');box.className='skeleton';box.setAttribute('aria-busy','true');box.hidden=true;this.shadowRoot.append(box);}
        box.dataset.key=key;box.innerHTML=`<p class="sr-only">Loading the store</p><div aria-hidden="true">${body}</div>`;
      }catch{box?.remove();return false;}
      this.showWhenStyled(box);this.watchSize(box);return true;
    }
    render() {
      if(this.configuredFailure&&this.isConfiguredDigitalRoute()){this.renderConfiguredFailure();return;}
      const skeleton=!this.revealed&&!this.hidden?this.renderSkeleton():false;
      if(!this.layer||!this.model){
        if(!skeleton){if(this.layer)this.shadowRoot.innerHTML=`<link rel="stylesheet" href="${esc(asset('storefront.css'))}"><div class="bridge-loading" role="status">Loading the store…</div>`;else this.ensureLink();}
        return;
      }
      const open=this.shadowRoot.querySelector('dialog')?.open;
      const focus=this.shadowRoot.activeElement;
      const focusAction=focus?.dataset.action,focusLine=focus?.dataset.line;
      const keep=this.revealed||this.hidden?null:this.shadowRoot.querySelector('.skeleton');
      // The <link> node stays in the shadow root across renders. Removing and re-inserting it drops the stylesheet for a frame (":host" display included), which showed as a one-frame layout jump when the real surface replaced the skeleton.
      const sheet=this.ensureLink(),surface=document.createElement('template');
      surface.innerHTML=`<div class="surface" ${this.revealed?'':'hidden'}>${this.shopbar()}${this.error?`<div class="native-error" role="alert">${esc(this.errorMessage())} <button class="text-button" data-action="refresh">Refresh cart</button></div>`:''}${this.context.mode==='product'?this.product():this.context.mode==='cart'?this.cartPage():this.shop()}<p class="sr-only" role="status" aria-live="polite">${esc(this.notice)}</p><dialog class="drawer" aria-label="Shopping cart"><div class="drawer-heading"><h2>Cart (${this.cart?this.cart.count:'—'})</h2><button class="icon-button" data-action="close-drawer" aria-label="Close cart">✕</button></div>${this.notice?`<p class="notice">${esc(this.notice)}</p>`:''}${this.cart?this.lines():''}<div class="drawer-subtotal summary-row"><span>Subtotal</span><strong>${esc(textMoney(this.cart?.subtotal))}</strong></div><p class="delivery">${this.digitalOnly()?'Nothing is shipped. Tax is confirmed after your billing country is entered.':'Delivery and tax are confirmed after your destination is entered.'}</p><div class="drawer-actions"><a class="primary" href="https://walkofberlin.com/cart-page">View cart</a><button class="text-button" data-action="close-drawer">Continue shopping</button></div></dialog></div>`;
      for(const node of [...this.shadowRoot.childNodes])if(node!==sheet&&node!==keep)node.remove();
      sheet.after(surface.content);
      const storeTabs=this.shadowRoot.querySelector('.shopbar .tabs'),activeTab=storeTabs?.querySelector('[aria-current]');if(activeTab&&storeTabs.scrollWidth>storeTabs.clientWidth)storeTabs.scrollLeft=Math.max(0,activeTab.offsetLeft-8);
      if(keep&&keep.hidden)this.showWhenStyled(keep);
      this.watchSize(this.shadowRoot.querySelector(keep?'.skeleton':'.surface')||this.shadowRoot.querySelector('.surface'));
      const dialog=this.shadowRoot.querySelector('dialog');
      dialog.addEventListener('close',()=>{this.shadowRoot.querySelector(`[data-action="add"][data-product="${this.lastAddedId||''}"]`)?.focus({preventScroll:true});});
      if(open&&this.revealed)dialog.showModal();
      if(focusAction)this.shadowRoot.querySelector(`[data-action="${focusAction}"]${focusLine?`[data-line="${CSS.escape(focusLine)}"]`:''}`)?.focus({preventScroll:true});
      this.mountYs();this.onCartViewport();this.queueAutoQuote();
    }
    syncMobileCheckout() {
      const cart=this.shadowRoot.querySelector('.cart-mode'),bar=cart?.querySelector('.checkout-area');
      if(!cart||!bar||!this.revealed)return;
      const mobile=matchMedia('(max-width:740px)').matches;
      cart.classList.toggle('mobile-cart-checkout',mobile);
      if(!mobile){cart.classList.remove('checkout-at-end');return;}
      const height=Math.ceil(bar.getBoundingClientRect().height);
      if(height>0&&height!==this.cartBarHeight){this.cartBarHeight=height;this.style.setProperty('--mobile-checkout-height',height+'px');}
      cart.classList.toggle('checkout-at-end',cart.getBoundingClientRect().bottom<=window.innerHeight+1);
    }
    errorMessage() {if(this.uncertain)return 'The cart update could not be confirmed. Refresh the cart and check it before trying again.';return ({CART_UNAVAILABLE:'The cart could not be read. You can still open the original cart.',INVALID_DESTINATION:'Enter a valid destination.',NO_SHIPPING_AVAILABLE:'No delivery method is available for this address.',CART_CHANGED:'Your cart changed. Check delivery again.',BRIDGE_DISABLED:'The shop is temporarily unavailable.'})[this.error]||'This action could not be completed. Check your cart or try again.';}
    // Any address edit clears the visible quote, total and delivery choice at once and bumps quoteRevision, so a late quote response for the old address is discarded in receive().
    input(event) {const field=event.target;if(!field.closest?.('[data-address-form]')||!field.name)return;this.destination[field.name]=field.value;this.selection=null;this.quote=null;this.quoteError='';this.failedKey='';this.choiceList=null;this.quoteRevision++;this.refreshCartUi();}
    // A committed edit (blur, Enter, "Done" on a phone keyboard) skips the remaining debounce.
    change(event) {const field=event.target;if(field.matches?.('[data-poster-option]')){this.changePosterOption(field);return;}if(!field.closest?.('[data-address-form]'))return;if(field.matches('[name="country"]'))this.input(event);this.queueAutoQuote(true);}
    // Automatic (debounced) or manual (Enter, Try again, Check delivery) quote. One request in flight at a time. A single delivery method is selected automatically with the same request path as a click, so the next quote is READY.
    async getQuote(manual=false) {
      if(!this.cart||this.context.mode!=='cart'||this.busy||this.quoting||this.uncertain||!this.destinationReady())return;
      if(!manual&&!this.autoQuoteWanted())return;
      clearTimeout(this.quoteTimer);this.quoteTimer=0;
      const revision=this.quoteRevision,key=this.attemptKey();
      if(this.error){this.error='';this.shadowRoot.querySelector('.native-error')?.remove();}
      this.quoting=true;this.quoteError='';this.failedKey='';this.updateQuoteArea();
      try {
        for(let step=0;step<3;step++){
          const kept=this.selection;
          try{await this.request('quote',{quoteInput:this.quoteInput()});}
          catch(error){
            // Cart changed under a remembered choice: drop the choice and ask again once. Read-only estimate, never an add.
            if(kept&&this.selection===kept&&revision===this.quoteRevision&&['SHIPPING_SELECTION_NOT_CONFIRMED','INVALID_SHIPPING_OPTION'].includes(error.message)){this.selection=null;continue;}
            throw error;
          }
          if(this.quote?.choices?.length)this.choiceList={signature:this.cart.signature,choices:this.quote.choices};
          const only=step<2&&this.quote?.state==='CHOOSE_SHIPPING'&&this.quote.choices.length===1?this.quote.choices[0]:null;
          if(!only)break;
          this.selection={carrierId:only.carrierId,code:only.code};this.quote=null;this.updateQuoteArea();
        }
        // Discarded as stale (address or cart edited meanwhile) leaves quote null without an error; anything else without a quote is a failure.
        if(revision===this.quoteRevision&&!this.quote)throw Error('QUOTE_UNAVAILABLE');
      }catch(error){
        if(revision===this.quoteRevision){this.quoteError=error.message||'CART_UNAVAILABLE';this.failedKey=key;this.quote=null;this.selection=null;}
      }finally{this.quoting=false;this.updateQuoteArea();}
    }
    async click(event) {
      const menu=event.target.closest('[data-menu-filter]');
      if(menu){this.navigateStore(menu.dataset.menuCategory,menu.dataset.menuFilter,event);return;}
      const category=event.target.closest('[data-category]'),filter=event.target.closest('[data-filter]');
      if(category){this.navigateStore(category.dataset.category,'all',event);return;}
      if(filter){this.navigateStore(this.category,filter.dataset.filter,event);return;}
      const button=event.target.closest('[data-action]');if(!button)return;
      const action=button.dataset.action;
      if(action==='close-drawer'){this.shadowRoot.querySelector('dialog').close();return;}
      if(action==='gift-toggle'||action==='gift-pick'){this.giftClick(action,button);return;}
      if(action==='show-legal'){const d=this.shadowRoot.querySelector('details[data-ys-legalfoot]');if(d){d.open=true;d.scrollIntoView({behavior:'smooth',block:'start'});}return;}
      if(action==='show-guarantee'){const d=this.shadowRoot.querySelector('details.delivery-returns');if(d){d.open=true;d.querySelector('.eu-guarantee')?.scrollIntoView({behavior:'smooth',block:'start'});}return;}if(action==='poster'||action==='room'||action==='wall'||action==='video'||/^g\d+$/.test(action)){this.view=action;this.render();if(action==='video')this.shadowRoot.querySelector('video.room')?.play?.().catch(()=>{});return;}
      if(action==='product-minus'||action==='product-plus'){this.quantity=Math.max(1,Math.min(99,this.quantity+(action==='product-plus'?1:-1)));this.render();return;}
      if(action==='shipping'){const choice=this.quote?.choices?.[Number(button.dataset.index)],same=!!choice&&!!this.selection&&choice.carrierId===this.selection.carrierId&&choice.code===this.selection.code;if(choice&&!same&&!this.busy&&!this.quoting&&!this.uncertain){this.choiceList={signature:this.cart.signature,choices:this.quote.choices};this.selection={carrierId:choice.carrierId,code:choice.code};this.quote=null;this.quoteError='';this.failedKey='';await this.getQuote(true);}return;}
      if(action==='retry-quote'){if(!this.busy&&!this.quoting&&!this.uncertain){this.quoteError='';this.failedKey='';await this.getQuote(true);}return;}
      if(action==='reload-configured'){location.reload();return;}
      if(action==='native-fallback'){releaseNative();this.request('native-fallback').catch(()=>{});return;}
      if(this.busy)return;
      if(this.uncertain&&action!=='refresh'){this.error='UPDATE_NOT_CONFIRMED';this.render();return;}
      this.busy=true;this.error='';this.render();
      try {
        if(action==='refresh')await this.request('get');
        if(action==='gift-add'){const offer=this.gift?.giftGateOpen()?this.giftOffersAll().find(item=>item.kind===button.dataset.giftKind):null;if(!offer)throw Error('CART_ITEMS_UNAVAILABLE');await this.request('add',{productId:offer.id,quantity:1});this.lastAddedId=offer.id;this.notice='Added to your cart';this.render();this.afterYsAdd(true);}
        if(action==='ys-add'){if(!this.ysMod.readyToAdd(this.ys))throw Error('YS_NOT_READY');const digital=!!this.ysApi?.digital&&this.ysMod.ysDigital?.(this.ys),id=digital?this.ysMod.YS_DIGITAL_ID:this.ysMod.YS_PRODUCT_ID;await this.request('add',digital?{productId:id,quantity:1,customTextFields:this.ysMod.buildCustomText(this.ys)}:{productId:id,quantity:1,customTextFields:this.ysMod.buildCustomText(this.ys),choices:this.ysMod.ysChoices(this.ys)});this.lastAddedId=id;const ysp=this.model.products.find(p=>p.wixProductId===this.ysMod.YS_PRODUCT_ID);this.measure('added',digital?{...ysp,wixProductId:id,name:'Your Berlin Street in 1928, Digital File',priceCents:Math.round(this.ysApi.digitalPrice*100),currency:'EUR'}:ysp,1);this.notice='Added to your cart';this.render();this.afterYsAdd();}

        if(action==='poster-add'){
          const product=this.model.products.find(p=>p.wixProductId===button.dataset.product);
          const native=this.catalogue.products.find(p=>p.productId===button.dataset.product);
          const pack=this.posterPack(product,native);
          if(!pack?.canAdd)throw Error('CART_ITEMS_UNAVAILABLE');
          await this.request('add',{productId:product.wixProductId,quantity:this.quantity,choices:{...pack.choices}});
          this.lastAddedId=product.wixProductId;this.measure('added',product,this.quantity);this.notice='Added to your cart';this.render();
          const dialog=this.shadowRoot.querySelector('dialog');if(this.revealed){dialog.showModal();dialog.querySelector('[data-action="close-drawer"]').focus();}
        }
        if(action==='add'){await this.request('add',{productId:button.dataset.product,quantity:Number(button.dataset.quantity)||1});this.lastAddedId=button.dataset.product;this.measure('added',this.model.products.find(p=>p.wixProductId===button.dataset.product),Number(button.dataset.quantity)||1);this.notice='Added to your cart';this.render();const dialog=this.shadowRoot.querySelector('dialog');if(this.revealed){dialog.showModal();dialog.querySelector('[data-action="close-drawer"]').focus();}}
        if(action==='minus'||action==='plus'){const line=this.cart?.lines.find(line=>line.lineItemId===button.dataset.line);if(line)await this.request('update',{lineItemId:line.lineItemId,quantity:line.quantity+(action==='plus'?1:-1)});}
        if(action==='remove')await this.request('remove',{lineItemId:button.dataset.line});
        if(action==='checkout'&&this.quote?.state==='READY'){this.measure('checkout',this.cart);await this.request('checkout',{quoteInput:this.quoteInput()});}
      }catch(error){this.error=error.message;}finally{this.busy=false;this.render();}
    }
  }
  customElements.define('bw-storefront', BWStorefront);
})();
