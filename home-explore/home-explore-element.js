const BW_HOME_EXPLORE_LINKS = [
  {
    title: 'Berlin Tools',
    text: 'Free planners and checkers: tickets, fines, parking, museums.',
    href: 'https://www.berlinwalk.com/berlin-tools',
  },
  {
    title: 'Trip Planner',
    text: 'Build your full Berlin itinerary step by step.',
    href: 'https://www.berlinwalk.com/berlin-trip-planner',
  },
  {
    title: 'Berlin Games',
    text: 'Guess the year, battle the districts - Berlin as a game.',
    href: 'https://www.berlinwalk.com/games',
  },
  {
    title: 'Berlin Wall Timeline',
    text: 'Interactive history from 1945 to 1990. Watch Berlin split, survive and reunite.',
    href: 'https://www.berlinwalk.com/berlin-wall-timeline',
  },
];

class BWHomeExploreElement extends HTMLElement {
  connectedCallback() {
    if (this.dataset.bwRendered === 'true') return;
    this.dataset.bwRendered = 'true';
    this.innerHTML = `
      <style>
        bw-home-explore {
          background: #F2F5EA;
          display: block;
          width: 100%;
        }

        .bw-home-explore {
          background: #F2F5EA;
          box-sizing: border-box;
          color: #102414;
          font-family: Montserrat, Arial, sans-serif;
          letter-spacing: 0;
          width: 100%;
        }

        .bw-home-explore *,
        .bw-home-explore *::before,
        .bw-home-explore *::after {
          box-sizing: border-box;
        }

        .bw-home-explore__inner {
          margin: 0 auto;
          max-width: 1180px;
          padding: clamp(46px, 6vw, 76px) 24px;
        }

        .bw-home-explore__kicker {
          color: #0B6B3A;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.14em;
          line-height: 1;
          text-transform: uppercase;
        }

        .bw-home-explore h2 {
          color: #102414;
          font-family: Montserrat, Arial, sans-serif;
          font-size: clamp(34px, 5vw, 58px);
          font-weight: 900;
          letter-spacing: 0;
          line-height: 1.02;
          margin: 12px 0 28px;
          max-width: 860px;
        }

        .bw-home-explore__grid {
          display: grid;
          gap: 14px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .bw-home-explore__card {
          background: #FFFFFF;
          border: 1px solid rgba(16, 36, 20, 0.14);
          border-radius: 8px;
          color: #102414;
          display: grid;
          gap: 10px;
          min-height: 207px;
          padding: 22px;
          text-decoration: none;
          transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
        }

        .bw-home-explore__card:hover,
        .bw-home-explore__card:focus-visible {
          border-color: #0B6B3A;
          box-shadow: 0 16px 34px rgba(16, 36, 20, 0.12);
          outline: 3px solid rgba(255, 230, 0, 0.72);
          outline-offset: 3px;
          transform: translateY(-2px);
        }

        .bw-home-explore__card h3 {
          color: #102414;
          font-family: Montserrat, Arial, sans-serif;
          font-size: clamp(20px, 2.2vw, 27px);
          font-weight: 900;
          letter-spacing: 0;
          line-height: 1.12;
          margin: 0;
        }

        .bw-home-explore__card p {
          color: #31483A;
          font-size: 15px;
          line-height: 1.58;
          margin: 0;
        }

        .bw-home-explore__arrow {
          align-items: center;
          background: #FFE600;
          border-radius: 999px;
          color: #102414;
          display: inline-flex;
          font-size: 15px;
          font-weight: 900;
          height: 34px;
          justify-content: center;
          margin-top: 6px;
          width: 34px;
        }

        @media (max-width: 900px) {
          .bw-home-explore__inner {
            padding: 40px 18px;
          }

          .bw-home-explore__grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
      <section class="bw-home-explore" aria-labelledby="bw-home-explore-title">
        <div class="bw-home-explore__inner">
          <div class="bw-home-explore__kicker">Explore more</div>
          <h2 id="bw-home-explore-title">Keep planning your trip</h2>
          <div class="bw-home-explore__grid">
            ${BW_HOME_EXPLORE_LINKS.map((item) => `
              <a class="bw-home-explore__card" href="${item.href}">
                <h3>${item.title}</h3>
                <p>${item.text}</p>
                <span class="bw-home-explore__arrow" aria-hidden="true">-&gt;</span>
              </a>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }
}

if (!customElements.get('bw-home-explore')) {
  customElements.define('bw-home-explore', BWHomeExploreElement);
}
