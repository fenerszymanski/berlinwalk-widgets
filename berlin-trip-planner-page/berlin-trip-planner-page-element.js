(function () {
  const SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : "";
  const BASE_URL = SCRIPT_URL
    ? new URL("../", SCRIPT_URL).toString()
    : "https://fenerszymanski.github.io/berlinwalk-widgets/";
  const V4_ORIGIN = "https://planner.berlinwalk.com";
  const V4_EXPERIMENT_KEY = "planner_landing_dates_v2";
  const V4_ASSIGNMENT_COOKIE = "bw_planner_landing_v2";
  const V4_ASSIGNMENT_STORAGE = "bw_planner_landing_v2";
  const WIX_CANONICAL_ORIGIN = "https://www.berlinwalk.com";
  const MAX_AGE_SECONDS = 60 * 60 * 24 * 180;
  const CTA_LOCATIONS = new Set(["hero", "hero_dates", "hero_no_dates", "pricing_1_2", "pricing_3_4", "pricing_5_7", "deliverable", "how_it_works"]);
  const CANONICAL_SCHEMA_ID = "bw-trip-planner-webapp-jsonld";
  const impressionTrackedElements = new WeakSet();

  const asset = (path) => new URL(path, V4_ORIGIN + "/").toString();
  const pageAsset = (path) => new URL(path, BASE_URL).toString();
  const UUID_SHAPE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  function escapeAttribute(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function normalizeVisitorId(value) {
    const normalized = String(value || "").trim().toLowerCase();
    return UUID_SHAPE.test(normalized) ? normalized : "";
  }

  function variantForVisitor(visitorId) {
    const normalized = normalizeVisitorId(visitorId);
    if (!normalized) return "a";
    return Number.parseInt(normalized[0], 16) >= 8 ? "b" : "a";
  }

  function cookieValue(name) {
    try {
      const prefix = `${name}=`;
      const entry = String(document.cookie || "").split(";").map((item) => item.trim()).find((item) => item.startsWith(prefix));
      return entry ? decodeURIComponent(entry.slice(prefix.length)) : "";
    } catch (error) {
      return "";
    }
  }

  function readStorageValue() {
    try {
      return window.localStorage ? normalizeVisitorId(window.localStorage.getItem(V4_ASSIGNMENT_STORAGE)) : "";
    } catch (error) {
      return "";
    }
  }

  function randomVisitorId() {
    try {
      if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
      if (window.crypto && typeof window.crypto.getRandomValues === "function") {
        const bytes = new Uint8Array(16);
        window.crypto.getRandomValues(bytes);
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
        return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
      }
    } catch (error) {
      return "";
    }
    return "";
  }

  function persistVisitorId(visitorId) {
    const normalized = normalizeVisitorId(visitorId);
    if (!normalized) return;
    try {
      document.cookie = `${V4_ASSIGNMENT_COOKIE}=${encodeURIComponent(normalized)}; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`;
    } catch (error) {}
    try {
      if (window.localStorage) window.localStorage.setItem(V4_ASSIGNMENT_STORAGE, normalized);
    } catch (error) {}
  }

  function validVariant(value) {
    return value === "a" || value === "b" ? value : "";
  }

  function resolveAssignment() {
    let params;
    try { params = new URLSearchParams(window.location.search || ""); } catch (error) { params = new URLSearchParams(); }
    const override = validVariant(params.get("landing_variant"));
    if (override) return { variant: override, visitorId: "", isQa: true };
    if (!assignmentConsent()) {
      const visitorId = normalizeVisitorId(randomVisitorId());
      return { variant: variantForVisitor(visitorId), visitorId, isQa: false };
    }
    const existing = normalizeVisitorId(cookieValue(V4_ASSIGNMENT_COOKIE)) || readStorageValue();
    const visitorId = existing || randomVisitorId();
    if (visitorId) persistVisitorId(visitorId);
    return { variant: variantForVisitor(visitorId), visitorId, isQa: false };
  }

  function analyticsConsent() {
    try {
      const manager = window.consentPolicyManager;
      const current = manager && typeof manager.getCurrentConsentPolicy === "function" ? manager.getCurrentConsentPolicy() : null;
      const policy = current && (current.policy || current);
      return policy && policy.analytics === true;
    } catch (error) {
      return false;
    }
  }

  function functionalConsent() {
    try {
      const manager = window.consentPolicyManager;
      const current = manager && typeof manager.getCurrentConsentPolicy === "function" ? manager.getCurrentConsentPolicy() : null;
      const policy = current && (current.policy || current);
      return policy && policy.functional === true;
    } catch (error) {
      return false;
    }
  }

  function assignmentConsent() {
    return functionalConsent() || analyticsConsent();
  }

  function validIsoDate(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));
  }

  function encodeDateFragment(arrivalDate, departureDate) {
    const arrival = validIsoDate(arrivalDate) ? arrivalDate : "";
    const departure = validIsoDate(departureDate) ? departureDate : "";
    if (!arrival && !departure) return "";
    return `#planner-dates=${encodeURIComponent(`${arrival},${departure}`)}`;
  }

  function safePlannerUrl(variant, dates) {
    const url = new URL("/planner-v4", V4_ORIGIN);
    url.searchParams.set("landing_variant", variant === "b" ? "b" : "a");
    url.searchParams.set("entry", "start");
    url.searchParams.set("source", "wix_native_berlin_trip_planner");
    if (analyticsConsent()) {
      try {
        const current = new URLSearchParams(window.location.search || "");
        ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((key) => {
          const value = String(current.get(key) || "").slice(0, 120);
          if (value) url.searchParams.set(key, value);
        });
      } catch (error) {}
    }
    url.hash = encodeDateFragment(dates && dates.arrivalDate, dates && dates.departureDate).replace(/^#/, "");
    return url.toString();
  }

  function trackNativeEvent(eventName, payload) {
    if (!analyticsConsent()) return;
    const detail = payload && typeof payload === "object" ? payload : {};
    const allowed = {
      experiment: V4_EXPERIMENT_KEY,
      variant: detail.variant === "b" ? "b" : "a",
      ...(eventName === "Planner LP Start" ? {
        entry: ["cta", "dates", "no_dates"].includes(detail.entry) ? detail.entry : "cta",
        location: CTA_LOCATIONS.has(detail.location) ? detail.location : "hero"
      } : {})
    };
    try {
      window.dataLayer = window.dataLayer || [];
      if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: eventName, ...allowed });
    } catch (error) {}
  }

  function icon(name) {
    const paths = {
      map: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 3 6 3v15l-6-3-6 3V6l6-3Z"/><path d="M9 3v15M15 6v15"/>',
      train: '<rect width="16" height="14" x="4" y="3" rx="2"/><path d="M4 11h16M8 17l-2 3M16 17l2 3M8 7h.01M16 7h.01"/>',
      calendar: '<path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z"/><path d="m8 16 2 2 5-5"/>',
      food: '<path d="M3 2v7a4 4 0 0 0 4 4V2M7 13v9M3 6h4M14 2v20M18 2v20M14 8h4a4 4 0 0 0-4-4"/>',
      files: '<path d="M15 2H6a2 2 0 0 0-2 2v14h11a2 2 0 0 0 2-2V4l-2-2Z"/><path d="M13 2v4h4M8 10h5M8 14h5"/><path d="M18 7h1a2 2 0 0 1 2 2v11H10"/>',
      euro: '<circle cx="12" cy="12" r="9"/><path d="M8 10h7M8 14h6M9 7.5A4.5 4.5 0 0 0 9 16.5"/>'
    };
    return `<svg class="bw-v4-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" data-icon-family="lucide">${paths[name] || paths.map}</svg>`;
  }

  class BWBerlinTripPlannerPage extends HTMLElement {
    connectedCallback() {
      this._assignment = resolveAssignment();
      this._impressionTracked = impressionTrackedElements.has(this);
      this._consentHandler = () => {
        if (assignmentConsent() && !this._assignment.isQa) {
          if (!this._assignment.visitorId) this._assignment.visitorId = normalizeVisitorId(randomVisitorId());
          if (this._assignment.visitorId) persistVisitorId(this._assignment.visitorId);
        }
        this._maybeTrackImpression();
      };
      this.dataset.bwV4Experiment = V4_EXPERIMENT_KEY;
      this.dataset.bwV4Variant = this._assignment.variant;
      this._render();
      this._syncCanonicalSchema();
      this._maybeTrackImpression();
      this._bind();
      document.addEventListener("consentPolicyChanged", this._consentHandler);
      document.addEventListener("consentPolicyInitialized", this._consentHandler);
      this._setupWixTopGapGuard();
    }

    disconnectedCallback() {
      if (this._consentHandler) {
        document.removeEventListener("consentPolicyChanged", this._consentHandler);
        document.removeEventListener("consentPolicyInitialized", this._consentHandler);
      }
      if (this._gapResizeHandler) {
        window.removeEventListener("resize", this._gapResizeHandler);
        if (window.visualViewport) window.visualViewport.removeEventListener("resize", this._gapResizeHandler);
      }
      if (this._gapResizeObserver) this._gapResizeObserver.disconnect();
      if (this._gapLoadHandler) window.removeEventListener("load", this._gapLoadHandler);
      if (this._gapFontsHandler && document.fonts) document.fonts.removeEventListener("loadingdone", this._gapFontsHandler);
      if (this._gapTimers) this._gapTimers.forEach((timer) => window.clearTimeout(timer));
    }

    _maybeTrackImpression() {
      if (this._impressionTracked || this._assignment.isQa || !analyticsConsent()) return;
      this._impressionTracked = true;
      impressionTrackedElements.add(this);
      trackNativeEvent("Planner LP Impression", { variant: this._assignment.variant });
    }

    _syncCanonicalSchema() {
      // Wix SEO HEAD owns this exact script in the published page. Never rewrite
      // an existing owner from the native element: two writers would ping-pong
      // textContent through their observers and starve the page event loop.
      if (document.getElementById(CANONICAL_SCHEMA_ID)) return;
      const canonicalUrl = "https://www.berlinwalk.com/berlin-trip-planner";
      const webAppId = `${canonicalUrl}#webapp`;
      const fullPlanId = `${canonicalUrl}#full-plan`;
      const entriesFrom = (parsed) => {
        if (Array.isArray(parsed)) return parsed.flatMap((entry) => entriesFrom(entry));
        if (parsed && typeof parsed === "object" && Array.isArray(parsed["@graph"])) return parsed["@graph"].filter(Boolean);
        return parsed && typeof parsed === "object" ? [parsed] : [];
      };
      const typeIncludes = (entry, type) => Array.isArray(entry?.["@type"]) ? entry["@type"].includes(type) : entry?.["@type"] === type;
      const isStalePlannerEntry = (entry, script) => {
        if (!entry || typeof entry !== "object") return false;
        if (typeIncludes(entry, "WebPage")) return false;
        const id = String(entry["@id"] || "");
        const name = String(entry.name || "").trim().toLowerCase();
        if (id === webAppId || id === fullPlanId) return true;
        if (typeIncludes(entry, "WebApplication") && (entry.url === canonicalUrl || name === "berlin trip planner")) return true;
        if (typeIncludes(entry, "Product") && (id === fullPlanId || name === "berlin trip planner full plan")) return true;
        return false;
      };
      const webPages = [];
      this._canonicalWebPageCache = this._canonicalWebPageCache || new Map();
      const externalWebPageIds = new Set();
      const unrelatedEntries = [];
      const addUnique = (list, entry) => {
        const identity = entry && typeof entry === "object" ? String(entry["@id"] || "") : "";
        if (identity ? list.some((item) => String(item?.["@id"] || "") === identity) : list.some((item) => JSON.stringify(item) === JSON.stringify(entry))) return;
        list.push(entry);
      };
      const rememberWebPage = (entry) => {
        if (entry && typeof entry === "object" && entry["@id"]) {
          this._canonicalWebPageCache.set(String(entry["@id"]), entry);
        }
        addUnique(webPages, entry);
      };
      let ownScript = null;
      const scripts = Array.from(document.querySelectorAll("head script[type='application/ld+json'], body script[type='application/ld+json']"));
      scripts.forEach((script) => {
        let parsed = null;
        try { parsed = JSON.parse(script.textContent || "{}"); } catch (error) { parsed = null; }
        const entries = entriesFrom(parsed);
        const isOwn = script === ownScript || script.getAttribute("data-bw-v4-canonical-schema") === "true";
        const staleEntries = entries.filter((entry) => isStalePlannerEntry(entry, script));
        const nonStaleEntries = entries.filter((entry) => !isStalePlannerEntry(entry, script));
        const staleUnparseable = !parsed && (script.id === CANONICAL_SCHEMA_ID || String(script.textContent || "").includes(fullPlanId));
        if (!isOwn && staleEntries.length === 0 && !staleUnparseable) {
          entries.filter((entry) => typeIncludes(entry, "WebPage") && entry["@id"]).forEach((entry) => externalWebPageIds.add(String(entry["@id"])));
        }
        if (isOwn || staleEntries.length > 0 || staleUnparseable) {
          nonStaleEntries.forEach((entry) => {
            if (typeIncludes(entry, "WebPage")) rememberWebPage(entry);
            else addUnique(unrelatedEntries, entry);
          });
        }
        if (!isOwn && (staleEntries.length > 0 || staleUnparseable)) script.remove();
      });
      if (!ownScript) {
        ownScript = document.createElement("script");
        ownScript.id = CANONICAL_SCHEMA_ID;
        ownScript.type = "application/ld+json";
        ownScript.dataset.bwV4CanonicalSchema = "true";
      } else {
        ownScript.dataset.bwV4CanonicalSchema = "true";
        ownScript.type = "application/ld+json";
      }
      for (const entry of this._canonicalWebPageCache.values()) addUnique(webPages, entry);
      const webApplication = {
        "@type": "WebApplication",
        "@id": webAppId,
        name: "Berlin Trip Planner",
        url: canonicalUrl,
        applicationCategory: "TravelApplication",
        operatingSystem: "Web",
        isAccessibleForFree: false,
        description: "Build a practical 1–7 day Berlin itinerary around your dates, pace, interests, food preferences and fixed plans. One price for the whole trip.",
        publisher: { "@type": "Organization", name: "BerlinWalk", url: "https://www.berlinwalk.com" },
        offers: {
          "@type": "AggregateOffer",
          lowPrice: "7.99",
          highPrice: "15.99",
          priceCurrency: "EUR",
          offerCount: 3,
          offers: [
            { "@type": "Offer", price: "7.99", priceCurrency: "EUR", name: "1–2 calendar days" },
            { "@type": "Offer", price: "11.99", priceCurrency: "EUR", name: "3–4 calendar days" },
            { "@type": "Offer", price: "15.99", priceCurrency: "EUR", name: "5–7 calendar days" }
          ]
        }
      };
      const canonicalWebPages = webPages.filter((entry) => !entry["@id"] || !externalWebPageIds.has(String(entry["@id"])));
      const schemaText = JSON.stringify({ "@context": "https://schema.org", "@graph": [...canonicalWebPages, ...unrelatedEntries, webApplication] });
      if (ownScript.textContent !== schemaText) ownScript.textContent = schemaText;
      if (ownScript.parentNode !== document.head) document.head.appendChild(ownScript);
    }

    _render() {
      const variant = this._assignment.variant;
      const webProof = pageAsset("berlin-trip-planner-page/assets/planner-proof-web-itinerary.png");
      const pdfProofDayOne = pageAsset("berlin-trip-planner-page/assets/planner-proof-pdf-page-02.png");
      const pdfProofDayTwo = pageAsset("berlin-trip-planner-page/assets/planner-proof-pdf-page-04.png");
      const hero = asset("assets/berlin-spree-sunset-hero.jpg");
      const photos = [
        [asset("assets/planner-lp-brandenburg-gate.jpg"), "Brandenburg Gate in quiet morning light", "The historic centre", "Brandenburg Gate gives a first day its clearest Berlin anchor."],
        [asset("assets/planner-lp-oranienstrasse.jpg"), "Street art and everyday life on Oranienstraße in Kreuzberg", "A neighbourhood with texture", "Oranienstraße shows the street-level Berlin that a route can make room for."],
        [asset("assets/planner-lp-maybachufer-market.jpg"), "Crowded Turkish market stalls at Maybachufer in Berlin", "Food and markets", "Maybachufer is a real market stop when the day, date and opening pattern fit."]
      ];
      const benefits = [
        ["map", "A practical day-by-day itinerary", "Your dates, pace, interests and fixed plans become one ordered route."],
        ["train", "Travel time you can use", "Movement is shown with realistic allowances and public-transport or Maps links."],
        ["calendar", "Opening and route checks", "Opening days, route order and date-specific event suggestions are checked when available."],
        ["food", "Food suggestions that stay honest", "Nearby food suggestions are shown when verified and available."],
        ["files", "One itinerary, two useful formats", "Use a private Web plan or keep a readable PDF built from the same itinerary."],
        ["euro", "Clear rough costs", "See known admission estimates and meal price levels without pretending they are exact totals."]
      ];
      const priceCards = [
        ["1–2 days", "€7.99", "A short Berlin break"],
        ["3–4 days", "€11.99", "A long weekend or city break"],
        ["5–7 days", "€15.99", "A longer Berlin stay"]
      ];
      const faq = [
        ["How is the price set?", "One whole-trip price is based on 1–2, 3–4 or 5–7 calendar days. It is not per person and there is no subscription."],
        ["What do I receive?", "A practical itinerary, travel-time and public-transport or Maps links, opening-day checks, dated event suggestions when verified, a Plan note when provider-backed information is available, plus a private Web plan and readable PDF from the same itinerary."],
        ["Can I add reservations and preferences?", "Yes. Add fixed reservations, interests, pace, food and mobility preferences; they guide the plan and stay visible in your review."],
        ["What is the optional BerlinWalk choice?", "It is an optional recommendation, not a booking. Recheck official details and availability before travel."]
      ];
      const dateEntry = variant === "b" ? `
        <div class="bw-v4-date-entry" aria-label="Optional trip dates">
          <label><span>Arrival date</span><input data-bw-v4-arrival type="date" autocomplete="off"></label>
          <label><span>Departure date</span><input data-bw-v4-departure type="date" autocomplete="off"></label>
        </div>` : "";
      const startButton = (label, entry, className, location = "hero") => `<a class="${className}" data-bw-v4-start data-entry="${entry}" data-location="${location}" href="${safePlannerUrl(variant, {})}">${label}</a>`;

      this.innerHTML = `
        <style>${this._styles()}</style>
        <main id="bw-v4-top" class="bw-v4-native" data-bw-v4-variant="${variant}" aria-labelledby="bw-v4-title">
          <header class="bw-v4-header">
            <nav aria-label="Plan information"><a href="#bw-v4-includes">What it includes</a><a href="#bw-v4-pricing">Pricing</a></nav>
          </header>
          <section class="bw-v4-hero" style="--bw-v4-hero:url('${hero}')">
            <div class="bw-v4-hero-copy">
              <span class="bw-v4-eyebrow">BerlinWalk trip planning</span>
              <h1 id="bw-v4-title">One clear Berlin plan instead of 40 open tabs.</h1>
              <p>Add your dates, pace, priorities, food preferences and fixed plans. I turn them into a practical Berlin itinerary that you can actually follow.</p>
              ${dateEntry}
              <div class="bw-v4-actions">
                ${startButton("Start my Berlin plan", variant === "b" ? "dates" : "cta", "bw-v4-primary", variant === "b" ? "hero_dates" : "hero")}
                <a class="bw-v4-secondary" href="#bw-v4-includes">See what a plan includes</a>
              </div>
              ${variant === "b" ? `<button type="button" class="bw-v4-date-skip" data-bw-v4-no-dates data-location="hero_no_dates">Dates not fixed yet? Start without dates</button>` : ""}
              <p class="bw-v4-trust">Made by Yusuf, the guide behind BerlinWalk. I keep the route useful, the timing realistic and the claims easy to check.</p>
            </div>
            <aside class="bw-v4-mini-plan" aria-label="Example plan preview">
              <span class="bw-v4-card-kicker">Example plan</span><strong>13–18 August · 6 calendar days</strong>
              <div><b>Day 1</b><span>Arrival → Mitte · Museum Island edge</span></div>
              <div><b>Day 2</b><span>Brandenburg Gate · Government Quarter</span></div>
              <div><b>Day 3</b><span>Berlin Wall Memorial · East Side Gallery</span></div>
              <small>Web plan + same-itinerary PDF</small>
            </aside>
          </section>
          <section class="bw-v4-how" id="bw-v4-how" aria-labelledby="bw-v4-how-title">
            <div class="bw-v4-how-intro">
              <span class="bw-v4-eyebrow">HOW IT WORKS</span>
              <h2 id="bw-v4-how-title" aria-label="Tell me four things. I’ll build the route.">Tell me<br>four things.<br>I’ll build<br>the route.</h2>
              <p>It takes about two minutes, and optional details can stay optional.</p>
              ${startButton("Start my Berlin plan", variant === "b" ? "dates" : "cta", "bw-v4-how-cta", "how_it_works")}
            </div>
            <div class="bw-v4-how-rail">
              <ol class="bw-v4-how-list" aria-label="Four short steps">
                <li><span class="bw-v4-how-dot" aria-hidden="true"></span><span class="bw-v4-how-number">01</span><div><h3>When are you in Berlin?</h3><p>Add arrival, departure and your stay area.</p></div></li>
                <li><span class="bw-v4-how-dot" aria-hidden="true"></span><span class="bw-v4-how-number">02</span><div><h3>Who is coming?</h3><p>Choose the number of travellers and a comfortable pace.</p></div></li>
                <li><span class="bw-v4-how-dot" aria-hidden="true"></span><span class="bw-v4-how-number">03</span><div><h3>What matters most?</h3><p>Add interests, must-sees and fixed plans.</p></div></li>
                <li><span class="bw-v4-how-dot" aria-hidden="true"></span><span class="bw-v4-how-number">04</span><div><h3>What do you like to eat?</h3><p>Choose breakfast, cuisines, diet and spending style.</p></div></li>
              </ol>
              <div class="bw-v4-how-result"><strong>Then I turn your answers into one practical Web plan + matching PDF.</strong></div>
            </div>
          </section>
          <section class="bw-v4-deliverable" id="bw-v4-proof" aria-labelledby="bw-v4-proof-title">
            <div class="bw-v4-deliverable-copy">
              <span class="bw-v4-deliverable-eyebrow">THE DELIVERABLE</span>
              <h2 id="bw-v4-proof-title">Your route in your pocket. Your plan on paper.</h2>
              <p class="bw-v4-deliverable-intro">Use the private Web plan as you move through Berlin, then keep the same itinerary as a clean, printable PDF.</p>
              <div class="bw-v4-deliverable-formats" aria-label="Two matching itinerary formats">
                <div><strong>Use now —</strong><span>private Web plan</span></div>
                <div><strong>Keep later —</strong><span>matching PDF</span></div>
              </div>
              <p class="bw-v4-deliverable-proof">Same places · Same timing · Same useful details</p>
              ${startButton("Plan my Berlin trip", "cta", "bw-v4-deliverable-cta", "deliverable")}
            </div>
            <div class="bw-v4-deliverable-visuals" aria-label="Same itinerary shown as Web plan and PDF pages">
              <figure class="bw-v4-deliverable-web"><img src="${webProof}" alt="Private Berlin itinerary Web plan showing the daily itinerary" loading="lazy"><figcaption>Private Web plan</figcaption></figure>
              <div class="bw-v4-deliverable-pdf-stack">
                <figure class="bw-v4-deliverable-pdf bw-v4-deliverable-pdf-back"><img src="${pdfProofDayOne}" alt="Matching Berlin itinerary PDF page for day one" loading="lazy"><figcaption>Matching PDF · Day 1</figcaption></figure>
                <figure class="bw-v4-deliverable-pdf bw-v4-deliverable-pdf-front"><img src="${pdfProofDayTwo}" alt="Matching Berlin itinerary PDF page for day two" loading="lazy"><figcaption>Matching PDF · Day 2</figcaption></figure>
                <span class="bw-v4-deliverable-connector" aria-hidden="true"><span>ONE ITINERARY</span></span>
              </div>
            </div>
          </section>
          <section class="bw-v4-section" id="bw-v4-includes" aria-labelledby="bw-v4-includes-title"><div class="bw-v4-section-heading"><span class="bw-v4-eyebrow">What it includes</span><h2 id="bw-v4-includes-title">A useful plan, not another list of tabs.</h2></div><div class="bw-v4-benefit-grid">${benefits.map(([name, title, copy]) => `<article><span class="bw-v4-icon-box">${icon(name)}</span><h3>${title}</h3><p>${copy}</p></article>`).join("")}</div></section>
          <section class="bw-v4-section bw-v4-photo-section" aria-labelledby="bw-v4-photo-title"><div class="bw-v4-section-heading"><span class="bw-v4-eyebrow">Berlin, with room to choose</span><h2 id="bw-v4-photo-title">A plan should leave space for the city itself.</h2></div><div class="bw-v4-photo-grid">${photos.map(([src, alt, title, copy]) => `<figure><img src="${src}" alt="${escapeAttribute(alt)}" loading="lazy"><figcaption><strong>${title}</strong><span>${copy}</span></figcaption></figure>`).join("")}</div></section>
          <section class="bw-v4-section" id="bw-v4-pricing" aria-labelledby="bw-v4-pricing-title"><div class="bw-v4-section-heading"><span class="bw-v4-eyebrow">Whole-trip pricing</span><h2 id="bw-v4-pricing-title">One clear price for the calendar days you choose.</h2><p>Not per person. No subscription.</p></div><div class="bw-v4-price-grid">${priceCards.map(([days, amount, note], index) => `<article class="${index === 1 ? "is-featured" : ""}"><span>${days}</span><strong>${amount}</strong><small>${note}</small>${startButton("Choose my dates", "cta", "bw-v4-price-cta", `pricing_${days.replace(/[^0-9–]/g, "").replace("–", "_")}`)}</article>`).join("")}</div></section>
          <section class="bw-v4-section bw-v4-faq" aria-labelledby="bw-v4-faq-title"><div class="bw-v4-section-heading"><span class="bw-v4-eyebrow">A few clear answers</span><h2 id="bw-v4-faq-title">Before you start.</h2></div>${faq.map(([question, answer]) => `<details><summary>${question}</summary><p>${answer}</p></details>`).join("")}</section>
          <footer class="bw-v4-footer"><span>BerlinWalk · practical Berlin planning by Yusuf</span><div><a href="https://berlinwalk.com" target="_blank" rel="noopener noreferrer">berlinwalk.com</a><a href="https://www.instagram.com/berlinwalkingtour/" target="_blank" rel="noopener noreferrer">@berlinwalkingtour</a></div><details><summary>Image credits</summary><div class="bw-v4-credits"><p>Hero: <a href="https://commons.wikimedia.org/wiki/File:-Sunset_on_Oberbaumbr%C3%BCcke-_(43668194515).jpg" target="_blank" rel="noopener noreferrer">Oberbaumbrücke sunset</a> by Guido from Berlin, CC BY 2.0.</p><p>Historic centre: <a href="https://commons.wikimedia.org/wiki/File:Brandenburger_Tor_morgens.jpg" target="_blank" rel="noopener noreferrer">Brandenburg Gate</a> by Thomas Wolf, CC BY-SA 3.0.</p><p>Neighbourhood: <a href="https://commons.wikimedia.org/wiki/File:Mural_Nature_Morte_ROA_Oranienstra%C3%9Fe_Berlin-Kreuzberg.jpg" target="_blank" rel="noopener noreferrer">Oranienstraße mural</a> by Singlespeedfahrer, CC0.</p><p>Food: <a href="https://commons.wikimedia.org/wiki/File:Maybachufer_Turkish_market_2.jpg" target="_blank" rel="noopener noreferrer">Maybachufer Turkish market</a> by Orderinchaos, CC BY-SA 4.0.</p></div></details></footer>
        </main>
      `;
    }

    _syncPlannerLinks() {
      const arrival = this.querySelector("[data-bw-v4-arrival]")?.value || "";
      const departure = this.querySelector("[data-bw-v4-departure]")?.value || "";
      const href = safePlannerUrl(this._assignment.variant, { arrivalDate: arrival, departureDate: departure });
      this.querySelectorAll("[data-bw-v4-start]").forEach((link) => link.setAttribute("href", href));
    }

    _bind() {
      this.querySelectorAll("[data-bw-v4-arrival], [data-bw-v4-departure]").forEach((input) => input.addEventListener("input", () => this._syncPlannerLinks()));
      this.querySelectorAll("[data-bw-v4-start]").forEach((link) => link.addEventListener("click", (event) => {
        event.preventDefault();
        const entry = link.getAttribute("data-entry") || "cta";
        if (!this._assignment.isQa) trackNativeEvent("Planner LP Start", {
          variant: this._assignment.variant,
          entry,
          location: link.getAttribute("data-location") || "hero"
        });
        this._navigateToPlanner(entry === "dates");
      }));
      const noDates = this.querySelector("[data-bw-v4-no-dates]");
      if (noDates) noDates.addEventListener("click", () => {
        if (!this._assignment.isQa) trackNativeEvent("Planner LP Start", { variant: this._assignment.variant, entry: "no_dates", location: noDates.getAttribute("data-location") || "hero_no_dates" });
        this._navigateToPlanner(false);
      });
      this._syncPlannerLinks();
    }

    _navigateToPlanner(includeDates) {
      const dates = includeDates
        ? { arrivalDate: this.querySelector("[data-bw-v4-arrival]")?.value || "", departureDate: this.querySelector("[data-bw-v4-departure]")?.value || "" }
        : {};
      window.location.assign(safePlannerUrl(this._assignment.variant, dates));
    }

    _setupWixTopGapGuard() {
      const splitGridTracks = (value) => {
        const tracks = [];
        let depth = 0;
        let start = 0;
        for (let index = 0; index < value.length; index += 1) {
          const character = value[index];
          if (character === "(") depth += 1;
          if (character === ")") depth = Math.max(0, depth - 1);
          if (/\s/.test(character) && depth === 0) {
            if (value.slice(start, index).trim()) tracks.push(value.slice(start, index).trim());
            start = index + 1;
          }
        }
        if (value.slice(start).trim()) tracks.push(value.slice(start).trim());
        return tracks;
      };
      const layoutChain = () => {
        const component = document.getElementById("comp-mq1axvyp");
        const host = component && (component === this || component.contains?.(this)) ? component : this;
        const nodes = [this];
        if (host !== this) nodes.push(host);
        let node = host.parentElement;
        for (let depth = 0; node && depth < 7 && node !== document.body && node !== document.documentElement; depth += 1, node = node.parentElement) {
          nodes.push(node);
          if (node.classList?.contains("pidtg-container") || node.id === "pidtg") break;
        }
        return { host, nodes };
      };
      let ownedGrid = null;
      let ownedGridRows = "";
      const ownedInnerGridRows = new Map();
      const sync = () => {
        const native = this.querySelector(".bw-v4-native");
        const { host, nodes } = layoutChain();
        const reset = (node) => {
          if (!node || node === document.body || node === document.documentElement) return;
          node.style.alignSelf = "start";
          node.style.justifySelf = "stretch";
          node.style.alignItems = "start";
          node.style.justifyItems = "stretch";
          node.style.width = "100%";
          node.style.maxWidth = "100%";
          node.style.minWidth = "0";
          node.style.minHeight = "0px";
          node.style.maxHeight = "none";
          node.style.height = "auto";
          node.style.overflowX = "clip";
        };
        nodes.slice(0, 4).forEach(reset);
        const section = nodes.find((node) => node.tagName === "SECTION" && (node.id.startsWith("comp-") || String(node.className || "").includes("wixui-section")));
        const grid = nodes.find((node) => String(node.className || "").includes("pidtg-container") || node.id === "pidtg");
        for (const [innerGrid, ownedRows] of ownedInnerGridRows) {
          if (innerGrid.style.gridTemplateRows === ownedRows) innerGrid.style.gridTemplateRows = "";
        }
        ownedInnerGridRows.clear();
        const innerGrids = nodes.filter((node) => {
          if (node === grid || node === section) return false;
          const className = String(node.className || "");
          return className.includes("max-width-container") || (className.includes("wixui-box") && className.includes("-container"));
        });
        for (const innerGrid of innerGrids) {
          innerGrid.style.gridAutoRows = "auto";
          innerGrid.style.height = "auto";
          innerGrid.style.minHeight = "0px";
          innerGrid.style.maxHeight = "none";
          innerGrid.style.gridTemplateRows = "auto";
          ownedInnerGridRows.set(innerGrid, "auto");
        }
        if (section) {
          section.style.height = "auto";
          section.style.minHeight = "0px";
          section.style.maxHeight = "none";
        }
        if (grid) {
          if (ownedGrid === grid && grid.style.gridTemplateRows === ownedGridRows) {
            grid.style.gridTemplateRows = "";
          }
          const computed = getComputedStyle(grid);
          const tracks = splitGridTracks(computed.gridTemplateRows);
          const sectionRow = section ? Number.parseInt(getComputedStyle(section).gridRowStart, 10) - 1 : -1;
          if (tracks.length && sectionRow >= 0 && sectionRow < tracks.length) {
            tracks[sectionRow] = "auto";
            ownedGridRows = tracks.join(" ");
            ownedGrid = grid;
            grid.style.gridTemplateRows = ownedGridRows;
          }
          grid.style.gridAutoRows = "auto";
          grid.style.height = "auto";
          grid.style.minHeight = "0px";
          grid.style.maxHeight = "none";
        }
        if (native && host) {
          const nativeHeight = Math.ceil(native.getBoundingClientRect().height);
          if (nativeHeight > 0) host.style.minHeight = "0px";
        }
      };
      sync();
      this._gapResizeHandler = sync;
      window.addEventListener("resize", sync, { passive: true });
      if (typeof ResizeObserver === "function") {
        this._gapResizeObserver = new ResizeObserver(sync);
        this._gapResizeObserver.observe(this);
        const native = this.querySelector(".bw-v4-native");
        if (native) this._gapResizeObserver.observe(native);
      }
      this._gapLoadHandler = sync;
      window.addEventListener("load", this._gapLoadHandler);
      this._gapFontsHandler = sync;
      if (document.fonts && typeof document.fonts.addEventListener === "function") document.fonts.addEventListener("loadingdone", this._gapFontsHandler);
    }

    _styles() {
      return `
        bw-berlin-trip-planner-page { display:block; width:100%; max-width:100%; min-width:0; overflow-x:clip; color:#212121; background:#FAFAF5; font-family:Montserrat,Arial,sans-serif; font-size:16px; line-height:1.5; }
        .bw-v4-native, .bw-v4-native *, .bw-v4-native *::before, .bw-v4-native *::after { box-sizing:border-box; }
        .bw-v4-native { width:100%; max-width:1440px; margin:0 auto; overflow:hidden; background:#FAFAF5; font-size:16px; line-height:1.5; }
        .bw-v4-native button, .bw-v4-native input, .bw-v4-native textarea, .bw-v4-native select { font:inherit; }
        .bw-v4-native small { font-size:14px; line-height:1.4; }
        .bw-v4-header { display:flex; align-items:center; justify-content:flex-end; gap:24px; padding:18px clamp(18px,4vw,64px); background:#103B16; }
        .bw-v4-header nav { display:flex; gap:20px; }
        .bw-v4-header a, .bw-v4-footer a { color:#FFE600; text-decoration:none; font-weight:700; }
        .bw-v4-native .bw-v4-header a:focus-visible, .bw-v4-native .bw-v4-footer a:focus-visible, .bw-v4-native .bw-v4-primary:focus-visible, .bw-v4-native .bw-v4-secondary:focus-visible, .bw-v4-native .bw-v4-price-cta:focus-visible, .bw-v4-native .bw-v4-date-skip:focus-visible, .bw-v4-native summary:focus-visible { outline:3px solid #FFE600; outline-offset:3px; }
        .bw-v4-hero { display:grid; grid-template-columns:minmax(0,1.2fr) minmax(280px,.8fr); gap:clamp(24px,5vw,72px); padding:clamp(42px,7vw,100px) clamp(18px,7vw,96px); background-image:linear-gradient(90deg,rgba(16,59,22,.92) 0%,rgba(16,59,22,.7) 48%,rgba(16,59,22,.12) 100%),var(--bw-v4-hero); background-size:cover; background-position:center; color:#FAFAF5; }
        .bw-v4-hero-copy { max-width:680px; }
        .bw-v4-eyebrow, .bw-v4-card-kicker { color:#FFE600; text-transform:uppercase; letter-spacing:.12em; font-size:14px; font-weight:800; }
        .bw-v4-hero h1, .bw-v4-section h2 { margin:10px 0 14px; font-family:Georgia,serif; line-height:1.05; }
        .bw-v4-hero h1 { font-size:clamp(38px,6vw,78px); }
        .bw-v4-hero p { max-width:620px; font-size:clamp(17px,2vw,21px); line-height:1.55; }
        .bw-v4-actions { display:flex; flex-wrap:wrap; align-items:center; gap:12px; margin-top:26px; }
        .bw-v4-primary, .bw-v4-secondary, .bw-v4-price-cta { min-height:46px; display:inline-flex; align-items:center; justify-content:center; padding:12px 18px; border-radius:999px; font-weight:800; text-decoration:none; }
        .bw-v4-primary { background:#FFE600; color:#103B16; }
        .bw-v4-secondary { border:1px solid #FFE600; color:#FFE600; }
        .bw-v4-date-entry { display:flex; flex-wrap:wrap; gap:12px; margin-top:20px; }
        .bw-v4-date-entry label { display:grid; gap:5px; font-size:14px; font-weight:700; }
        .bw-v4-date-entry input { min-height:44px; border-radius:8px; border:1px solid #FAFAF5; padding:8px; font:inherit; color:#212121; }
        .bw-v4-date-skip { margin-top:12px; border:0; padding:0; background:none; color:#FFE600; text-decoration:underline; font:inherit; cursor:pointer; }
        .bw-v4-trust { font-size:14px !important; margin-top:22px; }
        .bw-v4-mini-plan { align-self:center; padding:24px; border-radius:18px; background:#FFE600; color:#103B16; box-shadow:0 18px 40px rgba(0,0,0,.2); }
        .bw-v4-mini-plan strong { display:block; margin:10px 0 18px; font-family:Georgia,serif; font-size:24px; }
        .bw-v4-mini-plan div { display:grid; grid-template-columns:58px 1fr; gap:8px; padding:12px 0; border-top:1px solid rgba(16,59,22,.28); }
        .bw-v4-mini-plan small { display:block; margin-top:18px; font-weight:700; }
        .bw-v4-section { padding:clamp(44px,7vw,90px) clamp(18px,7vw,96px); }
        .bw-v4-section-heading { max-width:760px; margin-bottom:28px; }
        .bw-v4-section h2 { font-size:clamp(32px,4vw,56px); color:#103B16; }
        .bw-v4-section-heading p { font-size:17px; }
        .bw-v4-how { display:grid; grid-template-columns:minmax(390px,.78fr) minmax(0,1.22fr); min-height:720px; }
        .bw-v4-how-intro { display:flex; flex-direction:column; justify-content:center; padding:clamp(56px,8vw,108px) clamp(28px,3vw,48px); background:#103B16; color:#FAFAF5; }
        .bw-v4-how-intro h2 { max-width:420px; margin:20px 0 24px; color:#FAFAF5; font-family:Georgia,serif; font-size:clamp(38px,3.2vw,52px); line-height:1.02; }
        .bw-v4-how-intro p { max-width:430px; margin:0; color:#FAFAF5; font-size:clamp(16px,1.35vw,19px); line-height:1.45; }
        .bw-v4-how-cta { width:min(100%,360px); min-height:62px; display:inline-flex; align-items:center; justify-content:center; margin-top:34px; padding:18px 28px; border-radius:8px; background:#FFE600; color:#103B16; font-size:18px; font-weight:800; text-decoration:none; }
        .bw-v4-how-cta:focus-visible { outline:3px solid #FAFAF5; outline-offset:4px; }
        .bw-v4-how-rail { position:relative; display:flex; flex-direction:column; justify-content:center; padding:clamp(56px,8vw,108px) clamp(28px,7vw,96px); background:#FAFAF5; color:#103B16; }
        .bw-v4-how-list { position:relative; list-style:none; margin:0; padding:0; }
        .bw-v4-how-list::before { content:""; position:absolute; z-index:0; top:13px; bottom:13px; left:164px; width:2px; background:#103B16; }
        .bw-v4-how-list li { position:relative; z-index:1; display:grid; grid-template-columns:120px 44px minmax(0,1fr); gap:22px; padding:0 0 28px 0; border-bottom:1px solid #d5d0be; }
        .bw-v4-how-list li + li { padding-top:28px; }
        .bw-v4-how-list li:last-child { padding-bottom:0; border-bottom:0; }
        .bw-v4-how-dot { grid-column:2; grid-row:1; align-self:start; justify-self:center; width:14px; height:14px; margin-top:13px; border:2px solid #103B16; border-radius:50%; background:#FFE600; }
        .bw-v4-how-number { color:#E63946; font-family:Georgia,serif; font-size:clamp(44px,4vw,60px); line-height:.88; }
        .bw-v4-how-list > li > .bw-v4-how-number { grid-column:1; grid-row:1; }
        .bw-v4-how-list > li > div { grid-column:3; grid-row:1; }
        .bw-v4-how-list h3 { margin:0 0 9px; color:#103B16; font-family:Georgia,serif; font-size:clamp(22px,1.9vw,30px); line-height:1.05; }
        .bw-v4-how-list p { max-width:520px; margin:0; color:#103B16; font-size:16px; line-height:1.4; }
        .bw-v4-how-result { display:flex; align-items:center; gap:18px; margin-top:34px; padding:20px 24px; border-radius:10px; background:#FFE600; color:#103B16; }
        .bw-v4-how-result strong { font-size:clamp(17px,1.5vw,20px); line-height:1.2; }
        .bw-v4-deliverable { display:grid; grid-template-columns:minmax(500px,520px) minmax(0,1fr); gap:40px; align-items:center; padding:60px clamp(18px,4vw,64px) 64px; border-top:32px solid #FAFAF5; overflow:hidden; background:#103B16; color:#FAFAF5; }
        .bw-v4-deliverable-copy { max-width:520px; }
        .bw-v4-deliverable-eyebrow { display:block; color:#FFE600; font-size:14px; font-weight:800; letter-spacing:.16em; }
        .bw-v4-deliverable h2 { max-width:520px; margin:18px 0 24px; color:#FAFAF5; font-family:Georgia,serif; font-size:clamp(38px,3.4vw,52px); line-height:1.02; }
        .bw-v4-deliverable-intro { max-width:540px; margin:0; color:#FAFAF5; font-size:clamp(16px,1.35vw,19px); line-height:1.45; }
        .bw-v4-deliverable-formats { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:18px; max-width:520px; margin:42px 0 28px; }
        .bw-v4-deliverable-formats > div { display:grid; gap:3px; padding:7px 0 7px 18px; border-left:1px solid rgba(255,230,0,.62); }
        .bw-v4-deliverable-formats strong { font-size:17px; font-weight:800; }
        .bw-v4-deliverable-formats span { font-size:17px; }
        .bw-v4-deliverable-proof { max-width:520px; margin:0 0 32px; color:#FFE600; font-size:16px; font-weight:800; letter-spacing:.02em; }
        .bw-v4-deliverable-cta { width:min(100%,300px); min-height:62px; display:inline-flex; align-items:center; justify-content:center; padding:18px 28px; border-radius:8px; background:#FFE600; color:#103B16; font-size:18px; font-weight:800; text-decoration:none; }
        .bw-v4-deliverable-cta:focus-visible { outline:3px solid #FAFAF5; outline-offset:4px; }
        .bw-v4-deliverable-visuals { position:relative; min-height:620px; }
        .bw-v4-deliverable-visuals figure { margin:0; }
        .bw-v4-deliverable-web { position:absolute; z-index:1; top:7%; left:0; width:min(86%,760px); transform:rotate(-2deg); }
        .bw-v4-deliverable-web img { display:block; width:100%; height:auto; border:1px solid rgba(16,59,22,.22); border-radius:16px; background:#fff; box-shadow:0 22px 55px rgba(0,0,0,.3); }
        .bw-v4-deliverable-web figcaption, .bw-v4-deliverable-pdf figcaption { position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; }
        .bw-v4-deliverable-pdf-stack { position:absolute; top:14%; right:0; width:min(32%,260px); min-width:180px; height:82%; }
        .bw-v4-deliverable-pdf { position:absolute; width:100%; }
        .bw-v4-deliverable-pdf img { display:block; width:100%; height:auto; border:1px solid rgba(16,59,22,.22); border-radius:2px; background:#fff; box-shadow:0 17px 36px rgba(0,0,0,.25); }
        .bw-v4-deliverable-pdf-back { top:2%; right:-4%; transform:rotate(5deg); }
        .bw-v4-deliverable-pdf-front { top:15%; right:13%; z-index:2; transform:rotate(8deg); }
        .bw-v4-deliverable-connector { position:absolute; z-index:3; top:-15%; right:0; display:flex; align-items:flex-start; justify-content:flex-end; width:190px; height:28px; color:#FFE600; font-size:13px; font-weight:800; letter-spacing:.16em; text-align:right; }
        .bw-v4-benefit-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:18px; }
        .bw-v4-benefit-grid article { padding:22px; border:1px solid #c9d1bf; border-radius:14px; background:#fffdf7; }
        .bw-v4-icon-box { display:grid; place-items:center; width:44px; height:44px; border:1px solid #a8bd9c; border-radius:12px; background:#fff2a3; }
        .bw-v4-icon { width:22px; height:22px; fill:none; stroke:#103B16; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; }
        .bw-v4-benefit-grid h3 { color:#103B16; font-size:18px; margin:15px 0 8px; }
        .bw-v4-benefit-grid p { line-height:1.5; margin:0; }
        .bw-v4-photo-section { background:#103B16; color:#FAFAF5; }
        .bw-v4-photo-section h2 { color:#FAFAF5; }
        .bw-v4-photo-grid { display:grid; grid-template-columns:1.2fr 1fr 1fr; gap:18px; }
        .bw-v4-photo-grid img { display:block; width:100%; aspect-ratio:4/3; object-fit:cover; border-radius:14px; }
        .bw-v4-photo-grid figcaption { display:grid; gap:5px; margin-top:12px; }
        .bw-v4-photo-grid strong { color:#FFE600; }
        .bw-v4-price-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:18px; }
        .bw-v4-price-grid article { display:flex; flex-direction:column; align-items:flex-start; gap:10px; padding:24px; border:1px solid #c9d1bf; border-radius:14px; background:#fffdf7; }
        .bw-v4-price-grid article.is-featured { background:#FFE600; border-color:#FFE600; }
        .bw-v4-price-grid article > span { color:#103B16; font-weight:800; }
        .bw-v4-price-grid article > strong { color:#103B16; font-family:Georgia,serif; font-size:42px; }
        .bw-v4-price-grid article > small { min-height:40px; }
        .bw-v4-price-cta { margin-top:auto; background:#103B16; color:#FFE600; width:100%; }
        .bw-v4-faq { background:#f1f3e8; }
        .bw-v4-faq details { border-top:1px solid #c9d1bf; padding:18px 0; }
        .bw-v4-faq summary { cursor:pointer; color:#103B16; font-weight:800; }
        .bw-v4-faq p { max-width:780px; line-height:1.55; }
        .bw-v4-footer { display:grid; grid-template-columns:1fr auto; gap:14px 24px; padding:28px clamp(18px,7vw,96px); background:#103B16; color:#FAFAF5; }
        .bw-v4-footer > div { display:flex; flex-wrap:wrap; gap:16px; }
        .bw-v4-footer details { grid-column:1/-1; font-size:14px; }
        .bw-v4-footer summary { color:#FFE600; cursor:pointer; }
        .bw-v4-footer p { max-width:720px; }
        .bw-v4-credits { display:grid; gap:4px; margin-top:10px; }
        .bw-v4-credits p { margin:0; }
        .bw-v4-credits a { color:#FFE600; text-decoration:underline; }
        @media (max-width:960px) {
          .bw-v4-how { grid-template-columns:1fr; }
          .bw-v4-how-intro { padding:72px clamp(28px,7vw,72px) 64px; }
          .bw-v4-how-rail { padding:64px clamp(28px,7vw,72px) 72px; }
          .bw-v4-deliverable { grid-template-columns:1fr; gap:48px; }
          .bw-v4-deliverable-copy { max-width:520px; }
          .bw-v4-deliverable-visuals { min-height:620px; }
        }
        @media (max-width:760px) {
          .bw-v4-header { padding:14px 16px; gap:12px; }
          .bw-v4-header nav { gap:10px; font-size:15px; }
          .bw-v4-hero { grid-template-columns:1fr; padding:48px 18px 42px; background-image:linear-gradient(180deg,rgba(16,59,22,.85),rgba(16,59,22,.45)),var(--bw-v4-hero); }
          .bw-v4-hero h1 { font-size:46px; }
          .bw-v4-mini-plan { max-width:100%; }
          .bw-v4-how-intro { padding:56px 18px 48px; }
          .bw-v4-how-intro h2 { font-size:clamp(36px,9.5vw,42px); }
          .bw-v4-how-cta { width:100%; max-width:360px; }
          .bw-v4-how-rail { padding:56px 18px 60px; }
          .bw-v4-how-list { padding-left:0; }
          .bw-v4-how-list::before { left:92px; }
          .bw-v4-how-list li { grid-template-columns:64px 28px minmax(0,1fr); gap:14px; }
          .bw-v4-how-dot { margin-top:10px; }
          .bw-v4-how-number { font-size:38px; }
          .bw-v4-how-list h3 { font-size:22px; }
          .bw-v4-how-list p { font-size:16px; }
          .bw-v4-how-result { align-items:flex-start; padding:18px; }
          .bw-v4-deliverable { grid-template-columns:1fr; gap:42px; padding:56px 18px 64px; border-top-width:16px; }
          .bw-v4-deliverable h2 { font-size:clamp(36px,9.5vw,42px); }
          .bw-v4-deliverable-formats { gap:12px; margin-top:32px; }
          .bw-v4-deliverable-formats strong, .bw-v4-deliverable-formats span { font-size:15px; }
          .bw-v4-deliverable-proof { font-size:14px; }
          .bw-v4-deliverable-visuals { min-height:480px; margin:0 -2px; }
          .bw-v4-deliverable-web { top:6%; width:78%; }
          .bw-v4-deliverable-pdf-stack { top:14%; width:42%; min-width:142px; height:78%; }
          .bw-v4-deliverable-cta { width:100%; max-width:300px; }
          .bw-v4-deliverable-connector { top:-12%; right:0; width:150px; height:24px; font-size:13px; }
          .bw-v4-benefit-grid, .bw-v4-price-grid { grid-template-columns:1fr; }
          .bw-v4-photo-grid { grid-template-columns:1fr; }
          .bw-v4-footer { grid-template-columns:1fr; }
          .bw-v4-footer > div { gap:12px; }
        }
        @media (prefers-reduced-motion: reduce) { .bw-v4-native, .bw-v4-native *, .bw-v4-native *::before, .bw-v4-native *::after { scroll-behavior:auto !important; transition-duration:0.01ms !important; } }
      `;
    }
  }

  if (!customElements.get("bw-berlin-trip-planner-page")) {
    customElements.define("bw-berlin-trip-planner-page", BWBerlinTripPlannerPage);
  }
})();
