const BW_REVIEWS_API_URL = 'https://www.berlinwalk.com/_functions/listReviews?limit=100';

class BWReviewsElement extends HTMLElement {
  constructor() {
    super();
    this._cardObserver = null;
    this._controller = null;
    this._reduceMotion = false;
  }

  connectedCallback() {
    this._controller = new AbortController();
    this._reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this._renderShell();
    this._setupAnimations();
    this._loadAndRender();
  }

  disconnectedCallback() {
    if (this._cardObserver) this._cardObserver.disconnect();
    if (this._controller) this._controller.abort();
  }

  _renderShell() {
    this.innerHTML = `
      <style>
        bw-reviews {
          display: block;
          width: 100%;
        }

        .bw-reviews {
          --serif: Merriweather, Georgia, serif;
          background: #FAFAF5;
          color: #212121;
          font-family: Montserrat, Arial, sans-serif;
          margin: 0;
          padding: 64px 24px;
        }

        .bw-reviews *,
        .bw-reviews *::before,
        .bw-reviews *::after {
          box-sizing: border-box;
        }

        .bw-reviews-inner {
          margin: 0 auto;
          max-width: 1080px;
        }

        .bw-reviews-header {
          text-align: center;
          max-width: 760px;
          margin: 0 auto 40px;
        }

        .bw-reviews-eyebrow {
          align-items: center;
          color: #1B5E20;
          display: inline-flex;
          flex-wrap: wrap;
          font-size: 12px;
          font-weight: 700;
          gap: 8px;
          justify-content: center;
          letter-spacing: 1.4px;
          line-height: 1.35;
          text-transform: uppercase;
        }

        .bw-reviews-eyebrow .stars {
          color: #FFE600;
          letter-spacing: 0;
        }

        .bw-reviews-title {
          color: #1B5E20;
          font-size: 38px;
          font-weight: 800;
          line-height: 1.15;
          margin: 12px 0 0;
        }

        .bw-reviews-lead {
          color: #4E5A4E;
          font-family: var(--serif);
          font-size: 16px;
          font-style: italic;
          line-height: 1.6;
          margin: 12px auto 0;
          max-width: 580px;
        }

        .bw-reviews-summary {
          background: #FFFFFF;
          border: 1px solid #DCE8C8;
          border-radius: 16px;
          padding: 28px 24px;
          margin: 0 auto 40px;
          max-width: 520px;
          text-align: center;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 400ms ease-out, transform 400ms ease-out;
        }

        .bw-reviews-summary.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .bw-reviews-summary-avg {
          color: #1B5E20;
          font-family: var(--serif);
          font-size: 48px;
          font-weight: 800;
          line-height: 1;
        }

        .bw-reviews-summary-stars {
          color: #FFE600;
          font-size: 24px;
          letter-spacing: 4px;
          margin-top: 10px;
        }

        .bw-reviews-summary-count {
          color: #4E5A4E;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.4px;
          margin-top: 12px;
          text-transform: uppercase;
        }

        .bw-reviews-grid {
          display: grid;
          gap: 20px;
          grid-template-columns: 1fr;
        }

        @media (min-width: 720px) {
          .bw-reviews-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        .bw-review-card {
          background: #FFFFFF;
          border: 1px solid #DCE8C8;
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          opacity: 0;
          padding: 24px 26px 22px;
          transform: translateY(12px);
          transition: opacity 400ms ease-out, transform 400ms ease-out, box-shadow 200ms ease;
        }

        .bw-review-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .bw-review-card:hover {
          box-shadow: 0 6px 22px rgba(27, 94, 32, 0.07);
        }

        .bw-review-stars {
          color: #FFE600;
          font-size: 18px;
          letter-spacing: 3px;
          line-height: 1;
        }

        .bw-review-stars .dim {
          color: #E0E5D6;
        }

        .bw-review-quote {
          color: #212121;
          font-family: var(--serif);
          font-size: 16px;
          font-style: italic;
          line-height: 1.65;
          margin: 0;
        }

        .bw-review-byline {
          align-items: baseline;
          color: #4E5A4E;
          display: flex;
          flex-wrap: wrap;
          font-size: 13px;
          gap: 6px 10px;
          line-height: 1.4;
          margin: 0;
        }

        .bw-review-byline .name {
          color: #1B5E20;
          font-weight: 700;
        }

        .bw-review-byline .sep {
          color: #C5E1A5;
          font-weight: 600;
        }

        .bw-review-source {
          color: #6E7A6E;
          font-family: var(--serif);
          font-size: 12px;
          font-style: italic;
          margin: -4px 0 0;
        }

        .bw-review-source a {
          color: #1B5E20;
          text-decoration: none;
          border-bottom: 1px dotted #C5E1A5;
        }

        .bw-review-source a:hover {
          border-bottom-color: #1B5E20;
        }

        .bw-reviews-state {
          color: #4E5A4E;
          font-family: var(--serif);
          font-size: 15px;
          font-style: italic;
          padding: 36px 24px;
          text-align: center;
        }

        .bw-reviews-state.error { color: #C62828; }

        .bw-reviews-status {
          clip: rect(0 0 0 0);
          clip-path: inset(50%);
          height: 1px;
          overflow: hidden;
          position: absolute;
          white-space: nowrap;
          width: 1px;
        }

        .bw-reviews-skeleton-row {
          display: grid;
          gap: 20px;
          grid-template-columns: 1fr;
        }

        @media (min-width: 720px) {
          .bw-reviews-skeleton-row {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        .bw-reviews-skeleton-card {
          background: #FFFFFF;
          border: 1px solid #DCE8C8;
          border-radius: 14px;
          min-height: 200px;
          padding: 24px 26px;
        }

        .bw-reviews-skeleton-card .line {
          animation: bw-reviews-shimmer 1200ms linear infinite;
          background: linear-gradient(90deg, #F2F8E8 0%, #FFFFFF 45%, #F2F8E8 90%);
          background-size: 220% 100%;
          border-radius: 999px;
          display: block;
          height: 14px;
          margin-bottom: 12px;
        }

        .bw-reviews-skeleton-card .line.short { width: 40%; }
        .bw-reviews-skeleton-card .line.medium { width: 70%; }
        .bw-reviews-skeleton-card .line.long { width: 90%; }

        @keyframes bw-reviews-shimmer {
          from { background-position: 120% 0; }
          to { background-position: -120% 0; }
        }

        @media (max-width: 520px) {
          .bw-reviews {
            padding: 40px 16px;
          }
          .bw-reviews-title {
            font-size: 26px;
          }
          .bw-reviews-summary-avg {
            font-size: 40px;
          }
          .bw-review-card {
            padding: 20px 22px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bw-reviews-summary,
          .bw-review-card,
          .bw-reviews-skeleton-card .line {
            animation: none;
            transition: none;
            opacity: 1;
            transform: none;
          }
        }
      </style>

      <section class="bw-reviews bw-page-editorial" data-editorial-build="four-page-editorial-20260717" aria-labelledby="bw-reviews-title">
        <div class="bw-reviews-inner">
          <header class="bw-reviews-header">
            <div class="bw-reviews-eyebrow">
              <span class="stars" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
              <span>From real walkers</span>
            </div>
            <h1 id="bw-reviews-title" class="bw-reviews-title">What guests are saying</h1>
            <p class="bw-reviews-lead">Honest reviews from people I've walked Berlin with. Names are shown only when guests choose to share them.</p>
          </header>

          <div data-summary aria-live="polite"></div>
          <p class="bw-reviews-status" data-status aria-live="polite"></p>
          <div data-list aria-busy="true">
            ${this._renderSkeleton()}
          </div>
        </div>
      </section>
    `;
  }

