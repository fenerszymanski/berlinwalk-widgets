const BW_HOME_PRODUCTS_ASSET_BASE = (() => {
  const script = document.currentScript
    || [...document.scripts].find((item) => item.src.includes('/home-products/home-products-element.js'));

  return script?.src
    ? new URL('./assets/', script.src).href
    : 'https://fenerszymanski.github.io/berlinwalk-widgets/home-products/assets/';
})();

const BW_HOME_PRODUCTS_PRIMARY = {
  label: 'Plan',
  title: 'Berlin Trip Planner',
  text: 'Build realistic Berlin days around your dates, hotel area, pace and interests.',
  meta: 'Personalised route · Practical timing',
  cta: 'Build my Berlin plan',
  href: 'https://www.berlinwalk.com/berlin-trip-planner',
  image: 'trip-planner-hero.jpg',
  alt: 'Illustrated Berlin river view with Berlin Cathedral and the TV Tower',
};

const BW_HOME_PRODUCTS_SECONDARY = [
  {
    label: 'Listen',
    title: 'Audio Tours',
    text: 'Five self-guided Berlin walks. Listen at your own pace.',
    meta: 'From €4.99',
    cta: 'Explore audio tours',
    href: 'https://www.berlinwalk.com/audio-tours',
    image: 'audio-tours.jpg',
    alt: 'Path through Mauerpark with the Berlin TV Tower in the distance',
  },
  {
    label: 'Arrive',
    title: 'First-Day Rescue Plan',
    text: 'A practical arrival plan for your first hours in Berlin.',
    cta: 'Get the rescue plan',
    href: 'https://www.berlinwalk.com/products/berlin-first-day-rescue-plan',
    image: 'first-day-rescue.jpg',
    alt: 'Main hall of Berlin Hauptbahnhof with platforms and wayfinding signs',
  },
  {
    label: 'Play',
    title: 'Photo Missions',
    text: 'Small photo challenges that get you looking closer at Berlin.',
    cta: 'Start a mission',
    href: 'https://www.berlinwalk.com/products/hidden-berlin-photo-missions',
    image: 'photo-missions.jpg',
    alt: 'The surviving entrance hall of Anhalter Bahnhof, the first Hidden Berlin photo mission',
  },
];

