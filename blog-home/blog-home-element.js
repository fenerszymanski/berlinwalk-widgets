const BW_BLOG_HOME_DATA_URL = (() => {
  const script = document.currentScript;
  const base = script && script.src ? script.src : window.location.href;
  return new URL('./data.json?v=20260905-featured-listings', base).href;
})();

const BW_BLOG_HOME_FALLBACK = {
  featured: {
    title: '4 Days in Berlin: What to Do With the Day a Three-Day Trip Cannot Fit',
    url: 'https://www.berlinwalk.com/post/4-days-in-berlin',
    category: 'Tourist Tips',
    readTime: '8 min read',
    label: 'New: choose your fourth Berlin day',
    summary: 'Most people who give Berlin four days plan three of them properly and improvise the fourth, then spend it walking back through Mitte past the sights they already saw. The fourth day is the one with no default, which is exactly why it decides how the trip is remembered. Here is what it is actually for, the arithmetic that rules half the options out before you leave the hotel, and the eight real choices with verified travel times from Alexanderplatz.',
    image: 'https://static.wixstatic.com/media/5a08a3_b86a4c459881452cad772a52e298f9f2~mv2.jpg/v1/fill/w_980,h_650,fp_0.50_0.50,q_88,enc_avif,quality_auto/cover-sanssouci-great-fountain.jpg',
    alt: 'The Great Fountain at Sanssouci with the vineyard terraces and the yellow palace above them'
  },
  miniPosts: [
    {
      title: "FIBA Women's Basketball World Cup 2026 in Berlin: A Local Guide for Fans",
      url: 'https://www.berlinwalk.com/post/fiba-womens-basketball-world-cup-2026-berlin',
      category: 'Tourist Tips',
      readTime: '7 min read',
      summary: 'The FIBA Women\'s Basketball World Cup 2026 comes to Berlin from September 4-13. Here is the local fan guide: venues, transport, tickets, fixtures, and what to do between games.',
      image: 'https://static.wixstatic.com/media/5a08a3_ea8454716f174a6a8d5990f9131542a8~mv2.jpg/v1/fill/w_980,h_650,fp_0.50_0.50,q_88,enc_avif,quality_auto/fiba-wwc-2026-berlin-hero.jpg',
      alt: 'Women basketball fans walking toward a warmly lit modern Berlin arena at sunset, with the TV Tower and Spree in the background'
    },
    {
      title: 'Train Tickets for Day Trips from Berlin: Group Tickets, the Deutschlandticket and When the ICE Wins',
      url: 'https://www.berlinwalk.com/post/berlin-day-trip-train-tickets',
      category: 'Tourist Tips',
      readTime: '6 min read',
      summary: 'Germany runs a whole family of flat-price group train tickets that most Berlin visitors never hear about: 36.50 euros covers five people to anywhere in Brandenburg, and 87 euros takes four of you to Dresden and back. Here is which ticket wins for each destination and group size, where the 09:00 weekday rule bites, and when the ICE is honestly the better buy.',
      image: 'https://static.wixstatic.com/media/5a08a3_aea7c1665e6a4fd1bbc809fdee92bf28~mv2.jpg/v1/fill/w_980,h_650,fp_0.50_0.50,q_88,enc_avif,quality_auto/cover-re1-berlin-hbf.jpg',
      alt: 'An ODEG regional train on the RE1 line waiting under the glass roof of Berlin Hauptbahnhof'
    },
    {
      title: 'Wittenberg Day Trip from Berlin: Trains, the Theses Door and What Is Actually Open',
      url: 'https://www.berlinwalk.com/post/wittenberg-day-trip-from-berlin',
      category: 'Tourist Tips',
      readTime: '6 min read',
      summary: 'The town where the modern world cracked open in 1517 sits 41 minutes from Berlin Hauptbahnhof, and almost everything worth seeing stands on one walkable street. Here is which train and ticket to take, what the Theses Door really is, and the closure most visitors discover too late: the Lutherhaus is being renovated until spring 2027.',
      image: 'https://static.wixstatic.com/media/5a08a3_b36fba4601d74ee4848048026de0003f~mv2.jpg/v1/fill/w_980,h_650,fp_0.50_0.50,q_88,enc_avif,quality_auto/cover-wittenberg-aerial.jpg',
      alt: 'Aerial view of Wittenberg with the Town Church, the market square and the Castle Church tower on one street line'
    },
    {
      title: 'IFA Berlin: A Visitor Guide to Messe Berlin and the City After the Show',
      url: 'https://www.berlinwalk.com/post/ifa-berlin-2026',
      category: 'Tourist Tips',
      readTime: '4 min read',
      summary: 'A visitor-first IFA Berlin plan: confirmed opening hours, Messe Berlin access and an evening that does not overreach.',
      image: 'https://static.wixstatic.com/media/5a08a3_8de68741b84e41a0bd18386fbf15d9e8~mv2.jpg/v1/fill/w_980,h_650,fp_0.50_0.50,q_88,enc_avif,quality_auto/01-messe-berlin-cover.jpg',
      alt: 'Messe Berlin exterior during an event day'
    }
  ],
  posts: [
    {
      title: 'Berlin Weekly Markets: Which One Is Open on the Day You Are Free',
      url: 'https://www.berlinwalk.com/post/berlin-weekly-markets',
      category: 'Tourist Tips',
      readTime: '6 min read',
      summary: 'Berlin does not have one market you can turn up to whenever you like. It has around a hundred of them, each tied to a fixed weekday and a fixed square, and most are folded away by mid-afternoon. Saturday carries nine, Wednesday is the classic morning, Thursday runs latest, Monday has one, and Sunday has none at all. Here is the shape of the market week, and how to pick the one that fits the day you are actually free.',
      image: 'https://static.wixstatic.com/media/5a08a3_d77bfcd37ddb4788a623fb490bc5c077~mv2.jpg/v1/fill/w_980,h_650,fp_0.50_0.50,q_88,enc_avif,quality_auto/winterfeldt.jpg',
      alt: 'A fruit and vegetable stall under a red and white striped canopy at Winterfeldtplatz market in Berlin'
    },
    {
      title: 'Berlin Attraction Tickets: Where to Buy Them and When a Reseller Costs You More',
      url: 'https://www.berlinwalk.com/post/berlin-attraction-tickets',
      category: 'Tourist Tips',
      readTime: '7 min read',
      summary: "Five of Berlin's most-visited sights have no ticket at all, two of the best are free but only the venue can reserve them, and the paid half of a classic list comes to 93.90 euros. Here is which door each one is sold through, and how to spot the venue's own page before you pay.",
      image: 'https://static.wixstatic.com/media/5a08a3_2766c5a7bb034ceb8c2e57bdd51c33c2~mv2.jpg/v1/fill/w_980,h_650,fp_0.50_0.50,q_88,enc_avif,quality_auto/cover-museumsinsel.jpg',
      alt: 'The Bode-Museum on the tip of Museum Island seen across the Spree, with the Berlin TV Tower behind it'
    },
    {
      title: 'Berlin Public Transport for Tourists: Tickets, Zones, Prices and Validation',
      url: 'https://www.berlinwalk.com/post/berlin-public-transport-explained-for-tourists-u-bahn-s-bahn-tram-bus',
      category: 'Tourist Tips',
      readTime: '7 min read',
      summary: 'Berlin public transport uses one shared ticket system for U-Bahn, S-Bahn, tram and bus. This local guide covers zones, prices, validation, BER airport trips, and the EUR 60 fine.',
      image: 'https://static.wixstatic.com/media/5a08a3_09bdf461857549d291c3769973fe3a9b~mv2.png/v1/fill/w_980,h_650,fp_0.50_0.50,q_88,enc_avif,quality_auto/nsplsh_8c97b9e50ab54e0b9a53b8d3982f4ce4~mv2.jpg',
      alt: 'Yellow train speeding through Konstanzer Strasse station. The wall has bold stripes and text. Ceiling lights illuminate the platform.'
    }
  ]
};

