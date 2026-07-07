(function () {
  const SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : '';
  const BASE_URL = SCRIPT_URL ? new URL('../', SCRIPT_URL).toString() : 'https://fenerszymanski.github.io/berlinwalk-widgets/';
  const BUILD = 'day-survival-native-20260707a';
  const BOOK_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based?utm_source=day_survival&utm_medium=game&utm_campaign=berlinwalk_games&utm_content=result';

  const BUDGETS = [
    { id: 'hard', label: 'EUR 10', cents: 1000, note: 'Hard mode' },
    { id: 'normal', label: 'EUR 15', cents: 1500, note: 'Normal mode' },
    { id: 'comfort', label: 'EUR 20', cents: 2000, note: 'Comfort mode' }
  ];

  const ROUNDS = [
    {
      kicker: 'Morning move',
      title: 'It is 10:30. You skipped breakfast and Berlin has noticed.',
      note: 'First save?',
      choices: [
        { text: 'Supermarket bakery roll + banana', cents: -220, fuel: 20, smarts: 6 },
        { text: 'Sit-down cafe by a landmark', cents: -1180, fuel: 30, smarts: -8 },
        { text: 'Nothing. I am strong.', cents: 0, fuel: -22, smarts: -6 }
      ]
    },
    {
      kicker: 'Ticket machine',
      title: 'The station machine asks for zones and confidence.',
      note: 'You need to move around today.',
      choices: [
        { text: 'Buy the proper day ticket', cents: -1120, fuel: 3, smarts: 20 },
        { text: 'Single ticket and walk the rest', cents: -400, fuel: -6, smarts: 8 },
        { text: 'Guess and hope nobody checks', cents: 0, fuel: -10, smarts: -26 }
      ]
    },
    {
      kicker: 'Museum queue',
      title: 'A famous museum has a line that looks shorter from far away.',
      note: 'The city is testing your patience.',
      choices: [
        { text: 'Skip it and stay outside', cents: 0, fuel: 8, smarts: 18 },
        { text: 'Wait just five minutes', cents: 0, fuel: -18, smarts: -4 },
        { text: 'Buy a snack and rethink', cents: -350, fuel: 16, smarts: 8 }
      ]
    },
    {
      kicker: 'Small emergency',
      title: 'Your phone is at 19 percent and the map is hungry.',
      note: 'This is where tiny Berlin mistakes get expensive.',
      choices: [
        { text: 'Sit for coffee and charge', cents: -420, fuel: 10, smarts: 16 },
        { text: 'Keep walking with low battery', cents: 0, fuel: -12, smarts: -16 },
        { text: 'Buy a cheap cable', cents: -690, fuel: 2, smarts: 8 }
      ]
    },
    {
      kicker: 'Late afternoon',
      title: 'You are near the river, tired, and every terrace looks perfect.',
      note: 'One choice decides the evening.',
      choices: [
        { text: 'Spati drink by the water', cents: -280, fuel: 8, smarts: 14 },
        { text: 'Tourist terrace with a view', cents: -1380, fuel: 16, smarts: -10 },
        { text: 'Water refill and keep moving', cents: 0, fuel: -6, smarts: 10 }
      ]
    },
    {
      kicker: 'Last decision',
      title: 'You still need dinner and a way back.',
      note: 'Finish the day without making Berlin your accountant.',
      choices: [
        { text: 'Currywurst or falafel, then train', cents: -760, fuel: 22, smarts: 16 },
        { text: 'Restaurant near the landmark', cents: -1690, fuel: 28, smarts: -12 },
        { text: 'Late supermarket dinner', cents: -520, fuel: 12, smarts: 12 }
      ]
    }
  ];

  const ASSETS = {
    hero: new URL('berlin-day-survival/assets/hero/berlin-day-survival-hero.webp', BASE_URL).toString()
  };

  function money(cents) {
    const sign = cents < 0 ? '-' : '';
    const abs = Math.abs(cents);
    return `${sign}EUR ${(abs / 100).toFixed(abs % 100 ? 2 : 0)}`;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  class BWDaySurvivalLite extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      this.attachShadow({ mode: 'open' });
      this.state = {
        phase: 'start',
        budgetId: 'normal',
        wallet: 1500,
        fuel: 58,
        smarts: 54,
        round: 0,
        history: []
      };
      this.render();
    }

    budget() {
      return BUDGETS.find((item) => item.id === this.state.budgetId) || BUDGETS[1];
    }

    start() {
      const budget = this.budget();
      this.state.phase = 'play';
      this.state.wallet = budget.cents;
      this.state.fuel = 58;
      this.state.smarts = 54;
      this.state.round = 0;
      this.state.history = [];
      this.render();
    }

    choose(index) {
      const round = ROUNDS[this.state.round];
      const choice = round && round.choices[index];
      if (!choice) return;
      this.state.wallet += choice.cents;
      this.state.fuel = clamp(this.state.fuel + choice.fuel, 0, 100);
      this.state.smarts = clamp(this.state.smarts + choice.smarts, 0, 100);
      this.state.history.push({ round: round.kicker, choice: choice.text });
      if (this.state.round >= ROUNDS.length - 1 || this.state.wallet < -400 || this.state.fuel <= 0) {
        this.state.phase = 'result';
      } else {
        this.state.round += 1;
      }
      this.render();
    }

    result() {
      const failed = this.state.wallet < 0 || this.state.fuel <= 0;
      if (failed) {
        return {
          title: 'Budget bruised, lesson learned',
          tag: 'First-day rescue type',
          body: 'Berlin did not destroy you, but it did send a receipt. Next time, eat early, buy the right ticket, and protect your phone battery.'
        };
      }
      if (this.state.smarts >= 78) {
        return {
          title: 'Local instinct activated',
          tag: 'First-day survival type',
          body: 'You spent carefully, skipped the obvious traps, and still had enough energy to enjoy the city.'
        };
      }
      if (this.state.fuel < 35) {
        return {
          title: 'Tired but standing',
          tag: 'First-day survival type',
          body: 'You survived the day, but Berlin made you work for it. A slower route and one proper break would help.'
        };
      }
      return {
        title: 'Berlin day survivor',
        tag: 'First-day survival type',
        body: 'You made the small decisions that keep a Berlin day from becoming an expensive blur.'
      };
    }

    shareText() {
      const result = this.result();
      return `My Berlin Day Survival result is: ${result.title}. Play your own: https://www.berlinwalk.com/games/berlin-day-survival`;
    }

    copyResult() {
      const text = this.shareText();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
          .then(() => this.toast('Copied result'))
          .catch(() => this.toast(text));
      } else {
        this.toast(text);
      }
    }

    shareResult() {
      const text = this.shareText();
      if (navigator.share) {
        navigator.share({ title: 'Berlin Day Survival', text, url: 'https://www.berlinwalk.com/games/berlin-day-survival' }).catch(() => {});
      } else {
        this.copyResult();
      }
    }

    toast(message) {
      const el = this.shadowRoot.querySelector('[data-toast]');
      if (!el) return;
      el.textContent = message;
      el.hidden = false;
      window.clearTimeout(this.toastTimer);
      this.toastTimer = window.setTimeout(() => { el.hidden = true; }, 1800);
    }

    bind() {
      this.shadowRoot.querySelectorAll('[data-budget]').forEach((button) => {
        button.addEventListener('click', () => {
          this.state.budgetId = button.getAttribute('data-budget');
          this.render();
        });
      });
      const start = this.shadowRoot.querySelector('[data-start]');
      if (start) start.addEventListener('click', () => this.start());
      this.shadowRoot.querySelectorAll('[data-choice]').forEach((button) => {
        button.addEventListener('click', () => this.choose(Number(button.getAttribute('data-choice'))));
      });
      const again = this.shadowRoot.querySelector('[data-again]');
      if (again) again.addEventListener('click', () => { this.state.phase = 'start'; this.render(); });
      const copy = this.shadowRoot.querySelector('[data-copy]');
      if (copy) copy.addEventListener('click', () => this.copyResult());
      const share = this.shadowRoot.querySelector('[data-share]');
      if (share) share.addEventListener('click', () => this.shareResult());
    }

    styles() {
      return `
        :host{display:block;color:#073B16;font-family:"Bricolage Grotesque",Montserrat,Arial,sans-serif}
        *,*::before,*::after{box-sizing:border-box}
        button,a{font:inherit}
        .game{background:linear-gradient(90deg,rgba(27,94,32,.05) 1px,transparent 1px),linear-gradient(180deg,rgba(27,94,32,.05) 1px,transparent 1px),#FAFAF5;background-size:30px 30px;border:10px solid #073B16;border-radius:28px;box-shadow:12px 12px 0 #E63946;overflow:hidden;padding:14px;position:relative}
        .game::after{background:repeating-linear-gradient(90deg,#1B5E20 0 13px,#FFE600 13px 24px,#E63946 24px 31px,transparent 31px 41px);bottom:0;content:"";height:5px;left:0;position:absolute;right:0}
        .top{align-items:center;display:flex;gap:12px;justify-content:space-between;margin-bottom:12px}
        .brand{align-items:center;display:flex;font-family:"IBM Plex Mono","Courier New",monospace;font-size:10px;font-weight:800;gap:8px;text-transform:uppercase}
        .brand-badge{align-items:center;background:#FFE600;border-radius:50%;display:inline-flex;font-weight:950;height:30px;justify-content:center;width:30px}
        .sound{background:#fff;border:1px solid rgba(27,94,32,.22);border-radius:999px;color:#073B16;font-size:12px;font-weight:850;min-height:34px;padding:0 12px}
        .hero{background:#fff;border:2px solid rgba(27,94,32,.16);border-radius:8px;margin:0 0 14px;overflow:hidden}
        .hero img{display:block;height:auto;width:100%}
        .kicker{color:#1B5E20;font-family:"IBM Plex Mono","Courier New",monospace;font-size:12px;font-weight:900;letter-spacing:.04em;margin:0 0 6px;text-transform:uppercase}
        h1,h2{letter-spacing:0;margin:0}
        h1{font-size:clamp(34px,9vw,46px);font-weight:950;line-height:.96;margin-bottom:8px}
        h2{font-size:clamp(25px,7vw,34px);font-weight:950;line-height:1.02}
        p{color:#445246;font-size:15px;font-weight:750;line-height:1.35;margin:0}
        .budgets{display:grid;gap:8px;grid-template-columns:repeat(3,minmax(0,1fr));margin:14px 0}
        .budget,.choice,.primary,.secondary{appearance:none;border-radius:8px;cursor:pointer;text-align:left;-webkit-tap-highlight-color:transparent}
        .budget{background:#fff;border:2px solid rgba(27,94,32,.16);color:#073B16;min-height:74px;padding:10px}
        .budget[aria-pressed=true]{background:#FFE600;border-color:#073B16;box-shadow:0 0 0 2px #7CB342 inset}
        .budget strong{display:block;font-family:"IBM Plex Mono","Courier New",monospace;font-size:19px;line-height:1}
        .budget span{display:block;font-size:12px;font-weight:900;margin-top:6px}
        .actions,.result-actions{display:grid;gap:10px;grid-template-columns:1fr 1fr}
        .primary,.secondary{align-items:center;display:flex;font-weight:950;justify-content:center;min-height:52px;padding:12px 16px;text-align:center;text-decoration:none}
        .primary{background:#1B5E20;border:2px solid #1B5E20;color:#fff}
        .secondary{background:#fff;border:2px solid rgba(27,94,32,.22);color:#073B16}
        .meters{display:grid;gap:8px;grid-template-columns:repeat(3,minmax(0,1fr));margin-bottom:10px}
        .meter{background:#fff;border:1px solid rgba(27,94,32,.14);border-radius:8px;padding:9px}
        .meter small{color:#586258;display:block;font-family:"IBM Plex Mono","Courier New",monospace;font-size:10px;font-weight:900;text-transform:uppercase}
        .meter strong{display:block;font-family:"IBM Plex Mono","Courier New",monospace;font-size:18px;line-height:1.1;margin-top:4px;white-space:nowrap}
        .progress{background:#e7efe5;border-radius:999px;height:8px;margin:0 0 12px;overflow:hidden}
        .bar{background:linear-gradient(90deg,#FFE600,#7CB342,#1B5E20);height:100%}
        .round,.result{background:#fff;border:2px solid rgba(27,94,32,.16);border-radius:10px;display:grid;gap:12px;padding:12px}
        .note{background:rgba(255,230,0,.34);border:1px solid rgba(27,94,32,.16);border-radius:8px;color:#073B16;font-family:"IBM Plex Mono","Courier New",monospace;font-size:12px;font-weight:850;padding:10px}
        .choices{display:grid;gap:9px}
        .choice{align-items:center;background:#fff;border:2px solid rgba(27,94,32,.18);color:#073B16;display:grid;gap:8px;grid-template-columns:minmax(0,1fr) auto;min-height:58px;padding:12px}
        .choice:active,.choice:focus-visible{border-color:#073B16;outline:none}
        .choice strong{font-size:16px;line-height:1.15}
        .choice span{font-family:"IBM Plex Mono","Courier New",monospace;font-size:12px;font-weight:900;white-space:nowrap}
        .result h2{font-size:clamp(31px,8vw,42px)}
        .score{display:grid;gap:8px;grid-template-columns:repeat(3,minmax(0,1fr))}
        .toast{background:#073B16;border-radius:8px;bottom:14px;color:#fff;font-size:12px;font-weight:850;left:14px;padding:10px;position:fixed;right:14px;text-align:center;z-index:5}
        @media(max-width:440px){.game{border-width:8px;border-radius:24px;padding:10px}.budgets,.meters{gap:7px}.budget{min-height:70px;padding:9px}.budget strong{font-size:17px}.budget span{font-size:11px}.actions,.result-actions{grid-template-columns:1fr}.choice{min-height:56px}.score{grid-template-columns:1fr 1fr 1fr}}
      `;
    }

    renderStart() {
      const budget = this.budget();
      return `
        <figure class="hero"><img src="${ASSETS.hero}?v=${BUILD}" alt="Berlin Day Survival illustrated snack counter"></figure>
        <p class="kicker">Playable Berlin</p>
        <h1>Berlin Day Survival</h1>
        <p>Your budget is small. Berlin is hungry. Choose wisely.</p>
        <div class="budgets" role="group" aria-label="Choose your budget">
          ${BUDGETS.map((item) => `
            <button class="budget" type="button" data-budget="${item.id}" aria-pressed="${item.id === budget.id ? 'true' : 'false'}">
              <strong>${item.label}</strong>
              <span>${item.note}</span>
            </button>
          `).join('')}
        </div>
        <div class="actions">
          <button class="primary" type="button" data-start>Start the day</button>
          <a class="secondary" href="${BOOK_URL}">Walk Berlin with me</a>
        </div>
      `;
    }

    renderPlay() {
      const round = ROUNDS[this.state.round];
      const progress = Math.round((this.state.round / ROUNDS.length) * 100);
      return `
        <div class="meters" aria-label="Current status">
          <div class="meter"><small>Wallet</small><strong>${money(this.state.wallet)}</strong></div>
          <div class="meter"><small>Fuel</small><strong>${this.state.fuel}</strong></div>
          <div class="meter"><small>Smarts</small><strong>${this.state.smarts}</strong></div>
        </div>
        <div class="progress" aria-hidden="true"><div class="bar" style="width:${progress}%"></div></div>
        <section class="round" aria-labelledby="bw-day-round-title">
          <p class="kicker">${round.kicker}</p>
          <h2 id="bw-day-round-title">${round.title}</h2>
          <p class="note">${round.note}</p>
          <div class="choices">
            ${round.choices.map((choice, index) => `
              <button class="choice" type="button" data-choice="${index}">
                <strong>${choice.text}</strong>
                <span>${choice.cents ? money(choice.cents) : 'EUR 0'}</span>
              </button>
            `).join('')}
          </div>
        </section>
      `;
    }

    renderResult() {
      const result = this.result();
      return `
        <section class="result" aria-labelledby="bw-day-result-title">
          <p class="kicker">${result.tag}</p>
          <h2 id="bw-day-result-title">${result.title}</h2>
          <p>${result.body}</p>
          <div class="score" aria-label="Final score">
            <div class="meter"><small>Wallet</small><strong>${money(this.state.wallet)}</strong></div>
            <div class="meter"><small>Fuel</small><strong>${this.state.fuel}</strong></div>
            <div class="meter"><small>Smarts</small><strong>${this.state.smarts}</strong></div>
          </div>
          <div class="result-actions">
            <a class="primary" href="${BOOK_URL}">Walk Berlin with me</a>
            <button class="secondary" type="button" data-again>Play again</button>
            <button class="secondary" type="button" data-copy>Copy result</button>
            <button class="secondary" type="button" data-share>Share result</button>
          </div>
        </section>
      `;
    }

    render() {
      const body = this.state.phase === 'start' ? this.renderStart() : (this.state.phase === 'result' ? this.renderResult() : this.renderPlay());
      this.shadowRoot.innerHTML = `
        <style>${this.styles()}</style>
        <main class="game" aria-live="polite">
          <div class="top">
            <div class="brand"><span class="brand-badge">BW</span><span>BerlinWalk Games</span></div>
            <button class="sound" type="button" aria-label="Sound is off">Sound off</button>
          </div>
          ${body}
        </main>
        <div class="toast" data-toast hidden></div>
      `;
      this.bind();
    }
  }

  if (!customElements.get('bw-day-survival-lite')) {
    customElements.define('bw-day-survival-lite', BWDaySurvivalLite);
  }
})();
