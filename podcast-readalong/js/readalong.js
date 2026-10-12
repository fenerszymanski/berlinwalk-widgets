/* Read-along player for a Walk of Berlin podcast episode.
 *
 * Plays the episode's RSS enclosure in an HTML5 <audio> element. The transcript
 * (episodes/<slug>.json, ?ep=<slug>, default ghost-stations) follows
 * audio.currentTime: the phrase being spoken is bold and highlighted, the panel
 * keeps it in the upper third, and clicking a phrase or chapter seeks there.
 * If the audio cannot load, the transcript stays readable with links, no sync.
 * No console output.
 */
(function () {
  'use strict';

  var SPEEDS = [1, 1.25, 1.5];
  var FOLLOW_PAUSE_MS = 6000;
  var PROGRAMMATIC_SCROLL_MS = 900;
  var SKIP_SECONDS = 10;
  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  var root = document.getElementById('ra');
  var audio = document.getElementById('ra-audio');
  var playBtn = document.getElementById('ra-play');
  var nowEl = document.getElementById('ra-now');
  var totalEl = document.getElementById('ra-total');
  var speedBtn = document.getElementById('ra-speed');
  var progress = document.getElementById('ra-progress');
  var fillEl = document.getElementById('ra-fill');
  var knobEl = document.getElementById('ra-knob');
  var noteEl = document.getElementById('ra-note');
  var titleEl = document.getElementById('ra-title');
  var showEl = document.getElementById('ra-show');
  var artEl = document.getElementById('ra-art');
  var spotifyLink = document.getElementById('ra-spotify');
  var rssLink = document.getElementById('ra-rss');
  var chipsEl = document.getElementById('ra-chapters');
  var panel = document.getElementById('ra-panel');
  var textEl = document.getElementById('ra-text');
  var backBtn = document.getElementById('ra-back');

  var slug = new URLSearchParams(window.location.search).get('ep') || 'ghost-stations';
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) slug = 'ghost-stations';

  var D = null;            // transcript: title, audioUrl, show, chapters, phrases
  var phraseEls = [];
  var chipEls = [];
  var headEls = [];
  var cur = -1;            // index of the phrase being spoken
  var curChapter = -1;
  var speedIdx = 0;
  var rafId = 0;
  var lastSec = -1;
  var pausedUntil = 0;     // performance.now() until which auto-follow is paused
  var pauseTimer = 0;
  var progUntil = 0;       // scroll events before this time are ours
  var dragging = false;
  var dragTime = 0;
  var fallbackDone = false;

  function fmtTime(s) {
    var total = Math.max(0, Math.floor(s || 0));
    var h = Math.floor(total / 3600);
    var m = Math.floor((total % 3600) / 60);
    var sec = total % 60;
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    return h ? h + ':' + pad(m) + ':' + pad(sec) : m + ':' + pad(sec);
  }

  function duration() {
    if (isFinite(audio.duration) && audio.duration > 0) return audio.duration;
    return D ? D.duration : 0;
  }

  function chapterIndexAt(t) {
    var k = 0;
    for (var i = 0; i < D.chapters.length; i++) {
      if (D.chapters[i].t <= t + 1e-6) k = i;
    }
    return k;
  }

  function indexAt(t) {
    // Last phrase whose start is at or before t (binary search).
    var a = 0, b = D.phrases.length - 1, found = -1;
    while (a <= b) {
      var m = (a + b) >> 1;
      if (D.phrases[m].t0 <= t) { found = m; a = m + 1; } else { b = m - 1; }
    }
    return found;
  }

  function build() {
    titleEl.textContent = D.title;
    showEl.textContent = D.show.title + ' · ' + D.show.artist;
    document.title = D.title + ' | Walk of Berlin';
    artEl.src = D.cover;
    spotifyLink.href = D.show.spotifyUrl;
    rssLink.href = D.show.rssUrl;
    totalEl.textContent = fmtTime(D.duration);

    D.chapters.forEach(function (c, k) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'ra-chip';
      b.setAttribute('data-k', String(k));
      var time = document.createElement('span');
      time.className = 'ra-chip-time';
      time.textContent = fmtTime(c.t);
      var label = document.createElement('span');
      label.textContent = c.title;
      b.appendChild(time);
      b.appendChild(label);
      chipsEl.appendChild(b);
      chipEls.push(b);
    });

    var sec = null, para = null, curPara = null, lastChapter = -1;
    D.phrases.forEach(function (ph, i) {
      var k = chapterIndexAt(ph.t0);
      if (k !== lastChapter) {
        lastChapter = k;
        sec = document.createElement('section');
        sec.className = 'ra-chapter';
        var h = document.createElement('h3');
        h.id = 'ra-ch-' + k;
        var tm = document.createElement('span');
        tm.className = 'ra-ch-time';
        tm.textContent = fmtTime(D.chapters[k].t);
        h.appendChild(tm);
        h.appendChild(document.createTextNode(D.chapters[k].title));
        sec.appendChild(h);
        textEl.appendChild(sec);
        headEls[k] = h;
        para = null;
      }
      if (ph.para !== para) {
        para = ph.para;
        if (ph.kind === 'spot') {
          var brk = document.createElement('div');
          brk.className = 'ra-break';
          var label = document.createElement('span');
          label.className = 'ra-break-label';
          label.textContent = 'Break · read by Yusuf';
          brk.appendChild(label);
          sec.appendChild(brk);
        }
        curPara = document.createElement('p');
        curPara.className = 'ra-para' + (ph.kind === 'spot' ? ' ra-para--spot' : '');
        sec.appendChild(curPara);
      }
      var span = document.createElement('span');
      span.className = 'ra-phrase';
      span.setAttribute('data-i', String(i));
      span.setAttribute('role', 'button');
      span.tabIndex = 0;
      span.textContent = ph.display || ph.text;
      curPara.appendChild(span);
      curPara.appendChild(document.createTextNode(' '));
      phraseEls.push(span);
    });
  }

  // Highlight classes: spoken (plain), current (bold, yellow), upcoming (muted).
  function paint(k) {
    var el = phraseEls[k];
    if (!el) return;
    var cls = '';
    if (cur >= 0) {
      if (k === cur) cls = 'is-current';
      else if (k > cur) cls = 'is-upcoming';
    }
    el.className = 'ra-phrase' + (cls ? ' ' + cls : '');
    if (k === cur) el.setAttribute('aria-current', 'true');
    else el.removeAttribute('aria-current');
  }

  function markChapter(k) {
    if (k === curChapter) return;
    curChapter = k;
    chipEls.forEach(function (c, j) {
      if (j === k) {
        c.setAttribute('aria-current', 'true');
        chipsEl.scrollTo({ left: Math.max(0, c.offsetLeft - 16), behavior: reduceMotion ? 'auto' : 'smooth' });
      } else {
        c.removeAttribute('aria-current');
      }
    });
  }

  function programmatic(ms) {
    progUntil = performance.now() + (reduceMotion ? 150 : ms);
  }

  function followAllowed() {
    return !audio.paused && performance.now() >= pausedUntil;
  }

  function scrollToPhrase(i, force) {
    var el = phraseEls[i];
    if (!el) return;
    var pr = panel.getBoundingClientRect();
    var rel = el.getBoundingClientRect().top - pr.top;
    var h = panel.clientHeight;
    if (!force && rel >= h * 0.2 && rel <= h * 0.5) return; // already in the reading band
    var target = panel.scrollTop + rel - h / 3; // current phrase in the upper third
    programmatic(PROGRAMMATIC_SCROLL_MS);
    panel.scrollTo({ top: Math.max(0, target), behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  function scrollToChapter(k) {
    var h = headEls[k];
    if (!h) return;
    var pr = panel.getBoundingClientRect();
    var rel = h.getBoundingClientRect().top - pr.top;
    programmatic(PROGRAMMATIC_SCROLL_MS);
    panel.scrollTo({ top: Math.max(0, panel.scrollTop + rel - 12), behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  function setCurrent(i) {
    if (i === cur) return;
    var old = cur;
    cur = i;
    var lo = Math.max(0, Math.min(old, i));
    var hi = Math.max(old, i);
    for (var k = lo; k <= hi; k++) paint(k);
    if (cur >= 0) {
      markChapter(chapterIndexAt(D.phrases[cur].t0));
      if (followAllowed()) scrollToPhrase(cur, false);
    }
  }

  function showBackButton() {
    if (audio.paused || cur < 0) return;
    pausedUntil = performance.now() + FOLLOW_PAUSE_MS;
    backBtn.hidden = false;
    window.clearTimeout(pauseTimer);
    pauseTimer = window.setTimeout(function () { backBtn.hidden = true; }, FOLLOW_PAUSE_MS);
  }

  function updateTime(t) {
    var s = Math.floor(t);
    if (s !== lastSec) {
      lastSec = s;
      nowEl.textContent = fmtTime(t);
    }
  }

  function updateProgress(t) {
    var d = duration();
    var f = d > 0 ? Math.min(1, Math.max(0, t / d)) : 0;
    fillEl.style.width = (f * 100).toFixed(3) + '%';
    knobEl.style.left = (f * 100).toFixed(3) + '%';
    progress.setAttribute('aria-valuemax', String(Math.round(d)));
    progress.setAttribute('aria-valuenow', String(Math.round(t)));
    progress.setAttribute('aria-valuetext', fmtTime(t) + ' of ' + fmtTime(d));
  }

  // One place that reads the audio clock: highlight, chapter, time and bar.
  function render() {
    var t = audio.currentTime || 0;
    setCurrent(indexAt(t));
    updateTime(t);
    if (!dragging) updateProgress(t);
  }

  function loop() {
    rafId = 0;
    if (audio.paused || audio.ended) return;
    render();
    rafId = window.requestAnimationFrame(loop);
  }

  function startLoop() {
    if (!rafId && !audio.paused) rafId = window.requestAnimationFrame(loop);
  }

  function setPlayingUI(playing) {
    playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
    playBtn.querySelector('.ra-icon-play').hidden = playing;
    playBtn.querySelector('.ra-icon-pause').hidden = !playing;
  }

  function playNow() {
    var p = audio.play();
    if (p && typeof p.catch === 'function') {
      p.catch(function () { /* blocked until a tap: the play button shows the state */ });
    }
  }

  function setTime(t) {
    var d = duration();
    var target = d > 0 ? Math.min(Math.max(0, t), d - 0.05) : Math.max(0, t);
    audio.currentTime = target;
    render();
  }

  // Phrase or chapter click: seek there and play.
  function seekTo(t, afterSeek) {
    if (fallbackDone) return;
    pausedUntil = 0;
    backBtn.hidden = true;
    setTime(t);
    playNow();
    if (afterSeek) afterSeek(indexAt(audio.currentTime));
  }

  function onPhraseActivate(span) {
    var i = Number(span.getAttribute('data-i'));
    if (!D.phrases[i]) return;
    seekTo(D.phrases[i].t0, function (idx) { scrollToPhrase(idx, true); });
  }

  function onChapterActivate(k) {
    if (fallbackDone) {
      scrollToChapter(k);
      return;
    }
    // Seek to the chapter's first phrase, so the highlight and the chapter chip agree.
    var first = 0;
    while (first < D.phrases.length - 1 && D.phrases[first].t0 < D.chapters[k].t) first++;
    seekTo(D.phrases[first].t0, function () { markChapter(k); scrollToChapter(k); });
  }

  function fallback(reason) {
    if (fallbackDone) return;
    fallbackDone = true;
    root.classList.add('ra--static');
    playBtn.disabled = true;
    speedBtn.disabled = true;
    progress.removeAttribute('tabindex');
    progress.setAttribute('aria-disabled', 'true');
    noteEl.textContent = reason + ' The transcript stays here. Listen on Spotify or the RSS feed above.';
    noteEl.hidden = false;
    phraseEls.forEach(function (s) { s.removeAttribute('role'); s.removeAttribute('tabindex'); });
  }

  function setupMediaSession() {
    if (!('mediaSession' in navigator)) return;
    try {
      if (typeof MediaMetadata !== 'undefined') {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: D.title,
          artist: D.show.artist,
          album: D.show.title,
          artwork: [{ src: new URL(D.cover, window.location.href).href, sizes: '360x360', type: 'image/jpeg' }]
        });
      }
      var skip = function (sign) {
        return function (details) {
          var off = details && details.seekOffset ? details.seekOffset : SKIP_SECONDS;
          setTime(audio.currentTime + sign * off);
        };
      };
      navigator.mediaSession.setActionHandler('play', function () { playNow(); });
      navigator.mediaSession.setActionHandler('pause', function () { audio.pause(); });
      navigator.mediaSession.setActionHandler('seekbackward', skip(-1));
      navigator.mediaSession.setActionHandler('seekforward', skip(1));
      navigator.mediaSession.setActionHandler('seekto', function (details) {
        if (details && typeof details.seekTime === 'number') setTime(details.seekTime);
      });
    } catch (err) {
      /* Browser without some actions: the page still plays */
    }
  }

  function setSpeed(idx) {
    speedIdx = idx;
    audio.playbackRate = SPEEDS[speedIdx];
    var label = SPEEDS[speedIdx] === 1 ? '1×' : SPEEDS[speedIdx] + '×';
    speedBtn.textContent = label;
    speedBtn.setAttribute('aria-label', 'Playback speed ' + label);
  }

  function fracFromClientX(clientX) {
    var r = progress.getBoundingClientRect();
    return Math.min(1, Math.max(0, (clientX - r.left) / r.width));
  }

  function bindPlayer() {
    playBtn.addEventListener('click', function () {
      if (audio.paused) playNow(); else audio.pause();
    });
    speedBtn.addEventListener('click', function () {
      setSpeed((speedIdx + 1) % SPEEDS.length);
    });

    progress.addEventListener('pointerdown', function (e) {
      if (fallbackDone) return;
      dragging = true;
      progress.setPointerCapture(e.pointerId);
      dragTime = fracFromClientX(e.clientX) * duration();
      updateProgress(dragTime);
      updateTime(dragTime);
      e.preventDefault();
    });
    progress.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      dragTime = fracFromClientX(e.clientX) * duration();
      updateProgress(dragTime);
      updateTime(dragTime);
    });
    var endDrag = function () {
      if (!dragging) return;
      dragging = false;
      setTime(dragTime);
    };
    progress.addEventListener('pointerup', endDrag);
    progress.addEventListener('pointercancel', function () { dragging = false; render(); });

    progress.addEventListener('keydown', function (e) {
      if (fallbackDone) return;
      var t = audio.currentTime || 0;
      var handled = true;
      if (e.key === 'ArrowLeft') setTime(t - SKIP_SECONDS);
      else if (e.key === 'ArrowRight') setTime(t + SKIP_SECONDS);
      else if (e.key === 'Home') setTime(0);
      else if (e.key === 'End') setTime(duration());
      else handled = false;
      if (handled) e.preventDefault();
    });
  }

  function bindTranscript() {
    textEl.addEventListener('click', function (e) {
      var span = e.target.closest ? e.target.closest('.ra-phrase') : null;
      if (span) onPhraseActivate(span);
    });
    textEl.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var span = e.target.closest ? e.target.closest('.ra-phrase') : null;
      if (!span) return;
      e.preventDefault();
      onPhraseActivate(span);
    });
    chipsEl.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('.ra-chip') : null;
      if (b) onChapterActivate(Number(b.getAttribute('data-k')));
    });
    panel.addEventListener('scroll', function () {
      if (performance.now() < progUntil) return; // our own scroll
      showBackButton();
    }, { passive: true });
    panel.addEventListener('wheel', showBackButton, { passive: true });
    panel.addEventListener('touchmove', showBackButton, { passive: true });
    backBtn.addEventListener('click', function () {
      pausedUntil = 0;
      backBtn.hidden = true;
      window.clearTimeout(pauseTimer);
      if (cur >= 0) scrollToPhrase(cur, true);
    });
  }

  function bindAudio() {
    audio.addEventListener('loadedmetadata', function () {
      totalEl.textContent = fmtTime(duration());
      updateProgress(audio.currentTime || 0);
    });
    audio.addEventListener('timeupdate', render);
    audio.addEventListener('seeked', render);
    audio.addEventListener('play', function () {
      setPlayingUI(true);
      render();
      startLoop();
    });
    audio.addEventListener('pause', function () {
      setPlayingUI(false);
      backBtn.hidden = true;
      render();
    });
    audio.addEventListener('ended', function () {
      setPlayingUI(false);
      render();
    });
    audio.addEventListener('error', function () {
      fallback('The audio could not be loaded.');
    });
  }

  function start() {
    audio.preload = 'metadata';
    if (!audio.canPlayType || !audio.canPlayType('audio/mpeg')) {
      build();
      bindTranscript();
      fallback('This browser cannot play the episode here.');
      return;
    }
    audio.src = D.audioUrl;
    build();
    setSpeed(0);
    bindAudio();
    bindPlayer();
    bindTranscript();
    setupMediaSession();
    playBtn.disabled = false;
    speedBtn.disabled = false;
    updateProgress(0);
  }

  function load() {
    fetch('episodes/' + slug + '.json', { cache: 'no-cache' })
      .then(function (r) {
        if (!r.ok) throw new Error('transcript');
        return r.json();
      })
      .then(function (d) {
        D = d;
        start();
      })
      .catch(function () {
        titleEl.textContent = 'Transcript not available';
        showEl.textContent = '';
        noteEl.textContent = 'Check the link and try again.';
        noteEl.hidden = false;
      });
  }

  load();
})();