  _renderSkeleton() {
    const card = `
      <div class="bw-reviews-skeleton-card" aria-hidden="true">
        <span class="line short"></span>
        <span class="line long"></span>
        <span class="line long"></span>
        <span class="line medium"></span>
        <span class="line short"></span>
      </div>
    `;
    return `<div class="bw-reviews-skeleton-row">${card}${card}${card}${card}</div>`;
  }

  async _loadAndRender() {
    try {
      const response = await fetch(BW_REVIEWS_API_URL, { signal: this._controller.signal });
      if (!response.ok) throw new Error('Could not load reviews');
      const data = await response.json();
      if (!data || !data.success) throw new Error('listReviews returned failure');
      this._renderReviews(data.reviews || [], data.totalCount || 0);
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('bw-reviews fetch error:', err);
      this._renderError();
    }
  }

  _renderReviews(reviews, totalCount) {
    const summaryEl = this.querySelector('[data-summary]');
    const listEl = this.querySelector('[data-list]');
    if (!summaryEl || !listEl) return;

    const ratedReviews = reviews.filter((review) =>
      Number.isFinite(Number(review.rating)) && Number(review.rating) > 0 && Number(review.rating) <= 5);
    const avg = ratedReviews.length
      ? Math.round((ratedReviews.reduce((acc, r) => acc + Number(r.rating), 0) / ratedReviews.length) * 10) / 10
      : 0;
    const total = totalCount || reviews.length;
    const populationLabel = total
      ? `Based on ${total} ${total === 1 ? 'review' : 'reviews'}`
      : 'No reviews yet';
    const sampleLabel = total > reviews.length && reviews.length
      ? `Average shown from the latest ${reviews.length}`
      : '';

    summaryEl.innerHTML = `
      <div class="bw-reviews-summary">
        <div class="bw-reviews-summary-avg">${avg ? avg.toFixed(1) : 'N/A'}</div>
        <div class="bw-reviews-summary-stars" aria-label="${avg} out of 5 stars">${this._starString(avg)}</div>
        <div class="bw-reviews-summary-count">${populationLabel}</div>
        ${sampleLabel ? `<div class="bw-reviews-summary-sample">${sampleLabel}</div>` : ''}
      </div>
    `;

    if (!reviews.length) {
      listEl.innerHTML = `<p class="bw-reviews-state">No reviews yet. After the next walk, this page will start to fill up.</p>`;
      listEl.setAttribute('aria-busy', 'false');
      this._announce('No reviews are available yet.');
      this._revealSummary();
      return;
    }

    const [featured, ...rest] = reviews;
    listEl.innerHTML = `
      <div class="bw-reviews-grid">
        <div class="bw-reviews-featured">
          ${this._renderCard(featured, true)}
        </div>
        ${rest.length ? `<div class="bw-reviews-ledger">${rest.map((review) => this._renderCard(review)).join('')}</div>` : ''}
      </div>
    `;
    listEl.setAttribute('aria-busy', 'false');
    this._announce(`${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'} loaded.`);

    this._revealSummary();
    this._revealCards();
  }

