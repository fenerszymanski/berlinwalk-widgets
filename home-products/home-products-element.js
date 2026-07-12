const BW_HOME_PRODUCTS = [
  {
    title: 'Berlin Trip Planner',
    label: 'Before you land',
    text: 'Enter your dates and where you are staying. I build your Berlin days area by area, with weather, opening-day checks and practical routes between real places.',
    cta: 'Build my Berlin plan',
    href: 'https://www.berlinwalk.com/berlin-trip-planner',
  },
  {
    title: 'Hidden Berlin Audio Route',
    label: 'Audio walk',
    text: 'My voice in your ear through the corners of Berlin most tours skip. Walk it any day, at your own pace.',
    cta: 'Start the hidden route',
    href: 'https://www.berlinwalk.com/products/hidden-berlin-audio-route',
  },
  {
    title: 'Berlin Wall: The Death Strip Audio Route',
    label: 'Audio walk',
    text: '14 tracks along the real death strip. I walk you through what stood where and what it cost, at your own pace.',
    cta: 'Walk the death strip',
    href: 'https://www.berlinwalk.com/products/death-strip-audio-route',
  },
];

class BWHomeProductsElement extends HTMLElement {
  connectedCallback() {
    if (this.dataset.bwRendered === 'true') return;
    this.dataset.bwRendered = 'true';
    this.innerHTML = `
      <style>
        bw-home-products {
          background: #FAFAF5;
          display: block;
          width: 100%;
        }

        .bw-home-products {
          background: #FAFAF5;
          box-sizing: border-box;
          color: #102414;
          font-family: Montserrat, Arial, sans-serif;
          letter-spacing: 0;
          width: 100%;
        }

        .bw-home-products *,
        .bw-home-products *::before,
        .bw-home-products *::after {
          box-sizing: border-box;
        }

        .bw-home-products__inner {
          margin: 0 auto;
          max-width: 1180px;
          padding: clamp(46px, 6vw, 76px) 24px;
        }

        .bw-home-products__head {
          align-items: end;
          display: grid;
          gap: 18px;
          grid-template-columns: minmax(0, 1fr) auto;
          margin-bottom: 28px;
        }

        .bw-home-products__kicker {
          color: #0B6B3A;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.14em;
          line-height: 1;
          text-transform: uppercase;
        }

        .bw-home-products h2 {
          color: #102414;
          font-family: Montserrat, Arial, sans-serif;
          font-size: clamp(34px, 5vw, 58px);
          font-weight: 900;
          letter-spacing: 0;
          line-height: 1.02;
          margin: 12px 0;
          max-width: 830px;
        }

        .bw-home-products__lead {
          color: #31483A;
          font-family: Merriweather, Georgia, serif;
          font-size: clamp(17px, 2.2vw, 21px);
          font-style: italic;
          line-height: 1.55;
          margin: 0;
          max-width: 720px;
        }

        .bw-home-products__note {
          background: #102414;
          border-left: 5px solid #FFE600;
          border-radius: 8px;
          color: #FAFAF5;
          font-size: 13px;
          font-weight: 800;
          line-height: 1.45;
          max-width: 280px;
          padding: 16px;
        }

        .bw-home-products__grid {
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .bw-home-products__card {
          background: #FFFFFF;
          border: 1px solid rgba(16, 36, 20, 0.16);
          border-radius: 8px;
          box-shadow: 0 20px 46px rgba(16, 36, 20, 0.1);
          color: #102414;
          display: grid;
          gap: 16px;
          grid-template-rows: auto auto 1fr auto;
          min-height: 330px;
          padding: 24px;
          text-decoration: none;
          transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
        }

        .bw-home-products__card:hover,
        .bw-home-products__card:focus-visible {
          border-color: #0B6B3A;
          box-shadow: 0 22px 55px rgba(16, 36, 20, 0.16);
          outline: 3px solid rgba(255, 230, 0, 0.72);
          outline-offset: 3px;
          transform: translateY(-2px);
        }

        .bw-home-products__label {
          align-items: center;
          background: #F2F5EA;
          border: 1px solid rgba(124, 179, 66, 0.32);
          border-radius: 999px;
          color: #0B6B3A;
          display: inline-flex;
          font-size: 11px;
          font-weight: 900;
          justify-self: start;
          letter-spacing: 0.08em;
          line-height: 1;
          min-height: 28px;
          padding: 8px 11px;
          text-transform: uppercase;
        }

        .bw-home-products__card h3 {
          color: #102414;
          font-family: Montserrat, Arial, sans-serif;
          font-size: clamp(20px, 2.2vw, 27px);
          font-weight: 900;
          letter-spacing: 0;
          line-height: 1.12;
          margin: 0;
        }

        .bw-home-products__card p {
          color: #31483A;
          font-size: 15px;
          line-height: 1.58;
          margin: 0;
        }

        .bw-home-products__cta {
          align-items: center;
          background: #FFE600;
          border-radius: 999px;
          color: #102414;
          display: inline-flex;
          font-size: 13px;
          font-weight: 900;
          justify-content: center;
          line-height: 1.1;
          min-height: 44px;
          padding: 13px 18px;
          width: max-content;
        }

        @media (max-width: 900px) {
          .bw-home-products__inner {
            padding: 40px 18px;
          }

          .bw-home-products__head,
          .bw-home-products__grid {
            grid-template-columns: 1fr;
          }

          .bw-home-products__note {
            max-width: none;
          }

          .bw-home-products__card {
            min-height: 0;
          }

          .bw-home-products__cta {
            width: 100%;
          }
        }
      </style>
      <section class="bw-home-products" aria-labelledby="bw-home-products-title">
        <div class="bw-home-products__inner">
          <div class="bw-home-products__head">
            <div>
              <div class="bw-home-products__kicker">Products</div>
              <h2 id="bw-home-products-title">Berlin on your own schedule</h2>
              <p class="bw-home-products__lead">The free tour runs on set dates. These work whenever you land.</p>
            </div>
            <div class="bw-home-products__note">Made for the moments before or after a live walk.</div>
          </div>
          <div class="bw-home-products__grid">
            ${BW_HOME_PRODUCTS.map((item) => `
              <a class="bw-home-products__card" href="${item.href}">
                <span class="bw-home-products__label">${item.label}</span>
                <h3>${item.title}</h3>
                <p>${item.text}</p>
                <span class="bw-home-products__cta">${item.cta}</span>
              </a>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }
}

if (!customElements.get('bw-home-products')) {
  customElements.define('bw-home-products', BWHomeProductsElement);
}
