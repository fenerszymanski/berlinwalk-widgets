/* lead-form-inject.js — blog-post BerlinWalk booking card.
 *
 * GetYourGuide-style activity card: promo photo, title, rating, free/tip-based
 * price slot, horizontally scrollable live date chips, and a full-width
 * "Check availability" CTA. Date chips carry real Wix Bookings session IDs,
 * so a click lands on the native Wix booking step with that date selected.
 *
 * Live safety: enabled on /post/* pages. Disable temporarily with:
 *   ?bwBlogBooking=0
 * or set before loading this script:
 *   window.BW_DISABLE_BLOG_BOOKING = true
 */
(function () {
  var DISABLED = window.BW_DISABLE_BLOG_BOOKING === true || /[?&]bwBlogBooking=0(?:&|$)/.test(location.search);
  var ENABLED = !DISABLED && (
    location.pathname.indexOf('/post/') === 0 ||
    window.BW_ENABLE_BLOG_BOOKING === true ||
    /[?&]bwBlogBooking=1(?:&|$)/.test(location.search)
  );
  if (!ENABLED) return;

  var AVAILABILITY_URL = 'https://berlinwalk-content-app.vercel.app/api/booking-calendar-availability?days=120&guests=1';
  var BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
  var MARKER = 'data-bw-blog-booking';
  var STYLE_ID = 'bw-blog-booking-inject-style';
  var LOG = '[BW blog booking]';
  var MAX_REINJECTS = 8;
  var REINJECT_DEBOUNCE_MS = 400;

  var injections = 0;
  var reinjectTimer = null;
  var observer = null;
  var lastPath = location.pathname;

  function isPostPage() {
    return location.pathname.indexOf('/post/') === 0;
  }

  function isVisible(el) {
    while (el && el !== document.body && el.nodeType === 1) {
      var style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      el = el.parentElement;
    }
    return true;
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

  function findInsertionAnchor(body) {
    var headings = [];
    var allHeadings = body.querySelectorAll('h2');
    for (var i = 0; i < allHeadings.length; i++) {
      if (isVisible(allHeadings[i])) headings.push(allHeadings[i]);
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
    if (headings.length) return headings[Math.floor(headings.length / 2)];

    var paragraphs = [];
    var allParagraphs = body.querySelectorAll('p');
    for (var p = 0; p < allParagraphs.length; p++) {
      if (isVisible(allParagraphs[p])) paragraphs.push(allParagraphs[p]);
    }
    if (paragraphs.length >= 4) return paragraphs[Math.floor(paragraphs.length / 2)];
    return null;
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '.bw-blog-booking-card{box-sizing:border-box;display:flex;margin:34px 0;max-width:100%;min-width:0;padding:0;background:#fff;border:1px solid #DCE3DD;border-radius:16px;box-shadow:0 12px 30px rgba(27,94,32,.10);font-family:Montserrat,Arial,sans-serif;color:#212121;overflow:hidden;}',
      '.bw-blog-booking-card *{box-sizing:border-box;}',
      '.bw-blog-booking-media{flex:0 0 230px;min-width:0;position:relative;}',
      '.bw-blog-booking-media img{display:block;width:100%;height:100%;min-height:100%;object-fit:cover;margin:0!important;border-radius:0!important;}',
      '.bw-blog-booking-flag{position:absolute;top:10px;left:10px;background:#FFE600;border-radius:999px;color:#1B5E20!important;font-size:11px;font-weight:900;letter-spacing:.08em;line-height:1;padding:7px 10px;text-transform:uppercase;}',
      '.bw-blog-booking-body{display:flex;flex:1 1 auto;flex-direction:column;gap:10px;min-width:0;padding:16px 18px;}',
      '.bw-blog-booking-toprow{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;min-width:0;}',
      '.bw-blog-booking-headgroup{min-width:0;}',
      '.bw-blog-booking-title{display:block;margin:0 0 4px!important;color:#212121!important;font-size:20px!important;font-weight:900!important;line-height:1.18!important;letter-spacing:0!important;text-transform:none!important;}',
      '.bw-blog-booking-rating{display:flex;align-items:center;gap:5px;color:#4E5A4E;font-size:13px;font-weight:700;line-height:1;}',
      '.bw-blog-booking-rating .bw-star{color:#F5A623;font-size:15px;line-height:1;}',
      '.bw-blog-booking-rating b{color:#212121;font-weight:900;}',
      '.bw-blog-booking-price{flex:0 0 auto;text-align:right;}',
      '.bw-blog-booking-price b{display:block;color:#1B5E20!important;font-size:16px;font-weight:900;line-height:1.15;white-space:nowrap;}',
      '.bw-blog-booking-price span{display:block;margin-top:3px;color:#4E5A4E;font-size:11px;font-weight:700;line-height:1.2;white-space:nowrap;}',
      '.bw-blog-booking-text{margin:0!important;color:#4E5A4E!important;font-size:14px!important;font-weight:500!important;line-height:1.45!important;}',
      '.bw-blog-booking-dates{display:flex;gap:8px;min-width:0;overflow-x:auto;padding:2px;scrollbar-width:none;-webkit-overflow-scrolling:touch;}',
      '.bw-blog-booking-dates::-webkit-scrollbar{display:none;}',
      '.bw-blog-booking-date{align-items:center;background:#fff;border:1px solid #CFE4C8;border-radius:12px;color:#1B5E20!important;display:grid;flex:0 0 auto;gap:2px;justify-items:center;min-height:68px;min-width:62px;padding:8px 6px;text-align:center;text-decoration:none!important;}',
      '.bw-blog-booking-date:first-child{background:#1B5E20;border-color:#1B5E20;color:#fff!important;}',
      '.bw-blog-booking-date span,.bw-blog-booking-date b,.bw-blog-booking-date small{color:inherit!important;}',
      'body .bw-blog-booking-card .bw-blog-booking-dates .bw-blog-booking-date:first-child,body .bw-blog-booking-card .bw-blog-booking-dates .bw-blog-booking-date:first-child span,body .bw-blog-booking-card .bw-blog-booking-dates .bw-blog-booking-date:first-child b,body .bw-blog-booking-card .bw-blog-booking-dates .bw-blog-booking-date:first-child small{color:#fff!important;}',
      '.bw-blog-booking-date span{font-size:10px;font-weight:900;line-height:1;text-transform:uppercase;}',
      '.bw-blog-booking-date b{font-size:21px;font-weight:900;line-height:1;}',
      '.bw-blog-booking-date small{font-size:10px;font-weight:800;line-height:1.1;}',
      '.bw-blog-booking-date:hover,.bw-blog-booking-date:focus-visible{outline:2px solid #FFE600;outline-offset:2px;}',
      '.bw-blog-booking-more{align-items:center;background:#F8FBF4;border:1px solid #CFE4C8;border-radius:12px;color:#1B5E20!important;display:flex;flex:0 0 auto;justify-content:center;min-height:68px;min-width:52px;text-decoration:none!important;}',
      '.bw-blog-booking-more svg{display:block;width:22px;height:22px;}',
      '.bw-blog-booking-more:hover,.bw-blog-booking-more:focus-visible{outline:2px solid #FFE600;outline-offset:2px;}',
      '.bw-blog-booking-loading,.bw-blog-booking-empty{color:#4E5A4E;font-size:13px;font-weight:700;line-height:1.4;padding:10px 2px;}',
      '.bw-blog-booking-cta{display:block;margin-top:2px;}',
      '.bw-blog-booking-cta a{align-items:center;background:#FFE600;border-radius:999px;color:#1B5E20!important;display:flex;font-size:15px;font-weight:900;justify-content:center;min-height:48px;padding:0 16px;text-decoration:none!important;width:100%;}',
      '.bw-blog-booking-cta a:hover,.bw-blog-booking-cta a:focus-visible{outline:2px solid #1B5E20;outline-offset:2px;}',
      '.bw-blog-booking-note{display:block;margin:0;color:#4E5A4E;font-size:12px;font-weight:600;line-height:1.35;text-align:center;}',
      '@media(max-width:640px){.bw-blog-booking-card{flex-direction:column;margin:28px 0;border-radius:14px;}.bw-blog-booking-media{flex:0 0 auto;}.bw-blog-booking-media img{height:170px;min-height:0;}.bw-blog-booking-body{padding:14px;}.bw-blog-booking-toprow{flex-direction:column;gap:6px;}.bw-blog-booking-price{text-align:left;}.bw-blog-booking-title{font-size:19px!important;}}'
    ].join('');
    document.head.appendChild(style);
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function dateKey(value) {
    var raw = String(value || '');
    if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
    var date = new Date(raw);
    if (Number.isNaN(date.getTime())) return '';
    var parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Berlin',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(date);
    var map = {};
    parts.forEach(function (part) { map[part.type] = part.value; });
    return map.year + '-' + map.month + '-' + map.day;
  }

  function formatDateParts(dateString) {
    var date = new Date(dateString + 'T12:00:00');
    return {
      weekday: new Intl.DateTimeFormat('en-GB', { weekday: 'short' }).format(date),
      day: new Intl.DateTimeFormat('en-GB', { day: 'numeric' }).format(date),
      month: new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(date)
    };
  }

  function bookingHref(slot) {
    var base = slot && slot.bookingUrl ? slot.bookingUrl : BOOKING_URL;
    var url = new URL(base, window.location.href);
    if (slot) {
      url.searchParams.set('bookings_timezone', slot.timezone || 'Europe/Berlin');
      if (slot.serviceId) url.searchParams.set('bookings_serviceId', slot.serviceId);
      if (slot.locationId) url.searchParams.set('bookings_locationId', slot.locationId);
      if (slot.sessionId || slot.eventId) url.searchParams.set('bookings_sessionId', slot.sessionId || slot.eventId);
    }
    url.searchParams.set('utm_content', 'blog_booking_card');
    if (!url.searchParams.has('utm_source')) url.searchParams.set('utm_source', 'berlinwalk');
    if (!url.searchParams.has('utm_medium')) url.searchParams.set('utm_medium', 'blog_booking_card');
    if (!url.searchParams.has('utm_campaign')) url.searchParams.set('utm_campaign', 'direct_booking');
    return url.toString();
  }

  function normalizeSlots(slots) {
    var byDate = {};
    (Array.isArray(slots) ? slots : []).forEach(function (slot, index) {
      var startDate = slot.startDate || slot.start || slot.localStartDate;
      var key = dateKey(startDate);
      if (!key || byDate[key]) return;
      byDate[key] = {
        id: String(slot.id || slot.eventId || startDate || index),
        eventId: slot.eventId || '',
        sessionId: slot.sessionId || slot.eventId || '',
        serviceId: slot.serviceId || '',
        locationId: slot.locationId || '',
        bookingUrl: slot.bookingUrl || '',
        timezone: slot.timezone || 'Europe/Berlin',
        startDate: startDate,
        dateKey: key
      };
    });
    return Object.keys(byDate).sort().map(function (key) { return byDate[key]; }).slice(0, 8);
  }

  function moreDatesChip() {
    return [
      '<a class="bw-blog-booking-more" href="' + escapeHtml(bookingHref()) + '" target="_top" aria-label="See all tour dates">',
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">',
      '<rect x="3" y="5" width="18" height="16" rx="2"></rect>',
      '<line x1="3" y1="10" x2="21" y2="10"></line>',
      '<line x1="8" y1="3" x2="8" y2="7"></line>',
      '<line x1="16" y1="3" x2="16" y2="7"></line>',
      '</svg>',
      '</a>'
    ].join('');
  }

  function renderDates(panel, slots) {
    if (!slots.length) {
      panel.querySelector('[data-bw-booking-dates]').innerHTML = '<div class="bw-blog-booking-empty">Dates are loading slowly. You can still check availability below.</div>';
      return;
    }
    panel.querySelector('[data-bw-booking-dates]').innerHTML = slots.map(function (slot) {
      var parts = formatDateParts(slot.dateKey);
      return [
        '<a class="bw-blog-booking-date" href="' + escapeHtml(bookingHref(slot)) + '" target="_top">',
        '<span>' + escapeHtml(parts.weekday) + '</span>',
        '<b>' + escapeHtml(parts.day) + '</b>',
        '<small>' + escapeHtml(parts.month) + '</small>',
        '</a>'
      ].join('');
    }).join('') + moreDatesChip();
  }

  function loadDates(panel) {
    fetch(AVAILABILITY_URL, { cache: 'no-cache' })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        renderDates(panel, normalizeSlots(data && data.slots));
      })
      .catch(function () {
        panel.querySelector('[data-bw-booking-dates]').innerHTML = '<div class="bw-blog-booking-empty">Dates are loading slowly. You can still check availability below.</div>';
      });
  }

  function buildBookingCard() {
    ensureStyles();

    var wrapper = document.createElement('section');
    wrapper.setAttribute(MARKER, '1');
    wrapper.className = 'bw-blog-booking-card';
    wrapper.setAttribute('aria-label', 'Book the BerlinWalk walking tour');

    var IMG_BASE = 'https://fenerszymanski.github.io/berlinwalk-widgets/gallery/images/09-800w';
    var IMG_ALT = 'Berlin walking tour group selfie near Alexanderplatz with the TV Tower in the background';

    wrapper.innerHTML = [
      '<div class="bw-blog-booking-media">',
      '  <picture>',
      '    <source srcset="' + IMG_BASE + '.webp" type="image/webp">',
      '    <img src="' + IMG_BASE + '.jpg" alt="' + escapeHtml(IMG_ALT) + '" loading="lazy">',
      '  </picture>',
      '  <span class="bw-blog-booking-flag">Free tour</span>',
      '</div>',
      '<div class="bw-blog-booking-body">',
      '  <div class="bw-blog-booking-toprow">',
      '    <div class="bw-blog-booking-headgroup">',
      '      <div class="bw-blog-booking-title" role="heading" aria-level="2">Berlin: Free Walking Tour of the Historic Centre</div>',
      '      <div class="bw-blog-booking-rating"><span class="bw-star" aria-hidden="true">&#9733;</span><b>9.8</b><span>/ 10 on FreeTour</span></div>',
      '    </div>',
      '    <div class="bw-blog-booking-price"><b>Free &middot; tip-based</b><span>no upfront payment</span></div>',
      '  </div>',
      '  <p class="bw-blog-booking-text">Join my 2-hour walk from the World Clock at Alexanderplatz: 12 stops through the streets where Berlin began.</p>',
      '  <div class="bw-blog-booking-dates" data-bw-booking-dates>',
      '    <div class="bw-blog-booking-loading">Loading live tour dates...</div>',
      '  </div>',
      '  <div class="bw-blog-booking-cta">',
      '    <a href="' + escapeHtml(bookingHref()) + '" target="_top">Check availability</a>',
      '  </div>',
      '  <span class="bw-blog-booking-note">Free reservation &middot; you choose the number of guests on the next step</span>',
      '</div>'
    ].join('');

    loadDates(wrapper);
    return wrapper;
  }

  function inject() {
    if (!isPostPage()) return false;
    if (document.querySelector('[' + MARKER + ']')) return false;
    if (injections >= MAX_REINJECTS) return false;

    var body = findPostBody();
    if (!body) return false;
    var anchor = findInsertionAnchor(body);
    if (!anchor) return false;

    anchor.parentNode.insertBefore(buildBookingCard(), anchor.nextSibling);
    injections += 1;
    console.log(LOG, 'injected attempt', injections);
    return true;
  }

  function scheduleInject() {
    clearTimeout(reinjectTimer);
    reinjectTimer = setTimeout(inject, REINJECT_DEBOUNCE_MS);
  }

  function startObserving() {
    if (observer) observer.disconnect();
    observer = new MutationObserver(function () {
      if (!isPostPage() || injections >= MAX_REINJECTS) return;
      if (!document.querySelector('[' + MARKER + ']')) scheduleInject();
    });
    if (document.body) observer.observe(document.body, { childList: true, subtree: true });
  }

  function bootForCurrentPage() {
    injections = 0;
    setTimeout(function () {
      inject();
      startObserving();
    }, 800);
    [1500, 2500, 4000].forEach(function (delay) {
      setTimeout(function () {
        if (!document.querySelector('[' + MARKER + ']')) inject();
      }, delay);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootForCurrentPage);
  } else {
    bootForCurrentPage();
  }

  setInterval(function () {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      bootForCurrentPage();
    }
  }, 300);
})();
