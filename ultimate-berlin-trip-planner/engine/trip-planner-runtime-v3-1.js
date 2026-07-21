(function (globalScope, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (globalScope) globalScope.BWTripPlannerRuntimeV31 = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var PRODUCT_KEY = 'trip_planner_detailed';
  var STANDARD_OFFER_ID = 'tp_standard_799';
  var LAUNCH_OFFER_ID = 'tp_v31_launch_50';
  var STANDARD_AMOUNT_EUR_CENTS = 799;
  var LAUNCH_AMOUNT_EUR_CENTS = 399;
  var ACCESS_PARAMS = [
    'trip_planner_session_id',
    'trip_planner_order',
    'trip_planner_checkout',
    'trip_planner_plan_hash',
    'trip_planner_access'
  ];

  function standardOffer() {
    return {
      productKey: PRODUCT_KEY,
      currency: 'eur',
      offerId: STANDARD_OFFER_ID,
      campaignId: '',
      status: 'inactive',
      active: false,
      listAmountEurCents: STANDARD_AMOUNT_EUR_CENTS,
      discountAmountEurCents: 0,
      netAmountEurCents: STANDARD_AMOUNT_EUR_CENTS,
      startsAt: '',
      endsAt: '',
      priceLockMinutes: 30,
      serverNow: '',
      trusted: false
    };
  }

  function iso(value) {
    var clean = String(value || '').trim();
    var date = new Date(clean);
    return clean && !Number.isNaN(date.getTime()) ? date.toISOString() : '';
  }

  function normalizeOfferResponse(body) {
    var fallback = standardOffer();
    var offer = body && body.offer;
    if (!body || body.ok !== true || body.productKey !== PRODUCT_KEY || String(body.currency || '').toLowerCase() !== 'eur' || !offer) return fallback;
    var status = String(offer.status || '');
    if (['inactive', 'scheduled', 'active', 'expired'].indexOf(status) === -1) return fallback;
    var serverNow = iso(body.serverNow);
    var startsAt = iso(offer.startsAt);
    var endsAt = iso(offer.endsAt);
    var baseShape = Number(offer.listAmountEurCents) === STANDARD_AMOUNT_EUR_CENTS && Number(offer.priceLockMinutes) === 30;
    var standardShape = offer.offerId === STANDARD_OFFER_ID && Number(offer.discountAmountEurCents) === 0 && Number(offer.netAmountEurCents) === STANDARD_AMOUNT_EUR_CENTS;
    var launchShape = offer.offerId === LAUNCH_OFFER_ID && offer.campaignId === LAUNCH_OFFER_ID && offer.active === true && status === 'active' &&
      Number(offer.discountAmountEurCents) === 400 && Number(offer.netAmountEurCents) === LAUNCH_AMOUNT_EUR_CENTS &&
      serverNow && startsAt && endsAt && new Date(serverNow) >= new Date(startsAt) && new Date(serverNow) < new Date(endsAt);
    if (!baseShape || (!standardShape && !launchShape)) return fallback;
    return {
      productKey: PRODUCT_KEY,
      currency: 'eur',
      offerId: launchShape ? LAUNCH_OFFER_ID : STANDARD_OFFER_ID,
      campaignId: String(offer.campaignId || '').slice(0, 120),
      status: status,
      active: launchShape,
      listAmountEurCents: STANDARD_AMOUNT_EUR_CENTS,
      discountAmountEurCents: launchShape ? 400 : 0,
      netAmountEurCents: launchShape ? LAUNCH_AMOUNT_EUR_CENTS : STANDARD_AMOUNT_EUR_CENTS,
      startsAt: startsAt,
      endsAt: endsAt,
      priceLockMinutes: 30,
      serverNow: serverNow,
      trusted: true
    };
  }

  function formatPrice(amountEurCents) {
    var cents = Number(amountEurCents);
    if (cents !== STANDARD_AMOUNT_EUR_CENTS && cents !== LAUNCH_AMOUNT_EUR_CENTS) cents = STANDARD_AMOUNT_EUR_CENTS;
    return '\u20ac' + (cents / 100).toFixed(2);
  }

  function parseEmailAccess(search) {
    var params;
    try { params = new URLSearchParams(String(search || '')); } catch (error) { return null; }
    var orderId = String(params.get('trip_planner_order') || '');
    var planIdHash = String(params.get('trip_planner_plan_hash') || '').toLowerCase();
    var entitlementToken = String(params.get('trip_planner_access') || '');
    if (!/^[a-z0-9_:-]{8,140}$/i.test(orderId)) return null;
    if (!/^[a-f0-9]{64}$/.test(planIdHash)) return null;
    if (entitlementToken.length < 25 || entitlementToken.length > 1200 || !/^[A-Za-z0-9._~-]+$/.test(entitlementToken)) return null;
    return {
      orderId: orderId,
      planIdHash: planIdHash,
      entitlementToken: entitlementToken
    };
  }

  function stripSensitiveParams(value) {
    try {
      var url = new URL(String(value || ''), 'https://www.berlinwalk.com/');
      ACCESS_PARAMS.forEach(function (key) { url.searchParams.delete(key); });
      return url.toString();
    } catch (error) {
      return String(value || '');
    }
  }

  function timestampMs(value) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value > 0 && value < 100000000000 ? value * 1000 : value;
    }
    var clean = String(value || '').trim();
    if (!clean) return 0;
    if (/^\d+$/.test(clean)) return timestampMs(Number(clean));
    var parsed = new Date(clean).getTime();
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function entitlementAllowsAccess(body) {
    if (!body || body.ok !== true || body.entitled !== true) return false;
    var status = String(body.entitlementStatus || body.status || '').trim().toLowerCase();
    if (['expired', 'refunded', 'revoked', 'cancelled', 'canceled', 'chargeback'].indexOf(status) !== -1) return false;
    var expiresAt = timestampMs(body.expiresAt);
    var serverNow = timestampMs(body.serverNow);
    if (expiresAt && expiresAt <= (serverNow || Date.now())) return false;
    return true;
  }

  function isExplicitLunchTitle(value) {
    return /^Lunch at\b/i.test(String(value || '').trim());
  }

  function shouldCoalesceLunch(title, mealPlaceIds, priorPlaceIds) {
    if (!isExplicitLunchTitle(title)) return false;
    var mealIds = Array.isArray(mealPlaceIds) ? mealPlaceIds.map(String) : [];
    var priorIds = Array.isArray(priorPlaceIds) ? priorPlaceIds.map(String) : [];
    return mealIds.some(function (placeId) { return priorIds.indexOf(placeId) !== -1; });
  }

  function mergeTimeWindows(first, second) {
    var matches = [String(first || ''), String(second || '')].map(function (value) {
      var times = value.match(/\b\d{1,2}:\d{2}\b/g) || [];
      return times.length ? { start: times[0], end: times[times.length - 1] } : null;
    }).filter(Boolean);
    if (matches.length < 2) return String(first || second || '');
    function minutes(value) {
      var parts = value.split(':').map(Number);
      return parts[0] * 60 + parts[1];
    }
    var start = matches.reduce(function (best, item) { return minutes(item.start) < minutes(best) ? item.start : best; }, matches[0].start);
    var end = matches.reduce(function (best, item) { return minutes(item.end) > minutes(best) ? item.end : best; }, matches[0].end);
    return start + '-' + end;
  }

  function isOfferChangedConflict(status, code) {
    return Number(status) === 409 && String(code || '') === 'offer_changed';
  }

  function canonicalPurchase(purchase) {
    if (!purchase || purchase.eventName !== 'Purchase') return null;
    var orderId = String(purchase.eventId || '');
    if (!/^tppo_[A-Za-z0-9_-]{12,}$/.test(orderId)) return null;
    if (String(purchase.currency || '').toUpperCase() !== 'EUR' || purchase.contentType !== 'product') return null;
    var contentIds = Array.isArray(purchase.contentIds) ? purchase.contentIds : [];
    if (contentIds.length !== 1 || contentIds[0] !== PRODUCT_KEY) return null;
    var cents = Number.isFinite(Number(purchase.amountEurCents))
      ? Number(purchase.amountEurCents)
      : Math.round(Number(purchase.value) * 100);
    if (cents !== STANDARD_AMOUNT_EUR_CENTS && cents !== LAUNCH_AMOUNT_EUR_CENTS) return null;
    return {
      eventId: orderId,
      amountEurCents: cents,
      value: cents / 100,
      currency: 'EUR',
      contentIds: [PRODUCT_KEY],
      contentType: 'product'
    };
  }

  return {
    PRODUCT_KEY: PRODUCT_KEY,
    STANDARD_OFFER_ID: STANDARD_OFFER_ID,
    LAUNCH_OFFER_ID: LAUNCH_OFFER_ID,
    STANDARD_AMOUNT_EUR_CENTS: STANDARD_AMOUNT_EUR_CENTS,
    LAUNCH_AMOUNT_EUR_CENTS: LAUNCH_AMOUNT_EUR_CENTS,
    ACCESS_PARAMS: ACCESS_PARAMS.slice(),
    standardOffer: standardOffer,
    normalizeOfferResponse: normalizeOfferResponse,
    formatPrice: formatPrice,
    parseEmailAccess: parseEmailAccess,
    stripSensitiveParams: stripSensitiveParams,
    entitlementAllowsAccess: entitlementAllowsAccess,
    isExplicitLunchTitle: isExplicitLunchTitle,
    shouldCoalesceLunch: shouldCoalesceLunch,
    mergeTimeWindows: mergeTimeWindows,
    isOfferChangedConflict: isOfferChangedConflict,
    canonicalPurchase: canonicalPurchase
  };
});
