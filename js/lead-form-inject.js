/* lead-form-inject.js — auto-injects the BerlinWalk booking calendar into every
 * blog post body. Loaded site-wide via Wix Custom Code.
 *
 * Wix's blog post body is rendered by React. A naive one-shot injection gets
 * removed on the next reconciliation (the card appears for ~1s and is then
 * yanked out as "an element React didn't render"). This script handles that:
 *
 *   1. Waits a moment for React to hydrate before the first attempt.
 *   2. Uses a MutationObserver to detect when our card disappears and
 *      re-injects it (debounced).
 *   3. Caps total re-injections so we don't infinite-loop if Wix is hostile.
 *   4. Re-runs everything on SPA navigation between posts.
 */
(function () {
  var CALENDAR_SCRIPT_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/booking-calendar/booking-calendar-element.js';
  var BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
  var MARKER = 'data-bw-blog-booking';
  var STYLE_ID = 'bw-blog-booking-inject-style';
  var SCRIPT_MARKER = 'data-bw-booking-calendar-script';
  var LOG = '[BW blog booking]';
  var MAX_REINJECTS = 12;
  var REINJECT_DEBOUNCE_MS = 400;

  var injections = 0;
  var reinjectTimer = null;
  var observer = null;
  var lastPath = location.pathname;

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
    // Skip anchors trapped inside collapsed Wix sections (display:none).
    while (el && el !== document.body && el.nodeType === 1) {
      var s = window.getComputedStyle(el);
      if (s.display === 'none' || s.visibility === 'hidden') return false;
      el = el.parentElement;
    }
    return true;
  }

  function findInsertionAnchor(body) {
    // Use only visible H2s — a heading inside a hidden Wix section means
    // our injection also hides.
    var allHeadings = body.querySelectorAll('h2');
    var headings = [];
    for (var hi = 0; hi < allHeadings.length; hi++) {
      if (isVisible(allHeadings[hi])) headings.push(allHeadings[hi]);
    }
    if (headings.length >= 3) {
      var heading = headings[Math.floor(headings.length / 2)];
      var node = heading.nextElementSibling;
      while (node) {
        var tag = (node.tagName || '').toUpperCase();
        if (tag === 'H2' || tag === 'H3') break;
        if (tag === 'P' && isVisible(node)) return node;
        node = node.nextElementSibling;
      }
      return heading;
    }
    if (headings.length > 0) return headings[Math.floor(headings.length / 2)];
    var paragraphs = body.querySelectorAll('p');
    var visibleP = [];
    for (var pi = 0; pi < paragraphs.length; pi++) {
      if (isVisible(paragraphs[pi])) visibleP.push(paragraphs[pi]);
    }
    if (visibleP.length >= 4) return visibleP[Math.floor(visibleP.length / 2)];
    return null;
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '.bw-blog-booking-card{box-sizing:border-box;margin:34px 0;max-width:100%;min-width:0;padding:18px;background:#FAFAF5;border:1px solid #CFE4C8;border-left:8px solid #1B5E20;border-radius:14px;box-shadow:0 14px 34px rgba(27,94,32,.11);font-family:Montserrat,Arial,sans-serif;color:#212121;}',
      '.bw-blog-booking-card *{box-sizing:border-box;}',
      '.bw-blog-booking-grid{display:grid;grid-template-columns:minmax(0,.9fr) minmax(280px,1.1fr);gap:18px;align-items:start;min-width:0;}',
      '.bw-blog-booking-copy{min-width:0;}',
      '.bw-blog-booking-kicker{display:inline-flex;align-items:center;gap:6px;margin:0 0 8px;color:#1B5E20;font-size:12px;font-weight:900;letter-spacing:.12em;line-height:1;text-transform:uppercase;}',
      '.bw-blog-booking-title{margin:0 0 9px;color:#1B5E20;font-size:28px;font-weight:900;line-height:1.08;letter-spacing:0;}',
      '.bw-blog-booking-text{margin:0;color:#4E5A4E;font-size:16px;font-weight:500;line-height:1.5;}',
      '.bw-blog-booking-facts{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0 0;padding:0;list-style:none;}',
      '.bw-blog-booking-facts li{border:1px solid #DCE3DD;border-radius:999px;background:#fff;color:#1B5E20;font-size:12px;font-weight:800;line-height:1;padding:8px 10px;white-space:nowrap;}',
      '.bw-blog-booking-panel{min-width:0;}',
      '.bw-blog-booking-card .bw-cal-next-note{display:none;}',
      '.bw-blog-booking-note{margin:10px 0 0;color:#4E5A4E;font-size:13px;font-weight:600;line-height:1.4;}',
      '.bw-blog-booking-fallback{display:none;margin-top:10px;}',
      '.bw-blog-booking-fallback a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:12px 18px;border-radius:999px;background:#FFE600;color:#1B5E20;font-weight:900;text-decoration:none;}',
      '.bw-blog-booking-card.is-calendar-error .bw-blog-booking-fallback{display:block;}',
      '@media(max-width:760px){.bw-blog-booking-card{margin:28px 0;padding:14px;border-left-width:6px;border-radius:12px;}.bw-blog-booking-grid{grid-template-columns:1fr;gap:14px;}.bw-blog-booking-title{font-size:24px;}.bw-blog-booking-text{font-size:15px;}.bw-blog-booking-facts li{font-size:11px;}}'
    ].join('');
    document.head.appendChild(style);
  }

  function ensureCalendarScript(wrapper) {
    if (window.customElements && window.customElements.get && window.customElements.get('bw-booking-calendar')) return;
    if (document.querySelector('script[' + SCRIPT_MARKER + ']')) return;
    var script = document.createElement('script');
    script.src = CALENDAR_SCRIPT_URL;
    script.async = true;
    script.setAttribute(SCRIPT_MARKER, '1');
    script.onerror = function () {
      if (wrapper) wrapper.classList.add('is-calendar-error');
      console.warn(LOG, 'calendar script failed to load');
    };
    document.head.appendChild(script);
  }

  function buildBookingCard() {
    ensureStyles();

    var wrapper = document.createElement('section');
    wrapper.setAttribute(MARKER, '1');
    wrapper.className = 'bw-blog-booking-card';
    wrapper.setAttribute('aria-label', 'Book the BerlinWalk walking tour');

    wrapper.innerHTML = [
      '<div class="bw-blog-booking-grid">',
      '  <div class="bw-blog-booking-copy">',
      '    <p class="bw-blog-booking-kicker">BerlinWalk tour</p>',
      '    <h2 class="bw-blog-booking-title">Pick your walking tour date</h2>',
      '    <p class="bw-blog-booking-text">Join my free, tip-based Berlin walk from the World Clock at Alexanderplatz. Choose a date here, then finish the reservation on the next step.</p>',
      '    <ul class="bw-blog-booking-facts" aria-label="Tour facts">',
      '      <li>Free to book</li>',
      '      <li>Tip-based</li>',
      '      <li>~2h walk</li>',
      '    </ul>',
      '  </div>',
      '  <div class="bw-blog-booking-panel">',
      '    <bw-booking-calendar',
      '      service-title="Choose a tour date"',
      '      availability-days="120"',
      '      cta-label="Reserve your spot"',
      '      booking-url="' + BOOKING_URL + '">',
      '    </bw-booking-calendar>',
      '    <p class="bw-blog-booking-note">You will choose the number of guests on the next step. Booking is free; you tip at the end of the walk.</p>',
      '    <p class="bw-blog-booking-fallback"><a href="' + BOOKING_URL + '">Open booking page</a></p>',
      '  </div>',
      '</div>'
    ].join('');

    ensureCalendarScript(wrapper);
    return wrapper;
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

    var wrapper = buildBookingCard();

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
