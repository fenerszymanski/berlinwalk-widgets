const BW_QUIZ_BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';

const BW_QUIZ_QUESTIONS = [
  { q: 'Fastest way from BER Airport to city center?',
    options: ['FEX Airport Express (~23 min)', 'Airport bus to Rudow', 'Taxi (always fastest)', 'S-Bahn S9 (every 20 min)'],
    correct: 0, tag: '✈️ Airport',
    fact: 'The FEX departs every 15 min and reaches Hauptbahnhof in 23 minutes. An ABC ticket costs €5.' },
  { q: 'What should you wear on a Berlin walking tour?',
    options: ['Flip-flops in summer', 'High heels or dress shoes', "Doesn't matter — it's flat", 'Comfy shoes + layers'],
    correct: 3, tag: '👟 Clothing',
    fact: 'Our tour covers ~3km over cobblestones. Layers work best — Berlin mornings are cool even in summer.' },
  { q: 'Can you drink the tap water in Berlin?',
    options: ['Only if you boil it first', 'Yes — safe and high quality', 'No — buy bottled water', 'Only in hotels'],
    correct: 1, tag: '💧 Practical',
    fact: "Berlin's tap water meets strict EU standards. Bring a reusable bottle and save money!" },
  { q: 'Where does the Berlin TV Tower stand?',
    options: ['Brandenburg Gate', 'Checkpoint Charlie', 'Alexanderplatz', 'Potsdamer Platz'],
    correct: 2, tag: '📍 Stop 2',
    fact: 'The 368m TV Tower was built in the 1960s — and accidentally reflects a cross when the sun hits it.' },
  { q: 'Tip etiquette on a free walking tour?',
    options: ['Must tip at least €20', 'Fixed €5 fee', 'Tips not expected', "Tip what you feel it's worth"],
    correct: 3, tag: '💶 Tipping',
    fact: "Free tours are tip-based — no fixed price. Tip what the experience was worth. It's the guide's income!" },
  { q: 'What color is the Rotes Rathaus?',
    options: ['Red', 'Grey', 'White', 'Yellow'],
    correct: 0, tag: '📍 Stop 1',
    fact: "'Rotes Rathaus' = 'Red City Hall' — named for its red bricks from the 1860s, not politics." },
  { q: 'Which ticket from the airport to Berlin center?',
    options: ['Special airport ticket', 'Zone A', 'Zone AB', 'Zone ABC'],
    correct: 3, tag: '🎫 Transport',
    fact: 'BER is in Zone C — you need an ABC ticket (€5). Works on trains, U-Bahn, buses & trams.' },
  { q: 'Which Berlin island is UNESCO World Heritage?',
    options: ['Spree Island', 'Rabbit Island', 'Peacock Island', 'Museum Island'],
    correct: 3, tag: '📍 Stops 9–10',
    fact: 'Museum Island has five world-class museums — all on our walking tour route.' },
  { q: 'Order water at a Berlin restaurant — what comes?',
    options: ['No water served', 'Free tap water', 'Flavored water', 'Sparkling (ask for still)'],
    correct: 3, tag: '🍽️ Restaurant',
    fact: "Restaurants serve sparkling by default. Still = 'stilles Wasser.' Tap = 'Leitungswasser.'" },
  { q: "Medieval painting inside St. Mary's Church?",
    options: ['Portrait of Luther', 'Creation of Adam', 'The Last Supper', 'Dance of Death (Totentanz)'],
    correct: 3, tag: '📍 Stop 3',
    fact: "A 22-meter 'Dance of Death' fresco from 1484 — one of Europe's oldest. Entry is free!" },
  { q: 'What to avoid at Alexanderplatz?',
    options: ['Looking for TV Tower', 'Eating at square restaurants', 'Using the U-Bahn', 'Photos of World Clock'],
    correct: 1, tag: '⚠️ Tourist Trap',
    fact: 'Square restaurants = tourist traps. Walk 2 blocks for better food at half the price.' },
  { q: 'What was the Humboldt Forum before?',
    options: ['Church', 'Train station', 'GDR Palace of the Republic', 'Shopping mall'],
    correct: 2, tag: '📍 Stop 7',
    fact: 'Royal palace → ruin → GDR parliament → demolished → rebuilt. A €680M controversy.' },
  { q: 'Best time for a Berlin walking tour?',
    options: ['November', 'Only December', 'Jan–Feb', 'May–September'],
    correct: 3, tag: '📅 Planning',
    fact: 'May–Sep = best weather, long days, mild temps. Berlin at its most vibrant.' },
  { q: 'Which landmark rivals the Vatican?',
    options: ['Humboldt Forum', 'Berliner Dom', 'TV Tower', 'Rotes Rathaus'],
    correct: 1, tag: '📍 Stop 8',
    fact: "Kaiser Wilhelm II built Berliner Dom as a Protestant answer to St. Peter's Basilica." },
  { q: 'Can you pay by card everywhere in Berlin?',
    options: ['Only Apple Pay', 'Need German bank card', 'Cash is king in many places', 'Yes — everywhere'],
    correct: 2, tag: '💳 Money',
    fact: 'Many cafés, shops & vendors are cash-only. Always carry euros!' }
];

