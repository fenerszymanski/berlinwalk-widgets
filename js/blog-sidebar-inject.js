/* blog-sidebar-inject.js - adds a desktop "On this page" sidebar to Wix Blog
 * posts. Loaded site-wide via Wix Custom Code. Self-skips non-post pages.
 */
(function () {
  var MARKER = 'data-bw-blog-sidebar';
  var NAV_MARKER = 'data-bw-blog-mini-nav';
  var STYLE_ID = 'bw-blog-sidebar-style';
  var LOG = '[BW blog-sidebar]';
  var MAX_ITEMS = 12;
  var MIN_DESKTOP_WIDTH = 900;
  var SIDEBAR_WIDTH = 236;
  var SIDEBAR_GAP = 12;
  var SIDEBAR_TOP = 24;
  var SIDEBAR_BOTTOM_GAP = 24;
  var HEADER_CLEARANCE = 8;
  var lastPath = location.pathname;
  var observer = null;
  var resizeTimer = null;
  var sidebarRepairTimer = null;
  var hiddenSidebarSince = 0;
  var lastSidebarRepairAt = 0;
  var currentSidebarState = null;
  var cleanupSidebar = null;

  function isPostPage() {
    return location.pathname.indexOf('/post/') === 0;
  }

  function findPostBody() {
    var candidates = [
      '[data-hook="post-content"]',
      '[data-hook="rich-content-viewer"]',
      '[data-hook="rich-content"]',
      '.post-content',
      '.rich-content',
      '.blog-post-page-content',
      'article',
      'main'
    ];
    for (var i = 0; i < candidates.length; i++) {
      var el = document.querySelector(candidates[i]);
      if (el && el.querySelectorAll('p').length >= 3) return el;
    }
    return null;
  }

  function isVisible(el) {
    while (el && el !== document.body && el.nodeType === 1) {
      var s = window.getComputedStyle(el);
      if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') return false;
      el = el.parentElement;
    }
    return true;
  }

  function cleanText(text) {
    return (text || '').replace(/\s+/g, ' ').trim();
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

  function shouldSkipHeading(heading) {
    var text = cleanText(heading.textContent);
    if (!text || text.length < 3) return true;
    if (/^(share|related posts?|recent posts?|comments?|leave a reply)$/i.test(text)) return true;
    if (heading.closest('[' + MARKER + ']')) return true;
    if (heading.closest('[data-bw-leadform], [data-bw-tourcta]')) return true;
    if (!isVisible(heading)) return true;
    return false;
  }

  function collectHeadings(body) {
    var raw = body.querySelectorAll('h2, h3');
    var items = [];
    var used = {};
    for (var i = 0; i < raw.length && items.length < MAX_ITEMS; i++) {
      var heading = raw[i];
      if (shouldSkipHeading(heading)) continue;
      var text = cleanText(heading.textContent);
      var base = slugify(text);
      var id = heading.id || 'bw-section-' + base;
      var suffix = 2;
      while (used[id] || document.querySelectorAll('#' + escapeSelector(id)).length > (heading.id ? 1 : 0)) {
        id = 'bw-section-' + base + '-' + suffix;
        suffix++;
      }
      used[id] = true;
      heading.id = id;
      items.push({
        id: id,
        text: text,
        level: heading.tagName.toLowerCase(),
        node: heading
      });
    }
    return items;
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '.bw-blog-sidebar{position:fixed;top:' + SIDEBAR_TOP + 'px;width:236px;max-height:calc(100vh - ' + (SIDEBAR_TOP + SIDEBAR_BOTTOM_GAP) + 'px);z-index:9000;font-family:Montserrat,Arial,sans-serif;color:#212121;display:flex;flex-direction:column;opacity:0;pointer-events:none;transition:opacity .18s ease,transform .18s ease;}',
      '.bw-blog-sidebar.bw-blog-sidebar-visible{opacity:1;pointer-events:auto;}',
      '.bw-blog-sidebar-nav{background:#FAFAF5;border:1px solid rgba(27,94,32,.16);border-radius:8px;box-shadow:0 10px 28px rgba(27,94,32,.08);flex:0 0 auto;margin:0 0 12px;overflow:hidden;padding:12px;}',
      '.bw-blog-sidebar-nav-home{align-items:center;background:#1B5E20;border:1px solid #1B5E20;border-radius:999px;color:#FFFFFF;display:flex;font-size:12px;font-weight:900;justify-content:center;line-height:1;min-height:32px;padding:0 12px;text-decoration:none;white-space:nowrap;}',
      '.bw-blog-sidebar-nav-home:hover,.bw-blog-sidebar-nav-home:focus-visible{background:#164F1B;color:#FFFFFF;outline:0;}',
      '.bw-blog-sidebar-nav-label{color:#4E5A4E;display:block;font-size:10px;font-weight:900;letter-spacing:1.3px;line-height:1;margin:12px 0 8px;text-transform:uppercase;}',
      '.bw-blog-sidebar-nav-list{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0;list-style:none;}',
      '.bw-blog-sidebar-nav-link{align-items:center;background:#FFFFFF;border:1px solid rgba(27,94,32,.14);border-radius:999px;color:#1B5E20;display:inline-flex;font-size:11px;font-weight:850;line-height:1.1;min-height:28px;padding:0 9px;position:relative;text-decoration:none;white-space:nowrap;}',
      '.bw-blog-sidebar-nav-link:hover,.bw-blog-sidebar-nav-link:focus-visible{background:#FFFDF0;border-color:rgba(27,94,32,.28);color:#1B5E20;outline:0;}',
      '.bw-blog-sidebar-nav-link-active{background:#FFF9B8;border-color:#FFE600;color:#1B5E20;font-weight:900;}',
      '.bw-blog-sidebar-progress{height:4px;background:rgba(27,94,32,.10);border-radius:999px;flex:0 0 auto;margin:0 0 12px;overflow:hidden;}',
      '.bw-blog-sidebar-progress span{display:block;height:100%;width:0;background:linear-gradient(90deg,#1B5E20,#7CB342,#FFE600);border-radius:999px;transition:width .08s linear;}',
      '.bw-blog-sidebar-card{background:#FAFAF5;border:1px solid rgba(27,94,32,.16);border-radius:8px;box-shadow:0 10px 28px rgba(27,94,32,.08);flex:1 1 auto;max-height:none;min-height:0;overflow-y:auto;padding:16px 14px;scrollbar-width:thin;}',
      '.bw-blog-sidebar-title{color:#4E5A4E;font-size:11px;font-weight:800;letter-spacing:1.4px;line-height:1;text-transform:uppercase;margin:0 0 12px;}',
      '.bw-blog-sidebar-list{display:flex;flex-direction:column;gap:1px;margin:0;padding:0;list-style:none;}',
      '.bw-blog-sidebar-link{border-left:3px solid transparent;border-radius:0 6px 6px 0;color:#4E5A4E;display:block;font-size:12.8px;font-weight:700;line-height:1.22;padding:5px 7px 5px 10px;text-decoration:none;transition:background .16s ease,border-color .16s ease,color .16s ease;}',
      '.bw-blog-sidebar-link:hover{background:rgba(255,230,0,.16);color:#1B5E20;}',
      '.bw-blog-sidebar-link.bw-blog-sidebar-active{border-left-color:#FFE600;color:#1B5E20;background:rgba(255,230,0,.18);}',
      '.bw-blog-sidebar-link[data-level="h3"]{font-size:12px;padding-left:20px;color:#6A746A;}',
      '.bw-blog-sidebar-share{align-items:center;display:flex;flex:0 0 auto;gap:6px;margin-top:10px;}',
      '.bw-blog-sidebar-share-label{color:#6A746A;font-size:12px;font-weight:700;margin-right:0;}',
      '.bw-blog-sidebar-share a,.bw-blog-sidebar-share button{align-items:center;background:#FFFFFF;border:1px solid rgba(27,94,32,.14);border-radius:7px;color:#1B5E20;cursor:pointer;display:inline-flex;font:700 11px/1 Montserrat,Arial,sans-serif;height:30px;justify-content:center;min-width:30px;padding:0 8px;text-decoration:none;}',
      '.bw-blog-sidebar-share a:hover,.bw-blog-sidebar-share button:hover{background:#FFE600;border-color:#FFE600;}',
      'body #bw-desktop-cta{left:18px!important;right:auto!important;bottom:18px!important;z-index:8000!important;}',
      'body #bw-desktop-cta .bw-link{gap:8px!important;padding:9px 13px 9px 13px!important;}',
      'body #bw-desktop-cta .bw-emoji{font-size:15px!important;}',
      'body #bw-desktop-cta .bw-label-small{font-size:9px!important;letter-spacing:1.1px!important;}',
      'body #bw-desktop-cta .bw-label-big{font-size:12.5px!important;}',
      'body #bw-sticky-cta .bw-btn{font-size:12px!important;padding:9px 13px!important;}',
      'body #bw-sticky-cta .bw-title{font-size:12px!important;}',
      'body #bw-sticky-cta .bw-sub{display:none!important;}',
      'body #bw-desktop-cta .bw-arrow{width:27px!important;height:27px!important;font-size:13px!important;margin:5px 5px 5px 2px!important;}',
      'body #bw-desktop-cta .bw-close{width:20px!important;height:20px!important;font-size:13px!important;}',
      '@media (max-width:899px){.bw-blog-sidebar{display:none!important;}}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function shareUrl(service) {
    var url = encodeURIComponent(location.href.split('#')[0]);
    var title = encodeURIComponent(document.title || 'BerlinWalk');
    if (service === 'x') return 'https://twitter.com/intent/tweet?url=' + url + '&text=' + title;
    if (service === 'fb') return 'https://www.facebook.com/sharer/sharer.php?u=' + url;
    if (service === 'pin') return 'https://www.pinterest.com/pin/create/button/?url=' + url + '&description=' + title;
    return '#';
  }

  function getActiveCategory() {
    var path = location.pathname.toLowerCase();
    if (/(german|language|speak)/.test(path)) return 'german-language';
    if (/(myth|mistake|wrong|really)/.test(path)) return 'berlin-myths';
    if (/(route|itinerary|walk|stops|alexanderplatz|hackescher)/.test(path)) return 'tour-route';
    if (/(before|after|then|now|old|rebuilt|changed)/.test(path)) return 'before-after';
    if (/(history|wall|cold-war|reichstag|museum|church|death|nikolaiviertel)/.test(path)) return 'berlin-history';
    return 'tourist-tips';
  }

  function renderSidebarCategoryLinks() {
    var active = getActiveCategory();
    var links = [
      ['tour-route', 'Tour Route', 'https://www.berlinwalk.com/blog/categories/tour-route'],
      ['berlin-myths', 'Berlin Myths', 'https://www.berlinwalk.com/blog/categories/berlin-myths'],
      ['tourist-tips', 'Tourist Tips', 'https://www.berlinwalk.com/blog/categories/tourist-tips'],
      ['before-after', 'Before & After', 'https://www.berlinwalk.com/blog/categories/before-after'],
      ['german-language', 'German Language', 'https://www.berlinwalk.com/blog/categories/german-language'],
      ['berlin-history', 'Berlin History', 'https://www.berlinwalk.com/blog/categories/berlin-history']
    ];
    return links.map(function (link) {
      var cls = 'bw-blog-sidebar-nav-link' + (link[0] === active ? ' bw-blog-sidebar-nav-link-active' : '');
      return '<li><a class="' + cls + '" href="' + link[2] + '" target="_top">' + escapeHtml(link[1]) + '</a></li>';
    }).join('');
  }

  function createSidebar(items) {
    var aside = document.createElement('aside');
    aside.setAttribute(MARKER, '1');
    aside.className = 'bw-blog-sidebar';
    aside.setAttribute('aria-label', 'On this page');

    var links = items.map(function (item) {
      return '<li><a class="bw-blog-sidebar-link" data-level="' + item.level + '" href="#' + item.id + '">' + escapeHtml(item.text) + '</a></li>';
    }).join('');

    aside.innerHTML =
      '<div class="bw-blog-sidebar-nav" aria-label="Blog navigation">' +
        '<a class="bw-blog-sidebar-nav-home" href="https://www.berlinwalk.com/blog" target="_top">Blog Home</a>' +
        '<span class="bw-blog-sidebar-nav-label">Categories</span>' +
        '<ul class="bw-blog-sidebar-nav-list">' + renderSidebarCategoryLinks() + '</ul>' +
      '</div>' +
      '<div class="bw-blog-sidebar-progress" aria-hidden="true"><span></span></div>' +
      '<div class="bw-blog-sidebar-card">' +
        '<p class="bw-blog-sidebar-title">On this page</p>' +
        '<ol class="bw-blog-sidebar-list">' + links + '</ol>' +
      '</div>' +
      '<div class="bw-blog-sidebar-share" aria-label="Share this post">' +
        '<span class="bw-blog-sidebar-share-label">Share</span>' +
        '<a href="' + shareUrl('x') + '" target="_blank" rel="noopener" aria-label="Share on X">X</a>' +
        '<a href="' + shareUrl('fb') + '" target="_blank" rel="noopener" aria-label="Share on Facebook">FB</a>' +
        '<a href="' + shareUrl('pin') + '" target="_blank" rel="noopener" aria-label="Share on Pinterest">Pin</a>' +
        '<button type="button" data-bw-copy-link aria-label="Copy link">Link</button>' +
      '</div>';

    aside.addEventListener('click', function (event) {
      var copy = event.target.closest('[data-bw-copy-link]');
      if (copy) {
        event.preventDefault();
        copyLink(copy);
        return;
      }
      var link = event.target.closest('a[href^="#"]');
      if (!link) return;
      var target = document.getElementById(link.getAttribute('href').slice(1));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', link.getAttribute('href'));
    });

    return aside;
  }

  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function (ch) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
    });
  }

  function copyLink(button) {
    var url = location.href.split('#')[0];
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {
        flashCopied(button);
      });
    } else {
      flashCopied(button);
    }
  }

  function flashCopied(button) {
    var old = button.textContent;
    button.textContent = 'Copied';
    setTimeout(function () { button.textContent = old; }, 1200);
  }

  function rectUsable(rect, viewportW) {
    return rect &&
      rect.width >= 360 &&
      rect.width <= 1500 &&
      rect.height > 40 &&
      rect.left >= 120 &&
      rect.right > viewportW * 0.35 &&
      rect.right < viewportW - 80;
  }

  function addRectCandidate(candidates, el, viewportW) {
    if (!el || el.nodeType !== 1 || !isVisible(el)) return;
    var rect = el.getBoundingClientRect();
    if (!rectUsable(rect, viewportW)) return;
    candidates.push({
      el: el,
      rect: rect
    });
  }

  function getArticleRect(body, items, viewportW, sidebarWidth, gap) {
    var candidates = [];
    var title = findPostTitle();
    var selectors = [
      'article',
      '[data-hook="post-page"]',
      '[data-hook="post-content"]',
      '[data-hook="rich-content-viewer"]',
      '[data-hook="rich-content"]'
    ];

    addRectCandidate(candidates, body, viewportW);
    if (title) {
      var titleEl = title.parentElement;
      while (titleEl && titleEl !== document.body) {
        addRectCandidate(candidates, titleEl, viewportW);
        titleEl = titleEl.parentElement;
      }
    }

    for (var h = 0; items && h < Math.min(items.length, 4); h++) {
      var heading = items[h].node;
      if (!heading) continue;
      for (var i = 0; i < selectors.length; i++) {
        addRectCandidate(candidates, heading.closest(selectors[i]), viewportW);
      }
      var el = heading.parentElement;
      while (el && el !== document.body) {
        addRectCandidate(candidates, el, viewportW);
        el = el.parentElement;
      }
    }

    candidates = candidates.filter(function (candidate) {
      return candidate.rect.right + gap + sidebarWidth <= viewportW - 24;
    });
    if (!candidates.length) {
      return {
        left: viewportW - sidebarWidth - 32 - gap,
        right: viewportW - sidebarWidth - 32 - gap,
        width: sidebarWidth,
        height: 1
      };
    }

    candidates.sort(function (a, b) {
      var aWide = a.rect.width >= 900 ? 1 : 0;
      var bWide = b.rect.width >= 900 ? 1 : 0;
      if (aWide !== bWide) return bWide - aWide;
      if (aWide && bWide) return a.rect.right - b.rect.right;
      return b.rect.right - a.rect.right;
    });
    return candidates[0].rect;
  }

  function getHeaderMenuEndY() {
    var selectors = [
      'bw-site-header',
      '.bw-header-wrap',
      '#SITE_HEADER',
      '[id*="SITE_HEADER"]',
      '[data-hook="site-header"]',
      '[data-testid*="header"]',
      'header[role="banner"]'
    ];
    var y = window.scrollY || window.pageYOffset || 0;
    var best = 0;
    var seen = [];
    for (var i = 0; i < selectors.length; i++) {
      var nodes = document.querySelectorAll(selectors[i]);
      for (var j = 0; j < nodes.length; j++) {
        var el = nodes[j];
        if (seen.indexOf(el) !== -1 || !isVisible(el)) continue;
        seen.push(el);
        var rect = el.getBoundingClientRect();
        if (!rect || rect.height < 32 || rect.height > 320) continue;
        if (rect.bottom <= 0 || rect.top > 260) continue;
        var style = window.getComputedStyle(el);
        var endY = rect.bottom + y;
        if ((style.position === 'fixed' || style.position === 'sticky') && rect.top <= 4) {
          endY = rect.bottom;
        }
        best = Math.max(best, endY);
      }
    }
    return best ? best + HEADER_CLEARANCE : 0;
  }

  function positionSidebar(sidebar, body, items) {
    if (!sidebar || !body) return;
    var viewportW = window.innerWidth || document.documentElement.clientWidth;
    if (viewportW < MIN_DESKTOP_WIDTH) {
      sidebar.classList.remove('bw-blog-sidebar-visible');
      return;
    }
    var bounds = getBodyBounds(body);
    var y = window.scrollY || window.pageYOffset || 0;
    var stickyY = y + SIDEBAR_TOP;
    var startY = getHeaderMenuEndY();
    if (!bounds || stickyY < startY || stickyY > bounds.end - 24) {
      sidebar.classList.remove('bw-blog-sidebar-visible');
      return;
    }
    var gap = SIDEBAR_GAP;
    var width = SIDEBAR_WIDTH;
    var rect = getArticleRect(body, items, viewportW, width, gap);
    if (!rect) {
      sidebar.classList.remove('bw-blog-sidebar-visible');
      return;
    }
    var left = Math.round(rect.right + gap);
    if (left < viewportW * 0.52 || left + width > viewportW - 24) {
      sidebar.classList.remove('bw-blog-sidebar-visible');
      return;
    }
    sidebar.style.left = left + 'px';
    sidebar.classList.add('bw-blog-sidebar-visible');
  }

  function isPostTextNode(el) {
    if (!el || el.nodeType !== 1 || !isVisible(el)) return false;
    if (el.closest('[' + MARKER + '], [' + NAV_MARKER + '], [data-bw-leadform], [data-bw-tourcta]')) return false;
    if (el.closest('#bw-desktop-cta, #bw-sticky-cta')) return false;
    return cleanText(el.textContent).length >= 18;
  }

  function getBodyBounds(body) {
    if (!body) return null;
    var nodes = [];
    var candidates = body.querySelectorAll('p, h2, h3, li, blockquote');
    for (var i = 0; i < candidates.length; i++) {
      if (isPostTextNode(candidates[i])) nodes.push(candidates[i]);
    }
    if (!nodes.length) return null;
    var title = findPostTitle();
    var first = (title || nodes[0]).getBoundingClientRect();
    var last = nodes[nodes.length - 1].getBoundingClientRect();
    var y = window.scrollY || window.pageYOffset || 0;
    return {
      start: first.top + y,
      end: last.bottom + y
    };
  }

  function updateActive(sidebar, items) {
    if (!sidebar || !items || !items.length) return;
    var y = window.scrollY || window.pageYOffset || 0;
    var docH = (document.documentElement.scrollHeight || 0) - (window.innerHeight || 0);
    var pct = docH > 0 ? Math.max(0, Math.min(100, (y / docH) * 100)) : 0;
    var bar = sidebar.querySelector('.bw-blog-sidebar-progress span');
    if (bar) bar.style.width = pct + '%';

    var active = items[0];
    var offset = 140;
    for (var i = 0; i < items.length; i++) {
      var top = items[i].node.getBoundingClientRect().top;
      if (top <= offset) active = items[i];
      else break;
    }
    sidebar.querySelectorAll('.bw-blog-sidebar-link').forEach(function (link) {
      link.classList.toggle('bw-blog-sidebar-active', link.getAttribute('href') === '#' + active.id);
    });
  }

  function removeSidebar() {
    if (cleanupSidebar) {
      cleanupSidebar();
      cleanupSidebar = null;
    }
    currentSidebarState = null;
    hiddenSidebarSince = 0;
    var old = document.querySelector('[' + MARKER + ']');
    if (old) old.remove();
  }

  function removeAllInjectedUi() {
    removeSidebar();
    var oldNav = document.querySelector('[' + NAV_MARKER + ']');
    if (oldNav) oldNav.remove();
  }

  function removeMiniNav() {
    var oldNav = document.querySelector('[' + NAV_MARKER + ']');
    if (oldNav) oldNav.remove();
  }

  function findPostTitle() {
    var headings = document.querySelectorAll('h1');
    for (var i = 0; i < headings.length; i++) {
      var h = headings[i];
      if (h.closest('[' + MARKER + '], [' + NAV_MARKER + ']')) continue;
      if (!isVisible(h)) continue;
      if (cleanText(h.textContent).length > 8) return h;
    }
    return null;
  }

  function compactFloatingCta() {
    var desktopLabel = document.querySelector('#bw-desktop-cta .bw-label-big');
    if (desktopLabel && cleanText(desktopLabel.textContent) !== 'Book Tour') {
      desktopLabel.textContent = 'Book Tour';
    }
    var stickyBtn = document.querySelector('#bw-sticky-cta .bw-btn');
    if (stickyBtn && cleanText(stickyBtn.textContent) !== '🚶 Book Walking Tour') {
      stickyBtn.textContent = '🚶 Book Walking Tour';
    }
  }

  function sidebarStateIsStale(state) {
    if (!state || state.path !== location.pathname) return true;
    if (!state.sidebar || !state.sidebar.isConnected) return true;
    if (!state.body || !state.body.isConnected || !isVisible(state.body)) return true;
    if (!state.items || state.items.length < 2) return true;
    for (var i = 0; i < Math.min(state.items.length, 4); i++) {
      if (!state.items[i].node || !state.items[i].node.isConnected || !isVisible(state.items[i].node)) return true;
    }
    return false;
  }

  function sidebarShouldBeVisibleNow(body, items) {
    var viewportW = window.innerWidth || document.documentElement.clientWidth;
    if (viewportW < MIN_DESKTOP_WIDTH || !body || !items || items.length < 2) return false;
    var bounds = getBodyBounds(body);
    var y = window.scrollY || window.pageYOffset || 0;
    var stickyY = y + SIDEBAR_TOP;
    var startY = getHeaderMenuEndY();
    return !!(bounds && stickyY >= startY && stickyY <= bounds.end - 24);
  }

  function repairSidebarIfNeeded() {
    if (!isPostPage()) return;
    var viewportW = window.innerWidth || document.documentElement.clientWidth;
    if (viewportW < MIN_DESKTOP_WIDTH) return;
    var sidebar = document.querySelector('[' + MARKER + ']');
    if (!sidebar || sidebarStateIsStale(currentSidebarState)) {
      inject();
      return;
    }
    if (sidebar.classList.contains('bw-blog-sidebar-visible')) {
      hiddenSidebarSince = 0;
      return;
    }
    if (!sidebarShouldBeVisibleNow(currentSidebarState.body, currentSidebarState.items)) {
      hiddenSidebarSince = 0;
      return;
    }
    var now = Date.now();
    if (!hiddenSidebarSince) hiddenSidebarSince = now;
    if (now - hiddenSidebarSince < 1200 || now - lastSidebarRepairAt < 3000) return;
    lastSidebarRepairAt = now;
    removeSidebar();
    inject();
  }

  function scheduleSidebarRepair() {
    clearTimeout(sidebarRepairTimer);
    sidebarRepairTimer = setTimeout(repairSidebarIfNeeded, 700);
  }

  function inject() {
    if (!isPostPage()) {
      removeAllInjectedUi();
      return false;
    }
    var body = findPostBody();
    if (!body) return false;
    injectStyle();
    compactFloatingCta();
    var items = collectHeadings(body);
    if (items.length < 2) {
      removeSidebar();
      return false;
    }

    removeSidebar();
    var sidebar = createSidebar(items);
    document.body.appendChild(sidebar);
    currentSidebarState = {
      sidebar: sidebar,
      body: body,
      items: items,
      path: location.pathname
    };

    function refresh() {
      if (sidebarStateIsStale(currentSidebarState)) {
        scheduleInject();
        return;
      }
      positionSidebar(sidebar, body, items);
      updateActive(sidebar, items);
    }
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(refresh, 120);
    }

    refresh();
    window.addEventListener('scroll', refresh, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    cleanupSidebar = function () {
      window.removeEventListener('scroll', refresh);
      window.removeEventListener('resize', onResize);
    };
    console.log(LOG, 'injected', items.length, 'items');
    return true;
  }

  function scheduleInject() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(inject, 500);
  }

  function bootForCurrentPage() {
    removeMiniNav();
    setTimeout(inject, 900);
    [1600, 2800, 4500].forEach(function (delay) {
      setTimeout(function () {
        if (!document.querySelector('[' + MARKER + ']')) inject();
        else scheduleSidebarRepair();
      }, delay);
    });
    if (observer) observer.disconnect();
    observer = new MutationObserver(function () {
      if (!isPostPage()) return;
      compactFloatingCta();
      removeMiniNav();
      if (!document.querySelector('[' + MARKER + ']')) scheduleInject();
      else scheduleSidebarRepair();
    });
    if (document.body) observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootForCurrentPage);
  } else {
    bootForCurrentPage();
  }

  setInterval(function () {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      removeAllInjectedUi();
      bootForCurrentPage();
    }
  }, 300);
})();
