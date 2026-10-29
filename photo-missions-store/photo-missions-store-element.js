// Hidden Berlin Photo Missions as a store product page (Yusuf, 29 Oct 2026: "bu sayfayı da elden geçir ... baştan yarat").
// Replaces the app.berlinwalk.com iframe on /products/hidden-berlin-photo-missions with a light-DOM page in the store
// layout (same system as trip-planner-store). Checkout is unchanged: the email form posts photoMissionsStartCheckout to
// app.berlinwalk.com/api/rescue-plan (CORS allows www.walkofberlin.com), which returns the hosted Stripe checkout URL;
// delivery stays on app.berlinwalk.com/hidden-berlin-photo-missions/. Same tracking events as the old landing.
(() => {
  const TAG = 'bw-photo-missions-store';
  if (customElements.get(TAG)) return;
  const SRC = document.currentScript && document.currentScript.src;
  const BASE = SRC ? new URL('./', SRC).href : 'https://fenerszymanski.github.io/berlinwalk-widgets/photo-missions-store/';
  const ROOT = new URL('../', BASE).href;
  const Q = SRC && new URL(SRC).search || '';
  const asset = (name) => BASE + 'assets/' + name + Q;
  const APP = 'https://app.berlinwalk.com';
  const API = APP + '/api/rescue-plan';
  const SITE = 'https://walkofberlin.com';
  const PRICE = '€3.99';
  const SLUG = 'hidden-berlin-photo-missions';
  const NAME = 'Hidden Berlin Photo Missions';

  const STORE_LINKS = [
    ['All products', '/category/all-products?tab=all'],
    ['Posters', '/category/all-products?tab=print'],
    ['Personalised prints', '/product-page/your-berlin-street-in-1928-personalised-aerial-print-30-x-40-cm'],
    ['2027 Wall Calendar', '/product-page/berlin-2027-wall-calendar-a3'],
    ['Audio walks', '/category/all-products?tab=audio'],
    ['Guides', '/category/all-products?tab=guides'],
  ];
  const GALLERY = [
    { img: 'sample-cover-howto.webp', alt: 'Cover card of Hidden Berlin Photo Missions: 10 photo missions from Anhalter Bahnhof to Alexanderplatz', label: 'Show the cover card', fit: 'contain' },
    { img: 'sample-card-1.webp', alt: 'Mission 1 card: the surviving Anhalter Bahnhof portal, with a QR map link', label: 'Show mission 1', fit: 'contain' },
    { img: 'sample-card-2.webp', alt: 'Mission 2 card: a Cold War watchtower between office buildings, with a QR map link', label: 'Show mission 2', fit: 'contain' },
    { img: 'hackescher-markt.webp', alt: 'Hackescher Markt S-Bahn station, near the end of the route', label: 'Show a photo from the route', fit: 'cover' },
  ];
  const FACTS = [['10', 'exact stops'], ['~5 km', 'at your pace'], ['PDF', 'phone or print']];
  const INSIDE = [
    ['10 exact stops', 'Each card has one place, one detail to find and a QR map link.'],
    ['About 5 km', 'From Anhalter Bahnhof to Alexanderplatz at walking pace. Plan about two hours with photo and coffee stops.'],
    ['Phone or print', 'Keep it open on your phone or print the cards before you leave.'],
    ['No spoilers', 'Cards 3 to 10 stay sealed until you buy.'],
  ];
  const FAQ = [
    ['Do I need a printer?', 'No. The PDF works on your phone. Printing is nice if you want physical cards.'],
    ['Is it good with kids?', 'Yes, especially curious kids around 10+. The route is outdoors and the missions are visual.'],
    ['How long is it?', 'About 5 km. Plan around two hours if you stop for photos and coffee.'],
    ['Does it spoil the audio walk?', 'No. The PDF gives the hunt. The Hidden Berlin audio walk gives the stories behind the same streets.'],
    ['Can I share it with my group?', 'Yes, share it inside your own walking group. Please do not repost the PDF publicly.'],
  ];
  const MORE = [
    ['Hidden Berlin Audio Walk', '€9.90', '/products/hidden-berlin-audio-route', 'https://app.berlinwalk.com/assets/hidden-berlin-audio-route/photos/generated/hidden-berlin-premium-hero-v1.jpg'],
    ['Berlin First-Day Rescue Plan', '€4.99', '/products/berlin-first-day-rescue-plan', ROOT + 'storefront/20261022-c4/assets/guide-rescue.jpg'],
    ['Berlin Landmarks Guide', '€2.99', '/products/berlin-landmarks-guide', ROOT + 'storefront/20261022-c4/assets/guide-landmarks.jpg'],
  ];
  const CREDITS = '<p>Hackescher Markt photo: own photograph by Yusuf Ucuz, all rights reserved.</p><p>Card images: pages of the Hidden Berlin Photo Missions PDF.</p>';
  const STORE_LOGO = "<svg class=\"bwpm-store-logo\" viewBox=\"0 0 160 60\" aria-hidden=\"true\" focusable=\"false\"><rect x=\"1.75\" y=\"1.75\" width=\"156.5\" height=\"56.5\" rx=\"5\" fill=\"#fff\" stroke=\"currentColor\" stroke-width=\"3.5\"/><svg x=\"8\" y=\"12\" width=\"36\" height=\"36\" viewBox=\"0 0 512 512\"><circle cx=\"256\" cy=\"256\" r=\"248\" fill=\"#1B5E20\"/><circle cx=\"256\" cy=\"256\" r=\"230\" fill=\"#7CB342\"/><circle cx=\"256\" cy=\"256\" r=\"218\" fill=\"#FFE600\"/><g transform=\"translate(-1135.53 -150.39) scale(1.12745)\"><path fill=\"#1B5E20\" fill-rule=\"evenodd\" d=\"M1212.07 282.39C1211.92 286.31 1190.84 312.83 1187.00 317.90C1164.84 347.06 1143.63 377.01 1122.57 407.00C1115.75 416.71 1108.20 426.11 1102.03 436.29C1099.78 439.99 1096.00 444.08 1097.39 448.81C1098.66 453.17 1104.84 455.08 1108.11 457.63C1105.89 463.74 1079.86 478.77 1085.72 489.68C1090.06 497.75 1103.61 498.26 1111.34 498.93C1135.80 501.07 1160.08 499.88 1184.19 495.99C1224.36 489.52 1268.32 473.00 1301.01 448.43C1321.28 433.19 1335.92 417.38 1333.82 390.39C1333.26 383.20 1329.11 374.56 1323.68 369.80C1320.42 366.94 1314.49 364.61 1312.73 360.63C1315.36 357.99 1329.43 352.46 1334.10 349.67C1346.05 342.55 1359.52 331.07 1368.58 320.55C1373.59 314.72 1378.79 308.19 1382.11 301.20C1395.51 272.91 1382.64 247.70 1354.30 237.49C1317.72 224.30 1271.49 227.49 1234.04 234.97C1224.29 236.91 1201.90 239.90 1194.39 245.64C1183.71 253.80 1203.33 277.58 1212.07 282.39Z M1165.94 445.61C1172.95 432.71 1185.37 418.17 1194.11 405.91C1201.59 395.44 1208.23 384.13 1216.18 374.02C1222.46 373.37 1229.55 373.04 1235.81 373.99C1238.97 374.47 1242.21 375.64 1245.39 375.84C1254.72 376.43 1281.14 381.63 1287.76 388.07C1289.78 390.03 1290.32 392.62 1290.06 395.34C1289.13 405.19 1279.67 411.64 1272.71 417.14C1252.72 432.92 1221.68 438.53 1197.44 443.34C1190.62 444.69 1171.99 448.11 1165.94 445.61Z M1356.98 280.17C1356.21 289.92 1340.98 300.61 1333.10 305.22C1312.66 317.19 1291.59 326.23 1268.41 331.35C1260.25 333.15 1251.62 336.69 1243.18 335.98C1242.93 330.59 1260.78 309.59 1264.54 303.45C1272.22 290.93 1266.93 287.92 1267.92 279.39C1275.54 276.30 1301.00 273.07 1309.63 272.89C1318.20 272.70 1323.48 273.45 1331.38 273.84C1339.47 274.24 1350.72 274.31 1356.98 280.17Z\"/></g></svg><line x1=\"52\" y1=\"8\" x2=\"52\" y2=\"52\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-dasharray=\"3 3\"/><path fill=\"currentColor\" d=\"M68.424 38.764Q66.444 38.764 65.047 38.082Q63.65 37.4 62.77 36.278L64.508 34.474000000000004Q65.366 35.464 66.36699999999999 35.937Q67.368 36.41 68.512 36.41Q69.832 36.41 70.536 35.816Q71.24 35.222 71.24 34.1Q71.24 33.176 70.71199999999999 32.703Q70.184 32.230000000000004 68.93 32.032L67.30199999999999 31.768Q65.168 31.394 64.266 30.217Q63.364 29.04 63.364 27.434Q63.364 25.234 64.794 24.057000000000002Q66.224 22.880000000000003 68.754 22.880000000000003Q70.55799999999999 22.880000000000003 71.86699999999999 23.452Q73.176 24.024 73.968 25.014000000000003L72.274 26.818Q71.658 26.092 70.8 25.663Q69.942 25.234 68.776 25.234Q66.268 25.234 66.268 27.302Q66.268 28.182000000000002 66.79599999999999 28.644000000000002Q67.324 29.106 68.6 29.326L70.206 29.612000000000002Q72.208 29.986 73.176 31.086Q74.144 32.186 74.144 33.902Q74.144 34.980000000000004 73.77000000000001 35.871Q73.396 36.762 72.67 37.411Q71.944 38.06 70.87700000000001 38.412000000000006Q69.81 38.764 68.424 38.764ZM87.23 25.520000000000003V38.5H84.37V25.520000000000003H79.75V23.144H91.85V25.520000000000003ZM103.0 38.764Q101.504 38.764 100.404 38.225Q99.304 37.686 98.589 36.674Q97.87400000000001 35.662 97.53300000000002 34.188Q97.19200000000001 32.714 97.19200000000001 30.822Q97.19200000000001 28.951999999999998 97.53300000000002 27.467Q97.87400000000001 25.982 98.589 24.97Q99.304 23.958 100.404 23.419Q101.504 22.880000000000003 103.0 22.880000000000003Q105.992 22.880000000000003 107.4 24.970000000000002Q108.808 27.060000000000002 108.808 30.822Q108.808 34.584 107.4 36.67400000000001Q105.992 38.764 103.0 38.764ZM103.0 36.41Q103.77000000000001 36.41 104.298 36.113Q104.82600000000001 35.816 105.14500000000001 35.266000000000005Q105.464 34.716 105.607 33.913Q105.75 33.11 105.75 32.12V29.502000000000002Q105.75 27.522 105.14500000000001 26.378Q104.54 25.234 103.0 25.234Q101.46000000000001 25.234 100.855 26.378Q100.25 27.522 100.25 29.502000000000002V32.142Q100.25 34.122 100.855 35.266Q101.46000000000001 36.41 103.0 36.41ZM118.242 38.5H115.36000000000001V23.144H121.19000000000001Q123.43400000000001 23.144 124.62200000000001 24.42Q125.81 25.696 125.81 27.896Q125.81 29.59 125.029 30.744999999999997Q124.248 31.9 122.796 32.208L126.07400000000001 38.5H122.906L119.98 32.538H118.242ZM120.596 30.294Q121.762 30.294 122.268 29.820999999999998Q122.774 29.348 122.774 28.314V27.478Q122.774 26.444000000000003 122.268 25.971000000000004Q121.762 25.498 120.596 25.498H118.242V30.294ZM132.626 38.5V23.144H142.328V25.520000000000003H135.508V29.524H142.086V31.9H135.508V36.124H142.328V38.5Z\"/></svg><span class=\"sr-only\">Walk of Berlin Store</span>"; // same mark as the storefront bar
  const CHECK = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1B5E20" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>';

  const CSS = `
@font-face{font-family:'BWTP Fraunces';src:url('${ROOT}home-two-doors/assets/fonts/Fraunces-Variable-latin.woff2') format('woff2');font-weight:100 900;font-display:swap}
@font-face{font-family:'BWTP Grotesk';src:url('${ROOT}home-two-doors/assets/fonts/SpaceGrotesk-Variable-latin.woff2') format('woff2');font-weight:300 700;font-display:swap}
${TAG}{display:block;width:100%;max-width:100%;min-width:0;pointer-events:auto}
.bwpm{--cream:#FAFAF5;--ink:#2B3128;--green:#123D18;--leaf:#1B5E20;--muted:#5A6455;--tile:#EFEFEA;--line:#E2E2DA;--panel:#F1F1EA;--yellow:#FFE600;--serif:'BWTP Fraunces',Fraunces,Georgia,serif;background:var(--cream);color:var(--ink);font:400 16px/1.55 'BWTP Grotesk','Space Grotesk',system-ui,sans-serif;-webkit-font-smoothing:antialiased;padding-bottom:72px}
.bwpm *{box-sizing:border-box}
.bwpm a{color:var(--green);text-underline-offset:4px}.bwpm a:hover{color:var(--leaf)}
.bwpm img{display:block;max-width:100%}
.bwpm :is(a,button,summary,input):focus-visible{outline:3px solid var(--leaf);outline-offset:3px}
.bwpm h1,.bwpm h2{font-family:var(--serif);font-weight:600;color:var(--green);line-height:1.08;margin:0}
.bwpm p{margin:0}
.bwpm-wrap{max-width:1264px;margin:0 auto;padding-inline:32px}
.bwpm-bar{background:var(--panel);border-bottom:1px solid var(--line)}
.bwpm-bar .bwpm-wrap{display:flex;align-items:center;gap:26px;min-height:64px}
.bwpm-store-home{display:flex;align-items:center;flex-shrink:0;min-height:44px;text-decoration:none}
.bwpm-store-home{color:var(--green)}.bwpm-store-logo{display:block;width:104px;height:39px}
.bwpm .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.bwpm-tabs{display:flex;gap:24px;overflow-x:auto;scrollbar-width:none;min-width:0;flex:1}
.bwpm-tabs::-webkit-scrollbar{display:none}
.bwpm-tabs a{display:flex;align-items:center;min-height:64px;white-space:nowrap;text-decoration:none;color:var(--ink);font-size:15px;border-bottom:2px solid transparent}
.bwpm-tabs a[aria-current]{color:var(--green);font-weight:700;border-color:var(--green)}
.bwpm-cart{flex-shrink:0;font-size:15px;font-weight:600;text-decoration:none;min-height:44px;display:flex;align-items:center}
.bwpm-crumb{font-size:14px;color:var(--muted);padding:20px 0 18px}
.bwpm-crumb a{color:var(--muted)}
.bwpm-product{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);grid-template-areas:"gallery head" "gallery buy";grid-template-rows:auto 1fr;gap:0 64px;align-items:start}
.bwpm-head{grid-area:head;display:flex;flex-direction:column;gap:14px;padding-top:6px}
.bwpm-gallery{grid-area:gallery;display:flex;flex-direction:column;gap:12px;min-width:0}
.bwpm-buy{grid-area:buy;display:flex;flex-direction:column;gap:16px;padding-top:16px;min-width:0}
.bwpm-eyebrow{font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.bwpm h1{font-size:clamp(36px,4vw,50px)}
.bwpm-lede{font-size:19px;line-height:1.45}
.bwpm-price{font-family:var(--serif);font-size:32px;font-weight:600;color:var(--green);line-height:1.1}
.bwpm-stage{border-radius:14px;overflow:hidden;background:var(--tile);border:1px solid var(--line);aspect-ratio:4/3;display:flex;align-items:center;justify-content:center}
.bwpm-stage img{width:100%;height:100%;object-fit:cover}
.bwpm-stage img[data-fit=contain]{width:88%;height:auto;object-fit:contain;border-radius:8px;box-shadow:0 10px 28px rgba(18,61,24,.16)}
.bwpm-thumbs{display:flex;gap:10px}
.bwpm-thumbs button{width:84px;height:84px;padding:0;border:1px solid var(--line);border-radius:10px;overflow:hidden;background:#fff;cursor:pointer}
.bwpm-thumbs button[aria-pressed=true]{border:2px solid var(--green)}
.bwpm-thumbs img{width:100%;height:100%;object-fit:cover}
.bwpm-facts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.bwpm-facts div{display:flex;flex-direction:column;padding:12px 14px;border:1px solid var(--line);border-radius:12px;background:#fff}
.bwpm-facts b{font-size:18px;color:var(--green)}.bwpm-facts span{font-size:13px;color:var(--muted)}
.bwpm-form{display:flex;flex-direction:column;gap:12px}
.bwpm-form label.bwpm-field{display:flex;flex-direction:column;gap:6px;font-size:15px;font-weight:700}
.bwpm-form input[type=email]{min-height:52px;padding:12px 16px;border:1.5px solid #B8BDAE;border-radius:12px;background:#fff;font:inherit;font-size:16px;color:var(--ink)}
.bwpm-form input[type=email]:focus{border-color:var(--green);outline:none;box-shadow:0 0 0 3px rgba(27,94,32,.18)}
.bwpm-check{display:flex;gap:10px;align-items:flex-start;font-size:14px;color:var(--muted);line-height:1.45;cursor:pointer}
.bwpm-check input{width:18px;height:18px;margin:2px 0 0;flex-shrink:0;accent-color:var(--green)}
.bwpm button.bwpm-cta,.bwpm a.bwpm-cta{display:flex;align-items:center;justify-content:center;width:100%;min-height:58px;padding:12px 20px;border:0;border-radius:999px;background:var(--yellow);color:#102414;font:inherit;font-size:17px;font-weight:700;text-decoration:none;text-align:center;cursor:pointer}
.bwpm .bwpm-cta:hover{filter:brightness(.97);color:#102414}
.bwpm .bwpm-cta:disabled{cursor:wait;opacity:.7}
.bwpm-status{min-height:20px;font-size:14px;font-weight:600;color:var(--leaf)}
.bwpm-status[data-error]{color:#8A1C1C}
.bwpm-fine{font-size:14px;color:var(--muted);line-height:1.5}
.bwpm-fine a{color:var(--muted)}
.bwpm-maker{display:flex;align-items:center;gap:12px;padding:14px;border-radius:12px;background:var(--panel);font-size:14px;line-height:1.4}
.bwpm-maker img{width:48px;height:48px;border-radius:50%;object-fit:cover;flex-shrink:0}
.bwpm-section{margin-top:72px}
.bwpm-section h2{font-size:34px}
.bwpm-sub{margin-top:8px;color:var(--muted);font-size:16px}
.bwpm-try{margin:22px auto 0;max-width:680px}
.bwpm-try iframe{display:block;width:100%;height:1080px;border:0}
.bwpm-inside{list-style:none;margin:22px 0 0;padding:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px}
.bwpm-inside li{display:flex;flex-direction:column;gap:8px;padding:22px;border-radius:14px;background:#fff;border:1px solid var(--line)}
.bwpm-inside b{display:flex;gap:8px;align-items:center;font-size:17px}.bwpm-inside span{font-size:15px;color:var(--muted)}
.bwpm-split{display:grid;grid-template-columns:420px minmax(0,1fr);gap:64px;align-items:start}
.bwpm-maker-big{display:flex;gap:20px;align-items:center}
.bwpm-maker-big img{width:96px;height:96px;border-radius:50%;object-fit:cover;flex-shrink:0}
.bwpm-maker-big p{font-size:17px;line-height:1.6}
.bwpm-faq details{border-top:1px solid var(--line);padding:16px 0}
.bwpm-faq details:last-child{border-bottom:1px solid var(--line)}
.bwpm-faq summary{list-style:none;cursor:pointer;font-size:16px;font-weight:700;display:flex;justify-content:space-between;gap:16px}
.bwpm-faq summary::-webkit-details-marker{display:none}
.bwpm-faq summary::after{content:'+';font-size:20px;line-height:1;color:var(--green)}
.bwpm-faq details[open] summary::after{content:'–'}
.bwpm-faq p{margin-top:8px;font-size:15px}
.bwpm-more{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px;margin-top:20px}
.bwpm-more a{display:flex;flex-direction:column;gap:6px;text-decoration:none;color:var(--ink)}
.bwpm-more img{width:100%;height:auto;aspect-ratio:5/6;object-fit:cover;border-radius:10px;background:var(--tile)}
.bwpm-more b{font-size:16px;color:var(--green)}.bwpm-more span{font-size:14px;color:var(--muted)}
.bwpm-more a.bwpm-all{align-items:center;justify-content:center;aspect-ratio:5/6;border:1.5px solid var(--green);border-radius:10px;font-weight:700;color:var(--green)}
.bwpm-legal{margin-top:56px;padding-top:20px;border-top:1px solid var(--line);font-size:13px;color:var(--muted);display:flex;flex-wrap:wrap;gap:6px 18px}
.bwpm-legal a{color:var(--muted)}
.bwpm-sticky{position:fixed;left:0;right:0;bottom:0;z-index:40;display:none;align-items:center;gap:12px;padding:10px 16px calc(10px + env(safe-area-inset-bottom));background:var(--cream);border-top:1px solid var(--line);box-shadow:0 -6px 18px rgba(18,61,24,.1)}
.bwpm-sticky span{font-size:14px;line-height:1.25}.bwpm-sticky strong{display:block;font-size:17px;color:var(--green)}
.bwpm-sticky .bwpm-cta{flex:1;width:auto;min-height:50px;font-size:16px}
@media (max-width:1100px){.bwpm-product{gap:0 36px}.bwpm-split{grid-template-columns:1fr;gap:28px}.bwpm-inside{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:820px){
.bwpm-wrap{padding-inline:16px}
.bwpm-bar .bwpm-wrap{flex-wrap:wrap;gap:0 14px;padding-top:8px;min-height:0}
.bwpm-store-logo{width:92px;height:34.5px}
.bwpm-cart{margin-left:auto;font-size:14px}
.bwpm-tabs{order:3;flex-basis:100%;gap:20px}.bwpm-tabs a{min-height:48px;font-size:14px}
.bwpm-crumb{font-size:12px;padding:14px 0}
.bwpm-product{display:flex;flex-direction:column}
.bwpm-head{order:0;gap:10px;padding:0 0 16px}
.bwpm-gallery{order:1}
.bwpm-buy{order:2;padding-top:20px}
.bwpm h1{font-size:34px}.bwpm-lede{font-size:17px}.bwpm-price{font-size:28px}
.bwpm-thumbs button{width:64px;height:64px}
.bwpm-facts div{padding:10px}.bwpm-facts b{font-size:16px}.bwpm-facts span{font-size:12px}
.bwpm-section{margin-top:48px}.bwpm-section h2{font-size:28px}
.bwpm-try iframe{height:900px}
.bwpm-inside{grid-template-columns:1fr;gap:12px}.bwpm-inside li{padding:18px}
.bwpm-maker-big img{width:72px;height:72px}.bwpm-maker-big p{font-size:16px}
.bwpm-more{display:flex;overflow-x:auto;gap:14px;padding-bottom:8px;scroll-snap-type:x proximity}
.bwpm-more a{flex:0 0 160px;scroll-snap-align:start}
.bwpm-sticky[data-show]{display:flex}
}`;

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const stored = (key, value) => {
    try {
      if (value) { localStorage.setItem(key, value); return value; }
      return localStorage.getItem(key) || '';
    } catch (e) { return value || ''; }
  };
  const makeId = (p) => p + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  const sessionId = stored('bwPhotoMissionsSession') || makeId('pms');
  const visitorId = stored('bwVisitorId') || makeId('vis');
  stored('bwPhotoMissionsSession', sessionId);
  stored('bwVisitorId', visitorId);
  const eventBase = (payload) => ({
    sessionId, visitorId,
    pagePath: location.pathname, pageUrl: location.href, referrer: document.referrer || '', landingPage: location.href,
    screenWidth: String(screen && screen.width || ''), viewportWidth: String(innerWidth || ''),
    timestamp: new Date().toISOString(), sourceContext: 'hidden_berlin_photo_missions',
    payload: { productSlug: SLUG, productName: NAME, price: PRICE, surface: 'store_page', ...(payload || {}) },
  });
  const post = (body) => fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), credentials: 'omit' });
  // Same first-party events the iframe landing sent, so the Photo Missions funnel reads on.
  const track = (eventName, payload) => post({ ...eventBase(payload), action: 'photoMissionsTrack', eventName }).catch(() => null);

  class BWPhotoMissionsStore extends HTMLElement {
    connectedCallback() {
      if (this._ready) return;
      this._ready = true;
      this._shot = 0;
      if (!document.getElementById('bwpm-css')) {
        const style = document.createElement('style');
        style.id = 'bwpm-css';
        style.textContent = CSS;
        document.head.appendChild(style);
      }
      window.__bwStoreCreditsHtml = CREDITS;
      this.render();
      this._bind();
      track('photo_missions_landing_view', { location: 'store_page' });
      if (new URLSearchParams(location.search).get('checkout') === 'cancelled') this._status('Checkout was cancelled. Nothing was charged; you can try again.', true);
    }

    disconnectedCallback() {
      if (this._io) this._io.disconnect();
      if (window.__bwStoreCreditsHtml === CREDITS) window.__bwStoreCreditsHtml = '';
      this._ready = false;
    }

    render() {
      const g = GALLERY[this._shot];
      this.innerHTML = `<div class="bwpm">
<nav class="bwpm-bar" aria-label="Store"><div class="bwpm-wrap">
<a class="bwpm-store-home" href="${SITE}/category/all-products?tab=all" aria-label="Store home">${STORE_LOGO}</a>
<div class="bwpm-tabs">${STORE_LINKS.map(([l, h]) => `<a href="${SITE}${h}"${l === 'Guides' ? ' aria-current="true"' : ''}>${l}</a>`).join('')}</div>
<a class="bwpm-cart" href="${SITE}/cart-page">Cart</a>
</div></nav>
<div class="bwpm-wrap">
<nav class="bwpm-crumb" aria-label="Breadcrumb"><a href="${SITE}/category/all-products?tab=all">Store</a> / <a href="${SITE}/category/all-products?tab=guides">Guides</a> / ${NAME}</nav>
<section class="bwpm-product">
<div class="bwpm-head">
<span class="bwpm-eyebrow">Self-guided photo hunt · Instant PDF</span>
<h1>${NAME}</h1>
<p class="bwpm-lede">Turn Berlin's hidden centre into a photo hunt: 10 missions from Anhalter Bahnhof to Alexanderplatz.</p>
<span class="bwpm-price">${PRICE}</span>
</div>
<div class="bwpm-gallery">
<div class="bwpm-stage"><img src="${asset(g.img)}" alt="${esc(g.alt)}" data-fit="${g.fit}" width="1100" height="755" fetchpriority="high"></div>
<div class="bwpm-thumbs">${GALLERY.map((s, i) => `<button type="button" data-bwpm-shot="${i}" aria-label="${s.label}" aria-pressed="${i === this._shot}"><img src="${asset(s.img)}" alt="" loading="lazy"></button>`).join('')}</div>
</div>
<div class="bwpm-buy" id="bwpm-buy">
<div class="bwpm-facts">${FACTS.map(([b, s]) => `<div><b>${b}</b><span>${s}</span></div>`).join('')}</div>
<form class="bwpm-form" data-bwpm-form novalidate>
<label class="bwpm-field">Email for the delivery link<input type="email" name="email" inputmode="email" autocomplete="email" required placeholder="you@example.com" data-bwpm-email></label>
<label class="bwpm-check"><input type="checkbox" name="marketingConsent" data-bwpm-consent><span>Send me occasional route updates from Walk of Berlin and practical Berlin tips. No spam.</span></label>
<button class="bwpm-cta" type="submit" data-bwpm-submit>Get the PDF · ${PRICE}</button>
<p class="bwpm-status" role="status" aria-live="polite" data-bwpm-status></p>
</form>
<p class="bwpm-fine">Secure checkout with Stripe. The PDF opens right after payment and the delivery email follows as a backup. 14-day refund if it feels generic, outdated or unusable. <a href="${APP}/product-terms">Digital Product Terms</a></p>
<div class="bwpm-maker"><img src="${ROOT}trip-planner-store/assets/yusuf.webp${Q}" alt="Yusuf, the Berlin guide behind Walk of Berlin" width="48" height="48" loading="lazy"><span><strong>Made by Yusuf, a Berlin guide</strong><br>9.8/10 from 28 reviews on FreeTour</span></div>
</div>
</section>
<section class="bwpm-section" aria-labelledby="bwpm-try"><h2 id="bwpm-try">Play mission 1 right here</h2><p class="bwpm-sub">The first card is free. Try it before you buy the other nine.</p>
<div class="bwpm-try"><iframe src="${ROOT}photo-missions-teaser/?surface=store-page" title="Try Hidden Berlin Photo Missions, mission 1, free" loading="lazy"></iframe></div></section>
<section class="bwpm-section" aria-labelledby="bwpm-inside"><h2 id="bwpm-inside">Inside the PDF</h2>
<ul class="bwpm-inside">${INSIDE.map(([t, d]) => `<li><b>${CHECK}${t}</b><span>${d}</span></li>`).join('')}</ul></section>
<section class="bwpm-section bwpm-split" aria-labelledby="bwpm-faq"><div><h2 id="bwpm-faq">Before you buy</h2>
<div class="bwpm-maker-big" style="margin-top:22px"><img src="${ROOT}trip-planner-store/assets/yusuf.webp${Q}" alt="" width="96" height="96" loading="lazy"><p>I walk these streets with guests. This PDF is for the day you want Berlin to give you a small challenge, not another list of sights.</p></div></div>
<div class="bwpm-faq">${FAQ.map(([q, a], i) => `<details${i === 0 ? ' open' : ''}><summary>${q}</summary><p>${a}</p></details>`).join('')}</div></section>
<section class="bwpm-section" aria-labelledby="bwpm-more"><h2 id="bwpm-more">After the hunt</h2>
<div class="bwpm-more">${MORE.map(([n, p, h, img]) => `<a href="${SITE}${h}"><img src="${img}" alt="" loading="lazy" width="500" height="600"><b>${n}</b><span>${p}</span></a>`).join('')}<a class="bwpm-all" href="${SITE}/category/all-products?tab=guides">All guides →</a></div></section>
<div class="bwpm-legal"><a href="${APP}/product-terms">Digital Product Terms</a><a href="${APP}/withdraw/">Withdraw from contract (Vertrag widerrufen)</a><span>14-day right of withdrawal for digital purchases, see <a href="${APP}/product-terms#withdrawal-function">the terms</a>.</span></div>
</div>
<div class="bwpm-sticky" data-bwpm-sticky aria-hidden="true"><span>Instant PDF<strong>${PRICE}</strong></span><a class="bwpm-cta" href="#bwpm-buy" data-bwpm-jump tabindex="-1">Get the PDF</a></div>
</div>`;
    }

    _status(message, error) {
      const el = this.querySelector('[data-bwpm-status]');
      if (!el) return;
      el.textContent = message || '';
      el.toggleAttribute('data-error', !!error);
    }

    _bind() {
      this.addEventListener('click', (e) => {
        const shot = e.target.closest('[data-bwpm-shot]');
        if (shot) {
          this._shot = Number(shot.dataset.bwpmShot);
          const g = GALLERY[this._shot];
          const img = this.querySelector('.bwpm-stage img');
          img.src = asset(g.img); img.alt = g.alt; img.dataset.fit = g.fit;
          this.querySelectorAll('[data-bwpm-shot]').forEach((b) => b.setAttribute('aria-pressed', b === shot));
          return;
        }
        if (e.target.closest('[data-bwpm-jump]')) {
          e.preventDefault();
          const buy = this.querySelector('#bwpm-buy');
          buy.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => this.querySelector('[data-bwpm-email]').focus({ preventScroll: true }), 450);
          track('photo_missions_sticky_click', { location: 'sticky' });
        }
      });
      const form = this.querySelector('[data-bwpm-form]');
      const email = this.querySelector('[data-bwpm-email]');
      const submit = this.querySelector('[data-bwpm-submit]');
      const idle = submit.textContent;
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const value = email.value.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          this._status('Enter a working email address so I can send the delivery link.', true);
          email.focus();
          return;
        }
        track('photo_missions_checkout_click', { location: 'store_buy_box' });
        if (window.fbq) {
          try { window.fbq('track', 'InitiateCheckout', { content_ids: [SLUG], content_name: NAME, content_type: 'product', value: 3.99, currency: 'EUR' }, { eventID: sessionId + ':photo_missions_checkout_click' }); } catch (_) {}
        }
        submit.disabled = true;
        submit.textContent = 'Opening secure checkout…';
        this._status('');
        post({
          ...eventBase({ location: 'store_buy_box' }),
          action: 'photoMissionsStartCheckout',
          email: value,
          marketingConsent: !!this.querySelector('[data-bwpm-consent]').checked,
          marketingConsentSource: 'photo_missions_checkout',
          deliveryUrl: APP + '/hidden-berlin-photo-missions/',
          mock: 'false',
        }).then((r) => r.json().then((json) => {
          if (!r.ok || !json.ok || !json.checkoutUrl) throw new Error(json.message || json.error || 'Checkout is not available right now.');
          return json;
        })).then((json) => {
          track('photo_missions_payment_started', { orderId: json.orderId || '', mock: false });
          location.href = json.checkoutUrl;
        }).catch((err) => {
          this._status((err && err.message) || 'Checkout could not open. Please try again.', true);
          submit.disabled = false;
          submit.textContent = idle;
        });
      });
      const buy = this.querySelector('[data-bwpm-submit]');
      const bar = this.querySelector('[data-bwpm-sticky]');
      if ('IntersectionObserver' in window && buy && bar) {
        this._io = new IntersectionObserver(([entry]) => {
          const show = !entry.isIntersecting && entry.boundingClientRect.top < 0;
          bar.toggleAttribute('data-show', show);
          bar.setAttribute('aria-hidden', String(!show));
          bar.querySelector('a').tabIndex = show ? 0 : -1;
        });
        this._io.observe(buy);
      }
    }
  }

  customElements.define(TAG, BWPhotoMissionsStore);

  // Wix mount: the page has no custom element of its own, so the store page goes into the first page section (which held
  // the app iframe); its old content and the SEO text section below are hidden. Wix's fixed editor heights around main are released so the
  // footer follows the content; everything is restored when the visitor leaves the route.
  const ROUTE = '/products/hidden-berlin-photo-missions';
  const onRoute = () => location.pathname.replace(/\/+$/, '').toLowerCase() === ROUTE;
  let fitted = [];
  const release = () => { fitted.reverse().forEach(([el, prop, v, p]) => (v ? el.style.setProperty(prop, v, p) : el.style.removeProperty(prop))); fitted = []; };
  const fit = (node) => {
    const set = (el, prop, value) => { fitted.push([el, prop, el.style.getPropertyValue(prop), el.style.getPropertyPriority(prop)]); el.style.setProperty(prop, value, 'important'); };
    for (let n = node.parentElement; n && n.id !== 'SITE_PAGES' && n !== document.body; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (parseFloat(cs.minHeight) > 0) set(n, 'min-height', '0');
      if (parseFloat(cs.height) > node.offsetHeight + 40) set(n, 'height', 'auto');
      const rows = cs.gridTemplateRows;
      if (rows && rows !== 'none' && /\d{4,}(\.\d+)?px/.test(rows)) set(n, 'grid-template-rows', rows.split(' ').map((t, i, a) => (i === 0 && a.length > 1 ? t : 'auto')).join(' '));
    }
    if (getComputedStyle(node.parentElement).pointerEvents === 'none') set(node.parentElement, 'pointer-events', 'auto');
  };
  const mount = () => {
    const html = document.documentElement;
    const main = document.querySelector('main[id^="PAGE_SECTIONS"]');
    const existing = document.querySelector(TAG);
    if (!onRoute()) {
      if (existing) { existing.remove(); release(); }
      html.removeAttribute('data-bwpm-page');
      return;
    }
    const host = main && main.querySelector(':scope>section');
    if (!host) return;
    html.setAttribute('data-bwpm-page', '');
    if (existing && existing.parentElement === host) return;
    if (existing) existing.remove();
    release();
    const el = document.createElement(TAG);
    host.appendChild(el);
    fit(el);
  };
  if (!document.getElementById('bwpm-route-css')) {
    const style = document.createElement('style');
    style.id = 'bwpm-route-css';
    style.textContent = `html[data-bwpm-page] main[id^="PAGE_SECTIONS"]>section~section,html[data-bwpm-page] main[id^="PAGE_SECTIONS"]>section:first-of-type>:not(${TAG}){display:none!important}html[data-bwpm-page] main[id^="PAGE_SECTIONS"]>section:first-of-type{display:block!important;height:auto!important;min-height:0!important}`;
    document.head.appendChild(style);
  }
  window.__bwPhotoMissionsStoreMount = mount;
  new MutationObserver(() => mount()).observe(document.documentElement, { childList: true, subtree: true });
  addEventListener('popstate', mount);
  mount();
})();
