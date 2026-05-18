/* widgets-hub-element.js — <bw-widgets-hub> Custom Element.
 *
 * Renders the third-party widget embed gallery directly into the parent page's
 * light DOM (no Shadow DOM, no iframe) so Google indexes every widget title,
 * description, deep link, and backlink as native page content. Mirrors the
 * <bw-tools-hub> pattern used at /berlin-tools.
 *
 * Usage on the Wix /widgets page:
 *   <bw-widgets-hub></bw-widgets-hub>
 *   <script src="https://fenerszymanski.github.io/berlinwalk-widgets/widgets-hub/widgets-hub-element.js"></script>
 *
 * The element fetches tools-hub/data.json (single source of truth: any tool
 * added there appears here automatically), loads embed-resize.js for the
 * preview iframes' auto-height, and offers Standard / Light / Dark themes
 * in the per-widget embed snippet panel.
 */

const BW_WIDGETS_HUB_DATA_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/tools-hub/data.json';
const BW_EMBED_RESIZE_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/embed-resize.js';

const BW_WIDGETS_THEMES = {
  standard: {
    label: 'Standard',
    desc: 'Brand green on transparent. Sits on the host site background.',
    aside: '',
    headingColor: '#1B5E20',
    textColor: '#212121',
    linkColor: '#1B5E20',
    footerStrong: '#1B5E20',
    footerArrow: '#1B5E20',
    swatchBg: '#1B5E20',
    swatchBorder: '#1B5E20'
  },
  light: {
    label: 'Light',
    desc: 'Brand cream card. Green heading, yellow accents.',
    aside: 'background:#FAFAF5; border:1px solid #DCE8C8; border-left:4px solid #FFE600; padding:18px 20px 14px; border-radius:10px;',
    headingColor: '#1B5E20',
    textColor: '#212121',
    linkColor: '#1B5E20',
    footerStrong: '#1B5E20',
    footerArrow: '#C9A500',
    swatchBg: '#FAFAF5',
    swatchBorder: '#FFE600'
  },
  dark: {
    label: 'Dark',
    desc: 'Brand black card. White heading, yellow accents.',
    aside: 'background:#212121; padding:20px 20px 16px; border-radius:10px; color:#FAFAF5;',
    headingColor: '#FFFFFF',
    textColor: '#EFEFEF',
    linkColor: '#FFE600',
    footerStrong: '#FFE600',
    footerArrow: '#FFE600',
    swatchBg: '#212121',
    swatchBorder: '#FFE600'
  }
};

class BWWidgetsHubElement extends HTMLElement {
  constructor() {
    super();
    this._observer = null;
  }

