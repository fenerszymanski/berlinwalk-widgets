(function () {
  'use strict';

  var SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : '';
  var BASE_URL = SCRIPT_URL && SCRIPT_URL.includes('/where-in-berlin-page/')
    ? SCRIPT_URL.replace(/where-in-berlin-page\/where-in-berlin-page-element\.js(?:\?.*)?$/, '')
    : 'https://fenerszymanski.github.io/berlinwalk-widgets/';
  var BUILD = 'where-in-berlin-page-20260712-share-card-v2';
  var BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based?utm_source=game&utm_medium=where_in_berlin_page&utm_campaign=berlinwalk_games&utm_content=book_tour';
  var GAMES_URL = 'https://www.berlinwalk.com/games?utm_source=game&utm_medium=where_in_berlin_page&utm_campaign=berlinwalk_games&utm_content=all_games';

  function asset(path) {
    var url = new URL(path, BASE_URL);
    url.searchParams.set('v', BUILD);
    return url.toString();
  }

  function ensureFont() {
    if (document.querySelector('link[data-bw-where-font]')) return;
    var preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://fonts.gstatic.com';
    preconnect.crossOrigin = 'anonymous';
    var font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=Merriweather:wght@700;900&family=Montserrat:wght@500;600;700;800;900&display=swap';
    font.dataset.bwWhereFont = 'true';
    document.head.appendChild(preconnect);
    document.head.appendChild(font);
  }

  function loadScript(src, marker) {
    return new Promise(function (resolve) {
      if (document.querySelector('script[data-' + marker + ']')) {
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

  class BWWhereInBerlinPageElement extends HTMLElement {
    connectedCallback() {
      ensureFont();
      this._render();
      this._loadDependencies();
      this._syncSoon();
    }

    disconnectedCallback() {
      if (this._resizeObserver) this._resizeObserver.disconnect();
      if (this._resizeHandler) window.removeEventListener('resize', this._resizeHandler);
    }

    async _loadDependencies() {
      await Promise.all([
        customElements.get('bw-where-in-berlin')
          ? Promise.resolve()
          : loadScript(asset('where-in-berlin/where-in-berlin-element.js'), 'bw-where-widget'),
        window.BerlinWalkGamesPreviewRail
          ? Promise.resolve()
          : loadScript(asset('js/games-preview-rail.js'), 'bw-where-games-rail')
      ]);
      this._renderRail();
      this._syncSoon();
    }

    _renderRail() {
      var target = this.querySelector('[data-where-games-rail]');
      if (!target || !window.BerlinWalkGamesPreviewRail) return;
      window.BerlinWalkGamesPreviewRail.render(target, {
        current: 'where-in-berlin',
        source: 'where_in_berlin_page',
        limit: 5,
        theme: 'district',
        kicker: 'Other games',
        title: 'Five more BerlinWalk games',
        showAllLink: false
      });
    }

    _render() {
      var cover = asset('where-in-berlin/assets/social/where-in-berlin-social-1200x630.jpg');
      this.innerHTML = '' +
        '<style>' + this._styles() + '</style>' +
        '<main class="bw-where-page" aria-labelledby="bw-where-page-title">' +
          '<section class="bw-where-hero" style="--where-cover:url(\'' + cover + '\')">' +
            '<div class="bw-where-hero-grid" aria-hidden="true"></div>' +
            '<div class="bw-where-hero-inner">' +
              '<p class="bw-where-kicker">Berlin district match</p>' +
              '<h1 id="bw-where-page-title">Where in Berlin<br><span>Do You Belong?</span></h1>' +
              '<p>Berlin is too large to do properly in one sweep. I make better days by committing to one area, so this game finds the borough whose rhythm fits your choices.</p>' +
              '<div class="bw-where-hero-meta" aria-label="Game format"><span>6 situation calls</span><span>12 boroughs</span><span>1 useful match</span></div>' +
            '</div>' +
          '</section>' +
          '<section id="play-where-in-berlin" class="bw-where-game" aria-label="Where in Berlin Do You Belong game"><bw-where-in-berlin></bw-where-in-berlin></section>' +
          '<section class="bw-where-after" aria-labelledby="bw-where-note-title">' +
            '<div class="bw-where-after-inner">' +
              '<div class="bw-where-note">' +
                '<div><p class="bw-where-kicker">One borough, one useful move</p><h2 id="bw-where-note-title">Use the match as a starting point.</h2></div>' +
                '<p>Your result is not a rule about where to stay. It is a practical nudge toward the kind of Berlin day you are most likely to enjoy, without trying to cross the whole city before dinner.</p>' +
              '</div>' +
              '<section class="bw-where-rail" data-where-games-rail></section>' +
            '</div>' +
          '</section>' +
        '</main>';
    }

    _syncSoon() {
      this._resizeHandler = this._resizeHandler || (() => this._syncHeight());
      window.addEventListener('resize', this._resizeHandler, { passive: true });
      if (!this._resizeObserver && 'ResizeObserver' in window) {
        this._resizeObserver = new ResizeObserver(() => this._syncHeight());
        this._resizeObserver.observe(this);
      }
      window.requestAnimationFrame(() => this._syncHeight());
      [250, 800, 1600, 3000].forEach((delay) => window.setTimeout(() => this._syncHeight(), delay));
    }

    _syncHeight() {
      var page = this.querySelector('.bw-where-page');
      if (!page) return;
      var height = Math.ceil(page.getBoundingClientRect().height);
      if (!height || height < 900) return;
      var value = Math.min(Math.max(height, 1200), 10000) + 'px';
      [this, this.parentElement, this.closest('section')].filter(Boolean).forEach(function (target) {
        target.style.setProperty('height', value, 'important');
        target.style.setProperty('min-height', value, 'important');
      });
    }

    _styles() {
      return '' +
        'bw-where-in-berlin-page{display:block;width:100%}.bw-where-page{--green:#0b5d28;--forest:#06381a;--yellow:#ffe600;--paper:#fbfbf6;--muted:#536257;background:#f5f8e8;color:#102117;font-family:Montserrat,Arial,sans-serif;margin:0 calc((100% - 100vw)/2);max-width:100vw;overflow:hidden;width:100vw}.bw-where-page *{box-sizing:border-box}.bw-where-page h1,.bw-where-page h2,.bw-where-page p{margin:0}.bw-where-page a{color:inherit}' +
        '.bw-where-hero{align-items:end;background-image:linear-gradient(90deg,rgba(6,56,26,.93) 0%,rgba(6,56,26,.73) 42%,rgba(6,56,26,.13) 84%),var(--where-cover);background-position:center;background-size:cover;color:#fff;display:grid;min-height:min(690px,84svh);padding:clamp(100px,12vw,150px) 24px clamp(48px,7vw,76px);position:relative}.bw-where-hero:after{background:linear-gradient(90deg,var(--yellow),transparent 48%);bottom:0;content:"";height:6px;left:0;position:absolute;right:0}.bw-where-hero-grid{background:repeating-linear-gradient(90deg,rgba(255,255,255,.09) 0 1px,transparent 1px 36px);inset:0;pointer-events:none;position:absolute}.bw-where-hero-inner,.bw-where-after-inner{margin:0 auto;max-width:1180px;width:min(1180px,calc(100vw - 48px))}.bw-where-hero-inner{position:relative;z-index:1}.bw-where-kicker{color:var(--yellow);font-size:12px;font-weight:950;letter-spacing:.08em;line-height:1;margin-bottom:13px;text-transform:uppercase}.bw-where-page h1{font-size:clamp(54px,9vw,122px);font-weight:950;letter-spacing:0;line-height:.84;max-width:930px;text-shadow:5px 5px 0 rgba(0,0,0,.24)}.bw-where-page h1 span{display:block;font-family:Merriweather,Georgia,serif;font-size:.82em;font-style:italic;font-weight:900;line-height:.94;margin-top:.06em}.bw-where-hero p{color:rgba(255,255,255,.9);font-size:clamp(18px,2vw,24px);font-weight:700;line-height:1.45;margin-top:20px;max-width:710px}.bw-where-hero-meta{border-top:1px solid rgba(255,255,255,.28);color:rgba(255,255,255,.86);display:flex;flex-wrap:wrap;font-size:12px;font-weight:950;gap:14px 20px;letter-spacing:.08em;margin-top:30px;padding-top:18px;text-transform:uppercase}.bw-where-hero-meta span{position:relative}.bw-where-hero-meta span+span:before{color:var(--yellow);content:"/";margin-right:20px}' +
        '.bw-where-game{background:linear-gradient(180deg,#f5f8e8 0%,#eef5d7 100%);padding:clamp(26px,5vw,56px) 24px}.bw-where-game bw-where-in-berlin{display:block;margin:0 auto;max-width:1180px}.bw-where-after{background:radial-gradient(circle at 12% 8%,rgba(255,230,0,.16),transparent 30%),linear-gradient(140deg,#052313 0%,#07391d 48%,#0b5d28 100%);color:#fff;overflow:hidden;padding:clamp(42px,6vw,72px) 0 clamp(48px,7vw,84px);position:relative}.bw-where-after:before{background:repeating-linear-gradient(90deg,rgba(255,255,255,.08) 0 1px,transparent 1px 34px);content:"";inset:0;pointer-events:none;position:absolute}.bw-where-after-inner{position:relative;z-index:1}.bw-where-note{align-items:end;border-bottom:1px solid rgba(255,255,255,.18);display:grid;gap:24px;grid-template-columns:minmax(0,.9fr) minmax(0,1fr);padding:0 0 clamp(30px,5vw,52px)}.bw-where-note h2{color:#fff;font-size:clamp(29px,4.2vw,54px);font-weight:950;letter-spacing:0;line-height:.96;text-shadow:3px 3px 0 rgba(0,0,0,.22)}.bw-where-note p:not(.bw-where-kicker){color:rgba(255,255,255,.78);font-size:16px;font-weight:700;line-height:1.58}.bw-where-rail{padding:0}.bw-where-rail:empty{display:none}@media (max-width:760px){.bw-where-hero{min-height:620px}.bw-where-hero-inner,.bw-where-after-inner{width:min(100% - 32px,1180px)}.bw-where-page h1{font-size:52px}.bw-where-hero-meta span+span:before{content:"";margin-right:0}.bw-where-note{grid-template-columns:1fr}.bw-where-after{padding-top:36px}}';
    }
  }

  if (!customElements.get('bw-where-in-berlin-page')) {
    customElements.define('bw-where-in-berlin-page', BWWhereInBerlinPageElement);
  }
})();
