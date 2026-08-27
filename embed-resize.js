/* embed-resize.js — auto-height for BerlinWalk widgets on third-party sites.
 *
 * Listens for { type: 'bw-resize', height: N } postMessage events from any
 * BerlinWalk widget iframe (brand.js inside the widget posts these whenever
 * its content reflows) and resizes the matching iframe to fit. The iframe
 * must carry the `data-bw-frame` attribute, which the gallery's copy-paste
 * snippet adds automatically.
 *
 * Multiple widgets on the same page work because we match the message source
 * (e.source) against each iframe's contentWindow. Inline scripts are not
 * required; one external <script> tag handles every widget on the page.
 */
(function () {
  if (typeof window === 'undefined') return;

  function resizeFromMessage(event) {
    var data = event && event.data;
    if (!data || data.type !== 'bw-resize' || typeof data.height !== 'number') return;
    var iframes = document.querySelectorAll('iframe[data-bw-frame]');
    for (var i = 0; i < iframes.length; i++) {
      if (iframes[i].contentWindow === event.source) {
        // Small buffer to avoid scrollbars from sub-pixel rounding
        iframes[i].style.height = (data.height + 4) + 'px';
        return;
      }
    }
  }

  window.addEventListener('message', resizeFromMessage, false);
})();
