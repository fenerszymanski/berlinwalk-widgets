const BW_HOME_TWO_DOORS_SCRIPT_URL = (document.currentScript && document.currentScript.src)
  || 'https://fenerszymanski.github.io/berlinwalk-widgets/home-two-doors/home-two-doors-element.js';
const BW_HOME_TWO_DOORS_ASSET_BASE = new URL('./assets/', BW_HOME_TWO_DOORS_SCRIPT_URL).href;
const BW_HOME_TWO_DOORS_FONT_BASE = new URL('../home-products/assets/fonts/', BW_HOME_TWO_DOORS_SCRIPT_URL).href;
const BW_HOME_TWO_DOORS_CSS_URL = new URL('./home-two-doors-live.css', BW_HOME_TWO_DOORS_SCRIPT_URL).href;

// Berlin Then and Now (Wix Bookings service 145cb27e). A picked date travels to
// the booking page as ?start=YYYY-MM-DDTHH:MM (Berlin time).
const BW_HOME_TWO_DOORS_BOOKING_URL = 'https://www.walkofberlin.com/book-berlin-walking-tour/berlin-then-and-now';
const BW_HOME_TWO_DOORS_TOUR_SERVICE_ID = '145cb27e-c5bd-456d-bfbd-a09d4d6f5f9d';
const BW_HOME_TWO_DOORS_AVAILABILITY_URL = `https://berlinwalk-content-app.vercel.app/api/booking-calendar-availability?days=120&guests=1&serviceId=${BW_HOME_TWO_DOORS_TOUR_SERVICE_ID}`;
const BW_HOME_TWO_DOORS_AUDIO_HUB_URL = 'https://www.berlinwalk.com/audio-tours';
const BW_HOME_TWO_DOORS_REVIEWS_URL = 'https://www.walkofberlin.com/reviews';
const BW_HOME_TWO_DOORS_CONTACT_URL = 'https://www.walkofberlin.com/contact';
const BW_HOME_TWO_DOORS_TRIO_URL = 'https://www.berlinwalk.com/products/berlin-audio-trio-bundle';
const BW_HOME_TWO_DOORS_REVIEWS_API = 'https://www.berlinwalk.com/_functions/listReviews?limit=100';

// Same eight questions as the homepage FAQPage JSON-LD (Wix SEO tags on c1dmp)
// and faq/data/home.json. Change all three together.
const BW_HOME_TWO_DOORS_FAQ = [
  {
    q: 'What is Berlin Then and Now?',
    a: 'It is my walking tour through the part of Berlin that is gone. The streets where the city grew up were cleared after the war, and much of what people call the old town today is a 1980s rebuild. At every stop I hold up an archive photo of the same place, so you can see what stood there and what is left.',
  },
  {
    q: 'How long is it and where does it go?',
    a: 'About 2.5 hours and about 3 km on foot. We start at the World Clock on Alexanderplatz and end at Hackescher Markt: 11 stops covering 16 places, from the TV Tower and the Marienkirche to the Humboldt Forum and Museum Island.',
  },
  {
    q: 'How much does it cost?',
    a: '€25 per person, paid when you book. That is the same price on every site that sells it.',
  },
  {
    q: 'How big is the group, and does my date run?',
    a: 'No more than 10 people. A walk needs at least 2 guests. If you are the only guest two hours before the start, I cancel the walk, refund you in full and give you one of my audio walks for free.',
  },
  {
    q: 'Where do I meet you?',
    a: 'At the World Clock (Weltzeituhr) on Alexanderplatz. Come 5 minutes before the start and look for my green umbrella.',
  },
  {
    q: 'Can I cancel or change my date?',
    a: 'Yes. Cancel up to 24 hours before the start and you get a full refund, or move to another date if there is space. Later than that I cannot refund. If I have to cancel, for weather or anything else, you get your money back in full.',
  },
  {
    q: 'What if it rains?',
    a: 'The walk runs in light rain, so bring a jacket. If the weather makes it unsafe, I cancel and refund you in full.',
  },
  {
    q: 'Is it in English, and can I book it just for my group?',
    a: 'The walk is in English. For your own group I run private walks: €249 for up to 6 people or €299 for up to 10.',
  },
];

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
    image: 'card-berlin-wall.webp',
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
    image: 'card-hidden-berlin.webp',
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
    image: 'card-medieval-berlin.webp',
    alt: 'St. Mary’s Church with the Berlin TV Tower behind it',
  },
];

