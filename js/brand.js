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

  // Catch late-loading fonts and images
  setTimeout(reportThrottled, 500);
  setTimeout(reportThrottled, 1500);
})();
