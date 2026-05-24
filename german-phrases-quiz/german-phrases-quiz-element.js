const BWGPQ_BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';

const BWGPQ_QUESTIONS = [
  { q: "What does 'Entschuldigung' mean?",
    opts: ["Thank you", "Excuse me / I'm sorry", "Goodbye", "How are you?"],
    ans: 1 },
  { q: "How do you ask for the bill at a restaurant?",
    opts: ["Ein Bier, bitte", "Wo ist...?", "Die Rechnung, bitte", "Ich hätte gerne..."],
    ans: 2 },
  { q: "What does 'Rathaus' mean in English?",
    opts: ["Rat house", "City hall", "Old house", "Town square"],
    ans: 1 },
  { q: "How do you say 'One ticket, please'?",
    opts: ["Ein Wasser, bitte", "Eine Fahrkarte, bitte", "Die Speisekarte, bitte", "Einen Tisch, bitte"],
    ans: 1 },
  { q: "What does the German 'W' sound like in English?",
    opts: ["W as in 'water'", "V as in 'very'", "F as in 'fish'", "Silent"],
    ans: 1 },
  { q: "What does 'Brücke' mean?",
    opts: ["Brook", "Bridge", "Book", "Brick"],
    ans: 1 },
  { q: "Which phrase means 'Do you speak English?'",
    opts: ["Ich spreche Deutsch", "Sprechen Sie Englisch?", "Wie heißt du?", "Wo ist der Bahnhof?"],
    ans: 1 },
  { q: "What number do you call for an ambulance in Germany?",
    opts: ["911", "999", "112", "110"],
    ans: 2 },
  { q: "What does 'Platz' mean?",
    opts: ["Place to eat", "Square / plaza", "Palace", "Platform"],
    ans: 1 },
  { q: "'Bitte' can mean both ___ and ___.",
    opts: ["Yes and No", "Hello and Goodbye", "Please and You're welcome", "Sorry and Thank you"],
    ans: 2 }
];

const BWGPQ_LETTERS = ['A', 'B', 'C', 'D'];

const BWGPQ_TIERS = [
  { max: 3,  emoji: 'Getting oriented', msg: "Looks like you need a bit more study before your Berlin trip. Bookmark the phrases guide and come back." },
  { max: 6,  emoji: 'Good start', msg: "Not bad. You've got the basics down. A few more rounds and you'll be ordering confidently." },
  { max: 9,  emoji: 'Berlin ready', msg: "Impressive. You're well-prepared for Berlin. The locals will be pleasantly surprised." },
  { max: 10, emoji: 'Perfect score', msg: "Perfect score. You're basically ready to give walking tours yourself. But come on ours anyway." }
];

class BWGermanPhrasesQuizElement extends HTMLElement {
  connectedCallback() {
    this._render();
    this._bind();
  }

  _bind() {
    this.querySelectorAll('[data-bwgpq-start]').forEach((button) => {
      button.addEventListener('click', () => this._startQuiz());
    });
  }

  _startQuiz() {
    this._currentQ = 0;
    this._score = 0;
    this._answered = false;
    this._showScreen('bwgpq-screen-quiz');
    this._renderQuestion();
  }

  _showScreen(id) {
    this.querySelectorAll('.bwgpq-screen').forEach(s => s.classList.remove('bwgpq-active'));
    const t = this.querySelector('#' + id);
    if (t) t.classList.add('bwgpq-active');
  }

