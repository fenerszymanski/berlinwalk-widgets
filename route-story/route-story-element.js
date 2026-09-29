const BW_ROUTE_STORY_BOOKING_URL = 'https://www.walkofberlin.com/book-berlin-walking-tour/berlin-then-and-now';
const BW_ROUTE_STORY_MEETING_URL = 'https://www.walkofberlin.com/meeting-point';
const BW_ROUTE_STORY_GUIDE_URL = 'https://www.walkofberlin.com/the-guide';
const BW_ROUTE_STORY_AUDIO_URL = 'https://www.walkofberlin.com/tools/free-berlin-audio-tour';
const BW_ROUTE_STORY_MAP_IMAGE_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/route/assets/berlin-mitte-illustration-960w.webp';
const BW_ROUTE_STORY_MAP_IMAGE_720_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/route/assets/berlin-mitte-illustration-720w.webp';
const BW_ROUTE_STORY_MAP_IMAGE_1200_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/route/assets/berlin-mitte-illustration-1200w.webp';
const BW_ROUTE_STORY_HERO_IMAGE_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/gallery/images/06-1600w.webp';
const BW_ROUTE_STORY_HERO_FALLBACK_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/gallery/images/06-1600w.jpg';
const BW_ROUTE_STORY_DOM_IMAGE_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/gallery/images/07-1200w.webp';
const BW_ROUTE_STORY_GROUP_IMAGE_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/gallery/images/01-1200w.webp';

