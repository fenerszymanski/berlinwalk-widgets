const BW_LEAVE_REVIEW_API_URL = 'https://www.berlinwalk.com/_functions/submitReview';

const BW_LEAVE_REVIEW_COUNTRIES = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Argentina','Armenia','Australia',
  'Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium',
  'Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei',
  'Bulgaria','Burkina Faso','Burundi','Cambodia','Cameroon','Canada','Cape Verde',
  'Central African Republic','Chad','Chile','China','Colombia','Comoros','Congo','Costa Rica',
  'Croatia','Cuba','Cyprus','Czech Republic','Denmark','Djibouti','Dominica','Dominican Republic',
  'Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Eswatini','Ethiopia',
  'Fiji','Finland','France','Gabon','Gambia','Georgia','Germany','Ghana','Greece','Grenada',
  'Guatemala','Guinea','Guinea-Bissau','Guyana','Haiti','Honduras','Hong Kong','Hungary',
  'Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Ivory Coast',
  'Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kosovo','Kuwait','Kyrgyzstan','Laos',
  'Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg',
  'Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Mauritania','Mauritius','Mexico',
  'Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar','Namibia','Nepal',
  'Netherlands','New Zealand','Nicaragua','Niger','Nigeria','North Korea','North Macedonia',
  'Norway','Oman','Pakistan','Palestine','Panama','Papua New Guinea','Paraguay','Peru',
  'Philippines','Poland','Portugal','Qatar','Romania','Russia','Rwanda','Saudi Arabia',
  'Senegal','Serbia','Sierra Leone','Singapore','Slovakia','Slovenia','Somalia','South Africa',
  'South Korea','South Sudan','Spain','Sri Lanka','Sudan','Suriname','Sweden','Switzerland',
  'Syria','Taiwan','Tajikistan','Tanzania','Thailand','Togo','Tunisia','Turkey','Turkmenistan',
  'Uganda','Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay',
  'Uzbekistan','Vatican City','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe'
];

class BWLeaveReviewElement extends HTMLElement {
  constructor() {
    super();
    this._controller = null;
    this._bookingId = '';
    this._firstName = '';
  }

  connectedCallback() {
    this._controller = new AbortController();
    this._readUrlParams();
    this._renderShell();
    this._wireForm();
  }

  disconnectedCallback() {
    if (this._controller) this._controller.abort();
  }

  _readUrlParams() {
    const params = new URLSearchParams(window.location.search);
    this._bookingId = params.get('bid') || '';
    this._firstName = params.get('n') || '';
  }

