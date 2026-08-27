/*
 * <bw-wall-timeline> - The Berlin Wall, a scrollable timeline (1945-1990)
 *
 * Immersive scroll-driven story surface for berlinwalk.com. Native custom
 * element, light DOM, self-contained. No iframe, no postMessage, no external
 * CSS/JS. One sticky stage carries an SVG scene that redraws as you scroll:
 * four sectors -> Airlift -> the Wall ring closing -> the death-strip diagram
 * (tap layers) -> escapes + Tunnel 57 -> the 1989 fall (page floods green) ->
 * today's map with the tour start -> book CTA.
 *
 * Mount:
 *   <bw-wall-timeline></bw-wall-timeline>
 *   <script src=".../berlin-wall-timeline/wall-timeline-element.js" defer></script>
 *
 * Designed for a Wix page with the global header and footer hidden.
 *
 * Build marker: wall-timeline-v1-20260711h
 */
(function () {
  'use strict';

  var TAG = 'bw-wall-timeline';
  var BUILD = 'wall-timeline-v1-20260711h';

  var SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : '';
  var BASE_URL = SCRIPT_URL && !/static\.wixstatic\.com/i.test(SCRIPT_URL)
    ? new URL('./', SCRIPT_URL).toString()
    : 'https://fenerszymanski.github.io/berlinwalk-widgets/berlin-wall-timeline/';

  var FINAL_URL = 'https://www.berlinwalk.com/berlin-wall-timeline';
  var HOME_URL = 'https://www.berlinwalk.com/?utm_source=berlin_wall_timeline&utm_medium=story&utm_campaign=berlinwalk&utm_content=brand';
  var BOOK_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based?utm_source=berlin_wall_timeline&utm_medium=story&utm_campaign=berlinwalk&utm_content=book_cta';
  var AUDIO_URL = 'https://www.berlinwalk.com/products/death-strip-audio-route?utm_source=berlin_wall_timeline&utm_medium=story&utm_campaign=berlinwalk&utm_content=audio_cta';
  var COVER_URL = BASE_URL + 'assets/social/berlin-wall-timeline-1200x630.jpg';

  var SEO = {
    title: 'The Berlin Wall Timeline | Scroll Through 1945 to 1990',
    description: 'An interactive Berlin Wall timeline from BerlinWalk. Scroll through the city split, the Wall, the death strip, escapes and the fall in 1989, then see what remains today.',
    socialTitle: 'The Berlin Wall Timeline | Scroll Through 1945 to 1990',
    socialDescription: 'An interactive Berlin Wall timeline from BerlinWalk. Scroll through the city split, the Wall, the death strip, escapes and the fall in 1989, then see what remains today.',
    image: COVER_URL,
    imageAlt: 'The Berlin Wall timeline cover, a divided Berlin map with the Wall line'
  };

  // ---- chapters -------------------------------------------------------------
  var CHAPTERS = [
    { key: 'hero',    name: 'A divided city', h: 150, align: 'c' },
    { key: 'sectors', name: 'Four sectors',   h: 150, align: 'l' },
    { key: 'airlift', name: 'The Airlift',    h: 150, align: 'r' },
    { key: 'up',      name: 'The Wall goes up',h: 200, align: 'l' },
    { key: 'strip',   name: 'The death strip', h: 250, align: 'r' },
    { key: 'escapes', name: 'The escapes',    h: 150, align: 'l' },
    { key: 'fall',    name: 'The fall',        h: 200, align: 'c' },
    { key: 'today',   name: 'What is left',   h: 150, align: 'r' },
    { key: 'cta',     name: 'Walk it',         h: 100, align: 'c' }
  ];

  var CSS = [
    ".bw-wt{--night:#101312;--night2:#161b18;--cream:#FAFAF5;--red:#E63946;--green:#1B5E20;--lime:#7CB342;--yellow:#FFE600;--concrete:#9BA19B;--ink-dim:rgba(250,250,245,.62);--ink-faint:rgba(250,250,245,.38);--card-bg:rgba(16,19,18,.86);--card-line:rgba(250,250,245,.14);",
    "display:block;position:relative;width:100vw;max-width:100vw;margin:0 calc((100% - 100vw)/2);background:var(--night);color:var(--cream);font-family:Montserrat,'Avenir Next','Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased;text-size-adjust:100%;overflow:visible;transition:background 1.4s ease}",
    ".bw-wt.reunited{background:#0e1a10}",
    ".bw-wt *{box-sizing:border-box}.bw-wt a{color:inherit}",
    ".bw-wt-sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}",
    /* scrolly + sticky stage */
    ".bw-wt-scrolly{position:relative}",
    ".bw-wt-stage-frame{height:100vh;height:100svh;position:relative}",
    ".bw-wt-stage{position:absolute;top:0;left:0;width:100%;height:100vh;height:100svh;z-index:0;overflow:hidden;pointer-events:auto;background:var(--night);transition:background 1.4s ease}",
    ".bw-wt.reunited .bw-wt-stage{background:#0e1a10}",
    ".bw-wt-stage svg{width:100%;height:100%;display:block}",
    ".bw-wt-vignette{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 42%,transparent 45%,rgba(0,0,0,.55) 100%);pointer-events:none}",
    ".bw-wt-photo-stack{position:absolute;inset:0;z-index:1;pointer-events:none}",
    ".bw-wt-photo{position:absolute;margin:0;opacity:0;transform:translateY(18px);transition:opacity .8s ease,transform .8s ease;width:clamp(220px,28vw,360px)}",
    ".bw-wt-photo img{display:block;width:100%;aspect-ratio:16/10;object-fit:cover;filter:saturate(.72) contrast(1.06);border:1px solid rgba(250,250,245,.28);box-shadow:0 16px 40px rgba(0,0,0,.3)}",
    ".bw-wt-photo figcaption{margin-top:6px;color:var(--ink-faint);font-size:.52rem;line-height:1.35;letter-spacing:.03em}",
    ".bw-wt-photo-up{left:clamp(26px,6vw,86px);bottom:11%}",
    ".bw-wt-photo-escapes{right:clamp(28px,7vw,90px);top:17%}",
    ".bw-wt-photo-fall{right:clamp(28px,7vw,90px);top:19%}",
    ".bw-wt-real-map{pointer-events:none;vector-effect:non-scaling-stroke}",
    ".bw-wt-real-base .west-fill{fill:rgba(250,250,245,.045);stroke:none}",
    ".bw-wt-real-base .east-fill{fill:rgba(230,57,70,.045);stroke:none}",
    ".bw-wt-real-berlin-boundary{fill:none;stroke:rgba(250,250,245,.42);stroke-width:2.2;stroke-linejoin:round}",
    ".bw-wt-real-sector{stroke:rgba(250,250,245,.18);stroke-width:1.2}",
    ".bw-wt-real-sector-label{font-family:Montserrat,Arial,sans-serif;font-size:12px;font-weight:800;letter-spacing:.09em;text-anchor:middle;text-transform:uppercase;fill:var(--cream);paint-order:stroke;stroke:rgba(16,19,18,.72);stroke-width:3px;stroke-linejoin:round}",
    ".bw-wt-real-sector-label.label-dark{fill:var(--night);stroke:rgba(250,250,245,.58)}",
    ".bw-wt-real-label{font-family:Montserrat,Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;fill:rgba(250,250,245,.46)}",
    ".bw-wt-real-wall-main{fill:none;stroke:var(--red);stroke-width:2.8;stroke-linecap:round;stroke-linejoin:round}",
    ".bw-wt-real-wall-rear{fill:none;stroke:rgba(250,250,245,.35);stroke-width:1.4;stroke-dasharray:2 5;stroke-linecap:round}",
    ".bw-wt-real-wall-political{fill:none;stroke:rgba(250,250,245,.18);stroke-width:1;stroke-dasharray:2 7}",
    ".bw-wt-real-strip{fill:rgba(230,57,70,.14);stroke:rgba(230,57,70,.35);stroke-width:1;stroke-dasharray:2 5}",
    ".bw-wt-real-today-line{fill:none;stroke:rgba(250,250,245,.62);stroke-width:2.2;stroke-dasharray:2 9;stroke-linecap:round}",
    ".bw-wt-real-today .bw-wt-real-label{font-size:7px;letter-spacing:.05em;opacity:.76}",
    ".bw-wt-real-marker{fill:var(--lime);stroke:var(--cream);stroke-width:1.4}",
    ".bw-wt-real-marker-start{fill:var(--yellow);stroke:var(--yellow);stroke-width:2}",
    ".bw-wt-real-marker-story{fill:var(--red);stroke:var(--cream);stroke-width:1.2}",
    ".bw-wt-real-air-path{fill:none;stroke:rgba(250,250,245,.4);stroke-width:1.3;stroke-dasharray:4 7}",
    ".bw-wt-real-air-plane{fill:var(--yellow);stroke:var(--cream);stroke-width:.65;stroke-linejoin:round;filter:drop-shadow(0 0 3px rgba(255,230,0,.45))}",
    ".bw-wt-real-air-arrival-pulse{fill:none;stroke:var(--yellow);stroke-width:1.5;opacity:0;transform-box:fill-box;transform-origin:center}",
    ".bw-wt.airlift-live .bw-wt-real-air-arrival-pulse{animation:bwwt-arrival-pulse 2.2s ease-out infinite;animation-delay:var(--pulse-delay)}",
    "@keyframes bwwt-arrival-pulse{0%{opacity:.9;transform:scale(.45)}80%{opacity:0;transform:scale(2.1)}100%{opacity:0;transform:scale(2.1)}}",
    ".bw-wt-real-attribution{font-family:Montserrat,Arial,sans-serif;font-size:8px;letter-spacing:.04em;fill:rgba(250,250,245,.32)}",
    ".bw-wt-steps{position:relative;z-index:2;margin-top:-100vh;margin-top:-100svh;pointer-events:none}",
    ".bw-wt-step{position:relative;display:flex;padding:0 clamp(16px,6vw,80px);pointer-events:none}",
    ".bw-wt-h100{min-height:100vh;min-height:100svh}.bw-wt-h150{min-height:150vh;min-height:150svh}.bw-wt-h200{min-height:200vh;min-height:200svh}.bw-wt-h250{min-height:250vh;min-height:250svh}",
    ".bw-wt-al-l{align-items:center;justify-content:flex-start}.bw-wt-al-r{align-items:center;justify-content:flex-end}.bw-wt-al-c{align-items:center;justify-content:center;text-align:center}",
    /* card */
    ".bw-wt-card{pointer-events:auto;max-width:32rem;background:var(--card-bg);border:1px solid var(--card-line);padding:clamp(20px,3.2vw,34px) clamp(20px,3.4vw,38px);opacity:0;transform:translateY(26px);transition:opacity .7s ease,transform .7s ease}",
    ".bw-wt-card.in{opacity:1;transform:none}",
    ".bw-wt-eyebrow{font-size:.7rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--red);margin:0 0 .7rem;transition:color 1s}",
    ".bw-wt.reunited .bw-wt-eyebrow{color:var(--lime)}",
    ".bw-wt-card h2{margin:0 0 .7rem;font-size:clamp(1.35rem,3vw,1.9rem);font-weight:800;line-height:1.2;text-wrap:balance;letter-spacing:-.01em;color:var(--cream)}",
    ".bw-wt-card p{margin:0;color:var(--ink-dim);font-size:clamp(.95rem,1.3vw,1.05rem)}",
    ".bw-wt-chips{display:flex;gap:10px;flex-wrap:wrap;margin-top:1.1rem}",
    ".bw-wt-chip{border:1px solid var(--card-line);padding:.55rem .85rem;display:flex;flex-direction:column;gap:.1rem;min-width:5.2rem}",
    ".bw-wt-chip b{font-size:1.25rem;font-weight:800;font-variant-numeric:tabular-nums;color:var(--yellow);letter-spacing:.01em}",
    ".bw-wt-chip span{font-size:.62rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-faint)}",
    ".bw-wt-hint{margin-top:1rem;font-size:.72rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-faint)}",
    /* hero + cta */
    ".bw-wt-step.hero .bw-wt-card{background:none;border:none;max-width:44rem}",
    ".bw-wt-step.hero h1{margin:.2rem 0 1rem;font-weight:900;text-transform:uppercase;font-size:clamp(3rem,12vw,7.5rem);line-height:.95;letter-spacing:-.01em;color:var(--cream)}",
    ".bw-wt-step.hero h1 span{color:var(--red)}",
    ".bw-wt-cue{margin-top:2.2rem;display:inline-flex;flex-direction:column;align-items:center;gap:8px;color:var(--ink-faint);font-size:.7rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase}",
    ".bw-wt-cue:after{content:'';width:1px;height:44px;background:linear-gradient(var(--red),transparent);animation:bwwt-cue 1.8s ease-in-out infinite}",
    "@keyframes bwwt-cue{0%,100%{opacity:.3;transform:scaleY(.7)}50%{opacity:1;transform:none}}",
    ".bw-wt-step.cta .bw-wt-card{max-width:38rem;background:none;border:none}",
    ".bw-wt-step.cta h2{font-size:clamp(1.8rem,5vw,3rem);font-weight:900;text-transform:uppercase}",
    ".bw-wt-btn{display:inline-block;margin-top:1.4rem;background:var(--yellow);color:var(--green);text-decoration:none;font-weight:800;font-size:.95rem;letter-spacing:.04em;padding:.95rem 1.7rem;border-radius:3px}",
    ".bw-wt a.bw-wt-btn{color:var(--green)}",
    ".bw-wt-btn:hover{background:#fff176}",
    ".bw-wt-btn:focus-visible{outline:3px solid var(--lime);outline-offset:3px}",
    ".bw-wt-cta-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;align-items:center}",
    ".bw-wt-cta-actions .bw-wt-btn{margin-top:1.4rem}",
    ".bw-wt-btn-audio{background:transparent;border:1px solid rgba(250,250,245,.55);color:var(--cream)!important}",
    ".bw-wt-btn-audio:hover{background:var(--cream);color:var(--green)!important}",
    ".bw-wt-price{font-size:.74em;letter-spacing:.03em;opacity:.78}",
    ".bw-wt-card p.bw-wt-sub{margin-top:1.6rem;font-size:.78rem;color:var(--ink-faint);letter-spacing:.08em}",
    ".bw-wt-sub a{color:var(--ink-dim);text-decoration:underline}",
    /* hud + brand + rail (pinned inside stage) */
    ".bw-wt-hud{position:absolute;top:max(clamp(14px,3vh,34px),env(safe-area-inset-top));left:clamp(16px,4vw,48px);z-index:3}",
    ".bw-wt-year{font-size:clamp(2.6rem,7vw,5rem);font-weight:900;letter-spacing:.02em;line-height:1;font-variant-numeric:tabular-nums;color:var(--cream)}",
    ".bw-wt-year .bw-wt-tick{color:var(--red);transition:color 1s}",
    ".bw-wt.reunited .bw-wt-year .bw-wt-tick{color:var(--lime)}",
    ".bw-wt-chapter{margin-top:.4rem;font-size:.72rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-dim)}",
    ".bw-wt-brand{position:absolute;top:max(clamp(16px,3vh,34px),env(safe-area-inset-top));right:clamp(16px,4vw,54px);z-index:4;pointer-events:auto;display:block;width:clamp(126px,13vw,188px);text-decoration:none;opacity:.94;transition:opacity .2s ease,transform .2s ease}",
    ".bw-wt-brand img{display:block;width:100%;height:auto}",
    ".bw-wt-brand:hover{opacity:1;transform:translateY(-1px)}",
    ".bw-wt-sector-legend{position:absolute;top:clamp(78px,13vh,116px);right:clamp(48px,6vw,86px);z-index:5;display:grid;grid-template-columns:repeat(2,max-content);gap:8px 16px;pointer-events:none;color:var(--cream);font-size:.58rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;opacity:0;transform:translateY(-4px);transition:opacity .35s ease,transform .35s ease}",
    ".bw-wt[data-chapter=sectors] .bw-wt-sector-legend{opacity:1;transform:none}",
    ".bw-wt-sector-legend span{display:flex;align-items:center;gap:6px;white-space:nowrap;text-shadow:0 1px 8px rgba(0,0,0,.65)}",
    ".bw-wt-sector-legend i{display:block;width:10px;height:10px;border-radius:2px;box-shadow:0 0 0 1px rgba(250,250,245,.38)}",
    ".bw-wt-sector-legend .french i{background:#7CB342}",
    ".bw-wt-sector-legend .british i{background:#FAFAF5}",
    ".bw-wt-sector-legend .american i{background:#FFE600}",
    ".bw-wt-sector-legend .soviet i{background:#E63946}",
    ".bw-wt-rail{position:absolute;right:clamp(10px,2.5vw,28px);top:50%;transform:translateY(-50%);z-index:4;display:flex;flex-direction:column;gap:14px;pointer-events:auto}",
    ".bw-wt-rail button{width:10px;height:10px;border-radius:50%;border:1px solid var(--ink-faint);background:transparent;cursor:pointer;padding:0}",
    ".bw-wt-rail button.on{background:var(--red);border-color:var(--red);transform:scale(1.25)}",
    ".bw-wt.reunited .bw-wt-rail button.on{background:var(--lime);border-color:var(--lime)}",
    ".bw-wt-rail button:focus-visible{outline:2px solid var(--yellow);outline-offset:3px}",
    /* tooltip */
    ".bw-wt-tip{position:fixed;z-index:9;max-width:240px;pointer-events:none;background:#1c211e;border:1px solid var(--card-line);padding:10px 13px;font-size:.78rem;line-height:1.45;color:var(--cream);opacity:0;transform:translateY(6px);transition:opacity .25s,transform .25s}",
    ".bw-wt-tip.show{opacity:1;transform:none}",
    ".bw-wt-tip b{display:block;font-size:.66rem;letter-spacing:.14em;text-transform:uppercase;color:var(--red);margin-bottom:3px}",
    /* svg helpers */
    ".bw-wt .maplabel{font-family:Montserrat,Arial,sans-serif;font-size:13px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;fill:var(--ink-faint)}",
    ".bw-wt .maplabel.big{font-size:15px;fill:var(--ink-dim)}",
    ".bw-wt .xlabel{font-family:Montserrat,Arial,sans-serif;font-size:11.5px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;fill:var(--ink-dim)}",
    ".bw-wt-xsec{pointer-events:none}.bw-wt-xsec.live{pointer-events:auto}",
    ".bw-wt-xsec .layer{cursor:pointer}.bw-wt-xsec .bw-wt-hit{fill:transparent;pointer-events:all}",
    ".bw-wt-xsec .layer:hover .xlabel,.bw-wt-xsec .layer.is-active .xlabel{fill:var(--yellow)}",
    ".bw-wt [data-el=fall],.bw-wt [data-el=tunnel],.bw-wt [data-el=tunnelLabel]{pointer-events:none}",
    ".bw-wt-step.strip .bw-wt-card{pointer-events:none}",
    ".bw-wt.xsec-live .lamp{animation:bwwt-lamp 2.6s ease-in-out infinite}",
    "@keyframes bwwt-lamp{0%,100%{opacity:.35}50%{opacity:.8}}",
    ".bw-wt.today-live .pulse{animation:bwwt-pulse 2s ease-out infinite;transform-origin:center;transform-box:fill-box}",
    "@keyframes bwwt-pulse{0%{opacity:.9;transform:scale(.6)}80%{opacity:0;transform:scale(2.4)}100%{opacity:0}}",
    ".bw-wt.fall-live .crowd-dot{animation:bwwt-march var(--dur) linear infinite;animation-delay:var(--del)}",
    "@keyframes bwwt-march{from{transform:translateX(0)}to{transform:translateX(760px)}}",
    "@media (prefers-reduced-motion:reduce){.bw-wt .crowd-dot,.bw-wt .lamp,.bw-wt .pulse{animation:none}.bw-wt-cue:after{animation:none}.bw-wt-card,.bw-wt-photo{transition:none}}",
    "@media (min-width:641px){.bw-wt-step:not(.hero):not(.cta){padding-top:64px}.bw-wt-step.up:not(.hero):not(.cta){padding-top:380px}}",
    "@media (max-width:640px){.bw-wt-step{padding:0 14px;align-items:flex-end;justify-content:center}.bw-wt-card{margin-bottom:12vh;max-width:100%}.bw-wt-step.hero,.bw-wt-step.cta{align-items:center}.bw-wt-step.hero .bw-wt-card,.bw-wt-step.cta .bw-wt-card{margin-bottom:0}.bw-wt-step.hero h1{font-size:clamp(2.2rem,11vw,4.2rem)}.bw-wt-rail{gap:10px}.bw-wt-rail button{width:8px;height:8px}.bw-wt-brand{width:clamp(108px,32vw,138px)}.bw-wt-sector-legend{top:78px;right:40px;grid-template-columns:1fr;gap:5px;font-size:.52rem}.bw-wt-cta-actions{flex-direction:column;align-items:stretch}.bw-wt-cta-actions .bw-wt-btn{width:100%;text-align:center}.bw-wt[data-chapter=strip] .bw-wt-stage svg,.bw-wt[data-chapter=escapes] .bw-wt-stage svg{transform:translateY(10vh) scale(.94);transform-origin:center center}.bw-wt-photo{width:42vw;max-width:190px}.bw-wt-photo-up{left:14px;bottom:8%}.bw-wt-photo-escapes{right:14px;top:17%}.bw-wt-photo-fall{right:14px;top:16%}.bw-wt-photo figcaption{font-size:.44rem}}"
  ].join('');

  var SVG = [
    '<svg viewBox="0 0 1000 640" preserveAspectRatio="xMidYMid meet" class="bw-wt-scene" aria-hidden="true">',
    '<defs>',
    '<path id="bwwt-ring" d="M 320,180 C 380,150 450,160 480,200 C 510,230 520,270 515,310 C 512,350 535,380 520,420 C 500,465 430,490 360,470 C 290,450 240,410 230,350 C 220,290 260,210 320,180 Z"/>',
    '<clipPath id="bwwt-clipWest"><use href="#bwwt-ring"/></clipPath>',
    '</defs>',
    '<g data-el="realMap" class="bw-wt-real-map" opacity="0"><g data-el="realView"></g></g>',
    // MAP
    '<g data-el="map">',
    '<path d="M 150,320 C 160,180 320,90 520,90 C 720,90 860,170 872,320 C 860,470 700,560 500,560 C 300,560 140,460 150,320 Z" fill="rgba(250,250,245,.035)" stroke="rgba(250,250,245,.14)" stroke-width="1.5"/>',
    '<path d="M 60,360 C 200,340 260,300 340,310 C 420,320 430,380 520,380 C 610,380 640,300 730,290 C 820,280 900,320 960,310" fill="none" stroke="rgba(120,160,190,.3)" stroke-width="7" stroke-linecap="round"/>',
    '<text class="maplabel" x="820" y="345">Spree</text>',
    '<g data-el="sectors" opacity="0">',
    '<g clip-path="url(#bwwt-clipWest)">',
    '<rect x="180" y="120" width="380" height="120" fill="rgba(124,179,66,.16)"/>',
    '<rect x="180" y="240" width="380" height="130" fill="rgba(250,250,245,.10)"/>',
    '<rect x="180" y="370" width="380" height="140" fill="rgba(255,230,0,.10)"/>',
    '</g>',
    '<text class="maplabel" x="300" y="212">French</text>',
    '<text class="maplabel" x="272" y="330">British</text>',
    '<text class="maplabel" x="300" y="440">American</text>',
    '<g><path d="M 520,95 C 715,95 855,175 868,320 C 856,465 700,556 505,558 C 560,470 570,420 540,380 C 585,360 590,300 560,250 C 545,215 530,140 520,95 Z" fill="rgba(230,57,70,.10)"/>',
    '<text class="maplabel big" x="640" y="200">Soviet sector</text></g>',
    '</g>',
    '<g data-el="airlift" opacity="0">',
    '<path data-el="arc1" d="M 40,140 Q 260,140 450,430" fill="none" stroke="rgba(250,250,245,.14)" stroke-width="1" stroke-dasharray="4 6"/>',
    '<path data-el="arc2" d="M 20,330 Q 240,320 450,430" fill="none" stroke="rgba(250,250,245,.14)" stroke-width="1" stroke-dasharray="4 6"/>',
    '<path data-el="arc3" d="M 60,540 Q 260,500 450,430" fill="none" stroke="rgba(250,250,245,.14)" stroke-width="1" stroke-dasharray="4 6"/>',
    '<circle data-el="pl1" r="5" fill="var(--yellow)"/><circle data-el="pl2" r="5" fill="var(--yellow)"/><circle data-el="pl3" r="5" fill="var(--yellow)"/>',
    '<circle cx="450" cy="430" r="7" fill="none" stroke="var(--yellow)" stroke-width="1.5"/>',
    '<text class="maplabel" x="416" y="458">Tempelhof</text>',
    '</g>',
    '<use data-el="ring" href="#bwwt-ring" fill="none" stroke="var(--red)" stroke-width="4" stroke-linecap="round" opacity="0"/>',
    '<text data-el="island" class="maplabel big" x="308" y="330" opacity="0">West Berlin</text>',
    '<g data-el="today" opacity="0">',
    '<use href="#bwwt-ring" fill="none" stroke="rgba(250,250,245,.5)" stroke-width="2.5" stroke-dasharray="2 9" stroke-linecap="round"/>',
    '<g><circle cx="455" cy="196" r="6" fill="var(--lime)"/><text class="maplabel" x="410" y="178">Bernauer Str.</text></g>',
    '<g><circle cx="513" cy="300" r="6" fill="var(--lime)"/><text class="maplabel" x="392" y="292">Brandenburg Gate</text></g>',
    '<g><circle cx="523" cy="362" r="6" fill="var(--lime)"/><text class="maplabel" x="540" y="380">Checkpoint Charlie</text></g>',
    '<g><circle cx="612" cy="392" r="6" fill="var(--lime)"/><text class="maplabel" x="630" y="412">East Side Gallery</text></g>',
    '<g><circle cx="598" cy="298" r="8" fill="var(--yellow)"/>',
    '<circle cx="598" cy="298" r="8" fill="none" stroke="var(--yellow)" stroke-width="2" class="pulse"/>',
    '<text class="maplabel big" x="614" y="286" style="fill:var(--yellow)">Alexanderplatz</text>',
    '<text class="maplabel" x="614" y="304">my tour starts here</text></g>',
    '</g>',
    '</g>',
    // CROSS-SECTION
    '<g data-el="xsec" class="bw-wt-xsec" opacity="0">',
    '<rect x="70" y="470" width="860" height="3" fill="rgba(250,250,245,.28)"/>',
    '<text class="maplabel big" x="95" y="516">East Berlin</text>',
    '<text class="maplabel big" x="828" y="516">West Berlin</text>',
    '<g class="layer" data-tip-t="Inner wall" data-tip="The first barrier an escaper had to beat, often the back wall of their own street.">',
    '<rect class="bw-wt-hit" x="90" y="350" width="95" height="135"/>',
    '<rect x="128" y="404" width="16" height="66" fill="var(--concrete)" opacity=".8"/><text class="xlabel" x="104" y="392">Inner wall</text></g>',
    '<g class="layer" data-tip-t="Signal fence" data-tip="Touch it and a silent alarm called the guards.">',
    '<rect class="bw-wt-hit" x="185" y="370" width="115" height="115"/>',
    '<line x1="238" y1="418" x2="238" y2="470" stroke="var(--ink-dim)" stroke-width="2"/><line x1="252" y1="418" x2="252" y2="470" stroke="var(--ink-dim)" stroke-width="2"/>',
    '<line x1="232" y1="428" x2="258" y2="428" stroke="var(--red)" stroke-width="1.5"/><line x1="232" y1="446" x2="258" y2="446" stroke="var(--red)" stroke-width="1.5"/>',
    '<text class="xlabel" x="206" y="404">Signal fence</text></g>',
    '<g class="layer" data-tip-t="Light strip" data-tip="The death strip stayed lit all night, every night.">',
    '<rect class="bw-wt-hit" x="300" y="355" width="125" height="130"/>',
    '<line x1="330" y1="410" x2="330" y2="470" stroke="var(--ink-dim)" stroke-width="2.5"/><circle cx="330" cy="406" r="9" fill="var(--yellow)" class="lamp"/>',
    '<line x1="392" y1="410" x2="392" y2="470" stroke="var(--ink-dim)" stroke-width="2.5"/><circle cx="392" cy="406" r="9" fill="var(--yellow)" class="lamp"/>',
    '<text class="xlabel" x="318" y="392">Lights</text></g>',
    '<g class="layer" data-tip-t="Watchtower" data-tip="Around 300 towers. Guards stood in pairs so neither could defect alone.">',
    '<rect class="bw-wt-hit" x="425" y="300" width="100" height="185"/>',
    '<rect x="466" y="382" width="18" height="88" fill="var(--concrete)" opacity=".85"/><rect x="452" y="352" width="46" height="32" fill="var(--concrete)"/>',
    '<rect x="459" y="360" width="12" height="10" fill="var(--night)"/><rect x="479" y="360" width="12" height="10" fill="var(--night)"/>',
    '<text class="xlabel" x="438" y="340">Watchtower</text></g>',
    '<g class="layer" data-tip-t="Dog run" data-tip="Leashed dogs patrolled along 100 m wires.">',
    '<rect class="bw-wt-hit" x="525" y="405" width="100" height="80"/>',
    '<line x1="540" y1="452" x2="612" y2="452" stroke="var(--ink-dim)" stroke-width="1.5" stroke-dasharray="5 4"/><circle cx="572" cy="459" r="5.5" fill="var(--red)"/>',
    '<text class="xlabel" x="540" y="438">Dog run</text></g>',
    '<g class="layer" data-tip-t="Control strip" data-tip="Raked sand that recorded every footprint.">',
    '<rect class="bw-wt-hit" x="625" y="405" width="110" height="80"/>',
    '<rect x="636" y="458" width="88" height="12" fill="rgba(255,230,0,.20)"/><line x1="640" y1="462" x2="720" y2="462" stroke="rgba(255,230,0,.4)" stroke-width="1"/>',
    '<line x1="640" y1="466" x2="720" y2="466" stroke="rgba(255,230,0,.4)" stroke-width="1"/><text class="xlabel" x="628" y="444">Raked sand</text></g>',
    '<g class="layer" data-tip-t="Vehicle trench" data-tip="Stopped anyone trying to drive through the strip.">',
    '<rect class="bw-wt-hit" x="735" y="430" width="80" height="95"/>',
    '<path d="M 748,470 L 758,486 L 778,486 L 788,470" fill="none" stroke="var(--ink-dim)" stroke-width="2"/><text class="xlabel" x="732" y="504">Trench</text></g>',
    '<g class="layer" data-tip-t="The Wall" data-tip="3.6 m of concrete with a smooth round pipe on top. Nothing to grip.">',
    '<rect class="bw-wt-hit" x="815" y="290" width="90" height="195"/>',
    '<rect x="838" y="358" width="26" height="112" fill="#cfd2cc"/><circle cx="851" cy="352" r="17" fill="#b9bcb6"/><text class="xlabel" x="822" y="322">The Wall</text></g>',
    '<path data-el="tunnel" d="M 180,506 C 350,540 650,540 880,502" fill="none" stroke="var(--yellow)" stroke-width="2.5" stroke-dasharray="6 5" opacity="0"/>',
    '<text data-el="tunnelLabel" class="xlabel" x="470" y="560" opacity="0" style="fill:var(--yellow)">Tunnel 57, dug for months in the dark</text>',
    '</g>',
    // FALL
    '<g data-el="fall" opacity="0">',
    '<rect x="70" y="470" width="860" height="3" fill="rgba(250,250,245,.28)"/>',
    '<g data-el="slabs"></g><g data-el="crowd"></g>',
    '<text class="maplabel big" x="95" y="516">East</text><text class="maplabel big" x="868" y="516">West</text>',
    '</g>',
    '</svg>'
  ].join('');

  function esc(v) {
    return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  var STEP_HTML = {
    hero: '<p class="bw-wt-eyebrow">Berlin, 1945 to 1990</p><h1>The <span>Wall</span></h1><p>One city. Twenty eight years apart. Scroll to watch Berlin split, survive and come back together.</p><div class="bw-wt-cue">Scroll</div>',
    sectors: '<p class="bw-wt-eyebrow">1945, the carve up</p><h2>Four armies, one city</h2><p>Berlin fell in May 1945 and the winners split it four ways: a Soviet sector in the east, American, British and French sectors in the west. The border ran through streets, cemeteries, even apartment blocks. Nobody planned for it to last.</p>',
    airlift: '<p class="bw-wt-eyebrow">1948, the blockade</p><h2>Supplied from the sky</h2><p>Stalin cut every road and rail line into West Berlin. For eleven months the city lived from the air, with a plane landing every 90 seconds at the peak. West Berlin held.</p><div class="bw-wt-chips"><div class="bw-wt-chip"><b>277,000</b><span>flights</span></div><div class="bw-wt-chip"><b>2.3M</b><span>tons of supplies</span></div><div class="bw-wt-chip"><b>11</b><span>months</span></div></div>',
    up: '<p class="bw-wt-eyebrow">August 13, 1961. One night.</p><h2>The city wakes up divided</h2><p>In the early hours of a Sunday, soldiers rolled out barbed wire along the sector line. By morning, 155 km of border sealed West Berlin in. Families on opposite sides waved from windows. It stayed that way for 28 years.</p><p class="bw-wt-hint">Keep scrolling. The Wall ran all the way around West Berlin.</p>',
    strip: '<p class="bw-wt-eyebrow">1961 to 1989, the system</p><h2>Not one wall. Two, with a killing zone between.</h2><p>What people call the Wall was a layered machine: an inner wall, signal fences, dog runs, raked sand that showed every footprint, watchtowers with orders to shoot.</p><p class="bw-wt-hint">Tap each layer in the diagram to see what it did.</p>',
    escapes: '<p class="bw-wt-eyebrow">1961 to 1989, the escapes</p><h2>Over, under, through</h2><p>People jumped from windows, swam the Spree, dug for months in the dark. Tunnel 57 alone brought 57 people out in two nights.</p><div class="bw-wt-chips"><div class="bw-wt-chip"><b><span data-el="c1">0</span>+</b><span>made it across</span></div><div class="bw-wt-chip"><b><span data-el="c2">0</span>+</b><span>died at the Wall</span></div><div class="bw-wt-chip"><b><span data-el="c3">0</span>+</b><span>tunnels dug</span></div></div>',
    fall: '<p class="bw-wt-eyebrow">November 9, 1989</p><h2>The night it fell</h2><p>A botched press conference, one sentence about travel being free "immediately", and thousands walked to the crossings. At 23:30 the gate at Bornholmer Strasse gave way. No shots. Just crowds, tears and hammers.</p>',
    today: '<p class="bw-wt-eyebrow">Today, what is left</p><h2>The Wall is gone. The line is not.</h2><p>A double row of cobblestones traces the old border through the city. You can stand at Bernauer Strasse where the death strip is preserved, or at the East Side Gallery where 1.3 km of Wall became a canvas. My tour starts at Alexanderplatz, in the heart of what was East Berlin.</p>',
    cta: '<h2>You scrolled 45 years.<br>Now stand where it happened.</h2><p>I run a free walking tour lasting 2 hours through the old heart of East Berlin. Real places, real stories. You pay what you think it was worth at the end.</p><div class="bw-wt-cta-actions"><a class="bw-wt-btn" href="' + esc(BOOK_URL) + '">Book the free tour</a><a class="bw-wt-btn bw-wt-btn-audio" href="' + esc(AUDIO_URL) + '">Hear Bernauer Strasse with my audio guide <span class="bw-wt-price">€4.99</span></a></div><p class="bw-wt-sub"><a href="' + esc(HOME_URL) + '">berlinwalk.com</a> &middot; @berlinwalkingtour</p>'
  };

  function upsertMeta(kind, key, content) {
    var el = document.head.querySelector('meta[' + kind + '="' + key + '"]');
    if (!el) { el = document.createElement('meta'); el.setAttribute(kind, key); document.head.appendChild(el); }
    el.setAttribute('content', content);
  }
  function upsertLink(rel, href) {
    var el = document.head.querySelector('link[rel="' + rel + '"]');
    if (!el) { el = document.createElement('link'); el.rel = rel; document.head.appendChild(el); }
    el.href = href;
  }
  function applySeoSafetyNet() {
    var path = location.pathname.replace(/\/+$/, '') || '/';
    var isFinal = /(^|\.)berlinwalk\.com$/i.test(location.hostname) && path === '/berlin-wall-timeline';
    var canonical = isFinal ? FINAL_URL : location.origin + path;
    document.title = isFinal ? SEO.title : 'The Berlin Wall Timeline | BerlinWalk';
    upsertMeta('name', 'description', SEO.description);
    upsertMeta('name', 'robots', isFinal ? 'index, follow, max-image-preview:large' : 'noindex, nofollow');
    upsertMeta('property', 'og:type', 'article');
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:title', SEO.socialTitle);
    upsertMeta('property', 'og:description', SEO.socialDescription);
    upsertMeta('property', 'og:image', SEO.image);
    upsertMeta('property', 'og:image:width', '1200');
    upsertMeta('property', 'og:image:height', '630');
    upsertMeta('property', 'og:image:alt', SEO.imageAlt);
    upsertMeta('property', 'og:site_name', 'BerlinWalk');
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', SEO.socialTitle);
    upsertMeta('name', 'twitter:description', SEO.socialDescription);
    upsertMeta('name', 'twitter:image', SEO.image);
    upsertMeta('name', 'twitter:image:alt', SEO.imageAlt);
    upsertLink('canonical', canonical);

    var old = document.getElementById('bw-wall-timeline-jsonld');
    if (old) old.remove();
    if (isFinal) {
      var s = document.createElement('script');
      s.id = 'bw-wall-timeline-jsonld';
      s.type = 'application/ld+json';
      s.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'The Berlin Wall Timeline, 1945 to 1990',
        description: SEO.description,
        image: SEO.image,
        url: FINAL_URL,
        author: { '@type': 'Organization', name: 'BerlinWalk', url: 'https://www.berlinwalk.com' },
        publisher: { '@type': 'Organization', name: 'BerlinWalk', url: 'https://www.berlinwalk.com' },
        about: 'Berlin Wall'
      });
      document.head.appendChild(s);
    }
  }

  var clamp = function (v) { return Math.max(0, Math.min(1, v)); };
  var ease = function (t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };

  class BWWallTimeline extends HTMLElement {
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
    }

    _render() {
      var steps = CHAPTERS.map(function (c) {
        return '<section class="bw-wt-step ' + c.key + ' bw-wt-h' + c.h + ' bw-wt-al-' + c.align + '" data-ch="' + c.key + '">'
          + '<div class="bw-wt-card">' + STEP_HTML[c.key] + '</div></section>';
      }).join('');

      this.innerHTML = '<style>' + CSS + '</style>'
        + '<div class="bw-wt">'
        + '<h1 class="bw-wt-sr-only">The Berlin Wall: a scrollable timeline from 1945 to 1990</h1>'
        + '<div class="bw-wt-scrolly">'
        + '<div class="bw-wt-stage-frame"><div class="bw-wt-stage">'
        + SVG
        + '<div class="bw-wt-photo-stack" aria-hidden="true">'
        + '<figure class="bw-wt-photo bw-wt-photo-up" data-photo="up"><img src="' + esc(BASE_URL + 'assets/photos/1961-wall-build.jpg') + '" alt=""><figcaption>Bundesarchiv, Bild 173-1321 / Helmut J. Wolf / CC BY-SA 3.0 DE</figcaption></figure>'
        + '<figure class="bw-wt-photo bw-wt-photo-escapes" data-photo="escapes"><img src="' + esc(BASE_URL + 'assets/photos/tunnel-57-marker.jpg') + '" alt=""><figcaption>Tony Webster / Wikimedia Commons / CC BY 2.0</figcaption></figure>'
        + '<figure class="bw-wt-photo bw-wt-photo-fall" data-photo="fall"><img src="' + esc(BASE_URL + 'assets/photos/1989-brandenburg-gate.jpg') + '" alt=""><figcaption>SSGT F. Lee Corkran / National Archives / public domain</figcaption></figure>'
        + '</div>'
        + '<div class="bw-wt-vignette"></div>'
        + '<div class="bw-wt-hud"><div class="bw-wt-year"><span class="bw-wt-tick">19</span>45</div><div class="bw-wt-chapter">A divided city</div></div>'
        + '<a class="bw-wt-brand" href="' + esc(HOME_URL) + '" aria-label="BerlinWalk home"><img src="' + esc(BASE_URL + 'assets/brand/berlinwalk-wordmark-cream.png') + '" alt=""></a>'
        + '<div class="bw-wt-sector-legend" role="group" aria-label="Occupation sectors">'
        + '<span class="french"><i></i>French sector</span><span class="british"><i></i>British sector</span>'
        + '<span class="american"><i></i>American sector</span><span class="soviet"><i></i>Soviet sector</span>'
        + '</div>'
        + '<nav class="bw-wt-rail" aria-label="Timeline chapters"></nav>'
        + '</div></div>'
        + '<div class="bw-wt-steps">' + steps + '</div>'
        + '</div>'
        + '<div class="bw-wt-tip" role="status"></div>'
        + '</div>';
    }

    _wire() {
      var self = this;
      var root = this.querySelector('.bw-wt');
      this._root = root;
      var q = function (sel) { return root.querySelector(sel); };
      var qa = function (sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); };

      this._steps = qa('.bw-wt-step');
      this._yearEl = q('.bw-wt-year');
      this._chapterEl = q('.bw-wt-chapter');
      this._stage = q('.bw-wt-stage');
      this._gMap = q('[data-el="map"]');
      this._gRealMap = q('[data-el="realMap"]');
      this._gRealView = q('[data-el="realView"]');
      this._realReady = false;
      this._gSectors = q('[data-el="sectors"]');
      this._gAirlift = q('[data-el="airlift"]');
      this._ring = q('[data-el="ring"]');
      this._island = q('[data-el="island"]');
      this._gToday = q('[data-el="today"]');
      this._gXsec = q('[data-el="xsec"]');
      this._gFall = q('[data-el="fall"]');
      this._tunnel = q('[data-el="tunnel"]');
      this._tunnelLabel = q('[data-el="tunnelLabel"]');
      this._photoUp = q('[data-photo="up"]');
      this._photoEscapes = q('[data-photo="escapes"]');
      this._photoFall = q('[data-photo="fall"]');
      this._tip = q('.bw-wt-tip');
      this._c1 = q('[data-el="c1"]'); this._c2 = q('[data-el="c2"]'); this._c3 = q('[data-el="c3"]');

      var ringDef = q('#bwwt-ring');
      this._ringLen = ringDef && ringDef.getTotalLength ? ringDef.getTotalLength() : 900;
      this._ring.style.strokeDasharray = this._ringLen;
      this._ring.style.strokeDashoffset = this._ringLen;

      this._arcs = [q('[data-el="arc1"]'), q('[data-el="arc2"]'), q('[data-el="arc3"]')];
      this._planes = [q('[data-el="pl1"]'), q('[data-el="pl2"]'), q('[data-el="pl3"]')];
      this._arcLens = this._arcs.map(function (a) { return a.getTotalLength(); });
      this._tunLen = this._tunnel.getTotalLength();
      this._layers = qa('.bw-wt-xsec .layer');

      // build fall slabs + crowd
      var NS = 'http://www.w3.org/2000/svg';
      var slabWrap = q('[data-el="slabs"]'), crowdWrap = q('[data-el="crowd"]');
      this._slabs = [];
      for (var i = 0; i < 13; i++) {
        var g = document.createElementNS(NS, 'g');
        var r = document.createElementNS(NS, 'rect');
        r.setAttribute('x', 190 + i * 48); r.setAttribute('y', 352);
        r.setAttribute('width', 44); r.setAttribute('height', 118);
        r.setAttribute('fill', i % 2 ? '#c9ccc6' : '#b7bab4');
        g.appendChild(r);
        g.style.transformOrigin = (190 + i * 48 + 44) + 'px 470px';
        slabWrap.appendChild(g);
        this._slabs.push(g);
      }
      for (var j = 0; j < 26; j++) {
        var c = document.createElementNS(NS, 'circle');
        c.setAttribute('class', 'crowd-dot');
        c.setAttribute('cx', 60 + Math.random() * 130);
        c.setAttribute('cy', 430 + Math.random() * 34);
        c.setAttribute('r', 3.6 + Math.random() * 2);
        c.setAttribute('fill', Math.random() < .3 ? 'var(--yellow)' : 'var(--cream)');
        c.style.setProperty('--dur', (5.5 + Math.random() * 4) + 's');
        c.style.setProperty('--del', (-Math.random() * 8) + 's');
        crowdWrap.appendChild(c);
      }

      // rail
      var rail = q('.bw-wt-rail');
      var railNames = CHAPTERS.map(function (c) { return c.name; });
      this._dots = this._steps.map(function (step, idx) {
        var b = document.createElement('button');
        b.type = 'button';
        b.title = railNames[idx];
        b.setAttribute('aria-label', railNames[idx]);
        b.addEventListener('click', function () {
          var absTop = step.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({ top: absTop + step.offsetHeight * 0.12, behavior: 'smooth' });
        });
        rail.appendChild(b);
        return b;
      });

      // card reveal
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('in'); });
      }, { threshold: 0.2 });
      qa('.bw-wt-card').forEach(function (card) { io.observe(card); });

      // tooltips
      var tip = this._tip, tipTimer = null;
      this._layers.forEach(function (l) {
        function show(ev) {
          tip.innerHTML = '<b>' + esc(l.getAttribute('data-tip-t')) + '</b>' + esc(l.getAttribute('data-tip'));
          var x = Math.min(window.innerWidth - 260, Math.max(10, (ev.clientX || window.innerWidth / 2) - 110));
          var y = Math.max(10, (ev.clientY || window.innerHeight / 2) - 96);
          tip.style.left = x + 'px'; tip.style.top = y + 'px';
          tip.classList.add('show');
          self._layers.forEach(function (layer) { layer.classList.toggle('is-active', layer === l); });
          clearTimeout(tipTimer);
          tipTimer = setTimeout(function () {
            tip.classList.remove('show');
            l.classList.remove('is-active');
          }, 3200);
        }
        l.addEventListener('pointerenter', show);
        l.addEventListener('pointerdown', show);
        l.addEventListener('pointerleave', function (ev) {
          if (ev.pointerType === 'touch') return;
          tip.classList.remove('show');
          l.classList.remove('is-active');
        });
      });

      // scroll loop
      var raf = null;
      this._onScroll = function () {
        if (raf) return;
        raf = requestAnimationFrame(function () { raf = null; self._update(); });
      };
      this._onResize = this._onScroll;
      window.addEventListener('scroll', this._onScroll, { passive: true });
      window.addEventListener('resize', this._onResize);

      // QA freeze hook: #bwqa=<scrollY> fakes a scroll offset via negative margin
      // (headless --screenshot captures page-top, not the scrolled viewport).
      if (location.hash.indexOf('#bwqa=') === 0) {
        var y = parseInt(location.hash.slice(6), 10);
        if (!isNaN(y)) {
          this._qa = y;
          root.style.marginTop = (-y) + 'px';
          qa('.bw-wt-card').forEach(function (card) { card.classList.add('in'); });
        }
      }
      this._update();
      this._loadRealMap();
    }

    _svg(name, attrs, text) {
      var NS = 'http://www.w3.org/2000/svg';
      var el = document.createElementNS(NS, name);
      Object.keys(attrs || {}).forEach(function (key) { el.setAttribute(key, attrs[key]); });
      if (text != null) el.textContent = text;
      return el;
    }

    _loadRealMap() {
      var self = this;
      fetch(BASE_URL + 'assets/map/map-data.json', { cache: 'force-cache' })
        .then(function (response) {
          if (!response.ok) throw new Error('Map data request failed: ' + response.status);
          return response.json();
        })
        .then(function (data) {
          self._buildRealMap(data);
          self._realData = data;
          self._realReady = true;
          self._root.setAttribute('data-map-state', 'ready');
          self._update();
        })
        .catch(function () {
          self._realReady = false;
          self._root.setAttribute('data-map-state', 'fallback');
        });
    }

    _buildRealMap(data) {
      var view = this._gRealView;
      while (view.firstChild) view.removeChild(view.firstChild);

      var base = this._svg('g', { class: 'bw-wt-real-base' });
      data.westBerlin.forEach(function (d) {
        base.appendChild(this._svg('path', { class: 'west-fill', d: d }));
      }, this);
      data.eastBerlin.forEach(function (d) {
        base.appendChild(this._svg('path', { class: 'east-fill', d: d }));
      }, this);
      var berlinBoundary = this._svg('g', { class: 'bw-wt-real-berlin-boundary' });
      data.westBerlin.concat(data.eastBerlin).forEach(function (d) {
        berlinBoundary.appendChild(this._svg('path', { d: d }));
      }, this);
      base.appendChild(berlinBoundary);
      base.appendChild(this._svg('text', { class: 'bw-wt-real-attribution', x: 22, y: 622 }, 'Map data © OpenStreetMap contributors · Wall data © Berlin Open Data'));
      view.appendChild(base);
      this._gRealBase = base;
      this._gRealBoundary = berlinBoundary;

      var sectors = this._svg('g', { class: 'bw-wt-real-sectors' });
      this._realSectorGroups = [];
      data.sectors.forEach(function (item, idx) {
        var group = this._svg('g', { class: 'bw-wt-real-sector-group', opacity: 0 });
        group.appendChild(this._svg('path', { class: 'bw-wt-real-sector', d: item.d, fill: item.fill }));
        var labelClass = 'bw-wt-real-sector-label' + (idx === 0 || idx === 1 || idx === 2 ? ' label-dark' : '');
        group.appendChild(this._svg('text', { class: labelClass, x: item.labelPoint[0], y: item.labelPoint[1] }, item.label));
        sectors.appendChild(group);
        this._realSectorGroups.push(group);
      }, this);
      view.appendChild(sectors);
      this._gRealSectors = sectors;

      var strip = this._svg('g', { class: 'bw-wt-real-strip-group', opacity: 0 });
      (data.wall.strip || []).forEach(function (d) {
        strip.appendChild(this._svg('path', { class: 'bw-wt-real-strip', d: d }));
      }, this);
      view.appendChild(strip);
      this._gRealStrip = strip;

      var wall = this._svg('g', { class: 'bw-wt-real-wall-group', opacity: 0 });
      (data.wall.political || []).forEach(function (d) {
        wall.appendChild(this._svg('path', { class: 'bw-wt-real-wall-political', d: d }));
      }, this);
      (data.wall.rear || []).forEach(function (d) {
        wall.appendChild(this._svg('path', { class: 'bw-wt-real-wall-rear', d: d }));
      }, this);
      this._realWallPaths = [];
      (data.wall.main || []).forEach(function (d) {
        var path = this._svg('path', { class: 'bw-wt-real-wall-main', d: d });
        wall.appendChild(path);
        this._realWallPaths.push(path);
      }, this);
      view.appendChild(wall);
      this._gRealWall = wall;
      this._realWallPaths.forEach(function (path) {
        var length = path.getTotalLength ? path.getTotalLength() : 1000;
        path.dataset.length = length;
        path.style.strokeDasharray = length + ' ' + length;
        path.style.strokeDashoffset = length;
      });

      var airlift = this._svg('g', { class: 'bw-wt-real-airlift', opacity: 0 });
      var arrival = {};
      var origins = [];
      data.airports.forEach(function (airport) {
        if (airport.role === 'arrival') arrival[airport.id] = airport;
        if (airport.role === 'origin') origins.push(airport);
      });
      var airTargets = ['tegel', 'gatow', 'tempelhof'];
      this._realAirPaths = [];
      this._realAirPlanes = [];
      origins.forEach(function (origin, index) {
        var target = arrival[airTargets[index]] || arrival.tempelhof;
        if (!target) return;
        var cx = (origin.x + target.x) / 2;
        var cy = Math.min(origin.y, target.y) - 100 - index * 28;
        var path = this._svg('path', { class: 'bw-wt-real-air-path', d: 'M ' + origin.x + ' ' + origin.y + ' Q ' + cx + ' ' + cy + ' ' + target.x + ' ' + target.y });
        airlift.appendChild(path);
        this._realAirPaths.push(path);
        for (var convoy = 0; convoy < 4; convoy++) {
          var plane = this._svg('path', {
            class: 'bw-wt-real-air-plane',
            d: 'M -6 0 L -1 -1.4 L 2 -5 L 3 -5 L 2 -1 L 6 0 L 2 1 L 3 5 L 2 5 L -1 1.4 Z',
            opacity: 0
          });
          airlift.appendChild(plane);
          this._realAirPlanes.push({
            path: path,
            plane: plane,
            offset: convoy * .022,
            scale: convoy === 0 ? 1.2 : .92
          });
        }
      }, this);
      data.airports.filter(function (a) { return a.role === 'arrival'; }).forEach(function (airport, index) {
        var pulse = this._svg('circle', { class: 'bw-wt-real-air-arrival-pulse', r: 9, cx: airport.x, cy: airport.y });
        pulse.style.setProperty('--pulse-delay', (-index * .55) + 's');
        airlift.appendChild(pulse);
        airlift.appendChild(this._svg('circle', { class: 'bw-wt-real-marker-start', r: 5, cx: airport.x, cy: airport.y }));
        airlift.appendChild(this._svg('text', { class: 'bw-wt-real-label', x: airport.x + 8, y: airport.y - 8 }, airport.name));
      }, this);
      view.appendChild(airlift);
      this._gRealAirlift = airlift;

      var escapes = this._svg('g', { class: 'bw-wt-real-escapes', opacity: 0 });
      var fall = this._svg('g', { class: 'bw-wt-real-fall', opacity: 0 });
      var pointByName = {};
      data.points.forEach(function (point) { pointByName[point.name] = point; });
      var bernauer = pointByName['Bernauer Straße'];
      var bornholmer = pointByName['Bornholmer Straße'];
      if (bernauer) {
        escapes.appendChild(this._svg('circle', { class: 'bw-wt-real-marker-story', r: 7, cx: bernauer.x, cy: bernauer.y }));
        escapes.appendChild(this._svg('text', { class: 'bw-wt-real-label', x: bernauer.x + 10, y: bernauer.y - 10 }, 'Tunnel 57 · Bernauer Straße'));
      }
      if (bornholmer) {
        fall.appendChild(this._svg('circle', { class: 'bw-wt-real-marker-story', r: 7, cx: bornholmer.x, cy: bornholmer.y }));
        fall.appendChild(this._svg('text', { class: 'bw-wt-real-label', x: bornholmer.x + 10, y: bornholmer.y - 10 }, 'Bornholmer Straße · 23:30'));
      }
      view.appendChild(escapes);
      view.appendChild(fall);
      this._gRealEscapes = escapes;
      this._gRealFall = fall;

      var today = this._svg('g', { class: 'bw-wt-real-today', opacity: 0 });
      (data.wall.main || []).forEach(function (d) {
        today.appendChild(this._svg('path', { class: 'bw-wt-real-today-line', d: d }));
      }, this);
      var todayNames = new Set(['Alexanderplatz', 'Brandenburg Gate', 'Checkpoint Charlie', 'East Side Gallery']);
      var renderedTodayNames = {};
      data.points.filter(function (point) { return point.group !== 'watchtowers' && todayNames.has(point.name); }).forEach(function (point) {
        if (renderedTodayNames[point.name]) return;
        renderedTodayNames[point.name] = true;
        var cls = point.name === 'Alexanderplatz' ? 'bw-wt-real-marker-start' : (point.group === 'story' ? 'bw-wt-real-marker-story' : 'bw-wt-real-marker');
        var radius = point.name === 'Alexanderplatz' ? 7 : (point.group === 'story' ? 5 : 4);
        today.appendChild(this._svg('circle', { class: cls, r: radius, cx: point.x, cy: point.y }));
        if (point.group === 'story' || point.group === 'tour_landmarks') {
          today.appendChild(this._svg('text', { class: 'bw-wt-real-label', x: point.x + 8, y: point.y - 8 }, point.name));
        }
      }, this);
      view.appendChild(today);
      this._gRealToday = today;
      this._realCameraTargets = pointByName;
    }

    _camera(name, scale, fallback) {
      var point = this._realCameraTargets && this._realCameraTargets[name];
      point = point || fallback || { x: 500, y: 320 };
      return { x: point.x, y: point.y, s: scale };
    }

    _lerpCamera(a, b, t) {
      return {
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
        s: a.s + (b.s - a.s) * t
      };
    }

    _realCameraFor(ci, p) {
      var full = { x: 500, y: 320, s: 1 };
      if (!this._realCameraTargets) return full;
      var west = this._camera('Tempelhof', 1.28, full);
      var central = this._camera('Checkpoint Charlie', 1.85, full);
      var bernauer = this._camera('Bernauer Straße', 2.35, central);
      var bornholmer = this._camera('Bornholmer Straße', 2.35, bernauer);
      var today = this._camera('Alexanderplatz', 1.35, central);
      if (ci === 2) return this._lerpCamera(full, west, ease(p));
      if (ci === 3) return this._lerpCamera(west, central, ease(p));
      if (ci === 4) return central;
      if (ci === 5) return this._lerpCamera(central, bernauer, ease(p));
      if (ci === 6) return this._lerpCamera(bernauer, bornholmer, ease(p));
      if (ci === 7) return this._lerpCamera(bornholmer, today, ease(p));
      if (ci === 8) return today;
      return full;
    }

    _updateRealMap(ci, p, mapO, sectO, airO, ringO, ringDraw, todayO, xsecO) {
      if (!this._realReady) return;
      var realMapO = 0;
      if (ci === 0) realMapO = .68 + .18 * ease(p);
      if (ci === 1) realMapO = .96;
      if (ci === 2) realMapO = .96;
      if (ci === 3) realMapO = 1;
      if (ci === 4) realMapO = .12 * (1 - p);
      if (ci === 5) realMapO = .34 * (1 - clamp(p * 1.15));
      if (ci === 6) realMapO = .18 * (1 - p);
      if (ci === 7) realMapO = .9;
      if (ci === 8) realMapO = .68;

      this._gRealMap.setAttribute('opacity', realMapO.toFixed(3));
      this._gRealView.setAttribute('transform', (function (camera) {
        return 'translate(' + (500 - camera.x * camera.s).toFixed(1) + ' ' + (320 - camera.y * camera.s).toFixed(1) + ') scale(' + camera.s.toFixed(3) + ')';
      })(this._realCameraFor(ci, p)));
      var sectorOpacity = ci === 1 ? 1 : (ci === 2 ? .35 : 0);
      this._gRealSectors.setAttribute('opacity', sectorOpacity.toFixed(3));
      this._realSectorGroups.forEach(function (group, idx) {
        var reveal = ci === 1 ? clamp((p - idx * .14) / .18) : (ci >= 2 ? 1 : 0);
        group.setAttribute('opacity', reveal.toFixed(3));
      });

      this._gRealAirlift.setAttribute('opacity', ((ci === 2 || (ci === 3 && p < .42)) ? airO : 0).toFixed(3));
      this._realAirPlanes.forEach(function (item) {
        var length = item.path.getTotalLength ? item.path.getTotalLength() : 1000;
        // Keep the convoy moving through most of the chapter. The old
        // near-arrival range made the planes appear to stop almost at once.
        var f = Math.min(.998, .56 + item.offset + p * .38);
        var point = item.path.getPointAtLength(length * f);
        var next = item.path.getPointAtLength(length * Math.min(.999, f + .012));
        var angle = Math.atan2(next.y - point.y, next.x - point.x) * 180 / Math.PI;
        item.plane.setAttribute('transform', 'translate(' + point.x.toFixed(1) + ' ' + point.y.toFixed(1) + ') rotate(' + angle.toFixed(1) + ') scale(' + item.scale + ')');
        item.plane.setAttribute('opacity', airO > .05 ? 1 : 0);
      });

      this._gRealWall.setAttribute('opacity', (ci >= 3 && ci <= 4 ? ringO : 0).toFixed(3));
      this._realWallPaths.forEach(function (path) {
        var length = Number(path.dataset.length || 1000);
        path.style.strokeDashoffset = String(length * (1 - (ci >= 4 ? 1 : ringDraw)));
      });
      this._gRealStrip.setAttribute('opacity', (ci === 4 ? xsecO : (ci === 5 ? .4 : 0)).toFixed(3));
      this._gRealEscapes.setAttribute('opacity', (ci === 5 ? clamp((p - .05) * 10) * (1 - clamp((p - .82) * 5)) : 0).toFixed(3));
      this._gRealFall.setAttribute('opacity', (ci === 6 ? clamp((p - .06) * 8) * (1 - clamp((p - .7) * 3)) : 0).toFixed(3));
      this._gRealToday.setAttribute('opacity', todayO.toFixed(3));
    }

    _yearFor(ci, p) {
      switch (ci) {
        case 0: return 1945;
        case 1: return 1945 + p * 3;
        case 2: return 1948 + p;
        case 3: return 1961;
        case 4: return 1961 + p * 10;
        case 5: return 1971 + p * 17;
        case 6: return 1989;
        case 7: return 1990 + p * 36;
        default: return 2026;
      }
    }

    _update() {
      var vh = window.innerHeight || 1;
      var marker = vh * 0.55;
      var rects = this._steps.map(function (s) { return s.getBoundingClientRect(); });
      var ci = 0;
      for (var i = 0; i < rects.length; i++) { if (rects[i].top <= marker) ci = i; }
      var r = rects[ci];
      var p = clamp((marker - r.top) / (r.height || 1));
      var root = this._root;
      var rootRect = root.getBoundingClientRect();
      var stageMode = rootRect.top <= 0 && rootRect.bottom >= vh ? 'fixed' : 'absolute';
      if (this._stageMode !== stageMode) {
        this._stageMode = stageMode;
        if (stageMode === 'fixed') {
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
      root.setAttribute('data-chapter', CHAPTERS[ci].key);

      // hud
      var yr = Math.floor(this._yearFor(ci, p));
      this._yearEl.innerHTML = '<span class="bw-wt-tick">' + String(yr).slice(0, 2) + '</span>' + String(yr).slice(2);
      this._chapterEl.textContent = CHAPTERS[ci].name;
      this._dots.forEach(function (d, idx) { d.classList.toggle('on', idx === ci); });

      var mapO = 0, sectO = 0, airO = 0, ringDraw = 0, ringO = 0, islO = 0, todayO = 0, xsecO = 0, fallO = 0;
      var photoUpO = 0, photoEscapesO = 0, photoFallO = 0;
      if (ci === 0) { mapO = .35 + .45 * ease(p); }
      if (ci === 1) { mapO = .9; sectO = ease(clamp(p * 1.6)); }
      if (ci === 2) { mapO = .9; sectO = 1 - clamp((p - .6) * 3); airO = 1; }
      // Let the convoy hold over the next scene, then cut it cleanly instead
      // of fading it away while the Wall line takes over.
      if (ci === 3) { mapO = 1; airO = p < .42 ? 1 : 0; ringO = 1; ringDraw = ease(clamp((p - .06) / .7)); islO = clamp((p - .55) * 4); }
      if (ci === 4) { ringO = 1; ringDraw = 1; mapO = 1 - clamp(p * 3.2); xsecO = ease(clamp((p - .12) * 2.4)); }
      if (ci === 5) { xsecO = 1; }
      if (ci === 6) { xsecO = 1 - clamp(p * 5); fallO = ease(clamp((p - .1) * 2.5)); }
      if (ci === 7) { fallO = 1 - clamp(p * 4); mapO = ease(clamp((p - .1) * 2)); todayO = ease(clamp((p - .2) * 1.8)); }
      if (ci === 8) { mapO = .5; todayO = 1; }

      if (ci === 3) photoUpO = clamp((p - .14) / .22) * (1 - clamp((p - .82) / .18));
      if (ci === 5) photoEscapesO = clamp((p - .12) / .2) * (1 - clamp((p - .84) / .16));
      if (ci === 6) photoFallO = clamp((p - .12) / .2) * (1 - clamp((p - .86) / .14));

      this._gMap.setAttribute('opacity', (this._realReady ? mapO * .015 : mapO).toFixed(3));
      this._gSectors.setAttribute('opacity', sectO.toFixed(3));
      this._gAirlift.setAttribute('opacity', airO.toFixed(3));
      this._gToday.setAttribute('opacity', todayO.toFixed(3));
      this._gXsec.setAttribute('opacity', xsecO.toFixed(3));
      this._gFall.setAttribute('opacity', fallO.toFixed(3));
      [[this._photoUp, photoUpO], [this._photoEscapes, photoEscapesO], [this._photoFall, photoFallO]].forEach(function (entry) {
        if (!entry[0]) return;
        entry[0].style.opacity = entry[1].toFixed(3);
        entry[0].style.transform = entry[1] > 0.01 ? 'translateY(0)' : 'translateY(18px)';
      });
      this._gXsec.classList.toggle('live', xsecO > .5 && (ci === 4 || ci === 5));

      this._ring.setAttribute('opacity', ci >= 3 ? ringO : 0);
      this._ring.style.strokeDashoffset = this._ringLen * (1 - ringDraw);
      this._island.setAttribute('opacity', islO.toFixed(3));

      if (airO > 0.05) {
        for (var k = 0; k < 3; k++) {
          var f = (p * 2.2 + k * .33) % 1;
          var pt = this._arcs[k].getPointAtLength(this._arcLens[k] * f);
          this._planes[k].setAttribute('cx', pt.x); this._planes[k].setAttribute('cy', pt.y);
          this._planes[k].setAttribute('opacity', 1);
        }
      } else { this._planes.forEach(function (pl) { pl.setAttribute('opacity', 0); }); }

      if (ci === 4) {
        this._layers.forEach(function (l, idx) {
          var o = clamp((p - (0.2 + idx * 0.075)) / 0.09);
          l.setAttribute('opacity', o.toFixed(3));
          l.style.transform = 'translateY(' + ((1 - o) * 12).toFixed(1) + 'px)';
        });
        this._tunnel.setAttribute('opacity', 0); this._tunnelLabel.setAttribute('opacity', 0);
      }
      if (ci === 5) {
        this._layers.forEach(function (l) { l.setAttribute('opacity', 1); l.style.transform = ''; });
        var qv = clamp((p - .15) / .5), e = ease(qv);
        this._tunnel.setAttribute('opacity', (e * .9).toFixed(3));
        this._tunnel.style.strokeDasharray = this._tunLen; this._tunnel.style.strokeDashoffset = this._tunLen * (1 - e);
        this._tunnelLabel.setAttribute('opacity', clamp((qv - .6) * 3).toFixed(3));
        this._c1.textContent = Math.round(5000 * e).toLocaleString('en-US');
        this._c2.textContent = Math.round(140 * e);
        this._c3.textContent = Math.round(70 * e);
      }

      if (ci === 6) {
        this._slabs.forEach(function (s, idx) {
          var order = (idx * 7) % 13;
          var f = ease(clamp((p - (0.12 + order * 0.045)) / 0.22));
          s.style.transform = 'rotate(' + (f * 84) + 'deg)';
          s.style.opacity = String(1 - f * .55);
        });
      }

      root.classList.toggle('reunited', ci > 6 || (ci === 6 && p > .5));
      root.classList.toggle('xsec-live', ci === 4 || ci === 5);
      root.classList.toggle('fall-live', ci === 6);
      root.classList.toggle('today-live', ci === 7 || ci === 8);
      root.classList.toggle('airlift-live', ci === 2 || (ci === 3 && p < .42));

      this._updateRealMap(ci, p, mapO, sectO, airO, ringO, ringDraw, todayO, xsecO);
      this._stage.style.opacity = ci === 8 ? String(1 - clamp((p - .1) * 1.2) * .75) : '1';
    }
  }

  if (!customElements.get(TAG)) {
    try { customElements.define(TAG, BWWallTimeline); }
    catch (e) { if (window && window.console) window.console.warn('bw-wall-timeline define failed', e); }
  }
})();
