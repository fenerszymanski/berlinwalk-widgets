/*
 * <bw-berlin-history-story> - Berlin History Story V2
 *
 * Light-DOM scrolly Custom Element. This is the data-swap port of the Wall
 * Timeline runtime: it keeps its lifecycle order, RAF scroll updates, dynamic
 * fixed/absolute stage mode, observer/card/rail mechanics, map fetch/fallback,
 * year/progress HUD, reduced-motion base and #bwqa=<scrollY> QA hook. The
 * chapter data, diagrams, map states and imagery are History Story-specific.
 */
(function () {
  'use strict';

  var TAG = 'bw-berlin-history-story';
  var BUILD = 'berlin-history-story-v2-20260902-lead-magnet';
  var SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : '';
  var BASE_URL = SCRIPT_URL && !/static\.wixstatic\.com/i.test(SCRIPT_URL)
    ? new URL('./', SCRIPT_URL).toString()
    : 'https://fenerszymanski.github.io/berlinwalk-widgets/berlin-history-story/';
  var HOME_URL = 'https://www.berlinwalk.com/?utm_source=berlin_history_story&utm_medium=story&utm_campaign=history_v1&utm_content=wordmark';
  var BOOK_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based?utm_source=berlin_history_story&utm_medium=story&utm_campaign=history_v1&utm_content=closing_cta';
  var WALL_URL = 'https://www.berlinwalk.com/berlin-wall-timeline?utm_source=berlin_history_story&utm_medium=story&utm_campaign=history_v1&utm_content=wall_chapter';
  var FINAL_URL = 'https://www.berlinwalk.com/berlin-history-story';
  // Lead delivery is intentionally adapter-shaped. The defaults match the
  // backend registry proposal, while host attributes let the Wix embed switch
  // registry versions without changing this story runtime.
  var LEAD_API_DEFAULT = 'https://app.berlinwalk.com/api/download-lead';
  var LEAD_ASSET_ID_DEFAULT = 'berlin-history-field-card';
  var LEAD_CONSENT_VERSION_DEFAULT = 'berlin-history-field-card-v1-2026-09-02';
  var LEAD_EXPERIMENT_DEFAULT = 'berlin_history_field_card_v1';
  var LEAD_VARIANT_DEFAULT = 'single';
  var LEAD_PLACEMENT_DEFAULT = 'history_story_epilogue';
  var LEAD_PRIVACY_URL_DEFAULT = 'https://www.berlinwalk.com/privacy-policy';
  var LEAD_SOURCE_SLUG = 'berlin-history-story';
  var LEAD_CONSENT_COPY = 'Email me Berlin, Remade: Four Places to Read Berlin, plus occasional BerlinWalk emails about Berlin history, new articles and walking-tour updates. I can unsubscribe at any time. Read the Privacy Policy.';
  var LEAD_EVENT_NAMES = {
    gateView: 'bw_lead_asset_gate_view',
    gateSeen: 'bw_lead_asset_gate_seen',
    formStart: 'bw_lead_asset_form_start',
    submit: 'bw_lead_asset_submit'
  };
  var FIELD_PLACES = [
    { place: 'Molkenmarkt', date: '2019 to present', layer: 'Buried market city', move: 'Read the A3 fence near Altes Stadthaus. Do not enter.' },
    { place: 'Friedrichstadt', date: '1688 to 1732', layer: 'Planned royal capital', move: 'Read the straight lines around Gendarmenmarkt.' },
    { place: 'Gleis 17', date: 'autumn 1941 to spring 1942', layer: '186 steel plates at the memorial', move: 'Pause here. This memorial is evidence, not scenery.' },
    { place: 'Potsdamer + Leipziger Platz', date: '1990 to 2016', layer: 'Post-Wall rebuild', move: 'Compare the new district with the former border void.' }
  ];
  var COVER_URL = BASE_URL + 'assets/social/berlin-history-story-1200x630.jpg';
  var SEO = {
    title: 'Berlin, Remade: 12 Chapters in Berlin History | BerlinWalk',
    articleHeadline: 'Berlin, Remade: 12 Chapters in Berlin History',
    description: 'Read 12 chapters in Berlin history, from Molkenmarkt and medieval Cölln to Greater Berlin, the Wall and the city today.',
    socialTitle: 'Berlin, Remade: 12 Chapters in Berlin History | BerlinWalk',
    socialDescription: 'Read 12 chapters in Berlin history, from Molkenmarkt and medieval Cölln to Greater Berlin, the Wall and the city today.',
    image: COVER_URL,
    imageAlt: 'A c. 1740 map of Berlin by Homann Heirs'
  };

  // The opening cover is editorial framing, not a chapter record. Keeping it
  // outside CHAPTERS preserves the prologue/history/epilogue counting and the
  // existing scroll engine's 12-record semantics.
  var COVER = {
    eyebrow: 'BERLIN HISTORY · 1237–TODAY',
    title: 'Berlin, Remade',
    deck: 'Berlin did not grow in a straight line. It was joined, fortified, industrialised, divided and rebuilt. Scroll through 12 chapters and nearly 800 years, then use four places to read those layers in the city today.',
    meta: '12 chapters · nearly 800 years · four places to start',
    cue: 'Scroll to begin'
  };

  var CHAPTERS = [
    { key: 'molkenmarkt', role: 'prologue', yearStart: 2026, yearEnd: 2026, visual: 'molkenmarkt', mapState: 'none', h: 142, align: 'left', eyebrow: 'Today · Molkenmarkt', title: 'Start at Molkenmarkt', body: 'At Molkenmarkt, Berlin is not finished with its own beginning. Since 2019, state archaeologists have been examining the ground before a new quarter is built here. They call this Berlin\'s oldest market and an archive of around 800 years of city life. That is a useful way to start: the streets under your feet are not a backdrop. They are evidence. Look for the low ground by the Spree, then imagine traders, bridges and courts pressing close together.' },
    { key: 'twin', yearStart: 1237, yearEnd: 1244, visual: 'twin', mapState: 'none', h: 140, align: 'right', eyebrow: '1237–1244 · Twin towns', title: 'Two towns on the Spree', body: 'The year 1237 belongs to Cölln, not to a finished city called Berlin. Cölln and Berlin grew as two merchant settlements on opposite banks of the Spree. Cölln appears in writing in 1237; Berlin follows in 1244. The river was a working route, a crossing and a boundary all at once. Stand near the water and read the city as a pair, not a single founding myth. The first documents are milestones, not a certain birthday party.' },
    { key: 'union', yearStart: 1307, yearEnd: 1448, visual: 'union', mapState: 'none', h: 158, align: 'left', eyebrow: '1307–1448 · Shared power', title: 'United, then overruled', body: 'Berlin and Cölln joined forces in 1307, sharing a council and speaking outwardly as one while keeping separate administrations. Their union tightened in 1432. Ten years later, Elector Friedrich II dissolved the common government and claimed space in Cölln for a castle. In the 1448 “Berliner Unwille,” citizens flooded its building site, but failed to restore their autonomy. Power was moving toward the Hohenzollern court.' },
    { key: 'war', yearStart: 1618, yearEnd: 1688, visual: 'war', mapState: 'none', h: 162, align: 'left', eyebrow: '1618–1688 · War and refuge', title: 'War, refuge, rebuilding', body: 'Thirty years of war left Berlin-Cölln diminished and damaged. From 1658, a star-shaped fortress and planned extensions began reshaping the medieval twin town. After the Edict of Potsdam in 1685, French Protestant refugees, the Huguenots, joined other newcomers, bringing skills, businesses and new communities. By 1688, the population had reached about 20,000. Look for a surviving piece of the old fortification near Märkisches Museum.' },
    { key: 'royal', yearStart: 1701, yearEnd: 1740, visual: 'royal', mapState: 'none', h: 150, align: 'left', eyebrow: '1701–1740 · Royal capital', title: 'A royal capital takes shape', body: 'Power changed the scale of Berlin. In 1701 Friedrich III became Friedrich I, King in Prussia, and Berlin became the royal residence. The city did not suddenly gain its neat streets that year: the rectilinear plan of Friedrichstadt had begun in 1688 and was extended south in 1732. That distinction matters. A ruler can accelerate a city without inventing every line on its map. Around Gendarmenmarkt and Friedrichstraße, look for the long straight decisions that still organise the walk.' },
    { key: 'industrial', yearStart: 1871, yearEnd: 1900, visual: 'industrial', mapState: 'none', h: 150, align: 'right', eyebrow: '1871–1900 · Industrial city', title: 'The dense industrial city', body: 'By the late nineteenth century, Berlin was growing faster than its old scale could hold. The Hobrecht Plan of 1862 laid out a framework of streets and blocks. From around 1870, owners and builders divided those blocks into deep plots and dense courtyard housing, the Mietskasernen. The plan did not build the tenements by itself. It created a frame that later investment filled hard. When you see a sequence of courtyards in Kreuzberg or Wedding, notice how a city plan became an everyday address.' },
    { key: 'greater', yearStart: 1920, yearEnd: 1920, visual: 'greater', mapState: 'none', h: 150, align: 'left', eyebrow: '1920 · Greater Berlin', title: 'Greater Berlin', body: 'On 1 October 1920, Berlin stopped being only its old core. Old Berlin joined seven neighbouring municipal cities, 59 rural communities and 27 estate districts to form Greater Berlin. The population rose to about 3.8 million, while the city area expanded from 65.72 to 878.1 square kilometres. That is why Berlin can feel like several cities stitched together: it was deliberately assembled that way. The new city began with 20 boroughs, not today\'s 12. Its size was a political decision before it was a visitor\'s map.' },
    { key: 'dictatorship', yearStart: 1933, yearEnd: 1945, visual: 'dictatorship', mapState: 'none', h: 178, align: 'center', eyebrow: '1933–1945 · Persecution and destruction', title: 'Dictatorship, deportation and destruction', body: 'From 1933, the Nazi state turned Berlin into a capital of persecution. Berlin Jews were stripped of rights and property; systematic deportations began in October 1941. The memorial at Gleis 17 records more than 50,000 Berlin Jews deported and murdered between October 1941 and February 1945. This cannot be reduced to an atmospheric chapter in a city story. Name the perpetrators, pause at the evidence, and let the dates stay precise. By 1945, bombing and battle had also left much of Berlin destroyed.' },
    { key: 'sectors', yearStart: 1945, yearEnd: 1949, visual: 'sectors-fallback', mapState: 'sectors-airlift', h: 154, align: 'left', eyebrow: '1945–1949 · Four sectors', title: 'Four sectors and the Airlift', body: 'After the war, Berlin was divided into four sectors. That is different from Germany\'s four occupation zones, and the distinction matters on every map. In June 1948, Soviet authorities blocked land, rail and water access to West Berlin. The Western Allies supplied the city by air. The blockade was lifted on 12 May 1949, but the Airlift continued into the autumn. Tempelhof, Tegel and Gatow became more than airports: they were working entries to an enclosed city. Follow the arrows as a supply story, not a decorative flight path.' },
    { key: 'wall', yearStart: 1961, yearEnd: 1989, visual: 'wall-fallback', mapState: 'wall', h: 164, align: 'right', eyebrow: '1961–1989 · The Wall', title: 'The Wall', body: 'On the night of 12-13 August 1961, GDR forces began sealing Berlin\'s sector border with barbed wire. The barriers became a fortified Wall system that shaped ordinary journeys for almost three decades. On 9 November 1989, crossings opened after Günter Schabowski\'s confused announcement and the pressure at Bornholmer Straße. That was not German reunification, which came on 3 October 1990. Nor did every concrete section vanish overnight. Use the Berlin Wall Timeline for the fuller map and sequence; this story only marks the hinge.' },
    { key: 'reunited', yearStart: 1990, yearEnd: 2016, visual: 'reunited', mapState: 'none', h: 164, align: 'left', eyebrow: '1990–2016 · Rebuilding', title: 'A reunited capital', body: 'Reunification took effect on 3 October 1990. On 20 June 1991, the Bundestag separately voted to move parliament and government to Berlin. Potsdamer and Leipziger Platz show the long rebuilding process at full scale: a former border void became a dense district of offices, stations and public space. Compare the new skyline with the missing streets beneath it; this dramatic rebuild is only one layer of the reunited city.' },
    { key: 'today', role: 'epilogue', yearStart: 2026, yearEnd: 2026, visual: 'today', mapState: 'none', h: 108, align: 'center', eyebrow: 'Today · Four starting points', title: 'Four places to read Berlin today', body: 'These four places are separate starting points, not one walking route: Molkenmarkt for the buried market city; Friedrichstraße and Gendarmenmarkt for the planned royal capital; Gleis 17 at S Grunewald for the evidence of deportation; Potsdamer and Leipziger Platz for the post-Wall rebuild. Start with one place and one date, then notice what has changed, what survives and what the map leaves out.' }
  ];

  CHAPTERS.forEach(function (chapter, index) {
    if (!chapter.role) chapter.role = index === 0 ? 'prologue' : index === CHAPTERS.length - 1 ? 'epilogue' : 'history';
  });

  var PHOTOS = [
    { chapter: 'molkenmarkt', className: 'molkenmarkt', src: 'assets/photos/molkenmarkt-excavation-2022.jpg', alt: 'Molkenmarkt excavation in 2022, with the city street above the archaeological trench', credit: 'Singlespeedfahrer, Molkenmarkt excavation, 2022 · CC0 1.0' },
    { chapter: 'molkenmarkt', className: 'plan-ghost', src: 'assets/photos/berlin-coelln-plan-1652-hero.jpg', alt: 'Archive context: later print based on the 1652 Berlin and Cölln plan', credit: 'Johann Gregor Memhardt, later print around 1720 based on the 1652 plan · public domain', hideCaption: true, decorative: true },
    { chapter: 'war', className: 'war-plan', src: 'assets/photos/berlin-coelln-plan-1652.jpg', alt: 'Later print based on a 1652 Berlin and Cölln plan, showing the fortified twin town', credit: 'Johann Gregor Memhardt / Gabriel Bodenehr, later print based on the 1652 Berlin and Cölln plan · public domain' },
    { chapter: 'royal', className: 'royal', src: 'assets/photos/1740-berlin-map.jpg', alt: 'A c. 1740 map of Berlin by Homann Heirs', credit: 'Homann Heirs, c. 1740 · public domain' },
    { chapter: 'industrial', className: 'industrial', src: 'assets/photos/1894-hallesches-tor.jpg', alt: 'Hallesches Tor in Berlin, 1894', credit: 'Robert Prager, Hallesches Tor, 1894 · public domain' },
    { chapter: 'dictatorship', className: 'dictatorship', src: 'assets/photos/1945-berlin-street-destruction.jpg', alt: 'Ruined buildings and destroyed vehicles in a Berlin street after the 3 February 1945 air raid', credit: 'Berlin ruins and destroyed vehicles, February 1945 · Bundesarchiv Bild 183-J31347 · CC BY-SA 3.0 DE' },
    { chapter: 'wall', className: 'wall-build', src: 'assets/photos/1961-wall-build.jpg', alt: 'Berlin Wall construction in 1961', credit: 'Bundesarchiv Bild 173-1321 / Helmut J. Wolf · CC BY-SA 3.0 DE' },
    { chapter: 'wall', className: 'wall-gate', src: 'assets/photos/1982-brandenburg-gate-wall.jpg', alt: 'Brandenburg Gate walled off in 1982', credit: 'Zika, Brandenburg Gate walled off, 1982 · public domain' },
    { chapter: 'reunited', className: 'reunited-before', src: 'assets/photos/deathstrip-potsdamerplatz-1979.jpg', alt: 'Potsdamer Platz border area in February 1978', credit: 'Rüdiger Stehn, Potsdamer Platz border area, February 1978 · CC BY-SA 2.0' },
    { chapter: 'reunited', className: 'reunited-after', src: 'assets/photos/2016-sony-center.jpg', alt: 'Sony Center at Potsdamer Platz in 2016', credit: 'Fred Romero, Sony Center at Potsdamer Platz, 2016 · CC BY 2.0' }
  ];

  var CSS = [
    "body.bw-history-story-page-active header#comp-mtidm621,body.bw-history-story-page-active header:has(> section[data-testid='section-container'].wixui-header){display:none!important;height:0!important;min-height:0!important;margin:0!important;padding:0!important;visibility:hidden!important;pointer-events:none!important}",
    "@media (min-width:769px){body.bw-history-story-page-active #bw-desktop-cta{display:none!important;pointer-events:none!important}}",
    "@font-face{font-family:'BW Fraunces';src:url('" + BASE_URL + "assets/fonts/Fraunces-Variable.woff2') format('woff2');font-weight:300 900;font-display:swap}",
    "@font-face{font-family:'BW Space';src:url('" + BASE_URL + "assets/fonts/SpaceGrotesk-Variable.woff2') format('woff2');font-weight:300 700;font-display:swap}",
    "@font-face{font-family:'BW Mono';src:url('" + BASE_URL + "assets/fonts/IBMPlexMono-Regular.woff2') format('woff2');font-weight:400;font-display:swap}",
    ".bw-hs{--ink:#f7f5ef;--dim:rgba(247,245,239,.74);--faint:rgba(247,245,239,.48);--night:#102016;--deep:#08120d;--green:#123D18;--yellow:#FFE600;--red:#E63946;--line:rgba(247,245,239,.19);--panel:rgba(8,18,13,.88);display:block;position:relative;width:100vw;max-width:100vw;margin:0 calc((100% - 100vw)/2);overflow:visible;background:var(--deep);color:var(--ink);font:16px/1.55 'BW Space',Arial,sans-serif;text-size-adjust:100%;-webkit-font-smoothing:antialiased}.bw-hs *{box-sizing:border-box}.bw-hs a{color:inherit}",
    ".bw-hs-cover{position:relative;isolation:isolate;display:grid;align-items:center;min-height:100vh;min-height:100svh;padding:clamp(48px,8vw,112px) clamp(22px,8vw,124px);overflow:hidden;background:#08120d;color:var(--ink)}.bw-hs-cover:after{content:'';position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(90deg,rgba(8,18,13,.97) 0%,rgba(8,18,13,.84) 45%,rgba(8,18,13,.64) 100%)}.bw-hs-cover-archive{position:absolute;top:13%;right:4.5%;z-index:0;width:min(56vw,790px);aspect-ratio:1.55;overflow:hidden;border:1px solid rgba(255,230,0,.5);box-shadow:0 22px 70px rgba(0,0,0,.34);opacity:.28;transform:rotate(-1.2deg)}.bw-hs-cover-archive img{display:block;width:100%;height:100%;object-fit:cover;filter:none}.bw-hs-cover-content{position:relative;z-index:2;width:min(700px,54vw);padding-top:clamp(42px,6vh,76px)}.bw-hs-cover-brand{position:absolute;top:clamp(20px,4vh,46px);right:clamp(22px,4.5vw,72px);z-index:3;display:block;width:clamp(132px,14vw,196px);text-decoration:none}.bw-hs-cover-brand img{display:block;width:100%;height:auto}.bw-hs-cover-eyebrow{margin:0 0 1rem;color:var(--yellow);font:400 .72rem/1.3 'BW Mono',monospace;letter-spacing:.15em;text-transform:uppercase}.bw-hs-cover h1{max-width:8ch;margin:0;color:var(--ink);font:620 clamp(4rem,10vw,8.6rem)/.9 'BW Fraunces',Georgia,serif;letter-spacing:-.05em;text-wrap:balance}.bw-hs-cover-deck{max-width:620px;margin:clamp(1.5rem,3vw,2.7rem) 0 0;color:var(--dim);font-size:clamp(1.05rem,1.65vw,1.32rem);line-height:1.45}.bw-hs-cover-meta{margin:1.4rem 0 0;color:var(--yellow);font:400 .76rem/1.5 'BW Mono',monospace;letter-spacing:.08em;text-transform:uppercase}.bw-hs-cover-start{display:inline-flex;align-items:center;gap:.72rem;min-height:44px;margin-top:clamp(2.2rem,5vh,4rem);padding:.55rem 0;color:var(--yellow)!important;font:400 .72rem/1.2 'BW Mono',monospace;letter-spacing:.14em;text-transform:uppercase;text-decoration:none}.bw-hs-cover-start span{position:relative;display:block;width:12px;height:25px;flex:0 0 12px;animation:bwhs-cover-cue-down 1.8s ease-in-out infinite}.bw-hs-cover-start span:before{content:'';position:absolute;top:0;left:50%;width:1px;height:17px;background:var(--yellow);transform:translateX(-50%)}.bw-hs-cover-start span:after{content:'';position:absolute;left:50%;bottom:2px;width:7px;height:7px;border-right:1px solid var(--yellow);border-bottom:1px solid var(--yellow);transform:translateX(-50%) rotate(45deg)}@keyframes bwhs-cover-cue-down{0%,100%{opacity:.45;transform:translateY(0)}50%{opacity:1;transform:translateY(6px)}}.bw-hs-cover-start:focus-visible,.bw-hs-cover-brand:focus-visible{outline:3px solid var(--yellow);outline-offset:6px}.bw-hs-scrolly{position:relative;scroll-margin-top:0}",
    ".bw-hs-stage-frame{height:100vh;height:100svh;position:relative}.bw-hs-stage{position:absolute;inset:0;width:100%;height:100vh;height:100svh;z-index:0;overflow:hidden;background:radial-gradient(circle at 52% 38%,#193424 0%,var(--night) 45%,var(--deep) 100%);transition:background .5s ease}.bw-hs-stage svg{display:block;width:100%;height:100%}.bw-hs-vignette{position:absolute;inset:0;z-index:1;pointer-events:none;background:radial-gradient(ellipse at 50% 45%,transparent 34%,rgba(0,0,0,.54) 100%)}",
    ".bw-hs-steps{position:relative;z-index:2;margin-top:-100vh;margin-top:-100svh;pointer-events:none}.bw-hs-step{position:relative;display:flex;padding:0 clamp(18px,6vw,88px);pointer-events:none}.bw-hs-step[data-align=left]{align-items:center;justify-content:flex-start}.bw-hs-step[data-align=right]{align-items:center;justify-content:flex-end}.bw-hs-step[data-align=center]{align-items:center;justify-content:center;text-align:center}",
    ".bw-hs-card{position:relative;z-index:4;width:min(34rem,100%);padding:clamp(22px,3vw,38px);pointer-events:auto;background:var(--panel);border:1px solid var(--line);box-shadow:0 18px 60px rgba(0,0,0,.22);opacity:0;transform:translateY(24px);transition:opacity .5s ease,transform .5s ease}.bw-hs-card.in{opacity:1;transform:none}.bw-hs-step[data-ch=molkenmarkt] .bw-hs-card,.bw-hs-step[data-ch=today] .bw-hs-card{background:rgba(8,18,13,.68);border-color:rgba(255,230,0,.34)}",
    ".bw-hs-eyebrow{margin:0 0 .75rem;color:var(--yellow);font:400 .69rem/1.3 'BW Mono',monospace;letter-spacing:.14em;text-transform:uppercase}.bw-hs-card-title{margin:-.4rem 0 .8rem;color:var(--dim);font-size:.8rem!important;font-weight:700!important;text-transform:uppercase;letter-spacing:.08em}.bw-hs-card h1,.bw-hs-card h2{margin:0 0 .9rem;color:var(--ink);font-family:'BW Fraunces',Georgia,serif;font-weight:620;line-height:1.03;letter-spacing:-.026em;text-wrap:balance}.bw-hs-card h1{font-size:clamp(2.55rem,6vw,5.35rem)}.bw-hs-card h2{font-size:clamp(1.85rem,3.4vw,3.15rem)}.bw-hs-card p{margin:0;color:var(--dim);font-size:clamp(.98rem,1.35vw,1.08rem)}.bw-hs-hero-kicker{margin-top:1.35rem!important;color:var(--faint)!important;font:400 .73rem/1.5 'BW Mono',monospace!important;letter-spacing:.09em;text-transform:uppercase}.bw-hs-scroll-cue{display:inline-flex;align-items:center;gap:.55rem;margin-top:1.35rem;color:var(--yellow);font:400 .69rem/1.2 'BW Mono',monospace;letter-spacing:.12em;text-transform:uppercase}.bw-hs-scroll-cue:after{content:'';width:42px;height:1px;background:var(--yellow);animation:bwhs-cue 1.8s ease-in-out infinite}@keyframes bwhs-cue{0%,100%{opacity:.4;transform:translateX(0)}50%{opacity:1;transform:translateX(9px)}}",
    ".bw-hs-source-link{display:inline-flex;margin-top:1rem;color:var(--yellow)!important;font-size:.86rem;font-weight:650;text-decoration-thickness:1px;text-underline-offset:3px}.bw-hs-btn{display:inline-flex;align-items:center;justify-content:center;margin-top:1.25rem;padding:.92rem 1.12rem;background:var(--yellow);border:2px solid var(--yellow);border-radius:3px;color:var(--green)!important;font-weight:750;text-decoration:none;letter-spacing:.02em}.bw-hs a.bw-hs-btn:visited{color:var(--green)!important}.bw-hs-btn:hover{background:#fff36b;border-color:#fff36b}.bw-hs-btn:focus-visible,.bw-hs-source-link:focus-visible,.bw-hs-rail button:focus-visible,.bw-hs-details summary:focus-visible{outline:3px solid var(--yellow);outline-offset:4px}.bw-hs-place-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:1.1rem;text-align:left}.bw-hs-place{padding:.55rem 0;border-top:1px solid var(--line);color:var(--dim);font-size:.78rem}.bw-hs-place b{display:block;color:var(--ink);font:400 .62rem/1.4 'BW Mono',monospace;letter-spacing:.09em;text-transform:uppercase}.bw-hs-final-note{margin-top:1rem!important;color:var(--faint)!important;font-size:.78rem!important}",
    ".bw-hs-photo-stack{position:absolute;inset:0;z-index:2;pointer-events:none}.bw-hs-photo{position:absolute;width:clamp(200px,26vw,360px);margin:0;opacity:0;transform:translateY(18px);transition:opacity .55s ease,transform .55s ease}.bw-hs-photo.is-visible{opacity:1;transform:none}.bw-hs-photo img{display:block;width:100%;aspect-ratio:16/10;object-fit:cover;border:1px solid rgba(247,245,239,.34);filter:saturate(.74) contrast(1.04);box-shadow:0 18px 45px rgba(0,0,0,.38)}.bw-hs-photo figcaption{margin-top:6px;color:var(--faint);font:400 .49rem/1.35 'BW Mono',monospace}.bw-hs-photo.royal,.bw-hs-photo.reunited{right:clamp(26px,8vw,120px);bottom:11%}.bw-hs-photo.industrial,.bw-hs-photo.dictatorship{left:clamp(26px,7vw,100px);bottom:12%}.bw-hs-photo.wall-build{left:clamp(20px,5vw,70px);bottom:12%;width:clamp(145px,19vw,250px)}.bw-hs-photo.wall-gate{right:clamp(20px,5vw,70px);top:18%;width:clamp(145px,19vw,250px)}.bw-hs-photo.is-missing{display:none}",
    ".bw-hs-hud{position:absolute;top:max(clamp(16px,3vh,34px),env(safe-area-inset-top));left:clamp(16px,4vw,50px);z-index:4}.bw-hs-year{color:var(--ink);font:700 clamp(2rem,6vw,4.6rem)/1 'BW Mono',monospace;font-variant-numeric:tabular-nums}.bw-hs-year span{color:var(--yellow)}.bw-hs-chapter{max-width:14rem;margin-top:.45rem;color:var(--dim);font:400 .65rem/1.4 'BW Mono',monospace;letter-spacing:.12em;text-transform:uppercase}.bw-hs-map-state{margin-top:.48rem;color:var(--faint);font:400 .54rem/1.4 'BW Mono',monospace;letter-spacing:.06em;text-transform:uppercase}.bw-hs-rail{position:fixed;right:26px;top:50%;z-index:6;display:flex;flex-direction:column;gap:12px;transform:translateY(-50%);pointer-events:auto}.bw-hs-rail button{position:relative;width:11px;height:11px;padding:0;border:1px solid rgba(247,245,239,.58);border-radius:50%;background:transparent;cursor:pointer}.bw-hs-rail button.on{background:var(--yellow);border-color:var(--yellow);transform:scale(1.25)}.bw-hs-rail button:before{display:none}",
    ".bw-hs-stage [data-v],.bw-hs-real-map{opacity:0;transition:opacity .5s ease;pointer-events:none}.bw-hs-stage [data-v].is-visible,.bw-hs-real-map.is-visible{opacity:1}.bw-hs svg .outline{fill:none;stroke:rgba(247,245,239,.5);stroke-width:2}.bw-hs svg .water{fill:none;stroke:#6fa5c7;stroke-opacity:.56;stroke-width:10;stroke-linecap:round}.bw-hs svg .label{fill:var(--dim);font:400 13px 'BW Mono',monospace;letter-spacing:.1em;text-transform:uppercase}.bw-hs svg .quiet{fill:rgba(247,245,239,.48);font:400 11px 'BW Mono',monospace;letter-spacing:.08em;text-transform:uppercase}.bw-hs svg .milestone-label{fill:rgba(247,245,239,.62);font:400 11px 'BW Mono',monospace;letter-spacing:.045em;text-transform:uppercase}.bw-hs svg .ring{fill:none;stroke:var(--yellow);stroke-width:2;stroke-dasharray:4 10}.bw-hs svg .dot{fill:var(--yellow);stroke:var(--deep);stroke-width:2}.bw-hs svg .grid{stroke:rgba(247,245,239,.32);stroke-width:1.2}.bw-hs svg .block{fill:rgba(247,245,239,.08);stroke:rgba(247,245,239,.26);stroke-width:1}.bw-hs svg .arrow{fill:none;stroke:var(--yellow);stroke-width:2;stroke-dasharray:4 7;marker-end:url(#bwhs-arrow)}.bw-hs svg .wall-line{fill:none;stroke:var(--red);stroke-width:3;stroke-linecap:round;stroke-linejoin:round}.bw-hs svg .count{fill:var(--yellow);font:50px 'BW Fraunces',Georgia,serif}.bw-hs svg .real-sector{stroke:rgba(247,245,239,.35);stroke-width:1}.bw-hs svg .real-boundary{fill:none;stroke:rgba(247,245,239,.48);stroke-width:2.3;stroke-linejoin:round}.bw-hs svg .real-water{fill:none;stroke:#6fa5c7;stroke-opacity:.45;stroke-width:4}.bw-hs svg .real-wall{fill:none;stroke:var(--red);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}.bw-hs svg .real-airport{fill:var(--yellow);stroke:var(--deep);stroke-width:1.5}.bw-hs svg .real-label{fill:var(--ink);font:9px 'BW Mono',monospace;letter-spacing:.06em}.bw-hs svg .real-note{fill:rgba(247,245,239,.38);font:8px 'BW Mono',monospace;letter-spacing:.04em}",
    ".bw-hs-aftercare{position:relative;z-index:3;padding:clamp(44px,8vw,100px) clamp(18px,6vw,88px) clamp(64px,10vw,120px);background:#f7f5ef;color:#16311e}.bw-hs-aftercare-inner{width:min(920px,100%);margin:0 auto}.bw-hs-aftercare h2{margin:0 0 .75rem;font:620 clamp(2rem,4vw,3.5rem)/1.04 'BW Fraunces',Georgia,serif;letter-spacing:-.025em}.bw-hs-aftercare p{max-width:680px;margin:.5rem 0 1.2rem;color:#31513a}.bw-hs-details{margin-top:12px;border-top:1px solid rgba(18,61,24,.24);border-bottom:1px solid rgba(18,61,24,.24)}.bw-hs-details summary{padding:1rem 0;cursor:pointer;color:#123D18;font-weight:700}.bw-hs-details[open] summary{border-bottom:1px solid rgba(18,61,24,.16)}.bw-hs-details-body{padding:1rem 0 1.25rem}.bw-hs-related-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 20px}.bw-hs-related-grid a,.bw-hs-source-list a,.bw-hs-credit-list a{color:#123D18;text-decoration-thickness:1px;text-underline-offset:3px}.bw-hs-related-grid a{font-size:.87rem}.bw-hs-source-list{columns:2;column-gap:32px;margin:0;padding-left:1.1rem}.bw-hs-source-list li{break-inside:avoid;margin:0 0 .75rem;color:#31513a;font-size:.88rem}.bw-hs-credit-list{margin:0;padding-left:1.1rem;color:#31513a;font-size:.85rem}.bw-hs-credit-list li{margin:.5rem 0}.bw-hs-baseline{margin-top:.8rem!important;color:#55715c!important;font-size:.77rem}",
    "@media (prefers-reduced-motion:reduce){.bw-hs *,.bw-hs *:before,.bw-hs *:after{scroll-behavior:auto!important;animation:none!important;transition:none!important}}@media (max-width:640px){.bw-hs-step{padding:0 14px;align-items:flex-end!important;justify-content:center!important}.bw-hs-step[data-ch=molkenmarkt],.bw-hs-step[data-ch=today]{align-items:center!important}.bw-hs-card{width:100%;margin-bottom:12vh;padding:22px 20px}.bw-hs-step[data-ch=molkenmarkt] .bw-hs-card,.bw-hs-step[data-ch=today] .bw-hs-card{margin-bottom:0}.bw-hs-card h1{font-size:clamp(2.35rem,13vw,3.8rem)}.bw-hs-card h2{font-size:clamp(1.75rem,9vw,2.55rem)}.bw-hs-photo{width:42vw;max-width:190px}.bw-hs-photo.royal,.bw-hs-photo.reunited{right:14px;bottom:7%}.bw-hs-photo.industrial,.bw-hs-photo.dictatorship{left:14px;bottom:7%}.bw-hs-photo.wall-build{left:14px;bottom:8%;width:36vw}.bw-hs-photo.wall-gate{right:14px;top:17%;width:36vw}.bw-hs-photo figcaption{font-size:.42rem}.bw-hs-hud{top:max(15px,env(safe-area-inset-top));left:14px}.bw-hs-year{font-size:1.8rem}.bw-hs-chapter{max-width:9rem;font-size:.55rem}.bw-hs-map-state{max-width:9rem;font-size:.45rem}.bw-hs-rail{right:22px;gap:8px}.bw-hs-rail button{width:8px;height:8px}.bw-hs-rail button:before{display:none}.bw-hs-place-grid,.bw-hs-related-grid{grid-template-columns:1fr}.bw-hs-aftercare{padding-left:18px;padding-right:18px}.bw-hs-source-list{columns:1}.bw-hs-stage svg{transform:scale(1.04);transform-origin:center}.bw-hs[data-chapter=today] .bw-hs-hud{opacity:0;pointer-events:none}}",
    "@media (max-width:900px) and (max-height:540px) and (orientation:landscape){.bw-hs-step{padding:10px 74px 10px 58px;align-items:center!important;justify-content:center!important}.bw-hs-card{width:min(650px,100%);margin:0;padding:14px 18px}.bw-hs-card h1{font-size:clamp(2rem,5vw,2.8rem)}.bw-hs-card h2{font-size:clamp(1.35rem,3.2vw,2.05rem)}.bw-hs-card p{font-size:.83rem;line-height:1.36}.bw-hs-eyebrow{margin-bottom:.4rem;font-size:.58rem}.bw-hs-hero-kicker{margin-top:.7rem!important;font-size:.58rem!important}.bw-hs-scroll-cue{margin-top:.7rem;font-size:.55rem}.bw-hs-place-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:5px 10px;margin-top:.6rem}.bw-hs-place{padding:.34rem 0;font-size:.62rem}.bw-hs-place b{font-size:.5rem}.bw-hs-btn{margin-top:.65rem;padding:.6rem .88rem;font-size:.8rem}.bw-hs-final-note{margin-top:.6rem!important;font-size:.62rem!important;line-height:1.35}.bw-hs-rail{right:26px;gap:5px}.bw-hs-rail button{width:8px;height:8px}.bw-hs-hud{top:12px;left:34px}.bw-hs-year{font-size:1.55rem}.bw-hs-chapter{max-width:8rem;font-size:.48rem}.bw-hs-map-state{font-size:.42rem}.bw-hs-photo{opacity:.5}.bw-hs-photo figcaption{display:none}}",
    ".bw-hs{overflow-x:clip;overflow-y:visible}.bw-hs [hidden]{display:none!important}.bw-hs-stage-frame,.bw-hs-scrolly{overflow:clip}.bw-hs-stage{background:#102016;transition:none}.bw-hs[data-chapter=molkenmarkt] .bw-hs-stage{background:#101d17}.bw-hs[data-chapter=twin] .bw-hs-stage{background:#111d1a}.bw-hs[data-chapter=union] .bw-hs-stage{background:#152019}.bw-hs[data-chapter=war] .bw-hs-stage{background:#1b1d18}.bw-hs[data-chapter=royal] .bw-hs-stage{background:#182016}.bw-hs[data-chapter=industrial] .bw-hs-stage{background:#1b1c1a}.bw-hs[data-chapter=greater] .bw-hs-stage{background:#121d1a}.bw-hs[data-chapter=dictatorship] .bw-hs-stage{background:#0c0f0d}.bw-hs[data-chapter=sectors] .bw-hs-stage{background:#111923}.bw-hs[data-chapter=wall] .bw-hs-stage{background:#101719}.bw-hs[data-chapter=reunited] .bw-hs-stage{background:#122019}.bw-hs[data-chapter=today] .bw-hs-stage{background:#102016}",
    ".bw-hs-card{width:min(36rem,39vw);transition:opacity .42s ease,transform .42s ease}.bw-hs-photo{width:clamp(360px,44vw,720px);transform:none;transition:opacity .48s ease}.bw-hs-photo.is-visible{transform:none}.bw-hs-photo img{aspect-ratio:4/3;filter:none;object-fit:cover}.bw-hs-photo figcaption{font-size:11px;line-height:1.3;letter-spacing:.025em}.bw-hs-photo.molkenmarkt{right:clamp(18px,8vw,124px);left:auto;top:auto;bottom:12%;width:clamp(440px,52vw,790px)}.bw-hs-photo.molkenmarkt img{aspect-ratio:1.2}.bw-hs-photo.plan-ghost{left:clamp(12px,4vw,64px);right:auto;top:7%;bottom:auto;width:clamp(240px,30vw,430px);z-index:1}.bw-hs-photo.plan-ghost.is-visible{opacity:.12}.bw-hs-photo.plan-ghost img{aspect-ratio:1.55;box-shadow:none;border-color:rgba(247,245,239,.18)}.bw-hs-photo.plan-ghost figcaption,.bw-hs-photo.plan-ghost .bw-hs-evidence-cursor{display:none}.bw-hs-photo.war-plan{right:clamp(18px,8vw,124px);left:auto;top:auto;bottom:12%;width:clamp(390px,44vw,710px)}.bw-hs-photo.war-plan img{aspect-ratio:1.32}.bw-hs-photo.royal{right:clamp(18px,8vw,124px);left:auto;top:auto;bottom:12%;width:clamp(390px,44vw,710px)}.bw-hs-photo.industrial{left:clamp(18px,7vw,104px);right:auto;top:auto;bottom:12%;width:clamp(390px,44vw,710px)}.bw-hs-photo.dictatorship{left:39%;right:auto;top:auto;bottom:3%;width:clamp(360px,37vw,545px)}.bw-hs-photo.dictatorship img{aspect-ratio:1.35}.bw-hs-photo.reunited-before,.bw-hs-photo.reunited-after{top:auto;bottom:13%;width:clamp(300px,33vw,480px)}.bw-hs-photo.reunited-before{left:28%;right:auto;border-right:1px solid var(--yellow);padding-right:1px}.bw-hs-photo.reunited-after{left:auto;right:3%}.bw-hs-photo.reunited-before img,.bw-hs-photo.reunited-after img{aspect-ratio:.77;object-fit:cover}.bw-hs-photo.is-missing{display:none}.bw-hs-evidence-cursor{position:absolute;top:12%;left:14%;width:20px;height:20px;border:1px solid var(--yellow);border-radius:50%;box-shadow:0 0 0 4px rgba(255,230,0,.12);pointer-events:none}.bw-hs-evidence-cursor:after{content:'';position:absolute;top:50%;left:50%;width:5px;height:5px;margin:-3px;border-radius:50%;background:var(--yellow)}.bw-hs-step[data-ch=dictatorship]{align-items:flex-start;justify-content:center;padding-top:clamp(90px,12vh,138px)}.bw-hs-step[data-ch=dictatorship] .bw-hs-card{width:min(54rem,100%);padding:0;background:transparent;border:0;box-shadow:none}.bw-hs-step[data-ch=dictatorship] .bw-hs-card h2{max-width:56rem}.bw-hs-step[data-ch=dictatorship] .bw-hs-card>p:not(.bw-hs-eyebrow):not(.bw-hs-evidence-note){max-width:58rem}.bw-hs-evidence-fact{display:flex;align-items:baseline;gap:16px;max-width:38rem;margin-top:1.35rem;padding:8px 0 8px 18px;border-left:3px solid var(--red)}.bw-hs-evidence-fact strong{color:var(--yellow);font:620 clamp(2.6rem,5vw,4rem)/1 'BW Fraunces',Georgia,serif;white-space:nowrap}.bw-hs-evidence-fact span{color:var(--dim);font:400 .78rem/1.45 'BW Mono',monospace;letter-spacing:.03em}.bw-hs-evidence-note{margin-top:.75rem!important;color:rgba(247,245,239,.55)!important;font:400 .7rem/1.4 'BW Mono',monospace!important}.bw-hs svg .evidence-line{fill:none;stroke:var(--red);stroke-width:3;stroke-linecap:round}.bw-hs svg .evidence-dot{fill:var(--red);stroke:var(--red);stroke-width:2}.bw-hs svg .evidence-date{fill:var(--ink);font:400 13px 'BW Mono',monospace;letter-spacing:.05em}.bw-hs-rail[hidden]{display:none!important}.bw-hs-rail{right:18px;gap:3px}.bw-hs-rail button{width:24px;height:24px;padding:0;border:0;border-radius:0;background:transparent;transform:none!important}.bw-hs-rail button:before{display:block;content:'';position:absolute;top:50%;left:50%;width:9px;height:9px;margin:-5px;border:1px solid rgba(247,245,239,.62);border-radius:50%;background:transparent}.bw-hs-rail button.on{background:transparent;border:0;transform:none!important}.bw-hs-rail button.on:before{width:14px;height:14px;margin:-8px;border:3px solid var(--yellow);background:var(--yellow);box-shadow:0 0 0 2px var(--deep)}.bw-hs-progress{display:none}.bw-hs-chapter-status{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}",
    "@media (max-width:640px){.bw-hs{overflow-x:clip}.bw-hs-stage svg{transform:none}.bw-hs-step{padding:0 14px;align-items:flex-end!important;justify-content:center!important}.bw-hs-step[data-ch=molkenmarkt]{align-items:flex-start!important;justify-content:center!important}.bw-hs-step[data-ch=molkenmarkt] .bw-hs-card{width:100%;margin-top:calc(7vh + (100vw - 28px)/1.25 + 36px);margin-bottom:0;padding:20px}.bw-hs-step[data-ch=today]{align-items:center!important}.bw-hs-card{width:100%;margin-bottom:12vh;padding:20px}.bw-hs-card h1{font-size:clamp(2.35rem,13vw,3.8rem)}.bw-hs-card h2{font-size:clamp(1.72rem,9vw,2.55rem)}.bw-hs-card p{font-size:.96rem;line-height:1.52}.bw-hs-photo{left:14px!important;right:14px!important;top:9vh!important;bottom:auto!important;width:auto!important;max-width:none!important}.bw-hs-photo img{aspect-ratio:1.28;object-fit:cover}.bw-hs-photo.molkenmarkt{top:7vh!important}.bw-hs-photo.molkenmarkt img{aspect-ratio:1.25}.bw-hs-photo.plan-ghost{display:none}.bw-hs-photo.war-plan img,.bw-hs-photo.royal img,.bw-hs-photo.industrial img,.bw-hs-photo.dictatorship img{aspect-ratio:1.3}.bw-hs-photo.wall-build{left:14px!important;right:auto!important;top:10vh!important;width:calc(50% - 21px)!important}.bw-hs-photo.wall-gate{left:auto!important;right:14px!important;top:22vh!important;width:calc(50% - 21px)!important}.bw-hs-photo.reunited-before{left:14px!important;right:auto!important;top:9vh!important;width:calc(50% - 21px)!important}.bw-hs-photo.reunited-after{left:auto!important;right:14px!important;top:9vh!important;width:calc(50% - 21px)!important}.bw-hs-photo.reunited-before img,.bw-hs-photo.reunited-after img{aspect-ratio:.8}.bw-hs-photo figcaption{font-size:11px}.bw-hs-evidence-cursor{width:16px;height:16px;top:10%;left:10%}.bw-hs-evidence-cursor:after{width:4px;height:4px;margin:-2px}.bw-hs-step[data-ch=dictatorship]{align-items:flex-end!important;justify-content:center!important;padding-top:0}.bw-hs-step[data-ch=dictatorship] .bw-hs-card{width:100%;margin-top:0;padding:20px;background:var(--panel);border:1px solid var(--line);box-shadow:0 18px 60px rgba(0,0,0,.22)}.bw-hs-evidence-fact{gap:12px;margin-top:1rem;padding-left:12px}.bw-hs-evidence-fact strong{font-size:2.6rem}.bw-hs-evidence-fact span{font-size:.68rem}.bw-hs-evidence-note{font-size:.64rem!important}.bw-hs-rail{display:none!important}.bw-hs-progress{position:absolute;top:clamp(70px,11vh,98px);right:14px;z-index:6;display:inline-flex;align-items:center;min-height:28px;padding:5px 9px;border:1px solid rgba(255,230,0,.55);border-radius:2px;background:rgba(8,18,13,.75);color:var(--yellow);font:400 .64rem/1 'BW Mono',monospace;letter-spacing:.08em}.bw-hs-hud{top:max(15px,env(safe-area-inset-top));left:14px}.bw-hs-year{font-size:1.8rem}.bw-hs-chapter{max-width:9rem;font-size:.55rem}.bw-hs-map-state{max-width:9rem;font-size:.5rem}.bw-hs[data-chapter=today] .bw-hs-hud{opacity:0;pointer-events:none}}",
    "@media (max-width:900px) and (max-height:540px) and (orientation:landscape){.bw-hs-step{padding:10px 72px 10px 54px;align-items:center!important;justify-content:center!important}.bw-hs-step[data-ch=molkenmarkt] .bw-hs-card{margin-top:0}.bw-hs-card{width:min(650px,100%);margin:0;padding:14px 18px}.bw-hs-card h1{font-size:clamp(2rem,5vw,2.8rem)}.bw-hs-card h2{font-size:clamp(1.35rem,3.2vw,2.05rem)}.bw-hs-card p{font-size:.83rem;line-height:1.36}.bw-hs-eyebrow{margin-bottom:.4rem;font-size:.58rem}.bw-hs-hero-kicker{margin-top:.7rem!important;font-size:.58rem!important}.bw-hs-scroll-cue{margin-top:.7rem;font-size:.55rem}.bw-hs-progress{position:absolute;top:50px;right:34px;z-index:6;display:inline-flex;align-items:center;min-height:24px;padding:4px 7px;border:1px solid rgba(255,230,0,.55);border-radius:2px;background:rgba(8,18,13,.75);color:var(--yellow);font:400 .58rem/1 'BW Mono',monospace;letter-spacing:.08em}.bw-hs-rail{display:none!important}.bw-hs-hud{top:12px;left:30px}.bw-hs-year{font-size:1.55rem}.bw-hs-chapter{max-width:8rem;font-size:.48rem}.bw-hs-map-state{font-size:.42rem}.bw-hs-photo{opacity:0}.bw-hs-photo.is-visible{opacity:.9}.bw-hs-photo figcaption{display:none}.bw-hs-step[data-ch=dictatorship] .bw-hs-card{padding:14px 18px}.bw-hs-evidence-fact{margin-top:.65rem}.bw-hs-evidence-fact strong{font-size:2.1rem}}",
    "@media (prefers-reduced-motion:reduce){.bw-hs .bw-hs-card,.bw-hs .bw-hs-photo,.bw-hs .bw-hs-stage [data-v],.bw-hs .bw-hs-real-map{transition:none!important;animation:none!important}.bw-hs .bw-hs-photo{transform:none!important}.bw-hs .bw-hs-scroll-cue:after{animation:none!important}}",
    "@media (min-width:641px){.bw-hs-card{width:min(34rem,34vw)}.bw-hs-step[data-ch=molkenmarkt]{align-items:flex-start;padding-top:clamp(250px,33vh,350px)}.bw-hs-step[data-ch=dictatorship],.bw-hs-step[data-ch=reunited]{align-items:flex-start}.bw-hs-step[data-ch=dictatorship] .bw-hs-card{position:sticky;top:6vh;width:min(54rem,100%);margin-top:6vh}.bw-hs-step[data-ch=reunited] .bw-hs-card{position:sticky;top:18vh;width:min(27rem,23vw);margin-top:18vh}.bw-hs-photo.reunited-before,.bw-hs-photo.reunited-after{top:18%;bottom:auto;width:31vw;max-width:none}.bw-hs-photo.reunited-before{left:29%;right:auto}.bw-hs-photo.reunited-after{left:60%;right:auto}.bw-hs-photo.dictatorship,.bw-hs-photo.dictatorship.is-visible{left:57.5%;right:auto;bottom:7%;width:clamp(480px,35vw,530px);transform:translateX(-50%)}.bw-hs-photo.dictatorship img{aspect-ratio:1.44}.bw-hs svg .milestone-label{font-size:11px}.bw-hs svg .milestone-label tspan:last-child{fill:rgba(247,245,239,.42);font-size:9px;letter-spacing:.06em}}",
    "@media (min-width:901px) and (max-height:800px){.bw-hs-step[data-ch=dictatorship] .bw-hs-card{top:2vh;margin-top:2vh;width:min(54rem,72vw)}.bw-hs-step[data-ch=dictatorship] .bw-hs-card h2{margin-bottom:.45rem;font-size:2.25rem}.bw-hs-step[data-ch=dictatorship] .bw-hs-card>p:not(.bw-hs-eyebrow):not(.bw-hs-evidence-note){font-size:.85rem;line-height:1.35}.bw-hs-step[data-ch=dictatorship] .bw-hs-eyebrow{margin-bottom:.35rem;font-size:.6rem}.bw-hs-step[data-ch=dictatorship] .bw-hs-evidence-fact{margin-top:.55rem;padding:4px 0 4px 14px}.bw-hs-step[data-ch=dictatorship] .bw-hs-evidence-fact strong{font-size:2.8rem}.bw-hs-step[data-ch=dictatorship] .bw-hs-evidence-fact span{font-size:.64rem}.bw-hs-step[data-ch=dictatorship] .bw-hs-evidence-note{margin-top:.3rem!important;font-size:.6rem!important}.bw-hs-photo.dictatorship,.bw-hs-photo.dictatorship.is-visible{bottom:4%;width:clamp(320px,28vw,360px)}.bw-hs-step[data-ch=reunited] .bw-hs-card{top:14vh;margin-top:14vh;width:25vw;padding:22px}.bw-hs-step[data-ch=reunited] .bw-hs-card h2{margin-bottom:.55rem;font-size:2.35rem}.bw-hs-step[data-ch=reunited] .bw-hs-card>p:not(.bw-hs-eyebrow){font-size:.82rem;line-height:1.4}.bw-hs-step[data-ch=reunited] .bw-hs-eyebrow{margin-bottom:.4rem;font-size:.58rem}.bw-hs-photo.reunited-before,.bw-hs-photo.reunited-after{top:15%;width:27vw}.bw-hs-photo.reunited-before{left:33%}.bw-hs-photo.reunited-after{left:60%}}",
    ".bw-hs-mobile-evidence{display:none}",
    "@media (max-width:640px){.bw-hs-step[data-ch=dictatorship]{min-height:220vh!important}.bw-hs[data-chapter=dictatorship] [data-v=dictatorship] .evidence-line,.bw-hs[data-chapter=dictatorship] [data-v=dictatorship] .evidence-dot,.bw-hs[data-chapter=dictatorship] [data-v=dictatorship] .evidence-date{display:none}.bw-hs .milestone-row{display:none}.bw-hs-mobile-evidence{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:1rem 0 .25rem;padding:.7rem 0 0;border-top:2px solid var(--red);list-style:none}.bw-hs-mobile-evidence li{color:var(--ink);font:400 11px/1.35 'BW Mono',monospace;letter-spacing:.02em;text-align:center}.bw-hs-mobile-evidence li:first-child{text-align:left}.bw-hs-mobile-evidence li:last-child{text-align:right}}",
    "@media (max-width:640px){.bw-hs-cover{align-items:end;min-height:100svh;padding:clamp(28px,6vh,52px) 20px 34px}.bw-hs-cover:after{background:linear-gradient(180deg,rgba(8,18,13,.58) 0%,rgba(8,18,13,.75) 46%,rgba(8,18,13,.98) 88%)}.bw-hs-cover-archive{top:9%;right:14px;width:calc(100% - 28px);opacity:.2;transform:none}.bw-hs-cover-brand{top:max(18px,env(safe-area-inset-top));right:18px;width:clamp(108px,32vw,140px)}.bw-hs-cover-content{width:100%;padding-top:22vh}.bw-hs-cover-eyebrow{margin-bottom:.85rem;font-size:.62rem;letter-spacing:.12em}.bw-hs-cover h1{max-width:9ch;font-size:clamp(3.45rem,16vw,5rem);line-height:.92}.bw-hs-cover-deck{margin-top:1.25rem;font-size:1rem;line-height:1.43}.bw-hs-cover-meta{margin-top:1.15rem;font-size:.65rem;line-height:1.45}.bw-hs-cover-start{margin-top:2rem;font-size:.65rem}}",
    "@media (max-width:640px) and (min-height:760px){.bw-hs-cover-content{transform:translateY(-10svh)}}",
    "@media (max-width:360px){.bw-hs-cover{padding-bottom:28px}.bw-hs-cover-content{padding-top:18vh}.bw-hs-cover-deck{font-size:.92rem;line-height:1.38}.bw-hs-cover-meta{font-size:.6rem}.bw-hs-cover-start{margin-top:1.45rem}}",
    "@media (max-width:900px) and (max-height:540px) and (orientation:landscape){.bw-hs-cover{align-items:center;min-height:100svh;padding:28px 68px 24px}.bw-hs-cover:after{background:linear-gradient(90deg,rgba(8,18,13,.94) 0%,rgba(8,18,13,.76) 58%,rgba(8,18,13,.55) 100%)}.bw-hs-cover-archive{top:8%;right:4%;width:min(50vw,410px);opacity:.22;transform:none}.bw-hs-cover-brand{top:16px;right:30px;width:120px}.bw-hs-cover-content{width:min(510px,58vw);padding-top:22px}.bw-hs-cover-eyebrow{margin-bottom:.55rem;font-size:.58rem}.bw-hs-cover h1{font-size:clamp(3rem,8vw,4.4rem);line-height:.92}.bw-hs-cover-deck{max-width:480px;margin-top:.8rem;font-size:.86rem;line-height:1.3}.bw-hs-cover-meta{margin-top:.75rem;font-size:.58rem}.bw-hs-cover-start{margin-top:1rem;font-size:.58rem}}",
    ".bw-hs-lead-section{position:relative;z-index:3;padding:clamp(46px,8vw,96px) clamp(18px,6vw,88px);background:#102016;color:var(--ink)}.bw-hs-lead-section-inner{width:min(1000px,100%);margin:0 auto}.bw-hs-lead-section .bw-hs-lead-preview{margin-top:0}.bw-hs-step[data-ch=today] .bw-hs-card{width:min(48rem,100%);text-align:left}.bw-hs-lead-preview{margin-top:1.55rem;padding:1.15rem;border:1px solid rgba(255,230,0,.42);background:rgba(18,61,24,.7);text-align:left}.bw-hs-lead-preview-head{max-width:38rem}.bw-hs-field-kicker,.bw-hs-field-sample-label,.bw-hs-tour-bridge-label{margin:0 0 .55rem;color:var(--yellow);font:400 .63rem/1.3 'BW Mono',monospace;letter-spacing:.13em;text-transform:uppercase}.bw-hs-lead-preview h3,.bw-hs-lead-gate h3{margin:0 0 .55rem;color:var(--ink);font:620 clamp(1.45rem,3vw,2.3rem)/1.05 'BW Fraunces',Georgia,serif;letter-spacing:-.02em}.bw-hs-field-intro{max-width:38rem;color:var(--dim);font-size:.91rem!important;line-height:1.45!important}.bw-hs-field-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:1.1rem}.bw-hs-field-card{min-width:0;padding:.85rem .82rem .9rem;border:1px solid rgba(247,245,239,.2);border-left:3px solid var(--lime,#7CB342);background:rgba(247,245,239,.08)}.bw-hs-field-card:nth-child(2){border-left-color:var(--yellow)}.bw-hs-field-card:nth-child(3){border-left-color:#e8b04b}.bw-hs-field-card:nth-child(4){border-left-color:#9cc6c0}.bw-hs-field-card-top{display:flex;align-items:center;justify-content:space-between;gap:8px}.bw-hs-field-number{color:var(--yellow);font:400 .65rem/1 'BW Mono',monospace}.bw-hs-field-label{color:var(--faint);font:400 .5rem/1 'BW Mono',monospace;letter-spacing:.11em}.bw-hs-field-card h4{margin:.7rem 0 .24rem;color:var(--ink);font:620 clamp(1rem,2vw,1.4rem)/1.03 'BW Fraunces',Georgia,serif;letter-spacing:-.015em}.bw-hs-field-date{display:block;color:var(--yellow);font:400 .61rem/1.3 'BW Mono',monospace;letter-spacing:.03em}.bw-hs-field-card p{color:var(--dim);font-size:.72rem!important;line-height:1.3!important}.bw-hs-field-move{display:block;margin-top:.7rem;color:var(--faint);font:400 .61rem/1.35 'BW Mono',monospace}.bw-hs-field-sample{margin-top:10px;padding:.9rem;background:#f7f5ef;color:#16311e}.bw-hs-field-sample-label{color:#123D18}.bw-hs-field-sample-note{display:grid;grid-template-columns:minmax(100px,.42fr) 1fr;gap:12px;align-items:start}.bw-hs-field-sample-note strong{font:620 clamp(1.2rem,2.5vw,1.65rem)/1.05 'BW Fraunces',Georgia,serif}.bw-hs-field-sample-note span{font-size:.82rem;line-height:1.4}.bw-hs-field-sample-meta{display:block;margin-top:.72rem;color:#48634e;font:400 .6rem/1.35 'BW Mono',monospace;letter-spacing:.07em;text-transform:uppercase}.bw-hs-lead-gate{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(280px,.95fr);gap:1.45rem;margin-top:1.15rem;padding:1.2rem 1.15rem;background:#f7f5ef;color:#16311e;text-align:left}.bw-hs-lead-gate-head p{color:#385641;font-size:.88rem!important;line-height:1.45!important}.bw-hs-lead-gate .bw-hs-field-kicker{color:#123D18}.bw-hs-lead-gate h3{color:#123D18}.bw-hs-lead-form{display:grid;align-content:start;gap:.7rem}.bw-hs-lead-field label{display:block;color:#123D18;font:650 .76rem/1.3 'BW Space',Arial,sans-serif}.bw-hs-lead-field input[type=email]{display:block;width:100%;min-height:45px;margin-top:.35rem;padding:.65rem .72rem;border:1px solid #718676;border-radius:2px;background:#fff;color:#16311e;font:400 1rem/1.3 'BW Space',Arial,sans-serif}.bw-hs-lead-field input[type=email]:focus-visible{outline:3px solid #123D18;outline-offset:2px;border-color:#123D18}.bw-hs-lead-help{margin-top:.35rem;color:#53705b!important;font:400 .64rem/1.35 'BW Mono',monospace!important}.bw-hs-lead-consent{display:grid;grid-template-columns:20px 1fr;gap:9px;align-items:start;color:#385641;font-size:.72rem;line-height:1.38;cursor:pointer}.bw-hs-lead-consent input{width:18px;height:18px;margin:1px 0 0;accent-color:#123D18}.bw-hs-lead-consent a{color:#123D18;text-decoration-thickness:1px;text-underline-offset:2px}.bw-hs-lead-honeypot{position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden}.bw-hs-lead-submit{width:100%;margin-top:.1rem!important;padding:.82rem .95rem;border-color:#FFE600;background:#FFE600;color:#123D18!important;font-size:.9rem;cursor:pointer}.bw-hs-lead-submit:hover{background:#fff36b;border-color:#fff36b}.bw-hs-lead-submit:disabled{opacity:.65;cursor:wait}.bw-hs-lead-status{min-height:1.35em;color:#123D18!important;font-size:.77rem!important;line-height:1.4!important}.bw-hs-lead-status[data-state=error]{color:#9c2530!important}.bw-hs-lead-status[data-state=success]{font-weight:650}.bw-hs-lead-note{margin-top:-.25rem!important;color:#53705b!important;font:400 .61rem/1.35 'BW Mono',monospace!important}.bw-hs-tour-bridge{margin-top:1.35rem;padding-top:1rem;border-top:1px solid var(--line);text-align:left}.bw-hs-tour-bridge .bw-hs-btn-secondary{margin-top:.15rem}.bw-hs a.bw-hs-btn.bw-hs-btn-secondary{background:transparent;border-color:rgba(247,245,239,.56);color:var(--ink)!important}.bw-hs a.bw-hs-btn.bw-hs-btn-secondary:hover{background:rgba(247,245,239,.1);border-color:var(--ink)}.bw-hs a.bw-hs-btn.bw-hs-btn-secondary:visited{color:var(--ink)!important}.bw-hs-tour-bridge .bw-hs-final-note{max-width:40rem}.bw-hs [hidden]{display:none!important}",
    "@media (max-width:720px){.bw-hs-lead-gate{grid-template-columns:1fr;gap:1rem}.bw-hs-lead-preview{padding:1rem}.bw-hs-field-card{padding:.76rem .7rem .8rem}.bw-hs-field-card h4{font-size:1.05rem}.bw-hs-field-move{font-size:.58rem}.bw-hs-field-sample-note{grid-template-columns:1fr;gap:.35rem}.bw-hs-field-sample-note span{font-size:.8rem}.bw-hs-tour-bridge{margin-top:1.1rem}}",
    "@media (max-width:360px){.bw-hs-field-grid{grid-template-columns:1fr;gap:10px}.bw-hs-field-card{padding:1rem .95rem 1.05rem}.bw-hs-field-card h4{font-size:1.22rem;line-height:1.06}.bw-hs-field-card p{font-size:.84rem!important;line-height:1.42!important}.bw-hs-field-move{font-size:.68rem;line-height:1.42}.bw-hs-field-date{font-size:.68rem;line-height:1.35}}"
  ].join('');

  var SVG = [
    '<svg viewBox="0 0 1000 640" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><defs><marker id="bwhs-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#FFE600"></path></marker><pattern id="bwhs-hatch" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="12" stroke="rgba(247,245,239,.28)" stroke-width="2"></line></pattern></defs>',
    '<g data-v="molkenmarkt"><path class="water" d="M-30 395C145 350 215 378 323 358C425 338 468 286 579 305C711 326 752 409 1030 332"></path><path class="outline" d="M340 244L594 218L676 327L562 417L360 402Z"></path><circle class="dot" cx="496" cy="326" r="9"></circle><circle cx="496" cy="326" r="21" fill="none" stroke="#FFE600" stroke-opacity=".45" stroke-width="2"></circle><text class="label" x="452" y="283">Molkenmarkt</text><text class="quiet" x="456" y="307">ground as archive</text><text class="quiet" x="728" y="387">Spree</text></g>',
    '<g data-v="twin"><path class="water" d="M-30 400C170 344 294 430 466 372C626 318 690 356 1030 276"></path><circle class="dot" cx="424" cy="335" r="11"></circle><circle class="dot" cx="530" cy="407" r="11"></circle><path class="ring" d="M372 250C445 202 563 232 620 312C672 384 618 484 527 512C432 542 331 472 330 374C330 321 347 276 372 250Z"></path><text class="label" x="366" y="311">Berlin</text><text class="label" x="543" y="456">Cölln</text><text class="quiet" x="448" y="385">two banks, one crossing</text></g>',
    '<g data-v="union"><path class="water" d="M-30 402C150 350 304 421 468 366C645 306 746 360 1030 278"></path><path class="outline" d="M314 214L688 188L754 328L630 480L354 456L260 326Z"></path><path class="evidence-line" d="M220 518H810"></path><circle class="evidence-dot" cx="280" cy="518" r="8"></circle><circle class="evidence-dot" cx="500" cy="518" r="8"></circle><circle class="evidence-dot" cx="740" cy="518" r="8"></circle><text class="evidence-date" x="280" y="552" text-anchor="middle">1307</text><text class="evidence-date" x="500" y="552" text-anchor="middle">1432</text><text class="evidence-date" x="740" y="552" text-anchor="middle">1448</text><text class="quiet" x="232" y="156">shared council</text><text class="quiet" x="443" y="156">union tightened</text><text class="quiet" x="650" y="156">castle site claimed</text></g>',
    '<g data-v="war"><path class="water" d="M-30 402C150 350 304 421 468 366C645 306 746 360 1030 278"></path><path class="outline" d="M320 210L688 192L756 332L628 478L350 454L262 326Z"></path><path class="ring" d="M415 228L487 194L559 228L594 300L559 372L487 406L415 372L380 300Z"></path><path class="evidence-line" d="M220 518H810"></path><circle class="evidence-dot" cx="280" cy="518" r="8"></circle><circle class="evidence-dot" cx="500" cy="518" r="8"></circle><circle class="evidence-dot" cx="680" cy="518" r="8"></circle><circle class="evidence-dot" cx="780" cy="518" r="8"></circle><text class="evidence-date" x="280" y="552" text-anchor="middle">1618</text><text class="evidence-date" x="500" y="552" text-anchor="middle">1658</text><text class="evidence-date" x="680" y="552" text-anchor="middle">1685</text><text class="evidence-date" x="780" y="552" text-anchor="middle">1688</text><text class="quiet" x="294" y="156">war and loss</text><text class="quiet" x="458" y="156">fortress planned</text><text class="quiet" x="622" y="156">new communities</text><text class="quiet" x="714" y="182">1652 plan · later print</text></g>',
    '<g data-v="royal"><path class="water" d="M-30 405C210 350 330 430 503 365C687 295 720 344 1030 254"></path><g class="grid"><path d="M320 190V500M375 170V522M430 155V540M485 150V545M540 156V540M595 170V522M650 190V500"></path><path d="M260 230H730M238 290H760M224 350H775M238 410H760M260 470H730"></path></g><rect x="335" y="222" width="245" height="210" fill="none" stroke="#FFE600" stroke-width="2"></rect><text class="label" x="368" y="250">Friedrichstadt</text><text class="quiet" x="370" y="274">grid begun 1688</text></g>',
    '<g data-v="industrial"><path class="water" d="M-30 395C180 350 300 418 472 365C612 322 758 374 1030 290"></path><g><rect class="block" x="232" y="190" width="130" height="114"></rect><rect class="block" x="382" y="162" width="150" height="136"></rect><rect class="block" x="554" y="200" width="132" height="112"></rect><rect class="block" x="266" y="336" width="142" height="130"></rect><rect class="block" x="440" y="332" width="160" height="145"></rect><rect class="block" x="630" y="356" width="112" height="102"></rect></g><g fill="url(#bwhs-hatch)"><rect x="252" y="210" width="90" height="74"></rect><rect x="402" y="182" width="110" height="96"></rect><rect x="574" y="220" width="92" height="72"></rect><rect x="286" y="356" width="102" height="90"></rect><rect x="460" y="352" width="120" height="105"></rect></g><text class="label" x="360" y="120">street frame</text><text class="count" x="654" y="148">1862</text><text class="quiet" x="657" y="173">Hobrecht Plan</text></g>',
    '<g data-v="greater"><circle class="ring" cx="500" cy="335" r="82"></circle><circle class="ring" cx="500" cy="335" r="168"></circle><circle class="ring" cx="500" cy="335" r="256"></circle><circle class="dot" cx="500" cy="335" r="9"></circle><text class="count" x="168" y="248">65.72</text><text class="quiet" x="175" y="274">km² before</text><text class="count" x="678" y="420">878.1</text><text class="quiet" x="686" y="446">km² after</text><text class="label" x="407" y="340">Greater Berlin</text><text class="quiet" x="430" y="365">1 Oct 1920</text></g>',
    '<g data-v="dictatorship"><rect x="0" y="0" width="1000" height="640" fill="#090c0a" opacity=".64"></rect><path class="evidence-line" d="M170 310H830"></path><circle class="evidence-dot" cx="210" cy="310" r="8"></circle><circle class="evidence-dot" cx="500" cy="310" r="8"></circle><circle class="evidence-dot" cx="790" cy="310" r="8"></circle><text class="evidence-date" x="210" y="350" text-anchor="middle">1933</text><text class="evidence-date" x="500" y="350" text-anchor="middle">October 1941</text><text class="evidence-date" x="790" y="350" text-anchor="middle">February 1945</text></g>',
    '<g data-v="sectors-fallback"><path class="outline" d="M300 180C406 110 604 148 706 248C790 331 728 494 590 527C426 568 240 474 232 334C227 268 261 211 300 180Z"></path><path d="M255 325H525V195H360Z" fill="rgba(124,179,66,.30)"></path><path d="M255 325H525V350H240Z" fill="rgba(247,245,239,.20)"></path><path d="M240 350H525V498H280Z" fill="rgba(255,230,0,.20)"></path><path d="M525 195H735V470H525Z" fill="rgba(230,57,70,.23)"></path><text class="quiet" x="335" y="242">French</text><text class="quiet" x="320" y="330">British</text><text class="quiet" x="338" y="412">American</text><text class="quiet" x="575" y="326">Soviet</text><path class="arrow" d="M116 500Q285 445 420 395"></path><path class="arrow" d="M120 168Q315 204 460 280"></path><text class="quiet" x="105" y="535">supplies by air</text></g>',
    '<g data-v="wall-fallback"><path class="outline" d="M300 180C406 110 604 148 706 248C790 331 728 494 590 527C426 568 240 474 232 334C227 268 261 211 300 180Z"></path><path class="wall-line" d="M348 226C478 162 638 212 672 328C698 414 597 500 462 478C328 455 284 358 348 226Z"></path><path d="M350 226C480 163 639 213 673 328C699 415 598 501 462 479C327 456 283 358 350 226Z" fill="none" stroke="rgba(230,57,70,.25)" stroke-width="20"></path><text class="label" x="400" y="338">West Berlin</text><text class="quiet" x="405" y="361">encircled by the Wall</text></g>',
    '<g data-v="reunited"><path class="water" d="M-30 404C170 342 309 423 467 367C649 303 740 366 1030 276"></path><rect x="276" y="350" width="85" height="126" fill="rgba(247,245,239,.23)"></rect><rect x="372" y="290" width="104" height="186" fill="rgba(247,245,239,.32)"></rect><rect x="490" y="235" width="94" height="241" fill="rgba(255,230,0,.50)"></rect><rect x="596" y="318" width="92" height="158" fill="rgba(247,245,239,.27)"></rect><rect x="700" y="266" width="72" height="210" fill="rgba(247,245,239,.20)"></rect><path class="wall-line" d="M210 600H802" stroke-dasharray="3 10" opacity=".64"></path><text class="label" x="414" y="202">Potsdamer Platz</text><g class="milestone-row"><text class="milestone-label" x="276" y="552" text-anchor="middle"><tspan x="276">February 1978</tspan><tspan x="276" dy="17">border area</tspan></text><text class="milestone-label" x="458" y="552" text-anchor="middle"><tspan x="458">3 Oct 1990</tspan><tspan x="458" dy="17">Reunification</tspan></text><text class="milestone-label" x="650" y="552" text-anchor="middle"><tspan x="650">20 Jun 1991</tspan><tspan x="650" dy="17">Capital decision</tspan></text><text class="milestone-label" x="830" y="552" text-anchor="middle"><tspan x="830">2016</tspan><tspan x="830" dy="17">photographed view</tspan></text></g></g>',
    '<g data-v="today"><path class="water" d="M-30 398C175 350 305 425 480 365C640 310 730 370 1030 284"></path><path class="outline" d="M270 190C403 104 640 136 760 274C844 371 740 532 570 549C379 568 186 474 202 331C207 274 235 216 270 190Z"></path><g><circle class="dot" cx="502" cy="328" r="9"></circle><text class="label" x="522" y="319">Molkenmarkt</text></g><g><circle class="dot" cx="435" cy="362" r="9"></circle><text class="label" x="256" y="385">Friedrichstadt</text></g><g><circle class="dot" cx="326" cy="254" r="9"></circle><text class="label" x="224" y="235">Gleis 17</text></g><g><circle class="dot" cx="462" cy="436" r="9"></circle><text class="label" x="486" y="455">Potsdamer Platz</text></g><circle cx="574" cy="304" r="8" fill="#7CB342" stroke="#f7f5ef" stroke-width="2"></circle><text class="quiet" x="588" y="292">Alexanderplatz</text><text class="quiet" x="588" y="310">tour start</text></g>',
    '<g data-el="real-map" class="bw-hs-real-map"></g></svg>'
  ].join('');

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>'"]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[c];
    });
  }
  var clamp = function (value) { return Math.max(0, Math.min(1, value)); };
  var ease = function (value) { return value < .5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2; };

  function chapterRoleLabel(chapter) {
    if (!chapter) return 'History chapter';
    if (chapter.role === 'prologue') return 'Prologue';
    if (chapter.role === 'epilogue') return 'Epilogue';
    return 'History chapter';
  }

  function chapterHudLabel(chapter) {
    if (chapter.role === 'history') return chapter.title;
    return chapterRoleLabel(chapter) + ' · ' + chapter.title;
  }

  function chapterProgressLabel(chapter, index) {
    if (chapter.role === 'prologue') return 'Prologue';
    if (chapter.role === 'epilogue') return 'Epilogue';
    return String(index).padStart(2, '0') + ' / ' + String(CHAPTERS.length - 2).padStart(2, '0');
  }

  function chapterStatusLabel(chapter, index) {
    if (chapter.role === 'prologue') return 'Prologue: ' + chapter.title;
    if (chapter.role === 'epilogue') return 'Epilogue: ' + chapter.title;
    return 'History chapter ' + index + ' of ' + (CHAPTERS.length - 2) + ': ' + chapter.title;
  }

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
    document.title = SEO.title;
    upsertMeta('name', 'description', SEO.description);
    upsertLink('canonical', canonical);
    upsertMeta('property', 'og:type', 'article');
    upsertMeta('property', 'og:title', SEO.title);
    upsertMeta('property', 'og:description', SEO.description);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:image', SEO.image);
    upsertMeta('property', 'og:image:alt', SEO.imageAlt);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', SEO.socialTitle);
    upsertMeta('name', 'twitter:description', SEO.socialDescription);
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

  function leadDimension(value, max) {
    var cleaned = String(value == null ? '' : value).trim().slice(0, max || 120);
    if (!cleaned || cleaned.indexOf('@') !== -1 || /https?:\/\//i.test(cleaned)) return '';
    return cleaned.replace(/[^A-Za-z0-9._/-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, max || 120);
  }

  function leadHttpUrl(value, fallback) {
    try {
      var parsed = new URL(String(value || fallback), window.location.href);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') return parsed.toString();
    } catch (error) {}
    return fallback;
  }

  function leadUtm() {
    var params = new URLSearchParams(window.location.search || '');
    return {
      source: leadDimension(params.get('utm_source'), 100),
      medium: leadDimension(params.get('utm_medium'), 100),
      campaign: leadDimension(params.get('utm_campaign'), 120),
      content: leadDimension(params.get('utm_content'), 120),
      term: leadDimension(params.get('utm_term'), 120)
    };
  }

  function emptyLeadUtm() {
    return { source: '', medium: '', campaign: '', content: '', term: '' };
  }

  function leadReferrerPath() {
    try {
      var parsed = new URL(document.referrer || '');
      return leadDimension(parsed.pathname, 300);
    } catch (error) {
      return '';
    }
  }

  function leadFieldPreview() {
    var cards = FIELD_PLACES.map(function (item) {
      return '<article class="bw-hs-field-card" data-place="' + esc(item.place) + '">'
        + '<div class="bw-hs-field-card-top"><span class="bw-hs-field-label">STARTING POINT</span></div>'
        + '<h4>' + esc(item.place) + '</h4>'
        + '<span class="bw-hs-field-date">' + esc(item.date) + '</span>'
        + '<p>' + esc(item.layer) + '</p>'
        + '<span class="bw-hs-field-move">' + esc(item.move) + '</span>'
        + '</article>';
    }).join('');
    return '<section class="bw-hs-lead-preview" aria-labelledby="bw-hs-field-title">'
      + '<div class="bw-hs-lead-preview-head">'
      + '<p class="bw-hs-field-kicker">Berlin, Remade: four-place field guide</p>'
      + '<h3 id="bw-hs-field-title">Four places. Four starting points.</h3>'
      + '<p class="bw-hs-field-intro">A compact way to read Berlin in the city, with one practical move at each place. These are separate starts, not one walking route.</p>'
      + '</div>'
      + '<div class="bw-hs-field-grid" aria-label="Four separate Berlin starting points">' + cards + '</div>'
      + '<aside class="bw-hs-field-sample" aria-label="Sample field note">'
      + '<p class="bw-hs-field-sample-label">Sample from the full guide</p>'
      + '<div class="bw-hs-field-sample-note"><strong>Molkenmarkt</strong><span>On the public pavement, read the A3 fence near Altes Stadthaus. The fenced excavation is a place to read, not an entry.</span></div>'
      + '<span class="bw-hs-field-sample-meta">2019 to present · one place · one date · one move</span>'
      + '</aside>'
      + '</section>';
  }

  function leadGate() {
    var consentCopy = esc(LEAD_CONSENT_COPY).replace('Privacy Policy', '<a data-bw-history-lead-privacy href="' + esc(LEAD_PRIVACY_URL_DEFAULT) + '" target="_blank" rel="noopener">Privacy Policy</a>');
    return '<section class="bw-hs-lead-gate" data-bw-history-lead-gate aria-labelledby="bw-hs-lead-title">'
      + '<div class="bw-hs-lead-gate-head">'
      + '<p class="bw-hs-field-kicker">Get the full field guide</p>'
      + '<h3 id="bw-hs-lead-title">Keep the four places on your phone.</h3>'
      + '<p>The full guide adds the place notes, dates and small reading moves behind the sample above. I will send it after you confirm your email.</p>'
      + '</div>'
      + '<form class="bw-hs-lead-form" data-bw-history-lead-form novalidate>'
      + '<div class="bw-hs-lead-field"><label for="bw-hs-lead-email">Email address</label><input id="bw-hs-lead-email" name="email" type="email" autocomplete="email" inputmode="email" required aria-describedby="bw-hs-lead-email-help"><p id="bw-hs-lead-email-help" class="bw-hs-lead-help">No name, phone number or arrival date is needed.</p></div>'
      + '<label class="bw-hs-lead-consent"><input name="consent" type="checkbox" required aria-describedby="bw-hs-lead-consent-copy"><span id="bw-hs-lead-consent-copy">' + consentCopy + '</span></label>'
      + '<div class="bw-hs-lead-honeypot" aria-hidden="true"><label for="bw-hs-lead-website">Website</label><input id="bw-hs-lead-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>'
      + '<button class="bw-hs-btn bw-hs-lead-submit" type="submit">Send me the field guide</button>'
      + '<p class="bw-hs-lead-status" data-bw-history-lead-status role="status" aria-live="polite" aria-atomic="true"></p>'
      + '<p class="bw-hs-lead-note">One email, then a secure link after confirmation.</p>'
      + '</form>'
      + '</section>';
  }

  function card(chapter) {
    var heading = '<h2>' + esc(chapter.title) + '</h2>';
    var lead = '<p class="bw-hs-eyebrow">' + esc(chapter.eyebrow) + '</p>';
    var extra = '';
    if (chapter.key === 'wall') extra = '<a class="bw-hs-source-link" data-bw-history-track="wall_timeline" href="' + esc(WALL_URL) + '">Open the full Berlin Wall Timeline</a>';
    if (chapter.key === 'dictatorship') extra = '<ol class="bw-hs-mobile-evidence" aria-label="Evidence dates"><li>1933</li><li>October 1941</li><li>February 1945</li></ol><div class="bw-hs-evidence-fact"><strong>50,000+</strong><span>Berlin Jews deported and murdered between October 1941 and February 1945</span></div><p class="bw-hs-evidence-note">The 1945 photograph is evidence of physical destruction only.</p>';
    if (chapter.key === 'today') extra = '<div class="bw-hs-place-grid"><div class="bw-hs-place"><b>Molkenmarkt</b>buried market city</div><div class="bw-hs-place"><b>Friedrichstadt</b>planned royal capital</div><div class="bw-hs-place"><b>Gleis 17</b>evidence of deportation</div><div class="bw-hs-place"><b>Potsdamer + Leipziger Platz</b>post-Wall rebuild</div></div>';
    return '<div class="bw-hs-card">' + lead + heading + '<p>' + esc(chapter.body) + '</p>' + extra + '</div>';
  }

  function leadSection() {
    return '<section class="bw-hs-lead-section" aria-label="Berlin, Remade field guide sign-up"><div class="bw-hs-lead-section-inner">'
      + leadFieldPreview()
      + leadGate()
      + '<div class="bw-hs-tour-bridge"><p class="bw-hs-tour-bridge-label">Prefer a live walk?</p><a class="bw-hs-btn bw-hs-btn-secondary" data-bw-history-track="closing_cta" href="' + esc(BOOK_URL) + '">Book my Free Berlin Walking Tour</a><p class="bw-hs-final-note">My free tour starts at Alexanderplatz. It lasts 2 hours and explores the historic centre of former East Berlin: 11 stops, 16 places and about 3 km. It does not follow the Berlin Wall line.</p></div>'
      + '</div></section>';
  }

  function cover() {
    return '<section class="bw-hs-cover" aria-labelledby="bw-hs-cover-title">'
      + '<div class="bw-hs-cover-archive" aria-hidden="true"><img src="' + esc(BASE_URL + 'assets/photos/berlin-coelln-plan-1652-hero.jpg') + '" alt="" decoding="async" loading="eager" fetchpriority="high"></div>'
      + '<a class="bw-hs-cover-brand" href="' + esc(HOME_URL) + '" aria-label="BerlinWalk home"><img src="' + esc(BASE_URL + 'assets/brand/berlinwalk-wordmark-yellow.png') + '" alt="BerlinWalk"></a>'
      + '<div class="bw-hs-cover-content">'
      + '<p class="bw-hs-cover-eyebrow">' + esc(COVER.eyebrow) + '</p>'
      + '<h1 id="bw-hs-cover-title">' + esc(COVER.title) + '</h1>'
      + '<p class="bw-hs-cover-deck">' + esc(COVER.deck) + '</p>'
      + '<p class="bw-hs-cover-meta">' + esc(COVER.meta) + '</p>'
      + '<a class="bw-hs-cover-start" href="#bw-hs-story-start">' + esc(COVER.cue) + '<span aria-hidden="true"></span></a>'
      + '</div>'
      + '</section>';
  }

  function photo(item) {
    var fallback = item.fallbackSrc ? ' data-fallback-src="' + esc(BASE_URL + item.fallbackSrc) + '" data-fallback-alt="' + esc(item.fallbackAlt || '') + '" data-fallback-credit="' + esc(item.fallbackCredit || '') + '"' : '';
    var caption = item.hideCaption ? '' : '<figcaption>' + esc(item.credit) + '</figcaption>';
    var decorative = item.decorative ? ' aria-hidden="true"' : '';
    var alt = item.decorative ? '' : item.alt;
    return '<figure class="bw-hs-photo ' + esc(item.className) + '" data-photo-chapter="' + esc(item.chapter) + '" data-original-credit="' + esc(item.credit) + '"' + decorative + fallback + '><img data-src="' + esc(BASE_URL + item.src) + '" alt="' + esc(alt) + '" decoding="async" loading="lazy"><span class="bw-hs-evidence-cursor" aria-hidden="true"></span>' + caption + '</figure>';
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
      + '<li><a href="https://commons.wikimedia.org/wiki/File:Berlin_Molkenmarkt_Baustelle_Ausgrabung_Bohlendamm_2v3.jpg">Singlespeedfahrer, Molkenmarkt excavation, 2022</a> · CC0 1.0</li>'
      + '<li><a href="https://commons.wikimedia.org/wiki/File:Memhardt,_Bodenehr_Berlin_und_C%C3%B6lln_1652_(1720).jpg">Johann Gregor Memhardt / Gabriel Bodenehr, later print based on the 1652 Berlin and Cölln plan</a> · public domain; the prologue uses a 720px delivery derivative of this same map.</li>'
      + '<li><a href="https://commons.wikimedia.org/wiki/File:Ca._1740_map_of_Berlin_by_Homann_Heirs.jpg">Homann Heirs, c. 1740 map of Berlin</a> · public domain</li>'
      + '<li><a href="https://commons.wikimedia.org/wiki/File:Hallesches_Tor,_Berlin_1894.jpg">Robert Prager, Hallesches Tor, 1894</a> · public domain</li>'
      + '<li><a href="https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_183-J31347,_Berlin,_Ruinen_und_zerst%C3%B6rte_Autos.jpg">Bundesarchiv Bild 183-J31347, Berlin ruins and destroyed vehicles, February 1945</a> · <a href="https://creativecommons.org/licenses/by-sa/3.0/de/deed.en">CC BY-SA 3.0 DE</a></li>'
      + '<li><a href="https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_173-1321,_Berlin,_Mauerbau.jpg">Bundesarchiv Bild 173-1321 / Helmut J. Wolf</a> · CC BY-SA 3.0 DE</li>'
      + '<li><a href="https://commons.wikimedia.org/wiki/File:Brandenburg_gate_1982.jpg">Zika, Brandenburg Gate walled off, 1982</a> · public domain</li>'
      + '<li><a href="https://commons.wikimedia.org/wiki/File:18_Berlin-Klassenfahrt_1979-_Berliner_Mauer,_Potsdamer_Platz_(18176330736).jpg">Rüdiger Stehn, Potsdamer Platz border area, February 1978</a> · CC BY-SA 2.0</li>'
      + '<li><a href="https://commons.wikimedia.org/wiki/File:Berlin_-_Sony_Center_am_Potsdamer_Platz_%281%29.jpg">Fred Romero, Sony Center at Potsdamer Platz, 2016</a> · CC BY 2.0</li>'
      + '</ul>';
    return '<section class="bw-hs-aftercare" aria-label="Sources, map attribution, image credits and related reading"><div class="bw-hs-aftercare-inner">'
      + '<h2>Keep the story connected to the city.</h2><p>These links stay deliberately practical. Use one place, one date or one question as the next thing to investigate.</p>'
      + '<details class="bw-hs-details"><summary>Explore more Berlin history</summary><div class="bw-hs-details-body">' + related() + '</div></details>'
      + '<details class="bw-hs-details"><summary>Sources for this story</summary><div class="bw-hs-details-body">' + sources + '</div></details>'
      + '<details class="bw-hs-details"><summary>Map data and attribution</summary><div class="bw-hs-details-body">' + mapSources + '</div></details>'
      + '<details class="bw-hs-details"><summary>Image credits</summary><div class="bw-hs-details-body">' + credits + '</div></details>'
      + '</div></section>';
  }

  class BWBHistoryStory extends HTMLElement {
    constructor() {
      super();
      this._leadEvents = {};
      this._leadGateTimer = null;
      this._leadGateObserver = null;
      this._leadPrivacyObserver = null;
      this._leadStartedAt = null;
      this._leadSubmitting = false;
    }

    connectedCallback() {
      document.body.classList.add('bw-history-story-page-active');
      if (this._booted) return;
      this._booted = true;
      this.setAttribute('data-build', BUILD);
      applySeoSafetyNet();
      this._render();
      this._wire();
    }

    disconnectedCallback() {
      document.body.classList.remove('bw-history-story-page-active');
      if (this._onScroll) window.removeEventListener('scroll', this._onScroll);
      if (this._onResize) window.removeEventListener('resize', this._onResize);
      if (this._applyQaHash) window.removeEventListener('hashchange', this._applyQaHash);
      if (this._onTrackedLinkClick && this._root) this._root.removeEventListener('click', this._onTrackedLinkClick);
      if (this._observer) this._observer.disconnect();
      if (this._leadGateObserver) this._leadGateObserver.disconnect();
      if (this._leadPrivacyObserver) this._leadPrivacyObserver.disconnect();
      if (this._leadGateTimer) window.clearTimeout(this._leadGateTimer);
      if (this._leadForm && this._onLeadSubmit) this._leadForm.removeEventListener('submit', this._onLeadSubmit);
      if (this._leadForm && this._onLeadFocus) this._leadForm.removeEventListener('focusin', this._onLeadFocus);
      if (this._leadForm && this._onLeadInput) this._leadForm.removeEventListener('input', this._onLeadInput);
      if (this._mq && this._onMotion) {
        if (this._mq.removeEventListener) this._mq.removeEventListener('change', this._onMotion);
        else if (this._mq.removeListener) this._mq.removeListener(this._onMotion);
      }
    }

    _render() {
      var steps = CHAPTERS.map(function (chapter) {
        return '<section class="bw-hs-step" data-ch="' + esc(chapter.key) + '" data-role="' + esc(chapter.role) + '" data-align="' + esc(chapter.align) + '" style="min-height:' + chapter.h + 'vh">' + card(chapter) + '</section>';
      }).join('');
      this.innerHTML = '<style>' + CSS + '</style><article class="bw-hs" data-map-state="loading">' + cover() + '<div id="bw-hs-story-start" class="bw-hs-scrolly" tabindex="-1" aria-label="Berlin history story chapters"><div class="bw-hs-stage-frame"><div class="bw-hs-stage">' + SVG + '<div class="bw-hs-photo-stack">' + PHOTOS.map(photo).join('') + '</div><div class="bw-hs-vignette"></div><div class="bw-hs-hud"><div class="bw-hs-year"><span>20</span>26</div><div class="bw-hs-chapter">' + esc(chapterHudLabel(CHAPTERS[0])) + '</div><div class="bw-hs-map-state" hidden></div></div><div class="bw-hs-progress" aria-label="Story progress: ' + esc(chapterStatusLabel(CHAPTERS[0], 0)) + '"><span>' + esc(chapterProgressLabel(CHAPTERS[0], 0)) + '</span></div><div class="bw-hs-chapter-status" role="status" aria-live="polite" aria-atomic="true">' + esc(chapterStatusLabel(CHAPTERS[0], 0)) + '</div></div></div><nav class="bw-hs-rail" aria-label="Berlin history story chapters"></nav><div class="bw-hs-steps">' + steps + '</div></div>' + leadSection() + aftercare() + '</article>';
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
      this._progress = q('.bw-hs-progress');
      this._progressValue = q('.bw-hs-progress span');
      this._chapterStatus = q('.bw-hs-chapter-status');
      this._lastChapterIndex = -1;
      this._realMap = q('[data-el="real-map"]');
      this._visuals = {};
      qa('[data-v]').forEach(function (element) { self._visuals[element.getAttribute('data-v')] = element; });
      this._mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
      this._reduce = Boolean(this._mq && this._mq.matches);
      this._onMotion = function (event) { self._reduce = event.matches; root.toggleAttribute('data-reduced-motion', self._reduce); self._update(); };
      root.toggleAttribute('data-reduced-motion', this._reduce);
      if (this._mq) {
        if (this._mq.addEventListener) this._mq.addEventListener('change', this._onMotion);
        else if (this._mq.addListener) this._mq.addListener(this._onMotion);
      }
      this._photos.forEach(function (figure) {
        var image = figure.querySelector('img');
        if (image) image.addEventListener('error', function () {
          var fallback = figure.getAttribute('data-fallback-src');
          if (fallback && !figure.hasAttribute('data-fallback-tried')) {
            figure.setAttribute('data-fallback-tried', 'true');
            image.alt = figure.getAttribute('data-fallback-alt') || image.alt;
            var caption = figure.querySelector('figcaption');
            if (caption) caption.textContent = figure.getAttribute('data-fallback-credit') || caption.textContent;
            image.setAttribute('src', fallback);
            return;
          }
          figure.classList.add('is-missing');
        });
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
        button.setAttribute('aria-label', 'Go to ' + chapterRoleLabel(chapter).toLowerCase() + ': ' + chapter.title);
        button.setAttribute('data-label', chapter.title);
        button.addEventListener('click', function () {
          var top = step.getBoundingClientRect().top + (window.pageYOffset || window.scrollY || 0);
          var anchor = chapter.key === 'dictatorship' ? .31 : .5;
          var target = Math.max(0, top + step.offsetHeight * anchor - (window.innerHeight || 0) * .5);
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
      this._wireLeadGate(root);
      this._update();
      this._loadRealMap();
    }

    _leadConfig() {
      return {
        apiBase: leadHttpUrl(this.getAttribute('lead-api-base') || LEAD_API_DEFAULT, LEAD_API_DEFAULT),
        assetId: leadDimension(this.getAttribute('lead-asset-id') || LEAD_ASSET_ID_DEFAULT, 100),
        consentVersion: leadDimension(this.getAttribute('lead-consent-version') || LEAD_CONSENT_VERSION_DEFAULT, 120),
        experiment: leadDimension(this.getAttribute('lead-experiment') || LEAD_EXPERIMENT_DEFAULT, 100),
        variant: leadDimension(this.getAttribute('lead-variant') || LEAD_VARIANT_DEFAULT, 80),
        placement: leadDimension(this.getAttribute('lead-placement') || LEAD_PLACEMENT_DEFAULT, 100),
        privacyUrl: leadHttpUrl(this.getAttribute('lead-privacy-url') || LEAD_PRIVACY_URL_DEFAULT, LEAD_PRIVACY_URL_DEFAULT)
      };
    }

    _leadEndpoint(action) {
      var config = this._leadConfig();
      try {
        var endpoint = new URL(config.apiBase, window.location.href);
        endpoint.searchParams.set('action', action);
        return endpoint.toString();
      } catch (error) {
        return LEAD_API_DEFAULT + '?action=' + encodeURIComponent(action);
      }
    }

    _leadTransport(action, payload) {
      var adapter = window.BW_HISTORY_STORY_LEAD_ADAPTER;
      var endpoint = this._leadEndpoint(action);
      if (adapter && typeof adapter[action] === 'function') {
        return Promise.resolve(adapter[action]({ endpoint: endpoint, payload: payload, element: this }));
      }
      if (typeof fetch !== 'function') return Promise.reject(new Error('Lead transport unavailable'));
      return fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        keepalive: action === 'event'
      });
    }

    _trackLead(eventName) {
      if (!eventName || isQaMode() || !analyticsAllowed() || this._leadEvents[eventName]) return false;
      this._leadEvents[eventName] = true;
      var config = this._leadConfig();
      var utm = leadUtm();
      var payload = {
        eventName: eventName,
        assetId: config.assetId,
        analyticsConsent: true,
        pagePath: '/berlin-history-story',
        sourceSlug: LEAD_SOURCE_SLUG,
        referrer: leadReferrerPath(),
        experiment: config.experiment,
        variant: config.variant,
        placement: config.placement,
        acquisitionCohort: 'history_story',
        screenWidth: window.innerWidth || 0,
        utm: utm
      };
      this._leadTransport('event', payload).catch(function () {});
      return true;
    }

    _scheduleLeadGateView() {
      var self = this;
      if (this._leadGateTimer || this._leadEvents[LEAD_EVENT_NAMES.gateView]) return;
      this._leadGateTimer = window.setTimeout(function () {
        self._leadGateTimer = null;
        self._trackLead(LEAD_EVENT_NAMES.gateView);
      }, 2000);
    }

    _restoreLeadPrivacyVisibility(link) {
      if (!link) return;
      if (link.hasAttribute('hidden')) link.removeAttribute('hidden');
      if (!link.style) return;
      var hiddenDeclarations = {
        display: 'none',
        visibility: 'hidden',
        'pointer-events': 'none'
      };
      Object.keys(hiddenDeclarations).forEach(function (property) {
        if (link.style.getPropertyValue(property).trim().toLowerCase() === hiddenDeclarations[property]) {
          link.style.removeProperty(property);
        }
      });
    }

    _wireLeadGate(root) {
      var self = this;
      this._leadGate = root.querySelector('[data-bw-history-lead-gate]');
      if (!this._leadGate) return;
      this._leadForm = this._leadGate.querySelector('[data-bw-history-lead-form]');
      var privacyLink = this._leadGate.querySelector('[data-bw-history-lead-privacy]');
      if (privacyLink) {
        privacyLink.href = this._leadConfig().privacyUrl;
        this._restoreLeadPrivacyVisibility(privacyLink);
        if (typeof MutationObserver !== 'undefined') {
          this._leadPrivacyObserver = new MutationObserver(function () {
            self._restoreLeadPrivacyVisibility(privacyLink);
          });
          this._leadPrivacyObserver.observe(privacyLink, { attributes: true, attributeFilter: ['style', 'hidden'] });
        }
      }
      if (!this._leadForm) return;
      this._onLeadFocus = function (event) {
        if (!event.target || !event.target.matches('input')) return;
        self._leadStartedAt = self._leadStartedAt || new Date().toISOString();
        self._trackLead(LEAD_EVENT_NAMES.gateSeen);
      };
      this._onLeadInput = function (event) {
        if (!event.target || !event.target.matches('input')) return;
        self._leadStartedAt = self._leadStartedAt || new Date().toISOString();
        self._trackLead(LEAD_EVENT_NAMES.formStart);
      };
      this._onLeadSubmit = function (event) {
        event.preventDefault();
        self._submitLead();
      };
      this._leadForm.addEventListener('focusin', this._onLeadFocus);
      this._leadForm.addEventListener('input', this._onLeadInput);
      this._leadForm.addEventListener('submit', this._onLeadSubmit);
      if (typeof IntersectionObserver !== 'undefined') {
        this._leadGateObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting && entry.intersectionRatio >= .5) self._scheduleLeadGateView();
            else if (self._leadGateTimer) {
              window.clearTimeout(self._leadGateTimer);
              self._leadGateTimer = null;
            }
          });
        }, { threshold: [.5] });
        this._leadGateObserver.observe(this._leadGate);
      }
    }

    _setLeadStatus(text, state) {
      var status = this._leadGate && this._leadGate.querySelector('[data-bw-history-lead-status]');
      if (!status) return;
      status.textContent = text || '';
      if (state) status.setAttribute('data-state', state);
      else status.removeAttribute('data-state');
    }

    _submitLead() {
      if (!this._leadForm || this._leadSubmitting) return;
      var email = this._leadForm.querySelector('input[name=email]');
      var consent = this._leadForm.querySelector('input[name=consent]');
      var website = this._leadForm.querySelector('input[name=website]');
      if (!email || !email.value.trim() || !email.checkValidity()) {
        this._setLeadStatus('Enter a valid email address.', 'error');
        if (email) email.focus();
        return;
      }
      if (!consent || !consent.checked) {
        this._setLeadStatus('Please tick the consent checkbox to request the guide.', 'error');
        if (consent) consent.focus();
        return;
      }
      if (website && website.value.trim()) {
        this._setLeadStatus('Please leave the hidden field empty and try again.', 'error');
        return;
      }
      var config = this._leadConfig();
      var analyticsConsent = analyticsAllowed();
      var now = Date.now();
      var started = this._leadStartedAt ? Date.parse(this._leadStartedAt) : now - 1000;
      if (!Number.isFinite(started) || now - started < 0 || now - started > 7200000) started = now - 1000;
      this._leadStartedAt = new Date(started).toISOString();
      var randomPart = window.crypto && typeof window.crypto.randomUUID === 'function'
        ? window.crypto.randomUUID().replace(/-/g, '')
        : Math.random().toString(36).slice(2);
      var payload = {
        assetId: config.assetId,
        email: email.value.trim(),
        consent: true,
        consentVersion: config.consentVersion,
        pagePath: '/berlin-history-story',
        sourceSlug: LEAD_SOURCE_SLUG,
        referrer: leadReferrerPath(),
        experiment: analyticsConsent ? config.experiment : '',
        variant: analyticsConsent ? config.variant : '',
        placement: config.placement,
        acquisitionCohort: analyticsConsent ? 'history_story' : '',
        screenWidth: window.innerWidth || 0,
        analyticsConsentAtSubmit: analyticsConsent,
        utm: analyticsConsent ? leadUtm() : emptyLeadUtm(),
        startedAt: this._leadStartedAt,
        submittedAt: new Date(now).toISOString(),
        idempotencyKey: 'bwhistory_' + now.toString(36) + '_' + randomPart.slice(0, 24),
        qa: isQaMode(),
        website: ''
      };
      if (isQaMode()) {
        this._setLeadStatus('QA mode: request not sent.', 'pending');
        return;
      }
      this._leadSubmitting = true;
      this._setLeadStatus('Sending the request...', 'pending');
      Array.prototype.forEach.call(this._leadForm.querySelectorAll('input,button'), function (control) { control.disabled = true; });
      var self = this;
      this._leadTransport('submit', payload)
        .then(function (response) {
          if (response && typeof response.ok === 'boolean' && !response.ok) throw new Error('Lead request failed');
          if (response && typeof response.json === 'function') return response.json().catch(function () { return {}; });
          return response || {};
        })
        .then(function (result) {
          if (result && result.ok === false) throw new Error('Lead request rejected');
          self._leadSubmitting = false;
          self._trackLead(LEAD_EVENT_NAMES.submit);
          self._setLeadStatus('Check your inbox. Confirm your email there, then receive the full field guide through a secure link.', 'success');
          var submitButton = self._leadForm.querySelector('button[type=submit]');
          if (submitButton) submitButton.hidden = true;
        })
        .catch(function () {
          self._leadSubmitting = false;
          Array.prototype.forEach.call(self._leadForm.querySelectorAll('input,button'), function (control) { control.disabled = false; });
          self._setLeadStatus('Something went wrong. Please try again in a moment.', 'error');
        });
    }

    _trackLink(kind) {
      if (isQaMode() || !analyticsAllowed()) return;
      var events = {
        closing_cta: {
          name: 'bw_history_story_closing_cta_click',
          payload: {
            event_source: 'berlin_history_story',
            event_location: 'closing_cta',
            story_version: 'v2',
            page_path: '/berlin-history-story',
            destination: 'free_tour'
          }
        },
        wall_timeline: {
          name: 'bw_history_story_wall_timeline_click',
          payload: {
            event_source: 'berlin_history_story',
            event_location: 'wall_chapter',
            story_version: 'v2',
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

    // Kept in the Wall Timeline port order: async source fetch, then a
    // self-contained labelled schematic if the data request cannot complete.
    _loadRealMap() {
      var self = this;
      fetch(BASE_URL + 'assets/map/map-data.json', { cache: 'force-cache' })
        .then(function (response) {
          if (!response.ok) throw new Error('Map request failed');
          return response.json();
        })
        .then(function (data) {
          if (!data || !Array.isArray(data.sectors) || !data.wall || !Array.isArray(data.wall.main)) throw new Error('Map data is incomplete');
          self._buildRealMap(data);
          self._mapReady = true;
          self._root.setAttribute('data-map-state', 'ready');
          self._mapState.hidden = true;
          self._mapState.textContent = '';
          self._update();
        })
        .catch(function () {
          self._mapReady = false;
          self._root.setAttribute('data-map-state', 'fallback');
          self._mapState.hidden = false;
          self._mapState.textContent = 'Historical map detail unavailable; labelled schematic shown.';
          self._update();
        });
    }

    _buildRealMap(data) {
      var self = this;
      var map = this._realMap;
      while (map.firstChild) map.removeChild(map.firstChild);

      // The source map remains deliberately narrow in scope: it renders only
      // the sectors/Airlift and Wall chapters. Every other period has its own
      // purpose-built diagram rather than a misleading all-period map.
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
      var arrivals = {};
      var origins = [];
      (data.airports || []).forEach(function (airport) {
        if (airport && airport.role === 'arrival') arrivals[airport.id] = airport;
        if (airport && airport.role === 'origin') origins.push(airport);
      });
      var targetIds = ['tegel', 'gatow', 'tempelhof'];
      origins.forEach(function (origin, index) {
        var target = arrivals[targetIds[index]] || arrivals.tempelhof;
        if (!target) return;
        var cx = (origin.x + target.x) / 2;
        var cy = Math.min(origin.y, target.y) - 94 - index * 24;
        airlift.appendChild(self._svg('path', {
          d: 'M ' + origin.x + ' ' + origin.y + ' Q ' + cx + ' ' + cy + ' ' + target.x + ' ' + target.y,
          class: 'arrow'
        }));
      });
      Object.keys(arrivals).forEach(function (id) {
        var airport = arrivals[id];
        airlift.appendChild(self._svg('circle', { cx: airport.x, cy: airport.y, r: 5.5, class: 'real-airport' }));
        airlift.appendChild(self._svg('text', { x: airport.x + 9, y: airport.y - 8, class: 'real-label' }, airport.name));
      });

      var wall = this._svg('g', { 'data-real-layer': 'wall' });
      (data.wall.political || []).forEach(function (path) {
        if (typeof path === 'string') wall.appendChild(self._svg('path', { d: path, class: 'real-boundary', opacity: '.28', 'stroke-dasharray': '3 9' }));
      });
      (data.wall.main || []).forEach(function (path) {
        if (typeof path === 'string') wall.appendChild(self._svg('path', { d: path, class: 'real-wall' }));
      });
      wall.appendChild(this._svg('text', { x: 26, y: 613, class: 'real-note' }, 'Map data: Berlin Open Data · Geoportal · © OpenStreetMap contributors'));
      map.appendChild(base);
      map.appendChild(sectors);
      map.appendChild(airlift);
      map.appendChild(wall);
      this._real = { base: base, sectors: sectors, airlift: airlift, wall: wall };
      this._mapPoints = {};
      (data.points || []).forEach(function (point) {
        if (point && point.name && !self._mapPoints[point.name]) self._mapPoints[point.name] = point;
      });
    }

    _camera(name, scale, fallback) {
      var point = this._mapPoints && this._mapPoints[name];
      point = point || fallback || { x: 500, y: 320 };
      return { x: point.x, y: point.y, s: scale };
    }

    _lerpCamera(from, to, progress) {
      return {
        x: from.x + (to.x - from.x) * progress,
        y: from.y + (to.y - from.y) * progress,
        s: from.s + (to.s - from.s) * progress
      };
    }

    _realCameraFor(mapState, progress) {
      var full = { x: 500, y: 320, s: 1 };
      if (!this._mapPoints) return full;
      if (mapState === 'sectors-airlift') {
        return this._lerpCamera(full, this._camera('Tempelhof', 1.24, full), ease(progress));
      }
      if (mapState === 'wall') {
        return this._lerpCamera(
          this._camera('Checkpoint Charlie', 1.7, full),
          this._camera('Bornholmer Straße', 1.5, full),
          ease(progress)
        );
      }
      return full;
    }

    _yearFor(index, progress) {
      var chapter = CHAPTERS[index];
      if (!chapter) return 2026;
      return Math.round(chapter.yearStart + (chapter.yearEnd - chapter.yearStart) * ease(progress));
    }

    _show(key, visible) {
      if (this._visuals[key]) this._visuals[key].classList.toggle('is-visible', Boolean(visible));
    }

    _syncVisuals(chapter) {
      var visible = chapter.visual;
      if (chapter.mapState !== 'none' && this._mapReady) visible = '';
      Object.keys(this._visuals).forEach(function (key) { this._show(key, key === visible); }, this);
    }

    _syncMap(chapter, progress) {
      var mapState = chapter.mapState;
      var usesMap = mapState !== 'none';
      if (this._realMap) {
        this._realMap.classList.toggle('is-visible', Boolean(this._mapReady && usesMap));
        var camera = this._realCameraFor(mapState, progress);
        this._realMap.setAttribute('transform', 'translate(' + (500 - camera.x * camera.s).toFixed(1) + ' ' + (320 - camera.y * camera.s).toFixed(1) + ') scale(' + camera.s.toFixed(3) + ')');
      }
      if (!this._real) return;
      this._real.base.setAttribute('opacity', usesMap ? '.88' : '0');
      this._real.sectors.setAttribute('opacity', mapState === 'sectors-airlift' ? '1' : '0');
      this._real.airlift.setAttribute('opacity', mapState === 'sectors-airlift' ? (.45 + .55 * ease(progress)).toFixed(3) : '0');
      this._real.wall.setAttribute('opacity', mapState === 'wall' ? (.7 + .3 * ease(progress)).toFixed(3) : '0');
    }

    _syncPhotos(chapter) {
      // Photos sit in the sticky stage and are hidden with opacity, not display,
      // so the browser treats every one of them as in-viewport and loading="lazy"
      // alone defers nothing. Hydrate src per chapter instead: the active chapter and
      // the next one, so the fade always has a decoded image ready.
      var order = CHAPTERS.map(function (item) { return item.key; });
      var reach = order.indexOf(chapter.key) + 1;
      this._photos.forEach(function (figure) {
        var key = figure.getAttribute('data-photo-chapter');
        var image = figure.querySelector('img');
        if (image && !image.getAttribute('src')) {
          var at = order.indexOf(key);
          var pending = image.getAttribute('data-src');
          if (pending && at > -1 && at <= reach) image.setAttribute('src', pending);
        }
        figure.classList.toggle('is-visible', key === chapter.key);
      });
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
      var displayProgress = this._reduce ? 1 : progress;
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
      var year = this._yearFor(index, displayProgress);
      this._root.setAttribute('data-chapter', chapter.key);
      this._year.innerHTML = '<span>' + esc(String(year).slice(0, 2)) + '</span>' + esc(String(year).slice(2));
      this._chapter.textContent = chapterHudLabel(chapter);
      if (this._progress) {
        this._progress.setAttribute('aria-label', 'Story progress: ' + chapterStatusLabel(chapter, index));
        if (this._progressValue) this._progressValue.textContent = chapterProgressLabel(chapter, index);
      }
      if (this._chapterStatus && this._lastChapterIndex !== index) {
        this._chapterStatus.textContent = chapterStatusLabel(chapter, index);
        this._lastChapterIndex = index;
      }
      this._dots.forEach(function (dot, dotIndex) {
        var active = dotIndex === index;
        dot.classList.toggle('on', active);
        if (active) dot.setAttribute('aria-current', 'step');
        else dot.removeAttribute('aria-current');
      });
      this._syncVisuals(chapter);
      this._syncMap(chapter, displayProgress);
      this._syncPhotos(chapter);
      this._stage.style.opacity = chapter.key === 'today' ? String(1 - ease(clamp((displayProgress - .18) * 1.1)) * .58) : '1';
    }
  }

  if (!customElements.get(TAG)) {
    try { customElements.define(TAG, BWBHistoryStory); }
    catch (error) { if (window.console) window.console.warn('bw-berlin-history-story define failed', error); }
  }
})();
