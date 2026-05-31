/* blog-journey-inject.js - polishes Wix Blog post reading flow, adds mobile
 * guide chips, a topic-aware inline tool prompt, and a next-step module.
 * Loaded site-wide via Wix Custom Code.
 */
(function () {
  var DATA_URL = window.BW_BLOG_DATA_URL || 'https://fenerszymanski.github.io/berlinwalk-widgets/blog-index/data.json';
  var TOOLS_DATA_URL = window.BW_TOOLS_DATA_URL || 'https://fenerszymanski.github.io/berlinwalk-widgets/tools-hub/data.json';
  var STYLE_ID = 'bw-blog-journey-style';
  var POST_BODY_MARKER = 'data-bw-blog-post-body';
  var MOBILE_NAV_MARKER = 'data-bw-blog-mobile-nav';
  var MOBILE_MARKER = 'data-bw-blog-mobile-guide';
  var TOOL_MARKER = 'data-bw-blog-tool-prompt';
  var JOURNEY_MARKER = 'data-bw-blog-journey';
  var BACK_TOP_MARKER = 'data-bw-blog-back-top';
  var EMPTY_PARAGRAPH_MARKER = 'data-bw-empty-paragraph';
  var NATIVE_END_MARKER = 'data-bw-native-blog-end-hidden';
  var MIN_MOBILE_WIDTH = 900;
  var TOUR_IMAGE = 'https://static.wixstatic.com/media/5a08a3_ac78d5df37b2486ab6662cf3872ea9a6~mv2.jpg/v1/fill/w_700,h_420,al_c,q_86,enc_avif,quality_auto/file.jpg';
  var TOOL_ICON_BASE_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/tools-home/icons/';
  var dataCache = null;
  var dataPromise = null;
  var renderTimer = null;
  var observer = null;
  var lastPath = location.pathname;
  var backTopScrollHandler = null;

  var BLOG_CATEGORIES = [
    { slug: 'tourist-tips', label: 'Tourist Tips', url: 'https://www.berlinwalk.com/blog/categories/tourist-tips' },
    { slug: 'tour-route', label: 'Tour Route', url: 'https://www.berlinwalk.com/blog/categories/tour-route' },
    { slug: 'berlin-history', label: 'History', url: 'https://www.berlinwalk.com/blog/categories/berlin-history' },
    { slug: 'berlin-myths', label: 'Berlin Myths', url: 'https://www.berlinwalk.com/blog/categories/berlin-myths' },
    { slug: 'before-after', label: 'Before & After', url: 'https://www.berlinwalk.com/blog/categories/before-after' },
    { slug: 'german-language', label: 'German Language', url: 'https://www.berlinwalk.com/blog/categories/german-language' }
  ];

  var TOOL_FALLBACKS = {
    'berlin-first-day-planner': {
      title: 'Berlin First-Day Planner',
      url: 'https://www.berlinwalk.com/tools/berlin-first-day-planner',
      summary: 'Turn arrival time, luggage, weather, and energy into a realistic first-day plan.'
    },
    'berlin-public-toilets': {
      title: 'Berlin Public Toilet Finder',
      url: 'https://www.berlinwalk.com/tools/berlin-public-toilets',
      summary: 'Find official toilets, free options, and accessible locations around Berlin.'
    },
    'berlin-luggage-storage': {
      title: 'Berlin Luggage Storage Map',
      url: 'https://www.berlinwalk.com/tools/berlin-luggage-storage',
      summary: 'Find lockers, station storage, airport options, and app pickup points.'
    },
    'transport-ticket-calculator': {
      title: 'Berlin Transport Ticket Calculator',
      url: 'https://www.berlinwalk.com/tools/transport-ticket-calculator',
      summary: 'Pick the right ticket for the journeys you actually plan to take.'
    },
    'best-month-to-visit-berlin': {
      title: 'Best Month to Visit Berlin',
      url: 'https://www.berlinwalk.com/tools/best-month-to-visit-berlin',
      summary: 'Compare months by weather, light, crowds, and walking comfort.'
    },
    'berlin-daily-budget': {
      title: 'Berlin Daily Budget Calculator',
      url: 'https://www.berlinwalk.com/tools/berlin-daily-budget',
      summary: 'Estimate your daily Berlin costs without generic Europe averages.'
    },
    'berlin-free-things-to-do': {
      title: 'Free Things to Do in Berlin',
      url: 'https://www.berlinwalk.com/tools/berlin-free-things-to-do',
      summary: 'Map genuinely free attractions, viewpoints, museums, and walks.'
    },
    'berlin-safety': {
      title: 'Berlin Safety Map',
      url: 'https://www.berlinwalk.com/tools/berlin-safety',
      summary: 'Check practical safety notes by neighborhood and traveler type.'
    },
    'east-or-west-1989': {
      title: 'East or West Berlin in 1989?',
      url: 'https://www.berlinwalk.com/tools/east-or-west-1989',
      summary: 'Pick a landmark and see which side of the Wall it was on.'
    },
    'berlin-currywurst-finder': {
      title: 'Berlin Currywurst Finder',
      url: 'https://www.berlinwalk.com/tools/berlin-currywurst-finder',
      summary: 'Find the currywurst stand that fits your route, appetite, and timing.'
    },
    'berlin-club-picker': {
      title: 'Berlin Club Picker',
      url: 'https://www.berlinwalk.com/tools/berlin-club-picker',
      summary: 'Match your night, outfit, group, and door-difficulty comfort.'
    }
  };

  var TOOL_ICON_FALLBACKS = {
    'berlin-first-day-planner': TOOL_ICON_BASE_URL + 'berlin-first-day-planner-160.png',
    'berlin-public-toilets': TOOL_ICON_BASE_URL + 'berlin-public-toilets-160.png',
    'berlin-luggage-storage': TOOL_ICON_BASE_URL + 'berlin-luggage-storage-160.png',
    'transport-ticket-calculator': TOOL_ICON_BASE_URL + 'transport-ticket-calculator-160.png',
    'best-month-to-visit-berlin': TOOL_ICON_BASE_URL + 'best-month-to-visit-berlin-160.png',
    'berlin-daily-budget': TOOL_ICON_BASE_URL + 'berlin-daily-budget-160.png',
    'berlin-free-things-to-do': TOOL_ICON_BASE_URL + 'berlin-free-things-to-do-160.png',
    'berlin-safety': TOOL_ICON_BASE_URL + 'berlin-safety-160.png',
    'east-or-west-1989': TOOL_ICON_BASE_URL + 'east-or-west-1989-160.png',
    'berlin-currywurst-finder': TOOL_ICON_BASE_URL + 'berlin-currywurst-finder-160.png',
    'berlin-club-picker': TOOL_ICON_BASE_URL + 'berlin-club-picker-160.png'
  };

  function isPostPage() {
    return location.pathname.indexOf('/post/') === 0;
  }

  function currentSlug() {
    return location.pathname.split('/').filter(Boolean).pop() || '';
  }

  function cleanText(text) {
    return String(text || '').replace(/\s+/g, ' ').trim();
  }

  function escapeHtml(text) {
    return String(text || '').replace(/[&<>"']/g, function (ch) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
    });
  }

  function escapeAttr(text) {
    return escapeHtml(text).replace(/`/g, '&#96;');
  }

  function isVisible(el) {
    while (el && el !== document.body && el.nodeType === 1) {
      var style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
      el = el.parentElement;
    }
    return true;
  }

  function findPostBody() {
    var selectors = [
      '[data-hook="post-content"]',
      '[data-hook="rich-content-viewer"]',
      '[data-hook="rich-content"]',
      '.post-content',
      '.rich-content',
      '.blog-post-page-content',
      'article',
      'main'
    ];
    for (var i = 0; i < selectors.length; i++) {
      var el = document.querySelector(selectors[i]);
      if (el && el.querySelectorAll('p').length >= 3) return el;
    }
    return null;
  }

  function slugify(text) {
    return cleanText(text)
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 64) || 'section';
  }

  function escapeSelector(value) {
    if (window.CSS && window.CSS.escape) return window.CSS.escape(value);
    return String(value).replace(/[^a-zA-Z0-9_-]/g, '\\$&');
  }

  function collectHeadings(body) {
    var raw = body ? body.querySelectorAll('h2, h3') : [];
    var used = {};
    var items = [];
    for (var i = 0; i < raw.length && items.length < 7; i++) {
      var heading = raw[i];
      var text = cleanText(heading.textContent);
      if (!text || text.length < 3) continue;
      if (/^(share|related posts?|recent posts?|comments?|leave a reply)$/i.test(text)) continue;
      if (heading.closest('[' + MOBILE_NAV_MARKER + '], [' + MOBILE_MARKER + '], [' + TOOL_MARKER + '], [' + JOURNEY_MARKER + '], [data-bw-leadform], [data-bw-tourcta]')) continue;
      if (!isVisible(heading)) continue;
      var base = slugify(text);
      var id = heading.id || 'bw-guide-' + base;
      var suffix = 2;
      while (used[id] || document.querySelectorAll('#' + escapeSelector(id)).length > (heading.id ? 1 : 0)) {
        id = 'bw-guide-' + base + '-' + suffix;
        suffix++;
      }
      used[id] = true;
      heading.id = id;
      items.push({ id: id, text: text, level: heading.tagName.toLowerCase(), node: heading });
    }
    return items;
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"]{color:#212121;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] [' + EMPTY_PARAGRAPH_MARKER + '="1"]{display:none!important;height:0!important;line-height:0!important;margin:0!important;min-height:0!important;padding:0!important;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] p:not(.bw-blog-mobile-guide-title):not(.bw-blog-journey-intro):not(.bw-blog-tool-copy):not([' + EMPTY_PARAGRAPH_MARKER + ']){font-family:Merriweather,Georgia,serif!important;font-size:18px!important;line-height:1.74!important;margin:0 0 18px!important;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] h2,body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] h3{font-family:Montserrat,Arial,sans-serif!important;font-weight:900!important;letter-spacing:0!important;color:#212121!important;scroll-margin-top:96px;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] h2{border-top:2px solid #212121;font-size:clamp(28px,4vw,38px)!important;line-height:1.06!important;margin:42px 0 14px!important;padding-top:24px!important;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] h3{font-size:clamp(21px,3vw,26px)!important;line-height:1.12!important;margin:30px 0 10px!important;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] a:not(.bw-blog-mobile-nav-home):not(.bw-blog-mobile-nav-item):not(.bw-blog-mobile-guide-list a):not(.bw-blog-tool-button):not(.bw-blog-journey-card){color:#1B5E20!important;text-decoration-color:#FFE600!important;text-decoration-thickness:3px!important;text-underline-offset:3px!important;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] img{max-width:100%;}',
      'body.bw-blog-post-enhanced [data-bw-leadform]{margin:38px 0!important;}',
      '.bw-blog-mobile-nav,.bw-blog-mobile-guide,.bw-blog-tool-prompt,.bw-blog-journey,.bw-blog-back-top{box-sizing:border-box;font-family:Montserrat,Arial,sans-serif;color:#212121;}',
      '.bw-blog-mobile-nav *,.bw-blog-mobile-guide *,.bw-blog-tool-prompt *,.bw-blog-journey *{box-sizing:border-box;}',
      '.bw-blog-mobile-nav{display:none;}',
      '.bw-blog-mobile-nav-home{align-items:center;background:#1B5E20;border:1px solid #1B5E20;border-radius:4px;color:#FFFFFF!important;display:inline-flex;font-size:12px;font-weight:900;line-height:1;min-height:34px;padding:0 14px;text-decoration:none!important;white-space:nowrap;}',
      '.bw-blog-mobile-nav-label{color:#1B5E20;display:block;font-size:10px;font-weight:900;letter-spacing:1.35px;line-height:1;margin:13px 0 9px;text-transform:uppercase;}',
      '.bw-blog-mobile-nav-list{display:flex;gap:8px;list-style:none;margin:0;overflow-x:auto;padding:0 0 4px;scrollbar-width:none;}',
      '.bw-blog-mobile-nav-list::-webkit-scrollbar{display:none;}',
      '.bw-blog-mobile-nav-list a{align-items:center;background:#FFFFFF;border:1px solid #D7D7CF;border-radius:4px;color:#1B5E20!important;display:inline-flex;font-size:12px;font-weight:900;line-height:1;min-height:33px;padding:0 11px;text-decoration:none!important;white-space:nowrap;}',
      '.bw-blog-mobile-nav-list a.bw-blog-mobile-nav-active{background:#FFE600;border-color:#FFE600;color:#212121!important;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] .bw-blog-mobile-nav a{text-decoration:none!important;text-decoration-color:transparent!important;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] .bw-blog-mobile-nav .bw-blog-mobile-nav-home{color:#FFFFFF!important;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] .bw-blog-mobile-nav-list a{color:#212121!important;}',
      '.bw-blog-mobile-guide{background:#FAFAF5;border-top:2px solid #212121;border-bottom:2px solid #212121;margin:18px 0 24px;padding:16px 0 14px;}',
      '.bw-blog-mobile-guide-title{color:#1B5E20;font-size:11px;font-weight:900;letter-spacing:1.5px;line-height:1;margin:0 0 12px;text-transform:uppercase;}',
      '.bw-blog-mobile-guide-list{display:flex;gap:8px;list-style:none;margin:0;overflow-x:auto;padding:1px 0 6px;scrollbar-width:none;}',
      '.bw-blog-mobile-guide-list::-webkit-scrollbar{display:none;}',
      '.bw-blog-mobile-guide-list a{background:#FFFFFF;border:1px solid #212121;border-radius:0;color:#212121;display:inline-flex;font-size:12px;font-weight:900;line-height:1.15;min-height:36px;padding:0 12px;align-items:center;text-decoration:none;white-space:nowrap;}',
      '.bw-blog-mobile-nav a:focus-visible,.bw-blog-mobile-guide-list a:focus-visible,.bw-blog-tool-prompt a:focus-visible,.bw-blog-journey a:focus-visible,.bw-blog-back-top:focus-visible{outline:3px solid rgba(255,230,0,.9);outline-offset:3px;}',
      '.bw-blog-tool-prompt{align-items:center;background:#FAFAF5;border:2px solid #212121;display:grid;gap:20px;grid-template-columns:minmax(0,1fr) auto;margin:34px 0;padding:22px;}',
      '.bw-blog-tool-kicker,.bw-blog-journey-kicker{color:#1B5E20;display:block;font-size:11px;font-weight:900;letter-spacing:1.5px;line-height:1;margin:0 0 10px;text-transform:uppercase;}',
      '.bw-blog-tool-prompt strong{color:#212121;display:block;font-size:24px;font-weight:900;line-height:1.08;margin:0 0 7px;}',
      '.bw-blog-tool-copy{color:#4E5A4E!important;display:block;font-family:Merriweather,Georgia,serif!important;font-size:15px!important;line-height:1.48!important;margin:0!important;}',
      '.bw-blog-tool-button{align-items:center;background:#FFE600;border:1px solid #212121;color:#212121;display:inline-flex;font-size:12px;font-weight:900;justify-content:center;letter-spacing:.8px;min-height:42px;padding:0 15px;text-decoration:none;text-transform:uppercase;white-space:nowrap;}',
      '.bw-blog-journey{background:#111111;color:#FFFFFF;margin:42px 0 34px;padding:28px;position:relative;overflow:hidden;}',
      '.bw-blog-journey:before{background:linear-gradient(90deg,#FFE600,#7CB342);content:"";display:block;height:5px;left:0;position:absolute;top:0;width:100%;}',
      '.bw-blog-journey-kicker{color:#FFE600;}',
      '.bw-blog-journey h2{color:#FFFFFF!important;font-size:clamp(27px,4vw,36px)!important;font-weight:900!important;letter-spacing:0!important;line-height:1.06!important;margin:0 0 8px!important;padding:0!important;border:0!important;}',
      '.bw-blog-journey-intro{color:rgba(255,255,255,.86);font-family:Merriweather,Georgia,serif;font-size:15px;line-height:1.58;margin:0 0 22px;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] .bw-blog-journey h2{border:0!important;color:#FFFFFF!important;font-size:clamp(27px,4vw,36px)!important;line-height:1.06!important;margin:0 0 8px!important;padding:0!important;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] .bw-blog-journey .bw-blog-journey-intro{color:rgba(255,255,255,.86)!important;font-family:Merriweather,Georgia,serif!important;font-size:15px!important;line-height:1.58!important;margin:0 0 22px!important;}',
      '.bw-blog-journey-grid{display:grid;gap:14px;grid-template-columns:repeat(3,minmax(0,1fr));margin-bottom:22px;}',
      '.bw-blog-related-title{color:#FFE600!important;font-size:13px!important;font-weight:900!important;letter-spacing:1.4px!important;line-height:1!important;margin:0 0 14px!important;text-transform:uppercase;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] .bw-blog-related-title{border:0!important;color:#FFE600!important;font-size:13px!important;line-height:1!important;margin:0 0 14px!important;padding:0!important;}',
      '.bw-blog-related-grid{display:grid;gap:14px;grid-template-columns:repeat(3,minmax(0,1fr));}',
      '.bw-blog-journey-card{background:#FFFFFF;border:0;color:#212121;display:flex;flex-direction:column;min-width:0;overflow:hidden;text-decoration:none;transition:box-shadow .16s ease,transform .16s ease;}',
      '.bw-blog-journey-card:hover{box-shadow:0 14px 28px rgba(0,0,0,.25);transform:translateY(-2px);}',
      '.bw-blog-journey-image{aspect-ratio:16/9;background:#E8EEE6;display:block;overflow:hidden;width:100%;}',
      '.bw-blog-journey-image img{display:block;height:100%!important;object-fit:cover;width:100%!important;}',
      '.bw-blog-journey-card-use-a-tool .bw-blog-journey-image{align-items:center;background:linear-gradient(135deg,#FFFDF1 0%,#E8F5E4 100%);display:flex;justify-content:center;padding:24px;}',
      '.bw-blog-journey-card-use-a-tool .bw-blog-journey-image img{height:82px!important;max-height:70%;max-width:82px;object-fit:contain;width:82px!important;}',
      '.bw-blog-journey-content{display:flex;flex:1;flex-direction:column;padding:14px 15px 16px;}',
      '.bw-blog-journey-label{color:#1B5E20;display:block;font-size:10px;font-weight:900;letter-spacing:1.2px;line-height:1;margin-bottom:9px;text-transform:uppercase;}',
      '.bw-blog-journey-card strong{color:#212121;display:block;font-size:16px;font-weight:900;line-height:1.16;overflow-wrap:break-word;}',
      '.bw-blog-journey [data-bw-tourcta]{margin:22px 0!important;}',
      '.bw-blog-back-top{align-items:center;background:#212121;border:2px solid #FFE600;border-radius:999px;bottom:24px;box-shadow:0 12px 28px rgba(0,0,0,.22);color:#FFFFFF;cursor:pointer;display:flex;font-size:22px;font-weight:900;height:44px;justify-content:center;opacity:0;pointer-events:none;position:fixed;right:22px;text-decoration:none;transform:translateY(10px);transition:opacity .18s ease,transform .18s ease,background .18s ease;visibility:hidden;width:44px;z-index:8500;}',
      '.bw-blog-back-top:hover{background:#1B5E20;}',
      '.bw-blog-back-top-visible{opacity:1;pointer-events:auto;transform:translateY(0);visibility:visible;}',
      '[' + NATIVE_END_MARKER + '="1"]{display:none!important;}',
      '@media (min-width:900px){.bw-blog-mobile-nav,.bw-blog-mobile-guide{display:none!important;}}',
      '@media (max-width:899px){body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] p:not(.bw-blog-mobile-guide-title):not(.bw-blog-journey-intro):not(.bw-blog-tool-copy):not([' + EMPTY_PARAGRAPH_MARKER + ']){font-size:17px!important;line-height:1.68!important;margin-bottom:17px!important;}body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] h2{font-size:28px!important;margin-top:34px!important;}.bw-blog-mobile-nav{background:#FFFDF1;border:1px solid #D7D7CF;border-left:5px solid #FFE600;box-shadow:0 10px 24px rgba(27,94,32,.07);display:block;margin:0 0 22px;padding:14px 14px 12px;}.bw-blog-tool-prompt{align-items:start;grid-template-columns:1fr;margin:28px 0;padding:18px;}.bw-blog-tool-button{justify-self:start;}.bw-blog-journey{margin:32px 0 28px;padding:24px 18px;}.bw-blog-journey-grid,.bw-blog-related-grid{grid-template-columns:1fr;}.bw-blog-journey h2{font-size:26px!important;}.bw-blog-journey-card-walk-it{display:none!important;}.bw-blog-back-top{bottom:92px;right:14px;width:42px;height:42px;font-size:21px;}}'
    ].join('\n');
    (document.head || document.documentElement).appendChild(style);
  }

  function loadData() {
    if (dataCache) return Promise.resolve(dataCache);
    if (dataPromise) return dataPromise;
    dataPromise = Promise.all([
      fetch(DATA_URL, { cache: 'no-cache' }).then(function (response) {
        if (!response.ok) throw new Error('blog data unavailable');
        return response.json();
      }),
      fetch(TOOLS_DATA_URL, { cache: 'no-cache' }).then(function (response) {
        if (!response.ok) return { tools: [] };
        return response.json();
      }).catch(function () { return { tools: [] }; })
    ])
      .then(function (payloads) {
        var data = payloads[0] || {};
        data.toolsHub = (payloads[1] && payloads[1].tools) || [];
        dataCache = data;
        return data;
      })
      .catch(function () {
        dataCache = { allPosts: [], tools: [], toolsHub: [], bookingUrl: 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based' };
        return dataCache;
      });
  }

  function currentPost(data) {
    var slug = currentSlug();
    return (data.allPosts || []).filter(function (post) { return post.slug === slug; })[0] || null;
  }

  function relatedPost(data, post) {
    var topic = post && post.topic;
    var posts = data.allPosts || [];
    for (var i = 0; i < posts.length; i++) {
      if (posts[i].slug !== (post && post.slug) && posts[i].topic === topic) return posts[i];
    }
    for (var j = 0; j < posts.length; j++) {
      if (posts[j].slug !== (post && post.slug)) return posts[j];
    }
    return null;
  }

  function relatedPosts(data, post, limit) {
    var posts = data.allPosts || [];
    var current = post && post.slug;
    var topic = post && post.topic;
    var picked = [];
    var seen = {};

    function add(candidate) {
      if (!candidate || !candidate.slug || candidate.slug === current || seen[candidate.slug]) return;
      if (!candidate.url || !candidate.title) return;
      seen[candidate.slug] = true;
      picked.push(candidate);
    }

    posts.forEach(function (candidate) {
      if (topic && candidate.topic === topic) add(candidate);
    });
    posts.forEach(add);
    return picked.slice(0, limit || 6);
  }

  function cloneTool(tool, slug) {
    if (!tool) return null;
    var copy = {};
    Object.keys(tool).forEach(function (key) {
      copy[key] = tool[key];
    });
    if (!copy.slug && slug) copy.slug = slug;
    return copy;
  }

  function relatedTool(data, post) {
    var slug = post && post.relatedToolSlug;
    var match = null;
    if (slug) {
      match = (data.toolsHub || []).filter(function (item) { return item.slug === slug; })[0] ||
        (data.tools || []).filter(function (item) { return item.slug === slug; })[0] ||
        TOOL_FALLBACKS[slug];
    }
    var tool = cloneTool(match || (data.tools || [])[0] || TOOL_FALLBACKS['berlin-first-day-planner'], slug || 'berlin-first-day-planner');
    if (tool && tool.slug && !tool.url) tool.url = 'https://www.berlinwalk.com/tools/' + tool.slug;
    if (tool && !tool.summary && tool.lead) tool.summary = tool.lead;
    if (tool && tool.slug && !tool.image) tool.image = TOOL_ICON_FALLBACKS[tool.slug] || '';
    return tool;
  }

  function normalizePostSpacing(body) {
    if (!body) return;
    body.querySelectorAll('p').forEach(function (paragraph) {
      if (paragraph.closest('[' + MOBILE_NAV_MARKER + '], [' + MOBILE_MARKER + '], [' + TOOL_MARKER + '], [' + JOURNEY_MARKER + '], [data-bw-leadform], [data-bw-tourcta]')) return;
      var hasMedia = paragraph.querySelector('img,iframe,video,svg,canvas,button,audio');
      var text = String(paragraph.textContent || '').replace(/\u00a0/g, ' ').trim();
      if (!hasMedia && !text) {
        paragraph.setAttribute(EMPTY_PARAGRAPH_MARKER, '1');
        paragraph.setAttribute('aria-hidden', 'true');
      } else {
        paragraph.removeAttribute(EMPTY_PARAGRAPH_MARKER);
        paragraph.removeAttribute('aria-hidden');
      }
    });
  }

  function markPostBody(body) {
    document.body.classList.add('bw-blog-post-enhanced');
    document.querySelectorAll('[' + POST_BODY_MARKER + ']').forEach(function (oldBody) {
      if (oldBody !== body) oldBody.removeAttribute(POST_BODY_MARKER);
    });
    body.setAttribute(POST_BODY_MARKER, '1');
  }

  function activeCategorySlug(data) {
    var post = currentPost(data || {});
    if (post && post.categorySlug) return post.categorySlug;
    var path = location.pathname.toLowerCase();
    if (/(german|language|speak)/.test(path)) return 'german-language';
    if (/(before-after|then-and-now|then-now|rebuilt|changed)/.test(path)) return 'before-after';
    if (/(myth|myths)/.test(path)) return 'berlin-myths';
    if (/(history|wall|cold-war|reichstag|museum|church|death|nikolaiviertel|ampelmann)/.test(path)) return 'berlin-history';
    if (/(route|itinerary|walking-tour|tour-starts|12-stops|hackescher|humboldt|weltzeituhr|berliner-dom)/.test(path)) return 'tour-route';
    return 'tourist-tips';
  }

  function mobileBlogNavHtml(active) {
    return '<a class="bw-blog-mobile-nav-home" href="https://www.berlinwalk.com/blog" target="_top">Blog Home</a>' +
      '<span class="bw-blog-mobile-nav-label">Categories</span>' +
      '<ul class="bw-blog-mobile-nav-list">' +
      BLOG_CATEGORIES.map(function (category) {
        var cls = ' class="bw-blog-mobile-nav-item' + (category.slug === active ? ' bw-blog-mobile-nav-active' : '') + '"';
        return '<li><a' + cls + ' href="' + escapeAttr(category.url) + '" target="_top" data-bw-blog-category="' + escapeAttr(category.slug) + '">' + escapeHtml(category.label) + '</a></li>';
      }).join('') +
      '</ul>';
  }

  function updateMobileBlogNavActive(nav, active) {
    if (!nav || nav.getAttribute('data-bw-blog-mobile-active') === active) return;
    nav.querySelectorAll('.bw-blog-mobile-nav-item').forEach(function (link) {
      link.classList.toggle('bw-blog-mobile-nav-active', link.getAttribute('data-bw-blog-category') === active);
    });
    nav.setAttribute('data-bw-blog-mobile-active', active);
  }

  function insertMobileBlogNav(body, data) {
    if (!body) return;
    var active = activeCategorySlug(data);
    var nav = document.querySelector('[' + MOBILE_NAV_MARKER + ']');
    if (!nav) {
      nav = document.createElement('nav');
      nav.className = 'bw-blog-mobile-nav';
      nav.setAttribute(MOBILE_NAV_MARKER, '1');
      nav.setAttribute('aria-label', 'Blog navigation');
      nav.innerHTML = mobileBlogNavHtml(active);
      nav.setAttribute('data-bw-blog-mobile-active', active);
    } else if (!nav.querySelector('.bw-blog-mobile-nav-item')) {
      nav.innerHTML = mobileBlogNavHtml(active);
      nav.setAttribute('data-bw-blog-mobile-active', active);
    } else {
      updateMobileBlogNavActive(nav, active);
    }
    var article = body.closest('article');
    if (article && article.contains(body)) {
      if (article.firstElementChild !== nav) article.insertBefore(nav, article.firstElementChild || body);
    } else {
      if (body.firstElementChild !== nav) body.insertBefore(nav, body.firstElementChild || null);
    }
  }

  function hasExistingToolReference(body, tool) {
    if (!body || !tool || !tool.url) return false;
    var slug = (tool.url.split('/').filter(Boolean).pop() || '').toLowerCase();
    if (!slug) return false;
    var widgetSlug = '';
    if (tool.widgetUrl) widgetSlug = (tool.widgetUrl.split('/').filter(Boolean).pop() || '').toLowerCase();
    var selector = 'a[href*="/tools/' + escapeSelector(slug) + '"], iframe[src*="/' + escapeSelector(slug) + '"]';
    if (widgetSlug) selector += ', iframe[src*="/' + escapeSelector(widgetSlug) + '/"], a[href*="/' + escapeSelector(widgetSlug) + '/"]';
    var refs = body.querySelectorAll(selector);
    for (var i = 0; i < refs.length; i++) {
      if (!refs[i].closest('[' + TOOL_MARKER + '], [' + JOURNEY_MARKER + ']')) return true;
    }
    return false;
  }

  function hasEmbeddedArticleTool(body, tool) {
    if (!body) return false;
    var frames = body.querySelectorAll('iframe[src*="fenerszymanski.github.io/berlinwalk-widgets/"]');
    for (var i = 0; i < frames.length; i++) {
      var src = frames[i].getAttribute('src') || '';
      if (frames[i].closest('[' + TOOL_MARKER + '], [' + JOURNEY_MARKER + ']')) continue;
      if (/\/(quick-summary|faq)\//.test(src)) continue;
      return true;
    }
    return hasExistingToolReference(body, tool);
  }

  function findToolInsertionPoint(body, items) {
    var start = items && items.length > 1 ? items[1].node : (items && items.length ? items[0].node : null);
    var node = start ? start.nextElementSibling : null;
    while (node) {
      var tag = (node.tagName || '').toUpperCase();
      if (tag === 'H2' || tag === 'H3') break;
      if (tag === 'P' && isVisible(node) && cleanText(node.textContent).length > 40) return { parent: node.parentNode, after: node };
      node = node.nextElementSibling;
    }
    var paragraphs = body.querySelectorAll('p');
    var seen = 0;
    for (var i = 0; i < paragraphs.length; i++) {
      var paragraph = paragraphs[i];
      if (!isVisible(paragraph)) continue;
      if (paragraph.closest('[' + MOBILE_NAV_MARKER + '], [' + MOBILE_MARKER + '], [' + TOOL_MARKER + '], [' + JOURNEY_MARKER + '], [data-bw-leadform], [data-bw-tourcta]')) continue;
      if (cleanText(paragraph.textContent).length < 40) continue;
      seen++;
      if (seen >= 2) return { parent: paragraph.parentNode, after: paragraph };
    }
    return null;
  }

  function insertToolPrompt(body, data, items) {
    var old = document.querySelector('[' + TOOL_MARKER + ']');
    if (old) old.remove();
    if (!body) return;
    var post = currentPost(data);
    var tool = relatedTool(data, post);
    if (!tool || !tool.url || hasEmbeddedArticleTool(body, tool)) return;
    var point = findToolInsertionPoint(body, items);
    if (!point || !point.parent || !point.after) return;

    var prompt = document.createElement('aside');
    prompt.className = 'bw-blog-tool-prompt';
    prompt.setAttribute(TOOL_MARKER, '1');
    prompt.setAttribute('aria-label', 'Useful Berlin tool');
    prompt.innerHTML =
      '<div>' +
        '<span class="bw-blog-tool-kicker">Useful now</span>' +
        '<strong>' + escapeHtml(tool.title) + '</strong>' +
        '<p class="bw-blog-tool-copy">' + escapeHtml(tool.summary || 'Make the practical next step faster.') + '</p>' +
      '</div>' +
      '<a class="bw-blog-tool-button" href="' + escapeAttr(tool.url) + '" target="_top" data-bw-blog-tool-click="' + escapeAttr(tool.title) + '">Open tool</a>';

    prompt.addEventListener('click', function (event) {
      var link = event.target.closest('[data-bw-blog-tool-click]');
      if (!link) return;
      pushEvent('bw_blog_tool_prompt_click', {
        slug: currentSlug(),
        tool: link.getAttribute('data-bw-blog-tool-click'),
        href: link.href
      });
    });

    point.parent.insertBefore(prompt, point.after.nextSibling);
    pushEvent('bw_blog_tool_prompt_view', {
      slug: currentSlug(),
      tool: tool.title
    });
  }

  function insertMobileGuide(body, items) {
    var old = document.querySelector('[' + MOBILE_MARKER + ']');
    if (old) old.remove();
    if (!body || !items || items.length < 2) return;
    var firstHeading = items[0].node;
    var nav = document.createElement('nav');
    nav.className = 'bw-blog-mobile-guide';
    nav.setAttribute(MOBILE_MARKER, '1');
    nav.setAttribute('aria-label', 'In this guide');
    nav.innerHTML =
      '<p class="bw-blog-mobile-guide-title">In this guide</p>' +
      '<ol class="bw-blog-mobile-guide-list">' +
      items.map(function (item) {
        return '<li><a href="#' + escapeAttr(item.id) + '">' + escapeHtml(item.text) + '</a></li>';
      }).join('') +
      '</ol>';
    nav.addEventListener('click', function (event) {
      var link = event.target.closest('a[href^="#"]');
      if (!link) return;
      var target = document.getElementById(link.getAttribute('href').slice(1));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', link.getAttribute('href'));
    });
    firstHeading.parentNode.insertBefore(nav, firstHeading);
  }

  function findJourneyInsertionPoint(body) {
    var tourCta = body.querySelector('[data-bw-tourcta]');
    if (tourCta && tourCta.parentNode) return { parent: tourCta.parentNode, before: tourCta };
    var candidates = body.querySelectorAll('p, li, blockquote');
    for (var i = candidates.length - 1; i >= 0; i--) {
      var el = candidates[i];
      if (!isVisible(el)) continue;
      if (el.closest('[' + MOBILE_NAV_MARKER + '], [' + MOBILE_MARKER + '], [' + TOOL_MARKER + '], [' + JOURNEY_MARKER + '], [data-bw-leadform], [data-bw-tourcta]')) continue;
      if (cleanText(el.textContent).length < 24) continue;
      return { parent: el.parentNode, after: el };
    }
    return { parent: body, after: body.lastElementChild };
  }

  function cardImage(card) {
    return card.image || card.thumb || TOUR_IMAGE;
  }

  function renderJourneyCard(card) {
    var image = cardImage(card);
    var key = slugify(card.label || card.title);
    return '<a class="bw-blog-journey-card bw-blog-journey-card-' + escapeAttr(key) + '" href="' + escapeAttr(card.url) + '" target="_top" data-bw-blog-journey-click="' + escapeAttr(card.label) + '">' +
      '<span class="bw-blog-journey-image" aria-hidden="true"><img src="' + escapeAttr(image) + '" alt="" loading="lazy"></span>' +
      '<span class="bw-blog-journey-content">' +
        '<span class="bw-blog-journey-label">' + escapeHtml(card.label) + '</span>' +
        '<strong>' + escapeHtml(card.title) + '</strong>' +
      '</span>' +
    '</a>';
  }

  function insertJourney(body, data) {
    var old = document.querySelector('[' + JOURNEY_MARKER + ']');
    if (old) old.remove();
    if (!body) return;
    var post = currentPost(data);
    var posts = relatedPosts(data, post, 7);
    var tool = relatedTool(data, post);
    var bookingUrl = data.bookingUrl || 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
    var cards = [
      {
        label: 'Walk it',
        title: 'Book the free Berlin walk',
        url: bookingUrl,
        image: TOUR_IMAGE
      }
    ];
    if (tool) {
      cards.push({
        label: 'Use a tool',
        title: tool.title,
        url: tool.url,
        image: tool.image
      });
    }
    if (posts[0]) {
      cards.push({
        label: 'Read next',
        title: posts[0].title,
        url: posts[0].url,
        image: posts[0].thumb || posts[0].image
      });
    }

    var section = document.createElement('section');
    section.className = 'bw-blog-journey';
    section.setAttribute(JOURNEY_MARKER, '1');
    section.setAttribute('aria-label', 'Next steps from this guide');
    section.innerHTML =
      '<span class="bw-blog-journey-kicker">Next step</span>' +
      '<h2>Turn this guide into a Berlin plan</h2>' +
      '<p class="bw-blog-journey-intro">Keep going with the walk, the right tool, or another practical Berlin guide.</p>' +
      '<div class="bw-blog-journey-grid">' +
      cards.slice(0, 3).map(renderJourneyCard).join('') +
      '</div>' +
      (posts.length ? '<h3 class="bw-blog-related-title">Related guides</h3>' +
      '<div class="bw-blog-related-grid">' +
      posts.slice(1, 7).map(function (related) {
        return renderJourneyCard({
          label: related.topicLabel || related.category || 'Guide',
          title: related.title,
          url: related.url,
          image: related.thumb || related.image
        });
      }).join('') +
      '</div>' : '');

    section.addEventListener('click', function (event) {
      var link = event.target.closest('[data-bw-blog-journey-click]');
      if (!link) return;
      pushEvent('bw_blog_journey_click', {
        label: link.getAttribute('data-bw-blog-journey-click'),
        slug: currentSlug(),
        href: link.href
      });
    });

    var point = findJourneyInsertionPoint(body);
    if (point.before) point.parent.insertBefore(section, point.before);
    else if (point.after && point.after.parentNode === point.parent) point.parent.insertBefore(section, point.after.nextSibling);
    else point.parent.appendChild(section);
    pushEvent('bw_blog_journey_view', { slug: currentSlug() });
  }

  function hideNativeEndMatter() {
    var labels = ['Related Posts', 'Comments'];
    var candidates = document.querySelectorAll('h1,h2,h3,h4,[role="heading"],p,span,div');
    var postBody = document.querySelector('[' + POST_BODY_MARKER + '="1"]');

    function isUnsafeEndMatterContainer(el) {
      if (!el || el === document.body || el === document.documentElement) return true;
      var tag = (el.tagName || '').toUpperCase();
      if (tag === 'MAIN' || tag === 'ARTICLE') return true;
      if (el.hasAttribute(POST_BODY_MARKER) || el.hasAttribute(JOURNEY_MARKER)) return true;
      if (postBody && el.contains(postBody)) return true;
      if (el.querySelector && el.querySelector('[' + POST_BODY_MARKER + '], [' + JOURNEY_MARKER + ']')) return true;
      return false;
    }

    function chooseContainer(el, label) {
      var node = el;
      for (var depth = 0; depth < 8 && node.parentElement && node.parentElement !== document.body; depth++) {
        var parent = node.parentElement;
        if (parent.closest('[' + JOURNEY_MARKER + '], [' + MOBILE_NAV_MARKER + '], [' + MOBILE_MARKER + '], [' + TOOL_MARKER + ']')) break;
        if (isUnsafeEndMatterContainer(parent)) break;
        var text = cleanText(parent.textContent);
        var hasRelatedShape = label === 'Related Posts' && text.indexOf('Related Posts') !== -1 && parent.querySelectorAll('a,img').length >= 2 && text.length < 1200;
        var hasCommentsShape = label === 'Comments' && (text.indexOf('Comments') !== -1 || text.indexOf("Commenting on this post") !== -1) && text.length < 700;
        if (hasRelatedShape || hasCommentsShape) return parent;
      }
      return node;
    }

    for (var i = 0; i < candidates.length; i++) {
      var text = cleanText(candidates[i].textContent);
      var isCommentUnavailable = text.indexOf("Commenting on this post") !== -1 && text.length < 220;
      if (labels.indexOf(text) === -1 && !isCommentUnavailable) continue;
      if (candidates[i].closest('[' + JOURNEY_MARKER + '], [' + MOBILE_NAV_MARKER + '], [' + MOBILE_MARKER + '], [' + TOOL_MARKER + ']')) continue;
      var label = text.indexOf('Related Posts') !== -1 ? 'Related Posts' : 'Comments';
      var container = chooseContainer(candidates[i], label);
      if (container && !isUnsafeEndMatterContainer(container)) {
        container.setAttribute(NATIVE_END_MARKER, '1');
        container.setAttribute('aria-hidden', 'true');
      }
    }
  }

  function pushEvent(name, params) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: name }, params || {}));
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
  }

  function insertBackToTop() {
    var button = document.querySelector('[' + BACK_TOP_MARKER + ']');
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'bw-blog-back-top';
      button.setAttribute(BACK_TOP_MARKER, '1');
      button.setAttribute('aria-label', 'Back to top');
      button.innerHTML = '&uarr;';
      button.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        pushEvent('bw_blog_back_top_click', { slug: currentSlug() });
      });
      document.body.appendChild(button);
    }
    if (backTopScrollHandler) window.removeEventListener('scroll', backTopScrollHandler);
    backTopScrollHandler = function () {
      button.classList.toggle('bw-blog-back-top-visible', window.scrollY > 640);
    };
    window.addEventListener('scroll', backTopScrollHandler, { passive: true });
    backTopScrollHandler();
  }

  function render() {
    if (!isPostPage()) {
      removeInjected();
      return;
    }
    injectStyle();
    var body = findPostBody();
    if (!body) return;
    markPostBody(body);
    normalizePostSpacing(body);
    insertBackToTop();
    var items = collectHeadings(body);
    insertMobileBlogNav(body, dataCache);
    insertMobileGuide(body, items);
    loadData().then(function (data) {
      insertMobileBlogNav(body, data);
      insertToolPrompt(body, data, items);
      insertJourney(body, data);
      hideNativeEndMatter();
    });
  }

  function removeInjected() {
    var mobileNav = document.querySelector('[' + MOBILE_NAV_MARKER + ']');
    var mobile = document.querySelector('[' + MOBILE_MARKER + ']');
    var tool = document.querySelector('[' + TOOL_MARKER + ']');
    var journey = document.querySelector('[' + JOURNEY_MARKER + ']');
    var backTop = document.querySelector('[' + BACK_TOP_MARKER + ']');
    if (mobileNav) mobileNav.remove();
    if (mobile) mobile.remove();
    if (tool) tool.remove();
    if (journey) journey.remove();
    if (backTop) backTop.remove();
    if (backTopScrollHandler) {
      window.removeEventListener('scroll', backTopScrollHandler);
      backTopScrollHandler = null;
    }
    document.body.classList.remove('bw-blog-post-enhanced');
    document.querySelectorAll('[' + POST_BODY_MARKER + ']').forEach(function (oldBody) {
      oldBody.removeAttribute(POST_BODY_MARKER);
    });
    document.querySelectorAll('[' + NATIVE_END_MARKER + ']').forEach(function (el) {
      el.removeAttribute(NATIVE_END_MARKER);
      el.removeAttribute('aria-hidden');
    });
  }

  function scheduleRender() {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(render, 80);
  }

  function boot() {
    if (isPostPage()) injectStyle();
    [0, 80, 220, 520, 1100, 2400, 4200, 7000].forEach(function (delay) {
      setTimeout(render, delay);
    });
    if (observer) observer.disconnect();
    observer = new MutationObserver(function () {
      if (!isPostPage()) return;
      var body = findPostBody();
      if (body) normalizePostSpacing(body);
      hideNativeEndMatter();
      var needsMobileGuide = body && collectHeadings(body).length >= 2;
      if (!document.querySelector('[' + JOURNEY_MARKER + ']') || !document.querySelector('[' + MOBILE_NAV_MARKER + ']') || (needsMobileGuide && !document.querySelector('[' + MOBILE_MARKER + ']'))) {
        scheduleRender();
      }
    });
    if (document.body) observer.observe(document.body, { childList: true, subtree: true });
  }

  if (isPostPage()) injectStyle();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  setInterval(function () {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      removeInjected();
      boot();
    }
  }, 300);
})();
