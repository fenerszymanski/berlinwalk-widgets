/* brand.js — common runtime for all BerlinWalk widgets
 *
 * Reports content height to the Wix parent so the surrounding HtmlComponent
 * can auto-resize to fit. The parent listens for { type: 'bw-resize', height: N }
 * messages (via Wix Custom Code) and resizes the iframe + its wrappers.
 *
 * IMPORTANT: We must NOT measure document.documentElement.scrollHeight or body
 * heights, because those grow to match the iframe's outer size — which causes
 * a feedback loop (parent grows iframe → html grows → we report bigger → parent
 * grows iframe again → infinite). Instead we measure the bottom edge of body's
 * direct children, which reflects actual widget content regardless of the
 * iframe's outer dimensions.
 */
(function () {
  if (window.parent === window) return; // not embedded — do nothing

  try {
    var params = new URLSearchParams(window.location.search);
    if (params.get('resize') === 'none' || params.get('autoresize') === 'none') return;
  } catch (e) { /* old browser, proceed with resize reporting */ }

  var lastReported = 0;
  var pending = false;

  function contentHeight() {
    var body = document.body;
    if (!body || !body.children || !body.children.length) return 0;
    var max = 0;
    for (var i = 0; i < body.children.length; i++) {
      var child = body.children[i];
      // Fixed overlays such as modal-style image credits must not influence
      // the iframe's reported content height when they are opened.
      if (child.hasAttribute && child.hasAttribute('data-bw-resize-ignore')) continue;
      var rect = child.getBoundingClientRect();
      // getBoundingClientRect ignores margins — add them so iframe doesn't clip
      var cs = window.getComputedStyle ? window.getComputedStyle(child) : null;
      var marginBottom = cs ? (parseFloat(cs.marginBottom) || 0) : 0;
      var bottom = rect.bottom + marginBottom;
      if (bottom > max) max = bottom;
    }
    return Math.ceil(max);
  }

  function reportNow() {
    var h = contentHeight();
    // Skip tiny drift (sub-pixel rendering, font hinting) to avoid loops
    if (h > 0 && Math.abs(h - lastReported) > 2) {
      lastReported = h;
      try {
        window.parent.postMessage({ type: 'bw-resize', height: h }, '*');
      } catch (e) { /* parent unreachable, ignore */ }
    }
  }

  function reportThrottled() {
    if (pending) return;
    pending = true;
    (window.requestAnimationFrame || function (cb) { setTimeout(cb, 16); })(function () {
      pending = false;
      reportNow();
    });
  }

  // Initial reports
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', reportThrottled);
  } else {
    reportThrottled();
  }
  window.addEventListener('load', reportThrottled);

  // Re-report when widget content changes (clicks, expand/collapse, dynamic).
  // Observe the BODY, not documentElement — the latter grows with iframe size.
  if (typeof ResizeObserver !== 'undefined') {
    try { new ResizeObserver(reportThrottled).observe(document.body); } catch (e) {}
  }

  // Re-measure after user interactions (calculator buttons, accordion, etc.)
  document.addEventListener('click', function () {
    setTimeout(reportThrottled, 50);
    setTimeout(reportThrottled, 250);
  }, true);

  document.addEventListener('input', function () {
    setTimeout(reportThrottled, 50);
    setTimeout(reportThrottled, 250);
  }, true);

  document.addEventListener('change', function () {
    setTimeout(reportThrottled, 50);
    setTimeout(reportThrottled, 250);
  }, true);

  // Catch late-loading fonts and images
  setTimeout(reportThrottled, 500);
  setTimeout(reportThrottled, 1500);
  setTimeout(reportThrottled, 3000);
})();

/* Attribution badge — injects a "by berlinwalk.com" footer link into every
 * widget so embeds on third-party sites carry our branding + backlink. Skipped
 * when ?attribution=none is in the URL (used by gallery preview iframes that
 * don't need a second badge). The first-party BerlinTools shell also passes
 * ?surface=tool-page, which keeps resize reporting but removes the widget-level
 * badge and booking CTA so the parent page owns the single conversion surface.
 * Runs in both standalone and iframe contexts.
 */
