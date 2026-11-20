/* Mitte Christmas markets, 2026 season. Checked 20 November 2026 against the
   operators' own pages, berlin.de and visitBerlin. Hours are local time (24 h). */
window.MITTE_MARKETS = {
  checked: '20 November 2026',
  season: { first: '2026-11-18', last: '2027-01-03' },
  markets: [
    {
      id: 'sophien', chain: 1, short: 'Sophienstraße',
      name: 'Umwelt- und Weihnachtsmarkt Sophienstraße',
      lat: 52.52525, lng: 13.40075,
      from: '2026-11-28', to: '2026-12-20',
      onlyDates: ['2026-11-28', '2026-11-29', '2026-12-05', '2026-12-06', '2026-12-12', '2026-12-13', '2026-12-19', '2026-12-20'],
      hours: { sat: [12, 20], sun: [11, 19] },
      fee: 'Free',
      look: 'Small craft and design stalls in a narrow old street, no rides. Advent weekends only.',
      station: 'S Hackescher Markt, U Weinmeisterstraße'
    },
    {
      id: 'alex', chain: 2, short: 'Alexanderplatz',
      name: 'Weihnachtsmarkt am Alexanderplatz',
      lat: 52.5216, lng: 13.4130,
      from: '2026-11-23', to: '2026-12-26',
      hours: { all: [11, 22] },
      special: { '2026-12-24': [11, 14] },
      fee: 'Free',
      look: 'Two zones this year: stalls round the fountain, street food and an Eisstock lane by the World Clock.',
      station: 'S+U Alexanderplatz'
    },
    {
      id: 'rathaus', chain: 3, short: 'Rotes Rathaus',
      name: 'Berliner Weihnachtszeit am Roten Rathaus',
      lat: 52.5196, lng: 13.4068,
      from: '2026-11-23', to: '2027-01-03',
      hours: { weekday: [12, 22], weekend: [11, 22] },
      special: { '2026-12-24': null, '2026-12-31': null, '2027-01-03': [12, 20] },
      unsure: ['2026-12-25', '2026-12-26'],
      fee: 'Free to walk in. Ice rink EUR 5, skate hire EUR 3',
      look: 'The round ice rink around the Neptune Fountain and a 50 m Ferris wheel.',
      station: 'U Rotes Rathaus, S+U Alexanderplatz'
    },
    {
      id: 'humboldt', chain: 4, short: 'Humboldt Forum',
      name: 'Wintermarkt am Humboldt Forum',
      lat: 52.5170, lng: 13.4012,
      from: '2026-11-18', to: '2027-01-03',
      hours: { all: [11, 22] },
      special: { '2026-11-22': null, '2026-12-24': null },
      fee: 'Free',
      look: 'Stalls on Schlossplatz and in the Schlüterhof courtyard, with light shows on the baroque facades.',
      station: 'U Museumsinsel'
    },
    {
      id: 'gendarmen', chain: 5, short: 'Gendarmenmarkt',
      name: 'WeihnachtsZauber Gendarmenmarkt',
      lat: 52.5136, lng: 13.3926,
      from: '2026-11-23', to: '2026-12-31',
      hours: { sunthu: [11, 22], frisat: [11, 23] },
      special: { '2026-12-24': [11, 18] },
      unsure: ['2026-12-25', '2026-12-26', '2026-12-31'],
      fee: 'EUR 2, under 12 free. Free Mon to Fri 11:00 to 14:00 (not 24, 25, 26, 31 Dec)',
      look: 'White tents between the two domed churches and a heated craft tent.',
      station: 'U Stadtmitte, U Hausvogteiplatz'
    }
  ]
};
