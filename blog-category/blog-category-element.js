/*
 * Category mode for <bw-blog-index>.
 *
 * Every /blog/categories/<slug> page carries the same <bw-blog-index> tag as
 * /blog, so until now each of them rendered the whole tourist blog hub with
 * the Wix native category feed stacked underneath. blog-index-element.js hands
 * the element to this file on those paths only; /blog itself is untouched.
 *
 * Design direction "Der Aushang", approved 2026-09-14. Paper ground, hairline
 * rules, no rounded corners, one stamp green, yellow only on the lead flag.
 * IBM Plex Mono carries the masthead, the German terms and every figure;
 * Montserrat carries reading copy. Fraunces is deliberately absent, so a
 * category page does not read as the hub in a different colour.
 *
 * The page shape adapts to the category: a curated shelf set where
 * curation/<slug>.json supplies one, the blog-index topic grouping for the big
 * categories, and one flat list where a category is too small to split.
 */
(function () {
  var BASE = (function () {
    var s = document.currentScript;
    return s && s.src ? s.src : window.location.href;
  })();
  var DATA_VERSION = '20260914-aushang-2';
  var MONO_URL = new URL('../brand/fonts/editorial-v2/IBMPlexMono-SemiBold.woff2', BASE).href;
  var WORDMARK = new URL('../assets/berlinwalk-wordmark-green.png', BASE).href;
  var PORTRAIT = new URL('./assets/yusuf-portrait.jpg', BASE).href;
  var STYLE_ID = 'bw-lib-styles';
  // A shelf longer than this opens collapsed. The rows are already in the DOM,
  // so expanding is a class toggle and costs no request.
  var SHELF_PREVIEW = 10;
  // The Monday letter is a real subscription: this posts to the same lead-asset
  // API every magnet uses, so it inherits double opt-in, the stored consent
  // snapshot and one-click unsubscribe. The Newsletter label is applied only
  // after the reader clicks the confirmation link.
  var LETTER_API = 'https://app.berlinwalk.com/api/download-lead';
  var LETTER_ASSET_ID = 'berlin-weekly-letter';
  var LETTER_ASSET_VERSION = '2026-09-v1';
  var LETTER_CONSENT_VERSION = 'berlin-weekly-letter-v1-2026-09-14';
  var LETTER_CONSENT_TEXT = 'Send me the BerlinWalk Monday letter: one email a week about what is actually changing in Berlin, plus occasional BerlinWalk emails. I can unsubscribe from any email with one click.';

  function categorySlug() {
    var m = window.location.pathname.toLowerCase().match(/\/blog\/categories\/([^/?#]+)/);
    return m ? decodeURIComponent(m[1]) : '';
  }

  function dataUrl(slug) {
    return new URL('./' + slug + '.json', BASE).href + '?v=' + DATA_VERSION;
  }

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

      '.bw-lib-extra{display:none;}',
      '.bw-lib-shelf.bw-lib-open .bw-lib-extra{display:grid;}',
      '.bw-lib-more{display:block;width:100%;appearance:none;cursor:pointer;background:#FBFBF6;border:0;border-top:1px solid var(--hair);',
      'padding:13px 18px;font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--stamp);text-align:center;}',
      '.bw-lib-more:hover{background:var(--hl);color:#123D18;}',
      '.bw-lib-more:focus-visible{outline:2px solid var(--stamp);outline-offset:-2px;}',

      /* newsletter form */
      '.bw-lib-letter{margin-top:40px;border:2px solid var(--ink);background:#fff;display:grid;grid-template-columns:1.15fr 1fr;}',
      '.bw-lib-letter .l{padding:26px 28px;border-right:1px solid var(--ink);}',
      '.bw-lib-letter .l h3{font-size:21px;letter-spacing:-.01em;margin:0 0 12px;color:var(--ink);}',
      '.bw-lib-letter .l p{margin:0;max-width:48ch;font-size:15px;color:#2F3729;}',
      '.bw-lib-letter .r{padding:26px 28px;display:flex;flex-direction:column;justify-content:center;gap:12px;background:#FBFBF6;}',
      '.bw-lib-letter label.f{display:block;}',
      '.bw-lib-letter label.f span{display:block;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--mut);margin-bottom:6px;}',
      '.bw-lib-letter input[type=email]{width:100%;border:1px solid var(--ink);background:#fff;padding:11px 12px;font:inherit;font-size:15px;border-radius:0;color:var(--ink);}',
      '.bw-lib-letter input[type=email]:focus{outline:2px solid var(--stamp);outline-offset:-1px;}',
      '.bw-lib-letter .cs{display:flex;gap:9px;align-items:flex-start;font-size:12px;line-height:1.45;color:#2F3729;}',
      '.bw-lib-letter .cs input{margin:2px 0 0;flex:0 0 auto;width:15px;height:15px;accent-color:#1B5E20;}',
      '.bw-lib-letter .cs a{color:var(--stamp);text-decoration:underline;text-underline-offset:2px;}',
      '.bw-lib-letter button{appearance:none;border:1px solid #123D18;background:var(--hl);color:#123D18;cursor:pointer;',
      'font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;padding:13px 16px;border-radius:0;}',
      '.bw-lib-letter button:hover{background:#123D18;color:var(--hl);}',
      '.bw-lib-letter button[disabled]{opacity:.55;cursor:default;}',
      '.bw-lib-letter .hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;}',
      '.bw-lib-letter .msg{margin:0;font-size:13px;line-height:1.45;color:var(--stamp);}',
      '.bw-lib-letter .msg.err{color:#8A1616;}',
      '.bw-lib-letter .done{padding:26px 28px;}',
      '.bw-lib-letter .done h3{font-size:21px;margin:0 0 10px;color:var(--ink);}',
      '.bw-lib-letter .done p{margin:0;font-size:15px;color:#2F3729;max-width:52ch;}',

      /* closing note */
      '.bw-lib-note{margin-top:40px;border:2px solid var(--ink);background:#fff;display:grid;grid-template-columns:1.3fr 1fr;}',
      '.bw-lib-note .l{padding:26px 28px;border-right:1px solid var(--ink);display:grid;grid-template-columns:108px minmax(0,1fr);gap:20px;align-items:start;}',
      '.bw-lib-face{width:108px;height:108px;object-fit:cover;display:block;border:1px solid var(--hair);filter:saturate(.9) contrast(1.02);}',
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
      '.bw-lib-letter{grid-template-columns:1fr;}',
      '.bw-lib-letter .l{border-right:0;border-bottom:1px solid var(--ink);}',
      '.bw-lib-note .l{border-right:0;border-bottom:1px solid var(--ink);}',
      '}',
      '@media (max-width:640px){',
      '.bw-lib{font-size:15px;}',
      '.bw-lib .bw-lib-in{padding:0 16px;}',
      '.bw-lib-row{grid-template-columns:34px 76px minmax(0,1fr);}',
      '.bw-lib-shelf.bw-lib-open .bw-lib-extra{display:grid;}',
      '.bw-lib-row img{width:66px;height:52px;}',
      '.bw-lib-row .mt{grid-column:2 / -1;text-align:left;padding:0 18px 13px 12px;}',
      '.bw-lib-row .mt .c{margin-top:0;margin-left:8px;}',
      '.bw-lib-wd a{grid-template-columns:72px minmax(0,1fr);gap:13px;}',
      '.bw-lib-wd img{width:72px;height:72px;}',
      '.bw-lib-meta span{padding-right:14px;margin-right:14px;font-size:10.5px;}',
      '.bw-lib-note .l{grid-template-columns:76px minmax(0,1fr);gap:14px;}',
      '.bw-lib-face{width:76px;height:76px;}',
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
      '<span class="bw-lib-flag m">Latest &middot; ' + shortDate(p.publishedDate) + ' &middot; ' + esc(p.readTime) + '</span>' +
      '<h3>' + esc(p.title) + '</h3>' +
      '<p>' + esc(p.excerpt) + '</p>' +
      '<span class="bw-lib-src m">Read it' + (p.tool ? ', then put your own number in' : '') + '</span>' +
      '</div></a></div>'
    );
  }

  // Only categories with a curation file have terms, so this whole block is
  // absent everywhere except Living in Berlin rather than faked.
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

  // A block only collapses when collapsing actually saves the reader
  // something. Hiding one or two rows behind a button is worse than showing
  // them, and a flat category is small enough to show whole.
  function previewLimit(total, mode) {
    if (mode === 'flat') return Infinity;
    return total - SHELF_PREVIEW < 3 ? Infinity : SHELF_PREVIEW;
  }

  function rowHtml(p, index, limit) {
    var num = index < 9 ? '0' + (index + 1) : String(index + 1);
    var fig = p.figure ? '<span class="f m">' + p.figure + '</span> ' : '';
    var hidden = index >= limit ? ' bw-lib-extra' : '';
    return (
      '<a class="bw-lib-row' + hidden + '" href="' + esc(p.path) + '">' +
      '<span class="n m">' + num + '</span>' +
      '<img src="' + esc(p.thumb) + '" alt="' + esc(p.alt) + '" loading="lazy" width="88" height="66">' +
      '<span class="tx"><b>' + esc(p.title) + '</b><i>' + fig + (p.line || '') + '</i></span>' +
      '<span class="mt m">' + esc(p.minutes) + ' min' +
      (p.tool ? '<span class="c">Calculator</span>' : '') + '</span>' +
      '</a>'
    );
  }

  function moreButton(count) {
    if (!isFinite(count) || count <= 0) return '';
    return (
      '<button type="button" class="bw-lib-more m" data-bw-more>' +
      'Show the other ' + count + '</button>'
    );
  }

  function listHtml(d) {
    // Flat categories render one list; the rest render their shelves. Either
    // way a long block opens at SHELF_PREVIEW rows with the remainder one
    // click away, so a 295-post category does not land as a wall.
    var body;
    if (d.shelfMode === 'flat') {
      var flat = d.flat || [];
      if (!flat.length) return '';
      var flatLimit = previewLimit(flat.length, 'flat');
      body =
        '<div class="bw-lib-shelf">' +
        '<div class="bw-lib-shelf-h"><h3 class="m">All ' + flat.length + ' guides</h3>' +
        '<span>Newest first</span></div>' +
        flat.map(function (p, i) { return rowHtml(p, i, flatLimit); }).join('') +
        '</div>';
      return '<div class="bw-lib-sect"><div class="bw-lib-in">' + body + '</div></div>';
    }

    var shelves = d.shelves || [];
    if (!shelves.length) return '';
    body = shelves.map(function (shelf) {
      var limit = previewLimit(shelf.posts.length, d.shelfMode);
      return (
        '<div class="bw-lib-shelf">' +
        '<div class="bw-lib-shelf-h"><h3 class="m">' + shelf.title + '</h3>' +
        '<span>' + (shelf.lead || '') + '</span></div>' +
        shelf.posts.map(function (p, i) { return rowHtml(p, i, limit); }).join('') +
        moreButton(isFinite(limit) ? shelf.posts.length - limit : 0) +
        '</div>'
      );
    }).join('');
    return (
      '<div class="bw-lib-sect"><div class="bw-lib-in">' +
      '<div class="bw-lib-legend"><h2 class="m">' + esc(d.shelfLegend || 'Everything in this category') + '</h2>' +
      '<div class="s">' + esc(d.shelfLegendSub || '') + '</div></div>' +
      body +
      '</div></div>'
    );
  }

  function letterHtml(d) {
    return (
      '<div class="bw-lib-sect"><div class="bw-lib-in">' +
      '<div class="bw-lib-letter" data-bw-letter>' +
      '<div class="l">' +
      '<h3 class="m">One letter a week, about the week that is coming</h3>' +
      '<p>Every Monday I send one email: the Berlin dates about to land, what I checked myself that week, ' +
      'and the one move I would make. No tour pitch in it. If you live here, that is the part worth having.</p>' +
      '</div>' +
      '<form class="r" novalidate>' +
      '<label class="f"><span>Your email</span>' +
      '<input type="email" name="email" autocomplete="email" required placeholder="you@example.com"></label>' +
      '<label class="cs"><input type="checkbox" name="consent" required>' +
      '<span>' + LETTER_CONSENT_TEXT + ' <a href="/privacy-policy" target="_blank" rel="noopener">Privacy Policy</a>.</span></label>' +
      '<label class="hp" aria-hidden="true" tabindex="-1">Leave this empty' +
      '<input type="text" name="website" tabindex="-1" autocomplete="off"></label>' +
      '<button type="submit" class="m">Send it to me</button>' +
      '<p class="msg" data-bw-msg role="status" aria-live="polite"></p>' +
      '</form></div></div></div>'
    );
  }

  function bindLetter(host, d) {
    var wrap = host.querySelector('[data-bw-letter]');
    if (!wrap) return;
    var form = wrap.querySelector('form');
    var msg = wrap.querySelector('[data-bw-msg]');
    var button = wrap.querySelector('button');
    var startedAt = new Date().toISOString();
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var email = String(form.email.value || '').trim().toLowerCase();
      if (!email || email.indexOf('@') < 1) {
        msg.className = 'msg err';
        msg.textContent = 'That email does not look right. Check it and try again.';
        return;
      }
      if (!form.consent.checked) {
        msg.className = 'msg err';
        msg.textContent = 'Tick the box so I am allowed to email you.';
        return;
      }
      button.disabled = true;
      msg.className = 'msg';
      msg.textContent = 'Sending.';
      fetch(LETTER_API + '?action=submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          consent: true,
          consentVersion: LETTER_CONSENT_VERSION,
          assetId: LETTER_ASSET_ID,
          assetVersion: LETTER_ASSET_VERSION,
          sourceSlug: d.slug || '',
          sourceUrl: window.location.href,
          placement: 'category_footer',
          variant: 'letter',
          analyticsConsentAtSubmit: false,
          screenWidth: Number(window.innerWidth || 0),
          screenHeight: Number(window.innerHeight || 0),
          website: String(form.website.value || ''),
          startedAt: startedAt,
          submittedAt: new Date().toISOString(),
        }),
      }).then(function (r) {
        if (!r.ok) throw new Error('submit ' + r.status);
        return r.json();
      }).then(function () {
        // The API answers the same way whatever it decides, so this only
        // reports that the request was taken, never that a list was joined.
        // The confirmation email is what actually subscribes the reader.
        wrap.innerHTML =
          '<div class="done"><h3 class="m">Check your inbox</h3>' +
          '<p>I have sent one email to <strong>' + esc(email) + '</strong>. ' +
          'Click the link in it to confirm, and the next letter reaches you on Monday morning. ' +
          'If it is not there in a minute, look in the promotions or spam folder.</p></div>';
      }).catch(function () {
        button.disabled = false;
        msg.className = 'msg err';
        msg.textContent = 'That did not go through. Try again in a moment.';
      });
    });
  }

  function noteHtml(d) {
    return (
      '<div class="bw-lib-sect"><div class="bw-lib-in">' +
      '<div class="bw-lib-note">' +
      '<div class="l">' +
      '<img class="bw-lib-face" src="' + PORTRAIT + '" alt="Yusuf, who writes these guides and runs the walking tour" width="108" height="108" loading="lazy">' +
      '<div><h3 class="m">Who writes these</h3>' +
      '<p>I am Yusuf, and I guide Berlin’s historic centre most days. Everything filed here starts from a real Berlin price, ' +
      'a rule that just moved or a word on a letter nobody translated, and ends with the one thing I would actually do about it. ' +
      'A new guide lands most weekdays.</p></div></div>' +
      '<div class="r">' +
      // The hub is /berlin-tools. Bare /tools is a 404; only /tools/<slug> works.
      (d.toolCount ? '<a class="m" href="/berlin-tools">' + esc(d.toolCount) + ' of these carry a free calculator</a>' : '<a class="m" href="/berlin-tools">Free Berlin tools</a>') +
      '<a class="m" href="/blog">The rest of the blog</a>' +
      '</div></div>' +
      '<div class="bw-lib-foot"><img src="' + WORDMARK + '" alt="BerlinWalk">' +
      '<span class="m">' + esc(d.label) + ' &middot; ' + esc(d.totalPosts) + ' guides</span></div>' +
      '</div></div>'
    );
  }

  function shortDate(iso) {
    try {
      return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    } catch (e) {
      return '';
    }
  }

  function checkedOn(iso) {
    try {
      var d = iso ? new Date(iso) : new Date();
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
      return '';
    }
  }

  function bindMoreButtons(host) {
    host.querySelectorAll('[data-bw-more]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var shelf = btn.closest('.bw-lib-shelf');
        if (!shelf) return;
        shelf.classList.add('bw-lib-open');
        btn.remove();
      });
    });
  }

  function render(host, d) {
    ensureStyles();
    host.innerHTML =
      '<div class="bw-lib">' +
      '<div class="bw-lib-mast"><div class="bw-lib-in">' +
      '<p class="bw-lib-kick m">The blog &middot; Category</p>' +
      '<h1 class="m">' + esc(d.label) + '</h1>' +
      '<p class="bw-lib-lede">' + esc(d.lede) + '</p>' +
      '<div class="bw-lib-meta m">' +
      '<span><b>' + esc(d.totalPosts) + '</b> guides</span>' +
      (d.toolCount ? '<span><b>' + esc(d.toolCount) + '</b> with a calculator</span>' : '') +
      '<span>Checked on <b>' + checkedOn(d.updatedAt) + '</b></span>' +
      '</div></div></div>' +
      '<div class="bw-lib-sect"><div class="bw-lib-in">' + leadHtml(d) + '</div></div>' +
      glossaryHtml(d) +
      listHtml(d) +
      letterHtml(d) +
      noteHtml(d) +
      '</div>';
    bindMoreButtons(host);
    bindLetter(host, d);
    hideNativeFeed(host);
  }

  window.BWBlogCategory = {
    // Resolves only once a category actually rendered. Any rejection sends the
    // caller back to the old hub, so the worst case is today's page.
    // slugOverride exists for preview.html, which cannot fake a pathname.
    // The live hook never passes it.
    mount: function (host, slugOverride) {
      var slug = slugOverride || categorySlug();
      if (!slug) return Promise.reject(new Error('no category slug in path'));
      // Not force-cache: the category files are rebuilt every time a post is
      // published, and a pinned version plus force-cache would freeze a reader
      // on whatever shipped the day the element last changed. Plain default
      // caching lets the Pages Cache-Control header expire it normally.
      return fetch(dataUrl(slug), { cache: 'default' })
        .then(function (r) {
          if (!r.ok) throw new Error('category data ' + slug + ' ' + r.status);
          return r.json();
        })
        .then(function (d) {
          if (!d || !d.totalPosts) throw new Error('category data ' + slug + ' empty');
          render(host, d);
          return true;
        });
    },
  };
})();
