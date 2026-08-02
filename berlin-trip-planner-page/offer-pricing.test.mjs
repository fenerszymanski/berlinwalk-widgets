import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const landingSource = await readFile(
  new URL("./berlin-trip-planner-page-element.js", import.meta.url),
  "utf8"
);
const seoSource = await readFile(new URL("./SEO_SETTINGS.md", import.meta.url), "utf8");

test("native Wix layer contains the V4 LP, no legacy iframe, and safe top-level handoff", () => {
  assert.doesNotMatch(landingSource, /<iframe\b/i);
  assert.doesNotMatch(landingSource, /ultimate-berlin-trip-planner/i);
  assert.match(landingSource, /window\.location\.assign\(safePlannerUrl/);
  assert.match(landingSource, /data-bw-v4-start/);
  assert.match(landingSource, /planner-dates=/);
  assert.match(landingSource, /landing_variant/);
  assert.match(landingSource, /entry\", \"start\"/);
  assert.match(landingSource, /<main id="bw-v4-top"/);
  assert.doesNotMatch(landingSource, /class="bw-v4-logo"/);
  assert.match(landingSource, /href="#bw-v4-includes"/);
  assert.match(landingSource, /href="#bw-v4-pricing"/);
  assert.match(landingSource, /Planner LP Impression/);
  assert.match(landingSource, /Planner LP Start/);
  assert.match(landingSource, /analyticsConsent\(\)/);
  assert.match(landingSource, /functionalConsent\(\)/);
  assert.match(landingSource, /assignmentConsent\(\)/);
  assert.match(landingSource, /consentPolicyChanged/);
  assert.match(landingSource, /_syncCanonicalSchema/);
  assert.doesNotMatch(landingSource, /parent\.postMessage/);
});

test("native LP preserves the exact V4 pricing bands, proof, photos, icons and FAQ", () => {
  for (const price of ["€7.99", "€11.99", "€15.99"]) assert.match(landingSource, new RegExp(price.replace("€", "€")));
  assert.match(landingSource, /planner-proof-web-top/);
  assert.match(landingSource, /planner-proof-pdf-page-01/);
  assert.equal((landingSource.match(/planner-lp-/g) || []).length >= 3, true);
  assert.match(landingSource, /data-icon-family="lucide"/);
  for (const iconName of ["map", "train", "calendar", "food", "files", "euro"]) assert.match(landingSource, new RegExp(`${iconName}:`));
  assert.match(landingSource, /A few clear answers/);
  assert.match(landingSource, /Four short steps/);
  assert.match(landingSource, /pricing_1_2/);
  assert.match(landingSource, /pricing_3_4/);
  assert.match(landingSource, /pricing_5_7/);
  assert.match(landingSource, /WebApplication/);
  assert.match(landingSource, /AggregateOffer/);
  assert.match(seoSource, /lowPrice.*7\.99/);
  assert.match(seoSource, /highPrice.*15\.99/);
  assert.match(seoSource, /isAccessibleForFree.*false/);
  assert.doesNotMatch(seoSource, /isAccessibleForFree.*true/);
  assert.doesNotMatch(`${landingSource}\n${seoSource}`, /3\.99|priceValidUntil/);
});

test("A/B and date handoff remain PII-free", () => {
  assert.match(landingSource, /V4_EXPERIMENT_KEY = "planner_landing_dates_v2"/);
  assert.match(landingSource, /V4_ASSIGNMENT_COOKIE = "bw_planner_landing_v2"/);
  assert.match(landingSource, /location: link\.getAttribute\("data-location"\)/);
  for (const location of ["hero", "hero_dates", "hero_no_dates", "pricing_1_2", "pricing_3_4", "pricing_5_7"]) assert.match(landingSource, new RegExp(location));
  assert.match(landingSource, /CTA_LOCATIONS/);
  assert.match(landingSource, /if \(!this\._assignment\.isQa\)/);
  assert.doesNotMatch(landingSource, /parent_url|parent_location|requestId|session_id/);
  assert.doesNotMatch(landingSource, /utm_.*arrival|utm_.*departure/);
});

test("native SEO/schema and public credits are exact and scoped", () => {
  assert.match(landingSource, /bw-berlin-trip-planner-page \{/);
  assert.doesNotMatch(landingSource, /:host\s*\{/);
  assert.doesNotMatch(landingSource, /<script type="application\/ld\+json" data-bw-v4-webapp-schema>/);
  assert.match(landingSource, /data-bw-v4-canonical-schema/);
  assert.match(landingSource, /CANONICAL_SCHEMA_ID = "bw-trip-planner-webapp-jsonld"/);
  assert.match(landingSource, /"@graph"/);
  assert.match(landingSource, /typeIncludes\(entry, "WebPage"\)/);
  assert.match(landingSource, /isAccessibleForFree: false/);
  assert.doesNotMatch(landingSource, /isAccessibleForFree: true/);
  assert.doesNotMatch(landingSource, /new MutationObserver/);
  assert.doesNotMatch(landingSource, /_canonicalSchemaObserver/);
  assert.doesNotMatch(landingSource, /_canonicalSchemaTimers/);
  assert.match(landingSource, /Build a practical 1–7 day Berlin itinerary around your dates, pace, interests, food preferences and fixed plans\. One price for the whole trip\./);
  assert.match(landingSource, /document\.addEventListener\("consentPolicyChanged"/);
  assert.match(landingSource, /document\.removeEventListener\("consentPolicyChanged"/);
  assert.match(landingSource, /document\.getElementById\(CANONICAL_SCHEMA_ID\)/);
  assert.match(landingSource, /if \(document\.getElementById\(CANONICAL_SCHEMA_ID\)\) return;/);
  assert.match(landingSource, /typeIncludes\(entry, "WebPage"\)/);
  assert.doesNotMatch(landingSource, /entry\["@type"\] === "Product" && \(name\.includes/);
  assert.match(landingSource, /Guido from Berlin, CC BY 2\.0/);
  assert.match(landingSource, /Thomas Wolf, CC BY-SA 3\.0/);
  assert.match(landingSource, /Singlespeedfahrer, CC0/);
  assert.match(landingSource, /Orderinchaos, CC BY-SA 4\.0/);
  assert.doesNotMatch(landingSource, /licensed source recorded by BerlinWalk/);
  assert.doesNotMatch(landingSource, /#bw-v4-form/);
});

test("native typography has explicit readable floors independent of Wix base CSS", () => {
  assert.match(landingSource, /bw-berlin-trip-planner-page \{[^}]*font-size:16px; line-height:1\.5/);
  assert.match(landingSource, /\.bw-v4-native \{[^}]*font-size:16px; line-height:1\.5/);
  assert.match(landingSource, /\.bw-v4-native small \{ font-size:14px; line-height:1\.4; \}/);
  assert.match(landingSource, /\.bw-v4-eyebrow, \.bw-v4-card-kicker \{[^}]*font-size:14px/);
  assert.match(landingSource, /\.bw-v4-date-entry label \{[^}]*font-size:14px/);
  assert.match(landingSource, /\.bw-v4-footer details \{[^}]*font-size:14px/);
  assert.match(landingSource, /\.bw-v4-header nav \{ gap:10px; font-size:15px; \}/);
  assert.doesNotMatch(landingSource, /font-size:10px|font-size:8\.33px/);
});

test("Wix height guard collapses the component section and preserves dynamic grid rows", () => {
  const observed = [];
  const listeners = new Map();
  class FakeNode {
    constructor(tagName, id = "", className = "", height = 0) {
      this.tagName = tagName.toUpperCase();
      this.id = id;
      this.className = className;
      this.style = {};
      this.parentElement = null;
      this.children = [];
      this._height = height;
    }
    contains(node) { return this === node || this.children.some((child) => child === node || child.contains?.(node)); }
    appendChild(node) { this.children.push(node); node.parentElement = this; return node; }
    querySelector(selector) { return selector === ".bw-v4-native" ? this.children.find((child) => child.className === "bw-v4-native") || null : null; }
    getBoundingClientRect() { return { height: this._height, top: 0, bottom: this._height, width: 1418 }; }
    get classList() { return { contains: (name) => this.className.split(/\s+/).includes(name) }; }
  }
  const host = new FakeNode("div", "comp-mq1axvyp", "DURcgf comp-mq1axvyp", 6645);
  const native = new FakeNode("main", "bw-v4-top", "bw-v4-native", 4795);
  const intermediate = new FakeNode("div", "comp-mscayd1a", "HFEOE3 comp-mscayd1a-container comp-mscayd1a wixui-box", 7361.41);
  const container = new FakeNode("div", "", "comp-mq1axexj-container max-width-container", 7280);
  const section = new FakeNode("section", "comp-mq1axexj", "ke5pl1 comp-mq1axexj wixui-section", 7280);
  const grid = new FakeNode("div", "pidtg", "pidtg-container", 8074);
  const instance = new FakeNode("bw-berlin-trip-planner-page", "", "", 6645);
  instance.appendChild(native);
  host.appendChild(instance);
  intermediate.appendChild(host);
  container.appendChild(intermediate);
  section.appendChild(container);
  grid.appendChild(section);
  const document = {
    body: new FakeNode("body"),
    documentElement: new FakeNode("html"),
    fonts: { addEventListener() {}, removeEventListener() {} },
    getElementById(id) { return id === "comp-mq1axvyp" ? host : null; }
  };
  const window = {
    addEventListener(name, callback) { listeners.set(name, callback); },
    removeEventListener() {},
    visualViewport: null
  };
  let naturalGridRows = "143px 7279.95px 651px";
  let naturalIntermediateGridRows = "7361.41px";
  let naturalInnerGridRows = "7279.95px";
  const getComputedStyle = (node) => ({
    gridTemplateRows: node === grid ? (node.style.gridTemplateRows || naturalGridRows) : node === intermediate ? (node.style.gridTemplateRows || naturalIntermediateGridRows) : node === container ? (node.style.gridTemplateRows || naturalInnerGridRows) : "none",
    gridRowStart: node === section ? "2" : "auto"
  });
  class FakeResizeObserver {
    constructor(callback) { this.callback = callback; }
    observe(node) { observed.push(node); }
    disconnect() {}
  }
  const customElements = { define(_name, constructor) { this.constructor = constructor; }, get() { return null; } };
  vm.runInNewContext(landingSource, {
    document,
    window,
    customElements,
    HTMLElement: class {},
    ResizeObserver: FakeResizeObserver,
    URL,
    URLSearchParams,
    JSON,
    Set,
    Map,
    Array,
    String,
    Number,
    Object,
    console,
    getComputedStyle
  });
  const guardInstance = Object.create(customElements.constructor.prototype);
  guardInstance.parentElement = host;
  guardInstance.style = {};
  guardInstance.querySelector = (selector) => selector === ".bw-v4-native" ? native : null;
  guardInstance._setupWixTopGapGuard();
  assert.equal(host.style.minHeight, "0px");
  assert.equal(host.style.height, "auto");
  assert.equal(intermediate.style.height, "auto");
  assert.equal(intermediate.style.gridTemplateRows, "auto");
  assert.equal(intermediate.style.gridAutoRows, "auto");
  assert.equal(container.style.height, "auto");
  assert.equal(section.style.minHeight, "0px");
  assert.equal(container.style.gridTemplateRows, "auto");
  assert.equal(container.style.gridAutoRows, "auto");
  assert.equal(grid.style.gridTemplateRows, "143px auto 651px");
  assert.equal(grid.style.height, "auto");
  assert.ok(observed.includes(guardInstance));
  assert.ok(observed.includes(native));
  assert.equal(typeof listeners.get("resize"), "function");
  naturalGridRows = "95px 5090px 1647px";
  naturalIntermediateGridRows = "5090px";
  naturalInnerGridRows = "5090px";
  listeners.get("resize")();
  assert.equal(container.style.gridTemplateRows, "auto");
  assert.equal(grid.style.gridTemplateRows, "95px auto 1647px");
  naturalGridRows = "143px 7279.95px 651px";
  naturalIntermediateGridRows = "7361.41px";
  naturalInnerGridRows = "7279.95px";
  listeners.get("resize")();
  assert.equal(container.style.gridTemplateRows, "auto");
  assert.equal(grid.style.gridTemplateRows, "143px auto 651px");
});

test("consent and QA override guard persistence and measurement", () => {
  const assignmentStart = landingSource.indexOf("function resolveAssignment()");
  const assignmentEnd = landingSource.indexOf("function analyticsConsent()", assignmentStart);
  const assignmentSource = landingSource.slice(assignmentStart, assignmentEnd);
  assert.ok(assignmentSource.indexOf("if (!assignmentConsent())") >= 0);
  assert.ok(assignmentSource.indexOf("if (!assignmentConsent())") < assignmentSource.indexOf("persistVisitorId(visitorId)"));
  assert.match(assignmentSource, /isQa: true/);
  assert.match(landingSource, /this\._assignment\.isQa/);
  assert.match(landingSource, /this\._impressionTracked/);
  assert.match(landingSource, /consentPolicyInitialized/);
  assert.doesNotMatch(landingSource, /Math\.random\(\)/);
  assert.doesNotMatch(landingSource, /visitorId:.*dataLayer|dataLayer.*visitorId/);
});

test("schema cleanup keeps mixed-graph context while replacing only exact planner entries", () => {
  assert.match(landingSource, /const unrelatedEntries = \[\];/);
  assert.match(landingSource, /this\._canonicalWebPageCache = this\._canonicalWebPageCache \|\| new Map\(\)/);
  assert.match(landingSource, /const rememberWebPage = \(entry\) =>/);
  assert.match(landingSource, /for \(const entry of this\._canonicalWebPageCache\.values\(\)/);
  assert.match(landingSource, /const nonStaleEntries = entries\.filter/);
  assert.match(landingSource, /const canonicalWebPages = webPages\.filter/);
  assert.match(landingSource, /unrelatedEntries, webApplication/);
  assert.match(landingSource, /id === fullPlanId/);
  assert.match(landingSource, /name === "berlin trip planner full plan"/);
  assert.doesNotMatch(landingSource, /raw\.includes\(staleTripPrice\)/);
  assert.match(landingSource, /isAccessibleForFree: false/);
});

test("live-like Wix head/native schema reconciliation stays responsive with one owner", async () => {
  const nodes = [];
  let nativeMutationObservers = 0;
  let nativeOwnedTimers = 0;
  class FakeNode {
    constructor(tagName) {
      this.tagName = tagName.toUpperCase();
      this.id = "";
      this.type = "";
      this.textContent = "";
      this.parentNode = null;
      this.dataset = {};
      this.attributes = {};
    }
    setAttribute(name, value) { this.attributes[name] = String(value); }
    getAttribute(name) { return this.attributes[name] ?? null; }
    appendChild(node) {
      if (!this.children) this.children = [];
      if (!this.children.includes(node)) this.children.push(node);
      node.parentNode = this;
      return node;
    }
    remove() {
      const siblings = this.parentNode?.children || [];
      const index = siblings.indexOf(this);
      if (index >= 0) siblings.splice(index, 1);
      this.parentNode = null;
    }
  }
  const head = new FakeNode("head");
  head.children = nodes;
  const document = {
    currentScript: { src: "https://cdn.example.test/berlin-trip-planner-page-element.js" },
    head,
    body: new FakeNode("body"),
    documentElement: { clientWidth: 390, scrollWidth: 390, setAttribute() {} },
    getElementById(id) { return nodes.find((node) => node.id === id) || null; },
    createElement(tagName) {
      const node = new FakeNode(tagName);
      nodes.push(node);
      return node;
    },
    querySelectorAll(selector) {
      return selector.includes("application/ld+json") ? nodes.filter((node) => node.type === "application/ld+json") : [];
    },
    addEventListener() {},
    removeEventListener() {},
    cookie: "",
  };
  let registeredConstructor = null;
  const customElements = {
    define(_name, constructor) { registeredConstructor = constructor; },
    get() { return registeredConstructor; },
  };
  const window = {
    location: { pathname: "/berlin-trip-planner", search: "", protocol: "https:" },
    crypto: { randomUUID: () => "00000000-0000-4000-8000-000000000000" },
    localStorage: { getItem: () => "", setItem() {} },
    setTimeout(callback, delay) { nativeOwnedTimers += 1; return setTimeout(callback, delay); },
    clearTimeout,
    addEventListener() {},
    removeEventListener() {},
    visualViewport: null,
    dataLayer: [],
    consentPolicyManager: null,
  };
  class FakeHTMLElement {}
  class FakeMutationObserver { constructor() { nativeMutationObservers += 1; } observe() {} disconnect() {} }
  vm.runInNewContext(landingSource, {
    document,
    window,
    customElements,
    HTMLElement: FakeHTMLElement,
    MutationObserver: FakeMutationObserver,
    URL,
    URLSearchParams,
    JSON,
    Set,
    Map,
    Array,
    String,
    Number,
    Object,
    console,
  });
  assert.equal(typeof registeredConstructor, "function");

  const canonical = "https://www.berlinwalk.com/berlin-trip-planner";
  const description = "Build a practical 1–7 day Berlin itinerary around your dates, pace, interests, food preferences and fixed plans. One price for the whole trip.";
  const external = document.createElement("script");
  external.type = "application/ld+json";
  external.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${canonical}#webpage`, url: canonical },
      { "@type": "Product", "@id": `${canonical}#full-plan`, name: "Berlin Trip Planner Full Plan", offers: { price: "3.99" } },
      { "@type": "BreadcrumbList", "@id": `${canonical}#crumbs` }
    ]
  });
  head.appendChild(external);

  const headReconcile = () => {
    const own = document.getElementById("bw-trip-planner-webapp-jsonld") || document.createElement("script");
    own.id = "bw-trip-planner-webapp-jsonld";
    own.type = "application/ld+json";
    own.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "WebPage", "@id": `${canonical}#webpage`, url: canonical },
        { "@type": "BreadcrumbList", "@id": `${canonical}#crumbs` },
        { "@type": "WebApplication", "@id": `${canonical}#webapp`, name: "Berlin Trip Planner", url: canonical, description }
      ]
    });
    head.appendChild(own);
  };
  headReconcile();
  const beforeNative = document.getElementById("bw-trip-planner-webapp-jsonld").textContent;
  const instance = Object.create(registeredConstructor.prototype);
  instance._syncCanonicalSchema();
  assert.equal(document.getElementById("bw-trip-planner-webapp-jsonld").textContent, beforeNative);
  headReconcile();
  await new Promise((resolve) => setTimeout(resolve, 10));
  const own = document.getElementById("bw-trip-planner-webapp-jsonld");
  const graph = JSON.parse(own.textContent)["@graph"];
  assert.equal(graph.filter((entry) => entry["@type"] === "WebPage").length, 1);
  assert.equal(graph.filter((entry) => entry["@type"] === "WebApplication").length, 1);
  assert.equal(graph.filter((entry) => entry["@type"] === "Product").length, 0);
  assert.equal(nativeMutationObservers, 0);
  assert.equal(nativeOwnedTimers, 0);
  assert.equal(document.documentElement.scrollWidth, document.documentElement.clientWidth);
});
