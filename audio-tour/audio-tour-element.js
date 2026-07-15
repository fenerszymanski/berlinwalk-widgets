// <bw-audio-tour> — free ~9-minute Berlin audio tour teaser by Yusuf
//
// Default audio: the live Wix-hosted MP3 (set as DEFAULT_AUDIO_SRC below).
// Override per-instance with the `audio-src` attribute if needed:
//   <bw-audio-tour audio-src="https://..."></bw-audio-tour>

(function () {
  if (typeof customElements === 'undefined' || customElements.get('bw-audio-tour')) return;

  // Chapter markers — derived from the real chapter durations after the
  // ElevenLabs run on 2026-07-15 (1-second silence inserted between each chapter).
  // Total: ~8:44. Keep these markers aligned whenever the narration is regenerated.
  const CHAPTERS = [
    { id: 'welcome',         t:    0, label: 'Welcome' },
    { id: 'world-clock',     t:   42, label: 'World Clock' },
    { id: 'tv-tower',        t:  104, label: 'TV Tower & the Pope’s Revenge' },
    { id: 'marienkirche',    t:  172, label: 'Marienkirche & Rotes Rathaus' },
    { id: 'nikolaiviertel',  t:  225, label: 'Nikolaiviertel' },
    { id: 'berliner-dom',    t:  275, label: 'Berliner Dom' },
    { id: 'lustgarten',      t:  341, label: 'Lustgarten & Altes Museum' },
    { id: 'museum-island',   t:  382, label: 'Museum Island & Pergamon' },
    { id: 'bode-walk',       t:  447, label: 'Bode Museum walk' },
    { id: 'outro',           t:  486, label: 'Book the tour' }
  ];

  const BOOK_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
  const DEFAULT_AUDIO_SRC = 'https://music.wixstatic.com/mp3/5a08a3_9eb16d58f6f14741aee87b164cdd6fec.mp3';

  function fmtTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) seconds = 0;
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ':' + (s < 10 ? '0' + s : s);
  }

  function track(name, detail) {
    try {
      if (typeof window.gtag === 'function') window.gtag('event', name, detail || {});
      if (Array.isArray(window.dataLayer)) window.dataLayer.push(Object.assign({ event: name }, detail || {}));
    } catch (e) { /* analytics is optional */ }
  }

  class BWAudioTourElement extends HTMLElement {
    connectedCallback() {
      if (this._inited) return;
      this._inited = true;

      const audioSrc = this.getAttribute('audio-src') || DEFAULT_AUDIO_SRC;
      this._audioSrc = audioSrc;
      this._currentChapterIdx = 0;
      this._duration = 524; // expected total seconds (~8:44); updated from real audio metadata on load

      this.innerHTML = this._render(audioSrc);
      this._wire();
    }

    _render(audioSrc) {
      const chapterList = CHAPTERS.map((c, i) => `
        <li class="at-chapter" data-idx="${i}" data-t="${c.t}">
          <span class="at-chapter-time">${fmtTime(c.t)}</span>
          <span class="at-chapter-label">${this._esc(c.label)}</span>
        </li>
      `).join('');

      return `
        <style>
          bw-audio-tour {
            --at-green: #1B5E20;
            --at-green-dark: #164a1a;
            --at-yellow: #FFE600;
            --at-lime: #7CB342;
            --at-border: #DCE8C8;
            --at-text: #212121;
            --at-muted: #4E5A4E;
            --at-cream: #FAFAF5;
            display: block;
            font-family: Montserrat, Arial, sans-serif;
            color: var(--at-text);
            margin: 28px 0;
            max-width: 100%;
          }
          bw-audio-tour * { box-sizing: border-box; }

          bw-audio-tour .at-wrap {
            border: 1px solid var(--at-border);
            border-radius: 14px;
            background: #FFFFFF;
            overflow: hidden;
            box-shadow: 0 4px 16px rgba(0,0,0,0.04);
          }

          bw-audio-tour .at-head {
            background: var(--at-green);
            padding: 14px 20px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          bw-audio-tour .at-kicker {
            color: var(--at-yellow);
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 2.5px;
            text-transform: uppercase;
          }
          bw-audio-tour .at-head-icon { font-size: 18px; line-height: 1; }

          bw-audio-tour .at-hero {
            padding: 22px 22px 16px;
            background: linear-gradient(180deg, #FAFAF5 0%, #FFFFFF 100%);
            border-bottom: 1px solid var(--at-border);
          }
          bw-audio-tour .at-title {
            font-size: 26px;
            font-weight: 900;
            color: var(--at-green);
            line-height: 1.15;
            margin: 0 0 6px;
          }
          bw-audio-tour .at-sub {
            font-size: 13.5px;
            color: var(--at-muted);
            line-height: 1.5;
            margin: 0;
          }

          /* Player */
          bw-audio-tour .at-player {
            display: grid;
            grid-template-columns: minmax(0, 1fr) minmax(260px, 0.55fr);
            gap: 0;
            background: var(--at-cream);
          }
          bw-audio-tour .at-controls {
            padding: 22px 22px 20px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            border-right: 1px solid var(--at-border);
          }
          bw-audio-tour .at-controls-row {
            display: flex;
            align-items: center;
            gap: 16px;
          }
          bw-audio-tour .at-play {
            width: 64px; height: 64px;
            border-radius: 50%;
            border: none;
            background: var(--at-green);
            color: var(--at-yellow);
            font-size: 26px;
            cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            transition: background .15s ease, transform .15s ease;
            flex-shrink: 0;
          }
          bw-audio-tour .at-play:hover { background: var(--at-green-dark); transform: scale(1.04); }
          bw-audio-tour .at-play:disabled { background: #C5E1A5; color: var(--at-green); cursor: not-allowed; transform: none; }
          bw-audio-tour .at-play .at-icon-pause { display: none; }
          bw-audio-tour .at-play.playing .at-icon-play { display: none; }
          bw-audio-tour .at-play.playing .at-icon-pause { display: block; }

          bw-audio-tour .at-now {
            flex: 1;
            min-width: 0;
          }
          bw-audio-tour .at-now-label {
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: var(--at-muted);
            margin-bottom: 4px;
          }
          bw-audio-tour .at-now-title {
            font-size: 16px;
            font-weight: 800;
            color: var(--at-green);
            line-height: 1.25;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          bw-audio-tour .at-times {
            font-size: 12px;
            color: var(--at-muted);
            font-variant-numeric: tabular-nums;
            font-weight: 700;
            margin-top: 2px;
          }

          bw-audio-tour .at-progress {
            position: relative;
            height: 6px;
            background: #E8EEDC;
            border-radius: 999px;
            cursor: pointer;
          }
          bw-audio-tour .at-progress-bar {
            position: absolute; inset: 0;
            background: linear-gradient(90deg, var(--at-green) 0%, var(--at-lime) 80%, var(--at-yellow) 100%);
            border-radius: 999px;
            width: 0%;
            transition: width 120ms linear;
          }
          bw-audio-tour .at-progress-thumb {
            position: absolute;
            top: 50%;
            transform: translate(-50%, -50%);
            left: 0%;
            width: 14px; height: 14px;
            border-radius: 50%;
            background: var(--at-yellow);
            border: 2px solid var(--at-green);
            box-shadow: 0 1px 4px rgba(0,0,0,0.15);
            pointer-events: none;
          }

          bw-audio-tour .at-hint {
            font-size: 11.5px;
            color: var(--at-muted);
            line-height: 1.45;
            margin: 0;
          }
          bw-audio-tour .at-hint b { color: var(--at-green); font-weight: 800; }

          /* Chapter list */
          bw-audio-tour .at-chapters {
            padding: 16px 18px;
            max-height: 340px;
            overflow-y: auto;
          }
          bw-audio-tour .at-chapters-label {
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: var(--at-green);
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
          }
          bw-audio-tour .at-chapters-label::before {
            content: ''; display: block; width: 4px; height: 18px;
            background: linear-gradient(to bottom, var(--at-yellow), var(--at-lime));
            border-radius: 2px;
          }
          bw-audio-tour ol.at-chapter-list {
            list-style: none;
            padding: 0; margin: 0;
            display: flex;
            flex-direction: column;
            gap: 2px;
          }
          bw-audio-tour .at-chapter {
            display: grid;
            grid-template-columns: 44px 1fr;
            gap: 8px;
            align-items: baseline;
            padding: 7px 9px;
            border-radius: 8px;
            cursor: pointer;
            transition: background .12s ease;
          }
          bw-audio-tour .at-chapter:hover { background: #F2F8E8; }
          bw-audio-tour .at-chapter.current { background: var(--at-green); }
          bw-audio-tour .at-chapter.current .at-chapter-time,
          bw-audio-tour .at-chapter.current .at-chapter-label { color: var(--at-yellow); font-weight: 800; }
          bw-audio-tour .at-chapter-time {
            font-size: 11px;
            font-weight: 800;
            color: var(--at-muted);
            font-variant-numeric: tabular-nums;
            letter-spacing: 0.3px;
          }
          bw-audio-tour .at-chapter-label {
            font-size: 12.5px;
            color: var(--at-text);
            line-height: 1.35;
            font-weight: 700;
          }

          /* CTA */
          bw-audio-tour .at-cta {
            padding: 16px 20px;
            background: linear-gradient(135deg, var(--at-yellow) 0%, var(--at-lime) 130%);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 14px;
          }
          bw-audio-tour .at-cta-text {
            font-size: 13.5px;
            font-weight: 800;
            color: var(--at-green-dark);
            line-height: 1.35;
          }
          bw-audio-tour .at-cta-text small {
            display: block;
            font-size: 11px;
            font-weight: 700;
            color: var(--at-green);
            letter-spacing: 0.4px;
            text-transform: uppercase;
            margin-bottom: 2px;
          }
          bw-audio-tour .at-cta-btn {
            display: inline-block;
            background: var(--at-green);
            color: var(--at-yellow);
            text-decoration: none;
            font-size: 12px;
            font-weight: 800;
            padding: 11px 18px;
            border-radius: 999px;
            letter-spacing: 0.6px;
            text-transform: uppercase;
            white-space: nowrap;
          }
          bw-audio-tour .at-cta-btn:hover { background: var(--at-green-dark); }

          bw-audio-tour .at-foot {
            padding: 10px 18px;
            background: #FAFAF5;
            border-top: 1px solid var(--at-border);
            font-size: 10.5px;
            color: var(--at-muted);
            text-align: center;
          }

          bw-audio-tour .at-error {
            background: #FFF6CC;
            color: #7A5A00;
            font-size: 12px;
            padding: 8px 14px;
            border-radius: 8px;
            margin-top: 8px;
            line-height: 1.4;
          }

          @media (max-width: 720px) {
            bw-audio-tour .at-title { font-size: 22px; }
            bw-audio-tour .at-player {
              grid-template-columns: 1fr;
            }
            bw-audio-tour .at-controls {
              border-right: none;
              border-bottom: 1px solid var(--at-border);
              padding: 18px 16px;
            }
            bw-audio-tour .at-chapters { padding: 14px 14px 18px; max-height: none; }
            bw-audio-tour .at-cta {
              flex-direction: column; align-items: stretch; text-align: center; padding: 14px;
            }
            bw-audio-tour .at-cta-btn { align-self: center; padding: 12px 22px; }
          }
        </style>

        <div class="at-wrap">
          <div class="at-head">
            <span class="at-head-icon" aria-hidden="true">🎧</span>
            <span class="at-kicker">Free Audio Preview · Written by Yusuf</span>
          </div>

          <div class="at-hero">
            <h3 class="at-title">Berlin in 9 Minutes</h3>
            <p class="at-sub">A short audio walk from Alexanderplatz to Hackescher Markt, written and checked by Yusuf, then narrated with BerlinWalk’s approved AI tour voice. Listen before you book.</p>
          </div>

          <div class="at-player">
            <div class="at-controls">
              <div class="at-controls-row">
                <button class="at-play" type="button" aria-label="Play audio" disabled>
                  <span class="at-icon-play" aria-hidden="true">▶</span>
                  <span class="at-icon-pause" aria-hidden="true">❚❚</span>
                </button>
                <div class="at-now">
                  <div class="at-now-label">Now playing</div>
                  <div class="at-now-title">${this._esc(CHAPTERS[0].label)}</div>
                  <div class="at-times"><span class="at-current">0:00</span> / <span class="at-total">8:44</span></div>
                </div>
              </div>

              <div class="at-progress" role="slider" tabindex="0" aria-label="Audio progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
                <div class="at-progress-bar"></div>
                <div class="at-progress-thumb"></div>
              </div>

              <p class="at-hint"><b>Tip:</b> tap any chapter on the right to jump straight to that stop. Headphones recommended.</p>
              <div class="at-error" hidden></div>
            </div>

            <aside class="at-chapters" aria-label="Chapters">
              <div class="at-chapters-label">9-minute walk · 10 chapters</div>
              <ol class="at-chapter-list">${chapterList}</ol>
            </aside>
          </div>

          <div class="at-cta">
            <div class="at-cta-text">
              <small>Liked what you heard?</small>
              Walk the rest with me. Free, tip-based, daily 11:30 at the World Clock.
            </div>
            <a class="at-cta-btn" href="${BOOK_URL}" target="_top" rel="noopener" data-at-cta="book">Book Free Tour →</a>
          </div>

          <div class="at-foot">Written and checked by Yusuf · AI-narrated · berlinwalk.com</div>
        </div>

        <audio class="at-audio" preload="metadata" src="${this._esc(audioSrc)}"></audio>
      `;
    }

    _wire() {
      const audio = this.querySelector('audio.at-audio');
      const playBtn = this.querySelector('.at-play');
      const bar = this.querySelector('.at-progress-bar');
      const thumb = this.querySelector('.at-progress-thumb');
      const track_ = this.querySelector('.at-progress');
      const currentEl = this.querySelector('.at-current');
      const totalEl = this.querySelector('.at-total');
      const nowTitle = this.querySelector('.at-now-title');
      const chapters = Array.from(this.querySelectorAll('.at-chapter'));
      const ctaBtn = this.querySelector('[data-at-cta="book"]');
      const errEl = this.querySelector('.at-error');

      let started = false;

      audio.addEventListener('loadedmetadata', () => {
        this._duration = isFinite(audio.duration) && audio.duration > 0 ? audio.duration : this._duration;
        totalEl.textContent = fmtTime(this._duration);
        playBtn.disabled = false;
        track_.setAttribute('aria-valuemax', String(Math.round(this._duration)));
      });

      audio.addEventListener('error', () => {
        playBtn.disabled = true;
        errEl.hidden = false;
        errEl.textContent = 'Audio is uploading — the chapter outline is below, and the full recording goes live shortly.';
      });

      audio.addEventListener('timeupdate', () => {
        const cur = audio.currentTime || 0;
        const pct = this._duration > 0 ? Math.min(100, (cur / this._duration) * 100) : 0;
        bar.style.width = pct + '%';
        thumb.style.left = pct + '%';
        currentEl.textContent = fmtTime(cur);
        track_.setAttribute('aria-valuenow', String(Math.round(cur)));

        // Update current chapter
        let idx = 0;
        for (let i = 0; i < CHAPTERS.length; i++) {
          if (cur >= CHAPTERS[i].t) idx = i;
        }
        if (idx !== this._currentChapterIdx) {
          this._currentChapterIdx = idx;
          nowTitle.textContent = CHAPTERS[idx].label;
          chapters.forEach((el, i) => el.classList.toggle('current', i === idx));
        }
      });

      audio.addEventListener('ended', () => {
        playBtn.classList.remove('playing');
        playBtn.setAttribute('aria-label', 'Play audio');
        track('bw_audio_finish', { widget: 'berlin-12-min' });
      });

      playBtn.addEventListener('click', () => {
        if (audio.paused) {
          audio.play().then(() => {
            playBtn.classList.add('playing');
            playBtn.setAttribute('aria-label', 'Pause audio');
            if (!started) { started = true; track('bw_audio_play', { widget: 'berlin-12-min' }); }
          }).catch(() => {
            errEl.hidden = false;
            errEl.textContent = 'Could not start playback. Tap again or check your connection.';
          });
        } else {
          audio.pause();
          playBtn.classList.remove('playing');
          playBtn.setAttribute('aria-label', 'Play audio');
        }
      });

      // Scrub on progress bar
      const seekFromEvent = (ev) => {
        const rect = track_.getBoundingClientRect();
        const x = (ev.clientX || (ev.touches && ev.touches[0]?.clientX) || 0) - rect.left;
        const pct = Math.max(0, Math.min(1, x / rect.width));
        if (this._duration > 0) audio.currentTime = pct * this._duration;
      };
      track_.addEventListener('click', seekFromEvent);
      track_.addEventListener('keydown', (ev) => {
        if (!this._duration) return;
        if (ev.key === 'ArrowRight') { audio.currentTime = Math.min(this._duration, (audio.currentTime || 0) + 10); ev.preventDefault(); }
        if (ev.key === 'ArrowLeft')  { audio.currentTime = Math.max(0, (audio.currentTime || 0) - 10); ev.preventDefault(); }
      });

      // Chapter clicks
      chapters.forEach((el) => {
        el.addEventListener('click', () => {
          const t = parseFloat(el.getAttribute('data-t')) || 0;
          const idx = parseInt(el.getAttribute('data-idx'), 10) || 0;
          audio.currentTime = t;
          if (audio.paused) {
            audio.play().then(() => {
              playBtn.classList.add('playing');
              playBtn.setAttribute('aria-label', 'Pause audio');
            }).catch(() => {});
          }
          track('bw_audio_chapter_jump', { widget: 'berlin-12-min', chapter: CHAPTERS[idx]?.id, t });
        });
      });

      // CTA tracking
      if (ctaBtn) {
        ctaBtn.addEventListener('click', () => {
          track('bw_audio_book_click', { widget: 'berlin-12-min', at: Math.round(audio.currentTime || 0) });
        });
      }
    }

    _esc(s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      }[c]));
    }
  }

  customElements.define('bw-audio-tour', BWAudioTourElement);
})();
