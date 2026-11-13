/* Walk of Berlin homepage, "Berlin, then and now" (release home-then-now-20261029).
 * Custom element <bw-home-then-now>, light DOM. Classes start with bwh-; every style lives in
 * home-then-now.css under bw-home-then-now. Dependency-free. The live site header and footer
 * stay outside this element. DATA is rewritten from data/home.json by sync-data.mjs: keep it as
 * one "  const DATA = {...};" statement at this indentation.
 */
(() => {
  'use strict';

  const DATA = {
    "release": "home-then-now-20261113-slider2",
    "hero": {
      "img1928": "assets/hero-1928.webp",
      "imgToday": "assets/hero-today.webp",
      "w": 1200,
      "h": 750,
      "alt1928": "The Reichstag from above around 1928, with a round square and the Victory Column to the west of it",
      "altToday": "The Reichstag from above today, with its glass dome, Bundestag buildings along the Spree and an open lawn to the west",
      "caption": "The Reichstag from above, 1928 and today",
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
        "video": "video/reel-world-clock.mp4",
        "giftProductLabel": "World Clock poster · Gift Week from €21.50"
      },
      {
        "title": "The clock almost nobody could read",
        "len": "1:34",
        "href": "https://www.instagram.com/reel/Dd5kfKwk-P8/",
        "img": "assets/reel-berlin-uhr.webp",
        "productLabel": "Berlin-Uhr poster · from €26.90",
        "productHref": "https://www.walkofberlin.com/product-page/berlin-uhr-art-print-berlin-reels-collection",
        "video": "video/reel-berlin-uhr.mp4",
        "giftProductLabel": "Berlin-Uhr poster · Gift Week from €21.50"
      },
      {
        "title": "No train stopped here for 28 years",
        "len": "0:42",
        "href": "https://www.instagram.com/reel/DcsncQ7shNh/",
        "img": "assets/reel-ghost-stations.webp",
        "productLabel": "Ghost Stations file · €6.90",
        "productHref": "https://www.walkofberlin.com/product-page/ghost-stations-printable",
        "video": "video/reel-ghost-stations.mp4",
        "giftProductLabel": "Ghost Stations file · Gift Week €5.50"
      },
      {
        "title": "Berlin’s tram map still shows the Wall",
        "len": "0:36",
        "href": "https://www.instagram.com/reel/DdQapWighJ-/",
        "img": "assets/reel-tram-map.webp",
        "productLabel": "Tram Map file · €6.90",
        "productHref": "https://www.walkofberlin.com/product-page/berlin-tram-map-printable",
        "video": "video/reel-tram-map.mp4",
        "giftProductLabel": "Tram Map file · Gift Week €5.50"
      },
      {
        "title": "East Berlin, west of the Wall",
        "len": "0:49",
        "href": "https://www.instagram.com/reel/Dc_i3LtgRlR/",
        "img": "assets/reel-osman-kalin.webp",
        "productLabel": "Treehouse file · €6.90",
        "productHref": "https://www.walkofberlin.com/product-page/osman-kal%C4%B1n-s-treehouse-printable",
        "video": "video/reel-osman-kalin.mp4",
        "giftProductLabel": "Treehouse file · Gift Week €5.50"
      }
    ],
    "posters": [
      {
        "name": "Kottbusser Tor",
        "href": "https://www.walkofberlin.com/product-page/kottbusser-tor-berlin-art-print",
        "img": "assets/poster-kottbusser-tor.webp",
        "alt": "Kottbusser Tor poster in a room",
        "price": "from €26.90",
        "giftPrice": "Gift Week from €21.50"
      },
      {
        "name": "Berolina",
        "href": "https://www.walkofberlin.com/product-page/berolina-modernist-berlin-art-print",
        "img": "assets/poster-berolina.webp",
        "alt": "Berolina poster in a room",
        "price": "from €29.90",
        "giftPrice": "Gift Week from €23.90"
      },
      {
        "name": "Siegessäule",
        "href": "https://www.walkofberlin.com/product-page/siegessaeule-berlin-art-print",
        "img": "assets/poster-siegessaeule.webp",
        "alt": "Siegessäule poster in a room",
        "price": "from €26.90",
        "giftPrice": "Gift Week from €21.50"
      },
      {
        "name": "Berlin in Pink",
        "href": "https://www.walkofberlin.com/product-page/berlin-in-pink-berlin-art-print",
        "img": "assets/poster-berlin-in-pink.webp",
        "alt": "Berlin in Pink poster in a room",
        "price": "from €26.90",
        "giftPrice": "Gift Week from €21.50"
      },
      {
        "name": "Gleisdreieck",
        "href": "https://www.walkofberlin.com/product-page/gleisdreieck-berlin-art-print",
        "img": "assets/poster-gleisdreieck.webp",
        "alt": "Gleisdreieck poster in a room",
        "price": "from €26.90",
        "giftPrice": "Gift Week from €21.50"
      },
      {
        "name": "Two U-Bahn Profiles",
        "href": "https://www.walkofberlin.com/product-page/two-berlin-u-bahn-profiles-berlin-art-print",
        "img": "assets/poster-u-bahn-two-sizes.webp",
        "alt": "Two U-Bahn Profiles poster in a room",
        "price": "from €26.90",
        "giftPrice": "Gift Week from €21.50"
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
        "name": "2027 calendars",
        "line": "Your own places, or one district a month",
        "href": "https://www.walkofberlin.com/category/all-products?tab=calendar",
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
        "title": "Gas lamps: a November evening at Chamissoplatz",
        "href": "https://walkofberlin.com/post/gas-lamps-in-berlin",
        "img": "https://static.wixstatic.com/media/5a08a3_a0b0477e057344bf92735258eb7765ba~mv2.jpg/v1/fill/w_980,h_650,fp_0.50_0.50,q_88,enc_avif,quality_auto/cover.jpg"
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
        "fg": "#FAFAF5",
        "img": "assets/tile-berghain-bouncer.webp"
      },
      {
        "kind": "MAP",
        "name": "Christmas Markets",
        "line": "15 markets, filter by price and size",
        "href": "https://www.walkofberlin.com/tools/christmas-markets-map",
        "bg": "#FFE600",
        "fg": "#102414",
        "img": "assets/tile-christmas-markets.webp"
      },
      {
        "kind": "GUIDE",
        "name": "Berlin Safety",
        "line": "Neighbourhood by neighbourhood",
        "href": "https://www.walkofberlin.com/tools/berlin-safety",
        "bg": "#123D18",
        "fg": "#FAFAF5",
        "img": "assets/tile-berlin-safety.webp"
      },
      {
        "kind": "FINDER",
        "name": "Toilet Finder",
        "line": "Nearest public toilet, free ones too",
        "href": "https://www.walkofberlin.com/tools/berlin-public-toilets",
        "bg": "#EAF0E2",
        "fg": "#123D18",
        "img": "assets/tile-toilet-finder.webp"
      }
    ],
    "toolsAllHref": "https://www.walkofberlin.com/berlin-tools",
    "credits": [
      {
        "what": "The Reichstag from above, about 1928 and 2026",
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
        "what": "Gas lamps preview: Berlin at night from the International Space Station, 6 April 2013",
        "creator": "NASA Johnson Space Center, Earth Science and Remote Sensing Unit",
        "source": "NASA, via the linked article",
        "licence": "Public domain",
        "url": "https://walkofberlin.com/post/gas-lamps-in-berlin"
      },
      {
        "what": "Club dress codes preview and Berghain Bouncer tile",
        "creator": "Photo by Darkroomduck",
        "source": "Wikimedia Commons, cropped",
        "licence": "CC BY-SA 4.0",
        "url": "https://www.walkofberlin.com/post/berlin-club-dress-codes-by-venue"
      },
      {
        "what": "Dein Berlin 2027 calendar preview: Chamissoplatz from above, about 1928 and 2026",
        "creator": "Geoportal Berlin (aerial photographs), calendar design my own",
        "source": "Cropped, shown on a drawn wall",
        "licence": "Datenlizenz Deutschland Zero 2.0",
        "url": ""
      },
      {
        "what": "Christmas Markets tile: Gendarmenmarkt at dusk",
        "creator": "Adobe Stock 311145723",
        "source": "Cropped",
        "licence": "Adobe Stock Standard licence",
        "url": ""
      },
      {
        "what": "Berlin Safety tile: Oberbaum Bridge",
        "creator": "Adobe Stock 428386996",
        "source": "Cropped",
        "licence": "Adobe Stock Standard licence",
        "url": ""
      },
      {
        "what": "Toilet Finder tile",
        "creator": "Unsplash, via the Wix media library",
        "source": "Cropped",
        "licence": "Unsplash licence",
        "url": "https://www.walkofberlin.com/post/public-toilets-in-berlin"
      },
      {
        "what": "Everything else",
        "creator": "My own photographs and designs, or pictures from the linked posts and product pages",
        "source": "",
        "licence": "",
        "url": ""
      }
    ],
    "calFeature": {
      "name": "Dein Berlin 2027",
      "eyebrow": "NEW FOR 2027 · MADE WITH YOUR PLACES",
      "line": "A wall calendar of your own Berlin places. Every month shows one of them from above, about 1928 and today. Preview all twelve months before you order.",
      "cta": "Make your calendar",
      "href": "https://www.walkofberlin.com/product-page/dein-berlin-2027-personalised-wall-calendar",
      "img": "assets/cal-feature.webp",
      "alt": "Illustrated preview of the Dein Berlin 2027 wall calendar on a wall, open at January with Chamissoplatz from above in 1928 and today"
    },
    "slides": [
      {
        "key": "1928",
        "label": "1928",
        "eyebrow": "OLD PHOTOS · TODAY'S STREETS",
        "title": "Berlin, then and now.",
        "lead": "Every reel I make starts with an old photograph and a place you can still stand on today. Your own street is in the 1928 aerial photos too.",
        "cta": {
          "text": "Find your street in 1928",
          "href": "https://www.walkofberlin.com/product-page/your-berlin-street-in-1928-personalised-aerial-print-30-x-40-cm"
        },
        "visual": {
          "type": "pair"
        }
      },
      {
        "key": "posters",
        "label": "Posters",
        "eyebrow": "POSTERS · PRINTED OR PRINT AT HOME",
        "title": "Berlin on your wall.",
        "lead": "Landmarks, districts and everyday Berlin corners. Printed and posted to you, or a file you print at home.",
        "cta": {
          "text": "Shop the posters",
          "href": "https://www.walkofberlin.com/category/all-products?tab=print"
        },
        "cta2": {
          "text": "See a few favourites",
          "href": "#bwh-posters"
        },
        "visual": {
          "type": "fan",
          "items": [
            {
              "img": "assets/poster-siegessaeule.webp",
              "alt": "Siegessäule poster in a room",
              "w": 460,
              "h": 575
            },
            {
              "img": "assets/poster-berlin-in-pink.webp",
              "alt": "Berlin in Pink poster in a room",
              "w": 460,
              "h": 575
            },
            {
              "img": "assets/poster-kottbusser-tor.webp",
              "alt": "Kottbusser Tor poster in a room",
              "w": 460,
              "h": 575
            }
          ]
        }
      },
      {
        "key": "calendars",
        "label": "Calendars",
        "eyebrow": "2027 WALL CALENDARS",
        "title": "Your Berlin, month by month.",
        "lead": "Dein Berlin 2027 shows your own places from above, about 1928 and today. The Berlin 2027 wall calendar brings one district a month.",
        "cta": {
          "text": "See the calendars",
          "href": "https://www.walkofberlin.com/category/all-products?tab=calendar"
        },
        "cta2": {
          "text": "Make your calendar",
          "href": "https://www.walkofberlin.com/product-page/dein-berlin-2027-personalised-wall-calendar"
        },
        "visual": {
          "type": "stack",
          "items": [
            {
              "img": "assets/cal-feature.webp",
              "alt": "Illustrated preview of the Dein Berlin 2027 wall calendar on a wall, open at January with Chamissoplatz from above in 1928 and today",
              "w": 720,
              "h": 720
            },
            {
              "img": "assets/door-calendar.webp",
              "alt": "Berlin 2027 wall calendar",
              "w": 600,
              "h": 420
            }
          ]
        }
      },
      {
        "key": "tour",
        "label": "Walking tour",
        "eyebrow": "BERLIN THEN AND NOW · WALKING TOUR",
        "title": "Walk it with me.",
        "lead": "About 2.5 hours from the World Clock on Alexanderplatz to Hackescher Markt, with an archive photo at every stop. Small groups of up to 10.",
        "cta": {
          "text": "See dates and book",
          "href": "https://www.walkofberlin.com/book-berlin-walking-tour/berlin-then-and-now"
        },
        "visual": {
          "type": "single",
          "img": "assets/walk.webp",
          "alt": "On my Berlin Then and Now walk",
          "w": 1000,
          "h": 800
        }
      },
      {
        "key": "audio",
        "label": "Audio walks",
        "eyebrow": "AUDIO WALKS · FOR YOUR PHONE",
        "title": "Walk Berlin at your own pace.",
        "lead": "Self-guided walks for your phone, from the Berlin Wall to medieval Berlin. Start when you like and pause whenever you want.",
        "cta": {
          "text": "See the audio walks",
          "href": "https://www.walkofberlin.com/category/all-products?tab=audio"
        },
        "visual": {
          "type": "player",
          "img": "assets/slide-audio-walks.webp",
          "alt": "Berlin Wall remnant with a hole chipped out, at Niederkirchnerstraße",
          "w": 960,
          "h": 656,
          "kicker": "NOW PLAYING",
          "title": "Berlin Wall Audio Walk"
        }
      },
      {
        "key": "blog",
        "label": "Blog",
        "eyebrow": "THE BLOG",
        "title": "Berlin, explained by someone who lives here.",
        "lead": "Practical posts on getting around, neighbourhoods, history and what is worth your evening this week.",
        "cta": {
          "text": "Read the blog",
          "href": "https://www.walkofberlin.com/blog"
        },
        "visual": {
          "type": "posts",
          "items": [
            {
              "tag": "THIS SEASON",
              "title": "Christmas markets: which ones are actually worth it",
              "href": "https://www.walkofberlin.com/post/best-christmas-markets-berlin-2026",
              "img": "assets/blog-best-christmas-markets-berlin-2026.webp"
            },
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
            }
          ]
        }
      },
      {
        "key": "tools",
        "label": "Free tools",
        "eyebrow": "FREE BERLIN TOOLS",
        "title": "Free tools for your Berlin days.",
        "lead": "Maps, checkers and games, from the Christmas markets map to the Berghain Bouncer. The Trip Planner is free too.",
        "cta": {
          "text": "Open the tools",
          "href": "https://www.walkofberlin.com/berlin-tools"
        },
        "cta2": {
          "text": "Plan my trip",
          "href": "https://www.walkofberlin.com/berlin-trip-planner"
        },
        "visual": {
          "type": "tiles",
          "from": "tools",
          "count": 4
        }
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

  // P23 uses the same exact boundaries / 30 s cap as P4. Choose before innerHTML,
  // never render both H1s or fetch the original hero images during the sale.
  const BWH_GW_START = Date.parse('2026-11-01T19:00:00Z');
  const BWH_GW_END = Date.parse('2026-11-08T22:59:00Z');
  const BWH_GW_BURST = 'polygon(' + Array.from({length:56}, (_, i) => {
    const a = Math.PI * i / 28, r = i % 2 ? 44.5 : 50;
    return (50 + r * Math.cos(a)).toFixed(2) + '% ' + (50 + r * Math.sin(a)).toFixed(2) + '%';
  }).join(',') + ')';
  function bwhGiftActive(now = Date.now()) { return now >= BWH_GW_START && now < BWH_GW_END; }
  // The store prices were read for each linked product at release time.
  function bwhReelLabel(reel, active = bwhGiftActive()) { return active ? reel.giftProductLabel : reel.productLabel; }
  function bwhPosterPrice(poster, active = bwhGiftActive()) { return active ? poster.giftPrice : poster.price; }
  function bwhGiftTime() {
    const m = Math.max(0, Math.floor((BWH_GW_END - Date.now()) / 60000));
    const pad = n => String(n).padStart(2, '0');
    return {d:pad(Math.floor(m / 1440)), h:pad(Math.floor(m % 1440 / 60)), m:pad(m % 60)};
  }
  function bwhGiftHero(d) {
    const time = bwhGiftTime();
    return `<section id="bwh-top" class="bwh-gw" aria-labelledby="bwh-title" data-bwh-campaign="gift-week-202611">
 <div class="bwh-gw__rays" aria-hidden="true"></div><div class="bwh-gw__grain" aria-hidden="true"></div>
 <div class="bwh-gw__inner">
  <div class="bwh-gw__copy">
   <p class="bwh-gw__kicker"><span class="bwh-gw__pill">Gift Week</span><span class="bwh-gw__ends">Ends Sunday 8 Nov, 23:59</span></p>
   <h1 class="bwh-gw__h1" id="bwh-title">Berlin gifts, <span>20% off.</span></h1>
   <p class="bwh-gw__lead">A newspaper about their day, their street in 1928, an audio walk or a poster. For someone who loves this city.</p>
   <div class="bwh-gw__count" role="timer" aria-live="off" aria-label="Offer ends Sunday 8 November, 23:59 Berlin time">
    <div class="bwh-gw__unit" aria-hidden="true"><div class="bwh-gw__tile" data-bwh-gw="d">${time.d}</div><span class="bwh-gw__lbl">DAYS</span></div>
    <div class="bwh-gw__colon" aria-hidden="true">:</div>
    <div class="bwh-gw__unit" aria-hidden="true"><div class="bwh-gw__tile" data-bwh-gw="h">${time.h}</div><span class="bwh-gw__lbl">HRS</span></div>
    <div class="bwh-gw__colon" aria-hidden="true">:</div>
    <div class="bwh-gw__unit" aria-hidden="true"><div class="bwh-gw__tile" data-bwh-gw="m">${time.m}</div><span class="bwh-gw__lbl">MIN</span></div>
   </div>
   <div class="bwh-gw__ctas">
    <a class="bwh-gw__btn bwh-gw__btn--yellow" href="https://www.walkofberlin.com/category/berlin-christmas-gifts" data-bwh-section="hero" data-bwh-item="gift-week-shop">Shop the gifts <span class="bwh-gw__arrow" aria-hidden="true">&rarr;</span></a>
    <a class="bwh-gw__btn bwh-gw__btn--ghost" href="${bwhEsc(bwhHref(d.hero.streetHref))}" data-bwh-section="hero" data-bwh-item="gift-week-1928">Find your street in 1928</a>
   </div>
  </div>
  <div class="bwh-gw__visual">
   <figure class="bwh-gw__card bwh-gw__card--left"><img src="${bwhEsc(bwhSrc('assets/gw-big-day.webp'))}" loading="eager" width="560" height="792" alt="Sample front page of The Big Day, a personalised wedding newspaper"></figure>
   <figure class="bwh-gw__card bwh-gw__card--right"><img src="${bwhEsc(bwhSrc('assets/gw-print-1928.webp'))}" loading="eager" width="560" height="742" alt="Potsdamer Platz street print: the same place from above in 1928 and today"></figure>
   <figure class="bwh-gw__card bwh-gw__card--front"><img src="${bwhEsc(bwhSrc('assets/gw-first-day.webp'))}" loading="eager" fetchpriority="high" width="640" height="906" alt="Sample front page of The First Day, a personalised birthday newspaper"></figure>
   <div class="bwh-gw__badge" aria-hidden="true"><div class="bwh-gw__burst" style="clip-path:${BWH_GW_BURST}"></div><div class="bwh-gw__ring"></div><div class="bwh-gw__btext"><b>&minus;20%</b><small>BERLIN GIFTS</small></div></div>
   <p class="bwh-gw__note">Sample editions. People invented.</p>
  </div>
 </div>
</section>`;
  }

  // Hero slider (Yusuf, 13 Nov 2026: "burayı slider yapalım. 1928, posterler genel, takvimlar, canlı tur,
  // audio walks, blog ve free tools"). Slide 1 keeps the page's only H1. Slides stack in one grid cell, so
  // the band never changes height; images of slides 2+ are hydrated after load (data-bwh-src).
  function bwhSlideImg(src, alt, w, h, mode) {
    const url = bwhEsc(bwhSrc(src)), iw = Number(w) || '', ih = Number(h) || '';
    if (mode === 'high') return `<img src="${url}" alt="${bwhEsc(alt)}" width="${iw}" height="${ih}" fetchpriority="high">`;
    if (mode === 'eager') return `<img src="${url}" alt="${bwhEsc(alt)}" width="${iw}" height="${ih}" decoding="async">`;
    return `<img data-bwh-src="${url}" alt="${bwhEsc(alt)}" width="${iw}" height="${ih}" loading="lazy" decoding="async">`;
  }

  function bwhSlideVisual(d, s, first) {
    const v = s.visual || {};
    if (v.type === 'pair') {
      const h = d.hero, w = Number(h.w) || 1200, ht = Number(h.h) || 750;
      return `<figure class="bwh-hero__figure bwh-slide__visual">
            <div class="bwh-hero__pair">
              <div class="bwh-hero__frame">${bwhSlideImg(h.img1928, h.alt1928, w, ht, first ? 'high' : 'defer')}<span class="bwh-tag">1928</span></div>
              <div class="bwh-hero__frame">${bwhSlideImg(h.imgToday, h.altToday, w, ht, first ? 'eager' : 'defer')}<span class="bwh-tag">TODAY</span></div>
            </div>
            <figcaption class="bwh-caption">${bwhEsc(h.caption)}</figcaption>
          </figure>`;
    }
    if (v.type === 'fan' || v.type === 'stack') {
      return `<div class="bwh-slide__visual bwh-slide__visual--${v.type}">${(v.items || []).map((it, i) => `<div class="bwh-slide__item" data-bwh-item-n="${i + 1}">${bwhSlideImg(it.img, it.alt, it.w, it.h, 'defer')}</div>`).join('')}</div>`;
    }
    if (v.type === 'player') {
      return `<div class="bwh-slide__visual bwh-slide__visual--single bwh-slide__visual--player">${bwhSlideImg(v.img, v.alt, v.w, v.h, 'defer')}
            <div class="bwh-slide__player" aria-hidden="true"><span class="bwh-slide__player-kicker">${bwhEsc(v.kicker)}</span><span class="bwh-slide__player-title">${bwhEsc(v.title)}</span><span class="bwh-slide__player-row"><span class="bwh-slide__player-play"></span><span class="bwh-slide__player-line"><span class="bwh-slide__player-done"></span></span></span></div>
          </div>`;
    }
    if (v.type === 'single') {
      return `<div class="bwh-slide__visual bwh-slide__visual--single">${bwhSlideImg(v.img, v.alt, v.w, v.h, 'defer')}</div>`;
    }
    if (v.type === 'posts') {
      const posts = Array.isArray(v.items) ? v.items : (d[v.from] || []).slice(0, v.count || 3);
      return `<ul class="bwh-slide__visual bwh-slide__visual--posts">${posts.map((p, i) => `
            <li><a class="bwh-slide__post" href="${bwhEsc(bwhHref(p.href))}" data-bwh-section="hero" data-bwh-item="slide-blog-post" data-bwh-position="${i + 1}">${bwhSlideImg(p.img, '', 240, 240, 'defer')}<span class="bwh-slide__post-copy">${p.tag ? `<span class="bwh-slide__post-tag">${bwhEsc(p.tag)}</span>` : ''}<span class="bwh-slide__post-title">${bwhEsc(p.title)}</span></span></a></li>`).join('')}
          </ul>`;
    }
    if (v.type === 'tiles') {
      const tools = (d[v.from] || []).slice(0, v.count || 4);
      return `<ul class="bwh-slide__visual bwh-slide__visual--tiles">${tools.map((t, i) => `
            <li><a class="bwh-slide__tile"${t.img ? ' data-bwh-photo' : ''} href="${bwhEsc(bwhHref(t.href))}" style="--bwh-tile-bg:${bwhEsc(t.bg)};--bwh-tile-fg:${bwhEsc(t.fg)}" data-bwh-section="hero" data-bwh-item="slide-tool" data-bwh-position="${i + 1}">${t.img ? bwhSlideImg(t.img, '', 960, 640, first ? 'eager' : 'defer') : ''}<span class="bwh-slide__tile-kind">${bwhEsc(t.kind)}</span><span class="bwh-slide__tile-name">${bwhEsc(t.name)}</span><span class="bwh-slide__tile-line">${bwhEsc(t.line)}</span></a></li>`).join('')}
          </ul>`;
    }
    return '';
  }

  const BWH_CHEVRON = (dir) => `<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="${dir === 'prev' ? 'M10 3 5 8l5 5' : 'M6 3l5 5-5 5'}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;

  function bwhHero(d) {
    const slides = Array.isArray(d.slides) && d.slides.length ? d.slides : [];
    const n = slides.length;
    const slide = (s, i) => {
      const first = i === 0;
      const title = first
        ? `<h1 class="bwh-h1" id="bwh-title">${bwhEsc(s.title)}</h1>`
        : `<h2 class="bwh-h1 bwh-slide__title">${bwhEsc(s.title)}</h2>`;
      const cta2 = s.cta2 ? `<a class="bwh-btn bwh-btn--outline" href="${bwhEsc(bwhHref(s.cta2.href))}" data-bwh-section="hero" data-bwh-item="slide-${bwhEsc(s.key)}-more" data-bwh-position="${i + 1}">${bwhEsc(s.cta2.text)}</a>` : '';
      return `
      <div class="bwh-slide" data-bwh-slide="${i}" data-bwh-current="${first ? 'true' : 'false'}" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${n}: ${bwhEsc(s.label)}">
        <div class="bwh-slide__grid">
          <div class="bwh-slide__copy">
            <span class="bwh-eyebrow">${bwhEsc(s.eyebrow)}</span>
            ${title}
            <p class="bwh-lead bwh-hero__lead">${bwhEsc(s.lead)}</p>
            <div class="bwh-hero__ctas">
              <a class="bwh-btn bwh-btn--yellow" href="${bwhEsc(bwhHref(s.cta.href))}" data-bwh-section="hero" data-bwh-item="slide-${bwhEsc(s.key)}" data-bwh-position="${i + 1}">${bwhEsc(s.cta.text)}</a>
              ${cta2}
            </div>
          </div>
          ${bwhSlideVisual(d, s, first)}
        </div>
      </div>`;
    };
    return `
    <section class="bwh-band bwh-hero bwh-slider" id="bwh-top" aria-roledescription="carousel" aria-label="Walk of Berlin highlights">
      <div class="bwh-slider__track" aria-live="off">${slides.map(slide).join('')}
      </div>
      <div class="bwh-slider__controls">
        <div class="bwh-slider__nav" role="group" aria-label="Choose a slide">${slides.map((s, i) => `<button type="button" class="bwh-slider__pill" data-bwh-go="${i}" aria-current="${i === 0 ? 'true' : 'false'}" aria-label="${bwhEsc(s.label)}, slide ${i + 1} of ${n}"><span class="bwh-slider__label">${bwhEsc(s.label)}</span><span class="bwh-slider__bar" aria-hidden="true"></span></button>`).join('')}</div>
        <div class="bwh-slider__buttons">
          <button type="button" class="bwh-slider__btn" data-bwh-step="-1" aria-label="Previous slide">${BWH_CHEVRON('prev')}</button>
          <button type="button" class="bwh-slider__btn bwh-slider__toggle" data-bwh-toggle="pause" aria-label="Pause slides"><span class="bwh-slider__pause" aria-hidden="true"></span></button>
          <button type="button" class="bwh-slider__btn" data-bwh-step="1" aria-label="Next slide">${BWH_CHEVRON('next')}</button>
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
          <a class="bwh-reel__product" href="${bwhEsc(product)}" data-bwh-section="reels" data-bwh-item="${bwhEsc(r.productLabel)}" data-bwh-position="${i + 1}"${bwhGiftActive() ? ' data-bwh-gift-price' : ''}><span>${bwhEsc(bwhReelLabel(r))}</span><span aria-hidden="true">→</span></a>
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
          <span class="bwh-poster__price">${bwhEsc(bwhPosterPrice(p))}</span>
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

  // Dein Berlin 2027 feature (13 Nov 2026, Yusuf: "ana sayfa?"): a wide card outside .bwh-doors, so the Gift Week decoration that fills the doors
  // until 15 Nov 23:59 leaves it alone.
  function bwhCalFeature(x) {
    if (!x) return '';
    return `
      <a class="bwh-calfeature bwh-lift" href="${bwhEsc(bwhHref(x.href))}" data-bwh-section="shop" data-bwh-item="dein-berlin-2027-feature">
        <img src="${bwhEsc(bwhSrc(x.img))}" alt="${bwhEsc(x.alt)}" width="720" height="720" loading="lazy" decoding="async">
        <span class="bwh-calfeature__body">
          <span class="bwh-eyebrow">${bwhEsc(x.eyebrow)}</span>
          <span class="bwh-calfeature__name">${bwhEsc(x.name)}</span>
          <span class="bwh-calfeature__line">${bwhEsc(x.line)}</span>
          <span class="bwh-btn bwh-btn--green bwh-calfeature__cta">${bwhEsc(x.cta)} →</span>
        </span>
      </a>`;
  }

  function bwhShop(d) {
    return `
    <section class="bwh-band bwh-shop" id="bwh-shop" aria-labelledby="bwh-shop-title">
      <h2 class="bwh-h2 bwh-shop__title" id="bwh-shop-title">More from the store</h2>
      ${bwhCalFeature(d.calFeature)}
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
    return [bwhGiftActive() ? bwhGiftHero(d) : bwhHero(d), bwhReels(d), bwhPosters(d), bwhShop(d), bwhWalk(d), bwhStart(d)].join('\n');
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
        this._bwhSliderInit();
      }
      window.__bwHomeCreditsHtml = bwhCreditsHtml(DATA);
      this._bwhGiftStart();
      this._bwhWatch();
      if (this._bwhSliderVis) document.addEventListener('visibilitychange', this._bwhSliderVis);
    }

    disconnectedCallback() {
      if (!this.isConnected && location.pathname !== '/') window.__bwHomeCreditsHtml = '';
      this._bwhGiftStop();
      this._bwhStop();
      if (this._bwhSliderVis) document.removeEventListener('visibilitychange', this._bwhSliderVis);
    }

    // ---- hero slider ----------------------------------------------------------------------
    // Autoplay advances on the progress bar's animationend (7 s, CSS) from the first slide on
    // (Yusuf, 13 Nov 2026: "slider ilk slayttan itibaren otomatik kaysın"). A pill, arrow or swipe
    // jumps there and the 7 s restart from that slide; only the pause button stops it. It waits
    // while keyboard focus is inside and while the tab is hidden. prefers-reduced-motion: no fade.
    _bwhSliderInit() {
      if (this._bwhSlider || !this.querySelector('.bwh-slider')) return;
      const st = this._bwhSlider = { index: 0, playing: true, focus: false, swipe: null, swiped: 0 };
      const inSlider = (node) => !!(node && node.closest && node.closest('.bwh-slider') && this.contains(node));
      this.addEventListener('click', (event) => {
        if (Date.now() - st.swiped < 400 && inSlider(event.target)) { event.preventDefault(); event.stopPropagation(); return; }
        const t = event.target.closest ? event.target.closest('[data-bwh-go],[data-bwh-step],[data-bwh-toggle]') : null;
        if (!t || !inSlider(t)) return;
        if (t.hasAttribute('data-bwh-toggle')) { st.playing = !st.playing; this._bwhSliderSync(); return; }
        const n = this.querySelectorAll('.bwh-slide').length;
        const to = t.hasAttribute('data-bwh-go') ? Number(t.dataset.bwhGo) : (st.index + Number(t.dataset.bwhStep) + n) % n;
        this._bwhSliderGo(to);
        bwhTrack('bw_home_tn_click', { section: 'hero-slider', item: 'go-' + ((DATA.slides[to] || {}).key || to), position: to + 1 });
      }, true);
      this.addEventListener('keydown', (event) => {
        const pill = event.target.closest ? event.target.closest('[data-bwh-go]') : null;
        if (!pill || !inSlider(pill)) return;
        const pills = Array.from(this.querySelectorAll('[data-bwh-go]'));
        let i = pills.indexOf(pill);
        if (event.key === 'ArrowRight') i = (i + 1) % pills.length;
        else if (event.key === 'ArrowLeft') i = (i - 1 + pills.length) % pills.length;
        else if (event.key === 'Home') i = 0;
        else if (event.key === 'End') i = pills.length - 1;
        else return;
        event.preventDefault();
        this._bwhSliderGo(i);
        pills[i].focus();
      });
      // Pause only while keyboard focus is inside (a mouse click on a pill does not pause).
      this.addEventListener('focusin', (event) => { let kb = false; try { kb = event.target.matches(':focus-visible'); } catch (e) {} if (kb && inSlider(event.target) && !st.focus) { st.focus = true; this._bwhSliderSync(); } });
      this.addEventListener('focusout', (event) => { if (st.focus && !inSlider(event.relatedTarget)) { st.focus = false; this._bwhSliderSync(); } });
      this.addEventListener('animationend', (event) => {
        if (!event.target.classList || !event.target.classList.contains('bwh-slider__bar') || !inSlider(event.target)) return;
        if (st.playing && event.target.closest('[aria-current="true"]')) this._bwhSliderGo(st.index + 1);
      });
      this.addEventListener('pointerdown', (event) => {
        if (event.pointerType === 'mouse' || !(event.target.closest && event.target.closest('.bwh-slider__track')) || !inSlider(event.target)) return;
        st.swipe = { x: event.clientX, y: event.clientY };
      }, { passive: true });
      this.addEventListener('pointerup', (event) => {
        const s0 = st.swipe; st.swipe = null;
        if (!s0) return;
        const dx = event.clientX - s0.x, dy = event.clientY - s0.y;
        if (Math.abs(dx) < 48 || Math.abs(dx) < 1.3 * Math.abs(dy)) return;
        st.swiped = Date.now();
        this._bwhSliderGo(st.index + (dx < 0 ? 1 : -1));
      });
      this.addEventListener('pointercancel', () => { st.swipe = null; });
      this._bwhSliderVis = () => this._bwhSliderSync();
      document.addEventListener('visibilitychange', this._bwhSliderVis);
      const later = () => setTimeout(() => this._bwhSliderHydrateAll(), 800);
      if (document.readyState === 'complete') later(); else window.addEventListener('load', later, { once: true });
      this._bwhSliderSync();
    }

    _bwhSliderHydrate(slide) {
      if (!slide) return;
      slide.querySelectorAll('img[data-bwh-src]').forEach((img) => { img.src = img.dataset.bwhSrc; img.removeAttribute('data-bwh-src'); });
    }

    _bwhSliderHydrateAll() { this.querySelectorAll('.bwh-slide').forEach((slide) => this._bwhSliderHydrate(slide)); }

    _bwhSliderGo(to) {
      const slides = Array.from(this.querySelectorAll('.bwh-slide'));
      if (!slides.length || !this._bwhSlider) return;
      const i = ((to % slides.length) + slides.length) % slides.length;
      this._bwhSliderHydrate(slides[i]);
      this._bwhSliderHydrate(slides[(i + 1) % slides.length]);
      slides.forEach((slide, k) => slide.setAttribute('data-bwh-current', k === i ? 'true' : 'false'));
      this.querySelectorAll('.bwh-slider__pill').forEach((pill, k) => pill.setAttribute('aria-current', k === i ? 'true' : 'false'));
      const nav = this.querySelector('.bwh-slider__nav'), pill = nav && nav.querySelector('[aria-current="true"]');
      if (nav && pill && nav.scrollWidth > nav.clientWidth) {
        const left = pill.offsetLeft - nav.offsetLeft, right = left + pill.offsetWidth;
        if (left < nav.scrollLeft || right > nav.scrollLeft + nav.clientWidth) nav.scrollTo({ left: Math.max(0, left - 16), behavior: bwhMatch('(prefers-reduced-motion: reduce)') ? 'auto' : 'smooth' });
      }
      this._bwhSlider.index = i;
      this._bwhSliderSync();
    }

    _bwhSliderSync() {
      const section = this.querySelector('.bwh-slider'), st = this._bwhSlider;
      if (!section || !st) return;
      section.toggleAttribute('data-bwh-playing', st.playing);
      section.toggleAttribute('data-bwh-paused', st.playing && (st.focus || document.hidden));
      const toggle = section.querySelector('[data-bwh-toggle]');
      if (toggle) { toggle.setAttribute('aria-label', st.playing ? 'Pause slides' : 'Play slides'); toggle.setAttribute('data-bwh-toggle', st.playing ? 'pause' : 'play'); }
      const track = section.querySelector('.bwh-slider__track');
      if (track) track.setAttribute('aria-live', st.playing ? 'off' : 'polite');
    }

    _bwhGiftStart() {
      this._bwhGiftStop();
      this._bwhGiftWake = () => this._bwhGiftTick();
      document.addEventListener('visibilitychange', this._bwhGiftWake);
      window.addEventListener('pageshow', this._bwhGiftWake);
      this._bwhGiftTick();
    }

    _bwhGiftStop() {
      clearTimeout(this._bwhGiftTimer);
      document.removeEventListener('visibilitychange', this._bwhGiftWake);
      window.removeEventListener('pageshow', this._bwhGiftWake);
    }

    _bwhGiftTick() {
      clearTimeout(this._bwhGiftTimer);
      if (!this.isConnected) return;
      const now = Date.now(), active = bwhGiftActive(now);
      const hero = this.querySelector('#bwh-top');
      if (hero && hero.classList.contains('bwh-gw') !== active) {
        const restoreFocus = hero.contains(document.activeElement);
        // Only the first band changes. Preserve every other node and listener.
        hero.outerHTML = active ? bwhGiftHero(DATA) : bwhHero(DATA);
        if (this._bwhSlider) { this._bwhSlider.index = 0; this._bwhSliderHydrateAll(); this._bwhSliderSync(); }
        if (restoreFocus) this.querySelector('#bwh-top a')?.focus({preventScroll:true});
      }
      this._bwhGiftPrices(active);
      if (active) {
        const time = bwhGiftTime();
        this.querySelectorAll('[data-bwh-gw]').forEach(tile => {
          const value = time[tile.dataset.bwhGw];
          if (tile.textContent !== value) tile.textContent = value;
        });
      }
      const boundary = [BWH_GW_START, BWH_GW_END].find(t => t > now);
      // No timer after expiry. Reconnection/pageshow still recheck the clock.
      if (boundary) this._bwhGiftTimer = setTimeout(() => this._bwhGiftTick(), Math.min(30000, boundary - now));
    }

    _bwhGiftPrices(active) {
      this.querySelectorAll('.bwh-reel__product').forEach((link, i) => {
        const text = bwhReelLabel(DATA.reels[i], active);
        link.toggleAttribute('data-bwh-gift-price', active);
        if (link.firstElementChild.textContent !== text) link.firstElementChild.textContent = text;
      });
      this.querySelectorAll('.bwh-poster__price').forEach((label, i) => {
        const text = bwhPosterPrice(DATA.posters[i], active);
        if (label.textContent !== text) label.textContent = text;
      });
      const dialog = this.querySelector('.bwh-player');
      if (dialog && DATA.reels[this._bwhReelIndex]) {
        const label = dialog.querySelector('.bwh-player__product');
        const text = `${bwhReelLabel(DATA.reels[this._bwhReelIndex], active)} →`;
        if (label.textContent !== text) label.textContent = text;
      }
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
      product.textContent = `${bwhReelLabel(reel)} →`;
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
