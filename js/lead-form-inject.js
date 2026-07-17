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
  var HISTORY_ELEMENT_TAG = 'bw-history-lead-magnet';
  var HISTORY_MARKER = 'data-bw-history-lead';
  var HISTORY_EXPERIMENT_ID = 'history_story_lead_v1';
  var HISTORY_STORAGE_KEY = 'bwHistoryLeadExperiment.v1';
  var HISTORY_API_BASE = window.BW_HISTORY_LEAD_API_BASE || 'https://app.berlinwalk.com/api/history-lead';
  var HISTORY_ELEMENT_URL = window.BW_HISTORY_LEAD_ELEMENT_URL || 'https://fenerszymanski.github.io/berlinwalk-widgets/history-lead-magnet/history-lead-magnet-element.js';
  var HISTORY_RAMP_SLUG = 'why-berlin-doesn-t-have-a-beautiful-old-town-and-why-that-s-the-point';
  var HISTORY_PILOT_SLUG = 'why-berlin-s-streets-are-so-wide-it-wasn-t-always-the-plan';
  var HISTORY_EXPANSION_SLUG = 'alexanderplatz-then-and-now-from-medieval-market-to-modern-chaos';

  var injections = 0;
  var reinjectTimer = null;
  var observer = null;
  var lastPath = location.pathname;
  var historyElementPromise = null;
  var historyInsertionPending = false;
  var historyMemoryBucket = null;
  var pendingHistoryViews = {};
  var sentHistoryViews = {};

  function isPostPage() {
    return location.pathname.indexOf('/post/') === 0 ||
      window.BW_ENABLE_BLOG_BOOKING === true ||
      /[?&]bwBlogBooking=1(?:&|$)/.test(location.search);
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
    /* Wix wraps every rich-content block in its own div, so walking
     * nextElementSibling from a heading never reaches that section's
     * paragraphs. Work in document order over the visible h2/p blocks
     * instead: insert after the first real paragraph that follows the
     * 2nd H2 (~25% depth), staying inside that section. */
    var blocks = [];
    var all = body.querySelectorAll('h2, p');
    for (var i = 0; i < all.length; i++) {
      if (isVisible(all[i])) blocks.push(all[i]);
    }

    var headingIndexes = [];
    for (var h = 0; h < blocks.length; h++) {
      if (blocks[h].tagName.toUpperCase() === 'H2') headingIndexes.push(h);
    }

    if (headingIndexes.length) {
      var anchorIndex = headingIndexes.length >= 2 ? headingIndexes[1] : headingIndexes[0];
      var sectionEnd = blocks.length;
      for (var s = 0; s < headingIndexes.length; s++) {
        if (headingIndexes[s] > anchorIndex) { sectionEnd = headingIndexes[s]; break; }
      }
      for (var j = anchorIndex + 1; j < sectionEnd; j++) {
        var block = blocks[j];
        if (block.tagName.toUpperCase() !== 'P') continue;
        if (!block.textContent.trim()) continue;
        if (block.closest && block.closest('figure,li,blockquote')) continue;
        return block;
      }
      return blocks[anchorIndex];
    }

    var paragraphs = [];
    for (var p = 0; p < blocks.length; p++) {
      if (blocks[p].tagName.toUpperCase() === 'P') paragraphs.push(blocks[p]);
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

  /* The history lead experiment defaults to QA-only. A Wix Custom Code config
   * must explicitly set stage to "ramp", "pilot", or "expanded" before normal
   * visitors can receive the lead-magnet variant. This keeps a code deploy from
   * starting the experiment before the API and approved photos are ready. */
  function historyConfig() {
    var override = window.BW_HISTORY_LEAD_EXPERIMENT_CONFIG || {};
    return {
      enabled: override.enabled !== false,
      stage: String(override.stage || 'qa').toLowerCase(),
      safetyStartedAt: String(override.safetyStartedAt || ''),
      rampWeight: Number.isFinite(Number(override.rampWeight)) ? Number(override.rampWeight) : 0.10,
      pilotWeight: Number.isFinite(Number(override.pilotWeight)) ? Number(override.pilotWeight) : 0.50,
      expandedWeight: Number.isFinite(Number(override.expandedWeight)) ? Number(override.expandedWeight) : 0.50,
      enableExpansion: override.enableExpansion === true
    };
  }

  function historyEffectiveStage(config) {
    if (config.stage !== 'safety') return config.stage;
    var startedAt = new Date(config.safetyStartedAt).getTime();
    if (!Number.isFinite(startedAt) || startedAt > Date.now()) return 'qa';
    return Date.now() - startedAt >= 24 * 60 * 60 * 1000 ? 'pilot' : 'ramp';
  }

  function historyQueryChoice() {
    var match = String(location.search || '').match(/[?&]bwHistoryLead=([^&]+)/);
    if (!match) return '';
    var value = decodeURIComponent(match[1] || '').toLowerCase();
    if (value === '0' || value === 'off') return 'off';
    if (value === 'control') return 'control';
    if (value === '1' || value === 'on' || value === 'variant') return 'variant';
    return '';
  }

  function historySlug() {
    var parts = String(location.pathname || '').replace(/\/+$/, '').split('/');
    try { return decodeURIComponent(parts[parts.length - 1] || ''); }
    catch (err) { return parts[parts.length - 1] || ''; }
  }

  function currentConsentPolicy() {
    try {
      var manager = window.consentPolicyManager;
      var current = manager && typeof manager.getCurrentConsentPolicy === 'function'
        ? manager.getCurrentConsentPolicy()
        : null;
      current = current && (current.policy || current);
      if (current && Object.keys(current).length) return current;
    } catch (err) {}
    try {
      var match = document.cookie.match(/(?:^|;\s*)consent-policy=([^;]+)/);
      return match ? JSON.parse(decodeURIComponent(match[1])) : {};
    } catch (err) {
      return {};
    }
  }

  function historyAnalyticsAllowed() {
    var policy = currentConsentPolicy();
    return policy.analytics === true || policy.anl === true || policy.anl === 1;
  }

  function randomHistoryBucket() {
    try {
      if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
        var values = new Uint32Array(1);
        window.crypto.getRandomValues(values);
        return values[0] / 4294967296;
      }
    } catch (err) {}
    return Math.random();
  }

  function readStoredHistoryBucket() {
    if (!historyAnalyticsAllowed()) return null;
    try {
      var raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : null;
      if (parsed && parsed.experiment === HISTORY_EXPERIMENT_ID && typeof parsed.bucket === 'number' && parsed.bucket >= 0 && parsed.bucket < 1) {
        return parsed.bucket;
      }
    } catch (err) {}
    return null;
  }

  function rememberHistoryBucket() {
    if (!historyAnalyticsAllowed() || historyMemoryBucket === null) return;
    try {
      window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify({
        experiment: HISTORY_EXPERIMENT_ID,
        bucket: historyMemoryBucket,
        assignedAt: new Date().toISOString()
      }));
    } catch (err) {}
  }

  function historyBucket() {
    if (historyMemoryBucket !== null) {
      rememberHistoryBucket();
      return historyMemoryBucket;
    }
    var stored = readStoredHistoryBucket();
    historyMemoryBucket = stored === null ? randomHistoryBucket() : stored;
    rememberHistoryBucket();
    return historyMemoryBucket;
  }

  function historyStageEligibility(stage, slug) {
    if (stage === 'ramp') return slug === HISTORY_RAMP_SLUG;
    if (stage === 'pilot') return slug === HISTORY_RAMP_SLUG || slug === HISTORY_PILOT_SLUG;
    if (stage === 'expanded') return slug === HISTORY_RAMP_SLUG || slug === HISTORY_PILOT_SLUG || slug === HISTORY_EXPANSION_SLUG;
    return false;
  }

  function historyStageWeight(config, stage) {
    stage = stage || historyEffectiveStage(config);
    if (stage === 'ramp') return Math.max(0, Math.min(1, config.rampWeight));
    if (stage === 'pilot') return Math.max(0, Math.min(1, config.pilotWeight));
    if (stage === 'expanded' && config.enableExpansion) return Math.max(0, Math.min(1, config.expandedWeight));
    return 0;
  }

  function historyAssignment() {
    var config = historyConfig();
    var stage = historyEffectiveStage(config);
    var choice = historyQueryChoice();
    var slug = historySlug();
    var globallyDisabled = window.BW_DISABLE_HISTORY_LEAD === true || choice === 'off' || !config.enabled;
    if (globallyDisabled) return { variant: 'control', inExperiment: false, qa: false, stage: stage };
    if (choice === 'variant') return { variant: 'variant', inExperiment: true, qa: true, stage: 'qa' };
    if (choice === 'control') return { variant: 'control', inExperiment: true, qa: true, stage: 'qa' };
    if (stage === 'expanded' && !config.enableExpansion) stage = 'pilot';
    var eligible = historyStageEligibility(stage, slug);
    if (!eligible) return { variant: 'control', inExperiment: false, qa: false, stage: stage };
    return {
      variant: historyBucket() < historyStageWeight(config, stage) ? 'variant' : 'control',
      inExperiment: true,
      qa: false,
      stage: stage
    };
  }

  function safeHistoryUrl(value) {
    try {
      var url = new URL(String(value || ''), window.location.href);
      if (url.protocol !== 'https:' && url.protocol !== 'http:') return '';
      return url.origin + url.pathname;
    } catch (err) {
      return '';
    }
  }

  function cleanHistoryAttribution(value) {
    var cleaned = String(value || '').trim().slice(0, 180);
    return /@|%40/i.test(cleaned) ? '' : cleaned;
  }

  function historyUtm() {
    var params = new URLSearchParams(window.location.search || '');
    return {
      source: cleanHistoryAttribution(params.get('utm_source')),
      medium: cleanHistoryAttribution(params.get('utm_medium')),
      campaign: cleanHistoryAttribution(params.get('utm_campaign')),
      content: cleanHistoryAttribution(params.get('utm_content')),
      term: cleanHistoryAttribution(params.get('utm_term')),
      id: cleanHistoryAttribution(params.get('utm_id'))
    };
  }

  function historyEventUrl() {
    var url = new URL(HISTORY_API_BASE, window.location.href);
    url.searchParams.set('action', 'event');
    return url.toString();
  }

  function sendHistoryEvent(eventName, variant, qa) {
    if (!historyAnalyticsAllowed()) return false;
    var body = {
      eventName: eventName,
      occurredAt: new Date().toISOString(),
      analyticsConsent: true,
      sourceSlug: historySlug(),
      pageUrl: safeHistoryUrl(window.location.href),
      referrer: safeHistoryUrl(document.referrer),
      experiment: HISTORY_EXPERIMENT_ID,
      variant: variant,
      storyId: '',
      utm: historyUtm(),
      device: {
        width: Number(window.innerWidth || 0),
        height: Number(window.innerHeight || 0)
      },
      qa: Boolean(qa)
    };
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: eventName, experiment: HISTORY_EXPERIMENT_ID, variant: variant });
      if (typeof window.gtag === 'function') window.gtag('event', eventName, { experiment: HISTORY_EXPERIMENT_ID, variant: variant });
      fetch(historyEventUrl(), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        keepalive: true,
        body: JSON.stringify(body)
      }).catch(function () {});
      return true;
    } catch (err) {
      return false;
    }
  }

  function queueHistoryExperimentView(assignment) {
    if (!assignment.inExperiment) return;
    var key = location.pathname + ':' + assignment.variant + ':' + (assignment.qa ? 'qa' : 'live');
    if (sentHistoryViews[key]) return;
    pendingHistoryViews[key] = assignment;
    flushHistoryExperimentViews();
  }

  function flushHistoryExperimentViews() {
    rememberHistoryBucket();
    if (!historyAnalyticsAllowed()) return;
    Object.keys(pendingHistoryViews).forEach(function (key) {
      var assignment = pendingHistoryViews[key];
      if (sendHistoryEvent('bw_history_lead_experiment_view', assignment.variant, assignment.qa)) {
        sentHistoryViews[key] = true;
        delete pendingHistoryViews[key];
      }
    });
  }

  function bindControlHistoryTracking(card, assignment) {
    if (!assignment.inExperiment) return;
    card.addEventListener('click', function (event) {
      var target = event.target.closest('[data-bw-booking-cta],[data-bw-day-index],[data-bw-slot-index],.bw-blog-booking-more');
      if (target) sendHistoryEvent('bw_history_control_booking_click', 'control', assignment.qa);
    });
  }

  function loadHistoryElement() {
    if (window.customElements && customElements.get(HISTORY_ELEMENT_TAG)) return Promise.resolve();
    if (historyElementPromise) return historyElementPromise;
    historyElementPromise = new Promise(function (resolve, reject) {
      var done = false;
      var timeout = setTimeout(function () {
        if (done) return;
        done = true;
        reject(new Error('History lead element timed out'));
      }, 7000);

      function finish() {
        if (done) return;
        if (!window.customElements || !customElements.get(HISTORY_ELEMENT_TAG)) return;
        done = true;
        clearTimeout(timeout);
        resolve();
      }

      var existing = document.querySelector('script[data-bw-history-lead-element]');
      if (existing) {
        if (window.customElements && typeof customElements.whenDefined === 'function') customElements.whenDefined(HISTORY_ELEMENT_TAG).then(finish);
        existing.addEventListener('error', function () {
          if (done) return;
          done = true;
          clearTimeout(timeout);
          reject(new Error('History lead element failed to load'));
        }, { once: true });
        return;
      }

      var script = document.createElement('script');
      script.src = HISTORY_ELEMENT_URL;
      script.async = true;
      script.setAttribute('data-bw-history-lead-element', '1');
      script.onload = function () {
        finish();
        if (!done && window.customElements && typeof customElements.whenDefined === 'function') customElements.whenDefined(HISTORY_ELEMENT_TAG).then(finish);
      };
      script.onerror = function () {
        if (done) return;
        done = true;
        clearTimeout(timeout);
        reject(new Error('History lead element failed to load'));
      };
      document.head.appendChild(script);
    });
    return historyElementPromise;
  }

  function currentInsertionAnchor() {
    var body = findPostBody();
    return body ? findInsertionAnchor(body) : null;
  }

  function insertControl(anchor, assignment) {
    var card = buildBookingCard();
    bindControlHistoryTracking(card, assignment);
    anchor.parentNode.insertBefore(card, anchor.nextSibling);
    injections += 1;
    queueHistoryExperimentView(assignment);
    console.log(LOG, 'injected attempt', injections, assignment.inExperiment ? 'experiment control' : 'booking card');
    return true;
  }

  function insertHistoryVariant(assignment) {
    if (historyInsertionPending) return true;
    historyInsertionPending = true;
    var requestedPath = location.pathname;
    loadHistoryElement().then(function () {
      historyInsertionPending = false;
      if (location.pathname !== requestedPath || document.querySelector('[' + MARKER + ']')) return;
      var anchor = currentInsertionAnchor();
      if (!anchor) return;
      var element = document.createElement(HISTORY_ELEMENT_TAG);
      element.setAttribute(MARKER, '1');
      element.setAttribute(HISTORY_MARKER, '1');
      element.setAttribute('mode', 'inline');
      element.setAttribute('experiment', HISTORY_EXPERIMENT_ID);
      element.setAttribute('variant', 'variant');
      element.setAttribute('api-base', HISTORY_API_BASE);
      if (assignment.qa) element.setAttribute('qa', 'true');
      anchor.parentNode.insertBefore(element, anchor.nextSibling);
      injections += 1;
      queueHistoryExperimentView(assignment);
      console.log(LOG, 'injected attempt', injections, 'experiment variant');
    }).catch(function (error) {
      historyInsertionPending = false;
      if (location.pathname !== requestedPath || document.querySelector('[' + MARKER + ']')) return;
      var anchor = currentInsertionAnchor();
      if (!anchor) return;
      insertControl(anchor, { variant: 'control', inExperiment: false, qa: assignment.qa, stage: assignment.stage });
      console.warn(LOG, 'history variant unavailable; restored booking control', error && error.message || error);
    });
    return true;
  }

  function inject() {
    if (!isPostPage()) return false;
    if (document.querySelector('[' + MARKER + ']')) return false;
    if (injections >= MAX_REINJECTS) return false;
    if (historyInsertionPending) return false;

    var body = findPostBody();
    if (!body) return false;
    var anchor = findInsertionAnchor(body);
    if (!anchor) return false;

    var assignment = historyAssignment();
    if (assignment.variant === 'variant') return insertHistoryVariant(assignment);
    return insertControl(anchor, assignment);
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
    historyInsertionPending = false;
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

  ['consentPolicyChanged', 'consentPolicyInitialized', 'ucConsentEvent'].forEach(function (name) {
    window.addEventListener(name, flushHistoryExperimentViews);
    document.addEventListener(name, flushHistoryExperimentViews);
  });

  if (window.BW_HISTORY_LEAD_TEST_HOOKS === true) {
    window.__bwHistoryLeadTestHooks = {
      assignment: historyAssignment,
      effectiveStage: function () { return historyEffectiveStage(historyConfig()); },
      resetBucket: function () { historyMemoryBucket = null; },
      storageKey: HISTORY_STORAGE_KEY
    };
  }

  setInterval(function () {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      bootForCurrentPage();
    }
  }, 300);
})();