// Berlin Then and Now: the canonical 11 stops covering 16 places (same order and
// merged names as route/data.json). Pin x/y are percentages on the route map.
const BW_ROUTE_STORY_STOPS = [
  {
    id: 1,
    name: 'World Clock',
    location: 'Alexanderplatz',
    x: 95,
    y: 37,
    act: 'Start',
    layer: 'The question',
    question: "Where is Berlin's old city?",
    understand: 'I start with the question the whole walk answers. The World Clock went up in 1969 on a square the GDR rebuilt as a modern showcase, a short walk from where Berlin began in the 13th century.',
    thenNow: 'My archive photo shows Alexanderplatz before the war, a crowded junction of trams and department stores. Hold it up and you can see how much bigger and emptier the square became when it was rebuilt.',
    takeaway: 'Keep the question in mind. Every stop after this one adds part of the answer.'
  },
  {
    id: 2,
    name: 'TV Tower',
    location: 'Fernsehturm',
    x: 82,
    y: 36,
    act: 'Start',
    layer: 'GDR skyline',
    question: 'What did the GDR build over the old streets?',
    understand: "The TV Tower opened in 1969 as East Berlin's statement to the world, 368 metres tall. The ground at its feet was not empty before: the streets of the Marienviertel, one of the oldest parts of the city, stood here until the late 1960s.",
    thenNow: "Then: a quarter of narrow streets and houses. Now: open lawns, a fountain terrace and the tower's concrete base. The archive print shows what filled this space before it was cleared.",
    takeaway: 'The biggest thing missing at Alexanderplatz is not a building. It is a whole neighbourhood.'
  },
  {
    id: 3,
    name: 'Rotes Rathaus & Neptunbrunnen',
    location: 'Town Hall and Neptune Fountain',
    x: 89,
    y: 47,
    act: 'Old Berlin',
    layer: 'A fountain that moved',
    question: 'Why is a palace fountain standing by the town hall?',
    understand: 'The red-brick town hall was finished in 1869 and has watched empire, war, division and reunification. The Neptune Fountain in front of it did not start here: Reinhold Begas made it in 1891 for the square outside the royal palace, and the GDR set it up on this spot in 1969, after the palace was gone.',
    thenNow: 'The archive photo shows the Neptune Fountain in front of the royal palace. Hold it up here and you are looking at the same fountain in a different city.',
    takeaway: 'In Berlin, even a fountain can tell you what was demolished.'
  },
  {
    id: 4,
    name: 'Marienkirche',
    location: "St. Mary's Church",
    x: 72,
    y: 35,
    act: 'Old Berlin',
    layer: 'Medieval survivor',
    question: 'Why does a medieval church stand alone in an open square?',
    understand: 'Marienkirche goes back to the late 13th century and is one of the oldest churches in Berlin. Inside is a Dance of Death fresco from the 1480s. For most of its life the church sat inside a dense quarter of houses and lanes. The open space around it came much later.',
    thenNow: 'The archive photo from around 1880 shows the church boxed in by houses. Today it stands alone under the TV Tower, and the houses are the part that is gone.',
    takeaway: 'The church survived. The neighbourhood around it did not.'
  },
  {
    id: 5,
    name: 'Marx-Engels-Forum',
    location: 'Spree bank',
    x: 76,
    y: 58,
    act: 'Old Berlin',
    layer: 'Memory and erasure',
    question: 'What did East Berlin put where the old streets were?',
    understand: "The GDR laid out this park and set up the bronze Marx and Engels in 1986. The ground under it was part of Berlin's oldest quarter, heavily damaged in the war and then cleared instead of rebuilt.",
    thenNow: 'The archive print shows this ground when it was still a quarter of streets and houses. Line it up with the lawn in front of you and the empty space starts to read differently.',
    takeaway: 'In Berlin, empty space is often evidence.'
  },
  {
    id: 6,
    name: 'Sanchi Gate',
    location: 'Outside the Humboldt Forum',
    x: 64,
    y: 73,
    act: 'Palace site',
    layer: 'Whose history',
    question: 'Why is an Indian gateway standing outside a Prussian palace?',
    understand: 'The gate is a copy of a stone gateway from the Great Stupa at Sanchi in India. It stands at the edge of the palace site and raises the question the whole building lives with: whose history this place shows, and on whose terms.',
    thenNow: 'The archive print here comes from the palace set: the royal palace this corner belonged to until the GDR blew it up in 1950.',
    takeaway: 'The rebuilt palace does not only bring back a facade. It brings back the argument.'
  },
  {
    id: 7,
    name: 'Humboldt Forum',
    location: 'Berlin Palace site',
    x: 55,
    y: 80,
    act: 'Palace site',
    layer: 'Reconstruction debate',
    question: 'How many buildings can one site have?',
    understand: 'Someone born here in 1940 has seen three buildings on this ground: the royal palace, blown up in 1950; the Palast der Republik, opened in 1976 and torn down in the 2000s; and the Humboldt Forum behind rebuilt baroque facades, finished in 2020.',
    thenNow: 'Here I hold up more than one print: the palace and the Palast der Republik, so you can compare both with the building in front of you.',
    takeaway: 'Berlin does not simply preserve history. It negotiates with it in public.'
  },
  {
    id: 8,
    name: 'Lustgarten, Berliner Dom & Altes Museum',
    location: 'Museum Island',
    x: 41,
    y: 64,
    act: 'Museum Island',
    layer: 'Power on display',
    question: 'How many lives can one lawn have?',
    understand: "Three places around one lawn. The Lustgarten has been a royal garden, a parade ground, a Nazi rally site and a garden again. The Berliner Dom, finished in 1905, is Prussian ambition in stone. The Altes Museum opened in 1830 as Berlin's first public museum.",
    thenNow: "The cathedral's dome was rebuilt after the war lower and plainer than the original. The archive photo shows the difference at a glance.",
    takeaway: 'Grandeur and damage can share one facade.'
  },
  {
    id: 9,
    name: 'Neues Museum, Alte Nationalgalerie & Pergamon',
    location: 'Museum Island',
    x: 31,
    y: 46,
    act: 'Museum Island',
    layer: 'Repair and identity',
    question: 'How should a damaged city repair itself?',
    understand: 'The Neues Museum, home of the Nefertiti bust, stood as a war ruin for decades before David Chipperfield rebuilt it. It reopened in 2009 with its scars left visible on purpose. Next to it the Alte Nationalgalerie sits like a temple, and the Pergamon Museum is closed for a long renovation.',
    thenNow: 'The archive photo shows the Neues Museum when it was still a ruin. Look at the walls today and you can see where the surviving building ends and the new work begins.',
    takeaway: 'Berlin is at its most honest when it stops pretending nothing happened.'
  },
  {
    id: 10,
    name: 'Friedrichsbrücke',
    location: 'Bridge over the Spree',
    x: 50,
    y: 45,
    act: 'Museum Island',
    layer: 'The view back',
    question: 'Why did the city grow up on this river?',
    understand: 'The bridge takes you off Museum Island. Halfway across I stop the group: the Bode-Museum sits at the tip of the island, the S-Bahn crosses behind it, and the Spree shows you why Berlin and its twin town Cölln grew up on these banks.',
    thenNow: 'My print here is an old view of the cathedral and this bridge from around 1890. Hold it next to the real view and look for what changed.',
    takeaway: 'Look back once before you leave. It is the view that ties the island together.'
  },
  {
    id: 11,
    name: 'Hackescher Markt',
    location: 'End of the walk',
    x: 43,
    y: 12,
    act: 'Finish',
    layer: 'The answer',
    question: 'So where is the old city?',
    understand: 'I answer the question from the World Clock here. The old city is not one place you can visit. It is scattered across the stops you just walked: a church, a fountain that moved, an empty lawn, a rebuilt facade and a museum that kept its scars.',
    thenNow: 'The S-Bahn station here opened in 1882 and its brick viaduct is still standing, so this is one of the few stops where the archive photo and the view in front of you line up.',
    takeaway: 'The walk ends here, with courtyards, coffee and the S-Bahn around you. You will read the rest of Berlin differently.'
  }
];

class BWRouteStoryElement extends HTMLElement {
  constructor() {
    super();
    this._observer = null;
    this._activeStopId = 1;
    this._reduceMotion = false;
    this._handlePinClick = this._handlePinClick.bind(this);
    this._handleJumpClick = this._handleJumpClick.bind(this);
    this._handleBookClick = this._handleBookClick.bind(this);
  }

  connectedCallback() {
    this._reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this._render();
    this._setupInteractions();
    this._setupObserver();
    this._setActiveStop(1, false);
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
    this.querySelectorAll('[data-stop-target]').forEach((button) => {
      button.removeEventListener('click', this._handlePinClick);
    });
    this.querySelectorAll('[data-act-target]').forEach((button) => {
      button.removeEventListener('click', this._handleJumpClick);
    });
    this.querySelectorAll('[data-bw-book-route-story]').forEach((link) => {
      link.removeEventListener('click', this._handleBookClick);
    });
  }

