/*
 * <bw-where-in-berlin> - Where in Berlin Do You Belong?
 *
 * A six-question, four-choice district match game. The component stays in
 * light DOM so it works inside Wix custom embeds and the standalone page.
 */
(function () {
  'use strict';

  var SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : '';
  var BASE_URL = SCRIPT_URL && SCRIPT_URL.includes('/where-in-berlin/')
    ? SCRIPT_URL.replace(/where-in-berlin\/where-in-berlin-element\.js(?:\?.*)?$/, '')
    : 'https://fenerszymanski.github.io/berlinwalk-widgets/';
  var BUILD = 'where-in-berlin-20260712-share-card-v3';
  var DATA_URL = new URL('where-in-berlin/data.json', BASE_URL).toString();
  var SHARE_CARD_URL = asset('js/bw-share-card.js');
  var TRACKING_ENDPOINT_PROD = 'https://berlinwalk-content-app.vercel.app/api/where-in-berlin-event';
  var TRACKING_ENDPOINT_LOCAL = 'http://127.0.0.1:5173/api/where-in-berlin-event';
  var BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
  var STORAGE_PREFIX = 'bw_where_in_berlin_';
  var BERLIN_TIMEZONE = 'Europe/Berlin';

  var AUDIO = {
    ambience: {
      'canal-morning': 'assets/audio/ambience/canal-morning.mp3',
      'city-evening': 'assets/audio/ambience/city-evening.mp3',
      'ubahn': 'assets/audio/ambience/ubahn.mp3',
      'home': 'assets/audio/ambience/home.mp3',
      'night-city': 'assets/audio/ambience/night-city.mp3',
      'sunday': 'assets/audio/ambience/sunday.mp3'
    },
    stingers: {
      cup: 'assets/audio/stingers/cup.mp3',
      footsteps: 'assets/audio/stingers/footsteps.mp3',
      market: 'assets/audio/stingers/market.mp3',
      water: 'assets/audio/stingers/water.mp3',
      city: 'assets/audio/stingers/city.mp3',
      glass: 'assets/audio/stingers/glass.mp3',
      announcement: 'assets/audio/stingers/announcement.mp3',
      bike: 'assets/audio/stingers/bike.mp3'
    }
  };

  var AXIS_COPY = {
    energy: { positive: 'you keep choosing movement and city energy', negative: 'you protect a slower, more settled pace' },
    urbanity: { positive: 'you want Berlin close, layered and in motion', negative: 'you keep leaving space around the day' },
    heritage: { positive: 'you look for Berlin with context and older layers', negative: 'you choose the present tense of the city' },
    night: { positive: 'you are happy to let the day run into the night', negative: 'you prefer Berlin before the noise takes over' },
    communal: { positive: 'you choose places where the city is shared', negative: 'you make room for your own corner of it' },
    planned: { positive: 'you like having the useful next move ready', negative: 'you trust a good detour more than a fixed plan' }
  };

  function asset(path) {
    var url = new URL(path, BASE_URL);
    url.searchParams.set('v', BUILD);
    return url.toString();
  }

  function gameAsset(path) {
    return asset('where-in-berlin/' + String(path || '').replace(/^\/+/, ''));
  }

  function loadShareImage(src) {
    return new Promise(function (resolve) {
      var image = new Image();
      image.crossOrigin = 'anonymous';
      image.addEventListener('load', function () { resolve(image); }, { once: true });
      image.addEventListener('error', function () { resolve(null); }, { once: true });
      image.src = src;
    });
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

  function safeJsonRead(key, fallback) {
    try {
      var value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function safeJsonWrite(key, value) {
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (error) {}
  }

  function safeSessionRead(key) {
    try { return window.sessionStorage.getItem(key) || ''; } catch (error) { return ''; }
  }

  function safeSessionWrite(key, value) {
    try { window.sessionStorage.setItem(key, value); } catch (error) {}
  }

  function randomId(prefix) {
    return prefix + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
  }

  function persistentId(key, prefix) {
    var existing = safeJsonRead(key, '');
    if (existing) return existing;
    var created = randomId(prefix);
    safeJsonWrite(key, created);
    return created;
  }

  function berlinParts(date) {
    var parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: BERLIN_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23'
    }).formatToParts(date || new Date());
    var result = {};
    parts.forEach(function (part) {
      if (part.type !== 'literal') result[part.type] = part.value;
    });
    return result;
  }

  function berlinDayKey(date) {
    var parts = berlinParts(date || new Date());
    return parts.year + '-' + parts.month + '-' + parts.day;
  }

  function berlinDateLabel(date) {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: BERLIN_TIMEZONE,
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    }).format(date || new Date());
  }

  function dayNumber(date) {
    var key = berlinDayKey(date || new Date());
    var noon = new Date(key + 'T12:00:00Z');
    return Math.floor(noon.getTime() / 86400000);
  }

  function waitForScript(src, marker) {
    return new Promise(function (resolve) {
      if (window.BerlinWalkShareCard || document.querySelector('script[data-' + marker + ']')) {
        resolve();
        return;
      }
      var script = document.createElement('script');
      script.src = src;
      script.defer = true;
      script.dataset[marker.replace(/-([a-z])/g, function (_, letter) { return letter.toUpperCase(); })] = 'true';
      script.addEventListener('load', resolve, { once: true });
      script.addEventListener('error', resolve, { once: true });
      document.head.appendChild(script);
    });
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function unique(array) {
    return array.filter(function (item, index) { return array.indexOf(item) === index; });
  }

  function findOption(data, answer) {
    var question = data.questions.find(function (item) { return item.id === answer.questionId; });
    return question && question.options.find(function (item) { return item.id === answer.optionId; });
  }

  function calculateMatch(data, answers) {
    var axes = data.axes || [];
    var sums = {};
    var affinity = {};
    axes.forEach(function (axis) { sums[axis] = 0; });

    answers.forEach(function (answer) {
      var option = findOption(data, answer);
      if (!option) return;
      axes.forEach(function (axis) { sums[axis] += Number(option.axes && option.axes[axis] || 0); });
      Object.keys(option.affinity || {}).forEach(function (districtId) {
        affinity[districtId] = (affinity[districtId] || 0) + Number(option.affinity[districtId] || 0);
      });
    });

    var answerCount = Math.max(1, answers.length);
    // Each chosen option may point toward up to three boroughs at two points
    // each. Normalising against all 36 possible points keeps affinity as the
    // intended smaller 15% tie-breaker instead of letting one repeated tag
    // overpower the lifestyle profile.
    var maxAffinity = answerCount * 3 * 2;
    var ranked = data.districts.map(function (district) {
      var profileSimilarity = axes.reduce(function (total, axis) {
        var answerAverage = sums[axis] / answerCount;
        var distance = Math.abs(answerAverage - Number(district.profile && district.profile[axis] || 0));
        return total + (1 - distance / 4);
      }, 0) / Math.max(1, axes.length);
      var affinityScore = clamp(Number(affinity[district.id] || 0) / maxAffinity, 0, 1);
      var rankScore = (profileSimilarity * 0.85) + (affinityScore * 0.15);
      return {
        district: district,
        profileSimilarity: profileSimilarity,
        affinityScore: affinityScore,
        rankScore: rankScore
      };
    }).sort(function (a, b) {
      if (b.rankScore !== a.rankScore) return b.rankScore - a.rankScore;
      if (b.affinityScore !== a.affinityScore) return b.affinityScore - a.affinityScore;
      return a.district.id.localeCompare(b.district.id);
    });

    var winner = ranked[0];
    var runnerUp = ranked[1] || ranked[0];
    var percent = Math.round(clamp(62 + winner.rankScore * 34, 62, 96));
    return { winner: winner, runnerUp: runnerUp, ranked: ranked, sums: sums, affinity: affinity, percent: percent };
  }

  function makeReasons(data, answers, calculation) {
    var axes = data.axes || [];
    var sortedAxes = axes.slice().sort(function (a, b) {
      return Math.abs(calculation.sums[b] || 0) - Math.abs(calculation.sums[a] || 0);
    });
    var selected = answers.map(function (answer) { return findOption(data, answer); }).filter(Boolean);
    var first = selected[0];
    var second = selected[Math.min(2, selected.length - 1)];
    var firstAxis = sortedAxes[0] || 'urbanity';
    var secondAxis = sortedAxes[1] || 'planned';
    return unique([
      first ? 'You started with ' + first.label.toLowerCase() + '.' : 'You made a clear first move.',
      AXIS_COPY[firstAxis][(calculation.sums[firstAxis] || 0) >= 0 ? 'positive' : 'negative'] + '.',
      second ? 'Later, ' + second.label.toLowerCase() + ' kept the result pointed toward ' + calculation.winner.district.district + '.' : AXIS_COPY[secondAxis][(calculation.sums[secondAxis] || 0) >= 0 ? 'positive' : 'negative'] + '.'
    ]).slice(0, 3);
  }

  class BWWhereInBerlinElement extends HTMLElement {
    constructor() {
      super();
      this._data = null;
      this._screen = 'loading';
      this._questionIndex = 0;
      this._answers = [];
      this._startedAt = 0;
      this._result = null;
      this._viewTracked = false;
      this._locked = false;
      this._ambient = null;
      this._audioEnabled = safeJsonRead(STORAGE_PREFIX + 'sound_enabled', false) === true;
    }

    connectedCallback() {
      this._render();
      this._load();
    }

    disconnectedCallback() {
      this._stopAmbient();
    }

    async _load() {
      try {
        var response = await fetch(DATA_URL, { cache: 'no-cache' });
        if (!response.ok) throw new Error('Game data could not load.');
        this._data = await response.json();
        if (!Array.isArray(this._data.questions) || !Array.isArray(this._data.districts)) throw new Error('Game data is incomplete.');
        this._screen = 'intro';
      } catch (error) {
        this._screen = 'error';
      }
      this._render();
      this._trackView();
    }

    _sessionId() {
      var key = STORAGE_PREFIX + 'session_id';
      var value = safeSessionRead(key);
      if (!value) {
        value = randomId('district_session');
        safeSessionWrite(key, value);
      }
      return value;
    }

    _visitorId() {
      return persistentId(STORAGE_PREFIX + 'visitor_id', 'district_visitor');
    }

    _landingPage() {
      var key = STORAGE_PREFIX + 'landing_page';
      var value = safeSessionRead(key);
      if (!value) {
        value = window.location.href;
        safeSessionWrite(key, value);
      }
      return value;
    }

    _endpoint() {
      var host = window.location.hostname;
      return host === 'localhost' || host === '127.0.0.1' ? TRACKING_ENDPOINT_LOCAL : TRACKING_ENDPOINT_PROD;
    }

    _trackView() {
      if (this._viewTracked) return;
      this._viewTracked = true;
      this._track('bw_where_in_berlin_page_view', { action: 'page_view', title: 'Where in Berlin Do You Belong?' });
    }

    _track(eventName, payload) {
      var dayKey = berlinDayKey();
      var body = {
        eventName: eventName,
        eventId: randomId('district_event'),
        timestamp: new Date().toISOString(),
        eventDate: dayKey,
        sessionId: this._sessionId(),
        visitorId: this._visitorId(),
        pagePath: window.location.pathname,
        pageUrl: window.location.href,
        referrer: document.referrer || '',
        landingPage: this._landingPage(),
        screenWidth: String(window.screen && window.screen.width || ''),
        viewportWidth: String(window.innerWidth || ''),
        payload: Object.assign({
          dayKey: dayKey,
          game: 'where-in-berlin',
          soundEnabled: this._audioEnabled,
          build: BUILD
        }, payload || {})
      };
      try {
        fetch(this._endpoint(), {
          method: 'POST',
          mode: 'cors',
          keepalive: true,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        }).catch(function () {});
      } catch (error) {}
    }

    _setSound(enabled) {
      this._audioEnabled = !!enabled;
      safeJsonWrite(STORAGE_PREFIX + 'sound_enabled', this._audioEnabled);
      if (!this._audioEnabled) this._stopAmbient();
    }

    _playOne(path, volume) {
      if (!this._audioEnabled || !path) return;
      try {
        var sound = new Audio(gameAsset(path));
        sound.volume = typeof volume === 'number' ? volume : 0.42;
        sound.play().catch(function () {});
      } catch (error) {}
    }

    _stopAmbient() {
      if (!this._ambient) return;
      try {
        this._ambient.pause();
        this._ambient.currentTime = 0;
      } catch (error) {}
      this._ambient = null;
    }

    _setAmbience(id) {
      this._stopAmbient();
      if (!this._audioEnabled || !id || !AUDIO.ambience[id]) return;
      try {
        this._ambient = new Audio(gameAsset(AUDIO.ambience[id]));
        this._ambient.loop = true;
        this._ambient.volume = 0.15;
        this._ambient.play().catch(function () {});
      } catch (error) {}
    }

    _start(withSound) {
      this._setSound(withSound);
      this._questionIndex = 0;
      this._answers = [];
      this._result = null;
      this._startedAt = Date.now();
      this._screen = 'question';
      this._setAmbience(this._data.questions[0].ambience);
      this._track('bw_where_in_berlin_start', { action: 'start', questionCount: this._data.questions.length });
      this._render();
    }

    _answer(optionId) {
      if (this._locked || !this._data) return;
      var question = this._data.questions[this._questionIndex];
      var option = question.options.find(function (item) { return item.id === optionId; });
      if (!option) return;
      this._locked = true;
      this._answers.push({ questionId: question.id, optionId: option.id });
      this._playOne(AUDIO.stingers[option.stinger], 0.45);
      this._track('bw_where_in_berlin_answer', {
        action: 'answer',
        questionId: question.id,
        questionIndex: this._questionIndex + 1,
        optionId: option.id,
        optionLabel: option.label,
        answers: this._answers.map(function (answer) { return answer.optionId; }).join('|')
      });

      var self = this;
      window.setTimeout(function () {
        self._questionIndex += 1;
        self._locked = false;
        if (self._questionIndex >= self._data.questions.length) {
          self._finish();
          return;
        }
        self._setAmbience(self._data.questions[self._questionIndex].ambience);
        self._render();
      }, 190);
    }

    _passport() {
      var fallback = { version: 1, stamps: {}, awardedDays: {} };
      var current = safeJsonRead(STORAGE_PREFIX + 'passport_v1', fallback);
      if (!current || typeof current !== 'object') current = fallback;
      current.stamps = current.stamps && typeof current.stamps === 'object' ? current.stamps : {};
      current.awardedDays = current.awardedDays && typeof current.awardedDays === 'object' ? current.awardedDays : {};
      return current;
    }

    _awardStamp(districtId) {
      var dayKey = berlinDayKey();
      var passport = this._passport();
      if (passport.awardedDays[dayKey]) {
        return { awarded: false, passport: passport, dayKey: dayKey };
      }
      var stamp = passport.stamps[districtId] || { count: 0, firstAt: '', lastAt: '' };
      stamp.count += 1;
      stamp.firstAt = stamp.firstAt || dayKey;
      stamp.lastAt = dayKey;
      passport.stamps[districtId] = stamp;
      passport.awardedDays[dayKey] = districtId;
      safeJsonWrite(STORAGE_PREFIX + 'passport_v1', passport);
      return { awarded: true, passport: passport, dayKey: dayKey };
    }

    _finish() {
      this._stopAmbient();
      var calculation = calculateMatch(this._data, this._answers);
      var stamp = this._awardStamp(calculation.winner.district.id);
      var durationMs = Math.max(0, Date.now() - this._startedAt);
      this._result = {
        district: calculation.winner.district,
        runnerUp: calculation.runnerUp.district,
        percent: calculation.percent,
        reasons: makeReasons(this._data, this._answers, calculation),
        totals: calculation.sums,
        dayKey: stamp.dayKey,
        passportAwarded: stamp.awarded,
        passportUniqueCount: Object.keys(stamp.passport.stamps).length,
        durationMs: durationMs
      };
      this._screen = 'result';
      this._playOne('assets/audio/results/' + this._result.district.id + '.mp3', 0.6);
      this._track('bw_where_in_berlin_complete', {
        action: 'complete',
        district: this._result.district.district,
        districtId: this._result.district.id,
        archetype: this._result.district.archetype,
        matchPercent: this._result.percent,
        runnerUp: this._result.runnerUp.district,
        durationMs: durationMs,
        passportAwarded: stamp.awarded,
        passportUniqueCount: this._result.passportUniqueCount,
        answers: this._answers.map(function (answer) { return answer.optionId; }).join('|')
      });
      if (stamp.awarded) {
        this._track('bw_stamp_earned', {
          action: 'stamp_earned',
          game: 'where-in-berlin',
          district: this._result.district.district,
          districtId: this._result.district.id,
          count: String(this._result.passportUniqueCount),
          completionRatio: String(this._result.percent),
          success: true
        });
      }
      this._render();
    }

    _replay() {
      this._track('bw_where_in_berlin_replay', {
        action: 'replay',
        district: this._result && this._result.district.district || '',
        matchPercent: this._result && this._result.percent || ''
      });
      this._start(this._audioEnabled);
    }

    async _share() {
      if (!this._result) return;
      var result = this._result;
      var text = 'I got ' + result.district.district + ' - ' + result.district.archetype + ' (' + result.percent + '%). Where in Berlin do you belong?';
      var url = 'https://www.berlinwalk.com/games/where-in-berlin?utm_source=share&utm_medium=game&utm_campaign=where_in_berlin&utm_content=' + encodeURIComponent(result.district.id);
      var method = 'copy';
      try {
        await waitForScript(SHARE_CARD_URL, 'bw-district-share-card');
        if (window.BerlinWalkShareCard && navigator.share && window.File) {
          var shareImage = await loadShareImage(gameAsset(result.district.poster));
          var canvas = window.BerlinWalkShareCard.createCard({
            title: '',
            subtitle: result.district.district,
            score: result.percent + '%',
            meta: result.district.archetype,
            lines: result.reasons,
            footer: '',
            cta: 'Where in Berlin do you belong?',
            image: shareImage
          });
          var blob = await new Promise(function (resolve) { canvas.toBlob(resolve, 'image/png'); });
          if (blob) {
            var file = new File([blob], 'berlinwalk-' + result.district.id + '-match.png', { type: 'image/png' });
            await navigator.share({ title: 'Where in Berlin Do You Belong?', text: text, url: url, files: [file] });
            method = 'native_card';
          } else {
            await navigator.share({ title: 'Where in Berlin Do You Belong?', text: text, url: url });
            method = 'native';
          }
        } else if (navigator.share) {
          await navigator.share({ title: 'Where in Berlin Do You Belong?', text: text, url: url });
          method = 'native';
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text + ' ' + url);
          method = 'copy';
        } else {
          window.prompt('Copy your result', text + ' ' + url);
          method = 'prompt';
        }
      } catch (error) {
        if (error && error.name === 'AbortError') return;
        try {
          await navigator.clipboard.writeText(text + ' ' + url);
          method = 'copy';
        } catch (copyError) {
          return;
        }
      }
      var message = this.querySelector('[data-share-status]');
      if (message) message.textContent = method === 'copy' ? 'Result copied.' : 'Ready to share.';
      this._track('bw_where_in_berlin_share', {
        action: 'share',
        district: result.district.district,
        matchPercent: result.percent,
        method: method,
        success: true
      });
    }

    _book() {
      if (!this._result) return;
      this._track('bw_where_in_berlin_booking_click', {
        action: 'booking_click',
        district: this._result.district.district,
        archetype: this._result.district.archetype,
        matchPercent: this._result.percent,
        ctaKind: this._result.district.bookingContent,
        success: true
      });
    }

    _render() {
      var content = this._screen === 'loading' ? this._renderLoading()
        : this._screen === 'error' ? this._renderError()
          : this._screen === 'intro' ? this._renderIntro()
            : this._screen === 'question' ? this._renderQuestion()
              : this._renderResult();
      this.innerHTML = '<style>' + this._styles() + '</style><section class="bw-wib" aria-live="polite">' + content + '</section>';
      this._bind();
    }

    _renderLoading() {
      return '<div class="bw-wib-shell bw-wib-loading"><span class="bw-wib-spinner" aria-hidden="true"></span><p>Finding your corner of Berlin...</p></div>';
    }

    _renderError() {
      return '<div class="bw-wib-shell bw-wib-error"><p class="bw-wib-kicker">Berlin match</p><h2>The city map did not load.</h2><p>Refresh once and I will ask the six questions again.</p><button class="bw-wib-button" type="button" data-action="reload">Try again</button></div>';
    }

    _renderIntro() {
      var stamp = this._passport();
      var uniqueCount = Object.keys(stamp.stamps).length;
      return '' +
        '<div class="bw-wib-shell bw-wib-intro">' +
          '<div class="bw-wib-topline"><span>Berlin district match</span><button class="bw-wib-sound" type="button" data-action="toggle-sound" aria-pressed="' + String(this._audioEnabled) + '">' + (this._audioEnabled ? 'Sound on' : 'Sound off') + '</button></div>' +
          '<p class="bw-wib-kicker">6 quick situation calls</p>' +
          '<h2>See which Berlin district fits you best.</h2>' +
          '<p class="bw-wib-lead">Answer six quick situations. I will match your choices to one of Berlin’s 12 boroughs.</p>' +
          '<div class="bw-wib-intro-art" aria-hidden="true"><span class="bw-wib-ring bw-wib-ring-a"></span><span class="bw-wib-ring bw-wib-ring-b"></span><span class="bw-wib-grid"></span><span class="bw-wib-map-word">12</span></div>' +
          '<div class="bw-wib-starts">' +
            '<button class="bw-wib-button" type="button" data-action="start-sound">Start with sound</button>' +
            '<button class="bw-wib-button bw-wib-button-ghost" type="button" data-action="start-quiet">Play quietly</button>' +
          '</div>' +
          '<p class="bw-wib-small">Four choices each time. No wrong answer. Your first result today earns one district stamp.</p>' +
          '<p class="bw-wib-stamp-line">' + (uniqueCount ? uniqueCount + ' district stamp' + (uniqueCount === 1 ? '' : 's') + ' collected' : 'Your district passport starts here') + '</p>' +
        '</div>';
    }

    _renderQuestion() {
      var question = this._data.questions[this._questionIndex];
      var progress = this._data.questions.map(function (_, index) {
        return '<span class="bw-wib-progress-dot ' + (index <= this._questionIndex ? 'is-on' : '') + '" aria-hidden="true"></span>';
      }, this).join('');
      var choices = question.options.map(function (option) {
        return '' +
          '<button class="bw-wib-choice" type="button" data-choice="' + escapeAttr(option.id) + '">' +
            '<span class="bw-wib-photo"><img data-option-image src="' + escapeAttr(gameAsset(option.image)) + '" alt="" loading="eager"></span>' +
            '<span class="bw-wib-choice-text"><strong>' + escapeHtml(option.label) + '</strong><small>' + escapeHtml(option.micro) + '</small></span>' +
          '</button>';
      }).join('');
      return '' +
        '<div class="bw-wib-shell bw-wib-play">' +
          '<div class="bw-wib-topline"><span>' + escapeHtml(question.kicker) + '</span><button class="bw-wib-sound" type="button" data-action="toggle-sound" aria-pressed="' + String(this._audioEnabled) + '">' + (this._audioEnabled ? 'Sound on' : 'Sound off') + '</button></div>' +
          '<div class="bw-wib-progress" aria-label="Question ' + (this._questionIndex + 1) + ' of ' + this._data.questions.length + '">' + progress + '</div>' +
          '<p class="bw-wib-kicker">Make the call</p>' +
          '<h2>' + escapeHtml(question.title) + '</h2>' +
          '<p class="bw-wib-lead">' + escapeHtml(question.situation) + '</p>' +
          '<div class="bw-wib-choices">' + choices + '</div>' +
        '</div>';
    }

    _renderResult() {
      var result = this._result;
      if (!result) return this._renderLoading();
      var district = result.district;
      var booking = BOOKING_URL + '?utm_source=game&utm_medium=where_in_berlin&utm_campaign=berlinwalk_games&utm_content=' + encodeURIComponent(district.bookingContent);
      var stampCopy = result.passportAwarded
        ? 'Today’s ' + district.district + ' stamp is in your passport.'
        : 'You already earned today’s stamp. Replay as much as you like.';
      var reasons = result.reasons.map(function (reason) {
        return '<li>' + escapeHtml(reason) + '</li>';
      }).join('');
      return '' +
        '<div class="bw-wib-shell bw-wib-result">' +
          '<div class="bw-wib-topline"><span>Berlin match · ' + escapeHtml(berlinDateLabel()) + '</span><button class="bw-wib-sound" type="button" data-action="toggle-sound" aria-pressed="' + String(this._audioEnabled) + '">' + (this._audioEnabled ? 'Sound on' : 'Sound off') + '</button></div>' +
          '<p class="bw-wib-kicker">Your Berlin borough</p>' +
          '<div class="bw-wib-result-head">' +
            '<div><h2>' + escapeHtml(district.district) + '</h2><p class="bw-wib-archetype">' + escapeHtml(district.archetype) + '</p></div>' +
            '<div class="bw-wib-score"><b>' + result.percent + '%</b><span>match</span></div>' +
          '</div>' +
          '<div class="bw-wib-poster"><img data-result-poster src="' + escapeAttr(gameAsset(district.poster)) + '" data-fallback="' + escapeAttr(gameAsset(this._answers[0] && findOption(this._data, this._answers[0]).image || 'assets/questions/q1-canal-breakfast.jpg')) + '" alt="A Berlin scene for ' + escapeAttr(district.district) + '"></div>' +
          '<ul class="bw-wib-reasons">' + reasons + '</ul>' +
          '<p class="bw-wib-guide"><b>My read:</b> ' + escapeHtml(district.guideNote) + '</p>' +
          '<div class="bw-wib-stamp-result"><span class="bw-wib-stamp-mark">' + (result.passportAwarded ? 'Stamp added' : 'Stamp locked') + '</span><span>' + escapeHtml(stampCopy) + '</span></div>' +
          '<div class="bw-wib-result-actions">' +
            '<button class="bw-wib-button" type="button" data-action="share">Share result</button>' +
            '<a class="bw-wib-button bw-wib-button-ghost" data-booking href="' + escapeAttr(booking) + '">' + escapeHtml(district.bookingCta) + '</a>' +
          '</div>' +
          '<p class="bw-wib-share-status" data-share-status></p>' +
          '<button class="bw-wib-text-button" type="button" data-action="replay">Play a different route</button>' +
        '</div>';
    }

    _bind() {
      var self = this;
      this.querySelectorAll('[data-choice]').forEach(function (button) {
        button.addEventListener('click', function () { self._answer(button.dataset.choice); });
      });
      this.querySelectorAll('[data-action]').forEach(function (button) {
        button.addEventListener('click', function () {
          var action = button.dataset.action;
          if (action === 'start-sound') self._start(true);
          if (action === 'start-quiet') self._start(false);
          if (action === 'toggle-sound') {
            self._setSound(!self._audioEnabled);
            if (self._screen === 'question') self._setAmbience(self._data.questions[self._questionIndex].ambience);
            self._render();
          }
          if (action === 'replay') self._replay();
          if (action === 'share') self._share();
          if (action === 'reload') window.location.reload();
        });
      });
      var booking = this.querySelector('[data-booking]');
      if (booking) booking.addEventListener('click', function () { self._book(); });
      this.querySelectorAll('[data-option-image], [data-result-poster]').forEach(function (image) {
        image.addEventListener('error', function () {
          var fallback = image.dataset.fallback;
          if (fallback && image.src !== fallback) {
            image.src = fallback;
            return;
          }
          image.closest('.bw-wib-photo, .bw-wib-poster').classList.add('is-missing');
        }, { once: true });
      });
    }

    _styles() {
      return '' +
        'bw-where-in-berlin{display:block;width:100%}' +
        '.bw-wib{--bw-green:#0b5d28;--bw-forest:#06381a;--bw-ink:#102117;--bw-paper:#fbfbf6;--bw-lime:#b9eb5a;--bw-yellow:#ffe600;--bw-red:#e63946;--bw-muted:#536257;color:var(--bw-ink);font-family:Montserrat,"Avenir Next",Arial,sans-serif;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%;}' +
        '.bw-wib *{box-sizing:border-box}.bw-wib h2,.bw-wib p{margin:0}.bw-wib button,.bw-wib a{font:inherit}.bw-wib-shell{background:var(--bw-paper);border:1px solid rgba(6,56,26,.17);box-shadow:0 18px 42px rgba(6,56,26,.13);margin:0 auto;max-width:760px;min-height:620px;overflow:hidden;padding:clamp(22px,5vw,46px);position:relative}.bw-wib-shell:before{background:repeating-linear-gradient(90deg,transparent 0 39px,rgba(6,56,26,.05) 40px);content:"";inset:0;pointer-events:none;position:absolute}.bw-wib-shell>*{position:relative;z-index:1}' +
        '.bw-wib-loading,.bw-wib-error{align-items:center;display:flex;flex-direction:column;justify-content:center;text-align:center}.bw-wib-loading p{color:var(--bw-muted);font-weight:800}.bw-wib-spinner{animation:bw-wib-spin .8s linear infinite;border:4px solid rgba(11,93,40,.18);border-radius:50%;border-top-color:var(--bw-green);height:34px;margin-bottom:14px;width:34px}@keyframes bw-wib-spin{to{transform:rotate(360deg)}}' +
        '.bw-wib-topline{align-items:center;color:var(--bw-green);display:flex;font-size:12px;font-weight:950;justify-content:space-between;letter-spacing:.08em;text-transform:uppercase}.bw-wib-sound{background:#fff;border:1px solid rgba(6,56,26,.2);border-radius:5px;color:var(--bw-green);cursor:pointer;font-size:11px;font-weight:950;letter-spacing:.04em;min-height:32px;padding:6px 10px;text-transform:uppercase}.bw-wib-sound[aria-pressed="true"]{background:var(--bw-green);border-color:var(--bw-green);color:#fff}' +
        '.bw-wib-kicker{color:var(--bw-red);font-size:13px;font-weight:950;letter-spacing:.09em;margin-top:30px!important;text-transform:uppercase}.bw-wib h2{color:var(--bw-forest);font-size:clamp(34px,6vw,62px);font-weight:950;letter-spacing:0;line-height:.94;margin-top:12px;max-width:690px}.bw-wib-lead{color:var(--bw-muted);font-size:clamp(17px,2vw,21px);font-weight:650;line-height:1.45;margin-top:16px!important;max-width:620px}' +
        '.bw-wib-intro{background:linear-gradient(145deg,#fbfbf6 0%,#f0f6de 100%)}.bw-wib-intro h2{max-width:600px}.bw-wib-intro-art{background:var(--bw-green);height:190px;margin:27px 0 24px;overflow:hidden;position:relative}.bw-wib-ring{border:2px solid rgba(255,255,255,.46);border-radius:50%;display:block;position:absolute}.bw-wib-ring-a{height:260px;right:-30px;top:-100px;width:260px}.bw-wib-ring-b{bottom:-100px;height:220px;left:8%;width:220px}.bw-wib-grid{background:repeating-linear-gradient(90deg,rgba(255,255,255,.16) 0 1px,transparent 1px 26px);inset:0;position:absolute}.bw-wib-map-word{bottom:11px;color:var(--bw-yellow);font-size:140px;font-weight:950;letter-spacing:0;line-height:.8;position:absolute;right:22px;text-shadow:6px 6px 0 rgba(0,0,0,.16)}.bw-wib-starts{display:flex;flex-wrap:wrap;gap:10px}.bw-wib-button{align-items:center;background:var(--bw-yellow);border:2px solid var(--bw-forest);border-radius:6px;box-shadow:4px 4px 0 var(--bw-forest);color:var(--bw-forest);cursor:pointer;display:inline-flex;font-size:15px;font-weight:950;justify-content:center;letter-spacing:0;line-height:1.15;min-height:52px;padding:12px 16px;text-align:center;text-decoration:none}.bw-wib-button:hover{filter:brightness(.98);transform:translate(1px,1px);box-shadow:3px 3px 0 var(--bw-forest)}.bw-wib-button:active{box-shadow:1px 1px 0 var(--bw-forest);transform:translate(3px,3px)}.bw-wib-button-ghost{background:#fff;border-color:rgba(6,56,26,.36);box-shadow:none;color:var(--bw-green)}.bw-wib-small{color:var(--bw-muted);font-size:13px;font-weight:650;line-height:1.45;margin-top:20px!important}.bw-wib-stamp-line{color:var(--bw-green);font-size:13px;font-weight:900;margin-top:9px!important}' +
        '.bw-wib-play{background:linear-gradient(180deg,#fff 0%,#f5f8e8 100%)}.bw-wib-progress{display:flex;gap:6px;margin:16px 0 0}.bw-wib-progress-dot{background:rgba(6,56,26,.14);height:6px;min-width:24px;flex:1}.bw-wib-progress-dot.is-on{background:var(--bw-yellow);box-shadow:inset 0 0 0 1px rgba(6,56,26,.18)}.bw-wib-play .bw-wib-kicker{margin-top:25px!important}.bw-wib-choices{display:grid;gap:13px;grid-template-columns:repeat(2,minmax(0,1fr));margin-top:28px}.bw-wib-choice{background:#fff;border:1px solid rgba(6,56,26,.2);cursor:pointer;min-height:248px;overflow:hidden;padding:0;text-align:left;transition:box-shadow .16s ease,transform .16s ease}.bw-wib-choice:hover{box-shadow:7px 7px 0 var(--bw-green);transform:translate(-2px,-2px)}.bw-wib-choice:focus-visible,.bw-wib-button:focus-visible,.bw-wib-sound:focus-visible,.bw-wib-text-button:focus-visible{outline:3px solid var(--bw-red);outline-offset:3px}.bw-wib-photo{background:linear-gradient(135deg,#174e2c,#a5c24b);display:block;height:145px;overflow:hidden}.bw-wib-photo img{display:block;height:100%;object-fit:cover;width:100%}.bw-wib-photo.is-missing{background:linear-gradient(130deg,var(--bw-green),var(--bw-lime))}.bw-wib-choice-text{display:block;padding:14px 14px 16px}.bw-wib-choice strong{color:var(--bw-forest);display:block;font-size:18px;font-weight:950;line-height:1.05}.bw-wib-choice small{color:var(--bw-muted);display:block;font-size:13px;font-weight:650;line-height:1.3;margin-top:7px}' +
        '.bw-wib-result{background:linear-gradient(150deg,#fbfbf6 0%,#fff 60%,#eff5de 100%)}.bw-wib-result .bw-wib-kicker{margin-top:24px!important}.bw-wib-result-head{align-items:end;display:flex;gap:20px;justify-content:space-between;margin-top:10px}.bw-wib-result h2{font-size:clamp(38px,6vw,66px);max-width:500px}.bw-wib-archetype{color:var(--bw-red);font-size:15px;font-weight:950;letter-spacing:.05em;margin-top:9px!important;text-transform:uppercase}.bw-wib-score{background:var(--bw-green);color:#fff;display:flex;flex:0 0 112px;flex-direction:column;min-height:106px;padding:16px 12px;text-align:center}.bw-wib-score b{color:var(--bw-yellow);font-size:32px;font-weight:950;line-height:1}.bw-wib-score span{font-size:12px;font-weight:900;letter-spacing:.07em;margin-top:7px;text-transform:uppercase}.bw-wib-poster{background:var(--bw-green);height:245px;margin-top:24px;overflow:hidden;position:relative}.bw-wib-poster:after{background:linear-gradient(90deg,rgba(6,56,26,.22),transparent);content:"";inset:0;pointer-events:none;position:absolute}.bw-wib-poster img{display:block;height:100%;object-fit:cover;width:100%}.bw-wib-poster.is-missing{background:linear-gradient(130deg,var(--bw-green),var(--bw-lime))}.bw-wib-reasons{display:grid;gap:8px;list-style:none;margin:20px 0 0;padding:0}.bw-wib-reasons li{background:#fff;border-left:4px solid var(--bw-yellow);color:var(--bw-forest);font-size:14px;font-weight:750;line-height:1.35;padding:10px 12px}.bw-wib-guide{border-top:1px solid rgba(6,56,26,.16);color:var(--bw-muted);font-size:15px;font-weight:650;line-height:1.5;margin-top:22px!important;padding-top:20px}.bw-wib-guide b{color:var(--bw-green)}.bw-wib-stamp-result{align-items:center;background:#edf6d4;border:1px solid rgba(11,93,40,.2);color:var(--bw-green);display:flex;font-size:13px;font-weight:800;gap:10px;line-height:1.3;margin-top:21px;padding:10px 12px}.bw-wib-stamp-mark{background:var(--bw-green);color:var(--bw-yellow);font-size:10px;font-weight:950;letter-spacing:.08em;padding:5px 7px;text-transform:uppercase}.bw-wib-result-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:21px}.bw-wib-share-status{color:var(--bw-green);font-size:13px;font-weight:850;min-height:18px;margin-top:12px!important}.bw-wib-text-button{background:transparent;border:0;color:var(--bw-green);cursor:pointer;font-size:14px;font-weight:900;margin-top:7px;padding:8px 0;text-decoration:underline}' +
        '.bw-wib-error h2{font-size:38px}.bw-wib-error p{color:var(--bw-muted);font-size:16px;line-height:1.45;margin:12px 0 22px!important}@media (max-width:560px){.bw-wib-shell{border-inline:0;box-shadow:none;min-height:590px;padding:22px 18px}.bw-wib h2{font-size:38px}.bw-wib-intro-art{height:160px}.bw-wib-map-word{font-size:120px}.bw-wib-choices{grid-template-columns:1fr}.bw-wib-choice{display:grid;grid-template-columns:132px minmax(0,1fr);min-height:132px}.bw-wib-photo{height:132px}.bw-wib-choice-text{align-self:center;padding:12px}.bw-wib-choice strong{font-size:17px}.bw-wib-result-head{align-items:flex-start;flex-direction:column}.bw-wib-score{flex-basis:auto;min-height:0;width:100%}.bw-wib-poster{height:220px}.bw-wib-result-actions .bw-wib-button{width:100%}.bw-wib-sound{font-size:10px}.bw-wib-topline{align-items:flex-start;gap:10px}.bw-wib-kicker{margin-top:24px!important}}';
    }
  }

  if (!customElements.get('bw-where-in-berlin')) {
    customElements.define('bw-where-in-berlin', BWWhereInBerlinElement);
  }
})();
