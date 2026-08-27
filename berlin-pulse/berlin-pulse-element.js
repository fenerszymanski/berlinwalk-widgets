(function () {
  const SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : '';
  const BASE_URL = SCRIPT_URL && SCRIPT_URL.includes('/berlin-pulse/')
    ? SCRIPT_URL.replace(/berlin-pulse\/berlin-pulse-element\.js(?:\?.*)?$/, '')
    : 'https://fenerszymanski.github.io/berlinwalk-widgets/';
  const BUILD = 'berlin-pulse-20260708a';
  const DATA_URL = new URL('berlin-pulse/data/daily-pulses.json', BASE_URL).toString();
  const TRACKING_ENDPOINT_PROD = 'https://berlinwalk-content-app.vercel.app/api/tp-event';
  const TRACKING_ENDPOINT_LOCAL = 'http://127.0.0.1:5173/api/tp-event';
  const BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based?utm_source=game&utm_medium=berlin_pulse&utm_campaign=berlinwalk_games&utm_content=book_tour';
  const STORAGE_PREFIX = 'bw_berlin_pulse_';

  const FALLBACK_DATA = {
    version: BUILD,
    timezone: 'Europe/Berlin',
    prompts: [
      {
        id: 'fallback-city-mood',
        title: 'Where does Berlin pull you today?',
        situation: 'The city looks easy from a hotel lobby. Then the U-Bahn heat, the Spree breeze and one sudden cloud make the decision for you.',
        guideNote: 'My practical move: choose one area and leave yourself a way out if the weather turns.',
        options: [
          { id: 'outside', label: 'Stay outside', short: 'Open air wins', advice: 'Use parks, canals and open squares before the light gets too flat.' },
          { id: 'museum', label: 'Museum shelter', short: 'Go indoors', advice: 'Pick one museum cluster, not three scattered stops.' },
          { id: 'kiosk', label: 'Kiosk pause', short: 'Reset small', advice: 'A cold drink and ten quiet minutes can save the next two hours.' },
          { id: 'water', label: 'Find water shade', short: 'Follow the breeze', advice: 'The Spree, Landwehrkanal or a shady bridge will usually beat a random square.' }
        ]
      }
    ]
  };

  function asset(path) {
    const url = new URL(path, BASE_URL);
    url.searchParams.set('v', BUILD);
    return url.toString();
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function escapeAttr(value) {
    return escapeHtml(value);
  }

  function readJson(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {}
  }

  function sessionRead(key) {
    try { return window.sessionStorage.getItem(key) || ''; } catch (error) { return ''; }
  }

  function sessionWrite(key, value) {
    try { window.sessionStorage.setItem(key, value); } catch (error) {}
  }

  function randomId(prefix) {
    const part = Math.random().toString(36).slice(2, 10);
    return `${prefix}_${Date.now().toString(36)}_${part}`;
  }

  function storageId(key, prefix) {
    let value = readJson(key, '');
    if (!value) {
      value = randomId(prefix);
      writeJson(key, value);
    }
    return value;
  }

  function sessionId() {
    const key = `${STORAGE_PREFIX}session_id`;
    let value = sessionRead(key);
    if (!value) {
      value = randomId('pulse_session');
      sessionWrite(key, value);
    }
    return value;
  }

  function visitorId() {
    return storageId(`${STORAGE_PREFIX}visitor_id`, 'pulse_visitor');
  }

  function landingPage() {
    const key = `${STORAGE_PREFIX}landing_page`;
    let value = sessionRead(key);
    if (!value) {
      value = window.location.href;
      sessionWrite(key, value);
    }
    return value;
  }

  function berlinParts(date) {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Berlin',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23'
    }).formatToParts(date || new Date());
    const out = {};
    parts.forEach((part) => {
      if (part.type !== 'literal') out[part.type] = part.value;
    });
    return out;
  }

  function berlinDayKey(date) {
    const p = berlinParts(date || new Date());
    return `${p.year}-${p.month}-${p.day}`;
  }

  function berlinDateLabel(date) {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Berlin',
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date || new Date());
  }

  function berlinOffsetMs(date) {
    const p = berlinParts(date);
    const asUtc = Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day), Number(p.hour), Number(p.minute), Number(p.second));
    return asUtc - date.getTime();
  }

  function nextBerlinMidnightMs() {
    const now = new Date();
    const p = berlinParts(now);
    const localMidnightUtc = Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day) + 1, 0, 0, 0);
    let guess = localMidnightUtc - berlinOffsetMs(now);
    for (let i = 0; i < 3; i += 1) {
      guess = localMidnightUtc - berlinOffsetMs(new Date(guess));
    }
    return guess;
  }

  function countdownText() {
    const diff = Math.max(0, nextBerlinMidnightMs() - Date.now());
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    if (hours <= 0) return `${minutes}m`;
    return `${hours}h ${String(minutes).padStart(2, '0')}m`;
  }

  function hashString(value) {
    let hash = 2166136261;
    const text = String(value || '');
    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function shiftedDayKey(dayKey, delta) {
    const parts = String(dayKey).split('-').map(Number);
    const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2] + delta, 12, 0, 0));
    return date.toISOString().slice(0, 10);
  }

  function pickDaily(data, now) {
    const dayKey = berlinDayKey(now);
    const prompts = Array.isArray(data.prompts) && data.prompts.length ? data.prompts : FALLBACK_DATA.prompts;
    const prompt = prompts[hashString(`${dayKey}:prompt`) % prompts.length];
    const options = Array.isArray(prompt.options) && prompt.options.length ? prompt.options : FALLBACK_DATA.prompts[0].options;
    const actual = options[hashString(`${dayKey}:${prompt.id}:actual`) % options.length];
    const percentActual = 39 + (hashString(`${dayKey}:${prompt.id}:percent`) % 43);
    return { dayKey, prompt, options, actual, percentActual };
  }

  class BWBerlinPulseElement extends HTMLElement {
    constructor() {
      super();
      this._data = FALLBACK_DATA;
      this._daily = pickDaily(FALLBACK_DATA, new Date());
      this._step = 'loading';
      this._selectedId = '';
      this._percentGuess = 55;
      this._result = null;
      this._viewTracked = false;
      this._countdownTimer = null;
    }

    connectedCallback() {
      this._render();
      this._load().then(() => {
        this._step = this._readPlayed() ? 'result' : 'intro';
        this._result = this._readPlayed();
        this._render();
        this._trackOnce();
      });
    }

    disconnectedCallback() {
      if (this._countdownTimer) window.clearInterval(this._countdownTimer);
    }

    async _load() {
      try {
        const response = await fetch(DATA_URL, { cache: 'no-cache' });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data.prompts) && data.prompts.length) this._data = data;
        }
      } catch (error) {}
      this._daily = pickDaily(this._data, new Date());
    }

    _readPlayed() {
      const saved = readJson(`${STORAGE_PREFIX}daily_${this._daily.dayKey}`, null);
      if (saved && saved.dayKey === this._daily.dayKey && saved.questionId === this._daily.prompt.id) return saved;
      return null;
    }

    _trackOnce() {
      if (this._viewTracked) return;
      this._viewTracked = true;
      this._track('bw_pulse_page_view', { action: 'page_view', title: 'Berlin Pulse' });
    }

    _start() {
      this._step = 'play';
      this._selectedId = '';
      this._percentGuess = 55;
      this._track('bw_pulse_start', { action: 'start' });
      this._render();
    }

    _select(optionId) {
      this._selectedId = optionId;
      const seeded = 42 + (hashString(`${this._daily.dayKey}:${optionId}:guess`) % 28);
      this._percentGuess = seeded;
      this._step = 'predict';
      this._track('bw_pulse_pick', {
        action: 'select',
        pick: optionId,
        prediction: this._option(optionId)?.label || optionId,
        percentGuess: String(this._percentGuess)
      });
      this._render();
    }

    _lock() {
      const option = this._option(this._selectedId);
      if (!option) return;
      const callCorrect = option.id === this._daily.actual.id;
      const streakState = readJson(`${STORAGE_PREFIX}streak`, { lastDayKey: '', streak: 0, lastCorrect: false });
      const yesterday = shiftedDayKey(this._daily.dayKey, -1);
      const base = streakState.lastDayKey === yesterday && streakState.lastCorrect ? Number(streakState.streak || 0) : 0;
      const streak = callCorrect ? base + 1 : 0;
      const title = callCorrect ? (streak > 1 ? 'Streak Keeper' : 'City Reader') : 'Berlin Surprise';
      const result = {
        dayKey: this._daily.dayKey,
        questionId: this._daily.prompt.id,
        pick: option.id,
        prediction: option.label,
        actualId: this._daily.actual.id,
        actualLabel: this._daily.actual.label,
        percentGuess: String(this._percentGuess),
        percentActual: String(this._daily.percentActual),
        callCorrect,
        streak,
        title,
        savedAt: new Date().toISOString()
      };
      writeJson(`${STORAGE_PREFIX}daily_${this._daily.dayKey}`, result);
      writeJson(`${STORAGE_PREFIX}streak`, {
        lastDayKey: this._daily.dayKey,
        streak,
        lastCorrect: callCorrect
      });
      this._result = result;
      this._step = 'result';
      this._track('bw_pulse_complete', result);
      this._render();
    }

    _option(optionId) {
      return this._daily.options.find((option) => option.id === optionId) || null;
    }

    async _share() {
      const result = this._result || this._readPlayed();
      const text = result
        ? `I played Berlin Pulse: ${result.title}. Today Berlin's call was ${result.actualLabel}.`
        : 'I played Berlin Pulse by BerlinWalk.';
      const url = 'https://www.berlinwalk.com/games/berlin-pulse';
      let method = 'copy';
      let success = false;
      try {
        if (navigator.share) {
          method = 'native_share';
          await navigator.share({ title: 'Berlin Pulse', text, url });
          success = true;
        } else if (navigator.clipboard) {
          await navigator.clipboard.writeText(`${text} ${url}`);
          success = true;
        }
      } catch (error) {
        try {
          if (navigator.clipboard) {
            method = 'copy_fallback';
            await navigator.clipboard.writeText(`${text} ${url}`);
            success = true;
          }
        } catch (fallbackError) {}
      }
      this._track('bw_pulse_share', {
        ...(result || {}),
        method,
        shareMethod: method,
        action: 'share',
        success: String(success)
      });
      const status = this.querySelector('[data-pulse-share-status]');
      if (status) status.textContent = success ? 'Share text ready.' : 'Could not copy. Use the page link.';
    }

    _book() {
      this._track('bw_pulse_booking_click', {
        ...(this._result || this._readPlayed() || {}),
        action: 'book_tour'
      });
    }

    _trackingEndpoint() {
      try {
        const params = new URLSearchParams(window.location.search || '');
        if (params.get('tracking') === 'local' || params.get('local_tracking') === '1') return TRACKING_ENDPOINT_LOCAL;
      } catch (error) {}
      return TRACKING_ENDPOINT_PROD;
    }

    _track(eventName, details) {
      const payload = {
        eventName,
        eventId: randomId('pulse_event'),
        timestamp: new Date().toISOString(),
        sessionId: sessionId(),
        visitorId: visitorId(),
        eventDate: this._daily.dayKey,
        pagePath: window.location.pathname || '',
        pageUrl: window.location.href || '',
        parentPath: window.location.pathname || '',
        parentUrl: window.location.href || '',
        referrer: document.referrer || '',
        landingPage: landingPage(),
        firstPage: landingPage(),
        utmSource: this._param('utm_source'),
        utmMedium: this._param('utm_medium'),
        utmCampaign: this._param('utm_campaign'),
        utmContent: this._param('utm_content'),
        utmTerm: this._param('utm_term'),
        fbclid: this._param('fbclid'),
        fbc: this._cookie('_fbc'),
        fbp: this._cookie('_fbp'),
        isPaid: this._param('utm_medium') === 'paid' || this._param('utm_source') === 'meta' ? 'true' : 'false',
        screenWidth: String(window.screen && window.screen.width ? window.screen.width : ''),
        viewportWidth: String(window.innerWidth || ''),
        userAgent: navigator.userAgent || '',
        payload: {
          source: 'berlin_pulse',
          context: 'berlin_pulse_widget',
          dayKey: this._daily.dayKey,
          questionId: this._daily.prompt.id,
          revealDay: this._daily.dayKey,
          percentActual: String(this._daily.percentActual),
          title: 'Berlin Pulse',
          ...(details || {})
        }
      };
      try {
        fetch(this._trackingEndpoint(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true
        }).catch(() => {});
      } catch (error) {}
    }

    _param(name) {
      try { return new URLSearchParams(window.location.search || '').get(name) || ''; } catch (error) { return ''; }
    }

    _cookie(name) {
      try {
        const item = document.cookie.split('; ').find((part) => part.startsWith(`${name}=`));
        return item ? decodeURIComponent(item.split('=').slice(1).join('=')) : '';
      } catch (error) {
        return '';
      }
    }

    _render() {
      const played = this._result || this._readPlayed();
      const dayLabel = berlinDateLabel(new Date());
      this.innerHTML = `
        <style>${this._styles()}</style>
        <main class="bw-pulse" data-build="${BUILD}" aria-labelledby="bw-pulse-title">
          <section class="bw-pulse-hero">
            <div class="bw-pulse-copy">
              <p class="bw-pulse-kicker">Daily Berlin mood game</p>
              <h1 id="bw-pulse-title">Berlin Pulse</h1>
              <p class="bw-pulse-lead">Guess what Berlin wants today, then see whether your city instinct matches the daily pulse.</p>
              <div class="bw-pulse-actions">
                ${this._step === 'intro' ? '<button class="bw-pulse-btn bw-pulse-btn-primary" type="button" data-pulse-start>Read today</button>' : ''}
                <a class="bw-pulse-btn bw-pulse-btn-secondary" href="${BOOKING_URL}" data-pulse-book>Walk the real city</a>
              </div>
            </div>
            <aside class="bw-pulse-card" aria-label="Today in Berlin">
              <img src="${asset('berlin-pulse/assets/social/berlin-pulse-social-1200x630.jpg')}" alt="Berlin Pulse city mood cover art" width="1200" height="630" loading="eager" decoding="async">
              <div class="bw-pulse-card-body">
                <span>Berlin day</span>
                <strong>${escapeHtml(dayLabel)}</strong>
                <em>Next pulse in <b data-pulse-countdown>${escapeHtml(countdownText())}</b></em>
              </div>
            </aside>
          </section>

          <section class="bw-pulse-game" aria-live="polite">
            ${this._renderPanel(played)}
          </section>
        </main>
      `;
      this._bind();
      this._startCountdown();
      this._syncHostHeightSoon();
    }

    _renderPanel(played) {
      if (this._step === 'loading') {
        return '<div class="bw-pulse-panel"><p class="bw-pulse-panel-kicker">Loading</p><h2>Finding today\'s Berlin pulse...</h2></div>';
      }
      if (this._step === 'intro') {
        return `
          <div class="bw-pulse-panel bw-pulse-intro">
            <div>
              <p class="bw-pulse-panel-kicker">Today&apos;s call</p>
              <h2>${escapeHtml(this._daily.prompt.title)}</h2>
              <p>${escapeHtml(this._daily.prompt.situation)}</p>
            </div>
            <div class="bw-pulse-note">
              <strong>How it works</strong>
              <span>Choose the mood you think Berlin will reward today. The result is fixed by the Berlin-local day, so everyone gets the same daily pulse.</span>
            </div>
          </div>
        `;
      }
      if (this._step === 'play') {
        return `
          <div class="bw-pulse-panel">
            <p class="bw-pulse-panel-kicker">Choose the city mood</p>
            <h2>${escapeHtml(this._daily.prompt.title)}</h2>
            <p>${escapeHtml(this._daily.prompt.situation)}</p>
            <div class="bw-pulse-options">
              ${this._daily.options.map((option) => `
                <button type="button" class="bw-pulse-option" data-pulse-pick="${escapeAttr(option.id)}">
                  <span>${escapeHtml(option.short)}</span>
                  <strong>${escapeHtml(option.label)}</strong>
                  <em>${escapeHtml(option.advice)}</em>
                </button>
              `).join('')}
            </div>
          </div>
        `;
      }
      if (this._step === 'predict') {
        const option = this._option(this._selectedId);
        return `
          <div class="bw-pulse-panel bw-pulse-predict">
            <p class="bw-pulse-panel-kicker">Lock your call</p>
            <h2>${escapeHtml(option ? option.label : 'Your pick')}</h2>
            <p>${escapeHtml(option ? option.advice : this._daily.prompt.situation)}</p>
            <label class="bw-pulse-slider">
              <span>How strong is that mood today?</span>
              <input type="range" min="25" max="85" value="${escapeAttr(this._percentGuess)}" data-pulse-slider>
              <b><span data-pulse-slider-value>${escapeHtml(this._percentGuess)}</span>%</b>
            </label>
            <button class="bw-pulse-btn bw-pulse-btn-primary" type="button" data-pulse-lock>Reveal the pulse</button>
          </div>
        `;
      }
      const result = played || this._result;
      const actual = this._daily.actual;
      const picked = this._option(result?.pick) || actual;
      return `
        <div class="bw-pulse-panel bw-pulse-result">
          <p class="bw-pulse-panel-kicker">Daily result locked</p>
          <h2>${escapeHtml(result?.title || 'Berlin Pulse')}</h2>
          <div class="bw-pulse-result-grid">
            <div class="bw-pulse-meter" style="--guess:${escapeAttr(result?.percentGuess || this._percentGuess)}%;--actual:${escapeAttr(result?.percentActual || this._daily.percentActual)}%">
              <span>your call</span>
              <strong>${escapeHtml(picked.label)}</strong>
              <em>${escapeHtml(result?.percentGuess || this._percentGuess)}%</em>
              <i aria-hidden="true"></i>
            </div>
            <div class="bw-pulse-meter bw-pulse-meter-actual">
              <span>Berlin pulse</span>
              <strong>${escapeHtml(actual.label)}</strong>
              <em>${escapeHtml(this._daily.percentActual)}%</em>
              <i aria-hidden="true"></i>
            </div>
          </div>
          <p class="bw-pulse-verdict">${result?.callCorrect ? 'You read the city correctly today.' : 'Berlin moved another way today.'} ${escapeHtml(actual.advice)} ${escapeHtml(this._daily.prompt.guideNote)}</p>
          <div class="bw-pulse-result-actions">
            <button class="bw-pulse-btn bw-pulse-btn-primary" type="button" data-pulse-share>Share result</button>
            <a class="bw-pulse-btn bw-pulse-btn-secondary" href="${BOOKING_URL}" data-pulse-book>Walk the real city</a>
          </div>
          <p class="bw-pulse-small">Streak: ${escapeHtml(result?.streak || 0)} correct daily calls. Next pulse in <span data-pulse-countdown>${escapeHtml(countdownText())}</span>.</p>
          <p class="bw-pulse-small" data-pulse-share-status></p>
        </div>
      `;
    }

    _bind() {
      const start = this.querySelector('[data-pulse-start]');
      if (start) start.addEventListener('click', () => this._start());
      this.querySelectorAll('[data-pulse-pick]').forEach((button) => {
        button.addEventListener('click', () => this._select(button.getAttribute('data-pulse-pick') || ''));
      });
      const slider = this.querySelector('[data-pulse-slider]');
      if (slider) {
        slider.addEventListener('input', () => {
          this._percentGuess = Number(slider.value || 55);
          const value = this.querySelector('[data-pulse-slider-value]');
          if (value) value.textContent = String(this._percentGuess);
        });
      }
      const lock = this.querySelector('[data-pulse-lock]');
      if (lock) lock.addEventListener('click', () => this._lock());
      const share = this.querySelector('[data-pulse-share]');
      if (share) share.addEventListener('click', () => this._share());
      this.querySelectorAll('[data-pulse-book]').forEach((link) => link.addEventListener('click', () => this._book()));
    }

    _startCountdown() {
      if (this._countdownTimer) window.clearInterval(this._countdownTimer);
      const update = () => {
        this.querySelectorAll('[data-pulse-countdown]').forEach((node) => { node.textContent = countdownText(); });
      };
      update();
      this._countdownTimer = window.setInterval(update, 30000);
    }

    _syncHostHeightSoon() {
      window.requestAnimationFrame(() => this._syncHostHeight());
      window.setTimeout(() => this._syncHostHeight(), 250);
      window.setTimeout(() => this._syncHostHeight(), 1200);
    }

    _syncHostHeight() {
      const page = this.querySelector('.bw-pulse');
      if (!page) return;
      const height = Math.ceil(page.getBoundingClientRect().height);
      if (!height || height < 520) return;
      const targetHeight = `${Math.min(Math.max(height, 720), 4200)}px`;
      [this, this.parentElement, this.closest('section')].filter(Boolean).forEach((target) => {
        target.style.setProperty('height', targetHeight, 'important');
        target.style.setProperty('min-height', targetHeight, 'important');
      });
    }

    _styles() {
      return `
        bw-berlin-pulse{display:block;width:100%}
        .bw-pulse{--green:#1B5E20;--dark:#061A0C;--yellow:#FFE600;--lime:#7CB342;--cream:#FAFAF5;--paper:#FFFFFF;--ink:#212121;--muted:#4D5D52;--red:#E63946;--cyan:#34D6B4;background:linear-gradient(180deg,#FAFAF5 0%,#FFFFFF 42%,#FAFAF5 100%);color:var(--ink);font-family:Montserrat,Arial,sans-serif;margin:0 auto;max-width:1180px;overflow:hidden;width:100%}
        .bw-pulse *{box-sizing:border-box}
        .bw-pulse h1,.bw-pulse h2,.bw-pulse p{margin:0}
        .bw-pulse button,.bw-pulse input{font:inherit}
        .bw-pulse a{color:inherit}
        .bw-pulse-hero{background:radial-gradient(circle at 80% 18%,rgba(255,230,0,.62),transparent 24%),linear-gradient(135deg,#073B16 0%,#1B5E20 58%,#7CB342 100%);color:#fff;display:grid;gap:26px;grid-template-columns:minmax(0,1fr) minmax(300px,420px);min-height:520px;padding:clamp(38px,5vw,70px);position:relative}
        .bw-pulse-hero:before{background:repeating-linear-gradient(90deg,rgba(255,255,255,.06) 0 1px,transparent 1px 34px),repeating-linear-gradient(0deg,rgba(255,255,255,.05) 0 1px,transparent 1px 34px);content:"";inset:0;pointer-events:none;position:absolute}
        .bw-pulse-copy{align-self:center;max-width:620px;position:relative;z-index:1}
        .bw-pulse-kicker,.bw-pulse-panel-kicker{font-size:12px;font-weight:950;letter-spacing:.08em;line-height:1;text-transform:uppercase}
        .bw-pulse-kicker{color:var(--yellow);margin-bottom:14px}
        .bw-pulse h1{color:#fff;font-size:clamp(52px,8vw,104px);font-weight:950;letter-spacing:0;line-height:.88;text-shadow:5px 5px 0 rgba(6,26,12,.35)}
        .bw-pulse-lead{color:rgba(250,250,245,.84);font-size:clamp(17px,2vw,23px);font-weight:750;line-height:1.42;margin-top:20px;max-width:590px}
        .bw-pulse-actions,.bw-pulse-result-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:24px}
        .bw-pulse-btn{align-items:center;border:2px solid transparent;border-radius:8px;cursor:pointer;display:inline-flex;font-size:14px;font-weight:950;justify-content:center;letter-spacing:0;line-height:1.1;min-height:50px;padding:13px 18px;text-decoration:none;transition:background 160ms ease,border-color 160ms ease,box-shadow 160ms ease,transform 160ms ease}
        .bw-pulse-btn:hover,.bw-pulse-btn:focus-visible{outline:none;transform:translateY(-1px)}
        .bw-pulse-btn-primary{background:var(--yellow);border-color:var(--dark);box-shadow:5px 5px 0 rgba(52,214,180,.82);color:var(--dark)}
        .bw-pulse-btn-secondary{background:rgba(255,255,255,.1);border-color:rgba(250,250,245,.45);color:#fff}
        .bw-pulse-game .bw-pulse-btn-secondary{background:#fff;border-color:rgba(27,94,32,.24);color:var(--green)}
        .bw-pulse-card{align-self:center;background:var(--paper);border:4px solid var(--dark);box-shadow:12px 12px 0 var(--yellow);color:var(--ink);display:grid;overflow:hidden;position:relative;z-index:1}
        .bw-pulse-card img{aspect-ratio:1200/630;display:block;height:auto;object-fit:cover;width:100%}
        .bw-pulse-card-body{display:grid;gap:5px;padding:16px}
        .bw-pulse-card-body span{color:var(--red);font-size:11px;font-weight:950;letter-spacing:.08em;text-transform:uppercase}
        .bw-pulse-card-body strong{color:var(--green);font-size:22px;font-weight:950;line-height:1.05}
        .bw-pulse-card-body em{color:var(--muted);font-size:13px;font-style:normal;font-weight:800}
        .bw-pulse-card-body b{color:var(--dark);font-weight:950}
        .bw-pulse-game{padding:clamp(30px,5vw,60px)}
        .bw-pulse-panel{background:#fff;border:1px solid rgba(27,94,32,.16);box-shadow:0 18px 44px rgba(8,36,16,.1);display:grid;gap:18px;margin:0 auto;max-width:960px;padding:clamp(22px,4vw,38px)}
        .bw-pulse-intro{grid-template-columns:minmax(0,1fr) minmax(260px,.42fr)}
        .bw-pulse-panel-kicker{color:var(--red);margin-bottom:8px}
        .bw-pulse-panel h2{color:var(--green);font-size:clamp(30px,5vw,58px);font-weight:950;letter-spacing:0;line-height:.98}
        .bw-pulse-panel p{color:var(--muted);font-size:16px;font-weight:700;line-height:1.55;max-width:720px}
        .bw-pulse-note{align-self:stretch;background:#FAFAF5;border-left:5px solid var(--yellow);display:grid;gap:8px;padding:18px}
        .bw-pulse-note strong{color:var(--green);font-size:13px;font-weight:950;text-transform:uppercase}
        .bw-pulse-note span{color:var(--muted);font-size:14px;font-weight:750;line-height:1.5}
        .bw-pulse-options{display:grid;gap:14px;grid-template-columns:repeat(2,minmax(0,1fr));margin-top:4px}
        .bw-pulse-option{background:#FAFAF5;border:2px solid rgba(27,94,32,.22);border-radius:8px;color:var(--ink);cursor:pointer;display:grid;gap:8px;min-height:158px;padding:18px;text-align:left;transition:background 160ms ease,border-color 160ms ease,box-shadow 160ms ease,transform 160ms ease}
        .bw-pulse-option:hover,.bw-pulse-option:focus-visible{background:#fff;border-color:var(--green);box-shadow:5px 5px 0 var(--yellow);outline:none;transform:translateY(-1px)}
        .bw-pulse-option span{color:var(--red);font-size:11px;font-weight:950;letter-spacing:.08em;text-transform:uppercase}
        .bw-pulse-option strong{color:var(--green);font-size:23px;font-weight:950;line-height:1.05}
        .bw-pulse-option em{color:var(--muted);font-size:13px;font-style:normal;font-weight:750;line-height:1.45}
        .bw-pulse-predict{max-width:760px}
        .bw-pulse-slider{background:#FAFAF5;border:2px solid rgba(27,94,32,.16);display:grid;gap:12px;padding:18px}
        .bw-pulse-slider span{color:var(--green);font-size:13px;font-weight:950;text-transform:uppercase}
        .bw-pulse-slider input{accent-color:var(--green);width:100%}
        .bw-pulse-slider b{color:var(--dark);font-size:28px;font-weight:950}
        .bw-pulse-result-grid{display:grid;gap:14px;grid-template-columns:repeat(2,minmax(0,1fr))}
        .bw-pulse-meter{background:#FAFAF5;border:2px solid rgba(27,94,32,.16);display:grid;gap:8px;min-height:190px;padding:18px;position:relative;overflow:hidden}
        .bw-pulse-meter:after{background:linear-gradient(90deg,var(--yellow),var(--cyan));bottom:0;content:"";height:12px;left:0;position:absolute;width:var(--guess)}
        .bw-pulse-meter-actual:after{background:linear-gradient(90deg,var(--green),var(--lime));width:var(--actual)}
        .bw-pulse-meter span{color:var(--red);font-size:11px;font-weight:950;letter-spacing:.08em;text-transform:uppercase}
        .bw-pulse-meter strong{color:var(--green);font-size:28px;font-weight:950;line-height:1}
        .bw-pulse-meter em{color:var(--dark);font-size:42px;font-style:normal;font-weight:950;line-height:1}
        .bw-pulse-meter i{border:2px solid rgba(27,94,32,.18);border-radius:999px;height:120px;position:absolute;right:-38px;top:-32px;width:120px}
        .bw-pulse-verdict{font-size:17px!important}
        .bw-pulse-small{color:rgba(33,33,33,.66)!important;font-size:12px!important;font-weight:850!important;line-height:1.4!important;min-height:16px}
        @media(max-width:880px){.bw-pulse-hero,.bw-pulse-intro{grid-template-columns:1fr}.bw-pulse-card{max-width:520px}.bw-pulse-options,.bw-pulse-result-grid{grid-template-columns:1fr}.bw-pulse-hero{min-height:0;padding:34px 20px}.bw-pulse-game{padding:28px 18px}.bw-pulse h1{font-size:clamp(50px,17vw,78px)}.bw-pulse-panel h2{font-size:clamp(28px,10vw,46px)}}
        @media(max-width:480px){.bw-pulse-actions,.bw-pulse-result-actions{display:grid}.bw-pulse-btn{width:100%}.bw-pulse-option{min-height:0}.bw-pulse-card{box-shadow:7px 7px 0 var(--yellow)}}
      `;
    }
  }

  if (!customElements.get('bw-berlin-pulse')) {
    customElements.define('bw-berlin-pulse', BWBerlinPulseElement);
  }
})();
