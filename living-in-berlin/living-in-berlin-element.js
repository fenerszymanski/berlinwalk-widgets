/*
 * Living in Berlin mode for <bw-blog-index>.
 *
 * Scope is deliberately narrow: blog-index-element.js only loads this file on
 * /blog/categories/living-in-berlin. Every other blog surface, the /blog hub
 * included, is untouched by anything in here.
 *
 * Design direction "Der Aushang", approved 2026-09-14. Paper ground, hairline
 * rules, no rounded corners, one stamp green, yellow only on the lead flag.
 * IBM Plex Mono carries the masthead, the German terms and every figure;
 * Montserrat carries reading copy. Fraunces is deliberately absent, so this
 * page does not read as the tourist blog hub in a different colour.
 */
(function () {
  var BASE = (function () {
    var s = document.currentScript;
    return s && s.src ? s.src : window.location.href;
  })();
  var DATA_URL = new URL('./data.json', BASE).href + '?v=20260914-aushang-1';
  var MONO_URL = new URL('../brand/fonts/editorial-v2/IBMPlexMono-SemiBold.woff2', BASE).href;
  var WORDMARK = new URL('../assets/berlinwalk-wordmark-green.png', BASE).href;
  var STYLE_ID = 'bw-lib-styles';

  function esc(v) {
    return String(v == null ? '' : v);
  }

  function styles() {
    return [
      '@font-face{font-family:BWPlexMono;font-style:normal;font-weight:600;font-display:swap;src:url(' + MONO_URL + ") format('woff2');}",
      'bw-blog-index{display:block;width:100%;}',
      '.bw-lib{',
      '--pa:#EFEFE6;--ink:#14180F;--hair:#BFC3B2;--axis:#9AA18C;',
      '--stamp:#1B5E20;--hl:#FFE600;--mut:#5B6355;--soft:#E3E9D6;',
      'background:var(--pa);color:var(--ink);',
      "font-family:Montserrat,'Helvetica Neue',Arial,sans-serif;",
      'font-size:16px;line-height:1.55;-webkit-font-smoothing:antialiased;',
      'padding:0 0 64px;width:100%;overflow-x:hidden;box-sizing:border-box;}',
      '.bw-lib *,.bw-lib *::before,.bw-lib *::after{box-sizing:border-box;}',
      '.bw-lib a{color:inherit;text-decoration:none;}',
      '.bw-lib a:focus-visible{outline:2px solid var(--stamp);outline-offset:2px;}',
      '.bw-lib .bw-lib-in{max-width:1060px;margin:0 auto;padding:0 24px;}',
      ".bw-lib .m{font-family:BWPlexMono,'IBM Plex Mono',ui-monospace,SFMono-Regular,Menlo,monospace;font-weight:600;font-variant-numeric:tabular-nums;}",

      /* masthead */
      '.bw-lib-mast{padding:44px 0 0;}',
      '.bw-lib-kick{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--mut);margin:0 0 16px;}',
      '.bw-lib-mast h1{font-size:clamp(34px,5vw,56px);line-height:1.02;letter-spacing:-.035em;margin:0 0 18px;color:var(--ink);}',
      '.bw-lib-lede{max-width:60ch;font-size:17px;line-height:1.6;margin:0 0 24px;color:#2F3729;}',
      '.bw-lib-meta{display:flex;flex-wrap:wrap;gap:0;border-top:2px solid var(--ink);border-bottom:1px solid var(--ink);}',
      '.bw-lib-meta span{padding:12px 20px 12px 0;margin-right:20px;border-right:1px solid var(--hair);font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--mut);}',
      '.bw-lib-meta span:last-child{border-right:0;margin-right:0;}',
      '.bw-lib-meta b{color:var(--ink);}',

      /* section legend */
      '.bw-lib-sect{padding:38px 0 0;}',
      '.bw-lib-legend{display:flex;align-items:baseline;gap:14px;}',
      '.bw-lib-legend h2{font-size:15px;letter-spacing:.12em;text-transform:uppercase;margin:0;padding-right:12px;color:var(--ink);}',
      '.bw-lib-legend .s{font-size:13px;color:var(--mut);flex:1;border-bottom:1px solid var(--hair);transform:translateY(-4px);}',

      /* lead story */
      '.bw-lib-lead{margin-top:30px;border:1px solid var(--ink);background:#fff;}',
      '.bw-lib-lead a{display:grid;grid-template-columns:1.12fr 1fr;align-items:stretch;}',
      '.bw-lib-lead img{width:100%;height:100%;min-height:300px;object-fit:cover;display:block;border-right:1px solid var(--ink);filter:saturate(.88) contrast(1.03);}',
      '.bw-lib-lead .tx{padding:26px 28px;display:flex;flex-direction:column;justify-content:center;}',
      '.bw-lib-flag{display:inline-block;align-self:flex-start;background:var(--hl);color:#123D18;font-size:10px;letter-spacing:.16em;text-transform:uppercase;padding:4px 8px;margin-bottom:14px;}',
      '.bw-lib-lead h3{font-weight:700;font-size:25px;line-height:1.2;letter-spacing:-.015em;margin:0 0 12px;color:var(--ink);}',
      '.bw-lib-lead p{margin:0 0 16px;font-size:15px;line-height:1.5;color:#2F3729;}',
      '.bw-lib-src{display:inline;font-size:11.5px;letter-spacing:.05em;color:var(--stamp);text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:4px;}',
      '.bw-lib a:hover .bw-lib-src{background:var(--hl);color:#123D18;}',

      /* glossary */
      '.bw-lib-wd{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));margin-top:22px;border:1px solid var(--ink);background:#fff;}',
      '.bw-lib-wd a{display:grid;grid-template-columns:92px minmax(0,1fr);gap:16px;padding:16px 20px 17px;border-right:1px solid var(--hair);border-bottom:1px solid var(--hair);}',
      '.bw-lib-wd a:nth-child(2n){border-right:0;}',
      '.bw-lib-wd a:hover{background:#FAFAF3;}',
      '.bw-lib-wd img{width:92px;height:92px;object-fit:cover;display:block;border:1px solid var(--hair);filter:saturate(.85) contrast(1.03);}',
      '.bw-lib-term{display:block;font-size:16px;letter-spacing:-.025em;line-height:1.1;overflow-wrap:anywhere;color:var(--ink);}',
      '.bw-lib-term::after{content:"";display:block;width:26px;height:2px;background:var(--hl);margin-top:8px;}',
      '.bw-lib-gloss{display:block;margin:9px 0 10px;font-size:14px;line-height:1.45;color:#2F3729;}',

      /* shelves */
      '.bw-lib-shelf{margin-top:30px;border:1px solid var(--ink);background:#fff;}',
      '.bw-lib-shelf-h{display:flex;align-items:baseline;justify-content:space-between;gap:16px;padding:13px 20px;border-bottom:1px solid var(--ink);background:var(--soft);}',
      '.bw-lib-shelf-h h3{font-size:13px;letter-spacing:.14em;text-transform:uppercase;margin:0;color:var(--ink);}',
      '.bw-lib-shelf-h span{font-size:13px;color:#3C4636;}',
      '.bw-lib-row{display:grid;grid-template-columns:44px 104px minmax(0,1fr) 122px;align-items:center;border-bottom:1px solid var(--hair);}',
      '.bw-lib-row:last-child{border-bottom:0;}',
      '.bw-lib-row:hover{background:#FAFAF3;}',
      '.bw-lib-row .n{font-size:11px;color:var(--mut);text-align:center;}',
      '.bw-lib-row img{width:88px;height:66px;object-fit:cover;display:block;justify-self:center;border:1px solid var(--hair);filter:saturate(.85) contrast(1.03);}',
      '.bw-lib-row .tx{padding:13px 18px 13px 12px;min-width:0;}',
      '.bw-lib-row .tx b{display:block;font-weight:700;font-size:15.5px;line-height:1.28;letter-spacing:-.005em;color:var(--ink);}',
      '.bw-lib-row .tx i{display:block;font-style:normal;font-size:13.5px;color:var(--mut);margin-top:4px;}',
      '.bw-lib-row .tx i .f{color:var(--ink);}',
      '.bw-lib-row .mt{padding:13px 18px;text-align:right;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--mut);}',
      '.bw-lib-row .mt .c{display:inline-block;margin-top:5px;background:var(--stamp);color:#fff;padding:2px 6px;letter-spacing:.1em;}',

      /* closing note */
      '.bw-lib-note{margin-top:40px;border:2px solid var(--ink);background:#fff;display:grid;grid-template-columns:1.3fr 1fr;}',
      '.bw-lib-note .l{padding:26px 28px;border-right:1px solid var(--ink);}',
      '.bw-lib-note .l h3{font-size:19px;letter-spacing:-.01em;margin:0 0 12px;color:var(--ink);}',
      '.bw-lib-note .l p{margin:0;max-width:52ch;font-size:15px;color:#2F3729;}',
      '.bw-lib-note .r{padding:26px 28px;display:flex;flex-direction:column;justify-content:center;gap:12px;background:#FBFBF6;}',
      '.bw-lib-note .r a{display:block;border:1px solid var(--ink);padding:11px 14px;font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;text-align:center;color:var(--ink);background:#fff;}',
      '.bw-lib-note .r a:hover{background:var(--hl);border-color:#123D18;color:#123D18;}',
      '.bw-lib-foot{margin-top:34px;border-top:2px solid var(--ink);padding:16px 0 0;display:flex;justify-content:space-between;gap:20px;align-items:center;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--mut);}',
      '.bw-lib-foot img{height:17px;width:auto;display:block;}',

      /* responsive */
      '@media (max-width:900px){',
      '.bw-lib-lead a{grid-template-columns:1fr;}',
      '.bw-lib-lead img{min-height:220px;border-right:0;border-bottom:1px solid var(--ink);}',
      '.bw-lib-wd{grid-template-columns:1fr;}',
      '.bw-lib-wd a{border-right:0;}',
      '.bw-lib-note{grid-template-columns:1fr;}',
      '.bw-lib-note .l{border-right:0;border-bottom:1px solid var(--ink);}',
      '}',
      '@media (max-width:640px){',
      '.bw-lib{font-size:15px;}',
      '.bw-lib .bw-lib-in{padding:0 16px;}',
      '.bw-lib-row{grid-template-columns:34px 76px minmax(0,1fr);}',
      '.bw-lib-row img{width:66px;height:52px;}',
      '.bw-lib-row .mt{grid-column:2 / -1;text-align:left;padding:0 18px 13px 12px;}',
      '.bw-lib-row .mt .c{margin-top:0;margin-left:8px;}',
      '.bw-lib-wd a{grid-template-columns:72px minmax(0,1fr);gap:13px;}',
      '.bw-lib-wd img{width:72px;height:72px;}',
      '.bw-lib-meta span{padding-right:14px;margin-right:14px;font-size:10.5px;}',
      '}',
    ].join('');
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var el = document.createElement('style');
    el.id = STYLE_ID;
    el.textContent = styles();
    document.head.appendChild(el);
  }

  // The Wix native category feed sits below this element on the same page and
  // lists the same posts. Hide that one section only, never the whole page.
  function hideNativeFeed(host) {
    var hide = function () {
      var sec = document.getElementById('comp-mm3d94ml');
      if (sec && !sec.contains(host)) {
        sec.style.setProperty('display', 'none', 'important');
        sec.setAttribute('data-bw-lib-hidden', 'true');
      }
    };
    hide();
    var obs = new MutationObserver(hide);
    obs.observe(document.body, { childList: true, subtree: true });
    setTimeout(function () { obs.disconnect(); }, 12000);
  }

  function leadHtml(d) {
    var p = d.lead;
    if (!p) return '';
    return (
      '<div class="bw-lib-lead"><a href="' + esc(p.path) + '">' +
      '<img src="' + esc(p.lead) + '" alt="' + esc(p.alt) + '" width="1400" height="620">' +
      '<div class="tx">' +
      '<span class="bw-lib-flag m">Newest &middot; ' + esc(p.readTime) + '</span>' +
      '<h3>' + esc(p.title) + '</h3>' +
      '<p>' + esc(p.excerpt) + '</p>' +
      '<span class="bw-lib-src m">Read it' + (p.tool ? ', then put your own number in' : '') + '</span>' +
      '</div></a></div>'
    );
  }

  function glossaryHtml(d) {
    if (!d.glossary || !d.glossary.length) return '';
    var cards = d.glossary.map(function (p) {
      return (
        '<a href="' + esc(p.path) + '">' +
        '<img src="' + esc(p.square) + '" alt="' + esc(p.alt) + '" loading="lazy" width="92" height="92">' +
        '<span><span class="bw-lib-term m">' + p.term + '</span>' +
        '<span class="bw-lib-gloss">' + p.gloss + '</span>' +
        '<span class="bw-lib-src m">' + esc(p.termCta || 'Read it') + ' &middot; ' + esc(p.readTime) + '</span>' +
        '</span></a>'
      );
    }).join('');
    return (
      '<div class="bw-lib-sect"><div class="bw-lib-in">' +
      '<div class="bw-lib-legend"><h2 class="m">The words that arrive in German</h2>' +
      '<div class="s">' + d.glossary.length + ' nouns that decide something, in plain English</div></div>' +
      '<div class="bw-lib-wd">' + cards + '</div>' +
      '</div></div>'
    );
  }

  function shelvesHtml(d) {
    var n = 0;
    var blocks = (d.shelves || []).map(function (shelf) {
      var rows = shelf.posts.map(function (p) {
        n += 1;
        var num = n < 10 ? '0' + n : String(n);
        var fig = p.figure ? '<span class="f m">' + p.figure + '</span> ' : '';
        return (
          '<a class="bw-lib-row" href="' + esc(p.path) + '">' +
          '<span class="n m">' + num + '</span>' +
          '<img src="' + esc(p.thumb) + '" alt="' + esc(p.alt) + '" loading="lazy" width="88" height="66">' +
          '<span class="tx"><b>' + esc(p.title) + '</b><i>' + fig + (p.line || '') + '</i></span>' +
          '<span class="mt m">' + esc(p.minutes) + ' min' +
          (p.tool ? '<span class="c">Calculator</span>' : '') + '</span>' +
          '</a>'
        );
      }).join('');
      return (
        '<div class="bw-lib-shelf">' +
        '<div class="bw-lib-shelf-h"><h3 class="m">' + shelf.title + '</h3><span>' + shelf.lead + '</span></div>' +
        rows + '</div>'
      );
    }).join('');
    return (
      '<div class="bw-lib-sect"><div class="bw-lib-in">' +
      '<div class="bw-lib-legend"><h2 class="m">By the part of life it hits</h2>' +
      '<div class="s">Four shelves, because that is how the questions actually arrive</div></div>' +
      blocks +
      '</div></div>'
    );
  }

  function noteHtml(d) {
    return (
      '<div class="bw-lib-sect"><div class="bw-lib-in">' +
      '<div class="bw-lib-note">' +
      '<div class="l"><h3 class="m">Why this shelf exists</h3>' +
      '<p>I guide Berlin’s historic centre most days, and the questions I get from people who live here are not the ones a visitor asks. ' +
      'These guides start from a Berlin price, a Berlin rule or a German word on a letter, and end with the one thing I would actually do about it. ' +
      'A new one lands most weekdays.</p></div>' +
      '<div class="r">' +
      '<a class="m" href="/tools">' + esc(d.toolCount) + ' of these carry a free calculator</a>' +
      '<a class="m" href="/blog">The rest of the blog</a>' +
      '</div></div>' +
      '<div class="bw-lib-foot"><img src="' + WORDMARK + '" alt="BerlinWalk"><span class="m">Living in Berlin &middot; ' + esc(d.totalPosts) + ' guides</span></div>' +
      '</div></div>'
    );
  }

  function checkedOn(iso) {
    try {
      var d = iso ? new Date(iso) : new Date();
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
      return '';
    }
  }

  function render(host, d) {
    ensureStyles();
    host.innerHTML =
      '<div class="bw-lib">' +
      '<div class="bw-lib-mast"><div class="bw-lib-in">' +
      '<p class="bw-lib-kick m">The blog &middot; Category</p>' +
      '<h1 class="m">Living in Berlin</h1>' +
      '<p class="bw-lib-lede">I write these for people who already live here, not for people passing through. ' +
      'Every guide starts from a Berlin date, a Berlin price or a Berlin rule that just moved, and ends with the one thing I would actually do about it.</p>' +
      '<div class="bw-lib-meta m">' +
      '<span><b>' + esc(d.totalPosts) + '</b> guides</span>' +
      '<span><b>' + esc(d.toolCount) + '</b> with a calculator</span>' +
      '<span>Checked on <b>' + checkedOn(d.updatedAt) + '</b></span>' +
      '<span>New one most weekdays</span>' +
      '</div></div></div>' +
      '<div class="bw-lib-sect"><div class="bw-lib-in">' + leadHtml(d) + '</div></div>' +
      glossaryHtml(d) +
      shelvesHtml(d) +
      noteHtml(d) +
      '</div>';
    hideNativeFeed(host);
  }

  window.BWLivingInBerlin = {
    // Returns a promise so the caller can fall back to the normal hub if the
    // data never arrives. A half-rendered page is worse than the old one.
    mount: function (host) {
      return fetch(DATA_URL, { cache: 'force-cache' })
        .then(function (r) {
          if (!r.ok) throw new Error('living-in-berlin data ' + r.status);
          return r.json();
        })
        .then(function (d) {
          if (!d || !d.posts || !d.posts.length) throw new Error('living-in-berlin data empty');
          render(host, d);
          return true;
        });
    },
  };
})();
