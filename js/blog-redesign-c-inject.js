/* BerlinWalk Blog Post Redesign C. Runs only behind bwredesign=1. */
(function () {
  'use strict';

  var DEFAULT_ON = window.BW_REDESIGN_DEFAULT_ON === true;
  var MARK = 'data-bw-redesign-c';
  var STYLE_ID = 'bw-blog-redesign-c-style';
  var BASE = 'https://fenerszymanski.github.io/berlinwalk-widgets/';
  var ARCHIVE_URL = BASE + 'blog-index/archive.json?v=blog-redesign-c-20260823';
  var TOOLS_URL = BASE + 'tools-hub/data.json?v=blog-redesign-c-20260823';
  var HERO_HIGHLIGHTS_URL = BASE + 'blog-hero/data.json?v=blog-redesign-c-20260823-qa1';
  // Berlin Then and Now, the paid walking tour (Wix service 145cb27e).
  var BOOKING_URL = 'https://www.walkofberlin.com/book-berlin-walking-tour/berlin-then-and-now';
  var AUDIO_TOURS_URL = 'https://www.walkofberlin.com/audio-tours';
  var RAIL_GIFTS = [
    { label: '1928 street print', image: '5a08a3_434eecbe3eae4805af00fac3e2283451~mv2.jpg' },
    { label: 'Tempelhof hoodie', image: '5a08a3_1d05740ef0104e718ea19a6d5e2159ce~mv2.png' },
    { label: '2027 calendar', image: '5a08a3_de1802442ecc44c8afac5a2b5fbaeef9~mv2.jpg' }
  ];
  var PORTRAIT_URL = BASE + 'blog-hero/assets/yusuf-guide-portrait.jpg';
  var TOUR_BAND_IMAGE = BASE + 'blog-hero/assets/tour-cta-yusuf-rathaus-solo.jpg';
  // Category offer (Yusuf, 27 Nov 2026: "her yazının kategorisine göre değişen offer kuralım"). The closing band and one card
  // inside the article follow the post's category. Tourist Tips holds about 75 % of blog views, so its topic and a few slug or
  // title words pick the offer there. History, myths, tour-route and before/after posts keep the Berlin Then and Now tour.
  // Views and clicks go to the identifier-free counter as /blog-offer/<offer>/step-<mid|end>-<seen|click> (path only: no
  // cookie, no id) and, with analytics consent, to GA4 as bw_blog_offer_seen / bw_blog_offer_click.
  var OFFER_IMAGES = BASE + 'blog-hero/assets/offers/';
  var GIFT_IMAGES = BASE + 'storefront/20261022-c4/assets/gift-week-';
  var COUNTER_URL = 'https://app.berlinwalk.com/api/traffic-count';
  var CHRISTMAS_OFFER_UNTIL = Date.parse('2026-12-24T23:59:00+01:00');
  var OFFERS = {
    'club-night': { kicker: 'CLUB NIGHT RESCUE PLAN · €4.99', title: 'Turned away at the door? Have tonight’s Plan B ready.', text: 'Seven Berlin club doors, what to bring, the station exit for each, and a Plan B for tonight if the door says no.', cta: 'See the plan', href: 'https://app.berlinwalk.com/products/club-night-rescue-plan', image: OFFER_IMAGES + 'club-night-dj-controller_AdobeStock_519006631.webp', alt: 'A DJ mixer glowing blue and orange in a dark club' },
    'wall-audio': { kicker: 'BERLIN WALL AUDIO WALK · €9.90', title: 'Follow the Wall on foot, with me in your ears.', text: 'From Nordbahnhof to Mauerpark: ten outdoor stops, English audio, MP3s and a PDF route guide. Listen to a sample first.', cta: 'Listen to a sample', href: '/products/death-strip-audio-route', image: OFFER_IMAGES + 'wall-chapel-of-reconciliation-koreng-cc-by-3-de.webp', alt: 'The wooden Chapel of Reconciliation on the former death strip at Bernauer Straße', credit: { text: 'Photo: Ansgar Koreng, CC BY 3.0 DE', href: 'https://commons.wikimedia.org/wiki/File:Kapelle_der_Vers%C3%B6hnung.jpg' } },
    'first-day': { kicker: 'FIRST-DAY RESCUE PLAN · €4.99', title: 'Land in Berlin with your first hour already planned.', text: 'Transport, bags, food, one easy first stop and a backup, built for your stay, your group and your landing time.', cta: 'Build my plan', href: '/products/berlin-first-day-rescue-plan', image: OFFER_IMAGES + 'first-day-tv-tower-s-bahn_AdobeStock_281368074.webp', alt: 'An S-Bahn train crossing a brick viaduct below the TV Tower at dusk' },
    gifts: { kicker: 'BERLIN CHRISTMAS GIFTS', title: 'A Berlin gift for someone who loves the city.', text: 'Their street from above in 1928, Berlin posters, hoodies, the 2027 calendar and my audio walks.', cta: 'See the gifts', href: '/gifts', image: GIFT_IMAGES + 'gifts.webp', alt: 'A framed 1928 street print beside gift wrap' },
    'street-1928': { kicker: 'YOUR STREET IN 1928', title: 'See your Berlin street from above, almost a hundred years ago.', text: 'Type your Berlin address and see your street from above in 1928, with the same spot today right below it. A personalised print for your wall.', cta: 'Find my street', href: '/product-page/your-berlin-street-in-1928-personalised-aerial-print-30-x-40-cm', image: GIFT_IMAGES + '1928.webp', alt: 'A 1928 street print in a wooden frame on a dark green wall' },
    sprueche: { kicker: 'BERLINER SPRÜCHE', title: 'Wear the German you hear every day in Berlin.', text: 'Zurückbleiben bitte, Mit Karte bitte, Zug fällt aus, Wegbier, Pfand: Berlin sayings on T-shirts, hoodies and tote bags.', cta: 'See the sayings', href: '/category/berliner-sprueche', image: 'https://static.wixstatic.com/media/5a08a3_e9620aafceeb4265a3defe7fc5325b16~mv2.jpg/v1/fill/w_960,h_840,al_c,q_82/file.jpg', alt: 'Someone in a black Zug fällt aus hoodie on a train platform bench' },
    posters: { kicker: 'BERLIN EVERYDAY POSTERS', title: 'The Späti, the Currywurst, the U-Bahn: Berlin for your wall.', text: 'Everyday Berlin as art prints, from the Späti at night to the Currywurst stand. Printed posters or printable downloads.', cta: 'See the posters', href: '/category/berlin-everyday-posters', image: GIFT_IMAGES + 'poster.webp', alt: 'The Späti poster in a wooden frame on a light wall' }
  };
  var state = { archive: null, tools: null, heroHighlights: null, timer: null, observer: null, until: 0, adviceObserver: null, adviceBody: null, adviceScheduled: false, rendering: false };

  function enabled() {
    try {
      var params = new URLSearchParams(location.search);
      return DEFAULT_ON || params.get('bwredesign') === '1' || localStorage.getItem('bwRedesign') === '1';
    } catch (error) { return DEFAULT_ON; }
  }

  function postPage() { return location.pathname.indexOf('/post/') === 0; }
  // Decoded and NFC: a slug such as "5-best-döner-..." arrives percent-encoded in the path and never matched the archive.
  function slug() { var raw = location.pathname.replace(/^\/post\//, '').replace(/\/+$/, ''); try { raw = decodeURIComponent(raw); } catch (error) {} return raw.normalize ? raw.normalize('NFC') : raw; }
  function text(value) { return String(value || '').replace(/\s+/g, ' ').trim(); }
  function escapeHtml(value) { return String(value || '').replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function safeUrl(value) { try { return new URL(value, location.href).toString(); } catch (error) { return ''; } }
  function visible(node) { return !!(node && node.isConnected && getComputedStyle(node).display !== 'none' && getComputedStyle(node).visibility !== 'hidden'); }
  function findBody() { return document.querySelector('[data-hook="post-description"], [data-hook="post-content"], [data-hook="rich-content-viewer"], [data-hook="rich-content"], .blog-post-page-content'); }
  function findTitle() { return document.querySelector('.bw-c-hero h1') || Array.prototype.find.call(document.querySelectorAll('h1'), function (node) { return visible(node) && !node.closest('[' + MARK + ']'); }) || null; }
  function postMeta() { return state.archive && (state.archive.allPosts || []).find(function (post) { var current = slug(); return post.slug === current || String(post.slug || '').normalize('NFC') === current; }) || null; }
  function toolFor(post) { return post && state.tools && (state.tools.tools || []).find(function (tool) { return tool.slug === post.relatedToolSlug; }) || null; }
  function meta(property) { var node = document.querySelector('meta[property="' + property + '"]'); return node ? text(node.getAttribute('content')) : ''; }

  function postRoot(body) {
    var article = body && body.closest('article');
    return article && article.closest('#content-wrapper');
  }

  function stageFor(body) {
    var root = postRoot(body), article = body && body.closest('article');
    if (!root || !article) return null;
    var stage = root.querySelector(':scope > .bw-c-stage');
    if (stage) { fitStage(stage); return stage; }
    var nativeSection = Array.prototype.find.call(root.children, function (child) { return child.contains(article); });
    if (!nativeSection) return null;
    stage = document.createElement('div'); stage.className = 'bw-c-stage'; stage.setAttribute(MARK, 'stage'); root.insertBefore(stage, nativeSection); fitStage(stage);
    return stage;
  }

  function fitStage(stage) {
    if (!stage) return;
    function correct() {
      if (!stage.isConnected) return;
      stage.style.setProperty('width', innerWidth + 'px', 'important'); stage.style.setProperty('max-width', 'none', 'important'); stage.style.setProperty('margin-left', '0', 'important');
      stage.style.setProperty('margin-left', -Math.round(stage.getBoundingClientRect().left) + 'px', 'important');
    }
    requestAnimationFrame(correct); setTimeout(correct, 460);
  }

  function fitPage(page) {
    if (!page) return;
    function correct() {
      if (!page.isConnected) return;
      if (innerWidth <= 1000) { page.style.width = ''; page.style.maxWidth = ''; page.style.marginLeft = ''; return; }
      var width = innerWidth >= 1240 ? Math.min(1160, innerWidth - 56) : Math.min(680, innerWidth - 56);
      page.style.width = width + 'px'; page.style.maxWidth = 'none'; page.style.marginLeft = '0';
      page.style.marginLeft = Math.round((innerWidth - width) / 2 - page.getBoundingClientRect().left) + 'px';
    }
    requestAnimationFrame(correct); setTimeout(correct, 460);
  }

  function pageFor(body) {
    var existing = body.closest('.bw-c-page'); if (existing) { fitPage(existing); return existing; }
    var shell = body.parentElement; if (!shell) return null;
    shell.setAttribute('data-bw-redesign-content-shell', '1');
    var article = body.closest('article'), root = postRoot(body), cursor = article && article.parentElement;
    while (cursor && cursor !== root) {
      if (parseFloat(getComputedStyle(cursor).paddingTop || '0') > 0) { cursor.setAttribute('data-bw-redesign-trim-top', '1'); break; }
      cursor = cursor.parentElement;
    }
    var page = document.createElement('div'); page.className = 'bw-c-page'; page.setAttribute(MARK, 'page'); shell.insertBefore(page, body); page.appendChild(body); fitPage(page); return page;
  }

  function loadData() {
    if (state.dataPromise) return state.dataPromise;
    state.dataPromise = Promise.all([
      fetch(ARCHIVE_URL, { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : null; }),
      fetch(TOOLS_URL, { cache: 'force-cache' }).then(function (r) { return r.ok ? r.json() : null; }),
      fetch(HERO_HIGHLIGHTS_URL, { cache: 'force-cache' }).then(function (r) { return r.ok ? r.json() : null; })
    ]).then(function (result) {
      state.archive = result[0]; state.tools = result[1]; state.heroHighlights = result[2] || {}; state.dataSettled = true; schedule(0); return result;
    }).catch(function () { state.dataSettled = true; schedule(0); return null; });
    return state.dataPromise;
  }

  function headings(body) {
    var used = {};
    return Array.prototype.filter.call(body.querySelectorAll('h2'), function (node) {
      var value = text(node.textContent);
      return value.length > 2 && !node.closest('[data-bw-redesign-end], [data-bw-leadform], [data-bw-tourcta], [data-bw-date-check-card], [data-bw-blog-booking]');
    }).map(function (node, index) {
      var base = text(node.textContent).toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'section';
      var id = node.id || 'bw-c-' + base, suffix = 2;
      while (used[id] || (document.getElementById(id) && document.getElementById(id) !== node)) id = 'bw-c-' + base + '-' + suffix++;
      used[id] = true; node.id = id; node.setAttribute('data-bw-section', String(index + 1).padStart(2, '0'));
      return { node: node, id: id, title: text(node.textContent), number: String(index + 1).padStart(2, '0') };
    });
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style'); style.id = STYLE_ID;
    style.textContent = [
      // Wobby step 8 (25 Nov 2026): a gift label never breaks inside a word. Wix's blog CSS inherits overflow-wrap:break-word into
      // the rail, and a 10 px label such as "Tempelhof" (56 px) sat in a 57 px column, so any browser whose Montserrat ran a pixel wider
      // split it ("Tempelho / f hoodie"). Words stay whole (overflow-wrap/word-break/hyphens), the columns may grow to the longest word
      // (minmax(min-content,1fr)), and the box gives the grid 4 px more width (side padding 10, gap 5).
      'html[data-bw-redesign="1"] .bw-c-rail-gifts{background:#F4F7EE;border:1px solid #D6E2CD;border-radius:12px;box-sizing:border-box;color:#123D18!important;display:block;margin-top:26px;padding:12px 10px;text-decoration:none!important;}',
      'html[data-bw-redesign="1"] .bw-c-rail .bw-c-rail-gifts strong{font:800 16px/1.25 Montserrat,Arial,sans-serif;margin:0 0 9px;}',
      'html[data-bw-redesign="1"] .bw-c-rail-gift-grid{display:grid;gap:5px;grid-template-columns:repeat(3,minmax(min-content,1fr));}',
      'html[data-bw-redesign="1"] .bw-c-rail-gift-item{display:block;font:600 10px/1.25 Montserrat,Arial,sans-serif;hyphens:none;overflow-wrap:normal;word-break:normal;text-wrap:balance;}',
      'html[data-bw-redesign="1"] .bw-c-rail-gift-item img{aspect-ratio:1/1;background:#E8EEE0;border-radius:5px;display:block;height:auto;margin-bottom:5px;object-fit:cover;width:100%;}',
      'html[data-bw-redesign="1"] .bw-c-rail-gifts-cta{align-items:center;background:#FFE600;border-radius:6px;color:#123D18!important;display:flex;font:750 11px/1.25 Montserrat,Arial,sans-serif;justify-content:space-between;margin-top:10px;min-height:34px;padding:0 9px;}',
      'html[data-bw-redesign="1"] .bw-c-rail-gifts:hover .bw-c-rail-gifts-cta,html[data-bw-redesign="1"] .bw-c-rail-gifts:focus-visible .bw-c-rail-gifts-cta{background:#C5E1A5;}',
      'html[data-bw-redesign="1"] .bw-c-rail-gifts:focus-visible{outline:2px solid #1B5E20;outline-offset:-2px;}',
      'html[data-bw-redesign="1"] .bw-c-rail-gifts + .bw-c-rail-tour{margin-top:12px;}',
      // Declare both Fraunces faces here rather than trusting the head embed:
      // the redesign must not depend on another surface for its own fonts, and a
      // family that carries only one style is worse than none, because the
      // browser then uses that single face for BOTH styles. Without a real
      // italic face the browser skews the roman one, and that synthetic italic
      // is what made the yellow hero word read bolder than the rest of the
      // title, so synthesis is refused wherever the redesign asks for italic.
      '@font-face{font-family:Fraunces;font-style:normal;font-weight:100 900;font-display:swap;src:url(' + BASE + 'brand/fonts/editorial-v2/Fraunces-Variable.woff2) format("woff2");}',
      '@font-face{font-family:Fraunces;font-style:italic;font-weight:100 900;font-display:swap;src:url(' + BASE + 'brand/fonts/editorial-v2/Fraunces-Italic-Variable.woff2) format("woff2");}',
      // Wobby, the brand headline face (Yusuf, 25 Nov 2026): one weight (400), no italic, so every Wobby heading
      // below sets font-weight 400, letter-spacing 0 and never asks for bold or italic.
      '@font-face{font-family:"Wobby";src:url("https://static.wixstatic.com/ufonts/5a08a3_53d3fadb4e6e4aadb41345f23354ae47/woff2/file.woff2") format("woff2");font-weight:400;font-style:normal;font-display:swap;}',
      'html[data-bw-redesign="1"]{scroll-behavior:smooth;}',
      'html[data-bw-redesign="1"] [data-bw-redesign-native-header="1"]{display:none!important;}',
      'html[data-bw-redesign="1"] .bw-c-stage{margin:0!important;padding:0!important;width:100%!important;}html[data-bw-redesign="1"] .bw-c-hero{background-color:#102414;background-image:linear-gradient(rgba(250,250,245,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(250,250,245,.055) 1px,transparent 1px);background-size:34px 34px;box-sizing:border-box;color:#FAFAF5;left:50%;margin:0;position:relative;padding:70px max(28px,calc((100vw - 880px)/2)) 62px;transform:translateX(-50%);width:100vw;}html[data-bw-redesign="1"] .bw-c-stage .bw-c-hero{left:auto!important;margin:0!important;transform:none!important;width:100%!important;}',
      'html[data-bw-redesign="1"] .bw-c-hero-inner{max-width:880px;margin:0 auto;}html[data-bw-redesign="1"] .bw-c-eyebrow,html[data-bw-redesign="1"] .bw-c-byline,html[data-bw-redesign="1"] .bw-c-rail,html[data-bw-redesign="1"] .bw-c-mobile-toc,html[data-bw-redesign="1"] .bw-c-cover-caption,html[data-bw-redesign="1"] .bw-c-tile-label,html[data-bw-redesign="1"] .bw-c-end-kicker{font-family:"IBM Plex Mono",ui-monospace,monospace;}',
      'html[data-bw-redesign="1"] .bw-c-eyebrow{color:#C5E1A5;font-size:11px;font-weight:600;letter-spacing:.12em;margin:0 0 17px;text-transform:uppercase;}html[data-bw-redesign="1"] .bw-c-eyebrow a{color:inherit;text-decoration-color:#FFE600;text-underline-offset:3px;}',
      'html[data-bw-redesign="1"] .bw-c-hero h1{color:#FAFAF5!important;font-family:Fraunces,Merriweather,Georgia,serif!important;font-size:clamp(40px,5.2vw,60px)!important;font-style:normal!important;font-weight:600!important;letter-spacing:-.035em!important;line-height:1.03!important;margin:0!important;max-width:860px;text-shadow:none!important;-webkit-text-stroke:0!important;}html[data-bw-redesign="1"] .bw-c-hero h1 .bw-c-hero-highlight{color:#FFE600!important;font-style:italic!important;font-weight:600!important;font-synthesis:none!important;font-synthesis-weight:none!important;font-synthesis-style:none!important;}html[data-bw-redesign="1"] .bw-c-dek{color:#FAFAF5;font:italic 18px/1.65 Merriweather,Georgia,serif;margin:22px 0 23px;max-width:730px;}html[data-bw-redesign="1"] .bw-c-byline{align-items:center;color:#C5E1A5;display:flex;font-size:10px;font-weight:600;gap:10px;letter-spacing:.08em;text-transform:uppercase;}html[data-bw-redesign="1"] .bw-c-byline img{border:1px solid #C5E1A5;border-radius:50%;height:31px;object-fit:cover;width:31px;}',
      'html[data-bw-redesign="1"] .bw-c-cover{box-sizing:border-box;height:520px;left:50%;margin:0;overflow:hidden;position:relative;transform:translateX(-50%);width:100vw;}html[data-bw-redesign="1"] .bw-c-stage .bw-c-cover{left:auto!important;margin:0!important;transform:none!important;width:100%!important;}html[data-bw-redesign="1"] .bw-c-cover img{display:block;height:100%;object-fit:cover;width:100%;}html[data-bw-redesign="1"] .bw-c-cover-caption{background:rgba(16,36,20,.82);bottom:0;color:#FAFAF5;font-size:10px;left:auto;letter-spacing:.04em;max-width:min(540px,calc(100% - 32px));padding:10px 16px;position:absolute;right:0;}',
      'html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] h2{border-top:0!important;color:#212121!important;font-family:"BW Montserrat Black",Montserrat,Arial,sans-serif!important;font-size:28px!important;line-height:1.1!important;margin:48px 0 15px!important;padding:18px 0 0!important;position:relative;text-shadow:none!important;-webkit-text-stroke:0!important;}html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] h2:before{background:#1B5E20;content:"";height:5px;left:0;position:absolute;top:0;width:38px;}html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] h2:after{color:#1B5E20;content:attr(data-bw-section);font:600 10px/1 "IBM Plex Mono",monospace;letter-spacing:.12em;position:absolute;right:0;top:0;}html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] h3{font-family:"BW Montserrat Black",Montserrat,Arial,sans-serif!important;font-size:21px!important;text-shadow:none!important;-webkit-text-stroke:0!important;}html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] p.bw-c-dropcap:first-letter{color:#1B5E20;float:left;font-family:Fraunces,Georgia,serif;font-size:4.1em;font-weight:600;line-height:.74;margin:.12em .1em 0 0;}html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] p.bw-c-advice{border-bottom:1px solid #DDE4D6;border-top:1px solid #DDE4D6;color:#212121!important;font-family:Fraunces,Merriweather,Georgia,serif!important;font-size:22.5px!important;font-style:italic!important;font-synthesis:none!important;font-weight:400!important;line-height:1.5!important;margin:34px 0!important;padding:35px 0 25px!important;position:relative;}html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] p.bw-c-advice span,html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] p.bw-c-advice span *{color:inherit!important;font-family:Fraunces,Merriweather,Georgia,serif!important;font-size:22.5px!important;font-style:italic!important;font-synthesis:none!important;font-weight:400!important;line-height:1.5!important;}html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] p.bw-c-advice:before{color:#5C665A;content:"MY ADVICE";display:block;font:600 10px/1 "IBM Plex Mono",monospace;letter-spacing:.14em;margin-bottom:15px;}html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] p.bw-c-advice:after{background:#FFE600;content:"";height:4px;left:0;position:absolute;top:24px;width:37px;}',
      'html[data-bw-redesign="1"] [data-bw-redesign-content-shell="1"]{display:block!important;padding:60px 0 40px!important;}html[data-bw-redesign="1"] [data-bw-redesign-trim-top="1"]{padding-top:0!important;}html[data-bw-redesign="1"] .bw-c-page{box-sizing:border-box;margin:0 auto;min-width:0;}html[data-bw-redesign="1"] .bw-c-page>[data-bw-blog-post-body="1"]{min-width:0;width:100%!important;}html[data-bw-redesign="1"] .bw-c-rail{display:none;}html[data-bw-redesign="1"] .bw-c-mobile-toc{background:#FAFAF5;border-bottom:1px solid #DDE4D6;border-top:1px solid #DDE4D6;display:none;margin:0 0 20px;padding:9px 0;position:sticky;top:0;z-index:80;}html[data-bw-redesign="1"] .bw-c-mobile-toc-scroll{display:flex;gap:7px;overflow-x:auto;padding:0 16px;scrollbar-width:none;}html[data-bw-redesign="1"] .bw-c-mobile-toc a{background:#fff;border:1px solid #DDE4D6;border-radius:999px;color:#123D18;font:600 11px/1 "IBM Plex Mono",monospace;padding:9px 11px;text-decoration:none;white-space:nowrap;}html[data-bw-redesign="1"] .bw-c-mobile-toc .bw-c-rail-number{display:none!important;}',
      'html[data-bw-redesign="1"] [data-bw-redesign-native-share="1"],html[data-bw-redesign="1"] [data-hook="post-main-actions-desktop"],html[data-bw-redesign="1"] [data-hook="post-main-actions-mobile"]{display:none!important;}html[data-bw-redesign="1"] .bw-c-end{background:#102414;box-sizing:border-box;color:#FAFAF5;margin:54px 0 35px;position:relative;padding:52px max(24px,calc((100vw - 1040px)/2));width:100%;}html[data-bw-redesign="1"] .bw-c-end-inner{margin:0 auto;max-width:1040px;}html[data-bw-redesign="1"] .bw-c-end-kicker{color:#C5E1A5;font-size:10px;font-weight:600;letter-spacing:.13em;margin:0 0 12px;}html[data-bw-redesign="1"] .bw-c-end h2{color:#FAFAF5!important;font:400 clamp(32px,4vw,48px)/1.05 "Wobby",Fraunces,Merriweather,Georgia,serif!important;font-synthesis:none!important;letter-spacing:0!important;margin:0 0 13px!important;text-shadow:none!important;-webkit-text-stroke:0!important;}html[data-bw-redesign="1"] .bw-c-end-copy{color:#FAFAF5;font:16px/1.6 Merriweather,Georgia,serif;max-width:680px;}html[data-bw-redesign="1"] .bw-c-book{background:#FFE600;border-radius:999px;color:#123D18!important;display:inline-block;font:800 13px/1 Montserrat,Arial,sans-serif;margin:21px 0 30px;padding:14px 20px;text-decoration:none!important;}html[data-bw-redesign="1"] .bw-c-book:hover{background:#C5E1A5;color:#123D18!important;}html[data-bw-redesign="1"] .bw-c-related{display:grid;gap:15px;grid-template-columns:repeat(3,minmax(0,1fr));margin-top:23px;}html[data-bw-redesign="1"] .bw-c-related a{background:#FAFAF5;border-radius:12px;color:#212121;display:block;overflow:hidden;text-decoration:none;}html[data-bw-redesign="1"] .bw-c-related img{aspect-ratio:16/9;display:block;object-fit:cover;width:100%;}html[data-bw-redesign="1"] .bw-c-related-copy{padding:13px;}html[data-bw-redesign="1"] .bw-c-related-kicker{color:#1B5E20;font:600 10px/1 "IBM Plex Mono",monospace;letter-spacing:.1em;text-transform:uppercase;}html[data-bw-redesign="1"] .bw-c-related strong{display:block;font:800 16px/1.16 Montserrat,Arial,sans-serif;margin-top:8px;}html[data-bw-redesign="1"] .bw-c-share{display:flex;flex-wrap:wrap;gap:9px;margin-top:29px;}html[data-bw-redesign="1"] .bw-c-share a,html[data-bw-redesign="1"] .bw-c-share button{background:transparent;border:1px solid #C5E1A5;border-radius:999px;color:#FAFAF5;cursor:pointer;font:600 11px/1 "IBM Plex Mono",monospace;padding:10px 12px;text-decoration:none;}',
      '@media (min-width:1001px){html[data-bw-redesign="1"] .bw-c-page{display:grid;gap:72px;grid-template-columns:210px minmax(0,680px);justify-content:center;padding:0 28px;}html[data-bw-redesign="1"] .bw-c-page>[data-bw-blog-post-body="1"]{grid-column:2;max-width:680px;}html[data-bw-redesign="1"] .bw-c-rail{align-self:start;background:transparent;display:block;grid-column:1;grid-row:1;max-height:calc(100vh - 80px);overflow:auto;padding:0 0 4px;position:sticky;scrollbar-width:none;top:40px;width:auto;z-index:auto;}html[data-bw-redesign="1"] .bw-c-rail::-webkit-scrollbar{height:0;width:0;}html[data-bw-redesign="1"] .bw-c-rail-title{color:#5C665A;font:600 10px/1 "IBM Plex Mono",monospace;letter-spacing:.12em;margin:0 0 15px;}html[data-bw-redesign="1"] .bw-c-rail-list{border-left:1px solid #DDE4D6;list-style:none;margin:0;padding:0 0 0 10px;position:relative;}html[data-bw-redesign="1"] .bw-c-rail-list a{color:#5C665A;display:block;font:600 11px/1.3 "IBM Plex Mono",monospace;margin:0;padding:7px 0;text-decoration:none;}html[data-bw-redesign="1"] .bw-c-rail-list a[data-active="1"]{color:#212121;}html[data-bw-redesign="1"] .bw-c-rail-list a[data-active="1"]:before{background:#FFE600;content:"";height:100%;left:-11px;position:absolute;width:3px;}html[data-bw-redesign="1"] .bw-c-rail-number{color:#1B5E20;margin-right:7px;}html[data-bw-redesign="1"] .bw-c-rail-tour,html[data-bw-redesign="1"] .bw-c-rail-tool{box-sizing:border-box;border-radius:12px;width:100%;}html[data-bw-redesign="1"] .bw-c-rail-tour{background:#102414;color:#FAFAF5;margin-top:30px;padding:18px 18px 20px;}html[data-bw-redesign="1"] .bw-c-rail-tool{background:#fff;border:1px solid #DDE4D6;color:#212121;display:block;margin-top:14px;padding:14px 16px;text-decoration:none!important;}html[data-bw-redesign="1"] .bw-c-rail-label{color:#C5E1A5;display:block;font:600 9.5px/1 "IBM Plex Mono",monospace;letter-spacing:.16em;}html[data-bw-redesign="1"] .bw-c-rail-tool .bw-c-rail-label{color:#5C665A;}html[data-bw-redesign="1"] .bw-c-rail strong{display:block;font:800 14.5px/1.35 Montserrat,Arial,sans-serif;margin:10px 0 8px;}html[data-bw-redesign="1"] .bw-c-rail-tour small{color:#CBDCC2;display:block;font:500 10.5px/1.7 "IBM Plex Mono",monospace;}html[data-bw-redesign="1"] .bw-c-rail-tool strong{font-size:13.5px;line-height:1.3;margin:8px 0 7px;}html[data-bw-redesign="1"] .bw-c-rail-tool small{color:#1B5E20;display:block;font:700 11.5px/1.2 Montserrat,Arial,sans-serif;}html[data-bw-redesign="1"] .bw-c-rail .bw-c-book{display:block;font-size:11px;margin:13px 0 0;padding:11px 8px;text-align:center;}html[data-bw-redesign="1"] .bw-c-rail-all{color:#123D18;display:block;font:600 10px/1 "IBM Plex Mono",monospace;margin-top:16px;text-decoration:none;}}',
      '@media (max-width:1000px){html[data-bw-redesign="1"] .bw-c-mobile-toc{display:block;}}@media (max-width:899px){html[data-bw-redesign="1"] .bw-c-hero{padding:34px 16px 38px;}html[data-bw-redesign="1"] .bw-c-cover{height:340px;}html[data-bw-redesign="1"] .bw-c-cover-caption{bottom:0;right:0;}html[data-bw-redesign="1"] [data-bw-redesign-content-shell="1"]{padding:28px 0 32px!important;}html[data-bw-redesign="1"] .bw-c-related{grid-template-columns:1fr;}html[data-bw-redesign="1"] .bw-c-end{padding:0;}}',
      'html[data-bw-redesign="1"] .bw-c-byline{font-size:11px;gap:16px;letter-spacing:.12em;}html[data-bw-redesign="1"] .bw-c-byline img{border:2px solid rgba(255,230,0,.5);height:38px;width:38px;}html[data-bw-redesign="1"] .bw-c-hero h1{line-height:1.06!important;letter-spacing:-.015em!important;}html[data-bw-redesign="1"] .bw-c-dek{color:rgba(250,250,245,.85);font-size:19.5px;line-height:1.6;max-width:660px;margin-bottom:32px;}',
      '@media (min-width:1001px){html[data-bw-redesign="1"] [data-bw-redesign-body-gutter="1"]{padding-left:0!important;padding-right:0!important;}html[data-bw-redesign="1"] .bw-c-page>[data-bw-blog-post-body="1"]{width:680px!important;max-width:680px!important;}}',
      'html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] .bw-c-body-list,html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] .bw-c-body-list>li{list-style:none!important;}html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] .bw-c-body-list>li::marker{content:""!important;}html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] .bw-c-body-list{margin:0 0 24px!important;padding-left:0!important;}html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] .bw-c-body-list>li{font-size:17.5px;line-height:1.68;padding:8px 0 8px 26px!important;position:relative;}html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] ul.bw-c-body-list>li:before{background:#7CB342;border-radius:50%;content:"";height:9px;left:4px;position:absolute;top:18px;width:9px;}html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] .bw-c-body-list>li>p{margin:0!important;}html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] ol.bw-c-body-list{counter-reset:bwcstep;}html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] ol.bw-c-body-list>li{counter-increment:bwcstep;padding-left:40px!important;}html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] ol.bw-c-body-list>li:before{background:#123D18;border-radius:50%;color:#FFE600;content:counter(bwcstep);font:800 13px/26px Montserrat,Arial,sans-serif;height:26px;left:0;position:absolute;text-align:center;top:8px;width:26px;}',
      // The rail already carries the tour card on every post, so the site-wide
      // sticky booking pill is a duplicate here and covers the article.
      'html[data-bw-redesign="1"] #bw-desktop-cta{display:none!important;}',
      'html[data-bw-redesign="1"] .bw-c-date-card{background:#fff!important;border:1px solid #DDE4D6!important;border-radius:14px!important;display:block!important;margin:38px 0 42px!important;overflow:hidden!important;}html[data-bw-redesign="1"] .bw-c-date-card .bw-date-check-blog-card__visual{background:#102414!important;display:block!important;min-height:0!important;width:100%!important;}html[data-bw-redesign="1"] .bw-c-date-card .bw-date-check-blog-card__visual img{display:none!important;}html[data-bw-redesign="1"] .bw-c-date-card .bw-date-check-blog-card__scrim{background:#102414!important;display:block!important;padding:11px 18px!important;position:static!important;}html[data-bw-redesign="1"] .bw-c-date-card .bw-date-check-blog-card__eyebrow{color:#EAF2E6!important;font:600 11px/1 "IBM Plex Mono",monospace!important;letter-spacing:.16em!important;text-transform:uppercase!important;}html[data-bw-redesign="1"] .bw-c-date-card .bw-date-check-blog-card__eyebrow:before{background:#FFE600;border-radius:50%;content:"";display:inline-block;height:8px;margin-right:10px;width:8px;}html[data-bw-redesign="1"] .bw-c-date-card .bw-date-check-blog-card__scrim>.bw-date-check-blog-card__title,html[data-bw-redesign="1"] .bw-c-date-card .bw-date-check-blog-card__scrim>.bw-date-check-blog-card__copy,html[data-bw-redesign="1"] .bw-c-date-card .bw-date-check-blog-card__proof{display:none!important;}html[data-bw-redesign="1"] .bw-c-date-card .bw-date-check-blog-card__form{display:block!important;padding:28px 28px 30px!important;width:100%!important;}html[data-bw-redesign="1"] .bw-c-date-card .bw-c-date-intro h2.bw-date-check-blog-card__title{color:#212121!important;font:400 22px/1.25 "Wobby",Montserrat,Arial,sans-serif!important;font-synthesis:none!important;letter-spacing:0!important;-webkit-text-stroke:0!important;text-shadow:none!important;margin:0 0 6px!important;padding:0!important;}html[data-bw-redesign="1"] .bw-c-date-intro h2:before,html[data-bw-redesign="1"] .bw-c-date-intro h2:after{display:none!important;}html[data-bw-redesign="1"] .bw-c-date-intro p{color:#5C665A!important;font:400 14.5px/1.6 Merriweather,Georgia,serif!important;margin:0 0 18px!important;}html[data-bw-redesign="1"] .bw-c-date-card .bw-date-check-blog-card__fields{display:flex!important;gap:12px!important;margin-bottom:14px!important;}html[data-bw-redesign="1"] .bw-c-date-card .bw-date-check-blog-card__field{flex:1!important;min-width:0!important;}html[data-bw-redesign="1"] .bw-c-date-card .bw-date-check-blog-card__submit{background:#FFE600!important;border-radius:999px!important;color:#123D18!important;font:800 14px/1 Montserrat,Arial,sans-serif!important;height:auto!important;min-height:0!important;padding:13px 26px!important;width:auto!important;}html[data-bw-redesign="1"] .bw-c-date-card a.bw-date-check-blog-card__submit{align-items:center!important;display:inline-flex!important;gap:10px!important;text-decoration:none!important;}html[data-bw-redesign="1"] .bw-c-date-card .bw-date-check-blog-card__micro{display:none!important;}',
      'html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] .bw-c-advice-highlight{background:linear-gradient(transparent 58%,rgba(255,230,0,.82) 58%,rgba(255,230,0,.82) 91%,transparent 91%);box-decoration-break:clone;-webkit-box-decoration-break:clone;}',
      'html[data-bw-redesign="1"] .bw-c-rail-list{border-left:0;padding-left:0;}html[data-bw-redesign="1"] .bw-c-rail-progress{background:#DDE4D6;bottom:8px;left:-18px;position:absolute;top:34px;width:1px;}html[data-bw-redesign="1"] .bw-c-rail-progress i{background:#1B5E20;border-radius:2px;display:block;height:0;margin-left:-1px;transition:height .16s linear;width:3px;}html[data-bw-redesign="1"] .bw-c-rail-list a{display:flex;gap:12px;padding:6px 0;}html[data-bw-redesign="1"] .bw-c-rail-list a[data-active="1"] .bw-c-rail-text{background:linear-gradient(transparent 62%,rgba(255,230,0,.55) 62%);}html[data-bw-redesign="1"] .bw-c-rail-list a[data-active="1"]:before{display:none;}html[data-bw-redesign="1"] .bw-c-rail-number{flex:0 0 auto;margin-right:0;}html[data-bw-redesign="1"] .bw-c-rail-tour strong{font-size:14.5px;line-height:1.35;}html[data-bw-redesign="1"] .bw-c-rail-schedule{margin-top:0;}html[data-bw-redesign="1"] .bw-c-rail-rating{margin-top:2px;}',
      'html[data-bw-redesign="1"] .bw-c-rail-tour .bw-c-rail-choice{align-items:center;border:1px solid rgba(250,250,245,.55);border-radius:9px;box-sizing:border-box;color:#FAFAF5!important;display:flex;font:700 11px/1.25 Montserrat,Arial,sans-serif;gap:7px;justify-content:space-between;margin-top:9px;min-height:52px;padding:10px;text-decoration:none!important;}html[data-bw-redesign="1"] .bw-c-rail-choice span:first-child{min-width:0;}html[data-bw-redesign="1"] .bw-c-rail-choice small{color:inherit;display:block;font:500 9.5px/1.4 "IBM Plex Mono",monospace;margin-top:3px;}html[data-bw-redesign="1"] .bw-c-rail-choice span:last-child{font-size:15px;}html[data-bw-redesign="1"] .bw-c-rail-tour .bw-c-rail-choice-audio,html[data-bw-redesign="1"] .bw-c-rail-tour .bw-c-rail-choice-audio:visited{background:#FFE600;border-color:#FFE600;color:#123D18!important;}html[data-bw-redesign="1"] .bw-c-rail-tour .bw-c-rail-choice-audio:hover,html[data-bw-redesign="1"] .bw-c-rail-tour .bw-c-rail-choice-audio:focus-visible{background:#C5E1A5;border-color:#C5E1A5;color:#123D18!important;}html[data-bw-redesign="1"] .bw-c-rail-tour .bw-c-rail-choice-walk:hover,html[data-bw-redesign="1"] .bw-c-rail-tour .bw-c-rail-choice-walk:focus-visible{border-color:#FFE600;color:#FFE600!important;}html[data-bw-redesign="1"] .bw-c-rail-choice:focus-visible{outline:2px solid #FFE600;outline-offset:3px;}',
      'html[data-bw-redesign="1"] .bw-c-end{background:#FAFAF5;color:#212121;margin:20px 0 0;padding:0;}html[data-bw-redesign="1"] .bw-c-tourband{background-color:#102414;background-image:linear-gradient(rgba(250,250,245,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(250,250,245,.05) 1px,transparent 1px);background-size:34px 34px;color:#FAFAF5;padding:0;}html[data-bw-redesign="1"] .bw-c-tourband-inner{display:grid;grid-template-columns:minmax(320px,44%) minmax(0,1fr);margin:0 auto;max-width:1120px;min-height:430px;}html[data-bw-redesign="1"] .bw-c-tourband-photo{margin:0;min-height:430px;overflow:hidden;}html[data-bw-redesign="1"] .bw-c-tourband-photo img{display:block;height:100%;object-fit:cover;object-position:54% center;width:100%;}html[data-bw-redesign="1"] .bw-c-tourband-copy{align-self:center;padding:54px clamp(34px,5vw,70px);text-align:left;}html[data-bw-redesign="1"] .bw-c-end .bw-c-tourband h2{color:#FAFAF5!important;font:400 clamp(34px,4vw,46px)/1.1 "Wobby",Fraunces,Merriweather,Georgia,serif!important;font-synthesis:none!important;letter-spacing:0!important;margin:0 0 18px!important;max-width:620px;}html[data-bw-redesign="1"] .bw-c-tourband-sub{color:rgba(250,250,245,.72);font:500 13px/1.8 "IBM Plex Mono",monospace;text-transform:uppercase;}html[data-bw-redesign="1"] .bw-c-tourband-div{border-top:2px dashed #FFE600;margin:26px 0 0;width:120px;}html[data-bw-redesign="1"] .bw-c-tourband .bw-c-book{margin:28px 0 0;padding:16px 34px;}html[data-bw-redesign="1"] .bw-c-bottom{box-sizing:border-box;margin:0 auto;max-width:1016px;padding:56px 28px 72px;}html[data-bw-redesign="1"] .bw-c-section-label{align-items:center;color:#5C665A;display:flex;font:600 11px/1 "IBM Plex Mono",monospace;gap:14px;letter-spacing:.22em;margin:0 0 24px;text-transform:uppercase;}html[data-bw-redesign="1"] .bw-c-section-label:after{background:#DDE4D6;content:"";flex:1;height:1px;}html[data-bw-redesign="1"] .bw-c-related{gap:18px;margin:0 0 52px;}html[data-bw-redesign="1"] .bw-c-related a{border:1px solid #E4E9DF;border-radius:14px;}html[data-bw-redesign="1"] .bw-c-related img{height:130px;}html[data-bw-redesign="1"] .bw-c-related-copy{padding:14px 16px 18px;}html[data-bw-redesign="1"] .bw-c-faq-slot{margin-bottom:8px;}html[data-bw-redesign="1"] .bw-c-faq-slot [data-hook="html-component"],html[data-bw-redesign="1"] .bw-c-faq-slot iframe{display:block!important;margin:0!important;max-width:none!important;width:100%!important;}html[data-bw-redesign="1"] .bw-c-share{align-items:center;gap:12px;margin-top:44px;}html[data-bw-redesign="1"] .bw-c-share .bw-c-share-label{color:#5C665A;font:600 10.5px/1 "IBM Plex Mono",monospace;letter-spacing:.2em;margin-right:8px;}html[data-bw-redesign="1"] .bw-c-share a,html[data-bw-redesign="1"] .bw-c-share button{background:#fff;border:1.5px solid #DDE4D6;color:#123D18;font:700 12.5px/1 Montserrat,Arial,sans-serif;padding:10px 18px;}',
      '@media (min-width:1001px) and (max-width:1239px){html[data-bw-redesign="1"] .bw-c-page{display:block!important;padding:0!important;}html[data-bw-redesign="1"] .bw-c-rail{display:none!important;}html[data-bw-redesign="1"] .bw-c-mobile-toc{display:block!important;}}@media (max-width:1000px){html[data-bw-redesign="1"] .bw-c-date-card .bw-date-check-blog-card__fields{display:grid!important;grid-template-columns:1fr 1fr!important;}html[data-bw-redesign="1"] .bw-c-bottom{padding:40px 16px 56px;}html[data-bw-redesign="1"] .bw-c-tourband-inner{grid-template-columns:minmax(260px,42%) minmax(0,1fr);}html[data-bw-redesign="1"] .bw-c-tourband-copy{padding:44px 32px;}}@media (max-width:700px){html[data-bw-redesign="1"] .bw-c-tourband-inner{display:block;min-height:0;}html[data-bw-redesign="1"] .bw-c-tourband-photo{height:250px;min-height:0;}html[data-bw-redesign="1"] .bw-c-tourband-photo img{object-position:54% 42%;}html[data-bw-redesign="1"] .bw-c-tourband-copy{padding:38px 22px 44px;}html[data-bw-redesign="1"] .bw-c-end .bw-c-tourband h2{font-size:36px!important;}}@media (max-width:520px){html[data-bw-redesign="1"] .bw-c-date-card .bw-date-check-blog-card__form{padding:22px 18px 24px!important;}html[data-bw-redesign="1"] .bw-c-date-card .bw-date-check-blog-card__fields{grid-template-columns:1fr!important;}html[data-bw-redesign="1"] .bw-c-date-card .bw-date-check-blog-card__submit{width:100%!important;}html[data-bw-redesign="1"] .bw-c-related{grid-template-columns:1fr!important;}}',
      // Category offer: the card inside the article and the offer version of the closing band. The tour booking card that the
      // offer card replaces is hidden, not removed, so its own script keeps working and comes back for tour posts.
      'html[data-bw-redesign="1"] [data-bw-c-offer-replaced="1"]{display:none!important;}',
      'html[data-bw-redesign="1"] .bw-c-offer-card{display:block!important;margin:38px 0 42px!important;max-width:100%;}',
      'html[data-bw-redesign="1"] .bw-c-offer-card a.bw-c-offer-card-link{background:#102414!important;border-radius:14px;color:#FAFAF5!important;display:grid!important;grid-template-columns:190px minmax(0,1fr);overflow:hidden;text-decoration:none!important;}',
      'html[data-bw-redesign="1"] .bw-c-offer-card .bw-c-offer-card-media{display:block;min-height:214px;overflow:hidden;position:relative;}',
      'html[data-bw-redesign="1"] .bw-c-offer-card .bw-c-offer-card-media img{display:block!important;height:100%!important;left:0;margin:0!important;max-width:none!important;object-fit:cover;position:absolute;top:0;width:100%!important;}',
      'html[data-bw-redesign="1"] .bw-c-offer-card .bw-c-offer-card-copy{display:flex;flex-direction:column;gap:9px;padding:22px 24px;}',
      'html[data-bw-redesign="1"] .bw-c-offer-card .bw-c-offer-card-kicker{color:#C5E1A5!important;font:600 10.5px/1.35 "IBM Plex Mono",monospace!important;letter-spacing:.13em!important;}',
      'html[data-bw-redesign="1"] .bw-c-offer-card .bw-c-offer-card-title{color:#FAFAF5!important;font:400 25px/1.15 "Wobby",Montserrat,Arial,sans-serif!important;font-synthesis:none!important;letter-spacing:0!important;}',
      'html[data-bw-redesign="1"] .bw-c-offer-card .bw-c-offer-card-text{color:rgba(250,250,245,.82)!important;font:400 14.5px/1.55 Montserrat,Arial,sans-serif!important;}',
      'html[data-bw-redesign="1"] .bw-c-offer-card .bw-c-offer-card-cta{align-self:flex-start;background:#FFE600;border-radius:999px;color:#123D18!important;font:800 13px/1 Montserrat,Arial,sans-serif!important;margin-top:5px;padding:13px 20px;}',
      'html[data-bw-redesign="1"] .bw-c-offer-card a.bw-c-offer-card-link:hover .bw-c-offer-card-cta,html[data-bw-redesign="1"] .bw-c-offer-card a.bw-c-offer-card-link:focus-visible .bw-c-offer-card-cta{background:#C5E1A5;}',
      'html[data-bw-redesign="1"] .bw-c-offer-card a.bw-c-offer-card-link:focus-visible{outline:3px solid #1B5E20;outline-offset:3px;}',
      'html[data-bw-redesign="1"] .bw-c-offer-card .bw-c-offer-card-credit{display:block;font:500 10.5px/1.4 Montserrat,Arial,sans-serif!important;margin-top:7px;}',
      'html[data-bw-redesign="1"] .bw-c-offer-card .bw-c-offer-card-credit a{color:#5C665A!important;}',
      'html[data-bw-redesign="1"] .bw-c-end .bw-c-offer-desc{color:rgba(250,250,245,.82);font:400 16px/1.6 Montserrat,Arial,sans-serif;margin:0;max-width:560px;}',
      'html[data-bw-redesign="1"] .bw-c-offerband .bw-c-tourband-photo{position:relative;}',
      'html[data-bw-redesign="1"] .bw-c-offerband .bw-c-offer-credit{bottom:0;left:0;margin:0;position:absolute;}',
      'html[data-bw-redesign="1"] .bw-c-offerband .bw-c-offer-credit a{background:rgba(16,36,20,.74);color:#FAFAF5!important;display:block;font:500 10.5px/1.3 Montserrat,Arial,sans-serif;padding:6px 9px;text-decoration:none!important;}',
      '@media (max-width:600px){html[data-bw-redesign="1"] .bw-c-offer-card a.bw-c-offer-card-link{grid-template-columns:1fr;}html[data-bw-redesign="1"] .bw-c-offer-card .bw-c-offer-card-media{height:180px;min-height:0;}html[data-bw-redesign="1"] .bw-c-offer-card .bw-c-offer-card-copy{padding:20px;}html[data-bw-redesign="1"] .bw-c-offer-card .bw-c-offer-card-title{font-size:23px!important;}}'
    ].join(''); document.head.appendChild(style);
    if (!state.bleedListener) { state.bleedListener = true; addEventListener('resize', function () { document.querySelectorAll('.bw-c-stage,.bw-c-end').forEach(fitStage); document.querySelectorAll('.bw-c-page').forEach(fitPage); }, { passive: true }); }
  }

  function balanceBleed(node) {
    if (!node) return;
    function correct() { if (!node.isConnected) return; node.style.left = '0'; node.style.transform = 'none'; node.style.width = innerWidth + 'px'; node.style.marginLeft = '0'; node.style.marginLeft = -Math.round(node.getBoundingClientRect().left) + 'px'; }
    requestAnimationFrame(correct); setTimeout(correct, 450);
  }

  function highlightHeroTitle(title, post) {
    if (!title || !post || title.querySelector('.bw-c-hero-highlight')) return;
    var entry = state.heroHighlights && state.heroHighlights[post.slug];
    var phrase = text(typeof entry === 'string' ? entry : entry && entry.highlightPhrase);
    var value = text(title.textContent);
    if (!phrase || !value) return;
    var start = value.toLocaleLowerCase().indexOf(phrase.toLocaleLowerCase());
    if (start < 0) return;
    var end = start + phrase.length;
    title.innerHTML = escapeHtml(value.slice(0, start)) + '<em class="bw-c-hero-highlight">' + escapeHtml(value.slice(start, end)) + '</em>' + escapeHtml(value.slice(end));
  }

  function categoryHref(post) {
    var slug = post && post.categorySlug;
    return slug && slug !== 'guide' ? '/blog/categories/' + encodeURIComponent(slug) : '/blog';
  }

  function hero(title, post, body) {
    var old = document.querySelector('.bw-c-hero');
    if (old) {
      var existingEyebrow = old.querySelector('.bw-c-eyebrow');
      if (existingEyebrow && post) existingEyebrow.innerHTML = '<a href="' + escapeHtml(categoryHref(post)) + '">' + escapeHtml(post.category || 'Berlin guide') + '</a>' + (post.readTime ? ' · ' + escapeHtml(post.readTime) : '');
      highlightHeroTitle(old.querySelector('h1'), post);
      var currentStage = stageFor(body); if (currentStage && old.parentElement !== currentStage) currentStage.appendChild(old);
      return old;
    }
    var header = title.closest('header') || title.parentElement;
    if (!header || !header.parentElement) return null;
    var category = post && post.category || 'Berlin guide'; var read = post && post.readTime || ((text(header.textContent).match(/\b\d+\s+min\s+read\b/i) || [])[0] || '');
    var wrapper = document.createElement('section'); wrapper.className = 'bw-c-hero'; wrapper.setAttribute(MARK, 'hero');
    wrapper.innerHTML = '<div class="bw-c-hero-inner"><p class="bw-c-eyebrow"><a href="' + escapeHtml(categoryHref(post)) + '">' + escapeHtml(category) + '</a>' + (read ? ' · ' + escapeHtml(read) : '') + '</p><div data-bw-c-title-slot></div>' + (meta('og:description') ? '<p class="bw-c-dek">' + escapeHtml(meta('og:description')) + '</p>' : '') + '<div class="bw-c-byline"><img alt="Yusuf Ucuz" src="' + PORTRAIT_URL + '"><span>BY YUSUF UCUZ · BERLIN WALKING TOUR GUIDE</span></div></div>';
    var stage = stageFor(body);
    if (stage) stage.appendChild(wrapper);
    else if (body && body.parentElement) body.parentElement.insertBefore(wrapper, body);
    else {
    var article = header.closest('article');
    var host = document.querySelector('main');
    var branch = article;
    while (branch && branch.parentElement && branch.parentElement !== host) branch = branch.parentElement;
    if (host && branch && branch.parentElement === host) host.insertBefore(wrapper, branch);
    else header.parentElement.insertBefore(wrapper, header);
    }
    wrapper.querySelector('[data-bw-c-title-slot]').appendChild(title); highlightHeroTitle(title, post); header.setAttribute('data-bw-redesign-native-header', '1'); if (!stage) balanceBleed(wrapper); return wrapper;
  }

  // Wix replaces main_MF during hydration. Keep only this article's photo
  // outside that disposable root, with an equal-height slot in the article.
  function releaseWallPhoto() {
    if (state.wallPhotoObserver) state.wallPhotoObserver.disconnect();
    if (state.wallPhotoHero && state.wallPhotoHero.getAttribute('aria-owns') === 'bw-wall-persistent-cover') state.wallPhotoHero.removeAttribute('aria-owns');
    if (state.wallPhoto) state.wallPhoto.remove();
    if (state.wallPhotoSlot) state.wallPhotoSlot.remove();
    state.wallPhoto = state.wallPhotoSlot = state.wallPhotoStage = null;
  }
  function positionWallPhoto() {
    if (slug() !== 'where-was-the-berlin-wall-interactive-map') { releaseWallPhoto(); return; }
    var photo = state.wallPhoto, slot = state.wallPhotoSlot;
    if (!photo || !slot || !slot.isConnected) return;
    var height = photo.getBoundingClientRect().height;
    if (slot.style.height !== height + 'px') slot.style.height = height + 'px';
    var rect = slot.getBoundingClientRect();
    [['top', rect.top + scrollY + 'px'], ['left', rect.left + scrollX + 'px'], ['width', rect.width + 'px']].forEach(function (pair) {
      if (photo.style.getPropertyValue(pair[0]) !== pair[1]) photo.style.setProperty(pair[0], pair[1], 'important');
    });
  }
  function persistWallPhoto(photo, heroNode) {
    var slot = state.wallPhotoSlot;
    if (!slot || !slot.isConnected || slot.previousElementSibling !== heroNode) {
      if (slot) slot.remove();
      slot = document.createElement('div'); slot.className = 'bw-c-wall-cover-space'; slot.setAttribute(MARK, 'cover-space');
      slot.setAttribute('aria-hidden', 'true'); slot.style.height = photo.getBoundingClientRect().height + 'px'; heroNode.after(slot);
      state.wallPhotoSlot = slot;
    }
    state.wallPhoto = photo;
    photo.id = 'bw-wall-persistent-cover';
    heroNode.setAttribute('role', 'group'); heroNode.setAttribute('aria-owns', photo.id); state.wallPhotoHero = heroNode;
    if (photo.parentElement !== document.body) document.body.appendChild(photo);
    photo.style.setProperty('position', 'absolute', 'important'); photo.style.setProperty('margin', '0', 'important');
    photo.style.setProperty('z-index', '1', 'important');
    photo.style.setProperty('transform', 'none', 'important');
    var stage = heroNode.parentElement;
    if (state.wallPhotoStage !== stage) {
      if (state.wallPhotoObserver) state.wallPhotoObserver.disconnect();
      state.wallPhotoObserver = new ResizeObserver(positionWallPhoto); state.wallPhotoObserver.observe(stage); state.wallPhotoStage = stage;
    }
    if (!state.wallPhotoListeners) {
      state.wallPhotoListeners = true; addEventListener('resize', positionWallPhoto, {passive:true}); addEventListener('popstate', positionWallPhoto);
    }
    positionWallPhoto(); requestAnimationFrame(positionWallPhoto);
  }

  function cover(heroNode, post) {
    var old = document.querySelector('.bw-c-cover');
    var image = meta('og:image') || post && post.image;
    var source = image ? safeUrl(image) : '';
    if (!source || !heroNode) {
      if (old) old.remove();
      return;
    }

    var isW = source.indexOf('5a08a3_eadb1c41a6db') !== -1;
    var w12 = isW ? source.replace('/w_1672,h_941,al_c/', '/w_1200,h_675,al_c,q_85,enc_auto/') : '';
    var w8 = isW && slug() === 'where-was-the-berlin-wall-interactive-map' ? source.replace('/w_1672,h_941,al_c/', '/w_800,h_450,al_c,q_85,enc_auto/') : '';
    var ss = w12 ? (w8 ? escapeHtml(w8) + ' 800w, ' : '') + escapeHtml(w12) + ' 1200w, ' + escapeHtml(source) + ' 1672w' : '';
    var sz = ss ? '100vw' : '';

    // Re-creating the cover on every hydration render re-decodes the LCP image
    // and feeds this script's own mutation observer. Keep a correct one.
    var wallPhoto = slug() === 'where-was-the-berlin-wall-interactive-map';
    if (wallPhoto && old && old.isConnected && old.querySelector('img')?.getAttribute('src') === source) {
      var existingImage = old.querySelector('img'); if (ss && existingImage.getAttribute('srcset') !== ss) { existingImage.setAttribute('srcset', ss); existingImage.setAttribute('sizes', sz); }
      persistWallPhoto(old, heroNode); return;
    }
    if (old && old.isConnected && heroNode && old.previousElementSibling === heroNode) {
      var currentImage = old.querySelector('img');
      if (currentImage && currentImage.getAttribute('src') === source) {
        if (ss && !currentImage.getAttribute('srcset')) {
          currentImage.setAttribute('srcset', ss);
          currentImage.setAttribute('sizes', sz);
        }
        return;
      }
    }
    if (old) old.remove();

    var alt = meta('og:image:alt') || post && post.alt || '';
    var node = document.createElement('figure');
    node.className = 'bw-c-cover';
    node.setAttribute(MARK, 'cover');
    node.innerHTML = '<img src="' + escapeHtml(source) + '"' + (ss ? ' srcset="' + ss + '" sizes="' + sz + '"' : '') + ' alt="' + escapeHtml(alt) + '" fetchpriority="high">' + (alt ? '<figcaption class="bw-c-cover-caption">' + escapeHtml(alt) + '</figcaption>' : '');
    heroNode.after(node);
    if (wallPhoto) persistWallPhoto(node, heroNode);
    if (!heroNode.closest('.bw-c-stage')) {
      balanceBleed(heroNode);
      balanceBleed(node);
    }
  }

  function lockAdviceTypography(p) {
    var nodes = [p].concat(Array.prototype.slice.call(p.querySelectorAll('span')));
    nodes.forEach(function (node) {
      node.style.setProperty('font-family', 'Fraunces, Merriweather, Georgia, serif', 'important');
      node.style.setProperty('font-size', '22.5px', 'important');
      node.style.setProperty('font-style', 'italic', 'important');
      node.style.setProperty('font-synthesis', 'none', 'important');
      node.style.setProperty('font-weight', '400', 'important');
      node.style.setProperty('line-height', '1.5', 'important');
    });
  }

  function formatAdvice(p) {
    if (!p) return;
    var hasAdvicePrefix = /^My advice:/i.test(text(p.textContent));
    if (!hasAdvicePrefix && !p.classList.contains('bw-c-advice')) return;
    p.classList.add('bw-c-advice');
    lockAdviceTypography(p);
    if (!hasAdvicePrefix || p.querySelector('.bw-c-advice-highlight')) return;
    var walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
    var firstText = null;
    while (walker.nextNode()) {
      if (text(walker.currentNode.nodeValue)) { firstText = walker.currentNode; break; }
    }
    if (!firstText) return;
    var withoutPrefix = firstText.nodeValue.replace(/^\s*My advice:\s*/i, '');
    if (withoutPrefix === firstText.nodeValue) return;
    firstText.nodeValue = withoutPrefix.replace(/^(\s*)([a-z])/, function (_match, leading, letter) { return leading + letter.toUpperCase(); });
    var sentenceEnd = firstText.nodeValue.indexOf('.');
    if (sentenceEnd < 0) return;
    var highlight = document.createElement('span');
    highlight.className = 'bw-c-advice-highlight';
    highlight.textContent = firstText.nodeValue.slice(0, sentenceEnd + 1);
    firstText.nodeValue = firstText.nodeValue.slice(sentenceEnd + 1);
    firstText.parentNode.insertBefore(highlight, firstText);
  }

  function observeAdvice(body) {
    if (state.adviceObserver && state.adviceBody !== body) {
      state.adviceObserver.disconnect();
      state.adviceObserver = null;
      state.adviceScheduled = false;
    }
    if (state.adviceObserver) return;
    state.adviceObserver = new MutationObserver(function () {
      if (state.adviceScheduled) return;
      state.adviceScheduled = true;
      requestAnimationFrame(function () {
        state.adviceScheduled = false;
        Array.prototype.forEach.call(body.querySelectorAll('p'), formatAdvice);
      });
    });
    state.adviceObserver.observe(body, { childList: true, characterData: true, subtree: true });
    state.adviceBody = body;
  }

  function markBody(body) {
    body.setAttribute('data-bw-blog-post-body', '1');
    Array.prototype.forEach.call(body.querySelectorAll('[data-breakout="normal"]'), function (block) {
      var blockStyle = getComputedStyle(block);
      if ((parseFloat(blockStyle.paddingLeft || '0') + parseFloat(blockStyle.paddingRight || '0')) >= 40) block.setAttribute('data-bw-redesign-body-gutter', '1');
    });
    Array.prototype.forEach.call(body.querySelectorAll('p'), formatAdvice);
    observeAdvice(body);
    var first = Array.prototype.find.call(body.querySelectorAll('p'), function (p) { return text(p.textContent).length > 35 && !p.closest('iframe,[data-bw-leadform],[data-bw-c-offer-card]'); });
    if (first) {
      first.classList.add('bw-c-dropcap');
      var gutter = first.parentElement;
      while (gutter && gutter !== body) {
        var gutterStyle = getComputedStyle(gutter);
        if ((parseFloat(gutterStyle.paddingLeft || '0') + parseFloat(gutterStyle.paddingRight || '0')) >= 40) {
          gutter.setAttribute('data-bw-redesign-body-gutter', '1');
          break;
        }
        gutter = gutter.parentElement;
      }
    }
    Array.prototype.forEach.call(body.querySelectorAll('ul,ol'), function (list) {
      if (list.closest('[data-bw-leadform],[data-bw-tourcta],[data-bw-blog-booking],[data-bw-date-check-card]')) return;
      list.classList.add('bw-c-body-list');
    });
  }

  // The Quick Summary is never relocated. Lifting its Wix component out of the
  // article and into a band under the cover left an empty ~900px placeholder
  // behind in the body, and the band itself was rejected. The summary keeps its
  // authored position and its classic card, so there is nothing to promote and
  // no cover-width block to build.
  function keepQuickSummaryInBody() {
    var strip = document.querySelector('.bw-c-glance');
    if (strip) strip.remove();
  }

  function retagFaq() {
    Array.prototype.forEach.call(document.querySelectorAll('iframe[src*="/faq/"]'), function (frame) {
      try { var url = new URL(frame.src); if (url.searchParams.get('bwredesign') !== '1') { url.searchParams.set('bwredesign', '1'); frame.src = url.toString(); } } catch (error) {}
    });
  }

  function hideNativeShare() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-hook="post-main-actions-desktop"],[data-hook="post-main-actions-mobile"]'), function (group) {
      group.setAttribute('data-bw-redesign-native-share', '1');
    });
    Array.prototype.forEach.call(document.querySelectorAll('button'), function (button) {
      var label = text(button.textContent) || text(button.getAttribute('aria-label')) || text(button.getAttribute('title'));
      if (!/^Share via (Facebook|X \(Twitter\)|LinkedIn|link)$|^Print Post$/.test(label)) return;
      var group = button.parentElement;
      while (group && group !== document.body) {
        var matching = Array.prototype.filter.call(group.querySelectorAll('button'), function (candidate) {
          var candidateLabel = text(candidate.textContent) || text(candidate.getAttribute('aria-label')) || text(candidate.getAttribute('title'));
          return /^Share via (Facebook|X \(Twitter\)|LinkedIn|link)$|^Print Post$/.test(candidateLabel);
        });
        if (matching.length >= 3 && group.querySelectorAll('button').length <= 6) { group.setAttribute('data-bw-redesign-native-share', '1'); break; }
        group = group.parentElement;
      }
    });
  }

  function fitInlineSurfaces(body) {
    function compactDateCard(node) {
      if (!node || node.classList.contains('bw-c-date-card')) return;
      var form = node.querySelector('.bw-date-check-blog-card__form');
      var scrim = node.querySelector('.bw-date-check-blog-card__scrim');
      var title = scrim && scrim.querySelector('.bw-date-check-blog-card__title');
      var copy = scrim && scrim.querySelector('.bw-date-check-blog-card__copy');
      var eyebrow = scrim && scrim.querySelector('.bw-date-check-blog-card__eyebrow');
      var fields = form && form.querySelector('.bw-date-check-blog-card__fields');
      // The one-click arm of the Date Check card experiment has no fields, so
      // the intro goes to the top of the panel instead of above them.
      if (form && title && copy) {
        var intro = document.createElement('div');
        intro.className = 'bw-c-date-intro';
        intro.appendChild(title);
        var paragraph = document.createElement('p');
        paragraph.textContent = text(copy.textContent);
        intro.appendChild(paragraph);
        form.insertBefore(intro, fields || form.firstChild);
      }
      if (eyebrow && !/^INTERACTIVE\s*·/.test(text(eyebrow.textContent))) eyebrow.textContent = 'INTERACTIVE · ' + text(eyebrow.textContent);
      node.classList.add('bw-c-date-card');
    }
    function apply() {
      Array.prototype.forEach.call(body.querySelectorAll('[data-bw-blog-booking],[data-bw-date-check-card]'), function (node) {
        if (node.matches('[data-bw-date-check-card]')) compactDateCard(node);
        var alreadyFitted = node.style.getPropertyValue('width') === '100%' && node.style.getPropertyValue('max-width') === 'none' && parseFloat(node.style.getPropertyValue('margin-left') || '0') === 0 && parseFloat(node.style.getPropertyValue('margin-right') || '0') === 0;
        if (alreadyFitted) return;
        node.style.setProperty('width', '100%', 'important');
        node.style.setProperty('max-width', 'none', 'important');
        node.style.setProperty('margin-left', '0', 'important');
        node.style.setProperty('margin-right', '0', 'important');
      });
    }
    apply();
    if (state.surfaceObserver && state.surfaceBody !== body) {
      state.surfaceObserver.disconnect();
      state.surfaceObserver = null;
    }
    if (!state.surfaceObserver) {
      state.surfaceObserver = new MutationObserver(function () { requestAnimationFrame(apply); });
      state.surfaceObserver.observe(body, { attributes: true, attributeFilter: ['style'], childList: true, subtree: true });
      state.surfaceBody = body;
    }
  }

  function shortTocTitle(value) {
    var title = text(value);
    var map = [
      [/^The 18:00 wall/i, 'The 18:00 wall'],
      [/^Four places that stay open properly late/i, 'Open properly late'],
      [/^Watch the cascade for the night you are actually here/i, 'Check your dates'],
      [/^Thursday is Berlin's late museum night/i, 'Thursday nights'],
      [/^The free half is the better half/i, 'The free half'],
      [/^One walk that works, and it is twenty minutes/i, 'The 20-minute walk'],
      [/^How much evening you get depends enormously on the month/i, 'Month by month'],
      [/^Eating, and getting back/i, 'Eating, getting back']
    ];
    for (var i = 0; i < map.length; i += 1) if (map[i][0].test(title)) return map[i][1];
    return title;
  }

  function unlockEndHeights(node) {
    if (state.endHeightObserver) state.endHeightObserver.disconnect();
    function clear() {
      if (!node || !node.isConnected) return;
      [node, node.querySelector('.bw-c-bottom'), node.querySelector('.bw-c-faq-slot')].forEach(function (target) {
        if (!target) return;
        target.style.removeProperty('height');
        target.style.removeProperty('min-height');
        target.style.removeProperty('max-height');
      });
    }
    clear();
    state.endHeightObserver = new MutationObserver(function () { requestAnimationFrame(clear); });
    state.endHeightObserver.observe(node, { attributes: true, attributeFilter: ['style'], subtree: true });
  }

  function railGifts() {
    var gifts = RAIL_GIFTS.map(function (item) {
      var imageUrl = 'https://static.wixstatic.com/media/' + item.image + '/v1/fill/w_144,h_144,al_c,q_82/' + item.image;
      return '<span class="bw-c-rail-gift-item"><img src="' + escapeHtml(imageUrl) + '" alt="" width="144" height="144" loading="lazy" decoding="async">' + escapeHtml(item.label) + '</span>';
    }).join('');
    return '<a class="bw-c-rail-gifts" href="/gifts"><strong>Berlin Gifts</strong>' +
      '<span class="bw-c-rail-gift-grid">' + gifts + '</span>' +
      '<span class="bw-c-rail-gifts-cta">Shop gifts <span aria-hidden="true">↗</span></span></a>';
  }

  function toc(items, body, post, tool) {
    var page = pageFor(body); if (!page) return;
    var links = items.map(function (item) { return '<a href="#' + item.id + '"><span class="bw-c-rail-number">' + item.number + '</span><span class="bw-c-rail-text">' + escapeHtml(shortTocTitle(item.title)) + '</span></a>'; }).join('');
    var signature = links + '||' + (tool && tool.slug || '');
    var currentRail = page.querySelector(':scope > .bw-c-rail');
    var currentMobile = document.querySelector('.bw-c-mobile-toc');
    // Renders run on every Wix mutation for the first 31s. Tearing the rail and
    // the mobile TOC down each time is churn that re-triggers this script's own
    // observer, so rebuild only when the links or the tool changed.
    if (currentRail && currentMobile
      && currentRail.getAttribute('data-bw-toc-signature') === signature
      && currentMobile.nextElementSibling === body
      && page.firstElementChild === currentRail) {
      if (state.updateToc) state.updateToc();
      return;
    }
    document.querySelectorAll('.bw-c-mobile-toc,.bw-c-rail').forEach(function (node) { node.remove(); });
    var mobile = document.createElement('nav'); mobile.className = 'bw-c-mobile-toc'; mobile.setAttribute(MARK, 'toc'); mobile.innerHTML = '<div class="bw-c-mobile-toc-scroll">' + links + '</div>'; body.before(mobile);
    var rail = document.createElement('aside'); rail.className = 'bw-c-rail'; rail.setAttribute(MARK, 'rail'); rail.setAttribute('data-bw-toc-signature', signature);
    rail.innerHTML = '<span class="bw-c-rail-progress" aria-hidden="true"><i></i></span><p class="bw-c-rail-title">ON THIS PAGE</p><nav class="bw-c-rail-list">' + links + '</nav>' + railGifts() +
      '<div class="bw-c-rail-tour"><span class="bw-c-rail-label">EXPLORE BERLIN</span><strong>Walk at your pace or with me.</strong><a class="bw-c-rail-choice bw-c-rail-choice-audio" href="' + AUDIO_TOURS_URL + '"><span>AUDIO TOURS<small>Listen as you walk</small></span><span aria-hidden="true">↗</span></a><a class="bw-c-rail-choice bw-c-rail-choice-walk" href="' + BOOKING_URL + '"><span>BERLIN THEN AND NOW<small>With me · about 2.5 hours · €15</small></span><span aria-hidden="true">↗</span></a></div>' + (tool ? '<a class="bw-c-rail-tool" href="/tools/' + escapeHtml(tool.slug) + '"><span class="bw-c-rail-label">ARTICLE TOOL</span><strong>' + escapeHtml(tool.title) + '</strong><small>Open the tool →</small></a>' : '') + '<a class="bw-c-rail-all" href="/blog">← ALL GUIDES</a>';
    page.insertBefore(rail, page.firstChild);
    function followSection(event) {
      var link = event.target.closest('a[href^="#"]'); if (!link) return;
      var target = document.getElementById(link.getAttribute('href').slice(1)); if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    rail.addEventListener('click', followSection);
    mobile.addEventListener('click', followSection);
    function position() {
      var active = items[0];
      items.forEach(function (item) { if (item.node.getBoundingClientRect().top < 155) active = item; });
      rail.querySelectorAll('.bw-c-rail-list a').forEach(function (a) { a.setAttribute('data-active', a.getAttribute('href') === '#' + active.id ? '1' : '0'); });
      var bodyRect = body.getBoundingClientRect();
      var distance = Math.max(1, bodyRect.height - innerHeight * .55);
      var progress = Math.max(0, Math.min(1, (155 - bodyRect.top) / distance));
      var fill = rail.querySelector('.bw-c-rail-progress i');
      if (fill) fill.style.height = (progress * 100).toFixed(1) + '%';
    }
    state.updateToc = position;
    if (!state.tocListener) { state.tocListener = true; addEventListener('scroll', function () { if (state.updateToc) state.updateToc(); }, { passive: true }); addEventListener('resize', function () { if (state.updateToc) state.updateToc(); }, { passive: true }); }
    position();
  }

  var RELATED_STOP_WORDS = {
    about: true, after: true, almost: true, berlin: true, best: true, centre: true, central: true, city: true, day: true, dead: true,
    every: true, for: true, from: true, guide: true, here: true, hour: true, how: true, is: true, it: true, its: true, one: true,
    part: true, plan: true, that: true, the: true, their: true, this: true, to: true, tourist: true, trip: true, use: true, visitors: true,
    what: true, when: true, with: true, you: true, your: true
  };
  var RELATED_INTENT_WORDS = {
    dinner: true, evening: true, floodlit: true, food: true, late: true, light: true, museum: true, night: true, open: true, transport: true, walk: true
  };
  var SEASONAL_RELATED_WORDS = { advent: true, christmas: true, winter: true };

  function normalRelatedToken(value) {
    var token = String(value || '').toLowerCase();
    if (token.length > 5 && /ies$/.test(token)) return token.slice(0, -3) + 'y';
    if (token.length > 4 && /s$/.test(token)) return token.slice(0, -1);
    return token;
  }

  function relatedTokens(item) {
    var raw = [item && item.title, item && item.excerpt, item && item.topicLabel, item && item.topic].join(' ').toLowerCase().match(/[a-z0-9]+/g) || [];
    var seen = {};
    return raw.map(normalRelatedToken).filter(function (token) {
      if (token.length < 4 || RELATED_STOP_WORDS[token] || seen[token]) return false;
      seen[token] = true;
      return true;
    });
  }

  function related(post) {
    var sourceTokens = relatedTokens(post).filter(function (token) { return RELATED_INTENT_WORDS[token]; });
    var sourceSeasonal = sourceTokens.some(function (token) { return SEASONAL_RELATED_WORDS[token]; });
    return (state.archive && state.archive.allPosts || []).map(function (candidate) {
      if (!candidate || candidate.slug === post.slug) return null;
      var candidateTokens = relatedTokens(candidate);
      var categoryMatch = candidate.categorySlug && candidate.categorySlug === post.categorySlug;
      var topicMatch = candidate.topic && candidate.topic === post.topic;
      var overlap = candidateTokens.filter(function (token) { return sourceTokens.indexOf(token) > -1; });
      var candidateSeasonal = candidateTokens.some(function (token) { return SEASONAL_RELATED_WORDS[token]; });
      if ((!categoryMatch && !topicMatch && !overlap.length) || (!sourceSeasonal && candidateSeasonal)) return null;
      return {
        candidate: candidate,
        score: (categoryMatch ? 18 : 0) + (topicMatch ? 42 : 0) + overlap.length * 17,
        published: Date.parse(candidate.publishedDate || '') || 0
      };
    }).filter(Boolean).sort(function (a, b) {
      return b.score - a.score || b.published - a.published;
    }).slice(0, 3).map(function (entry) { return entry.candidate; });
  }
  async function copyArticleLink(button, container) {
    var url = location.href.split('#')[0];
    button.disabled = true;
    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(url);
      button.textContent = 'Copied';
      button.removeAttribute('aria-label');
      setTimeout(function () { button.textContent = 'Copy link'; }, 1200);
    } catch (_) {
      var field = container.querySelector('[data-bw-c-link-field]');
      if (!field) {
        field = document.createElement('input');
        field.type = 'text'; field.readOnly = true;
        field.setAttribute('data-bw-c-link-field', '1');
        field.setAttribute('aria-label', 'Page link, select and copy');
        field.style.cssText = 'box-sizing:border-box;flex-basis:100%;width:100%;min-width:0;max-width:100%;padding:10px;border:1px solid #DDE4D6;border-radius:8px;color:#123D18;background:#fff;font:12px/1.5 sans-serif;';
        container.appendChild(field);
      }
      field.value = url; field.focus(); field.select();
      button.textContent = 'Select link';
      button.setAttribute('aria-label', 'Select and copy the page link');
    } finally {
      button.disabled = false;
    }
  }

  // Slug and title words win over the category, because they name the reader's real intent: a club post filed under
  // Tourist Tips wants the club plan, a Wall post in any category wants the Wall walk. Christmas words count until 24 Dec.
  function offerIdFor(post, slugValue) {
    // Slug and title only: the topic label of every food post says "Food & Nightlife", which is not a club post.
    var words = [slugValue === undefined ? slug() : slugValue, post && post.title].join(' ').toLowerCase();
    var category = post && post.categorySlug || '', topic = post && post.topic || '';
    if (!/football|hertha|stadium|matchday|bundesliga|basketball|sports[- ]club/.test(words) && /\bclubs?\b|clubbing|clubkultur|berghain|kitkat|techno|\brave\b|tresor|sisyphos|nightlife|dress[- ]codes?|bouncer/.test(words)) return 'club-night';
    if (/berlin[- ]wall|\bthe[- ]wall\b|\bwall[- ](?:trace|remains|trail|memorial|map|museum|in[- ]mitte)|mauerweg|\bmauer\b|death[- ]strip|checkpoint|east[- ]side[- ]gallery|east[- ]vs\.?[- ]west|divided/.test(words)) return 'wall-audio';
    if (Date.now() <= CHRISTMAS_OFFER_UNTIL && /christmas|\badvent\b|xmas|weihnacht|gl(?:ü|ue)hwein|\bgifts?\b|souvenirs?/.test(words)) return 'gifts';
    if (category === 'living-in-berlin') return 'street-1928';
    if (category === 'german-language') return 'sprueche';
    if (category === 'tourist-tips' && topic === 'food-nightlife') return 'posters';
    if (category === 'tourist-tips' && /^(?:first-day|practical|when-to-visit|free-budget)$/.test(topic)) return 'first-day';
    return 'tour';
  }

  function offerAttrs(id, slotName) { return ' data-bw-offer-link="1" data-bw-offer="' + id + '" data-bw-slot="' + slotName + '"'; }

  function tourBandHtml() {
    var bandSub = 'ABOUT 2.5 HOURS · 11 STOPS, 16 PLACES · MAX 10 · €15' + '.<br> STARTS AT THE WORLD CLOCK · ENDS AT HACKESCHER MARKT';
    return '<div class="bw-c-tourband" data-bw-offer="tour"><div class="bw-c-tourband-inner"><figure class="bw-c-tourband-photo"><img src="' + TOUR_BAND_IMAGE + '" alt="Yusuf guiding in front of Berlin’s Rotes Rathaus" loading="lazy" decoding="async"></figure><div class="bw-c-tourband-copy"><p class="bw-c-end-kicker">BERLIN THEN AND NOW · AN ARCHIVE PHOTO AT EVERY STOP</p><h2>Walk the Berlin that disappeared, with me.</h2><p class="bw-c-tourband-sub">' + bandSub + '</p><div class="bw-c-tourband-div"></div><a class="bw-c-book" href="' + BOOKING_URL + '"' + offerAttrs('tour', 'end') + '>See dates and book</a></div></div></div>';
  }

  function bandHtml(id) {
    var offer = OFFERS[id];
    if (!offer) return tourBandHtml();
    var credit = offer.credit ? '<figcaption class="bw-c-offer-credit"><a href="' + escapeHtml(offer.credit.href) + '" target="_blank" rel="noopener">' + escapeHtml(offer.credit.text) + '</a></figcaption>' : '';
    return '<div class="bw-c-tourband bw-c-offerband" data-bw-offer="' + id + '"><div class="bw-c-tourband-inner"><figure class="bw-c-tourband-photo"><img src="' + escapeHtml(offer.image) + '" alt="' + escapeHtml(offer.alt) + '" loading="lazy" decoding="async">' + credit + '</figure><div class="bw-c-tourband-copy"><p class="bw-c-end-kicker">' + escapeHtml(offer.kicker) + '</p><h2>' + escapeHtml(offer.title) + '</h2><p class="bw-c-offer-desc">' + escapeHtml(offer.text) + '</p><div class="bw-c-tourband-div"></div><a class="bw-c-book" href="' + escapeHtml(offer.href) + '"' + offerAttrs(id, 'end') + '>' + escapeHtml(offer.cta) + '</a></div></div></div>';
  }

  // The archive arrives after the first paint, so a band drawn from the slug alone is swapped in place once the category is
  // known. Only the band changes: rebuilding the whole end module would reload the FAQ iframe.
  function syncBand(node, id) {
    var band = node && node.querySelector('.bw-c-tourband');
    if (!band) return;
    if (band.getAttribute('data-bw-offer') !== id) {
      var holder = document.createElement('div'); holder.innerHTML = bandHtml(id);
      band.replaceWith(holder.firstChild); band = node.querySelector('.bw-c-tourband');
    }
    watchOffer(band, id, 'end');
  }

  function midCardHtml(id) {
    var offer = OFFERS[id];
    return '<a class="bw-c-offer-card-link" href="' + escapeHtml(offer.href) + '"' + offerAttrs(id, 'mid') + '><span class="bw-c-offer-card-media"><img src="' + escapeHtml(offer.image) + '" alt="' + escapeHtml(offer.alt) + '" loading="lazy" decoding="async"></span><span class="bw-c-offer-card-copy"><span class="bw-c-offer-card-kicker">' + escapeHtml(offer.kicker) + '</span><strong class="bw-c-offer-card-title">' + escapeHtml(offer.title) + '</strong><span class="bw-c-offer-card-text">' + escapeHtml(offer.text) + '</span><span class="bw-c-offer-card-cta">' + escapeHtml(offer.cta) + ' <span aria-hidden="true">→</span></span></span></a>' +
      (offer.credit ? '<span class="bw-c-offer-card-credit"><a href="' + escapeHtml(offer.credit.href) + '" target="_blank" rel="noopener">' + escapeHtml(offer.credit.text) + '</a></span>' : '');
  }

  // One card inside the article: it takes the place of the tour booking card (hidden, not removed), or, on a post without
  // one, sits before the heading about a third of the way down. Tour posts keep the booking card as it is.
  function midOffer(body, items, id) {
    var card = document.querySelector('[data-bw-c-offer-card]');
    var bookings = body.querySelectorAll('[data-bw-blog-booking]');
    if (!OFFERS[id]) {
      if (card) card.remove();
      Array.prototype.forEach.call(document.querySelectorAll('[data-bw-c-offer-replaced]'), function (node) { node.removeAttribute('data-bw-c-offer-replaced'); });
      if (bookings[0]) watchOffer(bookings[0], 'tour', 'mid');
      return;
    }
    Array.prototype.forEach.call(bookings, function (node) { if (node.getAttribute('data-bw-c-offer-replaced') !== '1') node.setAttribute('data-bw-c-offer-replaced', '1'); });
    var anchor = bookings[0] || null;
    if (!anchor) {
      var heading = items.length >= 2 ? items[Math.max(1, Math.floor(items.length * 0.3))] : null;
      anchor = heading && heading.node;
    }
    if (!anchor || !anchor.parentNode) { if (card) card.remove(); return; }
    if (!card || card.getAttribute('data-bw-offer') !== id) {
      if (card) card.remove();
      card = document.createElement('aside'); card.className = 'bw-c-offer-card';
      card.setAttribute('data-bw-c-offer-card', '1'); card.setAttribute('data-bw-offer', id); card.setAttribute('aria-label', OFFERS[id].kicker);
      card.innerHTML = midCardHtml(id);
    }
    if (anchor.previousElementSibling !== card) anchor.parentNode.insertBefore(card, anchor);
    watchOffer(card, id, 'mid');
  }

  function counterAllowed() {
    try {
      if (location.hostname !== 'www.walkofberlin.com' || window.top !== window.self) return false;
      if (navigator.webdriver === true || navigator.globalPrivacyControl === true) return false;
      if (new URLSearchParams(location.search).get('bwqa') === '1') return false;
    } catch (error) { return false; }
    try { if (localStorage.getItem('bwTrafficCountOptOut') === '1') return false; } catch (error) { /* storage blocked: still count */ }
    return true;
  }

  function countOffer(id, slotName, action) {
    if (!id || !slotName) return;
    state.offerSent = state.offerSent || {};
    var key = id + '|' + slotName + '|' + action;
    if (state.offerSent[key]) return;
    state.offerSent[key] = true;
    try {
      var measurement = window.BWDateCheckMeasurement;
      if (measurement && measurement.analyticsAllowed && measurement.analyticsAllowed() && typeof window.gtag === 'function') window.gtag('event', 'bw_blog_offer_' + action, { offer_id: id, offer_slot: slotName, post_slug: slug().slice(0, 90) });
    } catch (error) {}
    if (!counterAllowed()) return;
    try {
      fetch(COUNTER_URL, { method: 'POST', mode: 'cors', credentials: 'omit', cache: 'no-store', keepalive: true, referrerPolicy: 'no-referrer', headers: { 'content-type': 'text/plain' }, body: JSON.stringify({ v: 1, p: '/blog-offer/' + id + '/step-' + slotName + '-' + action }) }).catch(function () {});
    } catch (error) {}
  }

  // Seen = at least half of the box on screen. A box drawn before the archive arrived only counts once the offer is final.
  function watchOffer(node, id, slotName) {
    if (!node || node.__bwOfferWatch === id + '|' + slotName || !('IntersectionObserver' in window)) return;
    node.__bwOfferWatch = id + '|' + slotName;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.5) return;
        function settle() {
          if (!node.isConnected || node.__bwOfferWatch !== id + '|' + slotName) { observer.disconnect(); return; }
          if (!state.dataSettled) { setTimeout(settle, 400); return; }
          var rect = node.getBoundingClientRect(), shown = Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0);
          if (rect.height && shown / Math.min(rect.height, innerHeight) >= 0.5 && getComputedStyle(node).display !== 'none') { countOffer(id, slotName, 'seen'); observer.disconnect(); }
        }
        settle();
      });
    }, { threshold: [0.5] });
    observer.observe(node);
  }

  function listenOfferClicks() {
    if (state.offerClicks) return;
    state.offerClicks = true;
    document.addEventListener('click', function (event) {
      var link = event.target && event.target.closest && event.target.closest('a[href]');
      if (!link) return;
      if (link.hasAttribute('data-bw-offer-link')) { countOffer(link.getAttribute('data-bw-offer'), link.getAttribute('data-bw-slot'), 'click'); return; }
      if (link.closest('[data-bw-blog-booking]') && !link.closest('[data-bw-c-offer-replaced]') && /berlin-then-and-now/.test(link.getAttribute('href') || '')) countOffer('tour', 'mid', 'click');
    }, true);
  }

  function endModule(body, post) {
    var old = document.querySelector('[data-bw-redesign-end]');
    var faqFrame = Array.prototype.find.call(document.querySelectorAll('iframe[src*="/faq/"]'), function (candidate) { return candidate.isConnected; });
    var faqHost = faqFrame && (faqFrame.closest('[data-hook="html-component"]') || faqFrame.parentElement);
    var anchor = body.closest('.bw-c-page') || body;
    var currentSlot = old && old.querySelector('.bw-c-faq-slot');
    // The mobile document mounts an iframe only when it nears the viewport, so
    // a FAQ that has not loaded yet has no frame to find. Keep the host the slot
    // already owns, and otherwise find the empty host by its embed id.
    if (!faqHost && currentSlot) faqHost = currentSlot.querySelector('[data-hook="html-component"]');
    if (!faqHost) {
      var faqEmbed = Array.prototype.find.call(body.querySelectorAll('[id^="viewer-"]'), function (candidate) {
        return /^viewer-(?:embed[_-]|emb_)?faq/i.test(candidate.id) && candidate.querySelector('[data-hook="html-component"]');
      });
      faqHost = faqEmbed && faqEmbed.querySelector('[data-hook="html-component"]');
    }
    var faqWrap = faqHost && faqHost.closest('[id^="viewer-"]');
    // Moving an iframe in the DOM reloads it. This module used to be torn down
    // and rebuilt on every hydration render, which reloaded the FAQ iframe
    // roughly a hundred times in the first 31s and left its height swinging
    // between the empty shell and the loaded content the whole time. A module
    // that is already in the right place and already owns the FAQ host is done.
    if (old && old.isConnected && anchor.nextElementSibling === old && (!faqHost || faqHost.parentElement === currentSlot)) {
      syncBand(old, offerIdFor(post));
      unlockEndHeights(old);
      return;
    }
    var faqFragment = document.createDocumentFragment();
    if (faqHost) faqFragment.appendChild(faqHost);
    // The empty embed left behind keeps its reserved height otherwise.
    if (faqWrap) faqWrap.style.setProperty('display', 'none', 'important');
    Array.prototype.forEach.call(body.querySelectorAll('[id^="viewer-faq_"]'), function (placeholder) {
      if (!placeholder.querySelector('iframe[src*="/faq/"]')) placeholder.remove();
    });
    if (old) old.remove();
    var node = document.createElement('section'); node.className = 'bw-c-end'; node.setAttribute('data-bw-redesign-end', '1');
    var cards = post ? related(post).map(function (item) { return '<a href="' + escapeHtml(item.path || '/post/' + item.slug) + '">' + (item.thumb || item.image ? '<img src="' + escapeHtml(item.thumb || item.image) + '" alt="' + escapeHtml(item.alt || '') + '">' : '') + '<div class="bw-c-related-copy"><span class="bw-c-related-kicker">' + escapeHtml(item.category || 'Guide') + '</span><strong>' + escapeHtml(item.title) + '</strong></div></a>'; }).join('') : '';
    var shareUrl = encodeURIComponent(location.href.split('#')[0]), title = encodeURIComponent(document.title);
    var offerId = offerIdFor(post);
    node.innerHTML = bandHtml(offerId) + '<div class="bw-c-bottom">' + (cards ? '<p class="bw-c-section-label">RELATED GUIDES</p><div class="bw-c-related">' + cards + '</div>' : '') + (faqHost ? '<p class="bw-c-section-label">QUESTIONS PEOPLE ACTUALLY ASK</p><div class="bw-c-faq-slot"></div>' : '') + '<div class="bw-c-share"><span class="bw-c-share-label">SHARE THIS GUIDE</span><a target="_blank" rel="noopener" href="https://wa.me/?text=' + shareUrl + '">WhatsApp</a><a target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=' + shareUrl + '">Facebook</a><a target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?url=' + shareUrl + '&text=' + title + '">X</a><button type="button" data-bw-c-copy>Copy link</button></div></div>';
    node.addEventListener('click', function (event) { if (!event.target.matches('[data-bw-c-copy]')) return; copyArticleLink(event.target, event.target.closest('.bw-c-share')); }); var pageNode = body.closest('.bw-c-page'); (pageNode || body).after(node); fitStage(node);
    var faqSlot = node.querySelector('.bw-c-faq-slot');
    if (faqSlot && faqHost) faqSlot.appendChild(faqFragment);
    watchOffer(node.querySelector('.bw-c-tourband'), offerId, 'end');
    unlockEndHeights(node);
  }

  function paint() {
    document.documentElement.setAttribute('data-bw-redesign', '1'); injectStyle(); var body = findBody(), title = findTitle(); if (!body || !title) return;
    markBody(body); var post = postMeta(), heroNode = hero(title, post, body); cover(heroNode, post); var items = headings(body); toc(items, body, post, toolFor(post)); fitInlineSurfaces(body); midOffer(body, items, offerIdFor(post)); listenOfferClicks(); keepQuickSummaryInBody(); retagFaq(); hideNativeShare(); endModule(body, post);
    // Change the commercial band only, preserving the FAQ iframe and related guides.
    if (window.BWGiftWeek202611) window.BWGiftWeek202611.scan();
  }
  // Every write below is a mutation, and the hydration observer watches the whole
  // document. Without this pause the script answers its own edits and re-runs
  // roughly every 120ms until the 31s window closes.
  function render() {
    if (!enabled() || !postPage() || state.rendering) return;
    state.rendering = true;
    var watching = !!state.observer;
    if (watching) state.observer.disconnect();
    try { paint(); } finally {
      state.rendering = false;
      if (watching) {
        // Reconnect before yielding: Wix can insert the replacement article
        // before the next animation frame. Our own writes happened detached.
        state.observer.takeRecords();
        if (state.observer && (Date.now() < state.until || (slug() === 'where-was-the-berlin-wall-interactive-map' && state.wallPhoto))) state.observer.observe(document.documentElement, { childList: true, subtree: true });
      }
    }
  }
  function schedule(delay) { clearTimeout(state.timer); state.timer = setTimeout(render, delay || 0); }
  function boot() {
    if (!enabled() || !postPage()) return;
    // The first complete native header must be enhanced in this task, not a
    // later timer after it has already painted. Hydration remains observed.
    state.until = Date.now() + 31000; loadData(); render(); [160, 650, 1600, 4000, 9000, 16000, 30000].forEach(function (delay) { setTimeout(render, delay); });
    if (state.observer) state.observer.disconnect();
    // A hydration pass that removes the hero must be repaired in the same
    // mutation microtask, before the browser paints. The trailing debounce
    // alone is not enough: every mutation in the burst resets the 120ms timer,
    // which held the old layout on screen for 571ms in live measurement.
    state.observer = new MutationObserver(function () {
      if (state.wallPhoto && slug() !== 'where-was-the-berlin-wall-interactive-map') releaseWallPhoto();
      if (slug() === 'where-was-the-berlin-wall-interactive-map' && state.wallPhoto && (!document.querySelector('.bw-c-hero') || !state.wallPhotoSlot || !state.wallPhotoSlot.isConnected || !state.wallPhoto.isConnected)) {
        render(); return;
      }
      if (Date.now() >= state.until) return;
      if (!state.rendering && !document.querySelector('.bw-c-hero')) render();
      schedule(120);
    });
    state.observer.observe(document.documentElement, { childList: true, subtree: true });
  }
  window.BWBlogOffers = { idFor: offerIdFor, offers: OFFERS };
  boot();
})();
