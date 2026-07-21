/* Berlin Matchday Board — verified home-fixture data for the 2026/27 season.
   Sources (accessed 21 July 2026):
   - DFL official Bundesliga 2026/27 fixture list (PDF, published 2 July 2026)
   - DFL official 2. Bundesliga 2026/27 fixture list (PDF, published 2 July 2026)
   - DFL 2. Bundesliga matchdays 1-2 exact kickoff times (PDF, July 2026)
   - 1. FC Union Berlin official announcement of exact kickoff times, matchdays 1-4 (15 July 2026)
   - 1. FC Union Berlin official women's fixture announcement (16 July 2026)

   `window` = the weekend the DFL has fixed. `time` is filled in only where an
   exact kickoff has been officially confirmed. Everything else stays open on
   purpose: the leagues fix exact times a few weeks ahead, and inventing them
   would be worse than leaving them blank. */

window.BW_MATCHDAY = {
  updated: '2026-07-21',
  grounds: {
    foersterei: {
      name: 'Stadion An der Alten Försterei',
      area: 'Köpenick',
      capacity: 22012,
      standing: 18395,
      seated: 3617,
      address: 'An der Wuhlheide 263, 12555 Berlin',
      route: 'S3 from Alexanderplatz towards Erkner to S Köpenick, then about a 15 minute walk',
      doorToGate: 40,
      gatesOpen: 120,
    },
    olympia: {
      name: 'Olympiastadion',
      area: 'Westend',
      capacity: 74475,
      standing: null,
      seated: null,
      address: 'Olympischer Platz 3, 14053 Berlin',
      route: 'U2 from Alexanderplatz towards Ruhleben to Olympia-Stadion, then about a 5 minute walk',
      doorToGate: 40,
      gatesOpen: 90,
    },
  },
  teams: {
    union: {
      label: 'Union Berlin',
      league: 'Bundesliga',
      ground: 'foersterei',
      tone: 'union',
      access: 'hard',
      accessLine: 'Members get the first few days. Whatever survives goes on public sale, and it often does not last.',
      priceFrom: 'from about 15 EUR standing',
      buyAt: 'union-zeughaus.de',
      warning: 'Tickets are personalised and cannot be passed on. Anything bought on a resale marketplace is void at the turnstile.',
    },
    hertha: {
      label: 'Hertha BSC',
      league: '2. Bundesliga',
      ground: 'olympia',
      tone: 'hertha',
      access: 'easy',
      accessLine: 'Member presale first, then a normal general sale. For most fixtures you can still buy in the days before.',
      priceFrom: '17 EUR standing, 27 EUR and up seated',
      buyAt: 'herthabsc.com',
      warning: 'Official resale runs through the club Clubsale only.',
    },
    frauen: {
      label: 'Union Berlin Frauen',
      league: 'Frauen-Bundesliga',
      ground: 'foersterei',
      tone: 'frauen',
      access: 'easy',
      accessLine: 'Top-flight football at the same Köpenick ground, and nothing like the same scramble for a ticket.',
      priceFrom: 'cheapest football in the city',
      buyAt: 'union-zeughaus.de',
      warning: '',
    },
  },
  fixtures: [
    // --- Union Berlin, Bundesliga home matches ---
    { team: 'union', md: 1, from: '2026-08-29', to: '2026-08-30', time: '15:30', day: 'Sat', opp: 'Eintracht Frankfurt' },
    { team: 'union', md: 3, from: '2026-09-11', to: '2026-09-13', time: '20:30', day: 'Fri', opp: 'FC Schalke 04' },
    { team: 'union', md: 5, from: '2026-10-09', to: '2026-10-11', opp: 'SV Elversberg' },
    { team: 'union', md: 6, from: '2026-10-16', to: '2026-10-18', opp: 'Borussia Dortmund' },
    { team: 'union', md: 8, from: '2026-10-30', to: '2026-11-01', opp: '1. FC Köln' },
    { team: 'union', md: 10, from: '2026-11-20', to: '2026-11-22', opp: 'RB Leipzig' },
    { team: 'union', md: 12, from: '2026-12-04', to: '2026-12-06', opp: 'Hamburger SV' },
    { team: 'union', md: 14, from: '2026-12-18', to: '2026-12-20', opp: 'TSG Hoffenheim' },
    { team: 'union', md: 16, from: '2027-01-12', to: '2027-01-14', opp: 'SC Paderborn 07' },
    { team: 'union', md: 19, from: '2027-01-29', to: '2027-01-31', opp: 'Bayer 04 Leverkusen' },
    { team: 'union', md: 21, from: '2027-02-12', to: '2027-02-14', opp: 'FC Bayern München' },
    { team: 'union', md: 24, from: '2027-03-02', to: '2027-03-04', opp: 'FC Augsburg' },
    { team: 'union', md: 26, from: '2027-03-12', to: '2027-03-14', opp: 'Sport-Club Freiburg' },
    { team: 'union', md: 28, from: '2027-04-02', to: '2027-04-04', opp: '1. FSV Mainz 05' },
    { team: 'union', md: 30, from: '2027-04-16', to: '2027-04-18', opp: 'VfB Stuttgart' },
    { team: 'union', md: 32, from: '2027-05-07', to: '2027-05-09', opp: 'SV Werder Bremen' },
    { team: 'union', md: 34, from: '2027-05-22', to: '2027-05-22', time: '15:30', day: 'Sat', opp: 'Borussia Mönchengladbach', last: true },

    // --- Hertha BSC, 2. Bundesliga home matches ---
    { team: 'hertha', md: 2, from: '2026-08-15', to: '2026-08-15', time: '13:00', day: 'Sat', opp: '1. FC Heidenheim 1846' },
    { team: 'hertha', md: 4, from: '2026-09-04', to: '2026-09-06', opp: '1. FC Magdeburg' },
    { team: 'hertha', md: 7, from: '2026-10-09', to: '2026-10-11', opp: 'SpVgg Greuther Fürth' },
    { team: 'hertha', md: 9, from: '2026-10-23', to: '2026-10-25', opp: 'DSC Arminia Bielefeld' },
    { team: 'hertha', md: 11, from: '2026-11-06', to: '2026-11-08', opp: 'VfL Wolfsburg' },
    { team: 'hertha', md: 13, from: '2026-11-27', to: '2026-11-29', opp: 'Karlsruher SC' },
    { team: 'hertha', md: 15, from: '2026-12-11', to: '2026-12-13', opp: 'SV Darmstadt 98' },
    { team: 'hertha', md: 17, from: '2027-01-15', to: '2027-01-17', opp: '1. FC Nürnberg' },
    { team: 'hertha', md: 18, from: '2027-01-22', to: '2027-01-24', opp: 'VfL Bochum 1848' },
    { team: 'hertha', md: 20, from: '2027-02-05', to: '2027-02-07', opp: 'Eintracht Braunschweig' },
    { team: 'hertha', md: 22, from: '2027-02-19', to: '2027-02-21', opp: 'VfL Osnabrück' },
    { team: 'hertha', md: 23, from: '2027-02-26', to: '2027-02-28', opp: 'SG Dynamo Dresden' },
    { team: 'hertha', md: 25, from: '2027-03-05', to: '2027-03-07', opp: 'Holstein Kiel' },
    { team: 'hertha', md: 27, from: '2027-03-19', to: '2027-03-21', opp: '1. FC Kaiserslautern' },
    { team: 'hertha', md: 29, from: '2027-04-09', to: '2027-04-11', opp: 'FC Energie Cottbus' },
    { team: 'hertha', md: 31, from: '2027-04-23', to: '2027-04-25', opp: 'Hannover 96' },
    { team: 'hertha', md: 33, from: '2027-05-14', to: '2027-05-16', opp: 'FC St. Pauli' },

    // --- Union Berlin Frauen, Frauen-Bundesliga home opener ---
    { team: 'frauen', md: 1, from: '2026-08-21', to: '2026-08-21', time: '18:20', day: 'Fri', opp: 'FC Bayern München', note: 'The first competitive football of the season in Berlin.' },
  ],
  // Not a match, but the fullest the ground gets all year.
  singing: { date: '2026-12-23', title: 'Weihnachtssingen', ground: 'foersterei' },
};
