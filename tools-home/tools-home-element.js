const BW_TOOLS_HOME_DATA_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/tools-home/data.json';

class BWToolsHomeElement extends HTMLElement {
  constructor() {
    super();
    this._animated = false;
    this._observer = null;
  }

  connectedCallback() {
    this._renderShell();
    this._loadDataAndRender();
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  _renderShell() {
    this.innerHTML = `
      <style>
        bw-tools-home {
          display: block;
          width: 100%;
        }

        .bw-tools-home {
          --serif: Merriweather, Georgia, serif;
          background: #FFFFFF;
          color: #212121;
          font-family: Montserrat, Arial, sans-serif;
          margin: 0;
          max-width: 100%;
          overflow-x: hidden;
          padding: 64px 24px;
        }

        .bw-tools-home *,
        .bw-tools-home *::before,
        .bw-tools-home *::after {
          box-sizing: border-box;
        }

        .bw-tools-home h2,
        .bw-tools-home h3,
        .bw-tools-home p {
          margin-top: 0;
        }

        .bw-tools-home .bw-tools-home-inner {
          margin: 0 auto;
          max-width: 1120px;
        }

        .bw-tools-home .bw-tools-home-header {
          align-items: end;
          display: grid;
          gap: 26px;
          grid-template-columns: minmax(0, 1fr) minmax(280px, 0.48fr);
          margin: 0 0 30px;
        }

        .bw-tools-home .bw-tools-home-kicker {
          color: #1B5E20;
          display: block;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1px;
          line-height: 1.2;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .bw-tools-home .bw-tools-home-title {
          color: #1B5E20;
          font-size: 42px;
          font-weight: 800;
          line-height: 1.08;
          margin-bottom: 12px;
        }

        .bw-tools-home .bw-tools-home-lead {
          color: #4E5A4E;
          font-family: var(--serif);
          font-size: 17px;
          line-height: 1.65;
          margin-bottom: 0;
          max-width: 640px;
        }

        .bw-tools-home .bw-tools-home-panel {
          background: #FAFAF5;
          border: 1px solid #C5E1A5;
          border-left: 5px solid #1B5E20;
          border-radius: 8px;
          padding: 18px 20px;
        }

        .bw-tools-home .bw-tools-home-panel h3 {
          color: #1B5E20;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 1px;
          line-height: 1.3;
          margin-bottom: 9px;
          text-transform: uppercase;
        }

        .bw-tools-home .bw-tools-home-panel p {
          color: #4E5A4E;
          font-family: var(--serif);
          font-size: 14px;
          line-height: 1.55;
          margin-bottom: 14px;
        }

        .bw-tools-home .bw-tools-home-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .bw-tools-home .bw-tools-home-tag {
          background: #FFE600;
          border-radius: 999px;
          color: #1B5E20;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.7px;
          padding: 6px 9px;
          text-transform: uppercase;
        }

        .bw-tools-home .bw-tools-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .bw-tools-home .bw-tool-card {
          align-items: flex-start;
          background: #FFFFFF;
          border: 1px solid #C5E1A5;
          border-radius: 8px;
          color: inherit;
          display: flex;
          flex-direction: row;
          gap: 16px;
          min-height: 178px;
          min-width: 0;
          opacity: 0;
          padding: 18px 20px;
          text-align: left;
          text-decoration: none;
          transform: translateY(12px);
          transition: border-color 160ms ease, box-shadow 160ms ease, opacity 400ms ease-out, transform 400ms ease-out;
        }

        .bw-tools-home .bw-tool-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .bw-tools-home .bw-tool-card:hover,
        .bw-tools-home .bw-tool-card:focus-visible {
          border-color: #1B5E20;
          box-shadow: 0 10px 24px rgba(27, 94, 32, 0.12);
          transform: translateY(-2px);
        }

        .bw-tools-home .bw-tool-card.visible:hover,
        .bw-tools-home .bw-tool-card.visible:focus-visible {
          transform: translateY(-2px);
        }

        .bw-tools-home .bw-tool-card:focus-visible {
          outline: 3px solid rgba(255, 230, 0, 0.9);
          outline-offset: 2px;
        }

        .bw-tools-home .bw-tool-card-thumb {
          border-radius: 7px;
          flex-shrink: 0;
          height: 80px;
          object-fit: cover;
          width: 80px;
        }

        .bw-tools-home .bw-tool-card-placeholder {
          align-items: center;
          background: linear-gradient(135deg, #FFE600, #7CB342);
          border-radius: 7px;
          color: #1B5E20;
          display: flex;
          flex-shrink: 0;
          font-family: Montserrat, Arial, sans-serif;
          font-size: 32px;
          font-weight: 800;
          height: 80px;
          justify-content: center;
          line-height: 1;
          text-transform: uppercase;
          width: 80px;
        }

        .bw-tools-home .bw-tool-card-content {
          display: flex;
          flex: 1 1 auto;
          flex-direction: column;
          min-width: 0;
        }

        .bw-tools-home .bw-tool-card h3 {
          color: #1B5E20;
          font-size: 18px;
          font-weight: 800;
          line-height: 1.25;
          margin-bottom: 8px;
          overflow-wrap: break-word;
        }

        .bw-tools-home .bw-tool-card p {
          color: #212121;
          font-family: var(--serif);
          font-size: 14.5px;
          line-height: 1.5;
          margin-bottom: 12px;
          overflow-wrap: break-word;
        }

        .bw-tools-home .bw-tool-cta {
          color: #1B5E20;
          display: inline-block;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.8px;
          margin-top: auto;
          text-transform: uppercase;
        }

        .bw-tools-home .bw-tools-home-footer {
          align-items: center;
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-top: 28px;
        }

        .bw-tools-home .bw-btn-primary {
          background: #FFE600;
          border-radius: 999px;
          color: #1B5E20;
          display: inline-block;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.6px;
          padding: 14px 28px;
          text-decoration: none;
          text-transform: uppercase;
          transition: background 160ms ease, transform 160ms ease;
        }

        .bw-tools-home .bw-btn-primary:hover,
        .bw-tools-home .bw-btn-primary:focus-visible {
          background: #fff04a;
          transform: translateY(-1px);
        }

        .bw-tools-home .bw-btn-primary:focus-visible {
          outline: 3px solid rgba(27, 94, 32, 0.3);
          outline-offset: 3px;
        }

        .bw-tools-home .bw-tools-home-footer-note {
          color: #4E5A4E;
          font-family: var(--serif);
          font-size: 14px;
          line-height: 1.45;
          margin-bottom: 0;
        }

        .bw-tools-home .bw-tools-error {
          color: #4E5A4E;
          font-family: var(--serif);
          font-size: 16px;
          padding: 12px 0;
          text-align: center;
        }

        .bw-tools-home .bw-skeleton-card {
          background: #FFFFFF;
          border: 1px solid #DCE8C8;
          border-radius: 12px;
          display: flex;
          gap: 16px;
          padding: 18px 20px;
        }

        .bw-tools-home .bw-skeleton-thumb,
        .bw-tools-home .bw-skeleton-line {
          animation: bw-tools-home-shimmer 1200ms linear infinite;
          background: linear-gradient(90deg, #F2F8E8 0%, #FFFFFF 45%, #F2F8E8 90%);
          background-size: 220% 100%;
        }

        .bw-tools-home .bw-skeleton-thumb {
          border-radius: 8px;
          flex: 0 0 80px;
          height: 80px;
          width: 80px;
        }

        .bw-tools-home .bw-skeleton-copy {
          flex: 1 1 auto;
          min-width: 0;
          padding-top: 4px;
        }

        .bw-tools-home .bw-skeleton-line {
          border-radius: 999px;
          display: block;
          height: 13px;
          margin-bottom: 12px;
        }

        .bw-tools-home .bw-skeleton-line.short {
          width: 52%;
        }

        .bw-tools-home .bw-skeleton-line.medium {
          width: 74%;
        }

        .bw-tools-home .bw-skeleton-line.long {
          width: 92%;
        }

        @keyframes bw-tools-home-shimmer {
          from { background-position: 120% 0; }
          to { background-position: -120% 0; }
        }

        @media (max-width: 1024px) {
          .bw-tools-home .bw-tools-home-header {
            align-items: stretch;
            grid-template-columns: 1fr;
          }

          .bw-tools-home .bw-tools-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 520px) {
          .bw-tools-home {
            padding: 42px 16px;
          }

          .bw-tools-home .bw-tools-home-header {
            margin-bottom: 22px;
          }

          .bw-tools-home .bw-tools-home-title {
            font-size: 30px;
          }

          .bw-tools-home .bw-tools-home-lead {
            font-size: 15px;
          }

          .bw-tools-home .bw-tools-home-panel {
            padding: 16px;
          }

          .bw-tools-home .bw-tools-grid {
            grid-template-columns: 1fr;
          }

          .bw-tools-home .bw-tool-card,
          .bw-tools-home .bw-skeleton-card {
            gap: 12px;
            min-height: 0;
            padding: 14px;
          }

          .bw-tools-home .bw-tool-card-thumb,
          .bw-tools-home .bw-tool-card-placeholder,
          .bw-tools-home .bw-skeleton-thumb {
            flex-basis: 64px;
            height: 64px;
            width: 64px;
          }

          .bw-tools-home .bw-tool-card-placeholder {
            font-size: 24px;
          }

          .bw-tools-home .bw-tool-card h3 {
            font-size: 16px;
            margin-bottom: 6px;
          }

          .bw-tools-home .bw-tool-card p {
            font-size: 13.5px;
            margin-bottom: 10px;
          }

          .bw-tools-home .bw-btn-primary {
            display: block;
            width: 100%;
          }

          .bw-tools-home .bw-tools-home-footer {
            align-items: stretch;
            flex-direction: column;
            text-align: center;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bw-tools-home .bw-tool-card,
          .bw-tools-home .bw-tool-card:hover,
          .bw-tools-home .bw-tool-card:focus-visible,
          .bw-tools-home .bw-btn-primary,
          .bw-tools-home .bw-skeleton-thumb,
          .bw-tools-home .bw-skeleton-line {
            animation: none;
            transition: none;
            transform: none;
          }
        }
      </style>

      <section class="bw-tools-home" aria-labelledby="bw-tools-home-title">
        <div class="bw-tools-home-inner">
          <header class="bw-tools-home-header">
            <div>
              <span class="bw-tools-home-kicker">Plan your visit</span>
              <h2 id="bw-tools-home-title" class="bw-tools-home-title">Plan your Berlin visit in minutes</h2>
              <p class="bw-tools-home-lead">Quick local tools for tickets, budget, weather, water, and first-day choices before you arrive.</p>
            </div>
            <aside class="bw-tools-home-panel" aria-label="Planning tools summary">
              <h3>Built by a local guide</h3>
              <p>Start with the questions travelers ask most, then bring the rest to the walk.</p>
              <div class="bw-tools-home-tags" aria-hidden="true">
                <span class="bw-tools-home-tag">Tickets</span>
                <span class="bw-tools-home-tag">Budget</span>
                <span class="bw-tools-home-tag">Maps</span>
              </div>
            </aside>
          </header>

          <div class="bw-tools-root" aria-live="polite">
            ${this._renderSkeleton()}
          </div>

          <footer class="bw-tools-home-footer">
            <a href="https://www.berlinwalk.com/berlin-tools" class="bw-btn-primary" target="_top">Explore all planning tools</a>
            <p class="bw-tools-home-footer-note">Free to use. No signup needed.</p>
          </footer>
        </div>
      </section>
    `;
  }

  async _loadDataAndRender() {
    try {
      const response = await fetch(BW_TOOLS_HOME_DATA_URL);
      if (!response.ok) throw new Error('Could not load tools');
      const data = await response.json();
      this._renderTools(data);
      this._setupAnimations();
    } catch (error) {
      this._renderError();
    }
  }

  _renderSkeleton() {
    return `
      <div class="bw-tools-grid" aria-label="Loading tools">
        ${Array.from({ length: 6 }).map(() => `
          <div class="bw-skeleton-card" aria-hidden="true">
            <span class="bw-skeleton-thumb"></span>
            <span class="bw-skeleton-copy">
              <span class="bw-skeleton-line medium"></span>
              <span class="bw-skeleton-line long"></span>
              <span class="bw-skeleton-line short"></span>
            </span>
          </div>
        `).join('')}
      </div>
    `;
  }

  _renderTools(data) {
    const tools = data && Array.isArray(data.featuredTools) ? data.featuredTools.slice(0, 6) : [];
    const root = this.querySelector('.bw-tools-root');
    if (!root || !tools.length) {
      this._renderError();
      return;
    }

    root.removeAttribute('aria-live');
    root.innerHTML = `
      <div class="bw-tools-grid">
        ${tools.map(tool => this._renderTool(tool)).join('')}
      </div>
    `;
  }

  _renderTool(tool) {
    const href = `https://www.berlinwalk.com/tools/${tool.slug || ''}`;
    const image = typeof tool.image === 'string' ? tool.image.trim() : '';
    const title = this._escapeHtml(tool.title || '');
    const lead = this._escapeHtml(tool.lead || '');

    return `
      <a class="bw-tool-card" href="${href}" target="_top">
        ${image
          ? `<img class="bw-tool-card-thumb" src="${image}" alt="${title}" loading="lazy" decoding="async">`
          : `<span class="bw-tool-card-placeholder" aria-hidden="true">${title.charAt(0)}</span>`}
        <span class="bw-tool-card-content">
          <h3>${title}</h3>
          <p>${lead}</p>
          <span class="bw-tool-cta">Open tool</span>
        </span>
      </a>
    `;
  }

  _renderError() {
    const root = this.querySelector('.bw-tools-root');
    if (!root) return;
    root.setAttribute('aria-live', 'polite');
    root.innerHTML = `<p class="bw-tools-error">Tools temporarily unavailable</p>`;
  }

  _setupAnimations() {
    const section = this.querySelector('.bw-tools-home');
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      this._animated = true;
      this.querySelectorAll('.bw-tool-card').forEach(card => card.classList.add('visible'));
      return;
    }

    if (!('IntersectionObserver' in window)) {
      this._animated = true;
      this._playAnimations();
      return;
    }

    this._observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || this._animated) return;
        this._animated = true;
        this._playAnimations();
        this._observer.disconnect();
      });
    }, { threshold: 0.3 });

    this._observer.observe(section);
  }

  _playAnimations() {
    this.querySelectorAll('.bw-tool-card').forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('visible');
      }, index * 70);
    });
  }

  _escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

if (!customElements.get('bw-tools-home')) {
  customElements.define('bw-tools-home', BWToolsHomeElement);
}
