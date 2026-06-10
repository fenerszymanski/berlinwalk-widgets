/* lead-form-inject.js — optional blog-post BerlinWalk booking teaser.
 *
 * Live safety: disabled by default after the 2026-06-10 blog layout issue.
 * Test locally or on a cache-busted live post with:
 *   ?bwBlogBooking=1
 * or set before loading this script:
 *   window.BW_ENABLE_BLOG_BOOKING = true
 */
(function () {
  var ENABLED = window.BW_ENABLE_BLOG_BOOKING === true || /[?&]bwBlogBooking=1(?:&|$)/.test(location.search);
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
      '.bw-blog-booking-card{box-sizing:border-box;margin:34px 0;max-width:100%;min-width:0;padding:18px;background:#FAFAF5;border:1px solid #CFE4C8;border-left:8px solid #1B5E20;border-radius:14px;box-shadow:0 14px 34px rgba(27,94,32,.11);font-family:Montserrat,Arial,sans-serif;color:#212121;overflow:hidden;}',
      '.bw-blog-booking-card *{box-sizing:border-box;}',
      '.bw-blog-booking-grid{display:grid;grid-template-columns:minmax(220px,.82fr) minmax(280px,1.18fr);gap:18px;align-items:start;min-width:0;}',
      '.bw-blog-booking-copy,.bw-blog-booking-panel{min-width:0;}',
      '.bw-blog-booking-kicker{display:block;margin:0 0 8px;color:#1B5E20;font-size:12px;font-weight:900;letter-spacing:.12em;line-height:1;text-transform:uppercase;}',
      '.bw-blog-booking-title{display:block;margin:0 0 10px!important;color:#1B5E20!important;font-size:24px!important;font-weight:900!important;line-height:1.12!important;letter-spacing:0!important;text-transform:none!important;}',
      '.bw-blog-booking-text{margin:0;color:#4E5A4E;font-size:16px;font-weight:500;line-height:1.48;}',
      '.bw-blog-booking-facts{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0 0;padding:0;list-style:none;}',
      '.bw-blog-booking-facts li{border:1px solid #DCE3DD;border-radius:999px;background:#fff;color:#1B5E20;font-size:12px;font-weight:800;line-height:1;padding:8px 10px;white-space:nowrap;}',
      '.bw-blog-booking-mini{background:#fff;border:1px solid #DCE3DD;border-radius:12px;box-shadow:0 8px 20px rgba(27,94,32,.08);overflow:hidden;min-width:0;}',
      '.bw-blog-booking-mini-head{border-bottom:1px solid #DCE3DD;padding:12px;}',
      '.bw-blog-booking-mini-title{display:block;margin:0;color:#1B5E20!important;font-size:18px!important;font-weight:900!important;line-height:1.15!important;letter-spacing:0!important;text-transform:none!important;}',
      '.bw-blog-booking-note{display:block;margin:8px 0 0;background:#F8FBF4;border-left:3px solid #FFE600;border-radius:5px;color:#1B5E20;font-size:11px;font-weight:900;line-height:1.25;padding:8px 10px;text-transform:uppercase;}',
      '.bw-blog-booking-dates{display:grid;gap:8px;grid-template-columns:repeat(3,minmax(0,1fr));padding:12px;min-width:0;}',
      '.bw-blog-booking-date{align-items:center;background:#F8FBF4;border:1px solid #CFE4C8;border-radius:10px;color:#1B5E20;display:grid;gap:2px;justify-items:center;min-height:76px;padding:8px 6px;text-align:center;text-decoration:none;}',
      '.bw-blog-booking-date:first-child{background:#1B5E20;border-color:#1B5E20;color:#fff;}',
      '.bw-blog-booking-date span{font-size:11px;font-weight:900;line-height:1;text-transform:uppercase;}',
      '.bw-blog-booking-date b{font-size:24px;font-weight:900;line-height:1;}',
      '.bw-blog-booking-date small{font-size:11px;font-weight:800;line-height:1.1;}',
      '.bw-blog-booking-date:hover,.bw-blog-booking-date:focus-visible{outline:2px solid #FFE600;outline-offset:2px;}',
      '.bw-blog-booking-loading,.bw-blog-booking-empty{color:#4E5A4E;font-size:14px;font-weight:700;line-height:1.4;padding:14px 12px;}',
      '.bw-blog-booking-cta{display:flex;gap:10px;align-items:center;justify-content:space-between;border-top:1px solid #DCE3DD;padding:12px;}',
      '.bw-blog-booking-cta span{color:#4E5A4E;font-size:13px;font-weight:600;line-height:1.35;}',
      '.bw-blog-booking-cta a{align-items:center;background:#FFE600;border-radius:999px;color:#1B5E20;display:inline-flex;flex:0 0 auto;font-size:13px;font-weight:900;justify-content:center;min-height:42px;padding:0 16px;text-decoration:none;}',
      '@media(max-width:900px){.bw-blog-booking-grid{grid-template-columns:1fr;gap:14px;}.bw-blog-booking-title{font-size:24px!important;}}',
      '@media(max-width:760px){.bw-blog-booking-card{margin:28px 0;padding:14px;border-left-width:6px;border-radius:12px;}.bw-blog-booking-title{font-size:22px!important;}.bw-blog-booking-text{font-size:15px;}.bw-blog-booking-dates{grid-template-columns:repeat(2,minmax(0,1fr));}.bw-blog-booking-cta{align-items:stretch;flex-direction:column;}.bw-blog-booking-cta a{width:100%;}}'
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
    return Object.keys(byDate).sort().map(function (key) { return byDate[key]; }).slice(0, 5);
  }

  function renderDates(panel, slots) {
    if (!slots.length) {
      panel.querySelector('[data-bw-booking-dates]').innerHTML = '<div class="bw-blog-booking-empty">Dates are loading slowly. You can still open the booking page.</div>';
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
    }).join('');
  }

  function loadDates(panel) {
    fetch(AVAILABILITY_URL, { cache: 'no-cache' })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        renderDates(panel, normalizeSlots(data && data.slots));
      })
      .catch(function () {
        panel.querySelector('[data-bw-booking-dates]').innerHTML = '<div class="bw-blog-booking-empty">Dates are loading slowly. You can still open the booking page.</div>';
      });
  }

  function buildBookingCard() {
    ensureStyles();

    var wrapper = document.createElement('section');
    wrapper.setAttribute(MARKER, '1');
    wrapper.className = 'bw-blog-booking-card';
    wrapper.setAttribute('aria-label', 'Book the BerlinWalk walking tour');

    wrapper.innerHTML = [
      '<div class="bw-blog-booking-grid">',
      '  <div class="bw-blog-booking-copy">',
      '    <p class="bw-blog-booking-kicker">BerlinWalk tour</p>',
      '    <div class="bw-blog-booking-title" role="heading" aria-level="2">Pick your walking tour date</div>',
      '    <p class="bw-blog-booking-text">Join my free, tip-based Berlin walk from the World Clock at Alexanderplatz. Pick a date here, then choose the number of guests on the next step.</p>',
      '    <ul class="bw-blog-booking-facts" aria-label="Tour facts">',
      '      <li>Free to book</li>',
      '      <li>Tip-based</li>',
      '      <li>2h walk</li>',
      '    </ul>',
      '  </div>',
      '  <div class="bw-blog-booking-panel">',
      '    <div class="bw-blog-booking-mini">',
      '      <div class="bw-blog-booking-mini-head">',
      '        <div class="bw-blog-booking-mini-title" role="heading" aria-level="3">Choose a tour date</div>',
      '        <span class="bw-blog-booking-note">Free reservation, no upfront payment</span>',
      '      </div>',
      '      <div class="bw-blog-booking-dates" data-bw-booking-dates>',
      '        <div class="bw-blog-booking-loading">Loading live tour dates...</div>',
      '      </div>',
      '      <div class="bw-blog-booking-cta">',
      '        <span>You will choose the number of guests on the booking page.</span>',
      '        <a href="' + BOOKING_URL + '" target="_top">Open booking page</a>',
      '      </div>',
      '    </div>',
      '  </div>',
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
