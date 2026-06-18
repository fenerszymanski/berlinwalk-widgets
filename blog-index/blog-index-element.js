const BW_BLOG_INDEX_BASE_URL = (() => {
  const script = document.currentScript;
  return script && script.src ? script.src : window.location.href;
})();
const BW_BLOG_INDEX_DATA_URL = new URL('./data.json?v=20260618b', BW_BLOG_INDEX_BASE_URL).href;
const BW_BLOG_INDEX_LOGO_URL = `${new URL('./assets/berlin-travel-history-notes-logo.png', BW_BLOG_INDEX_BASE_URL).href}?v=20260529`;
const BW_BLOG_INDEX_NATIVE_FEED_STYLE_ID = 'bw-blog-index-native-feed-suppressor';
function bwApplyFeaturedPost(data) {
  return {
    ...BW_BLOG_INDEX_FALLBACK,
    ...(data || {}),
  };
}

function bwInstallBlogIndexNativeFeedPrehide() {
  if (!/^\/blog\/?$/.test(window.location.pathname)) return;
  if (document.getElementById(BW_BLOG_INDEX_NATIVE_FEED_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = BW_BLOG_INDEX_NATIVE_FEED_STYLE_ID;
  style.textContent = `
    #comp-mm3d94ml,
    [data-bw-native-blog-feed-hidden="true"] {
      display: none !important;
      height: 0 !important;
      min-height: 0 !important;
      max-height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
      visibility: hidden !important;
    }
  `;
  (document.head || document.documentElement).appendChild(style);
}

bwInstallBlogIndexNativeFeedPrehide();

const BW_BLOG_INDEX_FALLBACK = {
  totalPosts: 0,
  bookingUrl: 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based',
  navTopics: [],
  hero: { lead: null, secondary: [] },
  startHere: [],
  tools: [],
  popular: [],
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
    this._nativeFeedObserver = null;
  }

  connectedCallback() {
    this._renderShell();
    this._installWixNativeBlogFeedSuppressor();
    this._loadDataAndRender();
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
    if (this._nativeFeedObserver) this._nativeFeedObserver.disconnect();
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
          border-bottom: 1px solid #D7D7CF;
          color: var(--text);
          padding: 22px 0 34px;
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
          border-bottom: 1px solid #D7D7CF;
          display: grid;
          gap: 16px;
          grid-template-columns: minmax(240px, 460px) minmax(0, 1fr);
          margin-bottom: 26px;
          padding-bottom: 16px;
        }

        .bw-blog-index .bw-blog-logo-link {
          align-self: start;
          display: block;
          max-width: 460px;
          min-width: 0;
          text-decoration: none;
          width: 100%;
        }

        .bw-blog-index .bw-blog-logo {
          display: block;
          height: auto;
          max-width: 100%;
          width: 100%;
        }

        .bw-blog-index .bw-masthead-side {
          align-content: end;
          display: grid;
          gap: 12px;
          justify-items: end;
          min-width: 0;
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
          font-size: 15px;
          line-height: 1.5;
          margin-bottom: 0;
          max-width: 500px;
          overflow-wrap: anywhere;
          text-align: right;
        }

        .bw-blog-index .bw-hero-grid {
          align-items: start;
          display: grid;
          gap: 36px;
          grid-template-columns: minmax(0, 1.62fr) minmax(330px, 0.88fr);
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
          background: transparent;
          display: block;
          height: auto;
          min-height: 0;
        }

        .bw-blog-index .bw-lead-card > .bw-media {
          aspect-ratio: 1.82 / 1;
          display: block;
          min-height: 0;
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
          background: rgba(250, 250, 245, 0.94);
          border-left: 8px solid var(--yellow);
          display: block;
          margin: -50px 0 0 52px;
          max-width: calc(100% - 52px);
          padding: 26px 32px 22px;
          position: relative;
          z-index: 1;
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
          font-size: 46px;
          font-weight: 900;
          letter-spacing: 0;
          line-height: 1.02;
          margin-bottom: 9px;
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
          border-top: 0;
          display: grid;
          gap: 0;
          max-width: 100%;
          min-width: 0;
        }

        .bw-blog-index .bw-small-card {
          align-items: start;
          background: transparent;
          border-bottom: 1px solid #D7D7CF;
          display: grid;
          gap: 16px;
          grid-template-columns: minmax(0, 1fr) 90px;
          min-height: 0;
          padding: 14px 0;
        }

        .bw-blog-index .bw-small-card:first-child {
          padding-top: 0;
        }

        .bw-blog-index .bw-small-card .bw-media {
          aspect-ratio: 1 / 0.82;
          min-height: 0;
          order: 2;
        }

        .bw-blog-index .bw-small-copy {
          background: transparent;
          order: 1;
          padding: 0;
        }

        .bw-blog-index .bw-small-title {
          color: var(--text);
          display: block;
          font-size: 19px;
          font-weight: 900;
          line-height: 1.1;
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
          display: flex;
          margin-bottom: 24px;
        }

        .bw-blog-index .bw-search {
          max-width: 360px;
          position: relative;
          width: 100%;
        }

        .bw-blog-index .bw-search input {
          background: #FFFFFF;
          border: 1px solid #D7D7CF;
          border-radius: 4px;
          color: var(--text);
          font: 800 14px/1 Montserrat, Arial, sans-serif;
          min-height: 46px;
          padding: 0 18px;
          width: 100%;
        }

        .bw-blog-index .bw-topic-nav {
          display: flex;
          flex-wrap: wrap;
          gap: 7px 8px;
          justify-content: flex-end;
          min-width: 0;
        }

        .bw-blog-index .bw-topic-btn {
          align-items: center;
          background: #FFFFFF;
          border: 1px solid #D7D7CF;
          border-radius: 4px;
          color: var(--green);
          cursor: pointer;
          display: inline-flex;
          font: 900 12px/1 Montserrat, Arial, sans-serif;
          min-height: 34px;
          padding: 0 12px;
          text-decoration: none;
          transition: background 160ms ease, border-color 160ms ease, color 160ms ease;
        }

        .bw-blog-index .bw-topic-btn:hover,
        .bw-blog-index .bw-topic-btn:focus-visible {
          background: var(--yellow);
          border-color: var(--yellow);
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
          scroll-margin-top: 86px;
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

        .bw-blog-index .bw-section-copy {
          min-width: 0;
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

        .bw-blog-index .bw-shelf-actions {
          align-items: center;
          display: flex;
          flex: 0 0 auto;
          gap: 8px;
        }

        .bw-blog-index .bw-shelf-arrow {
          align-items: center;
          background: transparent;
          border: 1px solid var(--text);
          border-radius: 0;
          color: var(--text);
          cursor: pointer;
          display: inline-flex;
          font: 900 22px/1 Montserrat, Arial, sans-serif;
          height: 38px;
          justify-content: center;
          padding: 0;
          width: 38px;
        }

        .bw-blog-index .bw-shelf-arrow:hover,
        .bw-blog-index .bw-shelf-arrow:focus-visible {
          background: var(--yellow);
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

        .bw-blog-index .bw-card-row {
          display: grid;
          grid-auto-columns: calc(100% / 5);
          grid-auto-flow: column;
          gap: 0;
          margin-top: 6px;
          max-width: 100%;
          overflow-x: auto;
          overscroll-behavior-x: contain;
          padding-bottom: 12px;
          scroll-behavior: smooth;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
        }

        .bw-blog-index .bw-card-row::-webkit-scrollbar {
          display: none;
        }

        .bw-blog-index .bw-shelf-card {
          color: var(--text);
          display: block;
          min-width: 0;
          padding: 0 22px;
          scroll-snap-align: start;
          text-decoration: none;
        }

        .bw-blog-index .bw-shelf-card:first-child {
          padding-left: 0;
        }

        .bw-blog-index .bw-shelf-card:not(:last-child) {
          border-right: 1px solid #D7D7CF;
        }

        .bw-blog-index .bw-shelf-card .bw-media {
          aspect-ratio: 1.5 / 1;
          display: block;
          margin-bottom: 14px;
          min-height: 0;
        }

        .bw-blog-index .bw-shelf-title {
          color: var(--text);
          display: block;
          font-size: 20px;
          font-weight: 900;
          line-height: 1.12;
          margin-bottom: 12px;
          overflow-wrap: anywhere;
        }

        .bw-blog-index .bw-byline {
          color: #333333;
          display: block;
          font-size: 12px;
          letter-spacing: 1.3px;
          line-height: 1.2;
          text-transform: uppercase;
        }

        .bw-blog-index .bw-popular-signup {
          display: grid;
          gap: 72px;
          grid-template-columns: minmax(0, 1fr) minmax(300px, 0.38fr);
          margin: 58px 0 44px;
        }

        .bw-blog-index .bw-popular-signup h2 {
          color: var(--text);
          font-size: 34px;
          font-weight: 900;
          letter-spacing: 0;
          line-height: 1.08;
          margin-bottom: 22px;
        }

        .bw-blog-index .bw-popular-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .bw-blog-index .bw-popular-list li {
          border-bottom: 1px solid #D7D7CF;
        }

        .bw-blog-index .bw-popular-list a {
          align-items: start;
          display: grid;
          gap: 22px;
          grid-template-columns: 44px minmax(0, 1fr);
          padding: 18px 0;
          text-decoration: none;
        }

        .bw-blog-index .bw-rank {
          align-items: center;
          background: var(--yellow);
          border-radius: 999px;
          color: var(--text);
          display: inline-flex;
          font-size: 16px;
          font-weight: 900;
          height: 34px;
          justify-content: center;
          width: 34px;
        }

        .bw-blog-index .bw-popular-title {
          color: var(--text);
          display: block;
          font-size: 26px;
          font-weight: 500;
          line-height: 1.18;
          overflow-wrap: anywhere;
        }

        .bw-blog-index .bw-newsletter-box {
          align-self: start;
          border: 2px dotted var(--text);
          padding: 28px 30px;
        }

        .bw-blog-index .bw-newsletter-box p {
          color: var(--text);
          font-family: "Courier New", Courier, monospace;
          font-size: 17px;
          line-height: 1.32;
          margin-bottom: 22px;
        }

        .bw-blog-index .bw-newsletter-box strong {
          font-family: Montserrat, Arial, sans-serif;
          font-weight: 900;
        }

        .bw-blog-index .bw-newsletter-form {
          display: grid;
          gap: 14px;
        }

        .bw-blog-index .bw-newsletter-form input {
          background: #FFFFFF;
          border: 1px solid var(--text);
          border-radius: 0;
          color: var(--text);
          font: 500 17px/1 Montserrat, Arial, sans-serif;
          min-height: 54px;
          padding: 0 16px;
          width: 100%;
        }

        .bw-blog-index .bw-newsletter-form button {
          background: var(--yellow);
          border: 0;
          border-radius: 0;
          color: var(--text);
          cursor: pointer;
          font: 900 14px/1 Montserrat, Arial, sans-serif;
          justify-self: start;
          min-height: 52px;
          padding: 0 28px;
        }

        .bw-blog-index .bw-newsletter-status {
          color: var(--muted);
          font-size: 12px;
          font-weight: 800;
          line-height: 1.45;
          margin: 0;
          min-height: 18px;
        }

        .bw-blog-index .bw-feature-section {
          margin-top: 48px;
        }

        .bw-blog-index .bw-feature-section .bw-section-header {
          align-items: start;
          margin-bottom: 28px;
        }

        .bw-blog-index .bw-feature-section h2 {
          font-size: clamp(34px, 5vw, 58px);
          line-height: 0.96;
          margin: 0;
        }

        .bw-blog-index .bw-feature-grid {
          display: grid;
          gap: 38px;
          grid-template-columns: minmax(0, 1.45fr) repeat(2, minmax(0, 0.72fr));
        }

        .bw-blog-index .bw-feature-card {
          color: var(--text);
          display: block;
          min-width: 0;
          text-decoration: none;
        }

        .bw-blog-index .bw-feature-card .bw-media {
          aspect-ratio: 1.35 / 1;
          display: block;
          margin-bottom: 16px;
          min-height: 0;
        }

        .bw-blog-index .bw-feature-lead .bw-media {
          aspect-ratio: 1.55 / 1;
          margin-bottom: 0;
        }

        .bw-blog-index .bw-feature-lead-copy {
          background: transparent;
          margin: 18px 0 0;
          max-width: 100%;
          padding: 0;
          position: relative;
          z-index: 1;
        }

        .bw-blog-index .bw-feature-title {
          color: var(--text);
          display: block;
          font-size: 26px;
          font-weight: 900;
          line-height: 1.08;
          margin-bottom: 8px;
          overflow-wrap: anywhere;
        }

        .bw-blog-index .bw-feature-lead .bw-feature-title {
          font-size: 32px;
          line-height: 1.06;
        }

        .bw-blog-index .bw-feature-excerpt {
          color: #4D4D47;
          display: block;
          font-family: var(--serif);
          font-size: 18px;
          line-height: 1.36;
          margin-bottom: 12px;
          overflow-wrap: anywhere;
        }

        .bw-blog-index .bw-feature-bottom {
          border-top: 2px dotted var(--text);
          display: grid;
          gap: 32px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 38px;
          padding-top: 34px;
        }

        .bw-blog-index .bw-feature-mini {
          align-items: start;
          color: var(--text);
          display: grid;
          gap: 16px;
          grid-template-columns: 96px minmax(0, 1fr);
          min-width: 0;
          text-decoration: none;
        }

        .bw-blog-index .bw-feature-mini .bw-media {
          aspect-ratio: 1 / 1;
          display: block;
          min-height: 0;
        }

        .bw-blog-index .bw-feature-mini b {
          color: var(--text);
          display: block;
          font-family: var(--serif);
          font-size: 21px;
          font-weight: 500;
          line-height: 1.14;
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
          .bw-blog-index .bw-masthead {
            grid-template-columns: 1fr;
          }

          .bw-blog-index .bw-lead-card {
            height: auto;
            grid-template-rows: 320px auto;
          }

          .bw-blog-index .bw-topic-nav {
            justify-content: flex-start;
          }

          .bw-blog-index .bw-masthead-side {
            justify-items: start;
          }

          .bw-blog-index .bw-hero-lead {
            text-align: left;
          }

          .bw-blog-index .bw-post-grid,
          .bw-blog-index .bw-tool-grid,
          .bw-blog-index .bw-compact-grid,
          .bw-blog-index .bw-result-grid,
          .bw-blog-index .bw-feature-bottom {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .bw-blog-index .bw-card-row {
            grid-auto-columns: 50%;
          }

          .bw-blog-index .bw-popular-signup,
          .bw-blog-index .bw-feature-grid {
            grid-template-columns: 1fr;
          }

          .bw-blog-index .bw-feature-lead-copy {
            max-width: 100%;
            margin-left: 0;
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
          .bw-blog-index .bw-card-row,
          .bw-blog-index .bw-popular-signup,
          .bw-blog-index .bw-feature-grid,
          .bw-blog-index .bw-feature-bottom,
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
            padding: 22px 0 26px;
          }

          .bw-blog-index .bw-masthead {
            gap: 12px;
            margin-bottom: 20px;
          }

          .bw-blog-index .bw-blog-logo-link {
            max-width: 360px;
          }

          .bw-blog-index .bw-hero-lead {
            font-size: 14px;
            max-width: 100%;
            width: 100%;
          }

          .bw-blog-index .bw-lead-card {
            grid-template-rows: 236px auto;
          }

          .bw-blog-index .bw-lead-copy {
            max-width: 100%;
            min-width: 0;
            margin: -34px 0 0 22px;
            max-width: calc(100% - 22px);
            overflow: hidden;
            padding: 20px;
          }

          .bw-blog-index .bw-lead-title {
            font-size: 24px;
            overflow-wrap: anywhere;
          }

          .bw-blog-index .bw-small-card {
            gap: 14px;
            grid-template-columns: minmax(0, 1fr) 92px;
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
          .bw-blog-index .bw-result-grid,
          .bw-blog-index .bw-feature-bottom {
            grid-template-columns: 1fr;
          }

          .bw-blog-index .bw-section-header {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .bw-blog-index .bw-card-row {
            grid-auto-columns: minmax(252px, 84%);
          }

          .bw-blog-index .bw-shelf-card {
            border-bottom: 0;
            border-right: 1px solid #D7D7CF !important;
            padding: 0 18px 0 0;
          }

          .bw-blog-index .bw-shelf-card + .bw-shelf-card {
            padding-left: 18px;
            padding-top: 0;
          }

          .bw-blog-index .bw-popular-signup {
            gap: 28px;
            margin: 42px 0 34px;
          }

          .bw-blog-index .bw-popular-list a {
            gap: 14px;
            grid-template-columns: 36px minmax(0, 1fr);
          }

          .bw-blog-index .bw-popular-title {
            font-size: 20px;
          }

          .bw-blog-index .bw-newsletter-box {
            padding: 22px;
          }

          .bw-blog-index .bw-feature-section h2 {
            font-size: 36px;
          }

          .bw-blog-index .bw-feature-lead-copy {
            margin: 16px 0 0;
            max-width: 100%;
            padding: 0;
          }

          .bw-blog-index .bw-feature-lead .bw-feature-title,
          .bw-blog-index .bw-feature-title {
            font-size: 27px;
          }

          .bw-blog-index .bw-feature-mini {
            grid-template-columns: 82px minmax(0, 1fr);
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
      this._data = bwApplyFeaturedPost(await response.json());
    } catch (error) {
      this._data = bwApplyFeaturedPost(BW_BLOG_INDEX_FALLBACK);
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
    root.removeAttribute('aria-live');
    root.innerHTML = `
      ${this._renderHero()}
      <main class="bw-main">
        <div class="bw-inner">
          ${this._renderControls()}
          ${this._renderResults()}
          ${this._renderShelves()}
          ${this._renderToolsBand()}
          ${this._renderLatest()}
        </div>
      </main>
      ${this._renderFooter()}
    `;
  }

  _renderHero() {
    const lead = this._data.hero?.lead;
    const secondary = (this._data.hero?.secondary || []).slice(0, 5);
    return `
      <header class="bw-hero">
        <div class="bw-inner">
          <div class="bw-masthead">
            <div>
              <h1 id="bw-blog-index-title" class="bw-visually-hidden">Berlin Travel &amp; History Notes</h1>
              <a class="bw-blog-logo-link" href="https://www.berlinwalk.com/blog" target="_top" aria-label="Berlin Travel and History Notes by BerlinWalk">
                <img class="bw-blog-logo" src="${this._escapeAttribute(BW_BLOG_INDEX_LOGO_URL)}" alt="Berlin Travel &amp; History Notes" loading="eager" decoding="async">
              </a>
            </div>
            <div class="bw-masthead-side">
              <p class="bw-hero-lead">Practical guides, route stories, history explainers, and first-day fixes for visitors who want Berlin to make sense before they start walking.</p>
              ${this._renderTopicMenu()}
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
    return `
      <div class="bw-controls" aria-label="Blog controls">
        <label class="bw-search">
          <span class="bw-visually-hidden">Search Berlin guides</span>
          <input type="search" data-bw-blog-search placeholder="Search Berlin guides" value="${this._escapeAttribute(this._query)}">
        </label>
      </div>
    `;
  }

  _renderTopicMenu() {
    const topics = this._data.navTopics || [];
    if (!topics.length) return '';
    return `
      <nav class="bw-topic-nav" aria-label="Blog sections">
        ${topics.map((topic) => `
          <a class="bw-topic-btn" href="#bw-topic-${this._escapeAttribute(topic.key)}" data-topic-scroll="${this._escapeAttribute(topic.key)}">
            ${this._escapeHtml(topic.navLabel || topic.label)}
          </a>
        `).join('')}
      </nav>
    `;
  }

  _renderResults() {
    const active = Boolean(this._query);
    const matches = active ? this._filteredPosts() : [];
    const posts = matches.slice(0, 12);
    return `
      <section class="bw-results" ${active ? '' : 'hidden'} aria-label="Filtered guides">
        <div class="bw-section-header">
          <div>
            <span class="bw-card-kicker">${matches.length} matches</span>
            <h2>Search results</h2>
          </div>
          <a class="bw-view-link" href="#" data-search-reset>Reset search</a>
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
    const featureKey = 'history-myths';
    const featureShelf = shelves.find((shelf) => shelf.key === featureKey);
    const regularShelves = shelves.filter((shelf) => shelf.key !== featureKey);
    const firstRows = regularShelves.slice(0, 2).map((shelf) => this._renderRegularShelf(shelf));
    const restRows = regularShelves.slice(2).map((shelf) => this._renderRegularShelf(shelf));
    return [
      ...firstRows,
      this._renderPopularSignup(),
      featureShelf ? this._renderFeatureShelf(featureShelf) : '',
      ...restRows,
    ].join('');
  }

  _renderRegularShelf(shelf) {
    const posts = (shelf.posts || []).slice(0, 10);
    const shelfTitle = shelf.title || 'Berlin guides';
    const controls = posts.length > 5 ? `
      <div class="bw-shelf-actions" aria-label="${this._escapeAttribute(shelfTitle)} carousel controls">
        <button class="bw-shelf-arrow" type="button" data-shelf-prev aria-label="Previous ${this._escapeAttribute(shelfTitle)} posts">
          <span aria-hidden="true">&larr;</span>
        </button>
        <button class="bw-shelf-arrow" type="button" data-shelf-next aria-label="Next ${this._escapeAttribute(shelfTitle)} posts">
          <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
    ` : '';

    return `
      <section class="bw-section" id="bw-topic-${this._escapeAttribute(shelf.key)}" data-bw-animate>
        <div class="bw-section-header">
          <div class="bw-section-copy">
            <span class="bw-card-kicker">${this._escapeHtml(shelf.kicker || 'Guides')}</span>
            <h2>${this._escapeHtml(shelf.title)}</h2>
            <p class="bw-section-desc">${this._escapeHtml(shelf.description || '')}</p>
          </div>
          ${controls}
        </div>
        <div class="bw-card-row" data-shelf-rail tabindex="0" aria-label="${this._escapeAttribute(shelfTitle)} posts">
          ${posts.map((post) => this._renderShelfCard(post)).join('')}
        </div>
      </section>
    `;
  }

  _renderPopularSignup() {
    const posts = this._popularPosts();
    return `
      <section class="bw-popular-signup" aria-label="Popular Berlin guides and newsletter signup">
        <div>
          <h2>Most Popular</h2>
          <ol class="bw-popular-list">
            ${posts.map((post, index) => `
              <li>
                <a href="${this._escapeAttribute(post.url)}" target="_top">
                  <span class="bw-rank">${index + 1}</span>
                  <span class="bw-popular-title">${this._escapeHtml(post.title)}</span>
                </a>
              </li>
            `).join('')}
          </ol>
        </div>
        <aside class="bw-newsletter-box" aria-label="Berlin Survival Guide signup">
          <p><strong>Berlin Survival Guide</strong> Get the practical first-day guide: tickets, toilets, luggage, Sundays, cash, and the simple route that makes Berlin easier.</p>
          <form class="bw-newsletter-form" data-bw-newsletter-form>
            <label>
              <span class="bw-visually-hidden">Email address</span>
              <input type="email" name="email" placeholder="Enter your email" autocomplete="email" required>
            </label>
            <button type="submit">Sign Up</button>
            <span class="bw-newsletter-status" data-bw-newsletter-status aria-live="polite"></span>
          </form>
        </aside>
      </section>
    `;
  }

  _renderFeatureShelf(shelf) {
    const posts = (shelf.posts || []).slice(0, 6);
    const lead = posts[0];
    const side = posts.slice(1, 3);
    const bottom = posts.slice(3, 6);
    if (!lead) return '';
    return `
      <section class="bw-section bw-feature-section" id="bw-topic-${this._escapeAttribute(shelf.key)}" data-bw-animate>
        <div class="bw-section-header">
          <div>
            <h2>${this._escapeHtml(shelf.title)}</h2>
          </div>
        </div>
        <div class="bw-feature-grid">
          ${this._renderFeatureLead(lead)}
          ${side.map((post) => this._renderFeatureCard(post)).join('')}
        </div>
        <div class="bw-feature-bottom">
          ${bottom.map((post) => this._renderFeatureMini(post)).join('')}
        </div>
      </section>
    `;
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

  _renderShelfCard(post) {
    return `
      <a class="bw-shelf-card" href="${this._escapeAttribute(post.url)}" target="_top">
        ${this._renderMedia(post, 'thumb')}
        <span class="bw-shelf-title">${this._escapeHtml(post.title)}</span>
        <span class="bw-byline">By BerlinWalk</span>
      </a>
    `;
  }

  _renderFeatureLead(post) {
    return `
      <a class="bw-feature-card bw-feature-lead" href="${this._escapeAttribute(post.url)}" target="_top">
        ${this._renderMedia(post, 'image')}
        <span class="bw-feature-lead-copy">
          ${this._renderMeta(post)}
          <span class="bw-feature-title">${this._escapeHtml(post.title)}</span>
          <span class="bw-feature-excerpt">${this._escapeHtml(post.excerpt || '')}</span>
          <span class="bw-byline">By BerlinWalk</span>
        </span>
      </a>
    `;
  }

  _renderFeatureCard(post) {
    return `
      <a class="bw-feature-card" href="${this._escapeAttribute(post.url)}" target="_top">
        ${this._renderMedia(post, 'thumb')}
        ${this._renderMeta(post)}
        <span class="bw-feature-title">${this._escapeHtml(post.title)}</span>
        <span class="bw-feature-excerpt">${this._escapeHtml(post.excerpt || '')}</span>
        <span class="bw-byline">By BerlinWalk</span>
      </a>
    `;
  }

  _renderFeatureMini(post) {
    return `
      <a class="bw-feature-mini" href="${this._escapeAttribute(post.url)}" target="_top">
        ${this._renderMedia(post, 'thumb')}
        <span>
          ${this._renderMeta(post)}
          <b>${this._escapeHtml(post.title)}</b>
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

  _popularPosts() {
    if (Array.isArray(this._data.popular) && this._data.popular.length) {
      return this._data.popular.slice(0, 7);
    }

    const curatedSlugs = [
      'berlin-first-time-visitor-mistakes-12-things-to-know-before-you-go',
      'public-toilets-in-berlin',
      'berlin-public-transport-explained-for-tourists-u-bahn-s-bahn-tram-bus',
      'free-things-to-do-in-berlin-2026',
      'where-was-the-berlin-wall-interactive-map',
      'nikolaiviertel-rebuilt-old-town',
      'best-currywurst-places-in-berlin-2026',
    ];
    const posts = this._data.allPosts || [];
    const bySlug = new Map(posts.map((post) => [post.slug, post]));
    const picked = [];
    const seen = new Set();
    curatedSlugs.forEach((slug) => {
      const post = bySlug.get(slug);
      if (post && !seen.has(post.slug)) {
        picked.push(post);
        seen.add(post.slug);
      }
    });
    posts.forEach((post) => {
      if (picked.length >= 7) return;
      if (!seen.has(post.slug)) {
        picked.push(post);
        seen.add(post.slug);
      }
    });
    return picked.slice(0, 7);
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
    this.querySelectorAll('[data-topic-scroll]').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const topic = link.getAttribute('data-topic-scroll');
        const target = topic ? this.querySelector(`#bw-topic-${topic}`) : null;
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    this.querySelectorAll('[data-search-reset]').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        this._query = '';
        this._rerender();
        this.querySelector('[data-bw-blog-search]')?.focus();
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

    this.querySelectorAll('[data-shelf-prev], [data-shelf-next]').forEach((button) => {
      button.addEventListener('click', () => {
        const section = button.closest('.bw-section');
        const rail = section?.querySelector('[data-shelf-rail]');
        if (!rail) return;
        const direction = button.hasAttribute('data-shelf-prev') ? -1 : 1;
        const distance = Math.max(rail.clientWidth * 0.86, 260);
        rail.scrollBy({ left: direction * distance, behavior: 'smooth' });
      });
    });

    this.querySelectorAll('[data-bw-newsletter-form]').forEach((form) => {
      form.addEventListener('submit', (event) => this._submitNewsletter(event, form));
    });
  }

  async _submitNewsletter(event, form) {
    event.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const button = form.querySelector('button');
    const status = form.querySelector('[data-bw-newsletter-status]');
    const email = (input?.value || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (status) status.textContent = 'Please enter a valid email address.';
      input?.focus();
      return;
    }

    if (button) {
      button.disabled = true;
      button.textContent = 'Sending...';
    }
    if (status) status.textContent = '';

    try {
      const response = await fetch('https://www.berlinwalk.com/_functions/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'blog-index-newsletter',
          offer: 'berlin-survival-map',
          page: window.location.href,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) throw new Error(data.error || 'subscribe_failed');
      form.reset();
      if (status) status.textContent = 'Saved. Check your inbox for the Berlin Survival Guide.';
    } catch {
      if (status) status.textContent = 'Something went wrong. Please try again.';
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = 'Sign Up';
      }
    }
  }

  _filteredPosts() {
    const query = this._query.toLowerCase();
    return (this._data.allPosts || []).filter((post) => {
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

  _installWixNativeBlogFeedSuppressor() {
    if (!this._isBlogIndexPage()) return;

    bwInstallBlogIndexNativeFeedPrehide();

    const hideNativeFeed = () => {
      const exactSection = document.getElementById('comp-mm3d94ml');
      if (exactSection && !exactSection.contains(this)) {
        this._hideNativeFeedSection(exactSection);
      }

      const feedRoots = document.querySelectorAll([
        '[data-hook="feed-page-root"]',
        '[data-hook="post-list-pro-gallery-container"]',
        '[data-hook="blog-desktop-header-container"]',
      ].join(','));

      feedRoots.forEach((feedRoot) => {
        const section = feedRoot.closest('section[id^="comp-"]') || feedRoot.closest('[id^="comp-"]');
        if (section && !section.contains(this)) {
          this._hideNativeFeedSection(section);
        }
      });
    };

    hideNativeFeed();
    this._nativeFeedObserver = new MutationObserver(hideNativeFeed);
    this._nativeFeedObserver.observe(document.body, { childList: true, subtree: true });
  }

  _hideNativeFeedSection(section) {
    section.setAttribute('data-bw-native-blog-feed-hidden', 'true');
    section.setAttribute('aria-hidden', 'true');
    section.style.setProperty('display', 'none', 'important');
    section.style.setProperty('height', '0', 'important');
    section.style.setProperty('min-height', '0', 'important');
    section.style.setProperty('max-height', '0', 'important');
    section.style.setProperty('margin', '0', 'important');
    section.style.setProperty('padding', '0', 'important');
    section.style.setProperty('overflow', 'hidden', 'important');
    section.style.setProperty('visibility', 'hidden', 'important');
  }

  _isBlogIndexPage() {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    return path === '/blog';
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
