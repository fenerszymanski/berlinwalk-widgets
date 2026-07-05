/* exit-intent-popup.js - desktop-only BerlinWalk exit-intent popup.
 * Load sitewide via Wix Custom Code, body-end.
 */
(function () {
  var BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
  var HERO_IMAGE_URL = getImageUrl('hero');
  var SESSION_KEY = 'bw-exit-intent-triggered';
  var DESKTOP_MIN_WIDTH = 1024;
  var STYLE_ID = 'bw-exit-intent-styles';
  var OVERLAY_ID = 'bw-exit-intent-popup';
  var DWELL_TIME_MS = isPreviewForced() ? 500 : 30000;
  var TOUR_START_LABEL = '11:30';
  var SAME_DAY_CUTOFF_HOUR = 8;
  var SAME_DAY_CUTOFF_MINUTE = 30;
  var DAY_MS = 24 * 60 * 60 * 1000;
  var TOUR_DAYS = { Tue: true, Wed: true, Thu: true, Fri: true, Sat: true };

  var dwellReady = false;
  var popupShown = false;
  var currentStep = 1;
  var closeTracked = false;

  function getImageUrl(type) {
    var file = 'berlin-trip-planner-hero.jpg';

    if (/^(localhost|127\.0\.0\.1)$/.test(window.location.hostname)) {
      return 'ultimate-berlin-trip-planner/assets/' + file;
    }
    return 'https://fenerszymanski.github.io/berlinwalk-widgets/ultimate-berlin-trip-planner/assets/' + file;
  }

  function isPreviewForced() {
    var host = window.location.hostname;
    var isSafeHost = /^(localhost|127\.0\.0\.1)$/.test(host) ||
      host === 'www.berlinwalk.com' ||
      host === 'berlinwalk.com';
    return isSafeHost && (
      window.location.search.indexOf('forceExitPreview=1') !== -1 ||
      window.location.search.indexOf('bwExitPreview=1') !== -1
    );
  }

  function safeSessionGet(key) {
    try {
      return window.sessionStorage.getItem(key);
    } catch (err) {
      return null;
    }
  }

  function safeSessionSet(key, value) {
    try {
      window.sessionStorage.setItem(key, value);
    } catch (err) {}
  }

  function isExcludedPage() {
    var path = window.location.pathname.toLowerCase();
    return path.indexOf('/products/') === 0 ||
      path.indexOf('/book-berlin-walking-tour') === 0 ||
      path.indexOf('/berlin-trip-planner') === 0 ||
      path.indexOf('/thank-you') !== -1 ||
      path.indexOf('/thank_you') !== -1 ||
      path.indexOf('/booking-confirmation') !== -1 ||
      path.indexOf('/bookings-confirmation') !== -1;
  }

  function isDesktop() {
    return isPreviewForced() || window.innerWidth >= DESKTOP_MIN_WIDTH;
  }

  function shouldRun() {
    return isDesktop() && !isExcludedPage() && !safeSessionGet(SESSION_KEY);
  }

  function trackEvent(name, params) {
    var data = params || {};
    data.event_category = 'exit_intent_popup';
    data.page_path = window.location.pathname;
    data.page_url = window.location.href;
    data.popup_step = currentStep;
    data.preview_mode = isPreviewForced() ? 'true' : 'false';

    if (window.dataLayer && typeof window.dataLayer.push === 'function') {
      var layerData = {};
      for (var key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          layerData[key] = data[key];
        }
      }
      layerData.event = name;
      window.dataLayer.push(layerData);
    }

    if (typeof window.gtag === 'function') {
      window.gtag('event', name, data);
    }
  }

  function berlinParts(date) {
    var map = {};
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Berlin',
      weekday: 'short',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(date).forEach(function (part) {
      if (part.type !== 'literal') map[part.type] = part.value;
    });
    return {
      dateKey: map.year + '-' + map.month + '-' + map.day,
      weekdayShort: map.weekday,
      weekdayLabel: new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Berlin', weekday: 'long' }).format(date),
      hour: Number(map.hour),
      minute: Number(map.minute),
    };
  }

  function nextTourLine() {
    try {
      var now = new Date();
      var today = berlinParts(now);
      var tomorrow = berlinParts(new Date(now.getTime() + DAY_MS));
      var target = null;

      if (TOUR_DAYS[today.weekdayShort] && (today.hour < SAME_DAY_CUTOFF_HOUR || (today.hour === SAME_DAY_CUTOFF_HOUR && today.minute < SAME_DAY_CUTOFF_MINUTE))) {
        target = today;
      } else {
        for (var offset = 1; offset <= 8; offset += 1) {
          var candidate = berlinParts(new Date(now.getTime() + (offset * DAY_MS)));
          if (TOUR_DAYS[candidate.weekdayShort]) {
            target = candidate;
            break;
          }
        }
      }

      if (!target) return '';
      var relativeLabel = target.weekdayLabel;
      if (target.dateKey === today.dateKey) relativeLabel = 'Today (' + target.weekdayShort + ')';
      else if (target.dateKey === tomorrow.dateKey) relativeLabel = 'Tomorrow (' + target.weekdayShort + ')';
      return 'Next walk: ' + relativeLabel + ' at ' + TOUR_START_LABEL + '. Free, tip-based.';
    } catch (err) {
      return '';
    }
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700;800;900&display=swap");',
      '.bw-exit-lock{overflow:hidden!important;}',
      '.bw-exit-overlay{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:28px;background:rgba(9,18,10,.62);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);font-family:Montserrat,Arial,sans-serif;color:#FAFAF5;opacity:0;pointer-events:none;transition:opacity .22s ease;}',
      '.bw-exit-overlay.bw-exit-visible{opacity:1;pointer-events:auto;}',
      '.bw-exit-card{position:relative;width:min(560px,100%);border-radius:8px;border:1px solid rgba(255,230,0,.24);background:rgba(27,94,32,.96);box-shadow:0 30px 80px rgba(0,0,0,.42);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);overflow:hidden;transform:translateY(14px) scale(.98);transition:transform .22s ease;}',
      '.bw-exit-overlay.bw-exit-visible .bw-exit-card{transform:translateY(0) scale(1);}',
      '.bw-exit-card:before{content:"";position:absolute;inset:0 0 auto;height:5px;background:linear-gradient(90deg,#FFE600,#7CB342,#FAFAF5);}',
      '.bw-exit-media{position:relative;aspect-ratio:16/7;min-height:210px;overflow:hidden;background:#123d16;}',
      '.bw-exit-media img{width:100%;height:100%;display:block;object-fit:cover;}',
      '.bw-exit-media:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,20,9,0) 28%,rgba(8,20,9,.42) 100%);}',
      '.bw-exit-badge{position:absolute;left:22px;bottom:18px;z-index:2;max-width:calc(100% - 44px);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;border-radius:999px;background:rgba(27,94,32,.88);color:#FFE600;border:1px solid rgba(255,230,0,.32);padding:8px 12px;font-size:11px;font-weight:900;letter-spacing:1.3px;text-transform:uppercase;box-shadow:0 10px 24px rgba(0,0,0,.24);}',
      '.bw-exit-inner{position:relative;padding:28px 38px 34px;text-align:left;}',
      '.bw-exit-close{position:absolute;top:14px;right:14px;width:36px;height:36px;border:0;border-radius:50%;background:rgba(250,250,245,.1);color:#FAFAF5;font:800 24px/1 Arial,sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;transition:background-color .18s ease,transform .18s ease;}',
      '.bw-exit-close:hover,.bw-exit-close:focus-visible{background:rgba(250,250,245,.18);transform:rotate(90deg);outline:2px solid rgba(255,230,0,.7);outline-offset:2px;}',
      '.bw-exit-step{display:none;}',
      '.bw-exit-step.bw-exit-active{display:block;animation:bwExitIn .18s ease both;}',
      '@keyframes bwExitIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}',
      '.bw-exit-kicker{margin:0 0 12px;color:#FFE600;font-size:11px;font-weight:900;letter-spacing:2.1px;text-transform:uppercase;}',
      '.bw-exit-title{margin:0 44px 12px 0;color:#FFFFFF;font-size:34px;line-height:1.05;font-weight:900;letter-spacing:0;}',
      '.bw-exit-next{margin:0 0 14px;color:#C5E1A5;font-size:14px;font-weight:800;line-height:1.4;}',
      '.bw-exit-copy{margin:0 0 24px;color:#FAFAF5;font-size:15px;line-height:1.55;font-weight:500;max-width:39em;}',
      '.bw-exit-actions{display:grid;gap:12px;}',
      '.bw-exit-primary{font-family:Montserrat,Arial,sans-serif;cursor:pointer;text-decoration:none;}',
      '.bw-exit-primary{border:0;border-radius:8px;background:#FFE600;color:#1B5E20;font-size:15px;font-weight:900;line-height:1.2;text-align:center;padding:16px 20px;box-shadow:0 10px 24px rgba(255,230,0,.18);transition:transform .18s ease,box-shadow .18s ease,background-color .18s ease;}',
      '.bw-exit-primary:hover,.bw-exit-primary:focus-visible{background:#fff066;transform:translateY(-1px);box-shadow:0 14px 28px rgba(255,230,0,.26);outline:0;}',
      '@media (prefers-reduced-motion:reduce){.bw-exit-overlay,.bw-exit-card,.bw-exit-step,.bw-exit-close,.bw-exit-primary{transition:none!important;animation:none!important;}}'
    ].join('');
    document.head.appendChild(style);
  }

  function closePopup(reason) {
    var overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) return;

    if (!closeTracked) {
      closeTracked = true;
      trackEvent('bw_exit_popup_close', { close_reason: reason || 'unknown' });
    }

    overlay.classList.remove('bw-exit-visible');
    document.documentElement.classList.remove('bw-exit-lock');
    document.body.classList.remove('bw-exit-lock');
    document.removeEventListener('keydown', handleKeydown);
    setTimeout(function () {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, 240);
  }

  function handleKeydown(event) {
    if (event.key === 'Escape') {
      closePopup('escape');
    }
    if (event.key === 'Tab') {
      trapFocus(event);
    }
  }

  function trapFocus(event) {
    var overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) return;

    var focusable = overlay.querySelectorAll('.bw-exit-close,.bw-exit-step.bw-exit-active a[href],.bw-exit-step.bw-exit-active button:not([disabled])');
    if (!focusable.length) return;

    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function renderPopup() {
    injectStyles();
    var nextLine = nextTourLine();

    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    overlay.className = 'bw-exit-overlay';
    overlay.innerHTML = [
      '<div class="bw-exit-card" role="dialog" aria-modal="true" aria-labelledby="bw-exit-title">',
      '<button class="bw-exit-close" type="button" aria-label="Close" data-bw-exit-close>&times;</button>',
      '<div class="bw-exit-media">',
        '<img src="' + HERO_IMAGE_URL + '" alt="Berlin Cathedral illustration" width="720" height="404">',
        '<span class="bw-exit-badge">Berlin Walking Tour</span>',
      '</div>',
      '<div class="bw-exit-inner">',
      '<section class="bw-exit-step bw-exit-active" data-bw-exit-step="1">',
      '<p class="bw-exit-kicker">Free, tip-based</p>',
      '<h2 class="bw-exit-title" id="bw-exit-title">Before you leave, book your Berlin walk.</h2>',
      (nextLine ? '<p class="bw-exit-next">' + nextLine + '</p>' : ''),
      '<p class="bw-exit-copy">Yusuf here! If you want the city to make sense early in your trip, reserve a free spot on my Berlin walk. No upfront payment, tip-based at the end, about 2 hours.</p>',
      '<div class="bw-exit-actions">',
      '<a class="bw-exit-primary" href="' + BOOKING_URL + '" data-bw-exit-book>Book Walking Tour</a>',
      '</div>',
      '</section>',
      '</div>',
      '</div>'
    ].join('');

    document.body.appendChild(overlay);
    bindPopupEvents(overlay);
    document.documentElement.classList.add('bw-exit-lock');
    document.body.classList.add('bw-exit-lock');
    window.requestAnimationFrame(function () {
      overlay.classList.add('bw-exit-visible');
      var closeButton = overlay.querySelector('[data-bw-exit-close]');
      if (closeButton) closeButton.focus();
    });
  }

  function bindPopupEvents(overlay) {
    var closeButton = overlay.querySelector('[data-bw-exit-close]');
    var bookButton = overlay.querySelector('[data-bw-exit-book]');

    closeButton.addEventListener('click', function () {
      closePopup('x_button');
    });
    bookButton.addEventListener('click', function () {
      trackEvent('bw_exit_popup_book_click', { cta_url: BOOKING_URL });
      closePopup('book_click');
    });
    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) closePopup('overlay_click');
    });

    document.addEventListener('keydown', handleKeydown);
  }

  function showPopup() {
    if (!dwellReady || popupShown || !shouldRun() || document.getElementById(OVERLAY_ID)) return;

    popupShown = true;
    closeTracked = false;
    safeSessionSet(SESSION_KEY, String(Date.now()));
    renderPopup();
    trackEvent('bw_exit_popup_view', { trigger_type: isPreviewForced() ? 'preview' : 'exit_intent' });
  }

  function handleMouseLeave(event) {
    if (event.clientY <= 0 || event.clientY < 20) showPopup();
  }

  function handleMouseOut(event) {
    if (!event.relatedTarget && event.clientY < 20) showPopup();
  }

  function boot() {
    window.setTimeout(function () {
      dwellReady = true;
      if (isPreviewForced()) showPopup();
    }, DWELL_TIME_MS);

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseout', handleMouseOut);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
