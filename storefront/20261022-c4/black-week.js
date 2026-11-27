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
      altWoman: 'Marzahn Hoodie in sand, worn by a woman walking between apartment blocks in Marzahn.',
      altMan: 'Marzahn Hoodie in sand, worn by a man sitting in a park in Marzahn.'
    }),
    de: Object.freeze({
      name: 'Black Week',
      until: 'bis 30. November',
      title: 'Zwei kaufen, das zweite 25 % günstiger.',
      keep: Object.freeze(['25 % günstiger']),
      note: 'Bei unterschiedlichen Preisen gilt der Rabatt für den günstigeren Artikel.',
      line: 'T-Shirts, Hoodies und Poster. Der Rabatt kommt automatisch in den Warenkorb.',
      cta: 'Zum Shop',
      altWoman: 'Marzahn Hoodie in Sand, getragen von einer Frau zwischen den Wohnblöcken in Marzahn.',
      altMan: 'Marzahn Hoodie in Sand, getragen von einem Mann in einem Park in Marzahn.'
    })
  }),
  // 26 Nov 2026 (Yusuf: "şu blackweekteki görselleri de değiştirelim", picked the hoodie woman + man): the Marzahn Hoodie in sand, the
  // store's own paired gallery photos (gallery-abecfe6c woman, gallery-91c7be48 man). Earlier files stay in the repo, unused.
  // 24 Nov 2026 (Yusuf: the man alone made the clothing look men-only): a woman and a man in the same black Tempelhof tee, both the
  // store's own paired gallery photos. The 20 Nov poster files stay in the repo but are no longer shown.
  images: Object.freeze({
    woman: 'assets/design2/black-week-20261126-hoodie-woman',
    man: 'assets/design2/black-week-20261126-hoodie-man'
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

// Black Friday 2026 (Yusuf, 27 Nov 2026: "Ana sayfaya ve store ana sayfadaki black week tanıtımını black friday'e çevirelim", "up to %50
// denebilir"). From 27 Nov the store hero and the homepage slide use this copy; the window ends with Black Week (1 Dec 00:00:00+01:00).
// "Up to 50% off" is tied to digital files only: 64 of the 112 files are exactly 50% below their lowest price of the last 30 days
// (output/production/digital-bf-20261127/config.json). The 1928 line is a plain "from" price, no reduction claim. The Black Week sentence
// on product pages (BLACK_WEEK.copy.title) is unchanged.
export const BLACK_FRIDAY = Object.freeze({
  id: 'black-friday-202611',
  from: '2026-11-27T00:00:00+01:00',
  until: '2026-12-01T00:00:00+01:00',
  copy: Object.freeze({
    en: Object.freeze({
      name: 'Black Friday',
      until: 'until Monday 30 November',
      title: 'Digital files up to 50% off.',
      keep: Object.freeze(['50% off']),
      note: 'Your street in 1928 as a print from €24.90.',
      line: 'T-shirts, hoodies and posters: buy two, the cheaper one is 25% off in your cart.',
      cta: 'Shop digital files',
      homeCta: 'See the Black Friday offers',
      altWoman: 'Sample print of a Berlin street from above, in 1928 and today.',
      altMan: 'Berlin in Pink printable poster.'
    }),
    de: Object.freeze({
      name: 'Black Friday',
      until: 'bis Montag, 30. November',
      title: 'Digitale Dateien bis zu 50 % günstiger.',
      keep: Object.freeze(['50 % günstiger']),
      note: 'Deine Straße um 1928 als Druck ab 24,90 €.',
      line: 'T-Shirts, Hoodies und Poster: zwei kaufen, das günstigere ist im Warenkorb 25 % reduziert.',
      cta: 'Zu den Dateien',
      homeCta: 'Zu den Angeboten',
      altWoman: 'Beispieldruck einer Berliner Straße von oben, 1928 und heute.',
      altMan: 'Poster Berlin in Pink zum Selbstdrucken.'
    })
  }),
  images: Object.freeze({
    woman: 'assets/design2/black-friday-20261127-print1928',
    man: 'assets/design2/black-friday-20261127-printable'
  })
});

export const blackFridayActive = (now = Date.now()) =>
  Number.isFinite(now) && now >= Date.parse(BLACK_FRIDAY.from) && now < Date.parse(BLACK_FRIDAY.until);
