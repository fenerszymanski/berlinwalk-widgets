/* Auto-generated lightweight FAQ JSON-LD loader - do not edit by hand. */
(function () {
  function currentPostSlug() {
    var parts = window.location.pathname.split('/').filter(Boolean);
    if (parts.length !== 2 || parts[0] !== 'post') return '';
    try { return decodeURIComponent(parts[1]); } catch (error) { return parts[1] || ''; }
  }

  function containsFaqPage(value) {
    if (!value || typeof value !== 'object') return false;
    if (Array.isArray(value)) return value.some(containsFaqPage);
    var type = value['@type'];
    if (type === 'FAQPage' || (Array.isArray(type) && type.indexOf('FAQPage') !== -1)) return true;
    return Array.isArray(value['@graph']) && value['@graph'].some(containsFaqPage);
  }

  function existingFaqSchema() {
    var scripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (var i = 0; i < scripts.length; i += 1) {
      try {
        if (containsFaqPage(JSON.parse(scripts[i].textContent || 'null'))) return true;
      } catch (error) {
        // Ignore unrelated malformed JSON-LD and keep checking the page.
      }
    }
    return false;
  }

  function injectSchema(schema) {
    if (!schema || document.getElementById('bw-faq-jsonld') || existingFaqSchema()) return;
    var script = document.createElement('script');
    script.id = 'bw-faq-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  var slug = currentPostSlug();
  if (!slug) return;

  var loaderScript = document.currentScript;
  var loaderUrl = loaderScript && loaderScript.src ? loaderScript.src : '';
  var dataBase = loaderUrl
    ? new URL('./data/', loaderUrl).href
    : 'https://fenerszymanski.github.io/berlinwalk-widgets/faq/data/';
  var version = '';
  try { version = loaderUrl ? new URL(loaderUrl).searchParams.get('v') || '' : ''; } catch (error) {}
  var dataUrl = dataBase + encodeURIComponent(slug) + '.json' + (version ? '?v=' + encodeURIComponent(version) : '');

  fetch(dataUrl, { cache: 'force-cache', credentials: 'omit' })
    .then(function (response) { return response.ok ? response.json() : null; })
    .then(function (payload) { if (payload && payload.schema) injectSchema(payload.schema); })
    .catch(function () {});
})();
