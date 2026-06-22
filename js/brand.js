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
 * don't need a second badge). Runs in both standalone and iframe contexts.
 */
(function () {
  try {
    var params = new URLSearchParams(window.location.search);
    if (params.get('attribution') === 'none') return;
  } catch (e) { /* old browser, proceed */ }

  // Skip badge when embedded on our own site — "by berlinwalk.com" on
  // berlinwalk.com is redundant and the 1.4MB PNG should not load at all on
  // internal pages. Third-party embeds (different parent origin) still get
  // the badge so external sites carry our branding + backlink.
  try {
    if (document.referrer) {
      var refHost = new URL(document.referrer).hostname.toLowerCase();
      if (refHost === 'www.berlinwalk.com'
          || refHost === 'berlinwalk.com'
          || refHost.endsWith('.berlinwalk.com')) {
        return;
      }
    }
  } catch (e) { /* if URL parse fails, fall through and show the badge */ }

  function widgetSlug() {
    var path = (window.location.pathname || '').replace(/\/(index\.html?)?$/, '');
    var parts = path.split('/').filter(Boolean);
    return parts[parts.length - 1] || 'unknown';
  }

  function inject() {
    if (document.querySelector('.bw-attr-badge')) return; // idempotent
    var slug = widgetSlug();
    var url = 'https://www.berlinwalk.com/'
      + '?utm_source=embed&utm_medium=widget'
      + '&utm_campaign=' + encodeURIComponent(slug)
      + '&utm_content=footer-badge';
    var a = document.createElement('a');
    a.className = 'bw-attr-badge';
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', 'Made by BerlinWalk — open berlinwalk.com');
    // Defensive inline sizing on the logo: if a widget ever ships without
    // brand.css linked, the unbounded 1.4MB PNG will not blow up the layout.
    a.innerHTML =
      '<img class="bw-attr-logo" alt="" style="width:18px;height:18px;border-radius:50%;object-fit:cover;display:block;flex:0 0 18px" src="https://static.wixstatic.com/media/5a08a3_4d96e164d26241fd9eb009843ec2084a~mv2.png" loading="lazy" decoding="async">' +
      '<span class="bw-attr-text">by <strong>berlinwalk.com</strong></span>' +
      '<span class="bw-attr-arrow" aria-hidden="true">&rarr;</span>';
    document.body.appendChild(a);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
