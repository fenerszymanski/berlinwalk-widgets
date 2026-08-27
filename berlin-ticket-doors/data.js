/* berlin-ticket-doors — data
 * Every price and rule below was read from the venue's own website on
 * 23 August 2026 (Europe/Berlin). No third-party reseller price is stored
 * here on purpose: reseller pricing moves daily and would be stale at once.
 */
window.BW_TICKET_DOORS = {
  checkedOn: '23 August 2026',
  // A normal first-trip shortlist, so the board arrives with something on it.
  defaultPicks: ['brandenburg', 'stelae', 'eastside', 'reichstag', 'tvtower', 'museumsinsel'],
  doors: [
    {
      id: 'none',
      label: 'No ticket exists',
      note: 'Nobody sells these. Anything you are offered here is a guided tour of a place you can already walk into.'
    },
    {
      id: 'venue',
      label: 'Free, venue only',
      note: 'Free to enter, but the slot can only come from the building itself. No outside shop can issue it.'
    },
    {
      id: 'paid',
      label: 'Paid, venue sets the price',
      note: 'A real ticket with a real price. The venue shop is the number every other offer is measured against.'
    }
  ],
  sights: [
    { id: 'brandenburg', name: 'Brandenburg Gate', door: 'none', price: 0,
      line: 'An open square with a gate on it. No gate, no counter, no ticket.', domain: '' },
    { id: 'stelae', name: 'Holocaust Memorial', door: 'none', price: 0,
      line: 'Field of stelae open around the clock. Information Centre free, Tue to Sun 10:00 to 18:00.', domain: 'stiftung-denkmal.de' },
    { id: 'topography', name: 'Topography of Terror', door: 'none', price: 0,
      line: 'Free admission, daily 10:00 to 20:00. Outdoor trench walk until dusk.', domain: 'topographie.de' },
    { id: 'bernauer', name: 'Berlin Wall Memorial', door: 'none', price: 0,
      line: 'Free. Outdoor strip daily 08:00 to 22:00, indoor centres Tue to Sun 10:00 to 18:00.', domain: 'stiftung-berliner-mauer.de' },
    { id: 'eastside', name: 'East Side Gallery', door: 'none', price: 0,
      line: 'A painted wall along a public street. It has no opening time and no door.', domain: '' },
    { id: 'reichstag', name: 'Reichstag dome', door: 'venue', price: 0,
      line: 'Free, but the Bundestag needs every name and date of birth in advance, and original photo ID at the door.', domain: 'visite.bundestag.de' },
    { id: 'jmb', name: 'Jewish Museum', door: 'venue', price: 0,
      line: 'Core exhibition free for everyone. Book the time slot with the museum, Tue to Sun 10:00 to 18:00.', domain: 'tickets.jmberlin.de' },
    { id: 'tvtower', name: 'TV Tower', door: 'paid', price: 20,
      line: 'From 20 euros. The standard ticket skips the ticket desk queue, not the queue for the lift.', domain: 'tv-turm.de' },
    { id: 'dom', name: 'Berliner Dom', door: 'paid', price: 15,
      line: '15 euros, 12 reduced, 11 with a Berlin WelcomeCard. Audio guide and the dome walk included.', domain: 'shop.berlinerdom.de' },
    { id: 'ddr', name: 'DDR Museum', door: 'paid', price: 13.9,
      line: '13.90 euros, and the same 13.90 at the desk. Open daily until 21:00.', domain: 'ddr-museum.de' },
    { id: 'humboldt', name: 'Humboldt Forum', door: 'paid', price: 9,
      line: '9 euros for the exhibitions since October 2025, 3 for the roof terrace. Several floors still free. Closed Tuesday.', domain: 'humboldtforum.org' },
    { id: 'museumsinsel', name: 'Museum Island', door: 'paid', price: 24,
      line: '24 euros for the Museumsinsel-Ticket, one day, every house on the island. Under 18 free.', domain: 'shop.smb.museum' },
    { id: 'charlottenburg', name: 'Charlottenburg Palace', door: 'paid', price: 12,
      line: '12 euros for one palace wing, 19 for the Charlottenburg+ day ticket. A fixed entry time is part of the ticket.', domain: 'tickets.spsg.de' }
  ]
};
