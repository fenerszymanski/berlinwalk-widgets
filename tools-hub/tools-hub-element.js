const BW_TOOLS_HUB_DATA_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/tools-hub/data.json';

class BWToolsHubElement extends HTMLElement {
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
        bw-tools-hub {
          display: block;
          width: 100%;
        }

        .bw-tools-hub {
          --serif: Merriweather, Georgia, serif;
          background: #FAFAF5;
          color: #212121;
          font-family: Montserrat, Arial, sans-serif;
          margin: 0;
          max-width: 100%;
          overflow-x: hidden;
        }

        .bw-tools-hub *,
        .bw-tools-hub *::before,
        .bw-tools-hub *::after {
          box-sizing: border-box;
        }

        .bw-tools-hub .bw-hub-hero {
          background: #1B5E20;
          color: #FFFFFF;
          padding: 56px 28px 46px;
          position: relative;
          text-align: center;
        }

        .bw-tools-hub .bw-hub-hero::after,
        .bw-tools-hub .bw-hub-footer::before,
        .bw-tools-hub .bw-hub-footer::after {
          background: linear-gradient(90deg, #FFE600, #7CB342);
          content: "";
          display: block;
          height: 4px;
          left: 0;
          position: absolute;
          width: 100%;
        }

        .bw-tools-hub .bw-hub-hero::after {
          bottom: 0;
        }

        .bw-tools-hub .bw-hub-hero-inner,
        .bw-tools-hub .bw-hub-main {
          margin: 0 auto;
          max-width: 1120px;
        }

        .bw-tools-hub h1,
        .bw-tools-hub h2,
        .bw-tools-hub h3,
        .bw-tools-hub p {
          margin-top: 0;
        }

        .bw-tools-hub h1 {
          color: #FFFFFF;
          font-size: 36px;
          font-weight: 800;
          line-height: 1.14;
          margin-bottom: 14px;
          text-wrap: balance;
        }

        .bw-tools-hub .bw-highlight {
          color: #FFE600;
        }

        .bw-tools-hub .bw-hero-lead {
          color: rgba(255, 255, 255, 0.9);
          font-family: var(--serif);
          font-size: 17px;
          line-height: 1.6;
          margin: 0 auto;
          max-width: 680px;
        }

        .bw-tools-hub .bw-hub-main {
          padding: 44px 24px 48px;
        }

        .bw-tools-hub .bw-embed-cta {
          align-items: center;
          background: #FFFFFF;
          border: 1px solid #C5E1A5;
          border-left: 5px solid #1B5E20;
          border-radius: 12px;
          box-shadow: 0 10px 24px rgba(27, 94, 32, 0.08);
          display: flex;
          gap: 22px;
          justify-content: space-between;
          margin: 44px 0 0;
          padding: 22px 24px;
        }

        .bw-tools-hub .bw-embed-cta h2 {
          color: #1B5E20;
          font-size: 21px;
          font-weight: 800;
          line-height: 1.25;
          margin-bottom: 6px;
        }

        .bw-tools-hub .bw-embed-cta p {
          color: #4E5A4E;
          font-family: var(--serif);
          font-size: 15px;
          line-height: 1.55;
          margin-bottom: 0;
          max-width: 680px;
        }

        .bw-tools-hub .bw-btn-secondary {
          border: 2px solid #1B5E20;
          border-radius: 10px;
          color: #1B5E20;
          display: inline-block;
          flex: 0 0 auto;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.7px;
          padding: 12px 18px;
          text-decoration: none;
          text-transform: uppercase;
          transition: background 160ms ease, color 160ms ease, transform 160ms ease;
        }

        .bw-tools-hub .bw-btn-secondary:hover,
        .bw-tools-hub .bw-btn-secondary:focus-visible {
          background: #1B5E20;
          color: #FFFFFF;
          transform: translateY(-1px);
        }

        .bw-tools-hub .bw-category-section {
          margin-bottom: 42px;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 400ms ease-out, transform 400ms ease-out;
        }

        .bw-tools-hub .bw-category-section.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .bw-tools-hub .bw-category-section:last-child {
          margin-bottom: 0;
        }

        .bw-tools-hub .bw-category-banner {
          aspect-ratio: 4 / 1;
          background: #F5FAEC;
          border: 1px solid rgba(27, 94, 32, 0.14);
          border-radius: 8px;
          display: block;
          margin-bottom: 18px;
          overflow: hidden;
          width: 100%;
        }

        .bw-tools-hub .bw-category-banner img {
          display: block;
          height: 100%;
          object-fit: cover;
          width: 100%;
        }

        .bw-tools-hub .bw-category-heading {
          align-items: center;
          color: #1B5E20;
          display: flex;
          font-size: 28px;
          font-weight: 800;
          gap: 10px;
          line-height: 1.2;
          margin-bottom: 8px;
        }

        .bw-tools-hub .bw-category-icon {
          font-size: 32px;
          line-height: 1;
        }

        .bw-tools-hub .bw-category-blurb {
          color: #4E5A4E;
          font-family: var(--serif);
          font-size: 15.5px;
          line-height: 1.6;
          margin-bottom: 18px;
          max-width: 600px;
        }

        .bw-tools-hub .bw-tools-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .bw-tools-hub .bw-tool-card {
          background: #FFFFFF;
          border: 1px solid #C5E1A5;
          border-radius: 12px;
          color: inherit;
          display: flex;
          flex-direction: column;
          min-height: 190px;
          min-width: 0;
          padding: 22px 24px;
          text-decoration: none;
          transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
        }

        .bw-tools-hub .bw-tool-card:hover,
        .bw-tools-hub .bw-tool-card:focus-visible {
          border-color: #1B5E20;
          box-shadow: 0 10px 24px rgba(27, 94, 32, 0.12);
          transform: translateY(-2px);
        }

        .bw-tools-hub .bw-tool-card:focus-visible {
          outline: 3px solid rgba(255, 230, 0, 0.9);
          outline-offset: 2px;
        }

        .bw-tools-hub .bw-tool-card h3 {
          color: #1B5E20;
          font-size: 19px;
          font-weight: 800;
          line-height: 1.25;
          margin-bottom: 0;
          min-width: 0;
          overflow-wrap: break-word;
        }

        .bw-tools-hub .bw-tool-card-head {
          align-items: flex-start;
          display: flex;
          gap: 14px;
          margin-bottom: 12px;
          min-height: 66px;
        }

        .bw-tools-hub .bw-tool-icon {
          align-items: center;
          background: #F5FAEC;
          border: 1px solid rgba(27, 94, 32, 0.14);
          border-radius: 12px;
          display: flex;
          flex: 0 0 64px;
          height: 64px;
          justify-content: center;
          overflow: hidden;
          width: 64px;
        }

        .bw-tools-hub .bw-tool-icon img {
          display: block;
          height: 64px;
          object-fit: cover;
          width: 64px;
        }

        .bw-tools-hub .bw-tool-icon-fallback {
          background: linear-gradient(135deg, #FFE600, #7CB342);
          color: #1B5E20;
          font-size: 24px;
          font-weight: 900;
        }

        .bw-tools-hub .bw-tool-card p {
          color: #212121;
          font-family: var(--serif);
          font-size: 14.5px;
          line-height: 1.5;
          margin-bottom: 18px;
          overflow-wrap: break-word;
        }

        .bw-tools-hub .bw-tool-cta {
          color: #1B5E20;
          display: inline-block;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.8px;
          margin-top: auto;
          text-transform: uppercase;
        }

        .bw-tools-hub .bw-hub-footer {
          background: #1B5E20;
          color: #FFFFFF;
          margin: 0 auto;
          overflow: hidden;
          padding: 38px 24px 42px;
          position: relative;
          text-align: center;
        }

        .bw-tools-hub .bw-hub-footer::before {
          top: 0;
        }

        .bw-tools-hub .bw-hub-footer::after {
          bottom: 0;
        }

        .bw-tools-hub .bw-hub-footer h2 {
          color: #FFFFFF;
          font-size: 28px;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 10px;
        }

        .bw-tools-hub .bw-hub-footer p {
          color: rgba(255, 255, 255, 0.88);
          font-family: var(--serif);
          font-size: 15px;
          line-height: 1.6;
          margin: 0 auto 20px;
          max-width: 660px;
        }

        .bw-tools-hub .bw-btn-primary {
          background: #FFE600;
          border-radius: 10px;
          color: #1B5E20;
          display: inline-block;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.6px;
          padding: 14px 24px;
          text-decoration: none;
          transition: background 160ms ease, transform 160ms ease;
        }

        .bw-tools-hub .bw-btn-primary:hover,
        .bw-tools-hub .bw-btn-primary:focus-visible {
          background: #fff04a;
          transform: translateY(-1px);
        }

        .bw-tools-hub .bw-btn-primary:focus-visible {
          outline: 3px solid rgba(255, 255, 255, 0.9);
          outline-offset: 3px;
        }

        .bw-tools-hub .bw-btn-secondary:focus-visible {
          outline: 3px solid rgba(255, 230, 0, 0.9);
          outline-offset: 3px;
        }

        .bw-tools-hub .bw-tools-error {
          color: #4E5A4E;
          font-family: var(--serif);
          font-size: 16px;
          padding: 12px 0;
          text-align: center;
        }

        .bw-tools-hub .bw-skeleton-section {
          margin-bottom: 42px;
        }

        .bw-tools-hub .bw-skeleton-heading,
        .bw-tools-hub .bw-skeleton-line,
        .bw-tools-hub .bw-skeleton-card {
          animation: bw-tools-hub-shimmer 1200ms linear infinite;
          background: linear-gradient(90deg, #F2F8E8 0%, #FFFFFF 45%, #F2F8E8 90%);
          background-size: 220% 100%;
          border-radius: 999px;
        }

        .bw-tools-hub .bw-skeleton-heading {
          display: block;
          height: 28px;
          margin-bottom: 12px;
          max-width: 280px;
        }

        .bw-tools-hub .bw-skeleton-line {
          display: block;
          height: 14px;
          margin-bottom: 18px;
          max-width: 520px;
        }

        .bw-tools-hub .bw-skeleton-card {
          border-radius: 12px;
          height: 190px;
        }

        @keyframes bw-tools-hub-shimmer {
          from { background-position: 120% 0; }
          to { background-position: -120% 0; }
        }

        @media (max-width: 1024px) {
          .bw-tools-hub .bw-tools-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .bw-tools-hub .bw-tools-grid {
            grid-template-columns: 1fr;
          }

          .bw-tools-hub .bw-embed-cta {
            align-items: flex-start;
            flex-direction: column;
          }

          .bw-tools-hub .bw-tool-card {
            min-height: 0;
          }
        }

        @media (max-width: 520px) {
          .bw-tools-hub .bw-hub-hero {
            padding: 40px 18px 34px;
          }

          .bw-tools-hub h1 {
            font-size: 26px;
          }

          .bw-tools-hub .bw-hero-lead {
            font-size: 15px;
          }

          .bw-tools-hub .bw-hub-main {
            padding: 32px 16px 36px;
          }

          .bw-tools-hub .bw-category-section {
            margin-bottom: 34px;
          }

          .bw-tools-hub .bw-category-banner {
            border-radius: 6px;
            margin-bottom: 14px;
          }

          .bw-tools-hub .bw-category-heading {
            font-size: 22px;
          }

          .bw-tools-hub .bw-category-icon {
            font-size: 28px;
          }

          .bw-tools-hub .bw-category-blurb {
            font-size: 14.5px;
          }

          .bw-tools-hub .bw-tool-card {
            padding: 16px;
          }

          .bw-tools-hub .bw-tool-card h3 {
            font-size: 18px;
          }

          .bw-tools-hub .bw-tool-card-head {
            gap: 12px;
            min-height: 58px;
          }

          .bw-tools-hub .bw-tool-icon {
            border-radius: 10px;
            flex-basis: 56px;
            height: 56px;
            width: 56px;
          }

          .bw-tools-hub .bw-tool-icon img {
            height: 56px;
            width: 56px;
          }

          .bw-tools-hub .bw-hub-footer {
            padding: 32px 18px 36px;
          }

          .bw-tools-hub .bw-hub-footer h2 {
            font-size: 23px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bw-tools-hub .bw-category-section,
          .bw-tools-hub .bw-tool-card,
          .bw-tools-hub .bw-btn-primary,
          .bw-tools-hub .bw-skeleton-heading,
          .bw-tools-hub .bw-skeleton-line,
          .bw-tools-hub .bw-skeleton-card {
            animation: none;
            transition: none;
            transform: none;
          }

          .bw-tools-hub .bw-category-section {
            opacity: 1;
          }
        }
      </style>

      <section class="bw-tools-hub">
        <div class="bw-hub-hero" aria-labelledby="bw-tools-hub-title">
          <div class="bw-hub-hero-inner">
            <h1 id="bw-tools-hub-title">Plan your Berlin visit with <span class="bw-highlight">free local tools</span></h1>
            <p class="bw-hero-lead">Quick calculators, maps, and planning guides to help you choose tickets, time your visit, and make better Berlin decisions in seconds.</p>
          </div>
        </div>

        <main class="bw-hub-main">
          <div class="bw-tools-root" aria-live="polite">
            ${this._renderSkeleton()}
          </div>

          <section class="bw-embed-cta" aria-labelledby="bw-embed-tools-title">
            <div>
              <h2 id="bw-embed-tools-title">Have a travel site or hotel website?</h2>
              <p>Embed these Berlin planning tools for free, with auto-height snippets built for WordPress, Squarespace, Wix, hotel sites, and travel blogs.</p>
            </div>
            <a href="https://www.berlinwalk.com/widgets" class="bw-btn-secondary">Embed these tools</a>
          </section>
        </main>

        <div class="bw-hub-footer">
          <h2>Want a real local with you?</h2>
          <p>Our 2-hour walking tour covers Berlin's historic center and East Berlin stories. Tip-based, no fixed price.</p>
          <a href="https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based" class="bw-btn-primary">Reserve your spot</a>
        </div>
      </section>
    `;
  }

  _renderSkeleton() {
    return Array.from({ length: 4 }).map(() => `
      <section class="bw-skeleton-section" aria-hidden="true">
        <span class="bw-skeleton-heading"></span>
        <span class="bw-skeleton-line"></span>
        <div class="bw-tools-grid">
          <span class="bw-skeleton-card"></span>
          <span class="bw-skeleton-card"></span>
          <span class="bw-skeleton-card"></span>
        </div>
      </section>
    `).join('');
  }

  async _loadDataAndRender() {
    try {
      const response = await fetch(BW_TOOLS_HUB_DATA_URL);
      if (!response.ok) throw new Error('Could not load tools');
      const data = await response.json();
      this._renderHub(data);
      this._setupAnimations();
    } catch (error) {
      this._renderError();
    }
  }

  _renderHub(data) {
    const root = this.querySelector('.bw-tools-root');
    const categories = data && Array.isArray(data.categories) ? data.categories : [];
    const tools = data && Array.isArray(data.tools)
      ? data.tools.filter(tool => this._isVisibleTool(tool))
      : [];
    if (!root || !categories.length || !tools.length) {
      this._renderError();
      return;
    }

    root.removeAttribute('aria-live');
    root.innerHTML = categories.map(category => this._renderCategory(category, tools)).join('');
  }

  _renderCategory(category, tools) {
    const categoryTools = tools.filter(tool => tool.category === category.key);
    const id = `bw-category-${String(category.key || '').toLowerCase()}`;
    if (!categoryTools.length) return '';

    return `
      <section class="bw-category-section" aria-labelledby="${this._escapeAttribute(id)}">
        ${this._renderCategoryBanner(category)}
        <h2 class="bw-category-heading" id="${this._escapeAttribute(id)}">
          <span class="bw-category-icon" aria-hidden="true">${this._escapeHtml(category.icon || '')}</span>
          ${this._escapeHtml(category.label || '')}
        </h2>
        <p class="bw-category-blurb">${this._escapeHtml(category.blurb || '')}</p>
        <div class="bw-tools-grid">
          ${categoryTools.map(tool => this._renderTool(tool)).join('')}
        </div>
      </section>
    `;
  }

  _renderCategoryBanner(category) {
    const source = category && category.bannerImage ? this._resolveAssetUrl(category.bannerImage) : '';
    const fallback = category && (category.bannerFallbackImage || category.bannerImage)
      ? this._resolveAssetUrl(category.bannerFallbackImage || category.bannerImage)
      : '';
    if (!source && !fallback) return '';

    return `
      <picture class="bw-category-banner">
        ${source ? `<source srcset="${this._escapeAttribute(source)}" type="image/webp">` : ''}
        <img src="${this._escapeAttribute(fallback || source)}" alt="${this._escapeAttribute(category.bannerAlt || '')}" loading="eager" decoding="async">
      </picture>
    `;
  }

  _renderTool(tool) {
    return `
      <a class="bw-tool-card" href="https://www.berlinwalk.com/tools/${this._escapeAttribute(tool.slug || '')}">
        <div class="bw-tool-card-head">
          ${this._renderToolIcon(tool)}
          <h3>${this._escapeHtml(tool.title || '')}</h3>
        </div>
        <p>${this._escapeHtml(tool.lead || '')}</p>
        <span class="bw-tool-cta">Open tool</span>
      </a>
    `;
  }

  _renderToolIcon(tool) {
    if (tool && tool.image) {
      return `
        <span class="bw-tool-icon" aria-hidden="true">
          <img src="${this._escapeAttribute(tool.image)}" alt="" loading="lazy" decoding="async">
        </span>
      `;
    }

    const title = String((tool && tool.title) || '?').trim();
    const letter = title ? title.charAt(0).toUpperCase() : '?';
    return `<span class="bw-tool-icon bw-tool-icon-fallback" aria-hidden="true">${this._escapeHtml(letter)}</span>`;
  }

  _resolveAssetUrl(value) {
    if (!value) return '';
    try {
      return new URL(value, BW_TOOLS_HUB_DATA_URL).href;
    } catch (error) {
      return value;
    }
  }

  _isVisibleTool(tool) {
    if (!tool || !tool.widgetUrl) return false;
    const status = String(tool.status || '').toLowerCase();
    return tool.hidden !== true && tool.published !== false && status !== 'draft';
  }

  _setupAnimations() {
    const sections = Array.from(this.querySelectorAll('.bw-category-section'));
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      this._animated = true;
      sections.forEach(section => section.classList.add('visible'));
      return;
    }

    this._observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        this._observer.unobserve(entry.target);
      });
    }, { threshold: 0.3 });

    sections.forEach((section, index) => {
      section.style.transitionDelay = `${index * 80}ms`;
      this._observer.observe(section);
    });
  }

  _renderError() {
    const root = this.querySelector('.bw-tools-root');
    if (!root) return;
    root.setAttribute('aria-live', 'polite');
    root.innerHTML = `<p class="bw-tools-error">Tools temporarily unavailable</p>`;
  }

  _escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  _escapeAttribute(value) {
    return this._escapeHtml(value).replace(/'/g, '&#39;');
  }
}

if (!customElements.get('bw-tools-hub')) {
  customElements.define('bw-tools-hub', BWToolsHubElement);
}
