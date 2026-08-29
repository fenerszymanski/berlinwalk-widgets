/* Berlin Last Entry Times — venue dataset.
   Every row was read from the venue's own site on 29 August 2026.
   open/close are minutes from midnight. cutoff = last moment you may enter.
   cutoffKind: 'published' (the venue prints a last-admission time),
               'closing'   (no published cutoff; the door is the closing time),
               'slot'      (timed-entry ticket decides it). */
window.BLET_DATA = {
  checkedOn: '29 August 2026',
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  venues: [
    {
      name: 'Berliner Dom',
      short: 'Dom',
      lat: 52.5191, lon: 13.4008,
      area: 'Museum Island',
      cutoffKind: 'published',
      cutoffRule: 'Last admission 60 minutes before closing',
      need: 90,
      note: 'The dome climb, the crypt and the galleries close one after another once the last-admission time passes, so a late ticket buys you a shorter building.',
      hours: {
        Mon: [540, 1080], Tue: [540, 1080], Wed: [540, 1080], Thu: [540, 1080],
        Fri: [540, 1080], Sat: [540, 1020], Sun: [720, 1020]
      },
      summer: {
        label: '1 June to 31 August',
        hours: { Mon: [540, 1140], Tue: [540, 1140], Wed: [540, 1140], Thu: [540, 1140], Fri: [540, 1140], Sat: [540, 1140], Sun: [720, 1140] }
      },
      gap: 60
    },
    {
      name: 'Neues Museum',
      short: 'Neues',
      lat: 52.5200, lon: 13.3977,
      area: 'Museum Island',
      cutoffKind: 'closing',
      cutoffRule: 'No published last admission',
      need: 120,
      note: 'Nefertiti is on the way out, not the way in. Arriving at 17:30 for an 18:00 close is technically allowed and practically pointless.',
      hours: { Mon: null, Tue: [600, 1080], Wed: [600, 1080], Thu: [600, 1080], Fri: [600, 1080], Sat: [600, 1080], Sun: [600, 1080] },
      gap: 0
    },
    {
      name: 'Altes Museum',
      short: 'Altes',
      lat: 52.5195, lon: 13.3983,
      area: 'Museum Island',
      cutoffKind: 'closing',
      cutoffRule: 'No published last admission',
      need: 75,
      note: 'Closes at 17:00 from Tuesday to Friday and 18:00 at the weekend. Same island, same ticket desk, one hour of difference.',
      hours: { Mon: null, Tue: [600, 1020], Wed: [600, 1020], Thu: [600, 1020], Fri: [600, 1020], Sat: [600, 1080], Sun: [600, 1080] },
      gap: 0
    },
    {
      name: 'Bode-Museum',
      short: 'Bode',
      lat: 52.5219, lon: 13.3947,
      area: 'Museum Island',
      cutoffKind: 'closing',
      cutoffRule: 'No published last admission',
      need: 75,
      note: 'The other 17:00 weekday closer. It sits at the far tip of the island, so a late arrival also costs you the walk.',
      hours: { Mon: null, Tue: [600, 1020], Wed: [600, 1020], Thu: [600, 1020], Fri: [600, 1020], Sat: [600, 1080], Sun: [600, 1080] },
      gap: 0
    },
    {
      name: 'Alte Nationalgalerie',
      short: 'Alte NG',
      lat: 52.5207, lon: 13.3979,
      area: 'Museum Island',
      cutoffKind: 'closing',
      cutoffRule: 'No published last admission',
      need: 75,
      note: 'Holds 18:00 all week, which makes it the reliable late choice on the island when the Altes and the Bode have already shut.',
      hours: { Mon: null, Tue: [600, 1080], Wed: [600, 1080], Thu: [600, 1080], Fri: [600, 1080], Sat: [600, 1080], Sun: [600, 1080] },
      gap: 0
    },
    {
      name: 'James-Simon-Galerie',
      short: 'James-Simon',
      lat: 52.5203, lon: 13.3968,
      area: 'Museum Island',
      cutoffKind: 'closing',
      cutoffRule: 'No published last admission',
      need: 30,
      note: 'The island entrance building. Useful late because you can use the terrace, the cafe and the toilets without committing to a collection.',
      hours: { Mon: null, Tue: [600, 1080], Wed: [600, 1080], Thu: [600, 1080], Fri: [600, 1080], Sat: [600, 1080], Sun: [600, 1080] },
      gap: 0
    },
    {
      name: 'Humboldt Forum',
      short: 'Humboldt',
      lat: 52.5172, lon: 13.4028,
      area: 'Schlossplatz',
      cutoffKind: 'closing',
      cutoffRule: 'No published last admission',
      need: 90,
      note: 'Closed on Tuesday, open on Monday. It is the one big central building that inverts the usual Berlin museum week.',
      hours: { Mon: [630, 1110], Tue: null, Wed: [630, 1110], Thu: [630, 1110], Fri: [630, 1110], Sat: [630, 1110], Sun: [630, 1110] },
      gap: 0
    },
    {
      name: 'Jewish Museum',
      short: 'Jewish Mus.',
      lat: 52.5024, lon: 13.3953,
      area: 'Kreuzberg',
      cutoffKind: 'published',
      cutoffRule: 'Last admission 17:00',
      need: 150,
      note: 'A published 17:00 cutoff against an 18:00 close, and the permanent exhibition genuinely wants two hours. Treat 16:00 as the honest last useful arrival.',
      hours: { Mon: null, Tue: [600, 1080], Wed: [600, 1080], Thu: [600, 1080], Fri: [600, 1080], Sat: [600, 1080], Sun: [600, 1080] },
      gap: 60
    },
    {
      name: 'Topography of Terror',
      short: 'Topography',
      lat: 52.5065, lon: 13.3832,
      area: 'Niederkirchnerstrasse',
      cutoffKind: 'closing',
      cutoffRule: 'Free entry, no ticket desk to beat',
      need: 60,
      note: 'Free and open to 20:00, with the outdoor trench exhibition running only until nightfall. In winter the outdoor half is dark long before the indoor half closes.',
      hours: { Mon: [600, 1200], Tue: [600, 1200], Wed: [600, 1200], Thu: [600, 1200], Fri: [600, 1200], Sat: [600, 1200], Sun: [600, 1200] },
      gap: 0
    },
    {
      name: 'Panoramapunkt',
      short: 'Panoramapunkt',
      lat: 52.5096, lon: 13.3760,
      area: 'Potsdamer Platz',
      cutoffKind: 'published',
      cutoffRule: 'Last lift up 18:30',
      need: 45,
      note: 'The fastest view in the city centre and the earliest to stop selling. If you want a high view after 18:30, you want the TV Tower instead.',
      hours: { Mon: [600, 1140], Tue: [600, 1140], Wed: [600, 1140], Thu: [600, 1140], Fri: [600, 1140], Sat: [600, 1140], Sun: [600, 1140] },
      gap: 30
    },
    {
      name: 'DDR Museum',
      short: 'DDR Mus.',
      lat: 52.5195, lon: 13.4022,
      area: 'Spree, opposite the Dom',
      cutoffKind: 'closing',
      cutoffRule: 'No published last admission',
      need: 75,
      note: 'Open 09:00 to 21:00 every day of the year, including the public holidays that close everything else. This is the reliable answer to a wasted afternoon.',
      hours: { Mon: [540, 1260], Tue: [540, 1260], Wed: [540, 1260], Thu: [540, 1260], Fri: [540, 1260], Sat: [540, 1260], Sun: [540, 1260] },
      gap: 0
    },
    {
      name: 'TV Tower',
      short: 'TV Tower',
      lat: 52.5208, lon: 13.4094,
      area: 'Alexanderplatz',
      cutoffKind: 'slot',
      cutoffRule: 'Timed slot, 15 minutes of grace',
      need: 60,
      note: 'Tickets are bound to a booked slot with fifteen minutes of grace, so the cutoff is whatever slot is still on sale rather than a printed time.',
      hours: { Mon: [540, 1380], Tue: [540, 1380], Wed: [540, 1380], Thu: [540, 1380], Fri: [540, 1380], Sat: [540, 1380], Sun: [540, 1380] },
      gap: 0
    },
    {
      name: 'Reichstag dome',
      short: 'Reichstag',
      lat: 52.5186, lon: 13.3761,
      area: 'Platz der Republik',
      cutoffKind: 'published',
      cutoffRule: 'Last admission 21:45, registration required',
      need: 60,
      note: 'The latest real sight in Berlin, but you cannot walk up to it. Register online, or get a confirmation at the service centre at least two hours before your slot.',
      hours: { Mon: [480, 1440], Tue: [480, 1440], Wed: [480, 1440], Thu: [480, 1440], Fri: [480, 1440], Sat: [480, 1440], Sun: [480, 1440] },
      gap: 135
    }
  ]
};
