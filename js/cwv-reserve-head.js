(function () {
  var route = window.location.pathname.replace(/\/+$/, '') || '/';
  var routeClass = {
    '/berlin-tools': 'bw-cwv-tools',
    '/games': 'bw-cwv-games',
    '/meeting-point': 'bw-cwv-meeting',
    '/berlin-walking-tour-route': 'bw-cwv-route',
    '/widgets': 'bw-cwv-widgets'
  }[route];

  if (!routeClass || document.getElementById('bw-cwv-reserve-external-css')) return;

  document.documentElement.classList.add('bw-cwv-reserve-external', routeClass);

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

  addLink('preconnect', 'https://fenerszymanski.github.io', { crossorigin: '' });
  if (route === '/meeting-point') {
    addLink('preload', 'https://fenerszymanski.github.io/berlinwalk-widgets/gallery/images/06-1200w.webp', {
      as: 'image',
      fetchpriority: 'high'
    });
  }
  if (route === '/berlin-walking-tour-route') {
    addLink('preload', 'https://fenerszymanski.github.io/berlinwalk-widgets/gallery/images/06-1600w.webp', {
      as: 'image',
      fetchpriority: 'high'
    });
  }

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
    'html.bw-cwv-tools #comp-mp3h6ahr,html.bw-cwv-games #comp-mqrk2nfy,',
    'html.bw-cwv-meeting #comp-mpbnyd6v,html.bw-cwv-widgets #comp-mp9s5n32,html.bw-cwv-route #comp-mpljz1bj{',
    'align-self:start!important;justify-self:center!important;margin-top:0!important}',
    '}'
  ].join('');
  appendToHead(style);
})();
