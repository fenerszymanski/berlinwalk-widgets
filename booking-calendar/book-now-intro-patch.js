(function () {
  var path = window.location.pathname.toLowerCase();
  var isBookingService = path.indexOf('/book-berlin-walking-tour/') === 0;
  var isBookingForm = path.indexOf('/booking-form') === 0;
  if (!isBookingService && !isBookingForm) return;
  var RUNTIME_KEY = '__bwBookNowIntroPatch20260719b';
  if (window[RUNTIME_KEY]) return;
  window[RUNTIME_KEY] = true;

  var STYLE_ID = 'bw-book-now-intro-patch-css-20260719b';
  var NUDGE_ID = 'bw-booking-calendar-next-nudge';
  var FORM_CARD_ID = 'bw-booking-form-trust-card';
  var TERMS_HELPER_ID = 'bw-booking-terms-helper';
  var INTRO_VERSION = 'booking-service-stage-20260719b';
  var FORM_VERSION = 'booking-form-stage-20260719b';
  var TERMS_LABEL = 'I agree to the free reservation terms listed below.';
  var INTRO_HTML = [
    "<div class='bw-cal-intro' data-bw-booking-intro-version='" + INTRO_VERSION + "'>",
    "<span class='bw-cal-intro-kicker'>Book the tour</span>",
    '<h1>Reserve your free spot</h1>',
    "<p>No upfront payment. My walk takes about 2 hours, is tip-based at the end, and starts at the World Clock on Alexanderplatz.</p>",
    "<div class='bw-cal-intro-chips' aria-label='Tour booking details'>",
    "<span class='bw-cal-intro-chip'>Free reservation</span>",
    "<span class='bw-cal-intro-chip'>No payment now</span>",
    "<span class='bw-cal-intro-chip'>About 2 hours</span>",
    "<span class='bw-cal-intro-chip'>World Clock meeting point</span>",
    "<span class='bw-cal-intro-chip'>Guided by Yusuf</span>",
    '</div>',
    '</div>',
  ].join('');

  function installStyles() {
    var style = document.getElementById(STYLE_ID);
    var isNew = !style;
    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
    }
    style.textContent = [
      'bw-booking-calendar .bw-cal-standalone{box-sizing:border-box;margin:0 auto;max-width:1160px;padding:32px 24px 44px}',
      'bw-booking-calendar .bw-cal-intro{display:grid;gap:10px;margin:0 0 14px;min-width:0}',
      'bw-booking-calendar .bw-cal-intro-kicker{color:var(--green);font-size:11px;font-weight:900;letter-spacing:0;line-height:1;text-transform:uppercase}',
      'bw-booking-calendar .bw-cal-intro h1{color:var(--green);font-size:36px;font-weight:900;letter-spacing:0!important;line-height:1.02;margin:0}',
      'bw-booking-calendar .bw-cal-intro p{color:var(--muted);font-size:15px;font-weight:700;line-height:1.5;margin:0;max-width:640px}',
      'bw-booking-calendar .bw-cal-intro-chips{display:flex;flex-wrap:wrap;gap:7px;min-width:0}',
      'bw-booking-calendar .bw-cal-intro-chip{align-items:center;background:#F8FBF4;border:1px solid #CFE4C8;border-radius:999px;color:var(--green);display:inline-flex;font-size:11px;font-weight:850;line-height:1.15;min-height:30px;padding:7px 10px;white-space:normal}',
      'bw-booking-calendar .bw-booking-progress{min-width:0}',
      'bw-booking-calendar .bw-booking-progress ol,#'+FORM_CARD_ID+' .bw-booking-progress ol{display:grid;gap:7px;grid-template-columns:minmax(0,1fr) minmax(0,1fr);list-style:none;margin:0;padding:0}',
      'bw-booking-calendar .bw-booking-progress li,#'+FORM_CARD_ID+' .bw-booking-progress li{align-items:center;background:#F8FBF4;border:1px solid #CFE4C8;border-radius:7px;color:#4E5A4E;column-gap:4px;display:grid;grid-template-columns:minmax(0,1fr) auto;min-width:0;padding:4px 7px;row-gap:2px}',
      'bw-booking-calendar .bw-booking-progress li.is-active,#'+FORM_CARD_ID+' .bw-booking-progress li.is-active{background:#FFE600;border-color:#D1B800;color:#123D18}',
      'bw-booking-calendar .bw-booking-progress li.is-complete,#'+FORM_CARD_ID+' .bw-booking-progress li.is-complete{background:#1B5E20;border-color:#1B5E20;color:#fff}',
      'bw-booking-calendar .bw-booking-progress .bw-progress-number,#'+FORM_CARD_ID+' .bw-booking-progress .bw-progress-number{font-size:10px;font-weight:900;grid-column:1;grid-row:1;line-height:1;text-transform:uppercase}',
      'bw-booking-calendar .bw-booking-progress strong,#'+FORM_CARD_ID+' .bw-booking-progress strong{color:inherit;display:block;font-size:11px;font-weight:900;grid-column:1/-1;grid-row:2;line-height:1.15;margin:0}',
      'bw-booking-calendar .bw-booking-progress .bw-progress-state,#'+FORM_CARD_ID+' .bw-booking-progress .bw-progress-state{font-size:9px;font-weight:800;grid-column:2;grid-row:1;line-height:1.1}',
      'bw-booking-calendar .bw-cal-standalone .bw-cal-cta{font-size:15px!important;height:48px!important}',
      'html.bw-booking-funnel-active .bw-booking-stage-section{background:radial-gradient(circle at 50% 20%,#fff 0,#FAFAF5 58%,#F2F7EE 100%)!important;height:auto!important;min-height:calc(100vh - 143px)!important;min-height:calc(100svh - 143px)!important}',
      'html.bw-booking-funnel-active .bw-booking-stage-inner{align-items:center!important;box-sizing:border-box!important;display:flex!important;justify-content:center!important;min-height:inherit!important;padding:44px 24px!important;width:100%!important}',
      'html.bw-booking-funnel-active .bw-booking-stage-wrap{display:block!important;height:auto!important;margin:0!important;max-width:920px!important;min-height:0!important;place-self:auto!important;width:min(920px,100%)!important}',
      'html.bw-booking-funnel-active .bw-booking-stage-wrap>bw-booking-calendar{display:block!important;max-width:none!important;width:100%!important}',
      'html.bw-booking-funnel-active .bw-booking-stage-wrap .bw-cal-shell{border-radius:12px;box-shadow:0 18px 42px rgba(18,61,24,.12)}',
      'html.bw-booking-funnel-active .bw-booking-stage-wrap .bw-cal-cta{background:#FFE600!important;color:#123D18!important;font-weight:900!important}',
      'html.bw-booking-funnel-active .bw-booking-stage-wrap .bw-cal-cta:hover,html.bw-booking-funnel-active .bw-booking-stage-wrap .bw-cal-cta:focus-visible{background:#FFF066!important;color:#123D18!important}',
      'html.bw-booking-form-trust-active [data-hook="form-field-c75b1793-ac5f-4491-a1d6-61cc895c7b94"] p{display:none!important}',
      'html body #'+FORM_CARD_ID+'{background:#F8FBF4;border:1px solid #CFE4C8;border-left:5px solid #1B5E20;box-sizing:border-box;color:#212121;font-family:Montserrat,Arial,sans-serif;margin:0 0 14px;padding:12px 13px}',
      'html body #'+FORM_CARD_ID+'>strong{color:#1B5E20;display:block;font-size:17px;font-weight:900;line-height:1.18;margin:10px 0 5px}',
      'html body #'+FORM_CARD_ID+' p{color:#4E5A4E!important;display:block!important;font-family:Montserrat,Arial,sans-serif!important;font-size:12px!important;font-weight:700!important;line-height:1.4!important;margin:0!important}',
      'html body #'+FORM_CARD_ID+' p+p{margin-top:4px!important}',
      'html.bw-booking-form-trust-active .bw-booking-form-stack{margin-bottom:8px!important}',
      'html.bw-booking-form-trust-active .bw-booking-details-stack,html.bw-booking-form-trust-active .bw-booking-submit-stack{margin-top:8px!important}',
      'html.bw-booking-form-trust-active .bw-booking-terms-field{margin-bottom:0!important;padding-bottom:0!important}',
      'html.bw-booking-form-trust-active .bw-booking-terms-field [data-hook="checkbox-wrapper"]{margin-bottom:0!important;padding-bottom:0!important}',
      '#'+TERMS_HELPER_ID+'{background:#F8FBF4;border-left:4px solid #1B5E20;color:#4E5A4E;font-family:Montserrat,Arial,sans-serif;font-size:12px;font-weight:750;line-height:1.45;margin:8px 0 6px 34px;max-width:660px;padding:9px 11px}',
      '#' + NUDGE_ID + '{align-items:center;background:#1B5E20;bottom:0;box-shadow:0 -12px 28px rgba(0,0,0,.18);color:#fff;display:none;font-family:Montserrat,Arial,sans-serif;gap:12px;left:0;padding:12px 14px calc(12px + env(safe-area-inset-bottom));position:fixed;right:0;z-index:2147483646}',
      '#' + NUDGE_ID + '.is-visible{display:flex}',
      '#' + NUDGE_ID + ' strong{color:#FFE600;display:block;font-size:13px;font-weight:900;line-height:1.2}',
      '#' + NUDGE_ID + ' span{display:block;font-size:11px;font-weight:750;line-height:1.35;margin-top:2px}',
      '#' + NUDGE_ID + ' button{background:#FFE600;border:0;border-radius:0;color:#1B5E20;cursor:pointer;font-family:Montserrat,Arial,sans-serif;font-size:12px;font-weight:900;margin-left:auto;min-height:42px;padding:10px 13px;text-transform:uppercase}',
      '@media(max-width:750px){html.bw-booking-funnel-active .bw-booking-stage-section{min-height:calc(100svh - 94px)!important}html.bw-booking-funnel-active .bw-booking-stage-inner{padding:20px 0!important}html.bw-booking-funnel-active .bw-booking-stage-wrap{width:100%!important}}',
      '@media(max-width:640px){bw-booking-calendar .bw-cal-standalone{padding:18px 16px 26px}bw-booking-calendar .bw-cal-intro h1{font-size:30px;line-height:1.05}bw-booking-calendar .bw-cal-intro p{font-size:14px}bw-booking-calendar .bw-cal-intro-chip{font-size:10.5px;min-height:28px;padding:6px 9px}bw-booking-calendar .bw-booking-progress ol,#'+FORM_CARD_ID+' .bw-booking-progress ol{gap:5px}bw-booking-calendar .bw-booking-progress li,#'+FORM_CARD_ID+' .bw-booking-progress li{padding:4px 6px}html body #'+FORM_CARD_ID+'{margin-bottom:12px;padding:11px 11px}html body #'+FORM_CARD_ID+'>strong{font-size:16px;margin-top:8px}html body #'+FORM_CARD_ID+' p{font-size:11.5px!important}#'+TERMS_HELPER_ID+'{font-size:11.5px;margin:7px 0 4px 32px;padding:8px 10px}html.bw-booking-form-trust-active .bw-booking-form-stack{margin-bottom:6px!important}html.bw-booking-form-trust-active .bw-booking-details-stack,html.bw-booking-form-trust-active .bw-booking-submit-stack{margin-top:6px!important}}',
      '@media(min-width:641px){#' + NUDGE_ID + '{display:none!important}}',
    ].join('');
    if (isNew) document.head.appendChild(style);
  }

  function textOf(el) {
    return (el && (el.innerText || el.textContent) || '').replace(/\s+/g, ' ').trim();
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

  function applyIntro(calendar) {
    if (!isBookingService) return false;
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

    var head = calendar.querySelector('.bw-cal-head');
    if (head) {
      var oldNote = head.querySelector('.bw-cal-note');
      if (oldNote) oldNote.remove();
      var progress = head.querySelector('.bw-booking-progress');
      if (!progress || progress.getAttribute('data-bw-progress-version') !== INTRO_VERSION) {
        var progressWrap = document.createElement('div');
        progressWrap.innerHTML = serviceProgressHtml();
        if (progress) progress.replaceWith(progressWrap.firstElementChild);
        else head.appendChild(progressWrap.firstElementChild);
      }
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
          window.setTimeout(function () {
            applyIntro(calendar);
            showNextNudge(calendar);
          }, 80);
          return;
        }
        var calendarControl = event.target && event.target.closest ? event.target.closest('.bw-cal-day,.bw-cal-date-nav') : null;
        if (calendarControl) window.setTimeout(function () { applyIntro(calendar); }, 80);
        var cta = event.target && event.target.closest ? event.target.closest('[data-action="continue"],.bw-cal-cta') : null;
        if (cta) hideNextNudge();
      });
      calendar.addEventListener('change', function () {
        window.setTimeout(function () { applyIntro(calendar); }, 80);
      });
    }
    applyServiceStage(calendar);
    return true;
  }

  function applyServiceStage(calendar) {
    if (!isBookingService || !calendar || !calendar.parentElement) return false;
    var wrap = calendar.parentElement;
    var inner = wrap.parentElement;
    var section = inner && inner.closest ? inner.closest('section') : null;
    var note = wrap.querySelector('.bw-booking-service-note');
    if (note) note.remove();
    wrap.classList.remove('bw-booking-note-row');
    wrap.classList.add('bw-booking-stage-wrap');
    if (inner) inner.classList.add('bw-booking-stage-inner');
    if (section) section.classList.add('bw-booking-stage-section');
    return true;
  }

  function progressHtml(firstClass, firstState, secondClass, secondState) {
    return [
      '<nav class="bw-booking-progress" data-bw-progress-version="' + INTRO_VERSION + '" aria-label="Reservation progress">',
      '<ol>',
      '<li class="' + firstClass + '"' + (firstClass.indexOf('is-active') !== -1 ? ' aria-current="step"' : '') + '>',
      '<span class="bw-progress-number">Step 1</span><strong>Date &amp; time</strong>',
      '<span class="bw-progress-state">' + firstState + '</span>',
      '</li>',
      '<li class="' + secondClass + '"' + (secondClass.indexOf('is-active') !== -1 ? ' aria-current="step"' : '') + '>',
      '<span class="bw-progress-number">Step 2</span><strong>Guests &amp; confirm</strong>',
      '<span class="bw-progress-state">' + secondState + '</span>',
      '</li>',
      '</ol>',
      '</nav>'
    ].join('');
  }

  function serviceProgressHtml() {
    return progressHtml('is-active', 'Choose now', '', 'Next');
  }

  function trustCardHtml() {
    return [
      progressHtml('is-complete', 'Selected', 'is-active', 'Current step'),
      '<strong>Complete your free reservation</strong>',
      '<p>Add the guest details below. There is no upfront payment; you tip after the walk.</p>',
      '<p>I use your email for tour details and reminders. Phone is only for tour-day coordination.</p>'
    ].join('');
  }

  function findTermsTextNode() {
    var nodes = document.querySelectorAll('label,span,p,div');
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node.querySelector && node.querySelector('input,select,textarea,button')) continue;
      var text = textOf(node);
      if (/^I agree to terms and conditions\.?$/i.test(text) || /^I agree to the free reservation terms(?: listed below)?\.?$/i.test(text)) return node;
    }
    return null;
  }

  function markSiblingStack(fromNode, matcher, className) {
    var current = fromNode;
    while (current && current !== document.body) {
      var parent = current.parentElement;
      if (!parent || !parent.children) {
        current = parent;
        continue;
      }
      for (var i = 0; i < parent.children.length; i += 1) {
        var sibling = parent.children[i];
        if (sibling === current) continue;
        if (matcher(textOf(sibling))) {
          current.classList.add('bw-booking-form-stack');
          sibling.classList.add(className);
          return true;
        }
      }
      current = parent;
    }
    return false;
  }

  function tightenBookingFormSpacing(anchor) {
    if (!anchor) return;
    var termsField = anchor.closest && anchor.closest('[data-hook^="form-field-"]');
    if (termsField) termsField.classList.add('bw-booking-terms-field');
    markSiblingStack(anchor, function (text) {
      return /^Booking Details\b/i.test(text);
    }, 'bw-booking-details-stack');
    markSiblingStack(anchor, function (text) {
      return /^By completing your booking\b/i.test(text) || /\bBook Now\b/i.test(text);
    }, 'bw-booking-submit-stack');
  }

  function applyBookingFormTrust() {
    if (!isBookingForm) return false;
    document.documentElement.classList.add('bw-booking-form-trust-active');

    var introWrap = document.querySelector('[data-hook="form-field-c75b1793-ac5f-4491-a1d6-61cc895c7b94"]');
    if (introWrap) {
      var card = document.getElementById(FORM_CARD_ID);
      if (!card) {
        card = document.createElement('div');
        card.id = FORM_CARD_ID;
        introWrap.appendChild(card);
      }
      if (card.getAttribute('data-bw-booking-form-version') !== FORM_VERSION) {
        card.setAttribute('data-bw-booking-form-version', FORM_VERSION);
        card.innerHTML = trustCardHtml();
      }
    }

    var termsText = findTermsTextNode();
    if (termsText) {
      if (textOf(termsText) !== TERMS_LABEL) termsText.textContent = TERMS_LABEL;
      var termsRow = termsText.closest('label') || termsText.parentElement;
      if (termsRow && !document.getElementById(TERMS_HELPER_ID)) {
        var helper = document.createElement('div');
        helper.id = TERMS_HELPER_ID;
        helper.textContent = 'Free reservation terms: no upfront payment, tip-based at the end, and please cancel from your confirmation email if plans change.';
        termsRow.insertAdjacentElement('afterend', helper);
      }
      tightenBookingFormSpacing(document.getElementById(TERMS_HELPER_ID) || termsRow);
    }

    return Boolean(introWrap || termsText);
  }

  function start() {
    installStyles();
    if (isBookingForm) {
      var formTries = 0;
      var formTimer = window.setInterval(function () {
        formTries += 1;
        if (applyBookingFormTrust() || formTries > 80) window.clearInterval(formTimer);
      }, 250);
      if (typeof MutationObserver !== 'undefined') {
        try {
          new MutationObserver(function () { applyBookingFormTrust(); }).observe(document.documentElement, {
            childList: true,
            subtree: true
          });
        } catch (e) {}
      }
      return;
    }

    patchBookingHref();

    function watch() {
      var calendar = document.querySelector('bw-booking-calendar[navigation-mode="event"]:not([hide-intro])');
      if (!calendar) return false;
      return applyIntro(calendar);
    }

    if (window.customElements && customElements.whenDefined) {
      customElements.whenDefined('bw-booking-calendar').then(function () {
        patchBookingHref();
        watch();
      }).catch(function () {});
    }

    [0, 250, 750, 1500, 3000, 6000, 10000, 15000, 22000].forEach(function (delay) {
      window.setTimeout(watch, delay);
    });
  }

  function launch() {
    if (isBookingService) {
      window.setTimeout(start, 1500);
      return;
    }
    start();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', launch, { once: true });
  } else {
    launch();
  }
})();
