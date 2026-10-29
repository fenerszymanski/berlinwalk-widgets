// Berlin Trip Planner as a store product page (Yusuf, 29 Oct 2026: "store düzenine tam entegre ... daha iyi dönüşüm").
// Defines the tag the Wix page already holds (<bw-berlin-trip-planner-page>), so the old V4 landing and its A/B test
// (planner_landing_dates_v2) retire. Light DOM, every class prefixed bwtp-. The site header runs in store mode on this
// route (logo only) and the slim store footer stays visible. Checkout is unchanged: planner.berlinwalk.com hosted Stripe.
(() => {
  const TAG = 'bw-berlin-trip-planner-page';
  if (customElements.get(TAG)) return;
  const SRC = document.currentScript && document.currentScript.src;
  const BASE = SRC ? new URL('./', SRC).href : 'https://fenerszymanski.github.io/berlinwalk-widgets/trip-planner-store/';
  const ROOT = new URL('../', BASE).href;
  const Q = SRC && new URL(SRC).search || '';
  const asset = (name) => BASE + 'assets/' + name + Q;
  const V4 = 'https://planner.berlinwalk.com';
  const SITE = 'https://walkofberlin.com';
  const EXPERIMENT = 'planner_store_v1';

  const BANDS = [
    { id: '1_2_days', days: '1–2 days', note: 'Short break', price: '€7.99', location: 'pricing_1_2' },
    { id: '3_4_days', days: '3–4 days', note: 'Long weekend', price: '€11.99', location: 'pricing_3_4' },
    { id: '5_7_days', days: '5–7 days', note: 'Longer stay', price: '€15.99', location: 'pricing_5_7' },
  ];
  const STORE_LINKS = [
    ['All products', '/category/all-products?tab=all'],
    ['Posters', '/category/all-products?tab=print'],
    ['Personalised prints', '/product-page/your-berlin-street-in-1928-personalised-aerial-print-30-x-40-cm'],
    ['2027 Wall Calendar', '/product-page/berlin-2027-wall-calendar-a3'],
    ['Audio walks', '/category/all-products?tab=audio'],
    ['Guides', '/category/all-products?tab=guides'],
  ];
  const GALLERY = [
    { img: 'webplan.webp', alt: 'A sample day of the private Web plan: timed stops, transfers and lunch near Museum Island', label: 'Show the Web plan', fit: 'top' },
    { img: 'pdf.webp', alt: 'A page of the matching PDF with the same day and nearby food options', label: 'Show the PDF', fit: 'top' },
    { img: 'berlin.webp', alt: 'A yellow U-Bahn train crossing the Oberbaum Bridge in Berlin', label: 'Show a Berlin photo', fit: 'cover' },
  ];
  const STEPS = [
    ['Tell me about your trip', 'Right after payment, add your dates, travellers, where you stay, what is already booked and what you care about.'],
    ['Follow your status page', 'One private page shows where your plan is while both formats are prepared.'],
    ['Get the Web plan and the PDF', 'Use the Web plan online in Berlin and keep the matching PDF offline.'],
  ];
  const INSIDE = ['Day-by-day itinerary', 'Realistic travel time between stops', 'Opening-day and route checks', 'Your preferences and fixed bookings kept', 'Food suggestions nearby', 'Rough admission and meal costs'];
  const FAQ = [
    ['How is the price set?', 'One whole-trip price based on 1–2, 3–4 or 5–7 calendar days. It is not per person and there is no subscription.'],
    ['What do I receive?', 'A practical itinerary with travel times, Maps or public-transport links and opening-day checks where available, as a private Web plan and a matching PDF from the same itinerary.'],
    ['Can I add reservations and preferences?', 'Yes. Add fixed reservations, interests, pace, food and mobility preferences. They guide the plan and stay visible in your review.'],
  ];
  const MORE = [
    ['Berlin First-Day Rescue Plan', '€4.99', '/products/berlin-first-day-rescue-plan', 'guide-rescue.jpg'],
    ['Berlin Landmarks Guide', '€2.99', '/products/berlin-landmarks-guide', 'guide-landmarks.jpg'],
    ['Hidden Berlin Photo Missions', '€3.99', '/products/hidden-berlin-photo-missions', 'guide-photo-missions.jpg'],
  ];
  const STORE_LOGO = "<svg class=\"bwtp-store-logo\" viewBox=\"0 0 160 60\" aria-hidden=\"true\" focusable=\"false\"><rect x=\"1.75\" y=\"1.75\" width=\"156.5\" height=\"56.5\" rx=\"5\" fill=\"#fff\" stroke=\"currentColor\" stroke-width=\"3.5\"/><svg x=\"8\" y=\"12\" width=\"36\" height=\"36\" viewBox=\"0 0 512 512\"><circle cx=\"256\" cy=\"256\" r=\"248\" fill=\"#1B5E20\"/><circle cx=\"256\" cy=\"256\" r=\"230\" fill=\"#7CB342\"/><circle cx=\"256\" cy=\"256\" r=\"218\" fill=\"#FFE600\"/><g transform=\"translate(-1135.53 -150.39) scale(1.12745)\"><path fill=\"#1B5E20\" fill-rule=\"evenodd\" d=\"M1212.07 282.39C1211.92 286.31 1190.84 312.83 1187.00 317.90C1164.84 347.06 1143.63 377.01 1122.57 407.00C1115.75 416.71 1108.20 426.11 1102.03 436.29C1099.78 439.99 1096.00 444.08 1097.39 448.81C1098.66 453.17 1104.84 455.08 1108.11 457.63C1105.89 463.74 1079.86 478.77 1085.72 489.68C1090.06 497.75 1103.61 498.26 1111.34 498.93C1135.80 501.07 1160.08 499.88 1184.19 495.99C1224.36 489.52 1268.32 473.00 1301.01 448.43C1321.28 433.19 1335.92 417.38 1333.82 390.39C1333.26 383.20 1329.11 374.56 1323.68 369.80C1320.42 366.94 1314.49 364.61 1312.73 360.63C1315.36 357.99 1329.43 352.46 1334.10 349.67C1346.05 342.55 1359.52 331.07 1368.58 320.55C1373.59 314.72 1378.79 308.19 1382.11 301.20C1395.51 272.91 1382.64 247.70 1354.30 237.49C1317.72 224.30 1271.49 227.49 1234.04 234.97C1224.29 236.91 1201.90 239.90 1194.39 245.64C1183.71 253.80 1203.33 277.58 1212.07 282.39Z M1165.94 445.61C1172.95 432.71 1185.37 418.17 1194.11 405.91C1201.59 395.44 1208.23 384.13 1216.18 374.02C1222.46 373.37 1229.55 373.04 1235.81 373.99C1238.97 374.47 1242.21 375.64 1245.39 375.84C1254.72 376.43 1281.14 381.63 1287.76 388.07C1289.78 390.03 1290.32 392.62 1290.06 395.34C1289.13 405.19 1279.67 411.64 1272.71 417.14C1252.72 432.92 1221.68 438.53 1197.44 443.34C1190.62 444.69 1171.99 448.11 1165.94 445.61Z M1356.98 280.17C1356.21 289.92 1340.98 300.61 1333.10 305.22C1312.66 317.19 1291.59 326.23 1268.41 331.35C1260.25 333.15 1251.62 336.69 1243.18 335.98C1242.93 330.59 1260.78 309.59 1264.54 303.45C1272.22 290.93 1266.93 287.92 1267.92 279.39C1275.54 276.30 1301.00 273.07 1309.63 272.89C1318.20 272.70 1323.48 273.45 1331.38 273.84C1339.47 274.24 1350.72 274.31 1356.98 280.17Z\"/></g></svg><line x1=\"52\" y1=\"8\" x2=\"52\" y2=\"52\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-dasharray=\"3 3\"/><path fill=\"currentColor\" d=\"M68.424 38.764Q66.444 38.764 65.047 38.082Q63.65 37.4 62.77 36.278L64.508 34.474000000000004Q65.366 35.464 66.36699999999999 35.937Q67.368 36.41 68.512 36.41Q69.832 36.41 70.536 35.816Q71.24 35.222 71.24 34.1Q71.24 33.176 70.71199999999999 32.703Q70.184 32.230000000000004 68.93 32.032L67.30199999999999 31.768Q65.168 31.394 64.266 30.217Q63.364 29.04 63.364 27.434Q63.364 25.234 64.794 24.057000000000002Q66.224 22.880000000000003 68.754 22.880000000000003Q70.55799999999999 22.880000000000003 71.86699999999999 23.452Q73.176 24.024 73.968 25.014000000000003L72.274 26.818Q71.658 26.092 70.8 25.663Q69.942 25.234 68.776 25.234Q66.268 25.234 66.268 27.302Q66.268 28.182000000000002 66.79599999999999 28.644000000000002Q67.324 29.106 68.6 29.326L70.206 29.612000000000002Q72.208 29.986 73.176 31.086Q74.144 32.186 74.144 33.902Q74.144 34.980000000000004 73.77000000000001 35.871Q73.396 36.762 72.67 37.411Q71.944 38.06 70.87700000000001 38.412000000000006Q69.81 38.764 68.424 38.764ZM87.23 25.520000000000003V38.5H84.37V25.520000000000003H79.75V23.144H91.85V25.520000000000003ZM103.0 38.764Q101.504 38.764 100.404 38.225Q99.304 37.686 98.589 36.674Q97.87400000000001 35.662 97.53300000000002 34.188Q97.19200000000001 32.714 97.19200000000001 30.822Q97.19200000000001 28.951999999999998 97.53300000000002 27.467Q97.87400000000001 25.982 98.589 24.97Q99.304 23.958 100.404 23.419Q101.504 22.880000000000003 103.0 22.880000000000003Q105.992 22.880000000000003 107.4 24.970000000000002Q108.808 27.060000000000002 108.808 30.822Q108.808 34.584 107.4 36.67400000000001Q105.992 38.764 103.0 38.764ZM103.0 36.41Q103.77000000000001 36.41 104.298 36.113Q104.82600000000001 35.816 105.14500000000001 35.266000000000005Q105.464 34.716 105.607 33.913Q105.75 33.11 105.75 32.12V29.502000000000002Q105.75 27.522 105.14500000000001 26.378Q104.54 25.234 103.0 25.234Q101.46000000000001 25.234 100.855 26.378Q100.25 27.522 100.25 29.502000000000002V32.142Q100.25 34.122 100.855 35.266Q101.46000000000001 36.41 103.0 36.41ZM118.242 38.5H115.36000000000001V23.144H121.19000000000001Q123.43400000000001 23.144 124.62200000000001 24.42Q125.81 25.696 125.81 27.896Q125.81 29.59 125.029 30.744999999999997Q124.248 31.9 122.796 32.208L126.07400000000001 38.5H122.906L119.98 32.538H118.242ZM120.596 30.294Q121.762 30.294 122.268 29.820999999999998Q122.774 29.348 122.774 28.314V27.478Q122.774 26.444000000000003 122.268 25.971000000000004Q121.762 25.498 120.596 25.498H118.242V30.294ZM132.626 38.5V23.144H142.328V25.520000000000003H135.508V29.524H142.086V31.9H135.508V36.124H142.328V38.5Z\"/></svg><span class=\"sr-only\">Walk of Berlin Store</span>"; // same mark as the storefront bar
  const CHECK = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1B5E20" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>';

  const CSS = `
@font-face{font-family:'BWTP Fraunces';src:url('${ROOT}home-two-doors/assets/fonts/Fraunces-Variable-latin.woff2') format('woff2');font-weight:100 900;font-display:swap}
@font-face{font-family:'BWTP Grotesk';src:url('${ROOT}home-two-doors/assets/fonts/SpaceGrotesk-Variable-latin.woff2') format('woff2');font-weight:300 700;font-display:swap}
${TAG}{display:block;width:100%;min-width:0}
.bwtp{--cream:#FAFAF5;--ink:#2B3128;--green:#123D18;--leaf:#1B5E20;--muted:#5A6455;--tile:#EFEFEA;--line:#E2E2DA;--panel:#F1F1EA;--yellow:#FFE600;--serif:'BWTP Fraunces',Fraunces,Georgia,serif;background:var(--cream);color:var(--ink);font:400 16px/1.55 'BWTP Grotesk','Space Grotesk',system-ui,sans-serif;-webkit-font-smoothing:antialiased;padding-bottom:72px}
.bwtp *{box-sizing:border-box}
.bwtp a{color:var(--green);text-underline-offset:4px}.bwtp a:hover{color:var(--leaf)}
.bwtp img{display:block;max-width:100%}
.bwtp .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.bwtp :is(a,button,summary):focus-visible{outline:3px solid var(--leaf);outline-offset:3px}
.bwtp h1,.bwtp h2{font-family:var(--serif);font-weight:600;color:var(--green);line-height:1.08;margin:0}
.bwtp p{margin:0}
.bwtp-wrap{max-width:1264px;margin:0 auto;padding-inline:32px}
.bwtp-bar{background:var(--panel);border-bottom:1px solid var(--line)}
.bwtp-bar .bwtp-wrap{display:flex;align-items:center;gap:26px;min-height:64px}
.bwtp-store-home{display:flex;align-items:center;color:var(--green);flex-shrink:0;min-height:44px}
.bwtp-store-logo{display:block;width:104px;height:39px}
.bwtp-tabs{display:flex;gap:24px;overflow-x:auto;scrollbar-width:none;min-width:0;flex:1}
.bwtp-tabs::-webkit-scrollbar{display:none}
.bwtp-tabs a{display:flex;align-items:center;min-height:64px;white-space:nowrap;text-decoration:none;color:var(--ink);font-size:15px;border-bottom:2px solid transparent}
.bwtp-tabs a[aria-current]{color:var(--green);font-weight:700;border-color:var(--green)}
.bwtp-cart{flex-shrink:0;font-size:15px;font-weight:600;text-decoration:none;min-height:44px;display:flex;align-items:center}
.bwtp-crumb{font-size:14px;color:var(--muted);padding:20px 0 18px}
.bwtp-crumb a{color:var(--muted)}
.bwtp-product{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);grid-template-areas:"gallery head" "gallery buy";grid-template-rows:auto 1fr;gap:0 64px;align-items:start}
.bwtp-head{grid-area:head;display:flex;flex-direction:column;gap:14px;padding-top:6px}
.bwtp-gallery{grid-area:gallery;display:flex;flex-direction:column;gap:12px;min-width:0}
.bwtp-buy{grid-area:buy;display:flex;flex-direction:column;gap:16px;padding-top:16px;min-width:0}
.bwtp-eyebrow{font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.bwtp h1{font-size:clamp(36px,4vw,52px)}
.bwtp-lede{font-size:19px;line-height:1.45}
.bwtp-price{font-family:var(--serif);font-size:32px;font-weight:600;color:var(--green);line-height:1.1}
.bwtp-stage{border-radius:14px;overflow:hidden;background:var(--tile);border:1px solid var(--line);aspect-ratio:8/7}
.bwtp-stage img{width:100%;height:100%;object-fit:cover;object-position:top}
.bwtp-stage img[data-fit=cover]{object-position:center}
.bwtp-thumbs{display:flex;gap:10px}
.bwtp-thumbs button{width:84px;height:84px;padding:0;border:1px solid var(--line);border-radius:10px;overflow:hidden;background:#fff;cursor:pointer}
.bwtp-thumbs button[aria-pressed=true]{border:2px solid var(--green)}
.bwtp-thumbs img{width:100%;height:100%;object-fit:cover;object-position:top}
.bwtp-q{font-size:15px;font-weight:700;margin-top:4px}
.bwtp-bands{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.bwtp-band{display:flex;flex-direction:column;align-items:flex-start;gap:2px;min-height:92px;padding:12px 14px;border:1px solid #D5D8CF;border-radius:12px;background:#fff;font:inherit;color:var(--ink);text-align:left;cursor:pointer}
.bwtp-band[aria-checked=true]{border:2px solid var(--green);background:var(--panel);padding:11px 13px}
.bwtp-band b{font-size:16px}.bwtp-band span{font-size:13px;color:var(--muted)}.bwtp-band strong{font-size:16px;color:var(--green)}
.bwtp a.bwtp-cta{display:flex;align-items:center;justify-content:center;min-height:58px;padding:12px 20px;border-radius:999px;background:var(--yellow);color:#102414;font-size:17px;font-weight:700;text-decoration:none;text-align:center}
.bwtp a.bwtp-cta:hover{filter:brightness(.97);color:#102414}
.bwtp-fine{font-size:14px;color:var(--muted);line-height:1.5}
.bwtp-maker{display:flex;align-items:center;gap:12px;padding:14px;border-radius:12px;background:var(--panel);font-size:14px;line-height:1.4}
.bwtp-maker img{width:48px;height:48px;border-radius:50%;object-fit:cover;flex-shrink:0}
.bwtp-section{margin-top:72px}
.bwtp-section h2{font-size:34px}
.bwtp-steps{list-style:none;margin:22px 0 0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
.bwtp-steps li{display:flex;flex-direction:column;gap:10px;padding:22px;border-radius:14px;background:#fff;border:1px solid var(--line)}
.bwtp-steps i{font-style:normal;width:32px;height:32px;border-radius:50%;background:var(--green);color:var(--yellow);font-weight:700;display:flex;align-items:center;justify-content:center}
.bwtp-steps b{font-size:17px}.bwtp-steps span{font-size:15px;color:var(--muted)}
.bwtp-split{display:grid;grid-template-columns:420px minmax(0,1fr);gap:64px;align-items:start}
.bwtp-inside{list-style:none;margin:18px 0;padding:0;display:flex;flex-direction:column;gap:12px}
.bwtp-inside li{display:flex;gap:10px;align-items:flex-start}.bwtp-inside svg{flex-shrink:0;margin-top:2px}
.bwtp-sample{font-weight:700}
.bwtp-formats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}
.bwtp-formats figure{margin:0;display:flex;flex-direction:column;gap:8px}
.bwtp-formats img{width:100%;height:auto;aspect-ratio:4/5;object-fit:cover;object-position:top;border-radius:12px;border:1px solid var(--line)}
.bwtp-formats figcaption{font-size:15px;font-weight:700}.bwtp-formats figcaption span{font-weight:400;color:var(--muted)}
.bwtp-faq details{border-top:1px solid var(--line);padding:16px 0}
.bwtp-faq details:last-child{border-bottom:1px solid var(--line)}
.bwtp-faq summary{list-style:none;cursor:pointer;font-size:16px;font-weight:700;display:flex;justify-content:space-between;gap:16px}
.bwtp-faq summary::-webkit-details-marker{display:none}
.bwtp-faq summary::after{content:'+';font-size:20px;line-height:1;color:var(--green)}
.bwtp-faq details[open] summary::after{content:'–'}
.bwtp-faq p{margin-top:8px;font-size:15px}
.bwtp-more{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px;margin-top:20px}
.bwtp-more a{display:flex;flex-direction:column;gap:6px;text-decoration:none;color:var(--ink)}
.bwtp-more img{width:100%;height:auto;aspect-ratio:5/6;object-fit:cover;border-radius:10px;background:var(--tile)}
.bwtp-more b{font-size:16px;color:var(--green)}.bwtp-more span{font-size:14px;color:var(--muted)}
.bwtp-more a.bwtp-all{align-items:center;justify-content:center;aspect-ratio:5/6;border:1.5px solid var(--green);border-radius:10px;font-weight:700;color:var(--green)}
.bwtp-sticky{position:fixed;left:0;right:0;bottom:0;z-index:40;display:none;align-items:center;gap:12px;padding:10px 16px calc(10px + env(safe-area-inset-bottom));background:var(--cream);border-top:1px solid var(--line);box-shadow:0 -6px 18px rgba(18,61,24,.1)}
.bwtp-sticky span{font-size:14px;line-height:1.25}.bwtp-sticky strong{display:block;font-size:17px;color:var(--green)}
.bwtp-sticky a.bwtp-cta{flex:1;min-height:50px;font-size:16px}
@media (max-width:1100px){.bwtp-product{gap:0 36px}.bwtp-split{grid-template-columns:1fr;gap:28px}}
@media (max-width:820px){
.bwtp-wrap{padding-inline:16px}
.bwtp-bar .bwtp-wrap{flex-wrap:wrap;gap:0 14px;padding-top:8px;min-height:0}
.bwtp-store-logo{width:92px;height:34.5px}
.bwtp-cart{margin-left:auto;font-size:14px}
.bwtp-tabs{order:3;flex-basis:100%;gap:20px}.bwtp-tabs a{min-height:48px;font-size:14px}
.bwtp-crumb{font-size:12px;padding:14px 0}
.bwtp-product{display:flex;flex-direction:column}
.bwtp-head{order:0;gap:10px;padding:0 0 16px}
.bwtp-gallery{order:1}
.bwtp-buy{order:2;padding-top:20px}
.bwtp h1{font-size:36px}.bwtp-lede{font-size:17px}.bwtp-price{font-size:28px}
.bwtp-stage{aspect-ratio:1/1}
.bwtp-thumbs button{width:64px;height:64px}
.bwtp-band{min-height:84px;padding:10px}.bwtp-band[aria-checked=true]{padding:9px}.bwtp-band b,.bwtp-band strong{font-size:15px}.bwtp-band span{font-size:12px}
.bwtp-section{margin-top:48px}.bwtp-section h2{font-size:28px}
.bwtp-steps{grid-template-columns:1fr;gap:12px}.bwtp-steps li{padding:18px}
.bwtp-formats{gap:12px}
.bwtp-more{display:flex;overflow-x:auto;gap:14px;padding-bottom:8px;scroll-snap-type:x proximity}
.bwtp-more a{flex:0 0 160px;scroll-snap-align:start}
.bwtp-sticky[data-show]{display:flex}
}`;

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const consent = (key) => {
    try {
      const m = window.consentPolicyManager;
      const c = m && typeof m.getCurrentConsentPolicy === 'function' ? m.getCurrentConsentPolicy() : null;
      const p = c && (c.policy || c);
      return !!(p && p[key] === true);
    } catch (e) { return false; }
  };
  // Same dataLayer events as the retired V4 landing, so the planner funnel reads on; only the experiment key is new.
  const track = (event, extra) => {
    if (!consent('analytics')) return;
    try { (window.dataLayer = window.dataLayer || []).push({ event, experiment: EXPERIMENT, variant: 'a', ...(extra || {}) }); } catch (e) {}
  };
  const checkout = (band) => `${V4}/planner-v4/purchase?band=${band.id}`;

  class BWTripPlannerStore extends HTMLElement {
    connectedCallback() {
      if (this._ready) return;
      this._ready = true;
      this._band = BANDS[1];
      this._shot = 0;
      if (!document.getElementById('bwtp-css')) {
        const style = document.createElement('style');
        style.id = 'bwtp-css';
        style.textContent = CSS;
        document.head.appendChild(style);
      }
      window.__bwStoreCreditsHtml = '';
      this.render();
      this._bind();
      this._impression = () => { if (!this._seen && consent('analytics')) { this._seen = true; track('Planner LP Impression'); } };
      this._impression();
      document.addEventListener('consentPolicyChanged', this._impression);
      document.addEventListener('consentPolicyInitialized', this._impression);
    }

    disconnectedCallback() {
      document.removeEventListener('consentPolicyChanged', this._impression);
      document.removeEventListener('consentPolicyInitialized', this._impression);
      if (this._io) this._io.disconnect();
      this._ready = false;
    }

    render() {
      const g = GALLERY[this._shot];
      this.innerHTML = `<div class="bwtp">
<nav class="bwtp-bar" aria-label="Store"><div class="bwtp-wrap">
<a class="bwtp-store-home" href="${SITE}/category/all-products?tab=all" aria-label="Store home">${STORE_LOGO}</a>
<div class="bwtp-tabs">${STORE_LINKS.map(([l, h]) => `<a href="${SITE}${h}"${l === 'Guides' ? ' aria-current="true"' : ''}>${l}</a>`).join('')}</div>
<a class="bwtp-cart" href="${SITE}/cart-page">Cart</a>
</div></nav>
<div class="bwtp-wrap">
<nav class="bwtp-crumb" aria-label="Breadcrumb"><a href="${SITE}/category/all-products?tab=all">Store</a> / <a href="${SITE}/category/all-products?tab=guides">Guides</a> / Berlin Trip Planner</nav>
<section class="bwtp-product">
<div class="bwtp-head">
<span class="bwtp-eyebrow">Your Berlin days · Web plan + PDF</span>
<h1>Berlin Trip Planner</h1>
<p class="bwtp-lede">One clear Berlin plan instead of 40 open tabs.</p>
<span class="bwtp-price" data-bwtp-price>${this._band.price}</span>
</div>
<div class="bwtp-gallery">
<div class="bwtp-stage"><img src="${asset(g.img)}" alt="${esc(g.alt)}" data-fit="${g.fit}" width="992" height="868" fetchpriority="high"></div>
<div class="bwtp-thumbs">${GALLERY.map((s, i) => `<button type="button" data-bwtp-shot="${i}" aria-label="${s.label}" aria-pressed="${i === this._shot}"><img src="${asset(s.img)}" alt="" loading="lazy"></button>`).join('')}</div>
</div>
<div class="bwtp-buy">
<span class="bwtp-q" id="bwtp-q">How long is your trip?</span>
<div class="bwtp-bands" role="radiogroup" aria-labelledby="bwtp-q">${BANDS.map((b) => `<button type="button" class="bwtp-band" role="radio" data-bwtp-band="${b.id}" aria-checked="${b === this._band}" tabindex="${b === this._band ? 0 : -1}"><b>${b.days}</b><span>${b.note}</span><strong>${b.price}</strong></button>`).join('')}</div>
<a class="bwtp-cta" data-bwtp-buy data-bwtp-main href="${checkout(this._band)}">Buy the ${this._band.days} plan · ${this._band.price}</a>
<p class="bwtp-fine">One price for the whole trip, not per person. No subscription. Secure checkout with Stripe. After payment you tell me your dates and plans.</p>
<div class="bwtp-maker"><img src="${asset('yusuf.webp')}" alt="Yusuf, the Berlin guide behind Walk of Berlin" width="48" height="48" loading="lazy"><span><strong>Prepared personally by Yusuf</strong><br>Berlin tour guide · 9.8/10 on FreeTour</span></div>
</div>
</section>
<section class="bwtp-section" aria-labelledby="bwtp-after"><h2 id="bwtp-after">What happens after you pay</h2>
<ol class="bwtp-steps">${STEPS.map(([t, d], i) => `<li><i aria-hidden="true">${i + 1}</i><b>${t}</b><span>${d}</span></li>`).join('')}</ol></section>
<section class="bwtp-section bwtp-split" aria-labelledby="bwtp-inside">
<div><h2 id="bwtp-inside">Inside every plan</h2><ul class="bwtp-inside">${INSIDE.map((t) => `<li>${CHECK}<span>${t}</span></li>`).join('')}</ul>
<a class="bwtp-sample" href="${V4}/examples/trip-planner-v4/complete-plan-v1.html">View a complete sample plan →</a></div>
<div class="bwtp-formats"><figure><img src="${asset('webplan.webp')}" alt="The private Web plan" loading="lazy" width="992" height="1240"><figcaption>Private Web plan · <span>use it as you move</span></figcaption></figure><figure><img src="${asset('pdf.webp')}" alt="The matching PDF" loading="lazy" width="1000" height="1250"><figcaption>Matching PDF · <span>keep it offline</span></figcaption></figure></div>
</section>
<section class="bwtp-section bwtp-split bwtp-faq" aria-labelledby="bwtp-faq"><h2 id="bwtp-faq">Before you buy</h2>
<div>${FAQ.map(([q, a], i) => `<details${i === 0 ? ' open' : ''}><summary>${q}</summary><p>${a}</p></details>`).join('')}</div></section>
<section class="bwtp-section" aria-labelledby="bwtp-more"><h2 id="bwtp-more">More Berlin guides</h2>
<div class="bwtp-more">${MORE.map(([n, p, h, img]) => `<a href="${SITE}${h}"><img src="${ROOT}storefront/20261022-c4/assets/${img}" alt="" loading="lazy" width="500" height="600"><b>${n}</b><span>${p}</span></a>`).join('')}<a class="bwtp-all" href="${SITE}/category/all-products?tab=guides">All guides →</a></div></section>
</div>
<div class="bwtp-sticky" data-bwtp-sticky aria-hidden="true"><span>${this._band.days}<strong data-bwtp-price>${this._band.price}</strong></span><a class="bwtp-cta" data-bwtp-buy href="${checkout(this._band)}" tabindex="-1">Buy the plan</a></div>
</div>`;
    }

    _pick(id, focus) {
      const band = BANDS.find((b) => b.id === id);
      if (!band || band === this._band) return;
      this._band = band;
      this.querySelectorAll('[data-bwtp-band]').forEach((el) => {
        const on = el.dataset.bwtpBand === id;
        el.setAttribute('aria-checked', on);
        el.tabIndex = on ? 0 : -1;
        if (on && focus) el.focus();
      });
      this.querySelectorAll('[data-bwtp-price]').forEach((el) => { el.textContent = band.price; });
      this.querySelectorAll('[data-bwtp-buy]').forEach((el) => { el.href = checkout(band); });
      const main = this.querySelector('[data-bwtp-main]');
      if (main) main.textContent = `Buy the ${band.days} plan · ${band.price}`;
      const sticky = this.querySelector('[data-bwtp-sticky] span');
      if (sticky) sticky.firstChild.textContent = band.days;
    }

    _bind() {
      this.addEventListener('click', (e) => {
        const band = e.target.closest('[data-bwtp-band]');
        if (band) return this._pick(band.dataset.bwtpBand);
        const shot = e.target.closest('[data-bwtp-shot]');
        if (shot) {
          this._shot = Number(shot.dataset.bwtpShot);
          const g = GALLERY[this._shot];
          const img = this.querySelector('.bwtp-stage img');
          img.src = asset(g.img); img.alt = g.alt; img.dataset.fit = g.fit;
          this.querySelectorAll('[data-bwtp-shot]').forEach((b) => b.setAttribute('aria-pressed', b === shot));
          return;
        }
        const buy = e.target.closest('[data-bwtp-buy]');
        if (buy) track('Planner LP Start', { entry: 'cta', location: this._band.location });
      });
      this.querySelector('.bwtp-bands').addEventListener('keydown', (e) => {
        const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (!step) return;
        e.preventDefault();
        const i = (BANDS.indexOf(this._band) + step + BANDS.length) % BANDS.length;
        this._pick(BANDS[i].id, true);
      });
      // Phones: a slim buy bar while the main button is off screen.
      const main = this.querySelector('[data-bwtp-main]');
      const bar = this.querySelector('[data-bwtp-sticky]');
      if ('IntersectionObserver' in window && main && bar) {
        this._io = new IntersectionObserver(([entry]) => {
          const show = !entry.isIntersecting && entry.boundingClientRect.top < 0;
          bar.toggleAttribute('data-show', show);
          bar.setAttribute('aria-hidden', String(!show));
          bar.querySelector('a').tabIndex = show ? 0 : -1;
        });
        this._io.observe(main);
      }
    }
  }

  customElements.define(TAG, BWTripPlannerStore);
})();
