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
  { max: 3,  emoji: '😅', msg: "Looks like you need a bit more study before your Berlin trip! Bookmark the phrases guide and come back." },
  { max: 6,  emoji: '👍', msg: "Not bad! You've got the basics down. A few more rounds and you'll be ordering Schnitzel like a pro." },
  { max: 9,  emoji: '🎉', msg: "Impressive! You're well-prepared for Berlin. The locals will be pleasantly surprised." },
  { max: 10, emoji: '🏆', msg: "Perfect score! You're basically ready to give walking tours yourself. (But come on ours anyway!)" }
];

class BWGermanPhrasesQuizElement extends HTMLElement {
  connectedCallback() {
    this._render();
    this._bind();
  }

  _bind() {
    this.querySelector('[data-bwgpq-start]').addEventListener('click', () => this._startQuiz());
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
      fb.textContent = '✅ Correct! Well done.';
    } else {
      fb.className = 'bwgpq-feedback bwgpq-feedback-wrong';
      fb.innerHTML = '❌ Not quite. The correct answer is: <strong>' + q.opts[q.ans] + '</strong>';
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
  max-width: 600px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 16px rgba(0,0,0,0.10);
  box-sizing: border-box;
}
.bwgpq-wrap *, .bwgpq-wrap *::before, .bwgpq-wrap *::after { box-sizing: border-box; }
.bwgpq-wrap button, .bwgpq-wrap a { font-family: inherit; }
.bwgpq-wrap h1, .bwgpq-wrap h2, .bwgpq-wrap p { margin: 0; }

.bwgpq-head {
  background: #1B5E20;
  padding: 20px 24px;
  text-align: center;
}
.bwgpq-head-kicker {
  font-size: 11px;
  font-weight: 700;
  color: #FFE600;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.bwgpq-head h1 {
  font-size: 20px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 4px;
}
.bwgpq-head-sub {
  font-size: 13px;
  color: rgba(255,255,255,0.6);
}

.bwgpq-body {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-top: none;
  padding: 24px;
}

.bwgpq-screen { display: none; }
.bwgpq-screen.bwgpq-active { display: block; }

@keyframes bwgpqFadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

/* ---- start screen ---- */
.bwgpq-start {
  text-align: center;
  animation: bwgpqFadeUp 0.4s ease;
}
.bwgpq-start-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
}
.bwgpq-btn-start {
  background: #1B5E20;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 13px 28px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.3px;
  transition: opacity 0.2s;
  -webkit-tap-highlight-color: transparent;
}
.bwgpq-btn-start:hover { opacity: 0.88; }

/* ---- quiz screen ---- */
.bwgpq-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.bwgpq-counter {
  font-size: 12px;
  font-weight: 700;
  color: #7CB342;
}
.bwgpq-score-label {
  font-size: 12px;
  font-weight: 600;
  color: #999;
}

.bwgpq-bar-track {
  background: #e0e0e0;
  border-radius: 4px;
  height: 4px;
  margin-bottom: 16px;
  overflow: hidden;
}
.bwgpq-bar-fill {
  background: linear-gradient(90deg, #FFE600, #7CB342);
  height: 100%;
  border-radius: 4px;
  transition: width 0.4s ease;
}

.bwgpq-question {
  font-size: 16px;
  font-weight: 700;
  color: #1B5E20;
  line-height: 1.4;
  margin-bottom: 16px;
}

.bwgpq-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bwgpq-opt {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding: 13px 16px;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.bwgpq-opt:hover:not(:disabled) { border-color: #7CB342; }
.bwgpq-opt:disabled { cursor: default; }

.bwgpq-opt-letter {
  flex: 0 0 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
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
  padding: 12px 0 4px;
}
.bwgpq-result-emoji { font-size: 48px; margin-bottom: 10px; }
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
  color: #fff;
  padding: 12px 22px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 700;
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
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
  -webkit-tap-highlight-color: transparent;
}
.bwgpq-btn-retry:hover { opacity: 0.88; }

@media (max-width: 480px) {
  .bwgpq-body { padding: 18px 16px; }
  .bwgpq-head { padding: 16px 18px; }
  .bwgpq-opt { padding: 11px 12px; }
  .bwgpq-question { font-size: 15px; }
}
</style>

<div class="bwgpq-wrap">
  <div class="bwgpq-head">
    <div class="bwgpq-head-kicker">🧠 Interactive Quiz</div>
    <h1>How's Your Tourist German?</h1>
    <div class="bwgpq-head-sub">10 questions — See if you're ready for Berlin!</div>
  </div>
  <div class="bwgpq-body">

    <div class="bwgpq-screen bwgpq-active" id="bwgpq-screen-start">
      <div class="bwgpq-start">
        <p class="bwgpq-start-desc">From asking for the bill to reading street signs — test the German phrases every Berlin visitor needs.</p>
        <button class="bwgpq-btn-start" type="button" data-bwgpq-start>START QUIZ →</button>
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
          <a class="bwgpq-btn-book" href="${BWGPQ_BOOKING_URL}" target="_blank">Book Your Free Tour →</a>
          <button class="bwgpq-btn-retry" type="button" data-bwgpq-start>Try Again 🔄</button>
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
