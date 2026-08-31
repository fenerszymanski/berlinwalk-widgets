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
  var BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
  var PORTRAIT_URL = BASE + 'blog-hero/assets/yusuf-guide-portrait.jpg';
  var TOUR_BAND_IMAGE = BASE + 'blog-hero/assets/tour-cta-yusuf-rathaus-solo.jpg';
  var state = { archive: null, tools: null, heroHighlights: null, timer: null, observer: null, until: 0, adviceObserver: null, adviceBody: null, adviceScheduled: false, rendering: false };

  function enabled() {
    try {
      var params = new URLSearchParams(location.search);
      return DEFAULT_ON || params.get('bwredesign') === '1' || localStorage.getItem('bwRedesign') === '1';
    } catch (error) { return DEFAULT_ON; }
  }

  function postPage() { return location.pathname.indexOf('/post/') === 0; }
  function slug() { return location.pathname.replace(/^\/post\//, '').replace(/\/+$/, ''); }
  function text(value) { return String(value || '').replace(/\s+/g, ' ').trim(); }
  function escapeHtml(value) { return String(value || '').replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function safeUrl(value) { try { return new URL(value, location.href).toString(); } catch (error) { return ''; } }
  function visible(node) { return !!(node && node.isConnected && getComputedStyle(node).display !== 'none' && getComputedStyle(node).visibility !== 'hidden'); }
  function findBody() { return document.querySelector('[data-hook="post-description"], [data-hook="post-content"], [data-hook="rich-content-viewer"], [data-hook="rich-content"], .blog-post-page-content'); }
  function findTitle() { return document.querySelector('.bw-c-hero h1') || Array.prototype.find.call(document.querySelectorAll('h1'), function (node) { return visible(node) && !node.closest('[' + MARK + ']'); }) || null; }
  function postMeta() { return state.archive && (state.archive.allPosts || []).find(function (post) { return post.slug === slug(); }) || null; }
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
      fetch(ARCHIVE_URL, { cache: 'force-cache' }).then(function (r) { return r.ok ? r.json() : null; }),
      fetch(TOOLS_URL, { cache: 'force-cache' }).then(function (r) { return r.ok ? r.json() : null; }),
      fetch(HERO_HIGHLIGHTS_URL, { cache: 'force-cache' }).then(function (r) { return r.ok ? r.json() : null; })
    ]).then(function (result) {
      state.archive = result[0]; state.tools = result[1]; state.heroHighlights = result[2] || {}; schedule(0); return result;
    }).catch(function () { return null; });
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
      // Declare both Fraunces faces here rather than trusting the head embed:
      // the redesign must not depend on another surface for its own fonts, and a
      // family that carries only one style is worse than none, because the
      // browser then uses that single face for BOTH styles. Without a real
      // italic face the browser skews the roman one, and that synthetic italic
      // is what made the yellow hero word read bolder than the rest of the
      // title, so synthesis is refused wherever the redesign asks for italic.
      '@font-face{font-family:Fraunces;font-style:normal;font-weight:100 900;font-display:swap;src:url(' + BASE + 'brand/fonts/editorial-v2/Fraunces-Variable.woff2) format("woff2");}',
      '@font-face{font-family:Fraunces;font-style:italic;font-weight:100 900;font-display:swap;src:url(' + BASE + 'brand/fonts/editorial-v2/Fraunces-Italic-Variable.woff2) format("woff2");}',
      'html[data-bw-redesign="1"]{scroll-behavior:smooth;}',
      'html[data-bw-redesign="1"] [data-bw-redesign-native-header="1"]{display:none!important;}',
      'html[data-bw-redesign="1"] .bw-c-stage{margin:0!important;padding:0!important;width:100%!important;}html[data-bw-redesign="1"] .bw-c-hero{background-color:#102414;background-image:linear-gradient(rgba(250,250,245,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(250,250,245,.055) 1px,transparent 1px);background-size:34px 34px;box-sizing:border-box;color:#FAFAF5;left:50%;margin:0;position:relative;padding:70px max(28px,calc((100vw - 880px)/2)) 62px;transform:translateX(-50%);width:100vw;}html[data-bw-redesign="1"] .bw-c-stage .bw-c-hero{left:auto!important;margin:0!important;transform:none!important;width:100%!important;}',
      'html[data-bw-redesign="1"] .bw-c-hero-inner{max-width:880px;margin:0 auto;}html[data-bw-redesign="1"] .bw-c-eyebrow,html[data-bw-redesign="1"] .bw-c-byline,html[data-bw-redesign="1"] .bw-c-rail,html[data-bw-redesign="1"] .bw-c-mobile-toc,html[data-bw-redesign="1"] .bw-c-cover-caption,html[data-bw-redesign="1"] .bw-c-tile-label,html[data-bw-redesign="1"] .bw-c-end-kicker{font-family:"IBM Plex Mono",ui-monospace,monospace;}',
      'html[data-bw-redesign="1"] .bw-c-eyebrow{color:#C5E1A5;font-size:11px;font-weight:600;letter-spacing:.12em;margin:0 0 17px;text-transform:uppercase;}html[data-bw-redesign="1"] .bw-c-eyebrow a{color:inherit;text-decoration-color:#FFE600;text-underline-offset:3px;}',
      'html[data-bw-redesign="1"] .bw-c-hero h1{color:#FAFAF5!important;font-family:Fraunces,Merriweather,Georgia,serif!important;font-size:clamp(40px,5.2vw,60px)!important;font-style:normal!important;font-weight:600!important;letter-spacing:-.035em!important;line-height:1.03!important;margin:0!important;max-width:860px;text-shadow:none!important;-webkit-text-stroke:0!important;}html[data-bw-redesign="1"] .bw-c-hero h1 .bw-c-hero-highlight{color:#FFE600!important;font-style:italic!important;font-weight:600!important;font-synthesis:none!important;font-synthesis-weight:none!important;font-synthesis-style:none!important;}html[data-bw-redesign="1"] .bw-c-dek{color:#FAFAF5;font:italic 18px/1.65 Merriweather,Georgia,serif;margin:22px 0 23px;max-width:730px;}html[data-bw-redesign="1"] .bw-c-byline{align-items:center;color:#C5E1A5;display:flex;font-size:10px;font-weight:600;gap:10px;letter-spacing:.08em;text-transform:uppercase;}html[data-bw-redesign="1"] .bw-c-byline img{border:1px solid #C5E1A5;border-radius:50%;height:31px;object-fit:cover;width:31px;}',
      'html[data-bw-redesign="1"] .bw-c-cover{box-sizing:border-box;height:520px;left:50%;margin:0;overflow:hidden;position:relative;transform:translateX(-50%);width:100vw;}html[data-bw-redesign="1"] .bw-c-stage .bw-c-cover{left:auto!important;margin:0!important;transform:none!important;width:100%!important;}html[data-bw-redesign="1"] .bw-c-cover img{display:block;height:100%;object-fit:cover;width:100%;}html[data-bw-redesign="1"] .bw-c-cover-caption{background:rgba(16,36,20,.82);bottom:0;color:#FAFAF5;font-size:10px;left:auto;letter-spacing:.04em;max-width:min(540px,calc(100% - 32px));padding:10px 16px;position:absolute;right:0;}',
      'html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] h2{border-top:0!important;color:#212121!important;font-family:"BW Montserrat Black",Montserrat,Arial,sans-serif!important;font-size:28px!important;line-height:1.1!important;margin:48px 0 15px!important;padding:18px 0 0!important;position:relative;text-shadow:none!important;-webkit-text-stroke:0!important;}html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] h2:before{background:#1B5E20;content:"";height:5px;left:0;position:absolute;top:0;width:38px;}html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] h2:after{color:#1B5E20;content:attr(data-bw-section);font:600 10px/1 "IBM Plex Mono",monospace;letter-spacing:.12em;position:absolute;right:0;top:0;}html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] h3{font-family:"BW Montserrat Black",Montserrat,Arial,sans-serif!important;font-size:21px!important;text-shadow:none!important;-webkit-text-stroke:0!important;}html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] p.bw-c-dropcap:first-letter{color:#1B5E20;float:left;font-family:Fraunces,Georgia,serif;font-size:4.1em;font-weight:600;line-height:.74;margin:.12em .1em 0 0;}html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] p.bw-c-advice{border-bottom:1px solid #DDE4D6;border-top:1px solid #DDE4D6;color:#212121!important;font-family:Fraunces,Merriweather,Georgia,serif!important;font-size:22.5px!important;font-style:italic!important;font-synthesis:none!important;font-weight:400!important;line-height:1.5!important;margin:34px 0!important;padding:35px 0 25px!important;position:relative;}html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] p.bw-c-advice span,html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] p.bw-c-advice span *{color:inherit!important;font-family:Fraunces,Merriweather,Georgia,serif!important;font-size:22.5px!important;font-style:italic!important;font-synthesis:none!important;font-weight:400!important;line-height:1.5!important;}html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] p.bw-c-advice:before{color:#5C665A;content:"MY ADVICE";display:block;font:600 10px/1 "IBM Plex Mono",monospace;letter-spacing:.14em;margin-bottom:15px;}html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] p.bw-c-advice:after{background:#FFE600;content:"";height:4px;left:0;position:absolute;top:24px;width:37px;}',
      'html[data-bw-redesign="1"] [data-bw-redesign-content-shell="1"]{display:block!important;padding:60px 0 40px!important;}html[data-bw-redesign="1"] [data-bw-redesign-trim-top="1"]{padding-top:0!important;}html[data-bw-redesign="1"] .bw-c-page{box-sizing:border-box;margin:0 auto;min-width:0;}html[data-bw-redesign="1"] .bw-c-page>[data-bw-blog-post-body="1"]{min-width:0;width:100%!important;}html[data-bw-redesign="1"] .bw-c-rail{display:none;}html[data-bw-redesign="1"] .bw-c-mobile-toc{background:#FAFAF5;border-bottom:1px solid #DDE4D6;border-top:1px solid #DDE4D6;display:none;margin:0 0 20px;padding:9px 0;position:sticky;top:0;z-index:80;}html[data-bw-redesign="1"] .bw-c-mobile-toc-scroll{display:flex;gap:7px;overflow-x:auto;padding:0 16px;scrollbar-width:none;}html[data-bw-redesign="1"] .bw-c-mobile-toc a{background:#fff;border:1px solid #DDE4D6;border-radius:999px;color:#123D18;font:600 11px/1 "IBM Plex Mono",monospace;padding:9px 11px;text-decoration:none;white-space:nowrap;}html[data-bw-redesign="1"] .bw-c-mobile-toc .bw-c-rail-number{display:none!important;}',
      'html[data-bw-redesign="1"] [data-bw-redesign-native-share="1"],html[data-bw-redesign="1"] [data-hook="post-main-actions-desktop"],html[data-bw-redesign="1"] [data-hook="post-main-actions-mobile"]{display:none!important;}html[data-bw-redesign="1"] .bw-c-end{background:#102414;box-sizing:border-box;color:#FAFAF5;margin:54px 0 35px;position:relative;padding:52px max(24px,calc((100vw - 1040px)/2));width:100%;}html[data-bw-redesign="1"] .bw-c-end-inner{margin:0 auto;max-width:1040px;}html[data-bw-redesign="1"] .bw-c-end-kicker{color:#C5E1A5;font-size:10px;font-weight:600;letter-spacing:.13em;margin:0 0 12px;}html[data-bw-redesign="1"] .bw-c-end h2{color:#FAFAF5!important;font:600 clamp(32px,4vw,48px)/1.05 Fraunces,Merriweather,Georgia,serif!important;margin:0 0 13px!important;text-shadow:none!important;-webkit-text-stroke:0!important;}html[data-bw-redesign="1"] .bw-c-end-copy{color:#FAFAF5;font:16px/1.6 Merriweather,Georgia,serif;max-width:680px;}html[data-bw-redesign="1"] .bw-c-book{background:#FFE600;border-radius:999px;color:#123D18!important;display:inline-block;font:800 13px/1 Montserrat,Arial,sans-serif;margin:21px 0 30px;padding:14px 20px;text-decoration:none!important;}html[data-bw-redesign="1"] .bw-c-book:hover{background:#C5E1A5;color:#123D18!important;}html[data-bw-redesign="1"] .bw-c-related{display:grid;gap:15px;grid-template-columns:repeat(3,minmax(0,1fr));margin-top:23px;}html[data-bw-redesign="1"] .bw-c-related a{background:#FAFAF5;border-radius:12px;color:#212121;display:block;overflow:hidden;text-decoration:none;}html[data-bw-redesign="1"] .bw-c-related img{aspect-ratio:16/9;display:block;object-fit:cover;width:100%;}html[data-bw-redesign="1"] .bw-c-related-copy{padding:13px;}html[data-bw-redesign="1"] .bw-c-related-kicker{color:#1B5E20;font:600 10px/1 "IBM Plex Mono",monospace;letter-spacing:.1em;text-transform:uppercase;}html[data-bw-redesign="1"] .bw-c-related strong{display:block;font:800 16px/1.16 Montserrat,Arial,sans-serif;margin-top:8px;}html[data-bw-redesign="1"] .bw-c-share{display:flex;flex-wrap:wrap;gap:9px;margin-top:29px;}html[data-bw-redesign="1"] .bw-c-share a,html[data-bw-redesign="1"] .bw-c-share button{background:transparent;border:1px solid #C5E1A5;border-radius:999px;color:#FAFAF5;cursor:pointer;font:600 11px/1 "IBM Plex Mono",monospace;padding:10px 12px;text-decoration:none;}',
      '@media (min-width:1001px){html[data-bw-redesign="1"] .bw-c-page{display:grid;gap:72px;grid-template-columns:210px minmax(0,680px);justify-content:center;padding:0 28px;}html[data-bw-redesign="1"] .bw-c-page>[data-bw-blog-post-body="1"]{grid-column:2;max-width:680px;}html[data-bw-redesign="1"] .bw-c-rail{align-self:start;background:transparent;display:block;grid-column:1;grid-row:1;max-height:calc(100vh - 80px);overflow:auto;padding:0 0 4px;position:sticky;scrollbar-width:none;top:40px;width:auto;z-index:auto;}html[data-bw-redesign="1"] .bw-c-rail::-webkit-scrollbar{height:0;width:0;}html[data-bw-redesign="1"] .bw-c-rail-title{color:#5C665A;font:600 10px/1 "IBM Plex Mono",monospace;letter-spacing:.12em;margin:0 0 15px;}html[data-bw-redesign="1"] .bw-c-rail-list{border-left:1px solid #DDE4D6;list-style:none;margin:0;padding:0 0 0 10px;position:relative;}html[data-bw-redesign="1"] .bw-c-rail-list a{color:#5C665A;display:block;font:600 11px/1.3 "IBM Plex Mono",monospace;margin:0;padding:7px 0;text-decoration:none;}html[data-bw-redesign="1"] .bw-c-rail-list a[data-active="1"]{color:#212121;}html[data-bw-redesign="1"] .bw-c-rail-list a[data-active="1"]:before{background:#FFE600;content:"";height:100%;left:-11px;position:absolute;width:3px;}html[data-bw-redesign="1"] .bw-c-rail-number{color:#1B5E20;margin-right:7px;}html[data-bw-redesign="1"] .bw-c-rail-tour,html[data-bw-redesign="1"] .bw-c-rail-tool{box-sizing:border-box;border-radius:12px;width:100%;}html[data-bw-redesign="1"] .bw-c-rail-tour{background:#102414;color:#FAFAF5;margin-top:30px;padding:18px 18px 20px;}html[data-bw-redesign="1"] .bw-c-rail-tool{background:#fff;border:1px solid #DDE4D6;color:#212121;display:block;margin-top:14px;padding:14px 16px;text-decoration:none!important;}html[data-bw-redesign="1"] .bw-c-rail-label{color:#C5E1A5;display:block;font:600 9.5px/1 "IBM Plex Mono",monospace;letter-spacing:.16em;}html[data-bw-redesign="1"] .bw-c-rail-tool .bw-c-rail-label{color:#5C665A;}html[data-bw-redesign="1"] .bw-c-rail strong{display:block;font:800 14.5px/1.35 Montserrat,Arial,sans-serif;margin:10px 0 8px;}html[data-bw-redesign="1"] .bw-c-rail-tour small{color:#CBDCC2;display:block;font:500 10.5px/1.7 "IBM Plex Mono",monospace;}html[data-bw-redesign="1"] .bw-c-rail-tool strong{font-size:13.5px;line-height:1.3;margin:8px 0 7px;}html[data-bw-redesign="1"] .bw-c-rail-tool small{color:#1B5E20;display:block;font:700 11.5px/1.2 Montserrat,Arial,sans-serif;}html[data-bw-redesign="1"] .bw-c-rail .bw-c-book{display:block;font-size:11px;margin:13px 0 0;padding:11px 8px;text-align:center;}html[data-bw-redesign="1"] .bw-c-rail-all{color:#123D18;display:block;font:600 10px/1 "IBM Plex Mono",monospace;margin-top:16px;text-decoration:none;}}',
      '@media (max-width:1000px){html[data-bw-redesign="1"] .bw-c-mobile-toc{display:block;}}@media (max-width:899px){html[data-bw-redesign="1"] .bw-c-hero{padding:34px 16px 38px;}html[data-bw-redesign="1"] .bw-c-cover{height:340px;}html[data-bw-redesign="1"] .bw-c-cover-caption{bottom:0;right:0;}html[data-bw-redesign="1"] [data-bw-redesign-content-shell="1"]{padding:28px 0 32px!important;}html[data-bw-redesign="1"] .bw-c-related{grid-template-columns:1fr;}html[data-bw-redesign="1"] .bw-c-end{padding:0;}}',
      'html[data-bw-redesign="1"] .bw-c-byline{font-size:11px;gap:16px;letter-spacing:.12em;}html[data-bw-redesign="1"] .bw-c-byline img{border:2px solid rgba(255,230,0,.5);height:38px;width:38px;}html[data-bw-redesign="1"] .bw-c-hero h1{line-height:1.06!important;letter-spacing:-.015em!important;}html[data-bw-redesign="1"] .bw-c-dek{color:rgba(250,250,245,.85);font-size:19.5px;line-height:1.6;max-width:660px;margin-bottom:32px;}',
      '@media (min-width:1001px){html[data-bw-redesign="1"] [data-bw-redesign-body-gutter="1"]{padding-left:0!important;padding-right:0!important;}html[data-bw-redesign="1"] .bw-c-page>[data-bw-blog-post-body="1"]{width:680px!important;max-width:680px!important;}}',
      'html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] .bw-c-body-list,html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] .bw-c-body-list>li{list-style:none!important;}html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] .bw-c-body-list>li::marker{content:""!important;}html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] .bw-c-body-list{margin:0 0 24px!important;padding-left:0!important;}html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] .bw-c-body-list>li{font-size:17.5px;line-height:1.68;padding:8px 0 8px 26px!important;position:relative;}html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] ul.bw-c-body-list>li:before{background:#7CB342;border-radius:50%;content:"";height:9px;left:4px;position:absolute;top:18px;width:9px;}html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] .bw-c-body-list>li>p{margin:0!important;}html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] ol.bw-c-body-list{counter-reset:bwcstep;}html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] ol.bw-c-body-list>li{counter-increment:bwcstep;padding-left:40px!important;}html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] ol.bw-c-body-list>li:before{background:#123D18;border-radius:50%;color:#FFE600;content:counter(bwcstep);font:800 13px/26px Montserrat,Arial,sans-serif;height:26px;left:0;position:absolute;text-align:center;top:8px;width:26px;}',
      // The rail already carries the tour card on every post, so the site-wide
      // sticky booking pill is a duplicate here and covers the article.
      'html[data-bw-redesign="1"] #bw-desktop-cta{display:none!important;}',
      'html[data-bw-redesign="1"] .bw-c-date-card{background:#fff!important;border:1px solid #DDE4D6!important;border-radius:14px!important;display:block!important;margin:38px 0 42px!important;overflow:hidden!important;}html[data-bw-redesign="1"] .bw-c-date-card .bw-date-check-blog-card__visual{background:#102414!important;display:block!important;min-height:0!important;width:100%!important;}html[data-bw-redesign="1"] .bw-c-date-card .bw-date-check-blog-card__visual img{display:none!important;}html[data-bw-redesign="1"] .bw-c-date-card .bw-date-check-blog-card__scrim{background:#102414!important;display:block!important;padding:11px 18px!important;position:static!important;}html[data-bw-redesign="1"] .bw-c-date-card .bw-date-check-blog-card__eyebrow{color:#EAF2E6!important;font:600 11px/1 "IBM Plex Mono",monospace!important;letter-spacing:.16em!important;text-transform:uppercase!important;}html[data-bw-redesign="1"] .bw-c-date-card .bw-date-check-blog-card__eyebrow:before{background:#FFE600;border-radius:50%;content:"";display:inline-block;height:8px;margin-right:10px;width:8px;}html[data-bw-redesign="1"] .bw-c-date-card .bw-date-check-blog-card__scrim>.bw-date-check-blog-card__title,html[data-bw-redesign="1"] .bw-c-date-card .bw-date-check-blog-card__scrim>.bw-date-check-blog-card__copy,html[data-bw-redesign="1"] .bw-c-date-card .bw-date-check-blog-card__proof{display:none!important;}html[data-bw-redesign="1"] .bw-c-date-card .bw-date-check-blog-card__form{display:block!important;padding:28px 28px 30px!important;width:100%!important;}html[data-bw-redesign="1"] .bw-c-date-card .bw-c-date-intro h2.bw-date-check-blog-card__title{color:#212121!important;font:900 22px/1.25 Montserrat,Arial,sans-serif!important;margin:0 0 6px!important;padding:0!important;}html[data-bw-redesign="1"] .bw-c-date-intro h2:before,html[data-bw-redesign="1"] .bw-c-date-intro h2:after{display:none!important;}html[data-bw-redesign="1"] .bw-c-date-intro p{color:#5C665A!important;font:400 14.5px/1.6 Merriweather,Georgia,serif!important;margin:0 0 18px!important;}html[data-bw-redesign="1"] .bw-c-date-card .bw-date-check-blog-card__fields{display:flex!important;gap:12px!important;margin-bottom:14px!important;}html[data-bw-redesign="1"] .bw-c-date-card .bw-date-check-blog-card__field{flex:1!important;min-width:0!important;}html[data-bw-redesign="1"] .bw-c-date-card .bw-date-check-blog-card__submit{background:#FFE600!important;border-radius:999px!important;color:#123D18!important;font:800 14px/1 Montserrat,Arial,sans-serif!important;height:auto!important;min-height:0!important;padding:13px 26px!important;width:auto!important;}html[data-bw-redesign="1"] .bw-c-date-card a.bw-date-check-blog-card__submit{align-items:center!important;display:inline-flex!important;gap:10px!important;text-decoration:none!important;}html[data-bw-redesign="1"] .bw-c-date-card .bw-date-check-blog-card__micro{display:none!important;}',
      'html[data-bw-redesign="1"] [data-bw-blog-post-body="1"] .bw-c-advice-highlight{background:linear-gradient(transparent 58%,rgba(255,230,0,.82) 58%,rgba(255,230,0,.82) 91%,transparent 91%);box-decoration-break:clone;-webkit-box-decoration-break:clone;}',
      'html[data-bw-redesign="1"] .bw-c-rail-list{border-left:0;padding-left:0;}html[data-bw-redesign="1"] .bw-c-rail-progress{background:#DDE4D6;bottom:8px;left:-18px;position:absolute;top:34px;width:1px;}html[data-bw-redesign="1"] .bw-c-rail-progress i{background:#1B5E20;border-radius:2px;display:block;height:0;margin-left:-1px;transition:height .16s linear;width:3px;}html[data-bw-redesign="1"] .bw-c-rail-list a{display:flex;gap:12px;padding:6px 0;}html[data-bw-redesign="1"] .bw-c-rail-list a[data-active="1"] .bw-c-rail-text{background:linear-gradient(transparent 62%,rgba(255,230,0,.55) 62%);}html[data-bw-redesign="1"] .bw-c-rail-list a[data-active="1"]:before{display:none;}html[data-bw-redesign="1"] .bw-c-rail-number{flex:0 0 auto;margin-right:0;}html[data-bw-redesign="1"] .bw-c-rail-tour strong{font-size:14.5px;line-height:1.35;}html[data-bw-redesign="1"] .bw-c-rail-schedule{margin-top:0;}html[data-bw-redesign="1"] .bw-c-rail-rating{margin-top:2px;}',
      'html[data-bw-redesign="1"] .bw-c-end{background:#FAFAF5;color:#212121;margin:20px 0 0;padding:0;}html[data-bw-redesign="1"] .bw-c-tourband{background-color:#102414;background-image:linear-gradient(rgba(250,250,245,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(250,250,245,.05) 1px,transparent 1px);background-size:34px 34px;color:#FAFAF5;padding:0;}html[data-bw-redesign="1"] .bw-c-tourband-inner{display:grid;grid-template-columns:minmax(320px,44%) minmax(0,1fr);margin:0 auto;max-width:1120px;min-height:430px;}html[data-bw-redesign="1"] .bw-c-tourband-photo{margin:0;min-height:430px;overflow:hidden;}html[data-bw-redesign="1"] .bw-c-tourband-photo img{display:block;height:100%;object-fit:cover;object-position:54% center;width:100%;}html[data-bw-redesign="1"] .bw-c-tourband-copy{align-self:center;padding:54px clamp(34px,5vw,70px);text-align:left;}html[data-bw-redesign="1"] .bw-c-end .bw-c-tourband h2{color:#FAFAF5!important;font:600 clamp(34px,4vw,46px)/1.1 Fraunces,Merriweather,Georgia,serif!important;margin:0 0 18px!important;max-width:620px;}html[data-bw-redesign="1"] .bw-c-tourband-sub{color:rgba(250,250,245,.72);font:500 13px/1.8 "IBM Plex Mono",monospace;text-transform:uppercase;}html[data-bw-redesign="1"] .bw-c-tourband-div{border-top:2px dashed #FFE600;margin:26px 0 0;width:120px;}html[data-bw-redesign="1"] .bw-c-tourband .bw-c-book{margin:28px 0 0;padding:16px 34px;}html[data-bw-redesign="1"] .bw-c-bottom{box-sizing:border-box;margin:0 auto;max-width:1016px;padding:56px 28px 72px;}html[data-bw-redesign="1"] .bw-c-section-label{align-items:center;color:#5C665A;display:flex;font:600 11px/1 "IBM Plex Mono",monospace;gap:14px;letter-spacing:.22em;margin:0 0 24px;text-transform:uppercase;}html[data-bw-redesign="1"] .bw-c-section-label:after{background:#DDE4D6;content:"";flex:1;height:1px;}html[data-bw-redesign="1"] .bw-c-related{gap:18px;margin:0 0 52px;}html[data-bw-redesign="1"] .bw-c-related a{border:1px solid #E4E9DF;border-radius:14px;}html[data-bw-redesign="1"] .bw-c-related img{height:130px;}html[data-bw-redesign="1"] .bw-c-related-copy{padding:14px 16px 18px;}html[data-bw-redesign="1"] .bw-c-faq-slot{margin-bottom:8px;}html[data-bw-redesign="1"] .bw-c-faq-slot [data-hook="html-component"],html[data-bw-redesign="1"] .bw-c-faq-slot iframe{display:block!important;margin:0!important;max-width:none!important;width:100%!important;}html[data-bw-redesign="1"] .bw-c-share{align-items:center;gap:12px;margin-top:44px;}html[data-bw-redesign="1"] .bw-c-share .bw-c-share-label{color:#5C665A;font:600 10.5px/1 "IBM Plex Mono",monospace;letter-spacing:.2em;margin-right:8px;}html[data-bw-redesign="1"] .bw-c-share a,html[data-bw-redesign="1"] .bw-c-share button{background:#fff;border:1.5px solid #DDE4D6;color:#123D18;font:700 12.5px/1 Montserrat,Arial,sans-serif;padding:10px 18px;}',
      '@media (min-width:1001px) and (max-width:1239px){html[data-bw-redesign="1"] .bw-c-page{display:block!important;padding:0!important;}html[data-bw-redesign="1"] .bw-c-rail{display:none!important;}html[data-bw-redesign="1"] .bw-c-mobile-toc{display:block!important;}}@media (max-width:1000px){html[data-bw-redesign="1"] .bw-c-date-card .bw-date-check-blog-card__fields{display:grid!important;grid-template-columns:1fr 1fr!important;}html[data-bw-redesign="1"] .bw-c-bottom{padding:40px 16px 56px;}html[data-bw-redesign="1"] .bw-c-tourband-inner{grid-template-columns:minmax(260px,42%) minmax(0,1fr);}html[data-bw-redesign="1"] .bw-c-tourband-copy{padding:44px 32px;}}@media (max-width:700px){html[data-bw-redesign="1"] .bw-c-tourband-inner{display:block;min-height:0;}html[data-bw-redesign="1"] .bw-c-tourband-photo{height:250px;min-height:0;}html[data-bw-redesign="1"] .bw-c-tourband-photo img{object-position:54% 42%;}html[data-bw-redesign="1"] .bw-c-tourband-copy{padding:38px 22px 44px;}html[data-bw-redesign="1"] .bw-c-end .bw-c-tourband h2{font-size:36px!important;}}@media (max-width:520px){html[data-bw-redesign="1"] .bw-c-date-card .bw-date-check-blog-card__form{padding:22px 18px 24px!important;}html[data-bw-redesign="1"] .bw-c-date-card .bw-date-check-blog-card__fields{grid-template-columns:1fr!important;}html[data-bw-redesign="1"] .bw-c-date-card .bw-date-check-blog-card__submit{width:100%!important;}html[data-bw-redesign="1"] .bw-c-related{grid-template-columns:1fr!important;}}'
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

  function hero(title, post, body) {
    var old = document.querySelector('.bw-c-hero');
    if (old) {
      var existingEyebrow = old.querySelector('.bw-c-eyebrow');
      if (existingEyebrow && post) existingEyebrow.innerHTML = '<a href="/blog/categories/' + escapeHtml(post.categorySlug || '') + '">' + escapeHtml(post.category || 'Berlin guide') + '</a>' + (post.readTime ? ' · ' + escapeHtml(post.readTime) : '');
      highlightHeroTitle(old.querySelector('h1'), post);
      var currentStage = stageFor(body); if (currentStage && old.parentElement !== currentStage) currentStage.appendChild(old);
      return old;
    }
    var header = title.closest('header') || title.parentElement;
    if (!header || !header.parentElement) return null;
    var category = post && post.category || 'Berlin guide'; var read = post && post.readTime || ((text(header.textContent).match(/\b\d+\s+min\s+read\b/i) || [])[0] || '');
    var wrapper = document.createElement('section'); wrapper.className = 'bw-c-hero'; wrapper.setAttribute(MARK, 'hero');
    wrapper.innerHTML = '<div class="bw-c-hero-inner"><p class="bw-c-eyebrow"><a href="/blog/categories/' + escapeHtml(post && post.categorySlug || '') + '">' + escapeHtml(category) + '</a>' + (read ? ' · ' + escapeHtml(read) : '') + '</p><div data-bw-c-title-slot></div>' + (meta('og:description') ? '<p class="bw-c-dek">' + escapeHtml(meta('og:description')) + '</p>' : '') + '<div class="bw-c-byline"><img alt="Yusuf Ucuz" src="' + PORTRAIT_URL + '"><span>BY YUSUF UCUZ · BERLIN WALKING TOUR GUIDE</span></div></div>';
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

  function cover(heroNode, post) {
    var old = document.querySelector('.bw-c-cover');
    var image = meta('og:image') || post && post.image;
    var source = image ? safeUrl(image) : '';
    // Re-creating the cover on every hydration render re-decodes the LCP image
    // and feeds this script's own mutation observer. Keep a correct one.
    if (old && old.isConnected && heroNode && old.previousElementSibling === heroNode) {
      var currentImage = old.querySelector('img');
      if (currentImage && source && currentImage.getAttribute('src') === source) return;
    }
    if (old) old.remove();
    if (!image || !heroNode) return;
    var alt = meta('og:image:alt') || post && post.alt || ''; var node = document.createElement('figure'); node.className = 'bw-c-cover'; node.setAttribute(MARK, 'cover');
    node.innerHTML = '<img src="' + escapeHtml(safeUrl(image)) + '" alt="' + escapeHtml(alt) + '" fetchpriority="high">' + (alt ? '<figcaption class="bw-c-cover-caption">' + escapeHtml(alt) + '</figcaption>' : ''); heroNode.after(node); if (!heroNode.closest('.bw-c-stage')) { balanceBleed(heroNode); balanceBleed(node); }
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
    var first = Array.prototype.find.call(body.querySelectorAll('p'), function (p) { return text(p.textContent).length > 35 && !p.closest('iframe,[data-bw-leadform]'); });
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

  function nextTourLabel() {
    try {
      if (typeof window.bwNextTourStartsLabel === 'function') return text(window.bwNextTourStartsLabel({ count: 2, compact: false }));
    } catch (error) {}
    var publishedSchedule = text(document.body && document.body.innerText).match(/\bTue(?:\s*[-–]\s*Sat)?\s+11:30\s*(?:&|\+)\s*15:30\b/i);
    if (publishedSchedule) return publishedSchedule[0].replace(/\s*[-–]\s*/g, '–').replace(/\s*\+\s*/g, ' & ');
    return '';
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

  function toc(items, body, post, tool) {
    var page = pageFor(body); if (!page) return;
    var links = items.map(function (item) { return '<a href="#' + item.id + '"><span class="bw-c-rail-number">' + item.number + '</span><span class="bw-c-rail-text">' + escapeHtml(shortTocTitle(item.title)) + '</span></a>'; }).join('');
    var schedule = nextTourLabel();
    var signature = links + '||' + (tool && tool.slug || '') + '||' + schedule;
    var currentRail = page.querySelector(':scope > .bw-c-rail');
    var currentMobile = document.querySelector('.bw-c-mobile-toc');
    // Renders run on every Wix mutation for the first 31s. Tearing the rail and
    // the mobile TOC down each time is churn that re-triggers this script's own
    // observer, so rebuild only when the links, tool or schedule changed.
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
    rail.innerHTML = '<span class="bw-c-rail-progress" aria-hidden="true"><i></i></span><p class="bw-c-rail-title">ON THIS PAGE</p><nav class="bw-c-rail-list">' + links + '</nav><div class="bw-c-rail-tour"><span class="bw-c-rail-label">FREE WALKING TOUR</span><strong>See the centre with me in 2 hours</strong>' + (schedule ? '<small class="bw-c-rail-schedule" data-bw-c-schedule>' + escapeHtml(schedule) + '</small>' : '') + '<small class="bw-c-rail-rating">★ 9.8/10 · FREE, TIP-BASED</small><a class="bw-c-book" href="' + BOOKING_URL + '">Reserve a spot</a></div>' + (tool ? '<a class="bw-c-rail-tool" href="/tools/' + escapeHtml(tool.slug) + '"><span class="bw-c-rail-label">ARTICLE TOOL</span><strong>' + escapeHtml(tool.title) + '</strong><small>Open the tool →</small></a>' : '') + '<a class="bw-c-rail-all" href="/blog">← ALL GUIDES</a>';
    page.insertBefore(rail, page.firstChild);
    rail.addEventListener('click', function (event) { var link = event.target.closest('a[href^="#"]'); if (!link) return; event.preventDefault(); var target = document.getElementById(link.getAttribute('href').slice(1)); if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
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
  function endModule(body, post) {
    var old = document.querySelector('[data-bw-redesign-end]');
    var faqFrame = Array.prototype.find.call(document.querySelectorAll('iframe[src*="/faq/"]'), function (candidate) { return candidate.isConnected; });
    var faqHost = faqFrame && (faqFrame.closest('[data-hook="html-component"]') || faqFrame.parentElement);
    var anchor = body.closest('.bw-c-page') || body;
    var currentSlot = old && old.querySelector('.bw-c-faq-slot');
    // Moving an iframe in the DOM reloads it. This module used to be torn down
    // and rebuilt on every hydration render, which reloaded the FAQ iframe
    // roughly a hundred times in the first 31s and left its height swinging
    // between the empty shell and the loaded content the whole time. A module
    // that is already in the right place and already owns the FAQ host is done.
    if (old && old.isConnected && anchor.nextElementSibling === old && (!faqHost || faqHost.parentElement === currentSlot)) {
      unlockEndHeights(old);
      return;
    }
    var faqFragment = document.createDocumentFragment();
    if (faqHost) faqFragment.appendChild(faqHost);
    Array.prototype.forEach.call(body.querySelectorAll('[id^="viewer-faq_"]'), function (placeholder) {
      if (!placeholder.querySelector('iframe[src*="/faq/"]')) placeholder.remove();
    });
    if (old) old.remove();
    var node = document.createElement('section'); node.className = 'bw-c-end'; node.setAttribute('data-bw-redesign-end', '1');
    var cards = post ? related(post).map(function (item) { return '<a href="' + escapeHtml(item.path || '/post/' + item.slug) + '">' + (item.thumb || item.image ? '<img src="' + escapeHtml(item.thumb || item.image) + '" alt="' + escapeHtml(item.alt || '') + '">' : '') + '<div class="bw-c-related-copy"><span class="bw-c-related-kicker">' + escapeHtml(item.category || 'Guide') + '</span><strong>' + escapeHtml(item.title) + '</strong></div></a>'; }).join('') : '';
    var shareUrl = encodeURIComponent(location.href.split('#')[0]), title = encodeURIComponent(document.title);
    var schedule = nextTourLabel();
    var bandSub = 'FREE, TIP-BASED · ABOUT 2 HOURS' + (schedule ? ' · ' + schedule.toUpperCase() : '') + '<br>STARTS AT THE WORLD CLOCK · ENDS AT HACKESCHER MARKT';
    node.innerHTML = '<div class="bw-c-tourband"><div class="bw-c-tourband-inner"><figure class="bw-c-tourband-photo"><img src="' + TOUR_BAND_IMAGE + '" alt="Yusuf guiding in front of Berlin’s Rotes Rathaus" loading="lazy" decoding="async"></figure><div class="bw-c-tourband-copy"><p class="bw-c-end-kicker">FREE BERLIN WALKING TOUR · ★ 9.8/10 ON FREETOUR</p><h2>See Berlin’s historic centre with me.</h2><p class="bw-c-tourband-sub">' + bandSub + '</p><div class="bw-c-tourband-div"></div><a class="bw-c-book" href="' + BOOKING_URL + '">Reserve a spot · free</a></div></div></div><div class="bw-c-bottom">' + (cards ? '<p class="bw-c-section-label">RELATED GUIDES</p><div class="bw-c-related">' + cards + '</div>' : '') + (faqHost ? '<p class="bw-c-section-label">QUESTIONS PEOPLE ACTUALLY ASK</p><div class="bw-c-faq-slot"></div>' : '') + '<div class="bw-c-share"><span class="bw-c-share-label">SHARE THIS GUIDE</span><a target="_blank" rel="noopener" href="https://wa.me/?text=' + shareUrl + '">WhatsApp</a><a target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=' + shareUrl + '">Facebook</a><a target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?url=' + shareUrl + '&text=' + title + '">X</a><button type="button" data-bw-c-copy>Copy link</button></div></div>';
    node.addEventListener('click', function (event) { if (!event.target.matches('[data-bw-c-copy]')) return; navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(location.href.split('#')[0]) : null; event.target.textContent = 'Copied'; setTimeout(function () { event.target.textContent = 'Copy link'; }, 1200); }); var pageNode = body.closest('.bw-c-page'); (pageNode || body).after(node); fitStage(node);
    var faqSlot = node.querySelector('.bw-c-faq-slot');
    if (faqSlot && faqHost) faqSlot.appendChild(faqFragment);
    unlockEndHeights(node);
  }

  function paint() {
    document.documentElement.setAttribute('data-bw-redesign', '1'); injectStyle(); var body = findBody(), title = findTitle(); if (!body || !title) return;
    markBody(body); var post = postMeta(), heroNode = hero(title, post, body); cover(heroNode, post); var items = headings(body); toc(items, body, post, toolFor(post)); fitInlineSurfaces(body); keepQuickSummaryInBody(); retagFaq(); hideNativeShare(); endModule(body, post);
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
      if (watching) requestAnimationFrame(function () {
        if (state.observer && Date.now() < state.until) state.observer.observe(document.documentElement, { childList: true, subtree: true });
      });
    }
  }
  function schedule(delay) { clearTimeout(state.timer); state.timer = setTimeout(render, delay || 0); }
  function boot() {
    if (!enabled() || !postPage()) return;
    state.until = Date.now() + 31000; loadData(); [0, 160, 650, 1600, 4000, 9000, 16000, 30000].forEach(function (delay) { setTimeout(render, delay); });
    if (state.observer) state.observer.disconnect();
    // A hydration pass that removes the hero must be repaired in the same
    // mutation microtask, before the browser paints. The trailing debounce
    // alone is not enough: every mutation in the burst resets the 120ms timer,
    // which held the old layout on screen for 571ms in live measurement.
    state.observer = new MutationObserver(function () {
      if (Date.now() >= state.until) return;
      if (!state.rendering && !document.querySelector('.bw-c-hero')) render();
      schedule(120);
    });
    state.observer.observe(document.documentElement, { childList: true, subtree: true });
  }
  boot();
})();
