/* blog-sidebar-inject.js - adds a desktop "On this page" sidebar to Wix Blog
 * posts. Loaded site-wide via Wix Custom Code. Self-skips non-post pages.
 */
(function () {
  var MARKER = 'data-bw-blog-sidebar';
  var NAV_MARKER = 'data-bw-blog-mini-nav';
  var STYLE_ID = 'bw-blog-sidebar-style';
  var LOG = '[BW blog-sidebar]';
  var MAX_ITEMS = 12;
  var MIN_DESKTOP_WIDTH = 1024;
  var SIDEBAR_WIDTH = 236;
  var SIDEBAR_GAP = 12;
  var SIDEBAR_TOP = 150;
  var lastPath = location.pathname;
  var observer = null;
  var resizeTimer = null;
  var cleanupSidebar = null;
  var cleanupMiniNav = null;

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
      '.bw-blog-sidebar{position:fixed;top:' + SIDEBAR_TOP + 'px;width:236px;max-height:calc(100vh - 212px);z-index:9000;font-family:Montserrat,Arial,sans-serif;color:#212121;opacity:0;pointer-events:none;transition:opacity .18s ease,transform .18s ease;}',
      '.bw-blog-sidebar.bw-blog-sidebar-visible{opacity:1;pointer-events:auto;}',
      '.bw-blog-sidebar-progress{height:4px;background:rgba(27,94,32,.10);border-radius:999px;margin:0 0 12px;overflow:hidden;}',
      '.bw-blog-sidebar-progress span{display:block;height:100%;width:0;background:linear-gradient(90deg,#1B5E20,#7CB342,#FFE600);border-radius:999px;transition:width .08s linear;}',
      '.bw-blog-sidebar-card{background:#FAFAF5;border:1px solid rgba(27,94,32,.16);border-radius:8px;box-shadow:0 10px 28px rgba(27,94,32,.08);max-height:calc(100vh - 274px);overflow-y:auto;padding:16px 14px;scrollbar-width:thin;}',
      '.bw-blog-sidebar-title{color:#4E5A4E;font-size:11px;font-weight:800;letter-spacing:1.4px;line-height:1;text-transform:uppercase;margin:0 0 12px;}',
      '.bw-blog-sidebar-list{display:flex;flex-direction:column;gap:1px;margin:0;padding:0;list-style:none;}',
      '.bw-blog-sidebar-link{border-left:3px solid transparent;border-radius:0 6px 6px 0;color:#4E5A4E;display:block;font-size:12.8px;font-weight:700;line-height:1.22;padding:5px 7px 5px 10px;text-decoration:none;transition:background .16s ease,border-color .16s ease,color .16s ease;}',
      '.bw-blog-sidebar-link:hover{background:rgba(255,230,0,.16);color:#1B5E20;}',
      '.bw-blog-sidebar-link.bw-blog-sidebar-active{border-left-color:#FFE600;color:#1B5E20;background:rgba(255,230,0,.18);}',
      '.bw-blog-sidebar-link[data-level="h3"]{font-size:12px;padding-left:20px;color:#6A746A;}',
      '.bw-blog-sidebar-share{align-items:center;display:flex;gap:6px;margin-top:10px;}',
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
      '.bw-blog-mini-nav{box-sizing:border-box;font-family:Montserrat,Arial,sans-serif;margin:0 0 34px;padding:0;width:100%;}',
      '.bw-blog-mini-nav *{box-sizing:border-box;}',
      '.bw-blog-mini-nav-inner{background:#FFFFFF;border:1px solid rgba(27,94,32,.14);border-radius:8px;box-shadow:0 16px 34px rgba(27,94,32,.08);overflow:hidden;padding:0;transition:box-shadow .18s ease,opacity .18s ease,transform .18s ease;}',
      '.bw-blog-mini-nav-inner:before{background:#FFE600;content:"";display:block;height:6px;width:100%;}',
      '.bw-blog-mini-nav-content{padding:27px 32px 28px;}',
      '.bw-blog-mini-nav-kicker{color:#4E5A4E;font-size:12px;font-weight:900;letter-spacing:2px;line-height:1.1;margin:0 0 10px;text-transform:uppercase;}',
      '.bw-blog-mini-nav-deck{color:#212121;font:700 17px/1.45 Merriweather,Georgia,serif;margin:0 0 22px;max-width:760px;}',
      '.bw-blog-mini-nav-row{align-items:flex-start;display:flex;gap:22px;width:100%;}',
      '.bw-blog-mini-nav-home{align-items:center;background:#1B5E20;border:1px solid #1B5E20;border-radius:999px;color:#FFFFFF;display:inline-flex;flex:0 0 auto;font-size:15px;font-weight:900;justify-content:center;line-height:1;min-height:44px;padding:0 27px;text-decoration:none;white-space:nowrap;}',
      '.bw-blog-mini-nav-home:hover,.bw-blog-mini-nav-home:focus-visible{background:#164F1B;color:#FFFFFF;outline:0;}',
      '.bw-blog-mini-nav-group{align-items:flex-start;display:flex;flex:1 1 auto;gap:16px;min-width:0;padding-top:3px;}',
      '.bw-blog-mini-nav-label{color:#4E5A4E;display:inline-flex;flex:0 0 auto;font-size:12px;font-weight:900;letter-spacing:1.8px;line-height:38px;text-transform:uppercase;white-space:nowrap;}',
      '.bw-blog-mini-nav-list{display:flex;flex:1 1 auto;flex-wrap:wrap;gap:10px 11px;min-width:0;}',
      '.bw-blog-mini-nav-link{align-items:center;background:#FAFAF5;border:1px solid rgba(27,94,32,.14);border-radius:999px;color:#1B5E20;display:inline-flex;flex:0 0 auto;font-size:14px;font-weight:850;justify-content:center;line-height:1.15;min-height:38px;padding:0 20px;position:relative;text-align:center;text-decoration:none;white-space:nowrap;}',
      '.bw-blog-mini-nav-link:after{background:#FFE600;border-radius:999px;bottom:7px;content:"";height:4px;left:20px;opacity:0;position:absolute;right:20px;transform:scaleX(.55);transition:opacity .16s ease,transform .16s ease;}',
      '.bw-blog-mini-nav-link:hover,.bw-blog-mini-nav-link:focus-visible{background:#FFFFFF;border-color:rgba(27,94,32,.28);color:#1B5E20;outline:0;}',
      '.bw-blog-mini-nav-link:hover:after,.bw-blog-mini-nav-link:focus-visible:after{opacity:.75;transform:scaleX(1);}',
      '.bw-blog-mini-nav-link-active{background:#FFF9B8;border-color:#FFE600;color:#1B5E20;font-weight:900;}',
      '.bw-blog-mini-nav-link-active:after{opacity:1;transform:scaleX(1);}',
      '.bw-blog-mini-nav-stuck .bw-blog-mini-nav-inner{left:var(--bw-blog-mini-nav-left,24px);position:fixed;top:88px;width:var(--bw-blog-mini-nav-width,calc(100vw - 48px));z-index:8998;}',
      '.bw-blog-mini-nav-stuck .bw-blog-mini-nav-content{padding:12px 16px;}',
      '.bw-blog-mini-nav-stuck .bw-blog-mini-nav-inner:before{height:4px;}',
      '.bw-blog-mini-nav-stuck .bw-blog-mini-nav-kicker,.bw-blog-mini-nav-stuck .bw-blog-mini-nav-deck{display:none;}',
      '.bw-blog-mini-nav-stuck .bw-blog-mini-nav-row{align-items:center;gap:14px;}',
      '.bw-blog-mini-nav-stuck .bw-blog-mini-nav-home{font-size:13px;min-height:34px;padding:0 18px;}',
      '.bw-blog-mini-nav-stuck .bw-blog-mini-nav-group{align-items:center;padding-top:0;}',
      '.bw-blog-mini-nav-stuck .bw-blog-mini-nav-label{font-size:10px;line-height:34px;}',
      '.bw-blog-mini-nav-stuck .bw-blog-mini-nav-list{gap:8px;}',
      '.bw-blog-mini-nav-stuck .bw-blog-mini-nav-link{font-size:12px;min-height:34px;padding:0 14px;}',
      '.bw-blog-mini-nav-stuck .bw-blog-mini-nav-link:after{bottom:5px;left:14px;right:14px;}',
      '@media (max-width:1100px){.bw-blog-mini-nav-content{padding:24px 26px 26px;}.bw-blog-mini-nav-row{gap:18px;}.bw-blog-mini-nav-group{align-items:flex-start;display:grid;flex:1 1 auto;gap:10px;grid-template-columns:auto minmax(0,1fr);}.bw-blog-mini-nav-list{gap:10px;}.bw-blog-mini-nav-link{font-size:13.5px;min-height:38px;padding:0 17px;}}',
      '@media (max-width:700px){.bw-blog-mini-nav{margin:0 0 26px;}.bw-blog-mini-nav-content{padding:22px 20px 24px;}.bw-blog-mini-nav-kicker{font-size:11px;letter-spacing:1.7px;}.bw-blog-mini-nav-deck{font-size:15px;margin-bottom:20px;}.bw-blog-mini-nav-row{display:block;}.bw-blog-mini-nav-home{display:flex;min-height:44px;width:100%;}.bw-blog-mini-nav-group{display:block;padding-top:24px;}.bw-blog-mini-nav-label{display:block;font-size:11px;line-height:1;margin:0 0 12px;}.bw-blog-mini-nav-list{display:grid;gap:10px;grid-template-columns:repeat(2,minmax(0,1fr));}.bw-blog-mini-nav-link{display:flex;font-size:13px;min-height:42px;padding:0 10px;white-space:normal;}.bw-blog-mini-nav-link:after{bottom:7px;left:18px;right:18px;}.bw-blog-mini-nav-stuck .bw-blog-mini-nav-inner{left:12px;top:66px;width:calc(100vw - 24px);}.bw-blog-mini-nav-stuck .bw-blog-mini-nav-content{padding:10px 12px 12px;}.bw-blog-mini-nav-stuck .bw-blog-mini-nav-home{font-size:13px;min-height:36px;}.bw-blog-mini-nav-stuck .bw-blog-mini-nav-group{padding-top:10px;}.bw-blog-mini-nav-stuck .bw-blog-mini-nav-list{gap:8px;}.bw-blog-mini-nav-stuck .bw-blog-mini-nav-link{font-size:12px;min-height:34px;padding:0 8px;}.bw-blog-mini-nav-stuck .bw-blog-mini-nav-label{display:none;}}',
      '@media (max-width:1023px){.bw-blog-sidebar{display:none!important;}}'
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

  function createSidebar(items) {
    var aside = document.createElement('aside');
    aside.setAttribute(MARKER, '1');
    aside.className = 'bw-blog-sidebar';
    aside.setAttribute('aria-label', 'On this page');

    var links = items.map(function (item) {
      return '<li><a class="bw-blog-sidebar-link" data-level="' + item.level + '" href="#' + item.id + '">' + escapeHtml(item.text) + '</a></li>';
    }).join('');

    aside.innerHTML =
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
    if (!bounds || stickyY < bounds.start - 12 || stickyY > bounds.end - 24) {
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
    if (cleanupMiniNav) {
      cleanupMiniNav();
      cleanupMiniNav = null;
    }
    var old = document.querySelector('[' + MARKER + ']');
    if (old) old.remove();
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

  function findMiniNavAnchor(body) {
    var title = findPostTitle();
    if (title && title.parentNode) return title;
    if (!body) return null;
    // Try increasingly broad ancestors; some Wix templates wrap differently.
    var candidates = [
      body.closest('article'),
      body.closest('[data-hook="post-page"]'),
      body.closest('[data-hook="post-main"]'),
      body.closest('main'),
      document.querySelector('[data-hook="post-page"]'),
      document.querySelector('[data-hook="post-header"]'),
      document.querySelector('article'),
      document.querySelector('main')
    ];
    for (var i = 0; i < candidates.length; i++) {
      if (candidates[i] && candidates[i].parentNode) return candidates[i];
    }
    // Last-resort fallback: insert at top of body so the nav is never silently lost.
    return body;
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

  function renderMiniNavLinks() {
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
      var cls = 'bw-blog-mini-nav-link' + (link[0] === active ? ' bw-blog-mini-nav-link-active' : '');
      return '<a class="' + cls + '" href="' + link[2] + '" target="_top">' + escapeHtml(link[1]) + '</a>';
    }).join('');
  }

  function installMiniNavSticky(nav, body) {
    if (!nav || !body || cleanupMiniNav) return;
    var lastY = window.scrollY || window.pageYOffset || 0;
    var ticking = false;

    function syncVars() {
      var wasStuck = nav.classList.contains('bw-blog-mini-nav-stuck');
      if (wasStuck) nav.classList.remove('bw-blog-mini-nav-stuck');
      nav.style.minHeight = '';
      var rect = nav.getBoundingClientRect();
      var width = Math.max(280, Math.round(rect.width));
      var left = Math.max(12, Math.round(rect.left));
      var height = Math.round(nav.offsetHeight || rect.height || 0);
      nav.style.setProperty('--bw-blog-mini-nav-left', left + 'px');
      nav.style.setProperty('--bw-blog-mini-nav-width', width + 'px');
      if (height) nav.style.minHeight = height + 'px';
      if (wasStuck) nav.classList.add('bw-blog-mini-nav-stuck');
    }

    function update() {
      ticking = false;
      var y = window.scrollY || window.pageYOffset || 0;
      var rect = nav.getBoundingClientRect();
      var navTop = rect.top + y;
      var navBottom = navTop + (nav.offsetHeight || rect.height || 0);
      var bounds = getBodyBounds(body);
      var goingUp = y < lastY - 4;
      var farEnough = y > navBottom + 120;
      var beforeEnd = !bounds || y < bounds.end - 260;
      if (goingUp && farEnough && beforeEnd) {
        syncVars();
        nav.classList.add('bw-blog-mini-nav-stuck');
      } else if (y <= navBottom + 80 || y > lastY + 2 || !beforeEnd) {
        nav.classList.remove('bw-blog-mini-nav-stuck');
      }
      lastY = y;
    }

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    function onResize() {
      nav.classList.remove('bw-blog-mini-nav-stuck');
      syncVars();
      requestUpdate();
    }

    syncVars();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    cleanupMiniNav = function () {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', onResize);
      nav.classList.remove('bw-blog-mini-nav-stuck');
      nav.style.minHeight = '';
    };
  }

  function injectMiniNav(body) {
    if (document.querySelector('[' + NAV_MARKER + ']')) return;
    var anchor = findMiniNavAnchor(body);
    if (!anchor) return;
    var nav = document.createElement('nav');
    nav.className = 'bw-blog-mini-nav';
    nav.setAttribute(NAV_MARKER, '1');
    nav.setAttribute('aria-label', 'Blog navigation');
    nav.innerHTML =
      '<div class="bw-blog-mini-nav-inner">' +
        '<div class="bw-blog-mini-nav-content">' +
          '<p class="bw-blog-mini-nav-kicker">Browse the blog</p>' +
          '<p class="bw-blog-mini-nav-deck">Fresh Berlin guides, route stories, and practical travel notes.</p>' +
          '<div class="bw-blog-mini-nav-row">' +
            '<a class="bw-blog-mini-nav-home" href="https://www.berlinwalk.com/blog" target="_top">Blog Home</a>' +
            '<div class="bw-blog-mini-nav-group">' +
              '<span class="bw-blog-mini-nav-label">Categories</span>' +
              '<div class="bw-blog-mini-nav-list">' + renderMiniNavLinks() + '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    if (anchor.tagName && anchor.tagName.toLowerCase() === 'h1' && anchor.parentNode) {
      anchor.parentNode.insertBefore(nav, anchor);
    } else if (anchor.parentNode && anchor !== document.body) {
      anchor.parentNode.insertBefore(nav, anchor);
    } else {
      document.body.insertBefore(nav, document.body.firstChild);
    }
    installMiniNavSticky(nav, body);
  }

  function compactFloatingCta() {
    var desktopLabel = document.querySelector('#bw-desktop-cta .bw-label-big');
    if (desktopLabel && cleanText(desktopLabel.textContent) !== 'Book Now') {
      desktopLabel.textContent = 'Book Now';
    }
    var stickyBtn = document.querySelector('#bw-sticky-cta .bw-btn');
    if (stickyBtn && cleanText(stickyBtn.textContent) !== 'Book Now') {
      stickyBtn.textContent = 'Book Now';
    }
  }

  function inject() {
    if (!isPostPage()) {
      removeSidebar();
      return false;
    }
    var body = findPostBody();
    if (!body) return false;
    injectStyle();
    injectMiniNav(body);
    compactFloatingCta();
    var items = collectHeadings(body);
    if (items.length < 2) return false;

    removeSidebar();
    injectMiniNav(body);
    var sidebar = createSidebar(items);
    document.body.appendChild(sidebar);

    function refresh() {
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
    setTimeout(inject, 900);
    [1600, 2800, 4500].forEach(function (delay) {
      setTimeout(function () {
        if (!document.querySelector('[' + MARKER + ']')) inject();
      }, delay);
    });
    if (observer) observer.disconnect();
    observer = new MutationObserver(function () {
      if (!isPostPage()) return;
      compactFloatingCta();
      if (!document.querySelector('[' + NAV_MARKER + ']')) scheduleInject();
      if (!document.querySelector('[' + MARKER + ']')) scheduleInject();
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
      removeSidebar();
      bootForCurrentPage();
    }
  }, 300);
})();
