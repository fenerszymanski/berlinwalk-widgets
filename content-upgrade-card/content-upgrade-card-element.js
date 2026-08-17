(function () {
  'use strict';

  var TAG = 'bw-content-upgrade-card';
  var DEFAULT_API_BASE = 'https://app.berlinwalk.com/api/download-lead';
  var DEFAULT_ASSET_ID = 'berlin-skip-list';
  var DEFAULT_ASSET_VERSION = '2026-08-v1';
  var DEFAULT_CONSENT_VERSION = 'berlin-skip-list-v1-2026-08-15';
  var DEFAULT_CONSENT_TEXT = 'By requesting this list, I agree to receive it by email plus occasional BerlinWalk emails about planning a Berlin trip. I can unsubscribe anytime. Privacy Policy.';
  var PRIVACY_URL = 'https://www.berlinwalk.com/privacy-policy';
  // Small shot of the real card, so the reader can see they are being sent a
  // designed thing rather than a generic attachment. Too small to read, on
  // purpose. Hidden automatically if a magnet has no preview yet.
  var PREVIEW_BASE = 'https://fenerszymanski.github.io/berlinwalk-widgets/content-upgrade-card/previews/';
  var DEFAULT_GATE_COPY = 'That is three of nine. Want all nine as a card you can keep on your phone while you walk? I will email it.';
  var DEFAULT_TEASERS = [
    {
      number: 1,
      title: 'Skip the ride up the TV Tower.',
      body: 'You queue for a timed slot, and the one view missing from the top is the tower itself. I would rather walk you along the Spree from Museum Island.'
    },
    {
      number: 2,
      title: 'Skip Checkpoint Charlie.',
      body: 'It is a rebuilt booth ringed by fast food and men in costume. The border that mattered is a short ride north at Bernauer Straße, where a preserved stretch of the death strip still stands.'
    },
    {
      number: 7,
      title: 'Skip the Reichstag dome if you have not registered.',
      body: 'It is free, but you cannot walk in and the slots go before you arrive. Register with the Bundestag visitor service well ahead, or spend the time on the lawn out front.'
    }
  ];

  if (!window.customElements || window.customElements.get(TAG)) return;

  function cleanText(value, max) {
    return String(value == null ? '' : value).replace(/\s+/g, ' ').trim().slice(0, max || 300);
  }

  function escapeHtml(value) {
    return cleanText(value, 2000)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
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

  function parseJsonAttribute(element, name, fallback) {
    try {
      var raw = element.getAttribute(name);
      var value = raw ? JSON.parse(raw) : fallback;
      return Array.isArray(value) ? value : fallback;
    } catch (err) {
      return fallback;
    }
  }

  function parseJsonObjectAttribute(element, name) {
    try {
      var raw = element.getAttribute(name);
      if (!raw) return null;
      var value = JSON.parse(raw);
      return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
    } catch (err) {
      return null;
    }
  }

  function calcRuleMatches(rule, answers) {
    return ['days', 'museums', 'transit'].every(function (key) {
      if (!(key in rule)) return true;
      var want = rule[key];
      return Array.isArray(want) ? want.indexOf(answers[key]) !== -1 : want === answers[key];
    });
  }

  function calcVerdictLines(config, answers) {
    var base = (config.base || []).filter(function (rule) { return calcRuleMatches(rule, answers); })[0];
    var lines = base ? [cleanText(base.line, 400)] : [];
    if (answers.transit === 'Yes') {
      (config.transitAddenda || []).forEach(function (rule) {
        if (calcRuleMatches(rule, answers)) lines.push(cleanText(rule.line, 400));
      });
    }
    return lines;
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
      this._calcDone = false;
      this._submitted = false;
      this._arrivalSaved = false;
      this._arrivalStartedAt = '';
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

    _copy() {
      var contents = parseJsonAttribute(this, 'content-items', [
        'TV Tower ride',
        'Checkpoint Charlie',
        'Several Museum Island museums'
      ]).map(function (item, index) {
        if (item && typeof item === 'object') {
          return {
            number: Number(item.number) || index + 1,
            label: cleanText(item.skip, 120)
          };
        }
        return { number: index + 1, label: cleanText(item, 120) };
      }).filter(function (item) { return item.label; }).slice(0, 9);
      var teasers = parseJsonAttribute(this, 'teaser-items', DEFAULT_TEASERS)
        .map(function (item, index) {
          if (!item || typeof item !== 'object') return null;
          return {
            number: Number(item.number) || index + 1,
            title: cleanText(item.title || item.skip, 180),
            body: cleanText(item.body || [item.why, item.instead].filter(Boolean).join(' '), 620)
          };
        })
        .filter(function (item) { return item && item.title && item.body; })
        .slice(0, 3);
      var arrivalOptions = parseJsonAttribute(this, 'arrival-options', []);
      return {
        barCopy: cleanText(this.getAttribute('bar-copy'), 100) || 'Free save-to-phone guide',
        eyebrow: cleanText(this.getAttribute('eyebrow'), 120) || 'Central Berlin, edited',
        title: cleanText(this.getAttribute('title'), 160) || 'The Berlin Skip List',
        description: cleanText(this.getAttribute('description'), 500) || 'Nine things I would skip in central Berlin, and what the hours buy you instead.',
        contents: contents,
        teasers: teasers.length ? teasers : DEFAULT_TEASERS,
        gateCopy: cleanText(this.getAttribute('gate-copy'), 300) || DEFAULT_GATE_COPY,
        submitLabel: cleanText(this.getAttribute('submit-label'), 100) || 'Email me the Skip List',
        consentVersion: cleanText(this.getAttribute('consent-version'), 160) || DEFAULT_CONSENT_VERSION,
        consentText: cleanText(this.getAttribute('consent-text'), 700) || DEFAULT_CONSENT_TEXT,
        successCopy: cleanText(this.getAttribute('success-copy'), 260) || 'Check your inbox to confirm your email and open The Berlin Skip List.',
        arrivalLabel: cleanText(this.getAttribute('arrival-label'), 160) || 'When are you planning to arrive?',
        arrivalOptions: arrivalOptions.map(function (item) {
          return {
            value: cleanText(item && item.value, 80),
            label: cleanText(item && item.label, 120)
          };
        }).filter(function (item) { return item.value && item.label; }).slice(0, 6)
      };
    }

    _calc() {
      var mode = cleanText(this.getAttribute('gate-mode'), 40);
      var config = parseJsonObjectAttribute(this, 'calc-config');
      var valid = mode === 'calculator' && config
        && Array.isArray(config.questions) && config.questions.length === 3
        && config.questions.every(function (q) {
          return q && q.id && q.prompt && Array.isArray(q.options) && q.options.length > 0;
        })
        && Array.isArray(config.base) && config.base.length > 0;
      return { active: !!valid, config: valid ? config : null };
    }

    _renderCalc(config) {
      var placeholder = cleanText(config.placeholder, 160) || 'Answer all three questions.';
      var stamp = cleanText(config.stamp, 120);
      var questions = config.questions.map(function (question, qIndex) {
        var options = question.options.map(function (option) {
          return '<button type="button" class="calc-opt" data-value="' + escapeHtml(option.value) + '" aria-pressed="false">' + escapeHtml(option.label) + '</button>';
        }).join('');
        var promptId = 'bw-calc-prompt-' + qIndex;
        return '<div class="calc-q" data-q="' + escapeHtml(question.id) + '">'
          + '<p class="calc-prompt" id="' + promptId + '">' + escapeHtml(question.prompt) + '</p>'
          + '<div class="calc-options" role="group" aria-labelledby="' + promptId + '">' + options + '</div>'
          + '</div>';
      }).join('');
      return '<div class="calc" aria-label="Mini pass calculator">'
        + questions
        + '<div class="calc-verdict" role="status" aria-live="polite"><p class="calc-verdict-text">' + escapeHtml(placeholder) + '</p></div>'
        + (stamp ? '<p class="calc-stamp">' + escapeHtml(stamp) + '</p>' : '')
        + '</div>';
    }

    _render() {
      var copy = this._copy();
      var calc = this._calc();
      var previewAssetId = cleanText(this.getAttribute('asset-id'), 120) || DEFAULT_ASSET_ID;
      var teasers = copy.teasers.map(function (item) {
        return '<article class="teaser"><p class="teaser-title"><span class="teaser-number">' + escapeHtml(item.number) + '</span><strong>' + escapeHtml(item.title) + '</strong></p><p class="teaser-body">' + escapeHtml(item.body) + '</p></article>';
      }).join('');
      var offerExtra = calc.active
        ? this._renderCalc(calc.config)
        : '<div class="teasers" aria-label="Three Skip List examples">' + teasers + '</div><p class="gate-copy">' + escapeHtml(copy.gateCopy) + '</p>';
      var arrival = copy.arrivalOptions.length
        ? '<div class="arrival-step">'
          + '<p class="arrival-prompt">On its way. While I have you, when are you coming?</p>'
          + '<label for="bw-content-upgrade-arrival">' + escapeHtml(copy.arrivalLabel) + '</label>'
          + '<select id="bw-content-upgrade-arrival" name="arrivalTiming" aria-describedby="bw-content-upgrade-arrival-status">'
          + '<option value="" selected>Choose one, or skip</option>'
          + copy.arrivalOptions.map(function (item) { return '<option value="' + escapeHtml(item.value) + '">' + escapeHtml(item.label) + '</option>'; }).join('')
          + '</select>'
          + '<div class="arrival-actions"><button class="arrival-save" type="button" disabled>Save planning window</button><button class="arrival-skip" type="button">Skip for now</button></div>'
          + '<p class="arrival-status" id="bw-content-upgrade-arrival-status" role="status" aria-live="polite"></p>'
          + '</div>'
        : '';
      var consent = escapeHtml(copy.consentText).replace(/Privacy Policy\.?$/, '<a href="' + PRIVACY_URL + '" target="_top">Privacy Policy</a>.');
      this._root.innerHTML = `
        <style>
          :host{box-sizing:border-box;contain:inline-size;display:block;margin:30px 0;max-width:100%;min-width:0;overflow:visible;color:#212121;font-family:Montserrat,Arial,sans-serif;white-space:normal}
          *{box-sizing:border-box}
          [hidden]{display:none!important}
          .card{background:transparent;border:0;border-left:3px solid #1b5e20;border-radius:0;box-shadow:none;max-width:100%;overflow:visible;padding-left:18px}
          .bar{align-items:center;color:#1b5e20;display:flex;gap:10px;padding:0 0 8px}
          .bar-icon{display:none}
          .bar-copy{color:#1b5e20;font-size:11px;font-weight:900;letter-spacing:.12em;line-height:1.2;text-transform:uppercase}
          .body{display:block;padding:0}
          .offer{min-width:0}
          .eyebrow{color:#1b5e20;font-size:11px;font-weight:900;letter-spacing:.08em;margin:0 0 5px;text-transform:uppercase}
          h2{color:#172319;font-size:22px;font-weight:900;letter-spacing:-.02em;line-height:1.12;margin:0}
          .description{color:#48564a;font-size:13px;line-height:1.55;margin:8px 0 0}
          .teasers{margin:18px 0 0;max-width:700px}
          .teaser{border-top:1px solid #dbe7d6;padding:12px 0 0}
          .teaser:first-child{border-top:0;padding-top:0}
          .teaser-title{color:#172319;font-size:14px;line-height:1.35;margin:0}
          .teaser-title strong{font-weight:900}
          .teaser-number{color:#1b5e20;display:inline-block;font-weight:900;margin-right:7px;min-width:16px}
          .teaser-body{color:#435346;font-size:13px;line-height:1.55;margin:4px 0 0}
          .gate-copy{color:#172319;font-size:14px;font-weight:800;line-height:1.5;margin:17px 0 14px;max-width:680px}
          .calc{margin:16px 0 2px;max-width:520px}
          .calc-q{margin:0 0 13px}
          .calc-prompt{color:#172319;font-size:13.5px;font-weight:800;line-height:1.4;margin:0 0 7px}
          .calc-options{display:flex;flex-wrap:wrap;gap:7px}
          .calc-opt{appearance:none;background:#fff;border:1.5px solid #9fbb98;border-radius:999px;color:#172319;cursor:pointer;display:inline-flex;font:700 13px/1 Montserrat,Arial,sans-serif;min-height:38px;padding:0 15px;width:auto}
          .calc-opt:hover{border-color:#1b5e20}
          .calc-opt:focus-visible{outline:3px solid rgba(255,230,0,.9);outline-offset:1px}
          .calc-opt[aria-pressed="true"]{background:#1b5e20;border-color:#1b5e20;color:#fff!important}
          .calc-verdict{background:#fffbe0;border-left:3px solid #ffe600;border-radius:0 8px 8px 0;margin:14px 0 8px;padding:11px 13px}
          .calc-verdict-text{color:#123d18!important;font-size:13.5px;font-weight:700;line-height:1.5;margin:0}
          .calc-stamp{color:#748076;font-size:10.5px;font-weight:600;margin:0 0 2px}
          form{display:flex;flex-direction:column;gap:9px;max-width:430px;min-width:0}
          label{color:#243127;font-size:12px;font-weight:900;line-height:1.3}
          input[type="email"],select{appearance:none;background:#fff;border:1.5px solid #9fbb98;border-radius:9px;color:#172319;font:600 16px/1.2 Montserrat,Arial,sans-serif;min-height:46px;min-width:0;padding:0 12px;width:100%}
          input[type="email"]::placeholder{color:#748076;font-weight:500}
          input[type="email"]:focus-visible,select:focus-visible{border-color:#123d18;outline:3px solid rgba(255,230,0,.9);outline-offset:1px}
          .disclosure{color:#536055;font-size:10.5px;line-height:1.45;margin:0}
          .disclosure a{color:#123d18;font-weight:800;text-decoration:underline;text-underline-offset:2px}
          .disclosure a:focus-visible{outline:3px solid #ffe600;outline-offset:2px}
          button{align-items:center;appearance:none;background:#ffe600;border:0;border-radius:999px;color:#123d18!important;cursor:pointer;display:flex;font:900 14px/1 Montserrat,Arial,sans-serif;justify-content:center;min-height:46px;padding:0 17px;width:100%}
          button:hover,button:active,button:visited{background:#ffe600;color:#123d18!important}
          button:focus-visible{color:#123d18!important;outline:3px solid #123d18;outline-offset:2px}
          button[disabled]{cursor:wait;opacity:.72}
          .status{color:#8b2525;font-size:12px;font-weight:700;line-height:1.4;margin:0;min-height:0}
          .success{align-items:flex-start;display:none;flex-direction:column;gap:5px;justify-content:center;max-width:560px;padding:4px 0 0}
          .success[aria-hidden="false"]{display:flex}
          .success strong{color:#123d18;font-size:17px;line-height:1.2}
          .preview{border:1px solid #dbe7d6;border-radius:7px;box-shadow:0 3px 10px rgba(18,61,24,.14);float:right;height:auto;margin:2px 0 10px 16px;max-width:38%;width:124px}
          .success p{color:#435346;font-size:12.5px;line-height:1.5;margin:0}
          .success .spam-note{background:#fffbe0;border-left:3px solid #ffe600;border-radius:0 6px 6px 0;color:#123d18!important;font-weight:700;margin:7px 0 0!important;padding:9px 11px}
          .arrival-step{border-top:1px solid #dbe7d6;margin-top:12px;padding-top:13px;width:min(100%,430px)}
          .arrival-prompt{color:#172319!important;font-size:14px!important;font-weight:800;line-height:1.45!important;margin-bottom:10px!important}
          .arrival-actions{align-items:center;display:flex;gap:10px;margin-top:9px}
          .arrival-actions button{width:auto}
          .arrival-save{padding-inline:16px}
          .arrival-skip{background:transparent;border:1px solid #9fbb98;color:#123d18!important;font-size:12px;min-height:40px;padding-inline:13px}
          .arrival-skip:hover,.arrival-skip:active,.arrival-skip:visited{background:#f2f7ef;color:#123d18!important}
          .arrival-status{color:#1b5e20!important;font-size:11.5px!important;font-weight:800;min-height:0}
          .honeypot{height:1px;left:-10000px;overflow:hidden;position:absolute;top:auto;width:1px}
          @media(max-width:720px){:host{margin:24px 0}.card{padding-left:14px}.bar{padding-bottom:7px}h2{font-size:20px}.teasers{margin-top:15px}.teaser-body{font-size:12.5px}.gate-copy{font-size:13.5px}.calc-opt{font-size:12.5px;min-height:36px;padding:0 12px}.arrival-actions{align-items:stretch;flex-direction:column}.arrival-actions button{width:100%}.preview{margin-left:12px;width:86px}}
          @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;scroll-behavior:auto!important;transition:none!important}}
        </style>
        <section class="card" role="region" aria-labelledby="bw-content-upgrade-title">
          <div class="bar"><span class="bar-icon" aria-hidden="true">✂</span><span class="bar-copy">${escapeHtml(copy.barCopy)}</span></div>
          <div class="body">
            <div class="offer">
              <img class="preview" alt="" aria-hidden="true" decoding="async" width="124" height="220"
                src="${escapeHtml(PREVIEW_BASE + previewAssetId + '.png')}"
                onerror="this.remove()">
              <p class="eyebrow">${escapeHtml(copy.eyebrow)}</p>
              <h2 id="bw-content-upgrade-title">${escapeHtml(copy.title)}</h2>
              <p class="description">${escapeHtml(copy.description)}</p>
              ${offerExtra}
            </div>
            <form novalidate>
              <label for="bw-content-upgrade-email">Where should I send it?</label>
              <input id="bw-content-upgrade-email" name="email" type="email" inputmode="email" autocomplete="email" autocapitalize="none" spellcheck="false" placeholder="you@example.com" required aria-describedby="bw-content-upgrade-disclosure bw-content-upgrade-status">
              <div class="honeypot" hidden aria-hidden="true"><label>Website<input name="website" type="text" tabindex="-1" autocomplete="off"></label></div>
              <p class="disclosure" id="bw-content-upgrade-disclosure">${consent}</p>
              <button type="submit">${escapeHtml(copy.submitLabel)}</button>
              <p class="status" id="bw-content-upgrade-status" role="status" aria-live="polite"></p>
            </form>
            <div class="success" aria-hidden="true" role="status" aria-live="polite">
              <strong>Check your inbox.</strong>
              <p>${escapeHtml(copy.successCopy)}</p>
              <p class="spam-note">Not there in a minute? Look in spam or junk. I send from a new address, so the first email often lands there. Drag it into your inbox and the rest will arrive properly.</p>
              ${arrival}
            </div>
          </div>
        </section>`;
    }

    _bindCalc(config) {
      var self = this;
      var root = this._root.querySelector('.calc');
      if (!root) return;
      var verdictText = root.querySelector('.calc-verdict-text');
      var placeholder = verdictText.textContent;
      var questionIds = config.questions.map(function (question) { return question.id; });
      var answers = {};
      function recompute() {
        var complete = questionIds.every(function (id) { return answers[id]; });
        if (!complete) {
          verdictText.textContent = placeholder;
          return;
        }
        verdictText.textContent = calcVerdictLines(config, answers).join(' ');
        if (!self._calcDone) {
          self._calcDone = true;
          dispatch(self, 'bw-content-upgrade-calc-done');
        }
      }
      root.querySelectorAll('.calc-q').forEach(function (block) {
        var qId = block.getAttribute('data-q');
        block.querySelectorAll('.calc-opt').forEach(function (btn) {
          btn.addEventListener('click', function () {
            block.querySelectorAll('.calc-opt').forEach(function (b) {
              b.setAttribute('aria-pressed', String(b === btn));
            });
            answers[qId] = btn.getAttribute('data-value');
            recompute();
          });
        });
      });
    }

    _bind() {
      var self = this;
      var copy = this._copy();
      var calc = this._calc();
      if (calc.active) this._bindCalc(calc.config);
      var form = this._root.querySelector('form');
      var email = this._root.querySelector('input[name="email"]');
      var arrival = this._root.querySelector('select[name="arrivalTiming"]');
      var arrivalSave = this._root.querySelector('.arrival-save');
      var arrivalSkip = this._root.querySelector('.arrival-skip');
      var arrivalStatus = this._root.querySelector('.arrival-status');
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
      if (arrival) arrival.addEventListener('change', function () {
        self._arrivalStartedAt = new Date().toISOString();
        if (arrivalSave) arrivalSave.disabled = !arrival.value;
      });
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
        button.textContent = 'Sending...';
        dispatch(self, 'bw-content-upgrade-submit');

        fetch(self._submitUrl(), {
          method: 'POST',
          credentials: 'include',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(self._submissionPayload(form, email.value, copy))
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
          button.textContent = copy.submitLabel;
          status.textContent = 'Something went wrong. Please try again.';
        });
      });

      if (arrivalSave && arrival) arrivalSave.addEventListener('click', function () {
        if (self._arrivalSaved || !arrival.value) return;
        arrivalSave.disabled = true;
        arrivalSave.textContent = 'Saving...';
        if (arrivalStatus) arrivalStatus.textContent = '';
        fetch(self._submitUrl(), {
          method: 'POST',
          credentials: 'include',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(self._submissionPayload(form, email.value, copy, {
            arrivalTiming: arrival.value,
            arrivalOnly: true,
            startedAt: self._arrivalStartedAt || new Date().toISOString()
          }))
        }).then(function (response) {
          if (!response.ok) throw new Error('arrival_update_failed');
          self._arrivalSaved = true;
          arrival.disabled = true;
          arrivalSave.hidden = true;
          if (arrivalSkip) arrivalSkip.hidden = true;
          if (arrivalStatus) arrivalStatus.textContent = 'Saved. I will use that window to keep future planning tips relevant.';
        }).catch(function () {
          arrivalSave.disabled = false;
          arrivalSave.textContent = 'Save planning window';
          if (arrivalStatus) arrivalStatus.textContent = 'Could not save that window. You can skip it for now.';
        });
      });

      if (arrivalSkip && arrival) arrivalSkip.addEventListener('click', function () {
        arrival.disabled = true;
        if (arrivalSave) arrivalSave.hidden = true;
        arrivalSkip.hidden = true;
        if (arrivalStatus) arrivalStatus.textContent = 'No problem. The list is on its way.';
      });
    }

    _submitUrl() {
      var base = cleanText(this.getAttribute('api-base'), 800) || DEFAULT_API_BASE;
      var url = new URL(base, window.location.href);
      if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new Error('invalid_api_base');
      url.searchParams.set('action', 'submit');
      return url.toString();
    }

    _submissionPayload(form, email, copy, overrides) {
      var payload = {
        email: cleanText(email, 320).toLowerCase(),
        arrivalTiming: cleanText((form.querySelector('[name="arrivalTiming"]') || {}).value, 80),
        consent: true,
        consentVersion: copy.consentVersion,
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
        screenWidth: Number(window.innerWidth || 0),
        screenHeight: Number(window.innerHeight || 0),
        qa: boolAttribute(this, 'qa'),
        utm: utmData(),
        website: cleanText(form.querySelector('[name="website"]').value, 300),
        startedAt: this._startedAt,
        submittedAt: new Date().toISOString()
      };
      Object.keys(overrides || {}).forEach(function (key) {
        payload[key] = overrides[key];
      });
      return payload;
    }
  }

  ContentUpgradeCard.CONSENT_VERSION = DEFAULT_CONSENT_VERSION;
  ContentUpgradeCard.CONSENT_TEXT = DEFAULT_CONSENT_TEXT;
  window.customElements.define(TAG, ContentUpgradeCard);
})();
