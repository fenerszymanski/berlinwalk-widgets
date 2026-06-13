const BW_FAQ_DATA_URL = 'https://fenerszymanski.github.io/berlinwalk-widgets/faq/data.json';
const BW_FAQ_LOCAL_DATA_URL = document.currentScript && document.currentScript.src
  ? new URL('./data.json', document.currentScript.src).href
  : './data.json';

class BWFAQElement extends HTMLElement {
  constructor() {
    super();
    this._data = null;
    this._config = null;
    this._observer = null;
    this._controller = null;
    this._animated = false;
    this._activeTabIndex = 0;

    this._handleClick = this._handleClick.bind(this);
    this._handleKeydown = this._handleKeydown.bind(this);
  }

  static get observedAttributes() {
    return ['post', 'heading'];
  }

  connectedCallback() {
    this._controller = new AbortController();
    this._ensureAnchorId();
    this._renderLoading();
    this._loadDataAndRender();
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
    if (this._controller) this._controller.abort();
    this.removeEventListener('click', this._handleClick);
    this.removeEventListener('keydown', this._handleKeydown);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || !this.isConnected || !this._data) return;
    if (name === 'post' || name === 'heading') {
      this._ensureAnchorId();
      this._renderFromData();
    }
  }

  async _loadDataAndRender() {
    try {
      this._data = await this._loadData();
      this._renderFromData();
    } catch (err) {
      this._renderError('FAQ data unavailable.');
    }
  }

  async _loadData() {
    const urls = [BW_FAQ_DATA_URL];
    if (BW_FAQ_LOCAL_DATA_URL !== BW_FAQ_DATA_URL) urls.push(BW_FAQ_LOCAL_DATA_URL);

    let lastError = null;
    for (const url of urls) {
      try {
        const res = await fetch(url, { signal: this._controller.signal });
        if (!res.ok) throw new Error(`FAQ data unavailable: ${res.status}`);
        return await res.json();
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError || new Error('FAQ data unavailable');
  }

  _renderFromData() {
    const post = this.getAttribute('post') || 'home';
    this._config = this._data && this._data[post];

    if (!this._config) {
      console.warn(`bw-faq: FAQ key "${post}" not found in faq/data.json`);
      this._renderError(`FAQ not configured for ${post}.`);
      return;
    }

    this._activeTabIndex = 0;
    this._animated = false;
    this._render();
    this._appendSchema();
    this._setupInteractions();
    this._setupAnimations();
    this._scrollIntoViewIfTargeted();
  }

  _ensureAnchorId() {
    if ((this.getAttribute('post') || 'home') === 'home' && !this.id) {
      this.id = 'faq';
    }
  }

  _scrollIntoViewIfTargeted() {
    if ((this.getAttribute('post') || 'home') !== 'home') return;
    if (window.location.hash !== '#faq') return;

    let attempts = 0;
    const scrollToTarget = () => {
      if (this.isConnected && window.location.hash === '#faq') {
        this.scrollIntoView({ block: 'start', behavior: 'auto' });
      }
      attempts += 1;
      if (attempts < 48 && window.location.hash === '#faq') {
        window.setTimeout(scrollToTarget, 250);
      }
    };

    window.requestAnimationFrame(scrollToTarget);
  }

  _renderLoading() {
    this.innerHTML = `
      <style>${this._styles()}</style>
      <section class="bw-faq" role="region" aria-label="Frequently asked questions">
        <div class="bw-faq__inner">
          <div class="bw-faq__card bw-faq__card--loading is-visible" aria-hidden="true">
            <div class="bw-faq__header">
              <div class="bw-faq__kicker">BERLIN WALK</div>
              <h2 class="bw-faq__title">${this._escapeHTML(this._heading())}</h2>
              <p class="bw-faq__subtitle">Loading questions...</p>
            </div>
            <div class="bw-faq__skeleton-list">
              <span class="bw-faq__skeleton"></span>
              <span class="bw-faq__skeleton"></span>
              <span class="bw-faq__skeleton bw-faq__skeleton--short"></span>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  _renderError(message) {
    this.innerHTML = `
      <style>${this._styles()}</style>
      <section class="bw-faq" role="region" aria-label="Frequently asked questions">
        <div class="bw-faq__inner">
          <div class="bw-faq__empty">${this._escapeHTML(message)}</div>
        </div>
      </section>
    `;
  }

  _render() {
    const groups = this._groups();

    this.innerHTML = `
      <style>${this._styles()}</style>
      <section class="bw-faq" role="region" aria-label="Frequently asked questions">
        <div class="bw-faq__inner">
          <div class="bw-faq__card">
            <header class="bw-faq__header">
              <div class="bw-faq__kicker">BERLIN WALK</div>
              <h2 class="bw-faq__title">${this._escapeHTML(this._heading())}</h2>
              ${this._config.subtitle ? `<p class="bw-faq__subtitle">${this._escapeHTML(this._config.subtitle)}</p>` : ''}
            </header>
            ${groups.length > 1 ? this._renderTabs(groups) : ''}
            <div class="bw-faq__panels">
              ${groups.map((group, groupIndex) => this._renderPanel(group, groupIndex, groups.length > 1)).join('')}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  _renderTabs(groups) {
    return `
      <div class="bw-faq__tabs" role="tablist" aria-label="FAQ categories">
        ${groups.map((group, index) => `
          <button
            class="bw-faq__tab"
            id="bw-faq-tab-${index}"
            type="button"
            role="tab"
            aria-selected="${index === this._activeTabIndex ? 'true' : 'false'}"
            aria-controls="bw-faq-panel-${index}"
            data-tab-index="${index}"
          >${this._escapeHTML(group.name)}</button>
        `).join('')}
      </div>
    `;
  }

  _renderPanel(group, groupIndex, hasTabs) {
    const hidden = hasTabs && groupIndex !== this._activeTabIndex;

    return `
      <div
        class="bw-faq__panel"
        id="bw-faq-panel-${groupIndex}"
        ${hasTabs ? `role="tabpanel" aria-labelledby="bw-faq-tab-${groupIndex}"` : ''}
        data-panel-index="${groupIndex}"
        ${hidden ? 'hidden' : ''}
      >
        <div class="bw-faq__items">
          ${group.items.map((item, itemIndex) => this._renderItem(item, groupIndex, itemIndex)).join('')}
        </div>
      </div>
    `;
  }

  _renderItem(item, groupIndex, itemIndex) {
    const itemId = `${groupIndex}-${itemIndex}`;
    const open = itemIndex === 0;

    return `
      <article class="bw-faq__item ${open ? 'is-open' : ''}" data-faq-item>
        <h3 class="bw-faq__question-heading">
          <button
            class="bw-faq__question"
            id="bw-faq-question-${itemId}"
            type="button"
            aria-expanded="${open ? 'true' : 'false'}"
            aria-controls="bw-faq-answer-${itemId}"
          >
            <span class="bw-faq__question-text">${this._escapeHTML(item.q)}</span>
            <span class="bw-faq__chevron" aria-hidden="true"></span>
          </button>
        </h3>
        <div
          class="bw-faq__answer-wrap"
          id="bw-faq-answer-${itemId}"
          role="region"
          aria-labelledby="bw-faq-question-${itemId}"
          ${open ? '' : 'hidden'}
        >
          <div class="bw-faq__answer">${this._answerHTML(item.a)}</div>
        </div>
      </article>
    `;
  }

  _setupInteractions() {
    this.removeEventListener('click', this._handleClick);
    this.removeEventListener('keydown', this._handleKeydown);
    this.addEventListener('click', this._handleClick);
    this.addEventListener('keydown', this._handleKeydown);
    this._syncAnswerHeights();
  }

  _setupAnimations() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const card = this.querySelector('.bw-faq__card');
    if (!card) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      card.classList.add('is-visible');
      return;
    }

    if (this._observer) this._observer.disconnect();
    this._observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this._animated) {
          this._animated = true;
          window.setTimeout(() => card.classList.add('is-visible'), 400);
          this._observer.disconnect();
        }
      });
    }, { threshold: 0.2 });

    this._observer.observe(this);
  }

  _handleClick(event) {
    const tab = event.target.closest('.bw-faq__tab');
    if (tab && this.contains(tab)) {
      this._selectTab(Number(tab.dataset.tabIndex || 0));
      return;
    }

    const button = event.target.closest('.bw-faq__question');
    if (!button || !this.contains(button)) return;
    this._toggleQuestion(button);
  }

  _handleKeydown(event) {
    const question = event.target.closest('.bw-faq__question');
    if (!question || !this.contains(question)) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this._toggleQuestion(question);
      return;
    }

    const buttons = this._visibleQuestionButtons();
    const index = buttons.indexOf(question);
    if (index === -1) return;

    let nextIndex = index;
    if (event.key === 'ArrowDown') nextIndex = (index + 1) % buttons.length;
    else if (event.key === 'ArrowUp') nextIndex = (index - 1 + buttons.length) % buttons.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = buttons.length - 1;
    else return;

    event.preventDefault();
    buttons[nextIndex].focus();
  }

  _toggleQuestion(button) {
    const item = button.closest('[data-faq-item]');
    const answer = item && item.querySelector('.bw-faq__answer-wrap');
    if (!item || !answer) return;

    const isOpen = button.getAttribute('aria-expanded') === 'true';
    if (isOpen) this._closeItem(item, button, answer);
    else this._openItem(item, button, answer);
  }

  _openItem(item, button, answer) {
    item.classList.add('is-open');
    button.setAttribute('aria-expanded', 'true');
    answer.hidden = false;
    answer.style.maxHeight = `${answer.scrollHeight}px`;
  }

  _closeItem(item, button, answer) {
    item.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');
    answer.style.maxHeight = `${answer.scrollHeight}px`;
    answer.getBoundingClientRect();
    answer.style.maxHeight = '0px';
    window.setTimeout(() => {
      if (button.getAttribute('aria-expanded') === 'false') answer.hidden = true;
    }, 300);
  }

  _selectTab(index) {
    this._activeTabIndex = index;

    this.querySelectorAll('.bw-faq__tab').forEach((tab, tabIndex) => {
      tab.setAttribute('aria-selected', String(tabIndex === index));
    });

    this.querySelectorAll('.bw-faq__panel').forEach((panel, panelIndex) => {
      panel.hidden = panelIndex !== index;
    });

    this._syncAnswerHeights();
  }

  _syncAnswerHeights() {
    this.querySelectorAll('.bw-faq__answer-wrap').forEach(answer => {
      const button = this.querySelector(`[aria-controls="${answer.id}"]`);
      const isOpen = button && button.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        answer.hidden = false;
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      } else {
        answer.style.maxHeight = '0px';
        answer.hidden = true;
      }
    });
  }

  _visibleQuestionButtons() {
    return Array.from(this.querySelectorAll('.bw-faq__panel:not([hidden]) .bw-faq__question'));
  }

  _appendSchema() {
    const oldSchema = this.querySelector('script[data-bw-faq-schema]');
    if (oldSchema) oldSchema.remove();

    const questions = this._allItems().map(item => ({
      '@type': 'Question',
      name: this._plainText(item.q),
      acceptedAnswer: {
        '@type': 'Answer',
        text: this._plainText(this._markdownToText(item.a))
      }
    }));

    const schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.dataset.bwFaqSchema = 'true';
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: questions
    });
    this.appendChild(schema);
  }

  _groups() {
    if (Array.isArray(this._config.tabs) && this._config.tabs.length) {
      return this._config.tabs.map(tab => ({
        name: tab.name || 'Questions',
        items: Array.isArray(tab.items) ? tab.items : []
      })).filter(group => group.items.length);
    }

    return [{
      name: 'Questions',
      items: Array.isArray(this._config.items) ? this._config.items : []
    }];
  }

  _allItems() {
    return this._groups().flatMap(group => group.items);
  }

  _heading() {
    return this.getAttribute('heading') || 'Frequently Asked Questions';
  }

  _answerHTML(answer) {
    let html = this._escapeHTML(answer || '');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    return html;
  }

  _markdownToText(value) {
    return String(value || '')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '$1');
  }

  _plainText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  _escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));
  }

  _styles() {
    return `
      bw-faq {
        background: #F0EDE8;
        display: block;
        width: 100%;
      }

      .bw-faq {
        background: #F0EDE8;
        color: #212121;
        font-family: Montserrat, Arial, sans-serif;
        margin: 0;
        max-width: 100%;
        overflow-x: hidden;
        padding: 64px 32px;
      }

      .bw-faq *,
      .bw-faq *::before,
      .bw-faq *::after {
        box-sizing: border-box;
      }

      .bw-faq__inner {
        margin: 0 auto;
        max-width: 1200px;
      }

      .bw-faq__card {
        background: #FAFAF5;
        border: 0.5px solid rgba(27, 94, 32, 0.15);
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
        opacity: 0;
        overflow: hidden;
        transform: translateY(12px);
        transition: opacity 600ms ease-out, transform 600ms ease-out;
      }

      .bw-faq__card.is-visible {
        opacity: 1;
        transform: translateY(0);
      }

      .bw-faq__header {
        background: #1B5E20;
        padding: 24px 28px;
      }

      .bw-faq__kicker {
        color: #FFE600;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 2.5px;
        line-height: 1.4;
        margin: 0 0 7px;
        text-transform: uppercase;
      }

      .bw-faq__title {
        color: #FFFFFF;
        font-size: 28px;
        font-weight: 800;
        letter-spacing: -0.01em;
        line-height: 1.2;
        margin: 0;
      }

      .bw-faq__subtitle {
        color: rgba(255, 255, 255, 0.72);
        font-size: 14px;
        font-weight: 300;
        line-height: 1.55;
        margin: 8px 0 0;
        max-width: 760px;
      }

      .bw-faq__tabs {
        background: #FFFFFF;
        border-left: 0.5px solid rgba(27, 94, 32, 0.15);
        border-right: 0.5px solid rgba(27, 94, 32, 0.15);
        display: flex;
        flex-wrap: wrap;
        gap: 24px;
        padding: 14px 28px 0;
      }

      .bw-faq__tab {
        appearance: none;
        background: transparent;
        border: 0;
        border-bottom: 2px solid transparent;
        color: #6F766F;
        cursor: pointer;
        font: inherit;
        font-size: 13px;
        font-weight: 800;
        line-height: 1.3;
        min-height: 44px;
        padding: 8px 0 12px;
        transition: border-color 150ms ease, color 150ms ease;
      }

      .bw-faq__tab:hover,
      .bw-faq__tab[aria-selected="true"] {
        border-bottom-color: #FFE600;
        color: #1B5E20;
      }

      .bw-faq__tab:focus-visible,
      .bw-faq__question:focus-visible {
        outline: 2px solid #1B5E20;
        outline-offset: 2px;
      }

      .bw-faq__panels {
        background: #FFFFFF;
      }

      .bw-faq__panel[hidden] {
        display: none;
      }

      .bw-faq__items {
        border-top: 0.5px solid rgba(27, 94, 32, 0.15);
      }

      .bw-faq__item {
        background: #FFFFFF;
        border-bottom: 0.5px solid rgba(27, 94, 32, 0.15);
      }

      .bw-faq__item:last-child {
        border-bottom: 0;
      }

      .bw-faq__question-heading {
        margin: 0;
      }

      .bw-faq__question {
        align-items: center;
        appearance: none;
        background: transparent;
        border: 0;
        color: #212121;
        cursor: pointer;
        display: flex;
        font: inherit;
        gap: 16px;
        justify-content: space-between;
        min-height: 52px;
        padding: 16px 28px;
        text-align: left;
        transition: background-color 150ms ease, color 150ms ease;
        width: 100%;
      }

      .bw-faq__question:hover {
        background: #FAFAF5;
        color: #1B5E20;
      }

      .bw-faq__item.is-open .bw-faq__question {
        color: #1B5E20;
      }

      .bw-faq__question-text {
        font-size: 17px;
        font-weight: 800;
        line-height: 1.35;
        min-width: 0;
      }

      .bw-faq__chevron {
        border-bottom: 2px solid currentColor;
        border-right: 2px solid currentColor;
        color: #1B5E20;
        display: block;
        flex: 0 0 auto;
        height: 10px;
        transform: rotate(45deg);
        transition: transform 300ms ease;
        width: 10px;
      }

      .bw-faq__item.is-open .bw-faq__chevron {
        transform: rotate(225deg);
      }

      .bw-faq__answer-wrap {
        max-height: 0;
        overflow: hidden;
        transition: max-height 300ms ease;
      }

      .bw-faq__answer {
        color: #4E5A4E;
        font-size: 15.5px;
        font-weight: 300;
        line-height: 1.65;
        padding: 0 28px 20px;
      }

      .bw-faq__answer strong {
        color: #212121;
        font-weight: 800;
      }

      .bw-faq__answer a {
        color: #1B5E20;
        font-weight: 800;
        text-decoration-thickness: 1px;
        text-underline-offset: 3px;
      }

      .bw-faq__empty {
        background: #FAFAF5;
        border: 0.5px solid rgba(27, 94, 32, 0.15);
        border-radius: 12px;
        color: #4E5A4E;
        font-size: 15px;
        padding: 24px;
      }

      .bw-faq__skeleton-list {
        background: #FFFFFF;
        padding: 24px 28px;
      }

      .bw-faq__skeleton {
        animation: bw-faq-shimmer 1200ms linear infinite;
        background: linear-gradient(90deg, #F0EDE8 0%, #FFFFFF 45%, #F0EDE8 90%);
        background-size: 220% 100%;
        border-radius: 999px;
        display: block;
        height: 18px;
        margin: 0 0 16px;
        width: 88%;
      }

      .bw-faq__skeleton--short {
        width: 64%;
      }

      @keyframes bw-faq-shimmer {
        from { background-position: 120% 0; }
        to { background-position: -120% 0; }
      }

      @media (max-width: 520px) {
        .bw-faq {
          padding: 48px 20px;
        }

        .bw-faq__header {
          padding: 20px 18px;
        }

        .bw-faq__title {
          font-size: 22px;
        }

        .bw-faq__subtitle {
          font-size: 13px;
        }

        .bw-faq__tabs {
          gap: 18px;
          padding: 12px 18px 0;
        }

        .bw-faq__tab {
          font-size: 12px;
          padding-bottom: 10px;
        }

        .bw-faq__question {
          min-height: 44px;
          padding: 14px 18px;
        }

        .bw-faq__question-text {
          font-size: 15px;
        }

        .bw-faq__answer {
          font-size: 14px;
          padding: 0 18px 18px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .bw-faq__card,
        .bw-faq__answer-wrap,
        .bw-faq__chevron,
        .bw-faq__skeleton {
          animation: none;
          transition: none;
        }

        .bw-faq__card {
          opacity: 1;
          transform: none;
        }
      }
    `;
  }
}

if (!customElements.get('bw-faq')) {
  customElements.define('bw-faq', BWFAQElement);
}
