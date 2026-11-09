/* TV Tower Sightline Map dataset.
 * Coordinates: OpenStreetMap (see research viewpoints.json for node/way ids).
 * Distance, bearing and apparent height are recomputed in index.html from these
 * coordinates; the numbers here are the research values kept for cross-checking.
 * Humboldthoehe was left out: no source confirmed the tower is visible from the deck.
 */
window.TV_SIGHTLINES = {
  checked: '9 November 2026',
  tower: { name: 'Berlin TV Tower (Fernsehturm)', lat: 52.520815, lon: 13.409419, height: 368, deck: 203 },
  viewpoints: [
    {
      id: 'kma-frankfurter-tor', short: 'Frankfurter Tor', name: 'Karl-Marx-Allee at Frankfurter Tor',
      district: 'Friedrichshain', lat: 52.515818, lon: 13.4539745,
      station: 'U Frankfurter Tor (U5), right under the square', cost: 'free', hours: 'Public street, always open',
      what: 'The tower at the far end of the GDR boulevard, between the two domed Henselmann towers. By my calculation it sits about half a degree off the street’s centre line, so it reads as the end of the axis.',
      best: 'Morning for a lit tower; 15:30 to 16:30 in November for a silhouette.',
      caveat: 'Stand on the central island only at the crossings. The new Alexanderplatz high-rises may now overlap part of the lower shaft; a photo from 3 October 2026 still shows the view.',
      ref: { km: 3.1, brg: 280.5, app: 6.85 }
    },
    {
      id: 'strausberger-platz', short: 'Strausberger Platz', name: 'Strausberger Platz, looking down Karl-Marx-Allee',
      district: 'Friedrichshain', lat: 52.5187973, lon: 13.4287576,
      station: 'U Strausberger Platz (U5)', cost: 'free', hours: 'Public square, always open',
      what: 'The close version of the same axis: at 1.3 km the tower fills the end of the street, framed by the twin 1950s tower houses.',
      best: 'Morning, with the sun behind you.',
      caveat: 'The Fritz Kühn fountain in the middle of the square is dry: it stopped in 2023 and its copper plates were taken down in 2024.',
      ref: { km: 1.3, brg: 279.7, app: 15.49 }
    },
    {
      id: 'warschauer-bruecke', short: 'Warschauer Brücke', name: 'Warschauer Brücke, over the rail tracks',
      district: 'Friedrichshain', lat: 52.506374, lon: 13.4493717,
      station: 'S+U Warschauer Straße (S-Bahn, U1, U3)', cost: 'free', hours: 'Public bridge, always open',
      what: 'The tower over the wide fan of tracks running west to Ostbahnhof, with the arena and the mall on your left.',
      best: 'Sunset glow around 16:00 to 16:30 in November; just after sunrise for a front-lit tower.',
      caveat: 'Narrow, busy pavements at rush hour; wires and fences in the foreground.',
      ref: { km: 3.1, brg: 300.7, app: 6.67 }
    },
    {
      id: 'modersohnbruecke', short: 'Modersohnbrücke', name: 'Modersohnbrücke, the quieter rail bridge',
      district: 'Friedrichshain', lat: 52.505007, lon: 13.4580589,
      station: 'S+U Warschauer Straße, about 600 m; S Ostkreuz, about 800 m', cost: 'free', hours: 'Public bridge, always open',
      what: 'The tower at the end of the long straight of tracks. A local sunset spot, quieter than Warschauer Brücke in winter.',
      best: 'Sunset; be there by 16:00 in November.',
      caveat: 'Walking distances are straight lines, so allow a few minutes more.',
      ref: { km: 3.7, brg: 298.1, app: 5.63 }
    },
    {
      id: 'elsenbruecke-molecule-man', short: 'Molecule Man', name: 'Elsenbrücke, Treptow end, past the Molecule Man',
      district: 'Treptow', lat: 52.4959, lon: 13.4628,
      station: 'S Treptower Park (Ring), about 250 m', cost: 'free', hours: 'Public bridge and riverbank, always open',
      what: 'Jonathan Borofsky’s Molecule Man stands in the Spree in front of you and the tower sits about 13 degrees to its right: water, sculpture and tower in one frame.',
      best: 'Sunset and blue hour, about 16:15 to 17:00 in November.',
      caveat: 'The bridge is being rebuilt and the footway layout changed in 2026; check which side is open. Right beside the sculpture the two do not line up.',
      ref: { km: 4.6, brg: 307.5, app: 4.62 }
    },
    {
      id: 'mont-klamott', short: 'Mont Klamott', name: 'Mont Klamott, Volkspark Friedrichshain',
      district: 'Friedrichshain', lat: 52.5263666, lon: 13.4321539,
      station: 'Tram M4 Am Friedrichshain, about 500 m', cost: 'free', hours: 'Public park, no fixed hours',
      what: 'A hill of war rubble over a blown-up flak tower, 78 m above sea level. The tower looks big from here, and in early November the sun sets almost right behind it.',
      best: 'Sunset; winter is better because the trees are bare.',
      caveat: 'The summit is wooded, so the view is a gap in the trees, not a panorama. Steep paths.',
      ref: { km: 1.7, brg: 248.1, app: 12.52 }
    },
    {
      id: 'mauerpark', short: 'Mauerpark', name: 'Mauerpark hill, above the amphitheatre',
      district: 'Prenzlauer Berg', lat: 52.5437161, lon: 13.4019327,
      station: 'U Bernauer Straße (U8) or U Eberswalder Straße (U2)', cost: 'free', hours: 'Open park',
      what: 'The tower to the south over the rooftops of Prenzlauer Berg and Mitte, seen from the former Wall strip.',
      best: 'Late afternoon, about 14:30 to 16:00 in November. Around 11:00 you look straight into the sun.',
      caveat: 'Sunday flea market crowds.',
      ref: { km: 2.6, brg: 168.8, app: 8.07 }
    },
    {
      id: 'tempelhofer-feld', short: 'Tempelhofer Feld', name: 'Tempelhofer Feld, on the old runways',
      district: 'Tempelhof', lat: 52.4744192, lon: 13.4026007,
      station: 'S+U Tempelhof (U6, Ring) or U Leinestraße (U8)', cost: 'free', hours: 'November 07:00 to 18:00, gates close',
      what: 'The tower 5 km north, small above the skyline, over an empty runway. The sun is always behind you here.',
      best: 'Any hour; warmest in the last hour before sunset.',
      caveat: 'At this distance haze can hide it.',
      ref: { km: 5.2, brg: 5.1, app: 4.06 }
    },
    {
      id: 'drachenberg', short: 'Drachenberg', name: 'Drachenberg, the free hill next to Teufelsberg',
      district: 'Grunewald', lat: 52.5023685, lon: 13.2482422,
      station: 'S Heerstraße (S3, S5, S9), about 1 km plus the climb', cost: 'free', hours: 'Open hill, no fixed hours',
      what: 'A bare summit with the whole skyline to the east: Funkturm, Potsdamer Platz and the tower 11 km away on the horizon.',
      best: 'Sunset behind you turns the skyline gold, then blue hour.',
      caveat: 'The tower is tiny from here; bring binoculars or a zoom. Muddy, unlit paths after dark.',
      ref: { km: 11.1, brg: 79.3, app: 1.9 }
    },
    {
      id: 'teufelsberg', short: 'Teufelsberg (paid)', name: 'Teufelsberg, the former listening station',
      district: 'Grunewald', lat: 52.4977183, lon: 13.2429543,
      station: 'S Heerstraße (S3, S5, S9), about 1.6 km, or S Grunewald', cost: 'paid',
      hours: 'November 11:00 to 17:00, last entry 16:00. Adults €12, reduced €10, under 18 €5, family €27, free up to age 7',
      what: 'The highest viewpoint in the west, with the tower 11.6 km east on the skyline. Drachenberg next door has the same view for free.',
      best: 'Enter by 16:00 in November and stay to closing.',
      caveat: 'The site can close at short notice for weather or filming.',
      ref: { km: 11.6, brg: 77.1, app: 1.82 }
    }
  ]
};
