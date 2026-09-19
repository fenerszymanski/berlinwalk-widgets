const BW_HOME_TWO_DOORS_SCRIPT_URL = (document.currentScript && document.currentScript.src)
  || 'https://fenerszymanski.github.io/berlinwalk-widgets/home-two-doors/home-two-doors-element.js';
const BW_HOME_TWO_DOORS_ASSET_BASE = new URL('./assets/', BW_HOME_TWO_DOORS_SCRIPT_URL).href;
const BW_HOME_TWO_DOORS_FONT_BASE = new URL('../home-products/assets/fonts/', BW_HOME_TWO_DOORS_SCRIPT_URL).href;
const BW_HOME_TWO_DOORS_CSS_URL = new URL('./home-two-doors-live.css', BW_HOME_TWO_DOORS_SCRIPT_URL).href;

const BW_HOME_TWO_DOORS_BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
const BW_HOME_TWO_DOORS_AUDIO_HUB_URL = 'https://www.berlinwalk.com/audio-tours';
const BW_HOME_TWO_DOORS_REVIEWS_URL = 'https://www.freetour.com/company/97387';
const BW_HOME_TWO_DOORS_TRIO_URL = 'https://www.berlinwalk.com/products/berlin-audio-trio-bundle';
const BW_HOME_TWO_DOORS_REVIEWS_API = 'https://www.berlinwalk.com/_functions/listReviews?limit=100';

const BW_HOME_TWO_DOORS_WALKS = [
  {
    slug: 'berlin-wall',
    title: 'Berlin Wall',
    eyebrow: 'DIVIDED CITY',
    text: 'The Wall, escape stories and divided lives.',
    duration: '75–100 min',
    route: 'Nordbahnhof → Mauerpark',
    sampleDuration: 45,
    sampleLabel: 'Berlin Wall · 45-second sample',
    sampleSrc: 'https://app.berlinwalk.com/assets/death-strip-audio-route/preview/chapel-v2-45.m4a',
    href: 'https://www.berlinwalk.com/products/death-strip-audio-route',
    image: 'card-berlin-wall.jpg',
    alt: 'A section of the Berlin Wall beside a Berlin street',
  },
  {
    slug: 'hidden-berlin',
    title: 'Hidden Berlin',
    eyebrow: 'LOST PLACES',
    text: 'Lost places. Unexpected stories.',
    duration: 'Two walks: 50–65 / 80–100 min',
    route: 'Anhalter Bahnhof / Friedrichstraße',
    sampleDuration: 42,
    sampleLabel: 'Hidden Berlin · 42-second sample',
    sampleSrc: 'https://app.berlinwalk.com/assets/hidden-berlin-audio-route/preview/anhalter-v2-42.m4a',
    href: 'https://www.berlinwalk.com/products/hidden-berlin-audio-route',
    image: 'card-hidden-berlin.jpg',
    alt: 'The surviving entrance hall of Anhalter Bahnhof in Berlin',
  },
  {
    slug: 'medieval-berlin',
    title: 'Medieval Berlin',
    eyebrow: 'THE CITY BEGINS',
    text: 'Discover where Berlin began.',
    duration: 'Explore at your own pace',
    route: 'World Clock → Museum Island',
    sampleDuration: 45,
    sampleLabel: 'Medieval Berlin · 45-second sample',
    sampleSrc: 'https://app.berlinwalk.com/assets/medieval-berlin-audio-tour/preview/01-alexanderplatz-v2-proof-45.m4a',
    href: 'https://www.berlinwalk.com/products/medieval-berlin-audio-tour',
    image: 'card-medieval-berlin.jpg',
    alt: 'St. Mary’s Church with the Berlin TV Tower behind it',
  },
];

const BW_HOME_TWO_DOORS_MORE_PRODUCTS = [
  {
    label: 'PLAN',
    title: 'Berlin Trip Planner',
    price: 'From €7.99',
    image: 'more-trip-planner.jpg',
    alt: 'Illustrated view of Berlin Cathedral and the River Spree',
    text: 'Build a realistic day around your dates, hotel area and pace.',
    href: 'https://www.berlinwalk.com/berlin-trip-planner',
  },
  {
    label: 'ARRIVE',
    title: 'First-Day Rescue Plan',
    price: '€4.99',
    image: 'more-first-day.jpg',
    alt: 'Platforms and signs inside Berlin Hauptbahnhof',
    text: 'Know what to do between landing, check-in and your first Berlin evening.',
    href: 'https://www.berlinwalk.com/products/berlin-first-day-rescue-plan',
  },
  {
    label: 'LOOK CLOSER',
    title: 'Hidden Berlin Photo Missions',
    price: '€3.99',
    image: 'more-photo-missions.jpg',
    alt: 'The surviving portico of Anhalter Bahnhof',
    text: 'Small prompts for noticing places such as Anhalter Bahnhof differently.',
    href: 'https://www.berlinwalk.com/products/hidden-berlin-photo-missions',
  },
  {
    label: 'TOOLS',
    title: 'Berlin Tools',
    price: 'Free',
    image: 'more-tools.webp',
    alt: 'Map and phone for planning a walk through Berlin',
    text: 'Practical calculators and decision helpers for a day in the city.',
    href: 'https://www.berlinwalk.com/berlin-tools',
  },
];

function bwHomeTwoDoorsFormatTime(seconds) {
  const safeSeconds = Number.isFinite(seconds) && seconds >= 0 ? Math.round(seconds) : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
}

