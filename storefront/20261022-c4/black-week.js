// Black Week 2026 (Yusuf approved 20 Nov 2026). Date gate and copy for the store landing hero (design2.js), kept pure so tests can import it.
// The offer: buy any 2 T-shirts, hoodies or posters and the cheaper one is 25% off; one discounted item per order. Personalised 1928 prints,
// framed and canvas prints, calendars and digital printables are excluded. The discount is a Wix coupon the cart page applies by itself:
// nothing in this file prices, applies or promises anything beyond that sentence, and no price appears in the hero.
// Window: 20 Nov 2026 to Monday 30 Nov 2026 23:59:59 Berlin time. The end is exclusive (1 Dec 00:00:00+01:00), so from that second
// d2homeHero() falls back to the holiday hero (until 27 Dec) or the evergreen hero without any release. home-then-now.json carries the
// same two instants for the homepage slide (home-then-now/data/home.json); black-week.test.mjs keeps both copies equal.
// keep: the chunks of the headline that must not break across lines (they read as one phrase each, and "25 %" never splits).
export const BLACK_WEEK = Object.freeze({
  id: 'black-week-202611',
  from: '2026-11-20T00:00:00+01:00',
  until: '2026-12-01T00:00:00+01:00',
  copy: Object.freeze({
    en: Object.freeze({
      name: 'Black Week',
      until: 'until 30 November',
      title: 'Buy two, get the second one 25% off.',
      keep: Object.freeze(['25% off']),
      note: 'If the prices differ, the 25% comes off the cheaper item.',
      line: 'T-shirts, hoodies and posters. Automatically applied in your cart.',
      cta: 'Shop Black Week',
      altClothing: 'Tempelhof Classic T-shirt in black, worn by a smiling man outdoors.',
      altPoster: 'Tempelhof poster in an oak frame on a sunlit living-room wall.'
    }),
    de: Object.freeze({
      name: 'Black Week',
      until: 'bis 30. November',
      title: 'Zwei kaufen, das zweite 25 % günstiger.',
      keep: Object.freeze(['25 % günstiger']),
      note: 'Bei unterschiedlichen Preisen gilt der Rabatt für den günstigeren Artikel.',
      line: 'T-Shirts, Hoodies und Poster. Der Rabatt kommt automatisch in den Warenkorb.',
      cta: 'Zum Shop',
      altClothing: 'Tempelhof Classic T-Shirt in Schwarz, getragen von einem lächelnden Mann im Freien.',
      altPoster: 'Tempelhof-Poster im Eichenrahmen an einer sonnigen Wohnzimmerwand.'
    })
  }),
  images: Object.freeze({
    clothing: 'assets/design2/black-week-20261120-clothing',
    poster: 'assets/design2/black-week-20261120-poster'
  })
});

export const blackWeekActive = (now = Date.now()) =>
  Number.isFinite(now) && now >= Date.parse(BLACK_WEEK.from) && now < Date.parse(BLACK_WEEK.until);

// Product pages (Yusuf approved 21 Nov 2026, clothing page boost, items 2 and 3): the approved sentence (copy.<lang>.title) next to the price and over the
// second-item row. Eligibility is exactly the hidden Wix collection the coupon is scoped to (posters, T-shirts and hoodies; list in
// output/store/black-week-20261120/eligible-products.json): a catalogue row carries it in collectionIds. No price, euro amount or crossed-out price is ever
// drawn for the offer, and from the same instant as the hero (1 Dec 00:00:00+01:00) both surfaces are gone without a release.
export const BLACK_WEEK_COLLECTION_ID = 'c8d80bfb-7ec8-43c4-bcbf-62ef00ca0fa9';
export const blackWeekEligibleRow = row => Array.isArray(row?.collectionIds) && row.collectionIds.includes(BLACK_WEEK_COLLECTION_ID);
