const BW_TOOLS_HUB_DATA_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/tools-hub/data.json';
const BW_TOOLS_HUB_DATA_VERSION = '2026-06-29-museums-spotlight';
const BW_TOOLS_HUB_DEFAULT_IMAGE = 'https://fenerszymanski.github.io/berlinwalk-widgets/tools-home/icons/generic-tool.svg';
const BW_TOOLS_HUB_TYPE_ORDER = ['Planner', 'Calculator', 'Map', 'Guide', 'Audio', 'Quiz', 'Game'];

class BWToolsHubElement extends HTMLElement {
  constructor() {
    super();
    this._categories = [];
    this._tools = [];
    this._spotlightTool = null;
    this._query = '';
    this._activeCategory = '';
    this._activeType = '';
    this._bound = false;
    this._dataUrl = BW_TOOLS_HUB_DATA_URL;
  }

  connectedCallback() {
    this._dataUrl = this._versionDataUrl(this.getAttribute('data-url') || BW_TOOLS_HUB_DATA_URL);
    this._renderShell();
    this._bindHandlers();
    this._loadDataAndRender();
  }

  _versionDataUrl(url) {
    if (!url || url.includes('bwHubVersion=')) return url;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}bwHubVersion=${encodeURIComponent(BW_TOOLS_HUB_DATA_VERSION)}`;
  }

  _bindHandlers() {
    if (this._bound) return;
    this._bound = true;

    this.addEventListener('input', (event) => {
      const input = event.target.closest('[data-bw-tools-search]');
      if (!input) return;
      this._query = input.value || '';
      this._updateResults();
    });

    this.addEventListener('change', (event) => {
      const categorySelect = event.target.closest('[data-bw-category-select]');
      if (categorySelect) {
        this._activeCategory = categorySelect.value || '';
        this._updateResults();
        return;
      }

      const typeSelect = event.target.closest('[data-bw-type-select]');
      if (typeSelect) {
        this._activeType = typeSelect.value || '';
        this._updateResults();
      }
    });

    this.addEventListener('click', (event) => {
      const clear = event.target.closest('[data-bw-tools-clear]');
      if (clear) {
        event.preventDefault();
        this._query = '';
        this._activeCategory = '';
        this._activeType = '';
        const input = this.querySelector('[data-bw-tools-search]');
        if (input) input.value = '';
        this._updateResults();
      }
    });
  }

  _renderShell() {
    this.innerHTML = `
      <style>
        bw-tools-hub {
          display: block;
          width: 100%;
        }

