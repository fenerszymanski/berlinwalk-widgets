const CARDS = [
  {
    icon: 'history',
    title: "Berlin's Ancient Core",
    desc: 'Explore where Berlin truly began, the medieval heart most tourists never see.'
  },
  {
    icon: 'lightbulb',
    title: 'Stories & Humor',
    desc: 'History brought to life with fascinating stories and unexpected humor.'
  },
  {
    icon: 'compass',
    title: 'Local Perspective',
    desc: 'See Berlin through the eyes of someone who truly knows this city.'
  },
  {
    icon: 'landmark',
    title: 'UNESCO Heritage',
    desc: 'Museum Island, Prussian architecture, and layers of history in every step.'
  }
];

const FLOW_STEPS = [
  { label: 'Reserve free', detail: 'On Freetour, no payment needed' },
  { label: 'Show up at Alexanderplatz', detail: 'Meeting point at World Clock' },
  { label: 'Walk + tip what you feel', detail: '12 stops, ~2 hours' }
];

class BWWhyElement extends HTMLElement {
  constructor() {
    super();
    this._animated = false;
    this._observer = null;
  }

  connectedCallback() {
    this._render();
    this._setupAnimations();
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  _render() {
    this.innerHTML = `
      <style>
        bw-why {
          background: #FFFFFF;
          display: block;
          width: 100%;
        }

        .bw-why {
          background: #FFFFFF;
          color: #1B5E20;
          font-family: Montserrat, Arial, sans-serif;
          margin: 0;
          max-width: 100%;
          overflow-x: hidden;
          padding: 64px 32px;
        }

        .bw-why *,
        .bw-why *::before,
        .bw-why *::after {
          box-sizing: border-box;
        }

        .bw-why .bw-why-inner {
          margin: 0 auto;
          max-width: 1200px;
          width: 100%;
        }

        .bw-why .bw-why-header {
          margin: 0 0 48px;
          text-align: center;
        }

        .bw-why .bw-why-title {
          color: #1B5E20;
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.01em;
          line-height: 1.2;
          margin: 0 0 12px;
        }

        .bw-why .bw-why-subtitle {
          color: #4E5A4E;
          font-family: Merriweather, Georgia, serif;
          font-size: 16px;
          font-style: italic;
          font-weight: 400;
          line-height: 1.55;
          margin: 0 auto;
          max-width: 540px;
        }

        .bw-why .bw-why-cards {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          margin: 0;
          padding: 0;
        }

        .bw-why .bw-why-flow {
          background: #FAFAF5;
          border: 1px solid #E2E8D7;
          border-radius: 8px;
          display: grid;
          gap: 0;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 18px;
          overflow: hidden;
        }

        .bw-why .bw-why-flow-step {
          align-items: center;
          display: grid;
          gap: 6px;
          min-width: 0;
          padding: 18px 20px;
          position: relative;
          text-align: left;
        }

        .bw-why .bw-why-flow-step + .bw-why-flow-step {
          border-left: 1px solid #E2E8D7;
        }

        .bw-why .bw-why-flow-label {
          color: #1B5E20;
          font-size: 13px;
          font-weight: 800;
          line-height: 1.25;
        }

        .bw-why .bw-why-flow-detail {
          color: #4E5A4E;
          font-family: Merriweather, Georgia, serif;
          font-size: 13px;
          line-height: 1.45;
        }

        .bw-why .bw-why-card {
          background: #FFFFFF;
          border: 1px solid #E8E8E8;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          margin: 0;
          min-width: 0;
          opacity: 0;
          overflow: hidden;
          transform: translateY(12px);
          transition: opacity 400ms ease-out, transform 400ms ease-out, border-color 200ms ease-out;
        }

        .bw-why .bw-why-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .bw-why .bw-why-accent {
          background: #FFE600;
          flex: 0 0 4px;
          height: 4px;
          width: 100%;
        }

        .bw-why .bw-why-card-body {
          display: flex;
          flex: 1;
          flex-direction: column;
          padding: 28px 22px;
        }

        .bw-why .bw-why-icon {
          color: #1B5E20;
          display: block;
          flex-shrink: 0;
          height: 28px;
          margin: 0 0 14px;
          width: 28px;
        }

        .bw-why .bw-why-card-title {
          color: #1B5E20;
          font-size: 16px;
          font-weight: 800;
          line-height: 1.25;
          margin: 0 0 8px;
        }

        .bw-why .bw-why-card-desc {
          color: #4E5A4E;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.55;
          margin: 0;
        }

        @media (hover: hover) and (pointer: fine) {
          .bw-why .bw-why-card:hover {
            border-color: #C8C8C8;
            cursor: default;
            transform: translateY(-2px);
          }
        }

        @media (max-width: 1023px) {
          .bw-why .bw-why-cards {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 639px) {
          .bw-why {
            padding: 48px 20px;
          }

          .bw-why .bw-why-title {
            font-size: 26px;
          }

          .bw-why .bw-why-subtitle {
            font-size: 14px;
          }

          .bw-why .bw-why-cards {
            gap: 14px;
            grid-template-columns: 1fr;
          }

          .bw-why .bw-why-flow {
            grid-template-columns: 1fr;
            margin-top: 14px;
          }

          .bw-why .bw-why-flow-step {
            padding: 16px 18px;
          }

          .bw-why .bw-why-flow-step + .bw-why-flow-step {
            border-left: 0;
            border-top: 1px solid #E2E8D7;
          }

          .bw-why .bw-why-card-body {
            padding: 24px 18px;
          }

          .bw-why .bw-why-icon {
            height: 26px;
            width: 26px;
          }

          .bw-why .bw-why-card-title {
            font-size: 15px;
          }

          .bw-why .bw-why-card-desc {
            font-size: 13.5px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bw-why .bw-why-card {
            opacity: 1;
            transform: none;
            transition: border-color 200ms ease-out;
          }
        }
      </style>

      <section class="bw-why" role="region" aria-labelledby="bw-why-title">
        <div class="bw-why-inner">
          <header class="bw-why-header">
            <h2 id="bw-why-title" class="bw-why-title">Why Walk With Me?</h2>
            <p class="bw-why-subtitle">More than a tour. Eight centuries of Berlin, in one walk.</p>
          </header>
          <div class="bw-why-cards" role="list">
            ${CARDS.map(card => this._renderCard(card)).join('')}
          </div>
          <div class="bw-why-flow" aria-label="How the tour works">
            ${FLOW_STEPS.map(step => this._renderFlowStep(step)).join('')}
          </div>
        </div>
      </section>
    `;
  }

  _renderCard(card) {
    return `
      <article class="bw-why-card" role="listitem">
        <div class="bw-why-accent" aria-hidden="true"></div>
        <div class="bw-why-card-body">
          ${this._iconSvg(card.icon)}
          <h3 class="bw-why-card-title">${card.title}</h3>
          <p class="bw-why-card-desc">${card.desc}</p>
        </div>
      </article>
    `;
  }

  _renderFlowStep(step) {
    return `
      <div class="bw-why-flow-step">
        <strong class="bw-why-flow-label">${step.label}</strong>
        <span class="bw-why-flow-detail">${step.detail}</span>
      </div>
    `;
  }

  _iconSvg(name) {
    const ICONS = {
      history: `<svg class="bw-why-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>`,
      lightbulb: `<svg class="bw-why-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
      compass: `<svg class="bw-why-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"/></svg>`,
      landmark: `<svg class="bw-why-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 18v-7"/><path d="M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="M3 22h18"/><path d="M6 18v-7"/></svg>`
    };

    return ICONS[name] || '';
  }

  _setupAnimations() {
    const cards = this.querySelectorAll('.bw-why-card');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      cards.forEach(card => card.classList.add('visible'));
      return;
    }

    if (!('IntersectionObserver' in window)) {
      this._animated = true;
      cards.forEach(card => card.classList.add('visible'));
      return;
    }

    this._observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this._animated) {
          this._animated = true;
          cards.forEach((card, i) => {
            setTimeout(() => card.classList.add('visible'), i * 80);
          });
          this._observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    this._observer.observe(this);
  }
}

if (!customElements.get('bw-why')) {
  customElements.define('bw-why', BWWhyElement);
}