function bwHomeTwoDoorsAnalyticsConsent() {
  try {
    const manager = window.consentPolicyManager;
    const response = manager && typeof manager.getCurrentConsentPolicy === 'function'
      ? manager.getCurrentConsentPolicy()
      : null;
    const policy = response && response.policy ? response.policy : response;
    return policy && policy.analytics === true;
  } catch (_error) {
    return false;
  }
}

function bwHomeTwoDoorsSafeValue(value, maxLength = 80) {
  return typeof value === 'string' ? value.slice(0, maxLength) : '';
}

function bwHomeTwoDoorsTrack(eventName, details = {}) {
  if (!bwHomeTwoDoorsAnalyticsConsent()) return false;

  const allowedKeys = ['surface', 'placement', 'cardId', 'cardType', 'ctaId', 'sampleId', 'action'];
  const payload = {
    event: bwHomeTwoDoorsSafeValue(eventName, 80),
    component: 'home_two_doors',
  };

  allowedKeys.forEach((key) => {
    const value = bwHomeTwoDoorsSafeValue(details[key]);
    if (value) payload[key] = value;
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

function bwHomeTwoDoorsPlayerMarkup(walk, idPrefix) {
  const playerId = `bw-${idPrefix}-${walk.slug}`;
  const isHero = idPrefix === 'hero';
  const label = isHero ? `${walk.sampleDuration}-second sample` : 'Listen to sample';
  const sub = isHero ? `Play ${walk.title}` : 'Listen before you choose';
  return `
    <div class="bw-home-two-doors__sample" data-bw-audio-player data-sample-id="${playerId}" data-sample-title="${walk.title}" data-sample-duration="${walk.sampleDuration}">
      <button class="bw-home-two-doors__sample-play" type="button" data-bw-audio-play aria-controls="${playerId}-audio" aria-label="Play ${walk.title} sample">
        <span class="bw-home-two-doors__sample-icon" aria-hidden="true">▶</span>
        <span class="bw-home-two-doors__sr-only">Play ${walk.title} sample</span>
      </button>
      <span class="bw-home-two-doors__sample-copy">
        <span class="bw-home-two-doors__sample-label">${label}</span>
        <span class="bw-home-two-doors__sample-sub">${sub}</span>
      </span>
      <input class="bw-home-two-doors__sample-seek" type="range" min="0" max="${walk.sampleDuration}" value="0" step="1" data-bw-audio-seek aria-label="Seek ${walk.title} sample">
      <span class="bw-home-two-doors__sample-time" data-bw-audio-time>0:00 / ${bwHomeTwoDoorsFormatTime(walk.sampleDuration)}</span>
      <audio class="bw-home-two-doors__sample-audio" id="${playerId}-audio" preload="metadata" src="${walk.sampleSrc}" aria-label="${walk.title} audio sample"></audio>
      <span class="bw-home-two-doors__sample-status" role="status" aria-live="polite" data-bw-audio-status></span>
    </div>`;
}

class BWHomeTwoDoorsElement extends HTMLElement {
  connectedCallback() {
    if (this.dataset.bwRendered === 'true') {
      this._bindImpressions();
      this._startReviewRotation();
      return;
    }
    this.dataset.bwRendered = 'true';
    this._ensureStyles();
    this._render();
    this._bindCtas();
    this._bindAudioPlayers();
    this._loadReviews();
    this._bindImpressions();
  }

  disconnectedCallback() {
    this._audioCards?.forEach(({ audio }) => audio.pause());
    this._impressionObserver?.disconnect();
    this._impressionTimers?.forEach((timer) => window.clearTimeout(timer));
    this._consentEvents?.forEach((eventName) => window.removeEventListener(eventName, this._consentHandler));
    document.removeEventListener('visibilitychange', this._visibilityHandler);
    this._reviewRequest?.abort();
    this._reviewObserver?.disconnect();
    this._stopReviewRotation();
    document.removeEventListener('visibilitychange', this._reviewVisibilityHandler);
  }

  _ensureStyles() {
    if (document.querySelector('link[data-bw-home-two-doors-css]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = BW_HOME_TWO_DOORS_CSS_URL;
    link.dataset.bwHomeTwoDoorsCss = 'true';
    document.head.appendChild(link);
  }

  _render() {
    const asset = (fileName) => `${BW_HOME_TWO_DOORS_ASSET_BASE}${fileName}`;
    const walkCards = BW_HOME_TWO_DOORS_WALKS.map((walk, index) => `
      <article class="bw-home-two-doors__walk-card" data-bw-home-card="audio_${walk.slug}" data-bw-card-type="audio-walk" data-bw-placement="audio-shelf">
        <div class="bw-home-two-doors__walk-ph">
          <img src="${asset(walk.image)}" alt="${walk.alt}" loading="lazy" width="1400" height="933">
          <span class="bw-home-two-doors__chip bw-home-two-doors__chip--yellow bw-home-two-doors__walk-num">0${index + 1}</span>
          <span class="bw-home-two-doors__walk-price">€9.90</span>
        </div>
        <div class="bw-home-two-doors__walk-body">
          <span class="bw-home-two-doors__eyebrow">${walk.eyebrow}</span>
          <h3>${walk.title}</h3>
          <p class="bw-home-two-doors__walk-promise">${walk.text}</p>
          <ul class="bw-home-two-doors__walk-meta">
            <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z"></path><circle cx="12" cy="10" r="2.2"></circle></svg>${walk.route}</li>
            <li><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"></circle><path d="M12 7v5l3.2 2"></path></svg>${walk.duration}</li>
          </ul>
          ${bwHomeTwoDoorsPlayerMarkup(walk, 'shelf')}
          <div class="bw-home-two-doors__walk-foot">
            <a class="bw-home-two-doors__btn bw-home-two-doors__btn--green bw-home-two-doors__btn--sm" href="${walk.href}" data-bw-cta-id="audio_${walk.slug}" data-bw-cta-placement="audio-shelf">Open walk</a>
            <a class="bw-home-two-doors__link" href="${BW_HOME_TWO_DOORS_AUDIO_HUB_URL}" data-bw-cta-id="audio_hub_${walk.slug}" data-bw-cta-placement="audio-shelf">All audio walks</a>
          </div>
        </div>
      </article>`).join('');

    const moreCards = BW_HOME_TWO_DOORS_MORE_PRODUCTS.map((product) => `
      <a class="bw-home-two-doors__more-card" href="${product.href}" data-bw-cta-id="more_${product.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}" data-bw-cta-placement="more-products">
        <img class="bw-home-two-doors__more-thumb" src="${asset(product.image)}" alt="${product.alt}" loading="lazy" width="600" height="360">
        <span class="bw-home-two-doors__eyebrow">${product.label}</span>
        <b>${product.title}</b>
        <span>${product.text}</span>
        <span class="bw-home-two-doors__more-price">${product.price}</span>
        <span class="bw-home-two-doors__more-cta">${product.label === 'TOOLS' ? 'Explore free tools' : 'Explore this product'} →</span>
      </a>`).join('');

    this.innerHTML = `
      <div class="bw-home-two-doors" id="bw-home-two-doors" ${this.hasAttribute('embedded') ? '' : 'role="main"'}>
        <section class="bw-home-two-doors__doors-title" aria-labelledby="bw-home-two-doors-title">
          <div class="bw-home-two-doors__wrap">
            <h1 id="bw-home-two-doors-title">One guide. <em>Two ways</em> to walk Berlin.</h1>
            <p>Walk with me on the free tour, or take one of my audio walks on your own phone.</p>
          </div>
        </section>

        <section class="bw-home-two-doors__wrap bw-home-two-doors__doors" aria-label="Choose how to explore Berlin">
          <article class="bw-home-two-doors__door bw-home-two-doors__door--live" data-bw-home-card="live_tour" data-bw-card-type="live-tour" data-bw-placement="hero">
            <img class="bw-home-two-doors__background" src="${asset('tour-altes-museum.webp')}" alt="Yusuf explaining Berlin history to guests outside the Altes Museum" width="1600" height="900">
            <span class="bw-home-two-doors__scrim" aria-hidden="true"></span>
            <span class="bw-home-two-doors__chip bw-home-two-doors__chip--yellow bw-home-two-doors__corner">LIVE · FREE · TIP-BASED</span>
            <span class="bw-home-two-doors__eyebrow bw-home-two-doors__eyebrow--dark">FREE BERLIN WALKING TOUR</span>
            <h2>Walk <em>with me.</em></h2>
            <p>About 2 hours, 12 stops, World Clock to Hackescher Markt. Reserve a free spot and tip what it was worth at the end.</p>
            <div class="bw-home-two-doors__door-actions">
              <a class="bw-home-two-doors__btn bw-home-two-doors__btn--yellow" href="${BW_HOME_TWO_DOORS_BOOKING_URL}" data-bw-cta-id="book_live_tour" data-bw-cta-placement="hero-live">Book a free spot</a>
              <a class="bw-home-two-doors__link bw-home-two-doors__link--light" href="#live-route" data-bw-cta-id="learn_live_route" data-bw-cta-placement="hero-live">Route &amp; meeting point</a>
            </div>
            <div class="bw-home-two-doors__door-meta">
              <span class="bw-home-two-doors__chip">12 stops · ~2 hours</span>
              <span class="bw-home-two-doors__chip">9.8 / 10 on FreeTour</span>
            </div>
          </article>

          <article class="bw-home-two-doors__door bw-home-two-doors__door--audio" data-bw-home-card="audio_door" data-bw-card-type="audio-door" data-bw-placement="hero">
            <div class="bw-home-two-doors__audio-image">
              <img src="${asset('phone-bernauer.jpg')}" alt="A phone showing the Berlin Wall audio walk above the former border strip" width="1467" height="1072">
              <span class="bw-home-two-doors__chip bw-home-two-doors__chip--yellow bw-home-two-doors__corner-right">TRIO · €24.90</span>
            </div>
            <div class="bw-home-two-doors__audio-copy">
              <span class="bw-home-two-doors__eyebrow">AUDIO WALKS · €9.90 EACH · NO APP</span>
              <h2>Or take <em>my walk</em> with you.</h2>
              <p>Three audio walks I researched and wrote: Berlin Wall, Hidden Berlin and Medieval Berlin. In your phone’s browser, any hour you like.</p>
              ${bwHomeTwoDoorsPlayerMarkup(BW_HOME_TWO_DOORS_WALKS[0], 'hero')}
              <div class="bw-home-two-doors__door-actions">
                <a class="bw-home-two-doors__btn bw-home-two-doors__btn--green" href="${BW_HOME_TWO_DOORS_AUDIO_HUB_URL}" data-bw-cta-id="open_audio_hub" data-bw-cta-placement="hero-audio">Explore audio walks</a>
              </div>
            </div>
          </article>
        </section>

        <section class="bw-home-two-doors__section" id="compare" data-bw-home-card="compare" data-bw-card-type="comparison" data-bw-placement="compare">
          <div class="bw-home-two-doors__wrap">
            <div class="bw-home-two-doors__section-head">
              <div>
                <span class="bw-home-two-doors__eyebrow"><span class="bw-home-two-doors__dot"></span>Choose your pace</span>
                <h2>Same guide, different kind of walk.</h2>
              </div>
              <p class="bw-home-two-doors__lead">Both options start with a real place in Berlin. The difference is whether you want a conversation or a route you can pause.</p>
            </div>
            <div class="bw-home-two-doors__compare">
              <div class="bw-home-two-doors__compare-row">
                <div></div><div><h3>Live tour</h3></div><div><h3>Audio walk</h3></div>
              </div>
              <div class="bw-home-two-doors__compare-row">
                <div>WHEN &amp; WHERE</div>
                <div><b>A booked start time.</b><br>Meet at the World Clock. About 2 hours through the historic centre.</div>
                <div><b>Your own start time.</b><br>Choose a route and start at its meeting point. Pause whenever you like.</div>
              </div>
              <div class="bw-home-two-doors__compare-row">
                <div>PRICE</div>
                <div><b>Free to book.</b><br>Choose your tip at the end of the walk.</div>
                <div><b>€9.90 per walk.</b><br>Berlin Wall + Hidden Berlin + Medieval Berlin: €24.90 as a trio.</div>
              </div>
              <div class="bw-home-two-doors__compare-row">
                <div>HOW IT WORKS</div>
                <div><b>Walk with me.</b><br>Bring your questions and comfortable shoes.</div>
                <div><b>Listen on your phone.</b><br>Recorded stories I researched and wrote. Bring headphones; no app needed. Audio download + PDF route guide included.</div>
              </div>
            </div>
            <div class="bw-home-two-doors__compare-mobile" aria-label="Compare live and audio walks">
              <article class="bw-home-two-doors__choice-card bw-home-two-doors__choice-card--live">
                <span class="bw-home-two-doors__choice-type">WITH YOUR GUIDE</span>
                <h3>Live tour</h3>
                <p class="bw-home-two-doors__choice-summary">A shared walk where you can ask questions.</p>
                <dl>
                  <div><dt>When</dt><dd>A booked start time · about 2 hours</dd></div>
                  <div><dt>Where</dt><dd>Meet me at the World Clock</dd></div>
                  <div><dt>Price</dt><dd>Free to book · tip at the end</dd></div>
                </dl>
                <a href="${BW_HOME_TWO_DOORS_BOOKING_URL}" data-bw-cta-id="book_compare_mobile" data-bw-cta-placement="compare">Check live dates →</a>
              </article>
              <article class="bw-home-two-doors__choice-card bw-home-two-doors__choice-card--audio">
                <span class="bw-home-two-doors__choice-type">ON YOUR OWN PHONE</span>
                <h3>Audio walk</h3>
                <p class="bw-home-two-doors__choice-summary">A story you can start, pause and continue at your pace.</p>
                <dl>
                  <div><dt>When</dt><dd>Start whenever you are ready</dd></div>
                  <div><dt>Where</dt><dd>Choose the Berlin Wall, Hidden Berlin or Medieval Berlin route</dd></div>
                  <div><dt>Price</dt><dd>€9.90 per walk · all three €24.90</dd></div>
                </dl>
                <a href="${BW_HOME_TWO_DOORS_AUDIO_HUB_URL}" data-bw-cta-id="audio_compare_mobile" data-bw-cta-placement="compare">Explore audio walks →</a>
              </article>
            </div>
          </div>
        </section>

        <section class="bw-home-two-doors__section bw-home-two-doors__audio-section" id="audio-walks" data-bw-home-card="audio_shelf" data-bw-card-type="audio-shelf" data-bw-placement="audio-shelf">
          <div class="bw-home-two-doors__wrap">
            <div class="bw-home-two-doors__section-head">
              <div>
                <span class="bw-home-two-doors__eyebrow"><span class="bw-home-two-doors__dot"></span>Listen first</span>
                <h2>Three walks. Listen before you buy.</h2>
              </div>
              <p class="bw-home-two-doors__lead">Hear a short sample from each route, then open the one that fits your Berlin day.</p>
            </div>
            <div class="bw-home-two-doors__shelf">${walkCards}</div>
            <article class="bw-home-two-doors__trio" data-bw-home-card="audio_trio" data-bw-card-type="audio-trio" data-bw-placement="audio-shelf">
              <div>
                <span class="bw-home-two-doors__eyebrow bw-home-two-doors__eyebrow--dark">ONE CITY · THREE LENSES</span>
                <h3>Take the full set.</h3>
                <p>Berlin Wall, Hidden Berlin and Medieval Berlin in one browser-based bundle. Buy separately for €29.70, or choose the €24.90 trio.</p>
                <div class="bw-home-two-doors__trio-stack">
                  ${BW_HOME_TWO_DOORS_WALKS.filter((walk) => ['berlin-wall', 'hidden-berlin', 'medieval-berlin'].includes(walk.slug)).map((walk) => `<img src="${asset(walk.image)}" alt="" width="94" height="72" loading="lazy">`).join('<span class="bw-home-two-doors__trio-plus" aria-hidden="true">+</span>')}
                </div>
              </div>
              <div class="bw-home-two-doors__trio-side">
                <span class="bw-home-two-doors__trio-price">€24.90<small>all three walks</small></span>
                <a class="bw-home-two-doors__btn bw-home-two-doors__btn--yellow" href="${BW_HOME_TWO_DOORS_TRIO_URL}" data-bw-cta-id="audio_trio" data-bw-cta-placement="audio-trio">Get the trio</a>
              </div>
            </article>
          </div>
        </section>

        <section class="bw-home-two-doors__section" id="live-route" data-bw-home-card="live_route" data-bw-card-type="live-route" data-bw-placement="live-route">
          <div class="bw-home-two-doors__wrap bw-home-two-doors__live-band">
            <div class="bw-home-two-doors__photo">
              <img src="${asset('tour-altes-museum.webp')}" alt="Yusuf with guests outside the Altes Museum in Berlin" width="1600" height="900" loading="lazy">
              <span class="bw-home-two-doors__chip bw-home-two-doors__chip--yellow bw-home-two-doors__tag">WORLD CLOCK → HACKESCHER MARKT</span>
            </div>
            <div class="bw-home-two-doors__live-copy">
              <span class="bw-home-two-doors__eyebrow">THE FREE TOUR</span>
              <h2>A short walk with a clear arc.</h2>
              <p>I start at Alexanderplatz's World Clock and move through the historic centre of former East Berlin, finishing near Hackescher Markt. The tour connects divided-city history to the places around you; it does not trace the full Berlin Wall line.</p>
              <div class="bw-home-two-doors__facts">
                <div><b>12</b><span>stops</span></div>
                <div><b>~2h</b><span>walking time</span></div>
                <div><b>~3km</b><span>route length</span></div>
                <div><b class="bw-home-two-doors__free-label">Free to book</b><span>tip-based</span></div>
              </div>
              <div class="bw-home-two-doors__live-actions">
                <a class="bw-home-two-doors__btn bw-home-two-doors__btn--green" href="${BW_HOME_TWO_DOORS_BOOKING_URL}" data-bw-cta-id="book_route" data-bw-cta-placement="live-route">Check dates</a>
                <a class="bw-home-two-doors__link" href="${BW_HOME_TWO_DOORS_REVIEWS_URL}" data-bw-cta-id="reviews_route" data-bw-cta-placement="live-route">Read reviews</a>
              </div>
              <p class="bw-home-two-doors__schedule">Sep: 11:30 &amp; 15:30 (Tue–Sat) · Oct: 11:30 (selected Wed–Sun) · Check dates</p>
            </div>
          </div>
        </section>

        <section class="bw-home-two-doors__section bw-home-two-doors__section--cream-2" id="guide" data-bw-home-card="guide" data-bw-card-type="guide" data-bw-placement="guide">
          <div class="bw-home-two-doors__wrap bw-home-two-doors__guide">
            <div class="bw-home-two-doors__photo">
              <img src="${asset('yusuf-rotes-rathaus-no-vest.jpg')}" alt="Yusuf guiding in front of the Rotes Rathaus in Berlin" width="880" height="1100" loading="lazy">
              <span class="bw-home-two-doors__chip bw-home-two-doors__chip--yellow bw-home-two-doors__tag">YOUR GUIDE · YUSUF</span>
            </div>
            <div class="bw-home-two-doors__guide-copy">
              <span class="bw-home-two-doors__eyebrow">ONE GUIDE · TWO WAYS TO WALK</span>
              <h2>I want Berlin to make sense, not just look impressive.</h2>
              <p>I built BerlinWalk around the moments when a place becomes easier to read: a border crossing, a missing station, a street that changed countries without moving. Join me for the live route, or take one of my audio walks when you want more time at one subject.</p>
              <div class="bw-home-two-doors__guide-two">
                <div><b>In person</b><p>Start at the World Clock, ask questions and follow the historic centre with me.</p></div>
                <div><b>In your own time</b><p>Open a route in your browser and pause at the places you want to keep.</p></div>
              </div>
              <div class="bw-home-two-doors__guide-actions">
                <a class="bw-home-two-doors__btn bw-home-two-doors__btn--green" href="${BW_HOME_TWO_DOORS_BOOKING_URL}" data-bw-cta-id="book_guide" data-bw-cta-placement="guide">Meet me in Berlin</a>
                <a class="bw-home-two-doors__link" href="${BW_HOME_TWO_DOORS_AUDIO_HUB_URL}" data-bw-cta-id="audio_guide" data-bw-cta-placement="guide">Hear the audio walks</a>
              </div>
            </div>
          </div>
        </section>

        <section class="bw-home-two-doors__section" id="reviews" data-bw-home-card="reviews" data-bw-card-type="reviews" data-bw-placement="reviews">
          <div class="bw-home-two-doors__wrap">
            <div class="bw-home-two-doors__section-head">
              <div>
                <span class="bw-home-two-doors__eyebrow"><span class="bw-home-two-doors__dot"></span>Guest feedback</span>
                <h2>Clear history. Easy pace. Good questions.</h2>
              </div>
              <p class="bw-home-two-doors__lead">Short comments from recent live-tour guests. You can read more on FreeTour. These are not audio-walk reviews.</p>
            </div>
            <article class="bw-home-two-doors__rating-panel" data-bw-home-card="review_rating" data-bw-card-type="review-rating" data-bw-placement="reviews">
              <div><span class="bw-home-two-doors__score">9.8</span><span class="bw-home-two-doors__scope">/ 10 on FreeTour · live tour guests</span></div>
              <div><p>Read what guests say about the live walk, the stories and the pace. This rating is for the guided tour, not the audio walks.</p><a class="bw-home-two-doors__link bw-home-two-doors__link--light" href="${BW_HOME_TWO_DOORS_REVIEWS_URL}" data-bw-cta-id="reviews_rating" data-bw-cta-placement="reviews">Read guest reviews</a></div>
            </article>
            <div class="bw-home-two-doors__review-carousel" aria-label="Guest comments from the live tour">
              <div class="bw-home-two-doors__review-viewport" role="region" aria-roledescription="carousel" aria-label="Recent guest reviews" aria-live="off" data-bw-review-viewport>
                <p class="bw-home-two-doors__review-status">Loading guest comments…</p>
              </div>
              <div class="bw-home-two-doors__review-controls" data-bw-review-controls hidden>
                <button type="button" data-bw-review-prev aria-label="Previous review">←</button>
                <span data-bw-review-count aria-live="off"></span>
                <button type="button" data-bw-review-next aria-label="Next review">→</button>
                <button type="button" data-bw-review-toggle aria-label="Pause review rotation">Pause</button>
              </div>
            </div>
          </div>
        </section>

        <section class="bw-home-two-doors__section bw-home-two-doors__section--cream-2" id="more" data-bw-home-card="more_products" data-bw-card-type="more-products" data-bw-placement="more-products">
          <div class="bw-home-two-doors__wrap">
            <div class="bw-home-two-doors__section-head">
              <div>
                <span class="bw-home-two-doors__eyebrow">MORE FROM BERLINWALK</span>
                <h2>Useful when you need a next move.</h2>
              </div>
              <p class="bw-home-two-doors__lead">Pick the one that answers the question you have today.</p>
            </div>
            <div class="bw-home-two-doors__more">${moreCards}</div>
          </div>
        </section>

        <section class="bw-home-two-doors__section" id="faq" data-bw-home-card="faq" data-bw-card-type="faq" data-bw-placement="faq">
          <div class="bw-home-two-doors__wrap">
            <div class="bw-home-two-doors__section-head">
              <div>
                <span class="bw-home-two-doors__eyebrow"><span class="bw-home-two-doors__dot"></span>Before you choose</span>
                <h2>Four quick answers.</h2>
              </div>
              <p class="bw-home-two-doors__lead">If your question is not here, open the booking or audio page and I will give you the current detail there.</p>
            </div>
            <div class="bw-home-two-doors__faq">
              <details><summary>Where does the free tour start?</summary><p>At the World Clock on Alexanderplatz. The route then moves through the historic centre of former East Berlin and finishes near Hackescher Markt.</p></details>
              <details><summary>Does the free tour follow the Berlin Wall?</summary><p>No. It connects divided-city history to the central places around you; it does not trace the full Berlin Wall line. The Berlin Wall audio walk is the focused route for that subject.</p></details>
              <details><summary>How do the audio walks work?</summary><p>Open a route in your browser, go to its named start point and play each chapter when you are ready. You can pause, stop and continue at your own pace.</p></details>
              <details><summary>How do I choose a live tour date?</summary><p>Open the booking page and choose a date that is currently offered. Times can change by month, so use the date picker for the day you actually want.</p></details>
            </div>
          </div>
        </section>
      </div>`;
  }

  async _loadReviews() {
    const viewport = this.querySelector('[data-bw-review-viewport]');
    if (!viewport) return;
    this._reviewRequest = new AbortController();
    try {
      const response = await fetch(this.getAttribute('reviews-url') || BW_HOME_TWO_DOORS_REVIEWS_API, {
        signal: this._reviewRequest.signal,
        credentials: 'same-origin',
      });
      if (!response.ok) throw new Error(`Reviews HTTP ${response.status}`);
      const data = await response.json();
      if (data.success === false || !Array.isArray(data.reviews)) throw new Error('Invalid review response');
      if (!this.isConnected) return;

      // Only the moderated public endpoint is used. No bundled quotes, names,
      // scores or review totals are substituted when it is unavailable.
      this._reviews = data.reviews
        .filter((review) => typeof review.reviewText === 'string' && review.reviewText.trim()
          && review.reviewText.trim().length <= 160
          && Number(review.rating) >= 1 && Number(review.rating) <= 5)
        .sort((a, b) => {
          const date = (review) => Date.parse(review.tourDate || review.createdDate || '') || 0;
          return date(b) - date(a);
        })
        .slice(0, 12);
      if (!this._reviews.length) throw new Error('No approved reviews');

      const slides = this._reviews.map((review, index) => {
        const slide = document.createElement('blockquote');
        slide.className = 'bw-home-two-doors__review-slide';
        slide.setAttribute('aria-roledescription', 'slide');
        slide.setAttribute('aria-label', `Review ${index + 1} of ${this._reviews.length}`);
        const quote = document.createElement('p');
        quote.textContent = review.reviewText.trim();
        const byline = document.createElement('footer');
        const firstName = typeof review.firstName === 'string' ? review.firstName.trim() : '';
        const initial = typeof review.lastInitial === 'string' ? review.lastInitial.trim().replace(/\.$/, '') : '';
        const displayName = review.showName === true && firstName
          ? `${firstName}${initial ? ` ${initial}.` : ''}` : 'Anonymous guest';
        const source = review.source && review.source !== 'direct' ? ` · ${review.source}` : ' · BerlinWalk guest';
        byline.textContent = `${displayName}${source} · ${Number(review.rating)}/5`;
        slide.append(quote, byline);
        return slide;
      });
      viewport.replaceChildren(...slides);
      this._reviewIndex = 0;
      this._showReview(0, false);
      const controls = this.querySelector('[data-bw-review-controls]');
      controls.hidden = this._reviews.length < 2;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        controls.querySelector('[data-bw-review-toggle]').hidden = true;
      }
      if (this._reviews.length > 1) this._bindReviewControls();
    } catch (error) {
      if (error.name === 'AbortError' || !this.isConnected) return;
      viewport.replaceChildren();
      const message = document.createElement('p');
      message.className = 'bw-home-two-doors__review-status';
      message.textContent = 'Guest comments are unavailable right now. Read them on FreeTour.com.';
      viewport.append(message);
    }
  }

  _showReview(index, manual) {
    const viewport = this.querySelector('[data-bw-review-viewport]');
    if (!viewport || !this._reviews?.length) return;
    this._reviewIndex = (index + this._reviews.length) % this._reviews.length;
    viewport.setAttribute('aria-live', manual ? 'polite' : 'off');
    viewport.querySelectorAll('.bw-home-two-doors__review-slide').forEach((slide, i) => {
      slide.classList.toggle('is-current', i === this._reviewIndex);
      slide.setAttribute('aria-hidden', String(i !== this._reviewIndex));
    });
    this.querySelector('[data-bw-review-count]').textContent = `${this._reviewIndex + 1} / ${this._reviews.length}`;
  }

  _bindReviewControls() {
    const carousel = this.querySelector('.bw-home-two-doors__review-carousel');
    const toggle = this.querySelector('[data-bw-review-toggle]');
    const pause = () => {
      this._reviewUserPaused = true;
      this._stopReviewRotation();
      toggle.textContent = 'Play';
      toggle.setAttribute('aria-label', 'Play review rotation');
    };
    carousel.querySelector('[data-bw-review-prev]').addEventListener('click', () => {
      pause();
      this._showReview(this._reviewIndex - 1, true);
    });
    carousel.querySelector('[data-bw-review-next]').addEventListener('click', () => {
      pause();
      this._showReview(this._reviewIndex + 1, true);
    });
    toggle.addEventListener('click', () => {
      this._reviewUserPaused = !this._reviewUserPaused;
      toggle.textContent = this._reviewUserPaused ? 'Play' : 'Pause';
      toggle.setAttribute('aria-label', `${this._reviewUserPaused ? 'Play' : 'Pause'} review rotation`);
      if (this._reviewUserPaused) this._stopReviewRotation();
      else this._startReviewRotation();
    });
    // A reader inspecting the quote should never have it replaced under them.
    carousel.addEventListener('pointerenter', pause);
    carousel.addEventListener('focusin', pause);
    this._reviewVisibilityHandler = () => {
      if (document.hidden) this._stopReviewRotation();
      else this._startReviewRotation();
    };
    document.addEventListener('visibilitychange', this._reviewVisibilityHandler);
    if ('IntersectionObserver' in window) {
      this._reviewObserver = new IntersectionObserver(([entry]) => {
        this._reviewVisible = entry.isIntersecting;
        if (this._reviewVisible) this._startReviewRotation();
        else this._stopReviewRotation();
      }, { threshold: 0.25 });
      this._reviewObserver.observe(carousel);
    } else {
      this._reviewVisible = true;
      this._startReviewRotation();
    }
  }

  _startReviewRotation() {
    if (!this.isConnected || this._reviewTimer || this._reviewUserPaused || !this._reviewVisible
      || document.hidden || this._reviews?.length < 2
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.querySelector('[data-bw-review-viewport]')?.setAttribute('aria-live', 'off');
    this._reviewTimer = window.setInterval(() => this._showReview(this._reviewIndex + 1, false), 8000);
  }

  _stopReviewRotation() {
    if (this._reviewTimer) window.clearInterval(this._reviewTimer);
    this._reviewTimer = null;
  }

  _bindCtas() {
    const shelf = this.querySelector('.bw-home-two-doors__shelf');
    shelf?.addEventListener('focusin', (event) => {
      const card = event.target.closest('.bw-home-two-doors__walk-card');
      if (!card || getComputedStyle(shelf).display !== 'flex') return;
      const shelfRect = shelf.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      if (cardRect.left < shelfRect.left || cardRect.right > shelfRect.right) {
        shelf.scrollTo({ left: shelf.scrollLeft + cardRect.left - shelfRect.left, behavior: 'instant' });
      }
    });
    this.querySelectorAll('[data-bw-cta-id]').forEach((cta) => {
      cta.addEventListener('click', () => {
        const card = cta.closest('[data-bw-home-card]');
        bwHomeTwoDoorsTrack('bw_home_two_doors_cta_click', {
          surface: 'homepage',
          placement: cta.dataset.bwCtaPlacement || card?.dataset.bwPlacement || 'homepage',
          cardId: card?.dataset.bwHomeCard || '',
          cardType: card?.dataset.bwCardType || '',
          ctaId: cta.dataset.bwCtaId || '',
          action: 'click',
        });
      });
    });
  }

  _bindAudioPlayers() {
    this._audioCards = Array.from(this.querySelectorAll('[data-bw-audio-player]')).map((player) => ({
      player,
      audio: player.querySelector('[data-bw-audio]') || player.querySelector('audio'),
      button: player.querySelector('[data-bw-audio-play]'),
      seek: player.querySelector('[data-bw-audio-seek]'),
      time: player.querySelector('[data-bw-audio-time]'),
      status: player.querySelector('[data-bw-audio-status]'),
      icon: player.querySelector('.bw-home-two-doors__sample-icon'),
      title: player.dataset.sampleTitle || 'audio',
      sampleId: player.dataset.sampleId || '',
      expectedDuration: Number(player.dataset.sampleDuration) || 0,
    })).filter(({ audio, button, seek }) => audio && button && seek);

    const updateTime = (item) => {
      const duration = Number.isFinite(item.audio.duration) && item.audio.duration > 0
        ? item.audio.duration
        : item.expectedDuration;
      const current = Number.isFinite(item.audio.currentTime) ? item.audio.currentTime : 0;
      item.time.textContent = `${bwHomeTwoDoorsFormatTime(current)} / ${bwHomeTwoDoorsFormatTime(duration)}`;
      item.seek.max = String(Math.max(1, Math.round(duration)));
      item.seek.value = String(Math.min(Math.max(0, Math.round(current)), Number(item.seek.max)));
      item.seek.setAttribute('aria-valuetext', `${bwHomeTwoDoorsFormatTime(current)} of ${bwHomeTwoDoorsFormatTime(duration)}`);
    };

    const setPlaying = (item, playing) => {
      item.button.dataset.playing = playing ? 'true' : 'false';
      item.button.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} ${item.title} sample`);
      item.button.querySelector('.bw-home-two-doors__sr-only').textContent = `${playing ? 'Pause' : 'Play'} ${item.title} sample`;
      item.icon.textContent = playing ? 'Ⅱ' : '▶';
    };

    this._audioCards.forEach((item) => {
      item.audio.addEventListener('loadedmetadata', () => updateTime(item));
      item.audio.addEventListener('durationchange', () => updateTime(item));
      item.audio.addEventListener('timeupdate', () => updateTime(item));
      item.audio.addEventListener('play', () => {
        this._audioCards.forEach((other) => {
          if (other !== item && !other.audio.paused) other.audio.pause();
        });
        setPlaying(item, true);
        bwHomeTwoDoorsTrack('bw_home_two_doors_sample_start', {
          surface: 'homepage',
          placement: item.player.closest('[data-bw-home-card]')?.dataset.bwPlacement || 'audio',
          cardId: item.player.closest('[data-bw-home-card]')?.dataset.bwHomeCard || '',
          cardType: 'audio-sample',
          sampleId: item.sampleId,
          action: 'play',
        });
      });
      item.audio.addEventListener('pause', () => setPlaying(item, false));
      item.audio.addEventListener('ended', () => {
        setPlaying(item, false);
        item.status.textContent = 'Sample ended. Press play to hear it again.';
        updateTime(item);
      });
      item.audio.addEventListener('error', () => {
        item.button.disabled = true;
        item.status.textContent = 'This sample could not load. Open the audio walk page instead.';
      });
      item.button.addEventListener('click', async () => {
        item.status.textContent = '';
        if (item.audio.paused) {
          try {
            await item.audio.play();
          } catch (_error) {
            item.status.textContent = 'Playback was blocked. Press play again or open the audio walk page.';
          }
        } else {
          item.audio.pause();
        }
      });
      item.seek.addEventListener('input', () => {
        const nextTime = Number(item.seek.value);
        if (Number.isFinite(nextTime) && Number.isFinite(item.audio.duration)) {
          item.audio.currentTime = nextTime;
          updateTime(item);
        }
      });
      item.seek.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const duration = Number.isFinite(item.audio.duration) ? item.audio.duration : item.expectedDuration;
        const current = Number.isFinite(item.audio.currentTime) ? item.audio.currentTime : 0;
        const next = event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? duration
            : current + (event.key === 'ArrowRight' ? 5 : -5);
        item.audio.currentTime = Math.min(Math.max(0, next), duration);
        updateTime(item);
      });
      updateTime(item);
      setPlaying(item, false);
    });
  }

  _bindImpressions() {
    this._impressionFired = new Set();
    this._impressionTimers = new Map();
    this._visibleCards = new Set();
    this._consentEvents = ['consentPolicyInitialized', 'consentPolicyChanged', 'ucConsentEvent', 'bwConsentPolicyChanged'];
    this._consentHandler = () => this._retryImpressions();
    this._consentEvents.forEach((eventName) => window.addEventListener(eventName, this._consentHandler));
    this._visibilityHandler = () => {
      this._impressionTimers.forEach((timer) => window.clearTimeout(timer));
      this._impressionTimers.clear();
      if (!document.hidden) this._retryImpressions();
    };
    document.addEventListener('visibilitychange', this._visibilityHandler);

    const cards = Array.from(this.querySelectorAll('[data-bw-home-card]'));
    const observerOptions = { threshold: [0, 0.6, 1] };
    if ('IntersectionObserver' in window) {
      this._impressionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            this._visibleCards.add(entry.target);
            this._scheduleImpression(entry.target);
          } else {
            this._visibleCards.delete(entry.target);
            window.clearTimeout(this._impressionTimers.get(entry.target));
            this._impressionTimers.delete(entry.target);
          }
        });
      }, observerOptions);
      cards.forEach((card) => this._impressionObserver.observe(card));
    }
    this._retryImpressions();
  }

  _isCardVisible(card) {
    if (document.hidden || !this._visibleCards.has(card)) return false;
    const rect = card.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
    const visibleWidth = Math.min(rect.right, viewportWidth) - Math.max(rect.left, 0);
    const visibleArea = Math.max(0, visibleHeight) * Math.max(0, visibleWidth);
    const cardArea = Math.max(1, rect.width * rect.height);
    return visibleHeight > 0 && visibleWidth > 0 && visibleArea / cardArea >= 0.6;
  }

  _scheduleImpression(card) {
    if (!card || this._impressionFired.has(card.dataset.bwHomeCard) || this._impressionTimers.has(card)) return;
    const timer = window.setTimeout(() => {
      this._impressionTimers.delete(card);
      if (!this._isCardVisible(card)) return;
      const tracked = bwHomeTwoDoorsTrack('bw_home_two_doors_card_impression', {
        surface: 'homepage',
        placement: card.dataset.bwPlacement || 'homepage',
        cardId: card.dataset.bwHomeCard || '',
        cardType: card.dataset.bwCardType || '',
        action: 'visible_800ms',
      });
      if (tracked) this._impressionFired.add(card.dataset.bwHomeCard);
    }, 800);
    this._impressionTimers.set(card, timer);
  }

  _retryImpressions() {
    this.querySelectorAll('[data-bw-home-card]').forEach((card) => {
      if (this._isCardVisible(card)) this._scheduleImpression(card);
    });
  }
}

if (!customElements.get('bw-home-two-doors')) {
  customElements.define('bw-home-two-doors', BWHomeTwoDoorsElement);
}
