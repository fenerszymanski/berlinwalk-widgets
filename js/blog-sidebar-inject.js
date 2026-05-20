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
  var lastPath = location.pathname;
  var observer = null;
  var resizeTimer = null;
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
      '.bw-blog-sidebar{position:fixed;top:188px;width:236px;max-height:calc(100vh - 212px);z-index:9000;font-family:Montserrat,Arial,sans-serif;color:#212121;opacity:0;pointer-events:none;transition:opacity .18s ease,transform .18s ease;}',
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
      '.bw-blog-mini-nav{box-sizing:border-box;font-family:Montserrat,Arial,sans-serif;margin:0 0 24px;padding:0;width:100%;}',
      '.bw-blog-mini-nav-inner{align-items:center;border-bottom:1px solid rgba(27,94,32,.16);border-top:1px solid rgba(27,94,32,.10);display:flex;gap:10px;min-height:40px;overflow-x:auto;padding:7px 0;scrollbar-width:none;}',
      '.bw-blog-mini-nav-inner::-webkit-scrollbar{display:none;}',
      '.bw-blog-mini-nav-kicker{color:#6A746A;flex:0 0 auto;font-size:11px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;}',
      '.bw-blog-mini-nav-link{align-items:center;border:1px solid rgba(27,94,32,.18);border-radius:999px;color:#1B5E20;display:inline-flex;flex:0 0 auto;font-size:13px;font-weight:800;line-height:1;padding:9px 13px;text-decoration:none;white-space:nowrap;}',
      '.bw-blog-mini-nav-link:hover,.bw-blog-mini-nav-link:focus-visible{background:#FFE600;border-color:#FFE600;outline:0;}',
      '.bw-blog-mini-nav-link-primary{background:#1B5E20;border-color:#1B5E20;color:#FFFFFF;}',
      '.bw-blog-mini-nav-link-primary:hover,.bw-blog-mini-nav-link-primary:focus-visible{background:#FFE600;color:#1B5E20;}',
      '@media (max-width:700px){.bw-blog-mini-nav{margin:16px auto 14px;max-width:calc(100% - 28px);}.bw-blog-mini-nav-inner{gap:8px;}.bw-blog-mini-nav-kicker{display:none;}.bw-blog-mini-nav-link{font-size:12px;padding:8px 11px;}}',
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
        '<span class="bw-blog-mini-nav-kicker">Berlin Travel Notes</span>' +
        '<a class="bw-blog-mini-nav-link bw-blog-mini-nav-link-primary" href="https://www.berlinwalk.com/blog" target="_top">All articles</a>' +
        '<a class="bw-blog-mini-nav-link" href="https://www.berlinwalk.com/blog/categories/tourist-tips" target="_top">Tourist Tips</a>' +
        '<a class="bw-blog-mini-nav-link" href="https://www.berlinwalk.com/blog/categories/berlin-history" target="_top">Berlin History</a>' +
        '<a class="bw-blog-mini-nav-link" href="https://www.berlinwalk.com/berlin-tools" target="_top">Tools</a>' +
      '</div>';
    if (anchor.tagName && anchor.tagName.toLowerCase() === 'h1' && anchor.parentNode) {
      anchor.parentNode.insertBefore(nav, anchor);
    } else if (anchor.parentNode && anchor !== document.body) {
      anchor.parentNode.insertBefore(nav, anchor);
    } else {
      document.body.insertBefore(nav, document.body.firstChild);
    }
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
