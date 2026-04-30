/* lead-form-inject.js — auto-injects the BerlinWalk lead-form widget into every
 * blog post body, around the middle of the post (after a mid-content H2's first
 * paragraph). Loaded site-wide via Wix Custom Code. Skips non-post pages and
 * avoids double-injection on SPA navigation between posts.
 *
 * Detection strategy: try several common Wix post-body selectors, fall back to
 * <article> / <main> if specific hooks aren't found. Prints the chosen selector
 * to the browser console (prefix [BW lead-form]) so you can verify in DevTools.
 */
(function () {
  var LEAD_FORM_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/lead-form/';
  var MARKER = 'data-bw-leadform';
  var LOG = '[BW lead-form]';

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
      if (el && el.querySelectorAll('p').length >= 3) {
        console.log(LOG, 'matched selector:', candidates[i]);
        return el;
      }
    }
    return null;
  }

  function findInsertionAnchor(body) {
    var headings = body.querySelectorAll('h2');
    if (headings.length >= 3) {
      var heading = headings[Math.floor(headings.length / 2)];
      // Walk forward to find the first <p> after this heading
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
    if (!isPostPage()) return;
    if (document.querySelector('[' + MARKER + ']')) return;
    var body = findPostBody();
    if (!body) { console.log(LOG, 'post body not found yet'); return; }
    var anchor = findInsertionAnchor(body);
    if (!anchor) { console.log(LOG, 'no anchor found — post too short'); return; }

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
    console.log(LOG, 'injected after', anchor.tagName, anchor.textContent.slice(0, 60));
  }

  function tryInjectRepeatedly() {
    var attempts = 0;
    var max = 24; // ~6 seconds at 250ms
    var timer = setInterval(function () {
      attempts++;
      inject();
      if (document.querySelector('[' + MARKER + ']') || attempts >= max) {
        clearInterval(timer);
      }
    }, 250);
  }

  // Initial run
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryInjectRepeatedly);
  } else {
    tryInjectRepeatedly();
  }

  // SPA navigation between posts
  var lastPath = location.pathname;
  setInterval(function () {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      tryInjectRepeatedly();
    }
  }, 300);
})();
