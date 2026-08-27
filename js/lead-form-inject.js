/* lead-form-inject.js — the two public inline surfaces on every BerlinWalk post.
 *
 * The compact Free Berlin Walking Tour card keeps its existing placement and
 * live date picker. The Date Check card is a separate, no-email decision aid
 * placed later in the article, after the compact tour card and a short stretch
 * of editorial copy. Both cards are light DOM, page-local, and owned by this
 * one idempotent injector.
 */
(function () {
  'use strict';

  var DISABLED = window.BW_DISABLE_BLOG_BOOKING === true || /[?&]bwBlogBooking=0(?:&|$)/.test(location.search);
  var PREVIEW_ENABLED = window.BW_ENABLE_BLOG_BOOKING === true || /[?&]bwBlogBooking=1(?:&|$)/.test(location.search);
  var ENABLED = !DISABLED && (location.pathname.indexOf('/post/') === 0 || PREVIEW_ENABLED);
  if (!ENABLED) return;

  var AVAILABILITY_URL = 'https://berlinwalk-content-app.vercel.app/api/booking-calendar-availability?days=120&guests=1';
  var BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
  var BOOKING_FORM_URL = 'https://www.berlinwalk.com/booking-form';
  var DATE_CHECK_URL = 'https://www.berlinwalk.com/berlin-dates-check';
  var BOOKING_MARKER = 'data-bw-blog-booking';
  var DATE_CHECK_MARKER = 'data-bw-date-check-card';
  var BOOKING_STYLE_ID = 'bw-blog-booking-inject-style';
  var DATE_CHECK_STYLE_ID = 'bw-date-check-blog-card-style';
  // A/B (2026-08-25): 'form' is the shipped in-card date form, 'oneclick' drops
  // the fields and sends one tap to the tool, which asks for the dates anyway.
  // The variant travels to /berlin-dates-check as utm_term, which the lead-asset
  // backend already stores as utmTerm, so nothing server side has to change.
  var DATE_CHECK_VARIANT_KEY = 'bwDateCheckCardVariant';
  var DATE_CHECK_VARIANTS = ['form', 'oneclick'];
  var dateCheckVariantMemo = '';
  var LOG = '[BW blog surfaces]';
  var MAX_RETRIES = 12;
  var RETRY_DELAYS = [0, 120, 420, 900, 1600, 2800, 4500, 7000, 10000, 14000, 18000, 24000];
  var DATE_CHECK_IMAGE = 'https://fenerszymanski.github.io/berlinwalk-widgets/gallery/images/06-1600w.webp';
  var dateCardCount = 0;
  var retryTimer = null;
  var observer = null;
  var lastPath = location.pathname;
  var retries = 0;

  function isSurfacePath() {
    return location.pathname.indexOf('/post/') === 0 || PREVIEW_ENABLED;
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, '&#96;');
  }

  function cleanText(value) {
    return String(value || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function isVisible(el) {
    while (el && el !== document.body && el.nodeType === 1) {
      try {
        var style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
      } catch (err) {}
      el = el.parentElement;
    }
    return true;
  }

  function hasSurfaceAncestor(el) {
    if (!el || !el.closest) return false;
    if (el.closest('[' + BOOKING_MARKER + '],[' + DATE_CHECK_MARKER + '],[data-bw-leadform],[data-bw-tourcta],[data-bw-blog-mobile-guide],[data-bw-blog-mobile-nav],[data-bw-blog-tool-prompt],[data-bw-blog-journey],[data-bw-blog-share-bar]')) return true;
    var container = el.closest('figure,li');
    return Boolean(container && container !== el);
  }

  function findPostBody() {
    var candidates = [
      '[data-hook="post-content"]',
      '[data-hook="rich-content-viewer"]',
      '[data-hook="rich-content"]',
      '[data-hook="post-description"]',
      '.post-content',
      '.rich-content',
      '.blog-post-page-content',
      'article',
      'main'
    ];
    for (var i = 0; i < candidates.length; i++) {
      var body = document.querySelector(candidates[i]);
      if (!body) continue;
      var blocks = articleBlocks(body);
      if (blocks.length >= 1) return body;
    }
    return null;
  }

  function articleBlocks(body) {
    if (!body || !body.querySelectorAll) return [];
    var nodes = body.querySelectorAll('h2,h3,p,blockquote,figure,iframe');
    var blocks = [];
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (!isVisible(node) || hasSurfaceAncestor(node)) continue;
      var tag = (node.tagName || '').toUpperCase();
      if (tag !== 'IFRAME' && !cleanText(node.textContent) && tag !== 'FIGURE') continue;
      blocks.push(node);
    }
    return blocks;
  }

  function insertionTarget(node, body) {
    if (!node || !node.parentNode) return null;
    var target = node;
    while (target.parentNode && target.parentNode !== body) {
      var parent = target.parentNode;
      var sibling = target.nextElementSibling;
      var hasFollowingContent = false;
      while (sibling) {
        if (!hasSurfaceAncestor(sibling)) {
          hasFollowingContent = true;
          break;
        }
        sibling = sibling.nextElementSibling;
      }
      if (hasFollowingContent) break;
      target = parent;
    }
    return target.parentNode ? { parent: target.parentNode, after: target } : null;
  }

  function dateCheckBlocks(body) {
    if (!body || !body.querySelectorAll) return [];
    var nodes = body.querySelectorAll('h2,h3,p,blockquote');
    var blocks = [];
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (!isVisible(node) || hasSurfaceAncestor(node) || !cleanText(node.textContent)) continue;
      blocks.push(node);
    }
    return blocks;
  }

  function nodeContains(container, node) {
    if (!container || !node) return false;
    if (container === node) return true;
    return typeof container.contains === 'function' && container.contains(node);
  }

  function findDateCheckInsertionPoint(body, bookingPoint) {
    if (!bookingPoint || !bookingPoint.after) return null;
    var blocks = dateCheckBlocks(body);
    var bookingAnchor = bookingPoint.after;
    var anchorIndex = -1;
    for (var i = 0; i < blocks.length; i++) {
      if (nodeContains(bookingAnchor, blocks[i]) || nodeContains(blocks[i], bookingAnchor)) anchorIndex = i;
    }
    if (anchorIndex < 0) return null;
    var laterIndex = anchorIndex + 3;
    if (laterIndex >= blocks.length) laterIndex = blocks.length - 1;
    if (laterIndex <= anchorIndex) return null;
    return insertionTarget(blocks[laterIndex], body);
  }

  function bookingBlocks(body) {
    if (!body || !body.querySelectorAll) return [];
    var nodes = body.querySelectorAll('h2,p');
    var blocks = [];
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (!isVisible(node) || hasSurfaceAncestor(node)) continue;
      if (!cleanText(node.textContent)) continue;
      blocks.push(node);
    }
    return blocks;
  }

  function findBookingInsertionPoint(body) {
    var blocks = bookingBlocks(body);
    if (!blocks.length) return null;
    var headings = [];
    for (var i = 0; i < blocks.length; i++) {
      if ((blocks[i].tagName || '').toUpperCase() === 'H2') headings.push(i);
    }
    var anchorIndex = headings.length >= 2 ? headings[1] : headings.length ? headings[0] : Math.floor(blocks.length / 2);
    var nextHeading = blocks.length;
    for (var h = 0; h < headings.length; h++) {
      if (headings[h] > anchorIndex) {
        nextHeading = headings[h];
        break;
      }
    }
    for (var j = anchorIndex + 1; j < nextHeading; j++) {
      if ((blocks[j].tagName || '').toUpperCase() === 'P' && cleanText(blocks[j].textContent) &&
          !(blocks[j].closest && blocks[j].closest('figure,li,blockquote'))) {
        return insertionTarget(blocks[j], body);
      }
    }
    if (!headings.length) {
      var fallbackIndex = blocks.length >= 4 ? Math.min(3, Math.floor(blocks.length / 2)) : blocks.length - 1;
      return insertionTarget(blocks[fallbackIndex], body);
    }
    return insertionTarget(blocks[anchorIndex], body);
  }

  function dateKey(value) {
    var raw = String(value || '');
    if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
    var date = new Date(raw);
    if (Number.isNaN(date.getTime())) return '';
    var parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit'
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
        eventId: slot.eventId || '', sessionId: slot.sessionId || slot.eventId || '',
        serviceId: slot.serviceId || '', locationId: slot.locationId || '', bookingUrl: slot.bookingUrl || '',
        timezone: slot.timezone || 'Europe/Berlin', openSpots: typeof slot.openSpots === 'number' ? slot.openSpots : null,
        startDate: startDate, dateKey: key
      });
    });
    return Object.keys(byDate).sort().slice(0, 6).map(function (key) {
      return { dateKey: key, slots: byDate[key].sort(function (a, b) { return new Date(a.startDate) - new Date(b.startDate); }) };
    });
  }

  function formatTime(value) {
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit' }).format(date);
  }

  function ensureBookingStyles() {
    if (document.getElementById(BOOKING_STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = BOOKING_STYLE_ID;
    style.textContent = [
      '.bw-blog-booking-card{box-sizing:border-box;display:block;margin:30px 0;max-width:100%;min-width:0;padding:0;background:#fff;border:1px solid #CFE4C8;border-radius:14px;box-shadow:0 8px 22px rgba(27,94,32,.08);font-family:Montserrat,Arial,sans-serif;color:#212121;overflow:hidden;}',
      '.bw-blog-booking-card *{box-sizing:border-box;}',
      '.bw-blog-booking-strip{display:flex;align-items:center;justify-content:space-between;gap:10px;background:#1B5E20;color:#fff;padding:8px 14px;font-size:10px;font-weight:900;letter-spacing:.12em;line-height:1.3;text-transform:uppercase;}',
      '.bw-blog-booking-strip span{color:#fff!important;}.bw-blog-booking-strip .bw-star{color:#FFE600;}',
      '.bw-blog-booking-inner{display:flex;min-width:0;}.bw-blog-booking-media{flex:0 0 116px;min-width:0;margin:14px 0 14px 14px;}',
      '.bw-blog-booking-media img{display:block;width:116px;height:116px;object-fit:cover;margin:0!important;border-radius:12px!important;}',
      '.bw-blog-booking-body{display:flex;flex:1 1 auto;flex-direction:column;gap:8px;min-width:0;padding:14px 16px;}',
      '.bw-blog-booking-title{display:block;margin:0!important;color:#212121!important;font-size:17px!important;font-weight:900!important;line-height:1.2!important;letter-spacing:0!important;text-transform:none!important;}',
      '.bw-blog-booking-facts{margin:0;color:#4E5A4E!important;font-size:12px;font-weight:700;line-height:1.35;}',
      '.bw-blog-booking-dates{display:flex;gap:8px;min-width:0;overflow-x:auto;padding:2px;scrollbar-width:none;-webkit-overflow-scrolling:touch;}.bw-blog-booking-dates::-webkit-scrollbar{display:none;}',
      '.bw-blog-booking-date{align-items:center;appearance:none;-webkit-appearance:none;background:#fff;border:1px solid #CFE4C8;border-radius:12px;color:#1B5E20!important;cursor:pointer;display:grid;flex:0 0 auto;font-family:inherit;gap:2px;justify-items:center;margin:0;min-height:56px;min-width:54px;padding:7px 4px;text-align:center;text-decoration:none!important;}',
      '.bw-blog-booking-date.bw-selected{background:#1B5E20;border-color:#1B5E20;color:#fff!important;}.bw-blog-booking-date span,.bw-blog-booking-date b,.bw-blog-booking-date small{color:inherit!important;}',
      'body .bw-blog-booking-card .bw-blog-booking-dates .bw-selected,body .bw-blog-booking-card .bw-blog-booking-dates .bw-selected span,body .bw-blog-booking-card .bw-blog-booking-dates .bw-selected b,body .bw-blog-booking-card .bw-blog-booking-dates .bw-selected small{color:#fff!important;}',
      '.bw-blog-booking-date span{font-size:9px;font-weight:900;line-height:1;text-transform:uppercase;}.bw-blog-booking-date b{font-size:17px;font-weight:900;line-height:1;}.bw-blog-booking-date small{font-size:9px;font-weight:800;line-height:1.1;}',
      '.bw-blog-booking-date:hover,.bw-blog-booking-date:focus-visible{outline:2px solid #FFE600;outline-offset:2px;}',
      '.bw-blog-booking-more{align-items:center;background:#F8FBF4;border:1px solid #CFE4C8;border-radius:12px;color:#1B5E20!important;display:flex;flex:0 0 auto;justify-content:center;min-height:56px;min-width:46px;text-decoration:none!important;}.bw-blog-booking-more svg{display:block;width:19px;height:19px;}',
      '.bw-blog-booking-more:hover,.bw-blog-booking-more:focus-visible{outline:2px solid #FFE600;outline-offset:2px;}',
      '.bw-blog-booking-loading,.bw-blog-booking-empty{color:#4E5A4E;font-size:13px;font-weight:700;line-height:1.4;padding:10px 2px;}',
      '.bw-blog-booking-day{align-items:center;display:flex;flex-wrap:wrap;gap:8px;min-width:0;}.bw-blog-booking-times-label{color:#4E5A4E!important;font-size:11px;font-weight:900;letter-spacing:.06em;line-height:1;text-transform:uppercase;}.bw-blog-booking-times{display:flex;flex-wrap:wrap;gap:8px;}',
      '.bw-blog-booking-time{appearance:none;-webkit-appearance:none;background:#fff;border:1px solid #CFE4C8;border-radius:999px;color:#1B5E20!important;cursor:pointer;font-family:inherit;font-size:12px;font-weight:900;line-height:1;margin:0;padding:8px 12px;}.bw-blog-booking-time.bw-selected{background:#1B5E20;border-color:#1B5E20;color:#fff!important;}',
      '.bw-blog-booking-time:hover,.bw-blog-booking-time:focus-visible{outline:2px solid #FFE600;outline-offset:2px;}.bw-blog-booking-meta{color:#4E5A4E!important;flex:1 1 100%;font-size:11px;font-weight:600;line-height:1.35;margin:0;}',
      '.bw-blog-booking-cta{display:block;margin-top:2px;}.bw-blog-booking-cta a{align-items:center;background:#FFE600;border-radius:999px;color:#1B5E20!important;display:flex;font-size:14px;font-weight:900;justify-content:center;min-height:44px;padding:0 16px;text-decoration:none!important;width:100%;}.bw-blog-booking-cta a:hover,.bw-blog-booking-cta a:focus-visible{outline:2px solid #1B5E20;outline-offset:2px;}',
      '@media(max-width:640px){.bw-blog-booking-card{margin:24px 0;}.bw-blog-booking-strip{font-size:9px;letter-spacing:.1em;}.bw-blog-booking-inner{display:block;padding:12px;}.bw-blog-booking-media{float:left;width:92px;flex:none;margin:0 10px 4px 0;}.bw-blog-booking-media img{width:92px;height:92px;}.bw-blog-booking-body{display:block;padding:0;}.bw-blog-booking-title{font-size:16px!important;margin:0 0 6px!important;}.bw-blog-booking-facts{font-size:11.5px;}.bw-blog-booking-dates{clear:both;margin-top:10px;}.bw-blog-booking-day{margin-top:8px;}.bw-blog-booking-cta{margin-top:8px;}}'
    ].join('');
    document.head.appendChild(style);
  }

  function moreDatesChip() {
    return '<a class="bw-blog-booking-more" href="' + escapeAttr(bookingHref()) + '" target="_top" aria-label="See all tour dates"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"></rect><line x1="3" y1="10" x2="21" y2="10"></line><line x1="8" y1="3" x2="8" y2="7"></line><line x1="16" y1="3" x2="16" y2="7"></line></svg></a>';
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
    panel.querySelector('[data-bw-booking-meta]').textContent =
      (slot.openSpots === null || slot.openSpots > 0 ? 'Spots available' : 'Few spots left') +
      ' for ' + parts.weekday + ' ' + parts.day + ' ' + parts.month + ' · ends at Hackescher Markt';
    var cta = panel.querySelector('[data-bw-booking-cta]');
    cta.setAttribute('href', bookingHref(slot));
    cta.textContent = 'Reserve ' + parts.weekday + ' ' + parts.day + ' ' + parts.month + (startTime ? ' · ' + startTime : '');
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
      return '<button type="button" class="bw-blog-booking-date" data-bw-day-index="' + index + '" aria-pressed="false"><span>' + escapeHtml(parts.weekday) + '</span><b>' + escapeHtml(parts.day) + '</b><small>' + escapeHtml(parts.month) + '</small></button>';
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
    if (typeof window.fetch !== 'function') return;
    window.fetch(AVAILABILITY_URL, { cache: 'no-cache' })
      .then(function (response) { return response.json(); })
      .then(function (data) { setupPicker(panel, normalizeSlots(data && data.slots)); })
      .catch(function () {
        var dates = panel.querySelector('[data-bw-booking-dates]');
        if (dates) dates.innerHTML = '<div class="bw-blog-booking-empty">Dates are loading slowly. You can still check availability below.</div>';
      });
  }

  function buildBookingCard() {
    ensureBookingStyles();
    var wrapper = document.createElement('section');
    wrapper.setAttribute(BOOKING_MARKER, '1');
    wrapper.className = 'bw-blog-booking-card';
    wrapper.setAttribute('aria-label', 'Book the BerlinWalk walking tour');
    var imageBase = 'https://fenerszymanski.github.io/berlinwalk-widgets/gallery/images/01-800w';
    wrapper.innerHTML = [
      '<div class="bw-blog-booking-strip"><span>Free Berlin walking tour · live dates</span><span><span class="bw-star" aria-hidden="true">★</span> 9.8 / 10 on FreeTour</span></div>',
      '<div class="bw-blog-booking-inner"><div class="bw-blog-booking-media"><picture><source srcset="' + imageBase + '.webp" type="image/webp"><img src="' + imageBase + '.jpg" alt="BerlinWalk guide Yusuf leading guests outside the Altes Museum on Museum Island" loading="lazy"></picture></div>',
      '<div class="bw-blog-booking-body"><div class="bw-blog-booking-title" role="heading" aria-level="2">Berlin: Free Walking Tour of the Historic Centre</div><div class="bw-blog-booking-facts">Free, tip-based · about 2 hours · starts at the World Clock, Alexanderplatz</div>',
      '<div class="bw-blog-booking-dates" data-bw-booking-dates aria-label="Pick a tour date"><div class="bw-blog-booking-loading">Loading live tour dates...</div></div>',
      '<div class="bw-blog-booking-day" data-bw-booking-day hidden><span class="bw-blog-booking-times-label">Start time</span><div class="bw-blog-booking-times" data-bw-booking-times></div><span class="bw-blog-booking-meta" data-bw-booking-meta></span></div>',
      '<div class="bw-blog-booking-cta"><a href="' + escapeAttr(bookingHref()) + '" target="_top" data-bw-booking-cta>Check availability</a></div></div></div>'
    ].join('');
    loadDates(wrapper);
    return wrapper;
  }

  function todayString() {
    var now = new Date();
    return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
  }

  function maxDateString() {
    var max = new Date();
    max.setFullYear(max.getFullYear() + 3);
    return max.getFullYear() + '-' + String(max.getMonth() + 1).padStart(2, '0') + '-' + String(max.getDate()).padStart(2, '0');
  }

  function isCalendarDate(value) {
    var match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return false;
    var year = Number(match[1]);
    var month = Number(match[2]);
    var day = Number(match[3]);
    var date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  }

  function validDateFields(arrival, nights, today, maximum) {
    var min = String(today || todayString());
    var max = String(maximum || maxDateString());
    return isCalendarDate(arrival) && isCalendarDate(min) && isCalendarDate(max) &&
      String(arrival) >= min &&
      String(arrival) <= max &&
      /^[1-7]$/.test(String(nights || ''));
  }

  function shouldRequestDatePicker(viewportWidth, clientX, inputRight) {
    if (Number(viewportWidth || 0) < 701) return true;
    return Number(clientX || 0) > 0 && Number(clientX) >= Number(inputRight || 0) - 52;
  }

  function analyticsAllowed() {
    try {
      var manager = window.consentPolicyManager;
      var current = manager && typeof manager.getCurrentConsentPolicy === 'function'
        ? manager.getCurrentConsentPolicy() : null;
      var policy = current && (current.policy || current) || {};
      return policy.analytics === true;
    } catch (err) {
      return false;
    }
  }

  function pushDateCheckEvent(name, slug, variant) {
    if (!analyticsAllowed()) return false;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: name,
      placement: 'blog_inline_after_tour',
      source_slug: slug || currentSlug(),
      experiment: 'date_check_blog_card_2026_08',
      variant: normaliseDateCheckVariant(variant) || 'form'
    });
    return true;
  }

  function trackDateCheckSeen(card, slug, variant) {
    if (!card || card.getAttribute('data-bw-date-check-seen-bound') === '1') return;
    card.setAttribute('data-bw-date-check-seen-bound', '1');
    if (typeof window.IntersectionObserver !== 'function') return;
    var observer = new window.IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (!entries[i].isIntersecting || entries[i].intersectionRatio < 0.5) continue;
        pushDateCheckEvent('bw_date_check_blog_card_seen', slug, variant);
        card.setAttribute('data-bw-date-check-seen', '1');
        observer.disconnect();
        break;
      }
    }, { threshold: [0.5] });
    observer.observe(card);
  }

  function normaliseDateCheckVariant(value) {
    var token = String(value || '').trim().toLowerCase();
    return DATE_CHECK_VARIANTS.indexOf(token) > -1 ? token : '';
  }

  // Assignment order: explicit QA override, then this page load's own choice,
  // then the session (only once analytics consent is granted, matching the
  // bouncer experiment), then a fresh 50/50 draw. Without consent the reader
  // still gets a valid coin flip, it just does not follow them across posts.
  function dateCheckCardVariant() {
    var override = '';
    try {
      override = normaliseDateCheckVariant(new URLSearchParams(window.location.search || '').get('bw_dc_variant'));
    } catch (err) { override = ''; }
    if (override) return override;
    if (dateCheckVariantMemo) return dateCheckVariantMemo;
    var canPersist = analyticsAllowed();
    var stored = '';
    if (canPersist) {
      try { stored = normaliseDateCheckVariant(window.sessionStorage.getItem(DATE_CHECK_VARIANT_KEY)); } catch (err) { stored = ''; }
    }
    var variant = stored || (Math.random() < 0.5 ? 'form' : 'oneclick');
    dateCheckVariantMemo = variant;
    if (canPersist && !stored) {
      try { window.sessionStorage.setItem(DATE_CHECK_VARIANT_KEY, variant); } catch (err) {}
    }
    return variant;
  }

  function dateCheckTargetUrl(destination, sourceSlug, arrival, nights, baseHref, variant) {
    var url = new URL(destination || DATE_CHECK_URL, baseHref || window.location.href);
    // The one-click variant carries no dates, so the tool asks for them itself.
    if (arrival) url.searchParams.set('arrival', arrival);
    if (nights) url.searchParams.set('nights', nights);
    url.searchParams.set('utm_source', 'blog');
    url.searchParams.set('utm_medium', 'inline_tool');
    url.searchParams.set('utm_campaign', 'berlin_date_check');
    url.searchParams.set('utm_content', sourceSlug || 'blog-post');
    url.searchParams.set('utm_term', normaliseDateCheckVariant(variant) || 'form');
    return url;
  }

  function ensureDateCheckStyles() {
    if (document.getElementById(DATE_CHECK_STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = DATE_CHECK_STYLE_ID;
    style.textContent = [
      '.bw-date-check-blog-card{--bw-green:#1B5E20;--bw-green-ink:#123D18;--bw-yellow:#FFE600;--bw-cream:#FAFAF5;--bw-line:#BFD3B8;display:grid;grid-template-columns:minmax(0,46%) minmax(0,54%);width:100%;margin:28px 0;border:1.5px solid var(--bw-green);border-radius:18px;overflow:hidden;background:var(--bw-cream);color:#212121;box-shadow:0 16px 36px -26px rgba(18,61,24,.58);font-family:Montserrat,Arial,sans-serif;box-sizing:border-box}',
      '.bw-date-check-blog-card *{box-sizing:border-box}.bw-date-check-blog-card__visual,.bw-date-check-blog-card__form{min-width:0}.bw-date-check-blog-card__visual{position:relative;min-height:320px;overflow:hidden;background:#0B351A}.bw-date-check-blog-card__visual img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:48% 50%}',
      '.bw-date-check-blog-card__scrim{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:26px;background:linear-gradient(180deg,rgba(8,45,22,.10) 18%,rgba(8,45,22,.94) 100%);color:#fff}.bw-date-check-blog-card[data-bw-date-check-card] .bw-date-check-blog-card__eyebrow{margin:0 0 10px!important;padding:0!important;font:700 11px/1.35 "IBM Plex Mono",monospace!important;letter-spacing:.14em!important;text-transform:uppercase;color:var(--bw-yellow)!important}',
      '.bw-date-check-blog-card[data-bw-date-check-card] .bw-date-check-blog-card__title{margin:0!important;padding:0!important;font-family:Fraunces,Georgia,serif!important;font-size:clamp(29px,4vw,40px)!important;font-weight:700!important;line-height:1.02!important;letter-spacing:-.02em!important;color:#fff!important}.bw-date-check-blog-card[data-bw-date-check-card] .bw-date-check-blog-card__copy{margin:12px 0 0!important;padding:0!important;font:400 15px/1.48 Montserrat,Arial,sans-serif!important;letter-spacing:0!important;color:rgba(255,255,255,.94)!important}.bw-date-check-blog-card__proof{display:flex;flex-wrap:wrap;gap:6px;margin-top:17px}.bw-date-check-blog-card[data-bw-date-check-card] .bw-date-check-blog-card__proof span{margin:0!important;padding:5px 7px!important;border:1px solid rgba(255,255,255,.52);font:400 9px/1.35 "IBM Plex Mono",monospace!important;letter-spacing:.06em!important;text-transform:uppercase;color:#fff!important}',
      '.bw-date-check-blog-card__form{display:flex;flex-direction:column;justify-content:center;gap:17px;min-width:0;max-width:100%;padding:30px}.bw-date-check-blog-card__fields{display:grid;grid-template-columns:minmax(0,1fr) minmax(112px,.42fr);gap:12px;width:100%;min-width:0;max-width:100%}.bw-date-check-blog-card__field{display:flex;flex-direction:column;gap:7px;width:100%;min-width:0;max-width:100%}.bw-date-check-blog-card__field label{font-family:"IBM Plex Mono",monospace;font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--bw-green-ink)}',
      '.bw-date-check-blog-card__date-control{position:relative;display:flex;align-items:center;inline-size:100%;width:100%;min-inline-size:0;min-width:0;max-inline-size:100%;max-width:100%;height:54px;min-height:54px;overflow:hidden;contain:inline-size;border:1.5px solid var(--bw-green-ink);border-radius:8px;background:#fff}.bw-date-check-blog-card__date-display{display:flex;align-items:center;width:100%;height:100%;min-width:0;padding:0 14px;color:#58705C;font:600 16px/1 Montserrat,Arial,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;pointer-events:none}.bw-date-check-blog-card__date-control[data-has-value="1"] .bw-date-check-blog-card__date-display{color:#212121}.bw-date-check-blog-card__date-control input{position:absolute!important;inset:0!important;display:block!important;inline-size:100%!important;width:100%!important;min-inline-size:0!important;min-width:0!important;max-inline-size:100%!important;max-width:100%!important;height:100%!important;min-height:100%!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;box-sizing:border-box!important;background:transparent!important;color:transparent!important;-webkit-text-fill-color:transparent!important;font:600 16px/1 Montserrat,Arial,sans-serif!important;opacity:0!important;cursor:pointer}.bw-date-check-blog-card__field select{display:block;inline-size:100%!important;width:100%!important;min-inline-size:0!important;min-width:0!important;max-inline-size:100%!important;max-width:100%!important;height:54px;min-height:54px;margin:0!important;padding:0 14px!important;border:1.5px solid var(--bw-green-ink);border-radius:8px;background:#fff;color:#212121!important;font:600 16px/1 Montserrat,Arial,sans-serif!important;box-sizing:border-box!important}.bw-date-check-blog-card__date-control:focus-within,.bw-date-check-blog-card__field select:focus{outline:3px solid rgba(255,230,0,.68);outline-offset:2px}',
      '@media(min-width:701px){.bw-date-check-blog-card__date-display{display:none}.bw-date-check-blog-card__date-control input{position:relative!important;inset:auto!important;padding:0 14px!important;background:#fff!important;color:#212121!important;-webkit-text-fill-color:#212121!important;opacity:1!important;cursor:text;color-scheme:light}.bw-date-check-blog-card__date-control input::-webkit-calendar-picker-indicator{cursor:pointer}}',
      '.bw-date-check-blog-card__submit{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;min-height:56px;padding:13px 18px;border:1.5px solid var(--bw-yellow);border-radius:8px;background:var(--bw-yellow);color:var(--bw-green-ink)!important;font:800 16px/1.2 Montserrat,Arial,sans-serif;text-align:left;cursor:pointer;text-decoration:none!important}.bw-date-check-blog-card__submit:hover,.bw-date-check-blog-card__submit:focus,.bw-date-check-blog-card__submit:active,.bw-date-check-blog-card__submit:visited{background:#F4DC00;color:var(--bw-green-ink)!important;text-decoration:none!important}.bw-date-check-blog-card__submit:focus{outline:3px solid rgba(27,94,32,.24);outline-offset:2px}.bw-date-check-blog-card__arrow{font-size:24px;line-height:1}',
      '.bw-date-check-blog-card[data-bw-date-check-card] .bw-date-check-blog-card__micro{margin:0!important;padding:0!important;font:500 12.5px/1.5 Montserrat,Arial,sans-serif!important;letter-spacing:0!important;color:#58705C!important}.bw-date-check-blog-card[data-bw-date-check-card] .bw-date-check-blog-card__status{min-height:18px;margin:0!important;padding:0!important;color:#A2222B!important;font:700 12.5px/1.4 Montserrat,Arial,sans-serif!important;overflow-wrap:anywhere}.bw-date-check-blog-card__status:empty{display:none}',
      '@media(max-width:700px){.bw-date-check-blog-card{grid-template-columns:1fr}.bw-date-check-blog-card__visual{min-height:260px}.bw-date-check-blog-card__scrim{padding:22px}.bw-date-check-blog-card__form{padding:24px}.bw-date-check-blog-card__fields{grid-template-columns:minmax(0,1fr) minmax(105px,.42fr)}}',
      '@media(max-width:430px){.bw-date-check-blog-card{margin:22px 0;border-radius:14px}.bw-date-check-blog-card__visual{min-height:260px}.bw-date-check-blog-card[data-bw-date-check-card] .bw-date-check-blog-card__title{font-size:34px!important}.bw-date-check-blog-card[data-bw-date-check-card] .bw-date-check-blog-card__copy{font-size:14.5px!important}.bw-date-check-blog-card__form{padding:20px}.bw-date-check-blog-card__fields{grid-template-columns:minmax(0,1fr)}.bw-date-check-blog-card__date-control,.bw-date-check-blog-card__field select{height:52px;min-height:52px}.bw-date-check-blog-card__submit{min-height:54px;font-size:15px}}',
      'html body .bw-c-date-card a.bw-date-check-blog-card__submit{align-items:center!important;display:inline-flex!important;gap:10px!important;width:auto!important;text-decoration:none!important}',
      '.bw-date-check-blog-card__form>.bw-c-date-intro{display:block}.bw-date-check-blog-card[data-bw-date-check-card] .bw-date-check-blog-card__form>.bw-c-date-intro h2.bw-date-check-blog-card__title{margin:0 0 8px!important;padding:0!important;font-family:Montserrat,Arial,sans-serif!important;font-size:22px!important;font-weight:900!important;line-height:1.25!important;letter-spacing:0!important;color:#212121!important}',
      '.bw-date-check-blog-card[data-bw-date-check-card] .bw-date-check-blog-card__form>.bw-c-date-intro p{margin:0!important;padding:0!important;font:400 15px/1.6 Merriweather,Georgia,serif!important;color:#5C665A!important}',
      '@media(prefers-reduced-motion:reduce){.bw-date-check-blog-card *{scroll-behavior:auto!important;transition:none!important}}'
    ].join('');
    document.head.appendChild(style);
  }

  function currentSlug() {
    var match = location.pathname.match(/\/post\/([^/?#]+)/);
    return match ? decodeURIComponent(match[1]) : 'blog-post';
  }

  function dateCheckVisualHtml(id, withHeadline) {
    return [
      '<div class="bw-date-check-blog-card__visual"><img src="' + DATE_CHECK_IMAGE + '" alt="World Clock at Alexanderplatz" loading="lazy" decoding="async"><div class="bw-date-check-blog-card__scrim">',
      '<div class="bw-date-check-blog-card__eyebrow">Berlin Date Check</div>',
      withHeadline === false ? '' : '<h2 class="bw-date-check-blog-card__title" id="' + id + '-title">Check your Berlin trip dates</h2><div class="bw-date-check-blog-card__copy">See closures, book-by dates and daylight for your exact stay.</div>',
      '<div class="bw-date-check-blog-card__proof" aria-label="Date Check covers"><span>Closures</span><span>Book-by</span><span>Daylight</span></div></div></div>'
    ].join('');
  }

  // Variant B: same eyebrow, headline, copy and proof chips as the form arm.
  // The only thing that changes is that the two fields are gone, so the arms
  // differ in friction and not in wording.
  function buildDateCheckOneClickCard(card, id, slug) {
    var href = dateCheckTargetUrl(DATE_CHECK_URL, slug, '', '', window.location.href, 'oneclick').toString();
    // Redesign C, which owns how this card actually looks on a live post, is
    // loaded from a pinned jsDelivr commit. It moves the headline and copy into
    // the panel itself, but only for a card that has date fields, so this arm
    // ships that structure ready-made instead of waiting to be rewritten. Its
    // scrim therefore carries no headline, which also keeps the text from
    // appearing twice if the skin is ever off.
    card.innerHTML = [
      dateCheckVisualHtml(id, false),
      '<div class="bw-date-check-blog-card__form">',
      '<div class="bw-c-date-intro"><h2 class="bw-date-check-blog-card__title" id="' + id + '-title">Check your Berlin trip dates</h2>',
      '<p>See closures, book-by dates and daylight for your exact stay.</p></div>',
      '<a class="bw-date-check-blog-card__submit" href="' + escapeAttr(href) + '" target="_top" rel="noopener"><span>Check my Berlin dates</span><span class="bw-date-check-blog-card__arrow" aria-hidden="true">\u2192</span></a>',
      '<div class="bw-date-check-blog-card__micro">Takes about 20 seconds. No email needed for the result.</div></div>'
    ].join('');
    var link = card.querySelector('a.bw-date-check-blog-card__submit');
    link.addEventListener('click', function () {
      pushDateCheckEvent('bw_date_check_blog_card_submit', slug, 'oneclick');
    });
    pushDateCheckEvent('bw_date_check_blog_card_mount', slug, 'oneclick');
    trackDateCheckSeen(card, slug, 'oneclick');
    return card;
  }

  function buildDateCheckCard(slug, forcedVariant) {
    ensureDateCheckStyles();
    dateCardCount += 1;
    var id = 'bw-date-check-blog-card-' + dateCardCount;
    var variant = normaliseDateCheckVariant(forcedVariant) || dateCheckCardVariant();
    var card = document.createElement('aside');
    card.setAttribute(DATE_CHECK_MARKER, '1');
    card.setAttribute('data-bw-leadform', '1');
    card.setAttribute('data-bw-date-check-variant', variant);
    card.className = 'bw-date-check-blog-card';
    card.setAttribute('role', 'region');
    card.setAttribute('aria-labelledby', id + '-title');
    if (variant === 'oneclick') return buildDateCheckOneClickCard(card, id, slug);
    card.innerHTML = [
      dateCheckVisualHtml(id, true),
      '<form class="bw-date-check-blog-card__form" method="get" action="' + escapeAttr(DATE_CHECK_URL) + '" target="_top">',
      // Without these the native GET fallback would arrive untagged and the
      // experiment would silently undercount this variant.
      '<input type="hidden" name="utm_source" value="blog"><input type="hidden" name="utm_medium" value="inline_tool">',
      '<input type="hidden" name="utm_campaign" value="berlin_date_check"><input type="hidden" name="utm_content" value="' + escapeAttr(slug || 'blog-post') + '">',
      '<input type="hidden" name="utm_term" value="form">',
      '<div class="bw-date-check-blog-card__fields"><div class="bw-date-check-blog-card__field"><label for="' + id + '-arrival">When do you arrive?</label><div class="bw-date-check-blog-card__date-control" data-has-value="0"><span class="bw-date-check-blog-card__date-display" aria-hidden="true">Select arrival date</span><input id="' + id + '-arrival" name="arrival" type="date" min="' + todayString() + '" max="' + maxDateString() + '" required></div></div>',
      '<div class="bw-date-check-blog-card__field"><label for="' + id + '-nights">Nights</label><select id="' + id + '-nights" name="nights" required><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4" selected>4</option><option value="5">5</option><option value="6">6</option><option value="7">7+</option></select></div></div>',
      '<button class="bw-date-check-blog-card__submit" type="submit"><span>Check my Berlin dates</span><span class="bw-date-check-blog-card__arrow" aria-hidden="true">→</span></button>',
      '<div class="bw-date-check-blog-card__micro">The result is built around your arrival date and number of nights.</div><div class="bw-date-check-blog-card__status" role="status" aria-live="polite"></div></form>'
    ].join('');
    var form = card.querySelector('form');
    var status = card.querySelector('.bw-date-check-blog-card__status');
    var arrivalInput = form.elements.arrival;
    var dateControl = card.querySelector('.bw-date-check-blog-card__date-control');
    var dateDisplay = card.querySelector('.bw-date-check-blog-card__date-display');
    var syncDateDisplay = function () {
      var value = arrivalInput.value;
      var parts = String(value || '').split('-').map(Number);
      var valid = parts.length === 3 && parts[0] > 0 && parts[1] > 0 && parts[2] > 0;
      dateControl.setAttribute('data-has-value', valid ? '1' : '0');
      dateDisplay.textContent = valid
        ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(parts[0], parts[1] - 1, parts[2])))
        : 'Select arrival date';
    };
    arrivalInput.addEventListener('input', syncDateDisplay);
    arrivalInput.addEventListener('change', syncDateDisplay);
    arrivalInput.addEventListener('click', function (event) {
      var inputRect = arrivalInput.getBoundingClientRect();
      if (!shouldRequestDatePicker(window.innerWidth, event.clientX, inputRect.right)) return;
      if (typeof arrivalInput.showPicker !== 'function') return;
      try { arrivalInput.showPicker(); } catch (err) {}
    });
    syncDateDisplay();
    var started = false;
    var markStart = function () {
      if (started) return;
      started = true;
      pushDateCheckEvent('bw_date_check_blog_card_start', slug, 'form');
    };
    arrivalInput.addEventListener('focus', markStart);
    form.elements.nights.addEventListener('focus', markStart);
    pushDateCheckEvent('bw_date_check_blog_card_mount', slug, 'form');
    trackDateCheckSeen(card, slug, 'form');
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      status.textContent = '';
      var arrival = form.elements.arrival.value;
      var nights = form.elements.nights.value;
      if (!validDateFields(arrival, nights, form.elements.arrival.min, form.elements.arrival.max)) {
        status.textContent = arrival ? 'Choose a valid stay length and date.' : 'Choose your arrival date.';
        if (!arrival) form.elements.arrival.focus();
        return;
      }
      var target = dateCheckTargetUrl(DATE_CHECK_URL, slug, arrival, nights, window.location.href, 'form');
      pushDateCheckEvent('bw_date_check_blog_card_submit', slug, 'form');
      var CustomEventCtor = window.CustomEvent || CustomEvent;
      var handoff = new CustomEventCtor('bw-date-check-blog-submit', { bubbles: true, cancelable: true, detail: { arrival: arrival, nights: Number(nights), targetUrl: target.toString() } });
      if (!card.dispatchEvent(handoff)) {
        status.textContent = 'Preview target: ' + target.pathname + target.search;
        return;
      }
      window.location.assign(target.toString());
    });
    return card;
  }

  function queryAll(selector) {
    return document.querySelectorAll(selector);
  }

  function firstSurface(marker) {
    var matches = queryAll('[' + marker + ']');
    return matches.length ? matches[0] : null;
  }

  function removeDuplicateSurfaces(marker) {
    var matches = queryAll('[' + marker + ']');
    for (var i = 1; i < matches.length; i++) {
      if (matches[i].parentNode) matches[i].parentNode.removeChild(matches[i]);
    }
    return matches.length ? matches[0] : null;
  }

  function insertAfter(point, node) {
    if (!point || !point.parent || !point.after || !node) return false;
    point.parent.insertBefore(node, point.after.nextSibling || null);
    return true;
  }

  function ensureSurfacePosition(point, node) {
    if (!point || !point.parent || !point.after || !node) return false;
    if (point.after.nextSibling === node && node.parentNode === point.parent) return true;
    return insertAfter(point, node);
  }

  function findContentColumn(body) {
    if (!body || !body.querySelectorAll || !body.getBoundingClientRect) return null;
    var bodyRect = body.getBoundingClientRect();
    if (!bodyRect || bodyRect.width < 360) return null;
    var nodes = body.querySelectorAll('p,h2,h3,blockquote,figure');
    var groups = {};
    var best = null;
    for (var i = 0; i < nodes.length; i++) {
      var candidate = nodes[i];
      if (!isVisible(candidate) || hasSurfaceAncestor(candidate)) continue;
      var tag = (candidate.tagName || '').toUpperCase();
      if (tag !== 'FIGURE' && cleanText(candidate.textContent).length < 18) continue;
      var rect = candidate.getBoundingClientRect();
      if (!rect || rect.width < 320 || rect.width > bodyRect.width - 8) continue;
      if (rect.left < bodyRect.left - 1 || rect.right > bodyRect.right + 1) continue;
      var left = Math.round(rect.left);
      var right = Math.round(rect.right);
      var key = left + ':' + right;
      if (!groups[key]) groups[key] = { left: left, right: right, width: right - left, count: 0 };
      groups[key].count += 1;
      if (!best || groups[key].count > best.count ||
          (groups[key].count === best.count && groups[key].width > best.width)) {
        best = groups[key];
      }
    }
    return best;
  }

  function syncSurfaceGutters(node, body, expandMobileGutters) {
    if (!node || !body || !node.style || !node.getBoundingClientRect || !body.getBoundingClientRect) return false;
    node.style.removeProperty('width');
    node.style.removeProperty('max-width');
    node.style.removeProperty('margin-left');
    node.style.removeProperty('margin-right');
    var nodeRect = node.getBoundingClientRect();
    var viewportWidth = window.innerWidth || 0;
    if (viewportWidth >= 900) {
      var column = findContentColumn(body);
      if (column && column.width >= 320) {
        var offset = column.left - nodeRect.left;
        node.style.setProperty('width', column.width + 'px', 'important');
        node.style.setProperty('max-width', column.width + 'px', 'important');
        node.style.setProperty('margin-left', offset + 'px', 'important');
        node.style.setProperty('margin-right', '0px', 'important');
        return true;
      }
    }
    if (!expandMobileGutters) return true;
    var bodyRect = body.getBoundingClientRect();
    var left = Math.max(0, nodeRect.left - bodyRect.left);
    var right = Math.max(0, bodyRect.right - nodeRect.right);
    if (left + right < 0.5) {
      return true;
    }
    node.style.setProperty('width', 'calc(100% + ' + (left + right) + 'px)');
    node.style.setProperty('margin-left', (-left) + 'px', 'important');
    node.style.setProperty('margin-right', (-right) + 'px', 'important');
    return true;
  }

  function injectSurfaces() {
    if (!ENABLED || !isSurfacePath()) return false;
    var body = findPostBody();
    if (!body) return false;
    var booking = removeDuplicateSurfaces(BOOKING_MARKER);
    var dateCard = removeDuplicateSurfaces(DATE_CHECK_MARKER);
    var bookingPoint = findBookingInsertionPoint(body);
    if (!booking) {
      if (bookingPoint) booking = buildBookingCard();
      if (booking && !insertAfter(bookingPoint, booking)) booking = null;
    } else if (!ensureSurfacePosition(bookingPoint, booking)) {
      booking = null;
    }
    var datePoint = findDateCheckInsertionPoint(body, bookingPoint);
    if (!datePoint && booking && booking.parentNode) datePoint = { parent: booking.parentNode, after: booking };
    if (!dateCard) {
      if (datePoint) dateCard = buildDateCheckCard(currentSlug());
      if (dateCard && !insertAfter(datePoint, dateCard)) dateCard = null;
    } else if (!ensureSurfacePosition(datePoint, dateCard)) {
      dateCard = null;
    }
    if (booking) syncSurfaceGutters(booking, body, false);
    if (dateCard) syncSurfaceGutters(dateCard, body, true);
    if (booking && dateCard) {
      retries = 0;
      return true;
    }
    return false;
  }

  function scheduleInject(delay) {
    if (retryTimer) window.clearTimeout(retryTimer);
    retryTimer = window.setTimeout(function () {
      retryTimer = null;
      if (injectSurfaces()) return;
      if (retries >= MAX_RETRIES) return;
      var nextDelay = RETRY_DELAYS[Math.min(retries, RETRY_DELAYS.length - 1)];
      retries += 1;
      scheduleInject(nextDelay);
    }, Number(delay) || 0);
  }

  function startObserver() {
    if (observer) observer.disconnect();
    if (typeof window.MutationObserver !== 'function' || !document.body) return;
    observer = new window.MutationObserver(function () {
      if (!isSurfacePath()) return;
      scheduleInject(80);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function removeSurfaces() {
    [BOOKING_MARKER, DATE_CHECK_MARKER].forEach(function (marker) {
      queryAll('[' + marker + ']').forEach(function (node) {
        if (node.parentNode) node.parentNode.removeChild(node);
      });
    });
    if (observer) observer.disconnect();
  }

  function boot() {
    retries = 0;
    scheduleInject(0);
    startObserver();
  }

  if (window.BW_BLOG_INJECTOR_TEST_HOOKS === true) {
    window.__bwBlogInjectorTestHooks = {
      dateCheckTargetUrl: dateCheckTargetUrl,
      dateCheckCardVariant: dateCheckCardVariant,
      normaliseDateCheckVariant: normaliseDateCheckVariant,
      resetDateCheckVariantMemo: function () { dateCheckVariantMemo = ''; },
      validDateFields: validDateFields,
      shouldRequestDatePicker: shouldRequestDatePicker,
      insertionTarget: insertionTarget,
      findContentColumn: findContentColumn,
      syncSurfaceGutters: syncSurfaceGutters,
      findDateCheckInsertionPoint: findDateCheckInsertionPoint,
      findBookingInsertionPoint: findBookingInsertionPoint
    };
    return;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  window.setInterval(function () {
    if (location.pathname === lastPath) return;
    lastPath = location.pathname;
    removeSurfaces();
    if (isSurfacePath() && !DISABLED) boot();
  }, 300);
  window.addEventListener('resize', function () {
    if (isSurfacePath() && !DISABLED) scheduleInject(80);
  });
})();
