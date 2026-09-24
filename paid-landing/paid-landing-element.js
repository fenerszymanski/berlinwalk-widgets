(function () {
  const SCRIPT_URL = document.currentScript?.src || '';
  const BASE_URL = SCRIPT_URL
    ? new URL('../', SCRIPT_URL).toString()
    : 'https://fenerszymanski.github.io/berlinwalk-widgets/';
  // This calendar build supports an event-owned continue action; Velo keeps the
  // visitor on this page and handles the existing checkout backend/payment flow.
  const CALENDAR_SCRIPT_URL = new URL('booking-calendar/booking-calendar-element.js?v=paid-landing-event-button-20260924', BASE_URL).toString();
  const LANDING_AVAILABILITY_DAYS = '45';
  // Stop order and illustration coordinates match route/data.json.
  const ROUTE_OVERVIEW_PATH = 'M97 37 L82 36 L89 47 L73 42 L72 35 L76 58 L55 80 L38 72 L46 64 L37 56 L31 46 L25 10';
  const TRACK_ENDPOINT = 'https://berlinwalk-content-app.vercel.app/api/pf-event';
  const PAID_TRACKING_KEY = 'bwPaidTracking.v1';
  const PAID_VISITOR_KEY = 'bwVisitorId.v1';
  const PAID_SESSION_KEY = 'bwSessionId.v1';
  const PAID_AD_IDENTIFIER_KEYS = ['fbclid', 'fbc', 'fbp'];

  const asset = (path) => new URL(path, BASE_URL).toString();
  const APPROVED_DESIGN_CSS = "@font-face {\n  font-family: \"Montserrat\";\n  src: url(\"__BW_MONTESSERAT_REGULAR__\") format(\"truetype\");\n  font-weight: 400;\n  font-style: normal;\n  font-display: swap;\n}\n\n@font-face {\n  font-family: \"Montserrat\";\n  src: url(\"__BW_MONTESSERAT_BOLD__\") format(\"truetype\");\n  font-weight: 700;\n  font-style: normal;\n  font-display: swap;\n}\n\n@font-face {\n  font-family: \"Montserrat\";\n  src: url(\"__BW_MONTESSERAT_EXTRABOLD__\") format(\"truetype\");\n  font-weight: 800;\n  font-style: normal;\n  font-display: swap;\n}\n\n.bw-paid-landing {\n  font-family: \"Montserrat\", Arial, sans-serif;\n  color: #212121;\n  background: #fafaf5;\n  font-synthesis: none;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  font-optical-sizing: auto;\n  --cream: #fafaf5;\n  --green: #1b5e20;\n  --green-deep: #123d18;\n  --yellow: #ffe600;\n  --ink: #212121;\n  --soft-ink: #526358;\n  --line: #d9e1d8;\n  --pale-green: #eff4ec;\n  --white: #ffffff;\n}\n\n.bw-paid-landing * {\n  box-sizing: border-box;\n}\n\n.bw-paid-landing {\n  min-width: 320px;\n  scroll-behavior: smooth;\n  scroll-padding-top: 28px;\n}\n\n.bw-paid-landing {\n  min-width: 320px;\n  min-height: 100vh;\n  margin: 0;\n  background: var(--cream);\n  color: var(--ink);\n  font-size: 16px;\n  line-height: 1.5;\n}\n\n.bw-paid-landing button,\n.bw-paid-landing input,\n.bw-paid-landing select {\n  font: inherit;\n}\n\n.bw-paid-landing button,\n.bw-paid-landing a,\n.bw-paid-landing input,\n.bw-paid-landing select,\n.bw-paid-landing summary {\n  -webkit-tap-highlight-color: transparent;\n}\n\n.bw-paid-landing button {\n  color: inherit;\n}\n\n.bw-paid-landing a {\n  color: var(--green-deep);\n}\n\n.bw-paid-landing a:focus-visible,\n.bw-paid-landing button:focus-visible,\n.bw-paid-landing input:focus-visible,\n.bw-paid-landing select:focus-visible,\n.bw-paid-landing summary:focus-visible {\n  outline: 3px solid #386b3c;\n  outline-offset: 4px;\n}\n\n.bw-paid-landing figure,\n.bw-paid-landing p,\n.bw-paid-landing h1,\n.bw-paid-landing h2,\n.bw-paid-landing h3 {\n  margin: 0;\n}\n\n.bw-paid-landing .preview-notice {\n  display: flex;\n  min-height: 37px;\n  align-items: center;\n  justify-content: center;\n  gap: 9px;\n  padding: 6px 18px;\n  border-bottom: 1px solid #e2e4db;\n  background: #f0f2e9;\n  color: #334d35;\n  font-size: 11px;\n  font-weight: 600;\n  letter-spacing: 0.01em;\n  text-align: center;\n}\n\n.bw-paid-landing .preview-notice__tag {\n  flex: 0 0 auto;\n  color: var(--green-deep);\n  font-size: 9px;\n  font-weight: 800;\n  letter-spacing: 0.12em;\n}\n\n.bw-paid-landing .preview-notice__separator {\n  color: #8b9788;\n}\n\n.bw-paid-landing .site-header {\n  position: relative;\n  z-index: 5;\n  display: flex;\n  width: min(1320px, calc(100% - 72px));\n  min-height: 104px;\n  align-items: center;\n  justify-content: space-between;\n  margin: 0 auto;\n}\n\n.bw-paid-landing .brand {\n  display: flex;\n  width: max-content;\n  flex-direction: column;\n  align-items: flex-start;\n  gap: 2px;\n  color: #718277;\n  font-size: 16px;\n  line-height: 1.2;\n  text-decoration: none;\n}\n\n.bw-paid-landing .brand img {\n  display: block;\n  width: 218px;\n  height: auto;\n}\n\n.bw-paid-landing .brand span {\n  padding-left: 1px;\n}\n\n.bw-paid-landing .menu-toggle {\n  display: grid;\n  width: 48px;\n  height: 48px;\n  place-items: center;\n  border: 0;\n  border-radius: 50%;\n  background: transparent;\n  color: var(--green-deep);\n  cursor: pointer;\n}\n\n.bw-paid-landing .menu-toggle:hover {\n  background: #edf1e9;\n}\n\n.bw-paid-landing .site-nav {\n  position: absolute;\n  top: 82px;\n  right: 0;\n  display: none;\n  width: min(260px, calc(100vw - 40px));\n  flex-direction: column;\n  gap: 3px;\n  padding: 11px;\n  border: 1px solid var(--line);\n  border-radius: 12px;\n  background: var(--cream);\n  box-shadow: 0 14px 35px rgb(18 61 24 / 12%);\n}\n\n.bw-paid-landing .site-nav.is-open {\n  display: flex;\n}\n\n.bw-paid-landing .site-nav a,\n.bw-paid-landing .site-nav__cta {\n  display: flex;\n  min-height: 44px;\n  align-items: center;\n  justify-content: space-between;\n  padding: 9px 11px;\n  border: 0;\n  border-radius: 7px;\n  background: transparent;\n  color: var(--green-deep);\n  font-size: 14px;\n  font-weight: 700;\n  text-align: left;\n  text-decoration: none;\n  cursor: pointer;\n}\n\n.bw-paid-landing .site-nav a:hover,\n.bw-paid-landing .site-nav__cta:hover {\n  background: var(--pale-green);\n}\n\n.bw-paid-landing .site-nav__cta {\n  background: var(--yellow);\n}\n\n.bw-paid-landing .section-wrap {\n  width: min(1240px, calc(100% - 88px));\n  margin-inline: auto;\n}\n\n.bw-paid-landing .hero {\n  display: grid;\n  min-height: 660px;\n  grid-template-columns: minmax(0, 0.88fr) minmax(420px, 1.12fr);\n  grid-template-areas:\n    \"eyebrow photo\"\n    \"title photo\"\n    \"intro photo\"\n    \"features photo\"\n    \"actions photo\";\n  align-items: center;\n  align-content: center;\n  column-gap: clamp(36px, 5vw, 78px);\n  row-gap: 0;\n  padding-top: 12px;\n  padding-bottom: 58px;\n}\n\n.bw-paid-landing .hero-eyebrow {\n  grid-area: eyebrow;\n  align-self: end;\n  margin-bottom: 13px;\n}\n\n.bw-paid-landing .hero-title {\n  grid-area: title;\n  align-self: start;\n  margin-top: 0;\n}\n\n.bw-paid-landing .eyebrow {\n  color: #4b754e;\n  font-size: 14px;\n  font-weight: 800;\n  letter-spacing: 0.065em;\n  line-height: 1.3;\n}\n\n.bw-paid-landing .hero-title {\n  color: var(--green-deep);\n  font-size: clamp(56px, 6.6vw, 92px);\n  font-weight: 800;\n  letter-spacing: -0.072em;\n  line-height: 0.98;\n}\n\n.bw-paid-landing .hero-intro {\n  grid-area: intro;\n  align-self: start;\n  max-width: 540px;\n  margin-top: 14px;\n  color: #263b2b;\n  font-size: clamp(18px, 1.8vw, 23px);\n  line-height: 1.45;\n}\n\n.bw-paid-landing .feature-list {\n  grid-area: features;\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 17px 25px;\n  margin: 25px 0 23px;\n  padding: 0;\n  list-style: none;\n}\n\n.bw-paid-landing .feature {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  color: var(--green);\n}\n\n.bw-paid-landing .feature > span {\n  display: flex;\n  flex-direction: column;\n  color: var(--green-deep);\n  font-size: 15px;\n  line-height: 1.3;\n}\n\n.bw-paid-landing .feature strong {\n  font-size: 17px;\n  font-weight: 700;\n}\n\n.bw-paid-landing .feature small {\n  color: #405346;\n  font-size: 13px;\n}\n\n.bw-paid-landing .button {\n  display: inline-flex;\n  min-height: 54px;\n  align-items: center;\n  justify-content: center;\n  gap: 12px;\n  padding: 13px 24px;\n  border: 1px solid transparent;\n  border-radius: 10px;\n  font-size: 16px;\n  font-weight: 800;\n  line-height: 1.2;\n  text-align: center;\n  text-decoration: none;\n  cursor: pointer;\n  transition: background-color 140ms ease, border-color 140ms ease, transform 140ms ease;\n}\n\n.bw-paid-landing .button:active:not(:disabled) {\n  transform: translateY(1px);\n}\n\n.bw-paid-landing .button--yellow {\n  background: var(--yellow);\n  color: var(--green-deep);\n}\n\n.bw-paid-landing .button--yellow:hover {\n  background: #f5dc00;\n  color: var(--green-deep);\n}\n\n.bw-paid-landing .hero-cta {\n  min-width: 285px;\n  min-height: 64px;\n  border-radius: 15px;\n  font-size: 22px;\n}\n\n.bw-paid-landing .hero-actions {\n  grid-area: actions;\n  align-self: start;\n}\n\n.bw-paid-landing .deposit-note {\n  margin-top: 14px;\n  color: #405346;\n  font-size: 14px;\n  line-height: 1.45;\n}\n\n.bw-paid-landing .hero-photo {\n  grid-area: photo;\n  grid-row: 1 / 6;\n  position: relative;\n  overflow: hidden;\n  min-height: 610px;\n  align-self: stretch;\n  border-radius: 3px 3px 16px 16px;\n  background: #e7e0d3;\n}\n\n.bw-paid-landing .hero-photo img {\n  display: block;\n  width: 100%;\n  height: 100%;\n  min-height: 610px;\n  object-fit: cover;\n  object-position: 50% 20%;\n}\n\n.bw-paid-landing .hero-photo figcaption {\n  position: absolute;\n  right: 20px;\n  bottom: 20px;\n  max-width: calc(100% - 40px);\n  padding: 9px 12px;\n  border-radius: 5px;\n  background: var(--cream);\n  color: var(--green-deep);\n  font-size: 12px;\n  font-weight: 700;\n}\n\n.bw-paid-landing .story {\n  display: grid;\n  grid-template-columns: minmax(310px, 0.88fr) minmax(420px, 1.12fr);\n  align-items: center;\n  gap: clamp(54px, 8vw, 120px);\n  padding-block: 70px 84px;\n  border-top: 1px solid var(--line);\n}\n\n.bw-paid-landing .section-mark {\n  display: block;\n  width: 44px;\n  height: 5px;\n  margin-bottom: 22px;\n  border-radius: 5px;\n  background: #4a883e;\n}\n\n.bw-paid-landing .story h2,\n.bw-paid-landing .booking-heading h2,\n.bw-paid-landing .faq-heading h2 {\n  margin-top: 14px;\n  color: var(--green-deep);\n  font-size: clamp(40px, 5vw, 64px);\n  font-weight: 800;\n  letter-spacing: -0.06em;\n  line-height: 1.02;\n}\n\n.bw-paid-landing .story-intro {\n  max-width: 425px;\n  margin-top: 20px;\n  color: #263b2b;\n  font-size: 18px;\n  line-height: 1.5;\n}\n\n.bw-paid-landing .route-points {\n  display: grid;\n  gap: 19px;\n  margin-top: 29px;\n}\n\n.bw-paid-landing .route-point {\n  display: flex;\n  align-items: flex-start;\n  gap: 15px;\n  color: var(--green);\n}\n\n.bw-paid-landing .route-point p {\n  display: flex;\n  flex-direction: column;\n  color: var(--green-deep);\n  line-height: 1.35;\n}\n\n.bw-paid-landing .route-point span {\n  font-size: 14px;\n}\n\n.bw-paid-landing .route-point strong {\n  font-size: 16px;\n  font-weight: 700;\n}\n\n.bw-paid-landing .story-photo {\n  overflow: hidden;\n  border: 1px solid #e1e3d9;\n  border-radius: 14px;\n  background: var(--white);\n}\n\n.bw-paid-landing .story-photo img {\n  display: block;\n  width: 100%;\n  aspect-ratio: 1.45;\n  object-fit: cover;\n  object-position: center 52%;\n}\n\n.bw-paid-landing .story-photo figcaption {\n  display: flex;\n  justify-content: space-between;\n  gap: 14px;\n  padding: 11px 15px;\n  color: var(--green-deep);\n  font-size: 12px;\n  font-weight: 700;\n}\n\n.bw-paid-landing .story-photo figcaption span + span {\n  color: #617263;\n  font-weight: 500;\n}\n\n.bw-paid-landing .booking {\n  padding-block: 72px 82px;\n  border-top: 1px solid var(--line);\n}\n\n.bw-paid-landing .booking-heading {\n  margin-bottom: 29px;\n}\n\n.bw-paid-landing .booking-heading h2 {\n  margin-bottom: 26px;\n}\n\n.bw-paid-landing .step-progress {\n  display: grid;\n  grid-template-columns: 1fr auto 1fr auto 1fr;\n  align-items: center;\n  gap: 14px;\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n\n.bw-paid-landing .step-progress::before,\n.bw-paid-landing .step-progress::after {\n  content: \"\";\n  height: 1px;\n  background: var(--line);\n}\n\n.bw-paid-landing .step-progress__item {\n  display: flex;\n  align-items: center;\n  gap: 9px;\n  color: #758176;\n  font-size: 13px;\n  font-weight: 600;\n  white-space: nowrap;\n}\n\n.bw-paid-landing .step-progress__item:first-child {\n  grid-column: 1;\n  grid-row: 1;\n}\n\n.bw-paid-landing .step-progress__item:nth-child(2) {\n  grid-column: 3;\n  grid-row: 1;\n}\n\n.bw-paid-landing .step-progress__item:nth-child(3) {\n  grid-column: 5;\n  grid-row: 1;\n}\n\n.bw-paid-landing .step-progress::before {\n  grid-column: 2;\n  grid-row: 1;\n}\n\n.bw-paid-landing .step-progress::after {\n  grid-column: 4;\n  grid-row: 1;\n}\n\n.bw-paid-landing .step-progress__number {\n  display: grid;\n  width: 31px;\n  height: 31px;\n  flex: 0 0 auto;\n  place-items: center;\n  border-radius: 50%;\n  background: #e9ede5;\n  color: #637065;\n  font-size: 13px;\n  font-weight: 800;\n}\n\n.bw-paid-landing .step-progress__item.is-current,\n.bw-paid-landing .step-progress__item.is-complete {\n  color: var(--green-deep);\n}\n\n.bw-paid-landing .step-progress__item.is-current .step-progress__number,\n.bw-paid-landing .step-progress__item.is-complete .step-progress__number {\n  background: var(--green);\n  color: var(--white);\n}\n\n.bw-paid-landing .booking-panel {\n  padding: clamp(22px, 4vw, 42px);\n  border: 1px solid var(--line);\n  border-radius: 14px;\n  background: #fffefa;\n}\n\n.bw-paid-landing .booking-grid {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) minmax(220px, 0.32fr);\n  gap: clamp(28px, 5vw, 62px);\n}\n\n.bw-paid-landing .subheading-row {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 18px;\n  margin-bottom: 22px;\n  color: var(--green);\n}\n\n.bw-paid-landing .subheading-row h3 {\n  color: var(--green-deep);\n  font-size: clamp(20px, 2.2vw, 26px);\n  font-weight: 800;\n  letter-spacing: -0.035em;\n  line-height: 1.2;\n}\n\n.bw-paid-landing .subheading-row p {\n  margin-top: 6px;\n  color: #667469;\n  font-size: 13px;\n}\n\n.bw-paid-landing .date-options {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 12px;\n}\n\n.bw-paid-landing .date-option {\n  display: flex;\n  min-height: 94px;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 3px;\n  padding: 10px 6px;\n  border: 1px solid var(--line);\n  border-radius: 9px;\n  background: var(--cream);\n  color: #334538;\n  cursor: pointer;\n  transition: border-color 140ms ease, background-color 140ms ease;\n}\n\n.bw-paid-landing .date-option:hover {\n  border-color: #709273;\n}\n\n.bw-paid-landing .date-option.is-selected {\n  border: 2px solid var(--green);\n  background: #eff5ec;\n  color: var(--green-deep);\n}\n\n.bw-paid-landing .date-option > span:first-child {\n  font-size: 13px;\n}\n\n.bw-paid-landing .date-option strong {\n  font-size: 18px;\n  font-weight: 700;\n}\n\n.bw-paid-landing .date-option__selected {\n  display: inline-flex;\n  align-items: center;\n  gap: 3px;\n  color: var(--green);\n  font-size: 10px;\n  font-weight: 700;\n}\n\n.bw-paid-landing .field-label {\n  display: block;\n  color: var(--green-deep);\n  font-size: 14px;\n  font-weight: 700;\n}\n\n.bw-paid-landing .time-options-block {\n  margin-top: 21px;\n}\n\n.bw-paid-landing .time-options {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 9px;\n  margin-top: 10px;\n}\n\n.bw-paid-landing .time-option {\n  display: inline-flex;\n  min-width: 100px;\n  min-height: 42px;\n  align-items: center;\n  justify-content: center;\n  gap: 7px;\n  padding: 8px 14px;\n  border: 1px solid var(--line);\n  border-radius: 7px;\n  background: var(--white);\n  color: var(--green-deep);\n  font-size: 14px;\n  font-weight: 700;\n  cursor: pointer;\n}\n\n.bw-paid-landing .time-option:hover {\n  border-color: #709273;\n}\n\n.bw-paid-landing .time-option.is-selected {\n  border-color: var(--green);\n  background: var(--green);\n  color: var(--white);\n}\n\n.bw-paid-landing .selection-hint {\n  display: flex;\n  align-items: center;\n  gap: 9px;\n  margin-top: 22px;\n  color: #526358;\n  font-size: 14px;\n}\n\n.bw-paid-landing .guest-picker-block {\n  padding-left: clamp(0px, 2vw, 24px);\n  border-left: 1px solid var(--line);\n}\n\n.bw-paid-landing .guest-stepper {\n  display: grid;\n  min-height: 62px;\n  grid-template-columns: 1fr 1.2fr 1fr;\n  align-items: center;\n  margin-top: 9px;\n  border: 1px solid var(--line);\n  border-radius: 9px;\n  background: var(--cream);\n}\n\n.bw-paid-landing .guest-stepper button {\n  display: grid;\n  width: 100%;\n  height: 60px;\n  place-items: center;\n  border: 0;\n  border-radius: 8px;\n  background: transparent;\n  color: var(--green-deep);\n  cursor: pointer;\n}\n\n.bw-paid-landing .guest-stepper button:hover:not(:disabled) {\n  background: #edf2e9;\n}\n\n.bw-paid-landing .guest-stepper button:disabled {\n  color: #b4bdb3;\n  cursor: not-allowed;\n}\n\n.bw-paid-landing .guest-stepper output {\n  color: var(--green-deep);\n  font-size: 23px;\n  font-weight: 800;\n  text-align: center;\n}\n\n.bw-paid-landing .guest-caption {\n  margin-top: 8px;\n  color: #69786b;\n  font-size: 12px;\n}\n\n.bw-paid-landing .deposit-mini {\n  display: flex;\n  align-items: flex-start;\n  gap: 8px;\n  margin-top: 24px;\n  color: var(--green);\n  font-size: 12px;\n  line-height: 1.4;\n}\n\n.bw-paid-landing .deposit-mini span {\n  color: #526358;\n}\n\n.bw-paid-landing .button--green {\n  background: var(--green);\n  color: var(--white);\n}\n\n.bw-paid-landing .button--green:hover:not(:disabled) {\n  background: #154c1b;\n}\n\n.bw-paid-landing .button--green:disabled {\n  background: #d8ddd6;\n  color: #738074;\n  cursor: not-allowed;\n}\n\n.bw-paid-landing .continue-button {\n  width: 100%;\n  margin-top: 26px;\n}\n\n.bw-paid-landing .button-caption {\n  margin-top: 10px;\n  color: #6d786e;\n  font-size: 12px;\n  text-align: center;\n}\n\n.bw-paid-landing .booking-footnote {\n  margin-top: 15px;\n  color: #6c786e;\n  font-size: 12px;\n  text-align: center;\n}\n\n.bw-paid-landing .step-title-row {\n  align-items: center;\n  margin-bottom: 20px;\n}\n\n.bw-paid-landing .text-button {\n  display: inline-flex;\n  min-height: 38px;\n  flex: 0 0 auto;\n  align-items: center;\n  justify-content: center;\n  gap: 7px;\n  padding: 5px 7px;\n  border: 0;\n  border-radius: 5px;\n  background: transparent;\n  color: var(--green);\n  font-size: 13px;\n  font-weight: 800;\n  cursor: pointer;\n}\n\n.bw-paid-landing .text-button:hover {\n  background: var(--pale-green);\n}\n\n.bw-paid-landing .selection-summary {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  padding: 15px 16px;\n  border: 1px solid #dbe5d8;\n  border-radius: 8px;\n  background: #f2f6ef;\n  color: var(--green);\n}\n\n.bw-paid-landing .selection-summary > div {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n\n.bw-paid-landing .selection-summary > div > span {\n  display: flex;\n  flex-direction: column;\n  color: var(--green-deep);\n  font-size: 14px;\n  line-height: 1.4;\n}\n\n.bw-paid-landing .selection-summary strong {\n  font-weight: 700;\n}\n\n.bw-paid-landing .selection-summary small {\n  color: #536557;\n  font-size: 12px;\n}\n\n.bw-paid-landing .summary-sample,\n.bw-paid-landing .preview-lock {\n  flex: 0 0 auto;\n  color: #47764a;\n  font-size: 9px;\n  font-weight: 800;\n  letter-spacing: 0.12em;\n}\n\n.bw-paid-landing .details-form {\n  margin-top: 26px;\n}\n\n.bw-paid-landing .field-grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 17px 18px;\n}\n\n.bw-paid-landing .form-field {\n  display: flex;\n  flex-direction: column;\n  gap: 7px;\n  color: var(--green-deep);\n  font-size: 13px;\n  font-weight: 700;\n}\n\n.bw-paid-landing .form-field em {\n  color: #748074;\n  font-size: 11px;\n  font-style: normal;\n  font-weight: 500;\n}\n\n.bw-paid-landing .form-field input,\n.bw-paid-landing .form-field select {\n  width: 100%;\n  min-height: 47px;\n  padding: 10px 12px;\n  border: 1px solid #cdd8cd;\n  border-radius: 7px;\n  background: #fff;\n  color: var(--ink);\n  font-size: 15px;\n  font-weight: 500;\n}\n\n.bw-paid-landing .form-field input:hover,\n.bw-paid-landing .form-field select:hover {\n  border-color: #729373;\n}\n\n.bw-paid-landing .referral-field {\n  max-width: calc(50% - 9px);\n  margin-top: 18px;\n}\n\n.bw-paid-landing .deposit-rules {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) minmax(240px, 0.9fr);\n  align-items: center;\n  gap: 22px;\n  margin-top: 24px;\n  padding: 17px;\n  border: 1px solid var(--line);\n  border-radius: 8px;\n  background: #f7f8f2;\n}\n\n.bw-paid-landing .deposit-rules > p {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  color: var(--green-deep);\n  font-size: 13px;\n  line-height: 1.45;\n}\n\n.bw-paid-landing .deposit-rules > p strong {\n  font-size: 14px;\n}\n\n.bw-paid-landing .deposit-rules > p span {\n  color: #566458;\n  font-size: 12px;\n}\n\n.bw-paid-landing .checkbox-field {\n  display: flex;\n  align-items: flex-start;\n  gap: 10px;\n  color: var(--green-deep);\n  font-size: 12px;\n  font-weight: 600;\n  line-height: 1.45;\n  cursor: pointer;\n}\n\n.bw-paid-landing .checkbox-field input {\n  width: 17px;\n  height: 17px;\n  flex: 0 0 auto;\n  margin: 1px 0 0;\n  accent-color: var(--green);\n}\n\n.bw-paid-landing .form-actions {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 16px;\n  margin-top: 24px;\n}\n\n.bw-paid-landing .button--quiet {\n  border-color: #cbd7ca;\n  background: transparent;\n  color: var(--green-deep);\n}\n\n.bw-paid-landing .button--quiet:hover {\n  background: var(--pale-green);\n}\n\n.bw-paid-landing .preview-lock {\n  padding: 7px 9px;\n  border: 1px solid #cad8c8;\n  border-radius: 5px;\n  background: var(--pale-green);\n}\n\n.bw-paid-landing .payment-selection {\n  margin-top: 3px;\n}\n\n.bw-paid-landing .price-breakdown {\n  margin: 21px 0 0;\n}\n\n.bw-paid-landing .price-breakdown > div {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 14px;\n  padding: 11px 2px;\n  border-bottom: 1px solid #e6e9e1;\n  color: #415247;\n  font-size: 14px;\n}\n\n.bw-paid-landing .price-breakdown dt,\n.bw-paid-landing .price-breakdown dd {\n  margin: 0;\n}\n\n.bw-paid-landing .price-breakdown dd {\n  color: var(--green-deep);\n  font-weight: 700;\n}\n\n.bw-paid-landing .price-breakdown__total {\n  padding-top: 15px !important;\n  color: var(--green-deep) !important;\n  font-size: 16px !important;\n  font-weight: 800;\n}\n\n.bw-paid-landing .price-breakdown__total dd {\n  font-size: 20px;\n}\n\n.bw-paid-landing .no-transaction {\n  display: flex;\n  align-items: flex-start;\n  gap: 11px;\n  margin-top: 20px;\n  padding: 16px;\n  border: 1px solid #d8e2d5;\n  border-radius: 8px;\n  background: #f1f6ee;\n  color: var(--green);\n}\n\n.bw-paid-landing .no-transaction p {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  color: var(--green-deep);\n  font-size: 13px;\n}\n\n.bw-paid-landing .no-transaction p span {\n  color: #536557;\n  font-size: 12px;\n}\n\n.bw-paid-landing .customer-summary {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  margin-block: 18px 20px;\n  color: var(--green-deep);\n  font-size: 13px;\n}\n\n.bw-paid-landing .customer-summary span,\n.bw-paid-landing .customer-summary small {\n  color: #657366;\n  font-size: 11px;\n}\n\n.bw-paid-landing .faq-section {\n  display: grid;\n  grid-template-columns: minmax(250px, 0.65fr) minmax(0, 1.35fr);\n  gap: clamp(38px, 8vw, 110px);\n  padding-block: 69px 86px;\n  border-top: 1px solid var(--line);\n}\n\n.bw-paid-landing .faq-heading h2 {\n  font-size: clamp(34px, 4.2vw, 52px);\n}\n\n.bw-paid-landing .faq-list {\n  border-top: 1px solid var(--line);\n}\n\n.bw-paid-landing .faq-item {\n  border-bottom: 1px solid var(--line);\n}\n\n.bw-paid-landing .faq-item summary {\n  display: grid;\n  min-height: 83px;\n  grid-template-columns: 36px minmax(0, 1fr) 18px;\n  align-items: center;\n  gap: 12px;\n  list-style: none;\n  cursor: pointer;\n}\n\n.bw-paid-landing .faq-item summary::-webkit-details-marker {\n  display: none;\n}\n\n.bw-paid-landing .faq-icon {\n  display: grid;\n  width: 33px;\n  height: 33px;\n  place-items: center;\n  border: 2px solid #729273;\n  border-radius: 50%;\n  color: var(--green);\n}\n\n.bw-paid-landing .faq-item summary > span:nth-child(2) {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n\n.bw-paid-landing .faq-item summary strong {\n  color: var(--green-deep);\n  font-size: 14px;\n  font-weight: 800;\n}\n\n.bw-paid-landing .faq-item summary small {\n  color: #536557;\n  font-size: 12px;\n}\n\n.bw-paid-landing .faq-chevron {\n  flex: 0 0 auto;\n  color: var(--green-deep);\n  transition: transform 120ms ease;\n}\n\n.bw-paid-landing .faq-item[open] .faq-chevron {\n  transform: rotate(180deg);\n}\n\n.bw-paid-landing .faq-item > p {\n  max-width: 650px;\n  margin: -3px 32px 20px 48px;\n  color: #4f5f52;\n  font-size: 13px;\n  line-height: 1.55;\n}\n\n.bw-paid-landing .site-footer {\n  display: flex;\n  min-height: 75px;\n  align-items: center;\n  justify-content: space-between;\n  gap: 20px;\n  padding: 18px max(44px, calc((100% - 1240px) / 2));\n  border-top: 1px solid var(--line);\n  color: #68776a;\n  font-size: 12px;\n}\n\n.bw-paid-landing .footer-brand {\n  color: var(--green-deep);\n  font-weight: 800;\n  text-decoration: none;\n}\n\n.bw-paid-landing .footer-brand span {\n  padding-inline: 3px;\n  color: #98a395;\n}\n\n@media (max-width: 900px) {\n  .bw-paid-landing .section-wrap {\n    width: min(100% - 56px, 760px);\n  }\n\n  .bw-paid-landing .site-header {\n    width: calc(100% - 56px);\n  }\n\n  .bw-paid-landing .hero {\n    min-height: 0;\n    grid-template-columns: minmax(0, 0.96fr) minmax(300px, 1.04fr);\n    column-gap: 28px;\n  }\n\n  .bw-paid-landing .hero-title {\n    font-size: clamp(50px, 7.3vw, 68px);\n  }\n\n  .bw-paid-landing .hero-photo,\n.bw-paid-landing .hero-photo img {\n    min-height: 530px;\n  }\n\n  .bw-paid-landing .story {\n    grid-template-columns: minmax(260px, 0.9fr) minmax(320px, 1.1fr);\n    gap: 42px;\n  }\n\n  .bw-paid-landing .booking-grid {\n    grid-template-columns: minmax(0, 1fr) minmax(180px, 0.34fr);\n    gap: 24px;\n  }\n\n  .bw-paid-landing .guest-picker-block {\n    padding-left: 18px;\n  }\n\n  .bw-paid-landing .faq-section {\n    grid-template-columns: minmax(210px, 0.65fr) minmax(0, 1.35fr);\n    gap: 40px;\n  }\n}\n\n@media (max-width: 680px) {\n  .bw-paid-landing {\n    scroll-padding-top: 16px;\n  }\n\n  .bw-paid-landing {\n    font-size: 15px;\n  }\n\n  .bw-paid-landing .preview-notice {\n    flex-wrap: wrap;\n    gap: 3px 7px;\n    padding-inline: 13px;\n    font-size: 9px;\n    line-height: 1.35;\n  }\n\n  .bw-paid-landing .preview-notice__tag {\n    font-size: 8px;\n  }\n\n  .bw-paid-landing .preview-notice__separator {\n    display: none;\n  }\n\n  .bw-paid-landing .site-header {\n    width: calc(100% - 40px);\n    min-height: 65px;\n  }\n\n  .bw-paid-landing .brand img {\n    width: 130px;\n  }\n\n  .bw-paid-landing .brand {\n    font-size: 13px;\n  }\n\n  .bw-paid-landing .site-nav {\n    top: 69px;\n  }\n\n  .bw-paid-landing .section-wrap {\n    width: calc(100% - 40px);\n  }\n\n  .bw-paid-landing .hero {\n    position: relative;\n    display: block;\n    min-height: 0;\n    isolation: isolate;\n    padding-top: 8px;\n    padding-bottom: 25px;\n  }\n\n  .bw-paid-landing .hero-eyebrow {\n    position: relative;\n    z-index: 2;\n    width: max-content;\n    max-width: 100%;\n    margin-bottom: 8px;\n  }\n\n  .bw-paid-landing .eyebrow {\n    font-size: 11px;\n    letter-spacing: 0.055em;\n  }\n\n  .bw-paid-landing .hero-title {\n    position: relative;\n    z-index: 2;\n    width: min(205px, calc(100vw - 120px));\n    margin-top: 0;\n    font-size: clamp(32px, 8.3vw, 34px);\n    letter-spacing: -0.065em;\n    line-height: 0.98;\n  }\n\n  .bw-paid-landing .hero-intro {\n    position: relative;\n    z-index: 2;\n    width: min(205px, calc(100vw - 120px));\n    max-width: 205px;\n    margin-top: 8px;\n    font-size: 14px;\n    line-height: 1.42;\n  }\n\n  .bw-paid-landing .feature-list {\n    position: relative;\n    z-index: 2;\n    display: flex;\n    width: min(205px, calc(100vw - 120px));\n    flex-direction: column;\n    gap: 6px;\n    margin: 9px 0 0;\n    padding: 0;\n  }\n\n  .bw-paid-landing .feature {\n    gap: 8px;\n  }\n\n  .bw-paid-landing .feature > svg {\n    width: 22px;\n    height: 22px;\n  }\n\n  .bw-paid-landing .feature > span {\n    font-size: 13px;\n  }\n\n  .bw-paid-landing .feature strong {\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .feature small {\n    font-size: 13px;\n  }\n\n  .bw-paid-landing .hero-cta {\n    position: relative;\n    z-index: 2;\n    width: 180px;\n    min-width: 0;\n    min-height: 48px;\n    margin-top: 10px;\n    font-size: 16px;\n  }\n\n  .bw-paid-landing .hero-actions {\n    display: contents;\n  }\n\n  .bw-paid-landing .deposit-note {\n    position: relative;\n    z-index: 2;\n    width: 100vw;\n    margin: 10px 0 0 calc((100% - 100vw) / 2);\n    padding: 10px 20px;\n    background: var(--cream);\n    font-size: 14px;\n    line-height: 1.38;\n  }\n\n  .bw-paid-landing .hero-photo {\n    position: absolute;\n    z-index: 0;\n    top: 31px;\n    right: calc((100% - 100vw) / 2);\n    width: clamp(198px, 61.5vw, 250px);\n    height: clamp(360px, 105vw, 430px);\n    min-height: 0;\n    max-height: none;\n    border-radius: 0 0 0 8px;\n  }\n\n  .bw-paid-landing .hero-photo img {\n    min-height: 0;\n    height: 100%;\n    object-position: 37% 17%;\n  }\n\n  .bw-paid-landing .hero-photo figcaption {\n    display: none;\n  }\n\n  .bw-paid-landing .hero-photo::after {\n    position: absolute;\n    z-index: 1;\n    inset: 0;\n    background: linear-gradient(\n      90deg,\n      var(--cream) 0%,\n      var(--cream) 16%,\n      rgb(250 250 245 / 0.94) 23%,\n      rgb(250 250 245 / 0.52) 30%,\n      rgb(250 250 245 / 0) 37%\n    );\n    content: \"\";\n    pointer-events: none;\n  }\n\n  .bw-paid-landing .story {\n    display: grid;\n    grid-template-columns: minmax(0, 1.04fr) minmax(0, 0.96fr);\n    align-items: center;\n    gap: 12px;\n    padding-block: 32px 35px;\n  }\n\n  .bw-paid-landing .section-mark {\n    width: 35px;\n    height: 4px;\n    margin-bottom: 16px;\n  }\n\n  .bw-paid-landing .story h2,\n.bw-paid-landing .booking-heading h2,\n.bw-paid-landing .faq-heading h2 {\n    margin-top: 11px;\n    font-size: clamp(29px, 8.6vw, 36px);\n  }\n\n  .bw-paid-landing .story h2 {\n    font-size: clamp(28px, 7.2vw, 30px);\n  }\n\n  .bw-paid-landing .story-intro {\n    max-width: 100%;\n    margin-top: 10px;\n    font-size: 14px;\n    line-height: 1.42;\n  }\n\n  .bw-paid-landing .route-points {\n    gap: 11px;\n    margin-top: 15px;\n  }\n\n  .bw-paid-landing .route-point {\n    gap: 7px;\n  }\n\n  .bw-paid-landing .route-point > svg {\n    width: 19px;\n    height: 19px;\n    flex: 0 0 auto;\n  }\n\n  .bw-paid-landing .route-point span {\n    font-size: 13px;\n  }\n\n  .bw-paid-landing .route-point strong {\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .story-photo {\n    width: 100%;\n    border-radius: 8px;\n  }\n\n  .bw-paid-landing .story-photo img {\n    aspect-ratio: 0.8;\n    object-position: center;\n  }\n\n  .bw-paid-landing .story-photo figcaption {\n    justify-content: center;\n    padding: 7px 6px;\n    font-size: 10px;\n  }\n\n  .bw-paid-landing .story-photo figcaption span + span {\n    display: none;\n  }\n\n  .bw-paid-landing .booking {\n    padding-block: 45px 49px;\n  }\n\n  .bw-paid-landing .booking-heading {\n    margin-bottom: 21px;\n  }\n\n  .bw-paid-landing .booking-heading h2 {\n    margin-bottom: 22px;\n  }\n\n  .bw-paid-landing .step-progress {\n    gap: 7px;\n  }\n\n  .bw-paid-landing .step-progress__item {\n    gap: 6px;\n    font-size: 11px;\n  }\n\n  .bw-paid-landing .step-progress__number {\n    width: 26px;\n    height: 26px;\n    font-size: 11px;\n  }\n\n  .bw-paid-landing .booking-panel {\n    padding: 17px 15px 20px;\n    border-radius: 10px;\n  }\n\n  .bw-paid-landing .booking-grid {\n    display: flex;\n    flex-direction: column;\n    gap: 24px;\n  }\n\n  .bw-paid-landing .subheading-row {\n    gap: 9px;\n    margin-bottom: 16px;\n  }\n\n  .bw-paid-landing .subheading-row h3 {\n    font-size: 20px;\n  }\n\n  .bw-paid-landing .subheading-row p {\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .subheading-row > svg {\n    width: 23px;\n    height: 23px;\n  }\n\n  .bw-paid-landing .date-options {\n    gap: 7px;\n  }\n\n  .bw-paid-landing .date-option {\n    min-height: 77px;\n    padding: 8px 3px;\n    border-radius: 7px;\n  }\n\n  .bw-paid-landing .date-option > span:first-child {\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .date-option strong {\n    font-size: 15px;\n  }\n\n  .bw-paid-landing .date-option__selected {\n    font-size: 10px;\n  }\n\n  .bw-paid-landing .field-label {\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .time-options-block {\n    margin-top: 17px;\n  }\n\n  .bw-paid-landing .time-options {\n    gap: 8px;\n    margin-top: 8px;\n  }\n\n  .bw-paid-landing .time-option {\n    min-width: 91px;\n    min-height: 44px;\n    padding-inline: 11px;\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .selection-hint {\n    margin-top: 18px;\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .guest-picker-block {\n    padding: 18px 0 0;\n    border-top: 1px solid var(--line);\n    border-left: 0;\n  }\n\n  .bw-paid-landing .guest-stepper {\n    min-height: 54px;\n  }\n\n  .bw-paid-landing .guest-stepper button {\n    height: 52px;\n  }\n\n  .bw-paid-landing .guest-stepper output {\n    font-size: 20px;\n  }\n\n  .bw-paid-landing .guest-caption {\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .deposit-mini {\n    margin-top: 15px;\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .continue-button {\n    min-height: 51px;\n    margin-top: 21px;\n    padding-inline: 12px;\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .button-caption,\n.bw-paid-landing .booking-footnote {\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .booking-footnote {\n    padding-inline: 16px;\n  }\n\n  .bw-paid-landing .step-title-row {\n    align-items: flex-start;\n  }\n\n  .bw-paid-landing .text-button {\n    min-height: 44px;\n    padding-inline: 5px;\n    font-size: 13px;\n  }\n\n  .bw-paid-landing .selection-summary {\n    gap: 7px;\n    padding: 12px 10px;\n  }\n\n  .bw-paid-landing .selection-summary > div {\n    gap: 8px;\n  }\n\n  .bw-paid-landing .selection-summary > div > svg {\n    width: 19px;\n    height: 19px;\n  }\n\n  .bw-paid-landing .selection-summary > div > span {\n    font-size: 13px;\n  }\n\n  .bw-paid-landing .selection-summary small {\n    font-size: 12px;\n  }\n\n  .bw-paid-landing .summary-sample,\n.bw-paid-landing .preview-lock {\n    font-size: 8px;\n  }\n\n  .bw-paid-landing .details-form {\n    margin-top: 20px;\n  }\n\n  .bw-paid-landing .field-grid {\n    grid-template-columns: 1fr;\n    gap: 14px;\n  }\n\n  .bw-paid-landing .form-field {\n    gap: 5px;\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .form-field input,\n.bw-paid-landing .form-field select {\n    min-height: 48px;\n    font-size: 16px;\n  }\n\n  .bw-paid-landing .referral-field {\n    max-width: none;\n    margin-top: 15px;\n  }\n\n  .bw-paid-landing .deposit-rules {\n    grid-template-columns: 1fr;\n    gap: 14px;\n    margin-top: 17px;\n    padding: 13px;\n  }\n\n  .bw-paid-landing .deposit-rules > p strong {\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .deposit-rules > p span,\n.bw-paid-landing .checkbox-field {\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .checkbox-field {\n    min-height: 44px;\n    align-items: center;\n  }\n\n  .bw-paid-landing .form-actions {\n    gap: 9px;\n    margin-top: 18px;\n  }\n\n  .bw-paid-landing .form-actions .button {\n    min-height: 48px;\n    padding: 10px 12px;\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .preview-lock {\n    padding: 6px;\n    letter-spacing: 0.08em;\n  }\n\n  .bw-paid-landing .price-breakdown > div {\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .price-breakdown__total {\n    font-size: 13px !important;\n  }\n\n  .bw-paid-landing .price-breakdown__total dd {\n    font-size: 18px;\n  }\n\n  .bw-paid-landing .no-transaction {\n    padding: 12px;\n  }\n\n  .bw-paid-landing .no-transaction p {\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .customer-summary {\n    font-size: 11px;\n  }\n\n  .bw-paid-landing .customer-summary span,\n.bw-paid-landing .customer-summary small {\n    font-size: 13px;\n  }\n\n  .bw-paid-landing .payment-preview > .button {\n    min-height: 44px;\n    padding: 9px 12px;\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .faq-section {\n    display: block;\n    padding-block: 46px 52px;\n  }\n\n  .bw-paid-landing .faq-heading {\n    margin-bottom: 22px;\n  }\n\n  .bw-paid-landing .faq-heading h2 {\n    font-size: 37px;\n  }\n\n  .bw-paid-landing .faq-item summary {\n    min-height: 75px;\n    grid-template-columns: 32px minmax(0, 1fr) 14px;\n    gap: 9px;\n  }\n\n  .bw-paid-landing .faq-icon {\n    width: 29px;\n    height: 29px;\n  }\n\n  .bw-paid-landing .faq-icon svg {\n    width: 18px;\n    height: 18px;\n  }\n\n  .bw-paid-landing .faq-item summary strong {\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .faq-item summary small {\n    font-size: 13px;\n  }\n\n  .bw-paid-landing .faq-item > p {\n    margin: -1px 18px 16px 41px;\n    font-size: 14px;\n  }\n\n  .bw-paid-landing .site-footer {\n    min-height: 70px;\n    flex-direction: column;\n    align-items: flex-start;\n    justify-content: center;\n    gap: 4px;\n    padding: 14px 20px;\n    font-size: 10px;\n  }\n}\n\n@media (max-width: 370px) {\n  .bw-paid-landing .section-wrap,\n.bw-paid-landing .site-header {\n    width: calc(100% - 32px);\n  }\n\n  .bw-paid-landing .preview-notice {\n    font-size: 8px;\n  }\n\n  .bw-paid-landing .brand img {\n    width: 150px;\n  }\n\n  .bw-paid-landing .step-progress__item {\n    font-size: 9px;\n  }\n\n  .bw-paid-landing .step-progress__number {\n    width: 23px;\n    height: 23px;\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .bw-paid-landing *,\n.bw-paid-landing *::before,\n.bw-paid-landing *::after {\n    scroll-behavior: auto !important;\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.01ms !important;\n  }\n}\n";

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

    .bw-paid-landing .booking-panel {
      padding: clamp(18px, 3.6vw, 36px);
      border: 1px solid var(--line);
      border-radius: 14px;
      background: #fffefa;
      box-shadow: 0 12px 35px rgb(18 61 24 / 5%);
    }

    .bw-paid-landing .booking-status {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin: 0 0 16px;
      padding: 12px 15px;
      border: 1px solid #d9e1d8;
      border-radius: 8px;
      color: #334538;
      font-size: 13px;
      font-weight: 600;
      line-height: 1.45;
    }

    .bw-paid-landing .booking-status.is-loading {
      background: #f0f2e9;
    }

    .bw-paid-landing .booking-status.is-error,
    .bw-paid-landing .booking-status.is-retry,
    .bw-paid-landing .booking-status.is-contact {
      border-color: #e8c4b9;
      background: #fff4f0;
      color: #7e2a1a;
    }

    .bw-paid-landing .booking-status.is-info {
      background: #eff4ec;
    }

    .bw-paid-landing .booking-status button,
    .bw-paid-landing .booking-status a {
      flex: 0 0 auto;
      border: 0;
      background: transparent;
      color: inherit;
      font: inherit;
      font-weight: 800;
      text-decoration: underline;
      text-underline-offset: 2px;
      cursor: pointer;
    }

    .bw-paid-landing .booking-panel .bw-cal-shell {
      overflow: hidden;
      border: 1px solid var(--line);
      border-radius: 12px;
      background: var(--white);
      box-shadow: none;
    }

    .bw-paid-landing .booking-panel .bw-cal-head {
      gap: 12px;
      border-bottom: 1px solid var(--line);
      background: var(--white);
    }

    .bw-paid-landing .booking-panel .bw-cal-title {
      color: var(--green-deep);
    }

    .bw-paid-landing .booking-panel .bw-cal-note {
      background: #eff4ec;
      border-color: var(--yellow);
      color: #405346;
      font-size: 10px;
      text-transform: none;
    }

    .bw-paid-landing .booking-panel .bw-cal-body {
      gap: 18px;
      padding: 18px;
    }

    .bw-paid-landing .booking-panel .bw-cal-cta {
      min-height: 48px;
      height: auto;
      border-radius: 9px;
      background: var(--green);
      color: var(--white);
      font-size: 15px !important;
      font-weight: 800;
    }

    .bw-paid-landing .booking-panel .bw-cal-cta.is-disabled {
      background: #d8ddd6;
      color: #738074;
      opacity: 1;
    }

    .bw-paid-landing .booking-panel .bw-cal-cta.is-waiting {
      background: #eff4ec;
      color: var(--green-deep);
    }

    .bw-paid-landing .booking-panel .bw-cal-guest-row {
      padding-top: 12px;
      border-top: 1px solid var(--line);
    }

    .bw-paid-landing .date-picker-block > .subheading-row > img,
    .bw-paid-landing .selection-summary > div > img {
      width: 26px;
      height: 26px;
      flex: 0 0 auto;
    }

    .bw-paid-landing .selection-summary > div > img {
      width: 22px;
      height: 22px;
    }

    .bw-paid-landing .selection-summary > div > span {
      display: flex;
      min-width: 0;
      flex-direction: column;
    }

    .bw-paid-landing .selection-summary small {
      color: #617263;
      font-size: 12px;
      font-weight: 500;
    }

    .bw-paid-landing .details-form [data-bw-field-error] {
      color: #9d261c;
      font-size: 12px;
      font-weight: 700;
    }

    .bw-paid-landing .details-form [aria-invalid="true"] {
      border-color: #b3261e !important;
    }

    .bw-paid-landing .details-form [data-bw-paid-email-suggestion] {
      color: #465149;
      font-size: 12px;
      font-weight: 600;
    }

    .bw-paid-landing .details-form [data-bw-paid-email-suggestion] button {
      border: 0;
      background: none;
      color: var(--green);
      font: inherit;
      font-weight: 800;
      text-decoration: underline;
      cursor: pointer;
    }

    .bw-paid-landing .form-actions .button {
      min-width: 190px;
    }

    .bw-paid-landing .details-form .phone-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 12px;
    }

    .bw-paid-landing .payment-note {
      margin: 16px 0 0;
      color: #5d685e;
      font-size: 12px;
      line-height: 1.4;
      text-align: center;
    }

    .bw-paid-landing .step-progress__item.is-complete [data-step-number] {
      display: none;
    }

    .bw-paid-landing .step-progress__item.is-complete [data-step-check] {
      display: block;
      width: 14px;
      height: 14px;
      filter: brightness(0) invert(1);
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

    .bw-paid-landing .payment-handoff {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin: 20px 0;
      padding: 18px;
      border: 1px solid #d9e1d8;
      border-radius: 9px;
      background: #f0f2e9;
      color: #334538;
    }

    .bw-paid-landing .payment-handoff > img {
      width: 22px;
      height: 22px;
      flex: 0 0 auto;
    }

    .bw-paid-landing .payment-handoff p {
      display: grid;
      gap: 5px;
      margin: 0;
    }

    .bw-paid-landing .payment-handoff strong {
      color: var(--green-deep);
    }

    .bw-paid-landing .payment-handoff span {
      color: #526358;
      font-size: 14px;
    }

    @media (max-width: 680px) {
      .bw-paid-landing .booking-panel {
        padding: 14px;
      }

      .bw-paid-landing .booking-panel .bw-cal-body {
        gap: 12px;
        padding: 12px;
      }

      .bw-paid-landing .booking-panel .bw-cal-guest-row {
        grid-template-columns: minmax(0, 1fr) 120px;
      }

      .bw-paid-landing .booking-status {
        align-items: flex-start;
        flex-direction: column;
      }

      .bw-paid-landing .form-actions .button {
        min-width: 0;
        width: 100%;
      }
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
      aspect-ratio: 1200 / 670;
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

    .bw-paid-landing .route-overview__pin--start { left: 97%; top: 37%; }
    .bw-paid-landing .route-overview__pin--finish { left: 25%; top: 10%; }

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

  function ensureBookingCalendar() {
    if (customElements.get('bw-booking-calendar')) return Promise.resolve();
    if (window.__bwBookingCalendarLoading) return window.__bwBookingCalendarLoading;

    window.__bwBookingCalendarLoading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = CALENDAR_SCRIPT_URL;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });

    return window.__bwBookingCalendarLoading;
  }

  class BWPaidLandingElement extends HTMLElement {
    static get observedAttributes() {
      return ['sessions-json', 'state'];
    }

    constructor() {
      super();
      this._sessionMap = new Map();
      this._selectedBooking = null;
      this._checkoutState = { status: 'loading' };
      this._formStarted = false;
      this._formViewSent = false;
      this._currentStep = 1;
      this._checkoutTimer = null;
    }

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
      ensureBookingCalendar().then(() => {
        this._calendarLoaded = true;
        this._applySessions();
      }).catch((error) => {
        console.error('BerlinWalk paid landing calendar loader failed:', error);
        this._setBookingMessage('Live dates could not load just now. Try again, or message me and I will help you book.', 'error');
        this._calendarLoadFailed = true;
      });
      this._render();
      this._bind();
      this._applySessions();
      this._readCheckoutState();
      this._setupAutoHeight();
      this._hideGlobalStickyCtas();
      this._trackPageView();
      this.dispatchEvent(new CustomEvent('bw-paid-landing-ready', { bubbles: true, composed: true }));
    }

    attributeChangedCallback(name) {
      if (!this.isConnected) return;
      if (name === 'sessions-json') this._applySessions();
      if (name === 'state') this._readCheckoutState();
    }

    disconnectedCallback() {
      if (this._stickyObserver) this._stickyObserver.disconnect();
      if (this._heightObserver) this._heightObserver.disconnect();
      if (this._globalCtaObserver) this._globalCtaObserver.disconnect();
      if (this._scrollHandler) window.removeEventListener('scroll', this._scrollHandler);
      if (this._resizeHandler) window.removeEventListener('resize', this._resizeHandler);
      if (this._heightResizeHandler) window.removeEventListener('resize', this._heightResizeHandler);
      if (this._loadHandler) window.removeEventListener('load', this._loadHandler);
      if (this._checkoutTimer) window.clearTimeout(this._checkoutTimer);
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
      const routeMap = asset('route/assets/berlin-mitte-illustration-960w.webp');
      const icon = (name) => asset(`paid-landing/assets/icons/${name}.svg`);

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
            <p class="eyebrow hero-eyebrow">FREE WALKING TOUR <span aria-hidden="true">·</span> BERLIN</p>
            <h1 class="hero-title" id="hero-title">Walk Berlin<br>with me.</h1>
            <p class="hero-intro">I'm Yusuf. Join me for a two-hour walk from Alexanderplatz through Berlin's historic centre.</p>

            <figure class="hero-photo">
              <img src="${heroImage}" alt="Yusuf raising his arm in front of Berlin's Rotes Rathaus">
              <figcaption>I'm Yusuf. I’ll show you the city I call home.</figcaption>
            </figure>

            <ul class="feature-list" aria-label="Tour details">
              <li class="feature">
                <img src="${icon('star')}" alt="">
                <span><strong>9.8 / 10</strong><small>on FreeTour</small></span>
              </li>
              <li class="feature">
                <img src="${icon('clock')}" alt="">
                <span><strong>About 2 hours</strong></span>
              </li>
              <li class="feature">
                <img src="${icon('chat-circle')}" alt="">
                <span><strong>English</strong></span>
              </li>
              <li class="feature">
                <img src="${icon('coins')}" alt="">
                <span><strong>Tip-based</strong></span>
              </li>
            </ul>

            <div class="hero-actions">
              <button class="button button--yellow hero-cta" type="button" data-scroll-target="booking" data-track-pick-date>
                See dates <img src="${icon('arrow-right')}" alt="">
              </button>
              <p class="deposit-note">€2 deposit per guest, refunded after the walk or if you cancel at least 24 hours ahead.<br>Tip is separate.</p>
            </div>
          </section>

          <section class="route-overview section-wrap" aria-labelledby="route-overview-title">
            <figure class="route-overview__visual">
              <div class="route-overview__map">
                <img src="${routeMap}" srcset="${asset('route/assets/berlin-mitte-illustration-720w.webp')} 720w, ${routeMap} 960w, ${asset('route/assets/berlin-mitte-illustration-1200w.webp')} 1200w" sizes="(max-width: 680px) calc(100vw - 40px), 720px" width="1200" height="670" loading="lazy" decoding="async" alt="Illustrated Berlin Mitte map with the walking route from the World Clock at Alexanderplatz to Hackescher Markt">
                <svg class="route-overview__path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  <path class="route-overview__halo" d="${ROUTE_OVERVIEW_PATH}"></path>
                  <path class="route-overview__line" d="${ROUTE_OVERVIEW_PATH}"></path>
                </svg>
                <span class="route-overview__pin route-overview__pin--start" aria-hidden="true"></span>
                <span class="route-overview__pin route-overview__pin--finish" aria-hidden="true"></span>
              </div>
              <figcaption><span><strong>Start</strong> World Clock, Alexanderplatz</span><span><strong>Finish</strong> Hackescher Markt</span></figcaption>
            </figure>
            <div class="route-overview__copy">
              <span class="section-mark" aria-hidden="true"></span>
              <p class="eyebrow">YOUR WALK AT A GLANCE</p>
              <h2 id="route-overview-title">Across Berlin's historic centre.</h2>
              <p>Meet me at the World Clock. From Alexanderplatz, we pass Rotes Rathaus and Museum Island before finishing at Hackescher Markt.</p>
              <a class="route-overview__link" href="/berlin-walking-tour-route">Explore the full route and its 12 stops <span aria-hidden="true">→</span></a>
            </div>
          </section>

          <section class="story section-wrap" id="story" aria-labelledby="story-title">
            <div class="story-copy">
              <span class="section-mark" aria-hidden="true"></span>
              <p class="eyebrow">A WALK THROUGH THE HISTORIC CENTRE</p>
              <h2 id="story-title">Berlin's stories.<br>On the streets.</h2>
              <p class="story-intro">At Rotes Rathaus and Museum Island, I connect the buildings you see with the people and decisions behind them. Historic photos help when a place has changed.</p>
            </div>
            <figure class="story-photo">
              <img src="${storyImage}" alt="The historic colonnade and entrance of the Alte Nationalgalerie on Museum Island">
              <figcaption><span>Museum Island</span><span>Berlin, Germany</span></figcaption>
            </figure>
          </section>

          <section class="booking section-wrap" id="booking" aria-labelledby="booking-title">
            <div class="booking-heading">
              <span class="section-mark" aria-hidden="true"></span>
              <p class="eyebrow">ONE DATE. THEN YOUR DETAILS.</p>
              <h2 id="booking-title">Choose your walk</h2>
              <ol class="step-progress" aria-label="Booking steps">
                <li class="step-progress__item is-current" data-step-progress="1" aria-current="step">
                  <span class="step-progress__number"><span data-step-number>1</span><img data-step-check src="${icon('check')}" alt="" hidden></span>
                  <span class="step-progress__label">Date &amp; guests</span>
                </li>
                <li class="step-progress__item" data-step-progress="2">
                  <span class="step-progress__number"><span data-step-number>2</span><img data-step-check src="${icon('check')}" alt="" hidden></span>
                  <span class="step-progress__label">Your details</span>
                </li>
                <li class="step-progress__item" data-step-progress="3">
                  <span class="step-progress__number"><span data-step-number>3</span><img data-step-check src="${icon('check')}" alt="" hidden></span>
                  <span class="step-progress__label">Payment</span>
                </li>
              </ol>
            </div>

            <p class="booking-status" data-bw-paid-booking-status role="status" aria-live="polite" hidden></p>
            <div class="booking-panel">
              <div class="booking-step" data-bw-paid-date-step>
                <div class="date-picker-block">
                  <div class="subheading-row">
                    <div>
                      <h3 id="date-step-title" tabindex="-1">Select a live date</h3>
                      <p>Current availability · Berlin local time</p>
                    </div>
                    <img src="${icon('calendar')}" alt="">
                  </div>
                  <bw-booking-calendar
                    navigation-mode="event"
                    handoff="checkout-a"
                    hide-intro
                    no-preselect
                    loading
                    availability-endpoint="none"
                    availability-days="${this.getAttribute('availability-days') || LANDING_AVAILABILITY_DAYS}"
                    default-guests="2"
                    max-guests="8"
                    service-title="Choose your walk"
                    cta-label="Continue to your details">
                  </bw-booking-calendar>
                </div>
              </div>

              <div class="booking-step" data-bw-paid-details-step hidden>
                <div class="subheading-row step-title-row">
                  <div>
                    <h3 id="details-step-title" tabindex="-1">Your details</h3>
                    <p>Review your live selection, then add your contact details.</p>
                  </div>
                  <button class="text-button" type="button" data-bw-paid-back>Change <img src="${icon('arrow-right')}" alt=""></button>
                </div>

                <div class="selection-summary" aria-label="Live selection summary">
                  <div><img src="${icon('calendar')}" alt=""><span><strong data-bw-paid-booking-summary></strong><small>Berlin local time · refundable €2 deposit per guest</small></span></div>
                  <span class="summary-sample">LIVE</span>
                </div>

                <form class="details-form" data-bw-paid-details-form novalidate>
                  <div class="field-grid">
                    <label class="form-field">
                      <span>First name</span>
                      <input name="firstName" autocomplete="given-name" maxlength="60" required>
                      <span data-bw-field-error="firstName" aria-live="polite"></span>
                    </label>
                    <label class="form-field">
                      <span>Last name</span>
                      <input name="lastName" autocomplete="family-name" maxlength="60" required>
                      <span data-bw-field-error="lastName" aria-live="polite"></span>
                    </label>
                    <label class="form-field">
                      <span>Email</span>
                      <input name="email" type="email" inputmode="email" autocomplete="email" maxlength="254" required>
                      <small>Your confirmation and change or cancellation link go here.</small>
                      <span class="email-suggestion" data-bw-paid-email-suggestion role="status"></span>
                      <span data-bw-field-error="email" aria-live="polite"></span>
                    </label>
                    <label class="form-field">
                      <span>Mobile</span>
                      <span class="phone-row">
                        <select name="country" aria-label="Country and calling code">
                          <option value="DE" data-dial="+49" selected>Germany +49</option>
                          <option value="GB" data-dial="+44">United Kingdom +44</option>
                          <option value="US" data-dial="+1">United States +1</option>
                          <option value="CA" data-dial="+1">Canada +1</option>
                          <option value="IE" data-dial="+353">Ireland +353</option>
                          <option value="NL" data-dial="+31">Netherlands +31</option>
                          <option value="FR" data-dial="+33">France +33</option>
                          <option value="ES" data-dial="+34">Spain +34</option>
                          <option value="IT" data-dial="+39">Italy +39</option>
                          <option value="CH" data-dial="+41">Switzerland +41</option>
                          <option value="AT" data-dial="+43">Austria +43</option>
                          <option value="AU" data-dial="+61">Australia +61</option>
                          <option value="NZ" data-dial="+64">New Zealand +64</option>
                          <option value="TR" data-dial="+90">Türkiye +90</option>
                          <option value="IN" data-dial="+91">India +91</option>
                        </select>
                        <input name="phone" type="tel" aria-label="Mobile number" inputmode="tel" autocomplete="tel-national" maxlength="24" required>
                      </span>
                      <small>Only used on tour day if you are late or cannot find the group.</small>
                      <span data-bw-field-error="phone" aria-live="polite"></span>
                    </label>
                  </div>

                  <label class="form-field referral-field">
                    <span>How did you find me? <em>Optional</em></span>
                    <select name="source">
                      <option value="">Choose one (optional)</option>
                      <option value="Google search">Google or another search engine</option>
                      <option value="Instagram or Facebook">Instagram or Facebook</option>
                      <option value="Friend or family">A friend or family member</option>
                      <option value="Hotel or hostel">My hotel, hostel or host</option>
                      <option value="GetYourGuide or TripAdvisor">GetYourGuide, TripAdvisor or similar</option>
                      <option value="Newsletter">My newsletter or email</option>
                      <option value="Other">Something else</option>
                    </select>
                  </label>

                  <div class="deposit-rules">
                    <p><strong>About the €2 deposit</strong><span>The €2 deposit is refunded after the walk. It is also refundable if you cancel at least 24 hours before the walk. Tips are separate and optional.</span></p>
                    <label class="checkbox-field">
                      <input name="consent" type="checkbox" required>
                      <span>I understand: the €2 deposit is refunded after the walk, or if I cancel at least 24 hours before the walk.</span>
                    </label>
                    <span data-bw-field-error="consent" aria-live="polite"></span>
                  </div>

                  <div class="form-actions">
                    <button class="button button--quiet" type="button" data-bw-paid-back><img src="${icon('arrow-right')}" alt="" class="back-arrow"> Back</button>
                    <button class="button button--green" type="submit" data-bw-paid-submit><span data-bw-paid-submit-label>Continue to payment</span><img src="${icon('arrow-right')}" alt=""></button>
                  </div>
                  <p class="payment-note">You pay the refundable deposit on the secure Wix Pay screen. Any tip is separate.</p>
                </form>
              </div>

              <div class="booking-step payment-preview" data-bw-paid-payment-step hidden>
                <div class="subheading-row step-title-row">
                  <div>
                    <h3 id="payment-step-title" tabindex="-1">Secure payment</h3>
                    <p>Wix Pay is opening in a secure card window.</p>
                  </div>
                  <span class="preview-lock">SECURE CHECKOUT</span>
                </div>
                <div class="selection-summary payment-selection">
                  <div><img src="${icon('calendar')}" alt=""><span><strong data-bw-paid-payment-summary></strong><small><span data-bw-paid-payment-guests>2 guests</span> · About 2 hours</small></span></div>
                </div>
                <dl class="price-breakdown">
                  <div><dt>Refundable deposit · €2 × <span data-bw-paid-total-guests>2</span></dt><dd>€<span data-bw-paid-total>4</span>.00</dd></div>
                  <div><dt>Tip for the walk</dt><dd>Separate</dd></div>
                  <div class="price-breakdown__total"><dt>Amount due now</dt><dd>€<span data-bw-paid-total-copy>4</span>.00</dd></div>
                </dl>
                <div class="payment-handoff" role="status">
                  <img src="${icon('question')}" alt="">
                  <p><strong>Complete the secure Wix Pay window.</strong><span>If the window closes, the same payment can be reopened. If any booking detail needs to change, contact me before submitting again.</span></p>
                </div>
              </div>
            </div>
            <p class="booking-footnote">A €2 refundable deposit per guest holds your place. Any tip is separate and optional.</p>
          </section>

          <section class="faq-section section-wrap" id="faq" aria-labelledby="faq-title">
            <div class="faq-heading">
              <span class="section-mark" aria-hidden="true"></span>
              <p class="eyebrow">A FEW USEFUL DETAILS</p>
              <h2 id="faq-title">Before your walk</h2>
            </div>
            <div class="faq-list">
              <details class="faq-item">
                <summary><span class="faq-icon"><img src="${icon('question')}" alt=""></span><span><strong>How does the deposit work?</strong><small>Refunded after the walk or with 24 hours' notice. Tips are separate.</small></span><img class="faq-chevron" src="${icon('chevron-down')}" alt=""></summary>
                <p>The €2 deposit is refunded after the walk. It is also refundable if you cancel at least 24 hours before the walk. Any tip is optional and separate from the deposit.</p>
              </details>
              <details class="faq-item">
                <summary><span class="faq-icon"><img src="${icon('map-pin')}" alt=""></span><span><strong>Where do I meet you?</strong><small>At the World Clock on Alexanderplatz.</small></span><img class="faq-chevron" src="${icon('chevron-down')}" alt=""></summary>
                <p>Look for the World Clock on Alexanderplatz. The walk ends near Hackescher Markt.</p>
              </details>
              <details class="faq-item">
                <summary><span class="faq-icon"><img src="${icon('clock')}" alt=""></span><span><strong>How long is the walk?</strong><small>About two hours, in English.</small></span><img class="faq-chevron" src="${icon('chevron-down')}" alt=""></summary>
                <p>I guide the walk in English through Berlin's historic centre, from Alexanderplatz to Hackescher Markt.</p>
              </details>
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

      const calendar = this.querySelector('bw-booking-calendar');
      if (calendar) {
        calendar.addEventListener('bw-booking-calendar-change', (event) => {
          const detail = event.detail || {};
          if (detail.action === 'guests') {
            if (this._selectedBooking) this._setBookingMessage('', '');
            return;
          }
          const eventName = detail.action === 'slot' ? 'bw_booking_slot_select' : 'bw_booking_pick_date_click';
          this._track(eventName, {
            source: 'booking_calendar',
            action: detail.action,
            date: detail.date,
            time: detail.time,
          });
        });
        calendar.addEventListener('bw-booking-calendar-continue', (event) => {
          const detail = event.detail || {};
          this._track('bw_booking_next_click', {
            source: 'booking_calendar',
            date: detail.date,
            time: detail.time,
            guests: detail.guests,
          });
          event.preventDefault();
          this._beginDetails(detail);
        });
        calendar.addEventListener('bw-booking-calendar-availability', (event) => {
          this._renderSchedule(event.detail || {});
        });
      }

      const form = this.querySelector('[data-bw-paid-details-form]');
      if (form) {
        form.addEventListener('submit', (event) => this._submitDetails(event));
        form.addEventListener('focusin', (event) => {
          const target = event.target;
          if (!target || !target.matches || !target.matches('input, select')) return;
          if (this._formStarted) return;
          this._formStarted = true;
          const fieldType = target.getAttribute('type') || target.tagName.toLowerCase();
          this._dispatchFunnel('bw_booking_form_start', { field_type: fieldType });
        });
        form.addEventListener('input', (event) => {
          const name = event.target && event.target.name;
          if (name) this._clearFieldError(name);
        });
        form.addEventListener('change', (event) => {
          const name = event.target && event.target.name;
          if (name) this._clearFieldError(name);
        });
        form.addEventListener('click', (event) => {
          if (!event.target || !event.target.matches('[data-bw-paid-use-email]')) return;
          const suggestion = event.target.getAttribute('data-bw-paid-use-email');
          const email = form.elements.email;
          if (email) email.value = suggestion;
          this._clearFieldError('email');
          const box = this.querySelector('[data-bw-paid-email-suggestion]');
          if (box) box.replaceChildren();
        });
      }

      const backs = this.querySelectorAll('[data-bw-paid-back]');
      backs.forEach((back) => back.addEventListener('click', () => {
        this._selectedBooking = null;
        this._setStep(1);
        this._setBookingMessage('', '');
        const target = this.querySelector('#booking');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }));

      const status = this.querySelector('[data-bw-paid-booking-status]');
      if (status) status.addEventListener('click', (event) => {
        if (event.target && event.target.matches('[data-bw-paid-retry]')) {
          event.preventDefault();
          this._dispatchLandingEvent('bw-paid-landing-retry');
        }
      });
    }

    _dispatchLandingEvent(name, detail = {}) {
      this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true, detail }));
    }

    _dispatchFunnel(name, payload = {}) {
      try {
        document.dispatchEvent(new CustomEvent('bwBookingFunnelEvent', { detail: { name, payload } }));
      } catch {}
    }

    _applySessions() {
      const calendar = this.querySelector('bw-booking-calendar');
      if (!calendar) return;
      const raw = this.getAttribute('sessions-json');
      if (!raw) return;

      let sessions = [];
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) sessions = parsed;
      } catch {}

      this._sessionMap.clear();
      const slots = [];
      sessions.forEach((session) => {
        if (!session || !session.eventId || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(String(session.start || ''))) return;
        const eventId = String(session.eventId);
        const placesLeft = session.placesLeft == null || session.placesLeft === ''
          ? null
          : Number(session.placesLeft);
        const canonical = {
          eventId,
          sessionId: eventId,
          start: String(session.start),
          placesLeft: Number.isFinite(placesLeft) ? Math.max(0, placesLeft) : null,
        };
        this._sessionMap.set(eventId, canonical);
        if (canonical.placesLeft === 0) return;
        slots.push({
          id: eventId,
          eventId,
          sessionId: eventId,
          startDate: canonical.start,
          timezone: 'Europe/Berlin',
          openSpots: canonical.placesLeft,
        });
      });

      calendar.setAttribute('availability-json', JSON.stringify(slots));
      calendar.removeAttribute('loading');
      calendar.removeAttribute('error-message');
      if (!slots.length && this._checkoutState.status !== 'loading') {
        this._setBookingMessage('There are no bookable dates right now. Try again later or message me and I will help.', 'empty');
      }
      this._renderScheduleFromSessions(slots);
    }

    _renderScheduleFromSessions(slots) {
      const target = this.querySelector('[data-bw-paid-schedule]');
      const first = Array.isArray(slots) ? slots[0] : null;
      if (!target) return;
      if (!first) {
        target.textContent = 'No dates available right now';
        return;
      }
      const label = new Intl.DateTimeFormat('en-GB', {
        weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC',
      }).format(new Date(`${String(first.startDate).slice(0, 10)}T12:00:00Z`));
      target.textContent = `Next walk: ${label}, ${String(first.startDate).slice(11, 16)}`;
    }

    _readCheckoutState() {
      let state = null;
      try { state = JSON.parse(this.getAttribute('state') || 'null'); } catch {}
      if (!state || typeof state !== 'object') return;
      this._checkoutState = state;
      const calendar = this.querySelector('bw-booking-calendar');
      const submit = this.querySelector('[data-bw-paid-submit]');
      if (state.status === 'loading') {
        this._setBookingMessage('Checking live dates…', 'loading');
        if (calendar) calendar.setAttribute('loading', '');
        return;
      }
      if (state.status === 'availability-error') {
        if (calendar) calendar.removeAttribute('loading');
        this._setBookingMessage('I could not load live dates just now. Please try again.', 'retry');
        return;
      }
      if (state.status === 'sold-out') {
        if (calendar) calendar.removeAttribute('loading');
        this._setBookingMessage('There are no bookable dates right now. Try again later or message me and I will help.', 'retry');
        return;
      }
      if (state.status === 'preview-only') {
        if (calendar) calendar.removeAttribute('loading');
        this._setBookingMessage('This public preview is not connected to live dates or payments. Use the BerlinWalk booking page to reserve.', 'info');
        return;
      }
      if (state.status === 'ready') {
        if (calendar) calendar.removeAttribute('loading');
        this._setBookingMessage('', '');
        return;
      }
      if (state.status === 'submitting') {
        if (submit) submit.disabled = true;
        this._setSubmitLabel('Checking your place…');
        this._setBookingMessage('Checking your selected date and details…', 'loading');
        return;
      }
      if (state.status === 'redirecting') {
        if (submit) submit.disabled = true;
        this._setSubmitLabel('Opening secure payment…');
        this._setStep(3);
        this._setBookingMessage('Opening the secure card screen…', 'loading');
        this._track('bw_checkout_redirect', {});
        if (!this._formViewSent && this._selectedBooking) {
          this._formViewSent = true;
          this._dispatchFunnel('bw_booking_form_view', { guests: this._selectedBooking.guests });
        }
        return;
      }
      if (state.status === 'error') {
        if (submit) submit.disabled = false;
        this._setSubmitLabel('Try secure payment again');
        if (this._checkoutTimer) window.clearTimeout(this._checkoutTimer);
        this._checkoutTimer = null;
        this._track('bw_checkout_error', { stage: state.stage || 'unknown', code: state.code || '' });
        if (state.stage === 'availability') {
          this._selectedBooking = null;
          this._setStep(1);
          this._setBookingMessage(state.code === 'NOT_ENOUGH_PLACES'
            ? 'There are not enough places left for your group at that time. Please choose another walk.'
            : 'That walk is no longer available. Refresh the dates and choose another time.', 'retry');
        } else if (state.stage === 'payment') {
          this._setStep(2);
          const hasPaymentAttempt = state.paymentAttempt === true;
          this._setSubmitLabel(hasPaymentAttempt ? 'Retry the same payment' : 'Try secure payment again');
          this._setBookingMessage(hasPaymentAttempt
            ? `The ${state.code === 'FAILED' ? 'payment did not go through' : 'card window closed before payment finished'}, but your existing booking and payment order are ready. Retry to reopen the same Wix Pay screen. If any booking detail needs to change, message me first.`
            : state.code === 'FAILED'
              ? 'The payment did not go through. Please check the card details and try again.'
              : 'The card window closed before payment finished. You can try again when ready.', hasPaymentAttempt ? 'contact' : 'error');
        } else if (state.stage === 'validation') {
          this._setStep(2);
          this._setBookingMessage('Please check your details and try again.', 'error');
          if (state.emailSuggestion) this._showEmailSuggestion(state.emailSuggestion);
        } else if (state.stage === 'manual-help') {
          this._setStep(2);
          if (submit) submit.disabled = true;
          this._setSubmitLabel('Please message me to check');
          this._setBookingMessage(state.code === 'PAYMENT_ATTEMPT_INPUT_CHANGED'
            ? 'Your date or details changed after Wix created the booking. Please do not submit again; message me so I can check the existing order first.'
            : 'I could not confirm whether a place was held. Please do not submit again; message me and I will check.', 'contact');
        } else {
          this._setStep(2);
          this._setBookingMessage(state.stage === 'qa-blocked'
            ? 'Local QA blocked the booking request. No Wix booking or payment request was sent.'
            : 'Something went wrong before payment opened. Please try again in a moment.', 'error');
        }
      }
    }

    _setBookingMessage(message, mode) {
      const status = this.querySelector('[data-bw-paid-booking-status]');
      if (!status) return;
      status.replaceChildren();
      if (!message) { status.hidden = true; return; }
      status.hidden = false;
      status.className = `booking-status is-${mode || 'info'}`;
      const text = document.createElement('span');
      text.textContent = message;
      status.appendChild(text);
      if (mode === 'retry' || mode === 'empty') {
        const button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('data-bw-paid-retry', 'true');
        button.textContent = 'Refresh dates';
        status.appendChild(button);
      }
      if (mode === 'contact') {
        const link = document.createElement('a');
        link.href = '/contact';
        link.textContent = 'Message me';
        status.appendChild(link);
      }
    }

    _setStep(step) {
      this._currentStep = step;
      const dateStep = this.querySelector('[data-bw-paid-date-step]');
      const detailsStep = this.querySelector('[data-bw-paid-details-step]');
      const paymentStep = this.querySelector('[data-bw-paid-payment-step]');
      if (dateStep) dateStep.hidden = step !== 1;
      if (detailsStep) detailsStep.hidden = step !== 2;
      if (paymentStep) paymentStep.hidden = step !== 3;
      const progress = this.querySelectorAll('.step-progress');
      progress.forEach((list) => {
        list.querySelectorAll('li').forEach((item, index) => {
          const number = index + 1;
          const current = number === step;
          const complete = number < step;
          item.classList.toggle('is-current', current);
          item.classList.toggle('is-complete', complete);
          const numberText = item.querySelector('[data-step-number]');
          const check = item.querySelector('[data-step-check]');
          if (numberText) numberText.hidden = complete;
          if (check) check.hidden = !complete;
          if (number === step) item.setAttribute('aria-current', 'step');
          else item.removeAttribute('aria-current');
        });
      });
      const submit = this.querySelector('[data-bw-paid-submit]');
      if (submit && step < 3) {
        submit.disabled = false;
        this._setSubmitLabel('Continue to payment');
      }
      this._syncAutoHeight();
    }

    _setSubmitLabel(label) {
      const submit = this.querySelector('[data-bw-paid-submit]');
      if (!submit) return;
      const text = submit.querySelector('[data-bw-paid-submit-label]');
      if (text) text.textContent = label;
      else submit.textContent = label;
    }

    _beginDetails(detail) {
      const slot = detail.slot || {};
      const eventId = String(slot.eventId || slot.sessionId || slot.id || '');
      const session = this._sessionMap.get(eventId);
      if (!session) {
        this._setBookingMessage('That date is no longer in the live list. Refresh dates and choose again.', 'retry');
        return;
      }
      const selectedStart = String(detail.start || slot.startDate || slot.start || '').slice(0, 16);
      if (selectedStart && selectedStart !== session.start.slice(0, 16)) {
        this._setBookingMessage('That date changed while the calendar was open. Refresh dates and choose again.', 'retry');
        return;
      }
      const guests = Number(detail.guests || 2);
      if (!Number.isInteger(guests) || guests < 1 || guests > 8) {
        this._setBookingMessage('Please choose between 1 and 8 guests.', 'error');
        return;
      }
      if (Number.isFinite(session.placesLeft) && session.placesLeft < guests) {
        this._setBookingMessage(session.placesLeft === 0
          ? 'That walk has just sold out. Refresh dates and choose another time.'
          : `Only ${session.placesLeft} ${session.placesLeft === 1 ? 'place is' : 'places are'} left at that time. Reduce the group size or choose another walk.`, 'retry');
        return;
      }

      this._selectedBooking = {
        sessionId: session.eventId,
        start: session.start,
        placesLeft: session.placesLeft,
        date: detail.date || session.start.slice(0, 10),
        time: detail.time || session.start.slice(11, 16),
        guests,
      };
      const summary = this.querySelector('[data-bw-paid-booking-summary]');
      const dateLabel = new Intl.DateTimeFormat('en-GB', {
        weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC',
      }).format(new Date(`${session.start.slice(0, 10)}T12:00:00Z`));
      if (summary) summary.textContent = `${dateLabel} at ${session.start.slice(11, 16)} · ${guests} ${guests === 1 ? 'guest' : 'guests'} · €${guests * 2} refundable deposit`;
      const paymentSummary = this.querySelector('[data-bw-paid-payment-summary]');
      if (paymentSummary) paymentSummary.textContent = `${dateLabel} · ${session.start.slice(11, 16)}`;
      const paymentGuests = this.querySelector('[data-bw-paid-payment-guests]');
      if (paymentGuests) paymentGuests.textContent = `${guests} ${guests === 1 ? 'guest' : 'guests'}`;
      ['[data-bw-paid-total-guests]', '[data-bw-paid-total]', '[data-bw-paid-total-copy]'].forEach((selector) => {
        const target = this.querySelector(selector);
        if (target) target.textContent = String(selector.includes('guests') ? guests : guests * 2);
      });
      this._setBookingMessage('', '');
      this._setStep(2);
      const first = this.querySelector('[data-bw-paid-details-form] input[name="firstName"]');
      if (first) window.setTimeout(() => first.focus({ preventScroll: true }), 120);
    }

    _clearFieldError(name) {
      const error = this.querySelector(`[data-bw-field-error="${name}"]`);
      const field = this.querySelector(`[data-bw-paid-details-form] [name="${name}"]`);
      if (error) error.textContent = '';
      if (field) field.removeAttribute('aria-invalid');
    }

    _submitDetails(event) {
      event.preventDefault();
      if (!this._selectedBooking) {
        this._setStep(1);
        this._setBookingMessage('Please pick a live date and time first.', 'error');
        return;
      }
      const form = event.currentTarget;
      const data = new FormData(form);
      const input = Object.fromEntries(data.entries());
      input.firstName = String(input.firstName || '').trim();
      input.lastName = String(input.lastName || '').trim();
      input.email = String(input.email || '').trim();
      input.phone = String(input.phone || '').trim();
      input.source = String(input.source || '').trim() || null;
      input.consent = data.get('consent') === 'on';
      input.country = String(input.country || 'DE');
      const countrySelect = form.elements.country;
      input.dialCode = countrySelect && countrySelect.selectedOptions[0]
        ? countrySelect.selectedOptions[0].getAttribute('data-dial') || '+49'
        : '+49';
      input.sessionId = this._selectedBooking.sessionId;
      input.start = this._selectedBooking.start;
      input.guests = this._selectedBooking.guests;
      const errors = {};
      if (!input.firstName || input.firstName.length > 60) errors.firstName = 'Add your first name.';
      if (!input.lastName || input.lastName.length > 60) errors.lastName = 'Add your last name.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.email) || input.email.length > 254) errors.email = 'Check your email address.';
      const phoneDigits = input.phone.replace(/\D/g, '');
      if (phoneDigits.length < 8 || phoneDigits.length > 15) errors.phone = 'Add a valid mobile number.';
      if (!input.consent) errors.consent = 'Please confirm you have read the deposit rules.';

      Object.entries(errors).forEach(([name, message]) => {
        const error = this.querySelector(`[data-bw-field-error="${name}"]`);
        const field = form.querySelector(`[name="${name}"]`);
        if (error) error.textContent = message;
        if (field) field.setAttribute('aria-invalid', 'true');
      });
      if (Object.keys(errors).length) {
        this._setBookingMessage('Please check the fields marked below.', 'error');
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        this._track('bw_checkout_invalid', { fields: Object.keys(errors).join(',') });
        return;
      }

      this._setBookingMessage('', '');
      const submit = this.querySelector('[data-bw-paid-submit]');
      if (submit) submit.disabled = true;
      this._setSubmitLabel('Checking your place…');
      this._track('bw_checkout_submit', { guests: input.guests, session_start: input.start });
      this._dispatchFunnel('bw_booking_submit_click', { label: 'Continue to payment', guests: input.guests });
      this._checkoutTimer = window.setTimeout(() => {
        this._checkoutTimer = null;
        if (submit) submit.disabled = true;
        this._setSubmitLabel('Still checking your place…');
        this._setBookingMessage('This is taking longer than expected. Keep this page open and do not submit again. If it does not continue, message me and I will check.', 'contact');
        this._track('bw_checkout_error', { stage: 'timeout' });
      }, 30000);
      this._dispatchLandingEvent('bw-paid-landing-submit', { input });
    }

    _showEmailSuggestion(value) {
      const box = this.querySelector('[data-bw-paid-email-suggestion]');
      const email = String(value || '').trim();
      if (!box || !email || email.length > 254) return;
      box.replaceChildren();
      const text = document.createElement('span');
      text.textContent = `Did you mean ${email}? `;
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('data-bw-paid-use-email', email);
      button.textContent = 'Use this';
      box.append(text, button);
    }

    _renderSchedule(detail) {
      const target = this.querySelector('[data-bw-paid-schedule]');
      const first = detail && detail.first;
      if (!target || !first || !first.label || !first.time) return;
      target.textContent = `Next walk: ${first.label}, ${first.time}`;
    }

    _goTo(href) {
      try {
        window.top.location.href = href;
        return;
      } catch {}
      window.location.href = href;
    }

    _setupStickyCta(calendar) {
      const sticky = this.querySelector('.bw-paid-sticky-cta');
      let calendarVisible = true;

      const update = () => {
        if (!sticky) return;
        const shouldShow = !calendarVisible && window.scrollY > 260 && window.innerWidth <= 620;
        sticky.classList.toggle('is-visible', shouldShow);
      };

      this._scrollHandler = update;
      this._resizeHandler = update;

      if (sticky && calendar && 'IntersectionObserver' in window) {
        this._stickyObserver = new IntersectionObserver((entries) => {
          calendarVisible = entries.some((entry) => entry.isIntersecting);
          update();
        }, { threshold: 0.05 });
        this._stickyObserver.observe(calendar);
      }

      window.addEventListener('scroll', this._scrollHandler, { passive: true });
      window.addEventListener('resize', this._resizeHandler);
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

      if (allowAnalytics && /(^|\.)berlinwalk\.com$/i.test(window.location.hostname)) {
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
      BWPaidLandingElement,
    };
  }

  if (!customElements.get('bw-paid-landing')) {
    customElements.define('bw-paid-landing', BWPaidLandingElement);
  }
}());