class BWBlogHomeElement extends HTMLElement {
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
        bw-blog-home {
          display: block;
          width: 100%;
        }

        .bw-blog-home {
          --serif: Merriweather, Georgia, serif;
          background: #EAF3DE;
          color: #212121;
          font-family: Montserrat, Arial, sans-serif;
          margin: 0;
          max-width: 100%;
          overflow-x: hidden;
          padding: 72px 24px;
        }

        .bw-blog-home *,
        .bw-blog-home *::before,
        .bw-blog-home *::after {
          box-sizing: border-box;
        }

        .bw-blog-home h2,
        .bw-blog-home h3,
        .bw-blog-home p {
          margin-top: 0;
        }

        .bw-blog-home .bw-blog-home-inner {
          margin: 0 auto;
          max-width: 1120px;
        }

        .bw-blog-home .bw-blog-home-header {
          align-items: end;
          display: grid;
          gap: 28px;
          grid-template-columns: minmax(0, 1fr) minmax(260px, 0.34fr);
          margin-bottom: 30px;
        }

        .bw-blog-home .bw-blog-home-kicker {
          color: #1B5E20;
          display: block;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1px;
          line-height: 1.2;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .bw-blog-home .bw-blog-home-title {
          color: #1B5E20;
          font-size: 48px;
          font-weight: 800;
          line-height: 1.04;
          margin-bottom: 12px;
        }

        .bw-blog-home .bw-blog-home-lead {
          color: #3D4A3D;
          font-family: var(--serif);
          font-size: 17px;
          line-height: 1.65;
          margin-bottom: 0;
          max-width: 650px;
        }

        .bw-blog-home .bw-blog-home-stamp {
          background: #1B5E20;
          border-radius: 8px;
          color: #FFFFFF;
          padding: 20px;
        }

        .bw-blog-home .bw-blog-home-stamp strong {
          color: #FFE600;
          display: block;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 1px;
          line-height: 1.3;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .bw-blog-home .bw-blog-home-stamp span {
          display: block;
          font-family: var(--serif);
          font-size: 14px;
          line-height: 1.55;
        }

        .bw-blog-home .bw-blog-home-grid {
          display: grid;
          gap: 18px;
          grid-template-columns: minmax(0, 1.1fr) minmax(340px, 0.9fr);
        }

        .bw-blog-home .bw-feature-column {
          align-content: start;
          display: grid;
          gap: 14px;
          min-width: 0;
        }

        .bw-blog-home .bw-feature-card,
        .bw-blog-home .bw-note-card,
        .bw-blog-home .bw-mini-posts {
          color: inherit;
          opacity: 0;
          text-decoration: none;
          transform: translateY(12px);
          transition: border-color 160ms ease, box-shadow 160ms ease, opacity 420ms ease-out, transform 420ms ease-out;
        }

        .bw-blog-home .bw-feature-card.visible,
        .bw-blog-home .bw-note-card.visible,
        .bw-blog-home .bw-mini-posts.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .bw-blog-home .bw-feature-card {
          background: #FFFFFF;
          border: 1px solid #C5E1A5;
          border-radius: 8px;
          display: grid;
          grid-template-rows: minmax(260px, 360px) auto;
          min-width: 0;
          overflow: hidden;
        }

        .bw-blog-home .bw-feature-card:hover,
        .bw-blog-home .bw-feature-card:focus-visible,
        .bw-blog-home .bw-note-card:hover,
        .bw-blog-home .bw-note-card:focus-visible {
          border-color: #1B5E20;
          box-shadow: 0 14px 30px rgba(27, 94, 32, 0.16);
          transform: translateY(-2px);
        }

        .bw-blog-home .bw-feature-card.visible:hover,
        .bw-blog-home .bw-feature-card.visible:focus-visible,
        .bw-blog-home .bw-note-card.visible:hover,
        .bw-blog-home .bw-note-card.visible:focus-visible {
          transform: translateY(-2px);
        }

        .bw-blog-home .bw-feature-card:focus-visible,
        .bw-blog-home .bw-note-card:focus-visible,
        .bw-blog-home .bw-mini-link:focus-visible,
        .bw-blog-home .bw-blog-home-cta:focus-visible {
          outline: 3px solid rgba(255, 230, 0, 0.9);
          outline-offset: 3px;
        }

        .bw-blog-home .bw-feature-media {
          min-height: 0;
          position: relative;
        }

        .bw-blog-home .bw-feature-media img,
        .bw-blog-home .bw-note-media img {
          display: block;
          height: 100%;
          object-fit: cover;
          width: 100%;
        }

        .bw-blog-home .bw-feature-label {
          background: #FFE600;
          border-radius: 999px;
          color: #1B5E20;
          font-size: 11px;
          font-weight: 800;
          left: 18px;
          letter-spacing: 0.8px;
          line-height: 1;
          padding: 9px 12px;
          position: absolute;
          text-transform: uppercase;
          top: 18px;
        }

        .bw-blog-home .bw-feature-copy {
          padding: 24px;
        }

        .bw-blog-home .bw-meta {
          align-items: center;
          color: #1B5E20;
          display: flex;
          flex-wrap: wrap;
          font-size: 12px;
          font-weight: 800;
          gap: 8px;
          letter-spacing: 0.7px;
          line-height: 1.3;
          margin-bottom: 10px;
          text-transform: uppercase;
        }

        .bw-blog-home .bw-meta-dot {
          background: #7CB342;
          border-radius: 999px;
          display: inline-block;
          height: 5px;
          width: 5px;
        }

        .bw-blog-home .bw-feature-card h3 {
          color: #1B5E20;
          font-size: 30px;
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 12px;
          overflow-wrap: break-word;
        }

        .bw-blog-home .bw-feature-card p,
        .bw-blog-home .bw-note-card p {
          color: #3D3D36;
          font-family: var(--serif);
          line-height: 1.55;
          margin-bottom: 0;
          overflow-wrap: break-word;
        }

        .bw-blog-home .bw-feature-card p {
          font-size: 16px;
        }

        .bw-blog-home .bw-mini-posts {
          background: #FAFAF5;
          border: 1px solid #C5E1A5;
          border-radius: 8px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          overflow: hidden;
        }

        .bw-blog-home .bw-mini-link {
          color: #1B5E20;
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-height: 86px;
          min-width: 0;
          padding: 14px 16px;
          text-decoration: none;
          transition: background 160ms ease, color 160ms ease;
        }

        .bw-blog-home .bw-mini-link:nth-child(odd) {
          border-right: 1px solid rgba(124, 179, 66, 0.34);
        }

        .bw-blog-home .bw-mini-link:nth-child(n + 3) {
          border-top: 1px solid rgba(124, 179, 66, 0.34);
        }

        .bw-blog-home .bw-mini-link:hover,
        .bw-blog-home .bw-mini-link:focus-visible {
          background: #FFFFFF;
        }

        .bw-blog-home .bw-mini-meta {
          color: #4E5A4E;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.7px;
          line-height: 1.2;
          text-transform: uppercase;
        }

        .bw-blog-home .bw-mini-title {
          display: block;
          font-size: 14px;
          font-weight: 800;
          line-height: 1.24;
          overflow-wrap: break-word;
        }

        .bw-blog-home .bw-note-stack {
          display: grid;
          gap: 14px;
        }

        .bw-blog-home .bw-note-card {
          align-items: stretch;
          background: #FFFFFF;
          border: 1px solid #C5E1A5;
          border-radius: 8px;
          display: grid;
          grid-template-columns: 148px minmax(0, 1fr);
          min-height: 170px;
          min-width: 0;
          overflow: hidden;
        }

        .bw-blog-home .bw-note-media {
          background: #FAFAF5;
          min-height: 100%;
        }

        .bw-blog-home .bw-note-copy {
          display: flex;
          flex-direction: column;
          min-width: 0;
          padding: 18px 20px;
        }

        .bw-blog-home .bw-note-card h3 {
          color: #1B5E20;
          font-size: 19px;
          font-weight: 800;
          line-height: 1.24;
          margin-bottom: 8px;
          overflow-wrap: break-word;
        }

        .bw-blog-home .bw-note-card p {
          font-size: 14px;
        }

        .bw-blog-home .bw-read-more {
          color: #1B5E20;
          display: inline-block;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.8px;
          margin-top: auto;
          padding-top: 12px;
          text-transform: uppercase;
        }

        .bw-blog-home .bw-blog-home-footer {
          align-items: center;
          display: flex;
          gap: 16px;
          justify-content: space-between;
          margin-top: 26px;
        }

        .bw-blog-home .bw-blog-home-footnote {
          color: #4E5A4E;
          font-family: var(--serif);
          font-size: 14px;
          line-height: 1.45;
          margin-bottom: 0;
        }

        .bw-blog-home .bw-blog-home-cta {
          background: #FFE600;
          border-radius: 999px;
          color: #1B5E20;
          display: inline-block;
          flex: 0 0 auto;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.6px;
          padding: 14px 28px;
          text-decoration: none;
          text-transform: uppercase;
          transition: background 160ms ease, transform 160ms ease;
        }

        .bw-blog-home .bw-blog-home-cta:hover,
        .bw-blog-home .bw-blog-home-cta:focus-visible {
          background: #fff04a;
          transform: translateY(-1px);
        }

        @media (max-width: 980px) {
          .bw-blog-home .bw-blog-home-header,
          .bw-blog-home .bw-blog-home-grid {
            grid-template-columns: 1fr;
          }

          .bw-blog-home .bw-feature-column {
            gap: 16px;
          }

          .bw-blog-home .bw-feature-card {
            grid-template-rows: 330px auto;
          }
        }

        @media (max-width: 640px) {
          .bw-blog-home {
            padding: 46px 16px;
          }

          .bw-blog-home .bw-blog-home-header {
            gap: 18px;
            margin-bottom: 22px;
          }

          .bw-blog-home .bw-blog-home-title {
            font-size: 34px;
          }

          .bw-blog-home .bw-blog-home-lead {
            font-size: 15px;
          }

          .bw-blog-home .bw-blog-home-stamp {
            padding: 16px;
          }

          .bw-blog-home .bw-feature-card {
            grid-template-rows: 230px auto;
          }

          .bw-blog-home .bw-feature-copy {
            padding: 20px;
          }

          .bw-blog-home .bw-feature-card h3 {
            font-size: 24px;
          }

          .bw-blog-home .bw-mini-link {
            min-height: 82px;
            padding: 13px 14px;
          }

          .bw-blog-home .bw-mini-title {
            font-size: 13px;
          }

          .bw-blog-home .bw-note-card {
            grid-template-columns: 104px minmax(0, 1fr);
            min-height: 180px;
          }

          .bw-blog-home .bw-note-copy {
            padding: 15px 16px;
          }

          .bw-blog-home .bw-note-card h3 {
            font-size: 16px;
          }

          .bw-blog-home .bw-note-card p {
            font-size: 13px;
          }

          .bw-blog-home .bw-meta {
            font-size: 11px;
          }

          .bw-blog-home .bw-meta-dot {
            display: none;
          }

          .bw-blog-home .bw-blog-home-footer {
            align-items: stretch;
            flex-direction: column-reverse;
            text-align: center;
          }

          .bw-blog-home .bw-blog-home-cta {
            width: 100%;
          }
        }

        @media (max-width: 400px) {
          .bw-blog-home .bw-mini-posts {
            grid-template-columns: 1fr;
          }

          .bw-blog-home .bw-mini-link:nth-child(odd) {
            border-right: 0;
          }

          .bw-blog-home .bw-mini-link:nth-child(n + 2) {
            border-top: 1px solid rgba(124, 179, 66, 0.34);
          }

          .bw-blog-home .bw-note-card {
            grid-template-columns: 92px minmax(0, 1fr);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bw-blog-home .bw-feature-card,
          .bw-blog-home .bw-note-card,
          .bw-blog-home .bw-mini-posts,
          .bw-blog-home .bw-feature-card:hover,
          .bw-blog-home .bw-note-card:hover,
          .bw-blog-home .bw-blog-home-cta {
            transition: none;
            transform: none;
          }
        }
      </style>

      <section class="bw-blog-home" aria-labelledby="bw-blog-home-title">
        <div class="bw-blog-home-inner">
          <header class="bw-blog-home-header">
            <div>
              <span class="bw-blog-home-kicker">Field notes</span>
              <h2 id="bw-blog-home-title" class="bw-blog-home-title">Berlin Travel Notes</h2>
              <p class="bw-blog-home-lead">Practical, local guides for the small decisions that shape your first days in Berlin.</p>
            </div>
            <div class="bw-blog-home-stamp" aria-label="Editorial note">
              <strong>Curated for visitors</strong>
              <span>Not every useful Berlin question is dramatic. Some just save you time, money, or a bad first hour.</span>
            </div>
          </header>

          <div class="bw-blog-home-root" aria-live="polite"></div>

          <footer class="bw-blog-home-footer">
            <p class="bw-blog-home-footnote">Fresh practical guides, route stories, and tourist tips from BerlinWalk.</p>
            <a class="bw-blog-home-cta" href="https://www.berlinwalk.com/blog" target="_top">Read the Berlin guide</a>
          </footer>
        </div>
      </section>
    `;
  }

  async _loadDataAndRender() {
    try {
      const response = await fetch(BW_BLOG_HOME_DATA_URL);
      if (!response.ok) throw new Error('Could not load blog data');
      const data = await response.json();
      this._renderPosts(data);
    } catch (error) {
      this._renderPosts(BW_BLOG_HOME_FALLBACK);
    }
  }

  _renderPosts(data) {
    const featured = data && data.featured ? data.featured : BW_BLOG_HOME_FALLBACK.featured;
    const posts = data && Array.isArray(data.posts) ? data.posts.slice(0, 3) : BW_BLOG_HOME_FALLBACK.posts;
    const miniPosts = data && Array.isArray(data.miniPosts) ? data.miniPosts.slice(0, 4) : BW_BLOG_HOME_FALLBACK.miniPosts;
    const root = this.querySelector('.bw-blog-home-root');
    if (!root) return;

    root.removeAttribute('aria-live');
    root.innerHTML = `
      <div class="bw-blog-home-grid">
        <div class="bw-feature-column">
          ${this._renderFeatured(featured)}
          ${this._renderMiniPosts(miniPosts)}
        </div>
        <div class="bw-note-stack" aria-label="More Berlin travel notes">
          ${posts.map(post => this._renderPost(post)).join('')}
        </div>
      </div>
    `;

    this._setupAnimations();
  }

  _renderFeatured(post) {
    const title = this._escapeHtml(post.title || '');
    const label = this._escapeHtml(post.label || 'Featured guide');
    const image = this._escapeAttribute(post.image || '');
    const alt = this._escapeAttribute(post.alt || title);

    return `
      <a class="bw-feature-card" href="${this._escapeAttribute(post.url || '#')}" target="_top">
        <span class="bw-feature-media">
          <img src="${image}" alt="${alt}" loading="lazy" decoding="async">
          <span class="bw-feature-label">${label}</span>
        </span>
        <span class="bw-feature-copy">
          ${this._renderMeta(post)}
          <h3>${title}</h3>
          <p>${this._escapeHtml(post.summary || '')}</p>
        </span>
      </a>
    `;
  }

  _renderPost(post) {
    const title = this._escapeHtml(post.title || '');
    const image = this._escapeAttribute(post.image || '');
    const alt = this._escapeAttribute(post.alt || title);

    return `
      <a class="bw-note-card" href="${this._escapeAttribute(post.url || '#')}" target="_top">
        <span class="bw-note-media">
          <img src="${image}" alt="${alt}" loading="lazy" decoding="async">
        </span>
        <span class="bw-note-copy">
          ${this._renderMeta(post)}
          <h3>${title}</h3>
          <p>${this._escapeHtml(post.summary || '')}</p>
          <span class="bw-read-more">Read note</span>
        </span>
      </a>
    `;
  }

  _renderMiniPosts(posts) {
    if (!Array.isArray(posts) || !posts.length) return '';

    return `
      <div class="bw-mini-posts" aria-label="Quick Berlin reads">
        ${posts.map(post => this._renderMiniPost(post)).join('')}
      </div>
    `;
  }

  _renderMiniPost(post) {
    const title = this._escapeHtml(post.title || '');
    const metaParts = [post.category, post.readTime].filter(Boolean).map(part => this._escapeHtml(part));
    const meta = metaParts.join(' / ');

    return `
      <a class="bw-mini-link" href="${this._escapeAttribute(post.url || '#')}" target="_top">
        <span class="bw-mini-meta">${meta}</span>
        <b class="bw-mini-title">${title}</b>
      </a>
    `;
  }

  _renderMeta(post) {
    return `
      <span class="bw-meta">
        <span>${this._escapeHtml(post.category || 'Berlin guide')}</span>
        <span class="bw-meta-dot" aria-hidden="true"></span>
        <span>${this._escapeHtml(post.readTime || '')}</span>
      </span>
    `;
  }

  _setupAnimations() {
    const section = this.querySelector('.bw-blog-home');
    if (!section) return;

    const cards = this.querySelectorAll('.bw-feature-card, .bw-note-card, .bw-mini-posts');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      this._animated = true;
      cards.forEach(card => card.classList.add('visible'));
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
    }, { threshold: 0.25 });

    this._observer.observe(section);
  }

  _playAnimations() {
    this.querySelectorAll('.bw-feature-card, .bw-note-card, .bw-mini-posts').forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('visible');
      }, index * 80);
    });
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

if (!customElements.get('bw-blog-home')) {
  customElements.define('bw-blog-home', BWBlogHomeElement);
}
