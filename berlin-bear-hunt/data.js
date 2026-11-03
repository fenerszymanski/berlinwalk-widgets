/* Berlin Bear Hunt: the bears worth a detour. Facts checked on 3 November 2026.
 * stay = minutes to give each stop. paid = needs a ticket. */
window.BH_BEARS = [
  {
    id: 'sign', short: 'Lustgarten sign', name: 'The bear on the Lustgarten street sign',
    where: 'Corner of the Lustgarten by the Berliner Dom, Museum Island',
    lat: 52.51855, lon: 13.40030, stay: 3, paid: false, access: 'Outside, any time',
    what: 'The old-style cast-iron sign at the Lustgarten carries the Berlin bear on a small shield under a city crown. It is the easiest bear in Mitte to miss, because everyone is looking at the cathedral behind it.',
    move: 'Stand with your back to the Altes Museum and look up at the sign before you look at the Dom. Once you have seen one crowned bear, you notice it on old signs all over Mitte.'
  },
  {
    id: 'fountain', short: 'Bärenbrunnen', name: 'Bärenbrunnen on Werderscher Markt',
    where: 'In front of the Friedrichswerdersche Kirche, Mitte',
    lat: 52.51560, lon: 13.39900, stay: 5, paid: false, access: 'Outside, any time',
    what: 'A mother bear sits on a pillar while pairs of cubs play around her, all cut from red stone. Hugo Lederer made the fountain in 1928. It was destroyed in the war and carved again in 1958 by Walter Sutkowski.',
    move: 'Walk round it once: each pair of cubs is doing something different. It is two minutes from the Schlossbrücke and almost nobody on the way to Museum Island stops.'
  },
  {
    id: 'buddy', short: 'Buddy Bear', name: 'Buddy Bear at the Westin Grand',
    where: 'Hotel entrance, Friedrichstraße corner of Behrenstraße',
    lat: 52.51560, lon: 13.38870, stay: 3, paid: false, access: 'Outside the hotel entrance',
    what: 'The painted fibreglass bear with raised arms is a Buddy Bear, the street-art bears Eva and Klaus Herlitz started in the early 2000s. This one stands at the hotel door on Friedrichstraße.',
    move: 'Take your photo and keep walking: Buddy Bears stand outside hotels, embassies and shops all over the centre, so treat this one as your first, not your goal.'
  },
  {
    id: 'pit', short: 'Bärenzwinger', name: 'The old bear pit in Köllnischer Park',
    where: 'Rungestraße 30, next to the Märkisches Museum',
    lat: 52.51135, lon: 13.41560, stay: 20, paid: false, access: 'Daily 10:00 to 18:00, free',
    what: 'Live brown bears lived here from 1939 to 2015, the city keeping its heraldic animal in a brick enclosure. Schnute, the last one, was put down in October 2015. Since 2017 the district has run the empty pit as a free art space.',
    move: 'Go inside, not only past the fence. The shows change, but the old enclosure is still there around them, and that is the part worth seeing.'
  },
  {
    id: 'knut', short: 'Knut', name: 'Knut the polar bear',
    where: 'Museum für Naturkunde, Invalidenstraße 43',
    lat: 52.53020, lon: 13.37940, stay: 60, paid: true, access: 'Ticket, closed Mondays',
    what: 'The polar bear cub raised by hand at Berlin Zoo became a world star in 2007. Since his death his mounted body stands in the natural history museum, in the taxidermy highlights room, with Bobby the gorilla.',
    move: 'Book a time-slot ticket online and go early on a weekday. Knut is one room; the dinosaur hall is the reason to give it an hour.'
  },
  {
    id: 'nursing', short: 'Säugende Bärin', name: 'Hugo Lederer’s nursing bear',
    where: 'In front of the Rathaus Zehlendorf, Kirchstraße',
    lat: 52.43420, lon: 13.25920, stay: 5, paid: false, access: 'Outside, any time',
    what: 'A year after the fountain on Werderscher Markt, Lederer made a second bear for the south-west: a mother bear feeding her cub, outside Zehlendorf town hall.',
    move: 'Only worth it if you are already heading to the Grunewald lakes or Wannsee: the S1 to Zehlendorf drops you a short walk away.'
  }
];
