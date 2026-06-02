/* cta-inject.js - deprecated.
 * The old end-of-post tour CTA duplicated the newer blog journey/recommended
 * cards, so this helper is now a no-op safety shim. Keep the file so old Wix
 * Custom Code URLs stop injecting the banner as soon as GitHub Pages updates.
 */
(function () {
  var MARKER = 'data-bw-tourcta';

  var observer = null;

  function removeOldCtas() {
    document.querySelectorAll('[' + MARKER + ']').forEach(function (node) {
      node.remove();
    });
  }

  function boot() {
    removeOldCtas();
    if (observer) observer.disconnect();
    observer = new MutationObserver(function () {
      removeOldCtas();
    });
    if (document.body) observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
