/* blog-journey-inject.js - polishes Wix Blog post reading flow, adds mobile
 * guide chips, a topic-aware inline tool prompt, and a next-step module.
 * Loaded site-wide via Wix Custom Code.
 */
(function () {
  var DATA_URL = window.BW_BLOG_DATA_URL || 'https://fenerszymanski.github.io/berlinwalk-widgets/blog-index/data.json';
  var STYLE_ID = 'bw-blog-journey-style';
  var POST_BODY_MARKER = 'data-bw-blog-post-body';
  var MOBILE_MARKER = 'data-bw-blog-mobile-guide';
  var TOOL_MARKER = 'data-bw-blog-tool-prompt';
  var JOURNEY_MARKER = 'data-bw-blog-journey';
  var MIN_MOBILE_WIDTH = 900;
  var dataCache = null;
  var renderTimer = null;
  var observer = null;
  var lastPath = location.pathname;

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
      if (heading.closest('[' + MOBILE_MARKER + '], [' + TOOL_MARKER + '], [' + JOURNEY_MARKER + '], [data-bw-leadform], [data-bw-tourcta]')) continue;
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
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] p:not(.bw-blog-mobile-guide-title):not(.bw-blog-journey-intro):not(.bw-blog-tool-copy){font-family:Merriweather,Georgia,serif!important;font-size:18px!important;line-height:1.78!important;margin:0 0 22px!important;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] h2,body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] h3{font-family:Montserrat,Arial,sans-serif!important;font-weight:900!important;letter-spacing:0!important;color:#212121!important;scroll-margin-top:96px;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] h2{border-top:2px solid #212121;font-size:clamp(28px,4vw,38px)!important;line-height:1.06!important;margin:42px 0 14px!important;padding-top:24px!important;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] h3{font-size:clamp(21px,3vw,26px)!important;line-height:1.12!important;margin:30px 0 10px!important;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] a:not(.bw-blog-mobile-guide-list a):not(.bw-blog-tool-button):not(.bw-blog-journey-card){color:#1B5E20!important;text-decoration-color:#FFE600!important;text-decoration-thickness:3px!important;text-underline-offset:3px!important;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] img{max-width:100%;}',
      'body.bw-blog-post-enhanced [data-bw-leadform]{margin:38px 0!important;}',
      '.bw-blog-mobile-guide,.bw-blog-tool-prompt,.bw-blog-journey{box-sizing:border-box;font-family:Montserrat,Arial,sans-serif;color:#212121;}',
      '.bw-blog-mobile-guide *,.bw-blog-tool-prompt *,.bw-blog-journey *{box-sizing:border-box;}',
      '.bw-blog-mobile-guide{background:#FAFAF5;border-top:2px solid #212121;border-bottom:2px solid #212121;margin:18px 0 24px;padding:16px 0 14px;}',
      '.bw-blog-mobile-guide-title{color:#1B5E20;font-size:11px;font-weight:900;letter-spacing:1.5px;line-height:1;margin:0 0 12px;text-transform:uppercase;}',
      '.bw-blog-mobile-guide-list{display:flex;gap:8px;list-style:none;margin:0;overflow-x:auto;padding:1px 0 6px;scrollbar-width:none;}',
      '.bw-blog-mobile-guide-list::-webkit-scrollbar{display:none;}',
      '.bw-blog-mobile-guide-list a{background:#FFFFFF;border:1px solid #212121;border-radius:0;color:#212121;display:inline-flex;font-size:12px;font-weight:900;line-height:1.15;min-height:36px;padding:0 12px;align-items:center;text-decoration:none;white-space:nowrap;}',
      '.bw-blog-mobile-guide-list a:focus-visible,.bw-blog-tool-prompt a:focus-visible,.bw-blog-journey a:focus-visible{outline:3px solid rgba(255,230,0,.9);outline-offset:3px;}',
      '.bw-blog-tool-prompt{align-items:center;background:#FAFAF5;border:2px solid #212121;display:grid;gap:20px;grid-template-columns:minmax(0,1fr) auto;margin:34px 0;padding:22px;}',
      '.bw-blog-tool-kicker,.bw-blog-journey-kicker{color:#1B5E20;display:block;font-size:11px;font-weight:900;letter-spacing:1.5px;line-height:1;margin:0 0 10px;text-transform:uppercase;}',
      '.bw-blog-tool-prompt strong{color:#212121;display:block;font-size:24px;font-weight:900;line-height:1.08;margin:0 0 7px;}',
      '.bw-blog-tool-copy{color:#4E5A4E!important;display:block;font-family:Merriweather,Georgia,serif!important;font-size:15px!important;line-height:1.48!important;margin:0!important;}',
      '.bw-blog-tool-button{align-items:center;background:#FFE600;border:1px solid #212121;color:#212121;display:inline-flex;font-size:12px;font-weight:900;justify-content:center;letter-spacing:.8px;min-height:42px;padding:0 15px;text-decoration:none;text-transform:uppercase;white-space:nowrap;}',
      '.bw-blog-journey{background:#111111;color:#FFFFFF;margin:42px 0 34px;padding:28px;position:relative;overflow:hidden;}',
      '.bw-blog-journey:before{background:linear-gradient(90deg,#FFE600,#7CB342);content:"";display:block;height:5px;left:0;position:absolute;top:0;width:100%;}',
      '.bw-blog-journey-kicker{color:#FFE600;}',
      '.bw-blog-journey h2{color:#FFFFFF!important;font-size:clamp(27px,4vw,36px)!important;font-weight:900!important;letter-spacing:0!important;line-height:1.06!important;margin:0 0 8px!important;padding:0!important;border:0!important;}',
      '.bw-blog-journey-intro{color:rgba(255,255,255,.86);font-family:Merriweather,Georgia,serif;font-size:15px;line-height:1.58;margin:0 0 20px;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] .bw-blog-journey h2{border:0!important;color:#FFFFFF!important;font-size:clamp(27px,4vw,36px)!important;line-height:1.06!important;margin:0 0 8px!important;padding:0!important;}',
      'body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] .bw-blog-journey .bw-blog-journey-intro{color:rgba(255,255,255,.86)!important;font-family:Merriweather,Georgia,serif!important;font-size:15px!important;line-height:1.58!important;margin:0 0 20px!important;}',
      '.bw-blog-journey-grid{display:grid;gap:12px;grid-template-columns:repeat(3,minmax(0,1fr));}',
      '.bw-blog-journey-card{background:#FFFFFF;border:0;color:#212121;display:flex;flex-direction:column;min-width:0;padding:17px;text-decoration:none;transition:box-shadow .16s ease,transform .16s ease;}',
      '.bw-blog-journey-card:hover{box-shadow:0 14px 28px rgba(0,0,0,.25);transform:translateY(-2px);}',
      '.bw-blog-journey-label{color:#1B5E20;display:block;font-size:10px;font-weight:900;letter-spacing:1.2px;line-height:1;margin-bottom:10px;text-transform:uppercase;}',
      '.bw-blog-journey-card strong{color:#212121;display:block;font-size:17px;font-weight:900;line-height:1.16;margin-bottom:8px;overflow-wrap:break-word;}',
      '.bw-blog-journey-card span:last-child{color:#4E5A4E;display:block;font-family:Merriweather,Georgia,serif;font-size:13px;line-height:1.45;}',
      '@media (min-width:900px){.bw-blog-mobile-guide{display:none!important;}}',
      '@media (max-width:899px){body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] p:not(.bw-blog-mobile-guide-title):not(.bw-blog-journey-intro):not(.bw-blog-tool-copy){font-size:17px!important;line-height:1.7!important;}body.bw-blog-post-enhanced [data-bw-blog-post-body="1"] h2{font-size:28px!important;margin-top:36px!important;}.bw-blog-tool-prompt{align-items:start;grid-template-columns:1fr;margin:28px 0;padding:18px;}.bw-blog-tool-button{justify-self:start;}.bw-blog-journey{margin:32px 0 28px;padding:24px 18px;}.bw-blog-journey-grid{grid-template-columns:1fr;}.bw-blog-journey h2{font-size:26px!important;}}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function loadData() {
    if (dataCache) return Promise.resolve(dataCache);
    return fetch(DATA_URL, { cache: 'no-cache' })
      .then(function (response) {
        if (!response.ok) throw new Error('blog data unavailable');
        return response.json();
      })
      .then(function (data) {
        dataCache = data;
        return data;
      })
      .catch(function () {
        dataCache = { allPosts: [], tools: [], bookingUrl: 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based' };
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

  function relatedTool(data, post) {
    var slug = post && post.relatedToolSlug;
    var tool = null;
    if (slug) {
      tool = (data.tools || []).filter(function (item) { return item.slug === slug; })[0] || TOOL_FALLBACKS[slug];
    }
    return tool || (data.tools || [])[0] || TOOL_FALLBACKS['berlin-first-day-planner'];
  }

  function markPostBody(body) {
    document.body.classList.add('bw-blog-post-enhanced');
    document.querySelectorAll('[' + POST_BODY_MARKER + ']').forEach(function (oldBody) {
      if (oldBody !== body) oldBody.removeAttribute(POST_BODY_MARKER);
    });
    body.setAttribute(POST_BODY_MARKER, '1');
  }

  function hasExistingToolReference(body, tool) {
    if (!body || !tool || !tool.url) return false;
    var slug = (tool.url.split('/').filter(Boolean).pop() || '').toLowerCase();
    if (!slug) return false;
    var refs = body.querySelectorAll('a[href*="/tools/' + escapeSelector(slug) + '"], iframe[src*="/' + escapeSelector(slug) + '"]');
    for (var i = 0; i < refs.length; i++) {
      if (!refs[i].closest('[' + TOOL_MARKER + '], [' + JOURNEY_MARKER + ']')) return true;
    }
    return false;
  }

  function findToolInsertionPoint(body, items) {
    var start = items && items.length ? items[0].node : null;
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
      if (paragraph.closest('[' + MOBILE_MARKER + '], [' + TOOL_MARKER + '], [' + JOURNEY_MARKER + '], [data-bw-leadform], [data-bw-tourcta]')) continue;
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
    if (!tool || !tool.url || hasExistingToolReference(body, tool)) return;
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
      if (el.closest('[' + MOBILE_MARKER + '], [' + TOOL_MARKER + '], [' + JOURNEY_MARKER + '], [data-bw-leadform], [data-bw-tourcta]')) continue;
      if (cleanText(el.textContent).length < 24) continue;
      return { parent: el.parentNode, after: el };
    }
    return { parent: body, after: body.lastElementChild };
  }

  function insertJourney(body, data) {
    var old = document.querySelector('[' + JOURNEY_MARKER + ']');
    if (old) old.remove();
    if (!body) return;
    var post = currentPost(data);
    var nextPost = relatedPost(data, post);
    var tool = relatedTool(data, post);
    var bookingUrl = data.bookingUrl || 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
    var cards = [
      {
        label: 'Walk it',
        title: 'Book the free Berlin walk',
        url: bookingUrl,
        summary: 'Join the 2 hours route from Alexanderplatz to near Hackescher Markt.'
      }
    ];
    if (nextPost) {
      cards.push({
        label: 'Read next',
        title: nextPost.title,
        url: nextPost.url,
        summary: nextPost.excerpt || 'Continue with a related BerlinWalk guide.'
      });
    }
    if (tool) {
      cards.push({
        label: 'Use a tool',
        title: tool.title,
        url: tool.url,
        summary: tool.summary || 'Make the practical next step faster.'
      });
    }

    var section = document.createElement('section');
    section.className = 'bw-blog-journey';
    section.setAttribute(JOURNEY_MARKER, '1');
    section.setAttribute('aria-label', 'Next steps from this guide');
    section.innerHTML =
      '<span class="bw-blog-journey-kicker">Next step</span>' +
      '<h2>Turn this guide into a Berlin plan</h2>' +
      '<p class="bw-blog-journey-intro">Keep going with the most useful next move: the walk, a related guide, or a practical Berlin tool.</p>' +
      '<div class="bw-blog-journey-grid">' +
      cards.slice(0, 3).map(function (card) {
        return '<a class="bw-blog-journey-card" href="' + escapeAttr(card.url) + '" target="_top" data-bw-blog-journey-click="' + escapeAttr(card.label) + '">' +
          '<span class="bw-blog-journey-label">' + escapeHtml(card.label) + '</span>' +
          '<strong>' + escapeHtml(card.title) + '</strong>' +
          '<span>' + escapeHtml(card.summary) + '</span>' +
        '</a>';
      }).join('') +
      '</div>';

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

  function pushEvent(name, params) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: name }, params || {}));
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
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
    var items = collectHeadings(body);
    insertMobileGuide(body, items);
    loadData().then(function (data) {
      insertToolPrompt(body, data, items);
      insertJourney(body, data);
    });
  }

  function removeInjected() {
    var mobile = document.querySelector('[' + MOBILE_MARKER + ']');
    var tool = document.querySelector('[' + TOOL_MARKER + ']');
    var journey = document.querySelector('[' + JOURNEY_MARKER + ']');
    if (mobile) mobile.remove();
    if (tool) tool.remove();
    if (journey) journey.remove();
    document.body.classList.remove('bw-blog-post-enhanced');
    document.querySelectorAll('[' + POST_BODY_MARKER + ']').forEach(function (oldBody) {
      oldBody.removeAttribute(POST_BODY_MARKER);
    });
  }

  function scheduleRender() {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(render, 700);
  }

  function boot() {
    setTimeout(render, 1200);
    [2400, 4200, 7000].forEach(function (delay) {
      setTimeout(scheduleRender, delay);
    });
    if (observer) observer.disconnect();
    observer = new MutationObserver(function () {
      if (!isPostPage()) return;
      var body = findPostBody();
      var needsMobileGuide = body && collectHeadings(body).length >= 2;
      if (!document.querySelector('[' + JOURNEY_MARKER + ']') || (needsMobileGuide && !document.querySelector('[' + MOBILE_MARKER + ']'))) {
        scheduleRender();
      }
    });
    if (document.body) observer.observe(document.body, { childList: true, subtree: true });
  }

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
