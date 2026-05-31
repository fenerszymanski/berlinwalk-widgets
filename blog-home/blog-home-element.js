const BW_BLOG_HOME_DATA_URL = (() => {
  const script = document.currentScript;
  const base = script && script.src ? script.src : window.location.href;
  return new URL('./data.json', base).href;
})();

const BW_BLOG_HOME_FALLBACK = {
  featured: {
    title: 'Berlin in October 2026: Weather, Festival of Lights, Packing and What to Book',
    url: 'https://www.berlinwalk.com/post/berlin-in-october-2026',
    category: 'When to Visit',
    readTime: '8 min read',
    label: 'Monthly guide',
    summary: 'Autumn light, Festival of Lights dates, German Unity Day, packing tips, daylight changes, and what to book early.',
    image: 'https://static.wixstatic.com/media/5a08a3_a68f85c43a134c31aee35fce276e2d14~mv2.jpg/v1/fill/w_980,h_650,fp_0.50_0.50,q_88,enc_avif,quality_auto/berlin-in-october-2026-01-hero-autumn-berlin.jpg',
    alt: 'Golden autumn leaves covering a Berlin street and parked cars in October'
  },
  posts: [
    {
      title: "Berlin in December 2026: Christmas Markets, Weather, Closures and New Year's Eve",
      url: 'https://www.berlinwalk.com/post/berlin-in-december-2026',
      category: 'When to Visit',
      readTime: '7 min read',
      summary: "Christmas markets, winter weather, holiday closures, New Year's Eve, packing tips, and what to book.",
      image: 'https://static.wixstatic.com/media/5a08a3_b13955ac1c7047aca76aa006a5c3a20b~mv2.jpg/v1/fill/w_520,h_360,fp_0.50_0.50,q_88,enc_avif,quality_auto/01-hero-christmas-market.jpg',
      alt: 'A Berlin Christmas market glowing with lights and wooden stalls on a December evening'
    },
    {
      title: 'Berlin in January 2027: Weather, the Cheapest, Quietest Month, and What to Do',
      url: 'https://www.berlinwalk.com/post/berlin-in-january-2027',
      category: 'When to Visit',
      readTime: '6 min read',
      summary: 'Cold weather, low prices, quiet museums, winter packing advice, events, and honest January planning.',
      image: 'https://static.wixstatic.com/media/5a08a3_8fa40dec62794d5591d286e809a578d2~mv2.jpg/v1/fill/w_520,h_360,fp_0.50_0.50,q_88,enc_avif,quality_auto/01-hero-berliner-dom-snow.jpg',
      alt: 'The Berlin Cathedral, the Berliner Dom, covered in snow on a cold January day'
    },
    {
      title: 'Berlin in May 2027: Weather, Festivals, Long Days and the Sweet Spot Before Summer',
      url: 'https://www.berlinwalk.com/post/berlin-in-may-2027',
      category: 'When to Visit',
      readTime: '7 min read',
      summary: 'Warm but not hot, long days, May 1, Carnival of Cultures, beer gardens, and what to book early.',
      image: 'https://static.wixstatic.com/media/5a08a3_9c4f15caade945bcae72737bf8254b5c~mv2.jpg/v1/fill/w_520,h_360,fp_0.50_0.50,q_88,enc_avif,quality_auto/01-hero-karneval.jpg',
      alt: 'Colourful costumes and crowds at the Karneval der Kulturen street parade in Berlin'
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

        .bw-blog-home .bw-feature-card,
        .bw-blog-home .bw-note-card {
          color: inherit;
          opacity: 0;
          text-decoration: none;
          transform: translateY(12px);
          transition: border-color 160ms ease, box-shadow 160ms ease, opacity 420ms ease-out, transform 420ms ease-out;
        }

        .bw-blog-home .bw-feature-card.visible,
        .bw-blog-home .bw-note-card.visible {
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
          .bw-blog-home .bw-note-card {
            grid-template-columns: 92px minmax(0, 1fr);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bw-blog-home .bw-feature-card,
          .bw-blog-home .bw-note-card,
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
    const root = this.querySelector('.bw-blog-home-root');
    if (!root) return;

    root.removeAttribute('aria-live');
    root.innerHTML = `
      <div class="bw-blog-home-grid">
        ${this._renderFeatured(featured)}
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

    const cards = this.querySelectorAll('.bw-feature-card, .bw-note-card');
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
    this.querySelectorAll('.bw-feature-card, .bw-note-card').forEach((card, index) => {
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
