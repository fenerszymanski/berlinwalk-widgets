/*
 * <bw-day-survival-landing-v2> — Berlin Day Survival landing surface
 *
 * Full landing page wrapper for the native Day Survival V2 game.
 * Mount with:
 *   <bw-day-survival-landing-v2></bw-day-survival-landing-v2>
 *   <script src=".../berlin-day-survival-v2/day-survival-landing-v2-element.js" defer></script>
 *
 * Build marker: day-survival-landing-v2-20260708a
 */
(function () {
  'use strict';

  var TAG = 'bw-day-survival-landing-v2';
  var BUILD = 'day-survival-landing-v2-20260708a';
  var SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : '';
  var BASE_URL = SCRIPT_URL && !/static\.wixstatic\.com/i.test(SCRIPT_URL)
    ? new URL('./', SCRIPT_URL).toString()
    : 'https://fenerszymanski.github.io/berlinwalk-widgets/berlin-day-survival-v2/';

  var BOOK_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based?utm_source=day_survival&utm_medium=game_landing&utm_campaign=berlinwalk_games&utm_content=book_cta';
  var GAMES_URL = 'https://www.berlinwalk.com/games?utm_source=day_survival&utm_medium=game_landing&utm_campaign=berlinwalk_games&utm_content=more_games';
  var FINAL_URL = 'https://www.berlinwalk.com/games/berlin-day-survival';
  var SEO = {
    title: 'Berlin Day Survival Game | Free Berlin Budget Game',
    description: 'Play Berlin Day Survival by BerlinWalk. Pick €10, €15 or €20, make six first-day Berlin choices, and see if your wallet and energy survive.',
    socialTitle: 'Berlin Day Survival Game',
    socialDescription: 'Can you get through one Berlin day on €10, €15 or €20 without the city eating your wallet first?',
    image: BASE_URL + 'assets/social/berlin-day-survival-v2-social-1200x630.jpg',
    imageAlt: 'Berlin Day Survival cover art showing a Berlin doner lunch counter'
  };

  var CSS = [
    '.bw-dslp{--green:#1B5E20;--green2:#0E3514;--yellow:#FFE600;--lime:#7CB342;--soft:#C5E1A5;--cream:#FAFAF5;--ink:#212121;--red:#E63946;',
    "display:block;width:100vw;max-width:100vw;margin:0 calc((100% - 100vw)/2);overflow:hidden;background:var(--cream);color:var(--ink);font-family:Montserrat,'Avenir Next','Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;text-size-adjust:100%;}",
    '.bw-dslp *{box-sizing:border-box}.bw-dslp a{color:inherit}.bw-dslp img{display:block;max-width:100%}',
    '.bw-dslp-wrap{width:min(1180px,calc(100vw - 36px));margin:0 auto}',
    '.bw-dslp-hero{position:relative;isolation:isolate;min-height:min(760px,88svh);padding:clamp(88px,9vw,128px) 0 clamp(34px,5vw,54px);background:linear-gradient(110deg,rgba(14,53,20,.96),rgba(27,94,32,.88) 52%,rgba(14,53,20,.94)),url("' + BASE_URL + 'assets/scenes/scene-lunch.jpg");background-size:cover;background-position:center;color:#fff}',
    '.bw-dslp-hero:before{content:"";position:absolute;inset:auto 0 0;height:38%;background:linear-gradient(180deg,rgba(250,250,245,0),var(--cream));z-index:-1}',
    '.bw-dslp-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(320px,520px);gap:clamp(24px,4vw,54px);align-items:start}',
    '.bw-dslp-copy{max-width:680px;padding-top:10px}.bw-dslp-kicker{display:inline-flex;align-items:center;min-height:32px;background:var(--yellow);color:var(--green2);font-size:12px;font-weight:900;letter-spacing:1.6px;text-transform:uppercase;padding:8px 12px;margin:0 0 16px}',
    '.bw-dslp h1{font-size:clamp(48px,7vw,96px);line-height:.9;letter-spacing:0;font-weight:950;margin:0 0 18px;color:#fff;text-wrap:balance}.bw-dslp-lead{font-size:clamp(18px,2vw,24px);line-height:1.45;font-weight:800;color:#F6FFE8;max-width:680px;margin:0 0 18px}',
    '.bw-dslp-note{font-size:16px;line-height:1.65;color:rgba(255,255,255,.86);font-weight:600;max-width:620px;margin:0 0 24px}',
    '.bw-dslp-actions{display:flex;flex-wrap:wrap;gap:12px;margin:0 0 22px}.bw-dslp-btn{display:inline-flex;align-items:center;justify-content:center;min-height:50px;border:2px solid transparent;border-radius:8px;padding:0 18px;font-size:15px;font-weight:900;text-decoration:none}.bw-dslp-btn.primary{background:var(--yellow);color:var(--green2)}.bw-dslp-btn.secondary{background:rgba(250,250,245,.08);border-color:rgba(255,230,0,.45);color:#fff}',
    '.bw-dslp-facts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;max-width:660px}.bw-dslp-fact{border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.09);padding:12px;border-radius:8px}.bw-dslp-fact b{display:block;color:var(--yellow);font-size:22px;line-height:1;font-weight:950}.bw-dslp-fact span{display:block;color:#F6FFE8;font-size:12px;font-weight:800;line-height:1.3;margin-top:6px;text-transform:uppercase}',
    '.bw-dslp-gameShell{position:relative}.bw-dslp-gameLabel{display:flex;justify-content:space-between;gap:12px;align-items:center;color:#fff;font-size:12px;font-weight:900;letter-spacing:1.2px;text-transform:uppercase;margin:0 0 10px}.bw-dslp-gameLabel span:last-child{color:var(--yellow)}',
    '.bw-dslp-game{background:rgba(250,250,245,.12);border:1px solid rgba(255,255,255,.22);padding:10px;border-radius:8px;box-shadow:0 22px 70px rgba(0,0,0,.26)}.bw-dslp-game bw-day-survival-v2{max-width:none;width:100%;padding:0}.bw-dslp-game .bw-dsv-card{border-radius:8px}',
    '.bw-dslp-scrollHint{display:block;margin:18px auto 0;color:rgba(14,53,20,.64);font-size:12px;font-weight:900;text-align:center;text-transform:uppercase;letter-spacing:1.4px}',
    '.bw-dslp-section{padding:clamp(54px,7vw,86px) 0}.bw-dslp-section.tight{padding-top:22px}.bw-dslp-section h2{color:var(--green2);font-size:clamp(32px,4.8vw,62px);font-weight:950;line-height:.98;margin:0 0 16px;letter-spacing:0}.bw-dslp-sectionLead{color:#4D5A4D;font-size:clamp(16px,1.5vw,20px);font-weight:700;line-height:1.6;max-width:760px;margin:0}',
    '.bw-dslp-lessons{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:30px}.bw-dslp-lesson{background:#fff;border:2px solid rgba(27,94,32,.18);border-radius:8px;overflow:hidden;box-shadow:0 16px 42px rgba(27,94,32,.08)}.bw-dslp-lesson img{width:100%;aspect-ratio:16/9;object-fit:cover}.bw-dslp-lesson div{padding:18px}.bw-dslp-lesson h3{font-size:20px;line-height:1.1;margin:0 0 8px;color:var(--green2);font-weight:950}.bw-dslp-lesson p{font-size:14px;line-height:1.55;margin:0;color:#4D5A4D;font-weight:650}',
    '.bw-dslp-flow{display:grid;grid-template-columns:1.05fr .95fr;gap:28px;align-items:center}.bw-dslp-steps{display:grid;gap:12px;margin:26px 0 0}.bw-dslp-step{display:grid;grid-template-columns:48px 1fr;gap:14px;align-items:start;background:#fff;border:2px solid rgba(27,94,32,.14);border-radius:8px;padding:14px}.bw-dslp-step b{display:flex;align-items:center;justify-content:center;width:48px;height:48px;background:var(--green);color:var(--yellow);border-radius:8px;font-size:18px}.bw-dslp-step h3{font-size:17px;margin:0 0 4px;color:var(--green2);font-weight:950}.bw-dslp-step p{font-size:14px;line-height:1.5;margin:0;color:#526052;font-weight:650}',
    '.bw-dslp-photoStack{display:grid;gap:12px}.bw-dslp-photoStack img{width:100%;border-radius:8px;object-fit:cover;border:2px solid rgba(27,94,32,.14)}.bw-dslp-photoStack img:first-child{aspect-ratio:16/10}.bw-dslp-photoRow{display:grid;grid-template-columns:1fr 1fr;gap:12px}.bw-dslp-photoRow img{aspect-ratio:1/1}',
    '.bw-dslp-final{background:linear-gradient(135deg,var(--green2),var(--green));color:#fff;padding:clamp(48px,6vw,78px) 0}.bw-dslp-finalBox{display:grid;grid-template-columns:1fr auto;gap:22px;align-items:center}.bw-dslp-final h2{color:#fff;margin:0 0 10px}.bw-dslp-final p{margin:0;color:#E8F6D8;font-size:17px;line-height:1.6;font-weight:700;max-width:720px}.bw-dslp-more{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}.bw-dslp-chip{display:inline-flex;align-items:center;min-height:42px;border:1px solid rgba(255,230,0,.44);border-radius:8px;padding:0 12px;text-decoration:none;font-size:13px;font-weight:900;color:#fff;background:rgba(255,255,255,.06)}',
    '@media(max-width:980px){.bw-dslp-hero{min-height:auto}.bw-dslp-grid,.bw-dslp-flow,.bw-dslp-finalBox{grid-template-columns:1fr}.bw-dslp-copy{padding-top:0}.bw-dslp-gameShell{max-width:620px}.bw-dslp-lessons{grid-template-columns:1fr}.bw-dslp-finalBox .bw-dslp-btn{width:100%}}',
    '@media(max-width:620px){.bw-dslp-wrap{width:min(100%,calc(100vw - 24px))}.bw-dslp-hero{padding:72px 0 28px;background-position:center top}.bw-dslp h1{font-size:clamp(42px,14vw,58px);margin-bottom:12px}.bw-dslp-lead{font-size:17px;margin-bottom:14px}.bw-dslp-note{display:none}.bw-dslp-actions{display:grid;margin-bottom:16px}.bw-dslp-btn{width:100%;min-height:48px}.bw-dslp-facts{display:none}.bw-dslp-grid{gap:18px}.bw-dslp-gameLabel{margin-bottom:8px}.bw-dslp-game{padding:6px}.bw-dslp-section{padding:48px 0}.bw-dslp-section.tight{padding-top:20px}.bw-dslp-photoRow{grid-template-columns:1fr}.bw-dslp-step{grid-template-columns:42px 1fr;padding:12px}.bw-dslp-step b{width:42px;height:42px}.bw-dslp-final{padding:44px 0}}'
  ].join('');

  function esc(value) {
    return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function asset(path) {
    return BASE_URL + path;
  }

  function upsertMeta(kind, key, content) {
    var selector = 'meta[' + kind + '="' + key + '"]';
    var el = document.head.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(kind, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  function upsertLink(rel, href) {
    var el = document.head.querySelector('link[rel="' + rel + '"]');
    if (!el) {
      el = document.createElement('link');
      el.rel = rel;
      document.head.appendChild(el);
    }
    el.href = href;
  }

  function applySeoSafetyNet() {
    var path = location.pathname.replace(/\/+$/, '') || '/';
    var isFinal = /(^|\.)berlinwalk\.com$/i.test(location.hostname) && path === '/games/berlin-day-survival';
    var canonical = isFinal ? FINAL_URL : location.origin + path;
    document.title = isFinal ? SEO.title : 'Day Survival Test | BerlinWalk';
    upsertMeta('name', 'description', SEO.description);
    upsertMeta('name', 'robots', isFinal ? 'index, follow, max-image-preview:large' : 'noindex, nofollow');
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:title', SEO.socialTitle);
    upsertMeta('property', 'og:description', SEO.socialDescription);
    upsertMeta('property', 'og:image', SEO.image);
    upsertMeta('property', 'og:image:alt', SEO.imageAlt);
    upsertMeta('property', 'og:site_name', 'BerlinWalk');
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', SEO.socialTitle);
    upsertMeta('name', 'twitter:description', SEO.socialDescription);
    upsertMeta('name', 'twitter:image', SEO.image);
    upsertMeta('name', 'twitter:image:alt', SEO.imageAlt);
    upsertLink('canonical', canonical);
    var old = document.getElementById('bw-day-survival-landing-jsonld');
    if (old) old.remove();
    if (isFinal) {
      var script = document.createElement('script');
      script.id = 'bw-day-survival-landing-jsonld';
      script.type = 'application/ld+json';
      script.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Berlin Day Survival',
        applicationCategory: 'GameApplication',
        operatingSystem: 'Web',
        url: FINAL_URL,
        description: 'A free BerlinWalk game where visitors pick a small Berlin budget, make six first-day choices, and see whether their wallet and energy survive.',
        image: SEO.image,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
        publisher: { '@type': 'Organization', name: 'BerlinWalk', url: 'https://www.berlinwalk.com' }
      });
      document.head.appendChild(script);
    }
  }

  function ensureGameScript() {
    if (customElements.get('bw-day-survival-v2')) return;
    var existing = document.querySelector('script[data-bw-day-survival-v2-loader]');
    if (existing) return;
    var script = document.createElement('script');
    script.src = BASE_URL + 'day-survival-v2-element.js?v=day-survival-v2-20260707d';
    script.defer = true;
    script.dataset.bwDaySurvivalV2Loader = 'true';
    document.head.appendChild(script);
  }

  function lesson(title, text, image) {
    return [
      '<article class="bw-dslp-lesson">',
      '<img src="' + esc(asset(image)) + '" alt="" loading="lazy" decoding="async">',
      '<div><h3>' + esc(title) + '</h3><p>' + esc(text) + '</p></div>',
      '</article>'
    ].join('');
  }

  var Proto = Object.create(HTMLElement.prototype);

  Proto.connectedCallback = function () {
    if (this._booted) return;
    this._booted = true;
    this.setAttribute('data-build', BUILD);
    applySeoSafetyNet();
    this._render();
    ensureGameScript();
  };

  Proto._render = function () {
    this.innerHTML = [
      '<style>' + CSS + '</style>',
      '<main class="bw-dslp" aria-labelledby="bw-day-survival-title">',
        '<section class="bw-dslp-hero">',
          '<div class="bw-dslp-wrap bw-dslp-grid">',
            '<div class="bw-dslp-copy">',
              '<p class="bw-dslp-kicker">Free BerlinWalk game</p>',
              '<h1 id="bw-day-survival-title">Berlin Day Survival</h1>',
              '<p class="bw-dslp-lead">Can you get through one Berlin day on €10, €15 or €20 without the city eating your wallet first?</p>',
              '<p class="bw-dslp-note">Berlin can feel cheap until the tiny decisions stack up: water at the wrong place, lunch on the square, one tired cafe stop too many. I built this as a quick budget instinct test before you try the real city.</p>',
              '<div class="bw-dslp-actions">',
                '<a class="bw-dslp-btn primary" href="#bw-day-survival-game">Play now</a>',
                '<a class="bw-dslp-btn secondary" href="' + BOOK_URL + '">Book the free walk</a>',
              '</div>',
              '<div class="bw-dslp-facts" aria-label="Game facts">',
                '<div class="bw-dslp-fact"><b>6</b><span>Berlin decisions</span></div>',
                '<div class="bw-dslp-fact"><b>€10</b><span>Hard mode start</span></div>',
                '<div class="bw-dslp-fact"><b>1 min</b><span>Quick result</span></div>',
              '</div>',
            '</div>',
            '<div class="bw-dslp-gameShell" id="bw-day-survival-game">',
              '<div class="bw-dslp-gameLabel"><span>Playable here</span><span>Pick your budget</span></div>',
              '<div class="bw-dslp-game">',
                '<bw-day-survival-v2 data-asset-base="' + esc(BASE_URL) + '"></bw-day-survival-v2>',
              '</div>',
            '</div>',
          '</div>',
        '</section>',
        '<span class="bw-dslp-scrollHint">A little Berlin logic before the next choice</span>',
        '<section class="bw-dslp-section tight">',
          '<div class="bw-dslp-wrap">',
            '<h2>What the game is really testing</h2>',
            '<p class="bw-dslp-sectionLead">The score is fun, but the point is practical. A good Berlin first day is usually not ruined by one big mistake. It is ruined by five small tired decisions in a row.</p>',
            '<div class="bw-dslp-lessons">',
              lesson('Eat one street away', 'The famous square is usually not where the good-value meal lives. Walk two blocks, then decide.', 'assets/scenes/scene-landmark.jpg'),
              lesson('Sunday changes the rules', 'Cheap supermarket moves disappear on Sunday. A bakery, a kiosk and a doner shop become your safety net.', 'assets/scenes/scene-hydration.jpg'),
              lesson('Save energy, not just money', 'A bench reset and a cheap drink can be smarter than forcing one more sight when your feet are done.', 'assets/scenes/scene-afternoon.jpg'),
            '</div>',
          '</div>',
        '</section>',
        '<section class="bw-dslp-section">',
          '<div class="bw-dslp-wrap bw-dslp-flow">',
            '<div>',
              '<h2>Use it before you walk Berlin for real</h2>',
              '<p class="bw-dslp-sectionLead">Play once before your first full day, then keep the result in your head. If you keep losing money in the game, the fix is simple: eat earlier, buy water smarter, and do not let the biggest square choose lunch for you.</p>',
              '<div class="bw-dslp-steps">',
                '<div class="bw-dslp-step"><b>1</b><div><h3>Pick your real budget</h3><p>Start with the amount you would honestly spend on food and drinks for one Berlin day.</p></div></div>',
                '<div class="bw-dslp-step"><b>2</b><div><h3>Make the tired choice</h3><p>Do not answer like a perfect traveller. Answer like someone with sore feet near Alexanderplatz.</p></div></div>',
                '<div class="bw-dslp-step"><b>3</b><div><h3>Take one local move</h3><p>If the result hurts, keep one rule: supermarket water, lunch away from the monument, proper food before the crash.</p></div></div>',
              '</div>',
            '</div>',
            '<div class="bw-dslp-photoStack" aria-hidden="true">',
              '<img src="' + esc(asset('assets/results/result-wanderer.jpg')) + '" alt="" loading="lazy" decoding="async">',
              '<div class="bw-dslp-photoRow">',
                '<img src="' + esc(asset('assets/results/result-busted.jpg')) + '" alt="" loading="lazy" decoding="async">',
                '<img src="' + esc(asset('assets/results/result-doner.jpg')) + '" alt="" loading="lazy" decoding="async">',
              '</div>',
            '</div>',
          '</div>',
        '</section>',
        '<section class="bw-dslp-final">',
          '<div class="bw-dslp-wrap bw-dslp-finalBox">',
            '<div>',
              '<h2>The game is quick. The real walk is better.</h2>',
              '<p>On my free Berlin walking tour, I help you read the city the same way: what to ignore, where to slow down, and which Berlin details actually change how the day feels.</p>',
              '<div class="bw-dslp-more" aria-label="More BerlinWalk games">',
                '<a class="bw-dslp-chip" href="' + GAMES_URL + '">All BerlinWalk games</a>',
                '<a class="bw-dslp-chip" href="https://www.berlinwalk.com/games/berlin-battle?utm_source=day_survival&utm_medium=game_landing&utm_campaign=berlinwalk_games&utm_content=more_games">Berlin Battle</a>',
                '<a class="bw-dslp-chip" href="https://www.berlinwalk.com/games/berlin-rewind?utm_source=day_survival&utm_medium=game_landing&utm_campaign=berlinwalk_games&utm_content=more_games">Berlin Rewind</a>',
                '<a class="bw-dslp-chip" href="https://www.berlinwalk.com/games/berghain-bouncer?utm_source=day_survival&utm_medium=game_landing&utm_campaign=berlinwalk_games&utm_content=more_games">Berghain Bouncer</a>',
                '<a class="bw-dslp-chip" href="https://www.berlinwalk.com/games/berlin-smile-challenge?utm_source=day_survival&utm_medium=game_landing&utm_campaign=berlinwalk_games&utm_content=more_games">Berlin Smile Challenge</a>',
              '</div>',
            '</div>',
            '<a class="bw-dslp-btn primary" href="' + BOOK_URL + '">Book your free spot</a>',
          '</div>',
        '</section>',
      '</main>'
    ].join('');
  };

  if (!customElements.get(TAG)) {
    try {
      var Cls = class extends HTMLElement {};
      Object.assign(Cls.prototype, Proto);
      customElements.define(TAG, Cls);
    } catch (e) {
      if (window && window.console) window.console.warn('bw-day-survival-landing-v2 define failed', e);
    }
  }
})();
