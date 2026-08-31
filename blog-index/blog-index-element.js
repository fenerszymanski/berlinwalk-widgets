const BW_BLOG_INDEX_BASE_URL = (() => {
  const script = document.currentScript;
  return script && script.src ? script.src : window.location.href;
})();
const BW_BLOG_INDEX_DATA_VERSION = '20260831-featured-listings';
const BW_BLOG_INDEX_DATA_URL = `${new URL('./index.json', BW_BLOG_INDEX_BASE_URL).href}?v=${BW_BLOG_INDEX_DATA_VERSION}`;
const BW_BLOG_INDEX_ARCHIVE_URL = `${new URL('./archive.json', BW_BLOG_INDEX_BASE_URL).href}?v=${BW_BLOG_INDEX_DATA_VERSION}`;
const BW_BLOG_INDEX_LEGACY_DATA_URL = `${new URL('./data.json', BW_BLOG_INDEX_BASE_URL).href}?v=${BW_BLOG_INDEX_DATA_VERSION}`;
const BW_BLOG_INDEX_LOGO_URL = `${new URL('./assets/berlin-travel-history-notes-logo.png', BW_BLOG_INDEX_BASE_URL).href}?v=20260529`;
const BW_BLOG_INDEX_NATIVE_FEED_STYLE_ID = 'bw-blog-index-native-feed-suppressor';

// Redesign C (flag-gated preview of the /blog hub in the live single-post
// Redesign C visual language). See BLOG_INDEX_REDESIGN_C_HANDOFF.md.
const BW_BLOG_INDEX_REDESIGN_DEFAULT_ON = true;
const BW_BLOG_INDEX_PORTRAIT_URL = new URL('../blog-hero/assets/yusuf-guide-portrait.jpg', BW_BLOG_INDEX_BASE_URL).href;
const BW_BLOG_INDEX_TOURBAND_IMAGE_URL = new URL('../blog-hero/assets/tour-cta-yusuf-rathaus-solo.jpg', BW_BLOG_INDEX_BASE_URL).href;
const BW_BLOG_INDEX_FRAUNCES_URL = new URL('../brand/fonts/editorial-v2/Fraunces-Variable.woff2', BW_BLOG_INDEX_BASE_URL).href;
const BW_BLOG_INDEX_FRAUNCES_ITALIC_URL = new URL('../brand/fonts/editorial-v2/Fraunces-Italic-Variable.woff2', BW_BLOG_INDEX_BASE_URL).href;
const BW_BLOG_INDEX_PLEX_MONO_URL = new URL('../brand/fonts/editorial-v2/IBMPlexMono-SemiBold.woff2', BW_BLOG_INDEX_BASE_URL).href;
const BW_BLOG_INDEX_BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
const BW_BLOG_INDEX_TOPIC_TAGS = {
  'first-day': 'AIRPORT · TICKETS · SUNDAYS',
  'practical': 'TRANSPORT · MONEY · SAFETY',
  'free-budget': 'FREE SIGHTS · SAVING',
  'route-stories': 'THE HISTORIC CENTRE',
  'history-myths': 'CONTEXT · LEGENDS',
  'food-nightlife': 'DÖNER · CLUBS · SPÄTIS',
  'when-to-visit': 'TIMING · SEASONS',
};

function bwBlogIndexRedesignOn() {
  try {
    // An explicit choice always beats the default, in both directions, so the
    // legacy hub stays reachable at ?bwblogredesign=0 now that the redesign is
    // the default. Neither form is written to storage: the query string is a
    // per-request override, localStorage only answers when someone set it.
    const param = new URLSearchParams(window.location.search).get('bwblogredesign');
    if (param === '0') return false;
    if (param === '1') return true;
    const stored = window.localStorage.getItem('bwBlogRedesign');
    if (stored === '0') return false;
    if (stored === '1') return true;
    return BW_BLOG_INDEX_REDESIGN_DEFAULT_ON;
  } catch (error) {
    return BW_BLOG_INDEX_REDESIGN_DEFAULT_ON;
  }
}

