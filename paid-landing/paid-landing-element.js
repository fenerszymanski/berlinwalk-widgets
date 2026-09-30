(function () {
  const SCRIPT_URL = document.currentScript?.src || '';
  const BASE_URL = SCRIPT_URL
    ? new URL('../', SCRIPT_URL).toString()
    : 'https://fenerszymanski.github.io/berlinwalk-widgets/';
  // Berlin Then and Now is booked on its own booking page. This landing keeps
  // the story, the route and the facts, then hands the visitor over with the
  // five UTM keys (never click ids). Live dates come from Wix service 145cb27e.
  const BOOKING_URL = 'https://www.walkofberlin.com/book-berlin-walking-tour/berlin-then-and-now';
  const TOUR_SERVICE_ID = '145cb27e-c5bd-456d-bfbd-a09d4d6f5f9d';
  const AVAILABILITY_URL = `https://berlinwalk-content-app.vercel.app/api/booking-calendar-availability?days=120&guests=1&serviceId=${TOUR_SERVICE_ID}`;
  const ROUTE_PAGE_URL = 'https://www.walkofberlin.com/berlin-walking-tour-route';
  const PRIVATE_TOUR_URL = 'https://www.walkofberlin.com/private-tour';
  const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const FAQ_ITEMS = [
    {
      icon: 'question',
      q: 'What is Berlin Then and Now?',
      short: 'My walk through the Berlin that is gone.',
      a: 'It is my walking tour through the part of Berlin that is gone. The streets where the city grew up were cleared after the war, and much of what people call the old town today is a 1980s rebuild. At every stop I hold up an archive photo of the same place, so you can see what stood there and what is left.',
    },
    {
      icon: 'clock',
      q: 'How long is it and where does it go?',
      short: 'About 2.5 hours, from the World Clock to Hackescher Markt.',
      a: 'About 2.5 hours and about 3 km on foot. We start at the World Clock on Alexanderplatz and end at Hackescher Markt: 11 stops covering 16 places, from the TV Tower and the Marienkirche to the Humboldt Forum and Museum Island.',
    },
    {
      icon: 'coins',
      q: 'How much does it cost?',
      short: '€25 per person, paid when you book.',
      a: '€25 per person, paid when you book. That is the same price on every site that sells it.',
    },
    {
      icon: 'flag',
      q: 'How big is the group, and does my date run?',
      short: 'No more than 10 people. A walk needs at least 2 guests.',
      a: 'No more than 10 people. A walk needs at least 2 guests. If you are the only guest one hour before the start, I cancel the walk, refund you in full and give you one of my audio walks for free.',
    },
    {
      icon: 'map-pin',
      q: 'Where do I meet you?',
      short: 'At the World Clock on Alexanderplatz.',
      a: 'At the World Clock (Weltzeituhr) on Alexanderplatz. Come 5 minutes before the start and look for my green umbrella.',
    },
    {
      icon: 'calendar',
      q: 'Can I cancel or change my date?',
      short: 'Yes, up to 24 hours before the start.',
      a: 'Yes. Cancel up to 24 hours before the start and you get a full refund, or move to another date if there is space. Later than that I cannot refund. If I have to cancel, for weather or anything else, you get your money back in full.',
    },
    {
      icon: 'question',
      q: 'What if it rains?',
      short: 'The walk runs in light rain.',
      a: 'The walk runs in light rain, so bring a jacket. If the weather makes it unsafe, I cancel and refund you in full.',
    },
    {
      icon: 'chat-circle',
      q: 'Is it in English, and can I book it just for my group?',
      short: 'In English. Private walks from €249.',
      a: 'The walk is in English. For your own group I run private walks: €249 for up to 6 people or €299 for up to 10.',
    },
  ];
  // OSM walking-way overview projected onto the approved geographic map v2.
  // This is an illustrative overview; route/data.json belongs to the older map.
  const ROUTE_OVERVIEW_PATH = 'M88.013 40.802 L87.860 40.294 L85.988 42.869 L85.712 43.250 L85.602 43.401 L84.863 44.314 L84.269 45.051 L83.391 46.137 L82.440 48.010 L80.225 50.832 L78.942 52.468 L78.781 52.367 L78.699 52.316 L78.596 52.251 L77.382 51.491 L74.796 49.873 L72.244 48.256 L71.888 48.762 L71.687 49.166 L70.492 50.732 L69.539 51.392 L68.021 53.222 L68.265 53.569 L68.336 54.024 L68.363 54.186 L68.350 54.368 L68.118 55.604 L68.109 55.759 L68.109 55.934 L68.113 56.131 L68.131 56.307 L68.207 56.881 L68.370 57.564 L68.623 58.443 L68.613 58.827 L68.543 59.480 L68.410 60.044 L68.247 60.450 L67.981 60.832 L68.222 61.320 L68.600 62.043 L67.972 62.269 L67.683 62.373 L66.187 64.146 L66.033 64.329 L65.767 64.644 L64.881 65.241 L64.460 65.751 L61.528 60.318 L61.104 59.606 L61.363 59.184 L61.545 58.676 L61.639 58.111 L61.637 57.529 L61.541 56.966 L61.357 56.459 L61.099 56.043 L60.782 55.742 L60.427 55.574 L60.056 55.550 L59.693 55.671 L59.670 54.097 L60.742 52.849 L60.490 52.396 L58.048 47.781 L58.195 47.111 L58.535 46.686 L59.286 45.746 L60.758 45.511 L59.286 45.746 L58.535 46.686 L58.195 47.111 L58.048 47.781 L57.264 47.753 L53.503 52.596 L53.212 53.194 L53.263 53.737 L53.040 54.011 L52.733 54.389 L52.319 54.899 L52.171 55.081 L52.033 55.251 L51.853 55.472 L51.747 55.603 L51.449 55.971 L51.599 56.156 L51.155 58.982 L50.970 59.838 L50.708 60.531 L50.265 61.457 L49.932 62.128 L49.641 62.939 L49.548 63.618 L49.139 63.821 L48.787 64.060 L48.390 64.390 L48.174 64.644 L47.912 64.976 L48.174 64.644 L48.390 64.390 L47.793 62.960 L47.210 63.494 L46.628 64.171 L45.979 64.839 L45.306 65.454 L44.661 65.962 L43.975 66.469 L43.509 66.666 L42.772 66.022 L42.361 66.407 L42.177 66.579 L39.530 69.346 L39.403 69.497 L38.891 70.061 L38.816 70.176 L38.556 70.573 L39.821 73.292 L40.106 73.903 L39.895 74.128 L37.344 76.852 L37.116 76.343 L35.745 73.328 L34.089 74.957 L33.438 75.614 L33.376 75.457 L33.273 75.197 L33.120 74.793 L32.696 73.741 L32.530 73.318 L32.457 73.130 L33.110 72.491 L33.560 72.048 L32.877 70.354 L31.386 66.754 L30.261 64.006 L31.136 63.142 L30.261 64.006 L28.947 60.821 L27.128 62.646 L27.070 62.573 L26.956 62.486 L26.833 62.437 L26.705 62.429 L26.580 62.462 L26.461 62.534 L26.353 62.260 L26.107 61.636 L26.353 62.260 L26.461 62.534 L26.365 62.631 L26.283 62.753 L26.216 62.897 L26.168 63.058 L26.140 63.230 L26.132 63.407 L26.138 63.481 L23.931 65.629 L21.763 60.254 L21.647 59.966 L21.177 58.738 L22.082 57.841 L21.630 56.977 L21.704 56.883 L21.744 56.836 L22.924 55.559 L23.991 54.404 L22.687 51.892 L22.795 51.742 L22.824 51.706 L22.283 50.671 L22.226 50.564 L22.534 50.146 L22.719 50.518 L22.534 50.146 L22.226 50.564 L22.283 50.671 L22.824 51.706 L22.795 51.742 L22.687 51.892 L23.991 54.404 L24.425 53.934 L25.678 52.589 L26.258 51.967 L28.091 49.998 L28.407 49.646 L28.425 49.624 L29.289 48.660 L29.479 48.441 L29.649 48.411 L30.149 49.060 L30.279 48.951 L32.114 47.063 L33.958 45.167 L34.073 45.064 L34.314 44.850 L34.555 44.430 L34.767 44.060 L34.927 43.957 L34.484 42.452 L34.147 41.106 L33.332 35.273 L33.343 35.054 L33.516 31.501 L33.608 29.614 L33.605 28.928 L33.604 28.820 L33.601 28.248 L35.079 28.208 L35.638 28.094 L36.926 27.707 L38.151 27.403 L38.044 26.796 L37.795 25.284 L37.756 25.051 L37.715 24.810 L37.643 24.387 L37.546 23.881 L37.357 23.177 L38.956 20.880 L39.886 19.243 L41.226 16.847';
  const TRACK_ENDPOINT = 'https://berlinwalk-content-app.vercel.app/api/pf-event';
  const PAID_TRACKING_KEY = 'bwPaidTracking.v1';
  const PAID_VISITOR_KEY = 'bwVisitorId.v1';
  const PAID_SESSION_KEY = 'bwSessionId.v1';
  const PAID_AD_IDENTIFIER_KEYS = ['fbclid', 'fbc', 'fbp'];

  const asset = (path) => new URL(path, BASE_URL).toString();
  const APPROVED_DESIGN_CSS = "@font-face {\n  font-family: \"Montserrat\";\n  src: url(\"__BW_MONTESSERAT_REGULAR__\") format(\"truetype\");\n  font-weight: 400;\n  font-style: normal;\n  font-display: swap;\n}\n\n@font-face {\n  font-family: \"Montserrat\";\n  src: url(\"__BW_MONTESSERAT_BOLD__\") format(\"truetype\");\n  font-weight: 700;\n  font-style: normal;\n  font-display: swap;\n}\n\n@font-face {\n  font-family: \"Montserrat\";\n  src: url(\"__BW_MONTESSERAT_EXTRABOLD__\") format(\"truetype\");\n  font-weight: 800;\n  font-style: normal;\n  font-display: swap;\n}\n\n.bw-paid-landing {\n  font-family: \"Montserrat\", Arial, sans-serif;\n  color: #212121;\n  background: #fafaf5;\n  font-synthesis: none;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  font-optical-sizing: auto;\n  --cream: #fafaf5;\n  --green: #1b5e20;\n  --green-deep: #123d18;\n  --yellow: #ffe600;\n  --ink: #212121;\n  --soft-ink: #526358;\n  --line: #d9e1d8;\n  --pale-green: #eff4ec;\n  --white: #ffffff;\n}\n\n.bw-paid-landing * {\n  box-sizing: border-box;\n}\n\n.bw-paid-landing {\n  min-width: 320px;\n  scroll-behavior: smooth;\n  scroll-padding-top: 28px;\n}\n\n.bw-paid-landing {\n  min-width: 320px;\n  min-height: 100vh;\n  margin: 0;\n  background: var(--cream);\n  color: var(--ink);\n  font-size: 16px;\n  line-height: 1.5;\n}\n\n.bw-paid-landing button,\n.bw-paid-landing input,\n.bw-paid-landing select {\n  font: inherit;\n}\n\n.bw-paid-landing button,\n.bw-paid-landing a,\n.bw-paid-landing input,\n.bw-paid-landing select,\n.bw-paid-landing summary {\n  -webkit-tap-highlight-color: transparent;\n}\n\n.bw-paid-landing button {\n  color: inherit;\n}\n\n.bw-paid-landing a {\n  color: var(--green-deep);\n}\n\n.bw-paid-landing a:focus-visible,\n.bw-paid-landing button:focus-visible,\n.bw-paid-landing input:focus-visible,\n.bw-paid-landing select:focus-visible,\n.bw-paid-landing summary:focus-visible {\n  outline: 3px solid #386b3c;\n  outline-offset: 4px;\n}\n\n.bw-paid-landing figure,\n.bw-paid-landing p,\n.bw-paid-landing h1,\n.bw-paid-landing h2,\n.bw-paid-landing h3 {\n  margin: 0;\n}\n\n.bw-paid-landing .preview-notice {\n  display: flex;\n  min-height: 37px;\n  align-items: center;\n  justify-content: center;\n  gap: 9px;\n  padding: 6px 18px;\n  border-bottom: 1px solid #e2e4db;\n  background: #f0f2e9;\n  color: #334d35;\n  font-size: 11px;\n  font-weight: 600;\n  letter-spacing: 0.01em;\n  text-align: center;\n}\n\n.bw-paid-landing .preview-notice__tag {\n  flex: 0 0 auto;\n  color: var(--green-deep);\n  font-size: 9px;\n  font-weight: 800;\n  letter-spacing: 0.12em;\n}\n\n.bw-paid-landing .preview-notice__separator {\n  color: #8b9788;\n}\n\n.bw-paid-landing .site-header {\n  position: relative;\n  z-index: 5;\n  display: flex;\n  width: min(1320px, calc(100% - 72px));\n  min-height: 104px;\n  align-items: center;\n  justify-content: space-between;\n  margin: 0 auto;\n}\n\n.bw-paid-landing .brand {\n  display: flex;\n  width: max-content;\n  flex-direction: column;\n  align-items: flex-start;\n  gap: 2px;\n  color: #718277;\n  font-size: 16px;\n  line-height: 1.2;\n  text-decoration: none;\n}\n\n.bw-paid-landing .brand img {\n  display: block;\n  width: 218px;\n  height: auto;\n}\n\n.bw-paid-landing .brand span {\n  padding-left: 1px;\n}\n\n.bw-paid-landing .menu-toggle {\n  display: grid;\n  width: 48px;\n  height: 48px;\n  place-items: center;\n  border: 0;\n  border-radius: 50%;\n  background: transparent;\n  color: var(--green-deep);\n  cursor: pointer;\n}\n\n.bw-paid-landing .menu-toggle:hover {\n  background: #edf1e9;\n}\n\n.bw-paid-landing .site-nav {\n  position: absolute;\n  top: 82px;\n  right: 0;\n  display: none;\n  width: min(260px, calc(100vw - 40px));\n  flex-direction: column;\n  gap: 3px;\n  padding: 11px;\n  border: 1px solid var(--line);\n  border-radius: 12px;\n  background: var(--cream);\n  box-shadow: 0 14px 35px rgb(18 61 24 / 12%);\n}\n\n.bw-paid-landing .site-nav.is-open {\n  display: flex;\n}\n\n.bw-paid-landing .site-nav a,\n.bw-paid-landing .site-nav__cta {\n  display: flex;\n  min-height: 44px;\n  align-items: center;\n  justify-content: space-between;\n  padding: 9px 11px;\n  border: 0;\n  border-radius: 7px;\n  background: transparent;\n  color: var(--green-deep);\n  font-size: 14px;\n  font-weight: 700;\n  text-align: left;\n  text-decoration: none;\n  cursor: pointer;\n}\n\n.bw-paid-landing .site-nav a:hover,\n.bw-paid-landing .site-nav__cta:hover {\n  background: var(--pale-green);\n}\n\n.bw-paid-landing .site-nav__cta {\n  background: var(--yellow);\n}\n\n.bw-paid-landing .section-wrap {\n  width: min(1240px, calc(100% - 88px));\n  margin-inline: auto;\n}\n\n.bw-paid-landing .hero {\n  display: grid;\n  min-height: 660px;\n  grid-template-columns: minmax(0, 0.88fr) minmax(420px, 1.12fr);\n  grid-template-areas:\n    \"eyebrow photo\"\n    \"title photo\"\n    \"intro photo\"\n    \"features photo\"\n    \"actions photo\";\n  align-items: center;\n  align-content: center;\n  column-gap: clamp(36px, 5vw, 78px);\n  row-gap: 0;\n  padding-top: 12px;\n  padding-bottom: 58px;\n}\n\n.bw-paid-landing .hero-eyebrow {\n  grid-area: eyebrow;\n  align-self: end;\n  margin-bottom: 13px;\n}\n\n.bw-paid-landing .hero-title {\n  grid-area: title;\n  align-self: start;\n  margin-top: 0;\n}\n\n.bw-paid-landing .eyebrow {\n  color: #4b754e;\n  font-size: 14px;\n  font-weight: 800;\n  letter-spacing: 0.065em;\n  line-height: 1.3;\n}\n\n.bw-paid-landing .hero-title {\n  color: var(--green-deep);\n  font-size: clamp(56px, 6.6vw, 92px);\n  font-weight: 800;\n  letter-spacing: -0.072em;\n  line-height: 0.98;\n}\n\n.bw-paid-landing .hero-intro {\n  grid-area: intro;\n  align-self: start;\n  max-width: 540px;\n  margin-top: 14px;\n  color: #263b2b;\n  font-size: clamp(18px, 1.8vw, 23px);\n  line-height: 1.45;\n}\n\n.bw-paid-landing .feature-list {\n  grid-area: features;\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 17px 25px;\n  margin: 25px 0 23px;\n  padding: 0;\n  list-style: none;\n}\n\n.bw-paid-landing .feature {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  color: var(--green);\n}\n\n.bw-paid-landing .feature > span {\n  display: flex;\n  flex-direction: column;\n  color: var(--green-deep);\n  font-size: 15px;\n  line-height: 1.3;\n}\n\n.bw-paid-landing .feature strong {\n  font-size: 17px;\n  font-weight: 700;\n}\n\n.bw-paid-landing .feature small {\n  color: #405346;\n  font-size: 13px;\n}\n\n.bw-paid-landing .button {\n  display: inline-flex;\n  min-height: 54px;\n  align-items: center;\n  justify-content: center;\n  gap: 12px;\n  padding: 13px 24px;\n  border: 1px solid transparent;\n  border-radius: 10px;\n  font-size: 16px;\n  font-weight: 800;\n  line-height: 1.2;\n  text-align: center;\n  text-decoration: none;\n  cursor: pointer;\n  transition: background-color 140ms ease, border-color 140ms ease, transform 140ms ease;\n}\n\n.bw-paid-landing .button:active:not(:disabled) {\n  transform: translateY(1px);\n}\n\n.bw-paid-landing .button--yellow {\n  background: var(--yellow);\n  color: var(--green-deep);\n}\n\n.bw-paid-landing .button--yellow:hover {\n  background: #f5dc00;\n  color: var(--green-deep);\n}\n\n.bw-paid-landing .hero-cta {\n  min-width: 285px;\n  min-height: 64px;\n  border-radius: 15px;\n  font-size: 22px;\n}\n\n.bw-paid-landing .hero-actions {\n  grid-area: actions;\n  align-self: start;\n}\n\n.bw-paid-landing .price-note {\n  margin-top: 14px;\n  color: #405346;\n  font-size: 14px;\n  line-height: 1.45;\n}\n\n.bw-paid-landing .hero-photo {\n  grid-area: photo;\n  grid-row: 1 / 6;\n  position: relative;\n  overflow: hidden;\n  min-height: 610px;\n  align-self: stretch;\n  border-radius: 3px 3px 16px 16px;\n  background: #e7e0d3;\n}\n\n.bw-paid-landing .hero-photo img {\n  display: block;\n  width: 100%;\n  height: 100%;\n  min-height: 610px;\n  object-fit: cover;\n  object-position: 50% 20%;\n}\n\n.bw-paid-landing .hero-photo figcaption {\n  position: absolute;\n  right: 20px;\n  bottom: 20px;\n  max-width: calc(100% - 40px);\n  padding: 9px 12px;\n  border-radius: 5px;\n  background: var(--cream);\n  color: var(--green-deep);\n  font-size: 12px;\n  font-weight: 700;\n}\n\n.bw-paid-landing .story {\n  display: grid;\n  grid-template-columns: minmax(310px, 0.88fr) minmax(420px, 1.12fr);\n  align-items: center;\n  gap: clamp(54px, 8vw, 120px);\n  padding-block: 70px 84px;\n  border-top: 1px solid var(--line);\n}\n\n.bw-paid-landing .section-mark {\n  display: block;\n  width: 44px;\n  height: 5px;\n  margin-bottom: 22px;\n  border-radius: 5px;\n  background: #4a883e;\n}\n\n.bw-paid-landing .story h2,\n.bw-paid-landing .booking-heading h2,\n.bw-paid-landing .faq-heading h2 {\n  margin-top: 14px;\n  color: var(--green-deep);\n  font-size: clamp(40px, 5vw, 64px);\n  font-weight: 800;\n  letter-spacing: -0.06em;\n  line-height: 1.02;\n}\n\n.bw-paid-landing .story-intro {\n  max-width: 425px;\n  margin-top: 20px;\n  color: #263b2b;\n  font-size: 18px;\n  line-height: 1.5;\n}\n\n.bw-paid-landing .route-points {\n  display: grid;\n  gap: 19px;\n  margin-top: 29px;\n}\n\n.bw-paid-landing .route-point {\n  display: flex;\n  align-items: flex-start;\n  gap: 15px;\n  color: var(--green);\n}\n\n.bw-paid-landing .route-point p {\n  display: flex;\n  flex-direction: column;\n  color: var(--green-deep);\n  line-height: 1.35;\n}\n\n.bw-paid-landing .route-point span {\n  font-size: 14px;\n}\n\n.bw-paid-landing .route-point strong {\n  font-size: 16px;\n  font-weight: 700;\n}\n\n.bw-paid-landing .story-photo {\n  overflow: hidden;\n  border: 1px solid #e1e3d9;\n  border-radius: 14px;\n  background: var(--white);\n}\n\n.bw-paid-landing .story-photo img {\n  display: block;\n  width: 100%;\n  aspect-ratio: 1.45;\n  object-fit: cover;\n  object-position: center 52%;\n}\n\n.bw-paid-landing .story-photo figcaption {\n  display: flex;\n  justify-content: space-between;\n  gap: 14px;\n  padding: 11px 15px;\n  color: var(--green-deep);\n  font-size: 12px;\n  font-weight: 700;\n}\n\n.bw-paid-landing .story-photo figcaption span + span {\n  color: #617263;\n  font-weight: 500;\n}\n\n.bw-paid-landing .booking {\n  padding-block: 72px 82px;\n  border-top: 1px solid var(--line);\n}\n\n.bw-paid-landing .booking-heading {\n  margin-bottom: 29px;\n}\n\n.bw-paid-landing .booking-heading h2 {\n  margin-bottom: 26px;\n}\n\n.bw-paid-landing .step-progress {\n  display: grid;\n  grid-template-columns: 1fr auto 1fr auto 1fr;\n  align-items: center;\n  gap: 14px;\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n\n.bw-paid-landing .step-progress::before,\n.bw-paid-landing .step-progress::after {\n  content: \"\";\n  height: 1px;\n  background: var(--line);\n}\n\n.bw-paid-landing .step-progress__item {\n  display: flex;\n  align-items: center;\n  gap: 9px;\n  color: #758176;\n  font-size: 13px;\n  font-weight: 600;\n  white-space: nowrap;\n}\n\n.bw-paid-landing .step-progress__item:first-child {\n  grid-column: 1;\n  grid-row: 1;\n}\n\n.bw-paid-landing .step-progress__item:nth-child(2) {\n  grid-column: 3;\n  grid-row: 1;\n}\n\n.bw-paid-landing .step-progress__item:nth-child(3) {\n  grid-column: 5;\n  grid-row: 1;\n}\n\n.bw-paid-landing .step-progress::before {\n  grid-column: 2;\n  grid-row: 1;\n}\n\n.bw-paid-landing .step-progress::after {\n  grid-column: 4;\n  grid-row: 1;\n}\n\n.bw-paid-landing .step-progress__number {\n  display: grid;\n  width: 31px;\n  height: 31px;\n  flex: 0 0 auto;\n  place-items: center;\n  border-radius: 50%;\n  background: #e9ede5;\n  color: #637065;\n  font-size: 13px;\n  font-weight: 800;\n}\n\n.bw-paid-landing .step-progress__item.is-current,\n.bw-paid-landing .step-progress__item.is-complete {\n  color: var(--green-deep);\n}\n\n.bw-paid-landing .step-progress__item.is-current .step-progress__number,\n.bw-paid-landing .step-progress__item.is-complete .step-progress__number {\n  background: var(--green);\n  color: var(--white);\n}\n\n.bw-paid-landing .booking-panel {\n  padding: clamp(22px, 4vw, 42px);\n  border: 1px solid var(--line);\n  border-radius: 14px;\n  background: #fffefa;\n}\n\n.bw-paid-landing .booking-grid {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) minmax(220px, 0.32fr);\n  gap: clamp(28px, 5vw, 62px);\n}\n\n.bw-paid-landing .subheading-row {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 18px;\n  margin-bottom: 22px;\n  color: var(--green);\n}\n\n.bw-paid-landing .subheading-row h3 {\n  color: var(--green-deep);\n  font-size: clamp(20px, 2.2vw, 26px);\n  font-weight: 800;\n  letter-spacing: -0.035em;\n  line-height: 1.2;\n}\n\n.bw-paid-landing .subheading-row p {\n  margin-top: 6px;\n  color: #667469;\n  font-size: 13px;\n}\n\n.bw-paid-landing .date-options {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 12px;\n}\n\n.bw-paid-landing .date-option {\n  display: flex;\n  min-height: 94px;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 3px;\n  padding: 10px 6px;\n  border: 1px solid var(--line);\n  border-radius: 9px;\n  background: var(--cream);\n  color: #334538;\n  cursor: pointer;\n  transition: border-color 140ms ease, background-color 140ms ease;\n}\n\n.bw-paid-landing .date-option:hover {\n  border-color: #709273;\n}\n\n.bw-paid-landing .date-option.is-selected {\n  border: 2px solid var(--green);\n  background: #eff5ec;\n  color: var(--green-deep);\n}\n\n.bw-paid-landing .date-option > span:first-child {\n  font-size: 13px;\n}\n\n.bw-paid-landing .date-option strong {\n  font-size: 18px;\n  font-weight: 700;\n}\n\n.bw-paid-landing .date-option__selected {\n  display: inline-flex;\n  align-items: center;\n  gap: 3px;\n  color: var(--green);\n  font-size: 10px;\n  font-weight: 700;\n}\n\n.bw-paid-landing .field-label {\n  display: block;\n  color: var(--green-deep);\n  font-size: 14px;\n  font-weight: 700;\n}\n\n.bw-paid-landing .time-options-block {\n  margin-top: 21px;\n}\n\n.bw-paid-landing .time-options {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 9px;\n  margin-top: 10px;\n}\n\n.bw-paid-landing .time-option {\n  display: inline-flex;\n  min-width: 100px;\n  min-height: 42px;\n  align-items: center;\n  justify-content: center;\n  gap: 7px;\n  padding: 8px 14px;\n  border: 1px solid var(--line);\n  border-radius: 7px;\n  background: var(--white);\n  color: var(--green-deep);\n  font-size: 14px;\n  font-weight: 700;\n  cursor: pointer;\n}\n\n.bw-paid-landing .time-option:hover {\n  border-color: #709273;\n}\n\n.bw-paid-landing .time-option.is-selected {\n  border-color: var(--green);\n  background: var(--green);\n  color: var(--white);\n}\n\n.bw-paid-landing .selection-hint {\n  display: flex;\n  align-items: center;\n  gap: 9px;\n  margin-top: 22px;\n  color: #526358;\n  font-size: 14px;\n}\n\n.bw-paid-landing .guest-picker-block {\n  padding-left: clamp(0px, 2vw, 24px);\n  border-left: 1px solid var(--line);\n}\n\n.bw-paid-landing .guest-stepper {\n  display: grid;\n  min-height: 62px;\n  grid-template-columns: 1fr 1.2fr 1fr;\n  align-items: center;\n  margin-top: 9px;\n  border: 1px solid var(--line);\n  border-radius: 9px;\n  background: var(--cream);\n}\n\n.bw-paid-landing .guest-stepper button {\n  display: grid;\n  width: 100%;\n  height: 60px;\n  place-items: center;\n  border: 0;\n  border-radius: 8px;\n  background: transparent;\n  color: var(--green-deep);\n  cursor: pointer;\n}\n\n.bw-paid-landing .guest-stepper button:hover:not(:disabled) {\n  background: #edf2e9;\n}\n\n.bw-paid-landing .guest-stepper button:disabled {\n  color: #b4bdb3;\n  cursor: not-allowed;\n}\n\n.bw-paid-landing .guest-stepper output {\n  color: var(--green-deep);\n  font-size: 23px;\n  font-weight: 800;\n  text-align: center;\n}\n\n.bw-paid-landing .guest-caption {\n  margin-top: 8px;\n  color: #69786b;\n  font-size: 12px;\n}\n\n.bw-paid-landing .price-mini {\n  display: flex;\n  align-items: flex-start;\n  gap: 8px;\n  margin-top: 24px;\n  color: var(--green);\n  font-size: 12px;\n  line-height: 1.4;\n}\n\n.bw-paid-landing .price-mini span {\n  color: #526358;\n}\n\n.bw-paid-landing .button--green {\n  background: var(--green);\n  color: var(--white);\n}\n\n.bw-paid-landing .button--green:hover:not(:disabled) {\n  background: #154c1b;\n}\n\n.bw-paid-landing .button--green:disabled {\n  background: #d8ddd6;\n  color: #738074;\n  cursor: not-allowed;\n}\n\n.bw-paid-landing .continue-button {\n  width: 100%;\n  margin-top: 26px;\n}\n\n.bw-paid-landing .button-caption {\n  margin-top: 10px;\n  color: #6d786e;\n  font-size: 12px;\n  text-align: center;\n}\n\n.bw-paid-landing .booking-footnote {\n  margin-top: 15px;\n  color: #6c786e;\n  font-size: 12px;\n  text-align: center;\n}\n\n.bw-paid-landing .step-title-row {\n  align-items: center;\n  margin-bottom: 20px;\n}\n\n.bw-paid-landing .text-button {\n  display: inline-flex;\n  min-height: 38px;\n  flex: 0 0 auto;\n  align-items: center;\n  justify-content: center;\n  gap: 7px;\n  padding: 5px 7px;\n  border: 0;\n  border-radius: 5px;\n  background: transparent;\n  color: var(--green);\n  font-size: 13px;\n  font-weight: 800;\n  cursor: pointer;\n}\n\n.bw-paid-landing .text-button:hover {\n  background: var(--pale-green);\n}\n\n.bw-paid-landing .selection-summary {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  padding: 15px 16px;\n  border: 1px solid #dbe5d8;\n  border-radius: 8px;\n  background: #f2f6ef;\n  color: var(--green);\n}\n\n.bw-paid-landing .selection-summary > div {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n\n.bw-paid-landing .selection-summary > div > span {\n  display: flex;\n  flex-direction: column;\n  color: var(--green-deep);\n  font-size: 14px;\n  line-height: 1.4;\n}\n\n.bw-paid-landing .selection-summary strong {\n  font-weight: 700;\n}\n\n.bw-paid-landing .selection-summary small {\n  color: #536557;\n  font-size: 12px;\n}\n\n.bw-paid-landing .summary-sample,\n.bw-paid-landing .preview-lock {\n  flex: 0 0 auto;\n  color: #47764a;\n  font-size: 9px;\n  font-weight: 800;\n  letter-spacing: 0.12em;\n}\n\n.bw-paid-landing .details-form {\n  margin-top: 26px;\n}\n\n.bw-paid-landing .field-grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 17px 18px;\n}\n\n.bw-paid-landing .form-field {\n  display: flex;\n  flex-direction: column;\n  gap: 7px;\n  color: var(--green-deep);\n  font-size: 13px;\n  font-weight: 700;\n}\n\n.bw-paid-landing .form-field em {\n  color: #748074;\n  font-size: 11px;\n  font-style: normal;\n  font-weight: 500;\n}\n\n.bw-paid-landing .form-field input,\n.bw-paid-landing .form-field select {\n  width: 100%;\n  min-height: 47px;\n  padding: 10px 12px;\n  border: 1px solid #cdd8cd;\n  border-radius: 7px;\n  background: #fff;\n  color: var(--ink);\n  font-size: 15px;\n  font-weight: 500;\n}\n\n.bw-paid-landing .form-field input:hover,\n.bw-paid-landing .form-field select:hover {\n  border-color: #729373;\n}\n\n.bw-paid-landing .referral-field {\n  max-width: calc(50% - 9px);\n  margin-top: 18px;\n}\n\n.bw-paid-landing .policy-rules {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) minmax(240px, 0.9fr);\n  align-items: center;\n  gap: 22px;\n  margin-top: 24px;\n  padding: 17px;\n  border: 1px solid var(--line);\n  border-radius: 8px;\n  background: #f7f8f2;\n}\n\n.bw-paid-landing .policy-rules > p {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  color: var(--green-deep);\n  font-size: 13px;\n  line-height: 1.45;\n}\n\n.bw-paid-landing .policy-rules > p strong {\n  font-size: 14px;\n}\n\n.bw-paid-landing .policy-rules > p span {\n  color: #566458;\n  font-size: 12px;\n}\n\n.bw-paid-landing .checkbox-field {\n  display: flex;\n  align-items: flex-start;\n  gap: 10px;\n  color: var(--green-deep);\n  font-size: 12px;\n  font-weight: 600;\n  line-height: 1.45;\n  cursor: pointer;\n}\n\n.bw-paid-landing .checkbox-field input {\n  width: 17px;\n  height: 17px;\n  flex: 0 0 auto;\n  margin: 1px 0 0;\n  accent-color: var(--green);\n}\n\n.bw-paid-landing .form-actions {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 16px;\n  margin-top: 24px;\n}\n\n.bw-paid-landing .button--quiet {\n  border-color: #cbd7ca;\n  background: transparent;\n  color: var(--green-deep);\n}\n\n.bw-paid-landing .button--quiet:hover {\n  background: var(--pale-green);\n}\n\n.bw-paid-landing .preview-lock {\n  padding: 7px 9px;\n  border: 1px solid #cad8c8;\n  border-radius: 5px;\n  background: var(--pale-green);\n}\n\n.bw-paid-landing .payment-selection {\n  margin-top: 3px;\n}\n\n.bw-paid-landing .price-breakdown {\n  margin: 21px 0 0;\n}\n\n.bw-paid-landing .price-breakdown > div {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 14px;\n  padding: 11px 2px;\n  border-bottom: 1px solid #e6e9e1;\n  color: #415247;\n  font-size: 14px;\n}\n\n.bw-paid-landing .price-breakdown dt,\n.bw-paid-landing .price-breakdown dd {\n  margin: 0;\n}\n\n.bw-paid-landing .price-breakdown dd {\n  color: var(--green-deep);\n  font-weight: 700;\n}\n\n.bw-paid-landing .price-breakdown__total {\n  padding-top: 15px !important;\n  color: var(--green-deep) !important;\n  font-size: 16px !important;\n  font-weight: 800;\n}\n\n.bw-paid-landing .price-breakdown__total dd {\n  font-size: 20px;\n}\n\n.bw-paid-landing .no-transaction {\n  display: flex;\n  align-items: flex-start;\n  gap: 11px;\n  margin-top: 20px;\n  padding: 16px;\n  border: 1px solid #d8e2d5;\n  border-radius: 8px;\n  background: #f1f6ee;\n  color: var(--green);\n}\n\n.bw-paid-landing .no-transaction p {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  color: var(--green-deep);\n  font-size: 13px;\n}\n\n.bw-paid-landing .no-transaction p span {\n  color: #536557;\n  font-size: 12px;\n}\n\n.bw-paid-landing .customer-summary {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  margin-block: 18px 20px;\n  color: var(--green-deep);\n  font-size: 13px;\n}\n\n.bw-paid-landing .customer-summary span,\n.bw-paid-landing .customer-summary small {\n  color: #657366;\n  font-size: 11px;\n}\n\n.bw-paid-landing .faq-section {\n  display: grid;\n  grid-template-columns: minmax(250px, 0.65fr) minmax(0, 1.35fr);\n  gap: clamp(38px, 8vw, 110px);\n  padding-block: 69px 86px;\n  border-top: 1px solid var(--line);\n}\n\n.bw-paid-landing .faq-heading h2 {\n  font-size: clamp(34px, 4.2vw, 52px);\n}\n\n.bw-paid-landing .faq-list {\n  border-top: 1px solid var(--line);\n}\n\n.bw-paid-landing .faq-item {\n  border-bottom: 1px solid var(--line);\n}\n\n.bw-paid-landing .faq-item summary {\n  display: grid;\n  min-height: 83px;\n  grid-template-columns: 36px minmax(0, 1fr) 18px;\n  align-items: center;\n  gap: 12px;\n  list-style: none;\n  cursor: pointer;\n}\n\n.bw-paid-landing .faq-item summary::-webkit-details-marker {\n  display: none;\n}\n\n.bw-paid-landing .faq-icon {\n  display: grid;\n  width: 33px;\n  height: 33px;\n  place-items: center;\n  border: 2px solid #729273;\n  border-radius: 50%;\n  color: var(--green);\n}\n\n.bw-paid-landing .faq-item summary > span:nth-child(2) {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n\n.bw-paid-landing .faq-item summary strong {\n  color: var(--green-deep);\n  font-size: 14px;\n  font-weight: 800;\n}\n\n.bw-paid-landing .faq-item summary small {\n  color: #536557;\n  font-size: 12px;\n}\n\n.bw-paid-landing .faq-chevron {\n  flex: 0 0 auto;\n  color: var(--green-deep);\n  transition: transform 120ms ease;\n}\n\n.bw-paid-landing .faq-item[open] .faq-chevron {\n  transform: rotate(180deg);\n}\n\n.bw-paid-landing .faq-item > p {\n  max-width: 650px;\n  margin: -3px 32px 20px 48px;\n  color: #4f5f52;\n  font-size: 13px;\n  line-height: 1.55;\n}\n\n.bw-paid-landing .site-footer {\n  display: flex;\n  min-height: 75px;\n  align-items: center;\n  justify-content: space-between;\n  gap: 20px;\n  padding: 18px max(44px, calc((100% - 1240px) / 2));\n  border-top: 1px solid var(--line);\n  color: #68776a;\n  font-size: 12px;\n}\n\n.bw-paid-landing .footer-brand {\n  color: var(--green-deep);\n  font-weight: 800;\n  text-decoration: none;\n}\n\n.bw-paid-landing .footer-brand span {\n  padding-inline: 3px;\n  color: #98a395;\n}\n\n@media (max-width: 900px) {\n  .bw-paid-landing .section-wrap {\n    width: min(100% - 56px, 760px);\n  }\n\n  .bw-paid-landing .site-header {\n    width: calc(100% - 56px);\n  }\n\n  .bw-paid-landing .hero {\n    min-height: 0;\n    grid-template-columns: minmax(0, 0.96fr) minmax(300px, 1.04fr);\n    column-gap: 28px;\n  }\n\n  .bw-paid-landing .hero-title {\n    font-size: clamp(50px, 7.3vw, 68px);\n  }\n\n  .bw-paid-landing .hero-photo,\n.bw-paid-landing .hero-photo img {\n    min-height: 530px;\n  }\n\n  .bw-paid-landing .story {\n    grid-template-columns: minmax(260px, 0.9fr) minmax(320px, 1.1fr);\n    gap: 42px;\n  }\n\n  .bw-paid-landing .booking-grid {\n    grid-template-columns: minmax(0, 1fr) minmax(180px, 0.34fr);\n    gap: 24px;\n  }\n\n  .bw-paid-landing .guest-picker-block {\n    padding-left: 18px;\n  }\n\n  .bw-paid-landing .faq-section {\n    grid-template-columns: minmax(210px, 0.65fr) minmax(0, 1.35fr);\n    gap: 40px;\n  }\n}\n\n@media (max-width: 680px) {\n  .bw-paid-landing {\n    scroll-padding-top: 16px;\n  }\n\n  .bw-paid-landing {\n    font-size: 15px;\n  }\n\n  .bw-paid-landing .preview-notice {\n    flex-wrap: wrap;\n    gap: 3px 7px;\n    padding-inline: 13px;\n    font-size: 9px;\n    line-height: 1.35;\n  }\n\n  .bw-paid-landing .preview-notice__tag {\n    font-size: 8px;\n  }\n\n  .bw-paid-landing .preview-notice__separator {\n    display: none;\n  }\n\n  .bw-paid-landing .site-header {\n    width: calc(100% - 40px);\n    min-height: 65px;\n  }\n\n  .bw-paid-landing .brand img {\n    width: 130px;\n  }\n\n  .bw-paid-landing .brand {\n    font-size: 13px;\n  }\n\n  .bw-paid-landing .site-nav {\n    top: 69px;\n  }\n\n  .bw-paid-landing .section-wrap {\n    width: calc(100% - 40px);\n  }\n\n  .bw-paid-landing .hero {\n    position: relative;\n    display: block;\n    min-height: 0;\n    isolation: isolate;\n    padding-top: 8px;\n    padding-bottom: 25px;\n  }\n\n  .bw-paid-landing .hero-eyebrow {\n    position: relative;\n    z-index: 2;\n    width: max-content;\n    max-width: 100%;\n    margin-bottom: 8px;\n  }\n\n  .bw-paid-landing .eyebrow {\n    font-size: 11px;\n    letter-spacing: 0.055em;\n  }\n\n  .bw-paid-landing .hero-title {\n    position: relative;\n    z-index: 2;\n    width: min(205px, calc(100vw - 120px));\n    margin-top: 0;\n    font-size: clamp(32px, 8.3vw, 34px);\n    letter-spacing: -0.065em;\n    line-height: 0.98;\n  }\n\n  .bw-paid-landing .hero-intro {\n    position: relative;\n    z-index: 2;\n    width: min(205px, calc(100vw - 120px));\n    max-width: 205px;\n    margin-top: 8px;\n    font-size: 14px;\n    line-height: 1.42;\n  }\n\n  .bw-paid-landing .feature-list {\n    position: relative;\n    z-index: 2;\n    display: flex;\n    width: min(205px, calc(100vw - 120px));\n    flex-direction: column;\n    gap: 6px;\n    margin: 9px 0 0;\n    padding: 0;\n  }\n\n  .bw-paid-landing .feature {\n    gap: 8px;\n  }\n\n  .bw-paid-landing .feature > svg {\n    width: 22px;\n    height: 22px;\n  }\n\n  .bw-paid-landing .feature > span {\n    font-size: 13px;\n  }\n\n  .bw-paid-landing .feature strong {\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .feature small {\n    font-size: 13px;\n  }\n\n  .bw-paid-landing .hero-cta {\n    position: relative;\n    z-index: 2;\n    width: 180px;\n    min-width: 0;\n    min-height: 48px;\n    margin-top: 10px;\n    font-size: 16px;\n  }\n\n  .bw-paid-landing .hero-actions {\n    display: contents;\n  }\n\n  .bw-paid-landing .price-note {\n    position: relative;\n    z-index: 2;\n    width: 100vw;\n    margin: 10px 0 0 calc((100% - 100vw) / 2);\n    padding: 10px 20px;\n    background: var(--cream);\n    font-size: 14px;\n    line-height: 1.38;\n  }\n\n  .bw-paid-landing .hero-photo {\n    position: absolute;\n    z-index: 0;\n    top: 31px;\n    right: calc((100% - 100vw) / 2);\n    width: clamp(198px, 61.5vw, 250px);\n    height: clamp(360px, 105vw, 430px);\n    min-height: 0;\n    max-height: none;\n    border-radius: 0 0 0 8px;\n  }\n\n  .bw-paid-landing .hero-photo img {\n    min-height: 0;\n    height: 100%;\n    object-position: 37% 17%;\n  }\n\n  .bw-paid-landing .hero-photo figcaption {\n    display: none;\n  }\n\n  .bw-paid-landing .hero-photo::after {\n    position: absolute;\n    z-index: 1;\n    inset: 0;\n    background: linear-gradient(\n      90deg,\n      var(--cream) 0%,\n      var(--cream) 16%,\n      rgb(250 250 245 / 0.94) 23%,\n      rgb(250 250 245 / 0.52) 30%,\n      rgb(250 250 245 / 0) 37%\n    );\n    content: \"\";\n    pointer-events: none;\n  }\n\n  .bw-paid-landing .story {\n    display: grid;\n    grid-template-columns: minmax(0, 1.04fr) minmax(0, 0.96fr);\n    align-items: center;\n    gap: 12px;\n    padding-block: 32px 35px;\n  }\n\n  .bw-paid-landing .section-mark {\n    width: 35px;\n    height: 4px;\n    margin-bottom: 16px;\n  }\n\n  .bw-paid-landing .story h2,\n.bw-paid-landing .booking-heading h2,\n.bw-paid-landing .faq-heading h2 {\n    margin-top: 11px;\n    font-size: clamp(29px, 8.6vw, 36px);\n  }\n\n  .bw-paid-landing .story h2 {\n    font-size: clamp(28px, 7.2vw, 30px);\n  }\n\n  .bw-paid-landing .story-intro {\n    max-width: 100%;\n    margin-top: 10px;\n    font-size: 14px;\n    line-height: 1.42;\n  }\n\n  .bw-paid-landing .route-points {\n    gap: 11px;\n    margin-top: 15px;\n  }\n\n  .bw-paid-landing .route-point {\n    gap: 7px;\n  }\n\n  .bw-paid-landing .route-point > svg {\n    width: 19px;\n    height: 19px;\n    flex: 0 0 auto;\n  }\n\n  .bw-paid-landing .route-point span {\n    font-size: 13px;\n  }\n\n  .bw-paid-landing .route-point strong {\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .story-photo {\n    width: 100%;\n    border-radius: 8px;\n  }\n\n  .bw-paid-landing .story-photo img {\n    aspect-ratio: 0.8;\n    object-position: center;\n  }\n\n  .bw-paid-landing .story-photo figcaption {\n    justify-content: center;\n    padding: 7px 6px;\n    font-size: 10px;\n  }\n\n  .bw-paid-landing .story-photo figcaption span + span {\n    display: none;\n  }\n\n  .bw-paid-landing .booking {\n    padding-block: 45px 49px;\n  }\n\n  .bw-paid-landing .booking-heading {\n    margin-bottom: 21px;\n  }\n\n  .bw-paid-landing .booking-heading h2 {\n    margin-bottom: 22px;\n  }\n\n  .bw-paid-landing .step-progress {\n    gap: 7px;\n  }\n\n  .bw-paid-landing .step-progress__item {\n    gap: 6px;\n    font-size: 11px;\n  }\n\n  .bw-paid-landing .step-progress__number {\n    width: 26px;\n    height: 26px;\n    font-size: 11px;\n  }\n\n  .bw-paid-landing .booking-panel {\n    padding: 17px 15px 20px;\n    border-radius: 10px;\n  }\n\n  .bw-paid-landing .booking-grid {\n    display: flex;\n    flex-direction: column;\n    gap: 24px;\n  }\n\n  .bw-paid-landing .subheading-row {\n    gap: 9px;\n    margin-bottom: 16px;\n  }\n\n  .bw-paid-landing .subheading-row h3 {\n    font-size: 20px;\n  }\n\n  .bw-paid-landing .subheading-row p {\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .subheading-row > svg {\n    width: 23px;\n    height: 23px;\n  }\n\n  .bw-paid-landing .date-options {\n    gap: 7px;\n  }\n\n  .bw-paid-landing .date-option {\n    min-height: 77px;\n    padding: 8px 3px;\n    border-radius: 7px;\n  }\n\n  .bw-paid-landing .date-option > span:first-child {\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .date-option strong {\n    font-size: 15px;\n  }\n\n  .bw-paid-landing .date-option__selected {\n    font-size: 10px;\n  }\n\n  .bw-paid-landing .field-label {\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .time-options-block {\n    margin-top: 17px;\n  }\n\n  .bw-paid-landing .time-options {\n    gap: 8px;\n    margin-top: 8px;\n  }\n\n  .bw-paid-landing .time-option {\n    min-width: 91px;\n    min-height: 44px;\n    padding-inline: 11px;\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .selection-hint {\n    margin-top: 18px;\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .guest-picker-block {\n    padding: 18px 0 0;\n    border-top: 1px solid var(--line);\n    border-left: 0;\n  }\n\n  .bw-paid-landing .guest-stepper {\n    min-height: 54px;\n  }\n\n  .bw-paid-landing .guest-stepper button {\n    height: 52px;\n  }\n\n  .bw-paid-landing .guest-stepper output {\n    font-size: 20px;\n  }\n\n  .bw-paid-landing .guest-caption {\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .price-mini {\n    margin-top: 15px;\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .continue-button {\n    min-height: 51px;\n    margin-top: 21px;\n    padding-inline: 12px;\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .button-caption,\n.bw-paid-landing .booking-footnote {\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .booking-footnote {\n    padding-inline: 16px;\n  }\n\n  .bw-paid-landing .step-title-row {\n    align-items: flex-start;\n  }\n\n  .bw-paid-landing .text-button {\n    min-height: 44px;\n    padding-inline: 5px;\n    font-size: 13px;\n  }\n\n  .bw-paid-landing .selection-summary {\n    gap: 7px;\n    padding: 12px 10px;\n  }\n\n  .bw-paid-landing .selection-summary > div {\n    gap: 8px;\n  }\n\n  .bw-paid-landing .selection-summary > div > svg {\n    width: 19px;\n    height: 19px;\n  }\n\n  .bw-paid-landing .selection-summary > div > span {\n    font-size: 13px;\n  }\n\n  .bw-paid-landing .selection-summary small {\n    font-size: 12px;\n  }\n\n  .bw-paid-landing .summary-sample,\n.bw-paid-landing .preview-lock {\n    font-size: 8px;\n  }\n\n  .bw-paid-landing .details-form {\n    margin-top: 20px;\n  }\n\n  .bw-paid-landing .field-grid {\n    grid-template-columns: 1fr;\n    gap: 14px;\n  }\n\n  .bw-paid-landing .form-field {\n    gap: 5px;\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .form-field input,\n.bw-paid-landing .form-field select {\n    min-height: 48px;\n    font-size: 16px;\n  }\n\n  .bw-paid-landing .referral-field {\n    max-width: none;\n    margin-top: 15px;\n  }\n\n  .bw-paid-landing .policy-rules {\n    grid-template-columns: 1fr;\n    gap: 14px;\n    margin-top: 17px;\n    padding: 13px;\n  }\n\n  .bw-paid-landing .policy-rules > p strong {\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .policy-rules > p span,\n.bw-paid-landing .checkbox-field {\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .checkbox-field {\n    min-height: 44px;\n    align-items: center;\n  }\n\n  .bw-paid-landing .form-actions {\n    gap: 9px;\n    margin-top: 18px;\n  }\n\n  .bw-paid-landing .form-actions .button {\n    min-height: 48px;\n    padding: 10px 12px;\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .preview-lock {\n    padding: 6px;\n    letter-spacing: 0.08em;\n  }\n\n  .bw-paid-landing .price-breakdown > div {\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .price-breakdown__total {\n    font-size: 13px !important;\n  }\n\n  .bw-paid-landing .price-breakdown__total dd {\n    font-size: 18px;\n  }\n\n  .bw-paid-landing .no-transaction {\n    padding: 12px;\n  }\n\n  .bw-paid-landing .no-transaction p {\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .customer-summary {\n    font-size: 11px;\n  }\n\n  .bw-paid-landing .customer-summary span,\n.bw-paid-landing .customer-summary small {\n    font-size: 13px;\n  }\n\n  .bw-paid-landing .payment-preview > .button {\n    min-height: 44px;\n    padding: 9px 12px;\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .faq-section {\n    display: block;\n    padding-block: 46px 52px;\n  }\n\n  .bw-paid-landing .faq-heading {\n    margin-bottom: 22px;\n  }\n\n  .bw-paid-landing .faq-heading h2 {\n    font-size: 37px;\n  }\n\n  .bw-paid-landing .faq-item summary {\n    min-height: 75px;\n    grid-template-columns: 32px minmax(0, 1fr) 14px;\n    gap: 9px;\n  }\n\n  .bw-paid-landing .faq-icon {\n    width: 29px;\n    height: 29px;\n  }\n\n  .bw-paid-landing .faq-icon svg {\n    width: 18px;\n    height: 18px;\n  }\n\n  .bw-paid-landing .faq-item summary strong {\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .faq-item summary small {\n    font-size: 13px;\n  }\n\n  .bw-paid-landing .faq-item > p {\n    margin: -1px 18px 16px 41px;\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .site-footer {\n    min-height: 70px;\n    flex-direction: column;\n    align-items: flex-start;\n    justify-content: center;\n    gap: 4px;\n    padding: 14px 20px;\n    font-size: 10px;\n  }\n}\n\n@media (max-width: 370px) {\n  .bw-paid-landing .section-wrap,\n.bw-paid-landing .site-header {\n    width: calc(100% - 32px);\n  }\n\n  .bw-paid-landing .preview-notice {\n    font-size: 8px;\n  }\n\n  .bw-paid-landing .brand img {\n    width: 150px;\n  }\n\n  .bw-paid-landing .step-progress__item {\n    font-size: 9px;\n  }\n\n  .bw-paid-landing .step-progress__number {\n    width: 23px;\n    height: 23px;\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .bw-paid-landing *,\n.bw-paid-landing *::before,\n.bw-paid-landing *::after {\n    scroll-behavior: auto !important;\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.01ms !important;\n  }\n}\n";

  const LIVE_BOOKING_CSS = `
    bw-paid-landing {
      display: block;
      width: 100%;
    }

    html.bw-paid-landing-active,
    body.bw-paid-landing-active {
      overflow-x: hidden;
    }

    body.bw-paid-landing-active {
      margin: 0;
      background: #fafaf5;
    }

    .bw-paid-landing {
      display: block;
      width: 100%;
      overflow-x: hidden;
    }

    .bw-paid-landing [hidden] {
      display: none !important;
    }

    .bw-paid-landing .feature > img {
      width: 29px;
      height: 29px;
      flex: 0 0 auto;
    }

    .bw-paid-landing .route-point > img {
      width: 28px;
      height: 28px;
      flex: 0 0 auto;
    }

    .bw-paid-landing .button img,
    .bw-paid-landing .site-nav__cta img {
      width: 20px;
      height: 20px;
      flex: 0 0 auto;
    }

    .bw-paid-landing .hero-cta img {
      width: 22px;
      height: 22px;
    }

    .bw-paid-landing .menu-toggle img {
      width: 30px;
      height: 30px;
    }

    .bw-paid-landing .text-button img {
      width: 16px;
      height: 16px;
    }

    .bw-paid-landing .text-button .back-arrow {
      transform: rotate(180deg);
    }

    .bw-paid-landing .faq-icon img {
      display: block;
      width: 20px;
      height: 20px;
    }

    .bw-paid-landing .faq-chevron {
      display: block;
      width: 17px;
      height: 17px;
    }

    .bw-paid-landing .route-overview {
      display: grid;
      grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.65fr);
      align-items: center;
      gap: clamp(24px, 4vw, 58px);
      padding-block: 28px 66px;
    }

    .bw-paid-landing .route-overview__visual {
      overflow: hidden;
      min-width: 0;
      margin: 0;
      border: 1px solid var(--line);
      border-radius: 15px;
      background: var(--white);
      box-shadow: 0 12px 35px rgb(18 61 24 / 7%);
    }

    .bw-paid-landing .route-overview__map {
      position: relative;
      aspect-ratio: 1562 / 1007;
      overflow: hidden;
      background: #f4f1e8;
    }

    .bw-paid-landing .route-overview__map img,
    .bw-paid-landing .route-overview__path {
      display: block;
      width: 100%;
      height: 100%;
    }

    .bw-paid-landing .route-overview__path {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .bw-paid-landing .route-overview__halo,
    .bw-paid-landing .route-overview__line {
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
      vector-effect: non-scaling-stroke;
    }

    .bw-paid-landing .route-overview__halo {
      stroke: #fffefa;
      stroke-width: 7;
    }

    .bw-paid-landing .route-overview__line {
      stroke: var(--green);
      stroke-width: 3;
    }

    .bw-paid-landing .route-overview__pin {
      position: absolute;
      width: 16px;
      height: 16px;
      border: 3px solid var(--green-deep);
      border-radius: 50%;
      background: var(--yellow);
      transform: translate(-50%, -50%);
      pointer-events: none;
    }

    .bw-paid-landing .route-overview__pin--start { left: 88.283%; top: 40.444%; }
    .bw-paid-landing .route-overview__pin--finish { left: 41.304%; top: 17.778%; }

    .bw-paid-landing .route-overview__visual figcaption {
      display: flex;
      flex-wrap: wrap;
      gap: 5px 20px;
      justify-content: space-between;
      padding: 11px 15px;
      color: var(--green-deep);
      font-size: 12px;
      line-height: 1.4;
    }

    .bw-paid-landing .route-overview__visual figcaption strong {
      margin-right: 5px;
    }

    .bw-paid-landing .route-overview__tools {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 0 14px;
      padding: 0 15px 5px;
      font-size: 12px;
    }

    .bw-paid-landing .route-overview__tools a {
      display: inline-flex;
      align-items: center;
      min-height: 44px;
      color: var(--green-deep);
      text-underline-offset: 3px;
    }

    .bw-paid-landing .route-overview__tools .route-overview__credit {
      font-size: 10px;
      color: #526358;
    }

    .bw-paid-landing .route-overview__copy {
      min-width: 0;
    }

    .bw-paid-landing .route-overview__copy h2 {
      margin-top: 12px;
      color: var(--green-deep);
      font-size: clamp(34px, 3.7vw, 52px);
      font-weight: 800;
      letter-spacing: -0.055em;
      line-height: 1.05;
    }

    .bw-paid-landing .route-overview__copy > p:last-of-type {
      margin-top: 16px;
      color: #263b2b;
      font-size: 16px;
      line-height: 1.55;
    }

    .bw-paid-landing .route-overview__link {
      display: inline-flex;
      min-height: 44px;
      align-items: center;
      gap: 8px;
      margin-top: 13px;
      color: var(--green-deep);
      font-size: 14px;
      font-weight: 800;
      text-decoration-thickness: 2px;
      text-underline-offset: 4px;
    }

    @media (max-width: 900px) {
      .bw-paid-landing .route-overview {
        grid-template-columns: minmax(0, 1fr) minmax(240px, 0.75fr);
      }
    }

    @media (max-width: 680px) {
      .bw-paid-landing .route-overview {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 22px;
        padding-block: 14px 36px;
      }

      .bw-paid-landing .route-overview__visual figcaption {
        padding: 10px 12px;
        font-size: 11px;
      }

      .bw-paid-landing .route-overview__copy h2 {
        font-size: 32px;
      }

      .bw-paid-landing .route-overview__copy > p:last-of-type {
        margin-top: 10px;
        font-size: 14px;
      }

      .bw-paid-landing .story {
        grid-template-columns: minmax(0, 1fr);
        gap: 22px;
        padding-block: 36px 40px;
      }

      .bw-paid-landing .story-photo img {
        aspect-ratio: 1.45;
      }
    }

    .bw-paid-landing .handoff-panel {
      display: grid;
      grid-template-columns: minmax(0, 1.25fr) minmax(260px, 0.75fr);
      gap: clamp(24px, 4vw, 52px);
      align-items: start;
    }

    .bw-paid-landing .walk-facts {
      display: grid;
      gap: 0;
      margin: 0;
    }

    .bw-paid-landing .walk-facts > div {
      display: grid;
      grid-template-columns: 96px minmax(0, 1fr);
      gap: 14px;
      padding: 13px 0;
      border-bottom: 1px solid var(--line);
    }

    .bw-paid-landing .walk-facts > div:first-child {
      padding-top: 0;
    }

    .bw-paid-landing .walk-facts > div:last-child {
      border-bottom: 0;
      padding-bottom: 0;
    }

    .bw-paid-landing .walk-facts dt {
      color: #4b754e;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      line-height: 1.5;
    }

    .bw-paid-landing .walk-facts dd {
      margin: 0;
      color: var(--green-deep);
      font-size: 15px;
      font-weight: 600;
      line-height: 1.5;
    }

    .bw-paid-landing .handoff-actions {
      display: grid;
      gap: 14px;
    }

    .bw-paid-landing .live-dates {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
    }

    .bw-paid-landing .live-dates__label {
      flex: 0 0 100%;
      color: #4b754e;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .bw-paid-landing .live-dates__chip {
      display: inline-flex;
      min-height: 44px;
      align-items: center;
      padding: 8px 12px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--white);
      color: var(--green-deep);
      font-size: 14px;
      font-weight: 700;
      text-decoration: none;
    }

    .bw-paid-landing .live-dates__chip:hover {
      border-color: var(--green);
    }

    .bw-paid-landing .handoff-cta {
      width: 100%;
    }

    .bw-paid-landing .handoff-cta img {
      filter: brightness(0) invert(1);
    }

    .bw-paid-landing .handoff-note {
      color: #526358;
      font-size: 13px;
      line-height: 1.45;
      text-align: center;
    }

    .bw-paid-landing .booking-footnote a {
      color: var(--green-deep);
      font-weight: 800;
      text-underline-offset: 3px;
    }

    @media (max-width: 680px) {
      .bw-paid-landing .booking-panel {
        padding: 18px 16px 20px;
      }

      .bw-paid-landing .handoff-panel {
        grid-template-columns: minmax(0, 1fr);
        gap: 22px;
      }

      .bw-paid-landing .walk-facts > div {
        grid-template-columns: minmax(0, 1fr);
        gap: 2px;
        padding: 11px 0;
      }

      .bw-paid-landing .walk-facts dd {
        font-size: 14px;
      }

      .bw-paid-landing .handoff-note {
        font-size: 14px;
      }
    }
  `;

  function consentBoolean(value) {
    return value === true || value === 1 || value === '1' || value === 'true';
  }

  function gdprDefaultPolicyBlocked(current) {
    if (!current || current.defaultPolicy !== true) return false;
    try {
      const manager = window.wixTagManager;
      const config = manager && typeof manager.getConfig === 'function'
        ? manager.getConfig()
        : null;
      return !config || config.gdprEnforcedGeo !== false;
    } catch {
      return true;
    }
  }

  function readConsentPolicy() {
    try {
      const manager = window.consentPolicyManager;
      const current = manager && typeof manager.getCurrentConsentPolicy === 'function'
        ? manager.getCurrentConsentPolicy()
        : null;
      if (gdprDefaultPolicyBlocked(current)) return { analytics: false, advertising: false };
      const policy = current && (current.policy || current);
      if (policy && Object.keys(policy).length) return policy;
    } catch {}

    try {
      const match = document.cookie.match(/(?:^|;\s*)consent-policy=([^;]+)/);
      if (!match) return null;
      const parsed = JSON.parse(decodeURIComponent(match[1]));
      const policy = parsed && (parsed.policy || parsed);
      return policy && Object.keys(policy).length ? policy : null;
    } catch {
      return null;
    }
  }

  function consentState() {
    const policy = readConsentPolicy();
    const known = Boolean(policy && Object.keys(policy).length);
    const nested = policy && policy.consent && typeof policy.consent === 'object' ? policy.consent : {};
    const analyticsRaw = policy && (policy.analytics ?? policy.anl ?? policy.analyticsConsent ?? policy.analyticsStorage ?? nested.analytics);
    const advertisingRaw = policy && (policy.advertising ?? policy.adv ?? policy.advertisingConsent ?? policy.marketing ?? policy.marketingConsent ?? policy.dataToThirdParty ?? policy.marketingStorage ?? nested.advertising ?? nested.marketing);
    const analyticsKnown = analyticsRaw !== undefined && analyticsRaw !== null;
    const advertisingKnown = advertisingRaw !== undefined && advertisingRaw !== null;
    return {
      known,
      analyticsKnown,
      advertisingKnown,
      analytics: analyticsKnown && consentBoolean(analyticsRaw),
      advertising: advertisingKnown && consentBoolean(advertisingRaw),
    };
  }

  function randomId(prefix) {
    try {
      if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
        const values = new Uint32Array(4);
        window.crypto.getRandomValues(values);
        return `${prefix}_${Array.from(values).map((value) => value.toString(16).padStart(8, '0')).join('')}`;
      }
    } catch {}
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  }

  function readJSON(storage, key) {
    try {
      const raw = storage && storage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function writeJSON(storage, key, value) {
    try {
      storage && storage.setItem(key, JSON.stringify(value));
    } catch {}
  }

  function readCookie(name) {
    try {
      const prefix = `${name}=`;
      const part = String(document.cookie || '').split(';').map((item) => item.trim()).find((item) => item.startsWith(prefix));
      return part ? decodeURIComponent(part.slice(prefix.length)) : '';
    } catch {
      return '';
    }
  }

  function privacySafeTrackingUrl(value, advertisingAllowed) {
    const raw = String(value || '');
    if (!raw || advertisingAllowed) return raw;
    try {
      const url = new URL(raw, window.location.href);
      PAID_AD_IDENTIFIER_KEYS.forEach((key) => url.searchParams.delete(key));
      return url.toString();
    } catch {
      return raw;
    }
  }

  function purgeAdvertisingIdentifiers(preserveAnalyticsState = false) {
    try {
      if (preserveAnalyticsState) {
        const stored = readJSON(window.localStorage, PAID_TRACKING_KEY);
        if (stored && typeof stored === 'object') {
          PAID_AD_IDENTIFIER_KEYS.forEach((key) => { delete stored[key]; });
          writeJSON(window.localStorage, PAID_TRACKING_KEY, stored);
        }
      } else {
        window.localStorage?.removeItem(PAID_TRACKING_KEY);
        window.localStorage?.removeItem(PAID_VISITOR_KEY);
        window.sessionStorage?.removeItem(PAID_SESSION_KEY);
      }
    } catch {}
  }

  function canonicalTrackingState(consent) {
    if (!consent.analytics) {
      if (consent.analyticsKnown) purgeAdvertisingIdentifiers(false);
      return null;
    }

    const params = new URLSearchParams(window.location.search || '');
    const stored = readJSON(window.localStorage, PAID_TRACKING_KEY) || {};
    const storedAdvertisingIdentifiers = PAID_AD_IDENTIFIER_KEYS.some((key) => Boolean(stored[key]));
    const current = {
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
      utm_content: params.get('utm_content') || '',
      utm_term: params.get('utm_term') || '',
      utm_id: params.get('utm_id') || '',
    };
    const merged = Object.assign({}, stored);
    if (!merged.visitorId) merged.visitorId = readJSON(window.localStorage, PAID_VISITOR_KEY) || randomId('bw_v');
    writeJSON(window.localStorage, PAID_VISITOR_KEY, merged.visitorId);
    if (!merged.sessionId) merged.sessionId = readJSON(window.sessionStorage, PAID_SESSION_KEY) || randomId('bw_s');
    writeJSON(window.sessionStorage, PAID_SESSION_KEY, merged.sessionId);
    if (!merged.attributionId) merged.attributionId = randomId('bw_attr');
    if (!merged.firstPage) merged.firstPage = window.location.pathname;
    if (!merged.landingPage) merged.landingPage = window.location.href;
    if (!merged.createdAt) merged.createdAt = new Date().toISOString();

    Object.keys(current).forEach((key) => {
      if (!merged[key] && current[key]) merged[key] = current[key];
    });

    if (consent.advertising) {
      const identifiers = {
        fbclid: params.get('fbclid') || '',
        fbc: params.get('fbc') || readCookie('_fbc'),
        fbp: params.get('fbp') || readCookie('_fbp'),
      };
      PAID_AD_IDENTIFIER_KEYS.forEach((key) => {
        if (!merged[key] && identifiers[key]) merged[key] = identifiers[key];
      });
    } else if (consent.advertisingKnown) {
      PAID_AD_IDENTIFIER_KEYS.forEach((key) => { delete merged[key]; });
      purgeAdvertisingIdentifiers(true);
    } else {
      // A missing policy is a fail-closed send state, not proof of denial. Do
      // not overwrite a previously consented local record while Wix is still
      // initialising its policy.
      PAID_AD_IDENTIFIER_KEYS.forEach((key) => { delete merged[key]; });
    }

    if (!consent.advertising) merged.landingPage = privacySafeTrackingUrl(merged.landingPage, false);

    const paidSignal = [merged.utm_source, merged.utm_medium, merged.utm_campaign].join(' ').toLowerCase();
    merged.isPaid = /(^|[^a-z])(meta|facebook|instagram|fb|ig|paid|cpc|paid_social)([^a-z]|$)/i.test(paidSignal);
    merged.updatedAt = new Date().toISOString();
    // If Wix has not exposed an advertising decision yet, preserve an existing
    // record that may contain consented identifiers, but still persist a new
    // analytics-only record when there is nothing sensitive to preserve.
    if (consent.advertising || consent.advertisingKnown || !storedAdvertisingIdentifiers) {
      writeJSON(window.localStorage, PAID_TRACKING_KEY, merged);
    }
    return merged;
  }

  function escapeAttribute(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // Booking page link with an optional start (YYYY-MM-DDTHH:MM, Berlin time)
  // and at most the five UTM keys from the landing URL. Click ids, utm_id and
  // anything else never travel.
  function bookingHref(start, search) {
    const url = new URL(BOOKING_URL);
    const startKey = String(start || '');
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(startKey)) url.searchParams.set('start', startKey);
    const incoming = new URLSearchParams(String(search === undefined ? (window.location && window.location.search) || '' : search));
    UTM_KEYS.forEach((key) => {
      const value = String(incoming.get(key) || '').replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, 100);
      if (value) url.searchParams.set(key, value);
    });
    return url.toString();
  }

  // Up to four future dates with open places, one per day, from the
  // booking-calendar-availability feed. Wall-clock times without a zone are
  // Berlin time; instants with a zone are converted to Berlin time.
  function nextDates(data, now) {
    const slots = data && Array.isArray(data.slots) ? data.slots : [];
    const read = (value, options) => {
      const map = {};
      new Intl.DateTimeFormat('en-GB', Object.assign({ timeZone: 'Europe/Berlin' }, options))
        .formatToParts(new Date(value))
        .forEach((part) => { if (part.type !== 'literal') map[part.type] = part.value; });
      return map;
    };
    const berlinKey = (value) => {
      const text = String(value || '');
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(text) && !/(Z|[+-]\d{2}:?\d{2})$/i.test(text)) return text.slice(0, 16);
      const date = new Date(text);
      if (Number.isNaN(date.getTime())) return '';
      const num = read(date, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
      return `${num.year}-${num.month}-${num.day}T${num.hour}:${num.minute}`;
    };
    const nowKey = berlinKey((now || new Date()).toISOString());
    const seen = new Set();
    return slots
      .filter((slot) => slot && slot.bookable !== false && (slot.openSpots === null || slot.openSpots === undefined || Number(slot.openSpots) > 0))
      .map((slot) => berlinKey(slot.startDate))
      .filter((key) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(key) && key > nowKey)
      .sort()
      .filter((key) => !seen.has(key.slice(0, 10)) && seen.add(key.slice(0, 10)))
      .slice(0, 4)
      .map((key) => {
        const txt = read(`${key.slice(0, 10)}T12:00:00Z`, { weekday: 'short', day: 'numeric', month: 'short' });
        return { key, label: `${txt.weekday} ${txt.day} ${txt.month} · ${key.slice(11, 16)}` };
      });
  }

  class BWPaidLandingElement extends HTMLElement {
    connectedCallback() {
      this._activatePaidLandingPage();
      this._pageViewAnalyticsSent = false;
      this._pageViewAdvertisingSent = false;
      this._consentHandler = () => {
        const consent = consentState();
        if (consent.advertisingKnown && !consent.advertising) purgeAdvertisingIdentifiers(consent.analytics);
        this._trackingState = consent.analytics ? canonicalTrackingState(consent) : null;
        this._trackPageView();
      };
      ['consentPolicyInitialized', 'consentPolicyChanged', 'TagManagerConfigSet', 'ucConsentEvent', 'bwConsentPolicyChanged'].forEach((eventName) => {
        document.addEventListener(eventName, this._consentHandler);
        window.addEventListener(eventName, this._consentHandler);
      });
      this._render();
      this._bind();
      this._loadDates();
      this._setupAutoHeight();
      this._hideGlobalStickyCtas();
      this._trackPageView();
      // No 'bw-paid-landing-ready' event on purpose: the j7kfw Velo bridge only
      // lists sessions and opens the old checkout after that event, so it stays
      // idle. Booking happens on the Berlin Then and Now booking page.
    }

    disconnectedCallback() {
      if (this._heightObserver) this._heightObserver.disconnect();
      if (this._globalCtaObserver) this._globalCtaObserver.disconnect();
      if (this._heightResizeHandler) window.removeEventListener('resize', this._heightResizeHandler);
      if (this._loadHandler) window.removeEventListener('load', this._loadHandler);
      if (this._datesRequest) this._datesRequest.abort();
      if (this._consentHandler) {
        ['consentPolicyInitialized', 'consentPolicyChanged', 'TagManagerConfigSet', 'ucConsentEvent', 'bwConsentPolicyChanged'].forEach((eventName) => {
          document.removeEventListener(eventName, this._consentHandler);
          window.removeEventListener(eventName, this._consentHandler);
        });
      }
      document.documentElement.classList.remove('bw-paid-landing-active');
      document.body?.classList.remove('bw-paid-landing-active');
    }

    _render() {
      const heroImage = asset('paid-landing/assets/tour-cta-yusuf-rathaus-solo.jpg');
      const brandLogo = asset('paid-landing/assets/berlinwalk-wordmark-green.png');
      const storyImage = asset('paid-landing/assets/museum-island.webp');
      const routeMap = asset('paid-landing/assets/berlin-mitte-map-v2-1280w.webp');
      const fullRouteMap = asset('paid-landing/assets/berlin-mitte-map-v2-1562w.webp');
      const icon = (name) => asset(`paid-landing/assets/icons/${name}.svg`);
      const bookHref = escapeAttribute(bookingHref(''));
      const faq = FAQ_ITEMS.map((item) => `
              <details class="faq-item">
                <summary><span class="faq-icon"><img src="${icon(item.icon)}" alt=""></span><span><strong>${item.q}</strong><small>${item.short}</small></span><img class="faq-chevron" src="${icon('chevron-down')}" alt=""></summary>
                <p>${item.a}</p>
              </details>`).join('');

      this.innerHTML = `
        <style>${this._styles()}</style>
        <main class="bw-paid-landing">
          <header class="site-header">
            <a class="brand" href="https://walkofberlin.com" aria-label="BerlinWalk at walkofberlin.com">
              <img src="${brandLogo}" alt="BerlinWalk">
              <span>walkofberlin.com</span>
            </a>
            <button class="menu-toggle" type="button" data-site-menu-toggle aria-label="Open navigation menu" aria-expanded="false" aria-controls="site-navigation">
              <img data-site-menu-icon src="${icon('list')}" alt="">
            </button>
            <nav id="site-navigation" class="site-nav" data-site-nav aria-label="Main navigation">
              <a href="#story" data-scroll-target="story">The walk</a>
              <a href="#booking" data-scroll-target="booking">Book your walk</a>
              <a href="#faq" data-scroll-target="faq">FAQ</a>
              <button class="site-nav__cta" type="button" data-scroll-target="booking" data-track-pick-date>See dates <img src="${icon('arrow-right')}" alt=""></button>
            </nav>
          </header>

          <section class="hero section-wrap" id="hero" aria-labelledby="hero-title">
            <p class="eyebrow hero-eyebrow">BERLIN THEN AND NOW <span aria-hidden="true">·</span> WALKING TOUR</p>
            <h1 class="hero-title" id="hero-title">Walk Berlin<br>with me.</h1>
            <p class="hero-intro">Berlin's old city did not survive. I walk you through where it stood, with an archive photo at every stop.</p>

            <figure class="hero-photo">
              <img src="${heroImage}" alt="Yusuf raising his arm in front of Berlin's Rotes Rathaus">
              <figcaption>I'm Yusuf. I'll show you the city that was here before.</figcaption>
            </figure>

            <ul class="feature-list" aria-label="Tour details">
              <li class="feature">
                <img src="${icon('clock')}" alt="">
                <span><strong>About 2.5 hours</strong><small>about 3 km</small></span>
              </li>
              <li class="feature">
                <img src="${icon('flag')}" alt="">
                <span><strong>11 stops</strong><small>16 places</small></span>
              </li>
              <li class="feature">
                <img src="${icon('chat-circle')}" alt="">
                <span><strong>Max 10 people</strong><small>in English</small></span>
              </li>
              <li class="feature">
                <img src="${icon('coins')}" alt="">
                <span><strong>€25</strong><small>per person</small></span>
              </li>
            </ul>

            <div class="hero-actions">
              <button class="button button--yellow hero-cta" type="button" data-scroll-target="booking" data-track-pick-date>
                See dates <img src="${icon('arrow-right')}" alt="">
              </button>
              <p class="price-note">€25 per person, paid when you book. Full refund if you cancel at least 24 hours before the start.</p>
            </div>
          </section>

          <section class="route-overview section-wrap" aria-labelledby="route-overview-title">
            <figure class="route-overview__visual">
              <div class="route-overview__map">
                <img src="${routeMap}" srcset="${asset('paid-landing/assets/berlin-mitte-map-v2-780w.webp')} 780w, ${routeMap} 1280w, ${fullRouteMap} 1562w" sizes="(max-width: 680px) calc(100vw - 40px), 720px" width="1562" height="1007" loading="lazy" decoding="async" alt="Illustrated Berlin Mitte map with the walking route from the World Clock at Alexanderplatz to Hackescher Markt">
                <svg class="route-overview__path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  <path class="route-overview__halo" d="${ROUTE_OVERVIEW_PATH}"></path>
                  <path class="route-overview__line" d="${ROUTE_OVERVIEW_PATH}"></path>
                </svg>
                <span class="route-overview__pin route-overview__pin--start" aria-hidden="true"></span>
                <span class="route-overview__pin route-overview__pin--finish" aria-hidden="true"></span>
              </div>
              <figcaption><span><strong>Start</strong> World Clock, Alexanderplatz</span><span><strong>Finish</strong> Hackescher Markt</span></figcaption>
              <div class="route-overview__tools">
                <a href="${fullRouteMap}" target="_blank" rel="noopener">View larger map <span aria-hidden="true">↗</span></a>
                <a class="route-overview__credit" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap contributors</a>
              </div>
            </figure>
            <div class="route-overview__copy">
              <span class="section-mark" aria-hidden="true"></span>
              <p class="eyebrow">YOUR WALK AT A GLANCE</p>
              <h2 id="route-overview-title">Through the city that disappeared.</h2>
              <p>Meet me at 12:30 at the World Clock. From Alexanderplatz we pass the TV Tower, the Marienkirche and the Humboldt Forum, cross Museum Island and finish at Hackescher Markt, about 3 km later.</p>
              <a class="route-overview__link" href="${ROUTE_PAGE_URL}">See the full route: 11 stops, 16 places <span aria-hidden="true">→</span></a>
            </div>
          </section>

          <section class="story section-wrap" id="story" aria-labelledby="story-title">
            <div class="story-copy">
              <span class="section-mark" aria-hidden="true"></span>
              <p class="eyebrow">AN ARCHIVE PHOTO AT EVERY STOP</p>
              <h2 id="story-title">Berlin then.<br>Berlin now.</h2>
              <p class="story-intro">The streets where the city grew up were cleared after the war, and much of what people call the old town today is a 1980s rebuild. At every stop I hold up an archive photo of the same place, so you can see what stood there and what is left.</p>
            </div>
            <figure class="story-photo">
              <img src="${storyImage}" alt="The historic colonnade and entrance of the Alte Nationalgalerie on Museum Island">
              <figcaption><span>Museum Island</span><span>Berlin, Germany</span></figcaption>
            </figure>
          </section>

          <section class="booking section-wrap" id="booking" aria-labelledby="booking-title">
            <div class="booking-heading">
              <span class="section-mark" aria-hidden="true"></span>
              <p class="eyebrow">BERLIN THEN AND NOW</p>
              <h2 id="booking-title">Book your walk</h2>
            </div>

            <div class="booking-panel handoff-panel">
              <dl class="walk-facts">
                <div><dt>Start</dt><dd>12:30 at the World Clock, Alexanderplatz</dd></div>
                <div><dt>Finish</dt><dd>Hackescher Markt, about 2.5 hours and 3 km later</dd></div>
                <div><dt>Price</dt><dd>€25 per person, paid when you book</dd></div>
                <div><dt>Group</dt><dd>No more than 10 people. A walk needs at least 2 guests. If you are the only guest one hour before the start, I cancel the walk, refund you in full and give you one of my audio walks for free.</dd></div>
                <div><dt>Changes</dt><dd>Cancel up to 24 hours before the start for a full refund, or move to another date if there is space. Later than that, or if you do not come, I cannot refund.</dd></div>
              </dl>
              <div class="handoff-actions">
                <div class="live-dates" data-bw-paid-dates aria-label="Next tour dates" hidden></div>
                <a class="button button--green handoff-cta" href="${bookHref}" data-bw-paid-book="booking">See dates and book <img src="${icon('arrow-right')}" alt=""></a>
                <p class="handoff-note">You choose the date and the number of guests, then pay securely on my booking page.</p>
              </div>
            </div>
            <p class="booking-footnote">Coming with your own group? I run private walks: €249 for up to 6 people or €299 for up to 10. <a href="${PRIVATE_TOUR_URL}">See private walks</a></p>
          </section>

          <section class="faq-section section-wrap" id="faq" aria-labelledby="faq-title">
            <div class="faq-heading">
              <span class="section-mark" aria-hidden="true"></span>
              <p class="eyebrow">A FEW USEFUL DETAILS</p>
              <h2 id="faq-title">Before your walk</h2>
            </div>
            <div class="faq-list">${faq}
            </div>
          </section>

          <footer class="site-footer">
            <a class="footer-brand" href="https://walkofberlin.com">BerlinWalk <span>·</span> walkofberlin.com</a>
            <span>A deeper Berlin, one step at a time.</span>
          </footer>
        </main>
      `;
    }

    _bind() {
      const nav = this.querySelector('[data-site-nav]');
      const menuToggle = this.querySelector('[data-site-menu-toggle]');
      const menuIcon = this.querySelector('[data-site-menu-icon]');
      const closeMenu = () => {
        if (nav) nav.classList.remove('is-open');
        if (menuToggle) {
          menuToggle.setAttribute('aria-expanded', 'false');
          menuToggle.setAttribute('aria-label', 'Open navigation menu');
        }
        if (menuIcon) menuIcon.src = asset('paid-landing/assets/icons/list.svg');
      };
      if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
          const open = !nav.classList.contains('is-open');
          nav.classList.toggle('is-open', open);
          menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
          menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
          if (menuIcon) menuIcon.src = asset(`paid-landing/assets/icons/${open ? 'close' : 'list'}.svg`);
        });
      }

      const links = Array.from(this.querySelectorAll('[data-scroll-target]'));
      links.forEach((link) => {
        link.addEventListener('click', (event) => {
          event.preventDefault();
          const target = this.querySelector(`#${link.getAttribute('data-scroll-target')}`);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (nav && nav.contains(link)) closeMenu();
          if (link.hasAttribute('data-track-pick-date')) {
            this._track('bw_booking_pick_date_click', {
              label: link.textContent.trim(),
              source: 'paid_landing_anchor',
            });
          }
        });
      });

      // Booking links are real links to the Berlin Then and Now booking page,
      // so a click works even if tracking fails.
      this.addEventListener('click', (event) => {
        const link = event.target && event.target.closest ? event.target.closest('[data-bw-paid-book]') : null;
        if (!link || !this.contains(link)) return;
        this._track('bw_booking_next_click', {
          source: 'paid_landing_handoff',
          placement: link.getAttribute('data-bw-paid-book') || '',
          start: link.getAttribute('data-bw-paid-start') || '',
        });
      });
    }

    // Live dates for Berlin Then and Now (Wix service 145cb27e). While the
    // service has no bookable date or the feed fails, the strip stays hidden and
    // the "See dates and book" button carries the visitor to the booking page.
    async _loadDates() {
      const strip = this.querySelector('[data-bw-paid-dates]');
      if (!strip || typeof fetch !== 'function') return;
      try {
        this._datesRequest = typeof AbortController === 'function' ? new AbortController() : null;
        const response = await fetch(AVAILABILITY_URL, { signal: this._datesRequest?.signal, cache: 'no-cache' });
        if (!response.ok) return;
        const data = await response.json();
        if (!this.isConnected) return;
        const dates = nextDates(data, new Date());
        if (!dates.length) return;
        const label = document.createElement('span');
        label.className = 'live-dates__label';
        label.textContent = 'Next dates';
        const chips = dates.map(({ key, label: text }) => {
          const link = document.createElement('a');
          link.className = 'live-dates__chip';
          link.href = bookingHref(key);
          link.setAttribute('data-bw-paid-book', 'date_chip');
          link.setAttribute('data-bw-paid-start', key);
          link.textContent = text;
          return link;
        });
        strip.replaceChildren(label, ...chips);
        strip.hidden = false;
        this._syncAutoHeight();
      } catch {
        // Leave the strip hidden.
      }
    }

    _setupAutoHeight() {
      const content = this.querySelector('.bw-paid-landing');
      if (!content) return;

      const sync = () => this._syncAutoHeight();
      this._loadHandler = sync;
      this._heightResizeHandler = sync;

      if ('ResizeObserver' in window) {
        this._heightObserver = new ResizeObserver(sync);
        this._heightObserver.observe(content);
      }

      window.addEventListener('load', this._loadHandler);
      window.addEventListener('resize', this._heightResizeHandler);
      window.requestAnimationFrame(sync);
      window.requestAnimationFrame(() => window.requestAnimationFrame(sync));
      window.setTimeout(sync, 800);
      window.setTimeout(sync, 2200);
    }

    _activatePaidLandingPage() {
      document.documentElement.classList.add('bw-paid-landing-active');
      document.body?.classList.add('bw-paid-landing-active');
    }

    _hideGlobalStickyCtas() {
      const hide = () => {
        document.querySelectorAll('#bw-sticky-cta, #bw-desktop-cta, [data-bw-tourcta]').forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          node.style.setProperty('display', 'none', 'important');
          node.style.setProperty('visibility', 'hidden', 'important');
          node.style.setProperty('pointer-events', 'none', 'important');
        });
        document.body?.classList.remove('bw-sticky-active');
        document.body?.style.setProperty('padding-bottom', '0px', 'important');
      };

      hide();
      window.setTimeout(hide, 300);
      window.setTimeout(hide, 1200);
      window.setTimeout(hide, 2600);

      if ('MutationObserver' in window) {
        this._globalCtaObserver = new MutationObserver(hide);
        this._globalCtaObserver.observe(document.body || document.documentElement, {
          childList: true,
          subtree: true,
        });
      }
    }

    _syncAutoHeight() {
      const content = this.querySelector('.bw-paid-landing');
      if (!content) return;

      const height = Math.ceil(content.getBoundingClientRect().height);
      if (!height) return;

      this.style.setProperty('display', 'block', 'important');
      this.style.setProperty('height', `${height}px`, 'important');
      this.style.setProperty('min-height', '0', 'important');
      this.style.setProperty('overflow', 'visible', 'important');
      this.style.setProperty('width', '100%', 'important');

      const parent = this.parentElement;
      // Wix clips the page to this host's layout height. Keep it in sync in
      // both directions when the details form or viewport changes size.
      if (parent && parent !== document.body && parent !== document.documentElement) {
        parent.style.setProperty('height', `${height}px`, 'important');
        parent.style.setProperty('min-height', '0', 'important');
      }

      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: 'bw-resize',
          source: 'bw-paid-landing',
          height,
        }, '*');
      }
    }

    _trackPageView() {
      const marker = String(window.location.pathname || '/');
      const sent = window.__bwPaidLandingPageViews || (window.__bwPaidLandingPageViews = {});
      const current = sent[marker] || {};
      this._pageViewAnalyticsSent = this._pageViewAnalyticsSent || current.analytics === true;
      this._pageViewAdvertisingSent = this._pageViewAdvertisingSent || current.advertising === true;
      const consent = consentState();
      const channels = {
        analytics: consent.analytics && !this._pageViewAnalyticsSent,
        advertising: consent.advertising && !this._pageViewAdvertisingSent,
      };
      if (!channels.analytics && !channels.advertising) return false;
      const result = this._track('bw_booking_page_view', { source: 'paid_landing' }, channels);
      if (result.analytics) this._pageViewAnalyticsSent = true;
      if (result.advertising) this._pageViewAdvertisingSent = true;
      sent[marker] = {
        analytics: this._pageViewAnalyticsSent,
        advertising: this._pageViewAdvertisingSent,
      };
      return result.analytics || result.advertising;
    }

    _track(name, detail, channels = {}) {
      const consent = consentState();
      const allowAnalytics = channels.analytics !== false && consent.analytics;
      const allowAdvertising = channels.advertising !== false && consent.advertising;
      if (!allowAnalytics && !allowAdvertising) return { analytics: false, advertising: false };

      const now = new Date().toISOString();
      const state = allowAnalytics
        ? (this._trackingState = canonicalTrackingState(consent))
        : null;
      const params = this._params(consent);
      const eventId = randomId('bw_e');
      const detailPayload = Object.assign({}, detail || {}, {
        event_id: eventId,
        attribution_id: state?.attributionId || '',
      });

      if (allowAnalytics) {
        const payload = {
          event: name,
          eventName: name,
          pagePath: window.location.pathname,
          detail: detailPayload,
          ts: now,
        };
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(payload);
        if (typeof window.gtag === 'function') window.gtag('event', name, detailPayload);
      }

      if (allowAdvertising && typeof window.fbq === 'function') {
        window.fbq('trackCustom', name, Object.assign({}, detailPayload));
      }

      if (allowAnalytics && /(^|\.)berlinwalk\.com$|^(www\.)?walkofberlin\.com$/i.test(window.location.hostname)) {
        fetch(TRACK_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
          body: JSON.stringify({
            eventName: name,
            eventId,
            consentGranted: consent.analytics,
            analyticsConsent: consent.analytics,
            consent: {
              analytics: consent.analytics,
              advertising: consent.advertising,
            },
            timestamp: now,
            sessionId: state?.sessionId || '',
            visitorId: state?.visitorId || '',
            attributionId: state?.attributionId || '',
            pagePath: window.location.pathname,
            landingPage: state?.landingPage || window.location.href,
            firstPage: state?.firstPage || window.location.pathname,
            referrer: document.referrer || '',
            isPaid: Boolean(state?.isPaid),
            screenWidth: String(window.screen && window.screen.width || ''),
            viewportWidth: String(window.innerWidth || ''),
            utmSource: params.utm_source,
            utmMedium: params.utm_medium,
            utmCampaign: params.utm_campaign,
            utmContent: params.utm_content,
            utmTerm: params.utm_term,
            utmId: params.utm_id,
            fbclid: allowAdvertising ? params.fbclid : '',
            fbc: allowAdvertising ? params.fbc : '',
            fbp: allowAdvertising ? params.fbp : '',
            payload: detailPayload,
          }),
        }).catch(() => {});
      }

      return { analytics: allowAnalytics, advertising: allowAdvertising };
    }

    _params(consent = consentState()) {
      const params = new URLSearchParams(window.location.search);
      const advertising = consent.advertising === true;
      return {
        utm_source: params.get('utm_source') || '',
        utm_medium: params.get('utm_medium') || '',
        utm_campaign: params.get('utm_campaign') || '',
        utm_content: params.get('utm_content') || '',
        utm_term: params.get('utm_term') || '',
        utm_id: params.get('utm_id') || '',
        fbclid: advertising ? params.get('fbclid') || '' : '',
        fbc: advertising ? params.get('fbc') || readCookie('_fbc') : '',
        fbp: advertising ? params.get('fbp') || readCookie('_fbp') : '',
      };
    }

    _styles() {
      return APPROVED_DESIGN_CSS
        .replaceAll('__BW_MONTESSERAT_REGULAR__', asset('paid-landing/assets/fonts/Montserrat-Regular.ttf'))
        .replaceAll('__BW_MONTESSERAT_BOLD__', asset('paid-landing/assets/fonts/Montserrat-Bold.ttf'))
        .replaceAll('__BW_MONTESSERAT_EXTRABOLD__', asset('paid-landing/assets/fonts/Montserrat-ExtraBold.ttf'))
        + LIVE_BOOKING_CSS;
    }
  }

  if (window.BW_PAID_LANDING_TEST_HOOKS) {
    window.__bwPaidLandingTestHooks = {
      consentState,
      canonicalTrackingState,
      purgeAdvertisingIdentifiers,
      bookingHref,
      nextDates,
      FAQ_ITEMS,
      BWPaidLandingElement,
    };
  }

  if (!customElements.get('bw-paid-landing')) {
    customElements.define('bw-paid-landing', BWPaidLandingElement);
  }
}());
