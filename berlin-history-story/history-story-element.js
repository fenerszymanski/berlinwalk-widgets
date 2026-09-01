/*
 * <bw-berlin-history-story> - Berlin History Story V1
 *
 * Light-DOM scrolly Custom Element. It retains the core mechanisms proven in
 * the Wall Timeline: RAF scroll updates, dynamic fixed/absolute stage mode,
 * IntersectionObserver card reveals, keyboard rail, reduced-motion behaviour,
 * map fetch/fallback and the #bwqa=<scrollY> QA hook.
 */
(function () {
  'use strict';

  var TAG = 'bw-berlin-history-story';
  var BUILD = 'berlin-history-story-v1-20260901';
  var SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : '';
  var BASE_URL = SCRIPT_URL && !/static\.wixstatic\.com/i.test(SCRIPT_URL)
    ? new URL('./', SCRIPT_URL).toString()
    : 'https://fenerszymanski.github.io/berlinwalk-widgets/berlin-history-story/';
  var HOME_URL = 'https://www.berlinwalk.com/?utm_source=berlin_history_story&utm_medium=story&utm_campaign=history_v1&utm_content=wordmark';
  var BOOK_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based?utm_source=berlin_history_story&utm_medium=story&utm_campaign=history_v1&utm_content=closing_cta';
  var WALL_URL = 'https://www.berlinwalk.com/berlin-wall-timeline?utm_source=berlin_history_story&utm_medium=story&utm_campaign=history_v1&utm_content=scene_8';
  var FINAL_URL = 'https://www.berlinwalk.com/berlin-history-story';
  var COVER_URL = BASE_URL + 'assets/social/berlin-history-story-1200x630.jpg';
  var SEO = {
    title: 'Berlin History Story: 800 Years in 10 Scenes | BerlinWalk',
    articleHeadline: 'Berlin History Story: 800 Years in 10 Scenes',
    description: 'Scroll through 800 years of Berlin history, from Molkenmarkt and medieval Cölln to Greater Berlin, the Wall and the city today.',
    socialTitle: 'Berlin History Story: 800 Years in 10 Scenes | BerlinWalk',
    socialDescription: 'Scroll through 800 years of Berlin history, from Molkenmarkt and medieval Cölln to Greater Berlin, the Wall and the city today.',
    image: COVER_URL,
    imageAlt: 'A c. 1740 map of Berlin by Homann Heirs'
  };

  var CHAPTERS = [
    { key: 'molkenmarkt', year: 2026, h: 150, align: 'left', eyebrow: 'Scene 1 · Today', title: 'Start at Molkenmarkt', body: 'At Molkenmarkt, Berlin is not finished with its own beginning. Since 2019, state archaeologists have been examining the ground before a new quarter is built here. They call this Berlin\'s oldest market and an archive of around 800 years of city life. That is a useful way to start: the streets under your feet are not a backdrop. They are evidence. Look for the low ground by the Spree, then imagine traders, bridges and courts pressing close together.' },
    { key: 'twin', year: 1237, h: 145, align: 'right', eyebrow: 'Scene 2 · 1237', title: 'Two towns on the Spree', body: 'The year 1237 belongs to Cölln, not to a finished city called Berlin. Cölln and Berlin grew as two merchant settlements on opposite banks of the Spree. Cölln appears in writing in 1237; Berlin follows in 1244. The river was a working route, a crossing and a boundary all at once. Stand near the water and read the city as a pair, not a single founding myth. The first documents are milestones, not a certain birthday party.' },
    { key: 'royal', year: 1701, h: 155, align: 'left', eyebrow: 'Scene 3 · 1701-1740', title: 'A royal capital takes shape', body: 'Power changed the scale of Berlin. In 1701 Friedrich III became Friedrich I, King in Prussia, and Berlin became the royal residence. The city did not suddenly gain its neat streets that year: the rectilinear plan of Friedrichstadt had begun in 1688 and was extended south in 1732. That distinction matters. A ruler can accelerate a city without inventing every line on its map. Around Gendarmenmarkt and Friedrichstraße, look for the long straight decisions that still organise the walk.' },
    { key: 'industrial', year: 1871, h: 155, align: 'right', eyebrow: 'Scene 4 · 1871-1900', title: 'The dense industrial city', body: 'By the late nineteenth century, Berlin was growing faster than its old scale could hold. The Hobrecht Plan of 1862 laid out a framework of streets and blocks. From around 1870, owners and builders divided those blocks into deep plots and dense courtyard housing, the Mietskasernen. The plan did not build the tenements by itself. It created a frame that later investment filled hard. When you see a sequence of courtyards in Kreuzberg or Wedding, notice how a city plan became an everyday address.' },
    { key: 'greater', year: 1920, h: 155, align: 'left', eyebrow: 'Scene 5 · 1920', title: 'Greater Berlin', body: 'On 1 October 1920, Berlin stopped being only its old core. Old Berlin joined seven neighbouring municipal cities, 59 rural communities and 27 estate districts to form Greater Berlin. The population rose to about 3.8 million, while the city area expanded from 65.72 to 878.1 square kilometres. That is why Berlin can feel like several cities stitched together: it was deliberately assembled that way. The new city began with 20 boroughs, not today\'s 12. Its size was a political decision before it was a visitor\'s map.' },
    { key: 'dictatorship', year: 1933, h: 175, align: 'right', eyebrow: 'Scene 6 · 1933-1945', title: 'Dictatorship, deportation and destruction', body: 'From 1933, the Nazi state turned Berlin into a capital of persecution. Berlin Jews were stripped of rights and property; systematic deportations began in October 1941. The memorial at Gleis 17 records more than 50,000 Berlin Jews deported and murdered between October 1941 and February 1945. This cannot be reduced to an atmospheric chapter in a city story. Name the perpetrators, pause at the evidence, and let the dates stay precise. By 1945, bombing and battle had also left much of Berlin destroyed.' },
    { key: 'sectors', year: 1948, h: 160, align: 'left', eyebrow: 'Scene 7 · 1945-1949', title: 'Four sectors and the Airlift', body: 'After the war, Berlin was divided into four sectors. That is different from Germany\'s four occupation zones, and the distinction matters on every map. In June 1948, Soviet authorities blocked land, rail and water access to West Berlin. The Western Allies supplied the city by air. The blockade was lifted on 12 May 1949, but the Airlift continued into the autumn. Tempelhof, Tegel and Gatow became more than airports: they were working entries to an enclosed city. Follow the arrows as a supply story, not a decorative flight path.' },
    { key: 'wall', year: 1961, h: 170, align: 'right', eyebrow: 'Scene 8 · 1961-1989', title: 'The Wall', body: 'On the night of 12-13 August 1961, GDR forces began sealing Berlin\'s sector border with barbed wire. The barriers became a fortified Wall system that shaped ordinary journeys for almost three decades. On 9 November 1989, crossings opened after Günter Schabowski\'s confused announcement and the pressure at Bornholmer Straße. That was not German reunification, which came on 3 October 1990. Nor did every concrete section vanish overnight. Use the Berlin Wall Timeline for the fuller map and sequence; this story only marks the hinge.' },
    { key: 'reunited', year: 1990, h: 155, align: 'left', eyebrow: 'Scene 9 · 1990-2010', title: 'A reunited capital', body: 'Reunification took effect on 3 October 1990. On 20 June 1991, the Bundestag voted to move parliament and government to Berlin. Those are separate dates, and they produced a long, uneven rebuilding process rather than one clean reset. Potsdamer and Leipziger Platz show the change at full scale. A former border void became a dense new district of offices, shops, stations and public space. It is impressive, but it is not a substitute for the older city around it. Compare the new skyline with the missing streets beneath it.' },
    { key: 'today', year: 2026, h: 175, align: 'center', eyebrow: 'Scene 10 · Today', title: 'Four places, one careful walk', body: 'Four places can keep this story useful after the scroll: Molkenmarkt for the buried market city; Friedrichstraße and Gendarmenmarkt for the planned royal capital; Gleis 17 at S Grunewald for the evidence of deportation; Potsdamer and Leipziger Platz for the post-Wall rebuild. They are not the whole of Berlin. They are four honest starting points. Start with one place and one date, then notice what has changed, what survives and what the map leaves out.' }
  ];

  var PHOTOS = [
    { scene: 'royal', className: 'royal', src: 'assets/photos/1740-berlin-map.jpg', alt: 'A c. 1740 map of Berlin by Homann Heirs', credit: 'Homann Heirs, c. 1740 · public domain' },
    { scene: 'industrial', className: 'industrial', src: 'assets/photos/1894-hallesches-tor.jpg', alt: 'Hallesches Tor in Berlin, 1894', credit: 'Robert Prager, 1894 · public domain' },
    { scene: 'dictatorship', className: 'dictatorship', src: 'assets/photos/1945-brandenburg-gate-ruins.jpg', alt: 'Brandenburg Gate ruins viewed from the east in 1945', credit: 'AIP Emilio Segrè Visual Archives, 1945 · CC0 1.0' },
    { scene: 'wall', className: 'wall-build', src: 'assets/photos/1961-wall-build.jpg', alt: 'Berlin Wall construction in 1961', credit: 'Bundesarchiv Bild 173-1321 / Helmut J. Wolf · CC BY-SA 3.0 DE' },
    { scene: 'wall', className: 'wall-gate', src: 'assets/photos/1982-brandenburg-gate-wall.jpg', alt: 'Brandenburg Gate walled off in 1982', credit: 'Zika, 1982 · public domain' },
    { scene: 'reunited', className: 'reunited', src: 'assets/photos/2016-sony-center.jpg', alt: 'Sony Center at Potsdamer Platz in 2016', credit: 'Fred Romero, 2016 · CC BY 2.0' }
  ];

  var CSS = [
    "@font-face{font-family:'BW Fraunces';src:url('" + BASE_URL + "assets/fonts/Fraunces-Variable.ttf') format('truetype');font-weight:300 900;font-display:swap}",
    "@font-face{font-family:'BW Space';src:url('" + BASE_URL + "assets/fonts/SpaceGrotesk-Variable.ttf') format('truetype');font-weight:300 700;font-display:swap}",
    "@font-face{font-family:'BW Mono';src:url('" + BASE_URL + "assets/fonts/IBMPlexMono-Regular.ttf') format('truetype');font-weight:400;font-display:swap}",
    ".bw-hs{--ink:#f7f5ef;--dim:rgba(247,245,239,.74);--faint:rgba(247,245,239,.48);--night:#102016;--deep:#08120d;--green:#123D18;--yellow:#FFE600;--red:#E63946;--line:rgba(247,245,239,.19);--panel:rgba(8,18,13,.88);display:block;position:relative;width:100vw;max-width:100vw;margin:0 calc((100% - 100vw)/2);overflow:visible;background:var(--deep);color:var(--ink);font:16px/1.55 'BW Space',Arial,sans-serif;text-size-adjust:100%;-webkit-font-smoothing:antialiased}.bw-hs *{box-sizing:border-box}.bw-hs a{color:inherit}",
    ".bw-hs-scrolly{position:relative}.bw-hs-stage-frame{height:100vh;height:100svh;position:relative}.bw-hs-stage{position:absolute;inset:0;width:100%;height:100vh;height:100svh;z-index:0;overflow:hidden;background:radial-gradient(circle at 52% 38%,#193424 0%,var(--night) 45%,var(--deep) 100%);transition:background .5s ease}.bw-hs-stage svg{display:block;width:100%;height:100%}.bw-hs-vignette{position:absolute;inset:0;z-index:1;pointer-events:none;background:radial-gradient(ellipse at 50% 45%,transparent 34%,rgba(0,0,0,.54) 100%)}",
    ".bw-hs-steps{position:relative;z-index:2;margin-top:-100vh;margin-top:-100svh;pointer-events:none}.bw-hs-step{position:relative;display:flex;padding:0 clamp(18px,6vw,88px);pointer-events:none}.bw-hs-step[data-align=left]{align-items:center;justify-content:flex-start}.bw-hs-step[data-align=right]{align-items:center;justify-content:flex-end}.bw-hs-step[data-align=center]{align-items:center;justify-content:center;text-align:center}",
    ".bw-hs-card{position:relative;z-index:4;width:min(34rem,100%);padding:clamp(22px,3vw,38px);pointer-events:auto;background:var(--panel);border:1px solid var(--line);box-shadow:0 18px 60px rgba(0,0,0,.22);opacity:0;transform:translateY(24px);transition:opacity .5s ease,transform .5s ease}.bw-hs-card.in{opacity:1;transform:none}.bw-hs-step[data-ch=molkenmarkt] .bw-hs-card,.bw-hs-step[data-ch=today] .bw-hs-card{background:rgba(8,18,13,.68);border-color:rgba(255,230,0,.34)}",
    ".bw-hs-eyebrow{margin:0 0 .75rem;color:var(--yellow);font:400 .69rem/1.3 'BW Mono',monospace;letter-spacing:.14em;text-transform:uppercase}.bw-hs-card-title{margin:-.4rem 0 .8rem;color:var(--dim);font-size:.8rem!important;font-weight:700!important;text-transform:uppercase;letter-spacing:.08em}.bw-hs-card h1,.bw-hs-card h2{margin:0 0 .9rem;color:var(--ink);font-family:'BW Fraunces',Georgia,serif;font-weight:620;line-height:1.03;letter-spacing:-.026em;text-wrap:balance}.bw-hs-card h1{font-size:clamp(2.55rem,6vw,5.35rem)}.bw-hs-card h2{font-size:clamp(1.85rem,3.4vw,3.15rem)}.bw-hs-card p{margin:0;color:var(--dim);font-size:clamp(.98rem,1.35vw,1.08rem)}.bw-hs-hero-kicker{margin-top:1.35rem!important;color:var(--faint)!important;font:400 .73rem/1.5 'BW Mono',monospace!important;letter-spacing:.09em;text-transform:uppercase}.bw-hs-scroll-cue{display:inline-flex;align-items:center;gap:.55rem;margin-top:1.35rem;color:var(--yellow);font:400 .69rem/1.2 'BW Mono',monospace;letter-spacing:.12em;text-transform:uppercase}.bw-hs-scroll-cue:after{content:'';width:42px;height:1px;background:var(--yellow);animation:bwhs-cue 1.8s ease-in-out infinite}@keyframes bwhs-cue{0%,100%{opacity:.4;transform:translateX(0)}50%{opacity:1;transform:translateX(9px)}}",
    ".bw-hs-source-link{display:inline-flex;margin-top:1rem;color:var(--yellow)!important;font-size:.86rem;font-weight:650;text-decoration-thickness:1px;text-underline-offset:3px}.bw-hs-btn{display:inline-flex;align-items:center;justify-content:center;margin-top:1.25rem;padding:.92rem 1.12rem;background:var(--yellow);border:2px solid var(--yellow);border-radius:3px;color:var(--green)!important;font-weight:750;text-decoration:none;letter-spacing:.02em}.bw-hs a.bw-hs-btn:visited{color:var(--green)!important}.bw-hs-btn:hover{background:#fff36b;border-color:#fff36b}.bw-hs-btn:focus-visible,.bw-hs-source-link:focus-visible,.bw-hs-rail button:focus-visible,.bw-hs-details summary:focus-visible{outline:3px solid var(--yellow);outline-offset:4px}.bw-hs-place-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:1.1rem;text-align:left}.bw-hs-place{padding:.55rem 0;border-top:1px solid var(--line);color:var(--dim);font-size:.78rem}.bw-hs-place b{display:block;color:var(--ink);font:400 .62rem/1.4 'BW Mono',monospace;letter-spacing:.09em;text-transform:uppercase}.bw-hs-final-note{margin-top:1rem!important;color:var(--faint)!important;font-size:.78rem!important}",
    ".bw-hs-photo-stack{position:absolute;inset:0;z-index:2;pointer-events:none}.bw-hs-photo{position:absolute;width:clamp(200px,26vw,360px);margin:0;opacity:0;transform:translateY(18px);transition:opacity .55s ease,transform .55s ease}.bw-hs-photo.is-visible{opacity:1;transform:none}.bw-hs-photo img{display:block;width:100%;aspect-ratio:16/10;object-fit:cover;border:1px solid rgba(247,245,239,.34);filter:saturate(.74) contrast(1.04);box-shadow:0 18px 45px rgba(0,0,0,.38)}.bw-hs-photo figcaption{margin-top:6px;color:var(--faint);font:400 .49rem/1.35 'BW Mono',monospace}.bw-hs-photo.royal,.bw-hs-photo.reunited{right:clamp(26px,8vw,120px);bottom:11%}.bw-hs-photo.industrial,.bw-hs-photo.dictatorship{left:clamp(26px,7vw,100px);bottom:12%}.bw-hs-photo.wall-build{left:clamp(20px,5vw,70px);bottom:12%;width:clamp(145px,19vw,250px)}.bw-hs-photo.wall-gate{right:clamp(20px,5vw,70px);top:18%;width:clamp(145px,19vw,250px)}.bw-hs-photo.is-missing{display:none}",
    ".bw-hs-hud{position:absolute;top:max(clamp(16px,3vh,34px),env(safe-area-inset-top));left:clamp(16px,4vw,50px);z-index:4}.bw-hs-year{color:var(--ink);font:700 clamp(2rem,6vw,4.6rem)/1 'BW Mono',monospace;font-variant-numeric:tabular-nums}.bw-hs-year span{color:var(--yellow)}.bw-hs-chapter{max-width:14rem;margin-top:.45rem;color:var(--dim);font:400 .65rem/1.4 'BW Mono',monospace;letter-spacing:.12em;text-transform:uppercase}.bw-hs-map-state{margin-top:.48rem;color:var(--faint);font:400 .54rem/1.4 'BW Mono',monospace;letter-spacing:.06em;text-transform:uppercase}.bw-hs-brand{position:absolute;top:max(clamp(16px,3vh,34px),env(safe-area-inset-top));right:clamp(16px,4vw,54px);z-index:5;display:block;width:clamp(126px,13vw,190px);text-decoration:none}.bw-hs-brand img{display:block;width:100%;height:auto}.bw-hs-rail{position:fixed;right:26px;top:50%;z-index:6;display:flex;flex-direction:column;gap:12px;transform:translateY(-50%);pointer-events:auto}.bw-hs-rail button{position:relative;width:11px;height:11px;padding:0;border:1px solid rgba(247,245,239,.58);border-radius:50%;background:transparent;cursor:pointer}.bw-hs-rail button.on{background:var(--yellow);border-color:var(--yellow);transform:scale(1.25)}.bw-hs-rail button:before{display:none}",
    ".bw-hs-stage [data-v],.bw-hs-real-map{opacity:0;transition:opacity .5s ease;pointer-events:none}.bw-hs-stage [data-v].is-visible,.bw-hs-real-map.is-visible{opacity:1}.bw-hs svg .outline{fill:none;stroke:rgba(247,245,239,.5);stroke-width:2}.bw-hs svg .water{fill:none;stroke:#6fa5c7;stroke-opacity:.56;stroke-width:10;stroke-linecap:round}.bw-hs svg .label{fill:var(--dim);font:400 13px 'BW Mono',monospace;letter-spacing:.1em;text-transform:uppercase}.bw-hs svg .quiet{fill:rgba(247,245,239,.48);font:400 11px 'BW Mono',monospace;letter-spacing:.08em;text-transform:uppercase}.bw-hs svg .ring{fill:none;stroke:var(--yellow);stroke-width:2;stroke-dasharray:4 10}.bw-hs svg .dot{fill:var(--yellow);stroke:var(--deep);stroke-width:2}.bw-hs svg .grid{stroke:rgba(247,245,239,.32);stroke-width:1.2}.bw-hs svg .block{fill:rgba(247,245,239,.08);stroke:rgba(247,245,239,.26);stroke-width:1}.bw-hs svg .arrow{fill:none;stroke:var(--yellow);stroke-width:2;stroke-dasharray:4 7;marker-end:url(#bwhs-arrow)}.bw-hs svg .wall-line{fill:none;stroke:var(--red);stroke-width:3;stroke-linecap:round;stroke-linejoin:round}.bw-hs svg .count{fill:var(--yellow);font:50px 'BW Fraunces',Georgia,serif}.bw-hs svg .real-sector{stroke:rgba(247,245,239,.35);stroke-width:1}.bw-hs svg .real-boundary{fill:none;stroke:rgba(247,245,239,.48);stroke-width:2.3;stroke-linejoin:round}.bw-hs svg .real-water{fill:none;stroke:#6fa5c7;stroke-opacity:.45;stroke-width:4}.bw-hs svg .real-wall{fill:none;stroke:var(--red);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}.bw-hs svg .real-airport{fill:var(--yellow);stroke:var(--deep);stroke-width:1.5}.bw-hs svg .real-label{fill:var(--ink);font:9px 'BW Mono',monospace;letter-spacing:.06em}.bw-hs svg .real-note{fill:rgba(247,245,239,.38);font:8px 'BW Mono',monospace;letter-spacing:.04em}",
    ".bw-hs-aftercare{position:relative;z-index:3;padding:clamp(44px,8vw,100px) clamp(18px,6vw,88px) clamp(64px,10vw,120px);background:#f7f5ef;color:#16311e}.bw-hs-aftercare-inner{width:min(920px,100%);margin:0 auto}.bw-hs-aftercare h2{margin:0 0 .75rem;font:620 clamp(2rem,4vw,3.5rem)/1.04 'BW Fraunces',Georgia,serif;letter-spacing:-.025em}.bw-hs-aftercare p{max-width:680px;margin:.5rem 0 1.2rem;color:#31513a}.bw-hs-details{margin-top:12px;border-top:1px solid rgba(18,61,24,.24);border-bottom:1px solid rgba(18,61,24,.24)}.bw-hs-details summary{padding:1rem 0;cursor:pointer;color:#123D18;font-weight:700}.bw-hs-details[open] summary{border-bottom:1px solid rgba(18,61,24,.16)}.bw-hs-details-body{padding:1rem 0 1.25rem}.bw-hs-related-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 20px}.bw-hs-related-grid a,.bw-hs-source-list a,.bw-hs-credit-list a{color:#123D18;text-decoration-thickness:1px;text-underline-offset:3px}.bw-hs-related-grid a{font-size:.87rem}.bw-hs-source-list{columns:2;column-gap:32px;margin:0;padding-left:1.1rem}.bw-hs-source-list li{break-inside:avoid;margin:0 0 .75rem;color:#31513a;font-size:.88rem}.bw-hs-credit-list{margin:0;padding-left:1.1rem;color:#31513a;font-size:.85rem}.bw-hs-credit-list li{margin:.5rem 0}.bw-hs-baseline{margin-top:.8rem!important;color:#55715c!important;font-size:.77rem}",
    "@media (prefers-reduced-motion:reduce){.bw-hs *,.bw-hs *:before,.bw-hs *:after{scroll-behavior:auto!important;animation:none!important;transition:none!important}}@media (max-width:640px){.bw-hs-step{padding:0 14px;align-items:flex-end!important;justify-content:center!important}.bw-hs-step[data-ch=molkenmarkt],.bw-hs-step[data-ch=today]{align-items:center!important}.bw-hs-card{width:100%;margin-bottom:12vh;padding:22px 20px}.bw-hs-step[data-ch=molkenmarkt] .bw-hs-card,.bw-hs-step[data-ch=today] .bw-hs-card{margin-bottom:0}.bw-hs-card h1{font-size:clamp(2.35rem,13vw,3.8rem)}.bw-hs-card h2{font-size:clamp(1.75rem,9vw,2.55rem)}.bw-hs-photo{width:42vw;max-width:190px}.bw-hs-photo.royal,.bw-hs-photo.reunited{right:14px;bottom:7%}.bw-hs-photo.industrial,.bw-hs-photo.dictatorship{left:14px;bottom:7%}.bw-hs-photo.wall-build{left:14px;bottom:8%;width:36vw}.bw-hs-photo.wall-gate{right:14px;top:17%;width:36vw}.bw-hs-photo figcaption{font-size:.42rem}.bw-hs-brand{width:clamp(104px,30vw,134px)}.bw-hs-hud{top:max(15px,env(safe-area-inset-top));left:14px}.bw-hs-year{font-size:1.8rem}.bw-hs-chapter{max-width:9rem;font-size:.55rem}.bw-hs-map-state{max-width:9rem;font-size:.45rem}.bw-hs-rail{right:22px;gap:8px}.bw-hs-rail button{width:8px;height:8px}.bw-hs-rail button:before{display:none}.bw-hs-place-grid,.bw-hs-related-grid{grid-template-columns:1fr}.bw-hs-aftercare{padding-left:18px;padding-right:18px}.bw-hs-source-list{columns:1}.bw-hs-stage svg{transform:scale(1.04);transform-origin:center}.bw-hs[data-chapter=today] .bw-hs-hud,.bw-hs[data-chapter=today] .bw-hs-brand{opacity:0;pointer-events:none}}",
    "@media (max-width:900px) and (max-height:540px) and (orientation:landscape){.bw-hs-step{padding:10px 74px 10px 58px;align-items:center!important;justify-content:center!important}.bw-hs-card{width:min(650px,100%);margin:0;padding:14px 18px}.bw-hs-card h1{font-size:clamp(2rem,5vw,2.8rem)}.bw-hs-card h2{font-size:clamp(1.35rem,3.2vw,2.05rem)}.bw-hs-card p{font-size:.83rem;line-height:1.36}.bw-hs-eyebrow{margin-bottom:.4rem;font-size:.58rem}.bw-hs-hero-kicker{margin-top:.7rem!important;font-size:.58rem!important}.bw-hs-scroll-cue{margin-top:.7rem;font-size:.55rem}.bw-hs-place-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:5px 10px;margin-top:.6rem}.bw-hs-place{padding:.34rem 0;font-size:.62rem}.bw-hs-place b{font-size:.5rem}.bw-hs-btn{margin-top:.65rem;padding:.6rem .88rem;font-size:.8rem}.bw-hs-final-note{margin-top:.6rem!important;font-size:.62rem!important;line-height:1.35}.bw-hs-rail{right:26px;gap:5px}.bw-hs-rail button{width:8px;height:8px}.bw-hs-hud{top:12px;left:34px}.bw-hs-year{font-size:1.55rem}.bw-hs-chapter{max-width:8rem;font-size:.48rem}.bw-hs-map-state{font-size:.42rem}.bw-hs-brand{top:13px;right:38px;width:118px}.bw-hs-photo{opacity:.5}.bw-hs-photo figcaption{display:none}}"
  ].join('');

  var SVG = [
    '<svg viewBox="0 0 1000 640" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><defs><marker id="bwhs-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#FFE600"></path></marker><pattern id="bwhs-hatch" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="12" stroke="rgba(247,245,239,.28)" stroke-width="2"></line></pattern></defs>',
    '<g data-v="molkenmarkt"><path class="water" d="M-30 395C145 350 215 378 323 358C425 338 468 286 579 305C711 326 752 409 1030 332"></path><path class="outline" d="M340 244L594 218L676 327L562 417L360 402Z"></path><circle class="dot" cx="496" cy="326" r="9"></circle><circle cx="496" cy="326" r="21" fill="none" stroke="#FFE600" stroke-opacity=".45" stroke-width="2"></circle><text class="label" x="452" y="283">Molkenmarkt</text><text class="quiet" x="456" y="307">ground as archive</text><text class="quiet" x="728" y="387">Spree</text></g>',
    '<g data-v="twin"><path class="water" d="M-30 400C170 344 294 430 466 372C626 318 690 356 1030 276"></path><circle class="dot" cx="424" cy="335" r="11"></circle><circle class="dot" cx="530" cy="407" r="11"></circle><path class="ring" d="M372 250C445 202 563 232 620 312C672 384 618 484 527 512C432 542 331 472 330 374C330 321 347 276 372 250Z"></path><text class="label" x="366" y="311">Berlin</text><text class="label" x="543" y="456">Cölln</text><text class="quiet" x="448" y="385">two banks, one crossing</text></g>',
    '<g data-v="royal"><path class="water" d="M-30 405C210 350 330 430 503 365C687 295 720 344 1030 254"></path><g class="grid"><path d="M320 190V500M375 170V522M430 155V540M485 150V545M540 156V540M595 170V522M650 190V500"></path><path d="M260 230H730M238 290H760M224 350H775M238 410H760M260 470H730"></path></g><rect x="335" y="222" width="245" height="210" fill="none" stroke="#FFE600" stroke-width="2"></rect><text class="label" x="368" y="250">Friedrichstadt</text><text class="quiet" x="370" y="274">grid begun 1688</text></g>',
    '<g data-v="industrial"><path class="water" d="M-30 395C180 350 300 418 472 365C612 322 758 374 1030 290"></path><g><rect class="block" x="232" y="190" width="130" height="114"></rect><rect class="block" x="382" y="162" width="150" height="136"></rect><rect class="block" x="554" y="200" width="132" height="112"></rect><rect class="block" x="266" y="336" width="142" height="130"></rect><rect class="block" x="440" y="332" width="160" height="145"></rect><rect class="block" x="630" y="356" width="112" height="102"></rect></g><g fill="url(#bwhs-hatch)"><rect x="252" y="210" width="90" height="74"></rect><rect x="402" y="182" width="110" height="96"></rect><rect x="574" y="220" width="92" height="72"></rect><rect x="286" y="356" width="102" height="90"></rect><rect x="460" y="352" width="120" height="105"></rect></g><text class="label" x="360" y="120">street frame</text><text class="count" x="654" y="148">1862</text><text class="quiet" x="657" y="173">Hobrecht Plan</text></g>',
    '<g data-v="greater"><circle class="ring" cx="500" cy="335" r="82"></circle><circle class="ring" cx="500" cy="335" r="168"></circle><circle class="ring" cx="500" cy="335" r="256"></circle><circle class="dot" cx="500" cy="335" r="9"></circle><text class="count" x="168" y="248">65.72</text><text class="quiet" x="175" y="274">km² before</text><text class="count" x="678" y="420">878.1</text><text class="quiet" x="686" y="446">km² after</text><text class="label" x="407" y="340">Greater Berlin</text><text class="quiet" x="430" y="365">1 Oct 1920</text></g>',
    '<g data-v="dictatorship"><rect x="0" y="0" width="1000" height="640" fill="#090c0a" opacity=".64"></rect><path d="M120 448H880" stroke="rgba(247,245,239,.33)" stroke-width="1"></path><path d="M180 448V335M340 448V274M500 448V224M660 448V165M820 448V138" stroke="#E63946" stroke-width="5"></path><text class="label" x="148" y="494">1933</text><text class="label" x="306" y="494">1939</text><text class="label" x="464" y="494">1941</text><text class="label" x="624" y="494">1945</text><text class="quiet" x="386" y="116">persecution is not background</text><text class="count" x="364" y="190">50,000+</text><text class="quiet" x="368" y="214">Berlin Jews deported and murdered</text></g>',
    '<g data-v="sectors-fallback"><path class="outline" d="M300 180C406 110 604 148 706 248C790 331 728 494 590 527C426 568 240 474 232 334C227 268 261 211 300 180Z"></path><path d="M255 325H525V195H360Z" fill="rgba(124,179,66,.30)"></path><path d="M255 325H525V350H240Z" fill="rgba(247,245,239,.20)"></path><path d="M240 350H525V498H280Z" fill="rgba(255,230,0,.20)"></path><path d="M525 195H735V470H525Z" fill="rgba(230,57,70,.23)"></path><text class="quiet" x="335" y="242">French</text><text class="quiet" x="320" y="330">British</text><text class="quiet" x="338" y="412">American</text><text class="quiet" x="575" y="326">Soviet</text><path class="arrow" d="M116 500Q285 445 420 395"></path><path class="arrow" d="M120 168Q315 204 460 280"></path><text class="quiet" x="105" y="535">supplies by air</text></g>',
    '<g data-v="wall-fallback"><path class="outline" d="M300 180C406 110 604 148 706 248C790 331 728 494 590 527C426 568 240 474 232 334C227 268 261 211 300 180Z"></path><path class="wall-line" d="M348 226C478 162 638 212 672 328C698 414 597 500 462 478C328 455 284 358 348 226Z"></path><path d="M350 226C480 163 639 213 673 328C699 415 598 501 462 479C327 456 283 358 350 226Z" fill="none" stroke="rgba(230,57,70,.25)" stroke-width="20"></path><text class="label" x="400" y="338">West Berlin</text><text class="quiet" x="405" y="361">encircled by the Wall</text></g>',
    '<g data-v="reunited"><path class="water" d="M-30 404C170 342 309 423 467 367C649 303 740 366 1030 276"></path><rect x="276" y="350" width="85" height="126" fill="rgba(247,245,239,.23)"></rect><rect x="372" y="290" width="104" height="186" fill="rgba(247,245,239,.32)"></rect><rect x="490" y="235" width="94" height="241" fill="rgba(255,230,0,.50)"></rect><rect x="596" y="318" width="92" height="158" fill="rgba(247,245,239,.27)"></rect><rect x="700" y="266" width="72" height="210" fill="rgba(247,245,239,.20)"></rect><path class="wall-line" d="M210 496H802" stroke-dasharray="3 10" opacity=".64"></path><text class="label" x="414" y="202">Potsdamer Platz</text><text class="quiet" x="380" y="525">former border void · new district</text></g>',
    '<g data-v="today"><path class="water" d="M-30 398C175 350 305 425 480 365C640 310 730 370 1030 284"></path><path class="outline" d="M270 190C403 104 640 136 760 274C844 371 740 532 570 549C379 568 186 474 202 331C207 274 235 216 270 190Z"></path><g><circle class="dot" cx="502" cy="328" r="9"></circle><text class="label" x="522" y="319">Molkenmarkt</text></g><g><circle class="dot" cx="435" cy="362" r="9"></circle><text class="label" x="256" y="385">Friedrichstadt</text></g><g><circle class="dot" cx="326" cy="254" r="9"></circle><text class="label" x="224" y="235">Gleis 17</text></g><g><circle class="dot" cx="462" cy="436" r="9"></circle><text class="label" x="486" y="455">Potsdamer Platz</text></g><circle cx="574" cy="304" r="8" fill="#7CB342" stroke="#f7f5ef" stroke-width="2"></circle><text class="quiet" x="588" y="292">Alexanderplatz</text><text class="quiet" x="588" y="310">tour start</text></g>',
    '<g data-el="real-map" class="bw-hs-real-map"></g></svg>'
  ].join('');

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>'"]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[c];
    });
  }
  function clamp(value) { return Math.max(0, Math.min(1, value)); }

  function upsertMeta(kind, key, content) {
    var selector = 'meta[' + kind + '="' + key + '"]';
    var element = document.head.querySelector(selector);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(kind, key);
      document.head.appendChild(element);
    }
    element.content = content;
  }

  function upsertLink(rel, href) {
    var element = document.head.querySelector('link[rel="' + rel + '"]');
    if (!element) {
      element = document.createElement('link');
      element.rel = rel;
      document.head.appendChild(element);
    }
    element.href = href;
  }

  // Native Wix server metadata is authoritative on the public page. This safety
  // net exists only for local previews, so it can never overwrite the exact
  // Wix-uploaded social image or canonical metadata after release.
  function applySeoSafetyNet() {
    var path = location.pathname.replace(/\/+$/, '') || '/';
    var isFinal = /(^|\.)berlinwalk\.com$/i.test(location.hostname) && path === '/berlin-history-story';
    if (isFinal) return;
    var canonical = location.origin + path;
    document.title = 'Berlin History Story | BerlinWalk';
    upsertMeta('name', 'description', 'Preview of Berlin History Story by BerlinWalk.');
    upsertLink('canonical', canonical);
    upsertMeta('property', 'og:type', 'article');
    upsertMeta('property', 'og:title', document.title);
    upsertMeta('property', 'og:description', 'Preview of Berlin History Story by BerlinWalk.');
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:image', SEO.image);
    upsertMeta('property', 'og:image:alt', SEO.imageAlt);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', document.title);
    upsertMeta('name', 'twitter:description', 'Preview of Berlin History Story by BerlinWalk.');
    upsertMeta('name', 'twitter:image', SEO.image);
    if (document.getElementById('bw-berlin-history-story-jsonld')) return;
    var node = document.createElement('script');
    node.id = 'bw-berlin-history-story-jsonld';
    node.type = 'application/ld+json';
    node.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': FINAL_URL + '#article',
      mainEntityOfPage: FINAL_URL,
      headline: SEO.articleHeadline,
      description: SEO.description,
      inLanguage: 'en',
      author: { '@type': 'Person', name: 'Yusuf', url: 'https://www.berlinwalk.com/the-guide' },
      publisher: { '@type': 'Organization', name: 'BerlinWalk', url: 'https://www.berlinwalk.com' }
    });
    document.head.appendChild(node);
  }

  function analyticsAllowed() {
    try {
      var manager = window.consentPolicyManager;
      var current = manager && typeof manager.getCurrentConsentPolicy === 'function'
        ? manager.getCurrentConsentPolicy()
        : null;
      var policy = current && (current.policy || current);
      return Boolean(policy && policy.analytics === true);
    } catch (error) {
      return false;
    }
  }

  function isQaMode() {
    var query = new URLSearchParams(window.location.search || '');
    return /^#bwqa=\d+$/.test(window.location.hash || '')
      || query.has('bwqa')
      || query.has('bwHistoryStory')
      || query.has('qa');
  }

  function card(chapter) {
    var heading = chapter.key === 'molkenmarkt' ? '<h1>Berlin History Story</h1>' : '<h2>' + esc(chapter.title) + '</h2>';
    var lead = '<p class="bw-hs-eyebrow">' + esc(chapter.eyebrow) + '</p>';
    if (chapter.key === 'molkenmarkt') lead += '<p class="bw-hs-card-title">' + esc(chapter.title) + '</p>';
    var extra = '';
    if (chapter.key === 'molkenmarkt') extra = '<p class="bw-hs-hero-kicker">800 years · 10 scenes · one careful reading of the city</p><span class="bw-hs-scroll-cue">Scroll through the city</span>';
    if (chapter.key === 'wall') extra = '<a class="bw-hs-source-link" data-bw-history-track="wall_timeline" href="' + esc(WALL_URL) + '">Open the full Berlin Wall Timeline</a>';
    if (chapter.key === 'today') extra = '<div class="bw-hs-place-grid"><div class="bw-hs-place"><b>Molkenmarkt</b>buried market city</div><div class="bw-hs-place"><b>Friedrichstadt</b>planned royal capital</div><div class="bw-hs-place"><b>Gleis 17</b>evidence of deportation</div><div class="bw-hs-place"><b>Potsdamer Platz</b>post-Wall rebuild</div></div><a class="bw-hs-btn" data-bw-history-track="closing_cta" href="' + esc(BOOK_URL) + '">Book my Free Berlin Walking Tour</a><p class="bw-hs-final-note">My free tour starts at Alexanderplatz. It lasts 2 hours and explores the historic centre of former East Berlin: 11 stops, 16 places and about 3 km. It does not follow the Berlin Wall line.</p>';
    return '<div class="bw-hs-card">' + lead + heading + '<p>' + esc(chapter.body) + '</p>' + extra + '</div>';
  }

  function photo(item) {
    return '<figure class="bw-hs-photo ' + esc(item.className) + '" data-photo-scene="' + esc(item.scene) + '"><img src="' + esc(BASE_URL + item.src) + '" alt="' + esc(item.alt) + '"><figcaption>' + esc(item.credit) + '</figcaption></figure>';
  }

  function related() {
    var posts = Array.isArray(window.BERLIN_HISTORY_STORY_RELATED_POSTS) ? window.BERLIN_HISTORY_STORY_RELATED_POSTS : [];
    if (!posts.length) return '<p>Related reading data is unavailable in this preview.</p>';
    return '<div class="bw-hs-related-grid">' + posts.map(function (post) {
      if (!post || !post.slug || !post.title || !post.url || post.url.indexOf('/berlin-history-story') !== -1) return '';
      return '<a href="' + esc(post.url) + '">' + esc(post.title) + '</a>';
    }).join('') + '</div>';
  }

  function aftercare() {
    var sources = '<ol class="bw-hs-source-list">'
      + '<li><a href="https://www.berlin.de/landesdenkmalamt/archaeologie/bodendenkmalpflege/grabungen/grabung-am-molkenmarkt/">Berlin State Archaeology: Molkenmarkt excavation</a></li>'
      + '<li><a href="https://www.berlin.de/en/history/8476760-8619314-the-medieval-trading-center.en.html">Berlin.de: medieval trading centre</a></li>'
      + '<li><a href="https://www.berlin.de/en/history/8477225-8619314-the-royal-capital.en.html">Berlin.de: royal capital</a></li>'
      + '<li><a href="https://www.berlin.de/rathausblock-fk/gebiet/geschichte-des-dragonerareals/">Berlin Senate: Hobrecht context</a></li>'
      + '<li><a href="https://www.berlin.de/en/history/8481401-8619314-greater-berlin-act.en.html">Berlin.de: Greater Berlin Act</a></li>'
      + '<li><a href="https://www.berlin.de/ba-charlottenburg-wilmersdorf/ueber-den-bezirk/geschichte/gedenkstaetten/artikel.1137369.php">Gleis 17 memorial background</a> and <a href="https://encyclopedia.ushmm.org/content/en/article/berlin">United States Holocaust Memorial Museum: Berlin</a></li>'
      + '<li><a href="https://www.alliiertenmuseum.de/en/thema/the-berlin-airlift-1948-49/">AlliiertenMuseum: Berlin Airlift</a></li>'
      + '<li><a href="https://www.berlin.de/landesdenkmalamt/denkmale/highlight-berliner-mauer/aufbau-und-entwicklung/building-and-development-of-the-berlin-wall-648927.php">Berlin Wall construction and development</a></li>'
      + '<li><a href="https://www.bundestag.de/en/visittheBundestag/exhibitions/bonn-upon-spree-1013402">German Bundestag: Bonn upon Spree</a></li>'
      + '</ol>';
    var mapSources = '<ul class="bw-hs-credit-list">'
      + '<li>Wall geometry: <a href="https://daten.berlin.de/datensaetze/verlauf-der-berliner-mauer-1989-wfs-3dcda64c">Berlin Open Data</a>, Data licence Germany Zero 2.0.</li>'
      + '<li>District geometry: <a href="https://wfsexplorer.odis-berlin.de/?layer=alkis_ortsteile%3Aortsteile&amp;wfs=https%3A%2F%2Fgdi.berlin.de%2Fservices%2Fwfs%2Falkis_ortsteile">Berlin Geoportal / ODIS</a>.</li>'
      + '<li>Waterways: <a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a>.</li>'
      + '<li>Landmark annotations: BerlinWalk Wall-map dataset. This is a visual story reconstruction, not a survey-grade historical boundary map.</li>'
      + '</ul>';
    var credits = '<ul class="bw-hs-credit-list">'
      + '<li><a href="https://commons.wikimedia.org/wiki/File:Ca._1740_map_of_Berlin_by_Homann_Heirs.jpg">Homann Heirs, c. 1740 map of Berlin</a> · public domain</li>'
      + '<li><a href="https://commons.wikimedia.org/wiki/File:Hallesches_Tor,_Berlin_1894.jpg">Robert Prager, Hallesches Tor, 1894</a> · public domain</li>'
      + '<li><a href="https://commons.wikimedia.org/wiki/File:Brandenburger_Tor-2.jpg">AIP Emilio Segrè Visual Archives, Brandenburg Gate ruins, 1945</a> · CC0 1.0</li>'
      + '<li><a href="https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_173-1321,_Berlin,_Mauerbau.jpg">Bundesarchiv Bild 173-1321 / Helmut J. Wolf</a> · CC BY-SA 3.0 DE</li>'
      + '<li><a href="https://commons.wikimedia.org/wiki/File:Brandenburg_gate_1982.jpg">Zika, Brandenburg Gate walled off, 1982</a> · public domain</li>'
      + '<li><a href="https://commons.wikimedia.org/wiki/File:Berlin_-_Sony_Center_am_Potsdamer_Platz_%281%29.jpg">Fred Romero, Sony Center at Potsdamer Platz, 2016</a> · CC BY 2.0</li>'
      + '</ul>';
    return '<section class="bw-hs-aftercare" aria-label="Sources, map attribution, image credits and related reading"><div class="bw-hs-aftercare-inner">'
      + '<h2>Keep the story connected to the city.</h2><p>These links stay deliberately practical. Use one place, one date or one question as the next thing to investigate.</p>'
      + '<details class="bw-hs-details"><summary>Explore more Berlin notes</summary><div class="bw-hs-details-body">' + related() + '<p class="bw-hs-baseline">This 42-link layer is a fixed handoff baseline from a 22 August 2026 topic snapshot. It is not a claim that these posts are all historical articles or that an orphan audit has been completed.</p></div></details>'
      + '<details class="bw-hs-details"><summary>Sources for this story</summary><div class="bw-hs-details-body">' + sources + '</div></details>'
      + '<details class="bw-hs-details"><summary>Map data and attribution</summary><div class="bw-hs-details-body">' + mapSources + '</div></details>'
      + '<details class="bw-hs-details"><summary>Image credits</summary><div class="bw-hs-details-body">' + credits + '</div></details>'
      + '</div></section>';
  }

  class BWBHistoryStory extends HTMLElement {
    connectedCallback() {
      if (this._booted) return;
      this._booted = true;
      this.setAttribute('data-build', BUILD);
      applySeoSafetyNet();
      this._render();
      this._wire();
    }

    disconnectedCallback() {
      if (this._onScroll) window.removeEventListener('scroll', this._onScroll);
      if (this._onResize) window.removeEventListener('resize', this._onResize);
      if (this._applyQaHash) window.removeEventListener('hashchange', this._applyQaHash);
      if (this._onTrackedLinkClick && this._root) this._root.removeEventListener('click', this._onTrackedLinkClick);
      if (this._observer) this._observer.disconnect();
      if (this._mq && this._onMotion) {
        if (this._mq.removeEventListener) this._mq.removeEventListener('change', this._onMotion);
        else if (this._mq.removeListener) this._mq.removeListener(this._onMotion);
      }
    }

    _render() {
      var steps = CHAPTERS.map(function (chapter) {
        return '<section class="bw-hs-step" data-ch="' + esc(chapter.key) + '" data-align="' + esc(chapter.align) + '" style="min-height:' + chapter.h + 'vh">' + card(chapter) + '</section>';
      }).join('');
      this.innerHTML = '<style>' + CSS + '</style><article class="bw-hs" data-map-state="loading"><div class="bw-hs-scrolly"><div class="bw-hs-stage-frame"><div class="bw-hs-stage">' + SVG + '<div class="bw-hs-photo-stack">' + PHOTOS.map(photo).join('') + '</div><div class="bw-hs-vignette"></div><div class="bw-hs-hud" aria-live="polite"><div class="bw-hs-year"><span>20</span>26</div><div class="bw-hs-chapter">Start at Molkenmarkt</div><div class="bw-hs-map-state">loading reference map</div></div><a class="bw-hs-brand" href="' + esc(HOME_URL) + '" aria-label="BerlinWalk home"><img src="' + esc(BASE_URL + 'assets/brand/berlinwalk-wordmark-yellow.png') + '" alt="BerlinWalk"></a></div></div><nav class="bw-hs-rail" aria-label="Berlin history story scenes"></nav><div class="bw-hs-steps">' + steps + '</div></div>' + aftercare() + '</article>';
    }

    _wire() {
      var self = this;
      var root = this.querySelector('.bw-hs');
      var q = function (selector) { return root.querySelector(selector); };
      var qa = function (selector) { return Array.prototype.slice.call(root.querySelectorAll(selector)); };
      this._root = root;
      this._scrolly = q('.bw-hs-scrolly');
      this._stage = q('.bw-hs-stage');
      this._rail = q('.bw-hs-rail');
      this._steps = qa('.bw-hs-step');
      this._cards = qa('.bw-hs-card');
      this._photos = qa('.bw-hs-photo');
      this._year = q('.bw-hs-year');
      this._chapter = q('.bw-hs-chapter');
      this._mapState = q('.bw-hs-map-state');
      this._realMap = q('[data-el="real-map"]');
      this._visuals = {};
      qa('[data-v]').forEach(function (element) { self._visuals[element.getAttribute('data-v')] = element; });
      this._mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
      this._reduce = Boolean(this._mq && this._mq.matches);
      this._onMotion = function (event) { self._reduce = event.matches; root.toggleAttribute('data-reduced-motion', self._reduce); };
      root.toggleAttribute('data-reduced-motion', this._reduce);
      if (this._mq) {
        if (this._mq.addEventListener) this._mq.addEventListener('change', this._onMotion);
        else if (this._mq.addListener) this._mq.addListener(this._onMotion);
      }
      this._photos.forEach(function (figure) {
        var image = figure.querySelector('img');
        if (image) image.addEventListener('error', function () { figure.classList.add('is-missing'); });
      });
      this._onTrackedLinkClick = function (event) {
        if (event.defaultPrevented || (typeof event.button === 'number' && event.button !== 0)) return;
        var target = event.target && event.target.closest ? event.target.closest('a[data-bw-history-track]') : null;
        if (!target || !root.contains(target)) return;
        self._trackLink(target.getAttribute('data-bw-history-track'));
      };
      root.addEventListener('click', this._onTrackedLinkClick);
      var rail = this._rail;
      this._dots = this._steps.map(function (step, index) {
        var chapter = CHAPTERS[index];
        var button = document.createElement('button');
        button.type = 'button';
        button.title = chapter.title;
        button.setAttribute('aria-label', 'Go to ' + chapter.title);
        button.setAttribute('data-label', chapter.title);
        button.addEventListener('click', function () {
          var top = step.getBoundingClientRect().top + (window.pageYOffset || window.scrollY || 0);
          var target = Math.max(0, top + step.offsetHeight * .5 - (window.innerHeight || 0) * .5);
          window.scrollTo({ top: target, behavior: self._reduce ? 'auto' : 'smooth' });
        });
        rail.appendChild(button);
        return button;
      });
      if (typeof IntersectionObserver !== 'undefined') {
        this._observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) { if (entry.isIntersecting) entry.target.classList.add('in'); });
        }, { threshold: .18 });
        this._cards.forEach(function (cardElement) { self._observer.observe(cardElement); });
      } else {
        this._cards.forEach(function (cardElement) { cardElement.classList.add('in'); });
      }
      var raf = null;
      this._onScroll = function () {
        if (raf) return;
        raf = requestAnimationFrame(function () { raf = null; self._update(); });
      };
      this._onResize = this._onScroll;
      window.addEventListener('scroll', this._onScroll, { passive: true });
      window.addEventListener('resize', this._onResize);
      this._applyQaHash = function () {
        var match = /^#bwqa=(\d+)$/.exec(window.location.hash);
        if (!match) {
          root.style.marginTop = '';
          return;
        }
        root.style.marginTop = (-Number(match[1])) + 'px';
        self._cards.forEach(function (cardElement) { cardElement.classList.add('in'); });
        self._onScroll();
      };
      window.addEventListener('hashchange', this._applyQaHash);
      this._applyQaHash();
      window.requestAnimationFrame(this._applyQaHash);
      this._update();
      this._loadMap();
    }

    _trackLink(kind) {
      if (isQaMode() || !analyticsAllowed()) return;
      var events = {
        closing_cta: {
          name: 'bw_history_story_closing_cta_click',
          payload: {
            event_source: 'berlin_history_story',
            event_location: 'closing_cta',
            story_version: 'v1',
            page_path: '/berlin-history-story',
            destination: 'free_tour'
          }
        },
        wall_timeline: {
          name: 'bw_history_story_wall_timeline_click',
          payload: {
            event_source: 'berlin_history_story',
            event_location: 'scene_8',
            story_version: 'v1',
            page_path: '/berlin-history-story',
            destination: 'wall_timeline'
          }
        }
      };
      var item = events[kind];
      if (!item || typeof window.CustomEvent !== 'function') return;
      document.dispatchEvent(new CustomEvent('bwStickyCtaEvent', {
        detail: { name: item.name, payload: item.payload }
      }));
    }

    _svg(name, attrs, text) {
      var element = document.createElementNS('http://www.w3.org/2000/svg', name);
      Object.keys(attrs || {}).forEach(function (key) { element.setAttribute(key, attrs[key]); });
      if (text != null) element.textContent = text;
      return element;
    }

    _loadMap() {
      var self = this;
      fetch(BASE_URL + 'assets/map/map-data.json', { cache: 'force-cache' })
        .then(function (response) {
          if (!response.ok) throw new Error('Map request failed');
          return response.json();
        })
        .then(function (data) {
          if (!data || !Array.isArray(data.sectors) || !data.wall || !Array.isArray(data.wall.main)) throw new Error('Map data is incomplete');
          self._renderMap(data);
          self._mapReady = true;
          self._root.setAttribute('data-map-state', 'ready');
          self._mapState.textContent = 'reference map loaded';
          self._update();
        })
        .catch(function () {
          self._mapReady = false;
          self._root.setAttribute('data-map-state', 'fallback');
          self._mapState.textContent = 'using labelled schematic';
          self._update();
        });
    }

    _renderMap(data) {
      var self = this;
      var map = this._realMap;
      while (map.firstChild) map.removeChild(map.firstChild);
      var base = this._svg('g', { 'data-real-layer': 'base' });
      (data.waterLines || []).slice(0, 12).forEach(function (water) {
        if (water && water.d) base.appendChild(self._svg('path', { d: water.d, class: 'real-water' }));
      });
      (data.districts || []).forEach(function (district) {
        if (district && district.d) base.appendChild(self._svg('path', { d: district.d, class: 'real-boundary', opacity: '.22' }));
      });
      var sectors = this._svg('g', { 'data-real-layer': 'sectors' });
      (data.sectors || []).forEach(function (sector) {
        if (!sector || !sector.d) return;
        sectors.appendChild(self._svg('path', { d: sector.d, class: 'real-sector', fill: sector.fill || '#7CB342', 'fill-opacity': '.32' }));
        if (sector.labelPoint) sectors.appendChild(self._svg('text', { x: sector.labelPoint[0], y: sector.labelPoint[1], class: 'real-label', 'text-anchor': 'middle' }, sector.label));
      });
      var airlift = this._svg('g', { 'data-real-layer': 'airlift' });
      (data.airports || []).filter(function (airport) { return airport.role === 'arrival'; }).forEach(function (airport, index) {
        airlift.appendChild(self._svg('path', { d: 'M ' + (airport.x - 125 - index * 12) + ' ' + (airport.y + 40) + ' Q ' + (airport.x - 42) + ' ' + (airport.y - 28) + ' ' + airport.x + ' ' + airport.y, class: 'arrow' }));
        airlift.appendChild(self._svg('circle', { cx: airport.x, cy: airport.y, r: 5.5, class: 'real-airport' }));
        airlift.appendChild(self._svg('text', { x: airport.x + 9, y: airport.y - 8, class: 'real-label' }, airport.name));
      });
      var wall = this._svg('g', { 'data-real-layer': 'wall' });
      (data.wall.main || []).forEach(function (path) {
        if (typeof path === 'string') wall.appendChild(self._svg('path', { d: path, class: 'real-wall' }));
      });
      sectors.appendChild(this._svg('text', { x: 26, y: 613, class: 'real-note' }, 'Map data: Berlin Open Data · Geoportal · © OpenStreetMap contributors'));
      map.appendChild(base);
      map.appendChild(sectors);
      map.appendChild(airlift);
      map.appendChild(wall);
      this._real = { base: base, sectors: sectors, airlift: airlift, wall: wall };
    }

    _show(key, visible) {
      if (this._visuals[key]) this._visuals[key].classList.toggle('is-visible', Boolean(visible));
    }

    _update() {
      if (!this._root) return;
      var vh = window.innerHeight || 1;
      var marker = vh * .55;
      var index = 0;
      this._steps.forEach(function (step, stepIndex) {
        if (step.getBoundingClientRect().top <= marker) index = stepIndex;
      });
      var step = this._steps[index];
      var rect = step.getBoundingClientRect();
      var progress = clamp((marker - rect.top) / (rect.height || 1));
      var chapter = CHAPTERS[index];
      var storyRect = this._scrolly.getBoundingClientRect();
      var storyActive = storyRect.top <= 0 && storyRect.bottom >= vh;
      var mode = storyActive ? 'fixed' : 'absolute';
      if (this._stageMode !== mode) {
        this._stageMode = mode;
        if (mode === 'fixed') {
          this._stage.style.position = 'fixed';
          this._stage.style.top = '0';
          this._stage.style.left = '0';
          this._stage.style.width = '100vw';
        } else {
          this._stage.style.position = 'absolute';
          this._stage.style.top = '0';
          this._stage.style.left = '0';
          this._stage.style.width = '100%';
        }
      }
      this._rail.hidden = !storyActive;
      var year = chapter.year;
      if (chapter.key === 'royal') year = Math.round(1701 + progress * 39);
      if (chapter.key === 'industrial') year = Math.round(1871 + progress * 29);
      if (chapter.key === 'dictatorship') year = Math.round(1933 + progress * 12);
      if (chapter.key === 'sectors') year = Math.round(1945 + progress * 4);
      if (chapter.key === 'wall') year = Math.round(1961 + progress * 28);
      if (chapter.key === 'reunited') year = Math.round(1990 + progress * 20);
      this._root.setAttribute('data-chapter', chapter.key);
      this._year.innerHTML = '<span>' + esc(String(year).slice(0, 2)) + '</span>' + esc(String(year).slice(2));
      this._chapter.textContent = chapter.title;
      this._dots.forEach(function (dot, dotIndex) { dot.classList.toggle('on', dotIndex === index); });
      Object.keys(this._visuals).forEach(function (key) { this._show(key, key === chapter.key); }, this);
      this._show('sectors-fallback', chapter.key === 'sectors' && !this._mapReady);
      this._show('wall-fallback', chapter.key === 'wall' && !this._mapReady);
      if (this._realMap) this._realMap.classList.toggle('is-visible', Boolean(this._mapReady && (chapter.key === 'sectors' || chapter.key === 'wall')));
      if (this._real) {
        this._real.base.setAttribute('opacity', chapter.key === 'sectors' || chapter.key === 'wall' ? '.88' : '0');
        this._real.sectors.setAttribute('opacity', chapter.key === 'sectors' ? '1' : '0');
        this._real.airlift.setAttribute('opacity', chapter.key === 'sectors' ? '1' : '0');
        this._real.wall.setAttribute('opacity', chapter.key === 'wall' ? '1' : '0');
      }
      this._photos.forEach(function (figure) {
        figure.classList.toggle('is-visible', figure.getAttribute('data-photo-scene') === chapter.key);
      });
      this._stage.style.opacity = chapter.key === 'today' ? String(1 - clamp((progress - .18) * 1.1) * .58) : '1';
    }
  }

  if (!customElements.get(TAG)) {
    try { customElements.define(TAG, BWBHistoryStory); }
    catch (error) { if (window.console) window.console.warn('bw-berlin-history-story define failed', error); }
  }
})();