(function () {
  var BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
  var nextTourSlotRequested = false;
  var params = null;
  var isToolPageSurface = false;

  try {
    params = new URLSearchParams(window.location.search);
    isToolPageSurface = params.get('surface') === 'tool-page' && window.parent !== window;
  } catch (e) { /* old browser, proceed */ }

  if (isToolPageSurface) {
    try {
      document.documentElement.setAttribute('data-bw-surface', 'tool-page');
    } catch (e) {}
    return;
  }

  if (params && params.get('attribution') === 'none') return;

  function resolveAdjacentScriptUrl(fileName) {
    try {
      if (document.currentScript && document.currentScript.src) {
        return new URL(fileName, document.currentScript.src).toString();
      }
    } catch (e) {}
    return 'https://fenerszymanski.github.io/berlinwalk-widgets/js/' + fileName;
  }

  var NEXT_TOUR_SLOT_URL = resolveAdjacentScriptUrl('next-tour-slot.js');

  function widgetSlug() {
    var path = (window.location.pathname || '').replace(/\/(index\.html?)?$/, '');
    var parts = path.split('/').filter(Boolean);
    return parts[parts.length - 1] || 'unknown';
  }

  function isFirstPartyEmbed() {
    try {
      var params = new URLSearchParams(window.location.search);
      if (params.get('host') === 'berlinwalk') return true;
    } catch (e) {}
    try {
      if (!document.referrer) return false;
      var refHost = new URL(document.referrer).hostname.toLowerCase();
      return refHost === 'www.berlinwalk.com'
        || refHost === 'berlinwalk.com'
        || refHost.endsWith('.berlinwalk.com');
    } catch (e) {
      return false;
    }
  }

  function badgeUrl(slug) {
    return 'https://www.berlinwalk.com/'
      + '?utm_source=embed&utm_medium=widget'
      + '&utm_campaign=' + encodeURIComponent(slug)
      + '&utm_content=footer-badge';
  }

  function bookingUrl(slug) {
    var url = new URL(BOOKING_URL);
    url.searchParams.set('utm_source', 'berlinwalk');
    url.searchParams.set('utm_medium', 'widget_tour_cta');
    url.searchParams.set('utm_campaign', 'widget_tour_cta');
    url.searchParams.set('utm_content', slug + '_widget_nextslot');
    return url.toString();
  }

  function badgeNode(slug, extraClass, target) {
    var a = document.createElement('a');
    a.className = 'bw-attr-badge' + (extraClass ? ' ' + extraClass : '');
    a.href = badgeUrl(slug);
    a.target = target || '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', 'Made by BerlinWalk — open berlinwalk.com');
    a.innerHTML =
      '<img class="bw-attr-logo" alt="" style="width:18px;height:18px;border-radius:50%;object-fit:cover;display:block;flex:0 0 18px" src="https://static.wixstatic.com/media/5a08a3_4d96e164d26241fd9eb009843ec2084a~mv2.png" loading="lazy" decoding="async">' +
      '<span class="bw-attr-text">by <strong>berlinwalk.com</strong></span>' +
      '<span class="bw-attr-arrow" aria-hidden="true">&rarr;</span>';
    return a;
  }

  function injectBadgeOnly() {
    if (document.querySelector('.bw-attr-badge')) return;
    var slug = widgetSlug();
    document.body.appendChild(badgeNode(slug));
  }

  function readNextTourSlot() {
    try {
      if (typeof window.bwNextTourSlot === 'function') return window.bwNextTourSlot();
    } catch (e) {}
    return null;
  }

  function ensureNextTourSlotHelper(done, fail) {
    if (typeof window.bwNextTourSlot === 'function') {
      if (done) done();
      return;
    }
    if (nextTourSlotRequested) return;
    nextTourSlotRequested = true;
    var script = document.createElement('script');
    script.src = NEXT_TOUR_SLOT_URL;
    script.async = true;
    script.onload = function () {
      if (done) done();
    };
    script.onerror = function () {
      if (fail) fail();
    };
    document.head.appendChild(script);
  }

  function tourCtaText(slot) {
    if (slot && slot.relativeLabel && slot.slotsLabel) {
      return 'Next free Berlin walk' + (slot.slotCount > 1 ? 's' : '') + ': ' + slot.relativeLabel + ' ' + slot.slotsLabel;
    }
    return '';
  }

  function injectFirstPartyTourCta() {
    var slug = widgetSlug();
    var slot = readNextTourSlot();
    var text = tourCtaText(slot);
    if (!text) {
      injectBadgeOnly();
      return;
    }
    renderFirstPartyTourCta(slug, text);
    updateFirstPartyTourCtaFromLiveAvailability();
  }

  function renderFirstPartyTourCta(slug, text) {
    var existing = document.querySelector('.bw-tour-cta-row');
    if (existing) {
      var existingText = existing.querySelector('.bw-tour-cta-text');
      if (existingText && existingText.textContent !== text) existingText.textContent = text;
      return;
    }
    var row = document.createElement('div');
    row.className = 'bw-tour-cta-row';
    row.innerHTML =
      '<a class="bw-tour-cta-link" href="' + bookingUrl(slug) + '" target="_top" rel="noopener">\
        <span class="bw-tour-cta-text">' + text + '</span>\
      </a>';
    row.appendChild(badgeNode(slug, 'bw-attr-badge-inline', '_top'));
    document.body.appendChild(row);
  }

  function updateFirstPartyTourCtaFromLiveAvailability() {
    try {
      if (typeof window.bwLiveNextTourSlot !== 'function') return;
      window.bwLiveNextTourSlot({ days: 60 }).then(function (liveSlot) {
        var text = tourCtaText(liveSlot);
        var textNode = text && document.querySelector('.bw-tour-cta-row .bw-tour-cta-text');
        if (textNode && textNode.textContent !== text) textNode.textContent = text;
      });
    } catch (e) {}
  }

  function inject() {
    if (!isFirstPartyEmbed()) {
      injectBadgeOnly();
      return;
    }
    ensureNextTourSlotHelper(injectFirstPartyTourCta, injectBadgeOnly);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
