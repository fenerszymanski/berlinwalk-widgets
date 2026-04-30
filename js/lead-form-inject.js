/* lead-form-inject.js — auto-injects the BerlinWalk lead-form widget into every
 * blog post body. Loaded site-wide via Wix Custom Code.
 *
 * Wix's blog post body is rendered by React. A naive one-shot injection gets
 * removed on the next reconciliation (the iframe appears for ~1s and is then
 * yanked out as "an element React didn't render"). This script handles that:
 *
 *   1. Waits a moment for React to hydrate before the first attempt.
 *   2. Uses a MutationObserver to detect when our iframe disappears and
 *      re-injects it (debounced).
 *   3. Caps total re-injections so we don't infinite-loop if Wix is hostile.
 *   4. Re-runs everything on SPA navigation between posts.
 */
(function () {
  var LEAD_FORM_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/lead-form/';
  var MARKER = 'data-bw-leadform';
  var LOG = '[BW lead-form]';
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
    var headings = body.querySelectorAll('h2');
    if (headings.length >= 3) {
      var heading = headings[Math.floor(headings.length / 2)];
      var node = heading.nextElementSibling;
      while (node) {
        var tag = (node.tagName || '').toUpperCase();
        if (tag === 'H2' || tag === 'H3') break;
        if (tag === 'P') return node;
        node = node.nextElementSibling;
      }
      return heading;
    }
    if (headings.length > 0) return headings[Math.floor(headings.length / 2)];
    var paragraphs = body.querySelectorAll('p');
    if (paragraphs.length >= 4) return paragraphs[Math.floor(paragraphs.length / 2)];
    return null;
  }

  function inject() {
    if (!isPostPage()) return false;
    if (document.querySelector('[' + MARKER + ']')) return false; // already there
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
    wrapper.style.cssText = 'margin: 32px 0; max-width: 100%;';

    var iframe = document.createElement('iframe');
    iframe.src = LEAD_FORM_URL;
    iframe.title = 'BerlinWalk newsletter signup';
    iframe.setAttribute('height', '320');
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('loading', 'lazy');
    iframe.style.cssText = 'width: 100%; border: 0; display: block;';
    wrapper.appendChild(iframe);

    anchor.parentNode.insertBefore(wrapper, anchor.nextSibling);
    injections++;
    console.log(LOG, 'injected (attempt', injections + ')', 'after', anchor.tagName);
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
      // If our marker isn't in the DOM, schedule a re-injection
      if (!document.querySelector('[' + MARKER + ']')) {
        scheduleInject();
      }
    });
    if (document.body) observer.observe(document.body, { childList: true, subtree: true });
  }

  function bootForCurrentPage() {
    injections = 0;
    // Wait for React to hydrate before the first attempt
    setTimeout(function () {
      inject();
      startObserving();
    }, 800);
    // A few extra explicit attempts during the first 5s, in case the body
    // appears late (slow networks / heavy hydration)
    [1500, 2500, 4000].forEach(function (delay) {
      setTimeout(function () {
        if (!document.querySelector('[' + MARKER + ']')) inject();
      }, delay);
    });
  }

  // Initial run
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootForCurrentPage);
  } else {
    bootForCurrentPage();
  }

  // Detect SPA navigation between posts
  setInterval(function () {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      bootForCurrentPage();
    }
  }, 300);
})();