  _renderCard(r, featured = false) {
    const rating = Number(r.rating) || 0;
    const stars = this._renderStarSpans(rating);
    const quote = this._escapeHtml(r.reviewText || '');
    const nameStr = (r.showName && r.firstName)
      ? `${r.firstName}${r.lastInitial ? ' ' + r.lastInitial + '.' : ''}`
      : 'Anonymous';
    const bylineParts = [`<span class="name">${this._escapeHtml(nameStr)}</span>`];
    if (r.country) bylineParts.push(`<span>${this._escapeHtml(r.country)}</span>`);
    const dateStr = this._formatDate(r.tourDate || r.createdDate);
    if (dateStr) bylineParts.push(`<span>${this._escapeHtml(dateStr)}</span>`);
    const byline = bylineParts.join('<span class="sep" aria-hidden="true">&middot;</span>');

    let sourceLine = '';
    if (r.source && r.source !== 'direct') {
      const safeSource = this._escapeHtml(r.source);
      const sourceUrl = this._safeSourceUrl(r.sourceUrl);
      if (sourceUrl) {
        const safeUrl = this._escapeHtml(sourceUrl);
        sourceLine = `<p class="bw-review-source">Originally posted on <a href="${safeUrl}" target="_blank" rel="noopener">${safeSource}</a></p>`;
      } else {
        sourceLine = `<p class="bw-review-source">Originally posted on ${safeSource}</p>`;
      }
    }

    return `
      <article class="bw-review-card${featured ? ' bw-review-card-featured' : ''}">
        <div class="bw-review-stars" aria-label="${rating} out of 5 stars">${stars}</div>
        <blockquote class="bw-review-quote">&ldquo;${quote}&rdquo;</blockquote>
        <p class="bw-review-byline">${byline}</p>
        ${sourceLine}
      </article>
    `;
  }

  _renderStarSpans(rating) {
    const r = Math.max(0, Math.min(5, Math.round(rating)));
    let out = '';
    for (let i = 0; i < r; i++) out += '<span aria-hidden="true">&#9733;</span>';
    for (let i = r; i < 5; i++) out += '<span aria-hidden="true" class="dim">&#9733;</span>';
    return out;
  }

  _starString(rating) {
    const r = Math.max(0, Math.min(5, Math.round(rating)));
    return '★'.repeat(r) + '☆'.repeat(5 - r);
  }

  _formatDate(d) {
    if (!d) return '';
    try {
      const date = new Date(d);
      if (isNaN(date)) return '';
      const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      return `${months[date.getMonth()]} ${date.getFullYear()}`;
    } catch (e) { return ''; }
  }

  _renderError() {
    const summaryEl = this.querySelector('[data-summary]');
    const listEl = this.querySelector('[data-list]');
    if (summaryEl) summaryEl.innerHTML = '';
    if (listEl) {
      listEl.innerHTML = `<p class="bw-reviews-state error" role="status">Reviews could not be loaded right now. Please try again in a moment.</p>`;
      listEl.setAttribute('aria-busy', 'false');
      this._announce('Reviews could not be loaded right now.');
    }
  }

  _revealSummary() {
    const el = this.querySelector('.bw-reviews-summary');
    if (!el || this._reduceMotion) {
      if (el) el.classList.add('visible');
      return;
    }
    requestAnimationFrame(() => el.classList.add('visible'));
  }

  _revealCards() {
    const cards = this.querySelectorAll('.bw-review-card');
    if (this._reduceMotion || !('IntersectionObserver' in window)) {
      cards.forEach(c => c.classList.add('visible'));
      return;
    }
    this._cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this._cardObserver?.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    cards.forEach((card, i) => {
      card.style.transitionDelay = `${Math.min(i * 60, 360)}ms`;
      this._cardObserver.observe(card);
    });
  }

  _setupAnimations() {
    // Entrance animations are wired in _revealSummary / _revealCards after data loads.
    // This stub exists for parity with other elements and future use.
  }

  _announce(message) {
    const status = this.querySelector('[data-status]');
    if (status) status.textContent = message;
  }

  _escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  _safeSourceUrl(value) {
    if (!value) return '';
    try {
      const url = new URL(String(value), window.location.href);
      return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : '';
    } catch (error) {
      return '';
    }
  }
}

if (!customElements.get('bw-reviews')) {
  customElements.define('bw-reviews', BWReviewsElement);
}
