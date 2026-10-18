/* lead-form-direct-inject.js — the two public inline surfaces on every BerlinWalk post.
 *
 * The compact Berlin Then and Now tour card keeps its existing placement.
 * Its date chips read live availability for the paid tour's Wix service and
 * stay hidden while that service has no bookable dates (booking not open yet).
 * The Date Check card requests the dated Berlin Unlocked emails directly in
 * the article, right after the intro (since 12 Oct 2026; before that it came
 * after the compact tour card). A dismissible Walk of Berlin Weekly bar slides
 * in from the bottom once a reader is a third of the way down. On the Berlin
 * Wall and Cold War posts an East or West card links to the 1989 street
 * check landing page in mid-article (since 12 Oct 2026). Every inline
 * surface is placed once per page view and then stays put (see placeSurface).
 * All surfaces
 * are light DOM, page-local, and owned by this one idempotent injector.
 */
(function () {
  'use strict';

  var DISABLED = window.BW_DISABLE_BLOG_BOOKING === true || /[?&]bwBlogBooking=0(?:&|$)/.test(location.search);
  var PREVIEW_ENABLED = window.BW_ENABLE_BLOG_BOOKING === true || /[?&]bwBlogBooking=1(?:&|$)/.test(location.search);
  var ENABLED = !DISABLED && (location.pathname.indexOf('/post/') === 0 || PREVIEW_ENABLED);
  if (!ENABLED) return;
  // One running copy per page: a second copy would fight the first over the same cards.
  if (window.BW_BLOG_INJECTOR_TEST_HOOKS !== true) {
    if (window.__bwBlogSurfacesActive) return;
    window.__bwBlogSurfacesActive = true;
  }

  // Berlin Then and Now (Wix Bookings service 145cb27e). The old service
  // 448872c2 must never feed this card again.
  var TOUR_SERVICE_ID = '145cb27e-c5bd-456d-bfbd-a09d4d6f5f9d';
  var AVAILABILITY_URL = 'https://berlinwalk-content-app.vercel.app/api/booking-calendar-availability?days=120&guests=1&serviceId=' + TOUR_SERVICE_ID;
  // Checkout A booking page for the paid tour. A picked date travels as
  // ?start=YYYY-MM-DDTHH:MM (Berlin time), the page's landing hand-off contract.
  var BOOKING_URL = 'https://www.walkofberlin.com/book-berlin-walking-tour/berlin-then-and-now';
  var DATE_CHECK_URL = 'https://www.walkofberlin.com/berlin-dates-check';
  var DATE_CHECK_API = 'https://app.berlinwalk.com/api/download-lead';
  var DIRECT_CONSENT_VERSION = 'berlin-date-check-submit-v2-2026-10-05';
  var DIRECT_CONSENT_TEXT = 'By clicking “Email my Berlin dates”, you agree to receive Berlin Unlocked, emails timed to your trip, and occasional Berlin tips and offers from Walk of Berlin by email. You can unsubscribe at any time.';
  var BOOKING_MARKER = 'data-bw-blog-booking';
  var DATE_CHECK_MARKER = 'data-bw-date-check-card';
  var EAST_WEST_MARKER = 'data-bw-eastwest-card';
  var EAST_WEST_STYLE_ID = 'bw-eastwest-card-style';
  var EAST_WEST_URL = 'https://www.walkofberlin.com/east-or-west';
  var EAST_WEST_IMAGE = 'https://fenerszymanski.github.io/berlinwalk-widgets/east-west-lp/img/brandenburg-gate-wall-1989.jpg';
  // Posts about the Wall, the division and East or West Berlin (Yusuf, 12 Oct 2026:
  // "Duvar yazılarına kartı ekle"). Only these slugs get the card.
  var EAST_WEST_SLUGS = [
    'where-was-the-berlin-wall-interactive-map', 'how-berlin-was-divided-a-simple-guide-to-east-vs-west',
    'the-berlin-wall-where-it-stood-and-what-s-left-in-2026', 'berlin-wall-map-overlay-where-you-are-standing',
    'berlin-wall-in-mitte-city-centre', 'berlin-wall-trail', 'berlin-wall-memorial-bernauer-strasse',
    'east-side-gallery-berlin-guide', 'exploring-checkpoint-charlie-a-historical-journey-through-cold-war-berlin-s-iconic-border-crossing',
    'cold-war-berlin-in-5-key-locations-you-can-still-visit', 'potsdamer-platz-berlin', 'traenenpalast-berlin',
    'karl-marx-allee-berlin', 'the-ampelmann-how-a-traffic-light-became-berlin-s-most-beloved-symbol',
    'is-the-ddr-museum-worth-it', 'stasi-museum-berlin', 'hohenschonhausen-memorial-berlin', 'teufelsberg-berlin',
    'berlin-s-lost-neighborhood-what-the-gdr-demolished-to-build-a-socialist-utopia'
  ];
  var BOOKING_STYLE_ID = 'bw-blog-booking-inject-style';
  var DATE_CHECK_STYLE_ID = 'bw-date-check-blog-card-style';
  // Card A/B ended by owner decision on 2026-09-10.  'form', the shipped
  // in-card date form, is the only arm that still ships.  The 'oneclick'
  // challenger drew marginally more arrivals and produced no email submits at
  // all, so it was dropped; no statistical winner was claimed.
  // The experiment id deliberately does NOT change: the Date Check page
  // validates the card handoff against this exact string, so renaming it here
  // would silently drop blog-card attribution.  Reports cut the A/B window at
  // the decision timestamp instead of relying on a new cohort id.
  var DATE_CHECK_CARD_EXPERIMENT = 'berlin_date_check_blog_card_ab_v2_2026_09';
  var DATE_CHECK_CARD_VARIANT = 'form';
  var DATE_CHECK_VARIANTS = [DATE_CHECK_CARD_VARIANT];
  var LOG = '[BW blog surfaces]';
  var MAX_RETRIES = 12;
  var RETRY_DELAYS = [0, 120, 420, 900, 1600, 2800, 4500, 7000, 10000, 14000, 18000, 24000];
  var DATE_CHECK_IMAGE = 'https://fenerszymanski.github.io/berlinwalk-widgets/arrival-card/brandenburg-gate.jpg';
  var dateCardCount = 0;
  var retryTimer = null;
  var observer = null;
  var lastPath = location.pathname;
  var retries = 0;
  // Current Wix category membership, refreshed 14 Oct 2026. Covers secondary
  // category assignments and posts newer than the public archive as well.
  var RESIDENT_MARKER = 'data-bw-resident-letter';
  var residentSlugs = ["apple-picking-near-berlin","autumn-leaves-in-berlin","balcony-solar-berlin","berlin-bathing-season","berlin-bridge-days-2027","berlin-bulky-waste","berlin-election-2026","berlin-flat-notice-period","berlin-heating-season","berlin-hiking-trails","berlin-housing-cooperative","berlin-monthly-ticket","berlin-nebenkostenabrechnung","berlin-parking-zones","berlin-public-libraries","berlin-rent-increase","berlin-rental-deposit","berlin-school-registration","berlin-snow-clearing-rules","berlin-water-hardness","berlin-zoo-annual-pass","bike-lights-in-berlin","bike-theft-in-berlin","blood-donation-berlin","bouldering-in-berlin","buergeramt-berlin","cargo-bike-berlin","church-tax-berlin","cranes-near-berlin","dentist-in-berlin","doctor-appointment-berlin","dog-parks-in-berlin","electricity-provider-berlin","elterngeld-berlin","flu-shot-in-berlin","german-citizenship-berlin","german-courses-in-berlin","halteverbotszone-berlin","health-insurance-in-berlin","herbstferien-berlin","home-insurance-in-berlin","home-internet-berlin","ice-skating-in-berlin","indoor-playgrounds-in-berlin","kaeltehilfe-berlin","kindergeld-berlin","kita-place-berlin","kleingarten-berlin","mieterverein-berlin","milieuschutz-berlin","missed-parcel-in-berlin","mould-in-berlin-flats","mushroom-picking-berlin","pumpkin-patch-berlin","repair-cafe-berlin","rundfunkbeitrag-berlin","second-home-tax-berlin","sick-leave-in-berlin","stargazing-in-berlin","swimming-lessons-for-kids-in-berlin","tax-return-in-berlin","thermal-baths-near-berlin","urban-sports-club-vs-gym-berlin","vet-in-berlin","wbs-berlin","winter-swimming-in-berlin","winter-tyres-berlin","wohngeld-berlin"];
  var residentArchiveRequested = false;
  function isResidentPost() {
    if (residentSlugs.indexOf(currentSlug()) !== -1) return true;
    return !!document.querySelector('.bw-c-eyebrow a[href$="/living-in-berlin"],article [data-hook="category-link"][href$="/living-in-berlin"]');
  }
  function refreshResidentTopics() {
    if (residentArchiveRequested) return;
    residentArchiveRequested = true;
    // Reuse the redesign's identical cached archive URL; no new API/consent.
    fetch('https://fenerszymanski.github.io/berlinwalk-widgets/blog-index/archive.json?v=blog-redesign-c-20260823', {cache:'force-cache'})
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || !Array.isArray(data.allPosts)) return;
        var wasResident = isResidentPost();
        data.allPosts.forEach(function (post) {
          if (post.categorySlug === 'living-in-berlin' && residentSlugs.indexOf(post.slug) === -1) residentSlugs.push(post.slug);
        });
        if (!wasResident && isResidentPost()) scheduleInject(0);
      }).catch(function () { /* verified category members remain covered offline */ });
  }


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
    if (el.closest('[' + BOOKING_MARKER + '],[' + DATE_CHECK_MARKER + '],[' + EAST_WEST_MARKER + '],[' + RESIDENT_MARKER + '],[data-bw-leadform],[data-bw-tourcta],[data-bw-blog-mobile-guide],[data-bw-blog-mobile-nav],[data-bw-blog-tool-prompt],[data-bw-blog-journey],[data-bw-blog-share-bar]')) return true;
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

  // insertionTarget plus the content block it follows, so a placement can be
  // found again by that block's text after Wix re-renders the article.
  function pointAt(block, body, kind) {
    var point = insertionTarget(block, body);
    if (point) {
      point.block = block;
      point.kind = kind || 'fixed';
    }
    return point;
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

  // Moved up on 12 Oct 2026 (Yusuf: the list is not growing). After the 2nd
  // tour-card anchor the card sat at about a third of the page, where few
  // readers ever arrive. It now follows the second real prose paragraph of the
  // intro ("Updated:" stamps and the "On this page" label are skipped). To
  // avoid a visible jump it takes the first such paragraph that is still below
  // the fold when it mounts. Short posts keep the old position.
  var DATE_CHECK_MIN_PROSE = 80;

  function belowFold(node) {
    try {
      if (!node || typeof node.getBoundingClientRect !== 'function') return true;
      var rect = node.getBoundingClientRect();
      var viewport = window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || 0;
      return !viewport || rect.bottom > viewport;
    } catch (err) {
      return true;
    }
  }

  function findEarlyDateCheckPoint(body) {
    var blocks = dateCheckBlocks(body);
    var prose = [];
    for (var i = 0; i < blocks.length; i++) {
      if ((blocks[i].tagName || '').toUpperCase() !== 'P') continue;
      if (cleanText(blocks[i].textContent).length < DATE_CHECK_MIN_PROSE) continue;
      prose.push(i);
    }
    if (prose.length < 4) return null;
    for (var j = 1; j < prose.length - 1; j++) {
      if (belowFold(blocks[prose[j]])) return pointAt(blocks[prose[j]], body, 'early');
    }
    return null;
  }

  function findDateCheckInsertionPoint(body, bookingPoint) {
    var early = findEarlyDateCheckPoint(body);
    if (early) return early;
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
    return pointAt(blocks[laterIndex], body, 'fallback');
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
        return pointAt(blocks[j], body, 'fixed');
      }
    }
    if (!headings.length) {
      var fallbackIndex = blocks.length >= 4 ? Math.min(3, Math.floor(blocks.length / 2)) : blocks.length - 1;
      return pointAt(blocks[fallbackIndex], body, 'fixed');
    }
    return pointAt(blocks[anchorIndex], body, 'fixed');
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

  function slotStartKey(slot) {
    var time = formatTime(slot && slot.startDate);
    var key = slot && slot.dateKey ? slot.dateKey + 'T' + time : '';
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(key) ? key : '';
  }

  function bookingHref(slot) {
    var url = new URL(BOOKING_URL, window.location.href);
    var start = slot ? slotStartKey(slot) : '';
    if (start) url.searchParams.set('start', start);
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
      '.bw-blog-booking-card *{box-sizing:border-box;}.bw-blog-booking-card [hidden]{display:none!important;}',
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
    var spots = slot.openSpots !== null && slot.openSpots > 0 && slot.openSpots <= 3
      ? slot.openSpots + (slot.openSpots === 1 ? ' spot left' : ' spots left')
      : 'Spots available';
    panel.querySelector('[data-bw-booking-meta]').textContent =
      spots + ' for ' + parts.weekday + ' ' + parts.day + ' ' + parts.month + ' · ends at Hackescher Markt';
    var cta = panel.querySelector('[data-bw-booking-cta]');
    cta.setAttribute('href', bookingHref(slot));
    cta.textContent = 'Reserve ' + parts.weekday + ' ' + parts.day + ' ' + parts.month + (startTime ? ' · ' + startTime : '');
  }

  function setupPicker(panel, days) {
    var datesEl = panel.querySelector('[data-bw-booking-dates]');
    // No bookable date yet (booking not open, or the feed is down): keep the
    // chips hidden and let the CTA carry the visitor to the booking page.
    if (!datesEl || !days.length) return;
    var state = { days: days, dayIndex: 0, slotIndex: 0 };
    datesEl.innerHTML = days.map(function (day, index) {
      var parts = formatDateParts(day.dateKey);
      return '<button type="button" class="bw-blog-booking-date" data-bw-day-index="' + index + '" aria-pressed="false"><span>' + escapeHtml(parts.weekday) + '</span><b>' + escapeHtml(parts.day) + '</b><small>' + escapeHtml(parts.month) + '</small></button>';
    }).join('') + moreDatesChip();
    datesEl.hidden = false;
    var stripLabel = panel.querySelector('[data-bw-booking-strip-label]');
    if (stripLabel) stripLabel.textContent = 'Live tour dates';
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
      .catch(function () {});
  }

  function buildBookingCard() {
    ensureBookingStyles();
    var wrapper = document.createElement('section');
    wrapper.setAttribute(BOOKING_MARKER, '1');
    wrapper.className = 'bw-blog-booking-card';
    wrapper.setAttribute('aria-label', 'Book Berlin Then and Now, my walking tour');
    var imageBase = 'https://fenerszymanski.github.io/berlinwalk-widgets/gallery/images/01-800w';
    wrapper.innerHTML = [
      '<div class="bw-blog-booking-strip"><span data-bw-booking-strip-label>My walking tour</span><span>Archive photo at every stop</span></div>',
      '<div class="bw-blog-booking-inner"><div class="bw-blog-booking-media"><picture><source srcset="' + imageBase + '.webp" type="image/webp"><img src="' + imageBase + '.jpg" alt="BerlinWalk guide Yusuf leading guests outside the Altes Museum on Museum Island" loading="lazy"></picture></div>',
      '<div class="bw-blog-booking-body"><div class="bw-blog-booking-title" role="heading" aria-level="2">Walk the Berlin that disappeared, with me</div><div class="bw-blog-booking-facts">Berlin Then and Now · about 2.5 hours · 11 stops, 16 places · max 10 · €25</div>',
      '<div class="bw-blog-booking-dates" data-bw-booking-dates aria-label="Pick a tour date" hidden></div>',
      '<div class="bw-blog-booking-day" data-bw-booking-day hidden><span class="bw-blog-booking-times-label">Start time</span><div class="bw-blog-booking-times" data-bw-booking-times></div><span class="bw-blog-booking-meta" data-bw-booking-meta></span></div>',
      '<div class="bw-blog-booking-cta"><a href="' + escapeAttr(bookingHref()) + '" target="_top" data-bw-booking-cta>See dates and book</a></div></div></div>'
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
      experiment: DATE_CHECK_CARD_EXPERIMENT,
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

  // The A/B is over, so there is no draw, no session key and no URL override:
  // every reader gets the control card and nothing can put the retired arm back
  // on a live post.  The value is still stamped on the card and on every event
  // so the arm dimension keeps the shape it had while the test ran.
  function dateCheckCardVariant() {
    return DATE_CHECK_CARD_VARIANT;
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
    url.searchParams.set('bw_entry', 'blog_card');
    url.searchParams.set('bw_card_exp', DATE_CHECK_CARD_EXPERIMENT);
    url.searchParams.set('bw_card_variant', normaliseDateCheckVariant(variant) || 'form');
    url.searchParams.set('bw_card_source', sourceSlug || 'blog-post');
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
    style.textContent += '.bw-date-check-blog-card[data-bw-direct-email][data-bw-date-check-card]{border-radius:22px!important}.bw-date-check-blog-card[data-bw-direct-email][data-bw-date-check-card] [hidden]{display:none!important}.bw-date-check-blog-card[data-bw-direct-email][data-bw-date-check-card] .bw-date-check-blog-card__fields{display:grid!important;grid-template-columns:minmax(0,1.1fr) minmax(75px,.55fr) minmax(0,1.35fr)!important}.bw-date-check-blog-card[data-bw-direct-email][data-bw-date-check-card] input[type=email]{width:100%;min-width:0;max-width:100%;height:54px;padding:0 13px;border:1.5px solid #123d18;border-radius:8px;background:#fff;color:#212121;font:500 16px/1.2 Montserrat,Arial,sans-serif}.bw-date-check-blog-card[data-bw-direct-email][data-bw-date-check-card] .bw-date-check-blog-card__consent{font:400 12.5px/1.55 Montserrat,Arial,sans-serif!important;color:#475643!important;margin:15px 0 0!important}.bw-date-check-blog-card[data-bw-direct-email][data-bw-date-check-card] .bw-date-check-blog-card__consent a{color:#123d18!important;text-decoration:underline!important}.bw-date-check-blog-card__trap{position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden}.bw-date-check-blog-card[data-bw-direct-email][data-bw-date-check-card] .bw-date-check-blog-card__success{font:400 16px/1.55 Montserrat,Arial,sans-serif;color:#123d18;padding:10px 0}.bw-date-check-blog-card__success strong{display:block;font-size:24px;margin-bottom:9px}.bw-date-check-blog-card[data-bw-direct-email][data-bw-date-check-card] .bw-date-check-blog-card__submit:disabled{opacity:.7;cursor:wait}@media(max-width:700px){.bw-date-check-blog-card[data-bw-direct-email][data-bw-date-check-card] .bw-date-check-blog-card__fields{grid-template-columns:minmax(0,1fr) minmax(75px,.5fr)!important}.bw-date-check-blog-card__email-field{grid-column:1/-1}}@media(max-width:520px){.bw-date-check-blog-card[data-bw-direct-email][data-bw-date-check-card] .bw-date-check-blog-card__fields{grid-template-columns:minmax(0,1fr)!important}}';
    style.textContent += '.bw-date-check-blog-card[data-bw-direct-email][data-bw-date-check-card]{display:grid!important;grid-template-columns:34% minmax(0,66%)!important;background:#1b5e20!important;border:0!important;box-shadow:none!important}.bw-date-check-blog-card[data-bw-direct-email][data-bw-date-check-card] .bw-date-check-blog-card__visual{display:block!important;position:relative!important;min-height:390px!important;background:#1b5e20!important}.bw-date-check-blog-card[data-bw-direct-email][data-bw-date-check-card] .bw-date-check-blog-card__visual img{display:block!important;position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:49% 50%!important}.bw-date-check-blog-card[data-bw-direct-email][data-bw-date-check-card] .bw-date-check-blog-card__scrim{display:none!important}.bw-date-check-blog-card[data-bw-direct-email][data-bw-date-check-card] .bw-date-check-blog-card__form{display:block!important;padding:24px!important}.bw-date-check-blog-card[data-bw-direct-email][data-bw-date-check-card] .bw-date-check-blog-card__form>.bw-date-check-blog-card__eyebrow{display:inline-block!important;background:#ffe600!important;color:#123d18!important;border-radius:12px!important;padding:7px 11px!important;margin:0 0 12px!important;font:800 11px/1.3 Montserrat,Arial,sans-serif!important;letter-spacing:0!important}.bw-date-check-blog-card[data-bw-direct-email][data-bw-date-check-card] .bw-date-check-blog-card__eyebrow:before{display:none!important}.bw-date-check-blog-card[data-bw-direct-email][data-bw-date-check-card] .bw-date-check-blog-card__form>.bw-c-date-intro h2.bw-date-check-blog-card__title{color:#fff!important;font-size:26px!important;font-weight:800!important;line-height:1.16!important;letter-spacing:-.025em!important;margin:0 0 12px!important}.bw-date-check-blog-card[data-bw-direct-email][data-bw-date-check-card] .bw-c-date-intro p{color:#fff!important;font:400 15px/1.45 Montserrat,Arial,sans-serif!important;margin:0 0 16px!important}.bw-date-check-blog-card[data-bw-direct-email][data-bw-date-check-card] .bw-date-check-blog-card__field label{color:#e3f0dc!important;letter-spacing:0!important;font:600 13px/1.4 Montserrat,Arial,sans-serif!important}.bw-date-check-blog-card[data-bw-direct-email][data-bw-date-check-card] .bw-date-check-blog-card__fields{grid-template-columns:minmax(0,1fr) minmax(70px,.42fr)!important}.bw-date-check-blog-card[data-bw-direct-email][data-bw-date-check-card] .bw-date-check-blog-card__email-field{grid-column:1/-1}.bw-date-check-blog-card[data-bw-direct-email][data-bw-date-check-card] .bw-date-check-blog-card__consent,.bw-date-check-blog-card[data-bw-direct-email][data-bw-date-check-card] .bw-date-check-blog-card__consent a,.bw-date-check-blog-card[data-bw-direct-email][data-bw-date-check-card] .bw-date-check-blog-card__success,.bw-date-check-blog-card[data-bw-direct-email][data-bw-date-check-card] .bw-date-check-blog-card__status{color:#fff!important}.bw-date-check-blog-card[data-bw-direct-email][data-bw-date-check-card] .bw-date-check-blog-card__submit{width:100%!important;justify-content:center!important;gap:12px!important;min-height:54px!important;margin-top:14px!important}@media(max-width:760px){.bw-date-check-blog-card[data-bw-direct-email][data-bw-date-check-card]{grid-template-columns:minmax(0,1fr)!important}.bw-date-check-blog-card[data-bw-direct-email][data-bw-date-check-card] .bw-date-check-blog-card__visual{height:180px!important;min-height:0!important}.bw-date-check-blog-card[data-bw-direct-email][data-bw-date-check-card] .bw-date-check-blog-card__visual img{object-position:50% 44%!important}.bw-date-check-blog-card[data-bw-direct-email][data-bw-date-check-card] .bw-date-check-blog-card__form{padding:22px 20px!important}}@media(max-width:520px){.bw-date-check-blog-card[data-bw-direct-email][data-bw-date-check-card] .bw-date-check-blog-card__fields{grid-template-columns:minmax(0,1fr)!important}}';
    style.textContent += '.bw-date-check-blog-card[data-bw-direct-email][data-bw-date-check-card] form [hidden]{display:none!important}';
    document.head.appendChild(style);
  }

  function currentSlug() {
    var match = location.pathname.match(/\/post\/([^/?#]+)/);
    return match ? decodeURIComponent(match[1]) : 'blog-post';
  }

  function dateCheckVisualHtml(id) {
    return [
      '<div class="bw-date-check-blog-card__visual"><img src="' + DATE_CHECK_IMAGE + '" alt="Brandenburg Gate in warm evening light" loading="lazy" decoding="async"><div class="bw-date-check-blog-card__scrim">',
      '<div class="bw-date-check-blog-card__eyebrow">FREE BERLIN DATE CHECK</div>',
      '<h2 class="bw-date-check-blog-card__title" id="' + id + '-title">Check your Berlin trip dates</h2><div class="bw-date-check-blog-card__copy">Get Berlin Unlocked for your dates, plus tips before you arrive.</div>',
      '<div class="bw-date-check-blog-card__proof" aria-label="Date Check covers"><span>Closures</span><span>Book-by</span><span>Daylight</span></div></div></div>'
    ].join('');
  }

  function buildDateCheckCard(slug, forcedVariant) {
    ensureDateCheckStyles();
    dateCardCount += 1;
    var id = 'bw-date-check-blog-card-' + dateCardCount;
    var variant = normaliseDateCheckVariant(forcedVariant) || dateCheckCardVariant();
    var card = document.createElement('aside');
    card.setAttribute(DATE_CHECK_MARKER, '1');
    card.setAttribute('data-bw-direct-email', '2');
    card.setAttribute('data-bw-leadform', '1');
    card.setAttribute('data-bw-date-check-variant', variant);
    card.className = 'bw-date-check-blog-card';
    card.setAttribute('role', 'region');
    card.setAttribute('aria-labelledby', id + '-title');
    card.innerHTML = [
      dateCheckVisualHtml(id),
      '<form class="bw-date-check-blog-card__form" method="post">',
      // Preserve the legacy card dimensions; the POST payload uses gated attribution.
      '<input type="hidden" name="utm_source" value="blog"><input type="hidden" name="utm_medium" value="inline_tool">',
      '<input type="hidden" name="utm_campaign" value="berlin_date_check"><input type="hidden" name="utm_content" value="' + escapeAttr(slug || 'blog-post') + '">',
      '<input type="hidden" name="utm_term" value="form">',
      '<input type="hidden" name="bw_entry" value="blog_card"><input type="hidden" name="bw_card_exp" value="' + DATE_CHECK_CARD_EXPERIMENT + '">',
      '<input type="hidden" name="bw_card_variant" value="form"><input type="hidden" name="bw_card_source" value="' + escapeAttr(slug || 'blog-post') + '">',
      '<div class="bw-date-check-blog-card__fields"><div class="bw-date-check-blog-card__field"><label for="' + id + '-arrival">When do you arrive?</label><div class="bw-date-check-blog-card__date-control" data-has-value="0"><span class="bw-date-check-blog-card__date-display" aria-hidden="true">Select arrival date</span><input id="' + id + '-arrival" name="arrival" type="date" min="' + todayString() + '" max="' + maxDateString() + '" required></div></div>',
      '<div class="bw-date-check-blog-card__field"><label for="' + id + '-nights">Nights</label><select id="' + id + '-nights" name="nights" required><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4" selected>4</option><option value="5">5</option><option value="6">6</option><option value="7">7+</option></select></div><div class="bw-date-check-blog-card__field bw-date-check-blog-card__email-field"><label for="' + id + '-email">Email</label><input id="' + id + '-email" name="email" type="email" inputmode="email" autocomplete="email" autocapitalize="none" spellcheck="false" placeholder="Your email address" maxlength="180" required aria-describedby="' + id + '-consent"></div></div>',
      '<button class="bw-date-check-blog-card__submit" type="submit"><span>Email my Berlin dates</span><span class="bw-date-check-blog-card__arrow" aria-hidden="true">→</span></button>',
      '<div class="bw-date-check-blog-card__trap" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div>',
      '<p class="bw-date-check-blog-card__consent" id="' + id + '-consent">' + escapeHtml(DIRECT_CONSENT_TEXT) + ' <a href="https://walkofberlin.com/privacy-policy" target="_blank" rel="noopener">Privacy Policy</a>.</p>',
      '<div class="bw-date-check-blog-card__success" hidden role="status" aria-live="polite"><strong>Check your inbox.</strong>Open my email to confirm your address and get Berlin Unlocked for your dates. If it is missing, check your spam folder.</div><div class="bw-date-check-blog-card__status" role="status" aria-live="polite"></div></form>'
    ].join('');
    var form = card.querySelector('form');
    // Own the compact layout so the article redesign cannot hide the new form's photo.
    var intro = document.createElement('div');
    intro.className = 'bw-c-date-intro';
    intro.appendChild(card.querySelector('.bw-date-check-blog-card__title'));
    var paragraph = document.createElement('p');
    paragraph.textContent = card.querySelector('.bw-date-check-blog-card__copy').textContent;
    intro.appendChild(paragraph);
    form.insertBefore(intro, form.querySelector('.bw-date-check-blog-card__fields'));
    form.insertBefore(card.querySelector('.bw-date-check-blog-card__eyebrow'), intro);
    card.classList.add('bw-c-date-card');
    // Wix article rules include high-specificity !important paragraph styles.
    // Keep the form's disclosure readable at its own size inside that article.
    var disclosure = card.querySelector('.bw-date-check-blog-card__consent');
    disclosure.style.setProperty('font', '400 12px/1.5 Montserrat,Arial,sans-serif', 'important');
    disclosure.style.setProperty('color', '#fff', 'important');
    disclosure.style.setProperty('margin', '14px 0 0', 'important');
    disclosure.style.setProperty('padding', '0', 'important');
    var privacyLink = disclosure.querySelector('a');
    privacyLink.style.setProperty('color', '#fff', 'important');
    privacyLink.style.setProperty('font', 'inherit', 'important');
    privacyLink.style.setProperty('background', 'none', 'important');
    privacyLink.style.setProperty('box-shadow', 'none', 'important');
    privacyLink.style.setProperty('text-decoration', 'underline', 'important');
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
    var measurement = window.BWDateCheckMeasurement && window.BWDateCheckMeasurement.bind(card, {sourceSlug: slug, variant: 'direct_email', version: 'date-check-direct-v2-2026-10-05'});
    card._bwDateCheckMeasurement = measurement;
    var formStartedAt = new Date().toISOString();
    var requestId = window.crypto && typeof window.crypto.randomUUID === 'function' ? window.crypto.randomUUID() : String(Date.now()) + '_' + String(Math.random()).slice(2);
    var sending = false;
    var button = form.querySelector('button[type=submit]');
    var started = false;
    var markStart = function () {
      if (measurement) { measurement.start(); return; }
      if (started) return;
      started = true;
      pushDateCheckEvent('bw_date_check_blog_card_start', slug, 'form');
    };
    arrivalInput.addEventListener('focus', markStart);
    form.elements.nights.addEventListener('focus', markStart);
    form.elements.email.addEventListener('focus', markStart);
    if (!measurement) {
      pushDateCheckEvent('bw_date_check_blog_card_mount', slug, 'form');
      trackDateCheckSeen(card, slug, 'form');
    }
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      if (sending || !form.reportValidity()) return;
      status.textContent = '';
      var arrival = form.elements.arrival.value;
      var nights = Number(form.elements.nights.value);
      if (!validDateFields(arrival, nights, form.elements.arrival.min, form.elements.arrival.max)) {
        status.textContent = 'Choose a valid arrival date and number of nights.';
        if (measurement) measurement.error('validation');
        return;
      }
      var submittedAt = new Date().toISOString();
      if (Date.parse(submittedAt) - Date.parse(formStartedAt) < 750) {
        status.textContent = 'Please check your details, then try again.';
        return;
      }
      if (measurement) measurement.submit({arrivalDate: arrival, nights: nights});
      sending = true; button.disabled = true; button.querySelector('span').textContent = 'Sending…';
      form.setAttribute('aria-busy', 'true');
      var controller = new AbortController();
      var timeout = setTimeout(function () { controller.abort(); }, 20000);
      var granted = window.BWDateCheckMeasurement && window.BWDateCheckMeasurement.analyticsAllowed
        ? window.BWDateCheckMeasurement.analyticsAllowed() : false;
      var payload = {
        assetId: 'berlin-date-check', assetVersion: '2026-08-v1',
        arrivalDate: arrival, nights: nights, email: form.elements.email.value.trim().toLowerCase(),
        consent: true, consentMethod: 'submit_button_with_visible_disclosure', consentVersion: DIRECT_CONSENT_VERSION,
        consentText: DIRECT_CONSENT_TEXT, startedAt: formStartedAt, submittedAt: submittedAt,
        website: form.elements.website.value, idempotencyKey: requestId,
        sourceSlug: slug, pagePath: location.pathname, sourceUrl: location.origin + location.pathname,
        placement: 'blog_inline_direct_email', experiment: 'berlin_date_check_inline_email_20261005', variant: 'direct-email',
        analyticsConsentAtSubmit: granted === true, advertisingConsent: !!(window.BWDateCheckMeasurement && window.BWDateCheckMeasurement.advertisingAllowed()),
        entryPoint: 'blog_card', cardExperiment: DATE_CHECK_CARD_EXPERIMENT, cardVariant: 'form', cardSourceSlug: slug,
        daysUntilArrival: Math.max(0, Math.round((Date.parse(arrival + 'T12:00:00Z') - Date.parse(todayString() + 'T12:00:00Z')) / 86400000))
      };
      if (measurement && measurement.analyticsContext) Object.assign(payload, measurement.analyticsContext());
      try {
        var response = await fetch(DATE_CHECK_API + '?action=submit', {method: 'POST', credentials: 'include', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload), signal: controller.signal});
        var result = await response.json();
        if (!response.ok || result.ok === false) throw new Error('http');
        if (measurement) measurement.accepted();
        card.querySelector('.bw-date-check-blog-card__fields').hidden = true;
        button.hidden = true;
        card.querySelector('.bw-date-check-blog-card__consent').hidden = true;
        card.querySelector('.bw-date-check-blog-card__success').hidden = false;
      } catch (err) {
        if (measurement) measurement.error(err.message === 'http' ? 'http' : 'network');
        status.textContent = 'I could not complete this request. Please try again.';
        sending = false; button.disabled = false; button.querySelector('span').textContent = 'Email my Berlin dates';
      } finally { clearTimeout(timeout); form.setAttribute('aria-busy', 'false'); }
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

  function eastWestSlug(slug) {
    return EAST_WEST_SLUGS.indexOf(String(slug || '')) !== -1;
  }

  // Mid-article: just before the first H2 that starts at or after 40% of the
  // article blocks, so the card sits between two sections. Posts without such a
  // heading take the prose paragraph nearest the middle.
  function findEastWestPoint(body) {
    var blocks = dateCheckBlocks(body);
    if (blocks.length < 6) return null;
    var start = Math.floor(blocks.length * 0.4);
    for (var i = Math.max(start, 1); i < blocks.length; i++) {
      if ((blocks[i].tagName || '').toUpperCase() === 'H2') return pointAt(blocks[i - 1], body, 'fixed');
    }
    for (var j = Math.floor(blocks.length / 2); j < blocks.length - 1; j++) {
      if ((blocks[j].tagName || '').toUpperCase() === 'P' && cleanText(blocks[j].textContent).length >= DATE_CHECK_MIN_PROSE) return pointAt(blocks[j], body, 'fixed');
    }
    return null;
  }

  function eastWestHref(slug) {
    return EAST_WEST_URL + '?utm_source=blog&utm_medium=card&utm_campaign=east_west_lp&utm_content=' + encodeURIComponent(slug || 'blog-post');
  }

  function ensureEastWestStyles() {
    if (document.getElementById(EAST_WEST_STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = EAST_WEST_STYLE_ID;
    var c = 'html body .bw-ew-card[' + EAST_WEST_MARKER + ']';
    style.textContent = [
      c + '{display:grid!important;grid-template-columns:34% minmax(0,66%)!important;width:100%;margin:30px 0!important;border-radius:20px!important;overflow:hidden!important;background:#1B5E20!important;color:#fff!important;box-shadow:0 16px 36px -26px rgba(18,61,24,.58)!important;font-family:Montserrat,Arial,sans-serif!important}',
      c + ' *{box-sizing:border-box}',
      c + ' .bw-ew-card__visual{position:relative!important;min-height:220px!important;margin:0!important;overflow:hidden!important;background:#0B351A!important}',
      c + ' .bw-ew-card__visual img{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-width:none!important;margin:0!important;object-fit:cover!important;object-position:56% 50%!important}',
      c + ' .bw-ew-card__body{display:flex!important;flex-direction:column!important;justify-content:center!important;gap:10px!important;padding:26px 28px!important;min-width:0!important}',
      c + ' .bw-ew-card__eyebrow{margin:0!important;padding:0!important;font:700 11px/1.35 Montserrat,Arial,sans-serif!important;letter-spacing:.14em!important;text-transform:uppercase!important;color:#FFE600!important}',
      c + ' .bw-ew-card__title{margin:0!important;padding:0!important;font:900 22px/1.25 Montserrat,Arial,sans-serif!important;letter-spacing:0!important;color:#fff!important}',
      c + ' .bw-ew-card__copy{margin:0!important;padding:0!important;font:400 15px/1.6 Montserrat,Arial,sans-serif!important;color:#E3EEDD!important}',
      c + ' a.bw-ew-card__cta{display:inline-flex!important;align-items:center!important;gap:10px!important;align-self:flex-start!important;margin:6px 0 0!important;padding:13px 20px!important;border-radius:10px!important;background:#FFE600!important;color:#123D18!important;font:800 16px/1.2 Montserrat,Arial,sans-serif!important;text-decoration:none!important}',
      c + ' a.bw-ew-card__cta:hover,' + c + ' a.bw-ew-card__cta:focus,' + c + ' a.bw-ew-card__cta:visited{color:#123D18!important;text-decoration:none!important}',
      c + ' a.bw-ew-card__cta:focus-visible{outline:3px solid #fff!important;outline-offset:3px!important}',
      '@media(max-width:600px){' + c + '{grid-template-columns:1fr!important;border-radius:16px!important;margin:24px 0!important}' + c + ' .bw-ew-card__visual{min-height:170px!important}' + c + ' .bw-ew-card__body{padding:20px!important}' + c + ' .bw-ew-card__title{font-size:20px!important}}'
    ].join('');
    document.head.appendChild(style);
  }

  function buildEastWestCard(slug) {
    ensureEastWestStyles();
    var card = document.createElement('aside');
    card.setAttribute(EAST_WEST_MARKER, '1');
    card.className = 'bw-ew-card';
    card.setAttribute('aria-label', 'Check whether your street was in East or West Berlin');
    card.innerHTML = [
      '<div class="bw-ew-card__visual"><img src="' + EAST_WEST_IMAGE + '" alt="The Berlin Wall at the Brandenburg Gate in 1989, lit at night" loading="lazy" decoding="async"></div>',
      '<div class="bw-ew-card__body">',
      '<div class="bw-ew-card__eyebrow">Berlin, 1989</div>',
      '<div class="bw-ew-card__title">Was your street in East or West Berlin?</div>',
      '<div class="bw-ew-card__copy">Type any Berlin address. You see which side of the Wall it was on, how far the Wall ran from it and the nearest checkpoint.</div>',
      '<a class="bw-ew-card__cta" href="' + escapeAttr(eastWestHref(slug)) + '">Check your street <span aria-hidden="true">→</span></a>',
      '</div>'
    ].join('');
    card.querySelector('a').addEventListener('click', function () {
      if (!analyticsAllowed()) return;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'bw_east_west_card_click', placement: 'blog_mid_article', source_slug: slug || currentSlug() });
    });
    return card;
  }

  // ---- Placement: once per page view, then left alone -----------------------
  // Until 12 Oct 2026 every DOM change re-ran the placement. The Date Check
  // position depends on the fold, so while a reader scrolled the card walked
  // down the article (five moves on one post), and when Wix re-rendered the
  // article the card was rebuilt and lost the dates the reader had typed.
  // Now each surface remembers where it went: the node it follows and that
  // block's text. An intact surface is never moved. A surface that Wix
  // detached goes back after the same block, as the same DOM node.
  var placed = {};

  function resetPlacement() {
    placed = {};
  }

  function blockFingerprint(node) {
    return node ? cleanText(node.textContent).slice(0, 80) : '';
  }

  function isOwnSurface(el) {
    return !!(el && el.nodeType === 1 && el.hasAttribute &&
      (el.hasAttribute(BOOKING_MARKER) || el.hasAttribute(DATE_CHECK_MARKER) || el.hasAttribute(EAST_WEST_MARKER)));
  }

  function isAttached(node) {
    var root = document.documentElement;
    return !!(node && root && typeof root.contains === 'function' && root.contains(node));
  }

  // True when node comes right after anchor, with only other inline surfaces
  // or blank text in between.
  function surfaceFollows(anchor, node) {
    if (!anchor || !node || !anchor.parentNode || anchor.parentNode !== node.parentNode) return false;
    var sibling = anchor.nextSibling;
    while (sibling && sibling !== node) {
      if (sibling.nodeType === 1 && !isOwnSurface(sibling)) return false;
      if (sibling.nodeType === 3 && cleanText(sibling.textContent)) return false;
      sibling = sibling.nextSibling;
    }
    return sibling === node;
  }

  function hasFocusInside(node) {
    var active = document.activeElement;
    return !!(node && active && active !== document.body && typeof node.contains === 'function' && node.contains(active));
  }

  function findBlockByFingerprint(body, fingerprint) {
    if (!fingerprint || !body || !body.querySelectorAll) return null;
    var nodes = body.querySelectorAll('h2,h3,p,blockquote');
    for (var i = 0; i < nodes.length; i++) {
      if (hasSurfaceAncestor(nodes[i])) continue;
      if (blockFingerprint(nodes[i]) === fingerprint) return nodes[i];
    }
    return null;
  }

  // options: existing (a surface already in the DOM), build(), find() -> point,
  // upgrade(record) -> point or null (a one-time move of a card that is still
  // out of sight). Returns the placed node, or null when nothing could be placed.
  function placeSurface(key, body, options) {
    var rec = placed[key];
    if (rec && rec.node && isAttached(rec.node)) {
      if (rec.anchor && isAttached(rec.anchor) && surfaceFollows(rec.anchor, rec.node)) {
        // The only move an intact surface can make: one upgrade out of a fallback spot.
        var better = options.upgrade && rec.kind === 'fallback' && !hasFocusInside(rec.node) ? options.upgrade(rec) : null;
        if (!better || !better.parent || !better.after) return rec.node;
        insertAfter(better, rec.node);
        placed[key] = { node: rec.node, anchor: better.after, fingerprint: blockFingerprint(better.block), kind: 'early' };
        return rec.node;
      }
      // Never move a card the reader is typing into.
      if (hasFocusInside(rec.node)) return rec.node;
    }
    var point = null;
    if (rec && rec.anchor && isAttached(rec.anchor) && body.contains(rec.anchor)) {
      point = { parent: rec.anchor.parentNode, after: rec.anchor, block: null, kind: rec.kind };
    } else if (rec && rec.fingerprint) {
      var block = findBlockByFingerprint(body, rec.fingerprint);
      if (block) point = pointAt(block, body, rec.kind);
    }
    if (!point) point = options.find();
    if (!point || !point.parent || !point.after) return null;
    var node = rec && rec.node ? rec.node : null;
    if (options.existing && options.existing !== node && isAttached(options.existing)) node = options.existing;
    if (!node) node = options.build();
    if (!node) return null;
    if (!surfaceFollows(point.after, node)) insertAfter(point, node);
    placed[key] = {
      node: node,
      anchor: point.after,
      fingerprint: point.block ? blockFingerprint(point.block) : (rec && rec.fingerprint) || '',
      kind: point.kind || (rec && rec.kind) || 'fixed'
    };
    return node;
  }

  function injectEastWestCard(body) {
    var slug = currentSlug();
    if (!eastWestSlug(slug)) return null;
    var card = placeSurface('eastwest', body, {
      existing: removeDuplicateSurfaces(EAST_WEST_MARKER),
      build: function () { return buildEastWestCard(slug); },
      find: function () { return findEastWestPoint(body); }
    });
    if (card) syncSurfaceGutters(card, body, true);
    return card;
  }


  function residentLetterPoint(body) {
    var blocks = articleBlocks(body);
    for (var i = 0; i < blocks.length; i++) {
      if ((blocks[i].tagName || '').toUpperCase() === 'P' && cleanText(blocks[i].textContent).length >= 80) {
        return pointAt(blocks[i], body, 'resident-intro');
      }
    }
    return null;
  }
  function injectResidentLetter(body) {
    document.documentElement.setAttribute('data-bw-resident-post', currentSlug());
    [BOOKING_MARKER, DATE_CHECK_MARKER, EAST_WEST_MARKER].forEach(function (marker) {
      queryAll('[' + marker + ']').forEach(function (node) {
        if (node._bwDateCheckMeasurement) node._bwDateCheckMeasurement.dispose();
        if (node.parentNode) node.parentNode.removeChild(node);
      });
    });
    var existing = document.getElementById(LETTER_BAR_ID);
    if (storageGet(LETTER_JOINED_KEY) && !existing) return true;
    if (existing && !existing.hasAttribute(RESIDENT_MARKER)) {
      // Reuse a popup's form if a reader navigates here while typing.
      existing.setAttribute(RESIDENT_MARKER, '1');
      existing.classList.add('bw-letter-inline', 'bw-lb-open');
      var close = existing.querySelector('.bw-lb-close');
      if (close) close.remove();
    }
    var card = placeSurface('resident-letter', body, {
      existing: existing || removeDuplicateSurfaces(RESIDENT_MARKER),
      build: function () {
        letterBarStyles();
        var node = buildLetterBar();
        node.setAttribute(RESIDENT_MARKER, '1');
        node.classList.add('bw-letter-inline', 'bw-lb-open');
        node.querySelector('.bw-lb-close').remove();
        bindLetterBar(node);
        return node;
      },
      find: function () { return residentLetterPoint(body); }
    });
    if (card) syncSurfaceGutters(card, body, true);
    return !!card;
  }

  function injectSurfaces() {
    if (!ENABLED || !isSurfacePath()) return false;
    var body = findPostBody();
    if (!body) return false;
    if (isResidentPost()) return injectResidentLetter(body);
    document.documentElement.removeAttribute('data-bw-resident-post');
    var bookingPoint = findBookingInsertionPoint(body);
    var booking = placeSurface('booking', body, {
      existing: removeDuplicateSurfaces(BOOKING_MARKER),
      build: buildBookingCard,
      find: function () { return bookingPoint; }
    });
    var dateCard = placeSurface('date', body, {
      existing: removeDuplicateSurfaces(DATE_CHECK_MARKER),
      build: function () { return buildDateCheckCard(currentSlug()); },
      find: function () {
        var point = findDateCheckInsertionPoint(body, bookingPoint);
        if (point) return point;
        return booking && booking.parentNode ? { parent: booking.parentNode, after: booking, block: null, kind: 'fallback' } : null;
      },
      // A card that had to take the fallback spot moves up to the intro once,
      // only while it is still entirely below the fold and has never been seen.
      upgrade: function (rec) {
        if (rec.kind !== 'fallback') return null;
        if (rec.node.getAttribute('data-bw-date-check-seen') === '1') return null;
        if (rec.node.getBoundingClientRect().top <= (window.innerHeight || 0)) return null;
        return findEarlyDateCheckPoint(body);
      }
    });
    if (booking) syncSurfaceGutters(booking, body, false);
    if (dateCard) syncSurfaceGutters(dateCard, body, true);
    try { injectEastWestCard(body); } catch (err) { /* never block the other surfaces */ }
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

  // Changes inside a surface (status text, chips, the letter bar) and the
  // injector's own insertions need no new placement pass. A surface that Wix
  // removed does, so records with removedNodes always count.
  function ownMutation(record) {
    var target = record && record.target;
    if (target && target.nodeType === 1 && typeof target.closest === 'function' &&
        target.closest('[' + BOOKING_MARKER + '],[' + DATE_CHECK_MARKER + '],[' + EAST_WEST_MARKER + '],[' + RESIDENT_MARKER + '],#' + LETTER_BAR_ID)) return true;
    if (!record || (record.removedNodes && record.removedNodes.length)) return false;
    var added = record.addedNodes || [];
    if (!added.length) return false;
    for (var i = 0; i < added.length; i++) {
      var node = added[i];
      if (node.nodeType === 3 && !cleanText(node.textContent)) continue;
      if (!isOwnSurface(node) && !(node.id && node.id === LETTER_BAR_ID)) return false;
    }
    return true;
  }

  function startObserver() {
    if (observer) observer.disconnect();
    if (typeof window.MutationObserver !== 'function' || !document.body) return;
    observer = new window.MutationObserver(function (records) {
      if (!isSurfacePath()) return;
      for (var i = 0; i < records.length; i++) {
        if (!ownMutation(records[i])) {
          scheduleInject(80);
          return;
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function removeSurfaces() {
    [BOOKING_MARKER, DATE_CHECK_MARKER, EAST_WEST_MARKER, RESIDENT_MARKER].forEach(function (marker) {
      queryAll('[' + marker + ']').forEach(function (node) {
        if (node._bwDateCheckMeasurement) node._bwDateCheckMeasurement.dispose();
        if (node.parentNode) node.parentNode.removeChild(node);
      });
    });
    if (observer) observer.disconnect();
    resetPlacement();
  }

  // Walk of Berlin Weekly bar (12 Oct 2026; Yusuf's goal: at least 20 new
  // emails a week). Fixed to the viewport, so it never shifts the article.
  // Same asset, consent text and payload as the category-page form in
  // blog-category/blog-category-element.js: the server stores the identical
  // consent snapshot and the reader still confirms by email (double opt-in).
  var LETTER_API = DATE_CHECK_API;
  var LETTER_ASSET_ID = 'berlin-weekly-letter';
  var LETTER_ASSET_VERSION = '2026-09-v1';
  var LETTER_CONSENT_VERSION = 'berlin-weekly-letter-v2-2026-10-02';
  var LETTER_CONSENT_TEXT = 'Send me Walk of Berlin Weekly, my Monday letter: one email a week about what is actually changing in Berlin, plus occasional Walk of Berlin emails. I can unsubscribe from any email with one click.';
  var LETTER_BAR_ID = 'bw-letter-bar';
  var LETTER_BAR_STYLE_ID = 'bw-letter-bar-style';
  var LETTER_DISMISS_KEY = 'bwLetterBarDismissedUntil';
  var LETTER_JOINED_KEY = 'bwLetterBarJoined';
  var LETTER_DISMISS_MS = 14 * 24 * 60 * 60 * 1000;
  var LETTER_SHOW_DEPTH = 0.33;
  var letterBarStarted = false;

  function storageGet(key) {
    try { return window.localStorage.getItem(key); } catch (err) { return null; }
  }

  function storageSet(key, value) {
    try { window.localStorage.setItem(key, String(value)); } catch (err) {}
  }

  function letterBarSuppressed(now) {
    if (storageGet(LETTER_JOINED_KEY)) return true;
    return Number(storageGet(LETTER_DISMISS_KEY) || 0) > now;
  }

  function scrollDepth() {
    var doc = document.documentElement || {};
    var max = Math.max((doc.scrollHeight || 0) - (window.innerHeight || 0), 1);
    return (window.pageYOffset || doc.scrollTop || 0) / max;
  }

  function letterBarStyles() {
    if (document.getElementById(LETTER_BAR_STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = LETTER_BAR_STYLE_ID;
    style.textContent = [
      '#bw-letter-bar{position:fixed;left:12px;right:12px;bottom:12px;z-index:9990;max-width:520px;margin:0 auto;box-sizing:border-box;background:#fff;border:2px solid #1B5E20;border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,.18);padding:14px 16px 12px;font-family:Montserrat,Arial,sans-serif;color:#212121;transform:translateY(130%);transition:transform .35s ease}',
      '#bw-letter-bar.bw-lb-open{transform:translateY(0)}',
      '@media (prefers-reduced-motion:reduce){#bw-letter-bar{transition:none}}',
      '#bw-letter-bar *{box-sizing:border-box}',
      '#bw-letter-bar .bw-lb-k{margin:0 30px 2px 0;font-size:12px;letter-spacing:.08em;text-transform:uppercase;font-weight:800;color:#1B5E20}',
      '#bw-letter-bar .bw-lb-t{margin:0 30px 10px 0;font-size:14px;line-height:1.4;color:#212121}',
      '#bw-letter-bar .bw-lb-row{display:flex;gap:8px}',
      '#bw-letter-bar .bw-lb-row input{flex:1;min-width:0;font-family:inherit;font-size:16px;padding:10px 12px;border:1px solid #9aa79a;border-radius:10px;background:#fff;color:#212121}',
      '#bw-letter-bar .bw-lb-row button,#bw-letter-bar .bw-lb-row button:hover,#bw-letter-bar .bw-lb-row button:focus{font-family:inherit;font-weight:800;font-size:14px;padding:10px 14px;border:0;border-radius:999px;background:#FFE600;color:#123D18;cursor:pointer;white-space:nowrap}',
      '#bw-letter-bar .bw-lb-row button[disabled]{opacity:.6;cursor:default}',
      '#bw-letter-bar .bw-lb-cs{display:flex;gap:8px;align-items:flex-start;margin-top:8px;font-size:11.5px;line-height:1.4;color:#4a554a}',
      '#bw-letter-bar .bw-lb-cs input{margin-top:2px;flex:0 0 auto}',
      '#bw-letter-bar .bw-lb-cs a{color:#1B5E20}',
      '#bw-letter-bar .bw-lb-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}',
      '#bw-letter-bar .bw-lb-msg{margin:6px 0 0;font-size:12.5px;color:#1B5E20}',
      '#bw-letter-bar .bw-lb-msg.bw-lb-err{color:#b3261e}',
      '#bw-letter-bar .bw-lb-close{position:absolute;top:6px;right:8px;width:32px;height:32px;padding:0;border:0;background:transparent;font-size:22px;line-height:1;color:#4a554a;cursor:pointer}',
      '#bw-letter-bar.bw-letter-inline{position:relative;left:auto;right:auto;bottom:auto;width:100%;max-width:none;margin:24px 0;transform:none;transition:none;z-index:auto;box-shadow:none;padding:20px}',
      '#bw-letter-bar.bw-letter-inline .bw-lb-k{margin:0 0 7px!important;font:800 12px/1.4 Montserrat,Arial,sans-serif!important;color:#1B5E20!important}',
      '#bw-letter-bar.bw-letter-inline .bw-lb-t{margin:0 0 14px!important;font:500 16px/1.5 Montserrat,Arial,sans-serif!important;color:#212121!important}',
      '#bw-letter-bar.bw-letter-inline .bw-lb-msg{margin:8px 0 0!important;font:500 13px/1.4 Montserrat,Arial,sans-serif!important}'
    ].join('');
    document.head.appendChild(style);
  }

  function buildLetterBar() {
    var bar = document.createElement('div');
    bar.id = LETTER_BAR_ID;
    bar.setAttribute('data-bw-letter-bar', '');
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Walk of Berlin Weekly');
    bar.innerHTML =
      '<button type="button" class="bw-lb-close" aria-label="Close">&times;</button>' +
      '<p class="bw-lb-k">Walk of Berlin Weekly</p>' +
      '<p class="bw-lb-t">My Monday letter about what is actually changing in Berlin. One email a week.</p>' +
      '<form novalidate>' +
      '<div class="bw-lb-row"><input type="email" name="email" autocomplete="email" required placeholder="you@example.com" aria-label="Your email">' +
      '<button type="submit">Send it to me</button></div>' +
      '<label class="bw-lb-cs"><input type="checkbox" name="consent" required><span>' + escapeHtml(LETTER_CONSENT_TEXT) +
      ' Read the <a href="/privacy-policy" target="_blank" rel="noopener">Privacy Policy</a>.</span></label>' +
      '<label class="bw-lb-hp" aria-hidden="true">Leave this empty<input type="text" name="website" tabindex="-1" autocomplete="off"></label>' +
      '<p class="bw-lb-msg" role="status" aria-live="polite"></p>' +
      '</form>';
    return bar;
  }

  function closeLetterBar(bar, remember) {
    if (remember) storageSet(LETTER_DISMISS_KEY, Date.now() + LETTER_DISMISS_MS);
    bar.classList.remove('bw-lb-open');
    window.setTimeout(function () {
      if (bar.parentNode) bar.parentNode.removeChild(bar);
    }, 400);
  }

  // BW-LETTER-MEASURE:START
  // Consent-gated first-party view measurement for the Walk of Berlin Weekly
  // signup (18 Oct 2026). The same block ships in js/lead-form-direct-inject.js
  // (post_letter_bar) and blog-category/blog-category-element.js (category_footer);
  // tests/letter-measure-contract.test.mjs keeps the two copies identical.
  // Without analytics consent nothing is sent and no email is ever part of an
  // event. gate_view = surface rendered, gate_seen = at least half of it on
  // screen for 1 s, form_start = first focus/input. One of each per page path
  // and placement, so a Wix remount of the same surface does not count twice.
  var bwLetterMeasure = (function () {
    var ENDPOINT = 'https://app.berlinwalk.com/api/download-lead?action=event';
    var VERSION = 'letter-measure-v1-2026-10-18';
    var CONSENT_EVENTS = ['consentPolicyChanged', 'consentPolicyInitialized', 'ucConsentEvent', 'bwConsentPolicyChanged'];
    var measured = {};
    function policy() {
      try {
        var manager = window.consentPolicyManager;
        var current = manager && typeof manager.getCurrentConsentPolicy === 'function' ? manager.getCurrentConsentPolicy() : null;
        if (!current || typeof current !== 'object') return {};
        if (current.defaultPolicy === true) {
          var config = window.wixTagManager && typeof window.wixTagManager.getConfig === 'function' ? window.wixTagManager.getConfig() : null;
          if (!config || config.gdprEnforcedGeo !== false) return {};
        }
        return current.policy && typeof current.policy === 'object' ? current.policy : current;
      } catch (error) { return {}; }
    }
    function granted(kind) {
      var p = policy();
      var value = p[kind] !== undefined ? p[kind] : p[kind === 'analytics' ? 'anl' : 'adv'];
      return value === true || value === 1 || value === '1' || value === 'true';
    }
    function eventId() {
      if (!window.crypto || typeof window.crypto.getRandomValues !== 'function') return '';
      var bytes = new Uint8Array(16);
      window.crypto.getRandomValues(bytes);
      var hex = '';
      for (var i = 0; i < bytes.length; i++) hex += (bytes[i] < 16 ? '0' : '') + bytes[i].toString(16);
      return 'wlm_' + hex;
    }
    return function (card, form, placement) {
      if (!card || !form || !/^[a-z0-9_-]{1,60}$/.test(placement)) return function () {};
      var pagePath = /^\/[A-Za-z0-9/_-]*$/.test(location.pathname) && location.pathname.length <= 300 ? location.pathname : '/';
      var key = pagePath + '|' + placement;
      if (!measured[key]) measured[key] = { sent: {}, started: false };
      var state = measured[key];
      var visible = false, timer = null, disposed = false, observer = null, wasConnected = false;
      function send(stage) {
        if (disposed || !card.isConnected || state.sent[stage] || !granted('analytics') || typeof window.fetch !== 'function') return;
        var id = eventId();
        if (!id) return;
        state.sent[stage] = true;
        var body = {
          eventId: id, eventName: 'bw_lead_asset_' + stage, assetId: 'berlin-weekly-letter',
          analyticsConsent: true, advertisingConsent: granted('advertising'),
          sourceSlug: pagePath.split('/').filter(Boolean).pop() || 'home', pagePath: pagePath, placement: placement,
          variant: placement, experiment: VERSION, controlType: stage,
          screenWidth: Math.max(0, Math.min(10000, Number(window.innerWidth) || 0)),
          qa: /(?:^|[?&])bw_qa=1(?:&|$)/.test(location.search.slice(1))
        };
        try {
          window.fetch(ENDPOINT, { method: 'POST', credentials: 'omit', keepalive: true, headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
            .then(function (response) { if (!response || !response.ok) state.sent[stage] = false; })
            .catch(function () { state.sent[stage] = false; });
        } catch (error) { state.sent[stage] = false; }
      }
      function refresh() {
        if (disposed) return;
        if (card.isConnected) wasConnected = true;
        else { if (wasConnected) dispose(); return; }
        if (timer !== null) { clearTimeout(timer); timer = null; }
        if (!granted('analytics')) return;
        send('gate_view');
        if (state.started) send('form_start');
        if (visible && document.visibilityState !== 'hidden' && !state.sent.gate_seen) {
          timer = setTimeout(function () { timer = null; if (visible && document.visibilityState !== 'hidden') send('gate_seen'); }, 1000);
        }
      }
      function start() { state.started = true; refresh(); }
      function dispose() {
        disposed = true;
        if (timer !== null) clearTimeout(timer);
        if (observer) observer.disconnect();
        for (var i = 0; i < CONSENT_EVENTS.length; i++) {
          window.removeEventListener(CONSENT_EVENTS[i], refresh);
          document.removeEventListener(CONSENT_EVENTS[i], refresh);
        }
        document.removeEventListener('visibilitychange', refresh);
      }
      form.addEventListener('focusin', start, { once: true });
      form.addEventListener('input', start, { once: true });
      for (var i = 0; i < CONSENT_EVENTS.length; i++) {
        window.addEventListener(CONSENT_EVENTS[i], refresh);
        document.addEventListener(CONSENT_EVENTS[i], refresh);
      }
      document.addEventListener('visibilitychange', refresh);
      if (typeof window.IntersectionObserver === 'function') {
        observer = new window.IntersectionObserver(function (entries) {
          for (var j = 0; j < entries.length; j++) visible = entries[j].isIntersecting === true && entries[j].intersectionRatio >= 0.5;
          refresh();
        }, { threshold: [0, 0.5] });
        observer.observe(card);
      }
      // The surface can be bound a moment before it is placed in the page.
      var attempts = 0;
      (function attach() {
        if (disposed) return;
        if (card.isConnected || attempts++ > 40) { refresh(); return; }
        setTimeout(attach, 250);
      })();
      return dispose;
    };
  })();
  // BW-LETTER-MEASURE:END

  function bindLetterBar(bar) {
    var form = bar.querySelector('form');
    var msg = bar.querySelector('.bw-lb-msg');
    var button = bar.querySelector('button[type="submit"]');
    var startedAt = new Date().toISOString();
    var closeButton = bar.querySelector('.bw-lb-close');
    // The inline copy on resident posts is rendered with the page; the bar only after a third of the article.
    bwLetterMeasure(bar, form, bar.hasAttribute(RESIDENT_MARKER) ? 'post_letter_inline' : 'post_letter_bar');
    if (closeButton) closeButton.addEventListener('click', function () { closeLetterBar(bar, true); });
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var email = String(form.email.value || '').trim().toLowerCase();
      if (!email || email.indexOf('@') < 1) {
        msg.className = 'bw-lb-msg bw-lb-err';
        msg.textContent = 'That email does not look right. Check it and try again.';
        return;
      }
      if (!form.consent.checked) {
        msg.className = 'bw-lb-msg bw-lb-err';
        msg.textContent = 'Tick the box so I am allowed to email you.';
        return;
      }
      button.disabled = true;
      msg.className = 'bw-lb-msg';
      msg.textContent = 'Sending.';
      fetch(LETTER_API + '?action=submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          consent: true,
          consentVersion: LETTER_CONSENT_VERSION,
          assetId: LETTER_ASSET_ID,
          assetVersion: LETTER_ASSET_VERSION,
          sourceSlug: currentSlug(),
          sourceUrl: window.location.href,
          placement: 'post_letter_bar',
          variant: 'letter_bar',
          analyticsConsentAtSubmit: false,
          screenWidth: Number(window.innerWidth || 0),
          screenHeight: Number(window.innerHeight || 0),
          website: String(form.website.value || ''),
          startedAt: startedAt,
          submittedAt: new Date().toISOString()
        })
      }).then(function (r) {
        if (!r.ok) throw new Error('submit ' + r.status);
        return r.json();
      }).then(function () {
        // The API answers the same way whatever it decides, so this only
        // reports that the request was taken. The confirmation email is what
        // actually subscribes the reader.
        storageSet(LETTER_JOINED_KEY, Date.now());
        form.innerHTML = '<p class="bw-lb-t" style="margin:0"><strong>Check your inbox.</strong> Click the link in my email to confirm, and the next letter reaches you on Monday morning.</p>';
        if (!bar.hasAttribute(RESIDENT_MARKER)) window.setTimeout(function () { closeLetterBar(bar, false); }, 9000);
      }).catch(function () {
        button.disabled = false;
        msg.className = 'bw-lb-msg bw-lb-err';
        msg.textContent = 'That did not go through. Try again in a moment.';
      });
    });
  }

  function showLetterBar() {
    if (isResidentPost()) return;
    if (document.getElementById(LETTER_BAR_ID) || !document.body) return;
    letterBarStyles();
    var bar = buildLetterBar();
    document.body.appendChild(bar);
    bindLetterBar(bar);
    var raf = window.requestAnimationFrame || function (fn) { return window.setTimeout(fn, 16); };
    raf(function () { raf(function () { bar.classList.add('bw-lb-open'); }); });
  }

  function initLetterBar() {
    if (isResidentPost()) return;
    if (letterBarStarted || !isSurfacePath()) return;
    if (/[?&]bwLetterBar=0(?:&|$)/.test(location.search)) return;
    if (letterBarSuppressed(Date.now())) return;
    letterBarStarted = true;
    var shown = false;
    var ticking = false;
    function check() {
      ticking = false;
      if (shown) return;
      var active = document.activeElement;
      // Never interrupt a reader who is filling in the Date Check card.
      if (active && active.closest && active.closest('[' + DATE_CHECK_MARKER + ']')) return;
      if (scrollDepth() < LETTER_SHOW_DEPTH) return;
      shown = true;
      window.removeEventListener('scroll', onScroll);
      showLetterBar();
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      (window.requestAnimationFrame || function (fn) { return window.setTimeout(fn, 16); })(check);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function boot() {
    refreshResidentTopics();
    retries = 0;
    scheduleInject(0);
    startObserver();
    initLetterBar();
  }

  if (window.BW_BLOG_INJECTOR_TEST_HOOKS === true) {
    window.__bwBlogInjectorTestHooks = {
      dateCheckTargetUrl: dateCheckTargetUrl,
      dateCheckCardVariant: dateCheckCardVariant,
      normaliseDateCheckVariant: normaliseDateCheckVariant,
      validDateFields: validDateFields,
      shouldRequestDatePicker: shouldRequestDatePicker,
      insertionTarget: insertionTarget,
      findContentColumn: findContentColumn,
      syncSurfaceGutters: syncSurfaceGutters,
      findDateCheckInsertionPoint: findDateCheckInsertionPoint,
      findBookingInsertionPoint: findBookingInsertionPoint,
      letterBarSuppressed: letterBarSuppressed,
      buildLetterBar: buildLetterBar,
      letterConsentText: LETTER_CONSENT_TEXT,
      eastWestSlug: eastWestSlug,
      eastWestHref: eastWestHref,
      findEastWestPoint: findEastWestPoint,
      buildEastWestCard: buildEastWestCard,
      surfaceFollows: surfaceFollows,
      ownMutation: ownMutation,
      placeSurface: placeSurface,
      resetPlacement: resetPlacement,
      blockFingerprint: blockFingerprint
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
  // Only a width change can need new gutters; the mobile URL bar changes the height only.
  var lastWidth = window.innerWidth || 0;
  window.addEventListener('resize', function () {
    var width = window.innerWidth || 0;
    if (width === lastWidth) return;
    lastWidth = width;
    if (isSurfacePath() && !DISABLED) scheduleInject(80);
  });
})();
