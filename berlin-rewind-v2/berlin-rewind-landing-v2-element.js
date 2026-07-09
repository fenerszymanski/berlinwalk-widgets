/*
 * <bw-berlin-rewind-landing-v2> - Berlin Rewind landing surface
 *
 * Full landing page wrapper for the native Rewind V2 game.
 * Mount with:
 *   <bw-berlin-rewind-landing-v2></bw-berlin-rewind-landing-v2>
 *   <script src=".../berlin-rewind-v2/berlin-rewind-landing-v2-element.js" defer></script>
 *
 * Build marker: berlin-rewind-landing-v2-no-game-head-cta-20260709a
 */
(function () {
  'use strict';

  var TAG = 'bw-berlin-rewind-landing-v2';
  var GAME_TAG = 'bw-berlin-rewind-result-games-v2';
  var BUILD = 'berlin-rewind-landing-v2-no-game-head-cta-20260709a';
  var GAME_BUILD = 'berlin-rewind-v2-archive-batch-20260709a';
  var SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : '';
  var BASE_URL = SCRIPT_URL && !/static\.wixstatic\.com/i.test(SCRIPT_URL)
    ? new URL('./', SCRIPT_URL).toString()
    : 'https://fenerszymanski.github.io/berlinwalk-widgets/berlin-rewind-v2/';
  var ROOT_URL = new URL('../', BASE_URL).toString();
  var COVER_URL = ROOT_URL + 'berlin-rewind/assets/social/berlin-rewind-social-1200x630.jpg';

  var FINAL_URL = 'https://www.berlinwalk.com/games/berlin-rewind';
  var BOOK_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based?utm_source=berlin_rewind&utm_medium=game_landing&utm_campaign=berlinwalk_games&utm_content=book_cta';
  var GAMES_URL = 'https://www.berlinwalk.com/games?utm_source=berlin_rewind&utm_medium=game_landing&utm_campaign=berlinwalk_games&utm_content=more_games';
  var LINKS = [
    { label: 'All games', href: GAMES_URL },
    { label: 'Day Survival', href: 'https://www.berlinwalk.com/games/berlin-day-survival?utm_source=berlin_rewind&utm_medium=game_landing&utm_campaign=berlinwalk_games&utm_content=more_games_day' },
    { label: 'Berlin Battle', href: 'https://www.berlinwalk.com/games/berlin-battle?utm_source=berlin_rewind&utm_medium=game_landing&utm_campaign=berlinwalk_games&utm_content=more_games_battle' },
    { label: 'Berghain Bouncer', href: 'https://www.berlinwalk.com/games/berghain-bouncer?utm_source=berlin_rewind&utm_medium=game_landing&utm_campaign=berlinwalk_games&utm_content=more_games_bouncer' },
    { label: 'Smile Challenge', href: 'https://www.berlinwalk.com/games/berlin-smile-challenge?utm_source=berlin_rewind&utm_medium=game_landing&utm_campaign=berlinwalk_games&utm_content=more_games_smile' }
  ];

  var SEO = {
    title: 'Berlin Rewind Game | Guess Old Berlin Photos',
    description: 'Play Berlin Rewind by BerlinWalk. Read real old Berlin photos, guess the year and district, and keep a daily streak alive.',
    socialTitle: 'Berlin Rewind Game',
    socialDescription: 'A free daily Berlin archive photo game from BerlinWalk.',
    image: COVER_URL,
    imageAlt: 'Berlin Rewind cover art with an archival Berlin photo collage'
  };

  var CSS = [
    '.bw-rwlp{--green:#1B5E20;--green2:#073B16;--yellow:#FFE600;--lime:#7CB342;--soft:#C5E1A5;--cream:#FAFAF5;--ink:#212121;--muted:#526052;--red:#E63946;',
    "display:block;width:100vw;max-width:100vw;margin:0 calc((100% - 100vw)/2);overflow:hidden;background:var(--cream);color:var(--ink);font-family:Montserrat,'Avenir Next','Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;text-size-adjust:100%;}",
    '.bw-rwlp *{box-sizing:border-box}.bw-rwlp a{color:inherit}.bw-rwlp img{display:block;max-width:100%}',
    '.bw-rwlp-wrap{width:min(1180px,calc(100vw - 36px));margin:0 auto}',
    '.bw-rwlp-hero{position:relative;isolation:isolate;min-height:min(555px,58svh);display:flex;align-items:end;padding:clamp(66px,7vw,92px) 0 clamp(48px,5vw,72px);background:#0b1f10;color:#fff;overflow:hidden}',
    '.bw-rwlp-hero:before{content:"";position:absolute;inset:0;background:linear-gradient(95deg,rgba(7,59,22,.92) 0%,rgba(7,59,22,.72) 42%,rgba(7,59,22,.15) 100%),url("' + COVER_URL + '");background-size:cover;background-position:center;z-index:-2}',
    '.bw-rwlp-hero:after{content:"";position:absolute;inset:auto 0 0;height:20%;background:linear-gradient(180deg,rgba(250,250,245,0),var(--cream));z-index:-1}',
    '.bw-rwlp-hero-copy{max-width:780px}.bw-rwlp-kicker{display:inline-flex;align-items:center;min-height:32px;background:var(--yellow);color:var(--green2);font-size:12px;font-weight:950;letter-spacing:1.6px;text-transform:uppercase;padding:8px 12px;margin:0 0 16px}',
    '.bw-rwlp h1{font-size:clamp(58px,7vw,88px);line-height:.9;letter-spacing:0;font-weight:950;margin:0 0 16px;color:#fff;text-wrap:balance}.bw-rwlp-lead{font-size:clamp(18px,2vw,23px);line-height:1.42;font-weight:850;color:#F6FFE8;max-width:720px;margin:0 0 18px}',
    '.bw-rwlp-note{font-size:16px;line-height:1.65;color:rgba(255,255,255,.86);font-weight:650;max-width:660px;margin:0 0 24px}',
    '.bw-rwlp-actions{display:flex;flex-wrap:wrap;gap:12px;margin:0 0 22px}.bw-rwlp-btn{display:inline-flex;align-items:center;justify-content:center;min-height:50px;border:2px solid transparent;border-radius:8px;padding:0 18px;font-size:15px;font-weight:950;text-decoration:none}.bw-rwlp-btn.primary{background:var(--yellow);color:var(--green2)}.bw-rwlp-btn.secondary{background:rgba(250,250,245,.08);border-color:rgba(255,230,0,.48);color:#fff}',
    '.bw-rwlp-chips{display:flex;flex-wrap:wrap;gap:10px}.bw-rwlp-chip{display:inline-flex;align-items:center;min-height:34px;border:1px solid rgba(255,255,255,.26);background:rgba(255,255,255,.1);border-radius:8px;color:#fff;font-size:12px;font-weight:900;letter-spacing:.8px;text-transform:uppercase;padding:8px 11px}',
    '.bw-rwlp-section{padding:clamp(54px,7vw,86px) 0}.bw-rwlp-section.tight{padding-top:24px}.bw-rwlp-section h2{color:var(--green2);font-size:56px;font-weight:950;line-height:.98;margin:0 0 16px;letter-spacing:0}.bw-rwlp-sectionLead{color:var(--muted);font-size:20px;font-weight:720;line-height:1.6;max-width:780px;margin:0}',
    '.bw-rwlp-section .bw-rwlp-note{color:var(--muted);font-size:17px;line-height:1.62;font-weight:680;max-width:780px;margin:14px 0 0}',
    '.bw-rwlp-proof{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:30px}.bw-rwlp-proof article{background:#fff;border:2px solid rgba(27,94,32,.14);border-radius:8px;padding:20px;box-shadow:0 16px 42px rgba(27,94,32,.08)}.bw-rwlp-proof b{display:block;color:var(--yellow);background:var(--green2);border-radius:8px;width:48px;height:48px;line-height:48px;text-align:center;font-size:21px;font-weight:950;margin:0 0 14px}.bw-rwlp-proof h3{font-size:20px;line-height:1.1;color:var(--green2);font-weight:950;margin:0 0 8px}.bw-rwlp-proof p{color:var(--muted);font-size:14px;font-weight:650;line-height:1.56;margin:0}',
    '.bw-rwlp-game-band{background:linear-gradient(180deg,#f3f7ec,var(--cream));padding:clamp(34px,5vw,64px) 0 clamp(50px,7vw,84px)}.bw-rwlp-game-head{display:flex;justify-content:space-between;gap:20px;align-items:end;margin:0 0 24px}.bw-rwlp-game-head div{max-width:720px}.bw-rwlp-game-head p{margin:0;color:var(--muted);font-size:16px;line-height:1.58;font-weight:700}.bw-rwlp-game-head .bw-rwlp-kicker{margin:0 0 16px}.bw-rwlp-game-head h2{margin:0 0 12px;color:var(--green2);font-size:clamp(32px,4.5vw,52px);font-weight:950;line-height:.98;letter-spacing:0}.bw-rwlp-game-mount{margin-top:20px}.bw-rwlp-game-mount '+GAME_TAG+'{display:block;width:100%;max-width:1080px;margin:0 auto;padding:0}',
    '.bw-rwlp-tour{background:linear-gradient(135deg,var(--green2),var(--green));color:#fff;padding:clamp(50px,7vw,84px) 0}.bw-rwlp-tour-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,420px);gap:28px;align-items:center}.bw-rwlp-tour h2{color:#fff;margin:0 0 14px}.bw-rwlp-tour p{color:#E8F6D8;font-size:17px;font-weight:700;line-height:1.62;margin:0;max-width:760px}.bw-rwlp-links{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}.bw-rwlp-link{display:inline-flex;align-items:center;min-height:42px;border:1px solid rgba(255,230,0,.46);border-radius:8px;background:rgba(255,255,255,.07);color:#fff;font-size:13px;font-weight:950;padding:0 12px;text-decoration:none}.bw-rwlp-bookbox{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.22);border-radius:8px;padding:20px}.bw-rwlp-bookbox strong{display:block;color:var(--yellow);font-size:28px;font-weight:950;line-height:1.02;margin:0 0 10px}.bw-rwlp-bookbox span{display:block;color:#F6FFE8;font-size:14px;font-weight:750;line-height:1.5;margin:0 0 16px}',
    '@media(max-width:900px){.bw-rwlp-hero{min-height:min(460px,53svh)}.bw-rwlp h1{font-size:62px}.bw-rwlp-lead{font-size:20px}.bw-rwlp-section h2{font-size:44px}.bw-rwlp-sectionLead{font-size:18px}.bw-rwlp-proof,.bw-rwlp-tour-grid{grid-template-columns:1fr}.bw-rwlp-game-head{display:block}.bw-rwlp-game-head .bw-rwlp-btn{margin-top:18px}.bw-rwlp-bookbox .bw-rwlp-btn{width:100%}}',
    '@media(max-width:620px){.bw-rwlp-wrap{width:min(100%,calc(100vw - 24px))}.bw-rwlp-hero{min-height:48svh;padding:58px 0 34px}.bw-rwlp-hero:before{background-position:center top}.bw-rwlp h1{font-size:48px;margin-bottom:10px}.bw-rwlp-lead{font-size:16.5px;margin-bottom:14px}.bw-rwlp-note{font-size:15px}.bw-rwlp-section h2{font-size:34px}.bw-rwlp-sectionLead{font-size:16px}.bw-rwlp-actions{display:none}.bw-rwlp-btn{width:100%;min-height:48px}.bw-rwlp-chips{gap:8px}.bw-rwlp-chip{font-size:11px;padding:7px 9px}.bw-rwlp-section{padding:48px 0}.bw-rwlp-game-band{padding:34px 0 48px}.bw-rwlp-game-head .bw-rwlp-kicker{margin-bottom:13px}.bw-rwlp-game-head h2{font-size:32px;margin-bottom:10px}}'
  ].join('');

  function esc(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
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
    var isFinal = /(^|\.)berlinwalk\.com$/i.test(location.hostname) && path === '/games/berlin-rewind';
    var canonical = isFinal ? FINAL_URL : location.origin + path;
    document.title = isFinal ? SEO.title : 'Berlin Rewind | BerlinWalk';
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

    var old = document.getElementById('bw-berlin-rewind-landing-jsonld');
    if (old) old.remove();
    if (isFinal) {
      var script = document.createElement('script');
      script.id = 'bw-berlin-rewind-landing-jsonld';
      script.type = 'application/ld+json';
      script.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Berlin Rewind',
        applicationCategory: 'GameApplication',
        operatingSystem: 'Web',
        url: FINAL_URL,
        description: 'A free daily BerlinWalk game where visitors read real old Berlin photos, guess the year and district, and keep a streak alive.',
        image: SEO.image,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
        publisher: { '@type': 'Organization', name: 'BerlinWalk', url: 'https://www.berlinwalk.com' }
      });
      document.head.appendChild(script);
    }
  }

  function ensureGameScript() {
    if (customElements.get(GAME_TAG)) return;
    var existing = document.querySelector('script[data-bw-berlin-rewind-result-games-v2-loader]');
    if (existing) return;
    var script = document.createElement('script');
    script.src = BASE_URL + 'berlin-rewind-v2-element.js?v=' + encodeURIComponent(GAME_BUILD);
    script.defer = true;
    script.dataset.bwBerlinRewindResultGamesV2Loader = 'true';
    document.head.appendChild(script);
  }

  class BWBerlinRewindLandingV2 extends HTMLElement {
    connectedCallback() {
      if (this._booted) return;
      this._booted = true;
      this.setAttribute('data-build', BUILD);
      applySeoSafetyNet();
      this._render();
      ensureGameScript();
      this._bind();
    }

    _bind() {
      this.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (event) {
          var target = document.querySelector(link.getAttribute('href'));
          if (!target) return;
          event.preventDefault();
          target.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        });
      });
    }

    _linksHtml() {
      return LINKS.map(function (item) {
        return '<a class="bw-rwlp-link" href="' + esc(item.href) + '">' + esc(item.label) + '</a>';
      }).join('');
    }

    _render() {
      this.innerHTML = [
        '<style>' + CSS + '</style>',
        '<main class="bw-rwlp" aria-labelledby="bw-berlin-rewind-title">',
          '<section class="bw-rwlp-hero">',
            '<div class="bw-rwlp-wrap bw-rwlp-hero-copy">',
              '<p class="bw-rwlp-kicker">Free daily Berlin game</p>',
              '<h1 id="bw-berlin-rewind-title">Berlin Rewind</h1>',
              '<p class="bw-rwlp-lead">Read a real old Berlin photo, guess the year and district, then see what the city was trying to tell you.</p>',
              '<div class="bw-rwlp-actions">',
                '<a class="bw-rwlp-btn primary" href="#bw-rewind-game">Play today&#039;s set</a>',
                '<a class="bw-rwlp-btn secondary" href="' + esc(BOOK_URL) + '">Book the free walk</a>',
              '</div>',
              '<div class="bw-rwlp-chips" aria-label="Game facts">',
                '<span class="bw-rwlp-chip">5 photos daily</span>',
                '<span class="bw-rwlp-chip">Year + district</span>',
                '<span class="bw-rwlp-chip">Daily streak</span>',
              '</div>',
            '</div>',
          '</section>',
          '<section class="bw-rwlp-game-band" id="bw-rewind-game">',
            '<div class="bw-rwlp-wrap">',
              '<div class="bw-rwlp-game-head">',
                '<div>',
                  '<p class="bw-rwlp-kicker">Today&#039;s archive set</p>',
                  '<h2>Play today&#039;s Rewind</h2>',
                  '<p>Guess the year with the slider, choose the district, then use the reveal to learn what the photo was hiding in plain sight.</p>',
                '</div>',
              '</div>',
              '<div class="bw-rwlp-game-mount">',
                '<' + GAME_TAG + ' data-asset-base="' + esc(BASE_URL) + '"></' + GAME_TAG + '>',
              '</div>',
            '</div>',
          '</section>',
          '<section class="bw-rwlp-section tight">',
            '<div class="bw-rwlp-wrap">',
              '<h2>What you are reading</h2>',
              '<p class="bw-rwlp-sectionLead">Berlin history is easier to feel when you slow down and read the street first. I use the same habit on my walk: look at the pressure in the scene, then the date starts to make sense.</p>',
              '<p class="bw-rwlp-note">Old Berlin photos are not only dates and monuments. A crowd, a street corner, a tram line, or a blank space beside the Wall can tell you what kind of Berlin you are looking at.</p>',
              '<div class="bw-rwlp-proof">',
                '<article><b>1</b><h3>Read the scene</h3><p>Start with the mood before the landmark. Crowds, uniforms, cars and empty streets often give the decade away.</p></article>',
                '<article><b>2</b><h3>Name the district</h3><p>Mitte is not always the answer. The game rewards exact district guesses, but nearby districts still count as a good Berlin instinct.</p></article>',
                '<article><b>3</b><h3>Keep the streak</h3><p>Five new photos arrive each Berlin day. Play once, compare the clues, then come back with a sharper eye tomorrow.</p></article>',
              '</div>',
            '</div>',
          '</section>',
          '<section class="bw-rwlp-tour">',
            '<div class="bw-rwlp-wrap bw-rwlp-tour-grid">',
              '<div>',
                '<h2>The photo is quick. The city is better on foot.</h2>',
                '<p>On my free Berlin walking tour, the same skill becomes useful in the real city: look at the street, connect the layers, and understand why one square can carry five different Berlins at once.</p>',
                '<div class="bw-rwlp-links" aria-label="More BerlinWalk games">' + this._linksHtml() + '</div>',
              '</div>',
              '<div class="bw-rwlp-bookbox">',
                '<strong>See the layers for real</strong>',
                '<span>Daily tip-based Berlin walk, ~2h, starting at the World Clock near Alexanderplatz.</span>',
                '<a class="bw-rwlp-btn primary" href="' + esc(BOOK_URL) + '">Book your free spot</a>',
              '</div>',
            '</div>',
          '</section>',
        '</main>'
      ].join('');
    }
  }

  if (!customElements.get(TAG)) {
    try {
      customElements.define(TAG, BWBerlinRewindLandingV2);
    } catch (e) {
      if (window && window.console) window.console.warn('bw-berlin-rewind-landing-v2 define failed', e);
    }
  }
})();