const BW_HOME_TWO_DOORS_MORE_PRODUCTS = [
  {
    label: 'PLAN',
    title: 'Berlin Trip Planner',
    price: 'From €7.99',
    image: 'more-trip-planner.webp',
    alt: 'Illustrated view of Berlin Cathedral and the River Spree',
    text: 'Build a realistic day around your dates, hotel area and pace.',
    href: 'https://www.berlinwalk.com/berlin-trip-planner',
  },
  {
    label: 'ARRIVE',
    title: 'First-Day Rescue Plan',
    price: '€4.99',
    image: 'more-first-day.webp',
    alt: 'Platforms and signs inside Berlin Hauptbahnhof',
    text: 'Know what to do between landing, check-in and your first Berlin evening.',
    href: 'https://www.berlinwalk.com/products/berlin-first-day-rescue-plan',
  },
  {
    label: 'LOOK CLOSER',
    title: 'Hidden Berlin Photo Missions',
    price: '€3.99',
    image: 'more-photo-missions.webp',
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
  {
    label: 'STAY IN',
    title: 'Berlin Night In',
    price: 'First chapter free · €6.90',
    imageUrl: 'https://app.berlinwalk.com/products/berlin-night-in/assets/marketing/market-preview.jpg',
    width: 640,
    height: 481,
    alt: 'Colourful scarves, signs and yellow train-car shops inside the then-unused upper Nollendorfplatz station in 1983.',
    text: 'One Berlin railway line, four lives, in real archive photographs. You play it at home.',
    href: 'https://www.walkofberlin.com/products/berlin-night-in',
    cta: 'Play the free chapter',
    wide: true,
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
      <audio class="bw-home-two-doors__sample-audio" id="${playerId}-audio" preload="none" data-bw-audio-src="${walk.sampleSrc}" aria-label="${walk.title} audio sample"></audio>
      <span class="bw-home-two-doors__sample-status" role="status" aria-live="polite" data-bw-audio-status></span>
    </div>`;
}

class BWHomeTwoDoorsElement extends HTMLElement {
  connectedCallback() {
    if (this._runtimeBound) {
      // Wix hydration swaps the page container and the adapter re-attaches this
      // same node. Keep the painted DOM; only redo work the disconnect cut off.
      this._bindImpressions();
      if (this._reviewsLoaded) {
        if (this._reviewVisibilityHandler) document.addEventListener('visibilitychange', this._reviewVisibilityHandler);
        const carousel = this.querySelector('.bw-home-two-doors__review-carousel');
        if (this._reviewObserver && carousel) this._reviewObserver.observe(carousel);
        this._startReviewRotation();
      } else {
        this._loadReviews();
      }
      if (!this._datesLoaded) this._loadDates();
      return;
    }
    const adopt = this._hasPrerenderedMarkup();
    if (!adopt && this.dataset.bwPrerender === 'ready-screen-v1'
      && !this._prerenderParsed && document.readyState === 'loading') {
      if (!this._prerenderWaiting) {
        this._prerenderWaiting = true;
        document.addEventListener('DOMContentLoaded', () => {
          this._prerenderParsed = true;
          this._prerenderWaiting = false;
          if (this.isConnected) this.connectedCallback();
        }, { once: true });
      }
      return;
    }
    this.dataset.bwRendered = 'true';
    this._ensureStyles();
    // The ready-screen embed contains this renderer's complete HTML. Upgrade
    // it in place so the already-painted hero and heading keep their identity.
    if (!adopt) this._render();
    this._bindCtas();
    this._bindAudioPlayers();
    this._loadReviews();
    this._loadDates();
    this._bindImpressions();
    this._runtimeBound = true;
  }

  disconnectedCallback() {
    this._audioCards?.forEach(({ audio }) => audio.pause());
    this._impressionObserver?.disconnect();
    this._impressionTimers?.forEach((timer) => window.clearTimeout(timer));
    this._consentEvents?.forEach((eventName) => window.removeEventListener(eventName, this._consentHandler));
    document.removeEventListener('visibilitychange', this._visibilityHandler);
    this._reviewRequest?.abort();
    this._datesRequest?.abort();
    this._reviewObserver?.disconnect();
    this._stopReviewRotation();
    document.removeEventListener('visibilitychange', this._reviewVisibilityHandler);
  }

  _ensureStyles() {
    if (document.querySelector('link[data-bw-home-two-doors-css],style[data-bw-home-two-doors-css]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = BW_HOME_TWO_DOORS_CSS_URL;
    link.dataset.bwHomeTwoDoorsCss = 'true';
    document.head.appendChild(link);
  }

  _hasPrerenderedMarkup() {
    if (this.dataset.bwPrerender !== 'ready-screen-v1') return false;
    const page = this.firstElementChild;
    if (!page?.matches('.bw-home-two-doors#bw-home-two-doors')
      || this.querySelectorAll('h1').length !== 1
      || !page.querySelector('h1#bw-home-two-doors-title')
      || !page.querySelector('.bw-home-two-doors__door--live img.bw-home-two-doors__background[src][width][height]')
      || !page.querySelector('[data-bw-live-dates]')
      || !page.querySelector('.bw-home-two-doors__review-carousel')
      || !page.querySelector('[data-bw-review-controls]')
      || !page.querySelector('[data-bw-review-viewport]')
      || !page.querySelector('[data-bw-review-count]')
      || !page.querySelector('[data-bw-review-prev]')
      || !page.querySelector('[data-bw-review-next]')
      || !page.querySelector('[data-bw-review-toggle]')
      || !page.querySelector('.bw-home-two-doors__credits summary')) return false;
    const booking = page.querySelector('a[data-bw-cta-id="book_live_tour"]');
    if (booking?.href !== BW_HOME_TWO_DOORS_BOOKING_URL) return false;
    const players = [...page.querySelectorAll('[data-bw-audio-player]')];
    return players.length === BW_HOME_TWO_DOORS_WALKS.length + 1 && players.every(player =>
      ['audio[data-bw-audio-src]', '[data-bw-audio-play] .bw-home-two-doors__sr-only',
        '[data-bw-audio-seek]', '[data-bw-audio-time]', '[data-bw-audio-status]',
        '.bw-home-two-doors__sample-icon'].every(selector => player.querySelector(selector)));
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
      <a class="bw-home-two-doors__more-card${product.wide ? ' bw-home-two-doors__more-card--wide' : ''}" href="${product.href}" data-bw-cta-id="more_${product.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}" data-bw-cta-placement="more-products">
        <img class="bw-home-two-doors__more-thumb" src="${product.imageUrl || asset(product.image)}" alt="${product.alt}" loading="lazy" width="${product.width || 600}" height="${product.height || 360}">
        <span class="bw-home-two-doors__eyebrow">${product.label}</span>
        <b>${product.title}</b>
        <span>${product.text}</span>
        <span class="bw-home-two-doors__more-price">${product.price}</span>
        <span class="bw-home-two-doors__more-cta">${product.cta || (product.label === 'TOOLS' ? 'Explore free tools' : 'Explore this product')} →</span>
      </a>`).join('');

    const faqItems = BW_HOME_TWO_DOORS_FAQ.map((item) => `
              <details><summary>${item.q}</summary><p>${item.a}</p></details>`).join('');

    this.innerHTML = `
      <div class="bw-home-two-doors" id="bw-home-two-doors" ${this.hasAttribute('embedded') ? '' : 'role="main"'}>
        <section class="bw-home-two-doors__doors-title" aria-labelledby="bw-home-two-doors-title">
          <div class="bw-home-two-doors__wrap">
            <h1 id="bw-home-two-doors-title">One guide. <em>Two ways</em> to walk Berlin.</h1>
            <p>Walk with me on Berlin Then and Now, or take one of my audio walks on your own phone.</p>
          </div>
        </section>

        <section class="bw-home-two-doors__wrap bw-home-two-doors__doors" aria-label="Choose how to explore Berlin">
          <article class="bw-home-two-doors__door bw-home-two-doors__door--live" data-bw-home-card="live_tour" data-bw-card-type="live-tour" data-bw-placement="hero">
            <img class="bw-home-two-doors__background" src="${asset('tour-altes-museum.webp')}" srcset="${asset('tour-altes-museum-800w.webp')} 800w, ${asset('tour-altes-museum.webp')} 1600w" sizes="(max-width: 900px) 100vw, 50vw" fetchpriority="high" decoding="async" alt="Yusuf explaining Berlin history to guests outside the Altes Museum" width="1600" height="900">
            <span class="bw-home-two-doors__scrim" aria-hidden="true"></span>
            <span class="bw-home-two-doors__chip bw-home-two-doors__chip--yellow bw-home-two-doors__corner">LIVE · MAX 10 PEOPLE</span>
            <span class="bw-home-two-doors__eyebrow bw-home-two-doors__eyebrow--dark">BERLIN THEN AND NOW</span>
            <h2>Walk <em>with me.</em></h2>
            <p>Berlin's old city did not survive. I walk you through where it stood and hold up an archive photo of the same place at every stop.</p>
            <p class="bw-home-two-doors__door-facts">About 2.5 hours · 11 stops, 16 places · max 10 · €25</p>
            <div class="bw-home-two-doors__door-actions">
              <a class="bw-home-two-doors__btn bw-home-two-doors__btn--yellow" href="${BW_HOME_TWO_DOORS_BOOKING_URL}" data-bw-cta-id="book_live_tour" data-bw-cta-placement="hero-live">See dates and book</a>
              <a class="bw-home-two-doors__link bw-home-two-doors__link--light" href="#live-route" data-bw-cta-id="learn_live_route" data-bw-cta-placement="hero-live">Route &amp; meeting point</a>
            </div>
            <div class="bw-home-two-doors__door-meta">
              <span class="bw-home-two-doors__chip">About 2.5 hours · 11 stops, 16 places</span>
              <span class="bw-home-two-doors__chip">Max 10 · €25</span>
            </div>
          </article>

          <article class="bw-home-two-doors__door bw-home-two-doors__door--audio" data-bw-home-card="audio_door" data-bw-card-type="audio-door" data-bw-placement="hero">
            <div class="bw-home-two-doors__audio-image">
              <div class="bw-audio-art bw-audio-art--phone-dusk" role="img" aria-label="A phone in front of the Berlin TV Tower at dusk. Its screen lists the three audio walks: Berlin Wall, Hidden Berlin and Medieval Berlin.">
                <picture class="bw-audio-art__photo" aria-hidden="true">
                  <source media="(max-width: 900px)" srcset="${asset('audio-door-dusk-strip.webp')}">
                  <img class="bw-audio-art__photo-img" fetchpriority="high" src="${asset('audio-door-dusk-column.webp')}" alt="" width="672" height="1792">
                </picture>
                <span class="bw-audio-art__grade" aria-hidden="true"></span>
                <span class="bw-audio-art__ground" aria-hidden="true"></span>
                <div class="bw-audio-art__phone" aria-hidden="true">
                  <span class="bw-audio-art__btn bw-audio-art__btn--action"></span>
                  <span class="bw-audio-art__btn bw-audio-art__btn--vol-up"></span>
                  <span class="bw-audio-art__btn bw-audio-art__btn--vol-down"></span>
                  <span class="bw-audio-art__btn bw-audio-art__btn--power"></span>
                  <div class="bw-audio-art__bezel">
                    <div class="bw-audio-art__screen">
                      <span class="bw-audio-art__island"></span>
                      <div class="bw-audio-art__head">
                        <span class="bw-audio-art__eyebrow">Three audio walks</span>
                        <span class="bw-audio-art__title">Berlin Audio <span class="bw-audio-art__title-em">Trio</span></span>
                      </div>
                      <div class="bw-audio-art__list">
                        <div class="bw-audio-art__row">
                          <span class="bw-audio-art__thumb-wrap">
                            <img class="bw-audio-art__thumb" src="${asset('audio-door-thumb-wall.webp')}" alt="" width="128" height="128">
                            <span class="bw-audio-art__num">01</span>
                          </span>
                          <div class="bw-audio-art__row-text">
                            <span class="bw-audio-art__tag">Divided city</span>
                            <span class="bw-audio-art__name">Berlin Wall</span>
                            <span class="bw-audio-art__route"><span class="bw-audio-art__route-line">Nordbahnhof</span><span class="bw-audio-art__route-line">→ Mauerpark</span></span>
                          </div>
                        </div>
                        <div class="bw-audio-art__row">
                          <span class="bw-audio-art__thumb-wrap">
                            <img class="bw-audio-art__thumb" src="${asset('audio-door-thumb-hidden.webp')}" alt="" width="128" height="128">
                            <span class="bw-audio-art__num">02</span>
                          </span>
                          <div class="bw-audio-art__row-text">
                            <span class="bw-audio-art__tag">Lost places</span>
                            <span class="bw-audio-art__name">Hidden Berlin</span>
                            <span class="bw-audio-art__route"><span class="bw-audio-art__route-line">Anhalter Bahnhof</span><span class="bw-audio-art__route-line">Friedrichstraße</span></span>
                          </div>
                        </div>
                        <div class="bw-audio-art__row">
                          <span class="bw-audio-art__thumb-wrap">
                            <img class="bw-audio-art__thumb" src="${asset('audio-door-thumb-medieval.webp')}" alt="" width="128" height="128">
                            <span class="bw-audio-art__num">03</span>
                          </span>
                          <div class="bw-audio-art__row-text">
                            <span class="bw-audio-art__tag">The city begins</span>
                            <span class="bw-audio-art__name">Medieval Berlin</span>
                            <span class="bw-audio-art__route"><span class="bw-audio-art__route-line">World Clock</span><span class="bw-audio-art__route-line">→ Museum Island</span></span>
                          </div>
                        </div>
                      </div>
                      <div class="bw-audio-art__now">
                        <span class="bw-audio-art__play"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path d="M9 6.5v11l9-5.5z" fill="#123D18"/></svg></span>
                        <span class="bw-audio-art__now-text">
                          <span class="bw-audio-art__now-name">Berlin Wall</span>
                          <span class="bw-audio-art__now-meta">Audio walk · 01</span>
                        </span>
                        <svg class="bw-audio-art__wave" viewBox="0 0 40 16" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M1 8v0M4 5v6M7 3v10M10 6v4M13 2v12M16 5v6M19 7v2M22 4v8M25 1v14M28 6v4M31 3v10M34 5v6M37 7v2" stroke="#FFE600" stroke-width="1.6" stroke-linecap="round" fill="none"/></svg>
                        <span class="bw-audio-art__progress"><span class="bw-audio-art__progress-fill"></span></span>
                      </div>
                      <span class="bw-audio-art__home"></span>
                      <span class="bw-audio-art__glass"></span>
                    </div>
                  </div>
                </div>
              </div>
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
                <div><b>A 12:30 start on my tour dates.</b><br>Meet at the World Clock. About 2.5 hours through Berlin's vanished old city.</div>
                <div><b>Your own start time.</b><br>Choose a route and start at its meeting point. Pause whenever you like.</div>
              </div>
              <div class="bw-home-two-doors__compare-row">
                <div>PRICE</div>
                <div><b>€25 per person.</b><br>Paid when you book. No more than 10 people, and a walk needs at least 2 guests.</div>
                <div><b>€9.90 per walk.</b><br>Berlin Wall + Hidden Berlin + Medieval Berlin: €24.90 as a trio.</div>
              </div>
              <div class="bw-home-two-doors__compare-row">
                <div>HOW IT WORKS</div>
                <div><b>Walk with me.</b><br>At every stop I hold up an archive photo of the same place. Bring your questions and comfortable shoes.</div>
                <div><b>Listen on your phone.</b><br>Recorded stories I researched and wrote. Bring headphones; no app needed. Audio download + PDF route guide included.</div>
              </div>
            </div>
            <div class="bw-home-two-doors__compare-mobile" aria-label="Compare live and audio walks">
              <article class="bw-home-two-doors__choice-card bw-home-two-doors__choice-card--live">
                <span class="bw-home-two-doors__choice-type">WITH YOUR GUIDE</span>
                <h3>Live tour</h3>
                <p class="bw-home-two-doors__choice-summary">A small-group walk with archive photos, where you can ask questions.</p>
                <dl>
                  <div><dt>When</dt><dd>12:30 start · about 2.5 hours</dd></div>
                  <div><dt>Where</dt><dd>Meet me at the World Clock</dd></div>
                  <div><dt>Price</dt><dd>€25 per person · max 10 people</dd></div>
                </dl>
                <a href="${BW_HOME_TWO_DOORS_BOOKING_URL}" data-bw-cta-id="book_compare_mobile" data-bw-cta-placement="compare">See dates and book →</a>
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
              <span class="bw-home-two-doors__eyebrow">BERLIN THEN AND NOW</span>
              <h2>The Berlin that disappeared, stop by stop.</h2>
              <p>I start at the World Clock on Alexanderplatz and walk you through the streets where Berlin grew up, most of them cleared after the war. At every stop I hold up an archive photo of the same place, so you can see what stood there and what is left. We finish at Hackescher Markt. The walk does not follow the Berlin Wall; my Berlin Wall audio walk does.</p>
              <div class="bw-home-two-doors__facts">
                <div><b>11</b><span>stops, 16 places</span></div>
                <div><b>~2.5h</b><span>on foot</span></div>
                <div><b>~3km</b><span>route length</span></div>
                <div><b>€25</b><span>per person</span></div>
              </div>
              <div class="bw-home-two-doors__live-actions">
                <a class="bw-home-two-doors__btn bw-home-two-doors__btn--green" href="${BW_HOME_TWO_DOORS_BOOKING_URL}" data-bw-cta-id="book_route" data-bw-cta-placement="live-route">See dates and book</a>
                <a class="bw-home-two-doors__link" href="${BW_HOME_TWO_DOORS_REVIEWS_URL}" data-bw-cta-id="reviews_route" data-bw-cta-placement="live-route">Read reviews</a>
              </div>
              <p class="bw-home-two-doors__schedule">12:30 start at the World Clock, Alexanderplatz · max 10 people</p>
              <div class="bw-home-two-doors__dates" data-bw-live-dates aria-label="Next tour dates" hidden></div>
            </div>
          </div>
        </section>

        <section class="bw-home-two-doors__section bw-home-two-doors__section--cream-2" id="guide" data-bw-home-card="guide" data-bw-card-type="guide" data-bw-placement="guide">
          <div class="bw-home-two-doors__wrap bw-home-two-doors__guide">
            <div class="bw-home-two-doors__photo">
              <img src="${asset('yusuf-rotes-rathaus-no-vest.webp')}" alt="Yusuf guiding in front of the Rotes Rathaus in Berlin" width="880" height="1100" loading="lazy">
              <span class="bw-home-two-doors__chip bw-home-two-doors__chip--yellow bw-home-two-doors__tag">YOUR GUIDE · YUSUF</span>
            </div>
            <div class="bw-home-two-doors__guide-copy">
              <span class="bw-home-two-doors__eyebrow">ONE GUIDE · TWO WAYS TO WALK</span>
              <h2>I want Berlin to make sense, not just look impressive.</h2>
              <p>I built Walk of Berlin around the moments when a place becomes easier to read: a border crossing, a missing station, a street that changed countries without moving. Join me for the live route, or take one of my audio walks when you want more time at one subject.</p>
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
              <p class="bw-home-two-doors__lead">Short comments from guests who walked this route with me. These are not audio-walk reviews. <a class="bw-home-two-doors__link" href="${BW_HOME_TWO_DOORS_REVIEWS_URL}" data-bw-cta-id="reviews_rating" data-bw-cta-placement="reviews">Read all guest reviews</a></p>
            </div>
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
                <span class="bw-home-two-doors__eyebrow">MORE FROM WALK OF BERLIN</span>
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
                <h2>Quick answers about the walk.</h2>
              </div>
              <p class="bw-home-two-doors__lead">If your question is not here, <a class="bw-home-two-doors__link" href="${BW_HOME_TWO_DOORS_CONTACT_URL}" data-bw-cta-id="faq_contact" data-bw-cta-placement="faq">send me a message</a> and I will answer it myself.</p>
            </div>
            <div class="bw-home-two-doors__faq">${faqItems}
            </div>
            <details class="bw-home-two-doors__credits">
              <summary>Photo credits</summary>
              <ul>
                <li>Anhalter Bahnhof portico: <a href="https://commons.wikimedia.org/wiki/File:Berlin_Anhalter_Bahnhof_-_01.jpg" rel="noopener" target="_blank">Carlos Delgado, Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" rel="noopener license" target="_blank">CC BY-SA 4.0</a>, cropped.</li>
                <li>St. Mary’s Church and the TV Tower: <a href="https://commons.wikimedia.org/wiki/File:Berlin_Marienkirche_Exterior_0326_02.jpg" rel="noopener" target="_blank">Dosseman, Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" rel="noopener license" target="_blank">CC BY-SA 4.0</a>, cropped.</li>
                <li>Flea market at Nollendorfplatz, 1983: <a href="https://commons.wikimedia.org/wiki/File:Berlin_Flohmarkt_U-_Nollendorfplatz_1983.jpg" rel="noopener" target="_blank">Hrz29vv, Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/3.0/" rel="noopener license" target="_blank">CC BY-SA 3.0</a>, resized, no crop.</li>
              </ul>
            </details>
          </div>
        </section>
      </div>`;
  }

  // Live dates for Berlin Then and Now. While the service has no bookable date
  // (booking not open yet) or the feed fails, the strip stays hidden and the
  // "See dates and book" buttons carry the visitor to the booking page.
  async _loadDates() {
    const strip = this.querySelector('[data-bw-live-dates]');
    if (!strip || typeof fetch !== 'function') return;
    this._datesRequest = new AbortController();
    try {
      const response = await fetch(BW_HOME_TWO_DOORS_AVAILABILITY_URL, { signal: this._datesRequest.signal, cache: 'no-cache' });
      if (!response.ok) return;
      const data = await response.json();
      if (!this.isConnected || !data || !Array.isArray(data.slots)) return;
      this._datesLoaded = true;
      const read = (value, options) => {
        const map = {};
        new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', ...options })
          .formatToParts(new Date(value))
          .forEach((part) => { if (part.type !== 'literal') map[part.type] = part.value; });
        return map;
      };
      // The feed can send Berlin wall-clock times without a zone
      // ("2026-10-02T12:30:00") or UTC instants; both become YYYY-MM-DDTHH:MM.
      const berlinKey = (value) => {
        const text = String(value || '');
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(text) && !/(Z|[+-]\d{2}:?\d{2})$/i.test(text)) return text.slice(0, 16);
        const date = new Date(text);
        if (Number.isNaN(date.getTime())) return '';
        const num = read(date, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
        return `${num.year}-${num.month}-${num.day}T${num.hour}:${num.minute}`;
      };
      const nowKey = berlinKey(new Date().toISOString());
      const seen = new Set();
      const slots = data.slots
        .filter((slot) => slot && (slot.openSpots === null || slot.openSpots === undefined || Number(slot.openSpots) > 0))
        .map((slot) => berlinKey(slot.startDate))
        .filter((key) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(key) && key > nowKey)
        .sort()
        .filter((key) => !seen.has(key.slice(0, 10)) && seen.add(key.slice(0, 10)))
        .slice(0, 4)
        .map((key) => {
          const txt = read(`${key.slice(0, 10)}T12:00:00Z`, { weekday: 'short', day: 'numeric', month: 'short' });
          return { key, label: `${txt.weekday} ${txt.day} ${txt.month} · ${key.slice(11, 16)}` };
        });
      if (!slots.length) return;
      const label = document.createElement('span');
      label.className = 'bw-home-two-doors__dates-label';
      label.textContent = 'Next dates';
      const links = slots.map(({ key, label: text }) => {
        const url = new URL(BW_HOME_TWO_DOORS_BOOKING_URL);
        url.searchParams.set('start', key);
        const link = document.createElement('a');
        link.className = 'bw-home-two-doors__date';
        link.href = url.toString();
        link.dataset.bwCtaId = 'book_date_chip';
        link.dataset.bwCtaPlacement = 'live-route';
        link.textContent = text;
        link.addEventListener('click', () => bwHomeTwoDoorsTrack('bw_home_two_doors_cta_click', {
          surface: 'homepage', placement: 'live-route', cardId: 'live_route', cardType: 'live-route',
          ctaId: 'book_date_chip', action: 'click',
        }));
        return link;
      });
      strip.replaceChildren(label, ...links);
      strip.hidden = false;
    } catch (_error) {
      // Leave the strip hidden.
    }
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
        const source = review.source && review.source !== 'direct' ? ` · ${review.source}` : ' · Walk of Berlin guest';
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
      this._reviewsLoaded = true;
    } catch (error) {
      if (error.name === 'AbortError' || !this.isConnected) return;
      this._reviewsLoaded = true;
      viewport.replaceChildren();
      const message = document.createElement('p');
      message.className = 'bw-home-two-doors__review-status';
      message.textContent = 'Guest comments are unavailable right now. You can read them on my reviews page.';
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
      pendingTime: null,
    })).filter(({ audio, button, seek }) => audio && button && seek);

    const updateTime = (item) => {
      const duration = Number.isFinite(item.audio.duration) && item.audio.duration > 0
        ? item.audio.duration
        : item.expectedDuration;
      const current = item.pendingTime ?? (Number.isFinite(item.audio.currentTime) ? item.audio.currentTime : 0);
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

    const seekTo = (item, nextTime) => {
      const loaded = item.audio.readyState >= 1 && Number.isFinite(item.audio.duration);
      const duration = loaded ? item.audio.duration : item.expectedDuration;
      const time = Math.min(Math.max(0, nextTime), duration);
      // Seeking before the first play must not start a download. Apply it once
      // the user's play click has loaded the real duration.
      if (loaded) item.audio.currentTime = time;
      else item.pendingTime = time;
      updateTime(item);
    };

    this._audioCards.forEach((item) => {
      item.audio.addEventListener('loadedmetadata', () => {
        if (item.pendingTime !== null) {
          item.audio.currentTime = Math.min(item.pendingTime, item.audio.duration);
          item.pendingTime = null;
        }
        updateTime(item);
      });
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
            // No src is present during startup: some browsers fetch most of a
            // short sample even with preload="metadata". Keep play in the gesture.
            if (!item.audio.hasAttribute('src')) item.audio.src = item.audio.dataset.bwAudioSrc;
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
        if (Number.isFinite(nextTime)) seekTo(item, nextTime);
      });
      item.seek.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const duration = Number.isFinite(item.audio.duration) ? item.audio.duration : item.expectedDuration;
        const current = item.pendingTime ?? (Number.isFinite(item.audio.currentTime) ? item.audio.currentTime : 0);
        const next = event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? duration
            : current + (event.key === 'ArrowRight' ? 5 : -5);
        seekTo(item, next);
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
