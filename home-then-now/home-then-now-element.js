/* Walk of Berlin homepage, "Berlin, then and now" (release home-then-now-20261029).
 * Custom element <bw-home-then-now>, light DOM. Classes start with bwh-; every style lives in
 * home-then-now.css under bw-home-then-now. Dependency-free. The live site header and footer
 * stay outside this element. DATA is rewritten from data/home.json by sync-data.mjs: keep it as
 * one "  const DATA = {...};" statement at this indentation.
 */
(() => {
  'use strict';

  const DATA = {
    "release": "home-then-now-20261029",
    "hero": {
      "img1928": "assets/hero-1928.webp",
      "imgToday": "assets/hero-today.webp",
      "w": 1200,
      "h": 750,
      "alt1928": "Potsdamer Platz from above in 1928",
      "altToday": "Potsdamer Platz from above today",
      "caption": "Potsdamer Platz from above, 1928 and today",
      "streetHref": "https://www.walkofberlin.com/product-page/your-berlin-street-in-1928-personalised-aerial-print-30-x-40-cm",
      "postersHref": "#bwh-posters"
    },
    "reels": [
      {
        "title": "East Berlin’s clock showed New York time",
        "len": "1:09",
        "href": "https://www.instagram.com/reel/DdyQTekMrQu/",
        "img": "assets/reel-world-clock.webp",
        "productLabel": "World Clock poster · from €26.90",
        "productHref": "https://www.walkofberlin.com/product-page/berlin-world-clock-poster-alexanderplatz-art-print-30-x-40-cm",
        "video": "video/reel-world-clock.mp4"
      },
      {
        "title": "The clock almost nobody could read",
        "len": "1:34",
        "href": "https://www.instagram.com/reel/Dd5kfKwk-P8/",
        "img": "assets/reel-berlin-uhr.webp",
        "productLabel": "Berlin-Uhr poster · from €26.90",
        "productHref": "https://www.walkofberlin.com/product-page/berlin-uhr-art-print-berlin-reels-collection",
        "video": "video/reel-berlin-uhr.mp4"
      },
      {
        "title": "No train stopped here for 28 years",
        "len": "0:42",
        "href": "https://www.instagram.com/reel/DcsncQ7shNh/",
        "img": "assets/reel-ghost-stations.webp",
        "productLabel": "Ghost Stations file · €6.90",
        "productHref": "https://www.walkofberlin.com/product-page/ghost-stations-printable",
        "video": "video/reel-ghost-stations.mp4"
      },
      {
        "title": "Berlin’s tram map still shows the Wall",
        "len": "0:36",
        "href": "https://www.instagram.com/reel/DdQapWighJ-/",
        "img": "assets/reel-tram-map.webp",
        "productLabel": "Tram Map file · €6.90",
        "productHref": "https://www.walkofberlin.com/product-page/berlin-tram-map-printable",
        "video": "video/reel-tram-map.mp4"
      },
      {
        "title": "East Berlin, west of the Wall",
        "len": "0:49",
        "href": "https://www.instagram.com/reel/Dc_i3LtgRlR/",
        "img": "assets/reel-osman-kalin.webp",
        "productLabel": "Treehouse file · €6.90",
        "productHref": "https://www.walkofberlin.com/product-page/osman-kal%C4%B1n-s-treehouse-printable",
        "video": "video/reel-osman-kalin.mp4"
      }
    ],
    "posters": [
      {
        "name": "Kottbusser Tor",
        "href": "https://www.walkofberlin.com/product-page/kottbusser-tor-berlin-art-print",
        "img": "assets/poster-kottbusser-tor.webp",
        "alt": "Kottbusser Tor poster in a room",
        "price": "from €26.90"
      },
      {
        "name": "Berolina",
        "href": "https://www.walkofberlin.com/product-page/berolina-modernist-berlin-art-print",
        "img": "assets/poster-berolina.webp",
        "alt": "Berolina poster in a room",
        "price": "from €29.90"
      },
      {
        "name": "Siegessäule",
        "href": "https://www.walkofberlin.com/product-page/siegessaeule-berlin-art-print",
        "img": "assets/poster-siegessaeule.webp",
        "alt": "Siegessäule poster in a room",
        "price": "from €26.90"
      },
      {
        "name": "Berlin in Pink",
        "href": "https://www.walkofberlin.com/product-page/berlin-in-pink-berlin-art-print",
        "img": "assets/poster-berlin-in-pink.webp",
        "alt": "Berlin in Pink poster in a room",
        "price": "from €26.90"
      },
      {
        "name": "Gleisdreieck",
        "href": "https://www.walkofberlin.com/product-page/gleisdreieck-berlin-art-print",
        "img": "assets/poster-gleisdreieck.webp",
        "alt": "Gleisdreieck poster in a room",
        "price": "from €26.90"
      },
      {
        "name": "Two U-Bahn Profiles",
        "href": "https://www.walkofberlin.com/product-page/two-berlin-u-bahn-profiles-berlin-art-print",
        "img": "assets/poster-u-bahn-two-sizes.webp",
        "alt": "Two U-Bahn Profiles poster in a room",
        "price": "from €26.90"
      }
    ],
    "postersCount": 45,
    "postersAllHref": "https://www.walkofberlin.com/category/all-products?tab=print",
    "doors": [
      {
        "name": "Your street in 1928",
        "line": "Your address in the 1928 aerial photos",
        "href": "https://www.walkofberlin.com/product-page/your-berlin-street-in-1928-personalised-aerial-print-30-x-40-cm",
        "img": "assets/door-1928.webp"
      },
      {
        "name": "2027 Wall Calendar",
        "line": "One district for every month",
        "href": "https://www.walkofberlin.com/product-page/berlin-2027-wall-calendar-a3",
        "img": "assets/door-calendar.webp"
      },
      {
        "name": "Audio walks",
        "line": "Three walks for your phone",
        "href": "https://www.walkofberlin.com/audio-tours",
        "img": "assets/door-audio-walks.webp"
      },
      {
        "name": "Guides",
        "line": "Plans, a virtual tour and a night in",
        "href": "https://www.walkofberlin.com/category/all-products?tab=guides",
        "img": "assets/door-guides.webp"
      }
    ],
    "storeHref": "https://www.walkofberlin.com/category/all-products",
    "walk": {
      "img": "assets/walk.webp",
      "alt": "On my Berlin Then and Now walk",
      "datesHref": "https://www.walkofberlin.com/book-berlin-walking-tour/berlin-then-and-now",
      "audioHref": "https://www.walkofberlin.com/audio-tours"
    },
    "visit": [
      {
        "tag": "INTERACTIVE MAP",
        "title": "Where was the Berlin Wall? East and West in 1989",
        "href": "https://www.walkofberlin.com/post/where-was-the-berlin-wall-interactive-map",
        "img": "assets/blog-where-was-the-berlin-wall-interactive-map.webp"
      },
      {
        "tag": "GETTING AROUND",
        "title": "Public transport: tickets, zones and validation",
        "href": "https://www.walkofberlin.com/post/berlin-public-transport-explained-for-tourists-u-bahn-s-bahn-tram-bus",
        "img": "assets/blog-berlin-public-transport-explained-for-tourists-u-bahn-s-bahn-tram-bus.webp"
      },
      {
        "tag": "ARRIVING",
        "title": "Berlin Airport to Alexanderplatz, the easy way",
        "href": "https://www.walkofberlin.com/post/how-to-get-from-berlin-airport-to-alexanderplatz-the-easy-way",
        "img": "assets/blog-how-to-get-from-berlin-airport-to-alexanderplatz-the-easy-way.webp"
      }
    ],
    "live": [
      {
        "tag": "THIS SEASON",
        "title": "Christmas markets: which ones are actually worth it",
        "href": "https://www.walkofberlin.com/post/best-christmas-markets-berlin-2026",
        "img": "assets/blog-best-christmas-markets-berlin-2026.webp"
      },
      {
        "tag": "WEEKEND",
        "title": "Mushroom picking: ten forests on your ticket",
        "href": "https://www.walkofberlin.com/post/mushroom-picking-berlin",
        "img": "assets/blog-mushroom-picking-berlin.webp"
      },
      {
        "tag": "NIGHTS OUT",
        "title": "Club dress codes: what Tresor, Sisyphos and RSO read",
        "href": "https://www.walkofberlin.com/post/berlin-club-dress-codes-by-venue",
        "img": "assets/blog-berlin-club-dress-codes-by-venue.webp"
      }
    ],
    "blogHref": "https://www.walkofberlin.com/blog",
    "tools": [
      {
        "kind": "GAME",
        "name": "Berghain Bouncer",
        "line": "Pick an outfit and face the door",
        "href": "https://www.walkofberlin.com/games/berghain-bouncer",
        "bg": "#102414",
        "fg": "#FAFAF5"
      },
      {
        "kind": "MAP",
        "name": "Christmas Markets",
        "line": "15 markets, filter by price and size",
        "href": "https://www.walkofberlin.com/tools/christmas-markets-map",
        "bg": "#FFE600",
        "fg": "#102414"
      },
      {
        "kind": "GUIDE",
        "name": "Berlin Safety",
        "line": "Neighbourhood by neighbourhood",
        "href": "https://www.walkofberlin.com/tools/berlin-safety",
        "bg": "#123D18",
        "fg": "#FAFAF5"
      },
      {
        "kind": "FINDER",
        "name": "Toilet Finder",
        "line": "The nearest public toilet, free ones too",
        "href": "https://www.walkofberlin.com/tools/berlin-public-toilets",
        "bg": "#EAF0E2",
        "fg": "#123D18"
      }
    ],
    "toolsAllHref": "https://www.walkofberlin.com/berlin-tools",
    "credits": [
      {
        "what": "Potsdamer Platz from above, about 1928 and 2026",
        "creator": "Hansa Luftbild (1928) and Geoportal Berlin (2026)",
        "source": "Cropped",
        "licence": "Datenlizenz Deutschland Zero 2.0",
        "url": ""
      },
      {
        "what": "Ghost Stations reel cover",
        "creator": "Illustration based on a photo of Jannowitzbrücke station by Frits Wiarda, 1989",
        "source": "Wikimedia Commons",
        "licence": "CC BY-SA 3.0",
        "url": "https://www.walkofberlin.com/sources?post=ghost-stations"
      },
      {
        "what": "Tram Map reel cover",
        "creator": "Map data © OpenStreetMap contributors (ODbL), district boundaries Geoportal Berlin",
        "source": "Drawn by me",
        "licence": "Datenlizenz Deutschland Zero 2.0",
        "url": "https://www.walkofberlin.com/sources?post=west-berlin-tram"
      },
      {
        "what": "Treehouse reel cover",
        "creator": "Photo by Jed",
        "source": "Wikimedia Commons, cropped, darkened, title added",
        "licence": "CC BY-SA 3.0 DE",
        "url": "https://www.walkofberlin.com/sources?post=osman-kalin-treehouse"
      },
      {
        "what": "Kottbusser Tor poster",
        "creator": "Artwork adapted from photographs by Gunnar Klack",
        "source": "Wikimedia Commons",
        "licence": "CC BY-SA 4.0",
        "url": "https://www.walkofberlin.com/product-page/kottbusser-tor-berlin-art-print"
      },
      {
        "what": "Siegessäule poster",
        "creator": "Artwork adapted from photographs by BugWarp (CC0) and Gerd Eichmann",
        "source": "Wikimedia Commons",
        "licence": "CC BY 4.0",
        "url": "https://www.walkofberlin.com/product-page/siegessaeule-berlin-art-print"
      },
      {
        "what": "Mushroom picking preview",
        "creator": "Photo by Holger Krisp",
        "source": "Wikimedia Commons, cropped",
        "licence": "CC BY 3.0",
        "url": "https://www.walkofberlin.com/post/mushroom-picking-berlin"
      },
      {
        "what": "Club dress codes preview",
        "creator": "Photo by Darkroomduck",
        "source": "Wikimedia Commons, cropped",
        "licence": "CC BY-SA 4.0",
        "url": "https://www.walkofberlin.com/post/berlin-club-dress-codes-by-venue"
      },
      {
        "what": "Everything else",
        "creator": "My own photographs and designs, or pictures from the linked posts and product pages",
        "source": "",
        "licence": "",
        "url": ""
      }
    ]
  };

  const BWH_SCRIPT_URL = (document.currentScript && document.currentScript.src)
    || 'https://fenerszymanski.github.io/berlinwalk-widgets/home-then-now/home-then-now-element.js';
  const BWH_NARROW = '(max-width: 1099px)';
  const BWH_REDUCED = '(prefers-reduced-motion: reduce)';
  const BWH_SCROLL_DRIVEN = !!(window.CSS && typeof window.CSS.supports === 'function'
    && window.CSS.supports('animation-timeline', 'scroll()'));

  // Same weekly-letter signup as the live bar in js/lead-form-direct-inject.js: same endpoint,
  // asset, consent version and consent text. Only the placement differs.
  const BWH_LETTER = {
    endpoint: 'https://app.berlinwalk.com/api/download-lead',
    assetId: 'berlin-weekly-letter',
    assetVersion: '2026-09-v1',
    consentVersion: 'berlin-weekly-letter-v2-2026-10-02',
    consentText: 'Send me Walk of Berlin Weekly, my Monday letter: one email a week about what is actually changing in Berlin, plus occasional Walk of Berlin emails. I can unsubscribe from any email with one click.',
    placement: 'home_then_now',
    joinedKey: 'bwLetterBarJoined'
  };

  const BWH_EMAIL_DOMAINS = ['gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.de', 'yahoo.co.uk', 'yahoo.fr', 'yahoo.it',
    'yahoo.es', 'yahoo.ca', 'ymail.com', 'rocketmail.com', 'hotmail.com', 'hotmail.de', 'hotmail.co.uk',
    'hotmail.fr', 'hotmail.it', 'outlook.com', 'outlook.de', 'outlook.fr', 'live.com', 'live.de', 'live.co.uk',
    'msn.com', 'icloud.com', 'me.com', 'mac.com', 'aol.com', 'gmx.de', 'gmx.net', 'gmx.com', 'gmx.at', 'gmx.ch',
    'web.de', 't-online.de', 'freenet.de', 'posteo.de', 'mailbox.org', 'proton.me', 'protonmail.com', 'pm.me',
    'duck.com', 'fastmail.com', 'mail.com', 'bluewin.ch', 'orange.fr', 'free.fr', 'libero.it', 'btinternet.com',
    'sky.com', 'comcast.net', 'verizon.net', 'att.net', 'sbcglobal.net'];

  const BWH_ARROW = '<svg width="14" height="10" viewBox="0 0 14 10" aria-hidden="true" focusable="false"><path d="M1 5h11M8 1l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
  const BWH_PLAY = '<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 1l7 4-7 4z" fill="#FFE600"></path></svg>';
  const BWH_CHIP = `<span class="bwh-swipe bwh-narrow" aria-hidden="true">SWIPE${BWH_ARROW}</span>`;

  // ---- helpers ----------------------------------------------------------------------------

  function bwhMatch(query) {
    return !!(window.matchMedia && window.matchMedia(query).matches);
  }

  function bwhEsc(value) {
    return String(value === undefined || value === null ? '' : value)
      .replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  }

  function bwhSrc(path) {
    return path ? new URL(String(path), BWH_SCRIPT_URL).href : '';
  }

  // Page links: in-page anchors, or absolute https links on walkofberlin.com or instagram.com.
  // Anything else (a TODO left in the data) becomes "#" and fails the test suite.
  function bwhHref(value) {
    const v = String(value || '');
    if (/^#bwh-[a-z0-9-]+$/.test(v)) return v;
    return /^https:\/\/([a-z0-9-]+\.)*(walkofberlin\.com|instagram\.com)(\/|\?|$)/i.test(v) ? v : '#';
  }

  // Credit source links may point at archives and licence pages; https only.
  function bwhExternal(value) {
    const v = String(value || '');
    return /^https:\/\/[^\s"'<>]+$/.test(v) ? v : '';
  }

  function bwhTargetFor(href) {
    return /instagram\.com/i.test(href) ? ' target="_blank" rel="noopener"' : '';
  }

  function bwhColor(value, fallback) {
    return /^#[0-9a-f]{3,8}$/i.test(String(value || '')) ? String(value) : fallback;
  }

  function bwhDistance(a, b) {
    const rows = [];
    for (let i = 0; i <= a.length; i += 1) rows[i] = [i];
    for (let j = 0; j <= b.length; j += 1) rows[0][j] = j;
    for (let i = 1; i <= a.length; i += 1) {
      for (let j = 1; j <= b.length; j += 1) {
        const cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
        rows[i][j] = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + cost);
        if (i > 1 && j > 1 && a.charAt(i - 1) === b.charAt(j - 2) && a.charAt(i - 2) === b.charAt(j - 1)) {
          rows[i][j] = Math.min(rows[i][j], rows[i - 2][j - 2] + 1);
        }
      }
    }
    return rows[a.length][b.length];
  }

  // Mistyped domain (yahoo.dea -> yahoo.de): the live bar asks once before it sends.
  function bwhSuggestEmail(email) {
    const at = email.lastIndexOf('@');
    if (at < 1) return '';
    const domain = email.slice(at + 1);
    if (!domain || BWH_EMAIL_DOMAINS.indexOf(domain) !== -1) return '';
    let best = '';
    let bestScore = 3;
    BWH_EMAIL_DOMAINS.forEach((known) => {
      const score = bwhDistance(domain, known);
      if (score <= (known.length < 9 ? 1 : 2) && score < bestScore) {
        best = known;
        bestScore = score;
      }
    });
    return best ? `${email.slice(0, at + 1)}${best}` : '';
  }

  // Consent-respecting analytics, the same pattern as the other homepage element: nothing is sent without
  // analytics consent, and no email or other personal data is ever part of an event.
  function bwhAnalyticsConsent() {
    try {
      const manager = window.consentPolicyManager;
      const response = manager && typeof manager.getCurrentConsentPolicy === 'function'
        ? manager.getCurrentConsentPolicy()
        : null;
      const policy = response && response.policy ? response.policy : response;
      return !!(policy && policy.analytics === true);
    } catch (_error) {
      return false;
    }
  }

  function bwhTrack(eventName, details) {
    if (!bwhAnalyticsConsent()) return false;
    const values = details || {};
    const payload = { event: String(eventName).slice(0, 80), component: 'home_then_now' };
    ['section', 'item', 'row', 'path', 'placement'].forEach((key) => {
      const value = values[key];
      if (typeof value === 'string' && value) payload[key] = value.slice(0, 80);
    });
    ['position', 'max_index'].forEach((key) => {
      const value = values[key];
      if (typeof value === 'number' && Number.isFinite(value)) payload[key] = value;
    });
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', payload.event, { ...payload });
      } else {
        if (!Array.isArray(window.dataLayer)) window.dataLayer = [];
        window.dataLayer.push(payload);
      }
      return true;
    } catch (_error) {
      return false;
    }
  }

  // ---- markup -----------------------------------------------------------------------------

  function bwhHero(d) {
    const h = d.hero;
    const w = Number(h.w) || 1200;
    const ht = Number(h.h) || 750;
    return `
    <section class="bwh-band bwh-hero" id="bwh-top">
      <div class="bwh-hero__grid">
        <span class="bwh-eyebrow">OLD PHOTOS · TODAY'S STREETS</span>
        <h1 class="bwh-h1" id="bwh-title">Berlin, then and now.</h1>
        <p class="bwh-lead bwh-hero__lead">Every reel I make starts with an old photograph and a place you can still stand on today. Take one home, follow along, or walk it with me.</p>
        <figure class="bwh-hero__figure">
          <div class="bwh-hero__pair">
            <div class="bwh-hero__frame">
              <img src="${bwhEsc(bwhSrc(h.img1928))}" alt="${bwhEsc(h.alt1928)}" width="${w}" height="${ht}" fetchpriority="high">
              <span class="bwh-tag">1928</span>
            </div>
            <div class="bwh-hero__frame">
              <img src="${bwhEsc(bwhSrc(h.imgToday))}" alt="${bwhEsc(h.altToday)}" width="${w}" height="${ht}">
              <span class="bwh-tag">TODAY</span>
            </div>
          </div>
          <figcaption class="bwh-caption">${bwhEsc(h.caption)}</figcaption>
        </figure>
        <div class="bwh-hero__ctas">
          <a class="bwh-btn bwh-btn--yellow" href="${bwhEsc(bwhHref(h.streetHref))}" data-bwh-section="hero" data-bwh-item="find-your-street-1928">Find your street in 1928</a>
          <a class="bwh-btn bwh-btn--outline" href="${bwhEsc(bwhHref(h.postersHref))}" data-bwh-section="hero" data-bwh-item="shop-the-posters">Shop the posters</a>
        </div>
      </div>
    </section>`;
  }

  function bwhReel(r, i) {
    const product = bwhHref(r.productHref);
    return `
        <article class="bwh-reel bwh-lift">
          <a class="bwh-reel__link" href="#bwh-reels" role="button" aria-label="Play the reel: ${bwhEsc(r.title)}" data-bwh-reel="${i}" data-bwh-section="reels" data-bwh-item="${bwhEsc(r.title)}" data-bwh-position="${i + 1}">
            <img src="${bwhEsc(bwhSrc(r.img))}" alt="" width="448" height="720" loading="lazy" decoding="async">
            <span class="bwh-len">${BWH_PLAY}${bwhEsc(r.len)}</span>
          </a>
          <span class="bwh-reel__title">${bwhEsc(r.title)}</span>
          <a class="bwh-reel__product" href="${bwhEsc(product)}" data-bwh-section="reels" data-bwh-item="${bwhEsc(r.productLabel)}" data-bwh-position="${i + 1}"><span>${bwhEsc(r.productLabel)}</span><span aria-hidden="true">→</span></a>
        </article>`;
  }

  function bwhReels(d) {
    return `
    <section class="bwh-band bwh-reels" id="bwh-reels" aria-labelledby="bwh-reels-title">
      <div class="bwh-head">
        <div class="bwh-head__copy">
          <div class="bwh-row-top">
            <span class="bwh-eyebrow">FROM MY REELS<span class="bwh-count bwh-narrow"> · ${bwhEsc(d.reels.length)}</span></span>
            ${BWH_CHIP}
          </div>
          <h2 class="bwh-h2" id="bwh-reels-title">Watch the story, then take it home.</h2>
        </div>
      </div>
      <div class="bwh-row bwh-row--reels" data-bwh-row="reels">${d.reels.map(bwhReel).join('')}</div>
      <div class="bwh-bar bwh-narrow" aria-hidden="true"><span class="bwh-bar__fill"></span></div>
      <dialog class="bwh-player" aria-label="Reel player">
        <div class="bwh-player__box">
          <button class="bwh-player__close" type="button" aria-label="Close the reel">×</button>
          <video class="bwh-player__video" playsinline controls preload="none"></video>
          <p class="bwh-player__title"></p>
          <div class="bwh-player__actions">
            <a class="bwh-player__product" href="#" data-bwh-section="reel-player"></a>
            <button class="bwh-player__next" type="button">Next reel →</button>
          </div>
        </div>
      </dialog>
    </section>`;
  }

  function bwhPoster(p, i) {
    return `
        <a class="bwh-poster bwh-lift" href="${bwhEsc(bwhHref(p.href))}" data-bwh-section="posters" data-bwh-item="${bwhEsc(p.name)}" data-bwh-position="${i + 1}">
          <img src="${bwhEsc(bwhSrc(p.img))}" alt="${bwhEsc(p.alt)}" width="460" height="575" loading="lazy" decoding="async">
          <span class="bwh-poster__name">${bwhEsc(p.name)}</span>
          <span class="bwh-poster__price">${bwhEsc(p.price)}</span>
        </a>`;
  }

  function bwhPosters(d) {
    const count = bwhEsc(d.postersCount);
    const all = bwhEsc(bwhHref(d.postersAllHref));
    return `
    <section class="bwh-band bwh-posters" id="bwh-posters" aria-labelledby="bwh-posters-title">
      <div class="bwh-head">
        <div class="bwh-head__copy">
          <div class="bwh-row-top">
            <span class="bwh-eyebrow">POSTERS<span class="bwh-count bwh-narrow"> · ${count}</span></span>
            ${BWH_CHIP}
          </div>
          <h2 class="bwh-h2 bwh-h2--green" id="bwh-posters-title">Berlin on your wall</h2>
          <p class="bwh-lead">Each one as a printed poster or a file you print yourself.</p>
        </div>
        <a class="bwh-head-link bwh-wide" href="${all}" data-bwh-section="posters" data-bwh-item="see-all-posters">See all ${count} posters →</a>
      </div>
      <div class="bwh-row bwh-row--posters" data-bwh-row="posters">
        ${d.posters.map(bwhPoster).join('')}
        <a class="bwh-tile bwh-narrow" href="${all}" data-bwh-section="posters" data-bwh-item="see-all-posters">See all ${count} posters →</a>
      </div>
      <div class="bwh-bar bwh-narrow" aria-hidden="true"><span class="bwh-bar__fill"></span></div>
    </section>`;
  }

  function bwhDoor(x, i) {
    return `
        <a class="bwh-door bwh-lift" href="${bwhEsc(bwhHref(x.href))}" data-bwh-section="shop" data-bwh-item="${bwhEsc(x.name)}" data-bwh-position="${i + 1}">
          <img src="${bwhEsc(bwhSrc(x.img))}" alt="" width="600" height="420" loading="lazy" decoding="async">
          <span class="bwh-door__name">${bwhEsc(x.name)}</span>
          <span class="bwh-door__line">${bwhEsc(x.line)}</span>
        </a>`;
  }

  function bwhShop(d) {
    return `
    <section class="bwh-band bwh-shop" id="bwh-shop" aria-labelledby="bwh-shop-title">
      <h2 class="bwh-h2 bwh-shop__title" id="bwh-shop-title">More from the store</h2>
      <div class="bwh-doors">${d.doors.map(bwhDoor).join('')}</div>
      <a class="bwh-btn bwh-btn--outline bwh-shop__store" href="${bwhEsc(bwhHref(d.storeHref))}" data-bwh-section="shop" data-bwh-item="open-the-store">Open the store</a>
    </section>`;
  }

  function bwhWalk(d) {
    const w = d.walk;
    return `
    <section class="bwh-band bwh-walk" id="bwh-walk">
      <div class="bwh-letter" id="bwh-letter">
        <span class="bwh-eyebrow bwh-letter__eyebrow">Walk of Berlin Weekly</span>
        <h2 class="bwh-h2 bwh-h2--light" id="bwh-letter-title">One Berlin story a week.</h2>
        <p class="bwh-letter__lead">The place, the old photograph and what to look for when you pass it. In your inbox, free.</p>
        <form class="bwh-letter__form" novalidate>
          <label class="bwh-letter__label" for="bwh-letter-email">Your email</label>
          <div class="bwh-letter__row">
            <input class="bwh-letter__input" id="bwh-letter-email" type="email" name="email" autocomplete="email" placeholder="you@example.com" required>
            <button class="bwh-letter__submit" type="submit">Send me the stories</button>
          </div>
          <label class="bwh-letter__consent">
            <input type="checkbox" name="consent" required>
            <span>${bwhEsc(BWH_LETTER.consentText)} Read the <a href="https://www.walkofberlin.com/privacy-policy" target="_blank" rel="noopener">Privacy Policy</a>.</span>
          </label>
          <label class="bwh-hp" aria-hidden="true">Leave this empty<input type="text" name="website" tabindex="-1" autocomplete="off"></label>
          <p class="bwh-letter__msg" role="status" aria-live="polite"></p>
        </form>
      </div>
      <div class="bwh-walkcard">
        <span class="bwh-eyebrow">WALK WITH ME</span>
        <img class="bwh-walkcard__img" src="${bwhEsc(bwhSrc(w.img))}" alt="${bwhEsc(w.alt)}" width="1000" height="800" loading="lazy" decoding="async">
        <div class="bwh-walkcard__text">
          <h2 class="bwh-h2 bwh-h2--green" id="bwh-walk-title">See the same places on foot</h2>
          <p class="bwh-lead">Berlin Then and Now is my small-group walk from the World Clock to Hackescher Markt, with an archive photo at every stop. Or take an audio walk at your own pace.</p>
          <div class="bwh-walkcard__ctas">
            <a class="bwh-btn bwh-btn--green" href="${bwhEsc(bwhHref(w.datesHref))}" data-bwh-section="walk" data-bwh-item="see-walk-dates">See walk dates</a>
            <a class="bwh-btn bwh-btn--outline" href="${bwhEsc(bwhHref(w.audioHref))}" data-bwh-section="walk" data-bwh-item="audio-walks">Audio walks</a>
          </div>
        </div>
      </div>
    </section>`;
  }

  function bwhPicks(list) {
    return list.map((b, i) => `
            <a class="bwh-pick" href="${bwhEsc(bwhHref(b.href))}" data-bwh-section="start" data-bwh-item="${bwhEsc(b.title)}" data-bwh-position="${i + 1}">
              <img src="${bwhEsc(bwhSrc(b.img))}" alt="" width="240" height="240" loading="lazy" decoding="async">
              <span class="bwh-pick__copy"><span class="bwh-pick__tag">${bwhEsc(b.tag)}</span><span class="bwh-pick__title">${bwhEsc(b.title)}</span></span>
              <span class="bwh-pick__arrow" aria-hidden="true">→</span>
            </a>`).join('');
  }

  function bwhTool(t, i) {
    return `
        <a class="bwh-tool bwh-lift" href="${bwhEsc(bwhHref(t.href))}" style="background:${bwhColor(t.bg, '#EAF0E2')};color:${bwhColor(t.fg, '#123D18')}" data-bwh-section="tools" data-bwh-item="${bwhEsc(t.name)}" data-bwh-position="${i + 1}">
          <span class="bwh-tool__kind">${bwhEsc(t.kind)}</span>
          <span class="bwh-tool__body"><span class="bwh-tool__name">${bwhEsc(t.name)}</span><span class="bwh-tool__line">${bwhEsc(t.line)}</span></span>
        </a>`;
  }

  function bwhTools(d) {
    const all = bwhEsc(bwhHref(d.toolsAllHref));
    return `
      <div class="bwh-tools" id="bwh-tools">
        <div class="bwh-head">
          <div class="bwh-head__copy">
            <div class="bwh-row-top">
              <span class="bwh-eyebrow">FREE TOOLS</span>
              ${BWH_CHIP}
            </div>
            <h3 class="bwh-h3" id="bwh-tools-title">Maps, finders and one game</h3>
          </div>
          <a class="bwh-head-link bwh-wide" href="${all}" data-bwh-section="tools" data-bwh-item="all-free-tools">All free tools →</a>
        </div>
        <div class="bwh-row bwh-row--tools" data-bwh-row="tools">
          ${d.tools.map(bwhTool).join('')}
          <a class="bwh-tile bwh-narrow" href="${all}" data-bwh-section="tools" data-bwh-item="all-free-tools">All free tools →</a>
        </div>
        <div class="bwh-bar bwh-narrow" aria-hidden="true"><span class="bwh-bar__fill"></span></div>
      </div>`;
  }

  function bwhStart(d) {
    const blog = bwhEsc(bwhHref(d.blogHref));
    return `
    <section class="bwh-band bwh-start" id="bwh-start" aria-labelledby="bwh-start-title">
      <div class="bwh-start__head">
        <span class="bwh-eyebrow">START HERE</span>
        <h2 class="bwh-h2 bwh-h2--green" id="bwh-start-title">Hundreds of Berlin guides. Start with these.</h2>
        <p class="bwh-lead bwh-phone">Tell me which Berlin you need and I’ll show you the three I would read first.</p>
        <p class="bwh-lead bwh-tablet-up">The three I would read first, for a visit and for life here.</p>
      </div>
      <a class="bwh-btn bwh-btn--outline bwh-start__blog-top bwh-tablet-up" href="${blog}" data-bwh-section="start" data-bwh-item="browse-the-blog">Browse the blog</a>
      <div class="bwh-tabs bwh-phone" role="tablist" aria-label="Start here">
        <button class="bwh-tab" type="button" role="tab" id="bwh-tab-visit" aria-controls="bwh-panel-visit" aria-selected="true" tabindex="0" data-bwh-tab="visit">I’m visiting</button>
        <button class="bwh-tab" type="button" role="tab" id="bwh-tab-live" aria-controls="bwh-panel-live" aria-selected="false" tabindex="-1" data-bwh-tab="live">I live here</button>
      </div>
      <div class="bwh-panel" role="tabpanel" id="bwh-panel-visit" aria-labelledby="bwh-tab-visit" data-bwh-panel="visit">
        <h3 class="bwh-col-title bwh-tablet-up">I’m visiting</h3>
        <div class="bwh-picks">${bwhPicks(d.visit)}</div>
      </div>
      <div class="bwh-panel" role="tabpanel" id="bwh-panel-live" aria-labelledby="bwh-tab-live" data-bwh-panel="live" hidden>
        <h3 class="bwh-col-title bwh-tablet-up">I live here</h3>
        <div class="bwh-picks">${bwhPicks(d.live)}</div>
      </div>
      <a class="bwh-btn bwh-btn--outline bwh-phone bwh-start__blog" href="${blog}" data-bwh-section="start" data-bwh-item="browse-the-blog">Browse the blog</a>
      ${bwhTools(d)}
    </section>`;
  }

  // Image credits live in the site footer (Yusuf, 29 Oct 2026): the header script puts an "Image credits" item into the
  // footer's bottom row on "/" and fills it from window.__bwHomeCreditsHtml.
  function bwhCreditsHtml(d) {
    const list = Array.isArray(d.credits) ? d.credits : [];
    return list.map((c) => {
      const text = [c.what, c.creator, c.source, c.licence].filter(Boolean).map(bwhEsc).join('. ');
      const url = bwhExternal(c.url);
      return `<p>${text}.${url ? ` <a href="${bwhEsc(url)}" target="_blank" rel="noopener">Source</a>` : ''}</p>`;
    }).join('');
  }

  function bwhMarkup(d) {
    return [bwhHero(d), bwhReels(d), bwhPosters(d), bwhShop(d), bwhWalk(d), bwhStart(d)].join('\n');
  }

  // ---- element ----------------------------------------------------------------------------

  class BWHomeThenNowElement extends HTMLElement {
    connectedCallback() {
      if (!this._bwhReady) {
        this._bwhReady = true;
        this._bwhStarted = new Date().toISOString();
        this._bwhTab = 'visit';
        this._bwhObserver = null;
        this.dataset.bwhRelease = DATA.release || '';
        this.innerHTML = bwhMarkup(DATA);
        this._bwhRows = new Map();
        this.querySelectorAll('[data-bwh-row]').forEach((row) => {
          this._bwhRows.set(row, { seen: false, max: 0, sent: false, nudged: false });
        });
        this._bwhBind();
      }
      window.__bwHomeCreditsHtml = bwhCreditsHtml(DATA);
      this._bwhWatch();
    }

    disconnectedCallback() {
      if (!this.isConnected && location.pathname !== '/') window.__bwHomeCreditsHtml = '';
      this._bwhStop();
    }

    _bwhBind() {
      this.addEventListener('click', (event) => {
        const tab = event.target.closest ? event.target.closest('[role="tab"]') : null;
        if (tab && this.contains(tab)) {
          this._bwhSelectTab(tab.dataset.bwhTab, true, false);
          return;
        }
        const reel = event.target.closest ? event.target.closest('a[data-bwh-reel]') : null;
        if (reel && this.contains(reel)) {
          event.preventDefault();
          this._bwhOpenReel(Number(reel.dataset.bwhReel), reel);
          return;
        }
        if (event.target.closest && event.target.closest('.bwh-player__close')) { this._bwhCloseReel(); return; }
        if (event.target.closest && event.target.closest('.bwh-player__next')) {
          this._bwhOpenReel((this._bwhReelIndex + 1) % DATA.reels.length, null);
          return;
        }
        if (event.target.classList && (event.target.classList.contains('bwh-player') || event.target.classList.contains('bwh-player__box'))) { this._bwhCloseReel(); return; }
        const link = event.target.closest ? event.target.closest('a[data-bwh-section]') : null;
        if (!link || !this.contains(link)) return;
        bwhTrack('bw_home_tn_click', {
          section: link.dataset.bwhSection,
          item: link.dataset.bwhItem,
          position: link.dataset.bwhPosition ? Number(link.dataset.bwhPosition) : undefined
        });
      });

      this.addEventListener('keydown', (event) => {
        const tab = event.target.closest ? event.target.closest('[role="tab"]') : null;
        if (!tab) return;
        const tabs = Array.from(this.querySelectorAll('[role="tab"]'));
        let index = tabs.indexOf(tab);
        if (event.key === 'ArrowRight') index = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') index = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') index = 0;
        else if (event.key === 'End') index = tabs.length - 1;
        else return;
        event.preventDefault();
        this._bwhSelectTab(tabs[index].dataset.bwhTab, true, true);
      });

      this.addEventListener('submit', (event) => {
        const form = event.target;
        if (!form || !form.classList || !form.classList.contains('bwh-letter__form')) return;
        event.preventDefault();
        this._bwhSubmit(form);
      });

      this._bwhRows.forEach((state, row) => {
        row.addEventListener('scroll', () => {
          this._bwhDepth(row);
          this._bwhProgress(row);
        }, { passive: true });
      });

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') this._bwhFlush();
      });
      window.addEventListener('pagehide', () => this._bwhFlush());
    }

    _bwhSelectTab(name, user, focus) {
      if (!name) return;
      const previous = this._bwhTab;
      this._bwhTab = name;
      this.querySelectorAll('[role="tab"]').forEach((tab) => {
        const on = tab.dataset.bwhTab === name;
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
        tab.tabIndex = on ? 0 : -1;
        if (on && focus) tab.focus();
      });
      this.querySelectorAll('[data-bwh-panel]').forEach((panel) => {
        panel.hidden = panel.dataset.bwhPanel !== name;
      });
      if (user && name !== previous) bwhTrack('bw_home_tn_path', { path: name });
    }

    // One nudge per swipe row, the first time the row is half on screen (phone and tablet only,
    // never with reduced motion). Depth is counted per row and sent once, when the page hides.
    _bwhWatch() {
      this._bwhStop();
      if (!('IntersectionObserver' in window)) return;
      this._bwhObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const row = entry.target;
          const state = this._bwhRows.get(row);
          if (!state || !entry.isIntersecting || entry.intersectionRatio < 0.5) return;
          state.seen = true;
          if (!state.nudged && bwhMatch(BWH_NARROW) && !bwhMatch(BWH_REDUCED)) {
            state.nudged = true;
            row.classList.add('bwh-nudge');
            window.setTimeout(() => row.classList.remove('bwh-nudge'), 1600);
          }
          this._bwhDepth(row);
        });
      }, { threshold: [0.5] });
      this._bwhRows.forEach((state, row) => this._bwhObserver.observe(row));
    }

    _bwhStop() {
      if (this._bwhObserver) this._bwhObserver.disconnect();
      this._bwhObserver = null;
      this._bwhCloseReel();
    }

    // In-page reel player (Yusuf, 29 Oct 2026: visitors stay on the site instead of going to Instagram). One <dialog> in the
    // reels section, opened modal so it sits in the top layer above Wix's containers. The video only loads on open.
    _bwhOpenReel(index, opener) {
      const dialog = this.querySelector('.bwh-player');
      const reel = DATA.reels[index];
      if (!dialog || !reel || !reel.video) return;
      const video = dialog.querySelector('video');
      if (opener) this._bwhReelOpener = opener;
      this._bwhReelIndex = index;
      this._bwhReelMarks = new Set();
      video.src = bwhSrc(reel.video);
      video.poster = bwhSrc(reel.img);
      dialog.querySelector('.bwh-player__title').textContent = reel.title;
      const product = dialog.querySelector('.bwh-player__product');
      product.href = bwhHref(reel.productHref);
      product.textContent = `${reel.productLabel} →`;
      product.dataset.bwhItem = reel.productLabel;
      product.dataset.bwhPosition = String(index + 1);
      if (!dialog.open) {
        dialog.showModal();
        this._bwhOverflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = 'hidden';
        if (!dialog.bwhBound) {
          dialog.bwhBound = true;
          dialog.addEventListener('close', () => this._bwhCloseReel());
          video.addEventListener('timeupdate', () => {
            if (!video.duration) return;
            const pct = Math.floor((video.currentTime / video.duration) * 4) * 25;
            if (pct > 0 && !this._bwhReelMarks.has(pct)) {
              this._bwhReelMarks.add(pct);
              bwhTrack('bw_home_tn_reel_progress', { item: DATA.reels[this._bwhReelIndex].title, pct });
            }
          });
          video.addEventListener('ended', () => {
            if (!this._bwhReelMarks.has(100)) bwhTrack('bw_home_tn_reel_progress', { item: DATA.reels[this._bwhReelIndex].title, pct: 100 });
            this._bwhReelMarks.add(100);
          });
        }
      }
      const played = video.play();
      if (played && typeof played.catch === 'function') played.catch(() => {});
      bwhTrack('bw_home_tn_reel_play', { item: reel.title, position: index + 1 });
    }

    _bwhCloseReel() {
      const dialog = this.querySelector('.bwh-player');
      if (!dialog) return;
      const video = dialog.querySelector('video');
      if (video && video.getAttribute('src')) {
        video.pause();
        video.removeAttribute('src');
        video.load();
      }
      if (dialog.open) dialog.close();
      if (this._bwhOverflow !== undefined) {
        document.documentElement.style.overflow = this._bwhOverflow;
        this._bwhOverflow = undefined;
        const opener = this._bwhReelOpener;
        this._bwhReelOpener = null;
        if (opener && opener.isConnected) opener.focus({ preventScroll: true });
      }
    }

    _bwhDepth(row) {
      const state = this._bwhRows.get(row);
      if (!state || !state.seen || !bwhMatch(BWH_NARROW)) return;
      const box = row.getBoundingClientRect();
      Array.from(row.children).forEach((card, index) => {
        const r = card.getBoundingClientRect();
        const shown = Math.min(r.right, box.right) - Math.max(r.left, box.left);
        if (r.width > 0 && shown >= r.width * 0.5) state.max = Math.max(state.max, index);
      });
    }

    // Progress bar for browsers without scroll-driven animations (CSS does the work otherwise).
    _bwhProgress(row) {
      if (BWH_SCROLL_DRIVEN) return;
      const fill = row.parentElement ? row.parentElement.querySelector('.bwh-bar__fill') : null;
      const room = row.scrollWidth - row.clientWidth;
      if (fill) fill.style.transform = `scaleX(${(0.22 + 0.78 * (room > 0 ? row.scrollLeft / room : 0)).toFixed(3)})`;
    }

    _bwhFlush() {
      if (!this._bwhRows) return;
      this._bwhRows.forEach((state, row) => {
        if (!state.seen || state.sent) return;
        state.sent = true;
        bwhTrack('bw_home_tn_row_depth', { row: row.dataset.bwhRow, max_index: state.max });
      });
    }

    _bwhSubmit(form) {
      const input = form.elements.email;
      const consent = form.elements.consent;
      const honey = form.elements.website;
      const button = form.querySelector('.bwh-letter__submit');
      const msg = form.querySelector('.bwh-letter__msg');
      const say = (text, isError) => {
        msg.className = isError ? 'bwh-letter__msg bwh-letter__msg--err' : 'bwh-letter__msg';
        msg.textContent = text;
      };
      const email = String(input.value || '').trim().toLowerCase();
      if (!email || email.indexOf('@') < 1) {
        say('That email does not look right. Check it and try again.', true);
        return;
      }
      if (!consent.checked) {
        say('Tick the box so I am allowed to email you.', true);
        return;
      }
      const fixed = bwhSuggestEmail(email);
      if (fixed && form.dataset.bwhKept !== email) {
        form.dataset.bwhKept = email;
        say(`Did you mean ${fixed}? Fix the address, or send it again to keep ${email}.`, false);
        return;
      }
      button.disabled = true;
      say('Sending.', false);
      fetch(`${BWH_LETTER.endpoint}?action=submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          consent: true,
          consentVersion: BWH_LETTER.consentVersion,
          assetId: BWH_LETTER.assetId,
          assetVersion: BWH_LETTER.assetVersion,
          sourceSlug: '',
          sourceUrl: window.location.href,
          placement: BWH_LETTER.placement,
          variant: BWH_LETTER.placement,
          analyticsConsentAtSubmit: false,
          screenWidth: Number(window.innerWidth || 0),
          screenHeight: Number(window.innerHeight || 0),
          website: honey ? String(honey.value || '') : '',
          startedAt: this._bwhStarted,
          submittedAt: new Date().toISOString()
        })
      }).then((response) => {
        if (!response.ok) throw new Error(`submit ${response.status}`);
        return response.json().catch(() => ({}));
      }).then(() => {
        // The bar on other pages reads this key and stays closed for this browser.
        try { window.localStorage.setItem(BWH_LETTER.joinedKey, String(Date.now())); } catch (_error) { /* storage can be blocked */ }
        const done = document.createElement('p');
        done.className = 'bwh-letter__done';
        done.setAttribute('role', 'status');
        done.innerHTML = '<strong>Check your inbox.</strong> Click the link in my email to confirm, and the next letter reaches you on Monday morning. Not there in a minute? Look in your Spam or Promotions folder.';
        form.replaceWith(done);
        bwhTrack('bw_home_tn_letter_submit', { placement: BWH_LETTER.placement });
      }).catch(() => {
        button.disabled = false;
        say('That did not go through. Try again in a moment.', true);
      });
    }
  }

  if (!customElements.get('bw-home-then-now')) {
    customElements.define('bw-home-then-now', BWHomeThenNowElement);
  }
})();
