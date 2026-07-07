/*
 * <bw-day-survival-v2> — Berlin Day Survival V2
 *
 * Self-contained custom element. Light DOM, instance-scoped state, no globals,
 * no iframe, no postMessage/resize, no MutationObserver, no external CSS/JS.
 * Grows in natural document flow. Mount with:
 *   <bw-day-survival-v2></bw-day-survival-v2>
 *   <script src=".../berlin-day-survival-v2/day-survival-v2-element.js" defer></script>
 *
 * Build marker: day-survival-v2-20260707
 */
(function () {
  'use strict';

  var BOOK_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
  var GAMES_URL = 'https://www.berlinwalk.com/games';
  var BUILD = 'day-survival-v2-20260707c';

  // Asset base. Default to the absolute GitHub Pages folder so images resolve
  // even when the element is mounted by a host (e.g. Wix) that loads this
  // script in a way where document.currentScript is null or proxied. A
  // per-instance data-asset-base attribute overrides it (used by the local
  // standalone preview to load images relatively).
  var ASSET_BASE = 'https://fenerszymanski.github.io/berlinwalk-widgets/berlin-day-survival-v2/';

  // ---- Budget modes --------------------------------------------------------
  var MODES = {
    'hard':    { euros: 10, label: 'Hard Mode',    cents: 1000, fuel: 58, smarts: 48, blurb: 'Ten euros for the whole day. Every choice counts.' },
    'normal':  { euros: 15, label: 'Normal Mode',  cents: 1500, fuel: 62, smarts: 52, blurb: 'Fifteen euros. Room for one good meal and a mistake.' },
    'comfort': { euros: 20, label: 'Comfort Mode', cents: 2000, fuel: 66, smarts: 54, blurb: 'Twenty euros. Comfortable, if you do not get greedy.' }
  };

  // ---- Conditions (one picked at random each game) -------------------------
  var CONDITIONS = [
    { id: 'first-day',      label: 'A normal first day',     intro: 'A normal first arrival. No excuses, no help. Just you, a small budget, and a hungry city.' },
    { id: 'late-arrival',   label: 'Late arrival',           intro: 'You landed late and skipped a real meal on the way in. You start the day already a little behind.', dFuel: -10 },
    { id: 'heatwave-walk',  label: 'Heatwave',               intro: 'A proper Berlin heatwave. Shade is rare and water suddenly matters much more than you planned for.', heat: true },
    { id: 'sunday-shops',   label: 'Sunday, shops shut',     intro: 'It is Sunday. The supermarkets are closed, so the cheap moves get harder and the kiosks know it.', sunday: true },
    { id: 'sunny-saturday', label: 'Warm Saturday',          intro: 'A warm Saturday. The terraces are full, the tourist menus look tempting, and the lines are long.', tempt: true },
    { id: 'rainy-museum-day', label: 'Grey and drizzly',     intro: 'Grey, drizzly, indoor kind of day. Sitting outside on a bench is less of a reward than usual.', wet: true }
  ];

  // ---- Rounds --------------------------------------------------------------
  // d = { w: cents delta, f: fuel delta, s: smarts delta }
  var ROUNDS = [
    {
      id: 'morning',
      kicker: 'Round 1 · Morning',
      title: 'You skipped breakfast',
      img: 'scene-morning.jpg',
      situation: 'It is 9am at Alexanderplatz. You skipped breakfast for an early train and your stomach already has opinions.',
      choices: [
        { id: 'm1', label: 'Supermarket roll + banana', micro: 'Look past the first shiny cafe', d: { w: -120, f: 14, s: 6 }, tags: ['budget', 'supermarket'],
          outcome: 'A bakery roll and a banana from the supermarket. Two euros, real food. Berlin quietly rewards people who walk past the first cafe with a view.' },
        { id: 'm2', label: 'Cafe flat white + croissant', micro: 'Right on the square', d: { w: -680, f: 10, s: -4 }, tags: ['tourist_trap'],
          outcome: 'Nearly seven euros for a croissant with a view of a tram. It photographs beautifully. Your wallet does not.' },
        { id: 'm3', label: 'Just a bakery coffee, push on', micro: 'Save the money, stay hungry', d: { w: -180, f: 5, s: 2 }, tags: ['budget'],
          outcome: 'Coffee only. You are saving money and slowly becoming a small problem for everyone standing near you.' }
      ]
    },
    {
      id: 'hydration',
      kicker: 'Round 2 · Hydration',
      title: 'Thirsty after the walk',
      img: 'scene-hydration.jpg',
      situation: 'An hour of walking later, the sun is out and you are thirsty. Berlin tap water is fine, but you did not bring a bottle.',
      choices: [
        { id: 'h1', label: 'Supermarket 1.5L water + Pfand', micro: 'The quiet local move', d: { w: -90, f: 10, s: 8 }, tags: ['smart', 'supermarket'],
          outcome: '1.5 litres for under a euro, and 25 cents back on the bottle later. This is the move locals make without even thinking.' },
        { id: 'h2', label: 'Cold bottle from the station kiosk', micro: 'Fast, cold, double the price', d: { w: -250, f: 8, s: 0 }, tags: ['spati'],
          outcome: 'Convenient and cold at double the price. Not a disaster, just a small tax on being in a hurry.' },
        { id: 'h3', label: 'Tough it out, refill later', micro: 'Free, slightly feral', d: { w: 0, f: -6, s: 3 }, tags: ['budget', 'nowater'],
          outcome: 'You are now rationing water in a European capital. Bold. A little feral, but bold.' }
      ]
    },
    {
      id: 'landmark',
      kicker: 'Round 3 · The famous square',
      title: 'Every menu is in six languages',
      img: 'scene-landmark.jpg',
      situation: 'You reach a famous square. Every restaurant has a laminated menu in six languages and a waiter waving you in.',
      choices: [
        { id: 'l1', label: 'Walk two blocks, eat local', micro: 'Distance from the monument = distance from the markup', d: { w: -350, f: 20, s: 12 }, tags: ['smart', 'doner'],
          outcome: 'Two blocks away the same doner is three euros cheaper and the crowd is local. You ate well and stayed sharp.' },
        { id: 'l2', label: 'Sit down on the square for the view', micro: 'The view is free, nothing else is', d: { w: -1400, f: 16, s: -8 }, tags: ['tourist_trap'],
          outcome: 'Fourteen euros for a tired schnitzel and a coke. The view was free. Everything on the plate was not.' },
        { id: 'l3', label: 'Pretzel from a stand, keep moving', micro: 'Not a meal, but momentum', d: { w: -300, f: 6, s: 4 }, tags: ['budget', 'spati'],
          outcome: 'A three euro pretzel and momentum. Not really a meal, but you are still solvent and still moving.' }
      ]
    },
    {
      id: 'lunch',
      kicker: 'Round 4 · Lunch',
      title: 'Your body wants a real meal',
      img: 'scene-lunch.jpg',
      situation: 'It is 2pm and you have been running on snacks. Your body wants a real meal. Your budget wants a nap.',
      choices: [
        { id: 'u1', label: 'Proper doner with everything', micro: 'The best value lunch in Berlin', d: { w: -650, f: 26, s: 6 }, tags: ['doner'],
          outcome: 'Six-fifty for a doner that could feed two. This is the single best value lunch in the city, and you just found it. Respect.' },
        { id: 'u2', label: 'Backshop sandwich + ayran', micro: 'Quiet, cheap, gets it done', d: { w: -420, f: 16, s: 5 }, tags: ['budget', 'supermarket'],
          outcome: 'A bakery sandwich and an ayran. Nobody writes home about it, but nobody goes broke either.' },
        { id: 'u3', label: 'Skip lunch, save the money', micro: 'You will regret this at 4pm', d: { w: 0, f: -12, s: -6 }, tags: ['budget'],
          outcome: 'You saved four euros and lost the afternoon. By 4pm you will negotiate with a vending machine like it owes you money.' }
      ]
    },
    {
      id: 'afternoon',
      kicker: 'Round 5 · The crash',
      title: 'Your feet are done',
      img: 'scene-afternoon.jpg',
      situation: 'Energy is low and your feet are finished. There is a bench, a Spaeti across the street, and a museum with a long queue.',
      choices: [
        { id: 'a1', label: 'Club Mate + bench reset', micro: 'The most Berlin thing you will do today', d: { w: -220, f: 12, s: 8 }, tags: ['spati', 'clubmate', 'outdoor'],
          outcome: 'A cold Club Mate on a bench, watching Berlin go past. Two euros of caffeine and self-respect. Perfect.' },
        { id: 'a2', label: 'Push on to one more sight', micro: 'Ignore the crash', d: { w: 0, f: -10, s: 2 }, tags: ['budget', 'outdoor'],
          outcome: 'You ignored the crash and kept walking. Your feet are now filing a formal complaint.' },
        { id: 'a3', label: 'Cafe sit-down with cake', micro: 'Comfortable and a little pricey', d: { w: -900, f: 14, s: -2 }, tags: ['tourist_trap'],
          outcome: 'Nine euros for cake and a chair. Expensive, yes, but honestly you earned the sit.' }
      ]
    },
    {
      id: 'night',
      kicker: 'Round 6 · Night',
      title: 'One last decision',
      img: 'scene-night.jpg',
      situation: 'It is late. You are tired, a little hungry, and your wallet has been through a lot today. One last call.',
      choices: [
        { id: 'n1', label: 'Late doner rescue, no shame', micro: 'The late doner never judges', d: { w: -600, f: 22, s: 6 }, tags: ['doner'],
          outcome: 'The late doner never judges. Six euros, warm, exactly what the day needed. You end strong.' },
        { id: 'n2', label: 'Spaeti noodles + Mate', micro: 'Dinner of champions, on a budget', d: { w: -350, f: 12, s: 4 }, tags: ['spati', 'clubmate', 'budget'],
          outcome: 'Instant noodles from the Spaeti and a Mate. Dinner of champions on a budget, and you still have coins left.' },
        { id: 'n3', label: 'Panic delivery to the hostel', micro: 'Deciding felt too hard', d: { w: -1500, f: 18, s: -6 }, tags: ['tourist_trap'],
          outcome: 'Fifteen euros of delivery because choosing felt like too much. Full, yes. Smart, no. Your wallet just fainted.' }
      ]
    }
  ];

  // ---- Result types --------------------------------------------------------
  var RESULTS = {
    busted:      { emoji: '💸', img: 'result-busted.jpg', title: 'Budget Busted', desc: 'You ran out of money before the day ran out of Berlin. It happens. The city is quietly expensive if you eat where the crowds are.', tip: 'Next time, eat one street back from the monument and let the supermarket carry your snacks.' },
    sunday:      { emoji: '🚫', img: 'result-sunday.jpg', title: 'Sunday Casualty', desc: 'The closed shops got you. On a Berlin Sunday the cheap moves vanish and the kiosks set the price.', tip: 'On Sundays, stock water and snacks on Saturday, or aim for a bakery and a doner shop, which do open.' },
    trap:        { emoji: '🪤', img: 'result-trap.jpg', title: 'Alexanderplatz Victim', desc: 'You paid the tourist tax more than once. The square menus love visitors exactly like today.', tip: 'The rule is simple: two blocks from any famous square, the same food is cheaper and the crowd is local.' },
    doner:       { emoji: '🌯', img: 'result-doner.jpg', title: 'Doner Loyalist', desc: 'When in doubt, doner. You built the whole day around the best value meal in the city, and honestly it worked.', tip: 'You already found Berlin’s cheat code. Now come learn the stories between the doner shops.' },
    clubmate:    { emoji: '🧉', img: 'result-clubmate.jpg', title: 'Club Mate Creature', desc: 'Caffeine, bench, repeat. You ran the day on Club Mate and stubbornness, which is a deeply Berlin way to survive.', tip: 'A Mate resets the feet, not the stomach. Pair it with real food and you are unstoppable.' },
    spati:       { emoji: '🏪', img: 'result-spati.jpg', title: 'Spaeti Strategist', desc: 'You let the Spaeti run your day: cheap, open late, always there. It is not glamorous, but you never went hungry or broke.', tip: 'The Spaeti is the local safety net. Learn which corner has one and the city gets a lot easier.' },
    saint:       { emoji: '😇', img: 'result-saint.jpg', title: 'Budget Saint', desc: 'You finished the day with money still in your pocket and food still in your stomach. Genuinely impressive restraint.', tip: 'You clearly do not need help saving money. Come spend the walk learning what you saved it for.' },
    fumes:       { emoji: '🌙', img: 'result-fumes.jpg', title: 'Late-Night Survivor', desc: 'You made it to the end, but mostly on fumes. Low battery, low snacks, still standing. Berlin respects that.', tip: 'You survived. Eat one proper meal earlier next time and the whole day feels twice as long.' },
    wanderer:    { emoji: '🧭', img: 'result-wanderer.jpg', title: 'Smart Wanderer', desc: 'Balanced, sensible, quietly good at this. You read the city, avoided the traps, and kept both wallet and energy intact.', tip: 'You already move like a local. Come see how deep the stories go under the streets you handled so well.' }
  };

  var CSS = [
    '.bw-dsv{--g:#1B5E20;--gd:#123f16;--y:#FFE600;--lime:#7CB342;--lg:#C5E1A5;--cream:#FAFAF5;--ink:#212121;--red:#E63946;',
    'box-sizing:border-box;display:block;width:100%;max-width:600px;margin:0 auto;padding:4px;',
    "font-family:'Montserrat','Avenir Next','Helvetica Neue',Arial,sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%;}",
    '.bw-dsv *{box-sizing:border-box;}',
    '.bw-dsv button{font-family:inherit;}',
    '.bw-dsv-card{background:linear-gradient(170deg,var(--g),var(--gd));border-radius:22px;padding:26px 22px;color:var(--cream);box-shadow:0 14px 34px rgba(18,63,22,.22);}',
    '.bw-dsv-screen{display:none;}',
    '.bw-dsv-screen.is-on{display:block;animation:bwdsvfade .28s ease;}',
    '@keyframes bwdsvfade{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:none;}}',
    '.bw-dsv-eyebrow{font-size:13px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:var(--y);margin:0 0 8px;}',
    '.bw-dsv-title{font-size:30px;font-weight:800;line-height:1.08;letter-spacing:-.5px;margin:0 0 10px;color:#fff;}',
    '.bw-dsv-sub{font-size:16px;line-height:1.5;color:var(--lg);margin:0 0 18px;}',
    '.bw-dsv-cond{display:inline-block;background:rgba(255,255,255,.1);border:1px solid rgba(197,225,165,.4);border-radius:999px;padding:7px 15px;font-size:13px;font-weight:700;color:var(--cream);margin-bottom:16px;}',
    '.bw-dsv-cond b{color:var(--y);}',
    '.bw-dsv-modes{display:flex;flex-direction:column;gap:12px;margin:6px 0 6px;}',
    '.bw-dsv-mode{display:flex;align-items:center;gap:14px;width:100%;text-align:left;background:rgba(255,255,255,.07);border:2px solid rgba(197,225,165,.32);color:var(--cream);border-radius:16px;padding:15px 16px;cursor:pointer;min-height:64px;transition:border-color .15s,background .15s,transform .05s;}',
    '.bw-dsv-mode:hover{border-color:var(--y);background:rgba(255,255,255,.12);}',
    '.bw-dsv-mode:active{transform:scale(.99);}',
    '.bw-dsv-mode-eur{flex:0 0 auto;width:58px;height:52px;border-radius:12px;background:var(--y);color:var(--gd);font-weight:800;font-size:22px;display:flex;align-items:center;justify-content:center;}',
    '.bw-dsv-mode-txt{flex:1;}',
    '.bw-dsv-mode-name{font-size:17px;font-weight:800;color:#fff;}',
    '.bw-dsv-mode-blurb{font-size:13.5px;line-height:1.4;color:var(--lg);margin-top:2px;}',
    '.bw-dsv-foot{font-size:12.5px;color:var(--lg);margin-top:14px;text-align:center;opacity:.85;}',
    // counters
    '.bw-dsv-hud{display:flex;gap:10px;margin-bottom:16px;}',
    '.bw-dsv-stat{flex:1;background:rgba(0,0,0,.16);border-radius:14px;padding:10px 12px;}',
    '.bw-dsv-stat-k{font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:var(--lg);}',
    '.bw-dsv-stat-v{font-size:20px;font-weight:800;color:#fff;margin-top:2px;}',
    '.bw-dsv-stat-v.is-neg{color:var(--y);}',
    '.bw-dsv-bar{height:7px;border-radius:6px;background:rgba(255,255,255,.16);margin-top:7px;overflow:hidden;}',
    '.bw-dsv-bar-fill{height:100%;border-radius:6px;transition:width .5s ease;}',
    '.bw-dsv-bar-fill.fuel{background:linear-gradient(90deg,var(--lime),var(--y));}',
    '.bw-dsv-bar-fill.smarts{background:linear-gradient(90deg,var(--lg),#fff);}',
    '.bw-dsv-progress{display:flex;gap:5px;margin-bottom:14px;}',
    '.bw-dsv-seg{flex:1;height:5px;border-radius:4px;background:rgba(255,255,255,.18);}',
    '.bw-dsv-seg.on{background:var(--y);}',
    '.bw-dsv-scene{width:100%;aspect-ratio:16/9;border-radius:14px;overflow:hidden;margin:0 0 16px;background:#0d2b11;border:1px solid rgba(255,255,255,.10);}',
    '.bw-dsv-scene img{width:100%;height:100%;object-fit:cover;display:block;}',
    '.bw-dsv-situation{font-size:16.5px;line-height:1.5;color:var(--cream);margin:0 0 18px;}',
    '.bw-dsv-choices{display:flex;flex-direction:column;gap:11px;}',
    '.bw-dsv-choice{width:100%;text-align:left;background:var(--cream);border:2px solid transparent;color:var(--ink);border-radius:15px;padding:14px 16px;cursor:pointer;min-height:56px;transition:transform .05s,border-color .15s,box-shadow .15s;}',
    '.bw-dsv-choice:hover{border-color:var(--y);box-shadow:0 6px 16px rgba(0,0,0,.14);}',
    '.bw-dsv-choice:active{transform:scale(.99);}',
    '.bw-dsv-choice[disabled]{opacity:.5;cursor:default;}',
    '.bw-dsv-choice-l{display:block;font-size:16.5px;font-weight:800;color:var(--gd);line-height:1.25;}',
    '.bw-dsv-choice-m{display:block;font-size:13px;color:#4b5b4b;margin-top:4px;line-height:1.3;}',
    // outcome
    '.bw-dsv-outcome{background:rgba(0,0,0,.2);border-left:4px solid var(--y);border-radius:12px;padding:16px 16px;margin-top:4px;}',
    '.bw-dsv-outcome-line{font-size:15.5px;line-height:1.5;color:var(--cream);margin:0 0 12px;}',
    '.bw-dsv-deltas{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;}',
    '.bw-dsv-delta{font-size:13px;font-weight:800;padding:4px 10px;border-radius:999px;background:rgba(255,255,255,.12);color:#fff;}',
    '.bw-dsv-delta.up{color:#d7ffb0;}',
    '.bw-dsv-delta.down{color:#ffd7d7;}',
    // buttons
    '.bw-dsv-btn{display:block;width:100%;background:var(--y);color:var(--gd);border:none;border-radius:14px;padding:16px;font-size:17px;font-weight:800;cursor:pointer;min-height:52px;transition:transform .05s,filter .15s;text-align:center;text-decoration:none;box-sizing:border-box;}',
    '.bw-dsv-btn:hover{filter:brightness(1.03);}',
    '.bw-dsv-btn:active{transform:scale(.99);}',
    '.bw-dsv-btn.ghost{background:transparent;color:var(--cream);border:2px solid rgba(197,225,165,.5);}',
    '.bw-dsv-btn.link{background:transparent;color:var(--lg);border:none;text-decoration:underline;min-height:44px;font-size:15px;}',
    '.bw-dsv-btnrow{display:flex;flex-direction:column;gap:10px;margin-top:16px;}',
    // result
    '.bw-dsv-r-emoji{font-size:66px;line-height:1;text-align:center;margin:4px 0 6px;}',
    '.bw-dsv-r-photo{width:100%;aspect-ratio:16/9;border-radius:16px;overflow:hidden;margin:2px 0 14px;background:#0d2b11;border:1px solid rgba(255,255,255,.10);}',
    '.bw-dsv-r-photo img{width:100%;height:100%;object-fit:cover;display:block;}',
    '.bw-dsv-r-title{font-size:28px;font-weight:800;text-align:center;color:#fff;margin:0 0 10px;letter-spacing:-.5px;}',
    '.bw-dsv-r-desc{font-size:16px;line-height:1.55;color:var(--cream);text-align:center;margin:0 0 16px;}',
    '.bw-dsv-r-stats{display:flex;gap:10px;margin-bottom:16px;}',
    '.bw-dsv-r-stat{flex:1;text-align:center;background:rgba(0,0,0,.16);border-radius:14px;padding:12px 6px;}',
    '.bw-dsv-r-stat-v{font-size:19px;font-weight:800;color:var(--y);}',
    '.bw-dsv-r-stat-k{font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--lg);margin-top:3px;}',
    '.bw-dsv-r-tip{background:rgba(255,255,255,.08);border-radius:14px;padding:15px 16px;font-size:15px;line-height:1.5;color:var(--cream);margin-bottom:4px;}',
    '.bw-dsv-r-tip b{color:var(--y);}',
    '.bw-dsv-copied{text-align:center;font-size:13px;color:var(--y);font-weight:700;min-height:18px;margin-top:8px;}'
  ].join('');

  function clamp(n) { return Math.max(0, Math.min(100, n)); }
  function euro(cents) { return (cents < 0 ? '-' : '') + '€' + (Math.abs(cents) / 100).toFixed(2); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  // Apply the active condition to a base choice, returning adjusted copy.
  function adjustChoice(choice, cond) {
    var d = { w: choice.d.w, f: choice.d.f, s: choice.d.s };
    var label = choice.label;
    var t = choice.tags || [];
    if (cond.sunday && t.indexOf('supermarket') > -1) {
      // Supermarkets shut: the cheap move becomes a pricier kiosk fallback.
      d.w = Math.round(d.w * 1.8) - 40;
      d.s -= 2;
      label = label + ' — Sunday: shop shut, kiosk price';
    }
    if (cond.heat && t.indexOf('nowater') > -1) { d.f -= 8; }
    if (cond.tempt && t.indexOf('tourist_trap') > -1) { d.f += 3; }
    if (cond.wet && t.indexOf('outdoor') > -1) { d.f -= 3; }
    return { label: label, micro: choice.micro, d: d, tags: t, outcome: choice.outcome, id: choice.id };
  }

  function computeResult(st) {
    var tg = st.tags;
    var walletPct = st.wallet / st.startWallet;
    var supBudget = (tg.supermarket || 0) + (tg.budget || 0);
    if (st.wallet < 0) return RESULTS.busted;
    if (st.cond.sunday && st.fuel < 40) return RESULTS.sunday;
    if ((tg.tourist_trap || 0) >= 2) return RESULTS.trap;
    if ((tg.doner || 0) >= 2) return RESULTS.doner;
    if ((tg.clubmate || 0) >= 2) return RESULTS.clubmate;
    if ((tg.spati || 0) >= 3) return RESULTS.spati;
    if (walletPct >= 0.4 && supBudget >= 3) return RESULTS.saint;
    if (st.fuel < 28) return RESULTS.fumes;
    return RESULTS.wanderer;
  }

  var TAG = 'bw-day-survival-v2';

  var Proto = Object.create(HTMLElement.prototype);

  Proto.connectedCallback = function () {
    if (this._booted) return;
    this._booted = true;
    this._assetBase = this.getAttribute('data-asset-base') || ASSET_BASE;
    this.classList.add('bw-dsv');
    this.setAttribute('data-build', BUILD);
    this._injectCSS();
    this._renderStart();
  };

  Proto._injectCSS = function () {
    if (document.getElementById('bw-dsv-style')) return;
    var s = document.createElement('style');
    s.id = 'bw-dsv-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  };

  Proto._renderStart = function () {
    var cond = pick(CONDITIONS);
    this._pendingCond = cond;
    var modeHtml = '';
    ['hard', 'normal', 'comfort'].forEach(function (k) {
      var m = MODES[k];
      modeHtml +=
        '<button type="button" class="bw-dsv-mode" data-mode="' + k + '">' +
          '<span class="bw-dsv-mode-eur">€' + m.euros + '</span>' +
          '<span class="bw-dsv-mode-txt">' +
            '<span class="bw-dsv-mode-name">' + esc(m.label) + '</span>' +
            '<span class="bw-dsv-mode-blurb">' + esc(m.blurb) + '</span>' +
          '</span>' +
        '</button>';
    });
    this.innerHTML =
      '<div class="bw-dsv-card">' +
        '<div class="bw-dsv-screen is-on">' +
          '<p class="bw-dsv-eyebrow">Berlin Day Survival</p>' +
          '<h2 class="bw-dsv-title">Your budget is small.<br>Berlin is hungry.</h2>' +
          '<p class="bw-dsv-sub">Six real first-day decisions. Keep your wallet, your energy and your Berlin sense alive. Under a minute.</p>' +
          '<div class="bw-dsv-cond">Today: <b>' + esc(cond.label) + '</b></div>' +
          '<div class="bw-dsv-modes">' + modeHtml + '</div>' +
          '<p class="bw-dsv-foot">Pick your daily food budget to begin</p>' +
        '</div>' +
      '</div>';
    var self = this;
    this.querySelectorAll('[data-mode]').forEach(function (btn) {
      btn.addEventListener('click', function () { self._startGame(btn.getAttribute('data-mode')); });
    });
  };

  Proto._startGame = function (modeKey) {
    var m = MODES[modeKey];
    var cond = this._pendingCond || pick(CONDITIONS);
    this.state = {
      mode: modeKey,
      cond: cond,
      wallet: m.cents,
      startWallet: m.cents,
      fuel: clamp(m.fuel + (cond.dFuel || 0)),
      smarts: clamp(m.smarts + (cond.dSmarts || 0)),
      round: 0,
      tags: {}
    };
    this._renderRound();
  };

  Proto._hud = function () {
    var st = this.state;
    return '<div class="bw-dsv-hud">' +
        '<div class="bw-dsv-stat"><div class="bw-dsv-stat-k">Wallet</div><div class="bw-dsv-stat-v' + (st.wallet < 0 ? ' is-neg' : '') + '" data-hud="wallet">' + euro(st.wallet) + '</div></div>' +
        '<div class="bw-dsv-stat"><div class="bw-dsv-stat-k">Fuel</div><div class="bw-dsv-stat-v" data-hud="fuel">' + Math.round(st.fuel) + '</div><div class="bw-dsv-bar"><div class="bw-dsv-bar-fill fuel" data-bar="fuel" style="width:' + clamp(st.fuel) + '%"></div></div></div>' +
        '<div class="bw-dsv-stat"><div class="bw-dsv-stat-k">Smarts</div><div class="bw-dsv-stat-v" data-hud="smarts">' + Math.round(st.smarts) + '</div><div class="bw-dsv-bar"><div class="bw-dsv-bar-fill smarts" data-bar="smarts" style="width:' + clamp(st.smarts) + '%"></div></div></div>' +
      '</div>';
  };

  Proto._renderRound = function () {
    var st = this.state;
    var round = ROUNDS[st.round];
    var self = this;
    // condition-adjusted choices for this round
    this._activeChoices = round.choices.map(function (c) { return adjustChoice(c, st.cond); });

    var progress = '<div class="bw-dsv-progress">';
    for (var i = 0; i < ROUNDS.length; i++) {
      progress += '<div class="bw-dsv-seg' + (i <= st.round ? ' on' : '') + '"></div>';
    }
    progress += '</div>';

    var intro = (st.round === 0)
      ? '<p class="bw-dsv-situation" style="color:var(--lg);font-style:italic;">' + esc(st.cond.intro) + '</p>'
      : '';

    var choicesHtml = '<div class="bw-dsv-choices">';
    this._activeChoices.forEach(function (c, idx) {
      choicesHtml +=
        '<button type="button" class="bw-dsv-choice" data-choice="' + idx + '">' +
          '<span class="bw-dsv-choice-l">' + esc(c.label) + '</span>' +
          '<span class="bw-dsv-choice-m">' + esc(c.micro || '') + '</span>' +
        '</button>';
    });
    choicesHtml += '</div>';

    var sceneHtml = round.img
      ? '<div class="bw-dsv-scene" data-scene><img alt="" data-scene-img src="' + this._assetBase + 'assets/scenes/' + round.img + '"></div>'
      : '';

    this.innerHTML =
      '<div class="bw-dsv-card">' +
        '<div class="bw-dsv-screen is-on">' +
          this._hud() +
          progress +
          sceneHtml +
          '<p class="bw-dsv-eyebrow">' + esc(round.kicker) + '</p>' +
          '<h2 class="bw-dsv-title" style="font-size:24px;">' + esc(round.title) + '</h2>' +
          intro +
          '<p class="bw-dsv-situation">' + esc(round.situation) + '</p>' +
          choicesHtml +
        '</div>' +
      '</div>';

    this.querySelectorAll('[data-choice]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        self._pick(parseInt(btn.getAttribute('data-choice'), 10));
      });
    });
    var sImg = this.querySelector('[data-scene-img]');
    if (sImg) sImg.addEventListener('error', function () { var c = self.querySelector('[data-scene]'); if (c) c.style.display = 'none'; });
    // scroll the card into a comfortable spot on small screens
    try { this.scrollIntoView({ block: 'nearest' }); } catch (e) {}
  };

  Proto._pick = function (idx) {
    var st = this.state;
    var c = this._activeChoices[idx];
    // lock all choices
    this.querySelectorAll('[data-choice]').forEach(function (b) { b.setAttribute('disabled', 'disabled'); });

    // apply deltas
    st.wallet += c.d.w;
    st.fuel = clamp(st.fuel + c.d.f);
    st.smarts = clamp(st.smarts + c.d.s);
    (c.tags || []).forEach(function (t) { st.tags[t] = (st.tags[t] || 0) + 1; });

    // update HUD live
    var wv = this.querySelector('[data-hud="wallet"]');
    if (wv) { wv.textContent = euro(st.wallet); wv.classList.toggle('is-neg', st.wallet < 0); }
    var fv = this.querySelector('[data-hud="fuel"]'); if (fv) fv.textContent = Math.round(st.fuel);
    var sv = this.querySelector('[data-hud="smarts"]'); if (sv) sv.textContent = Math.round(st.smarts);
    var fb = this.querySelector('[data-bar="fuel"]'); if (fb) fb.style.width = clamp(st.fuel) + '%';
    var sb = this.querySelector('[data-bar="smarts"]'); if (sb) sb.style.width = clamp(st.smarts) + '%';

    // deltas chips
    function chip(label, v, unit) {
      if (!v) return '';
      var cls = v > 0 ? 'up' : 'down';
      var sign = v > 0 ? '+' : '';
      return '<span class="bw-dsv-delta ' + cls + '">' + label + ' ' + sign + v + (unit || '') + '</span>';
    }
    var chips = '';
    if (c.d.w) chips += '<span class="bw-dsv-delta ' + (c.d.w >= 0 ? 'up' : 'down') + '">Wallet ' + (c.d.w >= 0 ? '+' : '') + (c.d.w / 100).toFixed(2) + '€</span>';
    chips += chip('Fuel', c.d.f) + chip('Smarts', c.d.s);

    var isLast = st.round >= ROUNDS.length - 1;
    var self = this;
    var choicesWrap = this.querySelector('.bw-dsv-choices');
    var out = document.createElement('div');
    out.className = 'bw-dsv-outcome';
    out.innerHTML =
      '<p class="bw-dsv-outcome-line">' + esc(c.outcome) + '</p>' +
      '<div class="bw-dsv-deltas">' + chips + '</div>' +
      '<button type="button" class="bw-dsv-btn" data-next="1">' + (isLast ? 'See how you did' : 'Next decision') + '</button>';
    if (choicesWrap) choicesWrap.parentNode.replaceChild(out, choicesWrap);
    var nb = this.querySelector('[data-next]');
    if (nb) nb.addEventListener('click', function () {
      if (isLast) { self._renderResult(); }
      else { st.round += 1; self._renderRound(); }
    });
    try { out.scrollIntoView({ block: 'nearest' }); } catch (e) {}
  };

  Proto._renderResult = function () {
    var st = this.state;
    var r = computeResult(st);
    var shareText = 'Berlin Day Survival: I am a ' + r.title + '. Play free at berlinwalk.com/games';
    var heroHtml = r.img
      ? '<div class="bw-dsv-r-photo" data-rphoto><img alt="" data-rphoto-img src="' + this._assetBase + 'assets/results/' + r.img + '"></div>'
      : '<div class="bw-dsv-r-emoji">' + r.emoji + '</div>';
    this.innerHTML =
      '<div class="bw-dsv-card">' +
        '<div class="bw-dsv-screen is-on">' +
          heroHtml +
          '<h2 class="bw-dsv-r-title">' + esc(r.title) + '</h2>' +
          '<p class="bw-dsv-r-desc">' + esc(r.desc) + '</p>' +
          '<div class="bw-dsv-r-stats">' +
            '<div class="bw-dsv-r-stat"><div class="bw-dsv-r-stat-v">' + euro(st.wallet) + '</div><div class="bw-dsv-r-stat-k">Left</div></div>' +
            '<div class="bw-dsv-r-stat"><div class="bw-dsv-r-stat-v">' + Math.round(st.fuel) + '</div><div class="bw-dsv-r-stat-k">Fuel</div></div>' +
            '<div class="bw-dsv-r-stat"><div class="bw-dsv-r-stat-v">' + Math.round(st.smarts) + '</div><div class="bw-dsv-r-stat-k">Smarts</div></div>' +
          '</div>' +
          '<div class="bw-dsv-r-tip"><b>Local move:</b> ' + esc(r.tip) + '</div>' +
          '<div class="bw-dsv-btnrow">' +
            '<a class="bw-dsv-btn" href="' + BOOK_URL + '" target="_blank" rel="noopener">Walk Berlin with me, free</a>' +
            '<button type="button" class="bw-dsv-btn ghost" data-copy="1">Copy my result</button>' +
            '<button type="button" class="bw-dsv-btn link" data-again="1">Play again</button>' +
          '</div>' +
          '<div class="bw-dsv-copied" data-copied></div>' +
        '</div>' +
      '</div>';
    var self = this;
    var rImg = this.querySelector('[data-rphoto-img]');
    if (rImg) rImg.addEventListener('error', function () { var c = self.querySelector('[data-rphoto]'); if (c) c.style.display = 'none'; });
    var again = this.querySelector('[data-again]');
    if (again) again.addEventListener('click', function () { self._renderStart(); });
    var copy = this.querySelector('[data-copy]');
    if (copy) copy.addEventListener('click', function () {
      var note = self.querySelector('[data-copied]');
      function ok() { if (note) note.textContent = 'Copied. Paste it anywhere.'; }
      function fail() { if (note) note.textContent = shareText; }
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(shareText).then(ok, fail);
        } else { fail(); }
      } catch (e) { fail(); }
    });
    try { this.scrollIntoView({ block: 'nearest' }); } catch (e) {}
  };

  if (!customElements.get(TAG)) {
    try {
      var Cls = class extends HTMLElement {};
      Object.assign(Cls.prototype, Proto);
      customElements.define(TAG, Cls);
    } catch (e) {
      if (window && window.console) { console.warn('bw-day-survival-v2 define failed', e); }
    }
  }
})();
