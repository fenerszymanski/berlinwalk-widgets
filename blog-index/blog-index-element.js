const BW_BLOG_INDEX_DATA_URL = (() => {
  const script = document.currentScript;
  const base = script && script.src ? script.src : window.location.href;
  return new URL('./data.json', base).href;
})();

const BW_BLOG_INDEX_FALLBACK = {
  totalPosts: 0,
  bookingUrl: 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based',
  navTopics: [],
  hero: { lead: null, secondary: [] },
  startHere: [],
  tools: [],
  shelves: [],
  latest: [],
  allPosts: [],
};

class BWBlogIndexElement extends HTMLElement {
  constructor() {
    super();
    this._data = BW_BLOG_INDEX_FALLBACK;
    this._topic = 'all';
    this._query = '';
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
        bw-blog-index {
          display: block;
          width: 100%;
        }

        .bw-blog-index {
          --green: #1B5E20;
          --green-dark: #124516;
          --yellow: #FFE600;
          --lime: #7CB342;
          --light-green: #C5E1A5;
          --cream: #FAFAF5;
          --text: #212121;
          --muted: #4E5A4E;
          --border: #DDE9D2;
          --serif: Merriweather, Georgia, serif;
          background: #FBFBF2;
          color: var(--text);
          font-family: Montserrat, Arial, sans-serif;
          margin: 0;
          max-width: 100%;
          overflow-x: hidden;
          width: 100%;
        }

        .bw-blog-index *,
        .bw-blog-index *::before,
        .bw-blog-index *::after {
          box-sizing: border-box;
        }

        .bw-blog-index h1,
        .bw-blog-index h2,
        .bw-blog-index h3,
        .bw-blog-index p,
        .bw-blog-index figure {
          margin-top: 0;
          overflow-wrap: anywhere;
        }

        .bw-blog-index a {
          color: inherit;
        }

        .bw-blog-index .bw-inner {
          margin: 0 auto;
          max-width: 1180px;
          min-width: 0;
          padding-left: 24px;
          padding-right: 24px;
          width: 100%;
        }

        .bw-blog-index .bw-hero {
          background: #FBFBF2;
          border-top: 8px solid var(--yellow);
          border-bottom: 2px solid var(--text);
          color: var(--text);
          padding: 28px 0 30px;
          position: relative;
        }

        .bw-blog-index .bw-footer-band::before {
          background: linear-gradient(90deg, var(--yellow), var(--lime));
          bottom: 0;
          content: "";
          display: block;
          height: 4px;
          left: 0;
          position: absolute;
          width: 100%;
        }

        .bw-blog-index .bw-masthead {
          border-bottom: 1px solid var(--text);
          margin-bottom: 22px;
          padding-bottom: 20px;
        }

        .bw-blog-index .bw-kicker,
        .bw-blog-index .bw-card-kicker,
        .bw-blog-index .bw-meta {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1.4px;
          line-height: 1.2;
          text-transform: uppercase;
        }

        .bw-blog-index .bw-kicker {
          background: var(--yellow);
          color: var(--text);
          display: inline-block;
          margin-bottom: 12px;
          padding: 5px 8px;
        }

        .bw-blog-index h1 {
          color: var(--text);
          font-size: 68px;
          font-weight: 900;
          letter-spacing: 0;
          line-height: 0.92;
          margin-bottom: 10px;
          max-width: 760px;
        }

        .bw-blog-index .bw-hero-lead {
          color: #2B332B;
          font-family: var(--serif);
          font-size: 18px;
          line-height: 1.62;
          margin-bottom: 0;
          max-width: 700px;
          overflow-wrap: anywhere;
        }

        .bw-blog-index .bw-hero-grid {
          display: grid;
          gap: 20px;
          grid-template-columns: minmax(0, 1.12fr) minmax(300px, 0.5fr);
          max-width: 100%;
          min-width: 0;
        }

        .bw-blog-index .bw-lead-card,
        .bw-blog-index .bw-small-card,
        .bw-blog-index .bw-post-card,
        .bw-blog-index .bw-tool-card {
          background: #FFFFFF;
          border: 0;
          border-radius: 0;
          color: var(--text);
          max-width: 100%;
          min-width: 0;
          overflow: hidden;
          text-decoration: none;
          transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
        }

        .bw-blog-index .bw-lead-card:hover,
        .bw-blog-index .bw-lead-card:focus-visible,
        .bw-blog-index .bw-small-card:hover,
        .bw-blog-index .bw-small-card:focus-visible,
        .bw-blog-index .bw-post-card:hover,
        .bw-blog-index .bw-post-card:focus-visible,
        .bw-blog-index .bw-tool-card:hover,
        .bw-blog-index .bw-tool-card:focus-visible,
        .bw-blog-index .bw-row-link:hover,
        .bw-blog-index .bw-row-link:focus-visible {
          border-color: var(--green);
          box-shadow: none;
          transform: translateY(-1px);
        }

        .bw-blog-index a:focus-visible,
        .bw-blog-index button:focus-visible,
        .bw-blog-index input:focus-visible {
          outline: 3px solid rgba(255, 230, 0, 0.92);
          outline-offset: 3px;
        }

        .bw-blog-index .bw-lead-card {
          display: grid;
          background: transparent;
          border-top: 3px solid var(--text);
          grid-template-columns: minmax(280px, 0.54fr) minmax(0, 0.46fr);
          height: 390px;
          min-height: 390px;
        }

        .bw-blog-index .bw-media {
          background: #DDE9D2;
          min-height: 100%;
          overflow: hidden;
          position: relative;
        }

        .bw-blog-index .bw-media img {
          display: block;
          height: 100%;
          object-fit: cover;
          width: 100%;
        }

        .bw-blog-index .bw-placeholder {
          align-items: center;
          background: linear-gradient(135deg, #1B5E20, #7CB342);
          color: var(--yellow);
          display: flex;
          font-size: 44px;
          font-weight: 900;
          height: 100%;
          justify-content: center;
          min-height: 190px;
        }

        .bw-blog-index .bw-lead-copy,
        .bw-blog-index .bw-small-copy,
        .bw-blog-index .bw-post-copy {
          min-width: 0;
        }

        .bw-blog-index .bw-lead-copy {
          align-content: end;
          background: #FFFFFF;
          display: grid;
          padding: 24px 26px;
        }

        .bw-blog-index .bw-card-kicker,
        .bw-blog-index .bw-meta {
          color: var(--green);
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 10px;
          min-width: 0;
          overflow-wrap: anywhere;
        }

        .bw-blog-index .bw-dot {
          background: var(--lime);
          border-radius: 999px;
          display: inline-block;
          height: 5px;
          margin-top: 4px;
          width: 5px;
        }

        .bw-blog-index .bw-lead-title {
          color: var(--text);
          display: block;
          font-size: 34px;
          font-weight: 900;
          letter-spacing: 0;
          line-height: 1.08;
          margin-bottom: 10px;
          overflow-wrap: break-word;
        }

        .bw-blog-index .bw-card-text {
          color: #3D3D36;
          display: block;
          font-family: var(--serif);
          font-size: 15px;
          line-height: 1.58;
          margin-bottom: 0;
          overflow-wrap: break-word;
        }

        .bw-blog-index .bw-secondary-stack {
          display: grid;
          gap: 0;
          border-top: 3px solid var(--text);
          max-width: 100%;
          min-width: 0;
        }

        .bw-blog-index .bw-small-card {
          background: transparent;
          border-bottom: 1px solid var(--text);
          display: grid;
          grid-template-columns: 116px minmax(0, 1fr);
          min-height: 116px;
        }

        .bw-blog-index .bw-small-copy {
          background: #FFFFFF;
          padding: 14px 16px;
        }

        .bw-blog-index .bw-small-title {
          color: var(--text);
          display: block;
          font-size: 16px;
          font-weight: 900;
          line-height: 1.2;
          margin-bottom: 0;
          overflow-wrap: anywhere;
        }

        .bw-blog-index .bw-small-card .bw-card-text {
          display: none;
        }

        .bw-blog-index .bw-main {
          padding: 24px 0 54px;
          width: 100%;
        }

        .bw-blog-index .bw-visually-hidden {
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

        .bw-blog-index .bw-controls {
          align-items: center;
          display: grid;
          gap: 14px;
          grid-template-columns: minmax(220px, 0.34fr) minmax(0, 1fr);
          margin-bottom: 24px;
        }

        .bw-blog-index .bw-search {
          position: relative;
        }

        .bw-blog-index .bw-search input {
          background: #FFFFFF;
          border: 1px solid var(--text);
          border-radius: 0;
          color: var(--text);
          font: 800 14px/1 Montserrat, Arial, sans-serif;
          min-height: 46px;
          padding: 0 18px;
          width: 100%;
        }

        .bw-blog-index .bw-topic-nav {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: flex-end;
          min-width: 0;
        }

        .bw-blog-index .bw-topic-btn {
          background: #FFFFFF;
          border: 1px solid var(--text);
          border-radius: 0;
          color: var(--text);
          cursor: pointer;
          font: 900 12px/1 Montserrat, Arial, sans-serif;
          min-height: 38px;
          padding: 0 13px;
        }

        .bw-blog-index .bw-topic-btn[aria-pressed="true"] {
          background: var(--yellow);
          border-color: var(--text);
          color: var(--text);
        }

        .bw-blog-index .bw-results {
          background: #FFFFFF;
          border: 2px solid var(--text);
          border-radius: 0;
          margin-bottom: 30px;
          padding: 18px 20px 20px;
        }

        .bw-blog-index .bw-results[hidden] {
          display: none;
        }

        .bw-blog-index .bw-section {
          margin-top: 34px;
        }

        .bw-blog-index .bw-section[data-bw-animate] {
          opacity: 1;
          transform: none;
        }

        .bw-blog-index .bw-section[data-bw-animate].visible {
          opacity: 1;
          transform: translateY(0);
        }

        .bw-blog-index .bw-section-header {
          align-items: end;
          border-top: 3px solid var(--text);
          display: flex;
          gap: 18px;
          justify-content: space-between;
          margin-bottom: 18px;
          padding-top: 24px;
        }

        .bw-blog-index .bw-section h2 {
          color: var(--text);
          font-size: 31px;
          font-weight: 900;
          letter-spacing: 0;
          line-height: 1.12;
          margin-bottom: 7px;
        }

        .bw-blog-index .bw-section-desc {
          color: var(--muted);
          font-family: var(--serif);
          font-size: 15px;
          line-height: 1.58;
          margin-bottom: 0;
          max-width: 680px;
        }

        .bw-blog-index .bw-view-link {
          color: var(--text);
          flex: 0 0 auto;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.8px;
          text-decoration: none;
          text-transform: uppercase;
        }

        .bw-blog-index .bw-result-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .bw-blog-index .bw-compact-grid {
          display: grid;
          gap: 10px 18px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          max-width: 100%;
          min-width: 0;
        }

        .bw-blog-index .bw-post-card {
          display: grid;
          grid-template-rows: 178px auto;
          min-width: 0;
        }

        .bw-blog-index .bw-post-copy {
          display: flex;
          flex-direction: column;
          min-height: 230px;
          padding: 19px 20px 20px;
        }

        .bw-blog-index .bw-post-title {
          color: var(--green);
          display: block;
          font-size: 20px;
          font-weight: 900;
          line-height: 1.2;
          margin-bottom: 9px;
          overflow-wrap: break-word;
        }

        .bw-blog-index .bw-read-more {
          color: var(--green);
          display: inline-block;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.8px;
          margin-top: auto;
          padding-top: 15px;
          text-transform: uppercase;
        }

        .bw-blog-index .bw-tools-band {
          background: var(--yellow);
          border: 2px solid var(--text);
          border-radius: 0;
          margin: 38px 0 4px;
          padding: 16px 18px;
        }

        .bw-blog-index .bw-tools-band h2 {
          color: var(--text);
          font-size: 20px;
          font-weight: 900;
          line-height: 1.14;
          margin-bottom: 4px;
        }

        .bw-blog-index .bw-tools-band .bw-section-header {
          border-top: 0;
          margin-bottom: 12px;
          padding-top: 0;
        }

        .bw-blog-index .bw-tool-grid {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .bw-blog-index .bw-tool-card {
          background: #FBFBF2;
          border: 1px solid var(--text);
          min-height: 0;
          padding: 14px 16px;
        }

        .bw-blog-index .bw-tool-card strong {
          color: var(--text);
          display: block;
          font-size: 15px;
          font-weight: 900;
          line-height: 1.22;
          margin-bottom: 4px;
        }

        .bw-blog-index .bw-tool-card span {
          color: var(--muted);
          display: block;
          font-family: var(--serif);
          font-size: 13px;
          line-height: 1.42;
        }

        .bw-blog-index .bw-start-panel {
          background: #FFFFFF;
          border: 1px solid var(--border);
          border-radius: 8px;
          margin-top: 18px;
          overflow: hidden;
        }

        .bw-blog-index .bw-start-panel h2 {
          background: var(--green);
          color: #FFFFFF;
          font-size: 18px;
          font-weight: 900;
          line-height: 1.2;
          margin: 0;
          padding: 18px 20px;
        }

        .bw-blog-index .bw-row-link {
          border-top: 1px solid var(--border);
          display: block;
          padding: 17px 20px;
          text-decoration: none;
          transition: background 160ms ease, transform 160ms ease;
        }

        .bw-blog-index .bw-row-link:first-of-type {
          border-top: 0;
        }

        .bw-blog-index .bw-row-link b {
          color: var(--green);
          display: block;
          font-size: 15px;
          font-weight: 900;
          line-height: 1.24;
          margin-bottom: 5px;
        }

        .bw-blog-index .bw-row-link span {
          color: var(--muted);
          display: block;
          font-family: var(--serif);
          font-size: 13px;
          line-height: 1.45;
        }

        .bw-blog-index .bw-compact-link {
          align-items: start;
          background: transparent;
          border: 0;
          border-top: 1px solid var(--text);
          border-radius: 0;
          display: grid;
          gap: 8px;
          grid-template-columns: 82px minmax(0, 1fr);
          min-width: 0;
          overflow: hidden;
          padding: 12px 0;
          text-decoration: none;
          transition: background 160ms ease, border-color 160ms ease, transform 160ms ease;
        }

        .bw-blog-index .bw-compact-link:hover,
        .bw-blog-index .bw-compact-link:focus-visible {
          background: #FFFFFF;
          border-color: var(--text);
          transform: translateY(-1px);
        }

        .bw-blog-index .bw-compact-link .bw-mini-meta {
          color: var(--muted);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.8px;
          line-height: 1.25;
          min-width: 0;
          overflow-wrap: anywhere;
          text-transform: uppercase;
        }

        .bw-blog-index .bw-compact-link b {
          color: var(--text);
          display: block;
          font-size: 14px;
          font-weight: 900;
          line-height: 1.25;
          min-width: 0;
          overflow-wrap: anywhere;
        }

        .bw-blog-index .bw-footer-band {
          background: var(--green);
          color: #FFFFFF;
          padding: 42px 0;
          position: relative;
        }

        .bw-blog-index .bw-footer-band .bw-inner {
          align-items: center;
          display: flex;
          gap: 20px;
          justify-content: space-between;
        }

        .bw-blog-index .bw-footer-band h2 {
          color: #FFFFFF;
          font-size: 28px;
          font-weight: 900;
          line-height: 1.12;
          margin-bottom: 7px;
        }

        .bw-blog-index .bw-footer-band p {
          color: rgba(255, 255, 255, 0.9);
          font-family: var(--serif);
          line-height: 1.55;
          margin-bottom: 0;
        }

        .bw-blog-index .bw-cta {
          background: var(--yellow);
          border-radius: 999px;
          color: var(--green);
          display: inline-flex;
          flex: 0 0 auto;
          font-size: 13px;
          font-weight: 900;
          justify-content: center;
          letter-spacing: 0.8px;
          min-height: 46px;
          padding: 0 24px;
          text-decoration: none;
          text-transform: uppercase;
          align-items: center;
        }

        @media (max-width: 980px) {
          .bw-blog-index .bw-hero-grid,
          .bw-blog-index .bw-lead-card,
          .bw-blog-index .bw-controls {
            grid-template-columns: 1fr;
          }

          .bw-blog-index .bw-lead-card {
            height: auto;
            grid-template-rows: 320px auto;
          }

          .bw-blog-index .bw-topic-nav {
            justify-content: flex-start;
          }

          .bw-blog-index .bw-post-grid,
          .bw-blog-index .bw-tool-grid,
          .bw-blog-index .bw-compact-grid,
          .bw-blog-index .bw-result-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .bw-blog-index,
          .bw-blog-index .bw-blog-index-root,
          .bw-blog-index .bw-hero,
          .bw-blog-index .bw-main,
          .bw-blog-index .bw-masthead,
          .bw-blog-index .bw-hero-grid,
          .bw-blog-index .bw-secondary-stack,
          .bw-blog-index .bw-lead-card,
          .bw-blog-index .bw-small-card,
          .bw-blog-index .bw-controls,
          .bw-blog-index .bw-search,
          .bw-blog-index .bw-topic-nav,
          .bw-blog-index .bw-results,
          .bw-blog-index .bw-section,
          .bw-blog-index .bw-tools-band,
          .bw-blog-index .bw-compact-grid,
          .bw-blog-index .bw-tool-grid,
          .bw-blog-index .bw-footer-band {
            max-width: 100%;
            min-width: 0;
            width: 100%;
          }

          .bw-blog-index .bw-inner {
            padding-left: 16px;
            padding-right: 16px;
          }

          .bw-blog-index .bw-hero {
            padding: 34px 0 28px;
          }

          .bw-blog-index h1 {
            font-size: 36px;
          }

          .bw-blog-index .bw-hero-lead {
            font-size: 16px;
            max-width: 100%;
            width: 100%;
          }

          .bw-blog-index .bw-lead-card {
            grid-template-rows: 236px auto;
          }

          .bw-blog-index .bw-lead-copy {
            max-width: 100%;
            min-width: 0;
            overflow: hidden;
            padding: 22px;
          }

          .bw-blog-index .bw-lead-title {
            font-size: 24px;
            overflow-wrap: anywhere;
          }

          .bw-blog-index .bw-small-card {
            grid-template-columns: 96px minmax(0, 1fr);
            overflow: hidden;
          }

          .bw-blog-index .bw-small-copy {
            max-width: 100%;
            min-width: 0;
            overflow: hidden;
          }

          .bw-blog-index .bw-small-card .bw-media {
            min-height: 142px;
          }

          .bw-blog-index .bw-small-title {
            font-size: 15px;
          }

          .bw-blog-index .bw-small-card .bw-card-text {
            display: none;
          }

          .bw-blog-index .bw-post-grid,
          .bw-blog-index .bw-tool-grid,
          .bw-blog-index .bw-compact-grid,
          .bw-blog-index .bw-result-grid {
            grid-template-columns: 1fr;
          }

          .bw-blog-index .bw-post-card {
            grid-template-rows: 206px auto;
          }

          .bw-blog-index .bw-post-copy {
            min-height: 0;
          }

          .bw-blog-index .bw-section-header,
          .bw-blog-index .bw-footer-band .bw-inner {
            align-items: stretch;
            flex-direction: column;
          }

          .bw-blog-index .bw-cta {
            width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bw-blog-index a,
          .bw-blog-index button {
            transition: none !important;
          }
        }
      </style>

      <section class="bw-blog-index" aria-labelledby="bw-blog-index-title">
        <div class="bw-blog-index-root" aria-live="polite"></div>
      </section>
    `;
  }

  async _loadDataAndRender() {
    try {
      const response = await fetch(BW_BLOG_INDEX_DATA_URL, { cache: 'no-cache' });
      if (!response.ok) throw new Error('Blog data unavailable');
      this._data = await response.json();
    } catch (error) {
      this._data = BW_BLOG_INDEX_FALLBACK;
    }
    this._rerender();
  }

  _rerender() {
    this._render();
    this._bindControls();
    this._setupAnimations();
  }

  _render() {
    const root = this.querySelector('.bw-blog-index-root');
    if (!root) return;
    const activeView = Boolean(this._query || this._topic !== 'all');
    root.removeAttribute('aria-live');
    root.innerHTML = `
      ${this._renderHero()}
      <main class="bw-main">
        <div class="bw-inner">
          ${this._renderControls()}
          ${this._renderResults()}
          ${activeView ? this._renderToolsBand() : ''}
          ${this._renderShelves()}
          ${activeView ? '' : this._renderToolsBand()}
          ${this._renderLatest()}
        </div>
      </main>
      ${this._renderFooter()}
    `;
  }

  _renderHero() {
    const lead = this._data.hero?.lead;
    const secondary = this._data.hero?.secondary || [];
    return `
      <header class="bw-hero">
        <div class="bw-inner">
          <div class="bw-masthead">
            <div>
              <span class="bw-kicker">Field notes from BerlinWalk</span>
              <h1 id="bw-blog-index-title">Berlin Travel &amp; History Notes</h1>
              <p class="bw-hero-lead">Practical guides, route stories, history explainers, and first-day fixes for visitors who want Berlin to make sense before they start walking.</p>
            </div>
          </div>

          <div class="bw-hero-grid">
            ${lead ? this._renderLeadCard(lead) : ''}
            <div>
              <div class="bw-secondary-stack">
                ${secondary.map((post) => this._renderSmallCard(post)).join('')}
              </div>
            </div>
          </div>
        </div>
      </header>
    `;
  }

  _renderControls() {
    const topics = this._data.navTopics || [];
    return `
      <div class="bw-controls" aria-label="Blog controls">
        <label class="bw-search">
          <span class="bw-visually-hidden">Search Berlin guides</span>
          <input type="search" data-bw-blog-search placeholder="Search Berlin guides" value="${this._escapeAttribute(this._query)}">
        </label>
        <nav class="bw-topic-nav" aria-label="Blog topics">
          <button class="bw-topic-btn" type="button" data-topic="all" aria-pressed="${this._topic === 'all'}">All</button>
          ${topics.map((topic) => `
            <button class="bw-topic-btn" type="button" data-topic="${this._escapeAttribute(topic.key)}" aria-pressed="${this._topic === topic.key}">
              ${this._escapeHtml(topic.navLabel || topic.label)}
            </button>
          `).join('')}
        </nav>
      </div>
    `;
  }

  _renderResults() {
    const active = this._query || this._topic !== 'all';
    const matches = active ? this._filteredPosts() : [];
    const posts = matches.slice(0, 12);
    return `
      <section class="bw-results" ${active ? '' : 'hidden'} aria-label="Filtered guides">
        <div class="bw-section-header">
          <div>
            <span class="bw-card-kicker">${matches.length} matches</span>
            <h2>${this._query ? 'Search results' : 'Topic picks'}</h2>
          </div>
          <a class="bw-view-link" href="https://www.berlinwalk.com/blog" target="_top">Reset view</a>
        </div>
        <div class="bw-compact-grid">
          ${posts.map((post) => this._renderCompactLink(post)).join('') || '<p class="bw-section-desc">No matching guide found.</p>'}
        </div>
      </section>
    `;
  }

  _renderToolsBand() {
    const tools = this._data.tools || [];
    if (!tools.length) return '';
    return `
      <section class="bw-tools-band" aria-labelledby="bw-blog-tools-title">
        <div class="bw-section-header">
          <div>
            <span class="bw-card-kicker">Tools</span>
            <h2 id="bw-blog-tools-title">Useful Berlin tools</h2>
            <p class="bw-section-desc">Quick helpers for tickets, toilets, and first-day decisions.</p>
          </div>
          <a class="bw-view-link" href="https://www.berlinwalk.com/berlin-tools" target="_top">All tools</a>
        </div>
        <div class="bw-tool-grid">
          ${tools.map((tool) => `
            <a class="bw-tool-card" href="${this._escapeAttribute(tool.url)}" target="_top">
              <strong>${this._escapeHtml(tool.title)}</strong>
              <span>${this._escapeHtml(tool.summary)}</span>
            </a>
          `).join('')}
        </div>
      </section>
    `;
  }

  _renderShelves() {
    const shelves = this._data.shelves || [];
    return shelves.map((shelf) => `
      <section class="bw-section" id="bw-topic-${this._escapeAttribute(shelf.key)}" data-bw-animate>
        <div class="bw-section-header">
          <div>
            <span class="bw-card-kicker">${this._escapeHtml(shelf.kicker || 'Guides')}</span>
            <h2>${this._escapeHtml(shelf.title)}</h2>
            <p class="bw-section-desc">${this._escapeHtml(shelf.description || '')}</p>
          </div>
          <a class="bw-view-link" href="#" data-topic-link="${this._escapeAttribute(shelf.key)}">View topic</a>
        </div>
        <div class="bw-compact-grid">
          ${(shelf.posts || []).slice(0, 10).map((post) => this._renderCompactLink(post)).join('')}
        </div>
      </section>
    `).join('');
  }

  _renderLatest() {
    const posts = this._data.latest || [];
    if (!posts.length) return '';
    return `
      <section class="bw-section" data-bw-animate>
        <div class="bw-section-header">
          <div>
            <span class="bw-card-kicker">Newest</span>
            <h2>Latest Berlin notes</h2>
            <p class="bw-section-desc">Freshly published guides and updates from the BerlinWalk archive.</p>
          </div>
        </div>
        <div class="bw-compact-grid">
          ${posts.slice(0, 8).map((post) => this._renderCompactLink(post)).join('')}
        </div>
      </section>
    `;
  }

  _renderFooter() {
    return `
      <footer class="bw-footer-band">
        <div class="bw-inner">
          <div>
            <h2>Want Berlin to click in real life?</h2>
            <p>Join the free tip-based BerlinWalk tour: 12 stops, about 2 hours, starting at the World Clock in Alexanderplatz.</p>
          </div>
          <a class="bw-cta" href="${this._escapeAttribute(this._data.bookingUrl || BW_BLOG_INDEX_FALLBACK.bookingUrl)}" target="_top">Book your free spot</a>
        </div>
      </footer>
    `;
  }

  _renderLeadCard(post) {
    return `
      <a class="bw-lead-card" href="${this._escapeAttribute(post.url)}" target="_top">
        ${this._renderMedia(post, 'image')}
        <span class="bw-lead-copy">
          ${this._renderMeta(post)}
          <span class="bw-lead-title">${this._escapeHtml(post.title)}</span>
          <span class="bw-card-text">${this._escapeHtml(post.excerpt)}</span>
          <span class="bw-read-more">Read the guide</span>
        </span>
      </a>
    `;
  }

  _renderSmallCard(post) {
    return `
      <a class="bw-small-card" href="${this._escapeAttribute(post.url)}" target="_top">
        ${this._renderMedia(post, 'thumb')}
        <span class="bw-small-copy">
          ${this._renderMeta(post)}
          <span class="bw-small-title">${this._escapeHtml(post.title)}</span>
          <span class="bw-card-text">${this._escapeHtml(post.excerpt)}</span>
        </span>
      </a>
    `;
  }

  _renderPostCard(post) {
    return `
      <a class="bw-post-card" href="${this._escapeAttribute(post.url)}" target="_top">
        ${this._renderMedia(post, 'thumb')}
        <span class="bw-post-copy">
          ${this._renderMeta(post)}
          <span class="bw-post-title">${this._escapeHtml(post.title)}</span>
          <span class="bw-card-text">${this._escapeHtml(post.excerpt || '')}</span>
          <span class="bw-read-more">Read guide</span>
        </span>
      </a>
    `;
  }

  _renderCompactLink(post) {
    const meta = [post.category || post.topicLabel || 'Guide', post.readTime].filter(Boolean).join(' · ');
    return `
      <a class="bw-compact-link" href="${this._escapeAttribute(post.url)}" target="_top">
        <span class="bw-mini-meta">${this._escapeHtml(meta)}</span>
        <b>${this._escapeHtml(post.title)}</b>
      </a>
    `;
  }

  _renderStartHere() {
    const links = this._data.startHere || [];
    if (!links.length) return '';
    return `
      <aside class="bw-start-panel" aria-label="Start here">
        <h2>Start here</h2>
        ${links.map((link) => `
          <a class="bw-row-link" href="${this._escapeAttribute(link.url)}" target="_top">
            <b>${this._escapeHtml(link.title)}</b>
            <span>${this._escapeHtml(link.summary)}</span>
          </a>
        `).join('')}
      </aside>
    `;
  }

  _renderMeta(post) {
    const parts = [post.category || post.topicLabel || 'Berlin guide', post.readTime].filter(Boolean);
    return `
      <span class="bw-meta">
        ${parts.map((part, index) => `${index ? '<span class="bw-dot" aria-hidden="true"></span>' : ''}<span>${this._escapeHtml(part)}</span>`).join('')}
      </span>
    `;
  }

  _renderMedia(post, field) {
    const src = post[field] || post.image || post.thumb || '';
    const alt = post.alt || post.title || '';
    if (!src) return '<span class="bw-media"><span class="bw-placeholder" aria-hidden="true">BW</span></span>';
    return `
      <span class="bw-media">
        <img src="${this._escapeAttribute(src)}" alt="${this._escapeAttribute(alt)}" loading="lazy" decoding="async">
      </span>
    `;
  }

  _bindControls() {
    this.querySelectorAll('[data-topic]').forEach((button) => {
      button.addEventListener('click', () => {
        this._topic = button.getAttribute('data-topic') || 'all';
        this._rerender();
      });
    });

    this.querySelectorAll('[data-topic-link]').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        this._topic = link.getAttribute('data-topic-link') || 'all';
        this._rerender();
        this.querySelector('.bw-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    const input = this.querySelector('[data-bw-blog-search]');
    if (input) {
      input.addEventListener('input', () => {
        this._query = input.value.trim();
        this._rerender();
        const nextInput = this.querySelector('[data-bw-blog-search]');
        if (nextInput) {
          nextInput.focus();
          nextInput.setSelectionRange(nextInput.value.length, nextInput.value.length);
        }
      });
    }
  }

  _filteredPosts() {
    const query = this._query.toLowerCase();
    return (this._data.allPosts || []).filter((post) => {
      const matchesTopic = this._topic === 'all' || post.topic === this._topic;
      if (!matchesTopic) return false;
      if (!query) return true;
      return [
        post.title,
        post.excerpt,
        post.category,
        post.topicLabel,
      ].join(' ').toLowerCase().includes(query);
    });
  }

  _setupAnimations() {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
    this.querySelectorAll('[data-bw-animate]').forEach((section) => section.classList.add('visible'));
  }

  _escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    })[ch]);
  }

  _escapeAttribute(value) {
    return this._escapeHtml(value).replace(/`/g, '&#96;');
  }
}

if (!customElements.get('bw-blog-index')) {
  customElements.define('bw-blog-index', BWBlogIndexElement);
}
