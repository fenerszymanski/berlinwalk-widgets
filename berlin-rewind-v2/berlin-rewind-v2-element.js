/*
 * <bw-berlin-rewind-v2> — Berlin Rewind V2
 *
 * Daily archival photo guessing game ("arkasi yarin" style): every Berlin day
 * serves the same deterministic set of 5 photos, tracks a play streak in
 * localStorage, and gates you to "come back tomorrow" once today is done
 * (with an optional practice mode that does not touch the streak).
 *
 * Self-contained UI: light DOM, instance state, no globals, no iframe, no
 * postMessage/resize, no MutationObserver, no external CSS/JS. The 30-day
 * photo batch loads from data/archive-current.json with a 10-photo inlined
 * fallback if the archive file is unavailable.
 *
 * Mount:
 *   <bw-berlin-rewind-v2></bw-berlin-rewind-v2>
 *   <bw-berlin-rewind-stable-v2></bw-berlin-rewind-stable-v2>
 *   <bw-berlin-rewind-fit-v2></bw-berlin-rewind-fit-v2>
 *   <bw-berlin-rewind-clean-v2></bw-berlin-rewind-clean-v2>
 *   <bw-berlin-rewind-result-games-v2></bw-berlin-rewind-result-games-v2>
 *   <script src=".../berlin-rewind-v2/berlin-rewind-v2-element.js" defer></script>
 *
 * Build marker: berlin-rewind-v2-game-fit-20260710e
 */
