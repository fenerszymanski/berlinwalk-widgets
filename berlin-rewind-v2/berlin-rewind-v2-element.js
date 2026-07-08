/*
 * <bw-berlin-rewind-v2> — Berlin Rewind V2
 *
 * Daily archival photo guessing game ("arkasi yarin" style): every Berlin day
 * serves the same deterministic set of 5 photos, tracks a play streak in
 * localStorage, and gates you to "come back tomorrow" once today is done
 * (with an optional practice mode that does not touch the streak).
 *
 * Self-contained: light DOM, instance state, no globals, no iframe, no
 * postMessage/resize, no MutationObserver, no external CSS/JS, no data fetch
 * (photo + district data inlined). Image files load from the element script's
 * own directory (document.currentScript), so it works locally and on GitHub
 * Pages with no hardcoded origin.
 *
 * Mount:
 *   <bw-berlin-rewind-v2></bw-berlin-rewind-v2>
 *   <script src=".../berlin-rewind-v2/berlin-rewind-v2-element.js" defer></script>
 *
 * Build marker: berlin-rewind-v2-stable-board-20260708a
 */
(function () {
  'use strict';

  var BOOK_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
  var GAMES_URL = 'https://www.berlinwalk.com/games';
  var BUILD = 'berlin-rewind-v2-stable-board-20260708a';
  var TAG = 'bw-berlin-rewind-v2';
  var STORE_KEY = 'bwRewindV2State';
  var HISTORY_MAX = 14;
  var GAME_LINKS = [
    { label: 'All games', href: GAMES_URL },
    { label: 'Day Survival', href: 'https://www.berlinwalk.com/games/berlin-day-survival' },
    { label: 'Berlin Battle', href: 'https://www.berlinwalk.com/games/berlin-battle' },
    { label: 'Berghain Bouncer', href: 'https://www.berlinwalk.com/games/berghain-bouncer' },
    { label: 'Smile Challenge', href: 'https://www.berlinwalk.com/games/berlin-smile-challenge' }
  ];

  // Absolute default so photos resolve even when a host (e.g. Wix) loads this
  // script with document.currentScript null/proxied. Overridable per-instance
  // with data-asset-base (used by the local standalone preview).
  var ASSET_BASE = 'https://fenerszymanski.github.io/berlinwalk-widgets/berlin-rewind-v2/';

  var YEAR_MIN = 1918;
  var YEAR_MAX = 1995;
  var ROUNDS_PER_GAME = 5;

  var DISTRICTS = {
    'mitte': { label: 'Mitte', neighbors: ['pankow', 'friedrichshain-kreuzberg', 'charlottenburg-wilmersdorf', 'tempelhof-schoneberg', 'neukolln', 'reinickendorf'] },
    'pankow': { label: 'Pankow', neighbors: ['mitte', 'friedrichshain-kreuzberg', 'lichtenberg', 'reinickendorf'] },
    'friedrichshain-kreuzberg': { label: 'Friedrichshain-Kreuzberg', neighbors: ['mitte', 'pankow', 'neukolln', 'treptow-kopenick', 'lichtenberg'] },
    'charlottenburg-wilmersdorf': { label: 'Charlottenburg-Wilmersdorf', neighbors: ['mitte', 'spandau', 'steglitz-zehlendorf', 'tempelhof-schoneberg', 'reinickendorf'] },
    'spandau': { label: 'Spandau', neighbors: ['charlottenburg-wilmersdorf', 'steglitz-zehlendorf', 'reinickendorf'] },
    'steglitz-zehlendorf': { label: 'Steglitz-Zehlendorf', neighbors: ['charlottenburg-wilmersdorf', 'spandau', 'tempelhof-schoneberg', 'neukolln'] },
    'tempelhof-schoneberg': { label: 'Tempelhof-Schoneberg', neighbors: ['mitte', 'charlottenburg-wilmersdorf', 'steglitz-zehlendorf', 'neukolln', 'friedrichshain-kreuzberg'] },
    'neukolln': { label: 'Neukolln', neighbors: ['mitte', 'tempelhof-schoneberg', 'friedrichshain-kreuzberg', 'treptow-kopenick'] },
    'treptow-kopenick': { label: 'Treptow-Kopenick', neighbors: ['neukolln', 'friedrichshain-kreuzberg', 'lichtenberg', 'marzahn-hellersdorf'] },
    'marzahn-hellersdorf': { label: 'Marzahn-Hellersdorf', neighbors: ['lichtenberg', 'treptow-kopenick'] },
    'lichtenberg': { label: 'Lichtenberg', neighbors: ['pankow', 'friedrichshain-kreuzberg', 'treptow-kopenick', 'marzahn-hellersdorf'] },
    'reinickendorf': { label: 'Reinickendorf', neighbors: ['mitte', 'pankow', 'charlottenburg-wilmersdorf', 'spandau'] }
  };

  var PHOTOS = [
    { id: 'ph_001', title: 'Traffic tower at Potsdamer Platz', year: 1924, tol: 1, district: 'mitte', difficulty: 'easy',
      story: 'Potsdamer Platz still looked like Berlin’s electric crossroads here, with the traffic tower acting like a stage prop in the middle of the city. On the walk, I use corners like this to show how much movement Berlin had before the Wall turned so many addresses into edges.',
      credit: 'Bundesarchiv Bild 102-00843 / CC BY-SA 3.0 DE', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_102-00843,_Berlin,_Verkehrsturm_auf_dem_Potsdamer_Platz.jpg' },
    { id: 'ph_002', title: 'Constitution Day at Brandenburg Gate', year: 1923, tol: 0, district: 'mitte', difficulty: 'medium',
      story: 'Brandenburg Gate is easy to flatten into postcard Berlin, but scenes like this remind me that it also held the city’s public mood long before the Cold War image took over. My move here is always to ask what the crowd is telling you before you look for the monument.',
      credit: 'Bundesarchiv Bild 102-00136 / CC BY-SA 3.0 DE', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_102-00136,_Berlin,_Brandenburger_Tor,_Verfassungsfeier.jpg' },
    { id: 'ph_003', title: 'Big flight day at Tempelhof', year: 1928, tol: 1, district: 'tempelhof-schoneberg', difficulty: 'medium',
      story: 'Tempelhof already carried spectacle before it became shorthand for airlifts, runways and open-field sunsets. When visitors ask me why Berlin stories feel layered, this is exactly the kind of earlier chapter I want them to hold in their heads.',
      credit: 'Bundesarchiv Bild 102-06485 / CC BY-SA 3.0 DE', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_102-06485,_Berlin-Tempelhof,_Gro%C3%9Fflugtag.jpg' },
    { id: 'ph_004', title: 'BVG strike at Potsdamer Platz', year: 1932, tol: 0, district: 'mitte', difficulty: 'hard',
      story: 'A transport strike has been part of Berlin’s rhythm for longer than most visitors imagine. I like this photo because it makes the city feel instantly familiar: once the movement breaks, every small decision around it gets louder.',
      credit: 'Bundesarchiv Bild 102-13993 / CC BY-SA 3.0 DE', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_102-13993,_Berlin,_Potsdamer_Platz,_BVG-Streik.jpg' },
    { id: 'ph_005', title: 'Treptow fairground day', year: 1948, tol: 0, district: 'treptow-kopenick', difficulty: 'hard',
      story: 'Treptow does not always get first billing in tourist Berlin, which is partly why I wanted it in the pool. This kind of local fair scene is a good reminder that the city was rebuilding its ordinary life even when the big history headline sat somewhere else.',
      credit: 'Bundesarchiv Bild 183-H25478 / CC BY-SA 3.0 DE', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_183-H25478,_Berlin-Treptow,_Volksfest.jpg' },
    { id: 'ph_006', title: 'Housing block in Prenzlauer Berg', year: 1952, tol: 0, district: 'pankow', difficulty: 'hard',
      story: 'Prenzlauer Berg now reads as cafe terraces and strollers to a lot of visitors, so I like throwing this version into the set. My advice is to notice how quickly Berlin neighbourhood myths fall apart once you put one earlier image beside today’s street.',
      credit: 'Bundesarchiv Bild 183-16218-0006 / CC BY-SA 3.0 DE', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_183-16218-0006,_Berlin,_Prenzlauer_Berg,_Wohnblock,_Baustelle.jpg' },
    { id: 'ph_007', title: 'Cafe Kranzler on Kurfurstendamm', year: 1955, tol: 0, district: 'charlottenburg-wilmersdorf', difficulty: 'medium',
      story: 'West Berlin glamour usually gets reduced to one or two names, and Cafe Kranzler is one of them for a reason. If you want to read old Kurfurstendamm quickly, the useful move is to look at who is lingering rather than just what is being sold.',
      credit: 'Bundesarchiv B 145 Bild-F002774-0008 / CC BY-SA 3.0 DE', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bundesarchiv_B_145_Bild-F002774-0008,_Berlin,_Caf%C3%A9_Kranzler.jpg' },
    { id: 'ph_008', title: 'Water cannon at Brandenburg Gate', year: 1961, tol: 0, district: 'mitte', difficulty: 'easy',
      story: 'This is one of those Berlin images where the mood tells the date almost as loudly as the objects do. On the walk, I usually tell people not to memorise the Wall as a single symbol. Read the pressure in the street first, and the symbol makes more sense after that.',
      credit: 'Bundesarchiv Bild 173-1282 / CC BY-SA 3.0 DE', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_173-1282,_Berlin,_Brandenburger_Tor,_Wasserwerfer.jpg' },
    { id: 'ph_009', title: 'Alexanderplatz from the TV Tower at night', year: 1969, tol: 0, district: 'mitte', difficulty: 'easy',
      story: 'Alexanderplatz has that rare Berlin quality where one skyline shot can already tell you the political era. If you are in the square today, the simple move is to stop spinning for a second and notice which pieces still make the old city plan legible.',
      credit: 'Bundesarchiv Bild 183-H1006-0001-005 / CC BY-SA 3.0 DE', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_183-H1006-0001-005,_Berlin,_Blick_vom_Fernsehturm_auf_den_Alexanderplatz_bei_Nacht.jpg' },
    { id: 'ph_010', title: 'Checkpoint Charlie, the night the Wall opened', year: 1989, tol: 0, district: 'mitte', difficulty: 'easy',
      story: 'People usually arrive at this photo already knowing the headline, which is why I like using it late in a set rather than first. The better question is not only what happened, but how quickly a border city can start behaving like a crowd city again.',
      credit: 'Bundesarchiv Bild 183-1989-1110-018 / CC BY-SA 3.0 DE', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_183-1989-1110-018,_Berlin,_Checkpoint_Charlie,_Nacht_des_Mauerfalls.jpg' }
  ];

  var TIERS = [
    { min: 850, emoji: '🗃️', title: 'Berlin archive eye', desc: 'You read old Berlin like a local reads a menu. You are not guessing the era, you are recognising it.' },
    { min: 650, emoji: '🏛️', title: 'Sharp local eye', desc: 'Strong instincts for the city’s layers. You catch the decade in the light and the district in the details.' },
    { min: 400, emoji: '🎫', title: 'Weekend Berliner', desc: 'A good feel for the big landmarks and eras, a little shakier on the quieter corners. The walk fills those gaps fast.' },
    { min: 0, emoji: '🧭', title: 'First-timer’s eye', desc: 'Berlin’s timeline is a puzzle right now, which is honestly the best moment to walk it. It all clicks once you see it on foot.' }
  ];

  var CSS = [
    '.bw-rw{--g:#1B5E20;--gd:#123f16;--y:#FFE600;--lime:#7CB342;--lg:#C5E1A5;--cream:#FAFAF5;--ink:#212121;--red:#E63946;',
    'box-sizing:border-box;display:block;width:100%;max-width:600px;margin:0 auto;padding:4px;',
    "font-family:'Montserrat','Avenir Next','Helvetica Neue',Arial,sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%;}",
    '.bw-rw *{box-sizing:border-box;}',
    '.bw-rw button{font-family:inherit;}',
    '.bw-rw-card{background:linear-gradient(170deg,var(--g),var(--gd));border-radius:22px;padding:20px 18px;color:var(--cream);box-shadow:0 14px 34px rgba(18,63,22,.22);}',
    '.bw-rw-screen{display:none;}',
    '.bw-rw-screen.is-on{display:block;animation:bwrwfade .28s ease;}',
    '@keyframes bwrwfade{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:none;}}',
    '.bw-rw-eyebrow{font-size:13px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:var(--y);margin:0 0 8px;}',
    '.bw-rw-title{font-size:29px;font-weight:800;line-height:1.08;letter-spacing:-.5px;margin:0 0 10px;color:#fff;}',
    '.bw-rw-sub{font-size:16px;line-height:1.5;color:var(--lg);margin:0 0 16px;}',
    '.bw-rw-foot{font-size:12.5px;color:var(--lg);margin-top:14px;text-align:center;opacity:.85;}',
    // start hero filmstrip
    '.bw-rw-strip{display:flex;gap:8px;margin:0 0 18px;}',
    '.bw-rw-strip-thumb{flex:1;aspect-ratio:1/1;border-radius:11px;overflow:hidden;border:1px solid rgba(255,255,255,.16);background:#141414;position:relative;}',
    '.bw-rw-strip-thumb img{width:100%;height:100%;object-fit:cover;display:block;filter:grayscale(.15) contrast(1.02);}',
    '.bw-rw-strip-thumb::after{content:"?";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:800;color:rgba(255,255,255,.82);background:linear-gradient(180deg,rgba(18,63,22,.05),rgba(18,63,22,.55));}',
    // streak / daily chips
    '.bw-rw-chiprow{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 16px;}',
    '.bw-rw-chip{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.08);border:1px solid rgba(197,225,165,.35);border-radius:999px;padding:8px 13px;font-size:13.5px;font-weight:800;color:var(--cream);}',
    '.bw-rw-chip b{color:var(--y);}',
    // personal score table
    '.bw-rw-table{background:rgba(0,0,0,.16);border-radius:14px;padding:4px 14px 8px;margin:0 0 16px;}',
    '.bw-rw-table-h{font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:var(--lg);padding:11px 0 7px;}',
    '.bw-rw-trow{display:flex;align-items:center;gap:11px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.08);}',
    '.bw-rw-trow:last-child{border-bottom:none;}',
    '.bw-rw-tdate{font-size:13px;color:var(--cream);width:128px;flex:0 0 auto;}',
    '.bw-rw-trow.today .bw-rw-tdate{color:#fff;font-weight:800;}',
    '.bw-rw-tbar{flex:1;height:8px;border-radius:5px;background:rgba(255,255,255,.12);overflow:hidden;}',
    '.bw-rw-tbar-fill{height:100%;border-radius:5px;background:linear-gradient(90deg,var(--lime),var(--y));}',
    '.bw-rw-tscore{font-size:14px;font-weight:800;color:var(--y);width:66px;text-align:right;flex:0 0 auto;}',
    // top bar (round + score)
    '.bw-rw-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}',
    '.bw-rw-round{font-size:13px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:var(--lg);}',
    '.bw-rw-scorepill{font-size:13px;font-weight:800;color:var(--gd);background:var(--y);border-radius:999px;padding:4px 12px;}',
    '.bw-rw-progress{display:flex;gap:5px;margin-bottom:14px;}',
    '.bw-rw-seg{flex:1;height:5px;border-radius:4px;background:rgba(255,255,255,.18);}',
    '.bw-rw-seg.on{background:var(--y);}',
    // photo
    '.bw-rw-photo{position:relative;background:#141414;border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,.14);margin-bottom:8px;min-height:180px;}',
    '.bw-rw-photo img{display:block;width:100%;height:auto;max-height:46vh;object-fit:contain;margin:0 auto;background:#141414;}',
    '.bw-rw-diff{position:absolute;top:10px;left:10px;font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:#fff;background:rgba(0,0,0,.55);border-radius:999px;padding:4px 10px;z-index:2;}',
    '.bw-rw-loading{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--lg);font-size:13px;font-weight:700;letter-spacing:1px;}',
    '.bw-rw-ask{font-size:15px;font-weight:700;color:#fff;margin:14px 0 8px;}',
    // year control
    '.bw-rw-year{display:flex;align-items:center;justify-content:center;gap:14px;margin:2px 0 10px;}',
    '.bw-rw-year-val{font-size:38px;font-weight:800;color:var(--y);min-width:104px;text-align:center;letter-spacing:1px;}',
    '.bw-rw-step{width:46px;height:46px;border-radius:12px;border:2px solid rgba(197,225,165,.45);background:rgba(255,255,255,.06);color:#fff;font-size:24px;font-weight:800;cursor:pointer;line-height:1;}',
    '.bw-rw-step:active{transform:scale(.96);}',
    '.bw-rw-slider{width:100%;margin:4px 0 6px;-webkit-appearance:none;appearance:none;height:10px;border-radius:8px;background:rgba(255,255,255,.2);outline:none;}',
    '.bw-rw-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:30px;height:30px;border-radius:50%;background:var(--y);border:3px solid var(--gd);cursor:pointer;}',
    '.bw-rw-slider::-moz-range-thumb{width:28px;height:28px;border-radius:50%;background:var(--y);border:3px solid var(--gd);cursor:pointer;}',
    '.bw-rw-scale{display:flex;justify-content:space-between;font-size:11px;color:var(--lg);margin-bottom:16px;}',
    // districts
    '.bw-rw-dist{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:16px;}',
    '.bw-rw-dbtn{width:100%;min-height:52px;text-align:center;background:var(--cream);border:2px solid transparent;color:var(--gd);border-radius:13px;padding:12px 8px;font-size:14.5px;font-weight:800;cursor:pointer;transition:transform .05s,border-color .15s;}',
    '.bw-rw-dbtn:hover{border-color:var(--y);}',
    '.bw-rw-dbtn:active{transform:scale(.98);}',
    '.bw-rw-dbtn.sel{border-color:var(--y);background:#fff;box-shadow:0 0 0 3px rgba(255,230,0,.35);}',
    '.bw-rw-dbtn[disabled]{opacity:.75;cursor:default;}',
    '.bw-rw-dbtn.correct{background:#DFF5C8;border-color:var(--lime);color:#1B5E20;}',
    '.bw-rw-dbtn.wrong{background:#f6d9d9;border-color:var(--red);color:#7a2530;}',
    // buttons
    '.bw-rw-btn{display:block;width:100%;background:var(--y);color:var(--gd);border:none;border-radius:14px;padding:16px;font-size:17px;font-weight:800;cursor:pointer;min-height:52px;transition:transform .05s,filter .15s;text-align:center;text-decoration:none;box-sizing:border-box;}',
    '.bw-rw-btn:hover{filter:brightness(1.03);}',
    '.bw-rw-btn:active{transform:scale(.99);}',
    '.bw-rw-btn[disabled]{opacity:.45;cursor:default;}',
    '.bw-rw-btn.ghost{background:transparent;color:var(--cream);border:2px solid rgba(197,225,165,.5);}',
    '.bw-rw-btn.link{background:transparent;color:var(--lg);border:none;text-decoration:underline;min-height:44px;font-size:15px;}',
    '.bw-rw-btnrow{display:flex;flex-direction:column;gap:10px;margin-top:16px;}',
    // reveal
    '.bw-rw-reveal{margin-top:6px;}',
    '.bw-rw-rrow{display:flex;gap:10px;margin-bottom:14px;}',
    '.bw-rw-rbox{flex:1;background:rgba(0,0,0,.18);border-radius:14px;padding:12px 12px;}',
    '.bw-rw-rbox-k{font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:var(--lg);}',
    '.bw-rw-rbox-actual{font-size:22px;font-weight:800;color:#fff;margin-top:3px;}',
    '.bw-rw-rbox-you{font-size:12.5px;color:var(--lg);margin-top:3px;}',
    '.bw-rw-rbox-pts{display:inline-block;font-size:12px;font-weight:800;color:var(--gd);background:var(--y);border-radius:999px;padding:2px 9px;margin-top:6px;}',
    '.bw-rw-phototitle{font-size:17px;font-weight:800;color:#fff;margin:2px 0 8px;}',
    '.bw-rw-story{font-size:15px;line-height:1.55;color:var(--cream);margin:0 0 12px;}',
    '.bw-rw-credit{font-size:11px;line-height:1.4;color:var(--lg);opacity:.85;margin:0 0 4px;}',
    '.bw-rw-credit a{color:var(--lg);}',
    // result / gate
    '.bw-rw-r-emoji{font-size:60px;line-height:1;text-align:center;margin:2px 0 4px;}',
    '.bw-rw-r-score{font-size:44px;font-weight:800;text-align:center;color:var(--y);margin:0;line-height:1;}',
    '.bw-rw-r-scoresub{font-size:13px;text-align:center;color:var(--lg);margin:2px 0 12px;letter-spacing:1px;text-transform:uppercase;font-weight:700;}',
    '.bw-rw-r-title{font-size:26px;font-weight:800;text-align:center;color:#fff;margin:0 0 8px;letter-spacing:-.5px;}',
    '.bw-rw-r-desc{font-size:15.5px;line-height:1.55;color:var(--cream);text-align:center;margin:0 0 16px;}',
    '.bw-rw-recap{background:rgba(0,0,0,.15);border-radius:14px;padding:8px 12px;margin-bottom:6px;}',
    '.bw-rw-recap-row{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.08);font-size:13.5px;}',
    '.bw-rw-recap-row:last-child{border-bottom:none;}',
    '.bw-rw-recap-t{color:var(--cream);flex:1;}',
    '.bw-rw-recap-p{color:var(--y);font-weight:800;white-space:nowrap;}',
    '.bw-rw-tomorrow{text-align:center;font-size:14px;font-weight:700;color:var(--lg);margin:14px 0 2px;}',
    '.bw-rw-tomorrow b{color:var(--y);}',
    '.bw-rw-copied{text-align:center;font-size:13px;color:var(--y);font-weight:700;min-height:18px;margin-top:8px;}',
    '.bw-rw-more{margin-top:14px;padding-top:14px;border-top:1px solid rgba(197,225,165,.25);}',
    '.bw-rw-more-k{font-size:11px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:var(--lg);margin:0 0 8px;}',
    '.bw-rw-more-links{display:flex;gap:8px;flex-wrap:wrap;}',
    '.bw-rw-more-links a{display:inline-flex;align-items:center;min-height:34px;border-radius:999px;border:1px solid rgba(197,225,165,.42);padding:8px 11px;color:var(--cream);font-size:12.5px;font-weight:800;text-decoration:none;background:rgba(255,255,255,.06);}',
    '.bw-rw-more-links a:first-child{background:var(--y);border-color:var(--y);color:var(--gd);}',
    '.bw-rw{max-width:1080px;padding:0;}',
    '.bw-rw-card{height:720px;border-radius:18px;padding:22px;color:var(--cream);}',
    '.bw-rw-screen.is-on{height:100%;display:flex;flex-direction:column;animation:bwrwfade .2s ease;}',
    '.bw-rw-home-screen,.bw-rw-result-screen{max-width:720px;margin:0 auto;width:100%;justify-content:center;}',
    '.bw-rw-home-screen .bw-rw-strip{max-width:620px;}',
    '.bw-rw-top{margin-bottom:10px;flex:0 0 auto;}',
    '.bw-rw-progress{margin-bottom:14px;flex:0 0 auto;}',
    '.bw-rw-board{display:grid;grid-template-columns:minmax(0,1fr) minmax(360px,420px);gap:18px;align-items:start;min-height:0;flex:1;}',
    '.bw-rw-photo{aspect-ratio:4/3;min-height:0;height:auto;margin:0;border-radius:14px;}',
    '.bw-rw-photo img{width:100%;height:100%;max-height:none;object-fit:contain;background:#141414;}',
    '.bw-rw-swap{min-height:0;background:rgba(0,0,0,.13);border:1px solid rgba(197,225,165,.16);border-radius:16px;padding:14px;display:flex;flex-direction:column;}',
    '.bw-rw-guess-panel,.bw-rw-answer-panel{height:100%;display:flex;flex-direction:column;min-height:0;}',
    '.bw-rw-ask{margin:0 0 8px;font-size:14px;}',
    '.bw-rw-year{margin:0 0 8px;gap:12px;}',
    '.bw-rw-year-val{font-size:34px;}',
    '.bw-rw-step{width:42px;height:42px;}',
    '.bw-rw-scale{margin-bottom:12px;}',
    '.bw-rw-dist{gap:8px;margin-bottom:12px;}',
    '.bw-rw-dbtn{min-height:48px;font-size:13.5px;padding:10px 7px;}',
    '.bw-rw-guess-panel .bw-rw-btn,.bw-rw-answer-panel .bw-rw-btn{margin-top:auto;}',
    '.bw-rw-reveal{margin:0;}',
    '.bw-rw-rrow{margin-bottom:10px;}',
    '.bw-rw-rbox{padding:10px;}',
    '.bw-rw-rbox-actual{font-size:20px;}',
    '.bw-rw-phototitle{font-size:16px;margin:0 0 7px;}',
    '.bw-rw-picked{font-size:12.5px;line-height:1.35;color:var(--lg);margin:0 0 8px;}',
    '.bw-rw-story{font-size:14px;line-height:1.48;margin:0 0 9px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}',
    '.bw-rw-credit{font-size:10.5px;margin:0 0 10px;}',
    '.bw-rw-recap{max-width:660px;width:100%;}',
    '@media(min-width:901px){.bw-rw-title{font-size:34px}.bw-rw-play-screen .bw-rw-photo{align-self:start}.bw-rw-result-screen .bw-rw-recap{align-self:center}.bw-rw-result-screen .bw-rw-table{width:100%;}}',
    '@media(max-width:900px){.bw-rw{max-width:600px}.bw-rw-card{height:780px;padding:16px;border-radius:18px}.bw-rw-title{font-size:28px}.bw-rw-sub{font-size:15px;line-height:1.42}.bw-rw-foot{font-size:11.5px}.bw-rw-board{display:block}.bw-rw-photo{margin-bottom:12px}.bw-rw-swap{padding:12px}.bw-rw-year-val{font-size:31px}.bw-rw-step{width:40px;height:40px}.bw-rw-dbtn{min-height:46px;font-size:12.5px}.bw-rw-rrow{gap:8px}.bw-rw-rbox-actual{font-size:18px}.bw-rw-rbox-actual.district{font-size:14px}.bw-rw-r-emoji{font-size:48px}.bw-rw-r-score{font-size:38px}.bw-rw-r-title{font-size:23px}.bw-rw-r-desc{font-size:14px;line-height:1.42}.bw-rw-recap-row{font-size:12.5px;padding:5px 0}.bw-rw-table{padding:4px 10px 6px}.bw-rw-trow{padding:5px 0}.bw-rw-more-links a{font-size:11.5px;min-height:32px;padding:7px 9px}}',
    '@media(max-width:420px){.bw-rw-card{height:760px}.bw-rw-chip{font-size:12px;padding:7px 10px}.bw-rw-chiprow{gap:6px}.bw-rw-home-screen .bw-rw-strip{margin-bottom:12px}.bw-rw-more{margin-top:10px;padding-top:10px}.bw-rw-btnrow{gap:8px;margin-top:12px}.bw-rw-btn{min-height:48px;padding:13px;font-size:15px}.bw-rw-story{font-size:13.5px;line-height:1.43}.bw-rw-credit{font-size:10px}}'
  ].join('');

  // ---------- helpers ----------
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function clampYear(y) { return Math.max(YEAR_MIN, Math.min(YEAR_MAX, y)); }
  function shuffle(arr, rnd) {
    var a = arr.slice(), r = rnd || Math.random;
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function mulberry32(seed) {
    var t = seed >>> 0;
    return function () {
      t += 0x6D2B79F5;
      var r = t;
      r = Math.imul(r ^ (r >>> 15), r | 1);
      r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hashStr(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

  function berlinToday() {
    try {
      return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    } catch (e) {
      return new Date().toISOString().slice(0, 10);
    }
  }
  function addDays(dateStr, n) {
    var p = dateStr.split('-');
    var d = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]));
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }
  function dailyIndices(dateStr) {
    var rnd = mulberry32(hashStr('rewind-' + dateStr));
    var idx = shuffle(PHOTOS.map(function (_, i) { return i; }), rnd);
    return idx.slice(0, ROUNDS_PER_GAME);
  }
  function loadState() {
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      if (raw) { var s = JSON.parse(raw); if (s && typeof s === 'object') { if (!Array.isArray(s.history)) s.history = []; return s; } }
    } catch (e) {}
    return { lastDate: null, streak: 0, best: 0, lastScore: 0, history: [] };
  }
  var WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MO = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function fmtDate(s) {
    var p = String(s).split('-');
    var d = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]));
    return WD[d.getUTCDay()] + ' ' + d.getUTCDate() + ' ' + MO[d.getUTCMonth()];
  }
  function saveState(s) { try { window.localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) {} }

  function scoreYear(guess, actual, tol) {
    var eff = Math.max(0, Math.abs(guess - actual) - (tol || 0));
    return Math.max(0, Math.min(100, Math.round(100 - eff * 6)));
  }
  function yearBand(guess, actual, tol) {
    var diff = Math.abs(guess - actual);
    if (diff <= (tol || 0)) return 'Spot on';
    if (diff <= 3) return 'Very close';
    if (diff <= 7) return 'Right era';
    if (diff <= 12) return 'A bit off';
    return 'Way off';
  }
  function districtScore(pickKey, correctKey) {
    if (pickKey === correctKey) return { pts: 100, band: 'Exact district' };
    var n = (DISTRICTS[correctKey] && DISTRICTS[correctKey].neighbors) || [];
    if (n.indexOf(pickKey) > -1) return { pts: 50, band: 'Next door' };
    return { pts: 0, band: 'Wrong side of town' };
  }
  function buildDistrictOptions(correctKey) {
    var all = Object.keys(DISTRICTS);
    var neighbors = (DISTRICTS[correctKey].neighbors || []).slice();
    var others = all.filter(function (k) { return k !== correctKey && neighbors.indexOf(k) === -1; });
    var opts = [correctKey];
    if (neighbors.length) opts.push(shuffle(neighbors)[0]);
    var pool = shuffle(others);
    while (opts.length < 4 && pool.length) opts.push(pool.shift());
    var extraN = shuffle(neighbors).filter(function (k) { return opts.indexOf(k) === -1; });
    while (opts.length < 4 && extraN.length) opts.push(extraN.shift());
    return shuffle(opts);
  }

  class BWBerlinRewindV2 extends HTMLElement {
    connectedCallback() {
      if (this._booted) return;
      this._booted = true;
      this.classList.add('bw-rw');
      this.setAttribute('data-build', BUILD);
      this._assetBase = this.getAttribute('data-asset-base') || ASSET_BASE;
      this._today = berlinToday();
      this._injectCSS();
      this._route();
    }

    _injectCSS() {
      if (document.getElementById('bw-rw-style')) return;
      var s = document.createElement('style');
      s.id = 'bw-rw-style';
      s.textContent = CSS;
      document.head.appendChild(s);
    }

    _imgUrl(id) { return this._assetBase + 'assets/photos/' + id + '.jpg'; }

    _route() {
      var st = loadState();
      if (st.lastDate === this._today) this._renderGate(st);
      else this._renderStart(st);
    }

    _stripHtml() {
      // decorative archival thumbnails that are NOT in today's set (no spoilers)
      var daily = dailyIndices(this._today);
      var others = PHOTOS.map(function (_, i) { return i; }).filter(function (i) { return daily.indexOf(i) === -1; });
      var pick = shuffle(others).slice(0, 3);
      var self = this;
      var cells = pick.map(function (i) {
        return '<div class="bw-rw-strip-thumb"><img alt="" loading="lazy" src="' + self._imgUrl(PHOTOS[i].id) + '"></div>';
      }).join('');
      return '<div class="bw-rw-strip">' + cells + '</div>';
    }

    _streakChips(st, includeToday) {
      var s = includeToday ? st.streak : st.streak;
      var chips = '';
      if (s > 0) chips += '<span class="bw-rw-chip">🔥 Streak <b>' + s + '</b></span>';
      if (st.best > 0) chips += '<span class="bw-rw-chip">Best <b>' + st.best + '</b></span>';
      chips += '<span class="bw-rw-chip">5 new photos daily</span>';
      return '<div class="bw-rw-chiprow">' + chips + '</div>';
    }

    _scoreTableHtml(st) {
      var hist = (st.history || []).slice(0, 7);
      if (!hist.length) return '';
      var self = this;
      var max = ROUNDS_PER_GAME * 200;
      var rows = hist.map(function (h) {
        var pct = Math.max(0, Math.min(100, Math.round((h.score / max) * 100)));
        var today = h.date === self._today;
        return '<div class="bw-rw-trow' + (today ? ' today' : '') + '">' +
            '<span class="bw-rw-tdate">' + fmtDate(h.date) + (today ? ' &middot; today' : '') + '</span>' +
            '<span class="bw-rw-tbar"><span class="bw-rw-tbar-fill" style="width:' + pct + '%"></span></span>' +
            '<span class="bw-rw-tscore">' + h.score + '</span>' +
          '</div>';
      }).join('');
      return '<div class="bw-rw-table"><div class="bw-rw-table-h">Your recent Rewind scores</div>' + rows + '</div>';
    }

    _moreGamesHtml() {
      var links = GAME_LINKS.map(function (item) {
        return '<a href="' + item.href + '">' + esc(item.label) + '</a>';
      }).join('');
      return '<div class="bw-rw-more"><p class="bw-rw-more-k">More Berlin games</p><div class="bw-rw-more-links">' + links + '</div></div>';
    }

    _renderStart(st) {
      this.innerHTML =
        '<div class="bw-rw-card">' +
          '<div class="bw-rw-screen is-on bw-rw-home-screen">' +
            '<p class="bw-rw-eyebrow">Berlin Rewind · Daily</p>' +
            '<h2 class="bw-rw-title">Read the photo.<br>Name the year and place.</h2>' +
            this._stripHtml() +
            '<p class="bw-rw-sub">Today’s five real Berlin archive photos. Guess the year and the district for each, keep your daily streak alive, and come back tomorrow for a new set.</p>' +
            this._streakChips(st, false) +
            this._scoreTableHtml(st) +
            '<div class="bw-rw-btnrow">' +
              '<button type="button" class="bw-rw-btn" data-start="daily">Play today’s 5 photos</button>' +
            '</div>' +
            this._moreGamesHtml() +
            '<p class="bw-rw-foot">Photos: Bundesarchiv via Wikimedia Commons, CC BY-SA 3.0 DE</p>' +
          '</div>' +
        '</div>';
      var self = this;
      this.querySelector('[data-start]').addEventListener('click', function () { self._startGame('daily'); });
    }

    _renderGate(st) {
      this.innerHTML =
        '<div class="bw-rw-card">' +
          '<div class="bw-rw-screen is-on bw-rw-home-screen">' +
            '<p class="bw-rw-eyebrow">Berlin Rewind · Daily</p>' +
            '<h2 class="bw-rw-title">You’ve played<br>today’s Rewind.</h2>' +
            this._stripHtml() +
            this._streakChips(st, true) +
            this._scoreTableHtml(st) +
            '<p class="bw-rw-tomorrow"><b>New 5 photos tomorrow.</b> Keep the streak going.</p>' +
            '<div class="bw-rw-btnrow">' +
              '<a class="bw-rw-btn" href="' + BOOK_URL + '" target="_blank" rel="noopener">See these places on my free walk</a>' +
              '<button type="button" class="bw-rw-btn ghost" data-start="practice">Practice round (no streak)</button>' +
            '</div>' +
            this._moreGamesHtml() +
          '</div>' +
        '</div>';
      var self = this;
      this.querySelector('[data-start]').addEventListener('click', function () { self._startGame('practice'); });
    }

    _startGame(mode) {
      this._mode = mode;
      var indices = (mode === 'daily') ? dailyIndices(this._today) : shuffle(PHOTOS.map(function (_, i) { return i; })).slice(0, ROUNDS_PER_GAME);
      this._deck = indices.map(function (i) { return PHOTOS[i]; });
      this._round = 0;
      this._total = 0;
      this._recap = [];
      this._deck.forEach(function (p) { var im = new Image(); im.src = this._imgUrl(p.id); }, this);
      this._renderRound();
    }

    _roundControlsHtml(distHtml) {
      return [
        '<div class="bw-rw-guess-panel">',
          '<p class="bw-rw-ask">1. What year is this?</p>',
          '<div class="bw-rw-year">',
            '<button type="button" class="bw-rw-step" data-ystep="-1" aria-label="earlier">−</button>',
            '<span class="bw-rw-year-val" data-yearval>1955</span>',
            '<button type="button" class="bw-rw-step" data-ystep="1" aria-label="later">+</button>',
          '</div>',
          '<input type="range" class="bw-rw-slider" min="' + YEAR_MIN + '" max="' + YEAR_MAX + '" value="1955" step="1" data-yslider>',
          '<div class="bw-rw-scale"><span>' + YEAR_MIN + '</span><span>' + YEAR_MAX + '</span></div>',
          '<p class="bw-rw-ask">2. Which district?</p>',
          distHtml,
          '<button type="button" class="bw-rw-btn" data-reveal="1" disabled>Pick a district to reveal</button>',
        '</div>'
      ].join('');
    }

    _revealHtml(p, yPts, yBand, dRes, isLast) {
      var picked = (DISTRICTS[this._pickedDistrict] && DISTRICTS[this._pickedDistrict].label) || 'No district';
      return [
        '<div class="bw-rw-answer-panel">',
          '<div class="bw-rw-rrow">',
            '<div class="bw-rw-rbox">',
              '<div class="bw-rw-rbox-k">Year</div>',
              '<div class="bw-rw-rbox-actual">' + p.year + '</div>',
              '<div class="bw-rw-rbox-you">You said ' + this._year + ' · ' + yBand + '</div>',
              '<span class="bw-rw-rbox-pts">+' + yPts + '</span>',
            '</div>',
            '<div class="bw-rw-rbox">',
              '<div class="bw-rw-rbox-k">District</div>',
              '<div class="bw-rw-rbox-actual district">' + esc(DISTRICTS[p.district].label) + '</div>',
              '<div class="bw-rw-rbox-you">' + esc(dRes.band) + '</div>',
              '<span class="bw-rw-rbox-pts">+' + dRes.pts + '</span>',
            '</div>',
          '</div>',
          '<div class="bw-rw-phototitle">' + esc(p.title) + '</div>',
          '<p class="bw-rw-picked">You picked ' + esc(picked) + ' · correct: ' + esc(DISTRICTS[p.district].label) + '</p>',
          '<p class="bw-rw-story">' + esc(p.story) + '</p>',
          '<p class="bw-rw-credit">' + esc(p.credit) + ' · <a href="' + p.sourceUrl + '" target="_blank" rel="noopener">source</a></p>',
          '<button type="button" class="bw-rw-btn" data-next="1">' + (isLast ? 'See my Berlin eye' : 'Next photo') + '</button>',
        '</div>'
      ].join('');
    }

    _renderRound() {
      var self = this;
      var p = this._deck[this._round];
      this._year = 1955;
      this._pickedDistrict = null;
      this._options = buildDistrictOptions(p.district);

      var progress = '<div class="bw-rw-progress">';
      for (var i = 0; i < ROUNDS_PER_GAME; i++) progress += '<div class="bw-rw-seg' + (i < this._round ? ' on' : '') + '"></div>';
      progress += '</div>';

      var distHtml = '<div class="bw-rw-dist">';
      this._options.forEach(function (k, idx) {
        distHtml += '<button type="button" class="bw-rw-dbtn" data-dist="' + idx + '">' + esc(DISTRICTS[k].label) + '</button>';
      });
      distHtml += '</div>';

      var label = (this._mode === 'practice') ? 'Practice' : 'Photo';

      this.innerHTML =
        '<div class="bw-rw-card">' +
          '<div class="bw-rw-screen is-on bw-rw-play-screen">' +
            '<div class="bw-rw-top">' +
              '<span class="bw-rw-round">' + label + ' ' + (this._round + 1) + ' / ' + ROUNDS_PER_GAME + '</span>' +
              '<span class="bw-rw-scorepill">' + this._total + ' pts</span>' +
            '</div>' +
            progress +
            '<div class="bw-rw-board">' +
              '<div class="bw-rw-photo">' +
                '<span class="bw-rw-diff">' + esc(p.difficulty) + '</span>' +
                '<span class="bw-rw-loading" data-loading>Loading photo…</span>' +
                '<img alt="Archival Berlin photograph to identify" data-photo src="' + this._imgUrl(p.id) + '">' +
              '</div>' +
              '<div class="bw-rw-swap" data-swap>' + this._roundControlsHtml(distHtml) + '</div>' +
            '</div>' +
          '</div>' +
        '</div>';

      var imgEl = this.querySelector('[data-photo]');
      var loadEl = this.querySelector('[data-loading]');
      function hideLoader() { if (loadEl) loadEl.style.display = 'none'; }
      if (imgEl) {
        if (imgEl.complete && imgEl.naturalWidth > 0) hideLoader();
        imgEl.addEventListener('load', hideLoader);
        imgEl.addEventListener('error', function () { if (loadEl) loadEl.textContent = 'Photo unavailable'; });
      }

      var slider = this.querySelector('[data-yslider]');
      var yval = this.querySelector('[data-yearval]');
      function setYear(y) { self._year = clampYear(y); yval.textContent = self._year; slider.value = self._year; }
      slider.addEventListener('input', function () { setYear(parseInt(slider.value, 10)); });
      this.querySelectorAll('[data-ystep]').forEach(function (b) {
        b.addEventListener('click', function () { setYear(self._year + parseInt(b.getAttribute('data-ystep'), 10)); });
      });

      var revealBtn = this.querySelector('[data-reveal]');
      this.querySelectorAll('[data-dist]').forEach(function (b) {
        b.addEventListener('click', function () {
          self._pickedDistrict = self._options[parseInt(b.getAttribute('data-dist'), 10)];
          self.querySelectorAll('[data-dist]').forEach(function (x) { x.classList.remove('sel'); });
          b.classList.add('sel');
          revealBtn.removeAttribute('disabled');
          revealBtn.textContent = 'Reveal the answer';
        });
      });
      revealBtn.addEventListener('click', function () { if (!revealBtn.hasAttribute('disabled')) self._reveal(); });
    }

    _reveal() {
      var self = this;
      var p = this._deck[this._round];
      var yPts = scoreYear(this._year, p.year, p.tol);
      var yBand = yearBand(this._year, p.year, p.tol);
      var dRes = districtScore(this._pickedDistrict, p.district);
      var roundPts = yPts + dRes.pts;
      this._total += roundPts;
      this._recap.push({ title: p.title, pts: roundPts });

      var isLast = this._round >= ROUNDS_PER_GAME - 1;
      var swap = this.querySelector('[data-swap]');
      if (swap) swap.innerHTML = this._revealHtml(p, yPts, yBand, dRes, isLast);
      var pill = this.querySelector('.bw-rw-scorepill');
      if (pill) pill.textContent = this._total + ' pts';

      this.querySelector('[data-next]').addEventListener('click', function () {
        if (isLast) self._renderResult();
        else { self._round += 1; self._renderRound(); }
      });
    }

    _renderResult() {
      var self = this;
      var max = ROUNDS_PER_GAME * 200;
      var tier = TIERS[0];
      for (var i = 0; i < TIERS.length; i++) { if (this._total >= TIERS[i].min) { tier = TIERS[i]; break; } }

      // streak update only for the daily run, once per Berlin day
      var st = loadState();
      var streakLine = '';
      if (this._mode === 'daily' && st.lastDate !== this._today) {
        if (st.lastDate === addDays(this._today, -1)) st.streak = (st.streak || 0) + 1;
        else st.streak = 1;
        st.best = Math.max(st.best || 0, st.streak);
        st.lastScore = this._total;
        st.lastDate = this._today;
        st.history = Array.isArray(st.history) ? st.history : [];
        if (!st.history.length || st.history[0].date !== this._today) {
          st.history.unshift({ date: this._today, score: this._total });
          st.history = st.history.slice(0, HISTORY_MAX);
        }
        saveState(st);
        streakLine = '<p class="bw-rw-tomorrow">🔥 Day streak <b>' + st.streak + '</b> · new 5 photos tomorrow</p>';
      } else if (this._mode === 'practice') {
        streakLine = '<p class="bw-rw-tomorrow">Practice round · your daily streak is safe</p>';
      }

      var recapHtml = '<div class="bw-rw-recap">';
      this._recap.forEach(function (r, i) {
        recapHtml += '<div class="bw-rw-recap-row"><span class="bw-rw-recap-t">' + (i + 1) + '. ' + esc(r.title) + '</span><span class="bw-rw-recap-p">' + r.pts + '/200</span></div>';
      });
      recapHtml += '</div>';
      var shareText = 'Berlin Rewind: I scored ' + this._total + '/' + max + ' (' + tier.title + '). Play free at berlinwalk.com/games';

      var secondBtn = (this._mode === 'daily')
        ? '<button type="button" class="bw-rw-btn ghost" data-copy="1">Copy my score</button>'
        : '<button type="button" class="bw-rw-btn ghost" data-again="1">Another practice round</button>';

      this.innerHTML =
        '<div class="bw-rw-card">' +
          '<div class="bw-rw-screen is-on bw-rw-result-screen">' +
            '<div class="bw-rw-r-emoji">' + tier.emoji + '</div>' +
            '<p class="bw-rw-r-score">' + this._total + '<span style="font-size:20px;color:var(--lg);">/' + max + '</span></p>' +
            '<p class="bw-rw-r-scoresub">' + (this._mode === 'practice' ? 'Practice score' : 'Today’s Rewind score') + '</p>' +
            '<h2 class="bw-rw-r-title">' + esc(tier.title) + '</h2>' +
            '<p class="bw-rw-r-desc">' + esc(tier.desc) + '</p>' +
            recapHtml +
            streakLine +
            (this._mode === 'daily' ? this._scoreTableHtml(st) : '') +
            '<div class="bw-rw-btnrow">' +
              '<a class="bw-rw-btn" href="' + BOOK_URL + '" target="_blank" rel="noopener">See these places on my free walk</a>' +
              secondBtn +
              (this._mode === 'practice' ? '<button type="button" class="bw-rw-btn link" data-copy2="1">Copy my score</button>' : '') +
            '</div>' +
            this._moreGamesHtml() +
            '<div class="bw-rw-copied" data-copied></div>' +
          '</div>' +
        '</div>';

      var again = this.querySelector('[data-again]');
      if (again) again.addEventListener('click', function () { self._startGame('practice'); });
      var self2 = this;
      function doCopy() {
        var note = self2.querySelector('[data-copied]');
        function ok() { if (note) note.textContent = 'Copied. Paste it anywhere.'; }
        function fail() { if (note) note.textContent = shareText; }
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(shareText).then(ok, fail);
          else fail();
        } catch (e) { fail(); }
      }
      var copy = this.querySelector('[data-copy]');
      if (copy) copy.addEventListener('click', doCopy);
      var copy2 = this.querySelector('[data-copy2]');
      if (copy2) copy2.addEventListener('click', doCopy);
    }
  }

  if (!customElements.get(TAG)) {
    try { customElements.define(TAG, BWBerlinRewindV2); }
    catch (e) { if (window && window.console) { console.warn('bw-berlin-rewind-v2 define failed', e); } }
  }
})();
