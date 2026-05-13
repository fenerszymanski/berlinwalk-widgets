const BW_TESTIMONIALS_DATA_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/testimonials/data.json';

class BWTestimonialsElement extends HTMLElement {
  constructor() {
    super();
    this._animated = false;
    this._observer = null;
    this._currentIndex = 0;
    this._testimonials = [];
    this._autoRotateTimer = null;
    this._resumeTimer = null;
    this._userInteractedAt = null;
    this._pointerStartX = 0;
    this._pointerStartY = 0;
    this._controller = null;
    this._reduceMotion = false;
  }

  connectedCallback() {
    this._controller = new AbortController();
    this._reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this._renderShell();
    this._setupInteractions();
    this._loadDataAndRender();
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
    if (this._autoRotateTimer) window.clearInterval(this._autoRotateTimer);
    if (this._resumeTimer) window.clearTimeout(this._resumeTimer);
    if (this._controller) this._controller.abort();
  }

  _renderShell() {
    this.innerHTML = `
      <style>
        bw-testimonials {
          display: block;
          width: 100%;
        }

        .bw-testimonials {
          --serif: Merriweather, Georgia, serif;
          background: #FAFAF5;
          color: #212121;
          font-family: Montserrat, Arial, sans-serif;
          margin: 0;
          max-width: 100%;
          overflow-x: hidden;
          padding: 64px 24px;
        }

        .bw-testimonials *,
        .bw-testimonials *::before,
        .bw-testimonials *::after {
          box-sizing: border-box;
        }

        .bw-testimonials h2,
        .bw-testimonials p {
          margin-top: 0;
        }

        .bw-testimonials .bw-testimonials-inner {
          margin: 0 auto;
          max-width: 1100px;
          text-align: center;
        }

        .bw-testimonials .bw-testimonials-header {
          margin: 0 auto;
          max-width: 760px;
        }

        .bw-testimonials .bw-eyebrow {
          align-items: center;
          color: #1B5E20;
          display: flex;
          flex-wrap: wrap;
          font-size: 12px;
          font-weight: 700;
          gap: 8px;
          justify-content: center;
          letter-spacing: 1.4px;
          line-height: 1.35;
          text-transform: uppercase;
        }

        .bw-testimonials .bw-eyebrow-stars {
          color: #FFE600;
          letter-spacing: 0;
          white-space: nowrap;
        }

        .bw-testimonials .bw-eyebrow-text {
          white-space: nowrap;
        }

        .bw-testimonials .bw-testimonials-title {
          color: #1B5E20;
          font-size: 38px;
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 0;
          margin-top: 12px;
        }

        .bw-testimonials .bw-testimonials-lead {
          color: #4E5A4E;
          font-family: var(--serif);
          font-size: 16px;
          font-style: italic;
          line-height: 1.6;
          margin: 12px auto 0;
          max-width: 580px;
        }

        .bw-testimonials .bw-carousel-shell {
          background: #FFFFFF;
          border-radius: 20px;
          box-shadow: 0 4px 24px rgba(27, 94, 32, 0.08);
          margin-top: 40px;
          min-height: 360px;
          opacity: 0;
          overflow: hidden;
          padding: 56px 64px;
          position: relative;
          transform: translateY(12px);
          transition: opacity 400ms ease-out, transform 400ms ease-out;
        }

        .bw-testimonials .bw-carousel-shell.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .bw-testimonials .bw-carousel-shell:focus-visible {
          outline: 3px solid rgba(27, 94, 32, 0.3);
          outline-offset: 3px;
        }

        .bw-testimonials .bw-carousel-shell::before {
          color: #FFE600;
          content: "\"";
          font-size: 140px;
          font-weight: 800;
          left: 32px;
          line-height: 0.7;
          position: absolute;
          top: 20px;
          z-index: 0;
        }

        .bw-testimonials .bw-carousel-region {
          position: relative;
          z-index: 1;
        }

        .bw-testimonials .bw-review-slide {
          opacity: 1;
          transform: translateX(0);
          transition: opacity 300ms ease-out, transform 300ms ease-out;
        }

        .bw-testimonials .bw-review-slide.is-entering {
          opacity: 0;
          transform: translateX(12px);
        }

        .bw-testimonials .bw-review-quote {
          color: #212121;
          font-family: var(--serif);
          font-size: 22px;
          font-style: italic;
          line-height: 1.55;
          margin: 0 auto;
          max-width: 720px;
        }

        .bw-testimonials .bw-review-stars {
          color: #FFE600;
          display: flex;
          font-size: 18px;
          gap: 4px;
          justify-content: center;
          line-height: 1;
          margin-top: 24px;
        }

        .bw-testimonials .bw-review-author {
          margin-top: 16px;
          text-align: center;
        }

        .bw-testimonials .bw-review-name {
          color: #1B5E20;
          display: block;
          font-size: 17px;
          font-weight: 800;
          line-height: 1.35;
        }

        .bw-testimonials .bw-review-country,
        .bw-testimonials .bw-review-source {
          color: #4E5A4E;
          display: block;
          font-family: var(--serif);
          font-size: 14px;
          line-height: 1.6;
          margin-top: 2px;
        }

        .bw-testimonials .bw-error-message {
          color: #4E5A4E;
          font-family: var(--serif);
          font-size: 16px;
          margin: 0;
          position: relative;
          z-index: 1;
        }

        .bw-testimonials .bw-carousel-dots {
          align-items: center;
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-top: 24px;
        }

        .bw-testimonials .bw-carousel-dot {
          align-items: center;
          appearance: none;
          background: transparent;
          border: 0;
          border-radius: 999px;
          cursor: pointer;
          display: inline-flex;
          height: 24px;
          justify-content: center;
          padding: 0;
          transition: width 200ms ease-out;
          width: 24px;
        }

        .bw-testimonials .bw-carousel-dot::before {
          background: #C5E1A5;
          border-radius: 999px;
          content: "";
          display: block;
          height: 10px;
          transition: background 200ms ease-out, width 200ms ease-out;
          width: 10px;
        }

        .bw-testimonials .bw-carousel-dot[aria-current="true"],
        .bw-testimonials .bw-carousel-dot[aria-current="true"]::before {
          width: 28px;
        }

        .bw-testimonials .bw-carousel-dot[aria-current="true"]::before {
          background: #1B5E20;
        }

        .bw-testimonials .bw-carousel-dot:focus-visible {
          outline: 3px solid rgba(27, 94, 32, 0.3);
          outline-offset: 2px;
        }

        .bw-testimonials .bw-trust-strip {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 32px;
        }

        .bw-testimonials .bw-trust-card {
          background: #FFFFFF;
          border: 1px solid #DCE8C8;
          border-radius: 12px;
          color: inherit;
          display: block;
          padding: 16px 18px;
          text-decoration: none;
        }

        .bw-testimonials .bw-trust-logo {
          color: #1B5E20;
          display: block;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.4px;
          line-height: 1.2;
        }

        .bw-testimonials .bw-trust-rating {
          color: #212121;
          display: block;
          font-size: 13px;
          font-weight: 700;
          line-height: 1.4;
          margin-top: 6px;
        }

        .bw-testimonials .bw-trust-card:focus-visible {
          outline: 3px solid rgba(27, 94, 32, 0.3);
          outline-offset: 3px;
        }

        .bw-testimonials .bw-cta-row {
          margin-top: 32px;
          text-align: center;
        }

        .bw-testimonials .bw-booking-cta {
          background: #FFE600;
          border-radius: 10px;
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

        .bw-testimonials .bw-booking-cta:hover,
        .bw-testimonials .bw-booking-cta:focus-visible {
          background: #fff04a;
          transform: translateY(-1px);
        }

        .bw-testimonials .bw-booking-cta:focus-visible {
          outline: 3px solid rgba(27, 94, 32, 0.3);
          outline-offset: 3px;
        }

        .bw-testimonials .bw-skeleton-quote,
        .bw-testimonials .bw-skeleton-line {
          animation: bw-testimonials-shimmer 1200ms linear infinite;
          background: linear-gradient(90deg, #F2F8E8 0%, #FFFFFF 45%, #F2F8E8 90%);
          background-size: 220% 100%;
          border-radius: 999px;
          display: block;
          margin-left: auto;
          margin-right: auto;
        }

        .bw-testimonials .bw-skeleton-quote {
          height: 22px;
          margin-bottom: 16px;
          max-width: 720px;
          width: 88%;
        }

        .bw-testimonials .bw-skeleton-quote.short {
          width: 62%;
        }

        .bw-testimonials .bw-skeleton-line {
          height: 14px;
          margin-top: 20px;
          width: 160px;
        }

        @keyframes bw-testimonials-shimmer {
          from { background-position: 120% 0; }
          to { background-position: -120% 0; }
        }

        @media (max-width: 760px) {
          .bw-testimonials .bw-trust-strip {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 520px) {
          .bw-testimonials {
            padding: 40px 16px;
          }

          .bw-testimonials .bw-eyebrow {
            gap: 6px;
            letter-spacing: 1px;
          }

          .bw-testimonials .bw-testimonials-title {
            font-size: 26px;
          }

          .bw-testimonials .bw-testimonials-lead {
            font-size: 14px;
          }

          .bw-testimonials .bw-carousel-shell {
            margin-top: 40px;
            min-height: 340px;
            padding: 32px 24px;
          }

          .bw-testimonials .bw-carousel-shell::before {
            font-size: 90px;
            left: 18px;
            top: 18px;
          }

          .bw-testimonials .bw-review-quote {
            font-size: 17px;
            max-width: 100%;
          }

          .bw-testimonials .bw-booking-cta {
            max-width: 100%;
          }
        }

        @media (max-width: 380px) {
          .bw-testimonials .bw-booking-cta {
            display: block;
            width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bw-testimonials .bw-carousel-shell,
          .bw-testimonials .bw-review-slide,
          .bw-testimonials .bw-carousel-dot,
          .bw-testimonials .bw-carousel-dot::before,
          .bw-testimonials .bw-booking-cta,
          .bw-testimonials .bw-skeleton-quote,
          .bw-testimonials .bw-skeleton-line {
            animation: none;
            transition: none;
          }

          .bw-testimonials .bw-carousel-shell,
          .bw-testimonials .bw-review-slide.is-entering {
            opacity: 1;
            transform: none;
          }
        }
      </style>

      <section class="bw-testimonials" aria-labelledby="bw-testimonials-title">
        <div class="bw-testimonials-inner">
          <header class="bw-testimonials-header">
            <div class="bw-eyebrow" aria-label="Five star rating and traveler count">
              <span class="bw-eyebrow-stars" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
              <span class="bw-eyebrow-text"><span data-rating-value>5.0</span> rating</span>
              <span aria-hidden="true">-</span>
              <span class="bw-eyebrow-text">Travelers from <span data-countries-count>18+</span> countries</span>
            </div>
            <h2 id="bw-testimonials-title" class="bw-testimonials-title">Words from people I've walked with</h2>
            <p class="bw-testimonials-lead">Honest reviews from real travelers. No edits, no filters.</p>
          </header>

          <div class="bw-carousel-shell" tabindex="0">
            <div
              class="bw-carousel-region"
              role="region"
              aria-roledescription="carousel"
              aria-label="Traveler reviews"
              aria-live="polite"
            >
              ${this._renderLoadingSlide()}
            </div>
          </div>

          <div class="bw-carousel-dots" aria-label="Choose review"></div>
          <div class="bw-trust-strip" aria-label="Review platform ratings"></div>

          <div class="bw-cta-row">
            <a class="bw-booking-cta" href="https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based">Reserve your spot</a>
          </div>
        </div>
      </section>
    `;
  }