const BW_QUIZ_RESULT_TIERS = [
  { min: 0,  max: 4,  emoji: '🗺️', title: 'Berlin Newbie',     desc: 'No worries — our free tour teaches you everything! 12 stops, 800 years, plus all the practical tips.' },
  { min: 5,  max: 8,  emoji: '🎒', title: 'Curious Explorer',  desc: 'You know the basics! Our tour goes deeper — hidden stories and local insider tips.' },
  { min: 9,  max: 12, emoji: '🏛️', title: 'History Buff',      desc: 'Impressive! But do you know why Marx & Engels face west? Our tour goes beyond any guidebook.' },
  { min: 13, max: 15, emoji: '👑', title: 'Berlin Expert',     desc: 'Practically a local! Even experts learn something new. Come prove it in person.' }
];

const BW_QUIZ_LETTERS = ['A', 'B', 'C', 'D'];

class BWBerlinQuizElement extends HTMLElement {
  connectedCallback() {
    this._render();
    this._bind();
  }

  _bind() {
    const startBtn = this.querySelector('[data-bw-quiz-start]');
    const restartBtn = this.querySelector('[data-bw-quiz-restart]');
    const nextBtn = this.querySelector('[data-bw-quiz-next]');
    if (startBtn) startBtn.addEventListener('click', () => this._startQuiz());
    if (restartBtn) restartBtn.addEventListener('click', () => this._startQuiz());
    if (nextBtn) nextBtn.addEventListener('click', () => this._nextQuestion());
  }

  _showScreen(id) {
    this.querySelectorAll('.bw-quiz-screen').forEach((s) => s.classList.remove('bw-quiz-active'));
    const target = this.querySelector('#' + id);
    if (target) target.classList.add('bw-quiz-active');
  }

  _startQuiz() {
    this._currentQ = 0;
    this._score = 0;
    this._answered = false;
    this._showScreen('bw-quiz-screen-quiz');
    this._renderQuestion();
  }

  _renderQuestion() {
    const q = BW_QUIZ_QUESTIONS[this._currentQ];
    const total = BW_QUIZ_QUESTIONS.length;
    this.querySelector('[data-bw-quiz-counter]').textContent = (this._currentQ + 1) + '/' + total;
    this.querySelector('[data-bw-quiz-tag]').textContent = q.tag;
    this.querySelector('[data-bw-quiz-question]').textContent = q.q;

    const pb = this.querySelector('[data-bw-quiz-progress]');
    pb.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const seg = document.createElement('div');
      seg.className = 'bw-quiz-progress-seg' + (i < this._currentQ + 1 ? ' bw-quiz-progress-filled' : '');
      pb.appendChild(seg);
    }