  connectedCallback() {
    this._renderShell();
    this._loadResizeScript();
    this._loadDataAndRender();
    this._bindGlobalHandlers();
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  _loadResizeScript() {
    if (document.querySelector('script[data-bw-embed-resize]')) return;
    const s = document.createElement('script');
    s.src = BW_EMBED_RESIZE_URL;
    s.async = true;
    s.setAttribute('data-bw-embed-resize', '');
    document.head.appendChild(s);
  }

  _renderShell() {
    this.innerHTML = `
      <style>
        bw-widgets-hub {
          display: block;
          width: 100%;
        }

        .bw-widgets-hub {
          --serif: Merriweather, Georgia, serif;
          background: #FAFAF5;
          color: #212121;
          font-family: Montserrat, Arial, sans-serif;
          margin: 0;
          max-width: 100%;
          overflow-x: hidden;
        }

        .bw-widgets-hub *,
        .bw-widgets-hub *::before,
        .bw-widgets-hub *::after {
          box-sizing: border-box;
        }

        .bw-widgets-hub .bw-hub-hero {
          background: #1B5E20;
          color: #FFFFFF;
          padding: 56px 28px 46px;
          position: relative;
          text-align: center;
        }

        .bw-widgets-hub .bw-hub-hero::after,
        .bw-widgets-hub .bw-hub-footer::before,
        .bw-widgets-hub .bw-hub-footer::after {
          background: linear-gradient(90deg, #FFE600, #7CB342);
          content: "";
          display: block;
          height: 4px;
          left: 0;
          position: absolute;
          width: 100%;
        }

        .bw-widgets-hub .bw-hub-hero::after { bottom: 0; }

        .bw-widgets-hub .bw-hub-hero-inner,
        .bw-widgets-hub .bw-hub-main { margin: 0 auto; max-width: 980px; }

        .bw-widgets-hub h1,
        .bw-widgets-hub h2,
        .bw-widgets-hub h3,
        .bw-widgets-hub p { margin-top: 0; }

        .bw-widgets-hub h1 {
          color: #FFFFFF;
          font-size: 36px;
          font-weight: 800;
          line-height: 1.14;
          margin-bottom: 14px;
        }

        .bw-widgets-hub .bw-highlight { color: #FFE600; }

        .bw-widgets-hub .bw-hero-lead {
          color: rgba(255, 255, 255, 0.92);
          font-family: var(--serif);
          font-size: 17px;
          line-height: 1.6;
          margin: 0 auto 18px;
          max-width: 680px;
        }

        .bw-widgets-hub .bw-hero-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
        }

        .bw-widgets-hub .bw-hero-tag {
          background: rgba(255, 230, 0, 0.16);
          border: 1px solid rgba(255, 230, 0, 0.45);
          border-radius: 22px;
          color: #FFE600;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.2px;
          padding: 7px 12px;
          text-transform: uppercase;
        }

        .bw-widgets-hub .bw-hub-main { padding: 36px 24px 48px; }

        .bw-widgets-hub .bw-terms-card {
          background: #FFFFFF;
          border: 1px solid #C5E1A5;
          border-left: 4px solid #1B5E20;
          border-radius: 10px;
          color: #212121;
          font-size: 14.5px;
          line-height: 1.6;
          margin: 0 0 24px;
          padding: 18px 22px;
        }

        .bw-widgets-hub .bw-terms-card strong { color: #1B5E20; }

        .bw-widgets-hub .bw-terms-card ul {
          list-style: none;
          margin: 12px 0 0;
          padding: 0;
        }

        .bw-widgets-hub .bw-terms-card li {
          padding: 4px 0 4px 22px;
          position: relative;
        }

        .bw-widgets-hub .bw-terms-card li::before {
          color: #1B5E20;
          content: "\\2713";
          font-weight: 900;
          left: 0;
          position: absolute;
        }

        .bw-widgets-hub .bw-category-nav {
          background: #FFFFFF;
          border: 1px solid #C5E1A5;
          border-radius: 12px;
          padding: 12px 14px;
          margin: 0 0 28px;
          position: sticky;
          top: 0;
          z-index: 5;
          box-shadow: 0 4px 12px rgba(27, 94, 32, 0.06);
        }

        .bw-widgets-hub .bw-category-nav-inner {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
        }

        .bw-widgets-hub .bw-category-nav-label {
          color: #4E5A4E;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.1px;
          margin-right: 4px;
          text-transform: uppercase;
        }

        .bw-widgets-hub .bw-category-pill {
          align-items: center;
          background: #FAFAF5;
          border: 1px solid #C5E1A5;
          border-radius: 22px;
          color: #1B5E20;
          cursor: pointer;
          display: inline-flex;
          font-family: inherit;
          font-size: 12px;
          font-weight: 800;
          gap: 6px;
          letter-spacing: 0.5px;
          padding: 8px 14px;
          text-decoration: none;
          transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
        }

        .bw-widgets-hub .bw-category-pill:hover,
        .bw-widgets-hub .bw-category-pill:focus-visible {
          background: #1B5E20;
          color: #FFE600;
          border-color: #1B5E20;
          outline: none;
        }

        .bw-widgets-hub .bw-category-pill .bw-count {
          background: #FFE600;
          border-radius: 12px;
          color: #1B5E20;
          font-size: 10px;
          font-weight: 900;
          padding: 2px 7px;
          line-height: 1;
        }

        .bw-widgets-hub .bw-tools-root {
          min-height: 200px;
        }

        .bw-widgets-hub .bw-category-section { margin-bottom: 44px; }
        .bw-widgets-hub .bw-category-section:last-child { margin-bottom: 0; }

        .bw-widgets-hub .bw-category-heading {
          align-items: center;
          color: #1B5E20;
          display: flex;
          font-size: 26px;
          font-weight: 800;
          gap: 10px;
          line-height: 1.2;
          margin-bottom: 8px;
          scroll-margin-top: 80px;
        }

        .bw-widgets-hub .bw-category-icon {
          font-size: 30px;
          line-height: 1;
        }

        .bw-widgets-hub .bw-category-blurb {
          color: #4E5A4E;
          font-family: var(--serif);
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 22px;
          max-width: 640px;
        }

        .bw-widgets-hub .bw-widget-card {
          background: #FFFFFF;
          border: 1px solid #C5E1A5;
          border-radius: 14px;
          margin: 0 0 22px;
          overflow: hidden;
          transition: border-color 0.16s ease;
        }

        .bw-widgets-hub .bw-widget-card:hover { border-color: #1B5E20; }

        .bw-widgets-hub .bw-widget-head { padding: 20px 22px 16px; }

        .bw-widgets-hub .bw-widget-head-row {
          align-items: baseline;
          display: flex;
          gap: 14px;
          justify-content: space-between;
          flex-wrap: wrap;
        }

        .bw-widgets-hub .bw-widget-title {
          color: #1B5E20;
          font-size: 20px;
          font-weight: 800;
          line-height: 1.25;
          margin: 0 0 6px;
        }

        .bw-widgets-hub .bw-widget-meta {
          color: #4E5A4E;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.1px;
          margin-top: 2px;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .bw-widgets-hub .bw-widget-lead {
          color: #212121;
          font-family: var(--serif);
          font-size: 14.5px;
          line-height: 1.55;
          margin: 0;
        }

        .bw-widgets-hub .bw-preview-hint {
          background: rgba(27, 94, 32, 0.04);
          border-top: 1px solid #C5E1A5;
          border-bottom: 1px solid #C5E1A5;
          color: #4E5A4E;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.6px;
          padding: 8px 22px;
          text-transform: uppercase;
        }

        .bw-widgets-hub .bw-preview-frame {
          background: #FAFAF5;
          border-bottom: 1px solid #C5E1A5;
        }

        .bw-widgets-hub .bw-preview-frame iframe {
          background: transparent;
          border: 0;
          display: block;
          width: 100%;
        }

        .bw-widgets-hub .bw-widget-actions {
          align-items: center;
          background: #FFFFFF;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: space-between;
          padding: 14px 22px;
        }

        .bw-widgets-hub .bw-embed-toggle {
          align-items: center;
          background: #1B5E20;
          border: 0;
          border-radius: 8px;
          color: #FFE600;
          cursor: pointer;
          display: inline-flex;
          font-family: inherit;
          font-size: 12px;
          font-weight: 800;
          gap: 8px;
          letter-spacing: 0.8px;
          padding: 11px 16px;
          text-transform: uppercase;
          transition: background 0.16s ease;
        }

        .bw-widgets-hub .bw-embed-toggle:hover,
        .bw-widgets-hub .bw-embed-toggle:focus-visible {
          background: #164a1a;
          outline: none;
        }

        .bw-widgets-hub .bw-open-link {
          color: #1B5E20;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.8px;
          text-decoration: none;
          text-transform: uppercase;
        }

        .bw-widgets-hub .bw-open-link:hover { text-decoration: underline; }

        .bw-widgets-hub .bw-embed-panel {
          border-top: 1px solid #C5E1A5;
          background: #FAFAF5;
          padding: 16px 22px 18px;
        }

        .bw-widgets-hub .bw-embed-panel[hidden] { display: none; }

        .bw-widgets-hub .bw-embed-info {
          color: #4E5A4E;
          font-size: 12.5px;
          line-height: 1.5;
          margin: 0 0 12px;
        }

        .bw-widgets-hub .bw-embed-row {
          align-items: center;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }

        .bw-widgets-hub .bw-embed-row > label {
          color: #4E5A4E;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }

        .bw-widgets-hub .bw-theme-pills {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .bw-widgets-hub .bw-theme-pill {
          align-items: center;
          background: #FFFFFF;
          border: 1px solid #C5E1A5;
          border-radius: 22px;
          color: #212121;
          cursor: pointer;
          display: inline-flex;
          font-family: inherit;
          font-size: 12px;
          font-weight: 700;
          gap: 7px;
          letter-spacing: 0.3px;
          padding: 6px 12px 6px 6px;
          transition: border-color .15s ease, background .15s ease, color .15s ease;
        }

        .bw-widgets-hub .bw-theme-pill:hover { border-color: #1B5E20; }

        .bw-widgets-hub .bw-theme-pill.is-active {
          background: #1B5E20;
          border-color: #1B5E20;
          color: #FFE600;
        }

        .bw-widgets-hub .bw-theme-pill.is-active .bw-theme-swatch {
          border-color: #FFE600;
        }

        .bw-widgets-hub .bw-theme-swatch {
          border: 1px solid rgba(0, 0, 0, 0.18);
          border-radius: 50%;
          display: inline-block;
          flex: 0 0 18px;
          height: 18px;
          width: 18px;
        }

        .bw-widgets-hub .bw-embed-code {
          background: #FFFFFF;
          border: 1px solid #C5E1A5;
          border-radius: 8px;
          color: #212121;
          font-family: ui-monospace, "SFMono-Regular", "Menlo", "Consolas", monospace;
          font-size: 12.5px;
          line-height: 1.55;
          padding: 12px 14px;
          resize: vertical;
          width: 100%;
          min-height: 96px;
        }

        .bw-widgets-hub .bw-embed-actions {
          align-items: center;
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .bw-widgets-hub .bw-copy-btn {
          background: #FFE600;
          border: 0;
          border-radius: 8px;
          color: #1B5E20;
          cursor: pointer;
          font-family: inherit;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.8px;
          padding: 11px 18px;
          text-transform: uppercase;
          transition: background 0.16s ease;
        }

        .bw-widgets-hub .bw-copy-btn:hover { background: #fff04a; }
        .bw-widgets-hub .bw-copy-btn.is-copied { background: #7CB342; color: #FFFFFF; }

        .bw-widgets-hub .bw-copy-feedback {
          color: #4E5A4E;
          font-size: 12px;
          min-height: 16px;
        }

        .bw-widgets-hub .bw-copy-feedback.ok { color: #1B5E20; font-weight: 700; }

        .bw-widgets-hub .bw-tools-error {
          color: #4E5A4E;
          font-family: var(--serif);
          font-size: 15px;
          padding: 12px 0;
          text-align: center;
        }

        .bw-widgets-hub .bw-hub-footer {
          background: #1B5E20;
          color: #FFFFFF;
          margin: 0 auto;
          overflow: hidden;
          padding: 38px 24px 42px;
          position: relative;
          text-align: center;
        }

        .bw-widgets-hub .bw-hub-footer::before { top: 0; }
        .bw-widgets-hub .bw-hub-footer::after { bottom: 0; }

        .bw-widgets-hub .bw-hub-footer h2 {
          color: #FFFFFF;
          font-size: 26px;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 10px;
        }

        .bw-widgets-hub .bw-hub-footer p {
          color: rgba(255, 255, 255, 0.88);
          font-family: var(--serif);
          font-size: 15px;
          line-height: 1.6;
          margin: 0 auto 20px;
          max-width: 640px;
        }

        .bw-widgets-hub .bw-btn-primary {
          background: #FFE600;
          border-radius: 10px;
          color: #1B5E20;
          display: inline-block;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.6px;
          padding: 14px 24px;
          text-decoration: none;
        }

        .bw-widgets-hub .bw-btn-primary:hover { background: #fff04a; }

        @media (max-width: 700px) {
          .bw-widgets-hub h1 { font-size: 28px; }
          .bw-widgets-hub .bw-hero-lead { font-size: 15px; }
          .bw-widgets-hub .bw-hub-main { padding: 28px 16px 36px; }
          .bw-widgets-hub .bw-terms-card { padding: 16px 18px; font-size: 14px; }
          .bw-widgets-hub .bw-category-heading { font-size: 22px; }
          .bw-widgets-hub .bw-category-icon { font-size: 26px; }
          .bw-widgets-hub .bw-widget-head { padding: 16px 18px 12px; }
          .bw-widgets-hub .bw-widget-actions { padding: 12px 18px; }
          .bw-widgets-hub .bw-embed-panel { padding: 14px 18px; }
          .bw-widgets-hub .bw-preview-hint { padding: 8px 18px; }
        }
      </style>

      <section class="bw-widgets-hub">
        <div class="bw-hub-hero" aria-labelledby="bw-widgets-hub-title">
          <div class="bw-hub-hero-inner">
            <h1 id="bw-widgets-hub-title">Embed free Berlin planning tools <span class="bw-highlight">on your site</span></h1>
            <p class="bw-hero-lead">Interactive Berlin calculators, maps, and planning widgets built by a local guide. Copy one snippet and use them on WordPress, Squarespace, Wix, hotel sites, travel blogs, anywhere.</p>
            <div class="bw-hero-tags">
              <span class="bw-hero-tag">No signup</span>
              <span class="bw-hero-tag">No tracking</span>
              <span class="bw-hero-tag">Mobile friendly</span>
              <span class="bw-hero-tag">Auto-height</span>
            </div>
          </div>
        </div>

        <main class="bw-hub-main">
          <div class="bw-terms-card">
            <strong>How it works:</strong> open a tool, pick a theme, click "Show embed code", copy the snippet, paste into your site's HTML or a custom HTML block.
            <ul>
              <li>Free for any use, including commercial sites and hotels.</li>
              <li>The "by berlinwalk.com" badge at the bottom of each widget must stay visible.</li>
              <li>Widgets update automatically: data, design, mobile fixes. Your embed always loads the latest version.</li>
              <li>Auto-resize to content height, lazy-loaded. No impact on your page speed score.</li>
            </ul>
          </div>

          <div class="bw-tools-root" aria-live="polite">Loading widgets...</div>
        </main>

        <div class="bw-hub-footer">
          <h2>Walk Berlin with a real local</h2>
          <p>If you are visiting Berlin, the widgets are nice. The walking tour is the real thing. Tip-based, 2 hours, from Alexanderplatz, every morning.</p>
          <a href="https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based" class="bw-btn-primary">Reserve your spot</a>
        </div>
      </section>
    `;
  }

  async _loadDataAndRender() {
    try {
      const response = await fetch(BW_WIDGETS_HUB_DATA_URL);
      if (!response.ok) throw new Error('Could not load widgets');
      const data = await response.json();
      this._renderHub(data);
    } catch (error) {
      this._renderError();
    }
  }

  _renderHub(data) {
    const root = this.querySelector('.bw-tools-root');
    const categories = data && Array.isArray(data.categories) ? data.categories : [];
    const tools = data && Array.isArray(data.tools) ? data.tools : [];
    if (!root || !categories.length || !tools.length) {
      this._renderError();
      return;
    }
    root.removeAttribute('aria-live');

    const nav = this._renderCategoryNav(categories, tools);
    const sections = categories
      .map(category => this._renderCategory(category, tools))
      .filter(Boolean)
      .join('');
    root.innerHTML = nav + sections;
  }

  _renderCategoryNav(categories, tools) {
    const pills = categories
      .map(category => {
        const count = tools.filter(t => t.category === category.key && t.widgetUrl).length;
        if (!count) return '';
        const id = `bw-wcat-${String(category.key || '').toLowerCase()}`;
        return `
          <a class="bw-category-pill" href="#${this._escapeAttribute(id)}">
            <span aria-hidden="true">${this._escapeHtml(category.icon || '')}</span>
            ${this._escapeHtml(category.label || '')}
            <span class="bw-count" aria-label="${count} widgets">${count}</span>
          </a>`;
      })
      .join('');
    if (!pills.trim()) return '';
    return `
      <nav class="bw-category-nav" aria-label="Jump to widget category">
        <div class="bw-category-nav-inner">
          <span class="bw-category-nav-label">Jump to:</span>
          ${pills}
        </div>
      </nav>`;
  }

  _renderCategory(category, tools) {
    const categoryTools = tools.filter(t => t.category === category.key && t.widgetUrl);
    if (!categoryTools.length) return '';
    const id = `bw-wcat-${String(category.key || '').toLowerCase()}`;
    return `
      <section class="bw-category-section" id="${this._escapeAttribute(id)}" aria-labelledby="${this._escapeAttribute(id + '-h')}">
        <h2 class="bw-category-heading" id="${this._escapeAttribute(id + '-h')}">
          <span class="bw-category-icon" aria-hidden="true">${this._escapeHtml(category.icon || '')}</span>
          ${this._escapeHtml(category.label || '')} (${categoryTools.length})
        </h2>
        <p class="bw-category-blurb">${this._escapeHtml(category.blurb || '')}</p>
        ${categoryTools.map(tool => this._renderWidgetCard(tool)).join('')}
      </section>`;
  }

  _renderWidgetCard(tool) {
    const slug = this._escapeAttribute(tool.slug || '');
    const title = this._escapeHtml(tool.title || '');
    const lead = this._escapeHtml(tool.lead || '');
    const previewUrl = this._escapeAttribute(tool.widgetUrl + '?attribution=none');
    const standaloneUrl = this._escapeAttribute(tool.widgetUrl);
    const initialCode = this._escapeHtml(this._buildSnippet(tool, 'standard'));
    const themePills = Object.keys(BW_WIDGETS_THEMES)
      .map(key => {
        const theme = BW_WIDGETS_THEMES[key];
        const active = key === 'standard';
        return `
          <button class="bw-theme-pill${active ? ' is-active' : ''}" type="button" role="radio" aria-checked="${active}" data-theme="${this._escapeAttribute(key)}" data-slug="${slug}" title="${this._escapeAttribute(theme.desc)}">
            <span class="bw-theme-swatch" style="background:${theme.swatchBg}; border-color:${theme.swatchBorder};"></span>
            <span>${this._escapeHtml(theme.label)}</span>
          </button>`;
      })
      .join('');
    return `
      <article class="bw-widget-card" data-slug="${slug}">
        <div class="bw-widget-head">
          <div class="bw-widget-head-row">
            <div>
              <h3 class="bw-widget-title">${title}</h3>
              <p class="bw-widget-lead">${lead}</p>
            </div>
            <div class="bw-widget-meta">Auto-height · ${this._escapeHtml(tool.category || '')}</div>
          </div>
        </div>
        <div class="bw-preview-hint">Live preview</div>
        <div class="bw-preview-frame">
          <iframe data-bw-frame src="${previewUrl}" title="${title} live preview" loading="lazy" frameborder="0" scrolling="no" height="420" style="width:100%; border:0; transition:height .2s ease;"></iframe>
        </div>
        <div class="bw-widget-actions">
          <button class="bw-embed-toggle" type="button" data-toggle-slug="${slug}" aria-expanded="false">Show embed code</button>
          <a class="bw-open-link" href="${standaloneUrl}" target="_blank" rel="noopener">Open standalone &rarr;</a>
        </div>
        <div class="bw-embed-panel" hidden data-panel-slug="${slug}">
          <p class="bw-embed-info">Widget auto-resizes to fit its content on the host page. Pick a theme to match where you embed it.</p>
          <div class="bw-embed-row">
            <label>Theme</label>
            <div class="bw-theme-pills" role="radiogroup" aria-label="Embed theme">${themePills}</div>
          </div>
          <textarea class="bw-embed-code" readonly data-code-slug="${slug}">${initialCode}</textarea>
          <div class="bw-embed-actions">
            <button class="bw-copy-btn" type="button" data-copy-slug="${slug}">Copy code</button>
            <span class="bw-copy-feedback" data-feedback-slug="${slug}"></span>
          </div>
        </div>
      </article>`;
  }

  _buildSnippet(tool, themeKey) {
    const theme = BW_WIDGETS_THEMES[themeKey] || BW_WIDGETS_THEMES.standard;
    const safeTitle = this._escapeHtml(tool.title || tool.slug);
    const safeLead = this._escapeHtml(tool.lead || '');
    const deepLink = 'https://www.berlinwalk.com/tools/' + (tool.slug || '');
    const utmHome = 'https://www.berlinwalk.com/widgets?utm_source=embed&amp;utm_medium=textlink&amp;utm_campaign=' + (tool.slug || '');
    return `<!-- ${safeTitle} by BerlinWalk -->
<aside class="bw-embed" style="margin:1em 0; max-width:100%; font-family:Arial,Helvetica,sans-serif;${theme.aside ? ' ' + theme.aside : ''}">
  <h3 style="font:800 18px/1.3 Arial,sans-serif; color:${theme.headingColor}; margin:0 0 6px;">
    <a href="${this._escapeHtml(deepLink)}" rel="noopener" style="color:${theme.headingColor}; text-decoration:none;">${safeTitle}</a>
  </h3>
  <p style="font:14px/1.55 Arial,sans-serif; color:${theme.textColor}; margin:0 0 10px;">${safeLead}</p>
  <iframe data-bw-frame src="${tool.widgetUrl}"
    title="${safeTitle} by BerlinWalk"
    width="100%" height="480"
    frameborder="0" loading="lazy" scrolling="no"
    style="border:0; width:100%; max-width:100%; transition:height .2s ease;"></iframe>
  <p style="margin:8px 0 0; font:600 12px/1.4 Arial,sans-serif; text-align:center;">
    <a href="${utmHome}" rel="noopener" style="color:${theme.linkColor}; text-decoration:none;">
      Free Berlin widget by <strong style="color:${theme.footerStrong};">BerlinWalk</strong> <span style="color:${theme.footerArrow};">&rarr;</span>
    </a>
  </p>
</aside>
<script src="${BW_EMBED_RESIZE_URL}" async></` + `script>`;
  }

  _bindGlobalHandlers() {
    this.addEventListener('click', (ev) => {
      const toggle = ev.target.closest('[data-toggle-slug]');
      if (toggle) {
        const slug = toggle.getAttribute('data-toggle-slug');
        const panel = this.querySelector('[data-panel-slug="' + CSS.escape(slug) + '"]');
        if (!panel) return;
        const open = !panel.hidden;
        panel.hidden = open;
        toggle.setAttribute('aria-expanded', String(!open));
        toggle.textContent = open ? 'Show embed code' : 'Hide embed code';
        return;
      }

      const pill = ev.target.closest('.bw-theme-pill');
      if (pill && this.contains(pill)) {
        const slug = pill.getAttribute('data-slug');
        const key = pill.getAttribute('data-theme');
        if (!slug || !key) return;
        const group = pill.parentElement;
        group.querySelectorAll('.bw-theme-pill').forEach(p => {
          const active = p === pill;
          p.classList.toggle('is-active', active);
          p.setAttribute('aria-checked', String(active));
        });
        const tool = this._toolBySlug(slug);
        if (!tool) return;
        const code = this.querySelector('[data-code-slug="' + CSS.escape(slug) + '"]');
        if (code) code.value = this._buildSnippet(tool, key);
        const copyBtn = this.querySelector('[data-copy-slug="' + CSS.escape(slug) + '"]');
        if (copyBtn) {
          copyBtn.classList.remove('is-copied');
          copyBtn.textContent = 'Copy code';
        }
        const fb = this.querySelector('[data-feedback-slug="' + CSS.escape(slug) + '"]');
        if (fb) { fb.textContent = ''; fb.classList.remove('ok'); }
        return;
      }

      const copyBtn = ev.target.closest('[data-copy-slug]');
      if (copyBtn) {
        const slug = copyBtn.getAttribute('data-copy-slug');
        const code = this.querySelector('[data-code-slug="' + CSS.escape(slug) + '"]');
        const fb = this.querySelector('[data-feedback-slug="' + CSS.escape(slug) + '"]');
        if (!code) return;
        const done = () => {
          copyBtn.classList.add('is-copied');
          copyBtn.textContent = 'Copied ✓';
          if (fb) { fb.textContent = 'Iframe copied to clipboard'; fb.classList.add('ok'); }
          setTimeout(() => {
            copyBtn.classList.remove('is-copied');
            copyBtn.textContent = 'Copy code';
            if (fb) { fb.textContent = ''; fb.classList.remove('ok'); }
          }, 2400);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(code.value).then(done, () => this._fallbackCopy(code, done, fb));
        } else {
          this._fallbackCopy(code, done, fb);
        }
      }
    });
  }

  _fallbackCopy(code, done, fb) {
    try {
      code.select();
      document.execCommand('copy');
      done();
    } catch (e) {
      if (fb) fb.textContent = 'Press Cmd/Ctrl + C to copy.';
    }
  }

  _toolBySlug(slug) {
    if (!this._data) return null;
    return this._data.tools.find(t => t.slug === slug) || null;
  }

  _renderError() {
    const root = this.querySelector('.bw-tools-root');
    if (!root) return;
    root.setAttribute('aria-live', 'polite');
    root.innerHTML = '<p class="bw-tools-error">Widgets temporarily unavailable.</p>';
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

// Keep a reference to the loaded data on the element so click handlers can
// rebuild the snippet for the new theme without re-fetching.
const origRender = BWWidgetsHubElement.prototype._renderHub;
BWWidgetsHubElement.prototype._renderHub = function (data) {
  this._data = data;
  return origRender.call(this, data);
};

if (!customElements.get('bw-widgets-hub')) {
  customElements.define('bw-widgets-hub', BWWidgetsHubElement);
}
