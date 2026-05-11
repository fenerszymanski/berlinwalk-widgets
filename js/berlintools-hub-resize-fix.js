/* BerlinTools hub resize fix for the Wix /berlin-tools page.
 *
 * The hub iframe posts { type: 'bw-resize', height } from brand.js. Wix Studio's
 * embed component can still keep a large aspect-ratio box around the iframe, so
 * this page-level script shrinks the embed component and section to the real
 * widget height.
 */
(function () {
  var path = window.location.pathname.replace(/\/+$/, '');
  if (path !== '/berlin-tools') return;
  if (window.__berlinToolsHubResizeFix) return;
  window.__berlinToolsHubResizeFix = true;

  var WIDGET_SRC = 'fenerszymanski.github.io/berlinwalk-widgets/tools-hub';
  var EXTRA_SPACE = 8;

  function isValidHeight(value) {
    return typeof value === 'number' && isFinite(value) && value > 0 && value < 8000;
  }

  function setPx(element, property, value) {
    if (!element || !element.style) return;
    element.style.setProperty(property, Math.ceil(value) + 'px', 'important');
  }

  function setAutoAspect(element) {
    if (!element || !element.style) return;
    element.style.setProperty('aspect-ratio', 'auto', 'important');
    element.style.setProperty('max-height', 'none', 'important');
  }

  function isHubIframe(iframe) {
    var src = iframe && (iframe.getAttribute('src') || iframe.getAttribute('data-src') || '');
    return src.indexOf(WIDGET_SRC) !== -1;
  }

  function findSourceIframe(event) {
    var iframes = document.querySelectorAll('iframe');
    for (var i = 0; i < iframes.length; i++) {
      if (iframes[i].contentWindow === event.source) return iframes[i];
    }
    for (var j = 0; j < iframes.length; j++) {
      if (isHubIframe(iframes[j])) return iframes[j];
    }
    return null;
  }

  function resizeHub(iframe, widgetHeight) {
    if (!iframe || !isHubIframe(iframe)) return;

    var height = Math.ceil(widgetHeight + EXTRA_SPACE);
    setAutoAspect(iframe);
    setPx(iframe, 'height', height);
    setPx(iframe, 'min-height', height);

    var section = iframe.closest ? iframe.closest('section') : document.getElementById('comp-mp0cm5ed');
    var embed = iframe.closest ? iframe.closest('#comp-mp0cms78') : document.getElementById('comp-mp0cms78');
    if (!embed) embed = document.getElementById('comp-mp0cms78');
    if (!section) section = document.getElementById('comp-mp0cm5ed');

    var node = iframe.parentElement;
    var depth = 0;
    while (node && node !== section && depth < 8) {
      setAutoAspect(node);
      setPx(node, 'height', height);
      setPx(node, 'min-height', height);
      node = node.parentElement;
      depth++;
    }

    if (embed) {
      setAutoAspect(embed);
      setPx(embed, 'height', height);
      setPx(embed, 'min-height', height);
    }

    if (section) {
      var iframeRect = iframe.getBoundingClientRect();
      var sectionRect = section.getBoundingClientRect();
      var topInsideSection = Math.max(0, iframeRect.top - sectionRect.top);
      var sectionHeight = topInsideSection + height;

      setAutoAspect(section);
      setPx(section, 'height', sectionHeight);
      setPx(section, 'min-height', sectionHeight);

      var content = section.querySelector('[data-testid="responsive-container-content"]');
      if (content) {
        setAutoAspect(content);
        setPx(content, 'height', sectionHeight);
        setPx(content, 'min-height', sectionHeight);
      }
    }
  }

  window.addEventListener('message', function (event) {
    if (!event.data || event.data.type !== 'bw-resize' || !isValidHeight(event.data.height)) return;
    resizeHub(findSourceIframe(event), event.data.height);
  });

  window.addEventListener('load', function () {
    setTimeout(function () {
      var iframe = Array.prototype.find.call(document.querySelectorAll('iframe'), isHubIframe);
      if (iframe) resizeHub(iframe, iframe.getBoundingClientRect().height || 1);
    }, 800);
  });
})();
