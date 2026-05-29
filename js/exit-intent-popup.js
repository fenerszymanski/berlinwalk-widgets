/* exit-intent-popup.js - desktop-only BerlinWalk exit-intent popup.
 * Load sitewide via Wix Custom Code, body-end.
 */
(function () {
  var BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
  var SUBSCRIBE_URL = 'https://www.berlinwalk.com/_functions/subscribe';
  var DOWNLOAD_URL = 'https://12ee5ea0-70a7-492f-8020-ffb27cbb630f.usrfiles.com/ugd/5a08a3_12853b807c6947f09135e339d6ea0a57.pdf';
  var IMAGE_URL = getImageUrl();
  var SESSION_KEY = 'bw-exit-intent-triggered';
  var DESKTOP_MIN_WIDTH = 1024;
  var STYLE_ID = 'bw-exit-intent-styles';
  var OVERLAY_ID = 'bw-exit-intent-popup';
  var DWELL_TIME_MS = isPreviewForced() ? 500 : 30000;

  var dwellReady = false;
  var popupShown = false;
  var currentStep = 1;
  var closeTracked = false;

  function getImageUrl() {
    if (/^(localhost|127\.0\.0\.1)$/.test(window.location.hostname)) {
      return 'assets/exit-intent-world-clock.jpg';
    }
    return 'https://fenerszymanski.github.io/berlinwalk-widgets/assets/exit-intent-world-clock.jpg';
  }

  function isPreviewForced() {
    var host = window.location.hostname;
    var isSafeHost = /^(localhost|127\.0\.0\.1)$/.test(host) ||
      host === 'www.berlinwalk.com' ||
      host === 'berlinwalk.com';
    return isSafeHost && (
      window.location.search.indexOf('forceExitPreview=1') !== -1 ||
      window.location.search.indexOf('bwExitPreview=1') !== -1
    );
  }

  function safeSessionGet(key) {
    try {
      return window.sessionStorage.getItem(key);
    } catch (err) {
      return null;
    }
  }

  function safeSessionSet(key, value) {
    try {
      window.sessionStorage.setItem(key, value);
    } catch (err) {}
  }

  function isExcludedPage() {
    var path = window.location.pathname.toLowerCase();
    return path.indexOf('/book-berlin-walking-tour') === 0 ||
      path.indexOf('/thank-you') !== -1 ||
      path.indexOf('/thank_you') !== -1 ||
      path.indexOf('/booking-confirmation') !== -1 ||
      path.indexOf('/bookings-confirmation') !== -1;
  }

  function isDesktop() {
    return isPreviewForced() || window.innerWidth >= DESKTOP_MIN_WIDTH;
  }

  function shouldRun() {
    return isDesktop() && !isExcludedPage() && !safeSessionGet(SESSION_KEY);
  }

  function trackEvent(name, params) {
    var data = params || {};
    data.event_category = 'exit_intent_popup';
    data.page_path = window.location.pathname;
    data.page_url = window.location.href;
    data.popup_step = currentStep;
    data.preview_mode = isPreviewForced() ? 'true' : 'false';

    if (window.dataLayer && typeof window.dataLayer.push === 'function') {
      var layerData = {};
      for (var key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          layerData[key] = data[key];
        }
      }
      layerData.event = name;
      window.dataLayer.push(layerData);
    }

    if (typeof window.gtag === 'function') {
      window.gtag('event', name, data);
    }
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700;800;900&display=swap");',
      '.bw-exit-lock{overflow:hidden!important;}',
      '.bw-exit-overlay{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:28px;background:rgba(9,18,10,.62);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);font-family:Montserrat,Arial,sans-serif;color:#FAFAF5;opacity:0;pointer-events:none;transition:opacity .22s ease;}',
      '.bw-exit-overlay.bw-exit-visible{opacity:1;pointer-events:auto;}',
      '.bw-exit-card{position:relative;width:min(560px,100%);border-radius:8px;border:1px solid rgba(255,230,0,.24);background:rgba(27,94,32,.96);box-shadow:0 30px 80px rgba(0,0,0,.42);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);overflow:hidden;transform:translateY(14px) scale(.98);transition:transform .22s ease;}',
      '.bw-exit-overlay.bw-exit-visible .bw-exit-card{transform:translateY(0) scale(1);}',
      '.bw-exit-card:before{content:"";position:absolute;inset:0 0 auto;height:5px;background:linear-gradient(90deg,#FFE600,#7CB342,#FAFAF5);}',
      '.bw-exit-media{position:relative;aspect-ratio:16/7;min-height:210px;overflow:hidden;background:#123d16;}',
      '.bw-exit-media img{width:100%;height:100%;display:block;object-fit:cover;}',
      '.bw-exit-media:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,20,9,0) 28%,rgba(8,20,9,.42) 100%);}',
      '.bw-exit-badge{position:absolute;left:22px;bottom:18px;z-index:2;max-width:calc(100% - 44px);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;border-radius:999px;background:rgba(27,94,32,.88);color:#FFE600;border:1px solid rgba(255,230,0,.32);padding:8px 12px;font-size:11px;font-weight:900;letter-spacing:1.3px;text-transform:uppercase;box-shadow:0 10px 24px rgba(0,0,0,.24);}',
      '.bw-exit-inner{position:relative;padding:28px 38px 34px;text-align:left;}',
      '.bw-exit-close{position:absolute;top:14px;right:14px;width:36px;height:36px;border:0;border-radius:50%;background:rgba(250,250,245,.1);color:#FAFAF5;font:800 24px/1 Arial,sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;transition:background-color .18s ease,transform .18s ease;}',
      '.bw-exit-close:hover,.bw-exit-close:focus-visible{background:rgba(250,250,245,.18);transform:rotate(90deg);outline:2px solid rgba(255,230,0,.7);outline-offset:2px;}',
      '.bw-exit-step{display:none;}',
      '.bw-exit-step.bw-exit-active{display:block;animation:bwExitIn .18s ease both;}',
      '@keyframes bwExitIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}',
      '.bw-exit-kicker{margin:0 0 12px;color:#FFE600;font-size:11px;font-weight:900;letter-spacing:2.1px;text-transform:uppercase;}',
      '.bw-exit-title{margin:0 44px 12px 0;color:#FFFFFF;font-size:34px;line-height:1.05;font-weight:900;letter-spacing:0;}',
      '.bw-exit-copy{margin:0 0 24px;color:#FAFAF5;font-size:15px;line-height:1.55;font-weight:500;max-width:39em;}',
      '.bw-exit-actions{display:grid;gap:12px;}',
      '.bw-exit-primary,.bw-exit-secondary,.bw-exit-submit,.bw-exit-back,.bw-exit-download{font-family:Montserrat,Arial,sans-serif;cursor:pointer;text-decoration:none;}',
      '.bw-exit-primary,.bw-exit-submit{border:0;border-radius:8px;background:#FFE600;color:#1B5E20;font-size:15px;font-weight:900;line-height:1.2;text-align:center;padding:16px 20px;box-shadow:0 10px 24px rgba(255,230,0,.18);transition:transform .18s ease,box-shadow .18s ease,background-color .18s ease;}',
      '.bw-exit-primary:hover,.bw-exit-submit:hover,.bw-exit-primary:focus-visible,.bw-exit-submit:focus-visible{background:#fff066;transform:translateY(-1px);box-shadow:0 14px 28px rgba(255,230,0,.26);outline:0;}',
      '.bw-exit-download{display:inline-flex;align-items:center;justify-content:center;width:100%;border:0;border-radius:8px;background:#FFE600;color:#1B5E20;font-size:15px;font-weight:900;line-height:1.2;text-align:center;padding:16px 20px;box-shadow:0 10px 24px rgba(255,230,0,.18);transition:transform .18s ease,box-shadow .18s ease,background-color .18s ease;}',
      '.bw-exit-download:hover,.bw-exit-download:focus-visible{background:#fff066;transform:translateY(-1px);box-shadow:0 14px 28px rgba(255,230,0,.26);outline:0;}',
      '.bw-exit-secondary{border:1px solid rgba(250,250,245,.48);border-radius:8px;background:rgba(250,250,245,.08);color:#FAFAF5;font-size:14px;font-weight:800;text-align:center;padding:15px 18px;transition:background-color .18s ease,border-color .18s ease,color .18s ease;}',
      '.bw-exit-secondary:hover,.bw-exit-secondary:focus-visible{border-color:#C5E1A5;background:rgba(197,225,165,.14);color:#FFFFFF;outline:0;}',
      '.bw-exit-form{margin-top:2px;}',
      '.bw-exit-row{display:grid;grid-template-columns:minmax(0,1fr) 132px;gap:10px;}',
      '.bw-exit-input{min-width:0;border:1px solid rgba(250,250,245,.34);border-radius:8px;background:rgba(250,250,245,.12);color:#FFFFFF;font-family:Montserrat,Arial,sans-serif;font-size:15px;font-weight:500;padding:15px 14px;outline:0;}',
      '.bw-exit-input::placeholder{color:rgba(250,250,245,.58);}',
      '.bw-exit-input:focus{border-color:#FFE600;background:rgba(250,250,245,.16);}',
      '.bw-exit-submit{padding:15px 14px;box-shadow:none;}',
      '.bw-exit-submit:disabled{opacity:.68;cursor:not-allowed;transform:none;}',
      '.bw-exit-privacy{margin:12px 0 0;color:rgba(250,250,245,.72);font-size:11px;line-height:1.45;font-weight:500;}',
      '.bw-exit-status{display:none;margin-top:14px;border-radius:8px;padding:11px 12px;font-size:13px;line-height:1.45;font-weight:700;}',
      '.bw-exit-status.bw-exit-error{display:block;background:rgba(230,57,70,.13);border:1px solid rgba(230,57,70,.3);color:#FFD7D9;}',
      '.bw-exit-back{display:inline-flex;align-items:center;margin-top:16px;padding:0;border:0;background:transparent;color:#C5E1A5;font-size:13px;font-weight:800;}',
      '.bw-exit-back:hover,.bw-exit-back:focus-visible{color:#FFFFFF;outline:0;}',
      '.bw-exit-check{width:70px;height:70px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 0 20px;background:rgba(255,230,0,.14);color:#FFE600;border:1px solid rgba(255,230,0,.35);}',
      '.bw-exit-check svg{width:38px;height:38px;}',
      '@media (prefers-reduced-motion:reduce){.bw-exit-overlay,.bw-exit-card,.bw-exit-step,.bw-exit-close,.bw-exit-primary,.bw-exit-secondary,.bw-exit-submit,.bw-exit-download{transition:none!important;animation:none!important;}}'
    ].join('');
    document.head.appendChild(style);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      }[char];
    });
  }

  function setStep(step) {
    var overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) return;

    currentStep = step;
    var steps = overlay.querySelectorAll('[data-bw-exit-step]');
    for (var i = 0; i < steps.length; i++) {
      steps[i].classList.toggle('bw-exit-active', steps[i].getAttribute('data-bw-exit-step') === String(step));
    }

    if (step === 2) {
      var input = overlay.querySelector('[data-bw-exit-email]');
      if (input) setTimeout(function () { input.focus(); }, 40);
    }
  }

  function closePopup(reason) {
    var overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) return;

    if (!closeTracked) {
      closeTracked = true;
      trackEvent('bw_exit_popup_close', { close_reason: reason || 'unknown' });
    }

    overlay.classList.remove('bw-exit-visible');
    document.documentElement.classList.remove('bw-exit-lock');
    document.body.classList.remove('bw-exit-lock');
    document.removeEventListener('keydown', handleKeydown);
    setTimeout(function () {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, 240);
  }

  function handleKeydown(event) {
    if (event.key === 'Escape') {
      closePopup('escape');
    }
    if (event.key === 'Tab') {
      trapFocus(event);
    }
  }

  function trapFocus(event) {
    var overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) return;

    var focusable = overlay.querySelectorAll('.bw-exit-close,.bw-exit-step.bw-exit-active a[href],.bw-exit-step.bw-exit-active button:not([disabled]),.bw-exit-step.bw-exit-active input:not([disabled])');
    if (!focusable.length) return;

    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function renderPopup() {
    injectStyles();

    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    overlay.className = 'bw-exit-overlay';
    overlay.innerHTML = [
      '<div class="bw-exit-card" role="dialog" aria-modal="true" aria-labelledby="bw-exit-title">',
      '<button class="bw-exit-close" type="button" aria-label="Close" data-bw-exit-close>&times;</button>',
      '<div class="bw-exit-media"><img src="' + IMAGE_URL + '" alt="World Clock at Alexanderplatz, BerlinWalk meeting point" width="720" height="404"><span class="bw-exit-badge">World Clock, Alexanderplatz</span></div>',
      '<div class="bw-exit-inner">',
      '<section class="bw-exit-step bw-exit-active" data-bw-exit-step="1">',
      '<p class="bw-exit-kicker">Free walking tour</p>',
      '<h2 class="bw-exit-title" id="bw-exit-title">Don\'t leave Berlin to chance.</h2>',
      '<p class="bw-exit-copy">Start at the World Clock, then walk Berlin\'s stories with a tip-based English tour.</p>',
      '<div class="bw-exit-actions">',
      '<a class="bw-exit-primary" href="' + BOOKING_URL + '" data-bw-exit-book>Book Free Spot</a>',
      '<button class="bw-exit-secondary" type="button" data-bw-exit-pdf>Get the Free First-Day Guide</button>',
      '</div>',
      '</section>',
      '<section class="bw-exit-step" data-bw-exit-step="2" aria-live="polite">',
      '<p class="bw-exit-kicker">Free Berlin First-Day Guide</p>',
      '<h2 class="bw-exit-title">Send the guide to your inbox.</h2>',
      '<p class="bw-exit-copy">Airport tickets, toilets, luggage, cash, Sunday rules, and a first walk that makes Berlin easier.</p>',
      '<form class="bw-exit-form" novalidate data-bw-exit-form>',
      '<div class="bw-exit-row">',
      '<input class="bw-exit-input" type="email" autocomplete="email" inputmode="email" placeholder="you@example.com" aria-label="Email address" required data-bw-exit-email>',
      '<button class="bw-exit-submit" type="submit" data-bw-exit-submit>Send PDF</button>',
      '</div>',
      '<p class="bw-exit-privacy">No spam. Unsubscribe anytime. You will receive BerlinWalk travel notes and tour updates.</p>',
      '<div class="bw-exit-status" role="status" data-bw-exit-status></div>',
      '</form>',
      '<button class="bw-exit-back" type="button" data-bw-exit-back>Back</button>',
      '</section>',
      '<section class="bw-exit-step" data-bw-exit-step="3" aria-live="polite">',
      '<div class="bw-exit-check" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg></div>',
      '<p class="bw-exit-kicker">Success</p>',
      '<h2 class="bw-exit-title">You are in.</h2>',
      '<p class="bw-exit-copy" data-bw-exit-success>Download the Berlin First-Day Survival Guide now.</p>',
      '<div class="bw-exit-actions"><a class="bw-exit-download" href="' + DOWNLOAD_URL + '" target="_blank" rel="noopener" data-bw-exit-download>Download Berlin First-Day Guide</a><button class="bw-exit-secondary" type="button" data-bw-exit-done>Done</button></div>',
      '</section>',
      '</div>',
      '</div>'
    ].join('');

    document.body.appendChild(overlay);
    bindPopupEvents(overlay);
    document.documentElement.classList.add('bw-exit-lock');
    document.body.classList.add('bw-exit-lock');
    window.requestAnimationFrame(function () {
      overlay.classList.add('bw-exit-visible');
      var closeButton = overlay.querySelector('[data-bw-exit-close]');
      if (closeButton) closeButton.focus();
    });
  }

  function bindPopupEvents(overlay) {
    var pdfButton = overlay.querySelector('[data-bw-exit-pdf]');
    var backButton = overlay.querySelector('[data-bw-exit-back]');
    var doneButton = overlay.querySelector('[data-bw-exit-done]');
    var closeButton = overlay.querySelector('[data-bw-exit-close]');
    var bookButton = overlay.querySelector('[data-bw-exit-book]');
    var form = overlay.querySelector('[data-bw-exit-form]');
    var input = overlay.querySelector('[data-bw-exit-email]');
    var submit = overlay.querySelector('[data-bw-exit-submit]');
    var status = overlay.querySelector('[data-bw-exit-status]');
    var success = overlay.querySelector('[data-bw-exit-success]');

    closeButton.addEventListener('click', function () {
      closePopup('x_button');
    });
    doneButton.addEventListener('click', function () {
      closePopup('done_button');
    });
    bookButton.addEventListener('click', function () {
      trackEvent('bw_exit_popup_book_click', { cta_url: BOOKING_URL });
      closePopup('book_click');
    });
    pdfButton.addEventListener('click', function () {
      trackEvent('bw_exit_popup_pdf_click');
      setStep(2);
    });
    backButton.addEventListener('click', function () {
      status.className = 'bw-exit-status';
      status.textContent = '';
      setStep(1);
    });
    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) closePopup('overlay_click');
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var email = input.value.trim();
      status.className = 'bw-exit-status';
      status.textContent = '';

      if (!validateEmail(email)) {
        trackEvent('bw_exit_popup_submit_error', { error_type: 'invalid_email' });
        status.textContent = 'Please enter a valid email address.';
        status.classList.add('bw-exit-error');
        input.focus();
        return;
      }

      submit.disabled = true;
      submit.textContent = 'Sending...';

      window.fetch(SUBSCRIBE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          source: 'exit-intent-survival-map',
          offer: 'berlin-survival-map',
          page: window.location.pathname
        })
      }).then(function (response) {
        return response.json().catch(function () {
          return {};
        }).then(function (data) {
          if (!response.ok || data.success === false) {
            throw new Error(data.error || 'subscribe_failed');
          }
          success.innerHTML = 'Saved for <strong>' + escapeHtml(email) + '</strong>. Download the Berlin First-Day Survival Guide now.';
          trackEvent('bw_exit_popup_submit_success');
          setStep(3);
        });
      }).catch(function (err) {
        var message = err && err.message === 'invalid_email'
          ? 'Please enter a valid email address.'
          : 'Something went wrong. Please try again.';
        trackEvent('bw_exit_popup_submit_error', { error_type: err && err.message ? err.message : 'network_or_unknown' });
        status.textContent = message;
        status.classList.add('bw-exit-error');
      }).then(function () {
        submit.disabled = false;
        submit.textContent = 'Send PDF';
      });
    });

    document.addEventListener('keydown', handleKeydown);
  }

  function showPopup() {
    if (!dwellReady || popupShown || !shouldRun() || document.getElementById(OVERLAY_ID)) return;

    popupShown = true;
    closeTracked = false;
    safeSessionSet(SESSION_KEY, String(Date.now()));
    renderPopup();
    trackEvent('bw_exit_popup_view', { trigger_type: isPreviewForced() ? 'preview' : 'exit_intent' });
  }

  function handleMouseLeave(event) {
    if (event.clientY <= 0 || event.clientY < 20) showPopup();
  }

  function handleMouseOut(event) {
    if (!event.relatedTarget && event.clientY < 20) showPopup();
  }

  function boot() {
    window.setTimeout(function () {
      dwellReady = true;
      if (isPreviewForced()) showPopup();
    }, DWELL_TIME_MS);

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseout', handleMouseOut);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
