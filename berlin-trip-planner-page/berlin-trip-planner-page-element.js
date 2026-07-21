(function () {
  const SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : '';
  const BASE_URL = SCRIPT_URL
    ? new URL('../', SCRIPT_URL).toString()
    : 'https://fenerszymanski.github.io/berlinwalk-widgets/';
  const WIDGET_PATH = 'ultimate-berlin-trip-planner/';
  const BOOKING_URL = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based';
  const OFFER_API_URL = 'https://berlinwalk-content-app.vercel.app/api/trip-planner-pro?action=offer';
  const OFFER_PRODUCT_KEY = 'trip_planner_detailed';
  const OFFER_STANDARD_ID = 'tp_standard_799';
  const OFFER_LAUNCH_ID = 'tp_v31_launch_50';
  const OFFER_STANDARD_CENTS = 799;
  const OFFER_LAUNCH_CENTS = 399;
  const OFFER_DISCOUNT_CENTS = 400;
  const OFFER_FETCH_TIMEOUT_MS = 6500;
  const PURCHASE_CONTENT_ID = 'trip_planner_detailed';
  const LANDING_EXPERIMENT_ID = 'tp_lp_value_path_v1';
  const LANDING_EXPERIMENT_VARIANTS = ['control', 'value_first'];
  const LANDING_EXPERIMENT_STATUS = 'closed_no_winner';
  const LANDING_EXPERIMENT_SESSION_KEY = 'bwTripPlannerLandingExperiment.session.v1';
  const LANDING_EXPERIMENT_LOCAL_KEY = 'bwTripPlannerLandingExperiment.local.v1';
  // Generated from PlanArtifactV2 golden scenario `ber-morning-tour`.
  // Keep parity with ultimate-berlin-trip-planner/engine/artifacts/ber-morning-tour.json.
  const ENGINE_SAMPLE_V2 = Object.freeze({
    id: 'ber-morning-tour',
    dateRange: 'Tue 15 Sep – Thu 17 Sep 2026',
    days: [
      {
        title: 'Day 1 · Alexanderplatz & Mitte',
        stops: [
          { time: '09:00', label: 'BER Airport → Mitte / Alexanderplatz', art: 'arrival' },
          { time: '11:30', label: 'World Clock', art: 'history' }
        ]
      },
      { title: 'Day 2 · Wall and East Berlin' },
      { title: 'Day 3 · Charlottenburg' }
    ]
  });

  const asset = (path) => new URL(path, BASE_URL).toString();

  function currentConsentPolicy() {
    try {
      const manager = window.consentPolicyManager;
      const current = manager && typeof manager.getCurrentConsentPolicy === 'function'
        ? manager.getCurrentConsentPolicy()
        : null;
      return current && (current.policy || current) || {};
    } catch (error) {
      return {};
    }
  }

  function analyticsConsent() {
    return currentConsentPolicy().analytics === true;
  }

  function advertisingConsent() {
    const policy = currentConsentPolicy();
    return policy.advertising === true || policy.marketing === true;
  }

  function functionalConsent() {
    return currentConsentPolicy().functional === true;
  }

  function cookieValue(name) {
    try {
      const prefix = `${String(name || '')}=`;
      const part = String(document.cookie || '').split(';').map((item) => item.trim()).find((item) => item.startsWith(prefix));
      return part ? decodeURIComponent(part.slice(prefix.length)) : '';
    } catch (error) {
      return '';
    }
  }

  function metaAttribution() {
    if (!advertisingConsent()) return { fbclid: '', fbc: '', fbp: '' };
    try {
      const params = new URLSearchParams(window.location.search || '');
      const fbclid = String(params.get('fbclid') || '').slice(0, 220);
      const fbc = String(params.get('fbc') || cookieValue('_fbc') || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : '')).slice(0, 260);
      const fbp = String(params.get('fbp') || cookieValue('_fbp') || '').slice(0, 260);
      return { fbclid, fbc, fbp };
    } catch (error) {
      return { fbclid: '', fbc: '', fbp: '' };
    }
  }

  function plannerParentUrl() {
    try {
      const url = new URL(window.location.href);
      // Owner-only landing review state must never enter the planner or any
      // checkout context. It changes this local shell's presentation only.
      url.searchParams.delete('tp_offer_review');
      if (!advertisingConsent()) ['fbclid', 'fbc', 'fbp'].forEach((key) => url.searchParams.delete(key));
      return url.toString();
    } catch (error) {
      return window.location.href;
    }
  }

  function ensureFont() {
    if (document.querySelector('link[data-bw-trip-page-font]')) return;
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://fonts.gstatic.com';
    preconnect.crossOrigin = 'anonymous';

    const font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Merriweather:wght@400;700&display=swap';
    font.dataset.bwTripPageFont = 'true';

    document.head.appendChild(preconnect);
    document.head.appendChild(font);
  }

  function validHeight(value) {
    return typeof value === 'number' && Number.isFinite(value) && value > 320 && value < 30000;
  }

  function validScrollTop(value) {
    return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value < 30000;
  }

  function randomExperimentId() {
    try {
      if (window.crypto && typeof window.crypto.randomUUID === 'function') {
        return `tpa_${window.crypto.randomUUID().replace(/-/g, '')}`;
      }
      if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
        const values = new Uint32Array(4);
        window.crypto.getRandomValues(values);
        return `tpa_${Array.from(values).map((value) => value.toString(36).padStart(7, '0')).join('')}`;
      }
    } catch (error) {}
    return `tpa_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
  }

  function validExperimentVariant(value) {
    const variant = String(value || '').toLowerCase();
    return LANDING_EXPERIMENT_VARIANTS.includes(variant) ? variant : '';
  }

  function validExperimentAssignmentId(value) {
    const assignmentId = String(value || '');
    return /^[A-Za-z0-9_-]{12,180}$/.test(assignmentId) ? assignmentId : '';
  }

  function validExperimentAssignedAt(value) {
    const assignedAt = String(value || '');
    return assignedAt && Number.isFinite(Date.parse(assignedAt)) ? assignedAt : '';
  }

  function readExperimentStorage(storage, key) {
    try {
      const raw = storage && storage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const variant = validExperimentVariant(parsed && parsed.variant);
      const assignmentId = validExperimentAssignmentId(parsed && parsed.assignmentId);
      if (!variant || !assignmentId || parsed.experimentId !== LANDING_EXPERIMENT_ID) return null;
      return {
        experimentId: LANDING_EXPERIMENT_ID,
        variant,
        assignmentId,
        assignmentSource: 'random_50_50',
        assignedAt: validExperimentAssignedAt(parsed.assignedAt) || new Date().toISOString(),
        isQa: false
      };
    } catch (error) {
      return null;
    }
  }

  function writeExperimentStorage(storage, key, assignment) {
    try {
      if (!storage || !assignment || assignment.isQa) return;
      storage.setItem(key, JSON.stringify({
        experimentId: assignment.experimentId,
        variant: assignment.variant,
        assignmentId: assignment.assignmentId,
        assignedAt: assignment.assignedAt
      }));
    } catch (error) {}
  }

  function browserStorage(name) {
    try {
      return window[name] || null;
    } catch (error) {
      return null;
    }
  }

  function carriedExperimentAssignment(params) {
    const variant = validExperimentVariant(params.get('tp_lp_variant'));
    const isForcedQa = /^(1|true)$/i.test(params.get('tp_lp_qa') || '');
    if (variant && isForcedQa) {
      return {
        experimentId: LANDING_EXPERIMENT_ID,
        variant,
        assignmentId: validExperimentAssignmentId(params.get('tp_lp_assignment_id')) || randomExperimentId(),
        assignmentSource: 'forced_qa',
        assignedAt: validExperimentAssignedAt(params.get('tp_lp_assigned_at')) || new Date().toISOString(),
        isQa: true
      };
    }

    const experimentId = String(params.get('tp_lp_experiment_id') || '');
    const assignmentId = validExperimentAssignmentId(params.get('tp_lp_assignment_id'));
    if (experimentId !== LANDING_EXPERIMENT_ID || !variant || !assignmentId) return null;
    const assignmentSource = params.get('tp_lp_assignment_source') === 'forced_qa'
      ? 'forced_qa'
      : 'random_50_50';
    return {
      experimentId: LANDING_EXPERIMENT_ID,
      variant,
      assignmentId,
      assignmentSource,
      assignedAt: validExperimentAssignedAt(params.get('tp_lp_assigned_at')) || new Date().toISOString(),
      isQa: params.get('tp_lp_is_qa') === '1' || assignmentSource === 'forced_qa'
    };
  }

  class BWBerlinTripPlannerPage extends HTMLElement {
    connectedCallback() {
      ensureFont();
      this._plannerFrameReady = false;
      this._queuedPlannerCommand = null;
      this._offerRequestId = (this._offerRequestId || 0) + 1;
      this._offerState = null;
      this._experimentAssignment = this._resolveExperimentAssignment();
      this.dataset.bwTpExperiment = this._experimentAssignment.experimentId;
      this.dataset.bwTpVariant = this._experimentAssignment.variant;
      this.dataset.bwTpQa = this._experimentAssignment.isQa ? 'true' : 'false';
      this._render();
      this._bind();
      this._setupPlannerResize();
      this._setupWixTopGapGuard();
      this._loadOffer(this._offerRequestId);
    }

    disconnectedCallback() {
      if (this._messageHandler) window.removeEventListener('message', this._messageHandler);
      if (this._consentHandler) {
        document.removeEventListener('consentPolicyChanged', this._consentHandler);
        document.removeEventListener('consentPolicyInitialized', this._consentHandler);
      }
      if (this._resizeObserver) this._resizeObserver.disconnect();
      if (this._plannerFrameLoadHandler && this._plannerFrame) this._plannerFrame.removeEventListener('load', this._plannerFrameLoadHandler);
      if (this._plannerFrameStyleObserver) this._plannerFrameStyleObserver.disconnect();
      if (this._plannerResizeHandler) {
        window.removeEventListener('resize', this._plannerResizeHandler);
        if (window.visualViewport) window.visualViewport.removeEventListener('resize', this._plannerResizeHandler);
      }
      if (this._plannerResizeTimers) this._plannerResizeTimers.forEach((timer) => window.clearTimeout(timer));
      if (this._plannerContentObserver) this._plannerContentObserver.disconnect();
      if (this._gapTimers) this._gapTimers.forEach((timer) => window.clearTimeout(timer));
      if (this._gapResizeHandler) {
        window.removeEventListener('resize', this._gapResizeHandler);
        if (window.visualViewport) window.visualViewport.removeEventListener('resize', this._gapResizeHandler);
      }
      if (this._gapResizeObserver) this._gapResizeObserver.disconnect();
      if (this._gapRaf) window.cancelAnimationFrame(this._gapRaf);
      if (this._offerAbortController) this._offerAbortController.abort();
      if (this._offerFetchTimer) window.clearTimeout(this._offerFetchTimer);
      if (this._offerCountdownTimer) window.clearTimeout(this._offerCountdownTimer);
      this._removeOfferSchema();
    }

    _resolveExperimentAssignment() {
      let params;
      try {
        params = new URLSearchParams(window.location.search || '');
      } catch (error) {
        params = new URLSearchParams();
      }

      const carried = carriedExperimentAssignment(params);
      if (carried && carried.isQa) {
        return carried;
      }

      // The test closed without a winner. Ignore stale carried/storage
      // assignments for normal traffic and keep the shorter control path.
      return {
        experimentId: LANDING_EXPERIMENT_ID,
        variant: 'control',
        assignmentId: 'tpa_closed_control_20260719',
        assignmentSource: LANDING_EXPERIMENT_STATUS,
        assignedAt: '2026-07-19T21:30:00+02:00',
        isQa: false
      };
    }

    _persistExperimentAssignment(assignment) {
      writeExperimentStorage(browserStorage('sessionStorage'), LANDING_EXPERIMENT_SESSION_KEY, assignment);
      if (functionalConsent() || analyticsConsent()) {
        writeExperimentStorage(browserStorage('localStorage'), LANDING_EXPERIMENT_LOCAL_KEY, assignment);
      }
    }

    _experimentQueryEntries() {
      const assignment = this._experimentAssignment || {};
      if (assignment.assignmentSource === LANDING_EXPERIMENT_STATUS && !assignment.isQa) return {};
      return {
        tp_lp_experiment_id: assignment.experimentId || LANDING_EXPERIMENT_ID,
        tp_lp_variant: assignment.variant || 'control',
        tp_lp_assignment_id: assignment.assignmentId || '',
        tp_lp_assignment_source: assignment.assignmentSource || 'random_50_50',
        tp_lp_assigned_at: assignment.assignedAt || '',
        tp_lp_is_qa: assignment.isQa ? '1' : '0'
      };
    }

    _plannerSrc() {
      const url = new URL(WIDGET_PATH, BASE_URL);
      const current = new URLSearchParams(window.location.search || '');
      const keys = [
        'context',
        'date',
        'tripLength',
        'arrivalTime',
        'arrivalPoint',
        'stayArea',
        'groupType',
        'firstTime',
        'interests',
        'budgetStyle',
        'mustHandle',
        'pace',
        'tourIntent',
        'weather',
        'planAccess',
        'resetUnlock',
        'forceLeadError',
        'forceAiError',
        'mockAi',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_content',
        'utm_term',
        'trip_planner_session_id',
        'trip_planner_order',
        'trip_planner_checkout'
      ];
      keys.forEach((key) => {
        if (current.has(key)) url.searchParams.set(key, current.get(key));
      });
      if (!url.searchParams.has('context')) url.searchParams.set('context', 'tool');
      url.searchParams.set('source', current.get('source') || 'berlin_trip_planner_page');
      url.searchParams.set('parent_path', window.location.pathname || '/berlin-trip-planner');
      url.searchParams.set('parent_url', plannerParentUrl());
      url.searchParams.set('attribution', 'none');
      url.searchParams.set('analytics_consent', analyticsConsent() ? '1' : '0');
      url.searchParams.set('advertising_consent', advertisingConsent() ? '1' : '0');
      url.searchParams.set('functional_consent', functionalConsent() ? '1' : '0');
      const meta = metaAttribution();
      if (meta.fbclid) url.searchParams.set('fbclid', meta.fbclid);
      if (meta.fbc) url.searchParams.set('fbc', meta.fbc);
      if (meta.fbp) url.searchParams.set('fbp', meta.fbp);
      Object.entries(this._experimentQueryEntries()).forEach(([key, value]) => {
        if (value) url.searchParams.set(key, value);
      });
      return url.toString();
    }

    _localOfferReviewMode() {
      let isLocal = false;
      try {
        const hostname = String(window.location.hostname || '').toLowerCase();
        isLocal = window.location.protocol === 'file:' || hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
      } catch (error) {}
      if (!isLocal) return '';
      try {
        const mode = String(new URLSearchParams(window.location.search || '').get('tp_offer_review') || '').toLowerCase();
        return ['launch', 'standard', 'expired', 'fail'].includes(mode) ? mode : '';
      } catch (error) {
        return '';
      }
    }

    _localOfferReviewPayload(mode) {
      const standard = {
        ok: true,
        productKey: OFFER_PRODUCT_KEY,
        currency: 'eur',
        serverNow: '2026-07-21T08:00:00.000Z',
        offer: {
          offerId: OFFER_STANDARD_ID,
          campaignId: '',
          status: mode === 'expired' ? 'expired' : 'inactive',
          active: false,
          listAmountEurCents: OFFER_STANDARD_CENTS,
          discountAmountEurCents: 0,
          netAmountEurCents: OFFER_STANDARD_CENTS,
          startsAt: '',
          endsAt: '',
          priceLockMinutes: 30
        }
      };
      if (mode !== 'launch') return standard;
      return {
        ok: true,
        productKey: OFFER_PRODUCT_KEY,
        currency: 'eur',
        serverNow: '2026-07-21T08:00:00.000Z',
        offer: {
          offerId: OFFER_LAUNCH_ID,
          campaignId: OFFER_LAUNCH_ID,
          status: 'active',
          active: true,
          listAmountEurCents: OFFER_STANDARD_CENTS,
          discountAmountEurCents: OFFER_DISCOUNT_CENTS,
          netAmountEurCents: OFFER_LAUNCH_CENTS,
          startsAt: '2026-07-21T08:00:00.000Z',
          endsAt: '2026-08-20T08:00:00.000Z',
          priceLockMinutes: 30
        }
      };
    }

    _loadOffer(requestId) {
      const reviewMode = this._localOfferReviewMode();
      if (reviewMode === 'fail') {
        this._applyOfferUnavailable();
        return;
      }
      if (reviewMode) {
        this._applyOfferPayload(this._localOfferReviewPayload(reviewMode), true);
        return;
      }
      if (typeof window.fetch !== 'function') {
        this._applyOfferUnavailable();
        return;
      }

      if (this._offerAbortController) this._offerAbortController.abort();
      this._offerAbortController = typeof AbortController === 'function' ? new AbortController() : null;
      const options = {
        method: 'GET',
        headers: { Accept: 'application/json' },
        cache: 'no-store',
        credentials: 'omit'
      };
      if (this._offerAbortController) options.signal = this._offerAbortController.signal;
      if (this._offerFetchTimer) window.clearTimeout(this._offerFetchTimer);
      this._offerFetchTimer = window.setTimeout(() => {
        if (this._offerAbortController) this._offerAbortController.abort();
      }, OFFER_FETCH_TIMEOUT_MS);

      window.fetch(OFFER_API_URL, options).then((response) => {
        return response.json().catch(() => ({})).then((body) => {
          if (!response.ok) throw new Error('offer_unavailable');
          return body;
        });
      }).then((body) => {
        if (!this.isConnected || requestId !== this._offerRequestId) return;
        this._applyOfferPayload(body, false);
      }).catch(() => {
        if (!this.isConnected || requestId !== this._offerRequestId) return;
        this._applyOfferUnavailable();
      }).finally(() => {
        if (this._offerFetchTimer) window.clearTimeout(this._offerFetchTimer);
        this._offerFetchTimer = null;
      });
    }

    _validatedOfferState(payload, isLocalReview) {
      if (!payload || payload.ok !== true || payload.productKey !== OFFER_PRODUCT_KEY || payload.currency !== 'eur') return null;
      const offer = payload.offer;
      const serverNowMs = Date.parse(String(payload.serverNow || ''));
      if (!offer || !Number.isFinite(serverNowMs) || Number(offer.priceLockMinutes) !== 30) return null;
      if (!/^[a-z0-9_-]{3,80}$/i.test(String(offer.offerId || ''))) return null;
      if (!['inactive', 'scheduled', 'active', 'expired'].includes(String(offer.status || ''))) return null;

      const base = {
        active: false,
        isLocalReview: Boolean(isLocalReview),
        offerId: String(offer.offerId || ''),
        campaignId: String(offer.campaignId || '').slice(0, 100),
        status: String(offer.status || ''),
        serverNow: String(payload.serverNow || ''),
        serverNowMs,
        serverSkewMs: serverNowMs - Date.now(),
        listCents: Number(offer.listAmountEurCents),
        discountCents: Number(offer.discountAmountEurCents),
        netCents: Number(offer.netAmountEurCents),
        startsAt: String(offer.startsAt || ''),
        endsAt: String(offer.endsAt || '')
      };

      if (offer.active === true) {
        const startsAtMs = Date.parse(base.startsAt);
        const endsAtMs = Date.parse(base.endsAt);
        if (
          base.offerId !== OFFER_LAUNCH_ID ||
          base.campaignId !== OFFER_LAUNCH_ID ||
          base.status !== 'active' ||
          base.listCents !== OFFER_STANDARD_CENTS ||
          base.discountCents !== OFFER_DISCOUNT_CENTS ||
          base.netCents !== OFFER_LAUNCH_CENTS ||
          !Number.isFinite(startsAtMs) ||
          !Number.isFinite(endsAtMs) ||
          startsAtMs >= endsAtMs ||
          serverNowMs < startsAtMs ||
          serverNowMs >= endsAtMs
        ) return null;
        base.active = true;
        base.startsAtMs = startsAtMs;
        base.endsAtMs = endsAtMs;
        return base;
      }

      if (
        offer.active !== false ||
        base.offerId !== OFFER_STANDARD_ID ||
        !['', OFFER_LAUNCH_ID].includes(base.campaignId) ||
        base.status === 'active' ||
        base.listCents !== OFFER_STANDARD_CENTS ||
        base.discountCents !== 0 ||
        base.netCents !== OFFER_STANDARD_CENTS
      ) return null;
      return base;
    }

    _applyOfferPayload(payload, isLocalReview) {
      const state = this._validatedOfferState(payload, isLocalReview);
      if (!state) {
        this._applyOfferUnavailable();
        return;
      }
      this._offerState = state;
      if (state.active) this._applyActiveOffer(state);
      else this._applyStandardOffer(state);
    }

    _money(cents) {
      return `€${(Number(cents) / 100).toFixed(2)}`;
    }

    _formatOfferEnd(iso) {
      const date = new Date(iso);
      if (!Number.isFinite(date.getTime())) return '';
      const day = new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        timeZone: 'Europe/Berlin',
        year: 'numeric'
      }).format(date);
      const time = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        hour12: false,
        minute: '2-digit',
        timeZone: 'Europe/Berlin',
        timeZoneName: 'short'
      }).format(date);
      return `${day} at ${time}`;
    }

    _setText(selector, value) {
      const node = this.querySelector(selector);
      if (node) node.textContent = value === null || value === undefined ? '' : String(value);
      return node;
    }

    _setPriceSurfaces(cents) {
      const price = this._money(cents);
      this.querySelectorAll('[data-bw-offer-result-price]').forEach((node) => {
        node.textContent = `Full Berlin plan ${price}`;
      });
      this.querySelectorAll('[data-bw-offer-inline-price]').forEach((node) => {
        node.textContent = price;
        node.hidden = false;
      });
    }

    _clearPriceSurfaces() {
      this.querySelectorAll('[data-bw-offer-result-price]').forEach((node) => {
        node.textContent = 'Full Berlin plan';
      });
      this.querySelectorAll('[data-bw-offer-inline-price]').forEach((node) => {
        node.textContent = '';
        node.hidden = true;
      });
    }

    _setPromoVisible(visible) {
      const promo = this.querySelector('[data-bw-launch-offer]');
      if (!promo) return;
      promo.hidden = !visible;
      promo.setAttribute('aria-hidden', visible ? 'false' : 'true');
    }

    _applyOfferUnavailable() {
      this._offerState = null;
      this.dataset.bwOfferState = 'unavailable';
      this.dataset.bwOfferSource = 'server';
      if (this._offerCountdownTimer) window.clearTimeout(this._offerCountdownTimer);
      this._offerCountdownTimer = null;
      this._setPromoVisible(false);
      this._clearPriceSurfaces();
      this._removeOfferSchema();
    }

    _applyStandardOffer(state) {
      if (this._offerCountdownTimer) window.clearTimeout(this._offerCountdownTimer);
      this._offerCountdownTimer = null;
      this._offerState = Object.assign({}, state, {
        active: false,
        offerId: OFFER_STANDARD_ID,
        status: state && state.status === 'active' ? 'expired' : state.status,
        discountCents: 0,
        netCents: OFFER_STANDARD_CENTS
      });
      this.dataset.bwOfferState = 'standard';
      this.dataset.bwOfferSource = state.isLocalReview ? 'local_review' : 'server';
      this._setPromoVisible(false);
      this._setPriceSurfaces(OFFER_STANDARD_CENTS);
      this._updateOfferSchema(this._offerState);
    }

    _applyActiveOffer(state) {
      const endLabel = this._formatOfferEnd(state.endsAt);
      if (!endLabel) {
        this._applyOfferUnavailable();
        return;
      }
      this.dataset.bwOfferState = 'active';
      this.dataset.bwOfferSource = state.isLocalReview ? 'local_review' : 'server';
      this._setText('[data-bw-offer-kicker]', '30-DAY LAUNCH OFFER · 50% OFF');
      this._setText('[data-bw-offer-price]', `Launch price ${this._money(state.netCents)}`);
      this._setText('[data-bw-offer-regular]', `Normally ${this._money(state.listCents)} · offer ends ${endLabel}`);
      this._setText('[data-bw-offer-saving]', `Save ${this._money(state.discountCents)}`);
      this._setText('[data-bw-offer-static-date]', `The launch offer ends ${endLabel}. The regular price is ${this._money(state.listCents)} after that time.`);
      const reviewNote = this.querySelector('[data-bw-offer-review-note]');
      if (reviewNote) reviewNote.hidden = !state.isLocalReview;
      this._setPromoVisible(true);
      this._setPriceSurfaces(state.netCents);
      this._updateOfferSchema(state);
      this._updateOfferCountdown();
    }

    _updateOfferCountdown() {
      if (this._offerCountdownTimer) window.clearTimeout(this._offerCountdownTimer);
      const state = this._offerState;
      if (!state || !state.active) return;
      const remainingMs = state.endsAtMs - (Date.now() + state.serverSkewMs);
      if (remainingMs <= 0) {
        this._applyStandardOffer(state);
        return;
      }
      const totalMinutes = Math.max(0, Math.ceil(remainingMs / 60000));
      const days = Math.floor(totalMinutes / 1440);
      const hours = Math.floor((totalMinutes % 1440) / 60);
      const minutes = totalMinutes % 60;
      this._setText('[data-bw-countdown-days]', days);
      this._setText('[data-bw-countdown-hours]', hours);
      this._setText('[data-bw-countdown-minutes]', minutes);
      const nextMinuteBoundary = remainingMs % 60000;
      const delay = Math.min(60000, Math.max(1000, nextMinuteBoundary + 80));
      this._offerCountdownTimer = window.setTimeout(() => this._updateOfferCountdown(), delay);
    }

    _updateOfferSchema(state) {
      this._removeOfferSchema();
      if (!state || ![OFFER_STANDARD_CENTS, OFFER_LAUNCH_CENTS].includes(Number(state.netCents))) return;
      const offer = {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        price: (Number(state.netCents) / 100).toFixed(2),
        priceCurrency: 'EUR',
        url: 'https://www.berlinwalk.com/berlin-trip-planner'
      };
      if (state.active && state.endsAt) offer.priceValidUntil = state.endsAt.slice(0, 10);
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        '@id': 'https://www.berlinwalk.com/berlin-trip-planner#full-plan',
        name: 'Berlin Trip Planner Full Plan',
        brand: { '@type': 'Brand', name: 'BerlinWalk' },
        description: 'A date-based Berlin itinerary for phone use and PDF backup.',
        offers: offer
      };
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.bwTripOfferSchema = 'true';
      script.textContent = JSON.stringify(schema);
      this.appendChild(script);
    }

    _removeOfferSchema() {
      const script = this.querySelector('script[data-bw-trip-offer-schema]');
      if (script) script.remove();
    }

    _valueFirstCard() {
      if (!this._experimentAssignment || this._experimentAssignment.variant !== 'value_first') return '';
      return `
        <section class="bw-trip-value-first" aria-labelledby="bw-trip-value-first-title">
          <div class="bw-trip-value-route" aria-label="Example Day 1 route in Mitte">
            <span class="bw-trip-value-day">Example Day 1 · Mitte</span>
            <strong>Alexanderplatz <i aria-hidden="true">→</i> Museum Island <i aria-hidden="true">→</i> Hackescher Markt</strong>
            <small>Stops stay in route order, with one practical backup for the day.</small>
          </div>
          <div class="bw-trip-value-offer">
            <p class="bw-trip-value-kicker">Detailed 1–7 day Berlin plan</p>
            <h2 id="bw-trip-value-first-title">See what the detailed plan adds before you build your free preview.</h2>
            <p>I keep each day in one useful part of Berlin, then add Google Maps links and the weather and opening checks that matter on your dates.</p>
            <ul aria-label="Detailed plan includes">
              <li>Daily stops</li>
              <li>Google Maps links</li>
              <li>PDF for phone &amp; print</li>
              <li>Weather &amp; opening checks</li>
            </ul>
            <div class="bw-trip-value-action">
              <span><strong data-bw-offer-inline-price hidden></strong><small>The free preview still comes first.</small></span>
              <a class="bw-trip-value-cta" href="#planner" data-bw-trip-landing-cta="value_first_card">Build my free preview</a>
            </div>
          </div>
        </section>
      `;
    }

    _render() {
      const heroImage = asset('ultimate-berlin-trip-planner/assets/berlin-trip-planner-hero.jpg');
      const yusufImage = 'https://static.wixstatic.com/media/5a08a3_ac78d5df37b2486ab6662cf3872ea9a6~mv2.jpg/v1/fill/w_900,h_1125,al_c,q_85/file.jpg';
      const proofPlanIcon = asset('berlin-trip-planner-page/assets/proof-plan.webp');
      const proofMapIcon = asset('berlin-trip-planner-page/assets/proof-map.webp');
      const proofGuideIcon = asset('berlin-trip-planner-page/assets/proof-guide.webp');
      const mapArt = asset('route/assets/berlin-mitte-illustration.png');
      const arrivalArt = asset('ultimate-berlin-trip-planner/assets/day-art/day-oil-arrival.webp');
      const historyArt = asset('ultimate-berlin-trip-planner/assets/day-art/day-oil-history.webp');
      const museumArt = asset('ultimate-berlin-trip-planner/assets/day-art/day-oil-museums.webp');
      const foodArt = asset('ultimate-berlin-trip-planner/assets/day-art/day-oil-food.webp');
      const sampleArt = { arrival: arrivalArt, history: historyArt, museums: museumArt, food: foodArt };
      const sampleDay = ENGINE_SAMPLE_V2.days[0];
      const sampleStops = sampleDay.stops.map((stop) => `
        <figure>
          <img src="${sampleArt[stop.art] || arrivalArt}" alt="${stop.label} plan illustration">
          <figcaption><b>${stop.time}</b>${stop.label}</figcaption>
        </figure>
      `).join('');

      this.innerHTML = `
        <style>${this._styles()}</style>
        <main class="bw-trip-page" data-bw-tp-experiment="${LANDING_EXPERIMENT_ID}" data-bw-tp-variant="${this._experimentAssignment.variant}">
          <section class="bw-trip-launch" aria-labelledby="bw-trip-page-title">
            <div class="bw-trip-inner bw-trip-launch-inner">
              <header class="bw-trip-intro">
                <div class="bw-trip-intro-message">
                  <p class="bw-trip-kicker">My trip. My Berlin.</p>
                  <h1 id="bw-trip-page-title">A Berlin plan built around the days you actually have.</h1>
                  <p class="bw-trip-intro-copy">I check the route, weather, and opening hours so you don&rsquo;t have to.</p>
                </div>
                <aside class="bw-trip-launch-offer" data-bw-launch-offer aria-hidden="true" aria-labelledby="bw-trip-launch-offer-title" hidden>
                  <p class="bw-trip-launch-offer-kicker" data-bw-offer-kicker></p>
                  <p class="bw-trip-launch-offer-price" id="bw-trip-launch-offer-title" data-bw-offer-price></p>
                  <p class="bw-trip-launch-offer-regular" data-bw-offer-regular></p>
                  <p class="bw-trip-launch-offer-saving" data-bw-offer-saving></p>
                  <div class="bw-trip-offer-countdown" aria-hidden="true">
                    <span><b data-bw-countdown-days>0</b><small>days</small></span>
                    <span><b data-bw-countdown-hours>0</b><small>hours</small></span>
                    <span><b data-bw-countdown-minutes>0</b><small>minutes</small></span>
                  </div>
                  <p class="bw-trip-sr-only" data-bw-offer-static-date></p>
                  <a class="bw-trip-offer-cta" href="#planner" data-bw-trip-landing-cta="launch_offer">Build my free preview</a>
                  <span class="bw-trip-offer-proof-line">See Day 1 before you pay</span>
                  <small class="bw-trip-offer-review-note" data-bw-offer-review-note hidden>Local offer review only. Checkout pricing remains server-controlled.</small>
                </aside>
              </header>

              ${this._valueFirstCard()}

              <section class="bw-trip-planner-band" id="planner" aria-label="Berlin trip planner widget">
                <div class="bw-trip-widget-shell">
                  <iframe data-bw-trip-planner-frame src="${this._plannerSrc()}" title="Berlin Trip Planner" loading="eager" scrolling="no"></iframe>
                </div>
              </section>
            </div>
          </section>

          <section class="bw-trip-proof-band" aria-label="Planner benefits">
            <div class="bw-trip-inner bw-trip-proof">
              <div class="bw-trip-proof-item"><img src="${proofPlanIcon}" alt="" aria-hidden="true"><span><b>Free preview</b><small>1–7 days · No account needed</small></span></div>
              <div class="bw-trip-proof-item"><img src="${proofGuideIcon}" alt="" aria-hidden="true"><span><b>Built by a local guide</b><small>Real Berlin · Local tips</small></span></div>
              <div class="bw-trip-proof-item"><img src="${proofMapIcon}" alt="" aria-hidden="true"><span><b>No generic lists</b><small>Opening hours · Route sense · Weather-aware</small></span></div>
            </div>
          </section>

          <section class="bw-trip-section bw-trip-delivery-proof" aria-labelledby="bw-trip-delivery-title">
            <div class="bw-trip-inner bw-trip-delivery-inner">
              <div class="bw-trip-delivery-heading">
                <p class="bw-trip-section-kicker">One itinerary, two useful formats</p>
                <h2 id="bw-trip-delivery-title">Same plan on your phone and in your PDF.</h2>
              </div>
              <div class="bw-trip-delivery-grid">
                <article>
                  <img src="${proofPlanIcon}" alt="" aria-hidden="true">
                  <span><strong>Mobile itinerary</strong><small>Your schedule, map links, opening checks, and Plan B together.</small></span>
                </article>
                <div class="bw-trip-same-plan" aria-label="The mobile and PDF itineraries use the same plan">SAME PLAN</div>
                <article>
                  <img src="${proofGuideIcon}" alt="" aria-hidden="true">
                  <span><strong>PDF itinerary</strong><small>The same route arranged for print and offline backup.</small></span>
                </article>
              </div>
            </div>
          </section>

          <section class="bw-trip-section bw-trip-sample" aria-labelledby="bw-trip-sample-title">
            <div class="bw-trip-inner bw-trip-sample-grid">
              <div class="bw-trip-sample-copy">
                <p class="bw-trip-section-kicker">Your free result proof</p>
                <h2 id="bw-trip-sample-title">See Day 1 before you pay</h2>
                <p>I group each day by area, then check the route against arrival time, weather, and opening days. Your free preview shows the shape of the trip and a real Day 1 before you decide.</p>
                <figure class="bw-trip-sample-art">
                  <img src="${heroImage}" alt="Illustrated summer view of Museum Island and the Berlin TV Tower">
                </figure>
              </div>

              <aside class="bw-trip-preview" aria-label="Engine-derived example three-day Berlin plan" data-bw-engine-sample-id="${ENGINE_SAMPLE_V2.id}" data-bw-result-proof>
                <div class="bw-trip-preview-top">
                  <strong>${ENGINE_SAMPLE_V2.dateRange}</strong>
                  <span>3 days</span>
                </div>
                <figure class="bw-trip-preview-map">
                  <img src="${mapArt}" alt="Illustrated map of central Berlin">
                  <figcaption>BER Airport → Alexanderplatz</figcaption>
                </figure>
                <article class="bw-trip-preview-day bw-trip-preview-day-open">
                  <div class="bw-trip-preview-day-head">
                    <strong>${sampleDay.title}</strong>
                    <span>Open map</span>
                  </div>
                  <div class="bw-trip-preview-stops" style="--preview-stop-count:${sampleDay.stops.length}">
                    ${sampleStops}
                  </div>
                </article>
                <div class="bw-trip-preview-day"><strong>${ENGINE_SAMPLE_V2.days[1].title}</strong><span>View</span></div>
                <div class="bw-trip-preview-day"><strong>${ENGINE_SAMPLE_V2.days[2].title}</strong><span>View</span></div>
                <div class="bw-trip-preview-paid">
                  <div><strong data-bw-offer-result-price>Full Berlin plan</strong><span>Daily stops · Maps · PDF · Opening checks</span></div>
                  <a href="#planner" data-bw-trip-landing-cta="sample_plan">Build my free preview</a>
                </div>
              </aside>
            </div>
          </section>

          <section class="bw-trip-section bw-trip-guide">
            <div class="bw-trip-inner bw-trip-guide-grid">
              <figure class="bw-trip-guide-photo">
                <img src="${yusufImage}" alt="Yusuf from BerlinWalk">
              </figure>
              <div class="bw-trip-guide-copy">
                <p class="bw-trip-section-kicker">Your guide in Berlin</p>
                <h2>I check the route before it becomes your plan.</h2>
                <p>I use the same opening-day, arrival-time, and area checks I give guests before the tour. If you start at BER, Hauptbahnhof, Alexanderplatz, or your hotel, the first stop should make sense from there.</p>
                <a class="bw-trip-text-link" href="${BOOKING_URL}">Book the BerlinWalk tour</a>
              </div>
            </div>
          </section>

          <section class="bw-trip-section bw-trip-final">
            <div class="bw-trip-inner bw-trip-final-box">
              <div>
                <p class="bw-trip-section-kicker">Start with the dates you know</p>
                <h2>Your Berlin days can begin here.</h2>
                <p>Choose your arrival date and trip length. The first preview is free.</p>
              </div>
              <div class="bw-trip-actions">
                <a class="bw-trip-btn bw-trip-btn-primary" href="#planner" data-bw-trip-landing-cta="final_cta">Build my free preview</a>
              </div>
            </div>
          </section>
        </main>
      `;
    }

    _bind() {
      this.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (event) => {
          const target = this.querySelector(link.getAttribute('href'));
          if (!target) return;
          event.preventDefault();
          const scrollTarget = target.id === 'planner'
            ? target.querySelector('.bw-trip-widget-shell') || target
            : target;
          const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          scrollTarget.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
          const landingSurface = link.getAttribute('data-bw-trip-landing-cta');
          if (landingSurface) this._sendPlannerLandingCta(landingSurface);
        });
      });
    }

    _sendPlannerLandingCta(surface) {
      const frame = this._plannerFrame || this.querySelector('[data-bw-trip-planner-frame]');
      if (!frame) return;
      const command = {
        type: 'bw-trip-planner-command',
        command: 'landing-cta',
        surface: String(surface || 'landing').slice(0, 80)
      };
      if (!this._plannerFrameReady) this._queuedPlannerCommand = command;
      try {
        const origin = new URL(frame.src, window.location.href).origin;
        if (frame.contentWindow) frame.contentWindow.postMessage(command, origin);
      } catch (error) {}
    }

    _setupPlannerResize() {
      const frame = this.querySelector('[data-bw-trip-planner-frame]');
      if (!frame) return;
      this._plannerFrame = frame;
      this._plannerShell = frame.closest('.bw-trip-widget-shell');
      this._plannerBand = this.querySelector('#planner');
      this._plannerResizeTimers = [];
      if (this._plannerFrameStyleObserver) this._plannerFrameStyleObserver.disconnect();

      let lastHeight = 0;
      let requestedFrameHeight = 0;
      const heightBuffer = 12;
      const initialHeight = () => window.matchMedia('(max-width: 760px)').matches ? 680 : 580;
      const resetPlannerBand = () => {
        const band = this._plannerBand;
        if (!band) return;
        band.style.setProperty('height', 'auto', 'important');
        band.style.setProperty('min-height', '0', 'important');
        band.style.setProperty('max-height', 'none', 'important');
      };
      const enforceFrameHeight = () => {
        if (!requestedFrameHeight) return;
        const height = `${requestedFrameHeight}px`;
        if (
          frame.style.getPropertyValue('height') !== height ||
          frame.style.getPropertyPriority('height') !== 'important'
        ) frame.style.setProperty('height', height, 'important');
        if (
          frame.style.getPropertyValue('min-height') !== height ||
          frame.style.getPropertyPriority('min-height') !== 'important'
        ) frame.style.setProperty('min-height', height, 'important');
      };
      const setHeight = (height, phase) => {
        const natural = Math.ceil(height) + heightBuffer;
        const next = Math.max(360, natural);
        resetPlannerBand();
        const shell = this._plannerShell;
        if (shell) {
          // Keep the card in border-box sizing so its padding never widens the
          // iframe beyond a narrow phone viewport. The iframe owns the height;
          // the shell then wraps it naturally without an artificial blank floor.
          shell.style.setProperty('box-sizing', 'border-box', 'important');
          shell.style.setProperty('height', 'auto', 'important');
          shell.style.setProperty('min-height', '0', 'important');
          shell.style.setProperty('max-height', 'none', 'important');
          shell.style.setProperty('max-width', '100%', 'important');
          shell.style.setProperty('width', '100%', 'important');
        }
        requestedFrameHeight = next;
        enforceFrameHeight();
        if (Math.abs(next - lastHeight) < 2) return;
        lastHeight = next;
      };

      const plannerOrigin = () => {
        try {
          return new URL(frame.src, window.location.href).origin;
        } catch (error) {
          return '';
        }
      };

      const isPlannerMessage = (event) => {
        const origin = plannerOrigin();
        return Boolean(event.source === frame.contentWindow && event.origin && origin && event.origin === origin);
      };

      const readFrameHeight = () => {
        // The child emits its own measured height. Reading a same-origin iframe
        // here creates a resize feedback loop because its viewport follows this
        // frame's height, so leave same-origin sizing to that message channel.
        if (plannerOrigin() === window.location.origin) return 0;
        try {
          const doc = frame.contentDocument;
          if (!doc) return 0;
          const root = doc.documentElement;
          const body = doc.body;
          const planner = doc.querySelector('#bw-trip-planner');
          const plannerBottom = planner ? Math.ceil(planner.getBoundingClientRect().bottom + (frame.contentWindow ? frame.contentWindow.scrollY : 0)) : 0;
          return Math.max(
            root ? root.scrollHeight : 0,
            body ? body.scrollHeight : 0,
            plannerBottom
          );
        } catch (error) {
          return 0;
        }
      };

      const readFramePhase = () => {
        try {
          const form = frame.contentDocument && frame.contentDocument.querySelector('.bw-form');
          return form && form.classList.contains('is-quiz-flow') && !form.classList.contains('is-plan-generated')
            ? 'quiz'
            : 'plan';
        } catch (error) {
          return '';
        }
      };

      const phaseFromMessage = (phase) => phase === 'plan' ? 'plan' : 'quiz';

      const requestFrameMeasure = () => {
        try {
          if (!frame.contentWindow) return;
          frame.contentWindow.postMessage({ type: 'bw-measure-request' }, plannerOrigin() || '*');
        } catch (error) {}
      };

      const syncFromReadableFrame = () => {
        const height = readFrameHeight();
        if (validHeight(height)) setHeight(height, readFramePhase());
      };

      const scheduleHeightChecks = () => {
        if (this._plannerResizeTimers) this._plannerResizeTimers.forEach((timer) => window.clearTimeout(timer));
        this._plannerResizeTimers = [];
        [0, 120, 360, 700, 1200, 2200].forEach((delay) => {
          const timer = window.setTimeout(syncFromReadableFrame, delay);
          this._plannerResizeTimers.push(timer);
        });
      };

      const watchReadableFrame = () => {
        syncFromReadableFrame();
        if (!window.ResizeObserver || this._plannerContentObserver) return;
        try {
          const doc = frame.contentDocument;
          if (!doc || !doc.body) return;
          this._plannerContentObserver = new ResizeObserver(syncFromReadableFrame);
          this._plannerContentObserver.observe(doc.body);
          const planner = doc.querySelector('#bw-trip-planner');
          if (planner) this._plannerContentObserver.observe(planner);
        } catch (error) {}
      };

      const scrollToPlannerOffset = (top) => {
        const frameBox = frame.getBoundingClientRect();
        const absoluteTop = window.scrollY + frameBox.top + top - 10;
        const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({
          top: Math.max(0, Math.round(absoluteTop)),
          behavior: reduceMotion ? 'auto' : 'smooth'
        });
      };

      const validTripPlannerEvent = (name) => /^bw_trip_planner_[a-z0-9_]{1,90}$/.test(String(name || ''));

      const sendConsentToPlanner = () => {
        try {
          if (!frame.contentWindow) return;
          this._persistExperimentAssignment(this._experimentAssignment);
          const meta = metaAttribution();
          frame.contentWindow.postMessage({
            type: 'bw-consent-update',
            analytics: analyticsConsent(),
            advertising: advertisingConsent(),
            functional: functionalConsent(),
            fbclid: meta.fbclid,
            fbc: meta.fbc,
            fbp: meta.fbp
          }, plannerOrigin() || '*');
        } catch (error) {}
      };

      const pushPlannerAnalyticsEvent = (eventName, payload) => {
        const allowAnalytics = analyticsConsent();
        const allowAdvertising = advertisingConsent();
        if (!allowAnalytics && !allowAdvertising) return;
        const detail = payload && typeof payload === 'object' ? payload : {};
        const analyticsPayload = Object.assign({}, detail, {
          parent_path: window.location.pathname || '/berlin-trip-planner',
          parent_location: window.location.href,
          event_source: 'ultimate_berlin_trip_planner_iframe'
        });
        try {
          if (allowAnalytics) {
            window.dataLayer = window.dataLayer || [];
            if (Array.isArray(window.dataLayer)) {
              window.dataLayer.push(Object.assign({}, analyticsPayload, { event: eventName }));
            }
            if (typeof window.gtag === 'function') window.gtag('event', eventName, analyticsPayload);
          }
          if (allowAdvertising && typeof window.fbq === 'function') window.fbq('trackCustom', eventName, analyticsPayload);
        } catch (error) {}
      };

      const pushPlannerMetaPurchase = (purchase) => {
        if (!advertisingConsent() || !purchase || typeof window.fbq !== 'function') return;
        const orderId = String(purchase.eventId || '');
        const amountEurCents = Number(purchase.amountEurCents);
        const actualValue = amountEurCents / 100;
        if (!/^tppo_[A-Za-z0-9_-]{12,}$/.test(orderId)) return;
        if (
          purchase.serverVerified !== true ||
          purchase.eventName !== 'Purchase' ||
          ![OFFER_LAUNCH_CENTS, OFFER_STANDARD_CENTS].includes(amountEurCents) ||
          Number(purchase.value) !== actualValue ||
          String(purchase.currency || '').toUpperCase() !== 'EUR' ||
          purchase.contentType !== 'product' ||
          !Array.isArray(purchase.contentIds) ||
          purchase.contentIds.length !== 1 ||
          purchase.contentIds[0] !== PURCHASE_CONTENT_ID
        ) return;
        const storageKey = `bwTripPlannerMetaPurchase.v1:${orderId}`;
        this._metaPurchaseOrderIds = this._metaPurchaseOrderIds || new Set();
        try {
          if (
            this._metaPurchaseOrderIds.has(orderId) ||
            (window.sessionStorage && window.sessionStorage.getItem(storageKey)) ||
            (window.localStorage && window.localStorage.getItem(storageKey))
          ) return;
        } catch (error) {
          if (this._metaPurchaseOrderIds.has(orderId)) return;
        }
        window.fbq('track', 'Purchase', {
          value: actualValue,
          currency: 'EUR',
          content_ids: [PURCHASE_CONTENT_ID],
          content_type: 'product'
        }, { eventID: orderId });
        this._metaPurchaseOrderIds.add(orderId);
        try { if (window.sessionStorage) window.sessionStorage.setItem(storageKey, '1'); } catch (error) {}
        try { if (window.localStorage) window.localStorage.setItem(storageKey, '1'); } catch (error) {}
      };

      const cleanParentCheckoutParams = () => {
        try {
          const url = new URL(window.location.href);
          ['trip_planner_session_id', 'trip_planner_order', 'trip_planner_checkout'].forEach((key) => url.searchParams.delete(key));
          window.history.replaceState({}, document.title, url.toString());
        } catch (error) {}
      };

      this._messageHandler = (event) => {
        if (!event.data) return;
        const isResize = event.data.type === 'bw-resize' && validHeight(event.data.height);
        const isScroll = event.data.type === 'bw-scroll-to' && validScrollTop(event.data.top);
        const isTrackingEvent = event.data.type === 'bw-trip-planner-event' && validTripPlannerEvent(event.data.event);
        const isMetaPurchase = event.data.type === 'bw-trip-planner-purchase';
        const isCheckoutCleanup = event.data.type === 'bw-trip-planner-checkout-cleanup';
        if (!isResize && !isScroll && !isTrackingEvent && !isMetaPurchase && !isCheckoutCleanup) return;
        if (!isPlannerMessage(event)) return;

        if (isCheckoutCleanup) {
          cleanParentCheckoutParams();
          return;
        }
        if (isMetaPurchase) {
          pushPlannerMetaPurchase(event.data.purchase);
          return;
        }
        if (isTrackingEvent) {
          pushPlannerAnalyticsEvent(event.data.event, event.data.payload);
          return;
        }
        if (isResize) {
          setHeight(event.data.height, phaseFromMessage(event.data.phase));
          scheduleHeightChecks();
          return;
        }
        if (isScroll) {
          if (validHeight(event.data.height)) setHeight(event.data.height, phaseFromMessage(event.data.phase));
          scheduleHeightChecks();
          scrollToPlannerOffset(event.data.top);
        }
      };

      window.addEventListener('message', this._messageHandler);
      this._consentHandler = sendConsentToPlanner;
      document.addEventListener('consentPolicyChanged', this._consentHandler);
      document.addEventListener('consentPolicyInitialized', this._consentHandler);
      this._plannerFrameLoadHandler = () => {
        this._plannerFrameReady = true;
        if (this._plannerContentObserver) {
          this._plannerContentObserver.disconnect();
          this._plannerContentObserver = null;
        }
        watchReadableFrame();
        scheduleHeightChecks();
        requestFrameMeasure();
        sendConsentToPlanner();
        if (this._queuedPlannerCommand) {
          const command = this._queuedPlannerCommand;
          this._queuedPlannerCommand = null;
          try {
            if (frame.contentWindow) frame.contentWindow.postMessage(command, plannerOrigin() || '*');
          } catch (error) {}
        }
      };
      frame.addEventListener('load', this._plannerFrameLoadHandler);
      if (typeof MutationObserver === 'function') {
        try {
          this._plannerFrameStyleObserver = new MutationObserver(enforceFrameHeight);
          this._plannerFrameStyleObserver.observe(frame, { attributes: true, attributeFilter: ['style'] });
        } catch (error) {
          if (this._plannerFrameStyleObserver) this._plannerFrameStyleObserver.disconnect();
          this._plannerFrameStyleObserver = null;
        }
      }
      this._plannerResizeHandler = () => {
        scheduleHeightChecks();
        requestFrameMeasure();
      };
      window.addEventListener('resize', this._plannerResizeHandler);
      if (window.visualViewport) window.visualViewport.addEventListener('resize', this._plannerResizeHandler);
      setHeight(initialHeight() - heightBuffer, 'quiz');
      scheduleHeightChecks();
      requestFrameMeasure();
      window.setTimeout(sendConsentToPlanner, 800);
    }

    _setupWixTopGapGuard() {
      this._gapTimers = [];

      const clearGapTimers = () => {
        this._gapTimers.forEach((timer) => window.clearTimeout(timer));
        this._gapTimers = [];
      };

      const later = (callback, delay) => {
        const timer = window.setTimeout(callback, delay);
        this._gapTimers.push(timer);
      };

      const sync = () => {
        const section = this.closest('section.wixui-section');
        const plannerBand = this._plannerBand || this.querySelector('#planner');
        this.style.marginTop = '';
        this.style.marginBottom = '';
        delete this.dataset.bwWixTopGap;

        // Older Wix layout data can leave this inner section at a fixed 2600px.
        // Keep the band content-sized so the next section starts after the widget.
        if (plannerBand) {
          plannerBand.style.setProperty('height', 'auto', 'important');
          plannerBand.style.setProperty('min-height', '0', 'important');
          plannerBand.style.setProperty('max-height', 'none', 'important');
        }

        const wrapper = this.parentElement;
        const container = wrapper && wrapper.parentElement;
        if (!section || !wrapper || !container) return;

        // Wix live centers custom-element wrappers inside a generated grid when
        // the viewport width changes. Pin this page wrapper to the top instead.
        wrapper.style.alignSelf = 'start';
        wrapper.style.justifySelf = 'stretch';
        wrapper.style.placeSelf = 'start stretch';
        wrapper.style.height = 'auto';
        wrapper.style.maxWidth = '100%';
        wrapper.style.minHeight = '0';
        wrapper.style.minWidth = '0';
        wrapper.style.overflowX = 'clip';
        wrapper.style.overflowY = 'visible';
        wrapper.style.width = '100%';

        container.style.alignItems = 'start';
        container.style.justifyItems = 'stretch';
        container.style.gridTemplateRows = 'auto';
        container.style.height = 'auto';
        container.style.maxWidth = '100%';
        container.style.minHeight = '0';
        container.style.minWidth = '0';
        container.style.overflowX = 'clip';
        container.style.overflowY = 'visible';

        section.style.height = 'auto';
        section.style.maxWidth = '100%';
        section.style.minHeight = '0';
        section.style.minWidth = '0';
        section.style.overflowX = 'clip';
        section.style.overflowY = 'visible';
        this.style.height = 'auto';
        this.style.maxWidth = '100%';
        this.style.minHeight = '0';
        this.style.minWidth = '0';
        this.style.overflowX = 'clip';
        this.style.overflowY = 'visible';
        this.dataset.bwWixLayoutFixed = 'true';
      };

      const runInFrame = () => {
        if (this._gapRaf) window.cancelAnimationFrame(this._gapRaf);
        this._gapRaf = window.requestAnimationFrame(sync);
      };

      const scheduleSync = () => {
        clearGapTimers();
        runInFrame();
        [120, 320, 720, 1400].forEach((delay) => later(runInFrame, delay));
      };

      sync();
      [60, 250, 800, 1600].forEach((delay) => later(sync, delay));
      this._gapResizeHandler = scheduleSync;
      window.addEventListener('resize', this._gapResizeHandler, { passive: true });
      if (window.visualViewport) window.visualViewport.addEventListener('resize', this._gapResizeHandler, { passive: true });

      const section = this.closest('section.wixui-section');
      if (section && 'ResizeObserver' in window) {
        this._gapResizeObserver = new ResizeObserver(scheduleSync);
        this._gapResizeObserver.observe(section);
        if (this.parentElement) this._gapResizeObserver.observe(this.parentElement);
      }
    }

    _styles() {
      return `
        bw-berlin-trip-planner-page {
          display: block;
          max-width: 100%;
          min-width: 0;
          overflow-x: clip;
          width: 100%;
        }

        .bw-trip-page {
          --green: #1B5E20;
          --green-dark: #123D18;
          --yellow: #FFE600;
          --lime: #7CB342;
          --light-green: #C5E1A5;
          --cream: #FAFAF5;
          --paper: #FFFDF7;
          --text: #212121;
          --muted: #4E5A4E;
          --line: #DCE8C8;
          background: var(--cream);
          color: var(--text);
          font-family: Montserrat, Arial, sans-serif;
          max-width: 100%;
          min-width: 0;
          overflow-x: clip;
          width: 100%;
        }

        .bw-trip-page *,
        .bw-trip-page *::before,
        .bw-trip-page *::after {
          box-sizing: border-box;
        }

        .bw-trip-page [hidden] {
          display: none !important;
        }

        .bw-trip-sr-only {
          border: 0;
          clip: rect(0 0 0 0);
          clip-path: inset(50%);
          height: 1px;
          margin: -1px;
          overflow: hidden;
          padding: 0;
          position: absolute;
          white-space: nowrap;
          width: 1px;
        }

        .bw-trip-page h1,
        .bw-trip-page h2,
        .bw-trip-page h3,
        .bw-trip-page p,
        .bw-trip-page figure {
          margin-top: 0;
        }

        .bw-trip-page a {
          color: inherit;
        }

        .bw-trip-inner {
          margin: 0 auto;
          max-width: 1260px;
          min-width: 0;
          width: min(100% - 48px, 1260px);
        }

        .bw-trip-hero {
          background: var(--paper);
          border-bottom: 1px solid var(--line);
          padding: 60px 0 46px;
        }

        .bw-trip-hero-grid {
          align-items: stretch;
          display: grid;
          gap: clamp(28px, 3vw, 36px);
          grid-template-columns: minmax(0, 1fr) minmax(510px, 1fr);
        }

        .bw-trip-hero-message {
          display: grid;
          grid-template-rows: auto 260px;
          min-height: 720px;
          overflow: hidden;
        }

        .bw-trip-hero-copy-wrap {
          padding: clamp(38px, 5vw, 66px) clamp(28px, 4.5vw, 58px) 34px;
        }

        .bw-trip-kicker,
        .bw-trip-section-kicker {
          color: var(--green);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 2.1px;
          line-height: 1.35;
          margin-bottom: 16px;
          text-transform: uppercase;
        }

        .bw-trip-hero h1 {
          color: #16251A;
          font-family: Merriweather, Georgia, serif;
          font-size: clamp(46px, 4.9vw, 70px);
          font-weight: 700;
          letter-spacing: -2.2px;
          line-height: 1.06;
          margin-bottom: 20px;
          max-width: 690px;
        }

        .bw-trip-title-rule {
          background: var(--green);
          display: block;
          height: 3px;
          margin: 0 0 22px;
          width: 76px;
        }

        .bw-trip-hero-copy {
          color: var(--muted);
          font-size: clamp(17px, 1.7vw, 21px);
          font-weight: 500;
          line-height: 1.6;
          margin-bottom: 26px;
          max-width: 620px;
        }

        .bw-trip-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 12px;
        }

        .bw-trip-btn {
          align-items: center;
          border-radius: 10px;
          display: inline-flex;
          font-size: 15px;
          font-weight: 900;
          justify-content: center;
          min-height: 56px;
          padding: 16px 26px;
          text-decoration: none;
          transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
        }

        .bw-trip-btn:hover,
        .bw-trip-btn:focus-visible {
          transform: translateY(-2px);
        }

        .bw-trip-btn:focus-visible,
        .bw-trip-text-link:focus-visible,
        .bw-trip-preview a:focus-visible {
          outline: 3px solid var(--lime);
          outline-offset: 4px;
        }

        .bw-trip-page .bw-trip-btn-primary,
        .bw-trip-page .bw-trip-btn-primary:visited {
          background: var(--yellow);
          box-shadow: 0 12px 24px rgba(180, 155, 0, 0.18);
          color: var(--green-dark);
        }

        .bw-trip-btn-primary:hover,
        .bw-trip-btn-primary:focus-visible {
          background: #FFF04A;
          box-shadow: 0 15px 28px rgba(180, 155, 0, 0.24);
        }

        .bw-trip-trust-line {
          color: #5D695D;
          font-size: 13px;
          font-weight: 600;
          line-height: 1.4;
          margin-bottom: 0;
        }

        .bw-trip-hero-art {
          height: 260px;
          margin: 0;
          overflow: hidden;
        }

        .bw-trip-hero-art img {
          display: block;
          height: 100%;
          object-fit: cover;
          object-position: center 60%;
          width: 100%;
        }

        .bw-trip-preview {
          background: #FFFFFF;
          border: 1px solid #D9E3CE;
          border-radius: 24px;
          box-shadow: 0 28px 64px rgba(27, 94, 32, 0.12);
          display: grid;
          gap: 14px;
          min-height: 720px;
          padding: 24px;
        }

        .bw-trip-preview-top,
        .bw-trip-preview-day,
        .bw-trip-preview-day-head,
        .bw-trip-preview-paid {
          align-items: center;
          display: flex;
          justify-content: space-between;
        }

        .bw-trip-preview-top strong {
          color: var(--text);
          font-size: 15px;
          line-height: 1.3;
        }

        .bw-trip-preview-top > span {
          border: 1px solid var(--line);
          border-radius: 999px;
          color: var(--green);
          font-size: 12px;
          font-weight: 800;
          padding: 7px 13px;
        }

        .bw-trip-preview-map {
          border-radius: 14px;
          height: 235px;
          margin: 0;
          overflow: hidden;
          position: relative;
        }

        .bw-trip-preview-map img {
          display: block;
          height: 100%;
          object-fit: cover;
          width: 100%;
        }

        .bw-trip-preview-map figcaption {
          background: rgba(27, 94, 32, 0.92);
          border-radius: 7px;
          bottom: 12px;
          color: #FFFFFF;
          font-size: 12px;
          font-weight: 800;
          left: 12px;
          padding: 8px 10px;
          position: absolute;
        }

        .bw-trip-preview-day {
          border: 1px solid #E0E8D6;
          border-radius: 12px;
          color: var(--green-dark);
          font-size: 13px;
          min-height: 48px;
          padding: 13px 15px;
        }

        .bw-trip-preview-day > span,
        .bw-trip-preview-day-head > span {
          color: #5A675A;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .bw-trip-preview-day-open {
          align-items: stretch;
          display: grid;
          gap: 12px;
          padding: 15px;
        }

        .bw-trip-preview-stops {
          display: grid;
          gap: 8px;
          grid-template-columns: repeat(var(--preview-stop-count, 4), minmax(0, 1fr));
        }

        .bw-trip-preview-stops figure {
          border: 1px solid #E4E9DD;
          border-radius: 8px;
          margin: 0;
          overflow: hidden;
        }

        .bw-trip-preview-stops img {
          aspect-ratio: 4 / 3;
          display: block;
          object-fit: cover;
          width: 100%;
        }

        .bw-trip-preview-stops figcaption {
          color: #263226;
          font-size: 10px;
          font-weight: 800;
          line-height: 1.25;
          padding: 8px;
        }

        .bw-trip-preview-stops figcaption b {
          color: #1B5E20;
          display: block;
          font-size: 9px;
          letter-spacing: .5px;
          margin-bottom: 3px;
        }

        .bw-trip-preview-paid {
          background: #FFFBE5;
          border: 1px solid #E9E1AE;
          border-radius: 12px;
          gap: 16px;
          padding: 14px 15px;
        }

        .bw-trip-preview-paid div {
          display: grid;
          gap: 3px;
        }

        .bw-trip-preview-paid strong {
          color: #243024;
          font-size: 13px;
        }

        .bw-trip-preview-paid span {
          color: #687168;
          font-size: 10px;
          font-weight: 600;
        }

        .bw-trip-preview-paid a {
          background: var(--yellow);
          border-radius: 8px;
          color: #173C1B;
          flex: 0 0 auto;
          font-size: 12px;
          font-weight: 900;
          padding: 11px 14px;
          text-decoration: none;
        }

        .bw-trip-proof-band {
          background: #FFFFFF;
          border-bottom: 1px solid var(--line);
          padding: 0;
        }

        .bw-trip-proof {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .bw-trip-proof span {
          align-items: center;
          border-right: 1px solid #E6EDD9;
          display: flex;
          gap: 12px;
          min-height: 86px;
          padding: 16px 22px;
        }

        .bw-trip-proof span:last-child {
          border-right: 0;
        }

        .bw-trip-proof img {
          height: 42px;
          object-fit: contain;
          width: 42px;
        }

        .bw-trip-proof b {
          color: #243024;
          font-size: 14px;
          line-height: 1.3;
        }

        .bw-trip-planner-band {
          background: var(--cream);
          padding: 42px 0 54px;
        }

        .bw-trip-planner-head {
          align-items: end;
          display: grid;
          gap: 32px;
          grid-template-columns: minmax(0, 0.85fr) minmax(300px, 0.55fr);
          margin-bottom: 22px;
        }

        .bw-trip-section-kicker {
          margin-bottom: 10px;
        }

        .bw-trip-planner-head h2,
        .bw-trip-guide-copy h2,
        .bw-trip-final h2 {
          color: #173C1B;
          font-family: Merriweather, Georgia, serif;
          font-size: clamp(32px, 4vw, 50px);
          font-weight: 700;
          letter-spacing: -1px;
          line-height: 1.08;
          margin-bottom: 0;
        }

        .bw-trip-planner-head > p,
        .bw-trip-guide-copy > p,
        .bw-trip-final p {
          color: var(--muted);
          font-size: 16px;
          font-weight: 500;
          line-height: 1.65;
          margin-bottom: 0;
        }

        .bw-trip-widget-shell {
          background: transparent;
          border: 0;
          border-radius: 0;
          box-shadow: none;
          margin-inline: auto;
          max-width: 900px;
          min-width: 0;
          overflow: visible;
          width: 100%;
        }

        .bw-trip-widget-shell iframe {
          border: 0;
          display: block;
          height: 1900px;
          min-height: 1900px;
          max-width: 100%;
          min-width: 0;
          overflow: hidden;
          width: 100%;
        }

        .bw-trip-section {
          padding: 56px 0;
        }

        .bw-trip-guide {
          background: #F2F6EA;
          border-bottom: 1px solid var(--line);
          border-top: 1px solid var(--line);
        }

        .bw-trip-guide-grid {
          align-items: center;
          display: grid;
          gap: 40px;
          grid-template-columns: 320px minmax(0, 1fr);
        }

        .bw-trip-guide-photo {
          aspect-ratio: 4 / 3;
          border-radius: 18px;
          margin: 0;
          overflow: hidden;
        }

        .bw-trip-guide-photo img {
          display: block;
          height: 100%;
          object-fit: cover;
          object-position: center 34%;
          width: 100%;
        }

        .bw-trip-guide-copy {
          max-width: 790px;
        }

        .bw-trip-guide-copy > p {
          margin-top: 18px;
        }

        .bw-trip-text-link {
          color: var(--green);
          display: inline-flex;
          font-size: 14px;
          font-weight: 900;
          margin-top: 22px;
          text-decoration: underline;
          text-decoration-color: var(--yellow);
          text-decoration-thickness: 4px;
          text-underline-offset: 5px;
        }

        .bw-trip-final {
          background: #FFFFFF;
        }

        .bw-trip-final-box {
          align-items: center;
          background: var(--green-dark);
          border-radius: 20px;
          color: #FFFFFF;
          display: flex;
          gap: 32px;
          justify-content: space-between;
          padding: 38px 42px;
        }

        .bw-trip-final .bw-trip-section-kicker {
          color: var(--yellow);
        }

        .bw-trip-final h2,
        .bw-trip-final p {
          color: #FFFFFF;
        }

        .bw-trip-final p {
          color: rgba(255, 255, 255, 0.82);
          margin-top: 12px;
        }

        .bw-trip-final .bw-trip-actions {
          flex: 0 0 auto;
          margin: 0;
        }

        @media (max-width: 1040px) {
          .bw-trip-hero-grid {
            grid-template-columns: 1fr;
          }

          .bw-trip-hero-message,
          .bw-trip-preview {
            min-height: 0;
          }

          .bw-trip-hero-message {
            grid-template-columns: minmax(0, 1fr) 320px;
            grid-template-rows: 1fr;
          }

          .bw-trip-hero-art {
            height: 100%;
          }

          .bw-trip-proof {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .bw-trip-proof span:nth-child(2) {
            border-right: 0;
          }

          .bw-trip-proof span:nth-child(-n + 2) {
            border-bottom: 1px solid #E6EDD9;
          }
        }

        @media (max-width: 760px) {
          .bw-trip-inner {
            width: min(100% - 24px, 1260px);
          }

          .bw-trip-hero {
            padding: 18px 0 28px;
          }

          .bw-trip-hero-grid {
            gap: 18px;
          }

          .bw-trip-hero-message {
            background: #FDFBF4;
            border-radius: 16px;
            grid-template-columns: 1fr;
            grid-template-rows: auto 210px;
          }

          .bw-trip-hero-copy-wrap {
            padding: 30px 24px 26px;
          }

          .bw-trip-hero h1 {
            font-size: clamp(38px, 11vw, 54px);
            letter-spacing: -1.4px;
          }

          .bw-trip-actions,
          .bw-trip-btn {
            width: 100%;
          }

          .bw-trip-preview {
            border-radius: 16px;
            gap: 10px;
            padding: 14px;
          }

          .bw-trip-preview-map {
            height: 190px;
          }

          .bw-trip-preview-stops figcaption {
            font-size: 9px;
            padding: 6px;
          }

          .bw-trip-preview-paid {
            align-items: stretch;
            flex-direction: column;
          }

          .bw-trip-preview-paid a {
            text-align: center;
          }

          .bw-trip-proof {
            grid-template-columns: 1fr;
          }

          .bw-trip-proof span,
          .bw-trip-proof span:nth-child(2) {
            border-bottom: 1px solid #E6EDD9;
            border-right: 0;
            min-height: 68px;
            padding: 12px 16px;
          }

          .bw-trip-proof span:last-child {
            border-bottom: 0;
          }

          .bw-trip-proof img {
            height: 36px;
            width: 36px;
          }

          .bw-trip-planner-band {
            padding: 30px 0 38px;
          }

          .bw-trip-planner-head,
          .bw-trip-guide-grid {
            grid-template-columns: 1fr;
          }

          .bw-trip-planner-head {
            gap: 10px;
          }

          .bw-trip-widget-shell {
            border: 0;
            border-radius: 0;
          }

          .bw-trip-section {
            padding: 38px 0;
          }

          .bw-trip-guide-grid {
            gap: 24px;
          }

          .bw-trip-guide-photo {
            aspect-ratio: 16 / 10;
          }

          .bw-trip-final-box {
            align-items: stretch;
            flex-direction: column;
            padding: 28px 24px;
          }
        }

        /* Option 2: planner-first landing. Keep the real iframe as the first
           interactive surface and move the product proof below it. */
        .bw-trip-launch {
          background:
            radial-gradient(circle at 50% -20%, rgba(197, 225, 165, 0.18), transparent 42%),
            linear-gradient(180deg, #FFFDF8 0%, #FAFAF5 100%);
          border-bottom: 1px solid var(--line);
          padding: 34px 0 44px;
        }

        .bw-trip-launch-inner {
          max-width: 1000px;
          width: min(100% - 48px, 1000px);
        }

        .bw-trip-intro {
          margin: 0 auto 26px;
          max-width: 900px;
          text-align: center;
        }

        .bw-trip-intro .bw-trip-kicker {
          margin-bottom: 12px;
        }

        .bw-trip-intro h1 {
          color: #16251A;
          font-family: Merriweather, Georgia, serif;
          font-size: clamp(42px, 5vw, 66px);
          font-weight: 700;
          letter-spacing: -2px;
          line-height: 1.08;
          margin: 0 auto;
          max-width: 900px;
          text-wrap: balance;
        }

        .bw-trip-intro-copy {
          color: #3F4A40;
          font-size: clamp(16px, 1.6vw, 19px);
          font-weight: 500;
          line-height: 1.55;
          margin: 16px auto 0;
          max-width: 660px;
        }

        .bw-trip-intro-message {
          min-width: 0;
        }

        bw-berlin-trip-planner-page[data-bw-offer-state="active"] .bw-trip-intro {
          align-items: center;
          display: grid;
          gap: 28px;
          grid-template-columns: minmax(0, 1fr) minmax(300px, 348px);
          max-width: 920px;
          text-align: left;
        }

        bw-berlin-trip-planner-page[data-bw-offer-state="active"] .bw-trip-intro h1 {
          font-size: clamp(38px, 4.2vw, 58px);
          letter-spacing: -1.7px;
          margin-inline: 0;
        }

        bw-berlin-trip-planner-page[data-bw-offer-state="active"] .bw-trip-intro-copy {
          margin-inline: 0;
        }

        .bw-trip-launch-offer {
          background:
            radial-gradient(circle at 100% 0%, rgba(197, 225, 165, 0.2), transparent 38%),
            linear-gradient(145deg, #123D18, #1B5E20);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 18px;
          box-shadow: 0 20px 42px rgba(18, 61, 24, 0.18);
          color: #FFFFFF;
          min-width: 0;
          padding: 20px;
          text-align: left;
        }

        .bw-trip-launch-offer-kicker {
          color: var(--yellow);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.15px;
          line-height: 1.35;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .bw-trip-launch-offer-price {
          color: #FFFFFF;
          font-family: Merriweather, Georgia, serif;
          font-size: clamp(25px, 2.4vw, 31px);
          font-weight: 700;
          letter-spacing: -0.5px;
          line-height: 1.12;
          margin-bottom: 8px;
        }

        .bw-trip-launch-offer-regular {
          color: rgba(255, 255, 255, 0.82);
          font-size: 11px;
          font-weight: 600;
          line-height: 1.45;
          margin-bottom: 8px;
        }

        .bw-trip-launch-offer-saving {
          background: #F4F8EC;
          border-radius: 999px;
          color: var(--green-dark);
          display: inline-flex;
          font-size: 11px;
          font-weight: 900;
          line-height: 1.2;
          margin-bottom: 13px;
          padding: 7px 10px;
        }

        .bw-trip-offer-countdown {
          display: grid;
          gap: 7px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-bottom: 13px;
        }

        .bw-trip-offer-countdown span {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 9px;
          display: grid;
          gap: 1px;
          min-width: 0;
          padding: 7px 4px;
          text-align: center;
        }

        .bw-trip-offer-countdown b {
          color: var(--yellow);
          font-size: 18px;
          line-height: 1;
        }

        .bw-trip-offer-countdown small {
          color: rgba(255, 255, 255, 0.78);
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.45px;
          text-transform: uppercase;
        }

        .bw-trip-page .bw-trip-offer-cta,
        .bw-trip-page .bw-trip-offer-cta:visited {
          align-items: center;
          background: var(--yellow);
          border-radius: 9px;
          color: var(--green-dark);
          display: flex;
          font-size: 13px;
          font-weight: 900;
          justify-content: center;
          min-height: 48px;
          padding: 12px 16px;
          text-align: center;
          text-decoration: none;
        }

        .bw-trip-page .bw-trip-offer-cta:hover,
        .bw-trip-page .bw-trip-offer-cta:focus-visible {
          background: #FFF04A;
          color: var(--green-dark);
          outline: 3px solid var(--lime);
          outline-offset: 3px;
        }

        .bw-trip-offer-proof-line {
          color: rgba(255, 255, 255, 0.82);
          display: block;
          font-size: 10px;
          font-weight: 700;
          margin-top: 8px;
          text-align: center;
        }

        .bw-trip-offer-review-note {
          background: #FFFFFF;
          border-radius: 7px;
          color: #7A3000;
          display: block;
          font-size: 9px;
          font-weight: 800;
          line-height: 1.35;
          margin-top: 10px;
          padding: 7px 8px;
          text-align: center;
        }

        .bw-trip-value-first {
          background: #FFFFFF;
          border: 1px solid rgba(27, 94, 32, 0.38);
          border-radius: 20px;
          box-shadow: 0 18px 42px rgba(27, 94, 32, 0.09);
          display: grid;
          gap: 0;
          grid-template-columns: minmax(250px, 0.76fr) minmax(0, 1.24fr);
          margin: 0 auto 22px;
          max-width: 920px;
          overflow: hidden;
        }

        .bw-trip-value-route {
          align-content: center;
          background:
            linear-gradient(145deg, rgba(18, 61, 24, 0.97), rgba(27, 94, 32, 0.92)),
            var(--green-dark);
          color: #FFFFFF;
          display: grid;
          gap: 12px;
          min-width: 0;
          padding: 30px;
        }

        .bw-trip-value-day {
          color: var(--yellow);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1.25px;
          text-transform: uppercase;
        }

        .bw-trip-value-route strong {
          font-family: Merriweather, Georgia, serif;
          font-size: clamp(18px, 2vw, 24px);
          line-height: 1.5;
        }

        .bw-trip-value-route strong i {
          color: var(--yellow);
          font-family: Montserrat, Arial, sans-serif;
          font-style: normal;
          padding: 0 3px;
        }

        .bw-trip-value-route small {
          color: rgba(255, 255, 255, 0.78);
          font-size: 12px;
          font-weight: 600;
          line-height: 1.55;
        }

        .bw-trip-value-offer {
          min-width: 0;
          padding: 26px 30px 28px;
        }

        .bw-trip-value-kicker {
          color: var(--green);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1.35px;
          margin-bottom: 7px;
          text-transform: uppercase;
        }

        .bw-trip-value-offer h2 {
          color: #173C1B;
          font-family: Merriweather, Georgia, serif;
          font-size: clamp(22px, 2.4vw, 30px);
          letter-spacing: -0.45px;
          line-height: 1.16;
          margin-bottom: 10px;
        }

        .bw-trip-value-offer > p:not(.bw-trip-value-kicker) {
          color: #4C584D;
          font-size: 13px;
          font-weight: 500;
          line-height: 1.55;
          margin-bottom: 14px;
        }

        .bw-trip-value-offer ul {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          list-style: none;
          margin: 0 0 18px;
          padding: 0;
        }

        .bw-trip-value-offer li {
          background: #F1F7E9;
          border: 1px solid #D8E7C7;
          border-radius: 999px;
          color: #2C462E;
          font-size: 10px;
          font-weight: 800;
          line-height: 1.25;
          padding: 7px 10px;
        }

        .bw-trip-value-action {
          align-items: center;
          display: flex;
          gap: 18px;
          justify-content: space-between;
        }

        .bw-trip-value-action > span {
          display: grid;
          gap: 2px;
        }

        .bw-trip-value-action strong {
          color: var(--green-dark);
          font-size: 28px;
          line-height: 1;
        }

        .bw-trip-value-action small {
          color: #687168;
          font-size: 10px;
          font-weight: 700;
          line-height: 1.35;
        }

        .bw-trip-page .bw-trip-value-cta,
        .bw-trip-page .bw-trip-value-cta:visited {
          align-items: center;
          background: var(--yellow);
          border-radius: 9px;
          box-shadow: 0 10px 22px rgba(180, 155, 0, 0.2);
          color: var(--green-dark);
          display: inline-flex;
          flex: 0 0 auto;
          font-size: 13px;
          font-weight: 900;
          justify-content: center;
          min-height: 48px;
          padding: 13px 18px;
          text-decoration: none;
          transition: background 160ms ease, box-shadow 160ms ease, transform 160ms ease;
        }

        .bw-trip-page .bw-trip-value-cta:hover,
        .bw-trip-page .bw-trip-value-cta:focus-visible {
          background: #FFF04A;
          box-shadow: 0 13px 24px rgba(180, 155, 0, 0.25);
          color: var(--green-dark);
          transform: translateY(-1px);
        }

        .bw-trip-page .bw-trip-value-cta:focus-visible {
          outline: 3px solid var(--lime);
          outline-offset: 4px;
        }

        .bw-trip-launch .bw-trip-planner-band {
          background: transparent;
          padding: 0;
          scroll-margin-top: 24px;
        }

        .bw-trip-launch .bw-trip-widget-shell {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(27, 94, 32, 0.62);
          border-radius: 20px;
          box-sizing: border-box;
          box-shadow: 0 18px 42px rgba(27, 94, 32, 0.08);
          max-width: 920px;
          min-width: 0;
          overflow: hidden;
          overflow-anchor: none;
          padding: 20px 24px;
          width: 100%;
        }

        .bw-trip-launch .bw-trip-widget-shell iframe {
          box-sizing: border-box;
          height: 560px;
          max-width: 100%;
          min-height: 560px;
          min-width: 0;
          transition: height 200ms cubic-bezier(0.22, 1, 0.36, 1), min-height 200ms cubic-bezier(0.22, 1, 0.36, 1);
          width: 100%;
        }

        .bw-trip-proof-band {
          padding: 0;
        }

        .bw-trip-proof {
          grid-template-columns: repeat(3, minmax(0, 1fr));
          max-width: 1000px;
        }

        .bw-trip-proof-item {
          align-items: center;
          border-right: 1px solid #E6EDD9;
          display: flex;
          gap: 14px;
          min-height: 112px;
          padding: 20px 30px;
        }

        .bw-trip-proof-item:last-child {
          border-right: 0;
        }

        .bw-trip-proof-item > span {
          align-items: initial;
          border: 0;
          display: grid;
          gap: 4px;
          min-height: 0;
          min-width: 0;
          padding: 0;
        }

        .bw-trip-proof-item img {
          flex: 0 0 auto;
          height: 48px;
          object-fit: contain;
          width: 48px;
        }

        .bw-trip-proof-item b,
        .bw-trip-proof-item small {
          display: block;
        }

        .bw-trip-proof-item b {
          color: #243024;
          font-size: 14px;
          line-height: 1.3;
        }

        .bw-trip-proof-item small {
          color: #596459;
          font-size: 12px;
          font-weight: 500;
          line-height: 1.45;
        }

        .bw-trip-delivery-proof {
          background: #FFFFFF;
          border-bottom: 1px solid var(--line);
          padding: 44px 0;
        }

        .bw-trip-delivery-inner {
          align-items: center;
          display: grid;
          gap: 34px;
          grid-template-columns: minmax(240px, 0.72fr) minmax(0, 1.28fr);
          max-width: 1000px;
        }

        .bw-trip-delivery-heading .bw-trip-section-kicker {
          margin-bottom: 8px;
        }

        .bw-trip-delivery-heading h2 {
          color: var(--green-dark);
          font-family: Merriweather, Georgia, serif;
          font-size: clamp(28px, 3.2vw, 40px);
          letter-spacing: -0.8px;
          line-height: 1.12;
          margin-bottom: 0;
        }

        .bw-trip-delivery-grid {
          align-items: center;
          display: grid;
          gap: 12px;
          grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
          min-width: 0;
        }

        .bw-trip-delivery-grid article {
          align-items: center;
          background: #F7FAF1;
          border: 1px solid #DCE8C8;
          border-radius: 14px;
          display: grid;
          gap: 10px;
          justify-items: center;
          min-height: 174px;
          min-width: 0;
          padding: 18px 14px;
          text-align: center;
        }

        .bw-trip-delivery-grid article img {
          height: 62px;
          object-fit: contain;
          width: 62px;
        }

        .bw-trip-delivery-grid article span {
          display: grid;
          gap: 5px;
        }

        .bw-trip-delivery-grid article strong {
          color: #243024;
          font-size: 14px;
          line-height: 1.25;
        }

        .bw-trip-delivery-grid article small {
          color: #596459;
          font-size: 11px;
          font-weight: 500;
          line-height: 1.45;
        }

        .bw-trip-same-plan {
          align-items: center;
          background: var(--yellow);
          border: 2px solid #E5CF00;
          border-radius: 999px;
          color: var(--green-dark);
          display: flex;
          font-size: 10px;
          font-weight: 900;
          height: 76px;
          justify-content: center;
          letter-spacing: 0.6px;
          line-height: 1.05;
          padding: 10px;
          text-align: center;
          width: 76px;
        }

        .bw-trip-sample {
          background: #F2F6EA;
          border-bottom: 1px solid var(--line);
        }

        .bw-trip-sample-grid {
          align-items: center;
          display: grid;
          gap: clamp(34px, 5vw, 64px);
          grid-template-columns: minmax(300px, 0.72fr) minmax(500px, 1fr);
        }

        .bw-trip-sample-copy h2 {
          color: #173C1B;
          font-family: Merriweather, Georgia, serif;
          font-size: clamp(34px, 4vw, 52px);
          font-weight: 700;
          letter-spacing: -1.2px;
          line-height: 1.08;
          margin-bottom: 18px;
        }

        .bw-trip-sample-copy > p:not(.bw-trip-section-kicker) {
          color: var(--muted);
          font-size: 16px;
          font-weight: 500;
          line-height: 1.65;
          margin-bottom: 24px;
        }

        .bw-trip-sample-art {
          border-radius: 16px;
          height: 210px;
          margin: 0;
          overflow: hidden;
        }

        .bw-trip-sample-art img {
          display: block;
          height: 100%;
          object-fit: cover;
          object-position: center 60%;
          width: 100%;
        }

        .bw-trip-sample .bw-trip-preview {
          min-height: 650px;
        }

        @media (max-width: 1040px) {
          .bw-trip-delivery-inner {
            grid-template-columns: 1fr;
          }

          .bw-trip-delivery-heading {
            max-width: 720px;
          }

          .bw-trip-sample-grid {
            grid-template-columns: 1fr;
          }

          .bw-trip-sample-copy {
            margin-inline: auto;
            max-width: 780px;
          }

          .bw-trip-sample .bw-trip-preview {
            margin-inline: auto;
            max-width: 780px;
            width: 100%;
          }
        }

        @media (max-width: 760px) {
          .bw-trip-launch {
            padding: 20px 0 28px;
          }

          .bw-trip-launch-inner {
            width: min(100% - 20px, 1000px);
          }

          .bw-trip-intro {
            margin-bottom: 20px;
            padding-inline: 8px;
          }

          bw-berlin-trip-planner-page[data-bw-offer-state="active"] .bw-trip-intro {
            gap: 16px;
            grid-template-columns: 1fr;
            text-align: center;
          }

          bw-berlin-trip-planner-page[data-bw-offer-state="active"] .bw-trip-intro h1,
          bw-berlin-trip-planner-page[data-bw-offer-state="active"] .bw-trip-intro-copy {
            margin-inline: auto;
          }

          .bw-trip-intro .bw-trip-kicker {
            font-size: 11px;
            letter-spacing: 1.8px;
            margin-bottom: 10px;
          }

          .bw-trip-intro h1 {
            font-size: clamp(34px, 9.7vw, 46px);
            letter-spacing: -1.25px;
            line-height: 1.08;
          }

          .bw-trip-intro-copy {
            font-size: 15px;
            line-height: 1.5;
            margin-top: 12px;
          }

          .bw-trip-launch-offer {
            margin-inline: auto;
            max-width: 430px;
            padding: 17px;
            width: 100%;
          }

          .bw-trip-launch-offer-price {
            font-size: 25px;
          }

          .bw-trip-value-first {
            border-radius: 16px;
            grid-template-columns: 1fr;
            margin-bottom: 16px;
          }

          .bw-trip-value-route,
          .bw-trip-value-offer {
            padding: 20px;
          }

          .bw-trip-value-route {
            gap: 8px;
          }

          .bw-trip-value-route strong {
            font-size: 18px;
            line-height: 1.45;
          }

          .bw-trip-value-offer h2 {
            font-size: 22px;
          }

          .bw-trip-value-action {
            align-items: stretch;
            flex-direction: column;
            gap: 12px;
          }

          .bw-trip-page .bw-trip-value-cta,
          .bw-trip-page .bw-trip-value-cta:visited {
            width: 100%;
          }

          .bw-trip-launch .bw-trip-widget-shell {
            border-radius: 16px;
            padding: 10px;
          }

          .bw-trip-launch .bw-trip-widget-shell iframe {
            height: 610px;
            min-height: 610px;
          }

          .bw-trip-proof {
            grid-template-columns: 1fr;
          }

          .bw-trip-proof-item,
          .bw-trip-proof-item:last-child {
            border-bottom: 1px solid #E6EDD9;
            border-right: 0;
            min-height: 82px;
            padding: 14px 16px;
          }

          .bw-trip-proof-item:last-child {
            border-bottom: 0;
          }

          .bw-trip-proof-item img {
            height: 42px;
            width: 42px;
          }

          .bw-trip-delivery-proof {
            padding: 34px 0;
          }

          .bw-trip-delivery-inner {
            gap: 22px;
          }

          .bw-trip-delivery-heading {
            text-align: center;
          }

          .bw-trip-delivery-grid {
            grid-template-columns: 1fr;
          }

          .bw-trip-delivery-grid article {
            gap: 14px;
            grid-template-columns: 58px minmax(0, 1fr);
            justify-items: start;
            min-height: 118px;
            padding: 16px 18px;
            text-align: left;
          }

          .bw-trip-delivery-grid article img {
            height: 54px;
            width: 54px;
          }

          .bw-trip-same-plan {
            height: 62px;
            justify-self: center;
            width: 62px;
          }

          .bw-trip-sample-grid {
            gap: 26px;
          }

          .bw-trip-sample-copy h2 {
            font-size: 34px;
          }

          .bw-trip-sample-art {
            height: 190px;
          }

          .bw-trip-sample .bw-trip-preview {
            min-height: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bw-trip-btn,
          .bw-trip-launch .bw-trip-widget-shell iframe {
            transition: none;
          }
        }
      `;
    }

    _stylesLegacy() {
      return `
        bw-berlin-trip-planner-page {
          display: block;
          max-width: 100%;
          min-width: 0;
          overflow-x: clip;
          width: 100%;
        }

        .bw-trip-page {
          --green: #1B5E20;
          --green-dark: #0E3214;
          --yellow: #FFE600;
          --lime: #7CB342;
          --light-green: #C5E1A5;
          --cream: #FAFAF5;
          --text: #212121;
          --muted: #4E5A4E;
          --blue: #2F80ED;
          --blue-soft: #EAF4FF;
          background: var(--cream);
          color: var(--text);
          font-family: Montserrat, Arial, sans-serif;
          max-width: 100%;
          min-width: 0;
          overflow-x: clip;
          width: 100%;
        }

        .bw-trip-inner,
        .bw-trip-hero,
        .bw-trip-hero-inner,
        .bw-trip-planner-band,
        .bw-trip-widget-shell,
        .bw-trip-section,
        .bw-trip-proof,
        .bw-trip-steps,
        .bw-trip-cover-grid,
        .bw-trip-guide-grid,
        .bw-trip-compare-grid,
        .bw-trip-final-box {
          max-width: 100%;
          min-width: 0;
          overflow-x: clip;
        }

        @supports not (overflow: clip) {
          bw-berlin-trip-planner-page,
          .bw-trip-page,
          .bw-trip-inner,
          .bw-trip-hero,
          .bw-trip-hero-inner,
          .bw-trip-planner-band,
          .bw-trip-widget-shell,
          .bw-trip-section,
          .bw-trip-proof,
          .bw-trip-steps,
          .bw-trip-cover-grid,
          .bw-trip-guide-grid,
          .bw-trip-compare-grid,
          .bw-trip-final-box {
            overflow-x: hidden;
          }
        }

        .bw-trip-page *,
        .bw-trip-page *::before,
        .bw-trip-page *::after {
          box-sizing: border-box;
        }

        .bw-trip-page h1,
        .bw-trip-page h2,
        .bw-trip-page h3,
        .bw-trip-page p,
        .bw-trip-page figure {
          margin-top: 0;
        }

        .bw-trip-page a {
          color: inherit;
        }

        .bw-trip-inner {
          margin: 0 auto;
          max-width: 1180px;
          width: min(100% - 40px, 1180px);
        }

        .bw-trip-hero {
          align-items: end;
          background-image: var(--hero-image);
          background-position: center;
          background-size: cover;
          display: grid;
          min-height: clamp(560px, 78vh, 760px);
          overflow: hidden;
          position: relative;
        }

        .bw-trip-hero-shade {
          background:
            linear-gradient(90deg, rgba(14, 50, 20, 0.92) 0%, rgba(14, 50, 20, 0.76) 43%, rgba(14, 50, 20, 0.26) 100%),
            linear-gradient(0deg, rgba(14, 50, 20, 0.94) 0%, rgba(14, 50, 20, 0) 32%);
          inset: 0;
          position: absolute;
        }

        .bw-trip-hero-inner {
          padding: 88px 0 54px;
          position: relative;
          z-index: 1;
        }

        .bw-trip-kicker,
        .bw-trip-section-kicker {
          color: var(--yellow);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 2.3px;
          line-height: 1.35;
          margin-bottom: 14px;
          text-transform: uppercase;
        }

        .bw-trip-section-kicker {
          color: var(--green);
        }

        .bw-trip-hero h1 {
          color: #FFFFFF;
          font-size: clamp(56px, 8vw, 112px);
          font-weight: 900;
          letter-spacing: 0;
          line-height: 0.92;
          margin-bottom: 24px;
          max-width: 980px;
        }

        .bw-trip-hero-copy {
          color: rgba(255, 255, 255, 0.92);
          font-size: clamp(18px, 2vw, 26px);
          font-weight: 600;
          line-height: 1.45;
          margin-bottom: 28px;
          max-width: 860px;
        }

        .bw-trip-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 26px;
        }

        .bw-trip-btn {
          align-items: center;
          border-radius: 999px;
          display: inline-flex;
          font-size: 13px;
          font-weight: 900;
          justify-content: center;
          letter-spacing: 0.8px;
          min-height: 52px;
          padding: 15px 24px;
          text-decoration: none;
          text-transform: uppercase;
          transition: transform 160ms ease, background 160ms ease, color 160ms ease;
        }

        .bw-trip-btn:hover,
        .bw-trip-btn:focus-visible {
          transform: translateY(-1px);
        }

        .bw-trip-btn-primary {
          background: var(--yellow);
          color: var(--green);
        }

        .bw-trip-btn-secondary {
          background: rgba(255, 255, 255, 0.13);
          border: 1px solid rgba(255, 255, 255, 0.46);
          color: #FFFFFF;
        }

        .bw-trip-proof {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          max-width: 1080px;
        }

        .bw-trip-proof span {
          align-items: stretch;
          background: rgba(250, 250, 245, 0.13);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.86);
          display: grid;
          font-size: 12px;
          grid-template-columns: 104px 1fr;
          line-height: 1.45;
          min-height: 96px;
          min-width: 0;
          overflow: hidden;
          padding: 0;
        }

        .bw-trip-proof img {
          background: transparent;
          border-right: 0;
          display: block;
          grid-row: 1 / span 2;
          height: 100%;
          min-height: 96px;
          object-fit: contain;
          padding: 0;
          width: 104px;
        }

        .bw-trip-proof b {
          color: var(--yellow);
          display: block;
          font-size: 13px;
          margin: auto 14px 2px;
          min-width: 0;
        }

        .bw-trip-proof em {
          display: block;
          font-style: normal;
          grid-column: 2;
          margin: 0 14px auto;
          min-width: 0;
        }

        .bw-trip-planner-band {
          background:
            linear-gradient(180deg, #FFFFFF 0%, #F7FAF1 100%);
          border-bottom: 1px solid #DCE8C8;
          border-top: 8px solid var(--yellow);
          padding: 38px 0 54px;
        }

        .bw-trip-planner-head {
          align-items: end;
          display: grid;
          gap: 24px;
          grid-template-columns: minmax(0, 0.9fr) minmax(280px, 0.56fr);
          margin-bottom: 24px;
        }

        .bw-trip-planner-head h2,
        .bw-trip-section-head h2,
        .bw-trip-guide-copy h2,
        .bw-trip-compare h2,
        .bw-trip-final h2 {
          color: var(--green);
          font-size: clamp(34px, 5vw, 58px);
          font-weight: 900;
          letter-spacing: 0;
          line-height: 1.02;
          margin-bottom: 14px;
        }

        .bw-trip-planner-head p,
        .bw-trip-section-head p,
        .bw-trip-guide-copy p,
        .bw-trip-final p {
          color: var(--muted);
          font-size: 17px;
          font-weight: 500;
          line-height: 1.65;
          margin-bottom: 0;
        }

        .bw-trip-widget-shell {
          background: #FFFFFF;
          border: 1px solid #DCE8C8;
          border-radius: 18px;
          box-shadow: 0 24px 60px rgba(27, 94, 32, 0.14);
          overflow: hidden;
        }

        .bw-trip-widget-shell iframe {
          border: 0;
          display: block;
          height: 1900px;
          min-height: 1900px;
          max-width: 100%;
          min-width: 0;
          overflow: hidden;
          width: 100%;
        }

        .bw-trip-section {
          padding: 72px 0;
        }

        .bw-trip-section-head {
          max-width: 820px;
          margin-bottom: 30px;
        }

        .bw-trip-why {
          background: var(--cream);
        }

        .bw-trip-steps {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .bw-trip-steps article,
        .bw-trip-cover-grid article,
        .bw-trip-final-box {
          background: #FFFFFF;
          border: 1px solid #DCE8C8;
          border-radius: 10px;
        }

        .bw-trip-steps article {
          min-width: 0;
          overflow: hidden;
          padding: 0;
        }

        .bw-trip-step-art {
          aspect-ratio: 16 / 9;
          display: block;
          object-fit: cover;
          width: 100%;
        }

        .bw-trip-step-body {
          padding: 22px 24px 24px;
        }

        .bw-trip-steps span {
          align-items: center;
          background: var(--yellow);
          border-radius: 999px;
          color: var(--green);
          display: inline-flex;
          font-size: 12px;
          font-weight: 900;
          height: 38px;
          justify-content: center;
          margin-bottom: 18px;
          width: 38px;
        }

        .bw-trip-page h3 {
          color: var(--green);
          font-size: 22px;
          font-weight: 900;
          line-height: 1.18;
          margin-bottom: 10px;
        }

        .bw-trip-steps p,
        .bw-trip-cover-grid p,
        .bw-trip-compare li {
          color: var(--muted);
          font-size: 15px;
          font-weight: 500;
          line-height: 1.58;
          margin-bottom: 0;
        }

        .bw-trip-guide {
          background: #0E3214;
          color: #FFFFFF;
        }

        .bw-trip-guide-grid {
          align-items: center;
          display: grid;
          gap: 42px;
          grid-template-columns: minmax(270px, 0.45fr) minmax(0, 0.9fr);
        }

        .bw-trip-guide-photo {
          aspect-ratio: 4 / 5;
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 18px;
          margin: 0;
          overflow: hidden;
        }

        .bw-trip-guide-photo img {
          display: block;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          width: 100%;
        }

        .bw-trip-guide .bw-trip-section-kicker,
        .bw-trip-final .bw-trip-section-kicker {
          color: var(--yellow);
        }

        .bw-trip-guide-copy h2,
        .bw-trip-guide-copy p {
          color: #FFFFFF;
        }

        .bw-trip-guide-copy p {
          color: rgba(255, 255, 255, 0.84);
          max-width: 780px;
        }

        .bw-trip-text-link {
          color: var(--yellow);
          display: inline-flex;
          font-weight: 900;
          margin-top: 20px;
          text-decoration: none;
        }

        .bw-trip-covers {
          background: linear-gradient(180deg, #FFFFFF, #F6FAEF);
        }

        .bw-trip-cover-grid {
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .bw-trip-cover-grid article {
          overflow: hidden;
        }

        .bw-trip-cover-grid img {
          aspect-ratio: 16 / 10;
          display: block;
          height: auto;
          object-fit: cover;
          width: 100%;
        }

        .bw-trip-cover-grid h3,
        .bw-trip-cover-grid p {
          padding-left: 18px;
          padding-right: 18px;
        }

        .bw-trip-cover-grid h3 {
          margin-bottom: 8px;
          margin-top: 18px;
        }

        .bw-trip-cover-grid p {
          padding-bottom: 22px;
        }

        .bw-trip-compare {
          background: #EDF7E8;
          isolation: isolate;
          overflow: hidden;
          position: relative;
        }

        .bw-trip-compare::before {
          background-image: var(--compare-image);
          background-position: center;
          background-size: cover;
          content: "";
          filter: blur(18px);
          inset: -32px;
          opacity: 0.76;
          position: absolute;
          transform: scale(1.03);
          z-index: -2;
        }

        .bw-trip-compare::after {
          background:
            linear-gradient(90deg, rgba(250, 250, 245, 0.88) 0%, rgba(250, 250, 245, 0.66) 48%, rgba(237, 247, 232, 0.58) 100%);
          content: "";
          inset: 0;
          position: absolute;
          z-index: -1;
        }

        .bw-trip-compare-grid {
          display: grid;
          gap: 42px;
          grid-template-columns: minmax(0, 0.78fr) minmax(320px, 0.82fr);
        }

        .bw-trip-compare ul {
          display: grid;
          gap: 12px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .bw-trip-compare li {
          background: rgba(255, 255, 255, 0.84);
          border: 1px solid rgba(197, 225, 165, 0.78);
          border-left: 6px solid var(--green);
          border-radius: 10px;
          box-shadow: 0 16px 36px rgba(27, 94, 32, 0.08);
          padding: 16px 18px;
        }

        .bw-trip-compare b {
          color: var(--green);
        }

        .bw-trip-final {
          background: var(--cream);
        }

        .bw-trip-final-box {
          background:
            linear-gradient(135deg, rgba(27, 94, 32, 0.98), rgba(14, 50, 20, 0.98));
          border: 0;
          color: #FFFFFF;
          padding: clamp(30px, 6vw, 58px);
        }

        .bw-trip-final h2,
        .bw-trip-final p {
          color: #FFFFFF;
          max-width: 760px;
        }

        .bw-trip-final p {
          color: rgba(255, 255, 255, 0.84);
        }

        .bw-trip-final .bw-trip-actions {
          margin-bottom: 0;
          margin-top: 30px;
        }

        .bw-trip-final .bw-trip-btn-primary {
          color: var(--green);
        }

        @media (max-width: 960px) {
          .bw-trip-proof,
          .bw-trip-cover-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .bw-trip-planner-head,
          .bw-trip-guide-grid,
          .bw-trip-compare-grid {
            grid-template-columns: 1fr;
          }

          .bw-trip-steps {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .bw-trip-inner {
            width: min(100% - 24px, 1180px);
          }

          .bw-trip-hero {
            min-height: 680px;
          }

          .bw-trip-hero-shade {
            background:
              linear-gradient(180deg, rgba(14, 50, 20, 0.68) 0%, rgba(14, 50, 20, 0.92) 62%, rgba(14, 50, 20, 0.98) 100%);
          }

          .bw-trip-hero-inner {
            padding: 58px 0 34px;
          }

          .bw-trip-proof,
          .bw-trip-cover-grid {
            grid-template-columns: 1fr;
          }

          .bw-trip-actions {
            display: grid;
          }

          .bw-trip-btn {
            width: 100%;
          }

          .bw-trip-planner-band,
          .bw-trip-section {
            padding-left: 0;
            padding-right: 0;
          }

          .bw-trip-widget-shell {
            border-left: 0;
            border-radius: 12px;
            border-right: 0;
            margin-left: 0;
            margin-right: 0;
          }
        }
      `;
    }
  }

  if (!customElements.get('bw-berlin-trip-planner-page')) {
    customElements.define('bw-berlin-trip-planner-page', BWBerlinTripPlannerPage);
  }
})();