  _renderQuestion() {
    const q = BWGPQ_QUESTIONS[this._currentQ];
    const total = BWGPQ_QUESTIONS.length;
    this._answered = false;

    const counter = this.querySelector('[data-bwgpq-counter]');
    counter.textContent = 'Question ' + (this._currentQ + 1) + ' of ' + total;

    const scoreEl = this.querySelector('[data-bwgpq-score]');
    scoreEl.textContent = 'Score: ' + this._score + '/' + this._currentQ;

    const bar = this.querySelector('[data-bwgpq-bar-fill]');
    bar.style.width = (((this._currentQ + 1) / total) * 100) + '%';

    const qEl = this.querySelector('[data-bwgpq-question]');
    qEl.textContent = q.q;

    const opts = this.querySelector('[data-bwgpq-options]');
    opts.innerHTML = '';
    q.opts.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'bwgpq-opt';
      btn.innerHTML =
        '<span class="bwgpq-opt-letter">' + BWGPQ_LETTERS[i] + '</span>' +
        '<span class="bwgpq-opt-text"></span>';
      btn.querySelector('.bwgpq-opt-text').textContent = opt;
      btn.addEventListener('click', () => this._pick(i));
      opts.appendChild(btn);
    });

    const fb = this.querySelector('[data-bwgpq-feedback]');
    fb.className = 'bwgpq-feedback';
    fb.innerHTML = '';
  }

  _pick(idx) {
    if (this._answered) return;
    this._answered = true;

    const q = BWGPQ_QUESTIONS[this._currentQ];
    const correct = idx === q.ans;
    if (correct) this._score++;

    const btns = this.querySelectorAll('.bwgpq-opt');
    btns.forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.ans) {
        btn.classList.add('bwgpq-opt-correct');
        btn.querySelector('.bwgpq-opt-letter').textContent = '✓';
      } else if (i === idx && !correct) {
        btn.classList.add('bwgpq-opt-wrong');
        btn.querySelector('.bwgpq-opt-letter').textContent = '✗';
      } else {
        btn.classList.add('bwgpq-opt-dim');
      }
    });

    const fb = this.querySelector('[data-bwgpq-feedback]');
    if (correct) {
      fb.className = 'bwgpq-feedback bwgpq-feedback-correct';
      fb.textContent = 'Correct. Well done.';
    } else {
      fb.className = 'bwgpq-feedback bwgpq-feedback-wrong';
      fb.innerHTML = 'Not quite. The correct answer is: <strong>' + q.opts[q.ans] + '</strong>';
    }

    setTimeout(() => {
      this._currentQ++;
      if (this._currentQ >= BWGPQ_QUESTIONS.length) {
        this._showResult();
      } else {
        this._renderQuestion();
      }
    }, 1800);
  }

  _showResult() {
    this._showScreen('bwgpq-screen-result');
    const tier = BWGPQ_TIERS.find(t => this._score <= t.max);
    this.querySelector('[data-bwgpq-emoji]').textContent = tier.emoji;
    this.querySelector('[data-bwgpq-final-score]').textContent = this._score + ' / ' + BWGPQ_QUESTIONS.length;
    this.querySelector('[data-bwgpq-result-msg]').textContent = tier.msg;
  }

  _render() {
    this.innerHTML = `
<style>
bw-german-phrases-quiz { display: block; width: 100%; }

.bwgpq-wrap {
  font-family: Montserrat, Arial, sans-serif;
  max-width: 860px;
  margin: 0 auto;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(27, 94, 32, 0.14);
  background: #FAFAF5;
  box-shadow: 0 18px 44px rgba(27, 94, 32, 0.10);
  box-sizing: border-box;
}
.bwgpq-wrap *, .bwgpq-wrap *::before, .bwgpq-wrap *::after { box-sizing: border-box; }
.bwgpq-wrap button, .bwgpq-wrap a { font-family: inherit; }
.bwgpq-wrap h1, .bwgpq-wrap h2, .bwgpq-wrap p { margin: 0; }

.bwgpq-head {
  background:
    radial-gradient(circle at 0% 0%, rgba(255, 230, 0, 0.16), transparent 34%),
    linear-gradient(135deg, #164a1a 0%, #1B5E20 70%, #2B6B2B 100%);
  padding: 26px 34px 24px;
  text-align: left;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 20px;
  align-items: center;
  min-height: 168px;
}
.bwgpq-head-kicker {
  font-size: 11px;
  font-weight: 900;
  color: #FFE600;
  letter-spacing: 2.2px;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.bwgpq-head h1 {
  font-size: clamp(28px, 4vw, 42px);
  line-height: 0.98;
  font-weight: 900;
  color: #fff;
  margin-bottom: 10px;
  max-width: 620px;
}
.bwgpq-head-sub {
  max-width: 520px;
  font-size: 15px;
  line-height: 1.45;
  font-weight: 600;
  color: rgba(250, 250, 245, 0.78);
}
.bwgpq-head-mark {
  width: 116px;
  height: 116px;
  border-radius: 50%;
  background: #FFE600;
  color: #1B5E20;
  display: grid;
  place-items: center;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.18);
}
.bwgpq-head-mark strong {
  display: block;
  font-size: 34px;
  line-height: 1;
  font-weight: 900;
  text-align: center;
}
.bwgpq-head-mark span {
  display: block;
  margin-top: 5px;
  font-size: 10px;
  line-height: 1;
  font-weight: 900;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  text-align: center;
}

.bwgpq-body {
  background: #fff;
  border-top: 5px solid #FFE600;
  padding: 0;
}

.bwgpq-screen { display: none; }
.bwgpq-screen.bwgpq-active { display: block; }
.bwgpq-screen#bwgpq-screen-quiz {
  padding: 34px;
}

@keyframes bwgpqFadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

/* ---- start screen ---- */
.bwgpq-start {
  animation: bwgpqFadeUp 0.4s ease;
  display: grid;
  grid-template-columns: 1.08fr 0.92fr;
  gap: 0;
  min-height: 232px;
}
.bwgpq-start-copy {
  padding: 34px 34px 36px;
}
.bwgpq-start-desc {
  font-size: 16px;
  color: #4E5A4E;
  line-height: 1.55;
  margin: 0 0 22px;
  max-width: 500px;
}
.bwgpq-start-points {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin: 0 0 24px;
}
.bwgpq-chip {
  border: 1px solid rgba(27, 94, 32, 0.12);
  border-radius: 8px;
  background: #FAFAF5;
  padding: 10px 11px;
  color: #1B5E20;
  font-size: 12px;
  font-weight: 850;
  line-height: 1.15;
}
.bwgpq-visual {
  background:
    linear-gradient(135deg, rgba(27, 94, 32, 0.98), rgba(22, 74, 26, 0.92)),
    repeating-linear-gradient(45deg, transparent 0 16px, rgba(255,255,255,.05) 16px 17px);
  color: #FAFAF5;
  padding: 30px 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bwgpq-phrase-card {
  width: 100%;
  max-width: 270px;
  border-radius: 8px;
  background: #FAFAF5;
  color: #212121;
  padding: 22px;
  box-shadow: 0 18px 40px rgba(0,0,0,.22);
  transform: rotate(-2deg);
}
.bwgpq-phrase-kicker {
  color: #7CB342;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 1.7px;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.bwgpq-phrase {
  color: #1B5E20;
  font-size: 26px;
  line-height: 1;
  font-weight: 900;
  margin-bottom: 10px;
}
.bwgpq-phrase-note {
  color: #4E5A4E;
  font-size: 13px;
  line-height: 1.45;
}
.bwgpq-btn-start {
  background: #1B5E20;
  color: #FFE600;
  border: none;
  border-radius: 8px;
  padding: 15px 24px;
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
  letter-spacing: 0.3px;
  transition: opacity 0.2s, transform 0.18s;
  -webkit-tap-highlight-color: transparent;
}
.bwgpq-btn-start:hover { opacity: 0.92; transform: translateY(-1px); }
.bwgpq-btn-start:active { transform: scale(0.97); }

/* ---- quiz screen ---- */
.bwgpq-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}
.bwgpq-counter {
  font-size: 12px;
  font-weight: 900;
  color: #1B5E20;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.bwgpq-score-label {
  font-size: 12px;
  font-weight: 800;
  color: #4E5A4E;
}

.bwgpq-bar-track {
  background: #EAF3DE;
  border-radius: 4px;
  height: 6px;
  margin-bottom: 22px;
  overflow: hidden;
}
.bwgpq-bar-fill {
  background: linear-gradient(90deg, #FFE600, #7CB342);
  height: 100%;
  border-radius: 4px;
  transition: width 0.4s ease;
}

.bwgpq-question {
  font-size: 24px;
  font-weight: 900;
  color: #1B5E20;
  line-height: 1.18;
  margin-bottom: 18px;
}

.bwgpq-options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.bwgpq-opt {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 68px;
  background: #FAFAF5;
  border: 1.5px solid #DCE8C8;
  border-radius: 8px;
  padding: 14px 15px;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  font-weight: 800;
  color: #212121;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.bwgpq-opt:hover:not(:disabled) { border-color: #7CB342; background: #FFFFFF; }
.bwgpq-opt:disabled { cursor: default; }

.bwgpq-opt-letter {
  flex: 0 0 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFFFFF;
  border: 1px solid rgba(27,94,32,.12);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #888;
  transition: background 0.15s, color 0.15s;
}

.bwgpq-opt-correct { border-color: #1B5E20; background: rgba(27,94,32,0.07); color: #1B5E20; }
.bwgpq-opt-correct .bwgpq-opt-letter { background: #1B5E20; color: #fff; }

.bwgpq-opt-wrong { border-color: #E63946; background: rgba(230,57,70,0.07); color: #E63946; }
.bwgpq-opt-wrong .bwgpq-opt-letter { background: #E63946; color: #fff; }

.bwgpq-opt-dim { border-color: #eee; color: #bbb; }
.bwgpq-opt-dim .bwgpq-opt-letter { color: #ccc; }

.bwgpq-feedback {
  margin-top: 12px;
  padding: 13px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.5;
  min-height: 0;
  display: block;
}
.bwgpq-feedback:empty { display: none; }
.bwgpq-feedback-correct { background: rgba(27,94,32,0.08); color: #1B5E20; }
.bwgpq-feedback-wrong { background: rgba(230,57,70,0.08); color: #E63946; }

/* ---- result screen ---- */
.bwgpq-result {
  text-align: center;
  animation: bwgpqFadeUp 0.45s ease;
  padding: 34px;
}
.bwgpq-result-emoji {
  display: inline-flex;
  margin: 0 0 12px;
  border-radius: 999px;
  background: #FFE600;
  color: #1B5E20;
  padding: 9px 13px;
  font-size: 11px;
  line-height: 1;
  font-weight: 900;
  letter-spacing: 1.4px;
  text-transform: uppercase;
}
.bwgpq-result-score {
  font-size: 32px;
  font-weight: 900;
  color: #1B5E20;
  margin-bottom: 4px;
}
.bwgpq-result-msg {
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto 20px;
}
.bwgpq-result-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}
.bwgpq-btn-book {
  background: #1B5E20;
  color: #FFE600;
  padding: 12px 22px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 900;
  transition: opacity 0.2s;
}
.bwgpq-btn-book:hover { opacity: 0.88; }
.bwgpq-btn-retry {
  background: #FFE600;
  color: #1B5E20;
  padding: 12px 22px;
  border-radius: 8px;
  border: none;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
  transition: opacity 0.2s;
  -webkit-tap-highlight-color: transparent;
}
.bwgpq-btn-retry:hover { opacity: 0.88; }

@media (max-width: 480px) {
  .bwgpq-head { padding: 20px 18px; grid-template-columns: 1fr; min-height: 0; }
  .bwgpq-head-mark { display: none; }
  .bwgpq-start { grid-template-columns: 1fr; }
  .bwgpq-start-copy { padding: 24px 18px; }
  .bwgpq-start-points { grid-template-columns: 1fr; }
  .bwgpq-visual { display: none; }
  .bwgpq-screen#bwgpq-screen-quiz { padding: 24px 18px; }
  .bwgpq-options { grid-template-columns: 1fr; }
  .bwgpq-opt { padding: 11px 12px; }
  .bwgpq-question { font-size: 20px; }
}
</style>

<div class="bwgpq-wrap">
  <div class="bwgpq-head">
    <div>
      <div class="bwgpq-head-kicker">Interactive quiz</div>
      <h1>How's Your Tourist German?</h1>
      <div class="bwgpq-head-sub">Ten practical phrases for restaurants, stations, signs, and small Berlin emergencies.</div>
    </div>
    <div class="bwgpq-head-mark" aria-hidden="true"><div><strong>10</strong><span>questions</span></div></div>
  </div>
  <div class="bwgpq-body">

    <div class="bwgpq-screen bwgpq-active" id="bwgpq-screen-start">
      <div class="bwgpq-start">
        <div class="bwgpq-start-copy">
          <p class="bwgpq-start-desc">From asking for the bill to reading street signs, test the German phrases every Berlin visitor actually needs.</p>
          <div class="bwgpq-start-points" aria-label="Quiz details">
            <span class="bwgpq-chip">No signup</span>
            <span class="bwgpq-chip">Instant feedback</span>
            <span class="bwgpq-chip">3 minutes</span>
          </div>
          <button class="bwgpq-btn-start" type="button" data-bwgpq-start>Start quiz -&gt;</button>
        </div>
        <div class="bwgpq-visual" aria-hidden="true">
          <div class="bwgpq-phrase-card">
            <p class="bwgpq-phrase-kicker">Try this first</p>
            <p class="bwgpq-phrase">Bitte?</p>
            <p class="bwgpq-phrase-note">One small word, several useful meanings. Very Berlin-trip efficient.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="bwgpq-screen" id="bwgpq-screen-quiz">
      <div class="bwgpq-meta">
        <span class="bwgpq-counter" data-bwgpq-counter></span>
        <span class="bwgpq-score-label" data-bwgpq-score></span>
      </div>
      <div class="bwgpq-bar-track">
        <div class="bwgpq-bar-fill" data-bwgpq-bar-fill style="width:10%"></div>
      </div>
      <div class="bwgpq-question" data-bwgpq-question></div>
      <div class="bwgpq-options" data-bwgpq-options></div>
      <div class="bwgpq-feedback" data-bwgpq-feedback></div>
    </div>

    <div class="bwgpq-screen" id="bwgpq-screen-result">
      <div class="bwgpq-result">
        <div class="bwgpq-result-emoji" data-bwgpq-emoji></div>
        <div class="bwgpq-result-score" data-bwgpq-final-score></div>
        <p class="bwgpq-result-msg" data-bwgpq-result-msg></p>
        <div class="bwgpq-result-actions">
          <a class="bwgpq-btn-book" href="${BWGPQ_BOOKING_URL}" target="_blank">Book your free tour -&gt;</a>
          <button class="bwgpq-btn-retry" type="button" data-bwgpq-start>Try again</button>
        </div>
      </div>
    </div>

  </div>
</div>
    `;
  }
}

if (!customElements.get('bw-german-phrases-quiz')) {
  customElements.define('bw-german-phrases-quiz', BWGermanPhrasesQuizElement);
}