  _render() {
    const stops = BW_ROUTE_STORY_STOPS;
    const acts = Array.from(new Set(stops.map((stop) => stop.act)));

    this.innerHTML = `
      <style>${this._styles()}</style>
      <article class="bw-route-story bw-page-editorial" data-editorial-build="four-page-editorial-20260717" aria-labelledby="bw-rs-title">
        <section class="bw-rs-hero">
          <picture class="bw-rs-hero-media" aria-hidden="true">
            <source srcset="${BW_ROUTE_STORY_HERO_IMAGE_URL}" type="image/webp">
            <img src="${BW_ROUTE_STORY_HERO_FALLBACK_URL}" alt="" loading="eager" decoding="async">
          </picture>
          <div class="bw-rs-hero-overlay" aria-hidden="true"></div>
          <div class="bw-rs-inner bw-rs-hero-inner">
            <span class="bw-rs-kicker">Berlin Then and Now: the route</span>
            <h1 id="bw-rs-title">Berlin Walking Tour Route from Alexanderplatz</h1>
            <p class="bw-rs-hero-lead">Berlin's old city did not survive. This is my walk through where it stood, from the World Clock on Alexanderplatz to Hackescher Markt: 11 stops covering 16 places, about 3 km and about 2.5 hours. At every stop I hold up an archive photo of the same place, so you can see what stood there and what is left.</p>
            <div class="bw-rs-actions">
              <a class="bw-rs-btn bw-rs-btn-primary" href="${BW_ROUTE_STORY_BOOKING_URL}" data-bw-book-route-story>See dates and book</a>
              <a class="bw-rs-btn bw-rs-btn-ghost" href="#bw-route-story-map">Explore the stops</a>
            </div>
            <dl class="bw-rs-facts" aria-label="Tour facts">
              <div><dt>Stops</dt><dd>11 stops, 16 places</dd></div>
              <div><dt>Duration</dt><dd>About 2.5 hours, about 3 km</dd></div>
              <div><dt>Route</dt><dd>World Clock to Hackescher Markt, 12:30 start</dd></div>
              <div><dt>Price</dt><dd>&euro;25 per person, max 10 people</dd></div>
            </dl>
          </div>
        </section>

        <section class="bw-rs-intro" aria-label="Route logic">
          <div class="bw-rs-inner bw-rs-intro-grid">
            <div>
              <span class="bw-rs-eyebrow">Route logic</span>
              <h2>Each stop answers part of one question: where did old Berlin go?</h2>
            </div>
            <p>The streets where the city grew up were cleared after the war, and much of what people call the old town today is a 1980s rebuild. So I walk you across the ground where the old city actually stood. By Hackescher Markt, the medieval centre, the GDR centre, the palace site and Museum Island are no longer separate sights. They are one story of a city that was cleared, rebuilt and argued over.</p>
          </div>
        </section>

        <section id="bw-route-story-map" class="bw-rs-map-section" aria-label="Interactive route story map">
          <div class="bw-rs-inner">
            <div class="bw-rs-act-nav" aria-label="Story chapters">
              ${acts.map((act) => `
                <button class="bw-rs-act-btn" type="button" data-act-target="${this._escapeAttr(act)}">${this._escapeHTML(act)}</button>
              `).join('')}
            </div>

            <div class="bw-rs-story-grid">
              <aside class="bw-rs-map-panel" aria-label="Illustrated route map">
                <div class="bw-rs-map-frame">
                  <img
                    class="bw-rs-map-image"
                    src="${BW_ROUTE_STORY_MAP_IMAGE_URL}"
                    srcset="${BW_ROUTE_STORY_MAP_IMAGE_720_URL} 720w, ${BW_ROUTE_STORY_MAP_IMAGE_URL} 960w, ${BW_ROUTE_STORY_MAP_IMAGE_1200_URL} 1200w"
                    sizes="(max-width: 1040px) calc(100vw - 36px), 560px"
                    alt="Illustrated BerlinWalk route map from Alexanderplatz to Hackescher Markt"
                    loading="lazy"
                    decoding="async"
                  >
                  <svg class="bw-rs-path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                    <path d="${this._escapeAttr(this._pathD(stops))}" />
                  </svg>
                  <div class="bw-rs-pins">
                    ${stops.map((stop) => this._renderPin(stop)).join('')}
                  </div>
                </div>
                <div class="bw-rs-map-caption">
                  <strong>World Clock to Hackescher Markt</strong>
                  <span>About 2.5 hours and about 3 km, flat and walkable, with an archive photo at every stop.</span>
                </div>
              </aside>

              <div class="bw-rs-stops" aria-label="Route stops">
                ${stops.map((stop) => this._renderStop(stop)).join('')}
              </div>
            </div>
          </div>
        </section>

        <section class="bw-rs-proof">
          <div class="bw-rs-inner bw-rs-proof-grid">
            <figure class="bw-rs-photo bw-rs-photo-wide">
              <img src="${BW_ROUTE_STORY_DOM_IMAGE_URL}" alt="Berliner Dom and the TV Tower seen from the BerlinWalk route" loading="lazy" decoding="async">
              <figcaption>Same route, different layers of Berlin.</figcaption>
            </figure>
            <div class="bw-rs-proof-copy">
              <span class="bw-rs-eyebrow">Then and now</span>
              <h2>An archive photo of the same place at every stop.</h2>
              <p>I print an old photo of each place and hold it up where it was taken, as close to the same view as the street allows today. My advice: hold your phone up next to my print and take the same shot. It is the best souvenir I know from this walk.</p>
              <div class="bw-rs-proof-actions">
                <a class="bw-rs-btn bw-rs-btn-primary" href="${BW_ROUTE_STORY_BOOKING_URL}" data-bw-book-route-story>See dates and book</a>
                <a class="bw-rs-text-link" href="${BW_ROUTE_STORY_AUDIO_URL}">Listen to the 9-minute audio preview</a>
              </div>
            </div>
          </div>
        </section>

        <section class="bw-rs-final">
          <div class="bw-rs-inner bw-rs-final-grid">
            <figure class="bw-rs-photo">
              <img src="${BW_ROUTE_STORY_GROUP_IMAGE_URL}" alt="BerlinWalk guests at a Museum Island stop" loading="lazy" decoding="async">
            </figure>
            <div>
              <span class="bw-rs-eyebrow">Join the route</span>
              <h2>Walk the story in person.</h2>
              <p>Meet me at the World Clock on Alexanderplatz at 12:30 and look for my green umbrella. We walk 11 stops west through the old centre and finish at Hackescher Markt. &euro;25 per person, no more than 10 people, and a walk needs at least 2 guests. If you are the only guest one hour before the start, I cancel the walk, refund you in full and give you one of my audio walks for free. You can cancel for free or change your date up to 24 hours before the start.</p>
              <div class="bw-rs-actions">
                <a class="bw-rs-btn bw-rs-btn-yellow" href="${BW_ROUTE_STORY_BOOKING_URL}" data-bw-book-route-story>See dates and book</a>
                <a class="bw-rs-btn bw-rs-btn-outline-light" href="${BW_ROUTE_STORY_MEETING_URL}">Meeting point</a>
                <a class="bw-rs-btn bw-rs-btn-outline-light" href="${BW_ROUTE_STORY_GUIDE_URL}">Meet Yusuf</a>
              </div>
            </div>
          </div>
        </section>
      </article>
    `;
  }

