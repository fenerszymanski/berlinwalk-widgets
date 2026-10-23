(function () {
  'use strict';
  const script = document.currentScript;
  if (!script || !script.src || customElements.get('bw-storefront')) return;
  const base = new URL('.', script.src);
  const CHANNEL = 'wob:shop-cart:v1';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const asset = value => new URL(value, base).href;
  // Chrome and Safari ignore @font-face inside shadow DOM, so the three faces are registered once on the document with absolute URLs from the element's own base.
  try {if(!document.getElementById('bw-storefront-fonts')){const style=document.createElement('style');style.id='bw-storefront-fonts';style.textContent=[['Fraunces','Fraunces-Variable.ttf','100 900'],['Space Grotesk','SpaceGrotesk-Variable.ttf','300 700'],['IBM Plex Mono','IBMPlexMono-Regular.ttf','400 600']].map(([family,file,weight])=>`@font-face{font-family:'${family}';src:url("${asset('fonts/'+file)}") format("truetype");font-weight:${weight};font-display:swap}`).join('\n');(document.head||document.documentElement).appendChild(style);}}catch{}
  // One price format everywhere: euro sign, two decimals, dot separator ("€24.90"). Native Wix formatted prices are used first; this covers every fallback.
  const money = (currency, major) => {const number=Number(major);if(major===''||major===null||major===undefined||!Number.isFinite(number))return '';const code=String(currency||'').toUpperCase();return ({EUR:'€',USD:'$',GBP:'£'}[code]||(code?code+' ':''))+number.toFixed(2);};
  const url = value => {if(typeof value!=='string'||!value.trim())return '#';try {const u = new URL(value, 'https://www.walkofberlin.com');return u.protocol === 'https:' ? u.href : '#';} catch {return '#';}};
  const textMoney = value => value?.formattedAmount || (typeof value?.amount === 'string' ? value.amount : 'Not confirmed');
  const nativeImage = value => {if(typeof value!=='string')return '#';const match=/^wix:image:\/\/v1\/([^/#?]+)(?:\/|#|\?|$)/.exec(value);if(match&&/^[a-zA-Z0-9_.~%-]+$/.test(match[1]))return 'https://static.wixstatic.com/media/'+match[1];return url(value);};
  const json = value => {try{return JSON.parse(value || 'null');}catch{return null;}};
  // Native-widget guard release. The site-wide head snippet (wix/head-native-guard.html) hides the original Wix Stores widgets from first paint; this class lets them show again. Called only on terminal fallback paths: the bridge reports the native store restored or not collapsible, the visitor opens the original cart, the bridge times out, or the element's own files fail to load. A transient fail() alone does not release it.
  const releaseNative = () => {try{document.documentElement.classList.add('bw-shop-native');}catch{}};
  // Neutral shimmer block used by the loading skeleton wherever a price, button or line of text will be.
  // room videos: product id (print and its printable twin) -> asset slug; value = how the video is described
  const ROOM_VIDEOS = {'berlin-uhr':'The Berlin-Uhr print','ghost-stations':'The Ghost Stations print','world-clock':'The World Clock print','wasserturm':'The Wasserturm print','tv-tower':'The TV Tower print','tram-map':'The Tram Map and the Wall print','bierpinsel':'The Bierpinsel print','osman-kalin':'The Osman Kalın’s Treehouse print','cafe-achteck':'The Café Achteck print','friedrichshain-kreuzberg':'The Friedrichshain-Kreuzberg print','pankow':'The Pankow print','charlottenburg-wilmersdorf':'The Charlottenburg-Wilmersdorf print','spandau':'The Spandau print','steglitz-zehlendorf':'The Steglitz-Zehlendorf print','tempelhof-schoeneberg':'The Tempelhof-Schöneberg print','neukoelln':'The Neukölln print','treptow-koepenick':'The Treptow-Köpenick print','marzahn-hellersdorf':'The Marzahn-Hellersdorf print','lichtenberg':'The Lichtenberg print','reinickendorf':'The Reinickendorf print'};
  const ROOM_IDS = {bu:'berlin-uhr',gs:'ghost-stations',wc:'world-clock',wt:'wasserturm',tv:'tv-tower',tm:'tram-map',bp:'bierpinsel',ok:'osman-kalin',ca:'cafe-achteck','dl-berlin-tram-map':'tram-map','dl-osman-kalin-treehouse':'osman-kalin'};
  const roomSlug = product => {const id=String(product?.id||''),slug=ROOM_IDS[id]||id.replace(/^(pr|dl)-/,'');return ROOM_VIDEOS[slug]&&/^(pr-|dl-|bu$|gs$|wc$|wt$|tv$|tm$|bp$|ok$|ca$)/.test(id)?slug:'';};
  const sk = cls => `<span class="sk-block ${cls}"></span>`;
  // Loading skeleton only: product page slug (the keys of PRODUCT_SLUGS in the page code) -> native product id, so the bundled poster of the product being opened can be drawn before the bridge answers. An unknown slug just gets a neutral skeleton.
  const SKELETON_PRODUCTS = Object.fromEntries(Object.entries({
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
    ...['data/categories.json','data/presentation.json','data/native-bindings.json','data/external-products.json'].map(path => fetch(asset(path)).then(response => {if (!response.ok) throw Error('CATALOGUE_METADATA_UNAVAILABLE');return response.json();}))
  ]);
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
  // Cart destinations. The page-code bridge (quoteInput in wix/shop-page-custom-element.js) needs only a two-letter country and treats postalCode, subdivision, city and addressLine1 as optional, so the cart asks for country + postal code. `pattern` decides when a postal code looks complete enough to request a quote automatically.
  const DESTINATIONS = [['DE','Germany','Postal code','10115',/^\d{5}$/,'numeric'],['AT','Austria','Postal code','1010',/^\d{4}$/,'numeric'],['FR','France','Postal code','75001',/^\d{5}$/,'numeric'],['NL','Netherlands','Postal code','1012 AB',/^\d{4} ?[A-Za-z]{2}$/,'text'],['GB','United Kingdom','Postcode','SW1A 1AA',/^[A-Za-z]{1,2}\d[A-Za-z\d]? ?\d[A-Za-z]{2}$/,'text'],['US','United States','ZIP code','10001',/^\d{5}(?:-\d{4})?$/,'numeric']].map(([code,label,postal,example,pattern,mode])=>({code,label,postal,example,pattern,mode}));
  // Digital downloads (kind "digital" in presentation.json, or a native digital product type): no shipping, quantity 1, own delivery copy. Rows may override both texts with deliveryNote / deliveryDetails.
  const isDigital = product => product?.kind === 'digital' || product?.nativeProductType === 'digital';
  const STORE_LOGO = "<svg class=\"store-logo\" viewBox=\"0 0 160 60\" aria-hidden=\"true\" focusable=\"false\"><rect x=\"1.75\" y=\"1.75\" width=\"156.5\" height=\"56.5\" rx=\"5\" fill=\"#fff\" stroke=\"currentColor\" stroke-width=\"3.5\"/><svg x=\"8\" y=\"12\" width=\"36\" height=\"36\" viewBox=\"0 0 512 512\"><circle cx=\"256\" cy=\"256\" r=\"248\" fill=\"#1B5E20\"/><circle cx=\"256\" cy=\"256\" r=\"230\" fill=\"#7CB342\"/><circle cx=\"256\" cy=\"256\" r=\"218\" fill=\"#FFE600\"/><g transform=\"translate(-1135.53 -150.39) scale(1.12745)\"><path fill=\"#1B5E20\" fill-rule=\"evenodd\" d=\"M1212.07 282.39C1211.92 286.31 1190.84 312.83 1187.00 317.90C1164.84 347.06 1143.63 377.01 1122.57 407.00C1115.75 416.71 1108.20 426.11 1102.03 436.29C1099.78 439.99 1096.00 444.08 1097.39 448.81C1098.66 453.17 1104.84 455.08 1108.11 457.63C1105.89 463.74 1079.86 478.77 1085.72 489.68C1090.06 497.75 1103.61 498.26 1111.34 498.93C1135.80 501.07 1160.08 499.88 1184.19 495.99C1224.36 489.52 1268.32 473.00 1301.01 448.43C1321.28 433.19 1335.92 417.38 1333.82 390.39C1333.26 383.20 1329.11 374.56 1323.68 369.80C1320.42 366.94 1314.49 364.61 1312.73 360.63C1315.36 357.99 1329.43 352.46 1334.10 349.67C1346.05 342.55 1359.52 331.07 1368.58 320.55C1373.59 314.72 1378.79 308.19 1382.11 301.20C1395.51 272.91 1382.64 247.70 1354.30 237.49C1317.72 224.30 1271.49 227.49 1234.04 234.97C1224.29 236.91 1201.90 239.90 1194.39 245.64C1183.71 253.80 1203.33 277.58 1212.07 282.39Z M1165.94 445.61C1172.95 432.71 1185.37 418.17 1194.11 405.91C1201.59 395.44 1208.23 384.13 1216.18 374.02C1222.46 373.37 1229.55 373.04 1235.81 373.99C1238.97 374.47 1242.21 375.64 1245.39 375.84C1254.72 376.43 1281.14 381.63 1287.76 388.07C1289.78 390.03 1290.32 392.62 1290.06 395.34C1289.13 405.19 1279.67 411.64 1272.71 417.14C1252.72 432.92 1221.68 438.53 1197.44 443.34C1190.62 444.69 1171.99 448.11 1165.94 445.61Z M1356.98 280.17C1356.21 289.92 1340.98 300.61 1333.10 305.22C1312.66 317.19 1291.59 326.23 1268.41 331.35C1260.25 333.15 1251.62 336.69 1243.18 335.98C1242.93 330.59 1260.78 309.59 1264.54 303.45C1272.22 290.93 1266.93 287.92 1267.92 279.39C1275.54 276.30 1301.00 273.07 1309.63 272.89C1318.20 272.70 1323.48 273.45 1331.38 273.84C1339.47 274.24 1350.72 274.31 1356.98 280.17Z\"/></g></svg><line x1=\"52\" y1=\"8\" x2=\"52\" y2=\"52\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-dasharray=\"3 3\"/><path fill=\"currentColor\" d=\"M68.424 38.764Q66.444 38.764 65.047 38.082Q63.65 37.4 62.77 36.278L64.508 34.474000000000004Q65.366 35.464 66.36699999999999 35.937Q67.368 36.41 68.512 36.41Q69.832 36.41 70.536 35.816Q71.24 35.222 71.24 34.1Q71.24 33.176 70.71199999999999 32.703Q70.184 32.230000000000004 68.93 32.032L67.30199999999999 31.768Q65.168 31.394 64.266 30.217Q63.364 29.04 63.364 27.434Q63.364 25.234 64.794 24.057000000000002Q66.224 22.880000000000003 68.754 22.880000000000003Q70.55799999999999 22.880000000000003 71.86699999999999 23.452Q73.176 24.024 73.968 25.014000000000003L72.274 26.818Q71.658 26.092 70.8 25.663Q69.942 25.234 68.776 25.234Q66.268 25.234 66.268 27.302Q66.268 28.182000000000002 66.79599999999999 28.644000000000002Q67.324 29.106 68.6 29.326L70.206 29.612000000000002Q72.208 29.986 73.176 31.086Q74.144 32.186 74.144 33.902Q74.144 34.980000000000004 73.77000000000001 35.871Q73.396 36.762 72.67 37.411Q71.944 38.06 70.87700000000001 38.412000000000006Q69.81 38.764 68.424 38.764ZM87.23 25.520000000000003V38.5H84.37V25.520000000000003H79.75V23.144H91.85V25.520000000000003ZM103.0 38.764Q101.504 38.764 100.404 38.225Q99.304 37.686 98.589 36.674Q97.87400000000001 35.662 97.53300000000002 34.188Q97.19200000000001 32.714 97.19200000000001 30.822Q97.19200000000001 28.951999999999998 97.53300000000002 27.467Q97.87400000000001 25.982 98.589 24.97Q99.304 23.958 100.404 23.419Q101.504 22.880000000000003 103.0 22.880000000000003Q105.992 22.880000000000003 107.4 24.970000000000002Q108.808 27.060000000000002 108.808 30.822Q108.808 34.584 107.4 36.67400000000001Q105.992 38.764 103.0 38.764ZM103.0 36.41Q103.77000000000001 36.41 104.298 36.113Q104.82600000000001 35.816 105.14500000000001 35.266000000000005Q105.464 34.716 105.607 33.913Q105.75 33.11 105.75 32.12V29.502000000000002Q105.75 27.522 105.14500000000001 26.378Q104.54 25.234 103.0 25.234Q101.46000000000001 25.234 100.855 26.378Q100.25 27.522 100.25 29.502000000000002V32.142Q100.25 34.122 100.855 35.266Q101.46000000000001 36.41 103.0 36.41ZM118.242 38.5H115.36000000000001V23.144H121.19000000000001Q123.43400000000001 23.144 124.62200000000001 24.42Q125.81 25.696 125.81 27.896Q125.81 29.59 125.029 30.744999999999997Q124.248 31.9 122.796 32.208L126.07400000000001 38.5H122.906L119.98 32.538H118.242ZM120.596 30.294Q121.762 30.294 122.268 29.820999999999998Q122.774 29.348 122.774 28.314V27.478Q122.774 26.444000000000003 122.268 25.971000000000004Q121.762 25.498 120.596 25.498H118.242V30.294ZM132.626 38.5V23.144H142.328V25.520000000000003H135.508V29.524H142.086V31.9H135.508V36.124H142.328V38.5Z\"/></svg><span class=\"sr-only\">Walk of Berlin Store</span>";
  // Legal copy (Yusuf, 23 Oct 2026: "bunlarla ilerleyelim"). Texts from content/products/your-street-1928/SHOP_CHECKOUT_AND_EMAIL_COPY_DRAFT_EN.md section 1. The two documents and the withdrawal function are served by app.berlinwalk.com.
  const LEGAL = {terms:'https://app.berlinwalk.com/store-terms',withdrawalNotice:'https://app.berlinwalk.com/store-withdrawal',withdraw:'https://app.berlinwalk.com/withdraw',guaranteeImage:'assets/eu-legal-guarantee-notice-en.jpg',guaranteeInfo:'https://europa.eu/youreurope/guarantees'};
  const ACK = 'I agree to the Store Terms and Conditions. I have been given the Withdrawal notices and model withdrawal form.';
  const NOTICE_PERSONALISED = ['This physical print is made using your selected map point and text. The statutory right of withdrawal does not apply to this personalised physical product. Your statutory rights if the print is faulty or does not match your order remain unaffected.','Please check the map point, title, area and personal line shown in your order before paying.'];
  const NOTICE_DIGITAL = 'Digital download: no physical product will be shipped. Your download link is supplied after payment and is valid for 30 days. You can keep the downloaded files for your permitted personal use. You retain the 14-day consumer withdrawal right even if you download or use the files immediately.';
  const GUARANTEE_ALT = 'EU legal guarantee notice. Minimum two-year legal guarantee protection for goods sold in the European Union. Consumers can claim their rights under the legal guarantee of conformity, for example if goods do not match the description or do not function as intended. Sellers are liable for any lack of conformity which existed when the goods were delivered and which becomes apparent within the legal guarantee period, and must offer free repair or free replacement and, in some cases, a price reduction or full reimbursement. Some countries have a longer legal guarantee period. For more information, see europa.eu/youreurope/guarantees. What to do if you receive non-conforming goods: contact the seller as soon as possible to report the issue and provide proof of purchase.';
  const YS_ID = '8aaf5412-7f21-42c7-acfb-85dd8417d68c';
  const DIGITAL_NOTE = 'Instant download. After payment the download link appears on the confirmation page and in your email (valid for 30 days). Nothing is shipped.';
  const DIGITAL_DETAILS = 'Digital download: no shipping. The download link appears on the order confirmation page and in the confirmation email and works for 30 days. The Store Terms and the Withdrawal notices are linked below.';
  class BWStorefront extends HTMLElement {
    static get observedAttributes() {return ['shop-bridge-ready','shop-context','shop-catalogue','shop-cart-response'];}
    constructor() {
      super();this.attachShadow({mode:'open'});this.pending = new Map();this.cart = null;this.catalogue = null;this.model = null;
      this.context = {};this.category = 'all';this.filter = 'all';this.quantity = 1;this.view = 'poster';this.busy = false;
      this.quote = null;this.destination = {};this.selection = null;this.error = '';this.notice = '';this.revealed = false;this.readySent = false;this.delivery = -1;this.quoteRevision=0;
      this.shadowRoot.addEventListener('click', event => this.click(event));
      this.shadowRoot.addEventListener('input', event => this.input(event));
      this.shadowRoot.addEventListener('change', event => this.change(event));
      this.shadowRoot.addEventListener('submit', event => {event.preventDefault();if(event.target.matches('[data-address-form]'))this.getQuote(true);});
      this.onCartViewport=()=>{cancelAnimationFrame(this.cartBarFrame);this.cartBarFrame=requestAnimationFrame(()=>this.syncMobileCheckout());};
    }
    // The stylesheet request starts now, in parallel with the data files, so the skeleton can be drawn as soon as the data arrives. The watchdog is the last resort when the page-code bridge never answers: it falls back to the original store before the guard's own 12 s failsafe would show both at once.
    connectedCallback() {this.context=json(this.getAttribute('shop-context'))||{};if(!this.revealed&&!this.hidden){this.style.display='block';this.style.minHeight='100vh';}window.addEventListener('scroll',this.onCartViewport,{passive:true});window.addEventListener('resize',this.onCartViewport,{passive:true});this.ensureLink();clearTimeout(this.watchdog);this.watchdog=setTimeout(()=>{if(!this.revealed&&!this.hidden){releaseNative();this.fail('BRIDGE_TIMEOUT');}},Math.max(1500,10500-(globalThis.performance?.now?.()||0)));this.load();}
    disconnectedCallback() {clearTimeout(this.watchdog);clearTimeout(this.quoteTimer);this.sizeObserver?.disconnect();cancelAnimationFrame(this.sizeFrame);cancelAnimationFrame(this.cartBarFrame);window.removeEventListener('scroll',this.onCartViewport);window.removeEventListener('resize',this.onCartViewport);for(const pending of this.pending.values()){clearTimeout(pending.timer);pending.reject(Error('BRIDGE_DISCONNECTED'));}this.pending.clear();}
    attributeChangedCallback(name, oldValue, value) {
      if(oldValue===value)return;
      if(name==='shop-context') {const next=json(value)||{};if(next.path!==this.context.path){this.quantity=1;this.view='poster';this.readySent=false;this.revealed=false;this.quote=null;this.quoteRevision++;}this.context=next;this.applyContextCategory();this.render();this.signalReady();}
      if(name==='shop-catalogue') {this.catalogue=json(value);this.buildModel();}
      if(name==='shop-cart-response')this.receive(json(value));
      if(name==='shop-bridge-ready')this.start();
    }
    async load() {
      try {const [layer,editorial,ysMod,definitions,presentation,bindings,external]=await resources;
        Object.assign(this,{layer,editorial,ysMod,definitions,presentation,bindings,external});
        if(this.catalogue)this.buildModel();if(!this.model)this.render();await this.start();
      }catch(error){if(!this.layer)releaseNative();this.fail(error.message);}
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
        for(const [id,pending] of this.pending)if(pending.op==='native-fallback'){clearTimeout(pending.timer);pending.resolve(response);this.pending.delete(id);}
        if(response.ok&&response.nativeCollapsed){clearTimeout(this.watchdog);this.hidden=false;this.revealed=true;this.style.minHeight='';this.style.display='';this.render();}
        else {releaseNative();this.revealed=false;this.hidden=true;this.style.minHeight='';this.style.display='';this.appliedHeight=0;this.style.height='0px';this.sizeObserver?.disconnect();if(!response.fallback)this.dispatchEvent(new CustomEvent('shop-render-failed',{detail:{channel:CHANNEL},bubbles:true,composed:true}));}
        return;
      }
      if(response.context)this.context=response.context;
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
    buildModel() {
      if(!this.layer||!Array.isArray(this.catalogue?.products))return;
      try {
        const rows=this.catalogue.products.map(row=>{
          const binding=this.bindings.find(item=>item.wixProductId===row.productId);
          return {id:row.productId,name:row.name,productType:binding?.nativeProductType,collectionIds:binding?.forceNativeCategoryIds?binding.nativeCategoryIds:row.collectionIds?.length?row.collectionIds:binding?.nativeCategoryIds,
            visible:true,stock:{inStock:row.inStock},priceData:{price:row.price,discountedPrice:row.discountedPrice,currency:row.currency},productPageUrl:url(row.productPageUrl),
            description:row.description,additionalInfoSections:row.additionalInfoSections,
            media:{mainMedia:{image:{url:row.mainMedia}}},productOptions:row.requiresOptions||row.directAddAllowed!==true?[{name:'Native options'}]:[]};
        });
        const products=[...this.layer.adaptWixProducts(rows,this.presentation),...this.layer.adaptExternalProducts(this.external)];
        products.sort((a,b)=>this.presentation.findIndex(item=>item.id===a.id)-this.presentation.findIndex(item=>item.id===b.id));
        this.model=this.layer.createCatalogModel(products,this.definitions);
        for(const product of this.model.products){const native=this.catalogue.products.find(row=>row.productId===product.wixProductId);product.priceLabel=native?.formattedDiscountedPrice||native?.formattedPrice||money(native?native.currency:product.currency,native?(native.discountedPrice??native.price):this.external.find(item=>item.sourceKey===product.externalSourceKey)?.productSchema?.offers?.price);}
        this.applyContextCategory();this.render();this.signalReady();
      }catch(error){this.fail(error.message);}
    }
    applyContextCategory() {
      if(!this.model)return;
      if(this.context.categorySlug==='berlin-landmark-posters'){this.category='print';this.filter='landmarks';}
      else if(this.context.categorySlug==='berlin-reels-collection'){this.category='print';this.filter='stories';}
      else if(this.context.categorySlug==='digital-downloads'){this.category='digital';this.filter='all';}
      else this.category=this.model.normaliseCategoryId(this.category);
    }
    signalReady() {
      if(this.readySent||!this.model||!['shop','product','cart'].includes(this.context.mode))return;
      const stylesheet=this.shadowRoot.querySelector('link[rel=stylesheet]');if(stylesheet&&!stylesheet.sheet){stylesheet.addEventListener('load',()=>this.signalReady(),{once:true});return;}
      if(this.context.mode==='cart'&&!this.cart)return;
      if(this.context.mode==='product'&&!this.model.products.some(p=>p.wixProductId===this.context.productId))return;
      this.readySent=true;this.dispatchEvent(new CustomEvent('shop-render-ready',{detail:{channel:CHANNEL},bubbles:true,composed:true}));
    }
    fail(message) {clearTimeout(this.watchdog);this.error=message||'SHOP_UNAVAILABLE';this.revealed=false;this.hidden=true;this.style.minHeight='';this.style.display='';this.appliedHeight=0;this.style.height='0px';this.sizeObserver?.disconnect();this.render();this.dispatchEvent(new CustomEvent('shop-render-failed',{detail:{channel:CHANNEL},bubbles:true,composed:true}));}
    image(product) {if(product.image)return asset('assets/'+product.image);const native=product.source==='external'?'#':nativeImage(product.nativeImageUrl);return native&&native!=='#'?native:'';}
    tile(product) {
      const source=this.image(product);
      return `<a class="tile ${product.imageFit==='cover'?'cover':''} ${product.visualOverlay?'audio-device-card':''}" href="${esc(url(product.productUrl))}"><img class="tile-photo" src="${esc(source)}" alt="${esc(product.alt||product.name)}" loading="lazy">${product.visualOverlay?`<img class="audio-device-overlay" src="${esc(asset('assets/'+product.visualOverlay))}" alt="Illustrative phone and headphones" loading="lazy">`:''}</a>`;
    }
    action(product) {return product.action==='add'?`<button class="outline" data-action="add" data-product="${product.wixProductId}" ${this.busy||this.uncertain?'disabled':''}>Add to cart</button>`:`<a class="outline" href="${esc(url(product.productUrl))}">${esc(product.actionLabel)}</a>`;}
    card(product,feature=false) {return `<article class="${feature?'feature':'card'}" data-product="${product.id}">${this.tile(product)}<div class="${feature?'feature-copy':'card-copy'}"><span class="type">${esc(product.typeLine)}</span><a class="product-name" href="${esc(url(product.productUrl))}">${esc(product.name)}</a>${feature?`<p>${esc(product.description)}</p>`:''}<span class="place">${esc(product.place)}</span><div class="card-bottom"><span class="price">${esc(product.priceLabel)}</span>${this.action(product)}</div></div></article>`;}
    shopbar() {return `<aside class="shopbar"><div class="wrap shopbar-inner"><a class="shopbar-home" href="https://walkofberlin.com/category/all-products">${STORE_LOGO}</a><nav class="tabs" aria-label="Store categories">${this.model.tabs.map(tab=>`<a href="https://walkofberlin.com/category/all-products" data-category="${tab.id}" ${this.category===tab.id?'aria-current="page"':''}>${esc(tab.label)}</a>`).join('')}</nav><a class="cart-link" href="https://walkofberlin.com/cart-page">Cart (${this.cart?this.cart.count:'—'})</a></div></aside>`;}
    credits() {return `<section class="wrap visual-credit-wrap"><details class="shop-visual-credits"><summary>Store image credits</summary><div class="details-body"><p>Photograph of Anhalter Bahnhof: Carlos Delgado / Wikimedia Commons, CC BY-SA 4.0. The photograph is cropped and resized for the shop card.</p><p><a href="https://commons.wikimedia.org/wiki/File:Berlin_Anhalter_Bahnhof_-_01.jpg" target="_blank" rel="noopener noreferrer">Original photograph</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0 licence</a></p><p>A separate illustration of a phone and headphones was created with OpenAI image generation and layered over the photograph. It is an illustrative device image, not a screenshot of the audio player.</p></div></details></section>`;}
    lead() {return 'Prints of Berlin places, printable downloads, and audio walks to explore them on foot.';}
    shop() {
      const selected=this.category==='all'?null:this.model.getCategoryView(this.category,this.filter);
      return `<section class="wrap intro"><h1 class="lead">${esc(this.lead())}</h1>${selected?.filters.length?`<nav class="chips" aria-label="Series"><a href="#" data-filter="all">${esc(selected.allFilterLabel)}</a>${selected.filters.map(filter=>`<a href="#" data-filter="${filter.id}" ${filter.id===this.filter?'aria-current="page"':''}>${esc(filter.label)}</a>`).join('')}</nav>`:''}</section>${(selected?[selected]:this.model.sections).map(section=>`<section class="wrap shelf"><div class="section-head"><div class="section-title"><h2>${esc(section.title)}</h2><span class="meta">${esc(section.description)}</span></div>${section.moreCategoryId?`<a href="#" data-category="${section.moreCategoryId}">${esc(section.moreLabel)} →</a>`:''}</div><div class="${section.layout==='feature'?'feature-grid':'grid'}${selected?' category-grid':''}">${section.products.map(product=>this.card({...product,imageFit:product.imageFit||section.imageFit},section.layout==='feature')).join('')}</div></section>`).join('')}${this.credits()}`;
    }
    quantityControl(value,id='',product=false) {return `<div class="qty"><button data-action="${product?'product-minus':'minus'}" data-line="${esc(id)}" aria-label="Decrease quantity" ${value<=1||this.busy||this.uncertain?'disabled':''}>−</button><output>${value}</output><button data-action="${product?'product-plus':'plus'}" data-line="${esc(id)}" aria-label="Increase quantity" ${value>=99||this.busy||this.uncertain?'disabled':''}>+</button></div>`;}
    roomVideo(product) {
      const slug=roomSlug(product),still=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      return `<video class="room" src="${esc(asset('assets/room/'+slug+'.mp4'))}" poster="${esc(asset('assets/room/'+slug+'-poster.jpg'))}" ${still?'controls':'autoplay loop'} muted playsinline preload="metadata" aria-label="${esc(ROOM_VIDEOS[slug])} in a living room. Styling example, frame not included."></video>`;
    }
    product() {
      const product=this.model.products.find(p=>p.wixProductId===this.context.productId);if(!product)return '';
      const native=this.catalogue.products.find(p=>p.productId===product.wixProductId);
      if(this.ysMod&&product.wixProductId===this.ysMod.YS_PRODUCT_ID)return this.ysProduct(product,native);
      const room=roomSlug(product),view=room&&(this.view!=='wall'||product.id==='bu')?this.view:'poster',wall=view==='wall',video=view==='video',digital=isDigital(product);
      const originalDescription=native?.description||product.description;
      return `<div class="wrap"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="https://walkofberlin.com/category/all-products">Store</a> / ${esc(product.name)}</nav><section class="product-layout"><div class="product-title"><h1>${esc(product.name)}</h1><span class="place">${esc(product.place)}</span><span class="price">${esc(product.priceLabel)}</span></div><div class="gallery"><div class="gallery-stage">${video?this.roomVideo(product):`<img class="${wall?'wall':''}" src="${esc(wall?asset('assets/berlin-uhr-wall.jpg'):this.image(product))}" alt="${esc(wall?'Styling example. Frame not included.':product.alt)}">${wall?'<p class="gallery-caption">Styling example · Frame not included</p>':''}`}</div><div class="thumbnails"><button class="thumb" data-action="poster" aria-label="${digital?'Show the preview':'Show the poster'}" aria-pressed="${view==='poster'}"><img src="${esc(asset('assets/'+product.image))}" alt=""></button>${room?`<button class="thumb play" data-action="video" aria-label="Play the room video" aria-pressed="${video}"><img src="${esc(asset('assets/room/'+room+'-thumb.jpg'))}" alt=""><span class="play-badge" aria-hidden="true"></span></button>`:''}${product.id==='bu'?`<button class="thumb" data-action="wall" aria-label="Show it on a wall" aria-pressed="${wall}"><img src="${esc(asset('assets/berlin-uhr-wall.jpg'))}" alt=""></button>`:''}</div></div><div class="buy-box"><p class="spec">${esc(product.typeLine)}</p><div class="buy-row ${digital?'no-qty':''}">${digital?'':this.quantityControl(this.quantity,'',true)}${product.action==='add'?`<button class="primary" data-action="add" data-product="${product.wixProductId}" data-quantity="${digital?1:this.quantity}" ${this.busy||this.uncertain?'disabled':''}>Add to cart</button>`:this.action(product)}</div><p class="delivery">${digital?esc(product.deliveryNote||DIGITAL_NOTE):'Printed to order by Gelato. Delivery estimates are shown at checkout.'+(/CALENDAR/.test(product.typeLine||'')?'':' Frame not included.')}</p>${digital?'':this.guaranteeNotice()}${this.legalLinks()}${this.withdrawButton()}</div></section><div class="product-info"><section class="story"><h2>${digital?'About this download':'The story behind this print'}</h2><div>${safeHtml(originalDescription)}</div></section>${product.id==='bu'?this.editorial.clockBox()+this.editorial.locationCard(product):''}<section class="disclosures">${(product.nativeAdditionalInfo||[]).map(info=>`<details><summary>${esc(info.title)}</summary><div class="details-body">${safeHtml(info.description)}</div></details>`).join('')}<details><summary>${digital?'Download &amp; returns':'Delivery &amp; returns'}</summary><div class="details-body"><p>${digital?esc(product.deliveryDetails||DIGITAL_DETAILS):'Printed to order by Gelato. Delivery estimates are shown in checkout; the Store Terms and the Withdrawal notices are linked on this page.'}</p></div></details></section></div><section class="more"><h2>More from the shop</h2><div class="grid category-grid">${[...this.related(product),...this.model.products.filter(p=>p.action==='external').slice(0,1)].map(p=>this.card(p)).join('')}</div></section></div>${this.credits()}`;
    }
    // "Your Berlin Street in 1928": personalised aerial print. The configurator lives in street-configurator.js; state survives re-renders in this.ys.
    ysProduct(product,native) {
      const story=native?.description||product.description;
      return `<div class="wrap"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="https://walkofberlin.com/category/all-products">Store</a> / ${esc(product.name)}</nav><section class="product-layout ys-layout" data-ys-host><div class="product-title"><h1>${esc(product.name)}</h1><span class="place">${esc(product.place)}</span><span class="price">${esc(product.priceLabel)}</span></div><div class="gallery ys-gallery" data-ys-slot="visual"></div><div class="buy-box ys-buy"><p class="spec">${esc(product.typeLine)}</p><div data-ys-slot="form"></div><p class="ys-why" data-ys-why role="status"></p><div class="buy-row no-qty"><button class="primary" data-action="ys-add" data-ys-add disabled>Add to cart</button></div><p class="delivery">Made to order from your address and printed for you, usually in about 5 to 7 working days. Frame not included. Delivery: Germany only, free.</p><div class="line-legal" data-line-legal="personalised"><strong>Personalised physical product</strong>${NOTICE_PERSONALISED.map(t=>`<p>${esc(t)}</p>`).join('')}</div>${this.guaranteeNotice()}${this.legalLinks()}${this.withdrawButton()}</div></section><div class="product-info"><section class="story"><h2>The story behind this print</h2><div>${safeHtml(story)}</div></section></div></div>`;
    }
    mountYs() {
      const host=this.shadowRoot.querySelector('[data-ys-host]');if(!host||!this.ysMod)return;
      this.ys=this.ys||{};this.ysApi=this.ysApi||{sample:asset('assets/ys-sample.jpg'),busy:()=>this.busy||this.uncertain};
      this.ysMod.mountConfigurator(host,this.ys,this.ysApi);
    }
    // "More from the shop": same group first, then same kind (digital or print), then the rest; the original order is kept inside each rank.
    related(product) {
      const kind=item=>isDigital(item)?'digital':'print',rank=item=>product.group&&item.group===product.group?0:kind(item)===kind(product)?1:2;
      return this.model.products.map((item,index)=>({item,index})).filter(({item})=>item.id!==product.id&&item.fulfilment.cartEligible).sort((a,b)=>rank(a.item)-rank(b.item)||a.index-b.index).slice(0,2).map(({item})=>item);
    }
    lines() {
      return [['Shipped to you',this.cart.lines.filter(line=>line.shippable===true)],['Download',this.cart.lines.filter(line=>line.shippable===false)],['Delivery type to confirm',this.cart.lines.filter(line=>line.shippable===null)]].filter(([,lines])=>lines.length).map(([label,lines])=>`<section class="cart-group"><h2>${label}</h2>${lines.map(line=>{const product=this.model.products.find(p=>p.wixProductId===line.productId);return `<article class="cart-line"><div class="line-image">${product?`<img src="${esc(this.image(product))}" alt="${esc(product.name)}">`:''}</div><div class="line-main"><h3>${esc(product?.name||line.name)}</h3><span class="meta">${esc(product?.typeLine||line.itemType||'')}</span>${(line.customText||[]).map(item=>`<p class="meta line-custom"><strong>${esc(item.title)}:</strong> ${esc(item.value)}</p>`).join('')}${this.lineNotice(line)}<div class="line-bottom"><div class="line-controls">${line.editable?this.quantityControl(line.quantity,line.lineItemId):`<span>Quantity: ${line.quantity}</span>`}${line.editable?`<button class="text-button" data-action="remove" data-line="${esc(line.lineItemId)}" ${this.busy||this.uncertain?'disabled':''}>Remove</button>`:''}</div><strong class="price">${line.lineTotal?esc(textMoney(line.lineTotal)):`${esc(textMoney(line.unitPrice))} each`}</strong></div>${!line.editable?'<p class="meta">Manage this item in the original cart.</p>':''}</div></article>`;}).join('')}</section>`).join('');
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
    guaranteeNotice() {return `<section class="eu-guarantee" aria-labelledby="eu-guarantee-title"><h2 id="eu-guarantee-title">EU legal guarantee notice</h2><a href="${esc(asset(LEGAL.guaranteeImage))}" target="_blank" rel="noopener"><img src="${esc(asset(LEGAL.guaranteeImage))}" alt="${esc(GUARANTEE_ALT)}" width="884" height="1200" loading="lazy"></a><p class="meta">Official notice under Regulation (EU) 2025/1960, Annex I. <a href="${LEGAL.guaranteeInfo}" target="_blank" rel="noopener">More about legal guarantees</a></p></section>`;}
    lineNotice(line) {
      if(line.productId===YS_ID||(line.customText||[]).length)return `<div class="line-legal" data-line-legal="personalised"><strong>Personalised physical product</strong>${NOTICE_PERSONALISED.map(t=>`<p>${esc(t)}</p>`).join('')}</div>`;
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
      if(['shop','product','cart'].includes(context.mode))return {mode:context.mode,productId:context.productId||null,categorySlug:context.categorySlug||null};
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
      return `<article class="${feature?'feature':'card'}"><div class="tile ${product.imageFit==='cover'?'cover':''} ${product.visualOverlay?'audio-device-card':''}">${source?`<img class="tile-photo" src="${esc(source)}" alt="" decoding="async">`:''}</div><div class="${feature?'feature-copy':'card-copy'}"><span class="type">${esc(product.typeLine)}</span><span class="product-name">${esc(product.name)}</span>${feature?`<p>${esc(product.description)}</p>`:''}<span class="place">${esc(product.place)}</span><div class="card-bottom"><span class="price">${sk('sk-price')}</span>${sk('sk-button')}</div></div></article>`;
    }
    skeletonShop(route,model) {
      const category=['berlin-landmark-posters','berlin-reels-collection'].includes(route.categorySlug)?'print':'all';
      const filter=route.categorySlug==='berlin-landmark-posters'?'landmarks':route.categorySlug==='berlin-reels-collection'?'stories':'all';
      const selected=category==='all'?null:model.getCategoryView(category,filter);
      return `${this.skeletonBar(model,selected?category:'all')}<section class="wrap intro"><h1 class="lead">${esc(this.lead())}</h1>${selected?.filters.length?`<nav class="chips"><a>${esc(selected.allFilterLabel)}</a>${selected.filters.map(item=>`<a ${item.id===filter?'aria-current="page"':''}>${esc(item.label)}</a>`).join('')}</nav>`:''}</section>${(selected?[selected]:model.sections).map(section=>`<section class="wrap shelf"><div class="section-head"><div class="section-title"><h2>${esc(section.title)}</h2><span class="meta">${esc(section.description)}</span></div>${section.moreCategoryId?`<a>${esc(section.moreLabel)} →</a>`:''}</div><div class="${section.layout==='feature'?'feature-grid':'grid'}${selected?' category-grid':''}">${section.products.map(product=>this.skeletonCard({...product,imageFit:product.imageFit||section.imageFit},section.layout==='feature')).join('')}</div></section>`).join('')}<section class="wrap visual-credit-wrap">${sk('sk-credit')}</section>`;
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
    change(event) {const field=event.target;if(!field.closest?.('[data-address-form]'))return;if(field.matches('[name="country"]'))this.input(event);this.queueAutoQuote(true);}
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
      const category=event.target.closest('[data-category]'),filter=event.target.closest('[data-filter]');
      if(category){event.preventDefault();if(this.context.mode!=='shop'){location.assign('https://walkofberlin.com/category/all-products');return;}this.category=this.model.normaliseCategoryId(category.dataset.category);this.filter='all';this.render();return;}
      if(filter){event.preventDefault();this.filter=filter.dataset.filter;this.render();return;}
      const button=event.target.closest('[data-action]');if(!button)return;
      const action=button.dataset.action;
      if(action==='close-drawer'){this.shadowRoot.querySelector('dialog').close();return;}
      if(action==='poster'||action==='wall'||action==='video'){this.view=action;this.render();if(action==='video')this.shadowRoot.querySelector('video.room')?.play?.().catch(()=>{});return;}
      if(action==='product-minus'||action==='product-plus'){this.quantity=Math.max(1,Math.min(99,this.quantity+(action==='product-plus'?1:-1)));this.render();return;}
      if(action==='shipping'){const choice=this.quote?.choices?.[Number(button.dataset.index)],same=!!choice&&!!this.selection&&choice.carrierId===this.selection.carrierId&&choice.code===this.selection.code;if(choice&&!same&&!this.busy&&!this.quoting&&!this.uncertain){this.choiceList={signature:this.cart.signature,choices:this.quote.choices};this.selection={carrierId:choice.carrierId,code:choice.code};this.quote=null;this.quoteError='';this.failedKey='';await this.getQuote(true);}return;}
      if(action==='retry-quote'){if(!this.busy&&!this.quoting&&!this.uncertain){this.quoteError='';this.failedKey='';await this.getQuote(true);}return;}
      if(action==='native-fallback'){releaseNative();this.request('native-fallback').catch(()=>{});return;}
      if(this.busy)return;
      if(this.uncertain&&action!=='refresh'){this.error='UPDATE_NOT_CONFIRMED';this.render();return;}
      this.busy=true;this.error='';this.render();
      try {
        if(action==='refresh')await this.request('get');
        if(action==='ys-add'){if(!this.ysMod.readyToAdd(this.ys))throw Error('YS_NOT_READY');await this.request('add',{productId:this.ysMod.YS_PRODUCT_ID,quantity:1,customTextFields:this.ysMod.buildCustomText(this.ys)});this.lastAddedId=this.ysMod.YS_PRODUCT_ID;this.notice='Added to your cart';this.render();const dialog=this.shadowRoot.querySelector('dialog');if(this.revealed){dialog.showModal();dialog.querySelector('[data-action="close-drawer"]').focus();}}
        if(action==='add'){await this.request('add',{productId:button.dataset.product,quantity:Number(button.dataset.quantity)||1});this.lastAddedId=button.dataset.product;this.notice='Added to your cart';this.render();const dialog=this.shadowRoot.querySelector('dialog');if(this.revealed){dialog.showModal();dialog.querySelector('[data-action="close-drawer"]').focus();}}
        if(action==='minus'||action==='plus'){const line=this.cart?.lines.find(line=>line.lineItemId===button.dataset.line);if(line)await this.request('update',{lineItemId:line.lineItemId,quantity:line.quantity+(action==='plus'?1:-1)});}
        if(action==='remove')await this.request('remove',{lineItemId:button.dataset.line});
        if(action==='checkout'&&this.quote?.state==='READY')await this.request('checkout',{quoteInput:this.quoteInput()});
      }catch(error){this.error=error.message;}finally{this.busy=false;this.render();}
    }
  }
  customElements.define('bw-storefront', BWStorefront);
})();
