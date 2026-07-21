import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const Runtime = require('./trip-planner-runtime-v3-1.js');

function launchOffer(overrides = {}) {
  return {
    ok: true,
    productKey: 'trip_planner_detailed',
    currency: 'eur',
    serverNow: '2026-07-20T10:00:00.000Z',
    offer: {
      offerId: 'tp_v31_launch_50',
      campaignId: 'tp_v31_launch_50',
      status: 'active',
      active: true,
      listAmountEurCents: 799,
      discountAmountEurCents: 400,
      netAmountEurCents: 399,
      startsAt: '2026-07-20T00:00:00.000Z',
      endsAt: '2026-08-19T00:00:00.000Z',
      priceLockMinutes: 30,
      ...overrides,
    },
  };
}

test('accepts only an active launch window for the 3.99 display price', () => {
  const active = Runtime.normalizeOfferResponse(launchOffer());
  assert.equal(active.offerId, 'tp_v31_launch_50');
  assert.equal(active.netAmountEurCents, 399);
  assert.equal(active.active, true);

  for (const invalid of [
    launchOffer({ status: 'scheduled' }),
    launchOffer({ active: false }),
    launchOffer({ netAmountEurCents: 398 }),
    launchOffer({ campaignId: 'launch' }),
    launchOffer({ campaignId: '' }),
    launchOffer({ startsAt: '2026-07-21T00:00:00.000Z' }),
    { ...launchOffer(), productKey: 'trip_planner_detailed_7_99' },
  ]) {
    const fallback = Runtime.normalizeOfferResponse(invalid);
    assert.equal(fallback.offerId, 'tp_standard_799');
    assert.equal(fallback.netAmountEurCents, 799);
    assert.equal(fallback.active, false);
  }
});

test('accepts the exact standard offer and fails closed to 7.99 for malformed responses', () => {
  const standard = Runtime.normalizeOfferResponse({
    ok: true,
    productKey: 'trip_planner_detailed',
    currency: 'eur',
    serverNow: '2026-07-20T10:00:00.000Z',
    offer: {
      offerId: 'tp_standard_799',
      campaignId: '',
      status: 'inactive',
      active: false,
      listAmountEurCents: 799,
      discountAmountEurCents: 0,
      netAmountEurCents: 799,
      startsAt: '',
      endsAt: '',
      priceLockMinutes: 30,
    },
  });
  assert.equal(standard.trusted, true);
  assert.equal(Runtime.formatPrice(standard.netAmountEurCents), '€7.99');
  assert.equal(Runtime.normalizeOfferResponse(null).netAmountEurCents, 799);
});

test('parses a complete cross-device access link without accepting partial or unsafe tokens', () => {
  const hash = 'a'.repeat(64);
  const token = `token_${'b'.repeat(48)}`;
  assert.deepEqual(Runtime.parseEmailAccess(`?trip_planner_order=tppo_123456789012&trip_planner_plan_hash=${hash}&trip_planner_access=${token}`), {
    orderId: 'tppo_123456789012',
    planIdHash: hash,
    entitlementToken: token,
  });
  assert.equal(Runtime.parseEmailAccess(`?trip_planner_order=tppo_123456789012&trip_planner_plan_hash=${hash}`), null);
  assert.equal(Runtime.parseEmailAccess(`?trip_planner_order=tppo_123456789012&trip_planner_plan_hash=${hash}&trip_planner_access=bad%20token`), null);
});

test('removes every payment and access credential from a browser URL', () => {
  const clean = Runtime.stripSensitiveParams('https://example.test/plan?trip_planner_order=tppo_123456789012&trip_planner_plan_hash=' + 'a'.repeat(64) + '&trip_planner_access=secret_token_12345678901234567890&date=2026-08-03');
  assert.equal(new URL(clean).searchParams.get('date'), '2026-08-03');
  Runtime.ACCESS_PARAMS.forEach((key) => assert.equal(new URL(clean).searchParams.has(key), false));
});

test('keeps expired and refunded email entitlements locked', () => {
  const active = {
    ok: true,
    entitled: true,
    entitlementStatus: 'active',
    serverNow: '2026-07-20T10:00:00.000Z',
    expiresAt: '2026-08-20T10:00:00.000Z',
  };
  assert.equal(Runtime.entitlementAllowsAccess(active), true);
  assert.equal(Runtime.entitlementAllowsAccess({ ...active, entitled: false }), false);
  assert.equal(Runtime.entitlementAllowsAccess({ ...active, entitlementStatus: 'refunded' }), false);
  assert.equal(Runtime.entitlementAllowsAccess({ ...active, entitlementStatus: 'expired' }), false);
  assert.equal(Runtime.entitlementAllowsAccess({ ...active, expiresAt: '2026-07-20T09:59:59.000Z' }), false);
});

test('coalesces only an explicit same-place lunch and keeps nearby suggestions separate', () => {
  assert.equal(Runtime.shouldCoalesceLunch('Lunch at Markthalle Neun', ['markthalle_neun'], ['markthalle_neun']), true);
  assert.equal(Runtime.shouldCoalesceLunch('Lunch near Tempelhofer Feld', ['tempelhof_food_search'], ['tempelhofer_feld']), false);
  assert.equal(Runtime.shouldCoalesceLunch('Lunch at Markthalle Neun', ['markthalle_neun'], ['oranienstrasse']), false);
  assert.equal(Runtime.mergeTimeWindows('09:30-12:00', '12:00-13:30'), '09:30-13:30');
});

test('requires the exact 409 offer_changed contract before refreshing checkout', () => {
  assert.equal(Runtime.isOfferChangedConflict(409, 'offer_changed'), true);
  assert.equal(Runtime.isOfferChangedConflict(400, 'offer_changed'), false);
  assert.equal(Runtime.isOfferChangedConflict(409, 'payment_failed'), false);
});

test('Meta Purchase uses the canonical product key and verified actual amount only', () => {
  const base = {
    eventName: 'Purchase',
    eventId: 'tppo_123456789012',
    currency: 'EUR',
    contentIds: ['trip_planner_detailed'],
    contentType: 'product',
  };
  assert.equal(Runtime.canonicalPurchase({ ...base, value: 3.99 }).amountEurCents, 399);
  assert.equal(Runtime.canonicalPurchase({ ...base, amountEurCents: 799 }).value, 7.99);
  assert.equal(Runtime.canonicalPurchase({ ...base, value: 4.99 }), null);
  assert.equal(Runtime.canonicalPurchase({ ...base, contentIds: ['trip_planner_detailed_7_99'], value: 7.99 }), null);
});
