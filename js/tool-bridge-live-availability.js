/* Updates the booking bridge on /tools/* from live bookable-tour availability.
 * It deliberately leaves the bridge's rule-based label in place only while the
 * availability request is loading or unavailable.
 */
(function () {
  var LIVE_AVAILABILITY_URL = 'https://berlinwalk-content-app.vercel.app/api/booking-calendar-availability?days=60';
  var BRIDGE_SELECTOR = '[data-bw-blog-journey][data-bw-blog-journey-intent="tool_bridge"]';
  var TIME_ZONE = 'Europe/Berlin';
  var DAY_MS = 24 * 60 * 60 * 1000;
  var dataPromise = null;
  var cachedSlots = [];
  var observer = null;
  var refreshTimer = null;
  var lastPath = location.pathname;

  function isToolPage() {
    var path = String(location.pathname || '').toLowerCase();
    return path.indexOf('/tools/') === 0 && path !== '/tools/';
  }

  function berlinParts(date) {
    var map = {};
    new Intl.DateTimeFormat('en-US', {
      timeZone: TIME_ZONE,
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).formatToParts(date).forEach(function (part) {
      if (part.type !== 'literal') map[part.type] = part.value;
    });
    return {
      dateKey: map.year + '-' + map.month + '-' + map.day,
      weekdayShort: map.weekday,
      monthShort: map.month,
      day: Number(map.day),
      hour: Number(map.hour),
      minute: Number(map.minute)
    };
  }

  function startLabel(parts) {
    return String(parts.hour).padStart(2, '0') + ':' + String(parts.minute).padStart(2, '0');
  }

  function dayLabel(parts, today, tomorrow) {
    if (parts.dateKey === today.dateKey) return 'Today (' + parts.weekdayShort + ')';
    if (parts.dateKey === tomorrow.dateKey) return 'Tomorrow (' + parts.weekdayShort + ')';
    return parts.weekdayShort + ' (' + parts.day + ' ' + parts.monthShort + ')';
  }

  function liveSlots(data) {
    var now = new Date();
    var today = berlinParts(now);
    var tomorrow = berlinParts(new Date(now.getTime() + DAY_MS));
    var source = data && Array.isArray(data.slots) ? data.slots : [];
    return source.map(function (slot) {
      var date = slot && slot.startDate ? new Date(slot.startDate) : null;
      if (!date || isNaN(date.getTime()) || date.getTime() <= now.getTime()) return null;
      var parts = berlinParts(date);
      return {
        dateKey: parts.dateKey,
        timestamp: date.getTime(),
        label: dayLabel(parts, today, tomorrow),
        start: startLabel(parts)
      };
    }).filter(Boolean).sort(function (a, b) {
      return a.timestamp - b.timestamp;
    }).slice(0, 2);
  }

  function bridgeTitle(slots) {
    if (!slots.length) return '';
    if (slots.length === 1) return 'Next free walk: ' + slots[0].label + ' at ' + slots[0].start;
    if (slots[0].dateKey === slots[1].dateKey) {
      return 'Next free walks: ' + slots[0].label + ' at ' + slots[0].start + ' and ' + slots[1].start;
    }
    return 'Next free walks: ' + slots[0].label + ' at ' + slots[0].start + ' and ' + slots[1].label + ' at ' + slots[1].start;
  }

  function applyLiveTitle() {
    var title = bridgeTitle(cachedSlots);
    if (!title) return;
    Array.prototype.forEach.call(document.querySelectorAll(BRIDGE_SELECTOR), function (bridge) {
      var heading = bridge.querySelector('.bw-tool-bridge-main h2, h2');
      if (!heading || heading.textContent === title) return;
      heading.textContent = title;
      bridge.setAttribute('data-bw-tool-bridge-availability', 'live');
    });
  }

  function fetchAvailability(force) {
    if (!force && dataPromise) return dataPromise;
    if (typeof fetch !== 'function') return Promise.resolve([]);
    dataPromise = fetch(LIVE_AVAILABILITY_URL, { mode: 'cors', credentials: 'omit' })
      .then(function (response) {
        if (!response || !response.ok) throw new Error('availability request failed');
        return response.json();
      })
      .then(function (data) {
        cachedSlots = liveSlots(data);
        return cachedSlots;
      })
      .catch(function () {
        return [];
      });
    return dataPromise;
  }

  function refresh(force) {
    if (!isToolPage()) return;
    if (cachedSlots.length && !force) {
      applyLiveTitle();
      return;
    }
    fetchAvailability(force).then(applyLiveTitle);
  }

  function scheduleRefresh() {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(refresh, 50);
  }

  function boot() {
    refresh(false);
    if (observer) observer.disconnect();
    observer = new MutationObserver(scheduleRefresh);
    if (document.body) observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  window.setInterval(function () {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      cachedSlots = [];
      dataPromise = null;
      boot();
      return;
    }
    refresh(true);
  }, 15 * 60 * 1000);
})();
