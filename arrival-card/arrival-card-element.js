(function () {
  'use strict';
  const TAG = 'bw-arrival-card';
  if (customElements.get(TAG)) return;
  const CONSENT = 'By clicking “Send me the card”, you agree to receive the Arrival Card and occasional Berlin tips and offers from Walk of Berlin by email. You can unsubscribe at any time.';
  const VERSION = 'berlin-arrival-card-submit-v2-2026-10-04';
  const BASE = new URL('./', document.currentScript.src).href;
  // Consent-gated first-party view measurement (8 Oct 2026). Without analytics
  // consent nothing is sent; the email is never part of an event. view = card
  // rendered, seen = at least half of it on screen for 1 s, start = first
  // focus/input in the form. One of each per page path and placement, so a Wix
  // remount of the same card does not count twice.
  const EVENT_ENDPOINT = 'https://app.berlinwalk.com/api/download-lead?action=event';
  const MEASURE_VERSION = 'arrival-card-measure-v1-2026-10-08';
  const CONSENT_EVENTS = ['consentPolicyChanged', 'consentPolicyInitialized', 'ucConsentEvent', 'bwConsentPolicyChanged'];
  const measured = new Map();
  function consentPolicy() {
    try {
      const manager = window.consentPolicyManager;
      const current = manager && typeof manager.getCurrentConsentPolicy === 'function' ? manager.getCurrentConsentPolicy() : null;
      if (!current || typeof current !== 'object') return {};
      if (current.defaultPolicy === true) {
        const config = window.wixTagManager && typeof window.wixTagManager.getConfig === 'function' ? window.wixTagManager.getConfig() : null;
        if (!config || config.gdprEnforcedGeo !== false) return {};
      }
      return current.policy && typeof current.policy === 'object' ? current.policy : current;
    } catch (error) { return {}; }
  }
  function consentGranted(kind) {
    const policy = consentPolicy();
    const value = policy[kind] !== undefined ? policy[kind] : policy[kind === 'analytics' ? 'anl' : 'adv'];
    return value === true || value === 1 || value === '1' || value === 'true';
  }
  function randomEventId() {
    if (!window.crypto || typeof window.crypto.getRandomValues !== 'function') return '';
    const bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    return 'acv_' + Array.prototype.map.call(bytes, n => n.toString(16).padStart(2, '0')).join('');
  }
  function measureCard(card, root) {
    const pagePath = /^\/[A-Za-z0-9/_-]*$/.test(location.pathname) && location.pathname.length <= 300 ? location.pathname : '/';
    const placement = /^[a-z0-9_-]{1,60}$/.test(card.getAttribute('placement') || '') ? card.getAttribute('placement') : 'pre-footer';
    const key = pagePath + '|' + placement;
    if (!measured.has(key)) measured.set(key, { sent: {}, started: false });
    const state = measured.get(key);
    let visible = false, timer = null, disposed = false;
    function send(stage) {
      if (disposed || !card.isConnected || state.sent[stage] || !consentGranted('analytics') || typeof window.fetch !== 'function') return;
      const eventId = randomEventId();
      if (!eventId) return;
      state.sent[stage] = true;
      const body = {
        eventId, eventName: 'bw_lead_asset_' + stage, assetId: 'berlin-arrival-card',
        analyticsConsent: true, advertisingConsent: consentGranted('advertising'),
        sourceSlug: pagePath.split('/').filter(Boolean).pop() || 'home', pagePath, placement,
        variant: 'brandenburg-split', experiment: MEASURE_VERSION, controlType: stage,
        screenWidth: Math.max(0, Math.min(10000, Number(window.innerWidth) || 0)),
        qa: /(?:^|[?&])bw_qa=1(?:&|$)/.test(location.search.slice(1))
      };
      try {
        window.fetch(EVENT_ENDPOINT, { method: 'POST', credentials: 'omit', keepalive: true, headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
          .then(response => { if (!response || !response.ok) state.sent[stage] = false; })
          .catch(() => { state.sent[stage] = false; });
      } catch (error) { state.sent[stage] = false; }
    }
    function refresh() {
      if (disposed) return;
      if (!card.isConnected) return;
      if (timer !== null) { clearTimeout(timer); timer = null; }
      if (!consentGranted('analytics')) return;
      send('gate_view');
      if (state.started) send('form_start');
      if (visible && document.visibilityState !== 'hidden' && !state.sent.gate_seen) {
        timer = setTimeout(() => { timer = null; if (visible && document.visibilityState !== 'hidden') send('gate_seen'); }, 1000);
      }
    }
    function start() { state.started = true; refresh(); }
    let observer = null;
    function dispose() {
      disposed = true;
      if (timer !== null) clearTimeout(timer);
      if (observer) observer.disconnect();
      CONSENT_EVENTS.forEach(name => { window.removeEventListener(name, refresh); document.removeEventListener(name, refresh); });
      document.removeEventListener('visibilitychange', refresh);
    }
    const form = root.querySelector('form');
    if (form) { form.addEventListener('focusin', start, { once: true }); form.addEventListener('input', start, { once: true }); }
    CONSENT_EVENTS.forEach(name => { window.addEventListener(name, refresh); document.addEventListener(name, refresh); });
    document.addEventListener('visibilitychange', refresh);
    if (typeof window.IntersectionObserver === 'function') {
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => { visible = entry.isIntersecting === true && entry.intersectionRatio >= 0.5; });
        refresh();
      }, { threshold: [0, 0.5] });
      observer.observe(card);
    }
    refresh();
    return dispose;
  }
  class ArrivalCard extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      this.startedAt = new Date().toISOString();
      const root = this.attachShadow({mode:'open'});
      root.innerHTML = `<style>
        :host{display:block;min-width:0;color:#fff;font-family:Montserrat,Arial,sans-serif;--green:#1b5e20;--yellow:#ffe600;--ink:#123d18}*{box-sizing:border-box}[hidden]{display:none!important}
        .card{display:grid;grid-template-columns:45% 55%;background:var(--green);border-radius:22px;overflow:hidden;isolation:isolate}
        .photo{width:100%;height:100%;min-height:390px;object-fit:cover;object-position:49% 50%;display:block}
        .body{padding:24px 28px;align-self:center;min-width:0}.badge{display:inline-block;background:var(--yellow);color:var(--ink);border-radius:12px;padding:7px 11px;font-size:11px;font-weight:800;line-height:1.3;margin:0 0 12px}
        h2{font-size:clamp(28px,2.6vw,32px);font-weight:800;line-height:1.16;letter-spacing:-.025em;margin:0 0 12px;color:#fff}h2 span{display:block}
        .description{font-size:16px;line-height:1.45;margin:0 0 14px;color:#fff}label{display:block;font-size:14px;line-height:1.4;font-weight:600;color:#e3f0dc;margin:0 0 7px}
        .row{display:flex;flex-wrap:wrap;gap:12px;align-items:stretch}input{flex:1 1 220px;font:inherit;font-size:16px;width:100%;min-width:0;border:2px solid transparent;border-radius:8px;background:#fff;color:#212121;min-height:54px;padding:13px 16px}input::placeholder{color:#6b707a;opacity:1}
        button{flex:0 0 auto;appearance:none;border:0;border-radius:999px;padding:15px 24px;min-height:54px;font:inherit;font-size:16px;font-weight:800;line-height:1.3;white-space:nowrap;cursor:pointer;background:var(--yellow);color:var(--ink)}button:hover{background:#ffef53;color:var(--ink)}button:active{background:#f1d900;color:var(--ink)}button:disabled{opacity:.75;cursor:wait;color:var(--ink)}input:focus-visible,button:focus-visible,a:focus-visible{outline:3px solid #fff;outline-offset:4px}input:focus-visible{border-color:var(--yellow)}
        .consent{font-size:14px;line-height:1.45;margin:12px 0 0;color:#fff}.privacy{display:inline-block;margin-top:5px;font-size:14px;color:#fff;text-decoration:underline;text-underline-offset:3px}.status{font-size:14px;line-height:1.5;margin:14px 0 0;color:#fff}.status:empty{display:none}.success{padding:16px 0;font-size:17px;line-height:1.6;color:#fff}.success strong{display:block;font-size:24px;line-height:1.3;margin-bottom:10px}.trap{position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden}
        :host([compact]) .card{grid-template-columns:34% 66%}:host([compact]) .photo{min-height:400px}:host([compact]) .body{padding:28px}:host([compact]) h2{font-size:30px}:host([compact]) .description{font-size:16px}:host([compact]) .row{flex-wrap:wrap}:host([compact]) input{flex:1 1 210px}:host([compact]) button{flex:0 0 auto}
        @media(max-width:760px){.card,:host([compact]) .card{grid-template-columns:1fr}.photo,:host([compact]) .photo{height:180px;min-height:0;object-position:50% 44%}.body,:host([compact]) .body{padding:22px 20px}.badge{font-size:11px;margin-bottom:14px}h2,:host([compact]) h2{font-size:26px;line-height:1.16}.description,:host([compact]) .description{font-size:15px;margin-bottom:18px}.row,:host([compact]) .row{display:grid;grid-template-columns:1fr}button{width:100%}.consent{font-size:12px}.privacy{font-size:13px}}
      </style><section class="card" aria-labelledby="arrival-title"><img class="photo" src="${BASE}brandenburg-gate.jpg" width="3000" height="2000" alt="Brandenburg Gate in warm evening light" loading="lazy" decoding="async"><div class="body"><p class="badge">FREE BERLIN ARRIVAL CARD</p><h2 id="arrival-title">Arriving in Berlin?<span>Save my Arrival Card.</span></h2><p class="description">BER transport, ticket choices and late-arrival options in one card you can save on your phone.</p><form><label for="arrival-email">Email address</label><div class="row"><input id="arrival-email" name="email" type="email" inputmode="email" autocomplete="email" autocapitalize="none" spellcheck="false" placeholder="Your email address" required maxlength="320" aria-describedby="arrival-consent arrival-status"><button type="submit">Send me the card</button></div><div class="trap" aria-hidden="true"><label for="arrival-website">Website</label><input id="arrival-website" name="website" tabindex="-1" autocomplete="off"></div><p class="consent" id="arrival-consent">${CONSENT}</p><a class="privacy" href="https://walkofberlin.com/privacy-policy" target="_blank" rel="noopener">Privacy Policy</a></form><div class="success" hidden role="status" aria-live="polite"><strong>Check your inbox.</strong>Open the email link to get your Arrival Card. For a first request, that link also confirms your email. If it is missing, check your spam folder.</div><p class="status" id="arrival-status" role="status" aria-live="polite"></p></div></section>`;
      const form=root.querySelector('form'), email=root.querySelector('[name=email]'), button=root.querySelector('button'), status=root.querySelector('.status');
      this.disposeMeasure = measureCard(this, root);
      form.addEventListener('submit', async event => {
        event.preventDefault();
        if (this.sending || !form.reportValidity()) return;
        const submittedAt = new Date().toISOString();
        if (Date.parse(submittedAt)-Date.parse(this.startedAt)<750) {status.textContent='Please enter your email, then try again.';return;}
        this.sending=true;button.disabled=true;button.textContent='Sending…';form.setAttribute('aria-busy','true');status.textContent='';
        try {
          const endpoint=this.getAttribute('api-base')||'https://app.berlinwalk.com/api/download-lead';
          const response=await fetch(endpoint+'?action=submit',{method:'POST',credentials:'include',headers:{'content-type':'application/json'},body:JSON.stringify({email:email.value.trim().toLowerCase(),consent:true,consentVersion:VERSION,consentMethod:'submit_button_with_visible_disclosure',assetId:'berlin-arrival-card',assetVersion:'2026-10-v2',sourceSlug:location.pathname.split('/').filter(Boolean).pop()||'home',pagePath:location.pathname,sourceUrl:location.origin+location.pathname,placement:this.getAttribute('placement')||'pre-footer',variant:'brandenburg-split',analyticsConsentAtSubmit:false,advertisingConsent:false,website:root.querySelector('[name=website]').value,startedAt:this.startedAt,submittedAt})});
          const result=await response.json();
          if(!response.ok || result.ok===false) throw new Error('submit_failed');
          form.hidden=true;root.querySelector('.success').hidden=false;
        } catch {status.textContent='I could not send the confirmation email. Please try again.';this.sending=false;button.disabled=false;button.textContent='Send me the card';}
        finally {form.setAttribute('aria-busy','false');}
      });
    }
  }
  customElements.define(TAG,ArrivalCard);
})();
