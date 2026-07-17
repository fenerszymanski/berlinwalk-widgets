(function () {
  'use strict';

  var TAG = 'bw-content-upgrade-card';
  var DEFAULT_API_BASE = 'https://app.berlinwalk.com/api/download-lead';
  var DEFAULT_ASSET_ID = 'berlin-transport-ticket-pocket-card';
  var DEFAULT_ASSET_VERSION = '2026-07-v1';
  var CONSENT_VERSION = 'transport-ticket-pocket-card-bundled-v1-2026-07-18';
  var CONSENT_TEXT = 'By requesting this card, I agree to receive the Berlin Transport Ticket Pocket Card and occasional BerlinWalk emails about Berlin travel tips, new guides, products and walking tours. I can unsubscribe at any time. Read the Privacy Policy.';
  var PRIVACY_URL = 'https://www.berlinwalk.com/privacy-policy';

  if (!window.customElements || window.customElements.get(TAG)) return;

  function cleanText(value, max) {
    return String(value == null ? '' : value).replace(/\s+/g, ' ').trim().slice(0, max || 300);
  }

  function cleanUrl(value) {
    try {
      var url = new URL(String(value || ''), window.location.href);
      if (url.protocol !== 'https:' && url.protocol !== 'http:') return '';
      return url.origin + url.pathname;
    } catch (err) {
      return '';
    }
  }

  function sourceSlug(element) {
    var explicit = cleanText(element.getAttribute('source-slug'), 180);
    if (explicit) return explicit;
    var parts = String(window.location.pathname || '').replace(/\/+$/, '').split('/');
    try { return decodeURIComponent(parts[parts.length - 1] || ''); }
    catch (err) { return parts[parts.length - 1] || ''; }
  }

  function utmData() {
    var params = new URLSearchParams(window.location.search || '');
    function get(name) {
      var value = cleanText(params.get(name), 180);
      return /@|%40/i.test(value) ? '' : value;
    }
    return {
      source: get('utm_source'),
      medium: get('utm_medium'),
      campaign: get('utm_campaign'),
      content: get('utm_content'),
      term: get('utm_term'),
      id: get('utm_id')
    };
  }

  function analyticsAllowed() {
    try {
      var manager = window.consentPolicyManager;
      var current = manager && typeof manager.getCurrentConsentPolicy === 'function'
        ? manager.getCurrentConsentPolicy()
        : null;
      current = current && (current.policy || current);
      if (current && Object.keys(current).length) {
        return current.analytics === true || current.anl === true || current.anl === 1;
      }
    } catch (err) {}
    try {
      var match = document.cookie.match(/(?:^|;\s*)consent-policy=([^;]+)/);
      var policy = match ? JSON.parse(decodeURIComponent(match[1])) : {};
      return policy.analytics === true || policy.anl === true || policy.anl === 1;
    } catch (err) {
      return false;
    }
  }

  function boolAttribute(element, name) {
    return element.getAttribute(name) === 'true' || element.hasAttribute(name) && element.getAttribute(name) !== 'false';
  }

  function dispatch(element, name, detail) {
    element.dispatchEvent(new CustomEvent(name, {
      bubbles: true,
      composed: true,
      detail: detail || {}
    }));
  }

  class ContentUpgradeCard extends HTMLElement {
    constructor() {
      super();
      this._startedAt = new Date().toISOString();
      this._formStarted = false;
      this._submitted = false;
      this._root = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
      if (this.getAttribute('data-bw-content-upgrade-ready') === 'true') return;
      try {
        this._render();
        this._bind();
        this.setAttribute('data-bw-content-upgrade-ready', 'true');
      } catch (error) {
        this.setAttribute('data-bw-content-upgrade-ready', 'error');
        dispatch(this, 'bw-content-upgrade-error', { code: 'render_failed' });
      }
    }

    _render() {
      this._root.innerHTML = `
        <style>
          :host{box-sizing:border-box;contain:inline-size;display:block;margin:30px 0;max-width:100%;min-width:0;overflow:visible;color:#212121;font-family:Montserrat,Arial,sans-serif;white-space:normal}
          *{box-sizing:border-box}
          [hidden]{display:none!important}
          .card{background:#fff;border:1px solid #bed4b7;border-radius:16px;box-shadow:0 16px 34px rgba(18,61,24,.16);max-width:100%;overflow:visible}
          .bar{align-items:center;background:#123d18;border-radius:15px 15px 0 0;color:#fff;display:flex;gap:10px;padding:10px 16px}
          .bar-icon{font-size:21px;line-height:1}
          .bar-copy{color:#ffe600;font-size:11px;font-weight:900;letter-spacing:.12em;line-height:1.2;text-transform:uppercase}
          .body{display:grid;gap:16px;grid-template-columns:minmax(0,1fr) minmax(250px,.9fr);padding:18px}
          .offer{min-width:0}
          .eyebrow{color:#1b5e20;font-size:11px;font-weight:900;letter-spacing:.08em;margin:0 0 5px;text-transform:uppercase}
          h2{color:#172319;font-size:22px;font-weight:900;letter-spacing:-.02em;line-height:1.12;margin:0}
          .description{color:#48564a;font-size:13px;line-height:1.55;margin:8px 0 0}
          .contents{display:flex;flex-wrap:wrap;gap:7px;margin:12px 0 0;padding:0}
          .contents li{background:#f2f7ef;border:1px solid #d5e4cf;border-radius:999px;color:#24472a;font-size:11px;font-weight:800;line-height:1.25;list-style:none;padding:6px 9px}
          form{background:#f8faf6;border:1px solid #dbe7d6;border-radius:12px;display:flex;flex-direction:column;gap:9px;min-width:0;padding:13px}
          label{color:#243127;font-size:12px;font-weight:900;line-height:1.3}
          input[type="email"]{appearance:none;background:#fff;border:1.5px solid #9fbb98;border-radius:9px;color:#172319;font:600 16px/1.2 Montserrat,Arial,sans-serif;min-height:46px;min-width:0;padding:0 12px;width:100%}
          input[type="email"]::placeholder{color:#748076;font-weight:500}
          input[type="email"]:focus-visible{border-color:#123d18;outline:3px solid rgba(255,230,0,.9);outline-offset:1px}
          .disclosure{color:#536055;font-size:10.5px;line-height:1.45;margin:0}
          .disclosure a{color:#123d18;font-weight:800;text-decoration:underline;text-underline-offset:2px}
          .disclosure a:focus-visible{outline:3px solid #ffe600;outline-offset:2px}
          button{align-items:center;appearance:none;background:#ffe600;border:0;border-radius:999px;color:#123d18!important;cursor:pointer;display:flex;font:900 14px/1 Montserrat,Arial,sans-serif;justify-content:center;min-height:46px;padding:0 17px;width:100%}
          button:hover,button:active,button:visited{background:#ffe600;color:#123d18!important}
          button:focus-visible{color:#123d18!important;outline:3px solid #123d18;outline-offset:2px}
          button[disabled]{cursor:wait;opacity:.72}
          .status{color:#8b2525;font-size:12px;font-weight:700;line-height:1.4;margin:0;min-height:0}
          .success{align-items:flex-start;background:#f2f7ef;border:1px solid #bed4b7;border-radius:12px;display:none;flex-direction:column;gap:5px;justify-content:center;min-height:100%;padding:16px}
          .success[aria-hidden="false"]{display:flex}
          .success strong{color:#123d18;font-size:17px;line-height:1.2}
          .success p{color:#435346;font-size:12.5px;line-height:1.5;margin:0}
          .honeypot{height:1px;left:-10000px;overflow:hidden;position:absolute;top:auto;width:1px}
          @media(max-width:720px){:host{margin:24px 0}.body{grid-template-columns:1fr;padding:15px}.bar{padding:9px 14px}h2{font-size:20px}.contents{margin-top:10px}form{padding:12px}}
          @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;scroll-behavior:auto!important;transition:none!important}}
        </style>
        <section class="card" role="region" aria-labelledby="bw-content-upgrade-title">
          <div class="bar"><span class="bar-icon" aria-hidden="true">🎟️</span><span class="bar-copy">Free pocket card</span></div>
          <div class="body">
            <div class="offer">
              <p class="eyebrow">Berlin transport, simplified</p>
              <h2 id="bw-content-upgrade-title">Berlin Transport Ticket Pocket Card</h2>
              <p class="description">Keep Berlin&rsquo;s AB/ABC zones, validation rules and the ticket mistakes that lead to fines on one phone-sized card.</p>
              <ul class="contents" aria-label="Included on the card">
                <li>AB or ABC?</li><li>Validate or activate?</li><li>Four costly mistakes</li>
              </ul>
            </div>
            <form novalidate>
              <label for="bw-content-upgrade-email">Where should I send it?</label>
              <input id="bw-content-upgrade-email" name="email" type="email" inputmode="email" autocomplete="email" autocapitalize="none" spellcheck="false" placeholder="you@example.com" required aria-describedby="bw-content-upgrade-disclosure bw-content-upgrade-status">
              <div class="honeypot" hidden aria-hidden="true"><label>Website<input name="website" type="text" tabindex="-1" autocomplete="off"></label></div>
              <p class="disclosure" id="bw-content-upgrade-disclosure">By requesting this card, I agree to receive the Berlin Transport Ticket Pocket Card and occasional BerlinWalk emails about Berlin travel tips, new guides, products and walking tours. I can unsubscribe at any time. <a href="${PRIVACY_URL}" target="_top">Read the Privacy Policy.</a></p>
              <button type="submit">Email me the ticket card</button>
              <p class="status" id="bw-content-upgrade-status" role="status" aria-live="polite"></p>
            </form>
            <div class="success" aria-hidden="true" role="status" aria-live="polite">
              <strong>Check your inbox.</strong>
              <p>Confirm your email to open the ticket card.</p>
            </div>
          </div>
        </section>`;
    }

    _bind() {
      var self = this;
      var form = this._root.querySelector('form');
      var email = this._root.querySelector('input[name="email"]');
      var button = this._root.querySelector('button[type="submit"]');
      var status = this._root.querySelector('.status');
      var success = this._root.querySelector('.success');

      function markStarted() {
        if (self._formStarted) return;
        self._formStarted = true;
        dispatch(self, 'bw-content-upgrade-form-start');
      }

      email.addEventListener('focus', markStarted, { once: true });
      email.addEventListener('input', markStarted, { once: true });
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (self._submitted) return;
        status.textContent = '';
        if (!email.validity.valid) {
          status.textContent = 'Enter a valid email address.';
          email.focus();
          return;
        }
        self._submitted = true;
        form.setAttribute('aria-busy', 'true');
        button.disabled = true;
        button.textContent = 'Sending…';
        dispatch(self, 'bw-content-upgrade-submit');

        fetch(self._submitUrl(), {
          method: 'POST',
          credentials: 'include',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(self._submissionPayload(form, email.value))
        }).then(function (response) {
          if (!response.ok) throw new Error('submit_failed');
          form.hidden = true;
          form.setAttribute('aria-busy', 'false');
          success.setAttribute('aria-hidden', 'false');
          dispatch(self, 'bw-content-upgrade-success');
        }).catch(function () {
          self._submitted = false;
          form.setAttribute('aria-busy', 'false');
          button.disabled = false;
          button.textContent = 'Email me the ticket card';
          status.textContent = 'Something went wrong. Please try again.';
        });
      });
    }

    _submitUrl() {
      var base = cleanText(this.getAttribute('api-base'), 800) || DEFAULT_API_BASE;
      var url = new URL(base, window.location.href);
      if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new Error('invalid_api_base');
      url.searchParams.set('action', 'submit');
      return url.toString();
    }

    _submissionPayload(form, email) {
      return {
        email: cleanText(email, 320).toLowerCase(),
        consent: true,
        consentVersion: CONSENT_VERSION,
        assetId: cleanText(this.getAttribute('asset-id'), 120) || DEFAULT_ASSET_ID,
        assetVersion: cleanText(this.getAttribute('asset-version'), 80) || DEFAULT_ASSET_VERSION,
        sourceSlug: sourceSlug(this),
        sourceUrl: cleanUrl(this.getAttribute('source-url') || window.location.href),
        experiment: cleanText(this.getAttribute('experiment'), 120),
        variant: cleanText(this.getAttribute('variant'), 80) || 'variant',
        acquisitionCohort: cleanText(this.getAttribute('acquisition-cohort'), 100),
        placement: cleanText(this.getAttribute('placement'), 100),
        assignmentId: analyticsAllowed() ? cleanText(this.getAttribute('assignment-id'), 100) : '',
        analyticsConsentAtSubmit: analyticsAllowed(),
        qa: boolAttribute(this, 'qa'),
        utm: utmData(),
        website: cleanText(form.querySelector('[name="website"]').value, 300),
        startedAt: this._startedAt,
        submittedAt: new Date().toISOString()
      };
    }
  }

  ContentUpgradeCard.CONSENT_VERSION = CONSENT_VERSION;
  ContentUpgradeCard.CONSENT_TEXT = CONSENT_TEXT;
  window.customElements.define(TAG, ContentUpgradeCard);
})();
