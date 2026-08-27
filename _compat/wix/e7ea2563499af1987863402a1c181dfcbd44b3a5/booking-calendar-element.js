const BW_BOOKING_CALENDAR_BOOKING_URL = 'https://www.berlinwalk.com/booking-form';
const BW_BOOKING_CALENDAR_AVAILABILITY_ENDPOINT = 'https://berlinwalk-content-app.vercel.app/api/booking-calendar-availability';

const BW_BOOKING_CALENDAR_STYLES = `
  bw-booking-calendar {
    display: block;
    max-width: 100%;
    min-width: 0;
    width: 100%;
  }

  .bw-booking-calendar {
    --green: #1B5E20;
    --yellow: #FFE600;
    --lime: #7CB342;
    --cream: #FAFAF5;
    --white: #FFFFFF;
    --ink: #212121;
    --muted: #4E5A4E;
    --line: #DCE3DD;
    --soft: #F6F8F4;
    color: var(--ink);
    font-family: Montserrat, Arial, sans-serif;
    max-width: 100%;
    min-width: 0;
    width: 100%;
  }

  .bw-booking-calendar *,
  .bw-booking-calendar *::before,
  .bw-booking-calendar *::after {
    box-sizing: border-box;
  }

  .bw-booking-calendar button,
  .bw-booking-calendar a {
    font: inherit;
  }

  .bw-cal-shell {
    background: rgba(255, 255, 255, 0.96);
    border: 1px solid var(--line);
    border-radius: 10px;
    box-shadow: 0 12px 32px rgba(27, 94, 32, 0.12);
    max-width: 100%;
    min-width: 0;
    overflow: hidden;
  }

  .bw-cal-standalone {
    box-sizing: border-box;
    margin: 0 auto;
    max-width: 1160px;
    padding: 32px 24px 44px;
  }

  .bw-cal-intro {
    display: grid;
    gap: 10px;
    margin: 0 0 14px;
    min-width: 0;
  }

  .bw-cal-intro-kicker {
    color: var(--green);
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0;
    line-height: 1;
    text-transform: uppercase;
  }

  .bw-cal-intro h2 {
    color: var(--green);
    font-size: 36px;
    font-weight: 900;
    letter-spacing: 0 !important;
    line-height: 1.02;
    margin: 0;
  }

  .bw-cal-intro p {
    color: var(--muted);
    font-size: 15px;
    font-weight: 700;
    line-height: 1.5;
    margin: 0;
    max-width: 640px;
  }

  .bw-cal-intro-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    min-width: 0;
  }

  .bw-cal-intro-chip {
    align-items: center;
    background: #F8FBF4;
    border: 1px solid #CFE4C8;
    border-radius: 999px;
    color: var(--green);
    display: inline-flex;
    font-size: 11px;
    font-weight: 850;
    line-height: 1.15;
    min-height: 30px;
    padding: 7px 10px;
    white-space: normal;
  }

  .bw-cal-head {
    align-items: start;
    border-bottom: 1px solid var(--line);
    display: grid;
    gap: 8px;
    min-width: 0;
    padding: 12px 12px 10px;
  }

  .bw-cal-title {
    color: var(--green);
    display: block;
    font-size: 18px !important;
    font-weight: 800 !important;
    letter-spacing: 0 !important;
    line-height: 1.12 !important;
    margin: 0 !important;
    text-transform: none !important;
  }

  .bw-cal-note {
    background: #F8FBF4;
    border-left: 3px solid var(--yellow);
    border-radius: 4px;
    color: var(--green);
    display: block;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0;
    line-height: 1.25;
    padding: 7px 9px;
    text-transform: uppercase;
  }

  .bw-cal-body {
    display: grid;
    gap: 10px;
    min-width: 0;
    padding: 10px 12px 12px;
  }

  .bw-cal-body > div {
    min-width: 0;
  }

  .bw-cal-label {
    color: var(--muted);
    display: block;
    font-size: 11px;
    font-weight: 800;
    line-height: 1;
    margin-bottom: 7px;
    text-transform: uppercase;
  }

  .bw-cal-date-tools {
    align-items: center;
    display: grid;
    gap: 8px;
    grid-template-columns: 1fr minmax(128px, auto);
    margin-bottom: 7px;
    min-width: 0;
  }

  .bw-cal-date-tools .bw-cal-label {
    margin-bottom: 0;
  }

  .bw-cal-month-select {
    appearance: none;
    background: #F8FBF4;
    border: 1px solid #CFE4C8;
    border-radius: 8px;
    color: var(--green);
    cursor: pointer;
    font-size: 12px;
    font-weight: 800;
    height: 32px;
    min-width: 0;
    padding: 0 28px 0 10px;
    width: 100%;
  }

  .bw-cal-month-select option:disabled {
    color: #6A765F;
    font-weight: 700;
  }

  .bw-cal-month-wrap {
    position: relative;
  }

  .bw-cal-month-wrap::after {
    color: var(--green);
    content: "⌄";
    font-size: 14px;
    font-weight: 800;
    pointer-events: none;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-54%);
  }

  .bw-cal-date-row {
    align-items: stretch;
    display: grid;
    gap: 6px;
    grid-template-columns: 30px minmax(0, 1fr) 30px;
    min-width: 0;
  }

  .bw-cal-date-viewport {
    min-width: 0;
    overflow: hidden;
    position: relative;
  }

  .bw-cal-date-viewport::after {
    background: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.96));
    bottom: 4px;
    content: "";
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 1px;
    width: 22px;
  }

  .bw-cal-date-nav {
    appearance: none;
    align-items: center;
    background: #F8FBF4;
    border: 1px solid #CFE4C8;
    border-radius: 8px;
    color: var(--green);
    cursor: pointer;
    display: inline-flex;
    font-size: 22px;
    font-weight: 800;
    justify-content: center;
    line-height: 1;
    min-width: 0;
  }

  .bw-cal-date-nav:hover,
  .bw-cal-date-nav:focus-visible {
    background: #EEF7EA;
    border-color: var(--green);
  }

  .bw-cal-date-nav:disabled {
    cursor: default;
    opacity: 0.34;
  }

  .bw-cal-days {
    display: flex;
    gap: 7px;
    max-width: 100%;
    min-width: 0;
    overflow-x: auto;
    padding: 1px 0 4px;
    scrollbar-width: thin;
    scrollbar-color: #BFD8B8 transparent;
    width: 100%;
  }

  .bw-cal-days::-webkit-scrollbar {
    height: 4px;
  }

  .bw-cal-days::-webkit-scrollbar-track {
    background: transparent;
  }

  .bw-cal-days::-webkit-scrollbar-thumb {
    background: #BFD8B8;
    border-radius: 999px;
  }

  .bw-cal-day,
  .bw-cal-slot,
  .bw-cal-step {
    appearance: none;
    background: #F8FBF4;
    border: 1px solid #CFE4C8;
    color: var(--green);
    cursor: pointer;
  }

  .bw-cal-day {
    border-radius: 8px;
    display: grid;
    flex: 0 0 62px;
    gap: 1px;
    min-height: 62px;
    padding: 7px 6px;
    place-items: center;
    text-align: center;
  }

  .bw-cal-day b {
    font-size: 20px;
    line-height: 1;
  }

  .bw-cal-day span {
    color: var(--muted);
    font-size: 10px;
    font-weight: 800;
    line-height: 1;
    text-transform: uppercase;
  }

  .bw-cal-day small {
    color: var(--muted);
    font-size: 10px;
    font-weight: 700;
    line-height: 1;
  }

  .bw-cal-tbd {
    align-content: center;
    background: #FFFDE7;
    border: 1px dashed #D7C900;
    border-radius: 8px;
    color: var(--green);
    display: grid;
    flex: 0 0 94px;
    gap: 2px;
    min-height: 62px;
    padding: 7px 8px;
    text-align: center;
  }

  .bw-cal-tbd span {
    color: var(--muted);
    font-size: 9px;
    font-weight: 800;
    line-height: 1.05;
    text-transform: uppercase;
  }

  .bw-cal-tbd b {
    color: var(--green);
    font-size: 17px;
    line-height: 1;
  }

  .bw-cal-tbd small {
    color: var(--muted);
    font-size: 9px;
    font-weight: 700;
    line-height: 1.05;
  }

  .bw-cal-day.is-active,
  .bw-cal-slot.is-active {
    background: var(--green);
    border-color: var(--green);
    color: var(--white);
  }

  .bw-cal-day.is-active span,
  .bw-cal-day.is-active small,
  .bw-cal-slot.is-active small {
    color: #E8F3E4;
  }

  .bw-cal-slots {
    display: grid;
    gap: 7px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    min-width: 0;
  }

  .bw-cal-slot {
    border-radius: 8px;
    display: inline-flex;
    min-height: 44px;
    padding: 7px;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .bw-cal-slot b {
    font-size: 17px;
    line-height: 1;
  }

  .bw-cal-slot small {
    color: var(--muted);
    font-size: 10px;
    font-weight: 700;
  }

  .bw-cal-summary {
    background: #F8FBF4;
    border-top: 1px solid var(--line);
    display: grid;
    gap: 8px;
    min-width: 0;
    padding: 10px 12px 12px;
  }

  .bw-cal-selected {
    color: var(--muted);
    display: block;
    font-size: 12px;
    font-weight: 700;
    line-height: 1.35;
  }

  .bw-cal-selected strong {
    color: var(--ink);
    font-weight: 800;
  }

  .bw-cal-next-note {
    color: var(--muted);
    display: block;
    font-size: 11px;
    font-weight: 600;
    line-height: 1.35;
    margin-top: -2px;
  }

  .bw-cal-cta {
    align-items: center;
    background: var(--green);
    border: 0;
    border-radius: 8px;
    color: var(--white);
    cursor: pointer;
    display: inline-flex;
    font-size: 14px;
    font-weight: 800;
    height: 42px;
    justify-content: center;
    padding: 0 14px;
    text-decoration: none;
    width: 100%;
  }

  .bw-cal-standalone .bw-cal-cta {
    font-size: 15px;
    height: 48px;
  }

  .bw-cal-cta:hover,
  .bw-cal-cta:focus-visible {
    background: #124516;
  }

  .bw-cal-cta.is-disabled {
    background: #9AA89A;
    cursor: default;
    opacity: 0.62;
    pointer-events: none;
  }

  .bw-cal-message {
    background: #FFFDE7;
    border: 1px solid #EFE6A3;
    border-radius: 8px;
    color: #5A5236;
    font-size: 12px;
    font-weight: 700;
    line-height: 1.35;
    padding: 9px;
  }

  .bw-cal-empty {
    color: var(--muted);
    font-size: 13px;
    font-weight: 700;
    line-height: 1.4;
    padding: 8px 0;
  }

  @media (max-width: 520px) {
    .bw-cal-standalone {
      padding: 18px 16px 26px;
    }

    .bw-cal-intro {
      margin-bottom: 12px;
    }

    .bw-cal-intro h2 {
      font-size: 30px;
      line-height: 1.05;
    }

    .bw-cal-intro p {
      font-size: 14px;
    }

    .bw-cal-intro-chip {
      font-size: 10.5px;
      min-height: 28px;
      padding: 6px 9px;
    }

    .bw-cal-head {
      align-items: start;
      display: grid;
    }

    .bw-cal-date-tools {
      grid-template-columns: 1fr;
    }

    .bw-cal-guest-row {
      grid-template-columns: 1fr;
    }

    .bw-cal-stepper {
      grid-template-columns: 44px 1fr 44px;
    }

    .bw-cal-step {
      height: 40px;
    }
  }
`;