(function () {
  'use strict';

  var BOOK_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
  var GAMES_URL = 'https://www.berlinwalk.com/games?utm_source=berlin_rewind&utm_medium=result_screen&utm_campaign=berlinwalk_games&utm_content=play_other_games';
  var BUILD = 'berlin-rewind-v2-game-fit-20260710e';
  var TRACKING_ENDPOINT_PROD = 'https://app.berlinwalk.com/api/rewind-event';
  var TRACKING_ENDPOINT_LOCAL = 'http://127.0.0.1:5173/api/rewind-event';
  var LEADERBOARD_ENDPOINT_PROD = 'https://app.berlinwalk.com/api/rewind-leaderboard';
  var LEADERBOARD_ENDPOINT_LOCAL = 'http://127.0.0.1:5173/api/rewind-leaderboard';
  var TAG = 'bw-berlin-rewind-v2';
  var STABLE_TAG = 'bw-berlin-rewind-stable-v2';
  var FIT_TAG = 'bw-berlin-rewind-fit-v2';
  var CLEAN_TAG = 'bw-berlin-rewind-clean-v2';
  var RESULT_GAMES_TAG = 'bw-berlin-rewind-result-games-v2';
  var LEADERBOARD_TAG = 'bw-berlin-rewind-leaderboard-v2';
  var STORE_KEY = 'bwRewindV2State';
  var PLAYER_KEY = 'bwRewindV2Player';
  var VISITOR_KEY = 'bw_rewind_visitor_id';
  var SESSION_KEY = 'bwRewindV2Session';
  var LANDING_KEY = 'bwRewindV2Landing';
  var HISTORY_MAX = 14;

  // Absolute default so photos resolve even when a host (e.g. Wix) loads this
  // script with document.currentScript null/proxied. Overridable per-instance
  // with data-asset-base (used by the local standalone preview).
  var ASSET_BASE = 'https://fenerszymanski.github.io/berlinwalk-widgets/berlin-rewind-v2/';

  var YEAR_MIN = 1880;
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
    // global leaderboard
    '.bw-rw-global{background:rgba(0,0,0,.18);border:1px solid rgba(197,225,165,.18);border-radius:14px;padding:10px 12px;margin:0 0 12px;}',
    '.bw-rw-global-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px;}',
    '.bw-rw-global-k{font-size:10px;font-weight:900;letter-spacing:1.4px;text-transform:uppercase;color:var(--lg);}',
    '.bw-rw-global-name{border:1px solid rgba(197,225,165,.45);background:rgba(255,255,255,.07);color:var(--cream);border-radius:999px;padding:5px 9px;font-size:11px;font-weight:800;cursor:pointer;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
    '.bw-rw-me{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:8px;}',
    '.bw-rw-me span{display:block;background:rgba(255,255,255,.07);border-radius:10px;padding:7px 8px;font-size:10px;font-weight:800;color:var(--lg);line-height:1.25;}',
    '.bw-rw-me b{display:block;color:var(--y);font-size:14px;margin-top:2px;}',
    '.bw-rw-lists{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.7fr);gap:8px;}',
    '.bw-rw-ltitle{font-size:10px;font-weight:900;letter-spacing:1.2px;text-transform:uppercase;color:var(--lg);margin:0 0 4px;}',
    '.bw-rw-lrow{display:flex;align-items:center;gap:7px;min-height:22px;font-size:11px;color:var(--cream);border-top:1px solid rgba(255,255,255,.07);padding-top:4px;}',
    '.bw-rw-lrow:first-of-type{border-top:none;padding-top:0;}',
    '.bw-rw-lrank{color:var(--y);font-weight:900;width:24px;flex:0 0 auto;}',
    '.bw-rw-lname{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;flex:1;}',
    '.bw-rw-lscore{color:var(--lg);font-weight:900;white-space:nowrap;}',
    '.bw-rw-lmuted{font-size:11px;color:var(--lg);line-height:1.35;margin:0;}',
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
    '.bw-rw-actionpair{display:grid;grid-template-columns:1fr 1fr;gap:8px;}',
    '.bw-rw-actionpair .bw-rw-btn{width:auto;}',
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
    '.bw-rw{max-width:1080px;padding:0;}',
    '.bw-rw-card{height:760px;border-radius:18px;padding:22px;color:var(--cream);}',
    '.bw-rw-screen.is-on{height:100%;display:flex;flex-direction:column;animation:bwrwfade .2s ease;}',
    '.bw-rw-home-screen,.bw-rw-result-screen{max-width:720px;margin:0 auto;width:100%;justify-content:center;padding:0 clamp(12px,2.2vw,26px);}',
    '.bw-rw-home-screen .bw-rw-strip{max-width:620px;}',
    '.bw-rw-home-screen .bw-rw-table,.bw-rw-home-screen .bw-rw-global{width:100%;}',
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
    '.bw-rw-result-screen{overflow:hidden;}',
    '.bw-rw-result-screen .bw-rw-r-emoji{font-size:46px;margin:0 0 2px;}',
    '.bw-rw-result-screen .bw-rw-r-score{font-size:38px;}',
    '.bw-rw-result-screen .bw-rw-r-score span{font-size:18px!important;}',
    '.bw-rw-result-screen .bw-rw-r-scoresub{margin:0 0 8px;}',
    '.bw-rw-result-screen .bw-rw-r-title{font-size:24px;margin:0 0 6px;}',
    '.bw-rw-result-screen .bw-rw-r-desc{font-size:14px;line-height:1.42;margin:0 0 10px;}',
    '.bw-rw-result-screen .bw-rw-recap{margin:0;}',
    '.bw-rw-result-screen .bw-rw-recap-row{font-size:12.5px;padding:5px 0;}',
    '.bw-rw-result-screen .bw-rw-tomorrow{margin:8px 0 0;}',
    '.bw-rw-result-screen .bw-rw-table{margin:0;padding:4px 12px 7px;}',
    '.bw-rw-result-screen .bw-rw-global{margin:0;padding:8px 10px;}',
    '.bw-rw-result-screen .bw-rw-me{grid-template-columns:repeat(3,minmax(0,1fr));gap:5px;margin-bottom:7px;}',
    '.bw-rw-result-screen .bw-rw-me span{padding:6px 7px;font-size:9.5px;}',
    '.bw-rw-result-screen .bw-rw-lrow{font-size:10.5px;min-height:20px;}',
    '.bw-rw-result-screen .bw-rw-trow{padding:5px 0;}',
    '.bw-rw-result-screen .bw-rw-btnrow{gap:8px;margin-top:0;}',
    '.bw-rw-result-screen .bw-rw-btn{min-height:46px;padding:12px 14px;font-size:15px;}',
    '.bw-rw-result-screen .bw-rw-copied{margin-top:0;}',
    '@media(min-width:901px){.bw-rw-title{font-size:34px}.bw-rw-play-screen .bw-rw-photo{align-self:start}.bw-rw-home-screen.is-on{justify-content:flex-start;padding-block:0}.bw-rw-home-screen .bw-rw-eyebrow{font-size:11px;margin-bottom:5px}.bw-rw-home-screen .bw-rw-title{font-size:30px;line-height:1.02;letter-spacing:0;margin-bottom:10px}.bw-rw-home-screen .bw-rw-strip{max-width:560px;gap:8px;margin-bottom:12px}.bw-rw-home-screen .bw-rw-strip-thumb{aspect-ratio:4/3}.bw-rw-home-screen .bw-rw-sub{font-size:14.5px;line-height:1.38;margin-bottom:11px}.bw-rw-home-screen .bw-rw-chiprow{margin-bottom:9px}.bw-rw-home-screen .bw-rw-chip{font-size:12.5px;padding:7px 11px}.bw-rw-home-screen .bw-rw-table{margin-bottom:9px;padding:3px 12px 6px}.bw-rw-home-screen .bw-rw-table-h{font-size:10px;padding:8px 0 5px}.bw-rw-home-screen .bw-rw-trow{padding:5px 0}.bw-rw-home-screen .bw-rw-global{margin-bottom:9px;padding:8px 10px}.bw-rw-home-screen .bw-rw-global-head{margin-bottom:6px}.bw-rw-home-screen .bw-rw-me{margin-bottom:6px}.bw-rw-home-screen .bw-rw-me span{padding:6px 7px}.bw-rw-home-screen .bw-rw-lrow{min-height:20px;padding-top:3px}.bw-rw-home-screen .bw-rw-tomorrow{margin:7px 0 0;font-size:13px}.bw-rw-home-screen .bw-rw-btnrow{margin-top:7px;gap:8px}.bw-rw-home-screen .bw-rw-btn{min-height:44px;padding:11px 14px;font-size:15px}.bw-rw-home-screen .bw-rw-foot{margin-top:7px;font-size:10.5px}.bw-rw-result-screen.is-on{max-width:980px;display:grid;grid-template-columns:minmax(300px,390px) minmax(0,1fr);grid-template-areas:"badge recap" "score recap" "sub recap" "title recap" "desc table" "streak table" "buttons table" "copied table";column-gap:24px;row-gap:5px;align-content:center;justify-content:stretch;padding-inline:26px}.bw-rw-result-screen .bw-rw-r-emoji{grid-area:badge}.bw-rw-result-screen .bw-rw-r-score{grid-area:score}.bw-rw-result-screen .bw-rw-r-scoresub{grid-area:sub}.bw-rw-result-screen .bw-rw-r-title{grid-area:title}.bw-rw-result-screen .bw-rw-r-desc{grid-area:desc}.bw-rw-result-screen .bw-rw-recap{grid-area:recap;align-self:end;width:100%;max-width:none}.bw-rw-result-screen .bw-rw-tomorrow{grid-area:streak}.bw-rw-result-screen .bw-rw-table,.bw-rw-result-screen .bw-rw-global{grid-area:table;align-self:start;width:100%}.bw-rw-result-screen .bw-rw-btnrow{grid-area:buttons}.bw-rw-result-screen .bw-rw-copied{grid-area:copied}}',
    '@media(max-width:900px){.bw-rw{max-width:600px}.bw-rw-card{height:780px;padding:16px;border-radius:18px}.bw-rw-title{font-size:28px}.bw-rw-sub{font-size:15px;line-height:1.42}.bw-rw-foot{font-size:11.5px}.bw-rw-board{display:block}.bw-rw-photo{margin-bottom:12px}.bw-rw-swap{padding:12px}.bw-rw-year-val{font-size:31px}.bw-rw-step{width:40px;height:40px}.bw-rw-dbtn{min-height:46px;font-size:12.5px}.bw-rw-rrow{gap:8px}.bw-rw-rbox-actual{font-size:18px}.bw-rw-rbox-actual.district{font-size:14px}.bw-rw-home-screen{padding-inline:16px}.bw-rw-result-screen{justify-content:flex-start;padding-inline:14px}.bw-rw-result-screen .bw-rw-r-emoji{font-size:34px;margin:-2px 0 0}.bw-rw-result-screen .bw-rw-r-score{font-size:31px}.bw-rw-result-screen .bw-rw-r-score span{font-size:15px!important}.bw-rw-result-screen .bw-rw-r-scoresub{font-size:11px;margin:0 0 5px}.bw-rw-result-screen .bw-rw-r-title{font-size:20px;margin-bottom:5px}.bw-rw-result-screen .bw-rw-r-desc{font-size:12.8px;line-height:1.34;margin-bottom:7px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.bw-rw-result-screen .bw-rw-recap{padding:6px 10px;margin-bottom:0}.bw-rw-result-screen .bw-rw-recap-row{font-size:11.2px;padding:4px 0}.bw-rw-result-screen .bw-rw-tomorrow{font-size:12px;margin:6px 0}.bw-rw-result-screen .bw-rw-table{padding:2px 9px 5px;margin-bottom:0}.bw-rw-result-screen .bw-rw-table-h{font-size:9.5px;padding:7px 0 4px}.bw-rw-result-screen .bw-rw-trow{padding:4px 0}.bw-rw-result-screen .bw-rw-tdate{font-size:11px;width:104px}.bw-rw-result-screen .bw-rw-tscore{font-size:11.5px;width:44px}.bw-rw-result-screen .bw-rw-btnrow{gap:7px;margin-top:7px}.bw-rw-result-screen .bw-rw-btn{min-height:42px;padding:10px 12px;font-size:13.5px}.bw-rw-result-screen .bw-rw-copied{font-size:11px;min-height:13px}.bw-rw-r-emoji{font-size:48px}.bw-rw-r-score{font-size:38px}.bw-rw-r-title{font-size:23px}.bw-rw-r-desc{font-size:14px;line-height:1.42}.bw-rw-recap-row{font-size:12.5px;padding:5px 0}.bw-rw-table{padding:4px 10px 6px}.bw-rw-trow{padding:5px 0}}',
    '@media(max-width:420px){.bw-rw-card{height:790px}.bw-rw-chip{font-size:12px;padding:7px 10px}.bw-rw-chiprow{gap:6px}.bw-rw-home-screen{padding-inline:14px}.bw-rw-home-screen.is-on{justify-content:flex-start}.bw-rw-home-screen .bw-rw-title{font-size:26px;line-height:1.04;margin-bottom:8px}.bw-rw-home-screen .bw-rw-sub{font-size:14px;line-height:1.36;margin-bottom:10px}.bw-rw-home-screen .bw-rw-strip{margin-bottom:9px}.bw-rw-home-screen .bw-rw-strip-thumb{aspect-ratio:4/3}.bw-rw-home-screen .bw-rw-chiprow{margin-bottom:8px}.bw-rw-home-screen .bw-rw-table{margin-bottom:8px}.bw-rw-home-screen .bw-rw-global{margin-bottom:8px}.bw-rw-home-screen .bw-rw-lrow:nth-of-type(n+4){display:none}.bw-rw-home-screen .bw-rw-foot{margin-top:8px}.bw-rw-btnrow{gap:8px;margin-top:12px}.bw-rw-btn{min-height:48px;padding:13px;font-size:15px}.bw-rw-story{font-size:13.5px;line-height:1.43}.bw-rw-credit{font-size:10px}.bw-rw-global{padding:8px 9px}.bw-rw-lists{grid-template-columns:1fr}.bw-rw-lists .bw-rw-lcol:last-child{display:none}.bw-rw-result-screen{padding-inline:13px}.bw-rw-result-screen .bw-rw-global{padding:7px 8px}.bw-rw-result-screen .bw-rw-global-head{margin-bottom:5px}.bw-rw-result-screen .bw-rw-me{margin-bottom:5px}.bw-rw-result-screen .bw-rw-lrow:nth-of-type(n+5){display:none}.bw-rw-result-screen .bw-rw-btnrow{gap:6px;margin-top:6px}.bw-rw-result-screen .bw-rw-btn{min-height:40px;padding:9px 10px;font-size:13px}}'
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
  function dailyIndices(dateStr, photos, archive) {
    photos = Array.isArray(photos) && photos.length ? photos : PHOTOS;
    if (archive && archive.schedule && archive.schedule[dateStr]) {
      var byId = {};
      photos.forEach(function (photo, i) { byId[photo.id] = i; });
      var scheduled = archive.schedule[dateStr].ids || archive.schedule[dateStr];
      var fromSchedule = scheduled.map(function (id) { return byId[id]; }).filter(function (i) { return typeof i === 'number'; });
      if (fromSchedule.length >= ROUNDS_PER_GAME) return fromSchedule.slice(0, ROUNDS_PER_GAME);
    }
    var rnd = mulberry32(hashStr('rewind-' + dateStr));
    var idx = shuffle(photos.map(function (_, i) { return i; }), rnd);
    return idx.slice(0, ROUNDS_PER_GAME);
  }
  function validArchive(data) {
    return data && Array.isArray(data.photos) && data.photos.length >= ROUNDS_PER_GAME && data.schedule && typeof data.schedule === 'object';
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
  function readJson(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function writeJson(key, value) {
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }
  function storageGet(key) {
    try { return window.localStorage.getItem(key) || ''; } catch (e) { return ''; }
  }
  function storageSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) {}
  }
  function sessionGet(key) {
    try { return window.sessionStorage.getItem(key) || ''; } catch (e) { return ''; }
  }
  function sessionSet(key, value) {
    try { window.sessionStorage.setItem(key, value); } catch (e) {}
  }
  function randomId(prefix) {
    return prefix + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
  }
  function cleanName(value) {
    return String(value || '').replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 40);
  }
  function defaultName(playerId) {
    var suffix = String(playerId || '').replace(/[^a-z0-9]/gi, '').slice(-4).toUpperCase();
    return 'Berlin Archivist ' + (suffix || '2026');
  }
  function playerProfile() {
    var profile = readJson(PLAYER_KEY, null);
    if (!profile || typeof profile !== 'object') profile = {};
    if (!profile.playerId) profile.playerId = randomId('rewind_player');
    profile.displayName = cleanName(profile.displayName) || defaultName(profile.playerId);
    writeJson(PLAYER_KEY, profile);
    return profile;
  }
  function setPlayerName(value) {
    var profile = playerProfile();
    profile.displayName = cleanName(value) || profile.displayName;
    writeJson(PLAYER_KEY, profile);
    return profile;
  }
  function trackingSessionId() {
    var existing = sessionGet(SESSION_KEY);
    if (existing) return existing;
    var value = randomId('rewind_session');
    sessionSet(SESSION_KEY, value);
    return value;
  }
  function trackingVisitorId() {
    var existing = storageGet(VISITOR_KEY);
    if (existing) return existing;
    var value = randomId('rewind_visitor');
    storageSet(VISITOR_KEY, value);
    return value;
  }
  function landingPage() {
    var existing = sessionGet(LANDING_KEY);
    if (existing) return existing;
    var value = window.location.href || '';
    sessionSet(LANDING_KEY, value);
    return value;
  }
  function urlParam(name) {
    try { return new URLSearchParams(window.location.search || '').get(name) || ''; } catch (e) { return ''; }
  }
  function cookieValue(name) {
    try {
      var item = document.cookie.split('; ').find(function (part) { return part.indexOf(name + '=') === 0; });
      return item ? decodeURIComponent(item.split('=').slice(1).join('=')) : '';
    } catch (e) {
      return '';
    }
  }
  function isPaidAttribution(utmMedium, utmCampaign) {
    var medium = String(utmMedium || '').toLowerCase();
    var campaign = String(utmCampaign || '').toLowerCase();
    return /paid|cpc|ppc|ad|ads|meta|facebook|instagram/.test(medium) ||
      /paid|campaign|lead|conversion|meta|facebook|instagram/.test(campaign) ||
      Boolean(urlParam('fbclid'));
  }
  function endpoint(prod, local) {
    if (urlParam('tracking') === 'off') return '';
    if (/^(localhost|127\.0\.0\.1)$/.test(window.location.hostname || '')) {
      return (urlParam('tracking') === 'local' || urlParam('local_tracking') === '1') ? local : '';
    }
    return prod;
  }
  function buildSetId(dayKey) { return 'rewind-' + dayKey; }

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
    constructor() {
      super();
      this._leaderboard = null;
      this._trackingSequence = 0;
      this._viewTracked = false;
      this._submittedDailyResult = false;
      this._player = null;
    }

    connectedCallback() {
      if (this._booted) return;
      this._booted = true;
      this.classList.add('bw-rw');
      this.setAttribute('data-build', BUILD);
      this._assetBase = this.getAttribute('data-asset-base') || ASSET_BASE;
      if (this._assetBase.slice(-1) !== '/') this._assetBase += '/';
      this._today = berlinToday();
      this._photos = PHOTOS;
      this._archive = null;
      this._player = playerProfile();
      this._injectCSS();
      this._renderLoading();
      this._loadArchive().then(() => this._route(), () => this._route());
    }

    _injectCSS() {
      if (document.getElementById('bw-rw-style')) return;
      var s = document.createElement('style');
      s.id = 'bw-rw-style';
      s.textContent = CSS;
      document.head.appendChild(s);
    }

    _imgUrl(id) { return this._assetBase + 'assets/photos/' + id + '.jpg'; }

    _photoUrl(photo) {
      if (!photo) return '';
      if (photo.asset) return this._assetBase + photo.asset.replace(/^\/+/, '');
      return this._imgUrl(photo.id);
    }

    _renderLoading() {
      this.innerHTML =
        '<div class="bw-rw-card">' +
          '<div class="bw-rw-screen is-on bw-rw-home-screen">' +
            '<p class="bw-rw-eyebrow">Berlin Rewind · Daily</p>' +
            '<h2 class="bw-rw-title">Loading today’s archive...</h2>' +
            '<p class="bw-rw-sub">Five Berlin photos are being prepared.</p>' +
          '</div>' +
        '</div>';
    }

    async _loadArchive() {
      var url = this._assetBase + 'data/archive-current.json?v=' + encodeURIComponent(this._today);
      var res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('archive load failed');
      var data = await res.json();
      if (!validArchive(data)) throw new Error('archive invalid');
      this._archive = data;
      this._photos = data.photos;
      this.setAttribute('data-archive-batch', data.batchId || 'archive');
      this.setAttribute('data-archive-count', String(data.photos.length));
    }

    _route() {
      var st = loadState();
      if (st.lastDate === this._today) this._renderGate(st);
      else this._renderStart(st);
      this._trackPageView();
      this._refreshLeaderboard();
    }

    _stripHtml() {
      // decorative archival thumbnails that are NOT in today's set (no spoilers)
      var photos = this._photos || PHOTOS;
      var daily = dailyIndices(this._today, photos, this._archive);
      var others = photos.map(function (_, i) { return i; }).filter(function (i) { return daily.indexOf(i) === -1; });
      var pick = shuffle(others).slice(0, 3);
      var self = this;
      var cells = pick.map(function (i) {
        return '<div class="bw-rw-strip-thumb"><img alt="" loading="lazy" src="' + self._photoUrl(photos[i]) + '"></div>';
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

    _scoreTableHtml(st, limit) {
      var hist = (st.history || []).slice(0, limit || 7);
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

    _leaderboardHtml() {
      var board = this._leaderboard || null;
      var profile = this._player || playerProfile();
      var name = profile.displayName || defaultName(profile.playerId);
      if (!board) {
        return '<div class="bw-rw-global" data-lb-board>' +
          '<div class="bw-rw-global-head">' +
            '<span class="bw-rw-global-k">Global ranking</span>' +
            '<button type="button" class="bw-rw-global-name" data-lb-name title="Change leaderboard name">' + esc(name) + '</button>' +
          '</div>' +
          '<p class="bw-rw-lmuted">Loading the global board...</p>' +
        '</div>';
      }

      if (board.unavailable) {
        return '<div class="bw-rw-global" data-lb-board>' +
          '<div class="bw-rw-global-head">' +
            '<span class="bw-rw-global-k">Global ranking</span>' +
            '<button type="button" class="bw-rw-global-name" data-lb-name title="Change leaderboard name">' + esc(name) + '</button>' +
          '</div>' +
          '<p class="bw-rw-lmuted">The global board is unavailable right now. Your score still stays on this device.</p>' +
        '</div>';
      }

      var me = board.me || {};
      var top = Array.isArray(board.top) ? board.top : [];
      var today = Array.isArray(board.today) ? board.today : [];
      function scoreLabel(row) {
        if (!row) return '0';
        return String(row.totalScore != null ? row.totalScore : row.score || 0);
      }
      function rowsHtml(rows, scoreKey) {
        if (!rows.length) return '<p class="bw-rw-lmuted">First public scores are landing today.</p>';
        return rows.slice(0, 5).map(function (row) {
          var score = scoreKey === 'score' ? row.score : row.totalScore;
          return '<div class="bw-rw-lrow">' +
            '<span class="bw-rw-lrank">#' + esc(row.rank || '-') + '</span>' +
            '<span class="bw-rw-lname">' + esc(row.displayName || 'Berlin Archivist') + '</span>' +
            '<span class="bw-rw-lscore">' + esc(score || 0) + '</span>' +
          '</div>';
        }).join('');
      }
      return '<div class="bw-rw-global" data-lb-board>' +
        '<div class="bw-rw-global-head">' +
          '<span class="bw-rw-global-k">Global ranking</span>' +
          '<button type="button" class="bw-rw-global-name" data-lb-name title="Change leaderboard name">' + esc(name) + '</button>' +
        '</div>' +
        '<div class="bw-rw-me" aria-label="Your global Rewind standing">' +
          '<span>You<b>' + (me.rank ? '#' + esc(me.rank) : 'New') + '</b></span>' +
          '<span>Total<b>' + esc(me.totalScore || 0) + '</b></span>' +
          '<span>Today<b>' + (me.todayRank ? '#' + esc(me.todayRank) : (me.todayScore ? esc(me.todayScore) : '-')) + '</b></span>' +
        '</div>' +
        '<div class="bw-rw-lists">' +
          '<div class="bw-rw-lcol"><p class="bw-rw-ltitle">Top 5 all-time</p>' + rowsHtml(top, 'totalScore') + '</div>' +
          '<div class="bw-rw-lcol"><p class="bw-rw-ltitle">Today top</p>' + rowsHtml(today.slice(0, 3), 'score') + '</div>' +
        '</div>' +
      '</div>';
    }

    _applyLeaderboard(board) {
      if (!board) return;
      this._leaderboard = board;
      var slot = this.querySelector('[data-lb-board]');
      if (slot) {
        slot.outerHTML = this._leaderboardHtml();
        this._bindLeaderboardControls();
      }
    }

    _bindLeaderboardControls() {
      var self = this;
      var button = this.querySelector('[data-lb-name]');
      if (!button) return;
      button.addEventListener('click', function () {
        var current = (self._player || playerProfile()).displayName;
        var next = window.prompt('Name on the global Rewind board', current);
        if (next == null) return;
        self._player = setPlayerName(next);
        self._applyLeaderboard(self._leaderboard || { top: [], today: [], me: null });
      });
    }

    _bindBookingLinks() {
      var self = this;
      this.querySelectorAll('[data-book]').forEach(function (link) {
        link.addEventListener('click', function () {
          self._track('bw_berlin_rewind_booking_click', {
            dayKey: self._today,
            setId: buildSetId(self._today),
            action: link.getAttribute('data-book') || 'book_tour'
          });
        });
      });
    }

    _leaderboardEndpoint() {
      return endpoint(LEADERBOARD_ENDPOINT_PROD, LEADERBOARD_ENDPOINT_LOCAL);
    }

    _trackingEndpoint() {
      return endpoint(TRACKING_ENDPOINT_PROD, TRACKING_ENDPOINT_LOCAL);
    }

    _refreshLeaderboard() {
      var url = this._leaderboardEndpoint();
      if (!url) {
        this._applyLeaderboard({ top: [], today: [], me: null, unavailable: true });
        return Promise.resolve(null);
      }
      var profile = this._player || playerProfile();
      try {
        return fetch(url, {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            playerId: profile.playerId,
            dayKey: this._today,
            limit: 5
          })
        }).then(function (response) {
          if (!response.ok) return null;
          return response.json().catch(function () { return null; });
        }).then((data) => {
          if (data && data.leaderboard) this._applyLeaderboard(data.leaderboard);
          else this._applyLeaderboard({ top: [], today: [], me: null, unavailable: true });
          return data;
        }).catch(() => {
          this._applyLeaderboard({ top: [], today: [], me: null, unavailable: true });
          return null;
        });
      } catch (e) {
        this._applyLeaderboard({ top: [], today: [], me: null, unavailable: true });
        return Promise.resolve(null);
      }
    }

    _track(eventName, detail, options) {
      var url = this._trackingEndpoint();
      if (!url) return Promise.resolve(null);
      options = options || {};
      var profile = this._player || playerProfile();
      var timestamp = new Date().toISOString();
      var utmSource = urlParam('utm_source') || 'games';
      var utmMedium = urlParam('utm_medium') || 'rewind';
      var utmCampaign = urlParam('utm_campaign') || 'bw_rewind';
      var payload = Object.assign({
        source: 'berlin_rewind_v2',
        context: 'berlin_rewind_v2',
        dayKey: this._today,
        setId: buildSetId(this._today),
        dailyMode: this._mode || '',
        playerId: profile.playerId,
        displayName: profile.displayName,
        archiveBatch: this.getAttribute('data-archive-batch') || (this._archive && this._archive.batchId) || ''
      }, detail || {});
      var body = {
        eventName: eventName,
        eventId: trackingSessionId() + ':' + eventName + ':' + (++this._trackingSequence),
        sessionId: trackingSessionId(),
        visitorId: trackingVisitorId(),
        timestamp: timestamp,
        eventDate: this._today,
        pagePath: window.location.pathname || '',
        pageUrl: window.location.href || '',
        parentPath: urlParam('parent_path'),
        parentUrl: urlParam('parent_url'),
        referrer: document.referrer || '',
        landingPage: landingPage(),
        firstPage: landingPage(),
        utmSource: utmSource,
        utmMedium: utmMedium,
        utmCampaign: utmCampaign,
        utmContent: urlParam('utm_content'),
        utmTerm: urlParam('utm_term'),
        fbclid: urlParam('fbclid'),
        fbc: cookieValue('_fbc'),
        fbp: cookieValue('_fbp'),
        isPaid: isPaidAttribution(utmMedium, utmCampaign),
        screenWidth: String(window.screen && window.screen.width ? window.screen.width : ''),
        viewportWidth: String(window.innerWidth || document.documentElement.clientWidth || ''),
        returnStats: Boolean(options.returnStats),
        payload: payload
      };
      var json = JSON.stringify(body);
      if (!options.returnStats) {
        try {
          if (navigator.sendBeacon && window.Blob) {
            var blob = new Blob([json], { type: 'application/json' });
            if (navigator.sendBeacon(url, blob)) return Promise.resolve(null);
          }
        } catch (e) {}
      }
      try {
        return fetch(url, {
          method: 'POST',
          mode: 'cors',
          keepalive: !options.returnStats,
          headers: { 'Content-Type': 'application/json' },
          body: json
        }).then(function (response) {
          if (!options.returnStats || !response.ok) return null;
          return response.json().catch(function () { return null; });
        }).catch(function () { return null; });
      } catch (e) {
        return Promise.resolve(null);
      }
    }

    _trackPageView() {
      if (this._viewTracked) return;
      this._viewTracked = true;
      this._track('bw_berlin_rewind_page_view', {
        dayKey: this._today,
        setId: buildSetId(this._today),
        photoCount: String(ROUNDS_PER_GAME)
      });
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
            this._scoreTableHtml(st, 3) +
            this._leaderboardHtml() +
            '<div class="bw-rw-btnrow">' +
              '<button type="button" class="bw-rw-btn" data-start="daily">Play today’s 5 photos</button>' +
            '</div>' +
            '<p class="bw-rw-foot">Photos: Bundesarchiv via Wikimedia Commons, CC BY-SA 3.0 DE</p>' +
          '</div>' +
        '</div>';
      var self = this;
      this.querySelector('[data-start]').addEventListener('click', function () { self._startGame('daily'); });
      this._bindLeaderboardControls();
    }

    _renderGate(st) {
      this.innerHTML =
        '<div class="bw-rw-card">' +
          '<div class="bw-rw-screen is-on bw-rw-home-screen">' +
            '<p class="bw-rw-eyebrow">Berlin Rewind · Daily</p>' +
            '<h2 class="bw-rw-title">You’ve played<br>today’s Rewind.</h2>' +
            this._stripHtml() +
            this._streakChips(st, true) +
            this._leaderboardHtml() +
            this._scoreTableHtml(st, 3) +
            '<p class="bw-rw-tomorrow"><b>New 5 photos tomorrow.</b> Keep the streak going.</p>' +
            '<div class="bw-rw-btnrow">' +
              '<a class="bw-rw-btn" href="' + BOOK_URL + '" target="_blank" rel="noopener" data-book="gate">See these places on my free walk</a>' +
              '<button type="button" class="bw-rw-btn ghost" data-start="practice">Practice round (no streak)</button>' +
            '</div>' +
          '</div>' +
        '</div>';
      var self = this;
      this.querySelector('[data-start]').addEventListener('click', function () { self._startGame('practice'); });
      this._bindLeaderboardControls();
      this._bindBookingLinks();
    }

    _startGame(mode) {
      this._mode = mode;
      if (mode === 'daily') {
        this._submittedDailyResult = false;
        this._track('bw_berlin_rewind_start', {
          dayKey: this._today,
          setId: buildSetId(this._today),
          dailyMode: mode
        });
      }
      var photos = this._photos || PHOTOS;
      var indices = (mode === 'daily') ? dailyIndices(this._today, photos, this._archive) : shuffle(photos.map(function (_, i) { return i; })).slice(0, ROUNDS_PER_GAME);
      this._deck = indices.map(function (i) { return photos[i]; });
      this._round = 0;
      this._total = 0;
      this._recap = [];
      this._deck.forEach(function (p) { var im = new Image(); im.src = this._photoUrl(p); }, this);
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
                '<img alt="Archival Berlin photograph to identify" data-photo src="' + this._photoUrl(p) + '">' +
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
      var yearDiff = Math.abs(this._year - p.year);
      this._total += roundPts;
      this._recap.push({
        title: p.title,
        pts: roundPts,
        photoId: p.id,
        guessYear: this._year,
        actualYear: p.year,
        yearDiff: yearDiff,
        yearPoints: yPts,
        districtGuess: this._pickedDistrict,
        actualDistrict: p.district,
        districtResult: dRes.band,
        districtPoints: dRes.pts
      });
      if (this._mode === 'daily') {
        this._track('bw_berlin_rewind_photo_guess', {
          dayKey: this._today,
          setId: buildSetId(this._today),
          photoId: p.id,
          photoTitle: p.title,
          photoIndex: String(this._round + 1),
          guessYear: String(this._year),
          actualYear: String(p.year),
          yearDiff: String(yearDiff),
          yearPoints: String(yPts),
          districtGuess: this._pickedDistrict,
          actualDistrict: p.district,
          districtResult: dRes.band,
          districtPoints: String(dRes.pts),
          totalScore: String(this._total),
          maxScore: String(ROUNDS_PER_GAME * 200),
          dailyMode: this._mode
        });
      }

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

    _emojiGrid() {
      return (this._recap || []).map(function (row) {
        if (row.pts >= 170) return '🟩';
        if (row.pts >= 100) return '🟨';
        if (row.pts >= 50) return '🟧';
        return '⬛';
      }).join(' ');
    }

    _submitDailyResult(tier, st) {
      if (this._mode !== 'daily' || this._submittedDailyResult) return;
      this._submittedDailyResult = true;
      this._track('bw_berlin_rewind_complete', {
        dayKey: this._today,
        setId: buildSetId(this._today),
        totalScore: String(this._total),
        maxScore: String(ROUNDS_PER_GAME * 200),
        title: tier.title,
        streak: String(st.streak || 0),
        emojiGrid: this._emojiGrid(),
        dailyMode: 'daily',
        archiveBatch: this.getAttribute('data-archive-batch') || (this._archive && this._archive.batchId) || ''
      }, { returnStats: true }).then((data) => {
        if (data && data.leaderboard) this._applyLeaderboard(data.leaderboard);
        else this._refreshLeaderboard();
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
      var secondaryActions = '<div class="bw-rw-actionpair">' +
          secondBtn +
          '<a class="bw-rw-btn ghost" href="' + GAMES_URL + '">Play other games</a>' +
        '</div>';

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
            (this._mode === 'daily' ? this._leaderboardHtml() : '') +
            '<div class="bw-rw-btnrow">' +
              '<a class="bw-rw-btn" href="' + BOOK_URL + '" target="_blank" rel="noopener" data-book="result">See these places on my free walk</a>' +
              secondaryActions +
              (this._mode === 'practice' ? '<button type="button" class="bw-rw-btn link" data-copy2="1">Copy my score</button>' : '') +
            '</div>' +
            '<div class="bw-rw-copied" data-copied></div>' +
          '</div>' +
        '</div>';

      var again = this.querySelector('[data-again]');
      if (again) again.addEventListener('click', function () { self._startGame('practice'); });
      var self2 = this;
      function doCopy() {
        var note = self2.querySelector('[data-copied]');
        function ok() {
          if (note) note.textContent = 'Copied. Paste it anywhere.';
          self2._track('bw_berlin_rewind_share', {
            dayKey: self2._today,
            setId: buildSetId(self2._today),
            method: 'copy',
            shareMethod: 'copy',
            dailyMode: self2._mode || '',
            success: 'true'
          });
        }
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
      this._bindLeaderboardControls();
      this._bindBookingLinks();
      this._submitDailyResult(tier, st);
    }
  }

  if (!customElements.get(TAG)) {
    try { customElements.define(TAG, BWBerlinRewindV2); }
    catch (e) { if (window && window.console) { console.warn('bw-berlin-rewind-v2 define failed', e); } }
  }
  if (!customElements.get(STABLE_TAG)) {
    try { customElements.define(STABLE_TAG, class BWBerlinRewindStableV2 extends BWBerlinRewindV2 {}); }
    catch (e) { if (window && window.console) { console.warn('bw-berlin-rewind-stable-v2 define failed', e); } }
  }
  if (!customElements.get(FIT_TAG)) {
    try { customElements.define(FIT_TAG, class BWBerlinRewindFitV2 extends BWBerlinRewindV2 {}); }
    catch (e) { if (window && window.console) { console.warn('bw-berlin-rewind-fit-v2 define failed', e); } }
  }
  if (!customElements.get(CLEAN_TAG)) {
    try { customElements.define(CLEAN_TAG, class BWBerlinRewindCleanV2 extends BWBerlinRewindV2 {}); }
    catch (e) { if (window && window.console) { console.warn('bw-berlin-rewind-clean-v2 define failed', e); } }
  }
  if (!customElements.get(RESULT_GAMES_TAG)) {
    try { customElements.define(RESULT_GAMES_TAG, class BWBerlinRewindResultGamesV2 extends BWBerlinRewindV2 {}); }
    catch (e) { if (window && window.console) { console.warn('bw-berlin-rewind-result-games-v2 define failed', e); } }
  }
  if (!customElements.get(LEADERBOARD_TAG)) {
    try { customElements.define(LEADERBOARD_TAG, class BWBerlinRewindLeaderboardV2 extends BWBerlinRewindV2 {}); }
    catch (e) { if (window && window.console) { console.warn('bw-berlin-rewind-leaderboard-v2 define failed', e); } }
  }
})();
