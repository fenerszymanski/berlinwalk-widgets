class BWStatsElement extends HTMLElement {
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
        bw-stats {
          display: block;
          width: 100%;
        }

        .bw-stats {
          background: #1B5E20;
          color: #FFFFFF;
          font-family: Montserrat, Arial, sans-serif;
          margin: 0;
          max-width: 100%;
          overflow-x: hidden;
          padding: 36px 24px;
          text-align: center;
        }

        .bw-stats *,
        .bw-stats *::before,
        .bw-stats *::after {
          box-sizing: border-box;
        }

        .bw-stats .bw-stats-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          margin: 0 auto;
          max-width: 1100px;
        }

        .bw-stats .bw-stat {
          align-items: center;
          display: flex;
          flex-direction: column;
          min-width: 0;
          opacity: 0;
          padding: 8px 16px;
          position: relative;
          text-align: center;
          transform: translateY(16px);
          transition: opacity 400ms ease-out, transform 400ms ease-out;
        }

        .bw-stats .bw-stat.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .bw-stats .bw-stat + .bw-stat::before {
          background: #FFFFFF;
          bottom: 18%;
          content: "";
          left: 0;
          opacity: 0.22;
          position: absolute;
          top: 18%;
          width: 1px;
        }

        .bw-stats .bw-stat-icon {
          color: #FFFFFF;
          flex-shrink: 0;
          height: 24px;
          margin-bottom: 14px;
          width: 24px;
        }

        .bw-stats .bw-stat-value {
          color: #FFFFFF;
          display: block;
          font-size: 48px;
          font-weight: 800;
          letter-spacing: -1px;
          line-height: 1;
          white-space: nowrap;
        }

        .bw-stats .prefix {
          color: #FFFFFF;
          font-size: 32px;
          font-weight: 700;
          margin-right: 2px;
          vertical-align: 4px;
        }

        .bw-stats .suffix {
          color: #FFFFFF;
          font-size: 22px;
          font-weight: 700;
          margin-left: 3px;
          vertical-align: 6px;
        }

        .bw-stats .bw-stat-label {
          color: #FFFFFF;
          display: block;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.4px;
          line-height: 1.35;
          margin: 14px auto 0;
          max-width: 140px;
          text-transform: uppercase;
        }

        @media (max-width: 700px) {
          .bw-stats {
            padding: 28px 16px;
          }

          .bw-stats .bw-stats-grid {
            column-gap: 24px;
            grid-template-columns: 1fr 1fr;
            row-gap: 32px;
          }

          .bw-stats .bw-stat {
            padding: 6px 8px;
          }

          .bw-stats .bw-stat + .bw-stat::before {
            display: none;
          }

          .bw-stats .bw-stat-icon {
            height: 22px;
            margin-bottom: 12px;
            width: 22px;
          }

          .bw-stats .bw-stat-value {
            font-size: 36px;
          }

          .bw-stats .prefix {
            font-size: 24px;
            vertical-align: 3px;
          }

          .bw-stats .suffix {
            font-size: 18px;
            vertical-align: 4px;
          }

          .bw-stats .bw-stat-label {
            font-size: 11px;
            margin-top: 10px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bw-stats .bw-stat {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      </style>

      <section class="bw-stats" role="region" aria-label="Tour at a glance">
        <div class="bw-stats-grid" aria-live="off">
          ${this._renderStat({ id: 'stops', icon: 'map-pin', value: 12, label: 'Stops', decimals: 0, animation: 'count' })}
          ${this._renderStat({ id: 'duration', icon: 'clock', prefix: '~', value: 2, suffix: 'h', label: 'Duration', decimals: 0, animation: 'count' })}
          ${this._renderStat({ id: 'price', icon: 'heart', value: 'FREE', label: 'Tip-based', animation: 'fade' })}
          ${this._renderStat({ id: 'rating', icon: 'star', value: 9.8, suffix: '/10', label: 'On Freetour', decimals: 1, animation: 'count' })}
        </div>
      </section>
    `;
  }

  _renderStat(stat) {
    const initialDisplay = stat.animation === 'fade'
      ? stat.value
      : (0).toFixed(stat.decimals || 0);

    return `
      <div
        class="bw-stat"
        role="group"
        aria-label="${this._statLabel(stat)}"
        data-stat-id="${stat.id}"
        data-target="${stat.value}"
        data-decimals="${stat.decimals || 0}"
        data-animation="${stat.animation}"
      >
        ${this._iconSvg(stat.icon)}
        <div class="bw-stat-value">
          ${stat.prefix ? `<span class="prefix">${stat.prefix}</span>` : ''}
          ${stat.animation === 'count'
            ? `<span class="bw-num">${initialDisplay}</span>`
            : `<span>${stat.value}</span>`}
          ${stat.suffix ? `<span class="suffix">${stat.suffix}</span>` : ''}
        </div>
        <div class="bw-stat-label">${stat.label}</div>
      </div>
    `;
  }

  _iconSvg(name) {
    const ICONS = {
      'map-pin': `<svg class="bw-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`,
      clock: `<svg class="bw-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
      heart: `<svg class="bw-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/></svg>`,
      star: `<svg class="bw-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
    };

    return ICONS[name] || '';
  }

  _setupAnimations() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      this.querySelectorAll('.bw-stat').forEach(stat => {
        stat.classList.add('visible');
        const num = stat.querySelector('.bw-num');
        if (num) {
          const target = parseFloat(stat.dataset.target);
          const decimals = parseInt(stat.dataset.decimals, 10) || 0;
          num.textContent = target.toFixed(decimals);
        }
      });
      return;
    }

    if (!('IntersectionObserver' in window)) {
      this._animated = true;
      this._playAnimations();
      return;
    }

    this._observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this._animated) {
          this._animated = true;
          this._playAnimations();
          this._observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    this._observer.observe(this);
  }

  _playAnimations() {
    const stats = this.querySelectorAll('.bw-stat');
    stats.forEach((stat, i) => {
      setTimeout(() => {
        stat.classList.add('visible');
        setTimeout(() => {
          const num = stat.querySelector('.bw-num');
          if (num) this._countUp(num);
        }, 400);
      }, i * 80);
    });
  }

  _countUp(el) {
    const stat = el.closest('.bw-stat');
    const target = parseFloat(stat.dataset.target);
    const decimals = parseInt(stat.dataset.decimals, 10) || 0;
    const duration = 1200;
    const start = performance.now();
    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = (target * easeOutCubic(progress)).toFixed(decimals);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target.toFixed(decimals);
    };

    requestAnimationFrame(update);
  }

  _statLabel(stat) {
    const value = this._accessibleValue(stat);
    return `${value} ${String(stat.label || '').toLowerCase()}`;
  }

  _accessibleValue(stat) {
    if (stat.id === 'duration') return `approximately ${stat.value} hours`;
    if (stat.id === 'rating') return `${stat.value} out of 10`;
    return String(stat.value);
  }
}

if (!customElements.get('bw-stats')) {
  customElements.define('bw-stats', BWStatsElement);
}