class BWBookingCalendarElement extends HTMLElement {
  static get observedAttributes() {
    return [
      'availability-json',
      'booking-url',
      'service-title',
      'default-guests',
      'max-guests',
      'demo-days',
      'availability-days',
      'availability-endpoint',
      'service-id',
      'navigation-mode',
      'loading',
      'error-message',
      'cta-label',
      'hide-intro',
      'demo',
    ];
  }

  constructor() {
    super();
    this.state = {
      slots: [],
      selectedDate: '',
      selectedSlotId: '',
      guests: 2,
    };
    this._dateScrollMode = 'align';
    this._dateScrollLeft = 0;
    this._availabilityRequested = false;
    this._isFetchingAvailability = false;
  }

  connectedCallback() {
    this._hydrate();
    this._isFetchingAvailability = this._shouldLoadExternalAvailability();
    this._render();
    this._loadExternalAvailability();
  }

  attributeChangedCallback(name) {
    if (!this.isConnected) return;
    if (['availability-endpoint', 'service-id', 'availability-days'].includes(name)) {
      this._availabilityRequested = false;
    }
    this._hydrate();
    this._render();
    this._loadExternalAvailability();
  }

  _hydrate() {
    this.state.guests = this._boundedGuests(Number(this.getAttribute('default-guests') || this.state.guests || 2));
    this.state.slots = this._readSlots();
    const firstSlot = this.state.slots[0];
    const dates = this._availableDates();
    if (firstSlot && (!this.state.selectedDate || !dates.includes(this.state.selectedDate))) {
      this.state.selectedDate = this._dateKey(firstSlot.startDate);
      this.state.selectedSlotId = '';
    }
    if (!this.state.slots.some((slot) => slot.id === this.state.selectedSlotId)) {
      this.state.selectedSlotId = '';
    }
    if (!this.state.selectedSlotId || !this._slotsForSelectedDate().some((slot) => slot.id === this.state.selectedSlotId)) {
      const firstSelectedDateSlot = this._slotsForSelectedDate()[0] || firstSlot;
      if (firstSelectedDateSlot) this.state.selectedSlotId = firstSelectedDateSlot.id;
    }
  }