    const options = this.querySelector('[data-bw-quiz-options]');
    options.innerHTML = '';
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'bw-quiz-option';
      btn.innerHTML = '<span class="bw-quiz-option-icon">' + BW_QUIZ_LETTERS[i] + '</span><span class="bw-quiz-option-label"></span>';
      btn.querySelector('.bw-quiz-option-label').textContent = opt;
      btn.addEventListener('click', () => this._pick(i));
      options.appendChild(btn);
    });

    this.querySelector('[data-bw-quiz-after]').classList.remove('bw-quiz-after-show');
    this._answered = false;
  }

  _pick(idx) {
    if (this._answered) return;
    this._answered = true;
    const q = BW_QUIZ_QUESTIONS[this._currentQ];
    const ok = idx === q.correct;
    if (ok) this._score++;

    this.querySelectorAll('.bw-quiz-option').forEach((btn, i) => {
      btn.classList.add('bw-quiz-locked');
      if (i === q.correct) {
        btn.classList.add('bw-quiz-correct');
        btn.querySelector('.bw-quiz-option-icon').textContent = '✓';
      } else if (i === idx && !ok) {
        btn.classList.add('bw-quiz-wrong');
        btn.querySelector('.bw-quiz-option-icon').textContent = '✗';
      } else {
        btn.classList.add('bw-quiz-hidden');
      }
    });

    const factLabel = this.querySelector('[data-bw-quiz-fact-label]');
    factLabel.className = 'bw-quiz-fact-label ' + (ok ? 'bw-quiz-fact-green' : 'bw-quiz-fact-red');
    factLabel.textContent = ok ? '✓ Correct!' : '✗ Not quite!';
    this.querySelector('[data-bw-quiz-fact-text]').textContent = q.fact;
    this.querySelector('[data-bw-quiz-next]').textContent =
      this._currentQ < BW_QUIZ_QUESTIONS.length - 1 ? 'NEXT →' : 'SEE MY RESULT →';
    this.querySelector('[data-bw-quiz-after]').classList.add('bw-quiz-after-show');
  }

  _nextQuestion() {
    if (this._currentQ < BW_QUIZ_QUESTIONS.length - 1) {
      this._currentQ++;
      this._renderQuestion();
      return;
    }
    const total = BW_QUIZ_QUESTIONS.length;
    const tier = BW_QUIZ_RESULT_TIERS.find((r) => this._score >= r.min && this._score <= r.max);
    const pct = Math.round((this._score / total) * 100);
    this.querySelector('[data-bw-quiz-result-emoji]').textContent = tier.emoji;
    this.querySelector('[data-bw-quiz-score-num]').textContent = this._score;
    this.querySelector('[data-bw-quiz-score-total]').textContent = '/' + total;
    const ring = this.querySelector('[data-bw-quiz-score-ring]');
    ring.className = 'bw-quiz-score-ring ' + (pct >= 60 ? 'bw-quiz-score-high' : pct >= 33 ? 'bw-quiz-score-mid' : 'bw-quiz-score-low');
    const title = this.querySelector('[data-bw-quiz-result-title]');
    title.innerHTML = '';
    title.appendChild(document.createTextNode("You're a "));
    const span = document.createElement('span');
    span.textContent = tier.title;
    title.appendChild(span);
    this.querySelector('[data-bw-quiz-result-desc]').textContent = tier.desc;
    this._showScreen('bw-quiz-screen-result');
  }

  _render() {
    this.innerHTML = `
      <style>
        bw-berlin-quiz {
          display: block;
          width: 100%;
        }

        .bw-quiz-section {
          background: linear-gradient(145deg, #1B5E20 0%, #0d3a12 60%, #091f0b 100%);
          box-sizing: border-box;
          color: #FFFFFF;
          font-family: Montserrat, Arial, sans-serif;
          margin: 0;
          overflow: hidden;
          padding: 48px 24px 40px;
          position: relative;
          width: 100%;
        }

        .bw-quiz-section *,
        .bw-quiz-section *::before,
        .bw-quiz-section *::after {
          box-sizing: border-box;
        }

        .bw-quiz-section h2,
        .bw-quiz-section p,
        .bw-quiz-section button {
          margin: 0;
        }

        .bw-quiz-bar {
          height: 4px;
          left: 0;
          position: absolute;
          right: 0;
          background: linear-gradient(90deg, #FFE600, #7CB342);
          z-index: 1;
        }
        .bw-quiz-bar-top { top: 0; }
        .bw-quiz-bar-bottom { bottom: 0; }

        .bw-quiz-inner {
          margin: 0 auto;
          max-width: 720px;
          min-width: 0;
          width: 100%;
        }

        .bw-quiz-screen {
          display: none;
        }
        .bw-quiz-screen.bw-quiz-active {
          display: block;
        }

        @keyframes bwQuizFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bwQuizFadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

        .bw-quiz-start-inner {
          animation: bwQuizFadeIn 0.5s ease;
          margin: 0 auto;
          max-width: 480px;
          min-width: 0;
          text-align: center;
          width: 100%;
        }

        .bw-quiz-badge {
          background: rgba(255, 230, 0, 0.12);
          border: 1px solid rgba(255, 230, 0, 0.25);
          border-radius: 24px;
          color: #FFE600;
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          margin-bottom: 18px;
          padding: 6px 16px;
          text-transform: uppercase;
        }

        .bw-quiz-start-inner h2 {
          color: #FFFFFF;
          font-size: 38px;
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 12px;
        }
        .bw-quiz-start-inner h2 span {
          color: #FFE600;
        }

        .bw-quiz-section .bw-quiz-start-desc {
          color: rgba(255, 255, 255, 0.55);
          font-size: 15px;
          line-height: 1.65;
          margin: 0 auto 46px;
          max-width: 480px;
          padding: 0 4px;
          text-align: center;
          text-wrap: balance;
        }

        .bw-quiz-btn-primary {
          background: #FFE600;
          border: 0;
          border-radius: 10px;
          box-shadow: 0 4px 24px rgba(255, 230, 0, 0.3);
          color: #1B5E20;
          cursor: pointer;
          font-family: inherit;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.5px;
          padding: 14px 34px;
          transition: transform 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .bw-quiz-btn-primary:hover { transform: translateY(-1px); }
        .bw-quiz-btn-primary:active { transform: scale(0.97); }

        .bw-quiz-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          justify-content: center;
          margin-top: 18px;
          max-width: 100%;
        }

        .bw-quiz-tag-pill {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.32);
          font-size: 10px;
          font-weight: 600;
          line-height: 1.2;
          padding: 4px 9px;
        }

        .bw-quiz-section .bw-quiz-watermark {
          color: rgba(255, 255, 255, 0.22);
          font-size: 11px;
          margin-top: 38px;
        }

        .bw-quiz-quiz-inner {
          animation: bwQuizFadeIn 0.4s ease;
          margin: 0 auto;
          max-width: 560px;
        }

        .bw-quiz-header-row {
          align-items: center;
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .bw-quiz-counter {
          color: #FFE600;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2px;
        }
        .bw-quiz-tag {
          background: rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 10px;
          font-weight: 700;
          padding: 3px 9px;
        }

        .bw-quiz-progress {
          display: flex;
          gap: 3px;
          margin-bottom: 16px;
          width: 100%;
        }
        .bw-quiz-progress-seg {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          flex: 1;
          height: 3px;
          transition: background 0.4s ease;
        }
        .bw-quiz-progress-filled {
          background: #FFE600;
        }

        .bw-quiz-question {
          color: #FFFFFF;
          font-size: 22px;
          font-weight: 800;
          line-height: 1.3;
          margin-bottom: 16px;
        }

        .bw-quiz-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .bw-quiz-option {
          align-items: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 10px;
          color: inherit;
          cursor: pointer;
          display: flex;
          font-family: inherit;
          gap: 12px;
          padding: 13px 16px;
          text-align: left;
          transition: background 0.3s ease, border-color 0.3s ease, transform 0.18s ease;
          width: 100%;
          -webkit-tap-highlight-color: transparent;
        }
        .bw-quiz-option:hover:not(.bw-quiz-locked) {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.18);
          transform: translateY(-1px);
        }
        .bw-quiz-option.bw-quiz-locked { cursor: default; }
        .bw-quiz-option.bw-quiz-hidden { display: none; }

        .bw-quiz-option-icon {
          align-items: center;
          background: rgba(255, 255, 255, 0.07);
          border-radius: 7px;
          color: rgba(255, 255, 255, 0.45);
          display: flex;
          flex: 0 0 30px;
          font-size: 12px;
          font-weight: 700;
          height: 30px;
          justify-content: center;
          transition: background 0.3s, color 0.3s;
          width: 30px;
        }

        .bw-quiz-option-label {
          color: rgba(255, 255, 255, 0.88);
          font-size: 14px;
          font-weight: 600;
          line-height: 1.3;
        }

        .bw-quiz-option.bw-quiz-correct {
          background: rgba(124, 179, 66, 0.15);
          border-color: #7CB342;
        }
        .bw-quiz-option.bw-quiz-correct .bw-quiz-option-icon {
          background: #7CB342;
          color: #FFFFFF;
        }
        .bw-quiz-option.bw-quiz-wrong {
          background: rgba(230, 57, 70, 0.12);
          border-color: #E63946;
        }
        .bw-quiz-option.bw-quiz-wrong .bw-quiz-option-icon {
          background: #E63946;
          color: #FFFFFF;
        }

        .bw-quiz-after {
          display: none;
          margin-top: 14px;
        }
        .bw-quiz-after.bw-quiz-after-show {
          animation: bwQuizFadeUp 0.4s ease;
          display: block;
        }

        .bw-quiz-fact-box {
          background: rgba(255, 230, 0, 0.06);
          border: 1px solid rgba(255, 230, 0, 0.15);
          border-radius: 10px;
          margin-bottom: 12px;
          padding: 12px 14px;
        }
        .bw-quiz-fact-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.5px;
          margin-bottom: 4px;
          text-transform: uppercase;
        }
        .bw-quiz-fact-green { color: #7CB342; }
        .bw-quiz-fact-red { color: #E63946; }
        .bw-quiz-fact-text {
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
          line-height: 1.55;
        }

        .bw-quiz-btn-next {
          background: #FFE600;
          border: 0;
          border-radius: 9px;
          box-shadow: 0 3px 16px rgba(255, 230, 0, 0.25);
          color: #1B5E20;
          cursor: pointer;
          display: block;
          font-family: inherit;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.5px;
          margin: 0 auto;
          padding: 12px 30px;
          transition: transform 0.18s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .bw-quiz-btn-next:hover { transform: translateY(-1px); }
        .bw-quiz-btn-next:active { transform: scale(0.97); }

        .bw-quiz-result-inner {
          animation: bwQuizFadeIn 0.5s ease;
          margin: 0 auto;
          max-width: 460px;
          text-align: center;
        }

        .bw-quiz-result-emoji {
          font-size: 44px;
          margin-bottom: 6px;
        }

        .bw-quiz-score-ring {
          align-items: center;
          background: rgba(255, 255, 255, 0.03);
          border: 3px solid #7CB342;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          height: 88px;
          justify-content: center;
          margin: 0 auto 14px;
          width: 88px;
        }
        .bw-quiz-score-low { border-color: #E63946; }
        .bw-quiz-score-mid { border-color: #FFE600; }
        .bw-quiz-score-high { border-color: #7CB342; }

        .bw-quiz-score-num {
          color: #FFE600;
          font-size: 26px;
          font-weight: 900;
          line-height: 1;
        }
        .bw-quiz-score-total {
          color: rgba(255, 255, 255, 0.35);
          font-size: 10px;
          font-weight: 600;
        }

        .bw-quiz-result-inner h2 {
          color: #FFFFFF;
          font-size: 28px;
          font-weight: 900;
          line-height: 1.15;
          margin-bottom: 8px;
        }
        .bw-quiz-result-inner h2 span {
          color: #FFE600;
        }

        .bw-quiz-section .bw-quiz-result-desc {
          color: rgba(255, 255, 255, 0.55);
          font-size: 13px;
          line-height: 1.6;
          margin: 0 auto 20px;
          max-width: 420px;
          text-align: center;
          text-wrap: balance;
        }

        .bw-quiz-btn-cta {
          background: #FFE600;
          border: 0;
          border-radius: 10px;
          box-shadow: 0 4px 24px rgba(255, 230, 0, 0.3);
          color: #1B5E20;
          cursor: pointer;
          display: inline-block;
          font-family: inherit;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
          padding: 13px 28px;
          text-decoration: none;
          transition: transform 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .bw-quiz-btn-cta:hover { transform: translateY(-1px); }
        .bw-quiz-btn-cta:active { transform: scale(0.97); }

        .bw-quiz-btn-restart {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          font-family: inherit;
          font-size: 11px;
          font-weight: 600;
          padding: 9px 18px;
          transition: color 0.2s ease, border-color 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .bw-quiz-btn-restart:hover {
          border-color: rgba(255, 255, 255, 0.25);
          color: rgba(255, 255, 255, 0.7);
        }

        @media (max-width: 600px) {
          .bw-quiz-section {
            padding: 34px 16px 30px;
          }
          .bw-quiz-badge {
            font-size: 10px;
            letter-spacing: 1.4px;
            margin-bottom: 14px;
            max-width: 100%;
            padding: 6px 13px;
          }
          .bw-quiz-start-inner h2 {
            font-size: 29px;
            margin-bottom: 10px;
          }
          .bw-quiz-section .bw-quiz-start-desc {
            font-size: 13px;
            line-height: 1.55;
            margin-bottom: 30px;
            max-width: 360px;
          }
          .bw-quiz-btn-primary,
          .bw-quiz-btn-cta {
            max-width: 100%;
            white-space: normal;
          }
          .bw-quiz-tags {
            display: grid;
            gap: 7px;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            margin: 18px auto 0;
            max-width: 310px;
          }
          .bw-quiz-tag-pill {
            align-items: center;
            display: flex;
            justify-content: center;
            min-height: 30px;
            padding: 5px 7px;
            text-align: center;
          }
          .bw-quiz-question {
            font-size: 18px;
          }
          .bw-quiz-option-label {
            font-size: 13px;
          }
          .bw-quiz-result-inner h2 {
            font-size: 24px;
          }
          .bw-quiz-section .bw-quiz-watermark {
            margin-top: 26px;
          }
        }

        @media (max-width: 380px) {
          .bw-quiz-section {
            padding-left: 12px;
            padding-right: 12px;
          }
          .bw-quiz-start-inner h2 {
            font-size: 27px;
          }
          .bw-quiz-badge {
            letter-spacing: 1px;
          }
          .bw-quiz-tags {
            max-width: 280px;
          }
          .bw-quiz-tag-pill {
            font-size: 9px;
          }
        }
      </style>

      <section class="bw-quiz-section">
        <div class="bw-quiz-bar bw-quiz-bar-top" aria-hidden="true"></div>

        <div class="bw-quiz-inner">
          <div class="bw-quiz-screen bw-quiz-active" id="bw-quiz-screen-start">
            <div class="bw-quiz-start-inner">
              <div class="bw-quiz-badge">★ 15 Questions · 3 Minutes</div>
              <h2>Are You Ready<br><span>for Berlin?</span></h2>
              <p class="bw-quiz-start-desc">From airport transfers to medieval history — test your Berlin knowledge before you visit.</p>
              <button class="bw-quiz-btn-primary" type="button" data-bw-quiz-start>START THE QUIZ →</button>
              <div class="bw-quiz-tags">
                <span class="bw-quiz-tag-pill">✈️ Airport</span>
                <span class="bw-quiz-tag-pill">👟 Clothing</span>
                <span class="bw-quiz-tag-pill">💶 Tipping</span>
                <span class="bw-quiz-tag-pill">🏛️ History</span>
                <span class="bw-quiz-tag-pill">🍽️ Food</span>
                <span class="bw-quiz-tag-pill">💳 Money</span>
              </div>
              <p class="bw-quiz-watermark">berlinwalk.com — Free Walking Tours</p>
            </div>
          </div>

          <div class="bw-quiz-screen" id="bw-quiz-screen-quiz">
            <div class="bw-quiz-quiz-inner">
              <div class="bw-quiz-header-row">
                <span class="bw-quiz-counter" data-bw-quiz-counter></span>
                <span class="bw-quiz-tag" data-bw-quiz-tag></span>
              </div>
              <div class="bw-quiz-progress" data-bw-quiz-progress></div>
              <div class="bw-quiz-question" data-bw-quiz-question></div>
              <div class="bw-quiz-options" data-bw-quiz-options></div>
              <div class="bw-quiz-after" data-bw-quiz-after>
                <div class="bw-quiz-fact-box">
                  <div class="bw-quiz-fact-label" data-bw-quiz-fact-label></div>
                  <div class="bw-quiz-fact-text" data-bw-quiz-fact-text></div>
                </div>
                <button class="bw-quiz-btn-next" type="button" data-bw-quiz-next>NEXT →</button>
              </div>
            </div>
          </div>

          <div class="bw-quiz-screen" id="bw-quiz-screen-result">
            <div class="bw-quiz-result-inner">
              <div class="bw-quiz-result-emoji" data-bw-quiz-result-emoji></div>
              <div class="bw-quiz-score-ring" data-bw-quiz-score-ring>
                <span class="bw-quiz-score-num" data-bw-quiz-score-num></span>
                <span class="bw-quiz-score-total" data-bw-quiz-score-total></span>
              </div>
              <h2 data-bw-quiz-result-title></h2>
              <p class="bw-quiz-result-desc" data-bw-quiz-result-desc></p>
              <a class="bw-quiz-btn-cta" href="${BW_QUIZ_BOOKING_URL}">BOOK YOUR FREE TOUR →</a>
              <br>
              <button class="bw-quiz-btn-restart" type="button" data-bw-quiz-restart>↺ Try Again</button>
              <p class="bw-quiz-watermark" style="margin-top:12px;">berlinwalk.com</p>
            </div>
          </div>
        </div>

        <div class="bw-quiz-bar bw-quiz-bar-bottom" aria-hidden="true"></div>
      </section>
    `;
  }
}

if (!customElements.get('bw-berlin-quiz')) {
  customElements.define('bw-berlin-quiz', BWBerlinQuizElement);
}
