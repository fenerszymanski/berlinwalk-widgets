(function () {
  var route = window.location.pathname.replace(/\/+$/, '') || '/';
  var widgetOrigin = 'https://fenerszymanski.github.io';
  var widgetBase = widgetOrigin + '/berlinwalk-widgets/';
  var blogDataUrl = widgetBase + 'blog-index/data.json?v=20260619b';
  var routeClass = {
    '/berlin-tools': 'bw-cwv-tools',
    '/games': 'bw-cwv-games',
    '/meeting-point': 'bw-cwv-meeting',
    '/berlin-walking-tour-route': 'bw-cwv-route',
    '/widgets': 'bw-cwv-widgets'
  }[route];

  function appendToHead(node) {
    (document.head || document.documentElement).appendChild(node);
  }

  function addLink(rel, href, attrs) {
    var selector = 'link[rel="' + rel + '"][href="' + href + '"]';
    if ((document.head || document).querySelector(selector)) return;
    var link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        link.setAttribute(key, attrs[key]);
      });
    }
    appendToHead(link);
  }

  function preloadScript(src) {
    addLink('preload', src, { as: 'script' });
  }

  function preloadFetch(src) {
    addLink('preload', src, { as: 'fetch', crossorigin: 'anonymous' });
  }

  function preloadImage(src) {
    addLink('preload', src, {
      as: 'image',
      fetchpriority: 'high'
    });
  }

  function preloadBlogLeadImage() {
    fetch(blogDataUrl, { cache: 'force-cache' })
      .then(function (response) { return response.ok ? response.json() : null; })
      .then(function (data) {
        var image = data && data.hero && data.hero.lead && data.hero.lead.image;
        preloadImage(image);
      })
      .catch(function () {});
  }

  function installHints() {
    var hints = {
      '/berlin-tools': {
        scripts: ['tools-hub/tools-hub-element.js'],
        fetches: ['tools-hub/data.json?bwHubVersion=2026-06-29-museums-spotlight']
      },
      '/games': {
        scripts: ['games-page/games-page-element.js?v=games-page-retro-v2-20260623']
      },
      '/meeting-point': {
        scripts: ['meeting-point/meeting-point-element.js'],
        images: ['gallery/images/06-1200w.webp']
      },
      '/berlin-walking-tour-route': {
        scripts: ['route-story/route-story-element.js'],
        images: ['gallery/images/06-1600w.webp']
      },
      '/widgets': {
        scripts: ['widgets-hub/widgets-hub-element.js'],
        fetches: ['tools-hub/data.json']
      },
      '/blog': {
        scripts: ['blog-index/blog-index-element.js'],
        fetches: ['blog-index/data.json?v=20260619b'],
        blogLeadImage: true
      }
    }[route];

    if (!hints) return;
    addLink('preconnect', widgetOrigin, { crossorigin: '' });
    addLink('preconnect', 'https://static.wixstatic.com', { crossorigin: '' });
    (hints.scripts || []).forEach(function (src) { preloadScript(widgetBase + src); });
    (hints.fetches || []).forEach(function (src) { preloadFetch(widgetBase + src); });
    (hints.images || []).forEach(function (src) { preloadImage(widgetBase + src); });
    if (hints.blogLeadImage) preloadBlogLeadImage();
  }

  installHints();

  if (!routeClass || document.getElementById('bw-cwv-reserve-external-css')) return;

  document.documentElement.classList.add('bw-cwv-reserve-external', routeClass);

  var style = document.createElement('style');
  style.id = 'bw-cwv-reserve-external-css';
  style.textContent = [
    '@media (min-width:900px){',
    'html.bw-cwv-reserve-external{--bw-cwv-first-screen-reserve:max(620px,calc(100vh - 142px))}',
    'html.bw-cwv-tools #comp-mp3h654p,html.bw-cwv-tools #comp-mp3h6ahr,',
    'html.bw-cwv-games #comp-mqe2hccz,html.bw-cwv-games #comp-mqrk2nfy,',
    'html.bw-cwv-meeting #comp-mpbnpbye,html.bw-cwv-meeting #comp-mpbnyd6v,',
    'html.bw-cwv-widgets #comp-mp9s515e,html.bw-cwv-widgets #comp-mp9s5n32,',
    'html.bw-cwv-route #comp-mpljwtm6,html.bw-cwv-route #comp-mpljz1bj{',
    'height:auto!important;max-height:none!important;min-height:var(--bw-cwv-first-screen-reserve)!important}',
    'html.bw-cwv-tools #comp-mp3h654p .comp-mp3h654p-container,html.bw-cwv-tools #comp-mp3h654p .max-width-container,',
    'html.bw-cwv-games #comp-mqe2hccz .comp-mqe2hccz-container,html.bw-cwv-games #comp-mqe2hccz .max-width-container,',
    'html.bw-cwv-meeting #comp-mpbnpbye .comp-mpbnpbye-container,html.bw-cwv-meeting #comp-mpbnpbye .max-width-container,',
    'html.bw-cwv-widgets #comp-mp9s515e .comp-mp9s515e-container,html.bw-cwv-widgets #comp-mp9s515e .max-width-container,',
    'html.bw-cwv-route #comp-mpljwtm6 .comp-mpljwtm6-container,html.bw-cwv-route #comp-mpljwtm6 .max-width-container{',
    'align-content:start!important;align-items:start!important;grid-template-rows:auto!important;',
    'height:auto!important;max-height:none!important;min-height:var(--bw-cwv-first-screen-reserve)!important}',
    'html.bw-cwv-tools .bw-embed-cta,html.bw-cwv-tools .bw-hub-footer{display:none!important}',
    'html.bw-cwv-tools #comp-mp3h6ahr,html.bw-cwv-games #comp-mqrk2nfy,',
    'html.bw-cwv-meeting #comp-mpbnyd6v,html.bw-cwv-widgets #comp-mp9s5n32,html.bw-cwv-route #comp-mpljz1bj{',
    'align-self:start!important;justify-self:center!important;margin-top:0!important}',
    '}'
  ].join('');
  appendToHead(style);
})();
