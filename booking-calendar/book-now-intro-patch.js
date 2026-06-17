(function () {
  var path = window.location.pathname.toLowerCase();
  if (path.indexOf('/book-berlin-walking-tour/') !== 0) return;

  var STYLE_ID = 'bw-book-now-intro-patch-css';
  var INTRO_HTML = [
    "<div class='bw-cal-intro'>",
    "<span class='bw-cal-intro-kicker'>Book the tour</span>",
    '<h2>Free Berlin Walking Tour</h2>',
    "<p>Reserve your spot for a 2-hour, tip-based walk through Berlin's historic centre.</p>",
    "<div class='bw-cal-intro-chips' aria-label='Tour booking details'>",
    "<span class='bw-cal-intro-chip'>Free reservation</span>",
    "<span class='bw-cal-intro-chip'>Tue-Sat 11:30</span>",
    "<span class='bw-cal-intro-chip'>From 3 July 2026: 11:30 + 15:30</span>",
    "<span class='bw-cal-intro-chip'>Tip at the end</span>",
    "<span class='bw-cal-intro-chip'>Phone only for tour-day coordination</span>",
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
      '@media(max-width:640px){bw-booking-calendar .bw-cal-standalone{padding:18px 12px 26px}bw-booking-calendar .bw-cal-intro h2{font-size:30px;line-height:1.05}bw-booking-calendar .bw-cal-intro p{font-size:14px}bw-booking-calendar .bw-cal-intro-chip{font-size:10.5px;min-height:28px;padding:6px 9px}}',
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

    if (!calendar.querySelector('.bw-cal-intro')) {
      var wrapper = document.createElement('div');
      wrapper.innerHTML = INTRO_HTML;
      section.insertBefore(wrapper.firstElementChild, shell);
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