function bwBlogIndexFetchJsonOnce(url) {
  const store = window.__BW_BLOG_DATA_PROMISES || (window.__BW_BLOG_DATA_PROMISES = {});
  if (!store[url]) {
    store[url] = fetch(url, { cache: 'force-cache' })
      .then((response) => {
        if (!response.ok) throw new Error(`Blog data unavailable: ${response.status}`);
        return response.json();
      })
      .catch((error) => {
        delete store[url];
        throw error;
      });
  }
  return store[url];
}
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
    this._archiveLoaded = false;
    this._archiveLoading = false;
    this._archivePromise = null;
    this._redesignOn = bwBlogIndexRedesignOn();
    this._showAllArchive = false;
    this._scrollspyBound = false;
    this._scrollspyHandler = null;
    this._lastKnownScheduleC = '';
    this._initialTopicHashHandled = false;
  }

  connectedCallback() {
    if (this._redesignOn) {
      this._renderShellC();
    } else {
      this._renderShell();
    }
    this._installWixNativeBlogFeedSuppressor();
    this._loadDataAndRender();
    if (this._redesignOn) this._scheduleScheduleRecheckC();
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
    if (this._nativeFeedObserver) this._nativeFeedObserver.disconnect();
    if (this._scrollspyHandler) {
      window.removeEventListener('scroll', this._scrollspyHandler);
      window.removeEventListener('resize', this._scrollspyHandler);
      this._scrollspyHandler = null;
      this._scrollspyBound = false;
    }
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
          grid-template-columns: minmax(0, 1fr);
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
      this._data = bwApplyFeaturedPost(await bwBlogIndexFetchJsonOnce(BW_BLOG_INDEX_DATA_URL));
    } catch (error) {
      try {
        this._data = bwApplyFeaturedPost(await bwBlogIndexFetchJsonOnce(BW_BLOG_INDEX_LEGACY_DATA_URL));
      } catch (legacyError) {
        this._data = bwApplyFeaturedPost(BW_BLOG_INDEX_FALLBACK);
      }
    }
    this._archiveLoaded = Array.isArray(this._data.allPosts) && this._data.allPosts.length > 0;
    this._rerender();
    this._scrollToInitialTopicHash();
  }

  _scrollToInitialTopicHash() {
    if (this._initialTopicHashHandled) return;
    const match = /^#bw-topic-([a-z0-9-]+)$/.exec(window.location.hash || '');
    if (!match) {
      this._initialTopicHashHandled = true;
      return;
    }
    const topicKey = match[1];
    const knownTopic = (this._data.navTopics || []).some((topic) => topic.key === topicKey);
    if (!knownTopic) {
      this._initialTopicHashHandled = true;
      return;
    }
    const target = this.querySelector(`[id="bw-topic-${topicKey}"]`);
    if (!target) return;
    this._initialTopicHashHandled = true;
    window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: 'auto', block: 'start' });
    });
  }

  _loadArchive() {
    if (this._archiveLoaded) return Promise.resolve(this._data.allPosts || []);
    if (this._archivePromise) return this._archivePromise;

    this._archiveLoading = true;
    this._archivePromise = bwBlogIndexFetchJsonOnce(BW_BLOG_INDEX_ARCHIVE_URL)
      .catch(() => bwBlogIndexFetchJsonOnce(BW_BLOG_INDEX_LEGACY_DATA_URL))
      .then((archive) => {
        this._data = { ...this._data, allPosts: Array.isArray(archive?.allPosts) ? archive.allPosts : [] };
        this._archiveLoaded = true;
        return this._data.allPosts;
      })
      .finally(() => {
        this._archiveLoading = false;
        this._archivePromise = null;
      });
    return this._archivePromise;
  }

  _rerender() {
    if (this._redesignOn) {
      this._renderC();
      this._bindControlsC();
      return;
    }
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
    const loading = active && this._archiveLoading && !this._archiveLoaded;
    const matches = active && !loading ? this._filteredPosts() : [];
    const posts = matches.slice(0, 12);
    return `
      <section class="bw-results" ${active ? '' : 'hidden'} aria-label="Filtered guides">
        <div class="bw-section-header">
          <div>
            <span class="bw-card-kicker">${loading ? 'Loading guides' : `${matches.length} matches`}</span>
            <h2>Search results</h2>
          </div>
          <a class="bw-view-link" href="#" data-search-reset>Reset search</a>
        </div>
        <div class="bw-compact-grid">
          ${loading ? '<p class="bw-section-desc">Loading the full Berlin guide archive…</p>' : posts.map((post) => this._renderCompactLink(post)).join('') || '<p class="bw-section-desc">No matching guide found.</p>'}
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
      <section class="bw-popular-signup" aria-label="Popular Berlin guides">
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
        ${this._renderMedia(post, 'image', { priority: true })}
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

  _renderMedia(post, field, options = {}) {
    const src = post[field] || post.image || post.thumb || '';
    const alt = post.alt || post.title || '';
    if (!src) return '<span class="bw-media"><span class="bw-placeholder" aria-hidden="true">BW</span></span>';
    const loading = options.priority ? 'eager' : 'lazy';
    const fetchPriority = options.priority ? ' fetchpriority="high"' : '';
    return `
      <span class="bw-media">
        <img src="${this._escapeAttribute(src)}" alt="${this._escapeAttribute(alt)}" loading="${loading}" decoding="async"${fetchPriority}>
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
        if (this._query && !this._archiveLoaded) {
          this._loadArchive().then(() => {
            if (!this.isConnected) return;
            this._rerender();
            this._restoreSearchFocus();
          }).catch(() => {});
        }
        this._rerender();
        this._restoreSearchFocus();
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

  }

  _restoreSearchFocus() {
    const nextInput = this.querySelector('[data-bw-blog-search]');
    if (!nextInput) return;
    nextInput.focus();
    nextInput.setSelectionRange(nextInput.value.length, nextInput.value.length);
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

  // ===== Redesign C (flag-gated) =====================================

  _renderShellC() {
    this.innerHTML = `
      <style id="bw-blog-index-c-fonts">
        bw-blog-index { display: block; width: 100%; }

        @font-face { font-family: Fraunces; font-style: normal; font-weight: 100 900; font-display: swap; src: url(${BW_BLOG_INDEX_FRAUNCES_URL}) format('woff2'); }
        @font-face { font-family: Fraunces; font-style: italic; font-weight: 100 900; font-display: swap; src: url(${BW_BLOG_INDEX_FRAUNCES_ITALIC_URL}) format('woff2'); }
        @font-face { font-family: 'IBM Plex Mono'; font-style: normal; font-weight: 600; font-display: swap; src: url(${BW_BLOG_INDEX_PLEX_MONO_URL}) format('woff2'); }

        .bw-ci {
          --green: #1B5E20; --deep: #123D18; --night: #102414; --yellow: #FFE600; --lime: #7CB342;
          --lightgreen: #C5E1A5; --cream: #FAFAF5; --ink: #212121; --muted: #5C665A;
          --card: #FFFFFF; --line: #E4E9DF; --rule: #DDE4D6; --radius: 14px;
          background: var(--cream);
          color: var(--ink);
          display: block;
          font-family: Merriweather, Georgia, serif;
          margin: 0;
          max-width: 100%;
          overflow-x: hidden;
          width: 100%;
          -webkit-font-smoothing: antialiased;
        }
        .bw-ci, .bw-ci *, .bw-ci *::before, .bw-ci *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .bw-ci img { display: block; max-width: 100%; }
        .bw-ci a { color: var(--green); text-decoration: none; }
        .bw-ci a:focus-visible, .bw-ci button:focus-visible, .bw-ci input:focus-visible {
          outline: 3px solid rgba(255, 230, 0, 0.92); outline-offset: 2px;
        }
        .bw-ci .bw-visually-hidden {
          clip: rect(0 0 0 0); border: 0; height: 1px; margin: -1px; overflow: hidden;
          padding: 0; position: absolute; white-space: nowrap; width: 1px;
        }

        /* night hero */
        .bw-ci-hero {
          background-color: var(--night);
          background-image: linear-gradient(rgba(250, 250, 245, .05) 1px, transparent 1px), linear-gradient(90deg, rgba(250, 250, 245, .05) 1px, transparent 1px);
          background-size: 34px 34px;
          color: var(--cream);
          padding: 64px 28px 56px;
        }
        .bw-ci-hero-in { max-width: 880px; margin: 0 auto; text-align: center; }
        .bw-ci-eyebrow { font: 500 12px/1 'IBM Plex Mono', ui-monospace, monospace; letter-spacing: .22em; color: var(--lime); margin-bottom: 24px; text-transform: uppercase; }
        .bw-ci-h1 { font-family: Fraunces, Merriweather, Georgia, serif; font-weight: 600; font-size: clamp(34px, 5.5vw, 58px); line-height: 1.05; letter-spacing: -.015em; margin-bottom: 20px; color: var(--cream); }
        .bw-ci-h1 em { font-style: italic; color: var(--yellow); font-weight: 600; font-synthesis: none; }
        .bw-ci-dek { font: italic 300 18.5px/1.65 Merriweather, Georgia, serif; color: rgba(250, 250, 245, .85); max-width: 620px; margin: 0 auto 30px; }
        .bw-ci-search { max-width: 560px; margin: 0 auto 26px; display: flex; background: rgba(250, 250, 245, .06); border: 1px solid rgba(250, 250, 245, .22); border-radius: 999px; padding: 6px 6px 6px 22px; align-items: center; gap: 12px; }
        .bw-ci-search input { flex: 1; min-width: 0; background: transparent; border: 0; color: var(--cream); font: 500 12.5px/1 'IBM Plex Mono', ui-monospace, monospace; letter-spacing: .06em; padding: 10px 0; }
        .bw-ci-search input::placeholder { color: rgba(250, 250, 245, .55); text-transform: uppercase; }
        .bw-ci-search-status { font: 500 11.5px/1.5 'IBM Plex Mono', ui-monospace, monospace; letter-spacing: .1em; color: var(--lightgreen); text-transform: uppercase; margin: -14px 0 22px; min-height: 17px; }
        .bw-ci-search-status a { color: var(--yellow); text-decoration: underline; text-underline-offset: 3px; }
        .bw-ci-search-go { background: var(--yellow); color: var(--deep); font: 800 12px/1 Montserrat, Arial, sans-serif; letter-spacing: .06em; padding: 11px 20px; border-radius: 999px; border: 0; cursor: pointer; flex: 0 0 auto; }
        .bw-ci-topics { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
        /* Chips are anchors, so every colour needs to outrank the generic
           '.bw-ci a' rule (0,1,1) or it silently reverts to dark green. */
        .bw-ci a.bw-ci-topic-chip { font: 700 11.5px/1 Montserrat, Arial, sans-serif; letter-spacing: .04em; color: var(--lightgreen); border: 1.5px solid rgba(197, 225, 165, .42); padding: 10px 15px; border-radius: 999px; min-height: 40px; display: inline-flex; align-items: center; }
        .bw-ci a.bw-ci-topic-chip.bw-ci-on { background: var(--yellow); border-color: var(--yellow); color: var(--deep); }

        /* stat strip */
        .bw-ci-strip { border-bottom: 1px solid var(--rule); background: #fff; }
        .bw-ci-strip-in { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); }
        .bw-ci-tile { padding: 24px 26px 22px; border-left: 1px solid var(--rule); min-width: 0; }
        .bw-ci-tile:first-child { border-left: none; }
        .bw-ci-tl { font: 500 10.5px/1 'IBM Plex Mono', ui-monospace, monospace; letter-spacing: .18em; color: var(--muted); margin-bottom: 10px; }
        .bw-ci-tv { font: 800 19px/1.15 Montserrat, Arial, sans-serif; color: var(--deep); margin-bottom: 6px; overflow-wrap: anywhere; }
        .bw-ci-tn { font: 400 12.5px/1.55 Merriweather, Georgia, serif; color: var(--muted); }

        /* mobile sticky chip row */
        .bw-ci-mobile-toc { display: none; position: sticky; top: 0; z-index: 80; background: var(--cream); border-bottom: 1px solid var(--rule); padding: 10px 0; }
        .bw-ci-mobile-toc-scroll { display: flex; gap: 8px; overflow-x: auto; padding: 0 20px; scrollbar-width: none; }
        .bw-ci-mobile-toc-scroll::-webkit-scrollbar { display: none; }
        .bw-ci a.bw-ci-mobile-chip { flex-shrink: 0; font: 700 12px/1 Montserrat, Arial, sans-serif; border: 1.5px solid var(--line); background: #fff; color: #43503f; padding: 10px 14px; border-radius: 999px; white-space: nowrap; min-height: 40px; display: inline-flex; align-items: center; }
        .bw-ci a.bw-ci-mobile-chip.bw-ci-on { background: var(--yellow); border-color: var(--yellow); color: var(--deep); }

        /* layout: left rail + hub column */
        .bw-ci-page { max-width: 1200px; margin: 0 auto; padding: 56px 28px 24px; display: grid; grid-template-columns: 210px minmax(0, 860px); gap: 64px; justify-content: center; }
        .bw-ci-rail-stick { position: sticky; top: 40px; }
        .bw-ci-r-label { font: 600 10.5px/1 'IBM Plex Mono', ui-monospace, monospace; letter-spacing: .2em; color: var(--muted); margin-bottom: 18px; text-transform: uppercase; }
        .bw-ci-toc-link { display: flex; gap: 12px; align-items: baseline; font: 500 12px/1.5 'IBM Plex Mono', ui-monospace, monospace; color: #5a6656; padding: 6px 0; }
        .bw-ci-toc-link .bw-ci-n { color: var(--green); font-weight: 600; font-size: 11px; }
        .bw-ci-toc-link.bw-ci-on { color: var(--ink); font-weight: 600; }
        .bw-ci-toc-link.bw-ci-on .bw-ci-n { color: var(--green); }
        .bw-ci-toc-link.bw-ci-on .bw-ci-t { background: linear-gradient(transparent 62%, rgba(255, 230, 0, .55) 62%); }
        .bw-ci-rail-tour { margin-top: 30px; background: var(--night); color: var(--cream); padding: 18px 18px 20px; border-radius: 12px; }
        .bw-ci-rt-label { font: 600 9.5px/1 'IBM Plex Mono', ui-monospace, monospace; letter-spacing: .18em; color: var(--lightgreen); margin-bottom: 10px; text-transform: uppercase; }
        .bw-ci-rt-title { font: 800 14.5px/1.35 Montserrat, Arial, sans-serif; color: #fff; margin-bottom: 8px; }
        .bw-ci-rt-line { font: 500 10.5px/1.7 'IBM Plex Mono', ui-monospace, monospace; color: #CBDCC2; margin-bottom: 12px; }
        .bw-ci-rt-cta { display: block; text-align: center; background: var(--yellow); color: var(--deep); font: 800 12px/1 Montserrat, Arial, sans-serif; padding: 12px 8px; border-radius: 999px; min-height: 40px; line-height: 16px; }
        .bw-ci-rail-tool { margin-top: 14px; border: 1px solid var(--rule); background: #fff; border-radius: 12px; padding: 14px 16px; display: block; }
        .bw-ci-rl-label { font: 600 9.5px/1 'IBM Plex Mono', ui-monospace, monospace; letter-spacing: .18em; color: var(--muted); margin-bottom: 8px; text-transform: uppercase; }
        .bw-ci-rl-title { font: 800 13.5px/1.3 Montserrat, Arial, sans-serif; margin-bottom: 4px; color: var(--ink); }
        .bw-ci-rl-link { font: 700 11.5px/1 Montserrat, Arial, sans-serif; color: var(--green); }

        /* hub sections */
        .bw-ci-hub { min-width: 0; padding-bottom: 24px; scroll-margin-top: 90px; }
        .bw-ci-sec-label {
          font: 600 11px/1 'IBM Plex Mono', ui-monospace, monospace; letter-spacing: .22em; color: var(--muted);
          margin: 48px 0 22px; display: flex; align-items: center; gap: 14px; text-transform: uppercase;
        }
        .bw-ci-sec-label::after { content: ""; flex: 1; height: 1px; background: var(--rule); }
        .bw-ci-view-all { font: 700 11px/1 Montserrat, Arial, sans-serif; letter-spacing: .04em; color: var(--green); white-space: nowrap; text-transform: none; }
        .bw-ci-results:not([hidden]) + .bw-ci-sec-label,
        .bw-ci-hub > .bw-ci-sec-label:first-of-type { margin-top: 0; }

        /* search results */
        .bw-ci-results[hidden] { display: none; }
        .bw-ci-linklist { display: grid; gap: 0; }
        .bw-ci-loading { font: 400 13px/1.6 Merriweather, Georgia, serif; color: var(--muted); padding: 12px 0; }

        /* lead feature */
        .bw-ci-feature { display: grid; grid-template-columns: 1.25fr 1fr; gap: 0; background: var(--card); border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; margin-bottom: 18px; }
        .bw-ci-f-img { position: relative; min-height: 340px; display: block; background: var(--rule); }
        .bw-ci-f-img img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .bw-ci-f-body { padding: 30px 32px 28px; display: flex; flex-direction: column; min-width: 0; }
        .bw-ci-f-cat { font: 600 10.5px/1 'IBM Plex Mono', ui-monospace, monospace; letter-spacing: .16em; color: var(--green); margin-bottom: 14px; }
        .bw-ci-f-title { display: block; font-family: Fraunces, Merriweather, Georgia, serif; font-weight: 600; font-size: 31px; line-height: 1.14; letter-spacing: -.01em; margin-bottom: 14px; color: var(--ink); overflow-wrap: anywhere; }
        .bw-ci-f-ex { display: block; font: 400 15px/1.7 Merriweather, Georgia, serif; color: #3c443c; margin-bottom: 22px; overflow-wrap: anywhere; }
        .bw-ci-f-cta { display: inline-block; background: var(--yellow); color: var(--deep); font: 800 12.5px/1 Montserrat, Arial, sans-serif; padding: 12px 22px; border-radius: 999px; margin: 0 0 20px; align-self: flex-start; }
        .bw-ci-f-meta { margin-top: auto; display: flex; align-items: center; gap: 12px; font: 500 10.5px/1 'IBM Plex Mono', ui-monospace, monospace; letter-spacing: .12em; color: var(--muted); text-transform: uppercase; }
        .bw-ci-f-meta img { width: 30px; height: 30px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255, 230, 0, .6); flex: 0 0 auto; }

        /* secondary numbered list */
        .bw-ci-second { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0 40px; border-top: 1px solid var(--rule); margin-bottom: 8px; }
        .bw-ci-second a { display: flex; gap: 16px; align-items: flex-start; padding: 16px 0; border-bottom: 1px solid var(--rule); min-width: 0; }
        .bw-ci-second .bw-ci-n { font: 600 12px/1 'IBM Plex Mono', ui-monospace, monospace; color: var(--green); padding-top: 5px; flex: 0 0 auto; }
        .bw-ci-second .bw-ci-t { display: block; font: 800 15px/1.4 Montserrat, Arial, sans-serif; color: var(--ink); overflow-wrap: anywhere; }
        .bw-ci-second .bw-ci-m { display: block; font: 500 10px/1 'IBM Plex Mono', ui-monospace, monospace; letter-spacing: .14em; color: var(--muted); margin-top: 7px; }

        /* rel-card grid */
        .bw-ci-grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        /* The compact link rows open with a hairline border, so without this
           they sit flush against the card row above them. */
        .bw-ci-grid3 + .bw-ci-linklist { margin-top: 24px; }
        .bw-ci-rel-card { background: var(--card); border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; display: block; min-width: 0; transition: border-color 160ms ease, transform 160ms ease; }
        .bw-ci-rel-card:hover, .bw-ci-rel-card:focus-visible { border-color: var(--green); transform: translateY(-1px); }
        .bw-ci-im { position: relative; display: block; background: var(--rule); }
        .bw-ci-im img { height: 150px; width: 100%; object-fit: cover; }
        .bw-ci-date { position: absolute; left: 0; bottom: 0; background: rgba(16, 36, 20, .85); color: var(--cream); font: 500 9.5px/1 'IBM Plex Mono', ui-monospace, monospace; letter-spacing: .14em; padding: 7px 10px; }
        .bw-ci-rc-in { display: block; padding: 14px 16px 18px; }
        .bw-ci-rc-cat { display: block; font: 600 10px/1 'IBM Plex Mono', ui-monospace, monospace; letter-spacing: .14em; color: var(--green); margin-bottom: 8px; }
        .bw-ci-rc-title { display: block; font: 800 15px/1.35 Montserrat, Arial, sans-serif; color: var(--ink); overflow-wrap: anywhere; }

        /* compact mono link list */
        .bw-ci-compact-link { display: block; border-top: 1px solid var(--rule); padding: 12px 0; min-width: 0; }
        .bw-ci-compact-link .bw-ci-mini-meta { display: block; font: 600 10px/1 'IBM Plex Mono', ui-monospace, monospace; letter-spacing: .1em; color: var(--muted); margin-bottom: 5px; overflow-wrap: anywhere; }
        .bw-ci-compact-link b { display: block; font: 700 14px/1.3 Montserrat, Arial, sans-serif; color: var(--ink); font-weight: 700; overflow-wrap: anywhere; }

        /* advice band */
        .bw-ci-advice { margin: 0 0 8px; border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); padding: 26px 4px; }
        .bw-ci-advice-label { font: 600 10.5px/1 'IBM Plex Mono', ui-monospace, monospace; letter-spacing: .22em; color: var(--green); margin-bottom: 13px; display: flex; align-items: center; gap: 12px; text-transform: uppercase; }
        .bw-ci-advice-label::after { content: ""; height: 1px; width: 44px; background: var(--yellow); }
        .bw-ci-advice p { font-family: Fraunces, Merriweather, Georgia, serif; font-style: italic; font-weight: 400; font-size: 21px; line-height: 1.5; color: #243024; }
        .bw-ci-mark { background: linear-gradient(transparent 58%, rgba(255, 230, 0, .6) 58%); font-weight: 600; }

        /* start here numbered */
        .bw-ci-start { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .bw-ci-start a { background: var(--card); border: 1px solid var(--line); border-radius: var(--radius); padding: 20px 20px 22px; display: block; min-width: 0; }
        .bw-ci-sn { display: flex; align-items: center; justify-content: center; flex: 0 0 auto; width: 28px; height: 28px; border-radius: 50%; background: var(--deep); color: var(--yellow); font: 800 13px/1 Montserrat, Arial, sans-serif; text-align: center; margin-bottom: 14px; }
        .bw-ci-st { display: block; font: 800 15.5px/1.35 Montserrat, Arial, sans-serif; color: var(--ink); margin-bottom: 7px; overflow-wrap: anywhere; }
        .bw-ci-ss { display: block; font: 400 12.5px/1.6 Merriweather, Georgia, serif; color: var(--muted); overflow-wrap: anywhere; }

        /* popular numbered */
        .bw-ci-pop { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0 40px; border-top: 1px solid var(--rule); }
        .bw-ci-pop a { display: flex; gap: 16px; align-items: baseline; padding: 15px 0; border-bottom: 1px solid var(--rule); min-width: 0; }
        .bw-ci-pop .bw-ci-n { font-family: Fraunces, Merriweather, Georgia, serif; font-style: italic; font-weight: 600; font-size: 22px; color: var(--green); min-width: 30px; flex: 0 0 auto; }
        .bw-ci-pop .bw-ci-t { display: block; font: 800 14.5px/1.4 Montserrat, Arial, sans-serif; color: var(--ink); overflow-wrap: anywhere; }
        .bw-ci-pop .bw-ci-c { display: block; font: 500 9.5px/1 'IBM Plex Mono', ui-monospace, monospace; letter-spacing: .14em; color: var(--muted); margin-top: 6px; }

        /* tools: widget-frame language */
        .bw-ci-tools { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .bw-ci-tool { border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; background: var(--card); display: block; min-width: 0; }
        .bw-ci-bar { display: flex; align-items: center; gap: 10px; background: var(--night); color: #EAF2E6; padding: 10px 16px; font: 600 10px/1 'IBM Plex Mono', ui-monospace, monospace; letter-spacing: .16em; }
        .bw-ci-pulse { width: 8px; height: 8px; border-radius: 50%; background: var(--yellow); flex: 0 0 auto; }
        .bw-ci-inner { padding: 18px 18px 20px; display: block; }
        .bw-ci-w-title { display: block; font: 900 16.5px/1.25 Montserrat, Arial, sans-serif; color: var(--ink); margin-bottom: 8px; overflow-wrap: anywhere; }
        .bw-ci-w-sub { display: block; font: 400 12.5px/1.6 Merriweather, Georgia, serif; color: var(--muted); margin-bottom: 14px; overflow-wrap: anywhere; }
        .bw-ci-w-link { display: block; font: 700 12px/1 Montserrat, Arial, sans-serif; color: var(--green); }

        /* every topic band */
        .bw-ci-topicband { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px 40px; border-top: 1px solid var(--rule); padding-top: 6px; }
        .bw-ci-topicband a { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; padding: 13px 0; border-bottom: 1px solid var(--rule); min-width: 0; }
        .bw-ci-tt { font: 800 14.5px/1.3 Montserrat, Arial, sans-serif; color: var(--ink); }
        .bw-ci-tk { font: 500 10px/1 'IBM Plex Mono', ui-monospace, monospace; letter-spacing: .16em; color: var(--green); white-space: nowrap; }

        /* Full-width tour band. The post redesign paints this in --night, but on
           /blog the Wix site footer is also --night, so the two merged into one
           dark mass. Brand green keeps the band in the family and still separates
           it from both the cream page above and the near-black footer below. */
        .bw-ci-tourband {
          background-color: var(--green);
          background-image: linear-gradient(rgba(250, 250, 245, .07) 1px, transparent 1px), linear-gradient(90deg, rgba(250, 250, 245, .07) 1px, transparent 1px);
          background-size: 34px 34px; color: var(--cream); margin-top: 40px;
          border-top: 1px solid rgba(197, 225, 165, .25);
        }
        .bw-ci-tourband-inner { display: grid; grid-template-columns: minmax(320px, 44%) minmax(0, 1fr); margin: 0 auto; max-width: 1120px; min-height: 380px; }
        .bw-ci-tourband-photo { margin: 0; min-height: 380px; overflow: hidden; }
        .bw-ci-tourband-photo img { display: block; height: 100%; object-fit: cover; object-position: 54% center; width: 100%; }
        .bw-ci-tourband-copy { align-self: center; padding: 48px clamp(28px, 5vw, 64px); }
        .bw-ci-tb-eyebrow { font: 600 11px/1 'IBM Plex Mono', ui-monospace, monospace; letter-spacing: .18em; color: var(--lightgreen); margin-bottom: 16px; text-transform: uppercase; }
        .bw-ci-tourband-copy h2 { color: var(--cream); font: 600 clamp(30px, 3.6vw, 42px)/1.12 Fraunces, Merriweather, Georgia, serif; margin: 0 0 16px; max-width: 560px; }
        .bw-ci-tb-sub { color: rgba(250, 250, 245, .84); font: 500 12px/1.8 'IBM Plex Mono', ui-monospace, monospace; text-transform: uppercase; }
        .bw-ci-tb-div { border-top: 2px dashed var(--yellow); margin: 24px 0 0; width: 110px; }
        .bw-ci-tb-cta { display: inline-block; background: var(--yellow); color: var(--deep); font: 800 14px/1 Montserrat, Arial, sans-serif; padding: 15px 30px; border-radius: 999px; margin-top: 26px; }

        @media (max-width: 1080px) {
          .bw-ci-page { grid-template-columns: minmax(0, 1fr); gap: 0; padding-top: 24px; }
          .bw-ci-rail { display: none; }
          .bw-ci-mobile-toc { display: block; }
          .bw-ci-strip-in { grid-template-columns: repeat(2, 1fr); }
          .bw-ci-tile:nth-child(2) { border-left: none; }
          .bw-ci-tile:nth-child(3) { border-left: 1px solid var(--rule); }
          .bw-ci-tile:nth-child(2), .bw-ci-tile:nth-child(3) { border-top: 1px solid var(--rule); }
          .bw-ci-tile:nth-child(4) { border-top: 1px solid var(--rule); }
          .bw-ci-feature, .bw-ci-second, .bw-ci-grid3, .bw-ci-start, .bw-ci-pop, .bw-ci-tools, .bw-ci-topicband {
            grid-template-columns: 1fr;
          }
          .bw-ci-f-img { min-height: 220px; }
          .bw-ci-im img { height: 190px; }
        }
        @media (max-width: 760px) {
          .bw-ci-hero { padding: 44px 22px 40px; }
          .bw-ci-h1 { font-size: 34px; }
          .bw-ci-dek { font-size: 16px; }
          .bw-ci-search { padding: 6px 6px 6px 18px; }
          .bw-ci-tourband-inner { display: block; min-height: 0; }
          .bw-ci-tourband-photo { height: 230px; min-height: 0; }
          .bw-ci-tourband-copy { padding: 36px 22px 42px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .bw-ci a, .bw-ci button { transition: none !important; }
        }
      </style>

      <section class="bw-ci" aria-labelledby="bw-ci-title">
        <span class="bw-visually-hidden bw-hero-grid" aria-hidden="true" data-bw-ci-legacy-render-marker="1"></span>
        <div class="bw-ci-root" aria-live="polite"></div>
      </section>
    `;
  }

  _renderC() {
    const root = this.querySelector('.bw-ci-root');
    if (!root) return;
    root.removeAttribute('aria-live');
    root.innerHTML = `
      ${this._renderHeroC()}
      ${this._renderStripC()}
      ${this._renderMobileTocC()}
      <div class="bw-ci-page">
        ${this._renderRailC()}
        <main class="bw-ci-hub" id="bw-ci-hub-top">
          ${this._renderSearchResultsC()}
          ${this._renderLeadFeatureC()}
          ${this._renderSecondaryC()}
          ${this._renderNewThisWeekC()}
          ${this._renderAdviceC()}
          ${this._renderStartHereC()}
          ${(this._data.shelves || []).map((shelf) => this._renderShelfSectionC(shelf)).join('')}
          ${this._renderPopularC()}
          ${this._renderToolsBandC()}
          ${this._renderTopicBandC()}
        </main>
      </div>
      ${this._renderTourBandC()}
    `;
  }

  _renderHeroC() {
    const total = this._data.totalPosts;
    const eyebrow = `THE BERLINWALK BLOG${total ? ` · ${total} GUIDES` : ''} · NEW MOST MORNINGS`;
    const topics = this._data.navTopics || [];
    return `
      <header class="bw-ci-hero">
        <div class="bw-ci-hero-in">
          <p class="bw-ci-eyebrow">${this._escapeHtml(eyebrow)}</p>
          <h1 id="bw-ci-title" class="bw-ci-h1">Berlin Travel &amp; <em>History</em> Notes</h1>
          <p class="bw-ci-dek">I guide Berlin's historic centre most days. These are the notes I would hand you before you start walking: real stations, real prices, one clear move at a time.</p>
          <form class="bw-ci-search" data-bw-ci-search-form role="search">
            <label class="bw-visually-hidden" for="bw-ci-search-input">Search Berlin guides</label>
            <input id="bw-ci-search-input" type="search" data-bw-ci-search placeholder="${this._escapeAttribute(this._searchPlaceholderC())}" value="${this._escapeAttribute(this._query)}">
            <button type="submit" class="bw-ci-search-go">Search</button>
          </form>
          ${this._renderSearchStatusC()}
          <nav class="bw-ci-topics" aria-label="Blog sections">
            <a href="#bw-ci-hub-top" class="bw-ci-topic-chip" data-bw-ci-topic="all">All guides</a>
            ${topics.map((topic) => `<a href="#bw-topic-${this._escapeAttribute(topic.key)}" class="bw-ci-topic-chip" data-bw-ci-topic="${this._escapeAttribute(topic.key)}">${this._escapeHtml(topic.navLabel || topic.label)}</a>`).join('')}
          </nav>
        </div>
      </header>
    `;
  }

  _renderStripC() {
    const total = this._data.totalPosts;
    const guidesValue = total ? String(total) : '–';
    const updated = this._updatedTileValueC() || '–';
    const tour = this._tourTileC();
    return `
      <div class="bw-ci-strip">
        <div class="bw-ci-strip-in">
          <div class="bw-ci-tile"><div class="bw-ci-tl">GUIDES</div><div class="bw-ci-tv">${this._escapeHtml(guidesValue)}</div><div class="bw-ci-tn">Practical, route and history</div></div>
          <div class="bw-ci-tile"><div class="bw-ci-tl">UPDATED</div><div class="bw-ci-tv">${this._escapeHtml(updated)}</div><div class="bw-ci-tn">New guides most mornings</div></div>
          <div class="bw-ci-tile"><div class="bw-ci-tl">FREE TOOLS</div><div class="bw-ci-tv">${this._escapeHtml(this._toolsTotalLabelC())}</div><div class="bw-ci-tn">Maps, tickets, day plans</div></div>
          <div class="bw-ci-tile"><div class="bw-ci-tl">FREE TOUR</div><div class="bw-ci-tv">${this._escapeHtml(tour.value)}</div><div class="bw-ci-tn">${this._escapeHtml(tour.note)}</div></div>
        </div>
      </div>
    `;
  }

  _renderMobileTocC() {
    const topics = this._data.navTopics || [];
    return `
      <nav class="bw-ci-mobile-toc" aria-label="Blog sections, mobile">
        <div class="bw-ci-mobile-toc-scroll">
          <a href="#bw-ci-hub-top" class="bw-ci-mobile-chip" data-bw-ci-topic="all">All</a>
          ${topics.map((topic) => `<a href="#bw-topic-${this._escapeAttribute(topic.key)}" class="bw-ci-mobile-chip" data-bw-ci-topic="${this._escapeAttribute(topic.key)}">${this._escapeHtml(topic.navLabel || topic.label)}</a>`).join('')}
        </div>
      </nav>
    `;
  }

  _renderRailC() {
    const topics = this._data.navTopics || [];
    const schedule = this._nextTourLabelC();
    const tool = (this._data.tools || [])[0];
    return `
      <aside class="bw-ci-rail">
        <div class="bw-ci-rail-stick">
          <p class="bw-ci-r-label">BROWSE BY TOPIC</p>
          <a href="#bw-ci-hub-top" class="bw-ci-toc-link" data-bw-ci-topic="all"><span class="bw-ci-n">00</span><span class="bw-ci-t">All guides</span></a>
          ${topics.map((topic, index) => `
            <a href="#bw-topic-${this._escapeAttribute(topic.key)}" class="bw-ci-toc-link" data-bw-ci-topic="${this._escapeAttribute(topic.key)}">
              <span class="bw-ci-n">${String(index + 1).padStart(2, '0')}</span><span class="bw-ci-t">${this._escapeHtml(topic.label)}</span>
            </a>
          `).join('')}
          <div class="bw-ci-rail-tour">
            <div class="bw-ci-rt-label">FREE WALKING TOUR</div>
            <div class="bw-ci-rt-title">See the centre with me in 2 hours</div>
            <div class="bw-ci-rt-line">${schedule ? `${this._escapeHtml(schedule)}<br>` : ''}★ 9.8/10 · FREE, TIP-BASED</div>
            <a class="bw-ci-rt-cta" href="${this._escapeAttribute(this._data.bookingUrl || BW_BLOG_INDEX_BOOKING_URL)}" target="_top">Reserve a spot</a>
          </div>
          ${tool ? `
            <a class="bw-ci-rail-tool" href="${this._escapeAttribute(tool.url)}" target="_top">
              <div class="bw-ci-rl-label">START WITH A TOOL</div>
              <div class="bw-ci-rl-title">${this._escapeHtml(tool.title)}</div>
              <span class="bw-ci-rl-link">Open the tool →</span>
            </a>
          ` : ''}
        </div>
      </aside>
    `;
  }

  _renderSearchStatusC() {
    if (!this._query && !this._showAllArchive) return '<p class="bw-ci-search-status" data-bw-ci-search-status role="status" aria-live="polite"></p>';
    let text;
    if (this._archiveLoading && !this._archiveLoaded) {
      text = 'Searching the archive…';
    } else {
      const count = this._filteredPosts().length;
      text = count
        ? `${count} ${count === 1 ? 'guide matches' : 'guides match'} · <a href="#bw-ci-results" data-bw-ci-jump-results>See them</a>`
        : 'No guide matches that yet. Try a place, a station or a month.';
    }
    return `<p class="bw-ci-search-status" data-bw-ci-search-status role="status" aria-live="polite">${text}</p>`;
  }

  _renderSearchResultsC() {
    const active = Boolean(this._query) || this._showAllArchive;
    if (!active) return '<section class="bw-ci-results" id="bw-ci-results" hidden></section>';
    const loading = this._archiveLoading && !this._archiveLoaded;
    const isAllGuides = this._showAllArchive && !this._query;
    const matches = !loading ? this._filteredPosts() : [];
    const posts = isAllGuides ? matches : matches.slice(0, 24);
    const label = 'SEARCH RESULTS';
    const body = loading
      ? '<p class="bw-ci-loading">Loading the full Berlin guide archive…</p>'
      : (posts.map((post) => this._renderCompactLinkC(post)).join('') || '<p class="bw-ci-loading">No matching guide found.</p>');
    const truncated = !loading && matches.length > posts.length
      ? `<p class="bw-ci-loading">Showing the first ${posts.length} of ${matches.length} matches. Add a word to narrow it down.</p>`
      : '';
    return `
      <section class="bw-ci-results" id="bw-ci-results" aria-label="Filtered guides">
        <div class="bw-ci-sec-label">${label} <a class="bw-ci-view-all" href="#" data-bw-ci-search-reset>Close</a></div>
        <div class="bw-ci-linklist">${body}</div>
        ${truncated}
      </section>
    `;
  }

  _renderLeadFeatureC() {
    const lead = this._data.hero && this._data.hero.lead;
    if (!lead) return '';
    const meta = [lead.category || lead.topicLabel || 'Guide', lead.readTime].filter(Boolean).join(' · ').toUpperCase();
    return `
      <div class="bw-ci-sec-label">THE LEAD</div>
      <a class="bw-ci-feature" href="${this._escapeAttribute(lead.url)}" target="_top">
        <span class="bw-ci-f-img">${this._renderImgC(lead, 'image', { priority: true })}</span>
        <span class="bw-ci-f-body">
          <span class="bw-ci-f-cat">${this._escapeHtml(meta)}</span>
          <span class="bw-ci-f-title">${this._escapeHtml(lead.title)}</span>
          <span class="bw-ci-f-ex">${this._escapeHtml(lead.excerpt || '')}</span>
          <span class="bw-ci-f-cta">Read the guide</span>
          <span class="bw-ci-f-meta">
            <img src="${this._escapeAttribute(BW_BLOG_INDEX_PORTRAIT_URL)}" alt="Yusuf Ucuz" loading="lazy" decoding="async">
            <span>By Yusuf Ucuz · Berlin walking tour guide</span>
          </span>
        </span>
      </a>
    `;
  }

  _renderSecondaryC() {
    const secondary = ((this._data.hero && this._data.hero.secondary) || []).slice(0, 5);
    if (!secondary.length) return '';
    return `
      <div class="bw-ci-second">
        ${secondary.map((post, index) => {
          const meta = [post.category || post.topicLabel || 'Guide', post.readTime].filter(Boolean).join(' · ').toUpperCase();
          return `
            <a href="${this._escapeAttribute(post.url)}" target="_top">
              <span class="bw-ci-n">${String(index + 2).padStart(2, '0')}</span>
              <span><span class="bw-ci-t">${this._escapeHtml(post.title)}</span><span class="bw-ci-m">${this._escapeHtml(meta)}</span></span>
            </a>
          `;
        }).join('')}
      </div>
    `;
  }

  _renderNewThisWeekC() {
    const latest = this._data.latest || [];
    if (!latest.length) return '';
    const cards = latest.slice(0, 6);
    const more = latest.slice(6, 12);
    return `
      <div class="bw-ci-sec-label">NEW THIS WEEK <a class="bw-ci-view-all" href="#" data-bw-ci-show-all>${this._escapeHtml(this._allGuidesLabelC())}</a></div>
      <div class="bw-ci-grid3">
        ${cards.map((post) => this._renderRelCardC(post, { dateChip: true })).join('')}
      </div>
      ${more.length ? `<div class="bw-ci-linklist">${more.map((post) => this._renderCompactLinkC(post)).join('')}</div>` : ''}
    `;
  }

  _renderAdviceC() {
    return `
      <div class="bw-ci-advice">
        <div class="bw-ci-advice-label">MY ADVICE</div>
        <p><span class="bw-ci-mark">Do not read ten guides tonight.</span> Pick the one that matches tomorrow morning, arrival, tickets or a first walk, and let the rest wait until they are useful.</p>
      </div>
    `;
  }

  _renderStartHereC() {
    const links = this._data.startHere || [];
    if (!links.length) return '';
    return `
      <div class="bw-ci-sec-label">START HERE</div>
      <div class="bw-ci-start">
        ${links.map((link, index) => `
          <a href="${this._escapeAttribute(link.url)}" target="_top">
            <span class="bw-ci-sn">${index + 1}</span>
            <span class="bw-ci-st">${this._escapeHtml(link.title)}</span>
            <span class="bw-ci-ss">${this._escapeHtml(link.summary)}</span>
          </a>
        `).join('')}
      </div>
    `;
  }

  _renderShelfSectionC(shelf) {
    const posts = shelf.posts || [];
    if (!posts.length) return '';
    const cards = posts.slice(0, 3);
    const more = posts.slice(3);
    return `
      <section id="bw-topic-${this._escapeAttribute(shelf.key)}">
        <div class="bw-ci-sec-label">${this._escapeHtml((shelf.title || '').toUpperCase())}</div>
        <div class="bw-ci-grid3">
          ${cards.map((post) => this._renderRelCardC(post)).join('')}
        </div>
        ${more.length ? `<div class="bw-ci-linklist">${more.map((post) => this._renderCompactLinkC(post)).join('')}</div>` : ''}
      </section>
    `;
  }

  _renderPopularC() {
    const posts = (this._data.popular || []).slice(0, 7);
    if (!posts.length) return '';
    return `
      <div class="bw-ci-sec-label">MOST POPULAR</div>
      <div class="bw-ci-pop">
        ${posts.map((post, index) => `
          <a href="${this._escapeAttribute(post.url)}" target="_top">
            <span class="bw-ci-n">${String(index + 1).padStart(2, '0')}</span>
            <span><span class="bw-ci-t">${this._escapeHtml(post.title)}</span><span class="bw-ci-c">${this._escapeHtml((post.category || post.topicLabel || '').toUpperCase())}</span></span>
          </a>
        `).join('')}
      </div>
    `;
  }

  _renderToolsBandC() {
    const tools = (this._data.tools || []).slice(0, 3);
    if (!tools.length) return '';
    return `
      <div class="bw-ci-sec-label">PLAN WITH A FREE TOOL <a class="bw-ci-view-all" href="https://www.berlinwalk.com/berlin-tools" target="_top">ALL BERLIN TOOLS →</a></div>
      <div class="bw-ci-tools">
        ${tools.map((tool) => `
          <a class="bw-ci-tool" href="${this._escapeAttribute(tool.url)}" target="_top">
            <span class="bw-ci-bar"><span class="bw-ci-pulse"></span> INTERACTIVE</span>
            <span class="bw-ci-inner">
              <span class="bw-ci-w-title">${this._escapeHtml(tool.title)}</span>
              <span class="bw-ci-w-sub">${this._escapeHtml(tool.summary || '')}</span>
              <span class="bw-ci-w-link">Open the tool →</span>
            </span>
          </a>
        `).join('')}
      </div>
    `;
  }

  _renderTopicBandC() {
    const topics = this._data.navTopics || [];
    if (!topics.length) return '';
    return `
      <div class="bw-ci-sec-label">EVERY TOPIC</div>
      <div class="bw-ci-topicband">
        ${topics.map((topic) => `
          <a href="#bw-topic-${this._escapeAttribute(topic.key)}" data-bw-ci-topic="${this._escapeAttribute(topic.key)}">
            <span class="bw-ci-tt">${this._escapeHtml(topic.label)}</span>
            <span class="bw-ci-tk">${this._escapeHtml(BW_BLOG_INDEX_TOPIC_TAGS[topic.key] || '')}</span>
          </a>
        `).join('')}
      </div>
    `;
  }

  _renderTourBandC() {
    const schedule = this._nextTourLabelC();
    const sub = `FREE, TIP-BASED · ABOUT 2 HOURS${schedule ? ` · ${schedule.toUpperCase()}` : ''}<br>STARTS AT THE WORLD CLOCK · ENDS AT HACKESCHER MARKT`;
    return `
      <section class="bw-ci-tourband">
        <div class="bw-ci-tourband-inner">
          <figure class="bw-ci-tourband-photo">
            <img src="${this._escapeAttribute(BW_BLOG_INDEX_TOURBAND_IMAGE_URL)}" alt="Yusuf guiding in front of Berlin's Rotes Rathaus" loading="lazy" decoding="async">
          </figure>
          <div class="bw-ci-tourband-copy">
            <p class="bw-ci-tb-eyebrow">FREE BERLIN WALKING TOUR · ★ 9.8/10 ON FREETOUR</p>
            <h2>See Berlin's historic centre with me.</h2>
            <p class="bw-ci-tb-sub">${sub}</p>
            <div class="bw-ci-tb-div"></div>
            <a class="bw-ci-tb-cta" href="${this._escapeAttribute(this._data.bookingUrl || BW_BLOG_INDEX_BOOKING_URL)}" target="_top">Reserve a spot · free</a>
          </div>
        </div>
      </section>
    `;
  }

  _renderRelCardC(post, options = {}) {
    const dateChip = options.dateChip ? this._formatDateChipC(post.publishedDate) : '';
    return `
      <a class="bw-ci-rel-card" href="${this._escapeAttribute(post.url)}" target="_top">
        <span class="bw-ci-im">
          ${this._renderImgC(post, 'thumb')}
          ${dateChip ? `<span class="bw-ci-date">${this._escapeHtml(dateChip)}</span>` : ''}
        </span>
        <span class="bw-ci-rc-in">
          <span class="bw-ci-rc-cat">${this._escapeHtml((post.category || post.topicLabel || 'Guide').toUpperCase())}</span>
          <span class="bw-ci-rc-title">${this._escapeHtml(post.title)}</span>
        </span>
      </a>
    `;
  }

  _renderCompactLinkC(post) {
    const meta = [post.category || post.topicLabel || 'Guide', post.readTime].filter(Boolean).join(' · ').toUpperCase();
    return `
      <a class="bw-ci-compact-link" href="${this._escapeAttribute(post.url)}" target="_top">
        <span class="bw-ci-mini-meta">${this._escapeHtml(meta)}</span>
        <b>${this._escapeHtml(post.title)}</b>
      </a>
    `;
  }

  _renderImgC(post, field, options = {}) {
    const src = (post && (post[field] || post.image || post.thumb)) || '';
    const alt = (post && (post.alt || post.title)) || '';
    if (!src) return '';
    const loading = options.priority ? 'eager' : 'lazy';
    const fetchPriority = options.priority ? ' fetchpriority="high"' : '';
    return `<img src="${this._escapeAttribute(src)}" alt="${this._escapeAttribute(alt)}" loading="${loading}" decoding="async"${fetchPriority}>`;
  }

  _bindControlsC() {
    const form = this.querySelector('[data-bw-ci-search-form]');
    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        this._triggerSearchC({ revealResults: true });
      });
    }
    const input = this.querySelector('[data-bw-ci-search]');
    if (input) {
      input.addEventListener('input', () => {
        this._query = input.value.trim();
        this._showAllArchive = false;
        this._triggerSearchC({ preserveFocus: true });
      });
    }
    this.querySelectorAll('[data-bw-ci-search-reset]').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        this._query = '';
        this._showAllArchive = false;
        this._rerender();
        this.querySelector('[data-bw-ci-search]')?.focus();
      });
    });
    this.querySelectorAll('[data-bw-ci-jump-results]').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        this._revealResultsC();
      });
    });
    this.querySelectorAll('[data-bw-ci-show-all]').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        this._showAllArchive = true;
        this._query = '';
        const finish = () => {
          if (!this.isConnected) return;
          this._rerender();
          this.querySelector('#bw-ci-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };
        if (this._archiveLoaded) finish();
        else this._loadArchive().then(finish).catch(() => {});
      });
    });
    this.querySelectorAll('a[href^="#bw-"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const hash = link.getAttribute('href');
        const target = hash ? this.querySelector(hash) : null;
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
    this._bindScrollspyC();
  }

  _triggerSearchC(options = {}) {
    const settled = this._archiveLoaded || !this._query;
    const after = (final) => {
      if (options.preserveFocus) this._restoreSearchFocusC();
      // Results render well below the hero, so a submit that only re-renders
      // reads as a dead button. Move the reader there once the list is real.
      if (options.revealResults && final) this._revealResultsC();
    };
    if (this._query && !this._archiveLoaded) {
      this._loadArchive().then(() => {
        if (!this.isConnected) return;
        this._rerender();
        after(true);
      }).catch(() => {});
    }
    this._rerender();
    after(settled);
  }

  _revealResultsC() {
    const results = this.querySelector('#bw-ci-results');
    if (!results || results.hasAttribute('hidden')) return;
    results.setAttribute('tabindex', '-1');
    results.focus({ preventScroll: true });
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  _restoreSearchFocusC() {
    const input = this.querySelector('[data-bw-ci-search]');
    if (!input) return;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }

  _bindScrollspyC() {
    if (!this._scrollspyBound) {
      this._scrollspyBound = true;
      this._scrollspyHandler = () => this._updateScrollspyC();
      window.addEventListener('scroll', this._scrollspyHandler, { passive: true });
      window.addEventListener('resize', this._scrollspyHandler, { passive: true });
    }
    this._updateScrollspyC();
  }

  _updateScrollspyC() {
    if (!this.isConnected || !this._redesignOn) return;
    const sections = this.querySelectorAll('[id^="bw-topic-"]');
    let active = 'all';
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top < 170) active = section.id.replace('bw-topic-', '');
    });
    this.querySelectorAll('[data-bw-ci-topic]').forEach((el) => {
      el.classList.toggle('bw-ci-on', el.getAttribute('data-bw-ci-topic') === active);
    });
  }

  _scheduleScheduleRecheckC() {
    // The site header (source of the tour schedule text) can render slightly
    // after this element's first paint. Re-check a few times over the first
    // few seconds and patch just the schedule-dependent nodes in place, so a
    // late header never leaves the fallback text stuck after first paint.
    [500, 1200, 2500, 5000, 9000].forEach((delay) => {
      setTimeout(() => this._maybeUpdateScheduleC(), delay);
    });
  }

  _maybeUpdateScheduleC() {
    if (!this.isConnected || !this._redesignOn) return;
    const schedule = this._nextTourLabelC();
    if (!schedule || schedule === this._lastKnownScheduleC) return;
    this._lastKnownScheduleC = schedule;

    const tourTileValue = this.querySelector('.bw-ci-tile:nth-child(4) .bw-ci-tv');
    const tourTileNote = this.querySelector('.bw-ci-tile:nth-child(4) .bw-ci-tn');
    if (tourTileValue) tourTileValue.textContent = schedule.toUpperCase();
    if (tourTileNote) tourTileNote.textContent = 'Starts at the World Clock';

    const railLine = this.querySelector('.bw-ci-rt-line');
    if (railLine) railLine.innerHTML = `${this._escapeHtml(schedule)}<br>★ 9.8/10 · FREE, TIP-BASED`;

    const bandSub = this.querySelector('.bw-ci-tb-sub');
    if (bandSub) {
      bandSub.innerHTML = `FREE, TIP-BASED · ABOUT 2 HOURS · ${this._escapeHtml(schedule.toUpperCase())}<br>STARTS AT THE WORLD CLOCK · ENDS AT HACKESCHER MARKT`;
    }
  }

  _nextTourLabelC() {
    try {
      const bodyText = String((document.body && document.body.innerText) || '').replace(/\s+/g, ' ').trim();
      const match = bodyText.match(/\bTue(?:\s*[-–]\s*Sat)?\s+11:30\s*(?:&|\+)\s*15:30\b/i);
      if (match) return match[0].replace(/\s*[-–]\s*/g, '–').replace(/\s*\+\s*/g, ' & ');
    } catch (error) {
      // ignore: fall through to empty schedule
    }
    return '';
  }

  _tourTileC() {
    const schedule = this._nextTourLabelC();
    if (schedule) return { value: schedule.toUpperCase(), note: 'Starts at the World Clock' };
    return { value: 'Free, tip-based', note: 'About 2 hours' };
  }

  _updatedTileValueC() {
    const latest = (this._data.latest || [])[0];
    const dateStr = latest && latest.publishedDate;
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return '';
    try {
      const dayKey = (value) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin' }).format(value);
      const today = dayKey(new Date());
      const postDay = dayKey(date);
      if (postDay === today) return 'Today';
      if (postDay === dayKey(new Date(Date.now() - 86400000))) return 'Yesterday';
    } catch (error) {
      // ignore: fall through to date chip formatting
    }
    return this._formatDateChipC(dateStr);
  }

  _formatDateChipC(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return '';
    try {
      return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'Europe/Berlin' }).format(date).toUpperCase();
    } catch (error) {
      return '';
    }
  }

  _toolsTotalLabelC() {
    const total = this._data.toolsTotal;
    return total ? `${total} planners` : 'Free planners';
  }

  _searchPlaceholderC() {
    const total = this._data.totalPosts;
    return total ? `Search ${total} Berlin guides` : 'Search Berlin guides';
  }

  _allGuidesLabelC() {
    const total = this._data.totalPosts;
    return total ? `ALL ${total} GUIDES →` : 'ALL GUIDES →';
  }

  // ===== End Redesign C ================================================

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