  _renderLoadingSlide() {
    return `
      <div aria-hidden="true">
        <span class="bw-skeleton-quote"></span>
        <span class="bw-skeleton-quote"></span>
        <span class="bw-skeleton-quote short"></span>
        <span class="bw-skeleton-line"></span>
      </div>
    `;
  }

  async _loadDataAndRender() {
    try {
      const response = await fetch(BW_TESTIMONIALS_DATA_URL);
      if (!response.ok) throw new Error('Could not load reviews');
      const data = await response.json();
      this._renderTestimonials(data);
      this._setupAnimations();
    } catch (error) {
      this._renderError();
    }
  }

  _renderTestimonials(data) {
    this._testimonials = Array.isArray(data.reviews) ? data.reviews : [];
    if (!this._testimonials.length) throw new Error('No reviews found');

    const rating = this.querySelector('[data-rating-value]');
    const countries = this.querySelector('[data-countries-count]');
    if (rating) rating.textContent = data.stats && data.stats.rating ? data.stats.rating : '5.0';
    if (countries) countries.textContent = data.stats && data.stats.countriesCount ? data.stats.countriesCount : '18+';

    this._renderDots();
    this._renderTrustStrip(data.links || {}, data.stats || {});
    this._renderReview(0, false);
    this._startAutoRotate();
  }

