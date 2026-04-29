/* brand.js — common runtime for all BerlinWalk widgets
 *
 * Reports content height to the Wix parent so the surrounding HtmlComponent
 * can auto-resize to fit. Wix Velo listens for { type: 'bw-resize', height: N }
 * messages on its HtmlComponent and sets `c.height = N` accordingly.
 *
 * This script is fire-and-forget: if Velo isn't wired up on the parent side,
 * the messages are simply ignored — no visual side effect. Adding this script
 * to a widget is therefore non-breaking.
 */
(function () {
  if (window.parent === window) return; // not embedded — do nothing

  var lastReported = 0;
  var pending = false;

  function contentHeight() {
    var de = document.documentElement;
    var b = document.body;
    return Math.max(
      de ? de.scrollHeight : 0,
      de ? de.offsetHeight : 0,
      b ? b.scrollHeight : 0,
      b ? b.offsetHeight : 0
    );
  }

  function reportNow() {
    var h = contentHeight();
    if (h > 0 && h !== lastReported) {
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
  window.addEventListener('resize', reportThrottled);

  // Re-report when content changes (expand/collapse, dynamic widgets)
  if (typeof ResizeObserver !== 'undefined') {
    try { new ResizeObserver(reportThrottled).observe(document.documentElement); } catch (e) {}
  }

  // Catch late-loading fonts and images
  setTimeout(reportThrottled, 500);
  setTimeout(reportThrottled, 1500);
})();
