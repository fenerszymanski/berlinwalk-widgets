/* lead-form-inject.js — blog-post BerlinWalk booking card.
 *
 * Compact booking card (2026-07-16 redesign, Yusuf-approved variant B):
 * dark green "FREE BERLIN WALKING TOUR" strip with the FreeTour rating,
 * 116px square promo thumb, title + facts line, horizontally scrollable
 * live date chips, and a full-width "Check availability" CTA. Date chips
 * carry real Wix Bookings session IDs, so a click lands on the native Wix
 * booking step with that date selected. The card is inserted after the
 * first paragraph that follows the 2nd H2 (~25% depth) so most readers
 * see it before bouncing; the pre-2026-07-16 version sat at the middle H2.
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
  /* Slot deep links must use the Booking Form URL: the service-page calendar
   * ignores bookings_sessionId, the form preselects the slot from it. */
  var BOOKING_FORM_URL = 'https://www.berlinwalk.com/booking-form';
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
    if (headings.length) {
      var heading = headings.length >= 2 ? headings[1] : headings[0];
      var node = heading.nextElementSibling;
      while (node) {
        var tag = (node.tagName || '').toUpperCase();
        if (tag === 'H2' || tag === 'H3') break;
        if (tag === 'P' && isVisible(node)) return node;
        node = node.nextElementSibling;
      }
      return heading;
    }

    var paragraphs = [];
    var allParagraphs = body.querySelectorAll('p');
    for (var p = 0; p < allParagraphs.length; p++) {
      if (isVisible(allParagraphs[p])) paragraphs.push(allParagraphs[p]);
    }
    if (paragraphs.length >= 4) return paragraphs[Math.min(3, Math.floor(paragraphs.length / 2))];
    return null;
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '.bw-blog-booking-card{box-sizing:border-box;display:block;margin:30px 0;max-width:100%;min-width:0;padding:0;background:#fff;border:1px solid #CFE4C8;border-radius:14px;box-shadow:0 8px 22px rgba(27,94,32,.08);font-family:Montserrat,Arial,sans-serif;color:#212121;overflow:hidden;}',
      '.bw-blog-booking-card *{box-sizing:border-box;}',
      '.bw-blog-booking-strip{display:flex;align-items:center;justify-content:space-between;gap:10px;background:#1B5E20;color:#fff;padding:8px 14px;font-size:10px;font-weight:900;letter-spacing:.12em;line-height:1.3;text-transform:uppercase;}',
      '.bw-blog-booking-strip span{color:#fff!important;}',
      '.bw-blog-booking-strip .bw-star{color:#FFE600;}',
      '.bw-blog-booking-inner{display:flex;min-width:0;}',
      '.bw-blog-booking-media{flex:0 0 116px;min-width:0;margin:14px 0 14px 14px;}',
      '.bw-blog-booking-media img{display:block;width:116px;height:116px;object-fit:cover;margin:0!important;border-radius:12px!important;}',
      '.bw-blog-booking-body{display:flex;flex:1 1 auto;flex-direction:column;gap:8px;min-width:0;padding:14px 16px;}',
      '.bw-blog-booking-title{display:block;margin:0!important;color:#212121!important;font-size:17px!important;font-weight:900!important;line-height:1.2!important;letter-spacing:0!important;text-transform:none!important;}',
      '.bw-blog-booking-facts{margin:0;color:#4E5A4E!important;font-size:12px;font-weight:700;line-height:1.35;}',
      '.bw-blog-booking-dates{display:flex;gap:8px;min-width:0;overflow-x:auto;padding:2px;scrollbar-width:none;-webkit-overflow-scrolling:touch;}',
      '.bw-blog-booking-dates::-webkit-scrollbar{display:none;}',
      '.bw-blog-booking-date{align-items:center;appearance:none;-webkit-appearance:none;background:#fff;border:1px solid #CFE4C8;border-radius:12px;color:#1B5E20!important;cursor:pointer;display:grid;flex:0 0 auto;font-family:inherit;gap:2px;justify-items:center;margin:0;min-height:56px;min-width:54px;padding:7px 4px;text-align:center;text-decoration:none!important;}',
      '.bw-blog-booking-date.bw-selected{background:#1B5E20;border-color:#1B5E20;color:#fff!important;}',
      '.bw-blog-booking-date span,.bw-blog-booking-date b,.bw-blog-booking-date small{color:inherit!important;}',
      'body .bw-blog-booking-card .bw-blog-booking-dates .bw-blog-booking-date.bw-selected,body .bw-blog-booking-card .bw-blog-booking-dates .bw-blog-booking-date.bw-selected span,body .bw-blog-booking-card .bw-blog-booking-dates .bw-blog-booking-date.bw-selected b,body .bw-blog-booking-card .bw-blog-booking-dates .bw-blog-booking-date.bw-selected small{color:#fff!important;}',
      '.bw-blog-booking-date span{font-size:9px;font-weight:900;line-height:1;text-transform:uppercase;}',
      '.bw-blog-booking-date b{font-size:17px;font-weight:900;line-height:1;}',
      '.bw-blog-booking-date small{font-size:9px;font-weight:800;line-height:1.1;}',
      '.bw-blog-booking-date:hover,.bw-blog-booking-date:focus-visible{outline:2px solid #FFE600;outline-offset:2px;}',
      '.bw-blog-booking-more{align-items:center;background:#F8FBF4;border:1px solid #CFE4C8;border-radius:12px;color:#1B5E20!important;display:flex;flex:0 0 auto;justify-content:center;min-height:56px;min-width:46px;text-decoration:none!important;}',
      '.bw-blog-booking-more svg{display:block;width:19px;height:19px;}',
      '.bw-blog-booking-more:hover,.bw-blog-booking-more:focus-visible{outline:2px solid #FFE600;outline-offset:2px;}',
      '.bw-blog-booking-loading,.bw-blog-booking-empty{color:#4E5A4E;font-size:13px;font-weight:700;line-height:1.4;padding:10px 2px;}',
      '.bw-blog-booking-day{align-items:center;display:flex;flex-wrap:wrap;gap:8px;min-width:0;}',
      '.bw-blog-booking-times-label{color:#4E5A4E!important;font-size:11px;font-weight:900;letter-spacing:.06em;line-height:1;text-transform:uppercase;}',
      '.bw-blog-booking-times{display:flex;flex-wrap:wrap;gap:8px;}',
      '.bw-blog-booking-time{appearance:none;-webkit-appearance:none;background:#fff;border:1px solid #CFE4C8;border-radius:999px;color:#1B5E20!important;cursor:pointer;font-family:inherit;font-size:12px;font-weight:900;line-height:1;margin:0;padding:8px 12px;}',
      '.bw-blog-booking-time.bw-selected{background:#1B5E20;border-color:#1B5E20;color:#fff!important;}',
      '.bw-blog-booking-time:hover,.bw-blog-booking-time:focus-visible{outline:2px solid #FFE600;outline-offset:2px;}',
      '.bw-blog-booking-meta{color:#4E5A4E!important;flex:1 1 100%;font-size:11px;font-weight:600;line-height:1.35;margin:0;}',
      '.bw-blog-booking-cta{display:block;margin-top:2px;}',
      '.bw-blog-booking-cta a{align-items:center;background:#FFE600;border-radius:999px;color:#1B5E20!important;display:flex;font-size:14px;font-weight:900;justify-content:center;min-height:44px;padding:0 16px;text-decoration:none!important;width:100%;}',
      '.bw-blog-booking-cta a:hover,.bw-blog-booking-cta a:focus-visible{outline:2px solid #1B5E20;outline-offset:2px;}',
      '@media(max-width:640px){.bw-blog-booking-card{margin:24px 0;}.bw-blog-booking-strip{font-size:9px;letter-spacing:.1em;}.bw-blog-booking-inner{display:block;padding:12px;}.bw-blog-booking-media{float:left;width:92px;flex:none;margin:0 10px 4px 0;}.bw-blog-booking-media img{width:92px;height:92px;}.bw-blog-booking-body{display:block;padding:0;}.bw-blog-booking-title{font-size:16px!important;margin:0 0 6px!important;}.bw-blog-booking-facts{font-size:11.5px;}.bw-blog-booking-dates{clear:both;margin-top:10px;}.bw-blog-booking-day{margin-top:8px;}.bw-blog-booking-cta{margin-top:8px;}}'
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
    var base = slot ? (slot.bookingUrl || BOOKING_FORM_URL) : BOOKING_URL;
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
      if (!key) return;
      if (!byDate[key]) byDate[key] = [];
      byDate[key].push({
        id: String(slot.id || slot.eventId || startDate || index),
        eventId: slot.eventId || '',
        sessionId: slot.sessionId || slot.eventId || '',
        serviceId: slot.serviceId || '',
        locationId: slot.locationId || '',
        bookingUrl: slot.bookingUrl || '',
        timezone: slot.timezone || 'Europe/Berlin',
        openSpots: typeof slot.openSpots === 'number' ? slot.openSpots : null,
        startDate: startDate,
        dateKey: key
      });
    });
    return Object.keys(byDate).sort().slice(0, 6).map(function (key) {
      return {
        dateKey: key,
        slots: byDate[key].sort(function (a, b) {
          return new Date(a.startDate) - new Date(b.startDate);
        })
      };
    });
  }

  function formatTime(value) {
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Berlin',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
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

  function renderSelection(panel, state) {
    var day = state.days[state.dayIndex];
    if (!day) return;
    if (state.slotIndex >= day.slots.length) state.slotIndex = 0;
    var slot = day.slots[state.slotIndex];
    var parts = formatDateParts(day.dateKey);
    var startTime = formatTime(slot.startDate);

    var chips = panel.querySelectorAll('[data-bw-day-index]');
    for (var i = 0; i < chips.length; i++) {
      var selected = Number(chips[i].getAttribute('data-bw-day-index')) === state.dayIndex;
      chips[i].classList.toggle('bw-selected', selected);
      chips[i].setAttribute('aria-pressed', selected ? 'true' : 'false');
    }

    panel.querySelector('[data-bw-booking-day]').hidden = false;
    panel.querySelector('[data-bw-booking-times]').innerHTML = day.slots.map(function (daySlot, index) {
      var isSelected = index === state.slotIndex;
      return '<button type="button" class="bw-blog-booking-time' + (isSelected ? ' bw-selected' : '') + '" data-bw-slot-index="' + index + '" aria-pressed="' + (isSelected ? 'true' : 'false') + '">' + escapeHtml(formatTime(daySlot.startDate) || 'Time TBC') + '</button>';
    }).join('');

    var dateLabel = parts.weekday + ' ' + parts.day + ' ' + parts.month;
    panel.querySelector('[data-bw-booking-meta]').textContent =
      (slot.openSpots === null || slot.openSpots > 0 ? 'Spots available' : 'Few spots left') +
      ' for ' + dateLabel + ' · ends near Hackescher Markt';

    var cta = panel.querySelector('[data-bw-booking-cta]');
    cta.setAttribute('href', bookingHref(slot));
    cta.textContent = 'Reserve ' + dateLabel + (startTime ? ' · ' + startTime : '');
  }

  function setupPicker(panel, days) {
    var datesEl = panel.querySelector('[data-bw-booking-dates]');
    if (!days.length) {
      datesEl.innerHTML = '<div class="bw-blog-booking-empty">Dates are loading slowly. You can still check availability below.</div>';
      return;
    }
    var state = { days: days, dayIndex: 0, slotIndex: 0 };

    datesEl.innerHTML = days.map(function (day, index) {
      var parts = formatDateParts(day.dateKey);
      return [
        '<button type="button" class="bw-blog-booking-date" data-bw-day-index="' + index + '">',
        '<span>' + escapeHtml(parts.weekday) + '</span>',
        '<b>' + escapeHtml(parts.day) + '</b>',
        '<small>' + escapeHtml(parts.month) + '</small>',
        '</button>'
      ].join('');
    }).join('') + moreDatesChip();

    datesEl.addEventListener('click', function (event) {
      var chip = event.target.closest('[data-bw-day-index]');
      if (!chip) return;
      state.dayIndex = Number(chip.getAttribute('data-bw-day-index')) || 0;
      state.slotIndex = 0;
      renderSelection(panel, state);
    });

    panel.querySelector('[data-bw-booking-times]').addEventListener('click', function (event) {
      var pill = event.target.closest('[data-bw-slot-index]');
      if (!pill) return;
      state.slotIndex = Number(pill.getAttribute('data-bw-slot-index')) || 0;
      renderSelection(panel, state);
    });

    renderSelection(panel, state);
  }

  function loadDates(panel) {
    fetch(AVAILABILITY_URL, { cache: 'no-cache' })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        setupPicker(panel, normalizeSlots(data && data.slots));
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

    var IMG_BASE = 'https://fenerszymanski.github.io/berlinwalk-widgets/gallery/images/01-800w';
    var IMG_ALT = 'BerlinWalk guide Yusuf leading guests outside the Altes Museum on Museum Island';

    wrapper.innerHTML = [
      '<div class="bw-blog-booking-strip">',
      '  <span>Free Berlin walking tour &middot; live dates</span>',
      '  <span><span class="bw-star" aria-hidden="true">&#9733;</span> 9.8 / 10 on FreeTour</span>',
      '</div>',
      '<div class="bw-blog-booking-inner">',
      '<div class="bw-blog-booking-media">',
      '  <picture>',
      '    <source srcset="' + IMG_BASE + '.webp" type="image/webp">',
      '    <img src="' + IMG_BASE + '.jpg" alt="' + escapeHtml(IMG_ALT) + '" loading="lazy">',
      '  </picture>',
      '</div>',
      '<div class="bw-blog-booking-body">',
      '  <div class="bw-blog-booking-title" role="heading" aria-level="2">Berlin: Free Walking Tour of the Historic Centre</div>',
      '  <div class="bw-blog-booking-facts">Free, tip-based &middot; about 2 hours &middot; starts at the World Clock, Alexanderplatz</div>',
      '  <div class="bw-blog-booking-dates" data-bw-booking-dates aria-label="Pick a tour date">',
      '    <div class="bw-blog-booking-loading">Loading live tour dates...</div>',
      '  </div>',
      '  <div class="bw-blog-booking-day" data-bw-booking-day hidden>',
      '    <span class="bw-blog-booking-times-label">Start time</span>',
      '    <div class="bw-blog-booking-times" data-bw-booking-times></div>',
      '    <span class="bw-blog-booking-meta" data-bw-booking-meta></span>',
      '  </div>',
      '  <div class="bw-blog-booking-cta">',
      '    <a href="' + escapeHtml(bookingHref()) + '" target="_top" data-bw-booking-cta>Check availability</a>',
      '  </div>',
      '</div>',
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
