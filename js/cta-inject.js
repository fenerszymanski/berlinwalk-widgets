/* cta-inject.js — auto-injects the BerlinWalk tour CTA at the end of every
 * blog post body. Loaded site-wide via Wix Custom Code.
 *
 * Same React-resistant pattern as lead-form-inject.js: wait for hydration,
 * inject, watch for removal, re-inject (capped). Self-skips non-post pages.
 */
(function () {
  var CTA_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/cta-tour/';
  var MARKER = 'data-bw-tourcta';
  var LOG = '[BW tour-cta]';
  var MAX_REINJECTS = 12;
  var REINJECT_DEBOUNCE_MS = 400;

  var injections = 0;
  var reinjectTimer = null;
  var observer = null;
  var lastPath = location.pathname;

  function isPostPage() { return location.pathname.indexOf('/post/') === 0; }

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

  function findInsertionAnchor(body) {
    // Insert at the very end of the post body — after the last <p>
    var paragraphs = body.querySelectorAll('p');
    if (paragraphs.length) return paragraphs[paragraphs.length - 1];
    return body.lastElementChild || null;
  }

  function inject() {
    if (!isPostPage()) return false;
    if (document.querySelector('[' + MARKER + ']')) return false;
    if (injections >= MAX_REINJECTS) {
      console.log(LOG, 'gave up after', MAX_REINJECTS, 'attempts');
      return false;
    }
    var body = findPostBody();
    if (!body) return false;
    var anchor = findInsertionAnchor(body);
    if (!anchor) return false;

    var wrapper = document.createElement('div');
    wrapper.setAttribute(MARKER, '1');
    wrapper.style.cssText = 'margin: 36px 0 8px; max-width: 100%;';

    var iframe = document.createElement('iframe');
    iframe.src = CTA_URL;
    iframe.title = 'Book the BerlinWalk free walking tour';
    iframe.setAttribute('height', '320');
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('loading', 'lazy');
    iframe.style.cssText = 'width: 100%; border: 0; display: block;';
    wrapper.appendChild(iframe);

    anchor.parentNode.insertBefore(wrapper, anchor.nextSibling);
    injections++;
    console.log(LOG, 'injected (attempt', injections + ')');
    return true;
  }

  function scheduleInject() {
    clearTimeout(reinjectTimer);
    reinjectTimer = setTimeout(inject, REINJECT_DEBOUNCE_MS);
  }

  function startObserving() {
    if (observer) observer.disconnect();
    observer = new MutationObserver(function () {
      if (!isPostPage()) return;
      if (injections >= MAX_REINJECTS) return;
      if (!document.querySelector('[' + MARKER + ']')) scheduleInject();
    });
    if (document.body) observer.observe(document.body, { childList: true, subtree: true });
  }

  function bootForCurrentPage() {
    injections = 0;
    setTimeout(function () {
      inject();
      startObserving();
    }, 800);
    [1500, 2500, 4000].forEach(function (delay) {
      setTimeout(function () {
        if (!document.querySelector('[' + MARKER + ']')) inject();
      }, delay);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootForCurrentPage);
  } else {
    bootForCurrentPage();
  }

  setInterval(function () {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      bootForCurrentPage();
    }
  }, 300);
})();