class BWHomeProductsElement extends HTMLElement {
  connectedCallback() {
    if (this.dataset.bwRendered === 'true') return;
    this.dataset.bwRendered = 'true';

    const asset = (fileName) => `${BW_HOME_PRODUCTS_ASSET_BASE}${fileName}`;
    const primary = BW_HOME_PRODUCTS_PRIMARY;

    this.innerHTML = `
      <style>
        @font-face {
          font-display: swap;
          font-family: 'BW Fraunces';
          font-style: normal;
          font-weight: 100 900;
          src: url('${asset('fonts/Fraunces-Variable.ttf')}') format('truetype');
        }

        @font-face {
          font-display: swap;
          font-family: 'BW Space Grotesk';
          font-style: normal;
          font-weight: 300 700;
          src: url('${asset('fonts/SpaceGrotesk-Variable.ttf')}') format('truetype');
        }

        bw-home-products {
          background: #FAFAF5;
          display: block;
          width: 100%;
        }

        .bw-home-products {
          background: #FAFAF5;
          box-sizing: border-box;
          color: #102414;
          font-family: 'BW Space Grotesk', Montserrat, Arial, sans-serif;
          letter-spacing: 0;
          overflow: hidden;
          width: 100%;
        }

        .bw-home-products *,
        .bw-home-products *::before,
        .bw-home-products *::after {
          box-sizing: border-box;
        }

        .bw-home-products__inner {
          margin: 0 auto;
          max-width: 1280px;
          padding: clamp(56px, 6vw, 88px) 32px;
        }

        .bw-home-products__head {
          margin-bottom: clamp(34px, 4vw, 52px);
          max-width: 900px;
        }

        .bw-home-products__kicker,
        .bw-home-products__label {
          color: #1B5E20;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.18em;
          line-height: 1;
          text-transform: uppercase;
        }

        .bw-home-products h2,
        .bw-home-products h3 {
          color: #102414;
          font-family: 'BW Fraunces', Georgia, serif;
          font-variation-settings: 'opsz' 72, 'SOFT' 20, 'WONK' 0;
          font-weight: 650;
          margin: 0;
        }

        .bw-home-products h2 {
          font-size: clamp(48px, 6vw, 82px);
          letter-spacing: -0.035em;
          line-height: 0.98;
          margin-top: 14px;
          max-width: 830px;
        }

        .bw-home-products__lead {
          color: #31483A;
          font-size: clamp(17px, 2vw, 21px);
          line-height: 1.5;
          margin: 18px 0 0;
          max-width: 760px;
        }

        .bw-home-products__layout {
          align-items: stretch;
          display: grid;
          gap: clamp(28px, 3.5vw, 46px);
          grid-template-columns: minmax(0, 1.55fr) minmax(390px, 1fr);
        }

        .bw-home-products__primary {
          background: #FFFFFF;
          border: 1px solid rgba(16, 36, 20, 0.2);
          border-radius: 10px;
          color: #102414;
          display: grid;
          min-height: 630px;
          overflow: hidden;
          position: relative;
          text-decoration: none;
        }

        .bw-home-products__primary-media {
          height: 100%;
          inset: 0;
          position: absolute;
          width: 100%;
        }

        .bw-home-products__primary-media img,
        .bw-home-products__item-media img {
          display: block;
          height: 100%;
          object-fit: cover;
          width: 100%;
        }

        .bw-home-products__primary-media img {
          object-position: 64% center;
        }

        .bw-home-products__primary-copy {
          align-self: stretch;
          background: rgba(250, 250, 245, 0.95);
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin: 28px 0 28px 28px;
          max-width: 50%;
          min-width: 360px;
          padding: clamp(28px, 4vw, 48px);
          position: relative;
          z-index: 1;
        }

        .bw-home-products__primary h3 {
          font-size: clamp(44px, 4.7vw, 68px);
          letter-spacing: -0.035em;
          line-height: 0.98;
          margin-top: 15px;
        }

        .bw-home-products__primary p,
        .bw-home-products__item p {
          color: #31483A;
          margin: 0;
        }

        .bw-home-products__primary p {
          font-size: 18px;
          line-height: 1.52;
          margin-top: 24px;
        }

        .bw-home-products__meta {
          color: #405647;
          display: block;
          font-size: 13px;
          font-weight: 600;
          line-height: 1.35;
          margin-top: 16px;
        }

        .bw-home-products__cta {
          align-items: center;
          background: #FFE600;
          border: 1px solid #D8C400;
          border-radius: 7px;
          color: #102414;
          display: inline-flex;
          font-family: 'BW Space Grotesk', Montserrat, Arial, sans-serif;
          font-size: 14px;
          font-weight: 700;
          justify-content: center;
          line-height: 1.1;
          min-height: 48px;
          padding: 14px 18px;
          text-align: center;
          transition: background-color 160ms ease, border-color 160ms ease, transform 160ms ease;
          width: max-content;
        }

        .bw-home-products__primary .bw-home-products__cta {
          margin-top: 26px;
        }

        .bw-home-products__list {
          border-bottom: 1px solid rgba(16, 36, 20, 0.2);
          display: grid;
          grid-template-rows: repeat(3, minmax(0, 1fr));
        }

        .bw-home-products__item {
          align-items: center;
          border-top: 1px solid rgba(16, 36, 20, 0.2);
          color: #102414;
          display: grid;
          gap: 22px;
          grid-template-columns: 150px minmax(0, 1fr);
          min-height: 210px;
          padding: 20px 0;
          text-decoration: none;
        }

        .bw-home-products__item-media {
          align-self: stretch;
          border-radius: 8px;
          min-height: 150px;
          overflow: hidden;
        }

        .bw-home-products__item-media img {
          object-position: center;
          transition: transform 220ms ease;
        }

        .bw-home-products__item h3 {
          font-size: clamp(29px, 2.8vw, 40px);
          letter-spacing: -0.025em;
          line-height: 1;
          margin-top: 10px;
        }

        .bw-home-products__item p {
          font-size: 15px;
          line-height: 1.45;
          margin-top: 10px;
        }

        .bw-home-products__item .bw-home-products__meta {
          color: #102414;
          font-size: 15px;
          margin-top: 10px;
        }

        .bw-home-products__item .bw-home-products__cta {
          font-size: 13px;
          margin-top: 13px;
          min-height: 42px;
          padding: 11px 14px;
        }

        .bw-home-products__primary:hover,
        .bw-home-products__primary:focus-visible,
        .bw-home-products__item:hover,
        .bw-home-products__item:focus-visible {
          outline: 3px solid #1B5E20;
          outline-offset: 4px;
        }

        .bw-home-products__primary:hover .bw-home-products__cta,
        .bw-home-products__primary:focus-visible .bw-home-products__cta,
        .bw-home-products__item:hover .bw-home-products__cta,
        .bw-home-products__item:focus-visible .bw-home-products__cta {
          background: #FFF16A;
          border-color: #C8B600;
          color: #102414;
          transform: translateY(-1px);
        }

        .bw-home-products__item:hover .bw-home-products__item-media img,
        .bw-home-products__item:focus-visible .bw-home-products__item-media img {
          transform: scale(1.025);
        }

        @media (prefers-reduced-motion: reduce) {
          .bw-home-products__cta,
          .bw-home-products__item-media img {
            transition: none;
          }
        }

        @media (max-width: 1040px) {
          .bw-home-products__layout {
            grid-template-columns: 1fr;
          }

          .bw-home-products__primary {
            min-height: 560px;
          }

          .bw-home-products__list {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            grid-template-rows: auto;
          }

          .bw-home-products__item {
            align-content: start;
            border-left: 1px solid rgba(16, 36, 20, 0.2);
            grid-template-columns: 1fr;
            padding: 20px;
          }

          .bw-home-products__item:first-child {
            border-left: 0;
          }

          .bw-home-products__item-media {
            aspect-ratio: 4 / 3;
            min-height: 0;
          }
        }

        @media (max-width: 720px) {
          .bw-home-products__inner {
            padding: 48px 18px 54px;
          }

          .bw-home-products h2 {
            font-size: clamp(43px, 13vw, 58px);
            line-height: 0.98;
          }

          .bw-home-products__lead {
            font-size: 17px;
          }

          .bw-home-products__primary {
            display: flex;
            flex-direction: column;
            min-height: 0;
          }

          .bw-home-products__primary-media {
            aspect-ratio: 16 / 10;
            height: auto;
            position: relative;
          }

          .bw-home-products__primary-media img {
            object-position: center;
          }

          .bw-home-products__primary-copy {
            background: #FFFFFF;
            margin: 0;
            max-width: none;
            min-width: 0;
            padding: 28px 24px 30px;
          }

          .bw-home-products__primary h3 {
            font-size: clamp(40px, 13vw, 52px);
          }

          .bw-home-products__primary p {
            font-size: 16px;
            margin-top: 18px;
          }

          .bw-home-products__primary .bw-home-products__cta {
            margin-top: 22px;
          }

          .bw-home-products__list {
            border-bottom: 0;
            display: block;
          }

          .bw-home-products__item,
          .bw-home-products__item:first-child {
            border-left: 0;
            gap: 16px;
            grid-template-columns: 104px minmax(0, 1fr);
            min-height: 0;
            padding: 24px 0;
          }

          .bw-home-products__item-media {
            align-self: start;
            aspect-ratio: 1;
            min-height: 0;
          }

          .bw-home-products__item h3 {
            font-size: clamp(27px, 8vw, 34px);
          }

          .bw-home-products__item .bw-home-products__cta {
            width: 100%;
          }

          .bw-home-products__cta {
            width: 100%;
          }
        }

        @media (max-width: 390px) {
          .bw-home-products__inner {
            padding-left: 16px;
            padding-right: 16px;
          }

          .bw-home-products__item {
            grid-template-columns: 92px minmax(0, 1fr);
          }
        }
      </style>
      <section class="bw-home-products" aria-labelledby="bw-home-products-title">
        <div class="bw-home-products__inner">
          <header class="bw-home-products__head">
            <div class="bw-home-products__kicker">Products</div>
            <h2 id="bw-home-products-title">Pick the help you need for Berlin.</h2>
            <p class="bw-home-products__lead">Plan the trip, listen on the street, fix your first day or turn the city into a game.</p>
          </header>

          <div class="bw-home-products__layout">
            <a class="bw-home-products__primary" href="${primary.href}" aria-label="${primary.cta}: ${primary.title}">
              <div class="bw-home-products__primary-media">
                <img src="${asset(primary.image)}" alt="${primary.alt}" width="1200" height="900" loading="lazy" decoding="async">
              </div>
              <div class="bw-home-products__primary-copy">
                <span class="bw-home-products__label">${primary.label}</span>
                <h3>${primary.title}</h3>
                <p>${primary.text}</p>
                <span class="bw-home-products__cta">${primary.cta}</span>
                <span class="bw-home-products__meta">${primary.meta}</span>
              </div>
            </a>

            <div class="bw-home-products__list" aria-label="More BerlinWalk products">
              ${BW_HOME_PRODUCTS_SECONDARY.map((item) => `
                <a class="bw-home-products__item" href="${item.href}" aria-label="${item.cta}: ${item.title}">
                  <div class="bw-home-products__item-media">
                    <img src="${asset(item.image)}" alt="${item.alt}" width="1200" height="800" loading="lazy" decoding="async">
                  </div>
                  <div class="bw-home-products__item-copy">
                    <span class="bw-home-products__label">${item.label}</span>
                    <h3>${item.title}</h3>
                    <p>${item.text}</p>
                    ${item.meta ? `<span class="bw-home-products__meta">${item.meta}</span>` : ''}
                    <span class="bw-home-products__cta">${item.cta}</span>
                  </div>
                </a>
              `).join('')}
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

if (!customElements.get('bw-home-products')) {
  customElements.define('bw-home-products', BWHomeProductsElement);
}
