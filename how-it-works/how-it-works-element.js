class BWHowItWorksElement extends HTMLElement {
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
    const steps = [
      { num: 1, icon: 'calendar', title: 'Reserve free', subtitle: 'On Freetour, no payment needed', chip: '~30 SEC' },
      { num: 2, icon: 'umbrella', title: 'Show up at Alexanderplatz', subtitle: 'Meeting point at World Clock', chip: '11:30 AM TUE-SAT' },
      { num: 3, icon: 'walking', title: 'Walk + tip what you feel', subtitle: '12 stops, Alexanderplatz to Hackescher Markt', chip: '~2 HOURS - 12 STOPS' }
    ];

    this.innerHTML = `
      <style>
        bw-how-it-works {
          display: block;
          width: 100%;
        }

        .bw-how-it-works {
          --serif: Merriweather, Georgia, serif;
          background: #FAFAF5;
          color: #212121;
          font-family: Montserrat, Arial, sans-serif;
          margin: 0;
          max-width: 100%;
          overflow-x: hidden;
          padding: 64px 24px;
          text-align: center;
        }

        .bw-how-it-works *,
        .bw-how-it-works *::before,
        .bw-how-it-works *::after {
          box-sizing: border-box;
        }

        .bw-how-it-works h2,
        .bw-how-it-works h3,
        .bw-how-it-works p {
          margin-top: 0;
        }

        .bw-how-it-works .bw-how-inner {
          margin: 0 auto;
          max-width: 1100px;
        }

        .bw-how-it-works .bw-how-header {
          margin: 0 auto 56px;
          max-width: 760px;
        }

        .bw-how-it-works .bw-how-eyebrow {
          color: #1B5E20;
          display: block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.6px;
          line-height: 1.35;
          text-transform: uppercase;
        }

        .bw-how-it-works .bw-how-title {
          color: #1B5E20;
          font-size: 38px;
          font-weight: 800;
          line-height: 1.15;
          margin: 12px auto 0;
          max-width: 720px;
        }

        .bw-how-it-works .bw-how-subtitle {
          color: #4E5A4E;
          font-family: var(--serif);
          font-size: 17px;
          font-style: italic;
          line-height: 1.6;
          margin: 14px auto 0;
          max-width: 560px;
        }

        .bw-how-it-works .bw-timeline {
          display: grid;
          gap: 28px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          position: relative;
        }

        .bw-how-it-works .bw-timeline-path {
          border-top: 2px dashed #1B5E20;
          left: calc(100% / 6);
          opacity: 0.4;
          position: absolute;
          top: 50px;
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 700ms ease-out;
          width: calc(100% * 2 / 3);
          z-index: 0;
        }

        .bw-how-it-works.is-visible .bw-timeline-path {
          transform: scaleX(1);
        }

        .bw-how-it-works .bw-step {
          min-width: 0;
          position: relative;
          z-index: 1;
        }

        .bw-how-it-works .bw-step-node-wrap {
          display: inline-flex;
          height: 100px;
          justify-content: center;
          position: relative;
          width: 100px;
          z-index: 2;
        }

        .bw-how-it-works .bw-step-node,
        .bw-how-it-works .bw-step-copy {
          opacity: 0;
          transform: scale(0.85);
          transition: opacity 350ms ease-out, transform 350ms ease-out;
        }

        .bw-how-it-works .bw-step-copy {
          align-items: center;
          display: flex;
          flex-direction: column;
          transform: translateY(12px);
        }

        .bw-how-it-works .bw-step.visible .bw-step-node,
        .bw-how-it-works .bw-step.visible .bw-step-copy {
          opacity: 1;
          transform: none;
        }

        .bw-how-it-works .bw-step-node {
          align-items: center;
          background: #1B5E20;
          border: 4px solid #FFFFFF;
          border-radius: 50%;
          color: #FFFFFF;
          display: inline-flex;
          height: 100px;
          justify-content: center;
          position: relative;
          width: 100px;
          z-index: 2;
        }

        .bw-how-it-works .bw-step-icon {
          display: block;
          height: 44px;
          width: 44px;
        }

        .bw-how-it-works .bw-step-badge {
          align-items: center;
          background: #FFE600;
          border-radius: 50%;
          color: #1B5E20;
          display: inline-flex;
          font-size: 17px;
          font-weight: 800;
          height: 32px;
          justify-content: center;
          line-height: 1;
          position: absolute;
          right: -6px;
          top: -6px;
          transform: scale(0);
          transition: transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1);
          width: 32px;
          z-index: 3;
        }

        .bw-how-it-works .bw-step.visible .bw-step-badge {
          transform: scale(1);
        }

        .bw-how-it-works .bw-time-chip {
          background: #FFE600;
          border-radius: 14px;
          color: #1B5E20;
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.1px;
          line-height: 1.25;
          margin-top: 16px;
          padding: 5px 12px;
          text-transform: uppercase;
        }

        .bw-how-it-works .bw-step-title {
          color: #1B5E20;
          font-size: 20px;
          font-weight: 800;
          line-height: 1.2;
          margin: 12px 0 0;
        }

        .bw-how-it-works .bw-step-description {
          color: #212121;
          font-family: var(--serif);
          font-size: 15px;
          line-height: 1.55;
          margin: 8px auto 0;
          max-width: 260px;
        }

        .bw-how-it-works .bw-how-cta-row {
          margin-top: 56px;
          text-align: center;
        }

        .bw-how-it-works .bw-how-cta {
          background: #FFE600;
          border-radius: 10px;
          color: #1B5E20;
          display: inline-block;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.6px;
          line-height: 1.2;
          padding: 16px 32px;
          text-decoration: none;
          text-transform: uppercase;
          transition: background 160ms ease-out, transform 160ms ease-out;
        }

        .bw-how-it-works .bw-how-cta:hover,
        .bw-how-it-works .bw-how-cta:focus-visible {
          background: #fff04a;
          transform: translateY(-2px);
        }

        .bw-how-it-works .bw-how-cta:focus-visible {
          outline: 3px solid #FFFFFF;
          outline-offset: 3px;
        }

        .bw-how-it-works .bw-visually-hidden {
          clip: rect(0 0 0 0);
          border: 0;
          height: 1px;
          margin: -1px;
          overflow: hidden;
          padding: 0;
          position: absolute;
          white-space: nowrap;
          width: 1px;
        }

        @media (max-width: 700px) {
          .bw-how-it-works {
            padding: 40px 16px;
            text-align: left;
          }

          .bw-how-it-works .bw-how-header {
            margin-bottom: 36px;
            text-align: center;
          }

          .bw-how-it-works .bw-how-title {
            font-size: 26px;
          }

          .bw-how-it-works .bw-how-subtitle {
            font-size: 15px;
          }

          .bw-how-it-works .bw-timeline {
            display: block;
          }

          .bw-how-it-works .bw-timeline-path {
            border-left: 2px dashed #1B5E20;
            border-top: 0;
            bottom: 50px;
            height: auto;
            left: 50px;
            top: 50px;
            transform: scaleY(0);
            transform-origin: center top;
            width: 0;
          }

          .bw-how-it-works.is-visible .bw-timeline-path {
            transform: scaleY(1);
          }

          .bw-how-it-works .bw-step {
            align-items: flex-start;
            display: flex;
            gap: 20px;
            margin-bottom: 32px;
          }

          .bw-how-it-works .bw-step:last-child {
            margin-bottom: 0;
          }

          .bw-how-it-works .bw-step-node-wrap {
            flex: 0 0 100px;
          }

          .bw-how-it-works .bw-step-copy {
            align-items: flex-start;
            flex: 1 1 auto;
            min-width: 0;
            padding-top: 4px;
          }

          .bw-how-it-works .bw-time-chip {
            margin-top: 10px;
            order: 2;
          }

          .bw-how-it-works .bw-step-title {
            font-size: 18px;
            margin-top: 0;
            order: 1;
          }

          .bw-how-it-works .bw-step-description {
            font-size: 14px;
            margin-left: 0;
            max-width: 100%;
            order: 3;
          }

          .bw-how-it-works .bw-how-cta-row {
            margin-top: 36px;
            text-align: center;
          }

          .bw-how-it-works .bw-how-cta {
            padding: 14px 24px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bw-how-it-works .bw-timeline-path,
          .bw-how-it-works .bw-step-node,
          .bw-how-it-works .bw-step-copy,
          .bw-how-it-works .bw-step-badge,
          .bw-how-it-works .bw-how-cta {
            transition: none;
          }

          .bw-how-it-works .bw-timeline-path,
          .bw-how-it-works.is-visible .bw-timeline-path,
          .bw-how-it-works .bw-step-node,
          .bw-how-it-works .bw-step-copy,
          .bw-how-it-works .bw-step-badge {
            opacity: 1;
            transform: none;
          }
        }
      </style>

      <section class="bw-how-it-works" role="region" aria-label="How the tour works">
        <div class="bw-how-inner">
          <header class="bw-how-header">
            <span class="bw-how-eyebrow">HOW IT WORKS</span>
            <h2 class="bw-how-title">From booking to walking - in three steps</h2>
            <p class="bw-how-subtitle">Booking takes 30 seconds. The rest is on me.</p>
          </header>

          <div class="bw-timeline">
            <div class="bw-timeline-path" aria-hidden="true"></div>
            ${steps.map((step, index) => this._renderStep(step, index, steps.length)).join('')}
          </div>

          <div class="bw-how-cta-row">
            <a class="bw-how-cta" href="https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based">Book your free spot</a>
          </div>
        </div>
      </section>
    `;
  }

  _renderStep(step, index, total) {
    return `
      <article class="bw-step">
        <div class="bw-step-node-wrap">
          <div class="bw-step-node">${this._iconSvg(step.icon)}</div>
          <span class="bw-step-badge" aria-hidden="true">${step.num}</span>
        </div>
        <div class="bw-step-copy">
          <span class="bw-time-chip">${step.chip}</span>
          <h3 class="bw-step-title">
            <span class="bw-visually-hidden">Step ${index + 1} of ${total}: </span>
            ${step.title}
          </h3>
          <p class="bw-step-description">${step.subtitle}</p>
        </div>
      </article>
    `;
  }

  _iconSvg(name) {
    const icons = {
      calendar: `<svg class="bw-step-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/></svg>`,
      umbrella: `<svg class="bw-step-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 12a10.06 10.06 0 0 0-20 0Z"/><path d="M12 12v8a2 2 0 0 0 4 0"/><path d="M12 2v1"/></svg>`,
      walking: `<svg class="bw-step-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="16" cy="4" r="1"/><path d="m18 19 1-7-6-1"/><path d="m5 8 3-3 5 1"/><path d="M4 17h5l1-4"/><path d="m12 11 3 4 4 1"/></svg>`
    };

    return icons[name] || '';
  }

  _setupAnimations() {
    const section = this.querySelector('.bw-how-it-works');
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      this._animated = true;
      section.classList.add('is-visible');
      this.querySelectorAll('.bw-step').forEach(step => step.classList.add('visible'));
      return;
    }

    if (!('IntersectionObserver' in window)) {
      this._animated = true;
      this._playAnimations(section);
      return;
    }

    this._observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || this._animated) return;
        this._animated = true;
        this._playAnimations(section);
        this._observer.disconnect();
      });
    }, { threshold: 0.3 });

    this._observer.observe(section);
  }

  _playAnimations(section) {
    section.classList.add('is-visible');
    this.querySelectorAll('.bw-step').forEach((step, index) => {
      setTimeout(() => {
        step.classList.add('visible');
      }, index * 150);
    });
  }
}

if (!customElements.get('bw-how-it-works')) {
  customElements.define('bw-how-it-works', BWHowItWorksElement);
}