        .bw-tools-hub {
          --bw-green: #1B5E20;
          --bw-yellow: #FFE600;
          --bw-lime: #7CB342;
          --bw-light-green: #C5E1A5;
          --bw-cream: #FAFAF5;
          --bw-text: #212121;
          --bw-muted: #4E5A4E;
          --bw-white: #FFFFFF;
          --bw-serif: Merriweather, Georgia, serif;
          background: var(--bw-cream);
          color: var(--bw-text);
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

        .bw-tools-hub h1,
        .bw-tools-hub h2,
        .bw-tools-hub h3,
        .bw-tools-hub p {
          margin-top: 0;
        }

        .bw-tools-hub .bw-hub-hero {
          background: var(--bw-green);
          color: var(--bw-white);
          padding: 56px 28px 46px;
          position: relative;
          text-align: center;
        }

        .bw-tools-hub .bw-hub-hero::after,
        .bw-tools-hub .bw-hub-footer::before,
        .bw-tools-hub .bw-hub-footer::after {
          background: linear-gradient(90deg, var(--bw-yellow), var(--bw-lime));
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

        .bw-tools-hub h1 {
          color: var(--bw-white);
          font-size: 36px;
          font-weight: 800;
          line-height: 1.14;
          margin-bottom: 14px;
          text-wrap: balance;
        }

        .bw-tools-hub .bw-highlight {
          color: var(--bw-yellow);
        }

        .bw-tools-hub .bw-hero-lead {
          color: rgba(255, 255, 255, 0.9);
          font-family: var(--bw-serif);
          font-size: 17px;
          line-height: 1.6;
          margin: 0 auto;
          max-width: 680px;
        }

        .bw-tools-hub .bw-hub-main {
          padding: 34px 24px 48px;
        }

        .bw-tools-hub .bw-finder {
          background: var(--bw-white);
          border: 1px solid rgba(27, 94, 32, 0.16);
          border-radius: 8px;
          margin-bottom: 24px;
          padding: 18px;
        }

        .bw-tools-hub .bw-finder-top {
          align-items: end;
          display: grid;
          gap: 12px;
          grid-template-columns: minmax(0, 1fr) auto;
        }

        .bw-tools-hub .bw-search-label {
          color: var(--bw-green);
          display: block;
          font-size: 14px;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 8px;
        }

        .bw-tools-hub .bw-search-wrap {
          position: relative;
        }

        .bw-tools-hub .bw-search-icon {
          color: var(--bw-green);
          font-size: 18px;
          left: 15px;
          line-height: 1;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }

        .bw-tools-hub .bw-search-input {
          background: #FCFFF7;
          border: 2px solid var(--bw-light-green);
          border-radius: 8px;
          color: var(--bw-text);
          font: inherit;
          font-size: 16px;
          min-height: 50px;
          outline: none;
          padding: 13px 14px 13px 44px;
          width: 100%;
        }

        .bw-tools-hub .bw-search-input:focus {
          border-color: var(--bw-green);
          box-shadow: 0 0 0 3px rgba(255, 230, 0, 0.42);
        }

        .bw-tools-hub .bw-clear-btn {
          align-items: center;
          background: var(--bw-green);
          border: 2px solid var(--bw-green);
          border-radius: 8px;
          color: var(--bw-white);
          cursor: pointer;
          display: inline-flex;
          font: inherit;
          font-size: 13px;
          font-weight: 800;
          justify-content: center;
          letter-spacing: 0;
          min-height: 50px;
          padding: 0 16px;
        }

        .bw-tools-hub .bw-clear-btn[hidden] {
          display: none;
        }

        .bw-tools-hub .bw-filter-groups {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          margin-top: 14px;
          min-width: 0;
        }

        .bw-tools-hub .bw-filter-group {
          min-width: 0;
        }

        .bw-tools-hub .bw-filter-label {
          color: var(--bw-muted);
          display: block;
          font-size: 12px;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 7px;
          text-transform: uppercase;
        }

        .bw-tools-hub .bw-select-wrap {
          display: block;
          position: relative;
        }

        .bw-tools-hub .bw-select-wrap::after {
          color: var(--bw-green);
          content: "\\25BE";
          font-size: 13px;
          font-weight: 800;
          pointer-events: none;
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
        }

        .bw-tools-hub .bw-filter-select {
          appearance: none;
          background: #F5FAEC;
          border: 1px solid rgba(27, 94, 32, 0.2);
          border-radius: 8px;
          color: var(--bw-green);
          cursor: pointer;
          font: inherit;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0;
          min-height: 46px;
          outline: none;
          padding: 11px 42px 11px 13px;
          text-overflow: ellipsis;
          width: 100%;
        }

        .bw-tools-hub .bw-filter-select:hover,
        .bw-tools-hub .bw-filter-select:focus {
          border-color: var(--bw-green);
          box-shadow: 0 0 0 3px rgba(255, 230, 0, 0.28);
        }

        .bw-tools-hub .bw-result-count {
          color: var(--bw-muted);
          font-family: var(--bw-serif);
          font-size: 14.5px;
          line-height: 1.55;
          margin: 12px 0 0;
        }

        .bw-tools-hub .bw-section-heading,
        .bw-tools-hub .bw-category-heading {
          align-items: center;
          color: var(--bw-green);
          display: flex;
          font-size: 26px;
          font-weight: 800;
          gap: 10px;
          line-height: 1.2;
          margin-bottom: 8px;
        }

        .bw-tools-hub .bw-section-kicker {
          color: var(--bw-muted);
          font-family: var(--bw-serif);
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 16px;
          max-width: 700px;
        }

        .bw-tools-hub .bw-spotlight-section {
          margin-bottom: 30px;
        }

        .bw-tools-hub .bw-spotlight-card {
          align-items: center;
          background: radial-gradient(circle at 18% 12%, rgba(255, 230, 0, 0.32), transparent 34%), linear-gradient(135deg, #0F4419 0%, #1B5E20 54%, #2E7D32 100%);
          border: 1px solid rgba(255, 230, 0, 0.42);
          border-radius: 12px;
          box-shadow: 0 18px 42px rgba(27, 94, 32, 0.18);
          color: var(--bw-white);
          display: grid;
          gap: 22px;
          grid-template-columns: auto minmax(0, 1fr) auto;
          overflow: hidden;
          padding: 24px;
          position: relative;
          text-decoration: none;
        }

        .bw-tools-hub .bw-spotlight-card::after {
          background: linear-gradient(135deg, transparent, rgba(255, 230, 0, 0.18));
          content: "";
          inset: 0;
          pointer-events: none;
          position: absolute;
        }

        .bw-tools-hub .bw-spotlight-card:hover,
        .bw-tools-hub .bw-spotlight-card:focus-visible {
          box-shadow: 0 20px 46px rgba(27, 94, 32, 0.24);
          transform: translateY(-2px);
        }

        .bw-tools-hub .bw-spotlight-card:focus-visible {
          outline: 3px solid rgba(255, 230, 0, 0.92);
          outline-offset: 3px;
        }

        .bw-tools-hub .bw-spotlight-icon,
        .bw-tools-hub .bw-spotlight-copy,
        .bw-tools-hub .bw-spotlight-cta {
          position: relative;
          z-index: 1;
        }

        .bw-tools-hub .bw-spotlight-icon {
          background: #FAFAF5;
          border: 2px solid rgba(255, 230, 0, 0.78);
          border-radius: 18px;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 12px 24px rgba(0, 0, 0, 0.18);
          height: 92px;
          overflow: hidden;
          width: 92px;
        }

        .bw-tools-hub .bw-spotlight-icon img {
          display: block;
          height: 100%;
          object-fit: cover;
          width: 100%;
        }

        .bw-tools-hub .bw-spotlight-label {
          color: var(--bw-yellow);
          display: block;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1px;
          line-height: 1.2;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .bw-tools-hub .bw-spotlight-card h2 {
          color: var(--bw-white);
          font-size: 29px;
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 8px;
        }

        .bw-tools-hub .bw-spotlight-card p {
          color: rgba(255, 255, 255, 0.9);
          font-family: var(--bw-serif);
          font-size: 15.5px;
          line-height: 1.58;
          margin-bottom: 10px;
          max-width: 650px;
        }

        .bw-tools-hub .bw-spotlight-meta {
          color: rgba(255, 255, 255, 0.72);
          display: block;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.7px;
          text-transform: uppercase;
        }

        .bw-tools-hub .bw-spotlight-cta {
          background: var(--bw-yellow);
          border-radius: 999px;
          color: var(--bw-green);
          display: inline-flex;
          flex: 0 0 auto;
          font-size: 13px;
          font-weight: 800;
          justify-content: center;
          min-width: 178px;
          padding: 14px 18px;
          text-align: center;
        }

        .bw-tools-hub .bw-featured-section,
        .bw-tools-hub .bw-category-section,
        .bw-tools-hub .bw-matches-section {
          margin-bottom: 34px;
        }

        .bw-tools-hub .bw-category-section:last-child {
          margin-bottom: 0;
        }

        .bw-tools-hub .bw-category-icon {
          font-size: 30px;
          line-height: 1;
        }

        .bw-tools-hub .bw-category-blurb {
          color: var(--bw-muted);
          font-family: var(--bw-serif);
          font-size: 15.5px;
          line-height: 1.6;
          margin-bottom: 16px;
          max-width: 650px;
        }

        .bw-tools-hub .bw-featured-grid,
        .bw-tools-hub .bw-tools-grid {
          display: grid;
          gap: 14px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .bw-tools-hub .bw-tool-card {
          background: var(--bw-white);
          border: 1px solid var(--bw-light-green);
          border-radius: 8px;
          color: inherit;
          display: flex;
          flex-direction: column;
          min-height: 178px;
          min-width: 0;
          padding: 18px;
          text-decoration: none;
          transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
        }

        .bw-tools-hub .bw-featured-grid .bw-tool-card {
          border-color: rgba(27, 94, 32, 0.32);
          box-shadow: 0 8px 20px rgba(27, 94, 32, 0.08);
        }

        .bw-tools-hub .bw-tool-card:hover,
        .bw-tools-hub .bw-tool-card:focus-visible {
          border-color: var(--bw-green);
          box-shadow: 0 10px 24px rgba(27, 94, 32, 0.12);
          transform: translateY(-2px);
        }

        .bw-tools-hub .bw-tool-card:focus-visible,
        .bw-tools-hub .bw-clear-btn:focus-visible,
        .bw-tools-hub .bw-filter-select:focus-visible {
          outline: 3px solid rgba(255, 230, 0, 0.9);
          outline-offset: 2px;
        }

        .bw-tools-hub .bw-tool-card-head {
          align-items: flex-start;
          display: flex;
          gap: 12px;
          margin-bottom: 10px;
          min-height: 58px;
        }

        .bw-tools-hub .bw-tool-icon {
          align-items: center;
          background: #F5FAEC;
          border: 1px solid rgba(27, 94, 32, 0.14);
          border-radius: 8px;
          display: flex;
          flex: 0 0 56px;
          height: 56px;
          justify-content: center;
          overflow: hidden;
          width: 56px;
        }

        .bw-tools-hub .bw-tool-icon img {
          display: block;
          height: 56px;
          object-fit: cover;
          width: 56px;
        }

        .bw-tools-hub .bw-tool-title-wrap {
          min-width: 0;
        }

        .bw-tools-hub .bw-tool-card h3 {
          color: var(--bw-green);
          font-size: 18px;
          font-weight: 800;
          line-height: 1.25;
          margin-bottom: 7px;
          overflow-wrap: break-word;
        }

        .bw-tools-hub .bw-tool-type {
          background: rgba(124, 179, 66, 0.16);
          border-radius: 999px;
          color: var(--bw-green);
          display: inline-block;
          font-size: 12px;
          font-weight: 800;
          line-height: 1;
          padding: 5px 8px;
        }

        .bw-tools-hub .bw-season-label {
          background: rgba(255, 230, 0, 0.32);
          border-radius: 999px;
          color: var(--bw-green);
          display: inline-block;
          font-size: 12px;
          font-weight: 800;
          line-height: 1;
          margin-left: 5px;
          padding: 5px 8px;
        }

        .bw-tools-hub .bw-tool-card p {
          color: var(--bw-text);
          font-family: var(--bw-serif);
          font-size: 14.5px;
          line-height: 1.48;
          margin-bottom: 16px;
          overflow-wrap: break-word;
        }

        .bw-tools-hub .bw-tool-cta {
          color: var(--bw-green);
          display: inline-block;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0;
          margin-top: auto;
        }

        .bw-tools-hub .bw-no-results {
          background: var(--bw-white);
          border: 1px solid var(--bw-light-green);
          border-radius: 8px;
          color: var(--bw-muted);
          font-family: var(--bw-serif);
          font-size: 16px;
          line-height: 1.6;
          margin: 0 0 32px;
          padding: 24px;
          text-align: center;
        }

        .bw-tools-hub .bw-embed-cta {
          align-items: center;
          background: var(--bw-white);
          border: 1px solid var(--bw-light-green);
          border-left: 5px solid var(--bw-green);
          border-radius: 8px;
          display: flex;
          gap: 22px;
          justify-content: space-between;
          margin: 42px 0 0;
          padding: 22px 24px;
        }

        .bw-tools-hub .bw-embed-cta h2 {
          color: var(--bw-green);
          font-size: 21px;
          font-weight: 800;
          line-height: 1.25;
          margin-bottom: 6px;
        }

        .bw-tools-hub .bw-embed-cta p {
          color: var(--bw-muted);
          font-family: var(--bw-serif);
          font-size: 15px;
          line-height: 1.55;
          margin-bottom: 0;
          max-width: 680px;
        }

        .bw-tools-hub .bw-btn-secondary,
        .bw-tools-hub .bw-btn-primary {
          align-items: center;
          border-radius: 8px;
          display: inline-flex;
          font-size: 14px;
          font-weight: 800;
          justify-content: center;
          letter-spacing: 0;
          min-height: 44px;
          padding: 12px 18px;
          text-decoration: none;
        }

        .bw-tools-hub .bw-btn-secondary {
          border: 2px solid var(--bw-green);
          color: var(--bw-green);
          flex: 0 0 auto;
        }

        .bw-tools-hub .bw-btn-secondary:hover,
        .bw-tools-hub .bw-btn-secondary:focus-visible {
          background: var(--bw-green);
          color: var(--bw-white);
        }

        .bw-tools-hub .bw-hub-footer {
          background: var(--bw-green);
          color: var(--bw-white);
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
          color: var(--bw-white);
          font-size: 28px;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 10px;
        }

        .bw-tools-hub .bw-hub-footer p {
          color: rgba(255, 255, 255, 0.88);
          font-family: var(--bw-serif);
          font-size: 15px;
          line-height: 1.6;
          margin: 0 auto 20px;
          max-width: 660px;
        }

        .bw-tools-hub .bw-btn-primary {
          background: var(--bw-yellow);
          color: var(--bw-green);
        }

        .bw-tools-hub .bw-tools-error,
        .bw-tools-hub .bw-skeleton-text {
          color: var(--bw-muted);
          font-family: var(--bw-serif);
          font-size: 16px;
          padding: 16px 0;
          text-align: center;
        }

        .bw-tools-hub .bw-skeleton-card {
          animation: bw-tools-hub-shimmer 1200ms linear infinite;
          background: linear-gradient(90deg, #F2F8E8 0%, #FFFFFF 45%, #F2F8E8 90%);
          background-size: 220% 100%;
          border-radius: 8px;
          height: 178px;
        }

        @keyframes bw-tools-hub-shimmer {
          from { background-position: 120% 0; }
          to { background-position: -120% 0; }
        }

        @media (max-width: 1024px) {
          .bw-tools-hub .bw-featured-grid,
          .bw-tools-hub .bw-tools-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .bw-tools-hub .bw-finder-top {
            align-items: stretch;
            grid-template-columns: 1fr;
          }

          .bw-tools-hub .bw-filter-groups {
            grid-template-columns: 1fr;
          }

          .bw-tools-hub .bw-clear-btn {
            min-height: 42px;
          }

          .bw-tools-hub .bw-featured-grid,
          .bw-tools-hub .bw-tools-grid {
            grid-template-columns: 1fr;
          }

          .bw-tools-hub .bw-embed-cta {
            align-items: flex-start;
            flex-direction: column;
          }

          .bw-tools-hub .bw-spotlight-card {
            align-items: flex-start;
            grid-template-columns: 1fr;
            padding: 20px;
          }

          .bw-tools-hub .bw-spotlight-icon {
            height: 74px;
            width: 74px;
          }

          .bw-tools-hub .bw-spotlight-cta {
            width: 100%;
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
            padding: 22px 16px 36px;
          }

          .bw-tools-hub .bw-finder {
            margin-bottom: 18px;
            padding: 14px;
          }

          .bw-tools-hub .bw-section-heading,
          .bw-tools-hub .bw-category-heading {
            font-size: 22px;
          }

          .bw-tools-hub .bw-category-blurb,
          .bw-tools-hub .bw-section-kicker {
            font-size: 14.5px;
          }

          .bw-tools-hub .bw-tool-card {
            min-height: 0;
            padding: 14px;
            position: relative;
          }

          .bw-tools-hub .bw-tool-card::after {
            color: var(--bw-green);
            content: "\\2192";
            font-size: 20px;
            font-weight: 800;
            position: absolute;
            right: 14px;
            top: 22px;
          }

          .bw-tools-hub .bw-tool-card-head {
            margin-bottom: 8px;
            min-height: 48px;
            padding-right: 22px;
          }

          .bw-tools-hub .bw-tool-icon {
            flex-basis: 48px;
            height: 48px;
            width: 48px;
          }

          .bw-tools-hub .bw-tool-icon img {
            height: 48px;
            width: 48px;
          }

          .bw-tools-hub .bw-tool-card h3 {
            font-size: 17px;
          }

          .bw-tools-hub .bw-tool-card p {
            display: -webkit-box;
            font-size: 14px;
            margin-bottom: 12px;
            overflow: hidden;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }

          .bw-tools-hub .bw-tool-cta {
            font-size: 12.5px;
          }

          .bw-tools-hub .bw-hub-footer {
            padding: 32px 18px 36px;
          }

          .bw-tools-hub .bw-hub-footer h2 {
            font-size: 23px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bw-tools-hub .bw-tool-card,
          .bw-tools-hub .bw-skeleton-card {
            animation: none;
            transition: none;
            transform: none;
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
          <p>The 2-hour walking tour covers Berlin's historic center and East Berlin stories. Tip-based, no fixed price.</p>
          <a href="https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based" class="bw-btn-primary">Reserve your spot</a>
        </div>
      </section>
    `;
  }

  _renderSkeleton() {
    return `
      <p class="bw-skeleton-text">Loading tools...</p>
      <div class="bw-tools-grid" aria-hidden="true">
        <span class="bw-skeleton-card"></span>
        <span class="bw-skeleton-card"></span>
        <span class="bw-skeleton-card"></span>
      </div>
    `;
  }

  async _loadDataAndRender() {
    try {
      const response = await fetch(this._dataUrl);
      if (!response.ok) throw new Error('Could not load tools');
      const data = await response.json();
      this._spotlightTool = data && data.spotlightTool && typeof data.spotlightTool === 'object' ? data.spotlightTool : null;
      this._renderHub(data);
    } catch (error) {
      this._renderError();
    }
  }

  _renderHub(data) {
    const root = this.querySelector('.bw-tools-root');
    const tools = data && Array.isArray(data.tools)
      ? data.tools.filter(tool => this._isVisibleTool(tool))
      : [];
    const categories = data && Array.isArray(data.hubCategories) && data.hubCategories.length
      ? data.hubCategories
      : (data && Array.isArray(data.categories) ? data.categories : []);

    if (!root || !categories.length || !tools.length) {
      this._renderError();
      return;
    }

    this._categories = categories;
    this._tools = tools;
    root.removeAttribute('aria-live');
    root.innerHTML = `
      ${this._renderFinder()}
      <div class="bw-spotlight-root"></div>

          <div class="bw-featured-root"></div>
      <div class="bw-catalog-root"></div>
    `;
    this._updateResults();
  }

  _renderFinder() {
    return `
      <section class="bw-finder" aria-labelledby="bw-tool-finder-title">
        <div class="bw-finder-top">
          <div>
            <label class="bw-search-label" id="bw-tool-finder-title" for="bw-tool-search">Find the right Berlin tool</label>
            <div class="bw-search-wrap">
              <span class="bw-search-icon" aria-hidden="true">&#128269;</span>
              <input id="bw-tool-search" class="bw-search-input" data-bw-tools-search type="search" autocomplete="off" placeholder="Search tickets, Sunday, luggage, weather, airport...">
            </div>
          </div>
          <button class="bw-clear-btn" type="button" data-bw-tools-clear hidden>Reset</button>
        </div>
        <div class="bw-filter-groups">
          <label class="bw-filter-group" for="bw-tool-category-filter">
            <span class="bw-filter-label">Category</span>
            <span class="bw-select-wrap">
              <select id="bw-tool-category-filter" class="bw-filter-select" data-bw-category-select>
                ${this._renderCategoryOptions()}
              </select>
            </span>
          </label>
          <label class="bw-filter-group" for="bw-tool-type-filter">
            <span class="bw-filter-label">Tool type</span>
            <span class="bw-select-wrap">
              <select id="bw-tool-type-filter" class="bw-filter-select" data-bw-type-select>
                ${this._renderTypeOptions()}
              </select>
            </span>
          </label>
        </div>
        <p class="bw-result-count" data-bw-result-count></p>
      </section>
    `;
  }

  _renderCategoryOptions() {
    const allOption = this._renderSelectOption({
      value: '',
      label: 'All categories',
      count: this._tools.length
    });

    const categoryOptions = this._categories.map(category => {
      const count = this._countToolsForCategory(category.key);
      if (!count) return '';
      return this._renderSelectOption({
        value: category.key,
        label: `${category.icon || ''} ${category.label || ''}`.trim(),
        count
      });
    }).join('');

    return `${allOption}${categoryOptions}`;
  }

  _renderTypeOptions() {
    const types = this._getToolTypes();
    const allOption = this._renderSelectOption({
      value: '',
      label: 'All types',
      count: this._tools.length
    });

    return `${allOption}${types.map(type => this._renderSelectOption({
      value: type,
      label: type,
      count: this._countToolsForType(type)
    })).join('')}`;
  }

  _renderSelectOption({ value, label, count }) {
    return `<option value="${this._escapeAttribute(value)}">${this._escapeHtml(`${label} (${count})`)}</option>`;
  }

  _updateResults() {
    const active = Boolean(this._query.trim() || this._activeCategory || this._activeType);
    const filteredTools = this._getFilteredTools();
    const sortedTools = this._sortTools(filteredTools);

    this._updateFinderState(sortedTools.length, active);
    this._renderSpotlight(active);
    this._renderFeatured(active);
    this._renderCatalog(sortedTools, active);
  }

  _updateFinderState(count, active) {
    const clear = this.querySelector('[data-bw-tools-clear]');
    if (clear) clear.hidden = !active;

    const input = this.querySelector('[data-bw-tools-search]');
    if (input && input.value !== this._query) input.value = this._query;

    const categorySelect = this.querySelector('[data-bw-category-select]');
    if (categorySelect && categorySelect.value !== this._activeCategory) {
      categorySelect.value = this._activeCategory;
    }

    const typeSelect = this.querySelector('[data-bw-type-select]');
    if (typeSelect && typeSelect.value !== this._activeType) {
      typeSelect.value = this._activeType;
    }

    const countEl = this.querySelector('[data-bw-result-count]');
    if (!countEl) return;
    if (!active) {
      countEl.textContent = `${this._tools.length} free Berlin tools in ${this._categories.length} categories. Choose a category, filter by type, or search.`;
    } else if (count === 0) {
      countEl.textContent = 'No matching tool yet. Try tickets, Sunday, weather, luggage, or first day.';
    } else {
      const scopes = [];
      if (this._activeCategory) scopes.push(`in ${this._categoryLabel(this._activeCategory)}`);
      if (this._activeType) scopes.push(`type: ${this._activeType}`);
      if (this._query.trim()) scopes.push(`matching "${this._query.trim()}"`);
      countEl.textContent = `${count} ${count === 1 ? 'tool' : 'tools'}${scopes.length ? ` ${scopes.join(' · ')}` : ''}.`;
    }
  }

  _renderFeatured(active) {
    const root = this.querySelector('.bw-featured-root');
    if (!root) return;
    if (active) {
      root.innerHTML = '';
      return;
    }

    const featured = this._sortTools(this._tools.filter(tool => tool.featured)).slice(0, 6);
    if (!featured.length) {
      root.innerHTML = '';
      return;
    }

    root.innerHTML = `
      <section class="bw-featured-section" aria-labelledby="bw-featured-tools-title">
        <h2 class="bw-section-heading" id="bw-featured-tools-title">Start here</h2>
        <p class="bw-section-kicker">The fastest tools for common first-trip questions: tickets, what is open, arrival moves, Mondays, and holidays.</p>
        <div class="bw-featured-grid">
          ${featured.map(tool => this._renderTool(tool)).join('')}
        </div>
      </section>
    `;
  }

  _renderCatalog(tools, active) {
    const root = this.querySelector('.bw-catalog-root');
    if (!root) return;

    if (!tools.length) {
      root.innerHTML = `<p class="bw-no-results">No matching tool yet. Try tickets, Sunday, weather, luggage, or first day.</p>`;
      return;
    }

    if (this._activeCategory) {
      const category = this._getCategory(this._activeCategory);
      const id = `bw-tools-${String(this._activeCategory || 'matches').toLowerCase()}`;
      root.innerHTML = `
        <section class="bw-matches-section" id="${this._escapeAttribute(id)}" aria-labelledby="${this._escapeAttribute(id)}-title">
          <h2 class="bw-section-heading" id="${this._escapeAttribute(id)}-title">
            <span class="bw-category-icon" aria-hidden="true">${this._escapeHtml((category && category.icon) || '')}</span>
            ${this._escapeHtml((category && category.label) || 'Matching tools')}
          </h2>
          ${category && category.blurb ? `<p class="bw-section-kicker">${this._escapeHtml(category.blurb)}</p>` : ''}
          <div class="bw-tools-grid">
            ${tools.map(tool => this._renderTool(tool)).join('')}
          </div>
        </section>
      `;
      return;
    }

    if (active) {
      root.innerHTML = `
        <section class="bw-matches-section" aria-labelledby="bw-matching-tools-title">
          <h2 class="bw-section-heading" id="bw-matching-tools-title">Matching tools</h2>
          <div class="bw-tools-grid">
            ${tools.map(tool => this._renderTool(tool)).join('')}
          </div>
        </section>
      `;
      return;
    }

    root.innerHTML = this._categories.map(category => this._renderCategory(category, tools)).join('');
  }

  _renderCategory(category, tools) {
    const categoryTools = this._sortTools(tools.filter(tool => this._toolCategory(tool) === category.key));
    const id = `bw-tools-${String(category.key || '').toLowerCase()}`;
    if (!categoryTools.length) return '';

    return `
      <section class="bw-category-section" id="${this._escapeAttribute(id)}" aria-labelledby="${this._escapeAttribute(id)}-title">
        <h2 class="bw-category-heading" id="${this._escapeAttribute(id)}-title">
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

  _renderTool(tool) {
    const seasonLabel = this._isSeasonRelevant(tool) && tool.seasonLabel
      ? `<span class="bw-season-label">${this._escapeHtml(tool.seasonLabel)}</span>`
      : '';
    return `
      <a class="bw-tool-card" href="https://www.berlinwalk.com/tools/${this._escapeAttribute(tool.slug || '')}">
        <div class="bw-tool-card-head">
          ${this._renderToolIcon(tool)}
          <div class="bw-tool-title-wrap">
            <h3>${this._escapeHtml(tool.title || '')}</h3>
            <span class="bw-tool-type">${this._escapeHtml(tool.type || 'Tool')}</span>${seasonLabel}
          </div>
        </div>
        <p>${this._escapeHtml(tool.lead || '')}</p>
        <span class="bw-tool-cta">Open tool</span>
      </a>
    `;
  }

  _renderToolIcon(tool) {
    const image = tool && typeof tool.image === 'string' && tool.image.trim()
      ? tool.image.trim()
      : BW_TOOLS_HUB_DEFAULT_IMAGE;
    return `
      <span class="bw-tool-icon" aria-hidden="true">
        <img src="${this._escapeAttribute(image)}" alt="" loading="lazy" decoding="async">
      </span>
    `;
  }

  _getFilteredTools() {
    const query = this._query.trim().toLowerCase();
    return this._tools.filter(tool => {
      if (this._activeCategory && this._toolCategory(tool) !== this._activeCategory) return false;
      if (this._activeType && String(tool.type || '') !== this._activeType) return false;
      if (query && !this._matchesSearch(tool, query)) return false;
      return true;
    });
  }

  _matchesSearch(tool, query) {
    return this._searchText(tool).includes(query);
  }

  _searchText(tool) {
    return [
      tool.title,
      tool.lead,
      tool.slug,
      tool.type,
      this._toolCategory(tool),
      this._categoryLabel(this._toolCategory(tool)),
      ...(Array.isArray(tool.tags) ? tool.tags : []),
      ...(Array.isArray(tool.aliases) ? tool.aliases : [])
    ].filter(Boolean).join(' ').toLowerCase();
  }

  _getToolTypes() {
    const found = new Set(this._tools.map(tool => String(tool.type || '').trim()).filter(Boolean));
    return [
      ...BW_TOOLS_HUB_TYPE_ORDER.filter(type => found.has(type)),
      ...[...found].filter(type => !BW_TOOLS_HUB_TYPE_ORDER.includes(type)).sort()
    ];
  }

  _countToolsForCategory(categoryKey) {
    return this._tools.filter(tool => this._toolCategory(tool) === categoryKey).length;
  }

  _countToolsForType(type) {
    return this._tools.filter(tool => String(tool.type || '') === type).length;
  }

  _getCategory(categoryKey) {
    return this._categories.find(category => category && category.key === categoryKey) || null;
  }

  _categoryLabel(categoryKey) {
    const category = this._getCategory(categoryKey);
    return category && category.label ? category.label : categoryKey;
  }

  _sortTools(tools) {
    return [...tools].sort((a, b) => {
      const priorityDiff = this._sortPriority(a) - this._sortPriority(b);
      if (priorityDiff) return priorityDiff;
      return String(a.title || '').localeCompare(String(b.title || ''));
    });
  }

  _sortPriority(tool) {
    return this._priority(tool) - (this._isSeasonRelevant(tool) ? 8 : 0);
  }

  _isSeasonRelevant(tool) {
    if (!tool || !tool.seasonal || !tool.seasonStart || !tool.seasonEnd) return false;
    const now = new Date();
    const start = new Date(`${tool.seasonStart}T00:00:00`);
    const end = new Date(`${tool.seasonEnd}T23:59:59`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;
    const nearStart = new Date(start.getTime() - 21 * 24 * 60 * 60 * 1000);
    return now >= nearStart && now <= end;
  }

  _priority(tool) {
    return typeof tool.priority === 'number' ? tool.priority : 50;
  }

  _toolCategory(tool) {
    return tool.hubCategory || tool.category || '';
  }

  _isVisibleTool(tool) {
    if (!tool || !tool.widgetUrl) return false;
    const status = String(tool.status || '').toLowerCase();
    return tool.hidden !== true && tool.published !== false && status !== 'draft';
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