  _renderReview(index, animate) {
    const region = this.querySelector('.bw-carousel-region');
    if (!region || !this._testimonials.length) return;

    const review = this._testimonials[index];
    const rating = Number(review.rating || 5);
    const source = review.source || 'FreeTour.com';
    const slide = document.createElement('article');
    slide.className = 'bw-review-slide';
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `Review ${index + 1} of ${this._testimonials.length}`);

    if (animate && !this._reduceMotion) slide.classList.add('is-entering');
    slide.innerHTML = `
      <p class="bw-review-quote">${this._escapeHtml(review.quote || '')}</p>
      ${this._renderStars(rating)}
      <div class="bw-review-author">
        <span class="bw-review-name">${this._escapeHtml(review.author || '')}</span>
        <span class="bw-review-country">${this._escapeHtml(`${review.country || ''} ${review.flag || ''}`.trim())}</span>
        <span class="bw-review-source">${this._escapeHtml(source)}</span>
      </div>
    `;

    region.replaceChildren(slide);

    if (animate && !this._reduceMotion) {
      slide.getBoundingClientRect();
      slide.classList.remove('is-entering');
    }

    this._updateDots();
  }

  _renderStars(rating) {
    return `
      <div class="bw-review-stars" aria-label="${rating} out of 5 stars">
        ${Array.from({ length: 5 }).map(() => `<span aria-hidden="true">&#9733;</span>`).join('')}
      </div>
    `;
  }

  _renderDots() {
    const dots = this.querySelector('.bw-carousel-dots');
    if (!dots) return;

    dots.innerHTML = this._testimonials.map((review, index) => `
      <button class="bw-carousel-dot" type="button" aria-label="Go to review ${index + 1} of ${this._testimonials.length}" data-review-index="${index}"></button>
    `).join('');
    this._updateDots();
  }

  _updateDots() {
    this.querySelectorAll('.bw-carousel-dot').forEach((dot, index) => {
      if (index === this._currentIndex) {
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.removeAttribute('aria-current');
      }
    });
  }

  _renderTrustStrip(links, stats) {
    const strip = this.querySelector('.bw-trust-strip');
    if (!strip) return;

    const freetourHref = links.freetour || 'https://www.freetour.com/berlin/berlin-behind-the-landmarks-a-walk-through-power-faith-change';
    const rating = stats.rating || '5.0';
    const platforms = [
      { name: 'FreeTour.com', rating: '9.8/10', href: freetourHref },
      { name: 'GuruWalk', rating: `${rating}/5`, href: 'https://www.guruwalk.com/' },
      { name: 'Google', rating: `${rating}/5`, href: 'https://www.google.com/search?q=BerlinWalk+Free+Walking+Tour' }
    ];

    strip.innerHTML = platforms.map(platform => `
      <a class="bw-trust-card" href="${platform.href}">
        <span class="bw-trust-logo">${this._escapeHtml(platform.name)}</span>
        <span class="bw-trust-rating">${this._escapeHtml(platform.rating)} traveler rating</span>
      </a>
    `).join('');
  }

  _setupInteractions() {
    const signal = this._controller.signal;

    this.addEventListener('click', (event) => {
      const dot = event.target.closest('.bw-carousel-dot');
      if (!dot) return;
      this._goToReview(Number(dot.dataset.reviewIndex || 0), true);
    }, { signal });

    this.addEventListener('mouseover', (event) => {
      if (!event.target.closest('.bw-carousel-shell')) return;
      this._markInteraction();
    }, { signal });

    this.addEventListener('focusin', (event) => {
      if (!event.target.closest('.bw-carousel-shell, .bw-carousel-dots')) return;
      this._markInteraction();
    }, { signal });

    this.addEventListener('keydown', (event) => {
      if (!event.target.closest('.bw-carousel-shell, .bw-carousel-dots')) return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        this._goToReview(this._currentIndex + 1, true);
        this._focusCurrentDot();
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        this._goToReview(this._currentIndex - 1, true);
        this._focusCurrentDot();
      }
    }, { signal });

    this.addEventListener('pointerdown', (event) => {
      if (!event.target.closest('.bw-carousel-shell')) return;
      this._pointerStartX = event.clientX;
      this._pointerStartY = event.clientY;
      this._markInteraction();
    }, { signal });

    this.addEventListener('pointerup', (event) => {
      if (!event.target.closest('.bw-carousel-shell')) return;
      const deltaX = event.clientX - this._pointerStartX;
      const deltaY = event.clientY - this._pointerStartY;
      if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY)) return;
      this._goToReview(this._currentIndex + (deltaX < 0 ? 1 : -1), true);
    }, { signal });
  }

  _goToReview(index, userInitiated) {
    if (!this._testimonials.length) return;
    if (userInitiated) this._markInteraction();
    this._currentIndex = (index + this._testimonials.length) % this._testimonials.length;
    this._renderReview(this._currentIndex, true);
  }

  _focusCurrentDot() {
    const dot = this.querySelectorAll('.bw-carousel-dot')[this._currentIndex];
    if (dot) dot.focus();
  }

  _markInteraction() {
    this._userInteractedAt = Date.now();
    this._stopAutoRotate();
    if (this._resumeTimer) window.clearTimeout(this._resumeTimer);
    this._resumeTimer = window.setTimeout(() => {
      const idleFor = Date.now() - (this._userInteractedAt || 0);
      if (idleFor >= 5000) this._startAutoRotate();
    }, 5000);
  }

  _startAutoRotate() {
    if (this._reduceMotion || this._testimonials.length <= 1 || this._autoRotateTimer) return;
    this._autoRotateTimer = window.setInterval(() => {
      this._goToReview(this._currentIndex + 1, false);
    }, 7000);
  }

  _stopAutoRotate() {
    if (!this._autoRotateTimer) return;
    window.clearInterval(this._autoRotateTimer);
    this._autoRotateTimer = null;
  }

  _setupAnimations() {
    const shell = this.querySelector('.bw-carousel-shell');
    if (!shell) return;

    if (this._reduceMotion) {
      this._animated = true;
      shell.classList.add('visible');
      return;
    }

    if (!('IntersectionObserver' in window)) {
      this._animated = true;
      shell.classList.add('visible');
      return;
    }

    this._observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || this._animated) return;
        this._animated = true;
        shell.classList.add('visible');
        this._observer.disconnect();
      });
    }, { threshold: 0.3 });

    this._observer.observe(shell);
  }

  _renderError() {
    this._stopAutoRotate();
    const region = this.querySelector('.bw-carousel-region');
    const dots = this.querySelector('.bw-carousel-dots');
    const trust = this.querySelector('.bw-trust-strip');
    const shell = this.querySelector('.bw-carousel-shell');
    if (shell) shell.classList.add('visible');
    if (region) region.innerHTML = `<p class="bw-error-message">Reviews could not be loaded.</p>`;
    if (dots) dots.replaceChildren();
    if (trust) trust.replaceChildren();
  }

  _escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

if (!customElements.get('bw-testimonials')) {
  customElements.define('bw-testimonials', BWTestimonialsElement);
}
