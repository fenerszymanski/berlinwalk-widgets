/* cta-inject.js - deprecated compatibility shim.
 * Keep this tiny one-time cleanup until the old Wix Custom Code entry is
 * removed in the next controlled publish. Do not observe the full document.
 */
(function () {
  var MARKER = 'data-bw-tourcta';

  function removeOldCtas() {
    document.querySelectorAll('[' + MARKER + ']').forEach(function (node) {
      node.remove();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeOldCtas, { once: true });
  } else {
    removeOldCtas();
  }
})();