  _readSlots() {
    const raw = this.getAttribute('availability-json');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return this._normalizeSlots(parsed);
      } catch {
        return [];
      }
    }
    if (this.hasAttribute('demo')) return this._demoSlots();
    return [];
  }

  _shouldLoadExternalAvailability() {
    return !this.hasAttribute('availability-json') && !this.hasAttribute('demo') && Boolean(this._availabilityEndpoint());
  }

  _availabilityEndpoint() {
    const endpoint = this.getAttribute('availability-endpoint') || BW_BOOKING_CALENDAR_AVAILABILITY_ENDPOINT;
    if (!endpoint || endpoint === 'none') return '';

    const url = new URL(endpoint, window.location.href);
    if (!url.searchParams.has('days')) {
      url.searchParams.set('days', this.getAttribute('availability-days') || '365');
    }
    if (!url.searchParams.has('guests')) {
      url.searchParams.set('guests', '1');
    }
    const serviceId = this.getAttribute('service-id');
    if (serviceId && !url.searchParams.has('serviceId')) {
      url.searchParams.set('serviceId', serviceId);
    }
    return url.toString();
  }

  async _loadExternalAvailability() {
    if (!this._shouldLoadExternalAvailability() || this._availabilityRequested) return;

    this._availabilityRequested = true;
    this._isFetchingAvailability = true;
    this._render();

    try {
      const response = await fetch(this._availabilityEndpoint());
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Availability failed');

      const slots = Array.isArray(data.slots) ? data.slots : [];
      this._isFetchingAvailability = false;
      this.removeAttribute('error-message');
      this.setAttribute('availability-json', JSON.stringify(slots));
    } catch (error) {
      this._isFetchingAvailability = false;
      this.setAttribute('error-message', 'Could not load live availability. Please try again in a moment.');
      console.error('BerlinWalk booking calendar availability error:', error);
      this._hydrate();
      this._render();
    }
  }

  _normalizeSlots(slots) {
    return slots
      .map((slot, index) => {
        const startDate = slot.startDate || slot.start || slot.localStartDate;
        if (!startDate) return null;
        const id = String(slot.id || slot.eventId || `${startDate}-${index}`);
        return {
          ...slot,
          id,
          eventId: slot.eventId || '',
          sessionId: slot.sessionId || slot.eventId || '',
          startDate,
          endDate: slot.endDate || slot.end || slot.localEndDate || '',
          timezone: slot.timezone || 'Europe/Berlin',
          openSpots: Number.isFinite(Number(slot.openSpots)) ? Number(slot.openSpots) : null,
          bookingUrl: slot.bookingUrl || '',
        };
      })
      .filter(Boolean)
      .sort((a, b) => this._compareSlotDates(a.startDate, b.startDate));
  }

  _demoSlots() {
    const slots = [];
    const now = new Date();
    const demoDays = Math.max(14, Math.min(Number(this.getAttribute('demo-days') || 180), 365));
    for (let day = 1; day <= demoDays; day += 1) {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + day);
      [11.5, 14.5].forEach((hour, index) => {
        if (index === 1 && day % 3 !== 0) return;
        const start = new Date(date);
        const wholeHour = Math.floor(hour);
        start.setHours(wholeHour, hour % 1 ? 30 : 0, 0, 0);
        const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
        slots.push({
          id: `${this._dateKey(start)}-${wholeHour}-${index}`,
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          timezone: 'Europe/Berlin',
          openSpots: index === 0 ? 8 : 4,
        });
      });
    }
    return slots;
  }

  _render() {
    const loading = this.hasAttribute('loading') || this._isFetchingAvailability;
    const error = this.getAttribute('error-message') || '';
    const showIntro = this._shouldShowIntro();
    const serviceTitle = showIntro ? 'Choose your date and time' : this.getAttribute('service-title') || 'Pick your tour date';
    const ctaLabel = this._ctaLabel(showIntro);
    const selectedSlot = this._selectedSlot();
    const dates = this._availableDates();
    const months = this._availableMonths(dates);
    const slots = this._slotsForSelectedDate();
    const selectedText = selectedSlot
      ? `<strong>${this._formatDate(selectedSlot.startDate)} at ${this._formatTime(selectedSlot.startDate)}</strong>`
      : 'Choose a date and time.';

    this.innerHTML = `
      <style>${BW_BOOKING_CALENDAR_STYLES}</style>
      <section class="bw-booking-calendar${showIntro ? ' bw-cal-standalone' : ''}" aria-label="BerlinWalk booking calendar">
        ${showIntro ? this._introMarkup() : ''}
        <div class="bw-cal-shell">
          <header class="bw-cal-head">
            <div class="bw-cal-title" role="heading" aria-level="3">${this._escape(serviceTitle)}</div>
            <span class="bw-cal-note">Free reservation. Tip at the end. Phone is only for tour-day coordination.</span>
          </header>
          <div class="bw-cal-body">
            ${loading ? '<div class="bw-cal-message">Loading real tour availability...</div>' : ''}
            ${error ? `<div class="bw-cal-message">${this._escape(error)}</div>` : ''}
            <div>
              <div class="bw-cal-date-tools">
                <span class="bw-cal-label">Date</span>
                ${months.length > 1 ? this._monthSelect(months, dates) : ''}
              </div>
              ${dates.length ? `
                <div class="bw-cal-date-row">
                  <button class="bw-cal-date-nav" type="button" data-action="scroll-days" data-direction="-1" aria-label="Show earlier dates">&lsaquo;</button>
                  <div class="bw-cal-date-viewport">
                    <div class="bw-cal-days" data-days>
                      ${dates.map((date) => this._dayButton(date)).join('')}
                      ${this._futureTbdCard(dates)}
                    </div>
                  </div>
                  <button class="bw-cal-date-nav" type="button" data-action="scroll-days" data-direction="1" aria-label="Show later dates">&rsaquo;</button>
                </div>
              ` : loading ? '' : '<div class="bw-cal-empty">No available dates found.</div>'}
            </div>
            <div>
              <span class="bw-cal-label">Time</span>
              <div class="bw-cal-slots">
                ${slots.length ? slots.map((slot) => this._slotButton(slot)).join('') : loading ? '' : '<div class="bw-cal-empty">No open slots on this date.</div>'}
              </div>
            </div>
          </div>
          <footer class="bw-cal-summary">
            <span class="bw-cal-selected">${selectedText}</span>
            <span class="bw-cal-next-note">Attendees + phone on the next step. Phone is only for tour-day coordination.</span>
            ${selectedSlot
              ? `<a class="bw-cal-cta" href="${this._escape(this._bookingHref(selectedSlot))}" target="_top" data-action="continue">${this._escape(ctaLabel)}</a>`
              : `<span class="bw-cal-cta is-disabled" aria-disabled="true">${this._escape(ctaLabel)}</span>`}
          </footer>
        </div>
      </section>
    `;

    this._bind();
    this._applyDateScrollPosition();
    this._postResize();
  }

  _shouldShowIntro() {
    return this.getAttribute('navigation-mode') === 'event' && !this.hasAttribute('hide-intro');
  }

  _ctaLabel(showIntro = this._shouldShowIntro()) {
    const label = this.getAttribute('cta-label') || '';
    if (showIntro && (!label || label === 'Reserve your spot')) return 'Continue to free reservation';
    return label || 'Reserve your spot';
  }

  _introMarkup() {
    const chips = [
      'Free reservation',
      'No payment now',
      '~2h walk',
      'World Clock meeting point',
      'Guided by Yusuf',
    ];
    return `
      <div class="bw-cal-intro">
        <span class="bw-cal-intro-kicker">Book the tour</span>
        <h2>Reserve your free spot</h2>
        <p>No upfront payment. My walk is ~2h, tip-based at the end, and starts at the World Clock on Alexanderplatz.</p>
        <div class="bw-cal-intro-chips" aria-label="Tour booking details">
          ${chips.map((chip) => `<span class="bw-cal-intro-chip">${this._escape(chip)}</span>`).join('')}
        </div>
      </div>
    `;
  }

  _bind() {
    this.querySelectorAll('[data-date]').forEach((button) => {
      button.addEventListener('click', () => {
        this._preserveDateScroll();
        this.state.selectedDate = button.getAttribute('data-date') || '';
        const nextSlot = this._slotsForSelectedDate()[0];
        this.state.selectedSlotId = nextSlot ? nextSlot.id : '';
        this._emitChange('date');
        this._render();
      });
    });

    this.querySelectorAll('[data-slot]').forEach((button) => {
      button.addEventListener('click', () => {
        this._preserveDateScroll();
        this.state.selectedSlotId = button.getAttribute('data-slot') || '';
        this._emitChange('slot');
        this._render();
      });
    });

    this.querySelectorAll('[data-action="scroll-days"]').forEach((button) => {
      button.addEventListener('click', () => {
        const days = this.querySelector('[data-days]');
        if (!days) return;
        const direction = Number(button.getAttribute('data-direction') || 1);
        const firstDay = days.querySelector('.bw-cal-day');
        const step = ((firstDay?.offsetWidth || 62) + 7) * 2;
        days.scrollBy({ left: direction * step, behavior: 'smooth' });
      });
    });

    const monthSelect = this.querySelector('[data-month-select]');
    if (monthSelect) {
      monthSelect.addEventListener('change', () => {
        const month = monthSelect.value;
        const nextDate = this._availableDates().find((date) => this._monthKey(date) === month);
        if (!nextDate) return;
        this.state.selectedDate = nextDate;
        const nextSlot = this._slotsForSelectedDate()[0];
        this.state.selectedSlotId = nextSlot ? nextSlot.id : '';
        this._dateScrollMode = 'align';
        this._emitChange('month');
        this._render();
      });
    }

    const days = this.querySelector('[data-days]');
    if (days) days.addEventListener('scroll', () => this._syncDayNav(), { passive: true });
    this._syncDayNav();

    const continueLink = this.querySelector('[data-action="continue"]');
    if (continueLink) {
      continueLink.addEventListener('click', (event) => {
        event.preventDefault();
        const selectedSlot = this._selectedSlot();
        const detail = this._eventDetail(selectedSlot);
        const customEvent = new CustomEvent('bw-booking-calendar-continue', {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail,
        });
        const shouldContinue = this.dispatchEvent(customEvent);
        if (this.getAttribute('navigation-mode') === 'event') return;
        if (shouldContinue) this._navigateTo(detail.href);
      });
    }
  }

  _navigateTo(href) {
    if (!href) return;
    try {
      window.top.location.href = href;
      return;
    } catch {}
    try {
      window.parent.location.href = href;
      return;
    } catch {}
    window.location.href = href;
  }

  _preserveDateScroll() {
    const days = this.querySelector('[data-days]');
    this._dateScrollMode = 'preserve';
    this._dateScrollLeft = days ? days.scrollLeft : 0;
  }

  _applyDateScrollPosition() {
    const mode = this._dateScrollMode;
    const preservedLeft = this._dateScrollLeft;
    const align = () => {
      const days = this.querySelector('[data-days]');
      const selected = this.querySelector('.bw-cal-day.is-active');
      if (!days) {
        this._syncDayNav();
        return;
      }
      if (mode === 'preserve') {
        days.scrollLeft = preservedLeft;
      } else if (selected) {
        days.scrollLeft = Math.max(0, selected.offsetLeft - days.offsetLeft);
      }
      this._syncDayNav();
    };

    align();
    window.requestAnimationFrame(align);
    this._dateScrollMode = 'align';
  }

  _syncDayNav() {
    const days = this.querySelector('[data-days]');
    if (!days) return;
    const maxScroll = days.scrollWidth - days.clientWidth;
    this.querySelectorAll('[data-action="scroll-days"]').forEach((button) => {
      const direction = Number(button.getAttribute('data-direction') || 1);
      const disabled = maxScroll <= 1 || (direction < 0 ? days.scrollLeft <= 1 : days.scrollLeft >= maxScroll - 1);
      button.disabled = disabled;
    });
  }

  _availableDates() {
    const keys = [];
    this.state.slots.forEach((slot) => {
      const key = this._dateKey(slot.startDate);
      if (!keys.includes(key)) keys.push(key);
    });
    return keys;
  }

  _availableMonths(dates) {
    const months = [];
    dates.forEach((date) => {
      const key = this._monthKey(date);
      if (!months.some((month) => month.key === key)) {
        months.push({ key, label: this._monthLabel(key) });
      }
    });
    return months;
  }

  _slotsForSelectedDate() {
    return this.state.slots.filter((slot) => this._dateKey(slot.startDate) === this.state.selectedDate);
  }

  _selectedSlot() {
    return this.state.slots.find((slot) => slot.id === this.state.selectedSlotId) || this._slotsForSelectedDate()[0] || this.state.slots[0] || null;
  }

  _dayButton(dateKey) {
    const date = new Date(`${dateKey}T12:00:00`);
    const weekday = new Intl.DateTimeFormat('en-GB', { weekday: 'short' }).format(date);
    const day = new Intl.DateTimeFormat('en-GB', { day: 'numeric' }).format(date);
    const month = new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(date);
    const active = dateKey === this.state.selectedDate ? ' is-active' : '';
    return `
      <button class="bw-cal-day${active}" type="button" data-date="${this._escape(dateKey)}">
        <span>${this._escape(weekday)}</span>
        <b>${this._escape(day)}</b>
        <small>${this._escape(month)}</small>
      </button>
    `;
  }

  _futureTbdCard(dates) {
    const meta = this._futureTbdMeta(dates);
    if (!meta) return '';
    return `
      <div class="bw-cal-tbd" role="note" aria-label="Dates after ${this._escape(meta.lastLabel)} are coming soon">
        <span>${this._escape(meta.shortLabel)} onward</span>
        <b>TBD</b>
        <small>Dates soon</small>
      </div>
    `;
  }

  _futureTbdMeta(dates) {
    if (!dates.length || this.hasAttribute('demo') || this.hasAttribute('hide-future-tbd')) return null;
    const lastDateKey = dates[dates.length - 1];
    const lastDate = new Date(`${lastDateKey}T12:00:00`);
    if (Number.isNaN(lastDate.getTime())) return null;

    const nextMonth = new Date(lastDate);
    nextMonth.setDate(1);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    return {
      shortLabel: new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(nextMonth),
      longLabel: new Intl.DateTimeFormat('en-GB', { month: 'long' }).format(nextMonth),
      lastLabel: this._formatDate(lastDateKey),
    };
  }

  _monthSelect(months, dates) {
    const selectedMonth = this._monthKey(this.state.selectedDate || months[0]?.key || '');
    const tbd = this._futureTbdMeta(dates);
    return `
      <label class="bw-cal-month-wrap">
        <select class="bw-cal-month-select" data-month-select aria-label="Jump to month">
          ${months.map((month) => `
            <option value="${this._escape(month.key)}"${month.key === selectedMonth ? ' selected' : ''}>${this._escape(month.label)}</option>
          `).join('')}
          ${tbd ? `<option value="future-tbd" disabled>${this._escape(tbd.longLabel)} onward - TBD</option>` : ''}
        </select>
      </label>
    `;
  }

  _slotButton(slot) {
    const active = slot.id === this.state.selectedSlotId ? ' is-active' : '';
    return `
      <button class="bw-cal-slot${active}" type="button" data-slot="${this._escape(slot.id)}">
        <b>${this._escape(this._formatTime(slot.startDate))}</b>
      </button>
    `;
  }

  _bookingHref(slot) {
    const base = slot?.bookingUrl || this.getAttribute('booking-url') || BW_BOOKING_CALENDAR_BOOKING_URL;
    const url = new URL(base, window.location.href);
    if (slot) {
      url.searchParams.set('bookings_timezone', slot.timezone || 'Europe/Berlin');
      if (slot.serviceId || this.getAttribute('service-id')) url.searchParams.set('bookings_serviceId', slot.serviceId || this.getAttribute('service-id'));
      if (slot.locationId) url.searchParams.set('bookings_locationId', slot.locationId);
      if (slot.sessionId || slot.eventId) url.searchParams.set('bookings_sessionId', slot.sessionId || slot.eventId);
    }
    const incoming = new URL(window.location.href);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id', 'fbclid', 'fbc', 'fbp'].forEach((param) => {
      if (incoming.searchParams.has(param)) url.searchParams.set(param, incoming.searchParams.get(param));
    });
    if (!url.searchParams.has('utm_source')) url.searchParams.set('utm_source', 'berlinwalk');
    if (!url.searchParams.has('utm_medium')) url.searchParams.set('utm_medium', 'booking_calendar');
    if (!url.searchParams.has('utm_campaign')) url.searchParams.set('utm_campaign', 'direct_booking');
    if (!url.searchParams.has('utm_content')) url.searchParams.set('utm_content', 'booking_calendar');
    return url.toString();
  }

  _eventDetail(slot) {
    return {
      slot,
      guests: this.state.guests,
      href: this._bookingHref(slot),
      date: slot ? this._dateKey(slot.startDate) : '',
      time: slot ? this._formatTime(slot.startDate) : '',
    };
  }

  _emitChange(action) {
    this.dispatchEvent(new CustomEvent('bw-booking-calendar-change', {
      bubbles: true,
      composed: true,
      detail: {
        action,
        ...this._eventDetail(this._selectedSlot()),
      },
    }));
  }

  _boundedGuests(value) {
    const max = Number(this.getAttribute('max-guests') || 8);
    return Math.max(1, Math.min(max, Number.isFinite(value) ? value : 2));
  }

  _dateKey(value) {
    if (this._isLocalDateTime(value)) return String(value).slice(0, 10);
    return this._formatDateParts(value).dateKey;
  }

  _monthKey(dateKey) {
    return String(dateKey || '').slice(0, 7);
  }

  _monthLabel(monthKey) {
    const date = new Date(`${monthKey}-01T12:00:00`);
    if (Number.isNaN(date.getTime())) return monthKey;
    return new Intl.DateTimeFormat('en-GB', {
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  _formatDate(value) {
    const dateKey = this._dateKey(value);
    const displayDate = new Date(`${dateKey}T12:00:00`);
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(displayDate);
  }

  _formatTime(value) {
    if (this._isLocalDateTime(value)) return String(value).slice(11, 16);
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Europe/Berlin',
    }).format(new Date(value));
  }

  _compareSlotDates(left, right) {
    const leftKey = this._sortDateValue(left);
    const rightKey = this._sortDateValue(right);
    return leftKey.localeCompare(rightKey);
  }

  _sortDateValue(value) {
    if (this._isLocalDateTime(value)) return String(value);
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? String(value || '') : parsed.toISOString();
  }

  _isLocalDateTime(value) {
    const stringValue = String(value || '');
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(stringValue) && !/(Z|[+-]\d{2}:?\d{2})$/i.test(stringValue);
  }

  _formatDateParts(value) {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Berlin',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date(value));
    const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return {
      dateKey: `${map.year}-${map.month}-${map.day}`,
    };
  }

  _escape(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[char]));
  }

  _postResize() {
    window.requestAnimationFrame(() => {
      window.parent?.postMessage({
        type: 'bw-resize',
        height: document.documentElement.scrollHeight || document.body.scrollHeight,
      }, '*');
    });
  }
}

if (!customElements.get('bw-booking-calendar')) {
  customElements.define('bw-booking-calendar', BWBookingCalendarElement);
}
