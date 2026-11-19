/* Kotti Square Reader stops. stand = [lat, lon] of the viewer, face = compass degrees,
   marks = [lat, lon, label, radius], light = map layers to highlight, view = SVG viewBox.
   Facts checked on 19 November 2026; sources are listed in the blog post. */
window.KOTTI_STEPS = [
  {
    short: 'Gate', year: '1730s to 1860s', title: 'A gate that is only a name now',
    where: 'The roundabout, where Kottbusser Straße meets Skalitzer Straße',
    stand: [52.49862, 13.41812], face: 0, marks: [[52.49905, 13.41810, 'The old junction', 46, 'below']], light: [],
    view: [140, 126, 520, 390],
    look: 'The roundabout itself. Skalitzer Straße runs east to west along the line of the old customs wall, and Kottbusser Straße leaves it to the south, towards Neukölln and, far beyond, Cottbus.',
    why: 'Kotti is named after a gate in the excise wall that Berlin built in the 1730s to tax goods coming in. The wall and the gate came down in the 1860s. The road and the name stayed, and everything since has been built around that junction.',
    move: 'Stand on the south side by Kottbusser Straße and look north. You are looking along the road that goods once came in on to pay duty.'
  },
  {
    short: 'U1', year: '1902', title: 'The railway that went over the problem',
    where: 'Skalitzer Straße, under the green steel viaduct',
    stand: [52.49866, 13.41640], face: 75, marks: [], light: ['u1'],
    view: [51, 89, 640, 480],
    look: 'The steel viaduct and the station hall riding on it above the road. Today the U1 and the U3 stop up here.',
    why: 'When the first U-Bahn opened in February 1902, the wide street along the old wall line was the cheapest place for it, so it went up on stilts instead of underground. The station was rebuilt about 100 metres further west in the 1920s so it could meet the new line below.',
    move: 'Take the U1 platform stairs once without rushing and look out of the station windows. It is the best free view of the whole square.'
  },
  {
    short: 'U8', year: '1928', title: 'The line underneath, and ten exits',
    where: 'Exits A to K around the roundabout',
    stand: [52.49877, 13.41777], face: 20, marks: [], light: ['u8', 'exits'],
    view: [161, 155, 420, 315],
    look: 'The exit letters on the map. The U8 runs north to south under Adalbertstraße and Kottbusser Straße, across the U1 above.',
    why: 'The U8 level opened in 1928, which turned Kotti into a two-storey interchange. It is also why the square feels busy at every hour: people change trains here who never meant to stop.',
    move: 'Pick your exit before you get off. For Oranienstraße use the Adalbertstraße side; for Kottbusser Damm and the canal, the Kottbusser Straße side. Coming up on the wrong corner means crossing the roundabout twice.'
  },
  {
    short: 'NKZ', year: '1974', title: 'The block that bridges the street',
    where: 'North side, Adalbertstraße passes under it',
    stand: [52.49926, 13.41905], face: 330, marks: [], light: ['nkz'],
    view: [209, 44, 460, 345],
    look: 'The Neues Kreuzberger Zentrum: a curved housing block of up to twelve storeys with a bridge across Adalbertstraße and the long white and yellow balcony bands.',
    why: 'It was finished in 1974 as a showpiece of West Berlin\'s urban renewal, and most of its first tenants were Turkish families. Around 300 flats, 295 of them rent-bound, plus dozens of shops. The city-owned Gewobag has owned it since August 2017.',
    move: 'Walk under the bridge on Adalbertstraße and up to the first-floor walkway. You see who actually lives here: kids, shop owners, people carrying groceries.'
  },
  {
    short: 'Hut', year: '2012', title: 'The tenants who built a hut',
    where: 'South side, next to the high-rise on Kottbusser Straße',
    stand: [52.49880, 13.41720], face: 150, marks: [[52.49854, 13.41751, 'Protest hut', 26]], light: ['south', 'hut'],
    view: [141, 267, 420, 315],
    look: 'The small wooden hut in front of the 1970s high-rise on the south corner. It has stood there since 2012.',
    why: 'Tenants of the social housing blocks set it up as a protest against rising rents and called themselves Kotti and Co. The hut is the reason Kotti is also known as the place where Berlin started arguing loudly about rents again.',
    move: 'Read the notices on the hut. They tell you more about the square this month than any news story.'
  },
  {
    short: 'Police', year: '2023', title: 'A police post on the first floor',
    where: 'Inside the NKZ, Adalbertstraße 3',
    stand: [52.49962, 13.41850], face: 15, marks: [], light: ['nkz'],
    view: [249, 42, 380, 285],
    look: 'The blue P on the map, and the Polizei lettering above the Adalbertstraße bridge.',
    why: 'The Kotti-Wache opened on 15 February 2023 because the square had been one of the city\'s officially listed crime hotspots for years. People filed 2,612 criminal complaints there in 2025. The Senate itself says the post\'s effect cannot be proven on its own.',
    move: 'If something happens to you here, this is where you report it, right on the square, open around the clock.'
  },
  {
    short: 'Now', year: '2025 to 2026', title: 'So is Kotti dangerous?',
    where: 'The whole square, including the U-Bahn station',
    stand: [52.49905, 13.41790], face: 0, marks: [[52.49905, 13.41810, 'Weapons and knife ban zone', 150, 'below']], light: ['u1', 'u8'], hide: ['exits'],
    view: [10, 44, 760, 570],
    look: 'The circle on the map stands for the weapons and knife ban zone that has covered the streets around the square and the station since 15 February 2025.',
    why: 'Police counted 4,067 offences in the Kotti hotspot area in 2024 and 3,091 in 2025 up to 19 November. Knife attacks in the zone fell, from 48 to 26 for the same stretch of the year, but assaults and robberies rose.',
    move: 'Treat Kotti like any big interchange at night: phone and wallet away on the stairs, go straight through, and save the slow look around for daylight.'
  }
];