  _renderPin(stop) {
    return `
      <button
        class="bw-rs-pin"
        type="button"
        style="left:${this._escapeAttr(stop.x)}%; top:${this._escapeAttr(stop.y)}%;"
        data-stop-target="${this._escapeAttr(stop.id)}"
        aria-label="Stop ${this._escapeAttr(stop.id)}: ${this._escapeAttr(stop.name)}"
      >
        <span>${this._escapeHTML(stop.id)}</span>
      </button>
    `;
  }

  _renderStop(stop) {
    return `
      <article id="bw-rs-stop-${this._escapeAttr(stop.id)}" class="bw-rs-stop" data-stop-id="${this._escapeAttr(stop.id)}">
        <div class="bw-rs-stop-index" aria-hidden="true">${String(stop.id).padStart(2, '0')}</div>
        <div class="bw-rs-stop-body">
          <div class="bw-rs-stop-meta">
            <span>${this._escapeHTML(stop.act)}</span>
            <span>${this._escapeHTML(stop.layer)}</span>
          </div>
          <h3>${this._escapeHTML(stop.name)}</h3>
          <p class="bw-rs-location">${this._escapeHTML(stop.location)}</p>
          <p class="bw-rs-question">${this._escapeHTML(stop.question)}</p>
          <div class="bw-rs-understand">
            <strong>What you understand here</strong>
            <p>${this._escapeHTML(stop.understand)}</p>
          </div>
          <div class="bw-rs-detail-grid">
            <div>
              <strong>Then and now</strong>
              <p>${this._escapeHTML(stop.thenNow)}</p>
            </div>
            <div>
              <strong>Takeaway</strong>
              <p>${this._escapeHTML(stop.takeaway)}</p>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  _setupInteractions() {
    this.querySelectorAll('[data-stop-target]').forEach((button) => {
      button.addEventListener('click', this._handlePinClick);
    });
    this.querySelectorAll('[data-act-target]').forEach((button) => {
      button.addEventListener('click', this._handleJumpClick);
    });
    this.querySelectorAll('[data-bw-book-route-story]').forEach((link) => {
      link.addEventListener('click', this._handleBookClick);
    });
  }

  _setupObserver() {
    if (!('IntersectionObserver' in window)) return;

    this._observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible && visible.target) {
        const id = Number(visible.target.getAttribute('data-stop-id'));
        if (id) this._setActiveStop(id, false);
      }
    }, {
      root: null,
      rootMargin: '-28% 0px -52% 0px',
      threshold: [0.12, 0.28, 0.48, 0.68]
    });

    this.querySelectorAll('.bw-rs-stop').forEach((stop) => this._observer.observe(stop));
  }

  _handlePinClick(event) {
    const target = event.currentTarget;
    const id = Number(target.getAttribute('data-stop-target'));
    this._scrollToStop(id);
    this._setActiveStop(id, true);
    this._track('bw_route_story_stop_click', { stop_id: id });
  }

  _handleJumpClick(event) {
    const act = event.currentTarget.getAttribute('data-act-target');
    const stop = BW_ROUTE_STORY_STOPS.find((item) => item.act === act);
    if (!stop) return;
    this._scrollToStop(stop.id);
    this._setActiveStop(stop.id, true);
    this._track('bw_route_story_act_click', { act });
  }

  _handleBookClick() {
    this._track('bw_route_story_book_click', { source: 'route_story' });
  }

  _scrollToStop(id) {
    const stop = this.querySelector(`#bw-rs-stop-${id}`);
    if (!stop) return;
    stop.scrollIntoView({ behavior: this._reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }

  _setActiveStop(id, userInitiated) {
    this._activeStopId = id;
    this.querySelectorAll('.bw-rs-pin').forEach((pin) => {
      const active = Number(pin.getAttribute('data-stop-target')) === id;
      pin.classList.toggle('active', active);
      pin.setAttribute('aria-current', active ? 'step' : 'false');
    });
    this.querySelectorAll('.bw-rs-stop').forEach((stop) => {
      stop.classList.toggle('active', Number(stop.getAttribute('data-stop-id')) === id);
    });
    this.querySelectorAll('.bw-rs-act-btn').forEach((button) => {
      const stop = BW_ROUTE_STORY_STOPS.find((item) => item.id === id);
      const active = stop && button.getAttribute('data-act-target') === stop.act;
      button.classList.toggle('active', Boolean(active));
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    if (userInitiated) {
      const mapPanel = this.querySelector('.bw-rs-map-panel');
      if (mapPanel) mapPanel.setAttribute('data-active-stop', String(id));
    }
  }

  _pathD(stops) {
    return stops.map((stop, index) => `${index === 0 ? 'M' : 'L'} ${stop.x},${stop.y}`).join(' ');
  }

  _track(eventName, payload) {
    const data = Object.assign({ event: eventName }, payload || {});
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(data);
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, payload || {});
    }
  }

  _escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));
  }

  _escapeAttr(value) {
    return this._escapeHTML(value);
  }

  _styles() {
    return `
      bw-route-story {
        display: block;
        width: 100%;
      }

      .bw-route-story {
        --green: #1B5E20;
        --green-dark: #102414;
        --yellow: #FFE600;
        --lime: #7CB342;
        --light-green: #C5E1A5;
        --cream: #FAFAF5;
        --paper: #FFFFFF;
        --text: #212121;
        --muted: #4E5A4E;
        --line: #E2E8D7;
        --serif: Merriweather, Georgia, serif;
        background: var(--cream);
        color: var(--text);
        font-family: Montserrat, Arial, sans-serif;
        margin: 0;
        max-width: 100%;
      }

      .bw-route-story *,
      .bw-route-story *::before,
      .bw-route-story *::after {
        box-sizing: border-box;
      }

      .bw-route-story h1,
      .bw-route-story h2,
      .bw-route-story h3,
      .bw-route-story p,
      .bw-route-story figure,
      .bw-route-story dl {
        margin-top: 0;
      }

      .bw-route-story a {
        color: inherit;
      }

      .bw-route-story .bw-rs-inner {
        margin: 0 auto;
        max-width: 1180px;
        padding-left: 24px;
        padding-right: 24px;
        width: 100%;
      }

      .bw-route-story .bw-rs-hero {
        align-items: end;
        background: var(--green-dark);
        color: #FFFFFF;
        display: grid;
        min-height: min(720px, 72vh);
        overflow: hidden;
        padding: 94px 0 54px;
        position: relative;
      }

      .bw-route-story .bw-rs-hero-media,
      .bw-route-story .bw-rs-hero-media img,
      .bw-route-story .bw-rs-hero-overlay {
        inset: 0;
        position: absolute;
      }

      .bw-route-story .bw-rs-hero-media img {
        display: block;
        height: 100%;
        object-fit: cover;
        object-position: center;
        width: 100%;
      }

      .bw-route-story .bw-rs-hero-overlay {
        background:
          linear-gradient(90deg, rgba(16, 36, 20, 0.92) 0%, rgba(16, 36, 20, 0.70) 48%, rgba(16, 36, 20, 0.28) 100%),
          linear-gradient(180deg, rgba(16, 36, 20, 0.18), rgba(16, 36, 20, 0.86));
      }

      .bw-route-story .bw-rs-hero-inner {
        position: relative;
        z-index: 1;
      }

      .bw-route-story .bw-rs-kicker,
      .bw-route-story .bw-rs-eyebrow {
        color: var(--yellow);
        display: inline-flex;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 1.5px;
        line-height: 1.35;
        margin-bottom: 16px;
        text-transform: uppercase;
      }

      .bw-route-story h1 {
        color: #FFFFFF;
        font-size: 76px;
        font-weight: 800;
        letter-spacing: 0;
        line-height: 0.98;
        margin-bottom: 20px;
        max-width: 820px;
      }

      .bw-route-story .bw-rs-hero-lead {
        color: rgba(255, 255, 255, 0.88);
        font-family: var(--serif);
        font-size: 19px;
        line-height: 1.68;
        margin-bottom: 28px;
        max-width: 690px;
      }

      .bw-route-story .bw-rs-actions,
      .bw-route-story .bw-rs-proof-actions {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }

      .bw-route-story .bw-rs-btn {
        align-items: center;
        border-radius: 999px;
        display: inline-flex;
        font-size: 13px;
        font-weight: 800;
        justify-content: center;
        letter-spacing: 0.5px;
        line-height: 1.2;
        min-height: 48px;
        padding: 14px 22px;
        text-decoration: none;
        text-transform: uppercase;
        transition: background 160ms ease, color 160ms ease, transform 160ms ease, border-color 160ms ease;
      }

      .bw-route-story .bw-rs-btn::after {
        content: ">";
        font-size: 14px;
        margin-left: 9px;
      }

      .bw-route-story .bw-rs-btn-primary {
        background: var(--green);
        color: #FFFFFF;
      }

      .bw-route-story .bw-rs-btn-primary:hover,
      .bw-route-story .bw-rs-btn-primary:focus-visible {
        background: #124516;
        transform: translateY(-1px);
      }

      .bw-route-story .bw-rs-btn-yellow {
        background: var(--yellow);
        color: var(--green);
      }

      .bw-route-story .bw-rs-btn-yellow:hover,
      .bw-route-story .bw-rs-btn-yellow:focus-visible {
        background: #fff04a;
        transform: translateY(-1px);
      }

      .bw-route-story .bw-rs-btn-ghost {
        border: 2px solid rgba(255, 255, 255, 0.72);
        color: #FFFFFF;
      }

      .bw-route-story .bw-rs-btn-ghost:hover,
      .bw-route-story .bw-rs-btn-ghost:focus-visible {
        background: #FFFFFF;
        border-color: #FFFFFF;
        color: var(--green);
        transform: translateY(-1px);
      }

      .bw-route-story .bw-rs-btn-outline-light {
        border: 2px solid rgba(255, 255, 255, 0.62);
        color: #FFFFFF;
      }

      .bw-route-story .bw-rs-btn-outline-light:hover,
      .bw-route-story .bw-rs-btn-outline-light:focus-visible {
        background: #FFFFFF;
        border-color: #FFFFFF;
        color: var(--green);
        transform: translateY(-1px);
      }

      .bw-route-story a:focus-visible,
      .bw-route-story button:focus-visible {
        outline: 3px solid rgba(255, 230, 0, 0.9);
        outline-offset: 3px;
      }

      .bw-route-story .bw-rs-facts {
        display: grid;
        gap: 1px;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        margin: 34px 0 0;
        max-width: 930px;
      }

      .bw-route-story .bw-rs-facts div {
        background: rgba(250, 250, 245, 0.12);
        border: 1px solid rgba(255, 255, 255, 0.16);
        min-width: 0;
        padding: 16px 18px;
      }

      .bw-route-story .bw-rs-facts dt {
        color: var(--yellow);
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 1.2px;
        margin-bottom: 6px;
        text-transform: uppercase;
      }

      .bw-route-story .bw-rs-facts dd {
        color: #FFFFFF;
        font-size: 14px;
        font-weight: 800;
        line-height: 1.35;
        margin: 0;
      }

      .bw-route-story .bw-rs-intro {
        background: #FFFFFF;
        border-bottom: 1px solid var(--line);
        padding: 42px 0;
      }

      .bw-route-story .bw-rs-intro-grid {
        align-items: start;
        display: grid;
        gap: 30px;
        grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
      }

      .bw-route-story .bw-rs-intro h2,
      .bw-route-story .bw-rs-proof h2,
      .bw-route-story .bw-rs-final h2 {
        color: var(--green);
        font-size: 34px;
        font-weight: 800;
        letter-spacing: 0;
        line-height: 1.12;
        margin-bottom: 0;
      }

      .bw-route-story .bw-rs-intro p {
        color: var(--muted);
        font-family: var(--serif);
        font-size: 17px;
        line-height: 1.75;
        margin-bottom: 0;
      }

      .bw-route-story .bw-rs-map-section {
        background:
          linear-gradient(90deg, rgba(255, 230, 0, 0.12) 0 1px, transparent 1px 84px),
          var(--cream);
        padding: 34px 0 72px;
      }

      .bw-route-story .bw-rs-act-nav {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 24px;
      }

      .bw-route-story .bw-rs-act-btn {
        appearance: none;
        background: #FFFFFF;
        border: 1px solid var(--line);
        border-radius: 999px;
        color: var(--green);
        cursor: pointer;
        font-family: inherit;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.7px;
        line-height: 1;
        min-height: 38px;
        padding: 11px 14px;
        text-transform: uppercase;
        transition: background 150ms ease, border-color 150ms ease, color 150ms ease, transform 150ms ease;
      }

      .bw-route-story .bw-rs-act-btn:hover,
      .bw-route-story .bw-rs-act-btn:focus-visible,
      .bw-route-story .bw-rs-act-btn.active {
        background: var(--green);
        border-color: var(--green);
        color: #FFFFFF;
        transform: translateY(-1px);
      }

      .bw-route-story .bw-rs-story-grid {
        align-items: start;
        display: grid;
        gap: 32px;
        grid-template-columns: minmax(320px, 0.82fr) minmax(0, 1.18fr);
      }

      .bw-route-story .bw-rs-map-panel {
        align-self: start;
        position: sticky;
        top: 18px;
      }

      .bw-route-story .bw-rs-map-frame {
        aspect-ratio: 16 / 9;
        background: #FFFFFF;
        border: 1px solid var(--line);
        border-radius: 8px;
        box-shadow: 0 18px 44px rgba(27, 94, 32, 0.12);
        overflow: hidden;
        position: relative;
      }

      .bw-route-story .bw-rs-map-image {
        display: block;
        height: 100%;
        object-fit: cover;
        width: 100%;
      }

      .bw-route-story .bw-rs-path {
        inset: 0;
        pointer-events: none;
        position: absolute;
        width: 100%;
        height: 100%;
      }

      .bw-route-story .bw-rs-path path {
        fill: none;
        stroke: var(--yellow);
        stroke-dasharray: 1 1;
        stroke-linecap: round;
        stroke-width: 0.56;
      }

      .bw-route-story .bw-rs-pins {
        inset: 0;
        position: absolute;
      }

      .bw-route-story .bw-rs-pin {
        align-items: center;
        appearance: none;
        background: var(--yellow);
        border: 2px solid var(--green);
        border-radius: 999px;
        box-shadow: 0 4px 12px rgba(16, 36, 20, 0.26);
        color: var(--green);
        cursor: pointer;
        display: inline-flex;
        height: 32px;
        justify-content: center;
        min-height: 32px;
        min-width: 32px;
        padding: 0;
        position: absolute;
        transform: translate(-50%, -50%);
        transition: background 150ms ease, border-color 150ms ease, color 150ms ease, transform 150ms ease, box-shadow 150ms ease;
        width: 32px;
        z-index: 2;
      }

      .bw-route-story .bw-rs-pin span {
        color: currentColor;
        font-size: 12px;
        font-weight: 800;
        line-height: 1;
      }

      .bw-route-story .bw-rs-pin::after {
        content: '';
        inset: -8px;
        position: absolute;
      }

      .bw-route-story .bw-rs-pin:hover,
      .bw-route-story .bw-rs-pin:focus-visible {
        transform: translate(-50%, -50%) scale(1.12);
      }

      .bw-route-story .bw-rs-pin.active {
        background: var(--green);
        border-color: var(--yellow);
        color: var(--yellow);
        transform: translate(-50%, -50%) scale(1.18);
        z-index: 4;
      }

      .bw-route-story .bw-rs-map-caption {
        background: #FFFFFF;
        border: 1px solid var(--line);
        border-radius: 8px;
        display: grid;
        gap: 6px;
        margin-top: 12px;
        padding: 16px;
      }

      .bw-route-story .bw-rs-map-caption strong {
        color: var(--green);
        font-size: 14px;
        font-weight: 800;
        line-height: 1.25;
      }

      .bw-route-story .bw-rs-map-caption span {
        color: var(--muted);
        font-family: var(--serif);
        font-size: 13px;
        line-height: 1.55;
      }

      .bw-route-story .bw-rs-stops {
        display: grid;
        gap: 16px;
      }

      .bw-route-story .bw-rs-stop {
        background: #FFFFFF;
        border: 1px solid var(--line);
        border-left: 6px solid var(--light-green);
        border-radius: 8px;
        display: grid;
        gap: 18px;
        grid-template-columns: 58px minmax(0, 1fr);
        padding: 22px 24px 24px 18px;
        scroll-margin-top: 92px;
        transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
      }

      .bw-route-story .bw-rs-stop.active {
        border-left-color: var(--green);
        box-shadow: 0 16px 36px rgba(27, 94, 32, 0.1);
        transform: translateY(-1px);
      }

      .bw-route-story .bw-rs-stop-index {
        align-items: center;
        background: var(--green);
        border-radius: 999px;
        color: var(--yellow);
        display: inline-flex;
        font-size: 14px;
        font-weight: 800;
        height: 42px;
        justify-content: center;
        letter-spacing: 0.8px;
        width: 42px;
      }

      .bw-route-story .bw-rs-stop-body {
        min-width: 0;
      }

      .bw-route-story .bw-rs-stop-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 12px;
      }

      .bw-route-story .bw-rs-stop-meta span {
        background: #F3F8EA;
        border: 1px solid #DDEBCB;
        border-radius: 999px;
        color: var(--green);
        display: inline-flex;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.6px;
        line-height: 1;
        padding: 8px 10px;
        text-transform: uppercase;
      }

      .bw-route-story .bw-rs-stop h3 {
        color: var(--green);
        font-size: 26px;
        font-weight: 800;
        letter-spacing: 0;
        line-height: 1.15;
        margin-bottom: 4px;
      }

      .bw-route-story .bw-rs-location {
        color: var(--muted);
        font-family: var(--serif);
        font-size: 14px;
        font-style: italic;
        line-height: 1.45;
        margin-bottom: 14px;
      }

      .bw-route-story .bw-rs-question {
        color: var(--text);
        font-size: 18px;
        font-weight: 800;
        line-height: 1.35;
        margin-bottom: 16px;
      }

      .bw-route-story .bw-rs-understand {
        border-top: 1px solid var(--line);
        padding-top: 16px;
      }

      .bw-route-story .bw-rs-understand strong,
      .bw-route-story .bw-rs-detail-grid strong {
        color: var(--green);
        display: block;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 1px;
        line-height: 1.25;
        margin-bottom: 7px;
        text-transform: uppercase;
      }

      .bw-route-story .bw-rs-understand p,
      .bw-route-story .bw-rs-detail-grid p {
        color: var(--muted);
        font-family: var(--serif);
        font-size: 15px;
        line-height: 1.72;
        margin-bottom: 0;
      }

      .bw-route-story .bw-rs-detail-grid {
        display: grid;
        gap: 18px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        margin-top: 18px;
      }

      .bw-route-story .bw-rs-proof {
        background: #FFFFFF;
        border-top: 1px solid var(--line);
        padding: 72px 0;
      }

      .bw-route-story .bw-rs-proof-grid,
      .bw-route-story .bw-rs-final-grid {
        align-items: center;
        display: grid;
        gap: 44px;
        grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
      }

      .bw-route-story .bw-rs-photo {
        border-radius: 8px;
        margin: 0;
        overflow: hidden;
        position: relative;
      }

      .bw-route-story .bw-rs-photo img {
        aspect-ratio: 4 / 3;
        display: block;
        height: 100%;
        object-fit: cover;
        width: 100%;
      }

      .bw-route-story .bw-rs-photo-wide img {
        aspect-ratio: 16 / 10;
      }

      .bw-route-story .bw-rs-photo figcaption {
        background: rgba(16, 36, 20, 0.88);
        bottom: 14px;
        color: #FFFFFF;
        font-size: 12px;
        font-weight: 800;
        left: 14px;
        letter-spacing: 0.8px;
        line-height: 1.3;
        padding: 8px 10px;
        position: absolute;
        text-transform: uppercase;
      }

      .bw-route-story .bw-rs-proof h2 {
        margin-bottom: 16px;
        max-width: 620px;
      }

      .bw-route-story .bw-rs-proof-copy p {
        color: var(--muted);
        font-family: var(--serif);
        font-size: 16px;
        line-height: 1.72;
        margin-bottom: 22px;
        max-width: 620px;
      }

      .bw-route-story .bw-rs-text-link {
        color: var(--green);
        font-size: 14px;
        font-weight: 800;
        line-height: 1.4;
        text-decoration: underline;
        text-decoration-thickness: 2px;
        text-underline-offset: 4px;
      }

      .bw-route-story .bw-rs-final {
        background:
          linear-gradient(120deg, rgba(255, 230, 0, 0.18), transparent 46%),
          #FFFFFF;
        border-bottom: 6px solid var(--yellow);
        border-top: 1px solid var(--line);
        color: var(--text);
        padding: 72px 0;
      }

      .bw-route-story .bw-rs-final .bw-rs-eyebrow {
        color: var(--green);
      }

      .bw-route-story .bw-rs-final h2 {
        color: var(--green);
        margin-bottom: 14px;
      }

      .bw-route-story .bw-rs-final p {
        color: var(--muted);
        font-family: var(--serif);
        font-size: 17px;
        line-height: 1.72;
        margin-bottom: 24px;
        max-width: 620px;
      }

      .bw-route-story .bw-rs-final .bw-rs-btn-outline-light {
        border-color: var(--green);
        color: var(--green);
      }

      .bw-route-story .bw-rs-final .bw-rs-btn-outline-light:hover,
      .bw-route-story .bw-rs-final .bw-rs-btn-outline-light:focus-visible {
        background: var(--green);
        border-color: var(--green);
        color: #FFFFFF;
      }

      @media (max-width: 980px) {
        .bw-route-story .bw-rs-hero {
          min-height: 620px;
          padding-top: 80px;
        }

        .bw-route-story h1 {
          font-size: 52px;
        }

        .bw-route-story .bw-rs-facts {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .bw-route-story .bw-rs-intro-grid,
        .bw-route-story .bw-rs-story-grid,
        .bw-route-story .bw-rs-proof-grid,
        .bw-route-story .bw-rs-final-grid {
          grid-template-columns: minmax(0, 1fr);
        }

        .bw-route-story .bw-rs-map-panel {
          position: relative;
          top: auto;
        }
      }

      @media (max-width: 640px) {
        .bw-route-story .bw-rs-inner {
          padding-left: 18px;
          padding-right: 18px;
        }

        .bw-route-story .bw-rs-hero {
          min-height: 590px;
          padding: 72px 0 34px;
        }

        .bw-route-story h1 {
          font-size: 40px;
          line-height: 1.02;
        }

        .bw-route-story .bw-rs-hero-lead {
          font-size: 16px;
          line-height: 1.62;
        }

        .bw-route-story .bw-rs-actions,
        .bw-route-story .bw-rs-proof-actions {
          align-items: stretch;
          flex-direction: column;
        }

        .bw-route-story .bw-rs-btn {
          width: 100%;
        }

        .bw-route-story .bw-rs-facts {
          grid-template-columns: minmax(0, 1fr);
        }

        .bw-route-story .bw-rs-intro,
        .bw-route-story .bw-rs-proof,
        .bw-route-story .bw-rs-final {
          padding-bottom: 46px;
          padding-top: 46px;
        }

        .bw-route-story .bw-rs-intro h2,
        .bw-route-story .bw-rs-proof h2,
        .bw-route-story .bw-rs-final h2 {
          font-size: 28px;
        }

        .bw-route-story .bw-rs-map-section {
          padding-bottom: 48px;
        }

        .bw-route-story .bw-rs-act-nav {
          flex-wrap: nowrap;
          margin-left: -18px;
          margin-right: -18px;
          overflow-x: auto;
          padding: 0 18px 6px;
          scrollbar-width: none;
        }

        .bw-route-story .bw-rs-act-nav::-webkit-scrollbar {
          display: none;
        }

        .bw-route-story .bw-rs-act-btn {
          flex: 0 0 auto;
        }

        .bw-route-story .bw-rs-map-frame {
          border-radius: 6px;
        }

        .bw-route-story .bw-rs-pin {
          height: 27px;
          min-height: 27px;
          min-width: 27px;
          width: 27px;
        }

        .bw-route-story .bw-rs-pin::after {
          inset: -9px;
        }

        .bw-route-story .bw-rs-pin span {
          font-size: 11px;
        }

        .bw-route-story .bw-rs-stop {
          gap: 12px;
          grid-template-columns: minmax(0, 1fr);
          padding: 18px;
          scroll-margin-top: 72px;
        }

        .bw-route-story .bw-rs-stop-index {
          height: 36px;
          width: 36px;
        }

        .bw-route-story .bw-rs-stop h3 {
          font-size: 23px;
        }

        .bw-route-story .bw-rs-question {
          font-size: 16px;
        }

        .bw-route-story .bw-rs-detail-grid {
          grid-template-columns: minmax(0, 1fr);
        }

        .bw-route-story .bw-rs-photo figcaption {
          bottom: 10px;
          left: 10px;
          max-width: calc(100% - 20px);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .bw-route-story *,
        .bw-route-story *::before,
        .bw-route-story *::after {
          scroll-behavior: auto !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
  }
}

if (!customElements.get('bw-route-story')) {
  customElements.define('bw-route-story', BWRouteStoryElement);
}
