(function () {
  var path = window.location.pathname.toLowerCase();
  if (path.indexOf('/book-berlin-walking-tour/') !== 0) return;

  var STYLE_ID = 'bw-book-now-intro-patch-css';
  var NUDGE_ID = 'bw-booking-calendar-next-nudge';
  var INTRO_VERSION = 'booking-next-20260701b';
  var INTRO_HTML = [
    "<div class='bw-cal-intro' data-bw-booking-intro-version='" + INTRO_VERSION + "'>",
    "<span class='bw-cal-intro-kicker'>Book the tour</span>",
    '<h2>Reserve your free spot</h2>',
    "<p>No upfront payment. My walk is ~2h, tip-based at the end, and starts at the World Clock on Alexanderplatz.</p>",
    "<div class='bw-cal-intro-chips' aria-label='Tour booking details'>",
    "<span class='bw-cal-intro-chip'>Free reservation</span>",
    "<span class='bw-cal-intro-chip'>No payment now</span>",
    "<span class='bw-cal-intro-chip'>~2h walk</span>",
    "<span class='bw-cal-intro-chip'>World Clock meeting point</span>",
    "<span class='bw-cal-intro-chip'>Guided by Yusuf</span>",
    '</div>',
    '</div>',
  ].join('');

  function installStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      'bw-booking-calendar .bw-cal-standalone{box-sizing:border-box;margin:0 auto;max-width:1160px;padding:32px 24px 44px}',
      'bw-booking-calendar .bw-cal-intro{display:grid;gap:10px;margin:0 0 14px;min-width:0}',
      'bw-booking-calendar .bw-cal-intro-kicker{color:var(--green);font-size:11px;font-weight:900;letter-spacing:0;line-height:1;text-transform:uppercase}',
      'bw-booking-calendar .bw-cal-intro h2{color:var(--green);font-size:36px;font-weight:900;letter-spacing:0!important;line-height:1.02;margin:0}',
      'bw-booking-calendar .bw-cal-intro p{color:var(--muted);font-size:15px;font-weight:700;line-height:1.5;margin:0;max-width:640px}',
      'bw-booking-calendar .bw-cal-intro-chips{display:flex;flex-wrap:wrap;gap:7px;min-width:0}',
      'bw-booking-calendar .bw-cal-intro-chip{align-items:center;background:#F8FBF4;border:1px solid #CFE4C8;border-radius:999px;color:var(--green);display:inline-flex;font-size:11px;font-weight:850;line-height:1.15;min-height:30px;padding:7px 10px;white-space:normal}',
      'bw-booking-calendar .bw-cal-standalone .bw-cal-cta{font-size:15px!important;height:48px!important}',
      '#' + NUDGE_ID + '{align-items:center;background:#1B5E20;bottom:0;box-shadow:0 -12px 28px rgba(0,0,0,.18);color:#fff;display:none;font-family:Montserrat,Arial,sans-serif;gap:12px;left:0;padding:12px 14px calc(12px + env(safe-area-inset-bottom));position:fixed;right:0;z-index:2147483646}',
      '#' + NUDGE_ID + '.is-visible{display:flex}',
      '#' + NUDGE_ID + ' strong{color:#FFE600;display:block;font-size:13px;font-weight:900;line-height:1.2}',
      '#' + NUDGE_ID + ' span{display:block;font-size:11px;font-weight:750;line-height:1.35;margin-top:2px}',
      '#' + NUDGE_ID + ' button{background:#FFE600;border:0;border-radius:0;color:#1B5E20;cursor:pointer;font-family:Montserrat,Arial,sans-serif;font-size:12px;font-weight:900;margin-left:auto;min-height:42px;padding:10px 13px;text-transform:uppercase}',
      '@media(max-width:640px){bw-booking-calendar .bw-cal-standalone{padding:18px 16px 26px}bw-booking-calendar .bw-cal-intro h2{font-size:30px;line-height:1.05}bw-booking-calendar .bw-cal-intro p{font-size:14px}bw-booking-calendar .bw-cal-intro-chip{font-size:10.5px;min-height:28px;padding:6px 9px}}',
      '@media(min-width:641px){#' + NUDGE_ID + '{display:none!important}}',
    ].join('');
    document.head.appendChild(style);
  }

  function preserveAttribution(href) {
    var url = new URL(href, window.location.href);
    var incoming = new URL(window.location.href);
    [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_content',
      'utm_term',
      'utm_id',
      'fbclid',
      'fbc',
      'fbp',
    ].forEach(function (param) {
      if (incoming.searchParams.has(param)) {
        url.searchParams.set(param, incoming.searchParams.get(param));
      }
    });
    return url.toString();
  }

  function pushBookingNudgeEvent(name, payload) {
    var data = payload || {};
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({ event: name }, data));
    } catch (e) {}
    try {
      if (typeof window.gtag === 'function') window.gtag('event', name, data);
    } catch (e) {}
    try {
      if (typeof window.fbq === 'function') window.fbq('trackCustom', name, data);
    } catch (e) {}
  }

  function findContinueCta(calendar) {
    return calendar.querySelector('[data-action="continue"]:not(.is-disabled), .bw-cal-cta:not(.is-disabled)');
  }

  function ensureNextNudge() {
    var nudge = document.getElementById(NUDGE_ID);
    if (nudge) return nudge;
    nudge = document.createElement('div');
    nudge.id = NUDGE_ID;
    nudge.setAttribute('role', 'status');
    nudge.setAttribute('aria-live', 'polite');
    nudge.innerHTML = [
      '<div><strong>Time selected</strong><span>Continue to the free reservation form.</span></div>',
      '<button type="button">Continue</button>',
    ].join('');
    document.body.appendChild(nudge);
    return nudge;
  }

  function hideNextNudge() {
    var nudge = document.getElementById(NUDGE_ID);
    if (nudge) nudge.classList.remove('is-visible');
  }

  function showNextNudge(calendar) {
    if (window.innerWidth > 640) return;
    var cta = findContinueCta(calendar);
    var nudge = ensureNextNudge();
    nudge.classList.add('is-visible');
    pushBookingNudgeEvent('bw_booking_next_nudge_view', { has_continue: cta ? 'yes' : 'no' });
    nudge.querySelector('button').onclick = function () {
      var currentCta = findContinueCta(calendar);
      pushBookingNudgeEvent('bw_booking_next_nudge_click', { has_continue: currentCta ? 'yes' : 'no' });
      hideNextNudge();
      if (currentCta) {
        try { currentCta.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) {}
        window.setTimeout(function () {
          try { currentCta.click(); } catch (e) {}
        }, 120);
      }
    };
    window.setTimeout(function () {
      var currentCta = findContinueCta(calendar);
      if (currentCta) {
        try { currentCta.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) {}
      }
    }, 120);
  }

  function patchBookingHref() {
    if (!window.customElements || !customElements.get('bw-booking-calendar')) return false;
    var Ctor = customElements.get('bw-booking-calendar');
    var proto = Ctor && Ctor.prototype;
    if (!proto || proto.__bwIntroHrefPatch || typeof proto._bookingHref !== 'function') return Boolean(proto && proto.__bwIntroHrefPatch);
    var original = proto._bookingHref;
    proto._bookingHref = function (slot) {
      return preserveAttribution(original.call(this, slot));
    };
    proto.__bwIntroHrefPatch = true;
    return true;
  }

  function applyIntro() {
    var calendar = document.querySelector('bw-booking-calendar[navigation-mode="event"]:not([hide-intro])');
    if (!calendar) return false;
    var section = calendar.querySelector('.bw-booking-calendar');
    var shell = calendar.querySelector('.bw-cal-shell');
    if (!section || !shell) return false;

    section.classList.add('bw-cal-standalone');

    var intro = calendar.querySelector('.bw-cal-intro');
    if (!intro || intro.getAttribute('data-bw-booking-intro-version') !== INTRO_VERSION) {
      var wrapper = document.createElement('div');
      wrapper.innerHTML = INTRO_HTML;
      if (intro) {
        intro.replaceWith(wrapper.firstElementChild);
      } else {
        section.insertBefore(wrapper.firstElementChild, shell);
      }
    }

    var title = calendar.querySelector('.bw-cal-title');
    if (title && title.textContent.trim() !== 'Choose your date and time') {
      title.textContent = 'Choose your date and time';
    }

    calendar.querySelectorAll('.bw-cal-cta').forEach(function (cta) {
      if (cta.textContent.trim() === 'Reserve your spot') {
        cta.textContent = 'Continue to free reservation';
      }
      if (cta.href) cta.href = preserveAttribution(cta.href);
    });

    if (!calendar.__bwNextActionBound) {
      calendar.__bwNextActionBound = true;
      calendar.addEventListener('click', function (event) {
        var slotButton = event.target && event.target.closest ? event.target.closest('.bw-cal-slot,[data-slot]') : null;
        if (slotButton) {
          window.setTimeout(function () { showNextNudge(calendar); }, 80);
          return;
        }
        var cta = event.target && event.target.closest ? event.target.closest('[data-action="continue"],.bw-cal-cta') : null;
        if (cta) hideNextNudge();
      });
    }
    return true;
  }

  function start() {
    installStyles();
    patchBookingHref();

    var observer = null;
    function watch() {
      var calendar = document.querySelector('bw-booking-calendar[navigation-mode="event"]:not([hide-intro])');
      if (!calendar) return false;
      if (!observer) {
        observer = new MutationObserver(function () { applyIntro(); });
        observer.observe(calendar, { childList: true, subtree: true });
      }
      return applyIntro();
    }

    if (window.customElements && customElements.whenDefined) {
      customElements.whenDefined('bw-booking-calendar').then(function () {
        patchBookingHref();
        watch();
      }).catch(function () {});
    }

    var tries = 0;
    var timer = window.setInterval(function () {
      tries += 1;
      if (watch() || tries > 80) window.clearInterval(timer);
    }, 250);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