  _safeName(value) {
    return String(value).replace(/[^\p{L}\p{N}\s\-'\.]/gu, '').slice(0, 60);
  }

  _escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  _renderShell() {
    const safeName = this._firstName ? this._safeName(this._firstName) : '';
    const greeting = safeName
      ? `Thanks for walking Berlin with me, ${this._escapeHtml(safeName)}. A few words about the tour go a long way.`
      : 'Thanks for walking Berlin with me. A few words about the tour go a long way.';

    const countryOptions = BW_LEAVE_REVIEW_COUNTRIES
      .map(name => `<option value="${this._escapeHtml(name)}">${this._escapeHtml(name)}</option>`)
      .join('');

    this.innerHTML = `
      <style>
        bw-leave-review { display: block; width: 100%; }

        .bw-leave-review {
          --bw-green: #1B5E20;
          --bw-green-dark: #164a1a;
          --bw-yellow: #FFE600;
          --bw-lime: #7CB342;
          --bw-light-green: #C5E1A5;
          --bw-border: #DCE8C8;
          --bw-text: #212121;
          --bw-muted: #4E5A4E;
          --bw-white: #ffffff;
          --bw-error: #C62828;
          font-family: Montserrat, 'Helvetica Neue', Arial, sans-serif;
          color: var(--bw-text);
          margin: 0 auto;
          max-width: 640px;
          padding: 16px;
          width: 100%;
          -webkit-font-smoothing: antialiased;
        }

        .bw-leave-review *,
        .bw-leave-review *::before,
        .bw-leave-review *::after {
          box-sizing: border-box;
        }

        .bw-leave-review .bw-lr-card {
          background: var(--bw-white);
          border: 1px solid var(--bw-border);
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
          overflow: hidden;
        }

        .bw-leave-review .bw-lr-band {
          background: var(--bw-yellow);
          padding: 28px 32px 26px;
        }

        .bw-leave-review .bw-lr-kicker {
          color: var(--bw-green);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          margin: 0 0 6px;
          text-transform: uppercase;
        }

        .bw-leave-review .bw-lr-title {
          color: var(--bw-green);
          font-family: Merriweather, Georgia, serif;
          font-size: 28px;
          font-weight: 700;
          line-height: 1.2;
          margin: 0;
        }

        .bw-leave-review .bw-lr-body { padding: 28px 32px 32px; }

        .bw-leave-review .bw-lr-greeting {
          color: var(--bw-text);
          font-size: 15px;
          line-height: 1.65;
          margin: 0 0 18px;
        }

        .bw-leave-review .bw-lr-field { margin-bottom: 22px; }

        .bw-leave-review .bw-lr-label {
          color: var(--bw-green);
          display: block;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.02em;
          margin-bottom: 8px;
        }

        .bw-leave-review .bw-lr-label-hint {
          color: var(--bw-muted);
          font-size: 12px;
          font-weight: 400;
          margin-left: 6px;
        }

        .bw-leave-review .bw-lr-stars {
          display: inline-flex;
          flex-direction: row-reverse;
          gap: 4px;
        }

        .bw-leave-review .bw-lr-stars input[type="radio"] {
          opacity: 0;
          pointer-events: none;
          position: absolute;
        }

        .bw-leave-review .bw-lr-stars label {
          color: #d0d0d0;
          cursor: pointer;
          font-size: 36px;
          line-height: 1;
          transition: color 0.12s ease;
          user-select: none;
        }

        .bw-leave-review .bw-lr-stars label::before { content: "\\2605"; }

        .bw-leave-review .bw-lr-stars input[type="radio"]:checked ~ label,
        .bw-leave-review .bw-lr-stars label:hover,
        .bw-leave-review .bw-lr-stars label:hover ~ label {
          color: var(--bw-green);
        }

        .bw-leave-review .bw-lr-stars input[type="radio"]:focus-visible + label {
          border-radius: 4px;
          outline: 2px solid var(--bw-green);
          outline-offset: 2px;
        }

        .bw-leave-review .bw-lr-input,
        .bw-leave-review .bw-lr-textarea {
          background: #fff;
          border: 1px solid var(--bw-border);
          border-radius: 6px;
          color: var(--bw-text);
          font-family: inherit;
          font-size: 15px;
          padding: 12px 14px;
          transition: border-color 0.15s ease;
          width: 100%;
        }

        .bw-leave-review .bw-lr-input:focus,
        .bw-leave-review .bw-lr-textarea:focus {
          border-color: var(--bw-green);
          outline: none;
        }

        .bw-leave-review .bw-lr-textarea {
          line-height: 1.55;
          min-height: 140px;
          resize: vertical;
        }

        .bw-leave-review .bw-lr-input-small { max-width: 100px; }

        .bw-leave-review .bw-lr-select {
          -webkit-appearance: none;
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3e%3cpath d='M1 1L6 6L11 1' stroke='%231B5E20' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e");
          background-position: right 14px center;
          background-repeat: no-repeat;
          cursor: pointer;
          max-width: 320px;
          padding-right: 38px;
        }

        .bw-leave-review .bw-lr-checkbox-row {
          align-items: flex-start;
          color: var(--bw-text);
          cursor: pointer;
          display: flex;
          font-size: 14px;
          gap: 10px;
          line-height: 1.55;
        }

        .bw-leave-review .bw-lr-checkbox-row input[type="checkbox"] {
          accent-color: var(--bw-green);
          cursor: pointer;
          flex-shrink: 0;
          height: 18px;
          margin-top: 2px;
          width: 18px;
        }

        .bw-leave-review .bw-lr-submit {
          background: var(--bw-green);
          border: 0;
          border-radius: 4px;
          color: var(--bw-yellow);
          cursor: pointer;
          display: block;
          font-family: inherit;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.06em;
          margin-top: 8px;
          padding: 14px 24px;
          text-transform: uppercase;
          transition: background 0.15s ease;
          width: 100%;
        }

        .bw-leave-review .bw-lr-submit:hover { background: var(--bw-green-dark); }

        .bw-leave-review .bw-lr-submit:disabled {
          background: #888;
          color: #ddd;
          cursor: not-allowed;
        }

        .bw-leave-review .bw-lr-message {
          border-radius: 6px;
          display: none;
          font-size: 14px;
          line-height: 1.55;
          margin-top: 16px;
          padding: 12px 16px;
        }

        .bw-leave-review .bw-lr-message.show { display: block; }

        .bw-leave-review .bw-lr-message.error {
          background: #fdecea;
          border: 1px solid #f5c2c0;
          color: var(--bw-error);
        }

        .bw-leave-review .bw-lr-message.success {
          background: var(--bw-light-green);
          border: 1px solid var(--bw-green);
          color: var(--bw-green);
        }

        .bw-leave-review .bw-lr-thanks {
          display: none;
          padding: 36px 32px;
          text-align: center;
        }

        .bw-leave-review .bw-lr-thanks.show { display: block; }

        .bw-leave-review .bw-lr-thanks .bw-lr-checkmark {
          background: var(--bw-light-green);
          border-radius: 50%;
          color: var(--bw-green);
          display: inline-block;
          font-size: 28px;
          height: 56px;
          line-height: 56px;
          margin-bottom: 16px;
          width: 56px;
        }

        .bw-leave-review .bw-lr-thanks h2 {
          color: var(--bw-green);
          font-family: Merriweather, Georgia, serif;
          font-size: 22px;
          margin: 0 0 10px;
        }

        .bw-leave-review .bw-lr-thanks p {
          color: var(--bw-text);
          font-size: 15px;
          line-height: 1.65;
          margin: 0 0 18px;
        }

        .bw-leave-review .bw-lr-thanks a {
          border-bottom: 1px solid var(--bw-green);
          color: var(--bw-green);
          font-weight: 600;
          text-decoration: none;
        }

        @media (max-width: 540px) {
          .bw-leave-review .bw-lr-band { padding: 22px 22px 20px; }
          .bw-leave-review .bw-lr-title { font-size: 24px; }
          .bw-leave-review .bw-lr-body { padding: 22px; }
          .bw-leave-review .bw-lr-stars label { font-size: 32px; }
        }
      </style>

      <div class="bw-leave-review">
        <div class="bw-lr-card">

          <div class="bw-lr-band">
            <p class="bw-lr-kicker">After the walk</p>
            <h1 class="bw-lr-title">Leave a review</h1>
          </div>

          <div class="bw-lr-body" data-form-wrap>
            <p class="bw-lr-greeting">${greeting}</p>

            <form class="bw-lr-form" data-form novalidate>
              <div class="bw-lr-field">
                <label class="bw-lr-label">How was the tour?</label>
                <div class="bw-lr-stars" role="radiogroup" aria-label="Rating, 1 to 5 stars">
                  <input type="radio" name="rating" id="bw-lr-r5" value="5"><label for="bw-lr-r5" aria-label="5 stars"></label>
                  <input type="radio" name="rating" id="bw-lr-r4" value="4"><label for="bw-lr-r4" aria-label="4 stars"></label>
                  <input type="radio" name="rating" id="bw-lr-r3" value="3"><label for="bw-lr-r3" aria-label="3 stars"></label>
                  <input type="radio" name="rating" id="bw-lr-r2" value="2"><label for="bw-lr-r2" aria-label="2 stars"></label>
                  <input type="radio" name="rating" id="bw-lr-r1" value="1"><label for="bw-lr-r1" aria-label="1 star"></label>
                </div>
              </div>

              <div class="bw-lr-field">
                <label class="bw-lr-label" for="bw-lr-text">What did you like? Anything I should know? <span class="bw-lr-label-hint">at least a sentence or two</span></label>
                <textarea class="bw-lr-textarea" id="bw-lr-text" name="reviewText" required minlength="10" maxlength="2000" placeholder="Tell me what stood out from the walk."></textarea>
              </div>

              <div class="bw-lr-field">
                <label class="bw-lr-label" for="bw-lr-li">Last initial <span class="bw-lr-label-hint">optional</span></label>
                <input class="bw-lr-input bw-lr-input-small" id="bw-lr-li" name="lastInitial" type="text" maxlength="1" placeholder="S">
              </div>

              <div class="bw-lr-field">
                <label class="bw-lr-label" for="bw-lr-country">Where are you from? <span class="bw-lr-label-hint">optional</span></label>
                <select class="bw-lr-input bw-lr-select" id="bw-lr-country" name="country">
                  <option value="">Select a country...</option>
                  ${countryOptions}
                </select>
              </div>

              <div class="bw-lr-field">
                <label class="bw-lr-checkbox-row">
                  <input type="checkbox" id="bw-lr-show" name="showName">
                  <span>Show my first name and last initial publicly on the reviews page. (If unchecked, your review appears as anonymous.)</span>
                </label>
              </div>

              <button type="submit" class="bw-lr-submit" data-submit>Send my review</button>

              <div class="bw-lr-message" data-msg role="status" aria-live="polite"></div>
            </form>
          </div>

          <div class="bw-lr-thanks" data-thanks>
            <div class="bw-lr-checkmark">&#10003;</div>
            <h2>Thanks for the review.</h2>
            <p>I'll read it before it goes up on the site. Until then, you're welcome on any future walk.</p>
            <a href="https://berlinwalk.com">Back to berlinwalk.com</a>
          </div>

        </div>
      </div>
    `;
  }

  _wireForm() {
    const form = this.querySelector('[data-form]');
    if (!form) return;
    const signal = this._controller.signal;

    form.addEventListener('submit', (event) => this._handleSubmit(event), { signal });
  }

  async _handleSubmit(event) {
    event.preventDefault();
    this._clearMsg();

    const form = this.querySelector('[data-form]');
    const btn = this.querySelector('[data-submit]');
    const ratingInput = form.querySelector('input[name="rating"]:checked');
    const rating = ratingInput ? parseInt(ratingInput.value, 10) : 0;
    const reviewText = this.querySelector('#bw-lr-text').value.trim();
    const lastInitial = this.querySelector('#bw-lr-li').value.trim();
    const country = this.querySelector('#bw-lr-country').value;
    const showName = this.querySelector('#bw-lr-show').checked;

    if (!rating) {
      this._showMsg('error', 'Please pick a star rating.');
      return;
    }
    if (reviewText.length < 10) {
      this._showMsg('error', 'Please write at least a sentence about the tour.');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Sending...';

    const payload = {
      bookingId: this._bookingId,
      firstName: this._firstName,
      lastInitial,
      country,
      showName,
      rating,
      reviewText
    };

    try {
      const response = await fetch(BW_LEAVE_REVIEW_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: this._controller.signal
      });

      let data = {};
      try { data = await response.json(); } catch (_) {}

      if (response.ok && data && data.success) {
        this._showThanks();
        return;
      }

      btn.disabled = false;
      btn.textContent = 'Send my review';
      const errCode = data && data.error;
      const human = errCode === 'rating'      ? 'Please pick a star rating.'
                  : errCode === 'reviewText'  ? 'Please write at least a sentence about the tour.'
                  : errCode === 'firstName'   ? 'Missing first name. Please use the link from your post-tour email.'
                  : 'Something went wrong. Please try again in a moment.';
      this._showMsg('error', human);
    } catch (err) {
      if (err && err.name === 'AbortError') return;
      btn.disabled = false;
      btn.textContent = 'Send my review';
      this._showMsg('error', 'Connection error. Please try again.');
      console.error('bw-leave-review submitReview error:', err);
    }
  }

  _showMsg(type, text) {
    const msg = this.querySelector('[data-msg]');
    if (!msg) return;
    msg.className = `bw-lr-message show ${type}`;
    msg.textContent = text;
  }

  _clearMsg() {
    const msg = this.querySelector('[data-msg]');
    if (!msg) return;
    msg.className = 'bw-lr-message';
    msg.textContent = '';
  }

  _showThanks() {
    const wrap = this.querySelector('[data-form-wrap]');
    const thanks = this.querySelector('[data-thanks]');
    if (wrap) wrap.style.display = 'none';
    if (thanks) thanks.classList.add('show');
  }
}

if (!customElements.get('bw-leave-review')) {
  customElements.define('bw-leave-review', BWLeaveReviewElement);
}
