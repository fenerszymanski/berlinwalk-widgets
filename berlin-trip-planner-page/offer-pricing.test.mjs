import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const landingSource = await readFile(
  new URL('./berlin-trip-planner-page-element.js', import.meta.url),
  'utf8',
);

const plannerSource = await readFile(
  new URL('../ultimate-berlin-trip-planner/index.html', import.meta.url),
  'utf8',
);

test('launch price surfaces use the 399-cent net price, never the 400-cent discount', () => {
  assert.match(landingSource, /const OFFER_STANDARD_CENTS = 799;/);
  assert.match(landingSource, /const OFFER_LAUNCH_CENTS = 399;/);
  assert.match(landingSource, /const OFFER_DISCOUNT_CENTS = 400;/);

  assert.match(landingSource, /data-bw-offer-price[^\n]+state\.netCents/);
  assert.match(landingSource, /data-bw-offer-saving[^\n]+state\.discountCents/);
  assert.match(landingSource, /this\._setPriceSurfaces\(state\.netCents\);/);
  assert.doesNotMatch(landingSource, /data-bw-offer-price[^\n]+state\.discountCents/);
  assert.doesNotMatch(landingSource, /this\._setPriceSurfaces\(state\.discountCents\);/);
});

test('planner launch override and customer-facing copy keep 799/400/399 roles distinct', () => {
  assert.match(
    plannerSource,
    /listAmountEurCents:\s*799,[\s\S]{0,120}discountAmountEurCents:\s*400,[\s\S]{0,120}netAmountEurCents:\s*399,/,
  );
  assert.doesNotMatch(
    `${landingSource}\n${plannerSource}`,
    /(?:launch price|pay|paid total|unlock this plan|detailed Berlin plan)[^\n]{0,80}€4\.00/i,
  );
});
